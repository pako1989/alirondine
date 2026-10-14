// js/naufraghi-c3.js - NAUFRAGHI DEL PALLONE · Capitolo 3 «Alta Marea»
// La scogliera col cannocchiale, lo Stadio della Marea, la Partita Grande contro Il Riflusso. Due verità a cielo aperto, una scelta
// finale e cinque modi di tornare (o di non tornare) a casa. Un finale segreto per chi ha raccolto tutte le conchiglie.
(function () {
  "use strict";
  function boot() { const D = window.__naufraghi; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);
    K.cast("nf_riflusso", { shape: "robot", acc: [], name: "Il Riflusso", tag: "", hair: "#67e8f9", skin: "#0e7490", eye: "#e0f2fe", bg: ["#0e7490", "#67e8f9"], shirt: "#155e75" },
      "La squadra che l'isola si è fatta da sola con l'acqua: undici onde, nessuna mai uguale a un'altra. Giocano bene e non si stancano mai. Hanno soltanto un difetto: non hanno mai visto nessuno vincere.");
    K.cos("nf_c3", { kind: "shirt", label: "Maglia della Partita Grande, color alta marea", val: "#0e7490", from: "Capitolo 3 di Naufraghi del Pallone" });
    K.cos("nf_gabbiano", { kind: "acc", label: "Berretto dei Gabbiani", val: "berretto", from: "Finale «Tutti in squadra» o «I custodi del faro»" });
    K.cos("nf_zattera", { kind: "acc", label: "Occhialoni da zattera", val: "occhiali", from: "Finale «La zattera di Gaspare»" });
    K.lore("l_tartaruga", { t: "L'isola che nuota", d: "Dal cannocchiale della scogliera si vede com'è fatta davvero: un guscio enorme, una testa che dorme in mezzo al mare, quattro pinne che muovono l'acqua un nodo alla volta. Le secche sono le sue pinne, il faro è una luce che ha voluto tenere accesa." });
    K.lore("l_gabbiani", { t: "Il '99", d: "I Gabbiani sono i Rondine del volo di venticinque anni fa. Sull'isola il tempo scorre piano, e quasi per niente quando si gioca." });
    const goal = (s) => ({
      0: "Parla con la Capitana alla spiaggia: la Voce ha promesso di mostrarvi dove siete davvero.",
      1: "Alla scogliera, a nord-est del faro, c'è un cannocchiale. Guarda.",
      2: "Il Capitano Scoglio e la Capitana Bora sono alla scogliera. Parla con lui.",
      3: "Lo Stadio della Marea, a est della scogliera. La Voce aspetta la Partita Grande.",
    }[s] || "La storia è conclusa. Puoi rigiocare i capitoli dal menu.");
    const MARE_ST = [];
    const zones = {
      nf_scogliera: {
        region: "faro", name: "Naufraghi del Pallone · La scogliera", short: "La scogliera", sub: "Il cannocchiale, il vento, e la vista di tutta l'isola", bg: "nf_faro", time: (s, KK) => KK.fase(), travel: [2, 10],
        w: 30, h: 20, start: [2, 10], items: [[4, 15], [25, 6]],
        areas: [[10, 3, 20, 9, "Il belvedere"], [0, 0, 29, 19, "La scogliera"]],
        flavor: { r: "Roccia scura, liscia e tiepida. Strano: di solito le rocce sono fredde. Questa sembra respirare, appena." },
        doors: { "0,10": { to: "nf_faro", at: [28, 5] }, "29,15": { to: "nf_stadio", at: [1, 11], locked: (KK) => (KK.stepOf(3) < 3 ? "Il sentiero porta verso est, dove i Gabbiani hanno costruito qualcosa. Prima, qui, ci sono cose da vedere." : false) } },
        intro: [["voce", "La scogliera si alza sopra il mare come un pugno. Il vento ti spettina senza chiedere. Da qui si vede ogni cosa: il faro piccolo, la laguna come un piatto, l'orizzonte che non sta mai fermo."]],
        npcs: (s) => (s >= 1 ? [{ id: "nf_scoglio", at: [15, 6] }, { id: "nf_bora", at: [13, 6] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 19, "w"); lay(1, 2, 28, 17, ","); lay(1, 2, 28, 2, "m"); lay(1, 17, 28, 17, "m"); lay(1, 10, 14, 10, ":"); lay(14, 5, 14, 10, ":"); lay(14, 10, 28, 10, ":"); lay(28, 10, 28, 15, ":");
          put(0, 10, "J"); put(29, 15, "J"); put(14, 4, "V");
          [[3, 5], [6, 4], [8, 8], [5, 13], [10, 14], [11, 4], [18, 4], [21, 7], [24, 12], [20, 14], [16, 15], [26, 9], [3, 8], [24, 4]].forEach(([x, y]) => put(x, y, "r"));
          [[2, 15], [7, 15], [23, 15], [26, 14], [22, 4]].forEach(([x, y]) => put(x, y, "t"));
          lay(12, 6, 12, 6, ","); put(22, 10, "b"); put(5, 10, "n");
        },
      },
      nf_stadio: {
        region: "stadio", name: "Naufraghi del Pallone · Lo Stadio della Marea", short: "Lo stadio", sub: "Il campo dei Gabbiani, costruito pietra dopo pietra, vent'anni di domeniche", bg: "nf_stadio", time: (s, KK) => KK.fase(), travel: [2, 11],
        w: 36, h: 22, start: [2, 11], items: [[3, 18], [33, 3]],
        areas: [[6, 5, 29, 16, "Il campo"], [0, 0, 35, 21, "Lo stadio"]],
        flavor: { n: "Un tabellone di legno con i risultati: «GABBIANI 12 - ONDE 0» per ventotto righe. Poi, qualche riga più giù, una crocetta, e a matita: «finalmente vince qualcuno di nuovo»." },
        doors: { "0,11": { to: "nf_scogliera", at: [28, 15] } },
        intro: [["voce", "Uno stadio fatto a mano: un campo di sabbia dura con le righe scavate nella pietra, due porte di tronchi, spalti di casse e di tronchi, torce di bambù tutto intorno. Venticinque anni di domeniche ci hanno lasciato la polvere buona."], ["voce", "In fondo, sopra il palco dei Gabbiani, c'è una radio ben pulita. Aspetta."]],
        npcs: (s) => [{ id: "nf_scoglio", at: [8, 8] }, { id: "nf_bora", at: [8, 14] }, { id: "nf_tobia", at: [14, 19] }, { id: "nf_salvi", at: [22, 19] }, { id: "nf_gaspare", at: [27, 3] }, { id: "nf_fiorenzo", at: [31, 19] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 21, "w"); lay(1, 1, 34, 20, ","); lay(0, 11, 4, 11, ":"); lay(6, 5, 29, 16, "-");
          lay(5, 9, 5, 12, ","); put(5, 9, "g"); put(5, 12, "g"); put(30, 9, "g"); put(30, 12, "g"); lay(30, 10, 30, 11, ","); lay(31, 10, 31, 11, ",");
          lay(6, 3, 29, 3, "b"); lay(6, 18, 29, 18, "b"); [[6, 2], [29, 2], [6, 19], [29, 19], [2, 4], [33, 4], [2, 18], [33, 18]].forEach(([x, y]) => put(x, y, "l"));
          put(17, 2, "R"); put(24, 2, "z"); put(11, 2, "z"); put(33, 11, "n");
          [[3, 6], [3, 15], [32, 7], [32, 16], [34, 9]].forEach(([x, y]) => put(x, y, "t"));
          lay(14, 3, 14, 3, ","); lay(14, 18, 14, 18, ","); lay(22, 18, 22, 18, ","); lay(31, 18, 31, 18, ","); lay(27, 3, 27, 3, ","); lay(8, 3, 8, 3, "b");
        },
      },
    };
    // la squadra con cui si gioca la finale: chi ti dà più rispetto, gioca con te
    const compagni = () => (K.stat("rispetto") >= 20 ? ["Bora", "Scoglio"] : ["Bora", "Tobia"]);
    const grande = () => {
      const mates = compagni(); F.set("nf_con_scoglio", mates[1] === "Scoglio");
      K.mareaMatch({ title: "Marea · La Partita Grande", opp: { name: "Il Riflusso", color: "#0e7490", style: "pressing", players: [{ name: "Risacca" }, { name: "Frangente" }], keeper: { name: "Bonaccia" } }, mates: mates.map((n) => ({ name: n })), duration: 110,
        intro: `Alta Marea, sul campo dei Gabbiani. Giochi con ${mates[0]} e ${mates[1]}. Dall'altra parte, Il Riflusso: onde con le maglie. Il campo è più stretto del solito, perché il mare è alto, e sta salendo.`, winTitle: "LA PARTITA GRANDE!" }, (r) => {
        if (r && r.quit) return say([["nf_voce", "[triste] Ci si può fermare, ma poi si ricomincia. Non è un rimprovero, è proprio come funziona il mare."]], done);
        if (!r || !r.win) return K.scene([["nf_voce", "[ride] Uno a zero per me! (Il fruscio si mette a ridere.) Scherzo, scherzo. Ha vinto Il Riflusso, ma una partita sola non basta. Ancora una? Un po' me lo devi."], ["voce", "Il campo si svuota, piano, come una vasca. Intorno a te, i Gabbiani applaudono lo stesso."]], () => { setStep(N, 3); K.enterZone("nf_stadio"); }, "nf_stadio");
        F.set("nf_finale_vinta", true); setStep(N, 4);
        K.scene([["nf_voce", "[sorpreso] ...vinto. Hanno vinto! (Il fruscio si incrina, e poi, da qualche parte nella sabbia, qualcosa fa un rumore morbido come un sospiro.) Non succedeva da... non so. Non lo ricordo, nel senso che non l'ho mai visto."], ["nf_scoglio", "[felice] (Sul bordo del campo, con le braccia aperte.) Si è fatto buio, e ancora non lo sapevo. Che bella partita."], ["voce", "Il mare è alto, immobile come l'acqua nella tazza di un gigante. Tutti guardano verso la radio. Adesso la Voce deve dire qualcosa."]], () => sceltaFinale(), "nf_stadio");
      });
    };
    function sceltaFinale() {
      const opts = [];
      const lunga = K.conchiglie(); const tutte = lunga[1] > 0 && lunga[0] >= lunga[1];
      if (tutte && K.stat("voce") >= 30) opts.push({ label: "«Portaci a casa tu»", sub: "Segreto: tutte le conchiglie dell'isola e una sintonia profondissima con la Voce", cls: "hot", big: true, fn: () => fine("lunga") });
      if (K.stat("rispetto") >= 20 && F.is("nf_con_scoglio")) opts.push({ label: "«Torniamo a casa tutti insieme»", sub: "Rondine e Gabbiani, in una sola squadra", big: true, fn: () => fine("squadra") });
      if (K.stat("voce") >= 14) opts.push({ label: "«Teniamo accesa la luce, insieme»", sub: "Una stagione al faro, poi si vedrà", big: true, fn: () => fine("custodi") });
      opts.push({ label: "«Riportaci a casa»", sub: "La strada più semplice, e anche questa è una buona strada", big: true, fn: () => fine("rotta") });
      ask("nf_voce", "(Il fruscio aspetta.) Ho una voglia in meno, adesso. Avevo solo quella. Non so cosa chiedere, a parte una cosa: cosa volete fare, adesso, voi?", opts, "nf_stadio");
    }
    function fine(kind) {
      const R = { rotta: { coins: 150, cos: ["nf_c3"] }, custodi: { coins: 170, cos: ["nf_c3", "nf_gabbiano"] }, squadra: { coins: 180, cos: ["nf_c3", "nf_gabbiano"] }, zattera: { coins: 150, cos: ["nf_c3", "nf_zattera"] }, lunga: { coins: 280, cos: ["nf_c3", "nf_gabbiano", "nf_conchiglia"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 9); questDone("nf_finale_c3");
      const lines = {
        rotta: [["nf_voce", "[triste] (Dolcissima.) A casa. Va bene. Non so dov'è, ma c'è una corrente che va da quella parte, e ci vado piano. Ci metto un po'. Chi ha fretta, dorme."], ["nf_bora", "[felice] (Stringe la mano a Scoglio.) Vieni con noi, papà? (Lui scuote la testa, sorridendo. Poi, dopo un attimo, annuisce.)"], ["voce", "<b>FINALE · LA ROTTA DI CASA.</b> Il viaggio dura tre giorni di mare e due notti di plancton. Il quarto giorno la costa del Borgo spunta dalla nebbia. Nessuno crederà alla storia. Tobia, però, ha tutto in HD."]],
        custodi: [["nf_fiorenzo", "(Alza il mestolo come uno scettro.) Il faro ha bisogno di mani. Io ne ho due, il Capitano due, il ragazzo del video altre due. Tre mani... pardon. Sei. Fa quattro. Fa la squadra."], ["nf_voce", "[felice] Una stagione! Poi me ne andrò, io, e voi tornate. Ho un conto sulle onde, e un'abitudine nuova: quando gioco, ascolto."], ["voce", "<b>FINALE · I CUSTODI DEL FARO.</b> La luce resta accesa. A ogni cambio di stagione, l'isola passa vicino alla costa e un'imbarcazione con la bandiera dei Rondine porta il pane, i giornali e le notizie. Il brodo è sempre obbligatorio."]],
        squadra: [["nf_scoglio", "[felice] (Guarda i suoi, uno a uno.) Ventisei anni. Sono quasi pronto. (Si mette il berretto dei Rondine sopra quello dei Gabbiani.) Non vi dico che aspetto avrò, quando scendo al porto. Un capello bianco al giorno, hanno detto."], ["nf_bora", "Mi andrà bene. (Gli prende il braccio.) Mi andrà benissimo."], ["voce", "<b>FINALE · TUTTI IN SQUADRA.</b> Rondine e Gabbiani rientrano in porto insieme, su una barca troppo piccola, cantando un inno a due voci che nessuno ha mai deciso di scrivere. Il tempo, quello arretrato, arriva a rate, come un abbonamento: Scoglio lo paga volentieri."]],
        zattera: [["nf_gaspare", "[felice] (Con i tre barili e una vela di fortuna.) Pronti. Sotto controllo. Sulla carta, naviga. Nel registro ho già scritto «arrivati». Per scaramanzia."], ["nf_voce", "[triste] Non giocate? (Il fruscio si abbassa.) Va bene. Capisco. Ma, se tornate... ci sono io."], ["voce", "<b>FINALE · LA ZATTERA DI GASPARE.</b> La zattera di Gaspare, contro ogni previsione, galleggia. Contro ogni pronostico, arriva. Più o meno. Una settimana dopo, ormeggiata al porto del Borgo, il registro dice: «una zattera, arrivata, ma con riserva»."]],
        lunga: [["nf_voce", "[felice] Io? Io vi porto? (Il fruscio sale, come una risata.) Ma io sono lenta! Sono molto lenta, e ci metto un mare intero! (Pausa.) Ma, sì. Mi piace. Va bene. Da oggi si viaggia con i fanali accesi."], ["nf_scoglio", "(Guarda l'orizzonte che si muove.) Venticinque anni sul posto fermo, e adesso si naviga. Il vecchio capitano ne ha viste, ma questa."], ["voce", "<b>FINALE SEGRETO · LA ROTTA PIÙ LUNGA.</b> L'isola nuota fino alla baia del Borgo, e poi si ferma, piano, davanti al molo. I turisti pensano a un nuovo stabilimento balneare. Ogni sera, nella baia, il faro gira tre volte e una voce chiede, sulla radio dei pescatori: «Giocate?»."]],
      }[kind];
      const sub = `${K.mem().ends.length}`;
      K.scene([...lines, ["voce", `${msg.join(" · ")}<br><span style="color:var(--dim)">Finali trovati: ${sub} su 5.</span>`]], () => K.openMain(), "nf_finale");
    }
    const talk = {
      nf_bora() {
        const s = S();
        if (s === 0) return K.scene([
          ["nf_bora", "[pensa] Una Voce che nuota. Un'isola che parla. Ho preso l'elenco di ieri, ho cancellato metà, ho aggiunto: «verificare se anche i granchi sono compresi». (Sospira.) Non so più cosa pensare. Ma è quello che dobbiamo fare: guardare."],
          ["nf_bora", "La Voce ha detto «vi faccio vedere dove sono davvero». C'è un cannocchiale sulla scogliera, a nord-est del faro. Ci vediamo lassù. Vado avanti io. E, ti prego, non farti portare in giro dalla marea."],
        ], () => { F.set("nf_c3_bora", true); setStep(N, 1); quest("nf_scogliera", "Il cannocchiale", "Al faro, poi a nord-est, sulla scogliera."); done(); }, "nf_spiaggia");
        if (s === 1) return say([["nf_bora", "Il faro, poi la scogliera. È una brutta idea con una bella vista. Le migliori."]]);
        return say([["nf_bora", "Sono alla scogliera con Scoglio. Raggiungici."]]);
        // (alla scogliera e allo stadio parla il testo dedicato, sotto)
      },
      nf_salvi() {
        const s = S();
        if (s <= 1) return say([["nf_salvi", "[pensa] Tutta questa storia dell'isola viva... Ho misurato il polso alla sabbia. Dà cinquantotto battiti al minuto, a riposo. Un'atleta."]]);
        return say([["nf_salvi", "Sono in forma. L'isola, per fortuna, anche: ho controllato. Pressione bassa, ma regolare. Spero lo sia sempre."]]);
      },
      nf_gaspare() {
        const s = S();
        if (s === 0 || s === 1) {
          if (!F.is("nf_zattera")) return K.scene([
            ["nf_gaspare", "(Con una vela di fortuna sotto il braccio.) Ho tre barili, due remi, una vela. Non è una zattera: è una buona intenzione con i galleggianti. Se mai dovessimo salpare senza chiedere il permesso a nessuno..."],
          ], () => ask("nf_gaspare", "Mi serve un sì: lo costruiamo, nel caso? Ci vuole mezz'ora e un po' di fiducia.", [
            { label: "Costruiamola", sub: "Gaspare ci mette il registro, tu un sì", big: true, fn: () => { F.set("nf_zattera", true); bond("fiducia", 3); F.add("nf_gas", 2); say([["nf_gaspare", "[felice] Costruita, in testa. A registro. Ora la costruisco anche davvero: ti avviso, dopo il giro del faro."]], done); } },
            { label: "Non ora", fn: done },
          ], "nf_spiaggia"), "nf_spiaggia");
          return say([["nf_gaspare", "[felice] La zattera: tre barili, due remi, mezza vela. Pronta per la partenza, se dovessimo mai partire senza chiedere permesso."]]);
        }
        return say([["nf_gaspare", F.is("nf_zattera") ? "La zattera è là, sotto la palma. Per ogni evenienza." : "Ho scritto sul registro: «Isola: viva. Da non confondere con i barili»."]]);
      },
      nf_tobia() {
        const s = S();
        if (s === 3) return say([["nf_tobia", F.is("nf_riprese") ? "[felice] Ho diciassette ore di girato. Sto facendo un montaggio con la colonna sonora dell'isola. La marea fa il basso." : "[pensa] Camera spenta, come promesso. Per una volta, guardo e basta. Sai che è bellissimo? Meno male che ci sono i miei occhi."]]);
        if (s === 4) return say([["nf_tobia", "[felice] Quella partita... non la dimenticherò mai. E per un attimo sono stato contento di non avere la camera."]]);
        return say([["nf_tobia", "Eccomi. Guarda, adesso: il gioco comincia."]]);
      },
      nf_fiorenzo() {
        const s = S();
        if (s === 3) return say([["nf_fiorenzo", "Il mestolo è pronto. Il brodo è pronto. La Voce è pronta. Voi, mi pare, un po' meno. Va bene lo stesso."]]);
        return say([["nf_fiorenzo", "Brodo."]]);
      },
      nf_scoglio() {
        const s = S();
        if (s === 1 && K.api.trZone() === "nf_scogliera") return say([["nf_scoglio", "Prima guarda col cannocchiale, poi ne parliamo. Ho una storia lunga e un piccolo timore di raccontarla."]]);
        if (s === 2 && K.api.trZone() === "nf_scogliera") return K.scene([
          ["nf_scoglio", "[pensa] (Gli occhi sul mare, il berretto in mano.) Quando vi ho visti arrivare con quelle maglie, ho dovuto sedermi. Il numero, lo stemma: la rondine. Non era solo una somiglianza. Era il nostro. Era il vecchio stemma dei Rondine."],
          ["nf_bora", "[sorpreso] (Si avvicina piano. Poi si ferma.) Capitano Scoglio. Marino Scoglio. Il capitano dei Rondine che è scomparso con il volo del '99. Il mio papà. (Alla squadra) Ho detto «Bora»: è il cognome di mio marito. Per il resto sono Vittoria Scoglio, e ho avuto quarant'anni di sospetti su dove fosse finito."],
          ["nf_scoglio", "[triste] Vittoria. (Il berretto gli cade di mano.) L'ultima volta che ti ho vista avevi nove anni e dicevi che il pallone aveva una mano sola. Adesso... (La guarda.) Sei diventata un capitano."],
          ["nf_bora", "Tu non sei invecchiato di un giorno. Sei esattamente come eri nelle foto. Io ho quarantun anni, e tu quanti, quarantuno? Siamo coetanei, papà. (Ride e piange insieme.) È ridicolo."],
          ["nf_scoglio", "Quarantuno. Oggi, secondo me. (Una pausa.) I Gabbiani siamo i Rondine del '99. Siamo caduti qui, venticinque anni fa, con lo stesso pilota automatico e la stessa idea sua. La Voce ci ha tenuti: sull'isola il tempo scorre piano, e quasi per niente quando si gioca. Qualcuno la chiama maledizione. Io la chiamo una lunga partita."],
          ["nf_scoglio", "Non siamo prigionieri. Potevamo andarcene mille volte. Ma lei era sola, e noi avevamo una squadra. Alla lunga si smette di chiedersi se si vuole andare via. Succede anche a voi, se restate troppo. Lo sapevo dal primo giorno. Per questo vi ho fatto giocare: volevo sapere che squadra siete."],
          ["voce", "Il vento porta il rumore delle onde e, sotto, il fruscio di una radio che ascolta. Nessuno dice niente per un po'. Poi Bora si soffia il naso con un fazzoletto da cinque monete, e Scoglio fa finta di non guardare."],
        ], () => { F.set("nf_c3_scoglio", true); setStep(N, 3); bond("rispetto", 5); bond("fiducia", 3); K.learnLore("l_gabbiani"); questDone("nf_scogliera"); quest("nf_finale_c3", "La Partita Grande", "Lo Stadio della Marea, a est della scogliera. La Voce aspetta."); done(); }, "nf_faro");
        if (K.api.trZone() === "nf_scogliera") return say([["nf_scoglio", "Lo stadio è là, a est: l'ho tirato su un domenica alla volta. Ogni palo ha un nome: chi l'ha piantato, chi lo ha sostituito, chi lo ha tenuto in piedi. Vieni."]]);
        return say([["nf_scoglio", s >= 4 ? "Che bella partita." : "(Si sistema il berretto.) Quando vuoi. Il campo è pronto da venticinque anni."]]);
      },
    };
    // alla scogliera Bora parla in modo diverso, secondo i passi
    const talkBoraScogliera = () => {
      const s = S();
      if (s === 1) return say([["nf_bora", "Il cannocchiale è lì, sul belvedere. Guarda. Io qui ho già guardato. Non te lo dico: te lo devi vedere."]]);
      if (s === 2) return say([["nf_bora", "(Con le mani in tasca e lo sguardo basso.) Parlagli tu. Io ho bisogno di cinque minuti. O di venticinque anni."]]);
      return say([["nf_bora", "Andiamo allo stadio. Io gioco con te, qualsiasi cosa succeda. Poi se perdiamo, pago io il brodo."]]);
    };
    const origBora = talk.nf_bora;
    talk.nf_bora = () => (K.api.trZone() === "nf_scogliera" || K.api.trZone() === "nf_stadio" ? (K.api.trZone() === "nf_stadio" ? say([["nf_bora", S() >= 4 ? "Ce l'abbiamo fatta. (Si asciuga la fronte.) Adesso, però, ho una sola domanda: cosa mangiamo?" : "Pronta. Non so se lo sia, ma l'ho detto con convinzione."]]) : talkBoraScogliera()) : origBora());
    const obj = {
      "nf_scogliera:V": () => {
        if (S() < 1) return say([["voce", "Un cannocchiale d'ottone, puntato verso il mare. Meglio aspettare di sapere cosa cercare."]]);
        if (S() >= 2) return say([["voce", "Dal cannocchiale: la costa, il mare, e un lungo sorriso fatto di onde. L'isola, vista da fuori, non smette di nuotare."]]);
        K.scene([
          ["voce", "Ti avvicini al cannocchiale e ci guardi dentro. Prima c'è solo azzurro. Poi, piano, il mare si apre: una costa lunga, una cresta di scogli, un'insenatura che sembra un sorriso."],
          ["voce", "Poi capisci. Gli scogli sono le scaglie di un guscio. Il faro sta sul bordo, come un piccolo spillo. L'insenatura è la bocca. Più in là, nell'acqua, due pinne enormi muovono il mare un nodo alla volta. E in mezzo all'acqua, calma, assorta, c'è un occhio, grande come un laghetto, che ti guarda."],
          ["nf_voce", "[felice] Ciao. (La voce arriva dal vento, non dalla radio.) Questa sono io. Ti piaccio? Sono una tartaruga marina, credo. Ho smesso di contare gli anni quando ho smesso di contare le stagioni. Le secche sono le mie pinne, il faro è una luce che mi piace tenere."],
          ["nf_voce", "[triste] Mi dispiace per l'aereo. Era in cielo e sembrava stanco, e io ho solo... allungato un po' la mano. L'ho tirato giù con una brezza. Volevo qualcuno con cui giocare. Poi mi sono accorta che non è così che si fa."],
        ], () => { setStep(N, 2); bond("voce", 6); K.learnLore("l_tartaruga"); questDone("nf_scogliera"); quest("nf_scoglio_c3", "Il Capitano e la Capitana", "Parla con Scoglio, alla scogliera."); done(); }, "nf_faro");
      },
      "nf_stadio:R": () => {
        const s = S();
        if (s < 3) return say([["voce", "Una radio ben lucidata, sul palco dei Gabbiani. Dorme, o fa finta."]]);
        if (s >= 4) return sceltaFinale();
        K.scene([
          ["nf_voce", "[felice] Eccoti! (La radio si sveglia con un colpo di fruscio.) Eccovi tutti! Ho fatto una squadra: Il Riflusso. Undici onde. Giocano benissimo, ma non hanno mai visto nessuno vincere. Magari lo imparano."],
          ["nf_scoglio", "Io non giocavo così bene dal '99. E questo è un complimento. A noi due, Voce: dimmi che stavolta le regole le rispetti. Niente onde nel secondo tempo."],
          ["nf_voce", "Niente onde nel secondo tempo. Sì, se la marea sale c'è un po' di acqua nel campo, ma quello è mare, non onde. È una questione di sfumatura."],
        ], () => ask("nf_voce", "Allora? La Partita Grande, quando la marea è alta. Voi giocate, io non bara. Quasi mai.", [
          { label: "Giochiamo la Partita Grande", sub: "Marea · si gioca contro Il Riflusso", cls: "hot", big: true, fn: grande },
          ...(F.is("nf_zattera") ? [{ label: "«Abbiamo la zattera di Gaspare»", sub: "Si parte senza giocare. È una scelta", big: true, fn: () => say([["nf_voce", "[triste] Non giocate? (Il fruscio è come un respiro trattenuto.) Va bene. Vi lascio andare. Non è una cattiveria: è proprio quello che fanno gli amici."]], () => fine("zattera")) }] : []),
          { label: "Dopo", fn: done },
        ], "nf_stadio"), "nf_stadio");
      },
      "nf_faro:z:23,12": () => K.pagina("maglia", () => say([["voce", S() >= 2 ? "Una maglia dei Rondine, vecchia di una generazione, appesa al sole ad asciugare. Il numero è lo stesso del tuo, e sul retro c'è scritto, a pennarello: «S. CAPITANO»." : "Una maglia dei Rondine, vecchia di una generazione, appesa ad asciugare. Il numero è lo stesso del tuo. Strano."]], done)),
      "nf_stadio:z:24,2": () => K.pagina("cocco", () => say([["voce", "Sulla cassa, appoggiato come un trofeo, c'è un pallone di cocco levigato dal mare, cucito con la fibra delle palme. Rotola meglio di quelli veri."]], done)),
    };
    return {
      n: N, title: "Alta Marea", sub: "La scogliera, il cannocchiale, lo Stadio della Marea e la Partita Grande", goal, start: "nf_spiaggia", introBg: "nf_stadio", zones, talk, obj,
      intro: () => [["voce", "<b>NAUFRAGHI DEL PALLONE</b>. Episodio 3. L'ultima notte dell'isola: la marea è alta, il campo è pronto, e qualcuno, da qualche parte, ha già scelto la musica."], ["voce", "Nel registro di Gaspare, alla voce «Cose che sappiamo», c'è una riga sola: «Siamo qui»."]],
    };
  }
  boot();
})();
