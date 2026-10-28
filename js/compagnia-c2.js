// js/compagnia-c2.js - «LA COMPAGNIA DEL PALLONE SPEZZATO» · Capitolo 2: La Strada del Marchese
// La strada a est, Bruno il Muro, il mercante Gervasio, il Fortino di Roccafredda: assalto alle mura (battaglia a griglia) oppure la grata della cantina e l'archivio di Ottavia.
(function () {
  "use strict";
  function boot() {
    const E = window.__compagniaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__compagniaH || !window.__tattica) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  const MURA = {
    name: "Le Mura di Roccafredda",
    rows: ["..#h.h#..", "f.#...#..", ".....h...", "f.#h.h#.f", "..#...#..", ".f.....f.", "..#h.h#.."],
    ps: [[0, 2], [1, 2], [0, 3], [1, 4], [0, 4]], es: [[7, 2], [8, 2], [8, 3], [7, 4], [8, 4]]
  };
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__compagniaH(K), { say, done, ask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    H.cast("cp_gervasio", "Mercante Gervasio", "Carovaniere", { style: "short", hair: "#78350f", beard: "folta", shirt: "#065f46", skin: "#d9a679", bg: ["#022c22", "#a7f3d0"] }, "Vende di tutto a tutti: ai soldati le spade, ai mercenari le scuse. Ha un carro che cigola in tre toni.");
    H.cast("cp_aurelio", "Capitano Aurelio", "Capitano del Fortino", { style: "short", hair: "#6b7280", beard: "baffi", shirt: "#1e3a8a", skin: "#e0b890", bg: ["#172554", "#bfdbfe"] }, "Veterano del Marchese. Ha un elmo lucidissimo e un'opinione di sé ancora più lucida.");
    H.cast("cp_ottavia", "Archivista Ottavia", "Archivio della cantina", { style: "bun", hair: "#44403c", shirt: "#7e22ce", skin: "#e8c4a0", acc: ["occhiali"], bg: ["#3b0764", "#e9d5ff"] }, "Tiene i registri del Fortino da trent'anni. Non ha mai letto una riga che non fosse in ordine alfabetico.");
    K.cos("cp_c2", { kind: "shirt", label: "Mantello della Strada", val: "#1e3a8a", from: "Capitolo 2 de La Compagnia del Pallone Spezzato" });
    K.lore("l_fortino", { t: "Il Fortino di Roccafredda", d: "Tre torri, un fossato asciutto e un cancello che il Marchese chiama «ospitale». Dentro, dicono, sta il registro dei debiti di tutta Spezzaterra." });
    K.lore("l_debito", { t: "La prima riga", d: "Nel registro dei debiti, la prima pagina è stata strappata via. Ottavia ricorda solo che la grafia, lì, era quella di un frate." });

    const goal = (s) => ({
      0: "Sulla Strada del Marchese, a est del Guado: trova Bruno il Muro.",
      1: "Parla con il Mercante Gervasio, sulla strada.",
      2: "Al Fortino di Roccafredda: parla con il Capitano Aurelio, o prova la grata della cantina.",
      3: "Il capitolo si chiude al Fortino."
    }[s] || "Il capitolo 2 è concluso.");

    const dorotea = { id: "cp_dorotea", name: "Capitana Dorotea", role: "D", at: 68, df: 74, te: 66, saga: "compagnia", col: "#7f1d1d" };
    const FOES = [
      { id: "cp_aurelio", name: "Capitano Aurelio", role: "D", at: 74, df: 78, te: 62, boss: true },
      { id: "cp_arc1", name: "Arciere delle Mura", role: "A", at: 70, df: 44, te: 62 },
      { id: "cp_arc2", name: "Arciere delle Mura", role: "A", at: 68, df: 44, te: 60 },
      { id: "cp_guar1", name: "Guardia del Fortino", role: "D", at: 62, df: 68, te: 56 },
      { id: "cp_port", name: "Portiere del Cancello", role: "P", at: 40, df: 72, te: 60 }
    ];
    function fin(how) {
      F.set("cp_c2_done", true); F.set("cp_c2_how", how);
      K.reward("cp_c2", { coins: how === "assalto" ? 110 : 90, cos: "cp_c2" });
      K.finishChapter(N, how === "assalto" ? "ok" : "ok");
      K.scene(H.flush().concat([["cp_dorotea", how === "assalto" ? "[felice] Le mura sono nostre e il Capitano ha l'elmo storto. Bella giornata." : "[pensa] Niente sangue e un registro in tasca. Se non fosse furto, lo chiamerei contabilità."], ["cp_ludovico", "[pensa] Registro: «una pagina ritrovata, un frate sospettato». ...Non guardatemi."], ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>💪 Grinta ${K.stat("grinta")} · 🎖️ Onore ${K.stat("onore")} · 🧠 Astuzia ${K.stat("astuzia")} · Compagnia ${K.crew.count()}/${K.crew.total}`], ["voce", "Il Capitolo 3 ti aspetta a est, oltre il Fortino."]]), () => K.openMain(), "cp_titolo");
    }
    function fight() {
      H.battle({ map: MURA, foes: FOES, turns: 14, title: "Le Mura di Roccafredda", units: K.tactics.team().concat([dorotea]) }, (r) => {
        if (r && r.win) {
          setStep(N, 3); K.bond("onore", 1); K.bond("grinta", 1);
          say("cp_aurelio", "[sorpreso] L'elmo. Il mio elmo è per terra. Nessuno l'ha mai visto per terra.");
          say("cp_dorotea", "[felice] Archi scarichi, cancello aperto e un elmo da lucidare. Ottima giornata.");
          fin("assalto");
        } else {
          say("cp_aurelio", "[freddo] Tornate quando avrete scale, o almeno una pausa pranzo.");
          done();
        }
      });
    }
    const talk = {
      cp_bruno() {
        if (K.rel.scene("cp_bruno")) return;
        const s = S();
        if (s === 0) {
          say("cp_bruno", "[serio] ...");
          say("cp_bruno", "Chi sei.");
          say("cp_ludovico", "[pensa] Nota: ha detto due parole. È un record.");
          K.learnLore("l_fortino"); quest("cp_c2", "La Strada del Marchese", "Convinci Bruno, poi cerca Gervasio il mercante.");
          const join = () => { K.crew.recruit("cp_bruno"); setStep(N, 1); say("voce", "Bruno il Muro si unisce alla Compagnia: difensore, resiste ai colpi e fa da riparo ai compagni."); done(); };
          ask("Bruno non dice altro. Come lo convinci?", [
            { label: "💪 «Stammi dietro e spacchiamo»", sub: "Grinta +1", fn: () => { K.bond("grinta", 1); say("cp_bruno", "[serio] ...Dietro."); say("cp_bruno", "Davanti. Io davanti."); join(); } },
            { label: "🎖️ «La Compagnia ha bisogno di un muro»", sub: "Onore +1", fn: () => { K.bond("onore", 1); say("cp_bruno", "[pensa] Muro. Mi piace."); join(); } },
            { label: "🪙 «Paga doppia, quando arriva»", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); say("cp_bruno", "[furbo] Quando."); say("cp_bruno", "...Va bene. Ma scrivilo."); join(); } }
          ]); return;
        }
        say("cp_bruno", s === 1 ? "Gervasio. Il carro. Ovest." : "Davanti. Sempre.");
        done();
      },
      cp_gervasio() {
        if (K.rel.scene("cp_gervasio")) return;
        const s = S();
        if (s === 1) {
          say("cp_gervasio", "[furbo] Mercenari! Il mio mestiere preferito: ho la merce, voi i debiti. Matematicamente, ci sposiamo.");
          say("cp_gervasio", "Il Fortino? Le mura sono alte, i cancelli chiusi. Ma c'è una grata nel fossato asciutto: dà sulla cantina. Si apre con un colpo sul terzo ferro. Non l'ho mai detto a nessuno. L'ho detto a voi. Ora lo sanno in due.");
          F.set("cp_grata", true); setStep(N, 2);
          quest("cp_c2b", "Il Fortino", "A est: assalto dal cancello (battaglia) o la grata del fossato (cantina).");
          return ask("Gervasio ti offre un favore.", [
            { label: "🍞 Compra pane", sub: "Ricevi una pagnotta", fn: () => { K.inv.give("cp_pagnotta"); say("cp_gervasio", "Pane da viaggio. Il primo morso è onesto, il secondo è un affare."); done(); } },
            { label: "🗣️ Chiedi notizie", fn: () => { K.learnLore("l_debito"); say("cp_gervasio", "[pensa] Il Marchese ha un registro dei debiti. La prima pagina manca. Dicono che l'abbia strappata un frate. O un topo con la tonaca."); done(); } },
            { label: "Niente", fn: done }
          ]);
        }
        say("cp_gervasio", s < 1 ? "Parla prima con il tipo silenzioso. Non ti darà fastidio: non parla." : "La grata: terzo ferro, un colpo, e poi finisci dentro. Non farti vedere dalle guardie. O fatti vedere: dipende dal tuo carattere.");
        done();
      },
      cp_aurelio() {
        if (K.rel.scene("cp_aurelio")) return;
        const s = S();
        if (s < 2) { say("cp_aurelio", "[freddo] Il Fortino è chiuso agli estranei, ai mercenari e a chi non conosce la parola d'ordine. Voi siete tutti e tre."); return done(); }
        if (s === 2) {
          say("cp_aurelio", "[freddo] La Compagnia del Pallone Spezzato. Il Gabelliere mi ha scritto: «hanno vinto per caso». Io non credo nel caso. Credo nelle mura.");
          return ask("Il Capitano Aurelio ti sbarra il cancello.", [
            { label: "⚔️ Assalto alle mura", sub: "Battaglia a griglia · hanno scudi e archi", big: true, cls: "hot", fn: () => fight() },
            { label: "👥 Schiera la Compagnia", sub: "Controlla chi combatte", fn: () => K.crew.pick(() => talk.cp_aurelio(), true) },
            { label: "↩ Non ancora", fn: done }
          ]);
        }
        say("cp_aurelio", "[freddo] Il cancello è aperto. Annoto: «ospitalità forzata». Mi fa male scriverlo."); done();
      },
      cp_ottavia() {
        if (K.rel.scene("cp_ottavia")) return;
        const s = S();
        if (s !== 2) { say("cp_ottavia", "[freddo] Archivio chiuso al pubblico. E ai privati. E, senza un appuntamento, anche a me."); return done(); }
        say("cp_ottavia", "[sorpreso] Una Compagnia in cantina. Ordine alfabetico: «C», dopo «Contabilità» e prima di «Cosa ci fate qui».");
        K.learnLore("l_debito");
        ask("Ottavia ti guarda sopra gli occhiali.", [
          { label: "🕯️ Chiedi il registro con garbo", sub: "Onore +1", fn: () => { K.bond("onore", 1); say("cp_ottavia", "[pensa] Garbo. Quando è stata l'ultima volta? Prendi. La prima pagina manca, ma c'è un'impronta di inchiostro: la grafia di un frate."); K.inv.give("cp_pagina"); fin("trattativa"); } },
          { label: "🧠 Scambia: il tuo silenzio per il registro", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); say("cp_ottavia", "[furbo] Silenzio contro un registro. Un affare in ordine. Prendi, e fa' finta di non avermi vista."); K.inv.give("cp_pagina"); fin("trattativa"); } },
          { label: "↩ Torni più tardi", fn: done }
        ]);
      }
    };
    const zones = {
      cp_strada: {
        region: "strada", name: "La Strada del Marchese", short: "Strada del Marchese", sub: "Un carro rotto, una cappella e il Fortino sullo sfondo", bg: "cp_strada", time: "giorno", w: 30, h: 22, base: ",", start: [1, 10],
        itemCos: "cp_c2", items: [[4, 8], [13, 17], [26, 7], [22, 13]],
        areas: [[8, 6, 16, 13, "Il carro rotto"], [20, 14, 27, 19, "Il bosco di faggi"], [0, 0, 29, 21, "La Strada del Marchese"]],
        act: { n: "Leggi il cartello", E: "Guarda lo stendardo", z: "Guarda le casse", b: "Siediti", s: "Riposa un momento", l: "Guarda il lampione" },
        flavor: { n: "Un cartello: «FORTINO DI ROCCAFREDDA · 2 miglia · OSPITALITÀ OBBLIGATORIA».", E: "Lo stendardo del Marchese: un leone che sembra molto sicuro di sé, e un po' stanco.", z: "Casse di un carovaniere. Dentro: sale, chiodi e una nota «non toccare, Gervasio»." },
        doors: { "0,10": { to: "cp_mulini", at: [28, 10] }, "0,11": { to: "cp_mulini", at: [28, 11] }, "29,10": { to: "cp_fortino", at: [1, 10] }, "29,11": { to: "cp_fortino", at: [1, 11] } },
        npcs: () => [{ id: "cp_bruno", at: [11, 9] }, { id: "cp_gervasio", at: [18, 12] }],
        intro: [["voce", "La Strada del Marchese, a est del Guado. Due miglia di polvere, un carro rotto e un cartello che fa il possibile per sembrare amichevole."], ["voce", "In fondo, tre torri: il Fortino di Roccafredda."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 10, 28, 11, ":"); lay(8, 6, 16, 13, "+"); lay(20, 14, 27, 19, "t"); lay(1, 15, 7, 19, "t"); lay(2, 1, 9, 4, "t"); lay(22, 1, 28, 5, "t");
          [[9, 7], [10, 12], [14, 8], [15, 12]].forEach(([x, y]) => put(x, y, "r"));
          put(12, 9, "z"); put(13, 9, "z"); put(26, 9, "n"); put(5, 10, "n"); [[6, 9], [24, 12]].forEach(([x, y]) => put(x, y, "b")); put(18, 14, "s");
          put(9, 9, "l"); put(24, 9, "l"); put(20, 9, "E"); put(21, 12, "E");
          house(4, 3, 6, 4, { door: [6, 6], roof: "#6b4a2a", wall: "#d8c8a8", enter: "La cappella: chiusa. Sulla porta, a gesso: «tornate quando avrete smesso di pregare per il prestito»." });
          house(18, 3, 5, 4, { door: [20, 6], roof: "#334155", wall: "#b8b0a0", enter: "Casa del daziere: serrata. Dalla finestra, un registro aperto e un caffè gelato." });
          put(0, 10, "q"); put(0, 11, "q"); put(29, 10, "q"); put(29, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "◂ MULINI", d.X(1) + 8, d.Y(9) - 6, "#fde68a"); H.plaque(g, "FORTINO ▸", d.X(27) + 8, d.Y(9) - 6, "#fca5a5"); H.plaque(g, "IL CARRO ROTTO", d.X(12) + 8, d.Y(6) - 6, "#fbbf24"); }
      },
      cp_fortino: {
        region: "fortino", name: "Il Fortino di Roccafredda", short: "Fortino", sub: "Tre torri, un fossato asciutto e un cancello molto ospitale", bg: "cp_fortino", time: "giorno", w: 30, h: 22, base: ",", start: [1, 10],
        itemCos: "cp_c2", items: [[3, 8], [26, 13], [14, 19]],
        areas: [[10, 3, 22, 9, "Le mura del Fortino"], [0, 14, 12, 20, "Il fossato asciutto"], [0, 0, 29, 21, "Il Fortino di Roccafredda"]],
        act: { n: "Leggi il cartello", E: "Guarda lo stendardo", z: "Guarda le casse", b: "Siediti", l: "Guarda la lanterna", K: "Guarda la rastrelliera" },
        flavor: { n: "Un cartello: «BENVENUTI AL FORTINO. NON ENTRARE. NON USCIRE. NON CHIEDERE».", E: "Lo stendardo del leone. Lo stendardo del leone, di nuovo. Il Marchese non ha molte idee.", z: "Casse di frecce: piene, vuote e una con scritto «non frecce»." , K: "Una rastrelliera con le alabarde in fila, tutte lucide. Nessuna ha mai colpito niente." },
        doors: { "0,10": { to: "cp_strada", at: [28, 10] }, "0,11": { to: "cp_strada", at: [28, 11] }, "4,16": { to: "cp_cantina", at: [7, 8], locked: () => (F.is("cp_grata") ? false : "Una grata nel fossato. È chiusa e non ha un'idea di chi tu sia.") }, "29,10": { to: "cp_convento", at: [1, 10], locked: () => (F.is("cp_c2_done") ? false : "Il cancello oltre le mura porta più a est. Prima, il Fortino: il Capitano non ti lascia passare.") }, "29,11": { to: "cp_convento", at: [1, 11], locked: () => (F.is("cp_c2_done") ? false : "Il cancello oltre le mura porta più a est. Prima, il Fortino: il Capitano non ti lascia passare.") } },
        npcs: () => [{ id: "cp_aurelio", at: [14, 10] }],
        intro: [["voce", "Il Fortino di Roccafredda: tre torri, un cancello e l'aria di chi ti guarda solo dopo averti già contato."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 10, 28, 11, ":"); lay(10, 5, 22, 8, "a"); lay(10, 9, 22, 9, "+"); lay(13, 9, 15, 11, ":"); lay(1, 14, 12, 20, "-");
          lay(2, 14, 12, 14, "f"); lay(2, 20, 12, 20, "f"); [[4, 16]].forEach(([x, y]) => put(x, y, "q"));
          [[10, 5], [22, 5], [10, 8], [22, 8]].forEach(([x, y]) => put(x, y, "y")); [[12, 9], [20, 9]].forEach(([x, y]) => put(x, y, "E"));
          put(8, 9, "n"); put(26, 9, "n"); [[4, 12], [24, 13]].forEach(([x, y]) => put(x, y, "b")); put(16, 12, "K"); put(17, 12, "K");
          put(24, 14, "l"); put(9, 9, "l"); lay(20, 14, 27, 19, "t"); put(21, 12, "z"); put(22, 12, "z");
          put(0, 10, "q"); put(0, 11, "q"); put(29, 10, "q"); put(29, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "FORTINO DI ROCCAFREDDA", d.X(16) + 8, d.Y(4) - 6, "#fca5a5"); H.plaque(g, "◂ STRADA", d.X(1) + 8, d.Y(9) - 6, "#fde68a"); H.plaque(g, "FOSSATO · GRATA", d.X(4) + 8, d.Y(15) - 6, "#9ca3af"); }
      },
      cp_cantina: {
        interior: true, region: "cantina", name: "La Cantina del Fortino", short: "Cantina", sub: "Scaffali, botti e un archivio in ordine alfabetico", bg: "cp_cantina", w: 14, h: 10, start: [7, 8], outside: ["cp_fortino", 4, 16],
        act: { u: "Guarda lo scaffale", C: "Guarda la botte", n: "Leggi l'etichetta", x: "Apri il baule", l: "Guarda la lanterna" },
        flavor: { u: "Scaffali di registri: «A» a sinistra, «Z» a destra, e in mezzo una zona grigia chiamata «Varie».", C: "Una botte di vino del Marchese: «Riserva dei Debitori». Il tappo è sempre stato girato al contrario.", n: "Un'etichetta: «PAGINE STRAPPATE: vedere sotto». Sotto non c'è niente." },
        loot: { "2,2": { id: "cp_pagnotta", text: "Dentro il baule: una pagnotta secca e un biglietto «per chi arriva tardi».", empty: "Il baule è vuoto. Ordinato, almeno." } },
        npcs: () => [{ id: "cp_ottavia", at: [7, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "="); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(2, 1, 5, 1, "u"); lay(9, 1, 12, 1, "u"); put(2, 2, "x"); put(11, 3, "C"); put(12, 3, "C"); put(12, 4, "C"); put(6, 1, "n"); put(8, 1, "l");
          lay(3, 6, 4, 6, "u"); lay(9, 6, 10, 6, "u");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ARCHIVIO · ORDINE ALFABETICO", d.X(7) + 8, d.Y(1) + 4, "#d8b4fe"); }
      }
    };
    return {
      n: N, title: "La Strada del Marchese", sub: "Un muro silenzioso, un mercante e un fortino ospitale",
      goal, start: "cp_strada", introBg: "cp_strada", zones, talk, obj: {},
      intro: [["voce", "Il Guado è libero, il Gabelliere sta ricontando i suoi errori e il Marchese ha deciso di prendersela con qualcun altro: voi."], ["voce", "A est, la Strada del Marchese. Dopo due miglia, un fortino con tre torri e nessuna voglia di vederti."]]
    };
  }
  boot();
})();
