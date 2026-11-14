// js/coppa-bg.js - sfondi di «LA COPPA MALEDETTA» (320x200, animati, con i punti da toccare).
// cm_cripta (la sacrestia della Coppa) · cm_tabellone (il muro col tabellone a gesso) · cm_altare (il tavolo degli ex voto) · cm_campo (il Campo del Mezzogiorno di Notte)
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  const P = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, x, y, w, h, stops) => { const gr = g.createLinearGradient(0, y, 0, y + h); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 210); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const TXT = (g, t, x, y, font, fill, stroke, lw) => { g.font = font; g.textAlign = "center"; if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 3; g.strokeText(t, x, y); } g.fillStyle = fill; g.fillText(t, x, y); g.textAlign = "left"; };
  // mattoni di pietra
  function stones(g, x0, y0, w, h, base, seed) {
    R(g, x0, y0, w, h, base);
    for (let y = y0, r = 0; y < y0 + h; y += 9, r++) for (let x = x0 - (r % 2) * 9; x < x0 + w; x += 18) {
      const k = rnd(seed + r * 31 + x); g.fillStyle = `rgba(${k > 0.5 ? "255,255,255" : "0,0,0"},${0.03 + k * 0.07})`; g.fillRect(Math.max(x0, x + 1), y + 1, Math.min(16, x0 + w - x - 1), 7);
    }
  }
  function candle(g, x, y, f, i, h) {
    h = h || 10; R(g, x - 2, y - h, 4, h, "#ece3c8"); R(g, x - 2, y - h, 1, h, "#fff8e0"); R(g, x - 3, y, 6, 2, "#8a6a2c");
    const fl = Math.sin(f * 0.21 + i * 2.1) * 1.2;
    E(g, x + fl * 0.3, y - h - 4, 2, 4 + fl * 0.4, "#ffb347"); E(g, x + fl * 0.3, y - h - 3, 1, 2, "#fff3b0");
    GL(g, x, y - h - 3, 22 + fl * 2, "255,170,70", 0.33);
  }
  // la Coppa: ottone annerito, due manici, una crepa
  function cup(g, x, y, s, f, glow) {
    if (glow) GL(g, x, y - 16 * s, 46 * s, "120,255,170", 0.16 + Math.sin(f * 0.05) * 0.06);
    P(g, [x - 12 * s, y - 30 * s, x + 12 * s, y - 30 * s, x + 8 * s, y - 12 * s, x - 8 * s, y - 12 * s], "#8c6a1e");
    P(g, [x - 12 * s, y - 30 * s, x - 4 * s, y - 30 * s, x - 3 * s, y - 12 * s, x - 8 * s, y - 12 * s], "#c79a35");
    R(g, x - 13 * s, y - 32 * s, 26 * s, 3 * s, "#d9b04a");
    R(g, x - 2 * s, y - 12 * s, 4 * s, 7 * s, "#7a5b18"); R(g, x - 9 * s, y - 5 * s, 18 * s, 3 * s, "#a17a26"); R(g, x - 11 * s, y - 2 * s, 22 * s, 3 * s, "#5c4410");
    g.strokeStyle = "#a17a26"; g.lineWidth = 2 * s; g.beginPath(); g.arc(x - 14 * s, y - 24 * s, 5 * s, 1.2, 5.1); g.stroke(); g.beginPath(); g.arc(x + 14 * s, y - 24 * s, 5 * s, -1.95, 1.95); g.stroke();
    g.strokeStyle = "#1c1405"; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 2 * s, y - 30 * s); g.lineTo(x + 5 * s, y - 24 * s); g.lineTo(x + 2 * s, y - 20 * s); g.lineTo(x + 4 * s, y - 14 * s); g.stroke();
    R(g, x - 6 * s, y - 27 * s, 2 * s, 9 * s, "rgba(255,240,180,.55)");
  }
  function fog(g, W, y, f, n, a) { for (let i = 0; i < n; i++) { const x = ((rnd(i + 5) * (W + 160) + f * (0.12 + rnd(i) * 0.1)) % (W + 160)) - 80; E(g, x, y + rnd(i + 9) * 18, 46 + rnd(i + 2) * 30, 7 + rnd(i + 4) * 5, `rgba(190,220,205,${a})`); } }

  const SC = {
    // la sacrestia sotto la sede: nicchia, Coppa sul piedistallo, ceri, sciarpe annodate, ex voto
    cm_cripta(g, W, H, f) {
      stones(g, 0, 0, W, 150, "#2a2530", 3);
      // volta
      g.fillStyle = "#17131c"; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, 30); g.quadraticCurveTo(W / 2, -18, 0, 30); g.closePath(); g.fill();
      // nicchia centrale
      g.fillStyle = "#0e0b12"; g.beginPath(); g.moveTo(112, 138); g.lineTo(112, 62); g.quadraticCurveTo(160, 14, 208, 62); g.lineTo(208, 138); g.closePath(); g.fill();
      g.strokeStyle = "#5b5068"; g.lineWidth = 3; g.beginPath(); g.moveTo(110, 138); g.lineTo(110, 62); g.quadraticCurveTo(160, 12, 210, 62); g.lineTo(210, 138); g.stroke();
      GL(g, 160, 96, 70, "110,255,160", 0.10 + Math.sin(f * 0.04) * 0.04);
      // piedistallo
      R(g, 140, 118, 40, 22, "#4a4254"); R(g, 136, 114, 48, 5, "#63597036"); R(g, 136, 114, 48, 5, "#635970"); R(g, 144, 122, 32, 3, "#3a3342");
      TXT(g, "1931", 160, 134, "bold 7px monospace", "#bfae8a");
      cup(g, 160, 114, 1.25, f, true);
      // sciarpe annodate alle grate ai lati
      for (let i = 0; i < 2; i++) {
        const x = i ? 236 : 24; R(g, x, 46, 60, 70, "#120f17"); for (let k = 0; k < 6; k++) R(g, x + 4 + k * 10, 46, 2, 70, "#4b4356"); R(g, x, 44, 60, 3, "#5b5068"); R(g, x, 114, 60, 3, "#5b5068");
        ["#b3202c", "#1f5fbf", "#e8c53a", "#2f9e57"].forEach((c, k) => { const sx = x + 8 + k * 13, sw = Math.sin(f * 0.03 + k + i * 2) * 1.5; R(g, sx, 62 + k % 2 * 8, 6, 5, c); P(g, [sx, 67 + k % 2 * 8, sx + 6, 67 + k % 2 * 8, sx + 5 + sw, 92 + k * 3, sx + 1 + sw, 92 + k * 3], c); R(g, sx + 1 + sw, 78 + k % 2 * 8, 4, 2, "#f4efe2"); });
      }
      // pavimento a scacchi consumato
      VG(g, 0, 140, W, 60, ["#3b3444", "#1b1721"]);
      for (let r = 0; r < 4; r++) for (let c = -1; c < 12; c++) if ((r + c) % 2 === 0) P(g, [160 + (c - 5.5) * (26 + r * 9), 142 + r * 14, 160 + (c - 4.5) * (26 + r * 9), 142 + r * 14, 160 + (c - 4.5) * (26 + (r + 1) * 9), 156 + r * 14, 160 + (c - 5.5) * (26 + (r + 1) * 9), 156 + r * 14], "rgba(0,0,0,.22)");
      // ceri
      [[100, 150, 12], [118, 158, 9], [202, 158, 10], [222, 150, 13], [84, 166, 8], [238, 166, 9], [150, 172, 7], [172, 172, 8]].forEach((c, i) => candle(g, c[0], c[1], f, i, c[2]));
      // ex voto appesi (cuori di latta, scarpini)
      for (let i = 0; i < 7; i++) { const x = 118 + i * 14, y = 52 + Math.abs(3 - i) * 5; g.fillStyle = i % 3 ? "#b8b0a0" : "#d9b04a"; g.beginPath(); g.arc(x - 1.5, y, 2, 0, 7); g.arc(x + 1.5, y, 2, 0, 7); g.fill(); P(g, [x - 3.4, y + 1, x + 3.4, y + 1, x, y + 5], g.fillStyle); }
      // polvere nella luce
      for (let i = 0; i < 22; i++) { const x = 120 + rnd(i) * 80 + Math.sin(f * 0.01 + i) * 4, y = 140 - ((f * (0.1 + rnd(i + 3) * 0.12) + rnd(i + 8) * 110) % 110); R(g, x, y, 1, 1, `rgba(190,255,210,${0.25 + rnd(i + 2) * 0.35})`); }
      fog(g, W, 180, f, 5, 0.05);
      VIG(g, W, H, 0.6);
    },
    // il muro del sottoscala: tabellone a gesso, foto di squadre, una lampadina che dondola
    cm_tabellone(g, W, H, f) {
      stones(g, 0, 0, W, 160, "#3a3028", 11);
      R(g, 0, 150, W, 50, "#221b16"); for (let i = 0; i < 9; i++) R(g, i * 40 - 6, 150, 2, 50, "rgba(0,0,0,.25)"); R(g, 0, 150, W, 2, "#4d4036");
      // lavagna
      R(g, 44, 22, 232, 112, "#5a4630"); R(g, 49, 27, 222, 102, "#16261f"); R(g, 49, 27, 222, 102, "rgba(255,255,255,.03)");
      g.strokeStyle = "rgba(235,240,230,.75)"; g.lineWidth = 1;
      const line = (a, b, c, d) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); };
      for (let s = 0; s < 2; s++) { const dir = s ? -1 : 1, x0 = s ? 262 : 58;
        for (let i = 0; i < 4; i++) { const y = 40 + i * 22; line(x0, y, x0 + dir * 26, y); if (i % 2 === 0) { line(x0 + dir * 26, y, x0 + dir * 26, y + 22); line(x0 + dir * 26, y + 11, x0 + dir * 52, y + 11); } }
        line(x0 + dir * 52, 51, x0 + dir * 52, 95); line(x0 + dir * 52, 73, x0 + dir * 78, 73);
      }
      line(136, 73, 184, 73);
      // la coppa disegnata a gesso al centro, cancellature
      g.strokeStyle = "rgba(160,255,190,.8)"; g.strokeRect(152, 50, 16, 14); line(156, 64, 156, 70); line(164, 64, 164, 70); line(150, 70, 170, 70);
      for (let i = 0; i < 9; i++) { g.strokeStyle = `rgba(235,240,230,${0.12 + rnd(i) * 0.15})`; const x = 60 + rnd(i + 2) * 190, y = 100 + rnd(i + 5) * 22; line(x, y, x + 14 + rnd(i) * 10, y + rnd(i + 1) * 3 - 1); }
      TXT(g, "CHI VINCE, PAGA", 160, 122, "bold 8px monospace", "rgba(235,240,230,.8)");
      R(g, 49, 129, 222, 4, "#3d2f20"); R(g, 90, 127, 12, 3, "#f1ede2"); R(g, 210, 127, 8, 3, "#e7b3b3");
      // foto in cornice con nastrino nero
      [[8, 40], [8, 86], [286, 40], [286, 86]].forEach((p, i) => { R(g, p[0], p[1], 28, 34, "#2a2018"); R(g, p[0] + 2, p[1] + 2, 24, 30, "#b9ab8e"); for (let k = 0; k < 5; k++) { C(g, p[0] + 5 + k * 4.5, p[1] + 14 + (k % 2) * 6, 2, "#5a4a3a"); R(g, p[0] + 3.5 + k * 4.5, p[1] + 16 + (k % 2) * 6, 3, 6, i % 2 ? "#3d5a80" : "#7d2f2f"); } P(g, [p[0] + 20, p[1], p[0] + 28, p[1], p[0] + 28, p[1] + 8], "#0b0b0b"); });
      // lampadina che dondola
      const a = Math.sin(f * 0.035) * 0.22, lx = 160 + Math.sin(a) * 26, ly = Math.cos(a) * 20;
      g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.moveTo(160, 0); g.lineTo(lx, ly); g.stroke(); C(g, lx, ly + 3, 3, "#ffe9a8"); GL(g, lx, ly + 3, 90, "255,220,140", 0.22 + (rnd(Math.floor(f / 7)) > 0.93 ? -0.12 : 0));
      // secchio, segatura, pallone di cuoio
      R(g, 22, 160, 18, 18, "#6b7480"); R(g, 20, 158, 22, 3, "#8a94a1"); C(g, 282, 172, 9, "#7a5230"); g.strokeStyle = "#3d2814"; g.beginPath(); g.arc(282, 172, 9, 0, 7); g.moveTo(273, 172); g.lineTo(291, 172); g.moveTo(282, 163); g.lineTo(282, 181); g.stroke();
      // falena attorno alla luce
      const mx = lx + Math.cos(f * 0.13) * 14, my = ly + 6 + Math.sin(f * 0.17) * 9; R(g, mx, my, 2, 1, "#e9e2cf"); R(g, mx + (f % 6 < 3 ? -1 : 2), my - 1, 1, 1, "#e9e2cf");
      VIG(g, W, H, 0.55);
    },
    // il tavolo degli ex voto: tre carte coperte, due piatti di bilancia, cera che cola
    cm_altare(g, W, H, f) {
      VG(g, 0, 0, W, 120, ["#140f1c", "#2b1f33"]);
      // vetrata tonda
      const cx = 160, cy = 52; C(g, cx, cy, 40, "#0b0910");
      ["#7a1f2b", "#1f4a7a", "#7a6a1f", "#1f7a4a", "#5a1f7a", "#7a431f"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 37, i * 1.047, (i + 1) * 1.047 - 0.05); g.closePath(); g.fill(); });
      C(g, cx, cy, 11, "#d9d2bd"); g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, 11, 0, 7); g.stroke(); P(g, [cx, cy - 5, cx + 5, cy - 1, cx + 3, cy + 5, cx - 3, cy + 5, cx - 5, cy - 1], "#222");
      GL(g, cx, cy, 80, "200,160,255", 0.10 + Math.sin(f * 0.03) * 0.03);
      // raggi colorati sul tavolo
      g.save(); g.globalAlpha = 0.07 + Math.sin(f * 0.02) * 0.02; ["#ff5a6e", "#5aa8ff", "#ffe45a"].forEach((c, i) => P(g, [cx - 20 + i * 20, cy + 20, cx + i * 20 - 10, cy + 20, 70 + i * 80, 170, 20 + i * 80, 170], c)); g.restore();
      // colonne
      [18, 268].forEach((x) => { VG(g, x, 0, 34, 150, ["#3a3145", "#231c2b"]); R(g, x + 4, 0, 3, 150, "rgba(255,255,255,.06)"); R(g, x - 4, 138, 42, 12, "#4a3f57"); });
      // bilancia
      R(g, 158, 96, 4, 34, "#a17a26"); const tl = Math.sin(f * 0.025) * 3; g.strokeStyle = "#c79a35"; g.lineWidth = 2; g.beginPath(); g.moveTo(118, 100 + tl); g.lineTo(202, 100 - tl); g.stroke();
      [[118, tl, "#9fe6b5"], [202, -tl, "#e06a6a"]].forEach((s) => { g.strokeStyle = "#8c6a1e"; g.lineWidth = 1; g.beginPath(); g.moveTo(s[0], 100 + s[1]); g.lineTo(s[0] - 10, 118 + s[1]); g.moveTo(s[0], 100 + s[1]); g.lineTo(s[0] + 10, 118 + s[1]); g.stroke(); E(g, s[0], 119 + s[1], 12, 3, "#a17a26"); GL(g, s[0], 114 + s[1], 16, s[2] === "#9fe6b5" ? "120,255,170" : "255,90,90", 0.3); C(g, s[0], 114 + s[1], 3, s[2]); });
      // tavolo
      VG(g, 0, 130, W, 70, ["#4b2f22", "#24150f"]); R(g, 0, 130, W, 3, "#6a4532"); for (let i = 0; i < 12; i++) R(g, rnd(i) * W, 136 + rnd(i + 3) * 60, 30 + rnd(i + 1) * 40, 1, "rgba(0,0,0,.18)");
      // tre carte coperte
      for (let i = 0; i < 3; i++) { const x = 96 + i * 64, bob = Math.sin(f * 0.05 + i * 1.7) * 1.5; g.save(); g.translate(x, 164 + bob); g.rotate((i - 1) * 0.08); R(g, -17, -23, 34, 46, "#0d0a12"); R(g, -15, -21, 30, 42, i === 2 ? "#3a1620" : "#16332a"); g.strokeStyle = i === 2 ? "#e06a6a" : "#9fe6b5"; g.lineWidth = 1; g.strokeRect(-12, -18, 24, 36); TXT(g, i === 2 ? "☠" : "✚", 0, 5, "14px serif", i === 2 ? "#e06a6a" : "#9fe6b5"); g.restore(); }
      [[40, 176, 14], [58, 184, 9], [262, 184, 10], [282, 176, 15]].forEach((c, i) => candle(g, c[0], c[1], f, i + 3, c[2]));
      VIG(g, W, H, 0.6);
    },
    // il Campo del Mezzogiorno di Notte: luna enorme, porte storte, nebbia, spalti con sagome ferme
    cm_campo(g, W, H, f) {
      VG(g, 0, 0, W, 110, ["#05070f", "#0f1e2e", "#1d3a3a"]);
      for (let i = 0; i < 46; i++) { const tw = 0.4 + Math.sin(f * 0.05 + i) * 0.3; R(g, rnd(i) * W, rnd(i + 20) * 70, 1, 1, `rgba(220,255,235,${tw})`); }
      C(g, 232, 40, 26, "#d8f5e0"); C(g, 224, 34, 5, "#b9dcc6"); C(g, 240, 48, 7, "#bfe2cb"); C(g, 236, 30, 3, "#b9dcc6"); GL(g, 232, 40, 80, "150,255,190", 0.22 + Math.sin(f * 0.02) * 0.04);
      // nuvole davanti alla luna
      for (let i = 0; i < 3; i++) { const x = ((rnd(i + 40) * 400 + f * 0.1 * (1 + i * 0.4)) % 420) - 60; E(g, x, 34 + i * 12, 40, 6, "rgba(10,18,26,.55)"); }
      // colline e campanile
      P(g, [0, 96, 50, 78, 110, 92, 170, 74, 240, 90, 320, 76, 320, 112, 0, 112], "#0b1a1c"); R(g, 58, 56, 9, 30, "#0b1a1c"); P(g, [56, 56, 62.5, 44, 69, 56], "#0b1a1c"); R(g, 61, 62, 3, 4, f % 160 < 80 ? "#ffd27a" : "#3a2d12");
      // spalti con sagome immobili
      R(g, 0, 100, W, 22, "#111a1f"); for (let r = 0; r < 2; r++) for (let i = 0; i < 40; i++) { const x = 4 + i * 8 + r * 4, y = 106 + r * 8; C(g, x, y, 2, "#060a0d"); R(g, x - 2, y + 2, 4, 5, "#060a0d"); if (rnd(i + r * 50) > 0.86) { R(g, x - 1, y - 0.5, 1, 1, "#9fffc0"); R(g, x + 1, y - 0.5, 1, 1, "#9fffc0"); } }
      // campo
      VG(g, 0, 120, W, 80, ["#123524", "#0a1f15"]); for (let i = 0; i < 6; i++) P(g, [160 + (i - 3) * 30, 120, 160 + (i - 2.5) * 30, 120, 160 + (i - 2.5) * 110, 200, 160 + (i - 3) * 110, 200], "rgba(255,255,255,.025)");
      g.strokeStyle = "rgba(220,255,235,.5)"; g.lineWidth = 1; g.beginPath(); g.ellipse(160, 160, 46, 12, 0, 0, 7); g.moveTo(0, 160); g.lineTo(W, 160); g.stroke();
      // porte storte
      [[14, 1], [306, -1]].forEach(([x, d]) => { g.strokeStyle = "#e9efe9"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 172); g.lineTo(x + d * 3, 132); g.lineTo(x + d * 26, 136); g.lineTo(x + d * 24, 172); g.stroke(); g.strokeStyle = "rgba(233,239,233,.25)"; g.lineWidth = 1; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(x + d * k * 5, 133 + k); g.lineTo(x + d * k * 5, 172); g.stroke(); } });
      // la Coppa sul dischetto
      cup(g, 160, 164, 0.7, f, true);
      fog(g, W, 150, f, 7, 0.07); fog(g, W, 182, f * 1.4, 6, 0.09);
      // lucciole verdi
      for (let i = 0; i < 10; i++) { const x = (rnd(i + 70) * W + Math.sin(f * 0.02 + i) * 14) % W, y = 126 + rnd(i + 80) * 60 + Math.cos(f * 0.03 + i * 2) * 5; if (Math.sin(f * 0.06 + i * 1.3) > 0) GL(g, x, y, 5, "150,255,170", 0.6); }
      VIG(g, W, H, 0.5);
    },
  };
  const HOT = {
    cm_cripta: [[136, 70, 48, 60, "🏆 La Coppa del Mezzogiorno. Ottone annerito, due manici, una crepa. Sul piedistallo c'è scritto 1931. Sotto, più piccolo, a matita: «non lucidare»."], [20, 44, 68, 74, "🧣 Sciarpe annodate alle grate. Una per ogni squadra che ci ha provato. Qualcuna è di una squadra che non esiste più; qualcuna, di una che non è mai esistita."], [112, 46, 96, 20, "🫀 Cuori di latta: gli ex voto. Si appendono per ringraziare. Qui li appendono prima, per sicurezza."], [84, 140, 160, 36, "🕯️ I ceri li accende Evaristo ogni sera. Dice che non è superstizione: è manutenzione."]],
    cm_tabellone: [[49, 27, 222, 102, "📋 Il tabellone a gesso. I nomi si riscrivono ogni volta. Il gesso è sempre lo stesso dal '31: non finisce mai, e nessuno ha voglia di chiedersi perché."], [8, 40, 28, 80, "🖼️ Squadre che hanno alzato la Coppa. Sorridono tutte. Il nastrino nero l'hanno messo dopo."], [286, 40, 28, 80, "🖼️ L'ultima foto è del 1974. Poi, per cinquant'anni, non l'ha più vinta nessuno. In paese lo chiamano «il periodo buono»."], [140, 0, 40, 30, "💡 La lampadina dondola anche con le finestre chiuse. Evaristo dice che è il tram. Qui il tram non passa."]],
    cm_altare: [[80, 140, 160, 50, "🃏 Tre carte coperte. Due aiutano. Una fa male, ma paga. La Coppa è onesta: ti dice sempre quale è quale."], [100, 92, 120, 34, "⚖️ La bilancia non sta mai ferma. Pesa quello che prendi e quello che lasci. Per ora pende dalla tua parte."], [120, 12, 80, 80, "🪟 La vetrata: sei spicchi, un pallone al centro. Di giorno è brutta. Di notte anche, ma fa più effetto."]],
    cm_campo: [[206, 14, 52, 52, "🌕 Si gioca a mezzanotte, ma lo chiamano il Campo del Mezzogiorno: nel '31 la finale si giocò a mezzogiorno, e qualcuno giura che il sole non si mosse per tutta la partita."], [0, 100, 320, 22, "👥 Gli spalti sono pieni e nessuno tossisce. Meglio non contarli: il numero cambia."], [140, 136, 40, 30, "🏆 La Coppa aspetta sul dischetto. Chi la alza per ultimo se la porta a casa. È questo il problema."], [54, 44, 18, 44, "🔔 Il campanile ha una finestra accesa. Si spegne quando qualcuno segna."]],
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
  window.__coppaBg = { SC, HOT };
})();
