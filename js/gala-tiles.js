// js/gala-tiles.js - tessere e pavimenti di «Il Rapimento del Pallone d'Oro»: facciata, siepe, fontana, tavola, camino, libreria, pianoforte, ping-pong, fornelli, botti, statua, divano, scrivania
(function () {
  "use strict";
  const TS = 16;
  const rn = (a, b, k) => { const s = Math.sin(a * 127.1 + b * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const same = (K, tx, ty, c) => { const m = K.ZX.map; return !!(m[ty] && m[ty][tx] === c); };
  const paint = {
    // facciata della villa: intonaco crema, finestre accese a ritmo, cornicione
    P(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g, top = !same(K, tx, ty - 1, "P"), bot = !same(K, tx, ty + 1, "P");
      g.fillStyle = (tx + ty) % 2 ? "#e6dbbb" : "#e0d4b2"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.07)"; g.fillRect(sx, sy, 1, 16);
      if (tx % 3 === 1 && !top && !bot || (tx % 3 === 1 && ty % 4 === 1)) { g.fillStyle = "#5b3a1e"; g.fillRect(sx + 2, sy + 1, 12, 14); g.fillStyle = rn(tx, ty, 3) < 0.7 ? "rgba(253,224,140,.92)" : "#243447"; g.fillRect(sx + 3, sy + 2, 10, 12); g.fillStyle = "#5b3a1e"; g.fillRect(sx + 7, sy + 2, 1, 12); g.fillRect(sx + 3, sy + 7, 10, 1); if (rn(tx, ty, 3) < 0.7) K.light(sx + 8, sy + 8, 30, "253,224,140", 0.18); }
      if (top) { g.fillStyle = "#8c3b2a"; g.fillRect(sx, sy, 16, 5); g.fillStyle = "#a94a36"; g.fillRect(sx, sy + 4, 16, 1.5); }
      if (bot) { g.fillStyle = "#b9a57a"; g.fillRect(sx, sy + 13, 16, 3); }
    },
    // siepe potata
    S(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#0f3a1e"; g.fillRect(sx, sy + 1, 16, 15); g.fillStyle = "#14502a"; g.fillRect(sx + 1, sy, 14, 6); for (let i = 0; i < 6; i++) { g.fillStyle = rn(tx, ty, i) < 0.5 ? "#1c6b36" : "#0b2d17"; g.fillRect(sx + Math.floor(rn(tx, ty, i + 9) * 13), sy + Math.floor(rn(tx, ty, i + 20) * 13) + 1, 2, 2); } g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 13, 16, 3); },
    // fontana con getto d'acqua animato
    F(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#9c9686"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 8, 5.5, 0, 0, 7); g.fill(); g.fillStyle = "#3b82a8"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 6.5, 4, 0, 0, 7); g.fill(); g.fillStyle = "#cbd5e1"; g.fillRect(sx + 7, sy + 3, 2, 7);
      K.later((g2, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy + 4; for (let i = 0; i < 5; i++) { const t = ((fr * 0.06 + i / 5) % 1); g2.fillStyle = `rgba(200,230,255,${0.8 * (1 - t)})`; g2.fillRect(x - 3 + (i - 2) * 1.5 * t * 2 + Math.sin(i) * 0.6, y - 6 + t * 10 - Math.sin(t * 3.14) * 6, 1.6, 1.6); } });
    },
    // tavola apparecchiata: tovaglia, piatti, candele
    T(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 3); g.fillStyle = "#f4efe3"; g.fillRect(sx, sy + 3, 16, 11); g.fillStyle = "#c9b98c"; g.fillRect(sx, sy + 12, 16, 2);
      g.fillStyle = "#fff"; g.beginPath(); g.arc(sx + 4, sy + 8, 2.3, 0, 7); g.arc(sx + 12, sy + 8, 2.3, 0, 7); g.fill(); g.fillStyle = "#b91c1c"; g.fillRect(sx + 7, sy + 5, 2, 5); g.fillStyle = "#fde68a"; g.fillRect(sx + 7.4, sy + 3.5, 1.2, 1.8);
      K.glow(g, sx + 8, sy + 4, 12, "255,200,110", 0.22 + 0.05 * Math.sin(fr / 6 + tx));
    },
    // il posto d'onore a tavola: come la tavola, con tovagliolo dorato e sedia
    X(K, sx, sy, tx, ty, fr) { paint.T(K, sx, sy, tx, ty, fr); const g = K.g; g.fillStyle = "#d4a73a"; g.fillRect(sx + 6, sy + 6, 4, 3); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 4, sy + 11, 8, 4); },
    // credenza / bancone in legno scuro
    D(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#4a2a14"; g.fillRect(sx, sy + 3, 16, 12); g.fillStyle = "#7a4a22"; g.fillRect(sx, sy + 3, 16, 2); g.fillStyle = "#2b180b"; g.fillRect(sx + 1, sy + 6, 6, 8); g.fillRect(sx + 9, sy + 6, 6, 8); g.fillStyle = "#d4a73a"; g.fillRect(sx + 6, sy + 9, 1, 2); g.fillRect(sx + 9, sy + 9, 1, 2); g.fillStyle = "#a3d4e8"; g.fillRect(sx + 3, sy, 2, 4); g.fillStyle = "#be123c"; g.fillRect(sx + 10, sy + 1, 2, 3); },
    // camino acceso
    H(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3a2a22"; g.fillRect(sx, sy - 2, 16, 18); g.fillStyle = "#1a0f0a"; g.fillRect(sx + 3, sy + 3, 10, 12); g.fillStyle = "#6b4c3a"; g.fillRect(sx + 1, sy, 14, 3);
      for (let i = 0; i < 4; i++) { const f = Math.sin(fr / 3 + i * 1.7); g.fillStyle = i % 2 ? "#f97316" : "#facc15"; g.fillRect(sx + 4 + i * 2.2, sy + 10 - 2.5 - Math.abs(f) * 3, 2, 4 + Math.abs(f) * 3); }
      K.glow(g, sx + 8, sy + 10, 20, "255,140,50", 0.3 + 0.08 * Math.sin(fr / 4)); K.light(sx + 8, sy + 10, 50, "255,150,60", 0.3);
    },
    // libreria con dorsi colorati
    L(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2b180b"; g.fillRect(sx, sy - 3, 16, 19); g.fillStyle = "#4a2a14"; g.fillRect(sx + 1, sy - 2, 14, 17);
      const C = ["#9f1239", "#1d4ed8", "#15803d", "#a16207", "#6d28d9", "#0f766e"]; for (let r = 0; r < 3; r++) { g.fillStyle = "#2b180b"; g.fillRect(sx + 1, sy + 2 + r * 5, 14, 1); for (let i = 0; i < 6; i++) { g.fillStyle = C[Math.floor(rn(tx + i, ty + r, 4) * 6)]; g.fillRect(sx + 2 + i * 2.1, sy - 1 + r * 5, 1.7, 3 + rn(tx + i, ty + r, 7) * 1.5); } }
    },
    // finestra con tenda (o quadro) sulla parete
    W(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2a1810"; g.fillRect(sx, sy, 16, 16);
      if ((tx + ty) % 3) { g.fillStyle = "#6b4a2a"; g.fillRect(sx + 1, sy + 2, 14, 12); g.fillStyle = "#0b1426"; g.fillRect(sx + 2, sy + 3, 12, 10); g.fillStyle = "rgba(190,210,255,.5)"; for (let i = 0; i < 4; i++) g.fillRect(sx + 3 + ((fr * 1.4 + i * 4 + tx) % 9), sy + 3 + i * 2.4, 1, 3); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 1, sy + 2, 3, 12); g.fillRect(sx + 12, sy + 2, 3, 12); }
      else { g.fillStyle = "#b8860b"; g.fillRect(sx + 2, sy + 2, 12, 12); g.fillStyle = "#334155"; g.fillRect(sx + 3, sy + 3, 10, 10); g.fillStyle = "#cbd5e1"; g.fillRect(sx + 5, sy + 5, 6, 3); g.fillStyle = "#94a3b8"; g.fillRect(sx + 5, sy + 8, 6, 4); }
    },
    // letto con coperta rosa
    B(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#4a2a14"; g.fillRect(sx, sy + 1, 16, 14); g.fillStyle = "#fbcfe8"; g.fillRect(sx + 1, sy + 2, 14, 4); g.fillStyle = "#db2777"; g.fillRect(sx + 1, sy + 6, 14, 8); g.fillStyle = "#f9a8d4"; g.fillRect(sx + 1, sy + 6, 14, 1.5); },
    // pianoforte a coda
    G(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#0b0b0f"; g.fillRect(sx, sy + 1, 16, 14); g.fillStyle = "#1f1f2b"; g.fillRect(sx + 1, sy + 2, 14, 4); g.fillStyle = "#f8fafc"; for (let i = 0; i < 7; i++) g.fillRect(sx + 1.5 + i * 2, sy + 9, 1.5, 5); g.fillStyle = "#111"; for (let i = 0; i < 5; i++) g.fillRect(sx + 2.5 + i * 2.4, sy + 9, 1, 3); },
    // pianta in vaso
    A(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#9a3412"; g.fillRect(sx + 4, sy + 9, 8, 7); g.fillStyle = "#7c2d12"; g.fillRect(sx + 4, sy + 9, 8, 1.5); for (let i = 0; i < 6; i++) { const a = -0.9 + i * 0.35, l = 6 + (i % 2) * 2; g.fillStyle = i % 2 ? "#16a34a" : "#15803d"; g.beginPath(); g.ellipse(sx + 8 + Math.sin(a + fr / 200) * l * 0.7, sy + 6 - Math.cos(a) * l * 0.6, 2.2, 4.2, a, 0, 7); g.fill(); } },
    // tavolo da ping-pong
    Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 3); g.fillStyle = "#14532d"; g.fillRect(sx, sy + 3, 16, 10); g.fillStyle = "#fff"; g.fillRect(sx, sy + 3, 16, 1); g.fillRect(sx, sy + 12, 16, 1); if (same(K, tx - 1, ty, "Y") && same(K, tx + 1, ty, "Y")) g.fillRect(sx, sy + 7.5, 16, 1); g.fillStyle = "#e5e7eb"; g.fillRect(sx + 7, sy + 2, 2, 11); g.fillStyle = "#facc15"; g.beginPath(); g.arc(sx + 12, sy + 6, 1.1, 0, 7); g.fill(); },
    // fornelli con pentole e vapore
    K(K, sx, sy, tx, ty, fr) {
      K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#4b5563"; g.fillRect(sx, sy + 3, 16, 12); g.fillStyle = "#111827"; g.fillRect(sx + 1, sy + 4, 14, 3); g.fillStyle = "#9ca3af"; g.fillRect(sx + 2, sy + 1, 5, 5); g.fillRect(sx + 9, sy + 2, 5, 4); g.fillStyle = "#f97316"; g.fillRect(sx + 3, sy + 12, 2, 2); g.fillRect(sx + 11, sy + 12, 2, 2);
      for (let i = 0; i < 3; i++) { const t = ((fr * 0.4 + i * 10) % 30) / 30; g.fillStyle = `rgba(240,240,240,${0.35 * (1 - t)})`; g.beginPath(); g.arc(sx + 5 + Math.sin(t * 5 + i) * 1.5 + i * 3, sy - t * 9, 1.6 + t * 2.2, 0, 7); g.fill(); }
    },
    // botte di vino
    R(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 14, 3); g.fillStyle = "#6b3a1c"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 7.5, 7, 0, 0, 7); g.fill(); g.fillStyle = "#8a4b24"; g.fillRect(sx + 1, sy + 4, 14, 2); g.fillRect(sx + 1, sy + 10, 14, 2); g.fillStyle = "#2b180b"; g.fillRect(sx + 7.3, sy + 6, 1.4, 3); },
    // statua di marmo su basamento
    O(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6b7280"; g.fillRect(sx + 2, sy + 11, 12, 5); g.fillStyle = "#e5e7eb"; g.fillRect(sx + 5, sy + 2, 6, 10); g.beginPath(); g.arc(sx + 8, sy + 3, 3, 0, 7); g.fill(); g.fillStyle = "#cbd5e1"; g.fillRect(sx + 3, sy + 5, 2, 5); g.fillRect(sx + 11, sy + 5, 2, 5); g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(sx + 6, sy + 2, 1, 8); },
    // divano di velluto
    U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6b1e2e"; g.fillRect(sx, sy + 4, 16, 11); g.fillStyle = "#8c2a3e"; g.fillRect(sx + 1, sy + 7, 14, 6); g.fillStyle = "#4c1420"; g.fillRect(sx, sy + 4, 16, 3); g.fillStyle = "#d4a73a"; g.fillRect(sx + 1, sy + 14, 2, 2); g.fillRect(sx + 13, sy + 14, 2, 2); },
    // scrivania con lampada e carte
    Z(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = "#3a2a1a"; g.fillRect(sx, sy + 4, 16, 10); g.fillStyle = "#14532d"; g.fillRect(sx + 2, sy + 5, 12, 6); g.fillStyle = "#f4efe3"; g.fillRect(sx + 3, sy + 6, 5, 4); g.fillStyle = "#facc15"; g.fillRect(sx + 11, sy + 2, 2, 4); g.fillRect(sx + 10, sy + 1, 4, 1.5); K.glow(g, sx + 12, sy + 3, 14, "255,220,120", 0.25); K.light(sx + 12, sy + 4, 34, "255,210,110", 0.22); }
  };
  function floorPaint(K, f, sx, sy, tx, ty) {
    const P = K.P, g = K.g, fr = Math.floor(performance.now() / 16);
    if (f === "l") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#a2763a" : "#9a6e34"); g.strokeStyle = "rgba(60,36,14,.45)"; g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx, sy + i * 4 + 0.5); g.lineTo(sx + 16, sy + i * 4 + 0.5); g.stroke(); } P(sx + ((tx * 5 + ty * 3) % 3) * 4 + 2, sy, 1, 16, "rgba(60,36,14,.35)"); return true; }
    if (f === "s") { const d = (tx + ty) % 2; P(sx, sy, 16, 16, d ? "#1c1c24" : "#e8e4d8"); P(sx, sy, 16, 1, "rgba(0,0,0,.18)"); P(sx, sy, 1, 16, "rgba(0,0,0,.18)"); if (d && (tx * 3 + ty + Math.floor(fr / 90)) % 11 === 0) P(sx + 5, sy + 5, 6, 1, "rgba(255,255,255,.25)"); return true; }
    if (f === "c") { const d = (tx + ty) % 2; P(sx, sy, 16, 16, d ? "#e9ece6" : "#b9c8d8"); P(sx, sy, 16, 1, "rgba(0,0,0,.12)"); P(sx, sy, 1, 16, "rgba(0,0,0,.12)"); return true; }
    if (f === "t") { P(sx, sy, 16, 16, "#7f1d1d"); P(sx, sy, 16, 2, "#d4a73a"); P(sx, sy + 14, 16, 2, "#d4a73a"); P(sx + 2, sy + 2, 12, 12, (tx + ty) % 2 ? "#8c2323" : "#6f1717"); g.fillStyle = "rgba(212,167,58,.55)"; g.beginPath(); g.moveTo(sx + 8, sy + 4); g.lineTo(sx + 12, sy + 8); g.lineTo(sx + 8, sy + 12); g.lineTo(sx + 4, sy + 8); g.closePath(); g.fill(); return true; }
    if (f === "g") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#a39a85" : "#9a917c"); for (let i = 0; i < 7; i++) P(sx + Math.floor(rn(tx, ty, i) * 14), sy + Math.floor(rn(tx, ty, i + 9) * 14), 1.5, 1.5, rn(tx, ty, i + 3) < 0.5 ? "#cfc7b0" : "#7a7260"); return true; }
    if (f === "w") { P(sx, sy, 16, 16, "#4a423a"); const o = (ty % 2) * 4; for (let i = 0; i < 2; i++) { P(sx + ((o + i * 8) % 16), sy, 1, 8, "rgba(0,0,0,.45)"); } P(sx, sy + 8, 16, 1, "rgba(0,0,0,.4)"); for (let i = 0; i < 2; i++) P(sx + (((o + 4) + i * 8) % 16), sy + 8, 1, 8, "rgba(0,0,0,.45)"); P(sx + 2, sy + 2, 5, 4, "rgba(255,255,255,.05)"); return true; }
    if (f === "v") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#a8643a" : "#9a5a34"); P(sx, sy, 16, 1, "rgba(0,0,0,.25)"); P(sx, sy, 1, 16, "rgba(0,0,0,.25)"); if (rn(tx, ty, 5) < 0.2) P(sx + 4, sy + 4, 8, 8, "rgba(70,140,70,.3)"); return true; }
    if (f === "b") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#5a3a20" : "#523318"); g.strokeStyle = "rgba(20,10,4,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx, sy + 8.5); g.lineTo(sx + 16, sy + 8.5); g.moveTo(sx + ((tx * 3) % 2 ? 5 : 11), sy); g.lineTo(sx + ((tx * 3) % 2 ? 5 : 11), sy + 8); g.stroke(); return true; }
    if (f === "m") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#a4476a" : "#9a4060"); for (let i = 0; i < 4; i++) P(sx + i * 4 + 1, sy + ((ty + i) % 2) * 2 + 3, 2, 2, "rgba(255,220,235,.22)"); return true; }
    return false;
  }
  window.__galaTiles = { paint, floorPaint };
})();
