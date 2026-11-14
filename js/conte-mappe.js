// js/conte-mappe.js - mappe e zone di «IL CONTE DI MONTECALCIO», riusate da tutti i capitoli (ogni capitolo ne fa una copia con id proprio e PNG propri).
// window.__conteZ.<nome>(over) restituisce una zona completa (build, decor, flavor, areas); `over` sovrascrive id/npcs/intro/doors/time/items ecc.
// Esterni 30x22: piazza, mercato, stadio, giardino. Interni a mano: bar, palazzo, camerino, sede della Curva, spogliatoio, sagrestia, sala da ballo.
(function () {
  "use strict";
  const H = (K) => window.__conteH(K);
  const plaque = (g, d, txt, tx, ty, col) => window.__conteHplaque(g, txt, d.X(tx) + 8, d.Y(ty) - 6, col);
  window.__conteHplaque = (g, txt, x, y, col) => { g.save(); g.font = "700 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(28,12,8,.9)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#e0b44a"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#fde68a"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); };
  const pts = (L, ch, list) => list.forEach(([x, y]) => L.put(x, y, ch));
  const border = (L, w, h, ch) => { L.lay(0, 0, w - 1, 0, ch); L.lay(0, h - 1, w - 1, h - 1, ch); L.lay(0, 0, 0, h - 1, ch); L.lay(w - 1, 0, w - 1, h - 1, ch); };
  const intWalls = (L, w, h, floor) => { L.lay(0, 0, w - 1, h - 1, floor); L.lay(0, 0, w - 1, 0, "a"); L.lay(0, 0, 0, h - 1, "a"); L.lay(w - 1, 0, w - 1, h - 1, "a"); L.lay(0, h - 1, w - 1, h - 1, "a"); };
  const base = { act: { F: "Guarda la fontana", K: "Guarda i candelabri", V: "Guarda i trofei", E: "Guarda le botti", I: "Guarda lo stendardo", C: "Guarda l'armadietto", n: "Leggi il cartello", x: "Apri la cassa", s: "Riposa un momento", q: "Entra", b: "Siediti", u: "Guarda il banco", z: "Guarda le casse", l: "Guarda il lampione", T: "Guarda il tavolo", L: "Guarda la libreria", D: "Guarda la credenza" } };
  const mk = (o, over) => Object.assign({}, o, over || {});

  // ------------------------------------------------------------------ PIAZZA (esterno 30x22)
  function piazza(over) {
    return mk({
      region: "piazza", name: "Piazza di Montecalcio", short: "Piazza", sub: "Fontana, municipio e un campanile in ritardo di sette minuti", bg: "ct_piazza", time: "giorno", w: 30, h: 22, base: "e", start: [15, 16],
      items: [[3, 11], [19, 16], [13, 10], [20, 19]],
      areas: [[2, 3, 9, 8, "Il Bar Sport"], [11, 3, 18, 8, "San Cosimo"], [20, 3, 28, 8, "Il Municipio"], [2, 13, 10, 19, "Palazzo Vanni"], [21, 14, 28, 19, "Il Forno Pilastro"], [0, 0, 29, 21, "Montecalcio · la piazza"]],
      act: base.act,
      flavor: { F: "La fontana: tre leoni di pietra che sputano acqua, uno solo funzionante. I ragazzi ci fanno le sfide di palleggio: chi la manda in acqua paga il caffè.", l: "Un lampione a gas, convertito all'elettrico nel '68 e rimasto con la stessa luce incerta.", n: "Un cartello: «MERCATO DEL BASSO ▸ · STADIO FERRANTE ▾». Sotto, scritto a pennarello: «chi cerca, trova. Di solito la fine del mese».", b: "Una panca col nome di un benefattore. Il benefattore, dice la targa, «è stato molto generoso con sé stesso».", s: "Ti siedi in piazza. Nessuno ti guarda: succede solo quando hai una faccia che non ti appartiene.", t: "Un tiglio. Sotto, quindici anni fa, hai scritto un nome con un coltellino. Non lo cerchi." },
      build(L) {
        const { lay, put, house } = L;
        border(L, 30, 22, "t"); lay(1, 1, 28, 1, "t");
        house(2, 3, 8, 5, { door: [5, 7], roof: "#9b5f3f", wall: "#b98a5a", chimney: true, enter: { to: "ct_bar", at: [7, 8] } });
        house(11, 3, 7, 5, { door: [14, 7], roof: "#6b3a2a", wall: "#d6cdb8", enter: { to: "ct_sagrestia", at: [6, 7], locked: (K) => (K.F.is("ct_open3") ? false : "San Cosimo: la porta è accostata. Dentro, l'odore di cera e di partite finite male. Don Cosimo, per ora, non riceve.") } });
        house(20, 3, 8, 5, { door: [23, 7], roof: "#7a3f2a", wall: "#c9b78e", enter: "Il Municipio: portone chiuso, avviso «chiuso per riunione». Dalle finestre filtra una luce da ufficio." });
        house(2, 13, 9, 6, { door: [6, 18], roof: "#5a1520", wall: "#e0d2b0", chimney: true, enter: { to: "ct_palazzo", at: [8, 9] } });
        house(21, 14, 7, 5, { door: [24, 18], roof: "#7f1d1d", wall: "#cdb98a", enter: "Il Forno Pilastro: pane caldo, striscioni piegati sullo scaffale e un cane che dorme sul sacco di farina." });
        lay(5, 8, 5, 11, ":"); lay(14, 8, 14, 10, ":"); lay(23, 8, 23, 12, ":"); lay(6, 19, 6, 20, ":"); lay(24, 19, 24, 20, ":");
        put(15, 11, "F"); [[13, 13], [17, 13]].forEach(([x, y]) => put(x, y, "b"));
        [[3, 9], [9, 9], [12, 9], [18, 9], [19, 12], [27, 9], [3, 12], [11, 12], [27, 12]].forEach(([x, y]) => put(x, y, "l"));
        [[1, 2], [28, 2], [1, 20], [28, 20], [12, 20], [17, 20], [20, 12], [26, 12], [11, 16], [27, 20]].forEach(([x, y]) => put(x, y, "t"));
        put(27, 11, "n"); put(16, 19, "n"); put(26, 11, "s");
        put(29, 10, "q"); put(29, 11, "q"); put(14, 21, "q"); put(15, 21, "q"); put(0, 10, "q"); put(0, 11, "q");
      },
      doors: {
        "29,10": { to: "ct_mercato", at: [1, 10], locked: (K) => (K.F.is("ct_open2") ? false : "Il Mercato del Basso apre domani, dicono. Per ora hai ancora da fare in piazza.") },
        "29,11": { to: "ct_mercato", at: [1, 11], locked: (K) => (K.F.is("ct_open2") ? false : "Il Mercato del Basso apre domani, dicono. Per ora hai ancora da fare in piazza.") },
        "14,21": { to: "ct_stadio", at: [14, 20], locked: (K) => (K.F.is("ct_open3") ? false : "Il cancello dello stadio è chiuso con un catenaccio. Per ora.") },
        "15,21": { to: "ct_stadio", at: [15, 20], locked: (K) => (K.F.is("ct_open3") ? false : "Il cancello dello stadio è chiuso con un catenaccio. Per ora.") },
        "0,10": { to: "ct_giardino", at: [14, 20], locked: (K) => (K.F.is("ct_open4") ? false : "Dal cancello laterale si intravede il giardino di Palazzo Vanni, chiuso a chiave. Per ora.") },
        "0,11": { to: "ct_giardino", at: [15, 20], locked: (K) => (K.F.is("ct_open4") ? false : "Dal cancello laterale si intravede il giardino di Palazzo Vanni, chiuso a chiave. Per ora.") }
      },
      decor(g, cx, cy, d) { plaque(g, d, "BAR SPORT", 5, 3, "#fde68a"); plaque(g, d, "SAN COSIMO", 14, 3, "#e5e7eb"); plaque(g, d, "COMUNE", 23, 3, "#bae6fd"); plaque(g, d, "PALAZZO VANNI", 6, 12, "#fbcfe8"); plaque(g, d, "FORNO", 24, 13, "#fcd34d"); plaque(g, d, "MERCATO ▸", 27, 9, "#fde68a"); plaque(g, d, "STADIO ▾", 15, 20, "#bbf7d0"); }
    }, over);
  }

  // ------------------------------------------------------------------ BAR SPORT (interno 14x10)
  function bar(over) {
    return mk({
      interior: true, region: "bar", name: "Il Bar Sport del Moro", short: "Bar Sport", sub: "Una macchina del caffè con più storia della squadra", bg: "ct_palazzo", w: 14, h: 10, start: [7, 8], outside: ["ct_piazza", 5, 8], base: "=",
      act: base.act,
      flavor: { u: "Il bancone: legno scuro, tre sgabelli e una scritta incisa col coltellino: «NON SI FA CREDITO AI TIFOSI. NEMMENO AI VIVI.»", V: "La bacheca dei trofei: una coppa del 1971, una del '88 e un cucchiaio d'argento «per la partecipazione». Gino dice che il cucchiaio è il più onesto.", n: "Una parete di foto: la squadra di quindici anni fa, in posa. Un volto è stato coperto con un pezzo di nastro adesivo. Sul nastro, a penna: «non toccare».", T: "Un tavolo con un solitario cominciato e mai finito. Il fante di cuori è stato sostituito da un biglietto da visita.", b: "Una panca con la sciarpa della Curva piegata come una coperta.", E: "Una botte di vino della casa. Dentro c'è il vino. Sulla botte c'è scritto «non è vero»." },
      build(L) {
        const { lay, put } = L; intWalls(L, 14, 10, "="); put(7, 9, "v");
        lay(2, 3, 5, 3, "u"); lay(7, 3, 9, 3, "u"); put(10, 3, "V"); put(11, 3, "V"); lay(2, 1, 2, 2, "a"); put(1, 6, "n"); put(1, 5, "n"); [[11, 6], [11, 7]].forEach(([x, y]) => put(x, y, "T")); [[3, 7], [4, 7]].forEach(([x, y]) => put(x, y, "b")); put(12, 2, "E"); put(12, 8, "l");
      },
      decor(g, cx, cy, d) { plaque(g, d, "BAR SPORT", 7, 0, "#fde68a"); plaque(g, d, "LA PARETE", 1, 4, "#fca5a5"); }
    }, over);
  }

  // ------------------------------------------------------------------ PALAZZO VANNI (interno 16x11) + CAMERINO (10x7)
  function palazzo(over) {
    return mk({
      interior: true, region: "palazzo", name: "Palazzo Vanni · il salotto", short: "Palazzo Vanni", sub: "Candelabri accesi, tre cani e un'ottantenne con opinioni", bg: "ct_palazzo", w: 16, h: 11, start: [8, 9], outside: ["ct_piazza", 6, 19], base: "m",
      act: base.act,
      flavor: { K: "Candelabri a cinque bracci. La contessa dice che la luce giusta fa mentire meglio di una dichiarazione giurata.", V: "Vetrina dei trofei di famiglia: pugnali, medaglie, un pallone del 1907 con la firma di un fondatore e un buco di spillo.", L: "Libri rilegati: bilanci di famiglia, un atlante e, nascosto, un romanzo giallo con il finale strappato.", D: "Una credenza con servizio da tè. Tre tazze sono ancora tiepide.", T: "Un tavolino di mogano. Sul piano, la contessa ha scritto con una matita da cucito i nomi di chi non invita più.", b: "Un divanetto che ha visto tre generazioni di tradimenti, tutti molto educati." },
      build(L) {
        const { lay, put } = L; intWalls(L, 16, 11, "m"); lay(5, 2, 10, 9, "Y"); put(8, 10, "v");
        [[2, 1], [13, 1], [2, 8], [13, 8]].forEach(([x, y]) => put(x, y, "K")); lay(3, 1, 4, 1, "V"); lay(11, 1, 12, 1, "V"); lay(1, 3, 1, 6, "L"); put(14, 5, "D"); put(14, 6, "D");
        [[4, 4], [11, 4]].forEach(([x, y]) => put(x, y, "T")); put(12, 7, "b"); put(3, 7, "b"); put(14, 2, "q");
      },
      doors: { "14,2": { to: "ct_camerino", at: [2, 5] } },
      decor(g, cx, cy, d) { plaque(g, d, "SALOTTO", 8, 0, "#fbcfe8"); plaque(g, d, "CAMERINO ▸", 14, 1, "#fde68a"); }
    }, over);
  }
  function camerino(over) {
    return mk({
      interior: true, region: "bar", name: "Il camerino del teatrino", short: "Camerino", sub: "Costumi di tre generazioni e uno specchio che non adula", bg: "ct_palazzo", w: 10, h: 7, start: [2, 5], outside: ["ct_palazzo", 14, 3], base: "=",
      act: base.act,
      flavor: { x: "Il baule dei costumi del teatrino di famiglia. Sul coperchio, la scritta in oro: «PER CHI HA BISOGNO DI ESSERE QUALCUN ALTRO».", L: "Scaffali di parrucche, baffi, cappelli e una scatola «volti di riserva».", n: "Uno specchio con la cornice scrostata. Ti guarda come se aspettasse una spiegazione.", D: "Una credenza di cerone, colle e cipria. Odore di anni '50.", T: "Un tavolo da trucco con lampadine che funzionano a turno.", b: "Una panca con un cuscino a forma di maschera." },
      build(L) { const { lay, put } = L; intWalls(L, 10, 7, "="); put(1, 6, "v"); put(8, 1, "x"); lay(1, 1, 3, 1, "L"); put(5, 1, "n"); put(1, 3, "D"); put(8, 4, "T"); put(8, 5, "b"); },
      decor(g, cx, cy, d) { plaque(g, d, "CAMERINO", 5, 0, "#fde68a"); }
    }, over);
  }

  // ------------------------------------------------------------------ MERCATO DEL BASSO (esterno 30x22) + SEDE DELLA CURVA (14x10)
  function mercato(over) {
    return mk({
      region: "mercato", name: "Il Mercato del Basso", short: "Mercato", sub: "Banchi, botti e un forno che fa da quartier generale", bg: "ct_piazza", time: "giorno", w: 30, h: 22, base: ",", start: [2, 10],
      items: [[8, 7], [18, 12], [10, 17], [25, 18]],
      areas: [[1, 2, 8, 6, "I banchi del pesce"], [11, 2, 19, 6, "I banchi della frutta"], [22, 3, 28, 8, "La sede della Curva"], [3, 14, 10, 19, "La corte delle botti"], [14, 12, 24, 19, "Il campetto"], [0, 0, 29, 21, "Montecalcio · il Basso"]],
      act: base.act,
      flavor: { u: "Un banco di frutta, ordinatissimo: ogni arancia con il torso verso il cliente. Il fruttivendolo dice che è psicologia.", E: "Botti di vino e di salamoia. L'ultimo che le ha aperte tutte a caso ha scoperto un nuovo tipo di acciuga.", I: "Lo stendardo della Curva: granata e oro, ricamato a mano. Qualcuno ha cucito sotto: «PERDERE CON ONORE È UN LAVORO».", n: "Un cartello: «CURVA NORD ▸ · NON SI PARCHEGGIA, NON SI SPUTA, NON SI CANTA IN LATINO».", b: "Una panca. Sopra, un cesto con una sola scarpa.", l: "Un lampione con attaccato un biglietto: «RIPARATO DA GENTE FIDATA». La luce è fioca, ma fidata.", z: "Casse di verdure, e dietro l'ultima un pallone chiuso in una rete.", g: "Una porta da calcio improvvisata con due cassette di pomodori e un rastrello.", s: "Ti siedi tra i banchi. Il mercato è l'unico posto di Montecalcio dove puoi stare in silenzio senza che sembri un'accusa." },
      build(L) {
        const { lay, put, house } = L;
        border(L, 30, 22, "t"); put(0, 10, "e"); put(0, 11, "e");
        lay(1, 9, 28, 10, ":"); lay(1, 11, 28, 11, ",");
        house(22, 3, 7, 5, { door: [25, 7], roof: "#7f1d1d", wall: "#a8a29e", enter: { to: "ct_sede", at: [7, 8] } });
        house(3, 14, 7, 5, { door: [6, 18], roof: "#6b4a30", wall: "#c9b27c", enter: "La corte delle botti: il magazzino del vinaio. Alla porta, un cartello: «il vino non è in vendita; la discrezione costa di più»." });
        lay(1, 3, 6, 3, "u"); lay(11, 3, 18, 3, "u"); put(8, 4, "E"); put(9, 4, "E"); put(10, 4, "E"); put(7, 6, "z"); put(19, 5, "z");
        lay(14, 14, 24, 14, "f"); lay(14, 18, 24, 18, "f"); lay(14, 14, 14, 18, "f"); lay(24, 14, 24, 18, "f"); put(14, 16, ","); put(24, 16, ","); put(15, 15, "g"); put(23, 17, "g");
        [[28, 2], [1, 7], [12, 8], [20, 8], [3, 12], [9, 12], [26, 12], [11, 20], [20, 20]].forEach(([x, y]) => put(x, y, "l"));
        put(24, 8, "I"); put(26, 8, "I"); put(21, 9, "n"); put(27, 15, "s"); put(12, 16, "E"); put(12, 17, "E");
        [[2, 2], [27, 2], [1, 20], [28, 20], [12, 12], [17, 20], [29, 7]].forEach(([x, y]) => put(x, y, "t"));
        put(0, 10, "q"); put(0, 11, "q");
      },
      doors: { "0,10": { to: "ct_piazza", at: [28, 10] }, "0,11": { to: "ct_piazza", at: [28, 11] } },
      decor(g, cx, cy, d) { plaque(g, d, "CURVA NORD", 25, 2, "#fca5a5"); plaque(g, d, "PESCE", 3, 2, "#bae6fd"); plaque(g, d, "FRUTTA", 14, 2, "#fde68a"); plaque(g, d, "CAMPETTO", 19, 13, "#bbf7d0"); plaque(g, d, "◂ PIAZZA", 1, 8, "#fde68a"); }
    }, over);
  }
  function sede(over) {
    return mk({
      interior: true, region: "sede", name: "La sede della Curva Nord", short: "Sede Curva", sub: "Striscioni, un tavolo da ping-pong e un odore di focaccia", bg: "ct_palazzo", w: 14, h: 10, start: [7, 8], outside: ["ct_mercato", 25, 8], base: "=",
      act: base.act,
      flavor: { n: "Uno striscione appena finito: «MONTECALCIO NON SI VENDE». Sotto, tra parentesi: «tranne a prezzo giusto».", I: "Lo stendardo storico. Per quindici anni lo hanno portato in trasferta nascosto sotto un maglione.", T: "Un tavolo da ping-pong coperto da un tavolo di riunione, coperto da un tavolo da pranzo. Tre livelli di sede.", b: "Una panca con il cuscino con scritto «Posto del Pilastro. Non sedersi. Davvero.»", D: "Una credenza di trofei da trasferta: sciarpe di rivali sconfitte, in ordine di vergogna.", V: "Una vetrinetta di cimeli: un biglietto del '71, un fischietto spezzato, una bandierina di un guardalinee mai ritrovato." },
      build(L) { const { lay, put } = L; intWalls(L, 14, 10, "="); put(7, 9, "v"); lay(2, 1, 4, 1, "n"); put(8, 1, "I"); put(10, 1, "I"); lay(2, 4, 4, 5, "T"); put(12, 3, "D"); put(12, 4, "D"); put(11, 7, "b"); put(12, 7, "b"); put(1, 7, "V"); put(1, 8, "V"); },
      decor(g, cx, cy, d) { plaque(g, d, "CURVA NORD", 7, 0, "#fca5a5"); }
    }, over);
  }

  // ------------------------------------------------------------------ STADIO FERRANTE (esterno 30x22) + SPOGLIATOIO (14x10) + SAGRESTIA (12x9)
  function stadio(over) {
    return mk({
      region: "stadio", name: "Lo stadio Ferrante", short: "Stadio", sub: "Una tribuna storta, un prato che ha visto tutto e una porta più bassa dell'altra", bg: "ct_stadio", time: "giorno", w: 30, h: 22, base: ",", start: [15, 19],
      items: [[4, 9], [25, 9], [4, 19], [25, 13]],
      areas: [[1, 1, 28, 5, "La tribuna"], [8, 7, 21, 16, "Il campo"], [22, 16, 28, 19, "Gli spogliatoi"], [0, 0, 29, 21, "Stadio Ferrante"]],
      act: base.act,
      flavor: { j: "La tribuna: panche di cemento col nome dei donatori. Il quarto da sinistra dice «anonimo». Non lo era: lo sanno tutti.", g: "Una porta più bassa dell'altra. Dicono che i portieri di Montecalcio crescano di lato.", n: "Un cartello: «VIETATO CALPESTARE IL PRATO · VIETATO NON AMARLO».", l: "Un riflettore storto, puntato a metà sul campo e a metà sulla notte.", b: "La panchina della squadra di casa, con una sola seduta imbottita: quella del Mister.", s: "Ti siedi a bordo campo. Dal prato sale l'odore che non hai mai dimenticato.", f: "La recinzione, riparata in tre epoche diverse: rete, filo spinato, ragazzi seduti sopra.", z: "Casse di palloni sgonfi e coni stinti. Il magazzino ha un solo reparto: quello «da aggiustare».", I: "Lo stendardo del club, scolorito dal sole e dai risultati." },
      build(L) {
        const { lay, put, house } = L;
        border(L, 30, 22, "t"); lay(1, 1, 28, 1, "a"); lay(1, 2, 28, 4, "j"); lay(1, 5, 28, 5, "f"); put(14, 5, ","); put(15, 5, ",");
        lay(8, 7, 21, 16, "-"); lay(8, 7, 21, 7, "f"); lay(8, 16, 21, 16, "f"); lay(8, 7, 8, 16, "f"); lay(21, 7, 21, 16, "f"); put(14, 7, "-"); put(15, 7, "-"); put(14, 16, "-"); put(15, 16, "-");
        put(9, 11, "g"); put(9, 12, "g"); put(20, 11, "g"); put(20, 12, "g");
        house(22, 16, 6, 4, { door: [24, 19], roof: "#475569", wall: "#a8a29e", enter: { to: "ct_spogliatoio", at: [7, 8] } });
        lay(24, 20, 24, 20, ":"); lay(14, 17, 15, 20, ":"); put(12, 18, "b"); put(17, 18, "b"); put(3, 8, "I"); put(26, 8, "I");
        [[2, 7], [27, 7], [3, 17], [11, 20], [18, 20], [2, 12], [27, 12]].forEach(([x, y]) => put(x, y, "l")); put(5, 18, "z"); put(6, 18, "z"); put(26, 12, "n"); put(2, 18, "s");
        put(14, 21, "q"); put(15, 21, "q");
      },
      doors: { "14,21": { to: "ct_piazza", at: [14, 20] }, "15,21": { to: "ct_piazza", at: [15, 20] } },
      decor(g, cx, cy, d) { plaque(g, d, "TRIBUNA FERRANTE", 14, 1, "#fde68a"); plaque(g, d, "SPOGLIATOI", 24, 15, "#bae6fd"); plaque(g, d, "◂ PIAZZA", 15, 20, "#fde68a"); }
    }, over);
  }
  function spogliatoio(over) {
    return mk({
      interior: true, region: "spogliatoio", name: "Lo spogliatoio vecchio", short: "Spogliatoio", sub: "Quarantasei armadietti, uno con un numero cancellato", bg: "ct_notte", w: 14, h: 10, start: [7, 8], outside: ["ct_stadio", 24, 20], base: "=",
      act: base.act,
      flavor: { C: "Un armadietto verde. Dentro: un paio di calzini spaiati e un biglietto «lunedì pulire».", b: "Una panca lunga quanto la sala. Ci si siede per vincere. O per fare finta.", z: "Casse di palloni e una lavagna tattica coperta da un panno. Quando lo sollevi, la lavagna è ancora scritta: «4-4-2. Non perdere la testa.»", n: "Una lavagna col nome dei convocati di quindici anni fa. Il nome del nove è stato cancellato con una spugna. Non è stata una spugna.", L: "Scaffali di maglie lavate, numerate, piegate come lenzuola.", D: "Un mobile con le medaglie dei ragazzi: «per la partecipazione». Una per ogni anno, una per ogni ragazzo.", T: "Il tavolo del Mister. Sopra, un fischietto con l'anello d'ottone e un paio di occhiali spaiati." },
      build(L) { const { lay, put } = L; intWalls(L, 14, 10, "="); put(7, 9, "v"); lay(2, 1, 6, 1, "C"); lay(8, 1, 12, 1, "C"); put(1, 3, "C"); put(12, 3, "C"); lay(3, 4, 5, 4, "b"); lay(8, 4, 10, 4, "b"); put(2, 7, "z"); put(3, 7, "z"); put(11, 7, "D"); put(12, 7, "T"); put(1, 5, "n"); put(12, 5, "L"); },
      decor(g, cx, cy, d) { plaque(g, d, "SPOGLIATOIO", 7, 0, "#bae6fd"); plaque(g, d, "N. 9", 2, 0, "#fca5a5"); }
    }, over);
  }
  function sagrestia(over) {
    return mk({
      interior: true, region: "canonica", name: "La sagrestia di San Cosimo", short: "Sagrestia", sub: "Registri di battesimi, di matrimoni e, per vizio, di partite", bg: "ct_palazzo", w: 12, h: 9, start: [6, 7], outside: ["ct_piazza", 14, 8], base: "e",
      act: base.act,
      flavor: { L: "Scaffali di registri rilegati. Su un dorso, a mano: «PARTITE 1907–OGGI (con note)».", T: "Un tavolo di noce con un calamaio vero. Don Cosimo scrive ancora con l'inchiostro. Dice che le bugie, col pennino, si vedono di più.", K: "Candele di cera d'api. Si accendono per le funzioni e per le visite che non vuole far sapere.", x: "Una cassapanca di paramenti. In fondo, qualcosa di quadrato avvolto in un panno.", D: "Una credenza con ostie, vino e un fiasco di grappa «per usi liturgici».", b: "Un inginocchiatoio logoro. Un ginocchio si è consumato più dell'altro." },
      build(L) { const { lay, put } = L; intWalls(L, 12, 9, "e"); put(6, 8, "v"); lay(1, 1, 5, 1, "L"); lay(7, 1, 10, 1, "L"); put(1, 3, "K"); put(10, 3, "K"); put(5, 4, "T"); put(6, 4, "T"); put(10, 6, "x"); put(2, 6, "D"); put(9, 6, "b"); },
      decor(g, cx, cy, d) { plaque(g, d, "SAGRESTIA", 6, 0, "#e5e7eb"); }
    }, over);
  }

  // ------------------------------------------------------------------ GIARDINO DI PALAZZO VANNI (esterno 30x22) + SALA DA BALLO (18x12)
  function giardino(over) {
    return mk({
      region: "giardino", name: "Il giardino di Palazzo Vanni", short: "Giardino", sub: "Lanterne, siepi tagliate col righello e un ballo in maschera in corso", bg: "ct_ballo", time: "notte", w: 30, h: 22, base: ",", start: [15, 19],
      items: [[4, 6], [25, 7], [5, 16], [26, 16]],
      areas: [[9, 1, 21, 7, "Il Palazzo"], [3, 9, 9, 15, "Il labirinto di siepe"], [20, 9, 27, 15, "Le tavole imbandite"], [0, 0, 29, 21, "Giardino Vanni"]],
      act: base.act,
      flavor: { F: "Una fontana illuminata con lanterne galleggianti. Qualcuno ha fatto un desiderio e poi ha preso la moneta.", l: "Lanterne di carta appese ai rami. Ogni colore è una famiglia del borgo; il rosso, quest'anno, è stato offerto a tutti.", u: "Un tavolo con paste, vini e una brocca d'acqua per i cani. I cani, naturalmente, sono invitati.", K: "Un candelabro da giardino. Fa luce e un po' di ombra, il giusto per una conversazione indecente.", n: "Un cartello: «BALLO IN MASCHERA · I NOMI SI LASCIANO ALL'INGRESSO, LE INTENZIONI NO».", b: "Una panca dietro la siepe. Si sente ogni parola di chi passa. La contessa lo sa.", t: "Siepi tagliate col righello. Il giardiniere è stato arruolato per la precisione e licenziato per il carattere.", s: "Ti siedi tra le lanterne. Per una volta nessuno ti chiede chi sei: tutti sono qualcun altro." },
      build(L) {
        const { lay, put, house } = L;
        border(L, 30, 22, "t"); lay(1, 1, 28, 1, "t");
        house(9, 2, 12, 6, { door: [14, 7], roof: "#5a1520", wall: "#e0d2b0", chimney: true, enter: { to: "ct_sala", at: [9, 10] } });
        lay(14, 8, 14, 12, ":"); lay(15, 8, 15, 12, ":"); lay(8, 12, 21, 13, ":"); lay(14, 14, 15, 20, ":");
        put(14, 12, "F"); put(15, 12, "F");
        for (let y = 9; y <= 15; y += 2) { lay(3, y, 9, y, "t"); } put(6, 9, ","); put(4, 11, ","); put(8, 13, ","); put(3, 15, ","); put(9, 10, ","); put(9, 12, ","); put(9, 14, ",");
        lay(20, 9, 26, 9, "u"); lay(20, 15, 26, 15, "u"); put(23, 9, ","); put(23, 15, ",");
        [[11, 9], [18, 9], [11, 17], [18, 17], [6, 19], [24, 19], [3, 4], [26, 4], [8, 8], [21, 8]].forEach(([x, y]) => put(x, y, "l"));
        [[12, 19], [17, 19]].forEach(([x, y]) => put(x, y, "K")); put(13, 17, "b"); put(16, 17, "b"); put(27, 12, "n"); put(2, 18, "s");
        [[2, 2], [27, 2], [1, 20], [28, 20], [2, 12], [27, 17]].forEach(([x, y]) => put(x, y, "t"));
        put(14, 21, "q"); put(15, 21, "q");
      },
      doors: { "14,21": { to: "ct_piazza", at: [1, 10] }, "15,21": { to: "ct_piazza", at: [1, 11] } },
      decor(g, cx, cy, d) { plaque(g, d, "PALAZZO VANNI", 14, 1, "#fbcfe8"); plaque(g, d, "LA SALA ▴", 14, 6, "#fde68a"); plaque(g, d, "LABIRINTO", 6, 8, "#bbf7d0"); plaque(g, d, "TAVOLE", 23, 8, "#fde68a"); plaque(g, d, "◂ PIAZZA ▾", 15, 20, "#fde68a"); }
    }, over);
  }
  function sala(over) {
    return mk({
      interior: true, region: "sala", name: "La sala da ballo", short: "Sala da ballo", sub: "Lampadari accesi per la prima volta in sette anni", bg: "ct_ballo", w: 18, h: 12, start: [9, 10], outside: ["ct_giardino", 14, 8], base: "m",
      act: base.act,
      flavor: { K: "Candelabri in fila lungo la sala. Ogni cero, dice la Contessa, vale un invitato.", V: "Vetrine con i regali di nozze di tre generazioni: posate d'argento, un barometro e una scatola per «lettere da non spedire».", p: "Una colonna di marmo con un balcone di tromba. Nei giorni di ballo ci sale un violinista.", n: "Una lavagna del cerimoniale: «Il valzer dei nomi: 22:00. La maschera si toglie a mezzanotte, o non si toglie mai».", z: "Il palco dell'orchestra: un pianoforte, tre violini e un leggio con musica appena stampata. «Valzer n. 7: il Sospetto».", D: "Un buffet. Ogni tartina ha un biglietto: «per chi sa già», «per chi vuole sapere».", T: "Un tavolino di cristallo con un registro degli invitati. Alcune righe sono in matita, altre rifatte con la matita." },
      build(L) {
        const { lay, put } = L; intWalls(L, 18, 12, "m"); lay(5, 2, 12, 9, "Y"); put(9, 11, "v");
        [[1, 1], [16, 1], [1, 9], [16, 9]].forEach(([x, y]) => put(x, y, "K")); lay(3, 1, 5, 1, "V"); lay(12, 1, 14, 1, "V"); [[3, 3], [3, 6], [14, 3], [14, 6]].forEach(([x, y]) => put(x, y, "p"));
        lay(7, 1, 10, 1, "z"); put(1, 4, "n"); put(16, 4, "D"); put(16, 5, "D"); put(16, 7, "T"); put(1, 7, "T");
      },
      decor(g, cx, cy, d) { plaque(g, d, "SALA DA BALLO", 9, 0, "#fde68a"); plaque(g, d, "ORCHESTRA", 8, 1, "#fbcfe8"); }
    }, over);
  }

  window.__conteZ = { piazza, bar, palazzo, camerino, mercato, sede, stadio, spogliatoio, sagrestia, giardino, sala };
})();
