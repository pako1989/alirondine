// js/trono-c2.js - IL TRONO DI CUOIO · Capitolo 2 «Altavalle»
// La capitale. Per entrare nel Torneo del Trono serve il voto del Consiglio delle Casate: tre sì su sei. La reggente
// Ottavia Ferroquercia vota sempre no. Gli altri voti vanno guadagnati: con una partita al Concilio contro Casa Salmastra
// (che tradisce volentieri), con una partita a scelta contro Rovoardente, ascoltando Gelaneve, vendendo (o no) un segreto
// a Lady Ysolde, la ragnatela di corvi di Casa Corvonero. E Pietrabruna si ricorda di come hai giocato al primo Concilio.
(function () {
  "use strict";
  function boot() { const D = window.__trono; if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N), C = K.CASATE;
    K.cast("tc_ottavia", { acc: ["corona"], name: "La reggente Ottavia Ferroquercia", tag: "", hair: "#e8c84a", style: "bun", skin: "#f0d8c0", eye: "#3a5a3a", bg: ["#2a1a0c", "#ffd27a"], shirt: "#8a6a1a" },
      "Reggente di Valdoro da sette anni, da quando Casa Ferroquercia ha vinto l'ultimo Torneo del Trono. Sorride sempre, ringrazia sempre, e non ha mai perso un voto. Nessuno sa come. Tutti lo immaginano.");
    K.cast("tc_ysolde", { acc: ["mantello"], name: "Lady Ysolde Corvonero", tag: "", hair: "#1a1a2a", style: "flowing", skin: "#e8d0c0", eye: "#6a5aa8", bg: ["#1a1a2a", "#9a8ac8"], shirt: "#2a2a3a" },
      "Signora di Casa Corvonero, padrona di cento corvi e di mille segreti. Non mente mai: dice soltanto metà della verità, e ti lascia indovinare quale metà. Gioca a calcio benissimo, ma nessuno l'ha mai vista farlo.");
    K.cast("tc_marino", { acc: ["bandana"], name: "Lord Marino Salmastra", tag: "", hair: "#2a4a5a", style: "curly", skin: "#c68642", eye: "#2a6a6a", bg: ["#1a2a3a", "#7ad8d8"], shirt: "#1a4a6a" },
      "Signore dei porti di Salmastra. Simpatico, generoso, sempre con un brindisi pronto. Firma tutti i patti che gli porgi, con un gran sorriso. Poi la marea cambia, dice lui, e la marea non l'ha firmato.");
    K.cast("tc_fiamma", { acc: ["fascia"], name: "Lady Fiamma Rovoardente", tag: "", hair: "#c83a1a", style: "ponytail", skin: "#e0b890", eye: "#5a2a1a", bg: ["#2a0e06", "#ffb84a"], shirt: "#a83a1a" },
      "Capitana di Casa Rovoardente, delle terre bruciate del sud. Non sopporta i patti, i tavoli, le parole: vuole solo giocare. Vota per chi la batte, e lo dice prima, così nessuno si offende.");
    K.cast("tc_inverno", { acc: ["sciarpa"], name: "Ser Inverno Gelaneve", tag: "", hair: "#e8f0f8", style: "side", skin: "#f0e0d8", eye: "#5a8ab8", bg: ["#1a2a3a", "#e8f0f8"], shirt: "#5a7a9a" },
      "Il cavaliere di Casa Gelaneve, venuto dal nord, dalla Barriera di Ghiaccio. Parla piano e di una cosa sola: oltre la Barriera c'è una squadra che gioca da secoli contro l'inverno, e nessuno a sud ci crede.");
    K.cos("tc_c2", { kind: "acc", label: "Spilla del Consiglio", val: "stella", from: "Capitolo 2 del Trono di Cuoio" });
    K.cos("tc_sigilli2", { kind: "hairc", label: "Capelli Ceralacca", val: "#a82a2a", from: "Trova tutti i sigilli di cera di Altavalle" });
    K.lore("l_consiglio", { t: "Il Consiglio delle Casate", d: "Prima di ogni Torneo del Trono, le casate votano chi può partecipare. Ogni voto si compra: con una partita, una promessa, un segreto. La reggente vota per ultima, e vota sempre no." });
    K.lore("l_barriera", { t: "La Barriera di Ghiaccio", d: "A nord di Gelaneve c'è un muro di ghiaccio alto come una montagna. Dall'altra parte, dicono, una squadra gioca da secoli contro l'inverno: se smettono, l'inverno vince." });
    const VOTERS = ["corvonero", "salmastra", "rovoardente", "gelaneve", "pietrabruna", "ferroquercia"];
    function votes() {
      return [
        { id: "corvonero", yes: F.is("tc_venduto_ardo") || (F.is("tc_ysolde_ok") && K.cred() >= 6), why: F.is("tc_venduto_ardo") ? "Le hai venduto un segreto" : F.is("tc_ysolde_ok") ? (K.cred() >= 6 ? "Ha fiducia nella tua parola" : "La tua credibilità non le basta") : "Non le hai parlato" },
        { id: "salmastra", yes: F.is("tc_salm_vinta"), why: F.is("tc_salm_vinta") ? "Hai battuto Salmastra al Concilio" : "Salmastra non è stata battuta" },
        { id: "rovoardente", yes: F.is("tc_fiamma_vinta"), why: F.is("tc_fiamma_vinta") ? "Hai battuto Rovoardente in campo" : "Fiamma vuole una partita" },
        { id: "gelaneve", yes: F.is("tc_barriera"), why: F.is("tc_barriera") ? "Hai ascoltato la storia della Barriera" : "Nessuno ascolta il nord" },
        { id: "pietrabruna", yes: F.is("tc_pietra_amica") && !F.is("tc_venduto_ardo"), why: F.is("tc_venduto_ardo") ? "Hai venduto i segreti di Ardo" : F.is("tc_pietra_amica") ? "La parola di pietra di Lord Ardo" : "Hai tradito un patto al primo Concilio" },
        { id: "ferroquercia", yes: false, why: "La reggente vota sempre no" },
      ];
    }
    const yesNow = () => votes().filter((v) => v.yes).length;
    const goal = (s) => ({
      0: "Ad Altavalle, il Consiglio delle Casate si riunisce nel palazzo in alto. La reggente Ottavia ti aspetta.",
      1: `Servono tre voti su sei per entrare nel Torneo (ne hai ${yesNow()}). Parla con le casate in città, poi torna dalla reggente.`,
      2: "Il Consiglio ha votato. Lady Ysolde ti aspetta nella sala del Consiglio.",
    }[s] || "Il capitolo 2 è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      tc_capitale: {
        region: "capitale", name: "Il Trono di Cuoio · Altavalle", short: "Altavalle", sub: "La capitale di Valdoro, un mese prima del Torneo", bg: "tc_capitale", time: "giorno", travel: [16, 20],
        w: 34, h: 24, start: [16, 20], itemCos: "tc_sigilli2", items: [[2, 2], [31, 3], [31, 21]],
        banners: { "12,9": "ferroquercia", "20,9": "corvonero", "12,15": "salmastra", "20,15": "rovoardente", "5,8": "gelaneve", "27,8": "pietrabruna", def: "ferroquercia" },
        areas: [[12, 9, 20, 15, "La piazza delle Casate"], [0, 0, 33, 23, "Altavalle"]],
        flavor: { t: "Un tiglio della capitale. Ci hanno inchiodato un avviso: «Torneo del Trono · iscrizioni chiuse». Sotto, a matita: «quasi»." },
        intro: [["voce", "Altavalle, la capitale. Strade di pietra bianca, sette stendardi su sette torri, e una piazza dove le casate fingono di passeggiare per caso. Tutti sorridono. Nessuno dice quello che pensa."], ["voce", "In cima alla città, il palazzo del Consiglio. Dentro, il Trono di Cuoio. E la reggente."]],
        npcs: (s) => [
          { id: "tc_ysolde", at: [8, 11] }, { id: "tc_marino", at: [25, 12] }, { id: "tc_fiamma", at: [24, 19] }, { id: "tc_inverno", at: [9, 19] },
          ...(F.is("tc_pietra_amica") ? [{ id: "tc_ardo", at: [27, 10] }] : []), ...(F.is("tc_brunilde_alleata") ? [{ id: "tc_brunilde", at: [18, 18] }] : []),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 23, 33, 23, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a");
          lay(12, 9, 20, 15, "+"); lay(16, 8, 16, 22, ":"); lay(4, 12, 11, 12, ":"); lay(21, 12, 29, 12, ":"); lay(6, 18, 27, 18, ":");
          house(12, 2, 9, 6, { door: [16, 7], roof: "#8a6a1a", wall: "#d8c8a8", rr: 3, enter: { to: "tc_consiglio", at: [10, 10] } });
          house(3, 3, 6, 4, { door: [6, 6], roof: "#2a2a3a", wall: "#a89878", rr: 2, enter: "La torre dei corvi di Casa Corvonero. Cento gabbie aperte, cento corvi che vanno e vengono. Uno ti si posa sulla spalla, ti guarda nell'orecchio, e riparte. Adesso Lady Ysolde sa che sei passato." });
          house(24, 3, 6, 4, { door: [27, 6], roof: "#1a4a6a", wall: "#c8b898", rr: 2, enter: "La locanda «Al Patto Rotto». Dentro, marinai di Salmastra cantano una canzone che fa: «Firma, firma, la marea non legge». Il locandiere ti offre da bere. Non firmi niente." });
          house(3, 20, 5, 3, { door: [5, 20], roof: "#a83a1a", wall: "#c8a888", rr: 2, enter: "La bottega del cuoiaio di corte. Cuce palloni da trent'anni. «Il Trono?», dice. «Cuoio vecchio, cuciture vecchie. Se qualcuno lo scucisse, ne verrebbero fuori sette palloni perfetti. Ma chi oserebbe?»" });
          Object.keys({ "12,9": 1, "20,9": 1, "12,15": 1, "20,15": 1, "5,8": 1, "27,8": 1 }).forEach((k) => { const [x, y] = k.split(",").map(Number); put(x, y, "Q"); });
          [[2, 15], [30, 15], [10, 2], [23, 2], [30, 19], [2, 10]].forEach(([x, y]) => put(x, y, "t")); put(14, 20, "s");
        },
      },
      tc_consiglio: {
        interior: true, region: "casa", name: "Il Trono di Cuoio · La sala del Consiglio", short: "Il Consiglio", sub: "Il palazzo della reggente", bg: "tc_consiglio", w: 20, h: 13, start: [10, 10], outside: ["tc_capitale", 16, 8],
        banners: { "3,1": "corvonero", "6,1": "salmastra", "9,1": "ferroquercia", "12,1": "rovoardente", "15,1": "gelaneve", "17,1": "pietrabruna", def: "ferroquercia" },
        act: { T: "Guarda il tavolo del Consiglio", L: "Guarda gli archivi", v: "Esci" },
        flavor: { T: "Il tavolo rotondo del Consiglio: sette sedie, sette altezze diverse. Quella della reggente è la più alta. Quella di Casa Tasso la più bassa. Qualcuno, di notte, ha segato le gambe a metà delle altre.", L: "Gli archivi dei patti: migliaia di pergamene con sigilli di cera. Un intero scaffale è etichettato «Salmastra · rotti». È il più lungo." },
        intro: [["voce", "La sala del Consiglio: sette stendardi, un tavolo rotondo, e in fondo, su un gradino, il Trono di Cuoio, sotto un drappo. La reggente Ottavia è in piedi accanto al tavolo. Sorride. Ti stava aspettando da prima che arrivassi."]],
        npcs: (s) => [{ id: "tc_ottavia", at: [10, 4] }, ...(s === 2 ? [{ id: "tc_ysolde", at: [15, 8] }] : [])],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(8, 6, 12, 7, "T"); lay(1, 9, 2, 9, "L"); [3, 6, 9, 12, 15, 17].forEach((x) => put(x, 1, "Q")); put(2, 11, "s"); },
      },
    };
    function salmastra() { // la partita principale del capitolo: il Concilio contro chi tradisce volentieri
      K.concilio({ title: "Il Concilio · contro Casa Salmastra", us: F.is("tc_riconosciuto") ? "Casa Tasso" : "Il figlio senza nome", opp: { name: "Casa Salmastra", color: C.salmastra.c, sigil: C.salmastra.s, honor: 0.45 }, oppStyle: "contropiede",
        cards: ["centro", "sinistra", "destra", "tregua", "ostaggio"], ravens: 1 + (F.is("tc_corvo") ? 1 : 0), turns: 8, winTitle: "LA MAREA SI È FERMATA",
        intro: "<p>Lord Marino firma tutti i patti, sorridendo. Poi la marea cambia. Al tavolo c'è anche la carta dell'<b>ostaggio d'onore</b>: chi tradisce perde un gol. Serve molta credibilità per farla firmare.</p>" }, (r) => {
        if (!r.win) return K.scene([["tc_marino", "[ride] La marea, amico mio! Non si discute con la marea. Rigiochiamo quando vuoi: io firmo sempre."]], () => K.enterZone("tc_capitale"), "tc_capitale");
        F.set("tc_salm_vinta", true); bond("intrighi", 1);
        K.scene([["tc_marino", r.data.traditi ? "[sorpreso] Ho rotto un patto e ho perso lo stesso? (Ride, ma meno.) Questa è nuova. Va bene, va bene: Salmastra vota per te. Per oggi." : "[felice] Non ho nemmeno avuto bisogno di tradire, e ho perso lo stesso! Salmastra vota per te. Ti offro da bere, alla locanda del Patto Rotto. Ah, no: tu non firmi niente."]], () => K.enterZone("tc_capitale"), "tc_capitale");
      });
    }
    function rovo() { // la partita secondaria: la modalità la scegli tu
      K.playMatch({ id: "tc_rovo", alt: "az,cage,hd", force: false, azPitch: "cenere", cageField: 3, cageMut: "turbo", cageTarget: 5, squad: ["Ser Gualtiero", "Brunilde Tasso"], oppTeam: "Casa Rovoardente", oppColor: C.rovoardente.c, mate: F.is("tc_brunilde_alleata") ? "Brunilde" : "Ser Gualtiero", us: "Casa Tasso", homeKit: [C.tasso.c, C.tasso.c2], chap: "Il Trono di Cuoio · La sfida di Rovoardente", bg: "tc_capitale", oppNames: ["Fiamma", "Brace", "Cenere", "Tizzone", "Scintilla"], intro: "Rovoardente gioca a modo suo: sulle terre bruciate del sud, tra cenere e braci, dove tutti corrono più veloci e il pallone scotta. Niente patti, niente tavoli: Lady Fiamma vuole solo giocare.",
        done: (r) => { if (r.win) F.set("tc_fiamma_vinta", true); K.scene([["tc_fiamma", r.win ? "[ride] Finalmente qualcuno che gioca invece di parlare! Rovoardente vota per te. L'ho detto prima, così nessuno si offende." : "[furbo] Troppo lento. Torna quando hai finito di pensare."]], () => K.enterZone("tc_capitale"), "tc_capitale"); } });
    }
    function voto() {
      K.voto({ title: "Il Consiglio vota: Casa Tasso entra nel Torneo del Trono?", need: 3, voters: votes(), done: (pass, yes) => {
        if (!pass) return say([["tc_ottavia", `[furbo] ${yes} voti. Che peccato. (Non sembra dispiaciuta.) Il Consiglio si riunisce di nuovo quando vuole: l'Altavalle è piena di casate da convincere. O da comprare.`]]);
        setStep(N, 2); questDone("tc_voti"); K.learnLore("l_consiglio"); bond("onore", 1); K.refreshZone();
        K.scene([["tc_ottavia", `[sorpreso] (Il sorriso le resta sul viso, ma solo sul viso.) ${yes} voti. Casa Tasso entra nel Torneo del Trono. (Si volta verso il drappo, sopra il trono.) Ci vediamo in finale, figlio senza nome. Se ci arrivi.`], ["voce", "Mentre le casate escono, un corvo ti passa sopra la testa e si posa sulla spalla di Lady Ysolde. Ti fa un cenno: resta."]], done, "tc_consiglio");
      } });
    }
    const talk = {
      tc_ottavia() {
        const s = S();
        if (s === 0) return say([["tc_ottavia", "[felice] Casa Tasso! E con chi, poi. (Ti guarda dall'alto in basso, con grazia.) Benvenuto ad Altavalle. Il Torneo del Trono comincia fra un mese, e per entrarci serve il voto del Consiglio: tre sì su sei."], ["tc_ottavia", "[furbo] Io voto no. Sempre. Non è niente di personale: è tradizione. Gli altri voti… be', la città è piena di casate. Buona fortuna."]], () => { setStep(N, 1); quest("tc_voti", "I voti del Consiglio", "Tre sì su sei: Corvonero, Salmastra, Rovoardente, Gelaneve, Pietrabruna."); done(); });
        if (s === 1) return ask("tc_ottavia", `Vuoi già il voto? Hai ${yesNow()} sì, a quanto dicono i miei corvi. Che sono pochi, rispetto a quelli di Ysolde.`, [{ label: "Convoca il Consiglio", sub: "Le casate votano", cls: "hot", fn: voto }, { label: "Non ancora", fn: done }], "tc_consiglio");
        return say([["tc_ottavia", "[furbo] In finale, allora. Porta un buon pallone: il mio non lo presto."]]);
      },
      tc_ysolde() {
        const s = S();
        if (s === 1 && !F.is("tc_ysolde_ok") && !F.is("tc_venduto_ardo")) return ask("tc_ysolde", "(Un corvo le parla all'orecchio. Lei annuisce.) Il figlio senza nome. So già tutto di te: il cortile, il cavallo della domenica, il passo della Gola. Quasi tutto.\n\nCorvonero vota per chi ha qualcosa da offrire. Dimmi come gioca Pietrabruna al Concilio, e il mio voto è tuo.", [
          { label: "«Pietrabruna non tradisce mai. Ecco come gioca»", sub: "Vendi il segreto di Lord Ardo", big: true, fn: () => ysolde(true) },
          { label: "«Non vendo i segreti di chi si fida di me»", sub: "Corvonero vota sì solo se la tua credibilità è alta (6)", big: true, fn: () => ysolde(false) },
        ], "tc_capitale");
        if (s === 2) return ask("tc_ysolde", "(Ti aspetta accanto agli archivi, dove la luce non arriva.) Complimenti. Ora ascolta bene, perché lo dico una volta sola: in finale la reggente tradirà ogni patto che firmerà. Lo fa da sette anni. Io so come e quando.\n\nTi offro un patto. Non di cera: di corvo. In finale avrai i miei corvi. In cambio, un giorno, un favore.", [
          { label: "«Accetto il patto del corvo»", sub: "In finale: due corvi in più", big: true, fn: () => fine2("corvo") },
          { label: "«Niente patti nell'ombra»", sub: "Credibilità +1", big: true, fn: () => fine2("luce") },
        ], "tc_consiglio");
        return say([["tc_ysolde", F.is("tc_venduto_ardo") ? "[furbo] Grazie per il segreto. Lord Ardo non lo saprà mai. (Un corvo gracchia.) Quasi mai." : "Noi sappiamo. È il nostro motto, ma anche un avvertimento."]]);
      },
      tc_marino() {
        if (S() === 1 && !F.is("tc_salm_vinta")) return ask("tc_marino", "[ride] (Ti versa da bere prima ancora che tu dica ciao.) Casa Tasso! Il voto di Salmastra? Facile: giochiamo un Concilio. Firmo tutto quello che vuoi. Poi, se vinci tu, voto per te. Se vinco io… be', voto per me. Brindiamo?", [{ label: "Siedi al tavolo del Concilio", sub: "Il Concilio · Salmastra tradisce volentieri", cls: "hot", fn: salmastra }, { label: "Non ancora", fn: done }], "tc_capitale");
        return say([["tc_marino", F.is("tc_salm_vinta") ? "[felice] Il mio voto è tuo! Fino alla prossima marea. Scherzo. Forse." : "La marea va e viene, amico. Io resto."]]);
      },
      tc_fiamma() {
        if (S() === 1 && !F.is("tc_fiamma_vinta")) return ask("tc_fiamma", "Patti? Tavoli? Corvi? (Sbuffa.) Rovoardente vota per chi la batte in campo. Una partita vera, niente cera. Ci stai?", [{ label: "Sfida Rovoardente", sub: "Partita secondaria · scegli tu la modalità", big: true, fn: rovo }, { label: "Non ancora", fn: done }], "tc_capitale");
        return say([["tc_fiamma", F.is("tc_fiamma_vinta") ? "[felice] Bella partita. Al Torneo, se ci incontriamo, ti brucio. Con affetto." : "Torna quando hai finito di parlare."]]);
      },
      tc_inverno() {
        if (!F.is("tc_barriera") && S() === 1) return ask("tc_inverno", "(Ha la neve sulle spalle, anche se qui non nevica.) A sud nessuno mi ascolta. Dicono che la Barriera di Ghiaccio è una favola per bambini. Vuoi sentire anche tu la favola, o hai fretta come gli altri?", [
          { label: "«Raccontami della Barriera»", sub: "Ascolta Gelaneve", big: true, fn: () => K.scene([["tc_inverno", "[pensa] A nord della mia terra c'è un muro di ghiaccio alto come una montagna. Dall'altra parte c'è un campo bianco, e una squadra che gioca da trecento anni. Non per vincere: per non smettere."], ["tc_inverno", "[triste] Se smettono, l'inverno passa la Barriera. Così dicono i vecchi. Io li ho visti, una volta, dalla cima del muro: undici figure, un pallone di ghiaccio, e nessuno sugli spalti."], ["tc_inverno", "[felice] …Mi hai ascoltato fino alla fine. Nessuno lo fa mai. Gelaneve vota per te."]], () => { F.set("tc_barriera", true); K.learnLore("l_barriera"); bond("onore", 1); done(); }, "tc_capitale") },
          { label: "«Ho fretta, ser»", fn: () => say([["tc_inverno", "Come tutti. L'inverno no: lui ha tempo."]]) },
        ], "tc_capitale");
        return say([["tc_inverno", F.is("tc_barriera") ? "Gelaneve ricorda chi l'ascolta. L'inverno ricorda tutto." : "L'inverno ricorda."]]);
      },
      tc_ardo() { return say([["tc_ardo", F.is("tc_venduto_ardo") ? "[arrabbiato] Un corvo mi ha detto che hai parlato di me a Corvonero. (Prende la pietra con il tuo nome, la guarda, la rimette in tasca. Non la getta: per ora.) Pietrabruna non vota per chi vende parole." : "La mia parola è tua. Al Consiglio, Pietrabruna dirà sì."]]); },
      tc_brunilde() { return say([["tc_brunilde", "[pensa] Io tengo lo stendardo, tu tieni le orecchie aperte. Qui ogni sorriso costa un voto. E ogni voto costa un segreto."]]); },
    };
    function ysolde(sell) {
      if (sell) { F.set("tc_venduto_ardo", true); K.setCred(K.cred() - 1); bond("onore", -2); } else F.set("tc_ysolde_ok", true);
      say([["tc_ysolde", sell ? "[furbo] Grazie. (Il corvo vola via con il segreto nel becco.) Corvonero vota per te. E sappi una cosa: Lord Ardo non lo saprà mai da me. Dai corvi, forse." : K.cred() >= 6 ? "[sorpreso] Un uomo che non vende i segreti degli altri. (Ti studia.) Raro. Utile. Corvonero vota per te: chi tiene i segreti degli altri terrà anche i miei." : "[pensa] Nobile. Ma la nobiltà, al Consiglio, si misura in credibilità, e la tua non mi basta ancora. Torna a vincere qualche patto."]]);
    }
    function fine2(kind) {
      if (kind === "corvo") F.set("tc_ysolde_patto", true); else K.setCred(K.cred() + 1);
      const msg = K.reward("c2:tc", { coins: 70, cos: ["tc_c2"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "corvo" ? [["tc_ysolde", "[furbo] (Ti appunta una piuma nera sul colletto.) Fatto. In finale guarda le piume: dove si muovono, lì la reggente tradirà. E un giorno, quando meno te lo aspetti, mi ricorderò del favore."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Il Torneo del Trono».`]]
        : [["tc_ysolde", "[sorpreso] Niente ombra. (Sorride, davvero, per la prima volta.) Allora giocherai la finale da solo, contro una reggente che tradisce. Coraggioso. O sciocco. A Valdoro è la stessa parola."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Il Torneo del Trono».`]], () => K.openMain(), "tc_consiglio");
    }
    K.votes = votes; K.VOTERS = VOTERS;
    return { n: N, title: "Altavalle", sub: "La capitale, i voti del Consiglio, Salmastra e i corvi", goal, start: "tc_capitale", introBg: "tc_capitale", zones, talk,
      intro: () => [["voce", "<b>IL TRONO DI CUOIO</b>, capitolo 2. Un mese dopo il passo della Gola, Casa Tasso arriva ad Altavalle con uno stendardo, un cavallo e un figlio senza nome. Nessuno li aspettava. Tutti li stavano guardando."]] };
  }
  boot();
})();
