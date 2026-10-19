// js/officina-bg.js - sfondi de «L'OFFICINA DEI GIGANTI DI RUGGINE» (320x200): titolo, fonderia, cavi, collaudo, caldaie. Animati (vapore, scintille), con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  // sbuffi di vapore che salgono
  const puff = (g, x, y, f, n, s) => { for (let i = 0; i < n; i++) { const t = ((f * 0.6 + i * 24) % (n * 24)) / (n * 24); C(g, x + Math.sin(t * 6 + i) * 6 * s, y - t * 60 * s, (3 + t * 9) * s, `rgba(235,235,240,${0.55 * (1 - t)})`); } };
  const sparks = (g, x, y, f, n) => { for (let i = 0; i < n; i++) { const t = ((f * 1.4 + i * 17) % 50) / 50; R(g, x + (rnd(i) - 0.5) * 50 * t, y - t * 30 + t * t * 40, 2, 2, `rgba(255,${180 + Math.floor(rnd(i + 9) * 70)},60,${1 - t})`); } };
  const gear = (g, x, y, r, a, c) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = c; for (let i = 0; i < 8; i++) { g.rotate(Math.PI / 4); g.fillRect(-r * 0.14, -r * 1.18, r * 0.28, r * 0.3); } g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.fillStyle = "rgba(0,0,0,.45)"; g.beginPath(); g.arc(0, 0, r * 0.4, 0, 7); g.fill(); g.restore(); };
  const giant = (g, x, y, f, s, c) => { // colosso a vapore
    R(g, x - 16 * s, y - 70 * s, 32 * s, 26 * s, c); R(g, x - 10 * s, y - 62 * s, 8 * s, 6 * s, "#fde68a"); R(g, x + 3 * s, y - 62 * s, 8 * s, 6 * s, "#fde68a");
    R(g, x - 24 * s, y - 44 * s, 48 * s, 44 * s, c); R(g, x - 36 * s, y - 42 * s, 12 * s, 38 * s, c); R(g, x + 24 * s, y - 42 * s, 12 * s, 38 * s, c);
    R(g, x - 16 * s, y, 12 * s, 28 * s, c); R(g, x + 4 * s, y, 12 * s, 28 * s, c); R(g, x - 4 * s, y - 36 * s, 8 * s, 8 * s, "#7c2d12");
    R(g, x + 10 * s, y - 84 * s, 5 * s, 14 * s, "#3f3f46"); puff(g, x + 12 * s, y - 84 * s, f, 3, s);
  };
  const SC = {
    of_titolo(g, W, H, f) {
      VG(g, 0, 150, "#2a1a20", "#d97706"); g.fillRect(0, 0, W, 150); GL(g, 220, 110, 120, "255,150,60", 0.4 + Math.sin(f / 12) * 0.04);
      for (let i = 0; i < 4; i++) { R(g, 20 + i * 70, 70 - (i % 2) * 18, 16, 80, "#3f3a40"); puff(g, 28 + i * 70, 70 - (i % 2) * 18, f + i * 9, 3, 1.2); }
      R(g, 0, 150, W, 50, "#2a2024"); giant(g, 215, 148, f, 1.4, "#7c4a2a"); giant(g, 110, 150, f + 20, 0.9, "#5b3a2a"); gear(g, 40, 170, 18, f / 40, "#6b4a30"); gear(g, 66, 182, 12, -f / 30, "#7a5a3a");
      g.font = "900 16px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#ffe8c0"; g.fillText("L'OFFICINA DEI GIGANTI", 160, 24); g.fillStyle = "#fbbf24"; g.font = "900 14px Georgia, serif"; g.fillText("DI RUGGINE", 160, 42); VIG(g, W, H, 0.45);
    },
    of_fonderia(g, W, H, f) {
      VG(g, 0, 200, "#3a2a22", "#6a4a34"); g.fillRect(0, 0, W, 200); for (let i = 0; i < 7; i++) { R(g, i * 48, 0, 4, 120, "#2a1c16"); R(g, 0, 20 + i * 14, W, 3, "#2a1c16"); }
      R(g, 30, 60, 70, 60, "#1a110c"); GL(g, 65, 100, 60, "255,120,40", 0.5 + Math.sin(f / 7) * 0.08); R(g, 36, 86, 58, 28, "#ffb24a"); R(g, 36, 86, 58, 8, "#ff7a1a"); sparks(g, 65, 90, f, 8);
      giant(g, 220, 150, f, 1.1, "#6b3f28"); R(g, 0, 150, W, 50, "#2f2420"); for (let i = 0; i < 9; i++) R(g, i * 38 - (f * 0.2) % 38, 168, 22, 2, "#4a3a30");
      gear(g, 150, 110, 22, f / 50, "#5a4030"); gear(g, 176, 136, 14, -f / 36, "#6a4c38"); VIG(g, W, H, 0.4);
    },
    of_cavi(g, W, H, f) {
      VG(g, 0, 120, "#1e2a3a", "#5a6a82"); g.fillRect(0, 0, W, 120);
      for (let i = 0; i < 5; i++) { const x = 30 + i * 62; R(g, x, 30, 6, 120, "#3a3f48"); R(g, x - 22, 40, 50, 4, "#3a3f48"); R(g, x - 22, 58, 50, 4, "#3a3f48"); }
      g.strokeStyle = "#1a1f26"; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(0, 42 + k * 18); for (let x = 0; x <= W; x += 20) g.lineTo(x, 42 + k * 18 + Math.sin(x / 40 + k) * 6); g.stroke(); }
      const fl = (f % 70) < 5; if (fl) { g.strokeStyle = "rgba(190,220,255,.9)"; g.lineWidth = 2; g.beginPath(); g.moveTo(130, 30); g.lineTo(144, 70); g.lineTo(130, 90); g.lineTo(150, 130); g.stroke(); GL(g, 145, 90, 70, "170,200,255", 0.4); }
      R(g, 0, 150, W, 50, "#2a2f38"); R(g, 90, 124, 70, 26, "#475569"); R(g, 96, 130, 14, 10, "#fde68a"); puff(g, 150, 124, f, 3, 1); gear(g, 250, 138, 16, f / 46, "#64748b"); VIG(g, W, H, 0.4);
    },
    of_collaudo(g, W, H, f) {
      VG(g, 0, 100, "#b8a58a", "#e4d3b4"); g.fillRect(0, 0, W, 100); R(g, 0, 100, W, 100, "#8a8478"); for (let i = 0; i < 10; i++) R(g, i * 34, 100, 2, 100, "rgba(0,0,0,.12)");
      R(g, 0, 138, W, 3, "#f4f0e4"); R(g, 150, 100, 3, 100, "#f4f0e4"); g.strokeStyle = "#f4f0e4"; g.lineWidth = 3; g.beginPath(); g.arc(151, 150, 24, 0, 7); g.stroke();
      R(g, 20, 70, 6, 70, "#d4d4d8"); R(g, 20, 70, 40, 5, "#d4d4d8"); R(g, 280, 70, 6, 70, "#d4d4d8"); R(g, 250, 70, 36, 5, "#d4d4d8");
      giant(g, 90, 150, f, 0.8, "#6b7280"); giant(g, 230, 150, f + 30, 0.8, "#78716c"); R(g, 108, 50, 104, 18, "#44403c"); g.font = "900 10px monospace"; g.textAlign = "center"; g.fillStyle = "#fde68a"; g.fillText("COLLAUDO · NON TOCCARE", 160, 62); VIG(g, W, H, 0.25);
    },
    of_caldaie(g, W, H, f) {
      VG(g, 0, 200, "#3a1208", "#7c2d12"); g.fillRect(0, 0, W, 200); GL(g, 160, 120, 200, "255,100,30", 0.35 + Math.sin(f / 9) * 0.05);
      for (let i = 0; i < 3; i++) { const x = 30 + i * 100; R(g, x, 50, 60, 100, "#4a2418"); R(g, x + 6, 56, 48, 88, "#5e3020"); C(g, x + 30, 86, 14, "#1a0e0a"); C(g, x + 30, 86, 10, "#ffb24a"); GL(g, x + 30, 86, 40, "255,150,50", 0.5 + Math.sin(f / 6 + i) * 0.1); R(g, x + 26, 20, 8, 30, "#3f3f46"); puff(g, x + 30, 20, f + i * 11, 3, 1); }
      R(g, 0, 150, W, 50, "#2a1610"); for (let i = 0; i < 8; i++) R(g, i * 42, 160, 3, 40, "#3a2018"); sparks(g, 80, 150, f, 6); sparks(g, 240, 150, f + 5, 6); gear(g, 160, 165, 18, f / 40, "#7a4a30"); VIG(g, W, H, 0.45);
    }
  };
  const HOT = {
    of_titolo: [[190, 70, 60, 80, "🤖 Un colosso a vapore: pesa dieci tonnellate e ha il carattere di un nonno."], [10, 150, 70, 40, "⚙️ Ingranaggi: la fonderia ne ha più dei bulloni. E più dei ricordi."], [20, 30, 280, 50, "🏭 Le ciminiere: fumano per abitudine, non per lavoro."]],
    of_fonderia: [[30, 60, 70, 60, "🔥 La forgia: ha spento il primo fuoco quarant'anni fa, e il secondo da allora."], [185, 80, 70, 90, "🤖 Il colosso di Gasparre: ruggine fuori, ostinazione dentro."], [130, 90, 70, 60, "⚙️ Gli ingranaggi: girano da soli, senza che nessuno li abbia chiamati."]],
    of_cavi: [[0, 30, 320, 60, "⚡ I cavi dell'alta tensione: cantano quando c'è temporale."], [90, 124, 70, 26, "🔧 La cabina: dentro c'è una leva e un cartello «Non toccare»."], [240, 120, 40, 40, "⚙️ Una puleggia: gira piano, come chi ha capito tutto."]],
    of_collaudo: [[140, 100, 24, 100, "⚪ La linea di metà campo: calce fresca e parecchie dispute."], [100, 48, 110, 24, "📋 Il cartello del Collaudo: parla di sicurezza, non ci crede nessuno."], [10, 70, 60, 70, "🥅 Una porta: larga come una promessa e alta quanto un colosso."]],
    of_caldaie: [[20, 50, 280, 100, "🔥 Le Caldaie: la voce più forte del posto, e la più sincera."], [140, 150, 40, 40, "⚙️ L'ingranaggio sul pavimento: pare chiedere di essere raccolto."], [0, 150, 320, 50, "🛠️ La passerella: vibra quando la caldaia pensa."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
