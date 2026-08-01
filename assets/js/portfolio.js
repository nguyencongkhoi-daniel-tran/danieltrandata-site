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

  /* ---------- BUILD GALLERY LIGHTBOX ----------
     The gallery links point straight at the full images, so
     everything works with no JS. This upgrades them in place. */
  var galleries = document.querySelectorAll('[data-gallery]');

  galleries.forEach(function (gal) {
    var links = Array.prototype.slice.call(gal.querySelectorAll('a'));
    if (!links.length) return;

    var lb = null, lbImg = null, lbCount = null, current = 0, lastFocus = null;

    function build() {
      lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Image viewer');
      lb.hidden = true;
      lb.innerHTML =
        '<img alt="" />' +
        '<button type="button" class="lb-btn lb-prev" aria-label="Previous image"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>' +
        '<button type="button" class="lb-btn lb-next" aria-label="Next image"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>' +
        '<button type="button" class="lb-btn lb-close" aria-label="Close viewer"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<span class="lb-count" aria-hidden="true"></span>';
      document.body.appendChild(lb);
      lbImg = lb.querySelector('img');
      lbCount = lb.querySelector('.lb-count');

      lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
      lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
      lb.querySelector('.lb-close').addEventListener('click', close);
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

      lb.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'ArrowLeft') { show(current - 1); return; }
        if (e.key === 'ArrowRight') { show(current + 1); return; }
        if (e.key === 'Tab') {
          // Keep focus inside the dialog.
          var f = lb.querySelectorAll('button');
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }

    function show(i) {
      current = (i + links.length) % links.length;
      var link = links[current];
      lbImg.src = link.getAttribute('href');
      lbImg.alt = link.querySelector('img').alt;
      lbCount.textContent = (current + 1) + ' / ' + links.length;
    }

    function open(i) {
      if (!lb) build();
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open(i);
      });
    });
  });

  /* ---------- FOOTER YEAR ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
