// js/mondiale-tiles.js - tessere e pavimenti di «Ali di Rondine · Mondiale Giovanile»
// Solide: P casa italiana · Y casa colorata (Rio) · W casa a graticcio (Nord) · J edificio giapponese · T tribuna · G porta · B panchina · C cartellone · A pino · E palma · O ciliegio
//   L riflettore · M muretto · D divano · K armadietto · S trofeo · N borsone · V vetrata · U ombrellone · I torii · R roccia · F fuoco da campo
// Pavimenti: e erba rigata · l riga orizzontale · j riga verticale · x angolo · b sabbia · g pavé/asfalto · n neve · t tatami · m parquet · w piastrelle dello spogliatoio
(function () {
  "use strict";
  const rn = (a, b, k) => { const s = Math.sin(a * 127.1 + b * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const same = (K, tx, ty, c) => { const m = K.ZX.map; return !!(m[ty] && m[ty][tx] === c); };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const house = (wall, wall2, roof, roof2, win) => (K, sx, sy, tx, ty, fr) => {
    K.ground(sx, sy, tx, ty); const g = K.g, top = !same(K, tx, ty - 1, K.ZX.map[ty][tx]), bot = !same(K, tx, ty + 1, K.ZX.map[ty][tx]);
    R(g, sx, sy, 16, 16, (tx + ty) % 2 ? wall : wall2); R(g, sx, sy, 1, 16, "rgba(0,0,0,.12)");
    if (top) { R(g, sx - 1, sy, 18, 6, roof); R(g, sx - 1, sy + 4, 18, 2, roof2); for (let i = 0; i < 4; i++) R(g, sx + i * 4, sy + 1, 1, 3, "rgba(0,0,0,.25)"); }
    else if (tx % 3 === 1 && !bot) { const on = rn(tx, ty, 3) < 0.55; R(g, sx + 4, sy + 3, 8, 9, "#3a2a1a"); R(g, sx + 5, sy + 4, 6, 7, on ? win : "#475569"); R(g, sx + 7.5, sy + 4, 1, 7, "rgba(0,0,0,.4)"); R(g, sx + 3, sy + 12, 10, 2, roof2); if (on) K.glow(g, sx + 8, sy + 8, 14, "255,220,140", 0.16); }
    if (bot) R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.22)");
  };
  const tree = (kind) => (K, sx, sy, tx, ty, fr) => {
    K.ground(sx, sy, tx, ty); const g = K.g, sw = Math.sin(fr / 30 + tx) * 0.6; R(g, sx + 4, sy + 14, 8, 2, "rgba(0,0,0,.3)");
    if (kind === "pino") { R(g, sx + 7, sy + 10, 2, 6, "#5a3a22"); [[3, 10, 10], [4, 6, 8], [5, 2, 6]].forEach(([x, y, w], i) => { g.fillStyle = i % 2 ? "#14532d" : "#166534"; g.beginPath(); g.moveTo(sx + 8 + sw, sy + y - 4); g.lineTo(sx + x - 1, sy + y + 4); g.lineTo(sx + x + w + 1, sy + y + 4); g.closePath(); g.fill(); }); R(g, sx + 6, sy + 2, 4, 2, "rgba(255,255,255,.7)"); }
    else if (kind === "palma") { R(g, sx + 7, sy + 6, 2, 10, "#8a6a3e"); g.fillStyle = "#15803d"; for (let i = 0; i < 5; i++) { const a = -2.6 + i * 0.55 + sw * 0.05; g.beginPath(); g.moveTo(sx + 8, sy + 6); g.quadraticCurveTo(sx + 8 + Math.cos(a) * 8, sy + 6 + Math.sin(a) * 8 - 3, sx + 8 + Math.cos(a) * 11, sy + 6 + Math.sin(a) * 9 + 2); g.lineTo(sx + 8 + Math.cos(a) * 8, sy + 8 + Math.sin(a) * 6); g.closePath(); g.fill(); } R(g, sx + 6, sy + 7, 2, 2, "#92400e"); R(g, sx + 9, sy + 8, 2, 2, "#92400e"); }
    else { R(g, sx + 7, sy + 9, 2, 7, "#4a2c1a"); [["#f9a8d4", 8, 6, 7], ["#fbcfe8", 5, 7, 5], ["#f472b6", 11, 7, 5]].forEach(([c, x, y, r]) => { g.fillStyle = c; g.beginPath(); g.arc(sx + x + sw, sy + y, r, 0, 7); g.fill(); }); if (rn(tx, ty, 2) < 0.5) R(g, sx + 4 + ((fr >> 3) % 8), sy + 12 + ((fr >> 4) % 3), 1, 1, "#fbcfe8"); }
  };
  const paint = {
    P: house("#e2c48a", "#d8b97c", "#b45309", "#7c2d12", "rgba(253,224,140,.95)"),
    Y: (K, sx, sy, tx, ty, fr) => house(["#fde047", "#fb7185", "#38bdf8", "#4ade80", "#fb923c"][(tx >> 1) % 5], ["#facc15", "#f43f5e", "#0ea5e9", "#22c55e", "#f97316"][(tx >> 1) % 5], "#e5e7eb", "#9ca3af", "rgba(255,246,170,.95)")(K, sx, sy, tx, ty, fr),
    W: (K, sx, sy, tx, ty, fr) => { house("#d6c7ae", "#cdbd9e", "#e5eef4", "#94a3b8", "rgba(253,224,140,.95)")(K, sx, sy, tx, ty, fr); R(K.g, sx, sy + 7, 16, 1, "#4a2c1a"); R(K.g, sx + 7, sy + 4, 1, 12, "#4a2c1a"); R(K.g, sx - 1, sy, 18, 2, "rgba(255,255,255,.85)"); },
    J: (K, sx, sy, tx, ty, fr) => {
      K.ground(sx, sy, tx, ty); const g = K.g, top = !same(K, tx, ty - 1, "J"), bot = !same(K, tx, ty + 1, "J");
      R(g, sx, sy, 16, 16, "#3a2a22"); R(g, sx, sy, 16, 1, "#1f1612");
      if (top) { g.fillStyle = "#27303f"; g.beginPath(); g.moveTo(sx - 2, sy + 6); g.quadraticCurveTo(sx + 8, sy - 2, sx + 18, sy + 6); g.lineTo(sx + 18, sy + 8); g.lineTo(sx - 2, sy + 8); g.fill(); R(g, sx - 1, sy + 7, 18, 1, "#9ca3af"); }
      else if (!bot || tx % 2) { R(g, sx + 2, sy + 3, 12, 10, "#f5ecd0"); R(g, sx + 2, sy + 3, 12, 1, "#2a1a10"); R(g, sx + 7.5, sy + 3, 1, 10, "#2a1a10"); R(g, sx + 2, sy + 8, 12, 1, "#2a1a10"); if (rn(tx, ty, 5) < 0.5) K.glow(g, sx + 8, sy + 8, 14, "255,200,120", 0.2); }
      if (!top && rn(tx, ty, 8) < 0.3) { R(g, sx + 6, sy + 11, 4, 5, "#dc2626"); R(g, sx + 7, sy + 10, 2, 1, "#111"); K.glow(g, sx + 8, sy + 13, 12, "255,80,60", 0.25 + 0.1 * Math.sin(fr / 14)); }
    },
    T(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy, 16, 16, "#374151"); R(g, sx, sy + 7, 16, 1, "#1f2937"); const cs = ["#1d4ed8", "#f8fafc", "#16a34a", "#dc2626", "#facc15"]; for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) { const c = cs[Math.floor(rn(tx + i, ty + r, 3) * 5)], b = Math.sin(fr / 10 + i + tx + r) * 0.8; R(g, sx + 1 + i * 4, sy + 2 + r * 7 + b, 3, 3, c); R(g, sx + 1 + i * 4, sy + 1 + r * 7 + b, 3, 1.5, "#f1c8a0"); } },
    G(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 14, 16, 2, "rgba(0,0,0,.25)"); R(g, sx + 1, sy + 1, 14, 2, "#f8fafc"); R(g, sx + 1, sy + 1, 2, 14, "#f8fafc"); R(g, sx + 13, sy + 1, 2, 14, "#f8fafc"); g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 1; for (let i = 3; i < 14; i += 3) { g.beginPath(); g.moveTo(sx + i, sy + 3); g.lineTo(sx + i, sy + 15); g.stroke(); g.beginPath(); g.moveTo(sx + 3, sy + i); g.lineTo(sx + 13, sy + i); g.stroke(); } },
    B(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 14, 16, 2, "rgba(0,0,0,.25)"); R(g, sx + 1, sy + 4, 14, 3, "#1d4ed8"); R(g, sx + 1, sy + 9, 14, 3, "#e5e7eb"); R(g, sx + 2, sy + 11, 2, 4, "#374151"); R(g, sx + 12, sy + 11, 2, 4, "#374151"); R(g, sx + 1, sy + 2, 14, 2, "rgba(255,255,255,.25)"); },
    C(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, c = [["#dc2626", "#fff"], ["#1d4ed8", "#fde047"], ["#16a34a", "#fff"], ["#7c3aed", "#fde047"]][(tx >> 1) % 4]; R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); R(g, sx, sy + 3, 16, 9, c[0]); R(g, sx, sy + 3, 16, 1, "rgba(255,255,255,.35)"); R(g, sx + 3, sy + 6, 10, 1.5, c[1]); R(g, sx + 3, sy + 9, 6, 1.5, c[1]); R(g, sx + 1, sy + 12, 2, 4, "#374151"); R(g, sx + 13, sy + 12, 2, 4, "#374151"); },
    A: tree("pino"), E: tree("palma"), O: tree("ciliegio"),
    L(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 7, sy + 2, 2, 14, "#374151"); R(g, sx + 3, sy - 2, 10, 5, "#1f2937"); R(g, sx + 4, sy - 1, 8, 3, "#fef9c3"); K.glow(g, sx + 8, sy + 1, 22, "255,240,180", 0.35 + 0.05 * Math.sin(fr / 20)); },
    M(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 8, 16, 2, "#9ca3af"); R(g, sx, sy + 12, 16, 2, "#9ca3af"); for (let i = 0; i < 4; i++) R(g, sx + 1 + i * 4, sy + 5, 2, 10, "#6b7280"); R(g, sx, sy + 4, 16, 1.5, "#d1d5db"); },
    D(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 14, 16, 2, "rgba(0,0,0,.25)"); R(g, sx + 1, sy + 4, 14, 10, "#1e3a8a"); R(g, sx + 2, sy + 8, 12, 5, "#2563eb"); R(g, sx + 1, sy + 4, 14, 2, "#172554"); R(g, sx + 1, sy + 4, 3, 10, "#172554"); R(g, sx + 12, sy + 4, 3, 10, "#172554"); },
    K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 1, sy + 1, 14, 15, "#475569"); R(g, sx + 2, sy + 2, 5.5, 13, "#64748b"); R(g, sx + 8.5, sy + 2, 5.5, 13, "#64748b"); R(g, sx + 6, sy + 8, 1, 2, "#e2e8f0"); R(g, sx + 9, sy + 8, 1, 2, "#e2e8f0"); R(g, sx + 3, sy + 4, 3, 1, "#1e293b"); R(g, sx + 10, sy + 4, 3, 1, "#1e293b"); },
    S(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 3, sy + 12, 10, 4, "#78350f"); R(g, sx + 5, sy + 10, 6, 3, "#a16207"); R(g, sx + 6, sy + 4, 4, 7, "#facc15"); g.fillStyle = "#facc15"; g.beginPath(); g.arc(sx + 8, sy + 4, 4, 0, 7); g.fill(); R(g, sx + 4, sy + 3, 8, 2, "#fde047"); K.glow(g, sx + 8, sy + 6, 16, "255,230,120", 0.25 + 0.08 * Math.sin(fr / 12)); },
    N(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 1, sy + 14, 14, 2, "rgba(0,0,0,.25)"); R(g, sx + 1, sy + 6, 14, 9, ["#1d4ed8", "#dc2626", "#15803d"][(tx + ty) % 3]); R(g, sx + 1, sy + 6, 14, 2, "rgba(255,255,255,.25)"); R(g, sx + 4, sy + 4, 8, 2, "#1f2937"); R(g, sx + 6, sy + 9, 4, 3, "#f8fafc"); },
    V(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 2, 16, 14, "#334155"); R(g, sx + 1, sy + 3, 14, 12, "rgba(147,197,253,.5)"); R(g, sx + 7.5, sy + 3, 1, 12, "#334155"); R(g, sx + 2, sy + 4, 3, 9, "rgba(255,255,255,.22)"); if (rn(tx, ty, 4) < 0.4) K.glow(g, sx + 8, sy + 9, 14, "253,224,140", 0.15); },
    U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, c = ["#dc2626", "#2563eb", "#facc15", "#16a34a"][(tx + ty) % 4]; R(g, sx + 7, sy + 5, 2, 11, "#92400e"); g.fillStyle = c; g.beginPath(); g.moveTo(sx, sy + 8); g.quadraticCurveTo(sx + 8, sy - 4, sx + 16, sy + 8); g.closePath(); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(sx + 5, sy + 8); g.quadraticCurveTo(sx + 8, sy - 2, sx + 11, sy + 8); g.closePath(); g.fill(); R(g, sx + 2, sy + 14, 12, 2, "rgba(0,0,0,.2)"); },
    I(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 2, sy + 5, 2.5, 11, "#b91c1c"); R(g, sx + 11.5, sy + 5, 2.5, 11, "#b91c1c"); R(g, sx, sy + 2, 16, 2.5, "#7f1d1d"); R(g, sx + 1, sy + 5, 14, 1.5, "#b91c1c"); g.fillStyle = "#7f1d1d"; g.beginPath(); g.moveTo(sx - 1, sy + 2); g.lineTo(sx + 1, sy); g.lineTo(sx + 15, sy); g.lineTo(sx + 17, sy + 2); g.fill(); R(g, sx + 6, sy + 6, 4, 3, "#fde047"); K.glow(g, sx + 8, sy + 8, 14, "255,200,100", 0.15); },
    R(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 1, sy + 14, 14, 2, "rgba(0,0,0,.25)"); g.fillStyle = "#6b7280"; g.beginPath(); g.moveTo(sx + 1, sy + 14); g.lineTo(sx + 4, sy + 5); g.lineTo(sx + 9, sy + 3); g.lineTo(sx + 14, sy + 9); g.lineTo(sx + 15, sy + 14); g.closePath(); g.fill(); R(g, sx + 4, sy + 5, 5, 2, "#9ca3af"); R(g, sx + 3, sy + 3.5, 8, 1.5, "rgba(255,255,255,.8)"); },
    Z(K, sx, sy, tx, ty, fr) {
      const g = K.g; R(g, sx, sy, 16, 16, (tx + ty) % 2 ? "#0b78b8" : "#0a6fa8"); const o = (fr / 3 + tx * 5 + ty * 3) % 16; R(g, sx + o - 4, sy + 4 + (ty % 2) * 6, 6, 1, "rgba(255,255,255,.35)"); R(g, sx + ((o + 8) % 16) - 4, sy + 11, 5, 1, "rgba(255,255,255,.22)");
      if (!same(K, tx, ty - 1, "Z")) { R(g, sx, sy, 16, 3, "rgba(255,255,255,.55)"); R(g, sx + ((fr >> 3) + tx * 3) % 14, sy + 3, 3, 1, "rgba(255,255,255,.4)"); }
    },
    // cumulo di neve (nascondiglio dalle guardie, si attraversa)
    h(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(sx + 8, sy + 13, 7, 2.5, 0, 0, 7); g.fill(); g.fillStyle = "#f8fafc"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 7, 5, 0, Math.PI, 0); g.lineTo(sx + 15, sy + 13); g.lineTo(sx + 1, sy + 13); g.fill(); g.fillStyle = "#cbd5e1"; g.fillRect(sx + 3, sy + 11, 10, 2); g.fillStyle = "#2f5a2a"; g.fillRect(sx + 5, sy + 6, 1.5, 3); g.fillRect(sx + 9, sy + 7, 1.5, 3); },
    F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 3, sy + 12, 10, 3, "#3a2a1a"); R(g, sx + 4, sy + 11, 8, 2, "#5a3a22"); for (let i = 0; i < 3; i++) { g.fillStyle = ["#ff7a2a", "#ffc233", "#ff4a1a"][i]; const h = 5 + Math.sin(fr / 4 + i * 2) * 2; g.beginPath(); g.moveTo(sx + 4 + i * 3, sy + 11); g.lineTo(sx + 6 + i * 2, sy + 11 - h); g.lineTo(sx + 8 + i * 3, sy + 11); g.fill(); } K.glow(g, sx + 8, sy + 8, 24, "255,150,60", 0.3); }
  };
  function floorPaint(K, f, sx, sy, tx, ty) {
    const P = K.P, fr = Math.floor(performance.now() / 16), st = (tx % 2 ? 0 : 1);
    if (f === "e" || f === "l" || f === "j" || f === "x") {
      P(sx, sy, 16, 16, st ? "#2f8a3f" : "#37994a"); if (rn(tx, ty, 1) < 0.2) P(sx + 3 + Math.floor(rn(tx, ty, 3) * 9), sy + 4 + Math.floor(rn(tx, ty, 5) * 8), 1, 2, "rgba(255,255,255,.12)");
      const ln = "rgba(255,255,255,.88)"; if (f === "l" || f === "x") P(sx, sy + 7, 16, 2, ln); if (f === "j" || f === "x") P(sx + 7, sy, 2, 16, ln); return true;
    }
    if (f === "b") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#f1d9a0" : "#ecd093"); for (let i = 0; i < 3; i++) P(sx + Math.floor(rn(tx, ty, i) * 14), sy + Math.floor(rn(tx, ty, i + 4) * 14), 1, 1, "rgba(160,110,50,.35)"); if (rn(tx, ty, 8) < 0.05) P(sx + 5, sy + 5, 3, 2, "#fb7185"); return true; }
    if (f === "g") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#6b7280" : "#656b78"); P(sx, sy, 16, 1, "rgba(0,0,0,.22)"); P(sx + (ty % 2 ? 0 : 8), sy, 1, 16, "rgba(0,0,0,.15)"); if (rn(tx, ty, 3) < 0.08) P(sx + 4, sy + 6, 6, 1, "rgba(255,255,255,.1)"); return true; }
    if (f === "n") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e6eef5" : "#dde8f1"); for (let i = 0; i < 3; i++) P(sx + Math.floor(rn(tx, ty, i) * 14), sy + Math.floor(rn(tx, ty, i + 4) * 14), 2, 1, "rgba(120,150,190,.3)"); if (rn(tx, ty, 9) < 0.08) P(sx + 3, sy + 6, 5, 3, "rgba(255,255,255,.9)"); return true; }
    if (f === "t") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#cdbf8c" : "#c4b680"); P(sx, sy, 16, 1, "#5a6b3a"); P(sx, sy + 8, 16, 1, "rgba(90,80,40,.3)"); for (let i = 0; i < 4; i++) P(sx + i * 4, sy + 1, 1, 7, "rgba(90,80,40,.22)"); return true; }
    if (f === "m") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8a5a34" : "#7d5030"); P(sx, sy + 5, 16, 1, "rgba(0,0,0,.28)"); P(sx, sy + 11, 16, 1, "rgba(0,0,0,.28)"); P(sx + ((ty * 7) % 16), sy, 1, 5, "rgba(0,0,0,.2)"); return true; }
    if (f === "w") { const d = (tx + ty) % 2; P(sx, sy, 16, 16, d ? "#d5dde6" : "#c4cfda"); P(sx, sy, 16, 1, "rgba(0,0,0,.14)"); P(sx, sy, 1, 16, "rgba(0,0,0,.14)"); if (rn(tx, ty, 2) < 0.08) P(sx + 4, sy + 6, 7, 3, "rgba(30,64,175,.12)"); return true; }
    return false;
  }
  window.__mgTiles = { paint, floorPaint };
})();
