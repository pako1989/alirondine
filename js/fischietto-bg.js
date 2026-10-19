// js/fischietto-bg.js - sfondi di «IL FISCHIETTO» (320x200): titolo (stadio di notte), città, campo, sede della Federazione. Animati, con punti da toccare.
(function () {
  "use strict";
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  const T = (g, a, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); };
  const rnd = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const VG = (g, y0, y1, a, b) => { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; };
  const GL = (g, x, y, r, rgb, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); };
  const VIG = (g, W, H, a) => { const gr = g.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 200); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  const ref = (g, x, y, s, f) => { R(g, x - 3 * s, y - 10 * s, 6 * s, 10 * s, "#111"); R(g, x - 3 * s, y - 6 * s, 6 * s, 1.5 * s, "#facc15"); C(g, x, y - 13 * s, 3.2 * s, "#d9a679"); R(g, x - 3.3 * s, y - 16.5 * s, 6.6 * s, 3 * s, "#2a1a10"); R(g, x + 3 * s, y - 12 * s + Math.sin(f / 8) * s, 3 * s, 1.5 * s, "#e5e7eb"); };
  const tower = (g, x, y, f) => { R(g, x, y, 3, 60, "#3a3a46"); R(g, x - 10, y - 8, 23, 9, "#2a2a34"); for (let i = 0; i < 4; i++) { C(g, x - 6 + i * 6, y - 4, 2, "#fff6c8"); } GL(g, x + 2, y - 4, 60, "255,246,200", 0.35 + Math.sin(f / 9) * 0.03); };
  const SC = {
    fi_titolo(g, W, H, f) {
      VG(g, 0, 150, "#0a0a1c", "#2a2a4a"); g.fillRect(0, 0, W, 150);
      for (let i = 0; i < 30; i++) R(g, rnd(i) * W, rnd(i + 9) * 70, 1, 1, `rgba(255,255,255,${0.3 + 0.6 * Math.abs(Math.sin(f / 30 + i))})`);
      tower(g, 30, 40, f); tower(g, 284, 40, f);
      R(g, 0, 130, W, 70, "#17432a"); for (let i = 0; i < 10; i++) R(g, i * 32, 130, 16, 70, i % 2 ? "#1b4f30" : "#17432a");
      R(g, 0, 118, W, 14, "#2a2a34"); for (let i = 0; i < 80; i++) R(g, rnd(i + 3) * W, 120 + rnd(i + 5) * 10, 2, 2, ["#b91c1c", "#f4f0e4", "#fbbf24"][i % 3]);
      GL(g, 160, 150, 120, "255,246,200", 0.25);
      ref(g, 160, 168, 2.4, f); R(g, 40, 176, 240, 1, "rgba(255,255,255,.25)");
      g.font = "900 22px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#fef3c7"; g.fillText("IL FISCHIETTO", 160, 30); g.font = "900 10px Georgia, serif"; g.fillStyle = "#facc15"; g.fillText("ARBITRO DI PROVINCIA · 1998", 160, 46); VIG(g, W, H, 0.4);
    },
    fi_citta(g, W, H, f) {
      VG(g, 0, 110, "#f3b57a", "#fde7b8"); g.fillRect(0, 0, W, 110); C(g, 250, 40, 16, "#fff3c0");
      R(g, 0, 120, W, 80, "#8a8478"); for (let y = 124; y < 200; y += 8) for (let x = ((y / 8) % 2) * 8; x < W; x += 16) R(g, x, y, 14, 6, (x + y) % 3 ? "#9a9488" : "#7f796d");
      [[0, 50, 80, "#d9b98a", "#8a3a2a"], [84, 40, 70, "#cfc2a0", "#2a4a7a"], [160, 54, 66, "#e2c9a0", "#6a3a2a"], [230, 36, 90, "#d3c39b", "#3a5a3a"]].forEach(([x, y, w, wall, roof], i) => { R(g, x, y + 26, w, 100 - y, wall); T(g, [x - 4, y + 26, x + w / 2, y - 4, x + w + 4, y + 26], roof); for (let k = 0; k < Math.floor(w / 26); k++) { R(g, x + 8 + k * 24, y + 40, 9, 12, "#2a2118"); R(g, x + 9 + k * 24, y + 41, 7, 10, i % 2 && f % 200 < 100 ? "#ffd070" : "#3a4a62"); } });
      R(g, 96, 96, 46, 10, "#b91c1c"); g.font = "900 8px sans-serif"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText("BAR SPORT", 119, 104);
      for (let i = 0; i < 3; i++) R(g, 40 + i * 110, 150 + (i % 2) * 6, 3, 14 + (i % 2) * 6, "#3a3a46");
      ref(g, 190, 176, 1.8, f); VIG(g, W, H, 0.3);
    },
    fi_campo(g, W, H, f) {
      VG(g, 0, 90, "#7ec0ee", "#fde7b8"); g.fillRect(0, 0, W, 90); for (let i = 0; i < 3; i++) R(g, ((i * 130 + f * 0.1) % 380) - 50, 14 + i * 16, 56, 6, "rgba(255,255,255,.6)");
      R(g, 0, 90, W, 110, "#2f7d3e"); for (let i = 0; i < 12; i++) R(g, i * 28, 90, 14, 110, "rgba(255,255,255,.04)");
      R(g, 20, 110, 280, 2, "#f4f0e4"); R(g, 150, 110, 2, 90, "#f4f0e4"); C(g, 151, 160, 22, "rgba(0,0,0,0)"); g.strokeStyle = "#f4f0e4"; g.lineWidth = 2; g.beginPath(); g.arc(151, 160, 24, 0, 7); g.stroke();
      R(g, 0, 78, W, 14, "#5a5a64"); for (let i = 0; i < 90; i++) R(g, rnd(i + 3) * W, 80 + rnd(i + 5) * 10, 2, 2, ["#b91c1c", "#f4f0e4", "#1d4ed8"][i % 3]);
      C(g, 120 + Math.sin(f / 25) * 30, 170, 4, "#f4f0e4"); ref(g, 190, 176, 2, f); R(g, 232, 130, 3, 22, "#facc15"); R(g, 235, 130, 14, 8, "#facc15");
      VIG(g, W, H, 0.3);
    },
    fi_sede(g, W, H, f) {
      VG(g, 0, H, "#d8cfb4", "#a89a78"); g.fillRect(0, 0, W, H); R(g, 0, 150, W, 50, "#6b5a40");
      R(g, 20, 40, 90, 60, "#8a7a5a"); for (let i = 0; i < 6; i++) { R(g, 24 + (i % 3) * 28, 46 + Math.floor(i / 3) * 28, 24, 22, ["#e8dec0", "#cfc2a0", "#f1e8cc"][i % 3]); }
      R(g, 150, 90, 130, 14, "#4a3a28"); R(g, 160, 104, 6, 46, "#4a3a28"); R(g, 262, 104, 6, 46, "#4a3a28"); R(g, 170, 74, 40, 16, "#f1e8cc"); R(g, 220, 76, 30, 14, "#e5d8b0");
      R(g, 190, 50, 16, 24, "#2a2a34"); GL(g, 198, 50, 40, "255,246,200", 0.35 + Math.sin(f / 11) * 0.04);
      R(g, 120, 30, 70, 40, "#3a2a1a"); R(g, 124, 34, 62, 32, "#1a1a1a"); for (let i = 0; i < 3; i++) R(g, 130 + i * 18, 40, 12, 20, "rgba(255,255,255,.07)");
      R(g, 300, 60, 10, 90, "#b91c1c"); ref(g, 130, 180, 1.9, f); VIG(g, W, H, 0.3);
    }
  };
  const HOT = {
    fi_titolo: [[130, 140, 60, 40, "🟨 Il cartellino giallo: se lo tieni in tasca abbastanza, diventa quasi simpatico."], [20, 30, 40, 50, "💡 Il faro: illumina la partita e, spesso, anche l'errore."], [60, 118, 200, 14, "🏟️ La tribuna: duecento persone che sanno meglio di te cosa hai visto."]],
    fi_citta: [[94, 94, 50, 18, "🍺 Il Bar Sport: dove la partita si rigioca da sedici anni, con risultati diversi."], [0, 50, 82, 70, "🏛️ La sede della Federazione: l'unico edificio dove nessuno fa rumore, tranne l'archivio."], [230, 36, 90, 90, "📼 La videoteca Moviola: noleggia cassette, e a volte il torto subito."]],
    fi_campo: [[230, 128, 22, 24, "🚩 La bandierina: l'unico segnale che i guardalinee sanno usare a mente fredda."], [20, 108, 280, 6, "⚪ La linea laterale: due dita di calce, un mare di polemiche."], [60, 160, 60, 24, "⚽ Il pallone: rotola da solo, a differenza delle decisioni."]],
    fi_sede: [[20, 40, 90, 60, "🗄️ L'archivio: referti dal 1962. Ci sono più verità lì che in dieci bar."], [120, 30, 70, 40, "📺 La televisione: manda la moviola in bianco e nero, perché il colore sembrerebbe un'opinione."], [150, 74, 130, 30, "🗂️ La scrivania del Giurì: carta, timbri e un bicchiere con la matita di tutti."]]
  };
  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if (n < 80) setTimeout(() => reg(n + 1), 150);
  }
  reg(0);
})();
