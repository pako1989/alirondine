// js/stagione-c1.js - STAGIONE INFINITA · Capitolo 1 «Domenica, ancora»
// Lago Lungo, domenica, otto del mattino. La piazza con l'orologio, la radio di Mira, la videoteca di Lucio, il lungolago
// con il molo, e in fondo «Il Lido», lo stadio che domani chiude. Alle 19 la finale. Poi il nastro si riavvolge.
// Alla seconda domenica, Ada la custode dice la frase che cambia tutto: «Anche tu te lo ricordi?».
(function () {
  "use strict";
  function boot() { const D = window.__stagione; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N), O = () => K.ora(), G = () => K.giro();

    K.cast("sf_ada", { acc: ["chiave", "sciarpa"], name: "Ada, custode del Lido", tag: "gray", hair: "#d8d8e0", style: "bob", skin: "#e8c4a0", eye: "#3a5a6a", bg: ["#1a1a24", "#e8c84a"], shirt: "#3a4a6a" },
      "Custode dello stadio «Il Lido» da quarantadue anni. Apre i cancelli alle otto, li chiude dopo l'ultima partita, conta i seggiolini rotti e li chiama per nome. Domani, per la prima volta, non avrà niente da aprire.");
    K.cast("sf_bruno", { acc: ["fischietto"], name: "Mister Bruno", tag: "gray", hair: "#8a8a8a", style: "buzz", skin: "#d9a679", eye: "#3a3a3a", bg: ["#2a2a1a", "#e8c84a"], shirt: "#e8c84a", beard: true },
      "L'allenatore della tua squadra, l'Atletico Lago Lungo. Burbero, preciso, ripete i discorsi pre-partita parola per parola da vent'anni: «Così porta bene». Stasera porta bene di sicuro. Stasera, e stasera, e stasera.");
    K.cast("sf_mira", { acc: ["cuffie"], name: "Mira, Radio Lago", tag: "", hair: "#2a1a2a", style: "ponytail", skin: "#c68642", eye: "#2a2a1a", bg: ["#2a1020", "#ff5a7a"], shirt: "#ff5a7a" },
      "La voce di Radio Lago. Trasmette tutte le partite dal tetto del bar, con una cuffia rattoppata e un microfono del 1979. Dice che le parole giuste, in radio, arrivano sempre un secondo prima del gol.");
    K.cast("sf_teo", { acc: ["fascia"], name: "Teo, capitano del Real Lago", tag: "", hair: "#3a2a1a", style: "messy", skin: "#e0b890", eye: "#2a4a6a", bg: ["#10203a", "#5a8ad8"], shirt: "#5a8ad8" },
      "Capitano del Real Lago, la squadra avversaria della finale. Il tuo rivale da sempre, il tuo amico da prima ancora. Stamattina ha in tasca un biglietto del treno, e non l'ha detto a nessuno.");
    K.cast("sf_lucio", { acc: ["occhiali"], name: "Lucio della videoteca", tag: "gray", hair: "#5a4a3a", style: "slick", skin: "#e8d0b8", eye: "#3a3a5a", bg: ["#1a1a2a", "#9ad8ff"], shirt: "#3a3a5a" },
      "Gestisce l'ultima videoteca del lago. Ha registrato tutte le finali del Lido dal 1982, su cassette con le etichette scritte a mano. Una sola è rovinata, proprio sul più bello.");
    K.cast("sf_gatto", { shape: "gatto", name: "Il gatto rosso", tag: "", hair: "#c86a1a", skin: "#e8963a", eye: "#5ab84a", bg: ["#2a1a10", "#e8963a"], shirt: "#e8963a" },
      "Un gatto rosso senza collare. Ogni domenica è in un posto diverso, e questa è una cosa strana: in una domenica che si ripete, tutti fanno sempre le stesse cose. Tutti tranne lui.");
    K.cos("sf_c1", { kind: "shirt", label: "Maglia gialla dell'Atletico Lago Lungo", val: "#e8c84a", from: "Capitolo 1 di Stagione Infinita" });
    K.cos("sf_biglietti", { kind: "hairc", label: "Capelli Foglia d'Autunno", val: "#c8742a", from: "Trova tutti i biglietti del Lido" });
    K.lore("l_giro", { t: "La domenica che si ripete", d: "Alle 19 la finale. Al tramonto, qualunque cosa succeda, il nastro si riavvolge: domenica, otto del mattino. Le cose della giornata si cancellano. I ricordi no." });
    K.lore("l_fantasmi", { t: "I fantasmi della finale", d: "Il Real Lago gioca sempre la stessa partita, mossa per mossa. Ogni bivio che hai già visto lascia un fantasma: la volta dopo sai dove andranno. La memoria della finale non si riavvolge." });

    const goal = (s) => ({
      0: "È domenica: stasera alle 19 la finale al Lido (a est della piazza). Fai un giro, parla con la gente; l'orologio della piazza fa passare il tempo.",
      1: "È di nuovo domenica. Di nuovo le otto. Qualcuno, a Lago Lungo, deve sapere qualcosa: Ada, la custode del Lido (al mattino ai cancelli, a mezzogiorno al bar).",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    // ------------------------------------------------------------ gli orari: chi sta dove, a ogni fascia
    const SCHED = {
      sf_piazza: [
        [["sf_bruno", 6, 9], ["sf_mira", 15, 9], ["sf_teo", 24, 20]],
        [["sf_bruno", 8, 10], ["sf_ada", 10, 10], ["sf_mira", 13, 13], ["sf_teo", 27, 9]],
        [["sf_mira", 12, 17]],
        [],
      ],
      sf_stadio: [[["sf_ada", 2, 13]], [], [["sf_ada", 14, 3], ["sf_bruno", 15, 17], ["sf_teo", 20, 10]], [["sf_ada", 6, 18], ["sf_bruno", 15, 17], ["sf_mira", 24, 18], ["sf_teo", 20, 8], ["sf_lucio", 10, 18]]],
      sf_videoteca: [[["sf_lucio", 10, 4]], [["sf_lucio", 10, 4]], [["sf_lucio", 10, 4]], []],
    };
    const npcsOf = (zid) => () => [...SCHED[zid][O()].map(([id, x, y]) => ({ id, at: [x, y] })), ...K.gattoNpc(zid)];
    K.SCHED = SCHED;
    const time = () => K.TOD[O()];
    const zones = {
      sf_piazza: {
        region: "lago", name: "Stagione Infinita · Piazza del Lago", short: "Piazza del Lago", sub: "L'orologio, la radio, la videoteca", bg: "sf_piazza", time, travel: [18, 16],
        w: 36, h: 24, start: [18, 16], itemCos: "sf_biglietti", items: [[2, 10], [33, 15], [2, 15]],
        areas: [[23, 19, 25, 23, "Il molo"], [1, 17, 34, 18, "Il lungolago"], [8, 9, 28, 15, "Piazza del Lago"], [0, 0, 35, 23, "Lago Lungo"]],
        act: { ">": "Vai al Lido" },
        flavor: { Y: "La fontana della piazza. Sul fondo, monetine di tutte le epoche. Una è di domani: c'è scritto «lunedì». Quando la guardi meglio, non c'è più.", R: "L'antenna di Radio Lago, sul tetto. La luce rossa «IN ONDA» lampeggia a tempo con il tuo cuore. O il contrario." },
        intro: [["voce", "Lago Lungo, ultima domenica di settembre. Le foglie dei platani sono arancioni, il lago è fermo, e in piazza c'è odore di caffè e di castagne."], ["voce", "Stasera alle 19 la finale della Coppa del Lago: Atletico Lago Lungo contro Real Lago. L'ultima partita al Lido, lo stadio vecchio. Domani lo chiudono."]],
        npcs: npcsOf("sf_piazza"),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 0, 0, 18, "a"); lay(35, 0, 35, 18, "a"); lay(0, 19, 35, 23, "w"); lay(23, 19, 25, 22, "="); put(35, 12, ">"); lay(29, 12, 34, 12, ":");
          lay(8, 9, 28, 15, "+"); lay(1, 17, 34, 18, ":");
          house(3, 3, 7, 5, { door: [6, 7], roof: "#a85a3a", wall: "#f0e0c8", rr: 3, lit: true, enter: "Il Bar del Lago. Le stesse tazzine, le stesse brioche, la stessa canzone alla radio. Il barista ti porge il caffè prima che tu lo chieda: «Come ieri, no?»." }); lay(6, 8, 6, 8, ":");
          house(13, 3, 6, 5, { door: [15, 7], roof: "#5a3a5a", wall: "#e8d8d8", rr: 3, lit: true, enter: "Lo studio di Radio Lago: un tavolo, due microfoni, una tazza con scritto «IN ONDA». Sulla parete, un calendario fermo a settembre. Di quale anno, non si capisce." }); lay(15, 8, 15, 8, ":"); put(20, 3, "R");
          house(24, 3, 8, 5, { door: [27, 7], roof: "#2a3a5a", wall: "#d8d8e8", rr: 3, lit: true, enter: { to: "sf_videoteca", at: [10, 10] } }); lay(27, 8, 27, 8, ":");
          put(18, 11, "Q"); put(18, 14, "Y"); put(30, 16, "s");
          [[2, 2], [11, 2], [22, 2], [33, 2], [33, 8], [2, 8], [30, 14], [6, 14]].forEach(([x, y]) => put(x, y, "t"));
        },
        decor(g, cx, cy, d) { // le foglie che cadono, sempre le stesse, sempre alla stessa ora
          for (let i = 0; i < 8; i++) { const t = (d.fr * 0.4 + i * 40) % 220; g.fillStyle = ["#d88a3a", "#c8642a", "#e8a84a"][i % 3]; g.fillRect(d.X(2 + i * 4) + Math.sin(t / 15 + i) * 6, d.Y(1) + t, 2, 1.5); }
        },
      },
      sf_stadio: {
        region: "stadio", name: "Stagione Infinita · Il Lido", short: "Il Lido", sub: "Lo stadio che domani chiude", bg: "sf_stadio", time, travel: [2, 11],
        w: 30, h: 22, start: [2, 11], items: [[27, 20]],
        areas: [[4, 4, 25, 15, "Il campo del Lido"], [0, 0, 29, 21, "Il Lido"]], act: { "<": "Torna in piazza", j: "Guarda le tribune", g: "Guarda la porta" },
        flavor: { j: ["Le tribune di legno del Lido. Ogni seggiolino ha un nome scritto a pennarello, da Ada: «Gino», «Gina», «Quello che cigola».", "Un seggiolino nuovo, l'unico. Ada dice che è per chi verrà dopo."], g: "La porta del Lido: le reti rammendate tante volte da sembrare una mappa. Da domani, nessuno la rammenderà più." },
        intro: [["voce", "Il Lido: tribune di legno, un tabellone a mano con i numeri di latta, il campo con l'erba un po' stanca. Domani arrivano le ruspe. Oggi è tutto pronto per la finale, come se niente fosse."]],
        npcs: npcsOf("sf_stadio"),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 21, 29, 21, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a"); put(0, 11, "<"); lay(1, 11, 3, 11, ":");
          lay(3, 1, 26, 2, "j"); lay(4, 4, 25, 15, "-"); put(4, 9, "g"); put(4, 10, "g"); put(25, 9, "g"); put(25, 10, "g");
          lay(1, 17, 28, 19, ":"); [[8, 20], [12, 20], [18, 20], [22, 20]].forEach(([x, y]) => put(x, y, "b")); put(27, 16, "s");
        },
        decor(g, cx, cy, d) { // il tabellone a mano: CASA · OSPITI, con i numeri di latta
          const x = d.X(12), y = d.Y(1) - 14; g.fillStyle = "#1a1a1a"; g.fillRect(x, y, 96, 14); g.fillStyle = "#e8c84a"; g.font = "bold 7px 'Courier New', monospace"; g.fillText("LAGO LUNGO 0 · 0 REAL LAGO", x + 4, y + 10);
        },
      },
      sf_videoteca: {
        interior: true, region: "casa", name: "Stagione Infinita · La videoteca di Lucio", short: "La videoteca", sub: "Tutte le finali del Lido, su cassetta", bg: "sf_videoteca", w: 20, h: 13, start: [10, 10], outside: ["sf_piazza", 27, 8],
        act: { L: "Guarda le cassette", T: "Guarda il televisore", W: "Guarda dalla vetrina", v: "Esci" },
        flavor: { L: ["Cassette in fila, con le etichette scritte a mano: «Finale 1982», «Finale 1983»… fino a «Finale di ieri». L'ultima è vuota: «Finale di oggi».", "«Finale 1986 — ROVINATA, NON PRESTARE». Lucio dice che si rovina proprio nel momento decisivo."], T: "Il televisore della videoteca trasmette sempre la stessa cosa: un'azione del Lido, al rallentatore, avanti e indietro. Avanti e indietro.", W: "Dalla vetrina si vede la piazza. Il barista porta lo stesso caffè alla stessa signora. La signora fa lo stesso sorriso." },
        intro: [["voce", "La videoteca: scaffali di cassette fino al soffitto, un televisore a tubo con il ronzio, e un uomo con gli occhiali che riavvolge un nastro con la matita, perché il videoregistratore è rotto da anni."]],
        npcs: npcsOf("sf_videoteca"),
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(2, 1, 8, 1, "L"); lay(12, 1, 17, 1, "L"); lay(2, 5, 2, 9, "L"); put(5, 7, "T"); put(14, 1, "W"); put(17, 10, "s"); },
      },
    };
    // ------------------------------------------------------------ la finale (la usano tutti i capitoli)
    K.finale = (o) => {
      const mems = ["mem_teo", "mem_mira", "mem_lucio"].filter((k) => F.is(k)).length;
      K.ownMatch(window.__nastro.start, {
        oppStyle: o.style || "equilibrata", title: "Il Nastro · Finale della Coppa del Lago", us: "Atletico Lago Lungo", usColor: "#e8c84a", seed: "lido", memory: K.nastroMem(), rewinds: 1 + mems + (o.rewinds || 0), actions: 6,
        mates: [{ name: "Gigi" }, { name: "Vale" }], opp: { name: "Real Lago", color: "#5a8ad8" },
        intro: o.intro || "<p>La finale, al Lido. Il Real Lago gioca <b>sempre la stessa partita</b>: ogni bivio che vedi, lo ricorderai.</p>", winTitle: "CAMPIONI DEL LAGO",
        done: (r) => { K.saveNastro(r.data && r.data.mem); (o.done || (() => {}))(r); },
      });
    };
    const finale1 = () => K.finale({ done: (r) => {
      K.scene([["voce", r.win ? "Fischio finale. Avete vinto! La Coppa del Lago, l'ultima del Lido, alzata sotto le luci. Mira grida in radio, Ada piange in tribuna, Bruno ti abbraccia così forte che ti scricchiola una costola." : "Fischio finale. Il Real Lago vince. Teo ti dà la mano, poi ti abbraccia, e per un attimo sembra che voglia dirti qualcosa. Non lo dice."], ["voce", "Il sole tramonta dietro il lago. Le luci del Lido si spengono, una dopo l'altra, come al solito."], ["voce", "Poi, invece del buio, un fruscio. Righe bianche. Un ronzio da videoregistratore. E le luci si riaccendono al contrario."]], () => {
        setStep(N, 1); K.learnLore("l_giro"); K.learnLore("l_fantasmi");
        K.rewindDay(() => say([["voce", "Domenica. Otto del mattino. Le foglie dei platani, il caffè, le castagne. Il barista che ti porge il caffè: «Come ieri, no?»."], ["voce", "Come ieri. Esattamente come ieri."]]));
      }, "sf_stadio");
    } });
    const deja = () => (G() >= 2 ? " (Le stesse parole di ieri. Identiche, fino all'ultima virgola.)" : "");
    const talk = {
      sf_bruno() {
        if (O() === 3) return ask("sf_bruno", `Ci siamo. L'ultima partita al Lido. Non vi dirò niente di speciale: vi dirò quello che vi dico da vent'anni, perché porta bene. Giocate semplice, passate la palla, e se il cuore vi batte forte… lasciatelo battere.${deja()}`, [{ label: "Gioca la finale", sub: "Il Nastro · contro il Real Lago", cls: "hot", fn: S() === 0 ? finale1 : () => K.finale({ done: (r) => K.scene([["voce", r.win ? "Avete vinto, di nuovo. E di nuovo, al tramonto, il fruscio." : "Il Real Lago vince, di nuovo. E di nuovo, al tramonto, il fruscio."]], () => K.rewindDay(() => say([["voce", "Domenica. Otto del mattino. Di nuovo."]])), "sf_stadio") }) }, { label: "Non ancora", fn: done }], "sf_stadio");
        return say([["sf_bruno", O() < 2 ? `Stasera alle sette, al Lido. Arriva presto, che voglio vederti scaldare. Voglio vedere tutti scaldare. Anche il pallone.${deja()}` : `Il campo è pronto. Io sono pronto. Tu sei pronto? Alle sette.${deja()}`]]);
      },
      sf_mira() {
        const t = [`(Alla finestra della radio, con la cuffia) «Buongiorno Lago Lungo! È domenica, sono le otto, e stasera si gioca l'ultima finale del Lido!» …Oh, ciao. Stasera trasmetto io, ovviamente. Come sempre.`, `(Al tavolino del bar) Sto preparando la frase per il gol. La frase giusta, quella che resta. Ci provo da vent'anni e non mi viene mai.`, `(Sul lungolago, guarda l'acqua) Il mio microfono è del 1979. Ha trasmesso trentasei finali al Lido. Stasera è la trentasettesima. L'ultima.`, `Sono in cabina! Cioè, sul tetto del bar con un ombrello. Buona partita.`][O()];
        return say([["sf_mira", t + deja()]]);
      },
      sf_teo() {
        const t = [`(Tira sassi piatti nel lago dal molo) Uno, due, tre rimbalzi. Il mio record è sette. Stamattina non ci riesco.`, `(Davanti alla videoteca) Stavo… guardando le cassette delle vecchie finali. Niente. Così. Ci vediamo stasera, rivale.`, `(Palleggia da solo sul campo del Lido) Mi alleno. L'ultima volta qui. Voglio ricordarmi com'è.`, `Stasera vi battiamo. O voi battete noi. Comunque vada, è stato bello. (Lo dice come se fosse un addio.)`][O()];
        return say([["sf_teo", t + deja()]]);
      },
      sf_lucio() { return say([["sf_lucio", (O() < 3 ? "Benvenuto! Abbiamo tutte le finali del Lido dal 1982. Tranne il 1986: quella è rovinata, proprio sul gol. Peccato, era la più bella. Chi c'era dice che era la più bella." : "Ho portato la telecamera. Registro l'ultima. Così domani, quando il Lido non c'è più, almeno c'è la cassetta.") + deja()]]); },
      sf_ada() {
        if (S() === 1) return ask("sf_ada", "(Ti guarda a lungo. Poi abbassa la voce.) …Ieri hai giocato la finale. E stamattina il barista ti ha detto «come ieri». E tu hai fatto quella faccia. La faccia di chi se lo ricorda.\n\nAnche tu te lo ricordi?", [
          { label: "«Sì. È la seconda domenica»", sub: "Dille la verità", big: true, fn: () => reveal(true) },
          { label: "«Ricordo… cosa?»", sub: "Fai finta di niente (per ora)", big: true, fn: () => reveal(false) },
        ], O() === 1 ? "sf_piazza" : "sf_stadio");
        const t = [`(Apre i cancelli con un mazzo di chiavi enorme) Buongiorno. Il Lido apre alle otto, come da quarantadue anni. Domani no. Domani…`, `(Al bar, con un tè) Un tè, alle dodici. Sempre lo stesso tavolo. Da quarantadue anni, tranne quando c'erano le partite di mezzogiorno.`, `(In tribuna, conta i seggiolini) Trecentododici. Trecentotredici. Quello che cigola. Ci sono tutti.`, `Ultima partita. Ho stirato la bandiera. Non piango, guarda. Non piango.`][O()];
        return say([["sf_ada", t + deja()]]);
      },
      sf_gatto() {
        const spot = (G() - 1) % 4, first = !F.is("mem_gatto_" + spot); F.set("mem_gatto_" + spot, true);
        const n = [0, 1, 2, 3].filter((k) => F.is("mem_gatto_" + k)).length;
        return say([["sf_gatto", "Miao."], ["voce", `${first ? "Il gatto rosso ti guarda come se ti conoscesse da tante domeniche. " : ""}È l'unico, a Lago Lungo, che oggi non sta dove stava ieri.${n > 1 ? ` (L'hai trovato in ${n} posti diversi, in ${n} domeniche diverse.)` : ""}`]]);
      },
    };
    function reveal(truth) {
      K.scene([["sf_ada", truth ? "[sorpreso] Lo sapevo. Lo sapevo! (Si siede, le tremano le mani.) Sono quarantadue domeniche che rivivo questa domenica. Quarantadue. Ho contato i seggiolini ogni volta. Sono sempre trecentotredici." : "[furbo] Mh. Allora te lo dico io, e tu fai finta di non saperlo: questa domenica si ripete. Io lo so da quarantadue domeniche. Tu da due. Si vede da come guardi il barista."], ["sf_ada", "[pensa] All'inizio pensavo fosse colpa mia: non voglio che il Lido chiuda. Ma non basta un dispiacere, per fermare il tempo. Ci vuole qualcuno che non è pronto. Più di uno."], ["sf_ada", "Tre persone, oggi, hanno qualcosa in sospeso. Lo so perché le guardo da quarantadue domeniche: ogni sera, alla finale, hanno la stessa faccia. Teo, Mira, e Lucio. Finché non sono pronti loro, lunedì non arriva."], ["voce", "<b>Ada ricorda i giri, come te.</b> I suoi ricordi, d'ora in poi, restano con i tuoi."]], () => {
        bond("ada", truth ? 3 : 1); F.set("mem_ada", true); setStep(N, 2); quest("sf_tre", "Tre persone non sono pronte", "Teo, Mira e Lucio hanno qualcosa in sospeso. Ognuno ha i suoi orari.");
        const msg = K.reward("c1:sf", { coins: 60, cos: ["sf_c1"] }); finishChapter(N, truth ? "verita" : "finta"); setStep(N, 5);
        say([["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Tre domeniche».`]], () => K.openMain());
      }, O() === 1 ? "sf_piazza" : "sf_stadio");
    }
    const obj = {
      "sf_piazza:>": () => go("sf_stadio", 2, 11), "sf_stadio:<": () => go("sf_piazza", 34, 12),
    };
    return { n: N, title: "Domenica, ancora", sub: "La finale al Lido, e il nastro che si riavvolge", goal, start: "sf_piazza", introBg: "sf_piazza", zones, talk, obj,
      intro: () => [["voce", "<b>STAGIONE INFINITA.</b> ▶ PLAY. Domenica, otto del mattino. La sveglia, la finestra, il lago."]] };
  }
  boot();
})();
