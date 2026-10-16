// js/piramide.js - «LA PIRAMIDE DEL SOLE · IL SEGRETO DEI MAYA DEL PALLONE» · Configurazione saga su js/saga-core.js
// Spedizione archeologica del 1936 nello Yucatán, ispirata a Indiana Jones, La Mummia e al sacro rito del Pok-ta-pok.
// Tra trappole a scatto, idoli di giada e campi cerimoniali sepolti dalla vegetazione,
// il Campione deve decifrare il legame ancestrale tra il calcio moderno e il culto del Serpente Piumato.
(function () {
  "use strict";
  if (window.__piramide || !window.__sagaCore) return;

  const REPERTI = {
    idolo_giada: [
      "REPERTO ARCHEOLOGICO N° 1 · L'IDOLO DEL GIAGUARO",
      "LUOGO DI RITROVAMENTO: Atrio sommerso della Piramide del Sole",
      "«IL GLIFO DEL PRIMO BALZO»",
      "Una statuetta in giada smeraldo finemente levigata. Mostra un atleta tolteco che colpisce una sfera solare con il fianco destro. L'iscrizione recita: 'Chi tocca il suolo per tre volte risveglia i dardi dei guardiani'."
    ],
    disco_pietra: [
      "REPERTO ARCHEOLOGICO N° 2 · IL DISCO SOLARE DI KUKULKAN",
      "LUOGO DI RITROVAMENTO: Cripta delle offerte rituali",
      "«L'ANELLO DELLE DUE METÀ»",
      "Un bassorilievo circolare che replica gli anelli verticali del campo cerimoniale. Al centro è incastonata una gemma d'ambra che riflette il sole solo all'ora del mezzogiorno esatto."
    ],
    mappa_cenote: [
      "REPERTO ARCHEOLOGICO N° 3 · CODICE SU CORTECCIA DI FICO",
      "LUOGO DI RITROVAMENTO: Baule dell'accampamento di Vargas",
      "«IL PERCORSO DELLE ACQUE SACRE»",
      "Una pergamena precolombiana con i cunicoli segreti che collegano il campo di Pok-ta-pok al Cenote sotterraneo. Mostra la via di fuga nel caso in cui il tempio dovesse sigillarsi."
    ],
    maschera_oro: [
      "REPERTO ARCHEOLOGICO N° 4 · LA MASCHERA DEL SACERDOTE SOLARE",
      "LUOGO DI RITROVAMENTO: Vertice della Piramide a gradoni",
      "«LA BENEDIZIONE DEL QUETZAL»",
      "Lamina d'oro zecchino decorata con piume pietrificate. Chi la indossa durante la volée ottiene la deviazione perfetta all'incrocio dell'anello di pietra."
    ]
  };

  const E = window.__sagaCore.create({
    id: "piramide",
    key: "ali-di-rondine.piramide",
    title: "La Piramide del Sole · Il Segreto dei Maya del Pallone",
    icon: "☀️",
    bg: "my_titolo",
    chapters: 3,
    menuSub: "Spedizioni archeologiche nel 1936, trappole a scatto e il rito sacro del Pok-ta-pok.",
    theme: {
      accent: "#f59e0b",
      ink: "#1c1917",
      paper: "rgba(254,243,199,.96)",
      font: "'Georgia', 'Trebuchet MS', serif, system-ui",
      chipBg: "#fef3c7",
      chipBorder: "#d97706"
    },
    stats: {
      reperti: [0, 4, 1],
      coraggio: [0, 99, 25, "Coraggio da Esploratore"],
      sintonia: [0, 99, 15, "Sintonia Solare"]
    },
    regions: {
      giungla: { grass: ["#2f6b3a", "#2a5f33", "#357a40"], path: ["#a8845a", "#98744c"], stone: ["#6b7a6a", "#5d6b5c"], wall: ["#1f3a24", "#18301d"], water: ["#2a8a9a", "#2f9aa8"], tall: "#3a7a3a", tree: "#1f5a2a", tint: "120,200,120", tintA: 0.08, fx: "fireflies" },
      rovine: { grass: ["#8a7a52", "#7e6e48", "#927f58"], path: ["#c2a46a", "#b8995e"], stone: ["#8a7a62", "#7e6e56"], wall: ["#4a3a28", "#3e2f20"], water: ["#2a8a9a", "#2f9aa8"], tall: "#8a7a52", tree: "#3a5a2a", tint: "255,190,110", tintA: 0.09, fx: "dust" }
    },
    solid: "aTCRSFABGOIDLQVZW",
    paint: {
      a(K, sx, sy) { const g = K.g; g.fillStyle = "#3e2f20"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#5a4630"; g.fillRect(sx + 1, sy + 1, 14, 6); g.fillRect(sx + 1, sy + 9, 14, 6); g.fillStyle = "#b8955a"; g.fillRect(sx + 6, sy + 3, 4, 2); },
      T(K, sx, sy) { const g = K.g; g.fillStyle = "#4d5a2c"; g.beginPath(); g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 15, sy + 15); g.lineTo(sx + 1, sy + 15); g.closePath(); g.fill(); g.fillStyle = "#2f3a1a"; g.fillRect(sx + 6, sy + 9, 4, 6); },
      C(K, sx, sy) { const g = K.g; g.fillStyle = "#7a4a22"; g.fillRect(sx + 1, sy + 3, 14, 12); g.strokeStyle = "#3e2410"; g.strokeRect(sx + 1.5, sy + 3.5, 13, 11); g.beginPath(); g.moveTo(sx + 1, sy + 3); g.lineTo(sx + 15, sy + 15); g.stroke(); },
      R(K, sx, sy) { const g = K.g; g.fillStyle = "#6e5a3a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#a8884e"; g.beginPath(); g.moveTo(sx, sy + 16); g.lineTo(sx + 16, sy); g.lineTo(sx + 16, sy + 16); g.closePath(); g.fill(); },
      S(K, sx, sy) { const g = K.g; g.fillStyle = "#5a6a52"; g.fillRect(sx + 3, sy + 1, 10, 15); g.fillStyle = "#3a4634"; g.fillRect(sx + 6, sy + 4, 4, 2); g.fillRect(sx + 5, sy + 8, 6, 2); g.fillRect(sx + 7, sy + 12, 2, 2); },
      F(K, sx, sy) { const g = K.g; g.fillStyle = "#2f7a3a"; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx + 8, sy + 15); g.lineTo(sx + 1 + i * 4.5, sy + 2); g.lineTo(sx + 5 + i * 3, sy + 15); g.fill(); } },
      A(K, sx, sy) { const g = K.g; g.fillStyle = "#7a6a52"; g.fillRect(sx, sy, 16, 16); g.strokeStyle = "#f2c14e"; g.lineWidth = 2.5; g.beginPath(); g.arc(sx + 8, sy + 8, 5.5, 0, 7); g.stroke(); g.lineWidth = 1; },
      B(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#5a3a1a"; g.fillRect(sx + 3, sy + 9, 10, 6); g.fillStyle = "#f59e0b"; g.beginPath(); g.arc(sx + 8 + Math.sin(fr / 6 + tx) * 1.2, sy + 6, 4.5, 0, 7); g.fill(); g.fillStyle = "#fef08a"; g.beginPath(); g.arc(sx + 8, sy + 7, 2.2, 0, 7); g.fill(); },
      G(K, sx, sy) { const g = K.g; g.fillStyle = "#4a3a28"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#c9a24a"; g.fillRect(sx + 2, sy + 2, 12, 12); g.fillStyle = "#4a3a28"; g.fillRect(sx + 5, sy + 5, 6, 2); g.fillRect(sx + 7, sy + 8, 2, 4); g.fillStyle = "#6ee7b7"; g.fillRect(sx + 4, sy + 4, 2, 2); g.fillRect(sx + 10, sy + 4, 2, 2); },
      O(K, sx, sy) { const g = K.g; g.fillStyle = "#6e5a3a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#f2c14e"; g.beginPath(); g.arc(sx + 8, sy + 8, 6, 0, 7); g.fill(); g.fillStyle = "#7a4a14"; g.beginPath(); g.arc(sx + 8, sy + 8, 2.5, 0, 7); g.fill(); },
      I(K, sx, sy) { const g = K.g; g.fillStyle = "#1c1917"; g.fillRect(sx + 2, sy + 11, 12, 5); g.fillStyle = "#059669"; g.beginPath(); g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 13, sy + 12); g.lineTo(sx + 3, sy + 12); g.closePath(); g.fill(); g.fillStyle = "#fef08a"; g.fillRect(sx + 7, sy + 6, 2, 2); },
      D(K, sx, sy) { const g = K.g; g.fillStyle = "#3e2f20"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#0b0907"; for (let i = 0; i < 3; i++) g.fillRect(sx + 3, sy + 3 + i * 4, 10, 1.5); },
      L(K, sx, sy) { const g = K.g; g.fillStyle = "#8a7a62"; g.fillRect(sx + 1, sy + 1, 14, 14); g.strokeStyle = "#5a4630"; g.strokeRect(sx + 1.5, sy + 1.5, 13, 13); g.beginPath(); g.moveTo(sx + 8, sy + 2); g.lineTo(sx + 8, sy + 14); g.moveTo(sx + 2, sy + 8); g.lineTo(sx + 14, sy + 8); g.stroke(); },
      Q(K, sx, sy) { const g = K.g; g.fillStyle = "#7a6a52"; g.fillRect(sx, sy, 16, 16); g.strokeStyle = "#fbbf24"; g.lineWidth = 3; g.beginPath(); g.arc(sx + 8, sy + 8, 6, 0, 7); g.stroke(); g.lineWidth = 1; g.fillStyle = "#0f172a"; g.beginPath(); g.arc(sx + 8, sy + 8, 3.5, 0, 7); g.fill(); },
      V(K, sx, sy) { const g = K.g; g.fillStyle = "#38bdf8"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#2f6b3a"; g.fillRect(sx, sy + 10, 16, 6); },
      Z(K, sx, sy) { const g = K.g; g.fillStyle = "#b8955a"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1, sy + 1 + i * 4, 14, 3); g.fillStyle = "#6b4a22"; g.fillRect(sx + 1, sy + 7, 14, 1); },
      W(K, sx, sy) { const g = K.g; g.fillStyle = "#1d6f86"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(sx + 2, sy + 4, 8, 1); g.fillRect(sx + 6, sy + 10, 8, 1); }
    },
    act: { q: "Entra", A: "Guarda l'anello", Q: "Guarda l'Anello Supremo", I: "Osserva l'idolo", G: "Leggi il bassorilievo", S: "Leggi la stele", O: "Guarda l'altare" },
    travel: true,
    item: ["Tessera di Giada", "Tessere di Giada"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      // Profilo idolo di giada triangolare
      g.fillStyle = "#059669";
      g.beginPath();
      g.moveTo(0, -6);
      g.lineTo(5, 5);
      g.lineTo(-5, 5);
      g.closePath();
      g.fill();
      g.strokeStyle = "#fbbf24";
      g.lineWidth = 1.2;
      g.stroke();
      // Occhio dorato centrale
      g.fillStyle = "#fef08a";
      g.beginPath();
      g.arc(0, 0, 1.5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "lizza",
      cageField: 3,
      cageMut: "heavy",
      weather: "clear",
      venue: {
        ads: [
          ["SPEDIZIONE ARCHEOLOGICA 1936", "#f59e0b"],
          ["ISTITUTO STORICO DI MERIDA", "#10b981"],
          ["IL SACRO POK-TA-POK DEI MAYA", "#fbbf24"],
          ["TEMPIO DEL SOLE · YUCATÁN", "#d97706"]
        ],
        crowd: ["#fef3c7", "#d97706", "#059669", "#78350f", "#451a03"],
        ground: ["#78350f", "#451a03"],
        wall: ["#292524", "#1c1917"],
        line: "rgba(254,243,199,.6)",
        sky: ["#1c1917", "#78350f"],
        fx: { fr: 0.98, spd: 1.05, wind: 0.1 }
      }
    },
    guest: {
      id: "my_alvarez",
      lines: [
        "Ah, ragazzo mio! Saluti dall'accademia!",
        "Stavo giusto rileggendo i miei appunti sul Pok-ta-pok di fronte a questo splendido golfo.",
        "Le tue traiettorie ad anca e ginocchio ricordano da vicino i bassorilievi del 1200 a.C.!",
        "La fisica del pallone moderno custodisce ancora l'antico fuoco del sole maya."
      ]
    },
    endings: {
      giaguaro: ["La Consacrazione del Giaguaro", "Hai superato la prova dell'Anello di Pietra rispettando il tempio. Gli antichi guardiani riconoscono il tuo valore e la piramide si sigilla in pace, con i suoi segreti.", "Scegli il rispetto e il silenzio."],
      accademia: ["Il Trionfo dell'Accademia", "I reperti di giada e il codice di Kukulkan vengono catalogati e messi in salvo con il Professor Alvarez. Il museo nazionale celebra la scoperta.", "Dona tutto alla scienza."],
      abisso: ["La Fuga dal Cenote Sommerso", "Guidi la spedizione attraverso le acque sotterranee del Cenote, in una fuga rocambolesca sulla zattera di balsa.", "Scegli le acque del Cenote."],
      kukulkan: ["Il Risveglio del Serpente Piumato", "Finale segreto: la volée all'incrocio dell'anello, sotto l'eclissi, rivela la profezia millenaria. Il calcio è il battito del cosmo.", "Abbraccia la profezia."]
    },
  });

  const K = E.K;

  // Ritratti: serve __borgoApi pronta
  function casts() {
    if (!K.api || !K.api.CAST) return setTimeout(casts, 150);
  K.cast("my_alvarez", {
    name: "Prof. Alvarez",
    sub: "Capo Spedizione Archeologica",
    style: "ordinato",
    hair: "#d1d5db",
    eye: "#3b82f6",
    skin: "#fed7aa",
    shirt: "#78350f",
    beard: "incolta",
    acc: ["occhiali"],
    bg: ["#78350f", "#1c1917"]
  }, "Professore capo della spedizione del 1936. Entusiasta e un po' sbadato, vede il Pok-ta-pok in ogni traiettoria di pallone. Ha sempre un appunto in tasca.");

  K.cast("my_ixchel", {
    name: "Ixchel",
    sub: "Guida dello Yucatán",
    style: "braids",
    hair: "#171717",
    eye: "#059669",
    skin: "#d97706",
    shirt: "#059669",
    acc: ["bandana"],
    streak: "#f59e0b",
    bg: ["#059669", "#064e3b"]
  }, "Guida dello Yucatán, sicura e silenziosa. Conosce ogni sentiero della giungla e ogni rimbalzo del rito. Gioca al tuo fianco come ala e scudo.");

  K.cast("my_vargas", {
    name: "Capitano Vargas",
    sub: "Cacciatore di Tesori",
    style: "buzz",
    hair: "#44403c",
    eye: "#7f1d1d",
    skin: "#fcd34d",
    shirt: "#44403c",
    beard: "baffi",
    scar: true,
    acc: ["cappellino"],
    bg: ["#451a03", "#1c1917"]
  }, "Cacciatore di tesori dal sorriso storto e dalla cicatrice sulla guancia. Non fa nulla per nulla. Il tuo rivale nella corsa alla piramide.");

  K.cast("my_kukulkan", {
    name: "Guardiano Kukulkan",
    sub: "Sacerdote dell'Anello",
    style: "topknot",
    hair: "#18181b",
    eye: "#fbbf24",
    skin: "#b45309",
    shirt: "#b45309",
    acc: ["corona"],
    bg: ["#b45309", "#78350f"]
  }, "Sacerdote-guardiano dell'Anello di Pietra. Parla poco e giudica tutto. Da mille anni aspetta chi sappia onorare il rito del sole.");

  K.cast("my_diego", {
    name: "Diego",
    sub: "Radiotelegrafista",
    style: "messy",
    hair: "#78350f",
    eye: "#1e293b",
    skin: "#fed7aa",
    shirt: "#0284c7",
    acc: ["cuffie"],
    bg: ["#0369a1", "#082f49"]
  }, "Radiotelegrafista della spedizione. Chiacchierone, tiene i contatti con il mondo e la zattera pronta quando serve.");

  }
  casts();

  window.__piramide = E.api;
})();
