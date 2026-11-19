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
      if (isOpen) {                              // zuklappen erlaubt (seit 19.11.2026 auch am Computer)
        h.setAttribute('aria-expanded', 'false');
        document.getElementById(h.getAttribute('aria-controls')).hidden = true;
      } else if (!isOpen) { open(i); }
    });
  });
  // 19.11.2026: beim Laden ist keine Stufe offen – nur ein direkter Link (#aktuell, #sh-…, #sb-…) öffnet die passende Station
  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (!el || !stairs.contains(el)) return;
    var step = el.closest('.step');
    var head = step && step.querySelector('.step-head');
    var i = heads.indexOf(head);
    if (i >= 0 && head.getAttribute('aria-expanded') !== 'true') open(i);
  }
  heads.forEach(function (h) {               // alle Stufen geschlossen (ohne JavaScript bleibt alles offen)
    h.setAttribute('aria-expanded', 'false');
    document.getElementById(h.getAttribute('aria-controls')).hidden = true;
  });
  fromHash();
  window.addEventListener('hashchange', fromHash);

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
    var subj = a.getAttribute('data-s'), body = a.getAttribute('data-b'), q = [];
    if (subj) q.push('subject=' + encodeURIComponent(subj));
    if (body) q.push('body=' + encodeURIComponent(body));
    a.href = 'mailto:' + a.getAttribute('data-u') + '@' + a.getAttribute('data-d') + (q.length ? '?' + q.join('&') : '');
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
    centerAkt(a4);
  }
  // 19.11.2026: am Handy steht „Aktuelles“ mittig zwischen „Enrico Schulz“ und der Menüleiste
  function centerAkt(a4) {
    var akt = dlg.querySelector('.fm-r-akt'), name = dlg.querySelector('.fm-name'), nav = dlg.querySelector('.fm-nav');
    if (!akt || !name || !nav) return;
    akt.style.marginTop = '';
    if (a4 || !dlg.open) return;
    function diff(m) {                         // Abstand oben minus Abstand unten bei Rand m
      akt.style.marginTop = m + 'px';
      var nb = name.getBoundingClientRect().bottom, nt = nav.getBoundingClientRect().top, ab = akt.getBoundingClientRect();
      return (ab.top - nb) - (nt - ab.bottom);
    }
    var lo = 20, hi = 600;                     // schrittweise eingrenzen (die Menüleiste kann sich mit dem Inhalt verschieben)
    if (diff(lo) >= 0) { akt.style.marginTop = lo + 'px'; return; }
    for (var k = 0; k < 14; k++) { var mid = (lo + hi) / 2; if (diff(mid) < 0) lo = mid; else hi = mid; }
    akt.style.marginTop = Math.round(lo) + 'px';
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
    requestAnimationFrame(function () { fit(); });   // nach dem ersten Zeichnen noch einmal ausrichten
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
        var head = el.classList.contains('step') ? el.querySelector('.step-head') : null;   // nur ein Sprung auf eine Station öffnet sie
        if (head && head.getAttribute('aria-expanded') !== 'true') head.click();
        var to = head || el;                                          // Stufen haben am Computer kein eigenes Layout
        if (to === el && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        if (head) window.scrollTo({ top: (window.esAbsTop ? window.esAbsTop(to) : to.getBoundingClientRect().top + window.scrollY) - (window.esJumpOffset ? window.esJumpOffset() : 100) });
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

// 19.11.2026 (abends): PDF-Auswahl auf Touch-Geräten (iPhone): Ansehen im selben Tab (Zurück funktioniert), Teilen, Herunterladen
(function () {
  var touch = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  var links = document.querySelectorAll('a[href$=".pdf"]');
  if (!touch || !links.length) return;
  var en = (document.documentElement.lang || '').indexOf('en') === 0;
  var T = en
    ? { view: 'View', share: 'Share', save: 'Download', close: 'Close', hint: 'Opens in this tab – swipe from the left edge to come back.', copied: 'Link copied', doc: 'Document' }
    : { view: 'Ansehen', share: 'Teilen', save: 'Herunterladen', close: 'Schließen', hint: 'Öffnet in diesem Tab – zurück zur Seite: vom linken Rand wischen.', copied: 'Link kopiert', doc: 'Dokument' };
  var ico = {
    view: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    share: '<path d="M12 3v12"/><path d="M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
    save: '<path d="M12 4v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M5 19h14"/>'
  };
  function btn(cls, key, tag) {
    var el = document.createElement(tag || 'button');
    if (!tag) el.type = 'button';
    el.className = 'ds-btn ' + cls;
    el.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24">' + ico[key] + '</svg><span>' + T[key] + '</span>';
    return el;
  }
  var dlg = document.createElement('dialog');
  dlg.className = 'ds';
  dlg.setAttribute('aria-labelledby', 'ds-title');
  dlg.innerHTML = '<p class="ds-k">' + T.doc + ' · PDF</p><h2 id="ds-title" class="ds-title"></h2>';
  var bView = btn('ds-view', 'view', 'a'), bShare = btn('ds-share', 'share'), bSave = btn('ds-save', 'save', 'a');
  var row = document.createElement('div'); row.className = 'ds-row';
  row.appendChild(bView); row.appendChild(bShare); row.appendChild(bSave);
  var hint = document.createElement('p'); hint.className = 'ds-hint'; hint.textContent = T.hint;
  var status = document.createElement('p'); status.className = 'ds-status'; status.setAttribute('role', 'status');
  var bClose = document.createElement('button'); bClose.type = 'button'; bClose.className = 'ds-close'; bClose.textContent = T.close;
  dlg.appendChild(row); dlg.appendChild(hint); dlg.appendChild(status); dlg.appendChild(bClose);
  document.body.appendChild(dlg);
  if (typeof dlg.showModal !== 'function') { dlg.remove(); return; }

  var cur = null, file = null;
  function name(a) {
    var f = a.getAttribute('href');
    if (/Lebenslauf/.test(f)) return en ? 'CV – Enrico Schulz' : 'Lebenslauf – Enrico Schulz';
    if (/Profil/.test(f)) return en ? 'Profile – Enrico Schulz' : 'Profil – Enrico Schulz';
    var h = a.querySelector('h3, .k');
    if (h) return h.textContent.trim();
    var t = (a.textContent || '').replace(/\(PDF[^)]*\)/, '').trim();
    return t || decodeURIComponent(a.getAttribute('href').split('/').pop());
  }
  function openFor(a) {
    var href = a.href, fn = decodeURIComponent(href.split('/').pop());
    cur = { href: href, fn: fn, title: name(a), opener: a };
    dlg.querySelector('.ds-title').textContent = cur.title;
    bView.href = href;
    bSave.href = href; bSave.setAttribute('download', fn);
    status.textContent = '';
    file = null;
    // Datei vorab laden, damit „Teilen“ sie ohne Wartezeit übergeben kann (iOS verlangt eine direkte Nutzeraktion)
    if (window.fetch && window.File) {
      fetch(href).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
        if (b && cur && cur.href === href) file = new File([b], fn, { type: 'application/pdf' });
      }).catch(function () {});
    }
    dlg.showModal();
    bView.focus();
  }
  links.forEach(function (a) {
    a.setAttribute('aria-haspopup', 'dialog');
    a.addEventListener('click', function (e) { e.preventDefault(); openFor(a); });
  });
  bShare.addEventListener('click', function () {
    if (!cur) return;
    var data = { title: cur.title, url: cur.href };
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) data = { title: cur.title, files: [file] };
    if (navigator.share) {
      navigator.share(data).catch(function (err) {
        if (err && err.name === 'AbortError') return;
        if (data.files) navigator.share({ title: cur.title, url: cur.href }).catch(function () {});
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(cur.href).then(function () { status.textContent = T.copied; });
    }
  });
  bClose.addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   // Tippen neben das Fenster schließt
  dlg.addEventListener('close', function () { if (cur && cur.opener && cur.opener.isConnected) cur.opener.focus({ preventScroll: true }); });
})();

// 19.11.2026 (abends): Sprungziele ausrichten – die Abschnittsüberschrift steht nach einem Sprung knapp unter Kopfleiste und Logo
(function () {
  var root = document.documentElement;
  function offset() {
    var bar = document.querySelector('.topbar'), logo = document.querySelector('.brand-mark');
    var bottom = 0;
    [bar, logo].forEach(function (el) { if (el) bottom = Math.max(bottom, el.getBoundingClientRect().bottom); });
    return Math.round(bottom + (window.innerWidth > 900 ? 28 : 22));
  }
  window.esJumpOffset = offset;
  // Lage auf der Seite ohne Einblend-Verschiebung (transform) messen
  function absTop(el) { var y = 0; while (el) { y += el.offsetTop; el = el.offsetParent; } return y; }
  window.esAbsTop = absTop;
  function apply() {
    var pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0, off = offset();
    document.querySelectorAll('section[id]').forEach(function (sec) {
      if (sec.id === 'start') return;
      var inner = parseFloat(getComputedStyle(sec).paddingTop) || 0;   // Überschrift steht direkt am oberen Innenabstand
      sec.style.scrollMarginTop = Math.round(off - inner - pad) + 'px';
    });
    var akt = document.getElementById('aktuell');
    if (akt) akt.style.scrollMarginTop = Math.round(off - pad) + 'px';
  }
  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('load', function () {
    apply();
    jumpHash();
  });
  // Stationen haben am Computer kein eigenes Layout (display: contents) → zum Kopf der Station springen
  function jumpHash() {
    var t = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!t) return;
    var head = t.classList.contains('step') ? t.querySelector('.step-head') : null;
    if (head) window.scrollTo({ top: absTop(head) - offset(), behavior: 'auto' });
    else t.scrollIntoView();
  }
  window.addEventListener('hashchange', function () { setTimeout(jumpHash, 0); });
})();
