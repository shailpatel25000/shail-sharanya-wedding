/* Renders the site from window.WEDDING. Hash routes: "" / #home -> home, #<eventId> -> event page.
   Also: platform-aware directions links, art fallback, and the theming-mode preview switch. */
(function () {
  "use strict";
  var W = window.WEDDING;
  var root = document.getElementById("app");
  var MODES = [
    { id: "neutral", label: "Home neutral, event pages themed", hint: "Landing page stays clean; each event page takes its painting's palette." },
    { id: "shift",   label: "Whole site shifts per event",       hint: "Event cards on the home page become colour bands; event pages themed." },
    { id: "card",    label: "Paintings as card art only",        hint: "One fixed palette everywhere; the watercolour is just the image." },
  ];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function isIOS() {
    var ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function dayNum(iso) { return iso.slice(8, 10); }
  function monShort(iso) { return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+iso.slice(5, 7) - 1]; }
  function paletteStyle(ev) {
    var p = ev.palette || ev;
    return "--ev-bg:" + p.bg + ";--ev-fg:" + p.fg + ";--ev-accent:" + p.accent + ";--ev-accent2:" + p.accent2 + ";--ev-soft:" + p.soft +
      (ev.wash ? ";--ev-wash:url('" + ev.wash + "')" : "");
  }
  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ICON_BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';

  /* ---------- directions: one QR, one site, native maps on both platforms ---------- */
  function mapLinks(v) {
    var hasCoords = typeof v.lat === "number" && typeof v.lng === "number";
    var q = encodeURIComponent((v.name || "") + (v.address ? ", " + v.address : ""));
    var google = hasCoords
      ? "https://www.google.com/maps/dir/?api=1&destination=" + v.lat + "," + v.lng
      : (v.mapsLink || null);
    var apple = hasCoords
      ? "https://maps.apple.com/?daddr=" + v.lat + "," + v.lng + "&q=" + encodeURIComponent(v.name || "")
      : (v.mapsLink ? "https://maps.apple.com/?q=" + q : null);
    return { google: google, apple: apple, ready: !!(google || apple) };
  }
  function directionsButtons(v, primaryClass) {
    var L = mapLinks(v);
    if (!L.ready) {
      return '<a class="btn ' + primaryClass + '" aria-disabled="true">' + ICON_PIN + 'Location coming soon</a>';
    }
    if (isIOS()) {
      return (L.apple ? '<a class="btn ' + primaryClass + '" href="' + esc(L.apple) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Apple Maps</a>' : "") +
             (L.google ? '<a class="btn s" href="' + esc(L.google) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Google Maps</a>' : "");
    }
    return '<a class="btn ' + primaryClass + '" href="' + esc(L.google || L.apple) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Directions</a>';
  }

  /* ---------- art with fallback ---------- */
  function artHTML(ev, cls) {
    return '<div class="' + cls + '" style="' + paletteStyle(ev) + '">' +
      '<img src="' + esc(ev.art) + '" alt="' + esc(ev.name) + ' watercolour" data-ph="' + esc(ev.name) + '">' +
    '</div>';
  }
  function wireArtFallbacks(scope) {
    var imgs = scope.querySelectorAll("img[data-ph]");
    Array.prototype.forEach.call(imgs, function (img) {
      function fallback() {
        var ph = document.createElement("div");
        ph.className = "ph";
        ph.innerHTML = "<span>" + esc(img.getAttribute("data-ph")) + " watercolour goes here</span>";
        img.replaceWith(ph);
      }
      if (img.complete && img.naturalWidth === 0) fallback();
      else img.addEventListener("error", fallback, { once: true });
    });
  }

  /* ---------- views ---------- */
  function renderHome() {
    var evs = W.events;
    var days = {};
    evs.forEach(function (e) {
      (days[e.dateISO] = days[e.dateISO] || { label: e.dayLabel, items: [] });
      if (e.flow && e.flow.length > 1) {
        e.flow.forEach(function (f, i) {
          days[e.dateISO].items.push({ t: f.t, title: f.title, note: f.note, ev: e, first: i === 0 });
        });
      } else {
        days[e.dateISO].items.push({ t: e.start, title: e.name, note: e.venue.name, ev: e, first: true });
      }
    });

    var html = '<main class="wrap">' +
      '<header class="hero">' +
        '<p class="eyebrow">' + esc(W.dateLine) + '</p>' +
        '<h1 class="display">' + esc(W.couple.a) + ' <span class="amp">&amp;</span> ' + esc(W.couple.b) + '</h1>' +
        '<p class="dates">Two days in ' + esc(W.city) + '</p>' +
        '<p class="lead">' + esc(W.invite) + '</p>' +
      '</header>' +

      '<section class="events" aria-labelledby="ev-title">' +
        '<h2 class="sec-title" id="ev-title">Events</h2>' +
        '<div class="ev-list">' +
          evs.map(function (e) {
            return '<article class="ev" style="' + paletteStyle(e) + '">' +
              '<div class="num tnum">' + dayNum(e.dateISO) + '<small>' + esc(e.dayLabel.split(",")[0].slice(0, 3)) + ' ' + monShort(e.dateISO) + '</small></div>' +
              '<h3 class="name">' + esc(e.name) + '</h3>' +
              '<p class="time tnum">' + esc(e.start) + ' to ' + esc(e.end) + '</p>' +
              '<p class="venue">' + esc(e.venue.name) + (e.venue.address ? ', ' + esc(e.venue.address) : '') + '</p>' +
              artHTML(e, "thumb") +
              '<div class="btns"><a class="btn p" href="#' + e.id + '">Event details</a>' + directionsButtons(e.venue, "s") + '</div>' +
            '</article>';
          }).join("") +
        '</div>' +
      '</section>' +

      '<section class="flow-sec" aria-labelledby="flow-title">' +
        '<h2 class="sec-title" id="flow-title">Flow of the two days</h2>' +
        Object.keys(days).sort().map(function (iso) {
          var d = days[iso];
          return '<div class="day"><h3>' + esc(d.label) + '</h3><div class="tl">' +
            d.items.map(function (it) {
              return '<span class="t tnum">' + esc(it.t) + '</span>' +
                '<span class="d">' + (it.first ? '<a href="#' + it.ev.id + '">' + esc(it.ev.name) + '</a>' + (it.title !== it.ev.name ? ' · ' + esc(it.title) : '') : esc(it.title)) +
                (it.note ? '<small>' + esc(it.note) + '</small>' : '') + '</span>';
            }).join("") +
          '</div></div>';
        }).join("") +
      '</section>' +

      '<footer>' +
        '<p class="eyebrow">Questions</p>' +
        '<ul class="contacts">' +
          (W.contact || []).map(function (c) { return '<li><b>' + esc(c.name) + '</b>' + (c.phone ? ' · <span class="tnum">' + esc(c.phone) + '</span>' : ' · number to be added') + '</li>'; }).join("") +
        '</ul>' +
      '</footer>' +
    '</main>';
    root.className = "";
    root.innerHTML = html;
    document.title = W.couple.a + " & " + W.couple.b + " · " + W.dateLine;
  }

  function renderEvent(e) {
    var html = '<div class="evpage themed" style="' + paletteStyle(e) + '"><main class="wrap">' +
      '<a class="back" href="#home">' + ICON_BACK + 'All events</a>' +
      artHTML(e, "art") +
      '<header class="evhead">' +
        '<p class="eyebrow">' + esc(e.dayLabel) + '</p>' +
        '<h1 class="display">' + esc(e.name) + '</h1>' +
        '<p class="when tnum">' + esc(e.start) + ' to ' + esc(e.end) + ' <span>· ' + esc(e.venue.name) + '</span></p>' +
      '</header>' +

      '<section class="block" aria-labelledby="v-title">' +
        '<h2 class="sec-title" id="v-title">Getting there</h2>' +
        '<p class="venue-name">' + esc(e.venue.name) + '</p>' +
        '<p class="venue-addr">' + esc(e.venue.address) + '</p>' +
        '<div class="btns">' + directionsButtons(e.venue, "p") + '</div>' +
        (isIOS() && mapLinks(e.venue).ready ? '<p class="note">Opens in the app you choose.</p>' : '') +
      '</section>' +

      (e.dress ? '<section class="block"><h2 class="sec-title">Dress code</h2><p class="dress">' + esc(e.dress) + '</p></section>' : '') +

      (e.about ? '<section class="block about"><h2 class="sec-title">About</h2><p>' + esc(e.about) + '</p></section>' : '') +

      '<section class="block" aria-labelledby="f-title">' +
        '<h2 class="sec-title" id="f-title">Flow of the event</h2>' +
        '<div class="tl">' + e.flow.map(function (f) {
          return '<span class="t tnum">' + esc(f.t) + '</span><span class="d">' + esc(f.title) + (f.note ? '<small>' + esc(f.note) + '</small>' : '') + '</span>';
        }).join("") + '</div>' +
      '</section>' +
    '</main></div>';
    root.className = "";
    root.innerHTML = html;
    document.title = e.name + " · " + W.couple.a + " & " + W.couple.b;
  }

  function route() {
    var id = (location.hash || "").replace(/^#\/?/, "");
    var ev = null;
    for (var i = 0; i < W.events.length; i++) if (W.events[i].id === id) ev = W.events[i];
    if (ev) renderEvent(ev); else renderHome();
    wireArtFallbacks(root);
    window.scrollTo(0, 0);
  }

  /* ---------- theming-mode preview switch (remove .devtool before launch) ---------- */
  function getMode() {
    var m = "neutral";
    try { m = localStorage.getItem("wedding-mode") || m; } catch (e) {}
    return MODES.some(function (x) { return x.id === m; }) ? m : "neutral";
  }
  function setMode(m) {
    document.documentElement.setAttribute("data-mode", m);
    try { localStorage.setItem("wedding-mode", m); } catch (e) {}
    var tool = document.querySelector(".devtool");
    if (tool) {
      tool.querySelector(".cur").textContent = "Theme preview: " + MODES.filter(function (x) { return x.id === m; })[0].label;
      Array.prototype.forEach.call(tool.querySelectorAll(".menu button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
    }
  }
  function buildDevtool() {
    var d = document.createElement("div");
    d.className = "devtool";
    d.innerHTML = '<div class="menu" role="group" aria-label="Theming mode">' +
      MODES.map(function (m) { return '<button type="button" data-mode="' + m.id + '" aria-pressed="false">' + esc(m.label) + '<small>' + esc(m.hint) + '</small></button>'; }).join("") +
      '</div><button type="button" class="cur" aria-expanded="false"></button>';
    document.body.appendChild(d);
    d.querySelector(".cur").addEventListener("click", function () { d.classList.toggle("open"); this.setAttribute("aria-expanded", String(d.classList.contains("open"))); });
    Array.prototype.forEach.call(d.querySelectorAll(".menu button"), function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); d.classList.remove("open"); });
    });
  }

  buildDevtool();
  setMode(getMode());
  window.addEventListener("hashchange", route);
  route();
})();
