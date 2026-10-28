// js/onde-bg.js — 14 sfondi illustrati e animati (320×200) per «Radio Fuorigioco · Onde Corte sul Golfo (1977)»
// Registrati in window.__lbBg con 3 punti toccabili ciascuno.
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
    gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  const waves = (g, W, y0, H, f, c1, c2) => {
    R(g, 0, y0, W, H - y0, c1);
    g.fillStyle = c2;
    for (let i = 0; i < 18; i++) {
      const x = ((i * 26 + f * 0.5) % (W + 30)) - 15;
      const y = y0 + 6 + (i * 11) % Math.max(8, H - y0 - 10);
      g.fillRect(x, y, 16, 2);
    }
  };

  const SC = {
    // Copertina: la Rondine Rossa a 12,5 miglia nella nebbia d'ottobre con onde radio dorate
    rf_titolo(g, W, H, f) {
      sky(g, W, H, "#0b1324", "#1e293b", 132);
      // Costa lontana di Borgo di Rondine coi puntini caldi
      R(g, 0, 118, W, 14, "#111827");
      for (let i = 0; i < 22; i++) R(g, 8 + i * 14, 121 + (i % 3) * 2, 2, 2, i % 4 === 0 ? "#fde68a" : "#f59e0b");
      waves(g, W, 130, H, f, "#0f243d", "#1e3a5f");
      const bob = Math.sin(f * 0.05) * 2.5;
      g.save(); g.translate(0, bob);
      // Scafo rosso minio del rimorchiatore
      g.fillStyle = "#991b1b";
      g.beginPath(); g.moveTo(86, 138); g.lineTo(234, 138); g.lineTo(218, 160); g.lineTo(98, 160); g.closePath(); g.fill();
      R(g, 92, 136, 136, 4, "#f8fafc");
      // Tuga e cabina
      R(g, 118, 108, 72, 28, "#3f4d3b"); R(g, 130, 92, 44, 18, "#4b5563");
      C(g, 136, 122, 5, "#fde68a"); C(g, 156, 122, 5, "#fde68a"); C(g, 176, 122, 5, "#ef4444");
      // Fumaiolo e albero radio
      R(g, 180, 78, 12, 30, "#7f1d1d"); R(g, 180, 84, 12, 5, "#fbbf24");
      g.strokeStyle = "#cbd5e1"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(152, 92); g.lineTo(152, 26); g.moveTo(140, 42); g.lineTo(164, 42); g.stroke();
      g.restore();
      // Anelli radio 99.9 MHz
      const rPulse = (f * 0.9) % 72;
      [rPulse, (rPulse + 24) % 72, (rPulse + 48) % 72].forEach((r) => {
        g.strokeStyle = `rgba(251,191,36,${Math.max(0, 0.75 - r / 75)})`;
        g.lineWidth = 1.6;
        g.beginPath(); g.arc(152, 28 + bob, 8 + r, 0, Math.PI * 2); g.stroke();
      });
      C(g, 152, 26 + bob, 3.5, Math.sin(f * 0.2) > 0 ? "#ef4444" : "#fde68a");
      glow(g, 152, 26 + bob, 32, "251,191,36", 0.35);
      // Banchi di nebbia
      g.fillStyle = "rgba(148,163,184,0.14)";
      R(g, ((f * 0.4) % 380) - 80, 124, 130, 12, "rgba(148,163,184,0.15)");
      R(g, ((f * 0.28 + 180) % 380) - 80, 148, 150, 10, "rgba(148,163,184,0.12)");
    },

    // Esterno 1: Pontile delle Nebbie & Scogliera del Carbone
    rf_pontile(g, W, H, f) {
      sky(g, W, H, "#1e293b", "#475569", 108);
      waves(g, W, 108, H, f, "#172554", "#1e3a8a");
      // Magazzini di mattoni rossi a sinistra
      R(g, 0, 56, 98, 76, "#7c2d12"); R(g, 0, 48, 102, 10, "#451a03");
      R(g, 14, 78, 22, 26, "#fde68a"); R(g, 52, 82, 28, 18, "#cbd5e1"); // manifesto
      // Banchina di carbone e gesso
      R(g, 0, 126, 250, 74, "#1e293b");
      R(g, 92, 134, 118, 56, "#111827");
      g.strokeStyle = "rgba(255,255,255,0.55)"; g.strokeRect(102, 140, 96, 42);
      // Cabina telefonica arancione SIP
      R(g, 26, 92, 24, 44, "#ea580c"); R(g, 30, 98, 16, 22, "#fef08a"); R(g, 24, 89, 28, 5, "#c2410c");
      glow(g, 38, 108, 36, "245,158,11", 0.35);
      // Sacchi di carbone col palo disegnato col gesso
      C(g, 198, 166, 14, "#090d16"); C(g, 214, 168, 13, "#0f172a"); C(g, 206, 156, 12, "#1e293b");
      R(g, 204, 146, 3, 24, "#f8fafc");
      // Molo est e faro verde di testata
      R(g, 240, 116, 80, 14, "#451a03");
      R(g, 284, 72, 12, 46, "#cbd5e1"); R(g, 282, 64, 16, 10, "#14532d");
      const blink = Math.sin(f * 0.14) > 0;
      C(g, 290, 69, 4, blink ? "#4ade80" : "#166534");
      if (blink) glow(g, 290, 69, 46, "74,222,128", 0.48);
      // Fumo bianco dal chiusino
      C(g, 74, 152 - (f % 30) * 0.5, 5 + (f % 30) * 0.2, "rgba(226,232,240,0.22)");
    },

    // Interno 1A: Cabina di Trasmissione della «Rondine Rossa»
    rf_cabina(g, W, H, f) {
      R(g, 0, 0, W, H, "#2c382b");
      // Cartoni delle uova fonoassorbenti
      for (let y = 10; y < 120; y += 16) for (let x = 10; x < W - 10; x += 18) R(g, x, y, 10, 10, "#3a4838");
      // Cartello IN ONDA
      const onAir = Math.sin(f * 0.25) > -0.8;
      R(g, 114, 14, 92, 22, "#1f2937");
      R(g, 118, 17, 84, 16, onAir ? "#dc2626" : "#7f1d1d");
      g.fillStyle = "#fff"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText("IN ONDA 99.9", 160, 29); g.textAlign = "left";
      if (onAir) glow(g, 160, 25, 48, "239,68,68", 0.35);
      // Oblò rotondo in ottone a destra
      C(g, 262, 66, 28, "#b45309"); C(g, 262, 66, 22, "#0f172a");
      R(g, 242, 70, 40, 14, "#1e3a8a");
      for (let i = 0; i < 5; i++) R(g, 246 + i * 7, 65, 2, 2, "#fde68a");
      // Scolapasta sonoro appeso a sinistra
      g.strokeStyle = "#94a3b8"; g.beginPath(); g.moveTo(56, 24); g.lineTo(56, 54); g.stroke();
      C(g, 56, 62, 14, "#cbd5e1"); R(g, 42, 48, 28, 12, "#2c382b");
      // Banco mixer analogico e due piatti 45 giri
      R(g, 18, 118, 284, 82, "#5c3a21"); R(g, 24, 122, 272, 42, "#1e293b");
      for (let i = 0; i < 4; i++) {
        R(g, 112 + i * 24, 128, 18, 12, "#fef3c7");
        const ang = -0.6 + Math.sin(f * 0.22 + i) * 0.5;
        g.strokeStyle = "#dc2626"; g.beginPath(); g.moveTo(121 + i * 24, 139); g.lineTo(121 + i * 24 + Math.sin(ang) * 9, 139 - Math.cos(ang) * 8); g.stroke();
      }
      // Due giradischi che ruotano
      [62, 252].forEach((cx, k) => {
        C(g, cx, 144, 18, "#94a3b8"); C(g, cx, 144, 15, "#090d16");
        C(g, cx, 144, 6, k === 0 ? "#ef4444" : "#f59e0b");
        const a = f * 0.12 + k;
        R(g, cx + Math.cos(a) * 9, 144 + Math.sin(a) * 9, 2, 2, "#fff");
      });
    },

    // Interno 1B: Bottega «Dischi & Valvole Zappa»
    rf_bottega(g, W, H, f) {
      R(g, 0, 0, W, H, "#451a03");
      R(g, 0, 138, W, 62, "#78350f");
      // Scaffali in formica senape pieni di vinili
      R(g, 12, 20, 186, 98, "#b45309");
      for (let r = 0; r < 3; r++) {
        R(g, 18, 26 + r * 30, 174, 24, "#292524");
        for (let i = 0; i < 22; i++) R(g, 22 + i * 7.6, 28 + r * 30, 5, 20, ["#ef4444", "#eab308", "#38bdf8", "#a855f7", "#f8fafc"][(i + r) % 5]);
      }
      // Cabina d'ascolto in velluto a destra
      R(g, 222, 22, 82, 116, "#7f1d1d"); R(g, 232, 34, 62, 92, "#450a0a");
      C(g, 254, 68, 9, "#1f2937"); C(g, 272, 68, 9, "#1f2937"); // cuffie
      // Bancone con mangiadischi arancione e cassetto valvole
      R(g, 20, 124, 190, 58, "#92400e"); R(g, 18, 120, 194, 8, "#eab308");
      R(g, 42, 98, 44, 24, "#f97316"); R(g, 52, 93, 24, 6, "#090d16"); // mangiadischi + 45g
      // Cassetto valvole ambrate
      R(g, 128, 136, 68, 28, "#292524");
      for (let i = 0; i < 4; i++) {
        C(g, 140 + i * 14, 148, 5, "#fbbf24");
        glow(g, 140 + i * 14, 148, 16, "251,191,36", 0.3 + Math.sin(f * 0.1 + i) * 0.1);
      }
    },

    // Esterno 2: Quartiere delle Antenne & Cortili di Borgo Vecchio
    rf_cortili(g, W, H, f) {
      sky(g, W, H, "#475569", "#94a3b8", 120);
      // Case liguri e tetti di coppi
      R(g, 8, 52, 88, 128, "#b45309"); R(g, 4, 42, 96, 12, "#7c2d12");
      R(g, 214, 44, 98, 136, "#9a3412"); R(g, 210, 34, 106, 12, "#7c2d12");
      R(g, 96, 86, 118, 94, "#64748b");
      R(g, 0, 164, W, 36, "#334155");
      // Antenne sui tetti + antenna a baffo su scopa
      g.strokeStyle = "#1e293b"; g.lineWidth = 2;
      [34, 72, 238, 282].forEach((ax, i) => {
        g.beginPath(); g.moveTo(ax, 42 - (i > 1 ? 8 : 0)); g.lineTo(ax, 14); g.moveTo(ax - 12, 20); g.lineTo(ax + 12, 20); g.moveTo(ax - 8, 28); g.lineTo(ax + 8, 28); g.stroke();
      });
      if (f % 24 < 6) C(g, 238, 16, 3, "#38bdf8");
      // Filo dei panni con maglia n.9
      g.strokeStyle = "#e2e8f0"; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(88, 76); g.quadraticCurveTo(155, 88 + Math.sin(f * 0.08) * 3, 220, 72); g.stroke();
      const sway = Math.sin(f * 0.08) * 3;
      R(g, 112 + sway, 80, 18, 22, "#f8fafc");
      R(g, 146 + sway, 82, 20, 24, "#991b1b"); // maglia n.9
      g.fillStyle = "#fde68a"; g.font = "bold 10px sans-serif"; g.fillText("9", 153 + sway, 98);
      R(g, 182 + sway, 79, 16, 20, "#cbd5e1");
      // Murale bianco sul muretto
      R(g, 102, 138, 108, 22, "#475569");
      g.fillStyle = "#f8fafc"; g.font = "bold 8px sans-serif"; g.fillText("GIÙ LE MANI DAL MOLO", 107, 152);
      // Furgone giallo ministeriale in fondo
      R(g, 18, 148, 54, 26, "#eab308"); R(g, 54, 152, 14, 12, "#bae6fd"); C(g, 70, 166, 4, "#fef08a");
    },

    // Interno 2A: Furgone Goniometrico Ministeriale «Unità 04»
    rf_furgone(g, W, H, f) {
      R(g, 0, 0, W, H, "#1f2d28");
      R(g, 12, 14, W - 24, H - 28, "#2c3e36");
      // Mappa plastificata del golfo con spilli e spago
      R(g, 114, 22, 116, 74, "#fef3c7"); R(g, 156, 26, 70, 66, "#93c5fd");
      g.strokeStyle = "#dc2626"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(138, 44); g.lineTo(196, 58); g.lineTo(152, 76); g.stroke();
      [[138, 44, "#dc2626"], [196, 58, "#2563eb"], [152, 76, "#dc2626"]].forEach(([x, y, c]) => C(g, x, y, 3.5, c));
      // Oscilloscopio circolare ai fosfori verdi a sinistra
      R(g, 24, 30, 74, 72, "#111827"); C(g, 61, 66, 26, "#022c22");
      g.strokeStyle = "#34d399"; g.lineWidth = 1.6;
      g.beginPath();
      for (let x = -22; x <= 22; x += 2) {
        const y = Math.sin(x * 0.32 + f * 0.16) * 11;
        if (x === -22) g.moveTo(61 + x, 66 + y); else g.lineTo(61 + x, 66 + y);
      }
      g.stroke();
      // Banco inferiore con fascicolo «Pratica 99.9» e timbro di piombo
      R(g, 18, 124, 284, 62, "#374151");
      R(g, 242, 42, 52, 54, "#4b5563"); C(g, 256, 62, 9, "#1f2937"); C(g, 280, 62, 9, "#1f2937"); // bobine
      R(g, 212, 134, 74, 38, "#d97706"); // fascicolo cartonato
      g.fillStyle = "#1c1917"; g.font = "bold 8px sans-serif"; g.fillText("PRATICA 99.9", 218, 154);
      R(g, 56, 134, 18, 28, "#94a3b8"); // termos caffè
    },

    // Interno 2B: Bar Eldorado del Telefono a Gettoni
    rf_bar(g, W, H, f) {
      R(g, 0, 0, W, 136, "#fef3c7");
      // Pavimento a scacchi crema e bordeaux
      for (let y = 136; y < H; y += 16) for (let x = 0; x < W; x += 16) R(g, x, y, 16, 16, ((x + y) / 16) % 2 === 0 ? "#fde68a" : "#7f1d1d");
      // Bancone con macchina espresso e ciotola gettoni
      R(g, 16, 92, 152, 56, "#78350f"); R(g, 14, 86, 156, 8, "#b45309");
      R(g, 36, 56, 38, 30, "#cbd5e1"); R(g, 42, 62, 26, 14, "#94a3b8"); // espresso cromata
      C(g, 68, 52 - (f % 20) * 0.6, 5, "rgba(255,255,255,0.45)");
      // Ciotola gettoni
      R(g, 112, 76, 32, 10, "#94a3b8"); C(g, 122, 76, 4, "#fbbf24"); C(g, 132, 76, 4, "#d97706");
      // Bacheca schedine Totocalcio al centro
      R(g, 182, 32, 46, 58, "#14532d"); R(g, 188, 38, 16, 22, "#f8fafc"); R(g, 208, 42, 14, 20, "#fef08a");
      // Nicchia legno col telefono grigio a disco a destra
      R(g, 240, 26, 66, 118, "#5c3a21"); R(g, 248, 34, 50, 102, "#78350f");
      R(g, 258, 56, 30, 36, "#64748b"); C(g, 273, 76, 9, "#e2e8f0"); // disco combinatore
    },

    // Esterno 3: Ponte Bagnato della «Rondine Rossa» in Mare Aperto
    rf_ponte(g, W, H, f) {
      const flash = f % 95 < 4;
      sky(g, W, H, flash ? "#64748b" : "#090d16", "#1e293b", 96);
      waves(g, W, 92, H, f, "#0b1930", "#1e3a8a");
      // Faro lontano della motovedetta a destra
      C(g, 292, 92, 3, "#fde68a");
      glow(g, 292, 92, 26, "253,230,138", 0.45);
      // Ponte della nave visto in scorcio
      g.fillStyle = "#334155";
      g.beginPath(); g.moveTo(26, 198); g.lineTo(86, 108); g.lineTo(234, 108); g.lineTo(294, 198); g.closePath(); g.fill();
      g.strokeStyle = "#991b1b"; g.lineWidth = 4; g.stroke();
      // Campana d'ottone di prua col calzino di lana a sinistra
      C(g, 74, 134, 9, "#eab308"); R(g, 71, 140, 6, 8, "#dc2626");
      // Grande traliccio dell'antenna maestra al centro
      g.strokeStyle = "#cbd5e1"; g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(146, 132); g.lineTo(160, 18); g.lineTo(174, 132); g.moveTo(150, 92); g.lineTo(170, 92); g.moveTo(154, 56); g.lineTo(166, 56); g.stroke();
      g.strokeStyle = "rgba(226,232,240,0.45)"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(160, 26); g.lineTo(66, 150); g.moveTo(160, 26); g.lineTo(254, 150); g.stroke();
      // Pioggia diagonale
      g.strokeStyle = "rgba(186,230,253,0.32)";
      for (let i = 0; i < 28; i++) {
        const rx = ((i * 37 + f * 3) % (W + 40)) - 20, ry = ((i * 29 + f * 5) % H);
        g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 6, ry + 11); g.stroke();
      }
    },

    // Interno 3A: Sala Macchine & Caldaia Diesel
    rf_macchine(g, W, H, f) {
      R(g, 0, 0, W, H, "#1c1917");
      R(g, 0, 148, W, 52, "#292524");
      glow(g, 160, 120, 110, "234,88,12", 0.28);
      // Blocco motore diesel coi pistoni in movimento
      R(g, 92, 68, 136, 86, "#44403c"); R(g, 100, 52, 120, 20, "#78350f");
      for (let i = 0; i < 3; i++) {
        const py = Math.sin(f * 0.25 + i * 2) * 8;
        R(g, 116 + i * 36, 36 + py, 16, 22, "#cbd5e1");
      }
      // Manometro principale col segno rosso a sinistra
      C(g, 52, 66, 22, "#b45309"); C(g, 52, 66, 18, "#fef3c7");
      g.strokeStyle = "#dc2626"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(52, 66); g.lineTo(52 + Math.cos(f * 0.1) * 13, 66 - 10); g.stroke();
      // Rastrelliera chiavi inglesi al centro-destra
      R(g, 246, 34, 58, 46, "#292524");
      for (let i = 0; i < 5; i++) R(g, 252 + i * 10, 40, 4, 28 - i * 3, "#94a3b8");
      // Radiolina legata al tubo caldo con una forchetta
      R(g, 244, 104, 76, 12, "#9a3412");
      R(g, 256, 86, 28, 18, "#ef4444"); R(g, 276, 70, 3, 16, "#e2e8f0");
    },

    // Interno 3B: Archivio Segreto delle Mille Bobine
    rf_bobine(g, W, H, f) {
      R(g, 0, 0, W, H, "#23140d");
      // Casellari delle 1.095 bobine avorio
      R(g, 14, 16, 196, 126, "#3b2114");
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 14; c++) {
          const empty = r === 4 && c > 2;
          R(g, 20 + c * 13, 22 + r * 23, 10, 18, empty ? "#1a0e08" : (r === 4 && c === 2 ? "#fbbf24" : "#fef3c7"));
        }
      }
      // Maglia storica numero 10 incorniciata a destra
      R(g, 228, 22, 74, 84, "#451a03"); R(g, 234, 28, 62, 72, "#1e293b");
      R(g, 246, 38, 38, 48, "#991b1b"); R(g, 258, 38, 14, 48, "#1d4ed8");
      g.fillStyle = "#fde68a"; g.font = "bold 16px sans-serif"; g.fillText("10", 255, 67);
      // Scrivania mogano con lampada verde smeraldo e quaderno meteo
      R(g, 38, 140, 248, 60, "#451a03");
      R(g, 134, 126, 48, 16, "#fef3c7"); // quaderno appunti
      R(g, 76, 108, 26, 14, "#059669"); R(g, 87, 122, 4, 18, "#b45309"); // lampada verde
      glow(g, 89, 126, 68, "52,211,153", 0.25 + Math.sin(f * 0.04) * 0.04);
      // Polvere dorata sospesa
      for (let i = 0; i < 10; i++) R(g, 62 + ((i * 19 + f * 0.2) % 90), 96 + ((i * 13 + f * 0.15) % 48), 1.5, 1.5, "rgba(253,230,138,0.55)");
    },

    // Esterno 4: Stadio del Molo Vecchio Assediato
    rf_stadio(g, W, H, f) {
      sky(g, W, H, "#090d16", "#0c4a6e", 98);
      waves(g, W, 94, 132, f, "#082f49", "#0369a1");
      // Prua della Rondine Rossa affiancata alla banchina a sinistra
      g.fillStyle = "#991b1b";
      g.beginPath(); g.moveTo(0, 88); g.lineTo(66, 98); g.lineTo(52, 126); g.lineTo(0, 126); g.closePath(); g.fill();
      // Muro di cinta lato mare con spuma bianca e campo storico
      R(g, 64, 114, 256, 12, "#475569");
      if (f % 36 < 14) C(g, 96, 110, 8, "rgba(248,250,252,0.75)");
      R(g, 0, 126, W, 74, "#14532d");
      g.strokeStyle = "rgba(255,255,255,0.65)"; g.strokeRect(72, 134, 232, 56);
      // Cavo elettrico gigante tra nave e torre faro
      g.strokeStyle = "#090d16"; g.lineWidth = 4;
      g.beginPath(); g.moveTo(44, 104); g.quadraticCurveTo(86, 132, 118, 52); g.stroke();
      // Torri faro accese col generatore diesel
      const pulse = 0.35 + Math.sin(f * 0.18) * 0.06;
      [118, 274].forEach((tx) => {
        R(g, tx - 2, 42, 4, 84, "#94a3b8"); R(g, tx - 10, 34, 20, 10, "#fef08a");
        glow(g, tx, 40, 72, "253,224,71", pulse);
      });
      // Ruspa gialla spenta con sciarpa a sinistra in basso
      R(g, 12, 146, 42, 24, "#eab308"); R(g, 48, 152, 14, 18, "#ca8a04");
      R(g, 52, 148, 12, 5, "#991b1b"); // sciarpa del Borgo
      // Puntini radioline sugli spalti
      for (let i = 0; i < 24; i++) R(g, 130 + i * 6, 104 + (i % 3) * 3, 2, 2, i % 2 ? "#fde68a" : "#34d399");
    },

    // Interno 4A: Spogliatoio di Calce & Tunnel degli Altoparlanti
    rf_spogliatoio(g, W, H, f) {
      R(g, 0, 0, W, 144, "#e2e8f0");
      R(g, 0, 144, W, 56, "#64748b");
      // Lavagna tattica d'ardesia del 1958 a sinistra
      R(g, 20, 36, 86, 58, "#451a03"); R(g, 24, 40, 78, 50, "#1e293b");
      g.strokeStyle = "rgba(255,255,255,0.45)"; g.strokeRect(30, 46, 66, 38);
      g.fillStyle = "rgba(253,230,138,0.75)"; g.font = "bold 7px sans-serif"; g.fillText("Marini - Valli", 38, 68);
      // Porta del tunnel e altoparlante a tromba sopra l'uscita
      R(g, 132, 48, 58, 96, "#0f172a");
      g.fillStyle = "#94a3b8";
      g.beginPath(); g.moveTo(152, 28); g.lineTo(176, 18); g.lineTo(176, 40); g.closePath(); g.fill();
      if (f % 16 < 8) { g.strokeStyle = "#f59e0b"; g.beginPath(); g.arc(182, 29, 8, -0.7, 0.7); g.stroke(); }
      // Armadietto n. 10 ammaccato a destra + panca di legno
      R(g, 222, 34, 74, 110, "#475569"); g.strokeStyle = "#1e293b"; g.strokeRect(226, 38, 32, 102); g.strokeRect(260, 38, 32, 102);
      g.fillStyle = "#fde68a"; g.font = "bold 11px sans-serif"; g.fillText("10", 236, 56);
      R(g, 18, 128, 96, 12, "#92400e");
    },

    // Interno 4B: Torretta del Cronista & Cabina Ponti Radio
    rf_torretta(g, W, H, f) {
      R(g, 0, 0, W, H, "#292524");
      // Grande vetrata panoramica sul campo illuminato e sul mare
      R(g, 18, 16, 284, 98, "#090d16");
      R(g, 22, 68, 276, 42, "#15803d");
      g.strokeStyle = "rgba(255,255,255,0.6)"; g.strokeRect(42, 74, 236, 30);
      glow(g, 90, 48, 52, "253,224,71", 0.32); glow(g, 230, 48, 52, "253,224,71", 0.32);
      // Gocce di pioggia sui vetri
      g.fillStyle = "rgba(186,230,253,0.45)";
      for (let i = 0; i < 16; i++) R(g, 30 + (i * 19) % 260, 22 + ((i * 17 + f * 0.4) % 84), 1.5, 4, "rgba(186,230,253,0.45)");
      // Banco del cronista: microfono cromato, pinza piombatrice del Ministero e segnapunti a palette
      R(g, 14, 122, 292, 78, "#5c3a21");
      C(g, 156, 108, 8, "#cbd5e1"); R(g, 154, 116, 4, 18, "#94a3b8"); // microfono
      // Pinza piombatrice e sigilli di piombo a sinistra
      R(g, 42, 134, 48, 26, "#334155"); R(g, 52, 142, 28, 6, "#94a3b8"); C(g, 82, 145, 5, "#dc2626");
      // Vecchio segnapunti manuale a palette di latta a destra
      R(g, 224, 128, 66, 36, "#1e293b"); R(g, 232, 134, 22, 24, "#f8fafc"); R(g, 260, 134, 22, 24, "#f8fafc");
      g.fillStyle = "#0f172a"; g.font = "bold 15px sans-serif"; g.fillText("9", 239, 152); g.fillText("9", 267, 152);
    },

    // Alba sul Golfo: finale e Cineteca
    rf_finale(g, W, H, f) {
      sky(g, W, H, "#1e1b4b", "#f97316", 124);
      C(g, 160, 112, 28, "#fde68a");
      glow(g, 160, 112, 90, "251,191,36", 0.45);
      waves(g, W, 122, H, f, "#1e3a8a", "#f59e0b");
      const bob = Math.sin(f * 0.04) * 2;
      g.fillStyle = "#7f1d1d";
      g.beginPath(); g.moveTo(104, 132 + bob); g.lineTo(216, 132 + bob); g.lineTo(204, 150 + bob); g.lineTo(116, 150 + bob); g.closePath(); g.fill();
      R(g, 134, 112 + bob, 48, 20, "#3f4d3b");
      g.strokeStyle = "#fde68a"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(158, 112 + bob); g.lineTo(158, 56 + bob); g.stroke();
      const rp = (f * 0.8) % 60;
      g.strokeStyle = `rgba(254,240,138,${Math.max(0, 0.7 - rp / 65)})`;
      g.beginPath(); g.arc(158, 58 + bob, 8 + rp, 0, Math.PI * 2); g.stroke();
    }
  };

  const HOT = {
    rf_titolo: [
      [130, 18, 48, 54, "📻 Antenna maestra 99.9 MHz: piantata mezzo metro fuori dalle acque territoriali per cantare libera sul golfo."],
      [88, 104, 144, 56, "🚢 Rimorchiatore «Rondine Rossa»: ex carboniero tenuto insieme da vernice minio, valvole calde e testardaggine."],
      [10, 114, 300, 18, "🌃 Luci di Borgo di Rondine: ogni puntino giallo sul lungomare è una radiolina accesa dietro i vetri."]
    ],
    rf_pontile: [
      [20, 86, 36, 52, "☎️ Cabina telefonica arancione SIP: nella fessura di restituzione tintinna ancora un gettone dimenticato dall'ultimo chiamante."],
      [274, 58, 30, 62, "🟢 Faro verde di testata molo: lampeggia un ritmo regolare che Lupo sostiene essere «un chiaro 4-4-2 luminoso»."],
      [184, 142, 46, 40, "⚽ Sacchi di carbone col gesso bianco: il segno storto del palo disegnato dai ragazzi del porto nel 1958, ripassato ogni domenica."]
    ],
    rf_cabina: [
      [112, 12, 96, 26, "🔴 Cartello luminoso «IN ONDA»: sfarfalla con una scintilla innocua; Nilde avverte che se diventa viola stiamo trasmettendo nei citofoni della Questura."],
      [38, 42, 36, 38, "🥣 Scolapasta appeso al microfono: toccandolo produce il leggendario «boato del Maracanã» usato da Lupo nelle radiocronache a budget zero."],
      [232, 36, 60, 60, "🌊 Oblò rotondo in ottone: fuori scorre la schiuma scura del mare aperto e la fila tremula delle luci di Borgo di Rondine."]
    ],
    rf_bottega: [
      [38, 90, 54, 34, "💿 Mangiadischi arancione sul bancone: sputa fuori mezzo centimetro un 45 giri graffiato con un inno calcistico cantato fuori tempo."],
      [124, 132, 76, 36, "💡 Cassetto «Valvole Sovietiche d'Occasione»: brilla d'ambra; il cartellino avverte «Scaldano anche il caffè, non toccare coi guanti bagnati»."],
      [220, 22, 86, 116, "🎧 Cabina d'ascolto in velluto liso: due cuffie enormi penzolano dal gancio lasciando uscire un giro di basso ovattato."]
    ],
    rf_cortili: [
      [106, 74, 96, 38, "👕 Filo dei panni tra due balconi: una maglia di lana numero 9 asciuga a testa in giù oscillando come una bandierina del corner."],
      [224, 10, 32, 36, "📡 Antenna a baffo legata a un manico di scopa: vibra emettendo tre note di chitarra ogni volta che passa un motorino sotto il vicolo."],
      [100, 134, 114, 28, "🖌️ Muretto «GIÙ LE MANI DAL MOLO»: la vernice bianca è ancora fresca e profuma d'acquaragia in tutto il cortile."]
    ],
    rf_furgone: [
      [22, 28, 78, 76, "🟢 Oscilloscopio circolare verde: l'onda ai fosfori disegna per un istante la sagoma perfetta di un pallone prima di tornare dritta."],
      [112, 20, 120, 78, "📍 Mappa del golfo con gli spilli: tre spilli puntano per errore sul pollaio di zia Irma perché la rete metallica riflette i megahertz."],
      [208, 130, 82, 46, "📁 Fascicolo «Pratica 99.9»: un appunto a stilografica dell'Ispettore Valli recita «Trasmettono musica discutibile, ma crossano ancora bene»."]
    ],
    rf_bar: [
      [246, 34, 56, 98, "☎️ Telefono grigio a disco: alzando la cornetta si sente la signora Adelina che fa già le prove generali della sua telefonata di mezzanotte."],
      [108, 70, 40, 20, "🪙 Ciotola di alluminio coi gettoni scanalati: Wanda giura di distinguere a orecchio i gettoni fortunati da quelli che mangiano la linea."],
      [180, 30, 50, 62, "📋 Bacheca delle schedine Totocalcio: una colonna giocata con tredici «X» fisse porta la firma «Per chi non sa mai decidersi»."]
    ],
    rf_ponte: [
      [140, 16, 42, 120, "📡 Traliccio dell'antenna maestra: i cavi d'acciaio tesi nella burrasca suonano come le corde di un contrabbasso gigante."],
      [60, 122, 28, 30, "🔔 Campana di ottone di prua: ha un calzino di lana infilato sul batacchio per non entrare nei microfoni durante la diretta."],
      [276, 80, 32, 26, "🔦 Faro della motovedetta all'orizzonte: scruta la linea invisibile delle dodici miglia dondolando sulle onde nere."]
    ],
    rf_macchine: [
      [28, 42, 48, 48, "🧭 Manometro principale: sopra il segno a pennarello rosso del limite massimo c'è scritto «Velocità da recupero al 92°»."],
      [244, 32, 62, 50, "🔧 Rastrelliera delle chiavi inglesi: Tullio le ha ordinate per nota musicale quando cadono sul pagliolato di ferro."],
      [244, 68, 56, 50, "📻 Radiolina legata al tubo caldo: prende il segnale attraverso tre centimetri di scafo grazie a una forchetta infilata nell'antenna."]
    ],
    rf_bobine: [
      [18, 106, 192, 36, "📼 Casellario dell'ultima fila in basso: resta un'unica scatola piena con la data di domenica scritta da Cesare; le successive sono vuote."],
      [130, 122, 56, 24, "📓 Quaderno degli appunti meteorologici: «Se piove forte, dì a Nilde di chiudere il colletto e non litigare con Tullio»."],
      [228, 22, 74, 84, "👕 Maglia di lana numero 10 del Molo Vecchio: sul taschino interno sono cuciti due numeri piccoli in filo bianco: 9 · 9."]
    ],
    rf_stadio: [
      [38, 42, 86, 88, "🔌 Cavo elettrico gigante tra nave e tribuna: vibra tiepido sotto la mano portando la luce del mare dritto fino al dischetto del rigore."],
      [10, 142, 58, 34, "🚜 Ruspa del Consorzio ferma ai cancelli: qualcuno ha appeso alla benna una sciarpa del Borgo e un cartello «Parcheggio scaduto»."],
      [70, 102, 64, 26, "🌊 Muro di cinta lato mare: le onde alte d'autunno schizzano spuma bianca fin sopra la bandierina del corner di sinistra."]
    ],
    rf_spogliatoio: [
      [18, 34, 90, 62, "🖍️ Lavagna tattica d'ardesia del 1958: sotto tre strati di gesso cancellato si leggono ancora due nomi vicini: «Marini – Valli»."],
      [146, 16, 44, 30, "📢 Altoparlante a tromba sopra l'uscita: gracchia il giro di batteria scelto in cabina facendo vibrare i tacchetti appesi ai chiodi."],
      [222, 34, 40, 110, "🚪 Armadietto ammaccato n. 10: non ha lucchetto da vent'anni, ma nessuno ci ha mai posato la borsa per rispetto."]
    ],
    rf_torretta: [
      [18, 16, 284, 98, "🌧️ Vetrata panoramica sul campo: si appanna al tocco mostrando il riflesso sovrapposto della tribuna piena e del rimorchiatore dietro la curva."],
      [38, 130, 56, 34, "🔏 Pinza piombatrice del Ministero: pesante e fredda sul tavolo, pronta a stringere il filo di ferro ma ancora aperta."],
      [222, 126, 70, 40, "🔢 Vecchio segnapunti a palette di latta: le cifre arrugginite segnano 9 e 9 aspettando l'ultimo novantesimo dello stadio."]
    ],
    rf_finale: [
      [100, 108, 120, 46, "🚢 La «Rondine Rossa» nel sole d'ottobre: dopo tre giorni di nebbia, il mare del golfo brilla pulito come un vinile appena tolto dalla busta."],
      [142, 48, 34, 64, "📡 L'antenna libera: nessun fruscio, nessun sigillo: soltanto musica e voci vere dal molo fino all'orizzonte."],
      [126, 84, 68, 44, "☀️ Alba su Borgo di Rondine: inizia una nuova trasmissione."]
    ]
  };

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if ((n || 0) < 80) setTimeout(() => reg((n || 0) + 1), 150);
  }
  reg(0);
})();
