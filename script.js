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
  const navLinksContainer = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
      document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    });

    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
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

  // Show cookie banner if no consent yet
  if (!hasConsent() && cookieBanner) {
    setTimeout(() => cookieBanner.classList.add('show'), 1500);
  } else if (hasConsent()) {
    loadVideo();
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('playroom_cookie_consent', 'accepted');
      cookieBanner.classList.remove('show');
      loadVideo();
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('playroom_cookie_consent', 'declined');
      cookieBanner.classList.remove('show');
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
        cookieBanner.classList.add('show');
      }
    });
  }

  // Placeholder click triggers consent flow
  if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', () => {
      if (hasConsent()) {
        loadVideo();
      } else if (cookieBanner) {
        cookieBanner.classList.add('show');
      }
    });
  }

  /* ─── Cookie Settings Link ─── */
  const cookieSettingsLink = document.querySelector('.cookie-settings-link');
  if (cookieSettingsLink && cookieBanner) {
    cookieSettingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      cookieBanner.classList.add('show');
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
    e.preventDefault();
    if (contactModal) {
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
