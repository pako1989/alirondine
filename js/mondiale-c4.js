// js/mondiale-c4.js - «MONDIALE GIOVANILE» · Capitolo 4: La Finale di Tokyo
// Tokyo al neon: strade, konbini, ryokan, tempio dei ciliegi, stadio nazionale. Ren Hayate, il discorso alla squadra, la finale e quattro finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__mgCore;
    if (!E || !E.api || !E.api.addChapter || !window.__mgH || !window.__catena) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__mgH(K), { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("mg_c4", { kind: "shirt", label: "Maglia della Finale", val: "#facc15", from: "Capitolo 4 di Mondiale Giovanile" });
    K.lore("l_tokyo", { t: "Il calcio di Tokyo", d: "Il Giappone gioca con rispetto e con un sorriso che non concede niente. Prima della partita ci si inchina; dopo, lo si fa ancora più in basso." });
    const goal = (s) => ({
      0: "Parla con Mister Gallo, nel quartiere di Tokyo.",
      1: "Incontra Ren Hayate al tempio (porta a sud del quartiere).",
      2: "Torna al quartiere: nel ryokan (porta a nord-est) Yuki ospita il discorso alla squadra.",
      3: "Lo stadio è aperto (porta est): parla con Ren per la finale.",
      4: "La storia si chiude."
    }[s] || "La storia è conclusa.");
    const names = () => K.crew.field().map((id) => K.crew.members[id].n.split(" ")[0]);
    function ending(id, win) {
      K.end(id);
      const msg = K.reward("mg_c4", { coins: win ? 200 : 120, cos: "mg_c4" }); setStep(N, 4);
      K.finishChapter(N, id);
      const T = {
        oro: [["voce", "Il fischio finale arriva come un respiro. Gallo si siede in panchina, con la faccia di uno che non sa dove mettere la felicità."], ["mg_gallo", "[felice] Ho ventisei anni di panchina. Questo è il primo che non ricorderò come una finale persa."], ["mg_ren", "[felice] Una partita splendida. Ci vediamo al prossimo Mondiale: stavolta niente sorrisi."]],
        argento: [["voce", "Il secondo posto ha un sapore strano: dolce e salato. Sul campo, Ren aiuta Elio ad alzarsi senza una parola."], ["mg_gallo", "[serio] Avete giocato un gran calcio. Non vi dico bravi. Vi dico: tra quattro anni."], ["mg_ren", "[felice] Questa Catena è la migliore che io abbia affrontato. La prossima volta mi batti."]],
        squadra: [["voce", "Undici maglie, una sola esultanza. La coppa passa di mano in mano, nessuno la tiene per sé: Teo la dà a Sandro, Sandro a Nina, Nina a Tico, Tico a Elio."], ["mg_elio", "[felice] Sai che la Catena finisce quando la palla non torna a chi ha cominciato? Stasera non finisce."], ["mg_gallo", "[felice] Ecco perché si chiama squadra."]],
        segreto: [["voce", "Tre catene perfette in un torneo. Nel replay della finale, il gol decisivo è passato per tutti i giocatori in campo: nessuno ha toccato la palla da solo."], ["mg_ren", "[sorpreso] Non ho mai visto una squadra giocare come un'unica persona. E io, in tutto questo, ero a dieci metri."], ["mg_gallo", "[felice] Ora so cosa vuol dire «passatevi la palla». Lo avete insegnato a me."]]
      }[id];
      K.scene(T.concat([["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Hai trovato un finale. Gli altri ti aspettano nel Taccuino.`]]), () => K.openMain(), "mg_tokyo");
    }
    function result(win) {
      const ok = K.stat("intesa") >= 50;
      if (!win) return ending("argento", false);
      if (ok && K.chain.perfect() >= 3) return ending("segreto", true);
      if (ok) return ending("squadra", true);
      return ending("oro", true);
    }
    const lost = () => K.ask("voce", "Finale persa (o abbandonata). Puoi riprovare, oppure accettare il risultato: la storia continua col finale d'argento.", [{ label: "Riprova la finale", cls: "hot", fn: () => match() }, { label: "Accetta il risultato", sub: "Finale d'argento", fn: () => result(false) }, { label: "Più tardi", fn: K.done }]);
    function match() {
      K.say(H.flush(), () => K.playMatch({
        id: "mg_finale", alt: "az,cage,hd", force: false, squad: names().slice(0, 3), mate: names()[0] || "Elio", us: "Italia U16", oppTeam: "Giappone U16", oppColor: "#dc2626", homeKit: ["#1d4ed8", "#f8fafc"],
        oppNames: ["Haru", "Sho", "Daichi", "Kenta"], intro: "Stadio Nazionale di Tokyo · La finale del Mondiale Giovanile: Italia contro Giappone.", min: 60, done: (r) => (r.win ? result(true) : lost())
      }));
    }
    const zones = {
      mg_tokyo: {
        region: "tokyo", name: "Il quartiere di Tokyo", short: "Tokyo", sub: "Neon rosa e ciano, un konbini aperto a ogni ora e ciliegi in fiore", bg: "mg_tokyo", time: "notte", w: 36, h: 22, base: "g", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c4", items: [[5, 10], [31, 14], [10, 16], [22, 9]],
        areas: [[2, 2, 33, 6, "Le insegne"], [0, 7, 35, 9, "La strada"], [0, 10, 35, 18, "Il quartiere"], [0, 0, 35, 21, "Il quartiere di Tokyo"]],
        act: { J: "Guarda l'edificio", O: "Guarda il ciliegio", L: "Guarda il lampione", C: "Leggi l'insegna", K: "Guarda il distributore", B: "Siediti in panchina", M: "Guarda la ringhiera", N: "Guarda la bicicletta", I: "Guarda il torii" },
        flavor: { J: "Un edificio sottile e altissimo con quindici insegne: una vende ramen, una vende ombrelli, una forse niente.", O: "Un ciliegio in fiore. I petali cadono come se avessero tutto il tempo.", L: "Un lampione con una lanterna di carta rossa.", C: "Un'insegna al neon: «Calcio · Sushi · Karaoke». Un menù completo.", K: "Un distributore di bibite: trenta tipi di tè, tre di caffè, uno di mistero.", B: "Una panchina con un gatto addormentato e un biglietto del treno.", M: "Una ringhiera con i lucchetti degli innamorati.", N: "Una bicicletta parcheggiata con eleganza.", I: "Un piccolo torii rosso, come un portale per un'altra giornata." },
        objects: {},
        doors: { "15,6": { to: "mg_konbini", at: [7, 8] }, "25,6": { to: "mg_ryokan", at: [9, 9] }, "17,21": { to: "mg_tempio", at: [15, 20] }, "35,11": { to: "mg_stadio_tokyo", at: [1, 11], locked: () => (S() >= 3 ? false : "Lo stadio è chiuso per i preparativi. Prima il tempio e il ryokan.") } },
        npcs: () => [{ id: "mg_gallo", at: [6, 11], face: "right" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 21, "g"); lay(0, 0, 35, 1, "O"); lay(2, 2, 9, 6, "J"); lay(12, 2, 19, 6, "J"); lay(22, 2, 29, 6, "J"); lay(31, 2, 35, 6, "J"); put(15, 6, "q"); put(25, 6, "q"); lay(14, 7, 16, 7, "g"); lay(24, 7, 26, 7, "g");
          lay(0, 19, 35, 21, "O"); lay(16, 19, 18, 20, "g"); put(17, 21, "q");
          [[8, 10], [11, 9], [20, 10], [28, 9]].forEach(([x, y]) => put(x, y, "L")); put(5, 8, "C"); put(21, 8, "C"); put(31, 8, "C"); [[4, 12], [24, 12], [33, 13]].forEach(([x, y]) => put(x, y, "K")); put(10, 14, "N"); put(11, 14, "N"); put(14, 15, "B"); put(26, 15, "B");
          [[1, 15], [33, 17], [18, 12], [30, 16], [7, 17]].forEach(([x, y]) => put(x, y, "O")); lay(20, 14, 22, 14, "M"); put(35, 11, "q"); lay(34, 10, 34, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "KONBINI 24H", d.X(15) + 8, d.Y(6) + 4, "#bbf7d0"); H.plaque(g, "RYOKAN", d.X(25) + 8, d.Y(6) + 4, "#ddd6fe"); H.plaque(g, "神社 TEMPIO", d.X(17) + 8, d.Y(18) + 4, "#fecaca"); [["RAMEN", 5, 6, "#f472b6"], ["KARAOKE", 20, 6, "#22d3ee"], ["SUSHI", 33, 6, "#facc15"], ["BAR", 8, 8, "#a78bfa"], ["PACHINKO", 28, 8, "#fb7185"]].forEach(([t, x, y, c]) => { H.plaque(g, t, d.X(x) + 8, d.Y(y) + 4, c); g.save(); g.globalAlpha = 0.25; g.fillStyle = c; g.fillRect(d.X(x) - 16, d.Y(y) - 6, 48, 20); g.restore(); }); }
      },
      mg_tempio: {
        region: "tempio", name: "Il tempio dei ciliegi", short: "Tempio", sub: "Lanterne, un portale rosso e un laghetto con le carpe", bg: "mg_tempio", time: "giorno", w: 30, h: 22, base: "t", start: [15, 19], sneakStart: [15, 19],
        itemCos: "mg_c4", items: [[4, 9], [24, 10], [8, 17], [22, 16]],
        areas: [[11, 2, 18, 6, "Il tempio"], [0, 0, 29, 21, "Il tempio dei ciliegi"]],
        act: { J: "Guarda il tempio", O: "Guarda il ciliegio", L: "Guarda la lanterna", I: "Guarda il torii", Z: "Guarda il laghetto", R: "Guarda la roccia", S: "Guarda l'altare", B: "Siediti in panchina", M: "Guarda la ringhiera" },
        flavor: { J: "Un tempio di legno scuro con un tetto che sembra una promessa piegata.", O: "Un ciliegio in piena fioritura. Ogni petalo è un appuntamento con la brevità.", L: "Una lanterna di pietra con la fiamma di una candela e la pazienza di un monaco.", I: "Un portale rosso: chi lo attraversa deve inchinarsi, anche con un pallone sotto il braccio.", Z: "Un laghetto con le carpe: arancioni, bianche e una con un neo nero che gira in tondo.", R: "Una roccia coperta di muschio e di preghiere.", S: "Un altare con offerte di riso e un piccolo pallone di carta.", B: "Una panchina di legno con una vista sul laghetto.", M: "Una ringhiera di bambù." },
        objects: {},
        doors: { "15,21": { to: "mg_tokyo", at: [17, 20] } },
        npcs: () => [{ id: "mg_ren", at: [15, 10], face: "down" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 21, "t"); lay(0, 0, 29, 1, "O"); lay(11, 2, 18, 6, "J"); put(15, 6, "S"); put(10, 8, "I"); put(19, 8, "I"); lay(12, 13, 17, 15, "Z"); lay(0, 20, 29, 21, "O"); lay(14, 20, 16, 20, "t"); put(15, 21, "q");
          [[6, 7], [23, 7], [6, 13], [23, 13], [10, 17], [20, 17]].forEach(([x, y]) => put(x, y, "L")); put(3, 8, "R"); put(26, 8, "R"); put(3, 16, "R"); put(26, 16, "R"); put(9, 12, "B"); put(20, 12, "B"); lay(11, 11, 11, 16, "M"); lay(18, 11, 18, 16, "M");
          [[2, 4], [27, 4], [2, 12], [27, 12], [5, 19], [24, 19], [8, 10], [21, 10], [13, 18]].forEach(([x, y]) => put(x, y, "O"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "TEMPIO DEI CILIEGI", d.X(15) + 8, d.Y(2) + 4, "#fecaca"); }
      },
      mg_ryokan: {
        interior: true, region: "interno", name: "Il ryokan di Yuki", short: "Ryokan", sub: "Tatami, tè verde e porte di carta che non lasciano passare i segreti", bg: "mg_hotel", w: 18, h: 12, start: [9, 9], outside: ["mg_tokyo", 25, 7],
        act: { D: "Guarda il tavolino", V: "Guarda la porta scorrevole", S: "Guarda l'altare", K: "Guarda lo scaffale", N: "Guarda il cuscino" },
        flavor: { D: "Un tavolino basso con una teiera di ferro e due tazze senza manico.", V: "Una porta scorrevole di carta: l'ombra di qualcuno la attraversa ogni tanto.", S: "Un altarino con un cartoncino: «Giocate con cuore, tornate a casa».", K: "Uno scaffale con libri di calcio e di cucina, nello stesso ripiano.", N: "Un cuscino di seta con una macchia di tè e di storia." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_yuki", at: [9, 4], face: "down" }, { id: "mg_elio", at: [4, 7], face: "right" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 11, "t"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 11, "a"); lay(17, 0, 17, 11, "a"); lay(0, 11, 17, 11, "a"); put(9, 11, "v");
          lay(2, 2, 4, 2, "V"); lay(13, 2, 15, 2, "V"); put(7, 2, "K"); put(10, 2, "S"); lay(7, 7, 10, 7, "D"); put(2, 9, "N"); put(15, 9, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "RYOKAN YUKI", d.X(9) + 8, d.Y(1) + 4, "#ddd6fe"); }
      },
      mg_konbini: {
        interior: true, region: "interno", name: "Il konbini 24 ore", short: "Konbini", sub: "Onigiri, bibite fredde e un campanello che suona da solo", bg: "mg_hotel", w: 14, h: 10, start: [7, 8], outside: ["mg_tokyo", 15, 7],
        act: { K: "Guarda lo scaffale", D: "Guarda il bancone", V: "Guarda il frigo", N: "Guarda la cassa", S: "Guarda il peluche" },
        flavor: { K: "Uno scaffale con trenta tipi di snack: l'unico che nessuno compra è quello alle alghe e cioccolato.", D: "Un bancone con una pila di scontrini e un maneki-neko con la zampa alzata.", V: "Un frigo di bibite: tutte fredde, tutte colorate, tutte con un nome impossibile.", N: "Una cassa con una colonna di monete e un biglietto: «Grazie e buona partita».", S: "Un peluche a forma di pallone, in saldo." },
        objects: {}, doors: {},
        npcs: () => [{ id: "mg_nina", at: [4, 5], face: "right" }, { id: "mg_bruno", at: [9, 5], face: "left" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "w"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(2, 2, 5, 2, "K"); lay(8, 2, 11, 2, "V"); lay(3, 7, 5, 7, "D"); put(11, 7, "N"); put(10, 7, "S");
        },
        decor(g, cx, cy, d) { H.plaque(g, "KONBINI 24H", d.X(7) + 8, d.Y(1) + 4, "#bbf7d0"); }
      },
      mg_stadio_tokyo: {
        region: "stadio", name: "Lo stadio nazionale di Tokyo", short: "Stadio", sub: "Spalti pieni, lanterne di carta e un silenzio che sa di rispetto", bg: "mg_stadio", time: "sera", w: 34, h: 22, base: "g", start: [2, 11], sneakStart: [2, 11],
        itemCos: "mg_c4", items: [[3, 7], [31, 10], [16, 21], [2, 18]],
        areas: [[2, 2, 31, 5, "Le tribune"], [6, 8, 28, 19, "Il campo"], [0, 0, 33, 21, "Lo stadio nazionale di Tokyo"]],
        act: { T: "Guarda la tribuna", G: "Guarda la porta", B: "Siediti in panchina", C: "Leggi il cartellone", L: "Guarda il riflettore", O: "Guarda il ciliegio", N: "Guarda il borsone", I: "Guarda il torii" },
        flavor: { T: "Una tribuna immensa, in silenzio, in attesa di un fischio.", G: "Una porta con la rete bianca come una pagina nuova.", B: "Una panchina con un cuscino, una bottiglia e un biglietto: «Fate vedere cosa siete».", C: "«Mondiale Giovanile · Finale».", L: "Un riflettore che illumina il campo di un'ombra che non c'è.", O: "Un ciliegio finto, ma di grande effetto: i petali sono coriandoli.", N: "Un borsone con la bandiera giapponese e una dedica a matita.", I: "Un portale rosso sul bordo del campo: chi entra si inchina." },
        objects: {},
        doors: { "0,11": { to: "mg_tokyo", at: [34, 11] } },
        npcs: () => [{ id: "mg_ren", at: [17, 6], face: "down" }, { id: "mg_gallo", at: [6, 10], face: "right" }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 21, "g"); lay(2, 2, 31, 5, "T"); lay(0, 0, 33, 1, "O");
          lay(6, 8, 28, 19, "e"); lay(6, 8, 28, 8, "l"); lay(6, 19, 28, 19, "l"); lay(6, 9, 6, 18, "j"); lay(28, 9, 28, 18, "j"); lay(17, 9, 17, 18, "j"); put(6, 8, "x"); put(28, 8, "x"); put(6, 19, "x"); put(28, 19, "x");
          put(5, 13, "G"); put(5, 14, "G"); put(29, 13, "G"); put(29, 14, "G"); lay(8, 7, 14, 7, "C"); lay(20, 7, 26, 7, "C"); put(3, 13, "B"); put(3, 14, "B"); put(31, 13, "B"); put(31, 14, "B");
          put(5, 6, "L"); put(28, 6, "L"); put(5, 20, "L"); put(28, 20, "L"); put(3, 20, "N"); put(0, 11, "q"); lay(1, 10, 3, 12, "g");
        },
        decor(g, cx, cy, d) { H.plaque(g, "国立競技場", d.X(16) + 8, d.Y(2) + 4, "#fecaca"); }
      }
    };
    const talk = {
      mg_gallo() {
        if (K.rel.scene("mg_gallo")) return;
        const s = S();
        if (s === 0) {
          say("mg_gallo", "[serio] Tokyo. La finale è dopodomani. Dall'altra parte c'è il Giappone, e dall'altra parte del Giappone c'è Ren Hayate: capitano, regista, sorriso.");
          say("mg_gallo", "Prima della partita, qui, ci si presenta. Vai al tempio, a sud: Ren ti aspetta. Poi il ryokan, a nord-est: Yuki ci ospita per il discorso.");
          K.rel.add("mg_gallo", 1, true); setStep(N, 1); quest("mg_c4", "Mondiale Giovanile", "Incontra Ren al tempio, a sud."); return done();
        }
        say("mg_gallo", s >= 3 ? "[serio] Lo stadio è aperto. Passatevi la palla." : "[serio] Ren al tempio, poi il ryokan. In quest'ordine, se potete."); done();
      },
      mg_ren() {
        if (K.rel.scene("mg_ren")) return;
        const s = S();
        if (s === 1) {
          say("mg_ren", "[felice] Tu sei l'italiano. Ho sentito parlare della tua Catena: tre passaggi e un tiro. Elegante. Noi giochiamo con meno passaggi e più pazienza.");
          say("mg_ren", "In Giappone prima di una finale si fa una cosa: si gioca una partita piccola, senza arbitro, per ricordare perché si fa questo gioco. Ti va?");
          return ask("Come rispondi?", [
            { label: "⛓ Accetta una Catena (livello 3)", sub: "Una sfida piccola, senza arbitro", big: true, cls: "hot", fn: () => H.chain(3, "Ren Hayate", "Catena · Contro Ren", (r) => {
              if (r && r.win) { K.bond("intesa", 4); say("mg_ren", "[sorpreso] Bellissimo gol. La finale si giocherà in due."); } else say("mg_ren", "[felice] Una bella partita. Il punteggio non conta: contano i passaggi.");
              setStep(N, 2); quest("mg_c4", "Mondiale Giovanile", "Vai al ryokan, a nord-est del quartiere."); done(); }) },
            { label: "🤝 Stringigli la mano", sub: "Si gioca in finale", fn: () => { K.bond("intesa", 1); say("mg_ren", "[felice] Allora ci vediamo in campo. Con rispetto."); setStep(N, 2); quest("mg_c4", "Mondiale Giovanile", "Vai al ryokan, a nord-est del quartiere."); done(); } }
          ]);
        }
        if (s === 3) {
          say("mg_ren", "[felice] Eccoci. Nessun rancore e nessun risparmio. Giochiamo.");
          return match();
        }
        say("mg_ren", s < 3 ? "[felice] Ci vediamo in finale." : "[felice] Una partita memorabile."); done();
      },
      mg_yuki() {
        if (K.rel.scene("mg_yuki")) return;
        const s = S();
        if (s === 2) {
          say("mg_yuki", "[felice] Si accomodi. Il tè si versa, non si spiega. Il vostro CT mi ha detto che serve un discorso alla squadra. Io leggo i piedi, e i vostri sono nervosi.");
          return ask("Che cosa dici ai ragazzi, prima della finale?", [
            { label: "😄 Giochiamo per divertirci", sub: "Intesa +4", fn: () => { K.bond("intesa", 4); say("mg_yuki", "[felice] Un discorso gentile. I nervi si sciolgono."); setStep(N, 3); quest("mg_c4", "Mondiale Giovanile", "Lo stadio è aperto, a est. Parla con Ren."); done(); } },
            { label: "🔥 Giochiamo per vincere", sub: "Grinta +4", fn: () => { K.bond("grinta", 4); say("mg_yuki", "[serio] Un discorso nitido. Anche il tè si fa più forte."); setStep(N, 3); quest("mg_c4", "Mondiale Giovanile", "Lo stadio è aperto, a est. Parla con Ren."); done(); } },
            { label: "🕊️ Giochiamo per chi non c'è", sub: "Grinta +2, Intesa +2", fn: () => { K.bond("grinta", 2); K.bond("intesa", 2); say("mg_yuki", "[triste] Un discorso che riempie la stanza di silenzio. Il silenzio, qui, è la lode migliore."); setStep(N, 3); quest("mg_c4", "Mondiale Giovanile", "Lo stadio è aperto, a est. Parla con Ren."); done(); } }
          ]);
        }
        say("mg_yuki", s < 2 ? "[felice] Torni dopo il tempio. Il tè aspetterà." : "[felice] Vada a vincere. O a perdere con eleganza."); done();
      },
      mg_elio() {
        if (K.rel.scene("mg_elio")) return;
        ask("Elio ti guarda: «Un po' di allenamento prima della finale?»", [
          { label: "⛓ Allenati con Elio (Catena)", sub: "Livello 2: ripetibile, conta per le catene perfette", big: true, cls: "hot", fn: () => H.chain(2, "Elio Moro", "Catena · Allenamento", (r) => { K.bond("intesa", r && r.win ? 1 : 0); say("mg_elio", r && r.win ? "[felice] Pulita. Un'altra così e posso smettere di dubitare." : "[serio] Intercettato. Capita: si riparte."); done(); }) },
          { label: "Chiacchiera", fn: () => { say("mg_elio", "[pensa] Giocare a occhi chiusi funziona finché c'è qualcuno ad aprirli per te."); K.rel.add("mg_elio", 1, true); done(); } },
          { label: "Non ora", fn: done }
        ]);
      },
      mg_nina() {
        if (K.rel.scene("mg_nina")) return;
        say("mg_nina", "[ride] Ho assaggiato un onigiri alle alghe e al cioccolato. Non lo rifaccio. Ma lo racconterò ai miei nipoti.");
        K.rel.add("mg_nina", 1, true); done();
      },
      mg_bruno() {
        if (K.rel.scene("mg_bruno")) return;
        say("mg_bruno", "[pensa] Domani segno. Lo sento. Se non segno, ho comunque assaggiato un tè con la schiuma di matcha. Compensazione equa.");
        K.rel.add("mg_bruno", 1, true); done();
      }
    };
    return {
      n: N, title: "La Finale di Tokyo", sub: "Neon, ciliegi e una finale",
      goal, start: "mg_tokyo", introBg: "mg_tokyo", zones, talk, obj: {},
      intro: [["voce", "Tokyo. Un cielo rosa, un fiume di insegne e un unico pensiero: passare la palla un'ultima volta."], ["mg_gallo", "[serio] Domani si vince o si impara. Ho sempre pensato che fossero la stessa cosa. Quasi."]]
    };
  }
  boot();
})();
