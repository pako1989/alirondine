// js/tifosi-bg.js - sfondi di «LA NOTTE DEI TIFOSI MORTI» (320x200), animati, con i punti da toccare: titolo, il novantesimo, il campo di notte, spogliatoi,
// magazzino di Gaspare, tribuna, tribuna stampa, bar dello stadio, curva ospiti, sottocurva, parcheggio, pullman, alba e i finali.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const stars = (g, W, n, f, h) => { for (let i = 0; i < n; i++) R(g, rnd(i + 3) * W, rnd(i + 20) * (h || 80), 1, 1, `rgba(255,255,255,${0.3 + 0.35 * Math.sin(f / 18 + i)})`); };
  // nebbia verde del fumogeno: banchi che scorrono
  const fog = (g, f, a, y0, h) => { for (let i = 0; i < 9; i++) { const x = ((rnd(i) * 380 + f * (0.2 + rnd(i + 5) * 0.3)) % 420) - 50, y = (y0 || 60) + rnd(i + 9) * (h || 140) + Math.sin(f / 60 + i) * 6, r = 40 + rnd(i + 2) * 40; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(132,204,22,${a || 0.16})`); gr.addColorStop(1, "rgba(132,204,22,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } };
  // torre-faro dello stadio con il fascio di luce
  const tower = (g, x, y, f, k) => { R(g, x - 2, y, 4, 120, "#334155"); for (let i = 0; i < 12; i++) R(g, x - 3, y + i * 10, 6, 1, "#475569"); R(g, x - 14, y - 10, 28, 12, "#1e293b"); for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) R(g, x - 12 + i * 6, y - 8 + j * 5, 5, 4, `rgba(255,250,220,${0.75 + 0.2 * Math.sin(f / 13 + i + j + (k || 0))})`); GL(g, x, y - 4, 60, "255,250,220", 0.35); };
  // gradinate con la folla (tifosi vivi o zombie), colori a scelta
  const crowd = (g, x0, y0, w, rows, cols, f, zomb, seed) => { for (let r = 0; r < rows; r++) { R(g, x0, y0 + r * 7, w, 7, r % 2 ? "#1f2937" : "#273244"); for (let i = 0; i < w / 6; i++) { const k = (seed || 0) + r * 97 + i, x = x0 + 3 + i * 6, y = y0 + r * 7 + 1 + (zomb ? Math.sin(f / 9 + k) * 1.2 : Math.abs(Math.sin(f / 7 + k)) * -1.5); if (rnd(k) < 0.15) continue; R(g, x - 2, y + 2, 4, 4, cols[k % cols.length]); C(g, x, y + 1, 1.8, zomb ? "#86a36b" : "#e8c4a0"); if (zomb && rnd(k + 3) < 0.08) { g.fillStyle = "rgba(233,213,255,.8)"; g.font = "6px serif"; g.fillText("♪", x + 2, y - 3 - (f / 3 + k) % 8); } } } };
  // un tifoso zombie in piedi (sagoma grande)
  const zed = (g, x, y, s, f, i, sh, sc) => { g.save(); g.translate(x, y + Math.sin(f / 10 + i) * 1.2); g.scale(s, s); R(g, -6, -22, 12, 16, sh || "#6d28d9"); R(g, -7, -22, 14, 3, sc || "#facc15"); R(g, 3, -20, 3, 9, sc || "#facc15"); R(g, -5, -6, 4, 7, "#1f2937"); R(g, 1, -6, 4, 7, "#1f2937"); C(g, 0, -27, 5, "#86a36b"); R(g, -3, -29, 2, 2, "#1a2e05"); R(g, 1, -29, 2, 2, "#1a2e05"); R(g, -1.5, -25, 3, 2 + Math.abs(Math.sin(f / 6 + i)), "#3f0a0a"); g.strokeStyle = "#86a36b"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-6, -18); g.lineTo(-12, -24 + Math.sin(f / 8 + i) * 2); g.moveTo(6, -18); g.lineTo(12, -24 + Math.cos(f / 8 + i) * 2); g.stroke(); g.restore(); };
  // un vivo (giocatore, cronista, prete…)
  const man = (g, x, y, s, f, i, sh, hair, extra) => { g.save(); g.translate(x, y + Math.abs(Math.sin(f / 12 + i)) * -1); g.scale(s, s); R(g, -6, -22, 12, 16, sh); R(g, -5, -6, 4, 7, "#111827"); R(g, 1, -6, 4, 7, "#111827"); C(g, 0, -27, 5, "#e8c4a0"); R(g, -5, -33, 10, 4, hair || "#2b1d14"); if (extra === "scopa") { R(g, 8, -36, 2, 34, "#a16207"); R(g, 5, -4, 8, 5, "#d6d3d1"); } else if (extra === "cam") { R(g, 6, -24, 9, 6, "#111"); C(g, 13, -21, 2, "#93c5fd"); } else if (extra === "prete") { R(g, -1, -22, 2, 3, "#f8fafc"); } else if (extra === "borraccia") { R(g, 7, -18, 3, 7, "#22c55e"); } g.restore(); };
  const pitch = (g, W, y0, f, light) => { for (let i = 0; i < 10; i++) { T(g, [i * 32 - 60 * (1 - (200 - y0) / 200), 200, (i + 1) * 32 - 60 * (1 - (200 - y0) / 200), 200, 160 + ((i + 1) * 32 - 160) * 0.55, y0, 160 + (i * 32 - 160) * 0.55, y0], i % 2 ? "#1d4a26" : "#22552c"); } g.strokeStyle = "rgba(240,253,244,.6)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 200); g.lineTo(72, y0); g.moveTo(320, 200); g.lineTo(248, y0); g.moveTo(72, y0); g.lineTo(248, y0); g.stroke(); g.beginPath(); g.ellipse(160, y0 + (200 - y0) * 0.55, 46, 12, 0, 0, 7); g.stroke(); if (light) GL(g, 160, y0 + 30, 120, "255,250,220", 0.12); };
  const smokeCol = (g, x, y, f, col) => { for (let i = 0; i < 6; i++) { const t = (f / 2 + i * 20) % 120; C(g, x + Math.sin(t / 18 + i) * 8 + t * 0.15, y - t * 0.7, 4 + t / 10, `rgba(${col || "132,204,22"},${0.5 - t / 260})`); } };
  const SC = {
    zt_titolo(g, W, H, f) {
      VG(g, 0, 200, "#020617", "#14260f"); g.fillRect(0, 0, W, H); stars(g, W, 60, f, 70);
      tower(g, 30, 30, f, 0); tower(g, 290, 30, f, 2);
      crowd(g, 0, 70, W, 7, ["#6d28d9", "#facc15", "#7c3aed", "#4c1d95"], f, true, 1);
      pitch(g, W, 120, f, true);
      fog(g, f, 0.22, 60, 140);
      [[60, 182, "#6d28d9"], [104, 176, "#7c3aed"], [216, 176, "#6d28d9"], [262, 184, "#4c1d95"]].forEach(([x, y, c], i) => zed(g, x, y, 1.3, f, i, c));
      man(g, 160, 184, 1.5, f, 9, "#1f5fbf", "#2b1d14"); C(g, 172, 182, 3.5, "#f8fafc"); R(g, 170, 181, 3, 2, "#111");
      g.textAlign = "center"; g.font = "900 24px system-ui"; g.strokeStyle = "#000"; g.lineWidth = 5; g.fillStyle = "#bef264"; g.strokeText("LA NOTTE DEI", W / 2, 30); g.fillText("LA NOTTE DEI", W / 2, 30);
      g.font = "900 30px system-ui"; g.strokeText("TIFOSI MORTI", W / 2, 60); g.fillStyle = "#e9d5ff"; g.fillText("TIFOSI MORTI", W / 2, 60);
      g.font = "italic 700 9px Georgia, serif"; g.fillStyle = "#fef3c7"; g.fillText("novantesimo minuto · lo stadio è chiuso · loro cantano ancora", W / 2, 72); VIG(g, W, H, 0.4);
    },
    zt_novantesimo(g, W, H, f) {
      VG(g, 0, 90, "#0b1120", "#1e293b"); g.fillRect(0, 0, W, 90); stars(g, W, 30, f, 50); tower(g, 40, 22, f, 1); tower(g, 280, 22, f, 3);
      crowd(g, 0, 50, 150, 6, ["#6d28d9", "#facc15"], f, false, 3); crowd(g, 170, 50, 150, 6, ["#1f5fbf", "#f8fafc"], f, false, 8);
      pitch(g, W, 92, f, true);
      // tabellone: 90', 1-1
      R(g, 118, 6, 84, 30, "#020617"); R(g, 120, 8, 80, 26, "#111827"); g.font = "900 11px monospace"; g.textAlign = "center"; g.fillStyle = "#fbbf24"; g.fillText("BORGO 1 - 1 VALT", 160, 20); g.fillStyle = (f % 40 < 20) ? "#ef4444" : "#7f1d1d"; g.fillText("90'+3", 160, 31);
      smokeCol(g, 70, 60, f, "132,204,22"); smokeCol(g, 40, 64, f + 30, "132,204,22"); fog(g, f, 0.12, 40, 60);
      man(g, 150, 170, 1.3, f, 1, "#1f5fbf", "#2b1d14"); man(g, 200, 160, 1.1, f, 2, "#6d28d9", "#111"); man(g, 110, 150, 1.0, f, 3, "#1f5fbf", "#78350f"); C(g, 162, 176, 3, "#f8fafc");
      VIG(g, W, H, 0.35);
    },
    zt_stadio(g, W, H, f) {
      VG(g, 0, 100, "#020617", "#111827"); g.fillRect(0, 0, W, 100); stars(g, W, 40, f, 50); tower(g, 22, 18, f, 0); tower(g, 298, 18, f, 2);
      crowd(g, 0, 46, W, 7, ["#6d28d9", "#facc15", "#7c3aed"], f, true, 5);
      R(g, 0, 95, W, 6, "#111827"); for (let i = 0; i < 8; i++) { R(g, 4 + i * 40, 96, 36, 4, i % 2 ? "#facc15" : "#7c3aed"); }
      pitch(g, W, 101, f, true); fog(g, f, 0.18, 90, 110);
      [[40, 160], [270, 150], [210, 186], [96, 190]].forEach(([x, y], i) => zed(g, x, y, 1.1, f, i, i % 2 ? "#7c3aed" : "#6d28d9"));
      R(g, 140, 100, 40, 12, "#020617"); g.font = "700 6px system-ui"; g.textAlign = "center"; g.fillStyle = "#fbbf24"; g.fillText("TUNNEL ▸ SPOGLIATOI", 160, 108);
      VIG(g, W, H, 0.45);
    },
    zt_spogliatoi(g, W, H, f) {
      R(g, 0, 0, W, 130, "#1e3a5f"); for (let x = 0; x < W; x += 16) for (let y = 0; y < 130; y += 16) R(g, x, y, 15, 15, (x + y) % 32 ? "#21416b" : "#1d3a60");
      for (let i = 0; i < 9; i++) { const x = 10 + i * 34; R(g, x, 30, 30, 90, "#475569"); R(g, x + 2, 32, 26, 40, "#64748b"); R(g, x + 2, 74, 26, 44, "#64748b"); C(g, x + 24, 52, 1.5, "#e2e8f0"); g.font = "900 9px system-ui"; g.textAlign = "center"; g.fillStyle = "#e2e8f0"; g.fillText(String([1, 2, 4, 5, 6, 7, 8, 9, 10][i]), x + 15, 44); if (i === 3) { R(g, x + 4, 76, 22, 30, "#1f5fbf"); R(g, x + 8, 82, 14, 12, "#f8fafc"); } }
      R(g, 0, 130, W, 70, "#334155"); for (let x = 0; x < W; x += 20) R(g, x, 130, 1, 70, "#2b3646"); R(g, 30, 150, 260, 10, "#78350f"); R(g, 30, 160, 260, 3, "#451a03");
      R(g, 120, 4, 80, 22, "#f8fafc"); g.strokeStyle = "#1f2937"; g.lineWidth = 1; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(130 + i * 15, 15, 2, 0, 7); g.stroke(); } g.strokeStyle = "#dc2626"; g.beginPath(); g.moveTo(132, 18); g.quadraticCurveTo(160, 6, 190, 14); g.stroke();
      // la porta sbarrata che trema
      const sh = Math.sin(f / 3) * (f % 90 < 20 ? 1.5 : 0); R(g, 290 + sh, 60, 26, 70, "#57534e"); R(g, 286, 80, 34, 6, "#a16207"); R(g, 286, 104, 34, 6, "#a16207");
      man(g, 70, 186, 1.2, f, 1, "#1f5fbf", "#2b1d14"); man(g, 230, 186, 1.2, f, 2, "#1f5fbf", "#78350f", "borraccia");
      GL(g, 160, 0, 120, "255,255,240", 0.15); VIG(g, W, H, 0.35);
    },
    zt_magazzino(g, W, H, f) {
      R(g, 0, 0, W, H, "#292524"); for (let y = 0; y < 140; y += 22) { R(g, 0, y + 20, W, 3, "#57534e"); for (let i = 0; i < 16; i++) { const x = 6 + i * 20; if (rnd(y + i) < 0.3) continue; C(g, x + 6, y + 14, 6, rnd(y * 3 + i) < 0.5 ? "#f8fafc" : "#fef3c7"); R(g, x + 4, y + 12, 3, 3, "#111"); } }
      R(g, 0, 150, W, 50, "#44403c"); R(g, 20, 120, 90, 50, "#a16207"); for (let i = 0; i < 6; i++) R(g, 24 + i * 14, 124, 10, 42, "#ca8a04"); g.font = "900 7px system-ui"; g.fillStyle = "#1c1917"; g.textAlign = "center"; g.fillText("RETI · NON TOCCARE", 65, 118);
      R(g, 230, 100, 70, 60, "#1c1917"); R(g, 234, 104, 62, 30, "#57534e"); g.fillStyle = "#facc15"; g.fillText("GASPARE", 265, 122);
      C(g, 160, 30, 6, `rgba(254,240,138,${0.8 + 0.15 * Math.sin(f / 5)})`); GL(g, 160, 30, 90, "254,240,138", 0.25); R(g, 159, 0, 2, 24, "#111");
      man(g, 160, 186, 1.4, f, 4, "#78716c", "#d6d3d1", "scopa"); VIG(g, W, H, 0.4);
    },
    zt_tribuna(g, W, H, f) {
      VG(g, 0, 60, "#020617", "#0f172a"); g.fillRect(0, 0, W, 60); stars(g, W, 25, f, 40); R(g, 0, 18, W, 14, "#1e293b"); for (let i = 0; i < 16; i++) R(g, i * 20 + 2, 22, 16, 6, `rgba(147,197,253,${0.25 + 0.2 * Math.sin(f / 20 + i)})`); g.font = "900 7px system-ui"; g.textAlign = "center"; g.fillStyle = "#fbbf24"; g.fillText("TRIBUNA STAMPA · AREA VIP", 160, 15);
      for (let r = 0; r < 18; r++) { const y = 34 + r * 9; R(g, 0, y, W, 9, r % 2 ? "#3f3f46" : "#52525b"); for (let i = 0; i < 26; i++) { const x = 4 + i * 12; R(g, x, y + 2, 9, 5, (i + r) % 5 ? "#1d4ed8" : "#e2e8f0"); } }
      R(g, 150, 34, 20, 166, "#71717a"); fog(g, f, 0.14, 60, 120);
      zed(g, 60, 120, 1, f, 1, "#6d28d9"); zed(g, 250, 150, 1, f, 2, "#7c3aed"); zed(g, 100, 180, 1.1, f, 3, "#4c1d95");
      for (let i = 0; i < 5; i++) { const x = 30 + i * 60, y = 50 + rnd(i) * 120; R(g, x, y, 4, 3, "#f8fafc"); }
      VIG(g, W, H, 0.45);
    },
    zt_stampa(g, W, H, f) {
      R(g, 0, 0, W, H, "#1c1917"); R(g, 0, 0, W, 96, "#0b1120"); stars(g, W, 20, f, 40); R(g, 0, 40, W, 56, "#1f3b2a"); for (let i = 0; i < 8; i++) zed(g, 20 + i * 40, 92, 0.5, f, i, i % 2 ? "#6d28d9" : "#7c3aed"); fog(g, f, 0.12, 50, 40);
      R(g, 0, 92, W, 6, "#0f172a"); for (let i = 0; i < 4; i++) R(g, i * 80 + 1, 0, 2, 96, "#111827");
      R(g, 0, 120, W, 22, "#57534e"); R(g, 0, 140, W, 60, "#292524");
      [[30, "#1e293b"], [110, "#334155"], [190, "#1e293b"], [262, "#334155"]].forEach(([x, c], i) => { R(g, x, 100, 40, 22, c); R(g, x + 3, 103, 34, 15, `rgba(56,189,248,${0.35 + 0.25 * Math.sin(f / 9 + i)})`); g.font = "6px monospace"; g.fillStyle = "#e0f2fe"; g.textAlign = "left"; g.fillText(["ZOMBI?", "1-1 90'", "AIUTO", "RADIO"][i], x + 6, 113); });
      R(g, 140, 150, 40, 30, "#111"); C(g, 160, 165, 9, "#334155"); C(g, 160, 165, 5, "#93c5fd"); R(g, 158, 180, 4, 18, "#111"); g.fillStyle = (f % 40 < 20) ? "#ef4444" : "#7f1d1d"; C(g, 176, 154, 2.5, g.fillStyle);
      man(g, 230, 194, 1.3, f, 5, "#be123c", "#7c2d12", "cam"); man(g, 80, 194, 1.3, f, 6, "#111827", "#d6d3d1", "prete");
      VIG(g, W, H, 0.4);
    },
    zt_bar(g, W, H, f) {
      R(g, 0, 0, W, H, "#3b2414"); for (let x = 0; x < W; x += 24) R(g, x, 0, 1, 120, "#2d1b0f");
      R(g, 20, 20, 120, 40, "#1f2937"); for (let i = 0; i < 4; i++) for (let j = 0; j < 7; j++) R(g, 26 + j * 16, 24 + i * 9, 10, 7, ["#16a34a", "#b91c1c", "#fbbf24", "#e5e7eb"][(i + j) % 4]);
      R(g, 180, 18, 110, 46, "#111827"); g.font = "900 10px system-ui"; g.textAlign = "center"; g.fillStyle = (f % 60 < 30) ? "#f472b6" : "#fbbf24"; g.fillText("BAR DELLO STADIO", 235, 36); g.font = "700 7px system-ui"; g.fillStyle = "#e5e7eb"; g.fillText("caffè 1€ · panino 3€ · fede gratis", 235, 50);
      R(g, 0, 110, W, 30, "#78350f"); R(g, 0, 108, W, 4, "#a16207"); R(g, 210, 84, 34, 26, "#94a3b8"); R(g, 216, 90, 22, 10, "#1e293b"); smokeCol(g, 226, 84, f, "226,232,240");
      R(g, 0, 140, W, 60, "#57534e"); for (let i = 0; i < 6; i++) R(g, i * 56, 140, 1, 60, "#44403c");
      [[60, "#1f5fbf"], [110, "#f8fafc"], [150, "#1f5fbf"]].forEach(([x, c], i) => man(g, x, 196, 1.2, f, i + 10, c, "#2b1d14"));
      g.fillStyle = "rgba(191,219,254,.85)"; g.font = "8px serif"; for (let i = 0; i < 3; i++) g.fillText("♪", 70 + i * 40 + Math.sin(f / 9 + i) * 4, 150 - (f / 2 + i * 20) % 40);
      VIG(g, W, H, 0.35);
    },
    zt_curva(g, W, H, f) {
      VG(g, 0, 60, "#1a0b2e", "#3b0764"); g.fillRect(0, 0, W, 60); stars(g, W, 30, f, 50); tower(g, 300, 10, f, 4);
      crowd(g, 0, 40, W, 20, ["#6d28d9", "#facc15", "#4c1d95", "#7c3aed"], f, true, 11);
      [["VALTORTA ALÉ", 54, "#6d28d9", "#facc15"], ["NOI NON MORIAMO MAI", 110, "#facc15", "#3b0764"]].forEach(([t, y, b, c]) => { R(g, 10, y + Math.sin(f / 20) * 1, 300, 16, b); g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillStyle = c; g.fillText(t, 160, y + 12); });
      for (let i = 0; i < 4; i++) { const x = 40 + i * 80; R(g, x - 1, 150, 2, 8, "#991b1b"); C(g, x, 148, 3 + Math.sin(f / 3 + i), "#ef4444"); GL(g, x, 146, 26, "239,68,68", 0.4); smokeCol(g, x, 146, f + i * 30, "239,68,68"); }
      fog(g, f, 0.2, 60, 140); VIG(g, W, H, 0.45);
    },
    zt_sottocurva(g, W, H, f) {
      R(g, 0, 0, W, H, "#1c1917"); for (let y = 0; y < 120; y += 12) R(g, 0, y, W, 1, "#292524");
      T(g, [0, 0, 320, 0, 320, 40, 0, 90], "#0c0a09");
      R(g, 16, 40, 140, 28, "#6d28d9"); g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillStyle = "#facc15"; g.fillText("ULTRAS 1977", 86, 59);
      R(g, 180, 50, 120, 70, "#292524"); for (let i = 0; i < 6; i++) { R(g, 186 + i * 19, 58 + (i % 2) * 6, 14, 18, "#f5f5f4"); R(g, 188 + i * 19, 60 + (i % 2) * 6, 10, 10, ["#a8a29e", "#d6d3d1", "#78716c"][i % 3]); } g.font = "700 6px system-ui"; g.fillStyle = "#e7e5e4"; g.fillText("40 ANNI DI CURVA", 240, 116);
      [[40, 150], [90, 160]].forEach(([x, y], i) => { C(g, x, y, 14, "#b45309"); C(g, x, y - 3, 14, "#fef3c7"); R(g, x - 14, y - 3, 28, 6, "#b45309"); });
      C(g, 160, 20, 5, `rgba(254,240,138,${0.6 + 0.3 * Math.sin(f / 4)})`); GL(g, 160, 20, 80, "254,240,138", 0.2);
      R(g, 220, 150, 60, 40, "#57534e"); R(g, 224, 154, 52, 4, "#a16207"); g.fillStyle = "#facc15"; g.font = "6px system-ui"; g.fillText("CASSE FUMOGENI · B.P.", 250, 172);
      VIG(g, W, H, 0.5);
    },
    zt_parcheggio(g, W, H, f) {
      VG(g, 0, 90, "#0b1120", "#334155"); g.fillRect(0, 0, W, 90); stars(g, W, 30, f, 40);
      R(g, 0, 30, W, 50, "#1e293b"); for (let i = 0; i < 6; i++) { R(g, 10 + i * 52, 40, 48, 30, "#273244"); } g.font = "900 8px system-ui"; g.textAlign = "center"; g.fillStyle = "#fbbf24"; g.fillText("STADIO COMUNALE · USCITA OSPITI", 160, 36);
      R(g, 0, 80, W, 120, "#27272a"); for (let i = 0; i < 9; i++) R(g, 20 + i * 34, 120, 2, 30, "rgba(250,250,250,.5)"); for (let x = 0; x < W; x += 30) R(g, x, 170, 16, 2, "#facc15");
      [[30, 120, "#b91c1c"], [100, 124, "#0f766e"], [250, 120, "#e5e7eb"]].forEach(([x, y, c]) => { R(g, x, y, 44, 18, c); R(g, x + 8, y - 8, 28, 10, c); R(g, x + 10, y - 6, 24, 6, "rgba(186,230,253,.6)"); C(g, x + 9, y + 18, 4, "#111"); C(g, x + 35, y + 18, 4, "#111"); });
      R(g, 160, 96, 80, 34, "#1e40af"); for (let i = 0; i < 4; i++) R(g, 166 + i * 18, 102, 14, 10, "#93c5fd"); C(g, 172, 130, 5, "#111"); C(g, 228, 130, 5, "#111"); g.font = "900 5px system-ui"; g.fillStyle = "#fde047"; g.fillText("BORGO MARINO", 200, 124);
      [[60, 82], [280, 82]].forEach(([x, y], i) => { R(g, x - 1, y, 2, 40, "#475569"); C(g, x, y, 3, "#fde68a"); GL(g, x, y + 30, 50, "253,230,138", 0.25 + 0.05 * Math.sin(f / 7 + i)); });
      zed(g, 40, 186, 1, f, 1, "#6d28d9"); zed(g, 290, 190, 1, f, 2, "#7c3aed"); fog(g, f, 0.14, 100, 100); VIG(g, W, H, 0.45);
    },
    zt_pullman(g, W, H, f) {
      R(g, 0, 0, W, H, "#0f172a"); R(g, 0, 20, W, 50, "#1e293b"); for (let i = 0; i < 5; i++) { R(g, 10 + i * 62, 26, 54, 38, "#0b1120"); g.fillStyle = `rgba(132,204,22,${0.1 + 0.08 * Math.sin(f / 30 + i)})`; g.fillRect(10 + i * 62, 26, 54, 38); }
      for (let r = 0; r < 4; r++) { R(g, 30, 90 + r * 26, 90, 20, "#1d4ed8"); R(g, 200, 90 + r * 26, 90, 20, "#1d4ed8"); R(g, 30, 90 + r * 26, 90, 5, "#3b82f6"); R(g, 200, 90 + r * 26, 90, 5, "#3b82f6"); }
      R(g, 140, 80, 40, 120, "#334155"); g.font = "700 6px system-ui"; g.textAlign = "center"; g.fillStyle = "#e2e8f0"; g.fillText("VIETATO FUMARE · ANCHE IL FUMOGENO", 160, 78);
      zed(g, 60, 52, 0.6, f, 1, "#6d28d9"); zed(g, 250, 54, 0.6, f, 3, "#7c3aed");
      man(g, 160, 196, 1.3, f, 3, "#64748b", "#d6d3d1"); VIG(g, W, H, 0.4);
    },
    zt_alba(g, W, H, f) {
      VG(g, 0, 140, "#1e1b4b", "#fb923c"); g.fillRect(0, 0, W, 140); C(g, 160, 128, 30, "#fde68a"); GL(g, 160, 128, 120, "253,224,71", 0.45);
      R(g, 0, 100, W, 40, "#1f2937"); crowd(g, 0, 96, W, 4, ["#6d28d9", "#facc15", "#1f5fbf", "#f8fafc"], f, true, 21);
      pitch(g, W, 140, f, false);
      [[70, 186], [130, 190], [190, 190], [250, 186]].forEach(([x, y], i) => man(g, x, y, 1.2, f, i, ["#1f5fbf", "#0f766e", "#be123c", "#78716c"][i], "#2b1d14"));
      fog(g, f, 0.08, 120, 60); VIG(g, W, H, 0.25);
    },
    zt_coro(g, W, H, f) {
      VG(g, 0, 200, "#1a0b2e", "#4c1d95"); g.fillRect(0, 0, W, H); crowd(g, 0, 20, W, 24, ["#6d28d9", "#facc15", "#4c1d95"], f, true, 31);
      R(g, 130, 150, 60, 50, "#1f2937"); man(g, 160, 196, 1.6, f, 0, "#1f5fbf", "#2b1d14"); R(g, 170, 160, 12, 6, "#f472b6");
      g.fillStyle = "rgba(233,213,255,.9)"; g.font = "10px serif"; for (let i = 0; i < 10; i++) g.fillText("♪", (i * 37 + f) % 330, 120 - (f + i * 13) % 100); VIG(g, W, H, 0.35);
    },
    zt_fumogeno(g, W, H, f) {
      VG(g, 0, 200, "#0b1120", "#1e3a8a"); g.fillRect(0, 0, W, H); crowd(g, 0, 40, W, 12, ["#6d28d9", "#facc15", "#1f5fbf", "#f8fafc"], f, false, 41);
      for (let i = 0; i < 5; i++) smokeCol(g, 30 + i * 65, 140, f + i * 25, "96,165,250"); pitch(g, W, 130, f, true); GL(g, 160, 110, 150, "147,197,253", 0.3);
      man(g, 160, 192, 1.4, f, 0, "#1f5fbf", "#2b1d14"); VIG(g, W, H, 0.3);
    }
  };
  const HOT = {
    zt_titolo: [[110, 150, 100, 50, "⚽ Il Campione col pallone sotto il braccio. È l'unica cosa che li tiene lontani."], [0, 70, 320, 50, "🎶 La curva ospite. Cantano ancora. Hanno solo cambiato colore della pelle."], [10, 10, 40, 100, "💡 I fari dello stadio. Restano accesi tutta la notte: il custode è scappato con le chiavi del quadro."]],
    zt_novantesimo: [[118, 6, 84, 30, "🕒 Novantesimo più tre. Uno a uno. Mancano trenta secondi e una vita intera."], [20, 40, 100, 50, "💚 Un fumogeno verde nella curva ospite. Non è il solito verde."], [130, 140, 80, 50, "⚽ L'ultimo pallone della partita. Nessuno lo calcerà più, per un po'."]],
    zt_stadio: [[0, 46, 320, 50, "🧟 Gli spalti pieni. Ondeggiano. Cantano. Nessuno respira, però."], [140, 100, 40, 12, "🚪 Il tunnel per gli spogliatoi. Da lì si sente bussare."], [0, 100, 320, 100, "🌫️ La nebbia verde scende sul prato. Puzza di uovo e di vecchia sciarpa."]],
    zt_spogliatoi: [[110, 70, 40, 50, "👕 La maglia numero 5 di Pippo. Diciotto stagioni, una sola squadra."], [120, 4, 80, 22, "📋 La lavagna del Mister: «PRESSING ALTO». Adesso, col senno di poi, era meglio «RITIRATA»."], [286, 60, 34, 70, "🚪 La porta delle docce, sbarrata. Ogni tanto trema. Ogni tanto canta."]],
    zt_magazzino: [[0, 0, 320, 110, "⚽ Palloni. Centinaia. Gaspare li ha contati tutti: dice che manca sempre quello che serve."], [20, 118, 90, 50, "🥅 Le reti delle porte. «NON TOCCARE». Gaspare l'ha scritto per sé, per non piangere quando le rammenda."], [230, 100, 70, 60, "🧹 La postazione di Gaspare: una sedia, una radio, una scopa con trent'anni di carriera."]],
    zt_tribuna: [[0, 18, 320, 16, "🎙️ La tribuna stampa. Le luci sono accese: qualcuno è rimasto chiuso dentro."], [150, 34, 20, 166, "🪜 La scala centrale. È l'unica via che non passa sopra i seggiolini."], [20, 90, 280, 100, "🧟 Tifosi ospiti in tribuna d'onore. Si sono seduti al posto dei consiglieri comunali, e nessuno ci vede la differenza."]],
    zt_stampa: [[0, 40, 320, 56, "🪟 Dal vetro si vede tutto il campo. Rebecca dice che è il posto migliore per una diretta e il peggiore per una fuga."], [140, 150, 40, 30, "🎥 La telecamera di Telegolfo. La spia rossa è accesa: qualcuno sta guardando?"], [26, 96, 270, 26, "🖥️ I monitor della sala stampa. Su uno c'è scritto «ZOMBI?» col punto di domanda. Il giornalismo è prudente."]],
    zt_bar: [[180, 18, 110, 46, "☕ «Caffè 1€ · panino 3€ · fede gratis». Il listino del bar non è mai cambiato dal 1994."], [210, 84, 34, 26, "♨️ La macchina del caffè. Fischia come un arbitro, e con la stessa autorità."], [40, 150, 140, 50, "🎶 I tifosi di casa, chiusi nel bar, cantano per farsi coraggio. Fuori, qualcuno si è fermato ad ascoltare."]],
    zt_curva: [[10, 54, 300, 18, "🚩 «VALTORTA ALÉ». Lo striscione più vecchio della curva ospite. Qualcuno lo ha appena rammendato."], [0, 140, 320, 30, "🔥 Torce. Bruciano senza che nessuno le tenga. La curva ha le sue regole."], [0, 40, 320, 100, "🧟 La curva ospite, piena. Ondeggiano tutti insieme, a tempo. Se canti con loro, non si girano."]],
    zt_sottocurva: [[16, 40, 140, 28, "🚩 «ULTRAS 1977». Quarantanove anni di trasferte, di pullman, di coppe mai vinte."], [180, 50, 120, 70, "📸 Le foto di quarant'anni di curva. In tutte c'è un uomo grosso, sempre al centro, sempre col megafono."], [220, 150, 60, 40, "📦 Casse di fumogeni con una sigla: «B.P.». Non è la marca che usano di solito."]],
    zt_parcheggio: [[160, 96, 80, 34, "🚌 Il pullman della squadra. Il motore è freddo, le chiavi chissà dove."], [0, 30, 320, 50, "🏟️ L'uscita ospiti. Da qui sono entrati, e da qui, prima o poi, devono uscire."], [30, 110, 120, 40, "🚗 Le auto dei tifosi. Una ha ancora la radio accesa: trasmette la partita, ferma al novantesimo."]],
    zt_pullman: [[10, 26, 300, 38, "🪟 Dai finestrini si vede il parcheggio. E il parcheggio vede te."], [30, 90, 260, 100, "💺 I sedili blu del pullman. Ognuno ha il suo, da anni: guai a chi cambia posto."], [140, 70, 40, 12, "🚭 «Vietato fumare, anche il fumogeno». Il cartello l'ha scritto Gaspare."]],
    zt_alba: [[130, 98, 60, 60, "🌅 L'alba sullo stadio. Dopo questa notte il sole sembra un'esagerazione."], [0, 96, 320, 30, "🎶 Le gradinate. Qualcuno canta ancora, piano, come si canta all'ultimo minuto."], [50, 150, 220, 50, "🧍 Quelli che sono arrivati fino a qui. Nessuno parla. Qualcuno ride."]],
    zt_coro: [[0, 20, 320, 120, "🧟 Ventimila voci, e nessuna respira. Cantano quello che canti tu."], [130, 150, 60, 50, "📣 Il megafono del capo coro. Adesso è tuo."], [0, 100, 320, 40, "🎶 Le note salgono verso i fari. Dal paese si sentono fino al porto."]],
    zt_fumogeno: [[0, 100, 320, 60, "💙 Il fumo blu scende sulla curva. Dove passa, le facce tornano rosa."], [0, 40, 320, 60, "🙌 Le gradinate piene di gente viva, che non ricorda niente e vuole sapere il risultato."], [130, 150, 60, 50, "⚽ Novantesimo più tre. La partita si può finire, adesso."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
