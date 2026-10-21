// js/mondiale-bg.js - sfondi di «Ali di Rondine · Mondiale Giovanile» (320x200): titolo, colle, villaggio, spogliatoio, spiaggia, quartiere, stadio, neve, hotel, Tokyo, tempio.
// Animazioni: pallone che rimbalza, bandiere, onde, neve, neon, lanterne, tifosi. Ogni scena ha 3 punti cliccabili.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, 210); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const snow = (g, f, W, H, n) => { g.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < n; i++) { const x = (rnd(i) * W + Math.sin(f / 30 + i) * 8) % W, y = (rnd(i + 5) * H + f * (0.6 + rnd(i + 9))) % H; g.fillRect(x, y, 2, 2); } };
  const ball = (g, x, y, r) => { C(g, x, y, r, "#fff"); g.fillStyle = "#111"; g.beginPath(); g.arc(x, y, r * 0.35, 0, 7); g.fill(); for (let i = 0; i < 5; i++) { const a = i * 1.256; C(g, x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75, r * 0.2, "#111"); } };
  const bounce = (f, per, h) => Math.abs(Math.sin(f / per)) * h;
  const pitch = (g, W, y0, y1, f) => { for (let i = 0; i < 10; i++) R(g, 0, y0 + (y1 - y0) / 10 * i, W, (y1 - y0) / 10 + 1, i % 2 ? "#2f8a3f" : "#37994a"); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 2; g.strokeRect(20, y0 + 6, W - 40, y1 - y0 - 12); g.beginPath(); g.moveTo(W / 2, y0 + 6); g.lineTo(W / 2, y1 - 6); g.stroke(); g.beginPath(); g.arc(W / 2, (y0 + y1) / 2, 22, 0, 7); g.stroke(); };
  const player = (g, x, y, s, shirt, f, ph) => { const b = Math.sin(f / 6 + (ph || 0)) * 1.5; R(g, x - 3 * s, y - 10 * s + b, 6 * s, 8 * s, shirt); C(g, x, y - 13 * s + b, 3 * s, "#e8b88a"); R(g, x - 3 * s, y - 2 * s + b, 2.5 * s, 7 * s, "#111827"); R(g, x + 0.5 * s, y - 2 * s + b, 2.5 * s, 7 * s, "#111827"); };
  const flag = (g, x, y, w, h, cols, f) => { R(g, x, y, 1.5, h + 10, "#9ca3af"); const n = cols.length; for (let i = 0; i < n; i++) { g.fillStyle = cols[i]; g.beginPath(); g.moveTo(x + 1.5 + i * (w / n), y + Math.sin(f / 8 + i) * 1.5); g.lineTo(x + 1.5 + (i + 1) * (w / n), y + Math.sin(f / 8 + i + 1) * 1.5); g.lineTo(x + 1.5 + (i + 1) * (w / n), y + h + Math.sin(f / 8 + i + 1) * 1.5); g.lineTo(x + 1.5 + i * (w / n), y + h + Math.sin(f / 8 + i) * 1.5); g.fill(); } };
  const crowd = (g, f, y0, rows, W) => { const cs = ["#1d4ed8", "#f8fafc", "#16a34a", "#dc2626", "#facc15", "#7c3aed"]; for (let r = 0; r < rows; r++) for (let i = 0; i < W / 8; i++) { const b = Math.sin(f / 10 + i * 0.7 + r) * 1.2; R(g, i * 8 + 1, y0 + r * 8 + b, 6, 5, cs[Math.floor(rnd(i + r * 50) * 6)]); R(g, i * 8 + 2, y0 + r * 8 - 3 + b, 4, 3, "#f1c8a0"); } };
  const SC = {
    mg_titolo(g, W, H, f) {
      VG(g, 0, 130, "#1e3a8a", "#fb923c"); g.fillRect(0, 0, W, 130); GL(g, 250, 80, 90, "255,200,100", 0.35); C(g, 250, 78, 20, "#fde68a");
      for (let i = 0; i < 8; i++) { const x = (i * 52 + f * 0.2) % 360 - 20; R(g, x, 20 + (i % 3) * 14, 24, 5, "rgba(255,255,255,.35)"); }
      // quattro stadi in fila: Italia, Rio, Nord, Tokyo
      T(g, [0, 130, 70, 96, 140, 130], "#1e293b"); T(g, [90, 130, 170, 82, 250, 130], "#334155"); T(g, [200, 130, 270, 100, 320, 130], "#27303f");
      pitch(g, W, 130, 200, f); crowd(g, f, 116, 1, W);
      flag(g, 30, 94, 20, 12, ["#16a34a", "#f8fafc", "#dc2626"], f); flag(g, 120, 90, 20, 12, ["#facc15", "#16a34a", "#1d4ed8"], f); flag(g, 210, 94, 20, 12, ["#111", "#dc2626", "#facc15"], f); flag(g, 285, 100, 20, 12, ["#f8fafc", "#dc2626"], f);
      const bx = 160 + Math.sin(f / 40) * 90, by = 160 - bounce(f, 9, 34); C(g, bx, 188, 8, "rgba(0,0,0,.25)"); ball(g, bx, by, 9);
      player(g, 100, 178, 1.6, "#2563eb", f, 0); player(g, 215, 178, 1.6, "#2563eb", f, 2); VIG(g, W, H, 0.4);
    },
    mg_colle(g, W, H, f) {
      VG(g, 0, 120, "#7dd3fc", "#fef3c7"); g.fillRect(0, 0, W, 120); for (let i = 0; i < 5; i++) R(g, (i * 70 + f * 0.15) % 360 - 30, 18 + (i % 3) * 12, 40, 8, "rgba(255,255,255,.8)");
      T(g, [0, 120, 80, 56, 170, 120], "#a3b18a"); T(g, [110, 120, 220, 40, 320, 120], "#8a9a6a"); R(g, 0, 118, W, 82, "#5f9a47");
      for (let i = 0; i < 6; i++) { const x = i * 56 + 12; R(g, x, 126 + (i % 2) * 8, 5, 12, "#5a3a22"); C(g, x + 2, 124 + (i % 2) * 8, 11, "#2f6a35"); }
      R(g, 60, 112, 200, 56, "#d8b97c"); T(g, [52, 112, 160, 80, 268, 112], "#b45309"); R(g, 130, 130, 60, 38, "#3a2a1a"); R(g, 134, 134, 52, 34, "#7c5a30"); flag(g, 150, 70, 22, 12, ["#16a34a", "#f8fafc", "#dc2626"], f);
      R(g, 0, 168, W, 32, "#9a8a66"); for (let i = 0; i < 6; i++) R(g, 20 + i * 52, 172, 30, 2, "#cbbd96");
      const bx = 60 + (f * 0.6) % 200, by = 182 - bounce(f, 7, 14); ball(g, bx, by, 6); VIG(g, W, H, 0.25);
    },
    mg_villaggio(g, W, H, f) {
      VG(g, 0, 90, "#60a5fa", "#fde68a"); g.fillRect(0, 0, W, 90); R(g, 0, 90, W, 110, "#2f8a3f"); pitch(g, W, 100, 190, f);
      for (let i = 0; i < 4; i++) { R(g, 10 + i * 82, 54, 60, 36, ["#e2c48a", "#d6b878", "#e8cf9c", "#d2b27a"][i]); T(g, [4 + i * 82, 54, 40 + i * 82, 34, 76 + i * 82, 54], "#b45309"); R(g, 22 + i * 82, 66, 10, 12, "#fde68a"); R(g, 44 + i * 82, 66, 10, 12, "rgba(253,224,140,.8)"); }
      [[70, 150, 0], [150, 130, 1], [230, 160, 2], [110, 175, 3]].forEach(([x, y, k]) => { player(g, x + Math.sin(f / 30 + k) * 12, y, 1.5, ["#2563eb", "#f8fafc", "#2563eb", "#facc15"][k], f, k); });
      const bx = 160 + Math.sin(f / 25) * 60, by = 150 - bounce(f, 8, 20); ball(g, bx, by, 6); GL(g, 160, 30, 80, "255,230,150", 0.2); VIG(g, W, H, 0.3);
    },
    mg_spogliatoio(g, W, H, f) {
      R(g, 0, 0, W, 200, "#cbd5e1"); R(g, 0, 150, W, 50, "#94a3b8"); for (let i = 0; i < 6; i++) { R(g, 10 + i * 52, 40, 40, 100, "#475569"); R(g, 13 + i * 52, 43, 15, 94, "#64748b"); R(g, 31 + i * 52, 43, 15, 94, "#64748b"); R(g, 24 + i * 52, 80, 2, 6, "#e2e8f0"); R(g, 40 + i * 52, 80, 2, 6, "#e2e8f0"); }
      R(g, 20, 130, 280, 10, "#1e3a8a"); R(g, 20, 150, 280, 6, "#f8fafc"); for (let i = 0; i < 5; i++) { C(g, 40 + i * 58, 118, 6, ["#dc2626", "#fde047", "#2563eb", "#16a34a", "#f8fafc"][i]); R(g, 34 + i * 58, 124, 12, 6, "#1d4ed8"); }
      R(g, 120, 6, 80, 26, "#0f172a"); R(g, 123, 9, 74, 20, "#1e293b"); R(g, 128, 14, 12, 10, `rgba(253,224,71,${0.6 + 0.3 * Math.sin(f / 15)})`); R(g, 148, 14, 40, 3, "#94a3b8"); R(g, 148, 20, 30, 3, "#94a3b8");
      ball(g, 270 + Math.sin(f / 20) * 4, 172 - bounce(f, 10, 6), 8); GL(g, 160, 0, 120, "255,255,240", 0.25); VIG(g, W, H, 0.3);
    },
    mg_spiaggia(g, W, H, f) {
      VG(g, 0, 100, "#38bdf8", "#fde68a"); g.fillRect(0, 0, W, 100); C(g, 250, 36, 22, "#fde047"); GL(g, 250, 36, 80, "255,220,120", 0.4);
      R(g, 0, 70, W, 40, "#0ea5e9"); for (let i = 0; i < 12; i++) R(g, (i * 30 + f * 0.8) % 340 - 10, 78 + (i % 4) * 8, 18, 2, "rgba(255,255,255,.5)"); R(g, 0, 104, W, 96, "#f1d9a0");
      T(g, [0, 100, 60, 64, 140, 100], "#15803d"); for (let i = 0; i < 4; i++) { const x = 30 + i * 80; R(g, x, 100, 3, 36, "#8a6a3e"); for (let k = 0; k < 5; k++) { const a = -2.6 + k * 0.6 + Math.sin(f / 30 + i) * 0.05; T(g, [x + 1, 100, x + 1 + Math.cos(a) * 20, 100 + Math.sin(a) * 14, x + 1 + Math.cos(a) * 12, 104], "#15803d"); } }
      pitch(g, W, 130, 190, f); g.globalAlpha = 0.35; R(g, 0, 130, W, 60, "#f1d9a0"); g.globalAlpha = 1;
      for (let i = 0; i < 3; i++) player(g, 90 + i * 70 + Math.sin(f / 22 + i) * 14, 172, 1.5, ["#facc15", "#16a34a", "#facc15"][i], f, i);
      ball(g, 150 + Math.sin(f / 18) * 60, 158 - bounce(f, 7, 22), 6); VIG(g, W, H, 0.2);
    },
    mg_quartiere(g, W, H, f) {
      VG(g, 0, 90, "#fb923c", "#fde68a"); g.fillRect(0, 0, W, 90); C(g, 70, 40, 16, "#fff7c2");
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { const x = i * 38 - 6 + (r % 2) * 14, y = 66 + r * 30, c = ["#fde047", "#fb7185", "#38bdf8", "#4ade80", "#fb923c", "#c084fc"][(i + r * 2) % 6]; R(g, x, y, 34, 30, c); R(g, x, y, 34, 4, "rgba(0,0,0,.18)"); R(g, x + 6, y + 10, 8, 10, "rgba(40,30,20,.6)"); R(g, x + 20, y + 10, 8, 10, rnd(i + r) > 0.5 ? "rgba(255,240,150,.85)" : "rgba(40,30,20,.6)"); }
      R(g, 0, 160, W, 40, "#78716c"); for (let i = 0; i < 8; i++) R(g, i * 42 + 4, 168, 20, 2, "#a8a29e");
      for (let i = 0; i < 12; i++) { const x = (i * 30 + f * 0.3) % 330 - 5; R(g, x, 58 + (i % 3) * 3, 8, 8, ["#dc2626", "#fde047", "#16a34a", "#2563eb"][i % 4]); R(g, x + 3, 56, 1, 4, "#e5e7eb"); }
      for (let i = 0; i < 3; i++) player(g, 90 + i * 60 + Math.sin(f / 20 + i) * 10, 188, 1.6, ["#16a34a", "#facc15", "#2563eb"][i], f, i); ball(g, 150 + Math.sin(f / 20) * 40, 176 - bounce(f, 7, 18), 6); VIG(g, W, H, 0.3);
    },
    mg_stadio(g, W, H, f) {
      VG(g, 0, 60, "#0f172a", "#1e3a8a"); g.fillRect(0, 0, W, 60); for (let i = 0; i < 30; i++) R(g, rnd(i) * W, rnd(i + 3) * 40, 1, 1, `rgba(255,255,255,${0.4 + 0.4 * Math.sin(f / 20 + i)})`);
      R(g, 0, 50, W, 70, "#1f2937"); crowd(g, f, 54, 7, W); R(g, 0, 118, W, 82, "#2f8a3f"); pitch(g, W, 124, 196, f);
      for (let i = 0; i < 4; i++) { GL(g, 30 + i * 90, 10, 60, "255,255,220", 0.4); R(g, 24 + i * 90, 6, 14, 6, "#fef9c3"); }
      for (let i = 0; i < 5; i++) player(g, 70 + i * 45 + Math.sin(f / 25 + i) * 10, 170 + (i % 2) * 10, 1.4, i % 2 ? "#2563eb" : "#facc15", f, i);
      ball(g, 150 + Math.sin(f / 22) * 40, 160 - bounce(f, 8, 22), 6); VIG(g, W, H, 0.35);
    },
    mg_neve(g, W, H, f) {
      VG(g, 0, 120, "#94a3b8", "#e2e8f0"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 5; i++) { const x = i * 66 + 6; R(g, x, 50, 56, 90, ["#d6c7ae", "#cdbd9e"][i % 2]); T(g, [x - 4, 50, x + 28, 22, x + 60, 50], "#e5eef4"); R(g, x + 12, 70, 12, 14, rnd(i) > 0.4 ? "rgba(253,224,140,.9)" : "#475569"); R(g, x + 34, 70, 12, 14, "rgba(253,224,140,.9)"); R(g, x, 96, 56, 2, "#4a2c1a"); GL(g, x + 18, 77, 24, "255,220,140", 0.18); }
      R(g, 0, 140, W, 60, "#f1f5f9"); R(g, 0, 150, W, 14, "#94a3b8"); for (let i = 0; i < 8; i++) R(g, i * 42 + 10, 156, 22, 2, "#e5e7eb");
      R(g, 130, 100, 60, 8, "#1e293b"); R(g, 140, 108, 4, 30, "#475569"); R(g, 176, 108, 4, 30, "#475569"); R(g, 130, 100, 60, 2, "#facc15");
      player(g, 100, 188, 1.6, "#2563eb", f, 0); player(g, 128, 190, 1.6, "#2563eb", f, 2); snow(g, f, W, H, 80); VIG(g, W, H, 0.3);
    },
    mg_hotel(g, W, H, f) {
      R(g, 0, 0, W, 200, "#e7d9bd"); R(g, 0, 150, W, 50, "#8a5a34"); for (let i = 0; i < 6; i++) R(g, i * 54, 150 + (i % 2) * 6, 54, 2, "rgba(0,0,0,.2)");
      for (let i = 0; i < 3; i++) { R(g, 30 + i * 100, 40, 60, 70, "#1e3a8a"); R(g, 34 + i * 100, 44, 52, 62, "rgba(147,197,253,.55)"); R(g, 59 + i * 100, 44, 2, 62, "#1e3a8a"); }
      R(g, 100, 112, 120, 30, "#7c2d12"); R(g, 100, 112, 120, 5, "#a16207"); R(g, 130, 96, 60, 14, "#0f172a"); R(g, 135, 100, 50, 6, `rgba(253,224,71,${0.6 + 0.3 * Math.sin(f / 18)})`);
      GL(g, 160, 20, 140, "255,230,170", 0.3); ball(g, 270, 176 - bounce(f, 12, 4), 7); VIG(g, W, H, 0.3);
    },
    mg_tokyo(g, W, H, f) {
      VG(g, 0, 140, "#1e1b4b", "#701a75"); g.fillRect(0, 0, W, 200); C(g, 250, 40, 14, "#fde68a");
      for (let i = 0; i < 10; i++) { const x = i * 34 - 4, h = 60 + rnd(i) * 60; R(g, x, 140 - h, 30, h + 60, "#0b0a1a"); for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) if (rnd(i * 9 + r * 3 + c) > 0.45) R(g, x + 4 + c * 9, 146 - h + r * 11, 5, 6, `rgba(253,224,140,${0.5 + 0.4 * Math.sin(f / 20 + i + r)})`); }
      ["#f472b6", "#22d3ee", "#facc15", "#a78bfa"].forEach((c, i) => { const x = 20 + i * 76; R(g, x, 70 + (i % 2) * 20, 26, 12, c); GL(g, x + 13, 76 + (i % 2) * 20, 40, c === "#facc15" ? "250,204,21" : "240,120,200", 0.3 + 0.15 * Math.sin(f / 12 + i)); });
      R(g, 0, 150, W, 50, "#111827"); for (let i = 0; i < 8; i++) R(g, i * 42 + 6, 172, 22, 2, "#fde68a");
      for (let i = 0; i < 14; i++) { const x = (i * 25 + f * 0.4) % 330 - 5; C(g, x, 130 + (i % 3) * 5, 3, "#f9a8d4"); }
      player(g, 120, 190, 1.7, "#2563eb", f, 0); player(g, 205, 190, 1.7, "#f8fafc", f, 2); ball(g, 162, 180 - bounce(f, 8, 8), 6); VIG(g, W, H, 0.3);
    },
    mg_tempio(g, W, H, f) {
      VG(g, 0, 130, "#fdba74", "#fef3c7"); g.fillRect(0, 0, W, 130); C(g, 80, 48, 20, "#fff7e6");
      R(g, 0, 130, W, 70, "#cbd5a0"); for (let i = 0; i < 6; i++) { const x = i * 56 + 12; R(g, x, 100, 5, 38, "#4a2c1a"); [["#f9a8d4", 0, 0], ["#fbcfe8", -8, 6], ["#f472b6", 8, 6]].forEach(([c, dx, dy]) => C(g, x + 2 + dx, 98 + dy, 12, c)); }
      R(g, 118, 74, 84, 66, "#7f1d1d"); T(g, [100, 80, 160, 40, 220, 80], "#27303f"); R(g, 100, 78, 120, 4, "#9ca3af"); R(g, 130, 100, 60, 40, "#3a2a22"); R(g, 150, 108, 20, 32, "#f5ecd0");
      for (let i = 0; i < 3; i++) { const x = 40 + i * 120; R(g, x, 150, 4, 28, "#b91c1c"); R(g, x + 20, 150, 4, 28, "#b91c1c"); R(g, x - 4, 146, 32, 5, "#7f1d1d"); }
      for (let i = 0; i < 5; i++) { const x = 52 + i * 54, y = 116 + Math.sin(f / 20 + i) * 3; R(g, x, y, 10, 14, "#dc2626"); GL(g, x + 5, y + 7, 22, "255,100,60", 0.3); }
      for (let i = 0; i < 16; i++) { const x = (i * 21 + f * 0.5) % 330, y = (i * 17 + f * 0.8) % 140; R(g, x, y, 2, 2, "#fbcfe8"); }
      player(g, 160, 186, 1.7, "#2563eb", f, 0); VIG(g, W, H, 0.25);
    }
  };
  const HOT = {
    mg_titolo: [[30, 90, 60, 40, "🇮🇹 Il raduno: venti ragazzi, un solo pallone e un CT che non ride mai."], [200, 70, 60, 60, "🌏 Quattro stadi, quattro stili: samba, ferro, neve, neon."], [110, 150, 100, 40, "⚽ La catena: tre passaggi e un tiro. Il resto è tempismo."]],
    mg_colle: [[60, 112, 200, 56, "🏟️ Il centro tecnico: ci si allena da quarant'anni con le stesse reti rattoppate."], [140, 70, 40, 40, "🇮🇹 La bandiera: ogni mattina qualcuno la saluta, ogni sera qualcuno la ripiega."], [20, 130, 70, 40, "🌲 I pini: ombra, cicale e un sassolino sotto ogni scarpa."]],
    mg_villaggio: [[20, 100, 280, 90, "⚽ Il campo: a righe, come i grembiuli delle nonne."], [10, 34, 250, 56, "🏠 Le casette: una per ogni sogno, due per ogni russatore."], [120, 130, 60, 40, "🎯 I coni: piazzati con precisione militare e saltati con poca devozione."]],
    mg_spogliatoio: [[10, 40, 300, 100, "🗄️ Gli armadietti: dentro, scarpini e segreti."], [120, 6, 80, 26, "📋 La lavagna: il piano del CT, scritto con una grafia da medico."], [250, 160, 40, 30, "⚽ Il pallone di scorta: ha giocato più partite di tutti."]],
    mg_spiaggia: [[0, 70, 320, 40, "🌊 Il mare: un'ottima scusa per arrivare tardi."], [230, 14, 40, 44, "☀️ Il sole: qui il pomeriggio comincia alle nove."], [20, 100, 300, 40, "🌴 Le palme: ogni palla persa ha una palma di fiducia."]],
    mg_quartiere: [[0, 60, 320, 100, "🏘️ Le case: colori a secchiate e mai una parete uguale all'altra."], [0, 56, 320, 12, "🎏 Le bandierine: ogni partita ha la sua festa."], [60, 168, 200, 30, "🛣️ La strada: campo, mercato e sala ricevimenti."]],
    mg_stadio: [[0, 50, 320, 70, "👥 La curva: qui il rumore si misura in decibel e fede."], [20, 0, 280, 20, "💡 I riflettori: trasformano la notte in pomeriggio."], [20, 124, 280, 70, "🟩 Il prato: perfetto, tranne dove c'è la storia."]],
    mg_neve: [[0, 50, 320, 90, "🏠 Le case a graticcio: tetti bianchi, finestre come lanterne."], [130, 100, 60, 40, "🚉 La pensilina: il treno arriva in orario, la neve no."], [0, 150, 320, 40, "❄️ La neve: il campo si finisce quando comincia."]],
    mg_hotel: [[30, 40, 260, 70, "🪟 Le vetrate: mille finestre, nessuna aperta."], [100, 112, 120, 30, "🛎️ Il bancone: una campanella e un sorriso preconfezionato."], [250, 160, 40, 30, "⚽ Il pallone del ritiro: lo si coccola come un ospite."]],
    mg_tokyo: [[0, 60, 320, 40, "🏮 Le insegne: neon rosa e ciano, un caffè ogni due passi."], [0, 130, 320, 20, "🌸 I petali: portati dal vento, non da nessuno."], [100, 150, 120, 50, "🚦 Il semaforo: qui si aspetta il verde con pazienza da portiere."]],
    mg_tempio: [[100, 40, 120, 100, "⛩️ Il tempio: un luogo dove ci si inchina prima del calcio d'inizio."], [30, 90, 260, 50, "🌸 I ciliegi: fioriscono una volta l'anno, come certi rigori."], [40, 146, 240, 40, "🏮 Le torii: ogni portale è un'idea di partita."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
