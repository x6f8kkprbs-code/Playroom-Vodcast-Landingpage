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

  /* ─── Referenzen-Slider ───
     Ein Case: keine Bedienelemente. Ab zwei Cases: Pfeile + Pfeiltasten,
     kein Autoplay, reduzierte Bewegung wird respektiert. */
  const refSlider = document.querySelector('[data-ref-slider]');
  if (refSlider) {
    const refTrack = refSlider.querySelector('[data-ref-track]');
    const refCases = refTrack ? refTrack.querySelectorAll('[data-ref-case]') : [];
    const refControls = refSlider.querySelector('[data-ref-controls]');

    if (refTrack && refControls && refCases.length > 1) {
      refControls.hidden = false;
      const prevBtn = refControls.querySelector('[data-ref-prev]');
      const nextBtn = refControls.querySelector('[data-ref-next]');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let refIndex = 0;

      function updateRefArrows() {
        prevBtn.setAttribute('aria-disabled', String(refIndex === 0));
        nextBtn.setAttribute('aria-disabled', String(refIndex === refCases.length - 1));
      }

      // Eigene rAF-Animation: scrollTo({behavior:'smooth'}) startet in Chromium
      // auf Snap-Containern teils gar nicht. Reduced Motion springt direkt.
      let refAnimFrame = null;
      let refAnimFallback = null;
      function scrollTrackTo(target) {
        if (refAnimFrame) cancelAnimationFrame(refAnimFrame);
        if (refAnimFallback) clearTimeout(refAnimFallback);
        if (reducedMotion.matches) { refTrack.scrollLeft = target; return; }
        const start = refTrack.scrollLeft;
        const distance = target - start;
        const duration = 450;
        const t0 = performance.now();
        function tick(now) {
          const t = Math.min(1, (now - t0) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          refTrack.scrollLeft = start + distance * eased;
          refAnimFrame = t < 1 ? requestAnimationFrame(tick) : null;
        }
        refAnimFrame = requestAnimationFrame(tick);
        // Falls keine Frames laufen (verdeckter Tab): direkt ans Ziel springen
        refAnimFallback = setTimeout(() => {
          if (refAnimFrame) {
            cancelAnimationFrame(refAnimFrame);
            refAnimFrame = null;
            refTrack.scrollLeft = target;
          }
        }, duration + 150);
      }

      function goToRefCase(index) {
        refIndex = Math.max(0, Math.min(index, refCases.length - 1));
        scrollTrackTo(refCases[refIndex].offsetLeft);
        updateRefArrows();
      }

      prevBtn.addEventListener('click', () => goToRefCase(refIndex - 1));
      nextBtn.addEventListener('click', () => goToRefCase(refIndex + 1));

      refTrack.setAttribute('tabindex', '0');
      refTrack.setAttribute('role', 'group');
      refTrack.setAttribute('aria-label', 'Referenzen, wechseln mit den Pfeiltasten');
      refTrack.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goToRefCase(refIndex - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goToRefCase(refIndex + 1); }
      });

      // Index nachziehen, wenn per Touch/Trackpad gewischt wird
      refTrack.addEventListener('scroll', () => {
        if (refAnimFrame) return; // eigene Animation läuft, Index stimmt schon
        const step = refCases[1].offsetLeft - refCases[0].offsetLeft;
        const nearest = Math.round(refTrack.scrollLeft / step);
        if (nearest !== refIndex && nearest >= 0 && nearest < refCases.length) {
          refIndex = nearest;
          updateRefArrows();
        }
      }, { passive: true });

      updateRefArrows();
    }
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

  // "Projekt anfragen" öffnet künftig den Anfrage-Bot (versteckter #bot-open Trigger).
  // Ist der Bot nicht geladen, Fallback auf das klassische Formular.
  const botOpenTrigger = document.getElementById('bot-open');
  document.querySelectorAll('.open-contact-form').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      if (botOpenTrigger) {
        botOpenTrigger.click();      // öffnet das Bot-Overlay
      } else {
        openContactModal(e);          // Fallback: altes Formular, falls Bot nicht geladen
      }
    });
  });

  // Callback, den der Bot für "Zum Kontaktformular" aufruft: öffnet das klassische Modal.
  window.ANFRAGE_BOT_ON_CLASSIC = function () {
    openContactModal();
  };

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

// ════════════════════════════════════════
// CUSTOM CURSOR — Play-Dreieck (nur Desktop/Maus)
// Wie auf playroom-studios.com: folgt der Maus 1:1 ohne Lag
// (direkt im mousemove platziert). Touch: deaktiviert.
// ════════════════════════════════════════
(function () {
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!fine.matches) return;

  var cursor = document.getElementById('prCursor');
  if (!cursor) return;

  var hoverSel = 'a, button, input, textarea, select, label, summary, [onclick], [role="button"]';

  var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  var active = false;

  function place(x, y) {
    cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }

  // Cursor-Färbung positionsbasiert bestimmen — robust gegen Scrollen bei
  // stehender Maus. Orange-Statement → weiß, Paper-Sektion → orange, Rest dunkel (weiß).
  function updateTone() {
    var el = document.elementFromPoint(tx, ty);
    var sec = el && el.closest ? el.closest('section') : null;
    cursor.classList.toggle('cursor--on-orange', !!(sec && sec.classList.contains('statement-section')));
    cursor.classList.toggle('cursor--on-light', !!(sec && sec.classList.contains('section--paper')));
  }

  document.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) {
      active = true;
      cursor.classList.add('is-active');
    }
    // Direkt, kein Lag — folgt der Maus 1:1 wie der native Cursor.
    place(tx, ty);
    var t = e.target && e.target.closest ? e.target.closest(hoverSel) : null;
    cursor.classList.toggle('is-hover', !!t);
    updateTone();
  }, { passive: true });

  // Bei stehender Maus und Scroll wechselt die Sektion unter dem Cursor — neu färben.
  window.addEventListener('scroll', updateTone, { passive: true });

  document.addEventListener('mouseleave', function () { cursor.classList.remove('is-active'); });
  document.addEventListener('mouseenter', function () { if (active) cursor.classList.add('is-active'); });
})();
