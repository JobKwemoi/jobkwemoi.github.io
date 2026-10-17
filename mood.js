/*! © 2026 Kirong Job Kwemoi. Mood engine: every visit gets its own sea, palette and weather. */
(function () {
  "use strict";
  var L = [
    { n: "Bioluminescent", c1: "#3DD8F5", c2: "#4C7DFF", sky: ["#04070D", "#06162e", "#0b3a5e"], sea: ["#1c8fb0", "#0a3a60", "#030a1c"], moon: "#e4f8ff", aur: 0.45, sun: 0 },
    { n: "Violet Tide", c1: "#B98BFF", c2: "#6C5CFF", sky: ["#04070D", "#150c36", "#44278a"], sea: ["#7a50d8", "#2b1768", "#07041b"], moon: "#f3e9ff", aur: 0.6, sun: 0 },
    { n: "Ember Dusk", c1: "#FFB05A", c2: "#FF5A7A", sky: ["#04070D", "#2f1030", "#d2586a"], sea: ["#d65a5c", "#5a1a3c", "#0d0412"], moon: "#ffe3b8", aur: 0.1, sun: 1 },
    { n: "Aurora Reef", c1: "#5BE3A8", c2: "#3DD8F5", sky: ["#04070D", "#04201c", "#0a4a50"], sea: ["#1c9c86", "#0a4452", "#031018"], moon: "#e6fff4", aur: 1, sun: 0 },
    { n: "Rose Quartz", c1: "#FF8FC7", c2: "#B07CFF", sky: ["#04070D", "#2a0f34", "#8a3a8a"], sea: ["#c25aa8", "#4a1a62", "#0a041a"], moon: "#ffeaf6", aur: 0.5, sun: 0 },
    { n: "Gold Hour", c1: "#FFD166", c2: "#FF8A3D", sky: ["#05060b", "#2a1f28", "#b87a45"], sea: ["#c8863e", "#4a2a30", "#0b0610"], moon: "#fff0c8", aur: 0, sun: 1 }
  ];
  function hue(hex) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255,
      mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360 }
    return h;
  }
  function rgb(hex) { var n = parseInt(hex.slice(1), 16); return (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v) } catch (e) { return null } }

  var last = parseInt(store("kirong-mood"), 10), i;
  var q = /[?&]mood=(\d)/.exec(location.search);
  if (q && L[+q[1]]) i = +q[1];
  else { do { i = Math.floor(Math.random() * L.length) } while (i === last && L.length > 1) }
  var returning = store("kirong-seen") === "1" && !q && last >= 0 && last < L.length, pending = null;
  store("kirong-seen", "1");
  if (returning) { pending = i; i = last }
  store("kirong-mood", String(i));

  var K = window.KMood = {
    list: L, i: i, pending: pending, cur: L[i], seed: (Math.random() * 4294967296) >>> 0, subs: [],
    apply: function (n) {
      K.i = n; K.cur = L[n]; var m = K.cur, s = document.documentElement.style;
      s.setProperty("--cyan", m.c1); s.setProperty("--blue", m.c2);
      s.setProperty("--m1", rgb(m.c1)); s.setProperty("--m2", rgb(m.c2));
      s.setProperty("--m-rot", (hue(m.c1) - 190).toFixed(0) + "deg");
      document.documentElement.setAttribute("data-mood", m.n.toLowerCase().replace(/\s+/g, "-"));
      store("kirong-mood", String(n));
      for (var k = 0; k < K.subs.length; k++) K.subs[k](m);
    },
    next: function () { K.seed = (Math.random() * 4294967296) >>> 0; K.apply((K.i + 1 + Math.floor(Math.random() * (L.length - 1))) % L.length) }
  };
  K.apply(i);
})();
