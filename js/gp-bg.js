// js/gp-bg.js - sfondi di «Gran Premio del Pallone» (disegno 320x200, fumetto vivace con cielo azzurro e luci da corsa)
// Registrati con window.__lbBg.register (così non si tocca bg-scenarios.js). Ogni sfondo ha 3-4 punti cliccabili [x, y, larghezza, altezza, frase].
(function () {
  "use strict";
  const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const circ = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  const txt = (g, s, x, y, size, col, al) => { g.fillStyle = col; g.font = `900 ${size}px 'Trebuchet MS', sans-serif`; g.textAlign = al || "left"; g.fillText(s, x, y); g.textAlign = "left"; };
  function sky(g, W, H, f, dusk) {
    const gr = g.createLinearGradient(0, 0, 0, H * 0.6); if (dusk) { gr.addColorStop(0, "#2a2a6a"); gr.addColorStop(1, "#ff9a5a"); } else { gr.addColorStop(0, "#3a7ad8"); gr.addColorStop(1, "#cfeaff"); } g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) { const x = ((i * 90 + f * 0.15) % 400) - 40; circ(g, x, 24 + i * 9, 10, "rgba(255,255,255,.8)"); circ(g, x + 11, 26 + i * 9, 8, "rgba(255,255,255,.8)"); circ(g, x - 10, 27 + i * 9, 7, "rgba(255,255,255,.8)"); }
  }
  function car(g, x, y, s, col, f, flame) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(0, 4, 24, 5, 0, 0, 7); g.fill(); g.fillStyle = "#12121a"; g.fillRect(-24, -6, 9, 12); g.fillRect(15, -6, 9, 12); g.fillStyle = col; g.beginPath(); g.moveTo(-20, 2); g.lineTo(-14, -14); g.lineTo(14, -14); g.lineTo(20, 2); g.closePath(); g.fill(); g.fillStyle = "#ffd23f"; g.fillRect(-4, -14, 8, 16); g.fillStyle = "#8ac8ff"; g.fillRect(-9, -13, 18, 5); g.fillStyle = "#12121a"; g.beginPath(); g.arc(0, -18, 6, 0, 7); g.fill(); if (flame) { g.fillStyle = (f >> 2) % 2 ? "#ffd23f" : "#ff7a1a"; g.beginPath(); g.moveTo(-10, 2); g.lineTo(-7, 16 + (f % 4) * 2); g.lineTo(-4, 2); g.moveTo(4, 2); g.lineTo(7, 16 + (f % 4) * 2); g.lineTo(10, 2); g.fill(); } g.restore(); }
  function checker(g, x, y, w, h, n) { const c = w / n; for (let j = 0; j < Math.ceil(h / c); j++) for (let i = 0; i < n; i++) px(g, x + i * c, y + j * c, c, c, (i + j) % 2 ? "#111" : "#fff"); }
  function crowd(g, x, y, w, h, f) { px(g, x, y, w, h, "#3a4056"); for (let i = 0; i < w / 4; i++) for (let j = 0; j < h / 5; j++) { const c = ["#e8402a", "#ffd23f", "#fff", "#2a6adf", "#6ac8ff", "#1a8a4a"][(i * 3 + j * 5) % 6]; px(g, x + i * 4 + 1, y + j * 5 + 1 + ((f >> 3) + i) % 2 * (j % 2), 3, 3, c); } }
  function tribune(g, W) { px(g, 0, 88, W, 6, "#c8c8d0"); crowd(g, 0, 58, W, 32, 0); px(g, 0, 54, W, 4, "#e8402a"); }
  function ground(g, W, H, y) { px(g, 0, y, W, H - y, "#4a4a54"); for (let i = 0; i < 8; i++) px(g, 0, y + i * i * 0.6 + 4, W, 1, "rgba(255,255,255,.08)"); }
  const SC = {
    gp_titolo: { draw(g, W, H, f) { // titolo: strada in fuga con macchinina e pallone
      sky(g, W, H, f); g.fillStyle = "#7a8fb0"; g.beginPath(); g.moveTo(0, 100); g.lineTo(60, 66); g.lineTo(120, 100); g.lineTo(190, 70); g.lineTo(260, 100); g.lineTo(320, 80); g.lineTo(320, 110); g.lineTo(0, 110); g.fill();
      px(g, 0, 104, W, 96, "#37a846"); g.fillStyle = "#6a6a74"; g.beginPath(); g.moveTo(150, 104); g.lineTo(170, 104); g.lineTo(300, 200); g.lineTo(20, 200); g.fill();
      for (let i = 0; i < 9; i++) { const y = 108 + i * i * 1.2, w = 2 + i * 3; px(g, 160 - w / 2, y, w, 2 + i * 0.4, (i + (f >> 3)) % 2 ? "#fff" : "rgba(255,255,255,0)"); }
      px(g, 138, 110, 44, 4, "#fff"); checker(g, 138, 100, 44, 10, 11); px(g, 136, 100, 3, 14, "#2a2a33"); px(g, 181, 100, 3, 14, "#2a2a33");
      car(g, 160, 170, 1.6, "#2a6adf", f, true); circ(g, 252, 168 - Math.abs(Math.sin(f / 9)) * 22, 12, "#fff"); g.strokeStyle = "#222"; g.lineWidth = 1.5; g.beginPath(); g.arc(252, 168 - Math.abs(Math.sin(f / 9)) * 22, 12, 0, 7); g.stroke(); circ(g, 252, 168 - Math.abs(Math.sin(f / 9)) * 22, 4, "#222");
      for (let i = 0; i < 6; i++) px(g, 40 + ((f * 5 + i * 60) % 240), 120 + i * 11, 40, 1.4, "rgba(255,255,255,.5)");
      txt(g, "GRAN PREMIO", 160, 30, 22, "#ffd23f", "center"); txt(g, "DEL PALLONE", 160, 52, 16, "#fff", "center");
    }, hot: [[130, 126, 60, 60, "🏎️ La Rondinella: tre auto e una lavatrice. A volte, in curva, fa il centrifugato."], [238, 140, 28, 40, "⚽ Il pallone del campionato. Gli piace farsi inseguire, ma ha le sue regole."], [130, 96, 60, 20, "🏁 Il traguardo. Sembra vicino, ma è dopo il tiro."], [100, 14, 120, 50, "📣 Il titolo, urlato. Dicono che Gridoni lo legga ad alta voce anche dentro la doccia."]] },
    gp_paddock: { draw(g, W, H, f) {
      sky(g, W, H, f); tribune(g, W); ground(g, W, H, 94);
      px(g, 14, 66, 78, 52, "#d8dce8"); px(g, 10, 60, 86, 8, "#2a3a8a"); px(g, 38, 84, 24, 34, "#2a6adf"); px(g, 40, 96, 20, 22, "#12121a"); px(g, 18, 74, 14, 10, "#8ac8ff"); px(g, 72, 74, 14, 10, "#8ac8ff"); txt(g, "BULLONE", 53, 80, 7, "#fff", "center");
      px(g, 112, 70, 66, 48, "#e8d8a8"); px(g, 108, 64, 74, 7, "#8a6a1a"); px(g, 136, 88, 18, 30, "#c8a040"); txt(g, "GOMMALUX", 145, 80, 7, "#8a6a1a", "center");
      px(g, 212, 40, 58, 78, "#d8d0d8"); px(g, 208, 34, 66, 8, "#8a2a2a"); px(g, 224, 50, 34, 20, "#8ac8ff"); px(g, 238, 44, 2, 12, "#2a2a2a"); circ(g, 239, 42, 3, "#222");
      for (let i = 0; i < 3; i++) { px(g, 300, 112 + i * 6, 14, 6, "#14141a"); px(g, 302, 113 + i * 6, 10, 1.5, ["#ffd23f", "#fff", "#e8402a"][i]); }
      car(g, 190, 150, 1.1, "#d8302a", f, false); car(g, 104, 170, 1.3, "#2a6adf", f, false);
      px(g, 30, 138, 40, 3, "#fff"); for (let i = 0; i < 5; i++) px(g, 240 + i * 14, 142, 8, 14, ["#e8402a", "#ffd23f", "#2a6adf", "#1a8a4a", "#8a3ad8"][i]);
    }, hot: [[14, 60, 82, 58, "🔧 Il Box Bullone: la porta blu è la sola che si chiude da sola. Per vergogna."], [108, 64, 74, 54, "🥂 Gommalux Hospitality: dentro, un buffet con le olive a forma di ruota."], [208, 34, 66, 84, "🎙️ La Torre di Controllo. Dalla finestra sporge un microfono che sembra ascoltarti."], [168, 134, 50, 30, "🏎️ Una macchina rossa, ferma. Sotto il cofano scoppietta qualcosa. Una risata, forse."]] },
    gp_pista: { draw(g, W, H, f) {
      sky(g, W, H, f); g.fillStyle = "#7a8fb0"; g.beginPath(); g.moveTo(0, 86); g.lineTo(50, 54); g.lineTo(110, 86); g.lineTo(200, 58); g.lineTo(280, 86); g.lineTo(320, 70); g.lineTo(320, 96); g.lineTo(0, 96); g.fill();
      px(g, 0, 90, W, 110, "#37a846"); for (let i = 0; i < 6; i++) px(g, 0, 98 + i * i * 2.5, W, 6 + i, i % 2 ? "rgba(0,0,0,.06)" : "rgba(255,255,255,.04)");
      g.fillStyle = "#6a6a74"; g.beginPath(); g.moveTo(130, 92); g.lineTo(190, 92); g.lineTo(310, 200); g.lineTo(10, 200); g.fill(); for (let i = 0; i < 10; i++) { const y = 96 + i * i * 1.1; px(g, 156, y, 8, 3 + i * 0.6, (i + (f >> 3)) % 2 ? "#e8e8e0" : "rgba(0,0,0,0)"); }
      g.strokeStyle = "#c82a2a"; g.lineWidth = 3; g.beginPath(); g.moveTo(130, 92); g.lineTo(10, 200); g.moveTo(190, 92); g.lineTo(310, 200); g.stroke(); g.strokeStyle = "#fff"; g.setLineDash([6, 6]); g.stroke(); g.setLineDash([]);
      px(g, 250, 112, 52, 22, "#3a7aa8"); px(g, 258, 100, 14, 16, "#c8a040"); px(g, 255, 96, 20, 6, "#8a6a1a"); px(g, 22, 120, 30, 12, "#2a7a34"); circ(g, 36, 108, 14, "#2a8a3a");
      px(g, 40, 104, 3, 24, "#4a3220"); car(g, 150, 150, 0.9, "#d8302a", f, true); px(g, 110, 160, 100, 3, "rgba(255,255,255,.4)");
      for (let i = 0; i < 3; i++) { px(g, 70 + i * 6, 142 - i * 5, 12, 5, "#14141a"); }
      px(g, 100, 76, 120, 12, "#fff"); checker(g, 100, 70, 120, 6, 40); txt(g, "GRIGLIA", 160, 86, 8, "#d82a2a", "center");
    }, hot: [[250, 96, 52, 40, "🏝️ L'isola dei fossi: una casetta con un tetto d'oro. In macchina si arriva. A piedi, a nuoto."], [96, 66, 128, 24, "🏁 L'arco della partenza. Sotto, una scritta: «NON PARTIRE ANTICIPATO, OVVIAMENTE»."], [110, 130, 80, 40, "🏎️ La macchina di Rosalba, già calda. Il motore fa un rumore che sembra una risata in tre tempi."], [20, 100, 40, 36, "🌳 Un albero spettatore: ha il tronco pieno di adesivi e una bandierina."]] },
    gp_box: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#4a4e66"); px(g, 0, 138, W, 62, "#6a6a76"); for (let i = 0; i < 8; i++) px(g, i * 44, 138, 1, 62, "rgba(0,0,0,.2)");
      px(g, 0, 40, W, 6, "#2a6adf"); for (let i = 0; i < 6; i++) { px(g, 16 + i * 52, 50, 30, 60, "#3a3e56"); for (let k = 0; k < 4; k++) px(g, 20 + i * 52, 56 + k * 13, 22, 3, ["#c8c8d0", "#ffd23f", "#e8402a"][(i + k) % 3]); }
      car(g, 160, 168, 1.8, "#2a6adf", f, false); px(g, 232, 120, 60, 30, "#14141a"); px(g, 236, 124, 52, 4, "#ffd23f"); px(g, 20, 150, 30, 24, "#5a4630"); px(g, 24, 140, 2, 12, "#c8c8d0"); px(g, 30, 140, 2, 12, "#ffd23f"); px(g, 36, 140, 2, 12, "#e8402a");
      glow(g, 160, 30, 90, "255,220,140", 0.25); px(g, 140, 24, 40, 5, "#fff6c8"); circ(g, 28, 118, 6, "#f0c070"); px(g, 22, 118, 12, 14, "#f0c070");
    }, hot: [[110, 130, 100, 50, "🏎️ La Rondinella: blu, strisce gialle, un fanale che strizza l'occhio."], [232, 120, 60, 30, "🛞 Le gomme: grip, veloci, miste. Una pila per ogni umore."], [14, 136, 40, 40, "🔧 Il banco attrezzi. La chiave a nuvola sta sempre nello stesso posto: in mano a Tonino."], [14, 106, 24, 30, "🐈 Dado, il gatto del box. Dorme in un cappello da pilota. Il cappello è suo."]] },
    gp_podio: { draw(g, W, H, f) {
      sky(g, W, H, f, true); px(g, 0, 150, W, 50, "#3a3a44"); crowd(g, 0, 70, W, 50, f); px(g, 0, 66, W, 5, "#ffd23f");
      px(g, 100, 130, 40, 20, "#c0c0c8"); px(g, 140, 112, 40, 38, "#e8b83a"); px(g, 180, 138, 40, 12, "#b8763a"); txt(g, "2", 120, 146, 10, "#222", "center"); txt(g, "1", 160, 136, 14, "#222", "center"); txt(g, "3", 200, 148, 9, "#222", "center");
      circ(g, 160, 98, 8, "#e0b890"); px(g, 154, 104, 12, 12, "#2a6adf"); px(g, 148, 106, 8, 3, "#e0b890"); px(g, 164, 106, 8, 3, "#e0b890"); circ(g, 160, 84, 8, "#e8b83a"); px(g, 156, 88, 8, 8, "#e8b83a"); px(g, 148, 78, 4, 10, "#e8b83a"); px(g, 168, 78, 4, 10, "#e8b83a");
      for (let i = 0; i < 40; i++) px(g, rnd(i) * W, ((f * (1 + rnd(i + 3)) + i * 30) % 160), 3, 3, ["#ffd23f", "#e8402a", "#2a6adf", "#fff"][i % 4]);
    }, hot: [[140, 80, 40, 70, "🏆 Il gradino più alto: lucido, scivoloso, appiccicoso di champagne. Ci si sta in equilibrio."], [90, 130, 52, 20, "🥈 Il secondo gradino: il più dignitoso. Si vede il podio intero."], [180, 136, 44, 14, "🥉 Il terzo: ha il vantaggio di essere sempre libero."], [0, 70, 320, 50, "👥 La folla: bandiere, sirene, un tizio con un cartello «ALLA SALUTE DELLA MIA SCUDERIA»."]] },
    gp_cabina: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#3a2a4a"); px(g, 20, 20, 280, 70, "#8ac8ff"); crowd(g, 30, 40, 260, 32, f); px(g, 20, 86, 280, 6, "#2a1a3a");
      px(g, 0, 100, W, 100, "#4a2a5a"); px(g, 40, 112, 240, 24, "#2a1a3a"); for (let i = 0; i < 14; i++) px(g, 50 + i * 16, 116, 10, 4, ["#ff4a8a", "#4af0ff", "#ffd23f"][(i + (f >> 4)) % 3]);
      px(g, 150, 128, 4, 22, "#c8c8d0"); circ(g, 152, 126, 7, "#222"); px(g, 60, 150, 50, 10, "#6a4a7a"); px(g, 210, 140, 6, 40, "#c8c8d0"); px(g, 180, 144, 40, 3, "#8a6a2a"); px(g, 214, 136, 1, 28, "#ddd");
      px(g, 250, 120, 40, 40, "#ffd23f"); txt(g, "ON AIR", 270, 144, 7, "#d82a2a", "center");
    }, hot: [[140, 116, 28, 36, "🎙️ Il microfono: nero, grosso, con un adesivo «NON SOFFIARE: SONO GIÀ ABBASTANZA DRAMMATICO»."], [20, 20, 280, 70, "🪟 La vetrata sul circuito: da qui si vede tutto, compreso quello che non andrebbe visto."], [208, 134, 14, 40, "🎣 Una canna da pesca appoggiata alla finestra. Il filo scende fino alla pista. Che strano passatempo."], [248, 118, 44, 44, "📢 La luce «ON AIR»: se è accesa, nessuno ti sente. Se è spenta, lo senti tu."]] },
    gp_salotto: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#4a3220"); px(g, 0, 130, W, 70, "#a8864a"); for (let i = 0; i < 12; i++) px(g, i * 28, 130, 1, 70, "rgba(0,0,0,.15)"); px(g, 20, 20, 90, 70, "#e8d8a8"); px(g, 24, 24, 82, 62, "#8ac8ff"); px(g, 210, 20, 90, 70, "#c8a040");
      for (let i = 0; i < 5; i++) { px(g, 220 + i * 16, 30, 10, 50, ["#e8402a", "#ffd23f", "#fff", "#2a6adf", "#1a8a4a"][i]); } px(g, 130, 108, 60, 14, "#7a5a2a"); circ(g, 160, 100, 7, "#c8a040"); px(g, 150, 100, 20, 8, "#c8a040");
      px(g, 40, 150, 80, 24, "#8a3a3a"); px(g, 200, 150, 80, 24, "#8a3a3a"); glow(g, 160, 40, 80, "255,220,120", 0.3 + 0.05 * Math.sin(f / 10)); px(g, 150, 24, 20, 14, "#ffd23f");
    }, hot: [[130, 98, 60, 28, "🍾 Il tavolo del buffet: olive a ruota, tartine a forma di pallone e una bottiglia che non si apre mai da sola."], [210, 20, 90, 70, "🖼️ Un quadro pieno di logo: GOMMALUX, GOMMALUX, e un piccolo GOMMALUX in un angolo."], [40, 146, 80, 30, "🛋️ Un divano: affonda come un'offerta che non puoi rifiutare."], [150, 20, 28, 20, "💡 Il lampadario d'oro: ha una scritta sul cavo «NON SPIEGHIAMO COME»."]] },
    gp_giardino: { draw(g, W, H, f) {
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#ffe8a0"); gr.addColorStop(1, "#8ad8a0"); g.fillStyle = gr; g.fillRect(0, 0, W, H); glow(g, 160, 40, 120, "255,240,170", 0.6);
      px(g, 0, 110, W, 90, "#3aa85a"); for (let i = 0; i < 6; i++) px(g, 0, 118 + i * i * 2, W, 6, i % 2 ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.05)");
      for (const x of [30, 90, 230, 290]) { px(g, x - 3, 70, 6, 50, "#6a4a2a"); circ(g, x, 62, 20, "#2a9a4a"); circ(g, x - 9, 70, 12, "#3ab05a"); circ(g, x + 9, 58, 12, "#3ab05a"); }
      px(g, 130, 120, 60, 12, "#e8d898"); px(g, 140, 108, 40, 12, "#e8d898"); circ(g, 160, 98, 12, "#ffd23f"); circ(g, 160, 98, 8, "#fff"); g.strokeStyle = "#222"; g.lineWidth = 1; g.beginPath(); g.arc(160, 98, 8, 0, 7); g.stroke(); px(g, 150, 92, 4, 14, "#e8b83a"); px(g, 166, 92, 4, 14, "#e8b83a");
      for (let i = 0; i < 24; i++) px(g, ((i * 41 + f * 0.4) % 320), 60 + ((i * 23) % 100) + Math.sin(f / 20 + i) * 4, 1.6, 1.6, "rgba(255,255,200,.9)");
    }, hot: [[130, 80, 60, 56, "🏆 La Coppa Rotonda del fondatore: due manici, un solo pallone, nessuna targa. Sembra piccola e pesa un'idea."], [20, 40, 80, 80, "🌳 Alberi dai frutti rotondi. Non sono arance: sono bulloni d'oro che sbucciano."], [220, 40, 80, 80, "🌳 Un albero con una scritta incisa: «DAL CUORE, A DUE MANI»."], [0, 132, 320, 60, "🌿 Un prato così silenzioso che senti il motore del cuore. Piano piano, senza fretta."]] },
  };
  SC.gp_notte = SC.gp_pista;
  function reg(n) { if (window.__lbBg && window.__lbBg.register) Object.keys(SC).forEach((k) => window.__lbBg.register(k, SC[k])); else if (n < 80) setTimeout(() => reg(n + 1), 150); }
  reg(0);
})();
