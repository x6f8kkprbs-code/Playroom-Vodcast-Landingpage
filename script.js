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
