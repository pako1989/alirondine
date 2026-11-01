// js/tipografia-bg.js — 14 sfondi illustrati e animati (320×200) per «La Tipografia di Mezzanotte · L'Ultima Edizione»
// Palette 1968: carta giornale avorio (#f5ebd6), verde edicola (#1f6f54), rosso testata (#c83228), ambra camera oscura (#eab308), piombo (#475569).
// Registrati in window.__lbBg con almeno 3 punti toccabili (hot) ciascuno e civette dinamiche che leggono l'ultima Prima Pagina stampata.
(function () {
  "use strict";

  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };
  const sky = (g, W, H, c1, c2, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h || H);
    gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.fillStyle = gr; g.fillRect(0, 0, W, h || H);
  };
  const glow = (g, x, y, r, rgb, a) => {
    const gr = g.createRadialGradient(x, y, 2, x, y, r);
    gr.addColorStop(0, `rgba(${rgb},${a})`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const liveHead = () => {
    try {
      const T = window.__tipografia;
      const h = T && T.latestHeadline && T.latestHeadline();
      if (h) return String(h).slice(0, 22).toUpperCase();
    } catch (e) {}
    return "GIÙ LE MANI DAL CAMPO!";
  };
  const placard = (g, x, y, w, h, head) => {
    R(g, x, y, w, h, "#f5ebd6");
    g.strokeStyle = "#1c1917"; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    R(g, x + 2, y + 2, w - 4, 5, "#c83228");
    R(g, x + 3, y + 9, w - 6, 2, "#1c1917");
    R(g, x + 3, y + 13, w - 8, 2, "#475569");
    if (head && w >= 42) {
      g.fillStyle = "#1c1917"; g.font = "700 4.5px 'Trebuchet MS',sans-serif";
      g.fillText(head.slice(0, 14), x + 3, y + h - 3);
    }
  };
  const kiosk = (g, x, y, f) => {
    R(g, x, y + 16, 68, 52, "#164e3b");
    R(g, x - 4, y + 10, 76, 8, "#1f6f54");
    for (let i = 0; i < 6; i++) R(g, x - 2 + i * 12, y + 16, 6, 4, i % 2 ? "#f5ebd6" : "#c83228");
    R(g, x + 6, y + 2, 56, 9, "#c83228");
    g.fillStyle = "#fffbeb"; g.font = "900 5.5px 'Trebuchet MS',sans-serif";
    g.fillText("L'ECO DEL PALLONE", x + 9, y + 8.5);
    R(g, x + 8, y + 24, 30, 22, "#fef3c7");
    glow(g, x + 23, y + 34, 24, "253,224,71", 0.22 + 0.05 * Math.sin(f * 0.08));
    placard(g, x + 42, y + 24, 22, 28);
    placard(g, x - 10, y + 36, 16, 24);
  };
  const lampPost = (g, x, y, f) => {
    R(g, x - 1.5, y, 3, 56, "#1e293b");
    R(g, x - 5, y + 52, 10, 4, "#0f172a");
    C(g, x, y - 2, 4.5, "#fef08a");
    glow(g, x, y, 28, "253,224,71", 0.30 + 0.06 * Math.sin(f * 0.07 + x));
  };

  const SC = {
    tp_titolo(g, W, H, f) {
      sky(g, W, H, "#162032", "#3b2820", 138);
      // Profilo dei tetti di Borgo Alta 1968
      [[0, 72, 62, 68], [58, 58, 56, 82], [110, 66, 68, 74], [174, 52, 64, 88], [236, 64, 84, 76]].forEach(([x, y, w, h], i) => {
        R(g, x, y, w, h, i % 2 ? "#283244" : "#323d52");
        for (let wy = y + 10; wy < y + h - 18; wy += 16) {
          for (let wx = x + 8; wx < x + w - 12; wx += 14) {
            const lit = (wx + wy + i) % 3 === 0;
            R(g, wx, wy, 7, 10, lit ? "#fde68a" : "#1e293b");
          }
        }
      });
      R(g, 0, 136, W, 64, "#3a3532");
      for (let i = 0; i < 16; i++) R(g, i * 20, 138, 18, 4, "#57534e");
      // Edicola verde a sinistra e vetrina calda della Tipografia a destra
      kiosk(g, 22, 74, f);
      R(g, 168, 72, 132, 68, "#5c3a28");
      R(g, 172, 62, 124, 12, "#c83228");
      g.fillStyle = "#f5ebd6"; g.font = "900 6.5px 'Trebuchet MS',sans-serif";
      g.fillText("TIPOGRAFIA DI MEZZANOTTE", 180, 70);
      R(g, 182, 84, 74, 38, "#fef3c7");
      glow(g, 219, 102, 46, "234,179,8", 0.34);
      // Sagoma della rotativa Marinoni dietro il vetro che gira
      const ang = f * 0.09;
      C(g, 206, 106, 11, "#334155"); C(g, 232, 106, 11, "#475569");
      g.strokeStyle = "#f5ebd6"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(206 + Math.cos(ang) * 9, 106 + Math.sin(ang) * 9); g.lineTo(232 + Math.cos(-ang) * 9, 106 + Math.sin(-ang) * 9); g.stroke();
      R(g, 264, 86, 24, 54, "#3e2418");
      lampPost(g, 134, 84, f);
      // Fogli freschi che volano nella brezza d'ottobre
      for (let i = 0; i < 4; i++) {
        const px = (f * 1.1 + i * 78) % (W + 24) - 12;
        const py = 148 + Math.sin(f * 0.08 + i * 2) * 8 + i * 5;
        R(g, px, py, 11, 7, "#f5ebd6"); R(g, px + 1, py + 1, 9, 1.5, "#c83228");
      }
    },

    tp_edicole(g, W, H, f) {
      sky(g, W, H, "#5b82a6", "#d9b99b", 118);
      // Facciate color ocra e terracotta di Piazza delle Edicole
      R(g, 0, 44, 108, 84, "#c9966b"); R(g, 108, 36, 112, 92, "#d8b282"); R(g, 220, 48, 100, 80, "#b87a56");
      R(g, 0, 38, 108, 7, "#8c3b2b"); R(g, 108, 30, 112, 7, "#7c2d12"); R(g, 220, 42, 100, 7, "#8c3b2b");
      // Portici e insegna Bar Sport
      R(g, 228, 88, 84, 40, "#7c2d12");
      R(g, 232, 78, 76, 10, "#1d4ed8");
      g.fillStyle = "#fffbeb"; g.font = "900 6px 'Trebuchet MS',sans-serif"; g.fillText("BAR SPORT · TOTOCALCIO", 235, 85);
      // Lastricato a coda di pavone
      R(g, 0, 126, W, 74, "#78716c");
      for (let i = 0; i < 12; i++) {
        g.strokeStyle = "rgba(245,235,214,0.22)"; g.beginPath(); g.arc(16 + i * 28, 162, 14, Math.PI, Math.PI * 2); g.stroke();
      }
      kiosk(g, 32, 68, f);
      // Civetta aggiornabile col titolo dell'ultima edizione
      placard(g, 116, 86, 52, 36, liveHead());
      // Caldarroste fumanti
      R(g, 184, 112, 22, 18, "#334155"); C(g, 195, 112, 11, "#1e293b");
      glow(g, 195, 110, 14, "239,68,68", 0.4);
      for (let s = 0; s < 3; s++) C(g, 193 + Math.sin(f * 0.07 + s) * 4, 100 - ((f * 0.4 + s * 9) % 24), 3.5, "rgba(245,235,214,0.45)");
      lampPost(g, 168, 74, f);
    },

    tp_linotype(g, W, H, f) {
      R(g, 0, 0, W, 138, "#3e352f");
      R(g, 0, 136, W, 64, "#57504a");
      for (let i = 0; i < 10; i++) R(g, i * 32, 136, 16, 64, "rgba(245,235,214,0.06)");
      // Finestrone a riquadri industriali in ferro
      R(g, 20, 18, 92, 58, "#1e293b");
      for (let x = 24; x < 108; x += 22) for (let y = 22; y < 72; y += 26) R(g, x, y, 18, 22, "#64748b");
      // Grande macchina Linotype nera e ottone di Mastro Goffredo
      R(g, 128, 32, 76, 104, "#1e293b");
      R(g, 136, 20, 48, 18, "#eab308"); // magazzino matrici d'ottone
      const armY = 44 + Math.sin(f * 0.1) * 6;
      R(g, 142, armY, 52, 5, "#94a3b8");
      R(g, 138, 86, 56, 18, "#cbd5e1"); // tastiera a 90 tasti
      glow(g, 166, 68, 42, "234,179,8", 0.28);
      // Bancone di piombo per l'impaginazione della Prima Pagina
      R(g, 18, 102, 96, 42, "#5c3a28");
      R(g, 22, 98, 88, 10, "#475569");
      placard(g, 36, 82, 58, 22, liveHead());
      // Scaffali di caratteri mobili e bozze appese allo spago
      R(g, 224, 28, 80, 106, "#4a2e1b");
      for (let r = 0; r < 5; r++) R(g, 228, 36 + r * 19, 72, 12, "#78350f");
      g.strokeStyle = "#d6d3d1"; g.beginPath(); g.moveTo(14, 14); g.lineTo(306, 20); g.stroke();
      for (let i = 0; i < 5; i++) R(g, 38 + i * 52, 16 + Math.sin(f * 0.06 + i) * 2, 16, 22, "#f5ebd6");
    },

    tp_barsport(g, W, H, f) {
      R(g, 0, 0, W, 138, "#6b3424");
      R(g, 0, 136, W, 64, "#d6c7a9");
      for (let x = 0; x < W; x += 20) for (let y = 136; y < H; y += 16) if (((x / 20 + y / 16) | 0) % 2) R(g, x, y, 20, 16, "#292524");
      // Bancone cromato e macchina espresso a leva Faema 1968
      R(g, 18, 86, 178, 52, "#7c2d12");
      R(g, 16, 80, 182, 7, "#cbd5e1");
      R(g, 52, 52, 46, 28, "#e2e8f0"); R(g, 58, 44, 34, 8, "#eab308");
      // Vapore del caffè
      for (let i = 0; i < 3; i++) C(g, 74 + Math.sin(f * 0.1 + i) * 3, 40 - ((f * 0.5 + i * 8) % 18), 3, "rgba(255,255,255,0.5)");
      // Lavagna Totocalcio 1-X-2
      R(g, 214, 24, 88, 78, "#14532d");
      g.strokeStyle = "#eab308"; g.lineWidth = 2; g.strokeRect(214, 24, 88, 78);
      g.fillStyle = "#fef08a"; g.font = "900 6px 'Trebuchet MS',sans-serif"; g.fillText("SCHEDINA TOTOCALCIO", 221, 34);
      for (let r = 0; r < 6; r++) {
        R(g, 220, 40 + r * 9, 48, 4, "rgba(245,235,214,0.45)");
        g.fillStyle = r % 2 ? "#fde047" : "#f5ebd6";
        g.fillText(r === 0 ? "1" : r % 3 === 1 ? "X" : "2", 280, 44 + r * 9);
      }
      // Biliardino rosso e blu in primo piano
      R(g, 212, 118, 92, 36, "#991b1b"); R(g, 218, 122, 80, 22, "#15803d");
      glow(g, 110, 48, 56, "253,224,71", 0.22);
    },

    tp_acacie(g, W, H, f) {
      sky(g, W, H, "#6da0c4", "#e7cba9", 104);
      // Filare di acacie dorate d'autunno sullo sfondo
      for (let i = 0; i < 9; i++) {
        const tx = 14 + i * 36;
        R(g, tx - 2, 74, 5, 32, "#5c3a28");
        C(g, tx, 68 + (i % 2) * 4, 18, i % 2 ? "#d97706" : "#eab308");
        C(g, tx + 6, 64, 13, "#ca8a04");
      }
      // Prato storico del Campo delle Acacie
      R(g, 0, 104, W, 96, "#3f7438");
      for (let i = 0; i < 6; i++) R(g, 0, 108 + i * 16, W, 8, "rgba(255,255,255,0.05)");
      g.strokeStyle = "#f5ebd6"; g.lineWidth = 1.6;
      g.strokeRect(24, 116, 272, 74);
      // Tribunetta di legno verde 1921
      R(g, 22, 80, 124, 28, "#164e3b");
      R(g, 18, 74, 132, 7, "#1f6f54");
      for (let r = 0; r < 3; r++) R(g, 26, 85 + r * 7, 116, 4, "#92400e");
      // Cartello cantiere Sartori piantato a destra
      R(g, 232, 78, 72, 34, "#f5ebd6");
      g.strokeStyle = "#c83228"; g.lineWidth = 2; g.strokeRect(232, 78, 72, 34);
      g.fillStyle = "#c83228"; g.font = "900 5.5px 'Trebuchet MS',sans-serif";
      g.fillText("AREA EDIFICABILE", 240, 90);
      g.fillStyle = "#1e293b"; g.fillText("IMPRESA SARTORI", 241, 101);
      // Foglie d'acacia che cadono
      for (let i = 0; i < 6; i++) {
        C(g, (f * 0.9 + i * 57) % W, (f * 0.6 + i * 33) % 160, 2, "#fde047");
      }
    },

    tp_spogliatoio(g, W, H, f) {
      R(g, 0, 0, W, 138, "#d6ccb8");
      R(g, 0, 84, W, 54, "#1f6f54"); // zoccolatura a smalto verde
      R(g, 0, 138, W, 62, "#8c583a");
      // Maglie storiche verdi-avorio appese ai pioli di legno
      R(g, 20, 44, 168, 4, "#5c3a28");
      for (let i = 0; i < 4; i++) {
        const jx = 34 + i * 38;
        R(g, jx, 48, 22, 28, "#1f6f54");
        R(g, jx + 6, 48, 10, 28, "#f5ebd6");
      }
      // Lavagna tattica a gesso e foto seppia della squadra del 1921
      R(g, 208, 28, 92, 58, "#1e293b");
      g.strokeStyle = "#92400e"; g.lineWidth = 3; g.strokeRect(208, 28, 92, 58);
      g.strokeStyle = "#f5ebd6"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(222, 66); g.lineTo(258, 44); g.lineTo(286, 56); g.stroke();
      // Foto seppia 1921
      R(g, 148, 16, 42, 24, "#78350f"); R(g, 151, 19, 36, 18, "#d6b88c");
      // Panchina di legno con borsa medica e barattolo di grasso di foca
      R(g, 26, 124, 154, 14, "#78350f"); R(g, 36, 138, 8, 18, "#451a03"); R(g, 162, 138, 8, 18, "#451a03");
      R(g, 74, 110, 26, 14, "#991b1b"); R(g, 84, 114, 6, 6, "#fffbeb");
      glow(g, 160, 28, 68, "253,224,71", 0.18 + 0.04 * Math.sin(f * 0.06));
    },

    tp_cameraoscura(g, W, H, f) {
      R(g, 0, 0, W, 142, "#2a0a0e");
      R(g, 0, 142, W, 58, "#1c080b");
      // Lampada inattinica rossa e ambra di Clara Luce
      R(g, 158, 0, 4, 24, "#111827");
      C(g, 160, 28, 8, "#ef4444");
      glow(g, 160, 34, 128, "220,38,38", 0.34 + 0.06 * Math.sin(f * 0.07));
      glow(g, 160, 44, 64, "234,179,8", 0.16);
      // Cordino con le stampe fotografiche appese alle mollette
      g.strokeStyle = "#fca5a5"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(18, 48); g.quadraticCurveTo(160, 62, 302, 46); g.stroke();
      for (let i = 0; i < 5; i++) {
        const px = 38 + i * 54;
        const sw = Math.sin(f * 0.05 + i) * 2;
        R(g, px + sw, 52, 32, 38, "#f5ebd6");
        R(g, px + 3 + sw, 55, 26, 26, i === 2 ? "#78350f" : "#451a03");
        if (i === 2) C(g, px + 16 + sw, 67, 6, "#eab308"); // Il negativo ritrovato di Nando!
      }
      // Bacinelle di sviluppo, arresto e fissaggio + ingranditore Durst
      R(g, 20, 118, 280, 26, "#451a03");
      [[38, "#7f1d1d"], [112, "#991b1b"], [186, "#78350f"]].forEach(([bx, col]) => {
        R(g, bx, 108, 56, 12, "#e5e7eb"); R(g, bx + 3, 110, 50, 8, col);
      });
      R(g, 262, 58, 8, 60, "#94a3b8"); R(g, 250, 74, 28, 18, "#334155");
    },

    tp_galleria(g, W, H, f) {
      sky(g, W, H, "#1e293b", "#475569", 96);
      // Cupola in ferro e vetro liberty della Galleria Umberto
      g.strokeStyle = "#eab308"; g.lineWidth = 2;
      g.beginPath(); g.arc(160, 96, 138, Math.PI, Math.PI * 2); g.stroke();
      for (let i = 1; i < 6; i++) {
        const a = Math.PI + (i * Math.PI) / 6;
        g.beginPath(); g.moveTo(160, 96); g.lineTo(160 + Math.cos(a) * 138, 96 + Math.sin(a) * 96); g.stroke();
      }
      R(g, 0, 56, 78, 84, "#854d0e"); R(g, 242, 56, 78, 84, "#854d0e");
      // Pavimento a mosaico di marmo lucido
      R(g, 0, 138, W, 62, "#d6c7a9");
      g.strokeStyle = "#1f6f54"; g.lineWidth = 2; g.strokeRect(24, 146, 272, 44);
      // Palazzo vetrato «Stampa Moderna» a destra vs Antica Legatoria a sinistra
      R(g, 248, 66, 66, 72, "#0f172a");
      R(g, 250, 58, 62, 10, "#38bdf8");
      g.fillStyle = "#0f172a"; g.font = "900 5px 'Trebuchet MS',sans-serif"; g.fillText("STAMPA MODERNA", 254, 65);
      R(g, 8, 68, 62, 70, "#5c3a28");
      R(g, 10, 60, 58, 9, "#eab308");
      g.fillStyle = "#1c1917"; g.fillText("LEGATORIA LIVIA", 14, 66.5);
      placard(g, 136, 108, 48, 32, liveHead());
      lampPost(g, 98, 86, f); lampPost(g, 222, 86, f);
    },

    tp_stampamoderna(g, W, H, f) {
      R(g, 0, 0, W, 138, "#cbd5e1");
      R(g, 0, 138, W, 62, "#334155");
      // Parete vetrata panoramica di Sartori e plastico del palazzetto-cemento
      R(g, 22, 18, 136, 68, "#0f172a");
      for (let i = 0; i < 5; i++) R(g, 26 + i * 26, 22, 22, 60, "#1e3a5f");
      // Plastico speculativo «Residenza Acacie»
      R(g, 38, 104, 104, 34, "#475569");
      R(g, 46, 98, 88, 8, "#16a34a");
      R(g, 58, 76, 22, 24, "#e2e8f0"); R(g, 88, 70, 26, 30, "#f8fafc");
      // Telescrivente automatica che batte la velina gialla!
      R(g, 188, 88, 64, 50, "#64748b");
      R(g, 196, 74, 48, 16, "#1e293b");
      const paperH = 14 + ((f * 0.25) % 14);
      R(g, 206, 74 - paperH, 28, paperH, "#fef08a");
      // Orologio modernista e insegna Il Corriere Veloce
      C(g, 278, 42, 16, "#0f172a"); C(g, 278, 42, 13, "#f8fafc");
      R(g, 182, 22, 74, 16, "#dc2626");
      g.fillStyle = "#fff"; g.font = "900 5.5px 'Trebuchet MS',sans-serif"; g.fillText("CORRIERE VELOCE", 190, 32);
    },

    tp_legatoria(g, W, H, f) {
      R(g, 0, 0, W, 140, "#4a2c1d");
      R(g, 0, 140, W, 60, "#6b4226");
      // Scaffalature alte fino al soffitto con le annate rilegate dal 1921 al 1968
      for (let sx = 14; sx < 210; sx += 96) {
        R(g, sx, 16, 86, 124, "#361e12");
        for (let r = 0; r < 5; r++) {
          R(g, sx + 4, 22 + r * 23, 78, 18, "#29150c");
          for (let b = 0; b < 9; b++) {
            R(g, sx + 6 + b * 8.4, 24 + r * 23, 7, 16, b % 3 === 0 ? "#991b1b" : b % 3 === 1 ? "#1f6f54" : "#b45309");
          }
        }
      }
      // Torchio a vite in ghisa e oro con il registro del 1921
      R(g, 226, 54, 72, 86, "#5c3a28");
      R(g, 240, 32, 44, 8, "#334155"); R(g, 259, 22, 6, 32, "#eab308");
      R(g, 242, 78, 40, 12, "#f5ebd6"); // volume 1921 aperto
      glow(g, 262, 72, 48, "253,224,71", 0.28 + 0.05 * Math.sin(f * 0.06));
    },

    tp_largo(g, W, H, f) {
      sky(g, W, H, "#1d2d44", "#b45309", 116);
      // Palazzo del Municipio di Borgo Alta con torre civica
      R(g, 88, 28, 144, 96, "#b08968");
      R(g, 138, 6, 44, 30, "#9c6644");
      C(g, 160, 20, 9, "#fef3c7");
      for (let i = 0; i < 5; i++) R(g, 100 + i * 26, 58, 14, 24, "#fde68a");
      // Festoni e striscione per le Acacie
      R(g, 96, 44, 128, 10, "#f5ebd6");
      g.fillStyle = "#1f6f54"; g.font = "900 5.5px 'Trebuchet MS',sans-serif";
      g.fillText("SALVIAMO IL CAMPO DELLE ACACIE", 103, 51);
      R(g, 0, 124, W, 76, "#57534e");
      kiosk(g, 14, 66, f);
      // Furgoncino verde-avorio delle consegne dell'Eco del Pallone
      R(g, 232, 98, 72, 34, "#1f6f54"); R(g, 236, 102, 28, 14, "#bae6fd");
      R(g, 266, 104, 34, 12, "#f5ebd6");
      C(g, 248, 134, 8, "#1c1917"); C(g, 288, 134, 8, "#1c1917");
      lampPost(g, 102, 74, f); lampPost(g, 218, 74, f);
    },

    tp_consiglio(g, W, H, f) {
      R(g, 0, 0, W, 136, "#582f27");
      R(g, 0, 92, W, 44, "#4a2c1d");
      R(g, 0, 136, W, 64, "#7f1d1d");
      // Stemma civico di Borgo Alta e grandi tende di velluto
      R(g, 18, 12, 34, 88, "#1f6f54"); R(g, 268, 12, 34, 88, "#1f6f54");
      R(g, 142, 18, 36, 42, "#eab308"); R(g, 146, 22, 28, 34, "#c83228");
      // Emiciclo di noce e tavolo delle prove del Dossier
      R(g, 64, 96, 192, 36, "#5c3a28");
      R(g, 60, 92, 200, 6, "#92400e");
      placard(g, 118, 76, 42, 20, liveHead());
      R(g, 168, 80, 32, 14, "#fef08a"); // velina e atto 1921
      glow(g, 160, 66, 78, "253,224,71", 0.24 + 0.04 * Math.sin(f * 0.05));
    },

    tp_rotativa(g, W, H, f) {
      R(g, 0, 0, W, 142, "#262322");
      R(g, 0, 142, W, 58, "#3f3a37");
      // La grande Rotativa Marinoni del 1928 rimessa in moto!
      R(g, 42, 36, 236, 106, "#334155");
      R(g, 52, 26, 216, 14, "#c83228");
      g.fillStyle = "#f5ebd6"; g.font = "900 6px 'Trebuchet MS',sans-serif";
      g.fillText("MARINONI · PARIS · FONDATA 1921", 92, 35);
      const a = f * 0.14;
      [[88, 88, 26], [156, 82, 30], [226, 88, 26]].forEach(([cx, cy, r], idx) => {
        C(g, cx, cy, r, idx === 1 ? "#f5ebd6" : "#475569"); // bobina gigante di carta al centro
        C(g, cx, cy, 8, "#eab308");
        g.strokeStyle = "#1e293b"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(cx + Math.cos(a) * (r - 3), cy + Math.sin(a) * (r - 3)); g.lineTo(cx - Math.cos(a) * (r - 3), cy - Math.sin(a) * (r - 3)); g.stroke();
      });
      // Nastro di copie fresche dell'Edizione Straordinaria
      for (let i = 0; i < 6; i++) {
        const nx = 56 + ((f * 1.8 + i * 38) % 210);
        placard(g, nx, 124, 24, 16);
      }
      glow(g, 160, 74, 96, "234,179,8", 0.26);
    },

    tp_finale(g, W, H, f) {
      sky(g, W, H, "#f59e0b", "#fef3c7", 118);
      // Alba dorata sopra i tetti di Borgo Alta e il Campo delle Acacie salvo
      C(g, 248, 52, 22, "#fffbeb");
      glow(g, 248, 52, 64, "254,240,138", 0.5);
      for (let i = 0; i < 6; i++) {
        C(g, 180 + i * 24, 96, 16, "#1f6f54");
      }
      R(g, 0, 114, W, 86, "#4d7c43");
      kiosk(g, 24, 62, f);
      placard(g, 108, 84, 68, 42, liveHead());
      // Rondini nel cielo del mattino
      g.strokeStyle = "#1e293b"; g.lineWidth = 1.4;
      for (let i = 0; i < 5; i++) {
        const bx = (f * 0.8 + i * 54) % (W - 20) + 10;
        const by = 28 + (i % 3) * 12 + Math.sin(f * 0.1 + i) * 3;
        g.beginPath(); g.moveTo(bx - 5, by + 2); g.quadraticCurveTo(bx - 2, by - 2, bx, by + 1); g.quadraticCurveTo(bx + 2, by - 2, bx + 5, by + 2); g.stroke();
      }
    }
  };

  const HOT = {
    tp_titolo: [
      [22, 74, 68, 68, "📰 L'edicola in ferro battuto verde: da quarantasett'anni apre alle cinque e mezza col profumo d'inchiostro fresco."],
      [168, 62, 132, 78, "⚙️ La vetrina della Tipografia di Mezzanotte: dietro i vetri appannati gira la vecchia rotativa Marinoni."],
      [120, 76, 28, 64, "💡 Il lampione di Borgo Alta: nella bruma d'ottobre le pagine appena stampate brillano come rondini."]
    ],
    tp_edicole: [
      [32, 68, 68, 68, "🗞️ Il chiosco di Oreste: espone tutte le testate della provincia, ma il posto d'onore è sempre per L'Eco del Pallone."],
      [114, 84, 56, 40, "📋 La civetta del giorno: riporta a caratteri di scatola il titolo che hai scelto al Bancone di Piombo."],
      [180, 96, 30, 36, "🌰 Il braciere delle caldarroste: cinque lire un cartoccio caldo che scalda le dita macchiate di piombo."],
      [228, 76, 84, 52, "☕ L'ingresso del Bar Sport: vapore di caffè espresso e pronostici del Totocalcio fino a mezzanotte."]
    ],
    tp_linotype: [
      [128, 20, 76, 116, "⌨️ La Linotype di Mastro Goffredo: novanta tasti e un crogiolo di piombo fuso a duecentosettanta gradi."],
      [18, 82, 96, 62, "📰 Il Bancone di Piombo: qui Ada e tu componete titolo, fotografia centrale e colonnino di ogni edizione."],
      [224, 28, 80, 106, "🔤 Le casse dei caratteri Bodoni e Clarendon: ogni lettera di legno di pero ha stampato mille domeniche."]
    ],
    tp_barsport: [
      [50, 42, 52, 40, "☕ La macchina a leva cromata: sbuffa come una locomotiva a ogni tazzina servita agli strilloni."],
      [214, 24, 88, 78, "✏️ La lavagna del Totocalcio: tredici partite a gesso bianco e una matita copiativa legata allo spago."],
      [212, 118, 92, 36, "⚽ Il biliardino in faggio: vietato rullare, parola dei ragazzi dell'Acacie."]
    ],
    tp_acacie: [
      [18, 74, 136, 36, "🏟️ La tribunetta storica del 1921: verniciata di verde edicola dai soci fondatori col cappello della domenica."],
      [230, 76, 76, 38, "🚧 Il cartello dell'Impresa Sartori: promette appartamenti moderni proprio sopra l'area di rigore."],
      [10, 48, 300, 52, "🍂 Il filare delle acacie d'ottobre: quando soffia il vento dal mare piovono foglie d'oro sul gesso bianco."]
    ],
    tp_spogliatoio: [
      [30, 44, 152, 36, "👕 Le maglie verdi con fascia avorio: rammendate a mano e numerate dal 2 all'11 in panno cucito."],
      [208, 28, 92, 58, "📋 La lavagna di gesso: schemi di contropiede per liberare l'ala dentro l'inquadratura di Clara."],
      [148, 16, 42, 24, "🖼️ La foto seppia del 1921: undici operai tipografi e ferrovieri nel giorno dell'inaugurazione del campo."]
    ],
    tp_cameraoscura: [
      [144, 0, 32, 42, "🔴 La lampada inattinica rossa: protegge la carta al bromuro d'argento mentre l'immagine affiora dal nulla."],
      [34, 48, 252, 46, "🎞️ Il filo dei negativi ad asciugare: al centro brilla il rullino dimenticato dal fratello Nando."],
      [34, 106, 212, 20, "🧪 Le tre bacinelle di Clara: sviluppo, bagno d'arresto all'aceto e fissaggio profumato d'iposolfito."]
    ],
    tp_galleria: [
      [22, 0, 276, 96, "🏛️ La volta in ferro e vetro della Galleria Umberto: amplifica i passi e il grido degli strilloni."],
      [246, 56, 70, 82, "🏢 La sede vetrata di Stampa Moderna: neon freddi, moquette grigia e telescriventi accese giorno e notte."],
      [6, 58, 66, 80, "📚 L'Antica Legatoria di Livia: profumo di colla di farina, pelle marocchina e carte notarili."]
    ],
    tp_stampamoderna: [
      [38, 70, 104, 68, "🏗️ Il plastico di «Residenza Acacie»: otto piani di cemento al posto delle porte in legno e dei tigli."],
      [188, 60, 64, 78, "📠 La telescrivente del Commendator Sartori: sta battendo una velina riservata indirizzata all'Ufficio Tecnico."],
      [182, 20, 114, 38, "🕓 L'orologio e l'insegna del Corriere Veloce: qui le notizie si misurano a centimetri di pubblicità."]
    ],
    tp_legatoria: [
      [14, 16, 190, 124, "📖 La raccolta completa dell'Eco del Pallone: ogni annata dal 1921 ha il dorso cucito a filo refe."],
      [226, 22, 72, 118, "⚙️ Il torchio a vite d'ottone: sotto la piastra riposa l'atto originale del lascito sportivo del 1921."],
      [238, 74, 48, 20, "📜 Il rogito su carta bollata: vincola in perpetuo il prato delle Acacie al gioco libero dei ragazzi."]
    ],
    tp_largo: [
      [88, 6, 144, 118, "🏛️ Il Municipio di Borgo Alta: nella sala al primo piano si decide il destino del Campo delle Acacie."],
      [14, 66, 68, 68, "📰 L'edicola del Largo: circondata dai cittadini che leggono l'inchiesta ancora tiepida di stampa."],
      [232, 98, 72, 44, "🚐 Il furgoncino dell'Eco del Pallone: pronto a portare le copie fresche in tutte le frazioni."]
    ],
    tp_consiglio: [
      [142, 18, 36, 42, "🛡️ Lo stemma storico di Borgo Alta: ricorda quando il Comune accettò il lascito popolare del 1921."],
      [60, 76, 200, 56, "⚖️ Il banco del Consiglio Comunale: qui le prove del tuo Dossier parlano davanti a tutto il quartiere."],
      [18, 12, 284, 88, "🟩 I drappi verdi della sala civica: le tribune del pubblico sono gremite di lettori e strilloni."]
    ],
    tp_rotativa: [
      [42, 26, 236, 116, "⚙️ La Rotativa Marinoni del 1928: tre cilindri di ghisa e una bobina madre che profuma di pino e piombo."],
      [124, 50, 64, 64, "🧻 La grande bobina di carta avorio: settantamila giri pronti a correre verso l'alba."],
      [52, 120, 220, 22, "📰 Il nastro dell'Edizione Straordinaria: le copie scendono piegate una dietro l'altra senza fermarsi."]
    ],
    tp_finale: [
      [24, 62, 68, 68, "🌅 L'edicola all'alba: la fila dei lettori arriva fino alla fontana col giornale sotto il braccio."],
      [108, 84, 68, 42, "📰 L'Ultima Edizione diventata la Prima di una nuova storia: il Campo delle Acacie è salvo."],
      [180, 18, 130, 64, "🐦 Le rondini sopra Borgo Alta: salutano il fischio d'inizio sul prato salvato dall'inchiostro."]
    ]
  };

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) {
      Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    } else if ((n || 0) < 80) {
      setTimeout(() => reg((n || 0) + 1), 150);
    }
  }
  reg(0);
})();
