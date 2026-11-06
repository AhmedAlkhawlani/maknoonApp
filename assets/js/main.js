/* مَكْنُون — portal interactions (no dependencies) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var flat = /[?&](flat|preview)\b/.test(location.search);
  if (flat) document.documentElement.style.scrollBehavior = 'auto';

  /* --- header state --- */
  var onScroll = function () {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- mobile menu --- */
  if (burger && links) {
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* --- reveal on scroll --- */
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce || flat) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 40, 160) + 'ms';
      io.observe(el);
    });
  }

  /* --- active nav link --- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('#apps, #mods, #principles, #faq')
  );
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* --- year --- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
