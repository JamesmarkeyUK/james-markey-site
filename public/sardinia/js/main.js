/* ===================================================================
   Blue Sardinia — interactions
   =================================================================== */
(function () {
  'use strict';

  /* ---------- Sticky header state ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('.nav-links a').forEach((link) =>
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        const active = p.id === target;
        p.classList.toggle('is-active', active);
        p.hidden = !active;
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Booking form ---------- */
  const form = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    // prevent past dates
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date();
      const iso = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
      dateInput.min = iso;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Front-end demo: no backend wired up. Confirm to the guest.
      success.classList.add('show');
      form.querySelector('button[type="submit"]').textContent = 'Request Sent ✓';
      form.querySelectorAll('input, select, textarea, button').forEach((el) => {
        if (el.type !== 'submit') el.setAttribute('readonly', 'readonly');
      });
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Graceful image fallback ----------
     If a hotlinked photo fails to load, remove it cleanly rather than show a
     broken-image icon: gallery tiles drop out (the grid reflows), while
     hero/feature photos fall back to the Mediterranean gradient. */
  const handleBrokenImage = (img) => {
    const figure = img.closest('figure');
    if (figure) {
      figure.remove();
      return;
    }
    img.style.display = 'none';
    if (img.parentElement) img.parentElement.classList.add('img-fallback');
  };
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) handleBrokenImage(img);
    else img.addEventListener('error', () => handleBrokenImage(img));
  });

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
