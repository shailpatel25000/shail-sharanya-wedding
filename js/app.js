/* One-page site rendered from window.WEDDING. The hash picks the selected event (#mehendi, #sangeet, #wedding);
   no hash selects the first event. The selected event's palette and blurred painting become the page background. */
(function () {
  "use strict";
  var W = window.WEDDING;
  var root = document.getElementById("app");

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function isIOS() {
    var ua = navigator.userAgent || "";
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function dayNum(iso) { return iso.slice(8, 10); }
  function monShort(iso) { return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+iso.slice(5, 7) - 1]; }
  function paletteStyle(ev) {
    var p = ev.palette;
    return "--ev-bg:" + p.bg + ";--ev-fg:" + p.fg + ";--ev-accent:" + p.accent + ";--ev-accent2:" + p.accent2 + ";--ev-soft:" + p.soft;
  }
  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';

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
  function directionsButtons(v) {
    var L = mapLinks(v);
    if (!L.ready) return '<a class="btn p" aria-disabled="true">' + ICON_PIN + 'Location coming soon</a>';
    if (isIOS()) {
      return (L.apple ? '<a class="btn p" href="' + esc(L.apple) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Apple Maps</a>' : "") +
             (L.google ? '<a class="btn s" href="' + esc(L.google) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Google Maps</a>' : "");
    }
    return '<a class="btn p" href="' + esc(L.google || L.apple) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Directions</a>';
  }

  /* ---------- render ---------- */
  function render(sel) {
    var evs = W.events;

    // both days at a glance
    var days = {};
    evs.forEach(function (e) {
      var d = (days[e.dateISO] = days[e.dateISO] || { label: e.dayLabel, items: [] });
      if (e.flow && e.flow.length > 1) e.flow.forEach(function (f, i) { d.items.push({ t: f.t, title: f.title, note: f.note, ev: e, first: i === 0 }); });
      else d.items.push({ t: e.start, title: e.name, note: e.venue.name, ev: e, first: true });
    });

    var html =
      '<div class="bgart" style="background-image:url(&quot;' + esc(sel.wash || sel.art) + '&quot;)"></div><div class="bgtint"></div>' +
      '<main class="wrap">' +
        '<header class="hero">' +
          '<p class="eyebrow">' + esc(W.dateLine) + '</p>' +
          '<h1 class="display">' + esc(W.couple.a) + ' <span class="amp">&amp;</span> ' + esc(W.couple.b) + '</h1>' +
          '<p class="lead">' + esc(W.invite) + '</p>' +
          '<p class="city">' + esc(W.city) + '</p>' +
        '</header>' +

        '<nav class="strip" aria-label="Events"><ul class="tabs">' +
          evs.map(function (e) {
            return '<li><a class="tab" href="#' + e.id + '"' + (e.id === sel.id ? ' aria-current="true"' : '') + '>' +
              '<small class="tnum">' + esc(e.dayLabel.split(",")[0].slice(0, 3)) + ' ' + dayNum(e.dateISO) + ' ' + monShort(e.dateISO) + '</small><b>' + esc(e.name) + '</b></a></li>';
          }).join("") +
        '</ul></nav>' +

        '<section class="panel event" aria-labelledby="ev-name">' +
          '<div class="art"><img src="' + esc(sel.art) + '" alt="' + esc(sel.name) + ' watercolour"></div>' +
          '<header class="evhead">' +
            '<p class="eyebrow">' + esc(sel.dayLabel) + '</p>' +
            '<h2 class="display" id="ev-name">' + esc(sel.name) + '</h2>' +
            '<p class="when tnum">' + esc(sel.start) + ' to ' + esc(sel.end) + ' <span>· ' + esc(sel.venue.name) + '</span></p>' +
          '</header>' +
          '<section class="block">' +
            '<h2 class="sec-title">Getting there</h2>' +
            '<p class="venue-name">' + esc(sel.venue.name) + '</p>' +
            '<p class="venue-addr">' + esc(sel.venue.address) + '</p>' +
            '<div class="btns">' + directionsButtons(sel.venue) + '</div>' +
            (isIOS() && mapLinks(sel.venue).ready ? '<p class="note">Opens in the app you choose.</p>' : '') +
          '</section>' +
          (sel.dress ? '<section class="block"><h2 class="sec-title">Dress code</h2><p class="dress">' + esc(sel.dress) + '</p></section>' : '') +
          (sel.about ? '<section class="block about"><h2 class="sec-title">About</h2><p>' + esc(sel.about) + '</p></section>' : '') +
          '<section class="block">' +
            '<h2 class="sec-title">Flow of the event</h2>' +
            '<div class="tl">' + sel.flow.map(function (f) {
              return '<span class="t tnum">' + esc(f.t) + '</span><span class="d">' + esc(f.title) + (f.note ? '<small>' + esc(f.note) + '</small>' : '') + '</span>';
            }).join("") + '</div>' +
          '</section>' +
        '</section>' +

        '<section class="panel" aria-labelledby="days-title">' +
          '<h2 class="sec-title" id="days-title">Both days at a glance</h2>' +
          Object.keys(days).sort().map(function (iso) {
            var d = days[iso];
            return '<div class="day"><h3>' + esc(d.label) + '</h3><div class="tl">' +
              d.items.map(function (it) {
                var cur = it.ev.id === sel.id ? ' cur' : '';
                return '<span class="t tnum">' + esc(it.t) + '</span>' +
                  '<span class="d' + cur + '">' + (it.first ? '<a href="#' + it.ev.id + '">' + esc(it.ev.name) + '</a>' + (it.title !== it.ev.name ? ' · ' + esc(it.title) : '') : esc(it.title)) +
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

    document.documentElement.setAttribute("style", paletteStyle(sel));
    root.innerHTML = html;
    document.title = W.couple.a + " & " + W.couple.b + " · " + sel.name;
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", sel.palette.bg);
  }

  var lastId = null;
  function route() {
    var id = (location.hash || "").replace(/^#\/?/, "");
    var sel = W.events.filter(function (e) { return e.id === id; })[0] || W.events[0];
    var hadRender = lastId !== null;
    var stripTop = hadRender ? (document.querySelector(".strip") || {}).offsetTop : 0;
    render(sel);
    // keep the strip in view when switching events after the first paint; initial load stays at the top
    if (hadRender && sel.id !== lastId) {
      var strip = document.querySelector(".strip");
      if (strip && window.scrollY > strip.offsetTop) window.scrollTo(0, strip.offsetTop);
      var cur = document.querySelector('.tab[aria-current="true"]');
      if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "center" });
    }
    lastId = sel.id;
  }

  window.addEventListener("hashchange", route);
  route();
})();
