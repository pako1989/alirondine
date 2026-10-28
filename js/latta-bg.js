// js/latta-bg.js - sfondi di «IL PALLONE DI LATTA» (320x200, pixel art): titolo (il castello al tramonto e l'armatura), Piazza del Palio, Museo dell'Armeria, Taverna del Gonfalone. Animati, con punti da toccare
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
    }
  };
  const HOT = {
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
