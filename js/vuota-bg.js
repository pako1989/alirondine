// js/vuota-bg.js - sfondi di «OPERAZIONE SCATOLA VUOTA» (320x200): titolo (scatola sul molo al tramonto), costa, bastione di notte, archivio al freddo, tetto sotto la pioggia. Animati, con punti da toccare.
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
  const sea = (g, W, y, f, c1, c2) => { VG(g, y, 200, c1, c2); g.fillRect(0, y, W, 200 - y); for (let i = 0; i < 18; i++) { const x = (i * 41 + f * (0.3 + (i % 3) * 0.1)) % (W + 40) - 20, yy = y + 6 + (i * 13) % (200 - y - 8); R(g, x, yy, 14 + (i % 4) * 4, 1, "rgba(255,255,255,.18)"); } };
  const crate = (g, x, y, s) => { R(g, x, y, 22 * s, 18 * s, "#a8794a"); R(g, x, y, 22 * s, 4 * s, "#c4935a"); R(g, x + 10 * s, y, 2 * s, 18 * s, "#8a5f38"); R(g, x + 3 * s, y + 10 * s, 16 * s, 1.5 * s, "#8a5f38"); g.fillStyle = "#222"; g.font = `700 ${3.2 * s}px sans-serif`; g.textAlign = "center"; g.fillText("QUESTA WAY UP", x + 11 * s, y + 8 * s); };
  const guard = (g, x, y, s, f, face) => { R(g, x - 5 * s, y, 10 * s, 14 * s, "#3f4a3a"); C(g, x, y - 4 * s, 5 * s, "#d9a679"); R(g, x - 6 * s, y - 9 * s, 12 * s, 4 * s, "#1f2a1c"); R(g, x + face * 5 * s, y + 4 * s, 3 * s, 8 * s, "#111"); };
  const SC = {
    vs_titolo(g, W, H, f) {
      VG(g, 0, 120, "#2a1d4a", "#ff9a4a"); g.fillRect(0, 0, W, 120); C(g, 240, 92, 24, "#ffd9a0"); GL(g, 240, 92, 120, "255,170,90", 0.5);
      for (let i = 0; i < 30; i++) R(g, rnd(i) * W, rnd(i + 40) * 60, 1, 1, `rgba(255,255,255,${0.3 + 0.3 * Math.sin(f / 20 + i)})`);
      hills(g, W, 108, "#3a2a44", 8, 2); sea(g, W, 122, f, "#c26a50", "#1c2a4a"); R(g, 190, 122, 100, 2, "rgba(255,200,140,.5)");
      // molo
      R(g, 0, 150, 220, 6, "#4a3422"); for (let i = 0; i < 11; i++) { R(g, 6 + i * 20, 156, 3, 30, "#2a1c12"); } R(g, 0, 150, 220, 1, "#7a5a3a");
      // fortezza lontana
      R(g, 232, 100, 52, 22, "#1f2937"); R(g, 228, 96, 8, 26, "#111827"); R(g, 280, 98, 8, 24, "#111827"); const b = 0.5 + 0.5 * Math.sin(f / 18); R(g, 250, 106, 4, 3, `rgba(254,240,138,${0.5 + b * 0.5})`); GL(g, 252, 107, 26, "254,240,160", 0.25 + b * 0.15);
      // la scatola con due occhi
      const bx = 120, by = 128 + Math.sin(f / 30) * 1; crate(g, bx, by, 1.8); R(g, bx + 8, by + 10, 5, 4, "#fff"); R(g, bx + 28, by + 10, 5, 4, "#fff"); R(g, bx + 10 + Math.sin(f / 50) * 1.5, by + 11, 2, 2, "#111"); R(g, bx + 30 + Math.sin(f / 50) * 1.5, by + 11, 2, 2, "#111");
      g.textAlign = "center"; g.font = "900 20px 'Courier New', monospace"; g.fillStyle = "#facc15"; g.fillText("OPERAZIONE", 110, 30); g.font = "900 24px 'Courier New', monospace"; g.fillStyle = "#f1f5f9"; g.fillText("SCATOLA VUOTA", 110, 54); g.font = "700 9px 'Courier New', monospace"; g.fillStyle = "#fbbf24"; g.fillText("CAPO SILENZIO · SQUADRA NOVE", 110, 68);
      R(g, 270, 20 + (f % 90 < 45 ? 0 : 1), 2, 8, "#ef4444"); R(g, 270, 31, 2, 2, "#ef4444"); VIG(g, W, H, 0.4);
    },
    vs_costa(g, W, H, f) {
      VG(g, 0, 90, "#79a9d6", "#f3d9a8"); g.fillRect(0, 0, W, 90); for (let i = 0; i < 3; i++) R(g, ((i * 120 + f * 0.12) % 380) - 40, 16 + i * 14, 54, 5, "rgba(255,255,255,.7)");
      hills(g, W, 70, "#6a8a8a", 10, 2); sea(g, W, 92, f, "#3a86b8", "#1d4f7a"); R(g, 0, 150, W, 50, "#d8c48a"); for (let i = 0; i < 24; i++) R(g, rnd(i + 5) * W, 152 + rnd(i + 9) * 44, 3, 1, "#b8a468");
      for (let i = 0; i < 4; i++) { const x = ((f * 0.5 + i * 90) % 400) - 40, y = 148 + Math.sin(f / 20 + i) * 1; R(g, x, y, 40, 4, "rgba(255,255,255,.5)"); }
      T(g, [190, 150, 215, 108, 240, 150], "#4b5058"); T(g, [230, 150, 262, 96, 296, 150], "#434850"); R(g, 248, 82, 6, 16, "#9ca3af"); R(g, 246, 80, 10, 4, "#facc15"); GL(g, 251, 82, 28, "254,240,160", 0.3);
      crate(g, 40, 140, 1.3); crate(g, 70, 150, 1); R(g, 4, 142, 50, 10, "#7a5a38"); guard(g, 152, 138, 1, f, 1); VIG(g, W, H, 0.25);
    },
    vs_bastione(g, W, H, f) {
      VG(g, 0, 140, "#0a1020", "#1d2a44"); g.fillRect(0, 0, W, 140); for (let i = 0; i < 40; i++) R(g, rnd(i + 3) * W, rnd(i + 20) * 90, 1, 1, `rgba(255,255,255,${0.3 + 0.3 * Math.sin(f / 18 + i)})`);
      R(g, 0, 120, W, 80, "#2b303a"); R(g, 30, 60, 260, 70, "#323a46"); for (let i = 0; i < 7; i++) R(g, 30 + i * 38, 50, 20, 14, "#323a46"); R(g, 30, 130, 260, 4, "#1c2028");
      for (let i = 0; i < 10; i++) R(g, 44 + i * 25, 78 + (i % 2) * 14, 10, 8, rnd(i + f / 90 | 0) > 0.3 ? "rgba(254,240,138,.65)" : "#12161c");
      for (const sx of [60, 260]) { const a = f / 60 + sx; T(g, [sx, 54, sx + Math.cos(a) * 80 + 20, 150, sx + Math.cos(a) * 80 - 20, 150], "rgba(254,240,160,.13)"); R(g, sx - 5, 52, 10, 6, "#facc15"); }
      R(g, 120, 100, 80, 34, "#1c2028"); R(g, 150, 108, 20, 26, "#0f1318"); R(g, 158, 114, 4, 4, "#ef4444"); crate(g, 30, 150, 1.4); crate(g, 250, 156, 1.1); guard(g, 90 + Math.sin(f / 80) * 30, 146, 1.1, f, Math.cos(f / 80) > 0 ? 1 : -1); VIG(g, W, H, 0.5);
    },
    vs_archivio(g, W, H, f) {
      VG(g, 0, 200, "#cbd5e1", "#8aa0b8"); g.fillRect(0, 0, W, 200); for (let r = 0; r < 4; r++) { const x = 10 + r * 78; R(g, x, 20, 60, 150, "#475569"); for (let i = 0; i < 6; i++) { R(g, x, 26 + i * 24, 60, 2, "#334155"); for (let j = 0; j < 9; j++) R(g, x + 3 + j * 6, 8 + 26 + i * 24 - 2, 4, 14, ["#f87171", "#fbbf24", "#60a5fa", "#a3e635", "#e2e8f0"][(r * 7 + i * 3 + j) % 5]); } }
      R(g, 0, 170, W, 30, "#e2e8f0"); for (let i = 0; i < 20; i++) R(g, i * 16, 170, 1, 30, "#cbd5e1");
      const c = 0.4 + 0.4 * Math.sin(f / 22); R(g, 150, 4, 20, 8, "#1f2937"); C(g, 160, 8, 3, c > 0.5 ? "#ef4444" : "#7f1d1d"); T(g, [160, 12, 130, 80, 190, 80], `rgba(255,60,60,${0.1 + c * 0.1})`);
      for (let i = 0; i < 30; i++) R(g, ((i * 53 + f * 0.4) % 320), (i * 29 + f * 0.2) % 170, 1, 1, "rgba(255,255,255,.7)"); VIG(g, W, H, 0.25);
    },
    vs_tetto(g, W, H, f) {
      VG(g, 0, 200, "#0b1020", "#1e293b"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 5; i++) R(g, 10 + i * 66, 100 - (i % 3) * 14, 50, 100, "#111827");
      for (let i = 0; i < 40; i++) R(g, rnd(i) * W, 110 + rnd(i + 5) * 70, 2, 2, rnd(i + (f / 120 | 0)) > 0.4 ? "rgba(254,240,138,.6)" : "#0b0f18");
      R(g, 0, 170, W, 30, "#374151"); R(g, 0, 166, W, 4, "#4b5563"); R(g, 130, 130, 60, 36, "#1f2937"); R(g, 150, 140, 20, 26, "#0f1318"); R(g, 158, 108, 4, 22, "#9ca3af"); GL(g, 160, 106, 20, "239,68,68", 0.3 + 0.2 * Math.sin(f / 10)); C(g, 160, 106, 3, "#ef4444");
      g.strokeStyle = "rgba(190,210,235,.55)"; g.lineWidth = 1; for (let i = 0; i < 70; i++) { const x = (rnd(i) * (W + 40) + f * 2.2) % (W + 40) - 20, y = (rnd(i + 90) * 220 + f * 6) % 220; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 3, y + 10); g.stroke(); }
      if (f % 240 < 4) R(g, 0, 0, W, 200, "rgba(255,255,255,.25)"); VIG(g, W, H, 0.5);
    }
  };
  const HOT = {
    vs_titolo: [[110, 128, 90, 36, "📦 La scatola: non è vuota quanto sembra. Ma quasi."], [226, 92, 66, 34, "🏰 Il Bastione Nove: ogni finestra illuminata è una guardia che si annoia."], [0, 148, 220, 40, "⚓ Il molo: assi che scricchiolano al ritmo giusto per tradirti."]],
    vs_costa: [[40, 138, 60, 28, "📦 Le casse: «Materiale sportivo». I palloni, forse, sono rimasti a casa."], [190, 96, 110, 54, "🪨 La scogliera: una salita facile per i gabbiani, meno per te."], [140, 126, 28, 28, "🪖 Una guardia: fa il giro come un orologio. Come un orologio, a volte si ferma."]],
    vs_bastione: [[30, 50, 40, 40, "🔦 Un faro di sorveglianza: gira, gira, e non ti perde mai di vista. Quasi."], [120, 100, 80, 34, "🚪 Il portone: acciaio e un cartello «SILENZIO»."], [250, 150, 40, 30, "📦 Casse accatastate: un buon posto per un cartone ben piegato."]],
    vs_archivio: [[10, 20, 250, 150, "🗂️ Scaffali: ogni cartella un segreto, ogni segreto una polvere che qui non c'è."], [150, 0, 30, 20, "🔴 Una telecamera: guarda in linea retta. Come tutti i testimoni onesti."], [0, 170, 320, 30, "❄️ Il pavimento: così freddo che i passi suonano più forte di quanto vorresti."]],
    vs_tetto: [[130, 106, 60, 60, "📡 Il traliccio: la luce rossa lampeggia a tempo con il tuo cuore."], [0, 166, 320, 34, "🌧️ Il tetto: piove da quando sei salito e prima ancora."], [10, 40, 300, 60, "🌃 La città oltre il mare: si accende e si spegne senza chiedere il permesso."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
