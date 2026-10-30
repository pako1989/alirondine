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
      [106, 118, 108, 35, "🚨 Micro-interruttore sotto il piedistallo: un sensore a molla calibrated sui due chili. Togliere la coppa senza sostituirla con lo stesso peso farebbe suonare la sirena."],
      [235, 80, 70, 50, "📖 Registro delle Donazioni Storiche del 1934: aperto alla pagina del bando di fondazione con i nomi degli operai che donarono le fedi nuziali per il metallo."]
    ]
  };

  function reg(n) {
    const B = window.__lbBg;
    if (B && B.register) Object.keys(SC).forEach((k) => B.register(k, { draw: SC[k], hot: HOT[k] || [] }));
    else if ((n || 0) < 80) setTimeout(() => reg((n || 0) + 1), 150);
  }
  reg(0);
})();
