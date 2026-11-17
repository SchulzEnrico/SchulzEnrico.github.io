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
