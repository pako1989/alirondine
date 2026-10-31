// js/zampano.js - «IL CIRCO ZAMPANÒ · LA PISTA DI SEGATURA» · saga a scorrimento acrobatico (motore js/scorri.js col kit «circo»: sfera acrobatica, PIROETTA AEREA, trampolini a molla e anelli del trapezio)
// Pian dei Venti, sopra il Borgo Marino, autunno d'altri tempi. Il vecchio Maestro Zampanò pianta il tendone cremisi e avorio, ma l'impresario rivale Barone Orloff (Gran Circo Imperiale)
// e il ragioniere comunale Bacci minacciano lo sgombero tra tasse d'occupazione e un cavo del generatore tagliato di notte.
// Novità nel motore comune: IL CARTELLONE / LA SCALETTA (cfg.billboard): sblocca i numeri della compagnia, componi i 3 posti in scaletta, scopri le Sinergie di Pista e porta i benefici nei livelli.
(function () {
  "use strict";
  if (window.__zampano || !window.__sagaCore) return;
  const LV = {
    pista1: { name: "Il tendone delle prove", icon: "🎪", theme: "tendone", d: "Pedane di larice, trampolini a molla, pagliacci a molla e anelli del trapezio sotto i festoni.",
      signs: ["◀ ▶ corri, ⤒ salta! Sali sul TRAMPOLINO rosso e giallo per balzare in alto fino alle funi.", "In aria premi 🎪 per la PIROETTA AEREA: respinge i birilli e stordisce i rivali!", "Vicino a un ANELLO D'ORO del trapezio, premi 🎪 in volo per darti lo slancio!"],
      map: [
        "#............................................................................................................#",
        "#............................................................................................................#",
        "#............................................................................................................#",
        "#......................S.....................................................................................#",
        "#....................=====...................................................S...............................#",
        "#......................................O...................................=====.............................#",
        "#..............ooo...........................................O.....................................S.........#",
        "#.............=====.................................ooo..........................................=====.......#",
        "#....................................=====.........=====.....................h.......ooo.....................#",
        "#.......ooo..................o.o.o..........................................===.....=====............o.o.....#",
        "#.P.i.........p....T.........=====....C....i....l..........p...T.......C.....................p..d.........E..#",
        "########################...###########################...##################....##############################",
        "########################...###########################...##################....##############################"] },
    ercole: { name: "La pedana dei pesi", icon: "🏋️", theme: "tendone", boss: "forzuto", d: "Ercole di Ghisa, campione del Gran Circo Imperiale, fa tremare la segatura col bilanciere.",
      map: [
        "#........................#", "#........................#", "#........................#", "#........................#", "#...........O............#", "#........................#",
        "#..h.....................#", "#.====..............====.#", "#........................#", "#........................#", "#..P...T....Z.......T....#", "##########################", "##########################"] },
    pista2: { name: "I carri nella bruma", icon: "🚃", theme: "carri", d: "Di sera tra i carri dipinti della carovana: giocolieri rivali, barboncini acrobati e tetti bagnati.",
      signs: ["I giocolieri in gilet viola lanciano birilli: respingili con la PIROETTA 🎪 in aria o con la sfera!", "I barboncini su sfera corrono svelti: usa i trampolini per passare sopra i tetti dei carri."],
      map: [
        "#................................................................................................................#",
        "#................................................................................................................#",
        "#................................................................................................................#",
        "#.............................S..................................................................................#",
        "#...........................=====.................................................S..............................#",
        "#...................O.......................................O...................=====............................#",
        "#.............................................ooo......................................................S.........#",
        "#...........ooo..............................=====.....................h.............................=====.......#",
        "#..........=====......................................................====...........O...........................#",
        "#.......................o.o.o.........B..................o.o.o..................................o.o..............#",
        "#.P..i....b......T......=====...C.....B..i....l.....b....=====....T....C........l.......b...T.........d.......E..#",
        "#####################..###################.......########################...#####################################",
        "#####################..###################.......########################...#####################################"] },
    frusta: { name: "Il recinto d'ottone", icon: "🎩", theme: "carri", boss: "domatore", d: "Monsieur Frusta, istruttore di Orloff, lancia birilli e balza da un lato all'altro del recinto.",
      map: [
        "#........................#", "#........................#", "#........................#", "#........................#", "#...........O............#", "#........................#",
        "#..h.....................#", "#.====..............====.#", "#........................#", "#........................#", "#..P...T....Z.......T....#", "##########################", "##########################"] },
    pista3: { name: "L'intreccio della cupola", icon: "🎠", theme: "cupola", d: "Lassù tra i cavi d'acciaio e i riflettori della cupola: salti nel vuoto da un anello d'oro all'altro.",
      signs: ["In quota i vuoti sono larghi: salta dal trampolino e premi 🎪 dentro gli ANELLI D'ORO per volare!", "Gli inservienti col cerchio dorato parano davanti: scavalcali in piroetta o colpiscili alle spalle."],
      map: [
        "#....................................................................................................................#",
        "#....................................................................................................................#",
        "#...................................S................................................................................#",
        "#.................................=====.................................................S............................#",
        "#.........................O.......................................O...................=====..........................#",
        "#................O.......................................O...................O................................S......#",
        "#..............................................ooo..........................................................=====....#",
        "#........ooo..................................=====........................h.........................................#",
        "#.......=====........................====.................................====................O......................#",
        "#....................o.o.o......................................o.o.o....................................o.o.........#",
        "#.P.i.......T........=====.....C..........l.......d....T........=====......C.......p.....d....T..............l....E..#",
        "###############....##################..........###################....##########################....#################",
        "###############....##################..........###################....##########################....#################"] },
    specchio: { name: "Il padiglione degli specchi", icon: "🔮", theme: "cupola", boss: "illusionista", d: "Il Grande Specchio sparisce in una nuvola viola e lancia ventagli di carte prima dell'inchino.",
      map: [
        "#........................#", "#........................#", "#........................#", "#........................#", "#.....O...........O......#", "#........................#",
        "#..h.....................#", "#.====..............====.#", "#........................#", "#........................#", "#..P........Z............#", "##########################", "##########################"] },
    pista4: { name: "La parata del Gran Gala", icon: "🌟", theme: "gala", d: "Coriandoli d'oro, riflettori incrociati e tutta la compagnia di Orloff schierata per fermare il Gran Finale.",
      signs: ["È la sera del Gran Gala! Sfrutta i benefici della tua Scaletta: trampolini, anelli e piroette fino al sipario!"],
      map: [
        "#......................................................................................................................#",
        "#......................................................................................................................#",
        "#............................S.........................................................S...............................#",
        "#..........................=====.....................................................=====.............................#",
        "#...................O.........................................O..............................................S.........#",
        "#.....................................O.......................................O............................=====.......#",
        "#..........ooo.......................................ooo........................................O......................#",
        "#.........=====.....................................=====........................h.....................................#",
        "#.......................====....................................................====.....................ooo...........#",
        "#.................o.o.o....................o.o.o........................o.o.o...........................=====..........#",
        "#.P.i...p...T.....=====....d...C...l..b....=====....T........p....d.....=====....C.....l...b....T............d......E..#",
        "###############..###################....#################..########################..##################################",
        "###############..###################....#################..########################..##################################"] },
    orloff: { name: "Il cerchio del Barone", icon: "👑", theme: "gala", boss: "direttore", d: "Il Barone Orloff scende in pista col cilindro nero: onde d'urto, birilli d'oro e riflettori.",
      map: [
        "#........................#", "#........................#", "#........................#", "#........................#", "#.....O...........O......#", "#........................#",
        "#..h.....................#", "#.====..............====.#", "#........................#", "#........................#", "#..P...T....Z.......T....#", "##########################", "##########################"] }
  };
  window.__zampanoLV = LV;

  const E = window.__sagaCore.create({
    id: "zampano", key: "ali-di-rondine.zampano", title: "Il Circo Zampanò", icon: "🎪", bg: "ci_titolo", chapters: 4,
    menuSub: "Pian dei Venti, sopra il Borgo Marino. Il tendone cremisi di Maestro Zampanò rischia lo sgombero contro il Gran Circo Imperiale del Barone Orloff: componi la Scaletta dei numeri e vola tra trampolini e trapezi.",
    theme: { accent: "#f59e0b", ink: "#fffbeb", paper: "rgba(38,14,22,.94)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#7f1d1d", chipBorder: "#fbbf24" },
    stats: { applausi: [0, 24, 2, "Applausi"], cuore: [0, 12, 0, "Cuore"], prestigio: [0, 12, 0, "Prestigio"] },
    weight: { name: "L'anima della pista", axes: { cuore: ["Cuore", "🎪"], prestigio: ["Prestigio", "👑"] } },
    item: ["Gettone d'ottone", "Gettoni d'ottone"],
    drawItem(g, x, y, i, f) {
      const w = [4, 3, 1, 3][Math.floor(f / 7 + i) % 4];
      g.save(); g.translate(x, y + Math.sin(f / 11 + i) * 1.4);
      g.fillStyle = "#92400e"; g.beginPath(); g.ellipse(0, 0, w + 1, 5, 0, 0, 7); g.fill();
      g.fillStyle = "#fde047"; g.beginPath(); g.ellipse(0, 0, w, 4, 0, 0, 7); g.fill();
      if (w > 2) { g.fillStyle = "#dc2626"; g.fillRect(-1, -2, 2, 4); }
      g.restore();
    },
    clock: {
      slots: ["Pomeriggio", "Sera", "Notte"], hud: true,
      tint: [null, "rgba(251,146,60,.10)", "rgba(15,23,60,.26)"],
      onSlot(K, d, sl, nm) {
        if (nm === "Sera") return [["voce", "I lampioni di Pian dei Venti si accendono uno a uno. Dal tendone sale odore di zucchero filato e segatura calda."]];
        if (nm === "Notte") return [["voce", "È calata la notte sui carri dipinti. Solo la lanterna del generatore dondola nel vento."]];
        return null;
      }
    },
    cases: {
      cavo: {
        t: "Il cavo tranciato",
        q: "Chi ha tagliato il cavo maestro del generatore dietro il serraglio la sera della vigilia?",
        items: {
          cesoia: { t: "Taglio netto col nichel", icon: "✂️", kind: "prova", d: "Il cavo di rame non è logoro: è tranciato di sbieco con una cesoia isolata che ha lasciato scaglie di nichel." },
          turno_pippo: { t: "Il quadro tiepido alle 21", icon: "💡", kind: "testimonianza", d: "Pippo giura che nessuno è entrato dopo le nove, ma la leva del quadro elettrico era ancora tiepida durante la Sera." },
          ricevuta: { t: "Bolla del traghetto", icon: "🧾", kind: "prova", d: "In biglietteria c'è una ricevuta portuale per due cesoie al nichel fatturate al «Gran Circo Imperiale · conto Orloff»." },
          testimone_wanda: { t: "Il mantello viola di Sera", icon: "🪡", kind: "testimonianza", d: "Zia Wanda dalla sartoria ha visto un mantello viola dietro il generatore di Sera, proprio mentre Bacci contava le marche da bollo allo sportello." }
        },
        links: [
          ["cesoia", "ricevuta", "Il taglio netto con tracce di nichel combacia con le cesoie industriali fatturate al Gran Circo Imperiale, non con un guasto per usura."],
          ["turno_pippo", "testimone_wanda", "Mentre il ragionier Bacci timbrava le carte in biglietteria di Sera, un uomo col mantello viola di Orloff armeggiava al quadro ancora tiepido."]
        ],
        verdicts: [
          { id: "orloff", label: "🎩 È stato un uomo del Barone Orloff", sub: "Sabotaggio deliberato per far saltare il collaudo comunale", big: true },
          { id: "incidente", label: "⚡ È stato un cedimento per usura", sub: "Chiudi il caso senza accusare nessuno per calmare il Comune" },
          { id: "bacci", label: "📋 È stato il ragionier Bacci", sub: "Accusa l'ispettore comunale di aver manomesso i cavi" }
        ]
      }
    },
    billboard: {
      name: "Il Cartellone di Pista", icon: "🎪", slots: 3,
      acts: {
        trapezio: { n: "Il Volo di Lila", icon: "🤸", who: "ci_lila", applause: 3, buff: "piuma", buffTxt: "Salto più alto e leggero", d: "Lila apre la serata sotto la cupola e insegna a prendere l'aria controvento." },
        fanfara: { n: "La Tromba di Tonio", icon: "🎺", who: "ci_tonio", applause: 2, buff: "monete", buffTxt: "+5 gettoni d'apertura", d: "Marcia d'ottone stonata al punto giusto: il pubblico ride e lancia gettoni in pista." },
        pesi: { n: "Il Bilanciere di Golia", icon: "🏋️", who: "ci_ercole", applause: 3, buff: "vita", buffTxt: "+1 pezzo di costume nei livelli", d: "Golia solleva due ruote di carro con un dito e ti presta la cintura di cuoio." },
        clave: { n: "I Lampi di Pippo", icon: "🤹", who: "ci_pippo", applause: 2, buff: "calamita", buffTxt: "Calamita per i gettoni vicini", d: "Sei birilli dorati che girano così svelti da attirare ogni moneta nel raggio." },
        tarocchi: { n: "Gli Specchi di Miranda", icon: "🔮", who: "ci_miranda", applause: 3, buff: "piuma", buffTxt: "Passo felpato tra le funi", d: "Tre specchi d'argento e un fumo profumato d'arancia che incanta le prime file." },
        filo: { n: "Il Filo di Zia Wanda", icon: "🪡", who: "ci_wanda", applause: 3, buff: "vita", buffTxt: "Mantella rinforzata (+1 colpo)", d: "Trent'anni d'equilibrio col parasole ricamato: nessuno trattiene il fiato come lei." }
      },
      synergies: {
        aria_musica: {
          pair: ["trapezio", "fanfara"], n: "Valzer Sospeso", icon: "🎶", applause: 3, buff: "piuma",
          d: "Tonio rallenta il tempo di valzer sull'ottone proprio mentre Lila lascia la sbarra.",
          lines: [["ci_tonio", "[felice] Se tengo il fiato sul la bemolle, Lila ha mezzo secondo in più per girarsi in aria!"], ["ci_lila", "[felice] Mezzo secondo lassù vale un'eternità, Tonio. Stasera voliamo senza rete."]]
        },
        forza_luce: {
          pair: ["pesi", "clave"], n: "Tuono e Scintille", icon: "⚡", applause: 3, buff: "vita",
          d: "Golia batte il bilanciere a tempo coi birilli accesi di Pippo.",
          lines: [["ci_ercole", "[felice] Quando batto la ghisa a terra, tu lancia le clave in verticale, ragazzo."], ["ci_pippo", "[felice] Promesso, Golia! Basta che non lanci in aria pure me!"]]
        },
        destino_seta: {
          pair: ["tarocchi", "filo"], n: "Il Filo del Destino", icon: "✨", applause: 4, buff: "calamita",
          d: "Gli specchi di Miranda riflettono Zia Wanda sul cavo teso come se camminasse tra le stelle.",
          lines: [["ci_miranda", "Tre lune nello specchio, Wanda: il pubblico non capirà dove finisce il cavo e dove comincia il cielo."], ["ci_wanda", "[commosso] Come a Marsiglia nel cinquantadue, Miranda. Allora allaccia bene le paillettes."]]
        },
        gran_parata: {
          pair: ["fanfara", "clave"], n: "Parata Comica", icon: "🎉", applause: 2, buff: "monete",
          d: "Pippo infila i birilli nella campana della tromba di Tonio e ne escono coriandoli.",
          lines: [["ci_tonio", "[sorpreso] Ehi! Chi mi ha messo un birillo nel trombone?!"], ["ci_pippo", "[felice] Non toccarlo, Tonio, che i bambini in galleria stanno ridendo da tre minuti!"]]
        }
      }
    },
    regions: {
      spiazzo: { grass: ["#5e7a3a", "#567034", "#668440"], path: ["#d4b078", "#caa66e"], stone: ["#9c8878", "#927e6e"], wall: ["#8a2432", "#781e2a"], water: ["#4280a8", "#3c769e"], tall: "#4d662e", tree: ["#3b5626", "#4c6c30", "#8a5a28"], tint: "255,175,110", tintA: 0.14, fx: "leaves", dark: 0.06 },
      tendone: { grass: ["#6e1d2a", "#641824", "#782230"], path: ["#e2be78", "#d8b46e"], stone: ["#8a5a3c", "#805236"], wall: ["#4a101a", "#3e0c16"], water: ["#3a6a8a", "#346080"], tall: "#6e1d2a", tint: "255,205,120", tintA: 0.16, fx: "", dark: 0.10 },
      carro: { grass: ["#4e3222", "#462c1e", "#563826"], path: ["#7a5236", "#704a30"], stone: ["#644634", "#5c402e"], wall: ["#2c1810", "#24140c"], water: ["#2a4a6a", "#264662"], tall: "#4e3222", tint: "255,190,120", tintA: 0.15, fx: "", dark: 0.14 },
      cupola: { grass: ["#261a38", "#201530", "#2c1f40"], path: ["#6a5038", "#604832"], stone: ["#524868", "#4a4060"], wall: ["#181026", "#140c20"], water: ["#1e3256", "#1a2c4c"], tall: "#261a38", tint: "190,160,255", tintA: 0.16, fx: "fireflies", dark: 0.22 },
      gala: { grass: ["#7a1626", "#6e1220", "#861b2c"], path: ["#ecc874", "#e2be6a"], stone: ["#9e7b3c", "#927034"], wall: ["#420c16", "#380912"], water: ["#366890", "#305e86"], tall: "#7a1626", tint: "255,215,120", tintA: 0.18, fx: "fireflies", dark: 0.08 }
    },
    floors: "QYUZ", solid: "IXKEFVAPJROGNCM",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "Q") { // segatura dorata della pista con coriandoli rossi e azzurri
        g.fillStyle = (tx + ty) % 2 ? "#e2be78" : "#d9b46c"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(140,90,30,.22)"; g.fillRect(sx + ((tx * 5) % 12), sy + ((ty * 7) % 12), 3, 1);
        if ((tx * 7 + ty * 3) % 7 === 0) { g.fillStyle = (tx + ty) % 3 ? "#dc2626" : "#2563eb"; g.fillRect(sx + 5, sy + 6, 2, 2); }
        return true;
      }
      if (f === "Y") { // assi di larice lucidate dei carri e dei camerini
        g.fillStyle = (tx + ty) % 2 ? "#7c4e2e" : "#865634"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 7, 16, 1); g.fillRect(sx, sy + 15, 16, 1);
        g.fillStyle = "rgba(255,220,160,.10)"; g.fillRect(sx, sy, 16, 1); return true;
      }
      if (f === "U") { // tappeto cremisi e oro di velluto da parata
        const d = (tx + ty) % 2; g.fillStyle = d ? "#991b1b" : "#7f1d1d"; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "#facc15"; g.fillRect(sx + 7, sy + 3, 2, 10); g.fillRect(sx + 3, sy + 7, 10, 2); return true;
      }
      if (f === "Z") { // prato calpestato di Pian dei Venti con paglia e picchetti
        g.fillStyle = (tx * 3 + ty) % 2 ? "#6b8444" : "#627a3e"; g.fillRect(sx, sy, 16, 16);
        if ((tx + ty * 5) % 5 === 0) { g.fillStyle = "#d4b078"; g.fillRect(sx + 3, sy + 9, 4, 2); }
        return true;
      }
      return false;
    },
    paint: {
      // cordone cremisi e paletto d'ottone del bordo pista
      I(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#78350f"; g.fillRect(sx, sy + 10, 16, 5);
        g.fillStyle = tx % 2 ? "#dc2626" : "#fef3c7"; g.fillRect(sx, sy + 6, 16, 5);
        g.fillStyle = "#eab308"; g.fillRect(sx + 6, sy + 1, 4, 12); g.fillRect(sx + 5, sy, 6, 2);
      },
      // arco del sipario di pista (avvia i livelli a scorrimento)
      X(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#7f1d1d"; g.fillRect(sx, sy - 10, 16, 26);
        g.fillStyle = "#dc2626"; g.fillRect(sx + 1, sy - 8, 4, 24); g.fillRect(sx + 11, sy - 8, 4, 24);
        g.fillStyle = "#1c1917"; g.fillRect(sx + 5, sy - 4, 6, 20);
        g.fillStyle = "#facc15"; g.fillRect(sx, sy - 11, 16, 3);
        const a = 0.45 + 0.2 * Math.sin(fr / 5 + tx); K.light(sx + 8, sy - 2, 28, "255,210,90", a);
      },
      // gradinate di legno del pubblico con bandierine
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        for (let i = 0; i < 3; i++) { g.fillStyle = i % 2 ? "#7c4a28" : "#925830"; g.fillRect(sx, sy + i * 5, 16, 5); }
        g.fillStyle = tx % 2 ? "#dc2626" : "#eab308"; g.fillRect(sx, sy + 13, 16, 3);
        if ((tx + ty) % 3 === 0) { g.fillStyle = "#38bdf8"; g.fillRect(sx + 6, sy + 1 - (Math.floor(fr / 12 + tx) % 2), 4, 4); }
      },
      // chiosco dello zucchero filato e dei biglietti
      E(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#7c2d12"; g.fillRect(sx + 1, sy + 8, 14, 7);
        for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#fffbeb" : "#dc2626"; g.fillRect(sx + i * 4, sy - 2, 4, 6); }
        g.fillStyle = "#f472b6"; g.fillRect(sx + 4, sy + 5, 3, 3); g.fillStyle = "#fde047"; g.fillRect(sx + 9, sy + 5, 4, 3);
      },
      // leggio d'ottone del Cartellone / Scaletta
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#92400e"; g.fillRect(sx + 6, sy + 7, 4, 8); g.fillRect(sx + 4, sy + 13, 8, 2);
        g.fillStyle = "#eab308"; g.fillRect(sx + 2, sy - 5, 12, 13);
        g.fillStyle = "#fffbeb"; g.fillRect(sx + 3, sy - 4, 10, 11);
        g.fillStyle = "#dc2626"; g.fillRect(sx + 4, sy - 2, 8, 2); g.fillRect(sx + 4, sy + 2, 6, 1); g.fillRect(sx + 4, sy + 4, 7, 1);
        if (Math.floor(fr / 18) % 2) K.light(sx + 8, sy, 18, "255,215,90", 0.25);
      },
      // generatore elettrico e rocchetto di cavi
      G(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#334155"; g.fillRect(sx + 1, sy + 2, 14, 12); g.fillStyle = "#475569"; g.fillRect(sx + 2, sy + 3, 12, 3);
        g.fillStyle = Math.floor(fr / 10) % 2 ? "#38bdf8" : "#f59e0b"; g.fillRect(sx + 11, sy + 7, 2, 2);
        g.fillStyle = "#b45309"; g.fillRect(sx + 3, sy + 8, 6, 3);
      },
      // rastrelliera di clave, cerchi e bilancieri
      P(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#1f2937"; g.fillRect(sx + 1, sy + 10, 14, 3); g.fillRect(sx + 2, sy + 8, 3, 6); g.fillRect(sx + 11, sy + 8, 3, 6);
        g.fillStyle = "#eab308"; g.fillRect(sx + 5, sy + 1, 2, 8); g.fillRect(sx + 9, sy + 1, 2, 8);
      },
      // manichino di sartoria con mantella di paillettes
      M(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#78350f"; g.fillRect(sx + 7, sy + 9, 2, 6); g.fillRect(sx + 5, sy + 14, 6, 1);
        g.fillStyle = "#dc2626"; g.fillRect(sx + 4, sy, 8, 10); g.fillStyle = "#fde047"; g.fillRect(sx + 6, sy + 1, 4, 3);
      },
      // specchiera da camerino con lampadine calde
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#78350f"; g.fillRect(sx + 2, sy - 4, 12, 16);
        g.fillStyle = "#bae6fd"; g.fillRect(sx + 4, sy - 2, 8, 10);
        g.fillStyle = "#fde047"; [[3, -3], [12, -3], [3, 5], [12, 5]].forEach(([x, y]) => g.fillRect(sx + x, sy + y, 1, 1));
        K.light(sx + 8, sy + 2, 20, "255,220,140", 0.25 + 0.05 * Math.sin(fr / 6));
      },
      // picchetto d'ottone con fune tesa del tendone
      C(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g;
        g.fillStyle = "#eab308"; g.fillRect(sx + 6, sy + 6, 4, 8); g.fillRect(sx + 5, sy + 5, 6, 2);
        g.strokeStyle = "#d6d3d1"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sx + 8, sy + 6); g.lineTo(sx + 15, sy - 6); g.stroke();
      }
    },
    act: { X: "Entra in pista", A: "Apri il Cartellone", K: "Guarda le gradinate", E: "Guarda il chiosco", G: "Esamina il generatore", P: "Guarda gli attrezzi", M: "Guarda i costumi", V: "Guarda la specchiera", C: "Controlla il picchetto", n: "Leggi l'avviso", x: "Apri il baule", s: "Riposa sulla panca", q: "Entra", l: "Guarda il lampione", b: "Siediti" },
    rest: { ch: "s", label: "Riposa sulla panca", text: "Ti siedi su una cassa dipinta e ascolti la fisarmonica lontana. Il gioco salva da solo. Dal menu: 🎪 Cartellone e 🎪 Piste acrobatiche." },
    texts: { nothing: "Segatura dorata, corde di canapa e profumo di mele caramellate.", noHero: "Maestro Zampanò cerca un acrobata col pallone per salvare lo spettacolo. Crea prima il tuo Campione.", chestOpen: "Sollevi il coperchio del baule di scena.", chestEmpty: "Nel baule restano solo coriandoli e un naso finto di gomma." },
    journal: { name: "Il Taccuino del Tendone", sub: "Cartellone, indizi, coccarde d'oro e finali" },
    scroll: {
      eng: "__scorri", kit: "circo", name: "🎪 Le piste acrobatiche", banName: "Coccarde d'oro", banIcon: "🏵️",
      practiceName: "La pista di prova", practiceSub: "Prova trampolino, sfera acrobatica, piroetta aerea e anelli del trapezio",
      hint: "Nessuna pista superata, per ora. Le esibizioni partono dal sipario cremisi (X) dopo aver parlato con Zampanò. Intanto puoi allenarti nella pista di prova!",
      levels: LV,
      bonus: (K) => (K.inv.has("ci_spilla") ? 1 : 0) + (K.inv.has("ci_fascia") ? 1 : 0),
      buffs: (K) => (K.billboard ? K.billboard.activeBuffs() : [])
    },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Spettatore", "Aiuto pista", "Compagno di carro", "Artista di punta", "Famiglia Zampanò"],
      scenes: {
        ci_lila: [{ lv: 2, id: "lil2", lines: [["ci_lila", "Mio padre montava i tendoni da Marsiglia a Trieste. Diceva che lassù, tra una sbarra e l'altra, c'è un istante in cui non appartieni a nessun padrone."], ["ci_lila", "[felice] Orloff offre stipendi d'oro, ma ti fa firmare dove e quando sorridere. Tu invece salti come uno di noi."]], reward: (K) => K.bond("cuore", 1) }],
        ci_tonio: [{ lv: 2, id: "ton2", prize: "Spilla della Rondine (+1 pezzo nei livelli)", lines: [["ci_tonio", "Tutti pensano che fare il pagliaccio sia cadere per sbaglio. Invece per cadere senza farsi male bisogna studiare più di un ingegnere."], ["ci_tonio", "[felice] Tieni la mia Spilla della Rondine (🎒 Zaino): tienila appuntata alla giacca, in pista vale un colpo in più!"]], reward: (K) => K.inv.give("ci_spilla") }],
        ci_ercole: [{ lv: 2, id: "erc2", lines: [["ci_ercole", "I pesi di Orloff sono vuoti dentro, te lo dico io che li ho sollevati nel cinquantotto. Fanno rumore di latta, ma il pubblico applaude lo stesso."], ["ci_ercole", "[serio] I nostri pesano davvero. Per questo facciamo più fatica a cambiare piazza, ma dormiamo dritti."]], reward: (K) => K.bond("prestigio", 1) }],
        ci_wanda: [{ lv: 2, id: "wan2", prize: "Fascia elastica di Wanda (+1 pezzo nei livelli)", lines: [["ci_wanda", "Ho cucito l'abito di nozze di mia sorella e quaranta mantelle per Zampanò con la stessa macchina a pedale."], ["ci_wanda", "[felice] Prendi questa Fascia di seta doppia (🎒 Zaino): protegge la schiena quando atterri dai trampolini."]], reward: (K) => K.inv.give("ci_fascia") }]
      }
    },
    inv: {
      items: {
        ci_sfera: { n: "Sfera a spicchi di Zampanò", icon: "🎪", d: "Pallone da equilibrio cucito a spicchi cremisi e oro. Rimbalza sui tamburi e torna sempre tra i piedi.", gift: {}, giftAny: 0 },
        ci_spilla: { n: "Spilla della Rondine", icon: "🪶", d: "Spilla d'ottone di Tonio: nelle piste acrobatiche vale un pezzo di costume in più.", gift: {}, giftAny: 0 },
        ci_fascia: { n: "Fascia di seta di Wanda", icon: "🧣", d: "Fascia cucita a tre strati: nelle piste acrobatiche vale un colpo in più.", gift: {}, giftAny: 0 },
        ci_zucchero: { n: "Cono di zucchero filato", icon: "🍭", d: "Rosa come il tramonto sul mare, appena filato al chiosco.", gift: { ci_pippo: 6, ci_lila: 5 }, giftAny: 2, react: { ci_pippo: "[felice] Ancora caldo! Adesso faccio girare sei birilli con una mano sola!", ci_lila: "[felice] Non dirlo a Zampanò che lo mangio prima di salire in cupola!" } },
        ci_tarocco: { n: "Carta della Stella", icon: "🃏", d: "Un arcano dipinto a mano da Madame Miranda: porta consiglio a chi guarda in alto.", gift: { ci_miranda: 6, ci_zampano: 5 }, giftAny: 2, react: { ci_miranda: "La Stella ritorna sempre a chi non vende il proprio nome.", ci_zampano: "[commosso] Era la carta preferita di mia moglie Adele, quando teneva la cassa." } },
        ci_chiave_carro: { n: "Chiave d'ottone del serraglio", icon: "🗝️", d: "Apre il carro-officina dove passano i cavi del generatore.", gift: {}, giftAny: 0 },
        ci_cesoia_prova: { n: "Scaglia di nichel", icon: "🔩", d: "Frammento lucido rimasto incastrato nella guaina del cavo tranciato.", gift: {}, giftAny: 0 },
        ci_contratto: { n: "Contratto del Barone Orloff", icon: "📜", d: "Carta filigranata del Gran Circo Imperiale: paga tripla, ma il nome Zampanò sparisce dai manifesti.", gift: {}, giftAny: 0 }
      }
    },
    endings: {
      carovana: ["La Carovana Libera", "Rifiutate l'assegno di Orloff e ripartite all'alba coi carri ridipinti: il Circo Zampanò resta piccolo, libero e pieno di voci.", "Difendi il Cuore della carovana contro l'offerta di Orloff."],
      stabile: ["Il Teatro Tenda del Borgo", "Con il sabotaggio smascherato e il trionfo del Gala, il Comune concede a Zampanò dimora fissa a Pian dei Venti.", "Smaschera il sabotaggio col Dossier e fai brillare il Prestigio della compagnia."],
      imperiale: ["Sotto l'Insegna d'Oro", "Il Gran Circo Imperiale assorbe la pista: riflettori perfetti, stipendi puntuali e un pizzico di nostalgia per i vecchi carri.", "Accetta il contratto del Barone Orloff o cedi la pista finale."],
      stellare: ["Il Salto delle Rondini d'Oro", "Segreto: tutti e sei i numeri in Cartellone, sinergie perfette, Orloff smascherato e un ultimo volo in cupola che il Borgo racconterà per cinquant'anni.", "Segreto: sblocca tutti i 6 numeri del Cartellone, scopri almeno 2 sinergie, risolvi il Dossier e stringi legame con Lila e Tonio."]
    },
    heroLook: (h, K) => (K && K.F && K.F.is("ci_divisa") ? { bg: ["#7f1d1d", "#fde047"], shirt: "#dc2626" } : { bg: ["#7f1d1d", "#fbbf24"] }),
    heroTitle: () => "acrobata di pista",
    musicMain: "circo",
    music: { circo: { bpm: 116, chords: ["C", "G", "Am", "F", "C", "D7", "G", "C"], lres: 2, lw: "square", lv: 0.026,
      lead: "G4 - C5 - E5 - G5 - | D5 - B4 - G4 - - - | A4 - C5 - E5 - C5 - | F5 - E5 - D5 - C5 - | E5 - G5 - C6 - G5 - | F#5 - A5 - D5 - - - | G5 - F5 - E5 - D5 - | C5 - - - - - - -",
      bass: "R . 5 . R . 5 . R . 5 . R . 5 .", bv: 0.08, arp: "1 3 5 8 5 3 1 5", aw: "triangle", av: 0.015, drum: "k . h . s . h . k . h . s . h h", dv: 0.05 } },
    guide: () => [
      ["🎪 Piste acrobatiche", "Al sipario cremisi (X) parte l'esibizione a scorrimento. ◀ ▶ corri, ⤒ salti, 🎪 a terra calci la SFERA ACROBATICA, mentre in aria fai la PIROETTA AEREA (respinge i birilli e stordisce i rivali) o ti slanci sugli ANELLI D'ORO del trapezio!"],
      ["📋 Il Cartellone di Pista", "Dal leggio d'ottone (A) o dal menu componi i 3 numeri della serata. Ogni numero alza gli Applausi e ti dà un beneficio nei livelli; certe coppie attivano una SINERGIA segreta tra gli artisti!"],
      ["🗂️ Il Dossier del cavo", "Nel Capitolo 2 raccogli prove e testimonianze sul cavo tranciato e confrontale nel Dossier per scoprire le contraddizioni prima del verdetto."]
    ],
    zoneMenuExtra: (K) => [
      ...(K.billboard ? [{ label: "🎪 Il Cartellone di Pista", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(() => K.done(), true) }] : []),
      ...(K.scroll ? [{ label: "🤸 Piste acrobatiche", sub: Object.keys(LV).some((id) => K.scroll.won(id)) ? "Rigioca le piste per raccogliere le Coccarde d'oro o allenati" : "Prova subito i comandi nella pista di prova", fn: () => K.scroll.open(() => K.done()) }] : [])
    ],
    cameos: [],
    guest: { id: "ci_tonio", lines: ["Tonio Pagliaccio, tromba d'ottone e scarpe misura cinquantadue! Al Borgo Marino il vento accorda gli strumenti da solo.", "Se vedi passare un gabbiano col mio cilindro a righe, digli che glielo presto fino a domenica."] }
  });

  window.__zampanoH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f2937", skin: "#e8be96" }, o), bio),
      plaque(g, txt, x, y, col) {
        g.save(); g.font = "700 6px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 8;
        g.fillStyle = "rgba(38,14,22,.92)"; g.fillRect(x - w / 2, y - 4, w, 9);
        g.strokeStyle = col || "#fbbf24"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8);
        g.fillStyle = col || "#fef3c7"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore();
      },
      level(id, who, line, cb) {
        const go = () => K.scroll.play(id, {}, (r) => cb(r || {}));
        const l = H.flush().concat(line ? [[who || "ci_zampano", line]] : []);
        if (l.length) K.say(l, go); else go();
      },
      people() {
        H.cast("ci_zampano", "Maestro Zampanò", "Direttore del Circo Zampanò", { style: "bald", hair: "#e5e7eb", shirt: "#b91c1c", skin: "#d9a679", beard: "baffi", acc: ["cappello"], bg: ["#7f1d1d", "#fde047"] }, "Sessantotto anni, marsina cremisi rammendata da Wanda e voce che riempie il tendone senza megafono. Guida sette carri e una famiglia che non ha lo stesso cognome.");
        H.cast("ci_lila", "Lila Vento", "Trapezista di punta", { style: "ponytail", hair: "#1e1b4b", shirt: "#ec4899", skin: "#f1c8a6", eye: "#1d4ed8", acc: ["fiore"], bg: ["#831843", "#fbcfe8"] }, "Ventidue anni, polsi di ferro e sorriso controvento. Vola sotto la cupola senza guardare in basso e non sopporta chi compra gli applausi.");
        H.cast("ci_tonio", "Tonio Pagliaccio", "Clown musicista e meccanico", { style: "curly", hair: "#ea580c", shirt: "#facc15", skin: "#fde8d7", eye: "#15803d", acc: ["occhiali"], bg: ["#854d0e", "#fef08a"] }, "Suona la tromba, aggiusta il generatore col fil di ferro e conosce a memoria l'umore delle gradinate dal primo colpo di grancassa.");
        H.cast("ci_ercole", "Golia Tenace", "Uomo forzuto e cuoco", { style: "short", hair: "#292524", shirt: "#d97706", skin: "#d49a6a", beard: "corta", bg: ["#78350f", "#fed7aa"] }, "Alza due quintali di ghisa alle nove e prepara il minestrone per dodici persone alle undici. Parla piano per non spaventare i barboncini.");
        H.cast("ci_miranda", "Madame Miranda", "Illusionista e archivista", { style: "long", hair: "#581c87", shirt: "#7e22ce", skin: "#e5b890", eye: "#6d28d9", acc: ["sciarpa"], bg: ["#3b0764", "#e9d5ff"] }, "Custodisce gli specchi di scena, le locandine storiche dal 1924 e tre mazzi di tarocchi marsigliesi in cui esce sempre la Stella.");
        H.cast("ci_pippo", "Pippo Lampo", "Giovane giocoliere e datore luci", { style: "spiky", hair: "#92400e", shirt: "#2563eb", skin: "#f3cfb0", bg: ["#1e3a8a", "#bfdbfe"] }, "Sedici anni, dita macchiate di pece greca e sei birilli dorati sempre nello zaino. Manovra l'occhio di bue dalla passerella.");
        H.cast("ci_orloff", "Barone Orloff", "Impresario del Gran Circo Imperiale", { style: "slick", hair: "#111827", shirt: "#312e81", skin: "#e2c2a8", beard: "pizzetto", acc: ["cappello"], bg: ["#1e1b4b", "#c084fc"] }, "Colleziona tendoni di provincia come francobolli: compra i numeri migliori, cancella le vecchie insegne e trasforma tutto in franchising d'oro.");
        H.cast("ci_bacci", "Ragionier Bacci", "Ispettore dell'Ufficio Suolo Pubblico", { style: "parted", hair: "#6b7280", shirt: "#374151", skin: "#ebd0b8", acc: ["occhiali"], bg: ["#1f2937", "#d1d5db"] }, "Metro pieghevole nel taschino, cartelletta di cuoio e terrore delle correnti d'aria. Ama i regolamenti, ma in segreto da bambino voleva fare il domatore.");
        H.cast("ci_wanda", "Zia Wanda", "Sarta di scena ed ex funambola", { style: "bun", hair: "#d6d3d1", shirt: "#be123c", skin: "#e2b896", acc: ["occhiali"], bg: ["#881337", "#fecdd3"] }, "Settant'anni, tre spilli tra le labbra e un passato sul cavo d'acciaio da Parigi al Cairo. Cuce paillettes che resistono ai salti mortali.");
      }
    };
    return H;
  };
  window.__zampano = E.api; window.__zampanoCore = E;
})();
