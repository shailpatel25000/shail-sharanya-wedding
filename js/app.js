/* One-page site rendered from window.WEDDING. The hash picks the selected event (#mehendi, #sangeet, #wedding);
   no hash selects the first event. The selected event's palette and blurred painting become the page background. */
(function () {
  "use strict";
  var W = window.WEDDING;
  var root = document.getElementById("app");

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function dayNum(iso) { return iso.slice(8, 10); }
  function monShort(iso) { return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+iso.slice(5, 7) - 1]; }
  function paletteStyle(ev) {
    var p = ev.palette;
    return "--ev-bg:" + p.bg + ";--ev-fg:" + p.fg + ";--ev-accent:" + p.accent + ";--ev-accent2:" + p.accent2 + ";--ev-soft:" + p.soft;
  }
  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  /* ---------- directions: one QR, one site, one Google Maps link on every platform.
     maps.app.goo.gl share links open the Google Maps app on Android and on iOS when it is installed, else the browser. ---------- */
  function mapLink(v) {
    if (typeof v.lat === "number" && typeof v.lng === "number") return "https://www.google.com/maps/dir/?api=1&destination=" + v.lat + "," + v.lng;
    return v.mapsLink || null;
  }
  function directionsButtons(v) {
    var L = mapLink(v);
    if (!L) return '<a class="btn p" aria-disabled="true">' + ICON_PIN + 'Location coming soon</a>';
    return '<a class="btn p" href="' + esc(L) + '" target="_blank" rel="noopener">' + ICON_PIN + 'Directions in Google Maps</a>';
  }

  /* ---------- timeline: time | rail of dots joined by a line | text ---------- */
  function timeline(items) {
    return '<ol class="tl">' + items.map(function (it) {
      return '<li class="row' + (it.cur ? ' cur' : '') + '"><span class="t tnum">' + esc(it.t) + '</span><span class="rail" aria-hidden="true"></span>' +
        '<span class="d">' + it.html + (it.note ? '<small>' + esc(it.note) + '</small>' : '') + '</span></li>';
    }).join("") + '</ol>';
  }

  /* ---------- dress code: text and/or an image in a collapsible; "Coming soon" until either exists ---------- */
  function dressBlock(e) {
    if (!e.dress && !e.dressImage) return '<a class="btn s" aria-disabled="true">Coming soon</a>';
    return '<details class="fold"><summary>See the dress code<span class="chev" aria-hidden="true"></span></summary><div class="fold-body">' +
      (e.dressImage ? '<img src="' + esc(e.dressImage) + '" alt="Dress code for ' + esc(e.name) + '">' : '') +
      (e.dress ? '<p class="dress">' + esc(e.dress) + '</p>' : '') + '</div></details>';
  }

  /* ---------- render ---------- */
  function render(sel) {
    var evs = W.events;

    var html =
      '<div class="bgart" style="background-image:url(&quot;' + esc(sel.wash || sel.art) + '&quot;)"></div><div class="bgtint"></div>' +
      '<main class="wrap">' +
        '<header class="hero">' +
          '<p class="eyebrow">' + esc(W.dateLine) + ' <span class="dot">·</span> ' + esc(W.city) + '</p>' +
          '<h1 class="display">' + esc(W.couple.a) + ' <span class="amp">&amp;</span> ' + esc(W.couple.b) + '</h1>' +
          '<p class="lead">' + esc(W.invite) + '</p>' +
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
          '</section>' +
          '<section class="block"><h2 class="sec-title">Dress code</h2>' + dressBlock(sel) + '</section>' +
          (sel.about ? '<section class="block about"><h2 class="sec-title">About</h2><p>' + esc(sel.about) + '</p></section>' : '') +
          '<section class="block">' +
            '<h2 class="sec-title">Flow of the event</h2>' +
            timeline(sel.flow.map(function (f) { return { t: f.t, html: esc(f.title), note: f.note, cur: true }; })) +
          '</section>' +
        '</section>' +

        '<footer>' +
          '<p class="eyebrow">Questions</p>' +
          '<ul class="contacts">' +
            (W.contact || []).map(function (c) { return '<li><b>' + esc(c.name) + '</b> · <a class="tnum" href="tel:+91' + esc(String(c.phone).replace(/\D/g, "")) + '">' + esc(c.phone) + '</a></li>'; }).join("") +
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
