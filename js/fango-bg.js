// js/fango-bg.js - sfondi di «DAL FANGO ALLA LEGGENDA» (320x200, animati, con i punti da toccare).
// fd_titolo · fd_campo (Comunale «Gino Melma» di Sterpaglia) · fd_bar (Bar Sport) · fd_valdolio (provincia) · fd_portoferro (città dell'acciaio)
// fd_stadio (Serie A di notte) · fd_ospedale (notte, pioggia) · fd_addio (l'ultima partita all'alba)
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  const P = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, stops) => { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 210); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const TXT = (g, t, x, y, font, fill, stroke, lw) => { g.font = font; g.textAlign = "center"; if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw || 3; g.strokeText(t, x, y); } g.fillStyle = fill; g.fillText(t, x, y); g.textAlign = "left"; };
  const rain = (g, W, H, f, n, a, sl) => { g.strokeStyle = `rgba(200,215,235,${a})`; g.lineWidth = 0.8; g.beginPath(); for (let i = 0; i < n; i++) { const x = (rnd(i) * (W + 60) + f * 1.3 * (sl || 0.4)) % (W + 60) - 30, y = (rnd(i + 99) * H + f * (4 + rnd(i + 7) * 3)) % H; g.moveTo(x, y); g.lineTo(x - 2 * (sl || 0.4) * 3, y + 7); } g.stroke(); };
  const clouds = (g, W, f, y, n, col, sp) => { for (let i = 0; i < n; i++) { const x = ((rnd(i + 3) * W * 1.4 + f * (sp || 0.08) * (1 + rnd(i))) % (W + 120)) - 60, yy = y + rnd(i + 11) * 26, s = 10 + rnd(i + 5) * 12; g.fillStyle = col; g.beginPath(); g.arc(x, yy, s, 0, 7); g.arc(x + s, yy + 3, s * 0.8, 0, 7); g.arc(x - s, yy + 4, s * 0.7, 0, 7); g.arc(x + s * 0.3, yy - s * 0.5, s * 0.7, 0, 7); g.fill(); } };
  // un calciatore di profilo (piccolo, pixel): x,y = piedi
  const man = (g, x, y, s, shirt, shorts, hair, f, i, run) => {
    g.save(); g.translate(x, y); g.scale(s, s); const k = run ? Math.sin(f / 4 + i) : 0;
    E(g, 0, 0.5, 6, 1.6, "rgba(0,0,0,.25)");
    g.fillStyle = "#1f2937"; g.save(); g.translate(-2, -9); g.rotate(k * 0.5); g.fillRect(-1.5, 0, 3, 9); g.restore(); g.save(); g.translate(2, -9); g.rotate(-k * 0.5); g.fillRect(-1.5, 0, 3, 9); g.restore();
    R(g, -4, -12, 8, 4, shorts); R(g, -4.5, -22, 9, 11, shirt); R(g, -6, -21, 2, 7, shirt); R(g, 4, -21, 2, 7, shirt);
    C(g, 0, -26, 4, "#e9bf96"); R(g, -4, -30.5, 8, 3, hair); g.restore();
  };
  const fence = (g, x0, x1, y, col) => { g.fillStyle = col; for (let x = x0; x < x1; x += 7) g.fillRect(x, y - 9, 1.5, 10); g.fillRect(x0, y - 7, x1 - x0, 1); g.fillRect(x0, y - 3, x1 - x0, 1); };
  const puddle = (g, x, y, rx, ry, sky, f, i) => { E(g, x, y, rx, ry, "rgba(50,40,30,.55)"); E(g, x, y - 0.5, rx - 1.5, ry - 1, sky); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 0.6; const r = (f / 3 + i * 7) % 12; g.beginPath(); g.ellipse(x + (i % 3) - 1, y, r * 0.8, r * 0.25, 0, 0, 7); g.stroke(); };
  const crowdRow = (g, x0, x1, y, h, cols, f, seed, jump) => { for (let x = x0; x < x1; x += 4) { const c = cols[Math.floor(rnd(x + seed) * cols.length)], j = jump ? Math.max(0, Math.sin(f / 5 + x * 0.3)) * jump : 0; R(g, x, y - j, 3, h, c); C(g, x + 1.5, y - 1.5 - j, 1.5, "#e9bf96"); } };
  const tower = (g, x, y, h, on, f) => { R(g, x - 1, y, 2, h, "#3f4654"); for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) R(g, x - 8 + c * 4, y - 6 + r * 4, 3, 3, on ? "#fffbe0" : "#6b7280"); if (on) GL(g, x, y - 3, 46, "255,250,210", 0.33 + Math.sin(f / 30) * 0.03); };

  const SC = {
    // TITOLO: un campo di fango al tramonto, lontano le luci di uno stadio vero
    fd_titolo(g, W, H, f) {
      VG(g, 0, 130, ["#2a1846", "#7c2d5e", "#f97316", "#fcd34d"]); g.fillRect(0, 0, W, 130);
      C(g, 96, 112, 22, "#fde68a"); GL(g, 96, 112, 90, "255,200,120", 0.45);
      clouds(g, W, f, 18, 5, "rgba(60,30,70,.55)", 0.05);
      // colline e città lontana con lo stadio illuminato
      P(g, [0, 118, 60, 104, 130, 112, 200, 98, 260, 108, 320, 100, 320, 130, 0, 130], "#3b2a4a");
      R(g, 220, 92, 70, 20, "#2a1d3a"); P(g, [214, 96, 296, 96, 288, 84, 222, 84], "#34254a"); [226, 284].forEach((x) => tower(g, x, 64, 28, true, f));
      for (let i = 0; i < 14; i++) R(g, 222 + i * 5, 88, 2, 1, rnd(i + f / 40 | 0) > 0.5 ? "#fef3c7" : "#fbbf24");
      // il campo di fango
      VG(g, 128, 200, ["#5b4632", "#46351f", "#2c2014"]); g.fillRect(0, 128, W, 72);
      for (let i = 0; i < 60; i++) R(g, rnd(i) * W, 132 + rnd(i + 30) * 66, 2 + rnd(i + 2) * 4, 1, "rgba(30,20,10,.5)");
      for (let i = 0; i < 24; i++) R(g, rnd(i + 70) * W, 130 + rnd(i + 40) * 30, 1, 3, "#5f7a3a");
      puddle(g, 70, 170, 26, 6, "#e98b4a", f, 1); puddle(g, 210, 182, 34, 7, "#c76a55", f, 2); puddle(g, 268, 150, 16, 4, "#f2a65a", f, 3);
      // la porta storta con la rete sfilacciata
      g.strokeStyle = "#e7e5e4"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(22, 160); g.lineTo(22, 122); g.lineTo(62, 120); g.lineTo(62, 158); g.stroke();
      g.strokeStyle = "rgba(231,229,228,.35)"; g.lineWidth = 0.6; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(22 + i * 5, 121 - i * 0.25); g.lineTo(28 + i * 5, 150 + Math.sin(f / 20 + i) * 2); g.stroke(); }
      // il ragazzo con gli scarpini in mano, verso lo stadio
      const wx = 150 + Math.sin(f / 90) * 3; man(g, wx, 168, 1.7, "#7f1d1d", "#111827", "#2b1d14", f, 0, false);
      R(g, wx + 9, 136, 2, 6, "#111"); R(g, wx + 7, 141, 6, 3, "#111"); R(g, wx + 6, 140, 2, 1, "#facc15");
      rain(g, W, H, f, 40, 0.18, 0.3);
      TXT(g, "DAL FANGO", W / 2, 34, "900 26px 'Dela Gothic One', Impact, sans-serif", "#fff7ed", "#431407", 4);
      TXT(g, "ALLA LEGGENDA", W / 2, 60, "900 22px 'Dela Gothic One', Impact, sans-serif", "#fde047", "#431407", 4);
      TXT(g, "una carriera, dalla Terza Categoria al mito", W / 2, 74, "italic 700 9px Georgia, serif", "#fed7aa", "rgba(0,0,0,.6)", 2);
      VIG(g, W, H, 0.35);
    },
    // IL COMUNALE «GINO MELMA» DI STERPAGLIA: in pendenza, container per spogliatoio, mucche oltre la rete
    fd_campo(g, W, H, f) {
      VG(g, 0, 90, ["#7d8796", "#a7b0bb", "#c9ced3"]); g.fillRect(0, 0, W, 90);
      clouds(g, W, f, 8, 6, "rgba(120,128,140,.7)", 0.06);
      P(g, [0, 84, 50, 70, 110, 78, 170, 64, 240, 76, 320, 66, 320, 92, 0, 92], "#6b7d55"); P(g, [0, 90, 80, 80, 160, 86, 250, 78, 320, 84, 320, 96, 0, 96], "#58703f");
      // capannone e campanile del paese
      R(g, 250, 60, 8, 22, "#a8a29e"); P(g, [248, 60, 260, 60, 254, 50], "#7c2d12"); R(g, 252, 64, 4, 4, "#44403c");
      R(g, 186, 68, 34, 16, "#9ca3af"); P(g, [184, 68, 222, 68, 203, 60], "#6b7280");
      // mucche oltre la rete
      [[40, 92, 0], [72, 90, 1], [290, 92, 2]].forEach(([x, y, i]) => { const b = Math.sin(f / 40 + i) * 0.6; E(g, x, y, 7, 4, "#f5f5f4"); C(g, x - 3, y - 1, 2, "#1c1917"); C(g, x + 3, y + 1, 1.6, "#1c1917"); R(g, x - 5, y + 3, 1.5, 4, "#e7e5e4"); R(g, x + 4, y + 3, 1.5, 4, "#e7e5e4"); E(g, x + 8, y - 2 + b, 3, 2.4, "#f5f5f4"); R(g, x + 9, y - 5 + b, 1, 2, "#d6d3d1"); });
      fence(g, 0, W, 100, "#57534e");
      // il campo: erba spelacchiata e fango, linee storte, pendenza visibile
      P(g, [0, 102, 320, 96, 320, 200, 0, 200], "#6b8f3a");
      for (let i = 0; i < 9; i++) P(g, [0, 102 + i * 11, 320, 96 + i * 12, 320, 100 + i * 12, 0, 106 + i * 11], i % 2 ? "#628534" : "#71973f");
      [[160, 150, 70, 28], [60, 175, 50, 16], [260, 128, 40, 12], [120, 120, 30, 8]].forEach(([x, y, rx, ry], i) => { E(g, x, y, rx, ry, "#5a4430"); E(g, x + 4, y + 2, rx * 0.7, ry * 0.6, "#4a3825"); });
      puddle(g, 160, 152, 18, 5, "#a7b0bb", f, 1); puddle(g, 270, 130, 10, 3, "#b6bec8", f, 2);
      g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(160, 98); g.quadraticCurveTo(156, 150, 166, 200); g.stroke(); g.beginPath(); g.ellipse(161, 150, 26, 10, -0.02, 0, 7); g.stroke();
      // porta (più bassa a sinistra, come da leggenda)
      g.strokeStyle = "#f5f5f4"; g.lineWidth = 2; g.beginPath(); g.moveTo(8, 138); g.lineTo(8, 116); g.lineTo(34, 114); g.lineTo(34, 132); g.stroke();
      // container-spogliatoio con insegna
      R(g, 222, 104, 74, 30, "#1f6f8b"); for (let x = 224; x < 296; x += 5) R(g, x, 105, 1, 28, "#17566c"); R(g, 230, 112, 14, 22, "#0f3b4a"); C(g, 241, 123, 1, "#fbbf24");
      R(g, 250, 108, 40, 10, "#f5f5f4"); g.font = "700 5px system-ui"; g.fillStyle = "#7f1d1d"; g.fillText("SPOGLIATOI", 253, 113); g.fillText("(BUSSARE)", 255, 117);
      // tribunetta a tre gradini e tifosi rari
      for (let s = 0; s < 3; s++) R(g, 84 + s * 4, 128 - s * 6, 60 - s * 8, 6, s % 2 ? "#9ca3af" : "#a8a29e");
      crowdRow(g, 92, 136, 116, 4, ["#b91c1c", "#1d4ed8", "#a16207", "#f5f5f4"], f, 3, 0);
      // insegna dello sponsor
      R(g, 6, 92, 58, 12, "#7f1d1d"); g.font = "900 6.5px system-ui"; g.fillStyle = "#fde68a"; g.fillText("CARNI SGHEMBI", 9, 100);
      // corvi
      for (let i = 0; i < 3; i++) { const x = (f * 0.5 + i * 110) % 360 - 20, y = 22 + i * 7 + Math.sin(f / 9 + i) * 3; g.strokeStyle = "#1c1917"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x, y + Math.sin(f / 4 + i) * 2); g.lineTo(x + 4, y); g.stroke(); }
      man(g, 120 + Math.sin(f / 50) * 30, 168, 1.3, "#7f1d1d", "#111827", "#2b1d14", f, 1, true);
      rain(g, W, H, f, 30, 0.2, 0.25); VIG(g, W, H, 0.3);
    },
    // BAR SPORT DI STERPAGLIA: bancone, TV a tubo, la foto della squadra del '79
    fd_bar(g, W, H, f) {
      VG(g, 0, 200, ["#3b2414", "#2a190d"]); g.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 16) R(g, x, 0, 1, 120, "rgba(0,0,0,.25)");
      R(g, 0, 118, W, 82, "#5a3b22"); for (let i = 0; i < 12; i++) R(g, 0, 122 + i * 7, W, 1, "rgba(0,0,0,.25)");
      // mensole di bottiglie con luce calda
      for (let r = 0; r < 2; r++) { R(g, 150, 30 + r * 24, 150, 3, "#2a190d"); for (let i = 0; i < 16; i++) { const c = ["#166534", "#b45309", "#7f1d1d", "#e5e7eb", "#1e3a8a"][Math.floor(rnd(i + r * 20) * 5)]; R(g, 154 + i * 9, 16 + r * 24, 5, 14, c); R(g, 155.5 + i * 9, 12 + r * 24, 2, 4, c); R(g, 155 + i * 9, 19 + r * 24, 1, 6, "rgba(255,255,255,.25)"); } }
      GL(g, 225, 40, 90, "255,190,110", 0.25);
      // TV a tubo con la partita
      R(g, 20, 20, 74, 54, "#1c1917"); R(g, 26, 26, 62, 42, "#14532d"); for (let i = 0; i < 6; i++) R(g, 26, 26 + i * 7, 62, 3.5, i % 2 ? "#166534" : "#15803d");
      C(g, 40 + ((f * 0.6) % 40), 48 + Math.sin(f / 10) * 6, 1.6, "#fff"); man(g, 50 + Math.sin(f / 13) * 10, 58, 0.5, "#dc2626", "#fff", "#111", f, 0, true); man(g, 70 - Math.sin(f / 11) * 8, 54, 0.5, "#1d4ed8", "#fff", "#111", f, 2, true);
      for (let y = 26; y < 68; y += 2) R(g, 26, y, 62, 0.6, "rgba(0,0,0,.18)"); R(g, 52, 74, 10, 6, "#1c1917");
      // foto incorniciata della squadra del '79
      R(g, 104, 30, 36, 26, "#a16207"); R(g, 107, 33, 30, 20, "#d6c7a1"); for (let i = 0; i < 6; i++) { C(g, 111 + i * 4.5, 41, 1.6, "#57534e"); R(g, 110 + i * 4.5, 43, 3, 6, "#78716c"); } g.font = "700 4px Georgia"; g.fillStyle = "#44403c"; g.fillText("POZZ. '79", 112, 52);
      // bancone, spillatrice, macchina del caffè che fuma
      R(g, 140, 104, 180, 20, "#7c4a26"); R(g, 140, 100, 180, 5, "#a16207"); R(g, 260, 82, 30, 20, "#9ca3af"); R(g, 264, 86, 22, 8, "#4b5563");
      for (let i = 0; i < 3; i++) { const t = (f / 2 + i * 13) % 30; g.fillStyle = `rgba(255,255,255,${0.35 - t / 90})`; g.beginPath(); g.arc(270 + Math.sin(t / 5 + i) * 3, 80 - t, 3 + t / 10, 0, 7); g.fill(); }
      R(g, 200, 84, 6, 16, "#d4d4d8"); R(g, 198, 82, 10, 4, "#a1a1aa");
      // tavolino con le carte e due vecchi che giocano a scopa
      R(g, 24, 140, 80, 6, "#7c4a26"); R(g, 30, 146, 4, 30, "#5a3b22"); R(g, 94, 146, 4, 30, "#5a3b22");
      for (let i = 0; i < 4; i++) R(g, 40 + i * 9, 136, 6, 4, "#f5f5f4");
      man(g, 18, 176, 1.4, "#57534e", "#292524", "#d6d3d1", f, 0, false); man(g, 112, 176, 1.4, "#7c2d12", "#292524", "#9ca3af", f, 3, false);
      // ventilatore a soffitto
      g.save(); g.translate(200, 8); g.rotate(f / 8); R(g, -20, -1.5, 40, 3, "#57534e"); R(g, -1.5, -20, 3, 40, "#57534e"); g.restore(); C(g, 200, 8, 3, "#44403c");
      VIG(g, W, H, 0.4);
    },
    // VALDOLIO: comunale di provincia tra gli ulivi, tribuna coperta, tabellone a mano
    fd_valdolio(g, W, H, f) {
      VG(g, 0, 100, ["#60a5fa", "#93c5fd", "#e0f2fe"]); g.fillRect(0, 0, W, 100);
      C(g, 270, 26, 12, "#fff7d6"); GL(g, 270, 26, 60, "255,240,180", 0.35); clouds(g, W, f, 10, 4, "rgba(255,255,255,.8)", 0.05);
      P(g, [0, 80, 70, 58, 140, 70, 210, 52, 280, 66, 320, 58, 320, 100, 0, 100], "#7c9a5a");
      for (let i = 0; i < 22; i++) { const x = rnd(i) * W, y = 66 + rnd(i + 9) * 26; E(g, x, y, 5, 3.5, "#8aa36a"); R(g, x - 0.5, y + 2, 1, 4, "#57534e"); }
      for (let i = 0; i < 6; i++) { const x = 20 + i * 52; P(g, [x, 96, x + 4, 60, x + 8, 96], "#14532d"); }
      // tribuna coperta
      R(g, 40, 82, 160, 34, "#d6d3d1"); P(g, [34, 82, 206, 82, 196, 70, 44, 70], "#7f1d1d"); for (let i = 0; i < 8; i++) R(g, 48 + i * 20, 82, 2, 34, "#a8a29e");
      for (let r = 0; r < 4; r++) crowdRow(g, 44, 196, 90 + r * 6, 4, ["#16a34a", "#f5f5f4", "#16a34a", "#facc15", "#1f2937"], f, 7 + r, r % 2 ? 1.2 : 0.6);
      // tabellone a mano
      R(g, 228, 70, 70, 34, "#1c1917"); R(g, 230, 72, 66, 30, "#14532d"); g.font = "800 6px system-ui"; g.fillStyle = "#fef3c7"; g.fillText("CASA  OSPITI", 236, 82); R(g, 238, 86, 14, 12, "#f5f5f4"); R(g, 270, 86, 14, 12, "#f5f5f4");
      g.font = "900 10px system-ui"; g.fillStyle = "#111"; g.fillText(String(1 + ((f / 300) | 0) % 3), 242, 96); g.fillText("0", 274, 96);
      // campo
      VG(g, 116, 200, ["#4d9a38", "#3f8a2f"]); g.fillRect(0, 116, W, 84); for (let i = 0; i < 6; i++) R(g, i * 56, 116, 28, 84, "rgba(255,255,255,.04)");
      g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1.2; g.strokeRect(10, 124, 300, 70); g.beginPath(); g.moveTo(160, 124); g.lineTo(160, 194); g.stroke(); g.beginPath(); g.ellipse(160, 159, 22, 11, 0, 0, 7); g.stroke();
      man(g, 120 + Math.sin(f / 40) * 40, 172, 1.3, "#16a34a", "#f5f5f4", "#2b1d14", f, 1, true); man(g, 190 - Math.sin(f / 37) * 30, 160, 1.2, "#1d4ed8", "#1d4ed8", "#111", f, 3, true);
      C(g, 150 + Math.sin(f / 23) * 30, 168, 2, "#fff");
      VIG(g, W, H, 0.22);
    },
    // PORTOFERRO: lo stadio di cemento tra le gru e le ciminiere dell'acciaieria
    fd_portoferro(g, W, H, f) {
      VG(g, 0, 120, ["#3f1d0b", "#9a3412", "#f59e0b", "#fcd9a0"]); g.fillRect(0, 0, W, 120);
      C(g, 60, 70, 18, "#fde68a"); GL(g, 60, 70, 80, "255,170,80", 0.4);
      // ciminiere col fumo
      [[200, 30], [228, 40], [256, 24]].forEach(([x, y], i) => { R(g, x, y, 10, 90, "#44403c"); R(g, x, y + 8, 10, 4, "#dc2626"); R(g, x, y + 20, 10, 4, "#f5f5f4"); for (let k = 0; k < 6; k++) { const t = (f / 2 + k * 18 + i * 9) % 100; g.fillStyle = `rgba(120,110,100,${0.45 - t / 240})`; g.beginPath(); g.arc(x + 5 + t * 0.6, y - t * 0.5, 4 + t / 8, 0, 7); g.fill(); } });
      // gru del porto
      [[20, 50], [290, 44]].forEach(([x, y], i) => { g.strokeStyle = "#1f2937"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 120); g.lineTo(x, y); g.lineTo(x + (i ? -40 : 46), y); g.stroke(); g.lineWidth = 0.7; g.beginPath(); g.moveTo(x + (i ? -30 : 34), y); g.lineTo(x + (i ? -30 : 34), y + 26 + Math.sin(f / 30 + i) * 4); g.stroke(); R(g, x + (i ? -34 : 30), y + 26 + Math.sin(f / 30 + i) * 4, 8, 5, "#b45309"); });
      // stadio di cemento
      P(g, [70, 120, 90, 78, 250, 78, 270, 120], "#78716c"); for (let r = 0; r < 6; r++) R(g, 84 + r * 2, 84 + r * 6, 172 - r * 4, 2, "#57534e");
      for (let r = 0; r < 5; r++) crowdRow(g, 92 + r * 2, 248 - r * 2, 90 + r * 6, 4, ["#1f2937", "#f59e0b", "#1f2937", "#f5f5f4"], f, 17 + r, 1.4);
      R(g, 120, 72, 100, 8, "#1f2937"); g.font = "900 6px system-ui"; g.fillStyle = "#f59e0b"; g.fillText("CALCIO PORTOFERRO 1921", 126, 78);
      [96, 244].forEach((x) => tower(g, x, 52, 30, false, f));
      // campo
      VG(g, 120, 200, ["#3d7a2e", "#2f6524"]); g.fillRect(0, 120, W, 80); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.strokeRect(12, 128, 296, 66); g.beginPath(); g.moveTo(160, 128); g.lineTo(160, 194); g.stroke();
      man(g, 140 + Math.sin(f / 30) * 30, 176, 1.3, "#1f2937", "#f59e0b", "#2b1d14", f, 2, true);
      // scintille dall'acciaieria
      for (let i = 0; i < 10; i++) { const t = (f + i * 13) % 60; R(g, 214 + rnd(i) * 40 + t * 0.3, 112 - t * 0.6, 1, 1, `rgba(255,${180 + i * 6},80,${1 - t / 60})`); }
      VIG(g, W, H, 0.3);
    },
    // SERIE A DI NOTTE: anelli pieni, flash, coreografia
    fd_stadio(g, W, H, f) {
      VG(g, 0, 70, ["#020617", "#0b1a3a", "#1e3a8a"]); g.fillRect(0, 0, W, 70);
      for (let i = 0; i < 20; i++) R(g, rnd(i) * W, rnd(i + 4) * 30, 1, 1, "rgba(255,255,255,.6)");
      // tre anelli
      [["#1f2937", 24], ["#111827", 46], ["#0f172a", 68]].forEach(([c, y], r) => { P(g, [0, y + 26, 20, y, 300, y, 320, y + 26], c); for (let k = 0; k < 4; k++) crowdRow(g, 6 + r * 3, 314 - r * 3, y + 6 + k * 5, 4, ["#1d4ed8", "#f5f5f4", "#1d4ed8", "#facc15", "#e11d48"], f, 30 + r * 7 + k, 1.6); });
      // flash di macchine fotografiche
      for (let i = 0; i < 8; i++) if (rnd(i + ((f / 6) | 0)) > 0.7) { const x = rnd(i * 3 + ((f / 6) | 0)) * W, y = 30 + rnd(i * 5) * 60; GL(g, x, y, 6, "255,255,255", 0.9); }
      // coreografia: striscione
      R(g, 70, 26, 180, 12, "#facc15"); g.font = "900 8px 'Dela Gothic One', Impact, sans-serif"; g.fillStyle = "#1e3a8a"; g.textAlign = "center"; g.fillText("CHI VIENE DAL FANGO NON HA PAURA DELLA PIOGGIA", 160, 35); g.textAlign = "left";
      [14, 306].forEach((x) => tower(g, x, 8, 20, true, f));
      // campo a strisce
      for (let i = 0; i < 10; i++) R(g, 0, 96 + i * 10.5, W, 10.5, i % 2 ? "#2f8a3a" : "#37a043");
      g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 1.2; g.strokeRect(10, 100, 300, 96); g.beginPath(); g.moveTo(160, 100); g.lineTo(160, 196); g.stroke(); g.beginPath(); g.ellipse(160, 148, 26, 14, 0, 0, 7); g.stroke();
      GL(g, 160, 150, 160, "255,255,230", 0.12);
      man(g, 150 + Math.sin(f / 30) * 50, 170, 1.4, "#1d4ed8", "#f5f5f4", "#2b1d14", f, 0, true); man(g, 200 - Math.sin(f / 26) * 40, 150, 1.2, "#e11d48", "#111827", "#111", f, 2, true);
      C(g, 170 + Math.sin(f / 18) * 46, 166, 2, "#fff");
      VIG(g, W, H, 0.28);
    },
    // OSPEDALE DI NOTTE: la finestra con la pioggia, il monitor, gli scarpini sulla sedia
    fd_ospedale(g, W, H, f) {
      VG(g, 0, 200, ["#0f1e2e", "#16283b"]); g.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 20) R(g, x, 0, 1, 130, "rgba(255,255,255,.03)");
      R(g, 0, 130, W, 70, "#1e2f40"); for (let x = 0; x < W; x += 24) R(g, x, 130, 1, 70, "rgba(0,0,0,.25)");
      // finestra con la città sotto la pioggia
      R(g, 180, 18, 110, 80, "#0b1622"); R(g, 184, 22, 102, 72, "#13283d");
      for (let i = 0; i < 26; i++) R(g, 186 + rnd(i) * 96, 60 + rnd(i + 3) * 30, 2, 2, rnd(i + ((f / 60) | 0)) > 0.3 ? "#fbbf24" : "#1e3a5f");
      for (let i = 0; i < 6; i++) R(g, 188 + i * 16, 70 - rnd(i) * 20, 12, 40, "#0e1d2d");
      g.save(); g.beginPath(); g.rect(184, 22, 102, 72); g.clip(); rain(g, W, H, f, 30, 0.35, 0.2); for (let i = 0; i < 8; i++) { const y = (f * 0.4 + rnd(i) * 72) % 72; R(g, 186 + rnd(i + 2) * 98, 22 + y, 1, 4, "rgba(180,200,230,.5)"); } g.restore();
      R(g, 233, 22, 3, 72, "#0b1622"); R(g, 184, 56, 102, 3, "#0b1622");
      // letto
      R(g, 30, 120, 130, 26, "#e2e8f0"); R(g, 30, 116, 34, 10, "#f8fafc"); R(g, 64, 112, 96, 14, "#94a3b8"); R(g, 26, 100, 6, 56, "#64748b"); R(g, 160, 112, 4, 44, "#64748b");
      // monitor con il battito
      R(g, 100, 54, 52, 36, "#0b1220"); R(g, 104, 58, 44, 26, "#052e16"); g.strokeStyle = "#4ade80"; g.lineWidth = 1; g.beginPath(); for (let x = 0; x < 44; x++) { const p = (x + f * 0.7) % 44, y = p > 20 && p < 24 ? (p < 22 ? -9 : 6) : 0; g.lineTo(104 + x, 72 + y); } g.stroke(); R(g, 124, 90, 4, 22, "#475569");
      // sedia con gli scarpini vecchi e i fiori
      R(g, 200, 130, 40, 4, "#78350f"); R(g, 202, 134, 3, 24, "#78350f"); R(g, 235, 134, 3, 24, "#78350f"); R(g, 236, 104, 3, 28, "#78350f");
      R(g, 208, 124, 12, 6, "#1c1917"); R(g, 222, 124, 12, 6, "#1c1917"); R(g, 210, 125, 3, 1, "#a16207"); R(g, 224, 125, 3, 1, "#a16207");
      R(g, 60, 92, 10, 18, "#93c5fd"); [[62, 88, "#f43f5e"], [67, 86, "#fbbf24"], [64, 84, "#f472b6"]].forEach(([x, y, c]) => C(g, x, y, 3, c)); R(g, 64, 88, 1, 6, "#166534");
      GL(g, 126, 70, 50, "74,222,128", 0.12);
      VIG(g, W, H, 0.5);
    },
    // L'ADDIO: il Gino Melma all'alba, gente fin sulle colline, lo striscione GRAZIE
    fd_addio(g, W, H, f) {
      VG(g, 0, 110, ["#1e1b4b", "#7c3aed", "#f472b6", "#fde68a"]); g.fillRect(0, 0, W, 110);
      const sy = 104 - Math.min(30, f / 20); C(g, 160, sy, 24, "#fff7d6"); GL(g, 160, sy, 120, "255,210,150", 0.5);
      for (let i = 0; i < 8; i++) { g.strokeStyle = `rgba(255,230,180,${0.12})`; g.lineWidth = 6; g.beginPath(); g.moveTo(160, sy); g.lineTo(160 + Math.cos(i * 0.4 + 3.4) * 220, sy + Math.sin(i * 0.4 + 3.4) * 220); g.stroke(); }
      // colline piene di gente
      P(g, [0, 96, 60, 78, 120, 92, 200, 76, 260, 90, 320, 80, 320, 120, 0, 120], "#4d5f3a");
      for (let i = 0; i < 140; i++) { const x = rnd(i) * W, y = 84 + rnd(i + 50) * 32, j = Math.max(0, Math.sin(f / 6 + i)) * 1.2; R(g, x, y - j, 2, 3, ["#7f1d1d", "#f5f5f4", "#facc15", "#1d4ed8"][i % 4]); }
      fence(g, 0, W, 122, "#3f3a33");
      // lo striscione
      R(g, 70, 100, 180, 14, "#f5f5f4"); g.save(); g.translate(0, Math.sin(f / 20) * 0.6); g.font = "900 9px 'Dela Gothic One', Impact, sans-serif"; g.fillStyle = "#7f1d1d"; g.textAlign = "center"; g.fillText("GRAZIE · DA QUI È PARTITO TUTTO", 160, 110); g.restore(); g.textAlign = "left";
      // campo di fango con un raggio di sole
      P(g, [0, 124, 320, 120, 320, 200, 0, 200], "#6b8f3a"); for (let i = 0; i < 6; i++) P(g, [0, 124 + i * 13, 320, 120 + i * 14, 320, 124 + i * 14, 0, 128 + i * 13], i % 2 ? "#628534" : "#71973f");
      [[160, 168, 60, 20], [60, 150, 30, 8], [260, 186, 40, 10]].forEach(([x, y, rx, ry]) => E(g, x, y, rx, ry, "#5a4430"));
      puddle(g, 160, 170, 20, 5, "#f9a8d4", f, 1);
      g.strokeStyle = "#f5f5f4"; g.lineWidth = 2; g.beginPath(); g.moveTo(8, 160); g.lineTo(8, 136); g.lineTo(36, 134); g.lineTo(36, 156); g.stroke();
      man(g, 160, 178, 1.8, "#7f1d1d", "#111827", "#6b6b6b", f, 0, false); C(g, 172, 176, 3, "#fff");
      // coriandoli
      for (let i = 0; i < 30; i++) { const x = (rnd(i) * W + Math.sin(f / 20 + i) * 8) % W, y = (rnd(i + 9) * 200 + f * (0.4 + rnd(i) * 0.5)) % 200; R(g, x, y, 2, 1.4, ["#facc15", "#f43f5e", "#f5f5f4", "#38bdf8"][i % 4]); }
      VIG(g, W, H, 0.3);
    },
  };
  const HOT = {
    fd_titolo: [[16, 116, 52, 46, "🥅 Una porta storta, la rete sfilacciata. Qui ogni gol vale doppio: uno per il pallone, uno per la rete che lo tiene."], [210, 60, 90, 54, "🏟️ Le luci dello stadio vero, laggiù. Da qui sembrano stelle cadute. Da vicino sono solo lampadine molto care."], [130, 130, 40, 44, "🥾 Gli scarpini in mano, per non sporcarli. Il fango, tanto, arriva lo stesso."]],
    fd_campo: [[222, 104, 74, 30, "🚪 Il container-spogliatoio. La doccia è un tubo. Il tubo, d'inverno, è un'opinione."], [130, 140, 60, 24, "💧 La pozzanghera del cerchio di centrocampo. In paese la chiamano «il Lago». Ha già inghiottito due palloni e una ciabatta."], [6, 90, 58, 14, "🥩 CARNI SGHEMBI, sponsor unico. Ogni gol vale una salsiccia. In stagione buona, si mangia."], [30, 82, 60, 16, "🐄 Le mucche del signor Zeno. Guardano le partite con l'attenzione di chi ha già visto tutto."]],
    fd_bar: [[20, 20, 74, 56, "📺 La TV del bar: prende un canale e mezzo. Il mezzo è quello del calcio."], [104, 30, 36, 26, "🖼️ La Pozzanghera del '79, l'unica promozione della storia. Sei facce, e cinque sono di cugini."], [24, 130, 90, 50, "🃏 Due vecchi giocano a scopa da quarant'anni. Il punteggio complessivo è un segreto di paese."]],
    fd_valdolio: [[40, 70, 160, 46, "🏟️ La tribuna coperta di Valdolio: la tettoia ripara metà del pubblico. L'altra metà ha l'ombrello e un'opinione."], [228, 70, 70, 34, "🔢 Il tabellone a mano: lo gira un ragazzino che, a volte, tifa."], [0, 60, 320, 30, "🫒 Ulivi ovunque. Qui un pallone in tribuna torna sempre con l'odore d'olio."]],
    fd_portoferro: [[196, 20, 72, 100, "🏭 L'acciaieria di Portoferro: tre turni al giorno. Allo stadio si arriva con la tuta e si canta col fiato che resta."], [70, 78, 200, 42, "🧱 Lo stadio di cemento, 1921. Mai una sedia: si sta in piedi, come al lavoro."], [10, 44, 60, 76, "🏗️ Le gru del porto. Quando la squadra segna, i gruisti suonano la sirena."]],
    fd_stadio: [[70, 24, 180, 16, "🎌 Lo striscione della curva. L'hanno scritto per te: è la prima volta che una frase su un lenzuolo ti fa tremare le gambe."], [0, 20, 320, 76, "📸 Settantamila persone e altrettanti telefoni. A Sterpaglia, il giorno del derby, eravate in quaranta e un cane."], [120, 130, 80, 40, "⚽ Il campo è un tavolo da biliardo. Ti viene quasi voglia di sporcarlo."]],
    fd_ospedale: [[180, 18, 110, 80, "🌧️ La città sotto la pioggia, vista da un letto. Le luci si spengono una alla volta, come le partite in TV."], [96, 52, 60, 40, "💚 Il monitor: un battito regolare. Lo guardi come una volta guardavi il cronometro."], [198, 116, 44, 20, "🥾 Un paio di scarpini vecchi sulla sedia. Non sono tuoi. Qualcuno li ha portati e non ha detto niente."]],
    fd_addio: [[70, 98, 180, 18, "🎌 GRAZIE · DA QUI È PARTITO TUTTO. Lo hanno cucito le signore del paese, una lettera a testa."], [0, 76, 320, 46, "👥 Gente fin sulle colline: più di quanta il Gino Melma ne abbia mai vista. Le mucche sono state spostate, per rispetto."], [130, 150, 60, 30, "💧 Il Lago, la pozzanghera di centrocampo. C'è ancora. Ci sarà sempre."]],
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
  window.__fangoBg = { SC, HOT };
})();
