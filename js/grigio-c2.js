// js/grigio-c2.js - IL CAVALIERE DELLA NOTTE · Capitolo 2 «I tetti di Porto Scuro»
// Il registro porta a un indirizzo oltre i tetti del mercato del pesce. Sui tetti, di notte, non c'è solo l'Airone:
// una ladra che ruba al Sindacato si muove più veloce di te. E nel Deposito della Nebbia c'è il contratto della finale.
(function () {
  "use strict";
  function boot() { const D = window.__grigio; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("gr_vela", { streak: "#a855f7", acc: ["bandana", "guanti"], name: "Vela Nera, ladra dei tetti", tag: "", hair: "#111111", style: "sidebraid", skin: "#e8c4a0", eye: "#3a8a5a", bg: ["#0c101a", "#1a1a24"], shirt: "#1a1a24" },
      "Una ladra che si muove sui tetti come se fossero un campo da calcio. Ruba solo al Sindacato della Nebbia: dice che è un modo di restituire. La polizia la cerca da due anni; la commissaria Valli, a voce bassa, ammette che la ammira un po'.");
    ["gr_sg4", "gr_sg5", "gr_sg6"].forEach((id, i) => K.cast(id, { acc: ["cappellino"], name: ["Il guardiano delle casse", "La guardia con la lanterna", "Il custode del deposito"][i], tag: "", hair: "#1a1a1a", style: "hood", skin: ["#d9a679", "#f0d0b0", "#c68642"][i], eye: "#2a2a2a", bg: ["#0c101a", "#4a4a5a"], shirt: "#3a3a4a" },
      "Una guardia del Deposito della Nebbia. Pagata per guardare, non per pensare. Guarda dove punta la lanterna."));
    K.cos("gr_c2", { kind: "acc", label: "Rampino d'argento", val: "chiave", from: "Capitolo 2 di Il Cavaliere della Notte" });
    K.cos("gr_piume2", { kind: "acc", label: "Piuma d'airone grigia", val: "fiore", from: "Trova le piume d'airone del Capitolo 2" });
    K.lore("l_vela", { t: "Vela Nera", d: "Una ladra che ruba solo al Sindacato della Nebbia. Lascia sempre un biglietto con una vela disegnata. Usa le bolas: due palle di piombo legate da una corda, che fermano chiunque senza fargli male." });
    K.lore("l_contratto", { t: "Il contratto della finale", d: "Nel Deposito della Nebbia, un contratto: la finale della Lega del Porto deve finire 0-2 per il Nebbia Athletic. Firmato O.B. In allegato, i nomi di chi deve sbagliare." });
    const goal = (s) => ({
      0: "Alfio ti aspetta sulla terrazza sopra la tribuna: ha finito un gadget nuovo.",
      1: "Attraversa i tetti verso il mercato del pesce. Qualcuno, lassù, si muove più veloce di te.",
      2: "Il Deposito della Nebbia è oltre i tetti, a destra. Il contratto della finale è lì dentro.",
      3: "Hai il contratto. La commissaria Valli ti aspetta all'uscita del deposito.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      gr_tetti: {
        region: "tetti", name: "Il Cavaliere della Notte · I tetti", short: "I tetti", sub: "Comignoli, lucernari e il vuoto fra le case", bg: "gr_tetti", time: "notte", travel: [3, 18],
        w: 34, h: 22, start: [3, 18], itemCos: "gr_piume2", items: [[17, 3]], buio: 0.32, heroLight: 3.2,
        luci: () => [[9, 6, 3, "255,74,138"], [24, 15, 3, "74,216,255"], [3, 17, 3, "255,220,140"]],
        areas: [[0, 14, 7, 21, "La terrazza sopra la tribuna"], [0, 0, 33, 21, "I tetti di Porto Scuro"]],
        flavor: { n: "Un comignolo. Fuma piano: qualcuno, sotto, cucina il pesce a mezzanotte.", l: "Un'antenna con una lucina rossa in cima. Lampeggia come un cuore lento." },
        intro: [["voce", "I tetti di Porto Scuro: tegole bagnate, comignoli, lucernari accesi. Fra un palazzo e l'altro, il vuoto, e la strada lontana. Da quassù la città sembra quasi bella."]],
        npcs: (s) => [{ id: "gr_alfio", at: [5, 16] }, ...(s >= 1 && s <= 2 ? [{ id: "gr_vela", at: [18, 9] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 21, "Z");
          lay(1, 14, 7, 20, ":"); lay(1, 13, 7, 13, "a");
          lay(10, 15, 15, 19, ":");
          lay(11, 8, 15, 12, ":"); lay(13, 13, 13, 14, ":");
          lay(17, 7, 21, 11, ":"); lay(17, 2, 18, 6, ":");
          lay(23, 6, 28, 18, ":"); lay(29, 12, 32, 13, ":"); put(33, 12, ">");
          put(14, 9, "n"); put(19, 7, "n"); put(26, 8, "n"); put(12, 17, "n"); put(27, 16, "l"); put(4, 15, "l");
          [[11, 18], [20, 10], [25, 13]].forEach(([x, y]) => put(x, y, "V")); put(2, 19, "s");
        },
      },
      gr_deposito: {
        region: "casa", name: "Il Cavaliere della Notte · Il Deposito della Nebbia", short: "Il Deposito", sub: "Casse, lanterne e il contratto della finale", bg: "gr_deposito", time: "notte", travel: [2, 10],
        w: 30, h: 20, start: [2, 10], sneakStart: [2, 10], itemCos: "gr_piume2", items: [[27, 17]], buio: 0.5, heroLight: 2.8, hide: "%",
        luci: () => [[9, 3, 2.5, "255,200,120"], [18, 16, 2.5, "255,200,120"], [26, 3, 2.5, "255,200,120"]],
        areas: [[22, 1, 28, 6, "L'ufficio del deposito"], [0, 0, 29, 19, "Il Deposito della Nebbia"]],
        flavor: { "%": "Dietro le casse c'è buio, e odore di segatura." },
        intro: [["voce", "Il Deposito della Nebbia: un capannone lungo, file di casse fino al soffitto, lanterne appese ai ganci. Tre guardie. In fondo, un ufficio con la luce accesa."]],
        npcs: (s) => [
          ...(s === 2 ? [{ id: "gr_sg4", at: [8, 6], route: [[8, 6], [8, 14]], speed: 0.5, pause: 45, guard: { range: 4 } }, { id: "gr_sg5", at: [13, 16], route: [[13, 16], [21, 16]], speed: 0.5, pause: 45, guard: { range: 4 } }, { id: "gr_sg6", at: [20, 4], face: "left", guard: { range: 4, turn: 120 } }] : []),
          ...(s === 2 && F.is("gr_contratto") || s === 3 && !F.is("gr_gancio_deciso") ? [{ id: "gr_gancio", at: [24, 9] }] : []),
          ...(s === 3 && F.is("gr_gancio_deciso") ? [{ id: "gr_dora", at: [4, 10] }] : []),
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 19, ":"); lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a"); put(0, 10, "<");
          lay(4, 2, 5, 8, "K"); lay(4, 12, 5, 17, "K"); lay(10, 2, 12, 5, "K"); lay(10, 9, 12, 13, "K"); lay(15, 6, 17, 13, "K"); lay(15, 2, 16, 3, "K"); lay(22, 9, 23, 17, "K");
          lay(22, 6, 27, 6, "a"); put(24, 6, ":"); put(27, 2, "x");
          lay(6, 2, 7, 4, "%"); lay(6, 15, 7, 17, "%"); lay(13, 10, 14, 12, "%"); lay(18, 7, 19, 9, "%"); lay(24, 13, 26, 16, "%");
          put(9, 1, "l"); put(18, 17, "l"); put(26, 1, "l");
        },
      },
    };
    function partitaTetti() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => {
        if (r && r.win && F.is("gr_vela_alleata") && !F.is("gr_g_bolas")) { K.newGadget("bolas"); K.learnLore("l_vela"); return K.scene([["gr_vela", "[ride] Non male, per uno col mantello. (Ti lancia due palle di piombo legate da una corda.) Le bolas. Fermano chiunque, senza fargli male. Mettile nella cintura."]], () => K.enterZone("gr_tetti"), "gr_tetti"); }
        K.scene([["gr_vela", r && r.win ? "[furbo] Hai i piedi buoni. Sui tetti è raro." : "[ride] Sui tetti il pallone rimbalza strano. Non te la prendere."]], () => K.enterZone("gr_tetti"), "gr_tetti");
      };
      ask("gr_vela", "Sul tetto del mercato c'è un campetto: i pescatori ci giocano all'alba. Tre contro tre, io e due amici contro te. Come vuoi giocarla?", [
        { label: "Di notte, a turni", sub: "Ombre e Gadget · la partita della saga", cls: "hot", fn: () => K.notte({ title: "Ombre e Gadget · Il campetto sul tetto del mercato", oppStyle: "contropiede", minutes: 45, mates: [{ name: "Il Pescatore" }, { name: "La Retaia" }], opp: { name: "La banda di Vela Nera", color: "#1a1a24", players: [{ name: "Vela Nera", skin: "#e8c4a0", hair: "#111" }, { name: "Grondaia" }, { name: "Lucernario" }], keeper: { name: "Il Comignolo" } }, intro: "<p>Vela gioca in <b>contropiede</b>: in difesa, guarda bene le corsie esterne.</p>" }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "gr_tetti", alt: "az,cage,hd", force: false, oppTeam: "La banda di Vela Nera", oppColor: "#1a1a24", us: "L'Airone", homeKit: ["#2a3040", "#ffd23f"], mate: "Il Pescatore", squad: ["Il Pescatore", "La Retaia", "Il Mozzo"], chap: "Il Cavaliere della Notte · Il campetto sul tetto", bg: "gr_tetti", oppNames: ["Vela Nera", "Grondaia", "Lucernario", "Il Comignolo", "Tegola"], intro: "Sul tetto del mercato del pesce, di notte, sotto la pioggia: il pallone scivola, il vento soffia di lato.", done: after }) },
        { label: "Non adesso", fn: done },
      ], "gr_tetti");
    }
    function trovaContratto() {
      if (F.is("gr_contratto")) return say([["voce", "Il cassetto è vuoto: il contratto è nella tua cintura, piegato in quattro."]]);
      F.set("gr_contratto", true); K.learnLore("l_contratto"); K.evidence("contratto", { t: "Il contratto della finale", d: "«Finale della Lega del Porto: risultato concordato 0-2 per il Nebbia Athletic.» Firmato O.B. In allegato, i nomi di chi deve sbagliare.", icon: "📄", short: "Dal deposito" }); K.giveClue("contratto", true);
      K.refreshZone();
      K.scene([["voce", "Nel cassetto della scrivania, sotto un fermacarte a forma di nuvola: un contratto. «Finale della Lega del Porto: risultato concordato 0-2.» Firmato O.B. In allegato, una lista di nomi. Il primo è quello di Marisa."], ["gr_gancio", "(Dalla porta dell'ufficio. Non ha la torcia accesa, stavolta.) Di nuovo tu. (Guarda il contratto.) Lo sapevo, che c'era anche Marisa. Mia nipote gioca con lei."]], () => K.enterZone("gr_deposito"), "gr_deposito");
    }
    function matchGancio() {
      K.notte({ title: "Ombre e Gadget · Nel deposito contro i Portuali", oppStyle: "difensiva", minutes: 60,
        mates: [{ name: "Il Pescatore" }, { name: F.is("gr_vela_alleata") ? "Vela Nera" : "La Retaia" }], opp: { name: "I Portuali di Gancio", color: "#a83a2a", players: [{ name: "Gancio", skin: "#c68642", hair: "#3a2a1a" }, { name: "Bitta" }, { name: "Cima" }], keeper: { name: "Saracinesca" } },
        intro: "<p>Fra le casse del deposito, Gancio si mette in porta con i suoi. Stavolta gioca <b>chiuso</b>: il portiere legge bene i tiri. Il Visore aiuta.</p>", winTitle: "IL DEPOSITO È TUO!" }, (r) => {
        if (!r.win) return K.scene([["gr_gancio", "[furbo] Ancora non basta, Airone. Il deposito è grande, e io ho tempo."]], () => K.enterZone("gr_deposito"), "gr_deposito");
        F.set("gr_gancio_deciso", true); F.set("gr_gancio_battuto", true); setStep(N, 3); bond("leggenda", 2);
        K.scene([["gr_gancio", "[pensa] (Si siede su una cassa.) Mi hai battuto due volte. (Guarda il contratto.) Vattene. Io non ho visto niente. Ma non chiedermi di più."], ["voce", "Fuori, nel vicolo, una luce gialla: la torcia di un'auto della polizia."]], () => K.enterZone("gr_deposito"), "gr_deposito");
      });
    }
    const talk = {
      gr_alfio() {
        const s = S();
        if (s === 0) return K.scene([["gr_alfio", "[felice] (Sulla terrazza sopra la tribuna, con l'ombrello e una cassetta degli attrezzi.) Il registro diceva «oltre i tetti del mercato». Quindi ti servono i tetti. Quindi ti serve questo."], ["voce", "Ti mette in mano un uncino d'acciaio con una corda sottile, arrotolata in un tamburo: il Rampino."], ["gr_alfio", "Fra un tetto e l'altro c'è il vuoto. Col Rampino ti agganci al comignolo di là e passi. E in partita, il portatore avanza di due caselle. (Si aggiusta gli occhiali.) Quarant'anni fa l'Airone saltava. Io preferisco l'uncino."]], () => {
          K.newGadget("rampino"); setStep(N, 1); quest("gr_deposito", "Il Deposito della Nebbia", "Oltre i tetti del mercato del pesce, verso destra."); K.officina(() => say([["gr_alfio", "Vai. E se lassù incontri qualcuno, non è detto che sia un nemico."]]));
        }, "gr_tetti");
        return ask("gr_alfio", "Vuoi cambiare la cintura?", [{ label: "L'officina", sub: "Scegli i gadget della cintura", fn: () => K.officina(done) }, { label: "Dopo", fn: done }], "gr_tetti");
      },
      gr_vela() {
        const s = S();
        if (s === 1) return ask("gr_vela", "(Seduta su un comignolo, a gambe incrociate, come se ti aspettasse da un'ora.) Bel mantello, Airone. Io sono Vela. Rubo al Sindacato della Nebbia: casse, soldi, segreti. Stanotte volevo il contratto della finale, nel deposito. Lo vuoi anche tu, vedo.\n\nPossiamo fare a gara. O possiamo farlo insieme. Decidi tu, ma decidi in fretta: piove.", [
          { label: "«Insieme»", sub: "Un'alleanza sui tetti", big: true, fn: () => { F.set("gr_vela_alleata", true); F.add("gr_vela_fid", 2); setStep(N, 2); say([["gr_vela", "[felice] Insieme. (Ti tende la mano: ha un guanto con le dita tagliate.) Io distraggo le guardie da fuori, tu entri. Prima però una partita sul tetto del mercato, se ti va: voglio vedere come ti muovi."]]); } },
          { label: "«Ti consegno alla commissaria»", sub: "Una ladra resta una ladra", big: true, fn: () => { F.set("gr_vela_contro", true); bond("fiducia", 1); setStep(N, 2); K.refreshZone(); say([["gr_vela", "[ride] Prendimi, allora. (Salta all'indietro nel vuoto. Un attimo dopo è sul tetto di fronte.) Ci vediamo al deposito, Airone. Chi arriva prima vince."]]); } },
        ], "gr_tetti");
        if (s === 2 && F.is("gr_vela_alleata")) return ask("gr_vela", "Il deposito è a destra, oltre l'ultimo tetto. Prima la partita?", [{ label: "Partita sul tetto del mercato", sub: "Partita secondaria · scegli tu la modalità", fn: partitaTetti }, { label: "Dopo", fn: done }], "gr_tetti");
        return say([["gr_vela", "Piove. Muoviti."]]);
      },
      gr_gancio() {
        if (S() === 2 && F.is("gr_contratto") || S() === 3 && !F.is("gr_gancio_deciso")) return ask("gr_gancio", "(Si mette fra te e l'uscita, ma non chiude il pugno.) Il contratto resta qui, Airone. Se esce, i miei uomini perdono il lavoro. Se resta, perde Marisa. (Silenzio.) Dimmi tu cosa devo fare.", [
          { label: "«Pensa ai tuoi uomini: la Nebbia li usa e poi li butta»", sub: "Parlagli · Gancio potrebbe cambiare parte", big: true, fn: () => { F.set("gr_gancio_amico", true); F.set("gr_gancio_deciso", true); bond("fiducia", 2); setStep(N, 3); K.scene([["gr_gancio", "[pensa] (Guarda il contratto a lungo. Guarda le sue mani.) Mio padre ha scaricato navi per quarant'anni. Mai preso un soldo sporco. (Si toglie il berretto.) Domenica, se serve uno grosso in difesa… chiamami."], ["voce", "Fuori, nel vicolo, una luce gialla: la torcia di un'auto della polizia."]], () => K.enterZone("gr_deposito"), "gr_deposito"); } },
          { label: "Gioca contro i Portuali", sub: "Ombre e Gadget · partita importante", cls: "hot", fn: matchGancio },
        ], "gr_deposito");
        return say([["gr_gancio", "…"]]);
      },
      gr_dora() {
        if (S() === 3) return ask("gr_dora", (F.is("gr_registro_dora") ? "(Sotto la pioggia, davanti al deposito.) Il registro mi ha portata fin qui. Ho fatto confrontare le firme: O.B. è Ottavio Brume. Il presidente della Lega del Porto. L'uomo che domenica premierà la squadra vincitrice." : "(Sotto la pioggia, davanti al deposito.) Non so cosa ci fa lei qui, e non voglio saperlo. Ma un testimone mi ha detto chi firma «O.B.»: Ottavio Brume. Il presidente della Lega del Porto. L'uomo che domenica premierà la squadra vincitrice.") + "\n\nCon il contratto posso fermarlo. Ma Brume ha amici in tribunale, e il tribunale ha tempi lunghi. La finale è domenica.", [
          { label: "«Lo fermi la legge: le do il contratto»", sub: "Prima la giustizia, poi la partita", big: true, fn: () => fine2("legge") },
          { label: "«Lo smascheriamo davanti a tutti, la notte prima della finale»", sub: "Prima la città deve sapere", big: true, fn: () => fine2("faro") },
        ], "gr_deposito");
        return say([["gr_dora", "Piove sempre, a Porto Scuro."]]);
      },
      gr_sg4() { return say([["gr_sg4", "(Conta le casse. Perde il conto. Ricomincia.)"]]); },
      gr_sg5() { return say([["gr_sg5", "(Alza la lanterna, sbuffa, la abbassa.)"]]); },
      gr_sg6() { return say([["gr_sg6", "(Si gira piano, come la lancetta di un orologio.)"]]); },
    };
    function fine2(kind) {
      if (kind === "legge") { F.set("gr_contratto_dora", true); bond("fiducia", 2); } else { F.set("gr_piano_faro", true); bond("leggenda", 2); }
      if (F.is("gr_vela_alleata")) F.add("gr_vela_fid", 1);
      questDone("gr_deposito");
      const msg = K.reward("c2:gr", { coins: 90, cos: ["gr_c2"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene([
        kind === "legge" ? ["gr_dora", "[pensa] (Mette il contratto in una busta di plastica, contro la pioggia.) Domani chiedo il mandato. Brume avrà già i suoi avvocati alla porta. (Ti guarda.) Domenica, giochi. Io ci sarò."] : ["gr_dora", "[sorpreso] Davanti a tutti? (Pensa.) La radio del faro arriva in tutta la città. Se qualcuno trasmettesse le prove la notte prima della finale… (Si tocca il cappello.) Io non ho detto niente."],
        ...(F.is("gr_vela_alleata") ? [["gr_vela", "[furbo] (Da un tetto, lontano.) Bel lavoro, Airone. Ci vediamo al faro."]] : []),
        ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «L'ultima partita della notte».`],
      ], () => K.openMain(), "gr_deposito");
    }
    const obj = {
      "gr_tetti:>": () => (S() >= 2 ? go("gr_deposito", 2, 10) : say([["voce", "Il deposito è da quella parte. Ma prima, forse, conviene capire chi c'è sui tetti."]])),
      "gr_deposito:<": () => go("gr_tetti", 31, 12),
      "gr_deposito:x:27,2": () => (S() >= 2 ? trovaContratto() : say([["voce", "Una scrivania chiusa a chiave."]])),
    };
    return { n: N, title: "I tetti di Porto Scuro", sub: "Il Rampino, Vela Nera, il contratto della finale", goal, start: "gr_tetti", introBg: "gr_tetti", zones, talk, obj,
      intro: () => [["voce", "<b>IL CAVALIERE DELLA NOTTE.</b> Capitolo 2. In fondo al registro c'è un indirizzo: «Deposito della Nebbia, oltre i tetti del mercato». A Porto Scuro, chi vuole arrivare dove non deve passa dall'alto."]] };
  }
  boot();
})();
