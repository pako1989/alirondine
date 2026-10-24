// js/diga-c1.js - «LA DIGA DI VALPIANA» · Capitolo 1: Acqua Alta
// Il paese (campo della piazza, chiesa chiusa, pontile), la locanda con la radio (interno a mano), il municipio con la mappa della valle (interno a mano) e la riva del lago.
// Il livello dell'acqua comincia a salire: ogni fascia che passa allarga le pozze. Primo livello di Argine con Gino.
(function () {
  "use strict";
  function boot() {
    const E = window.__digaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const H = window.__digaH, { setStep, quest, F } = K;
    const N = 1, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled })));
      if (l.length) K.say(l, go); else go();
    };
    H.cast(K);
    K.cos("vp_c1", { kind: "shirt", label: "Giacca del Volontario", val: "#0e7490", from: "Capitolo 1 di La Diga di Valpiana" });
    K.lore("l_valpiana", { t: "Valpiana", d: "Sedici case, una chiesa chiusa «per umidità» e un lago che sta sopra la testa di tutti. La diga ha quarant'anni, il campo del paese ne ha centoventi." });
    K.lore("l_coppa", { t: "La Coppa della Piena", d: "Un torneo di beneficenza: ogni partita raccoglie i fondi per riparare la diga. Il premio è una coppa di latta, ricordo della piena del '62." });

    const goal = (s) => ({
      0: "Parla con la Sindaca Tilde, in piazza.",
      1: "Gino, sul campo della piazza, ti aspetta: prima dei palloni, i sacchi (Argine, livello 1).",
      2: "Lorenza, alla Locanda del Barcaiolo (porta in alto a sinistra): una intervista. Poi vai da Zattera, sul pontile.",
      3: "Torna dalla Sindaca, in Municipio (porta al centro, in alto)."
    }[s] || "Il capitolo 1 è concluso. La diga ti aspetta.");
    const lag = (n) => { K.clock.advance(n || 1, K.done); };

    function fin() {
      F.set("vp_c1_done", true); K.flood.add(1);
      K.reward("vp_c1", { coins: 80, cos: "vp_c1" });
      K.finishChapter(N, "ok");
      K.scene([["voce", "Fuori, la pioggia non sa se cominciare. Il lago, sotto la diga, sembra più vicino alla riva di ieri."], ["vp_tilde", "[pensa] Domani sali alla diga. Ermete ti aspetta, o almeno lo spero. Con lui non si sa mai."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> Livello ${K.flood.name()} · Fiducia ${K.stat("fiducia")} · Argine ${K.stat("argine")}.`], ["voce", "Il Capitolo 2, «Il Registro delle Piene», ti aspetta."]], () => K.openMain(), "dg_diga");
    }
    const talk = {
      vp_tilde() {
        if (K.rel.scene("vp_tilde")) return;
        const s = S();
        if (s === 0) {
          say("vp_tilde", "[felice] Il Campione! Non ci credevo: eri solo una foto sul volantino. Siamo ventitré a pagare un'asta di sedie per aggiustare la diga, e adesso ci sei tu.");
          say("vp_tilde", "La Coppa della Piena. Cinque partite, un incasso per ogni gol e il resto offerto dal Bar. Se vinciamo, il Consorzio paga la riparazione. Se perdiamo, paghiamo noi. In rate. A vita.");
          say("vp_tilde", "Il lago è più alto del solito, ma i vecchi dicono che a ottobre è così. I vecchi dicono molte cose.");
          K.learnLore("l_valpiana"); K.learnLore("l_coppa"); setStep(N, 1);
          quest("vp_c1", "La Coppa della Piena", "Prima di giocare, prepara il paese: Gino, sul campo della piazza.");
          return ask("Tilde ti mette in mano un fischietto di plastica e un volantino.", [
            { label: "«Ci sono, Sindaca»", sub: "Fiducia +1", big: true, cls: "hot", fn: () => { K.bond("fiducia", 1); say("vp_tilde", "[felice] Ottimo! Sei il primo a non chiedermi se c'è un parcheggio."); done(); } },
            { label: "«Cos'è questo fischietto?»", sub: "Una domanda onesta", fn: () => { say("vp_tilde", "Il fischietto serve a chiamare i volontari. Due colpi: sacchi. Tre colpi: ambulanza. Uno: caffè."); done(); } }
          ]);
        }
        if (s === 3) {
          if (!K.inZone("vp_municipio")) { say("vp_tilde", "Sono in Municipio, non qui. Passa dalla porta al centro: ti aspetto con la lettera."); return done(); }
          say("vp_tilde", "[serio] Ecco la lettera. L'Ente Acque scrive che il Consorzio pagherà la riparazione «a condizione che la Coppa raccolga i fondi». E manda Valvola, qui accanto, a verificare lo stato della diga. «Ordinariamente».");
          say("vp_valvola", "[serio] Straordinariamente. Ma non ho il modulo. Domani sarò alla diga, con l'ingegnere capo: cioè con me. Il custode, Ermete, vi aspetta. Non è sempre cortese.");
          say("vp_tilde", "[felice] Hai fatto una giornata intera da Campione e non hai ancora giocato. Domani si sale alla diga.");
          K.rel.add("vp_tilde", 3, true);
          const l = flush(); return K.say(l, fin);
        }
        say("vp_tilde", s < 3 ? "Gino ti aspetta sul campo. Io ho una riunione con tre persone e due sedie." : "La diga ti aspetta. E il registro."); done();
      },
      vp_gino() {
        if (K.rel.scene("vp_gino")) return;
        const s = S();
        if (s < 1) { say("vp_gino", "Piano, piano. Prima parla con la Sindaca: ha quel ti-guardo-e-ti-assegno."); return done(); }
        if (s === 1) {
          say("vp_gino", "Sei il Campione, eh. Bene. Qui non si gioca se prima non si sa fare un argine: se piove, il campo diventa il lago.");
          say("vp_gino", "Il trucco è questo: i sacchi non fermano l'acqua. La guidano. Una fila storta la manda da una parte, una dritta la ferma e basta. Prova.");
          return ask("Gino ti indica una vecchia lavagna con un disegno a gessetto: le falle in alto, le case in basso.", [
            { label: "Provi l'Argine (livello 1)", sub: "Trascina il dito: l'acqua scivola lungo i sacchi", big: true, cls: "hot", fn: () => { QL = []; K.argine([1], (r) => { if (r.win) { K.bond("argine", 1); K.rel.add("vp_gino", 4, true); setStep(N, 2); quest("vp_c1b", "L'intervista", "Alla Locanda del Barcaiolo: Lorenza e la radio."); say("vp_gino", "[felice] Bravo! Il primo livello è facile: l'acqua cade dove la mandi tu. Dal secondo, l'acqua ha un carattere."); say("voce", "Argine +1. Prossima tappa: Lorenza, alla locanda (porta in alto a sinistra)."); } else say("vp_gino", "Persa? Normale: è un'acqua con il vizio della fretta. Riprova."); done(); }); } },
            { label: "Prima una domanda", fn: () => { say("vp_gino", "Domanda onesta: se non riesco, il paese si bagna? No. Si bagna se non ci provo. Capito la differenza?"); done(); } }
          ]);
        }
        say("vp_gino", s < 4 ? "Argine fatto. Ora parla con chi parla di mestiere: Lorenza, alla locanda." : "Ci vediamo alla diga. Porta gli stivali.");
        if (s >= 2) ask("Gino sistema il cappellino senza guardarti.", [{ label: "Ripassi l'Argine (livello 1)", sub: "Un po' di pratica", fn: () => { QL = []; K.argine([1], () => done()); } }, { label: "Tornare al lavoro", fn: K.done }]); else done();
      },
      vp_paesano() { say("vp_paesano", S() < 3 ? "[felice] Sacchi, sacchi e sacchi. Ne mancano due. Quelli, sono sicuro, li ha presi Gino per la sua barca. Non ha una barca." : "[serio] Domani si parte presto. Porto la termos."); done(); },
      vp_zita() {
        if (!F.is("vp_zita_c")) { F.set("vp_zita_c", true); say("vp_zita", "[felice] Hai la faccia di chi gioca a pallone. Una volta lo facevamo sul serio. Dove sorge il lago, c'era un campo. Il pallone era del prete.");
          say("vp_zita", "No, non te lo racconto adesso. Me lo chiederai quando avrai le scarpe bagnate."); K.rel.add("vp_zita", 2, true); return done(); }
        say("vp_zita", "Ti aspetto qui, sulla panchina. Ho una pazienza da diga."); done();
      },
      vp_lorenza() {
        if (K.rel.scene("vp_lorenza")) return;
        const s = S();
        if (s < 2) { say("vp_lorenza", "[ride] Una pausa e arrivo. Il microfono si scalda sempre dopo il caffè."); return done(); }
        if (s === 2 && !F.is("vp_int")) {
          say("vp_lorenza", "Radio Valpiana, ore sedici, e in studio un Campione che non sapeva di venire in studio. Allora: perché sei qui?");
          return ask("Lorenza ti allunga il microfono. È a forma di banana.", [
            { label: "«Per la diga»", sub: "Sincero · Fiducia +1", big: true, cls: "hot", fn: () => { F.set("vp_int", true); K.bond("fiducia", 1); K.rel.add("vp_lorenza", 3, true); say("vp_lorenza", "[felice] Risposta vera. Rara. La trasmetto due volte."); say("voce", "Fiducia +1. Ora Zattera, al pontile: sai che cosa vuole il lago."); done(); } },
            { label: "«Per il pallone, e per il caffè»", sub: "Ironico · Rapporto +2", fn: () => { F.set("vp_int", true); K.rel.add("vp_lorenza", 4, true); say("vp_lorenza", "[ride] Il caffè è un motivo valido. Il pallone, pure. Il resto lo imparerai dopo."); say("voce", "Ora Zattera, al pontile."); done(); } },
            { label: "«Preferisco non dire»", sub: "Prudente · Fiducia -1", fn: () => { F.set("vp_int", true); K.bond("fiducia", -1); say("vp_lorenza", "[pensa] Tre parole e nessuna notizia. Prendo nota. Sarà un'intervista corta ma intensa."); say("voce", "Ora Zattera, al pontile."); done(); } }
          ]);
        }
        say("vp_lorenza", "Trecento ascoltatori, di cui duecentonovantanove parenti. Per te, anche stasera il trecentesimo."); done();
      },
      vp_zattera() {
        if (K.rel.scene("vp_zattera")) return;
        const s = S();
        if (s < 2 || !F.is("vp_int")) { say("vp_zattera", "[pensa] Il lago è basso o alto, dipende da come lo guardi. Io lo guardo di sbieco."); return done(); }
        if (s === 2) {
          say("vp_zattera", "Quarant'anni su questo lago. Ho visto salire e scendere l'acqua. Sai com'è? Non sale piano. Sale di notte, quando nessuno guarda.");
          say("vp_zattera", "Ieri il pontile aveva i piedi dentro. Oggi, l'acqua è arrivata ai primi gradini. Un dito in tre giorni. Non è tanto. È troppo.");
          F.set("vp_zat", true); K.bond("argine", 1);
          return ask("Zattera ti allunga un cestino di pane e salame.", [
            { label: "Mangi e ascolti", sub: "Passa il tempo · sera", big: true, cls: "hot", fn: () => { say("vp_zattera", "Quando il lago ha fretta, lo senti dal silenzio. Stasera è zitto. Fossi in te, andrei dalla Sindaca."); setStep(N, 3); quest("vp_c1c", "La lettera", "Torna in Municipio (porta al centro, in piazza): la Sindaca ha una lettera."); say("voce", "Argine +1. Passa il tempo: la sera cala. Torna in piazza dalla Sindaca."); QL = QL.concat([]); const l = flush(); K.say(l, () => K.clock.advance(1, K.done)); } },
            { label: "Rifiuti con garbo", sub: "Resti a bocca asciutta", fn: () => { say("vp_zattera", "Come vuoi. Il pane non scappa: è già duro."); done(); } }
          ]);
        }
        say("vp_zattera", s === 3 ? "Dalla Sindaca, te l'ho detto." : "Il lago ti aspetta. Anche l'argine."); done();
      },
      vp_valvola() {
        const s = S();
        if (s < 3) { say("vp_valvola", "[serio] Corrado Valvola, Ente Acque Alto Rio. Sono qui per una verifica. Una verifica ordinaria."); say("vp_valvola", "Straordinaria, in realtà. Ma non ho il modulo."); return done(); }
        say("vp_valvola", "[serio] Ho dieci minuti. Ne prenderò quindici. Il resto lo dica alla Sindaca."); done();
      }
    };
    const zones = {
      vp_paese: {
        region: "paese", name: "Valpiana · La Piazza", short: "Paese", sub: "Sedici case, una chiesa chiusa e un campo in mezzo alla strada", bg: "dg_paese", time: "sera", w: 32, h: 22, base: "k", start: [16, 9],
        itemCos: "vp_c1", items: [[2, 9], [22, 9], [28, 15]],
        areas: [[2, 10, 16, 15, "Il campo della piazza"], [8, 16, 12, 21, "Il pontile"], [3, 3, 10, 7, "La Locanda del Barcaiolo"], [13, 3, 21, 7, "Il Municipio"], [0, 0, 31, 21, "Valpiana, sotto la diga"]],
        npcs: () => [].concat(S() < 3 ? [{ id: "vp_tilde", at: [18, 9] }] : [], [{ id: "vp_gino", at: [9, 12] }, { id: "vp_paesano", at: [18, 12] }, { id: "vp_zita", at: [22, 15] }]),
        doors: { "31,12": { to: "vp_riva", at: [1, 9] } },
        flood: [[1, 0, 16, 7, 17], [2, 13, 16, 31, 17], [3, 0, 15, 16, 15], [4, 8, 16, 12, 17], [4, 2, 14, 16, 14]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 1, "A"); lay(0, 2, 31, 2, "g"); [[1, 2], [5, 2], [11, 2], [22, 2], [29, 2]].forEach(([x, y]) => put(x, y, "T")); lay(0, 2, 0, 17, "A"); lay(31, 2, 31, 17, "A"); put(31, 12, "q");
          house(3, 3, 8, 5, { door: [6, 7], roof: "#9b2a2a", enter: { to: "vp_locanda", at: [9, 10] } });
          house(13, 3, 9, 5, { door: [17, 7], roof: "#3a5a8a", enter: { to: "vp_municipio", at: [10, 11] } });
          house(24, 3, 6, 5, { door: [26, 7], roof: "#6a4a2a", enter: "Una casa di Valpiana: due biciclette, tre secchi e un gatto che dorme sull'ombrello." });
          house(24, 10, 6, 5, { door: [26, 14], roof: "#7a2a2a", enter: "La chiesa di San Fiume: chiusa «per umidità». Dietro il portone, dicono, l'acqua ha già un banco in prima fila." });
          lay(2, 10, 16, 15, "g"); lay(19, 10, 22, 11, "K"); lay(0, 16, 31, 17, "u"); lay(0, 18, 31, 21, "~"); lay(8, 18, 12, 21, "r"); put(16, 17, "P"); put(21, 15, "s"); put(23, 15, "s");
        },
        decor(g, cx, cy, d) { H.plaque(g, "LOCANDA DEL BARCAIOLO", d.X(7) + 8, d.Y(3) - 4, "#f87171"); H.plaque(g, "MUNICIPIO", d.X(17) + 8, d.Y(3) - 4, "#60a5fa"); H.plaque(g, "CAMPO DELLA PIAZZA", d.X(9) + 8, d.Y(10) + 6, "#86efac"); H.plaque(g, "PONTILE", d.X(10) + 8, d.Y(17) + 2, "#fbbf24"); H.plaque(g, "SENTIERO ▸ LAGO", d.X(30) - 8, d.Y(11) + 2, "#38bdf8"); },
        intro: [["voce", "Valpiana, tardo pomeriggio. Dodici case in piazza, quattro vicino al lago, una chiesa chiusa per umidità."], ["voce", "Sopra il paese, enorme e silenziosa, la diga. Sotto, il campo. Nel mezzo, un cartello: «ACQUA NO». Qualcuno l'ha già sbarrato con un pennarello."]]
      },
      vp_locanda: {
        interior: true, region: "paese", name: "Valpiana · La Locanda del Barcaiolo", short: "Locanda", sub: "Bottiglie, una radio e un caminetto che fuma di cortesia", bg: "dg_paese", w: 18, h: 12, start: [9, 10], outside: ["vp_paese", 6, 8],
        act: { s: "Siediti un momento" },
        npcs: () => [{ id: "vp_lorenza", at: [14, 4] }],
        objects: { "15,3": () => { say("voce", "La console di Radio Valpiana: un microfono a forma di banana, due cuffie e un cartello «Non toccare il verde». Il verde, naturalmente, è acceso."); done(); } },
        build(L) {
          const { lay, put } = L;
          H.room(L, 18, 12, "r", 9); lay(2, 2, 8, 2, "Y"); lay(1, 4, 8, 4, "K"); put(15, 3, "J"); [[11, 6], [13, 6], [12, 8], [14, 8], [4, 7], [5, 7]].forEach(([x, y]) => put(x, y, "s")); put(16, 6, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "LOCANDA DEL BARCAIOLO", d.X(9) + 8, d.Y(1) + 6, "#f87171"); H.plaque(g, "RADIO VALPIANA · 98.2", d.X(15) + 8, d.Y(2) + 4, "#22d3ee"); }
      },
      vp_municipio: {
        interior: true, region: "sala", name: "Valpiana · Il Municipio", short: "Municipio", sub: "Una mappa della valle, un tavolo e due sedie. La terza è sotto un faldone", bg: "dg_sala", w: 20, h: 13, start: [10, 11], outside: ["vp_paese", 17, 8],
        npcs: () => (S() === 3 ? [{ id: "vp_tilde", at: [9, 6] }] : []).concat(S() === 3 ? [{ id: "vp_valvola", at: [13, 7] }] : []),
        objects: { "16,6": () => { say("voce", "La mappa della valle. Il lago è un'ellisse blu, Valpiana un puntino rosso, e il segno a pennarello «ZONA BASSA» è già a metà del lago."); done(); } },
        build(L) {
          const { lay, put } = L;
          H.room(L, 20, 13, "d", 10); lay(3, 2, 6, 2, "Y"); lay(13, 2, 17, 2, "Y"); lay(8, 4, 11, 4, "K"); put(16, 6, "P"); [[5, 7], [4, 9], [15, 10]].forEach(([x, y]) => put(x, y, "s"));
        },
        decor(g, cx, cy, d) { H.plaque(g, "MUNICIPIO DI VALPIANA", d.X(10) + 8, d.Y(1) + 6, "#60a5fa"); }
      },
      vp_riva: {
        region: "lago", name: "Valpiana · La Riva del Lago", short: "Riva", sub: "Un pontile, un deposito di sacchi e un sentiero che sale alla diga", bg: "dg_lago", time: "sera", w: 30, h: 22, base: "e", start: [2, 9],
        items: [[2, 10], [18, 8], [24, 9]],
        areas: [[6, 15, 10, 21, "Il pontile di Zattera"], [3, 6, 8, 9, "Il deposito dei sacchi"], [10, 5, 28, 7, "Il sentiero alla diga"], [0, 0, 29, 21, "La riva del lago"]],
        npcs: () => [{ id: "vp_zattera", at: K.flood.get() >= 4 ? [2, 7] : [8, 15] }, { id: "vp_paesano", at: [16, 9] }],
        doors: { "0,9": { to: "vp_paese", at: [30, 12] }, "29,6": { to: "vp_diga", at: [1, 11], locked: () => (F.is("vp_c1_done") ? false : "Il sentiero per la diga ha un nastro rosso. Prima finisci con la Sindaca.") }, "29,10": { to: "vp_vecchia", at: [1, 11], locked: () => (K.stepOf(3) >= 2 ? false : "Il sentiero in secca sotto il livello del lago è chiuso: Ermete dice che è «per la tua sicurezza». Nessuno ci crede.") } },
        flood: [[1, 0, 13, 5, 13], [1, 11, 13, 13, 13], [2, 0, 12, 5, 13], [2, 11, 12, 17, 13], [3, 0, 11, 5, 13], [3, 11, 11, 17, 13], [4, 0, 11, 29, 13]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 3, "A"); lay(0, 4, 29, 5, "g"); lay(0, 15, 29, 21, "~"); lay(6, 15, 10, 21, "r"); lay(10, 5, 28, 7, "u"); lay(26, 8, 28, 10, "u"); put(29, 6, "q"); put(0, 9, "q"); put(29, 10, "q");
          house(3, 6, 6, 4, { door: [5, 9], roof: "#6a4a2a", enter: { room: "bottega", name: "Il deposito dei sacchi", who: ["vp_paesano"] } });
          lay(12, 9, 15, 10, "K"); lay(19, 12, 21, 12, "E"); put(27, 5, "F"); lay(23, 4, 26, 4, "F"); put(17, 8, "P");
        },
        decor(g, cx, cy, d) { H.plaque(g, "DEPOSITO SACCHI", d.X(5) + 8, d.Y(6) - 4, "#fbbf24"); H.plaque(g, "◂ PAESE", d.X(1) + 8, d.Y(8) + 2, "#94a3b8"); H.plaque(g, "DIGA ▸", d.X(28) - 8, d.Y(5) + 2, "#38bdf8"); H.plaque(g, "VALPIANA VECCHIA ▸", d.X(27) - 4, d.Y(11) + 2, "#a78bfa"); },
        intro: [["voce", "La riva. Un'asse bagnata, due sacchi di sabbia e un odore di ferro e alghe."], ["voce", "In alto, il sentiero che sale alla diga. Più giù, un'altra strada, quasi sott'acqua: porta dove il lago ha preso il posto del vecchio paese."]]
      }
    };
    return {
      n: N, title: "Acqua Alta", sub: "Un paese, una Coppa e un lago che sale",
      goal, start: "vp_paese", introBg: "dg_titolo", zones, talk, obj: {},
      intro: [["voce", "Valpiana, una sera d'autunno. La corriera ti ha lasciato alla fermata, tra un cartello «ACQUA NO» e un secchio."], ["voce", "Una Sindaca con i capelli raccolti in fretta ti viene incontro, con un volantino in una mano e il telefono nell'altra."]]
    };
  }
  boot();
})();
