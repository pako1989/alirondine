// js/vuota-c1.js - «OPERAZIONE SCATOLA VUOTA» · Capitolo 1: Sbarco a Capo Silenzio
// Molo del villaggio (briefing, radio, addestramento con la scatola), capanna di Ghiro (interno a mano), scogliera con pattuglie e cancello presidiato da Corvo.
(function () {
  "use strict";
  function boot() {
    const E = window.__vuotaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const H = window.__vuotaH, { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };
    H.cast(K);
    K.cos("vs_c1", { kind: "shirt", label: "Giacca di Squadra Nove", val: "#374151", from: "Capitolo 1 di Operazione Scatola Vuota" });
    K.lore("l_capo", { t: "Capo Silenzio", d: "Un'isola con un faro, un villaggio di pescatori e, sul lato nord, il Bastione Nove: una fortezza di cemento che nessun pescatore nomina volentieri." });
    K.lore("l_aironi", { t: "Gli Aironi", d: "La nazionale che dodici anni fa perse la finale della Coppa dei Continenti in modo che molti, ancora oggi, definiscono «strano»." });

    const goal = (s) => ({
      0: "Parla con Ottone, in fondo al molo.",
      1: "Usa la radio (J) accanto alle casse e ascolta Vulpe.",
      2: "Allenati con Mira, vicino alle casse: due livelli di Infiltrazione.",
      3: "Attraversa la scogliera a est senza farti vedere e raggiungi il cancello del Bastione.",
      4: "Il cancello: parla con Corvo."
    }[s] || "Il capitolo 1 è concluso. Il Bastione ti aspetta.");

    const train = (levels, after) => K.infiltra(levels, (r) => {
      if (r.win) return after();
      K.say([["vs_mira", "Scoperto. Succede. Ricomincia: la scatola non giudica, ma si ricorda."]], K.done);
    });
    function fin(how) {
      F.set("vs_c1_done", true);
      if (K.alert.get() === 0) K.bond("silenzio", 1);
      K.reward("vs_c1", { coins: 70, cos: "vs_c1" });
      K.finishChapter(N, how || "ok");
      K.scene([["voce", "Il cancello si chiude alle tue spalle senza un rumore. Dentro, il Bastione sembra più grande."], ["vs_vulpe", "[pensa] Ti vedo sul radar, o meglio vedo un puntino che cammina bene. Il resto lo fa la tua testa."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> Silenzio ${K.stat("silenzio")} · Fiducia ${K.stat("fiducia")} · Scatole ${K.stat("scatole")}.`], ["voce", "Il Capitolo 2, «Le Luci del Bastione», ti aspetta."]], () => K.openMain(), "vs_bastione");
    }
    const talk = {
      vs_ottone() {
        if (K.rel.scene("vs_ottone")) return;
        if (S() === 0) {
          say("vs_ottone", "[felice] Eccoti. Ho preparato un discorso. Dura tre ore. Te lo risparmio: ti serve solo una parola. Cartone.");
          say("vs_ottone", "Questa è un'isola di pescatori, e sopra c'è una base che non vuole ospiti. Dodici anni fa una finale è stata truccata. Il Rapporto Zero, la prova, è là dentro.");
          say("vs_ottone", "Noi siamo Squadra Nove: io, Vulpe in radio, Mira per le cose con le viti, e tu. Non facciamo rumore. Facciamo scatole.");
          K.learnLore("l_capo"); K.learnLore("l_aironi"); setStep(N, 1); K.inv.give("vs_scatola");
          quest("vs_c1", "Il Bastione", "Parla con Vulpe via radio (tessera J), poi allenati con Mira.");
          return ask("Ottone ti porge un cartone piegato con cura.", [
            { label: "Prendi la scatola", sub: "Menu zona → «Infilati nella scatola»", big: true, cls: "hot", fn: () => { say("vs_ottone", "Menu, scatola, otto secondi: la guardia vede una scatola e pensa a una scatola. È la sua rovina."); K.bond("fiducia", 1); done(); } },
            { label: "«Una scatola? Seriamente?»", sub: "Ottone si offende (poco)", fn: () => { say("vs_ottone", "[arrabbiato] Seriamente! Ha salvato più vite di un'assicurazione. Prova prima di ridere."); done(); } }
          ]);
        }
        say("vs_ottone", S() < 4 ? "Allenati e ascolta la radio. Non siamo qui in gita: siamo qui in punta di piedi." : "Dall'altra parte del cancello conta ogni respiro. Non ti dico altro: non voglio portare male."); done();
      },
      vs_mira() {
        if (K.rel.scene("vs_mira")) return;
        if (S() === 2) {
          say("vs_mira", "Allenamento. Una griglia, due guardie finte, niente conseguenze vere. Ti insegno a ragionare a turni: ogni tua mossa muove loro.");
          return ask("Mira apre una cassa. Dentro, una lavagna con una griglia a quadri.", [
            { label: "Inizia l'allenamento", sub: "Infiltrazione, livelli 1 e 2", big: true, cls: "hot", fn: () => { QL = []; train([1, 2], () => { say("vs_mira", "[felice] Due su due. Non è fortuna: è pazienza con le ginocchia."); K.bond("fiducia", 1); K.bond("scatole", 1); setStep(N, 3); quest("vs_c1b", "La scogliera", "Attraversa la scogliera a est e raggiungi il cancello."); say("voce", "Ottieni +1 Scatola. Ora la scogliera: a est del molo."); done(); }); } },
            { label: "Prima una domanda", fn: () => { say("vs_mira", "Domanda semplice: se una guardia ti vede, cosa succede? Ti rimanda indietro. Se continua, il Sospetto sale e tutto diventa più largo."); done(); } }
          ]);
        }
        say("vs_mira", S() < 2 ? "Ti spiego tutto quando Vulpe ha finito di parlare. Lei parla sempre di più." : "Il Sospetto sale a ogni avvistamento e scende cambiando zona. Cambiare zona, quindi, è un'arte. Ripassa pure la griglia quando vuoi: Prova libera, nel Salone dei Giochi.");
        ask("Mira ti studia con occhio da portiere.", [
          { label: "Ripassi un livello", sub: "Infiltrazione, livello 1", fn: () => { QL = []; K.infiltra([1], () => done()); } },
          { label: "Le offri una razione", sub: "Se ne hai una", fn: () => { if (!K.inv.has("vs_razione")) { say("voce", "Non hai razioni."); return done(); } K.inv.take("vs_razione"); K.rel.add("vs_mira", 4, true); say("vs_mira", "[felice] Fagioli. Il mio gusto preferito: sono neutri."); done(); } },
          { label: "Torni al lavoro", fn: K.done }
        ]);
      },
      vs_ghiro() {
        if (K.rel.scene("vs_ghiro")) return;
        if (!F.is("vs_ghiro_c")) {
          F.set("vs_ghiro_c", true); K.inv.give("vs_razione");
          say("vs_ghiro", "[pensa] ...mh? Ah, voi della squadra. Il faro ha un giro, la scogliera ha due pattuglie, e il cancello ha Corvo. Corvo sente tutto. Anche quello che non fai.");
          say("vs_ghiro", "Prendi. È una razione. Io ne ho tre e dormo male: dormirei meglio con due.");
          say("voce", "Ottieni una Razione di campo (regalo per Mira o Ghiro).");
          return done();
        }
        say("vs_ghiro", "[pensa] Zzz... ah, sei tu. Ricorda: ascolta le tazze, non il mare. Il mare è bugiardo."); done();
      },
      vs_nena() {
        say("vs_nena", "[felice] Un caffè? Qui il caffè arriva sempre, anche quando non lo chiedi. Come le guardie.");
        if (!F.is("vs_nena_c")) { F.set("vs_nena_c", true); say("vs_nena", "Al Bastione si sta zitti per regolamento. I pescatori dicono: «Capo Silenzio» perché non si sente nemmeno il mare. Io dico che il mare ci prova."); K.rel.add("vs_nena", 2, true); }
        done();
      },
      vs_guardia() { say("vs_guardia", "[serio] Circolare. Qui non c'è niente da vedere. Neanche me, in effetti."); done(); },
      vs_corvo() {
        const s = S();
        if (s < 3) { say("vs_corvo", "Via di qui."); return done(); }
        if (F.is("vs_c1_done")) { say("vs_corvo", "Non ci siamo visti."); return done(); }
        say("vs_corvo", "[serio] Un'ombra con le scarpe. Se ti ci sai muovere come una, la lascio stare. Se no, ti riaccompagno al molo.");
        say("vs_corvo", "Sapevo che sarebbe arrivato qualcuno. Sapevo anche che non sarebbe stato uno di noi.");
        ask("Corvo, di spalle, parla senza voltarsi.", [
          { label: "Provi ad aggirarlo (Infiltrazione, livello 3)", sub: "Con 2 scatole di prova", big: true, cls: "hot", fn: () => { QL = []; K.infiltra([3], (r) => { if (r.win) { say("vs_corvo", "[pensa] Non ho sentito niente. Ah, no: ho sentito la scatola. Per quel poco che vale, brava."); K.rel.add("vs_corvo", 4, true); K.bond("silenzio", 1); fin("ok"); } else { say("vs_corvo", "Riprova. Il cancello non scappa."); done(); } }); } },
          { label: "Gli mostri la foto degli Aironi", sub: "Se ce l'hai", fn: () => { if (!K.inv.has("vs_foto")) { say("voce", "Non hai nessuna foto."); return done(); } K.inv.take("vs_foto"); K.rel.add("vs_corvo", 8, true); K.bond("fiducia", 1); say("vs_corvo", "[triste] ...Dove l'hai trovata. Passa. Non dirlo a nessuno che sono stato io a lasciarti passare."); fin("foto"); } },
          { label: "Parli con lui", sub: "Rapporto +2", fn: () => { K.rel.add("vs_corvo", 3, true); say("vs_corvo", "Ho ricevuto un ordine. Ho eseguito. Mi hanno insegnato che è l'unico modo per non pensare."); done(); } }
        ]);
      }
    };
    const zones = {
      vs_molo: {
        region: "costa", name: "Capo Silenzio · Il Molo", short: "Molo", sub: "Il villaggio, le casse e un faro che non dorme", bg: "vs_costa", time: "sera", w: 32, h: 22, base: "k", start: [3, 12],
        itemCos: "vs_c1", items: [[2, 9], [28, 14], [16, 15]],
        areas: [[0, 0, 31, 21, "Il villaggio di Capo Silenzio, sotto il faro del Bastione"]],
        npcs: () => [{ id: "vs_ottone", at: [8, 18] }, { id: "vs_mira", at: [20, 12] }, { id: "vs_nena", at: [6, 12] }],
        objects: {
          "5,13": () => {
            if (S() === 1) {
              say("vs_vulpe", "[felice] ...ci sei? Bene. Brevemente, perché la batteria si offende: il Bastione ha tre aree. Cortile, officine, archivio. Il Rapporto Zero è nell'archivio, in una cassaforte che chiama «Lastra».");
              say("vs_vulpe", "Quattro ex Aironi lavorano là dentro: Corvo, Brace, Lastra, Eco. Erano compagni di Ottone. Non ti dirò altro: se mi sbaglio, voglio sbagliare da sola.");
              say("vs_vulpe", "Regola uno: ogni avvistamento alza il Sospetto. Regola due: cambiare zona lo abbassa. Regola tre: la scatola dura poco. Regola quattro: non c'è la quattro, ma suona bene.");
              setStep(N, 2); quest("vs_c1a", "Allenamento", "Parla con Mira, vicino alle casse.");
              return done();
            }
            say("vs_vulpe", S() < 1 ? "[pensa] Un attimo... parla prima con Ottone." : "[felice] Ti ascolto. Sei ancora vivo, quindi tutto bene. Ricordati: i coni sono più larghi quando il Sospetto è alto."); done();
          }
        },
        doors: { "31,12": { to: "vs_scogliera", at: [1, 17], locked: () => (S() < 3 ? "Il sentiero per la scogliera c'è, ma Ottone ti ferma: «Prima allenati con Mira.»" : false) } },
        loot: { "13,15": { id: "vs_pallone", text: "Dietro una barca capovolta: un pallone scucito. Dentro, qualcosa fa «tic».", empty: "Dietro la barca c'è solo sabbia e un ricordo di pallone." } },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 17, 31, 21, "~"); lay(5, 16, 9, 21, "r"); lay(0, 15, 31, 16, "e"); lay(0, 0, 31, 1, "A"); lay(0, 0, 0, 21, "A"); lay(1, 2, 3, 8, "A");
          lay(12, 15, 18, 16, "e"); lay(4, 2, 30, 6, "g"); lay(1, 8, 3, 10, "g"); lay(1, 11, 30, 13, "k"); lay(28, 10, 31, 14, "u"); put(31, 12, "q");
          house(5, 3, 7, 5, { door: [8, 7], roof: "#9b2a2a", enter: { room: "locanda", name: "Il Bar di Nena", who: ["vs_nena"] } });
          house(14, 4, 6, 4, { door: [16, 7], roof: "#3a5a8a", enter: { to: "vs_capanna", at: [8, 10] } });
          house(23, 3, 6, 5, { door: [25, 7], roof: "#6a4a2a", enter: "La casa di un pescatore: finestre chiuse, rete stesa, un gatto che finge di non vederti." });
          lay(18, 9, 22, 10, "k"); [[17, 14], [18, 14], [19, 14], [27, 9]].forEach(([x, y]) => put(x, y, "K")); put(5, 13, "J");
          lay(21, 13, 24, 14, "K"); [[10, 12], [11, 12], [24, 11], [10, 10]].forEach(([x, y]) => put(x, y, "x"));
          lay(14, 14, 17, 14, "F"); [[3, 14], [27, 15], [20, 15]].forEach(([x, y]) => put(x, y, "E")); put(2, 12, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "BAR DI NENA", d.X(8) + 8, d.Y(3) - 4, "#f87171"); H.plaque(g, "GHIRO", d.X(17) + 8, d.Y(4) - 4, "#60a5fa"); H.plaque(g, "SENTIERO ▸ FARO", d.X(30) - 8, d.Y(10) + 4, "#facc15"); H.plaque(g, "MOLO", d.X(7) + 8, d.Y(15) + 6, "#fbbf24"); },
        intro: [["voce", "Capo Silenzio, tramonto. Il villaggio ha dodici case, un bar e una scatola di cartone che ti guarda."], ["voce", "In alto, sul lato nord, il faro del Bastione ruota con calma. Non ti ha ancora notato."]]
      },
      vs_capanna: {
        interior: true, region: "capanna", name: "Capo Silenzio · La capanna di Ghiro", short: "Capanna", sub: "Reti, una branda e un uomo che dorme in piedi", bg: "vs_costa", w: 16, h: 12, start: [8, 10], outside: ["vs_molo", 16, 8],
        act: { s: "Siediti un momento" },
        npcs: () => [{ id: "vs_ghiro", at: [5, 5] }],
        loot: { "13,3": { id: "vs_razione", text: "In una cassetta sotto la finestra: una razione di campo ancora sigillata.", empty: "La cassetta è vuota. Resta l'odore di fagioli." } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "r"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          lay(1, 2, 3, 2, "A"); lay(11, 2, 14, 2, "K"); put(13, 3, "K"); put(2, 8, "s"); put(3, 8, "s"); put(12, 8, "E"); put(11, 5, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "GHIRO · PESCA E SONNO", d.X(8) + 8, d.Y(1) + 6, "#60a5fa"); }
      },
      vs_scogliera: {
        region: "costa", name: "Capo Silenzio · La Scogliera", short: "Scogliera", sub: "Un sentiero a zig-zag sopra il mare, due pattuglie e un cancello", bg: "vs_costa", time: "sera", w: 30, h: 22, base: "A", start: [2, 17], sneakStart: [2, 17],
        items: [[3, 19], [27, 9]], hide: "x",
        areas: [[1, 15, 12, 19, "La spiaggia di sassi"], [9, 9, 20, 12, "Il traverso"], [17, 4, 28, 7, "Il cancello"], [0, 0, 29, 21, "La scogliera di Capo Silenzio"]],
        npcs: (s) => [H.guard([[4, 17], [10, 17]], { speed: 0.5 }), H.guard([[10, 18], [10, 11]], { speed: 0.5 }), H.post([18, 9], "right", { turn: 150 }), H.guard([[18, 10], [18, 6]], { speed: 0.5 }), H.post([27, 6], "left", { turn: 190, range: 3 }), { id: "vs_corvo", at: [27, 4] }].concat(K.alert.get() >= 2 ? [H.guard([[2, 19], [8, 19]], { speed: 0.6 })] : []),
        doors: { "0,17": { to: "vs_molo", at: [30, 12] }, "29,5": { to: "vs_cortile", at: [2, 17], locked: () => (F.is("vs_c1_done") ? false : "Il cancello è chiuso. Per adesso. Parla con Corvo.") } },
        flavor: { u: "Sassi e ghiaia: ogni passo suona come un dente rotto." },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 21, "A"); lay(1, 15, 12, 20, "e"); lay(9, 9, 12, 20, "u"); lay(9, 9, 20, 12, "u"); lay(17, 4, 20, 12, "u"); lay(17, 4, 28, 7, "u"); lay(24, 2, 28, 9, "u");
          lay(0, 20, 5, 21, "~"); lay(29, 2, 29, 9, "F"); put(29, 5, "q"); put(0, 17, "q"); lay(26, 1, 28, 1, "F");
          [[8, 16], [8, 19], [12, 14], [10, 10], [19, 8], [19, 5], [23, 6]].forEach(([x, y]) => put(x, y, "x")); [[5, 16], [3, 15], [11, 17], [14, 10], [22, 8]].forEach(([x, y]) => put(x, y, "K")); [[24, 3], [25, 9]].forEach(([x, y]) => put(x, y, "Q"));
          put(3, 17, "E"); put(26, 8, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ATTENZIONE · FARO", d.X(10) + 8, d.Y(9) - 4, "#facc15"); H.plaque(g, "BASTIONE NOVE", d.X(26) + 8, d.Y(2) - 2, "#f87171"); H.plaque(g, "SILENZIO", d.X(3) + 8, d.Y(15) - 4, "#94a3b8"); },
        intro: [["voce", "La scogliera. Un sentiero che si inerpica a gradini, due pattuglie e, in cima, un cancello."], ["voce", "Menu zona → «Infilati nella scatola» ti rende invisibile per qualche secondo. Le scatole x sul terreno sono nascondigli fissi."]]
      }
    };
    return {
      n: N, title: "Sbarco a Capo Silenzio", sub: "Un molo, una scatola e una scogliera piena di guardie",
      goal, start: "vs_molo", introBg: "vs_titolo", zones, talk, obj: {},
      intro: [["voce", "Capo Silenzio, una sera d'autunno. Il traghetto vi ha lasciati a duecento metri dal molo."], ["voce", "Ottone ha una scatola sotto il braccio. Dice che è tutto ciò che serve."]]
    };
  }
  boot();
})();
