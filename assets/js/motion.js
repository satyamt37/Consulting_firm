/* ==========================================================================
   STRATIQ CLOUD — motion layer
   Smooth inertial scrolling, scroll progress, parallax, cursor spotlight,
   staggered reveals and header state. Everything degrades to plain scrolling
   if the library is blocked or the visitor prefers reduced motion.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var coarse  = window.matchMedia("(hover:none)").matches;

  var lenis = null;

  /* --------------------------------------------------- SMOOTH SCROLL */
  function initSmooth() {
    if (reduced || typeof window.Lenis !== "function") return;

    lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      syncTouch: false,          // native momentum on touch devices — feels better
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      infinite: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.stratiqLenis = lenis;
  }

  /* Route in-page anchors through Lenis so they glide instead of jumping. */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a) return;

      var href = a.getAttribute("href") || "";
      var hash = href.indexOf("#") === 0 ? href : null;
      if (!hash && href.indexOf("#") > 0) {
        // same-page link written as page.html#id
        var file = href.split("#")[0].split("/").pop().toLowerCase();
        var here = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
        if (file === here) hash = "#" + href.split("#")[1];
      }
      if (!hash || hash === "#") return;

      var target;
      try { target = document.querySelector(hash); } catch (err) { return; }
      if (!target) return;

      e.preventDefault();
      scrollToEl(target);
      history.pushState(null, "", hash);
      // move keyboard focus for accessibility
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  function headerOffset() {
    var h = $(".header");
    return (h ? h.offsetHeight : 72) + 18;
  }

  function scrollToEl(el, opts) {
    var offset = -headerOffset();
    if (lenis) {
      lenis.scrollTo(el, { offset: offset, duration: (opts && opts.duration) || 1.1 });
    } else {
      var y = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    }
  }
  window.stratiqScrollTo = scrollToEl;

  /* ------------------------------------------------- SCROLL PROGRESS */
  function initProgress() {
    var bar = $(".progress__bar");
    if (!bar) return;
    var tick = function () {
      var de = document.documentElement;
      var max = de.scrollHeight - de.clientHeight;
      var pct = max > 0 ? (window.pageYOffset / max) * 100 : 0;
      bar.style.width = Math.max(0, Math.min(100, pct)) + "%";
    };
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    tick();
  }

  /* -------------------------------------------------- HEADER STATE */
  function initHeaderState() {
    var tick = function () {
      document.body.classList.toggle("scrolled", window.pageYOffset > 24);
    };
    window.addEventListener("scroll", tick, { passive: true });
    tick();
  }

  /* ------------------------------------------------------ PARALLAX */
  function initParallax() {
    if (reduced) return;
    var els = $$("[data-par]");
    if (!els.length) return;

    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.dataset.par) || 0.12;
        // -1 … 1 across the viewport
        var mid = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--py", (-mid * speed * 100).toFixed(2) + "px");
      });
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ------------------------------------------------- CURSOR SPOTLIGHT */
  function initSpotlight() {
    if (coarse || reduced) return;
    $$(".spot").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ------------------------------------------------ STAGGERED REVEAL */
  function initReveal2() {
    var els = $$("[data-reveal]");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    // auto-stagger siblings that share a parent
    var groups = new Map();
    els.forEach(function (el) {
      if (el.style.getPropertyValue("--i")) return;
      var p = el.parentElement;
      if (!groups.has(p)) groups.set(p, 0);
      var n = groups.get(p);
      if (n < 8) el.style.setProperty("--i", n);
      groups.set(p, n + 1);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- IMAGES */
  /* If a photo fails to load, drop it so the branded gradient shows through
     instead of a broken-image icon. */
  function initImageFallback() {
    $$(".media img, .photo-bg img, .hero__photo img").forEach(function (img) {
      img.addEventListener("error", function () {
        img.style.display = "none";
        var w = img.closest(".media,.photo-bg,.hero__photo");
        if (w) w.classList.add("media--noimg");
      });
    });
  }

  /* ----------------------------------------------------------- BOOT */
  function boot() {
    initSmooth();
    initAnchors();
    initProgress();
    initHeaderState();
    initParallax();
    initSpotlight();
    initReveal2();
    initImageFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
