// js/milano.js - «OPERAZIONE FUORIGIOCO NOIR · MILANO 1954» · configurazione della saga su js/saga-core.js
// Giallo investigativo d'epoca ambientato nella Milano autunnale del 1954.
// Tra la nebbia fitta dei Bastioni di Porta Ticinese, il tram n° 19, le bische clandestine
// e i segreti del night club «La Lucciola», il Campione indaga su una serie di partite truccate
// alla vigilia del derby milanese.
// Novità di questa saga:
//  - PEDINAMENTO TATTICO (js/pedinamento.js): motore originale sul fango dell'Arena Civica,
//    con coni d'ombra proiettati dai riflettori, intercettazioni di passaggio e contropiedi fulminei.
//  - IL TACCUINO DEI VERBALI (K.interroga): interrogatori con il taccuino della Questura,
//    prove dattiloscritte e confronto con le dichiarazioni dei sospettati.
//  - ESTETICA NOIR ANNI '50: trench, cappelli borsalino, lampioni a gas, nebbia volumetrica e tram d'epoca.
(function () {
  "use strict";
  if (window.__milano || !window.__sagaCore) return;

  const VERBALI = {
    biglietto: [
      "VERBALE N° 1 · IL BIGLIETTO DEL TRAM N° 19",
      "REPERTO: Cartoncino perforato con falsa punzonatura della corsa notturna",
      "«L'ALIBI DEL CAPOLINEA»",
      "Il biglietto presenta una doppia timbratura alle ore 22:45 vicino alla Darsena. Peppino il Guercio afferma di non essersi mai mosso dalla bisca, ma una particella di carbone da rotaia tradisce il suo tragitto."
    ],
    valigia: [
      "VERBALE N° 2 · LA VALIGIA IN FIBRA VULCANIZZATA",
      "REPERTO: Valigia marrone con chiusure d'ottone e mazzette da mille lire",
      "«IL FONDO CASSA DELLE SCOMMESSE»",
      "Trovata nel camerino di Mara al club La Lucciola. Contiene gli elenchi cifrati delle scommesse clandestine sul derby dell'Arena Civica e una lista di calciatori comprati."
    ],
    fischietto: [
      "VERBALE N° 3 · IL FISCHIETTO D'OTTONE BRUNITO",
      "REPERTO: Fischietto da arbitro con sfera di sughero piombata",
      "«IL FUORIGIOCO A COMANDO»",
      "Un fischietto truccato capace di emettere una nota acuta udibile solo a breve distanza per disorientare la difesa sui calci piazzati nel fango."
    ],
    spartito: [
      "VERBALE N° 4 · LO SPARTITO DELLA CANZONE DI MARA",
      "REPERTO: Spartito musicale per pianoforte con annotazioni in inchiostro simpatico",
      "«LA NOTTE DELLA MADONNINA»",
      "Le note musicali celano l'orario esatto del blitz nei sotterranei dello stadio prima del fischio d'inizio."
    ]
  };

  const E = window.__sagaCore.create({
    id: "milano",
    key: "ali-di-rondine.milano",
    title: "Operazione Fuorigioco Noir · Milano 1954",
    icon: "🕵️",
    bg: "mn_titolo",
    chapters: 3,
    menuSub: "Nebbia sui Bastioni, bische clandestine e il mistero del derby truccato nell'autunno del 1954",
    theme: {
      accent: "#e2e8f0",
      ink: "#0f172a",
      paper: "rgba(241,245,249,.96)",
      font: "'Courier New', Courier, monospace",
      chipBg: "#cbd5e1",
      chipBorder: "#475569"
    },
    stats: {
      biglietti: [0, 999, 12, "Biglietti del Tram (🎫)"],
      sospetto: [0, 99, 10, "Sospetto della Questura"],
      fiuto: [0, 99, 25, "Fiuto Investigativo"]
    },
    travel: true,
    item: ["Biglietto del Tram", "Biglietti del Tram"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      // Biglietto del tram d'epoca rettangolare
      g.fillStyle = "#cbd5e1";
      g.fillRect(-6, -4, 12, 8);
      g.strokeStyle = "#475569";
      g.lineWidth = 1;
      g.strokeRect(-6, -4, 12, 8);
      // Punzonatura / righe
      g.fillStyle = "#b91c1c";
      g.fillRect(-4, -2, 2, 4);
      g.fillStyle = "#334155";
      g.fillRect(0, -2, 4, 1);
      g.fillRect(0, 1, 4, 1);
      g.restore();
    },
    stadium: {
      azPitch: "cortile",
      cageField: 2,
      cageMut: "night",
      weather: "rain",
      venue: {
        ads: [["CINZANO BIANCO", "#b91c1c"], ["CORRIERE DELLA SERA", "#1e293b"], ["FERNET BRANCA", "#15803d"], ["MOTO GUZZI", "#d97706"]],
        crowd: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"],
        ground: ["#2d3748", "#1a202c"],
        line: "rgba(203,213,225,.6)",
        grid: "rgba(148,163,184,.15)",
        sky: ["#0f172a", "#1e293b"],
        wall: ["#334155", "#1e293b"],
        fx: { fr: 1.25, spd: 0.92, wind: 0.4 }
      }
    },
    regions: {
      bastioni: { grass: ["#1e293b", "#0f172a", "#090d16"], path: ["#64748b", "#475569"], stone: ["#334155", "#1e293b"], wall: ["#0f172a", "#020617"], water: ["#172554", "#0f172a"], tall: "#64748b", tree: ["#1e293b", "#0f172a"], tint: "203,213,225", tintA: 0.08, fx: "dust", dark: 0.05 },
      lucciola: { grass: ["#2d1b2e", "#1b0f1c", "#0f0810"], path: ["#9333ea", "#6b21a8"], stone: ["#4a2040", "#2d1b2e"], wall: ["#1a0f1c", "#09040a"], water: ["#4c1d95", "#2e1065"], tall: "#a855f7", tree: ["#3b0764", "#1e0538"], tint: "216,180,254", tintA: 0.06, fx: "", dark: 0.03 },
      arena: { grass: ["#27272a", "#18181b", "#09090b"], path: ["#71717a", "#52525b"], stone: ["#3f3f46", "#27272a"], wall: ["#18181b", "#09090b"], water: ["#1e293b", "#0f172a"], tall: "#71717a", tree: ["#14532d", "#052e16"], tint: "228,228,231", tintA: 0.05, fx: "rain", dark: 0.04 }
    },
    floors: "",
    solid: "SPFTBA#wWCcKk",
    rest: {
      ch: "s",
      name: "Tavolino dell'Osteria del Tram",
      desc: "Un caffè corretto caldo e il giornale della sera per riordinare gli indizi.",
      ask: "Vuoi riposare all'Osteria del Tram?"
    },
    endings: {
      legge: { t: "La Giustizia dei Bastioni", d: "Tutte le prove consegnate al Commissario De Santis. La bisca viene smantellata e il calcio torna pulito sui campi di periferia." },
      riscatto: { t: "Il Patto della Lucciola", d: "Hai stretto un accordo con Mara e Don Carmine: il denaro delle scommesse salva la polisportiva dei ferrovieri di Porta Ticinese." },
      solitario: { t: "Il Passo nella Nebbia", d: "Rifiuti la gloria e i compromessi. Con il trench sotto il braccio cammini sui binari del tram verso una nuova partita." },
      verita: { t: "Il Dossier Segreto del '54 (Segreto)", d: "Tutti i 12 biglietti punzonati raccolti, verbali completi e svelata la tresca del derby milanese: ottieni il Cappello Borsalino Noir d'Oro!" }
    },
    guest: {
      id: "mn_desantis",
      lines: [
        "Un saluto da Milano, figliolo. L'aria di mare fa bene ai polmoni dopo tanta nebbia.",
        "Ti ho portato una copia del Corriere d'Informazione del '54. Bel colpo sui Bastioni!"
      ]
    }
  });

  const { api, K } = E;

  // Meccanica personalizzata: Interrogatorio con verbale dattiloscritto
  K.interroga = function (idVerbale, premi, poi) {
    const v = VERBALI[idVerbale];
    if (!v) { if (poi) poi(); return; }

    if (premi) {
      if (premi.biglietti) K.bond("biglietti", premi.biglietti);
      if (premi.fiuto) K.bond("fiuto", premi.fiuto);
      if (premi.sospetto) K.bond("sospetto", premi.sospetto);
    }

    K.say([
      ["voce", `<b>${v[0]}</b><br><small style="color:#64748b;">${v[1]}</small>`],
      ["voce", `<em>${v[2]}</em><br>${v[3]}`]
    ], () => {
      if (window.toast) window.toast(`Verbale acquisito: ${v[0].split("·")[1] || ""}`, "info", "📁");
      if (poi) poi();
    });
  };

  // Funzioni grafiche per gli sfondi noir in bg-scenarios
  window.__mnDraw = {
    Bastioni(g, W, H, f) {
      // Cielo notturno nebbioso
      g.fillStyle = "#090d16";
      g.fillRect(0, 0, W, H);
      // Profilo dei Bastioni e archi di Porta Ticinese
      g.fillStyle = "#1e293b";
      g.fillRect(20, 70, 80, 130);
      g.fillRect(220, 70, 80, 130);
      g.fillRect(80, 100, 160, 100);
      // Arco centrale
      g.fillStyle = "#090d16";
      g.beginPath();
      g.arc(160, 150, 45, Math.PI, 0);
      g.lineTo(205, 200); g.lineTo(115, 200);
      g.closePath();
      g.fill();
      // Binari del tram
      g.strokeStyle = "#475569";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(40, 200); g.lineTo(130, 150);
      g.moveTo(60, 200); g.lineTo(140, 150);
      g.stroke();
      // Lampione a gas e cono di luce
      g.fillStyle = "#334155";
      g.fillRect(75, 90, 4, 110);
      g.fillStyle = "rgba(254, 240, 138, 0.4)";
      g.beginPath();
      g.moveTo(77, 90); g.lineTo(30, 200); g.lineTo(125, 200);
      g.closePath();
      g.fill();
      // Nebbia volumetrica
      for (let i = 0; i < 5; i++) {
        const nx = ((f * 0.3 + i * 70) % (W + 60)) - 30;
        g.fillStyle = "rgba(203, 213, 225, 0.05)";
        g.beginPath();
        g.arc(nx, 130 + (i % 3) * 20, 40, 0, Math.PI * 2);
        g.fill();
      }
    },
    Lucciola(g, W, H, f) {
      // Interno del night club vintage
      g.fillStyle = "#1b0f1c";
      g.fillRect(0, 0, W, H);
      // Tende di velluto bordeaux
      g.fillStyle = "#581c87";
      g.fillRect(0, 0, 50, H);
      g.fillRect(W - 50, 0, 50, H);
      // Palco e pianoforte
      g.fillStyle = "#09040a";
      g.fillRect(60, 120, 200, 80);
      // Insegna al neon «LA LUCCIOLA»
      const blink = (Math.sin(f / 10) > -0.8) ? 1 : 0.4;
      g.fillStyle = `rgba(216, 180, 254, ${blink})`;
      g.font = "bold 14px 'Courier New', monospace";
      g.fillText("★ NIGHT CLUB LA LUCCIOLA ★", 50, 45);
      // Tavolini rotondi con candele
      [[80, 160], [160, 175], [240, 160]].forEach(([cx, cy]) => {
        g.fillStyle = "#4a2040";
        g.beginPath(); g.arc(cx, cy, 18, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#fef08a";
        g.fillRect(cx - 2, cy - 8, 4, 6);
      });
    },
    ArenaCivica(g, W, H, f) {
      // Stadio e campo nel fango
      g.fillStyle = "#0f172a";
      g.fillRect(0, 0, W, H);
      // Tribuna d'epoca in pietra e legno
      g.fillStyle = "#1e293b";
      g.fillRect(0, 30, W, 70);
      for (let x = 10; x < W; x += 30) {
        g.fillStyle = "#334155";
        g.fillRect(x, 40, 20, 60);
      }
      // Campo verde fango
      g.fillStyle = "#27272a";
      g.fillRect(0, 100, W, 100);
      // Linee del campo
      g.strokeStyle = "rgba(226, 232, 240, 0.4)";
      g.lineWidth = 1.5;
      g.strokeRect(30, 115, W - 60, 75);
      // Pioggia battente
      g.strokeStyle = "rgba(148, 163, 184, 0.35)";
      g.lineWidth = 1;
      for (let i = 0; i < 25; i++) {
        const rx = (i * 17 + f * 4) % W;
        const ry = (i * 13 + f * 7) % H;
        g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 3, ry + 9); g.stroke();
      }
    }
  };

  window.__milano = api;
})();
