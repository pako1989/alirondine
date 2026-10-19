// js/figurine-bg.js - sfondi di «CACCIATORI DI FIGURINE» (320x200): titolo (carte che volano), prato, bosco dei fischi, città delle vetrine, arena. Animati, con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const hills = (g, W, y, c, a, p) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 8) g.lineTo(x, y + Math.sin(x / (30 + p) + p) * a); g.lineTo(W, 200); g.fill(); };
  const card = (g, x, y, rot, c1, c2, ic) => { g.save(); g.translate(x, y); g.rotate(rot); R(g, -14, -20, 28, 40, c1); R(g, -11, -17, 22, 34, c2); g.font = "16px serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText(ic, 0, 5); g.restore(); };
  const tree = (g, x, y, s, c) => { R(g, x - 2 * s, y, 4 * s, 12 * s, "#4a3220"); C(g, x, y - 4 * s, 11 * s, c); C(g, x - 7 * s, y + 2 * s, 8 * s, c); C(g, x + 7 * s, y + 2 * s, 8 * s, c); };
  const SC = {
    fg_titolo(g, W, H, f) {
      VG(g, 0, 200, "#2a1458", "#c084fc"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 40; i++) R(g, rnd(i) * W, rnd(i + 9) * 110, 1.5, 1.5, "rgba(255,255,255," + (0.3 + 0.5 * Math.abs(Math.sin(f / 30 + i))) + ")");
      hills(g, W, 140, "#3b1f6a", 10, 1); hills(g, W, 160, "#2a1458", 8, 3);
      [["#7c3aed", "#a78bfa", "🌱"], ["#0ea5e9", "#7dd3fc", "🪁"], ["#1f2937", "#6b7280", "🦇"], ["#db2777", "#f9a8d4", "😊"]].forEach((c, i) => card(g, 70 + i * 62, 100 + Math.sin(f / 22 + i * 1.7) * 9, Math.sin(f / 40 + i) * 0.18 + (i - 1.5) * 0.1, c[0], c[1], c[2]));
      g.font = "900 20px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fff7d6"; g.fillText("CACCIATORI DI FIGURINE", 160, 32); g.font = "900 10px Georgia, serif"; g.fillStyle = "#fbbf24"; g.fillText("L'ALBUM CHE RESPIRA", 160, 48); VIG(g, W, H, 0.3);
    },
    fg_prato(g, W, H, f) {
      VG(g, 0, 100, "#8ecbf5", "#fff0c8"); g.fillRect(0, 0, W, 100); for (let i = 0; i < 3; i++) R(g, ((i * 140 + f * 0.15) % 380) - 50, 16 + i * 16, 60, 7, "rgba(255,255,255,.7)");
      hills(g, W, 84, "#7ab25e", 10, 2); hills(g, W, 112, "#5e9a4a", 12, 4); R(g, 0, 150, W, 50, "#6ea652");
      for (let i = 0; i < 36; i++) { const x = rnd(i) * W, y = 120 + rnd(i + 3) * 76; R(g, x, y, 2, 4, ["#f87171", "#fde047", "#f9a8d4", "#fff"][i % 4]); R(g, x, y + 4, 1, 4, "#3e7a38"); }
      card(g, 220 + Math.sin(f / 25) * 4, 130 + Math.sin(f / 18) * 5, Math.sin(f / 30) * 0.2, "#7c3aed", "#c4b5fd", "🪶"); R(g, 40, 120, 40, 28, "#e2cfa8"); T(g, [34, 120, 60, 98, 86, 120], "#9b2a2a"); R(g, 54, 132, 12, 16, "#5a3a2a"); VIG(g, W, H, 0.25);
    },
    fg_bosco(g, W, H, f) {
      VG(g, 0, 200, "#17352a", "#2f6a4a"); g.fillRect(0, 0, W, 200);
      for (let i = 0; i < 9; i++) { tree(g, 20 + i * 38 + (i % 2) * 8, 80 + (i % 3) * 18, 2.4 - (i % 3) * 0.3, ["#1f5a30", "#256a38", "#1a4a28"][i % 3]); }
      R(g, 0, 150, W, 50, "#2a4a30"); for (let i = 0; i < 18; i++) { const a = 0.15 + 0.15 * Math.sin(f / 25 + i); GL(g, (rnd(i) * W + f * 0.2) % W, 60 + rnd(i + 4) * 110, 14, "250,240,150", a); }
      GL(g, 250, 120, 50, "180,220,255", 0.25); card(g, 250, 118 + Math.sin(f / 20) * 4, 0.2, "#1f2937", "#4b5563", "🦇"); VIG(g, W, H, 0.45);
    },
    fg_citta(g, W, H, f) {
      VG(g, 0, 120, "#ffd6a0", "#fff0d6"); g.fillRect(0, 0, W, 120);
      for (let i = 0; i < 6; i++) { const x = 8 + i * 52; R(g, x, 70 + (i % 2) * 14, 46, 100, ["#cfc3b2", "#c0b4a2", "#d9ccb8"][i % 3]); R(g, x + 4, 130, 38, 40, "#2a2a3a"); R(g, x + 6, 134, 34, 32, "rgba(190,220,255,.55)"); card(g, x + 23, 150, 0, "#7c3aed", "#c4b5fd", ["🌱", "🪁", "🦇", "😊", "🔥", "🎭"][i]); for (let k = 0; k < 4; k++) R(g, x + 6 + k * 10, 80 + (i % 2) * 14, 6, 8, (k + i) % 3 ? "#fde68a" : "#6b7280"); }
      R(g, 0, 170, W, 30, "#8d8b94"); for (let i = 0; i < 8; i++) R(g, 8 + i * 42, 184, 22, 2, "#d4d4d8"); GL(g, 160, 60, 120, "255,210,140", 0.25 + 0.05 * Math.sin(f / 20)); VIG(g, W, H, 0.3);
    },
    fg_lega(g, W, H, f) {
      VG(g, 0, 90, "#3a2070", "#d8b4fe"); g.fillRect(0, 0, W, 90); R(g, 0, 90, W, 110, "#4a9a58"); for (let i = 0; i < 12; i++) R(g, i * 28, 90, 14, 110, "rgba(255,255,255,.05)");
      R(g, 0, 50, W, 44, "#6d5ca8"); for (let i = 0; i < 140; i++) R(g, rnd(i + 3) * W, 52 + rnd(i + 5) * 40, 2, 2, ["#fbbf24", "#f9a8d4", "#7dd3fc", "#fff"][i % 4]);
      for (let i = 0; i < 6; i++) { R(g, 30 + i * 50, 30, 2, 22, "#e5e7eb"); T(g, [32 + i * 50, 30, 46 + i * 50 + Math.sin(f / 15 + i) * 3, 36, 32 + i * 50, 42], ["#a855f7", "#f43f5e", "#0ea5e9"][i % 3]); }
      R(g, 160, 100, 2, 100, "rgba(255,255,255,.7)"); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 2; g.beginPath(); g.arc(161, 150, 28, 0, 7); g.stroke(); card(g, 120 + Math.sin(f / 20) * 6, 150, 0.1, "#7c3aed", "#c4b5fd", "🌱"); card(g, 200 - Math.sin(f / 20) * 6, 150, -0.1, "#be185d", "#fbcfe8", "🎭"); VIG(g, W, H, 0.3);
    }
  };
  const HOT = {
    fg_titolo: [[40, 80, 240, 50, "🃏 Figure viventi: escono dalle carte quando nessuno guarda. O quando guardano troppo."], [0, 140, 320, 50, "⛰️ Le colline: dietro ognuna c'è un borgo con una figura che l'aspetta."], [0, 0, 320, 70, "🌌 Il cielo: la notte porta fuori le figure d'ombra, se hanno la messa in piega giusta."]],
    fg_prato: [[34, 98, 56, 50, "🏠 L'edicola del figurinaio: odora di carta, caffè e vecchie promesse."], [200, 110, 50, 40, "🪶 Una carta vola al vento: forse non è una carta."], [0, 150, 320, 50, "🌼 Il prato: ogni fiore ha una figura che finge di essere un fiore."]],
    fg_bosco: [[230, 100, 40, 40, "🦇 Qualcuno si guarda in uno specchietto, tra i rami. Vanitoso, ma educato."], [0, 70, 320, 70, "🌲 Il Bosco dei Fischi: fischia quando non c'è vento, e tace quando c'è."], [0, 150, 320, 50, "🍂 Il sentiero: foglie, funghi e impronte di zampa. O di scarpa. O di tutte e due."]],
    fg_citta: [[0, 120, 320, 56, "🪟 Le vetrine: figure ordinate in fila, sguardo fisso e un cartellino col prezzo."], [0, 60, 320, 56, "🏙️ I palazzi: finestre accese solo per chi ha un abbonamento."], [0, 170, 320, 30, "🚶 Il marciapiede: nessuno guarda, tutti comprano."]],
    fg_lega: [[0, 50, 320, 44, "🎉 Le tribune: i borghi tifano con cartelli fatti a mano e voci prese in prestito."], [100, 130, 120, 40, "🃏 Il campo della Lega: due figure, un fischio, e tante storie dietro."], [30, 28, 260, 26, "🚩 Le bandiere dei borghi: ognuna ha un colore e una brutta figura di ricordo."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
