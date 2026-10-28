// js/compagnia-c4.js - «LA COMPAGNIA DEL PALLONE SPEZZATO» · Capitolo 4: Il Campo Grande
// Roccafredda, il Notaio Cesare, il Marchese Ottone, la battaglia finale sul Campo Grande e tre finali (bandiera, ventura, il pallone spezzato).
(function () {
  "use strict";
  function boot() {
    const E = window.__compagniaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__compagniaH || !window.__tattica) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  const CAMPO = {
    name: "Il Campo Grande",
    rows: ["f...h...f", "..f...f..", ".h.....h.", "....#....", ".h.....h.", "..f...f..", "f...h...f"],
    ps: [[0, 2], [0, 3], [0, 4], [1, 3], [1, 1]], es: [[9, 2], [9, 3], [9, 4], [8, 3], [8, 1]]
  };
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__compagniaH(K), { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    H.cast("cp_cesare", "Notaio Cesare", "Notaio del Marchese", { style: "short", hair: "#44403c", shirt: "#1e293b", skin: "#e0b890", acc: ["occhiali"], bg: ["#0f172a", "#cbd5e1"] }, "Arriva sempre in ritardo ai propri atti. Dice che il ritardo è parte della procedura.");
    H.cast("cp_ottone", "Marchese Ottone", "Marchese di Roccafredda", { style: "short", hair: "#e5e7eb", beard: "baffi", shirt: "#7c2d12", skin: "#d9a679", bg: ["#450a0a", "#fcd34d"] }, "Vedovo, collezionista di debiti e di orologi fermi. Non è cattivo: è solo molto puntuale con il dolore.");
    K.cos("cp_c4", { kind: "shirt", label: "Mantello del Campo Grande", val: "#9a3412", from: "Finale de La Compagnia del Pallone Spezzato" });
    K.lore("l_campo_grande", { t: "Il Campo Grande", d: "Il campo più vecchio di Spezzaterra: otto tribune, un prato che non cresce e una sola regola, scritta sul cancello. «Chi perde paga. Chi vince decide.»" });

    const goal = (s) => ({
      0: "A Roccafredda: Sandro Due Dita, il portiere, sta controllando una cosa.",
      1: "Cerca il Notaio Cesare, in piazza: ti serve un'udienza.",
      2: "Nella sala del Marchese Ottone, in fondo alla piazza.",
      3: "Parla con il Marchese: decidi come finisce."
    }[s] || "La storia è conclusa.");

    const dorotea = { id: "cp_dorotea", name: "Capitana Dorotea", role: "D", at: 70, df: 76, te: 68, saga: "compagnia", col: "#7f1d1d" };
    const FOES = [
      { id: "cp_ottone", name: "Marchese Ottone", role: "D", at: 80, df: 82, te: 66, boss: true },
      { id: "cp_brando", name: "Brando il Gabelliere", role: "D", at: 74, df: 76, te: 62 },
      { id: "cp_alab1", name: "Alabardiere", role: "D", at: 66, df: 72, te: 58 },
      { id: "cp_alab2", name: "Alabardiere", role: "D", at: 64, df: 70, te: 58 },
      { id: "cp_bal3", name: "Balestriere Reale", role: "A", at: 72, df: 48, te: 64 }
    ];
    const ENDS = {
      bandiera: { title: "Il Pallone Intero", coins: 200, lines: [["cp_ottone", "[triste] Una bandiera. Non so cosa farmene, ma è meglio di un debito."], ["cp_dorotea", "[felice] La Compagnia non è più dei mercenari: è di tutti. Ludovico, scrivilo."], ["cp_ludovico", "[felice] Registro: «un pallone intero, finalmente». Posso smettere di contare."], ["voce", "Finale <b>«Il Pallone Intero»</b>. Spezzaterra riunita sotto una bandiera con un pallone senza crepe."]] },
      ventura: { title: "La Compagnia di Ventura", coins: 260, lines: [["cp_ottone", "[sorpreso] Un contratto. Paga ricca, nessuna bandiera. Siete migliori di me, nell'arte di non appartenere."], ["cp_fiamma", "[furbo] Una paga che arriva in anticipo. Dovrei commuovermi."], ["cp_dorotea", "[pensa] Libera, ricca e senza nome. Peggio di una bandiera e meglio di un debito."], ["voce", "Finale <b>«La Compagnia di Ventura»</b>. Ognuno si porta via il proprio pezzo di pallone e la propria strada."]] },
      spezzato: { title: "Il Pallone Spezzato", coins: 300, lines: [["cp_ludovico", "[commosso] La prima riga del registro. Era mia, è di tutti: «chi cade, ricade con gli altri»."], ["cp_ottone", "[triste] Mia moglie aveva scritto quel proverbio sul mio orologio. L'ho lasciato fermo per undici anni."], ["cp_dorotea", "[felice] Un pallone spezzato che torna a rotolare. Non per forza intero. Rotola."], ["voce", "Finale segreto <b>«Il Pallone Spezzato»</b>. La verità cambia chi sei: nessuno paga più, tutti ricominciano."]] }
    };
    function ending(id) {
      const E2 = ENDS[id];
      K.reward("cp_c4" + id, { coins: E2.coins, cos: "cp_c4" });
      setStep(N, 4); K.finishChapter(N, id); K.end(id);
      K.scene(E2.lines.concat([["voce", `<b>FINE.</b> Hai chiuso «La Compagnia del Pallone Spezzato» con il finale «${E2.title}».<br>💪 Grinta ${K.stat("grinta")} · 🎖️ Onore ${K.stat("onore")} · 🧠 Astuzia ${K.stat("astuzia")} · Compagnia ${K.crew.count()}/${K.crew.total}`]]), () => K.openMain(), "cp_titolo");
    }
    function choose() {
      const on = K.stat("onore"), as = K.stat("astuzia"), full = K.crew.count() >= K.crew.total && on >= 3 && as >= 3 && K.inv.has("cp_pagina");
      ask("Il Marchese Ottone ha perso. Ora decidi tu.", [
        { label: "🚩 La Bandiera", sub: on > as ? "La Compagnia diventa un esercito di tutti" : `Serve Onore più alto di Astuzia (ora ${on} e ${as})`, big: true, cls: "hot", disabled: !(on > as), fn: () => ending("bandiera") },
        { label: "🪙 La Ventura", sub: as >= on ? "Paga ricca, nessuna bandiera" : `Serve Astuzia almeno pari all'Onore (ora ${as} e ${on})`, disabled: !(as >= on), fn: () => ending("ventura") },
        { label: "📜 Il Pallone Spezzato", sub: full ? "Segreto: tutta la Compagnia, Onore e Astuzia 3, la pagina" : "Segreto: tutta la Compagnia, Onore e Astuzia 3 o più, e la pagina d'archivio", big: true, disabled: !full, fn: () => ending("spezzato") }
      ]);
    }
    function fight() {
      H.battle({ map: CAMPO, foes: FOES, turns: 16, title: "Il Campo Grande", units: K.tactics.team().concat([dorotea]) }, (r) => {
        if (r && r.win) {
          setStep(N, 3); K.bond("onore", 1); K.bond("astuzia", 1);
          say("cp_ottone", "[triste] «Chi vince decide». L'ho scritto io, quel cancello. Non avevo previsto di dover obbedire.");
          choose();
        } else {
          say("cp_ottone", "[freddo] Tornate con una squadra migliore. Il campo non scappa.");
          done();
        }
      });
    }
    const talk = {
      cp_sandro() {
        if (K.rel.scene("cp_sandro")) return;
        const s = S();
        if (s === 0) {
          say("cp_sandro", "[serio] Fermo. Mani. ...Ancora dieci dita. Le mie sono otto, ma ho un bersaglio da controllare.");
          say("cp_sandro", "Il Marchese ha un campo, il Campo Grande. Porte regolamentari, pali d'acciaio. Sono due anni che non vedo una porta del genere. Se mi portate, la difendo.");
          K.learnLore("l_campo_grande");
          const join = () => { K.crew.recruit("cp_sandro"); setStep(N, 1); quest("cp_c4", "Il Campo Grande", "Cerca il Notaio Cesare, in piazza."); say("voce", "Sandro Due Dita si unisce alla Compagnia: portiere, nessun gol gli passa se resta in porta."); done(); };
          return ask("Sandro ti guarda le mani.", [
            { label: "🧤 «Sei il nostro portiere»", sub: "Onore +1", fn: () => { K.bond("onore", 1); say("cp_sandro", "[serio] Dichiarato. Mi servono guanti nuovi."); join(); } },
            { label: "🥅 «Hai visto le porte del Campo Grande?»", sub: "Astuzia +1", fn: () => { K.bond("astuzia", 1); say("cp_sandro", "[furbo] Pali d'acciaio. Va bene, vengo. Ma a una condizione: voglio ispezionarle io."); join(); } },
            { label: "💪 «Ti serve solo un motivo per muoverti»", sub: "Grinta +1", fn: () => { K.bond("grinta", 1); say("cp_sandro", "Il motivo c'è: la paga. Il resto è un dettaglio."); join(); } }
          ]);
        }
        say("cp_sandro", "Ho controllato la porta. È regolamentare. Mi inquieta."); done();
      },
      cp_cesare() {
        if (K.rel.scene("cp_cesare")) return;
        const s = S();
        if (s === 1) {
          say("cp_cesare", "[freddo] Notaio Cesare. Arrivo sempre in ritardo ai miei atti: fa parte della procedura. Voi siete in anticipo di quattro capitoli.");
          say("cp_cesare", "Per l'udienza con il Marchese serve una pagina del registro, un testimone e una penna. Vedo la pagina, vedo i testimoni, vedo la penna di Ludovico. Procedete.");
          setStep(N, 2); quest("cp_c4b", "L'udienza", "Entra nella sala del Marchese Ottone, in fondo alla piazza.");
          say("voce", "Il notaio ti lascia passare. La sala del Marchese è a nord.");
          return done();
        }
        say("cp_cesare", s < 1 ? "L'ufficio è chiuso. A meno che non siate un debitore." : "Il Marchese aspetta. Io, probabilmente, arriverò dopo."); done();
      },
      cp_ottone() {
        if (K.rel.scene("cp_ottone")) return;
        const s = S();
        if (s === 2) {
          say("cp_ottone", "[serio] Compagnia del Pallone Spezzato. Ho letto il registro: undici anni di rate, un frate con la grafia bella e una pagina che ritorna dopo undici anni. Dovrei commuovermi. Non lo so fare.");
          say("cp_ottone", "Il Campo Grande ha una sola regola, scritta sul cancello: «chi perde paga, chi vince decide». Giochiamo. Se vincete, decidete voi come finisce.");
          return ask("Il Marchese ti sfida sul Campo Grande.", [
            { label: "⚔️ Accetta la sfida", sub: "Battaglia finale a griglia · il Marchese e la sua guardia", big: true, cls: "hot", fn: () => fight() },
            { label: "👥 Schiera la Compagnia", sub: "Controlla chi combatte", fn: () => K.crew.pick(() => talk.cp_ottone(), true) },
            { label: "↩ Non ancora", fn: done }
          ]);
        }
        if (s === 3) { say("cp_ottone", "[triste] Il campo ha parlato. Decidi."); return choose(); }
        say("cp_ottone", s < 2 ? "[freddo] Prima l'udienza con il notaio. Io non ricevo senza carta." : "Il Campo Grande è sempre qui."); done();
      }
    };
    const zones = {
      cp_roccafredda: {
        region: "citta", name: "Roccafredda", short: "Roccafredda", sub: "Una piazza d'orologi fermi e il palazzo del Marchese", bg: "cp_roccafredda", time: "giorno", w: 30, h: 22, base: ",", start: [1, 10],
        itemCos: "cp_c4", items: [[3, 8], [26, 8], [14, 18], [24, 13]],
        areas: [[8, 6, 21, 13, "La piazza degli orologi"], [10, 1, 19, 4, "Il palazzo del Marchese"], [0, 0, 29, 21, "Roccafredda"]],
        act: { H: "Guarda la fontana", n: "Leggi il cartello", E: "Guarda lo stendardo", z: "Guarda le casse", b: "Siediti", s: "Riposa un momento", l: "Guarda il lampione", u: "Guarda la bancarella" },
        flavor: { H: "Una fontana senza acqua: un orologio di pietra al centro, fermo alle sei e sette.", n: "Un cartello: «ROCCAFREDDA · PUNTUALI AL DOLORE».", E: "Lo stendardo del leone, con l'orologio fermo ricamato sul petto.", z: "Casse di orologi smontati. Ogni lancetta ha un'etichetta con il nome di un debitore.", u: "Una bancarella di orologi: tutti fermi. Il banchista dice che è il prezzo giusto." },
        doors: { "0,10": { to: "cp_convento", at: [28, 10] }, "0,11": { to: "cp_convento", at: [28, 11] } },
        npcs: () => [{ id: "cp_sandro", at: [6, 12] }, { id: "cp_cesare", at: [15, 9] }],
        intro: [["voce", "Roccafredda: una piazza d'orologi fermi, un palazzo con il leone e un Marchese che non guarda mai l'ora."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "t"); lay(0, 21, 29, 21, "t"); lay(0, 0, 0, 21, "t"); lay(29, 0, 29, 21, "t");
          lay(1, 10, 28, 11, ":"); lay(8, 6, 21, 13, "+"); lay(1, 14, 7, 19, "t"); lay(22, 14, 28, 19, "t"); lay(1, 1, 8, 4, "t"); lay(21, 1, 28, 5, "t");
          put(14, 9, "H"); [[10, 8], [19, 12]].forEach(([x, y]) => put(x, y, "b")); put(11, 12, "s"); put(9, 7, "u"); put(20, 7, "u"); [[9, 9], [19, 9], [14, 12]].forEach(([x, y]) => put(x, y, "l"));
          put(26, 9, "n"); put(5, 9, "n"); put(8, 12, "E"); put(21, 12, "E"); put(23, 12, "z"); put(24, 12, "z"); [[4, 15], [8, 16]].forEach(([x, y]) => put(x, y, "r"));
          house(10, 1, 10, 5, { door: [14, 5], roof: "#7f1d1d", wall: "#e0d0b0", chimney: true, enter: { to: "cp_sala", at: [8, 9] } });
          put(0, 10, "q"); put(0, 11, "q");
        },
        decor(g, cx, cy, d) { H.plaque(g, "PALAZZO DEL MARCHESE", d.X(14) + 8, d.Y(1) - 6, "#fca5a5"); H.plaque(g, "◂ CONVENTO", d.X(1) + 8, d.Y(9) - 6, "#d6d3d1"); H.plaque(g, "PUNTUALI AL DOLORE", d.X(14) + 8, d.Y(7) - 6, "#fde68a"); }
      },
      cp_sala: {
        interior: true, region: "sala", name: "La Sala del Marchese", short: "Sala", sub: "Orologi fermi, un trono e un campo disegnato sul pavimento", bg: "cp_sala", w: 16, h: 11, start: [8, 9], outside: ["cp_roccafredda", 14, 6],
        act: { u: "Guarda la parete", C: "Guarda l'orologio", n: "Leggi il registro", x: "Apri la cassa", l: "Guarda il lampadario" },
        flavor: { u: "Una parete d'orologi, tutti fermi alle sei e sette. Sotto, una targa: «Quel giorno».", C: "Un orologio a pendolo. Il pendolo è legato con un nastro nero.", n: "Un registro dei debiti: la prima riga è nuova, scritta ieri. Con una grafia diversa dalle altre." },
        loot: { "2,2": { id: "cp_spilla", text: "Nella cassa, sotto un orologio rotto: una spilla con un pallone crepato. Come quella della Compagnia. Ma più vecchia.", empty: "La cassa è vuota. Anche i rimpianti hanno un limite." } },
        npcs: () => [{ id: "cp_ottone", at: [8, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "="); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(2, 1, 6, 1, "u"); lay(10, 1, 13, 1, "u"); put(2, 2, "x"); put(13, 3, "C"); put(14, 3, "C"); put(14, 4, "C"); put(7, 1, "n"); put(9, 1, "l");
          lay(3, 6, 5, 6, "u"); lay(10, 6, 12, 6, "u");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA DEL MARCHESE", d.X(8) + 8, d.Y(1) + 4, "#fca5a5"); }
      }
    };
    return {
      n: N, title: "Il Campo Grande", sub: "Un Marchese, un orologio fermo e una sola regola",
      goal, start: "cp_roccafredda", introBg: "cp_roccafredda", zones, talk, obj: {},
      intro: [["voce", "Il convento è alle spalle. A est, Roccafredda: una piazza d'orologi fermi, un palazzo con il leone e un campo su cui si decide tutto."]]
    };
  }
  boot();
})();
