// js/quattordici-bg.js - sfondi di «Il Torneo dei Quattordici» (320x200, prospettiva, luci calde e animazioni).
// Registrati con window.__lbBg.register; i punti cliccabili (hot) restano quelli di bg-scenarios.js (qt_*).
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, x0, y0, x1, y1, a, b) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const MOTES = (g, W, H, f, n, rgb) => { for (let i = 0; i < n; i++) { const x = (i * 83 + f * (0.12 + (i % 3) * 0.05)) % W, y = (i * 47 + Math.sin(f / 40 + i) * 8 + 400) % H; g.fillStyle = `rgba(${rgb},${0.3 + 0.3 * Math.sin(f / 22 + i)})`; g.fillRect(x, y, 1.6, 1.6); } };
  const lamps = (g, f, n, x0, x1, y, on) => { for (let i = 0; i < n; i++) { const x = x0 + (x1 - x0) * (i / (n - 1)), lit = i < on; C(g, x, y, 3.4, lit ? "#fde047" : "#3f3f46"); if (lit) GL(g, x, y, 16, "253,224,71", 0.45 + Math.sin(f / 18 + i) * 0.05); } };
  const chandelier = (g, x, y, f, s) => { R(g, x, 0, 1, y - 6 * s, "#7a6a3a"); R(g, x - 9 * s, y - 3 * s, 18 * s, 3 * s, "#d4af37"); for (let k = -3; k <= 3; k++) { R(g, x + k * 3 * s - 1, y - 8 * s, 2, 5 * s, "#fff3c0"); R(g, x + k * 2.4 * s - 1, y, 1.5, 4 + (k * k % 3), "rgba(255,243,192,.8)"); } GL(g, x, y - 4 * s, 60 * s, "255,214,130", 0.4 + Math.sin(f / 40 + x) * 0.04); };
  const person = (g, x, y, col, s, hair) => { s = s || 1; R(g, x - 3 * s, y - 10 * s, 6 * s, 10 * s, col); C(g, x, y - 13 * s, 3.2 * s, "#e0b890"); R(g, x - 3.3 * s, y - 16.5 * s, 6.6 * s, 3 * s, hair || "#2a1a10"); R(g, x - 3 * s, y, 2.4 * s, 5 * s, "#1f2937"); R(g, x + 0.6 * s, y, 2.4 * s, 5 * s, "#1f2937"); };
  const marbleFloor = (g, W, H, y0, a, b) => { R(g, 0, y0, W, H - y0, a); const n = 12; for (let r = 0; r < 9; r++) { const y = y0 + r * r * 1.6 + r * 2, h = 4 + r * 1.6, k = 6 + r * 2.4; for (let c = -2; c < W / k + 2; c++) if ((c + r) % 2) R(g, c * k + (r % 2) * k * 0.5, y, k, h, b); R(g, 0, y, W, 1, "rgba(255,255,255,.12)"); } VG(g, 0, y0, 0, H, "rgba(255,255,255,.12)", "rgba(0,0,0,.35)"); g.fillRect(0, y0, W, H - y0); };
  const column = (g, x, y0, y1, w, f) => { VG(g, x, 0, x + w, 0, "#bdb7ae", "#f3efe8"); g.fillRect(x, y0, w, y1 - y0); R(g, x + w * 0.7, y0, w * 0.3, y1 - y0, "rgba(0,0,0,.18)"); R(g, x - 3, y0, w + 6, 6, "#d6d1c8"); R(g, x - 3, y1 - 5, w + 6, 6, "#d6d1c8"); for (let i = 0; i < 3; i++) R(g, x + 3 + i * (w / 4), y0 + 6, 1, y1 - y0 - 11, "rgba(0,0,0,.08)"); };
  const SC = {
    qt_titolo(g, W, H, f) {
      VG(g, 0, 0, 0, H, "#07060f", "#5a1a38"); g.fillRect(0, 0, W, H);
      for (let i = 0; i < 60; i++) R(g, rnd(i) * W, rnd(i + 9) * 90, 1, 1, `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(f / 30 + i))})`);
      C(g, 250, 38, 14, "#f6e7c1"); C(g, 255, 35, 13, "#160a1c"); GL(g, 250, 38, 40, "246,231,193", 0.18);
      g.fillStyle = "#1d0a14"; g.beginPath(); g.moveTo(0, 150); for (let x = 0; x <= W; x += 16) g.lineTo(x, 130 - 18 * Math.sin(x * 0.03 + 1) - 8 * Math.sin(x * 0.09)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      R(g, 90, 82, 140, 64, "#2d1119"); R(g, 78, 106, 164, 42, "#3a1621"); R(g, 130, 60, 60, 26, "#2d1119"); R(g, 150, 46, 20, 16, "#3a1621"); R(g, 158, 36, 4, 12, "#6b5a2a"); g.fillStyle = "#d4af37"; g.beginPath(); g.moveTo(152, 36); g.lineTo(168, 36); g.lineTo(160, 28); g.fill();
      for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++) { const lit = (c * 5 + r * 3 + (f / 60 | 0)) % 5 > 0; R(g, 86 + c * 12.4, 90 + r * 14, 6, 8, lit ? "#fde047" : "#5a3a2a"); if (lit) GL(g, 89 + c * 12.4, 94 + r * 14, 9, "253,224,71", 0.12); }
      R(g, 150, 126, 20, 22, "#120508"); R(g, 152, 128, 16, 20, "#fde047"); R(g, 159, 128, 2, 20, "#120508");
      R(g, 150, 148, 20, 4, "#8a1c34"); for (let i = 0; i < 6; i++) R(g, 146 + i * 6, 152 + i, 28 - i * 2, 1, "rgba(138,28,52,.6)");
      lamps(g, f, 14, 40, 280, 14, 14 - ((f / 240 | 0) % 2));
      g.font = "900 20px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fecaca"; g.fillText("IL TORNEO", 160, 176); g.fillStyle = "#facc15"; g.font = "900 15px Georgia, serif"; g.fillText("DEI QUATTORDICI", 160, 193); g.textAlign = "left";
      MOTES(g, W, H, f, 24, "254,202,202"); VIG(g, W, H, 0.45);
    },
    qt_atrio(g, W, H, f) {
      VG(g, 0, 0, 0, 110, "#2a0f18", "#4a1a26"); g.fillRect(0, 0, W, 110);
      for (let i = 0; i < 40; i++) { R(g, 6 + i * 8, 10, 2, 96, "rgba(212,175,55,.07)"); } R(g, 0, 14, W, 3, "#d4af37"); R(g, 0, 104, W, 6, "#d4af37"); R(g, 0, 110, W, 8, "#3a1621");
      for (let i = 0; i < 3; i++) { const x = 28 + i * 100; R(g, x, 28, 56, 62, "#e8d9b0"); R(g, x + 3, 31, 50, 56, ["#3a5a8a", "#7a5a3a", "#5a7a4a"][i]); R(g, x + 8, 60, 40, 22, "rgba(0,0,0,.25)"); C(g, x + 30, 48, 8, "rgba(255,255,255,.4)"); }
      marbleFloor(g, W, H, 112, "#e5dccb", "#c9bfa8");
      R(g, 118, 118, 84, 6, "#8a1c34"); for (let i = 0; i < 30; i++) R(g, 150 - i * 4.5 + i * 0.5, 124 + i * 2.6, 20 + i * 9, 3, i % 2 ? "#8a1c34" : "#a82a48"); R(g, 120, 190, 80, 2, "#d4af37");
      [[18, 20], [286, 20]].forEach(([x]) => column(g, x, 20, 128, 16, f)); column(g, 98, 24, 126, 12, f); column(g, 212, 24, 126, 12, f);
      R(g, 108, 86, 104, 34, "#4a2a16"); R(g, 104, 80, 112, 8, "#7c5230"); R(g, 104, 80, 112, 1, "#c9a24a"); C(g, 160, 76, 3, "#facc15"); R(g, 130, 66, 60, 10, "#1a0f0a"); R(g, 134, 68, 52, 6, "#d4af37");
      g.font = "700 6px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#3a2a10"; g.fillText("RECEPTION", 160, 73); g.textAlign = "left";
      person(g, 160, 100, "#111827", 1.2, "#555"); person(g, 70, 150, "#1e3a8a", 1.4, "#1a1a1a"); person(g, 252, 156, "#9a1f3f", 1.5, "#d97706");
      chandelier(g, 90, 36, f, 1.5); chandelier(g, 160, 24, f, 2); chandelier(g, 230, 36, f, 1.5);
      GL(g, 160, 150, 90, "255,214,130", 0.12); MOTES(g, W, H, f, 22, "255,230,170"); VIG(g, W, H, 0.4);
    },
    qt_stadio(g, W, H, f) {
      VG(g, 0, 0, 0, 90, "#050913", "#1b2a52"); g.fillRect(0, 0, W, 90);
      for (let i = 0; i < 50; i++) R(g, rnd(i) * W, rnd(i + 4) * 40, 1, 1, `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(f / 30 + i))})`);
      R(g, 0, 64, W, 36, "#232a3a"); for (let r = 0; r < 5; r++) { R(g, 0, 62 + r * 7, W, 1, "#3a4358"); for (let c = 0; c < 64; c++) { const col = ["#dc2626", "#fde047", "#f8fafc", "#2563eb", "#7f1d1d", "#f97316"][(c * 7 + r * 3) % 6]; if (rnd(c + r * 70) > 0.15) { C(g, c * 5 + 2, 66 + r * 7 + Math.sin(f / 14 + c) * 0.6, 1.8, col); R(g, c * 5, 68 + r * 7, 4, 3, col); } } }
      [28, 292].forEach((x) => { R(g, x - 2, 8, 4, 70, "#2a3244"); R(g, x - 16, 4, 32, 12, "#111827"); for (let i = 0; i < 6; i++) C(g, x - 12 + i * 5, 10, 2, "#fff7d1"); GL(g, x, 12, 80, "255,244,214", 0.4); });
      VG(g, 0, 100, 0, H, "#1b6b3a", "#14522b"); g.fillRect(0, 100, W, 100); for (let i = 0; i < 9; i++) R(g, i * 36 - 18, 100, 18, 100, "rgba(255,255,255,.05)");
      g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 2; g.strokeRect(20, 112, 280, 80); g.beginPath(); g.moveTo(160, 112); g.lineTo(160, 192); g.stroke(); g.beginPath(); g.ellipse(160, 152, 30, 14, 0, 0, 7); g.stroke();
      const b = 8 + (Math.sin(f / 30) + 1) * 6; R(g, 20, 112, 280, b, "rgba(220,38,38,.38)"); R(g, 20, 192 - b, 280, b, "rgba(220,38,38,.38)");
      R(g, 64, 20, 192, 26, "#0b0f1a"); R(g, 62, 18, 196, 2, "#6b7280"); lamps(g, f, 14, 74, 246, 33, 14 - ((f / 300 | 0) % 5)); g.font = "700 6px Georgia"; g.textAlign = "center"; g.fillStyle = "#fecaca"; g.fillText("ZONA ROSSA", 160, 26); g.textAlign = "left";
      person(g, 120, 154, "#2563eb", 1.2, "#1a1a1a"); person(g, 200, 150, "#dc2626", 1.2, "#6b3a1a"); C(g, 160 + Math.sin(f / 40) * 6, 154, 3, "#fff");
      VIG(g, W, H, 0.42);
    },
    qt_giardino(g, W, H, f) {
      VG(g, 0, 0, 0, 120, "#1e3a5f", "#fdba74"); g.fillRect(0, 0, W, 120); C(g, 70, 66, 24, "rgba(255,237,180,.9)"); GL(g, 70, 66, 90, "255,200,120", 0.3);
      for (let i = 0; i < 3; i++) R(g, ((i * 140 + f * 0.1) % 380) - 40, 20 + i * 18, 52, 6, "rgba(255,255,255,.35)");
      g.fillStyle = "#355e46"; g.beginPath(); g.moveTo(0, 100); for (let x = 0; x <= W; x += 20) g.lineTo(x, 88 - 10 * Math.sin(x * 0.04)); g.lineTo(W, 120); g.lineTo(0, 120); g.fill();
      VG(g, 0, 110, 0, H, "#3a9456", "#1f6a3a"); g.fillRect(0, 110, W, 90); for (let r = 0; r < 8; r++) R(g, 0, 118 + r * r * 1.1 + r * 3, W, 5 + r, r % 2 ? "rgba(0,0,0,.07)" : "rgba(255,255,255,.05)");
      g.fillStyle = "#d8c996"; g.beginPath(); g.moveTo(150, 112); g.lineTo(170, 112); g.lineTo(250, H); g.lineTo(70, H); g.fill();
      for (let i = 0; i < 12; i++) R(g, 154 - i * 7 + i * 0.6, 114 + i * 7.4, 12 + i * 14, 1, "rgba(0,0,0,.1)");
      [[34, 96, 1.2], [96, 104, 1], [232, 100, 1.1], [290, 96, 1.3]].forEach(([x, y, s]) => { R(g, x - 3 * s, y, 6 * s, 28 * s, "#4a3524"); C(g, x, y - 6 * s, 24 * s, "#14532d"); C(g, x - 12 * s, y, 18 * s, "#166534"); C(g, x + 12 * s, y + 2, 17 * s, "#15803d"); C(g, x - 6 * s, y - 14 * s, 12 * s, "#22863a"); });
      for (let i = 0; i < 9; i++) { const x = 10 + i * 36, y = 150 + (i % 3) * 14; R(g, x, y + 4, 2, 6, "#166534"); C(g, x + 1, y + 2, 3, ["#fb7185", "#fde047", "#f472b6"][i % 3]); }
      R(g, 100, 122, 110, 3, "#8a8a88"); g.fillStyle = "#3b82a0"; g.beginPath(); g.ellipse(160, 144, 44, 11, 0, 0, 7); g.fill(); g.strokeStyle = "#9aa0a6"; g.lineWidth = 3; g.stroke();
      for (let i = 0; i < 5; i++) { const t = (f / 30 + i * 1.3) % 6.28; g.strokeStyle = `rgba(255,255,255,${0.3 - i * 0.04})`; g.lineWidth = 1; g.beginPath(); g.ellipse(160, 144, 6 + ((f / 3 + i * 9) % 38), 2 + ((f / 12 + i * 3) % 9) * 0.6, 0, 0, 7); g.stroke(); }
      R(g, 156, 124, 8, 18, "#c9c4bb"); for (let i = 0; i < 6; i++) R(g, 160 + Math.sin(f / 8 + i) * 2, 112 + ((f * 1.4 + i * 6) % 24), 1.5, 3, "rgba(190,230,255,.8)");
      for (let i = 0; i < 18; i++) R(g, (i * 53 + f * 0.6) % W, (i * 31 + f * 0.4) % 180, 2, 1.4, "rgba(255,170,190,.7)");
      VIG(g, W, H, 0.3);
    },
    qt_archivio(g, W, H, f) {
      VG(g, 0, 0, 0, H, "#150e08", "#2a1c10"); g.fillRect(0, 0, W, H); R(g, 0, 146, W, 54, "#4a3524"); for (let i = 0; i < 9; i++) { R(g, 0, 146 + i * i * 0.7 + i * 2, W, 1, "rgba(0,0,0,.35)"); }
      const cols = ["#991b1b", "#1d4ed8", "#a16207", "#166534", "#6d28d9", "#9a3412", "#0e7490"];
      for (let c = 0; c < 6; c++) { const x = 4 + c * 52; R(g, x, 10, 46, 138, "#2a1a10"); R(g, x, 10, 46, 3, "#6b4a2a"); for (let r = 0; r < 6; r++) { const y = 16 + r * 22; R(g, x + 2, y + 18, 42, 3, "#6b4a2a"); for (let k = 0; k < 11; k++) { const h = 12 + rnd(c * 77 + r * 13 + k) * 6; R(g, x + 3 + k * 3.6, y + 18 - h, 3, h, cols[(c + r + k * 3) % 7]); R(g, x + 3 + k * 3.6, y + 18 - h, 1, h, "rgba(255,255,255,.12)"); } } }
      R(g, 118, 10, 84, 138, "#1a0f08"); R(g, 130, 100, 60, 32, "#5a3a22"); R(g, 126, 94, 68, 7, "#8a5a30"); R(g, 134, 82, 12, 14, "#fff3c0"); GL(g, 140, 86, 60, "190,255,170", 0.25 + Math.sin(f / 30) * 0.03); R(g, 148, 70, 40, 24, "#3a2a1c"); R(g, 150, 72, 36, 20, "#e8dcc0"); for (let i = 0; i < 5; i++) R(g, 154, 76 + i * 3.4, 28, 1, "#7a6a50");
      R(g, 136, 52, 48, 20, "#1c1208"); R(g, 138, 54, 44, 16, "#4a2a1c"); person(g, 160, 126, "#374151", 1.3, "#c9c9c9");
      HD_BEAM(g, 160, 0, 22, 150, "255,226,150", 0.22); MOTES(g, W, H, f, 40, "255,226,150"); VIG(g, W, H, 0.5);
    },
    qt_alanord(g, W, H, f) {
      VG(g, 0, 0, 0, H, "#05080f", "#1b2433"); g.fillRect(0, 0, W, H); R(g, 0, 130, W, 70, "#2d3745"); for (let i = 0; i < 12; i++) { R(g, 0, 130 + i * i * 0.4 + i, W, 1, "rgba(0,0,0,.35)"); }
      g.fillStyle = "#3b4658"; g.beginPath(); g.moveTo(130, 60); g.lineTo(190, 60); g.lineTo(320, 130); g.lineTo(0, 130); g.fill();
      for (let i = 0; i < 6; i++) { const x = 8 + i * 52; R(g, x, 40, 40, 90, "#1a2230"); R(g, x + 4, 46, 32, 80, "#26303f"); R(g, x + 12, 56, 16, 8, "#9aa5b5"); g.font = "700 6px monospace"; g.fillStyle = "#0b1220"; g.fillText(String(11 + i), x + 15, 62); R(g, x + 16, 90, 8, 2, "rgba(220,38,38,.6)"); }
      R(g, 130, 66, 60, 62, "#111827"); R(g, 134, 70, 52, 58, "#0b0f1a"); R(g, 158, 70, 4, 58, "#374151");
      for (let i = 0; i < 14; i++) R(g, 40 + i * 20, 134 + (i % 2), 8, 2, "rgba(250,204,21,.5)");
      const on = Math.floor(f / 40) % 2; C(g, 160, 28, 6, on ? "#ef4444" : "#7f1d1d"); GL(g, 160, 28, 140, "220,38,38", on ? 0.4 : 0.15);
      [[20, 90], [300, 90]].forEach(([x, y], i) => { C(g, x, y, 5, (on ^ i) ? "#ef4444" : "#7f1d1d"); GL(g, x, y, 50, "220,38,38", (on ^ i) ? 0.35 : 0.1); });
      R(g, 210, 100, 80, 30, "#374151"); R(g, 214, 92, 72, 10, "#4b5563"); R(g, 220, 106, 20, 14, "#9ca3af"); R(g, 250, 108, 28, 10, "#6b7280");
      for (let i = 0; i < 4; i++) { R(g, 80 + i * 4, 150 + i * 6, 38 - i * 4, 1.2, `rgba(148,163,184,${0.4 - i * 0.07})`); }
      MOTES(g, W, H, f, 20, "180,200,230"); VIG(g, W, H, 0.55);
    },
    qt_sipario(g, W, H, f) {
      VG(g, 0, 0, 0, H, "#0a0308", "#2a0a18"); g.fillRect(0, 0, W, H); R(g, 0, 150, W, 50, "#4a0f22"); for (let i = 0; i < 14; i++) R(g, i * 24, 150, 1, 50, "rgba(0,0,0,.3)"); R(g, 0, 150, W, 3, "#e0b84a");
      const sw = Math.sin(f / 60) * 3;
      [0, 1].forEach((side) => { for (let i = 0; i < 9; i++) { const x = side ? W - 48 + i * 6 - sw : i * 6 + sw; g.fillStyle = i % 2 ? "#9a1f3f" : "#6e1229"; R(g, x, 0, 6, 150, g.fillStyle); R(g, x, 0, 1, 150, "rgba(255,255,255,.1)"); } });
      VG(g, 0, 0, 0, 20, "#e0b84a", "#a8862a"); g.fillRect(0, 0, W, 14); for (let i = 0; i < 16; i++) { g.fillStyle = "#e0b84a"; g.beginPath(); g.arc(10 + i * 20, 16, 5, 0, Math.PI); g.fill(); }
      HD_BEAM(g, 160, 14, 40, 140, "255,236,190", 0.4); g.fillStyle = "rgba(255,236,190,.25)"; g.beginPath(); g.ellipse(160, 154, 64, 10, 0, 0, 7); g.fill();
      R(g, 118, 142, 84, 10, "#e0b84a"); R(g, 118, 142, 84, 2, "#fff0b0");
      R(g, 144, 98, 32, 26, "#f1f5f9"); C(g, 160, 92, 15, "#f8fafc"); R(g, 150, 88, 6, 3, "#111"); R(g, 164, 88, 6, 3, "#111"); g.strokeStyle = "#111"; g.lineWidth = 1.4; g.beginPath(); g.arc(160, 96, 5, 0.2, 2.9); g.stroke();
      R(g, 140, 120, 40, 24, "#111827"); R(g, 154, 120, 12, 24, "#7f1d1d");
      [[60, 120], [260, 120]].forEach(([x, y]) => { R(g, x - 14, y, 28, 30, "#6e1229"); R(g, x - 16, y - 8, 32, 12, "#8a1c34"); R(g, x - 16, y - 8, 32, 2, "#e0b84a"); });
      for (let i = 0; i < 30; i++) R(g, rnd(i) * W, (f * (0.2 + rnd(i + 1) * 0.3) + i * 20) % 150, 2, 2, ["rgba(254,202,202,.7)", "rgba(224,184,74,.7)"][i % 2]);
      VIG(g, W, H, 0.5);
    }
  };
  function HD_BEAM(g, x, y, w, len, rgb, a) { const gr = g.createLinearGradient(x, y, x, y + len); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.beginPath(); g.moveTo(x - w * 0.25, y); g.lineTo(x + w * 0.25, y); g.lineTo(x + w, y + len); g.lineTo(x - w, y + len); g.fill(); }
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register && B.LB) Object.keys(SC).forEach((k) => { const old = B.LB[k]; B.register(k, { draw: SC[k], hot: (old && old.hot) || [] }); });
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
