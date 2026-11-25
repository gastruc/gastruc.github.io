/* GeoSelect project page: animations and interactive figures. No dependency besides KaTeX (optional). */
(function () {
  'use strict';

  var BASE = '/assets/publications/geoselect/';
  var TILES = BASE + 'tiles/';
  var SVGNS = 'http://www.w3.org/2000/svg';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function h(tag, cls, html, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function sv(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function signed(v, d) { var s = Math.abs(v).toFixed(d); if (+s === 0) return s; return (v > 0 ? '+' : '−') + s; }
  function pad(i) { return (i < 10 ? '0' : '') + i; }
  function isDark() { return document.body.classList.contains('dark-theme'); }
  function cssVar(n) { return getComputedStyle(document.body).getPropertyValue(n).trim(); }

  function onVisible(el, cb, opts) {
    opts = opts || {};
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (opts.toggle) cb(e.isIntersecting);
        else if (e.isIntersecting) { cb(true); io.disconnect(); }
      });
    }, { threshold: opts.threshold != null ? opts.threshold : 0.2, rootMargin: opts.rootMargin || '0px 0px -6% 0px' });
    io.observe(el);
  }

  /* theme changes (the template toggles body.dark-theme) */
  var themeCbs = [];
  function onTheme(cb) { themeCbs.push(cb); }
  new MutationObserver(function () { themeCbs.forEach(function (cb) { cb(); }); })
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });

  function tween(dur, step, done) {
    var t0 = null;
    function f(now) {
      if (t0 === null) t0 = now;
      var p = clamp((now - t0) / dur, 0, 1);
      step(p);
      if (p < 1) requestAnimationFrame(f); else if (done) done();
    }
    requestAnimationFrame(f);
  }

  /* ================= reveal, progress bar, section spy ================= */
  function reveal(el) { onVisible(el, function () { el.classList.add('is-in'); }, { threshold: 0.12 }); }
  function stagger(el, step) {
    $$('.gs-tile', el).forEach(function (c, i) { c.style.transitionDelay = (i * (step || 40)) + 'ms'; });
    reveal(el);
  }

  function scrollUI() {
    var bar = $('.gs-progress span'), spy = $('.gs-spy');
    var links = spy ? $$('a', spy) : [];
    var secs = links.map(function (a) { return $(a.getAttribute('href')); });
    // section links of the template's top bar (front-matter `nav:`)
    var topLinks = $$('nav ul a[href^="#"]').filter(function (a) { return a.getAttribute('href').length > 1; });
    var ticking = false;
    function update() {
      ticking = false;
      var st = window.pageYOffset, max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? st / max : 0).toFixed(4) + ')';
      if (spy) {
        spy.classList.toggle('on', st > window.innerHeight * 0.6);
        var cur = -1;
        secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) cur = i; });
        links.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
        var curHref = cur >= 0 ? links[cur].getAttribute('href') : '';
        topLinks.forEach(function (a) { a.classList.toggle('gs-on', a.getAttribute('href') === curHref); });
      }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ================= counters ================= */
  function counters() {
    $$('.gs-count').forEach(function (el) {
      var to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0);
      var from = el.dataset.from != null ? parseFloat(el.dataset.from) : 0;
      el.textContent = from.toFixed(dec);
      onVisible(el, function () {
        tween(1500, function (p) { el.textContent = (from + (to - from) * easeOut(p)).toFixed(dec); });
      }, { threshold: 0.6 });
    });
  }

  /* ================= hero: the archive shrinks to 1% ================= */
  function hero() {
    var wrap = $('#gs-hero');
    if (!wrap) return;
    var cvs = $('.gs-hero-canvas', wrap), ctx = cvs.getContext('2d');
    var numEl = $('#gs-hero-count'), stEl = $('#gs-hero-state'), ctr = $('.gs-hero-counter', wrap);
    // hero_atlas.webp (hero_atlas.json): the first 60 tiles are kept by GeoSelect at 1% and only glow as survivors; the other
    // 171 fill the dimmed background: discarded by GeoSelect, of very low local diversity, or ordinary Major-TOM tiles
    var A = { T: 192, cols: 12, n: 231, kept: 60 };
    var N_ARCH = 2238687, N_KEEP = 22387;
    var TL = { sweep0: 2.0, sweepDur: 3.6, hold: 10.2, out: 11.2, end: 11.8 };
    var img = new Image(), ready = false;
    var W = 0, H = 0, dpr = 1, cell = 60, gap = 3, cells = [];
    var raf = 0, t0 = null, pausedAt = null, visible = true, lastTxt = '', lastSt = '';
    var HC = null;   // hero colours from the theme variables, re-read when the theme changes
    onTheme(function () { HC = null; });

    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

    function build() {
      var r = cvs.getBoundingClientRect();
      W = r.width; H = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr);
      cell = clamp(W / 12, 66, 138); gap = Math.max(2, Math.round(cell * 0.05));
      var cols = Math.ceil(W / cell) + 1, rows = Math.ceil(H / cell) + 1;
      var ox = (W - cols * cell) / 2, oy = (H - rows * cell) / 2;
      cells = [];
      for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++)
        cells.push({ x: ox + i * cell, y: oy + j * cell, tile: -1, d: Math.random(), keep: false });
      // about 1% of the cells survive (at least 3), placed where the title does not cover them
      var nk = Math.max(3, Math.round(cells.length * 0.01));
      var inView = function (c) { return c.x > 6 && c.y > 72 && c.x + cell < W - 6 && c.y + cell < H - 110; };
      var cand = shuffle(cells.filter(function (c) {
        return inView(c) && (Math.abs(c.x + cell / 2 - W / 2) > Math.min(W * 0.34, 430) || c.y + cell < H * 0.2);
      }));
      if (cand.length < nk) cand = cand.concat(shuffle(cells.filter(inView)));
      var picked = [];
      cand.forEach(function (c) {
        if (picked.length >= nk || picked.indexOf(c) >= 0) return;
        if (picked.every(function (p) { return Math.hypot(p.x - c.x, p.y - c.y) > cell * 2.6; })) picked.push(c);
      });
      var keptTiles = shuffle(range(A.kept));
      picked.forEach(function (c, i) { c.keep = true; c.tile = keptTiles[i % A.kept]; });
      // the other cells are dealt from a shuffled deck of the background tiles (never a kept one): a tile comes back only
      // once the deck is used up, and never next to itself
      var pool = range(A.n).slice(A.kept), deck = [];
      cells.forEach(function (c, k) {
        if (c.keep) return;
        var near = [k % cols ? cells[k - 1].tile : -1, k >= cols ? cells[k - cols].tile : -1, k >= cols && (k + 1) % cols ? cells[k - cols + 1].tile : -1];
        for (var tries = 0; tries < 4; tries++) {
          if (!deck.length) deck = shuffle(pool.slice());
          var t = deck.pop();
          if (near.indexOf(t) < 0 || tries === 3) { c.tile = t; break; }
          deck.unshift(t);
        }
      });
    }
    function range(n) { for (var a = [], i = 0; i < n; i++) a.push(i); return a; }

    function blit(c, x, y, s) {
      ctx.drawImage(img, (c.tile % A.cols) * A.T, Math.floor(c.tile / A.cols) * A.T, A.T, A.T, x, y, s, s);
    }

    function counter(p, t) {
      var txt, st;
      if (p <= 0) { txt = N_ARCH.toLocaleString('en-US'); st = 'tiles in the archive'; }
      else if (p < 1) { txt = Math.round(N_ARCH - (N_ARCH - N_KEEP) * easeOut(p)).toLocaleString('en-US'); st = 'curating…'; }
      else { txt = '≈ 22k'; st = 'tiles kept by GeoSelect (1%)'; }
      if (txt !== lastTxt) { numEl.textContent = txt; lastTxt = txt; }
      if (st !== lastSt) { stEl.textContent = st; lastSt = st; ctr.classList.toggle('done', p >= 1); }
    }

    function draw(t) {
      if (!ready || !W) return;
      var dark = isDark();
      if (!HC) HC = { bg: cssVar('--gs-hero-scrim') || (dark ? '5,7,11' : '255,255,255'), kc: cssVar('--gs-keep-rgb') || (dark ? '60,207,120' : '30,154,75') };
      var bg = HC.bg, kc = HC.kc;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var span = W + cell * 4;
      var sweepX = (t - TL.sweep0) / TL.sweepDur * span - cell * 2;
      var outA = t > TL.hold ? clamp(1 - (t - TL.hold) / (TL.out - TL.hold), 0, 1) : 1;
      var s = cell - gap, kept = [];
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        var ap = clamp((t - c.d * 1.2) / 0.55, 0, 1) * outA;
        if (ap <= 0) continue;
        var pass = clamp((sweepX - (c.x + cell / 2)) / (cell * 2.2), 0, 1);
        if (c.keep) { kept.push([c, ap, pass]); continue; }
        ctx.globalAlpha = ap;
        blit(c, c.x + gap / 2, c.y + gap / 2, s);
        if (pass > 0) {
          ctx.globalAlpha = ap * pass * (dark ? 0.87 : 0.8);
          ctx.fillStyle = 'rgb(' + bg + ')';
          ctx.fillRect(c.x + gap / 2, c.y + gap / 2, s, s);
        }
      }
      kept.forEach(function (k) {
        var c = k[0], ap = k[1], e = easeOut(k[2]);
        var ss = s * (1 + 0.16 * e), x = c.x + cell / 2 - ss / 2, y = c.y + cell / 2 - ss / 2;
        if (e > 0) {
          ctx.save();
          ctx.globalAlpha = ap * e;
          ctx.shadowColor = 'rgba(' + kc + ',0.9)';
          ctx.shadowBlur = 30 * e;
          ctx.fillStyle = 'rgb(' + kc + ')';
          ctx.fillRect(x - 3, y - 3, ss + 6, ss + 6);
          ctx.restore();
        }
        ctx.globalAlpha = ap;
        blit(c, x, y, ss);
      });
      if (sweepX > -cell && sweepX < W + cell) {
        ctx.globalAlpha = 1;
        var g = ctx.createLinearGradient(sweepX - 90, 0, sweepX, 0);
        g.addColorStop(0, 'rgba(' + kc + ',0)');
        g.addColorStop(1, 'rgba(' + kc + ',0.28)');
        ctx.fillStyle = g; ctx.fillRect(sweepX - 90, 0, 90, H);
        ctx.fillStyle = 'rgba(' + kc + ',0.95)'; ctx.fillRect(sweepX - 1, 0, 2, H);
      }
      ctx.globalAlpha = 1;
      counter(t < TL.sweep0 ? 0 : clamp((sweepX + cell * 2) / span, 0, 1), t);
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (t0 === null) t0 = now;
      var t = (now - t0) / 1000;
      if (t > TL.end) { t0 = now; t = 0; build(); }
      draw(t);
    }
    function play() { if (!raf && ready && visible) { if (pausedAt !== null && t0 !== null) t0 += performance.now() - pausedAt; pausedAt = null; raf = requestAnimationFrame(frame); } }
    function pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; pausedAt = performance.now(); } }

    img.onload = function () {
      ready = true; build();
      play();
    };
    img.src = BASE + 'hero_atlas.webp?v=20261123e';   // versioned: the tile size and count change with the atlas
    onVisible(wrap, function (v) { visible = v; if (v) play(); else pause(); }, { toggle: true, threshold: 0, rootMargin: '0px' });
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else play(); });
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (ready) build(); }, 150);
    });
  }

  /* ================= overview: every strategy at 1% ================= */
  function race() {
    var card = $('#gs-race');
    if (!card) return;
    var box = $('.gs-race', card);
    var names = ['Random sampling', 'DINOv2 SemDeDup', 'Soil stratified', 'Europe subset', 'Hier. k-means', 'pHash + hier. k-means',
      'Urban, top-%', 'Land-cover stratified', 'UniverSat SemDeDup', 'Climate stratified', 'GeoSelect'];
    var cat = ['geo', 'sem', 'meta', 'geo', 'sem', 'sem', 'geo', 'meta', 'sem', 'meta', 'ours'];
    var D = {
      all: [-1.54, -0.24, 0.17, 0.18, 0.41, 0.58, 0.76, 1.13, 1.21, 1.27, 2.31],
      cls: [-0.9, 0.3, -0.1, -0.4, 0.5, 0.7, -0.5, 1.1, 1.0, 1.0, 2.4],
      seg: [-2.2, -0.8, 0.5, 0.8, 0.4, 0.4, 2.0, 1.2, 1.5, 1.6, 2.2]
    };
    var MIN = -2.6, MAX = 2.8;
    function X(v) { return (v - MIN) / (MAX - MIN) * 100; }
    var rowH = parseFloat(getComputedStyle(box).getPropertyValue('--row')) || 34;
    box.style.height = (names.length * rowH + 30) + 'px';
    box.style.marginTop = '26px';
    var ax = h('div', 'gs-race-axis', null, box);
    [-2, -1, 0, 1, 2].forEach(function (v) {
      var g = h('div', 'gs-race-grid' + (v === 0 ? ' zero' : ''), null, ax); g.style.left = X(v) + '%';
      var tk = h('div', 'gs-race-tick', v === 0 ? '0' : signed(v, 0), ax); tk.style.left = X(v) + '%';
    });
    var zl = h('div', 'gs-race-zero-lbl', 'full archive (2.2M tiles)', ax); zl.style.left = X(0) + '%';
    var rows = names.map(function (n, i) {
      var r = h('div', 'gs-race-row' + (cat[i] === 'ours' ? ' ours' : ''), null, box);
      h('div', 'gs-race-name', n, r);
      var tr = h('div', 'gs-race-track', null, r);
      var b = h('div', 'gs-race-bar c-' + cat[i], null, tr);
      var v = h('div', 'gs-race-val', '0.0', r);
      b.style.left = X(0) + '%'; b.style.width = '0%';
      return { r: r, b: b, v: v, cur: 0 };
    });
    var key = 'all', shown = false;
    function layout() {
      var vals = D[key];
      var order = vals.map(function (v, i) { return i; }).sort(function (a, b) { return vals[b] - vals[a]; });
      order.forEach(function (idx, rank) { rows[idx].r.style.transform = 'translateY(' + (rank * rowH) + 'px)'; });
      rows.forEach(function (o, i) {
        var v = shown ? vals[i] : 0, a = X(Math.min(0, v)), b = X(Math.max(0, v));
        o.b.style.left = a + '%'; o.b.style.width = (b - a) + '%';
        var from = o.cur, to = v;
        tween(900, function (p) { o.cur = from + (to - from) * easeInOut(p); o.v.textContent = signed(o.cur, 1); });
      });
    }
    layout();
    onVisible(card, function () { shown = true; setTimeout(layout, 150); }, { threshold: 0.3 });
    $$('.gs-seg button', card).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.gs-seg button', card).forEach(function (b) { b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
        key = btn.dataset.k; shown = true; layout();
      });
    });
  }

  /* ================= wipe viewer (image vs tokens, or two look-alikes) ================= */
  function Wipe(el) {
    var self = this, x = 0.5, auto = true, drag = false, raf = 0, phase = Math.random() * 6;
    var a = $('.gs-wipe-a', el), b = $('.gs-wipe-b', el);
    el.tabIndex = 0;
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100');
    function set(v) { x = clamp(v, 0, 1); el.style.setProperty('--x', (x * 100).toFixed(2) + '%'); el.setAttribute('aria-valuenow', Math.round(x * 100)); }
    function loop(now) {
      raf = requestAnimationFrame(loop);
      if (!auto || drag) return;
      set(0.5 + 0.33 * Math.sin(now / 1000 * 0.9 + phase));
    }
    function stop() { auto = false; }
    function pos(e) { var r = el.getBoundingClientRect(); set((e.clientX - r.left) / r.width); }
    el.addEventListener('pointerdown', function (e) { stop(); drag = true; try { el.setPointerCapture(e.pointerId); } catch (_) { } pos(e); });
    el.addEventListener('pointermove', function (e) { if (drag || e.pointerType === 'mouse') { if (e.pointerType === 'mouse') stop(); pos(e); } });
    el.addEventListener('pointerup', function () { drag = false; });
    el.addEventListener('pointercancel', function () { drag = false; });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { stop(); set(x + (e.key === 'ArrowLeft' ? -0.05 : 0.05)); e.preventDefault(); }
    });
    onVisible(el, function (v) {
      if (v && auto && !raf) raf = requestAnimationFrame(loop);
      else if (!v && raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { toggle: true, threshold: 0.05, rootMargin: '0px' });
    set(0.5);
    function swap(img, src) {
      if (img.getAttribute('src') === src) return;
      img.src = src;
      img.classList.remove('gs-swap'); void img.offsetWidth; img.classList.add('gs-swap');
    }
    self.setImages = function (sa, sb) { swap(a, sa); swap(b, sb); };
  }

  /* ================= method 1: local diversity spectrum ================= */
  function spectrum() {
    var root = $('#gs-spec');
    if (!root) return;
    var P = ['0.5', '10', '25', '50', '75', '90', '97', '99.5'];
    var range = $('input', root), read = $('#gs-spec-p'), strip = $('.gs-spec-strip', root), ticks = $$('.gs-spec-ticks span', root);
    var views = $$('.gs-wipe', root).map(function (w) { return new Wipe(w); });
    var cells = P.map(function (p, k) {
      var s = h('span', null, null, strip);
      s.style.backgroundImage = 'url(' + TILES + 'spec_' + pad(2 * k + 1) + '.webp)';
      return s;
    });
    function src(i, tok) { return TILES + 'spec_' + pad(i) + (tok ? '_tok' : '') + '.webp'; }
    var k = -1, timer = null, auto = true;
    function set(n) {
      if (n === k) return;
      k = n; range.value = n; read.textContent = P[n];
      cells.forEach(function (c, i) { c.classList.toggle('on', i === n); });
      ticks.forEach(function (c, i) { c.classList.toggle('on', i === n); });
      views.forEach(function (v, j) { v.setImages(src(2 * n + j, false), src(2 * n + j, true)); });
    }
    set(0);
    onVisible(root, function () { for (var i = 0; i < 16; i++) { new Image().src = src(i, false); new Image().src = src(i, true); } }, { threshold: 0, rootMargin: '400px 0px' });
    function stopAuto() { auto = false; clearInterval(timer); timer = null; }
    range.addEventListener('input', function () { stopAuto(); set(+range.value); });
    root.addEventListener('pointerdown', stopAuto);
    onVisible(root, function (v) {
      if (v && auto && !timer) timer = setInterval(function () { set((k + 1) % P.length); }, 2600);
      else if (!v && timer) { clearInterval(timer); timer = null; }
    }, { toggle: true, threshold: 0.4 });
  }

  /* ================= method 2: global diversity on a toy cluster ================= */
  function toyData() {
    var s = 11;
    function rnd() { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    function gauss() { var u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    var cx = 300, cy = 215, pts = [];
    // look-alike pairs: a locally rich tile and an internally uniform look-alike next to it. Which of the two is farther
    // from the centroid alternates, since that is unrelated to local diversity.
    [[168, 150], [420, 132], [474, 268], [214, 300], [338, 318], [292, 170]].forEach(function (p, k) {
      var dx = p[0] - cx, dy = p[1] - cy, n = Math.hypot(dx, dy) || 1, sgn = k % 2 ? -1 : 1;
      pts.push({ x: p[0], y: p[1], L: 0.72 + rnd() * 0.26, pair: k, rich: true });
      pts.push({ x: p[0] + sgn * dx / n * 11, y: p[1] + sgn * dy / n * 11, L: 0.06 + rnd() * 0.14, pair: k, rich: false });
    });
    var guard = 0;
    while (pts.length < 28 && guard++ < 5000) {
      var x = cx + gauss() * 125, y = cy + gauss() * 72;
      if (x < 46 || x > 554 || y < 58 || y > 372) continue;
      if (pts.some(function (q) { return Math.hypot(q.x - x, q.y - y) < 34; })) continue;
      var L = 0.08 + rnd() * 0.84;
      pts.push({ x: x, y: y, L: L, pair: -1, rich: L > 0.5 });
    }
    return { pts: pts, cx: cx, cy: cy };
  }

  function toySelect(data, mode, B) {
    var pts = data.pts, n = pts.length, i, j;
    var order = pts.map(function (p, i) { return i; });
    if (mode === 'geo') order.sort(function (a, b) { return pts[b].L - pts[a].L; });
    else order.sort(function (a, b) { return Math.hypot(pts[b].x - data.cx, pts[b].y - data.cy) - Math.hypot(pts[a].x - data.cx, pts[a].y - data.cy); });
    var prev = new Array(n), dist = new Array(n);
    for (var r = 0; r < n; r++) {
      i = order[r]; var best = -1, bd = Infinity;
      for (var q = 0; q < r; q++) { j = order[q]; var d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y); if (d < bd) { bd = d; best = j; } }
      prev[i] = best; dist[i] = best < 0 ? Infinity : bd;
    }
    var score;
    if (mode === 'geo') {
      var finite = dist.filter(isFinite), maxd = Math.max.apply(null, finite);
      var G = dist.map(function (d) { return isFinite(d) ? d : 2 * maxd; });
      var lg = G.map(Math.log), L = pts.map(function (p) { return p.L; });
      var iqr = function (a) { var b = a.slice().sort(function (x, y) { return x - y; }); var q = function (t) { var k = (b.length - 1) * t, f = Math.floor(k); return b[f] + (b[Math.min(f + 1, b.length - 1)] - b[f]) * (k - f); }; return q(0.75) - q(0.25) || 1; };
      var il = iqr(lg), iL = iqr(L);
      score = pts.map(function (p, k) { return lg[k] / il + L[k] / iL; });
    } else {
      score = dist.map(function (d) { return isFinite(d) ? d : 1e9; });   // lowest redundancy m_i first
    }
    var rank = pts.map(function (p, i) { return i; }).sort(function (a, b) { return score[b] - score[a]; });
    var kept = {}; rank.slice(0, B).forEach(function (i) { kept[i] = true; });
    return { order: order, prev: prev, dist: dist, kept: kept };
  }

  function toy() {
    var root = $('#gs-toy');
    if (!root) return;
    var svg = $('.gs-toy-svg', root), score = $('.gs-toy-score', root);
    var data = toyData(), B = 11, mode = 'geo', runId = 0, started = false;
    var pts = data.pts;
    // static layer
    sv('ellipse', { class: 'hull', cx: data.cx, cy: data.cy, rx: 282, ry: 178 }, svg);
    sv('path', { class: 'ctr', d: 'M' + (data.cx - 6) + ' ' + data.cy + 'h12M' + data.cx + ' ' + (data.cy - 6) + 'v12', stroke: 'currentColor', 'stroke-width': 2, style: 'stroke:var(--gs-muted)' }, svg);
    var cl = sv('text', { class: 'ctr-lbl', x: data.cx + 9, y: data.cy + 16 }, svg); cl.textContent = 'centroid';
    var stepLbl = sv('text', { class: 'step-lbl', x: 16, y: 26 }, svg);
    var links = sv('g', {}, svg), marks = sv('g', {}, svg), dots = sv('g', {}, svg);
    var els = pts.map(function (p) {
      var g = sv('g', { class: 'pt' + (p.L > 0.5 ? ' rich' : '') }, dots);
      var r = 4 + 10 * p.L;
      sv('circle', { class: 'ring', cx: p.x, cy: p.y, r: r + 4.5 }, g);
      sv('circle', { class: 'body', cx: p.x, cy: p.y, r: r }, g);
      return g;
    });
    function clear() {
      while (links.firstChild) links.removeChild(links.firstChild);
      while (marks.firstChild) marks.removeChild(marks.firstChild);
      els.forEach(function (g) { g.setAttribute('class', 'pt idle' + (g.getAttribute('class').indexOf('rich') >= 0 ? ' rich' : '')); });
    }
    function setCls(i, extra) { els[i].setAttribute('class', 'pt' + (pts[i].L > 0.5 ? ' rich' : '') + (extra ? ' ' + extra : '')); }
    function link(i, j, dup, animate) {
      var l = sv('line', { class: 'lnk' + (dup ? ' dup' : ''), x1: pts[i].x, y1: pts[i].y, x2: pts[j].x, y2: pts[j].y }, links);
      if (animate) {
        var len = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        l.style.strokeDasharray = len; l.style.strokeDashoffset = len;
        l.style.transition = 'stroke-dashoffset 0.32s ease-out';
        requestAnimationFrame(function () { requestAnimationFrame(function () { l.style.strokeDashoffset = 0; }); });
      }
      if (dup) {
        var p = pts[i], r = 4 + 10 * p.L + 3;
        sv('path', { class: 'xmark', d: 'M' + (p.x - r) + ' ' + (p.y - r) + 'l' + (2 * r) + ' ' + (2 * r) + 'M' + (p.x + r) + ' ' + (p.y - r) + 'l' + (-2 * r) + ' ' + (2 * r) }, marks);
      }
    }
    function summary(res) {
      var pairs = {}, nPairs = 0, richKept = 0, unifKept = 0, nk = 0, sumL = 0;
      pts.forEach(function (p, i) {
        if (res.kept[i]) { nk++; sumL += p.L; }
        if (p.pair >= 0) { pairs[p.pair] = pairs[p.pair] || {}; pairs[p.pair][p.rich ? 'r' : 'u'] = !!res.kept[i]; }
      });
      Object.keys(pairs).forEach(function (k) { nPairs++; if (pairs[k].r && !pairs[k].u) richKept++; if (pairs[k].u && !pairs[k].r) unifKept++; });
      var line2 = 'look-alike pairs: rich kept <b>' + richKept + '/' + nPairs + '</b> &middot; ' +
        (unifKept ? '<span class="bad">uniform kept ' + unifKept + '/' + nPairs + '</span>' : 'uniform kept <b>0/' + nPairs + '</b>');
      score.innerHTML = 'kept ' + nk + ' of ' + pts.length + ' &middot; mean L of kept: <b>' + (sumL / nk).toFixed(2) + '</b><br>' + line2;
    }
    function run() {
      var id = ++runId, res = toySelect(data, mode, B);
      clear();
      score.innerHTML = '&nbsp;<br>&nbsp;';
      stepLbl.textContent = mode === 'geo' ? '1. visit by decreasing local diversity' : '1. visit by decreasing distance to the centroid';
      var finish = function () {
        if (id !== runId) return;
        stepLbl.textContent = mode === 'geo' ? '2. keep the ' + B + ' highest scores S' : '2. keep the ' + B + ' least redundant (lowest m)';
        pts.forEach(function (p, i) { setCls(i, res.kept[i] ? 'kept' : 'drop'); });
        links.style.opacity = 0.25; marks.style.opacity = 0.35;
        summary(res);
      };
      links.style.opacity = 1; marks.style.opacity = 1;
      var r = 0, step = 150;
      (function next() {
        if (id !== runId) return;
        if (r > 0) setCls(res.order[r - 1], '');
        if (r >= res.order.length) { setTimeout(finish, 450); return; }
        var i = res.order[r];
        setCls(i, 'cur');
        if (res.prev[i] >= 0) link(i, res.prev[i], res.dist[i] < 16, true);
        r++;
        setTimeout(next, res.dist[i] < 16 ? step * 3 : step);
      })();
    }
    clear();
    $$('.gs-seg button', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.gs-seg button', root).forEach(function (b) { b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
        mode = btn.dataset.k; started = true; run();
      });
    });
    $('[data-act="replay"]', root).addEventListener('click', function () { started = true; run(); });
    onVisible(root, function () { if (!started) { started = true; run(); } }, { threshold: 0.45 });
  }

  /* ================= method 3: budget allocation across real clusters ================= */
  function alloc() {
    var root = $('#gs-alloc');
    if (!root) return;
    var D = [
      { low: { name: 'Open sea', N: 1323, B: 1 }, high: { name: 'Coastlines', N: 124, B: 69 }, flags: 'KDDKD' },
      { low: { name: 'Ice sheet', N: 679, B: 1 }, high: { name: 'Glaciated relief', N: 139, B: 25 }, flags: 'DDKDD' },
      { low: { name: 'Closed rainforest', N: 569, B: 1 }, high: { name: 'Rivers through rainforest', N: 121, B: 23 }, flags: 'KKDDK' },
      { low: { name: 'Sand sea', N: 466, B: 1 }, high: { name: 'Desert coasts', N: 104, B: 28 }, flags: 'DKKDD' }
    ];
    var sides = { low: $('[data-side="low"]', root), high: $('[data-side="high"]', root) };
    var cur = 0, anim = { p: 1 }, seen = false;
    function share(c) { var v = c.B / c.N * 100; return (v < 1 ? v.toFixed(2) : v.toFixed(0)) + '% kept'; }
    function fill(sideKey, c, idx) {
      var el = sides[sideKey];
      $('.gs-alloc-name', el).textContent = c.name;
      $('.gs-alloc-share', el).textContent = share(c);
      $('.gs-alloc-nums', el).innerHTML = 'N<sub>c</sub> = ' + c.N.toLocaleString('en-US') + ' tiles &middot; B<sub>c</sub> = ' + c.B;
      var tl = $('.gs-alloc-tiles', el);
      tl.innerHTML = '';
      for (var j = 0; j < 5; j++) {
        var col = sideKey === 'low' ? j : j + 5;
        var keep = sideKey === 'low' ? j === 0 : D[idx].flags[j] === 'K';
        var d = h('div', keep ? 'k' : '', null, tl);
        var im = h('img', null, null, d);
        im.src = TILES + 'alloc_' + idx + '_' + col + '.webp'; im.alt = c.name + (keep ? ', kept' : ', discarded'); im.loading = 'lazy';
        (function (d, j) { setTimeout(function () { d.classList.add('in'); }, 120 + j * 80); })(d, j);
      }
    }
    function drawWaffles() {
      var pair = D[cur];
      var keep = cssVar('--gs-keep'), base = cssVar('--gs-line'), glow = cssVar('--gs-keep-rgb');
      var cvL = $('canvas', sides.low), cvH = $('canvas', sides.high);
      var w = cvL.clientWidth, hgt = cvL.clientHeight;
      if (!w) return;
      var nMax = Math.max(pair.low.N, pair.high.N);
      var cs = Math.max(3, Math.floor(Math.sqrt(w * hgt / nMax / 1.15)));
      [[cvL, pair.low], [cvH, pair.high]].forEach(function (x) {
        var cv = x[0], c = x[1], dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(w * dpr); cv.height = Math.round(hgt * dpr);
        var ctx = cv.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, hgt);
        var cols = Math.floor(w / cs), g = cs > 4 ? 1 : 0.6;
        var pIn = clamp(anim.p / 0.55, 0, 1), pLit = clamp((anim.p - 0.45) / 0.55, 0, 1);
        var shownN = Math.floor(c.N * easeOut(pIn)), lit = Math.round(c.B * easeOut(pLit));
        ctx.fillStyle = base;
        for (var i = 0; i < shownN; i++) ctx.fillRect((i % cols) * cs, Math.floor(i / cols) * cs, cs - g, cs - g);
        // lit tiles: spread through the cluster so a single slot reads as one out of many
        var step = c.N / c.B;
        for (var k = 0; k < lit; k++) {
          var idx = Math.min(c.N - 1, Math.floor(k * step + step / 2));
          var x0 = (idx % cols) * cs, y0 = Math.floor(idx / cols) * cs;
          if (c.B <= 2) {
            ctx.save(); ctx.shadowColor = 'rgba(' + glow + ',0.95)'; ctx.shadowBlur = 14;
            ctx.fillStyle = keep; ctx.fillRect(x0 - 1.5, y0 - 1.5, cs - g + 3, cs - g + 3); ctx.restore();
          } else { ctx.fillStyle = keep; ctx.fillRect(x0, y0, cs - g, cs - g); }
        }
      });
    }
    function show(i) {
      cur = i;
      $$('.gs-seg button', root).forEach(function (b) { b.setAttribute('aria-selected', +b.dataset.k === i ? 'true' : 'false'); });
      fill('low', D[i].low, i); fill('high', D[i].high, i);
      anim.p = 0;
      tween(1700, function (p) { anim.p = p; drawWaffles(); });
    }
    $$('.gs-seg button', root).forEach(function (b) { b.addEventListener('click', function () { show(+b.dataset.k); }); });
    onVisible(root, function () { seen = true; show(0); }, { threshold: 0.35 });
    fill('low', D[0].low, 0); fill('high', D[0].high, 0); anim.p = 0;
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (seen) drawWaffles(); }, 120); });
    onTheme(function () { if (seen) drawWaffles(); });
  }

  /* ================= results: table 1 ================= */
  function table() {
    var t = $('#gs-table');
    if (!t) return;
    var cols = ['So2Sat', 'BEN', 'Forest&shy;Net', 'Euro&shy;SAT', 'PV4GER', 'Mean', 'Cashew', 'Chesa&shy;peake', 'SA Crop', 'Neon&shy;Tree', 'PV4GER', 'Mean'];
    var R = [
      ['Full dataset', '', '100%', [42.0, 53.4, 47.9, 78.1, 92.9, 62.9, 36.1, 57.4, 27.1, 53.5, 76.9, 50.2], 'full'],
      ['Official subset', '', '11%', [0.3, -1.5, -3.3, -1.6, 1.2, -1.0, -1.6, 0.7, -0.5, -0.2, -0.8, -0.5], 'ref'],
      ['Uniform', 'random', '1%', [0.5, -3.6, -1.9, 0.5, 0.0, -0.9, -2.3, -2.6, -1.1, -0.9, -4.0, -2.2], ''],
      ['Europe', 'subset', '1%', [-1.2, -0.1, -1.1, 1.0, -0.6, -0.4, 1.0, 1.3, -0.2, 0.2, 1.6, 0.8], ''],
      ['Urban', 'top-%', '1%', [-5.0, 0.1, -0.7, 3.1, -0.1, -0.5, 5.6, 1.9, -1.1, -0.1, 3.8, 2.0], ''],
      ['Land cover', 'stratified', '1%', [1.0, 0.8, 1.1, 2.2, 0.4, 1.1, 1.4, 1.5, -0.1, 0.0, 2.9, 1.2], ''],
      ['Climate', 'stratified', '1%', [-0.4, 1.2, 1.3, 2.7, 0.2, 1.0, 2.5, 2.5, -0.1, 0.0, 2.9, 1.6], ''],
      ['Soil', 'stratified', '1%', [-0.7, -0.5, 0.2, 0.5, -0.1, -0.1, 1.5, 0.7, 0.0, -0.2, 0.3, 0.5], ''],
      ['UniverSat', 'Hier. k-means', '1%', [0.0, 0.2, 1.0, 1.4, -0.3, 0.5, -0.1, 0.6, 0.4, -0.1, 1.0, 0.4], 'grp'],
      ['UniverSat', 'pHash + hier. k-m.', '1%', [0.3, -0.4, 1.1, 2.8, -0.3, 0.7, 0.7, 0.6, 0.1, 0.1, 0.7, 0.4], ''],
      ['DINOv2', 'SemDeDup', '1%', [1.7, -1.1, -1.2, 2.6, -0.5, 0.3, -1.9, -0.7, 0.2, -0.4, -1.1, -0.8], ''],
      ['UniverSat', 'SemDeDup', '1%', [-0.8, 1.1, 0.1, 4.6, -0.1, 1.0, 2.6, 1.8, 0.5, 0.1, 2.4, 1.5], ''],
      ['UniverSat', 'GeoSelect', '1%', [0.3, 2.6, 2.7, 5.4, 1.0, 2.4, 4.2, 2.9, 0.3, 0.2, 3.5, 2.2], 'ours']
    ];
    var best = cols.map(function (c, j) {
      return Math.max.apply(null, R.filter(function (r) { return r[2] === '1%'; }).map(function (r) { return r[3][j]; }));
    });
    var html = '<thead><tr class="grp"><th class="l" colspan="3">Curation</th><th class="sep"></th><th class="span" colspan="6">Classification</th><th class="sep"></th><th class="span" colspan="6">Segmentation</th></tr>';
    html += '<tr><th class="l">Criterion / features</th><th class="l">Sampling</th><th>Kept</th><th class="sep"></th>';
    cols.forEach(function (c, j) { html += '<th' + (j === 5 || j === 11 ? ' class="mean"' : '') + '>' + c + '</th>' + (j === 5 ? '<th class="sep"></th>' : ''); });
    html += '</tr></thead><tbody>';
    R.forEach(function (r, i) {
      html += '<tr class="' + r[4] + '" style="transition-delay:' + (i * 45) + 'ms">';
      if (r[4] === 'full' || r[4] === 'ref') html += '<td class="l" colspan="2">' + r[0] + '</td>';
      else html += '<td class="l">' + r[0] + '</td><td class="l">' + r[1] + (r[4] === 'ours' ? '<span class="gs-tag-ours">ours</span>' : '') + '</td>';
      html += '<td class="num">' + r[2] + '</td><td class="sep"></td>';
      r[3].forEach(function (v, j) {
        var mean = j === 5 || j === 11 ? ' mean' : '';
        if (r[4] === 'full') html += '<td class="num' + mean + '">' + v.toFixed(1) + '</td>';
        else {
          // mean columns span a smaller range: saturate them sooner so they read first
          var a = Math.abs(v) < 0.05 ? 0 : mean ? 0.14 + 0.62 * Math.min(1, Math.abs(v) / 2.4) : 0.1 + 0.55 * Math.min(1, Math.abs(v) / 3.2);
          var col = v >= 0 ? 'var(--gs-ours-rgb)' : 'var(--gs-drop-rgb)';
          var b = r[2] === '1%' && v === best[j] ? ' best' : '';
          html += '<td class="num' + mean + b + '"><span class="heat" style="background:rgba(' + col + ',' + a.toFixed(3) + ');transition-delay:' + (300 + i * 45 + j * 18) + 'ms"></span><span class="cell">' + signed(v, 1) + '</span></td>';
        }
        if (j === 5) html += '<td class="sep"></td>';
      });
      html += '</tr>';
    });
    t.innerHTML = html + '</tbody>';
    reveal(t);
  }

  /* ================= results: small bar charts ================= */
  // Vertical bars of signed gains, on a shared [min, max] axis (min < 0 draws a zero line).
  function miniBars(container, groups, klass, max, min) {
    min = Math.min(0, min || 0);
    var span = max - min, zero = -min / span * 100, bars = [];
    groups.forEach(function (gr) {
      var m = h('div', 'gs-mini', null, container);
      h('div', 'gs-mini-t', gr.t + '<span>' + gr.s + '</span>', m);
      var plot = h('div', 'gs-mini-plot' + (min < 0 ? ' has-neg' : ''), null, m);
      if (min < 0) h('div', 'gs-mini-zero', null, plot).style.bottom = zero.toFixed(2) + '%';
      gr.v.forEach(function (v, i) {
        var col = h('div', 'gs-vcol', null, plot);
        var b = h('div', 'gs-vbar ' + klass[i] + (v < 0 ? ' neg' : ''), '<span>' + signed(v, 1) + '</span>', col);
        if (v < 0) b.style.top = (100 - zero).toFixed(2) + '%'; else b.style.bottom = zero.toFixed(2) + '%';
        b.dataset.h = (Math.abs(v) / span * 100).toFixed(1);
        b.style.transitionDelay = (i * 120) + 'ms';
        bars.push(b);
      });
    });
    onVisible(container, function () {
      container.classList.add('is-in');
      bars.forEach(function (b) { b.style.height = b.dataset.h + '%'; });
    }, { threshold: 0.35 });
  }

  // "1% subsets / 10% subsets" tabs of a card (opening on 1%): re-render its chart and show the matching note.
  function budgetTabs(card, render) {
    var tabs = $$('.gs-budget button', card), notes = $$('.gs-bnote', card), cur = null;
    function set(k) {
      if (k === cur) return;
      cur = k;
      tabs.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.k === k ? 'true' : 'false'); });
      notes.forEach(function (p) { p.style.display = p.dataset.k === k ? '' : 'none'; });
      render(k);
    }
    tabs.forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.k); }); });
    set('1');
  }

  function ssl() {
    var c = $('#gs-ssl .gs-ssl');
    if (!c) return;
    // Main-paper Table 3 (tables/ssl_transfer_knn.tex), i.e. the 10% subsets; the page does not state the budget here
    // (user, 2026-11-24). Gains = printed value - printed full-archive value (arXiv convention).
    // [label, full archive, [Urban top-%, UniverSat SemDeDup, GeoSelect]]
    [
      { n: 'DINOv2', g: [['k-NN &middot; cls.', 57.3, [3.7, 2.9, 3.8]], ['LP &middot; cls.', 63.8, [3.5, 1.9, 3.8]], ['LP &middot; seg.', 48.6, [3.2, 2.2, 3.4]]] },
      { n: 'LeJEPA', g: [['k-NN &middot; cls.', 55.6, [3.0, 3.2, 4.5]], ['LP &middot; cls.', 63.3, [2.4, 1.2, 4.0]], ['LP &middot; seg.', 48.4, [1.8, 1.4, 2.6]]] }
    ].forEach(function (o) {
      h('div', 'gs-ssl-obj', o.n, c);
      miniBars(h('div', 'gs-ssl-row', null, c), o.g.map(function (g) {
        return { t: g[0], s: 'full ' + g[1].toFixed(1), v: g[2] };
      }), ['urban', 'sem', 'ours'], 5.0);
    });
  }

  function xmod() {
    var card = $('#gs-xmod'), c = card && $('.gs-xmod', card), par = card && $('.gs-par', card);
    if (!c) return;
    var lg = h('div', 'gs-mini-legend', '<span><i></i>curated from Sentinel-1</span><span><i></i>curated from Sentinel-2</span>');
    c.parentNode.insertBefore(lg, c);
    $$('i', lg)[0].style.background = 'var(--gs-unif)'; $$('i', lg)[1].style.background = 'var(--gs-keep)';
    // MAE on Core-S1RTC. 1%: main-paper Table 4 (tables/modality_transfer.tex); 10%: Table S4 (tables/modality_transfer_1pct.tex).
    // Gains = printed value - printed full-archive value, as in Table 4 (Table S4 prints unrounded differences: +2.7, -0.4).
    // Full archive: reBEN-S1 k-NN 54.0, LP 59.6, Sen1Floods11 79.0. [from Sentinel-1, from Sentinel-2]
    var D = {
      '10': { knn: [2.6, 0.8], lp: [1.2, 1.8], seg: ['79.1', '79.1'], x: 10 },
      '1': { knn: [2.3, -0.5], lp: [1.6, 0.7], seg: ['79.0', '79.1'], x: 100 }
    };
    budgetTabs(card, function (k) {
      var d = D[k];
      c.innerHTML = '';
      miniBars(c, [
        { t: 'reBEN-S1 &middot; k-NN', s: 'full archive 54.0', v: d.knn },
        { t: 'reBEN-S1 &middot; LP', s: 'full archive 59.6', v: d.lp }
      ], ['s1', 's2'], 3.0, -1.0);
      if (!par) return;
      // Flood segmentation is flat (within 0.1 mIoU), so it is shown as absolute mIoU next to the data each model saw.
      par.innerHTML = '<div class="gs-par-t">Sen1Floods11 &middot; flood segmentation<span>linear probe, mIoU</span></div>' +
        '<div class="gs-par-row gs-par-hd"><span></span><span>pretraining data</span><span>mIoU</span></div>';
      var fills = [['Full archive', 100, '79.0', 'full'], ['From Sentinel-1', +k, d.seg[0], 's1'], ['From Sentinel-2', +k, d.seg[1], 's2']]
        .map(function (r, i) {
          var row = h('div', 'gs-par-row ' + r[3], '<span class="n">' + r[0] + '<small>' + r[1] + '%</small></span>' +
            '<span class="tr"><i></i></span><span class="v">' + r[2] + '</span>', par);
          var f = $('i', row); f.dataset.w = r[1]; f.style.transitionDelay = (i * 150) + 'ms';
          return f;
        });
      h('div', 'gs-par-tag', 'Full-archive mIoU with ' + d.x + '&times; less data', par);
      onVisible(par, function () { fills.forEach(function (f) { f.style.width = 'max(3px, ' + f.dataset.w + '%)'; }); }, { threshold: 0.4 });
    });
  }

  /* ================= what gets kept: map ================= */
  function map() {
    var card = $('#gs-map');
    if (!card) return;
    var layers = {};
    $$('.gs-map-kept', card).forEach(function (l) { layers[l.dataset.k] = l; });
    var texts = $$('.gs-map-text p', card), tabs = $$('.gs-seg button', card), scan = $('.gs-map-scan', card);
    var timers = [], user = false;
    function text(k) {
      tabs.forEach(function (b) { b.setAttribute('aria-selected', b.dataset.k === k ? 'true' : 'false'); });
      texts.forEach(function (p) { p.classList.toggle('on', p.dataset.k === k); });
    }
    function show(k) {
      text(k);
      Object.keys(layers).forEach(function (kk) {
        var l = layers[kk];
        if (kk !== k) { l.style.transition = ''; l.classList.remove('on'); }
      });
      var l = layers[k];
      l.style.transition = 'none'; l.style.clipPath = 'inset(0 100% 0 0)'; l.classList.add('on');
      void l.offsetWidth;
      l.style.transition = 'clip-path 1.7s cubic-bezier(.5,0,.5,1)'; l.style.clipPath = 'inset(0 0% 0 0)';
      scan.classList.remove('run'); void scan.offsetWidth; scan.classList.add('run');
    }
    text('random');
    tabs.forEach(function (b) {
      b.addEventListener('click', function () { user = true; timers.forEach(clearTimeout); show(b.dataset.k); });
    });
    onVisible(card, function () {
      if (user) return;
      show('random');
      timers.push(setTimeout(function () { if (!user) show('urban'); }, 4300));
      timers.push(setTimeout(function () { if (!user) show('geoselect'); }, 8600));
    }, { threshold: 0.4 });
  }

  /* ================= metadata association heatmap ================= */
  function assoc() {
    var c = $('#gs-assoc .gs-assoc');
    if (!c) return;
    var heads = ['Geo. cells', 'Climate', 'Soil', 'Land cover', 'Built-up', 'Europe'];
    var short = ['Cells', 'Clim.', 'Soil', 'Land', 'Built', 'Eur.'];
    var R = [
      ['Uniform random', [0.26, 0.08, 0.02, 0.03, 0.00, 0.00], 0, ''],
      ['Climate strat.', [0.17, 0.29, 0.05, 0.04, 0.01, 0.01], 1, 'sep'],
      ['Soil strat.', [0.11, 0.05, 0.25, 0.04, 0.01, 0.00], 2, ''],
      ['Land-cover strat.', [0.10, 0.05, 0.06, 0.37, 0.17, 0.01], 3, ''],
      ['Urban, top-%', [0.32, 0.18, 0.19, 0.38, 0.79, 0.04], 4, ''],
      ['Europe subset', [0.35, 0.18, 0.10, 0.07, 0.03, 0.36], 5, ''],
      ['DINOv2 SemDeDup', [0.08, 0.04, 0.04, 0.06, 0.00, 0.00], -1, 'sep'],
      ['UniverSat SemDeDup', [0.07, 0.04, 0.04, 0.05, 0.01, 0.00], -1, ''],
      ['GeoSelect', [0.10, 0.05, 0.06, 0.05, 0.02, 0.00], -1, 'sep ours']
    ];
    h('div', 'h', '', c);
    heads.forEach(function (t, i) { h('div', 'h', '<span class="l">' + t + '</span><span class="s">' + short[i] + '</span>', c); });
    var fills = [];
    R.forEach(function (r, i) {
      h('div', 'r ' + r[3], '<span class="l">' + r[0] + '</span><span class="s">' + r[0].replace(' SemDeDup', ' SDD').replace(' strat.', '').replace(' subset', '').replace('Uniform random', 'Uniform') + '</span>', c);
      r[1].forEach(function (v, j) {
        var cell = h('div', 'c' + (r[2] === j ? ' tgt' : '') + (v > 0.45 ? ' hi' : '') + (r[3].indexOf('sep') >= 0 ? ' sep' : ''), '<i></i><span>' + v.toFixed(2) + '</span>', c);
        var f = $('i', cell); f.dataset.o = (Math.min(1, v / 0.8) * 0.92).toFixed(3); f.style.transitionDelay = (i * 70 + j * 35) + 'ms';
        fills.push(f);
      });
    });
    onVisible(c, function () { fills.forEach(function (f) { f.style.opacity = f.dataset.o; }); }, { threshold: 0.3 });
  }

  /* ================= galleries ================= */
  function tile(parent, src, cls, alt) {
    var d = h('div', 'gs-tile' + (cls ? ' ' + cls : ''), null, parent);
    var im = h('img', null, null, d);
    im.src = src; im.alt = alt || ''; im.loading = 'lazy'; im.decoding = 'async';
    return d;
  }

  function climates() {
    var c = $('#gs-clim .gs-clim');
    if (!c) return;
    var hd = h('div', 'gs-clim-hd', null, c);
    hd.innerHTML = '<span></span><span>Retained by GeoSelect</span><span></span><span>Discarded</span>';
    [
      { n: 'Ice cap', c: 'EF', k: [0, 1, 2, 3], d: [4, 5, 6], m: [95, 21] },
      { n: 'Tropical rainforest', c: 'Af', k: [7, 8, 9, 10], d: [11, 12, 13], m: [93, 34] },
      { n: 'Hot desert', c: 'BWh', k: [14, 15, 16, 17], d: [18, 19, 20], m: [88, 23] }
    ].forEach(function (r) {
      var row = h('div', 'gs-clim-row gs-stag', null, c);
      h('div', 'gs-clim-lbl', r.n + ' (' + r.c + ')<small>median L percentile:<br>kept <b>' + r.m[0] + '</b> &middot; whole class ' + r.m[1] + '</small>', row);
      r.k.forEach(function (i) { tile(row, TILES + 'clim_' + pad(i) + '.webp', 'k', r.n + ', retained'); });
      h('div', 'gs-clim-gap', null, row);
      r.d.forEach(function (i) { tile(row, TILES + 'clim_' + pad(i) + '.webp', 'd', r.n + ', discarded'); });
      stagger(row, 55);
    });
  }

  function dups() {
    var root = $('#gs-dups');
    if (!root) return;
    var P = [
      [1.1, '10 km', '41.6&deg;N 97.4&deg;W, fields', 'n'],
      [1.4, '10 km', '16.8&deg;N 2.5&deg;W, Niger river', 'n'],
      [1.7, '13 km', '12.7&deg;S 55.7&deg;W', 'n'],
      [1.8, '12 km', '27.7&deg;N 48.8&deg;E', 'n'],
      [1.9, '580 km', '12.3&deg;S 49.0&deg;W &harr; 14.8&deg;S 53.7&deg;W', 'd'],
      [1.9, '335 km', '61.7&deg;N 157.4&deg;W &harr; 64.6&deg;N 158.7&deg;W', 'd'],
      [1.9, '2,916 km', '72.2&deg;N 76.2&deg;W &harr; 60.1&deg;N 138.3&deg;W, glaciers', 'd'],
      [2.0, '1,918 km', '59.3&deg;N 73.7&deg;W &harr; 64.7&deg;N 109.3&deg;W', 'd']
    ];
    var wipe = new Wipe($('.gs-wipe', root)), info = $('.gs-dup-info', root), pick = $('.gs-dup-pick', root);
    var groups = h('div', 'gs-dup-groups', '<span>Neighbouring (&lt;30 km)</span><span>Distant (&gt;300 km)</span>');
    pick.parentNode.insertBefore(groups, pick);
    var btns = P.map(function (p, i) {
      var b = h('button', null, '<img loading="lazy" alt="" src="' + TILES + 'dup_' + i + '_t.webp"><span>' + p[1] + '</span>', pick);
      b.setAttribute('aria-label', 'Pair ' + (i + 1) + ', ' + p[1].replace('&deg;', '') + ' apart');
      b.addEventListener('click', function () { stopAuto(); set(i); });
      return b;
    });
    var cur = -1, timer = null, auto = true;
    function set(i) {
      cur = i;
      btns.forEach(function (b, j) { b.classList.toggle('on', j === i); });
      wipe.setImages(TILES + 'dup_' + i + '_a.webp', TILES + 'dup_' + i + '_b.webp');
      var p = P[i];
      info.innerHTML = '<b>' + (p[3] === 'n' ? 'Neighbouring' : 'Distant') + '</b> &middot; 1 &minus; cos = ' + p[0].toFixed(1) + '&times;10<sup>&minus;3</sup> &middot; <span class="km">' + p[1] + ' apart</span><br>' + p[2];
    }
    function stopAuto() { auto = false; clearInterval(timer); timer = null; }
    $('.gs-wipe', root).addEventListener('pointerdown', stopAuto);
    set(6);
    onVisible(root, function (v) {
      if (v && auto && !timer) timer = setInterval(function () { set((cur + 1) % P.length); }, 5200);
      else if (!v && timer) { clearInterval(timer); timer = null; }
    }, { toggle: true, threshold: 0.4 });
  }

  /* ================= S2-NAIP (supplementary): scale, results ================= */
  function naipScale() {
    var root = $('#gs-naip-scale');
    if (!root) return;
    var cv = $('canvas', root), ctx = cv.getContext('2d');
    var steps = $$('.gs-naip-steps li', root), numEl = $('.gs-naip-count b', root), lblEl = $('.gs-naip-count span', root);
    var vs = $('.gs-naip-vs', root);
    // One square = 1M observations: 513.4M images in the release, 25.3% repeated passes (129.9M), 81.9M cloudy or with
    // missing pixels, 301.6M after cleaning, 3,016,419 (1%) kept by GeoSelect.
    var COLS = 27, ROWS = 19, N = 513, N_REP = 130, N_CLD = 81, KEEP_SLOTS = [31, 148, 264];
    var RAW = 513429404, REP = 129.9e6, CLD = 81.9e6, CLEAN = 301.6e6, KEPT = 3016419;
    var DUR = [1500, 3400, 1900];
    var LBL = ['Sentinel-2 images in the release', 'observations after cleaning', 'observations kept by GeoSelect (1%)'];
    var seed = 11;
    function rnd() { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; }
    var perm = [], cells = [], i;
    for (i = 0; i < N; i++) { perm.push(i); cells.push({ role: 'ok', slot: -1, keep: false, d: rnd() }); }
    for (i = N - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (i = 0; i < N_REP + N_CLD; i++) cells[perm[i]].role = i < N_REP ? 'rep' : 'cld';
    var k = 0;
    cells.forEach(function (c) { if (c.role === 'ok') { c.slot = k; c.keep = KEEP_SLOTS.indexOf(k) >= 0; k++; } });

    var stage = -1, t0 = 0, prog = 0, W = 0, cs = 0, dpr = 1, timers = [], visible = false, raf = 0, C = null;
    function colors() {
      C = { line: cssVar('--gs-line'), n: cssVar('--gs-unif'), rep: cssVar('--gs-drop'), cld: cssVar('--gs-meta'), keep: cssVar('--gs-keep'), keepRgb: cssVar('--gs-keep-rgb') };
    }
    function size() {
      W = cv.parentNode.clientWidth;
      if (!W) return false;
      cs = W / COLS; dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.style.height = (cs * ROWS) + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round(cs * ROWS * dpr);
      return true;
    }
    function box(x, y, s) {
      var r = Math.min(3, s * 0.2);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, s, s, r); else ctx.rect(x, y, s, s);
      ctx.fill();
    }
    function fmt(v) { return v >= 1e7 ? (v / 1e6).toFixed(1) + 'M' : Math.round(v).toLocaleString('en-US'); }
    function draw(now) {
      if (!W && !size()) return;
      if (!C) colors();
      var H = cs * ROWS, g = Math.max(1, cs * 0.16), s = cs - g, p = prog, st = stage;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var appear = st === 0 ? p : st > 0 ? 1 : 0;
      var tintRep = st > 1 ? 1 : st === 1 ? clamp(p / 0.2, 0, 1) : 0;
      var tintCld = st > 1 ? 1 : st === 1 ? clamp((p - 0.2) / 0.2, 0, 1) : 0;
      var fade = st > 1 ? 1 : st === 1 ? clamp((p - 0.46) / 0.18, 0, 1) : 0;
      var move = st > 1 ? 1 : st === 1 ? easeInOut(clamp((p - 0.64) / 0.36, 0, 1)) : 0;
      var dim = st === 2 ? easeOut(clamp(p / 0.45, 0, 1)) : 0;
      var lit = st === 2 ? easeOut(clamp((p - 0.3) / 0.4, 0, 1)) : 0;
      var baseA = isDark() ? 0.5 : 0.42, kept = [];
      for (var i = 0; i < N; i++) {
        var c = cells[i];
        var ap = clamp((appear - (i / N) * 0.75 - c.d * 0.15) / 0.1, 0, 1);
        if (ap <= 0) continue;
        var ox = (i % COLS) * cs, oy = Math.floor(i / COLS) * cs;
        if (c.role !== 'ok') {
          if (fade >= 1) continue;
          var tint = c.role === 'rep' ? tintRep : tintCld, sh = s * (1 - 0.6 * fade), off = (s - sh) / 2;
          ctx.globalAlpha = baseA * ap * (1 - tint) * (1 - fade); ctx.fillStyle = C.n; box(ox + off, oy + off, sh);
          ctx.globalAlpha = 0.85 * tint * (1 - fade); ctx.fillStyle = c.role === 'rep' ? C.rep : C.cld; box(ox + off, oy + off, sh);
          continue;
        }
        var x = ox + ((c.slot % COLS) * cs - ox) * move, y = oy + (Math.floor(c.slot / COLS) * cs - oy) * move;
        if (c.keep && lit > 0) { kept.push([x, y]); continue; }
        ctx.globalAlpha = baseA * ap * (1 - 0.72 * dim); ctx.fillStyle = C.n; box(x, y, s);
      }
      if (move > 0) {
        // slots freed by cleaning stay as outlines, so the removed volume remains visible
        ctx.globalAlpha = move; ctx.strokeStyle = C.line; ctx.lineWidth = 1;
        for (var q = k; q < N; q++) {
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect((q % COLS) * cs + 0.5, Math.floor(q / COLS) * cs + 0.5, s - 1, s - 1, Math.min(3, s * 0.2));
          else ctx.rect((q % COLS) * cs + 0.5, Math.floor(q / COLS) * cs + 0.5, s - 1, s - 1);
          ctx.stroke();
        }
      }
      if (kept.length) {
        var ph = (Math.sin(now / 520) + 1) / 2;
        kept.forEach(function (q) {
          ctx.globalAlpha = 1; ctx.save();
          ctx.shadowColor = 'rgba(' + C.keepRgb + ',0.9)'; ctx.shadowBlur = 10 + 10 * ph * lit;
          ctx.fillStyle = C.keep; box(q[0], q[1], s); ctx.restore();
          var rr = s / 2 + 4 + (6 + 6 * ph) * lit;
          ctx.globalAlpha = 0.55 * lit * (1 - 0.6 * ph); ctx.strokeStyle = C.keep; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(q[0] + s / 2, q[1] + s / 2, rr, 0, Math.PI * 2); ctx.stroke();
        });
      }
      ctx.globalAlpha = 1;
      // counter
      var v = 0;
      if (st === 0) v = RAW * easeOut(p);
      else if (st === 1) v = RAW - REP * easeInOut(tintRep) - CLD * easeInOut(tintCld);
      else if (st === 2) v = CLEAN + (KEPT - CLEAN) * easeOut(clamp(p / 0.7, 0, 1));
      numEl.textContent = st < 0 ? '0' : fmt(v);
    }
    function loop(now) {
      raf = 0;
      if (stage >= 0) prog = clamp((now - t0) / DUR[stage], 0, 1);
      draw(now);
      if (visible && (prog < 1 || stage === 2)) raf = requestAnimationFrame(loop);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }
    function go(s) {
      stage = s; t0 = performance.now(); prog = 0;
      lblEl.textContent = LBL[s];
      steps.forEach(function (li, i) { li.classList.toggle('on', i === s); li.classList.toggle('done', i < s); });
      vs.classList.toggle('on', s === 2);
      kick();
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      go(0);
      timers.push(setTimeout(function () { go(1); }, DUR[0] + 900));
      timers.push(setTimeout(function () { go(2); }, DUR[0] + DUR[1] + 1700));
    }
    steps.forEach(function (li, i) {
      $('button', li).addEventListener('click', function () { timers.forEach(clearTimeout); timers = []; go(i); });
    });
    $('[data-act="replay"]', root).addEventListener('click', play);
    onVisible(root, function (v) { visible = v; if (v) kick(); }, { toggle: true, threshold: 0 });
    onVisible(root, play, { threshold: 0.35 });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(performance.now()); }, 120); });
    onTheme(function () { colors(); draw(performance.now()); });
    size(); draw(0);
  }

  function naipResults() {
    var root = $('#gs-naip-res');
    if (!root) return;
    var box = $('.gs-naip-res', root);
    // Mean GEO-Bench scores of MAE pretrained on 1% S2-NAIP subsets, minus full-archive pretraining (supplementary tables
    // tab:s2naip and tab:s2naip_knn, MAE at 1% only; GeoSelect = full-archive k-means lists, K = 96,367):
    // [k-NN classification, linear-probe classification, linear-probe segmentation].
    var D = [
      [0.2, -0.2, -0.7],   // Random 1% (uniform draw of images)
      [1.1, 0.1, -2.6],    // Urban, top-% 1%
      [0.5, 0.4, -1.0],    // UniverSat SemDeDup 1%
      [1.4, -0.1, 0.2]     // GeoSelect 1%
    ];
    var M = [
      { t: 'k-NN &middot; classification', s: 'full archive 61.9' },
      { t: 'Linear probe &middot; classification', s: 'full archive 69.0' },
      { t: 'Linear probe &middot; segmentation', s: 'full archive 51.1 mIoU' }
    ];
    var METH = [{ n: 'Random', c: 'unif' }, { n: 'Urban, top-%', c: 'urban' }, { n: 'UniverSat SemDeDup', c: 'sem' }, { n: 'GeoSelect', c: 'ours' }];
    var MIN = -3.5, MAX = 2.5;
    function X(v) { return (v - MIN) / (MAX - MIN) * 100; }
    var rows = METH.map(function () { return []; });
    M.forEach(function (m, mi) {
      var pn = h('div', 'gs-nr-panel', null, box);
      h('div', 'gs-nr-t', m.t + '<span>' + m.s + '</span>', pn);
      var plot = h('div', 'gs-nr-plot', null, pn);
      var band = h('div', 'gs-nr-band', null, plot);
      band.style.left = X(-0.5) + '%'; band.style.width = (X(0.5) - X(-0.5)) + '%';
      [-3, -2, -1, 0, 1, 2].forEach(function (v) {
        var gl = h('div', 'gs-nr-grid' + (v === 0 ? ' zero' : ''), null, plot); gl.style.left = X(v) + '%';
        var tk = h('div', 'gs-nr-tick', v === 0 ? '0' : signed(v, 0), plot); tk.style.left = X(v) + '%';
      });
      METH.forEach(function (me, j) {
        var r = h('div', 'gs-nr-row' + (me.c === 'ours' ? ' ours' : ''), null, plot);
        r.title = me.n;
        var b = h('div', 'gs-nr-bar c-' + me.c, null, r);
        var v = h('div', 'gs-nr-val', '', r);
        b.style.left = X(0) + '%'; b.style.width = '0%';
        rows[j][mi] = { b: b, v: v };
      });
    });
    function show() {
      METH.forEach(function (me, j) {
        rows[j].forEach(function (o, mi) {
          var val = D[j][mi], a = X(Math.min(0, val)), b = X(Math.max(0, val));
          o.b.style.left = a + '%'; o.b.style.width = (b - a) + '%';
          o.v.classList.toggle('neg', val < 0);
          o.v.style.left = (val < 0 ? a : b) + '%';
          tween(900, function (p) { o.v.textContent = signed(val * easeInOut(p), 1); });
        });
      });
    }
    onVisible(root, function () { setTimeout(show, 150); }, { threshold: 0.3 });
  }

  function bibtex() {
    var b = $('[data-act="copy"]');
    if (!b) return;
    b.addEventListener('click', function () {
      var txt = $('#gs-bibtex').textContent;
      var ok = function () { b.classList.add('ok'); $('span', b).textContent = 'Copied'; setTimeout(function () { b.classList.remove('ok'); $('span', b).textContent = 'Copy'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, function () { });
    });
  }

  function math() {
    if (!window.renderMathInElement) return;
    window.renderMathInElement($('.gs-page'), {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false
    });
  }

  function init() {
    math();
    scrollUI();
    $$('.gs-reveal').forEach(reveal);
    counters();
    hero();
    race();
    spectrum();
    toy();
    alloc();
    table();
    ssl();
    xmod();
    map();
    assoc();
    climates();
    dups();
    naipScale();
    naipResults();
    bibtex();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // exposed for tests only
  window.__gsToy = { data: toyData, select: toySelect };
})();
