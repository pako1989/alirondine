// js/cristalli-c1.js - CRISTALLI DEL CAMPO · Capitolo 1 «Il Guerriero della Luce»
// Borgo Radice (isola sospesa al tramonto), Bosco delle Lucciole (la trivella di Ferrogrigio), Grotta di Terra (i Golem: Battaglia ATB forzata).
// Arrivano Aira (dal cielo, senza ricordi) e Bram (il fabbro). Alla fine l'aeronave di Vela Ruggine precipita nel campo del borgo.
(function () {
  "use strict";
  function boot() { const CR = window.__cristalli; if (!CR || !CR.addChapter) return setTimeout(boot, 120); CR.addChapter(chapter1); }
  function chapter1(X) {
    const { T, F, say, ask, done, go, note, setStep, reward, bond, learnLore, unlockJob, join, finishChapter } = X;
    const N = 1, S = () => X.stepOf(N);

    // ---------------------------------------------------------------- personaggi
    X.cast("cr_aira", { name: "Aira", tag: "", hair: "#d9d4e8", style: "long", skin: "#f2d0b8", eye: "#8a6ad8", bg: ["#0a1440", "#8a6ad8"], shirt: "#3fa7ff" },
      "Una ragazza dai capelli d'argento caduta dal cielo sopra Borgo Radice. Gentile, testarda, regista nata: vede i passaggi prima che esistano. Non ricorda da dove viene. Quando un Cristallo è vicino, le sue mani si scaldano.");
    X.cast("cr_bram", { name: "Bram", tag: "", hair: "#7a3b2e", style: "buzz", skin: "#c68642", eye: "#2b1d14", bg: ["#3a2418", "#c9a227"], shirt: "#a8862a", beard: true },
      "Il fabbro di Borgo Radice. Brontola, sbuffa, ripara tutto. In campo è un muro: dicono che una volta abbia fermato un pallone con la fronte e che il pallone abbia chiesto scusa.");
    X.cast("cr_trillo", { name: "Trillo", tag: "", hair: "#ffffff", style: "messy", skin: "#f6e8dc", eye: "#2a2a6a", bg: ["#2a6a3a", "#bfe3ff"], shirt: "#7ac84a" },
      "Un mufflo con le ali: una palla di lana bianca grande come un cuscino, con due alucce che non dovrebbero bastare per volare. Tiene la bancarella del borgo e veglia sul cristallo azzurro. Quando è contento fa «frrr».");
    X.cast("cr_ortensia", { name: "Nonna Ortensia", tag: "gray", hair: "#d8d8d8", style: "bun", skin: "#e8c4a0", eye: "#3a2a1a", glasses: true, bg: ["#5a3a2a", "#e8c48a"], shirt: "#6a8a4a" },
      "La capovillaggio di Borgo Radice. Ha arbitrato sessanta Partite del Cristallo e non ha mai dato un rigore sbagliato. Dice lei.");
    X.cast("cr_pim", { name: "Recluta Pim", tag: "", hair: "#c9a26a", style: "messy", skin: "#f0d0b0", eye: "#3a5a8a", cap: "#5a5a62", bg: ["#2a2a33", "#8a8a9a"], shirt: "#5a5a62" },
      "Un soldatino dell'Impero di Ferrogrigio, diciassette anni e un elmo troppo grande. Ha il compito di sorvegliare una trivella. Non sa bene cosa trivelli.");
    X.cast("cr_kael", { name: "Gen. Kael Ferrogrigio", tag: "", hair: "#3a3a44", style: "slick", skin: "#d9b090", eye: "#c0392b", bg: ["#1a1a22", "#c0392b"], shirt: "#2a2a33" },
      "Generale dell'Impero di Ferrogrigio. Cappotto di ferro, voce bassa, nessuna fretta. Le sue corazzate volano con la luce dei Cristalli. Dice che ha le sue ragioni. Le dice a pochi.");
    X.cast("cr_vela", { name: "Capitana Vela Ruggine", tag: "", hair: "#c0392b", style: "codino", skin: "#e0ac7e", eye: "#2a6a3a", cap: "#5a3a2a", bg: ["#2a1a10", "#e8a040"], shirt: "#7a4ab0" },
      "Pilota dell'aeronave «Rondine Grigia», contrabbandiera di professione e funambola per vocazione: in campo cammina sulle linee come su un filo. Ride quando dovrebbe avere paura.");
    X.cos("cr_c1", { kind: "shirt", label: "Casacca del Guerriero", val: "#3f5fbf", from: "Completa il Capitolo 1 di Cristalli del Campo" });
    X.cos("cr_tramonto", { kind: "hairc", label: "Capelli Tramonto", val: "#e8743a", from: "Raccogli tutti i frammenti di luce a Borgo Radice" });
    X.cos("cr_lucciola", { kind: "shirt", label: "Maglia Lucciola", val: "#9ad84a", from: "Raccogli tutti i frammenti di luce nel Bosco delle Lucciole" });
    X.cos("cr_ambra", { kind: "hairc", label: "Capelli d'Ambra", val: "#d89a3a", from: "Raccogli tutti i frammenti di luce nella Grotta di Terra" });
    X.cos("cr_argento", { kind: "hairc", label: "Capelli d'Argento", val: "#d9d4e8", from: "Un forziere nella Grotta di Terra" });
    X.cos("cr_fabbro", { kind: "shirt", label: "Grembiule del Fabbro", val: "#6a4a2a", from: "Un forziere a Borgo Radice" });

    // ---------------------------------------------------------------- frammenti di storia (il Diario)
    X.lore("l_cristalli", { t: "I quattro Cristalli", d: "Terra, Vento, Fuoco, Acqua. Tengono in volo i continenti di Calcistea. Si nutrono di una cosa sola: le partite giocate nei loro santuari." });
    X.lore("l_prima", { t: "La prima partita", d: "La leggenda: quattro ragazzi giocavano su uno scoglio. Giocavano così bene che lo scoglio si staccò dal mare e salì in cielo, per vedere meglio." });
    X.lore("l_canto", { t: "Il canto delle lucciole", d: "Una filastrocca incisa su un albero: «Quattro accesi a guardia del cielo / e il quinto gioca con noi sul prato». Nessuno sa chi sia il quinto." });
    X.lore("l_moneta", { t: "Una moneta con il re", d: "Una moneta d'oro con il profilo di Re Aldeberto. È datata ottant'anni fa. Il re, sulla moneta, ha la stessa faccia di oggi." });

    const goal = (s) => ({
      0: "Parla con Nonna Ortensia, davanti al Municipio (in alto, al centro del borgo).",
      1: "Vai alla fucina di Bram (in alto a destra) e chiedigli la lanterna di cristallo.",
      2: "Qualcosa è caduto dal cielo al Belvedere, sul bordo ovest dell'isola. Corri a vedere.",
      3: "Vai a est, nel Bosco delle Lucciole (sentiero a destra del borgo).",
      4: "Prosegui a est fino alla Grotta di Terra e raggiungi il Grande Cristallo, in fondo.",
      5: "Torna a Borgo Radice. Qualcosa brucia sopra il campo.",
      6: "Al campo del borgo: parla con la Capitana Vela, accanto alla sua aeronave.",
    }[s] || "Capitolo concluso. Il prossimo ti aspetta dal menu.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 11, "rgba(10,20,64,.85)"); R(g, x - w / 2, y + 2, w, 1, "#c9a227"); g.fillStyle = "#ffe9b0"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; }
    function drill(g, x, y, fr, broken) { // la trivella di Ferrogrigio: succhia luce dalla terra
      R(g, x - 2, y + 10, 20, 6, "rgba(0,0,0,.3)"); R(g, x, y - 14, 16, 26, "#4a4a52"); R(g, x, y - 14, 16, 2, "#8a8a9a"); R(g, x + 2, y - 10, 12, 8, "#2a2a33");
      if (!broken) { const lv = (fr / 4) % 8; R(g, x + 3, y - 3 - lv, 10, lv, "#ffb347"); g.save(); g.globalCompositeOperation = "lighter"; X.glow(g, x + 8, y - 6, 14, "255,180,70", 0.4); g.restore(); }
      else { R(g, x + 3, y - 9, 10, 1, "#ff5a5a"); if ((fr / 10 | 0) % 2) R(g, x + 6, y - 20 - (fr % 20) / 2, 3, 3, "rgba(160,160,160,.6)"); }
      R(g, x + 6, y + 12, 4, 6, "#8a8a9a"); g.fillStyle = "#c0392b"; g.font = "bold 5px sans-serif"; g.fillText("FG", x + 4, y + 9);
    }
    const zones = {
      cr_borgo: {
        region: "borgo", name: "Cristalli del Campo · Borgo Radice", short: "Borgo Radice", sub: "Un villaggio su un'isola sospesa", bg: "cr_borgo", dock: true,
        w: 36, h: 26, start: [7, 9], itemCos: "cr_tramonto", items: [[3, 14], [33, 4], [27, 23], [16, 7]], pitch: [10, 17, 14, 6],
        areas: [[0, 0, 5, 25, "Il Belvedere"], [24, 1, 34, 9, "La fucina di Bram"], [10, 16, 24, 24, "Il campo del borgo"], [6, 1, 23, 15, "Borgo Radice"]],
        chests: { "31,13": { coins: 30, cos: "cr_fabbro", text: "Dentro, ripiegato con cura, un grembiule di cuoio con le iniziali di Bram. C'è un biglietto: «Per chi un giorno mi aiuterà. Non sarà nessuno»." }, "8,22": { coins: 20, lore: "l_moneta", text: "Sotto una manciata di monete, una moneta d'oro diversa dalle altre." } },
        act: { n: "Leggi il cartello", t: "Guarda l'albero", z: "Guarda le botti", b: "Siediti sulla panca", l: "Guarda la lanterna", u: "La bancarella di Trillo", k: "Guarda l'incudine", m: "La Lampada del Campo", f: "Appoggiati alla staccionata", g: "Guarda la porta", e: "Affacciati sul vuoto", q: "Bussa alla porta", ">": "Al Bosco delle Lucciole" },
        flavor: {
          n: ["Cartello: «BORGO RADICE · 312 abitanti, 1 campo, 0 sconfitte in casa (quasi)».", "Cartello: «Vietato tirare il pallone oltre il bordo dell'isola. Il pallone non torna. Il signor Gualtiero nemmeno»."],
          t: ["Un melo. Le mele, qui in alto, maturano prima: sono più vicine al sole.", "Sulla corteccia qualcuno ha inciso un pallone e due iniziali in un cuore. Una è una B."],
          z: "Botti di sidro di mele del cielo. Sull'ultima, col gesso: «NON PER BRAM».",
          b: "Ti siedi. Da qui si vedono le altre isole galleggiare nel tramonto, come pagnotte in un forno arancione.",
          l: "Una lanterna con dentro un frammento di cristallo. Di solito brilla tutta la notte. Stasera trema, come una candela al vento.",
          u: "La bancarella di Trillo: mele, cordini, palloni di vescica, una cartolina con scritto «Saluti dal cielo». È chiusa: Trillo è lì accanto.",
          k: "L'incudine di Bram, ancora tiepida. Ci sono incise tante piccole tacche: una per ogni cosa riparata. Hai smesso di contarle a cento.",
          m: "La Lampada del Campo: un grappolo di cristalli che illumina le partite della sera. È quasi spenta. Senza luce, niente Partita del Cristallo.",
          f: "Ti appoggi alla staccionata del campo. Il legno è caldo di sole. Oltre, l'erba più verde dell'isola.",
          g: "Una porta di legno, le reti rammendate con lo spago da pesca. Quante volte ci hai segnato? Abbastanza da avere un posto preferito: l'incrocio basso a sinistra.",
          e: ["Ti affacci. Sotto l'isola, solo nuvole, e sotto le nuvole altro cielo. Ti gira un po' la testa, ma è un bel giramento.", "Laggiù, lontanissimo, un'altra isola. E un puntino che vola: un'aeronave?"],
          q: "Bussi. Da dentro: «Chi è? Se è per il sidro, non ce n'è»."
        },
        intro: [["voce", "Borgo Radice, isola di Calcistea, al tramonto. Il cielo è arancione, il prato è verde, e le altre isole galleggiano all'orizzonte come pensieri lenti."], ["voce", "Stasera si dovrebbe giocare la Partita del Cristallo. Ma la Lampada del Campo è quasi spenta, e in piazza nessuno sorride."]],
        npcs: (s) => [
          { id: "cr_ortensia", at: [17, 8] }, { id: "cr_trillo", at: [21, 12] },
          ...(s <= 5 ? [{ id: "cr_bram", at: [27, 8] }] : []),
          ...(s === 2 ? [{ id: "cr_aira", at: [3, 11] }] : s >= 3 && s <= 5 ? [{ id: "cr_aira", at: [8, 12] }] : []),
          ...(s >= 6 ? [{ id: "cr_vela", at: [19, 21] }, { id: "cr_kael", at: [12, 18] }, { id: "cr_bram", at: [16, 21] }, { id: "cr_aira", at: [14, 21] }] : []),
        ],
        build(L) {
          const { lay, put, house, ship } = L;
          // il bordo dell'isola: vuoto a ovest e a sud, alberi a nord
          lay(0, 0, 1, 25, "e"); lay(0, 25, 35, 25, "e"); lay(2, 0, 35, 0, "t"); [3, 6, 9, 12, 20, 23, 30, 33].forEach((x) => put(x, 1, "t")); lay(35, 0, 35, 24, "t"); put(35, 12, ">"); put(35, 13, ">");
          lay(2, 2, 2, 24, ","); [5, 9, 13, 19, 23].forEach((y) => put(2, y, "f"));
          // sentieri
          lay(3, 10, 34, 10, ":"); lay(3, 11, 3, 11, ":"); lay(18, 3, 18, 16, ":"); lay(28, 10, 28, 12, ":"); lay(28, 12, 34, 13, ":"); lay(7, 6, 7, 9, ":");
          // case: la tua, il Municipio, la fucina di Bram
          house(4, 2, 6, 4, { door: [7, 5], roof: "#3f6a9a", wall: "#efe2c8", timber: "#8a5a3a", chimney: true });
          house(13, 2, 9, 5, { door: [17, 6], roof: "#b8452a", wall: "#e8d6b0", rr: 2, chimney: true });
          house(25, 2, 7, 5, { door: [27, 6], roof: "#5a5a62", wall: "#c9b48a", timber: "#5a3a20", chimney: true });
          put(29, 8, "k"); put(31, 8, "z"); put(32, 8, "z"); put(31, 13, "x"); put(33, 7, "z");
          // piazza: bancarella e cristallo azzurro di Trillo, lanterne, panche
          put(20, 12, "u"); put(22, 12, "s"); put(16, 12, "m"); [[10, 9], [25, 9], [13, 14], [24, 14], [3, 9]].forEach(([x, y]) => put(x, y, "l")); put(14, 12, "b"); put(9, 12, "n");
          [[11, 6], [23, 6], [33, 16], [30, 21], [5, 20], [6, 15], [34, 22]].forEach(([x, y]) => put(x, y, "t")); put(9, 22, "r");
          // il campo del borgo, con le porte e una staccionata
          lay(10, 17, 23, 22, "-"); put(10, 19, "g"); put(10, 20, "g"); put(23, 19, "g"); put(23, 20, "g");
          lay(9, 16, 24, 16, "f"); put(16, 16, ":"); put(17, 16, ":"); lay(9, 23, 24, 23, "f"); lay(9, 17, 9, 22, "f"); lay(24, 17, 24, 22, "f"); put(8, 22, "x");
          if (F.is("ship_crash")) { ship(18, 18); }
        },
        decor(g, cx, cy, d) { plaque(g, "MUNICIPIO", d.X(17) + 8, d.Y(2) + 4); plaque(g, "FUCINA", d.X(28), d.Y(2) + 4); plaque(g, "BOSCO →", d.X(33), d.Y(11) + 4); plaque(g, "BELVEDERE", d.X(2) + 8, d.Y(8)); if (F.is("ship_crash")) { const f = d.fr; for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(80,80,80,${0.4 - i * 0.08})`; g.beginPath(); g.arc(d.X(20) + Math.sin(f / 20 + i) * 3, d.Y(18) - 6 - i * 7 - (f / 5 % 7), 3 + i * 1.5, 0, 7); g.fill(); } } },
      },
      cr_bosco: {
        region: "bosco", name: "Cristalli del Campo · Bosco delle Lucciole", short: "Bosco delle Lucciole", sub: "Alberi antichi e lucciole", bg: "cr_bosco",
        w: 34, h: 22, start: [1, 10], itemCos: "cr_lucciola", items: [[4, 3], [30, 18], [16, 19], [26, 3]],
        areas: [[12, 5, 22, 13, "La radura della trivella"], [0, 0, 33, 21, "Bosco delle Lucciole"]],
        chests: { "6,17": { coins: 25, lore: "l_canto", text: "Il forziere è incastrato tra le radici di un albero inciso." }, "29,4": { coins: 35, text: "Monete vecchie, con un cristallo sul retro al posto del re." } },
        act: { t: "Guarda l'albero", r: "Guarda il masso", m: "Guarda i cristalli", n: "Leggi il cartello", "16,8": "Esamina la trivella", "<": "Torna a Borgo Radice", ">": "Alla Grotta di Terra", w: "Guarda lo stagno", l: "Guarda la lanterna" },
        flavor: {
          t: ["Un albero così vecchio che le radici escono dall'isola e pendono nel vuoto come capelli.", "Sul tronco, lucciole ferme in fila, come se aspettassero il loro turno."],
          r: "Un masso coperto di muschio. Ha la forma di un pallone che qualcuno ha dimenticato qui mille anni fa.",
          m: "Piccoli cristalli d'ambra spuntano dalla terra. Sono tiepidi, come sassi al sole. Ma non c'è sole, qui sotto.",
          n: "Cartello: «GROTTA DI TERRA → · Non svegliate i Golem · Non giocateci contro · Soprattutto non perdete».",
          w: "Uno stagno nero e liscio. Le lucciole ci si specchiano e sembrano il doppio.",
          l: "Una lanterna di pietra, vecchissima. Ci soffi sopra e si accende per un attimo, verde.",
        },
        intro: [["voce", "Il Bosco delle Lucciole. Il tramonto arriva qui solo a fette, tra le foglie. Il resto lo fanno le lucciole, migliaia, che si accendono e si spengono come se respirassero."], ["voce", "E poi, sotto quel respiro, un rumore che non c'entra niente: un ronzio di ferro. Viene dalla radura."]],
        npcs: (s) => [...(s === 3 && !F.is("c1_pim_done") ? [{ id: "cr_pim", at: [18, 9] }] : []), ...(s >= 3 && s <= 4 ? [{ id: "cr_aira", at: [3, 11] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 1, "t"); lay(0, 20, 33, 21, "t"); lay(0, 0, 0, 21, "t"); lay(33, 0, 33, 21, "t");
          for (let y = 2; y < 20; y++) for (let x = 1; x < 33; x++) if (X.rnd(x, y, 21) < 0.16) put(x, y, "t");
          // il sentiero, la radura, i sentierini laterali (liberi da alberi)
          const clear = (x0, y0, x1, y1, ch) => lay(x0, y0, x1, y1, ch || ",");
          clear(1, 9, 32, 11, ":"); clear(12, 5, 22, 13); clear(3, 2, 6, 9); clear(24, 2, 31, 8); clear(5, 12, 8, 18); clear(14, 12, 18, 19); clear(26, 12, 31, 19); clear(9, 10, 11, 10, ":");
          put(0, 10, "<"); put(33, 10, ">"); put(16, 8, "r"); [[13, 6], [21, 6], [14, 12]].forEach(([x, y]) => put(x, y, "z")); put(20, 12, "z");
          [[3, 6], [28, 14], [8, 13], [24, 6]].forEach(([x, y]) => put(x, y, "m")); lay(27, 16, 29, 17, "w"); put(6, 17, "x"); put(29, 4, "x"); put(2, 8, "n"); [[11, 8], [22, 12], [31, 8]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) { drill(g, d.X(16), d.Y(8), d.fr, F.is("c1_drill_broken")); },
      },
      cr_grotta: {
        region: "grotta", name: "Cristalli del Campo · Grotta di Terra", short: "La Grotta di Terra", sub: "Il santuario del primo Cristallo", bg: "cr_grotta", crystal: "#e8a040", cluster: "#e8a040",
        dim: (s) => s < 5,
        w: 30, h: 24, start: [1, 18], itemCos: "cr_ambra", items: [[3, 3], [27, 3], [26, 20], [9, 13]], pitch: [9, 9, 12, 7],
        areas: [[9, 1, 20, 8, "Il Grande Cristallo"], [9, 9, 20, 16, "Il campo dei Golem"], [0, 0, 29, 23, "La Grotta di Terra"]],
        chests: { "4,9": { coins: 30, cos: "cr_argento", text: "Dentro, un nastro d'argento, uguale ai capelli di Aira. Lei lo guarda e non dice niente." }, "25,8": { coins: 40, lore: "l_prima", text: "Su una lastra di pietra dentro il forziere, un disegno inciso: quattro ragazzi e uno scoglio che vola." } },
        act: { c: "Tocca il Grande Cristallo", o: "Guarda il golem di pietra", m: "Guarda i cristalli d'ambra", r: "Guarda la roccia", w: "Guarda l'acqua", g: "Guarda la porta di pietra", "<": "Torna al Bosco" },
        flavor: {
          o: ["Un golem di pietra, seduto, con le braccia sulle ginocchia. Dorme. Russa? No: è la grotta che respira.", "Sul petto del golem, un numero inciso: 1. Come un portiere."],
          m: "Cristalli d'ambra alti come te. Riflettono la tua faccia cento volte, tutte un po' più preoccupate.",
          r: "Una stalagmite. Gocciola. Ogni goccia fa un suono diverso, come una scala musicale lentissima.",
          w: "Un lago sotterraneo, fermo, color tè. Sul fondo brillano palloni di pietra: offerte degli antichi giocatori.",
          g: "Una porta di pietra scolpita in un solo blocco. Le reti sono radici intrecciate.",
        },
        intro: [["voce", "La Grotta di Terra. Il buio qui è caldo, color miele. Dalle pareti spuntano cristalli d'ambra, e in fondo, lontano, qualcosa di grande pulsa piano. Come un cuore stanco."], ["cr_aira", "(sottovoce) Lo senti? Il Cristallo. Si sta spegnendo. Mi fanno male le mani, {n}. Non so perché."]],
        npcs: (s) => (s >= 4 && s <= 4 ? [{ id: "cr_aira", at: [14, 17] }] : s === 5 ? [{ id: "cr_aira", at: [16, 7] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 23, 29, 23, "a"); lay(0, 0, 0, 23, "a"); lay(29, 0, 29, 23, "a"); put(0, 18, "<");
          // pareti frastagliate
          [[1, 1, 2, 6], [27, 1, 28, 2], [1, 21, 7, 22], [22, 21, 28, 22], [6, 1, 7, 4], [22, 1, 23, 4]].forEach(([a, b, c, d]) => lay(a, b, c, d, "a"));
          // il santuario: pavimento di pietra, il Grande Cristallo, i golem in fila
          lay(9, 1, 20, 8, "+"); put(14, 3, "c"); lay(13, 4, 16, 4, "+");
          [[10, 2], [19, 2], [10, 6], [19, 6]].forEach(([x, y]) => put(x, y, "o"));
          lay(9, 9, 20, 15, "-"); put(9, 11, "g"); put(9, 12, "g"); put(20, 11, "g"); put(20, 12, "g"); lay(14, 8, 15, 8, ":"); lay(14, 16, 15, 20, ":"); lay(1, 18, 14, 18, ":");
          [[3, 7], [26, 6], [7, 15], [23, 15], [12, 20], [18, 19], [5, 4], [24, 4]].forEach(([x, y]) => put(x, y, "m")); [[4, 13], [25, 13], [21, 18], [8, 19]].forEach(([x, y]) => put(x, y, "r"));
          lay(22, 16, 27, 19, "w"); lay(23, 17, 26, 18, "w"); put(4, 9, "x"); put(25, 8, "x");
        },
        decor(g, cx, cy, d) { if (S() < 5) plaque(g, "IL CRISTALLO DELLA TERRA", d.X(14) + 8, d.Y(0) + 8); },
      },
    };

    // ---------------------------------------------------------------- dialoghi
    const talk = {
      cr_ortensia() {
        const s = S();
        if (s === 0) return say([
          ["cr_ortensia", "Eccoti, {n}. Guarda la Lampada del Campo. Guarda le lanterne. Tremano tutte. È il Cristallo della Terra: si sta spegnendo."],
          ["cr_ortensia", "Sessant'anni che arbitro la Partita del Cristallo, e non era mai successo. Se il Cristallo si spegne, l'isola… be'. Le isole non galleggiano per gentilezza."],
          ["cr_ortensia", "Qualcuno deve scendere alla Grotta di Terra, oltre il Bosco delle Lucciole, e vedere cosa succede. E quel qualcuno sei tu: sei il nostro numero {num}, il migliore che abbiamo."],
          ["cr_ortensia", "Prima passa da Bram, alla fucina: ha una lanterna di cristallo che vede al buio. Se te la dà senza brontolare, è un miracolo. Il secondo della giornata."],
        ], () => { setStep(N, 1); done(); });
        if (s === 1) return say([["cr_ortensia", "Bram è alla fucina, in alto a destra. Se brontola, lascialo brontolare: è il suo modo di dire sì."]]);
        if (s === 2) return say([["cr_ortensia", "Hai visto anche tu quella scia di luce cadere al Belvedere? Vai, vai! Io sono vecchia, ma non abbastanza per non essere curiosa."]]);
        if (s >= 6) return say([["cr_ortensia", "Un'aeronave nel mio campo. Sessant'anni di partite e nessuno aveva mai parcheggiato sul dischetto."]]);
        return say([["cr_ortensia", pick2(["Il Bosco è a est. Le lucciole ti faranno strada. Fidati di loro più che delle mappe.", "Torna con la luce, {n}. E torna anche tu, eh. Tutte e due le cose."])]]);
      },
      cr_trillo() {
        const s = S();
        if (!F.is("c1_trillo")) { F.set("c1_trillo", true); return say([
          ["cr_trillo", "Frrr! {n}! Trillo è preoccupato, sì sì. Il cristallo azzurro della bancarella trema. Trillo l'ha lucidato tre volte. Non è sporco: è triste."],
          ["cr_trillo", "Quando vuoi riposare, tocca il cristallo azzurro. Trillo ci ha messo dentro un pezzetto di cielo: ti ricorda dove eri arrivato, frrr. E ti fa cambiare mestiere, quando i Cristalli te ne insegneranno."],
        ]); }
        if (s >= 6) return say([["cr_trillo", "Un'aeronave! Trillo vuole salire! Trillo ha le ali, sì, ma piccole. Le ali grandi sono più comode, frrr."]]);
        if (s === 5) return say([["cr_trillo", "Frrr… hai sentito? Un boato, sopra il campo. E fumo! Trillo si è nascosto dietro le mele."]]);
        return say([["cr_trillo", pick2(["Trillo vende mele del cielo. Gratis per gli eroi. Gli eroi però devono dirlo, che sono eroi. Frrr.", "Nel Bosco ci sono forzieri. Trillo lo sa perché ce li ha messi Trillo. No, non è vero. Forse.", "La tua amica coi capelli d'argento ha guardato il cristallo azzurro come si guarda un fratellino. Strano, frrr."])]]);
      },
      cr_bram() {
        const s = S();
        if (s === 1) return ask("cr_bram", "Lanterna? La mia lanterna di cristallo? Per andare alla Grotta di Terra? Dove dormono i Golem? Da solo? Con quella faccia da numero {num}?\n…Hmpf. E io dovrei pure venire con te, immagino.", [
          { label: "«Non ti chiedo di venire. Solo la lanterna.»", sub: "Rispetti il suo no", cls: "hot", fn: () => { F.set("c1_bram_ok", true); bond("luce", 1); say([["cr_bram", "…Ecco. Prendila. E riportamela intera. Io resto qui: qualcuno deve riparare il borgo quando tornerai a pezzi."], ["voce", "Bram ti mette in mano la lanterna. È più leggera di quanto pensassi. Lui guarda altrove, ma le orecchie gli diventano rosse."]], after); } },
          { label: "«Il borgo ha bisogno di tutti, anche di te.»", sub: "Insisti", fn: () => { F.set("c1_bram_insist", true); say([["cr_bram", "Il borgo ha bisogno di uno che aggiusti le pentole. Tieni la lanterna e vai. Io… ci penso. Forse. No."]], after); } },
          { label: "«Ti pago. Dimmi il prezzo.»", sub: "Una ricompensa", fn: () => { bond("corona", 1); F.set("c1_bram_soldi", true); say([["cr_bram", "Pagare? Me? Per una lanterna che serve a salvare l'isola dove abito? …Ragazzo, tieni i tuoi soldi. E la lanterna. E anche un consiglio: non tutto ha un prezzo, e quello che ce l'ha di solito non vale."]], after); } },
        ]);
        if (s === 2) return say([["cr_bram", "Hai visto quella stella cadente? Al Belvedere. Le stelle non cadono così basse. Va' a vedere, io tengo d'occhio il fuoco."]]);
        if (s >= 3 && s <= 4) return say([["cr_bram", F.is("c1_bram_ok") ? "Stai attento ai Golem. Sono lenti, ma quando ti prendono il pallone non te lo ridanno più. Come mia sorella." : "Ancora qui? La grotta è a est. Vai, prima che cambi idea e venga con te. Scherzo. Forse."]]);
        if (s === 5) return say([["cr_bram", "Hai sentito il boato? Qualcosa è caduto nel campo. Di nuovo dal cielo. Oggi piove gente."]]);
        return say([["cr_bram", "Hmpf."]]);
      },
      cr_aira() {
        const s = S();
        if (s === 2) return ask("cr_aira", "…dove…? C'era il cielo, e poi c'era meno cielo, e poi c'era l'erba. Ciao. Scusa. Mi chiamo Aira. Credo. Non ricordo niente, tranne il mio nome e una cosa: «il Cristallo della Terra si spegne, e lo stanno facendo apposta».", [
          { label: "Le tendi la mano", sub: "«Ti aiuto ad alzarti. Il resto dopo.»", cls: "hot", fn: () => { bond("trust", 1); after2("Grazie. Hai la mano calda. Come… come un Cristallo. Che cosa strana da dire, scusa."); } },
          { label: "«Chi sei? Da dove cadi?»", sub: "Prima le domande", fn: () => { after2("Vorrei saperlo anch'io. Ricordo… una sala bianca, e un vecchio con una corona che sorride. Poi più niente. Ti basta? A me no."); } },
        ]);
        if (s === 3) return say([["cr_aira", "Vengo con te. Non so giocare a molto, ma so dove andrà il pallone un secondo prima che ci vada. È utile? Credo di sì."]]);
        if (s === 4) return say([["cr_aira", "Il Cristallo è in fondo, oltre il campo di pietra. Lo sento chiamare. Non te, {n}: me. Perché me?"]]);
        if (s === 5) return glowScene();
        return say([["cr_aira", "Restiamo vicini, va bene?"]]);
      },
      cr_pim() {
        return ask("cr_pim", "Alt! Chi va là? …Oh. Siete in due. E io sono uno. E questa lancia è di legno dipinto. Ehm. Recluta Pim, Impero di Ferrogrigio, di guardia alla trivella numero quattro. Prego, non fatemi niente.", [
          { label: "⚙ Sabota la trivella", sub: "Basta luce rubata alla terra", cls: "hot", fn: () => { F.set("c1_drill_broken", true); F.set("c1_pim_done", true); bond("luce", 1); X.reward("c1_drill", { coins: 15 }); say([["voce", "Infili una pietra negli ingranaggi. La trivella tossisce, sputa una nuvola grigia e si ferma. Dal tubo esce un sospiro di luce d'ambra che torna nella terra."], ["cr_pim", "Ecco. Adesso il Generale mi manda a pulire le latrine della corazzata. Sono tre. Sono enormi. Grazie tante."], ["cr_aira", "La terra… respira. L'hai sentita anche tu?"]], after3); } },
          { label: "💎 Prendi il cristallo-batteria", sub: "Potrebbe servire. A te.", fn: () => { F.set("c1_battery", true); F.set("c1_pim_done", true); F.set("c1_drill_broken", true); bond("corona", 2); say([["voce", "Sviti il serbatoio della trivella: dentro, un cristallo d'ambra pieno di luce rubata, pesante e caldo. La trivella si spegne. Il cristallo, nella tua tasca, ronza."], ["cr_pim", "Ehi! Quello è dell'Impero! …Cioè, era della terra. Cioè. Non lo so più."], ["cr_aira", "(ti guarda la tasca, poi te) Lo restituirai al Cristallo, vero? Vero?"]], after3); } },
          { label: "Parla con lui", sub: "«Cosa fai qui, davvero?»", fn: () => { F.set("c1_pim_talk", true); F.set("c1_pim_done", true); bond("ferro", 1); say([["cr_pim", "Davvero? Mi hanno detto di sorvegliarla e basta. Il Generale Kael dice che la luce serve per le corazzate. Le corazzate servono a… non lo so. Io volevo fare il cuoco."], ["cr_pim", "Sapete una cosa? Il Generale non è cattivo. È stanco. Lo sento parlare da solo, la notte. Dice sempre: «Chiedete al re dove va la luce». Il re. Il vostro re."], ["voce", "Pim si toglie l'elmo, troppo grande, e lo appoggia sul masso. «Torno a casa. Se mi cercano, dite che sono caduto dall'isola. Succede, no?»"]], after3); } },
        ]);
      },
      cr_vela() { return S() >= 7 ? say([["cr_vela", X.hasChapter(2) ? "Quando volete si parte. Salite sulla Rondine Grigia e scegliete la rotta." : "Bram ci sta lavorando. Domani si vola: il prossimo capitolo è in arrivo."]]) : endScene(); },
      cr_kael() { return say([["cr_kael", "Parla con la tua capitana, Guerriero. Io aspetto. Sono bravo ad aspettare."]]); },
    };
    function pick2(a) { return a[Math.floor(Math.random() * a.length)]; }
    function after() { setStep(N, 2); X.api.trToast("Hai la lanterna di cristallo"); say([["voce", "Proprio in quel momento, una scia di luce attraversa il cielo e cade dietro le case, a ovest. Verso il Belvedere, sul bordo dell'isola."]]); }
    function after2(line) { join("aira"); setStep(N, 3); note("Aira è caduta dal cielo al Belvedere."); say([["cr_aira", line], ["cr_aira", "Stai andando alla Grotta di Terra, vero? Vengo con te. Non chiedermi perché: le mie gambe lo sanno già."], ["voce", "<b>Aira si unisce al gruppo.</b> Il Bosco delle Lucciole è a est del borgo."]]); }
    function after3() { done(); }
    function glowScene() {
      return ask("cr_aira", "(Aira è in piedi davanti al Cristallo riacceso. Le sue mani brillano della stessa luce. Poi la luce si spegne, e lei ti guarda come si guarda chi ha visto troppo.)\nHai visto, vero?", [
        { label: "«Non devi dirmelo adesso.»", sub: "Le dai tempo", cls: "hot", fn: () => { bond("trust", 2); F.set("c1_glow", "tempo"); fin("Grazie. Te lo dirò quando lo saprò anch'io. Promesso. Una promessa da regista: arriva sempre, anche se in ritardo."); } },
        { label: "«Cosa sei, Aira?»", sub: "Pretendi la verità", fn: () => { bond("trust", -1); F.set("c1_glow", "verita"); fin("Non lo so! Non lo so… Scusa. Non volevo urlare. È che anch'io vorrei saperlo, e nessuno risponde. Nemmeno io."); } },
        { label: "Fai finta di niente", sub: "Meglio non metterla in imbarazzo", fn: () => { F.set("c1_glow", "niente"); fin("…Già. Non è successo niente. Andiamo."); } },
      ]);
      function fin(line) {
        learnLore("l_cristalli", true);
        say([["cr_aira", line], ["voce", "Un boato, lontano, sopra le vostre teste. Poi un altro. La grotta trema, e da una crepa nella volta vedi il cielo: rosso. Qualcosa brucia sopra Borgo Radice."], ["cr_aira", "Il borgo! Corri, {n}!"]], () => {
          F.set("ship_crash", true); setStep(N, 6); go("cr_borgo", 17, 15);
          say([["voce", "Nel campo del borgo, proprio sul dischetto, un'aeronave fuma come una pentola dimenticata. Sopra, ferma nel cielo rosso, una corazzata di ferro con lo stemma di Ferrogrigio."], ["cr_aira", "La pilota è viva! E quell'uomo col cappotto di ferro… sta scendendo."]]);
        });
      }
    }
    function endScene() {
      return ask("cr_vela", "Capitana Vela Ruggine, aeronave «Rondine Grigia», al vostro… ahia… servizio. Scusate per il campo. E per il dischetto. E per quelli lì dietro: ce li ho portati io. Mi inseguivano.\n(Dietro di lei il Generale Kael Ferrogrigio scende dalla scaletta di una corazzata, senza fretta.)", [
        { label: "Affronti Kael", sub: "«Vattene dalla nostra isola.»", cls: "hot", fn: () => { bond("luce", 1); F.set("c1_kael", "sfida"); kael("Coraggioso. Il Cristallo ha scelto bene, o è disperato. Lo scopriremo. Ce ne andiamo: per oggi. La luce che ci serve la troveremo altrove."); } },
        { label: "Ascolti Kael", sub: "«Perché rubate la luce?»", fn: () => { bond("ferro", 1); F.set("c1_kael", "ascolta"); learnLore("l_moneta", true); kael("Rubare. Che parola. Chiedi al tuo re dove va la luce dei Cristalli, Guerriero. Chiedigli perché ogni anno ne serve di più. Poi vieni a dirmi chi è il ladro."); } },
        { label: "Proponi un patto", sub: "«Lasciate stare il borgo e parliamo.»", fn: () => { bond("corona", 1); F.set("c1_kael", "patto"); kael("Un patto. Parli già come un re. Non so se è un complimento. Va bene: il borgo per oggi è salvo. Il resto lo tratteremo un'altra volta. In alto."); } },
      ]);
      function kael(line) {
        say([["cr_kael", line], ["voce", "Kael sale sulla corazzata. La nave di ferro si alza, oscura il tramonto per un lungo istante, e sparisce tra le nuvole."],
          ["cr_bram", F.is("c1_bram_ok") ? "Ho riparato peggio. Datemi una notte e quel catorcio vola. E poi… vengo con voi. Non per voi. Per la lanterna: me la dovete riportare." : F.is("c1_bram_soldi") ? "Ti avevo detto che non tutto ha un prezzo. Questo sì: vengo con voi. Gratis. Così impari." : "Va bene, va bene! Vengo. Qualcuno deve riparare voi, oltre al catorcio."],
          ["cr_vela", "Un fabbro, una ragazza che brilla e il Guerriero della Luce. Che equipaggio. La Rondine Grigia ha visto di peggio. Salite: si va dove ci sono i Cristalli. Il prossimo è nella Città Sospesa."],
          ["cr_aira", "{n}… grazie per oggi. Davvero."]],
          () => {
            join("bram"); join("vela"); F.set("ship", true); finishChapter(N, F.get("c1_kael", "ok")); setStep(N, 7);
            const msg = X.reward("cr_c1_fine", { coins: 60, cos: "cr_c1" });
            X.scene([["voce", `<b>Capitolo 1 concluso · Il Guerriero della Luce</b><br>Bram e la Capitana Vela si uniscono al gruppo. L'aeronave è tua (più o meno).${msg.length ? "<br>" + msg.join(" · ") : ""}`]], done, "cr_cielo");
          });
      }
    }

    // ---------------------------------------------------------------- oggetti e uscite
    const obj = {
      "cr_borgo:>": () => (S() >= 3 ? go("cr_bosco", 1, 10) : say([["voce", S() < 2 ? "Il Bosco delle Lucciole. Prima, però, ti serve la lanterna di Bram: nel bosco di sera ci si perde, e nella grotta di sera ci si perde peggio." : "Al Belvedere, a ovest, è caduto qualcosa dal cielo. Prima quello."]])),
      "cr_borgo:i": () => (S() === 6 ? endScene() : F.is("ship") && X.hasChapter(2) ? X.fly("cr_borgo") : say([["voce", F.is("ship") ? "La Rondine Grigia è in riparazione: Bram ci lavora con la lanterna in bocca. Il prossimo capitolo è in arrivo." : "La Rondine Grigia fuma ancora."]])),
      "cr_borgo:m": () => say([["voce", S() >= 5 ? "La Lampada del Campo è tornata a brillare. Un po'. Abbastanza per vedere il pallone. Abbastanza per sperare." : "La Lampada del Campo trema, quasi spenta. Senza luce, stasera niente Partita del Cristallo."]]),
      "cr_bosco:<": () => go("cr_borgo", 34, 12),
      "cr_bosco:>": () => (F.is("c1_pim_done") ? (S() < 4 && setStep(N, 4), go("cr_grotta", 1, 18)) : say([["cr_aira", "Aspetta. La trivella, nella radura. Quel ronzio… Non possiamo passarci accanto e basta."]])),
      "cr_bosco:r:16,8": () => (F.is("c1_pim_done") ? say([["voce", F.is("c1_drill_broken") ? "La trivella è ferma. Dal tubo, ogni tanto, esce un filo di fumo grigio che sa di scuse." : "La trivella è ferma: senza la sua guardia, nessuno la sorveglia. La tocchi e ti scotta le dita."]]) : say([["voce", "Una trivella di ferro, piantata nella terra. Dal tubo sale luce d'ambra, la succhia, la porta via. C'è una guardia: parlale prima."]])),
      "cr_grotta:<": () => go("cr_bosco", 32, 10),
      "cr_grotta:c": () => crystal(),
    };
    function crystal() {
      const s = S();
      if (s < 4) return say([["voce", "Il Cristallo della Terra."]]);
      if (s >= 5) return say([["voce", "Il Cristallo della Terra brilla di nuovo, color miele. Non forte come una volta. Ma brilla. Dentro, se guardi bene, vedi una partita: quattro ragazzi e uno scoglio."]]);
      return X.api.play(X.lines([
        ["voce", "Allunghi la mano. Il Cristallo è freddo, quasi spento. Poi la tua mano si scalda, e lui si scalda, e dentro di te si accende qualcosa che non ha nome. O forse ne ha quattro."],
        ["voce", "Una voce senza voce: «Guerriero della Luce. Ti do quello che posso. Il Bomber che rompe le difese. Il Regista che vede il gioco. Il Muro che non cede. Usali per me»."],
        ["voce", "<b>Hai imparato tre mestieri: Bomber, Regista, Muro.</b> Contano solo nelle Battaglie ATB. Puoi cambiarli dal menu o al cristallo azzurro."],
        ["voce", "Poi la grotta trema. I golem di pietra aprono gli occhi, color ambra. Si alzano. Uno, il più grande, raccoglie da terra un pallone di roccia."],
        ["cr_aira", "Non sono cattivi! Sono i guardiani: credono che siamo noi a rubare la luce. Dobbiamo battere il loro portiere. È così che si parla ai Golem: giocando."],
      ], "cr_grotta"), () => {
        ["bomber", "regista", "muro"].forEach(unlockJob); X.SFX.crystal();
        ask("voce", "La Battaglia ATB contro i Golem sta per cominciare. Vuoi sistemare i mestieri prima?", [
          { label: "⚔ Gioca la Battaglia ATB", sub: "Primo a 3 gol · i Golem della Grotta", cls: "hot", fn: fight },
          { label: "✦ Mestieri e formazione", sub: "Chi fa il Bomber, chi il Regista, chi il Muro", fn: () => X.jobsMenu(fight) },
        ], "cr_grotta");
      });
    }
    function fight() {
      X.battle({ title: "I Golem della Grotta di Terra", bg: "terra", us: "Guerrieri della Luce", oppName: "Golem", bg2: "cr_grotta", extraName: "Trillo",
        foes: [{ name: "Golem di Selce" }, { name: "Golem d'Ardesia" }, { name: "Golem di Tufo" }], keeper: { name: "Golemone", guard: 110 }, foeCol: "#7a6a5a", boss: true, target: 3, minutes: 2,
        intro: "Il Golemone batte i pugni sul petto. La grotta rimbomba.",
        done: (r) => {
          if (!r.win) return ask("cr_aira", "I Golem si fermano, ci guardano. Ci stanno dando un'altra possibilità. I portieri di pietra sono pazienti.", [
            { label: "⚔ Riprova la Battaglia", cls: "hot", fn: fight },
            { label: "✦ Cambia i mestieri e riprova", fn: () => X.jobsMenu(fight) },
            { label: "Ritirati per ora", sub: "Torna dal Cristallo quando vuoi", fn: done },
          ], "cr_grotta");
          X.SFX.crystal(); const msg = X.reward("cr_c1_golem", { coins: 40 });
          say([["voce", `${r.a} a ${r.b}. Il Golemone si ferma, guarda il pallone di roccia nella rete, e lentamente si siede. Poi fa una cosa che i golem non fanno: applaude. ${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}`],
            ["voce", "I golem tornano a sedere, a guardia. Il Cristallo della Terra si accende: luce color miele riempie la grotta, le lanterne di tutta l'isola, ne sei sicuro, si sono appena riaccese."],
            ["voce", "E Aira… Aira è ferma davanti al Cristallo, e le sue mani brillano dello stesso colore."]], () => { setStep(N, 5); X.refreshZone(); glowScene(); });
        } });
    }
    const def = {
      n: N, title: "Il Guerriero della Luce", sub: "Borgo Radice, il Bosco delle Lucciole, la Grotta di Terra", start: "cr_borgo", goal, zones, talk, obj, introBg: "cr_borgo",
      news: (id, s) => (id === "cr_ortensia" && s === 0) || (id === "cr_bram" && s === 1) || (id === "cr_aira" && (s === 2 || s === 5)) || (id === "cr_pim" && s === 3) || (id === "cr_vela" && s === 6),
      intro: () => [
        ["voce", "Calcistea. Un regno di isole che galleggiano nel cielo. Lo tengono in volo quattro Cristalli: Terra, Vento, Fuoco, Acqua."],
        ["voce", "E i Cristalli restano accesi per una ragione sola: ogni anno, nel loro santuario, si gioca la Partita del Cristallo. Il calcio, qui, non è un gioco. Cioè: è un gioco. Ma è anche il motivo per cui non si cade."],
        ["voce", "Da qualche mese l'Impero di Ferrogrigio, con le sue corazzate di ferro, succhia la luce dei Cristalli. E i Cristalli si spengono."],
        ["voce", "Tu sei {n}, numero {num} di Borgo Radice. Stasera non lo sai ancora, ma il Cristallo della Terra ti ha già scelto."],
      ],
    };
    return def;
  }
  boot();
})();
