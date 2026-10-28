// js/compagnia-c3.js - «LA COMPAGNIA DEL PALLONE SPEZZATO» · Capitolo 3: La Pagina Strappata
// Il convento di San Pallone, abbandonato: frate Anselmo, il novizio Pio, la biblioteca. La verità su Ludovico e la prima pagina del registro; battaglia nel Chiostro contro il Gabelliere.
(function () {
  "use strict";
  function boot() {
    const E = window.__compagniaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__compagniaH || !window.__tattica) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  const CHIOSTRO = {
    name: "Il Chiostro di San Pallone",
    rows: ["..f...f..", ".#.#.#.#.", "....h....", ".#.#.#.#.", "f.......f", ".#.#.#.#.", "..f...f.."],
    ps: [[0, 2], [1, 2], [0, 3], [1, 4], [0, 5]], es: [[7, 2], [8, 2], [8, 3], [7, 4], [8, 4]]
  };
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__compagniaH(K), { say, done, ask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    H.cast("cp_anselmo", "Frate Anselmo", "Custode del convento", { style: "bald", hair: "#d1d5db", beard: "folta", shirt: "#57534e", skin: "#e0b890", bg: ["#292524", "#d6d3d1"] }, "Ultimo frate di San Pallone. Annaffia un orto che non cresce da vent'anni, per abitudine.");
    H.cast("cp_pio", "Novizio Pio", "Bibliotecario del convento", { style: "short", hair: "#78350f", shirt: "#57534e", skin: "#e8c4a0", acc: ["occhiali"], bg: ["#1c1917", "#fde68a"] }, "Quindici anni, un quaderno e la certezza che i libri si difendano da soli. Ha ragione solo a metà.");
    K.cos("cp_c3", { kind: "shirt", label: "Tonaca di San Pallone", val: "#57534e", from: "Capitolo 3 de La Compagnia del Pallone Spezzato" });
    K.lore("l_convento", { t: "Il convento di San Pallone", d: "Un convento fondato per benedire i Campi di Guerra. Chiuso per fallimento, dopo che qualcuno ha firmato un debito a nome di tutti i frati." });
    K.lore("l_verita", { t: "Il primo debito", d: "Il debito della Compagnia nasce da un prestito preso da un frate per salvare il convento. Il frate era Ludovico. La Compagnia lo ha pagato per anni senza saperlo." });

    const goal = (s) => ({
      0: "Al convento di San Pallone, a est del Fortino: parla con Frate Anselmo.",
      1: "Nella biblioteca, a nord: trova il novizio Pio.",
      2: "Nel chiostro, davanti al convento: il Gabelliere è arrivato con i soldati.",
      3: "Parla con Frate Ludovico: ha qualcosa da dirti.",
      4: "Il capitolo si chiude al convento."
    }[s] || "Il capitolo 3 è concluso.");

    const dorotea = { id: "cp_dorotea", name: "Capitana Dorotea", role: "D", at: 68, df: 74, te: 66, saga: "compagnia", col: "#7f1d1d" };
    const FOES = [
      { id: "cp_brando", name: "Brando il Gabelliere", role: "D", at: 78, df: 78, te: 64, boss: true },
      { id: "cp_scelto1", name: "Soldato Scelto", role: "D", at: 66, df: 70, te: 58 },
      { id: "cp_scelto2", name: "Soldato Scelto", role: "D", at: 64, df: 68, te: 58 },
      { id: "cp_bal2", name: "Balestriere", role: "A", at: 68, df: 48, te: 62 },
      { id: "cp_serg", name: "Sergente del Marchese", role: "C", at: 58, df: 62, te: 62 }
    ];
    function fin() {
      F.set("cp_c3_done", true);
      K.reward("cp_c3", { coins: 130, cos: "cp_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["cp_dorotea", "[serio] Un frate che ha preso un debito per salvare un convento. Ho visto mercenari peggiori. Ho visto anche capitani peggiori."], ["cp_ludovico", "[pensa] Registro: «un debito, due colpe, una Compagnia ancora in piedi». Se ancora mi volete."], ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>💪 Grinta ${K.stat("grinta")} · 🎖️ Onore ${K.stat("onore")} · 🧠 Astuzia ${K.stat("astuzia")} · Compagnia ${K.crew.count()}/${K.crew.total}`], ["voce", "Il Capitolo 4, la battaglia finale, ti aspetta."]]), () => K.openMain(), "cp_titolo");
    }
    function fight() {
      H.battle({ map: CHIOSTRO, foes: FOES, turns: 14, title: "Il Chiostro di San Pallone", units: K.tactics.team().concat([dorotea]) }, (r) => {
        if (r && r.win) {
          setStep(N, 3); K.bond("onore", 1); K.bond("astuzia", 1);
          say("cp_brando", "[sorpreso] Mi avevano detto: «mercenari». Nessuno aveva specificato quali. Annoto: «rispettabili».");
          say("cp_dorotea", "[felice] Ludovico, vieni qui. Abbiamo una conversazione che aspetta da undici anni.");
          done();
        } else {
          say("cp_brando", "[freddo] Il convento è del Marchese, per diritto di debito. Tornate con un piano.");
          done();
        }
      });
    }
    const talk = {
      cp_anselmo() {
        if (K.rel.scene("cp_anselmo")) return;
        const s = S();
        if (s === 0) {
          say("cp_anselmo", "[pensa] Un'altra Compagnia. L'ultima è venuta per i candelieri. Voi per cosa?");
          say("cp_anselmo", "San Pallone: fondato per benedire i Campi di Guerra. Chiuso per debiti: qualcuno firmò a nome di tutti. Non ricordo il nome. Ricordo la grafia, però: bella. Da frate.");
          K.learnLore("l_convento"); setStep(N, 1);
          quest("cp_c3", "La Pagina Strappata", "Nella biblioteca, a nord: trova il novizio Pio.");
          return ask("Frate Anselmo annaffia l'orto.", [
            { label: "🕊️ «Vengo in pace»", sub: "Onore +1", fn: () => { K.bond("onore", 1); say("cp_anselmo", "Allora fai male: in pace qui non viene nessuno."); done(); } },
            { label: "🧠 «Che cosa è sparito?»", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); say("cp_anselmo", "[furbo] Una pagina. E tre candelieri. Dei due, mi manca di più la pagina."); done(); } },
            { label: "Niente", fn: done }
          ]);
        }
        say("cp_anselmo", s === 1 ? "Il novizio Pio è in biblioteca, a nord. Ha una chiave e un quaderno. Fidati del quaderno." : s === 2 ? "Fuori, nel chiostro. Il Gabelliere ha portato i soldati. Che idea, i soldati." : "Prendi pure le zucche, se vuoi. Sono finte, ma nutrono l'anima.");
        done();
      },
      cp_pio() {
        if (K.rel.scene("cp_pio")) return;
        const s = S();
        if (s === 1) {
          say("cp_pio", "[sorpreso] Una Compagnia! In biblioteca! Vi ho letti. Siete a pagina 4: «mercenari sfortunati».");
          say("cp_pio", "La prima pagina del registro dei debiti l'ho trovata io, nascosta in un libro di ricette. È la confessione di chi ha preso il prestito. Con la firma. Con il nome. Il nome di Frate Ludovico.");
          K.learnLore("l_verita"); K.inv.give("cp_pagina"); setStep(N, 2);
          quest("cp_c3b", "Il Chiostro", "Il Gabelliere è nel chiostro con i soldati. Difendi il convento.");
          say("voce", "Il novizio Pio ti consegna la pagina. Fuori, i passi di un esercito.");
          return done();
        }
        say("cp_pio", s < 1 ? "Chiuso. A meno che non sia un mercenario. In quel caso, chiuso lo stesso." : s === 2 ? "I soldati! Mi nascondo. Sono già nascosto. Mi nascondo di nuovo." : "Ho trascritto la pagina in tre copie. Una è per voi, una per il convento, una per quando mi dimenticherò.");
        done();
      },
      cp_brando() {
        if (K.rel.scene("cp_brando")) return;
        const s = S();
        if (s === 2) {
          say("cp_brando", "[freddo] Compagnia del Pallone Spezzato. Il Marchese reclama il convento per debito non estinto. Ho con me la pergamena, quattro soldati e un notaio. Il notaio è in ritardo.");
          return ask("Brando ha portato i soldati al convento.", [
            { label: "⚔️ Difendi il Chiostro", sub: "Battaglia a griglia · colonnato che ripara", big: true, cls: "hot", fn: () => fight() },
            { label: "👥 Schiera la Compagnia", sub: "Controlla chi combatte", fn: () => K.crew.pick(() => talk.cp_brando(), true) },
            { label: "↩ Non ancora", fn: done }
          ]);
        }
        say("cp_brando", s < 2 ? "Brando il Gabelliere non c'è. Tornate dopo la pergamena." : "[freddo] Il convento resta suo. Per ora. Io annoto: «ritirata tattica». Mi fa male scriverlo."); done();
      },
      cp_ludovico() {
        if (K.rel.scene("cp_ludovico")) return;
        const s = S();
        if (s === 3) {
          say("cp_ludovico", "[pensa] Il debito della Compagnia era il mio. L'ho preso per salvare San Pallone. Poi sono scappato e ho pagato in segreto, a rate, vestendomi da tesoriere. Undici anni.");
          say("cp_ludovico", "Non vi chiedo di perdonarmi. Vi chiedo di contare i miei errori, come io ho contato i vostri.");
          return ask("Frate Ludovico ti guarda. Per la prima volta non sta facendo di conto.", [
            { label: "🤝 «Siamo la Compagnia. Il debito è nostro»", sub: "Onore +1", fn: () => { K.bond("onore", 1); F.set("cp_ludo", "perdono"); say("cp_ludovico", "[commosso] Allora lo dividiamo. Matematicamente, è il primo debito che pesa meno."); fin(); } },
            { label: "⚖️ «Voglio tutta la verità, poi decido»", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); F.set("cp_ludo", "verita"); say("cp_ludovico", "[pensa] Giusto. Ti darò i registri veri. Quelli che non ho mai mostrato a nessuno."); fin(); } },
            { label: "🥣 «Mangia la zuppa, poi ne parliamo»", sub: "Grinta +1", fn: () => { K.bond("grinta", 1); F.set("cp_ludo", "zuppa"); say("cp_ludovico", "[sorpreso] La zuppa. Non so se mi stiate perdonando o avvelenando. In entrambi i casi, grazie."); fin(); } }
          ]);
        }
        say("cp_ludovico", s < 3 ? "Registro: sto ancora cercando un modo per non parlare di una cosa." : "Siamo qui. Contiamo."); done();
      }
    };
    const zones = {
      cp_convento: {
        region: "convento", name: "Il Convento di San Pallone", short: "Convento", sub: "Un orto finto, un chiostro e una campana senza batacchio", bg: "cp_convento", time: "giorno", w: 30, h: 22, base: ",", start: [1, 10],
        itemCos: "cp_c3", items: [[3, 8], [26, 7], [13, 17], [25, 13]],
        areas: [[8, 6, 20, 13, "Il chiostro"], [2, 14, 12, 19, "L'orto"], [11, 1, 18, 4, "La biblioteca"], [0, 0, 29, 21, "Il convento di San Pallone"]],
        act: { n: "Leggi il cartello", E: "Guarda lo stendardo", z: "Guarda le casse", b: "Siediti", s: "Riposa un momento", l: "Guarda la lanterna", u: "Guarda la bancarella" },
        flavor: { n: "Un cartello: «CONVENTO DI SAN PALLONE · FONDATO PER BENEDIRE · CHIUSO PER FALLIMENTO».", E: "Uno stendardo del convento: un pallone con un'aureola, scolorito dal sole e dai debiti.", z: "Casse di candele: tutte spente, tutte pagate, nessuna benedetta.", u: "Una bancarella di zucche finte. «Nutrono l'anima.»" },
        doors: { "0,10": { to: "cp_fortino", at: [28, 10] }, "0,11": { to: "cp_fortino", at: [28, 11] } },
        npcs: () => [{ id: "cp_anselmo", at: [6, 16] }].concat(S() >= 2 && S() < 3 ? [{ id: "cp_brando", at: [20, 10] }] : []).concat(S() >= 3 ? [{ id: "cp_ludovico", at: [14, 11] }] : []),
        intro: [["voce", "Il convento di San Pallone, a est del Fortino: un chiostro che aspetta, un orto finto e una campana senza batacchio."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 10, 28, 11, ":"); lay(8, 6, 20, 13, "+"); lay(2, 14, 12, 19, ";"); lay(21, 14, 28, 19, "t"); lay(1, 1, 8, 4, "t"); lay(21, 1, 28, 5, "t");
          lay(8, 6, 20, 6, "a"); lay(8, 13, 20, 13, "a"); put(14, 6, ","); put(14, 13, ","); lay(10, 8, 10, 11, "y"); lay(18, 8, 18, 11, "y");
          put(5, 8, "u"); put(6, 8, "u"); [[5, 14], [9, 18]].forEach(([x, y]) => put(x, y, "r")); put(26, 9, "n"); put(5, 10, "n"); put(24, 12, "b"); put(9, 12, "b"); put(12, 12, "l"); put(16, 12, "l");
          put(20, 9, "E"); put(21, 12, "z"); put(22, 12, "z");
          house(11, 1, 8, 4, { door: [14, 4], roof: "#44403c", wall: "#d6d3d1", enter: { to: "cp_biblioteca", at: [8, 9] } });
          put(0, 10, "q"); put(0, 11, "q"); put(29, 10, "q"); put(29, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CONVENTO DI SAN PALLONE", d.X(14) + 8, d.Y(1) - 6, "#d6d3d1"); H.plaque(g, "◂ FORTINO", d.X(1) + 8, d.Y(9) - 6, "#fca5a5"); H.plaque(g, "BIBLIOTECA", d.X(14) + 8, d.Y(4) - 6, "#fde68a"); }
      },
      cp_biblioteca: {
        interior: true, region: "biblioteca", name: "La Biblioteca di San Pallone", short: "Biblioteca", sub: "Scaffali polverosi, un quaderno e un libro di ricette sospetto", bg: "cp_biblioteca", w: 16, h: 11, start: [8, 9], outside: ["cp_convento", 14, 5],
        act: { u: "Guarda lo scaffale", C: "Guarda la botte", n: "Leggi la lavagna", x: "Apri il baule", l: "Guarda la lanterna" },
        flavor: { u: "Scaffali di libri: salmi, ricette, un trattato sul fuorigioco e un manuale per il giardinaggio mistico.", C: "Una botte di inchiostro. Ne manca un dito. È lo stesso dito dell'ultimo debitore.", n: "Una lavagna: «I DEBITI NON SI PERDONANO. SI RATEIZZANO.»" },
        loot: { "2,2": { id: "cp_mappa", text: "Dentro il baule: una mappa del convento, con una X sull'orto. Qualcuno ha scritto accanto: «zucche».", empty: "Il baule è vuoto. Solo polvere benedetta." } },
        npcs: () => [{ id: "cp_pio", at: [8, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "="); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 1, 6, 1, "u"); lay(10, 1, 13, 1, "u"); put(2, 2, "x"); put(13, 3, "C"); put(14, 3, "C"); put(14, 4, "C"); put(7, 1, "n"); put(9, 1, "l");
          lay(3, 6, 5, 6, "u"); lay(10, 6, 12, 6, "u");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BIBLIOTECA", d.X(8) + 8, d.Y(1) + 4, "#fde68a"); }
      }
    };
    return {
      n: N, title: "La Pagina Strappata", sub: "Un convento, un novizio e un frate che non conta più",
      goal, start: "cp_convento", introBg: "cp_convento", zones, talk, obj: {},
      intro: [["voce", "Dopo il Fortino, la strada sale: un convento abbandonato, un orto finto e una campana senza batacchio."], ["voce", "Qualcuno, qui, sa dove è finita la prima pagina del registro dei debiti."]]
    };
  }
  boot();
})();
