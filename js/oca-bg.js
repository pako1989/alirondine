// js/oca-bg.js - sfondi di «IL GIOCO DELL'OCA DEL CONTE» (320x200), animati, con i punti da toccare: titolo, il parco (giorno, tramonto, notte, alba),
// salone del testamento, cucina, Locanda, serra e seduta, capanno, cantina, il prato della partita, il labirinto, la cappella, il ricordo del '72, lo studio e i quattro finali.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const TXT = (g, t, x, y, sz, c, al) => { g.save(); g.font = `800 ${sz}px Georgia, serif`; g.textAlign = al || "center"; g.fillStyle = "rgba(0,0,0,.5)"; g.fillText(t, x + 1, y + 1); g.fillStyle = c; g.fillText(t, x, y); g.restore(); };
  const SKY = { giorno: ["#7dd3fc", "#e0f2fe"], sera: ["#7c2d12", "#fdba74"], notte: ["#0b1026", "#1e293b"], alba: ["#c4b5fd", "#fde68a"], seppia: ["#5b4630", "#c9b48a"] };
  const GRASS = { giorno: ["#4d8a3c", "#3f7a31"], sera: ["#556b2f", "#3f4f22"], notte: ["#1c3324", "#13261a"], alba: ["#5b8a4a", "#466f39"], seppia: ["#7a6a4c", "#5f533b"] };
  function sky(g, W, f, m, h) {
    const s = SKY[m] || SKY.giorno; VG(g, 0, h || 110, s[0], s[1]); g.fillRect(0, 0, W, h || 110);
    if (m === "notte") { for (let i = 0; i < 50; i++) R(g, rnd(i + 3) * W, rnd(i + 20) * 80, 1, 1, `rgba(255,255,255,${0.3 + 0.35 * Math.sin(f / 18 + i)})`); C(g, 262, 26, 11, "#fef9c3"); C(g, 266, 23, 10, s[0]); GL(g, 262, 26, 40, "254,249,195", 0.18); }
    else if (m === "sera") { C(g, 250, 88, 18, "#fb923c"); GL(g, 250, 88, 70, "251,146,60", 0.35); }
    else if (m === "alba") { C(g, 60, 96, 14, "#fef3c7"); GL(g, 60, 96, 60, "254,243,199", 0.4); }
    else if (m === "giorno") { C(g, 280, 22, 10, "#fef9c3"); GL(g, 280, 22, 40, "254,249,195", 0.3); }
    for (let i = 0; i < 4; i++) { const x = ((rnd(i) * 360 + f * (0.08 + i * 0.03)) % 400) - 40, y = 14 + i * 13; const c = m === "notte" ? "rgba(148,163,184,.12)" : m === "sera" ? "rgba(254,215,170,.45)" : "rgba(255,255,255,.6)"; E(g, x, y, 22, 5, c); E(g, x + 14, y - 3, 14, 5, c); }
  }
  function grass(g, W, y, m, H) { const c = GRASS[m] || GRASS.giorno; VG(g, y, H || 200, c[0], c[1]); g.fillRect(0, y, W, (H || 200) - y); for (let i = 0; i < 60; i++) R(g, rnd(i + 7) * W, y + rnd(i + 40) * ((H || 200) - y), 1, 2, "rgba(255,255,255,.08)"); }
  function cypress(g, x, y, h, m) { const c = m === "notte" ? "#0b1f14" : m === "sera" ? "#1f2d14" : "#14401c"; T(g, [x, y - h, x + 7, y - h * 0.3, x + 5, y, x - 5, y, x - 7, y - h * 0.3], c); R(g, x - 1, y, 2, 3, "#3f2a1a"); }
  function hedge(g, x, y, w, h, m) { const c = m === "notte" ? "#132a1c" : m === "sera" ? "#2f4a1c" : "#2d6a2a"; R(g, x, y, w, h, c); for (let i = 0; i < w; i += 4) C(g, x + i + 2, y, 3, c); R(g, x, y + h - 2, w, 2, "rgba(0,0,0,.25)"); }
  // la villa: facciata ocra, tetto, finestre, porta, terrazza coi limoni. lit = finestre accese
  function villa(g, x, y, w, h, m, f, lit) {
    const wall = m === "notte" ? "#5b4a33" : m === "sera" ? "#c2773a" : m === "seppia" ? "#a8916a" : "#e3b773";
    T(g, [x - 6, y, x + w / 2, y - 22, x + w + 6, y], m === "notte" ? "#3b1d14" : "#9a3412"); R(g, x - 6, y - 1, w + 12, 3, "#7c2d12");
    R(g, x, y, w, h, wall); for (let i = 0; i < 6; i++) R(g, x, y + 6 + i * 7, w, 1, "rgba(0,0,0,.05)");
    R(g, x, y + h - 4, w, 4, "rgba(0,0,0,.18)");
    const cols = Math.max(3, Math.floor(w / 22)); for (let i = 0; i < cols; i++) for (let j = 0; j < 2; j++) { const wx = x + 8 + i * ((w - 16) / cols), wy = y + 6 + j * (h / 2 - 2), on = lit && rnd(i * 7 + j) > 0.35; R(g, wx, wy, 10, 13, "#3f2a1a"); R(g, wx + 1, wy + 1, 8, 11, on ? `rgba(253,224,71,${0.75 + 0.15 * Math.sin(f / 20 + i)})` : m === "notte" ? "#1e293b" : "#7dd3fc"); R(g, wx + 4.5, wy + 1, 1, 11, "#3f2a1a"); R(g, wx - 2, wy, 2, 13, "#14532d"); R(g, wx + 10, wy, 2, 13, "#14532d"); if (on) GL(g, wx + 5, wy + 6, 16, "253,224,71", 0.25); }
    const dx = x + w / 2 - 8; R(g, dx, y + h - 22, 16, 22, "#57340f"); R(g, dx + 2, y + h - 20, 5, 18, "#7c4a1a"); R(g, dx + 9, y + h - 20, 5, 18, "#7c4a1a"); T(g, [dx - 3, y + h - 22, dx + 8, y + h - 30, dx + 19, y + h - 22], "#f5f5f4");
    [x + 6, x + w - 14].forEach((lx) => { R(g, lx, y + h - 6, 8, 6, "#b45309"); C(g, lx + 4, y + h - 10, 6, "#166534"); C(g, lx + 2, y + h - 11, 1.5, "#facc15"); C(g, lx + 6, y + h - 9, 1.5, "#facc15"); });
  }
  // il tabellone dipinto sul viale, in prospettiva: caselle a spirale schiacciate
  function board(g, cx, cy, f, m, n) {
    const dark = m === "notte"; for (let i = 0; i < (n || 40); i++) { const a = i * 0.42, r = 70 - i * 1.5, x = cx + Math.cos(a) * r * 1.6, y = cy + Math.sin(a) * r * 0.45; const oca = [5, 9, 14, 18, 23, 27, 32, 36].includes(i);
      E(g, x, y, 7, 3, dark ? (oca ? "#57534e" : "#3f3a33") : oca ? "#f1ead6" : i % 2 ? "#e9dcc0" : "#d6c3a0"); if (oca) C(g, x, y - 1, 1.3, "#f59e0b"); }
    E(g, cx, cy, 12, 5, dark ? "#a16207" : "#fde68a"); TXT(g, "63", cx, cy + 2, 6, dark ? "#fef3c7" : "#7c2d12");
  }
  function goose(g, x, y, f, k, s, boss) { g.save(); g.translate(x, y); s = s || 1; g.scale(s, s); const b = Math.sin(f / 7 + k) * 1.2, st = Math.sin(f / 5 + k) > 0.7 ? 1 : 0;
    E(g, 0, 6, 7, 2, "rgba(0,0,0,.2)"); E(g, 0, 0, 7, 5, "#f8fafc"); E(g, -5, -1, 3, 2, "#e2e8f0"); g.strokeStyle = "#f8fafc"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(4, -1); g.quadraticCurveTo(7, -4, 6, -9 + b); g.stroke(); C(g, 6.5, -9 + b, 2.3, "#f8fafc");
    R(g, 8, -10 + b, 3.2, 1.6, "#f59e0b"); R(g, 6.5, -10.5 + b, 1, 1, "#111"); R(g, -1, 5, 1, 3 - st, "#f59e0b"); R(g, 2, 5, 1, 3, "#f59e0b"); if (boss) R(g, 3, -5 + b, 5, 1.6, "#dc2626"); g.restore(); }
  function lantern(g, x, y, f, k) { R(g, x, y, 1, 22, "#292524"); R(g, x - 3, y - 6, 7, 7, "#44403c"); R(g, x - 2, y - 5, 5, 5, `rgba(253,186,116,${0.8 + 0.2 * Math.sin(f / 6 + k)})`); GL(g, x, y - 3, 26, "253,186,116", 0.35 + 0.08 * Math.sin(f / 7 + k)); }
  function fountain(g, x, y, f, m) { E(g, x, y + 6, 30, 8, "#a8a29e"); E(g, x, y + 4, 27, 6, m === "notte" ? "#1e3a5f" : "#38bdf8"); for (let i = 0; i < 6; i++) E(g, x - 18 + i * 7, y + 4 + Math.sin(f / 9 + i) * 0.6, 3, 0.8, "rgba(255,255,255,.4)"); R(g, x - 3, y - 14, 6, 18, "#d6d3d1"); goose(g, x, y - 18, f, 3, 1.2); for (let i = 0; i < 9; i++) { const t = ((f * 0.04 + i / 9) % 1); C(g, x + 9 + t * 12, y - 22 + t * t * 26, 1, "rgba(186,230,253,.8)"); } }
  // interni: parete, pavimento a scacchi o legno, battiscopa
  function room(g, W, H, wall, floor, y, chess) { VG(g, 0, y, wall[0], wall[1]); g.fillRect(0, 0, W, y); for (let i = 0; i < W; i += 40) R(g, i, 0, 1, y, "rgba(0,0,0,.06)"); R(g, 0, y - 4, W, 4, "#3f2a1a");
    for (let j = 0; y + j * 10 < H; j++) for (let i = 0; i < 18; i++) { const x0 = 160 + (i - 9) * (18 + j * 6), c = chess ? ((i + j) % 2 ? floor[0] : floor[1]) : (j % 2 ? floor[0] : floor[1]); R(g, x0, y + j * 10, 18 + j * 6, 10, c); } }
  function portrait(g, x, y, w, h, f, m) { R(g, x - 3, y - 3, w + 6, h + 6, "#a16207"); R(g, x - 1, y - 1, w + 2, h + 2, "#713f12"); VG(g, y, y + h, "#44403c", "#1c1917"); g.fillRect(x, y, w, h);
    C(g, x + w / 2, y + h * 0.38, w * 0.22, m === "seppia" ? "#c9a77a" : "#e8c4a0"); R(g, x + w * 0.3, y + h * 0.42, w * 0.4, 2, "#e7e5e4"); R(g, x + w * 0.22, y + h * 0.6, w * 0.56, h * 0.4, "#7f1d1d"); R(g, x + w * 0.36, y + h * 0.24, w * 0.28, 2, "#f5f5f4"); R(g, x + w * 0.4, y + h * 0.36, 2, 2, "#111"); R(g, x + w * 0.56, y + h * 0.36, 2, 2, "#111"); GL(g, x + w / 2, y + h / 2, w, "253,224,71", 0.06 + 0.03 * Math.sin(f / 30)); }
  function windowPane(g, x, y, w, h, m, f) { R(g, x - 2, y - 2, w + 4, h + 4, "#57340f"); const s = SKY[m] || SKY.giorno; VG(g, y, y + h, s[0], s[1]); g.fillRect(x, y, w, h); if (m === "notte") C(g, x + w * 0.7, y + h * 0.3, 4, "#fef9c3"); R(g, x + w / 2 - 1, y, 2, h, "#57340f"); R(g, x, y + h / 2 - 1, w, 2, "#57340f"); R(g, x - 4, y + h + 2, w + 8, 3, "#78350f"); }
  function candle(g, x, y, f, k) { R(g, x - 1.5, y, 3, 9, "#fef3c7"); const fl = 2 + Math.sin(f / 4 + k) * 0.6; T(g, [x - 1.4, y, x, y - 3 - fl, x + 1.4, y], "#fbbf24"); GL(g, x, y - 2, 18, "253,224,71", 0.35); }
  function pawn(g, x, y, c) { E(g, x, y + 5, 4, 1.6, "rgba(0,0,0,.3)"); T(g, [x - 3.5, y + 5, x, y - 3, x + 3.5, y + 5], c); C(g, x, y - 4, 2.4, c); }
  function figure(g, x, y, f, k, body, head, hat) { const b = Math.sin(f / 10 + k) * 0.8; E(g, x, y + 22, 7, 2, "rgba(0,0,0,.25)"); R(g, x - 5, y + b, 10, 16, body); R(g, x - 4, y + 16, 3, 6, "#292524"); R(g, x + 1, y + 16, 3, 6, "#292524"); C(g, x, y - 4 + b, 4.5, head); if (hat) R(g, x - 5, y - 9 + b, 10, 3, hat); }

  const SC = {
    oc_titolo(g, W, H, f) {
      sky(g, W, f, "sera", 120); villa(g, 80, 50, 160, 50, "sera", f, true); [[40, 104], [62, 104], [258, 104], [280, 104]].forEach(([x, y]) => cypress(g, x, y, 46, "sera"));
      grass(g, W, 100, "sera"); board(g, 160, 150, f, "sera", 40); for (let i = 0; i < 5; i++) goose(g, 40 + ((i * 63 + f * 0.25) % 260), 176 + (i % 2) * 8, f, i, 1.1, i === 2);
      [[120, 142, "#1e293b"], [146, 150, "#b91c1c"], [178, 146, "#7c3aed"], [200, 156, "#f5f5f4"], [134, 162, "#0369a1"], [190, 168, "#15803d"], [160, 136, "#fbbf24"]].forEach(([x, y, c]) => pawn(g, x, y, c));
      R(g, 54, 10, 212, 34, "rgba(41,24,8,.78)"); g.strokeStyle = "#fbbf24"; g.strokeRect(56.5, 12.5, 207, 29); TXT(g, "IL GIOCO DELL'OCA", 160, 27, 14, "#fde68a"); TXT(g, "DEL CONTE", 160, 39, 9, "#fef3c7"); VIG(g, W, H, 0.45);
    },
    oc_parco(g, W, H, f) { parcoScene(g, W, H, f, "giorno"); },
    oc_parco_sera(g, W, H, f) { parcoScene(g, W, H, f, "sera"); },
    oc_notte(g, W, H, f) { parcoScene(g, W, H, f, "notte"); },
    oc_parco_alba(g, W, H, f) { parcoScene(g, W, H, f, "alba"); },
    oc_salone(g, W, H, f) {
      room(g, W, H, ["#7f1d1d", "#5b1414"], ["#e7e5e4", "#a8a29e"], 120, true); for (let i = 0; i < W; i += 32) { R(g, i + 4, 10, 24, 96, "rgba(254,243,199,.06)"); R(g, i + 4, 10, 24, 1, "#a16207"); }
      portrait(g, 140, 16, 40, 52, f, "giorno"); windowPane(g, 34, 26, 40, 56, "giorno", f); windowPane(g, 246, 26, 40, 56, "giorno", f);
      R(g, 270, 82, 46, 38, "#57534e"); R(g, 276, 92, 34, 28, "#1c1917"); for (let i = 0; i < 5; i++) T(g, [280 + i * 6, 118, 283 + i * 6, 104 - Math.sin(f / 5 + i) * 4, 286 + i * 6, 118], i % 2 ? "#f97316" : "#fbbf24"); GL(g, 293, 110, 40, "249,115,22", 0.3);
      R(g, 50, 132, 220, 14, "#57340f"); R(g, 50, 132, 220, 3, "#7c4a1a"); R(g, 56, 146, 4, 26, "#3f2a1a"); R(g, 260, 146, 4, 26, "#3f2a1a");
      for (let i = 0; i < 7; i++) { R(g, 64 + i * 30, 118, 12, 14, "#7f1d1d"); R(g, 64 + i * 30, 128, 12, 3, "#991b1b"); R(g, 66 + i * 30, 133, 8, 2, "#fef3c7"); }
      R(g, 140, 128, 40, 4, "#fef3c7"); TXT(g, "TESTAMENTO", 160, 131, 4, "#7c2d12"); candle(g, 100, 122, f, 1); candle(g, 220, 122, f, 2); VIG(g, W, H, 0.45);
    },
    oc_cucina(g, W, H, f) {
      room(g, W, H, ["#fef3c7", "#fde68a"], ["#b45309", "#92400e"], 118, true); for (let i = 0; i < W; i += 10) for (let j = 60; j < 114; j += 10) R(g, i, j, 9, 9, (i / 10 + j / 10) % 2 ? "#f1f5f9" : "#cbd5e1");
      windowPane(g, 130, 14, 60, 40, "giorno", f); R(g, 20, 70, 90, 44, "#44403c"); R(g, 26, 66, 78, 6, "#1c1917"); for (let i = 0; i < 3; i++) { C(g, 40 + i * 25, 68, 6, "#78716c"); }
      R(g, 34, 46, 24, 20, "#a8a29e"); R(g, 32, 44, 28, 4, "#78716c"); for (let i = 0; i < 4; i++) { const t = (f * 0.02 + i / 4) % 1; E(g, 46 + Math.sin(f / 15 + i) * 4, 40 - t * 34, 6 + t * 6, 4, `rgba(255,255,255,${0.35 * (1 - t)})`); }
      R(g, 210, 20, 90, 4, "#78350f"); for (let i = 0; i < 6; i++) { C(g, 218 + i * 14, 30, 5, ["#ef4444", "#f8fafc", "#3b82f6", "#facc15", "#22c55e", "#a855f7"][i]); }
      R(g, 200, 130, 100, 12, "#e7e5e4"); R(g, 206, 142, 4, 30, "#57534e"); R(g, 290, 142, 4, 30, "#57534e"); E(g, 236, 128, 12, 4, "#78350f"); R(g, 262, 120, 3, 10, "#fbbf24"); C(g, 280, 126, 5, "#fef3c7"); goose(g, 160, 180, f, 1, 0.9); VIG(g, W, H, 0.35);
    },
    oc_locanda(g, W, H, f) {
      room(g, W, H, ["#78350f", "#451a03"], ["#57340f", "#3f2a1a"], 110, false); windowPane(g, 136, 16, 48, 44, "sera", f); portrait(g, 40, 20, 30, 40, f); portrait(g, 250, 20, 30, 40, f);
      R(g, 30, 128, 260, 16, "#7c2d12"); R(g, 30, 128, 260, 3, "#9a3412"); R(g, 30, 131, 260, 2, "#f5f5f4");
      for (let i = 0; i < 7; i++) { const x = 48 + i * 36; E(g, x, 128, 9, 3, "#f5f5f4"); E(g, x, 127, 5, 1.6, "#fbbf24"); figure(g, x, 100, f, i, ["#1e293b", "#f5f5f4", "#7c3aed", "#b91c1c", "#0369a1", "#15803d", "#1f5fbf"][i], "#e0b48a"); }
      R(g, 156, 112, 8, 16, "#450a0a"); R(g, 158, 106, 4, 6, "#450a0a"); R(g, 156, 118, 8, 5, "#fef3c7"); E(g, 120, 128, 14, 5, "#a8a29e"); for (let i = 0; i < 3; i++) E(g, 120 + Math.sin(f / 9 + i) * 3, 120 - ((f * 0.4 + i * 9) % 26), 4, 2, "rgba(255,255,255,.25)");
      candle(g, 92, 120, f, 1); candle(g, 228, 120, f, 2); R(g, 140, 64, 40, 4, "#a16207"); TXT(g, "LOCANDA · 19", 160, 76, 7, "#fde68a"); VIG(g, W, H, 0.5);
    },
    oc_serra(g, W, H, f) { serraScene(g, W, H, f, false); },
    oc_seduta(g, W, H, f) { serraScene(g, W, H, f, true); },
    oc_capanno(g, W, H, f) {
      room(g, W, H, ["#78350f", "#57340f"], ["#78716c", "#57534e"], 120, false); for (let i = 0; i < W; i += 14) R(g, i, 0, 1, 118, "rgba(0,0,0,.25)"); windowPane(g, 220, 24, 44, 34, "giorno", f);
      R(g, 20, 30, 120, 3, "#3f2a1a"); [["#a8a29e", 30], ["#d6d3d1", 52], ["#78716c", 74], ["#a8a29e", 96], ["#e7e5e4", 118]].forEach(([c, x], i) => { R(g, x, 33, 2, 30 - i * 3, "#57340f"); T(g, [x - 4, 63 - i * 3, x + 6, 63 - i * 3, x + 1, 72 - i * 3], c); });
      R(g, 30, 120, 110, 12, "#57340f"); for (let i = 0; i < 6; i++) { R(g, 40 + i * 16, 104, 10, 16, "#b45309"); C(g, 45 + i * 16, 102, 6, "#166534"); }
      R(g, 190, 118, 90, 10, "#78350f"); R(g, 200, 110, 24, 8, "#e7e5e4"); TXT(g, "U.P.", 212, 117, 4, "#7c2d12"); R(g, 236, 106, 30, 12, "#a16207"); R(g, 236, 106, 30, 3, "#facc15"); R(g, 246, 98, 10, 8, "#4d7c0f"); goose(g, 160, 168, f, 2, 1.1); VIG(g, W, H, 0.45);
    },
    oc_cantina(g, W, H, f) {
      VG(g, 0, H, "#1c1917", "#0c0a09"); g.fillRect(0, 0, W, H); for (let j = 0; j < 12; j++) for (let i = 0; i < 18; i++) R(g, i * 20 + (j % 2) * 10, j * 12, 19, 11, rnd(i + j * 30) > 0.5 ? "#292524" : "#1f1b18");
      T(g, [0, 0, 320, 0, 300, 30, 20, 30], "#0c0a09"); for (let i = 0; i < 4; i++) { const x = 30 + i * 74; E(g, x + 20, 132, 26, 22, "#57340f"); E(g, x + 20, 132, 22, 18, "#78350f"); R(g, x - 4, 128, 48, 2, "#292524"); R(g, x - 4, 138, 48, 2, "#292524"); C(g, x + 20, 132, 4, "#3f2a1a"); }
      R(g, 250, 110, 50, 44, "#57340f"); TXT(g, "'71", 275, 135, 9, "#fbbf24"); R(g, 20, 40, 60, 60, "#292524"); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) R(g, 24 + i * 14, 44 + j * 18, 10, 14, ["#7f1d1d", "#14532d", "#1e3a8a", "#451a03"][(i + j) % 4]);
      R(g, 40, 104, 30, 6, "#1e3a8a"); TXT(g, "RONDINESE 71-72", 56, 109, 3, "#f8fafc");
      R(g, 159, 0, 1, 40, "#44403c"); C(g, 160, 44, 5, `rgba(253,224,71,${0.7 + 0.2 * Math.sin(f / 13)})`); GL(g, 160, 44, 90, "253,224,71", 0.22 + 0.05 * Math.sin(f / 11));
      g.strokeStyle = "rgba(226,232,240,.25)"; g.lineWidth = 0.6; for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(k * 0.22) * 40, Math.sin(k * 0.22) * 40); g.stroke(); } VIG(g, W, H, 0.6);
    },
    oc_prato(g, W, H, f) {
      sky(g, W, f, "sera", 80); villa(g, 60, 34, 200, 46, "sera", f, true); grass(g, W, 80, "sera"); for (let i = 0; i < 8; i++) R(g, 0, 80 + i * 15, W, 15, i % 2 ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)");
      [[30, 150], [62, 150], [258, 150], [290, 150]].forEach(([x, y]) => { R(g, x - 7, y, 14, 12, "#b45309"); C(g, x, y - 4, 9, "#166534"); C(g, x - 3, y - 6, 2, "#facc15"); C(g, x + 4, y - 2, 2, "#facc15"); });
      g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1; g.beginPath(); g.ellipse(160, 140, 30, 9, 0, 0, 7); g.stroke(); R(g, 159, 90, 1, 110, "rgba(255,255,255,.5)");
      const bx = 160 + Math.sin(f / 40) * 80, by = 150 + Math.cos(f / 25) * 16; E(g, bx, by + 5, 4, 1.5, "rgba(0,0,0,.3)"); C(g, bx, by - Math.abs(Math.sin(f / 9)) * 8, 3.5, "#f8fafc"); C(g, bx + 1, by - Math.abs(Math.sin(f / 9)) * 8, 1.4, "#111");
      for (let i = 0; i < 4; i++) goose(g, 90 + i * 48 + Math.sin(f / 50 + i) * 10, 170 + (i % 2) * 10, f, i, 1, i === 1); figure(g, 110, 118, f, 1, "#b91c1c", "#c8956a"); figure(g, 214, 118, f, 2, "#15803d", "#f1c9a5"); VIG(g, W, H, 0.4);
    },
    oc_labirinto(g, W, H, f) {
      sky(g, W, f, "notte", 70); grass(g, W, 60, "notte"); for (let j = 0; j < 5; j++) { const y = 66 + j * 26, s = 0.6 + j * 0.18; for (let i = 0; i < 6; i++) if (rnd(i + j * 9) > 0.3) hedge(g, i * 58 - 10 + (j % 2) * 24, y, 44 * s, 14 * s, "notte"); }
      board(g, 160, 186, f, "notte", 16); lantern(g, 60, 150, f, 1); lantern(g, 262, 150, f, 2); lantern(g, 160, 120, f, 3); R(g, 150, 166, 20, 8, "rgba(41,24,8,.8)"); TXT(g, "42", 160, 172, 6, "#fde68a");
      goose(g, 230, 180, f, 1, 1); pawn(g, 150, 182, "#fbbf24"); pawn(g, 172, 184, "#1e293b"); VIG(g, W, H, 0.55);
    },
    oc_cappella(g, W, H, f) {
      VG(g, 0, H, "#292524", "#0c0a09"); g.fillRect(0, 0, W, H); T(g, [100, 0, 160, -30, 220, 0, 220, 120, 100, 120], "#3a332d"); R(g, 150, 20, 20, 50, "#1c1917"); T(g, [150, 20, 160, 8, 170, 20], "#1c1917"); for (let i = 0; i < 3; i++) R(g, 152 + i * 6, 22, 4, 46, ["#1e3a8a", "#7f1d1d", "#14532d"][i] + "");
      GL(g, 160, 44, 40, "147,197,253", 0.08); R(g, 120, 96, 80, 24, "#57534e"); R(g, 116, 92, 88, 6, "#78716c"); R(g, 150, 84, 20, 8, "#1e3a8a"); candle(g, 128, 84, f, 1); candle(g, 192, 84, f, 2);
      portrait(g, 34, 30, 30, 40, f); for (let i = 0; i < 3; i++) { R(g, 20, 130 + i * 20, 90, 6, "#57340f"); R(g, 20, 136 + i * 20, 4, 10, "#3f2a1a"); R(g, 106, 136 + i * 20, 4, 10, "#3f2a1a"); }
      R(g, 220, 70, 100, 130, "#44403c"); for (let i = 0; i < 6; i++) R(g, 224 + i * 16, 70, 3, 130, "#1c1917"); R(g, 228, 74, 88, 1, "#1c1917"); R(g, 236, 160, 60, 10, "#57534e"); R(g, 236, 156, 60, 4, "#a8a29e");
      g.fillStyle = "rgba(231,229,228,.35)"; for (let i = 0; i < 70; i++) R(g, 250 + (i % 12) * 5, 90 + Math.floor(i / 12) * 8, 0.8, 5, "rgba(231,229,228,.4)"); R(g, 255, 76, 20, 6, "#dc2626"); TXT(g, "1972", 290, 84, 6, "#f87171"); VIG(g, W, H, 0.55);
    },
    oc_ricordo(g, W, H, f) {
      VG(g, 0, H, "#5b4630", "#2b2116"); g.fillRect(0, 0, W, H); R(g, 0, 120, W, 80, "#3d3122"); for (let i = 0; i < 9; i++) R(g, 40 + i * 30, 30, 3, 100, "#2b2116"); R(g, 36, 30, 250, 4, "#2b2116");
      R(g, 60, 130, 90, 14, "#6b5a40"); R(g, 64, 126, 82, 4, "#8c7656"); figure(g, 100, 100, f, 1, "#5b4630", "#c9a77a"); R(g, 92, 115, 16, 4, "#e9dcc0");
      for (let i = 0; i < 90; i++) R(g, 190 + (i % 15) * 6, 46 + Math.floor(i / 15) * 12, 1, 7, "rgba(233,220,192,.55)"); candle(g, 160, 120, f, 1);
      figure(g, 260, 140, f, 2, "#8c7656", "#c9a77a"); R(g, 254, 142, 12, 10, "#e9dcc0"); TXT(g, "PORTA NEBBIA · 1972", 160, 188, 8, "#e9dcc0");
      for (let i = 0; i < 160; i++) R(g, rnd(i + f % 7) * W, rnd(i * 3 + (f % 5)) * H, 1, 1, "rgba(0,0,0,.25)"); R(g, 0, 0, W, H, `rgba(91,70,48,${0.12 + 0.04 * Math.sin(f / 7)})`); VIG(g, W, H, 0.7);
    },
    oc_studio(g, W, H, f) {
      room(g, W, H, ["#14532d", "#052e16"], ["#7c4a1a", "#57340f"], 118, false); windowPane(g, 200, 18, 70, 60, "alba", f); for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) R(g, 16 + i * 14, 20 + j * 22, 12, 20, ["#7f1d1d", "#1e3a8a", "#a16207", "#14532d", "#f5f5f4"][(i * 3 + j) % 5]);
      R(g, 12, 18, 74, 2, "#3f2a1a"); R(g, 110, 36, 40, 50, "#f5f5f4"); R(g, 110, 36, 40, 10, "#dc2626"); TXT(g, "14", 130, 70, 18, "#111"); TXT(g, "MARZO", 130, 44, 6, "#f8fafc");
      R(g, 70, 128, 180, 14, "#57340f"); R(g, 70, 128, 180, 3, "#7c4a1a"); R(g, 76, 142, 6, 30, "#3f2a1a"); R(g, 238, 142, 6, 30, "#3f2a1a");
      R(g, 130, 118, 36, 14, "#fef3c7"); C(g, 148, 125, 5, "#dc2626"); goose(g, 148, 126, f, 1, 0.35); E(g, 210, 124, 24, 6, "#e9dcc0"); for (let i = 0; i < 7; i++) pawn(g, 196 + i * 4, 120 - (i % 2), ["#1e293b", "#f5f5f4", "#7c3aed", "#b91c1c", "#0369a1", "#15803d", "#fbbf24"][i]);
      GL(g, 235, 50, 90, "254,243,199", 0.2 + 0.05 * Math.sin(f / 30)); for (let i = 0; i < 12; i++) { const t = (f * 0.002 + rnd(i)) % 1; R(g, 200 + rnd(i + 4) * 90, 60 + t * 120, 1, 1, "rgba(254,243,199,.5)"); } VIG(g, W, H, 0.4);
    },
    oc_villa(g, W, H, f) {
      sky(g, W, f, "giorno", 110); villa(g, 50, 46, 220, 60, "giorno", f, false); grass(g, W, 106, "giorno"); fountain(g, 160, 150, f, "giorno");
      R(g, 30, 160, 80, 4, "#78350f"); R(g, 210, 160, 80, 4, "#78350f"); [["#1e293b", 40], ["#f5f5f4", 60], ["#7c3aed", 84], ["#b91c1c", 226], ["#0369a1", 250], ["#15803d", 274]].forEach(([c, x], i) => figure(g, x, 134, f, i, c, "#e0b48a"));
      for (let i = 0; i < 4; i++) goose(g, 120 + i * 30 + Math.sin(f / 30 + i) * 6, 188, f, i, 1); R(g, 130, 166, 60, 3, "#fef3c7"); TXT(g, "DOMENICA · PRANZO", 160, 26, 8, "#7c2d12"); VIG(g, W, H, 0.3);
    },
    oc_notaio(g, W, H, f) {
      VG(g, 0, 110, "#94a3b8", "#cbd5e1"); g.fillRect(0, 0, W, 110); for (let i = 0; i < 5; i++) { const x = 20 + i * 62; R(g, x, 30, 48, 80, "#e2e8f0"); for (let a = 0; a < 3; a++) for (let b = 0; b < 6; b++) R(g, x + 6 + a * 14, 36 + b * 12, 8, 8, rnd(i * 20 + a + b * 3) > 0.5 ? "#64748b" : "#94a3b8"); }
      R(g, 0, 110, W, 90, "#a8a29e"); for (let i = 0; i < 8; i++) R(g, i * 44, 150, 30, 4, "#fbbf24"); R(g, 90, 112, 140, 24, "#1e293b"); TXT(g, "RESIDENZA LE OCHE", 160, 124, 9, "#fde68a"); TXT(g, "63 BILOCALI · VENDESI", 160, 133, 5, "#f8fafc"); goose(g, 160, 104, f, 1, 1.4, true);
      R(g, 260, 140, 6, 50, "#f59e0b"); T(g, [266, 140, 300, 120 + Math.sin(f / 20) * 3, 300, 126 + Math.sin(f / 20) * 3, 266, 146], "#facc15"); figure(g, 60, 160, f, 1, "#1e293b", "#f1c9a5"); R(g, 66, 166, 10, 7, "#f8fafc");
      for (let i = 0; i < 3; i++) goose(g, 120 + ((i * 50 + f * 0.4) % 160), 186, f, i, 0.9); VIG(g, W, H, 0.4);
    },
    oc_63(g, W, H, f) {
      sky(g, W, f, "alba", 90); villa(g, 70, 40, 180, 50, "alba", f, false); grass(g, W, 90, "alba"); board(g, 160, 150, f, "alba", 40);
      E(g, 160, 150, 22, 8, "#fbbf24"); TXT(g, "63", 160, 154, 12, "#7c2d12"); GL(g, 160, 150, 70, "253,224,71", 0.25 + 0.1 * Math.sin(f / 10)); goose(g, 160, 136, f, 0, 1.4, true);
      R(g, 186, 160, 26, 16, "#fef3c7"); C(g, 199, 168, 4, "#dc2626"); for (let i = 0; i < 12; i++) { const t = (f * 0.01 + rnd(i)) % 1; C(g, 160 + Math.cos(i) * t * 120, 150 - t * 100 + Math.sin(i) * 20, 1.4, ["#fbbf24", "#f8fafc", "#fca5a5"][i % 3]); } VIG(g, W, H, 0.3);
    },
    oc_bara(g, W, H, f) {
      sky(g, W, f, "alba", 90); villa(g, 70, 40, 180, 50, "alba", f, false); grass(g, W, 90, "alba"); board(g, 160, 160, f, "alba", 30);
      for (let i = 0; i < 7; i++) { const x = 124 + i * 12; R(g, x - 4, 150, 8, 8, "#f8fafc"); C(g, x, 154, 1, "#111"); GL(g, x, 154, 10, "255,255,255", 0.2); }
      figure(g, 160, 104, f, 0, "#7f1d1d", "#e8c4a0"); R(g, 156, 98 + Math.sin(f / 10), 8, 2, "#f5f5f4"); const ox = 182 + Math.sin(f / 25) * 4; E(g, ox, 120, 8, 6, "#e7e5e4"); R(g, ox - 6, 108, 12, 3, "#4d7c0f");
      figure(g, 120, 108, f, 1, "#f8fafc", "#e0ac7e"); R(g, 126, 102 - Math.abs(Math.sin(f / 8)) * 4, 2, 12, "#78716c"); TXT(g, "IL CONTE BARA ANCORA", 160, 26, 10, "#7c2d12");
      for (let i = 0; i < 4; i++) goose(g, 40 + i * 76, 186, f, i, 1); VIG(g, W, H, 0.3);
    }
  };
  function parcoScene(g, W, H, f, m) {
    sky(g, W, f, m, 100); villa(g, 70, 46, 180, 50, m, f, m === "notte" || m === "sera");
    [[26, 96], [48, 96], [272, 96], [294, 96]].forEach(([x, y]) => cypress(g, x, y, 44, m)); grass(g, W, 96, m);
    hedge(g, 0, 104, 60, 12, m); hedge(g, 260, 104, 60, 12, m); board(g, 160, 148, f, m, 40);
    if (m === "notte") { lantern(g, 92, 118, f, 1); lantern(g, 228, 118, f, 2); lantern(g, 60, 150, f, 3); lantern(g, 260, 150, f, 4); R(g, 290, 100, 26, 30, "#292524"); T(g, [288, 100, 303, 86, 318, 100], "#1c1917"); R(g, 300, 110, 6, 8, `rgba(253,224,71,${0.6 + 0.3 * Math.sin(f / 8)})`); }
    if (m === "alba") for (let i = 0; i < 18; i++) { const x = rnd(i) * W, y = 120 + rnd(i + 3) * 70; R(g, x, y, 1, 1, `rgba(255,255,255,${0.4 + 0.4 * Math.sin(f / 12 + i)})`); }
    for (let i = 0; i < 4; i++) goose(g, 30 + ((i * 81 + f * 0.2 * (i % 2 ? 1 : -1) + 320) % 280), 172 + (i % 2) * 12, f, i, 1, i === 2);
    VIG(g, W, H, m === "notte" ? 0.6 : 0.35);
  }
  function serraScene(g, W, H, f, night) {
    const m = night ? "notte" : "giorno"; sky(g, W, f, m, 200);
    g.strokeStyle = night ? "rgba(148,163,184,.35)" : "rgba(255,255,255,.6)"; g.lineWidth = 2; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 40, 0); g.lineTo(i * 40, 130); g.stroke(); } for (let j = 0; j < 4; j++) { g.beginPath(); g.moveTo(0, 20 + j * 34); g.lineTo(W, 20 + j * 34); g.stroke(); }
    R(g, 0, 120, W, 80, night ? "#292524" : "#a8a29e"); for (let i = 0; i < 16; i++) R(g, i * 20, 120, 19, 80, i % 2 ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.04)");
    [[30, 120, 40], [280, 120, 46], [90, 130, 26], [240, 132, 24]].forEach(([x, y, h], i) => { R(g, x - 8, y, 16, 12, "#b45309"); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.4 + Math.sin(f / 30 + i + k) * 0.05; g.strokeStyle = night ? "#14532d" : "#16a34a"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * h * 0.5, y + Math.sin(a) * h * 0.8, x + Math.cos(a) * h, y + Math.sin(a) * h * 0.6 + 10); g.stroke(); } });
    E(g, 160, 150, 40, 10, "#581c87"); R(g, 156, 152, 8, 24, "#3b0764"); C(g, 160, 136, 10, "rgba(186,230,253,.55)"); const fx = 160 + Math.sin(f / 15) * 5; E(g, fx, 138, 3, 1.6, "#f97316");
    if (night) { candle(g, 136, 140, f, 1); figure(g, 196, 116, f, 1, "#7c3aed", "#efcfb0"); R(g, 190, 106, 12, 4, "#1c1917"); for (let i = 0; i < 4; i++) { const t = (f * 0.006 + i / 4) % 1; GL(g, 160 + Math.sin(f / 20 + i * 2) * 60, 130 - t * 90, 16, "196,181,253", 0.18 * (1 - t)); } if (Math.sin(f / 40) > 0.85) R(g, 288, 40, 10, 6, "#4d7c0f"); }
    else { R(g, 120, 110, 30, 6, "#57340f"); for (let i = 0; i < 6; i++) R(g, 124 + i * 4, 104, 3, 6, "#7c3aed"); goose(g, 70, 182, f, 1, 1); }
    VIG(g, W, H, night ? 0.6 : 0.3);
  }
  const HOT = {
    oc_titolo: [[80, 28, 160, 72, "🏛️ Villa Pastrocchi. Diciotto stanze, un parco, una cappella e un testamento che si gioca a dadi."], [100, 120, 120, 60, "🎲 Il tabellone sul viale: sessantatré caselle dipinte dal Conte in persona, nel 1969, con la vernice delle porte."], [20, 160, 280, 40, "🪿 Le oche del parco. Hanno diritto di passaggio su ogni casella. Anche sulla 58."]],
    oc_parco: [[70, 28, 180, 70, "🏛️ La villa. Il Conte la chiamava «la mia casella 6»: quella col ponte, che ti fa saltare avanti."], [90, 120, 140, 60, "🎲 Il tabellone. Ogni casella è grande come un tavolino. Le oche ci dormono sopra, d'estate."], [0, 160, 320, 40, "🪿 Le oche. Teresa, quella col nastro rosso, comanda. Le altre fingono di no."]],
    oc_parco_sera: [[70, 28, 180, 70, "🍝 La villa al tramonto. Dalla cucina esce un profumo di brodo e di rosmarino."], [200, 60, 120, 50, "🌅 Il sole cala dietro i cipressi. Il Conte diceva che il tramonto è la casella 63 del giorno."], [90, 120, 140, 60, "🎲 Il tabellone al tramonto. Le caselle sembrano monete."]],
    oc_notte: [[80, 96, 160, 40, "🏮 Le lanterne lungo il viale. Clausola del Conte: «la Prigione si raggiunge al buio»."], [280, 90, 40, 40, "⛪ La cappella in fondo al parco. Una candela accesa dietro la grata."], [240, 6, 50, 40, "🌙 La luna sopra il labirinto. Le oche non dormono: borbottano."]],
    oc_parco_alba: [[70, 28, 180, 70, "🌄 La villa all'alba. Le finestre dello studio sono aperte, per la prima volta dal funerale."], [90, 120, 140, 60, "💧 Il tabellone bagnato di rugiada. Le pedine sono tutte alla 52."], [0, 160, 320, 40, "🪿 Le oche sono tutte sul tabellone. Come se aspettassero anche loro."]],
    oc_salone: [[140, 16, 40, 52, "🖼️ Il Conte Ugolino Pastrocchi, 1938-20…. La data di morte è lasciata in bianco. L'ha voluto lui."], [270, 82, 46, 38, "🔥 Il camino acceso anche a maggio. Il Conte aveva freddo sempre, da quando era tornato."], [50, 116, 220, 30, "📜 Il tavolo del testamento. Sette sedie: sei eredi e «il Giocatore»."]],
    oc_cucina: [[20, 40, 90, 74, "🍲 Il brodo. Non si spegne mai, «come il Conte, che non si spegneva neanche a dormire»."], [210, 20, 90, 20, "☕ Tazze spaiate, una per erede. Su quella di Arrigo c'è scritto «NON PRESTARE»."], [130, 14, 60, 40, "🪟 Dalla finestra si vede l'orto, il pozzo e, più in là, la cappella."]],
    oc_locanda: [[30, 90, 260, 54, "🍽️ Sette coperti. Chi è in Locanda cena in villa: regola del Conte."], [150, 100, 20, 30, "🍷 La bottiglia del '71: «per quando torno»."], [40, 20, 30, 40, "🖼️ Ritratti di famiglia. Uno ha la faccia girata verso il muro. Nessuno ricorda chi sia."]],
    oc_serra: [[130, 130, 60, 40, "🔮 Il tavolino di velluto di Madame Ofelia, con la sfera col pesciolino rosso."], [0, 100, 110, 50, "🌿 Palme e felci. Ofelia dice che sono felci medianiche. Sono felci."], [0, 0, 320, 100, "🪟 La vetrata della serra. Di giorno ci batte il sole, di notte la luna."]],
    oc_seduta: [[130, 120, 60, 50, "🕯️ Una candela e la sfera. Il pesciolino nuota in cerchio, nervoso."], [180, 100, 40, 50, "🔮 Madame Ofelia, occhi chiusi, mani aperte. Le previsioni sono sicure al cinquanta per cento."], [270, 20, 50, 60, "👒 Fuori dalla vetrata, per un attimo, un cappello da giardiniere."]],
    oc_capanno: [[20, 28, 120, 46, "✂️ Gli attrezzi di Teo, appesi in ordine di altezza. Le cesoie le affila col righello."], [190, 100, 90, 30, "🗃️ Il banco di Teo. Uno straccio con le iniziali «U.P.». Sono le iniziali di qualcun altro."], [30, 100, 110, 30, "🌱 Talee di limone. Teo dice che i limoni del Conte non muoiono mai."]],
    oc_cantina: [[250, 110, 50, 44, "🍷 «NON APRIRE PRIMA DEL '71». La botte più vecchia della cantina."], [20, 40, 60, 74, "📘 Uno scaffale di bottiglie e un registro blu: «U.S. Rondinese 1971-72»."], [140, 20, 40, 50, "💡 La lampadina si accende da sola. Teo dice che è un sensore. Ernestina dice che è il Conte."]],
    oc_prato: [[20, 136, 60, 30, "🍋 Le porte: due vasi di limoni. Regolamentari, dice Tonio."], [80, 160, 160, 40, "🪿 Le oche in campo. Se il pallone le prende, rimbalza. Usale come sponda."], [60, 30, 200, 50, "🏛️ Dalla finestra della cucina, Ernestina fa il tifo. Per chi, non si capisce."]],
    oc_labirinto: [[0, 60, 320, 80, "🌿 Il labirinto di siepi. Il Conte ci si perdeva apposta, dicono, per farsi cercare."], [140, 160, 40, 30, "🎲 La 42, il Labirinto: chi ci cade torna alla 33."], [40, 120, 40, 40, "🏮 Lanterne. Gilda segna le posizioni con una torcia in bocca."]],
    oc_cappella: [[220, 70, 100, 130, "⛓️ La cella. Tre metri per due. Una copia esatta di quella di Porta Nebbia."], [116, 80, 88, 40, "🕯️ L'altare. Al posto del Vangelo, un registro e una scatola di latta."], [34, 30, 30, 40, "🖼️ Il ritratto del Conte giovane, presidente della Rondinese."]],
    oc_ricordo: [[60, 90, 90, 50, "🛏️ Una branda. Una candela. Un chiodo di una cassetta."], [180, 40, 100, 80, "✏️ Le tacche sul muro. Una al giorno, per tre anni."], [240, 120, 40, 50, "✉️ Una lettera scritta a lume di candela. Non sarà mai spedita."]],
    oc_studio: [[110, 36, 40, 50, "📅 Il calendario fermo al 14 marzo. Qualcuno lo rimette a posto ogni volta."], [180, 110, 60, 20, "♟️ Un tabellone in miniatura con sette pedine. La settima, bianca, dice «il neutrale»."], [200, 18, 70, 60, "🪟 Dalla finestra dello studio si vede tutto il tabellone. Dall'alto si capisce chi bara."]],
    oc_villa: [[30, 120, 260, 50, "👨‍👩‍👧‍👦 Sei eredi, una villa. Il primo pranzo della domenica è finito senza morti."], [130, 120, 60, 50, "⛲ La fontana dell'oca. Ora ci fanno il bagno i nipoti di Tonio."], [50, 20, 220, 80, "🏛️ Villa Pastrocchi. Abitata. Rumorosa. Viva."]],
    oc_notaio: [[90, 112, 140, 24, "🏗️ «Residenza Le Oche». Sessantatré bilocali."], [140, 80, 40, 30, "🪿 Le oche, almeno, restano: sono nel logo."], [250, 120, 60, 70, "🏗️ La gru. Dove c'era il labirinto, adesso c'è un parcheggio."]],
    oc_63: [[130, 130, 60, 40, "🏁 La casella 63. La fine del gioco. O l'inizio, diceva il Conte."], [180, 156, 40, 24, "📨 La Busta 63, con l'oca di ceralacca."], [70, 20, 180, 70, "🏛️ La villa all'alba. Il ritratto del Conte, adesso, sta in cucina."]],
    oc_bara: [[110, 140, 100, 24, "🎲 Sette dadi d'avorio. Sette su sette."], [150, 90, 40, 40, "🎩 Il Conte Ugolino Pastrocchi. Vivo. E piuttosto in forma."], [110, 90, 30, 40, "🥄 Ernestina col mestolo. Prima glielo tira. Poi lo abbraccia."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
