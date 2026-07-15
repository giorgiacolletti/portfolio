// Giorgia Colletti — Portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky navbar blur on scroll
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 12) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for in-page anchor links (click-triggered only)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Scroll-spy: underline the nav link for whichever section we've scrolled into.
  // Uses live offsetTop comparisons (not IntersectionObserver) so it keeps working
  // regardless of section height or images shifting layout after load.
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const spySections = Array.from(new Set(navAnchors.map((a) => a.getAttribute('href').slice(1))))
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (spySections.length) {
    const navOffset = 120;

    const updateActiveNav = () => {
      const scrollPos = window.scrollY + navOffset;
      let currentId = null;
      let maxTop = -Infinity;
      spySections.forEach((section) => {
        if (section.offsetTop <= scrollPos && section.offsetTop > maxTop) {
          maxTop = section.offsetTop;
          currentId = section.id;
        }
      });
      navAnchors.forEach((a) => {
        a.classList.toggle('is-active', currentId !== null && a.getAttribute('href') === `#${currentId}`);
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
    updateActiveNav();
  }

  // Scroll-reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Contact form — no backend wired yet, this is a placeholder handler
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      formNote.textContent = 'This form isn’t connected to anything yet — hook it up to Formspree/EmailJS/a serverless endpoint to actually receive messages.';
      formNote.style.color = 'var(--color-primary-dark)';
      formNote.style.fontWeight = '600';
    });
  }
});
