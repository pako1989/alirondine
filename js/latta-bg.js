// js/latta-bg.js - sfondi di «IL PALLONE DI LATTA» (320x200, pixel art): titolo (il castello al tramonto e l'armatura), Piazza del Palio, Museo dell'Armeria, Taverna del Gonfalone; cap.2 vicoli di notte, Bottega Stagnini, sacrestia. Animati, con punti da toccare
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const D = (g, cx, cy, r, c) => { g.fillStyle = c; for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy))); g.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1); } };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  // cielo a bande con scacchiera tra una banda e l'altra
  const bands = (g, W, y0, y1, cols) => { const n = cols.length, bh = (y1 - y0) / n; for (let i = 0; i < n; i++) { const a = Math.round(y0 + i * bh), b = Math.round(y0 + (i + 1) * bh); R(g, 0, a, W, b - a, cols[i]); if (i < n - 1) { g.fillStyle = cols[i + 1]; for (let y = b - 2; y < b; y++) for (let x = y % 2; x < W; x += 2) g.fillRect(x, y, 1, 1); } } };
  const cloud = (g, x, y, s, body, lit, shade) => { [[0, 0, 12], [-12, 3, 9], [12, 3, 10], [-21, 7, 6], [22, 7, 6], [5, -5, 9]].forEach(([a, b, r]) => D(g, x + a * s, y + b * s + 2, Math.round(r * s), shade)); [[0, 0, 12], [-12, 3, 9], [12, 3, 10], [-21, 7, 6], [22, 7, 6], [5, -5, 9]].forEach(([a, b, r]) => D(g, x + a * s, y + b * s, Math.round(r * s), body)); [[0, 0, 12], [-12, 3, 9], [5, -5, 9]].forEach(([a, b, r]) => D(g, x + a * s - 1, y + b * s - 3, Math.max(1, Math.round(r * s) - 4), lit)); };
  const flag = (g, x, y, f, c) => { R(g, x, y - 10, 1, 10, "#2a1830"); for (let i = 0; i < 6; i++) R(g, x + 1 + i, y - 10 + Math.round(Math.sin(f / 6 + i * 0.9 + x) * 1), 1, 4, i % 2 ? c : "#f07a5a"); };
  // castello in silhouette: torri con tetti a punta, finestre accese
  const castle = (g, x, y, s, f, body, edge, roof) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    const tw = (tx, w, h, cone) => { R(g, tx, -h, w, h, body); R(g, tx, -h, 1, h, edge); for (let i = 0; i < w; i += 4) R(g, tx + i, -h - 3, 2, 3, body); if (cone) { for (let i = 0; i < cone; i++) { const ww = Math.max(1, Math.round((w / 2) * (1 - i / cone)) * 2); R(g, tx + w / 2 - ww / 2, -h - i - 1, ww, 1, i % 5 ? roof : edge); } flag(g, tx + w / 2, -h - cone - 1, f, "#e85a4a"); } for (let wy = -h + 8; wy < -6; wy += 11) R(g, tx + w / 2 - 1, wy, 2, 4, Math.sin(f / 30 + tx + wy) > -0.7 ? "#ffcf6a" : "#3a2440"); };
    R(g, -60, -30, 120, 30, body); for (let i = -60; i < 60; i += 6) R(g, i, -34, 4, 4, body);
    tw(-56, 18, 58, 22); tw(-30, 14, 80, 30); tw(-10, 22, 104, 38); tw(16, 14, 70, 24); tw(36, 20, 50, 0);
    g.restore();
  };
  const crow = (g, x, y, f, k) => { const up = Math.sin(f / 4 + k) > 0; R(g, x - 3, y, 7, 3, "#16141f"); R(g, x + 3, y - 1, 3, 2, "#16141f"); R(g, x + 6, y, 2, 1, "#e0a020"); R(g, x - 2, y + 1, 1, 2, "#e8e8e8"); R(g, x + 1, y + 1, 1, 2, "#e8e8e8"); if (up) { R(g, x - 4, y - 4, 4, 4, "#16141f"); R(g, x + 1, y - 3, 3, 3, "#16141f"); } else { R(g, x - 5, y + 3, 4, 2, "#16141f"); R(g, x + 1, y + 3, 4, 2, "#16141f"); } };
  // l'armatura di Ferro, grande, col pallone di latta nel petto che pulsa
  const ferro = (g, x, y, s, f) => {
    g.save(); g.translate(x, y); g.scale(s, s); const O = "#16141f", A = "#a6afc2", L = "#e2e8f2", Dk = "#626b80";
    const p = (a, b, w, h, c) => { R(g, a - 1, b - 1, w + 2, h + 2, O); R(g, a, b, w, h, c); };
    p(-5, -7, 4, 7, Dk); p(1, -7, 4, 7, A); p(-6, -2, 6, 2, A); p(1, -2, 6, 2, L);
    p(-8, -20, 4, 9, Dk); p(-6, -21, 12, 13, A); R(g, -6, -21, 12, 2, L); R(g, -6, -21, 2, 11, L); R(g, -6, -10, 12, 2, "#6b4426");
    D(g, 0, -16, 3, "#c88a2a"); R(g, -1, -18, 2, 1, "#ffe8a0"); GL(g, 0, -16, 10, "255,190,90", 0.25 + 0.15 * Math.sin(f / 8));
    p(5, -20, 4, 9, A); p(-5, -30, 11, 9, A); R(g, -5, -30, 11, 1, L); R(g, -2, -26, 7, 2, "#0b0b12"); R(g, 3, -26, 1, 1, "#ffd25a");
    const w = Math.round(Math.sin(f / 7) * 1.5); R(g, -2 + w, -35, 4, 5, O); R(g, -1 + w, -34, 2, 4, "#d23a3a"); R(g, -5 + w, -33, 4, 3, O); R(g, -4 + w, -33, 3, 2, "#8e1f2a");
    g.restore();
  };
  const SC = {
    lt_titolo(g, W, H, f) {
      bands(g, W, 0, 150, ["#3a2858", "#54306c", "#7a3c78", "#a84a7c", "#d0607a", "#e8806a", "#f2a066", "#f6c070"]);
      D(g, 238, 118, 26, "#f8d488"); D(g, 238, 118, 21, "#ffe6a8"); D(g, 238, 118, 15, "#fff3cc");
      cloud(g, ((f * 0.1) % 380) - 30, 40, 1.1, "#f4a8a0", "#ffd8b0", "#b8607e"); cloud(g, ((f * 0.06 + 200) % 380) - 30, 70, 0.8, "#f8b8a4", "#ffe4c0", "#c87088");
      castle(g, 200, 150, 1, f, "#5c3a6c", "#7a5288", "#47284f");
      // collina e Mura
      g.fillStyle = "#3a2448"; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 4) g.lineTo(x, 150 + Math.sin(x / 40) * 6 + (x < 120 ? 10 : 0)); g.lineTo(W, 200); g.fill();
      for (let x = 0; x < W; x += 8) { R(g, x, 158 + Math.sin(x / 40) * 6, 7, 3, "#c87a4a"); R(g, x, 158 + Math.sin(x / 40) * 6, 7, 1, "#e39a62"); }
      for (let i = 0; i < 5; i++) crow(g, ((f * (0.5 + i * 0.12) + i * 70) % 360) - 20, 60 + i * 9 + Math.sin(f / 20 + i) * 4, f, i);
      ferro(g, 70, 186, 2.6, f);
      g.textAlign = "center"; g.font = "900 20px 'Trebuchet MS', sans-serif"; g.fillStyle = "#2a1830"; g.fillText("IL PALLONE", 202, 34); g.fillText("DI LATTA", 202, 56); g.fillStyle = "#fde68a"; g.fillText("IL PALLONE", 200, 32); g.fillStyle = "#f59e0b"; g.fillText("DI LATTA", 200, 54);
      VIG(g, W, H, 0.4);
    },
    lt_piazza(g, W, H, f) {
      bands(g, W, 0, 90, ["#54306c", "#7a3c78", "#a84a7c", "#d0607a", "#e8806a", "#f2a066"]);
      cloud(g, ((f * 0.08 + 60) % 380) - 30, 30, 0.9, "#f4a8a0", "#ffd8b0", "#b8607e");
      castle(g, 160, 92, 0.75, f, "#5c3a6c", "#7a5288", "#47284f");
      // Mura con portone e torce
      R(g, 0, 70, W, 34, "#b86e42"); for (let y = 70; y < 104; y += 5) for (let x = (y / 5) % 2 ? -6 : 0; x < W; x += 12) { R(g, x + 1, y + 1, 10, 3, "#c87a4a"); R(g, x + 1, y + 1, 10, 1, "#e39a62"); }
      for (let x = 0; x < W; x += 12) R(g, x, 64, 8, 7, "#b86e42");
      R(g, 140, 74, 40, 30, "#3a1e0e"); D(g, 160, 74, 20, "#3a1e0e"); R(g, 144, 74, 32, 30, "#7a4a22"); D(g, 160, 76, 16, "#7a4a22"); for (let i = 0; i < 4; i++) R(g, 149 + i * 7, 70, 1, 34, "#4a2a10");
      [[130, 80], [190, 80]].forEach(([x, y], i) => { R(g, x, y, 2, 8, "#3a2a1a"); R(g, x - 1, y - 4 - Math.abs(Math.sin(f / 4 + i)) * 2, 4, 5, "#f59e0b"); GL(g, x + 1, y - 2, 24, "255,170,80", 0.4); });
      // piazza: acciottolato, fontana, tribuna, bancarelle
      R(g, 0, 104, W, 96, "#8a6e5e"); for (let y = 106; y < 200; y += 6) for (let x = (y / 6) % 2 ? -4 : 0; x < W; x += 9) { R(g, x + 1, y, 7, 4, ["#a88a78", "#b49684", "#9c7e6c"][(x + y) % 3]); R(g, x + 1, y, 7, 1, "#c8aa98"); }
      R(g, 10, 104, 90, 26, "#8a5a32"); for (let i = 0; i < 3; i++) R(g, 10, 106 + i * 8, 90, 2, "#6a4426"); for (let i = 0; i < 9; i++) R(g, 10 + i * 10, 126, 10, 6, i % 2 ? "#c02a3a" : "#f0c040");
      for (let i = 0; i < 12; i++) { const bx = 14 + i * 7, by = 108 + (i % 3) * 7 - Math.abs(Math.sin(f / 8 + i)) * 2; R(g, bx, by, 4, 4, ["#2563eb", "#16a34a", "#db2777", "#f59e0b"][i % 4]); R(g, bx + 1, by - 3, 2, 3, "#e8c0a0"); }
      D(g, 160, 150, 22, "#9a8a80"); D(g, 160, 150, 18, "#4a8ab8"); R(g, 157, 124, 6, 26, "#b8a89c"); for (let i = 0; i < 8; i++) { const p = (f / 3 + i * 5) % 20; R(g, 160 + (i % 2 ? 1 : -1) * p * 0.6, 126 + p * 1.1, 1, 2, "rgba(200,230,255,.9)"); } GL(g, 160, 145, 30, "160,200,255", 0.15);
      [[230, "#c02a3a"], [270, "#2563eb"]].forEach(([x, c]) => { R(g, x, 118, 2, 26, "#6a4426"); R(g, x + 30, 118, 2, 26, "#6a4426"); for (let i = 0; i < 8; i++) R(g, x - 2 + i * 4.5, 112, 4.5, 8, i % 2 ? "#f8f4e8" : c); R(g, x, 134, 32, 8, "#8a5a32"); ["#f6c445", "#e05a2a", "#8bc34a", "#f6c445"].forEach((cc, i) => R(g, x + 3 + i * 7, 131, 5, 3, cc)); });
      for (let i = 0; i < 4; i++) crow(g, ((f * (0.45 + i * 0.1) + i * 90) % 360) - 20, 22 + i * 10 + Math.sin(f / 18 + i) * 3, f, i);
      VIG(g, W, H, 0.35);
    },
    lt_armeria(g, W, H, f) {
      R(g, 0, 0, W, 130, "#2a1e2a"); for (let x = 0; x < W; x += 40) { R(g, x, 0, 3, 130, "#3a2a3a"); }
      R(g, 0, 130, W, 70, "#5a3a4a"); for (let y = 130; y < 200; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < W; x += 20) R(g, x, y, 10, 10, "#e8dcc8");
      // finestra con il Torrione
      R(g, 128, 14, 64, 54, "#16141f"); R(g, 130, 16, 60, 50, "#e8806a"); R(g, 130, 16, 60, 20, "#a84a7c"); R(g, 152, 30, 10, 36, "#5c3a6c"); for (let i = 0; i < 10; i += 4) R(g, 152 + i, 27, 2, 3, "#5c3a6c"); crow(g, 156 + Math.sin(f / 30) * 6, 24, f, 0); R(g, 159, 16, 2, 50, "#16141f"); R(g, 130, 40, 60, 2, "#16141f");
      // vetrine con armature e la principale illuminata
      [[30, 0.9], [80, 0.9], [240, 0.9], [290, 0.9]].forEach(([x, s], i) => { ferro(g, x, 132, 1.6 * s, f + i * 30); R(g, x - 16, 74, 32, 60, "rgba(200,230,255,.12)"); R(g, x - 16, 74, 1, 60, "rgba(255,255,255,.3)"); R(g, x - 18, 132, 36, 6, "#3a2a1a"); });
      R(g, 135, 150, 50, 8, "#3a2a1a"); ferro(g, 160, 152, 2.2, f); GL(g, 160, 115, 50, "255,210,150", 0.25 + 0.08 * Math.sin(f / 10));
      R(g, 140, 160, 40, 9, "#f8f4e8"); g.fillStyle = "#16141f"; g.font = "700 6px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.fillText("1527 · IGNOTO", 160, 167);
      VIG(g, W, H, 0.5);
    },
    lt_taverna(g, W, H, f) {
      R(g, 0, 0, W, 200, "#3a2416"); for (let x = 0; x < W; x += 32) R(g, x, 0, 4, 120, "#2a180e"); R(g, 0, 18, W, 6, "#2a180e");
      R(g, 0, 120, W, 80, "#7a5232"); for (let y = 128; y < 200; y += 9) R(g, 0, y, W, 1, "#4a2e18");
      // camino col fuoco
      R(g, 14, 60, 70, 64, "#5a4a4a"); R(g, 24, 80, 50, 44, "#16141f"); for (let i = 0; i < 6; i++) { const h = 14 + Math.abs(Math.sin(f / 5 + i * 1.3)) * 14; R(g, 30 + i * 7, 124 - h, 6, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 49, 110, 70, "255,150,60", 0.45 + 0.1 * Math.sin(f / 4));
      // botti
      [[230, 96], [262, 96], [294, 96], [246, 66], [278, 66]].forEach(([x, y]) => { D(g, x, y, 15, "#16141f"); D(g, x, y, 14, "#7a4a22"); D(g, x, y, 9, "#9a6232"); R(g, x - 1, y - 1, 2, 2, "#4a2a10"); });
      // bancone e tavolo con Mattonaro in controluce
      R(g, 100, 112, 110, 14, "#4a2e18"); R(g, 100, 110, 110, 3, "#8a5a32"); [[120, "#f6c445"], [150, "#e8e8e8"], [180, "#c02a3a"]].forEach(([x, c]) => { R(g, x, 100, 6, 10, c); R(g, x, 100, 6, 2, "rgba(255,255,255,.4)"); });
      R(g, 150, 160, 70, 8, "#5a3a20"); R(g, 160, 168, 4, 26, "#4a2e18"); R(g, 206, 168, 4, 26, "#4a2e18"); R(g, 190, 128, 14, 32, "#0f172a"); D(g, 197, 122, 7, "#e8c4a0"); R(g, 190, 116, 14, 4, "#1c1917"); R(g, 193, 124, 8, 1, "#1c1917");
      R(g, 160, 154, 10, 6, "#f6c445"); GL(g, 165, 156, 14, "255,220,120", 0.3 + 0.2 * Math.sin(f / 7));
      VIG(g, W, H, 0.5);
    },
    // capitolo 2: i vicoli di notte, coi tetti, la luna e il campanile che suona da solo
    lt_vicoli(g, W, H, f) {
      bands(g, W, 0, 120, ["#0b1030", "#121a44", "#1a2458", "#24306a", "#33407a", "#4a4c86"]);
      for (let i = 0; i < 46; i++) { const x = rnd(i) * W, y = rnd(i + 50) * 90, tw = Math.sin(f / 12 + i * 3) > 0.6; R(g, x, y, 1, 1, tw ? "#fff8d0" : "#a8b4e8"); if (tw && i % 5 === 0) { R(g, x - 1, y, 3, 1, "rgba(255,248,208,.5)"); R(g, x, y - 1, 1, 3, "rgba(255,248,208,.5)"); } }
      const sh = (f * 1.6) % 900; if (sh < 60) { for (let k = 0; k < 10; k++) R(g, 260 - sh * 2 + k * 2, 14 + sh * 0.6 - k * 0.6, 2, 1, `rgba(255,255,230,${1 - k / 10})`); }
      D(g, 62, 36, 18, "#e8e4c0"); D(g, 62, 36, 15, "#fffbe0"); D(g, 56, 31, 3, "#e8e4c0"); D(g, 68, 42, 2, "#e8e4c0"); GL(g, 62, 36, 60, "200,210,255", 0.18);
      // campanile con la campana che oscilla
      R(g, 228, 18, 34, 132, "#2a2444"); R(g, 228, 18, 2, 132, "#3a3460"); for (let i = 0; i < 34; i += 6) R(g, 228 + i, 12, 4, 6, "#2a2444");
      R(g, 236, 30, 18, 24, "#0b0b1a"); const sw = Math.sin(f / 9) * 0.5; g.save(); g.translate(245, 32); g.rotate(sw); D(g, 0, 10, 7, "#8a6a2a"); R(g, -7, 10, 14, 4, "#8a6a2a"); R(g, -6, 4, 12, 7, "#b88a3a"); R(g, -2, 2, 4, 3, "#6a4a1a"); g.restore(); GL(g, 245, 44, 28, "255,200,120", 0.15 + 0.1 * Math.abs(sw));
      if (Math.abs(sw) > 0.42) { g.fillStyle = "rgba(255,240,200,.7)"; g.font = "700 8px sans-serif"; g.textAlign = "center"; g.fillText("DON!", sw > 0 ? 276 : 214, 40); }
      // tetti a coppi su più file
      const roofRow = (y0, c, hi, n, seed) => { for (let i = 0; i < n; i++) { const w = 46 + rnd(i + seed) * 30, x = i * 56 - 10 + rnd(i * 3 + seed) * 10, h = 20 + rnd(i + seed * 2) * 14; R(g, x, y0 - h + 8, w, h + 30, c); for (let r = 0; r < 4; r++) for (let cx = 0; cx < w; cx += 5) R(g, x + cx + (r % 2) * 2, y0 - h + 8 + r * 4, 4, 2, hi); for (let k = 0; k < 2; k++) { const lit = rnd(i * 7 + k + seed) < 0.5; R(g, x + 8 + k * 18, y0 - h + 26, 6, 7, lit ? "#ffd98a" : "#1a1a30"); if (lit) GL(g, x + 11 + k * 18, y0 - h + 29, 12, "255,210,130", 0.3); } if (rnd(i + seed * 5) < 0.6) { const cx = x + w - 14; R(g, cx, y0 - h - 6, 7, 14, "#4a2e2e"); for (let p = 0; p < 4; p++) { const t = (f / 2 + p * 12 + i * 7) % 48; D(g, cx + 3 + Math.sin(t / 8 + i) * 4, y0 - h - 8 - t, 2 + t / 16, `rgba(200,200,220,${0.35 - t / 160})`); } } } };
      roofRow(128, "#3a2a4a", "#4a3a5e", 7, 1); roofRow(158, "#6a3030", "#8a4038", 7, 4);
      // gatto sul colmo, coda che si muove, e una lanterna nel vicolo
      const cx = 150 + Math.sin(f / 60) * 40; R(g, cx - 6, 112, 12, 6, "#0b0b12"); R(g, cx + 4, 108, 5, 5, "#0b0b12"); R(g, cx + 4, 106, 1, 2, "#0b0b12"); R(g, cx + 8, 106, 1, 2, "#0b0b12"); R(g, cx + 6, 110, 1, 1, "#fde047"); R(g, cx - 8, 104 + Math.round(Math.sin(f / 8) * 2), 2, 9, "#0b0b12");
      R(g, 0, 176, W, 24, "#2a2438"); for (let x = 0; x < W; x += 9) R(g, x + 1, 180 + (x % 2) * 6, 7, 4, "#3a3448");
      R(g, 112, 150, 2, 30, "#16141f"); R(g, 108, 144, 10, 8, "#16141f"); R(g, 109, 145, 8, 6, "#ffd98a"); GL(g, 113, 148, 40, "255,200,110", 0.4 + 0.05 * Math.sin(f / 6));
      VIG(g, W, H, 0.5);
    },
    lt_bottega(g, W, H, f) {
      R(g, 0, 0, W, 200, "#2a2026"); for (let x = 0; x < W; x += 28) R(g, x, 0, 3, 130, "#1e161c");
      R(g, 0, 130, W, 70, "#4a3a32"); for (let y = 136; y < 200; y += 8) R(g, 0, y, W, 1, "#3a2c26");
      // fucina accesa
      R(g, 220, 70, 80, 64, "#3a3436"); R(g, 232, 88, 56, 40, "#16141f"); for (let i = 0; i < 7; i++) { const h = 8 + Math.abs(Math.sin(f / 4 + i * 1.7)) * 16; R(g, 236 + i * 7, 128 - h, 6, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 260, 116, 80, "255,140,60", 0.45 + 0.1 * Math.sin(f / 3));
      for (let i = 0; i < 5; i++) { const t = (f * 0.7 + i * 30) % 120; R(g, 250 + Math.sin(t / 10 + i) * 10, 86 - t * 0.6, 1, 1, "#ffd25a"); }
      // latte appese: pentole, lanterne, imbuti, che brillano e oscillano
      for (let i = 0; i < 9; i++) { const x = 16 + i * 22, y = 26 + (i % 3) * 8, sw = Math.round(Math.sin(f / 14 + i) * 2); R(g, x + 5, 0, 1, y, "#5a5050"); const c = ["#c8d0de", "#a6afc2", "#e2e8f2"][i % 3]; if (i % 3 === 0) { D(g, x + 5 + sw, y + 8, 7, c); R(g, x - 2 + sw, y + 2, 14, 2, "#7a8090"); } else if (i % 3 === 1) { R(g, x + sw, y, 11, 14, c); R(g, x + 2 + sw, y + 3, 7, 8, "#ffd98a"); } else { R(g, x + sw, y, 11, 4, c); R(g, x + 3 + sw, y + 4, 5, 5, c); R(g, x + 5 + sw, y + 9, 1, 5, c); } R(g, x + 1 + sw, y + 1, 2, 2, "rgba(255,255,255,.6)"); }
      // banco con lo stampo del pallone e il registro aperto
      R(g, 30, 120, 150, 12, "#5a3a20"); R(g, 30, 118, 150, 3, "#8a5a32"); R(g, 40, 132, 6, 50, "#3a2416"); R(g, 164, 132, 6, 50, "#3a2416");
      D(g, 70, 112, 8, "#7a8090"); D(g, 70, 112, 6, "#c8a040"); R(g, 66, 108, 2, 2, "#fff3c0"); R(g, 64, 114, 12, 1, "#8a6a2a");
      R(g, 110, 106, 44, 12, "#f0e4c8"); R(g, 131, 106, 2, 12, "#c8b898"); for (let l = 0; l < 4; l++) { R(g, 113, 108 + l * 2.5, 15, 1, "#6a5a4a"); R(g, 136, 108 + l * 2.5, 15, 1, "#6a5a4a"); } R(g, 140, 108, 10, 2, "#16141f");
      GL(g, 132, 100, 30, "255,220,150", 0.2);
      // martello che batte (scintille sull'incudine)
      R(g, 196, 150, 20, 8, "#3a3a44"); R(g, 200, 158, 12, 16, "#2a2a32"); const hm = Math.abs(Math.sin(f / 6)); R(g, 210, 128 + hm * 14, 3, 16, "#6a4426"); R(g, 205, 126 + hm * 14, 12, 6, "#5a5a66"); if (hm > 0.9) for (let i = 0; i < 5; i++) R(g, 206 + i * 3, 146 - i % 3 * 3, 1, 1, "#ffd25a");
      VIG(g, W, H, 0.5);
    },
    lt_sacrestia(g, W, H, f) {
      R(g, 0, 0, W, 200, "#242030"); for (let y = 0; y < 130; y += 10) for (let x = (y / 10) % 2 ? -10 : 0; x < W; x += 20) { R(g, x + 1, y + 1, 18, 8, "#2e2a3c"); R(g, x + 1, y + 1, 18, 1, "#3a3650"); }
      R(g, 0, 130, W, 70, "#3a3448"); for (let y = 130; y < 200; y += 14) for (let x = (y / 14) % 2 ? 0 : 14; x < W; x += 28) R(g, x, y, 14, 14, "#46405a");
      // vetrata con la luna
      R(g, 130, 10, 60, 80, "#16141f"); D(g, 160, 30, 30, "#16141f"); const cols = ["#3b82f6", "#a855f7", "#f59e0b", "#22c55e", "#ef4444"]; for (let y = 0; y < 6; y++) for (let x = 0; x < 5; x++) R(g, 134 + x * 10.4, 22 + y * 11, 9, 10, cols[(x + y) % 5]); D(g, 160, 26, 10, "#fff3c0"); GL(g, 160, 50, 70, "180,160,255", 0.18);
      // la corda della campana che si muove da sola, e la scala a chiocciola
      const ry = Math.sin(f / 9) * 10; R(g, 238, 0, 3, 130 + ry, "#c8a070"); R(g, 236, 126 + ry, 7, 12, "#b8302a"); R(g, 237, 128 + ry, 5, 2, "#e85a4a");
      for (let i = 0; i < 9; i++) R(g, 262 + (i % 2) * 12, 180 - i * 18, 40, 6, i % 2 ? "#4a3a2a" : "#5a4a34"); R(g, 286, 0, 4, 190, "#2a2018");
      // candele e armadio dei paramenti
      [[40, 140], [56, 136], [72, 140]].forEach(([x, y], i) => { R(g, x, y, 4, 16, "#f8f4e8"); const h = 3 + Math.abs(Math.sin(f / 5 + i)) * 2; R(g, x + 1, y - h, 2, h, "#ffd25a"); GL(g, x + 2, y - 2, 20, "255,200,110", 0.35); });
      R(g, 20, 60, 70, 70, "#3a2416"); R(g, 24, 64, 30, 62, "#5a3a20"); R(g, 56, 64, 30, 62, "#5a3a20"); R(g, 52, 92, 2, 6, "#e0b040"); R(g, 56, 92, 2, 6, "#e0b040");
      VIG(g, W, H, 0.5);
    }
  };
  const HOT = {
    lt_vicoli: [[226, 10, 40, 140, "🔔 Il campanile di San Rocco. La campana suona da sola, a mezzanotte e anche prima. Senza batacchio, dicono. Eppure suona."], [40, 14, 46, 46, "🌕 La luna sopra Castelrondine. Stanotte è così grande che i gatti le fanno l'ombra."], [100, 100, 100, 30, "🐈‍⬛ Un gatto sul colmo del tetto. Ti guarda come si guarda un barattolo che cammina."]],
    lt_bottega: [[220, 70, 80, 64, "🔥 La fucina della Bottega Stagnini. Accesa da cinque secoli, dice Zeno. Spenta solo per le partite della Nazionale."], [60, 100, 100, 30, "📖 Il registro di bottega aperto e lo stampo tondo di un pallone. Le pagine più vecchie sono del Cinquecento."], [10, 0, 200, 60, "🫖 Latte appese: pentole, lanterne, imbuti. Quando passa un camion suonano tutte insieme."]],
    lt_sacrestia: [[130, 10, 60, 80, "🪟 La vetrata: un santo con un pallone sotto il braccio. Il parroco dice che è una pagnotta."], [230, 0, 20, 140, "🔔 La corda della campana si muove da sola. Lassù qualcosa tira."], [255, 20, 60, 170, "🌀 La scala a chiocciola del campanile: centotré gradini, e uno scricchiola apposta."]],
    lt_titolo: [[40, 100, 70, 90, "🛡️ L'armatura del 1527. Nel petto, un pallone di latta che batte piano, come un cuore di stagno."], [150, 40, 110, 110, "🏰 Il castello di Castelrondine. Stasera le finestre si accendono da sole."], [0, 40, 320, 50, "🐦‍⬛ Corvi con la maglia a righe. Fischiano. Fischiano tutto."]],
    lt_piazza: [[140, 60, 40, 44, "🚪 Il portone delle Mura: si apre solo per il corteo. Stasera, si apre anche per altro."], [10, 104, 90, 30, "🎪 La tribuna del Palio: il pubblico tifa per le contrade e mangia frittelle per tutte."], [136, 124, 48, 50, "⛲ La fontana: chi butta una moneta la sera del Palio vince l'anno dopo. Il fondo è pieno di sconfitte."]],
    lt_armeria: [[130, 80, 60, 90, "🛡️ Il Cavaliere di Latta, 1527, ignoto. L'unica armatura senza un documento. L'unica che respira."], [128, 14, 64, 54, "🪟 Dalla finestra, il Torrione. Sopra, un punto nero che non sembra un uccello normale."], [10, 70, 100, 70, "⚔️ Armature da torneo. Ognuna ha un nome sul cartellino, tranne una."]],
    lt_taverna: [[14, 60, 70, 64, "🔥 Il camino acceso anche d'estate. Bacco dice che serve alla torta."], [215, 50, 100, 65, "🛢️ Botti di rosso delle colline. Su una: «NON APRIRE PRIMA DEL PALIO»."], [150, 110, 70, 60, "💼 Al tavolo d'angolo qualcuno conta monete d'oro e sorride ai conti."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
