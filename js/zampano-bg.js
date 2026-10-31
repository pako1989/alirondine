// js/circo-bg.js — 14 sfondi illustrati e animati (320×200) per «Il Circo Zampanò · La Pista di Segatura»
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
  const bulbs = (g, x0, y0, x1, y1, n, f, sag) => {
    g.strokeStyle = "#292524"; g.lineWidth = 1; g.beginPath();
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (sag || 10);
      if (!i) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
    for (let i = 1; i < n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (sag || 10);
      const on = Math.sin(f * 0.08 + i * 1.4) > -0.35;
      C(g, x, y + 2, 2.2, on ? "#fef08a" : "#ca8a04");
      if (on) glow(g, x, y + 2, 7, "253,224,71", 0.25);
    }
  };
  const tentTop = (g, cx, yBase, w, h, f) => {
    const strips = 8;
    for (let i = 0; i < strips; i++) {
      const t0 = (i / strips) * 2 - 1, t1 = ((i + 1) / strips) * 2 - 1;
      g.fillStyle = i % 2 === 0 ? "#b91c1c" : "#fef3c7";
      g.beginPath(); g.moveTo(cx, yBase - h);
      g.lineTo(cx + t0 * (w / 2), yBase); g.lineTo(cx + t1 * (w / 2), yBase); g.closePath(); g.fill();
    }
    R(g, cx - w / 2, yBase, w, 6, "#eab308");
    R(g, cx - 1, yBase - h - 16, 2, 16, "#fde047");
    const fl = Math.sin(f * 0.12) * 2;
    g.fillStyle = "#ef4444"; g.beginPath(); g.moveTo(cx + 1, yBase - h - 16); g.lineTo(cx + 16, yBase - h - 11 + fl); g.lineTo(cx + 1, yBase - h - 6); g.fill();
  };
  const wagon = (g, x, y, w, h, col) => {
    R(g, x, y, w, h, col); R(g, x - 3, y - 4, w + 6, 5, "#78350f");
    R(g, x + 6, y + 6, 14, 12, "#fde68a"); R(g, x + w - 22, y + 6, 14, 12, "#fde68a");
    C(g, x + 14, y + h + 3, 7, "#451a03"); C(g, x + 14, y + h + 3, 3, "#d97706");
    C(g, x + w - 14, y + h + 3, 7, "#451a03"); C(g, x + w - 14, y + h + 3, 3, "#d97706");
  };

  const SC = {
    ci_titolo(g, W, H, f) {
      sky(g, W, H, "#0f0a24", "#4c1d3d", 142);
      for (let i = 0; i < 24; i++) R(g, (i * 41) % W, (i * 19) % 85, 1.5, 1.5, Math.sin(f * 0.05 + i) > 0 ? "#fef9c3" : "#a8a29e");
      R(g, 0, 134, W, 66, "#271811"); R(g, 0, 134, W, 6, "#3f271a");
      wagon(g, 18, 108, 62, 28, "#1e3a8a");
      wagon(g, 240, 110, 64, 26, "#065f46");
      tentTop(g, 160, 106, 146, 56, f);
      for (let i = 0; i < 10; i++) R(g, 92 + i * 14, 106, 7, 34, i % 2 ? "#991b1b" : "#fde68a");
      R(g, 144, 112, 32, 28, "#1c1917"); glow(g, 160, 126, 36, "251,191,36", 0.45);
      bulbs(g, 20, 92, 160, 50, 9, f, 8); bulbs(g, 160, 50, 300, 92, 9, f + 7, 8);
    },
    ci_spiazzo(g, W, H, f) {
      sky(g, W, H, "#1e1b4b", "#9a3412", 122);
      R(g, 0, 118, W, 82, "#3f2e21"); R(g, 30, 142, 260, 42, "#573f2c");
      tentTop(g, 224, 92, 136, 48, f);
      for (let i = 0; i < 9; i++) R(g, 160 + i * 14, 92, 7, 34, i % 2 ? "#b91c1c" : "#fef3c7");
      wagon(g, 16, 94, 84, 34, "#7c2d12");
      R(g, 116, 86, 30, 42, "#451a03"); R(g, 120, 90, 22, 30, "#fef3c7"); // Cartellone
      R(g, 123, 94, 16, 4, "#dc2626"); R(g, 123, 102, 16, 3, "#1e293b"); R(g, 123, 108, 12, 3, "#1e293b");
      bulbs(g, 16, 76, 290, 72, 12, f, 12);
    },
    ci_tendone(g, W, H, f) {
      sky(g, W, H, "#3b0764", "#7f1d1d", 126);
      for (let i = 0; i < 12; i++) R(g, i * 28, 0, 14, 126, "rgba(254,243,199,0.14)");
      R(g, 0, 124, W, 76, "#78350f");
      g.fillStyle = "#d97706"; g.beginPath(); g.ellipse(160, 158, 132, 32, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#b91c1c"; g.lineWidth = 4; g.beginPath(); g.ellipse(160, 158, 134, 33, 0, 0, Math.PI * 2); g.stroke();
      R(g, 92, 0, 5, 134, "#451a03"); R(g, 224, 0, 5, 134, "#451a03");
      const sw = Math.sin(f * 0.06) * 14;
      g.strokeStyle = "#fde68a"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(148, 0); g.lineTo(148 + sw, 56); g.moveTo(172, 0); g.lineTo(172 + sw, 56); g.stroke();
      R(g, 144 + sw, 56, 32, 3, "#fef08a");
      glow(g, 160, 148, 72, "253,224,71", 0.25);
    },
    ci_carro(g, W, H, f) {
      R(g, 0, 0, W, H, "#3b1d11"); R(g, 0, 138, W, 62, "#29140b");
      for (let i = 0; i < 8; i++) R(g, 0, i * 18, W, 2, "#261108");
      R(g, 24, 28, 64, 54, "#1e293b"); R(g, 28, 32, 56, 46, "#0f172a"); // Finestrino notte
      C(g, 66, 46, 7, "#fef08a");
      R(g, 114, 72, 96, 58, "#57321a"); R(g, 110, 68, 104, 6, "#78350f"); // Banco di Tonio
      C(g, 142, 58, 8, "#dc2626"); R(g, 166, 48, 18, 20, "#eab308"); // tromba / naso rosso
      R(g, 236, 34, 58, 96, "#451a03");
      for (let i = 0; i < 4; i++) R(g, 244 + i * 11, 44, 6, 26, ["#ef4444", "#fde047", "#38bdf8", "#a855f7"][i]);
      glow(g, 160, 52, 68, "251,191,36", 0.24 + Math.sin(f * 0.08) * 0.04);
    },
    ci_fiera(g, W, H, f) {
      sky(g, W, H, "#172554", "#6b21a8", 122);
      R(g, 0, 120, W, 80, "#292524");
      // Giostra a catene che gira
      R(g, 74, 46, 8, 76, "#eab308"); tentTop(g, 78, 52, 86, 28, f);
      for (let i = 0; i < 5; i++) {
        const a = f * 0.04 + i * 1.25, x = 78 + Math.cos(a) * 34, y = 78 + Math.sin(a) * 6;
        g.strokeStyle = "#cbd5e1"; g.beginPath(); g.moveTo(78, 52); g.lineTo(x, y); g.stroke();
        R(g, x - 4, y, 8, 5, "#fb7185");
      }
      // Chiosco zucchero filato e tiro ai barattoli
      R(g, 186, 72, 112, 54, "#991b1b"); R(g, 182, 66, 120, 8, "#fde047");
      R(g, 198, 84, 88, 24, "#fef3c7");
      for (let i = 0; i < 5; i++) R(g, 206 + i * 15, 96, 8, 11, "#94a3b8");
      bulbs(g, 10, 34, 310, 38, 14, f, 10);
    },
    ci_serraglio(g, W, H, f) {
      R(g, 0, 0, W, H, "#2e1a12"); R(g, 0, 134, W, 66, "#452719");
      // Casse d'attrezzi, bilancieri e generatore col cavo tranciato
      R(g, 18, 76, 78, 58, "#1e3a8a"); R(g, 22, 80, 70, 50, "#1d4ed8");
      R(g, 116, 94, 68, 40, "#374151"); R(g, 124, 84, 52, 12, "#4b5563"); // Generatore
      g.strokeStyle = "#111827"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(184, 118); g.lineTo(222, 136); g.moveTo(234, 138); g.lineTo(286, 128); g.stroke();
      if (f % 26 < 8) { C(g, 226, 136, 4, "#fde047"); glow(g, 226, 136, 18, "253,224,71", 0.5); }
      // Bilanciere di Golia
      R(g, 42, 148, 62, 4, "#9ca3af"); C(g, 40, 150, 11, "#111827"); C(g, 106, 150, 11, "#111827");
    },
    ci_biglietteria(g, W, H, f) {
      R(g, 0, 0, W, H, "#3f1d28"); R(g, 0, 136, W, 64, "#27131a");
      R(g, 88, 28, 144, 96, "#7f1d1d"); R(g, 82, 22, 156, 10, "#eab308");
      R(g, 112, 46, 96, 56, "#fef3c7");
      for (let i = 0; i < 6; i++) R(g, 120 + i * 15, 46, 2, 56, "#ca8a04"); // Grata d'ottone
      R(g, 24, 42, 46, 66, "#fde68a"); R(g, 28, 48, 38, 14, "#dc2626"); // Manifesto storico 1928
      R(g, 248, 52, 48, 58, "#e2e8f0"); R(g, 254, 60, 36, 4, "#ef4444"); // Ordinanza Bacci
      glow(g, 160, 74, 64, "253,224,71", 0.22 + Math.sin(f * 0.06) * 0.03);
    },
    ci_retro(g, W, H, f) {
      sky(g, W, H, "#0c1428", "#1e3a5f", 126);
      R(g, 0, 124, W, 76, "#292524");
      // Picchetti d'ottone e tiranti del tendone nella brezza marina
      for (let i = 0; i < 4; i++) {
        const x = 44 + i * 74;
        g.strokeStyle = "#d6d3d1"; g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(x + 36, 0); g.lineTo(x, 148); g.stroke();
        R(g, x - 3, 142, 7, 14, "#eab308");
      }
      wagon(g, 206, 92, 92, 36, "#581c87"); // Carro del Barone Orloff in visita
      bulbs(g, 0, 56, 320, 48, 11, f, 14);
    },
    ci_sartoria(g, W, H, f) {
      R(g, 0, 0, W, H, "#3b1736"); R(g, 0, 138, W, 62, "#240d21");
      // Manichini coi costumi di paillettes e macchina a pedale di Zia Wanda
      C(g, 62, 52, 8, "#d6d3d1"); R(g, 50, 62, 24, 46, "#dc2626"); R(g, 58, 62, 8, 46, "#fde047"); R(g, 60, 108, 4, 30, "#78350f");
      C(g, 112, 54, 8, "#d6d3d1"); R(g, 100, 64, 24, 44, "#7e22ce"); R(g, 104, 66, 16, 6, "#fef08a"); R(g, 110, 108, 4, 30, "#78350f");
      R(g, 174, 88, 106, 50, "#57321a"); R(g, 198, 68, 28, 20, "#1f2937"); // Macchina da cucire
      for (let i = 0; i < 8; i++) if ((f + i * 7) % 24 < 6) C(g, 54 + (i * 19) % 72, 68 + (i * 11) % 34, 1.5, "#ffffff");
      glow(g, 212, 64, 58, "253,224,71", 0.25);
    },
    ci_cupola(g, W, H, f) {
      sky(g, W, H, "#1e0b2e", "#4c0519", 200);
      // Vista vertiginosa sotto la cupola: passerelle, anelli e pista lontana giù in basso
      g.fillStyle = "rgba(217,119,6,0.35)"; g.beginPath(); g.ellipse(160, 186, 92, 16, 0, 0, Math.PI * 2); g.fill();
      R(g, 0, 112, 106, 8, "#78350f"); R(g, 214, 112, 106, 8, "#78350f");
      for (let i = 0; i < 6; i++) { R(g, 16 * i, 96, 2, 16, "#eab308"); R(g, 220 + 16 * i, 96, 2, 16, "#eab308"); }
      const sw = Math.sin(f * 0.07) * 18;
      g.strokeStyle = "#e7e5e4"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(160, 0); g.lineTo(160 + sw, 78); g.stroke();
      g.strokeStyle = "#fde047"; g.lineWidth = 2.5; g.beginPath(); g.arc(160 + sw, 84, 7, 0, Math.PI * 2); g.stroke();
      glow(g, 64, 104, 48, "253,224,71", 0.28); glow(g, 256, 104, 48, "253,224,71", 0.28);
    },
    ci_ingresso(g, W, H, f) {
      sky(g, W, H, "#090d24", "#450a0a", 132);
      R(g, 0, 128, W, 72, "#291d18"); R(g, 96, 128, 128, 72, "#991b1b"); // Tappeto rosso
      // Grande arco luminoso «CIRCO ZAMPANÒ»
      R(g, 58, 48, 16, 84, "#eab308"); R(g, 246, 48, 16, 84, "#eab308");
      R(g, 52, 28, 216, 24, "#b91c1c"); R(g, 56, 32, 208, 16, "#fef3c7");
      for (let i = 0; i < 16; i++) C(g, 60 + i * 13.3, 30, 2, (f + i * 3) % 12 < 6 ? "#fde047" : "#f97316");
      tentTop(g, 160, 96, 118, 40, f);
      glow(g, 160, 44, 80, "253,224,71", 0.26);
    },
    ci_camerini(g, W, H, f) {
      R(g, 0, 0, W, H, "#33141c"); R(g, 0, 138, W, 62, "#1f0b10");
      for (let k = 0; k < 2; k++) {
        const x = 36 + k * 142;
        R(g, x, 34, 106, 68, "#eab308"); R(g, x + 5, 39, 96, 58, "#1e293b");
        for (let i = 0; i < 6; i++) C(g, x + 12 + i * 16, 36, 2.2, (f + i + k) % 18 < 12 ? "#fef9c3" : "#ca8a04");
        R(g, x - 6, 102, 118, 36, "#57321a");
      }
      R(g, 148, 44, 24, 48, "#fef3c7"); R(g, 151, 48, 18, 6, "#dc2626"); // Scaletta appesa al centro
    },
    ci_arena(g, W, H, f) {
      sky(g, W, H, "#1e0826", "#7f1d1d", 124);
      // Tribuna gremita di Borgo Marino con puntini e bandierine
      R(g, 0, 68, W, 56, "#450a0a");
      for (let i = 0; i < 46; i++) C(g, 8 + (i * 29) % 304, 76 + (i % 4) * 10, 2.5, i % 3 ? "#fde68a" : "#fca5a5");
      R(g, 0, 122, W, 78, "#78350f");
      g.fillStyle = "#f59e0b"; g.beginPath(); g.ellipse(160, 160, 138, 32, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#dc2626"; g.lineWidth = 5; g.beginPath(); g.ellipse(160, 160, 140, 33, 0, 0, Math.PI * 2); g.stroke();
      bulbs(g, 0, 24, 320, 24, 14, f, 16);
      glow(g, 104, 146, 56, "253,224,71", 0.25); glow(g, 216, 146, 56, "253,224,71", 0.25);
    },
    ci_finale(g, W, H, f) {
      sky(g, W, H, "#1e1b4b", "#f97316", 136);
      C(g, 160, 116, 26, "#fde047"); glow(g, 160, 116, 68, "253,224,71", 0.35);
      R(g, 0, 134, W, 66, "#291d14");
      tentTop(g, 160, 112, 124, 46, f);
      wagon(g, 24, 112, 58, 24, "#b91c1c"); wagon(g, 238, 112, 58, 24, "#1d4ed8");
      // Rondini nel cielo d'alba sopra il tendone
      for (let i = 0; i < 5; i++) {
        const bx = ((f * 0.6 + i * 62) % 340) - 10, by = 36 + i * 11 + Math.sin(f * 0.1 + i) * 4;
        g.strokeStyle = "#1e1b4b"; g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(bx - 4, by + 2); g.lineTo(bx, by); g.lineTo(bx + 4, by + 2); g.stroke();
      }
    }
  };

  const HOT = {
    ci_titolo: [
      [88, 50, 144, 88, "🎪 Il grande tendone a strisce cremisi e avorio: rammendato cento volte da Zia Wanda, profuma di segatura di pino e caramello caldo."],
      [18, 104, 66, 36, "🚛 Il carro officina azzurro di Tonio: dal comignolo storto escono sbuffi che fischiano in tonalità di sol maggiore."],
      [238, 106, 68, 34, "🔮 La roulotte verde di Madame Miranda: dietro le tendine di velluto brillano vecchie locandine di metà Novecento."]
    ],
    ci_spiazzo: [
      [114, 84, 34, 46, "📋 Il Cartellone della Sera: tre cornici d'ottone aspettano i numeri scelti per conquistare il pubblico di Pian dei Venti."],
      [14, 90, 88, 42, "🐴 Il carro cucina di Golia: sul gradino raffredda un pentolone di minestrone per tutta la compagnia."],
      [158, 44, 138, 84, "🚩 Il pennone maestro: la bandiera rossa schiocca nel vento salmastro che sale dalla scogliera di Borgo Marino."]
    ],
    ci_tendone: [
      [130, 0, 62, 66, "🤸 Il trapezio di Lila Vento: oscilla lieve nel cono di luce, incipriato di magnesite bianca."],
      [40, 126, 240, 60, "🪵 L'anello di segatura fresca: se pesti il tacco al centro precisi, l'eco sotto la tela risponde come un tamburo."],
      [86, 10, 18, 120, "柱 Il palo maestro di sinistra: porta incise a coltellino tutte le città toccate dal Circo Zampanò dal 1928."]
    ],
    ci_carro: [
      [110, 48, 104, 82, "🎺 Il banco di Tonio Pagliaccio: tra chiavi inglesi e molle d'ottone riposa una trombetta ammaccata ma intonatissima."],
      [24, 28, 64, 54, "🌙 Il finestrino del carro: incornicia la falce di luna sopra i pini marittimi di Pian dei Venti."],
      [236, 34, 58, 96, "🧰 Lo scaffale dei barattoli di trucco: bianco di zinco, rosso cinabro e una scatolina di brillantini d'argento."]
    ],
    ci_fiera: [
      [34, 24, 88, 100, "🎠 La vecchia giostra a catene: quando gira piano suona un valzer un po' calante che fa sorridere persino i vigili."],
      [184, 66, 116, 60, "🥫 Il banco dei barattoli di Pippo Lampo: piramidi di latta lucidate per sfidare i ragazzi del borgo."],
      [20, 30, 280, 22, "💡 Il festone di lampadine calde: una ogni sette lampeggia a tempo di marcia."]
    ],
    ci_serraglio: [
      [116, 84, 72, 52, "⚡ Il generatore ausiliario: il cavo maestro mostra un taglio fin troppo netto per essere colpa dei denti di un topo."],
      [30, 138, 86, 24, "🏋️ Il bilanciere di ghisa di Golia: pesa novanta chili veri, ma sui dischi sono dipinte margherite bianche."],
      [18, 76, 78, 58, "📦 I bauli di scena: etichette sbiadite ricordano tournée a Genova, Nizza, Livorno e Borgo Marino."]
    ],
    ci_biglietteria: [
      [88, 22, 144, 104, "🎟️ Lo sportello d'ottone della cassa: il rotolo dei biglietti rosa ha ancora centinaia di tagliandi da staccare."],
      [24, 42, 46, 66, "🖼️ Locandina storica del 1928: ritrae il giovane Zampanò e il leggendario «Salto delle Rondini d'Oro»."],
      [248, 52, 48, 58, "📑 Cartella del Ragionier Bacci: bolli comunali, righelli millimetrati e una diffida per canone arretrato."]
    ],
    ci_retro: [
      [36, 136, 26, 24, "🔨 Il picchetto maestro d'ottone: piantato fino al cuore della terra battuta, tiene in tensione mezza cupola."],
      [204, 88, 96, 44, "🎩 La carrozza viola del Barone Orloff: tende di velluto scuro e stemma dorato del «Gran Circo Imperiale»."],
      [40, 10, 220, 120, "🪢 Le funi di canapa: vibrano nel maestrale della sera come l'arpa di un gigante."]
    ],
    ci_sartoria: [
      [46, 44, 34, 92, "🧥 Il costume rosso da pista: Zia Wanda ha rinforzato le cuciture sulle spalle per le piroette aeree."],
      [96, 46, 34, 92, "✨ La mantella viola di paillettes: cattura ogni briciola di luce e la moltiplica per dieci."],
      [174, 68, 106, 70, "🪡 La macchina a pedale Singer: cuce tela da vela e seta leggera con lo stesso ticchettio instancabile."]
    ],
    ci_cupola: [
      [142, 0, 44, 96, "⭕ L'anello d'oro del trapezio centrale: sospeso a dodici metri sulla pista, aspetta solo una presa sicura."],
      [0, 94, 108, 28, "🪜 La passerella dei riflettori: da quassù il pubblico sembra un prato di papaveri e cappelli."],
      [68, 168, 184, 30, "🎯 L'anello di segatura visto dall'alto: piccolo, tondo e luminoso come una moneta d'oro."]
    ],
    ci_ingresso: [
      [52, 26, 216, 30, "✨ L'insegna luminosa «CIRCO ZAMPANÒ»: tutte le lampadine sono finalmente accese sopra Pian dei Venti."],
      [96, 128, 128, 72, "🟥 La guida di velluto rosso: spazzolata da Pippo fino all'ultimo filo prima dell'apertura."],
      [100, 56, 120, 44, "🎪 La cupola illuminata dall'interno: brilla nella sera d'ottobre come una lanterna di carta gigante."]
    ],
    ci_camerini: [
      [36, 34, 106, 68, "🪞 Lo specchio di Lila e Tonio: incastrata nella cornice c'è una piuma bianca portafortuna."],
      [146, 42, 28, 52, "📜 La scaletta definitiva del Gran Gala: ogni artista ha firmato accanto al proprio ingresso."],
      [178, 34, 106, 68, "🎩 Lo specchio del Maestro Zampanò: il megafono d'ottone lucidato riflette le lampadine calde."]
    ],
    ci_arena: [
      [20, 126, 280, 68, "🌟 La Gran Pista delle Rondini: la segatura profuma di resina e tutta la gradinata trattiene il fiato."],
      [0, 68, 320, 52, "👏 Le gradinate piene di Borgo Marino: bambini sulle spalle, sciarpe al collo e applausi a scena aperta."],
      [0, 16, 320, 26, "💛 La corona di luci del Gala: centoventi lampadine accese dal generatore riparato."]
    ],
    ci_finale: [
      [98, 66, 124, 52, "🎪 Il tendone all'alba: la tela cremisi e avorio respira serena nella luce dorata del mattino."],
      [110, 24, 140, 42, "🐦 Le rondini sopra Pian dei Venti: prima di partire verso sud fanno tre giri intorno al pennone."],
      [22, 110, 62, 28, "🎺 I carri pronti al nuovo giorno: la musica del Circo Zampanò non si spegne più."]
    ]
  };

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if ((n || 0) < 80) setTimeout(() => reg((n || 0) + 1), 150);
  }
  reg(0);
})();
