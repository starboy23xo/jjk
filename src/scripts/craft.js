/* CRAFT STUDIO — interactions. No dependencies. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Header stuck state ---------- */
  var hdr = $('.hdr');
  if (hdr) {
    var onScroll = function () {
      hdr.setAttribute('data-stuck', window.scrollY > 8 ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  var burger = $('.burger');
  var drawer = $('.drawer');
  if (burger && drawer) {
    var setDrawer = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('data-open', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.documentElement.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    setDrawer(false);
    burger.addEventListener('click', function () {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setDrawer(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 940 && burger.getAttribute('aria-expanded') === 'true') setDrawer(false);
    });
  }

  /* ---------- Seamless marquee ---------- */
  $$('.marquee').forEach(function (m) {
    var track = $('.marquee__track', m);
    if (!track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
  });

  /* ---------- SVG line-draw lengths ---------- */
  $$('.drawn, .journey__line path, .journey__line line, .journey__line circle').forEach(function (p) {
    try {
      var len = Math.ceil(p.getTotalLength ? p.getTotalLength() : 0);
      if (len) p.style.setProperty('--len', len);
    } catch (err) { /* non-measurable node */ }
  });

  /* ---------- Reveal on scroll ---------- */
  var targets = $$('[data-reveal], [data-inview]');
  if (!('IntersectionObserver' in window) || reduce) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    targets.forEach(function (el) { io.observe(el); });

    // Safety net: anything sitting inside the observer's bottom margin at the
    // very end of the page can never satisfy it — reveal those on arrival.
    // The listeners remove themselves once every target has revealed, so
    // scrolling on a fully-revealed page costs nothing after that point.
    var flushTail = function () {
      if (window.innerHeight + window.scrollY < document.body.scrollHeight - 2) return;
      targets.forEach(function (el) {
        if (!el.classList.contains('is-in')) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
      window.removeEventListener('scroll', flushTail);
      window.removeEventListener('resize', flushTail);
    };
    window.addEventListener('scroll', flushTail, { passive: true });
    window.addEventListener('resize', flushTail, { passive: true });
    flushTail();
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq__q').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.setAttribute('data-open', String(!open));
    });
  });

  /* ---------- Contact form → WhatsApp / email ---------- */
  var form = $('#project-form');
  if (form) {
    var status = $('#form-status');
    var WA = form.getAttribute('data-whatsapp');
    var MAIL = form.getAttribute('data-email');

    // Preselect the service when arriving from a service CTA (?service=...)
    try {
      var wanted = new URLSearchParams(window.location.search).get('service');
      var select = $('#f-service', form);
      if (wanted && select) {
        var match = $$('option', select).filter(function (o) {
          return o.textContent.trim().toLowerCase() === wanted.trim().toLowerCase();
        })[0];
        if (match) select.value = match.value || match.textContent;
      }
    } catch (err) { /* no URLSearchParams support */ }

    var invalid = function (field, on) {
      var wrap = field.closest('.field');
      if (wrap) wrap.setAttribute('data-invalid', on ? 'true' : 'false');
      field.setAttribute('aria-invalid', on ? 'true' : 'false');
    };

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea') && e.target.value.trim()) invalid(e.target, false);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = $$('[required]', form);
      var firstBad = null;
      required.forEach(function (f) {
        var ok = f.value.trim() !== '' && (!f.checkValidity || f.checkValidity());
        invalid(f, !ok);
        if (!ok && !firstBad) firstBad = f;
      });
      if (firstBad) {
        firstBad.focus();
        status.textContent = 'A couple of fields still need filling in.';
        status.setAttribute('data-show', 'true');
        return;
      }

      var data = new FormData(form);
      var val = function (k) { return String(data.get(k) || '').trim(); };
      var lines = [
        'New project enquiry — Craft Studio',
        '',
        'Name: ' + val('name'),
        'Help with: ' + val('service'),
        'Contact: ' + val('contact'),
        '',
        'The idea:',
        val('message')
      ];
      var body = lines.join('\n');

      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(body), '_blank', 'noopener');

      var mailHref =
        'mailto:' + MAIL +
        '?subject=' + encodeURIComponent('New project enquiry — ' + (val('name') || 'Craft Studio')) +
        '&body=' + encodeURIComponent(body);

      status.innerHTML =
        'Thanks — WhatsApp should be opening with your sketch attached. ' +
        'If it did not, <a href="' + mailHref + '">send it by email instead</a>.';
      status.setAttribute('data-show', 'true');
      status.focus();
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
