// js/capitani-bg.js - sfondi di «CAPITANI DI VENTURA» (320x200): colline, accampamento, borgo, ponte, locanda, fucina. Animati, con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const person = (g, x, y, col, s, hair) => { s = s || 1; R(g, x - 3 * s, y - 10 * s, 6 * s, 10 * s, col); C(g, x, y - 13 * s, 3.2 * s, "#d9a679"); R(g, x - 3.3 * s, y - 16.5 * s, 6.6 * s, 3 * s, hair || "#2a1a10"); R(g, x - 3 * s, y, 2.4 * s, 4 * s, "#2a2a2a"); R(g, x + 0.6 * s, y, 2.4 * s, 4 * s, "#2a2a2a"); };
  const flag = (g, x, y, f, c, h) => { R(g, x, y, 1.5, h || 26, "#5a4630"); g.fillStyle = c; g.beginPath(); g.moveTo(x + 1.5, y + 1); for (let i = 0; i <= 12; i++) g.lineTo(x + 1.5 + i, y + 1 + Math.sin(f / 9 + i / 2) * 1.4); for (let i = 12; i >= 0; i--) g.lineTo(x + 1.5 + i, y + 9 + Math.sin(f / 9 + i / 2) * 1.4); g.fill(); };
  const tent = (g, x, y, w, c, c2) => { T(g, [x, y, x + w / 2, y - w * 0.62, x + w, y], c); T(g, [x + w / 2, y - w * 0.62, x + w, y, x + w * 0.62, y], "rgba(0,0,0,.18)"); T(g, [x + w * 0.4, y, x + w / 2, y - w * 0.3, x + w * 0.6, y], c2 || "#1a1208"); R(g, x + w / 2 - 0.5, y - w * 0.62 - 6, 1, 6, "#4a3a2a"); };
  const stars = (g, f, n, h) => { for (let i = 0; i < n; i++) R(g, rnd(i) * 320, rnd(i + 9) * h, 1, 1, `rgba(255,255,255,${0.3 + 0.6 * Math.abs(Math.sin(f / 30 + i))})`); };
  const hills = (g, W, y, c, a, p) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 8) g.lineTo(x, y + Math.sin(x / (30 + p) + p) * a); g.lineTo(W, 200); g.fill(); };
  const castle = (g, x, y, s, c) => { R(g, x, y, 40 * s, 22 * s, c); R(g, x - 4 * s, y - 10 * s, 12 * s, 32 * s, c); R(g, x + 32 * s, y - 14 * s, 12 * s, 36 * s, c); for (let i = 0; i < 4; i++) { R(g, x + i * 10 * s, y - 3 * s, 5 * s, 3 * s, c); } T(g, [x - 5 * s, y - 10 * s, x + 2 * s, y - 20 * s, x + 9 * s, y - 10 * s], c); T(g, [x + 31 * s, y - 14 * s, x + 38 * s, y - 25 * s, x + 45 * s, y - 14 * s], c); R(g, x + 16 * s, y + 8 * s, 8 * s, 14 * s, "#120c08"); };
  const SC = {
    cv_titolo(g, W, H, f) {
      VG(g, 0, 130, "#3a2a5a", "#ff9a4a"); g.fillRect(0, 0, W, 130); C(g, 230, 96, 26, "#ffe2a0"); GL(g, 230, 96, 110, "255,180,90", 0.5); stars(g, f, 24, 50);
      hills(g, W, 120, "#5a3a4a", 8, 1); castle(g, 36, 98, 1.3, "#3a2438"); hills(g, W, 140, "#3a2a34", 10, 3);
      [[110, 150], [170, 156], [220, 148]].forEach(([x, y], i) => { tent(g, x, y, 34 - i * 2, ["#b91c1c", "#1d4ed8", "#ca8a04"][i]); flag(g, x + 15, y - 38, f + i * 7, ["#ef4444", "#38bdf8", "#facc15"][i], 18); });
      R(g, 0, 160, W, 40, "#2a2024"); for (let i = 0; i < 20; i++) R(g, rnd(i) * W, 160 + (i % 5) * 7, 6, 1, "rgba(255,255,255,.05)");
      GL(g, 160, 176, 40, "255,160,60", 0.45 + Math.sin(f / 5) * 0.05); R(g, 154, 174, 12, 3, "#4a2a14"); T(g, [157, 174, 160, 164 + Math.sin(f / 4) * 2, 163, 174], "#ffb84a"); T(g, [159, 174, 160, 168, 161, 174], "#fff3a0");
      person(g, 130, 182, "#7c2d12", 1.5, "#2a1a10"); person(g, 195, 182, "#14532d", 1.5, "#c8c8c8");
      g.font = "900 20px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff1cc"; g.fillText("CAPITANI DI VENTURA", 160, 30); g.font = "900 11px 'Trebuchet MS', sans-serif"; g.fillStyle = "#fbbf24"; g.fillText("LA COMPAGNIA DELLA RONDINE SCALZA", 160, 46); VIG(g, W, H, 0.4);
    },
    cv_campo(g, W, H, f) {
      VG(g, 0, 120, "#1a1a3a", "#7a3a4a"); g.fillRect(0, 0, W, 120); stars(g, f, 40, 70); C(g, 262, 36, 14, "#f4f0d4"); GL(g, 262, 36, 50, "240,240,200", 0.25);
      hills(g, W, 100, "#241a2e", 10, 2); hills(g, W, 122, "#1a1420", 8, 5); R(g, 0, 138, W, 62, "#2a2018"); for (let i = 0; i < 26; i++) R(g, rnd(i + 3) * W, 140 + (i % 6) * 9, 8, 1, "rgba(255,255,255,.06)");
      tent(g, 20, 150, 56, "#7f1d1d"); tent(g, 244, 150, 52, "#1e3a8a"); tent(g, 88, 126, 36, "#92400e"); flag(g, 52, 96, f, "#ef4444", 22); flag(g, 272, 96, f + 5, "#38bdf8", 22);
      GL(g, 160, 170, 90, "255,150,60", 0.5 + Math.sin(f / 6) * 0.06); R(g, 146, 172, 28, 5, "#3a200e"); for (let i = 0; i < 3; i++) T(g, [150 + i * 9, 173, 155 + i * 9, 158 + Math.sin(f / 4 + i) * 3, 160 + i * 9, 173], ["#ff8a2a", "#ffb84a", "#ff8a2a"][i]);
      for (let i = 0; i < 12; i++) R(g, 156 + Math.sin(f / 10 + i) * 8 + i * 0.5, 160 - ((f * 0.8 + i * 9) % 60), 1, 1, "rgba(255,200,120,.8)");
      person(g, 120, 182, "#7c2d12", 1.5, "#2a1a10"); person(g, 205, 182, "#1d4ed8", 1.5, "#4a2a10"); person(g, 175, 190, "#14532d", 1.7, "#c8c8c8"); VIG(g, W, H, 0.45);
    },
    cv_borgo(g, W, H, f) {
      VG(g, 0, 110, "#7ec0ee", "#fde7b8"); g.fillRect(0, 0, W, 110); for (let i = 0; i < 3; i++) R(g, ((i * 130 + f * 0.1) % 380) - 50, 18 + i * 14, 56, 6, "rgba(255,255,255,.6)");
      R(g, 0, 120, W, 80, "#9a8a70"); for (let y = 124; y < 200; y += 8) for (let x = ((y / 8) % 2) * 8; x < W; x += 16) R(g, x, y, 14, 6, (x + y) % 3 ? "#a89a82" : "#8f806a");
      [[0, 52, 70, "#c9a97a", "#9b3a2a"], [74, 38, 78, "#d9c49a", "#2a4a7a"], [176, 48, 64, "#cdb48a", "#7a3a2a"], [244, 34, 76, "#d6c098", "#3a5a3a"]].forEach(([x, y, w, wall, roof], i) => {
        R(g, x, y + 26, w, 94 - y + 26 - 26 + 4, wall); T(g, [x - 4, y + 26, x + w / 2, y - 4, x + w + 4, y + 26], roof); for (let k = 0; k < Math.floor(w / 26); k++) { R(g, x + 8 + k * 24, y + 40, 9, 12, "#2a2118"); R(g, x + 9 + k * 24, y + 41, 7, 10, i % 2 && f % 200 < 100 ? "#ffd070" : "#3a4a62"); } R(g, x + w / 2 - 5, 100, 10, 20, "#4a2e18"); });
      C(g, 160, 150, 22, "#7a7a82"); C(g, 160, 150, 19, "#3a8ac8"); for (let i = 0; i < 5; i++) R(g, 150 + i * 4, 144 + Math.sin(f / 8 + i) * 2, 3, 1, "rgba(255,255,255,.6)"); R(g, 158, 124, 4, 22, "#8a8a92"); R(g, 154, 124, 12, 4, "#8a8a92");
      R(g, 60, 128, 4, 34, "#5a4630"); R(g, 44, 126, 36, 22, "#d6b678"); R(g, 46, 128, 32, 18, "#f2e2b0"); for (let i = 0; i < 4; i++) R(g, 50, 131 + i * 4, 24, 1, "#8a6a3a");
      flag(g, 20, 70, f, "#ef4444", 22); flag(g, 292, 56, f + 4, "#facc15", 22); person(g, 230, 176, "#1d4ed8", 1.6, "#3a2a1a"); person(g, 100, 182, "#b45309", 1.6, "#1a1a1a"); VIG(g, W, H, 0.25);
    },
    cv_ponte(g, W, H, f) {
      VG(g, 0, 100, "#aac8e4", "#f2e6c8"); g.fillRect(0, 0, W, 100); hills(g, W, 96, "#7a9a6a", 7, 2); hills(g, W, 112, "#5a8a5a", 6, 6);
      R(g, 0, 130, W, 70, "#2f6aa0"); for (let i = 0; i < 20; i++) R(g, ((i * 41 + f * (0.4 + (i % 3) * 0.2)) % (W + 40)) - 20, 134 + (i * 7) % 60, 24, 1.4, "rgba(255,255,255,.35)");
      R(g, 0, 112, 60, 30, "#6a8a4a"); R(g, 260, 112, 60, 30, "#6a8a4a"); R(g, 40, 100, 240, 14, "#8a8a92"); R(g, 40, 100, 240, 3, "#b0b0b8"); for (let i = 0; i < 6; i++) { g.fillStyle = "#6a6a72"; g.beginPath(); g.arc(70 + i * 38, 114, 17, Math.PI, 0); g.fill(); g.fillStyle = "#2f6aa0"; g.beginPath(); g.arc(70 + i * 38, 114, 13, Math.PI, 0); g.fill(); } R(g, 40, 94, 240, 4, "#7a7a82");
      flag(g, 46, 68, f, "#ef4444", 26); flag(g, 266, 68, f + 6, "#1d4ed8", 26); [[110, "#7c2d12"], [150, "#14532d"], [190, "#a16207"]].forEach(([x, c], i) => person(g, x, 100, c, 1.1, ["#2a1a10", "#c8c8c8", "#4a2a10"][i]));
      for (let i = 0; i < 4; i++) R(g, ((i * 90 + f * 0.2) % 360) - 30, 122 + i * 4, 70, 5, "rgba(255,255,255,.18)"); VIG(g, W, H, 0.25);
    },
    cv_locanda(g, W, H, f) {
      VG(g, 0, H, "#2a160c", "#4a2a16"); g.fillRect(0, 0, W, H); for (let i = 0; i < 8; i++) R(g, 10 + i * 42, 0, 5, 150, "#3a2010"); R(g, 0, 20, W, 5, "#3a2010");
      R(g, 110, 40, 100, 80, "#3a2a22"); R(g, 120, 56, 80, 64, "#120804"); for (let i = 0; i < 4; i++) T(g, [134 + i * 16, 118, 142 + i * 16, 90 + Math.sin(f / 5 + i) * 6, 150 + i * 16, 118], i % 2 ? "#ffb84a" : "#ff7a2a"); GL(g, 160, 110, 120, "255,140,50", 0.5 + Math.sin(f / 7) * 0.06);
      R(g, 0, 150, W, 50, "#3a2412"); for (let y = 150; y < 200; y += 7) R(g, 0, y, W, 1, "rgba(0,0,0,.3)"); [[30, 160], [250, 164]].forEach(([x, y]) => { R(g, x, y, 44, 6, "#7a4a22"); R(g, x + 4, y + 6, 4, 22, "#5a3412"); R(g, x + 36, y + 6, 4, 22, "#5a3412"); R(g, x + 10, y - 4, 6, 5, "#c8c8c8"); R(g, x + 26, y - 4, 6, 5, "#e8d0a0"); });
      person(g, 52, 156, "#7c2d12", 1.5, "#2a1a10"); person(g, 272, 160, "#1d4ed8", 1.5, "#c8a050"); [[10, 120], [296, 118]].forEach(([x, y]) => { C(g, x + 8, y + 16, 15, "#7a4a22"); R(g, x, y + 4, 16, 24, "#7a4a22"); for (let i = 0; i < 3; i++) R(g, x, y + 8 + i * 7, 16, 1.5, "#2a1408"); }); VIG(g, W, H, 0.45);
    },
    cv_fucina(g, W, H, f) {
      VG(g, 0, H, "#1a1210", "#3a2018"); g.fillRect(0, 0, W, H); R(g, 0, 150, W, 50, "#2a1c14"); R(g, 190, 60, 100, 90, "#4a3a34"); R(g, 206, 80, 68, 70, "#150a06"); GL(g, 240, 130, 120, "255,120,40", 0.6 + Math.sin(f / 4) * 0.08); for (let i = 0; i < 5; i++) T(g, [214 + i * 12, 148, 220 + i * 12, 118 + Math.sin(f / 4 + i) * 6, 226 + i * 12, 148], i % 2 ? "#ffb84a" : "#ff5a1a");
      R(g, 50, 128, 60, 10, "#4a4a52"); R(g, 62, 138, 36, 12, "#3a3a42"); R(g, 56, 124, 24, 5, "#6a6a72"); R(g, 130, 70, 3, 80, "#3a2a1e"); for (let i = 0; i < 5; i++) R(g, 40 + i * 22, 44 + (i % 2) * 6, 3, 28, "#8a8a92"); const sw = Math.sin(f / 10) * 10; R(g, 60 + sw, 100, 4, 26, "#5a3a1e"); R(g, 54 + sw, 98, 16, 7, "#6a6a72");
      for (let i = 0; i < 8; i++) { const t = (f * 1.5 + i * 25) % 90; R(g, 78 + Math.sin(i * 3) * 14 + t * 0.3, 124 - t * 0.7 + t * t * 0.01, 1.5, 1.5, `rgba(255,${160 + (i * 10) % 80},60,${1 - t / 90})`); }
      person(g, 130, 160, "#7a4a22", 1.7, "#6a6a6a"); VIG(g, W, H, 0.5);
    }
  };
  const HOT = {
    cv_titolo: [[96, 124, 100, 40, "⛺ Le tende della Rondine Scalza: rosse, blu e gialle. Il giallo era quello dei vicini."], [14, 70, 66, 40, "🏰 Pietrabianca: un castello che non ci ha mai pagato. Ma ha le mura più belle."], [150, 164, 20, 18, "🔥 Il falò: la riunione di compagnia comincia sempre qui."]],
    cv_campo: [[140, 154, 50, 30, "🔥 Il falò. Frate Ambrogio dice che la zuppa è «quasi pronta» da tre ore."], [14, 116, 70, 40, "⛺ La tenda della cassa: dentro Isotta tiene i conti. E la bilancia."], [236, 112, 70, 40, "🏳️ Lo stendardo della Rondine: una rondine scalza, perché le scarpe erano care."]],
    cv_borgo: [[40, 126, 44, 30, "📜 La bacheca dei contratti: «CERCASI CAPITANO. ASTENERSI VIGLIACCHI E CREDITORI»."], [138, 128, 44, 30, "⛲ La fontana: la gente ci getta monete, i bambini le ripescano. Un'economia."], [74, 38, 78, 50, "🏠 Le case di Pietrabianca: finestre piccole, tasse grandi."]],
    cv_ponte: [[40, 90, 240, 28, "🌉 Il Ponte Vecchio: sette arcate e un solo modo di attraversarlo, a pedaggio."], [0, 112, 60, 30, "🚩 Lo stendardo del Conte Ruggero: tre rose e un debito."], [100, 134, 120, 50, "🌊 Il fiume: scende veloce, come i conti della compagnia."]],
    cv_locanda: [[110, 40, 100, 80, "🔥 Il camino: arrostisce un cinghiale che, dicono, aveva una zampa corta già da vivo."], [20, 150, 60, 40, "🍺 Un tavolo: boccali, dadi e una discussione sull'onore. Perduta."], [240, 150, 60, 40, "🎲 Un altro tavolo: carte truccate, con garbo."]],
    cv_fucina: [[190, 60, 100, 90, "🔥 La forgia: rossa come una buona notizia, calda come una cattiva."], [50, 120, 70, 36, "⚒️ L'incudine: segnata da mille colpi e da un nome inciso: «PIETRO»."], [36, 40, 110, 34, "🗡️ Spade appese: tutte a metà prezzo. Nessuna a metà lunghezza."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
