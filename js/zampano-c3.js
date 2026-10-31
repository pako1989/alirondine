// js/zampano-c3.js - «IL CIRCO ZAMPANÒ» · Capitolo 3: Sotto la Cupola
// Dietro il tendone il Barone Orloff presenta un contratto filigranato mentre una raffica di libeccio strappa un tirante alto (scelta a tempo!).
// Zia Wanda e Madame Miranda sbloccano gli ultimi due numeri del Cartellone («filo» e «tarocchi»), poi si sale tra gli anelli della cupola contro Il Grande Specchio.
(function () {
  "use strict";
  function boot() {
    const E = window.__zampanoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__zampanoH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }
  function chapter3(K) {
    const { setStep, quest, F } = K, H = window.__zampanoH(K), { say, done, ask, wask } = H;
    const N = 3, S = () => K.stepOf(N);
    H.people();
    K.cos("ci_c3", { kind: "shirt", label: "Mantella viola degli Specchi", val: "#7e22ce", from: "Capitolo 3 del Circo Zampanò" });
    K.lore("l_cupola", { t: "La passerella dei venti", d: "Sedici metri sopra la segatura corre l'anello d'acciaio dove Lila aggancia il trapezio e Zia Wanda camminava senza bilanciere. Da lassù si vede il faro del Borgo Marino." });

    const goal = (s) => ({
      0: "Retro dei tendoni. Il Barone Orloff ti aspetta al centro del piazzale coi guanti bianchi.",
      1: "Entra nel Carro-Sartoria (a ovest) da Zia Wanda e Miranda, poi sali alla Passerella della Cupola (a est) e parla con Lila.",
      2: "▶ PISTA ACROBATICA: regola il Cartellone (A) in Cupola e lancia la corsa tra i cavi dal varco (X).",
      3: "Il Grande Specchio blocca i riflettori alti: affrontalo dal varco della cupola (X).",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 4); F.set("ci_c3_done", true);
      K.reward("ci_c3", { coins: 110, cos: "ci_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Dall'alto della cupola i riflettori liberati disegnano un cerchio d'oro perfetto sulla segatura sottostante."],
        ["ci_lila", "[felice] Domani sera è il Gran Gala delle Rondini. Tutto il Borgo Marino sta salendo a Pian dei Venti coi biglietti in mano."],
        ["ci_zampano", "[serio] Prima di aprire il sipario presenteremo il nostro verdetto sul cavo tranciato al ragionier Bacci, e schiereremo la Scaletta definitiva dei tre numeri."],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>👏 Applausi ${K.stat("applausi")} · 📋 Numeri sbloccati ${K.billboard.list().length}/6 · Sinergie scoperte ${K.billboard.seenSynergyCount()}/4`],
        ["voce", "Il Capitolo 4 ti aspetta: «Il Gran Gala delle Rondini»."]
      ]), () => K.openMain(), "ci_cupola");
    }

    function afterBoss() {
      K.learnLore("l_cupola"); K.bond("applausi", 3);
      say("voce", "Il Grande Specchio fa un inchino teatrale, richiude il mantello in una nuvola di coriandoli argentati e vi lascia libero il quadro dei riflettori di cupola.");
      say("ci_miranda", "Te l'avevo detto: chi vive di trucchi altrui teme chi salta col proprio nome.");
      return wask("Sul ponte di comando della cupola trovi ancora la copia del Contratto del Barone Orloff. Cosa ne fai alla vigilia del Gala?", [
        { label: "🎪 «Lo piego in un aeroplanino di carta e lo mando col vento!»", w: { cuore: 2 }, fn: () => { F.set("ci_contratto_rifiutato", true); K.rel.add("ci_lila", 2); say("ci_lila", "[felice] Guarda come plana fino al porto! Domani sera si vola per Zampanò!"); fin(); } },
        { label: "👑 «Lo conservo per mostrarlo al pubblico dopo la vittoria.»", w: { prestigio: 2 }, fn: () => { F.set("ci_contratto_rifiutato", true); K.inv.give("ci_contratto"); say("ci_zampano", "[felice] Una bella lezione di stile, campione. A domani sera!"); fin(); } },
        { label: "«Lo metto in tasca senza strapparlo: vediamo cosa offre domani Orloff.»", w: { prestigio: 1 }, fn: () => { F.set("ci_contratto_aperto", true); K.inv.give("ci_contratto"); say("ci_lila", "[triste] Speriamo solo che quell'oro stampato non ci porti via la pista..."); fin(); } }
      ]);
    }

    function runPista3() {
      H.level("pista3", "ci_lila", "In cupola i salti sono ampi: usa i trampolini e premi 🎪 dentro gli anelli d'oro per slanciarti da una trave all'altra!", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          K.bond("applausi", 2);
          say("ci_lila", "[felice] Hai attraversato tutta la ragnatela dei cavi senza sbagliare un aggancio! Ora resta solo l'illusionista di Orloff davanti ai riflettori!");
          quest("ci_q3c", "Il padiglione degli specchi", "Torna al varco (X) in Cupola e affronta Il Grande Specchio.");
          return done();
        }
        say("ci_wanda", r.quit ? "Controlla il Cartellone al leggio (A): col mio Filo e gli Specchi di Miranda la pista ti premia!" : "Ricorda che in aria puoi fare una piroetta con 🎪 e risalire sugli anelli d'oro!");
        done();
      });
    }

    function runSpecchio() {
      H.level("specchio", "ci_miranda", "Il Grande Specchio sparisce in tre punti e lancia ventagli di carte: aspetta che faccia l'inchino sotto le stelline per colpirlo!", (r) => {
        if (r.win) return afterBoss();
        say("ci_miranda", "Schiva il ventaglio di tre carte e colpisci appena si ferma per l'inchino!"); done();
      });
    }

    function arch() {
      const s = S();
      if (s < 2) {
        say("voce", "Le funi della cupola vibrano ancora per il vento. Parla prima con Orloff fuori e poi con Lila qui sulla passerella.");
        return done();
      }
      if (s === 2) return ask(`Sotto i tuoi piedi brilla la pista lontana. Scaletta: ${K.billboard.statusTxt()}.`, [
        { label: "🎠 Vola nell'intreccio della cupola", sub: "Livello a scorrimento · L'intreccio della cupola", big: true, cls: "hot", fn: runPista3 },
        { label: "📋 Cambia la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(arch, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Davanti al quadro dei riflettori tre sagome identiche del Grande Specchio agitano il cilindro.", [
        { label: "🔮 Affronta Il Grande Specchio", sub: "Capo · Il padiglione degli specchi", big: true, cls: "hot", fn: runSpecchio },
        { label: "🎠 Rigioca l'intreccio della cupola", sub: "Per raccogliere le Coccarde d'oro", fn: runPista3 },
        { label: "📋 Cambia la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(arch, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "I riflettori della cupola sono pronti per il Gran Gala."); done();
    }

    const talk = {
      ci_orloff() {
        if (K.rel.scene("ci_orloff")) return;
        if (S() === 0) {
          say("ci_orloff", "[serio] Vi risparmio i preamboli, acrobata. Il mio Gran Circo Imperiale parte venerdì per Torino e Vienna: stipendio garantito, manifesti a colori, zero debiti comunali.");
          say("ci_orloff", "Basta che tu e Lila firmiate questo foglio e lasciate chiudere in pace il vecchio Zampanò.");
          say("voce", "D'improvviso una raffica furiosa dal mare fa schioccare un tirante maestro sopra il tetto del tendone: il canapo frusta l'aria a due passi dalle lanterne!");
          const l = H.flush();
          return K.say(l, () => K.ask("ci_lila", "⚡ Il tirante maestro sta scivolando dal picchetto! Hai pochi secondi prima che ceda la vela!", [
            { label: "🤸 Balza sul picchetto e blocca la gomena a mano!", big: true, cls: "hot", fn: () => {
              K.bond("cuore", 2); K.bond("applausi", 2); K.rel.add("ci_lila", 2); setStep(N, 1);
              quest("ci_q3", "Funi e paillettes", "Passa in Sartoria da Wanda e Miranda, poi raggiungi Lila in Cupola.");
              say("voce", "Ti lanci in scivolata sull'erba, avvolgi la gomena attorno alla bitta d'ottone e la tieni ferma finché Golia non pianta il secondo cuneo!");
              say("ci_orloff", "[sorpreso] Incosciente... ma che riflessi. Il mio contratto resta sul banco: pensaci prima del Gala.");
              done();
            } },
            { label: "📐 Grida a Golia e Tonio di fare contrappeso sincronizzato!", big: true, fn: () => {
              K.bond("prestigio", 2); K.bond("applausi", 2); setStep(N, 1);
              quest("ci_q3", "Funi e paillettes", "Passa in Sartoria da Wanda e Miranda, poi raggiungi Lila in Cupola.");
              say("voce", "Al tuo fischio Golia afferra la cima di maestra e Tonio blocca l'argano col piede di ferro: la cupola torna tesa come un tamburo!");
              say("ci_orloff", "[serio] Sangue freddo da direttore di pista. Peccato sprecarlo in provincia.");
              done();
            } },
            { label: "😶 Esita un istante guardando il contratto", fn: () => {
              K.bond("applausi", -1); setStep(N, 1);
              quest("ci_q3", "Funi e paillettes", "Passa in Sartoria da Wanda e Miranda, poi raggiungi Lila in Cupola.");
              say("voce", "Il tirante strappa un lembo del festone prima che Golia riesca ad afferrarlo al volo. Niente feriti, ma ci vorrà l'ago di Zia Wanda.");
              say("ci_orloff", "Vedi? Basta una folata di vento per mandare all'aria i romantici.");
              done();
            } }
          ], null, { secs: 12, def: 2 }));
        }
        say("ci_orloff", "L'offerta del Gran Circo Imperiale resta valida fino all'apertura del sipario di domani sera."); done();
      },
      ci_wanda() {
        if (K.rel.scene("ci_wanda")) return;
        if (!K.billboard.unlocked("filo")) {
          K.billboard.unlock("filo");
          say("ci_wanda", "[felice] Ho tirato fuori dal baule di cedro il mio parasole di Marsiglia: «Il Filo di Zia Wanda» entra nel Cartellone! Ti dà una mantella rinforzata con un colpo in più.");
          say("ci_wanda", "Prova a mettermi in scaletta insieme a Madame Miranda: i suoi specchi e il mio cavo fanno il numero «Il Filo del Destino»!");
          return done();
        }
        say("ci_wanda", "Nessuno strappo spaventa chi ha ago doppio e filo incerato."); done();
      },
      ci_miranda() {
        if (K.rel.scene("ci_miranda")) return;
        if (!K.billboard.unlocked("tarocchi")) {
          K.billboard.unlock("tarocchi");
          say("ci_miranda", "Ho lucidato le tre lastre veneziane: «Gli Specchi di Miranda» è pronto nel Cartellone. Rende il tuo salto leggero come fumo d'arancia.");
          say("ci_miranda", "Lassù in cupola Orloff ha mandato il suo illusionista mascherato a bloccare i riflettori: aspetta il suo inchino per colpirlo!");
          return done();
        }
        say("ci_miranda", "Con sei numeri nel Cartellone puoi provare tutte le intese segrete prima del Gran Gala."); done();
      },
      ci_lila() {
        if (K.rel.scene("ci_lila")) return;
        if (S() === 1) {
          setStep(N, 2); K.questDone && K.questDone("ci_q3");
          quest("ci_q3b", "Lassù tra gli anelli", "Controlla il Cartellone (A) e apri il varco della cupola (X).");
          say("ci_lila", "[felice] Sei salito! Guarda giù: quando stringi la fune giusta non fa più paura nemmeno il libeccio.");
          say("ci_lila", "Assicurati di aver parlato con Zia Wanda e Miranda in Sartoria per avere tutti e sei i numeri nel Cartellone, poi apri il varco (X) qui dietro!");
          return done();
        }
        say("ci_lila", "Negli anelli d'oro premi 🎪 mentre sei in volo: ti rilanciano fino alla trave successiva!"); done();
      },
      ci_tonio() {
        if (K.rel.scene("ci_tonio")) return;
        if (!F.is("ci_amichevole_c3")) {
          return ask("Tonio indica tre inservienti di Orloff che palleggiano sul prato: «Ci hanno sfidati a una rivincita a 2 gol dietro i carri! Giochiamo?»", [
            { label: "⚽ Sfida i Cadetti di Orloff (a 2 gol)", sub: "Partita sul retro dei tendoni (+2 Applausi)", fn: () => K.playMatch({ id: "ci_am3", oppTeam: "Cadetti Imperiali", cageTarget: 2, done: (r) => {
              if (r && r.win) { F.set("ci_amichevole_c3", true); K.bond("applausi", 2); K.rel.add("ci_tonio", 2); say("ci_tonio", "[felice] Due a zero col naso rosso! Anche gli inservienti di Orloff si sono messi ad applaudire di nascosto!"); }
              else say("ci_tonio", "Hanno le scarpe bullonate! Quando vuoi la rivincita fischia pure.");
              done();
            } }) },
            { label: "↩ Più tardi", fn: done }
          ]);
        }
        say("ci_tonio", "[felice] Dopo quella lezione di pallone i cadetti di Orloff ci salutano togliendosi il cilindro!"); done();
      },
      ci_ercole() {
        if (K.rel.scene("ci_ercole")) return;
        say("ci_ercole", "Ho piantato doppi picchetti di quercia lungo tutto il lato mare: stanotte il tendone non si muove di un millimetro."); done();
      }
    };

    const zones = {
      ci_retro: {
        region: "spiazzo", name: "Il Retro dei Tendoni", short: "Retro", sub: "Tiranti di canapa, carri officina e vento dal mare", bg: "ci_retro", time: "tramonto", w: 30, h: 22, base: "Z", start: [15, 19],
        itemCos: "ci_c3", items: [[2, 11], [27, 11], [14, 16], [26, 19]],
        areas: [[2, 3, 11, 9, "Il Carro-Sartoria"], [19, 3, 27, 9, "La Scala della Cupola"], [11, 10, 19, 15, "Il piazzale dei tiranti"], [0, 0, 29, 21, "Retro dei Tendoni"]],
        flavor: { C: "Tirante maestro assicurato con doppio nodo marinaro.", P: "Casse di contrappesi e carrucole d'ottone.", M: "Costumi stesi ad asciugare al vento teso di Pian dei Venti.", n: "Tabella turni: «ORE 21 · PROVA LUCI IN CUPOLA».", s: "Panca riparata dietro il carro sartoria.", l: "Faro da cantiere puntato contro le funi alte." },
        npcs: () => [{ id: "ci_orloff", at: [15, 11] }, { id: "ci_tonio", at: [10, 14] }, { id: "ci_ercole", at: [19, 14] }],
        intro: [["voce", "Dietro il tendone il vento dell'autunno ligure fischia tra i tiranti come le corde di un contrabbasso."], ["voce", "Appoggiato al suo bastone d'argento, il Barone Orloff ti aspetta fra il Carro-Sartoria a ovest e la scala della Cupola a est."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); lay(0, 2, 0, 21, "t"); lay(29, 2, 29, 21, "t"); lay(1, 21, 28, 21, "I"); put(14, 21, "Z"); put(15, 21, "Z");
          house(3, 4, 8, 5, { door: [7, 8], roof: "#be123c", wall: "#ffe4e6", enter: { to: "ci_sartoria", at: [8, 9] } });
          house(20, 4, 7, 5, { door: [23, 8], roof: "#4c1d95", wall: "#ede9fe", enter: { to: "ci_cupola", at: [8, 9] } });
          house(3, 15, 6, 4, { door: [5, 18], roof: "#78350f", wall: "#fef3c7", enter: "La rimessa delle corde: matasse di canapa profumate di catrame buono." });
          house(21, 15, 6, 4, { door: [23, 18], roof: "#1e293b", wall: "#e2e8f0", enter: "La carrozza nera del Barone Orloff: tende di velluto chiuse e stemma dorato." });
          put(12, 9, "C"); put(18, 9, "C"); put(15, 8, "n"); put(14, 14, "P"); put(9, 19, "s");
          [[11, 4], [19, 4], [11, 13], [18, 13]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, "🪡 SARTORIA", d.X(7) + 8, d.Y(4) - 6, s === 1 ? "#fde047" : "#fecdd3");
          H.plaque(g, "🎠 CUPOLA ▲", d.X(23) + 8, d.Y(4) - 6, s >= 1 ? "#fde047" : "#ddd6fe");
        }
      },
      ci_sartoria: {
        interior: true, region: "carro", name: "Il Carro-Sartoria", short: "Sartoria", sub: "Macchina a pedale, specchi veneziani e mantelle di paillettes", bg: "ci_sartoria", w: 16, h: 11, start: [8, 9], outside: ["ci_retro", 7, 9], base: "Y",
        flavor: { M: "Manichini vestiti con giacche cremisi, piume bianche e paillettes d'oro.", V: "Lo specchio triplo dove gli acrobati provano gli inchini.", T: "Tavolo da taglio pieno di gessetti da sarto e rocchetti di seta." },
        npcs: () => [{ id: "ci_wanda", at: [6, 5] }, { id: "ci_miranda", at: [10, 5] }],
        chests: { "13,2": { coins: 35, text: "Nel cassetto dei bottoni d'ottone trovi un gruzzolo di monete di scena!" } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 4, 10, 7, "U");
          put(2, 2, "M"); put(4, 2, "M"); put(11, 2, "V"); put(8, 3, "T"); put(13, 2, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "ATELIER DI ZIA WANDA", d.X(8) + 8, d.Y(0) + 6, "#fecdd3"); }
      },
      ci_cupola: {
        interior: true, region: "cupola", name: "La Passerella della Cupola", short: "Cupola", sub: "Sedici metri sopra la pista, tra anelli d'oro e riflettori", bg: "ci_cupola", w: 16, h: 11, start: [8, 9], outside: ["ci_retro", 23, 9], base: "Q",
        flavor: { X: "Il ponte sospeso che immette nell'intreccio acrobatico della cupola.", A: "Il leggio volante del Cartellone per preparare la scaletta.", C: "Gancio d'acciaio temperato del trapezio centrale.", G: "Il quadro dei riflettori alti: manca solo l'ultimo sblocco." },
        npcs: () => [{ id: "ci_lila", at: [7, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Q"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 3, 10, 7, "U");
          put(7, 1, "X"); put(8, 1, "X"); put(12, 2, "A"); put(3, 2, "G"); put(3, 7, "C"); put(12, 7, "C");
        },
        decor(g, cx, cy, d) {
          const s = S(), on = s >= 2 && s <= 3;
          H.plaque(g, on ? "▶ VOLA IN CUPOLA" : "PASSERELLA", d.X(7) + 16, d.Y(1) - 6, on ? "#fde047" : "#ddd6fe");
          H.plaque(g, "📋 CARTELLONE", d.X(12) + 8, d.Y(2) - 8, "#fde68a");
        }
      }
    };

    return {
      n: N, title: "Sotto la Cupola", sub: "Un contratto d'oro, una raffica improvvisa e il duello tra gli specchi a sedici metri d'altezza",
      goal, start: "ci_retro", introBg: "ci_retro", zones, talk,
      obj: {
        "ci_cupola:X": () => arch(),
        "ci_cupola:A": () => K.billboard.open(() => K.done(), true)
      },
      intro: [
        ["voce", "Vigilia del Gran Gala. Con la corrente tornata a pieno regime, la compagnia prepara i cavi più alti sotto la cupola del tendone."],
        ["voce", "Ma sul piazzale posteriore è arrivata una carrozza nera con lo stemma dorato del Barone Orloff."]
      ]
    };
  }
  boot();
})();
