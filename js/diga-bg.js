// js/diga-bg.js - sfondi di «LA DIGA DI VALPIANA» (320x200): titolo (la diga al tramonto), paese, lago con barca, coronamento di notte, sala comandi, paese sommerso nella nebbia. Animati, con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const peaks = (g, W, y, c, a, p) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, 200); for (let x = 0; x <= W; x += 6) g.lineTo(x, y - Math.abs(Math.sin(x / (22 + p) + p)) * a); g.lineTo(W, 200); g.fill(); };
  const lake = (g, W, y, f, c1, c2, h) => { VG(g, y, y + h, c1, c2); g.fillRect(0, y, W, h); for (let i = 0; i < 16; i++) { const x = (i * 43 + f * (0.25 + (i % 3) * 0.1)) % (W + 40) - 20, yy = y + 4 + (i * 11) % (h - 6); R(g, x, yy, 12 + (i % 4) * 4, 1, "rgba(255,255,255,.2)"); } };
  const house = (g, x, y, w, h, roof, lit) => { R(g, x, y, w, h, "#e7d6b8"); R(g, x, y + h - 2, w, 2, "rgba(0,0,0,.25)"); T(g, [x - 2, y, x + w + 2, y, x + w / 2, y - h * 0.55], roof); R(g, x + w * 0.4, y + h * 0.35, w * 0.2, h * 0.3, lit ? "#fde68a" : "#334155"); };
  const DAM = (g, W, y, f) => { T(g, [0, y, W, y - 10, W, 200, 0, 200], "#8b929c"); R(g, 0, y - 10, W, 8, "#a3a9b3"); for (let i = 0; i < 12; i++) R(g, i * 28 + 6, y + 10 + (i % 2) * 8, 20, 3, "rgba(0,0,0,.15)"); for (let i = 0; i < 5; i++) { R(g, 30 + i * 62, y - 4, 22, 24, "#4b5563"); R(g, 34 + i * 62, y - 1, 14, 18, "#1f2937"); } };
  const SC = {
    dg_titolo(g, W, H, f) {
      VG(g, 0, 130, "#3b2a5e", "#ff9a5a"); g.fillRect(0, 0, W, 130); C(g, 70, 100, 22, "#ffe3b0"); GL(g, 70, 100, 110, "255,170,100", 0.5);
      for (let i = 0; i < 26; i++) R(g, rnd(i) * W, rnd(i + 40) * 56, 1, 1, `rgba(255,255,255,${0.3 + 0.3 * Math.sin(f / 20 + i)})`);
      peaks(g, W, 112, "#43345e", 30, 3); peaks(g, W, 128, "#2a2145", 18, 1);
      lake(g, W, 112, f, "#d98a64", "#243a64", 38); R(g, 20, 118, 100, 1, "rgba(255,210,150,.5)");
      // la diga
      T(g, [150, 96, 300, 86, 320, 200, 130, 200], "#7f8792"); R(g, 150, 92, 150, 7, "#a7aeb8"); R(g, 154, 98, 142, 2, "#5b6470");
      for (let i = 0; i < 6; i++) { R(g, 164 + i * 22, 100, 8, 26 + (i % 2) * 6, "#59616c"); }
      const wf = (f % 40) / 40; for (let i = 0; i < 3; i++) { const x = 176 + i * 44; R(g, x, 124, 4, 60, "rgba(190,225,255,.55)"); for (let j = 0; j < 6; j++) R(g, x - 1, 124 + ((j * 10 + f * 2) % 60), 6, 2, "rgba(255,255,255,.7)"); }
      // paese in basso
      R(g, 0, 170, W, 30, "#3a4a3a"); [[10, 160, 20, 14], [36, 164, 18, 12], [60, 158, 22, 16], [88, 164, 18, 12]].forEach(([x, y, w, h], i) => house(g, x, y + 6, w, h, "#9b2a2a", f % 120 > 40 + i * 12)); R(g, 112, 170, 8, 4, "#7a5a38");
      g.textAlign = "center"; g.font = "900 22px 'Georgia', serif"; g.fillStyle = "#fde68a"; g.fillText("LA DIGA", 78, 32); g.font = "900 20px 'Georgia', serif"; g.fillStyle = "#f1f5f9"; g.fillText("DI VALPIANA", 78, 54); g.font = "700 9px Georgia, serif"; g.fillStyle = "#fbbf24"; g.fillText("L'ACQUA SALE · LA COPPA DELLA PIENA", 78, 68);
      VIG(g, W, H, 0.4);
    },
    dg_paese(g, W, H, f) {
      VG(g, 0, 100, "#6a8fc0", "#f6d9a8"); g.fillRect(0, 0, W, 100); for (let i = 0; i < 3; i++) R(g, ((i * 120 + f * 0.12) % 380) - 40, 14 + i * 14, 56, 5, "rgba(255,255,255,.75)");
      peaks(g, W, 96, "#5b7a8c", 34, 2); peaks(g, W, 112, "#3f5f4c", 22, 4); R(g, 0, 146, W, 54, "#8a7a5a"); for (let i = 0; i < 20; i++) R(g, rnd(i + 5) * W, 150 + rnd(i + 9) * 46, 3, 1, "#6a5a3a");
      [[20, 120, 40, 28, "#9b2a2a"], [76, 112, 36, 36, "#3a5a8a"], [130, 118, 44, 30, "#6a4a2a"], [196, 108, 40, 40, "#9b2a2a"], [250, 116, 46, 32, "#2a6a5a"]].forEach(([x, y, w, h, c], i) => house(g, x, y, w, h, c, f % 160 > 30 + i * 10));
      R(g, 112, 74, 6, 40, "#cbd5e1"); T(g, [108, 76, 122, 76, 115, 62], "#7a2a2a"); R(g, 113, 84, 4, 6, "#fde68a");
      R(g, 0, 160, W, 4, "#a89b78"); lake(g, 0, 178, f, "#38bdf8", "#0c4a6e", 0); R(g, 0, 184, W, 16, "#2f7aa8"); for (let i = 0; i < 12; i++) R(g, (i * 31 + f * 0.7) % 340 - 10, 188 + (i % 3) * 4, 16, 1, "rgba(255,255,255,.3)");
      R(g, 150, 150, 18, 8, "#7a5a38"); R(g, 154, 142, 2, 10, "#ddd"); T(g, [156, 142, 156, 150, 166, 150], "#f1f5f9"); VIG(g, W, H, 0.25);
    },
    dg_lago(g, W, H, f) {
      VG(g, 0, 90, "#2a3a6a", "#e8b890"); g.fillRect(0, 0, W, 90); peaks(g, W, 92, "#3a4a6a", 26, 3); peaks(g, W, 104, "#27344f", 14, 1);
      lake(g, W, 96, f, "#e8a88a", "#243a64", 70); R(g, 90, 100, 140, 2, "rgba(255,230,190,.45)");
      R(g, 0, 160, W, 40, "#7a6a4a"); for (let i = 0; i < 26; i++) R(g, rnd(i + 5) * W, 162 + rnd(i + 9) * 36, 4, 1, "#5a4a30");
      R(g, 0, 150, 120, 6, "#6a4a2a"); for (let i = 0; i < 6; i++) R(g, 6 + i * 20, 156, 3, 18, "#3a2a18");
      const by = 126 + Math.sin(f / 30) * 1.5; R(g, 200, by, 56, 8, "#7a3a1a"); T(g, [196, by, 260, by, 250, by + 10, 206, by + 10], "#9a4a22"); R(g, 226, by - 24, 2, 24, "#ddd"); T(g, [228, by - 24, 228, by - 6, 246, by - 6], "#f1f5f9");
      R(g, 270, 128, 3, 28, "#3a2a18"); R(g, 262, 124, 20, 4, "#5a4a30"); const bl = 0.4 + 0.3 * Math.sin(f / 18); GL(g, 272, 123, 20, "255,230,160", bl);
      R(g, 6, 138, 50, 6, "#4b5563"); R(g, 10, 132, 40, 6, "#6b7280"); VIG(g, W, H, 0.3);
    },
    dg_diga(g, W, H, f) {
      VG(g, 0, 140, "#050a18", "#1a2740"); g.fillRect(0, 0, W, 140); for (let i = 0; i < 40; i++) R(g, rnd(i + 3) * W, rnd(i + 20) * 70, 1, 1, `rgba(255,255,255,${0.3 + 0.3 * Math.sin(f / 18 + i)})`);
      peaks(g, W, 110, "#0f1a2c", 28, 2); lake(g, W, 100, f, "#1e3a5f", "#0c2038", 20);
      DAM(g, W, 112, f); for (let i = 0; i < 5; i++) { const x = 40 + i * 62, a = 0.5 + 0.4 * Math.sin(f / 16 + i); R(g, x - 1, 100, 2, 14, "#9ca3af"); C(g, x, 99, 3, `rgba(254,240,160,${a})`); GL(g, x, 99, 22, "254,240,160", 0.2 + a * 0.15); }
      for (let i = 0; i < 4; i++) { const x = 52 + i * 70; R(g, x, 124, 6, 76, "rgba(190,225,255,.35)"); for (let j = 0; j < 8; j++) R(g, x - 1, 124 + ((j * 12 + f * 3) % 76), 8, 2, "rgba(255,255,255,.55)"); }
      R(g, 0, 176, W, 24, "#1c2a3a"); const lv = 0.5 + 0.5 * Math.sin(f / 30); R(g, 130, 150, 60, 20, "#252e3d"); R(g, 156, 140, 8, 12, "#ef4444"); GL(g, 160, 144, 24, "239,68,68", 0.2 + lv * 0.15); VIG(g, W, H, 0.5);
    },
    dg_sala(g, W, H, f) {
      VG(g, 0, 200, "#1a2530", "#2e3d4d"); g.fillRect(0, 0, W, 200); R(g, 0, 150, W, 50, "#3a4552"); R(g, 20, 30, 280, 90, "#0f1720"); R(g, 24, 34, 272, 82, "#0b1118");
      for (let i = 0; i < 4; i++) { const x = 34 + i * 66; R(g, x, 44, 56, 62, "#14202c"); const h = 14 + 30 * (0.5 + 0.5 * Math.sin(f / 40 + i * 1.7)); R(g, x + 8, 100 - h, 12, h, i === 3 ? "#f87171" : "#38bdf8"); R(g, x + 30, 100 - h * 0.7, 12, h * 0.7, "#4ade80"); }
      R(g, 40, 130, 240, 22, "#4b5563"); for (let i = 0; i < 16; i++) R(g, 48 + i * 15, 136, 6, 5, (Math.floor(f / 18) + i) % 7 === 0 ? "#ef4444" : (i % 3 ? "#4ade80" : "#fbbf24"));
      R(g, 140, 0, 40, 10, "#111827"); GL(g, 160, 12, 70, "254,240,160", 0.18); for (let i = 0; i < 20; i++) R(g, (i * 71 + f * 0.3) % 320, (i * 43 + f * 0.15) % 140, 1, 1, "rgba(255,255,255,.3)"); VIG(g, W, H, 0.35);
    },
    dg_vecchia(g, W, H, f) {
      VG(g, 0, 140, "#7a8a9a", "#cdd5d8"); g.fillRect(0, 0, W, 140); for (let i = 0; i < 18; i++) R(g, (i * 53 + f * 0.25) % 340 - 10, 20 + (i * 17) % 100, 50, 3, "rgba(255,255,255,.35)");
      peaks(g, W, 96, "#6f7f88", 22, 2); lake(g, W, 100, f, "#6f8f9a", "#2a4a5a", 100);
      // campanile che sbuca dall'acqua + tetti + palo della porta
      R(g, 150, 40, 18, 70, "#9a8a78"); T(g, [146, 42, 172, 42, 159, 20], "#6a3a2a"); R(g, 156, 56, 6, 12, "#2a2a30"); R(g, 158, 8, 2, 14, "#d1d5db"); R(g, 154, 12, 10, 2, "#d1d5db");
      [[60, 92, 40, 12], [200, 96, 46, 10], [260, 98, 30, 8]].forEach(([x, y, w, h], i) => { T(g, [x, y + h, x + w, y + h, x + w / 2, y], i % 2 ? "#7a3a2a" : "#8a4a32"); R(g, x, y + h - 1, w, 2, "rgba(0,0,0,.35)"); });
      R(g, 220, 118, 3, 26, "#e5e7eb"); R(g, 216, 118, 42, 3, "#e5e7eb"); R(g, 255, 118, 3, 26, "#e5e7eb"); for (let i = 0; i < 6; i++) R(g, 220 + i * 7, 121, 1, 22, "rgba(255,255,255,.4)");
      for (let i = 0; i < 5; i++) { const x = 40 + i * 60 + Math.sin(f / 50 + i) * 4; R(g, x, 150 + (i % 3) * 10, 22, 2, "rgba(255,255,255,.25)"); } VIG(g, W, H, 0.3);
    }
  };
  const HOT = {
    dg_titolo: [[150, 90, 160, 110, "🌊 La diga: tre paratoie, quarant'anni e un cartello «Non toccare» che nessuno ha mai letto."], [8, 154, 112, 36, "🏘️ Valpiana: sedici case e una squadra che gioca nella piazza."], [40, 76, 70, 30, "🌅 Il lago: più alto di quanto dovrebbe, più calmo di quanto sembri."]],
    dg_paese: [[110, 62, 14, 54, "🔔 Il campanile: suona le ore, a volte anche quelle che non sono."], [150, 138, 20, 24, "⛵ Una barca tirata in secca: ormai, qui, è un monumento."], [10, 106, 300, 54, "🏘️ Le case: tutte con una finestra accesa e un secchio fuori dalla porta."]],
    dg_lago: [[198, 100, 62, 36, "⛵ La barca di Zattera: ha traghettato più sacchi che passeggeri."], [262, 110, 24, 20, "💡 Un lampione sul pontile: lampeggia, ma solo quando c'è qualcuno che guarda."], [0, 132, 70, 34, "📦 Casse di sabbia: mezze vuote, mezze promesse."]],
    dg_diga: [[30, 100, 260, 24, "💡 Il coronamento: una fila di lampioni e una ringhiera con i segni di chi ci ha pianto."], [40, 124, 250, 72, "💦 Gli scarichi: acqua che scende dove non dovrebbe e dove, forse, serve."], [140, 146, 56, 22, "🔴 La cabina: la lucina rossa è un promemoria, non una minaccia. Per ora."]],
    dg_sala: [[24, 34, 272, 84, "📊 I quadranti: livelli, portate, un ago rosso che fa finta di niente."], [40, 128, 240, 26, "🎛️ Il pannello: ogni bottone ha un'etichetta scritta a mano, ogni etichetta una storia."], [140, 0, 40, 14, "💡 La lampada: dondola appena. Qualcuno ha sbattuto la porta, o qualcosa sotto la diga ha respirato."]],
    dg_vecchia: [[146, 18, 28, 92, "🔔 Il campanile di Valpiana Vecchia: l'unica cosa che sapeva stare in piedi quando l'acqua è arrivata."], [214, 112, 50, 36, "🥅 Una porta da calcio senza rete: i pali sono ancora bianchi. Dopo sessant'anni."], [50, 82, 250, 24, "🏚️ I tetti: tegole rosse sotto un cielo grigio, come se aspettassero ancora il postino."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
