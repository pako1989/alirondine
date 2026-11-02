// js/leo-bg.js - sfondi di «L'ESTATE DEL MURO» (320x200), animati, con i punti da toccare: titolo, Borgo d'agosto, casa Moretti.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const waves = (g, W, y0, h, f, a, b) => { VG(g, y0, y0 + h, a, b); g.fillRect(0, y0, W, h); for (let r = 0; r < 5; r++) { g.strokeStyle = `rgba(255,255,255,${0.22 - r * 0.03})`; g.lineWidth = 1; g.beginPath(); for (let x = 0; x <= W; x += 6) { const y = y0 + 6 + r * (h / 5) + Math.sin(x / 18 + f / 16 + r) * 2; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } };
  const boy = (g, x, y, s, shirt, hair, f, i, ball) => {
    g.save(); g.translate(x, y + Math.abs(Math.sin(f / 9 + i)) * -1.5); g.scale(s, s);
    R(g, -6, -24, 12, 14, shirt); R(g, -5, -10, 4, 10, "#1e3a8a"); R(g, 1, -10, 4, 10, "#1e3a8a"); C(g, 0, -29, 5.5, "#f2c9a0"); R(g, -5.5, -35, 11, 5, hair);
    if (ball) { C(g, 9, -2 - Math.abs(Math.sin(f / 7 + i)) * 4, 3.4, "#f8fafc"); g.strokeStyle = "#475569"; g.lineWidth = 0.7; g.beginPath(); g.arc(9, -2 - Math.abs(Math.sin(f / 7 + i)) * 4, 3.4, 0, 7); g.stroke(); }
    g.restore();
  };
  const SC = {
    lm_titolo(g, W, H, f) {
      VG(g, 0, 120, "#fb923c", "#fde68a"); g.fillRect(0, 0, W, 120); C(g, 250, 52, 26, "#fffbeb"); GL(g, 250, 52, 80, "255,220,150", 0.5);
      waves(g, W, 118, 40, f, "#0ea5e9", "#0369a1");
      R(g, 0, 160, W, 40, "#e8cf94"); for (let i = 0; i < 30; i++) R(g, rnd(i) * W, 164 + rnd(i + 8) * 32, 2, 1, "rgba(120,90,40,.4)");
      // il muro del porto, con la macchia rossa
      R(g, 190, 118, 100, 44, "#b9a98f"); for (let r = 0; r < 4; r++) R(g, 190, 118 + r * 11, 100, 1, "#8f8270"); R(g, 190, 116, 100, 3, "#d6c9ac"); C(g, 236, 142, 7, "rgba(190,40,40,.7)");
      boy(g, 90, 176, 1.5, "#ff4d5a", "#2b1d14", f, 1, true); boy(g, 150, 178, 1.7, "#1d4ed8", "#2b1d14", f, 3, false); boy(g, 40, 178, 1.3, "#0ea5e9", "#e8a33d", f, 5, false);
      for (let i = 0; i < 4; i++) { const x = (f * 0.6 + i * 90) % 360 - 20; R(g, x, 30 + i * 9, 8, 1.5, "rgba(255,255,255,.7)"); R(g, x + 3, 28 + i * 9, 4, 1.5, "rgba(255,255,255,.7)"); }
      g.textAlign = "center"; g.font = "900 26px Georgia, serif"; g.fillStyle = "#fff7ed"; g.strokeStyle = "#7c2d12"; g.lineWidth = 3; g.strokeText("L'ESTATE DEL MURO", W / 2, 36); g.fillText("L'ESTATE DEL MURO", W / 2, 36);
      g.font = "italic 700 10px Georgia, serif"; g.fillStyle = "#7c2d12"; g.fillText("ogni ricordo si racconta due volte", W / 2, 52); VIG(g, W, H, 0.25);
    },
    lm_borgo(g, W, H, f) {
      VG(g, 0, 100, "#38bdf8", "#e0f2fe"); g.fillRect(0, 0, W, 100); C(g, 270, 30, 18, "#fef08a"); GL(g, 270, 30, 70, "255,240,160", 0.5);
      for (let i = 0; i < 3; i++) { const x = (f * 0.2 + i * 120) % 380 - 30; C(g, x, 24 + i * 6, 9, "rgba(255,255,255,.9)"); C(g, x + 10, 27 + i * 6, 7, "rgba(255,255,255,.9)"); }
      waves(g, W, 96, 34, f, "#06b6d4", "#0e7490");
      // case colorate del Borgo
      [[20, "#fda4af", "#be123c"], [76, "#fde68a", "#b45309"], [132, "#bae6fd", "#0369a1"], [196, "#bbf7d0", "#15803d"]].forEach(([x, w, r], i) => { R(g, x, 70, 48, 34, w); T(g, [x - 4, 70, x + 24, 52, x + 52, 70], r); R(g, x + 18, 84, 10, 20, "#5b3a22"); R(g, x + 6, 78, 8, 8, `rgba(255,236,160,${0.6 + 0.2 * Math.sin(f / 9 + i)})`); });
      R(g, 0, 130, W, 70, "#ecd49a"); R(g, 0, 128, W, 4, "#d6bf8c");
      // il muro, i ragazzi, il pallone
      R(g, 238, 100, 80, 40, "#c9b99e"); for (let r = 0; r < 3; r++) R(g, 238, 106 + r * 11, 80, 1, "#8f8270"); C(g, 280, 120, 6, "rgba(190,40,40,.7)");
      boy(g, 60, 176, 1.4, "#ff4d5a", "#2b1d14", f, 1, true); boy(g, 120, 180, 1.5, "#1d4ed8", "#2b1d14", f, 2, false); boy(g, 190, 178, 1.3, "#0ea5e9", "#e8a33d", f, 4, false);
      [[220, 150, "#ef4444"], [250, 160, "#2563eb"]].forEach(([x, y, c], i) => { T(g, [x - 16, y, x, y - 14, x + 16, y], c); R(g, x - 0.7, y, 1.5, 22, "#5b3a22"); });
      for (let i = 0; i < 12; i++) R(g, (i * 29 + f * (0.5 + (i % 3) * 0.2)) % 340 - 10, 8 + (i % 4) * 7, 4, 1.2, "rgba(255,255,255,.8)"); VIG(g, W, H, 0.18);
    },
    lm_trattoria(g, W, H, f) {
      VG(g, 0, 200, "#7a3a1e", "#3f2012"); g.fillRect(0, 0, W, 200); R(g, 0, 130, W, 70, "#9a6a3a"); for (let x = 0; x < W; x += 36) R(g, x, 130, 1, 70, "rgba(0,0,0,.25)");
      R(g, 20, 70, 120, 62, "#5b3a22"); R(g, 20, 70, 120, 6, "#7a4d2a"); for (let i = 0; i < 4; i++) { C(g, 42 + i * 26, 96, 9, "#1f2937"); C(g, 42 + i * 26, 96, 6 + Math.sin(f / 5 + i), `rgba(251,146,60,${0.55 + 0.25 * Math.sin(f / 4 + i)})`); }
      for (let i = 0; i < 3; i++) C(g, 62 + Math.sin(f / 18 + i) * 4, 62 - i * 9 - (f % 36) / 3, 4, "rgba(226,232,240,.22)"); GL(g, 80, 96, 80, "251,146,60", 0.22);
      R(g, 190, 36, 100, 56, "#1f2a1f"); R(g, 190, 36, 100, 3, "#a16207"); R(g, 200, 48, 60, 2, "#e5e7eb"); R(g, 200, 58, 74, 2, "#e5e7eb"); R(g, 200, 68, 48, 2, "#e5e7eb");
      g.save(); g.translate(230, 14); g.rotate(f / 14); R(g, -14, -1, 28, 2, "#78716c"); R(g, -1, -14, 2, 28, "#78716c"); g.restore(); C(g, 230, 14, 3, "#44403c");
      [[60, 168], [150, 176], [250, 168]].forEach(([x, y], i) => { R(g, x - 26, y - 10, 52, 5, i % 2 ? "#fff" : "#dc2626"); for (let k = 0; k < 6; k++) R(g, x - 26 + k * 9, y - 10, 4.5, 5, i % 2 ? "#dc2626" : "#fff"); R(g, x - 3, y - 5, 6, 18, "#5b3a22"); });
      GL(g, 150, 150, 120, "255,220,160", 0.12 + 0.03 * Math.sin(f / 15)); VIG(g, W, H, 0.4);
    },
    lm_pensione(g, W, H, f) {
      VG(g, 0, 200, "#8a7a5a", "#4a3f2a"); g.fillRect(0, 0, W, 200); R(g, 0, 138, W, 62, "#a68a5b"); for (let x = 0; x < W; x += 40) R(g, x, 138, 1, 62, "rgba(0,0,0,.2)");
      R(g, 30, 80, 110, 58, "#5b4636"); R(g, 30, 80, 110, 6, "#7a5c40"); R(g, 54, 70, 8, 10, "#fde68a"); C(g, 58, 68, 4, "#facc15"); R(g, 90, 72, 40, 8, "#e5e7eb");
      R(g, 170, 30, 110, 66, "#3f2a1a"); R(g, 174, 34, 102, 58, "#7dd3fc"); R(g, 174, 70, 102, 22, "#0e7490"); R(g, 224, 34, 2, 58, "#3f2a1a"); C(g, 250, 48, 7, "#fef08a"); GL(g, 225, 62, 80, "255,230,170", 0.25 + 0.05 * Math.sin(f / 16));
      // l'uomo in beige al tavolo, con il taccuino
      R(g, 190, 128, 70, 8, "#6b4423"); R(g, 194, 136, 4, 26, "#4a2f1a"); R(g, 252, 136, 4, 26, "#4a2f1a"); R(g, 210, 100, 20, 28, "#d6c7a1"); C(g, 220, 94, 7, "#efcfb0"); R(g, 213, 88, 14, 4, "#cfc6b4"); R(g, 232, 122, 12, 8, "#f9a8d4"); R(g, 235, 124, 6, 1, "#9d174d");
      for (let i = 0; i < 5; i++) { g.fillStyle = "#facc15"; g.fillRect(100 + i * 12, 40 + Math.sin(f / 12 + i) * 1, 7, 7); } VIG(g, W, H, 0.4);
    },
    lm_alba(g, W, H, f) {
      VG(g, 0, 130, "#fda4af", "#fde68a"); g.fillRect(0, 0, W, 130); const sy = 110 - Math.min(24, f * 0.04); C(g, 90, sy, 22, "#fef3c7"); GL(g, 90, sy, 100, "254,215,170", 0.5);
      for (let i = 0; i < 40; i++) R(g, rnd(i + 2) * W, rnd(i + 17) * 60, 1, 1, `rgba(255,255,255,${0.3 + 0.3 * Math.sin(f / 18 + i)})`);
      waves(g, W, 118, 36, f, "#f97316", "#0e7490"); R(g, 0, 154, W, 46, "#e5cf9a");
      R(g, 232, 30, 88, 126, "#b9a98f"); for (let r = 0; r < 10; r++) R(g, 232, 38 + r * 12, 88, 1, "#8f8270"); C(g, 262, 100, 12, "rgba(190,40,40,.75)"); C(g, 292, 86, 5, "rgba(190,40,40,.5)");
      boy(g, 170, 176, 1.6, "#1d4ed8", "#2b1d14", f, 2, true); R(g, 40, 160, 46, 12, "#b91c1c"); R(g, 40, 160, 46, 3, "#f3e9d2"); boy(g, 60, 190, 1.2, "#ff4d5a", "#2b1d14", f, 5, false);
      for (let i = 0; i < 3; i++) C(g, 140 + i * 30 + Math.sin(f / 14 + i) * 4, 118 - i * 3, 8, "rgba(255,255,255,.35)"); VIG(g, W, H, 0.22);
    },
    lm_casa(g, W, H, f) {
      VG(g, 0, 200, "#7c5a36", "#4a3220"); g.fillRect(0, 0, W, 200); for (let x = 0; x < W; x += 28) R(g, x, 0, 2, 130, "#5b3d22");
      R(g, 0, 130, W, 70, "#a77c4b"); for (let x = 0; x < W; x += 44) R(g, x, 130, 1, 70, "rgba(0,0,0,.25)");
      // finestra sul porto con il mare, il letto a castello, il tavolo con il biglietto
      R(g, 210, 24, 76, 60, "#3f2a1a"); R(g, 214, 28, 68, 52, "#7dd3fc"); R(g, 214, 60, 68, 20, "#0891b2"); R(g, 247, 28, 2, 52, "#3f2a1a"); C(g, 262, 38, 6, "#fef08a");
      R(g, 20, 60, 80, 70, "#8a5a32"); R(g, 20, 60, 80, 6, "#a8743f"); R(g, 24, 70, 72, 14, "#f3e9d2"); R(g, 24, 100, 72, 14, "#dbeafe"); R(g, 94, 60, 4, 70, "#5b3a22");
      R(g, 130, 100, 66, 10, "#6b4423"); R(g, 134, 110, 4, 22, "#4a2f1a"); R(g, 188, 110, 4, 22, "#4a2f1a"); R(g, 152, 94, 18, 6, "#fef3c7"); R(g, 160, 96, 2, 1, "#9a3412");
      GL(g, 250, 56, 70, "255,230,170", 0.28 + 0.05 * Math.sin(f / 18)); boy(g, 150, 176, 1.5, "#ff4d5a", "#2b1d14", f, 2, false); VIG(g, W, H, 0.4);
    }
  };
  const HOT = {
    lm_titolo: [[190, 118, 100, 44, "🧱 Il muro del porto. Una macchia rossa grande come un pallone: tre estati di tiri."], [20, 140, 160, 55, "👦 Leo, Dario e Nico. Uno ha un pallone, uno ha un piano, uno ha una tecnica segreta."], [200, 24, 100, 60, "☀️ Il sole di agosto: non sai mai se è tuo amico."]],
    lm_borgo: [[238, 100, 80, 40, "🧱 Il muro del porto. Dicono che se il pallone torna dritto sei pronto."], [20, 52, 220, 56, "🏠 Le case del Borgo, dipinte da un pittore che odiava il grigio."], [200, 140, 70, 40, "⛱️ Gli ombrelloni. Sotto, una signora di Torino giudica il tuo palleggio."]],
    lm_trattoria: [[20, 70, 120, 62, "🍳 La cucina a vista: quattro fuochi, due funzionanti. Papà dice che il segreto è non farlo sapere alla pentola."], [190, 36, 100, 56, "📜 La lavagna del menù. I prezzi sono scritti col gesso e le promesse con l'inchiostro."], [200, 0, 60, 30, "🌀 Il ventilatore. Fa «tac» a ogni giro: è l'orologio della trattoria."]],
    lm_pensione: [[30, 80, 110, 58, "🛎️ Il banco della reception. Il campanello suona solo se glielo chiedi con garbo."], [190, 90, 70, 50, "🧥 Un uomo in beige in pieno agosto. Prende appunti. Non suda: dev'essere un talento."], [170, 30, 110, 66, "🌊 La finestra sul porto. Dalla pensione si vede tutto, compreso chi si allena di nascosto."]],
    lm_alba: [[232, 30, 88, 126, "🧱 Il muro all'alba: due macchie rosse, una grande e una piccola. La piccola è di una mano."], [30, 150, 70, 50, "⛵ Una barca capovolta. Sotto, una sveglia a molla con un calzino sopra."], [140, 130, 60, 66, "⚽ Dario, il pallone, il muro. Un tiro dopo l'altro, senza spettatori. O quasi."]],
    lm_casa: [[210, 24, 76, 60, "🌊 La finestra sul porto: si vede il muro. E il pallone, probabilmente."], [20, 60, 80, 70, "🛏️ Il letto a castello. Sopra Dario, sotto Leo. La scaletta ha un gradino rotto."], [130, 90, 66, 44, "✉️ Il tavolo con un biglietto del treno piegato in quattro. Non è tuo."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
