// js/neve-bg.js - sfondi di «IL GUARDIANO DI NEVE» (320x200, pixel art): titolo (la montagna al tramonto e i guanti di Olmo), Valdigelo in piazza, Bar Stambecco, casa di Olmo. Animati, con punti da toccare
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const D = (g, cx, cy, r, c) => { g.fillStyle = c; for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy))); g.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1); } };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const bands = (g, W, y0, y1, cols) => { const n = cols.length, bh = (y1 - y0) / n; for (let i = 0; i < n; i++) { const a = Math.round(y0 + i * bh), b = Math.round(y0 + (i + 1) * bh); R(g, 0, a, W, b - a, cols[i]); if (i < n - 1) { g.fillStyle = cols[i + 1]; for (let y = b - 2; y < b; y++) for (let x = y % 2; x < W; x += 2) g.fillRect(x, y, 1, 1); } } };
  // cime: triangoli irregolari con la neve in cima e il lato in ombra
  const peak = (g, cx, base, w, h, body, lit, snow) => { for (let k = 0; k < w; k++) { const d = Math.abs(k - w / 2) / (w / 2), top = base - h * (1 - d) - Math.round(rnd(cx + k) * 2); R(g, cx - w / 2 + k, top, 1, base - top, k < w / 2 ? lit : body); if (1 - d > 0.6) R(g, cx - w / 2 + k, top, 1, Math.round((1 - d - 0.6) * h * 0.5) + 1, snow); } };
  // abete con la neve sui rami
  const pine = (g, x, y, h, dark, mid, snow) => { R(g, x - 1, y - 4, 3, 5, "#3a2a20"); for (let k = 0; k < h; k++) { const hw = Math.round((k / h) * (h / 3.2)) + 1; R(g, x - hw, y - 4 - h + k, hw * 2 + 1, 1, k % 7 < 2 ? snow : k % 7 < 4 ? mid : dark); } };
  const flakes = (g, W, H, f, n, sp) => { for (let i = 0; i < n; i++) { const x = (rnd(i) * (W + 40) + Math.sin(f / 40 + i) * 10 - f * 0.2 * (sp || 1)) % (W + 40), y = (rnd(i + 70) * H + f * (0.4 + rnd(i + 9) * 0.5) * (sp || 1)) % H; R(g, x < 0 ? x + W + 40 : x, y, i % 4 ? 1 : 2, i % 4 ? 1 : 2, "#ffffff"); } };
  // baita di legno col tetto innevato e finestre accese
  const chalet = (g, x, y, w, h, wall, roof, lit, f) => {
    R(g, x, y, w, h, wall); for (let yy = y + 4; yy < y + h; yy += 5) R(g, x, yy, w, 1, "rgba(0,0,0,.25)");
    for (let k = 0; k < w / 2 + 6; k++) { R(g, x - 6 + k, y - k * 0.55, w + 12 - k * 2, 2, roof); } R(g, x - 7, y - 2, w + 14, 4, "#f4f8fc"); for (let k = 0; k < w / 2 + 6; k += 2) R(g, x - 6 + k, y - k * 0.55 - 2, w + 12 - k * 2, 1, "#ffffff");
    for (let i = 0; i < Math.floor(w / 16); i++) { R(g, x + 5 + i * 16, y + h / 2 - 4, 8, 9, "#2a1a10"); R(g, x + 6 + i * 16, y + h / 2 - 3, 6, 7, lit ? "#ffd27a" : "#3a4a6a"); R(g, x + 8 + i * 16, y + h / 2 - 3, 1, 7, "#2a1a10"); if (lit) GL(g, x + 9 + i * 16, y + h / 2, 14, "255,200,110", 0.25 + 0.05 * Math.sin(f / 9 + i)); }
  };
  window.__neveBgK = { R, D, rnd, GL, VIG, bands, peak, pine, flakes, chalet };
  const SC = {
    gn_titolo(g, W, H, f) {
      bands(g, W, 0, 130, ["#2a2a5a", "#3a3a72", "#5a4a8a", "#8a5a96", "#c06a8a", "#e88a7a", "#f6b07a", "#fbd29a"]);
      D(g, 240, 96, 18, "#ffe0b0"); D(g, 240, 96, 14, "#fff2d8"); GL(g, 240, 96, 70, "255,190,140", 0.3);
      peak(g, 70, 130, 160, 90, "#4a4a7a", "#6a6a9a", "#f4e8f4"); peak(g, 200, 130, 200, 112, "#3a3a6a", "#5a5a8a", "#fff0f6"); peak(g, 300, 130, 130, 70, "#4a4a7a", "#6a6a9a", "#f4e8f4");
      R(g, 0, 128, W, 72, "#e8e4f2"); for (let i = 0; i < 12; i++) pine(g, 10 + i * 28 + (i % 2) * 6, 150 + (i % 3) * 4, 26 + (i % 4) * 6, "#1e2a3a", "#2e3e52", "#f0ecf8");
      chalet(g, 196, 150, 56, 28, "#6a4a34", "#4a2a20", true, f); R(g, 236, 118, 5, 14, "#4a3a3a"); for (let i = 0; i < 5; i++) { const t = (f * 0.4 + i * 14) % 60; D(g, 238 + Math.sin(f / 15 + i) * 3, 114 - t, 2 + Math.round(t / 20), `rgba(230,225,240,${0.45 - t / 150})`); }
      // i guanti di Olmo appoggiati su un palo del cancello, in primo piano
      R(g, 64, 120, 8, 80, "#4a3020"); R(g, 66, 120, 2, 80, "#6a4426"); R(g, 58, 116, 20, 6, "#f4f8fc");
      [[48, 128, -0.25], [72, 126, 0.25]].forEach(([x, y, a], i) => { g.save(); g.translate(x + 8, y + 12); g.rotate(a + Math.sin(f / 50 + i) * 0.02); R(g, -9, -12, 18, 22, "#16141f"); R(g, -8, -11, 16, 20, "#f59e0b"); R(g, -8, -11, 16, 4, "#fde68a"); for (let k = 0; k < 4; k++) R(g, -7 + k * 4, -15, 3, 6, "#f59e0b"); R(g, -7, 4, 14, 5, "#b45309"); R(g, -3, -6, 6, 1, "#b45309"); g.restore(); });
      GL(g, 72, 140, 40, "255,190,90", 0.18 + 0.06 * Math.sin(f / 12));
      flakes(g, W, H, f, 50, 0.8);
      VIG(g, W, H, 0.4);
    },
    gn_paese(g, W, H, f) {
      bands(g, W, 0, 110, ["#5a7aaa", "#6e8eba", "#86a4c8", "#a0bcd8", "#bcd2e6", "#d6e4f0"]);
      peak(g, 60, 110, 150, 70, "#7a8cae", "#9aaccc", "#f4f8fc"); peak(g, 230, 110, 220, 96, "#6a7c9e", "#8a9cbc", "#ffffff");
      // campanile della chiesa e baite intorno alla piazza
      R(g, 34, 40, 24, 90, "#d8d0c4"); R(g, 34, 40, 3, 90, "#f0e8dc"); R(g, 40, 50, 12, 16, "#3a2a2a"); const sw = Math.sin(f / 26) * 0.2; g.save(); g.translate(46, 52); g.rotate(sw); R(g, -5, 0, 10, 9, "#b88a3a"); R(g, -6, 8, 12, 2, "#8a6a2a"); g.restore();
      for (let k = 0; k < 16; k++) R(g, 32 + k * 0.9, 40 - k * 1.4, 28 - k * 1.8, 2, k < 2 ? "#ffffff" : "#5a3a2a"); R(g, 45, 14, 2, 8, "#3a2a1a"); R(g, 42, 16, 8, 2, "#3a2a1a");
      chalet(g, 80, 104, 64, 30, "#7a5034", "#5a2a20", true, f); chalet(g, 210, 100, 70, 34, "#6a4a34", "#3a2a3a", true, f);
      // l'insegna del Bar Stambecco, con lo stambecco e la vetrina vuota
      R(g, 92, 84, 40, 10, "#16a34a"); R(g, 92, 84, 40, 2, "#4ade80"); g.fillStyle = "#f4f4f4"; g.font = "700 7px sans-serif"; g.fillText("BAR STAMBECCO", 94, 92);
      R(g, 0, 132, W, 68, "#eef3f9"); for (let x = 0; x < W; x += 8) R(g, x + (x % 16 ? 2 : 0), 140 + (x % 24) / 3, 5, 1, "rgba(150,175,210,.4)");
      // il braciere acceso al centro della piazza
      R(g, 146, 160, 28, 12, "#3a3a44"); R(g, 146, 160, 28, 2, "#5a5a66"); R(g, 150, 172, 3, 10, "#2a2a32"); R(g, 167, 172, 3, 10, "#2a2a32"); for (let i = 0; i < 6; i++) { const h = 8 + Math.abs(Math.sin(f / 4 + i * 1.7)) * 14; R(g, 149 + i * 4, 160 - h, 4, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 160, 152, 60, "255,150,60", 0.45 + 0.1 * Math.sin(f / 4));
      for (let i = 0; i < 6; i++) { const t = (f * 0.7 + i * 20) % 90; R(g, 158 + Math.sin(t / 10 + i) * 8, 146 - t, 1, 1, `rgba(255,210,130,${1 - t / 90})`); }
      // pupazzo di neve con la sciarpa degli Stambecchi e la slitta di Lilli
      D(g, 262, 172, 12, "#f4f8fc"); D(g, 262, 152, 8, "#ffffff"); R(g, 255, 158, 14, 3, "#16a34a"); R(g, 266, 158, 3, 8, "#16a34a"); R(g, 259, 150, 2, 2, "#16141f"); R(g, 264, 150, 2, 2, "#16141f"); R(g, 261, 153, 5, 2, "#f97316"); R(g, 256, 140, 12, 4, "#16141f"); R(g, 258, 132, 8, 8, "#16141f");
      R(g, 40, 180, 34, 4, "#dc2626"); R(g, 38, 184, 40, 2, "#7a5a3a"); R(g, 44, 176, 2, 4, "#7a5a3a"); R(g, 68, 176, 2, 4, "#7a5a3a");
      flakes(g, W, H, f, 60, 1);
      VIG(g, W, H, 0.35);
    },
    gn_bar(g, W, H, f) {
      R(g, 0, 0, W, 200, "#3a2416"); for (let x = 0; x < W; x += 20) { R(g, x, 0, 19, 130, "#4a2e1a"); R(g, x, 0, 1, 130, "#5a3a22"); }
      R(g, 0, 130, W, 70, "#6a4426"); for (let y = 136; y < 200; y += 9) R(g, 0, y, W, 1, "#4a2e18");
      // foto della squadra del 1979 e gagliardetti
      [[20, 20], [60, 26], [250, 20]].forEach(([x, y], i) => { R(g, x, y, 34, 26, "#c8a050"); R(g, x + 2, y + 2, 30, 22, "#5a5a5a"); for (let k = 0; k < 6; k++) { R(g, x + 4 + k * 5, y + 10 + (k % 2) * 2, 3, 6, "#9a9a9a"); D(g, x + 5 + k * 5, y + 8 + (k % 2) * 2, 2, "#b8b8b8"); } });
      [[106, 14], [208, 14]].forEach(([x, y]) => { g.fillStyle = "#16a34a"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 22, y); g.lineTo(x + 11, y + 26); g.fill(); R(g, x + 6, y + 4, 10, 4, "#f4f4f4"); });
      // la vetrina VUOTA della Coppa, con la targhetta e il vetro rotto
      R(g, 130, 34, 60, 80, "#16141f"); R(g, 133, 37, 54, 74, "rgba(200,230,255,.12)"); R(g, 140, 96, 40, 6, "#3a2a1a"); R(g, 146, 102, 28, 8, "#e8dcc0"); g.fillStyle = "#3a2a1a"; g.font = "700 5px sans-serif"; g.fillText("COPPA DELLE VETTE 1979", 147, 108);
      g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1; g.beginPath(); g.moveTo(170, 40); g.lineTo(160, 60); g.lineTo(176, 70); g.moveTo(160, 60); g.lineTo(150, 58); g.stroke();
      if (Math.floor(f / 30) % 2) { g.fillStyle = "#ef4444"; g.font = "900 22px sans-serif"; g.fillText("?", 154, 84); }
      GL(g, 160, 74, 40, "200,230,255", 0.12);
      // bancone, macchina del caffè che sbuffa, pentola del brulè
      R(g, 10, 120, 110, 20, "#5a361c"); R(g, 10, 118, 110, 4, "#8a5a32"); R(g, 24, 98, 26, 20, "#c8c8d0"); R(g, 28, 104, 18, 6, "#16141f"); for (let i = 0; i < 3; i++) { const t = (f * 0.6 + i * 14) % 40; D(g, 32 + i * 6 + Math.sin(f / 10 + i) * 2, 96 - t, 2 + Math.round(t / 15), `rgba(240,240,250,${0.5 - t / 90})`); }
      R(g, 70, 104, 24, 14, "#3a3a44"); R(g, 72, 102, 20, 3, "#7a1a2a"); for (let i = 0; i < 3; i++) { const t = (f * 0.5 + i * 18) % 50; D(g, 78 + i * 5, 98 - t, 2, `rgba(255,220,220,${0.4 - t / 130})`); }
      // stufa e finestra con la neve
      R(g, 250, 90, 34, 50, "#2a2a32"); R(g, 256, 104, 22, 16, "#16141f"); for (let i = 0; i < 4; i++) { const h = 4 + Math.abs(Math.sin(f / 4 + i)) * 8; R(g, 258 + i * 5, 120 - h, 4, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 267, 112, 50, "255,150,60", 0.35);
      R(g, 210, 50, 30, 36, "#2a1a10"); R(g, 212, 52, 26, 32, "#86a4c8"); R(g, 224, 52, 2, 32, "#2a1a10"); for (let i = 0; i < 8; i++) R(g, 212 + ((i * 7 + f * 0.3) % 26), 52 + ((i * 11 + f * 0.6) % 32), 1, 1, "#ffffff");
      VIG(g, W, H, 0.45);
    },
    gn_casa(g, W, H, f) {
      R(g, 0, 0, W, 200, "#4a3426"); for (let x = 0; x < W; x += 24) { R(g, x, 0, 23, 132, "#5a3e2a"); R(g, x, 0, 1, 132, "#6a4a32"); }
      R(g, 0, 132, W, 68, "#7a5034"); R(g, 60, 150, 200, 40, "#8a2a2a"); for (let i = 0; i < 10; i++) R(g, 66 + i * 20, 166, 8, 8, "#c8a050");
      // stufa a olle (la stube) che scalda tutto
      R(g, 220, 40, 80, 100, "#2f5a3a"); for (let y = 44; y < 136; y += 12) for (let x = 224 + ((y / 12) % 2) * 6; x < 296; x += 12) { R(g, x, y, 10, 10, "#3e7a4e"); R(g, x, y, 10, 2, "#5a9a6a"); } R(g, 244, 108, 30, 20, "#16141f"); for (let i = 0; i < 5; i++) { const h = 4 + Math.abs(Math.sin(f / 4 + i)) * 10; R(g, 247 + i * 5, 128 - h, 4, h, i % 2 ? "#f59e0b" : "#ef4444"); } GL(g, 259, 118, 60, "255,150,60", 0.35);
      // la poltrona di Olmo, la coperta, le stampelle
      R(g, 110, 100, 60, 50, "#6a2a2a"); R(g, 104, 92, 14, 58, "#5a2222"); R(g, 162, 92, 14, 58, "#5a2222"); R(g, 116, 80, 48, 26, "#7a3030"); R(g, 120, 120, 44, 24, "#2f5a8a"); for (let i = 0; i < 4; i++) R(g, 122 + i * 11, 120, 6, 24, "#3e6aa0");
      R(g, 184, 80, 3, 70, "#a8a8b0"); R(g, 182, 80, 7, 3, "#5a5a66"); R(g, 182, 112, 7, 3, "#5a5a66");
      // il ritratto del rigore del '79: un portiere in volo, neve sul campo
      R(g, 30, 20, 70, 54, "#c8a050"); R(g, 34, 24, 62, 46, "#dfe8f2"); R(g, 34, 56, 62, 14, "#e8eef6"); R(g, 40, 30, 50, 22, "#9aa4b4"); R(g, 42, 32, 46, 18, "#f4f8fc"); for (let x = 42; x < 88; x += 4) R(g, x, 32, 1, 18, "#cbd5e1");
      g.save(); g.translate(64, 44); g.rotate(-0.5); R(g, -10, -3, 20, 6, "#2f6b3a"); R(g, 8, -5, 6, 6, "#f59e0b"); R(g, -14, -2, 5, 4, "#3a3a4a"); D(g, 2, -6, 3, "#e0ac7e"); g.restore(); D(g, 82, 36, 3, "#f4f4f4");
      for (let i = 0; i < 10; i++) R(g, 34 + ((i * 13 + f * 0.2) % 62), 24 + ((i * 7 + f * 0.4) % 46), 1, 1, "#ffffff");
      // finestra con la nevicata e la montagna
      R(g, 130, 16, 60, 54, "#2a1a10"); R(g, 133, 19, 54, 48, "#86a4c8"); for (let k = 0; k < 24; k++) R(g, 160 - k, 40 + k * 1.1, k * 2, 1, k < 6 ? "#ffffff" : "#6a7c9e"); R(g, 158, 19, 4, 48, "#2a1a10"); R(g, 133, 41, 54, 3, "#2a1a10");
      for (let i = 0; i < 14; i++) R(g, 133 + ((i * 9 + f * 0.3) % 54), 19 + ((i * 13 + f * 0.7) % 48), 1, 1, "#ffffff");
      // la radiolina sul tavolino (Olmo ti parla da qui durante le salite)
      R(g, 20, 120, 50, 6, "#5a3a20"); R(g, 24, 126, 4, 24, "#4a2e18"); R(g, 62, 126, 4, 24, "#4a2e18"); R(g, 32, 106, 26, 14, "#3a3a44"); R(g, 34, 108, 10, 10, "#16141f"); for (let k = 0; k < 4; k++) R(g, 35, 109 + k * 2, 8, 1, "#5a5a66"); R(g, 48, 110, 6, 6, Math.floor(f / 20) % 2 ? "#22c55e" : "#14532d"); R(g, 52, 94, 1, 12, "#a8a8b0");
      VIG(g, W, H, 0.45);
    }
  };
  const HOT = {
    gn_titolo: [[44, 112, 60, 50, "🧤 I guanti di Olmo, sul palo del cancello. Cuciti e ricuciti. Arancioni una volta, ora color «fiducia»."], [130, 20, 160, 110, "🏔️ La Vetta di Valdigelo. Lassù, dicono in paese, d'inverno abita qualcuno che non scende mai."], [190, 110, 70, 70, "🏠 Il rifugio a metà strada. Il comignolo fuma anche quando nessuno ci dorme."]],
    gn_paese: [[140, 130, 40, 50, "🔥 Il braciere della piazza. Ci si scalda le mani, si scambiano pettegolezzi e si brucia, ogni tanto, una lettera."], [80, 70, 64, 64, "☕ Il Bar Stambecco. In vetrina, da quarantacinque anni, c'era la Coppa delle Vette. Da stanotte non c'è più."], [250, 130, 26, 50, "⛄ Un pupazzo di neve con la sciarpa degli Stambecchi. Lilli dice che stanotte si è mosso. Lilli dice tante cose."]],
    gn_bar: [[130, 34, 60, 80, "🏆 La vetrina vuota. Vetro incrinato, targhetta intatta: «COPPA DELLE VETTE 1979». Sul fondo, un ciuffo di pelo bianchissimo."], [20, 20, 74, 34, "📷 La squadra del '79: undici ragazzi magri e un portiere enorme. Uno, in fondo, ha la faccia grattata via con l'unghia."], [68, 96, 30, 24, "🍷 La pentola del vin brulè. Tecla dice che la ricetta è segreta. La ricetta è cannella."]],
    gn_casa: [[30, 20, 70, 54, "🖼️ Il rigore del '79: Olmo in volo, la palla sul palo. Sotto, scritto a matita da qualcuno: «quasi»."], [110, 80, 66, 70, "🪑 La poltrona di Olmo, con la coperta e la radiolina. Da qui ascolta le partite e la neve."], [130, 16, 60, 54, "🪟 Dalla finestra si vede la Vetta. Olmo non la guarda mai. Tiene la tenda tirata da quella parte."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
