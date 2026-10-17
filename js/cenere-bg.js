// js/cenere-bg.js - sfondi di «Cenere e Gloria» (320x200: cieli di polvere, lamiere, bagliori di fuoco, animazioni).
// Registrati con window.__lbBg.register; i punti cliccabili (hot) restano quelli di bg-scenarios.js (ce_*).
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, x0, y0, x1, y1, a, b) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const DUST = (g, W, H, f, n, a) => { g.strokeStyle = `rgba(240,200,140,${a})`; g.lineWidth = 1; for (let i = 0; i < n; i++) { const y = (i * 53 + f * (0.6 + (i % 5) * 0.2)) % H, x = (i * 97 + f * 2.4) % (W + 40) - 20; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 12, y + 1.2); g.stroke(); } };
  const dunes = (g, W, y, col, amp, ph) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 8) g.lineTo(x, y - amp * Math.sin(x * 0.02 + ph) - amp * 0.5 * Math.sin(x * 0.05 + ph * 2)); g.lineTo(W, 200); g.fill(); };
  const sunSky = (g, W, H, f, dusk) => { VG(g, 0, 0, 0, 120, dusk ? "#3a1a2a" : "#7a5a3a", dusk ? "#f2893a" : "#f1c27a"); g.fillRect(0, 0, W, 120); const sx = dusk ? 240 : 80, sy = dusk ? 92 : 40; GL(g, sx, sy, 110, dusk ? "255,120,50" : "255,230,170", 0.5); C(g, sx, sy, 17, dusk ? "#ffb060" : "#fff0c0"); for (let i = 0; i < 4; i++) R(g, ((i * 130 + f * 0.2) % 400) - 60, 16 + i * 14, 70, 4, "rgba(255,230,190,.18)"); };
  const barrel = (g, x, y, f) => { R(g, x - 6, y - 12, 12, 14, "#4b5563"); R(g, x - 6, y - 12, 12, 2, "#6b7280"); R(g, x - 6, y - 5, 12, 1, "#2a2f38"); for (let i = 0; i < 4; i++) { const k = Math.sin(f / 5 + i * 1.7); C(g, x - 3 + i * 2 + k, y - 14 - i * 2 + Math.abs(k) * -2, 3.4 - i * 0.5, i % 2 ? "#fde047" : "#f97316"); } GL(g, x, y - 12, 54, "255,150,50", 0.5 + Math.sin(f / 6) * 0.08); };
  const person = (g, x, y, col, s, hair) => { s = s || 1; R(g, x - 3 * s, y - 10 * s, 6 * s, 10 * s, col); C(g, x, y - 13 * s, 3.2 * s, "#d9a679"); R(g, x - 3.3 * s, y - 16.5 * s, 6.6 * s, 3 * s, hair || "#2a1a10"); R(g, x - 3 * s, y, 2.4 * s, 5 * s, "#3a2c1e"); R(g, x + 0.6 * s, y, 2.4 * s, 5 * s, "#3a2c1e"); };
  const shack = (g, x, y, w, h, col, roof) => { R(g, x, y, w, h, col); for (let i = 0; i < w; i += 4) R(g, x + i, y, 1, h, "rgba(0,0,0,.18)"); R(g, x - 3, y - 4, w + 6, 5, roof); R(g, x - 3, y - 4, w + 6, 1, "rgba(255,255,255,.25)"); R(g, x + w * 0.4, y + h * 0.45, w * 0.22, h * 0.55, "#1a120a"); R(g, x + 4, y + 5, 7, 6, "#3a2c1e"); R(g, x + 5, y + 6, 5, 4, "#f2c46a"); GL(g, x + 7.5, y + 8, 16, "255,200,110", 0.3); };
  const SC = {
    ce_titolo(g, W, H, f) {
      sunSky(g, W, H, f, false); R(g, 0, 110, W, 90, "#b78a52"); dunes(g, W, 118, "#b78a52", 8, 1); dunes(g, W, 134, "#a5773f", 10, 3);
      g.fillStyle = "#4a4640"; g.beginPath(); g.moveTo(150, 124); g.lineTo(172, 124); g.lineTo(300, 200); g.lineTo(20, 200); g.fill();
      for (let i = 0; i < 9; i++) R(g, 160 - i * 0.2, 128 + i * i * 0.9, 2 + i * 1.2, 2 + i * 0.5, i % 2 ? "rgba(230,200,120,.6)" : "rgba(0,0,0,0)");
      for (let i = 0; i < 6; i++) R(g, 156 - i * 8, 136 + i * 11, 22 + i * 8, 1, "rgba(0,0,0,.25)");
      [[70, 150], [250, 160]].forEach(([x, y], i) => { R(g, x, y - 36, 3, 38, "#3a2c1e"); R(g, x - 10, y - 32, 24, 7, "#8a5a2a"); R(g, x - 10, y - 32, 24, 1, "#c8904a"); g.font = "700 6px monospace"; g.fillStyle = "#2a1a10"; g.fillText(i ? "OASI" : "KM 0", x - 8, y - 27); });
      R(g, 110, 160, 70, 14, "#7c3a1f"); R(g, 122, 150, 40, 12, "#5a2a15"); R(g, 126, 152, 14, 7, "#2a3a44"); C(g, 124, 174, 6, "#1c1917"); C(g, 168, 174, 6, "#1c1917"); R(g, 110, 160, 70, 1, "#b4532a");
      person(g, 214, 172, "#7a5a3a", 1.5, "#2a1a10"); R(g, 208, 150, 4, 8, "#38bdf8"); C(g, 219, 164, 3, "#e8e0c0");
      for (let i = 0; i < 3; i++) { const t = (f / 4 + i * 30) % 90; C(g, 130 + t * 0.2, 96 - t * 0.3, 1.5 + i, `rgba(80,70,60,${0.5 - t / 190})`); }
      DUST(g, W, H, f, 22, 0.28); g.font = "900 22px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff0c0"; g.fillText("CENERE", 160, 42); g.fillStyle = "#fb923c"; g.font = "900 15px 'Trebuchet MS', sans-serif"; g.fillText("E GLORIA", 160, 60); g.textAlign = "left"; VIG(g, W, H, 0.35);
    },
    ce_villaggio(g, W, H, f) {
      sunSky(g, W, H, f, true); dunes(g, W, 108, "#6a4a30", 6, 2); R(g, 0, 112, W, 88, "#8a6636"); for (let i = 0; i < 10; i++) R(g, 0, 118 + i * i * 0.8 + i * 2, W, 1, "rgba(0,0,0,.15)");
      shack(g, 14, 70, 70, 52, "#7a5a3a", "#8a4a2a"); shack(g, 230, 62, 74, 60, "#5f6e78", "#7a3a2a"); shack(g, 106, 82, 50, 40, "#8a6a4a", "#5a3a2a");
      R(g, 176, 50, 3, 72, "#3a2c1e"); R(g, 168, 48, 20, 4, "#6b7280"); R(g, 170, 62, 16, 1, "#9ca3af"); R(g, 171, 70, 14, 1, "#9ca3af"); C(g, 177, 46, 2, Math.floor(f / 25) % 2 ? "#ef4444" : "#7f1d1d");
      for (let i = 0; i < 8; i++) { R(g, 6 + i * 40, 122, 2, 12, "#3a2c1e"); } g.strokeStyle = "#d9c9a0"; g.lineWidth = 0.7; g.beginPath(); g.moveTo(6, 124); for (let i = 1; i < 8; i++) g.quadraticCurveTo(6 + i * 40 - 20, 130, 6 + i * 40, 124); g.stroke();
      R(g, 140, 140, 40, 20, "#6b6258"); R(g, 144, 144, 32, 10, "#1e3a44"); R(g, 142, 128, 36, 3, "#3a2c1e"); R(g, 142, 128, 2, 14, "#3a2c1e"); R(g, 176, 128, 2, 14, "#3a2c1e"); R(g, 158, 131, 1, 10, "#d9c9a0"); R(g, 156, 141, 5, 4, "#7a6a50");
      barrel(g, 66, 160, f); barrel(g, 250, 164, f); person(g, 100, 170, "#9a3412", 1.4, "#555"); person(g, 214, 172, "#3a5a6a", 1.5, "#222"); R(g, 20, 156, 22, 10, "#5c4a38"); R(g, 22, 150, 8, 8, "#9aa0a6");
      DUST(g, W, H, f, 18, 0.2); VIG(g, W, H, 0.42);
    },
    ce_bunker(g, W, H, f) {
      VG(g, 0, 0, 0, H, "#0c0e12", "#23272d"); g.fillRect(0, 0, W, H); R(g, 0, 130, W, 70, "#2d3138"); for (let i = 0; i < 10; i++) R(g, 0, 130 + i * i * 0.5 + i * 1.5, W, 1, "rgba(0,0,0,.4)");
      for (let c = 0; c < 4; c++) { const x = 10 + c * 80; R(g, x, 30, 70, 100, "#1c1f24"); R(g, x + 3, 34, 64, 92, "#2a2e35"); for (let r = 0; r < 4; r++) { R(g, x + 6, 40 + r * 22, 58, 3, "#4b5563"); for (let k = 0; k < 7; k++) { const col = ["#9a3412", "#1e3a8a", "#6b7280", "#365314"][(c + r + k) % 4]; R(g, x + 8 + k * 8, 24 + r * 22 + 8, 6, 8, col); R(g, x + 8 + k * 8, 24 + r * 22 + 8, 6, 1, "rgba(255,255,255,.2)"); } } }
      R(g, 0, 0, W, 14, "#16181c"); for (let i = 0; i < 6; i++) { const x = 20 + i * 54; R(g, x, 14, 20, 4, "#3a3f47"); const on = (Math.floor(f / 60) + i) % 6 !== 0; if (on) { R(g, x + 3, 18, 14, 2, "#fff3c0"); GL(g, x + 10, 22, 46, "255,240,190", 0.22); } }
      R(g, 138, 78, 44, 52, "#3a3f47"); R(g, 141, 81, 38, 46, "#4b5563"); C(g, 160, 104, 12, "#2a2f38"); C(g, 160, 104, 9, "#6b7280"); R(g, 158, 95, 4, 18, "#9ca3af"); R(g, 151, 102, 18, 4, "#9ca3af"); for (let i = 0; i < 5; i++) R(g, 141 + i * 8, 122, 4, 5, "#facc15");
      const on = Math.floor(f / 30) % 2; C(g, 160, 68, 4, on ? "#ef4444" : "#7f1d1d"); GL(g, 160, 68, 80, "220,38,38", on ? 0.3 : 0.1);
      person(g, 70, 172, "#6b7280", 1.5, "#222"); R(g, 230, 150, 50, 22, "#4b5563"); R(g, 234, 154, 16, 12, "#1f2937"); R(g, 258, 156, 16, 8, "#facc15"); C(g, 268, 160, 1.5, "#22c55e");
      for (let i = 0; i < 30; i++) R(g, (i * 41 + f * 0.2) % W, (i * 59 + f * 0.1) % 190, 1.4, 1.4, "rgba(200,210,225,.35)"); VIG(g, W, H, 0.55);
    },
    ce_oasi(g, W, H, f) {
      sunSky(g, W, H, f, false); dunes(g, W, 112, "#c9a265", 7, 0.5); R(g, 0, 118, W, 82, "#c9a265"); for (let i = 0; i < 8; i++) R(g, 0, 124 + i * i * 0.9 + i * 2, W, 1, "rgba(120,80,30,.15)");
      VG(g, 0, 130, 0, 190, "#4fa6c4", "#2f6f86"); g.beginPath(); g.ellipse(160, 150, 120, 30, 0, 0, 7); g.fill(); g.strokeStyle = "#8a6a3a"; g.lineWidth = 3; g.stroke();
      for (let i = 0; i < 7; i++) { g.strokeStyle = `rgba(255,255,255,${0.3 - i * 0.03})`; g.lineWidth = 1; g.beginPath(); g.ellipse(120 + i * 12, 146 + (i % 3) * 8, 10 + Math.sin(f / 14 + i) * 3, 2.5, 0, 0, 7); g.stroke(); }
      GL(g, 160, 150, 80, "255,240,190", 0.15);
      [[40, 112, 1.3], [270, 108, 1.4], [300, 124, 1]].forEach(([x, y, s]) => { g.strokeStyle = "#5a4630"; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x, y + 40 * s); g.quadraticCurveTo(x + 6 * s, y + 14 * s, x + 2 * s, y - 6 * s); g.stroke(); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.55 + Math.sin(f / 40 + k) * 0.04; g.strokeStyle = k % 2 ? "#3a7a3a" : "#4a9a4a"; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 2 * s, y - 6 * s); g.quadraticCurveTo(x + 2 * s + Math.cos(a) * 14 * s, y - 6 * s + Math.sin(a) * 10 * s - 4, x + 2 * s + Math.cos(a) * 28 * s, y - 6 * s + Math.sin(a) * 18 * s + 10); g.stroke(); } });
      R(g, 236, 128, 30, 26, "#6b6258"); R(g, 238, 120, 26, 8, "#3a2c1e"); R(g, 248, 114, 2, 10, "#3a2c1e"); R(g, 244, 104, 10, 8, "#7a6a50");
      person(g, 90, 170, "#3a5a6a", 1.5, "#2a1a10"); R(g, 130, 166, 36, 12, "#7c3a1f"); C(g, 138, 180, 5, "#1c1917"); C(g, 158, 180, 5, "#1c1917");
      DUST(g, W, H, f, 10, 0.15); VIG(g, W, H, 0.3);
    },
    ce_cratere(g, W, H, f) {
      VG(g, 0, 0, 0, 130, "#1a0a0a", "#7a2a12"); g.fillRect(0, 0, W, 130);
      for (let i = 0; i < 4; i++) R(g, ((i * 120 + f * 0.15) % 420) - 80, 14 + i * 14, 90, 8, "rgba(60,30,25,.5)");
      g.fillStyle = "#2a1610"; g.beginPath(); g.moveTo(0, 100); g.lineTo(60, 70); g.lineTo(110, 96); g.lineTo(160, 60); g.lineTo(220, 98); g.lineTo(280, 74); g.lineTo(320, 96); g.lineTo(320, 200); g.lineTo(0, 200); g.fill();
      VG(g, 0, 100, 0, 200, "#3a1a10", "#5a2a14"); g.beginPath(); g.moveTo(0, 130); g.lineTo(320, 130); g.lineTo(320, 200); g.lineTo(0, 200); g.fill();
      g.beginPath(); g.ellipse(160, 150, 100, 26, 0, 0, 7); const gr = g.createRadialGradient(160, 150, 4, 160, 150, 100); gr.addColorStop(0, "#fff0a0"); gr.addColorStop(0.3, "#fb923c"); gr.addColorStop(1, "#7c2d12"); g.fillStyle = gr; g.fill();
      for (let i = 0; i < 9; i++) { const a = f / 28 + i; C(g, 160 + Math.cos(a) * (20 + i * 7), 150 + Math.sin(a * 1.3) * (6 + i * 2), 2.5, `rgba(255,${190 - i * 10},60,.75)`); }
      GL(g, 160, 148, 150, "255,110,30", 0.4 + Math.sin(f / 12) * 0.05);
      for (let i = 0; i < 36; i++) { const x = 100 + rnd(i) * 120, t = (f * (0.4 + rnd(i + 3) * 0.5) + i * 17) % 120; R(g, x + Math.sin(t / 9 + i) * 6, 150 - t * 1.1, 1.6, 1.6, `rgba(255,${150 + (i % 4) * 25},60,${0.9 - t / 140})`); }
      [[30, 150, 28], [292, 148, 30]].forEach(([x, y, h]) => { g.fillStyle = "#1a0e0a"; g.beginPath(); g.moveTo(x - 14, y + 20); g.lineTo(x - 5, y - h); g.lineTo(x + 6, y - h + 10); g.lineTo(x + 16, y + 20); g.fill(); });
      person(g, 60, 176, "#6b7280", 1.5, "#222"); R(g, 250, 168, 40, 12, "#4b5563"); R(g, 254, 160, 12, 8, "#6b7280");
      VIG(g, W, H, 0.5);
    },
    ce_torre(g, W, H, f) {
      VG(g, 0, 0, 0, 130, "#2a0d14", "#c25a2a"); g.fillRect(0, 0, W, 130); GL(g, 250, 80, 110, "255,120,50", 0.4); C(g, 250, 82, 16, "#ff9a4a");
      for (let i = 0; i < 3; i++) R(g, ((i * 140 + f * 0.18) % 420) - 70, 18 + i * 16, 80, 5, "rgba(255,200,160,.18)");
      g.fillStyle = "#2a160f"; g.beginPath(); g.moveTo(0, 118); g.lineTo(80, 100); g.lineTo(150, 118); g.lineTo(320, 104); g.lineTo(320, 200); g.lineTo(0, 200); g.fill(); R(g, 0, 150, W, 50, "#3a2418");
      R(g, 128, 36, 64, 118, "#4a3a34"); for (let r = 0; r < 12; r++) { R(g, 128, 36 + r * 10, 64, 1, "rgba(0,0,0,.35)"); for (let c = 0; c < 4; c++) R(g, 128 + c * 16 + (r % 2) * 8, 36 + r * 10, 1, 10, "rgba(0,0,0,.28)"); } R(g, 188, 36, 4, 118, "rgba(0,0,0,.3)");
      R(g, 120, 28, 80, 10, "#3a2c26"); for (let i = 0; i < 5; i++) R(g, 122 + i * 16, 20, 10, 10, "#3a2c26"); R(g, 150, 46, 20, 34, "#120a08"); C(g, 160, 46, 10, "#120a08"); const sw = Math.sin(f / 40) * 4; R(g, 159, 46, 2, 10, "#5a4630"); g.fillStyle = "#c8904a"; g.beginPath(); g.moveTo(152 + sw, 70); g.lineTo(168 + sw, 70); g.lineTo(164 + sw, 56); g.lineTo(156 + sw, 56); g.fill(); C(g, 160 + sw, 71, 2, "#facc15");
      R(g, 148, 120, 24, 34, "#120a08"); R(g, 148, 120, 24, 2, "#d9a640"); C(g, 160, 120, 12, "#120a08"); GL(g, 160, 140, 40, "255,170,70", 0.25);
      for (let i = 0; i < 4; i++) { const x = 30 + i * 70 + (i > 1 ? 80 : 0); R(g, x, 134, 2, 18, "#3a2c1e"); R(g, x - 3, 132, 8, 3, "#6b7280"); C(g, x + 1, 130, 2.5, Math.floor(f / 18 + i) % 2 ? "#fb923c" : "#fde047"); GL(g, x + 1, 130, 26, "255,160,60", 0.35); }
      barrel(g, 96, 172, f); person(g, 230, 174, "#7f1d1d", 1.5, "#ccc"); person(g, 200, 176, "#4b5563", 1.4, "#222");
      for (let i = 0; i < 20; i++) R(g, (i * 53 + f * 0.7) % W, (i * 37 + f * 0.35) % 190, 1.5, 1.5, "rgba(255,140,60,.6)"); VIG(g, W, H, 0.5);
    }
  };
  SC.ce_strada = SC.ce_titolo;
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register && B.LB) Object.keys(SC).forEach((k) => { const old = B.LB[k]; B.register(k, { draw: SC[k], hot: (old && old.hot) || [] }); });
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
