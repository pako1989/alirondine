// js/falsari-bg.js — Sfondi illustrati e animati (320×200) per «I Falsari della Coppa»
// Registrati in window.__lbBg con 3 punti cliccabili visibili ciascuno.
(function () {
  "use strict";

  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(Math.round(x), Math.round(y), Math.max(1, r), 0, Math.PI * 2); g.fill(); };
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

  const SC = {
    // 1. Copertina e Piazza della Stazione notturna
    fa_titolo(g, W, H, f) {
      sky(g, W, H, "#080c18", "#1c1917", 130);
      // Profilo della stazione e tetti della città vecchia
      R(g, 0, 95, W, 35, "#171412");
      for (let x = 10; x < W; x += 18) {
        R(g, x, 85 + (x % 5) * 3, 14, 15, "#1c1917");
      }
      // Torre Civica centrale con orologio illuminato
      R(g, 130, 20, 60, 95, "#292524");
      R(g, 126, 16, 68, 6, "#44403c");
      // Orologio
      C(g, 160, 52, 20, "#fef3c7");
      C(g, 160, 52, 17, "#fffbeb");
      glow(g, 160, 52, 45, "254,243,199", 0.45);
      // Lancette orologio (ore 21:00)
      g.strokeStyle = "#1c1917"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(160, 52); g.lineTo(160, 39); g.moveTo(160, 52); g.lineTo(172, 52); g.stroke();

      // Pavimento piazza: acciottolato bagnato dalla pioggia
      const pGrad = g.createLinearGradient(0, 130, 0, H);
      pGrad.addColorStop(0, "#292524"); pGrad.addColorStop(1, "#0c0a09");
      g.fillStyle = pGrad; g.fillRect(0, 130, W, H - 130);
      // Riflessi di luce sui ciottoli
      g.fillStyle = "rgba(251,191,36,0.12)";
      for (let y = 135; y < H; y += 8) {
        const off = (Math.sin(f * 0.05 + y) * 4);
        for (let x = 12; x < W; x += 24) {
          R(g, x + off, y, 10, 2, "rgba(251,191,36,0.15)");
        }
      }

      // Insegna bottega Silvestri a destra
      R(g, 220, 100, 80, 28, "#451a03");
      R(g, 218, 98, 84, 2, "#d97706");
      R(g, 218, 128, 84, 2, "#d97706");
      g.fillStyle = "#fbbf24"; g.font = "bold 9px sans-serif"; g.textAlign = "center";
      g.fillText("BOTTEGA SILVESTRI", 260, 114);
      g.font = "7px sans-serif"; g.fillStyle = "#fde68a";
      g.fillText("OREFICERIA & RESTAURO", 260, 123);
      // Lanterna a gas sopra l'insegna
      C(g, 260, 92, 5, "#fef3c7");
      glow(g, 260, 92, 26, "251,191,36", 0.6);

      // Bacheca avvisi a sinistra
      R(g, 22, 105, 70, 45, "#3b2314");
      R(g, 26, 109, 62, 37, "#1c1917");
      R(g, 30, 113, 24, 30, "#fef3c7");
      R(g, 60, 115, 24, 26, "#fef3c7");
      // Timbro rosso asta
      C(g, 42, 128, 5, "rgba(220,38,38,0.7)");
    },

    // 2. Interno Bottega Silvestri
    fa_bottega_bg(g, W, H, f) {
      // Parete in legno scuro e mattoni antichi
      sky(g, W, H, "#1c140e", "#2e1c12", 110);
      // Scaffali di noce carichi di barattoli e orologi
      R(g, 0, 15, W, 8, "#3e2417");
      R(g, 0, 50, W, 8, "#3e2417");
      for (let x = 15; x < W; x += 35) {
        R(g, x, 23, 10, 27, ["#78350f", "#047857", "#1e3a8a", "#b45309"][(x % 4)]);
        C(g, x + 5, 21, 3, "#fef3c7");
      }

      // Pavimento a doghe di legno rovere
      const fGrad = g.createLinearGradient(0, 110, 0, H);
      fGrad.addColorStop(0, "#3e2417"); fGrad.addColorStop(1, "#1c110a");
      g.fillStyle = fGrad; g.fillRect(0, 110, W, H - 110);
      g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 1;
      for (let y = 110; y < H; y += 14) {
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }

      // Focolare / Crogiolo a sinistra
      R(g, 10, 65, 55, 60, "#1f1814");
      R(g, 15, 75, 45, 40, "#0c0a09");
      // Braci ardenti con bagliore pulsante
      const pulse = 0.5 + 0.5 * Math.sin(f * 0.1);
      glow(g, 37, 95, 30, "245,158,11", 0.35 + pulse * 0.25);
      C(g, 37, 98, 12, `rgba(239,68,68,${0.6 + pulse * 0.3})`);
      C(g, 37, 98, 7, `rgba(251,191,36,${0.8 + pulse * 0.2})`);

      // Banco da lavoro da orefice al centro
      R(g, 90, 85, 140, 55, "#57301c");
      R(g, 86, 82, 148, 6, "#6c3b22");
      // Lampada con paralume verde smeraldo da tavolo
      R(g, 105, 68, 4, 18, "#d97706");
      R(g, 95, 64, 24, 7, "#047857");
      glow(g, 107, 72, 32, "254,243,199", 0.55);

      // Bilancia a due bracci in ottone sul banco
      R(g, 160, 60, 4, 25, "#d97706");
      g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(142, 65); g.lineTo(178, 65); g.stroke();
      // Piatti bilancia
      R(g, 137, 74, 10, 2, "#f59e0b");
      R(g, 173, 74, 10, 2, "#f59e0b");

      // Asse del pavimento sconnessa in primo piano a sinistra
      R(g, 30, 145, 45, 12, "#2b180d");
      g.strokeStyle = "#f59e0b"; g.lineWidth = 1;
      g.strokeRect(30, 145, 45, 12);
      // Riflesso metallico che spunta dall'asse
      C(g, 52, 151, 3, `rgba(251,191,36,${0.5 + 0.4 * Math.sin(f * 0.12)})`);
    },

    // 3. Sala dei Trofei del Vecchio Municipio
    fa_trofei_bg(g, W, H, f) {
      // Parete in marmo verde Alpi e stucchi neoclassici
      const mGrad = g.createLinearGradient(0, 0, 0, 115);
      mGrad.addColorStop(0, "#064e3b"); mGrad.addColorStop(1, "#022c22");
      g.fillStyle = mGrad; g.fillRect(0, 0, W, 115);

      // Modanature dorate e lesene
      for (let x = 20; x < W; x += 60) {
        R(g, x, 0, 8, 115, "#065f46");
        R(g, x + 2, 0, 4, 115, "#d97706");
      }
      R(g, 0, 112, W, 4, "#fbbf24");

      // Pavimento a scacchi lucido marmo crema e nero
      const pY = 116;
      R(g, 0, pY, W, H - pY, "#1c1917");
      for (let y = pY; y < H; y += 14) {
        for (let x = 0; x < W; x += 28) {
          const isWhite = ((x / 28 | 0) + (y / 14 | 0)) % 2 === 0;
          if (isWhite) R(g, x, y, 28, 14, "#fef3c7");
        }
      }

      // Teca monumentale centrale
      R(g, 115, 40, 90, 80, "rgba(240,253,250,0.18)");
      g.strokeStyle = "#fbbf24"; g.lineWidth = 2;
      g.strokeRect(115, 40, 90, 80);
      // Piedistallo in marmo scuro
      R(g, 110, 120, 100, 32, "#0f172a");
      R(g, 106, 118, 108, 4, "#d97706");

      // La Coppa del 1934 all'interno della teca
      const gPulse = Math.sin(f * 0.08) * 0.15;
      glow(g, 160, 75, 40, "251,191,36", 0.45 + gPulse);
      // Calice dorato
      g.fillStyle = "#fbbf24";
      g.beginPath();
      g.moveTo(140, 58); g.lineTo(180, 58); g.lineTo(175, 82); g.lineTo(145, 82); g.closePath();
      g.fill();
      // Anse
      g.strokeStyle = "#f59e0b"; g.lineWidth = 2.5;
      g.beginPath(); g.arc(138, 70, 7, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(182, 70, 7, 0, Math.PI * 2); g.stroke();
      // Stelo e base
      R(g, 157, 82, 6, 12, "#b45309");
      R(g, 148, 94, 24, 6, "#d97706");

      // Cordone di velluto rosso cerimoniale davanti
      g.strokeStyle = "#b91c1c"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(40, 140); g.quadraticCurveTo(160, 165, 280, 140); g.stroke();
      R(g, 38, 125, 5, 25, "#d97706");
      R(g, 278, 125, 5, 25, "#d97706");
      C(g, 40, 125, 5, "#fbbf24");
      C(g, 280, 125, 5, "#fbbf24");
    },

    // 4. Molo dei Pescatori e Cantieri Navali (Notte)
    fa_molo_bg(g, W, H, f) {
      sky(g, W, H, "#030712", "#0f172a", 110);
      // Onde del mare scuro
      const sGrad = g.createLinearGradient(0, 80, 0, 140);
      sGrad.addColorStop(0, "#0c4a6e"); sGrad.addColorStop(1, "#032b44");
      g.fillStyle = sGrad; g.fillRect(0, 80, W, 60);

      // Faro in lontananza a sinistra
      R(g, 25, 35, 12, 50, "#334155");
      R(g, 23, 30, 16, 6, "#dc2626");
      C(g, 31, 26, 4, "#fef3c7");
      // Fascio di luce rotante del faro
      const bAng = (f * 0.03) % (Math.PI * 2);
      const bAlpha = Math.max(0, Math.sin(bAng));
      if (bAlpha > 0.05) {
        g.save();
        g.fillStyle = `rgba(254,243,199,${bAlpha * 0.35})`;
        g.beginPath();
        g.moveTo(31, 26);
        g.lineTo(W, 26 + Math.cos(bAng) * 60);
        g.lineTo(W, 50 + Math.cos(bAng) * 60);
        g.closePath();
        g.fill();
        g.restore();
      }

      // Sagoma peschereccio ormeggiato
      g.fillStyle = "#1e293b";
      g.beginPath();
      g.moveTo(70, 105); g.lineTo(135, 105); g.lineTo(125, 120); g.lineTo(80, 120); g.closePath();
      g.fill();
      R(g, 100, 75, 3, 30, "#475569"); // Albero
      R(g, 88, 92, 22, 13, "#334155"); // Cabina peschereccio
      C(g, 95, 98, 2.5, "#fbbf24"); // Oblò illuminato

      // Banchina in pietra e bitte d'ormeggio
      const pGrad = g.createLinearGradient(0, 125, 0, H);
      pGrad.addColorStop(0, "#1e293b"); pGrad.addColorStop(1, "#090d16");
      g.fillStyle = pGrad; g.fillRect(0, 125, W, H - 125);
      // Bitte in ghisa
      for (let x = 40; x < W; x += 90) {
        R(g, x, 132, 8, 12, "#475569");
        C(g, x + 4, 132, 6, "#64748b");
      }
      // Gru navale e capannone cantiere a destra
      R(g, 220, 60, 95, 75, "#18181b");
      R(g, 230, 40, 6, 40, "#71717a");
      g.strokeStyle = "#a1a1aa"; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(233, 42); g.lineTo(285, 75); g.stroke();
      // Lanterna gialla del capannone
      C(g, 225, 80, 4, "#fbbf24");
      glow(g, 225, 80, 20, "251,191,36", 0.5);
    },

    // 5. Fonderia Clandestina di Mastro Tullio
    fa_fonderia_bg(g, W, H, f) {
      sky(g, W, H, "#0f0a0a", "#261313", 110);
      // Muro di mattoni refrattari anneriti da fuliggine
      R(g, 0, 0, W, 115, "#1c1414");
      for (let y = 10; y < 115; y += 14) {
        g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 1;
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }

      // Pavimento in terra battuta e lastre di ghisa
      const fGrad = g.createLinearGradient(0, 115, 0, H);
      fGrad.addColorStop(0, "#231515"); fGrad.addColorStop(1, "#0d0707");
      g.fillStyle = fGrad; g.fillRect(0, 115, W, H - 115);

      // Grande forno a riverbero e crogiolo al centro
      R(g, 105, 35, 110, 90, "#3f1d1d");
      R(g, 115, 45, 90, 75, "#1a0b0b");
      // Bocca del forno incandescente con braci e fiamme pulsanti
      const fPulse = Math.sin(f * 0.15) * 0.2;
      glow(g, 160, 85, 50, "249,115,22", 0.65 + fPulse);
      R(g, 130, 65, 60, 45, "#f97316");
      R(g, 138, 72, 44, 32, "#fef08a");
      // Scintille che salgono dal focolare
      for (let i = 0; i < 6; i++) {
        const sx = 135 + ((f * 2 + i * 17) % 50);
        const sy = 60 - ((f * 1.5 + i * 11) % 40);
        C(g, sx, sy, 1.5, "#ffedd5");
      }

      // Canale di colata e staffa con sabbia
      R(g, 145, 110, 30, 20, "#7c2d12");
      R(g, 120, 130, 80, 35, "#57301c"); // Forma a staffa
      g.strokeStyle = "#d97706"; g.lineWidth = 1;
      g.strokeRect(120, 130, 80, 35);
      // Impronta rotonda della coppa nella sabbia
      C(g, 160, 147, 16, "#3b2012");
      C(g, 160, 147, 14, "#f59e0b");

      // Incudine massiccia a sinistra
      R(g, 35, 115, 35, 25, "#334155");
      R(g, 30, 110, 45, 8, "#475569");
      // Mazzo di pinze da forgia appoggiate
      g.strokeStyle = "#94a3b8"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(25, 108); g.lineTo(50, 130); g.stroke();

      // Barili di carbone e lingotti di bronzo a destra
      R(g, 240, 115, 30, 38, "#18181b");
      R(g, 242, 110, 26, 6, "#3f3f46");
      // Lingotti sovrapposti
      for (let i = 0; i < 3; i++) {
        R(g, 275 + i * 2, 130 - i * 8, 28, 7, "#b45309");
        R(g, 277 + i * 2, 128 - i * 8, 24, 2, "#f59e0b");
      }
    },

    // 6. Salone d'Asta di Villa Morosini
    fa_villa_bg(g, W, H, f) {
      sky(g, W, H, "#1e1b4b", "#312e81", 100);
      // Pareti decorate in damasco avorio e modanature in foglia d'oro
      R(g, 0, 0, W, 110, "#312e81");
      for (let x = 20; x < W; x += 55) {
        R(g, x, 0, 6, 110, "#fbbf24");
      }
      // Pavimento in marmo rosso Verona lucidato
      const vGrad = g.createLinearGradient(0, 110, 0, H);
      vGrad.addColorStop(0, "#7f1d1d"); vGrad.addColorStop(1, "#450a0a");
      g.fillStyle = vGrad; g.fillRect(0, 110, W, H - 110);

      // Lampadario di Murano a gocce di cristallo
      R(g, 158, 0, 4, 25, "#fbbf24");
      C(g, 160, 30, 14, "#fef3c7");
      glow(g, 160, 30, 40, "254,243,199", 0.55);
      for (let i = -3; i <= 3; i++) {
        C(g, 160 + i * 7, 36 + Math.abs(i) * 2, 2.5, "#ffffff");
      }

      // Palco d'asta con piedistallo vellutato
      R(g, 100, 115, 120, 45, "#1e1b4b");
      R(g, 96, 112, 128, 4, "#fbbf24");
      // Cuscino di velluto scarlatto e teca
      R(g, 135, 96, 50, 16, "#991b1b");
      R(g, 133, 94, 54, 3, "#f59e0b");
      // Teca di cristallo
      g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5;
      g.strokeRect(138, 62, 44, 32);
      // Sagoma dorata trofeo
      C(g, 160, 76, 10, "#fbbf24");
      glow(g, 160, 76, 20, "251,191,36", 0.4);

      // Ritratto antenato Morosini sulla parete di destra
      R(g, 240, 25, 45, 55, "#78350f");
      R(g, 244, 29, 37, 47, "#0f172a");
      g.strokeStyle = "#fbbf24"; g.lineWidth = 2;
      g.strokeRect(240, 25, 45, 55);
    },

    // 7. Lo Stadio del 1934 e la Curva Popolare
    fa_stadio_bg(g, W, H, f) {
      sky(g, W, H, "#0f172a", "#1e3a5f", 90);
      // Sagoma delle tribune storiche in legno e ferro
      R(g, 0, 70, W, 45, "#292524");
      for (let x = 10; x < W; x += 22) {
        R(g, x, 62, 16, 20, "#44403c");
      }
      // Tabellone d'epoca a cartelli di latta
      R(g, 120, 25, 80, 40, "#1c1917");
      R(g, 118, 23, 84, 2, "#fbbf24");
      g.fillStyle = "#fbbf24"; g.font = "bold 9px sans-serif"; g.textAlign = "center";
      g.fillText("STADIO COMUNALE 1934", 160, 38);
      g.font = "bold 13px sans-serif"; g.fillStyle = "#ffffff";
      g.fillText("RONDINE", 160, 54);

      // Campo da gioco in erba e terra battuta
      const grGrad = g.createLinearGradient(0, 115, 0, H);
      grGrad.addColorStop(0, "#15803d"); grGrad.addColorStop(1, "#14532d");
      g.fillStyle = grGrad; g.fillRect(0, 115, W, H - 115);
      // Linea di porta e gesso bianco
      g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(20, 160); g.lineTo(300, 160); g.stroke();

      // Bandiere granata sventolanti dei tifosi
      const wOff = Math.sin(f * 0.1) * 4;
      g.fillStyle = "#991b1b";
      g.beginPath();
      g.moveTo(40, 65); g.lineTo(65 + wOff, 68); g.lineTo(60 + wOff, 82); g.lineTo(40, 78);
      g.closePath();
      g.fill();
      R(g, 39, 65, 2, 35, "#cbd5e1");

      // Ruspe gialle bloccate ai cancelli in lontananza
      R(g, 245, 92, 45, 24, "#eab308");
      R(g, 265, 80, 20, 14, "#ca8a04");
      C(g, 253, 115, 6, "#18181b");
      C(g, 280, 115, 6, "#18181b");
    }
  };

  const HOT = {
    fa_titolo: [
      [130, 20, 60, 60, "🕰️ Orologio della Torre Civica: i rintocchi delle ventuno risuonano nella piazza vuota. Le ruspe della Morosini sono già parcheggiate oltre il passaggio a livello."],
      [22, 105, 70, 50, "📜 Bacheca degli Avvisi Comunali: un manifesto fresco di colla con timbro rosso annuncia la liquidazione coatta dello Stadio Storico del 1934."],
      [218, 98, 84, 35, "🔍 Insegna della Bottega Silvestri: l'ottone è scurito dal tempo, ma sotto la polvere si legge ancora 'Oreficeria, Restauro e Riparazioni Meccaniche'."]
    ],
    fa_bottega_bg: [
      [135, 60, 50, 30, "⚖️ Bilancia a due bracci in ottone: sensibile a un decimo di grammo. Sotto il piatto sinistro c'è ancora un truciolo d'oro zecchino incastrato."],
      [25, 140, 55, 22, "🪵 Asse sconnessa del pavimento: sollevandola col calzascarpe si accede al doppio fondo segreto dove Arturo nascondeva gli attrezzi migliori."],
      [15, 20, 290, 35, "🧪 Scaffali di reagenti chimici: boccette di vetro scuro con etichette scritte a pennino: 'Acido Nitrico', 'Fegato di Zolfo' e 'Colla di Coniglio'."]
    ],
    fa_trofei_bg: [
      [115, 40, 90, 80, "🏆 La Coppa del 1934: le anse a collo di cigno sono cesellate a mano con motivi di spighe e rondini. Il metallo brilla con una sfumatura bronzea inconfondibile."],
      [106, 118, 108, 35, "🚨 Micro-interruttore sotto il piedistallo: un sensore a molla calibrato sui due chili. Togliere la coppa senza sostituirla con lo stesso peso farebbe suonare la sirena."],
      [235, 80, 70, 50, "📖 Registro delle Donazioni Storiche del 1934: aperto alla pagina del bando di fondazione con i nomi degli operai che donarono le fedi nuziali per il metallo."]
    ],
    fa_molo_bg: [
      [23, 20, 40, 70, "🗼 Faro della Scogliera: la sua luce taglia la nebbia salmastra del porto. Oltre la scogliera ci sono i magazzini navali dismessi."],
      [70, 75, 70, 45, "⛵ Peschereccio 'Stella Maris': la barca del vecchio capitano De Rosa. Le reti da posta sono stese ad asciugare al riparo dalla tramontana."],
      [220, 40, 95, 90, "🏗️ Magazzino Rottami Navali: cumuli di eliche in bronzo fosforoso e cavi d'acciaio. È qui che Tullio recupera il metallo pesante d'anteguerra."]
    ],
    fa_fonderia_bg: [
      [105, 35, 110, 90, "🔥 Forno a riverbero e crogiolo: il carbone d'antracite brucia a oltre millecento gradi. Il bronzo fuso ribolle con riflessi dorati e bagliori d'ametista."],
      [120, 130, 80, 35, "🧱 Forma a staffa in sabbia refrattaria: l'impronta lasciata dal calco in cera attende la colata del metallo incandescente."],
      [240, 105, 70, 50, "📦 Scorte di metallo navale: lingotti d'anteguerra con il marchio della Regia Marina, perfetti per replicare la densità esatta del trofeo."]
    ],
    fa_villa_bg: [
      [140, 10, 45, 45, "💎 Lampadario di cristallo di Murano: dodici bracci con gocce molate a mano. Riflette la luce su velluti e stucchi della dinastia Morosini."],
      [130, 60, 60, 50, "🛡️ Teca d'asta blindata: montata su una pedana elettronica con allarme volumetrico, pronta per l'incanto di domani."],
      [240, 25, 45, 55, "🖼️ Ritratto del Conte Morosini: fondatore delle acciaierie e acerrimo rivale della Rondine operaia sin dagli anni Trenta."]
    ],
    fa_stadio_bg: [
      [115, 20, 90, 50, "📋 Tabellone Storico del 1934: cartelli di latta verniciati a mano che hanno scandito promozioni memorabili e salvezze all'ultimo minuto."],
      [35, 60, 40, 40, "🚩 Bandiera Granata della Curva: cucita dalle madri dei primi calciatori, sventolata anche davanti ai fari minacciosi delle ruspe."],
      [240, 80, 60, 45, "🚜 Ruspe dell'Immobiliare Morosini: tenute a bada dal picchetto dei tifosi e degli ex calciatori uniti con catene e sciarpe."]
    ]
  };

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if ((n || 0) < 80) setTimeout(() => reg((n || 0) + 1), 150);
  }
  reg(0);
})();
