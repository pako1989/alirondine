// js/neve-bg2.js - sfondi di «IL GUARDIANO DI NEVE», capitoli 2-4 (320x200, pixel art, animati, con punti da toccare):
// il campo della Partita della Neve, la chiesa, la Pro Loco col videoregistratore; il Rifugio Stella sotto l'aurora, dentro il rifugio, la funivia abbandonata;
// la morena di Fiocco, la grotta dei palloni, la vetta al tramonto, la capanna di Ilde. Usa gli attrezzi di neve-bg.js (window.__neveBgK).
(function () {
  "use strict";
  function boot(n) {
    const T = window.__neveBgK, B = window.__lbBg;
    if (!T || !B || !B.register) { if (n < 80) setTimeout(() => boot(n + 1), 150); return; }
    const { R, D, rnd, GL, VIG, bands, peak, pine, flakes, chalet } = T;
    const aurora = (g, W, f, y0, a) => { for (let x = 0; x < W; x += 2) { const y = y0 + Math.sin(x / 30 + f / 90) * 10 + Math.sin(x / 11 + f / 50) * 3, len = 20 + Math.abs(Math.sin(x / 17 + f / 120)) * 34; for (let k = 0; k < len; k += 2) R(g, x, y + k, 2, 2, `rgba(${k < 4 ? "190,255,225" : x % 6 ? "80,230,170" : "130,170,255"},${(1 - k / len) * a})`); } };
    const stars = (g, W, H, f, n) => { for (let i = 0; i < n; i++) { const a = Math.sin(f / 25 + i * 1.7); if (a > -0.2) R(g, rnd(i + 3) * W, rnd(i + 51) * H, 1, 1, a > 0.8 ? "#ffffff" : "#a8b8e0"); } };
    const cross = (g, x, y, h, c) => { R(g, x - 1, y, 3, h, c); R(g, x - 6, y + 6, 13, 3, c); };
    const scarf = (g, x, y, w, f, i) => { for (let k = 0; k < w; k++) R(g, x + k, y + Math.round(Math.sin(f / 8 + k / 3 + i) * 1.5), 1, 4, Math.floor(k / 4) % 2 ? "#f0f0f0" : "#2f6b3a"); };
    const SC = {
      // il campo della Partita della Neve: spalato a mano, le porte di legno, il cimitero piccolo dietro, il canalone sopra
      gn_campo(g, W, H, f) {
        bands(g, W, 0, 110, ["#6a84b0", "#7e98c0", "#94acd0", "#acc2de", "#c4d6ea", "#dce8f4"]);
        peak(g, 160, 110, 260, 104, "#6a7c9e", "#8a9cbc", "#ffffff"); for (let k = 0; k < 40; k++) R(g, 150 + Math.sin(k / 4) * 6, 20 + k * 2, 14 - k / 5, 2, "#4a5a78");
        for (let i = 0; i < 4; i++) { const t = (f * 0.3 + i * 30) % 120; R(g, 152 + i * 3, 24 + t * 0.7, 2, 2, `rgba(255,255,255,${0.7 - t / 180})`); }
        R(g, 0, 108, W, 92, "#eef3f9"); R(g, 30, 128, 260, 56, "#f8fbff"); R(g, 30, 128, 260, 1, "#9ab8d8"); R(g, 30, 183, 260, 1, "#9ab8d8"); R(g, 159, 128, 1, 56, "#9ab8d8"); for (let k = 0; k < 24; k++) R(g, 160 + Math.cos(k / 3.8) * 12, 156 + Math.sin(k / 3.8) * 8, 1, 1, "#9ab8d8");
        [[34, 144], [276, 144]].forEach(([x, y]) => { R(g, x, y - 18, 2, 26, "#5a3a20"); R(g, x + 8, y - 18, 2, 26, "#5a3a20"); R(g, x, y - 20, 10, 2, "#6a4426"); R(g, x, y - 22, 10, 2, "#ffffff"); });
        for (let k = 0; k < 8; k++) { const x = 230 + k * 9; cross(g, x, 98 + (k % 2) * 3, 12, "#7a8496"); R(g, x - 3, 96 + (k % 2) * 3, 7, 2, "#ffffff"); }
        R(g, 226, 108, 84, 3, "#5a6474"); GL(g, 250, 102, 8, "255,190,90", 0.4 + 0.2 * Math.sin(f / 7));
        chalet(g, 14, 92, 52, 22, "#d6b48c", "#475569", true, f);
        R(g, 100, 120, 30, 10, "#3a3a44"); for (let i = 0; i < 5; i++) { const h = 6 + Math.abs(Math.sin(f / 4 + i * 1.3)) * 10; R(g, 102 + i * 6, 120 - h, 4, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 115, 114, 40, "255,150,60", 0.4);
        for (let i = 0; i < 3; i++) { const x = 70 + i * 14, bob = Math.round(Math.sin(f / 9 + i) * 1); R(g, x, 162 + bob, 3, 8, "#2f6b3a"); D(g, x + 1, 158 + bob, 2, "#e0ac7e"); }
        flakes(g, W, H, f, 50, 0.9); VIG(g, W, H, 0.32);
      },
      gn_chiesa(g, W, H, f) {
        R(g, 0, 0, W, 200, "#c8bca8"); for (let x = 0; x < W; x += 40) { R(g, x, 0, 4, 140, "#b0a490"); } R(g, 0, 140, W, 60, "#8a7a64"); for (let y = 146; y < 200; y += 8) R(g, 0, y, W, 1, "#6a5c4a");
        R(g, 130, 10, 60, 90, "#3a4a7a"); for (let k = 0; k < 6; k++) R(g, 132 + k * 10, 12, 8, 86, ["#2a4a9a", "#9a2a3a", "#d8a830", "#2a7a4a", "#6a3a9a", "#2a6aa8"][k]); R(g, 158, 12, 4, 86, "#16141f"); R(g, 132, 52, 56, 4, "#16141f"); GL(g, 160, 54, 70, "200,200,255", 0.18);
        R(g, 120, 104, 80, 34, "#e8e0d0"); R(g, 120, 104, 80, 4, "#ffffff"); R(g, 150, 84, 20, 20, "#d8b440"); cross(g, 160, 70, 18, "#d8b440");
        for (let i = 0; i < 6; i++) { const x = 116 + i * 18, fl = Math.abs(Math.sin(f / 5 + i)); R(g, x, 96, 3, 8, "#f4ecd8"); R(g, x, 92 - fl * 2, 3, 4 + fl * 2, "#f59e0b"); GL(g, x + 1, 92, 14, "255,190,90", 0.25); }
        for (let r = 0; r < 3; r++) { R(g, 20, 150 + r * 16, 90, 6, "#6a4426"); R(g, 210, 150 + r * 16, 90, 6, "#6a4426"); R(g, 20, 156 + r * 16, 90, 2, "#4a2e18"); R(g, 210, 156 + r * 16, 90, 2, "#4a2e18"); }
        R(g, 30, 40, 50, 40, "#e8dcc0"); R(g, 32, 42, 46, 36, "#9aa4b4"); R(g, 32, 66, 46, 12, "#f4f8fc"); for (let k = 0; k < 5; k++) R(g, 38 + k * 8, 58, 3, 8, "#2f6b3a"); g.fillStyle = "#3a2a1a"; g.font = "700 5px sans-serif"; g.fillText("EX VOTO 1979", 38, 50);
        VIG(g, W, H, 0.4);
      },
      gn_proloco(g, W, H, f) {
        R(g, 0, 0, W, 200, "#cbd5c0"); for (let y = 0; y < 140; y += 10) R(g, 0, y, W, 1, "#b8c2ac"); R(g, 0, 140, W, 60, "#7a6a5a"); for (let x = 0; x < W; x += 16) R(g, x, 140, 1, 60, "#6a5a4a");
        R(g, 40, 70, 90, 54, "#4a3a2a"); R(g, 46, 74, 70, 46, "#16141f"); const noise = Math.floor(f / 3);
        for (let y = 0; y < 44; y += 2) for (let x = 0; x < 68; x += 2) if (rnd(x * 7 + y * 13 + noise) > 0.55) R(g, 47 + x, 75 + y, 2, 2, rnd(x + y + noise) > 0.5 ? "#e8eef6" : "#8a94a4");
        if (Math.floor(f / 50) % 3 === 0) { R(g, 47, 100, 68, 20, "rgba(240,245,255,.5)"); R(g, 76, 92, 6, 8, "#2f6b3a"); D(g, 79, 89, 2, "#e0ac7e"); g.fillStyle = "#fde047"; g.font = "700 6px monospace"; g.fillText("12", 77, 98); }
        R(g, 54, 124, 50, 10, "#2a2a32"); R(g, 58, 127, 24, 3, "#16141f"); R(g, 92, 127, 4, 3, Math.floor(f / 20) % 2 ? "#ef4444" : "#4a1010");
        R(g, 170, 30, 120, 80, "#8a6a42"); R(g, 174, 34, 112, 72, "#c8a878"); [[180, 40, 44, 50], [232, 40, 48, 28], [232, 74, 48, 26]].forEach(([x, y, w, h], i) => { R(g, x, y, w, h, "#f0e8d0"); for (let k = 0; k < h - 10; k += 3) R(g, x + 3, y + 8 + k, w - 6 - (k % 7), 1, "#9a9080"); R(g, x + 3, y + 3, w - 6, 3, "#3a3020"); R(g, x + w / 2 - 1, y - 2, 3, 3, "#c02a2a"); });
        g.fillStyle = "#3a3020"; g.font = "700 5px sans-serif"; g.fillText("L'ECO DELLE VALLI · 14 DIC 1979", 176, 120);
        R(g, 200, 150, 90, 8, "#8a5a32"); R(g, 206, 158, 4, 30, "#6a4426"); R(g, 280, 158, 4, 30, "#6a4426"); R(g, 220, 138, 30, 12, "#c8a050"); R(g, 254, 136, 20, 14, "#f0e8d0");
        VIG(g, W, H, 0.4);
      },
      // il Rifugio Stella, chiuso dal 1979, di notte sotto l'aurora
      gn_rifugio(g, W, H, f) {
        bands(g, W, 0, 140, ["#060a1e", "#0a1028", "#0e1834", "#122040", "#16304e", "#1a3e5a", "#22506e"]); stars(g, W, 120, f, 90); aurora(g, W, f, 20, 0.35);
        peak(g, 80, 140, 200, 110, "#1a2a44", "#243a58", "#9ab8d8"); peak(g, 260, 140, 180, 90, "#16243c", "#203450", "#8aa8c8");
        R(g, 0, 138, W, 62, "#c8dcf0"); for (let x = 0; x < W; x += 6) R(g, x, 140 + (x % 18) / 3, 4, 1, "rgba(80,110,160,.35)");
        chalet(g, 120, 130, 80, 36, "#5a4a3a", "#2a2a3a", Math.floor(f / 120) % 4 !== 0, f); g.fillStyle = "#f4f4f4"; g.font = "700 6px sans-serif"; g.fillText("RIFUGIO STELLA · 2412 m", 124, 112);
        R(g, 30, 150, 50, 18, "#9ad0f0"); R(g, 30, 150, 50, 2, "#e0f4ff"); for (let i = 0; i < 3; i++) R(g, 36 + i * 14, 156 + (i % 2) * 4, 8, 1, "#e0f4ff");
        R(g, 252, 100, 4, 70, "#5a5a66"); R(g, 230, 100, 48, 4, "#5a5a66"); R(g, 230, 104, 2, 30, "#3a3a44"); R(g, 226, 134, 12, 8, "#7a2a2a");
        flakes(g, W, H, f, 30, 0.6); VIG(g, W, H, 0.45);
      },
      gn_rifugio_in(g, W, H, f) {
        R(g, 0, 0, W, 200, "#3a2a20"); for (let x = 0; x < W; x += 18) { R(g, x, 0, 17, 136, "#4a3426"); R(g, x, 0, 1, 136, "#5a4030"); } R(g, 0, 136, W, 64, "#5a4030"); for (let y = 142; y < 200; y += 8) R(g, 0, y, W, 1, "#3a2a1a");
        for (let r = 0; r < 2; r++) { R(g, 10, 40 + r * 40, 100, 30, "#6a4426"); R(g, 14, 44 + r * 40, 92, 14, "#2f5a8a"); R(g, 14, 44 + r * 40, 92, 3, "#3e6aa0"); }
        R(g, 140, 60, 54, 44, "#16141f"); R(g, 142, 62, 50, 40, "#5a7aa8"); for (let i = 0; i < 12; i++) R(g, 142 + ((i * 9 + f * 0.3) % 50), 62 + ((i * 13 + f * 0.7) % 40), 1, 1, "#ffffff"); aurora(g, 50, f, 64, 0.0);
        R(g, 220, 110, 60, 24, "#6a4426"); R(g, 236, 98, 30, 14, "#e8dcc0"); R(g, 236, 98, 30, 2, "#c02a2a"); R(g, 240, 102, 22, 1, "#5a5040"); R(g, 240, 105, 18, 1, "#5a5040");
        R(g, 230, 20, 60, 70, "#2a2a32"); R(g, 238, 50, 44, 26, "#16141f"); for (let i = 0; i < 5; i++) { const h = 3 + Math.abs(Math.sin(f / 4 + i)) * 9; R(g, 241 + i * 8, 76 - h, 5, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 260, 66, 60, "255,150,60", 0.35);
        R(g, 120, 140, 22, 46, "#7a7a86"); R(g, 122, 142, 18, 42, "#8a8a96"); R(g, 128, 160, 6, 2, "#3a3a44"); g.fillStyle = "#16141f"; g.font = "700 6px sans-serif"; g.fillText("12", 127, 154);
        VIG(g, W, H, 0.5);
      },
      // la funivia abbandonata: la cabina rossa ferma a mezz'aria da quarantacinque anni
      gn_funivia(g, W, H, f) {
        R(g, 0, 0, W, 200, "#4a4a56"); for (let x = 0; x < W; x += 30) R(g, x, 0, 2, 140, "#3a3a44"); R(g, 0, 140, W, 60, "#5a5a66"); for (let y = 146; y < 200; y += 9) R(g, 0, y, W, 1, "#44444e");
        D(g, 90, 80, 46, "#3a3a44"); D(g, 90, 80, 40, "#6a6a76"); D(g, 90, 80, 14, "#3a3a44"); for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2 + f / 400; R(g, 90 + Math.cos(a) * 30 - 2, 80 + Math.sin(a) * 30 - 2, 4, 4, "#5a5a66"); }
        R(g, 0, 36, W, 2, "#2a2a32"); R(g, 190, 40, 70, 50, "#9a2a2a"); R(g, 194, 46, 62, 22, "#16141f"); R(g, 196, 48, 58, 18, "#5a7aa8"); R(g, 224, 38, 4, 6, "#2a2a32"); R(g, 190, 86, 70, 4, "#6a1a1a");
        for (let i = 0; i < 8; i++) R(g, 196 + ((i * 11 + f * 0.4) % 58), 48 + ((i * 7 + f * 0.8) % 18), 1, 1, "#ffffff");
        R(g, 20, 150, 60, 30, "#6a4426"); R(g, 24, 140, 50, 10, "#e8dcc0"); for (let k = 0; k < 6; k++) R(g, 28 + k * 7, 142 + (k % 2), 5, 7, k % 2 ? "#f0e8d0" : "#dcd0b8");
        R(g, 270, 120, 30, 60, "#2a2a32"); R(g, 274, 126, 22, 10, Math.floor(f / 40) % 2 ? "#22c55e" : "#14532d"); g.fillStyle = "#e8e8e8"; g.font = "700 5px sans-serif"; g.fillText("FERMA DAL 1979", 196, 100);
        VIG(g, W, H, 0.5);
      },
      // la morena: pali con le sciarpe degli Stambecchi, la grotta di Fiocco, la slitta rossa
      gn_morena(g, W, H, f) {
        bands(g, W, 0, 120, ["#3a4a7a", "#5a5a8a", "#7a6a96", "#a07a9a", "#c8909a", "#e8b0a0"]);
        peak(g, 240, 120, 180, 116, "#5a4a6a", "#7a6a8a", "#ffe8e8"); peak(g, 60, 120, 150, 70, "#6a5a7a", "#8a7a9a", "#fff0f0");
        R(g, 0, 118, W, 82, "#f0e8f0"); for (let x = 0; x < W; x += 7) R(g, x, 124 + (x % 21) / 3, 4, 1, "rgba(150,120,170,.3)");
        D(g, 60, 150, 34, "#5a6a8a"); D(g, 60, 154, 26, "#16141f"); R(g, 26, 150, 68, 40, "#f0e8f0"); R(g, 34, 150, 52, 30, "#16141f"); GL(g, 60, 168, 30, "160,200,255", 0.25);
        for (let i = 0; i < 6; i++) { const x = 130 + i * 28; R(g, x, 100, 3, 50, "#5a3a20"); scarf(g, x + 3, 104, 14, f, i); }
        R(g, 220, 176, 50, 6, "#dc2626"); R(g, 216, 182, 58, 2, "#7a5a3a"); R(g, 268, 168, 2, 14, "#7a5a3a");
        flakes(g, W, H, f, 40, 0.8); VIG(g, W, H, 0.35);
      },
      // la grotta di Fiocco: quarantacinque anni di palloni, impilati per colore
      gn_grotta(g, W, H, f) {
        R(g, 0, 0, W, 200, "#1e3a5a"); for (let i = 0; i < 40; i++) R(g, rnd(i) * W, rnd(i + 9) * 120, 6, 30 + rnd(i + 3) * 30, `rgba(150,210,255,${0.06 + rnd(i + 7) * 0.08})`);
        for (let k = 0; k < 20; k++) { const x = k * 16 + 4, h = 10 + rnd(k) * 22; for (let j = 0; j < h; j++) R(g, x + j / 4, j, Math.max(1, 6 - j / 4), 1, j < 4 ? "#e0f4ff" : "#9ad0f0"); }
        R(g, 0, 140, W, 60, "#c8e4f8"); const cols = ["#f4f4f4", "#dc2626", "#2563eb", "#f59e0b", "#16a34a", "#16141f"];
        for (let p = 0; p < 6; p++) for (let r = 0; r < 5 - (p % 2); r++) for (let c = 0; c < 5 - r; c++) { const x = 20 + p * 50 + c * 9 + r * 4.5, y = 136 - r * 8; D(g, x, y, 4, cols[(p + r) % cols.length]); R(g, x - 1, y - 2, 2, 1, "rgba(255,255,255,.5)"); }
        D(g, 160, 60, 14, "#eef4fa"); R(g, 152, 56, 16, 6, "#8aa4c0"); R(g, 154, 58, 2, 2, "#16141f"); R(g, 162, 58, 2, 2, "#16141f"); R(g, 148, 70, 24, 4, "#d23a3a"); GL(g, 160, 60, 60, "190,230,255", 0.2 + 0.05 * Math.sin(f / 12));
        VIG(g, W, H, 0.5);
      },
      // la vetta al tramonto: la croce, il cippo con la Coppa, il mare di nuvole
      gn_cima(g, W, H, f) {
        bands(g, W, 0, 150, ["#2a1e4a", "#46285a", "#6a3266", "#9a4068", "#c85a62", "#e8805a", "#f4a868", "#fcd08a"]);
        D(g, 70, 136, 26, "#ffd88a"); D(g, 70, 136, 20, "#ffecb0"); GL(g, 70, 136, 90, "255,190,120", 0.35);
        for (let i = 0; i < 7; i++) { const x = (i * 60 - f * 0.1) % (W + 60); D(g, x < -30 ? x + W + 60 : x, 152 + (i % 2) * 4, 22, "#f6d4cc"); D(g, x < -30 ? x + W + 60 : x, 148 + (i % 2) * 4, 16, "#fff0e8"); }
        R(g, 0, 156, W, 44, "#f6d4cc");
        for (let k = 0; k < 140; k++) R(g, 150 + k, 150 - Math.min(k, 140 - k) * 0.55, 1, 60, k < 70 ? "#8a6a76" : "#6a4a5a"); R(g, 150, 150, 140, 50, "#fff4ee"); for (let k = 0; k < 140; k += 2) R(g, 150 + k, 150 - Math.min(k, 140 - k) * 0.55, 1, 4, "#ffffff");
        cross(g, 220, 70, 46, "#3a2a20"); R(g, 210, 112, 22, 8, "#7a6a66"); R(g, 216, 104, 10, 8, "#d8b440"); R(g, 214, 102, 14, 3, "#f0d060"); GL(g, 221, 106, 22, "255,220,120", 0.3 + 0.1 * Math.sin(f / 8));
        scarf(g, 222, 80, 18, f, 0);
        flakes(g, W, H, f, 30, 0.5); VIG(g, W, H, 0.3);
      },
      // la capanna di Ilde: ritagli di giornale per quarantacinque anni, la foto di Aurelio, la stufa
      gn_capanna(g, W, H, f) {
        R(g, 0, 0, W, 200, "#4a3a2e"); for (let x = 0; x < W; x += 14) { R(g, x, 0, 13, 138, "#5a4636"); R(g, x, 0, 1, 138, "#6a5240"); } R(g, 0, 138, W, 62, "#6a5240"); for (let y = 144; y < 200; y += 8) R(g, 0, y, W, 1, "#4a3a2a");
        for (let i = 0; i < 30; i++) { const x = 14 + (i % 10) * 20 + (Math.floor(i / 10) % 2) * 6, y = 14 + Math.floor(i / 10) * 26, w = 14 + (i % 3) * 3; R(g, x, y, w, 20, i % 5 === 0 ? "#e8d8b0" : "#f0e8d0"); for (let k = 0; k < 6; k++) R(g, x + 2, y + 4 + k * 2.6, w - 4 - (k % 3), 1, "#9a9080"); R(g, x + w / 2, y - 1, 2, 2, "#c02a2a"); }
        R(g, 230, 20, 60, 70, "#c8a050"); R(g, 234, 24, 52, 62, "#9a9a9a"); D(g, 260, 44, 9, "#d8c8b0"); R(g, 250, 54, 20, 30, "#2f6b3a"); g.fillStyle = "#fde047"; g.font = "700 9px monospace"; g.fillText("12", 254, 74);
        R(g, 30, 110, 40, 60, "#2a2a32"); R(g, 36, 128, 28, 20, "#16141f"); for (let i = 0; i < 4; i++) { const h = 4 + Math.abs(Math.sin(f / 4 + i)) * 10; R(g, 39 + i * 6, 148 - h, 5, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 50, 140, 60, "255,150,60", 0.35);
        R(g, 120, 120, 90, 8, "#6a4426"); R(g, 150, 108, 30, 12, "#f0e8d0"); R(g, 154, 110, 22, 1, "#5a5040"); R(g, 130, 100, 14, 20, "#d8b440");
        VIG(g, W, H, 0.5);
      }
    };
    const HOT = {
      gn_campo: [[30, 128, 260, 56, "⚽ Il campo della Partita della Neve: spalato a mano da mezzo paese, le righe tracciate con la cenere del braciere."], [226, 90, 84, 22, "✝️ Il cimitero piccolo, dietro il campo. Una lanterna resta accesa tutto l'inverno, su una lapide senza nessuno sotto."], [140, 20, 40, 90, "🏔️ Il canalone delle valanghe. Da lì, ogni tanto, la montagna lascia andare quello che non vuole più tenere."]],
      gn_chiesa: [[130, 10, 60, 90, "🪟 La vetrata di Sant'Antonio abate: il santo, il fuoco e un porcellino. Nel '79 l'hanno rifatta coi soldi della Coppa."], [30, 40, 50, 40, "🖼️ Un ex voto del 1979: la squadra in fila sulla neve. Cinque maglie verdi dipinte, e una macchia di vernice dove doveva esserci la sesta."], [110, 86, 110, 20, "🕯️ Le candele dell'altare. Una è sempre accesa. Don Fulvio dice che è per i dispersi in montagna. Al plurale."]],
      gn_proloco: [[40, 70, 90, 66, "📺 Il televisore della Pro Loco, col videoregistratore che mangia i nastri. Sulla manopola, a pennarello: «non toccare (Lilli)»."], [170, 30, 120, 90, "📰 «L'ECO DELLE VALLI», 14 dicembre 1979: «VALDIGELO NELLA LEGGENDA! Brina para l'ultimo rigore nella bufera». Più sotto, piccolo: «Disperso un giovane nel canalone»."], [200, 130, 90, 30, "🏆 La bacheca dei trofei della Pro Loco: la coppa della sagra del fungo, quella della gara di slitte. Il posto d'onore è vuoto da sempre."]],
      gn_rifugio: [[120, 96, 80, 70, "🏠 Il Rifugio Stella, 2412 metri. Chiuso dall'inverno del 1979. Il comignolo, ogni tanto, fuma lo stesso."], [0, 10, 320, 60, "🌌 L'aurora. A queste quote, dicono le guide, non si vede mai. Stanotte sì."], [226, 96, 56, 50, "🚡 La vecchia stazione della funivia. La cabina rossa è ferma a mezz'aria da quarantacinque anni."]],
      gn_rifugio_in: [[10, 40, 100, 74, "🛏️ Le cuccette del rifugio, rifatte. Qualcuno ci ha dormito, di recente. Qualcuno che piega le coperte come nel servizio militare."], [220, 96, 60, 40, "📖 Il libro del rifugio. L'ultima firma del 1979 è di due mani: una grande, una piccola."], [118, 138, 26, 50, "🗄️ Un armadietto di metallo col numero 12 dipinto a mano."]],
      gn_funivia: [[44, 34, 92, 92, "⚙️ La grande ruota della funivia. Ferma dal 1979, ma qualcuno la ingrassa ancora. Ogni anno, a dicembre."], [190, 36, 70, 56, "🚡 La cabina rossa, ferma a mezz'aria. Dentro, un pallone di cuoio sgonfio."], [20, 140, 60, 40, "✉️ Lettere in pila: tutte indirizzate a «Olmo Brina, Valdigelo». Tutte timbrate e mai spedite."]],
      gn_morena: [[26, 120, 70, 70, "🕳️ La grotta di Fiocco. Dentro si sente un rumore di palloni che rotolano e uno yeti che conta in yeti."], [126, 96, 172, 56, "🧣 Sei pali, sei sciarpe degli Stambecchi. Una per ogni inverno in cui qualcuno è salito fin qui. Il vento le fa parlare."], [214, 166, 62, 22, "🛷 La slitta rossa di Fiocco. Il sedile è imbottito con una maglia verde, numero 12."]],
      gn_grotta: [[10, 96, 300, 50, "⚽ Centinaia di palloni, impilati per colore: quarantacinque anni di tiri finiti nel bosco. Nessuno è stato mai restituito."], [140, 40, 40, 40, "🦍 Fiocco, a casa sua. Ti offre un pallone. Poi se lo riprende. Poi te lo offre di nuovo."], [0, 0, 320, 40, "🧊 Il soffitto della grotta: ghiaccio azzurro, stalattiti come canne d'organo."]],
      gn_cima: [[196, 66, 50, 56, "✝️ La croce di vetta. Sul cippo, la Coppa delle Vette del 1979, lucidata. Una sciarpa piccola degli Stambecchi è legata al braccio della croce."], [40, 100, 70, 70, "🌅 Il sole tramonta sul mare di nuvole. Sotto, da qualche parte, c'è Valdigelo con il suo braciere acceso."], [150, 140, 140, 40, "🏔️ Il pianoro di vetta. Da qui, nel '79, si vedeva il campo della finale. Così dicono."]],
      gn_capanna: [[10, 10, 210, 84, "📰 Quarantacinque anni di ritagli: ogni articolo sulla Coppa delle Vette, ogni foto di Olmo il Guardiano. Su tutte, a matita, la stessa correzione: «12»."], [230, 20, 60, 70, "🖼️ Un ragazzo in maglia verde, numero 12, i guanti troppo grandi. Sotto: «Aurelio, 19 anni, il giorno della finale»."], [120, 96, 90, 30, "🏆 Sul tavolo, un posto vuoto della forma esatta della Coppa. E una tazza sola."]]
    };
    Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
  }
  boot(0);
})();
