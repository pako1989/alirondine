// js/dungeon-bg.js - sfondi di «Dungeon di Fine Stagione» (pixel art scura, torce che sfarfallano, braci che salgono)
// Registrati dal file della saga con window.__lbBg.register (così non si tocca bg-scenarios.js). Ogni sfondo ha almeno 3 punti cliccabili,
// tutti in corrispondenza di qualcosa che si vede: l'area [x, y, larghezza, altezza] è sul disegno (320x200).
(function () {
  "use strict";
  const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function bricks(g, x, y, w, h, c1, c2, c3, bh) {
    bh = bh || 8; px(g, x, y, w, h, c3);
    for (let r = 0; r * bh < h; r++) { const o = r % 2 ? 0 : 12; for (let bx = -12 + o; bx < w; bx += 24) { const xx = Math.max(0, bx + 1), ww = Math.min(w, bx + 23) - xx; if (ww > 0) { px(g, x + xx, y + r * bh + 1, ww, Math.min(bh - 1, h - r * bh - 1), (r + (bx >> 3)) % 3 ? c1 : c2); px(g, x + xx, y + r * bh + 1, ww, 1, "rgba(255,255,255,.07)"); } } }
  }
  function flame(g, x, y, s, f, seed) {
    const a = Math.sin(f / 4 + seed) * 1.5, b = Math.sin(f / 3 + seed * 2) * 1;
    px(g, x - 2 * s, y - 2 * s, 4 * s, 2 * s, "#5a3a1c"); px(g, x - 3 * s, y - 6 * s + a, 6 * s, 5 * s, "#ff7a1a"); px(g, x - 2 * s, y - 9 * s + a, 4 * s, 6 * s, "#ffb04a"); px(g, x - 1 * s + b, y - 12 * s + a, 2 * s, 4 * s, "#ffd23f"); px(g, x - 1 * s, y - 6 * s, 2 * s, 3 * s, "#fff6c0");
  }
  function torch(g, x, y, f, seed) { px(g, x - 1, y, 3, 14, "#3a2a1a"); px(g, x - 3, y - 1, 7, 3, "#6a5a4a"); glow(g, x, y - 8, 46 + Math.sin(f / 5 + seed) * 3, "255,140,50", 0.4); flame(g, x, y, 1, f, seed); }
  function embers(g, W, H, f, n, rgb) { for (let i = 0; i < n; i++) { const sp = 0.25 + rnd(i) * 0.5, y = H - ((f * sp + rnd(i + 9) * H) % H), x = (rnd(i + 3) * W + Math.sin(f / 30 + i) * 6) % W; px(g, x, y, 1.5, 1.5, rgb || (i % 3 ? "#ff9a3a" : "#ffd23f")); } }
  function vig(g, W, H, a) { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.95); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(4,2,2,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  const FLOOR = (g, y, H, W, c1, c2) => { px(g, 0, y, W, H - y, c1); for (let i = 0; i < 8; i++) { px(g, 0, y + i * i * 0.9 + 2, W, 1, c2); } for (let i = -6; i < 14; i++) { g.strokeStyle = c2; g.lineWidth = 1; g.beginPath(); g.moveTo(160 + (i - 4) * 14, y); g.lineTo(160 + (i - 4) * 46, H); g.stroke(); } };
  function door(g, x, y, w, h, kind, f) {
    px(g, x - 3, y - 3, w + 6, h + 3, "#1a1412"); px(g, x, y, w, h, kind === "ferro" ? "#6a7078" : kind === "legno" ? "#8a5a32" : "#4a1a10");
    if (kind === "ferro") { for (let i = 0; i < 4; i++) px(g, x + 3, y + 6 + i * (h / 4), w - 6, 1, "#3a4048"); px(g, x, y, w, 3, "#8a9098"); }
    if (kind === "legno") { for (let i = 0; i < 5; i++) px(g, x + 3 + i * (w / 5), y + 2, 1, h - 2, "#5a3a1c"); px(g, x, y + 8, w, 3, "#2a2018"); px(g, x, y + h - 14, w, 3, "#2a2018"); }
    if (kind === "brace") { const a = 0.5 + 0.4 * Math.sin(f / 8); px(g, x + w / 2 - 2, y + 6, 4, h - 12, `rgba(255,150,50,${a})`); px(g, x + 6, y + h / 2 - 2, w - 12, 4, `rgba(255,150,50,${a})`); glow(g, x + w / 2, y + h / 2, 40, "255,110,30", 0.4 * a); }
    px(g, x + w - 9, y + h / 2, 4, 4, "#c8a040");
  }

  function bgTitolo(g, W, H, f) {
    px(g, 0, 0, W, H, "#0b0806"); bricks(g, 0, 0, W, 130, "#2a2220", "#322826", "#161110");
    // arco del tunnel con il pallone sul braciere
    g.fillStyle = "#050303"; g.beginPath(); g.moveTo(90, 160); g.lineTo(90, 70); g.quadraticCurveTo(160, 0, 230, 70); g.lineTo(230, 160); g.fill();
    for (let i = 0; i < 6; i++) px(g, 96 + i * 4, 150 - i * 4, 128 - i * 8, 4, ["#5a4c42", "#4a3e36", "#3a302a", "#2e2622", "#241e1a", "#1a1512"][i]);
    glow(g, 160, 110, 70 + Math.sin(f / 6) * 3, "255,120,40", 0.45);
    px(g, 148, 118, 24, 4, "#6a5a4a"); px(g, 152, 122, 16, 22, "#3a2a1a"); px(g, 146, 100, 28, 18, "#2a1c14"); flame(g, 160, 104, 2, f, 1);
    g.fillStyle = "#e8dcc4"; g.beginPath(); g.arc(160, 88 + Math.sin(f / 18) * 2, 9, 0, 7); g.fill(); g.fillStyle = "#1a1210"; [[160, 88], [153, 86], [167, 86], [157, 94], [163, 94]].forEach(([x, y], i) => px(g, x - 2, y - 2 + Math.sin(f / 18) * 2, 4, 4, "#2a2018"));
    torch(g, 54, 70, f, 0); torch(g, 266, 70, f, 3);
    px(g, 24, 20, 14, 36, "#7a1a14"); px(g, 28, 28, 6, 6, "#ffb04a"); px(g, 282, 20, 14, 36, "#7a1a14"); px(g, 286, 28, 6, 6, "#ffb04a");
    FLOOR(g, 160, H, W, "#1c1614", "#2e2622"); embers(g, W, H, f, 24); vig(g, W, H, 0.7);
  }
  function bgCampo(g, W, H, f) {
    px(g, 0, 0, W, H, "#0b0806"); bricks(g, 0, 0, W, 120, "#2e2624", "#362c28", "#171211");
    // il Muro dei Caduti a sinistra: nomi graffiati
    px(g, 14, 20, 76, 92, "#3a3230"); for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) px(g, 18 + c * 18, 26 + r * 9, 8 + ((r * 5 + c * 3) % 7), 1, "#8a7e6e");
    // la scalinata in fondo
    px(g, 204, 40, 56, 80, "#050303"); for (let i = 0; i < 7; i++) px(g, 204 + i * 2, 110 - i * 10, 56 - i * 4, 4, ["#6a5c50", "#5a4c42", "#4a3e36", "#3e342e", "#2e2622", "#241e1a", "#181210"][i]); glow(g, 232, 70, 50, "255,230,170", 0.12 + 0.04 * Math.sin(f / 12));
    FLOOR(g, 120, H, W, "#201a17", "#322a26");
    // il falò
    glow(g, 160, 140, 110 + Math.sin(f / 5) * 5, "255,130,40", 0.5); for (let i = 0; i < 5; i++) px(g, 140 + i * 8, 148 - (i % 2) * 2, 12, 5, i % 2 ? "#4a3220" : "#5a4028"); flame(g, 160, 144, 3, f, 2);
    // il tavolo con il Mister
    px(g, 236, 128, 60, 6, "#7a5a36"); px(g, 240, 134, 4, 16, "#4a3420"); px(g, 288, 134, 4, 16, "#4a3420"); px(g, 252, 120, 8, 8, "#e8dcc4"); px(g, 270, 122, 6, 6, "#c8a040");
    px(g, 40, 128, 14, 26, "#2a2018"); px(g, 36, 124, 22, 6, "#3a2a1a"); // il pallone nel sacco
    torch(g, 190, 60, f, 1); torch(g, 112, 62, f, 4); embers(g, W, H, f, 30); vig(g, W, H, 0.62);
  }
  function bgP1(g, W, H, f) {
    px(g, 0, 0, W, H, "#0a0807"); bricks(g, 0, 0, W, 130, "#3a322e", "#443a36", "#1a1514");
    door(g, 52, 54, 52, 76, "ferro", f); door(g, 134, 54, 52, 76, "legno", f); door(g, 216, 54, 52, 76, "brace", f);
    [[30, 0], [112, 1], [194, 2], [290, 3]].forEach(([x, s]) => { px(g, x, 26, 8, 104, "#4a403a"); px(g, x - 2, 22, 12, 6, "#5c5048"); px(g, x - 2, 126, 12, 6, "#5c5048"); });
    FLOOR(g, 130, H, W, "#241e1a", "#352c28");
    // il coro di scheletri nell'angolo
    for (let i = 0; i < 3; i++) { const x = 20 + i * 14, b = Math.sin(f / 10 + i) * 2; px(g, x, 156 + b, 7, 7, "#cfc8b4"); px(g, x + 1, 163 + b, 5, 12, "#b0a890"); px(g, x + 2, 158 + b, 1, 2, "#1a1210"); px(g, x + 4, 158 + b, 1, 2, "#1a1210"); }
    torch(g, 20, 70, f, 0); torch(g, 110, 80, f, 2); torch(g, 200, 80, f, 5); torch(g, 296, 70, f, 7); embers(g, W, H, f, 22); vig(g, W, H, 0.6);
  }
  function bgP2(g, W, H, f) {
    px(g, 0, 0, W, H, "#050b0b"); bricks(g, 0, 0, W, 100, "#22403c", "#2a4c48", "#0e1a1a");
    for (let i = 0; i < 4; i++) { const x = 20 + i * 80; g.fillStyle = "#050909"; g.beginPath(); g.moveTo(x, 100); g.lineTo(x, 60); g.quadraticCurveTo(x + 30, 20, x + 60, 60); g.lineTo(x + 60, 100); g.fill(); px(g, x - 6, 26, 10, 74, "#34524e"); }
    // l'acqua ferma, con i riflessi
    px(g, 0, 100, W, 100, "#0e3030"); for (let i = 0; i < 18; i++) { const y = 104 + i * 5, a = 0.15 + 0.1 * Math.sin(f / 14 + i); px(g, 10 + ((i * 53 + f * 0.3) % 280), y, 30 + (i % 4) * 10, 1, `rgba(140,255,230,${a})`); }
    glow(g, 160, 100, 120, "80,230,200", 0.28 + 0.06 * Math.sin(f / 18));
    // la passerella con la lanterna e la statua con gli occhiali
    px(g, 40, 140, 240, 5, "#4a3a28"); for (let i = 0; i < 8; i++) px(g, 48 + i * 30, 145, 4, 14, "#2a2018");
    px(g, 232, 80, 18, 56, "#5a6a68"); px(g, 228, 74, 26, 10, "#6a7a78"); px(g, 233, 82, 6, 3, "#0a1414"); px(g, 243, 82, 6, 3, "#0a1414"); px(g, 238, 86, 4, 1, "#0a1414");
    px(g, 76, 118, 3, 22, "#3a2a1a"); px(g, 70, 112, 15, 8, "#c8a040"); glow(g, 77, 116, 40, "255,200,100", 0.5 + 0.1 * Math.sin(f / 7));
    torch(g, 14, 50, f, 1); torch(g, 306, 50, f, 3); embers(g, W, H, f, 14, "#7affd8"); vig(g, W, H, 0.65);
  }
  function bgP3(g, W, H, f) {
    px(g, 0, 0, W, H, "#0e0a06"); bricks(g, 0, 0, W, 60, "#4a3c24", "#58482c", "#241c10");
    // la tribuna d'oro: gradoni con sagome grigie che applaudono piano
    for (let r = 0; r < 5; r++) { px(g, 0, 60 + r * 14, W, 14, r % 2 ? "#3e3220" : "#4a3c26"); px(g, 0, 60 + r * 14, W, 1, "#8a7040"); for (let c = 0; c < 22; c++) { const x = 4 + c * 14 + (r % 2) * 7, up = Math.sin(f / 9 + c + r) > 0.7 ? 2 : 0; px(g, x, 66 + r * 14 - up, 6, 8, "#6a6258"); px(g, x + 1, 62 + r * 14 - up, 4, 4, "#8a8274"); } }
    FLOOR(g, 130, H, W, "#3a3020", "#5a4a2e");
    // il portale d'oro e il trofeo
    px(g, 128, 60, 64, 84, "#1a1208"); px(g, 124, 56, 72, 6, "#c8a040"); px(g, 124, 56, 6, 88, "#c8a040"); px(g, 190, 56, 6, 88, "#c8a040"); glow(g, 160, 100, 70, "255,200,90", 0.28 + 0.06 * Math.sin(f / 11));
    px(g, 152, 108, 16, 4, "#ffd23f"); px(g, 156, 96, 8, 12, "#e8b030"); px(g, 150, 88, 20, 10, "#ffd23f"); px(g, 154, 86, 12, 2, "#fff0a0");
    torch(g, 40, 80, f, 0); torch(g, 280, 80, f, 2); embers(g, W, H, f, 28, "#ffd23f"); vig(g, W, H, 0.55);
  }
  function bgFinale(g, W, H, f) {
    const gr = g.createLinearGradient(0, 0, 0, 120); gr.addColorStop(0, "#2a2a4a"); gr.addColorStop(0.6, "#d88a6a"); gr.addColorStop(1, "#ffd2a0"); g.fillStyle = gr; g.fillRect(0, 0, W, 130);
    glow(g, 160, 118, 90, "255,220,150", 0.5); px(g, 150, 108, 20, 10, "#fff2c0");
    for (let i = 0; i < 18; i++) px(g, 10 + i * 18, 106 - (i * 7 % 14), 14, 30, "#1c1424"); px(g, 0, 130, W, 70, "#4a7a3a"); for (let i = 0; i < 8; i++) px(g, 0, 130 + i * 9, W, 4, i % 2 ? "#4a7a3a" : "#5a8a46");
    px(g, 60, 168, 200, 1, "rgba(255,255,255,.5)");
    // tre figure e un pallone
    [[100, "#c8501a"], [160, "#7a1a14"], [220, "#8a8478"]].forEach(([x, c], i) => { const b = Math.sin(f / 12 + i) * 1.5; px(g, x, 150 + b, 8, 8, "#e8c4a0"); px(g, x - 1, 158 + b, 10, 14, c); px(g, x, 172 + b, 3, 8, "#2a2018"); px(g, x + 5, 172 + b, 3, 8, "#2a2018"); });
    const bx = 130 + ((f * 0.4) % 40); g.fillStyle = "#f4efe0"; g.beginPath(); g.arc(bx, 176 - Math.abs(Math.sin(f / 10)) * 8, 4, 0, 7); g.fill(); embers(g, W, H, f, 12, "#ffd23f"); vig(g, W, H, 0.3);
  }
  const LB = {
    dg_titolo: { draw: bgTitolo, hot: [
      [140, 76, 40, 30, "⚽ Il pallone sul braciere. Dicono che si accenda da solo, la notte della finale."],
      [36, 56, 36, 30, "🔥 Una torcia. Il custode giura che non si è mai spenta. Nessuno ha mai provato."],
      [14, 18, 36, 44, "🚩 Lo stendardo del Torneo: una brace dentro un pallone. Sotto: «Ricomincia»."],
      [100, 130, 120, 30, "🪜 La scala che scende. Gli ultimi gradini si vedono solo quando ci sei sopra."],
    ] },
    dg_campo: { draw: bgCampo, hot: [
      [130, 120, 60, 40, "🔥 Il falò del Campo Base. Non chiede niente: è l'unico, qui sotto."],
      [14, 20, 76, 92, "📜 Il Muro dei Caduti. In basso c'è un posto libero, inciso a metà."],
      [204, 40, 56, 80, "🪜 La Scalinata. Dal fondo sale un chiarore rosso, e un leggero odore di prato."],
      [236, 118, 60, 36, "🍺 Il tavolo del Mister: un fischietto muto e un bicchiere che si riempie quando non guardi."],
    ] },
    dg_p1: { draw: bgP1, hot: [
      [52, 54, 52, 76, "⛓️ Porta di ferro: dietro, uno scudo di pietra e un po' di muffa. Premio in vista."],
      [134, 54, 52, 76, "🪵 Porta di legno: la più educata. Bussa, poi si apre."],
      [216, 54, 52, 76, "🔥 Porta di brace: scotta, ma i premi sono i migliori."],
      [16, 150, 52, 30, "💀 Il coro di scheletri: provano un inno e sbagliano sempre la stessa nota."],
    ] },
    dg_p2: { draw: bgP2, hot: [
      [226, 74, 30, 64, "🗿 Una statua con gli occhiali da sole, già pietrificata. Autoritratto, probabilmente."],
      [66, 108, 24, 34, "🏮 Una lanterna sulla passerella. L'acqua sotto non si muove: aspetta."],
      [0, 110, 320, 60, "💧 L'acqua ferma delle Cisterne. A volte un cerchio sale dal fondo, poi niente."],
      [20, 60, 60, 40, "🕳️ Un arco buio. Dall'interno arriva un fischio acuto, lontano."],
    ] },
    dg_p3: { draw: bgP3, hot: [
      [0, 60, 320, 70, "👥 La Tribuna d'Oro: sagome grigie che applaudono piano. Quando guardi, applaudono più piano."],
      [146, 84, 28, 30, "🏆 Il trofeo del Torneo. Ha il nome inciso, ma è stato grattato via."],
      [124, 56, 72, 88, "🚪 Il portale d'oro. Dietro, qualcosa che respira."],
      [28, 60, 24, 40, "🔥 Una torcia dorata. La luce è calda e ha un retrogusto di tristezza."],
    ] },
    dg_finale: { draw: bgFinale, hot: [
      [120, 170, 20, 20, "⚽ Il pallone. Passa da una mano all'altra, e nessuno ricorda chi l'ha toccato per ultimo."],
      [90, 148, 22, 40, "🧢 Un cappellino da capitano, appoggiato sul bordo del campo."],
      [140, 100, 40, 30, "🌅 L'alba sopra lo Stadio Vecchio. Il cielo cambia colore ogni volta che lo guardi."],
    ] },
  };
  function reg(n) { if (window.__lbBg && window.__lbBg.register) Object.keys(LB).forEach((k) => window.__lbBg.register(k, LB[k])); else if (n < 80) setTimeout(() => reg(n + 1), 150); }
  reg(0);
})();
