// js/rotta-bg.js - sfondi di «ROTTA 66» (320x200): titolo (pullman al tramonto), strada di montagna, lago, stadio di provincia. Animati, con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const hills = (g, W, y, c, a, p) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 8) g.lineTo(x, y + Math.sin(x / (30 + p) + p) * a); g.lineTo(W, 200); g.fill(); };
  const bus = (g, x, y, f, s) => { s = s || 1; R(g, x, y, 90 * s, 28 * s, "#d97706"); R(g, x, y + 18 * s, 90 * s, 4 * s, "#7c2d12"); for (let i = 0; i < 6; i++) R(g, x + 6 * s + i * 14 * s, y + 4 * s, 10 * s, 9 * s, "#bae6fd"); R(g, x + 80 * s, y + 4 * s, 8 * s, 14 * s, "#bae6fd"); C(g, x + 18 * s, y + 29 * s, 5 * s, "#1a1a1a"); C(g, x + 70 * s, y + 29 * s, 5 * s, "#1a1a1a"); GL(g, x + 92 * s, y + 22 * s, 30, "255,240,160", 0.35 + Math.sin(f / 9) * 0.04); };
  const SC = {
    ro_titolo(g, W, H, f) {
      VG(g, 0, 130, "#3a2a5a", "#ff9a4a"); g.fillRect(0, 0, W, 130); C(g, 70, 98, 26, "#ffe2a0"); GL(g, 70, 98, 110, "255,180,90", 0.5);
      hills(g, W, 112, "#5a3a4a", 10, 1); hills(g, W, 132, "#3a2a34", 8, 3);
      R(g, 0, 152, W, 48, "#2a2428"); for (let i = 0; i < 10; i++) R(g, 10 + i * 34 - (f * 0.8) % 34, 176, 18, 2, "#e5e7eb");
      bus(g, 130 + Math.sin(f / 40) * 2, 140, f, 1.2);
      g.font = "900 22px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fff1cc"; g.fillText("ROTTA 66", 160, 30); g.font = "900 10px Georgia, serif"; g.fillStyle = "#fbbf24"; g.fillText("IL GIGANTE STANCO · TERZA CATEGORIA", 160, 46); VIG(g, W, H, 0.4);
    },
    ro_strada(g, W, H, f) {
      VG(g, 0, 110, "#7ec0ee", "#fde7b8"); g.fillRect(0, 0, W, 110); for (let i = 0; i < 3; i++) R(g, ((i * 130 + f * 0.1) % 380) - 50, 18 + i * 14, 56, 6, "rgba(255,255,255,.6)");
      hills(g, W, 84, "#6a8a9a", 14, 2); hills(g, W, 104, "#4a7a5a", 12, 4); R(g, 0, 128, W, 72, "#6a6a72");
      for (let i = 0; i < 8; i++) R(g, 10 + i * 44 - (f * 1.2) % 44, 166, 26, 3, "#f4f0e4"); bus(g, 110, 126, f, 1.1); VIG(g, W, H, 0.3);
    },
    ro_lago(g, W, H, f) {
      VG(g, 0, 90, "#f3b57a", "#fde7b8"); g.fillRect(0, 0, W, 90); C(g, 250, 52, 18, "#fff3c0"); hills(g, W, 80, "#4a6a8a", 12, 2);
      R(g, 0, 100, W, 100, "#3a86b8"); for (let i = 0; i < 26; i++) R(g, (rnd(i) * W + f * 0.4) % W, 106 + (i % 8) * 11, 14 + (i % 3) * 6, 1, "rgba(255,255,255,.4)");
      R(g, 40, 140, 100, 6, "#7a5a32"); for (let i = 0; i < 6; i++) R(g, 44 + i * 16, 146, 3, 22, "#4a3220"); R(g, 190, 128 + Math.sin(f / 18) * 2, 60, 10, "#8a5a30"); T(g, [200, 128, 220, 98, 240, 128], "#f4f0e4"); VIG(g, W, H, 0.3);
    },
    ro_stadio(g, W, H, f) {
      VG(g, 0, 90, "#7ec0ee", "#fde7b8"); g.fillRect(0, 0, W, 90); R(g, 0, 90, W, 110, "#2f7d3e"); for (let i = 0; i < 12; i++) R(g, i * 28, 90, 14, 110, "rgba(255,255,255,.04)");
      R(g, 0, 60, W, 34, "#5a5a64"); for (let i = 0; i < 120; i++) R(g, rnd(i + 3) * W, 62 + rnd(i + 5) * 30, 2, 2, ["#b91c1c", "#f4f0e4", "#1d4ed8", "#facc15"][i % 4]);
      R(g, 20, 140, 280, 2, "#f4f0e4"); R(g, 150, 120, 2, 80, "#f4f0e4"); bus(g, 20, 150, f, 0.8); R(g, 232, 134, 60, 4, "#fff"); VIG(g, W, H, 0.3);
    }
  };
  const HOT = {
    ro_titolo: [[130, 140, 110, 38, "🚌 Il Gigante Stanco: trentadue posti, quarantotto con il corridoio."], [30, 80, 60, 40, "🌇 Il sole: ogni sera sembra l'ultimo, e ogni mattina smentisce."], [0, 150, 320, 40, "🛣️ La strada: il vero capitano della squadra."]],
    ro_strada: [[110, 126, 100, 36, "🚌 Il pullman: tossisce in salita, russa in discesa."], [0, 124, 320, 40, "🛣️ La strada del Passo: sette tornanti e un'opinione per ognuno."], [200, 40, 90, 44, "⛰️ Il Passo del Gigante: nome più grande della cima."]],
    ro_lago: [[40, 140, 100, 28, "⚓ Il pontile: assi che parlano, soprattutto se le pesti."], [190, 120, 60, 30, "⛵ La barca del traghetto: parte quando è pronta, o quando ha fame."], [0, 100, 320, 30, "🌊 Il lago: dice di essere un mare ma non convince nessuno."]],
    ro_stadio: [[0, 60, 320, 34, "🏟️ La tribuna: milleduecento persone che hanno già deciso chi vincerà."], [20, 150, 80, 34, "🚌 Il pullman parcheggiato in doppia fila, come un vecchio campione."], [140, 124, 20, 70, "⚪ La linea di metà campo: due metri di calce, tutta la differenza."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
