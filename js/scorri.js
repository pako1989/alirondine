// js/scorri.js - «A SCORRIMENTO» · motore platform 2D in pixel art (Il Pallone di Latta; pensato per servire anche altre saghe: temi, eroi e nemici a registro)
// Livelli come righe di testo (tessere 16x16), sfondi a strati in parallasse generati dal codice e animati (nuvole, bandiere, finestre, petali).
// Eroe «ferro» (Il Pallone di Latta): il pallone di latta è arma E piattaforma. ⚽ calcia (rimbalza sui muri: «sponda» = doppio danno e doppi gettoni),
//   se il pallone è a terra ci salti sopra e ti fa da molla, ⚽ di nuovo lo richiama a boomerang. Salto variabile, tempo di grazia, salto anticipato.
// Tessere: # muro · = asse (si sale da sotto) · B mattone crepato (si rompe col pallone) · ^ punte · o gettone · h pezzo d'armatura (+1) · S stendardo (3 per livello)
//   C gonfalone (punto di ripartenza) · E portone d'uscita · i cartello (testo in level.signs, in ordine) · M piattaforma mobile · P partenza
//   nemici: e Elmo rotolante · c Corvo arbitro (fischia: fermo un attimo) · t Tamburino di pietra (lancia sassi) · s Scudiero (scudo davanti: colpiscilo di sponda o da dietro) · Z capo (level.boss)
// start(o): o.level = { id, name, theme, map: [righe], signs: [testi], boss }, o.title, o.bonus (0-3: pezzi d'armatura in più), o.heroLook ({ skin, hair }), o.tutorial (false = niente spiegazione),
//   o.onDone({ win, a, b, coins, ban, banMask, time, sponde, quit }).
// Test: window.__scorri.state: { phase, hero, ball, foes, coins, ban, hp, press(k, giù), tick(n), finish(win), boss } · pulsanti [data-k=L|R|J|K] · #scGo · #scX.
// Registro per altre saghe: window.__scorri.THEMES[nome] = { sky, layers(meta) ... } e FOES[lettera] (vedi in fondo).
(function () {
  "use strict";
  if (window.__scorri) return;
  const M = window.__mini || {}, VW = 320, VH = 180, TS = 16, SS = 2;
  const esc = M.esc || ((s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const cnv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  // ------------------------------------------------------------ pixel: rettangoli interi e dischi senza sfumature
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const disc = (g, cx, cy, r, c) => { g.fillStyle = c; for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy))); g.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1); } };
  const ell = (g, cx, cy, rx, ry, c) => { g.fillStyle = c; for (let dy = -ry; dy <= ry; dy++) { const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry)))); g.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1); } };
  // banda di cielo con passaggio a scacchi (dithering), come nei vecchi 16 bit
  function skyBands(g, w, y0, y1, cols) {
    const n = cols.length, bh = (y1 - y0) / n;
    for (let i = 0; i < n; i++) {
      const ya = Math.round(y0 + i * bh), yb = Math.round(y0 + (i + 1) * bh); R(g, 0, ya, w, yb - ya, cols[i]);
      if (i < n - 1) { g.fillStyle = cols[i + 1]; for (let y = yb - 3; y < yb; y++) for (let x = (y % 2); x < w; x += 2 + (yb - y > 1 ? 2 : 0)) g.fillRect(x, y, 1, 1); }
    }
  }
  // ------------------------------------------------------------ temi (sfondi a strati + palette delle tessere)
  // ogni strato: { c: canvas largo 512 (si ripete), k: fattore di parallasse, y: scarto verticale, anim(g, ox, oy, f) facoltativo }
  const THEMES = {};
  function cloudStrip(seed, w, h, body, lit, shade, n, ymin, ymax) {
    const c = cnv(w, h), g = c.getContext("2d");
    for (let i = 0; i < n; i++) {
      const cx = Math.round(rnd(seed + i) * w), cy = Math.round(ymin + rnd(seed + i * 3) * (ymax - ymin)), s = 0.7 + rnd(seed + i * 7) * 0.9;
      for (const dx of [-w, 0, w]) {
        const puffs = [[0, 0, 14], [-14, 4, 10], [14, 3, 11], [-24, 8, 7], [25, 8, 7], [6, -6, 10], [-6, -4, 9]];
        puffs.forEach(([px, py, r]) => disc(g, cx + dx + px * s, cy + py * s + 2, Math.round(r * s), shade));
        puffs.forEach(([px, py, r]) => disc(g, cx + dx + px * s, cy + py * s, Math.round(r * s), body));
        puffs.forEach(([px, py, r]) => disc(g, cx + dx + px * s - 1, cy + py * s - 3, Math.max(1, Math.round(r * s) - 4), lit));
        R(g, cx + dx - 30 * s, cy + 9 * s, 60 * s, 2, shade);
      }
    }
    return c;
  }
  // castello lontano: torri con tetti a punta, merli, bandiere (posizioni salvate per animarle)
  function castleStrip(w, h, body, edge, roof, win, flags) {
    const c = cnv(w, h), g = c.getContext("2d"), base = h - 18;
    const tower = (x, tw, th, cone) => {
      R(g, x, base - th, tw, th + 18, body); R(g, x, base - th, 1, th + 18, edge);
      for (let i = 0; i < tw; i += 4) R(g, x + i, base - th - 3, 2, 3, body);
      if (cone) { for (let i = 0; i < cone; i++) { const ww = Math.max(1, Math.round(tw / 2 * (1 - i / cone)) * 2); R(g, x + tw / 2 - ww / 2, base - th - i - 1, ww, 1, i % 5 === 0 ? edge : roof); } flags.push([x + tw / 2, base - th - cone - 1]); }
      for (let y = base - th + 8; y < base; y += 12) { R(g, x + tw / 2 - 1, y, 2, 4, win); }
    };
    R(g, 0, base - 26, w, 44, body); for (let i = 0; i < w; i += 6) R(g, i, base - 30, 4, 4, body);
    [[20, 22, 70, 26], [70, 16, 50, 0], [120, 30, 96, 34], [168, 14, 58, 20], [214, 20, 80, 30], [300, 26, 62, 22], [352, 14, 88, 34], [400, 22, 54, 0], [446, 18, 72, 26]].forEach(([x, tw, th, cone]) => tower(x, tw, th, cone));
    return c;
  }
  // case del borgo: facciate, tetti spioventi, finestre (alcune accese), comignoli
  function townStrip(w, h, cols, wins) {
    const c = cnv(w, h), g = c.getContext("2d"); let x = -10, i = 0;
    while (x < w) {
      const hw = 26 + Math.round(rnd(i * 5 + 1) * 22), hh = 34 + Math.round(rnd(i * 5 + 2) * 34), base = h, top = base - hh, wall = cols.wall[i % cols.wall.length], roof = cols.roof[i % cols.roof.length];
      R(g, x, top, hw, hh, wall); R(g, x, top, 2, hh, cols.edge); R(g, x + hw - 2, top, 2, hh, cols.dark);
      for (let k = 0; k < 12; k++) { R(g, x - 3 + k, top - k, hw + 6 - k * 2, 1, k % 4 === 0 ? cols.roofEdge : roof); if (hw + 6 - k * 2 <= 4) break; }
      if (rnd(i * 5 + 3) > 0.4) { R(g, x + hw - 9, top - 14, 5, 10, cols.dark); R(g, x + hw - 10, top - 15, 7, 2, cols.edge); }
      for (let wy = top + 6; wy < base - 12; wy += 12) for (let wx = x + 5; wx < x + hw - 7; wx += 10) { const lit = rnd(wx * 0.37 + wy) > 0.55; R(g, wx, wy, 5, 6, lit ? cols.lit : cols.win); R(g, wx, wy + 6, 5, 1, cols.dark); if (lit) wins.push([wx, wy]); }
      if (rnd(i * 7) > 0.5) { R(g, x + hw / 2 - 4, base - 12, 8, 12, cols.dark); }
      x += hw + 2 + Math.round(rnd(i * 5 + 4) * 8); i++;
    }
    return c;
  }
  // siepe e alberi in primo piano (silhouette con ciuffi)
  function hedgeStrip(w, h, dark, mid, lit) {
    const c = cnv(w, h), g = c.getContext("2d");
    for (let x = 0; x < w; x += 3) { const top = h - 22 - Math.round(Math.abs(Math.sin(x / 13)) * 8 + rnd(x) * 4); R(g, x, top, 3, h - top, dark); R(g, x, top, 3, 2, mid); }
    for (let i = 0; i < 9; i++) {
      const tx = Math.round(rnd(i + 40) * w), th = 40 + Math.round(rnd(i + 50) * 30);
      for (const dx of [-w, 0, w]) { R(g, tx + dx - 2, h - th + 10, 4, th, dark); [[0, 0, 12], [-9, 6, 9], [9, 5, 10], [0, -8, 9]].forEach(([px, py, r]) => disc(g, tx + dx + px, h - th + py, r, dark)); disc(g, tx + dx - 3, h - th - 10, 4, mid); disc(g, tx + dx + 5, h - th - 2, 3, lit); }
    }
    return c;
  }
  THEMES.mura = {
    name: "Mura al tramonto",
    brick: { base: "#c87a4a", light: "#e39a62", dark: "#9a5434", mortar: "#6e3a28", crack: "#7a4028" },
    grass: { a: "#4f9a34", b: "#86c84a", c: "#2f6a24" }, wood: { a: "#8a5a32", b: "#b07a44", c: "#4a2e18" }, fx: "petali", dark: 0,
    build() {
      const T = { flags: [], wins: [], layers: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#3a2858", "#54306c", "#7a3c78", "#a84a7c", "#d0607a", "#e8806a", "#f2a066", "#f6c070"]);
      disc(g, 236, 112, 24, "#f8d488"); disc(g, 236, 112, 20, "#ffe6a8"); disc(g, 236, 112, 15, "#fff3cc");
      for (let i = 0; i < 4; i++) R(g, 200, 100 + i * 7, 72, 1, "rgba(246,160,102,.7)");
      T.sky = sky;
      T.layers.push({ c: cloudStrip(3, 512, 110, "#f4a8a0", "#ffd8b0", "#b8607e", 7, 20, 70), k: 0.04, y: 0, drift: 0.05 });
      T.layers.push({ c: castleStrip(512, 150, "#5c3a6c", "#7a5288", "#47284f", "#ffcf6a", T.flags), k: 0.12, y: 46, flags: true });
      T.layers.push({ c: cloudStrip(11, 512, 60, "#f8b8a4", "#ffe4c0", "#c87088", 4, 14, 44), k: 0.18, y: 70, drift: 0.12, alpha: 0.85 });
      T.layers.push({ c: townStrip(512, 90, { wall: ["#6a3c5a", "#7a4a5e", "#5e3854"], roof: ["#8a3444", "#9c4448", "#7a2c40"], roofEdge: "#b85a50", edge: "#8a5a6e", dark: "#3e2240", win: "#3a2440", lit: "#ffc65a" }, T.wins), k: 0.32, y: 98, wins: true });
      T.layers.push({ c: hedgeStrip(512, 70, "#2e1c38", "#43294e", "#5a3a5e"), k: 0.55, y: 120 });
      return T;
    }
  };
  THEMES.prova = Object.assign({}, THEMES.mura, { name: "Cortile d'allenamento" });
  // comignoli, antenne e panni stesi in primo piano (tetti di notte)
  function chimneyStrip(w, h, dark, mid, lit) {
    const c = cnv(w, h), g = c.getContext("2d"); let x = 0, i = 0;
    while (x < w) {
      const rw = 40 + Math.round(rnd(i * 3 + 7) * 40), top = h - 18 - Math.round(rnd(i * 3 + 8) * 22);
      for (let k = 0; k < rw / 2; k++) R(g, x + k, top + rw / 2 - k > top ? top + Math.round(k * 0.35) : top, 1, h, dark);
      for (let k = 0; k < rw / 2; k++) R(g, x + rw / 2 + k, top + Math.round((rw / 2 - k) * 0.35), 1, h, dark);
      R(g, x + 4, top + 2, rw - 8, 1, mid);
      if (rnd(i * 5) > 0.3) { const cx = x + 8 + Math.round(rnd(i * 5 + 1) * (rw - 20)); R(g, cx, top - 12, 7, 14, dark); R(g, cx - 1, top - 13, 9, 2, mid); }
      if (rnd(i * 5 + 2) > 0.5) { const ax = x + rw - 10; R(g, ax, top - 20, 1, 20, dark); R(g, ax - 5, top - 18, 11, 1, dark); R(g, ax - 3, top - 14, 7, 1, dark); }
      if (rnd(i * 5 + 3) > 0.55) { const lx = x + rw - 2; g.fillStyle = dark; for (let k = 0; k < 24; k++) g.fillRect(lx + k, top - 6 + Math.round(Math.sin(k / 24 * Math.PI) * 4), 1, 1); [3, 9, 15].forEach((k, j) => R(g, lx + k, top - 4 + Math.round(Math.sin(k / 24 * Math.PI) * 4), 4, 5, [lit, mid, "#7a4a6a"][j])); }
      x += rw; i++;
    }
    return c;
  }
  THEMES.tetti = {
    name: "I tetti di notte", fall: "Giù dai tetti! Si riparte dal gonfalone.",
    brick: { base: "#6a4a5a", light: "#8a6274", dark: "#4a3242", mortar: "#2a1a2a", crack: "#3a2434" },
    roof: { a: "#a0483a", b: "#d07a52", c: "#5a2420" }, grass: null, wood: { a: "#6a4a32", b: "#8a6444", c: "#3a2416" }, fx: "", dark: 0, night: true,
    build() {
      const T = { flags: [], wins: [], layers: [], stars: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#0a0e2c", "#10163a", "#171d48", "#202454", "#2a2a60", "#36306c", "#43387a"]);
      disc(g, 72, 42, 19, "#3a3a6a"); disc(g, 72, 42, 16, "#e8e4c8"); disc(g, 72, 42, 14, "#f6f2dc"); disc(g, 66, 38, 3, "#dcd6b8"); disc(g, 77, 47, 2, "#dcd6b8"); disc(g, 74, 35, 2, "#e4dec2");
      for (let i = 0; i < 70; i++) T.stars.push([Math.round(rnd(i + 5) * VW), Math.round(rnd(i + 90) * 110), i]);
      T.sky = sky;
      T.layers.push({ c: cloudStrip(21, 512, 90, "#2c2e62", "#44488a", "#1c1e48", 5, 18, 60), k: 0.04, y: 6, drift: 0.06, alpha: 0.75 });
      T.layers.push({ c: castleStrip(512, 150, "#1c1a3a", "#2c2a52", "#16142e", "#ffcf6a", T.flags), k: 0.1, y: 46, flags: true });
      T.layers.push({ c: townStrip(512, 96, { wall: ["#2a2448", "#322a52", "#261f40"], roof: ["#4a2a3a", "#5a3040", "#3e2232"], roofEdge: "#6a3a48", edge: "#3a3260", dark: "#140f24", win: "#1a1430", lit: "#ffcf6a" }, T.wins), k: 0.28, y: 92, wins: true });
      T.layers.push({ c: chimneyStrip(512, 74, "#0e0b1c", "#1e1838", "#ffcf6a"), k: 0.55, y: 112 });
      return T;
    }
  };
  // volte a crociera e archi in fuga (cripta), colonne con catene e candele
  function vaultStrip(w, h, body, edge, deep) {
    const c = cnv(w, h), g = c.getContext("2d"); R(g, 0, 0, w, h, deep);
    for (let x = 0; x < w; x += 64) {
      R(g, x, 0, 12, h, body); R(g, x, 0, 2, h, edge);
      for (let k = 0; k < 52; k++) { const a = Math.PI * k / 51, px = x + 38 + Math.cos(a) * 26, py = 34 - Math.sin(a) * 26; R(g, px - 2, py, 5, 4, k % 6 === 0 ? edge : body); }
      R(g, x + 12, 34, 52, 3, body); for (let y = 44; y < h; y += 9) for (let bx = x + 14 + ((y / 9) % 2) * 6; bx < x + 62; bx += 12) R(g, bx, y, 10, 7, rnd(bx * 3 + y) > 0.5 ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.12)");
      if (rnd(x) > 0.4) { R(g, x + 34, 52, 8, 10, "#16121e"); R(g, x + 35, 53, 6, 8, "#3a2a1a"); R(g, x + 37, 55, 2, 3, "#ffcf6a"); }
    }
    return c;
  }
  function pillarStrip(w, h, body, edge, dark) {
    const c = cnv(w, h), g = c.getContext("2d");
    for (let x = 10; x < w; x += 92) {
      R(g, x, 0, 22, h, body); R(g, x, 0, 3, h, edge); R(g, x + 19, 0, 3, h, dark); R(g, x - 3, h - 14, 28, 14, body); R(g, x - 3, h - 14, 28, 2, edge); R(g, x - 3, 10, 28, 6, body);
      for (let y = 18; y < h - 14; y += 10) R(g, x + 3, y, 16, 1, dark);
      const cx = x + 56; for (let y = 0; y < 34 + (x % 3) * 8; y += 3) { R(g, cx, y, 2, 2, dark); R(g, cx + 1, y + 1, 1, 1, edge); }
      R(g, x + 8, h - 22, 3, 8, "#e8e0c8"); R(g, x + 9, h - 25, 1, 3, "#ffd25a");
    }
    return c;
  }
  THEMES.cripta = {
    name: "La cripta delle campane", fall: "Giù nel pozzo! Si riparte dal gonfalone.",
    brick: { base: "#5a5a6e", light: "#7a7a90", dark: "#3a3a4c", mortar: "#1c1c28", crack: "#2a2a38" },
    grass: { a: "#3a5a3e", b: "#5a7a4e", c: "#24382a" }, wood: { a: "#5a4030", b: "#7a5a40", c: "#2a1c14" }, fx: "polvere", dark: 0, lit: 0.9,
    build() {
      const T = { flags: [], wins: [], layers: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#0c0a14", "#121020", "#18162a", "#1e1c32", "#24223a", "#2a2840"]);
      T.sky = sky;
      T.layers.push({ c: vaultStrip(512, 180, "#2a2838", "#3a3850", "#141220"), k: 0.12, y: 0 });
      T.layers.push({ c: pillarStrip(552, 170, "#33314a", "#4a4866", "#1e1c2c"), k: 0.4, y: 14 });
      return T;
    }
  };
  // la torre nella tempesta: muro di pietroni con feritoie (si illuminano coi lampi), cielo verde-nero, castello lontano
  function towerWall(w, h) {
    const c = cnv(w, h), g = c.getContext("2d"); R(g, 0, 0, w, h, "#1a1e26");
    for (let y = 0; y < h; y += 12) for (let x = (y / 12) % 2 ? -12 : 0; x < w; x += 24) { const v = rnd(x * 3 + y); R(g, x + 1, y + 1, 22, 10, v > 0.6 ? "#2a303a" : v > 0.3 ? "#252a34" : "#20242e"); R(g, x + 1, y + 1, 22, 1, "#343a46"); R(g, x + 1, y + 10, 22, 1, "#14161c"); }
    for (let i = 0; i < 3; i++) { const x = 14 + i * 32, y = 18 + (i % 2) * 40; R(g, x, y, 6, 18, "#08090c"); R(g, x + 2, y + 2, 2, 14, "#101420"); }
    return c;
  }
  THEMES.torre = {
    name: "La torre nella tempesta", fall: "Giù dalla torre! Si riparte dal gonfalone.",
    brick: { base: "#4a505e", light: "#6a7284", dark: "#2e323c", mortar: "#16181e", crack: "#22262e" },
    grass: null, wood: { a: "#4a3a2a", b: "#6a5440", c: "#221810" }, fx: "pioggia", dark: 0, wind: true, storm: true,
    build() {
      const T = { flags: [], wins: [], layers: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#0a0f12", "#10181c", "#162226", "#1c2a2c", "#223230", "#283a34"]);
      T.sky = sky;
      T.layers.push({ c: cloudStrip(31, 512, 110, "#1e2a2e", "#34464a", "#121a1e", 6, 10, 70), k: 0.05, y: 0, drift: 0.6, alpha: 0.9 });
      T.layers.push({ c: castleStrip(512, 150, "#0e1416", "#1a2428", "#0a0f10", "#d8c060", T.flags), k: 0.08, y: 40, flags: true });
      T.back = { c: towerWall(96, 96), k: 0.55 };
      return T;
    }
  };
  // la montagna d'inverno (Il Guardiano di Neve): cime lontane, abeti carichi di neve, fiocchi che cadono
  function peakStrip(w, h, body, lit, snow, seed) {
    const c = cnv(w, h), g = c.getContext("2d"); let x = 0, i = 0;
    while (x < w + 40) {
      const pw = 70 + Math.round(rnd(seed + i * 3) * 80), ph = h * (0.45 + rnd(seed + i * 3 + 1) * 0.5), px = x + pw / 2;
      for (let k = 0; k < pw; k++) { const d = Math.abs(k - pw / 2) / (pw / 2), top = h - ph * (1 - d) - Math.round(rnd(seed + k + i * 9) * 2); R(g, x + k - pw / 2 + 30, top, 1, h - top, k < pw / 2 ? lit : body); if (1 - d > 0.62) R(g, x + k - pw / 2 + 30, top, 1, Math.round((1 - d - 0.62) * 34) + 1, snow); }
      for (const dx of [-w, w]) { if (px + dx > -pw && px + dx < w + pw) { /* cucitura per la ripetizione */ } }
      x += pw * 0.7; i++;
    }
    return c;
  }
  function pineStrip(w, h, dark, mid, snow, n, seed) {
    const c = cnv(w, h), g = c.getContext("2d"); R(g, 0, h - 10, w, 10, snow);
    for (let i = 0; i < n; i++) {
      const tx = Math.round(rnd(seed + i) * w), th = 26 + Math.round(rnd(seed + i + 50) * 34);
      for (const dx of [-w, 0, w]) { const X = tx + dx; R(g, X - 1, h - 12, 3, 8, "#3a2a20"); for (let k = 0; k < th; k++) { const hw = Math.round((k / th) * (th / 3.2)) + 1, Y = h - 12 - th + k; R(g, X - hw, Y, hw * 2 + 1, 1, k % 7 < 2 ? snow : k % 7 < 4 ? mid : dark); } }
    }
    return c;
  }
  THEMES.neve = {
    name: "La montagna d'inverno", fall: "Giù nel crepaccio! Si riparte dall'ometto di pietre.", snow: true,
    brick: { base: "#6a7c94", light: "#8ea2bc", dark: "#4a5a72", mortar: "#34405a", crack: "#3e4a64" },
    grass: { a: "#e8f0fa", b: "#ffffff", c: "#b8c8de" }, wood: { a: "#7a5a3a", b: "#9a7a52", c: "#3e2a18" }, fx: "neve", dark: 0,
    build() {
      const T = { flags: [], wins: [], layers: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#4a6a9a", "#5a7aaa", "#6e8eba", "#86a4c8", "#a0bcd8", "#bcd2e6", "#d6e4f0", "#eaf2f8"]);
      disc(g, 80, 46, 16, "#fff6dc"); disc(g, 80, 46, 12, "#fffbea"); for (let i = 0; i < 3; i++) R(g, 54, 60 + i * 5, 52, 1, "rgba(255,246,220,.5)");
      T.sky = sky;
      T.layers.push({ c: cloudStrip(41, 512, 90, "#dce8f4", "#ffffff", "#a8bcd4", 6, 10, 56), k: 0.03, y: 0, drift: 0.05, alpha: 0.9 });
      T.layers.push({ c: peakStrip(512, 120, "#7a8cae", "#9aaccc", "#f4f8fc", 3), k: 0.08, y: 40 });
      T.layers.push({ c: peakStrip(512, 90, "#56688a", "#6e82a6", "#e6eef8", 17), k: 0.18, y: 78 });
      T.layers.push({ c: pineStrip(512, 80, "#1e3a32", "#2e5246", "#f0f6fc", 16, 5), k: 0.34, y: 104 });
      T.layers.push({ c: pineStrip(512, 64, "#142a24", "#1e3a32", "#dce8f4", 9, 77), k: 0.6, y: 126 });
      return T;
    }
  };

  // Il Guardiano di Neve, capitoli 2-4: canalone (pareti di roccia), ghiacciaio di notte (seracchi e aurora), vetta al tramonto (mare di nuvole)
  function rockStrip(w, h, dark, mid, lit, snow, seed) {
    const c = cnv(w, h), g = c.getContext("2d"); let x = 0, i = 0;
    while (x < w) {
      const cw = 18 + Math.round(rnd(seed + i) * 30), top = Math.round(h * (0.15 + rnd(seed + i * 7) * 0.55));
      for (let k = 0; k < cw; k++) { const t = top + Math.round(Math.abs(Math.sin((k + i * 5) / 3.3)) * 4 + rnd(seed + k + i * 11) * 3); R(g, x + k, t, 1, h - t, k < cw * 0.35 ? lit : k < cw * 0.8 ? mid : dark); if (k % 7 === 3) R(g, x + k, t + 6, 1, Math.round((h - t) * 0.5 * rnd(seed + k * 3 + i)), dark); if (rnd(seed + k + i * 13) > 0.55) R(g, x + k, t, 1, 2 + Math.round(rnd(seed + k * 5 + i) * 3), snow); }
      for (let y = top + 14; y < h - 6; y += 13 + Math.round(rnd(seed + y + i) * 8)) R(g, x + 2, y, cw - 4, 2, snow);
      x += cw; i++;
    }
    return c;
  }
  function seracStrip(w, h, deep, ice, lit, seed, n) {
    const c = cnv(w, h), g = c.getContext("2d"); R(g, 0, h - 8, w, 8, lit);
    for (let i = 0; i < n; i++) {
      const sx = Math.round(rnd(seed + i) * w), sw = 10 + Math.round(rnd(seed + i + 40) * 16), sh = 20 + Math.round(rnd(seed + i + 80) * (h - 30)), sk = Math.round((rnd(seed + i + 120) - 0.5) * 8);
      for (const dx of [-w, 0, w]) for (let k = 0; k < sh; k++) { const hw = Math.max(1, Math.round(sw / 2 * Math.min(1, (k + 4) / (sh * 0.35)))), X = sx + dx + Math.round(sk * (1 - k / sh)), Y = h - 8 - sh + k; R(g, X - hw, Y, hw, 1, lit); R(g, X, Y, hw, 1, k % 9 < 2 ? deep : ice); if (k === 0) R(g, X - 1, Y - 1, 2, 2, "#ffffff"); }
    }
    return c;
  }
  function auroraStrip(w, h, seed) {
    const c = cnv(w, h), g = c.getContext("2d");
    for (let x = 0; x < w; x++) { const y0 = Math.round(h * 0.35 + Math.sin(x / 37 + seed) * 12 + Math.sin(x / 13) * 4), len = 18 + Math.round(Math.abs(Math.sin(x / 21 + seed * 2)) * 30); for (let k = 0; k < len; k++) { const a = (1 - k / len) * (0.22 + 0.18 * Math.abs(Math.sin(x / 9))); R(g, x, y0 + k, 1, 1, k < 3 ? `rgba(180,255,220,${a + 0.15})` : x % 3 ? `rgba(80,230,170,${a})` : `rgba(120,160,255,${a * 0.8})`); } }
    return c;
  }
  function cloudSea(w, h, body, lit, shade, seed) {
    const c = cnv(w, h), g = c.getContext("2d"); R(g, 0, 14, w, h - 14, body);
    for (let i = 0; i < 26; i++) { const x = Math.round(rnd(seed + i) * w), r = 6 + Math.round(rnd(seed + i + 9) * 12); for (const dx of [-w, 0, w]) { disc(g, x + dx, 16, r, body); disc(g, x + dx - 2, 14, r - 3, lit); } }
    for (let y = 22; y < h; y += 6) R(g, 0, y, w, 1, shade);
    return c;
  }
  THEMES.canalone = {
    name: "Il canalone delle valanghe", fall: "Giù nel canalone! Si riparte dall'ometto di pietre.", snow: true,
    brick: { base: "#6e6a72", light: "#8e8a92", dark: "#4a464e", mortar: "#2e2a34", crack: "#3a3640" },
    grass: { a: "#e8f0fa", b: "#ffffff", c: "#b8c8de" }, wood: { a: "#6a4a32", b: "#8a6a48", c: "#3a2a18" }, fx: "neve", dark: 0.04,
    build() {
      const T = { flags: [], wins: [], layers: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#3a4256", "#465066", "#525e76", "#606c84", "#707c92", "#8490a4", "#9aa4b6", "#b0b8c8"]);
      disc(g, 250, 40, 13, "#e8e0d0"); disc(g, 250, 40, 10, "#f4ecdc"); T.sky = sky;
      T.layers.push({ c: cloudStrip(57, 512, 100, "#8a94a8", "#b4bccb", "#6a7488", 7, 4, 50), k: 0.04, y: 0, drift: 0.1, alpha: 0.9 });
      T.layers.push({ c: peakStrip(512, 120, "#5a6276", "#727a90", "#e6eaf2", 29), k: 0.08, y: 34 });
      T.layers.push({ c: rockStrip(512, 140, "#3a3640", "#524c58", "#6a6470", "#f0f4fa", 7), k: 0.2, y: 50 });
      T.layers.push({ c: rockStrip(512, 110, "#2a262e", "#3e3844", "#544c58", "#e8eef6", 31), k: 0.45, y: 96 });
      return T;
    }
  };
  THEMES.ghiacciaio = {
    name: "Il ghiacciaio di notte", fall: "Giù nel crepaccio! Si riparte dall'ometto di pietre.", snow: true,
    brick: { base: "#5a86b0", light: "#8ab8de", dark: "#3a6088", mortar: "#22405e", crack: "#2a4a6c" },
    grass: { a: "#d8ecff", b: "#ffffff", c: "#9cc4e6" }, wood: { a: "#5a4a3a", b: "#7a6a52", c: "#2e2418" }, fx: "neve", dark: 0.04, night: true,
    build() {
      const T = { flags: [], wins: [], layers: [], stars: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#060a1e", "#0a1028", "#0e1834", "#122040", "#16304e", "#1a3e5a", "#1e4a64"]);
      disc(g, 262, 30, 9, "#d8e4f0"); disc(g, 259, 28, 9, "#0a1028");
      for (let i = 0; i < 80; i++) T.stars.push([Math.round(rnd(i + 15) * VW), Math.round(rnd(i + 190) * 100), i]);
      T.sky = sky;
      T.layers.push({ c: auroraStrip(512, 110, 3), k: 0.02, y: 0, drift: 0.12, alpha: 0.95 });
      T.layers.push({ c: peakStrip(512, 110, "#1a2a44", "#243a58", "#9ab8d8", 41), k: 0.07, y: 56 });
      T.layers.push({ c: seracStrip(512, 120, "#2a5a86", "#6aa4d4", "#bfe0fa", 9, 18), k: 0.22, y: 70 });
      T.layers.push({ c: seracStrip(512, 90, "#1e4a72", "#4a88bc", "#a8d4f6", 23, 9), k: 0.5, y: 112 });
      return T;
    }
  };
  THEMES.vetta = {
    name: "La vetta al tramonto", fall: "Giù dalla cresta! Si riparte dall'ometto di pietre.", snow: true,
    brick: { base: "#7a6e6a", light: "#a09490", dark: "#54484a", mortar: "#342a2e", crack: "#463a3c" },
    grass: { a: "#fff0e4", b: "#ffffff", c: "#e8c8c0" }, wood: { a: "#6a4a32", b: "#8a6a48", c: "#3a2a18" }, fx: "neve", dark: 0,
    build() {
      const T = { flags: [], wins: [], layers: [] };
      const sky = cnv(VW, VH), g = sky.getContext("2d");
      skyBands(g, VW, 0, VH, ["#2a1e4a", "#46285a", "#6a3266", "#9a4068", "#c85a62", "#e8805a", "#f4a868", "#fcd08a"]);
      disc(g, 90, 128, 22, "#ffd88a"); disc(g, 90, 128, 17, "#ffecb0"); for (let i = 0; i < 5; i++) R(g, 40, 112 + i * 6, 100, 1, "rgba(255,230,170,.45)"); T.sky = sky;
      T.layers.push({ c: cloudStrip(83, 512, 80, "#e8a0a0", "#ffd8c0", "#b06a7a", 5, 4, 40), k: 0.03, y: 0, drift: 0.04, alpha: 0.8 });
      T.layers.push({ c: peakStrip(512, 70, "#6a4a66", "#8a5e78", "#ffe0d8", 61), k: 0.06, y: 100 });
      T.layers.push({ c: cloudSea(512, 60, "#f6d4cc", "#fff0e8", "rgba(200,140,150,.35)", 7), k: 0.12, y: 136 });
      T.layers.push({ c: rockStrip(512, 90, "#3e2e3a", "#5a4250", "#7a5a66", "#fff4ee", 13), k: 0.4, y: 112 });
      return T;
    }
  };
  // ------------------------------------------------------------ tessere (atlante per tema)
  function atlas(th) {
    const A = {}, B = th.brick, G = th.grass, Wd = th.wood;
    const brick = (v) => {
      const c = cnv(16, 16), g = c.getContext("2d"); R(g, 0, 0, 16, 16, B.mortar);
      for (let row = 0; row < 3; row++) {
        const y = row * 5 + 1 - (row === 2 ? 0 : 0), off = (row + v) % 2 ? -8 : 0;
        for (let bx = off; bx < 16; bx += 16) {
          const x0 = Math.max(0, bx + 1), x1 = Math.min(16, bx + 15), hh = row === 2 ? 5 : 4; if (x1 <= x0) continue;
          R(g, x0, y, x1 - x0, hh, B.base); R(g, x0, y, x1 - x0, 1, B.light); R(g, x0, y, 1, hh, B.light); R(g, x0, y + hh - 1, x1 - x0, 1, B.dark);
          if (rnd(v * 17 + row * 5 + bx) > 0.55) { const cx = x0 + 3 + Math.round(rnd(v + row + bx) * 6); R(g, cx, y + 1, 1, 2, B.crack); R(g, cx + 1, y + 2, 2, 1, B.crack); }
        }
        if (off) { R(g, 1, y, 6, row === 2 ? 5 : 4, B.base); R(g, 1, y, 6, 1, B.light); R(g, 9, y, 6, row === 2 ? 5 : 4, B.base); R(g, 9, y, 6, 1, B.light); R(g, 1, y + (row === 2 ? 4 : 3), 14, 1, B.dark); R(g, 8, y, 1, 5, B.mortar); }
      }
      return c;
    };
    A.brick = [0, 1, 2, 3].map(brick);
    // erba sul bordo alto: tessera 16x20, 4 pixel sporgono sopra
    A.top = [0, 1, 2, 3].map((v) => {
      const c = cnv(16, 22), g = c.getContext("2d"); g.drawImage(A.brick[v], 0, 4); if (!G) return c;
      R(g, 0, 4, 16, 4, G.a); R(g, 0, 4, 16, 1, G.b);
      for (let x = 0; x < 16; x++) { const d = Math.round(rnd(v * 31 + x) * 3); if (d) R(g, x, 8, 1, d, x % 3 ? G.a : G.c); const up = Math.round(rnd(v * 13 + x * 2) * 4); if (up > 1) R(g, x, 4 - up + 1, 1, up, x % 2 ? G.b : G.a); }
      if (v === 2 && !th.snow) { R(g, 5, 1, 1, 1, "#ffd0e0"); R(g, 4, 2, 3, 1, "#ff9fc0"); R(g, 11, 2, 1, 1, "#fff2a0"); }
      return c;
    });
    if (th.roof) A.top = [0, 1, 2, 3].map((v) => {
      const c = cnv(16, 22), g = c.getContext("2d"), Rf = th.roof; g.drawImage(A.brick[v], 0, 4);
      R(g, 0, 4, 16, 6, Rf.c); for (let i = 0; i < 4; i++) { ell(g, 2 + i * 4, 6, 2, 3, i % 2 ? Rf.a : Rf.b); R(g, 1 + i * 4, 3 + (i % 2), 2, 1, "#f0a080"); }
      R(g, 0, 10, 16, 1, "rgba(0,0,0,.35)"); if (v === 3) { R(g, 6, 0, 3, 4, "#3a2a4a"); R(g, 5, 0, 5, 1, "#5a4a6a"); }
      return c;
    });
    A.chim = (() => { const c = cnv(16, 16), g = c.getContext("2d"); R(g, 2, 0, 12, 16, B.dark); R(g, 3, 1, 10, 15, B.base); for (let y = 3; y < 16; y += 4) R(g, 3, y, 10, 1, B.mortar); R(g, 1, 0, 14, 3, B.light); R(g, 5, 0, 6, 2, "#16141f"); return c; })();
    A.gate = (() => { const c = cnv(16, 16), g = c.getContext("2d"); R(g, 0, 0, 16, 16, "rgba(10,8,16,.55)"); for (let x = 1; x < 16; x += 5) { R(g, x, 0, 2, 16, "#4a4a5a"); R(g, x, 0, 1, 16, "#8a8aa0"); } R(g, 0, 5, 16, 2, "#4a4a5a"); R(g, 0, 11, 16, 2, "#4a4a5a"); R(g, 0, 5, 16, 1, "#8a8aa0"); for (let x = 1; x < 16; x += 5) R(g, x, 14, 2, 2, "#6a6a80"); return c; })();
    A.plank = (() => { const c = cnv(16, 16), g = c.getContext("2d"); R(g, 0, 0, 16, 5, Wd.c); R(g, 0, 0, 16, 4, Wd.a); R(g, 0, 0, 16, 1, Wd.b); R(g, 3, 1, 1, 2, Wd.c); R(g, 11, 2, 1, 1, Wd.c); R(g, 2, 5, 2, 4, Wd.c); R(g, 12, 5, 2, 4, Wd.c); R(g, 2, 8, 12, 1, "rgba(0,0,0,.25)"); return c; })();
    A.ice = (() => { const c = cnv(16, 16), g = c.getContext("2d"); R(g, 0, 0, 16, 16, "#7ab8e0"); R(g, 0, 0, 16, 3, "#e8f6ff"); R(g, 0, 3, 16, 1, "#b8e0f8"); R(g, 0, 14, 16, 2, "#4a88b8"); R(g, 3, 5, 1, 5, "#d8f0ff"); R(g, 4, 6, 1, 2, "#d8f0ff"); R(g, 11, 7, 3, 1, "#a8d8f4"); R(g, 9, 10, 1, 3, "#5a98c8"); return c; })();
    A.crack = (() => { const c = cnv(16, 16), g = c.getContext("2d"); g.drawImage(A.brick[1], 0, 0); g.fillStyle = "#3a1c10"; [[7, 0], [7, 1], [8, 2], [8, 3], [7, 4], [6, 5], [6, 6], [7, 7], [9, 8], [10, 9], [10, 10], [9, 11], [8, 12], [8, 13], [5, 9], [4, 10], [3, 10], [11, 4], [12, 4], [13, 5]].forEach(([x, y]) => g.fillRect(x, y, 1, 1)); R(g, 0, 0, 16, 16, "rgba(255,240,200,.08)"); return c; })();
    A.spike = (() => { const c = cnv(16, 16), g = c.getContext("2d"); for (let i = 0; i < 4; i++) { for (let k = 0; k < 7; k++) R(g, i * 4 + (k >> 1) * 0 + Math.floor(k / 2) * 0 + (k < 4 ? 2 - Math.floor(k / 2) : 0), 9 + k, k < 2 ? 1 : k < 4 ? 2 : 4, 1, k < 3 ? "#e8e8f0" : "#9aa0b4"); R(g, i * 4 + 1, 9, 1, 2, "#ffffff"); } R(g, 0, 15, 16, 1, "#4a4a5a"); return c; })();
    return A;
  }
  // ------------------------------------------------------------ eroe «ferro» (armatura di latta) disegnato a rettangoli con contorno
  function part(g, x, y, w, h, c, o) { R(g, x - 1, y - 1, w + 2, h + 2, o); R(g, x, y, w, h, c); }
  function drawFerro(g, x, y, s, st, f, look) {
    // x,y = centro dei piedi; s = direzione; st = { walk, air, hp, ball, hurt, frozen, kick, squash }
    const O = "#16141f", A = "#a6afc2", Ad = "#626b80", Al = "#e2e8f2", Pl = "#d23a3a", Pd = "#8e1f2a";
    const ph = st.walk ? Math.sin(f / 4) : 0, lift = Math.round(Math.abs(ph) * 1.6), air = st.air, sq = st.squash || 0;
    g.save(); g.translate(Math.round(x), Math.round(y)); if (s < 0) g.scale(-1, 1); if (sq) g.scale(1 + sq * 0.15, 1 - sq * 0.15);
    // gambe e scarpe di ferro
    const l1 = air ? -2 : Math.round(ph * 2), l2 = air ? 1 : -Math.round(ph * 2);
    part(g, -4 + l1, -6 - (ph > 0 ? lift : 0), 3, 5, Ad, O); part(g, -5 + l1, -2 - (ph > 0 ? lift : 0), 5, 2, A, O);
    part(g, 1 + l2, -6 - (ph < 0 ? lift : 0), 3, 5, A, O); part(g, 1 + l2, -2 - (ph < 0 ? lift : 0), 5, 2, Al, O);
    // braccio dietro
    if (st.hp >= 2) part(g, -6, -14 + Math.round(ph), 3, 6, Ad, O);
    // corazza
    part(g, -5, -15, 10, 9, A, O); R(g, -5, -15, 10, 2, Al); R(g, -5, -15, 2, 8, Al); R(g, 3, -14, 2, 8, Ad); R(g, -5, -8, 10, 2, "#6b4426"); R(g, 0, -8, 2, 2, "#e0b040");
    // il pallone di latta nel petto (o l'incavo vuoto)
    if (st.ball) { disc(g, 1, -12, 2, "#c88a2a"); R(g, 0, -13, 2, 1, "#ffe8a0"); R(g, -1, -12, 1, 1, "#ffd060"); }
    else { disc(g, 1, -12, 2, "#2a2230"); R(g, 0, -12, 2, 1, `rgba(255,160,60,${0.4 + 0.3 * Math.sin(f / 6)})`); }
    // braccio davanti (calcio: braccio avanti)
    const ka = st.kick > 0 ? 3 : 0; part(g, 3 + ka, -14 + Math.round(-ph), 3, 6, A, O); R(g, 3 + ka, -9 + Math.round(-ph), 3, 1, Al);
    // elmo (con 1 solo pezzo resta senza elmo: si vede la faccia del Campione)
    if (st.hp >= 2) {
      part(g, -4, -22, 9, 7, A, O); R(g, -4, -22, 9, 1, Al); R(g, -4, -22, 1, 6, Al); R(g, -1, -19, 6, 2, "#0b0b12");
      R(g, 3, -19, 1, 1, st.frozen ? "#9ad8ff" : "#ffd25a"); if (st.hurt) R(g, 1, -19, 1, 1, "#ff7070");
      // pennacchio
      if (st.hp >= 3) { const w = Math.round(Math.sin(f / 7) * 1.5 + (air ? -1 : 0)); R(g, -2 + w, -26, 3, 4, O); R(g, -1 + w, -25, 2, 3, Pl); R(g, -4 + w, -24, 3, 2, O); R(g, -3 + w, -24, 2, 1, Pd); R(g, -5 + w * 2, -23, 2, 2, Pl); }
    } else {
      const sk = (look && look.skin) || "#e0ac7e", hr = (look && look.hair) || "#2b1d14";
      part(g, -3, -21, 7, 6, sk, O); R(g, -3, -21, 7, 2, hr); R(g, -3, -21, 1, 4, hr); R(g, 2, -18, 1, 1, "#16141f"); R(g, 1, -16, 2, 1, "#8a3a2a");
    }
    g.restore();
  }
  // ------------------------------------------------------------ nemici
  const FOES = {
    e: { n: "Elmo rotolante", hp: 1, w: 12, h: 11, sp: 0.55, stomp: true },
    c: { n: "Corvo arbitro", hp: 1, w: 14, h: 10, sp: 0.6, fly: true, stomp: true },
    t: { n: "Tamburino di pietra", hp: 2, w: 12, h: 16, sp: 0, stomp: true },
    s: { n: "Scudiero", hp: 2, w: 12, h: 18, sp: 0.4, stomp: true, shield: true },
    g: { n: "Gatto dei tetti", hp: 1, w: 14, h: 10, sp: 0.5, stomp: true },
    m: { n: "Monaco fantasma", hp: 1, w: 12, h: 14, sp: 0.45, fly: true, stomp: false },
    y: { n: "Yeti raccattapalle", hp: 2, w: 14, h: 18, sp: 0.35, stomp: true },
    a: { n: "Aquila talent-scout", hp: 1, w: 16, h: 10, sp: 0.5, fly: true, stomp: true },
    r: { n: "Palla di valanga", hp: 1, w: 10, h: 10, sp: 1.3, stomp: false },
    n: { n: "Pupazzo sentinella", hp: 1, w: 14, h: 22, sp: 0, stomp: true }
  };
  function drawFoe(g, e, f) {
    const O = "#16141f", x = Math.round(e.x), y = Math.round(e.y + e.h), d = e.dir;
    g.save(); g.translate(x, y); if (d < 0) g.scale(-1, 1);
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.5;
    if (e.t === "e") { // elmo che rotola: calotta, visiera, pennacchio spelacchiato
      const r = e.flip ? Math.PI : (e.x / 6) % (Math.PI * 2), bob = Math.round(Math.abs(Math.sin(e.x / 5)));
      part(g, -6, -11 + bob, 12, 10, "#8a93a8", O); R(g, -6, -11 + bob, 12, 2, "#c8d0de"); R(g, -2, -7 + bob, 8, 2, "#0b0b12"); R(g, 4, -7 + bob, 1, 1, "#ff6a3a");
      R(g, -1, -14 + bob, 2, 3, "#5a3a2a"); R(g, -3 + Math.round(Math.sin(r) * 2), -15 + bob, 3, 2, "#7a6a50"); R(g, -6, -2 + bob, 12, 1, "#4a5266");
    } else if (e.t === "c") { // corvo con la maglia a righe da arbitro e il fischietto
      const fl = Math.sin(f / 4 + e.x) > 0;
      part(g, -6, -9, 11, 7, "#1c1a26", O); for (let i = 0; i < 3; i++) R(g, -4 + i * 3, -8, 1, 5, "#e8e8e8");
      part(g, 3, -12, 5, 5, "#24222e", O); R(g, 6, -11, 1, 1, "#ffdd55"); R(g, 8, -10, 3, 2, "#e0a020"); R(g, 9, -8, 2, 2, "#c0c0c8");
      if (fl) { part(g, -4, -16, 7, 5, "#2c2a38", O); } else { part(g, -5, -4, 8, 3, "#2c2a38", O); }
      R(g, -9, -8, 3, 2, "#1c1a26");
      if (e.wh > 0) { g.globalAlpha = Math.min(1, e.wh / 20); g.strokeStyle = "#fff6b0"; g.lineWidth = 1; g.beginPath(); g.arc(9, -9, 6 + (30 - e.wh) * 1.6, -0.9, 0.9); g.stroke(); g.globalAlpha = 1; }
    } else if (e.t === "t") { // tamburino di pietra: statua con tamburo, occhi che si accendono prima del lancio
      const lit = e.cd < 30;
      part(g, -5, -16, 10, 9, "#8a8478", O); R(g, -5, -16, 10, 2, "#aaa498"); part(g, -4, -22, 8, 6, "#9a9488", O); R(g, -2, -20, 1, 1, lit ? "#ff5a3a" : "#3a3630"); R(g, 2, -20, 1, 1, lit ? "#ff5a3a" : "#3a3630");
      part(g, -6, -9, 12, 7, "#a0522d", O); R(g, -6, -9, 12, 1, "#e8d8b0"); R(g, -6, -3, 12, 1, "#e8d8b0"); for (let i = -5; i < 6; i += 3) R(g, i, -8, 1, 5, "#6a3418");
      R(g, 3 + (lit ? -1 : 1), -14 - (lit ? 2 : 0), 1, 6, "#5a4a3a");
    } else if (e.t === "s") { // scudiero con lo scudo davanti
      const ph = Math.sin(f / 5 + e.x);
      part(g, -4, -6, 3, 6, "#4a4a5a", O); part(g, 1, -6, 3, 6, "#4a4a5a", O);
      part(g, -5, -15, 10, 9, "#3c5a8a", O); R(g, -5, -15, 10, 2, "#5a7ab0"); part(g, -4, -21, 8, 6, "#8a93a8", O); R(g, -1, -18, 5, 1, "#0b0b12");
      R(g, -6, -26, 2, 26, "#6a4a2a"); R(g, -7, -28, 4, 3, "#c8d0de");
      part(g, 4, -16 + Math.round(ph), 4, 12, "#b8323a", O); R(g, 5, -12 + Math.round(ph), 2, 4, "#f0c040");
    } else if (e.t === "g") { // gatto nero con la sciarpa, coda dritta, occhi gialli
      const run = Math.sin(e.x / 3) > 0, crouch = e.cd > 110;
      part(g, -7, -8 + (crouch ? 2 : 0), 12, 6, "#22202e", O); part(g, 3, -12 + (crouch ? 2 : 0), 6, 6, "#22202e", O); R(g, 3, -14 + (crouch ? 2 : 0), 2, 2, "#22202e"); R(g, 7, -14 + (crouch ? 2 : 0), 2, 2, "#22202e");
      R(g, 6, -10 + (crouch ? 2 : 0), 1, 1, "#ffe066"); R(g, 8, -10 + (crouch ? 2 : 0), 1, 1, "#ffe066"); R(g, -1, -8, 4, 2, "#c02a3a");
      R(g, -9, -14 + Math.round(Math.sin(f / 6) * 2), 2, 7, "#22202e"); R(g, -6 + (run ? 1 : 0), -2, 2, 2, "#22202e"); R(g, 2 - (run ? 1 : 0), -2, 2, 2, "#22202e");
    } else if (e.t === "m") { // monaco fantasma: saio bianco trasparente, si copre la faccia se lo guardi
      const bob = Math.round(Math.sin(f / 10 + e.ox) * 2); g.globalAlpha = (e.hitT > 0 && f % 4 < 2 ? 0.3 : 0.78);
      part(g, -6, -14 + bob, 12, 12, "#e8ecf8", "#8a90b0"); for (let i = 0; i < 4; i++) R(g, -6 + i * 3, -2 + bob + (i % 2), 3, 2, "#e8ecf8"); R(g, -6, -14 + bob, 12, 3, "#c8cce0");
      if (e.shy) { R(g, -4, -10 + bob, 8, 3, "#c8cce0"); R(g, -5, -9 + bob, 2, 2, "#e8ecf8"); R(g, 3, -9 + bob, 2, 2, "#e8ecf8"); R(g, 4, -6 + bob, 1, 1, "#ff9ab0"); }
      else { R(g, -3, -10 + bob, 2, 3, "#2a2440"); R(g, 2, -10 + bob, 2, 3, "#2a2440"); R(g, -1, -6 + bob, 3, 2, "#2a2440"); }
      g.globalAlpha = 1;
    } else if (e.t === "y") { // yeti raccattapalle: pelo bianco, sciarpa da tifoso, palla di neve in mano prima del lancio
      const ph = Math.sin(e.x / 4), thr = e.thr > 0;
      part(g, -5, -5, 4, 5, "#c8d4e4", O); part(g, 1, -5, 4, 5, "#c8d4e4", O);
      part(g, -7, -16, 14, 12, "#eef4fa", O); R(g, -7, -16, 14, 2, "#ffffff"); R(g, 3, -14, 3, 9, "#d4dee8");
      part(g, -5, -22, 10, 7, "#eef4fa", O); R(g, -3, -20, 7, 4, "#8aa4c0"); R(g, 0, -19, 1, 1, "#16141f"); R(g, 3, -19, 1, 1, "#16141f"); R(g, 0, -17, 4, 1, "#3a2a4a");
      R(g, -6, -15, 12, 3, "#d23a3a"); R(g, -6, -15, 3, 3, "#f0f0f0"); R(g, 0, -15, 3, 3, "#f0f0f0"); R(g, -8, -13 + Math.round(ph), 3, 6, "#d23a3a");
      if (thr) { part(g, 4, -27, 4, 9, "#eef4fa", O); disc(g, 6, -29, 4, "#ffffff"); } else part(g, 6, -14 + Math.round(ph), 4, 8, "#eef4fa", O);
    } else if (e.t === "a") { // aquila con il taccuino da osservatore, si tuffa sull'eroe
      const fl = Math.sin(f / (e.sw === 1 ? 2 : 5) + e.ox) > 0, dv = e.sw === 1;
      part(g, -7, -8, 13, 6, "#6a4a2a", O); R(g, -7, -8, 13, 1, "#8a6a42"); part(g, 4, -12, 6, 6, "#f0f0f0", O); R(g, 7, -10, 1, 1, "#16141f"); R(g, 10, -9, 3, 2, "#f0b020"); R(g, 11, -7, 2, 1, "#c08010");
      if (dv) { part(g, -6, -14, 10, 4, "#4a321c", O); } else if (fl) { part(g, -6, -18, 11, 8, "#5a3e22", O); R(g, -4, -17, 7, 1, "#7a5a32"); } else part(g, -8, -4, 12, 4, "#5a3e22", O);
      R(g, -11, -7, 4, 3, "#6a4a2a"); R(g, -2, -2, 4, 3, "#f0e0a0"); R(g, -2, -2, 4, 1, "#c0a060");
    } else if (e.t === "r") { // palla di valanga: rotola, cresce, si porta dietro sassi e rametti
      const rr = Math.round(e.h / 2), a = e.x / Math.max(4, rr);
      disc(g, 0, -rr, rr + 1, "#5a7090"); disc(g, 0, -rr, rr, "#f4f8fc"); disc(g, -2, -rr - 2, Math.max(1, rr - 4), "#ffffff");
      for (let k = 0; k < 3; k++) { const b = a + k * 2.1; R(g, Math.round(Math.cos(b) * (rr - 2)) - 1, -rr + Math.round(Math.sin(b) * (rr - 2)) - 1, 2, 2, k === 0 ? "#6a7484" : k === 1 ? "#5a3a20" : "#c8d8ea"); }
      if (e.on) for (let k = 1; k < 4; k++) R(g, -rr - k * 3, -2 - (k % 2) * 2, 2, 2, "rgba(255,255,255,.7)");
    } else if (e.t === "n") { // pupazzo di neve di guardia: carota, bottoni di carbone, sciarpa e braccia di rametto
      const thr = e.thr > 0;
      disc(g, 0, -6, 7, "#5a7090"); disc(g, 0, -6, 6, "#f4f8fc"); disc(g, 0, -16, 5, "#5a7090"); disc(g, 0, -16, 4, "#ffffff");
      R(g, -1, -9, 1, 1, "#16141f"); R(g, -1, -5, 1, 1, "#16141f"); R(g, -2, -18, 1, 1, "#16141f"); R(g, 1, -18, 1, 1, "#16141f"); R(g, 3, -16, 4, 1, "#f97316"); R(g, 3, -15, 2, 1, "#ea580c");
      R(g, -4, -12, 9, 2, "#2f6b3a"); R(g, -5, -11, 2, 4, "#2f6b3a"); R(g, -3, -22, 7, 2, "#3a2a20"); R(g, -2, -25, 5, 3, "#3a2a20");
      if (thr) { R(g, 4, -14, 1, 6, "#5a3a20"); R(g, 5, -20, 1, 6, "#5a3a20"); disc(g, 6, -21, 2, "#ffffff"); } else { R(g, 4, -11, 6, 1, "#5a3a20"); R(g, 8, -13, 1, 2, "#5a3a20"); }
      R(g, -10, -11, 6, 1, "#5a3a20"); R(g, -10, -13, 1, 2, "#5a3a20");
    } else if (e.t === "Z") drawBoss(g, e, f);
    g.restore();
  }
  // capo del livello 1: il Corvo Maggiore (arbitro gigante, fischietto e cartellini)
  function drawBoss(g, e, f) {
    if (e.kind === "gatto") return drawCat(g, e, f);
    if (e.kind === "statua") return drawStatue(g, e, f);
    if (e.kind === "conestabile") return drawConest(g, e, f);
    if (e.kind === "yetone") return drawYetone(g, e, f);
    if (e.kind === "stambecco") return drawStambecco(g, e, f);
    if (e.kind === "regina") return drawRegina(g, e, f);
    const O = "#16141f", fl = Math.sin(f / (e.st === "fly" ? 5 : 12)) > 0, stun = e.st === "stuck";
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.45;
    part(g, -14, -24, 26, 18, "#1c1a26", O); for (let i = 0; i < 5; i++) R(g, -11 + i * 5, -22, 2, 14, "#ececec");
    R(g, -2, -14, 6, 4, "#e8e8e8"); R(g, 0, -13, 2, 2, "#c02020");
    part(g, 8, -32, 12, 11, "#24222e", O); R(g, 15, -29, 2, 2, stun ? "#ffffff" : "#ffdd55"); R(g, 14, -30, 4, 1, "#16141f"); R(g, 19, -27, 7, 3, "#e0a020"); R(g, 19, -24, 5, 2, "#c08010");
    R(g, 22, -22, 4, 3, "#c0c0c8"); R(g, 23, -23, 1, 1, "#ffffff");
    if (fl && !stun) { part(g, -12, -40, 18, 10, "#2c2a38", O); R(g, -10, -38, 14, 2, "#3e3a4e"); } else { part(g, -16, -14, 20, 6, "#2c2a38", O); }
    R(g, -20, -22, 6, 3, "#1c1a26"); R(g, -22, -19, 6, 2, "#1c1a26");
    part(g, -6, -6, 3, 6, "#e0a020", O); part(g, 4, -6, 3, 6, "#e0a020", O);
    if (e.st === "fly" && f % 170 >= 22 && f % 170 < 60 && f % 8 < 5) { R(g, 12, -56, 4, 9, "#16141f"); R(g, 13, -55, 2, 6, "#ffd820"); R(g, 12, -45, 4, 4, "#16141f"); R(g, 13, -44, 2, 2, "#ffd820"); }
    if (stun) for (let i = 0; i < 3; i++) { const a = f / 8 + i * 2.1; R(g, 12 + Math.cos(a) * 9, -38 + Math.sin(a) * 3, 2, 2, "#fff6a0"); }
    if (e.wh > 0) { g.strokeStyle = "#fff6b0"; g.lineWidth = 2; g.globalAlpha = Math.min(1, e.wh / 20); g.beginPath(); g.arc(24, -22, 8 + (40 - e.wh) * 3, -1.2, 1.2); g.stroke(); g.beginPath(); g.arc(-4, -22, 8 + (40 - e.wh) * 3, Math.PI - 1.2, Math.PI + 1.2); g.stroke(); }
    g.globalAlpha = 1;
  }
  // capo del livello dei tetti: Sgrinfia, gattone ladro col batacchio della campana
  function drawCat(g, e, f) {
    g.translate(0, -e.h); // per i capi e.y è la linea dei piedi: drawFoe trasla a e.y + e.h
    const O = "#16141f", dz = e.st === "dizzy", cr = e.st === "crouch", air = e.st === "leap", by = cr ? 4 : 0;
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.45;
    const tl = Math.round(Math.sin(f / 8) * 3); part(g, -22, -30 + tl, 4, 16, "#3a3848", O); part(g, -24, -32 + tl, 4, 4, "#3a3848", O);
    part(g, -18, -22 + by, 30, 16, "#3a3848", O); for (let i = 0; i < 4; i++) R(g, -14 + i * 7, -22 + by, 3, 9, "#2a2836"); R(g, -10, -10 + by, 18, 3, "#4a4858");
    part(g, 8, -34 + by, 16, 14, "#3a3848", O); R(g, 8, -38 + by, 4, 5, "#3a3848"); R(g, 19, -38 + by, 4, 5, "#3a3848"); R(g, 20, -38 + by, 2, 2, "#16141f");
    R(g, 13, -29 + by, 3, 2, dz ? "#ffffff" : "#ffe066"); R(g, 19, -29 + by, 3, 2, dz ? "#ffffff" : "#ffe066"); if (!dz) { R(g, 14, -29 + by, 1, 2, O); R(g, 20, -29 + by, 1, 2, O); }
    R(g, 16, -25 + by, 2, 1, "#e08a9a"); R(g, 12, -23 + by, 9, 1, "#16141f"); R(g, 6, -22 + by, 12, 4, "#c02a3a"); R(g, 4, -20 + by, 4, 7, "#c02a3a");
    const lg = air ? 0 : Math.round(Math.sin(f / 4) * 2); part(g, -14 + lg, -6, 5, 6, "#3a3848", O); part(g, 4 - lg, -6, 5, 6, "#3a3848", O);
    const sw = cr ? -1.2 : dz ? 0.8 : Math.sin(f / 10) * 0.3; g.save(); g.translate(22, -20 + by); g.rotate(sw); part(g, -1, -16, 3, 16, "#6a4a2a", O); disc(g, 0, -18, 5, "#16141f"); disc(g, 0, -18, 4, "#c8963a"); R(g, -2, -21, 2, 2, "#f0d080"); g.restore();
    if (dz) for (let i = 0; i < 3; i++) { const a = f / 8 + i * 2.1; R(g, 14 + Math.cos(a) * 10, -44 + Math.sin(a) * 3, 2, 2, "#fff6a0"); }
    if (cr && f % 8 < 5) { R(g, 14, -54, 4, 9, O); R(g, 15, -53, 2, 6, "#ffd820"); R(g, 14, -43, 4, 4, O); R(g, 15, -42, 2, 2, "#ffd820"); }
    g.globalAlpha = 1;
  }
  function catStep(st, e) {
    const h = st.hero, minX = TS * 5.5, maxX = st.W * TS - TS * 5.5, ground = (st.H - 2) * TS;
    if (!e.max) { e.max = e.hp; e.y = ground; e.st = "run"; e.stT = 120; e.vx = 0; e.vy = 0; }
    e.stT--; e.vul = e.st === "dizzy";
    if (e.st === "run") { e.dir = h.x > e.x ? 1 : -1; e.x = clamp(e.x + e.dir * (1 + (e.hp < e.max / 2 ? 0.5 : 0)), minX, maxX); if (e.stT <= 0) { e.st = "crouch"; e.stT = 34; } }
    else if (e.st === "crouch") { if (e.stT <= 0) { e.st = "leap"; e.vy = -6.6; e.vx = clamp((h.x - e.x) / 44, -3.2, 3.2); snd("jump"); } }
    else if (e.st === "leap") { e.vy += 0.3; e.x = clamp(e.x + e.vx, minX, maxX); e.y += e.vy; e.dir = e.vx >= 0 ? 1 : -1; if (e.y >= ground) { e.y = ground; e.st = "dizzy"; e.stT = 80 + (st.k < 1 ? 30 : 0); st.fx && st.fx.shake(6); snd("brk"); if (e.hp < e.max / 2) [-1, 1].forEach((d) => st.stones.push({ x: e.x, y: ground - 20, vx: d * 1.8, vy: -4.6, l: 140 })); } }
    else if (e.st === "dizzy") { if (e.stT <= 0) { e.st = "run"; e.stT = 110 + Math.round(rnd(st.f) * 70); } }
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && overlap(hb, fb)) {
      if (e.vul && h.vy > 0.5 && h.y - 6 < fb.y + 10) { h.vy = -5.2; if (e.hitT <= 0) { e.hp--; e.hitT = 30; snd("boing"); st.fx && st.fx.burst(e.x, fb.y, 12, ["#fff", "#ffd25a"]); if (e.hp <= 0) foeDie(st, e); } }
      else if (!e.vul || h.vy <= 0.5) hurt(st, Math.sign(e.x - h.x) || 1);
    }
  }
  // capo della cripta: il Custode di Pietra (statua di cavaliere col pallone di marmo; quando è stanco gli si spegne la testa)
  function drawStatue(g, e, f) {
    g.translate(0, -e.h - 44); const O = "#16141f", B = "#8a8aa0", L = "#b0b0c4", Dk = "#5a5a70", up = e.st === "raise" ? -6 : 0, tired = e.st === "tired";
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.45;
    const lg = e.st === "walk" ? Math.round(Math.sin(f / 9) * 2) : 0;
    part(g, -12 + lg, 30, 8, 14, Dk, O); part(g, 4 - lg, 30, 8, 14, B, O); part(g, -14 + lg, 41, 11, 3, B, O); part(g, 3 - lg, 41, 11, 3, L, O);
    part(g, -16, 8, 32, 24, B, O); R(g, -16, 8, 32, 3, L); R(g, -16, 8, 3, 22, L); for (let i = 0; i < 3; i++) R(g, -10 + i * 8, 14 + (i % 2) * 6, 5, 1, Dk); R(g, -16, 28, 32, 3, "#4a3a2a");
    part(g, -24, 8 + up, 8, 18, Dk, O); part(g, 16, 8 + up, 8, 18, B, O);
    part(g, -10, -8, 20, 16, B, O); R(g, -10, -8, 20, 2, L); R(g, -6, -2, 12, 3, O);
    const eye = tired ? "#3a3a4a" : `rgba(120,200,255,${0.7 + 0.3 * Math.sin(f / 6)})`; R(g, -5, -1, 3, 1, eye); R(g, 2, -1, 3, 1, eye);
    if (e.st === "raise") { disc(g, 0, -18, 9, O); disc(g, 0, -18, 8, "#d8d8e6"); R(g, -3, -22, 3, 2, "#ffffff"); }
    if (tired) for (let i = 0; i < 3; i++) { const a = f / 8 + i * 2.1; R(g, Math.cos(a) * 12, -16 + Math.sin(a) * 3, 2, 2, "#fff6a0"); }
    g.globalAlpha = 1;
  }
  function statueStep(st, e) {
    const h = st.hero, minX = TS * 2.5, maxX = st.W * TS - TS * 2.5, ground = (st.H - 2) * TS, hard = e.hp <= e.max / 2;
    if (!e.max) { e.max = e.hp; e.y = ground; e.st = "walk"; e.stT = 150; }
    e.stT--; e.vul = e.st === "tired";
    if (e.st === "walk") { e.dir = h.x > e.x ? 1 : -1; e.x = clamp(e.x + e.dir * (hard ? 0.75 : 0.5), minX, maxX); if (e.stT <= 0) { e.st = "raise"; e.stT = hard ? 26 : 36; snd("whistle"); say(st, "Alza il pallone di marmo: SALTA!", 50); } }
    else if (e.st === "raise") { if (e.stT <= 0) { e.st = "slam"; e.stT = 18; st.fx && st.fx.shake(8); snd("brk"); [-1, 1].forEach((d) => st.waves.push({ x: e.x + d * 20, dir: d, l: 150, sp: hard ? 3.2 : 2.6 })); if (hard) for (let i = 0; i < 3; i++) st.stones.push({ x: clamp(h.x + (i - 1) * 46, 40, st.W * TS - 40), y: 20, vx: 0, vy: 0.5, l: 160 }); } }
    else if (e.st === "slam") { if (e.stT <= 0) { e.waveN = (e.waveN | 0) + 1; if (e.waveN % 2 === 0) { e.st = "tired"; e.stT = 100 + (st.k < 1 ? 30 : 0); say(st, "Il Custode è stanco: colpiscilo!", 60); } else { e.st = "walk"; e.stT = 60; } } }
    else if (e.st === "tired") { if (e.stT <= 0) { e.st = "walk"; e.stT = 130 + Math.round(rnd(st.f) * 60); } }
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && overlap(hb, fb)) {
      if (e.vul && h.vy > 0.5 && h.y - 6 < fb.y + 12) { h.vy = -5.6; if (e.hitT <= 0) { e.hp--; e.hitT = 30; snd("boing"); st.fx && st.fx.burst(e.x, fb.y, 12, ["#fff", "#9ad8ff"]); if (e.hp <= 0) foeDie(st, e); } }
      else if (!e.vul || h.vy <= 0.5) hurt(st, Math.sign(e.x - h.x) || 1);
    }
  }
  // capo finale: il Conestabile (armatura nera vuota, mantello, pennacchio rosso, lancia). Galleggia e lascia cadere decreti, poi carica a terra da un lato all'altro:
  // quando sbatte contro il muro resta stordito. Nella seconda metà chiama i fulmini.
  function drawConest(g, e, f) {
    g.translate(0, -e.h - 42); const O = "#16141f", B = "#2a2836", L = "#4a4860", ch = e.st === "charge", stun = e.st === "stun";
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.45;
    const cw = Math.round(Math.sin(f / 6) * 2); for (let i = 0; i < 6; i++) R(g, -14 - i * (ch ? 2 : 1) + cw * (i % 2), 4 + i * 6, 12, 7, i % 2 ? "#5a0e18" : "#7a1420");
    part(g, -10, 2, 20, 22, B, O); R(g, -10, 2, 20, 2, L); R(g, -10, 2, 2, 20, L); R(g, -3, 8, 6, 8, "#3a3848"); R(g, -10, 20, 20, 3, "#8a6a2a");
    part(g, -8, 24, 7, 16, B, O); part(g, 1, 24, 7, 16, L, O); part(g, -9, 38, 9, 4, L, O); part(g, 1, 38, 9, 4, B, O);
    part(g, -8, -10, 16, 13, B, O); R(g, -8, -10, 16, 2, L); R(g, -5, -5, 12, 2, O); const ey = stun ? "#4a4a5a" : "#ff3a3a"; R(g, -2, -5, 2, 2, ey); R(g, 3, -5, 2, 2, ey);
    const pw = Math.round(Math.sin(f / 5) * 2); R(g, -3 + pw, -18, 5, 8, O); R(g, -2 + pw, -17, 3, 7, "#d23a3a"); R(g, -6 + pw, -15, 4, 4, "#d23a3a");
    if (ch) { R(g, 8, 10, 30, 3, "#8a6a4a"); R(g, 36, 9, 6, 5, "#c8d0de"); } else { R(g, 12, -20, 3, 50, "#8a6a4a"); R(g, 11, -26, 5, 7, "#c8d0de"); }
    if (stun) for (let i = 0; i < 3; i++) { const a = f / 8 + i * 2.1; R(g, Math.cos(a) * 12, -24 + Math.sin(a) * 3, 2, 2, "#fff6a0"); }
    g.globalAlpha = 1;
  }
  function conestStep(st, e) {
    const h = st.hero, minX = TS * 1.5 + e.w / 2, maxX = st.W * TS - TS * 1.5 - e.w / 2, ground = (st.H - 2) * TS, hard = e.hp <= e.max / 2;
    if (!e.max) { e.max = e.hp; e.y = ground - 96; e.st = "float"; e.stT = 160; }
    e.stT--; e.vul = e.st === "stun";
    if (e.st === "float") {
      e.x = clamp(e.x + clamp(h.x - e.x, -1, 1) * 0.9, minX, maxX); e.y = ground - 96 + Math.sin(st.f / 16) * 6; e.dir = h.x > e.x ? 1 : -1;
      if (st.f % (hard ? 50 : 70) === 0) st.cards.push({ x: e.x, y: e.y - 20, vx: 0, vy: 0.7, l: 260, ph: rnd(st.f) * 6 });
      if (hard && st.f % 150 === 40) st.bolts.push({ x: h.x, t: 50 });
      if (e.stT <= 0) { e.st = "aim"; e.stT = 40; e.side = h.x > (minX + maxX) / 2 ? -1 : 1; }
    } else if (e.st === "aim") {
      const tx = e.side < 0 ? minX : maxX; e.x += clamp(tx - e.x, -4, 4); e.y = Math.min(ground, e.y + 3); e.dir = -e.side;
      if (e.stT <= 0 && e.y >= ground && Math.abs(e.x - tx) < 2) { e.st = "charge"; snd("whistle"); say(st, "CARICA! Saltalo!", 50); }
    } else if (e.st === "charge") {
      e.x += e.dir * (hard ? 4.2 : 3.4); if (st.f % 3 === 0) st.debris.push({ x: e.x - e.dir * 14, y: ground - 2, vx: -e.dir, vy: -1, l: 20, c: "#6a6a7a", s: 3 });
      if (e.x <= minX || e.x >= maxX) { e.x = clamp(e.x, minX, maxX); e.st = "stun"; e.stT = 100 + (st.k < 1 ? 30 : 0); st.fx && st.fx.shake(8); snd("brk"); st.flash = 14; say(st, "Ha sbattuto contro il muro: colpiscilo!", 60); }
    } else if (e.st === "stun") { if (e.stT <= 0) { e.st = "rise"; } }
    else if (e.st === "rise") { e.y -= 2; if (e.y <= ground - 96) { e.st = "float"; e.stT = 150 + Math.round(rnd(st.f) * 60); } }
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && overlap(hb, fb)) {
      if (e.vul && h.vy > 0.5 && h.y - 6 < fb.y + 12) { h.vy = -5.6; if (e.hitT <= 0) { e.hp--; e.hitT = 30; snd("boing"); st.fx && st.fx.burst(e.x, fb.y, 12, ["#fff", "#ff6a6a"]); if (e.hp <= 0) foeDie(st, e); } }
      else if (!e.vul || h.vy <= 0.5) hurt(st, Math.sign(e.x - h.x) || 1);
    }
  }
  // capo del Guardiano di Neve, cap.1: il Grande Raccattapalle (yeti enorme che tira palle di neve: si battono RESPINGENDOLE coi guanti, o saltandogli addosso quando si siede stanco)
  function drawYetone(g, e, f) {
    const O = "#16141f", tired = e.st === "tired", thr = e.st === "throw" && e.cd < 12, air = e.st === "jump";
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.5;
    g.translate(0, -2 * e.h);
    const by = tired ? 6 : 0, br = Math.round(Math.sin(f / 10) * 1);
    part(g, -14, 34, 10, 10, "#c8d4e4", O); part(g, 4, 34, 10, 10, "#c8d4e4", O); R(g, -14, 42, 10, 2, "#9aa8bc"); R(g, 4, 42, 10, 2, "#9aa8bc");
    part(g, -18, 10 + by, 36, 28 - by, "#eef4fa", O); R(g, -18, 10 + by, 36, 3, "#ffffff"); R(g, 8, 14 + by, 8, 22 - by, "#d4dee8"); for (let i = 0; i < 6; i++) R(g, -14 + i * 5, 30 + (i % 2), 3, 3, "#d4dee8");
    R(g, -16, 14 + by, 32, 5, "#d23a3a"); for (let i = 0; i < 4; i++) R(g, -16 + i * 8, 14 + by, 4, 5, "#f0f0f0"); R(g, 10, 18 + by, 5, 14 + br, "#d23a3a"); R(g, 10, 30 + by + br, 5, 2, "#f0f0f0");
    part(g, -11, -2 + by, 22, 15, "#eef4fa", O); R(g, -7, 2 + by, 15, 8, "#8aa4c0"); R(g, -4, 4 + by, 2, 2, tired ? "#16141f" : "#16141f"); R(g, 3, 4 + by, 2, 2, "#16141f");
    if (tired) { R(g, -5, 3 + by, 4, 1, "#16141f"); R(g, 2, 3 + by, 4, 1, "#16141f"); R(g, -2, 8 + by, 5, 1, "#3a2a4a"); for (let i = 0; i < 3; i++) R(g, 14 + i * 4, -6 - i * 5 - (f % 30) / 6, 3, 1, "#e8f0ff"); }
    else R(g, -3, 7 + by, 7, 2, "#3a2a4a");
    R(g, -12, -6 + by, 5, 6, "#eef4fa"); R(g, 7, -6 + by, 5, 6, "#eef4fa");
    if (thr || air) { part(g, 14, -10, 7, 20, "#eef4fa", O); disc(g, 17, -14, 7, "#ffffff"); disc(g, 15, -16, 2, "#e0ecf8"); }
    else part(g, 16, 16 + by + br, 7, 18, "#eef4fa", O);
    part(g, -23, 16 + by - br, 7, 18, "#eef4fa", O);
  }
  // palla di neve a campanile: quanti fotogrammi servono (gravità 0.16) per scendere di dy partendo con vy = v0; così arriva all'altezza delle mani
  const lobT = (v0, dy) => Math.max(30, (-v0 - 0.08 + Math.sqrt((v0 + 0.08) * (v0 + 0.08) + 0.32 * Math.max(dy, -30))) / 0.16);
  function yetoneStep(st, e) {
    const h = st.hero, minX = TS * 1.5 + e.w / 2, maxX = st.W * TS - TS * 1.5 - e.w / 2, ground = (st.H - 2) * TS, hard = e.hp <= e.max / 2;
    if (!e.max) { e.max = e.hp; e.y = ground; e.st = "throw"; e.cd = 60; e.n = 0; e.vy = 0; }
    e.vul = e.st === "tired";
    if (e.st === "throw") {
      e.dir = h.x > e.x ? 1 : -1;
      if (--e.cd <= 0) {
        const big = e.n % 3 === 2, dx = h.x - (e.x + e.dir * 14), v0 = big ? -3.4 : -3.6, tt = lobT(v0, h.y - 12 - (e.y - e.h - 10)); st.stones.push({ x: e.x + e.dir * 14, y: e.y - e.h - 10, vx: clamp(dx / tt, -3.4, 3.4), vy: v0, l: 220, snow: 1, big: big ? 1 : 0, boss: 1 });
        e.n++; e.cd = hard ? 28 : 36; snd("kick");
        if (e.n >= (hard ? 6 : 5)) { e.st = "jump"; e.n = 0; e.vy = -6.2; e.vx = clamp((clamp(h.x, TS * 8, st.W * TS - TS * 8) - e.x) / 44, -2.6, 2.6); say(st, "Il Raccattapalle salta! Quando atterra, trema tutto: stacca i piedi da terra!", 80); }
      }
    } else if (e.st === "jump") {
      e.vy = Math.min(7, e.vy + 0.28); e.y += e.vy; e.x = clamp(e.x + e.vx, minX, maxX);
      if (e.y >= ground && e.vy > 0) { e.y = ground; e.st = "tired"; e.stT = 120 + (st.k < 1 ? 30 : 0); st.fx && st.fx.shake(8); snd("brk"); for (let i = 0; i < 10; i++) st.debris.push({ x: e.x + (rnd(i) - 0.5) * 30, y: ground - 2, vx: (rnd(i + 3) - 0.5) * 4, vy: -1.5 - rnd(i + 7) * 2, l: 40, c: "#ffffff", s: 3 }); if (h.ground && h.inv <= 0) { h.frozen = 44; say(st, "BRRRUM! Piedi gelati: fermo un attimo!", 60); } else say(st, "Si è seduto, stanco: saltagli in testa!", 70); }
    } else if (e.st === "tired") { if (--e.stT <= 0) { e.st = "throw"; e.cd = 30; } }
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && overlap(hb, fb)) {
      if (e.vul && h.vy > 0.5 && h.y - 6 < fb.y + 12) { h.vy = -5.6; if (e.hitT <= 0) { e.hp--; e.hitT = 30; snd("boing"); st.fx && st.fx.burst(e.x, fb.y, 12, ["#fff", "#bfe0ff"]); if (e.hp <= 0) foeDie(st, e); else { e.st = "throw"; e.cd = 50; } } }
      else if (h.parry > 0 && Math.sign(e.x - h.x) === h.dir) { h.vx = -h.dir * 3; h.vy = -2.5; }
      else if (!e.vul || h.vy <= 0.5) hurt(st, Math.sign(e.x - h.x) || 1);
    }
  }
  // capo del capitolo 3 (Guardiano di Neve): lo Stambecco Nero. Raspa, poi carica a testa bassa: solo una PARATA lo ferma (resta stordito, saltagli in testa).
  // Se invece sbatte contro la parete, dall'alto cadono blocchi di ghiaccio.
  function drawStambecco(g, e, f) {
    const O = "#16141f", st = e.st, run = st === "charge", stun = st === "stun", paw = st === "paw";
    if (e.hitT > 0 && f % 4 < 2) g.globalAlpha = 0.5;
    g.translate(0, -2 * e.h);
    const lg = run ? Math.round(Math.sin(f / 2) * 3) : paw ? Math.round(Math.sin(f / 3) * 2) : 0;
    part(g, -14 + lg, 20, 4, 10, "#2a2228", O); part(g, -6 - lg, 20, 4, 10, "#2a2228", O); part(g, 6 + lg, 20, 4, 10, "#2a2228", O); part(g, 12 - (paw ? Math.abs(lg) * 2 : lg), 20, 4, 10, "#2a2228", O);
    part(g, -17, 6, 34, 16, "#2e2630", O); R(g, -17, 6, 34, 3, "#4a3e4a"); R(g, -12, 18, 26, 3, "#1c161c"); R(g, -18, 8, 3, 6, "#d8d0c8");
    part(g, 12, -2 + (run ? 6 : 0), 12, 11, "#2e2630", O); R(g, 20, 4 + (run ? 6 : 0), 4, 3, "#1c161c"); R(g, 17, 1 + (run ? 6 : 0), 2, 2, stun ? "#ffffff" : "#f59e0b");
    for (let k = 0; k < 9; k++) R(g, 10 - k * 1.6, -2 - k * 1.5 + (run ? 7 : 0) + (k > 5 ? (k - 5) * 1.2 : 0), 3, 2, k % 2 ? "#c8b48a" : "#a8946a");
    R(g, 22, 10 + (run ? 6 : 0), 2, 4, "#d8d0c8");
    if (stun) for (let k = 0; k < 3; k++) { const a = f / 8 + k * 2.1; R(g, 16 + Math.round(Math.cos(a) * 9), -8 + Math.round(Math.sin(a) * 3), 2, 2, "#fde047"); }
    if (paw) for (let k = 0; k < 3; k++) R(g, 16 + k * 4 - (f % 12), 28 - (f % 9), 2, 2, "#ffffff");
    if (run) for (let k = 1; k < 4; k++) R(g, -18 - k * 5, 24 - k, 3, 2, "rgba(255,255,255,.6)");
  }
  function stambeccoStep(st, e) {
    const h = st.hero, minX = TS * 1.5 + e.w / 2, maxX = st.W * TS - TS * 1.5 - e.w / 2, ground = (st.H - 2) * TS, hard = e.hp <= e.max / 2;
    if (!e.max) { e.max = e.hp; e.y = ground; e.st = "paw"; e.stT = 70; }
    e.vul = e.st === "stun"; e.stT--;
    if (e.st === "paw") { e.dir = h.x > e.x ? 1 : -1; if (e.stT === 40) say(st, "Lo Stambecco raspa: sta per caricare. 🧤 PARA quando arriva!", 60); if (e.stT <= 0) { e.st = "charge"; e.vx = e.dir * (hard ? 4.4 : 3.6); snd("whistle"); } }
    else if (e.st === "charge") {
      e.x += e.vx; e.dir = Math.sign(e.vx);
      if (st.f % 3 === 0) st.debris.push({ x: e.x - e.dir * 16, y: ground - 2, vx: -e.dir * 0.8, vy: -1 - rnd(st.f) * 1.4, l: 22, c: "#ffffff", s: 2 });
      const front = e.x + e.dir * (e.w / 2), facing = Math.sign(e.x - h.x) === h.dir;
      if (st.phase === "play" && h.parry > 0 && facing && Math.abs(front - h.x) < 14 && h.y > ground - 30) { e.st = "stun"; e.stT = 120 + (st.k < 1 ? 30 : 0); e.x -= e.dir * 6; st.parries++; h.vx = -h.dir * 2.4; snd("boing"); st.fx && st.fx.shake(6); st.fx && st.fx.text("PARATA!", h.x - st.cam.x, h.y - st.cam.y - 30, "#fde68a"); say(st, "L'hai fermato a mani nude! Saltagli in testa!", 70); }
      else if (e.x <= minX || e.x >= maxX) { e.x = clamp(e.x, minX, maxX); e.st = "paw"; e.stT = hard ? 55 : 75; st.fx && st.fx.shake(8); snd("brk"); say(st, "BAM! Contro la parete: occhio al ghiaccio che cade!", 60); for (let k = 0; k < (hard ? 4 : 3); k++) st.stones.push({ x: clamp(h.x + (k - 1) * 46 + (rnd(st.f + k) - 0.5) * 30, 24, st.W * TS - 24), y: -10 - k * 30, vx: 0, vy: 0.5, l: 220, snow: 1, ice: 1 }); }
    } else if (e.st === "stun") { if (e.stT <= 0) { e.st = "paw"; e.stT = 60; } }
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && overlap(hb, fb)) {
      if (e.vul && h.vy > 0.5 && h.y - 6 < fb.y + 12) { h.vy = -5.6; if (e.hitT <= 0) { e.hp--; e.hitT = 30; snd("boing"); st.fx && st.fx.burst(e.x, fb.y, 12, ["#fff", "#c8b48a"]); if (e.hp <= 0) foeDie(st, e); else { e.st = "paw"; e.stT = 50; } } }
      else if (!e.vul && e.st === "charge") hurt(st, e.dir);
      else if (!e.vul && h.inv <= 0) { h.vx = Math.sign(h.x - e.x) * 2; }
    }
  }
  // capo finale (Guardiano di Neve): la Regina del Gelo. Dal trono di ghiaccio calcia rigori a tre altezze, annunciati da una freccia:
  // si parano e tornano indietro contro il suo muro di ghiaccio. Ogni tre rigori, la tormenta: lame di ghiaccio corrono a terra (salta).
  function drawRegina(g, e, f) {
    const O = "#16141f", kick = e.st === "aim" && e.stT < 10, hp = e.hp / (e.max || e.hp);
    g.translate(0, -2 * e.h);
    part(g, -16, 40, 32, 24, "#9ad0f0", O); R(g, -16, 40, 32, 3, "#e0f4ff"); for (let k = 0; k < 4; k++) R(g, -14 + k * 8, 44, 2, 18, "#bfe6ff"); R(g, -18, 26, 4, 38, "#bfe6ff"); R(g, 14, 26, 4, 38, "#bfe6ff");
    for (let k = 0; k < 5; k++) R(g, -16 + k * 8, 20 + (k % 2) * 3, 3, 8, "#e0f4ff");
    part(g, -7, 14, 14, 26, "#f4f8fc", O); R(g, -7, 14, 14, 3, "#ffffff"); R(g, -2, 18, 4, 20, "#dce8f4"); R(g, -7, 30, 14, 2, "#2f6b3a");
    part(g, -5, 2, 10, 11, "#e8c4a0", O); R(g, -5, 2, 10, 4, "#d8dee8"); R(g, -6, 3, 2, 10, "#d8dee8"); R(g, 4, 3, 2, 10, "#d8dee8"); R(g, -3, 7, 1, 1, "#1e3a8a"); R(g, 2, 7, 1, 1, "#1e3a8a"); R(g, -1, 10, 3, 1, "#8a4a3a");
    for (let k = 0; k < 5; k++) R(g, -5 + k * 2.4, -4 + (k % 2 ? 2 : 0), 2, 6 - (k % 2 ? 2 : 0), "#bfe6ff");
    if (kick) { part(g, 6, 34, 10, 4, "#f4f8fc", O); R(g, 15, 34, 3, 4, "#5a3a20"); } else part(g, 2, 36, 4, 6, "#f4f8fc", O);
    part(g, -12, 16, 5, 12, "#f4f8fc", O); part(g, 7, 16, 5, 12, "#f4f8fc", O);
    if (e.hitT > 0) for (let k = 0; k < 6; k++) R(g, -20 + rnd(f + k) * 40, 10 + rnd(f * 3 + k) * 50, 2, 2, "#ffffff");
    if (hp < 0.5) { R(g, -16, 52, 10, 1, "#5a86b0"); R(g, 4, 46, 1, 12, "#5a86b0"); }
  }
  const SHOT_H = { basso: 4, mezzo: 13, alto: 26 };
  function reginaStep(st, e) {
    const h = st.hero, ground = (st.H - 2) * TS, hard = e.hp <= e.max / 2;
    if (!e.max) { e.max = e.hp; e.y = ground; e.x = st.W * TS - TS * 3; e.st = "wait"; e.stT = 80; e.n = 0; e.dir = -1; }
    e.vul = 0; e.stT--; e.dir = -1;
    if (e.st === "wait") { if (e.stT <= 0) { e.st = "aim"; const ks = ["basso", "mezzo", "alto"]; e.aim = ks[Math.floor(rnd(st.f + e.n * 7) * 3)]; e.stT = hard ? 34 : 46; say(st, `Rigore ${e.aim === "basso" ? "RASOTERRA ▼" : e.aim === "alto" ? "ALL'INCROCIO ▲" : "CENTRALE ●"}: 🧤 para al momento giusto!`, 50); } }
    else if (e.st === "aim") {
      if (e.stT <= 0) {
        const y = ground - SHOT_H[e.aim], sp = (hard ? 3.9 : 3.2) + e.n * 0.04, curve = hard && e.n % 2 === 1;
        st.stones.push({ x: e.x - 18, y: curve ? y - 12 : y, vx: -sp, vy: curve ? 0.32 : 0, l: 260, snow: 1, boss: 1, flat: 1, rig: 1 }); snd("kick"); e.n++;
        if (e.n % 3 === 0) { e.st = "storm"; e.stT = 140; say(st, "La Regina alza le braccia: TORMENTA! Salta le lame di ghiaccio!", 70); } else { e.st = "wait"; e.stT = hard ? 50 : 70; }
      }
    } else if (e.st === "storm") {
      if (e.stT === 100 || e.stT === 60 || (hard && e.stT === 30)) { st.waves.push({ x: e.x - 24, dir: -1, sp: hard ? 3 : 2.5, l: 220 }); snd("brk"); }
      if (e.stT <= 0) { e.st = "wait"; e.stT = 50; }
    }
  }
  const BOSSES = {
    corvo: { n: "Il Corvo Maggiore", hp: 6, w: 34, h: 34 },
    gatto: { n: "Sgrinfia", hp: 7, w: 38, h: 30 },
    statua: { n: "Il Custode di Pietra", hp: 8, w: 34, h: 52 },
    conestabile: { n: "Il Conestabile", hp: 9, w: 28, h: 52 },
    yetone: { n: "Il Grande Raccattapalle", hp: 8, w: 36, h: 44 },
    stambecco: { n: "Lo Stambecco Nero", hp: 6, w: 34, h: 30 },
    regina: { n: "La Regina del Gelo", hp: 8, w: 30, h: 64 }
  };
  // ------------------------------------------------------------ kit dell'eroe: «pallone» (Ferro, Il Pallone di Latta) · «guanti» (Il Guardiano di Neve: niente pallone, PARATA che respinge e TUFFO-PLANATA)
  const KITS = {
    pallone: { hp: "🛡️", btn: "⚽", aria: "Calcia", lost: ["L'elmo è volato via!", "Un pezzo d'armatura in meno!"], check: "Gonfalone alzato: si riparte da qui.", heal: "Un pezzo d'armatura torna al suo posto!", ban: "Stendardo", tut: "scorri" },
    guanti: { hp: "🧤", btn: "🧤", aria: "Para", lost: ["Hai perso il berretto! Un altro colpo e torni giù.", "Ti è volata via la sciarpa!"], check: "Ometto di pietre: si riparte da qui.", heal: "Una sciarpa di lana: un colpo in più!", ban: "Stella alpina", tut: "scorri_g" }
  };
  const kitOf = (st) => KITS[st.kit] || KITS.pallone;
  // eroe col kit «guanti»: il Campione coi guanti da portiere di Olmo, berretto col pompon e sciarpa (i «pezzi»)
  function drawKeeper(g, x, y, s, st, f, look) {
    const O = "#16141f", J = "#2f6b3a", Jl = "#4a8a52", Jd = "#1e4a28", Gl = "#f59e0b", Gd = "#b45309";
    const ph = st.walk ? Math.sin(f / 4) : 0, lift = Math.round(Math.abs(ph) * 1.6), air = st.air, sq = st.squash || 0, pr = st.parry > 0, gl = st.glide;
    g.save(); g.translate(Math.round(x), Math.round(y)); if (s < 0) g.scale(-1, 1); if (sq) g.scale(1 + sq * 0.15, 1 - sq * 0.15);
    const l1 = air ? -2 : Math.round(ph * 2), l2 = air ? 2 : -Math.round(ph * 2);
    part(g, -4 + l1, -6 - (ph > 0 ? lift : 0), 3, 5, "#3a3a4a", O); part(g, -5 + l1, -2 - (ph > 0 ? lift : 0), 5, 2, "#6a4a2a", O);
    part(g, 1 + l2, -6 - (ph < 0 ? lift : 0), 3, 5, "#4a4a5a", O); part(g, 1 + l2, -2 - (ph < 0 ? lift : 0), 5, 2, "#7a5a32", O);
    if (gl) { part(g, -12, -15, 8, 3, J, O); part(g, -15, -16, 4, 4, Gl, O); } else if (!pr) part(g, -6, -14 + Math.round(ph), 3, 6, Jd, O);
    part(g, -5, -15, 10, 9, J, O); R(g, -5, -15, 10, 2, Jl); R(g, 3, -14, 2, 8, Jd); R(g, -2, -12, 3, 4, "#f0f0f0"); R(g, -1, -11, 1, 2, J);
    if (st.hp >= 3) { const w = Math.round(Math.sin(f / 6) * 1.5); R(g, -5, -16, 10, 2, "#d23a3a"); R(g, -8 + w, -15, 4, 2, "#d23a3a"); R(g, -10 + w * 2, -14, 3, 2, "#f0f0f0"); }
    if (pr) { const k = st.parry > 10 ? 2 : 0; part(g, 4, -16, 6 + k, 3, J, O); part(g, 9 + k, -20, 6, 8, Gl, O); R(g, 9 + k, -20, 6, 2, "#fde68a"); R(g, 13 + k, -17, 1, 4, Gd); part(g, 4, -11, 5 + k, 3, Jd, O); part(g, 8 + k, -12, 5, 6, Gl, O); if (st.parry > 10) { R(g, 17 + k, -22, 1, 3, "#ffffff"); R(g, 18 + k, -15, 2, 1, "#ffffff"); } }
    else if (gl) { part(g, 4, -15, 8, 3, J, O); part(g, 11, -16, 4, 4, Gl, O); }
    else { part(g, 3, -14 + Math.round(-ph), 3, 6, J, O); part(g, 2, -9 + Math.round(-ph), 5, 4, Gl, O); R(g, 2, -9 + Math.round(-ph), 5, 1, "#fde68a"); }
    const sk = (look && look.skin) || "#e0ac7e", hr = (look && look.hair) || "#2b1d14";
    part(g, -3, -21, 7, 6, sk, O); R(g, 2, -18, 1, 1, "#16141f"); R(g, 1, -16, 2, 1, "#8a3a2a"); R(g, 3, -17, 1, 1, "#f0a0a0");
    if (st.hp >= 2) { part(g, -4, -24, 9, 4, "#2a5aa8", O); R(g, -4, -21, 9, 1, "#f0f0f0"); disc(g, -1, -26, 2, "#f0f0f0"); } else { R(g, -3, -21, 7, 2, hr); R(g, -3, -21, 1, 4, hr); }
    if (st.frozen) R(g, -3, -21, 7, 1, "#bfe6ff");
    g.restore();
  }
  // ------------------------------------------------------------ stato del livello
  let S = null, ui = null, raf = 0, tutC = null, keys = {}, LAY = null;
  function diffK() { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; }
  function parse(level) {
    const rows = level.map.slice(), H = rows.length, W = Math.max(...rows.map((r) => r.length)), grid = [], st = { foes: [], coins: [], items: [], signs: [], checks: [], movers: [], vents: [], falls: [], bells: [], torches: [], exit: null, start: [32, 32], ban: 0 };
    let si = 0;
    for (let y = 0; y < H; y++) {
      const row = []; const line = rows[y].padEnd(W, ".");
      for (let x = 0; x < W; x++) {
        const ch = line[x], px = x * TS, py = y * TS; let t = ".";
        if (ch === "#" || ch === "=" || ch === "B" || ch === "^" || ch === "~" || ch === "%") t = ch;
        else if (ch === "u") { t = "u"; st.vents.push({ x: px + 8, y: py }); }
        else if (ch === "G") t = "G";
        else if (ch === "k") st.bells.push({ x: px + 8, y: py + 10, rung: 0, sw: 0 });
        else if (ch === "x") st.torches.push({ x: px + 8, y: py + 8 });
        else if (ch === "f") st.falls.push({ x: px + 8, y0: py + 2, y: py + 2, vy: 0, st: "idle", t: 0 });
        else if (ch === "o") st.coins.push({ x: px + 8, y: py + 8, got: 0 });
        else if (ch === "h") st.items.push({ k: "h", x: px + 8, y: py + 8, got: 0 });
        else if (ch === "S") st.items.push({ k: "S", x: px + 8, y: py + 8, got: 0, i: st.ban++ });
        else if (ch === "C") st.checks.push({ x: px + 8, y: py + 16, on: 0 });
        else if (ch === "E") st.exit = { x: px, y: py + 16 };
        else if (ch === "i") st.signs.push({ x: px + 8, y: py + 16, t: (level.signs || [])[si++] || "" });
        else if (ch === "M") st.movers.push({ x: px, y: py + 4, w: 40, h: 6, x0: px - 40, x1: px + 40, vx: 0.6, dx: 0 });
        else if (ch === "P") st.start = [px + 8, py + 15];
        else if (FOES[ch] || ch === "Z") st.foes.push({ t: ch, x: px + 2, y: py, ox: px });
        row.push(t);
      }
      grid.push(row);
    }
    return Object.assign(st, { grid, W, H });
  }
  function mk(o, level, practice) {
    const P = parse(level), th = THEMES[level.theme] || (level.kit === "guanti" ? THEMES.neve : THEMES.mura), k = diffK(), hpMax = 3 + (k < 1 ? 1 : 0) + clamp(o.bonus | 0, 0, 2);
    const st = {
      o, level, practice, P, grid: P.grid, W: P.W, H: P.H, th, T: th._built || (th._built = th.build()), A: th._atlas || (th._atlas = atlas(th)),
      hero: { x: P.start[0], y: P.start[1], vx: 0, vy: 0, dir: 1, ground: false, coyote: 0, buf: 0, hp: hpMax, max: hpMax, inv: 0, frozen: 0, kick: 0, squash: 0, onM: null },
      ball: { st: "held", x: 0, y: 0, vx: 0, vy: 0, sp: 0, t: 0, squash: 0 },
      foes: P.foes.map((e) => mkFoe(e, level, k)), coins: P.coins, items: P.items, checks: P.checks, signs: P.signs, movers: P.movers, vents: P.vents, falls: P.falls, bells: P.bells, torches: P.torches, waves: [], bolts: [], flash: 0, windV: 0, exit: P.exit,
      kit: level.kit || o.kit || "pallone", parries: 0, crumbs: [], aval: level.chase ? { x: null, sp: level.chase.sp || 1.5, hits: 0 } : null,
      cam: { x: 0, y: Math.max(0, P.H * TS - VH) }, f: 0, phase: "play", coinN: 0, banMask: 0, sponde: 0, time: 0, spawn: P.start.slice(), sign: null, petals: [], stones: [], cards: [], debris: [], fx: (M.fx ? M.fx() : null), msg: "", msgT: 0, win: false, k
    };
    st.cam.x = clamp(st.hero.x - 120, 0, st.W * TS - VW);
    if (st.kit === "guanti") st.ball.st = "none";
    return st;
  }
  function mkFoe(e, level, k) {
    if (e.t === "Z") { const B = BOSSES[level.boss] || BOSSES.corvo; return { t: "Z", kind: level.boss || "corvo", x: e.x, y: e.y - 20, w: B.w, h: B.h, hp: Math.round(B.hp * (k > 1.15 ? 1.2 : k < 0.9 ? 0.8 : 1)), max: 0, dir: -1, st: "fly", stT: 120, wh: 0, hitT: 0, vy: 0, home: e.y - 40, ox: e.x, dead: 0 }; }
    const D = FOES[e.t]; return { t: e.t, x: e.x, y: e.y + TS - D.h, w: D.w, h: D.h, hp: D.hp, vx: -D.sp * (0.85 + 0.25 * k), dir: -1, vy: 0, cd: 60 + Math.round(rnd(e.x) * 90), wh: 0, hitT: 0, ox: e.x, oy: e.y + TS - D.h, dead: 0, flip: 0 };
  }
  // ------------------------------------------------------------ collisioni con la griglia
  const tile = (st, tx, ty) => (ty < 0 ? "." : ty >= st.H || tx < 0 || tx >= st.W ? (tx < 0 || tx >= st.W ? "#" : ".") : st.grid[ty][tx]);
  const solidT = (t) => t === "#" || t === "B" || t === "u" || t === "G" || t === "~" || t === "%";
  function hitsSolid(st, x, y, w, h) { const x0 = Math.floor(x / TS), x1 = Math.floor((x + w - 0.001) / TS), y0 = Math.floor(y / TS), y1 = Math.floor((y + h - 0.001) / TS); for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (solidT(tile(st, tx, ty))) return true; return false; }
  // muove un corpo (box) con assi separati; restituisce { hx, hy, ground }
  function move(st, b, w, h, oneWay) {
    const r = { hx: false, hy: false, ground: false };
    b.x += b.vx; let bx = b.x - w / 2, by = b.y - h;
    if (hitsSolid(st, bx, by, w, h)) { if (b.vx > 0) b.x = Math.floor((bx + w) / TS) * TS - w / 2 - 0.01; else if (b.vx < 0) b.x = (Math.floor(bx / TS) + 1) * TS + w / 2 + 0.01; r.hx = true; }
    const oldBottom = b.y; b.y += b.vy; bx = b.x - w / 2; by = b.y - h;
    if (hitsSolid(st, bx, by, w, h)) { if (b.vy > 0) { b.y = Math.floor(b.y / TS) * TS - 0.01; r.ground = true; } else if (b.vy < 0) b.y = (Math.floor(by / TS) + 1) * TS + h + 0.01; r.hy = true; }
    else if (oneWay && b.vy >= 0) { const ty = Math.floor(b.y / TS), top = ty * TS; if (oldBottom <= top + 0.5 && b.y >= top) { const x0 = Math.floor(bx / TS), x1 = Math.floor((bx + w - 0.001) / TS); for (let tx = x0; tx <= x1; tx++) if (tile(st, tx, ty) === "=") { b.y = top - 0.01; r.ground = true; r.hy = true; break; } } }
    return r;
  }
  const VENT_H = 112, inVent = (st, x, y) => st.vents.some((v) => Math.abs(x - v.x) < 9 && y < v.y && y > v.y - VENT_H);
  const overlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const heroBox = (h) => ({ x: h.x - 5, y: h.y - 20, w: 10, h: 20 });
  // ------------------------------------------------------------ suoni (brevi, generati)
  let AC = null;
  function snd(kind) {
    if (window.__noSfx) return;
    safe(() => {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const t = AC.currentTime, o = AC.createOscillator(), v = AC.createGain(); o.connect(v); v.connect(AC.destination);
      const P = { jump: ["square", 420, 680, 0.08, 0.04], coin: ["square", 980, 1320, 0.07, 0.035], kick: ["triangle", 220, 120, 0.1, 0.07], boing: ["sine", 260, 900, 0.16, 0.08], hit: ["sawtooth", 160, 60, 0.18, 0.06], brk: ["square", 140, 50, 0.12, 0.05], whistle: ["sine", 2200, 2500, 0.22, 0.03], flag: ["triangle", 520, 1040, 0.25, 0.05], ban: ["square", 660, 1320, 0.3, 0.04] }[kind] || ["square", 440, 440, 0.05, 0.03];
      o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]); v.gain.setValueAtTime(P[4], t); v.gain.exponentialRampToValueAtTime(0.001, t + P[3] + 0.02); o.start(t); o.stop(t + P[3] + 0.03);
    });
  }
  // ------------------------------------------------------------ logica
  function say(st, t, n) { st.msg = t; st.msgT = n || 90; }
  function hurt(st, dir) {
    const h = st.hero; if (h.inv > 0 || st.phase !== "play") return;
    h.hp--; h.inv = 90; h.vx = -dir * 2.2; h.vy = -3; snd("hit"); st.fx && st.fx.shake(4);
    for (let i = 0; i < 6; i++) st.debris.push({ x: h.x, y: h.y - 14, vx: (rnd(st.f + i) - 0.5) * 3, vy: -2 - rnd(i + st.f) * 2, l: 50, c: i % 2 ? "#a6afc2" : "#e2e8f2", s: 2 });
    if (h.hp <= 0) ko(st); else say(st, h.hp === 1 ? kitOf(st).lost[0] : kitOf(st).lost[1], 70);
  }
  function ko(st) { st.phase = "ko"; st.hero.vy = -4; for (let i = 0; i < 16; i++) st.debris.push({ x: st.hero.x, y: st.hero.y - 12, vx: (rnd(i * 3 + st.f) - 0.5) * 5, vy: -3 - rnd(i) * 3, l: 90, c: ["#a6afc2", "#e2e8f2", "#d23a3a", "#626b80"][i % 4], s: 3 }); controls(); }
  function respawn(st, full) {
    const h = st.hero; h.x = st.spawn[0]; h.y = st.spawn[1]; h.vx = h.vy = 0; h.inv = 60; h.frozen = 0; if (full) h.hp = h.max;
    if (st.ball.st !== "none") st.ball.st = "held"; st.cam.x = clamp(h.x - 120, 0, st.W * TS - VW); st.phase = "play"; controls();
  }
  function kick(st) {
    const h = st.hero, b = st.ball;
    if (b.st === "held") { b.st = "fly"; b.x = h.x + h.dir * 8; b.y = h.y - 9; b.vx = h.dir * 4.4; b.vy = h.ground ? -1.4 : 1.6; b.sp = 0; b.t = 0; b.bn = 0; h.kick = 10; snd("kick"); if (hitsSolid(st, b.x - 4, b.y - 4, 8, 8)) { b.x = h.x; } return; }
    if (b.st === "rest" || b.st === "fly") { b.st = "back"; b.t = 0; snd("kick"); }
  }
  function ballStep(st) {
    const b = st.ball, h = st.hero; if (b.st === "none") return; if (b.squash > 0) b.squash--;
    if (b.st === "held") { b.x = h.x + h.dir * 1; b.y = h.y - 12; return; }
    b.t++;
    if (b.st === "back") {
      const dx = h.x - b.x, dy = h.y - 12 - b.y, d = Math.hypot(dx, dy) || 1, sp = Math.min(6, 2 + b.t * 0.25); b.vx = dx / d * sp; b.vy = dy / d * sp; b.x += b.vx; b.y += b.vy;
      if (d < 10) { b.st = "held"; return; }
    } else if (b.st === "fly") {
      b.vy = Math.min(5, b.vy + 0.22); if (st.windV) b.vx += st.windV * 0.4; if (inVent(st, b.x, b.y)) b.vy = Math.max(-3, b.vy - 0.5); const box = { x: b.x, y: b.y + 4, vx: b.vx, vy: b.vy }, r = move(st, box, 8, 8, true); b.x = box.x; b.y = box.y - 4;
      if (r.hx) { b.vx = -b.vx * 0.86; b.sp++; b.bn++; st.fx && st.fx.burst(b.x, b.y, 4, ["#ffe8a0", "#c88a2a"]); snd("kick"); breakAround(st, b); }
      if (r.hy) { if (r.ground) { if (Math.abs(b.vy) > 1.2) { b.vy = -Math.abs(b.vy) * 0.62; b.bn++; } else { b.vy = 0; } b.vx *= 0.93; } else { b.vy = Math.abs(b.vy) * 0.5; breakAround(st, b, true); } }
      if (Math.abs(b.vx) < 0.15 && Math.abs(b.vy) < 0.3 && r.ground) { b.st = "rest"; b.vx = b.vy = 0; }
      if (b.t > 600 || b.y > st.H * TS + 30) { b.st = "back"; b.t = 0; }
    } else if (b.st === "rest") {
      // il pallone fermo può essere sul bordo di un buco: cade se sotto non c'è niente
      const box = { x: b.x, y: b.y + 4, vx: 0, vy: 1 }; const r = move(st, box, 8, 8, true); if (!r.ground) { b.st = "fly"; b.vy = 0.5; } else b.y = box.y - 4;
      st.movers.forEach((m) => { if (b.x > m.x && b.x < m.x + m.w && Math.abs(b.y + 4 - m.y) < 2) b.x += m.dx; });
    }
    // pallone contro le campane: suonano e aprono le grate vicine
    if (b.st === "fly") st.bells.forEach((k) => { if (!k.rung && Math.abs(b.x - k.x) < 10 && Math.abs(b.y - k.y) < 15) ring(st, k); });
    // pallone contro i nemici
    if (b.st === "fly" || b.st === "back") {
      const fast = b.st === "back" || Math.hypot(b.vx, b.vy) > 1.4;
      if (fast) st.foes.forEach((e) => { if (e.dead || e.hitT > 0) return; if (overlap({ x: b.x - 4, y: b.y - 4, w: 8, h: 8 }, foeBox(e))) ballHit(st, e, b); });
    }
  }
  function ring(st, k) {
    k.rung = 1; k.sw = 60; snd("ban"); st.fx && st.fx.text("DON!", k.x - st.cam.x, k.y - st.cam.y - 14, "#ffe8a0"); st.fx && st.fx.shake(3);
    const kx = Math.floor(k.x / TS); let n = 0;
    for (let y = 0; y < st.H; y++) for (let x = Math.max(0, kx - 4); x < Math.min(st.W, kx + 15); x++) if (st.grid[y][x] === "G") { st.grid[y][x] = "."; n++; for (let i = 0; i < 3; i++) st.debris.push({ x: x * TS + 8, y: y * TS + 8, vx: (rnd(i + x + y) - 0.5) * 2, vy: -1 - rnd(i * 3 + y), l: 40, c: "#8a8aa0", s: 2 }); }
    say(st, n ? "DON! La campana apre la grata." : "DON! Una campana d'oro, in fondo al buio.", 70);
  }
  function breakAround(st, b, up) {
    const tx = Math.floor((b.x + (up ? 0 : Math.sign(b.vx || 1) * -6)) / TS), ty = Math.floor((b.y + (up ? -6 : 0)) / TS);
    [[tx, ty], [tx + 1, ty], [tx - 1, ty], [tx, ty - 1], [tx, ty + 1]].forEach(([x, y]) => { if (tile(st, x, y) === "B" && Math.abs(x * TS + 8 - b.x) < 16 && Math.abs(y * TS + 8 - b.y) < 16) smash(st, x, y); });
  }
  function smash(st, x, y) {
    st.grid[y][x] = "."; snd("brk"); st.fx && st.fx.shake(2);
    for (let i = 0; i < 8; i++) st.debris.push({ x: x * TS + 8, y: y * TS + 8, vx: (rnd(i + x) - 0.5) * 4, vy: -2 - rnd(i * 2 + y) * 2.5, l: 60, c: i % 2 ? "#c87a4a" : "#9a5434", s: 3 });
  }
  const foeBox = (e) => (e.t === "Z" ? { x: e.x - e.w / 2, y: e.y - e.h, w: e.w, h: e.h } : { x: e.x - e.w / 2, y: e.y, w: e.w, h: e.h });
  function ballHit(st, e, b) {
    const dirB = Math.sign(b.vx || 1);
    if (e.t === "s" && e.dir === -dirB && !b.sp) { b.vx = -b.vx * 0.7; b.vy = -2; e.hitT = 10; say(st, "Lo scudo para! Prova di sponda o da dietro.", 80); snd("kick"); return; }
    if (e.t === "Z" && !e.vul && b.st !== "back") { b.vx = -b.vx * 0.6; b.vy = -2.5; say(st, e.kind === "gatto" ? "Troppo svelto! Colpiscilo quando è stordito." : e.kind === "statua" ? "È pietra! Aspetta che si stanchi." : e.kind === "conestabile" ? "Lo scudo nero para: aspetta che sbatta contro il muro!" : "Troppo in alto: aspetta che si pianti a terra!", 70); return; }
    const dmg = b.sp ? 2 : 1; e.hp -= dmg; e.hitT = 24; st.fx && st.fx.burst(e.x, e.y + 4, 10, ["#ffe8a0", "#ffffff", "#ff9a3a"]);
    if (b.sp) { st.sponde++; st.coinN += 2; say(st, "SPONDA! Doppio colpo, +2 gettoni", 60); snd("coin"); }
    if (b.st === "fly") { b.vx = -b.vx * 0.5; b.vy = -2.2; }
    if (e.hp <= 0) foeDie(st, e); else snd("hit");
  }
  function foeDie(st, e) {
    e.dead = 1; snd("hit"); st.coinN += e.t === "Z" ? 10 : 1;
    for (let i = 0; i < 10; i++) st.debris.push({ x: e.x, y: e.y + 4, vx: (rnd(i + e.x) - 0.5) * 4, vy: -2 - rnd(i) * 2, l: 50, c: ["#8a93a8", "#1c1a26", "#e8e8e8", "#ffd25a"][i % 4], s: 2 });
    if (e.t === "Z") { st.fx && st.fx.banner(e.kind === "gatto" ? "SGRINFIA KO!" : e.kind === "statua" ? "IL CUSTODE CADE!" : e.kind === "conestabile" ? "IL CONESTABILE CADE!" : e.kind === "yetone" ? "IL RACCATTAPALLE SI ARRENDE!" : e.kind === "stambecco" ? "LO STAMBECCO SI INCHINA!" : e.kind === "regina" ? "RIGORE PARATO! LA REGINA SI FERMA" : "FISCHIO FINALE!", "#fde047"); st.winAt = st.f + 80; }
  }
  function foeStep(st, e) {
    if (e.dead) return; if (e.hitT > 0) e.hitT--;
    const h = st.hero, D = FOES[e.t];
    if (e.t === "Z") return bossStep(st, e);
    if (e.t === "g") {
      e.vy = Math.min(5, e.vy + 0.3); const box = { x: e.x, y: e.y + e.h, vx: e.vx, vy: e.vy }, r = move(st, box, e.w, e.h, true); e.x = box.x; e.y = box.y - e.h;
      if (r.ground) { e.vy = 0; if (e.leap) { e.leap = 0; e.vx = Math.sign(e.vx || -1) * FOES.g.sp; } }
      if (--e.cd <= 0 && r.ground && Math.abs(h.x - e.x) < 72 && Math.abs(h.y - (e.y + e.h)) < 24) { e.cd = 130; e.leap = 1; e.vy = -4.4; e.vx = Math.sign(h.x - e.x) * 2.2; snd("jump"); }
      if (!e.leap) { const ahead = Math.floor((e.x + Math.sign(e.vx) * (e.w / 2 + 2)) / TS), below = Math.floor((e.y + e.h + 4) / TS), t = tile(st, ahead, below); if (r.hx || (r.ground && t !== "#" && t !== "=" && t !== "B" && t !== "u")) e.vx = -e.vx; }
      if (e.y > st.H * TS + 20) e.dead = 1;
      e.dir = e.vx > 0 ? 1 : -1;
    } else if (e.t === "y") {
      e.vy = Math.min(5, e.vy + 0.3); if (e.thr > 0) e.thr--; const box = { x: e.x, y: e.y + e.h, vx: e.thr > 0 ? 0 : e.vx, vy: e.vy }, r = move(st, box, e.w, e.h, true); e.x = box.x; e.y = box.y - e.h;
      if (r.ground) e.vy = 0;
      const ahead = Math.floor((e.x + Math.sign(e.vx) * (e.w / 2 + 2)) / TS), below = Math.floor((e.y + e.h + 4) / TS), t = tile(st, ahead, below);
      if (e.thr <= 0 && (r.hx || (r.ground && t !== "#" && t !== "=" && t !== "~"))) e.vx = -e.vx;
      const dx = h.x - e.x; e.dir = e.thr > 0 ? Math.sign(dx) || 1 : e.vx > 0 ? 1 : -1;
      if (--e.cd <= 0) { e.cd = Math.round(150 / (0.8 + 0.2 * st.k)); if (Math.abs(dx) < 190 && Math.abs(h.y - e.y) < 90) { e.thr = 22; st.stones.push({ x: e.x + Math.sign(dx) * 6, y: e.y - 8, vx: clamp((dx - Math.sign(dx) * 6) / lobT(-3.6, h.y - 12 - (e.y - 8)), -3, 3), vy: -3.6, l: 160, snow: 1 }); snd("kick"); } }
      if (e.y > st.H * TS + 20) e.dead = 1;
    } else if (e.t === "a") {
      if (!e.sw) { e.x += e.vx; if (Math.abs(e.x - e.ox) > 48) e.vx = -e.vx; e.dir = e.vx > 0 ? 1 : -1; e.y += ((e.oy - 22 + Math.sin(st.f / 18 + e.ox) * 6) - e.y) * 0.1; if (--e.cd <= 0 && Math.abs(h.x - e.x) < 130 && h.y > e.y + 10 && h.y - e.y < 120) { e.sw = 1; e.tx = h.x; e.ty = h.y - 10; snd("whistle"); } }
      else if (e.sw === 1) { const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy) || 1, sp = 2.4 + 0.3 * st.k; e.x += dx / d * sp; e.y += dy / d * sp; e.dir = dx > 0 ? 1 : -1; if (d < 4 || hitsSolid(st, e.x - 6, e.y, 12, 10)) e.sw = 2; }
      else { const dx = e.ox - e.x, dy = (e.oy - 22) - e.y, d = Math.hypot(dx, dy) || 1; e.x += dx / d * 1.4; e.y += dy / d * 1.4; e.dir = dx > 0 ? 1 : -1; if (d < 3) { e.sw = 0; e.cd = 160; } }
    } else if (e.t === "r") {
      if (!e.on) { if (Math.abs(h.x - e.x) < 230 && Math.abs(h.y - e.y) < 120) { e.on = 1; e.vx = Math.sign(h.x - e.x || -1) * FOES.r.sp * (0.85 + 0.25 * st.k); } }
      else {
        const bot = e.y + e.h; e.g = Math.min(1, (e.g || 0) + 0.004); e.w = e.h = Math.round(10 + 8 * e.g); e.y = bot - e.h;
        e.vy = Math.min(5, e.vy + 0.3); const box = { x: e.x, y: e.y + e.h, vx: e.vx, vy: e.vy }, r = move(st, box, e.w, e.h, true); e.x = box.x; e.y = box.y - e.h; if (r.ground) e.vy = 0;
        if (r.hx) { foeDie(st, e); for (let i = 0; i < 8; i++) st.debris.push({ x: e.x, y: e.y + 4, vx: (rnd(i + e.x) - 0.5) * 4, vy: -2 - rnd(i) * 2, l: 40, c: "#ffffff", s: 3 }); return; }
        if (e.y > st.H * TS + 20) e.dead = 1; e.dir = e.vx > 0 ? 1 : -1;
      }
    } else if (e.t === "n") {
      if (e.thr > 0) e.thr--; const dx = h.x - e.x; e.dir = Math.sign(dx) || -1;
      if (--e.cd <= 0) { e.cd = Math.round(140 / (0.8 + 0.2 * st.k)); if (Math.abs(dx) < 200 && Math.abs(h.y - e.y) < 90) { e.thr = 20; st.stones.push({ x: e.x + e.dir * 6, y: e.y, vx: clamp((dx - e.dir * 6) / lobT(-3.6, h.y - 12 - e.y), -3, 3), vy: -3.6, l: 160, snow: 1 }); snd("kick"); } }
    } else if (e.t === "e" || e.t === "s") {
      e.vy = Math.min(5, e.vy + 0.3); const box = { x: e.x, y: e.y + e.h, vx: e.vx, vy: e.vy }, r = move(st, box, e.w, e.h, true); e.x = box.x; e.y = box.y - e.h;
      if (r.ground) e.vy = 0;
      const ahead = Math.floor((e.x + Math.sign(e.vx) * (e.w / 2 + 2)) / TS), below = Math.floor((e.y + e.h + 4) / TS), t = tile(st, ahead, below);
      if (r.hx || (r.ground && t !== "#" && t !== "=" && t !== "B")) { e.vx = -e.vx; }
      if (e.t === "s" && Math.abs(h.x - e.x) < 70 && Math.abs(h.y - e.y - e.h) < 30) e.vx = Math.sign(h.x - e.x) * Math.abs(e.vx || 0.4);
      e.dir = e.vx > 0 ? 1 : -1;
    } else if (e.t === "c") {
      e.x += e.vx; if (Math.abs(e.x - e.ox) > 56) e.vx = -e.vx; e.dir = e.vx > 0 ? 1 : -1; e.y = e.oy - 18 + Math.sin(st.f / 20 + e.ox) * 10;
      if (e.wh > 0) e.wh--;
      if (--e.cd <= 0 && Math.abs(h.x - e.x) < 80 && Math.abs(h.y - e.y) < 70) { e.cd = 200; e.wh = 30; snd("whistle"); if (Math.abs(h.x - e.x) < 64 && h.ground && h.inv <= 0) { h.frozen = 42; say(st, "FIIII! Ammonito: fermo un attimo!", 60); } }
    } else if (e.t === "m") {
      const dx = h.x - e.x, dy = (h.y - 12) - (e.y + 7), d = Math.hypot(dx, dy) || 1; e.dir = dx > 0 ? 1 : -1;
      e.shy = h.dir === Math.sign(e.x - h.x) && d < 170;
      if (!e.shy && d < 200) { const sp = FOES.m.sp * (0.85 + 0.25 * st.k); e.x += dx / d * sp; e.y += dy / d * sp; }
    } else if (e.t === "t") {
      e.dir = h.x < e.x ? -1 : 1;
      if (--e.cd <= 0) { e.cd = Math.round(130 / (0.8 + 0.2 * st.k)); if (Math.abs(h.x - e.x) < 220) { const dx = h.x - e.x, tt = 50; st.stones.push({ x: e.x, y: e.y + 2, vx: dx / tt, vy: -4.2, l: 140 }); } }
    }
    // contatto con l'eroe: dall'alto lo schiacci, altrimenti fa male
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && h.parry > 0 && Math.sign(e.x - h.x) === h.dir && overlap({ x: h.dir > 0 ? h.x : h.x - 20, y: h.y - 26, w: 20, h: 28 }, fb) && e.hitT <= 0) { e.hp--; e.hitT = 24; e.x += h.dir * 10; if (e.vx) e.vx = h.dir * Math.abs(e.vx); if (e.t === "a") e.sw = 2; snd("boing"); st.fx && st.fx.burst(e.x, e.y + 4, 8, ["#fde68a", "#ffffff"]); if (e.hp <= 0) foeDie(st, e); return; }
    if (st.phase === "play" && overlap(hb, fb)) {
      if (h.vy > 0.5 && h.y - 6 < fb.y + 4 && D.stomp) { h.vy = -4.6; e.hp -= 1; e.hitT = 20; snd("boing"); if (e.hp <= 0) foeDie(st, e); else if (e.t === "e") e.flip = 1; }
      else if (e.hitT <= 0) hurt(st, Math.sign(e.x - h.x) || 1);
    }
  }
  function bossStep(st, e) {
    if (e.kind === "gatto") return catStep(st, e);
    if (e.kind === "statua") return statueStep(st, e);
    if (e.kind === "conestabile") return conestStep(st, e);
    if (e.kind === "yetone") return yetoneStep(st, e);
    if (e.kind === "stambecco") return stambeccoStep(st, e);
    if (e.kind === "regina") return reginaStep(st, e);
    const h = st.hero, minX = TS * 1.5 + e.w / 2, maxX = st.W * TS - TS * 1.5 - e.w / 2, ground = (st.H - 2) * TS;
    e.vul = e.st === "stuck";
    if (!e.max) { e.max = e.hp; e.home = (st.H - 2) * TS - 84; e.y = e.home; }
    if (e.wh > 0) e.wh--;
    e.stT--;
    if (e.st === "fly") {
      e.x += e.dir * (0.9 + (e.hp < e.max / 2 ? 0.5 : 0)); if (e.x < minX || e.x > maxX) { e.dir = -e.dir; e.x = clamp(e.x, minX, maxX); }
      e.y = e.home + Math.sin(st.f / 18) * 8;
      if (st.f % 170 === 60) { e.wh = 40; snd("whistle"); if (h.ground && h.inv <= 0) { h.frozen = 46; say(st, "FIIII! Salta quando fischia!", 70); } }
      if (e.hp < e.max / 2 && st.f % 90 === 0) st.cards.push({ x: e.x, y: e.y - 10, vx: 0, vy: 0.6, l: 260, ph: rnd(st.f) * 6 });
      if (e.stT <= 0) { e.st = "aim"; e.stT = 40; e.tx = h.x; }
    } else if (e.st === "aim") { e.x += clamp(e.tx - e.x, -2, 2); if (e.stT <= 0) { e.st = "dive"; e.vy = 1; } }
    else if (e.st === "dive") { e.vy = Math.min(7, e.vy + 0.4); e.y += e.vy; if (e.y >= ground) { e.y = ground; e.st = "stuck"; e.stT = 90 + (st.k < 1 ? 30 : 0); st.fx && st.fx.shake(6); snd("brk"); for (let i = 0; i < 8; i++) st.debris.push({ x: e.x, y: ground, vx: (rnd(i) - 0.5) * 5, vy: -2 - rnd(i + 3) * 2, l: 40, c: "#c87a4a", s: 3 }); } }
    else if (e.st === "stuck") { if (e.stT <= 0) { e.st = "up"; } }
    else if (e.st === "up") { e.y -= 1.6; if (e.y <= e.home) { e.st = "fly"; e.stT = 140 + Math.round(rnd(st.f) * 80); } }
    const hb = heroBox(h), fb = foeBox(e);
    if (st.phase === "play" && overlap(hb, fb)) {
      if (e.st === "stuck" && h.vy > 0.5 && h.y - 6 < fb.y + 10) { h.vy = -5.2; if (e.hitT <= 0) { e.hp--; e.hitT = 30; snd("boing"); st.fx && st.fx.burst(e.x, fb.y, 12, ["#fff", "#ffd25a"]); if (e.hp <= 0) foeDie(st, e); } }
      else if (e.st !== "stuck" || h.vy <= 0.5) hurt(st, Math.sign(e.x - h.x) || 1);
    }
  }
  function win(st) {
    if (st.phase !== "play") return; st.phase = "win"; st.win = true; snd("flag"); st.fx && st.fx.banner(st.practice ? "PRONTO!" : "LIVELLO SUPERATO!", "#fde047"); st.fx && st.fx.burst(VW / 2, 80, 40, ["#fde047", "#f472b6", "#fff"]); controls();
  }
  function heroStep(st) {
    const h = st.hero, K = keys;
    if (h.inv > 0) h.inv--; if (h.kick > 0) h.kick--; if (h.squash > 0) h.squash -= 0.1; if (h.parry > 0) h.parry--; if (h.pcd > 0) h.pcd--;
    const G = st.kit === "guanti", ice = G && h.ground && tile(st, Math.floor(h.x / TS), Math.floor((h.y + 2) / TS)) === "~";
    const frozen = h.frozen > 0; if (frozen) h.frozen--;
    const ax = frozen ? 0 : (K.R ? 1 : 0) - (K.L ? 1 : 0);
    const vmax = h.glide ? 2.4 : 1.9;
    if (ax) { h.vx = clamp(h.vx + ax * (ice ? 0.1 : 0.32), -vmax, vmax); h.dir = ax; } else h.vx *= ice ? 0.985 : h.ground ? 0.72 : 0.92;
    if (Math.abs(h.vx) < 0.05) h.vx = 0;
    if (st.level.sled && !frozen) { const sp = st.level.sled.sp || 2.2; h.vx = sp * (K.R ? 1.25 : K.L ? 0.6 : 1); h.dir = 1; }
    if (st.windV) h.vx = clamp(h.vx + st.windV, -2.5, 2.5);
    if (K.J && !K._J) h.buf = 7; K._J = K.J; if (h.buf > 0) h.buf--;
    if (h.buf > 0 && (h.ground || h.coyote > 0) && !frozen) { h.vy = -6.4; h.ground = false; h.coyote = 0; h.buf = 0; snd("jump"); }
    if (h.spr > 0) h.spr--; else if (!K.J && h.vy < -2) h.vy *= 0.82;
    if (K.K && !K._K && !frozen) { if (G) { if (!(h.pcd > 0)) { h.parry = 16; h.pcd = 30; snd("kick"); } } else kick(st); } K._K = K.K;
    h.vy = Math.min(5.2, h.vy + 0.3);
    h.glide = G && !h.ground && K.J && h.vy > 0.9 && !(h.spr > 0); if (h.glide) { h.vy = 0.9; if (!ax) h.vx = clamp(h.vx + h.dir * 0.05, -2.4, 2.4); if (st.f % 8 === 0) st.debris.push({ x: h.x - h.dir * 8, y: h.y - 14, vx: -h.dir * 0.6, vy: -0.2, l: 16, c: "#e8f4ff", s: 1 }); }
    // piattaforme mobili
    if (h.onM) { h.x += h.onM.dx; }
    if (inVent(st, h.x, h.y - 6)) { h.vy = Math.max(-3.4, h.vy - 0.62); h.spr = 3; if (st.f % 20 === 0) snd("boing"); }
    const r = move(st, h, 10, 20, !K.D);
    let gnd = r.ground; h.onM = null;
    st.movers.forEach((m) => { if (h.vy >= 0 && h.x + 5 > m.x && h.x - 5 < m.x + m.w && h.y >= m.y && h.y - h.vy <= m.y + 2) { h.y = m.y - 0.01; h.vy = 0; gnd = true; h.onM = m; } });
    // il pallone a terra fa da molla
    const b = st.ball;
    if (b.st === "rest" && h.vy > 0 && Math.abs(h.x - b.x) < 9 && h.y >= b.y - 5 && h.y - h.vy <= b.y - 3) { h.y = b.y - 5; h.vy = -7.6; h.spr = 30; gnd = false; b.squash = 10; h.squash = 0; snd("boing"); st.fx && st.fx.text("BOING!", b.x, b.y - 10, "#ffe8a0"); }
    if (gnd) { if (!h.ground && h.vy >= 0) h.squash = 0.6; h.vy = 0; h.coyote = 6; } else if (h.coyote > 0) h.coyote--;
    if (r.hy && !gnd && h.vy < 0) h.vy = 0;
    h.ground = gnd;
    if (gnd) [h.x - 4, h.x + 4].forEach((x) => { const tx = Math.floor(x / TS), ty = Math.floor((h.y + 2) / TS); if (tile(st, tx, ty) === "%" && !st.crumbs.some((c) => c.x === tx && c.y === ty)) st.crumbs.push({ x: tx, y: ty, t: 26, gone: 0, r: 0 }); });
    // punte e buchi
    const tb = tile(st, Math.floor(h.x / TS), Math.floor((h.y - 2) / TS)); if (tb === "^") hurt(st, -h.dir);
    if (h.y > st.H * TS + 24 && st.phase === "play") { h.hp--; snd("hit"); if (h.hp <= 0) { h.hp = 0; ko(st); } else { say(st, st.th.fall || "Giù dalle mura! Si riparte dal gonfalone.", 80); respawn(st, false); } }
    // gettoni, oggetti, gonfaloni, cartelli, uscita
    const hb = heroBox(h);
    st.coins.forEach((c) => { if (!c.got && Math.abs(c.x - h.x) < 10 && Math.abs(c.y - (h.y - 10)) < 14) { c.got = 1; st.coinN++; snd("coin"); st.fx && st.fx.burst(c.x - st.cam.x, c.y - st.cam.y, 4, ["#ffe066"]); } });
    st.items.forEach((it) => { if (!it.got && Math.abs(it.x - h.x) < 11 && Math.abs(it.y - (h.y - 10)) < 15) { it.got = 1; if (it.k === "h") { h.hp = Math.min(h.max, h.hp + 1); snd("flag"); say(st, kitOf(st).heal, 70); } else { st.banMask |= 1 << it.i; snd("ban"); say(st, `${kitOf(st).ban} ${countBits(st.banMask)}/${st.P.ban}!`, 80); } } });
    st.checks.forEach((c) => { if (!c.on && Math.abs(c.x - h.x) < 12 && Math.abs(c.y - h.y) < 30) { c.on = 1; st.spawn = [c.x, c.y - 1]; snd("flag"); say(st, kitOf(st).check, 80); } });
    st.sign = st.signs.find((s) => Math.abs(s.x - h.x) < 18 && Math.abs(s.y - h.y) < 24) || null;
    if (st.exit && !st.foes.some((e) => e.t === "Z" && !e.dead) && hb.x + hb.w > st.exit.x + 6 && hb.x < st.exit.x + 26 && Math.abs(h.y - st.exit.y) < 24) win(st);
  }
  const countBits = (n) => { let c = 0; while (n) { c += n & 1; n >>= 1; } return c; };
  function step(st) {
    st.f++; if (st.phase === "play") st.time++;
    if (st.winAt && st.f >= st.winAt && st.phase === "play") win(st);
    st.movers.forEach((m) => { const nx = m.x + m.vx; if (nx < m.x0 || nx > m.x1) m.vx = -m.vx; m.dx = m.vx; m.x += m.vx; });
    if (st.phase === "play") { heroStep(st); ballStep(st); st.foes.forEach((e) => foeStep(st, e)); }
    else if (st.phase === "ko") { st.hero.vy += 0.3; st.hero.y += st.hero.vy; }
    if (st.aval && st.phase === "play") {
      const A = st.aval, h = st.hero, from = (st.level.chase.from || 0) * TS;
      if (A.x === null) { if (h.x > from) { A.x = h.x - 210; say(st, "VALANGA! Corri ▶▶ e non fermarti!", 90); st.fx && st.fx.shake(6); snd("brk"); } }
      else {
        A.x += A.sp; if (h.x - A.x > 250) A.x = h.x - 250; if (st.f % 40 === 0) st.fx && st.fx.shake(2);
        if (h.x < A.x + 6) { A.hits++; h.hp--; snd("hit"); st.fx && st.fx.shake(8); if (h.hp <= 0) { h.hp = 0; ko(st); } else { say(st, "Travolto! La valanga ti risputa all'ometto di pietre.", 80); respawn(st, false); A.x = st.spawn[0] - 200; } }
      }
    }
    st.crumbs = st.crumbs.filter((c) => {
      if (!c.gone) { if (--c.t <= 0) { c.gone = 1; c.r = 320; st.grid[c.y][c.x] = "."; snd("brk"); for (let i = 0; i < 6; i++) st.debris.push({ x: c.x * TS + 8, y: c.y * TS + 6, vx: (rnd(i + c.x) - 0.5) * 2, vy: -0.5 - rnd(i * 3 + c.y), l: 40, c: i % 2 ? "#ffffff" : "#9ab8d8", s: 3 }); } return true; }
      if (--c.r > 0) return true; const h = st.hero; if (Math.abs(h.x - (c.x * TS + 8)) < 14 && Math.abs(h.y - c.y * TS) < 24) { c.r = 30; return true; } st.grid[c.y][c.x] = "%"; return false;
    });
    st.stones = st.stones.filter((s) => {
      s.x += s.vx; s.vy += s.flat ? (s.mine ? 0 : s.vy > 0 ? 0.02 : 0) : s.ice ? 0.22 : s.mine ? 0.08 : 0.16; s.y += s.vy; const h = st.hero, r = s.big ? 10 : 7;
      if (s.mine) { const e = st.foes.find((e) => !e.dead && e.hitT <= 0 && overlap({ x: s.x - r / 2, y: s.y - r / 2, w: r, h: r }, foeBox(e))); if (e) { e.hp -= s.big ? 2 : 1; e.hitT = 24; snd("hit"); st.fx && st.fx.burst(s.x, s.y, 10, ["#ffffff", "#bfe0ff"]); if (e.t === "Z") say(st, s.big ? "RESPINTA! Doppio colpo!" : "Respinta! Colpito!", 50); if (e.hp <= 0) foeDie(st, e); return false; } }
      else if (st.phase === "play" && h.parry > 0 && Math.sign(s.x - h.x) !== -h.dir && Math.abs(s.x - h.x) < 22 && s.y > h.y - 30 && s.y < h.y + 4) { const perfect = h.parry >= 10; s.mine = 1; s.vx = h.dir * (s.big ? 3.4 : 4.2); s.vy = s.flat ? 0 : s.boss ? -1.6 : -2.2; s.l = 140; st.parries++; snd("boing"); st.fx && st.fx.text(perfect ? "PARATA!" : "Respinta", s.x - st.cam.x, s.y - st.cam.y - 8, perfect ? "#fde68a" : "#ffffff"); if (perfect) { st.coinN++; snd("coin"); } return true; }
      else if (st.phase === "play" && Math.abs(s.x - h.x) < r && s.y > h.y - 20 && s.y < h.y) { hurt(st, Math.sign(s.vx) || 1); if (s.snow) for (let i = 0; i < 6; i++) st.debris.push({ x: s.x, y: s.y, vx: (rnd(i + st.f) - 0.5) * 3, vy: -1 - rnd(i) * 2, l: 30, c: "#ffffff", s: 2 }); return false; }
      const alive = --s.l > 0 && !solidT(tile(st, Math.floor(s.x / TS), Math.floor(s.y / TS))); if (!alive && s.snow) for (let i = 0; i < 4; i++) st.debris.push({ x: s.x, y: s.y - 2, vx: (rnd(i + s.x) - 0.5) * 2.5, vy: -1 - rnd(i) * 1.5, l: 24, c: "#ffffff", s: 2 }); return alive;
    });
    st.falls.forEach((t) => {
      const h = st.hero;
      if (t.st === "idle") { if (Math.abs(h.x - t.x) < 16 && h.y > t.y && h.y - t.y < 140) { t.st = "shake"; t.t = 26; } }
      else if (t.st === "shake") { if (--t.t <= 0) { t.st = "fall"; t.vy = 0; snd("brk"); } }
      else if (t.st === "fall") { t.vy = Math.min(6, t.vy + 0.35); t.y += t.vy; if (st.phase === "play" && Math.abs(h.x - t.x) < 9 && t.y + 6 > h.y - 20 && t.y < h.y) { hurt(st, 1); t.st = "gone"; t.t = 200; } else if (solidT(tile(st, Math.floor(t.x / TS), Math.floor((t.y + 6) / TS))) || t.y > st.H * TS) { t.st = "gone"; t.t = 200; for (let i = 0; i < 5; i++) st.debris.push({ x: t.x, y: t.y, vx: (rnd(i + t.x) - 0.5) * 3, vy: -1.5 - rnd(i) * 1.5, l: 40, c: i % 2 ? "#a0483a" : "#d07a52", s: 2 }); } }
      else if (t.st === "gone") { if (--t.t <= 0) { t.st = "idle"; t.y = t.y0; } }
    });
    st.waves = st.waves.filter((w) => { w.x += w.dir * w.sp; const h = st.hero; if (st.phase === "play" && h.ground && Math.abs(h.x - w.x) < 8 && h.y > (st.H - 3) * TS) hurt(st, w.dir); if (st.f % 3 === 0) st.debris.push({ x: w.x, y: (st.H - 2) * TS - 2, vx: -w.dir * 0.4, vy: -1.4 - rnd(st.f) * 1.2, l: 24, c: "#9a9ab0", s: 3 }); return --w.l > 0 && w.x > 0 && w.x < st.W * TS; });
    st.bells.forEach((k) => { if (k.sw > 0) k.sw--; });
    if (st.th.wind && st.phase === "play") { const p = st.f % 420, dir = Math.floor(st.f / 420) % 2 ? 1 : -1, on = p > 240, ramp = on ? Math.min(1, (p - 240) / 30, (420 - p) / 30) : 0; st.windV = dir * 0.13 * ramp; if (p === 230) say(st, dir > 0 ? "Arriva una raffica ▶▶" : "◀◀ Arriva una raffica", 50); }
    if (st.th.storm && st.level.bolts && st.phase === "play" && st.f % 210 === 100) st.bolts.push({ x: clamp(st.hero.x + (rnd(st.f) - 0.5) * 60, 24, st.W * TS - 24), t: 55 });
    st.bolts = st.bolts.filter((b) => { b.t--; if (b.t === 0) { st.flash = 22; snd("brk"); st.fx && st.fx.shake(5); const h = st.hero; if (st.phase === "play" && Math.abs(h.x - b.x) < 12) hurt(st, h.x > b.x ? -1 : 1); } return b.t > -12; });
    if (st.th.storm && st.f % 330 === 200) st.flash = Math.max(st.flash, 16);
    if (st.flash > 0) st.flash--;
    st.cards = st.cards.filter((c) => { c.y += c.vy; c.x += Math.sin(st.f / 12 + c.ph) * 0.8; if (st.phase === "play" && Math.abs(c.x - st.hero.x) < 7 && c.y > st.hero.y - 20 && c.y < st.hero.y) { hurt(st, 1); return false; } return --c.l > 0 && c.y < st.H * TS; });
    st.debris = st.debris.filter((d) => { d.x += d.vx; d.vy += 0.2; d.y += d.vy; return --d.l > 0; });
    if (st.msgT > 0) st.msgT--;
    // telecamera: segue l'eroe con un po' di anticipo nella direzione dello sguardo
    const h = st.hero, tx = clamp(h.x - VW / 2 + h.dir * 30, 0, st.W * TS - VW), ty = clamp(h.y - VH * 0.62, 0, Math.max(0, st.H * TS - VH));
    st.cam.x += (tx - st.cam.x) * 0.1; st.cam.y += (ty - st.cam.y) * 0.12;
    // petali che volano (tema)
    if (st.th.fx === "pioggia") for (let i = 0; i < 3; i++) st.petals.push({ x: rnd(st.f * 3 + i) * (VW + 60) - 30, y: -4, vx: -0.6 + st.windV * 30, vy: 5 + rnd(st.f + i) * 2, ph: 0, l: 50, c: "rain" });
    if (st.th.fx === "polvere" && st.f % 12 === 0) st.petals.push({ x: rnd(st.f) * VW, y: rnd(st.f + 3) * VH, vx: -0.12 - rnd(st.f + 1) * 0.15, vy: -0.05, ph: rnd(st.f + 2) * 6, l: 300, c: "#8a88a8" });
    if (st.th.fx === "neve" && st.f % 4 === 0) st.petals.push({ x: rnd(st.f) * (VW + 40) - 20, y: -3, vx: -0.25 - rnd(st.f + 5) * 0.3 + st.windV * 20, vy: 0.5 + rnd(st.f + 1) * 0.5, ph: rnd(st.f + 2) * 6, l: 400, c: "snow", r: rnd(st.f + 9) > 0.7 ? 2 : 1 });
    if (st.th.fx === "petali" && st.f % 9 === 0) st.petals.push({ x: VW + 4, y: rnd(st.f) * VH * 0.8, vx: -0.6 - rnd(st.f + 1) * 0.8, vy: 0.2, ph: rnd(st.f + 2) * 6, l: 600 });
    st.petals = st.petals.filter((p) => { p.x += p.vx; p.y += p.vy + Math.sin(st.f / 15 + p.ph) * 0.3; return --p.l > 0 && p.x > -6; });
    st.fx && st.fx.tick();
  }
  // ------------------------------------------------------------ disegno
  function drawLayers(g, st) {
    const T = st.T, f = st.f, cx = st.cam.x, cy = st.cam.y, maxY = Math.max(0, st.H * TS - VH), vy = (cy - maxY) * 0.25;
    g.drawImage(T.sky, 0, 0);
    T.layers.forEach((L) => {
      const w = L.c.width, ox = -(((cx * L.k + (L.drift ? f * L.drift : 0)) % w) + w) % w, y = Math.round(L.y - vy * (L.k * 2));
      if (L.alpha) g.globalAlpha = L.alpha;
      for (let x = ox; x < VW; x += w) g.drawImage(L.c, Math.round(x), y);
      g.globalAlpha = 1;
      if (L.flags) T.flags.forEach(([fx0, fy]) => { for (let x = ox; x < VW + w; x += w) { const X = Math.round(x + fx0), Y = y + fy; if (X < -10 || X > VW + 10) continue; R(g, X, Y - 8, 1, 8, "#3a2440"); for (let i = 0; i < 5; i++) R(g, X + 1 + i, Y - 8 + Math.round(Math.sin(f / 6 + i * 0.9 + fx0) * 1), 1, 3, i % 2 ? "#e85a4a" : "#f07a5a"); } });
      if (L.wins) T.wins.forEach(([wx, wy], i) => { if (Math.sin(f / 40 + i * 1.7) > 0.93) for (let x = ox; x < VW + w; x += w) R(g, Math.round(x + wx), y + wy, 5, 6, "#3a2440"); });
    });
    if (T.back && !st.level.open) { const B = T.back, bw = B.c.width, bh = B.c.height, bx = -(((cx * B.k) % bw) + bw) % bw, by = -(((cy * B.k) % bh) + bh) % bh, x0 = Math.round(TS * 1 - cx), x1 = Math.round((st.W - 1) * TS - cx); g.save(); g.beginPath(); g.rect(Math.max(0, x0), 0, Math.min(VW, x1) - Math.max(0, x0), VH); g.clip(); for (let x = bx; x < VW; x += bw) for (let y = by; y < VH; y += bh) g.drawImage(B.c, Math.round(x), Math.round(y)); if (st.flash > 0) R(g, 0, 0, VW, VH, `rgba(200,220,255,${st.flash / 30})`); g.restore(); }
    if (T.stars) T.stars.forEach(([x, y, i]) => { const a = Math.sin(f / 20 + i * 1.3); if (a > -0.3) R(g, x, y - Math.round(vy * 0.05), 1, 1, a > 0.8 ? "#ffffff" : "#b8b8e0"); });
    if (T.stars && f % 420 < 26) { const sx = 260 - (f % 420) * 6, sy = 18 + (f % 420) * 2; for (let i = 0; i < 6; i++) R(g, sx + i * 2, sy - i, 2, 1, `rgba(255,255,230,${0.9 - i * 0.14})`); }
    // uccelli lontani
    for (let i = 0; i < 3; i++) { const bx = ((f * (0.3 + i * 0.1) + i * 140) % (VW + 60)) - 30, by = 30 + i * 14 + Math.sin(f / 30 + i) * 4, wg = Math.sin(f / 5 + i) > 0 ? -1 : 1; R(g, bx, by, 2, 1, "#3a2048"); R(g, bx - 2, by + wg, 2, 1, "#3a2048"); R(g, bx + 2, by + wg, 2, 1, "#3a2048"); }
  }
  function drawTiles(g, st) {
    const A = st.A, x0 = Math.floor(st.cam.x / TS), y0 = Math.floor(st.cam.y / TS), ox = -Math.round(st.cam.x), oy = -Math.round(st.cam.y);
    for (let ty = y0; ty <= y0 + 12; ty++) for (let tx = x0; tx <= x0 + 21; tx++) {
      const t = tile(st, tx, ty); if (t === ".") continue; const X = tx * TS + ox, Y = ty * TS + oy, v = (tx * 7 + ty * 13) % 4;
      if (t === "#") { const up = tile(st, tx, ty - 1); if (up !== "#" && up !== "B") g.drawImage(A.top[v], X, Y - 4); else g.drawImage(A.brick[v], X, Y); if (tile(st, tx - 1, ty) === "." && rnd(tx * 3 + ty) > 0.7) { R(g, X, Y + 2, 1, 9, st.th.grass ? st.th.grass.c : "#2a2a2a"); R(g, X - 1, Y + 5, 1, 3, st.th.grass ? st.th.grass.a : "#2a2a2a"); } }
      else if (t === "~") g.drawImage(A.ice, X, Y);
      else if (t === "%") { const c = st.crumbs.find((k) => k.x === tx && k.y === ty && !k.gone), sh = c ? (st.f % 4 < 2 ? -1 : 1) : 0; R(g, X + sh, Y + 2, 16, 10, "#9ab8d8"); R(g, X + sh, Y, 16, 4, "#ffffff"); R(g, X + sh, Y + 4, 16, 2, "#dcecfa"); for (let k = 0; k < 4; k++) R(g, X + sh + 2 + k * 4, Y + 12, 2, 2 + ((tx + k) % 3), "#bfe0f8"); R(g, X + sh + 5, Y + 6, 1, 4, "#6a8cb0"); R(g, X + sh + 11, Y + 5, 1, 3, "#6a8cb0"); if (c) { R(g, X + sh + 3, Y + 4, 10, 1, "#4a6c90"); R(g, X + sh + 8, Y + 4, 1, 7, "#4a6c90"); } }
      else if (t === "=") g.drawImage(A.plank, X, Y);
      else if (t === "u") g.drawImage(A.chim, X, Y);
      else if (t === "G") g.drawImage(A.gate, X, Y);
      else if (t === "B") g.drawImage(A.crack, X, Y);
      else if (t === "^") g.drawImage(A.spike, X, Y);
    }
  }
  function drawCoin(g, x, y, f, i) {
    const w = [5, 4, 3, 1, 3, 4][Math.floor(f / 6 + i) % 6], X = Math.round(x), Y = Math.round(y + Math.sin(f / 12 + i) * 1.5);
    ell(g, X, Y, w + 1, 6, "#8a5a10"); ell(g, X, Y, w, 5, "#f6c445"); if (w > 2) { R(g, X - w + 1, Y - 4, 1, 3, "#fff2a0"); R(g, X - 2, Y - 2, 1, 1, "#8a5a10"); R(g, X + 1, Y - 2, 1, 1, "#8a5a10"); R(g, X - 2, Y + 1, 4, 1, "#8a5a10"); R(g, X - 2, Y, 1, 1, "#8a5a10"); R(g, X + 2, Y, 1, 1, "#8a5a10"); }
  }
  function drawObjects(g, st) {
    const ox = -Math.round(st.cam.x), oy = -Math.round(st.cam.y), f = st.f, vis = (x) => x + ox > -40 && x + ox < VW + 40;
    // cartelli
    st.signs.forEach((s) => { if (!vis(s.x)) return; const X = s.x + ox, Y = s.y + oy; R(g, X - 1, Y - 12, 2, 12, "#4a2e18"); part(g, X - 7, Y - 18, 14, 8, "#b07a44", "#2a1a10"); R(g, X - 5, Y - 16, 10, 1, "#6a4426"); R(g, X - 5, Y - 14, 7, 1, "#6a4426"); if (st.sign === s && f % 30 < 20) R(g, X - 1, Y - 24, 2, 3, "#ffe066"); });
    // gonfaloni (si alzano quando li tocchi)
    st.checks.forEach((c) => { if (!vis(c.x)) return; const X = c.x + ox, Y = c.y + oy;
      if (st.kit === "guanti") { [[0, 0, 7], [1, -6, 6], [0, -11, 5], [1, -15, 3]].forEach(([dx, dy, r], i) => { ell(g, X + dx, Y + dy - 3, r, 3, "#16141f"); ell(g, X + dx, Y + dy - 3, r - 1, 2, i % 2 ? "#8a94a8" : "#a8b2c4"); }); if (c.on) { R(g, X + 3, Y - 30, 1, 14, "#5a3a20"); for (let i = 0; i < 6; i++) R(g, X + 4, Y - 30 + i, 7 - i + Math.round(Math.sin(f / 5 + i / 2)), 1, i < 3 ? "#d23a3a" : "#f0f0f0"); disc(g, X + 1, Y - 20, 3, `rgba(255,200,90,${0.5 + 0.3 * Math.sin(f / 6)})`); } return; } R(g, X - 1, Y - 30, 2, 30, "#5a3a20"); R(g, X - 2, Y - 31, 4, 2, "#e0b040"); const top = c.on ? Y - 29 : Y - 10; for (let i = 0; i < 9; i++) R(g, X + 1, top + i, 9 - Math.floor(i / 3) + Math.round(Math.sin(f / 5 + i / 2)), 1, c.on ? (i < 3 ? "#f4c040" : "#2a6ad0") : "#6a6a7a"); });
    // portone d'uscita ad arco
    if (st.exit && vis(st.exit.x) && st.kit === "guanti") {
      const X = st.exit.x + ox, Y = st.exit.y + oy, open = !st.foes.some((e) => e.t === "Z" && !e.dead);
      part(g, X - 4, Y - 34, 40, 34, "#6a4a2a", "#16141f"); for (let y = Y - 32; y < Y; y += 6) R(g, X - 4, y, 40, 1, "#4a321a");
      for (let k = 0; k < 24; k++) R(g, X - 8 + k, Y - 34 - k * 0.6, 48 - k * 2, 2, k < 3 ? "#ffffff" : "#5a3a24"); R(g, X - 8, Y - 36, 48, 3, "#ffffff");
      R(g, X + 9, Y - 24, 14, 24, open ? "#2a1608" : "#4a2e18"); if (open) R(g, X + 10, Y - 22, 12, 22, `rgba(255,190,100,${0.35 + 0.15 * Math.sin(f / 10)})`);
      R(g, X - 1, Y - 24, 7, 7, "#ffd27a"); R(g, X + 26, Y - 24, 7, 7, "#ffd27a"); R(g, X + 2, Y - 24, 1, 7, "#5a3a24"); R(g, X + 29, Y - 24, 1, 7, "#5a3a24");
      for (let i = 0; i < 4; i++) { const t = (f * 0.4 + i * 14) % 50; disc(g, X + 28 + Math.sin(f / 15 + i) * 3, Y - 50 - t, 2 + t / 20, `rgba(220,220,230,${0.4 - t / 140})`); } R(g, X + 26, Y - 48, 5, 10, "#4a4a5a");
    }
    else if (st.exit && vis(st.exit.x)) {
      const X = st.exit.x + ox, Y = st.exit.y + oy, open = !st.foes.some((e) => e.t === "Z" && !e.dead);
      part(g, X, Y - 40, 32, 40, "#6a6a7a", "#16141f"); disc(g, X + 16, Y - 40, 16, "#6a6a7a"); R(g, X + 2, Y - 40, 28, 40, "#7a7a8a");
      disc(g, X + 16, Y - 36, 11, open ? "#2a1608" : "#5a3a1a"); R(g, X + 5, Y - 36, 22, 36, open ? "#2a1608" : "#7a4a22");
      if (!open) { for (let i = 0; i < 4; i++) R(g, X + 7 + i * 5, Y - 34, 1, 34, "#4a2a10"); [[9, 28], [22, 28], [9, 12], [22, 12]].forEach(([a, b]) => R(g, X + a, Y - b, 2, 2, "#c8c8d0")); }
      else { R(g, X + 8, Y - 30, 16, 30, `rgba(255,200,120,${0.25 + 0.15 * Math.sin(f / 10)})`); }
      R(g, X + 8, Y - 50, 16, 7, "#d23a3a"); R(g, X + 9, Y - 49, 14, 5, "#f0c040");
    }
    // gettoni e oggetti
    st.coins.forEach((c, i) => { if (!c.got && vis(c.x)) drawCoin(g, c.x + ox, c.y + oy, f, i); });
    st.items.forEach((it, i) => {
      if (it.got || !vis(it.x)) return; const X = it.x + ox, Y = it.y + oy + Math.round(Math.sin(f / 10 + i) * 2);
      if (st.kit === "guanti" && it.k === "h") { part(g, X - 5, Y - 2, 10, 4, "#d23a3a", "#16141f"); R(g, X - 3, Y - 2, 2, 4, "#f0f0f0"); R(g, X + 1, Y - 2, 2, 4, "#f0f0f0"); R(g, X + 3, Y + 2, 2, 4, "#d23a3a"); }
      else if (st.kit === "guanti") { R(g, X, Y, 1, 8, "#3a6a3a"); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + f / 40; R(g, X + Math.round(Math.cos(a) * 4) - 1, Y - 4 + Math.round(Math.sin(a) * 4) - 1, 3, 3, "#f8f8f0"); } R(g, X - 1, Y - 5, 3, 3, "#f0c040"); R(g, X - 10, Y - 12, 20, 20, `rgba(255,255,220,${0.08 + 0.06 * Math.sin(f / 8)})`); }
      else if (it.k === "h") { part(g, X - 4, Y - 4, 8, 8, "#a6afc2", "#16141f"); R(g, X - 4, Y - 4, 8, 2, "#e2e8f2"); R(g, X - 1, Y - 1, 2, 2, "#d23a3a"); }
      else { R(g, X - 5, Y - 8, 1, 16, "#5a3a20"); for (let k = 0; k < 9; k++) R(g, X - 4, Y - 8 + k, 9 - (k > 6 ? (k - 6) * 3 : 0) + Math.round(Math.sin(f / 5 + k / 2)), 1, k < 2 ? "#f0c040" : "#c02a3a"); R(g, X - 1, Y - 4, 3, 3, "#f0c040"); R(g, X - 10, Y - 10, 20, 20, `rgba(255,220,120,${0.08 + 0.06 * Math.sin(f / 8)})`); }
    });
    // fumo dei comignoli (corrente che spinge in alto) e tegole che si staccano
    st.vents.forEach((v, j) => { if (!vis(v.x)) return; for (let i = 0; i < 9; i++) { const p = ((f * 1.2 + i * 12.4 + j * 7) % 112), X = v.x + ox + Math.round(Math.sin(f / 14 + i * 1.7) * (2 + p / 22)), Y = v.y + oy - p, r = 2 + Math.round(p / 26); disc(g, X, Y, r, `rgba(${st.th.night ? "190,190,220" : "230,230,230"},${0.42 - p / 300})`); } });
    st.falls.forEach((t) => { if (t.st === "gone" || !vis(t.x)) return; const X = Math.round(t.x + ox + (t.st === "shake" ? (f % 4 < 2 ? -1 : 1) : 0)), Y = Math.round(t.y + oy); if (st.th.snow) { for (let k = 0; k < 12; k++) R(g, X - Math.max(0, 4 - k / 3), Y - 2 + k, Math.max(1, 8 - k * 0.66), 1, k < 3 ? "#ffffff" : "#bfe6ff"); R(g, X - 1, Y, 1, 8, "#ffffff"); return; } part(g, X - 6, Y, 12, 6, "#a0483a", "#16141f"); R(g, X - 6, Y, 12, 2, "#d07a52"); R(g, X - 2, Y + 2, 1, 3, "#5a2420"); });
    // torce a muro e campane appese (col pallone le fai suonare)
    st.torches.forEach((t, i) => { if (!vis(t.x)) return; const X = t.x + ox, Y = t.y + oy; R(g, X - 1, Y, 3, 8, "#3a2a1a"); R(g, X - 3, Y - 1, 7, 2, "#5a4a3a"); const fl = Math.abs(Math.sin(f / 4 + i)); R(g, X - 1, Y - 5 - Math.round(fl * 2), 3, 5 + Math.round(fl * 2), "#f59e0b"); R(g, X, Y - 3, 1, 3, "#fff3c0"); });
    st.bells.forEach((k) => { if (!vis(k.x)) return; const X = k.x + ox, Y = k.y + oy, a = k.sw > 0 ? Math.sin(k.sw / 4) * (k.sw / 60) * 0.6 : Math.sin(f / 40) * 0.05; for (let y = Y - 26; y < Y - 8; y += 3) R(g, X, y, 1, 2, "#5a5a70"); g.save(); g.translate(X, Y - 8); g.rotate(a); part(g, -5, 0, 10, 9, k.rung ? "#e0b040" : "#b88a3a", "#16141f"); R(g, -7, 8, 14, 3, k.rung ? "#f0c860" : "#8a6a2a"); R(g, -4, 1, 2, 6, "#ffe8a0"); disc(g, 0, 12, 2, "#5a3a1a"); g.restore(); if (!k.rung && f % 50 < 25) R(g, X - 1, Y - 34, 2, 4, "#ffe8a0"); });
    // piattaforme mobili (asse appesa a catene)
    st.movers.forEach((m) => { const X = Math.round(m.x + ox), Y = Math.round(m.y + oy); for (let i = 0; i < m.w; i += 16) g.drawImage(st.A.plank, X + i, Y, Math.min(16, m.w - i), 16); R(g, X + 4, Y - 40, 1, 40, "#3a3440"); R(g, X + m.w - 5, Y - 40, 1, 40, "#3a3440"); });
  }
  function drawBall(g, st) {
    const b = st.ball; if (b.st === "held") return; const X = Math.round(b.x - st.cam.x), Y = Math.round(b.y - st.cam.y), sq = b.squash > 0 ? 2 : 0;
    ell(g, X, Y + 1 + Math.round(sq / 2), 5 + sq, 5 - sq, "#16141f"); ell(g, X, Y + Math.round(sq / 2), 4 + sq, 4 - sq, "#c88a2a"); R(g, X - 2, Y - 3 + sq, 2, 1, "#ffe8a0"); R(g, X - 3, Y - 2 + sq, 1, 2, "#ffd060"); R(g, X + 1, Y + 1, 2, 1, "#8a5a1a");
    if (b.st === "back") for (let i = 1; i < 4; i++) R(g, X - b.vx * i * 2, Y - b.vy * i * 2, 2, 2, `rgba(255,220,140,${0.5 - i * 0.12})`);
    if (b.st === "rest" && st.f % 40 < 20) R(g, X - 1, Y - 9, 2, 2, "#ffe8a0");
  }
  // buio della cripta: si vede intorno all'eroe, alle torce, alle campane suonate e al pallone di latta (che brilla)
  let DK = null;
  function light(g, st, ox, oy) {
    DK = DK || cnv(VW, VH); const d = DK.getContext("2d"), f = st.f; d.globalCompositeOperation = "source-over"; d.clearRect(0, 0, VW, VH); d.fillStyle = `rgba(4,3,12,${st.th.lit})`; d.fillRect(0, 0, VW, VH);
    d.globalCompositeOperation = "destination-out";
    const hole = (x, y, r) => { if (x < -r || x > VW + r || y < -r || y > VH + r) return; const gr = d.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.55, "rgba(0,0,0,.85)"); gr.addColorStop(1, "rgba(0,0,0,0)"); d.fillStyle = gr; d.fillRect(x - r, y - r, r * 2, r * 2); };
    const h = st.hero; hole(h.x + ox, h.y + oy - 12, 54);
    st.torches.forEach((t, i) => hole(t.x + ox, t.y + oy - 2, 44 + Math.sin(f / 5 + i) * 3));
    st.bells.forEach((k) => hole(k.x + ox, k.y + oy, k.rung ? 52 : 16));
    st.foes.forEach((e) => { if (!e.dead && e.t === "m") hole(e.x + ox, e.y + oy + 6, 16); if (!e.dead && e.t === "Z") hole(e.x + ox, e.y + oy - e.h / 2, 70); });
    st.coins.forEach((c) => { if (!c.got) hole(c.x + ox, c.y + oy, 9); }); st.items.forEach((it) => { if (!it.got) hole(it.x + ox, it.y + oy, it.k === "S" ? 20 : 12); });
    if (st.exit) hole(st.exit.x + 16 + ox, st.exit.y - 20 + oy, 36);
    if (st.ball.st !== "held" && st.ball.st !== "none") hole(st.ball.x + ox, st.ball.y + oy, 40);
    d.globalCompositeOperation = "source-over"; g.drawImage(DK, 0, 0);
  }
  function scene(g, st) {
    g.save(); g.imageSmoothingEnabled = false;
    const sh = st.fx && st.fx.sh > 0 ? Math.round((rnd(st.f) - 0.5) * st.fx.sh) : 0; g.translate(sh, 0);
    drawLayers(g, st); drawTiles(g, st); drawObjects(g, st);
    const ox = -Math.round(st.cam.x), oy = -Math.round(st.cam.y);
    st.foes.forEach((e) => { if (!e.dead) { g.save(); g.translate(ox, oy); drawFoe(g, e, st.f); g.restore(); } });
    st.foes.forEach((e) => { if (e.dead || e.kind !== "regina" || e.st !== "aim") return; const y = (st.H - 2) * TS - SHOT_H[e.aim] + oy, x = e.x - 30 + ox, bl = st.f % 8 < 5; if (bl) { R(g, x - 3, y - 1, 8, 3, "#fde047"); R(g, x - 6, y - 3, 3, 7, "#fde047"); R(g, x - 9, y - 2, 3, 5, "#fde047"); } });
    st.stones.forEach((s) => { if (s.rig) { const X = s.x + ox, Y = s.y + oy; for (let k = 1; k < 5; k++) R(g, X - s.vx * k * 2, Y - 1, 2, 2, `rgba(${s.mine ? "245,158,11" : "220,236,255"},${0.6 - k * 0.12})`); disc(g, X, Y, 5, "#16141f"); disc(g, X, Y, 4, "#ffffff"); R(g, X - 2, Y - 1, 2, 2, s.mine ? "#f59e0b" : "#2f6b3a"); R(g, X + 1, Y + 1, 2, 2, s.mine ? "#f59e0b" : "#2f6b3a"); return; } if (s.ice) { const X = s.x + ox, Y = s.y + oy; for (let k = 0; k < 10; k++) R(g, X - Math.max(0, 4 - k / 2.5), Y - 10 + k, Math.max(1, 8 - k * 0.8), 1, k < 3 ? "#ffffff" : "#9ad0f0"); return; } if (s.snow) { const r = s.big ? 6 : 3; disc(g, s.x + ox, s.y + oy, r + 1, s.mine ? "#f59e0b" : "#5a7090"); disc(g, s.x + ox, s.y + oy, r, "#ffffff"); R(g, s.x + ox - r / 2, s.y + oy - r / 2, 1, 1, "#d8ecff"); return; } disc(g, s.x + ox, s.y + oy, 3, "#16141f"); disc(g, s.x + ox, s.y + oy, 2, "#9a9488"); });
    st.cards.forEach((c) => { R(g, c.x + ox - 3, c.y + oy - 4, 7, 9, "#16141f"); R(g, c.x + ox - 2, c.y + oy - 3, 5, 7, "#ffd820"); });
    const h = st.hero;
    if (st.level.sled) { const X = h.x + ox, Y = h.y + oy, bob = h.ground ? Math.round(Math.sin(st.f / 3)) : 0; drawFoe(g, { t: "y", x: h.x + 30 - st.cam.x, y: h.y - 18 + bob - st.cam.y, w: 14, h: 18, dir: 1, thr: 0, hitT: 0 }, st.f); R(g, X + 8, Y - 6, 18, 1, "#7a5a32"); R(g, X - 10, Y - 4, 20, 3, "#b91c1c"); R(g, X - 10, Y - 4, 20, 1, "#ef4444"); R(g, X - 11, Y - 1, 24, 1, "#5a3a20"); R(g, X + 12, Y - 3, 2, 2, "#5a3a20"); }
    if (!(h.inv > 0 && st.f % 6 < 3) || st.phase !== "play") (st.kit === "guanti" ? drawKeeper : drawFerro)(g, h.x + ox, h.y + oy, h.dir, { parry: h.parry, glide: h.glide, walk: h.ground && Math.abs(h.vx) > 0.3, air: !h.ground, hp: st.phase === "ko" ? 0 : h.hp, ball: st.ball.st === "held", hurt: h.inv > 60, frozen: h.frozen > 0, kick: h.kick, squash: Math.max(0, h.squash) }, st.f, st.o.heroLook);
    if (h.frozen > 0) { R(g, h.x + ox - 3, h.y + oy - 36, 7, 9, "#16141f"); R(g, h.x + ox - 2, h.y + oy - 35, 5, 7, "#ffd820"); }
    drawBall(g, st);
    if (st.aval && st.aval.x !== null) { const X = Math.round(st.aval.x + ox), f = st.f; if (X > -60) { R(g, -10, 0, X + 10, VH, "#eef4fa"); for (let y = 0; y < VH; y += 6) { const w = 6 + Math.round(Math.abs(Math.sin(y / 11 + f / 6)) * 10 + rnd(y + Math.floor(f / 3)) * 6); R(g, X, y, w, 6, y % 12 ? "#ffffff" : "#dce8f4"); disc(g, X + w, y + 3, 3, "#ffffff"); } for (let k = 0; k < 10; k++) { const yy = (k * 23 + f * 2) % VH; disc(g, X + 14 + rnd(k + f) * 10, yy, 2 + (k % 3), "#c8d8ea"); } R(g, 0, 0, Math.max(0, X), VH, "rgba(180,200,230,.25)"); } else R(g, 0, 0, 6, VH, `rgba(255,255,255,${0.4 + 0.3 * Math.sin(f / 5)})`); }
    st.debris.forEach((d) => R(g, d.x + ox, d.y + oy, d.s, d.s, d.c));
    st.petals.forEach((p) => { if (p.c === "rain") return R(g, p.x, p.y, 1, 5, "rgba(170,200,220,.55)"); if (p.c === "snow") return R(g, p.x, p.y, p.r, p.r, "#ffffff"); if (p.c) return R(g, p.x, p.y, 1, 1, p.c); R(g, p.x, p.y, 2, 1, "#ffb0c8"); R(g, p.x + 1, p.y + 1, 1, 1, "#ff8ab0"); });
    st.bolts.forEach((b) => { const X = Math.round(b.x + ox); if (b.t > 0) { if (b.t % 8 < 5) for (let y = 0; y < VH; y += 8) R(g, X - 1, y, 2, 4, "rgba(255,240,120,.45)"); R(g, X - 6, VH - 8, 12, 3, "rgba(255,240,120,.6)"); } else { let x = X, y = 0; g.fillStyle = "#fffbe0"; while (y < VH) { const nx = x + Math.round((rnd(y + b.x) - 0.5) * 10); for (let k = 0; k < 10; k++) g.fillRect(Math.round(x + (nx - x) * k / 10) - 1, y + k, 3, 1); x = nx; y += 10; } } });
    if (st.flash > 0 && (!st.T.back || st.level.open)) R(g, 0, 0, VW, VH, `rgba(220,235,255,${st.flash / 40})`);
    if (st.th.lit) light(g, st, ox, oy);
    // capo: barra della vita
    const boss = st.foes.find((e) => e.t === "Z" && !e.dead); if (boss) { R(g, 80, 6, 160, 6, "#16141f"); R(g, 81, 7, Math.round(158 * boss.hp / (boss.max || boss.hp)), 4, "#e04a4a"); }
    if (st.th.dark) R(g, 0, 0, VW, VH, `rgba(0,0,20,${st.th.dark})`);
    g.restore();
  }
  // ------------------------------------------------------------ interfaccia
  function css() {
    if (document.getElementById("scCss")) return; const s = document.createElement("style"); s.id = "scCss";
    s.textContent = `#scOv .top{display:flex!important;flex-direction:row!important;align-items:center;gap:6px}#scOv .top h3{flex:1;text-align:left}#scOv .top .hp{margin:0!important}
#scOv .cv canvas{image-rendering:pixelated;image-rendering:crisp-edges;height:auto!important;flex:none}
#scOv .scCtl{display:flex;justify-content:space-between;align-items:flex-end;gap:10px;user-select:none;-webkit-user-select:none;touch-action:none}
#scOv .scCtl .pad,#scOv .scCtl .act{display:flex;gap:8px}#scOv .scCtl button{width:66px;height:62px;border-radius:16px;border:2px solid rgba(255,255,255,.35);background:rgba(255,255,255,.1);color:#fff;font:900 22px system-ui;touch-action:none}
#scOv .scCtl button.on{background:rgba(255,210,90,.45)}#scOv .scCtl .k{border-color:#fbbf24;background:rgba(251,191,36,.2)}#scOv .scCtl .j{border-color:#7dd3fc;background:rgba(125,211,252,.18)}
#scOv .scEnd{display:flex;gap:6px}#scOv .scEnd button{flex:1;min-height:52px}#scOv .scSign{font-size:13px;color:#ffe9b0}
#scOv.land{overflow:hidden}#scOv.land .wr{max-width:none;padding:0;height:100%;position:relative;gap:0}#scOv.land .top{position:absolute;top:4px;right:6px;z-index:5}#scOv.land .top h3{display:none}
#scOv.land .hud{position:absolute;top:4px;left:6px;z-index:5;background:rgba(0,0,0,.45)}#scOv.land .cv{height:100%;display:flex;justify-content:center;background:#000}#scOv.land .cv canvas{height:100%!important;width:auto;max-width:100%;border:0;border-radius:0}
#scOv.land .scCtl{position:absolute;left:0;right:0;bottom:8px;padding:0 14px;pointer-events:none}#scOv.land .scCtl>*{pointer-events:auto}#scOv.land .scCtl button{background:rgba(20,15,40,.28);opacity:.85}
#scOv.land .lg{position:absolute;left:50%;transform:translateX(-50%);bottom:8px;max-width:46%;z-index:5;font-size:12px;min-height:0}#scOv.land .lg:empty{display:none}#scOv.land .bt{position:absolute;top:44px;left:50%;transform:translateX(-50%);z-index:6}`;
    document.head.appendChild(s);
  }
  function hud() {
    if (!ui || !S) return; const h = S.hero, n = S.P.ban;
    const ki = kitOf(S); ui.hud.innerHTML = `<span>${ki.hp.repeat(Math.max(0, h.hp))}<span style="opacity:.3">${ki.hp.repeat(Math.max(0, h.max - h.hp))}</span></span><span>🪙 <b>${S.coinN}</b></span>${n ? `<span>${S.kit === "guanti" ? "❄️" : "🚩"} <b>${countBits(S.banMask)}/${n}</b></span>` : ""}<span>⏱ ${Math.floor(S.time / 3600)}:${String(Math.floor(S.time / 60) % 60).padStart(2, "0")}</span>${S.practice ? "<span>· prova libera</span>" : ""}`;
  }
  function log() {
    if (!ui || !S) return; const t = S.sign ? `<span class="scSign">📜 ${esc(S.sign.t)}</span>` : S.msgT > 0 ? esc(S.msg) : "";
    if (ui.lg._t !== t) { ui.lg._t = t; ui.lg.innerHTML = t; }
  }
  function controls() {
    if (!ui || !S) return;
    if (S.phase === "play") { ui.bt.innerHTML = ""; ui.ctl.style.display = ""; return; }
    ui.ctl.style.display = "none"; keys = {};
    if (S.phase === "ko") ui.bt.innerHTML = `<div class="scEnd"><button class="go" id="scGo">↻ Riprova dal gonfalone</button><button class="go" id="scQuit" style="background:#3f3f46;border-color:#a1a1aa">◂ Esci</button></div>`;
    else ui.bt.innerHTML = `<div class="scEnd"><button class="go" id="scGo">${S.practice ? "▶ Al livello vero" : "Continua ▸"}</button></div>`;
    const go = ui.bt.querySelector("#scGo"), q = ui.bt.querySelector("#scQuit");
    if (go) go.onclick = () => { if (!S) return; if (S.phase === "ko") return respawn(S, true); if (S.practice) { const o = S.o; S = mk(o, o.level, false); hud(); controls(); return; } close(); };
    if (q) q.onclick = () => { if (S) { S.win = false; S.quit = true; close(); } };
  }
  function press(k, down) { keys[k] = !!down; }
  const KMAP = { ArrowLeft: "L", a: "L", A: "L", ArrowRight: "R", d: "R", D: "R", ArrowUp: "J", w: "J", W: "J", " ": "J", z: "J", Z: "J", x: "K", X: "K", j: "K", J: "K", k: "K", K: "K", ArrowDown: "D", s: "D", S: "D" };
  const kd = (e) => { const k = KMAP[e.key]; if (k && S) { keys[k] = true; e.preventDefault(); } }, ku = (e) => { const k = KMAP[e.key]; if (k) keys[k] = false; };
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S; if (!st) return; const o = st.o;
    window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); if (LAY) { window.removeEventListener("resize", LAY); LAY = null; }
    if (ui) ui.root.remove(); ui = null; S = null; keys = {};
    try { window.__sagaCore && window.__sagaCore.endMatch && window.__sagaCore.endMatch(); } catch (e) {}
    const ban = countBits(st.banMask);
    o.onDone && o.onDone({ a: st.coinN, b: st.win ? 0 : 1, win: !!st.win, quit: !!st.quit, coins: st.coinN, ban, banMask: st.banMask, banTot: st.P.ban, time: Math.round(st.time / 60), sponde: st.sponde });
  }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); if (!(tutC && tutC.open)) step(S); const g = ui.g; g.setTransform(SS, 0, 0, SS, 0, 0); scene(g, S); if (S.fx) S.fx.draw(g); if (S.f % 10 === 0) { hud(); log(); } }
  // livello d'allenamento per la «Prova libera»
  const PRACTICE = { id: "prova", name: "Cortile d'allenamento", theme: "prova", signs: ["⚽ calcia il pallone. Contro il muro torna indietro: è una sponda.", "Calcia il pallone a terra e saltaci sopra: fa da molla! ⚽ di nuovo per richiamarlo.", "Il mattone crepato si rompe solo col pallone."], map: [
    "##########################################",
    "#........................................#",
    "#........................................#",
    "#........................................#",
    "#...............ooo......................#",
    "#..............=====.......o.o.o.........#",
    "#........................#######.........#",
    "#........................#.....#.........#",
    "#........................#.....#....B....#",
    "#........................#.....#....B....#",
    "#.P...i.....e......i.....#..i..#....B..E.#",
    "##########################################",
    "##########################################"] };
  const PRACTICE_G = { id: "prova", name: "Il pendio d'allenamento", theme: "neve", kit: "guanti", signs: ["🧤 PARA: tocca 🧤 quando arriva una palla di neve. Al momento giusto (PARATA!) la rimandi indietro e colpisce chi l'ha tirata.", "Salta e TIENI PREMUTO ⤒ in aria: ti tuffi e plani. Così si superano i crepacci larghi.", "Il ghiaccio blu scivola: frena prima del bordo."], map: [
    "#............................................#", "#............................................#", "#............................................#", "#............................................#", "#............................................#", "#............................................#",
    "#...........ooo..............................#", "#..........=====.............................#", "#.........................o.o.o..............#", "#............................................#", "#.P..i............y...i..........i........E..#",
    "#########################.......##~~~~~~~#####", "#########################.......##############"] };
  function demo(script, map, kit) {
    const lv = { id: "demo", theme: kit ? "neve" : "mura", kit, map }, st = mk({}, lv, false); st.fx = null; return { st, script, n: 0 };
  }
  let DM = {};
  function drawDemo(key, g, mapRows, script, kit) {
    let d = DM[key]; if (!d || d.n > 360) d = DM[key] = demo(script, mapRows, kit);
    keys = script(d.n); step(d.st); d.n++;
    const off = DM._c || (DM._c = cnv(VW, VH)), og = off.getContext("2d"); scene(og, d.st);
    g.imageSmoothingEnabled = false; g.drawImage(off, 0, 7, 380, 214); keys = {};
  }
  const DMAP1 = ["....................", "....................", "....................", "....................", "....................", "....................", "........ooo.........", ".......=====........", "....................", "....................", ".P..........e.......", "####################", "####################"];
  const DMAP2 = ["....................", "....................", "....................", "....................", "....................", "....................", "....................", "..............#.....", "..............#.....", "...........s..#.....", ".P............#.....", "####################", "####################"];
  const DMAP3 = ["....................", "....................", "....................", "....................", ".........ooo........", ".........#####......", ".........#..........", ".........#..........", ".........#..........", ".........#..........", ".P.......#..........", "####################", "####################"];
  const PAGES = [
    { t: "Muoviti, salta, raccogli", p: "<b>◀ ▶</b> per camminare, <b>⤒</b> per saltare (tieni premuto per saltare più in alto). Raccogli i <b>gettoni</b>, schiaccia i nemici saltandoci sopra. Ogni colpo ti costa un <b>pezzo d'armatura</b> 🛡️: con l'ultimo resti senza elmo. I <b>gonfaloni</b> sono punti di ripartenza.", draw: (g) => drawDemo("a", g, DMAP1, (n) => ({ R: n > 10 && n < 200, J: (n > 60 && n < 80) || (n > 150 && n < 168) })) },
    { t: "Il pallone di latta", p: "<b>⚽</b> calcia il pallone. Rimbalza sui muri: se colpisce un nemico <b>di sponda</b> fa doppio danno e vale doppi gettoni. Lo <b>scudiero</b> para i tiri diretti: prendilo di sponda o alle spalle. <b>⚽</b> di nuovo e il pallone torna da te come un boomerang.", draw: (g) => drawDemo("b", g, DMAP2, (n) => ({ R: n > 5 && n < 30, K: n === 40 || n === 41 || n === 150 || n === 151 })) },
    { t: "Il pallone fa da molla", p: "Quando il pallone è fermo a terra puoi <b>saltarci sopra</b>: ti lancia molto più in alto del salto normale. Serve per i muri alti, i passaggi segreti e gli <b>stendardi</b> nascosti (3 per livello). I <b>mattoni crepati</b> si rompono solo col pallone.", draw: (g) => drawDemo("c", g, DMAP3, (n) => ({ K: n === 12 || n === 13, R: (n > 60 && n < 72) || (n > 92 && n < 140), J: n > 64 && n < 70 })) }
  ];
  const GMAP1 = ["....................", "....................", "....................", "....................", "....................", "....................", "....................", "....................", "....................", "....................", ".P...........y......", "####################", "####################"];
  const GMAP2 = ["....................", "....................", "....................", "....................", "....................", "....................", "....................", "....................", "....................", "....o.o.o.o.........", ".P#.............#...", "###.............####", "###.............####"];
  const PAGES_G = [
    { t: "Muoviti, salta, raccogli", p: "<b>◀ ▶</b> per camminare, <b>⤒</b> per saltare. Raccogli i <b>gettoni</b> e le <b>stelle alpine</b> ❄️ (3 per livello), schiaccia i nemici saltandoci sopra. Ogni colpo ti costa un pezzo: prima la <b>sciarpa</b>, poi il <b>berretto</b> 🧤. Gli <b>ometti di pietre</b> sono punti di ripartenza.", draw: (g) => drawDemo("a", g, DMAP1, (n) => ({ R: n > 10 && n < 200, J: (n > 60 && n < 80) || (n > 150 && n < 168) }), "guanti") },
    { t: "La parata", p: "<b>🧤</b> alza i guanti per un attimo. Una palla di neve parata <b>torna indietro</b> e colpisce chi l'ha tirata: è l'unico modo di ferire i capi che tirano. Se pari proprio all'ultimo istante è una <b>PARATA!</b> e vale un gettone. Coi guanti alzati puoi anche respingere chi ti viene addosso.", draw: (g) => drawDemo("b", g, GMAP1, (n) => ({ R: n > 4 && n < 14, K: n % 46 > 36 && n % 46 < 39 }), "guanti") },
    { t: "Il tuffo-planata", p: "Dopo il salto <b>tieni premuto ⤒</b>: Olmo diceva che un portiere vola solo per un secondo, ma quel secondo è suo. Cadi piano e vai lontano: così si passano i <b>crepacci</b>. Attento al <b>ghiaccio blu</b>: scivola.", draw: (g) => drawDemo("c", g, GMAP2, (n) => ({ R: n > 10 && n < 120, J: n > 30 && n < 100 }), "guanti") }
  ];
  function start(o) {
    o = o || {}; const level = o.level || (o.kit === "guanti" ? PRACTICE_G : PRACTICE);
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); css(); DM = {};
    ui = (M.shell ? M.shell("scOv", (level.kit === "guanti" ? "🏔️ " : "🏰 ") + (o.title || level.name || "A scorrimento"), "#fbbf24") : null); if (!ui) return false;
    ui.root.style.background = "#0c0818"; ui.cv.width = VW * SS; ui.cv.height = VH * SS; ui.cv.style.height = "auto"; ui.cv.style.flex = "none"; ui.g = ui.cv.getContext("2d");
    const ctl = document.createElement("div"); ctl.className = "scCtl"; const KI = KITS[level.kit || o.kit] || KITS.pallone; ctl.innerHTML = `<div class="pad"><button data-k="L" aria-label="Sinistra">◀</button><button data-k="R" aria-label="Destra">▶</button></div><div class="act"><button class="k" data-k="K" aria-label="${KI.aria}">${KI.btn}</button><button class="j" data-k="J" aria-label="Salta">⤒</button></div>`;
    ui.wr.insertBefore(ctl, ui.bt); ui.ctl = ctl;
    const x = document.createElement("button"); x.id = "scX"; x.className = "hp"; x.textContent = "✕"; x.setAttribute("aria-label", "Esci"); x.style.marginLeft = "6px"; ui.help.after(x);
    x.onclick = () => { if (S) { S.win = false; S.quit = true; close(); } };
    ctl.querySelectorAll("[data-k]").forEach((b) => { const k = b.dataset.k, up = () => { press(k, false); b.classList.remove("on"); }; b.addEventListener("pointerdown", (e) => { e.preventDefault(); safe(() => b.setPointerCapture(e.pointerId)); press(k, true); b.classList.add("on"); }); b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("lostpointercapture", up); });
    keys = {}; S = mk(o, level, false); tutC = null;
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    LAY = () => { if (ui) ui.root.classList.toggle("land", innerWidth > innerHeight * 1.15); }; window.addEventListener("resize", LAY); LAY();
    const openTut = () => { if (S && !(tutC && tutC.open) && M.tut) { const gk = S.kit === "guanti"; tutC = M.tut({ root: ui.root, key: kitOf(S).tut, pages: gk ? PAGES_G : PAGES, onClose: (pr) => { tutC = null; keys = {}; if (pr && S) { const oo = S.o; S = mk(oo, gk ? PRACTICE_G : PRACTICE, true); hud(); controls(); } } }); } };
    ui.help.onclick = openTut;
    window.__scorri.state = {
      get phase() { return S && S.phase; }, get hero() { return S && { x: S.hero.x, y: S.hero.y, vx: S.hero.vx, vy: S.hero.vy, hp: S.hero.hp, ground: S.hero.ground, frozen: S.hero.frozen }; },
      get ball() { return S && { st: S.ball.st, x: S.ball.x, y: S.ball.y, vx: S.ball.vx, vy: S.ball.vy }; }, get foes() { return S ? S.foes.filter((e) => !e.dead).length : 0; }, get coins() { return S ? S.coinN : 0; }, get ban() { return S ? countBits(S.banMask) : 0; },
      get boss() { const b = S && S.foes.find((e) => e.t === "Z"); return b ? { hp: b.hp, st: b.st, dead: b.dead, x: b.x, y: b.y, hitT: b.hitT } : null; }, get counts() { return S ? { vents: S.vents.length, falls: S.falls.length, cats: S.foes.filter((e) => e.t === "g").length, bells: S.bells.length, rung: S.bells.filter((k) => k.rung).length, gates: S.grid.reduce((a, r) => a + r.filter((t) => t === "G").length, 0), ghosts: S.foes.filter((e) => e.t === "m" && !e.dead).length, waves: S.waves.length, bolts: S.bolts.length, wind: S.windV, cards: S.cards.length } : null; }, ballAt: (x, y, vx, vy) => { if (S) { S.ball.st = "fly"; S.ball.x = x; S.ball.y = y; S.ball.vx = vx || 0; S.ball.vy = vy || 0; S.ball.t = 0; S.ball.sp = 0; } }, get practice() { return S && S.practice; }, get W() { return S && S.W; }, get kit() { return S && S.kit; }, get parries() { return S ? S.parries : 0; }, get snow() { return S ? S.stones.filter((x) => x.snow).map((x) => ({ x: x.x, y: x.y, vx: x.vx, mine: !!x.mine, big: !!x.big })) : []; }, get glide() { return !!(S && S.hero.glide); }, get aval() { return S && S.aval ? { x: S.aval.x, hits: S.aval.hits } : null; }, get crumbs() { return S ? S.crumbs.map((c) => ({ x: c.x, y: c.y, gone: c.gone })) : []; }, tileAt: (tx, ty) => (S ? tile(S, tx, ty) : null), get sled() { return !!(S && S.level.sled); }, get foeList() { return S ? S.foes.filter((e) => !e.dead).map((e) => ({ t: e.t, x: e.x, y: e.y, h: e.h, on: !!e.on })) : []; }, get parry() { return S ? S.hero.parry | 0 : 0; },
      tut: () => !!(tutC && tutC.open), press, tick: (n) => { for (let i = 0; i < (n || 1) && S; i++) step(S); }, warp: (x, y) => { if (S) { S.hero.x = x; S.hero.y = y; S.hero.vx = S.hero.vy = 0; } },
      finish: (win) => { if (!S) return; if (tutC) { tutC.close(); tutC = null; } S.win = win !== false; if (S.win) { S.items.forEach((it) => { if (it.k === "S" && win === "all") S.banMask |= 1 << it.i; }); } close(); }
    };
    if (innerHeight > innerWidth) say(S, "📱 Gira il telefono in orizzontale: a schermo pieno si gioca meglio.", 240);
    hud(); controls(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen(kitOf(S).tut))) openTut();
    return true;
  }
  window.__scorri = { start, state: null, THEMES, FOES, BOSSES, KITS, PRACTICE, PRACTICE_G, parse, _drawFerro: drawFerro };
})();
