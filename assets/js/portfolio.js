/* =============================================================
   Daniel Tran — Portfolio
   No dependencies. The page is fully readable even if this
   script never runs. Handles the mobile menu and footer year.
   ============================================================= */
(function () {
  'use strict';

  /* ---------- MOBILE NAV ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        burger.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeNav();
    });
  }

  /* ---------- BACK TO TOP ----------
     The anchor works on its own; this only shows/hides it and
     guarantees an exact scroll to 0 (scroll-padding offsets #top). */
  var toTop = document.getElementById('toTop');

  if (toTop) {
    var SHOW_AFTER = 600;
    var ticking = false;

    function syncToTop() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      toTop.classList.toggle('show', y > SHOW_AFTER);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(syncToTop);
    }, { passive: true });

    syncToTop();

    toTop.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

      // Move focus so keyboard users land at the top, not where they were.
      var anchor = document.getElementById('top');
      if (anchor) anchor.focus({ preventScroll: true });
    });
  }

  /* ---------- FOOTER YEAR ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
