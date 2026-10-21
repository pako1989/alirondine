// js/cavaliere-bg.js - sfondi di «IL CAVALIERE DEL FISCHIO» (320x200): titolo, tetti, vicolo, rifugio, porto, manicomio, opera, banca, cimitero. Pioggia, fulmini, fari, nebbia, luci che tremano
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const rain = (g, f, W, H, n, a) => { g.strokeStyle = `rgba(170,200,255,${a || 0.3})`; g.lineWidth = 1; for (let i = 0; i < n; i++) { const x = (rnd(i) * (W + 40) + f * 1.1 * (0.6 + rnd(i + 3))) % (W + 40) - 20, y = (rnd(i + 7) * H + f * 5 * (0.7 + rnd(i + 9))) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 9); g.stroke(); } };
  const flash = (g, f, W, H) => { const k = f % 260; if (k < 5) { g.fillStyle = `rgba(200,215,255,${0.28 - k * 0.05})`; g.fillRect(0, 0, W, H); } };
  const skyline = (g, W, y0, f, seed, col, win) => { for (let i = 0; i < 12; i++) { const bw = 20 + rnd(i + seed) * 18, bx = i * 28 - 8 + rnd(i + seed + 3) * 6, bh = 28 + rnd(i + seed + 5) * 60; R(g, bx, y0 - bh, bw, bh + 60, col); if (rnd(i + seed) > 0.5) T(g, [bx - 1, y0 - bh, bx + bw / 2, y0 - bh - 14 - rnd(i) * 10, bx + bw + 1, y0 - bh], col); if (win) for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) if (rnd(i * 7 + r * 3 + c + seed) > 0.62) R(g, bx + 4 + c * 9, y0 - bh + 6 + r * 10, 4, 5, `rgba(250,204,21,${0.35 + 0.3 * Math.sin(f / 25 + i + r)})`); } };
  const bat = (g, x, y, s) => { T(g, [x, y, x - 9 * s, y - 4 * s, x - 14 * s, y + 1 * s, x - 9 * s, y + 1 * s, x - 6 * s, y + 4 * s, x - 3 * s, y + 1 * s, x, y + 3 * s, x + 3 * s, y + 1 * s, x + 6 * s, y + 4 * s, x + 9 * s, y + 1 * s, x + 14 * s, y + 1 * s, x + 9 * s, y - 4 * s], "#05050a"); };
  const SC = {
    cf_titolo(g, W, H, f) {
      VG(g, 0, 200, "#05060f", "#1b1530"); g.fillRect(0, 0, W, 200); GL(g, 240, 46, 90, "190,200,255", 0.2); C(g, 240, 44, 17, "#e5e7eb"); C(g, 246, 41, 15, "#d1d5db");
      for (let i = 0; i < 30; i++) R(g, rnd(i) * W, rnd(i + 5) * 70, 1, 1, `rgba(255,255,255,${0.3 + 0.4 * Math.sin(f / 20 + i)})`);
      bat(g, 240 + Math.sin(f / 90) * 30, 40 + Math.cos(f / 70) * 8, 1.3);
      skyline(g, W, 150, f, 1, "#0a0912", true); skyline(g, W, 168, f, 9, "#06050b", false);
      // fascio del faro della questura con un fischietto
      const bx = 60, by = 120; g.save(); g.globalAlpha = 0.18 + 0.05 * Math.sin(f / 15); g.fillStyle = "#fde68a"; T(g, [bx, by, 140, 0, 190, 0], "#fde68a"); g.restore(); C(g, 165, 36, 10, "rgba(250,204,21,.25)"); R(g, 160, 34, 10, 4, "#facc15"); C(g, 172, 36, 3, "#facc15");
      R(g, 0, 170, W, 30, "#0b0a12"); R(g, 130, 150, 18, 30, "#12101c"); T(g, [128, 150, 139, 130, 150, 150], "#12101c"); R(g, 132, 124, 14, 14, "#12101c");
      rain(g, f, W, H, 70, 0.28); flash(g, f, W, H); VIG(g, W, H, 0.55);
    },
    cf_tetti(g, W, H, f) {
      VG(g, 0, 200, "#070815", "#20193a"); g.fillRect(0, 0, W, 200); GL(g, 80, 40, 70, "170,180,240", 0.18); C(g, 80, 38, 11, "#dde1ea");
      skyline(g, W, 120, f, 4, "#0b0a14", true);
      // tetti spioventi in primo piano
      for (let i = 0; i < 3; i++) { const x = i * 120 - 10, y = 130 + (i % 2) * 14; T(g, [x, y + 40, x + 60, y - 6, x + 130, y + 40], "#171a28"); T(g, [x + 10, y + 40, x + 60, y + 2, x + 120, y + 40], "#1e2233"); for (let k = 0; k < 6; k++) R(g, x + 20 + k * 14, y + 14 + (k % 2) * 4, 8, 1, "rgba(150,170,230,.25)"); }
      for (let i = 0; i < 3; i++) { const x = 40 + i * 110; R(g, x, 118 + (i % 2) * 14, 10, 20, "#33261f"); for (let k = 0; k < 3; k++) C(g, x + 5 + Math.sin(f / 30 + k + i) * 3, 114 + (i % 2) * 14 - k * 9 - (f / 8 + k * 6) % 8, 3 + k, `rgba(200,200,215,${0.25 - k * 0.06})`); }
      R(g, 0, 170, W, 30, "#06060b"); bat(g, 200 + Math.sin(f / 60) * 40, 70 + Math.cos(f / 50) * 6, 0.9); rain(g, f, W, H, 80, 0.3); flash(g, f, W, H); VIG(g, W, H, 0.5);
    },
    cf_vicolo(g, W, H, f) {
      VG(g, 0, 200, "#0a0c16", "#151a2a"); g.fillRect(0, 0, W, 200);
      R(g, 0, 0, 70, 200, "#14111c"); R(g, 250, 0, 70, 200, "#110f19"); for (let r = 0; r < 6; r++) { R(g, 12, 20 + r * 28, 14, 18, rnd(r) > 0.5 ? "rgba(250,204,21,.5)" : "#0a0910"); R(g, 280, 10 + r * 28, 14, 18, rnd(r + 5) > 0.6 ? "rgba(250,204,21,.4)" : "#0a0910"); }
      R(g, 70, 0, 180, 150, "#0c0e18"); R(g, 150, 80, 20, 70, "#07080f"); T(g, [150, 80, 160, 70, 170, 80], "#07080f");
      R(g, 70, 150, 180, 50, "#10131e"); VG(g, 150, 200, "#1a2030", "#0b0e17"); g.fillRect(70, 150, 180, 50);
      // lampione e pozza di luce
      R(g, 218, 60, 3, 100, "#1f2937"); R(g, 210, 56, 18, 6, "#374151"); GL(g, 219, 62, 70 + Math.sin(f / 6) * 3, "255,210,120", 0.45); R(g, 212, 58, 14, 3, "#fde68a");
      g.fillStyle = "rgba(255,210,120,.12)"; T(g, [213, 62, 225, 62, 255, 160, 185, 160], "rgba(255,210,120,.1)");
      for (let i = 0; i < 4; i++) R(g, 90 + i * 40, 165 + (i % 2) * 8, 22, 2, "rgba(150,180,255,.25)");
      R(g, 92, 120, 22, 30, "#1b1f2c"); R(g, 90, 118, 26, 4, "#2a3040"); for (let i = 0; i < 3; i++) C(g, 128 + Math.sin(f / 25 + i) * 4, 140 - ((f / 3 + i * 8) % 30), 3 + i, `rgba(200,200,215,${0.2 - i * 0.04})`);
      rain(g, f, W, H, 80, 0.32); VIG(g, W, H, 0.6);
    },
    cf_rifugio(g, W, H, f) {
      VG(g, 0, 200, "#06080e", "#10141f"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 14; i++) T(g, [i * 24 - 6, 0, i * 24 + 6, 0, i * 24, 14 + rnd(i) * 20], "#0b0e16");
      // parete di monitor
      R(g, 70, 30, 180, 64, "#0b0e16"); for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const x = 76 + c * 34, y = 34 + r * 19, on = (Math.floor(f / 40) + r * 3 + c) % 7 !== 0; R(g, x, y, 30, 16, on ? "#0c2a3c" : "#05080e"); if (on) { R(g, x + 2, y + 3 + (f / 6 + c) % 9, 26, 1, "rgba(56,189,248,.8)"); R(g, x + 2, y + 12, 8 + c * 3, 1, "rgba(34,197,94,.8)"); } }
      GL(g, 160, 64, 110, "56,189,248", 0.2);
      // teca con il mantello e la moto
      R(g, 20, 80, 36, 80, "#0f1524"); R(g, 24, 84, 28, 72, "rgba(147,197,253,.12)"); T(g, [30, 90, 46, 90, 50, 150, 26, 150], "#05050a"); R(g, 34, 96, 8, 3, "#facc15");
      R(g, 264, 112, 44, 30, "#10141f"); C(g, 270, 146, 10, "#0b0b12"); C(g, 304, 146, 10, "#0b0b12"); C(g, 270, 146, 5, "#374151"); C(g, 304, 146, 5, "#374151"); R(g, 272, 122, 30, 12, "#1b1f2c"); R(g, 296, 118, 10, 4, "#facc15");
      R(g, 0, 160, W, 40, "#0b0f19"); for (let i = 0; i < 16; i++) R(g, i * 20, 160, 1, 40, "rgba(255,255,255,.04)");
      R(g, 140, 140, 40, 8, "#1b1f2c"); R(g, 150, 126, 20, 14, "#111827"); GL(g, 160, 126, 40, "250,204,21", 0.15);
      VIG(g, W, H, 0.55);
    },
    cf_porto(g, W, H, f) {
      VG(g, 0, 200, "#070b17", "#162038"); g.fillRect(0, 0, W, 200); GL(g, 260, 30, 60, "170,190,255", 0.14); C(g, 260, 30, 9, "#cfd6e6");
      // gru
      for (let i = 0; i < 2; i++) { const x = 40 + i * 190; R(g, x, 40, 5, 100, "#1f2937"); R(g, x - 40, 40, 90, 4, "#374151"); T(g, [x, 40, x + 2, 28, x + 5, 40], "#374151"); R(g, x - 36, 44, 1, 20 + Math.sin(f / 30 + i) * 6, "#6b7280"); R(g, x - 40, 62 + Math.sin(f / 30 + i) * 6, 8, 6, "#9a3412"); }
      R(g, 0, 120, W, 24, "#0d1424"); VG(g, 144, 200, "#0c1d33", "#06101f"); g.fillRect(0, 144, W, 56);
      for (let i = 0; i < 6; i++) { R(g, 6 + i * 52, 110 + (i % 3) * 4, 40, 22 + (i % 2) * 4, ["#7c2d12", "#1d4ed8", "#166534", "#92400e"][i % 4]); R(g, 6 + i * 52, 110 + (i % 3) * 4, 40, 2, "rgba(255,255,255,.2)"); }
      for (let i = 0; i < 14; i++) R(g, 4 + i * 24 + Math.sin(f / 20 + i) * 4, 150 + (i % 4) * 11, 14, 1.5, "rgba(250,204,21,.18)");
      R(g, 150, 100, 3, 40, "#1f2937"); GL(g, 151, 100, 40, "255,210,120", 0.3); R(g, 146, 96, 12, 5, "#fde68a");
      rain(g, f, W, H, 70, 0.3); flash(g, f, W, H); VIG(g, W, H, 0.5);
    },
    cf_manicomio(g, W, H, f) {
      VG(g, 0, 200, "#1c2025", "#3a4048"); g.fillRect(0, 0, W, 200);
      // corridoio in prospettiva con celle
      T(g, [0, 0, 110, 60, 110, 140, 0, 200], "#2d3138"); T(g, [320, 0, 210, 60, 210, 140, 320, 200], "#2a2e35"); R(g, 110, 60, 100, 80, "#15181d"); R(g, 150, 86, 20, 54, "#0b0d11");
      for (let i = 0; i < 4; i++) { const x = 8 + i * 22, y = 40 + i * 12, w = 14 - i * 2; R(g, x, y, w, 60 - i * 8, "#3b4048"); R(g, x + 3, y + 8, w - 6, 8, rnd(i) > 0.5 ? "rgba(250,204,21,.55)" : "#0b0d11"); R(g, 320 - x - w, y, w, 60 - i * 8, "#3b4048"); R(g, 320 - x - w + 3, y + 8, w - 6, 8, rnd(i + 5) > 0.5 ? "rgba(250,204,21,.5)" : "#0b0d11"); }
      const fl = (Math.floor(f / 7) % 11 === 0) ? 0.35 : 1; GL(g, 160, 30, 90, "230,245,230", 0.28 * fl); R(g, 140, 24, 40, 4, "#e5e7eb");
      R(g, 0, 140, W, 60, "#a7b0a9"); T(g, [0, 200, 110, 140, 210, 140, 320, 200], "#8f9992"); for (let i = 0; i < 6; i++) R(g, 150 + (i - 3) * 16, 142, 1, 58, "rgba(0,0,0,.15)");
      R(g, 220, 150, 22, 14, "#1f2937"); C(g, 224, 168, 7, "#0b0d11"); C(g, 240, 168, 7, "#0b0d11"); VIG(g, W, H, 0.55);
    },
    cf_opera(g, W, H, f) {
      VG(g, 0, 200, "#1a050b", "#3a0c18"); g.fillRect(0, 0, W, 200);
      R(g, 0, 0, 62, 200, "#5c0f1f"); R(g, 258, 0, 62, 200, "#5c0f1f"); for (let i = 0; i < 6; i++) { R(g, i * 10, 0, 4, 200, "#7a1a2e"); R(g, 258 + i * 10, 0, 4, 200, "#7a1a2e"); } R(g, 0, 0, W, 14, "#d4a73a");
      R(g, 62, 126, 196, 74, "#3b2314"); for (let i = 0; i < 10; i++) R(g, 62 + i * 20, 126, 1, 74, "rgba(0,0,0,.3)");
      T(g, [110, 126, 210, 126, 280, 40, 40, 40], `rgba(255,236,170,${0.12 + 0.04 * Math.sin(f / 12)})`);
      for (let i = 0; i < 3; i++) { R(g, 66 + i * 88, 52, 70, 42, "#2a0a12"); R(g, 66 + i * 88, 52, 70, 4, "#d4a73a"); for (let k = 0; k < 4; k++) C(g, 80 + i * 88 + k * 16, 80, 4, "#7f1d2d"); }
      const x = 160, y = 28; R(g, x - 0.5, 0, 1.2, y, "#6b5a3a"); R(g, x - 26, y, 52, 3, "#d4a73a"); for (let i = 0; i < 7; i++) { R(g, x - 24 + i * 8, y - 3, 1.5, 4, "#fde68a"); GL(g, x - 24 + i * 8, y - 3, 12, "255,200,110", 0.28); }
      R(g, 96, 112, 128, 14, "#4a2a14"); R(g, 96, 112, 128, 2, "#d4a73a");
      R(g, 150, 104, 6, 18, "#111"); C(g, 153, 100, 4, "#e0b890"); R(g, 164, 106, 5, 16, "#7f1d1d"); C(g, 166, 102, 3, "#e0b890");
      for (let i = 0; i < 12; i++) { R(g, 10 + i * 26, 168 + (i % 2) * 8, 20, 18, "#4a0e1b"); } VIG(g, W, H, 0.5);
    },
    cf_banca(g, W, H, f) {
      VG(g, 0, 200, "#12151e", "#262a36"); g.fillRect(0, 0, W, 200);
      R(g, 0, 150, W, 50, "#cfcbbd"); for (let i = 0; i < 8; i++) R(g, i * 42, 150, 1, 50, "rgba(0,0,0,.12)"); R(g, 0, 150, W, 2, "#9ca3af");
      for (let i = 0; i < 4; i++) { const x = 16 + i * 92; R(g, x, 20, 20, 130, "#e5e1d3"); R(g, x - 3, 14, 26, 8, "#c9c5b6"); R(g, x - 3, 148, 26, 6, "#b9b5a6"); for (let k = 0; k < 4; k++) R(g, x + 4 + k * 4, 24, 1, 120, "rgba(0,0,0,.12)"); }
      C(g, 160, 100, 44, "#4b5563"); C(g, 160, 100, 38, "#6b7280"); C(g, 160, 100, 22, "#374151"); C(g, 160, 100, 6, "#9ca3af"); for (let i = 0; i < 8; i++) { const a = i / 8 * 7 + f / 80; R(g, 160 + Math.cos(a) * 28 - 2, 100 + Math.sin(a) * 28 - 2, 4, 4, "#9ca3af"); }
      R(g, 156, 96, 8, 8, "#facc15"); GL(g, 160, 100, 70, "250,230,140", 0.15);
      R(g, 130, 8, 60, 16, "#1f2937"); C(g, 160, 16, 6, "#e5e7eb"); R(g, 160, 12, 1, 5, "#111"); R(g, 160, 16, 4 + 0, 1, "#111");
      for (let i = 0; i < 5; i++) { R(g, 36 + i * 4, 162 - i * 2, 16, 4, "#facc15"); R(g, 240 + i * 4, 162 - i * 2, 16, 4, "#fbbf24"); } VIG(g, W, H, 0.4);
    },
    cf_cimitero(g, W, H, f) {
      VG(g, 0, 200, "#06080f", "#18222a"); g.fillRect(0, 0, W, 200); GL(g, 90, 36, 80, "190,205,255", 0.2); C(g, 90, 34, 14, "#dde1ea");
      for (let i = 0; i < 3; i++) { const x = 30 + i * 120; R(g, x, 70, 4, 90, "#0b0e13"); for (let k = 0; k < 4; k++) { T(g, [x + 2, 100 + k * 12, x - 24 + k * 3, 94 + k * 10 - 14, x - 16 + k * 3, 104 + k * 12], "#0b0e13"); T(g, [x + 2, 100 + k * 12, x + 28 - k * 3, 94 + k * 10 - 12, x + 20 - k * 3, 104 + k * 12], "#0b0e13"); } }
      R(g, 0, 140, W, 60, "#0f1a16"); R(g, 120, 88, 80, 56, "#2b2f38"); T(g, [114, 90, 160, 62, 206, 90], "#1f2229"); R(g, 150, 108, 20, 36, "#05060a"); R(g, 154, 112, 12, 32, "#0c1010");
      for (let i = 0; i < 12; i++) { const x = 10 + i * 26 + (i % 2) * 8, y = 150 + (i % 3) * 10; R(g, x, y, 10, 16, "#6b7280"); C(g, x + 5, y, 5, "#6b7280"); R(g, x + 4, y + 4, 2, 6, "#374151"); }
      R(g, 222, 152, 12, 18, "#9ca3af"); C(g, 228, 152, 6, "#9ca3af"); GL(g, 228, 158, 18, "250,204,21", 0.3 + 0.15 * Math.sin(f / 10)); R(g, 226, 158, 5, 2, "#facc15"); C(g, 232, 158, 1.8, "#facc15");
      for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(190,205,220,${0.1 + 0.05 * Math.sin(f / 40 + i)})`; g.fillRect(((f / 4 + i * 80) % 380) - 30, 130 + i * 12, 100, 14); }
      rain(g, f, W, H, 40, 0.22); flash(g, f, W, H); VIG(g, W, H, 0.55);
    }
  };
  const HOT = {
    cf_titolo: [[130, 120, 30, 64, "🏛️ Il Borgo Gotico: mille guglie, nessuna che non nasconda qualcosa."], [150, 20, 60, 32, "💡 Il faro della questura: si accende quando la città ha bisogno di parlare con qualcuno."], [200, 20, 80, 50, "🌕 La luna: un testimone che non parla mai."]],
    cf_tetti: [[40, 100, 20, 40, "🏚️ Il comignolo: fuma, come se la notte non bastasse."], [60, 40, 40, 20, "🌕 La luna: dall'alto, tutti i vicoli sembrano uguali."], [200, 120, 100, 50, "🌧️ I tetti: scivolosi, ma sono l'unica strada dritta del Borgo."]],
    cf_vicolo: [[212, 56, 20, 60, "💡 Il lampione: un'isola di luce in un mare di ombra."], [88, 116, 30, 40, "🗑️ I bidoni: il Borgo butta qui tutto quello che non vuole raccontare."], [150, 76, 22, 70, "🚪 La porta in fondo: dietro non c'è nessuno, ma tutti sembrano uscirne."]],
    cf_rifugio: [[70, 30, 180, 64, "🖥️ Gli schermi: telecamere, registri, e una mappa del Borgo piena di puntini."], [20, 80, 36, 80, "🥽 La teca: il mantello, il rampino e un guanto che non si toglie mai."], [264, 112, 44, 40, "🏍️ La moto: silenziosa, nera, con un fischio al posto del clacson."]],
    cf_porto: [[6, 108, 300, 36, "📦 I container: partono vuoti, tornano pieni, e nessuno chiede cosa c'è dentro."], [30, 40, 90, 90, "🏗️ Le gru: la città intera si sposta con un gancio."], [150, 94, 24, 50, "💡 Il lampione del molo: l'unico che non si spegne con la pioggia."]],
    cf_manicomio: [[110, 60, 100, 80, "🚪 Il fondo del corridoio: una porta, nessun nome, un solo chiavistello."], [8, 40, 60, 100, "🔒 Le celle: ognuna ha un portiere ricoverato, e una storia su un rigore."], [140, 20, 40, 16, "💡 La luce del soffitto: trema come se sapesse qualcosa."]],
    cf_opera: [[96, 112, 128, 16, "🎭 Il palco: una scena sempre pronta, un sipario sempre mezzo chiuso."], [140, 0, 40, 40, "🕯️ Il lampadario: cristallo, cera e un cavo che nessuno ricontrolla."], [66, 52, 190, 44, "🏛️ I palchi: è da lì che si vede chi applaude e chi guarda altrove."]],
    cf_banca: [[116, 56, 88, 88, "🔐 Il portone del caveau: una tonnellata di acciaio e una sola combinazione."], [16, 14, 280, 136, "🏛️ Le colonne: marmo, orgoglio e rumore di monete lontane."], [130, 8, 60, 16, "🕰️ L'orologio: segna sempre l'ora in cui si chiude un affare."]],
    cf_cimitero: [[220, 150, 20, 24, "📯 La lapide col fischietto: l'unica che sembra aspettare qualcuno."], [114, 62, 100, 82, "⚰️ Il mausoleo: tre generazioni di arbitri, e un'ottava che nessuno nomina."], [0, 140, 320, 50, "🌫️ La nebbia: copre i passi, e le intenzioni."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
