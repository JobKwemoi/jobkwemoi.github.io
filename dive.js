/*! © 2026 Kirong Job Kwemoi. The Dive: a scroll-scrubbed orb that falls into a generative sea. No libraries. */
(function () {
  "use strict";
  var K = window.KMood, d = document;
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v }
  function sm(v) { v = clamp(v, 0, 1); return v * v * (3 - 2 * v) }
  function lerp(a, b, t) { return a + (b - a) * t }
  function hex(h) { var n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255] }
  function C(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (a === undefined ? 1 : +a.toFixed(3)) + ")" }
  function mixc(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] }
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }

  /* ---------- palette (smoothly lerped toward the current mood) ---------- */
  function palOf(m) { return { c1: hex(m.c1), c2: hex(m.c2), sky: m.sky.map(hex), sea: m.sea.map(hex), moon: hex(m.moon), aur: m.aur, sun: m.sun } }
  var pal = palOf(K.cur), tgt = pal;
  function stepPal(k) {
    function a(x, y) { return [lerp(x[0], y[0], k), lerp(x[1], y[1], k), lerp(x[2], y[2], k)] }
    pal = { c1: a(pal.c1, tgt.c1), c2: a(pal.c2, tgt.c2), sky: pal.sky.map(function (c, i) { return a(c, tgt.sky[i]) }), sea: pal.sea.map(function (c, i) { return a(c, tgt.sea[i]) }), moon: a(pal.moon, tgt.moon), aur: lerp(pal.aur, tgt.aur, k), sun: lerp(pal.sun, tgt.sun, k) };
  }

  /* ---------- remix button + ripple flash ---------- */
  var rb = d.createElement("button");
  rb.type = "button"; rb.className = "remix"; rb.setAttribute("aria-label", "Remix: change the look of this portfolio");
  rb.innerHTML = '<span class="remix-ic" aria-hidden="true">✦</span><span class="remix-t">Remix</span><b class="remix-n"></b>';
  d.body.appendChild(rb);
  var rn = rb.querySelector(".remix-n");
  function label() { rn.textContent = K.cur.n }
  label();
  rb.addEventListener("click", function (e) {
    var f = d.createElement("div"); f.className = "remix-flash"; f.setAttribute("aria-hidden", "true");
    var r = rb.getBoundingClientRect(); f.style.left = r.left + r.width / 2 + "px"; f.style.top = r.top + r.height / 2 + "px";
    d.body.appendChild(f); setTimeout(function () { f.remove() }, 1100);
    K.next();
    rb.classList.remove("spin"); void rb.offsetWidth; rb.classList.add("spin");
  });
  K.subs.push(function (m) { tgt = palOf(m); label(); if (scene) scene.regen(); if (RM && scene) scene.still() });

  /* ---------- returning visitor: familiar look first, then a new sea after 2s ---------- */
  if (K.pending !== null && !RM) setTimeout(function () {
    var o = d.getElementById("orb"), r = o ? o.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    var f = d.createElement("div"); f.className = "remix-flash"; f.setAttribute("aria-hidden", "true");
    f.style.left = r.left + r.width / 2 + "px"; f.style.top = Math.max(120, r.top + r.height / 2) + "px"; d.body.appendChild(f); setTimeout(function () { f.remove() }, 1100);
    K.seed = (Math.random() * 4294967296) >>> 0; var n = K.pending; K.pending = null; K.apply(n);
  }, 2000);

  /* ---------- cursor comet trail (sitewide, fine pointers only) ---------- */
  if (fine && !RM && !(navigator.connection && navigator.connection.saveData)) (function () {
    var cv = d.createElement("canvas"); cv.className = "trail"; cv.setAttribute("aria-hidden", "true"); d.body.appendChild(cv);
    var x = cv.getContext("2d"), P = [], w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2), run = 0, lx = -1, ly = -1, tl = 0;
    function rs() { w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0) }
    rs(); addEventListener("resize", rs);
    addEventListener("pointermove", function (e) {
      if (lx < 0) { lx = e.clientX; ly = e.clientY }
      var dx = e.clientX - lx, dy = e.clientY - ly, dist = Math.sqrt(dx * dx + dy * dy), n = Math.min(5, 1 + (dist / 14 | 0));
      for (var i = 0; i < n; i++) P.push({ x: lx + dx * i / n + (Math.random() - .5) * 4, y: ly + dy * i / n + (Math.random() - .5) * 4, vx: (Math.random() - .5) * 18, vy: (Math.random() - .5) * 18 - 8, l: 0, m: .55 + Math.random() * .5, s: 1 + Math.random() * 2.2, t: Math.random() });
      lx = e.clientX; ly = e.clientY; if (P.length > 140) P.splice(0, P.length - 140);
      if (!run) { run = 1; tl = performance.now(); requestAnimationFrame(tk) }
    }, { passive: true });
    function tk(t) {
      var dt = Math.min(.05, (t - tl) / 1e3); tl = t; x.clearRect(0, 0, w, h); x.globalCompositeOperation = "lighter";
      for (var i = P.length - 1; i >= 0; i--) {
        var p = P[i]; p.l += dt; if (p.l > p.m) { P.splice(i, 1); continue }
        p.x += p.vx * dt; p.y += p.vy * dt; var k = 1 - p.l / p.m, c = mixc(pal.c1, pal.c2, p.t);
        var g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 5 * k + 1); g.addColorStop(0, C(c, .55 * k)); g.addColorStop(1, C(c, 0));
        x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.s * 5 * k + 1, 0, 6.283); x.fill();
      }
      if (P.length) requestAnimationFrame(tk); else { run = 0; x.clearRect(0, 0, w, h) }
    }
  })();

  /* ---------- the dive ---------- */
  var sec = d.getElementById("dive"), scene = null;
  if (!sec) return;
  var cv = d.getElementById("diveCanvas"), ctx = cv.getContext("2d");
  if (!ctx) return;
  var caps = [].slice.call(sec.querySelectorAll(".dive-cap")), hint = sec.querySelector(".dive-hint"),
    gaugeN = d.getElementById("diveDepth"), gaugeL = d.getElementById("diveLabel"), gaugeB = d.getElementById("diveBar");
  var small = innerWidth < 700 || (navigator.hardwareConcurrency || 8) <= 4;
  var W = 1, H = 1, DPR = 1, R = 100, hz = 0, camMax = 0, homeX = .5, endX = .5;
  var T = 0, p = 0, ps = 0, running = false, last = 0;
  var px = .5, py = .5, pxs = .5, pxPix = -1, pyPix = -1;
  var L = {}, nodes = [], edges = [], pulses = [], drops = [], rings = [], bubbles = [], sparks = [], shoot = null;
  var E = 0, J = 0, ix = 0, it = 0, splashed = false, nextShoot = 4, bubT = 0;
  var FALL = .34;

  function size() {
    var r = sec.querySelector(".dive-stage").getBoundingClientRect();
    DPR = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = Math.min(W, H) * (W < 700 ? .21 : .165);
    hz = H * .62; camMax = H * 1.32;
    var heroOrb = d.getElementById("orb");
    homeX = .5; endX = W > 900 ? .64 : .5;
    if (heroOrb) { var o = heroOrb.getBoundingClientRect(); if (o.width) homeX = clamp((o.left + o.width / 2) / innerWidth, .2, .8) }
  }

  function regen() {
    var r = rng(K.seed), n = small ? 1 : 1.9, i;
    L.wave = { a1: .007 + r() * .005, k1: 1.2 + r() * 1.4, w1: .6 + r() * .6, p1: r() * 6.28, a2: .004 + r() * .004, k2: 3 + r() * 2.5, w2: .9 + r() * .8, p2: r() * 6.28, a3: .0018 + r() * .002, k3: 7 + r() * 4, w3: 1.4 + r(), p3: r() * 6.28 };
    L.stars = []; for (i = 0; i < 130 * n; i++) L.stars.push({ x: r(), y: Math.pow(r(), 1.3) * .62, s: .3 + r() * 1.3, p: r() * 6.28, f: .6 + r() * 2 });
    L.moon = { x: .12 + r() * .76, y: .15 + r() * .1, r: .042 + r() * .026, ph: r() };
    L.snow = []; for (i = 0; i < 70 * n; i++) L.snow.push({ x: r(), y: r(), z: .25 + r() * .75, s: .6 + r() * 1.6 });
    L.jelly = []; var jn = (small ? 2 : 4) + (r() * 3 | 0);
    for (i = 0; i < jn; i++) L.jelly.push({ x: .08 + r() * .84, d: .5 + r() * 1.05, s: .03 + r() * .045, p: r() * 6.28, f: .9 + r() * .8, t: r(), par: .88 + r() * .26, dr: .01 + r() * .02 });
    L.fish = []; var sn = small ? 1 : 2;
    for (i = 0; i < sn; i++) { var sh = { d: .55 + r() * .75, dir: r() < .5 ? -1 : 1, v: 24 + r() * 26, b: r() * 1000, par: .9 + r() * .15, f: [] }; for (var j = 0; j < (small ? 9 : 16); j++) sh.f.push({ ox: (r() - .5) * 150, oy: (r() - .5) * 70, p: r() * 6.28, s: 2.4 + r() * 2.2 }); L.fish.push(sh) }
    L.dunes = { a: r() * 6.28, b: r() * 6.28, k: 1.4 + r() * 1.2 };
    L.rays = []; for (i = 0; i < 7; i++) L.rays.push({ x: (L.moon.x + (r() - .5) * .9), w: .02 + r() * .05, sp: .1 + r() * .25, p: r() * 6.28, a: .5 + r() * .5, lean: (r() - .5) * .3 });
    nodes = []; edges = []; pulses = [];
    var N = small ? 44 : 66, G = Math.PI * (3 - Math.sqrt(5)), q = rng(K.seed ^ 77);
    for (i = 0; i < N; i++) { var y = 1 - i / (N - 1) * 2, rr = Math.sqrt(1 - y * y), th = G * i, s = .95 + q() * .05; nodes.push({ x: Math.cos(th) * rr * s, y: y * s, z: Math.sin(th) * rr * s, k: 1 }) }
    for (i = 0; i < (small ? 6 : 10); i++) { var y2 = 1 - (i + .5) / (small ? 6 : 10) * 2, r2 = Math.sqrt(1 - y2 * y2), t2 = G * i * 2.3, s2 = .4 + q() * .12; nodes.push({ x: Math.cos(t2) * r2 * s2, y: y2 * s2, z: Math.sin(t2) * r2 * s2, k: .7 }) }
    var seen = {};
    for (i = 0; i < nodes.length; i++) {
      var ds = []; for (var j2 = 0; j2 < nodes.length; j2++) if (j2 !== i) { var a = nodes[i], b = nodes[j2]; ds.push([j2, (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z)]) }
      ds.sort(function (u, v) { return u[1] - v[1] });
      for (var k = 0; k < (i < N ? 3 : 2); k++) { var kk = i < ds[k][0] ? i + "-" + ds[k][0] : ds[k][0] + "-" + i; if (!seen[kk]) { seen[kk] = 1; edges.push([i, ds[k][0]]) } }
    }
    for (i = 0; i < 6; i++) pulses.push({ e: q() * edges.length | 0, t: q(), v: .4 + q() * .5 });
  }

  /* ---------- geometry helpers ---------- */
  var ys = new Float32Array(2), STEP = 8, NS = 2;
  function surfAt(x, t, cam) {
    var u = x / W, w = L.wave, y = hz - cam;
    y += w.a1 * H * Math.sin(u * w.k1 * 6.283 + t * w.w1 + w.p1) + w.a2 * H * Math.sin(u * w.k2 * 6.283 - t * w.w2 + w.p2) + w.a3 * H * Math.sin(u * w.k3 * 6.283 + t * w.w3 + w.p3);
    if (E > .01 || J > .01) {
      var dx = x - ix, ad = Math.abs(dx);
      if (E > .01) y += E * .02 * H * Math.sin(ad / (.03 * W) - (T - it) * 9) * Math.exp(-ad / (.3 * W));
      if (J > .01) y -= J * R * 1.25 * Math.exp(-(dx * dx) / (R * R * .1));
    }
    return y;
  }
  function wavePath(cam, close) {
    var P = new Path2D(), i;
    P.moveTo(0, ys[0]);
    for (i = 1; i < NS; i++) P.lineTo(Math.min(W, i * STEP), ys[i]);
    P.lineTo(W, ys[NS - 1]);
    if (close === "down") { P.lineTo(W, H + 4); P.lineTo(0, H + 4); P.closePath() }
    else if (close === "up") { P.lineTo(W, -H); P.lineTo(0, -H); P.closePath() }
    return P;
  }
  function ysAt(x) { var i = clamp(x / STEP, 0, NS - 2), a = i | 0; return lerp(ys[a], ys[a + 1], i - a) }

  /* ---------- orb ---------- */
  function drawOrb(cx, cy, r, t, glow, below) {
    var c1 = pal.c1, c2 = pal.c2, ang = t * .38 + (pxs - .5) * 1.1, ca = Math.cos(ang), sa = Math.sin(ang), tilt = .38 + (py - .5) * .25, ct = Math.cos(tilt), st = Math.sin(tilt), i, pr = [];
    var g = ctx.createRadialGradient(cx - r * .3, cy - r * .38, r * .05, cx, cy, r);
    g.addColorStop(0, C(c1, below ? .34 : .26)); g.addColorStop(.55, C(c2, .12)); g.addColorStop(1, "rgba(4,8,20,.72)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.fill();
    ctx.strokeStyle = C(c1, .4); ctx.lineWidth = 1; ctx.stroke();
    for (i = 0; i < nodes.length; i++) {
      var n = nodes[i], x1 = n.x * ca + n.z * sa, z1 = -n.x * sa + n.z * ca, y2 = n.y * ct - z1 * st, z2 = n.y * st + z1 * ct;
      pr.push([cx + x1 * r, cy + y2 * r, z2]);
    }
    ctx.lineWidth = 1;
    for (i = 0; i < edges.length; i++) {
      var A = pr[edges[i][0]], B = pr[edges[i][1]], z = (A[2] + B[2]) / 2, a = .08 + .5 * (z + 1) / 2;
      ctx.strokeStyle = C(mixc(c1, c2, (z + 1) / 2 > .5 ? 0 : .8), a); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    }
    for (i = 0; i < pr.length; i++) {
      var q = pr[i], s = (nodes[i].k * (1.1 + 1.6 * (q[2] + 1) / 2)) * (r / 120 < .5 ? .6 : Math.min(1.4, r / 120));
      ctx.fillStyle = C([200, 240, 255], .25 + .6 * (q[2] + 1) / 2); ctx.beginPath(); ctx.arc(q[0], q[1], s, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = "lighter";
    for (i = 0; i < pulses.length; i++) {
      var pu = pulses[i], e = edges[pu.e], A2 = pr[e[0]], B2 = pr[e[1]], tt = pu.t, x = lerp(A2[0], B2[0], tt), y = lerp(A2[1], B2[1], tt);
      var gp = ctx.createRadialGradient(x, y, 0, x, y, 9); gp.addColorStop(0, C([230, 250, 255], .9)); gp.addColorStop(.4, C(c1, .45)); gp.addColorStop(1, C(c1, 0));
      ctx.fillStyle = gp; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
    }
    var hg = ctx.createRadialGradient(cx, cy, r * .9, cx, cy, r * (below ? 3.4 : 2.2)); hg.addColorStop(0, C(c1, glow)); hg.addColorStop(.3, C(c2, glow * .3)); hg.addColorStop(1, C(c2, 0));
    ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(cx, cy, r * (below ? 3.4 : 2.2), 0, 6.283); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function jelly(j, cam, t, ox, oy, orR) {
    var y = hz - cam * j.par + j.d * H + Math.sin(t * .3 + j.p) * H * j.dr * 2, x = j.x * W + Math.sin(t * .17 + j.p) * W * .03, s = j.s * Math.min(W, H) * (W < 700 ? 1.5 : 1.3);
    if (y < -s * 4 || y > H + s * 4) return;
    var pul = 1 + .13 * Math.sin(t * j.f * 1.6 + j.p), w = s * (1.05 - (pul - 1) * .9), h = s * .95 * pul, col = mixc(pal.c1, pal.c2, j.t);
    var dx = x - ox, dy = y - oy, boost = clamp(1 - Math.sqrt(dx * dx + dy * dy) / (R * 4.2), 0, 1), a = .5 + boost * .5;
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = C(col, .32 * a); ctx.lineWidth = 1.2;
    for (var i = 0; i < 6; i++) {
      var bx = x - w * .78 + i * (w * 1.56 / 5); ctx.beginPath(); ctx.moveTo(bx, y + s * .1);
      for (var k = 1; k <= 12; k++) { var f = k / 12; ctx.lineTo(bx + Math.sin(k * .55 - t * j.f * 1.3 + j.p + i) * s * .2 * f, y + s * .1 + f * s * (2.4 + (i % 2) * .7) * (.9 + .1 * pul)) }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    var g = ctx.createRadialGradient(x, y - h * .5, 0, x, y - h * .4, s * 1.3);
    g.addColorStop(0, C(mixc(col, [255, 255, 255], .35), .55 * a)); g.addColorStop(1, C(col, .07 * a));
    ctx.fillStyle = g; ctx.strokeStyle = C(col, .55 * a); ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(x - w, y); ctx.bezierCurveTo(x - w, y - h * 1.4, x + w, y - h * 1.4, x + w, y); ctx.quadraticCurveTo(x, y + s * .3 * pul, x - w, y); ctx.fill(); ctx.stroke();
  }

  /* ---------- sky ---------- */
  function sky(t, cam, depth) {
    var g = ctx.createLinearGradient(0, 0, 0, hz + H * .05); g.addColorStop(0, C(pal.sky[0])); g.addColorStop(.55, C(pal.sky[1])); g.addColorStop(1, C(pal.sky[2]));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var off = cam * .18, i;
    for (i = 0; i < L.stars.length; i++) { var s = L.stars[i], tw = .45 + .55 * Math.sin(t * s.f + s.p); ctx.fillStyle = "rgba(235,245,255," + (tw * .8 * (1 - pal.sun * .55)).toFixed(2) + ")"; ctx.fillRect(s.x * W, s.y * H - off, s.s, s.s) }
    if (pal.aur > .02 && cam < hz) {
      ctx.globalCompositeOperation = "lighter";
      for (var b = 0; b < 3; b++) {
        var col = b === 1 ? pal.c2 : pal.c1, base = H * (.16 + b * .07) - off;
        for (var x = 0; x < W; x += 7) {
          var u = x / W, top = base + Math.sin(u * 5 + t * .25 + b * 2) * H * .05 + Math.sin(u * 11 - t * .4 + b) * H * .018, len = H * (.16 + .05 * Math.sin(u * 7 + t * .3 + b));
          var ag = ctx.createLinearGradient(0, top, 0, top + len); ag.addColorStop(0, C(col, 0)); ag.addColorStop(.2, C(col, .1 * pal.aur)); ag.addColorStop(1, C(col, 0));
          ctx.fillStyle = ag; ctx.fillRect(x, top, 7, len);
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    var mx = L.moon.x * W, my = L.moon.y * H + pal.sun * H * .24 - off, mr = L.moon.r * Math.min(W, H) * (1 + pal.sun * .9);
    var hg = ctx.createRadialGradient(mx, my, mr * .5, mx, my, mr * (7 + pal.sun * 4)); hg.addColorStop(0, C(pal.moon, .35)); hg.addColorStop(.25, C(pal.c1, .1)); hg.addColorStop(1, C(pal.c1, 0));
    ctx.fillStyle = hg; ctx.fillRect(0, 0, W, hz + H * .1);
    ctx.fillStyle = C(pal.moon, .95); ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();
    if (pal.sun < .5) { ctx.fillStyle = "rgba(10,30,60,.1)"; for (i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(mx + Math.cos(i * 2.3 + L.moon.ph * 6) * mr * .45, my + Math.sin(i * 1.9 + L.moon.ph * 6) * mr * .4, mr * (.1 + i * .035), 0, 6.283); ctx.fill() } }
    if (shoot) {
      var sp = shoot, k = sp.l / sp.m; ctx.globalCompositeOperation = "lighter";
      var sx = sp.x + sp.vx * sp.l, sy = sp.y + sp.vy * sp.l - off, sg = ctx.createLinearGradient(sx, sy, sx - sp.vx * .14, sy - sp.vy * .14); sg.addColorStop(0, "rgba(255,255,255," + (.9 * (1 - k)).toFixed(2) + ")"); sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = sg; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - sp.vx * .14, sy - sp.vy * .14); ctx.stroke(); ctx.globalCompositeOperation = "source-over";
    }
  }

  /* ---------- main frame ---------- */
  function orbY(pp) {
    if (pp < FALL) { var f = pp / FALL; return lerp(-R * 2.2, hz + R * .15, f * f * (1.35 - .35 * f)) }
    var q = (pp - FALL) / (1 - FALL);
    return hz + R * .15 + (H * .5 - hz - R * .15) * sm(q / .5) + H * .05 * sm((q - .78) / .22);
  }
  function camOf(pp) { if (pp < FALL) return 0; var q = (pp - FALL) / (1 - FALL), e = q < .5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2; return camMax * e }

  function frame(t, dt) {
    T = t;
    stepPal(1 - Math.exp(-dt * 3.2)); ps += (p - ps) * Math.min(1, dt * 7); if (Math.abs(p - ps) < .0003) ps = p;
    pxs += (px - pxs) * Math.min(1, dt * 4);
    E *= Math.exp(-dt * .9); J = Math.max(0, J - dt * 1.8);
    var pp = ps, cam = camOf(pp), oyS = orbY(pp), f = clamp(pp / FALL), ox = lerp(homeX, endX, sm(pp / .6)) * W + Math.sin(t * .5) * W * .012 * sm((pp - FALL) * 3);
    var q = clamp((pp - FALL) / (1 - FALL)), depth = clamp(cam / camMax), ORR = R * (1 - .16 * sm(q * 1.4));
    NS = Math.ceil(W / STEP) + 1; if (ys.length < NS) ys = new Float32Array(NS + 8);
    for (var i = 0; i < NS; i++) ys[i] = surfAt(Math.min(W, i * STEP), t, cam);

    if (!splashed && oyS + ORR * .85 >= ysAt(ox)) { splashed = true; ix = ox; it = t; E = 1; J = 1; spawnSplash(ox, ysAt(ox) + cam, ORR); }
    else if (splashed && pp < FALL * .6) splashed = false;

    sky(t, cam, depth);
    var minY = 1e9, maxY = -1e9; for (i = 0; i < NS; i++) { if (ys[i] < minY) minY = ys[i]; if (ys[i] > maxY) maxY = ys[i] }
    var both = oyS + ORR > minY && oyS - ORR < maxY, onlyAbove = oyS + ORR <= minY, glowA = .22 + .34 * sm(q * 1.6);
    if (oyS + ORR > -40) {
      if (onlyAbove || both) { ctx.save(); if (both) ctx.clip(wavePath(cam, "up")); drawOrb(ox, oyS, ORR, t, .26 + f * .12, false); ctx.restore() }
    }
    /* comet tail behind the falling orb */
    if (pp < FALL && oyS > -R) { ctx.globalCompositeOperation = "lighter"; for (i = 1; i < 16; i++) { var ty = oyS - i * ORR * .42, tr = ORR * (1.05 - i * .055), tk2 = (1 - i / 16) * .16 * f, tgr = ctx.createRadialGradient(ox, ty, 0, ox, ty, tr); tgr.addColorStop(0, C(pal.c1, tk2)); tgr.addColorStop(1, C(pal.c1, 0)); ctx.fillStyle = tgr; ctx.beginPath(); ctx.arc(ox, ty, tr, 0, 6.283); ctx.fill() } ctx.globalCompositeOperation = "source-over" }

    /* water body */
    var sy0 = hz - cam, wg = ctx.createLinearGradient(0, sy0, 0, sy0 + H * 1.45); wg.addColorStop(0, C(pal.sea[0], .9)); wg.addColorStop(.1, C(mixc(pal.sea[0], pal.sea[1], .55))); wg.addColorStop(.3, C(pal.sea[1])); wg.addColorStop(.7, C(pal.sea[2])); wg.addColorStop(1, C(pal.sea[2]));
    var WP = wavePath(cam, "down"); ctx.fillStyle = wg; ctx.fill(WP); ctx.fillStyle = C(pal.sea[2], .5 * sm(depth * 1.4)); ctx.fill(WP);
    ctx.save(); ctx.clip(WP);

    /* moon glitter */
    if (cam < H * .7) {
      var gk = 1 - cam / (H * .7), mx = L.moon.x * W;
      for (i = 0; i < 46; i++) { var gy = sy0 + 6 + i * i * .3 + ((i * 7) % 5) * 2, gw = (4 + i * 1.6) * (.5 + .5 * Math.abs(Math.sin(t * 1.3 + i * 3.1))), gx = mx + Math.sin(i * 12.3 + t * .7) * (10 + i * 5); ctx.fillStyle = C(pal.moon, Math.max(0, .5 - i * .011) * gk * (.4 + .6 * Math.abs(Math.sin(t * 2 + i)))); ctx.fillRect(gx - gw / 2, gy, gw, 1.6) }
    }
    /* god rays */
    ctx.globalCompositeOperation = "lighter";
    var rayK = 1 - sm(depth * 1.15) * .85;
    for (i = 0; i < L.rays.length; i++) {
      var ry = L.rays[i], rx = ry.x * W + Math.sin(t * ry.sp + ry.p) * W * .03, rw = ry.w * W, top = Math.max(sy0, -20), len = H * 1.25;
      var rg = ctx.createLinearGradient(0, top, 0, top + len); rg.addColorStop(0, C(pal.moon, .17 * ry.a * rayK)); rg.addColorStop(.5, C(pal.c1, .05 * ry.a * rayK)); rg.addColorStop(1, C(pal.c1, 0));
      ctx.fillStyle = rg;
      for (var pass = 0; pass < 3; pass++) { var wk = [1, 1.9, 3][pass]; ctx.globalAlpha = [.55, .3, .16][pass]; ctx.beginPath(); ctx.moveTo(rx - rw * .3 * wk, top); ctx.lineTo(rx + rw * .3 * wk, top); ctx.lineTo(rx + rw * 1.6 * wk + ry.lean * len, top + len); ctx.lineTo(rx - rw * 1.6 * wk + ry.lean * len, top + len); ctx.closePath(); ctx.fill() }
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = "source-over";

    /* caustic shimmer just under the surface */
    if (cam < camMax * .6) {
      ctx.globalCompositeOperation = "lighter"; ctx.lineWidth = 1;
      for (var cl = 0; cl < 4; cl++) { ctx.strokeStyle = C(pal.c1, (.07 - cl * .014) * (1 - depth * 1.5 > 0 ? 1 - depth * 1.5 : 0)); ctx.beginPath(); for (var cx2 = 0; cx2 <= W; cx2 += 12) { var cy2 = sy0 + 14 + cl * 20 + Math.sin(cx2 * .02 + t * (.8 + cl * .2) + cl) * 4 + Math.sin(cx2 * .05 - t) * 2; cx2 ? ctx.lineTo(cx2, cy2) : ctx.moveTo(cx2, cy2) } ctx.stroke() }
      ctx.globalCompositeOperation = "source-over";
    }

    /* marine snow */
    var uw = sm(depth * 3 + .0001) * .0 + 1;
    for (i = 0; i < L.snow.length; i++) {
      var sn = L.snow[i], yy = ((sn.y * H * 1.3 - cam * sn.z * .95 - t * 6 * sn.z) % (H * 1.3) + H * 1.3) % (H * 1.3) - H * .15, xx = sn.x * W + Math.sin(t * .3 * sn.z + sn.y * 9) * 14 * sn.z;
      if (yy < ysAt(xx) + 6 || yy > H) continue;
      var near = clamp(1 - Math.hypot(xx - ox, yy - oyS) / (R * 4), 0, 1); ctx.fillStyle = C(mixc(pal.moon, pal.c1, near), (.12 + .3 * near) * sn.z * uw); ctx.beginPath(); ctx.arc(xx, yy, sn.s * sn.z * (1 + near), 0, 6.283); ctx.fill();
    }

    /* creatures */
    for (i = 0; i < L.jelly.length; i++) jelly(L.jelly[i], cam, t, ox, oyS, R);
    ctx.globalCompositeOperation = "lighter";
    for (i = 0; i < L.fish.length; i++) {
      var sh = L.fish[i], span = W + 500, bx = (((sh.b + t * sh.v * sh.dir) % span) + span) % span - 250, by = hz - cam * sh.par + sh.d * H + Math.sin(t * .4 + sh.b) * 18;
      if (by < -80 || by > H + 80) continue;
      for (var j = 0; j < sh.f.length; j++) {
        var fi = sh.f[j], fx = bx + fi.ox + Math.sin(t * .8 + fi.p) * 10, fy = by + fi.oy + Math.cos(t * .6 + fi.p) * 6, fs = fi.s * (W < 700 ? 1.2 : 1.5), nb = clamp(1 - Math.hypot(fx - ox, fy - oyS) / (R * 5), 0, 1), dir = sh.dir, wag = Math.sin(t * 6 + fi.p) * fs * .35;
        ctx.fillStyle = C(mixc(pal.c1, [255, 255, 255], .2), .25 + .5 * nb);
        ctx.beginPath(); ctx.ellipse(fx, fy, fs * 1.7, fs * .7, 0, 0, 6.283); ctx.fill();
        ctx.beginPath(); ctx.moveTo(fx - dir * fs * 1.6, fy); ctx.lineTo(fx - dir * fs * 3, fy - fs * .9 + wag); ctx.lineTo(fx - dir * fs * 3, fy + fs * .9 + wag); ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";

    /* the orb's own light + the orb itself under the surface */
    if (oyS - ORR < maxY || oyS > sy0) {
      var lg = ctx.createRadialGradient(ox, oyS, ORR * .5, ox, oyS, H * .8); lg.addColorStop(0, C(pal.c1, .22 * sm(q * 2 + .3))); lg.addColorStop(.4, C(pal.c2, .07 * sm(q * 2))); lg.addColorStop(1, C(pal.c2, 0));
      ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = "source-over";
      if (both || oyS - ORR >= maxY) drawOrb(ox, oyS, ORR, t, glowA, true);
      else if (oyS > maxY) drawOrb(ox, oyS, ORR, t, glowA, true);
    }

    /* bubbles + sparks (underwater) */
    for (i = bubbles.length - 1; i >= 0; i--) {
      var bb = bubbles[i]; bb.l += dt; bb.y -= bb.v * dt; var by2 = bb.y - cam, bxx = bb.x + Math.sin(bb.l * 3 + bb.p) * 5;
      if (bb.l > 7 || by2 < ysAt(bxx)) { bubbles.splice(i, 1); continue }
      ctx.strokeStyle = C(mixc(pal.moon, pal.c1, .4), .5 * (1 - bb.l / 7)); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bxx, by2, bb.r, 0, 6.283); ctx.stroke();
    }
    ctx.globalCompositeOperation = "lighter";
    for (i = sparks.length - 1; i >= 0; i--) {
      var sk = sparks[i]; sk.l += dt; if (sk.l > sk.m) { sparks.splice(i, 1); continue }
      sk.x += sk.vx * dt; sk.y += sk.vy * dt; var kk = 1 - sk.l / sk.m, sc = mixc(pal.c1, pal.c2, sk.t), sy = sk.y - cam;
      var sg2 = ctx.createRadialGradient(sk.x, sy, 0, sk.x, sy, 10 * kk + 2); sg2.addColorStop(0, C(sc, .7 * kk)); sg2.addColorStop(1, C(sc, 0)); ctx.fillStyle = sg2; ctx.beginPath(); ctx.arc(sk.x, sy, 10 * kk + 2, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    /* surface rim light, foam, ripples */
    ctx.save(); ctx.lineJoin = "round";
    ctx.strokeStyle = C(mixc(pal.c1, [255, 255, 255], .35), .75); ctx.lineWidth = 1.6; ctx.shadowColor = C(pal.c1, .9); ctx.shadowBlur = 12; ctx.stroke(wavePath(cam, ""));
    ctx.restore();
    ctx.strokeStyle = C(pal.c1, .22); ctx.lineWidth = 1; ctx.save(); ctx.translate(0, 9); ctx.stroke(wavePath(cam, "")); ctx.restore();
    for (i = rings.length - 1; i >= 0; i--) {
      var rg2 = rings[i], age = t - rg2.t, life = rg2.big ? 3.2 : 1.8; if (age < 0) continue; if (age > life) { rings.splice(i, 1); continue }
      var rx = age * (rg2.big ? 150 : 90) * (W / 1000 + .3), kk2 = 1 - age / life, ry2 = rx * .13, rcy = rg2.y - cam;
      ctx.strokeStyle = C(pal.moon, .55 * kk2); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(rg2.x, rcy, rx, ry2, 0, 0, 6.283); ctx.stroke();
    }
    /* splash droplets */
    ctx.globalCompositeOperation = "lighter";
    for (i = drops.length - 1; i >= 0; i--) {
      var dp = drops[i]; dp.l += dt; dp.vy += H * 2.4 * dt; dp.x += dp.vx * dt; dp.y += dp.vy * dt; var dy = dp.y - cam;
      if (dp.l > 2.4 || (dp.vy > 0 && dy > ysAt(dp.x) + 4)) { drops.splice(i, 1); continue }
      var dk = 1 - dp.l / 2.4; ctx.fillStyle = C(mixc(pal.moon, pal.c1, .35), .85 * Math.min(1, dk * 2)); ctx.beginPath(); ctx.arc(dp.x, dy, dp.r, 0, 6.283); ctx.fill();
      ctx.fillStyle = C(pal.c1, .22 * dk); ctx.beginPath(); ctx.arc(dp.x, dy, dp.r * 3, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    /* seabed */
    var rise = sm((q - .7) / .3);
    if (rise > 0) {
      for (var layer = 0; layer < 2; layer++) {
        var base = H - rise * H * (.16 - layer * .06), dn = L.dunes;
        ctx.beginPath(); ctx.moveTo(0, H); for (var x3 = 0; x3 <= W; x3 += 10) ctx.lineTo(x3, base + Math.sin(x3 / W * dn.k * 6.283 + dn.a + layer * 2) * H * .018 + Math.sin(x3 / W * 9 + dn.b) * H * .007 + layer * 6);
        ctx.lineTo(W, H); ctx.closePath();
        var dg = ctx.createLinearGradient(0, base - 20, 0, H); dg.addColorStop(0, layer ? "rgba(4,7,13,1)" : C(mixc(pal.sea[2], pal.c1, .1)));  dg.addColorStop(1, "rgba(4,7,13,1)"); ctx.fillStyle = dg; ctx.fill();
        if (!layer) { ctx.strokeStyle = C(pal.c1, .3 * rise); ctx.lineWidth = 1; ctx.stroke() }
      }
    }
    var vg = ctx.createRadialGradient(W / 2, H * .5, Math.min(W, H) * .45, W / 2, H * .5, Math.max(W, H) * .8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,4,10,.5)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

    /* simulation steps */
    for (i = 0; i < pulses.length; i++) { var pu = pulses[i]; pu.t += pu.v * dt; if (pu.t > 1) { pu.t = 0; pu.e = Math.random() * edges.length | 0 } }
    if (oyS > ysAt(ox) && q > 0) { bubT -= dt; if (bubT < 0) { bubT = .1 + Math.random() * .12; bubbles.push({ x: ox + (Math.random() - .5) * ORR * 1.2, y: oyS + cam - ORR * .4, v: 35 + Math.random() * 55, r: 1 + Math.random() * 3.4, l: 0, p: Math.random() * 6 }) } }
    if (pxPix >= 0 && (pxPix !== lpx || pyPix !== lpy)) { handlePointer(cam, t); lpx = pxPix; lpy = pyPix }
    nextShoot -= dt; if (!shoot && nextShoot < 0 && cam < H * .3) { shoot = { x: Math.random() * W * .8, y: Math.random() * H * .25, vx: (Math.random() < .5 ? -1 : 1) * (W * .5 + Math.random() * W * .3), vy: H * .25 + Math.random() * H * .2, l: 0, m: .9 }; nextShoot = 6 + Math.random() * 8 }
    if (shoot) { shoot.l += dt; if (shoot.l > shoot.m) shoot = null }

    ui(pp, q);
  }
  var lpx = -1, lpy = -1;
  function spawnSplash(x, y, r) {
    var n = small ? 26 : 52, i;
    for (i = 0; i < n; i++) { var a = (Math.random() - .5) * 1.5, sp = H * (.55 + Math.random() * 1.15); drops.push({ x: x + (Math.random() - .5) * r * 1.3, y: y, vx: Math.sin(a) * sp * .6, vy: -Math.cos(a) * sp, r: .8 + Math.random() * 2.4, l: 0 }) }
    rings.push({ x: x, y: y, t: T, big: true }, { x: x, y: y, t: T + .18, big: true }, { x: x, y: y, t: T + .4, big: false });
  }
  function handlePointer(cam, t) {
    var sY = ysAt(pxPix), inWater = pyPix > sY;
    if (Math.abs(pyPix - sY) < 26 && Math.random() < .5) { var last = rings[rings.length - 1]; if (!last || t - last.t > .18 || Math.abs(last.x - pxPix) > 40) rings.push({ x: pxPix, y: sY + cam, t: t, big: false }) }
    if (inWater) for (var i = 0; i < 2; i++) sparks.push({ x: pxPix + (Math.random() - .5) * 14, y: pyPix + cam + (Math.random() - .5) * 14, vx: (Math.random() - .5) * 26, vy: -8 - Math.random() * 22, l: 0, m: .8 + Math.random() * 1.2, t: Math.random() });
    if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
  }

  /* ---------- html layer: captions, depth gauge ---------- */
  function ui(pp, q) {
    for (var i = 0; i < caps.length; i++) {
      var c = caps[i], a = +c.dataset.a, b = +c.dataset.b, f = +(c.dataset.f || .06), o = clamp((pp - a) / f, 0, 1) * clamp((b - pp) / f, 0, 1);
      c.style.opacity = o.toFixed(3); c.style.transform = "translate3d(0," + ((1 - o) * 22 * (pp < (a + b) / 2 ? 1 : -1)).toFixed(1) + "px,0)"; c.style.visibility = o > .01 ? "visible" : "hidden";
    }
    if (hint) hint.style.opacity = clamp(1 - pp * 14, 0, 1).toFixed(2);
    var v, lab;
    if (pp < FALL) { v = Math.round((1 - clamp(pp / FALL) * clamp(pp / FALL)) * 3200); lab = gaugeL.dataset.alt }
    else { v = Math.round(Math.pow(sm(q), 1.25) * 10935); lab = gaugeL.dataset.dep }
    gaugeN.textContent = v.toLocaleString("en-US"); if (gaugeL.textContent !== lab) gaugeL.textContent = lab;
    gaugeB.style.transform = "scaleY(" + clamp(pp, 0, 1).toFixed(3) + ")";
  }

  /* ---------- loop / scroll ---------- */
  function readP() { var r = sec.getBoundingClientRect(), tot = sec.offsetHeight - innerHeight; p = tot > 0 ? clamp(-r.top / tot, 0, 1) : .5 }
  function loop(now) {
    if (!running) return; var dt = Math.min(.05, (now - last) / 1e3 || .016); last = now; readP(); frame(now / 1e3, dt); requestAnimationFrame(loop);
  }
  function still() { p = ps = .55; size(); regen(); stepPal(1); for (var k = 0; k < 8; k++) frame(3 + k * .05, .05); }
  scene = { regen: function () { regen() }, still: function () { still() } };

  size(); regen();
  addEventListener("resize", function () { size() });
  sec.addEventListener("pointermove", function (e) {
    var r = cv.getBoundingClientRect(); pxPix = e.clientX - r.left; pyPix = e.clientY - r.top; px = pxPix / r.width; py = pyPix / r.height;
  }, { passive: true });
  sec.addEventListener("pointerleave", function () { pxPix = -1; px = .5; py = .5 });

  if (RM) { sec.classList.add("rm"); still(); return }
  new IntersectionObserver(function (es) {
    var on = es[0].isIntersecting;
    if (on && !running) { running = true; last = performance.now(); readP(); ps = p; requestAnimationFrame(loop) } else if (!on) running = false;
  }, { rootMargin: "80px" }).observe(sec);
  d.addEventListener("visibilitychange", function () { if (d.hidden) running = false; else { var r = sec.getBoundingClientRect(); if (r.bottom > -80 && r.top < innerHeight + 80 && !running) { running = true; last = performance.now(); requestAnimationFrame(loop) } } });
})();
