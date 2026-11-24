/* "Same place, different day": interactive figures.
   Real-data figures embed numbers measured on Major-TOM Core-S2L2A (UniverSat embeddings);
   toy figures are synthetic and say so on the page. */
(() => {
'use strict';

/* ------------------------------------------------------------------ helpers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const fmt = (v, d = 2) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(d);

function S(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) {
    if (k === 'text') e.textContent = attrs[k];
    else e.setAttribute(k, attrs[k]);
  }
  if (parent) parent.appendChild(e);
  return e;
}
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gauss(r) { let u = 0; while (!u) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); }
function makeNoise(seed) {
  const r = rng(seed), P = 256, g = new Float32Array(P * P);
  for (let i = 0; i < P * P; i++) g[i] = r() * 2 - 1;
  const sm = t => t * t * (3 - 2 * t);
  const at = (a, b) => g[((b & 255) * P) + (a & 255)];
  const n = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), u = sm(x - xi), v = sm(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x, y, oct = 3) => { let s = 0, amp = 1, fr = 1, tot = 0; for (let o = 0; o < oct; o++) { s += amp * n(x * fr, y * fr); tot += amp; amp *= 0.5; fr *= 2.03; } return s / tot; };
}
function onVisible(el, fn, threshold = 0.25) {
  if (!el) return;
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { io.disconnect(); fn(); break; } }, { threshold });
  io.observe(el);
}
function tween(ms, step, done) {
  if (REDUCE) { step(1); if (done) done(); return () => {}; }
  let t0 = null, id = 0, stop = false;
  const f = ts => { if (stop) return; if (t0 === null) t0 = ts; const p = Math.min(1, (ts - t0) / ms); step(p); if (p < 1) id = requestAnimationFrame(f); else if (done) done(); };
  id = requestAnimationFrame(f);
  return () => { stop = true; cancelAnimationFrame(id); };
}
function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return matchMedia('(prefers-color-scheme: dark)').matches;
}
const themeHooks = [];
const onTheme = f => themeHooks.push(f);
function setPressed(group, btn) { $$('button', group).forEach(b => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false')); }

/* tooltip */
const tip = $('#tip');
function showTip(html, x, y) {
  tip.innerHTML = html; tip.style.opacity = '1';
  const w = tip.offsetWidth, h = tip.offsetHeight;
  let L = x + 14, T = y + 14;
  if (L + w > innerWidth - 8) L = x - w - 14;
  if (T + h > innerHeight - 8) T = y - h - 14;
  tip.style.left = Math.max(8, L) + 'px'; tip.style.top = Math.max(8, T) + 'px';
}
function hideTip() { tip.style.opacity = '0'; }

/* "embedding" colours: vectors live directly in RGB space, like a PCA-as-RGB map */
const toByte = v => clamp(Math.round(v * 255), 0, 255);
const MT = [0.30, -0.27, 0.07]; // magenta <-> teal axis: the direction acquisition offsets mostly move along

/* a synthetic landscape: forest, regional tone changes, a river network, an optional coast */
function landscape(C, R, seed, opt = {}) {
  const N = makeNoise(seed), r = rng(seed + 7);
  const out = new Float32Array(C * R * 3), sea = new Uint8Array(C * R);
  const ry = x => R * (0.55 + 0.11 * Math.sin((x / C) * 5.3 + 0.7) + 0.07 * N((x / C) * 3.1, 0.37, 2));
  const tribs = [];
  const nt = Math.max(3, Math.round(C / 20));
  for (let k = 0; k < nt; k++) tribs.push({ x0: (k + 0.5 + (r() - 0.5) * 0.7) * C / nt, up: k % 2 === 0, ph: r() * 6, amp: 1.5 + r() * 3, len: 0.25 + r() * 0.25 });
  const coastX = y => C * (opt.coast || 2) + 3.5 * Math.sin(y / 6.5) + 2 * Math.sin(y / 2.7 + 1);
  for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
    const u = x / C, v = y / R, i = y * C + x;
    const n1 = N(u * 2.4 * C / R, v * 2.4, 3), n2 = N(u * 9 * C / R + 11, v * 9 + 3, 2);
    let c = [0.43 + 0.10 * n1, 0.30 + 0.07 * n2, 0.85 - 0.07 * n1];
    const tm = clamp(0.5 + 1.5 * N(u * 1.4 * C / R + 5, v * 1.4 + 9, 2), 0, 1) * 0.55;
    c = [lerp(c[0], 0.27, tm), lerp(c[1], 0.55, tm), lerp(c[2], 0.80, tm)];
    let d = Math.abs(y - ry(x));
    for (const t of tribs) {
      const yr = ry(t.x0), dy = y - yr;
      if ((t.up ? dy < 0 : dy > 0) && Math.abs(dy) < R * t.len) {
        const xt = t.x0 + t.amp * Math.sin(y / R * 10 + t.ph) + dy * 0.3;
        d = Math.min(d, Math.abs(x - xt) * 1.25 + 0.15);
      }
    }
    const riv = clamp(1.45 - d, 0, 1) * 0.92;
    c = [lerp(c[0], 0.62, riv), lerp(c[1], 0.93, riv), lerp(c[2], 0.86, riv)];
    if (opt.coast && x > coastX(y)) { c = [0.90 + 0.02 * n2, 0.77 + 0.03 * n1, 0.89]; sea[i] = 1; }
    out[3 * i] = c[0]; out[3 * i + 1] = c[1]; out[3 * i + 2] = c[2];
  }
  return { col: out, sea };
}

/* ------------------------------------------------------------------ theme, progress, spy, reveal */
$('#theme-btn').addEventListener('click', () => {
  const nt = isDark() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nt);
  try { localStorage.setItem('theme', nt); } catch (e) {}
  themeHooks.forEach(f => f());
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => themeHooks.forEach(f => f()));

(function scrollUI() {
  const prog = $('.progress span'), spy = $('.spy'), links = $$('.spy a');
  const secs = links.map(a => $(a.getAttribute('href')));
  let ticking = false;
  const upd = () => {
    ticking = false;
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    prog.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    spy.classList.toggle('on', h.scrollTop > innerHeight * 0.7);
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.45) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
})();

(function reveal() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));
})();

(function counters() {
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count, dec = +(el.dataset.dec || 0);
    const node = el.firstChild;
    onVisible(el, () => tween(1300, p => { node.nodeValue = (target * ease(p)).toFixed(dec); }), 0.6);
  });
})();

function renderMath() {
  if (!window.renderMathInElement) return;
  window.renderMathInElement(document.body, {
    delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
    trust: ctx => ctx.command === '\\htmlClass', strict: false, throwOnError: false,
  });
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderMath); else renderMath();

/* ------------------------------------------------------------------ real Amazon data (shared) */
/* img/amazon/*.png carry quantised per-tile values in their RGB channels (see
   scripts/blog/export_amazon_animation.py): raw PCs, the pass-level and block-level
   parts of the acquisition correction, and the spatial step at the cached lambda 0.4. */
let amzPromise = null;
function amazonData() {
  if (amzPromise) return amzPromise;
  const base = 'img/amazon/';
  const loadImg = src => new Promise((res, rej) => {
    const im = new Image(); let tries = 0;
    im.onload = () => res(im);
    im.onerror = () => { if (++tries < 4) setTimeout(() => { im.src = base + src + '?r=' + tries; }, 400 * tries); else rej(new Error(src)); };
    im.src = base + src;
  });
  amzPromise = fetch(base + 'amazon.json').then(r => r.json()).then(async h => {
    const ims = [];
    for (const n of ['raw', 'pass', 'block', 'spatial', 'order']) ims.push(await loadImg(n + '.png'));
    const W = h.W, H = h.H, n = W * H;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    const px = im => { cx.clearRect(0, 0, W, H); cx.drawImage(im, 0, 0); return cx.getImageData(0, 0, W, H).data; };
    const [dr, dp, db, ds, dor] = ims.map(px);
    const lo = h.raw_range[0], hi = h.raw_range[1], sp = h.scales;
    const raw = new Float32Array(n * 3), pas = new Float32Array(n * 3), blk = new Float32Array(n * 3), spa = new Float32Array(n * 3);
    const rank = new Int32Array(n), occ = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const p = 4 * i;
      occ[i] = dor[p + 2] > 127 ? 1 : 0;
      rank[i] = occ[i] ? dor[p] * 256 + dor[p + 1] : -1;
      for (let c = 0; c < 3; c++) {
        raw[3 * i + c] = lo[c] + dr[p + c] / 255 * (hi[c] - lo[c]);
        pas[3 * i + c] = (dp[p + c] - 128) / 127 * sp.pass[c];
        blk[3 * i + c] = (db[p + c] - 128) / 127 * sp.block[c];
        spa[3 * i + c] = (ds[p + c] - 128) / 127 * sp.spatial[c];
      }
    }
    const L = h.stretch, k = L.map(([a, b]) => 255 / (b - a));
    const colour = (v, c) => clamp(Math.round((v - L[c][0]) * k[c]), 0, 255);
    return { h, W, H, n, raw, pas, blk, spa, rank, occ, L, k, colour };
  });
  return amzPromise;
}
const fmtDate = s => { const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; s = String(s); return `${+s.slice(6, 8)} ${m[+s.slice(4, 6) - 1]} ${s.slice(0, 4)}`; };

/* ------------------------------------------------------------------ 2. real pair similarities */
(function pairChart() {
  const svg = $('#pair-svg'); if (!svg) return;
  const rows = [
    { l: 'Adjacent forest tiles, same pass', r: 0.992, c: 0.979 },
    { l: 'Adjacent forest tiles, different passes', r: 0.143, c: 0.922 },
    { l: 'This pair, A and B', r: -0.255, c: 0.698, strong: true },
  ];
  const W = 440, x0 = 18, x1 = 424, dom = [-0.5, 1];
  const X = v => x0 + (v - dom[0]) / (dom[1] - dom[0]) * (x1 - x0);
  [-0.5, 0, 0.5, 1].forEach(v => {
    S('line', { x1: X(v), x2: X(v), y1: 18, y2: 222, style: v === 0 ? 'stroke:var(--ink2);stroke-width:1.2;opacity:.5' : 'stroke:var(--grid);stroke-width:1' }, svg);
    S('text', { x: X(v), y: 240, 'text-anchor': 'middle', text: (v < 0 ? '−' : '') + Math.abs(v) }, svg);
  });
  S('text', { x: X(0) + 5, y: 14, text: '0 = like two random tiles', style: 'font-size:11px;fill:var(--muted)' }, svg);
  const items = rows.map((r, i) => {
    const y = 58 + i * 66;
    S('text', { x: x0, y: y - 16, text: r.l, class: r.strong ? 'lab-strong' : 'lab-ink', style: 'font-size:12.5px' }, svg);
    const ln = S('line', { x1: X(r.r), x2: X(r.r), y1: y, y2: y, style: 'stroke:var(--ink2);stroke-width:1.5;opacity:.4' }, svg);
    S('circle', { cx: X(r.r), cy: y, r: 6, style: 'fill:var(--nui);stroke:var(--card);stroke-width:2' }, svg);
    const cdot = S('circle', { cx: X(r.r), cy: y, r: 6, style: 'fill:var(--acq);stroke:var(--card);stroke-width:2;opacity:0' }, svg);
    const tr = S('text', { x: X(r.r), y: y + 21, 'text-anchor': 'middle', text: r.r.toFixed(2), style: 'font:500 11px JetBrains Mono,monospace;fill:var(--ink2)' }, svg);
    const tc = S('text', { x: X(r.c), y: y + 21, 'text-anchor': 'middle', text: r.c.toFixed(2), style: 'font:500 11px JetBrains Mono,monospace;fill:var(--ink);opacity:0' }, svg);
    if (Math.abs(X(r.c) - X(r.r)) < 34) {   // values too close for two labels: one combined label to the left
      tr.setAttribute('x', Math.min(X(r.r), X(r.c)) - 12); tr.setAttribute('y', y + 4); tr.setAttribute('text-anchor', 'end');
      tr.textContent = `${r.r.toFixed(2)} → ${r.c.toFixed(2)}`; tc.textContent = '';
    }
    return { r, ln, cdot, tc };
  });
  onVisible(svg, () => tween(1400, p => {
    items.forEach((o, i) => {
      const q = ease(clamp(p * 1.6 - i * 0.25, 0, 1)), x = lerp(X(o.r.r), X(o.r.c), q);
      o.cdot.setAttribute('cx', x); o.cdot.style.opacity = q > 0 ? 1 : 0; o.ln.setAttribute('x2', x); o.tc.style.opacity = q;
    });
  }), 0.5);
})();

/* ------------------------------------------------------------------ 4b. real Santarém patch */
(function patchGrid() {
  const grid = $('#pgrid'); if (!grid) return;
  const big = $('#pbig'), rowsEl = $('#prows');
  let info = null, d = null, mode = 'img', cells = [], hoverK = -1;
  const SPR = 'img/amazon/patch_sprite.jpg';
  function tileCol(k, which) {
    const K = info.K, i = Math.floor(k / K), j = k % K, idx = (info.ry + i) * d.W + (info.rx + j);
    if (!d.occ[idx]) return null;
    const o = [0, 1, 2].map(c => {
      const v = d.raw[3 * idx + c] + (which === 'acq' ? d.pas[3 * idx + c] + d.blk[3 * idx + c] : 0);
      return d.colour(v, c);
    });
    return `rgb(${o[0]},${o[1]},${o[2]})`;
  }
  const rankOf = k => { const K = info.K, idx = (info.ry + Math.floor(k / K)) * d.W + (info.rx + k % K); return d.rank[idx]; };
  function setMode(m, wave = true) {
    mode = m;
    cells.forEach((c, k) => {
      const K = info.K, i = Math.floor(k / K), j = k % K;
      c.layer.style.transitionDelay = wave && !REDUCE ? `${(i + j) * 28}ms` : '0ms';
      if (m === 'img') { c.layer.style.opacity = c.blank ? 1 : 0; }
      else { const col = tileCol(k, m); if (col) c.layer.style.backgroundColor = col; c.layer.style.opacity = 1; }
    });
    setPressed($('#patch-seg'), $(`#patch-seg [data-m="${m}"]`));
    if (hoverK >= 0) side(hoverK);
  }
  function side(k) {
    const K = info.K, i = Math.floor(k / K), j = k % K, t = info.tiles[k];
    big.style.backgroundImage = `url(${SPR})`;
    big.style.backgroundPosition = `${j / (K - 1) * 100}% ${i / (K - 1) * 100}%`;
    if (!t) { rowsEl.innerHTML = '<div><span>No tile here</span><b>–</b></div>'; return; }
    const r = rankOf(k), nPatch = info.tiles.filter((_, q) => rankOf(q) === r).length;
    const nReg = d.h.pass_sizes[r];
    rowsEl.innerHTML =
      `<div><span>Imaged</span><b>${fmtDate(t.date)}</b></div>` +
      `<div><span>Location</span><b>${Math.abs(t.lat).toFixed(2)}°S ${Math.abs(t.lon).toFixed(2)}°W</b></div>` +
      `<div><span>Tiles of this pass in the patch</span><b>${nPatch}</b></div>` +
      `<div><span>… in the whole Amazon region</span><b>${nReg.toLocaleString('en-US')}</b></div>` +
      `<div><span>Raw embedding colour</span><b><i class="sw2" style="background:${tileCol(k, 'raw')}"></i></b></div>` +
      `<div><span>Corrected embedding colour</span><b><i class="sw2" style="background:${tileCol(k, 'acq')}"></i></b></div>` +
      (info.blank.includes(k) ? '<div><span>Thumbnail</span><b>not available</b></div>' : '');
  }
  Promise.all([fetch('img/amazon/patch.json').then(r => r.json()), amazonData()]).then(([I, D]) => {
    info = I; d = D;
    const K = info.K;
    for (let k = 0; k < K * K; k++) {
      const i = Math.floor(k / K), j = k % K;
      const el = document.createElement('div'); el.className = 'c';
      const blank = info.blank.includes(k) || !info.tiles[k];
      if (blank) el.classList.add('blank');
      else { el.style.backgroundImage = `url(${SPR})`; el.style.backgroundPosition = `${j / (K - 1) * 100}% ${i / (K - 1) * 100}%`; }
      const layer = document.createElement('i'); el.appendChild(layer);
      if (blank) { layer.style.opacity = 0; }
      el.addEventListener('mouseenter', () => {
        hoverK = k; const r = rankOf(k);
        grid.classList.add('dim'); cells.forEach((c, q) => c.el.classList.toggle('hl', r >= 0 && rankOf(q) === r));
        side(k);
      });
      grid.appendChild(el);
      cells.push({ el, layer, blank });
    }
    grid.addEventListener('mouseleave', () => { grid.classList.remove('dim'); cells.forEach(c => c.el.classList.remove('hl')); });
    side(9 * K);
    setMode('img', false);
    onVisible(grid, () => setTimeout(() => { if (mode === 'img') setMode('raw'); }, 1800), 0.5);
  }).catch(() => {});
  $$('#patch-seg button').forEach(b => b.addEventListener('click', () => { if (info && d) setMode(b.dataset.m); }));
})();

/* ------------------------------------------------------------------ 4c. S2-NAIP revisits (real data) */
(function s2naip() {
  const fig = $('#s2n-fig'); if (!fig) return;
  const img = $('#s2n-img'), cv = $('#s2n-cv'), ctx = cv.getContext('2d'), slider = $('#s2n-date'), lab = $('#s2n-label');
  const sat = $('#s2n-sat'), playB = $('#s2n-play'), cx2 = $('#s2n-cv2').getContext('2d');
  const strip = $('#s2n-strip');
  let D = null, raw = [], cor = [], devR = [], devC = [], pres = [], cur = 0, timer = 0, order = [], mode = 'date', per = 0, cells = [];
  const dec = s => Uint8Array.from(atob(s), ch => ch.charCodeAt(0));
  const setOrder = by => {
    const idx = D.dates.map((_, i) => i), orb = D.orbit || [];
    mode = by === 'orbit' && orb.length ? 'orbit' : 'date';
    order = mode === 'orbit' ? [...idx.filter(i => orb[i] === orb[0]), ...idx.filter(i => orb[i] !== orb[0])] : idx;
  };
  function paint(c, src, pr) {
    const im = c.createImageData(32, 32);
    for (let t = 0; t < 1024; t++) {
      const on = pr.charCodeAt(t) === 49;
      im.data[4 * t] = on ? src[3 * t] : 0; im.data[4 * t + 1] = on ? src[3 * t + 1] : 0; im.data[4 * t + 2] = on ? src[3 * t + 2] : 0; im.data[4 * t + 3] = 255;
    }
    c.putImageData(im, 0, 0);
  }
  const mark = () => {
    if (!D || !strip) return;
    $$('canvas.on', strip).forEach(c => c.classList.remove('on'));
    (cells[order[cur]] || []).forEach(c => c.classList.add('on'));
  };
  // every day side by side: each tile minus its own season mean, raw row over regularised row
  function buildStrip() {
    if (!strip || !devR.length) return;
    const lab = innerWidth < 640 ? 44 : 96;
    per = clamp(Math.floor((strip.clientWidth - lab) / 52), 4, 13);
    const half = Math.ceil(D.dates.length / 2), groups = mode === 'orbit'
      ? [order.filter(i => D.orbit[i] === D.orbit[order[0]]), order.filter(i => D.orbit[i] !== D.orbit[order[0]])].map(g => ({ h: `Orbit ${D.orbit[g[0]]} · ${g.length} days`, g }))
      : [order.slice(0, half), order.slice(half)].map(g => ({ h: `${fmtDate(D.dates[g[0]])} – ${fmtDate(D.dates[g[g.length - 1]])}`, g }));
    strip.innerHTML = ''; cells = [];
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
    groups.forEach(({ h, g }) => {
      const box = el('div', 'sgroup', `<h5>${h}</h5>`), grid = el('div', 'sgrid');
      grid.style.gridTemplateColumns = `auto repeat(${per}, minmax(0, 1fr))`;
      for (let a = 0; a < g.length; a += per) {
        const chunk = g.slice(a, a + per);
        [['rl', 'Raw', devR], ['rl reg', '<span class="lg">Regularised</span><span class="sh">Reg.</span>', devC]].forEach(([cls, txt, src]) => {
          grid.appendChild(el('span', cls, txt));
          chunk.forEach(i => {
            const c = el('canvas'); c.width = c.height = 32; c.dataset.i = i;
            paint(c.getContext('2d'), src[i], pres[i]); grid.appendChild(c); (cells[i] = cells[i] || []).push(c);
          });
          for (let p = chunk.length; p < per; p++) grid.appendChild(el('span'));
        });
        if (a + per < g.length) grid.appendChild(el('span', 'gap'));
      }
      box.appendChild(grid); strip.appendChild(box);
    });
    mark();
  }
  function show(k) {
    cur = k; slider.value = k;
    const i = order[k], date = D.dates[i];
    img.src = `img/s2naip/rgb_${date}.jpg?v=3`;
    lab.textContent = D.orbit ? `${fmtDate(date)} · orbit ${D.orbit[i]}` : `${fmtDate(date)} · day ${k + 1} of ${D.dates.length}`;
    sat.textContent = D.sat[i];
    paint(ctx, raw[i], pres[i]); paint(cx2, cor[i], pres[i]);
    mark();
  }
  function stop() { clearInterval(timer); timer = 0; $('span', playB).textContent = 'Play'; }
  function play() {
    if (timer) { stop(); return; }
    $('span', playB).textContent = 'Pause';
    timer = setInterval(() => show((cur + 1) % D.dates.length), REDUCE ? 1200 : 520);
  }
  onVisible(fig, () => {
    fetch('img/s2naip/data.json?v=4').then(r => r.json()).then(J => {
      D = J; raw = J.pc_raw.map(dec); cor = J.pc_corr.map(dec); pres = J.present;
      devR = (J.dev_raw || []).map(dec); devC = (J.dev_corr || []).map(dec);
      if (!devR.length) $$('.s2n-strip-wrap').forEach(e => { e.hidden = true; });
      slider.max = J.dates.length - 1;
      setOrder('date');
      const og = $('#s2n-order'); if (og && !J.orbit) og.hidden = true;
      // preload the mosaics one at a time
      const q = J.dates.map(d => `img/s2naip/rgb_${d}.jpg?v=3`);
      const pre = () => { const s = q.shift(); if (!s) return; const im = new Image(); im.onload = im.onerror = () => setTimeout(pre, 30); im.src = s; };
      pre();
      show(0); buildStrip();
      if ('ResizeObserver' in window && strip) new ResizeObserver(() => {
        const p = clamp(Math.floor((strip.clientWidth - (innerWidth < 640 ? 44 : 96)) / 52), 4, 13); if (p !== per) buildStrip();
      }).observe(strip);
      if (!REDUCE) setTimeout(play, 900);
      s2Variogram(J.stats);
    }).catch(() => {});
  }, 0.15);
  slider.addEventListener('input', () => { stop(); if (D) show(+slider.value); });
  playB.addEventListener('click', () => { if (D) play(); });
  $$('#s2n-order button').forEach(b => b.addEventListener('click', () => {
    $$('#s2n-order button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
    if (!D) return;
    const i = order[cur]; setOrder(b.dataset.o); show(order.indexOf(i)); buildStrip();
  }));
  if (strip) {
    strip.addEventListener('click', e => { const c = e.target.closest('canvas'); if (c && D) { stop(); show(order.indexOf(+c.dataset.i)); } });
    strip.addEventListener('mousemove', e => {
      const c = e.target.closest('canvas'); if (!c || !D) { hideTip(); return; }
      const i = +c.dataset.i;
      showTip(`<b>${fmtDate(D.dates[i])}</b>${D.orbit ? ` · orbit ${D.orbit[i]}` : ''}<br><span class="c-muted">click to show this day above</span>`, e.clientX, e.clientY);
    });
    strip.addEventListener('mouseleave', hideTip);
  }
})();

function s2Variogram(stats) {
  const svg = $('#s2v-svg'); if (!svg || svg.dataset.done) return; svg.dataset.done = '1';
  const vr = stats.raw.variogram_mean_cosdist, vc = (stats.corrected || stats.date_corrected).variogram_mean_cosdist;
  const labels = ['same tile', '0.64 km', '1.28 km', '2.56 km', '5.12 km', '10.24 km'];
  const series = [
    { k: 'same', col: 'var(--acq)', name: 'same day', v: vr.same_date },
    { k: 'diff', col: 'var(--nui)', name: 'different days', v: vr.diff_date },
    { k: 'corr', col: 'var(--spa)', name: 'corrected', v: vc.diff_date },
  ];
  const W = 820, H = 340, m = { l: 62, r: 170, t: 18, b: 50 };
  const X = i => m.l + i / (labels.length - 1) * (W - m.l - m.r);
  const Y = v => H - m.b - v / 0.2 * (H - m.t - m.b);
  [0, 0.05, 0.1, 0.15, 0.2].forEach(v => { S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'gridl' }, svg); S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', text: v.toFixed(2) }, svg); });
  labels.forEach((t, i) => S('text', { x: X(i), y: H - m.b + 20, 'text-anchor': 'middle', text: t }, svg));
  S('text', { x: (m.l + W - m.r) / 2, y: H - 8, 'text-anchor': 'middle', text: 'Separation between the two tiles', class: 'lab-ink' }, svg);
  S('text', { x: 16, y: (m.t + H - m.b) / 2, 'text-anchor': 'middle', transform: `rotate(-90 16 ${(m.t + H - m.b) / 2})`, text: 'Mean cosine distance', class: 'lab-ink' }, svg);
  const paths = series.map(s => {
    const pts = s.v.map((v, i) => v == null ? null : [X(i), Y(v)]).filter(Boolean);
    const pth = S('path', { d: pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(''), style: `fill:none;stroke:${s.col};stroke-width:2.4;stroke-linejoin:round` }, svg);
    const dots = s.v.map((v, i) => v == null ? null : S('circle', { cx: X(i), cy: Y(v), r: 4.5, style: `fill:${s.col};stroke:var(--card);stroke-width:2;opacity:0;transition:opacity .4s` }, svg));
    const last = s.v.length - 1;
    const lab = S('text', { x: X(last) + 12, y: Y(s.v[last]) + 4, text: s.name, class: 'lab-ink', style: 'font-size:12.5px;opacity:0;transition:opacity .5s' }, svg);
    const L = pth.getTotalLength(); pth.style.strokeDasharray = L; pth.style.strokeDashoffset = L;
    return { pth, dots, lab, L };
  });
  { let prev = -1e9; paths.map(o => o.lab).sort((a, b) => +a.getAttribute('y') - +b.getAttribute('y'))
      .forEach(t => { const y = Math.max(+t.getAttribute('y'), prev + 15); t.setAttribute('y', y); prev = y; }); }
  onVisible(svg, () => tween(1400, p => {
    paths.forEach(o => { o.pth.style.strokeDashoffset = o.L * (1 - ease(p)); });
    if (p >= 1) paths.forEach(o => { o.dots.forEach(d => d && (d.style.opacity = 1)); o.lab.style.opacity = 1; });
  }), 0.4);
  const cross = S('line', { y1: m.t, y2: H - m.b, style: 'stroke:var(--ink2);stroke-width:1;opacity:0' }, svg);
  const hit = S('rect', { x: m.l - 20, y: m.t, width: W - m.l - m.r + 40, height: H - m.t - m.b, style: 'fill:transparent' }, svg);
  hit.addEventListener('mousemove', e => {
    const b = svg.getBoundingClientRect(), sx = (e.clientX - b.left) / b.width * W;
    const i = clamp(Math.round((sx - m.l) / (W - m.l - m.r) * (labels.length - 1)), 0, labels.length - 1);
    cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.style.opacity = 0.35;
    showTip(`<b>${labels[i]}</b>` + series.map(s => s.v[i] == null ? '' : `<br><span class="sw" style="background:${s.col}"></span>${s.name}: ${s.v[i].toFixed(3)}`).join(''), e.clientX, e.clientY);
  });
  hit.addEventListener('mouseleave', () => { cross.style.opacity = 0; hideTip(); });
}

/* ------------------------------------------------------------------ Fig. 2 data (shared by the teaser and the 2x2 grid) */
let f2Promise = null;
function fig2Data() {
  if (f2Promise) return f2Promise;
  const loadImg = src => new Promise((res, rej) => {
    const el = new Image(); let tries = 0;
    el.onload = () => res(el);
    el.onerror = () => { if (++tries < 4) setTimeout(() => { el.src = src + '?r=' + tries; }, 400 * tries); else rej(new Error(src)); };
    el.src = src;
  });
  f2Promise = amazonData().then(async d => {
    const world = await loadImg('img/amazon/' + d.h.world.file);
    // the spatial regulariser alone on the raw field (panel b)
    const gi = await loadImg('img/amazon/geo.png');
    const tc = document.createElement('canvas'); tc.width = d.W; tc.height = d.H;
    const tx = tc.getContext('2d', { willReadFrequently: true }); tx.drawImage(gi, 0, 0);
    const gd = tx.getImageData(0, 0, d.W, d.H).data, sc = d.h.scales.geo;
    const geo = new Float32Array(d.n * 3);
    for (let i = 0; i < d.n; i++) for (let c = 0; c < 3; c++) geo[3 * i + c] = (gd[4 * i + c] - 128) / 127 * sc[c];
    return { d, world, geo };
  });
  return f2Promise;
}

/* ------------------------------------------------------------------ 11b. Fig. 2 as an animation (real data)
   Whole-archive raw map -> zoom into the 1000 km central-Amazon window ->
   (a) raw, (b) spatial regulariser alone, (c) acquisition correction pass by pass
   then per block, (d) both. Coordinates are Major-TOM raster cells throughout. */
(function fig2Anim() {
  const cv = $('#amz-cv'); if (!cv) return;
  const ctx = cv.getContext('2d'), ticker = $('#amz-ticker'), slider = $('#amz-t'), playB = $('#amz-play'), wrap = $('#amz-wrap');
  const steps = $$('#amz-steps button');
  // timeline, seconds
  const T = { box: [0.5, 1.6], zoom: [2.2, 6.2], aHold: 6.2, cIn: [8.0, 10.0], dIn: [11.8, 13.6], end: 15.4 };
  const JUMP = [0, 7.0, 11.0, T.end];
  let d = null, world = null, reg = null, regCx = null, im = null, Wv = null;
  let t = 0, raf = 0, playing = false, hl = -1, last = 0, key = '', dpr = 1;
  const ph = (x, [a, b]) => clamp((x - a) / (b - a), 0, 1);
  const LAM = 4;   // spatial strength drawn in the last stage
  const nf = v => v.toLocaleString('en-US');

  function state(t) {
    const lam = LAM;
    return {
      zoom: ease(ph(t, T.zoom)),
      box: ease(ph(t, T.box)),
      dim: ph(t, [T.zoom[1] - 0.9, T.zoom[1]]),
      c: ease(ph(t, T.cIn)),
      s: lam * ease(ph(t, T.dIn)),
    };
  }
  const stageOf = t => (t < T.aHold ? 0 : t < T.cIn[0] ? 1 : t < T.dIn[0] ? 2 : 3);

  /* region field -> offscreen canvas; no tile = transparent so the map sits on the background */
  function paintRegion(S) {
    const k2 = `${S.c.toFixed(4)}|${S.s.toFixed(4)}|${hl}`;
    if (k2 === key) return; key = k2;
    const { raw, pas, blk, spa, occ, rank, L, k, n } = d, out = im.data, ss = S.s / 0.4, a = S.c;
    for (let i = 0; i < n; i++) {
      const p = 4 * i;
      if (!occ[i]) { out[p + 3] = 0; continue; }
      const j = 3 * i, dim = hl >= 0 && rank[i] !== hl;
      for (let c = 0; c < 3; c++) {
        const v = raw[j + c] + a * (pas[j + c] + blk[j + c]) + ss * spa[j + c];
        let o = (v - L[c][0]) * k[c]; o = o < 0 ? 0 : o > 255 ? 255 : o;
        out[p + c] = dim ? o * 0.2 : o;
      }
      out[p + 3] = 255;
    }
    regCx.putImageData(im, 0, 0);
  }

  /* camera: screen = (p - c) * s + centre, in device px; p in raster cells */
  function camera(u) {
    const Wc = cv.width, Hc = cv.height, wh = d.h.world, o = d.h.origin_raster, w = d.h.window;
    const s0 = Math.min(Wc / wh.w, Hc / wh.h) * 0.97, s1 = Hc * 0.9 / (2 * w.half);
    const c0 = [wh.x0 + wh.w / 2, wh.y0 + wh.h / 2], c1 = [o[1] + w.cx, o[0] + w.cy];
    const s = s0 * Math.pow(s1 / s0, u);
    // zoom about the fixed point F: a straight dolly, no swing
    const c = [0, 1].map(a => { const F = (c0[a] * s0 - c1[a] * s1) / (s0 - s1); return F - (F - c0[a]) * s0 / s; });
    return { s, cx: c[0], cy: c[1], X: x => (x - c[0]) * s + Wc / 2, Y: y => (y - c[1]) * s + Hc / 2 };
  }

  function draw() {
    if (!d) return;
    const S = state(t), C = camera(S.zoom), Wc = cv.width, Hc = cv.height, o = d.h.origin_raster, wh = d.h.world, w = d.h.window;
    paintRegion(S);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, Wc, Hc);
    // world (raw) under the region; the region carries the corrections
    ctx.imageSmoothingEnabled = C.s * (wh.w / wh.img_w) < 1.6;
    ctx.drawImage(world, C.X(wh.x0), C.Y(wh.y0), wh.w * C.s, wh.h * C.s);
    ctx.imageSmoothingEnabled = C.s < 1.6;
    ctx.drawImage(reg, C.X(o[1]), C.Y(o[0]), d.W * C.s, d.H * C.s);
    // window box
    const bx = C.X(o[1] + w.cx - w.half), by = C.Y(o[0] + w.cy - w.half), bs = 2 * w.half * C.s;
    if (S.dim > 0) {
      ctx.fillStyle = `rgba(7,8,11,${0.6 * S.dim})`;
      ctx.fillRect(0, 0, Wc, by); ctx.fillRect(0, by + bs, Wc, Hc - by - bs);
      ctx.fillRect(0, by, bx, bs); ctx.fillRect(bx + bs, by, Wc - bx - bs, bs);
    }
    if (S.box > 0) {
      // a focus ring that closes onto the window, then the box itself
      const grow = (1 - S.box) * 60 * dpr;
      ctx.lineWidth = 2 * dpr;
      ctx.strokeStyle = `rgba(0,0,0,${0.55 * S.box})`;
      ctx.strokeRect(bx - grow - 1.5 * dpr, by - grow - 1.5 * dpr, bs + 2 * grow + 3 * dpr, bs + 2 * grow + 3 * dpr);
      ctx.strokeStyle = `rgba(255,255,255,${S.box})`;
      ctx.strokeRect(bx - grow, by - grow, bs + 2 * grow, bs + 2 * grow);
      const la = Wc / dpr > 520 ? S.box * (1 - ph(S.zoom, [0, 0.35])) : 0;
      if (la > 0) {
        ctx.font = `600 ${12 * dpr}px Inter, sans-serif`; ctx.textBaseline = 'top';
        ctx.lineWidth = 3 * dpr; ctx.strokeStyle = `rgba(0,0,0,${0.7 * la})`; ctx.fillStyle = `rgba(255,255,255,${la})`;
        const tx = bx + bs + 8 * dpr, ty = by + bs * 0.5 - 6 * dpr, lab = 'central Amazon · 1,000 km';
        ctx.strokeText(lab, tx, ty); ctx.fillText(lab, tx, ty);
      }
    }
    // controls
    slider.value = Math.round(t / T.end * 1000);
    const st = stageOf(t);
    steps.forEach((b, i) => { b.classList.toggle('on', i === st); b.classList.toggle('done', i < st); });
    if (hl >= 0) return;
    let msg;
    if (t < T.zoom[0]) msg = `<b>Whole archive</b> · ${nf(wh.n_tiles)} tiles, one pixel each${Wc / dpr > 520 ? '' : ' · box: central Amazon'}`;
    else if (t < T.aHold) msg = `<b>Zooming in</b> · ${w.name.replace(/^the /, '')}, ${nf(w.n_tiles)} tiles`;
    else if (t < T.cIn[0]) msg = '<b>1 · Raw</b> · neighbours from different passes jump between colours';
    else if (t < T.dIn[0]) msg = t < T.cIn[1] ? '<b>2 · Acquisition correction</b> · each pass loses its context, each block its weather' : '<b>2 · Acquisition-corrected</b> · the patchwork is gone';
    else if (t < T.dIn[1]) msg = '<b>3 · + spatial regularisation</b>';
    else msg = '<b>3 · Both regularisations</b>';
    ticker.innerHTML = msg;
  }

  function loop(ts) {
    raf = 0;
    if (!playing) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    t = Math.min(T.end, t + dt);
    draw();
    if (t >= T.end) { setPlaying(false); return; }
    raf = requestAnimationFrame(loop);
  }
  function setPlaying(on) {
    playing = on; last = 0;
    $('span', playB).textContent = on ? 'Pause' : (t >= T.end ? 'Replay' : 'Play');
    $('svg', playB).innerHTML = on ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>' : '<path d="M7 4v16l13-8z"/>';
    if (on && !raf) raf = requestAnimationFrame(loop);
  }
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    const W = Math.max(2, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; draw(); }
  }
  playB.addEventListener('click', () => { if (!d) return; if (playing) setPlaying(false); else { if (t >= T.end) t = 0; setPlaying(true); } });
  slider.addEventListener('input', () => { if (!d) return; setPlaying(false); t = +slider.value / 1000 * T.end; draw(); });
  steps.forEach(b => b.addEventListener('click', () => { if (!d) return; setPlaying(false); t = JUMP[+b.dataset.s]; draw(); }));
  cv.addEventListener('mousemove', e => {
    if (!d || t < T.aHold) { if (hl >= 0) { hl = -1; draw(); } return; }
    const r = cv.getBoundingClientRect(), C = camera(state(t).zoom), o = d.h.origin_raster;
    const x = Math.floor(((e.clientX - r.left) * dpr - cv.width / 2) / C.s + C.cx) - o[1];
    const y = Math.floor(((e.clientY - r.top) * dpr - cv.height / 2) / C.s + C.cy) - o[0];
    const rk = x >= 0 && y >= 0 && x < d.W && y < d.H ? d.rank[y * d.W + x] : -1;
    if (rk !== hl) {
      hl = rk;
      if (rk >= 0) {
        const inBox = Wv.inBox[rk] || 0;
        ticker.innerHTML = `<b>One pass</b> · ${fmtDate(d.h.pass_dates[rk])} · ${nf(inBox)} of its tiles inside the box`;
      }
      draw();
    }
  });
  cv.addEventListener('mouseleave', () => { if (hl >= 0) { hl = -1; draw(); } });

  onVisible(wrap, () => {
    fig2Data().then(F => {
      d = F.d; world = F.world;
      // tiles of each pass inside the box, for the hover readout
      const w = d.h.window, inBox = new Int32Array(d.h.n_passes);
      for (let y = w.cy - w.half; y < w.cy + w.half; y++) for (let x = w.cx - w.half; x < w.cx + w.half; x++) {
        const rk = d.rank[y * d.W + x]; if (rk >= 0) inBox[rk]++;
      }
      Wv = { inBox };
      reg = document.createElement('canvas'); reg.width = d.W; reg.height = d.H;
      regCx = reg.getContext('2d'); im = regCx.createImageData(d.W, d.H);
      resize(); draw();
      new ResizeObserver(resize).observe(cv);
      onVisible(wrap, () => { if (!REDUCE && t === 0) setTimeout(() => setPlaying(true), 400); }, 0.3);
    }).catch(() => { ticker.textContent = 'Could not load the data.'; });
  }, 0.05);
})();

/* ------------------------------------------------------------------ 11d. acquisition correction, pass by pass (real data) */
(function passAnim() {
  const fig = $('#pp-fig'); if (!fig) return;
  const cv = $('#pp-cv'), ctx = cv.getContext('2d'), ticker = $('#pp-ticker'), slider = $('#pp-t'), playB = $('#pp-play');
  const strip = $('#pp-strip'), sx = strip.getContext('2d');
  const T = { pass: [0.8, 10.8], blk: [11.3, 12.7], end: 13.8 };
  const FADE = 18;
  let d = null, P = null, N = 0, y0 = 0, x0 = 0, im = null;
  let t = 0, raf = 0, playing = false, last = 0, hl = -1, key = '', dpr = 1;
  const ph = (x, [a, b]) => clamp((x - a) / (b - a), 0, 1);
  const nf = v => v.toLocaleString('en-US');
  const yearOf = s => { s = String(s); const y = +s.slice(0, 4), m = +s.slice(4, 6), dd = +s.slice(6, 8); return y + (m - 1) / 12 + (dd - 1) / 365; };
  const Y0 = 2016, Y1 = 2024;

  function state(t) { return { R: ph(t, T.pass) * (P.n + FADE), b: ease(ph(t, T.blk)) }; }

  function paint(S) {
    const k2 = `${S.R.toFixed(2)}|${S.b.toFixed(4)}|${hl}`;
    if (k2 === key) return; key = k2;
    const { raw, pas, blk, occ, rank, L, k } = d, out = im.data;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const i = (y0 + y) * d.W + x0 + x, q = 4 * (y * N + x), j = 3 * i;
      out[q + 3] = 255;
      if (!occ[i]) { out[q] = out[q + 1] = out[q + 2] = 0; continue; }
      const w = clamp((S.R - P.local[rank[i]]) / FADE, 0, 1), dim = hl >= 0 && rank[i] !== hl;
      for (let c = 0; c < 3; c++) {
        const v = raw[j + c] + w * pas[j + c] + S.b * blk[j + c];
        let o = (v - L[c][0]) * k[c]; o = o < 0 ? 0 : o > 255 ? 255 : o;
        out[q + c] = dim ? o * 0.2 : o;
      }
    }
    ctx.putImageData(im, 0, 0);
  }

  const pad = () => 14 * dpr;
  const X = (yr, W) => pad() + (yr - Y0) / (Y1 - Y0) * (W - 2 * pad());
  function drawStrip(S) {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(strip.clientWidth * dpr), H = Math.round(strip.clientHeight * dpr);
    if (strip.width !== W || strip.height !== H) { strip.width = W; strip.height = H; }
    sx.clearRect(0, 0, W, H);
    const base = H - 22 * dpr, top = 6 * dpr, acq = css('--acq'), mut = css('--muted'), ink = css('--ink');
    // year axis
    sx.fillStyle = mut; sx.font = `500 ${10 * dpr}px "JetBrains Mono", monospace`; sx.textAlign = 'center'; sx.textBaseline = 'top';
    for (let y = Y0; y <= Y1; y++) {
      const xx = X(y, W);
      sx.globalAlpha = 0.5; sx.fillRect(Math.round(xx), base, 1 * dpr, 4 * dpr); sx.globalAlpha = 1;
      if (y < Y1) sx.fillText(String(y), X(y + 0.5, W), base + 7 * dpr);
    }
    sx.globalAlpha = 0.5; sx.fillRect(pad(), base, W - 2 * pad(), 1 * dpr); sx.globalAlpha = 1;
    const cur = S.R >= 0 && t >= T.pass[0] && t < T.pass[1] ? Math.floor(S.R) : -1;
    for (let q = 0; q < P.n; q++) {
      const xx = Math.round(X(P.year[q], W)), h = (base - top) * (0.18 + 0.82 * Math.sqrt(P.cnt[q] / P.maxc));
      const done = q < S.R - FADE / 2;
      sx.fillStyle = done ? acq : mut; sx.globalAlpha = done ? 0.85 : 0.35;
      sx.fillRect(xx, base - h, Math.max(1, dpr), h);
    }
    sx.globalAlpha = 1;
    const mark = hl >= 0 ? P.local[hl] : cur;
    if (mark >= 0 && mark < P.n) {
      const xx = X(P.year[mark], W);
      sx.fillStyle = ink; sx.fillRect(Math.round(xx) - dpr, top - 4 * dpr, 2 * dpr, base - top + 4 * dpr);
    }
  }

  function draw() {
    if (!d) return;
    const S = state(t);
    paint(S); drawStrip(S);
    slider.value = Math.round(t / T.end * 1000);
    if (hl >= 0) return;
    let msg;
    if (t < T.pass[0]) msg = `<b>Raw</b> · ${nf(P.n)} passes, ${fmtDate(P.dates[0])} to ${fmtDate(P.dates[P.n - 1])}`;
    else if (t < T.pass[1]) { const q = clamp(Math.floor(S.R), 0, P.n - 1); msg = `<b>Pass ${nf(q + 1)} of ${nf(P.n)}</b> · ${fmtDate(P.dates[q])} · ${nf(P.cnt[q])} tile${P.cnt[q] > 1 ? 's' : ''}`; }
    else if (t < T.blk[1]) msg = '<b>+ 120 km blocks</b> · the weather along each strip';
    else msg = '<b>Acquisition-corrected</b> · every pass done';
    ticker.innerHTML = msg;
  }
  function loop(ts) {
    raf = 0;
    if (!playing) return;
    const dt = Math.min(0.05, (ts - (last || ts)) / 1000); last = ts;
    t = Math.min(T.end, t + dt);
    draw();
    if (t >= T.end) { setPlaying(false); return; }
    raf = requestAnimationFrame(loop);
  }
  function setPlaying(on) {
    playing = on; last = 0;
    $('span', playB).textContent = on ? 'Pause' : (t >= T.end ? 'Replay' : 'Play');
    $('svg', playB).innerHTML = on ? '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>' : '<path d="M7 4v16l13-8z"/>';
    if (on && !raf) raf = requestAnimationFrame(loop);
  }
  function setHl(rk) {
    if (rk === hl) return;
    hl = rk;
    if (rk >= 0) { const q = P.local[rk]; ticker.innerHTML = `<b>One pass</b> · ${fmtDate(P.dates[q])} · ${nf(P.cnt[q])} tile${P.cnt[q] > 1 ? 's' : ''} in the window`; }
    draw();
  }
  playB.addEventListener('click', () => { if (!d) return; if (playing) setPlaying(false); else { if (t >= T.end) t = 0; setPlaying(true); } });
  slider.addEventListener('input', () => { if (!d) return; setPlaying(false); t = +slider.value / 1000 * T.end; draw(); });
  cv.addEventListener('mousemove', e => {
    if (!d) return;
    const r = cv.getBoundingClientRect();
    const x = clamp(Math.floor((e.clientX - r.left) / r.width * N), 0, N - 1), y = clamp(Math.floor((e.clientY - r.top) / r.height * N), 0, N - 1);
    const rk = d.rank[(y0 + y) * d.W + x0 + x];
    setHl(rk >= 0 && P.local[rk] < P.n && P.list[P.local[rk]] === rk ? rk : -1);
  });
  cv.addEventListener('mouseleave', () => setHl(-1));
  strip.addEventListener('pointermove', e => {
    if (!d) return;
    const r = strip.getBoundingClientRect(), W = strip.width, xx = (e.clientX - r.left) * dpr;
    const yr = Y0 + (xx - pad()) / (W - 2 * pad()) * (Y1 - Y0);
    let best = -1, bd = 1e9;
    for (let q = 0; q < P.n; q++) { const dd = Math.abs(P.year[q] - yr); if (dd < bd) { bd = dd; best = q; } }
    setHl(bd < 0.08 ? P.list[best] : -1);
  });
  strip.addEventListener('pointerleave', () => setHl(-1));
  onTheme(() => { if (d) drawStrip(state(t)); });
  window.addEventListener('resize', () => { if (d) drawStrip(state(t)); });

  onVisible(fig, () => fig2Data().then(F => {
    d = F.d; const w = d.h.window; N = 2 * w.half; y0 = w.cy - w.half; x0 = w.cx - w.half;
    cv.width = N; cv.height = N; im = ctx.createImageData(N, N);
    // passes with tiles in the window, chronological (ranks are already in acquisition order)
    const np = d.h.n_passes, cntAll = new Int32Array(np);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const rk = d.rank[(y0 + y) * d.W + x0 + x]; if (rk >= 0) cntAll[rk]++; }
    const list = [], local = new Float32Array(np);
    for (let r = 0; r < np; r++) { local[r] = list.length; if (cntAll[r]) list.push(r); }
    const cnt = list.map(r => cntAll[r]);
    P = { n: list.length, list, local, cnt, maxc: Math.max(...cnt), dates: list.map(r => d.h.pass_dates[r]), year: list.map(r => yearOf(d.h.pass_dates[r])) };
    draw();
    onVisible(fig, () => { if (!REDUCE && t === 0) setTimeout(() => setPlaying(true), 400); }, 0.55);
  }), 0.05);
})();

/* ------------------------------------------------------------------ 11c. Fig. 2 as a 2x2 grid (real data) */
(function fig2Grid() {
  const fig = $('#f2-fig'); if (!fig) return;
  const panels = $$('.f2-p', fig);
  // weights of the pass part, block part, spatial-alone part and spatial-after-acq part
  const MIX = { a: [0, 0, 0, 0], b: [0, 0, 1, 0], c: [1, 1, 0, 0], d: [1, 1, 0, 1] };
  const lam = 4;
  let F = null, N = 0;
  function paint() {
    const { d, geo } = F, w = d.h.window, y0 = w.cy - w.half, x0 = w.cx - w.half;
    const { raw, pas, blk, spa, occ, L, k } = d, s = lam / 0.4;
    panels.forEach(p => {
      const cv = $('canvas', p), cx = cv.getContext('2d'), im = cx.createImageData(N, N), out = im.data;
      const [a, b, g, sp] = MIX[p.dataset.k];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        const i = (y0 + y) * d.W + x0 + x, q = 4 * (y * N + x), j = 3 * i;
        out[q + 3] = 255;
        if (!occ[i]) continue;   // black = missing tile
        for (let c = 0; c < 3; c++) {
          const v = raw[j + c] + a * pas[j + c] + b * blk[j + c] + g * s * geo[j + c] + sp * s * spa[j + c];
          out[q + c] = clamp((v - L[c][0]) * k[c], 0, 255);
        }
      }
      cx.putImageData(im, 0, 0);
    });
  }
  function mark(x, y) {
    panels.forEach(p => {
      const m = $('i', p);
      if (x < 0) { m.style.display = 'none'; return; }
      m.style.display = 'block';
      m.style.left = `calc(${x / N * 100}% - 4px)`; m.style.top = `calc(${y / N * 100}% - 4px)`;
      m.style.width = m.style.height = `calc(${100 / N}% + 8px)`;
    });
  }
  panels.forEach(p => {
    p.addEventListener('pointermove', e => {
      if (!F) return;
      const r = p.getBoundingClientRect();
      mark(clamp(Math.floor((e.clientX - r.left) / r.width * N), 0, N - 1), clamp(Math.floor((e.clientY - r.top) / r.height * N), 0, N - 1));
    });
    p.addEventListener('pointerleave', () => mark(-1));
  });
  onVisible(fig, () => fig2Data().then(D => {
    F = D; N = 2 * D.d.h.window.half;
    panels.forEach(p => { const cv = $('canvas', p); cv.width = N; cv.height = N; });
    paint();
  }), 0.05);
})();

/* ------------------------------------------------------------------ 3. PCA viewer (real data) */
(function pcaViewer() {
  const world = $('#world'); if (!world) return;
  const WIN = [
    { k: 'amazon', n: 'Central Amazon', b: [437, 303, 471, 337], ll: '3.5°S 56.0°W', d: 'Tropical forest cut by the Amazon and its tributaries. The river network is buried in static in the raw field.' },
    { k: 'hudson', n: 'Hudson Bay lowlands', b: [489, 65, 523, 99], ll: '60.6°N 85.3°W', d: 'Boreal wetlands; the window where the spatial step is largest.' },
    { k: 'zambezi', n: 'Zambezi delta', b: [776, 359, 811, 394], ll: '18.8°S 37.6°E', d: 'Savanna, a river delta and the Mozambique coast.' },
    { k: 'sakhalin', n: 'Sakhalin', b: [1000, 113, 1034, 147], ll: '47.7°N 142.2°E', d: 'A long island coast between the Sea of Okhotsk and the Sea of Japan.' },
    { k: 'mississippi', n: 'Mississippi delta', b: [354, 180, 388, 214], ll: '29.5°N 90.0°W', d: 'Delta, wetlands and the Gulf of Mexico coast.' },
    { k: 'carpentaria', n: 'Gulf of Carpentaria', b: [1160, 349, 1194, 384], ll: '16.1°S 144.5°E', d: 'Tropical savanna of northern Australia meeting the sea.' },
  ];
  const STAGE = { raw: 'Raw', acq: 'Acq. corrected', eod: '+ spatial' };
  // Preload one file at a time: a burst of 18 parallel requests can overflow a small dev server.
  const queue = [];
  WIN.forEach(w => ['raw', 'acq', 'eod'].forEach(s => queue.push(`img/${w.k}_${s}.png`)));
  const preload = () => { const src = queue.shift(); if (!src) return; const im = new Image(); im.onload = im.onerror = () => setTimeout(preload, 40); im.src = src; };
  const list = $('#wlist'), desc = $('#wdesc'), wipe = $('#wipe');
  const under = $('.under', wipe), over = $('.over', wipe), left = $('.left', wipe), handle = $('.handle', wipe), knob = $('.knob', wipe);
  [under, over].forEach(im => {
    im.addEventListener('load', () => { im.dataset.retry = '0'; });
    im.addEventListener('error', () => {
      const n = +(im.dataset.retry || 0); if (n >= 3) return;
      im.dataset.retry = String(n + 1);
      setTimeout(() => { im.src = im.src.split('?')[0] + '?r=' + (n + 1); }, 300 * (n + 1));
    });
  });
  onVisible(world, () => setTimeout(preload, 600), 0.1);
  const tagl = $('.tagl', wipe), tagr = $('.tagr', wipe);
  let cur = 0, pair = ['raw', 'acq'], pos = 0.5;
  const boxes = WIN.map((w, i) => {
    const b = document.createElement('button');
    b.style.left = (w.b[0] / 1326 * 100) + '%'; b.style.top = (w.b[1] / 614 * 100) + '%';
    b.style.width = ((w.b[2] - w.b[0]) / 1326 * 100) + '%'; b.style.height = ((w.b[3] - w.b[1]) / 614 * 100) + '%';
    b.setAttribute('aria-label', `Window ${i + 1}: ${w.n}`);
    b.innerHTML = `<span>${i + 1}</span>`;
    b.addEventListener('click', () => select(i));
    world.appendChild(b);
    const l = document.createElement('button');
    l.innerHTML = `<b>${i + 1}</b>${w.n}`;
    l.addEventListener('click', () => select(i));
    list.appendChild(l);
    return [b, l];
  });
  function setPos(p) {
    pos = clamp(p, 0, 1);
    left.style.clipPath = `inset(0 ${(1 - pos) * 100}% 0 0)`;
    handle.style.left = (pos * 100) + '%'; knob.style.left = (pos * 100) + '%';
    knob.setAttribute('aria-valuenow', Math.round(pos * 100));
  }
  function render() {
    const w = WIN[cur];
    over.src = `img/${w.k}_${pair[0]}.png`; under.src = `img/${w.k}_${pair[1]}.png`;
    over.alt = `${w.n}, ${STAGE[pair[0]]}`; under.alt = `${w.n}, ${STAGE[pair[1]]}`;
    tagl.textContent = STAGE[pair[0]]; tagr.textContent = STAGE[pair[1]];
    desc.innerHTML = `<b>${cur + 1}. ${w.n}</b> · ${w.ll} · 1000 × 1000 km. ${w.d}`;
    boxes.forEach(([b, l], i) => { b.classList.toggle('on', i === cur); l.classList.toggle('on', i === cur); });
  }
  function select(i) { cur = i; render(); }
  $$('#pair-seg button').forEach(b => b.addEventListener('click', () => { setPressed($('#pair-seg'), b); pair = b.dataset.pair.split(','); render(); }));
  let drag = false;
  const fromEvent = e => { const r = wipe.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width); };
  wipe.addEventListener('pointerdown', e => { drag = true; wipe.setPointerCapture(e.pointerId); fromEvent(e); if (intro) intro(); });
  wipe.addEventListener('pointermove', e => { if (drag) fromEvent(e); });
  wipe.addEventListener('pointerup', () => { drag = false; });
  wipe.addEventListener('pointercancel', () => { drag = false; });
  knob.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { setPos(pos - 0.05); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPos(pos + 0.05); e.preventDefault(); }
  });
  render(); setPos(0.5);
  let intro = null;
  onVisible(wipe, () => {
    setPos(1);
    intro = tween(1800, p => setPos(lerp(1, 0.42, ease(p))), () => { intro = null; });
  }, 0.5);
})();

/* ------------------------------------------------------------------ 4. mosaic assembly (toy) */
(function mosaicDemo() {
  const cv = $('#mos-cv'); if (!cv) return;
  const ctx = cv.getContext('2d'), msg = $('#mos-msg');
  const C = 60, R = 30, P = 16;
  cv.width = C * P; cv.height = R * P;
  const L = landscape(C, R, 5, { coast: 0.9 });
  const N = makeNoise(31), r = rng(99);
  const D = 24, HW = 10, SL = 0.35;
  let centers = [];
  for (let k = 0; k < 6; k++) for (let s = 0; s < 4; s++) centers.push(-3 + k * 14.5 + s * 3.6 + (r() - 0.5) * 2);
  for (let i = centers.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [centers[i], centers[j]] = [centers[j], centers[i]]; }
  const hue = d => (d * 137.508 + 20) % 360;
  // cloud cover: small cumulus-scale structure plus per-cell variation, so the clearest pass changes from cell to cell
  const CL = Array.from({ length: D }, (_, d) => Float32Array.from({ length: C * R }, (_, i) => {
    const x = i % C, y = Math.floor(i / C);
    return clamp(0.40 + 1.1 * N(x / 3.2 + 37 * d, y / 3.2 + 11 * d, 2) + 0.28 * (r() - 0.5), 0, 1);
  }));
  const cloud = (d, x, y) => CL[d][y * C + x];
  const covers = (d, x, y) => Math.abs(x + SL * y - centers[d]) < HW;
  const offs = Array.from({ length: D }, () => { const a = gauss(r) * 0.75; return [MT[0] * a + 0.04 * gauss(r), MT[1] * a + 0.04 * gauss(r), MT[2] * a + 0.04 * gauss(r)]; });
  let assign, best, popT, rowDone, day, dayStart, done, hoverPass = -1, view = 'pass', raf = 0, updated = 0;
  const DUR = 520, GAP = 90;

  function reset() {
    assign = new Int16Array(C * R).fill(-1); best = new Float32Array(C * R).fill(9); popT = new Float32Array(C * R).fill(-1e9);
    rowDone = -1; day = 0; dayStart = performance.now(); done = false; updated = 0; hoverPass = -1;
  }
  function finish() {
    for (let d = 0; d < D; d++) for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      const i = y * C + x; if (covers(d, x, y)) { const c = cloud(d, x, y); if (c < best[i]) { best[i] = c; assign[i] = d; } }
    }
    day = D; done = true; popT.fill(-1e9);
  }
  function sharedShare() {
    let s = 0, n = 0;
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      const i = y * C + x; if (assign[i] < 0) continue;
      if (x + 1 < C && assign[i + 1] >= 0) { n++; if (assign[i + 1] === assign[i]) s++; }
      if (y + 1 < R && assign[i + C] >= 0) { n++; if (assign[i + C] === assign[i]) s++; }
    }
    return n ? s / n : 0;
  }
  function cellColor(i, a) {
    if (view === 'pass') return `hsl(${hue(a)},${isDark() ? 52 : 58}%,${isDark() ? 52 : 63}%)`;
    const o = offs[a];
    return `rgb(${toByte(L.col[3 * i] + o[0])},${toByte(L.col[3 * i + 1] + o[1])},${toByte(L.col[3 * i + 2] + o[2])})`;
  }
  function draw(now) {
    const dark = isDark();
    ctx.fillStyle = css('--bg2'); ctx.fillRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      const i = y * C + x, a = assign[i];
      if (a < 0) { ctx.fillStyle = dark ? 'rgba(255,255,255,.035)' : 'rgba(14,23,38,.04)'; ctx.fillRect(x * P + 1, y * P + 1, P - 2, P - 2); continue; }
      const age = (now - popT[i]) / 320;
      ctx.globalAlpha = (done && hoverPass >= 0 && a !== hoverPass) ? 0.16 : 1;
      ctx.fillStyle = cellColor(i, a);
      if (age < 1) { const s = (1 - ease(clamp(age, 0, 1))) * 5; ctx.fillRect(x * P - s / 2, y * P - s / 2, P + s, P + s); }
      else ctx.fillRect(x * P, y * P, P, P);
    }
    ctx.globalAlpha = 1;
    if (!done && day < D) {
      const p = clamp((now - dayStart) / DUR, 0, 1), yr = p * R, c = centers[day];
      ctx.save();
      ctx.beginPath();
      ctx.moveTo((c - HW) * P, 0); ctx.lineTo((c + HW) * P, 0);
      ctx.lineTo((c + HW - SL * yr) * P, yr * P); ctx.lineTo((c - HW - SL * yr) * P, yr * P); ctx.closePath();
      ctx.fillStyle = dark ? 'rgba(255,255,255,.07)' : 'rgba(14,23,38,.05)'; ctx.fill();
      ctx.clip();
      for (let y = 0; y < Math.ceil(yr); y++) for (let x = 0; x < C; x++) {
        if (!covers(day, x, y)) continue;
        const a = clamp((cloud(day, x, y) - 0.38) * 1.7, 0, 0.88);
        if (a > 0.02) { ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fillRect(x * P, y * P, P, P); }
      }
      ctx.restore();
      ctx.strokeStyle = `hsl(${hue(day)},70%,${dark ? 60 : 45}%)`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo((c - HW) * P, 0); ctx.lineTo((c - HW - SL * yr) * P, yr * P);
      ctx.moveTo((c + HW) * P, 0); ctx.lineTo((c + HW - SL * yr) * P, yr * P); ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = dark ? 'rgba(255,255,255,.8)' : 'rgba(14,23,38,.55)';
      ctx.beginPath(); ctx.moveTo((c - HW - SL * yr) * P, yr * P); ctx.lineTo((c + HW - SL * yr) * P, yr * P); ctx.stroke();
    }
  }
  function step(now) {
    raf = 0;
    if (!done) {
      if (day < D) {
        const p = clamp((now - dayStart) / DUR, 0, 1), rows = Math.floor(p * R);
        while (rowDone < rows - 1 || (p >= 1 && rowDone < R - 1)) {
          rowDone++;
          const y = rowDone;
          for (let x = 0; x < C; x++) {
            const i = y * C + x;
            if (!covers(day, x, y)) continue;
            const c = cloud(day, x, y);
            if (c < best[i]) { best[i] = c; assign[i] = day; popT[i] = now; updated++; }
          }
        }
        msg.innerHTML = `<b>Day ${day + 1} of ${D}</b> · a pass sweeps its strip; ${updated} cell${updated === 1 ? '' : 's'} get a clearer view than before`;
        if (now - dayStart > DUR + GAP) { day++; dayStart = now; rowDone = -1; updated = 0; }
      } else if (now - dayStart > 300) { done = true; doneMsg(); }
    }
    draw(now);
    if (!done || now - (dayStart || 0) < 2000) raf = requestAnimationFrame(step);
  }
  function doneMsg() {
    msg.innerHTML = `<b>Each cell keeps its least-cloudy pass.</b> Here ${Math.round(sharedShare() * 100)}% of adjacent cells share a pass; in Major-TOM, with far more passes, fewer than one in twenty.` +
      (view === 'pass' ? ' Switch to <i>Colour by embedding</i> to see what this does to the map.' : ' Same landscape, but each pass adds its own offset: static.');
  }
  function play() { cancelAnimationFrame(raf); reset(); if (REDUCE) { finish(); doneMsg(); draw(performance.now()); return; } raf = requestAnimationFrame(step); }
  $('#mos-replay').addEventListener('click', play);
  $$('#mos-seg button').forEach(b => b.addEventListener('click', () => { setPressed($('#mos-seg'), b); view = b.dataset.v; if (done) doneMsg(); draw(performance.now()); }));
  cv.addEventListener('mousemove', e => {
    if (!done) return;
    const rc = cv.getBoundingClientRect();
    const x = Math.floor((e.clientX - rc.left) / rc.width * C), y = Math.floor((e.clientY - rc.top) / rc.height * R);
    if (x < 0 || y < 0 || x >= C || y >= R) return;
    const a = assign[y * C + x];
    if (a !== hoverPass) {
      hoverPass = a; draw(performance.now());
    }
    if (a >= 0) {
      let n = 0; for (let i = 0; i < C * R; i++) if (assign[i] === a) n++;
      showTip(`<span class="sw" style="background:hsl(${hue(a)},58%,60%)"></span><b>Pass of day ${a + 1}</b><br>${n} cells of this view, scattered along its strip.`, e.clientX, e.clientY);
    } else hideTip();
  });
  cv.addEventListener('mouseleave', () => { hoverPass = -1; hideTip(); if (done) draw(performance.now()); });
  reset(); draw(performance.now());
  msg.textContent = 'Scroll here to start the animation.';
  onVisible(cv, play, 0.45);
  onTheme(() => draw(performance.now()));
})();

/* ------------------------------------------------------------------ 5. semivariogram (real data) */
(function variogram() {
  const svg = $('#vg-svg'); if (!svg) return;
  const H = [10, 20, 30, 40, 60, 80, 120, 160, 240];
  const DATA = {
    all: { same: [0.01193, 0.02085, 0.02756, 0.0332, 0.04289, 0.05193, 0.06662, 0.08026, 0.09383], diff: [0.15492, 0.15939, 0.16258, 0.16532, 0.17014, 0.17428, 0.18139, 0.18721, 0.19602], n: [173019, 149026, 129694, 114766, 90826, 71392, 46521, 31923, 14473] },
    land: { same: [0.01302, 0.02171, 0.02766, 0.03234, 0.03961, 0.04557, 0.05484, 0.06372, 0.07199], diff: [0.15476, 0.15814, 0.16014, 0.16163, 0.16404, 0.16577, 0.16873, 0.17116, 0.17544], n: [87062, 76165, 66723, 59363, 47331, 37348, 24469, 16877, 7732] },
    water: { same: [0.00736, 0.0122, 0.01623, 0.01929, 0.02653, 0.03384, 0.04643, 0.05879, 0.06784], diff: [0.15232, 0.15341, 0.15405, 0.15478, 0.15622, 0.1578, 0.16024, 0.16142, 0.16029], n: [82857, 68830, 58543, 50762, 38965, 29711, 18503, 12110, 5067] },
  };
  const W = 860, Hh = 380, m = { l: 64, r: 118, t: 18, b: 52 };
  const X = h => m.l + (Math.log(h) - Math.log(8)) / (Math.log(300) - Math.log(8)) * (W - m.l - m.r);
  const Y = v => Hh - m.b - v / 0.21 * (Hh - m.t - m.b);
  const ax = S('g', {}, svg);
  [0, 0.05, 0.1, 0.15, 0.2].forEach(v => {
    S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'gridl' }, ax);
    S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', text: v.toFixed(2) }, ax);
  });
  [10, 30, 100, 300].forEach(h => S('text', { x: X(h), y: Hh - m.b + 20, 'text-anchor': 'middle', text: h + ' km' }, ax));
  S('text', { x: (m.l + W - m.r) / 2, y: Hh - 8, 'text-anchor': 'middle', text: 'Distance between the two tiles (log scale)', class: 'lab-ink' }, ax);
  S('text', { x: 16, y: (m.t + Hh - m.b) / 2, 'text-anchor': 'middle', transform: `rotate(-90 16 ${(m.t + Hh - m.b) / 2})`, text: 'Semivariance', class: 'lab-ink' }, ax);
  const gap = S('g', {}, svg);
  const gapLine = S('line', { style: 'stroke:var(--ink2);stroke-width:1.2' }, gap);
  const gapT1 = S('text', { class: 'lab-strong', style: 'font-size:14px' }, gap);
  const gapT2 = S('text', { class: 'lab-ink', style: 'font-size:12px' }, gap);
  const pDiff = S('path', { style: 'fill:none;stroke:var(--nui);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round' }, svg);
  const pSame = S('path', { style: 'fill:none;stroke:var(--acq);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round' }, svg);
  const dDiff = H.map(() => S('circle', { r: 4.5, style: 'fill:var(--nui);stroke:var(--card);stroke-width:2' }, svg));
  const dSame = H.map(() => S('circle', { r: 4.5, style: 'fill:var(--acq);stroke:var(--card);stroke-width:2' }, svg));
  const eDiff = S('text', { class: 'lab-ink', style: 'font-size:13px' }, svg);
  const eSame = S('text', { class: 'lab-ink', style: 'font-size:13px' }, svg);
  const cross = S('line', { y1: m.t, y2: Hh - m.b, style: 'stroke:var(--ink2);stroke-width:1;opacity:0' }, svg);
  let key = 'all', curS = DATA.all.same.slice(), curD = DATA.all.diff.slice(), drawn = 0;
  const path = (arr, upto) => {
    let d = '';
    const n = Math.floor(upto), f = upto - n;
    for (let i = 0; i <= Math.min(n, H.length - 1); i++) d += (i ? 'L' : 'M') + X(H[i]).toFixed(1) + ',' + Y(arr[i]).toFixed(1);
    if (n < H.length - 1 && f > 0) d += 'L' + lerp(X(H[n]), X(H[n + 1]), f).toFixed(1) + ',' + lerp(Y(arr[n]), Y(arr[n + 1]), f).toFixed(1);
    return d;
  };
  function render() {
    pDiff.setAttribute('d', path(curD, drawn)); pSame.setAttribute('d', path(curS, drawn));
    H.forEach((h, i) => {
      const vis = i <= drawn + 0.001 ? 1 : 0;
      dDiff[i].setAttribute('cx', X(h)); dDiff[i].setAttribute('cy', Y(curD[i])); dDiff[i].style.opacity = vis;
      dSame[i].setAttribute('cx', X(h)); dSame[i].setAttribute('cy', Y(curS[i])); dSame[i].style.opacity = vis;
    });
    const end = drawn >= H.length - 1 ? 1 : 0;
    eDiff.setAttribute('x', X(240) + 12); eDiff.setAttribute('y', Y(curD[8]) + 4); eDiff.textContent = 'different pass'; eDiff.style.opacity = end;
    eSame.setAttribute('x', X(240) + 12); eSame.setAttribute('y', Y(curS[8]) + 4); eSame.textContent = 'same pass'; eSame.style.opacity = end;
    const x0 = X(10);
    gapLine.setAttribute('x1', x0); gapLine.setAttribute('x2', x0); gapLine.setAttribute('y1', Y(curS[0]) - 7); gapLine.setAttribute('y2', Y(curD[0]) + 7);
    const pct = Math.round((1 - curS[0] / curD[0]) * 100);
    const ym = (Y(curS[0]) + Y(curD[0])) / 2;
    gapT1.setAttribute('x', x0 + 14); gapT1.setAttribute('y', ym - 4); gapT1.textContent = pct + '% of the gap';
    gapT2.setAttribute('x', x0 + 14); gapT2.setAttribute('y', ym + 14); gapT2.textContent = 'between 10 km neighbours is the pass';
    gap.style.opacity = drawn > 0.5 ? 1 : 0;
  }
  render();
  onVisible(svg, () => tween(1600, p => { drawn = p * (H.length - 1); render(); }), 0.45);
  $$('#vg-seg button').forEach(b => b.addEventListener('click', () => {
    setPressed($('#vg-seg'), b); key = b.dataset.k;
    const s0 = curS.slice(), d0 = curD.slice(), s1 = DATA[key].same, d1 = DATA[key].diff;
    drawn = H.length - 1;
    tween(650, p => { const e = ease(p); curS = s0.map((v, i) => lerp(v, s1[i], e)); curD = d0.map((v, i) => lerp(v, d1[i], e)); render(); });
  }));
  const hit = S('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: Hh - m.t - m.b, style: 'fill:transparent' }, svg);
  hit.addEventListener('mousemove', e => {
    const pt = svg.getBoundingClientRect(), sx = (e.clientX - pt.left) / pt.width * W;
    let bi = 0; H.forEach((h, i) => { if (Math.abs(X(h) - sx) < Math.abs(X(H[bi]) - sx)) bi = i; });
    const d = DATA[key];
    cross.setAttribute('x1', X(H[bi])); cross.setAttribute('x2', X(H[bi])); cross.style.opacity = 0.35;
    showTip(`<b>${H[bi]} km apart</b><br><span class="sw" style="background:var(--nui)"></span>different pass: ${d.diff[bi].toFixed(3)}<br><span class="sw" style="background:var(--acq)"></span>same pass: ${d.same[bi].toFixed(3)}<br>ratio ${(d.same[bi] / d.diff[bi]).toFixed(2)} · ${d.n[bi].toLocaleString('en-US')} same-pass pairs`, e.clientX, e.clientY);
  });
  hit.addEventListener('mouseleave', () => { cross.style.opacity = 0; hideTip(); });
})();

/* ------------------------------------------------------------------ 6. metadata R² bars (real data) */
(function metaBars() {
  const svg = $('#meta-svg'); if (!svg) return;
  const rows = [
    ['Acquisition year', 13.69, 'Year of the sensing date, alone.'],
    ['Processing baseline (old vs new)', 13.29, 'Whether the L2A product came from ESA\'s older processing baseline, alone. Collinear with the year.'],
    ['Season (annual cycle)', 2.12, 'Cosine of the day of year, alone (sine: 0.6%).'],
    ['Satellite (S2A vs S2B)', 0.28, 'Which of the two Sentinel-2 satellites, alone.'],
    ['Relative orbit', 0.002, 'Sine and cosine of the relative orbit number: < 0.01% each.'],
    ['Time of day', 0.001, 'Sensing hour: < 0.01%.'],
    null,
    ['All twelve covariates jointly', 25.42, 'Every metadata covariate in one regression: a quarter of the offsets.'],
  ];
  const W = 820, LW = 262, top = 10, rh = 32, maxV = 30;
  const Xv = v => LW + v / maxV * (W - LW - 70);
  let y = top;
  const bars = [];
  [0, 10, 20, 30].forEach(v => {
    S('line', { x1: Xv(v), x2: Xv(v), y1: top - 4, y2: 266, class: 'gridl' }, svg);
    S('text', { x: Xv(v), y: 286, 'text-anchor': 'middle', text: v + '%' }, svg);
  });
  rows.forEach(rw => {
    if (!rw) { S('line', { x1: 10, x2: W - 10, y1: y + 6, y2: y + 6, style: 'stroke:var(--line);stroke-width:1' }, svg); y += 14; return; }
    const joint = rw[0].startsWith('All');
    S('text', { x: LW - 14, y: y + rh / 2 + 4, 'text-anchor': 'end', text: rw[0], class: joint ? 'lab-strong' : 'lab-ink', style: 'font-size:13px' }, svg);
    const b = S('rect', { x: LW, y: y + 7, height: rh - 14, width: 0, rx: 3, style: `fill:${joint ? 'var(--ink2)' : 'var(--nui)'}` }, svg);
    const t = S('text', { x: LW + 6, y: y + rh / 2 + 4, text: rw[1] < 0.01 ? '< 0.01%' : rw[1].toFixed(1) + '%', style: 'font:500 12px JetBrains Mono,monospace;fill:var(--ink);opacity:0' }, svg);
    const hit = S('rect', { x: 0, y, width: W, height: rh, style: 'fill:transparent' }, svg);
    hit.addEventListener('mousemove', e => showTip(`<b>${rw[0]}</b><br>R² = ${rw[1] < 0.01 ? '< 0.01' : rw[1].toFixed(1)}%<br>${rw[2]}`, e.clientX, e.clientY));
    hit.addEventListener('mouseleave', hideTip);
    bars.push({ b, t, v: rw[1] });
    y += rh;
  });
  onVisible(svg, () => tween(1200, p => {
    bars.forEach((o, i) => {
      const q = clamp(p * 1.4 - i * 0.06, 0, 1), w = Math.max(o.v > 0.05 ? 2 : 0, (Xv(o.v) - LW) * ease(q));
      o.b.setAttribute('width', w); o.t.setAttribute('x', LW + w + 8); o.t.style.opacity = q;
    });
  }), 0.4);
})();

/* ------------------------------------------------------------------ 7. backfitting toy */
(function backfit() {
  const svg = $('#bf-svg'); if (!svg) return;
  const W = 960, H = 360, m = { l: 40, r: 16, t: 40, b: 38 };
  const NT = 100, XK = i => 5 + 10 * i, COAST = 640, TOWN = 28, NB = 9, SIG = 25;
  const r = rng(2026);
  const truth = Array.from({ length: NT }, (_, i) => {
    const x = XK(i);
    let v = x < COAST ? 0.36 + 0.15 * Math.sin(x / 150) + 0.07 * Math.sin(x / 47 + 1.3) : -0.50 + 0.04 * Math.sin(x / 80);
    if (i === TOWN) v += 0.42;
    return v;
  });
  const P = 6;
  const pass = Array.from({ length: NT }, () => Math.floor(r() * 5));
  pass[44] = 5; pass[47] = 5;
  let dP = [0.44, -0.37, 0.21, -0.16, 0.31, -0.48];
  const cnt = Array(P).fill(0); let mu = 0;
  pass.forEach(p => { cnt[p]++; mu += dP[p]; }); mu /= NT; dP = dP.map(v => v - mu);
  const blk = i => Math.floor(XK(i) / 120);
  const dB = Array.from({ length: P * NB }, () => 0.10 * gauss(r));
  const f = truth.map((t, i) => t + dP[pass[i]] + dB[pass[i] * NB + blk(i)] + 0.03 * gauss(r));
  const smooth = (a, sig) => a.map((_, i) => { let s = 0, w = 0; for (let j = 0; j < NT; j++) { const d = XK(i) - XK(j), k = Math.exp(-d * d / (2 * sig * sig)); s += k * a[j]; w += k; } return s / w; });
  const shrunk = (res, key, n, kap) => { const s = new Float64Array(n), c = new Float64Array(n); res.forEach((v, i) => { s[key(i)] += v; c[key(i)]++; }); return Array.from(s, (v, k) => v / (c[k] + kap)); };
  const kP = i => pass[i], kB = i => pass[i] * NB + blk(i);
  const KP = 1.0, KB = 3.0;
  const s1 = smooth(f, SIG);
  let dp = shrunk(f.map((v, i) => v - s1[i]), kP, P, KP);
  const y2 = f.map((v, i) => v - dp[pass[i]]);
  let db = shrunk(f.map((v, i) => v - s1[i] - dp[pass[i]]), kB, P * NB, KB);
  const y3 = f.map((v, i) => v - dp[pass[i]] - db[kB(i)]);
  const dp1 = dp.slice();
  let sc = s1;
  for (let it = 2; it <= 4; it++) {
    sc = smooth(f.map((v, i) => v - dp[pass[i]] - db[kB(i)]), SIG);
    dp = shrunk(f.map((v, i) => v - sc[i] - db[kB(i)]), kP, P, KP);
    db = shrunk(f.map((v, i) => v - sc[i] - dp[pass[i]]), kB, P * NB, KB);
  }
  const y4 = f.map((v, i) => v - dp[pass[i]] - db[kB(i)]);
  const yb = smooth(f, SIG);
  const ST = [
    { y: f, s: null, est: null, t: '<b>Observed.</b> Each tile is the true geography (dashed) plus the offset of the pass that imaged it, the offset of its 120 km block, and a little noise. Neighbours from different passes land far apart, and the town and the coast are hard to make out.' },
    { y: f, s: s1, est: null, t: '<b>1 · Estimate the geography.</b> Smooth all tiles together (grey line). The estimate is blurry, which is fine: it only serves as a reference for computing residuals and never enters the output.' },
    { y: y2, s: s1, est: dp1, t: '<b>2 · Pass offsets: the acquisition context.</b> For each pass, average its tiles\' residuals from the grey line, shrink the average toward zero, and subtract it. A pass\'s tiles are spread along the whole transect, so the blur of the grey line at the coast and at the town averages out.' },
    { y: y3, s: s1, est: dp1, t: '<b>3 · Block offsets: the weather.</b> Inside each pass, 120 km blocks absorb what drifts along the strip. The two-tile pass (violet) is only partly corrected: two tiles are little evidence, so its estimate is shrunk.' },
    { y: y4, s: sc, est: dp, t: '<b>4 · Repeat.</b> Re-estimate the geography from the corrected tiles, then the offsets, four times. The tiles now sit on the true geography, and the coast is still a step and the town still a spike, because no neighbour was ever averaged into a tile.' },
    { y: yb, s: null, est: null, t: '<b>For comparison, a blur.</b> A Gaussian average of the observed tiles also reduces the scatter, but it rounds off the coast, flattens the town, and leaves part of the pass offsets in place.' },
  ];
  const yMin = -1.2, yMax = 1.2;
  const X = x => m.l + x / 1000 * (W - m.l - m.r);
  const Y = v => m.t + (yMax - v) / (yMax - yMin) * (H - m.t - m.b);
  S('rect', { x: X(COAST), y: m.t, width: X(1000) - X(COAST), height: H - m.t - m.b, style: 'fill:rgba(var(--acq-rgb),.06)' }, svg);
  S('line', { x1: X(COAST), x2: X(COAST), y1: m.t, y2: H - m.b, style: 'stroke:var(--grid);stroke-width:1' }, svg);
  [[120, 'land', 'middle'], [XK(TOWN) + 12, 'town', 'start'], [COAST - 10, 'coast', 'end'], [820, 'sea', 'middle']].forEach(([x, t, a]) => S('text', { x: X(x), y: m.t + 18, 'text-anchor': a, text: t, style: 'font:500 11px JetBrains Mono,monospace;letter-spacing:.08em;text-transform:uppercase;fill:var(--muted)' }, svg));
  [0, 200, 400, 600, 800, 1000].forEach(x => S('text', { x: X(x), y: H - m.b + 22, 'text-anchor': x === 1000 ? 'end' : x === 0 ? 'start' : 'middle', text: x + ' km' }, svg));
  S('line', { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b, class: 'gridl' }, svg);
  S('text', { x: 14, y: (m.t + H - m.b) / 2, 'text-anchor': 'middle', transform: `rotate(-90 14 ${(m.t + H - m.b) / 2})`, text: 'embedding (1-D)', class: 'lab-ink' }, svg);
  const linePath = a => a.map((v, i) => (i ? 'L' : 'M') + X(XK(i)).toFixed(1) + ',' + Y(v).toFixed(1)).join('');
  const truthP = S('path', { d: (() => { let d = ''; for (let i = 0; i < NT; i++) { const x = X(XK(i)), y = Y(truth[i]); if (i === TOWN) d += `L${(X(XK(i)) - 4).toFixed(1)},${Y(truth[i - 1]).toFixed(1)}L${(x - 3).toFixed(1)},${y.toFixed(1)}L${(x + 3).toFixed(1)},${y.toFixed(1)}L${(x + 4).toFixed(1)},${Y(truth[i + 1]).toFixed(1)}`; else if (i > 0 && XK(i - 1) < COAST && XK(i) > COAST) d += `L${X(COAST).toFixed(1)},${Y(truth[i - 1]).toFixed(1)}L${X(COAST).toFixed(1)},${y.toFixed(1)}L${x.toFixed(1)},${y.toFixed(1)}`; else d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } return d; })(), style: 'fill:none;stroke:var(--ink2);stroke-width:1.6;stroke-dasharray:5 4;opacity:.55' }, svg);
  const sP = S('path', { style: 'fill:none;stroke:var(--neutral);stroke-width:3;opacity:0;transition:opacity .5s' }, svg);
  const PCOL = ['var(--acq)', 'var(--nui)', 'var(--spa)', 'var(--c4)', 'var(--c5)', 'var(--c6)'];
  const cur = f.slice();
  const dots = f.map((v, i) => {
    const c = S('circle', { cx: X(XK(i)), cy: Y(v), r: 5, style: `fill:${PCOL[pass[i]]};stroke:var(--card);stroke-width:1.8;transition:opacity .2s` }, svg);
    c.addEventListener('mouseenter', e => {
      dots.forEach((d, j) => { d.style.opacity = pass[j] === pass[i] ? 1 : 0.2; });
      const est = ST[stage].est;
      showTip(`<span class="sw" style="background:${PCOL[pass[i]]}"></span><b>Pass ${pass[i] + 1}</b> · ${cnt[pass[i]]} tiles<br>Tile at ${XK(i)} km, block ${blk(i) + 1}<br>True pass offset ${fmt(dP[pass[i]])}` + (est ? `<br>Estimated ${fmt(est[pass[i]])}` : ''), e.clientX, e.clientY);
    });
    c.addEventListener('mouseleave', () => { dots.forEach(d => { d.style.opacity = 1; }); hideTip(); });
    return c;
  });
  const legend = S('g', {}, svg);
  for (let p = 0; p < P; p++) {
    const gx = W - m.r - (P - p) * 92;
    S('circle', { cx: gx, cy: 12, r: 5, style: `fill:${PCOL[p]}` }, legend);
    S('text', { x: gx + 10, y: 16, text: `pass ${p + 1} (${cnt[p]})`, style: 'font-size:11.5px' }, legend);
  }
  const text = $('#bf-text'), met = $('#bf-metrics'), btns = $$('#bf-steps button');
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  function metrics(y) {
    const rmse = Math.sqrt(mean(y.map((v, i) => (v - truth[i]) ** 2)));
    const loc = [26, 27, 28, 29, 30, 61, 62, 63, 64, 65, 66];
    const local = Math.sqrt(mean(loc.map(i => (y[i] - truth[i]) ** 2)));
    return { rmse, local };
  }
  const m0 = metrics(f);
  let stage = 0, stop = null, auto = null;
  function go(s, animate = true) {
    const from = cur.slice(), to = ST[s].y;
    stage = s;
    btns.forEach((b, i) => { b.classList.toggle('on', i === s); b.classList.toggle('done', s <= 4 && i < s); });
    text.innerHTML = ST[s].t;
    if (ST[s].s) { sP.setAttribute('d', linePath(ST[s].s)); sP.style.opacity = 0.9; } else sP.style.opacity = 0;
    const mm = metrics(to);
    met.innerHTML = `<span>Error vs true geography, all tiles<b>${mm.rmse.toFixed(3)}</b>${s ? ` <span class="c-muted">(raw ${m0.rmse.toFixed(3)})</span>` : ''}</span>` +
      `<span>Error at the town and the coast<b>${mm.local.toFixed(3)}</b>${s ? ` <span class="c-muted">(raw ${m0.local.toFixed(3)})</span>` : ''}</span>`;
    if (stop) stop();
    if (!animate || REDUCE) { to.forEach((v, i) => { cur[i] = v; dots[i].setAttribute('cy', Y(v)); }); return; }
    stop = tween(1100, p => {
      to.forEach((v, i) => {
        const q = ease(clamp((p * 1100 - pass[i] * 70) / 680, 0, 1));
        cur[i] = lerp(from[i], v, q); dots[i].setAttribute('cy', Y(cur[i]));
      });
    });
  }
  btns.forEach(b => b.addEventListener('click', () => { if (auto) { clearInterval(auto); auto = null; } go(+b.dataset.s); }));
  $('#bf-truth').addEventListener('change', e => { truthP.style.display = e.target.checked ? '' : 'none'; });
  go(0, false);
  onVisible(svg, () => {
    if (REDUCE) return;
    let s = 0;
    auto = setInterval(() => { s++; if (s > 4) { clearInterval(auto); auto = null; return; } go(s); }, 3400);
  }, 0.55);
})();

/* ------------------------------------------------------------------ 8. shrinkage curve */
(function shrink() {
  const svg = $('#shr-svg'); if (!svg) return;
  const W = 400, H = 230, m = { l: 40, r: 16, t: 14, b: 36 };
  const X = n => m.l + Math.log(n) / Math.log(200) * (W - m.l - m.r);
  const Y = v => m.t + (1 - v) * (H - m.t - m.b);
  [0, 0.5, 1].forEach(v => { S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'gridl' }, svg); S('text', { x: m.l - 8, y: Y(v) + 4, 'text-anchor': 'end', text: Math.round(v * 100) + '%' }, svg); });
  [1, 2, 12, 50, 200].forEach(n => S('text', { x: X(n), y: H - m.b + 18, 'text-anchor': 'middle', text: n }, svg));
  S('text', { x: (m.l + W - m.r) / 2, y: H - 4, 'text-anchor': 'middle', text: 'tiles in the group (log scale)', class: 'lab-ink' }, svg);
  const path = S('path', { style: 'fill:none;stroke:var(--acq);stroke-width:2.4' }, svg);
  const marks = [[2, 'two-tile group'], [12, 'median pass']].map(([n, l]) => ({ n, c: S('circle', { r: 5, style: 'fill:var(--acq);stroke:var(--card);stroke-width:2' }, svg), t: S('text', { class: 'lab-ink', style: 'font-size:12px' }, svg), l }));
  const k = $('#shr-k'), ko = $('#shr-ko'), note = $('#shr-note');
  function draw() {
    const kap = +k.value; ko.value = kap.toFixed(1);
    let d = ''; for (let i = 0; i <= 80; i++) { const n = Math.exp(i / 80 * Math.log(200)); d += (i ? 'L' : 'M') + X(n).toFixed(1) + ',' + Y(n / (n + kap)).toFixed(1); }
    path.setAttribute('d', d);
    marks.forEach(o => { const v = o.n / (o.n + kap); o.c.setAttribute('cx', X(o.n)); o.c.setAttribute('cy', Y(v)); o.t.setAttribute('x', X(o.n) + 9); o.t.setAttribute('y', Y(v) + 16); o.t.textContent = `${o.l}: ${Math.round(v * 100)}%`; });
    note.innerHTML = `A single tile gets ${Math.round(100 / (1 + kap))}% of its own residual removed; a 200-tile group, ${Math.round(20000 / (200 + kap))}%.`;
  }
  k.addEventListener('input', draw); draw();
})();

/* ------------------------------------------------------------------ 9. nuisance removed vs detail kept (real data) */
(function frontier() {
  const svg = $('#fr-svg'); if (!svg) return;
  const W = 820, H = 400, m = { l: 66, r: 30, t: 20, b: 54 };
  const X = v => m.l + v / 100 * (W - m.l - m.r);
  const Y = v => m.t + (102 - v) / (102 - 40) * (H - m.t - m.b);
  [40, 60, 80, 100].forEach(v => { S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'gridl' }, svg); S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', text: v + '%' }, svg); });
  [0, 25, 50, 75, 100].forEach(v => { S('line', { x1: X(v), x2: X(v), y1: m.t, y2: H - m.b, class: 'gridl' }, svg); S('text', { x: X(v), y: H - m.b + 20, 'text-anchor': 'middle', text: v + '%' }, svg); });
  S('text', { x: (m.l + W - m.r) / 2, y: H - 10, 'text-anchor': 'middle', text: 'Same-pass vs different-pass gap removed (nuisance)', class: 'lab-ink' }, svg);
  S('text', { x: 16, y: (m.t + H - m.b) / 2, 'text-anchor': 'middle', transform: `rotate(-90 16 ${(m.t + H - m.b) / 2})`, text: 'Local detail kept', class: 'lab-ink' }, svg);
  const ideal = S('g', { style: 'opacity:0' }, svg);
  S('rect', { x: X(86), y: Y(102), width: X(100) - X(86), height: Y(93) - Y(102), rx: 6, style: 'fill:rgba(var(--spa-rgb),.10);stroke:rgba(var(--spa-rgb),.5);stroke-width:1' }, ideal);
  S('text', { x: X(100), y: Y(93) + 16, 'text-anchor': 'end', text: 'ideal', style: 'font:500 11px JetBrains Mono,monospace;letter-spacing:.08em;text-transform:uppercase;fill:var(--muted)' }, ideal);
  const blur = [[46.2, 63.1, 'λ = 0.4'], [78.2, 48.4, 'λ = 0.8'], [88.9, 49.5, 'λ = 1.0']];
  const acq = [[91.5, 100.0, '160 km blocks'], [94.0, 99.1, '120 km blocks (used)']];
  const bl = S('path', { d: 'M' + X(0) + ',' + Y(100) + blur.map(p => 'L' + X(p[0]) + ',' + Y(p[1])).join(''), style: 'fill:none;stroke:var(--nui);stroke-width:2;opacity:.5' }, svg);
  const len = bl.getTotalLength ? bl.getTotalLength() : 600;
  bl.style.strokeDasharray = len; bl.style.strokeDashoffset = len;
  const pts = [];
  const add = (x, y, col, lab, dx, dy, anchor, tipHtml) => {
    const g = S('g', { style: 'opacity:0;transition:opacity .4s' }, svg);
    S('circle', { cx: X(x), cy: Y(y), r: 6, style: `fill:${col};stroke:var(--card);stroke-width:2` }, g);
    S('text', { x: X(x) + dx, y: Y(y) + dy, 'text-anchor': anchor, text: lab, class: 'lab-ink', style: 'font-size:12.5px' }, g);
    const h = S('circle', { cx: X(x), cy: Y(y), r: 14, style: 'fill:transparent' }, g);
    h.addEventListener('mousemove', e => showTip(tipHtml, e.clientX, e.clientY)); h.addEventListener('mouseleave', hideTip);
    pts.push(g);
  };
  add(0, 100, 'var(--neutral)', 'raw', 10, -10, 'start', '<b>Raw embeddings</b><br>nothing removed, all detail kept');
  blur.forEach(p => add(p[0], p[1], 'var(--nui)', 'blur ' + p[2], 0, p[2] === 'λ = 0.8' ? 22 : -14, 'middle', `<b>Gaussian blend, ${p[2]}</b><br>gap removed ${p[0]}%<br>detail kept ${p[1]}%`));
  acq.forEach((p, i) => add(p[0], p[1], 'var(--acq)', p[2], i ? -14 : -12, i ? 22 : -12, 'end',`<b>Acquisition correction, ${p[2]}</b><br>gap removed ${p[0]}%<br>detail kept ${p[1]}%`));
  onVisible(svg, () => {
    pts.forEach((g, i) => setTimeout(() => { g.style.opacity = 1; }, REDUCE ? 0 : 200 + i * 260));
    setTimeout(() => { ideal.style.transition = 'opacity .6s'; ideal.style.opacity = 1; }, REDUCE ? 0 : 1700);
    tween(1100, p => { bl.style.strokeDashoffset = len * (1 - ease(p)); });
  }, 0.45);
})();

/* ------------------------------------------------------------------ 10. MRF sandbox (toy) */
(function sandbox() {
  const cT = $('#mrf-truth'); if (!cT) return;
  const cO = $('#mrf-obs'), cR = $('#mrf-out');
  const G = 64, NN = G * G;
  const N = makeNoise(77), r = rng(808);
  const NOISE = 0.09, SR = 0.25; // toy residual noise per channel; range-kernel scale of the similarity term
  const COL = { forest: [0.40, 0.30, 0.80], crop: [0.84, 0.52, 0.72], ocean: [0.86, 0.80, 0.93], town: [0.98, 0.93, 0.50] };
  const T = new Float32Array(NN * 3), F = new Float32Array(NN * 3), cls = new Int8Array(NN), spec = new Int8Array(NN), pres = new Uint8Array(NN);
  const coastX = y => 41 + 5 * Math.sin(y / 8.5) + 2.5 * Math.sin(y / 3.7 + 1);
  const isl = { x: 56, y: 12, r: 2.4 }, town = { x: 14, y: 47 };
  const landAt = (x, y) => x <= coastX(y) || Math.hypot(x - isl.x, y - isl.y) <= isl.r;
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    const i = y * G + x;
    let c, k;
    const onIsl = Math.hypot(x - isl.x, y - isl.y) <= isl.r;
    if (x > coastX(y) && !onIsl) { c = COL.ocean; k = 2; }
    else if (onIsl) { c = COL.forest; k = 0; spec[i] = 1; }
    else if (x === town.x && y === town.y) { c = COL.town; k = 3; spec[i] = 2; }
    else if (N(x / 12, y / 12, 2) > 0.1 && x < coastX(y) - 1.5) { c = COL.crop; k = 1; }
    else { c = COL.forest; k = 0; }
    cls[i] = k;
    const v = 0.035 * N(x / 8 + 40, y / 8, 2);
    for (let q = 0; q < 3; q++) T[3 * i + q] = c[q] + v * (q === 1 ? -1 : 1);
    let near = false;
    if (k === 2) { for (let dy = -3; dy <= 3 && !near; dy++) for (let dx = -3; dx <= 3; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < G && yy < G && landAt(xx, yy)) { near = true; break; } } }
    pres[i] = (k === 2 && !near) ? 0 : (spec[i] ? 1 : (r() < 0.015 ? 0 : 1));
    for (let q = 0; q < 3; q++) F[3 * i + q] = T[3 * i + q] + NOISE * gauss(r);
  }
  const OFF = []; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const d2 = dx * dx + dy * dy; if (d2 && d2 <= 6.25) OFF.push([dx, dy, Math.exp(-d2 / (2 * 1.5 * 1.5))]); }
  const nbr = Array.from({ length: NN }, () => []), ncount = new Uint8Array(NN);
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    const i = y * G + x; if (!pres[i]) continue;
    for (const [dx, dy, g] of OFF) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= G || yy >= G) continue; const j = yy * G + xx; if (pres[j]) nbr[i].push([j, g]); }
    ncount[i] = nbr[i].length;
  }
  function weights(edge) {
    return nbr.map((L, i) => L.map(([j, g]) => {
      if (!edge) return [j, g];
      let d2 = 0; for (let q = 0; q < 3; q++) { const d = F[3 * i + q] - F[3 * j + q]; d2 += d * d; }
      return [j, g * Math.exp(-d2 / (2 * SR * SR))];
    }));
  }
  const Wedge = weights(true), Wplain = weights(false);
  function solve(Wt, mu, sweeps) {
    let deg = new Float32Array(NN), md = 0, np = 0;
    for (let i = 0; i < NN; i++) if (pres[i]) { let s = 0; for (const [, w] of Wt[i]) s += w; deg[i] = s; md += s; np++; }
    const mup = mu / (md / np);
    let Hc = Float32Array.from(F), Hn = new Float32Array(NN * 3);
    for (let s = 0; s < sweeps; s++) {
      for (let i = 0; i < NN; i++) {
        if (!pres[i]) continue;
        let a0 = 0, a1 = 0, a2 = 0;
        for (const [j, w] of Wt[i]) { a0 += w * Hc[3 * j]; a1 += w * Hc[3 * j + 1]; a2 += w * Hc[3 * j + 2]; }
        const den = 1 + mup * deg[i];
        Hn[3 * i] = (F[3 * i] + mup * a0) / den; Hn[3 * i + 1] = (F[3 * i + 1] + mup * a1) / den; Hn[3 * i + 2] = (F[3 * i + 2] + mup * a2) / den;
      }
      [Hc, Hn] = [Hn, Hc];
    }
    return Hc;
  }
  function paint(cv, A) {
    const ctx = cv.getContext('2d'), im = ctx.createImageData(G, G);
    for (let i = 0; i < NN; i++) {
      const p = 4 * i;
      if (!pres[i]) { im.data[p] = 0; im.data[p + 1] = 0; im.data[p + 2] = 0; im.data[p + 3] = 255; continue; }
      im.data[p] = toByte(A[3 * i]); im.data[p + 1] = toByte(A[3 * i + 1]); im.data[p + 2] = toByte(A[3 * i + 2]); im.data[p + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }
  // metric index sets
  const flat = [], edges = [], special = [];
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    const i = y * G + x; if (!pres[i]) continue;
    if (spec[i]) {
      const ring = [];
      for (const [j] of nbr[i]) if (!spec[j] || spec[j] !== spec[i]) { if (cls[j] !== cls[i] || spec[j] !== spec[i]) ring.push(j); }
      if (ring.length) special.push([i, ring.filter(j => !spec[j])]);
      continue;
    }
    let same = true;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= G || yy >= G) continue; const j = yy * G + xx; if (pres[j] && (cls[j] !== cls[i] || spec[j])) same = false; }
    if (same) flat.push(i);
    for (const [dx, dy] of [[1, 0], [0, 1]]) { const xx = x + dx, yy = y + dy; if (xx >= G || yy >= G) continue; const j = yy * G + xx; if (pres[j] && !spec[j] && cls[j] !== cls[i]) edges.push([i, j]); }
  }
  const dot3 = (A, i, B, j, Cc, k, Dd, l) => { let s = 0; for (let q = 0; q < 3; q++) s += (A[3 * i + q] - B[3 * j + q]) * (Cc[3 * k + q] - Dd[3 * l + q]); return s; };
  function score(O) {
    let num = 0, den = 0;
    for (const i of flat) for (let q = 0; q < 3; q++) { num += (O[3 * i + q] - T[3 * i + q]) ** 2; den += (F[3 * i + q] - T[3 * i + q]) ** 2; }
    const noise = 1 - num / den;
    let en = 0, ed = 0;
    for (const [i, j] of edges) { en += dot3(O, i, O, j, T, i, T, j); ed += dot3(T, i, T, j, T, i, T, j); }
    let sn = 0, sd = 0;
    for (const [i, ring] of special) {
      if (!ring.length) continue;
      const mo = [0, 0, 0], mt = [0, 0, 0];
      for (const j of ring) for (let q = 0; q < 3; q++) { mo[q] += O[3 * j + q] / ring.length; mt[q] += T[3 * j + q] / ring.length; }
      for (let q = 0; q < 3; q++) { sn += (O[3 * i + q] - mo[q]) * (T[3 * i + q] - mt[q]); sd += (T[3 * i + q] - mt[q]) ** 2; }
    }
    return { noise, edge: en / ed, isl: sn / sd };
  }
  const lam = $('#mrf-lam'), lamO = $('#mrf-lam-o'), edgeC = $('#mrf-edge'), suppC = $('#mrf-supp'), cap = $('#mrf-out-cap');
  let MU = 1;
  const PRE = { ours: { l: 0.7, e: true, s: true, mu: 1 }, blur: { l: 1, e: false, s: false, mu: 4 }, off: { l: 0, e: true, s: true, mu: 1 } };
  function output(sweeps) {
    const Hc = solve(edgeC.checked ? Wedge : Wplain, MU, sweeps);
    const O = new Float32Array(NN * 3), L0 = +lam.value;
    for (let i = 0; i < NN; i++) {
      if (!pres[i]) continue;
      const li = L0 * (suppC.checked ? ncount[i] / (ncount[i] + 4) : 1);
      for (let q = 0; q < 3; q++) O[3 * i + q] = (1 - li) * F[3 * i + q] + li * Hc[3 * i + q];
    }
    return O;
  }
  function setMeter(id, v) { const pc = clamp(Math.round(v * 100), 0, 100); $('#' + id).textContent = pc + '%'; $('#' + id + '-b').style.width = pc + '%'; }
  function update(sweeps = 15) {
    lamO.value = (+lam.value).toFixed(2);
    const O = output(sweeps);
    paint(cR, O);
    const sc = score(O);
    setMeter('m-noise', sc.noise); setMeter('m-edge', sc.edge); setMeter('m-isl', sc.isl);
    cap.textContent = sweeps < 15 ? `Regularised · sweep ${sweeps} of 15` : 'Regularised';
    window.__mrfScore = sc;
  }
  paint(cT, T); paint(cO, F);
  const custom = () => setPressed($('#mrf-pre'), null);
  lam.addEventListener('input', () => { custom(); update(); });
  edgeC.addEventListener('change', () => { custom(); update(); });
  suppC.addEventListener('change', () => { custom(); update(); });
  $$('#mrf-pre button').forEach(b => b.addEventListener('click', () => {
    setPressed($('#mrf-pre'), b);
    const p = PRE[b.dataset.p]; lam.value = p.l; edgeC.checked = p.e; suppC.checked = p.s; MU = p.mu; update();
  }));
  let playing = 0;
  $('#mrf-play').addEventListener('click', () => {
    clearInterval(playing); let s = 0; update(0);
    playing = setInterval(() => { s++; update(s); if (s >= 15) clearInterval(playing); }, REDUCE ? 0 : 140);
  });
  update(15);
})();

/* ------------------------------------------------------------------ 11. variance spectrum (real data) */
(function spectrum() {
  const svg = $('#sp-svg'); if (!svg) return;
  const SPA = [[1, 1.2], [2, 4.9], [3, 3.1], [4, 5.4], [5, 5.1], [6, 6.6], [7.5, 8.4], [9.5, 11.6], [12, 12.1], [15, 12.6], [18, 13.9], [21.9, 13.7], [26.9, 14.3], [32.9, 15.8], [40.3, 16.4], [49.3, 16.2], [60.7, 16.7], [74.7, 17.3], [91.1, 17.5], [111, 17.9], [135.8, 18.3], [166.2, 18.7], [203, 19.0], [248.3, 19.3], [304, 19.6], [371.7, 19.8], [454.2, 20.0], [555.3, 20.2], [678.6, 20.2]];
  const ACQ = [[1, 3, 39.7], [4, 10, 47.7], [11, 25, 50.3], [26, 64, 49.4]];
  const W = 860, H = 380, m = { l: 60, r: 150, t: 20, b: 52 };
  const X = n => m.l + Math.log(n) / Math.log(750) * (W - m.l - m.r);
  const Y = v => H - m.b - v / 56 * (H - m.t - m.b);
  [0, 10, 20, 30, 40, 50].forEach(v => { S('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), class: 'gridl' }, svg); S('text', { x: m.l - 10, y: Y(v) + 4, 'text-anchor': 'end', text: v + '%' }, svg); });
  [1, 3, 10, 25, 64, 200, 750].forEach(n => S('text', { x: X(n), y: H - m.b + 20, 'text-anchor': 'middle', text: 'PC ' + n }, svg));
  S('text', { x: (m.l + W - m.r) / 2, y: H - 8, 'text-anchor': 'middle', text: 'Principal direction of the raw embeddings (most variance on the left)', class: 'lab-ink' }, svg);
  S('text', { x: 16, y: (m.t + H - m.b) / 2, 'text-anchor': 'middle', transform: `rotate(-90 16 ${(m.t + H - m.b) / 2})`, text: 'Variance removed', class: 'lab-ink' }, svg);
  S('rect', { x: X(1), y: m.t, width: X(3.5) - X(1), height: H - m.t - m.b, style: 'fill:rgba(var(--acq-rgb),.05)' }, svg);
  let dA = ''; ACQ.forEach(([a, b, v], i) => { dA += (i ? 'L' : 'M') + X(a === 1 ? 1 : a - 0.5) + ',' + Y(v) + 'L' + X(b + 0.5) + ',' + Y(v); });
  const pA = S('path', { d: dA, style: 'fill:none;stroke:var(--acq);stroke-width:2.4;stroke-linejoin:round' }, svg);
  const pS = S('path', { d: SPA.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(''), style: 'fill:none;stroke:var(--spa);stroke-width:2.4;stroke-linejoin:round' }, svg);
  const eA = S('circle', { cx: X(64.5), cy: Y(49.4), r: 4.5, style: 'fill:var(--acq);stroke:var(--card);stroke-width:2' }, svg);
  const eS = S('circle', { cx: X(678.6), cy: Y(20.2), r: 4.5, style: 'fill:var(--spa);stroke:var(--card);stroke-width:2' }, svg);
  const tA = S('text', { x: X(64.5) + 12, y: Y(49.4) + 4, class: 'lab-ink', style: 'font-size:13px', text: 'acquisition: 43% overall' }, svg);
  const tS = S('text', { x: X(678.6) + 12, y: Y(20.2) + 4, class: 'lab-ink', style: 'font-size:13px', text: 'spatial: 5% overall' }, svg);
  const n1 = S('text', { x: X(1.9), y: Y(13), 'text-anchor': 'middle', class: 'lab-strong', style: 'font-size:12px', text: 'PCs 1–3: 2.6%' }, svg);
  [pA, pS].forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  [eA, eS, tA, tS, n1].forEach(e => { e.style.opacity = 0; e.style.transition = 'opacity .5s'; });
  onVisible(svg, () => tween(1500, p => {
    [pA, pS].forEach(q => { q.style.strokeDashoffset = q.getTotalLength() * (1 - ease(p)); });
    if (p >= 1) [eA, eS, tA, tS, n1].forEach(e => { e.style.opacity = 1; });
  }), 0.4);
  const cross = S('line', { y1: m.t, y2: H - m.b, style: 'stroke:var(--ink2);stroke-width:1;opacity:0' }, svg);
  const hit = S('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, style: 'fill:transparent' }, svg);
  hit.addEventListener('mousemove', e => {
    const b = svg.getBoundingClientRect(), sx = (e.clientX - b.left) / b.width * W;
    const n = Math.exp((sx - m.l) / (W - m.l - m.r) * Math.log(750));
    let bi = 0; SPA.forEach((p, i) => { if (Math.abs(Math.log(p[0]) - Math.log(n)) < Math.abs(Math.log(SPA[bi][0]) - Math.log(n))) bi = i; });
    const a = ACQ.find(([lo, hi]) => n >= lo - 0.5 && n <= hi + 0.5);
    cross.setAttribute('x1', X(SPA[bi][0])); cross.setAttribute('x2', X(SPA[bi][0])); cross.style.opacity = 0.35;
    showTip(`<b>Around PC ${Math.round(SPA[bi][0])}</b><br><span class="sw" style="background:var(--spa)"></span>spatial: ${SPA[bi][1].toFixed(1)}% removed` + (a ? `<br><span class="sw" style="background:var(--acq)"></span>acquisition (PCs ${a[0]}–${a[1]}): ${a[2]}%` : '<br><span class="c-muted">acquisition: measured on PCs 1–64 only</span>'), e.clientX, e.clientY);
  });
  hit.addEventListener('mouseleave', () => { cross.style.opacity = 0; hideTip(); });
})();

/* ------------------------------------------------------------------ 12. grading figure (real data) */
(function grading() {
  const host = $('#grade'); if (!host) return;
  // v = [raw, full blur, acquisition correction]; dom = [left end, right end], right = what the metric calls better
  const M = [
    { sep: 'Plausible metrics: a blur games them', col: 'var(--nui)' },
    { n: 'Neighbour difference in flat regions', d: 'Semivariance between adjacent tiles of uniform land cover. Lower looks better, so the axis runs right to left.', v: [0.1443, 0.0004, 0.0172], dp: 4, dom: [0.16, 0], ends: ['0.16', '0'], rank: '1st' },
    { n: 'Edge-to-flat contrast', d: 'Contrast across land-cover boundaries over contrast inside uniform regions. Higher looks better.', v: [1.144, 2.203, 1.825], dp: 2, dom: [1, 2.4], ends: ['1.0', '2.4'], rank: '1st' },
    { n: 'Land-cover probe accuracy', d: 'All tiles. Higher looks better.', v: [0.697, 0.758, 0.748], dp: 3, dom: [0.65, 0.8], ends: ['0.65', '0.80'], rank: '1st' },
    { sep: 'Guardrails: scored per tile, on tiles unlike their neighbours', col: 'var(--spa)' },
    { n: 'Hard-tile land-cover accuracy', d: 'Tiles whose class differs from their neighbourhood majority; train and test split by 400 km blocks.', v: [0.403, 0.237, 0.405], dp: 3, dom: [0.2, 0.45], ends: ['0.20', '0.45'], rank: 'last' },
    { n: 'Island detectability (AUC)', d: 'Can local contrast still rank land surrounded by water above other tiles?', v: [0.782, 0.631, 0.882], dp: 3, dom: [0.6, 0.9], ends: ['0.60', '0.90'], rank: 'last' },
  ];
  const NAMES = ['Raw', 'Full blur', 'Acquisition correction'];
  const COLS = ['var(--neutral)', 'var(--nui)', 'var(--acq)'];
  const dot = k => `<i class="dot" style="background:${COLS[k]}"></i>`;
  host.innerHTML = `<div class="g-row g-head"><div class="g-m">Metric</div><div class="g-s legend">` +
    NAMES.map((nm, k) => `<span>${dot(k)}${nm}</span>`).join('') + `<span class="g-dir">looks better →</span></div><div class="g-v">Verdict</div></div>` +
    M.map((r, i) => r.sep ? `<div class="g-sep" style="color:${r.col}">${r.sep}</div>` :
      `<div class="g-row"><div class="g-m"><span class="mname">${r.n}</span><span class="mdesc">${r.d}</span></div>` +
      `<div class="g-s"><svg class="chart" data-i="${i}" role="img" aria-label="${r.n}: ${NAMES.map((nm, k) => nm + ' ' + r.v[k].toFixed(r.dp)).join(', ')}"></svg></div>` +
      `<div class="g-v"><span class="verdict ${r.rank === '1st' ? 'lose' : 'win'}">blur ${r.rank}</span></div></div>`).join('');

  const H = 80, YD = 47, T1 = 31, T2 = 15, YT = 75, PAD = 32;
  let prog = REDUCE ? 1 : 0;
  const live = [];   // per drawn mark: {g, trail, x0, x1, lab}
  const place = () => live.forEach(o => {
    const x = lerp(o.x0, o.x1, ease(prog));
    o.g.setAttribute('transform', `translate(${x.toFixed(1)},${YD})`);
    if (o.trail) o.trail.setAttribute('x2', x.toFixed(1));
    if (o.lab) o.lab.style.opacity = prog >= 1 ? 1 : 0;
  });
  function draw() {
    live.length = 0;
    $$('svg[data-i]', host).forEach(svg => {
      const r = M[+svg.dataset.i], W = svg.parentNode.clientWidth;
      if (!W) return;
      svg.innerHTML = ''; svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('width', W); svg.setAttribute('height', H);
      const X = v => PAD + (v - r.dom[0]) / (r.dom[1] - r.dom[0]) * (W - 2 * PAD);
      S('line', { x1: PAD, x2: W - PAD, y1: YD, y2: YD, style: 'stroke:var(--grid);stroke-width:2;stroke-linecap:round' }, svg);
      [0, 1].forEach(e => {
        S('line', { x1: e ? W - PAD : PAD, x2: e ? W - PAD : PAD, y1: YD - 5, y2: YD + 5, style: 'stroke:var(--grid);stroke-width:2' }, svg);
        S('text', { x: e ? W - PAD : PAD, y: YT, 'text-anchor': 'middle', style: 'font:11px "JetBrains Mono",monospace', text: r.ends[e] }, svg);
      });
      const xs = r.v.map(X), x0 = xs[0];
      // trails: how far each method moves the metric away from raw
      const trails = [1, 2].map(k => S('line', { x1: x0, x2: x0, y1: YD, y2: YD, style: `stroke:color-mix(in srgb, ${COLS[k]} 50%, var(--card));stroke-width:4;stroke-linecap:round` }, svg));
      // value labels: two tiers, the second used only when two values sit too close to read
      const lw = k => 14 + r.v[k].toFixed(r.dp).length * 7.3, used = [];
      const tier = {};
      [0, 1, 2].sort((p, q) => xs[p] - xs[q]).forEach(k => {
        const lo = xs[k] - lw(k) / 2 - 4, hi = xs[k] + lw(k) / 2 + 4;
        tier[k] = used.some(u => u.t === 1 && lo < u.hi && hi > u.lo) ? 2 : 1;
        used.push({ t: tier[k], lo, hi });
      });
      const labs = [0, 1, 2].map(k => {
        const g = S('g', { transform: `translate(${(clamp(xs[k], PAD + lw(k) / 2 - 14, W - PAD - lw(k) / 2 + 14) - lw(k) / 2).toFixed(1)},${tier[k] === 1 ? T1 : T2})`, style: 'transition:opacity .4s' }, svg);
        S('circle', { cx: 4, cy: -4, r: 3.5, style: `fill:${COLS[k]}` }, g);
        S('text', { x: 12, y: 0, class: 'lab-strong', style: 'font:600 12px "JetBrains Mono",monospace', text: r.v[k].toFixed(r.dp) }, g);
        return g;
      });
      [0, 1, 2].forEach(k => {
        const g = S('g', {}, svg);
        S('circle', { r: 7, style: `fill:${COLS[k]};stroke:var(--card);stroke-width:2` }, g);
        const hit = S('circle', { r: 15, style: 'fill:transparent;cursor:default' }, g);
        hit.addEventListener('mousemove', e => showTip(`<b>${NAMES[k]}</b><br>${r.n}: ${r.v[k].toFixed(r.dp)}` +
          (k ? `<br><span class="c-muted">raw ${r.v[0].toFixed(r.dp)}</span>` : ''), e.clientX, e.clientY));
        hit.addEventListener('mouseleave', hideTip);
        live.push({ g, trail: k ? trails[k - 1] : null, x0: k ? x0 : xs[0], x1: xs[k], lab: k ? labs[k] : null });
      });
    });
    place();
  }
  draw();
  if ('ResizeObserver' in window) { let w = host.clientWidth; new ResizeObserver(() => { if (host.clientWidth !== w) { w = host.clientWidth; draw(); } }).observe(host); }
  onVisible(host, () => tween(1100, p => { prog = p; place(); }), 0.3);
})();


})();
