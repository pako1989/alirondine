// js/compagnia-bg.js - sfondi di «LA COMPAGNIA DEL PALLONE SPEZZATO» (320x200): titolo (stendardo e campo di battaglia), accampamento al falò, tenda di guerra, borgo dei mulini, locanda. Animati, con punti
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const hills = (g, W, y, c, a, p) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 6) g.lineTo(x, y - Math.abs(Math.sin(x / (26 + p) + p)) * a); g.lineTo(W, 200); g.fill(); };
  const tent = (g, x, y, w, h, c, c2) => { T(g, [x, y + h, x + w / 2, y, x + w, y + h], c); T(g, [x + w / 2, y, x + w, y + h, x + w / 2 + 3, y + h], c2); T(g, [x + w / 2 - 5, y + h, x + w / 2, y + h - 12, x + w / 2 + 5, y + h], "#1c1208"); R(g, x + w / 2 - 0.5, y - 8, 1, 8, "#5b3a1a"); T(g, [x + w / 2, y - 8, x + w / 2 + 8, y - 5, x + w / 2, y - 2], "#b91c1c"); };
  const fire = (g, x, y, f, s) => { for (let i = 0; i < 5; i++) { const h = (10 + 6 * Math.sin(f / 5 + i * 2)) * s; T(g, [x - 5 * s + i * 2.4 * s, y, x - 3 * s + i * 2.4 * s, y - h, x - 1 * s + i * 2.4 * s, y], i % 2 ? "#fbbf24" : "#f97316"); } GL(g, x, y - 6, 60 * s, "255,150,60", 0.4 + 0.12 * Math.sin(f / 4)); };
  const house = (g, x, y, w, h, roof, lit) => { R(g, x, y, w, h, "#d8c7a6"); R(g, x, y + h - 2, w, 2, "rgba(0,0,0,.25)"); T(g, [x - 3, y, x + w + 3, y, x + w / 2, y - h * 0.6], roof); R(g, x + w * 0.2, y + h * 0.35, 5, 6, lit ? "#fde68a" : "#334155"); R(g, x + w * 0.6, y + h * 0.35, 5, 6, lit ? "#fde68a" : "#334155"); R(g, x + w / 2 - 3, y + h - 10, 6, 10, "#5b3a1a"); };
  const SC = {
    cp_titolo(g, W, H, f) {
      VG(g, 0, 140, "#2a1740", "#f59e0b"); g.fillRect(0, 0, W, 140); C(g, 240, 96, 24, "#fde68a"); GL(g, 240, 96, 120, "255,170,60", 0.55);
      for (let i = 0; i < 4; i++) R(g, ((i * 100 + f * 0.1) % 360) - 40, 14 + i * 15, 60, 5, "rgba(255,200,140,.45)");
      hills(g, W, 120, "#4a2a46", 26, 3); hills(g, W, 138, "#2a1830", 16, 1);
      R(g, 0, 150, W, 50, "#3b3a1f"); for (let i = 0; i < 40; i++) R(g, rnd(i) * W, 152 + rnd(i + 7) * 46, 3, 1, "#55541f");
      R(g, 0, 160, W, 2, "rgba(255,255,255,.35)"); R(g, 150, 150, 2, 44, "rgba(255,255,255,.25)"); C(g, 151, 172, 10, "rgba(255,255,255,0)");
      // lance e stendardi
      for (let i = 0; i < 6; i++) { const x = 30 + i * 52, w = Math.sin(f / 12 + i) * 2; R(g, x, 96 + (i % 2) * 8, 2, 64, "#3b2a1a"); T(g, [x + 2, 98 + (i % 2) * 8, x + 22 + w, 102 + (i % 2) * 8, x + 2, 112 + (i % 2) * 8], i % 2 ? "#b91c1c" : "#1d4ed8"); }
      // pallone spezzato
      C(g, 160, 168, 13, "#f5f5f4"); T(g, [160, 155, 172, 168, 160, 172, 148, 168], "#1c1917"); R(g, 158, 154, 4, 28, "rgba(0,0,0,.7)"); T(g, [158, 154, 162, 154, 164, 182, 156, 182], "#2a1830");
      g.textAlign = "center"; g.font = "900 20px 'Georgia', serif"; g.fillStyle = "#fde68a"; g.fillText("LA COMPAGNIA", 160, 34); g.font = "900 17px 'Georgia', serif"; g.fillStyle = "#f1f5f9"; g.fillText("DEL PALLONE SPEZZATO", 160, 56);
      VIG(g, W, H, 0.4);
    },
    cp_campo(g, W, H, f) {
      VG(g, 0, 110, "#12172e", "#4a3a5a"); g.fillRect(0, 0, W, 110); for (let i = 0; i < 40; i++) R(g, rnd(i + 3) * W, rnd(i + 20) * 80, 1, 1, `rgba(255,255,255,${0.3 + 0.3 * Math.sin(f / 18 + i)})`);
      C(g, 60, 36, 14, "#e5e7eb"); hills(g, W, 104, "#1a2036", 22, 2); hills(g, W, 120, "#10151f", 14, 5);
      R(g, 0, 128, W, 72, "#2e3a22"); for (let i = 0; i < 40; i++) R(g, rnd(i + 5) * W, 130 + rnd(i + 9) * 68, 3, 1, "#3d4b2c");
      tent(g, 20, 100, 70, 40, "#7c2d12", "#5b2010"); tent(g, 220, 104, 64, 36, "#475569", "#334155"); tent(g, 120, 94, 56, 34, "#854d0e", "#6b3f0b");
      R(g, 100, 140, 1, 1, "#000"); fire(g, 160, 164, f, 1.2);
      for (let i = 0; i < 8; i++) { const t = (f * 0.7 + i * 30) % 120; R(g, 156 + Math.sin(i * 2 + f / 20) * 8, 150 - t * 0.7, 1, 1, `rgba(255,${150 + i * 10},60,${1 - t / 120})`); }
      R(g, 140, 170, 40, 5, "#4a3320"); R(g, 130, 172, 8, 6, "#6b4a2a"); R(g, 182, 172, 8, 6, "#6b4a2a");
      R(g, 270, 100, 2, 50, "#3b2a1a"); T(g, [272, 102, 296 + Math.sin(f / 10) * 3, 108, 272, 120], "#9a3412");
      VIG(g, W, H, 0.4);
    },
    cp_tenda(g, W, H, f) {
      VG(g, 0, 200, "#3a2410", "#6b4a2a"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 16; i++) R(g, i * 20, 0, 2, 200, "rgba(0,0,0,.12)");
      R(g, 0, 150, W, 50, "#4a3320"); R(g, 30, 90, 260, 50, "#7a5a36"); R(g, 30, 90, 260, 4, "#a67c4a");
      R(g, 50, 96, 90, 30, "#e7d6a8"); for (let i = 0; i < 6; i++) R(g, 56 + i * 14, 102 + (i % 2) * 6, 8, 2, "#7c2d12"); C(g, 120, 112, 4, "#1d4ed8"); R(g, 160, 100, 26, 20, "#9ca3af"); R(g, 190, 104, 14, 14, "#78350f");
      C(g, 250, 110, 8, "#f5f5f4"); T(g, [250, 102, 258, 110, 250, 114, 242, 110], "#1c1917");
      const sw = Math.sin(f / 30) * 3; R(g, 158 + sw, 0, 1, 40, "#111"); R(g, 150 + sw, 40, 17, 8, "#92400e"); GL(g, 158 + sw, 46, 90, "255,190,100", 0.4 + 0.1 * Math.sin(f / 7));
      T(g, [250, 20, 296, 20, 296, 76, 273, 66, 250, 76], "#b91c1c"); R(g, 250, 20, 46, 3, "#fcd34d"); C(g, 273, 42, 8, "#f5f5f4");
      VIG(g, W, H, 0.45);
    },
    cp_mulini(g, W, H, f) {
      VG(g, 0, 110, "#7aa9d6", "#f6e3b4"); g.fillRect(0, 0, W, 110); for (let i = 0; i < 3; i++) R(g, ((i * 120 + f * 0.15) % 380) - 40, 16 + i * 14, 60, 5, "rgba(255,255,255,.85)");
      hills(g, W, 104, "#6f9a7c", 28, 2); hills(g, W, 120, "#4a7a56", 18, 4); R(g, 0, 130, W, 70, "#6a8a46");
      [[16, 104, 34, 26, "#9b2a2a"], [64, 108, 30, 22, "#3a5a8a"], [250, 100, 40, 30, "#9b2a2a"]].forEach(([x, y, w, h, c], i) => house(g, x, y, w, h, c, i !== 1));
      // fiume
      VG(g, 130, 200, "#4aa3d8", "#16507a"); g.fillRect(0, 140, W, 28); for (let i = 0; i < 18; i++) R(g, (i * 37 + f * (0.8 + (i % 3) * 0.2)) % 340 - 10, 144 + (i % 4) * 6, 14, 1, "rgba(255,255,255,.55)");
      // mulino con ruota
      R(g, 110, 76, 50, 62, "#d8c7a6"); T(g, [104, 78, 166, 78, 135, 50], "#7c2d12"); R(g, 126, 112, 14, 26, "#5b3a1a"); R(g, 118, 90, 8, 10, "#fde68a");
      const cx = 176, cy = 136; C(g, cx, cy, 20, "#6b4a2a"); C(g, cx, cy, 16, "#4aa3d8"); for (let i = 0; i < 8; i++) { const a = f / 25 + i * Math.PI / 4; R(g, cx + Math.cos(a) * 18 - 2, cy + Math.sin(a) * 18 - 2, 5, 5, "#8b5a2b"); R(g, cx + Math.cos(a) * 9 - 1, cy + Math.sin(a) * 9 - 1, 2, 2, "#8b5a2b"); }
      // ponte chiusa
      R(g, 206, 146, 80, 6, "#7a5a36"); for (let i = 0; i < 9; i++) R(g, 206 + i * 9, 140, 2, 10, "#5b3a1a"); R(g, 238, 130, 20, 20, "rgba(0,0,0,0)"); R(g, 236, 128, 2, 22, "#3b2a1a"); R(g, 254, 128, 2, 22, "#3b2a1a"); R(g, 236, 128, 20, 3, "#b91c1c");
      R(g, 0, 168, W, 32, "#5a7a3a"); VIG(g, W, H, 0.25);
    },
    cp_locanda(g, W, H, f) {
      VG(g, 0, 200, "#2a1a0e", "#5a3a1c"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 6; i++) R(g, 0, i * 8, W, 3, "#1a0f06");
      for (let i = 0; i < 5; i++) R(g, 20 + i * 66, 0, 8, 60, "#1a0f06");
      R(g, 0, 150, W, 50, "#4a2f18"); for (let i = 0; i < 12; i++) R(g, i * 28, 150, 1, 50, "rgba(0,0,0,.25)");
      // camino
      R(g, 200, 70, 90, 80, "#57534e"); R(g, 214, 94, 62, 56, "#0c0a09"); fire(g, 245, 148, f, 1.1);
      // bancone
      R(g, 20, 118, 150, 30, "#7a4a22"); R(g, 20, 114, 150, 6, "#a8743a"); for (let i = 0; i < 5; i++) { R(g, 34 + i * 26, 100, 8, 14, "#c9a14a"); R(g, 33 + i * 26, 98, 10, 3, "#f5f5f4"); }
      R(g, 40, 40, 100, 46, "#2a1a0e"); R(g, 44, 44, 92, 38, "#3a2410"); for (let i = 0; i < 6; i++) { C(g, 58 + i * 15, 60 + (i % 2) * 8, 5, ["#7f1d1d", "#14532d", "#78350f"][i % 3]); }
      // bersaglio
      C(g, 70, 24, 12, "#f5f5f4"); C(g, 70, 24, 8, "#b91c1c"); C(g, 70, 24, 4, "#f5f5f4"); R(g, 69, 23, 2, 2, "#b91c1c");
      GL(g, 160, 20, 90, "255,200,120", 0.25); VIG(g, W, H, 0.45);
    }
  };
  const HOT = {
    cp_titolo: [[20, 94, 280, 70, "🚩 Gli stendardi: sbiaditi, ricuciti, ancora in piedi. Come chi li porta."], [146, 154, 28, 30, "⚽ Il pallone spezzato: metà cuoio, metà promessa."], [20, 18, 280, 44, "📜 Il nome della Compagnia: scelto a maggioranza, dopo una rissa."]],
    cp_campo: [[150, 144, 40, 30, "🔥 Il falò: qui si decide tutto, di solito dopo la zuppa."], [118, 94, 60, 36, "⛺ La tenda della Capitana: l'unica con il tetto che non gocciola."], [268, 98, 34, 28, "🚩 Lo stendardo: un pallone cucito con filo di un'altra epoca."]],
    cp_tenda: [[50, 96, 90, 30, "🗺️ Il tavolo di guerra: mappe, tacche e una macchia di brodo che fa da collina."], [246, 18, 54, 60, "🚩 Il drappo: l'emblema della Compagnia, appeso storto da anni."], [236, 100, 30, 20, "⚽ Un pallone dimenticato sul tavolo: a nessuno è permesso dirlo."]],
    cp_mulini: [[104, 48, 64, 90, "🌾 Il mulino: macina grano e, dicono, anche i rimpianti."], [200, 126, 90, 28, "🚧 Il ponte chiuso: il Gabelliere ha messo un cartello. Scritto bene, purtroppo."], [0, 140, 320, 28, "🌊 Il fiume: lento, freddo, sempre dalla parte di chi ha fretta."]],
    cp_locanda: [[200, 70, 90, 80, "🔥 Il camino: l'unico che non chiede un documento prima di scaldarti."], [20, 96, 150, 54, "🍺 Il bancone: boccali, una mira da fiera e un conto che cresce da solo."], [56, 12, 28, 26, "🎯 Il bersaglio: bucato al centro. Dieci volte. Da una sola persona."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
