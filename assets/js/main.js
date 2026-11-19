// Kopfleiste, aktiver Abschnitt, Einblenden und Wasser-Effekt auf dem Deckblatt
(function () {
  // echte Lichtbrechung nur in Chromium-Browsern (Safari/Firefox nutzen klares Glas ohne Brechung)
  var ua = navigator.userAgent;
  if (/Chrome\//.test(ua)) document.documentElement.classList.add('lens');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Einblenden beim Scrollen
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });

    // aktiven Abschnitt in der Navigation markieren
    var links = document.querySelectorAll('.nav a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Wasser-Effekt (jQuery Ripples, MIT-Lizenz) – auf dem Deckblatt, nur mit Maus und ohne "Bewegung reduzieren"
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine) and (min-width: 641px)').matches;
  if (reduceMotion || !finePointer || !window.jQuery || !jQuery.fn.ripples) return;
  var $cover = jQuery('.cover');
  try {
    $cover.ripples({ resolution: 768, dropRadius: 22, perturbance: 0.03, interactive: true });
  } catch (err) { return; }

  // gelegentlich ein Tropfen von selbst
  setInterval(function () {
    if (document.hidden || window.scrollY > window.innerHeight) return;
    var w = $cover.outerWidth(), h = $cover.outerHeight();
    $cover.ripples('drop', Math.random() * w, Math.random() * h, 22, 0.03 + Math.random() * 0.03);
  }, 2400);
})();

// Stationen-Treppe: eine Stufe ist geöffnet (Start: die neueste)
(function () {
  var stairs = document.querySelector('.stairs');
  if (!stairs) return;
  var heads = Array.prototype.slice.call(stairs.querySelectorAll('.step-head'));
  stairs.classList.add('stairs-on');
  var desktop = window.matchMedia('(min-width: 901px)');

  function open(idx) {
    heads.forEach(function (h, i) {
      var on = i === idx;
      h.setAttribute('aria-expanded', on ? 'true' : 'false');
      document.getElementById(h.getAttribute('aria-controls')).hidden = !on;
    });
    stairs.style.setProperty('--a', idx);
  }
  heads.forEach(function (h, i) {
    h.addEventListener('click', function () {
      var isOpen = h.getAttribute('aria-expanded') === 'true';
      if (isOpen && !desktop.matches) {          // Handy: zuklappen erlaubt
        h.setAttribute('aria-expanded', 'false');
        document.getElementById(h.getAttribute('aria-controls')).hidden = true;
      } else if (!isOpen) { open(i); }
    });
  });
  open(heads.length - 1);

  // Handy/Tablet: neueste Station oben (DOM-Reihenfolge, damit Tastatur und Screenreader passen)
  var steps = Array.prototype.slice.call(stairs.querySelectorAll(':scope > .step'));
  function arrange() {
    var list = desktop.matches ? steps : steps.slice().reverse();
    list.forEach(function (li) { stairs.appendChild(li); });
  }
  arrange();
  if (desktop.addEventListener) desktop.addEventListener('change', arrange);
  else if (desktop.addListener) desktop.addListener(arrange);
})();

// E-Mail-Adresse erst im Browser zusammensetzen (Schutz vor Adress-Sammlern)
(function () {
  document.querySelectorAll('.js-mail').forEach(function (a) {
    var subj = a.getAttribute('data-s');
    a.href = 'mailto:' + a.getAttribute('data-u') + '@' + a.getAttribute('data-d') +
      (subj ? '?subject=' + encodeURIComponent(subj) : '');
  });
})();

// Skills: zuerst das Wichtigste, der Rest lässt sich aufklappen (ohne JavaScript ist alles offen)
(function () {
  document.querySelectorAll('.skill-toggle').forEach(function (btn) {
    var more = document.getElementById(btn.getAttribute('aria-controls'));
    if (!more) return;
    var text = btn.querySelector('.st-text'), count = btn.querySelector('.st-count');
    function set(open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.hidden = !open;
      text.textContent = open ? btn.getAttribute('data-less') : btn.getAttribute('data-more');
      count.textContent = open ? '' : '+' + btn.getAttribute('data-count');
    }
    set(false);
    btn.hidden = false;
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  });
})();

// Vollbild-Menü: Dialog mit Fokus im Menü, Escape schließt, Fokus zurück auf den Knopf
(function () {
  var dlg = document.getElementById('menu');
  var btn = document.querySelector('.burger');
  if (!dlg || !btn || typeof dlg.showModal !== 'function') return;   // ohne Dialog-Unterstützung bleibt die normale Navigation
  btn.hidden = false;
  var root = document.documentElement;
  root.classList.add('has-fm');            // Kopfleiste: nur noch Menü-Knopf statt Textnavigation
  var target = null;

  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var a4 = vw >= 700 && vh >= 560;
    dlg.classList.toggle('fm-a4', a4);
    if (a4) {
      var s = Math.min((vh - 32) / 1123, (vw - 160) / 794, 1);
      dlg.style.setProperty('--s', s.toFixed(4));
      // Bedienleiste mind. 90 % groß – aber nie so groß, dass sie den Profil-Block berührt
      var ns = Math.max(s, 0.9);
      var nav = dlg.querySelector('.fm-nav'), prof = dlg.querySelector('.fm-r-profil');
      if (nav && prof) {
        var frameH = 1123 * s, profBottom = (prof.offsetTop + prof.offsetHeight) * s;
        var avail = frameH - 18 * s - profBottom - 14;
        ns = Math.max(s, Math.min(ns, avail / nav.offsetHeight));
      }
      dlg.style.setProperty('--ns', ns.toFixed(4));
    }
  }
  // aktuellen Seitenabschnitt im Menü hervorheben (wie beim Hover)
  function markCurrent() {
    var ids = ['start', 'profil', 'stationen', 'skills', 'weiterbildung', 'kontakt'], cur = 'start';
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = id;
    });
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4) cur = 'kontakt';
    dlg.querySelectorAll('.is-current').forEach(function (el) { el.classList.remove('is-current'); });
    dlg.querySelectorAll('[aria-current="location"]').forEach(function (el) { el.removeAttribute('aria-current'); });
    dlg.querySelectorAll('a[href="#' + cur + '"]').forEach(function (a) {
      if (!a.closest('.fm-nav')) return;   // nur die Bedienleiste zeigt den aktuellen Abschnitt; Schlagzeilen nur beim Hover
      a.classList.add('is-current');
      if (a.classList.contains('fm-pill') || a.classList.contains('fm-home')) a.setAttribute('aria-current', 'location');
    });
  }
  function open() {
    markCurrent();
    fit();
    target = null;
    dlg.showModal();
    fit();                                   // nach dem Öffnen messen (Größen erst jetzt bekannt)
    root.classList.add('fm-open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', btn.getAttribute('data-close'));
    var first = dlg.querySelector('.fm-nav .is-current') || dlg.querySelector('.fm-pill');
    if (first) first.focus();
    dlg.scrollTop = 0;
  }
  btn.addEventListener('click', open);
  dlg.querySelector('.fm-close').addEventListener('click', function () { dlg.close(); });
  window.addEventListener('resize', function () { if (dlg.open) fit(); });

  dlg.addEventListener('close', function () {
    root.classList.remove('fm-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', btn.getAttribute('data-open'));
    if (target) {
      var el = document.getElementById(target);
      if (el) {
        var head = el.querySelector('.step-head');                    // Sprung auf eine Station öffnet sie
        if (head && head.getAttribute('aria-expanded') !== 'true') head.click();
        var to = head || el;                                          // Stufen haben am Computer kein eigenes Layout
        if (to === el && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        if (head) window.scrollTo({ top: to.getBoundingClientRect().top + window.scrollY - 100 });
        else to.scrollIntoView();
        to.focus({ preventScroll: true });
        if (history.pushState) history.pushState(null, '', '#' + target);
      }
      target = null;
    } else {
      btn.focus();
    }
  });

  // Tab bleibt im Menü (von hinten nach vorn und umgekehrt)
  dlg.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(dlg.querySelectorAll('a[href], button'), function (el) { return el.tabIndex >= 0 && el.getClientRects().length > 0; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Links innerhalb der Seite schließen das Menü und springen zum Abschnitt
  dlg.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      target = a.getAttribute('href').slice(1);
      dlg.close();
    });
  });
})();
