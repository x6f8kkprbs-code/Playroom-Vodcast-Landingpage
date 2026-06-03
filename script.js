/* ══════════════════════════════════════════════
   Playroom Studios – script.js
   ══════════════════════════════════════════════ */

// Bei Reload immer nach oben scrollen
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Scroll Reveal ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.reveal-element').forEach(el => {
    revealObserver.observe(el);
  });

  /* ─── Navigation Scroll ─── */
  const nav = document.querySelector('.nav');
  let lastScrollY = 0;

  /* ─── Hero Parallax ─── */
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.querySelector('.hero');
  const heroHeight = heroSection ? heroSection.offsetHeight : 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Parallax — only while hero is visible
    if (scrollY < heroHeight) {
      const bgShift = scrollY * 0.35;
      const contentShift = scrollY * 0.15;
      const contentFade = 1 - scrollY / (heroHeight * 0.7);
      if (heroBg) heroBg.style.transform = 'translate3d(0,' + bgShift + 'px,0)';
      if (heroContent) {
        heroContent.style.transform = 'translate3d(0,-' + contentShift + 'px,0)';
        heroContent.style.opacity = Math.max(0, contentFade);
      }
    }

    lastScrollY = scrollY;
  }, { passive: true });

  /* ─── Active Nav Link (scroll-based) ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-top-link)');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ─── Mobile Navigation ─── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── FAQ Accordion ─── */
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      const answer = item.querySelector('.faq-answer');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ─── Cookie Banner & Video ─── */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieDecline = document.querySelector('.cookie-decline');
  const videoPlaceholder = document.querySelector('.video-placeholder');

  function hasConsent() {
    return localStorage.getItem('playroom_cookie_consent') === 'accepted';
  }

  // Wurde überhaupt schon entschieden (accepted ODER declined)?
  function hasConsentDecision() {
    return localStorage.getItem('playroom_cookie_consent') !== null;
  }

  // Defensiv: garantiert, dass kein Overlay (Cookie/Modal) mehr Blur trägt
  // oder den Scroll sperrt, wenn nichts offen sein soll.
  function clearOverlays() {
    document.body.style.overflow = '';
    if (cookieBanner && !cookieBanner.classList.contains('show')) {
      cookieBanner.setAttribute('hidden', '');
    }
    const modal = document.getElementById('contactModal');
    if (modal && !modal.classList.contains('open')) {
      modal.setAttribute('hidden', '');
    }
  }

  // Cookie-Banner einblenden (Pre-CSS-hidden entfernen, dann Fade)
  function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.removeAttribute('hidden');
    void cookieBanner.offsetWidth; // Reflow erzwingen, damit der Fade läuft
    cookieBanner.classList.add('show');
  }

  // Cookie-Banner komplett entfernen: erst Fade, dann display:none via [hidden]
  // -> der backdrop-filter::before verschwindet aus dem Compositor.
  function dismissCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('show');
    setTimeout(() => {
      cookieBanner.setAttribute('hidden', '');
      clearOverlays();
    }, 520);
  }

  const videoOverlay = document.querySelector('.video-play-overlay');

  function loadVideo() {
    const wrapper = document.querySelector('.video-wrapper');
    if (!wrapper || wrapper.querySelector('iframe')) return;
    const src = wrapper.getAttribute('data-video-src');
    if (!src) return;

    const placeholder = wrapper.querySelector('.video-placeholder');
    if (placeholder) placeholder.remove();

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', 'Playroom Studios – Videopodcast Produktion');
    wrapper.appendChild(iframe);

    // Start in blurred autoplay state
    wrapper.classList.add('autoplaying');
  }

  function unmuteVideo() {
    const wrapper = document.querySelector('.video-wrapper');
    if (!wrapper) return;
    const iframe = wrapper.querySelector('iframe');
    if (!iframe) return;

    wrapper.classList.remove('autoplaying');
    wrapper.classList.add('playing');

    // Restart from beginning via Vimeo postMessage API
    iframe.contentWindow.postMessage(JSON.stringify({
      method: 'seekTo',
      value: 0
    }), '*');

    // Unmute via Vimeo postMessage API
    iframe.contentWindow.postMessage(JSON.stringify({
      method: 'setVolume',
      value: 1
    }), '*');
  }

  // Beim Load zuerst Consent prüfen.
  // Entscheidung bereits getroffen (accepted ODER declined) -> Banner/Blur GAR NICHT zeigen.
  if (hasConsentDecision()) {
    clearOverlays();
    if (hasConsent()) loadVideo();
  } else if (cookieBanner) {
    setTimeout(showCookieBanner, 1500);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('playroom_cookie_consent', 'accepted');
      dismissCookieBanner();
      loadVideo();
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('playroom_cookie_consent', 'declined');
      dismissCookieBanner();
    });
  }

  // Play overlay: unmute + remove blur, or trigger consent
  if (videoOverlay) {
    videoOverlay.addEventListener('click', () => {
      if (hasConsent()) {
        const wrapper = document.querySelector('.video-wrapper');
        if (wrapper && wrapper.querySelector('iframe')) {
          unmuteVideo();
        } else {
          loadVideo();
        }
      } else if (cookieBanner) {
        showCookieBanner();
      }
    });
  }

  // Placeholder click triggers consent flow
  if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', () => {
      if (hasConsent()) {
        loadVideo();
      } else if (cookieBanner) {
        showCookieBanner();
      }
    });
  }

  /* ─── Cookie Settings Link ─── */
  const cookieSettingsLink = document.querySelector('.cookie-settings-link');
  if (cookieSettingsLink && cookieBanner) {
    cookieSettingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      showCookieBanner();
    });
  }

  /* ─── Impressum Link ─── */
  const impressumLink = document.querySelector('.impressum-link');
  if (impressumLink) {
    impressumLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Impressum:\n\nPlayroom Studios GmbH\nHanauer Landstraße 287\n60314 Frankfurt am Main\n\nGeschäftsführer: Raul Geisler\nRegistergericht: Amtsgericht Frankfurt am Main\nHandelsregister: HRB 97897\nUSt-IdNr.: DE292445528\n\nKontakt:\nTelefon: +49.69.4080.6100\nE-Mail: hello@playroom-studios.com\n\nVerantwortlich für den Inhalt nach § 55 Abs. 2 RStV:\nRaul Geisler');
    });
  }

  /* ─── Contact Form Modal ─── */
  const contactModal = document.getElementById('contactModal');
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  function openContactModal(e) {
    if (e) e.preventDefault();
    if (contactModal) {
      contactModal.removeAttribute('hidden');
      void contactModal.offsetWidth; // Reflow, damit der Fade läuft
      contactModal.classList.add('open');
      contactModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeContactModal() {
    if (contactModal) {
      contactModal.classList.remove('open');
      contactModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Nach dem Fade vollständig aus dem Render-Tree (kein liegender Blur)
      setTimeout(() => {
        if (!contactModal.classList.contains('open')) {
          contactModal.setAttribute('hidden', '');
        }
      }, 450);
    }
  }

  document.querySelectorAll('.open-contact-form').forEach(btn => {
    btn.addEventListener('click', openContactModal);
  });

  if (contactModal) {
    contactModal.querySelector('.contact-modal-overlay').addEventListener('click', closeContactModal);
    contactModal.querySelector('.contact-modal-close').addEventListener('click', closeContactModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactModal.classList.contains('open')) {
        closeContactModal();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (typeof gtag === "function") {
          gtag('event', 'lead', {
            event_category: 'contact',
            event_label: 'project_request'
          });
        }
        contactForm.style.display = 'none';
        contactModal.querySelector('.contact-modal-header').style.display = 'none';
        contactSuccess.style.display = 'block';
        setTimeout(closeContactModal, 3000);
        setTimeout(() => {
          contactForm.reset();
          contactForm.style.display = '';
          contactModal.querySelector('.contact-modal-header').style.display = '';
          contactSuccess.style.display = 'none';
        }, 3500);
      }).catch(() => {
        window.location.href = 'mailto:hello@playroom-studios.com?subject=Podcast%20Projekt%20Anfrage';
      });
    });
  }

  /* ─── Smooth scroll for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
