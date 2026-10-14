// js/naufraghi-c2.js - NAUFRAGHI DEL PALLONE · Capitolo 2 «La voce del faro»
// La laguna (di giorno si attraversa sulle secche, di notte sulle pietre luminose), il faro, la sala radio.
// Tobia ha passato tre notti a filmare una laguna che sembra una scacchiera; il faro ha un guardiano e una squadra di vicini
// di casa con la maglia a gabbiani; la voce della radio ha un'idea sua di che cos'è una partita.
(function () {
  "use strict";
  function boot() { const D = window.__naufraghi; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("nf_tobia", { acc: ["cuffie"], name: "Tobia Bellandi", tag: "", hair: "#5a3a22", style: "messy", skin: "#e8c4a0", eye: "#2a2a2a", bg: ["#1e40af", "#fbbf24"], shirt: "#f59e0b" },
      "Stagista video dei Rondine, ventidue anni, una telecamera sempre accesa e una fiducia incrollabile nel «materiale buono». Racconta tutto in diretta anche quando non ha nessuno collegato. Soprattutto in quel caso.");
    K.cast("nf_scoglio", { acc: ["berretto"], name: "Capitan Marino Scoglio", tag: "", hair: "#c8c8d0", style: "ordinato", skin: "#d9a679", eye: "#2a3a4a", bg: ["#e2e8f0", "#64748b"], shirt: "#f8fafc" },
      "Il capitano dei Gabbiani, la squadra che abita il lato del faro. Stretta di mano ferma, sguardo di chi ha già visto come va a finire la partita e te lo lascia scoprire da solo.");
    K.cast("nf_fiorenzo", { acc: ["grembiule"], name: "Fiorenzo il Guardiano", tag: "", hair: "#e5e5e5", style: "buzz", skin: "#c68a5e", eye: "#3a2a1a", bg: ["#78716c", "#fcd34d"], shirt: "#44403c" },
      "Tiene acceso il faro, lucida i vetri, conta le ondate e cucina un brodo di pesce che nessuno ha mai avuto il coraggio di rifiutare. Parla poco, e quando parla sembra che stia leggendo una targa.");
    K.cos("nf_c2", { kind: "acc", label: "Cuffie del faro", val: "cuffie", from: "Capitolo 2 di Naufraghi del Pallone" });
    K.lore("l_faro", { t: "Il faro", d: "Una torre a strisce rosse e bianche, con la luce che gira da sola. Dentro c'è la sala radio, con la mappa dell'isola disegnata a matita: la costa, ogni volta che la guardi, è un po' diversa." });
    K.lore("l_voce", { t: "La Voce", d: "Non parla dalla radio: la usa, come si parla dentro una conchiglia. Chiede sempre la stessa cosa e le basta una partita per essere contenta." });
    const goal = (s) => ({
      0: "Alla spiaggia: la Capitana ha un piano per la luce del faro.",
      1: "A est della giungla c'è una laguna. Cerca le tracce di Tobia.",
      2: "Tobia è su un isolotto della laguna. Si raggiunge soltanto di notte, sulle pietre luminose (dal menu: Passa il tempo).",
      3: "Il faro. Fiorenzo e il capitano dei Gabbiani, Scoglio, ti aspettano. Per entrare serve una partita.",
      4: "La sala radio, nel faro. Ascolta la Voce.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const MARE_LG = [[8, 10, 22, 11, "k", "bassa"], [8, 14, 22, 14, "h", "notte"], [8, 4, 11, 4, "h", "notte"]];
    const zones = {
      nf_laguna: {
        region: "isola", name: "Naufraghi del Pallone · La laguna", short: "La laguna", sub: "Una laguna in mezzo a due rive: di giorno le secche, di notte le pietre", bg: "nf_laguna", time: (s, KK) => KK.fase(), travel: [3, 11],
        w: 36, h: 20, start: [3, 11], items: [[3, 16], [17, 3], [30, 16]],
        mare: MARE_LG,
        areas: [[12, 2, 18, 6, "L'isolotto"], [8, 9, 22, 15, "La laguna"], [23, 2, 35, 18, "La riva del faro"], [0, 0, 7, 19, "La riva della giungla"]],
        flavor: { n: "Un cartello fatto con un remo: «ATTENZIONE: LA MAREA FA COME VUOLE». Sotto, con altra scrittura: «anche di notte»." },
        doors: { "0,11": { to: "nf_giungla", at: [28, 10] }, "35,10": { to: "nf_faro", at: [1, 10], locked: (KK) => (KK.mem().ch < 2 ? "Il faro è ancora lontano, e nessuno ha un motivo per andarci." : false) } },
        intro: [["voce", "La giungla finisce di colpo e comincia l'acqua: una laguna turchese, immobile, con isolotti come briciole. In fondo, sul lato opposto, la torre del faro, rossa e bianca, come una caramella piantata nella roccia."], ["voce", "Di giorno, con la marea bassa, dalla riva parte una striscia di secche. Di notte, nell'acqua, si accendono delle pietre."]],
        npcs: (s) => (s >= 2 ? [{ id: "nf_tobia", at: [15, 4] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 19, "w"); lay(0, 2, 7, 18, ","); lay(7, 2, 7, 18, "m"); lay(23, 2, 35, 18, ","); lay(23, 2, 23, 18, "m"); lay(12, 2, 18, 6, ","); lay(12, 6, 18, 6, "m");
          lay(1, 10, 6, 12, ":"); lay(24, 9, 34, 11, ":");
          put(0, 11, "J"); put(35, 10, "J"); put(5, 7, "E"); put(6, 11, "n");
          [[1, 3], [4, 4], [2, 15], [5, 17], [1, 8], [6, 14], [26, 4], [30, 3], [33, 6], [28, 15], [33, 14], [25, 17], [13, 3], [18, 5]].forEach(([x, y]) => put(x, y, "t"));
          [[10, 14], [20, 10]].forEach(([x, y]) => { /* niente: l'acqua è libera */ });
          K.mareLay(L, { mare: MARE_LG });
        },
      },
      nf_faro: {
        region: "faro", name: "Naufraghi del Pallone · Il faro", short: "Il faro", sub: "La torre a strisce, il campo dei Gabbiani, il guardiano con il brodo", bg: "nf_faro", time: (s, KK) => KK.fase(), travel: [2, 10],
        w: 30, h: 20, start: [2, 10], items: [[3, 15], [26, 5]],
        areas: [[11, 3, 18, 9, "La torre"], [19, 9, 28, 16, "Il campo dei Gabbiani"], [0, 0, 29, 19, "Punta Cieca"]],
        flavor: { f: "Una staccionata ordinata: ogni asse è inchiodata con tre chiodi, non due. Chi l'ha costruita non ammette scorciatoie." },
        doors: { "29,5": { to: "nf_scogliera", at: [1, 10], locked: (KK) => (KK.mem().ch < 3 ? "Un sentiero sale verso nord-est, fra gli scogli. Per ora non c'è motivo di andarci: la Voce non ha ancora detto dove." : false) }, "0,10": { to: "nf_laguna", at: [34, 10] }, "14,9": { to: "nf_radio", at: [7, 8], locked: (KK) => (KK.stepOf(2) < 4 ? "La porta del faro è chiusa. Sul legno, una targhetta di ottone: «SI ENTRA DOPO AVER GIOCATO»." : false) } },
        intro: [["voce", "Punta Cieca: una lingua di scoglio bianco di sale, con il faro nel mezzo come un faro vero che fa il faro sul serio. A est, un campo di tende ordinatissime, fuochi spenti con cura e una lavagna."], ["voce", "In cima, la luce gira. Da vicino, si sente anche un rumore: un fruscio continuo, come di una radio sintonizzata sul mare."]],
        npcs: (s) => [{ id: "nf_fiorenzo", at: [11, 10] }, { id: "nf_scoglio", at: [19, 11] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 19, "w"); lay(0, 3, 29, 17, ","); lay(0, 3, 29, 3, "m"); lay(0, 17, 29, 17, "m"); lay(1, 10, 12, 10, ":"); lay(14, 9, 14, 12, ":"); lay(14, 11, 20, 11, ":");
          lay(14, 3, 15, 8, "F"); put(14, 9, "q");
          lay(20, 9, 28, 9, "f"); lay(20, 16, 28, 16, "f"); lay(28, 10, 28, 15, "f"); put(21, 10, "n");
          [[23, 12], [25, 13], [22, 14], [26, 11]].forEach(([x, y]) => put(x, y, "z")); [[20, 12], [20, 14]].forEach(([x, y]) => put(x, y, "l"));
          [[2, 5], [5, 7], [4, 13], [8, 15], [9, 5], [26, 4], [24, 7], [3, 16]].forEach(([x, y]) => put(x, y, "t"));
          lay(24, 5, 28, 5, ":"); put(29, 5, "J");
        },
      },
      nf_radio: {
        interior: true, region: "interno", name: "Naufraghi del Pallone · La sala radio", short: "La sala radio", sub: "Una stanza tonda in cima al mondo, con la radio che respira", bg: "nf_radio", w: 14, h: 10, start: [7, 8], outside: ["nf_faro", 14, 10], items: [[11, 6]],
        act: { R: "Ascolta la radio", L: "Leggi", T: "Guarda il tavolo", W: "Guarda l'oblò", v: "Esci", n: "Leggi" },
        flavor: {
          L: "Quaderni con le coste degli anni: ogni anno, la costa disegnata è diversa. L'ultimo, scritto ieri, ha un'annotazione: «sempre più a est. Dice che non è un problema».",
          T: "Un tavolo con due tazze, una mappa a matita e un fischietto arrugginito. Una delle due tazze è calda.",
          W: "L'oblò guarda il mare. Da qui si vede bene come l'orizzonte non sta mai fermo: sale e scende, piano, come un respiro.",
          n: "Un cartello fatto a mano: «NON SPEGNERE LA RADIO. SE PARLA, ASCOLTA. SE CHIEDE, RISPONDI»."
        },
        intro: [["voce", "Una stanza tonda, di legno scuro e ottone, con un oblò sul mare. Cavi che pendono dal soffitto, una mappa a matita, e una radio grande che fa un rumore che somiglia a un respiro."]],
        npcs: (s) => [{ id: "nf_fiorenzo", at: [3, 5] }, { id: "nf_tobia", at: [10, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "="); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a");
          put(7, 9, "v"); put(7, 2, "R"); put(5, 2, "L"); put(9, 2, "L"); put(4, 7, "T"); put(2, 2, "W"); put(11, 2, "W"); put(1, 6, "n");
        },
      },
    };
    const sfida = () => {
      const after = (r) => {
        const win = !!(r && r.win), quit = !!(r && r.quit);
        if (quit) return say([["nf_scoglio", "[pensa] Il campo si lascia solo quando il mare ha finito. Quando hai voglia, riprendiamo da zero."]], done);
        F.set("nf_duello", win ? "vinto" : "perso");
        if (!win) return K.scene([["nf_scoglio", "[ride] Ho vinto io, e posso dirti che non mi piace. Una partita senza lotta è una colazione senza cornetto. Riprova quando vuoi: il mare non si offende."]], done, "nf_faro");
        setStep(N, 4); bond("rispetto", 8); F.set("nf_scoglio_ok", true); questDone("nf_duello_c2");
        K.scene([
          ["nf_scoglio", "[felice] Un buon gol, un bel rimbalzo sull'acqua e un compagno che sa quando passarla. (Ti stringe la mano e poi, per un istante, anche l'altra.) Giocate come chi ha già perso qualcosa e ha deciso di non perdere anche la voglia."],
          ["nf_fiorenzo", "La porta del faro è aperta. In cima c'è la radio: se vuole parlare con voi, vi lascia fare. Io preparo il brodo. È obbligatorio."],
          ["voce", "Sulla porta del faro, la targhetta di ottone si è girata da sola. Adesso dice: «PREGO, ACCOMODATEVI»."],
        ], () => { quest("nf_radio_c2", "La sala radio", "Dentro il faro. Ascolta la Voce."); done(); }, "nf_faro");
      };
      ask("nf_scoglio", "Capitan Marino Scoglio, dei Gabbiani. Chi viene al faro gioca: è una regola vecchia, e le regole vecchie non si discutono. Marea, due contro due. Voi e noi: il campo ci metterà qualcosa in mezzo.", [
        { label: "Accetto la sfida", sub: "Marea · due contro due contro i Gabbiani", cls: "hot", fn: () => K.mareaMatch({ title: "Marea · La sfida del faro", opp: { name: "I Gabbiani", color: "#f1f5f9", style: "equilibrata", players: [{ name: "Scoglio" }, { name: "Fiorenzo" }], keeper: { name: "Boa" } }, mates: [{ name: "Tobia" }, { name: "Bora" }], intro: "Sul campo di Punta Cieca, davanti al faro. Il capitano Scoglio ha una stretta di mano da arbitro e un sorriso da portiere." }, after) },
        { label: "Un momento", fn: done },
      ], "nf_faro");
    };
    const talk = {
      nf_bora() {
        const s = S();
        if (s === 0) return K.scene([
          ["nf_bora", "[pensa] Stanotte ho dormito un'ora e mezza. Sveglia, sentito rumore, uscita. La radio si è spenta alle cinque e quattordici con un «a domani». Per una cosa che non ha le batterie, direi che ha un buon senso dell'orario."],
          ["nf_bora", "Ragioniamo. La luce che gira, nel mare: è un faro. Un faro ha un trasmettitore. Un trasmettitore ha un guardiano. Un guardiano, di solito, ha una scusa. Voglio sapere quale."],
          ["nf_bora", "Tobia lo cerchiamo prima: ricordi la giungla, a est? C'è una laguna. Va' a vedere, io tengo il campo. E, per favore, ogni tanto guarda l'acqua. Qui l'acqua ha un orario."],
        ], () => { F.set("nf_c2_bora", true); setStep(N, 1); K.pagina("marea", () => { quest("nf_laguna", "Tracce di Tobia", "Attraversa la giungla, verso est: c'è una laguna."); done(); }); }, "nf_spiaggia");
        if (s === 1) return say([["nf_bora", "La laguna è a est, oltre la giungla. Se l'acqua si mette fra te e l'altra riva, aspetta: ha un orario, ricordi? Dal menu puoi far passare il tempo, con calma."]]);
        if (s === 2) return say([["nf_bora", "Le cose vanno così: Tobia è sopra un isolotto, la strada è fatta di pietre che si accendono di notte, io non faccio domande. Alle domande ci pensa lui."]]);
        if (s === 3) return say([["nf_bora", "Un faro con un capitano e una squadra. Mi aspettavo un guardiano. Mi sono sempre aspettata poco: è per questo che mi stupisco spesso."]]);
        if (s === 4) return say([["nf_bora", "Se la radio parla, ascolta tutto. Poi mi riferisci. Con ordine. Dai, sei in gamba. E non farti offrire il brodo."]]);
        return say([["nf_bora", "Ho preso carta e penna. Ho scritto: «L'isola è viva». Poi ho cancellato. Poi l'ho riscritto. Ho una sola domanda: quanto è grande?"]]);
      },
      nf_salvi() {
        const s = S();
        if (s === 0) return say([["nf_salvi", "(Con un cappello di foglie che somiglia a un'accusa.) Mi sono dato la crema SPF cinquanta, la pelle ha deciso di non sentire niente. Non lo prendo come un buon segno: la pelle senza dolore è già una manifestazione di qualcosa."]]);
        if (s >= 3) return say([["nf_salvi", "[pensa] Fiorenzo. Mi ha mandato un brodo con un bigliettino: «contro la nostalgia». Sono guarito subito. Ho dei sospetti sulla ricetta: non c'è nessun nome latino."]]);
        return say([["nf_salvi", "Ho dato un nome alla marea: «Tidalis Capricciosa». Non si lascia sedare, e questo è già qualcosa."]]);
      },
      nf_gaspare() {
        const s = S();
        if (s === 0) return say([["nf_gaspare", "(Sistema il registro.) Mi serve un favore: se trovi altre noccioline, registrale. Ieri sera ne ho contate duecentoundici, stamattina duecentododici. Per me è un miracolo, per il registro è un'irregolarità."]]);
        if (s >= 3) return say([["nf_gaspare", "[felice] Un faro! Con un faro si fa rotta. E con una rotta si fa una mappa. E con una mappa si fa un registro delle mappe. Sono felice come non mai."]]);
        return say([["nf_gaspare", "Tre barili vuoti, due remi, mezza vela. Ho scritto: «imbarcazione, in potenza». La potenza, per ora, è una cosa che ho solo io."]]);
      },
      nf_tobia() {
        const s = S();
        if (s < 2) return PASS_();
        if (s === 2) {
          return K.scene([
            ["nf_tobia", "[sorpreso] Aspetta, aspetta, aspetta! Un attimo, sono in diretta. (Alza la camera.) Salve a tutti, sono Tobia, e dopo questo scherzo vi mostro l'isola. (Ti vede.) Ah. Sei vero."],
            ["nf_tobia", "[felice] Tobia Bellandi, stagista video dei Rondine. Sono qui da tre giorni. Avevo un pannello solare, una telecamera, un panino. Il panino è stato il primo a lasciarmi. Hai un panino?"],
            ["nf_tobia", "Quella notte, dopo lo schianto, ho visto una luce nella giungla e l'ho seguita. Ho trovato la laguna e le pietre che si accendono. Ho girato quattordici ore: ogni notte l'acqua fa la stessa cosa alla stessa ora. Sembra una scacchiera."],
            ["nf_tobia", "[pensa] E poi ho visto la squadra. Maglia bianca, gabbiano sul petto. Giocano meglio di chiunque abbia visto, e non hanno mai fretta. Mi hanno portato un brodo e mi hanno detto: «Non filmare, finché non te lo diciamo». Ho obbedito. Per un'ora."],
            ["nf_tobia", "Non sono tornato perché le pietre si spengono all'alba e io ero in pieno montaggio. Se rientravo in acqua, mi bagnavo l'obiettivo. Ho il mio ordine di priorità."],
          ], () => ask("nf_tobia", "Vengo con te al faro, ma ho un dubbio: lo posso riprendere, il faro? Se mi dici di no, tengo la camera spenta fino a quando non me lo dici tu.", [
            { label: "Riprendi tutto", sub: "Prove, immagini, testimonianza. Tobia è felice", big: true, fn: () => { F.set("nf_riprese", true); bond("fiducia", 4); K.pagina("video", () => fineTobia()); } },
            { label: "Camera spenta, per ora", sub: "Rispetti la richiesta dei Gabbiani", big: true, fn: () => { F.set("nf_riprese", false); bond("rispetto", 5); fineTobia(); } },
          ], "nf_laguna"), "nf_laguna");
        }
        return say([["nf_tobia", s >= 4 ? "[felice] Questa storia è troppo grande per una sola camera. Ne ho comprata un'altra, mentalmente." : "Il faro è là, a est. Io intanto metto in ordine il girato: undici ore da tagliare in dodici secondi. È un mestiere crudele."]]);
      },
      nf_fiorenzo() {
        const s = S();
        if (s < 3) return say([["nf_fiorenzo", "(Passa uno straccio sulla ringhiera.) Il faro lo apro quando serve. Intanto brodo."]]);
        if (s === 3) {
          if (!F.is("nf_c2_fiorenzo")) return K.scene([
            ["nf_fiorenzo", "Fiorenzo. Guardiano. Olio, vetri, onde. Seconda ondata, terza, quarta. Da quando sono qui le conto. Non sono mai uguali, e sono sempre quelle."],
            ["nf_fiorenzo", "(Ti porge un mestolo.) Brodo. Non serve rifiutare, è inutile: a un certo punto lo bevono tutti."],
            ["nf_fiorenzo", "Il Capitano ti vuole conoscere. Con la mano, con il tempo, con la palla. È un uomo semplice: se lo batti, ti vuole bene, e se perdi, ti vuole bene lo stesso. Va' da lui, è al campo."],
          ], () => { F.set("nf_c2_fiorenzo", true); bond("fiducia", 2); K.pagina("faro", () => { quest("nf_duello_c2", "La regola del faro", "Parla con il Capitano Scoglio, al campo dei Gabbiani, a est."); done(); }); }, "nf_faro");
          return say([["nf_fiorenzo", "Il Capitano è al campo, a est. Se si fa tardi, il brodo si raffredda. Non è un avvertimento. È la pura verità."]]);
        }
        return say([["nf_fiorenzo", s >= 4 ? "Su, la radio. Io resto qui con le onde. Se ne perdo una, dopo la ricontano." : "Brodo."]]);
      },
      nf_scoglio() {
        const s = S();
        if (s < 3) return say([["nf_scoglio", "(Con le braccia incrociate, lo sguardo al mare.) Il faro aspetta chi gioca. Prima salutate Fiorenzo, che è il più educato di noi. Io sono quello che segna."]]);
        if (s === 3) {
          if (!F.is("nf_c2_fiorenzo")) return say([["nf_scoglio", "Parla prima con Fiorenzo. È una questione di educazione: lui ha il brodo e io ho il mestiere."]]);
          if (!F.is("nf_c2_scoglio")) return K.scene([
            ["nf_scoglio", "Marino Scoglio, capitano dei Gabbiani. (Una stretta di mano, ferma.) La squadra venuta dal cielo. Vi aspettavamo. Un po' prima, per la verità. Ma l'importante è arrivare."],
            ["nf_scoglio", "Non vi domando chi siete. Voglio sapere come giocate: è l'unica cosa vera di una persona. Sul campo si vede se uno passa la palla o se la tiene per sé."],
          ], () => { F.set("nf_c2_scoglio", true); sfida(); }, "nf_faro");
          return sfida();
        }
        return say([["nf_scoglio", s >= 4 ? "[felice] Va' su. La radio ha tante cose da dirti, e le dice tutte insieme. Se ti gira la testa, siediti: è normale." : "..."]]);
      },
    };
    function PASS_() { return K.PASS; }
    function fineTobia() {
      setStep(N, 3); questDone("nf_laguna"); K.setFase("giorno");
      K.scene([["nf_tobia", "[felice] Andiamo, allora. È mattino! Il faro è a est, dopo la laguna: di giorno si passa sulle secche. Attenzione: io ho paura dei granchi."], ["voce", "Tobia ricarica la batteria con un pannello solare grande come un vassoio, spegne la lucina rossa e ti segue lungo le pietre. Il faro, laggiù, gira piano."]], () => { quest("nf_faro_c2", "Il faro", "A est, dopo la laguna. Di giorno si attraversa sulle secche."); K.go("nf_laguna", 5, 11); }, "nf_laguna");
    }
    const obj = {
      "nf_laguna:E": () => {
        if (S() === 1) { setStep(N, 2); F.set("nf_camera", true); K.pagina("video", () => say([["voce", "Un treppiede di bambù con una camera impermeabile e un biglietto scotchato sul cavo: «TOBIA - NON TOCCARE. SE LA TROVI: L'ISOLOTTO È DI NOTTE». La memoria è piena di video della laguna: l'acqua fa sempre la stessa cosa alla stessa ora, e ogni notte le pietre disegnano la stessa parola, in fondo. Si legge solo da vicino: «GIOCA»."], ["voce", "Le pietre luminose portano a un isolotto, a nord. Di giorno sono solo acqua. Dal menu puoi far passare il tempo: «Passa il tempo»."]], () => { quest("nf_laguna", "Tobia sull'isolotto", "Aspetta la notte e attraversa le pietre luminose, a nord."); done(); }));
        } else say([["voce", F.is("nf_camera") ? "Il treppiede di Tobia. Il display è spento. Rimane il biglietto: «SE LA TROVI: L'ISOLOTTO È DI NOTTE»." : "Un treppiede di bambù con una camera. È accesa, e punta verso la laguna. Meglio non toccare ancora."]]);
      },
      "nf_faro:n": () => K.pagina("gabbiani", () => say([["voce", "Una lavagna con un calendario fermo: l'ultima data scritta è molto vecchia, ma ogni giorno ha una crocetta nuova. Sotto, l'elenco delle regole: «1. Si gioca. 2. Si ascolta il mare. 3. Il brodo è obbligatorio». Alla riga 4, a matita: «Non parlare dell'età»."]], done)),
      "nf_radio:R": () => {
        const s = S();
        if (s < 4) return say([["voce", "La radio fruscia piano. Non è il momento: prima la porta, poi la voce."]]);
        if (s > 4) return say([["voce", "La radio fa il suo respiro. Dall'oblò, la luce del faro passa di qua ogni pochi secondi, come un'idea."]]);
        K.scene([
          ["voce", "Giri la manopola. Il fruscio si apre come un sipario, e la voce è più vicina di prima, e anche più grande: sembra che parli da tutte le pareti insieme."],
          ["nf_voce", "...ciao! Ciao ciao. (fruscio) Ce l'hai fatta. Sono contenta. Vi stavo aspettando dalla porta, ma c'era Marino di mezzo. Lui è un po' severo, ma gioca benissimo, vero?"],
          ["nf_voce", "[pensa] Non sono nella radio: lei è una conchiglia, ci parlo dentro come si fa con il mare. Io sono... (pausa) ...l'isola. Ti sembra strano? A me, all'inizio, sì. Poi ci si abitua."],
          ["nf_tobia", "[sorpreso] Aspetta. «L'isola»? Intendi proprio l'isola? La terra, la sabbia, le palme, la..."],
          ["nf_voce", "Tutta. Anche la sabbia. La marea è il mio respiro, il faro è un posto dove ho voluto una luce, le pietre le accendo io quando c'è silenzio. Ogni notte nuoto un po' più a est. Non vi spaventate: sono lenta, e mi piace molto la compagnia."],
          ["nf_fiorenzo", "(Dall'angolo, con una tazza in mano.) Io lo sapevo. Ma, a dirlo, non mi avrebbe creduto nessuno. Neanche io."],
          ["nf_voce", "Ho tenuto tanti ospiti: i primi sono arrivati tanto tempo fa, con una barca bianca. Poi sono rimasti, e poi... non lo so, adesso sono sempre gli stessi. Io, però, voglio giocare. Con voi. Non è una cattiveria, è una voglia."],
        ], () => ask("nf_voce", "Ecco la mia proposta. Una partita grande, quando la marea è alta. Vi porto a vedere dove sono davvero, e poi giochiamo. Voi giocate, io vi dico tutto. Allora?", [
          { label: "«Giochiamo. Poi ci porti a casa»", sub: "Un patto chiaro, senza giri di parole", big: true, fn: () => fineC2("patto") },
          { label: "«Cosa ti serve davvero?»", sub: "Ascolti la Voce, con pazienza", big: true, fn: () => fineC2("ascolto") },
          { label: "«Non puoi tenerci qui»", sub: "Metti dei paletti, con fermezza", big: true, fn: () => fineC2("fermezza") },
        ], "nf_radio"), "nf_radio");
      },
    };
    function fineC2(kind) {
      questDone("nf_radio_c2"); questDone("nf_faro_c2");
      F.set("nf_c2_" + kind, true);
      const msg = K.reward("c2:nf", { coins: 90, cos: ["nf_c2"] }); finishChapter(N, kind); setStep(N, 5); K.learnLore("l_faro"); K.learnLore("l_voce");
      if (kind === "patto") { bond("voce", 8); bond("fiducia", 3); } else if (kind === "ascolto") { bond("voce", 14); bond("fiducia", 2); } else { bond("rispetto", 6); bond("voce", 2); }
      const l = {
        patto: [["nf_voce", "[felice] Un patto! Mi piace, ha una parola dentro che dura. A casa, però... non so dov'è la vostra. Ma un posto ve lo trovo, giuro: c'è sempre un posto, con il mare che si muove."]],
        ascolto: [["nf_voce", "[triste] Cosa mi serve? (Il fruscio si ferma per un attimo.) Nessuno me l'aveva più chiesto. Mi serve... un'estate. Una partita senza finire. Una squadra che torni. Non so dire meglio: sono un'isola, non un'oratrice."]],
        fermezza: [["nf_voce", "[triste] Tenervi? Io non vi tengo: siete voi che avete le gambe, e io solo il fondo. Ma va bene. Se è così che dite, giochiamo, e poi vediamo chi ha ragione. Ho il fiato lungo. Più lungo di voi."]],
      }[kind];
      K.scene([...l, ["nf_bora", "[sorpreso] (Dalla porta, ansimante: ha corso fin qui.) Voglio capire. Un'isola. L'isola. Che parla. E vuole una partita. (Si siede.) Fammi un rapporto dopo, ora ho bisogno di un caffè. Anche immaginario."], ["voce", `La luce del faro passa sulla stanza, una volta, due. Fuori il mare si muove, lento, come se qualcosa di enorme respirasse. <b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «Alta Marea».`]], () => K.openMain(), "nf_radio");
    }
    return {
      n: N, title: "La voce del faro", sub: "La laguna di giorno e di notte, il faro, la sfida dei Gabbiani, la sala radio", goal, start: "nf_spiaggia", introBg: "nf_laguna", zones, talk, obj,
      intro: () => [["voce", "<b>NAUFRAGHI DEL PALLONE</b>. Episodio 2. La luce del faro gira ogni notte, e a qualcuno stava a cuore farlo sapere."], ["voce", "Al campo, la Capitana ha scritto un elenco. Alla voce «Cose che non so», ha messo un quadratino per ogni riga."]],
    };
  }
  boot();
})();
