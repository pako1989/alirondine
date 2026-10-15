// js/ducati-c1.js - LA GUERRA DEI TRE DUCATI · Capitolo 1 «Il sale e la coppa»
// Salinella, il ducato delle miniere di sale. La Coppa dei Tre Ducati è vicina, la squadra è povera, e da Ruggine
// arriva una squadra «in visita». Poi una lettera da Vetrara: un'offerta che divide la squadra in tre.
(function () {
  "use strict";
  function boot() { const D = window.__ducati; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("td_corrado", { beard: "baffi", acc: ["fascia"], name: "Corrado Salvi, il vecchio capitano", tag: "gray", hair: "#a8a8a8", style: "slick", skin: "#e0b890", eye: "#3a3a2a", bg: ["#2a1e14", "#2a6ab8"], shirt: "#2a6ab8" },
      "Il capitano di Salinella prima di te. Ha passato la fascia, non la voce: in spogliatoio parla lui. Crede in ciò che è giusto, anche quando costa. Soprattutto quando costa.");
    K.cast("td_lia", { band: "#d97706", acc: ["bandana"], name: "Lia della Cava", tag: "", hair: "#c87a3a", style: "ponytail", skin: "#e8c4a0", eye: "#3a6a3a", bg: ["#2a1e14", "#4a7ac8"], shirt: "#4a7ac8" },
      "Figlia di minatori, ala velocissima, lingua ancora più veloce. Dice che il sale è di chi lo scava, e lo dice anche al duca, se capita.");
    K.cast("td_ottone", { acc: ["occhiali", "taccuino"], name: "Ottone Berilli, il tesoriere", tag: "", hair: "#3a2a1a", style: "ordinato", skin: "#f0d0b0", eye: "#3a3a3a", bg: ["#2a1e14", "#4a9a6a"], shirt: "#4a9a6a" },
      "Il tesoriere del ducato e mediano di riserva. Conta tutto: le monete, i passaggi, i minuti. Non è avido: è che ha visto Salinella fare la fame, e non vuole rivederla.");
    K.cast("td_anselmo", { beard: "folta", acc: ["taccuino"], name: "Frate Anselmo, il cronista", tag: "gray", hair: "#c8c8c8", style: "bald", skin: "#e8c4a0", eye: "#4a3a2a", bg: ["#2a1e14", "#8a6a3a"], shirt: "#6a5a3a" },
      "Il cronista di Salinella: scrive tutto quello che succede in un libro grande come una porta. Gioca in porta nelle partitelle, male. Conosce ogni giuramento mai fatto sull'altopiano.");
    K.cast("td_bruna", { acc: ["casco"], name: "Bruna, caposquadra della miniera", tag: "", hair: "#2a1a14", style: "bun", skin: "#c68642", eye: "#2a2a1a", bg: ["#2a1e14", "#6a5a4a"], shirt: "#6a5a4a" },
      "La caposquadra dei minatori. Mani bianche di sale, voce che rimbomba nelle gallerie. Non ha mai visto una partita della Coppa: il giorno della finale, di solito, si lavora.");
    K.cast("td_chiodo", { acc: ["guanti"], name: "Chiodo, capitano degli esploratori di Ruggine", tag: "", hair: "#1a1a1a", style: "buzz", skin: "#d9a679", eye: "#3a2a2a", bg: ["#2a1e14", "#a83a2a"], shirt: "#a83a2a" },
      "Il capitano della squadra «in visita» di Ruggine. Educato, preciso, con un taccuino dove disegna il campo di Salinella. Dice che è curiosità sportiva. Nessuno ci crede.");
    K.cos("td_c1", { kind: "shirt", label: "Maglia bianca e blu di Salinella", val: "#2a6ab8", from: "Capitolo 1 di La Guerra dei Tre Ducati" });
    K.cos("td_sigilli1", { kind: "acc", label: "Sigillo di sale al collo", val: "medaglia", from: "Trova i sigilli di sale del Capitolo 1" });
    K.lore("l_iso", { t: "Il calcio tattico", d: "Sull'altopiano si gioca su campi a terrazze. Muove chi ha più iniziativa. Dall'alto si tira e si passa meglio; il contrasto alle spalle di chi ha palla riesce quasi sempre. Chi aspetta senza muoversi torna prima." });
    const goal = (s) => ({
      0: "Piazza della Bilancia. Corrado ha visto arrivare una squadra di Ruggine «in visita». Parlagli.",
      1: "Ruggine è ripartita. Ottone, il tesoriere, ha una lettera da Vetrara.",
      2: "Prima del voto, cerca argomenti: Anselmo e i suoi giuramenti, la bacheca del municipio, Bruna nella miniera. Poi da Corrado, alla Bilancia.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      td_salinella: {
        region: "saline", name: "La Guerra dei Tre Ducati · Salinella", short: "Salinella", sub: "La piazza della Bilancia, il municipio, i coni di sale", bg: "td_salinella", time: "giorno", travel: [16, 18],
        w: 34, h: 24, start: [16, 18], itemCos: "td_sigilli1", items: [[2, 2], [31, 21]],
        areas: [[12, 8, 21, 14, "Piazza della Bilancia"], [2, 15, 13, 22, "Il campo di sale"], [0, 0, 33, 23, "Salinella"]],
        flavor: { n: "La bacheca del municipio: avvisi, tasse, un disegno della Coppa fatto da un bambino.", s: "Una panca di pietra bianca, calda di sole." },
        intro: [["voce", "Salinella. Case bianche di pietra di sale, tetti rossi, e intorno, fino all'orizzonte, le saline: specchi d'acqua che brillano come vetri rotti. Al centro della piazza, la statua della Bilancia."], ["voce", "Fra tre settimane comincia la Coppa dei Tre Ducati. Chi la vince decide a chi vanno le saline per i prossimi dieci anni. Salinella non la vince da trenta."]],
        npcs: (s) => [{ id: "td_corrado", at: [17, 13] }, { id: "td_lia", at: [9, 18] }, { id: "td_ottone", at: [25, 9] }, { id: "td_anselmo", at: [14, 10] }, ...(s === 0 ? [{ id: "td_chiodo", at: [7, 18] }] : [])],
        objects: { "26,7": () => { if (S() >= 2 && K.arg("casse")) return say([["voce", "Sulla bacheca, il bilancio del ducato firmato da Ottone: «Casse: quasi vuote. Stipendi della squadra: fino a fine Coppa, forse.» Lo copi sul taccuino. <b>Nuovo argomento: Le casse vuote (Utile).</b>"]]); say([["voce", "La bacheca del municipio: tasse del sale, turni di miniera, e il calendario della Coppa."]]); } },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a"); lay(0, 23, 33, 23, "a"); put(33, 18, ">");
          lay(12, 8, 21, 14, "&"); put(16, 11, "Q"); lay(1, 17, 32, 19, ":"); lay(16, 14, 16, 17, ":"); lay(22, 9, 26, 9, ":"); lay(22, 10, 22, 16, ":");
          house(22, 3, 6, 4, { door: [24, 6], roof: "#a83a2a", wall: "#ece8dc", rr: 2, enter: "Il municipio di Salinella: un tavolo lungo, tre sedie per tre duchi (due sempre vuote), e il libro dei conti di Ottone, aperto su una pagina piena di cifre rosse." });
          put(26, 7, "n");
          house(5, 3, 6, 4, { door: [7, 6], roof: "#a83a2a", wall: "#ece8dc", rr: 2, enter: "La casa del duca di Salinella: un uomo anziano che dorme molto e firma poco. Ha lasciato a te e alla Bilancia le decisioni sulla Coppa, «come si è sempre fatto»." });
          house(27, 13, 5, 3, { door: [29, 15], roof: "#a83a2a", wall: "#ece8dc", rr: 2, enter: "Lo spogliatoio di Salinella: panche, chiodi per le maglie, e un vecchio pallone di cuoio indurito dal sale, appeso come una reliquia." });
          lay(2, 15, 13, 22, "&"); [[3, 15], [12, 15], [3, 22], [12, 22]].forEach(([x, y]) => put(x, y, "J"));
          [[29, 2], [30, 4], [2, 9], [3, 11], [31, 9], [19, 4], [9, 12]].forEach(([x, y]) => put(x, y, "J")); [[14, 21], [26, 21], [20, 6]].forEach(([x, y]) => put(x, y, "w")); put(20, 18, "s");
        },
      },
      td_miniera: {
        region: "casa", name: "La Guerra dei Tre Ducati · La miniera", short: "La miniera di sale", sub: "Gallerie bianche, lanterne, la squadra di Bruna", bg: "td_miniera", time: "giorno", travel: [2, 10],
        w: 26, h: 18, start: [2, 10], itemCos: "td_sigilli1", items: [[23, 2]], buio: 0.42, heroLight: 3.2,
        luci: () => [[6, 4, 3, "255,210,140"], [14, 13, 3, "255,210,140"], [21, 6, 3, "255,210,140"]],
        flavor: { J: "Sale grezzo, ammucchiato in coni. Scintilla alla luce delle lanterne." },
        intro: [["voce", "La miniera di sale: gallerie bianche come l'interno di una conchiglia, scavate a mano in trecento anni. Si sente cantare, lontano: i minatori cantano per tenere il tempo dei picconi."]],
        npcs: () => [{ id: "td_bruna", at: [16, 9] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 17, "a"); lay(1, 8, 24, 11, "&"); lay(4, 2, 8, 8, "&"); lay(12, 11, 16, 15, "&"); lay(19, 2, 24, 8, "&"); put(0, 10, "<");
          [[5, 2], [8, 3], [13, 15], [24, 7], [20, 2]].forEach(([x, y]) => put(x, y, "J")); put(6, 4, "l"); put(14, 13, "l"); put(21, 6, "l");
        },
      },
    };
    function partitaRuggine() {
      K.campo({ title: "Calcio Tattico · Gli esploratori di Ruggine sul campo di sale", terrain: "saline", oppStyle: "pressing", minutes: 60,
        mates: [{ name: "Corrado", skin: "#e0b890", hair: "#a8a8a8" }, { name: "Lia", skin: "#e8c4a0", hair: "#c87a3a" }], opp: { name: "Esploratori di Ruggine", color: "#a83a2a", players: [{ name: "Chiodo", skin: "#d9a679", hair: "#1a1a1a" }, { name: "Lima", skin: "#e8c4a0", hair: "#3a2a1a" }, { name: "Bullone", skin: "#c68642", hair: "#2a1a14" }], keeper: { name: "Incudine" } },
        intro: "<p>Ruggine vuole «misurare» il vostro campo. Il campo di sale ha una collinetta al centro: chi la tiene, tira meglio. Ruggine fa <b>pressing</b>: girate intorno e prendeteli alle spalle.</p>", winTitle: "SALINELLA TIENE IL CAMPO!" }, (r) => {
        if (!r.win) return K.scene([["td_chiodo", "[pensa] (Disegna qualcosa sul taccuino.) Interessante. Ripassiamo domani, se permettete. Il campo ci piace."]], () => K.enterZone("td_salinella"), "td_salinella");
        setStep(N, 1); K.learnLore("l_iso"); bond("morale", 1);
        K.scene([["td_chiodo", "[sorpreso] (Chiude il taccuino.) Il nostro duca sarà… interessato. Salinella gioca meglio di quanto sembri. (Si inchina appena.) Ci vediamo alla Coppa."], ["td_corrado", "[pensa] Non sono venuti a giocare. Sono venuti a guardare le saline. Ruggine ha fame di sale, e il ferro, da solo, non si mangia."]], () => K.enterZone("td_salinella"), "td_salinella");
      });
    }
    function allenamento() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => { if (r && r.win && !F.is("td_all1")) { F.set("td_all1", true); K.reward("td_all1", { coins: 30 }); } K.scene([["td_lia", r && r.win ? "[felice] Visto? Sulle saline si corre come sul ghiaccio, ma noi ci siamo nati." : "[ride] Il sale ti brucia gli occhi, eh? Si impara."]], () => K.enterZone("td_salinella"), "td_salinella"); };
      ask("td_lia", "Ci alleniamo sul campo di sale? I minatori del turno di notte contro di noi. Come la giochiamo?", [
        { label: "Calcio tattico", sub: "La partita della saga, sul campo a terrazze", cls: "hot", fn: () => K.campo({ title: "Calcio Tattico · Allenamento con i minatori", terrain: "saline", oppStyle: "equilibrata", minutes: 45, mates: [{ name: "Lia" }, { name: "Ottone" }], opp: { name: "I minatori del turno di notte", color: "#6a5a4a", players: [{ name: "Piccone" }, { name: "Lanterna" }, { name: "Carrello" }], keeper: { name: "Bruna" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "td_allenamento", alt: "az,cage,hd", force: false, oppTeam: "I minatori", oppColor: "#6a5a4a", us: "Salinella", homeKit: ["#2a6ab8", "#ece8dc"], mate: "Lia della Cava", squad: ["Lia della Cava", "Ottone Berilli", "Frate Anselmo"], chap: "La Guerra dei Tre Ducati · Allenamento sul sale", bg: "td_salinella", oppNames: ["Piccone", "Lanterna", "Carrello", "Bruna", "Galleria"], intro: "Sul campo di sale, sotto il sole: il pallone rimbalza duro, e i minatori non mollano mai.", done: after }) },
        { label: "Dopo", fn: done },
      ], "td_salinella");
    }
    function voto() {
      K.bilancia({ id: "v1", title: "La Bilancia · L'offerta di Vetrara", q: "La Marchesa di Vetrara offre di comprare metà delle miniere: con quei soldi la squadra arriva alla Coppa. Oppure si rifiuta, come vuole il giuramento. Oppure le miniere vanno a chi le scava.",
        opts: [{ id: "vendi", label: "Vendere metà miniere", conv: "utile" }, { id: "rifiuta", label: "Rifiutare l'offerta", conv: "morale" }, { id: "minatori", label: "Le miniere ai minatori", conv: "liberta" }],
        voters: ["td_corrado", "td_lia", "td_ottone", "td_anselmo"], done: (w) => fine1(w) });
    }
    const talk = {
      td_corrado() {
        const s = S();
        if (s === 0) return say([["td_corrado", "[pensa] (Guarda verso il campo di sale.) Vedi quelli in rosso? Squadra di Ruggine, «in visita». Dicono che vogliono un'amichevole. Io dico che vogliono vedere quanto vale il nostro sale. Il loro capitano, Chiodo, è laggiù. Facciamogli vedere quanto valiamo noi."]]);
        if (s === 2) return ask("td_corrado", `(Accanto alla statua della Bilancia.) È il momento di pesare. Siamo in quattro a votare: io, Lia, Ottone, Anselmo. Tu sei il capitano: non voti, ma puoi parlare a ciascuno di noi prima. Con gli argomenti giusti.\n\nArgomenti che hai: ${K.args().length}.`, [
          { label: "Alla Bilancia", sub: "Il voto sull'offerta di Vetrara", cls: "hot", big: true, fn: voto }, { label: "Prima cerco argomenti", fn: done }], "td_bilancia");
        return say([["td_corrado", s === 1 ? "Ottone ti cerca. Ha una lettera, e la faccia di chi porta brutte notizie con la carta buona." : "Il sale ci ha fatti. Non ci faremo vendere col sale."]]);
      },
      td_chiodo() {
        if (S() === 0) return ask("td_chiodo", "(Ti stringe la mano, educatissimo.) Chiodo, di Ruggine. Un'amichevole, solo per conoscerci. (Guarda le saline, non te.) Il vostro campo ha una collinetta al centro. Curioso.", [{ label: "Gioca contro Ruggine", sub: "Calcio tattico · partita importante", cls: "hot", fn: partitaRuggine }, { label: "Non ancora", fn: done }], "td_salinella");
        return say([["td_chiodo", "Ci vediamo alla Coppa."]]);
      },
      td_ottone() {
        if (S() === 1) return K.scene([["td_ottone", "[pensa] (Sventola una lettera con il sigillo verde.) La Marchesa Cristallina, da Vetrara. Offre di comprare metà delle miniere. Con quei soldi paghiamo la squadra fino alla finale, le scarpe nuove, il viaggio. Senza… (sfoglia il libro dei conti) senza, non so."], ["td_ottone", "Si decide alla Bilancia, come sempre. Io voterò per vendere: non perché mi piace, ma perché i numeri sono numeri. (Ti guarda.) Se vuoi farmi cambiare idea, portami un numero migliore."]], () => { setStep(N, 2); quest("td_voto1", "La Bilancia: l'offerta di Vetrara", "Cerca argomenti, poi vai da Corrado alla statua della Bilancia."); done(); }, "td_salinella");
        return say([["td_ottone", S() >= 2 ? "La bacheca del municipio: ho appeso il bilancio. Leggilo, prima di votare." : "Le monete non mentono. Le persone, a volte."]]);
      },
      td_anselmo() {
        if (S() >= 2 && !F.is("td_arg_giuramento")) return say([["td_anselmo", "[pensa] (Apre il librone.) Pagina uno. Il primo duca di Salinella, sulla prima pietra della miniera, giurò: «Il sale non si vende a chi lo vuole per forza». Trecento anni fa. Nessuno l'ha mai disdetto."]], () => { K.arg("giuramento"); say([["voce", "<b>Nuovo argomento: Il giuramento del sale (Morale).</b>"]]); });
        return say([["td_anselmo", "Scrivo tutto. Anche quello che non vorreste."]]);
      },
      td_lia() {
        if (S() >= 1) return ask("td_lia", S() >= 2 ? "Se vuoi un argomento vero, scendi in miniera e parla con Bruna. Il sale lo scavano loro. E intanto: ci alleniamo?" : "Hai visto Chiodo? Disegnava le nostre saline. Io gli avrei tirato il pallone in faccia. Per sbaglio.", [{ label: "Allenamento sul sale", sub: "Partita secondaria · scegli tu la modalità", fn: allenamento }, { label: "Dopo", fn: done }], "td_salinella");
        return say([["td_lia", "Ruggine. Sempre a guardare le cose degli altri."]]);
      },
      td_bruna() {
        if (S() >= 2 && !F.is("td_arg_paga")) return say([["td_bruna", "[arrabbiato] (Posa il piccone.) La Coppa? Il duca, Vetrara, la Bilancia… (Si pulisce il sale dalle mani.) Il sale lo scaviamo noi. Da trecento anni. Perché devono deciderlo loro, a chi va? Diglielo, al tuo capitano, alla tua Bilancia."]], () => { K.arg("paga"); say([["voce", "<b>Nuovo argomento: La paga dei minatori (Libertà).</b>"]]); });
        return say([["td_bruna", "Qui sotto si lavora. Se vuoi una partita, torna di domenica. Ah no: la domenica si lavora."]]);
      },
    };
    function fine1(w) {
      bond(w === "vendi" ? "utile" : w === "rifiuta" ? "morale" : "liberta", 1); questDone("td_voto1");
      const msg = K.reward("c1:td", { coins: 70, cos: ["td_c1"] }); finishChapter(N, w); setStep(N, 5);
      const l = {
        vendi: [["td_ottone", "[sorpreso] (Rilegge il risultato due volte.) Vendere. Metà. (Chiude il libro.) Lo scriverò bene, il contratto. Nessuno ci fregherà sui numeri."], ["td_corrado", "[triste] La Bilancia ha deciso. Io l'accetto. Non vuol dire che mi piaccia."]],
        rifiuta: [["td_corrado", "[felice] Rifiutiamo. (Stringe la fascia.) Arriveremo alla Coppa con le scarpe rotte, ma ci arriveremo con la testa alta."], ["td_ottone", "[pensa] Con le scarpe rotte. Ecco. Lo scrivo nel bilancio."]],
        minatori: [["td_lia", "[felice] Ai minatori! (Salta sulla panca.) Bruna non ci crederà. Il duca nemmeno. Ma la Bilancia ha parlato!"], ["td_anselmo", "[pensa] (Scrive, a lungo.) Trecento anni di giuramenti, e oggi una pagina nuova. Interessante."]],
      }[w];
      K.scene([...l, ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il ponte di vetro».`]], () => K.openMain(), "td_bilancia");
    }
    const obj = {
      "td_salinella:>": () => go("td_miniera", 1, 10),
      "td_miniera:<": () => go("td_salinella", 32, 18),
    };
    return { n: N, title: "Il sale e la coppa", sub: "Gli esploratori di Ruggine, l'offerta di Vetrara, la prima Bilancia", goal, start: "td_salinella", introBg: "td_titolo", zones, talk, obj,
      intro: () => [["voce", "<b>LA GUERRA DEI TRE DUCATI.</b> Capitolo 1. Sull'altopiano del sale ci sono tre ducati e una coppa. Le guerre, qui, si combattono su un campo da calcio. Le decisioni, su una bilancia."]] };
  }
  boot();
})();
