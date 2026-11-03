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
      // The last section is shorter than the viewport, so its top can never reach
      // the offset: when the page is scrolled to the bottom, it is the active one.
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) currentId = spySections[spySections.length - 1].id;
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


  // Hero carousel
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const slides = [...carousel.querySelectorAll('.hero-slide')];
    const dots = [...carousel.querySelectorAll('.hero-dots button')];
    let current = 0;
    let timer = null;

    const show = (i) => {
      current = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        s.classList.toggle('is-active', n === current);
        s.tabIndex = n === current ? 0 : -1;
      });
      dots.forEach((d, n) => d.classList.toggle('is-active', n === current));
    };

    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stop();
      timer = setInterval(() => show(current + 1), 5000);
    };

    dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);
    show(0);
    start();
  }
});
