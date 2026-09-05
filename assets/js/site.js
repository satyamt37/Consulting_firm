/* ==========================================================================
   STRATIQ CLOUD — site behaviour
   Nav · accordion · tabs · reveal · counters · back-to-top · EmailJS forms
   No dependencies except the EmailJS browser SDK (loaded on form pages).
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.STRATIQ || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------ NAV */
  function initNav() {
    var burger = $(".burger");
    var drawer = $(".drawer");
    if (!burger || !drawer) return;

    function setOpen(open) {
      document.body.classList.toggle("nav-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
    }

    burger.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });

    $$(".drawer a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) setOpen(false);
    });

    // Close the drawer if the viewport grows into desktop layout
    var mq = window.matchMedia("(min-width:1120px)");
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);

    setOpen(false);
  }

  /* ------------------------------------------------------------ ACCORDION */
  function initAccordions() {
    $$(".acc").forEach(function (acc) {
      var items = $$(".acc__item", acc);
      items.forEach(function (item) {
        var btn   = $(".acc__btn", item);
        var panel = $(".acc__panel", item);
        if (!btn || !panel) return;

        function close(it) {
          var p = $(".acc__panel", it), b = $(".acc__btn", it);
          if (!p || !it.classList.contains("is-open")) return;
          p.style.height = p.scrollHeight + "px";
          void p.offsetHeight;
          p.style.height = "0px";
          it.classList.remove("is-open");
          b.setAttribute("aria-expanded", "false");
        }

        btn.addEventListener("click", function () {
          var isOpen = item.classList.contains("is-open");
          if (acc.dataset.single !== "false") items.forEach(function (o) { if (o !== item) close(o); });

          if (isOpen) {
            close(item);
          } else {
            item.classList.add("is-open");
            btn.setAttribute("aria-expanded", "true");
            panel.style.height = panel.scrollHeight + "px";
            var done = function () {
              panel.style.height = "auto";
              panel.removeEventListener("transitionend", done);
            };
            panel.addEventListener("transitionend", done);
          }
        });

        // keep an open panel correct on resize
        window.addEventListener("resize", function () {
          if (item.classList.contains("is-open")) panel.style.height = "auto";
        });
      });

      // open the one marked as default
      var first = $(".acc__item[data-open]", acc);
      if (first) $(".acc__btn", first).click();
    });
  }

  /* ----------------------------------------------------------------- TABS */
  function initTabs() {
    $$(".tabs").forEach(function (tabs) {
      var btns   = $$(".tabs__btn", tabs);
      var panels = $$(".tabs__panel", tabs);
      if (!btns.length) return;

      function select(i) {
        btns.forEach(function (b, n) {
          b.setAttribute("aria-selected", n === i ? "true" : "false");
          b.tabIndex = n === i ? 0 : -1;
        });
        panels.forEach(function (p, n) { p.hidden = n !== i; });
      }

      btns.forEach(function (b, i) {
        b.addEventListener("click", function () { select(i); });
        b.addEventListener("keydown", function (e) {
          var n = null;
          if (e.key === "ArrowRight") n = (i + 1) % btns.length;
          if (e.key === "ArrowLeft")  n = (i - 1 + btns.length) % btns.length;
          if (n !== null) { e.preventDefault(); select(n); btns[n].focus(); }
        });
      });

      select(0);
    });
  }

  /* --------------------------------------------------------------- REVEAL */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var delay = parseInt(el.dataset.delay || "0", 10);
        setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------- COUNTERS */
  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el     = en.target;
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || "";
        var prefix = el.dataset.prefix || "";
        var dec    = (el.dataset.dec | 0);
        var start  = performance.now();
        var dur    = 1300;

        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + (target * e).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------- BACK TO TOP */
  function initToTop() {
    var btn = $(".totop");
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle("is-on", window.scrollY > 700); };
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      if (window.stratiqLenis) window.stratiqLenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll();
  }

  /* ------------------------------------------------------------ MISC BITS */
  function initMisc() {
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // Highlight the nav entry for the page we're on
    var here = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__link[href],.drawer__link[href],.mega__item[href]").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop().split("#")[0].toLowerCase();
      if (href && href === here) a.setAttribute("aria-current", "page");
    });

    // Reflect the real header height into the layout variable (announce bar etc.)
    var header = $(".header");
    if (header) {
      var setH = function () {
        document.documentElement.style.setProperty("--head-h", header.offsetHeight + "px");
      };
      setH();
      window.addEventListener("resize", setH);
    }
  }

  /* =================================================================
     FORMS — delivered through EmailJS
     ================================================================= */

  var SDK = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  var sdkPromise = null;

  function loadSDK() {
    if (window.emailjs) return Promise.resolve(window.emailjs);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = SDK;
      s.async = true;
      s.onload = function () { window.emailjs ? resolve(window.emailjs) : reject(new Error("sdk")); };
      s.onerror = function () { reject(new Error("network")); };
      document.head.appendChild(s);
    });
    return sdkPromise;
  }

  function isConfigured() {
    var e = (CFG.emailjs || {});
    return ["publicKey", "serviceId", "templateId"].every(function (k) {
      var v = e[k];
      return typeof v === "string" && v.length > 6 && v.indexOf("YOUR_") !== 0;
    });
  }

  function labelFor(field) {
    var f = field.closest(".field");
    var l = f && f.querySelector("label");
    if (!l) return field.name;
    return l.textContent.replace("*", "").trim();
  }

  function collect(form) {
    var data  = {};
    var lines = [];
    $$("input,select,textarea", form).forEach(function (el) {
      if (!el.name || el.classList.contains("hp-input")) return;
      if (el.type === "checkbox") {
        data[el.name] = el.checked ? "Yes" : "No";
      } else {
        data[el.name] = (el.value || "").trim();
      }
      if (el.type !== "checkbox" && data[el.name]) {
        lines.push(labelFor(el) + ": " + data[el.name]);
      }
    });
    return { data: data, lines: lines };
  }

  function validate(form) {
    var ok = true;
    var firstBad = null;

    $$("input,select,textarea", form).forEach(function (el) {
      var wrap = el.closest(".field") || el.closest(".check");
      if (!wrap) return;
      var bad = false;

      if (el.required) {
        if (el.type === "checkbox") bad = !el.checked;
        else bad = !(el.value || "").trim();
      }
      if (!bad && el.type === "email" && el.value) {
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
      }
      if (!bad && el.name === "phone" && el.value) {
        bad = (el.value.replace(/[^\d]/g, "").length < 7);
      }

      wrap.classList.toggle("is-invalid", bad);
      if (bad) { ok = false; if (!firstBad) firstBad = el; }
    });

    if (firstBad) {
      firstBad.focus({ preventScroll: true });
      if (window.stratiqScrollTo) window.stratiqScrollTo(firstBad.closest(".field") || firstBad);
      else firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return ok;
  }

  function status(box, kind, html) {
    if (!box) return;
    box.className = "form__status is-on form__status--" + kind;
    box.innerHTML = html;
    box.setAttribute("role", kind === "err" ? "alert" : "status");
  }

  function mailtoFallback(form, payload) {
    var inbox   = CFG.inbox || "satyamt37@gmail.com";
    var subject = payload.subject || "Website enquiry";
    var body    = payload.lines.join("\n") +
                  "\n\n--\nSent from " + window.location.href;
    return "mailto:" + inbox +
           "?subject=" + encodeURIComponent(subject) +
           "&body=" + encodeURIComponent(body);
  }

  /* Pre-select the engagement dropdown from ?intent=… on a deep link
     (e.g. contact.html?intent=job-support arrives with "Job support" chosen). */
  function applyIntent() {
    var intent;
    try { intent = new URLSearchParams(window.location.search).get("intent"); }
    catch (e) { return; }
    if (!intent) return;

    $$("select option[data-intent]").forEach(function (opt) {
      if (opt.dataset.intent !== intent) return;
      var sel = opt.closest("select");
      sel.value = opt.value || opt.textContent;
      var msg = $("#c-message") || $("textarea", sel.form);
      if (msg && !msg.value) msg.focus({ preventScroll: true });
    });
  }

  function initForms() {
    applyIntent();

    $$("form[data-emailjs]").forEach(function (form) {
      var btn      = $("[type=submit]", form);
      var box      = $(".form__status", form);
      var btnLabel = btn ? btn.innerHTML : "";

      form.setAttribute("novalidate", "novalidate");

      // clear the invalid state as soon as the visitor fixes it
      $$("input,select,textarea", form).forEach(function (el) {
        var ev = (el.tagName === "SELECT" || el.type === "checkbox") ? "change" : "input";
        el.addEventListener(ev, function () {
          var wrap = el.closest(".field") || el.closest(".check");
          if (wrap) wrap.classList.remove("is-invalid");
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // honeypot — silently accept and drop bot submissions
        var hp = $(".hp-input", form);
        if (hp && hp.value) { form.reset(); return; }

        if (!validate(form)) {
          status(box, "err", "Please fill in the highlighted fields so we can get back to you.");
          return;
        }

        var got     = collect(form);
        var kind    = form.dataset.formName || "Website enquiry";
        var subject = kind + " — " + (got.data.name || got.data.from_name || "New enquiry");

        var params = {
          form_type    : kind,
          subject      : subject,
          to_email     : CFG.inbox || "satyamt37@gmail.com",
          from_name    : got.data.name || "Website visitor",
          reply_to     : got.data.email || "",
          from_email   : got.data.email || "",
          phone        : got.data.phone || "—",
          company      : got.data.company || "—",
          country      : got.data.country || "—",
          service      : got.data.service || "—",
          engagement   : got.data.engagement || "—",
          budget       : got.data.budget || "—",
          timeline     : got.data.timeline || "—",
          role         : got.data.role || "—",
          message      : got.data.message || "—",
          details      : got.lines.join("\n"),
          page_url     : window.location.href,
          submitted_at : new Date().toLocaleString()
        };

        // ---- not configured yet → mailto so the lead still reaches the inbox
        if (!isConfigured()) {
          status(box, "info",
            "Opening your email app so this reaches us right away. " +
            "If nothing opens, email <a href=\"mailto:" + (CFG.inbox || "") + "\">" +
            (CFG.inbox || "") + "</a> directly.");
          window.location.href = mailtoFallback(form, { subject: subject, lines: got.lines });
          return;
        }

        // ---- send through EmailJS
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<span class="spin" aria-hidden="true"></span> Sending…';
        }
        status(box, "info", "Sending your message…");

        loadSDK()
          .then(function (ejs) {
            return ejs.send(
              CFG.emailjs.serviceId,
              CFG.emailjs.templateId,
              params,
              { publicKey: CFG.emailjs.publicKey }
            );
          })
          .then(function () {
            form.reset();
            status(box, "ok",
              "<strong>Thank you — your message is on its way.</strong><br>" +
              "A consultant from our team will reply within one business day. " +
              "For anything urgent, call us on +1 (469) 913-0142.");
            if (window.dataLayer) window.dataLayer.push({ event: "form_submit", form: kind });
          })
          .catch(function (err) {
            var href = mailtoFallback(form, { subject: subject, lines: got.lines });
            status(box, "err",
              "<strong>We couldn't send that automatically.</strong><br>" +
              "Please <a href=\"" + href + "\">click here to send it by email</a> " +
              "or write to <a href=\"mailto:" + (CFG.inbox || "") + "\">" + (CFG.inbox || "") +
              "</a> — we read every message.");
            if (window.console) console.warn("EmailJS:", err);
          })
          .then(function () {
            if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; }
          });
      });
    });
  }

  /* ----------------------------------------------------------------- BOOT */
  function boot() {
    initNav();
    initAccordions();
    initTabs();
    initReveal();
    initCounters();
    initToTop();
    initMisc();
    initForms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
