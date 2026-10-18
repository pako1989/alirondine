// js/carte-bg.js - sfondi di «Carte del Destino · Cronache del Molo» (320x200: mare, legno, lanterne, gabbiani animati).
// Registrati con window.__lbBg.register. Ogni sfondo ha 3-4 punti cliccabili [x, y, larghezza, altezza, frase].
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const gull = (g, x, y, f, s) => { const w = Math.sin(f / 5 + x) * 3 * s; g.strokeStyle = "#f8fafc"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x - 7 * s, y + w); g.quadraticCurveTo(x - 3 * s, y - 3 * s, x, y); g.quadraticCurveTo(x + 3 * s, y - 3 * s, x + 7 * s, y + w); g.stroke(); };
  const sea = (g, W, y0, f, a, b) => { VG(g, y0, 200, a, b); g.fillRect(0, y0, W, 200 - y0); for (let i = 0; i < 16; i++) { const y = y0 + 6 + i * 6 + (i * 3 % 5), x = (i * 53 + f * (0.3 + (i % 3) * 0.15)) % (W + 60) - 30; R(g, x, y, 26 + (i % 4) * 8, 1.4, "rgba(255,255,255,.22)"); } };
  const boat = (g, x, y, s, c, f) => { g.save(); g.translate(x, y + Math.sin(f / 30 + x) * 1.2); g.scale(s, s); g.fillStyle = c; g.beginPath(); g.moveTo(-24, 0); g.lineTo(24, 0); g.lineTo(16, 10); g.lineTo(-16, 10); g.fill(); R(g, -24, -2, 48, 3, "#f8fafc"); R(g, -1, -34, 2, 34, "#3a2c1e"); g.fillStyle = "#fff7e6"; g.beginPath(); g.moveTo(1, -32); g.lineTo(18, -6); g.lineTo(1, -6); g.fill(); g.restore(); };
  const person = (g, x, y, col, s, hair) => { s = s || 1; R(g, x - 3 * s, y - 10 * s, 6 * s, 10 * s, col); C(g, x, y - 13 * s, 3.2 * s, "#d9a679"); R(g, x - 3.3 * s, y - 16.5 * s, 6.6 * s, 3 * s, hair || "#2a1a10"); R(g, x - 3 * s, y, 2.4 * s, 5 * s, "#2a3040"); R(g, x + 0.6 * s, y, 2.4 * s, 5 * s, "#2a3040"); };
  const lantern = (g, x, y, f, i) => { R(g, x - 0.5, y - 14, 1, 10, "#3a3a3a"); R(g, x - 4, y - 4, 8, 9, "#fcd34d"); R(g, x - 3, y - 3, 6, 7, "#fff7d1"); GL(g, x, y, 28, "255,214,130", 0.5 + Math.sin(f / 30 + i) * 0.06); };
  const SC = {
    ct_titolo(g, W, H, f) {
      VG(g, 0, 110, "#1d2a5a", "#f59e0b"); g.fillRect(0, 0, W, 110); C(g, 230, 90, 24, "#fde68a"); GL(g, 230, 90, 90, "255,200,100", 0.4);
      for (let i = 0; i < 30; i++) R(g, rnd(i) * W, rnd(i + 5) * 60, 1, 1, `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(f / 25 + i))})`);
      sea(g, W, 108, f, "#2b5d86", "#0e2a44"); GL(g, 230, 118, 70, "255,200,100", 0.22);
      R(g, 0, 140, W, 60, "#7a5a3a"); for (let i = 0; i < 9; i++) { R(g, 0, 140 + i * 7, W, 1, "rgba(0,0,0,.35)"); } for (let i = 0; i < 24; i++) R(g, i * 14 + (i % 2) * 6, 140 + (i % 8) * 7, 1, 7, "rgba(0,0,0,.25)"); R(g, 0, 140, W, 2, "#a8844a");
      R(g, 96, 130, 128, 8, "#2f7a4a"); R(g, 100, 136, 120, 4, "#1d5a36");
      [[118, "#ef4444", -0.28], [150, "#fbbf24", -0.05], [182, "#38bdf8", 0.2]].forEach(([x, c, r], i) => { g.save(); g.translate(x, 122 + Math.sin(f / 30 + i) * 2); g.rotate(r); R(g, -14, -20, 28, 40, "#fff7e6"); R(g, -12, -18, 24, 36, c); C(g, 0, 0, 8, "rgba(255,255,255,.55)"); g.restore(); });
      boat(g, 60, 128, 0.9, "#b45309", f); boat(g, 270, 122, 0.7, "#1d4ed8", f); lantern(g, 20, 160, f, 0); lantern(g, 300, 160, f, 1);
      [[100, 40, 1], [180, 28, 1.3], [250, 50, 0.9]].forEach(([x, y, s], i) => gull(g, (x + f * 0.4 * s) % 360 - 20, y + Math.sin(f / 40 + i) * 4, f, s));
      g.font = "900 22px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff7d1"; g.fillText("CARTE DEL DESTINO", 160, 30); g.fillStyle = "#fbbf24"; g.font = "900 13px 'Trebuchet MS', sans-serif"; g.fillText("CRONACHE DEL MOLO", 160, 48); g.textAlign = "left"; VIG(g, W, H, 0.35);
    },
    ct_molo(g, W, H, f) {
      VG(g, 0, 100, "#5aa0d8", "#fde7b8"); g.fillRect(0, 0, W, 100); C(g, 70, 40, 18, "#fff7d1"); GL(g, 70, 40, 80, "255,240,190", 0.3);
      for (let i = 0; i < 3; i++) R(g, ((i * 130 + f * 0.12) % 380) - 50, 20 + i * 14, 60, 6, "rgba(255,255,255,.5)");
      sea(g, W, 96, f, "#3b8fc4", "#175a8c"); boat(g, 250, 108, 0.8, "#dc2626", f); boat(g, 60, 112, 0.6, "#16a34a", f);
      R(g, 0, 130, W, 70, "#8a6a3e"); for (let i = 0; i < 10; i++) R(g, 0, 130 + i * 7, W, 1, "rgba(0,0,0,.3)"); for (let i = 0; i < 26; i++) R(g, i * 13 + (i % 2) * 5, 130 + (i % 9) * 7, 1, 7, "rgba(0,0,0,.22)"); R(g, 0, 130, W, 2, "#b08a50");
      R(g, 100, 120, 120, 36, "#2f7a4a"); R(g, 100, 120, 120, 3, "#4aa066"); R(g, 104, 154, 6, 28, "#4a3220"); R(g, 210, 154, 6, 28, "#4a3220");
      [[122, "#ef4444"], [150, "#fbbf24"], [178, "#38bdf8"]].forEach(([x, c], i) => { g.save(); g.translate(x, 138); g.rotate((i - 1) * 0.2); R(g, -10, -14, 20, 28, "#fff7e6"); R(g, -8, -12, 16, 24, c); g.restore(); });
      person(g, 160, 118, "#b45309", 1.5, "#cfcfcf"); R(g, 154, 100, 12, 4, "#92400e");
      [40, 280].forEach((x, i) => { R(g, x - 2, 80, 4, 62, "#5a4630"); lantern(g, x, 84, f, i); }); person(g, 70, 175, "#2563eb", 1.6, "#1a1a1a");
      [[90, 30], [180, 24], [250, 40]].forEach(([x, y], i) => gull(g, (x + f * 0.5) % 340 - 10, y + Math.sin(f / 40 + i) * 4, f, 1)); VIG(g, W, H, 0.3);
    },
    ct_bar(g, W, H, f) {
      VG(g, 0, H, "#2a160c", "#4a2a16"); g.fillRect(0, 0, W, H); for (let i = 0; i < 40; i++) R(g, i * 8, 0, 1, 130, "rgba(255,200,120,.05)");
      R(g, 0, 130, W, 70, "#5e4126"); for (let i = 0; i < 8; i++) R(g, 0, 130 + i * 9, W, 1, "rgba(0,0,0,.35)");
      R(g, 20, 20, 280, 70, "#2a1810"); for (let r = 0; r < 3; r++) { R(g, 20, 40 + r * 22, 280, 3, "#6b4a2a"); for (let k = 0; k < 22; k++) { const h = 12 + rnd(r * 31 + k) * 6, c = ["#16a34a", "#92400e", "#dc2626", "#2563eb", "#fbbf24"][(k + r) % 5]; R(g, 24 + k * 12.5, 40 + r * 22 - h, 6, h, c); R(g, 25 + k * 12.5, 40 + r * 22 - h - 3, 4, 3, "#e5e7eb"); R(g, 24 + k * 12.5, 40 + r * 22 - h, 2, h, "rgba(255,255,255,.25)"); } }
      R(g, 10, 100, 300, 34, "#5a3a22"); R(g, 6, 94, 308, 8, "#8a5a30"); R(g, 6, 94, 308, 1, "#d49a50"); GL(g, 160, 80, 150, "255,190,110", 0.28);
      [60, 160, 260].forEach((x, i) => lantern(g, x, 14, f, i)); person(g, 160, 104, "#f1f5f9", 1.5, "#2a1a10"); R(g, 150, 96, 20, 3, "#e5e7eb");
      R(g, 232, 70, 56, 22, "#14532d"); R(g, 234, 72, 52, 18, "#1c1917"); g.font = "700 6px monospace"; g.fillStyle = "#fde68a"; g.fillText("CAFFÈ 1", 240, 82); g.fillText("CAFFÈ 3 (*)", 240, 90);
      [[40, 160], [110, 170], [250, 168]].forEach(([x, y], i) => { C(g, x, y, 14, "#6a4a2c"); R(g, x - 2, y, 4, 20, "#3a2a1c"); person(g, x + (i - 1) * 6, y - 2, ["#dc2626", "#16a34a", "#7c3aed"][i], 1.2, "#2a1a10"); });
      for (let i = 0; i < 22; i++) R(g, (i * 41 + f * 0.2) % W, (i * 59 + f * 0.1) % 190, 1.4, 1.4, "rgba(255,230,170,.35)"); VIG(g, W, H, 0.5);
    },
    ct_mercato(g, W, H, f) {
      VG(g, 0, 90, "#2a4a7a", "#f5b97a"); g.fillRect(0, 0, W, 90); C(g, 250, 70, 20, "#ffe9a0"); GL(g, 250, 70, 90, "255,210,150", 0.4);
      sea(g, W, 84, f, "#4a86b0", "#1e4a70"); R(g, 0, 108, W, 92, "#a5a5ab"); for (let i = 0; i < 10; i++) { R(g, 0, 108 + i * 9, W, 1, "rgba(0,0,0,.2)"); } for (let i = 0; i < 24; i++) R(g, i * 14 + ((i >> 1) % 2) * 7, 108, 1, 92, "rgba(0,0,0,.1)");
      [[20, "#dc2626"], [120, "#2563eb"], [220, "#16a34a"]].forEach(([x, c], i) => { for (let k = 0; k < 80; k += 16) { R(g, x + k, 74, 8, 18, c); R(g, x + k + 8, 74, 8, 18, "#fff7e6"); } R(g, x, 92, 80, 4, "rgba(0,0,0,.3)"); R(g, x + 2, 96, 4, 28, "#4a3220"); R(g, x + 74, 96, 4, 28, "#4a3220"); R(g, x + 4, 108, 72, 18, "#7a5a3a"); R(g, x + 4, 108, 72, 2, "#a8844a"); for (let k = 0; k < 6; k++) { g.save(); g.translate(x + 12 + k * 11, 108); R(g, -4, -5, 8, 5, ["#93c5fd", "#fca5a5", "#fde68a"][(k + i) % 3]); C(g, 3, -3, 1, "#111"); g.restore(); } });
      person(g, 90, 175, "#0ea5e9", 1.6, "#2a1a10"); person(g, 200, 170, "#ea580c", 1.4, "#555"); R(g, 240, 150, 60, 30, "#7a5a3a"); R(g, 242, 138, 56, 14, "#dbeafe");
      [[60, 30], [150, 26], [260, 40], [200, 50]].forEach(([x, y], i) => gull(g, (x + f * 0.6 * (1 + i * 0.2)) % 340 - 10, y + Math.sin(f / 30 + i) * 5, f, 1)); VIG(g, W, H, 0.3);
    },
    ct_cantiere(g, W, H, f) {
      VG(g, 0, 120, "#7aaed8", "#fde8c0"); g.fillRect(0, 0, W, 120); for (let i = 0; i < 3; i++) R(g, ((i * 140 + f * 0.1) % 380) - 50, 18 + i * 16, 70, 6, "rgba(255,255,255,.55)");
      sea(g, W, 100, f, "#4a8ab8", "#235c88"); R(g, 0, 130, W, 70, "#b89a68"); for (let i = 0; i < 20; i++) R(g, rnd(i) * W, 135 + rnd(i + 3) * 60, 3, 1, "rgba(0,0,0,.18)");
      R(g, 240, 20, 6, 112, "#d4a02a"); R(g, 150, 22, 100, 5, "#d4a02a"); for (let i = 0; i < 12; i++) R(g, 240, 24 + i * 9, 6, 1, "rgba(0,0,0,.3)"); const sw = Math.sin(f / 40) * 6; R(g, 160 + sw, 27, 1, 40, "#1c1917"); R(g, 154 + sw, 66, 14, 10, "#6b7280");
      g.fillStyle = "#8a5a30"; g.beginPath(); g.moveTo(20, 152); g.lineTo(190, 152); g.lineTo(170, 126); g.lineTo(60, 126); g.fill(); for (let i = 0; i < 6; i++) R(g, 24 + i * 5, 130 + i * 4, 150 - i * 12, 1, "rgba(0,0,0,.3)"); for (let i = 0; i < 12; i++) R(g, 62 + i * 9, 126, 1, 26, "rgba(0,0,0,.25)"); R(g, 56, 152, 6, 24, "#4a3220"); R(g, 170, 152, 6, 24, "#4a3220");
      person(g, 230, 176, "#16a34a", 1.6, "#1a1a1a"); R(g, 260, 160, 40, 20, "#7a5a3a"); R(g, 262, 150, 36, 12, "#94a3b8"); for (let i = 0; i < 20; i++) R(g, (i * 41 + f * 0.5) % W, 150 + (i * 13) % 40, 1.5, 1.5, "rgba(240,210,150,.6)"); VIG(g, W, H, 0.3);
    },
    ct_faro(g, W, H, f) {
      VG(g, 0, 120, "#2a1a5a", "#ff8a4a"); g.fillRect(0, 0, W, 120); C(g, 70, 100, 22, "#ffd9a0"); GL(g, 70, 100, 100, "255,150,80", 0.5);
      for (let i = 0; i < 3; i++) R(g, ((i * 120 + f * 0.15) % 380) - 50, 20 + i * 18, 80, 6, "rgba(255,170,110,.35)");
      sea(g, W, 110, f, "#6a3a6a", "#1a1a3a"); GL(g, 70, 120, 60, "255,180,100", 0.25);
      g.fillStyle = "#1f1f2a"; g.beginPath(); g.moveTo(0, 200); g.lineTo(0, 150); g.lineTo(60, 140); g.lineTo(110, 160); g.lineTo(170, 130); g.lineTo(240, 150); g.lineTo(320, 136); g.lineTo(320, 200); g.fill();
      R(g, 206, 40, 34, 100, "#f1ece0"); for (let i = 0; i < 4; i++) R(g, 206, 52 + i * 22, 34, 11, "#dc2626"); R(g, 232, 40, 8, 100, "rgba(0,0,0,.16)"); R(g, 200, 34, 46, 8, "#374151"); R(g, 208, 18, 30, 18, "#fde68a"); R(g, 206, 14, 34, 5, "#374151"); R(g, 222, 8, 2, 8, "#374151");
      const a = f / 60, bx = 223, by = 27; g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createLinearGradient(bx, by, bx + Math.cos(a) * 220, by + Math.sin(a) * 60); gr.addColorStop(0, "rgba(255,240,170,.55)"); gr.addColorStop(1, "rgba(255,240,170,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(a - 0.1) * 300, by + Math.sin(a - 0.1) * 100); g.lineTo(bx + Math.cos(a + 0.1) * 300, by + Math.sin(a + 0.1) * 100); g.fill(); g.restore(); GL(g, bx, by, 40, "255,240,170", 0.6);
      R(g, 214, 110, 18, 30, "#120a08"); R(g, 214, 110, 18, 2, "#d9a640"); person(g, 150, 160, "#7c2d12", 1.6, "#e5e7eb"); R(g, 140, 150, 4, 12, "#78350f");
      [[60, 50], [130, 36], [260, 70]].forEach(([x, y], i) => gull(g, (x + f * 0.5) % 340 - 10, y + Math.sin(f / 40 + i) * 4, f, 1)); VIG(g, W, H, 0.4);
    }
  };
  const HOT = {
    ct_titolo: [[96, 112, 128, 44, "🎴 Le carte del Molo: rosso, giallo, azzurro. Nessuna sa cosa dirà, finché non la giri."], [20, 106, 80, 40, "⛵ La barca del Barone Tonno: un nome così lungo che non entra nello scafo."], [226, 14, 80, 30, "🌙 La luna sul mare: l'unica che non bara."], [10, 148, 40, 40, "🏮 La lanterna del molo: accesa per chi arriva tardi."]],
    ct_molo: [[100, 114, 120, 50, "🎴 Il tavolo verde di Zio Ormeggio: ogni carta una storia, ogni storia un prezzo."], [10, 76, 70, 70, "🏮 Una lanterna: a sera illumina il mazzo, di giorno solo la polvere."], [220, 98, 90, 30, "⛵ Barche ormeggiate: una si chiama «Ancora una»."], [60, 150, 60, 40, "🧍 Un pescatore con le mani in tasca: sta aspettando che qualcuno peschi per lui."]],
    ct_bar: [[20, 20, 280, 70, "🍾 Bottiglie: un'etichetta dice «Vecchio Molo», un'altra «Giovane Molo». Per il resto, sono uguali."], [10, 94, 300, 40, "☕ Il bancone: macchie, gettoni, un biglietto «CHI LEGGE PAGA»."], [232, 70, 56, 22, "📋 La lavagna dei prezzi: il caffè costa 1, o 3 se te lo senti."], [20, 150, 240, 40, "🪑 I tavolini: alla scacchiera manca un re, e nessuno ammette di averlo preso."]],
    ct_mercato: [[20, 74, 80, 60, "🐟 Bancarella rossa: pesce fresco. Dice il cartello. Il pesce non è d'accordo."], [120, 74, 80, 60, "🐙 Bancarella blu: polpi, ghiaccio e un cartello «NON È MIO»."], [220, 74, 80, 60, "🦐 Bancarella verde: gamberi che sembrano aver visto cose."], [240, 138, 56, 40, "🧊 Casse di ghiaccio: in estate, la cosa più preziosa del molo."]],
    ct_cantiere: [[20, 124, 170, 54, "🛶 Uno scafo a metà: sembra una balena che ha cambiato idea."], [236, 18, 60, 116, "🏗️ La gru: cigola in tre note, a seconda del vento."], [256, 146, 50, 40, "📦 Casse di chiodi e corde. In fondo, un panino che qualcuno ha dimenticato."], [210, 164, 40, 30, "🧑‍🔧 Un carpentiere con la matita dietro l'orecchio: sta misurando una cosa che non c'è."]],
    ct_faro: [[200, 8, 50, 134, "🔦 Il faro: bianco e rosso come un caramello alto quaranta metri."], [10, 140, 180, 50, "🪨 Gli scogli: qualcuno ci ha scritto «ANCHE QUI» con un gessetto."], [210, 106, 24, 36, "🚪 La porta del faro: chiusa, e con un campanello che nessuno sa a chi suoni."], [120, 140, 70, 50, "🕯️ La Signora Lanterna: guarda il mare con la calma di chi sa già come va a finire."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
