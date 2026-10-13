// js/titano-c2.js - IL FIGLIO DEL TITANO · Capitolo 2 «Il segreto del Titano»
// Una notte, sul molo di Altamira, cade una stella. Dentro c'è una ragazza con l'armatura di Elyon e una notizia:
// fra tre giorni arriva la Grande Raccolta. E tuo padre lo sapeva da vent'anni.
(function () {
  "use strict";
  function boot() { const D = window.__titano; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, go } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("ft_vega", { acc: ["fascia"], name: "Vega, guardiana di Elyon", tag: "", hair: "#c8d8ff", style: "ponytail", skin: "#f4e4f0", eye: "#7a5ad8", bg: ["#14183a", "#7a5ad8"], shirt: "#7a5ad8" },
      "Una guardiana di Elyon, mandata in avanscoperta. Ha l'armatura leggera, la voce seria e un pallone di luce che non lascia mai. Su Elyon è la migliore della sua generazione. Sulla Terra non sa nemmeno cos'è una pizza.");
    K.cos("ft_c2", { kind: "acc", label: "Distintivo con la cometa", val: "medaglia", from: "Capitolo 2 di Il Figlio del Titano" });
    K.cos("ft_anelli2", { kind: "acc", label: "Anello di nuvola d'argento", val: "fiore", from: "Trova gli anelli di nuvola del porto" });
    K.lore("l_raccolta", { t: "La Grande Raccolta", d: "Ogni cento anni Elyon sceglie i migliori atleti di un pianeta e li porta via per il Torneo Eterno, una partita che non finisce mai. Non c'è violenza: c'è un invito a cui non si può dire di no. Un pianeta lo decide con una partita, la Partita del Cielo." });
    const goal = (s) => ({
      0: "Il molo di Altamira, di notte. Qualcosa è caduto in mare, con una scia di luce viola.",
      1: "Vega, la guardiana di Elyon, aspetta una tua risposta sul molo.",
      2: "Tuo padre è arrivato sul molo. È il momento delle domande.",
      3: "Tua madre ti cerca al molo. Sa che sei uscito di notte. Non sa perché.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      ft_porto: {
        region: "porto", name: "Il Figlio del Titano · Il molo di Altamira", short: "Il molo", sub: "Barche, gru, e una stella caduta in mare", bg: "ft_porto", time: "notte", travel: [16, 20],
        w: 34, h: 23, start: [16, 20], itemCos: "ft_anelli2", items: [[2, 2], [31, 15]],
        areas: [[10, 3, 23, 9, "La punta del molo"], [0, 0, 33, 22, "Il molo di Altamira"]],
        flavor: { l: "Un lampione del molo. Il mare, sotto, riflette la luce viola della stella caduta." },
        intro: [["voce", "Il molo di Altamira, di notte. Barche addormentate, gru ferme, l'odore del sale. In mezzo al mare, vicino alla punta, brilla qualcosa di viola. E qualcosa nuota verso la riva."]],
        npcs: (s) => [{ id: "ft_vega", at: [16, 7] }, ...(s >= 2 ? [{ id: "ft_atlante", at: [20, 8] }] : []), ...(s >= 3 ? [{ id: "ft_nora", at: [14, 18] }] : []), { id: "ft_sam", at: [6, 19] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 22, "w"); lay(1, 14, 32, 21, ":"); lay(14, 3, 18, 13, ":"); lay(10, 3, 23, 9, ":"); lay(1, 1, 5, 13, ":"); lay(28, 10, 32, 21, ":"); lay(1, 1, 13, 2, ":");
          house(25, 16, 6, 4, { door: [27, 19], roof: "#3a6ac8", wall: "#d8dce8", rr: 2, enter: { to: "ft_agenzia", at: [7, 9] } });
          [[11, 15], [20, 15], [6, 8], [30, 12]].forEach(([x, y]) => put(x, y, "l")); [[2, 17], [3, 17], [22, 19]].forEach(([x, y]) => put(x, y, "u")); put(18, 20, "s");
        },
      },
      ft_agenzia: {
        interior: true, region: "casa", name: "Il Figlio del Titano · La sala radar dell'Agenzia", short: "La sala radar", sub: "Schermi, mappe del cielo, e Cecile che non dorme mai", bg: "ft_agenzia", w: 16, h: 12, start: [7, 9], outside: ["ft_porto", 27, 20],
        act: { U: "Guarda la console", T: "Guarda il tavolo", v: "Esci" },
        flavor: { T: "Un tavolo pieno di fascicoli. Sul primo: «VARO, ATLANTE — 20 ANNI DI DOMANDE SENZA RISPOSTA»." },
        intro: [["voce", "La sala radar dell'Agenzia Celeste: schermi verdi, puntini che si muovono, il ronzio dei computer. Cecile è qui anche di notte. Forse soprattutto di notte."]],
        npcs: () => [{ id: "ft_cecile", at: [8, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(2, 1, 13, 1, "U"); lay(5, 6, 10, 6, "T"); },
      },
    };
    function partitaVega() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => { if (r && r.win) F.add("ft_vega_fid", 1); K.scene([["ft_vega", r && r.win ? "[sorpreso] Su Elyon nessuno mi batte da tre anni. (Si sistema la fascia.) La Terra è… interessante." : "[furbo] Su Elyon si gioca così da diecimila anni. Non te la prendere."]], () => K.enterZone("ft_porto"), "ft_porto"); };
      ask("ft_vega", "Su Elyon ci si conosce giocando. Una partita sul molo, tu e il tuo amico senza ali contro di me?", [
        { label: "In volo", sub: "Volo a Tutto Campo · la partita della saga", cls: "hot", fn: () => K.volo({ title: "Volo a Tutto Campo · Una partita sul molo contro Vega", oppStyle: "contropiede", minutes: 45, mates: [{ name: "Sam" }], opp: { name: "Vega di Elyon", color: "#7a5ad8", players: [{ name: "Vega", skin: "#f4e4f0", hair: "#c8d8ff" }, { name: "Il pallone di luce" }], keeper: { name: "La boa" } } }, after) },
        { label: "Con i piedi per terra", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "ft_molo", alt: "az,cage,hd", force: false, oppTeam: "Vega di Elyon", oppColor: "#7a5ad8", us: "Altamira", homeKit: ["#c83a2a", "#ffd23f"], mate: "Sam Okoro", squad: ["Sam Okoro", "Pino", "Gina"], chap: "Il Figlio del Titano · Partita sul molo", bg: "ft_porto", oppNames: ["Vega", "Lumen", "Astra", "Boa", "Cometa"], intro: "Sul molo di Altamira, di notte, contro una guardiana di un altro pianeta.", done: after }) },
        { label: "Dopo", fn: done },
      ], "ft_porto");
    }
    function domandaPadre() {
      ask("ft_atlante", "(Atterra sul molo senza fare rumore. Guarda Vega, poi te.) Lo sapevo che sarebbe arrivata. Non così presto. (Silenzio.) Chiedimi quello che vuoi. Adesso, prima che cambi idea.", [
        { label: "«Perché sei venuto sulla Terra?»", fn: () => risposta("perche") },
        { label: "«Da che parte stai?»", fn: () => risposta("parte") },
        { label: "(…lo guardi e basta)", sub: "Se non rispondi in tempo, rispondi così", fn: () => risposta("silenzio") },
      ], "ft_porto", { secs: 8, def: 2 });
      function risposta(k) {
        F.set("ft_domanda", k); if (k === "silenzio") bond("famiglia", 1);
        const l = { perche: "[triste] Per scegliere. Elyon mi ha mandato a scegliere i migliori atleti della Terra, per la Grande Raccolta. Ho scelto tua madre come squadra del cuore, e ho smesso di mandare rapporti.", parte: "[pensa] Dalla parte di chi mi aspetta a cena. (Una pausa lunga.) Ma Elyon è casa mia, figliolo. E non si tradisce casa, nemmeno quando sbaglia.", silenzio: "[triste] (Si siede sul bordo del molo, le gambe nel vuoto, come un ragazzo.) Hai ragione a non dire niente. Te lo dico io: ero venuto per la Grande Raccolta. Ero io, l'osservatore." }[k];
        K.scene([["ft_atlante", l], ["ft_atlante", "[pensa] Ma le parole non bastano, su Elyon. Lassù ci si capisce in volo. (Si alza in aria.) Battimi, e ti racconto tutto. Anche quello che non ho mai detto a tua madre."]], () => matchPadre(), "ft_porto");
      }
    }
    function matchPadre() {
      K.volo({ title: "Volo a Tutto Campo · Contro tuo padre, il Titano", oppStyle: "pressing", minutes: 60, energy: 110,
        mates: [{ name: F.is("ft_vega_fiducia") ? "Vega" : "Sam" }], opp: { name: "Il Titano", color: "#3a3a4a", players: [{ name: "Atlante", skin: "#d9a679", hair: "#2a1a14" }, { name: "La sua ombra" }], keeper: { name: "Il faro del molo" } },
        intro: "<p>Tuo padre vola più veloce di chiunque abbia mai visto. Fa <b>pressing</b> e legge le traiettorie: usa il <b>volo supersonico</b> per sfondare il suo contrasto.</p>", winTitle: "HAI BATTUTO IL TITANO!" }, (r) => {
        if (!r.win) return K.scene([["ft_atlante", "[ride] Ancora troppo dritto, figliolo. Il cielo è curvo. Riprova quando vuoi: io resto qui."]], () => K.enterZone("ft_porto"), "ft_porto");
        setStep(N, 3); K.learnLore("l_raccolta"); bond("cielo", 2);
        K.scene([["ft_atlante", "[sorpreso] (Atterra, col fiatone, per la prima volta in vita sua.) Mi hai battuto. (Ride, piano.) Va bene. Tutto: fra tre giorni la nave di Elyon arriva. Orione, il Gran Maestro, proporrà la Partita del Cielo: se la Terra perde, i suoi migliori atleti partono per il Torneo Eterno."], ["ft_atlante", "[triste] E io sarò nella squadra di Elyon. Me l'hanno già chiesto. Non ho ancora risposto."], ["ft_vega", "[pensa] (Sottovoce.) Su Elyon nessuno ha mai detto di no a Orione. Mai."]], () => K.enterZone("ft_porto"), "ft_porto");
      });
    }
    const talk = {
      ft_vega() {
        const s = S();
        if (s === 0) return K.scene([["ft_vega", "[arrabbiato] (Esce dall'acqua con l'armatura viola che gocciola, il pallone di luce sotto il braccio.) Pianeta Terra. Umido. (Ti vede volare.) Tu. Hai il volo di Elyon. Chi sei?"], ["ft_vega", "[pensa] Varo? Il figlio di Atlante Varo? (Si irrigidisce.) Allora lo sai già. O non lo sai. Fra tre giorni arriva la Grande Raccolta. E tuo padre è qui per prepararla. Da vent'anni."]], () => { setStep(N, 1); quest("ft_segreto", "Il segreto del Titano", "Vega dice che tuo padre aspetta la Grande Raccolta da vent'anni."); done(); }, "ft_porto");
        if (s === 1) return ask("ft_vega", "Su Elyon mi hanno detto di osservare e basta. Ma ho visto come voli. (Ti guarda negli occhi.) Posso fidarmi di te, figlio del Titano? E tu di me?", [
          { label: "«Mi fido di te»", sub: "Vega resta libera, sul molo", big: true, fn: () => { F.set("ft_vega_fiducia", true); F.add("ft_vega_fid", 2); bond("cielo", 1); setStep(N, 2); K.refreshZone(); say([["ft_vega", "[felice] Bene. (Ti tende la mano: è fredda come una nuvola.) Allora ti dico una cosa che non dovrei. Tuo padre sta arrivando. L'ho sentito: il volo di un Titano fa un rumore che si sente da lontano."]]); } },
          { label: "«Ti porto all'Agenzia»", sub: "Le regole sono regole", big: true, fn: () => { F.set("ft_vega_agenzia", true); bond("famiglia", 1); setStep(N, 2); K.refreshZone(); say([["ft_vega", "[pensa] L'Agenzia. (Sorride appena.) Va bene. Ma prima ascolta: tuo padre sta arrivando. Il volo di un Titano si sente da lontano."]]); } },
          { label: "Prima una partita", sub: "Partita secondaria · scegli tu la modalità", fn: partitaVega },
        ], "ft_porto");
        return say([["ft_vega", S() >= 3 ? "[pensa] Orione non accetta un no. Ma tuo padre non l'ha ancora detto, il sì." : "Ascolta. Arriva."]]);
      },
      ft_atlante() {
        const s = S();
        if (s === 2) return domandaPadre();
        if (s === 3) return say([["ft_atlante", "[pensa] Tua madre è qui. (Guarda l'acqua.) Decidi tu cosa dirle. Io le ho taciuto la cosa più grande per vent'anni: non ho il diritto di consigliarti."]]);
        return say([["ft_atlante", "Il cielo è curvo, figliolo."]]);
      },
      ft_nora() {
        if (S() === 3) return ask("ft_nora", "(Arriva con il cappotto sopra il pigiama e la torcia del negozio.) Allora. Ti ho visto uscire dalla finestra. Volando. (Guarda tuo padre, poi te.) Cosa sta succedendo? E non dirmi «niente».", [
          { label: "Dille tutta la verità", sub: "Elyon, la Raccolta, la scelta di tuo padre", big: true, fn: () => fine2("verita") },
          { label: "«È una cosa fra me e papà»", sub: "Proteggerla, per ora", big: true, fn: () => fine2("segreto") },
        ], "ft_porto");
        return say([["ft_nora", "Il molo, di notte. Come la prima volta che ho visto tuo padre."]]);
      },
      ft_sam() { return say([["ft_sam", S() >= 1 ? "[sorpreso] Un'aliena. Con un pallone di luce. (Si siede su una bitta.) Io lo sapevo che eri un alieno. Lo sapevo." : "Hai visto quella luce in mare? Ho chiamato l'Agenzia. Hanno detto «stiamo monitorando». Che vuol dire?"]]); },
      ft_cecile() { return say([["ft_cecile", F.is("ft_vega_agenzia") ? "[pensa] La sua amica di Elyon è nella stanza accanto. Mangia una pizza. Dice che è «inspiegabile»." : "[pensa] (Indica uno schermo: un puntino enorme si avvicina alla Terra.) Tre giorni. Forse meno."]]); },
    };
    function fine2(kind) {
      if (kind === "verita") { F.set("ft_madre_sa", true); bond("famiglia", 3); } else { F.set("ft_segreto_madre", true); bond("cielo", 1); }
      questDone("ft_segreto");
      const msg = K.reward("c2:ft", { coins: 90, cos: ["ft_c2"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "verita" ? [["ft_nora", "[pensa] (Ascolta tutto, senza interrompere. Poi si gira verso tuo padre.) Vent'anni. (Lunga pausa.) Ne parliamo a casa. Tutti e tre. Adesso andiamo: domani c'è da salvare un pianeta, e voi due non avete cenato."], ["ft_atlante", "[triste] (Sottovoce.) Grazie, figliolo. Io non ci sarei mai riuscito."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La partita del cielo».`]]
        : [["ft_nora", "[pensa] Una cosa fra voi due. (Vi guarda a lungo.) Va bene. Ma quando sarà finita, la cosa diventa fra noi tre. Promesso?"], ["voce", "Promesso. Tuo padre non dice niente. Guarda il cielo, dove una stella nuova, enorme, si avvicina piano."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La partita del cielo».`]], () => K.openMain(), "ft_porto");
    }
    return { n: N, title: "Il segreto del Titano", sub: "Vega di Elyon, la domanda a tuo padre, la Grande Raccolta", goal, start: "ft_porto", introBg: "ft_porto", zones, talk,
      intro: () => [["voce", "<b>IL FIGLIO DEL TITANO.</b> Episodio 2. Le stelle cadenti, di solito, cadono lontano. Questa cade a cento metri dal molo di Altamira, e nuota verso la riva."]] };
  }
  boot();
})();
