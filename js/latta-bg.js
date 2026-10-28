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
    // capitolo 4: la rocca nel temporale, il salone d'armi, lo studiolo con la porta della torre
    lt_rocca(g, W, H, f) {
      bands(g, W, 0, 130, ["#0b0e1c", "#121628", "#1a2034", "#222a40", "#2a334a", "#343e56"]);
      const fl = (f % 260) < 6 || ((f % 260) > 10 && (f % 260) < 13);
      if (fl) { R(g, 0, 0, W, 130, "rgba(220,230,255,.35)"); g.strokeStyle = "#f8fbff"; g.lineWidth = 2; g.beginPath(); g.moveTo(206, 0); g.lineTo(198, 22); g.lineTo(212, 30); g.lineTo(200, 58); g.lineTo(214, 66); g.lineTo(204, 92); g.stroke(); }
      for (let i = 0; i < 3; i++) cloud(g, ((f * (0.12 + i * 0.05) + i * 130) % 420) - 60, 10 + i * 14, 1.2, "#1e2436", "#2e364c", "#12162a");
      // la torre del Conestabile al centro, con la finestra accesa in cima
      R(g, 186, 10, 50, 140, "#2a2a36"); R(g, 186, 10, 3, 140, "#3a3a4a"); for (let i = 0; i < 50; i += 10) R(g, 186 + i, 2, 6, 8, "#2a2a36"); for (let y = 16; y < 150; y += 10) for (let x = (y / 10) % 2 ? 186 : 191; x < 236; x += 10) R(g, x, y, 9, 1, "#22222e");
      R(g, 204, 26, 14, 18, "#16141f"); R(g, 206, 28, 10, 16, fl ? "#fff" : "#f59e0b"); GL(g, 211, 36, 30, "255,170,80", 0.35 + 0.1 * Math.sin(f / 7));
      R(g, 226, -4, 2, 16, "#16141f"); const fw = Math.sin(f / 5) * 4; g.fillStyle = "#7a1a1a"; g.beginPath(); g.moveTo(228, -2); g.lineTo(244 + fw, 2); g.lineTo(228, 8); g.fill();
      // mura laterali con merli
      R(g, 0, 100, W, 50, "#3a3a46"); for (let x = 0; x < W; x += 16) R(g, x, 94, 10, 8, "#3a3a46"); for (let y = 104; y < 150; y += 8) for (let x = (y / 8) % 2 ? 0 : 8; x < W; x += 16) R(g, x, y, 15, 1, "#2e2e3a");
      R(g, 36, 106, 40, 44, "#16141f"); D(g, 56, 108, 20, "#16141f"); R(g, 280, 110, 24, 40, "#16141f"); D(g, 292, 112, 12, "#16141f"); R(g, 284, 120, 16, 12, "#ffd98a"); GL(g, 292, 126, 24, "255,200,110", 0.35);
      // cortile lastricato bagnato con le pozzanghere
      R(g, 0, 150, W, 50, "#2e3240"); for (let y = 154; y < 200; y += 9) for (let x = (y / 9) % 2 ? 0 : 12; x < W; x += 24) R(g, x, y, 22, 1, "#3a4050");
      [[80, 176, 30], [240, 186, 40], [150, 168, 20]].forEach(([x, y, w], i) => { R(g, x, y, w, 4, fl ? "#a8b8e0" : "#4a5878"); const r = (f * 0.5 + i * 10) % 14; R(g, x + w / 2 - r, y + 1, r * 2, 1, "rgba(200,220,255,.4)"); });
      // pioggia
      for (let i = 0; i < 70; i++) { const x = (rnd(i) * 360 + f * 1.4) % 340 - 10, y = (rnd(i + 9) * 220 + f * 6) % 210 - 10; R(g, x, y, 1, 5, "rgba(170,190,230,.45)"); }
      VIG(g, W, H, 0.5);
    },
    lt_salone(g, W, H, f) {
      R(g, 0, 0, W, 200, "#2a1e1e"); for (let y = 0; y < 136; y += 12) for (let x = (y / 12) % 2 ? -14 : 0; x < W; x += 28) { R(g, x + 1, y + 1, 26, 10, "#34262a"); R(g, x + 1, y + 1, 26, 1, "#423036"); }
      R(g, 0, 136, W, 64, "#4a2e22"); for (let y = 140; y < 200; y += 12) for (let x = (y / 12) % 2 ? 0 : 20; x < W; x += 40) R(g, x, y, 38, 1, "#3a2218");
      // stendardi rossi appesi e spade incrociate
      [30, 270].forEach((x, i) => { const sw = Math.sin(f / 30 + i) * 1.5; R(g, x - 2, 6, 34, 3, "#6a4a2a"); g.fillStyle = "#8a1a1a"; g.beginPath(); g.moveTo(x, 9); g.lineTo(x + 30, 9); g.lineTo(x + 30 + sw, 70); g.lineTo(x + 15 + sw, 60); g.lineTo(x + sw, 70); g.fill(); D(g, x + 15 + sw * 0.5, 34, 7, "#e0b040"); D(g, x + 15 + sw * 0.5, 34, 5, "#8a1a1a"); });
      g.strokeStyle = "#c8d0de"; g.lineWidth = 2; g.beginPath(); g.moveTo(130, 20); g.lineTo(190, 60); g.moveTo(190, 20); g.lineTo(130, 60); g.stroke(); D(g, 160, 40, 9, "#6a4a2a"); D(g, 160, 40, 7, "#b88a3a");
      // fila di armature, quella nera del Conestabile al centro
      for (let i = 0; i < 5; i++) { const x = 40 + i * 58, k = i === 2, c = k ? "#1a1a22" : "#a6afc2", hi = k ? "#3a3a4a" : "#e2e8f2"; R(g, x - 6, 150, 32, 8, "#3a2a1e"); R(g, x, 104, 20, 46, c); R(g, x + 2, 92, 16, 14, c); R(g, x + 4, 98, 12, 2, "#16141f"); R(g, x, 104, 3, 46, hi); R(g, x - 6, 106, 6, 30, c); R(g, x + 20, 106, 6, 30, c); if (k) { R(g, x + 6, 96, 2, 2, "#ef4444"); R(g, x + 12, 96, 2, 2, "#ef4444"); D(g, x + 10, 120, 4, "#e0b040"); GL(g, x + 10, 120, 14, "255,200,80", 0.3 + 0.2 * Math.sin(f / 9)); R(g, x + 28, 70, 2, 84, "#5a4a3a"); g.fillStyle = "#c8d0de"; g.beginPath(); g.moveTo(x + 29, 60); g.lineTo(x + 25, 72); g.lineTo(x + 33, 72); g.fill(); } }
      // finestrone col temporale e il lampo
      const fl = (f % 240) < 5; R(g, 140, 70, 40, 56, "#16141f"); R(g, 142, 72, 36, 52, fl ? "#e8f0ff" : "#1e2436"); R(g, 159, 72, 2, 52, "#16141f"); for (let i = 0; i < 8; i++) R(g, 144 + (i * 5 + f) % 34, 74 + (i * 13 + f * 3) % 48, 1, 4, "rgba(170,190,230,.5)");
      if (fl) R(g, 0, 0, W, 200, "rgba(220,230,255,.12)");
      VIG(g, W, H, 0.55);
    },
    lt_studiolo(g, W, H, f) {
      R(g, 0, 0, W, 200, "#1e1a22"); for (let x = 0; x < W; x += 32) R(g, x, 0, 4, 132, "#16121a");
      R(g, 0, 132, W, 68, "#3a2a22"); for (let y = 136; y < 200; y += 10) R(g, 0, y, W, 1, "#2a1e18");
      // scrittoio con la mappa del Borgo, il calamaio e la clessidra
      R(g, 30, 120, 120, 12, "#4a2e18"); R(g, 30, 118, 120, 3, "#7a4a28"); R(g, 38, 132, 6, 50, "#2a1810"); R(g, 136, 132, 6, 50, "#2a1810");
      R(g, 44, 108, 60, 12, "#d8c8a0"); for (let i = 0; i < 6; i++) R(g, 50 + i * 9, 110 + (i % 2) * 4, 6, 3, "#8a6a4a"); R(g, 70, 112, 3, 3, "#c02a3a");
      R(g, 112, 108, 8, 10, "#16141f"); R(g, 118, 96, 1, 14, "#f8f4e8"); const sand = (f % 300) / 300; R(g, 128, 100, 12, 2, "#6a4a2a"); R(g, 128, 116, 12, 2, "#6a4a2a"); R(g, 130, 102, 8, 6 * (1 - sand), "#e0c080"); R(g, 130, 116 - 6 * sand, 8, 6 * sand, "#e0c080"); R(g, 133, 108, 2, 8, "rgba(224,192,128,.6)");
      // candelabro
      for (let i = 0; i < 3; i++) { const x = 76 + i * 8, h = 3 + Math.abs(Math.sin(f / 5 + i)) * 2; R(g, x, 90, 3, 10, "#f8f4e8"); R(g, x + 1, 90 - h, 1, h, "#ffd25a"); } R(g, 74, 100, 22, 3, "#b88a3a"); GL(g, 85, 88, 40, "255,200,110", 0.4);
      // ritratto del Conestabile con gli occhi che seguono
      R(g, 180, 20, 50, 64, "#6a4a1a"); R(g, 184, 24, 42, 56, "#2a2228"); R(g, 196, 36, 18, 22, "#c8a080"); R(g, 194, 30, 22, 8, "#1a1a22"); R(g, 190, 58, 30, 22, "#1a1a22"); const ex = Math.round(Math.sin(f / 40)); R(g, 200 + ex, 44, 2, 2, "#16141f"); R(g, 207 + ex, 44, 2, 2, "#16141f"); R(g, 200, 52, 10, 1, "#6a3a2a");
      // la porta della scala della torre con l'impronta del sigillo, il vento che fischia da sotto
      R(g, 256, 54, 50, 116, "#3a3036"); R(g, 262, 60, 38, 110, "#16141f"); R(g, 264, 62, 34, 108, "#4a3020"); for (let y = 70; y < 168; y += 20) R(g, 264, y, 34, 3, "#2a1a10"); D(g, 281, 108, 8, "#2a1a10"); D(g, 281, 108, 6, "#8a6a2a"); R(g, 279, 105, 4, 5, "#2a1a10");
      for (let i = 0; i < 5; i++) { const t = (f * 1.2 + i * 18) % 70; R(g, 266 + t * 0.5, 166 - (i % 3) * 3, 6, 1, `rgba(190,200,230,${0.45 - t / 160})`); }
      const fl = (f % 220) < 4; if (fl) R(g, 0, 0, W, 200, "rgba(220,230,255,.1)");
      VIG(g, W, H, 0.55);
    },
    // capitolo 3: il chiostro all'alba, l'archivio, la cappella con la porta della cripta
    lt_chiostro(g, W, H, f) {
      bands(g, W, 0, 110, ["#2a3a6a", "#4a5a8a", "#7a7aa0", "#b08aa0", "#e0a090", "#f4c090", "#fbe0a8"]);
      D(g, 250, 104, 20, "#ffe0a0"); D(g, 250, 104, 15, "#fff0c8"); GL(g, 250, 100, 90, "255,200,130", 0.25);
      cloud(g, ((f * 0.05 + 40) % 380) - 30, 36, 0.9, "#f8c8b0", "#fff0d8", "#b88090");
      // campanile del convento e tetti
      R(g, 40, 30, 26, 90, "#a89888"); R(g, 40, 30, 3, 90, "#c8b8a8"); R(g, 46, 40, 14, 18, "#3a2a2a"); const sw = Math.sin(f / 30) * 0.15; g.save(); g.translate(53, 42); g.rotate(sw); R(g, -5, 0, 10, 10, "#b88a3a"); R(g, -6, 9, 12, 2, "#8a6a2a"); g.restore();
      for (let i = 0; i < 26; i += 4) R(g, 40 + i, 26, 2, 4, "#a89888"); R(g, 0, 96, W, 30, "#8a5a44"); for (let x = 0; x < W; x += 6) R(g, x, 96 + (x % 12 ? 0 : 2), 5, 3, "#a86a4a");
      // porticato con archi e colonne bianche
      R(g, 0, 118, W, 82, "#d8ccb8"); for (let i = 0; i < 9; i++) { const x = i * 38 - 6; R(g, x + 6, 130, 26, 52, "#4a3a30"); D(g, x + 19, 132, 13, "#4a3a30"); R(g, x + 3, 126, 6, 60, "#f0e8d8"); R(g, x + 3, 126, 2, 60, "#ffffff"); R(g, x + 1, 124, 10, 4, "#c8bca8"); }
      R(g, 0, 180, W, 20, "#b8aa90"); for (let x = 0; x < W; x += 10) R(g, x, 184 + (x % 20 ? 0 : 4), 8, 3, "#a89a80");
      // pozzo al centro con il secchio
      R(g, 140, 160, 40, 18, "#8a8070"); R(g, 140, 160, 40, 3, "#a89c88"); R(g, 142, 140, 3, 22, "#5a3a20"); R(g, 175, 140, 3, 22, "#5a3a20"); R(g, 142, 138, 36, 3, "#5a3a20"); const b = Math.round(Math.sin(f / 16) * 2); R(g, 159, 141, 1, 10 + b, "#c8c0b0"); R(g, 156, 151 + b, 7, 6, "#7a5a3a");
      // rondini dell'alba e foglie
      for (let i = 0; i < 4; i++) { const x = ((f * (0.6 + i * 0.15) + i * 90) % 360) - 20, y = 50 + i * 8 + Math.sin(f / 12 + i) * 5, w = Math.sin(f / 4 + i) > 0 ? -2 : 1; R(g, x, y, 3, 1, "#16141f"); R(g, x - 3, y + w, 3, 1, "#16141f"); R(g, x + 3, y + w, 3, 1, "#16141f"); }
      VIG(g, W, H, 0.35);
    },
    lt_archivio(g, W, H, f) {
      R(g, 0, 0, W, 200, "#2a2018"); R(g, 0, 140, W, 60, "#5a4030"); for (let y = 146; y < 200; y += 9) R(g, 0, y, W, 1, "#3a2a1e");
      // scaffali pieni di registri dal pavimento al soffitto
      for (let sx = 0; sx < W; sx += 80) { if (sx === 120) continue; R(g, sx + 4, 10, 72, 132, "#3a2614"); for (let r = 0; r < 5; r++) { R(g, sx + 4, 36 + r * 26, 72, 3, "#5a3a20"); for (let i = 0; i < 12; i++) { const h = 16 + ((sx + r * 7 + i * 3) % 6), c = ["#7a2a2a", "#2a4a6a", "#4a5a2a", "#6a4a2a", "#3a2a4a"][(sx + r + i) % 5]; R(g, sx + 7 + i * 5.6, 36 + r * 26 - h, 5, h, c); R(g, sx + 8 + i * 5.6, 36 + r * 26 - h + 3, 3, 1, "#e0b040"); } } }
      // finestra con la luce dell'alba e la polvere che danza
      R(g, 128, 14, 64, 70, "#16141f"); R(g, 130, 16, 60, 66, "#f4c090"); R(g, 130, 16, 60, 24, "#b08aa0"); R(g, 159, 16, 2, 66, "#16141f"); R(g, 130, 48, 60, 2, "#16141f");
      g.save(); g.globalAlpha = 0.16; g.fillStyle = "#fff0c8"; g.beginPath(); g.moveTo(130, 82); g.lineTo(190, 82); g.lineTo(230, 170); g.lineTo(110, 170); g.fill(); g.restore();
      for (let i = 0; i < 14; i++) { const t = (f * 0.3 + i * 23) % 90; R(g, 130 + ((i * 37) % 80) + Math.sin(f / 30 + i) * 6, 90 + t, 1, 1, "rgba(255,240,200,.8)"); }
      // leggio col Libro del 1527 e la candela
      R(g, 150, 130, 4, 44, "#3a2614"); R(g, 132, 122, 42, 10, "#5a3a20"); R(g, 134, 114, 38, 10, "#f0e4c8"); R(g, 152, 114, 2, 10, "#c8b898"); for (let l = 0; l < 3; l++) { R(g, 137, 116 + l * 2.5, 13, 1, "#6a5a4a"); R(g, 156, 116 + l * 2.5, 13, 1, "#6a5a4a"); }
      R(g, 180, 112, 4, 12, "#f8f4e8"); const h = 3 + Math.abs(Math.sin(f / 5)) * 2; R(g, 181, 112 - h, 2, h, "#ffd25a"); GL(g, 182, 110, 34, "255,200,110", 0.4);
      VIG(g, W, H, 0.55);
    },
    lt_cappella(g, W, H, f) {
      R(g, 0, 0, W, 200, "#1e1a2a"); for (let y = 0; y < 140; y += 12) for (let x = (y / 12) % 2 ? -12 : 0; x < W; x += 24) { R(g, x + 1, y + 1, 22, 10, "#262236"); R(g, x + 1, y + 1, 22, 1, "#332e48"); }
      R(g, 0, 140, W, 60, "#2e2a3c"); for (let y = 140; y < 200; y += 15) for (let x = (y / 15) % 2 ? 0 : 15; x < W; x += 30) R(g, x, y, 15, 15, "#3a3450");
      // vetrata alta: cavaliere che porta un ragazzo
      R(g, 128, 6, 64, 100, "#16141f"); D(g, 160, 30, 32, "#16141f"); const cols = ["#3b82f6", "#a855f7", "#f59e0b", "#22c55e", "#ef4444", "#0ea5e9"]; for (let y = 0; y < 8; y++) for (let x = 0; x < 6; x++) R(g, 132 + x * 9.5, 14 + y * 11.5, 8.5, 10.5, cols[(x * 2 + y) % 6]);
      R(g, 150, 40, 14, 40, "#c8d0de"); R(g, 152, 30, 10, 10, "#c8d0de"); R(g, 156, 52, 18, 8, "#e8c0a0"); R(g, 170, 48, 6, 6, "#7a4a22"); D(g, 157, 60, 3, "#c88a2a"); GL(g, 160, 60, 80, "180,160,255", 0.2 + 0.05 * Math.sin(f / 20));
      // altare e candele
      R(g, 120, 140, 80, 30, "#e8e0d0"); R(g, 120, 140, 80, 4, "#ffffff"); for (let i = 0; i < 5; i++) { const x = 126 + i * 16, h = 3 + Math.abs(Math.sin(f / 5 + i)) * 2; R(g, x, 124, 3, 16, "#f8f4e8"); R(g, x + 1, 124 - h, 1, h, "#ffd25a"); GL(g, x + 1, 122, 16, "255,200,110", 0.3); }
      // la porta della cripta con sette catenacci e il freddo che esce
      R(g, 250, 70, 50, 100, "#3a3448"); R(g, 256, 76, 38, 94, "#16141f"); R(g, 258, 78, 34, 92, "#4a3a2a"); for (let i = 0; i < 7; i++) { R(g, 254, 84 + i * 12, 42, 3, "#5a5a6a"); R(g, 254, 84 + i * 12, 42, 1, "#8a8aa0"); R(g, 272, 82 + i * 12, 6, 7, "#8a6a2a"); }
      for (let i = 0; i < 6; i++) { const t = (f * 0.4 + i * 15) % 60; R(g, 260 + i * 6 + Math.sin(f / 10 + i) * 3, 168 - t * 0.4, 3, 1, `rgba(180,200,255,${0.4 - t / 160})`); }
      VIG(g, W, H, 0.55);
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
    lt_rocca: [[186, 10, 50, 140, "🏰 La torre del Conestabile. In cima una finestra accesa: nessuno ci abita da cinquecento anni."], [0, 150, 320, 50, "🌧️ Il cortile allagato. Ogni lampo ci disegna dentro un'altra torre, capovolta."], [270, 104, 40, 46, "🕯️ Una finestra accesa: Ottavia ha piazzato lì il suo quartier generale, con un thermos."]],
    lt_salone: [[150, 90, 30, 64, "⚫ L'armatura nera del Conestabile. Sul petto, il sigillo col leone. Gli occhi rossi sono vetro. Forse."], [126, 16, 70, 50, "⚔️ Due spade incrociate. Una è vera, l'altra è di legno dipinto: le hanno vendute nel 1890."], [140, 70, 40, 56, "⛈️ Il finestrone. Il temporale è proprio sopra la torre, come se ci abitasse."]],
    lt_studiolo: [[180, 20, 50, 64, "🖼️ Il ritratto del Conestabile. Gli occhi ti seguono. Ottavia dice che è la prospettiva. Ottavia non lo guarda."], [256, 54, 50, 116, "🚪 La porta della scala della torre. Un'impronta a forma di leone, e un vento che fischia da sotto."], [30, 100, 120, 30, "📜 Lo scrittoio: una mappa del Borgo del 1527, con una croce rossa sulla piazza del Palio."]],
    lt_chiostro: [[136, 136, 48, 44, "🪣 Il pozzo del chiostro. Dal fondo sale un rintocco: il pozzo comunica con la cripta delle campane."], [38, 24, 32, 100, "🔔 Il campanile del convento. La sua campana tace: quelle che suonano sono sotto terra."], [0, 118, 120, 70, "🏛️ Il porticato. Ogni capitello è diverso: uno ha un pallone scolpito, consumato dalle mani di chi passa."]],
    lt_archivio: [[130, 104, 46, 30, "📖 Il Libro del 1527, sul leggio. Una cinghia di cuoio lo tiene chiuso."], [128, 14, 64, 70, "🪟 La finestra sul chiostro. La luce dell'alba fa danzare la polvere dei secoli."], [0, 10, 120, 130, "📚 Registri dal Quattrocento in poi. Sui dorsi, gli anni scritti a mano."]],
    lt_cappella: [[128, 6, 64, 100, "🪟 La vetrata: un cavaliere che porta un ragazzo in braccio. Sotto, «QUI MANSIT»: rimase qui."], [250, 70, 50, 100, "🚪 La porta della cripta. Sette catenacci, e da sotto esce aria fredda."], [120, 120, 80, 50, "🕯️ L'altare. Sulla tovaglia, ricamato piccolo e antichissimo, un pallone."]],
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
