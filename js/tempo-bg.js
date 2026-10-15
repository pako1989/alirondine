// js/tempo-bg.js - sfondi di «Rondine 1938-2038» (ogni epoca nel suo stile: 1938 grigi e pellicola, 1978 sole arancione, 2038 neon)
// Registrati con window.__lbBg.register (così non si tocca bg-scenarios.js). Ogni sfondo ha 3-4 punti cliccabili [x, y, larghezza, altezza, frase]
// in corrispondenza di qualcosa che si vede (disegno 320x200). Lo stato della saga si legge con window.__tempo.info().
(function () {
  "use strict";
  const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const circ = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  const info = () => { try { return window.__tempo.info().flags || {}; } catch (e) { return {}; } };
  function sky(g, W, H, e, f) {
    const gr = g.createLinearGradient(0, 0, 0, H * 0.75);
    if (e === 1938) { gr.addColorStop(0, "#8a8a88"); gr.addColorStop(1, "#d8d6cc"); } else if (e === 1978) { gr.addColorStop(0, "#d8602a"); gr.addColorStop(1, "#ffd8a0"); } else { gr.addColorStop(0, "#07042a"); gr.addColorStop(1, "#4a1a6a"); }
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (e === 2038) { for (let i = 0; i < 36; i++) px(g, rnd(i) * W, rnd(i + 5) * H * 0.55, 1.3, 1.3, `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(f / 20 + i))})`); circ(g, 270, 30, 14, "rgba(255,70,200,.25)"); }
    if (e === 1978) { glow(g, 250, 60, 70, "255,230,150", 0.7); circ(g, 250, 60, 16, "#fff0b0"); }
    if (e === 1938) for (let i = 0; i < 5; i++) px(g, ((i * 80 + f * 0.1) % 380) - 30, 20 + i * 14, 50, 6, "rgba(255,255,255,.5)");
  }
  function tower(g, x, y, e, f) { // la Torre dell'Orologio: mattoni, cemento, ologramma. L'orologio è fermo alle 22:04 (nel 1938 cammina)
    const w = 34; px(g, x - w / 2, y, w, 90, e === 1938 ? "#6a6258" : e === 1978 ? "#b8643a" : "#1a1a5a"); px(g, x - w / 2 - 3, y - 6, w + 6, 8, e === 2038 ? "#ff46c8" : "#4a4238");
    g.fillStyle = e === 2038 ? "#242a7a" : "#3a342c"; g.beginPath(); g.moveTo(x - w / 2 - 3, y - 6); g.lineTo(x, y - 30); g.lineTo(x + w / 2 + 3, y - 6); g.fill();
    circ(g, x, y + 24, 13, e === 2038 ? "rgba(70,240,255,.35)" : "#f0ead8"); g.strokeStyle = e === 2038 ? "#46f0ff" : "#2a2218"; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y + 24, 13, 0, 7); g.stroke();
    const a1 = e === 1938 ? f / 80 : 0.6, a2 = e === 1938 ? f / 6.7 : 2.5; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y + 24); g.lineTo(x + Math.sin(a1) * 7, y + 24 - Math.cos(a1) * 7); g.moveTo(x, y + 24); g.lineTo(x + Math.sin(a2) * 11, y + 24 - Math.cos(a2) * 11); g.stroke();
    if (e === 2038) glow(g, x, y + 24, 36, "70,240,255", 0.3 + 0.1 * Math.sin(f / 10)); if (e === 1978 && f % 90 < 4) px(g, x - 14, y + 10, 28, 28, "rgba(0,0,0,.35)");
    px(g, x - 5, y + 62, 10, 28, "#1a1410"); px(g, x - 3, y + 66, 6, 24, e === 2038 ? "#46f0ff" : "#c8a040");
  }
  function ground(g, W, H, e, y) { px(g, 0, y, W, H - y, e === 1938 ? "#8a8678" : e === 1978 ? "#b88a52" : "#1a1a4a"); for (let i = 0; i < 9; i++) px(g, 0, y + i * i * 0.5 + 2, W, 1, e === 2038 ? "rgba(70,240,255,.18)" : "rgba(0,0,0,.12)"); }
  function platano(g, x, y, e, f, planted) { // il platano di piazza: morente nel 2038 (sano se piantato), giovane nel 1978, aiuola nel 1938
    const sw = Math.sin(f / 40) * 1.5; if (e === 1938) { px(g, x - 18, y - 6, 36, 10, "#5a4a32"); px(g, x - 14, y - 5, 28, 6, "#3a2a18"); if (planted) { px(g, x - 1, y - 20, 2, 16, "#5aa83a"); px(g, x - 6, y - 20, 6, 3, "#5aa83a"); px(g, x + 1, y - 17, 6, 3, "#5aa83a"); } return; }
    if (e === 1978) { px(g, x - 3, y - 50, 6, 52, "#5a3e26"); if (planted) [[0, -62, 22], [-14, -50, 15], [14, -50, 15]].forEach(([dx, dy, r], i) => circ(g, x + dx + sw, y + dy, r, ["#4a7a2a", "#5a8a32", "#3e6a24"][i])); else px(g, x - 18, y - 6, 36, 10, "#5a4a32"); return; }
    px(g, x - 7, y - 70, 14, 72, planted ? "#4a3a2a" : "#3a322a");
    if (planted) { [[0, -92, 40], [-34, -76, 26], [34, -76, 26], [-16, -112, 22], [18, -112, 22]].forEach(([dx, dy, r], i) => { circ(g, x + dx + sw, y + dy, r, ["#0e5a3a", "#14774a", "#0a4a30"][i % 3]); }); for (let i = 0; i < 14; i++) px(g, x - 40 + ((i * 17 + f / 3) % 80), y - 110 + ((i * 29 + f / 2) % 90), 1.6, 1.6, "#c8ffe0"); }
    else { g.strokeStyle = "#3a322a"; g.lineWidth = 4; [[-26, -92], [24, -96], [-6, -108], [38, -80]].forEach(([dx, dy]) => { g.beginPath(); g.moveTo(x, y - 66); g.lineTo(x + dx, y + dy); g.stroke(); }); [[-24, -90], [22, -94], [36, -78]].forEach(([dx, dy]) => circ(g, x + dx, y + dy, 6, "#5a7a3a")); }
  }
  function folla(g, x, y, w, h, e, f) { for (let i = 0; i < Math.floor(w / 5); i++) { const xx = x + i * 5 + 2, yy = y + ((i * 7) % h); const c = e === 1938 ? ["#8a8070", "#6a6050", "#a89e8a"][i % 3] : e === 1978 ? ["#ff7a3a", "#ffd23f", "#3a8ac8", "#fff"][i % 4] : (i + (f >> 3)) % 4 ? "#3a4aa8" : "#ff46c8"; circ(g, xx, yy, 2.2, c); px(g, xx - 2, yy + 2, 4, 5, c); } }
  function piazza(e) { return (g, W, H, f) => {
    sky(g, W, H, e, f); for (let i = 0; i < 9; i++) { const bx = 80 + i * 26, bh = 24 + ((i * 37) % 38); px(g, bx, 120 - bh, 22, bh, e === 1938 ? "#6a6a68" : e === 1978 ? "#a8522a" : "#14124a"); if (e === 2038) { px(g, bx + 4, 120 - bh + 6, 3, 3, "#46f0ff"); px(g, bx + 12, 120 - bh + 14, 3, 3, "#ff46c8"); } }
    ground(g, W, H, e, 120); tower(g, 52, 30, e, f); platano(g, 232, 150, e, f, !!info().rt_pianta); px(g, 140, 156, 40, 5, e === 2038 ? "#ff46c8" : "#5a4a32"); px(g, 144, 150, 3, 8, "#3a3028"); px(g, 173, 150, 3, 8, "#3a3028");
    if (e === 2038) { glow(g, 160, 100, 60, "255,70,200", 0.18); px(g, 100, 144, 24, 2, "#46f0ff"); } else { px(g, 108, 110, 4, 40, "#2a241c"); circ(g, 110, 108, 4, e === 1978 ? "#ffe8a0" : "#d8d0bc"); }
  }; }
  const HOT_PZ = { 2038: [[36, 54, 32, 90, "🕙 La Torre dell'Orologio: ferma alle 22:04 da sempre. Dicono che sia colpa di un fulmine. Il fulmine nega."], [196, 44, 72, 110, "🌳 Il platano di piazza. Cent'anni di ombra, e adesso ha il fiato corto."], [136, 144, 48, 20, "🪑 Una panchina al neon, con la scritta «RISERVATA A CHI ASPETTA»."], [100, 138, 28, 12, "🔆 Una striscia di luce sul selciato. Quando la guardi, si sposta di mezzo passo."]],
    1978: [[36, 54, 32, 90, "🕙 La Torre: l'orologio elettrico scatta e si ferma, scatta e si ferma. Alle dieci e quattro."], [208, 70, 50, 90, "🌳 Il platano di piazza, giovane, con i rami che non arrivano ancora al tetto del bar."], [136, 144, 48, 20, "🪑 Una panchina di listelli verdi. Qualcuno ha inciso: «Rino + Gabriella». Poi ha cancellato Gabriella."], [100, 100, 20, 50, "💡 Un lampione con la luce color burro. Il fischio di un ciclomotore passa, e non torna."]],
    1938: [[36, 54, 32, 90, "🕙 La Torre dell'Orologio, nuova di zecca: le lancette camminano. È l'unica cosa in piazza che ha fretta."], [200, 110, 64, 50, "🌱 L'aiuola vuota. Il giardiniere dice: «Ci metteremo qualcosa. Un giorno»."], [136, 144, 48, 20, "🪑 Una panca di legno. Sotto, un cappello. Nessuno lo reclama."], [100, 100, 20, 50, "🔦 Un lampione a gas. L'acciarino lo accende un ragazzo in bicicletta, ogni sera, senza scendere."]] };
  function campo(e) { return (g, W, H, f) => {
    sky(g, W, H, e, f); px(g, 0, 70, W, 40, e === 1938 ? "#5a564e" : e === 1978 ? "#8a4a2a" : "#12104a"); folla(g, 4, 76, 312, 28, e, f); px(g, 0, 108, W, 6, e === 2038 ? "#ff46c8" : "#3a342c");
    for (let i = 0; i < 12; i++) px(g, 0, 114 + i * 7, W, 7, e === 2038 ? (i % 2 ? "#0b1c3a" : "#0a1832") : (i % 2 ? (e === 1978 ? "#4f9a3a" : "#7a806a") : (e === 1978 ? "#459033" : "#707664")));
    g.strokeStyle = e === 2038 ? "#46f0ff" : "rgba(255,255,255,.7)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, 150); g.lineTo(W, 150); g.stroke(); g.beginPath(); g.ellipse(160, 150, 46, 14, 0, 0, 7); g.stroke();
    px(g, 130, 100, 60, 4, "#e8e4d4"); px(g, 130, 90, 3, 14, "#e8e4d4"); px(g, 187, 90, 3, 14, "#e8e4d4"); px(g, 130, 90, 60, 3, "#e8e4d4");
    px(g, 124, 30, 72, 26, e === 2038 ? "#10104a" : "#2a2418"); if (e === 2038) { g.strokeStyle = "#46f0ff"; g.strokeRect(124.5, 30.5, 71, 25); g.fillStyle = "#46f0ff"; g.font = "bold 14px monospace"; g.fillText("00:00", 134, 50); } else { g.fillStyle = "#f0ead8"; g.font = "bold 13px Georgia"; g.fillText(e === 1978 ? "1 – 0" : "0 – 0", 138, 49); }
    circ(g, 160 + Math.sin(f / 20) * 30, 158 + Math.abs(Math.sin(f / 10)) * -10, 4, e === 1978 ? "#fff" : e === 2038 ? "#9af0ff" : "#a8744a");
  }; }
  const HOT_CP = { 2038: [[124, 30, 72, 26, "🔢 Il tabellone: mostra 00:00 e, ogni tanto, un numero negativo. Tilly dice che è «un'opinione»."], [130, 88, 60, 18, "🥅 La porta, con la rete a luce. Il portiere-robot ci passa sotto per non inciampare."], [4, 76, 312, 30, "👥 Gli spalti: tifosi-ologramma e tifosi veri. Si riconoscono dal tifo: gli ologrammi cantano giusto."], [140, 140, 40, 24, "⚽ Il pallone al neon, fermo sul dischetto. Si gira dall'altra parte quando lo guardi."]],
    1978: [[124, 30, 72, 26, "🔢 Il tabellone a lamelle: 1–0. Ogni tanto una lamella cade e il risultato diventa 1–D."], [130, 88, 60, 18, "🥅 La porta con la rete di corda. Il palo di sinistra è ammaccato: l'ha preso a testa un certo Rino."], [4, 76, 312, 30, "👥 La curva coi tamburi e le bandiere. Qualcuno sventola un lenzuolo dipinto: «IL GUFO CI PORTA SFORTUNA»."], [140, 140, 40, 24, "⚽ Il pallone a pentagoni bianchi e neri. Pesa più di quanto dovrebbe quando piove."]],
    1938: [[124, 30, 72, 26, "🔢 Una lavagna con il risultato scritto a gesso: 0–0. Il ragazzo che lo aggiorna è sempre in ritardo."], [130, 88, 60, 18, "🥅 Porte di legno, con la rete cucita da una pescivendola. Odorano ancora un po' di mare."], [4, 76, 312, 30, "👥 La folla in cappello, ferma come in una cartolina. Qualcuno ha portato un cane."], [140, 140, 40, 24, "⚽ Il pallone di cuoio con i lacci: pesa come un fico, quando piove come un melone."]] };
  const SC = {
    rt_titolo: { draw(g, W, H, f) { // tre epoche in tre fasce: pellicola, anni '70, neon; al centro il pallone con la rondine
      g.save(); g.beginPath(); g.rect(0, 0, 107, H); g.clip(); sky(g, W, H, 1938, f); ground(g, W, H, 1938, 130); tower(g, 52, 36, 1938, f); g.restore();
      g.save(); g.beginPath(); g.rect(107, 0, 106, H); g.clip(); sky(g, W, H, 1978, f); ground(g, W, H, 1978, 130); g.restore();
      g.save(); g.beginPath(); g.rect(213, 0, 107, H); g.clip(); sky(g, W, H, 2038, f); ground(g, W, H, 2038, 130); tower(g, 268, 36, 2038, f); g.restore();
      px(g, 107, 0, 1, H, "rgba(255,255,255,.5)"); px(g, 213, 0, 1, H, "rgba(255,255,255,.5)");
      const by = 104 + Math.sin(f / 22) * 4; glow(g, 160, by, 40, "255,230,160", 0.5); circ(g, 160, by, 16, "#f4efe0"); g.strokeStyle = "#2a2218"; g.lineWidth = 1.2; g.beginPath(); g.arc(160, by, 16, 0, 7); g.stroke();
      g.fillStyle = "#1a1a3a"; g.beginPath(); g.moveTo(150, by - 2); g.quadraticCurveTo(160, by - 12 + Math.sin(f / 8) * 3, 172, by - 4); g.quadraticCurveTo(162, by + 2, 150, by - 2); g.fill(); g.beginPath(); g.moveTo(172, by - 4); g.lineTo(182, by - 7); g.lineTo(176, by); g.fill();
      for (let i = 0; i < 3; i++) { const sx = (f * 0.7 + i * 110) % 380 - 30; px(g, sx, 28 + i * 10, 6, 2, "#1a1a3a"); px(g, sx + 2, 26 + i * 10, 2, 2, "#1a1a3a"); }
    }, hot: [[20, 30, 70, 90, "🏛️ 1938: bianco e nero, un campo di terra e una squadra appena nata."], [118, 70, 84, 70, "⚽ La Palla del Tempo. Una partita sola, giocata in tre epoche."], [226, 30, 72, 90, "💠 2038: il neon, il VAR Totale e un centenario che non vuole essere annullato."], [120, 150, 80, 40, "🕙 Sono sempre le 22:04. Qui, da qualche parte, lo sono davvero."]] },
    rt_piazza: { draw: piazza(2038), hot: HOT_PZ[2038] }, rt_piazza78: { draw: piazza(1978), hot: HOT_PZ[1978] }, rt_piazza38: { draw: piazza(1938), hot: HOT_PZ[1938] },
    rt_campo: { draw: campo(2038), hot: HOT_CP[2038] }, rt_campo78: { draw: campo(1978), hot: HOT_CP[1978] }, rt_campo38: { draw: campo(1938), hot: HOT_CP[1938] },
    rt_officina: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#2a1e32"); for (let i = 0; i < 40; i++) px(g, rnd(i) * W, rnd(i + 3) * 120, 1.2, 1.2, `rgba(255,220,150,${0.2 + 0.3 * Math.abs(Math.sin(f / 30 + i))})`);
      px(g, 0, 130, W, 70, "#5a4630"); for (let i = 0; i < 8; i++) px(g, 0, 132 + i * 9, W, 1, "rgba(0,0,0,.2)");
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const x = 20 + c * 24, y = 12 + r * 30; circ(g, x, y + 8, 9, "#e8e0c8"); g.strokeStyle = "#3a2a18"; g.lineWidth = 1; g.beginPath(); g.arc(x, y + 8, 9, 0, 7); g.moveTo(x, y + 8); g.lineTo(x + Math.sin(f / (20 + c * 7)) * 6, y + 8 - Math.cos(f / (20 + c * 7)) * 6); g.stroke(); }
      px(g, 150, 100, 130, 40, "#2a6adf"); px(g, 150, 118, 130, 6, "#f4efe0"); px(g, 162, 106, 20, 10, "#1a2a5a"); px(g, 190, 106, 20, 10, "#1a2a5a"); px(g, 218, 106, 20, 10, "#1a2a5a"); circ(g, 172, 142, 8, "#1a1a1a"); circ(g, 252, 142, 8, "#1a1a1a"); glow(g, 215, 120, 60, "255,200,90", 0.25 + 0.1 * Math.sin(f / 9));
      px(g, 150, 96, 130, 4, "#ffd23f"); g.fillStyle = "#1a1a1a"; g.font = "bold 7px Georgia"; g.fillText("1938 · 1978 · 2038", 172, 94);
      px(g, 20, 120, 100, 14, "#6a4a2a"); px(g, 28, 110, 14, 10, "#c8c8d0"); circ(g, 70, 114, 5, "#e8b83a"); circ(g, 70, 114, 2, "#6a4a2a");
      px(g, 284, 20, 28, 60, "#14143a"); for (let i = 0; i < 5; i++) { g.strokeStyle = `rgba(${i % 2 ? "70,240,255" : "255,70,200"},.7)`; g.beginPath(); g.ellipse(298, 50, 12 - i * 2, 12 - i * 2, f / 14 + i, 0, 5); g.stroke(); }
    }, hot: [[150, 96, 130, 50, "🚌 Il Pullman Rondine: blu, con la targa «1938 · 1978 · 2038». Va a trentotto all'ora, e non un chilometro di più."], [14, 8, 150, 92, "🕰️ La parete degli orologi: tutti segnano ore diverse. Quello al centro, il più vecchio, segna l'ora giusta. Dice il Professore."], [20, 108, 100, 28, "🔧 Il banco da lavoro: ingranaggi, una lente, una teiera che fischia al contrario."], [284, 16, 32, 68, "🌀 La finestra sul tempo: dentro girano tre anelli, uno bianco e nero, uno arancione, uno al neon."]] },
    rt_bar: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#5a2a1a"); px(g, 0, 0, W, 80, "#7a3a22"); px(g, 0, 130, W, 70, "#3a2418"); for (let i = 0; i < 8; i++) px(g, 0, 132 + i * 9, W, 1, "rgba(0,0,0,.25)");
      px(g, 14, 96, 180, 18, "#2a1a10"); px(g, 14, 94, 180, 4, "#c8a040"); for (let i = 0; i < 6; i++) { px(g, 26 + i * 28, 70, 8, 24, ["#3a8a4a", "#c8a040", "#a8322a"][i % 3]); }
      px(g, 214, 60, 40, 74, "#8a2a8a"); px(g, 218, 66, 32, 36, "#1a0a2a"); for (let i = 0; i < 6; i++) circ(g, 226 + (i % 3) * 9, 76 + ((i * 7) % 24), 3, ["#ff5a5a", "#ffd23f", "#5aff8a", "#5ac8ff"][(i + (f >> 3)) % 4]); glow(g, 234, 90, 50, "255,120,200", 0.25);
      px(g, 268, 80, 40, 54, "#3a1a5a"); px(g, 272, 84, 32, 20, "#0a0a1a"); circ(g, 288 + Math.sin(f / 6) * 8, 96, 3, "#e8e8f0"); px(g, 40, 30, 120, 18, "#ffb347"); g.fillStyle = "#3a1a10"; g.font = "bold 12px Georgia"; g.fillText("BAR DA INES", 52, 44);
    }, hot: [[14, 62, 180, 54, "🍸 Il bancone, con il registratore di cassa a manovella. Il caffè costa trecento lire; la storia, di più."], [212, 56, 44, 80, "🎵 Il jukebox: tre canzoni, tutte con la parola «domani»."], [266, 78, 44, 58, "🕹️ Il flipper «Gol!»: la pallina vale mille punti, il tilt cento anni di sfortuna."], [40, 26, 120, 24, "🪧 L'insegna: «DA INES». Sotto, a pennarello: «Si accettano gettoni, promesse e fotografie»."]] },
    rt_viale: { draw(g, W, H, f) {
      sky(g, W, H, 1978, f); px(g, 0, 100, W, 100, "#4a3a32"); px(g, 0, 150, W, 50, "#3a322c"); for (let i = 0; i < 10; i++) px(g, i * 36 + (f % 36) * 0, 172, 20, 3, "#e8e0c0");
      px(g, 20, 30, 90, 80, "#a8522a"); px(g, 28, 38, 74, 16, "#1a1a1a"); g.fillStyle = (f >> 4) % 2 ? "#ff5a5a" : "#ffd23f"; g.font = "bold 12px Georgia"; g.fillText("CINEMA EDEN", 32, 51);
      px(g, 130, 40, 80, 70, "#3a2a5a"); circ(g, 170, 70, 18, (f >> 3) % 2 ? "#ff5ac8" : "#5ac8ff"); g.fillStyle = "#fff"; g.font = "bold 10px Georgia"; g.fillText("IL GUFO", 150, 74);
      px(g, 238, 70, 18, 40, "#c83a3a"); px(g, 240, 74, 14, 24, "rgba(190,230,255,.7)"); px(g, 270, 130, 30, 4, "#2a2a2a"); circ(g, 274, 138, 8, "#1a1a1a"); circ(g, 296, 138, 8, "#1a1a1a"); glow(g, 170, 70, 60, "255,90,200", 0.2);
    }, hot: [[20, 30, 90, 80, "🎬 Il Cinema Eden: in cartellone «Il Pallone Che Tornava». Biglietti esauriti dal 1974."], [130, 40, 80, 70, "🪩 Il Gufo, la discoteca. Dentro suonano un disco che fa «tu-tu-tu-tu» e tutti ballano a tempo con lo stadio."], [236, 68, 22, 44, "☎️ La cabina del telefono. Il filo è tagliato, ma tutti ci entrano lo stesso per dire cose importanti."], [266, 124, 40, 26, "🚲 Una bicicletta appoggiata al muro. Ha un cartellino: «Riparazioni C. Revisori»."]] },
    rt_spogliatoio: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#4a5a5a"); px(g, 0, 130, W, 70, "#8a8a7a"); for (let i = 0; i < 8; i++) px(g, i * 40, 130, 1, 70, "rgba(0,0,0,.2)");
      for (let i = 0; i < 6; i++) { px(g, 10 + i * 36, 24, 30, 92, ["#3a6a8a", "#4a7a9a"][i % 2]); px(g, 14 + i * 36, 30, 22, 20, "#2a4a6a"); px(g, 30 + i * 36, 70, 3, 6, "#c8c8d0"); }
      px(g, 8, 128, 150, 8, "#6a4a2a"); px(g, 200, 40, 70, 46, "#1a4a2a"); px(g, 204, 44, 62, 38, "#2a6a3a"); g.strokeStyle = "#fff"; g.lineWidth = 1; g.beginPath(); g.moveTo(215, 70); g.lineTo(235, 55); g.lineTo(255, 66); g.stroke(); px(g, 278, 30, 2, 12, "#6a6a6a"); circ(g, 279, 46, 5, "#c8c8d0"); px(g, 278, 46, 2, 8, "#c8c8d0");
    }, hot: [[10, 22, 214, 96, "🚪 Gli armadietti: sul quarto c'è scritto «RINO», sul sesto «CIRO». Il secondo è sempre aperto, e vuoto."], [200, 40, 70, 46, "📋 La lavagna tattica del Mister: freccette, cerchietti e, in un angolo, un disegno di un cane."], [274, 28, 14, 30, "🎺 Un fischietto d'argento appeso a un gancio. Ha le iniziali «R.T.»."], [8, 126, 150, 14, "🪑 La panca lunga, con le sagome di mille sederi."]] },
    rt_limbo: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#050514"); for (let i = 0; i < 80; i++) px(g, rnd(i) * W, rnd(i + 7) * H, 1.2, 1.2, `rgba(200,200,255,${0.3 + 0.5 * Math.abs(Math.sin(f / 25 + i))})`);
      px(g, 150, 60, 4, 100, "#2a2a4a"); circ(g, 152, 58, 8, "#ffe8a0"); glow(g, 152, 58, 70, "255,220,140", 0.35 + 0.05 * Math.sin(f / 8)); px(g, 100, 150, 120, 6, "#2a2a5a"); [[60, 142], [152, 142], [244, 142]].forEach(([x, y], i) => { px(g, x - 14, y, 28, 14, "#3a3a7a"); px(g, x - 10, y - 8, 20, 8, "#4a4a9a"); circ(g, x, y - 14 + Math.sin(f / 15 + i) * 2, 4, ["#7ac84a", "#e8e0c8", "#c8c8d0"][i]); });
      px(g, 200, 80, 50, 4, "#2a2a5a");
    }, hot: [[140, 40, 24, 120, "🏮 Il lampione del Fischio di Mezzo: l'unico posto dove il tempo si ferma ad aspettarti."], [46, 126, 30, 32, "🌱 Il primo piedistallo: aspetta qualcosa che cresce."], [138, 126, 30, 32, "📷 Il secondo piedistallo: aspetta qualcosa che ricorda."], [230, 126, 30, 32, "🎺 Il terzo piedistallo: aspetta qualcosa che finisce."]] },
    rt_regia: { draw(g, W, H, f) {
      px(g, 0, 0, W, H, "#10061e"); for (let i = 0; i < 12; i++) { const x = 10 + (i % 4) * 76, y = 14 + Math.floor(i / 4) * 44; px(g, x, y, 68, 36, "#1a0a3a"); g.strokeStyle = i % 3 ? "#46f0ff" : "#ff46c8"; g.strokeRect(x + 0.5, y + 0.5, 67, 35); for (let k = 0; k < 4; k++) px(g, x + 6 + ((k * 13 + f / 2 + i * 5) % 50), y + 8 + k * 6, 6, 2, i % 3 ? "rgba(70,240,255,.8)" : "rgba(255,70,200,.8)"); }
      px(g, 0, 150, W, 50, "#1a0a2a"); circ(g, 160, 120, 26, "#240a3a"); circ(g, 160, 120, 18, "#ff2a4a"); circ(g, 160 + Math.sin(f / 30) * 6, 120, 8, "#1a0010"); glow(g, 160, 120, 70, "255,40,80", 0.3);
    }, hot: [[130, 94, 60, 52, "👁️ L'Occhio di ARBITRO: rosso, paziente, mai chiuso. Ti guarda come si guarda un gol da rivedere."], [6, 8, 308, 134, "🖥️ Mille moviole: ogni schermo mostra un gol di cent'anni. Quasi tutti sono segnati con una X."], [20, 150, 280, 40, "🔌 Un fascio di cavi che sale dal pavimento e porta tutto, anche il rumore, alla stessa spina."]] },
    rt_finale: { draw(g, W, H, f) {
      sky(g, W, H, 1978, f); px(g, 0, 110, W, 90, "#4f9a3a"); for (let i = 0; i < 6; i++) px(g, 0, 110 + i * 15, W, 7, "rgba(0,0,0,.08)"); px(g, 100, 80, 120, 40, "#6a6a68"); folla(g, 104, 88, 112, 20, 1978, f); platano(g, 40, 160, 2038, f, true);
      for (let i = 0; i < 4; i++) { const sx = (f * 0.8 + i * 90) % 360 - 20, sy = 40 + i * 16 + Math.sin(f / 10 + i) * 4; px(g, sx, sy, 8, 2, "#1a1a3a"); px(g, sx + 2, sy - 2, 3, 2, "#1a1a3a"); }
    }, hot: [[100, 78, 120, 44, "🏟️ Lo Stadio delle Rondini, all'alba del centenario: vecchio, rattoppato, in piedi."], [20, 50, 60, 110, "🌳 Il platano. Ogni anno ci torna una rondine, e il nido è sempre al solito posto."], [270, 20, 40, 40, "🐦 Una rondine. Passa vicinissima, e non ha fretta di dirti quanti anni ha."]] },
  };
  SC.rt_viale38 = SC.rt_piazza38; SC.rt_viale2038 = SC.rt_piazza;
  function reg(n) { if (window.__lbBg && window.__lbBg.register) Object.keys(SC).forEach((k) => window.__lbBg.register(k, SC[k])); else if (n < 80) setTimeout(() => reg(n + 1), 150); }
  reg(0);
})();
