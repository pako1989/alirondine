// js/naufraghi-c1.js - NAUFRAGHI DEL PALLONE · Capitolo 1 «Atterraggio d'emergenza»
// La spiaggia del relitto e la giungla. La Capitana Bora conta i presenti, il Dottor Salvi conta le scottature, Gaspare conta
// tutto il resto. Manca Tobia, il ragazzo dei video. Una radio che si sveglia di notte, e una luce lontana.
(function () {
  "use strict";
  function boot() { const D = window.__naufraghi; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("nf_bora", { acc: ["berretto"], name: "Capitana Vittoria Bora", tag: "", hair: "#2a2a3a", style: "ordinato", skin: "#c68a5e", eye: "#3a2a1a", bg: ["#0c4a6e", "#38bdf8"], shirt: "#1e3a5f" },
      "Comandante del volo dei Rondine, quarantun anni e un solo difetto: non ammette di avere paura. Parla piano, decide in fretta, e ha una pagina di appunti per ogni imprevisto. Sull'imprevisto «isola» ne ha scritte tre.");
    K.cast("nf_salvi", { beard: "pizzetto", acc: ["occhiali", "borsa"], name: "Dottor Ettore Salvi", tag: "", hair: "#9a9a9a", style: "curly", skin: "#e8c4a0", eye: "#3a3a3a", bg: ["#134e4a", "#5eead4"], shirt: "#f8fafc" },
      "Il medico di bordo. Cura scottature, vesciche e strappi d'orgoglio, che è tutto quello che serve a una squadra in trasferta. Ha una borsa piena di cerotti, una passione segreta per le piante e l'abitudine di dare un nome latino a qualsiasi cosa gli punti contro.");
    K.cast("nf_gaspare", { beard: "baffi", acc: ["grembiule", "taccuino"], name: "Gaspare Pellegrini", tag: "", hair: "#3a2a1a", style: "buzz", skin: "#d9a679", eye: "#2a2a2a", bg: ["#78350f", "#fbbf24"], shirt: "#92400e" },
      "Il magazziniere di bordo e della squadra. Conta le maglie, i palloni, le noccioline. Se una cosa non è sull'inventario, per lui non esiste ancora. È felice quando qualcosa finisce nella lista, e molto più felice quando una cosa torna dov'era.");
    K.cast("nf_voce", { shape: "robot", acc: ["cuffie"], name: "La Voce", tag: "", hair: "#94a3a8", skin: "#2d5a68", eye: "#5eead4", bg: ["#0b3b45", "#2dd4bf"], shirt: "#1f3a44" },
      "Una voce che arriva dalla radio, di notte, con un fruscio dentro come il mare dentro una conchiglia. Parla piano, a volte in ritardo. Dice sempre la stessa cosa: «Giocate?».");
    K.cos("nf_c1", { kind: "shirt", label: "Maglia Rondine Airlines, sbiadita", val: "#38bdf8", from: "Capitolo 1 di Naufraghi del Pallone" });
    K.cos("nf_conchiglia", { kind: "acc", label: "Collana di conchiglie", val: "fiore", from: "Raccogli conchiglie sull'isola" });
    K.lore("l_marea", { t: "Marea", d: "Il campo è fatto di celle e il mare si prende un pezzo di campo ogni poco. Tocca un compagno per passargli la palla, trascina per tirare, tocca una cella vuota per alzare una pedana: un pezzo di terra asciutta per qualche secondo. Segna prima che sparisca la tua metà." });
    K.lore("l_isola", { t: "L'orologio dell'isola", d: "Qui giorno e notte si alternano in fretta, e la marea con loro. Con la bassa marea affiorano le secche, di notte si accendono le pietre luminose. Dal menu puoi passare il tempo." });
    const goal = (s) => ({
      0: "La spiaggia del relitto. La Capitana Bora ti aspetta vicino a ciò che resta dell'aereo.",
      1: "Il contrappello: parla con il Dottor Salvi e con Gaspare.",
      2: "Manca Tobia. Cerca nella giungla, a est della spiaggia.",
      3: "Torna alla spiaggia: la Capitana vuole un rapporto. Poi Gaspare ha un'idea per tirare su il morale.",
      4: "Fa buio. Dalla radio di bordo, vicino al relitto, si sente qualcosa.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const MARE_SP = [[6, 17, 10, 17, "k", "bassa"]];
    const zones = {
      nf_spiaggia: {
        region: "isola", name: "Naufraghi del Pallone · La spiaggia del relitto", short: "La spiaggia", sub: "Il relitto, le casse di bordo, il fuoco, il sentiero per la giungla", bg: "nf_spiaggia", time: (s, KK) => KK.fase(), travel: [16, 13],
        w: 34, h: 22, start: [16, 13], items: [[3, 17], [28, 8], [22, 19]],
        mare: MARE_SP,
        areas: [[8, 7, 19, 11, "Il relitto"], [0, 14, 10, 20, "La caletta"], [20, 11, 28, 16, "Il fuoco"], [0, 0, 33, 21, "La spiaggia"]],
        flavor: { n: "Un cartello di legno, appena scritto: «SENTIERO PER LA GIUNGLA. LE COSE MORDONO. COMPILARE MODULO». Sotto, qualcuno ha disegnato un teschio e poi, per educazione, una faccina." },
        doors: { "33,12": { to: "nf_giungla", at: [1, 12] } },
        intro: [["voce", "Una spiaggia bianca, un mare troppo azzurro, palme che sembrano disegnate. In mezzo alla sabbia c'è un pezzo di aereo piantato come una forchetta in una torta."], ["voce", "Alcuni compagni sistemano i bagagli lungo la riva. Il sole è alto e la sabbia scotta. Tutto, qui, sembra in vacanza tranne la situazione."]],
        npcs: (s) => [{ id: "nf_bora", at: [19, 12] }, { id: "nf_salvi", at: [24, 15] }, { id: "nf_gaspare", at: [13, 13] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 3, "w"); lay(0, 4, 33, 4, "m"); lay(0, 5, 0, 21, "a"); lay(33, 5, 33, 21, "a"); lay(0, 21, 33, 21, "a");
          lay(1, 14, 10, 20, "w"); lay(2, 16, 5, 19, ","); lay(1, 5, 1, 13, "t");
          lay(28, 12, 32, 12, ":"); put(33, 12, "J");
          lay(9, 8, 17, 9, "A"); put(8, 9, "A"); put(18, 8, "A"); put(18, 9, "A");
          [[7, 11], [19, 10], [20, 11], [11, 11], [22, 6], [15, 6]].forEach(([x, y]) => put(x, y, "z"));
          put(15, 11, "R");
          put(24, 13, "s"); put(22, 12, "l"); put(26, 12, "l"); put(23, 14, "b"); put(25, 14, "b");
          [[3, 6], [6, 5], [11, 6], [27, 5], [31, 6], [30, 9], [29, 17], [26, 19], [20, 18], [5, 12], [31, 15], [2, 11]].forEach(([x, y]) => put(x, y, "t"));
          put(31, 10, "n"); lay(29, 11, 29, 11, "f"); lay(29, 13, 29, 13, "f");
          K.mareLay(L, { mare: MARE_SP });
        },
      },
      nf_giungla: {
        region: "giungla", name: "Naufraghi del Pallone · La giungla", short: "La giungla", sub: "Un sentiero fra le felci, una statua, un cappellino", bg: "nf_giungla", time: (s, KK) => KK.fase(), travel: [2, 12],
        w: 30, h: 20, start: [2, 12], items: [[19, 16], [4, 6]],
        areas: [[9, 3, 23, 9, "La radura della statua"], [10, 13, 22, 18, "Lo stagno"], [0, 0, 29, 19, "La giungla"]],
        flavor: { n: "Un cartello: «RADURA». Sotto, a pennarello: «sì, ma quale?»." },
        doors: { "0,12": { to: "nf_spiaggia", at: [32, 12] }, "29,10": { to: "nf_laguna", at: [1, 11], locked: (KK) => (KK.mem().ch < 2 ? "Il sentiero continua verso est, nel buio della giungla. Meglio non andarci senza sapere dove. Prima serve un piano." : false) } },
        intro: [["voce", "La giungla comincia di colpo, come una porta. Felci alte come persone, liane, un odore di terra bagnata e di frutta troppo matura. Il sentiero c'è, ma sembra deciso a cambiare idea."], ["voce", "Da qualche parte, sopra le cime degli alberi, brilla qualcosa che non è il sole. Ma sparisce quando provi a guardarlo."]],
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 19, "t"); lay(1, 11, 3, 13, ","); lay(0, 12, 0, 12, "J"); lay(1, 12, 8, 12, ":"); lay(8, 5, 8, 12, ":"); lay(8, 5, 12, 5, ":");
          lay(9, 3, 23, 9, ","); lay(13, 5, 13, 5, ":"); lay(20, 10, 28, 10, ":"); put(29, 10, "J"); lay(21, 9, 21, 10, ":");
          lay(8, 13, 8, 15, ":"); lay(8, 16, 12, 16, ":"); lay(10, 13, 22, 18, ","); lay(13, 14, 18, 17, "w");
          put(15, 4, "S"); put(21, 7, "C"); put(10, 4, "n");
          [[11, 7], [17, 8], [22, 4], [10, 9], [12, 14], [21, 17], [5, 8], [4, 14], [3, 5], [26, 9]].forEach(([x, y]) => put(x, y, ",")); // piccole radure
          lay(3, 5, 5, 7, ","); lay(3, 14, 5, 16, ","); lay(8, 8, 8, 8, ":"); lay(4, 8, 7, 8, ",");
          [[24, 5], [20, 4], [11, 8], [18, 6]].forEach(([x, y]) => put(x, y, "t"));
        },
      },
    };
    const partitella = () => {
      const after = (r) => {
        F.set("nf_c1_partita", true); setStep(N, 4); K.setFase("tramonto"); bond("fiducia", r && r.win ? 3 : 1); K.learnLore("l_marea");
        K.scene([["nf_gaspare", r && r.win ? "[felice] Segnato a registro: partita, ore diciotto, risultato storico. Morale della truppa: da «scarso» a «accettabile». Ho aggiornato la colonna." : "[ride] Persa, ma registrata. La sconfitta è un dato, e i dati mi fanno stare tranquillo."], ["nf_bora", "[pensa] (Guarda il cielo cambiare colore.) Buio fra poco. Tutti vicino al fuoco, nessuno si allontana. E qualcuno spenga quella radio, che sento un fruscio."]], () => { quest("nf_radio", "La radio di bordo", "Vicino al relitto. Di notte."); K.enterZone("nf_spiaggia"); }, "nf_spiaggia");
      };
      ask("nf_gaspare", "(Con l'inventario sotto il braccio.) Ho un'idea per il morale. Una partitella sul bagnasciuga, con la bassa marea c'è tanta sabbia piatta. Rondine di qua, Rondine di là. Il campo lo traccia il mare, ma lo fa male: allaga quello che vuole.", [
        { label: "Giochiamo a Marea", sub: "La partita della saga: il campo si allaga durante la partita", cls: "hot", fn: () => K.mareaMatch({ title: "Marea · La partitella sul bagnasciuga", opp: { name: "Il Bar del Cocco", color: "#16a34a", style: "equilibrata", players: [{ name: "Cocco" }, { name: "Noce" }] }, mates: [{ name: "Bora" }, { name: "Gaspare" }], intro: "Sul bagnasciuga, mentre il sole cala. Il campo è una griglia di celle e il mare se le prende, piano." }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "nf_bagnasciuga", alt: "az,cage,hd", force: false, oppTeam: "Il Bar del Cocco", oppColor: "#16a34a", us: "I Rondine", homeKit: ["#1d4ed8", "#f8fafc"], mate: "Bora", squad: ["Bora", "Gaspare", "Salvi"], chap: "Naufraghi del Pallone · La partitella sul bagnasciuga", bg: "nf_spiaggia", oppNames: ["Cocco", "Noce", "Polpa", "Latte", "Fibra"], intro: "Sul bagnasciuga, con il sole che cala.", done: after }) },
        { label: "Dopo", fn: done },
      ], "nf_spiaggia");
    };
    function controllaGiro() { // dopo il contrappello: Salvi e Gaspare hanno parlato
      if (F.is("nf_c1_salvi") && F.is("nf_c1_gaspare") && S() === 1) { setStep(N, 2); questDone("nf_contrappello"); quest("nf_tobia", "Dov'è Tobia?", "Il ragazzo dei video è sparito. Le impronte vanno verso la giungla, a est."); }
    }
    const talk = {
      nf_bora() {
        const s = S();
        if (s === 0) return K.scene([
          ["nf_bora", "[pensa] (Alza lo sguardo dall'aereo. Dall'aereo non si alza più niente.) Vittoria Bora, comandante. Il pilota automatico ha avuto un'idea sua e io ho scelto il posto: sabbia, mare calmo, nessuna montagna. Ci siamo posati. Una specie di posati."],
          ["nf_bora", "Siamo vivi tutti. Ammaccati, spettinati, arrabbiati con il pilota automatico. È un buon inizio. Adesso facciamo il contrappello: chi c'è, cosa abbiamo, e cosa manca."],
          ["nf_bora", "[sorpreso] Manca Tobia. Lo stagista dei video della squadra: ventidue anni, una telecamera sempre in mano. Nessuno lo ha più visto da quando siamo scesi."],
          ["nf_bora", "Parla con il Dottor Salvi, vicino al fuoco, e con Gaspare, al relitto: ognuno ha la sua lista. Quando hai finito, torna da me."],
        ], () => { F.set("nf_c1_bora", true); setStep(N, 1); K.pagina("volo", () => { quest("nf_contrappello", "Il contrappello", "Parla con il Dottor Salvi e con Gaspare."); done(); }); }, "nf_spiaggia");
        if (s === 1) return say([["nf_bora", "Salvi è vicino al fuoco. Gaspare al relitto, con il registro. Poi riferisci. Con ordine: abbiamo ancora un po' di ordine, non sprechiamolo."]]);
        if (s === 2) return say([["nf_bora", "Tobia. Le impronte vanno nella giungla, a est. Prendi la strada del cartello che morde. Torna prima che faccia buio."]]);
        if (s === 3) return K.scene([
          ["nf_bora", "[pensa] Il cappellino. (Lo gira tra le dita.) È suo. Allora è andato nella giungla da solo. Be': è giovane, ha una telecamera, crede di essere in un documentario."],
          ["nf_bora", "Sta per fare buio e non rischiamo nessuno. Stanotte restiamo qui, domani lo cerchiamo insieme. Gaspare ha un'idea per il morale: una partitella. Io avrei detto di no. Ma noi tre abbiamo bisogno di fare una cosa normale."],
        ], () => { F.set("nf_c1_riferito", true); done(); }, "nf_spiaggia");
        if (s === 4) return say([["nf_bora", "Quella radio di bordo l'ho trovata per caso nella cassa sette. Di giorno sibila e basta. Di notte, giuro, sembra che respiri. Dai un'occhiata, ma se parla, spegnila."]]);
        return say([["nf_bora", "Domani ci muoviamo. Il faro, le scorte, Tobia. In quest'ordine. Vai a dormire."]]);
      },
      nf_salvi() {
        const s = S();
        if (s === 0) return say([["nf_salvi", "(Sta mettendo una crema su una spalla con l'espressione di chi litiga con il sole.) Sono il medico. Prima parla con la Capitana. È lei che comanda, e io ho solo cerotti."]]);
        if (F.is("nf_c1_salvi")) return say([["nf_salvi", s >= 3 ? "[pensa] Impronte, taglia 43. Il giovane Tobia non ha mai tenuto un passo normale: quando camminava, si filmava i piedi." : "Impronte, taglia 43. Io porto il 42. Niente di personale, ma dubito che sia stato un delitto."]]);
        return K.scene([
          ["nf_salvi", "[felice] Dottor Salvi, medico di bordo. Primo bilancio: nove scottature, quattro vesciche, un ginocchio sbucciato, un orgoglio ammaccato. Il mio: mi sono fatto male a un'unghia aprendo il baule dei cerotti."],
          ["nf_salvi", "(Sistema gli occhiali.) Posso dire una cosa che non c'entra? Queste palme. Fanno il cocco due volte l'anno, e questo è strano. Ne ho viste con le noci già aperte, ordinatamente, con una cannuccia di foglia. Qualcuno ci ha bevuto."],
          ["nf_salvi", "[pensa] Poi le impronte. Vengono dal relitto e vanno verso la giungla. Scarpe da ginnastica, misura 43. Si fermano, fanno mezzo giro, ripartono. Come uno che si fa un video."],
          ["nf_salvi", "Ho dato un nome latino a tutto, per stare tranquillo. Questo morso è un «Sedere Ammaccato Maximus». Va meglio, adesso."],
        ], () => { F.set("nf_c1_salvi", true); bond("fiducia", 2); K.pagina("impronte", () => { controllaGiro(); done(); }); }, "nf_spiaggia");
      },
      nf_gaspare() {
        const s = S();
        if (s === 0) return say([["nf_gaspare", "(Alza il registro come uno scudo.) Un momento, sto contando. Parla con la Capitana, poi torna: così ti metto in lista e non ti conto due volte."]]);
        if (F.is("nf_c1_gaspare")) {
          if (s === 3 && !F.is("nf_c1_partita")) return F.is("nf_c1_riferito") ? partitella() : say([["nf_gaspare", "La partitella? Bellissima idea. Ma prima il rapporto alla Capitana: lei comanda, io conto."]]);
          return say([["nf_gaspare", s >= 4 ? "[felice] Tutto a registro. Anche il fruscio della radio. L'ho messo alla voce «varie ed eventuali»." : "Registro aggiornato: tre casse, due borsoni, un cocco che pensava di essere un pallone. Sul pallone ho fatto una croce. Sul cocco no."]]);
        }
        return K.scene([
          ["nf_gaspare", "[felice] Gaspare Pellegrini, magazziniere. Inventario in corso. Duecentododici noccioline. Quaranta bottigliette d'acqua. Diciotto maglie di riserva. Tre palloni: due veri e un cocco che pensa di essere un pallone. Una radio di bordo: da ritrovare."],
          ["nf_gaspare", "(Gli tremano un po' le mani. Poi il registro le ferma.) Non mi interessa dove siamo. Mi interessa quanto abbiamo. Una cosa che si conta fa meno paura. Dimmi tu come dividiamo le scorte."],
        ], () => ask("nf_gaspare", "Come dividiamo acqua e noccioline?", [
          { label: "Parti uguali per tutti", sub: "Senza fare storie", big: true, fn: () => { bond("fiducia", 4); finGas("uguali"); } },
          { label: "Parti uguali, e tu tieni il registro", sub: "Gaspare si sente utile", big: true, fn: () => { bond("fiducia", 2); F.add("nf_gas", 2); finGas("registro"); } },
          { label: "Prima chi lavora di più", sub: "Efficiente, ma si litiga", big: true, fn: () => { bond("fiducia", -3); F.add("nf_gas", 1); finGas("lavoro"); } },
        ], "nf_spiaggia"), "nf_spiaggia");
      },
    };
    function finGas(kind) {
      F.set("nf_c1_gaspare", true); F.set("nf_razioni", kind);
      const r = { uguali: [["nf_gaspare", "[felice] Parti uguali. Semplice, giusto, senza storie. Mi metto a piangere, ma piano, con il registro davanti alla faccia."]], registro: [["nf_gaspare", "[sorpreso] Il registro. A me. (Lo stringe al petto.) Non ho mai avuto un incarico. Ho sempre avuto solo le chiavi. Farò tutto a regola d'arte. Anche le virgole."]], lavoro: [["nf_gaspare", "[pensa] Prima chi lavora. (Scrive.) Efficiente. Domani avrò mezza squadra arrabbiata con me e l'altra mezza con te. Lo metto a registro come «scontento ordinato»."]] }[kind];
      K.pagina("inventario", () => say(r, () => { controllaGiro(); done(); }));
    }
    const obj = {
      "nf_giungla:C": () => {
        if (S() === 2) { F.set("nf_cappellino", true); setStep(N, 3); K.pagina("impronte", () => say([["voce", "Un cappellino da baseball, giallo, con una scritta a pennarello sulla visiera: «TOBIA · STAGISTA · NON TOCCARE LA CAMERA». Lo prendi. È ancora caldo, come se lo avesse lasciato da poco."], ["voce", "Le impronte finiscono qui. Intorno al cappellino, la terra è smossa come se qualcuno fosse salito su qualcosa. O su qualcuno."]], () => { questDone("nf_tobia"); quest("nf_rapporto", "Il rapporto", "Torna alla spiaggia dalla Capitana."); done(); }));
        } else if (F.is("nf_cappellino")) say([["voce", "Il posto dove hai trovato il cappellino. La terra è ancora smossa."]]);
        else say([["voce", "Una cosa gialla tra le felci. Non è ancora il momento: prima serve sapere cosa cercare."]]);
      },
      "nf_giungla:S": () => say([["voce", "Una statua mezza coperta di muschio: un giocatore con un pallone sotto il braccio. Sul petto ha uno stemma consumato. Se strizzi gli occhi sembra una rondine. Naturalmente non può essere."]]),
      "nf_spiaggia:R": () => {
        const s = S();
        if (K.fase() !== "notte") return say([["voce", "La radio di bordo, su una cassa. Giri la manopola: fruscio, fruscio, fruscio. Il fruscio è molto bravo. Se sapesse parlare, dovrebbe farlo di notte."]]);
        if (s < 4) return say([["voce", "Fra il fruscio, per un attimo, senti una nota. Una voce, forse. Ma non è ancora il momento: la Capitana vuole prima fare il rapporto e riposare."]]);
        if (s > 4) return say([["voce", "La radio è spenta. Per essere una radio senza batterie, è stata molto convincente."]]);
        K.scene([
          ["voce", "Giri la manopola. Il fruscio si apre come una tenda, e dall'altra parte c'è qualcuno che respira, e poi parla, lento, come se fosse sott'acqua."],
          ["nf_voce", "...eccovi. (fruscio) Siete arrivati. (fruscio) Ciao. Ciao! Non pensavo che sarebbe cascato giù un aereo, ma sono contenta lo stesso."],
          ["nf_voce", "Sono molto, molto tempo che non gioca nessuno. Voi giocate, vero? Siete la squadra. Dalle maglie si vede."],
        ], () => ask("nf_voce", "(La voce aspetta. Il fruscio fa qualcosa che somiglia a un sorriso.) Ditemi che giocate. Vi mostro tutto. Basta che seguiate la luce.", [
          { label: "«Chi sei? Dove siamo?»", sub: "Rispondi alla Voce", big: true, fn: () => fineC1("audace") },
          { label: "Spegni la radio", sub: "Non si risponde a voci misteriose", big: true, fn: () => fineC1("cauto") },
        ], "nf_spiaggia"), "nf_spiaggia");
      },
    };
    function fineC1(kind) {
      F.set(kind === "audace" ? "nf_audace" : "nf_cauto", true); questDone("nf_radio");
      const msg = K.reward("c1:nf", { coins: 70, cos: ["nf_c1"] }); finishChapter(N, kind); setStep(N, 5); K.learnLore("l_isola"); K.pagina("radio", () => {
        if (kind === "audace") bond("voce", 8); else bond("fiducia", 4);
        const l = kind === "audace"
          ? [["nf_voce", "[felice] Sono la voce del faro. Il resto, domani. Seguite le pietre che si accendono nell'acqua: portano alla luce. Ah. Portate un pallone. Ve lo dico perché poi vi dimenticate sempre."], ["nf_bora", "[sorpreso] (Era dietro di te, da un po'.) Hai parlato con una radio che non ha batterie. Per questo non ti ho detto di non farlo: l'avevo già pensato. Domani si va a vedere. Con prudenza. Con molta prudenza."]]
          : [["nf_voce", "[triste] ...ah. Ho capito. Va bene. Aspetterò. Sono molto brava ad aspettare. (fruscio) Buonanotte."], ["nf_bora", "[felice] (Era dietro di te.) Hai fatto bene. Le voci misteriose si ascoltano di giorno, con un caffè e due testimoni. Domani si va a vedere, comunque. Ma con ordine."]];
        K.scene([...l, ["voce", `Sul mare, lontano, una luce a intervalli regolari: giri di fari. <b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «La voce del faro».`]], () => K.openMain(), "nf_spiaggia");
      });
    }
    return {
      n: N, title: "Atterraggio d'emergenza", sub: "La spiaggia del relitto, il contrappello, la giungla, la radio di notte", goal, start: "nf_spiaggia", introBg: "nf_titolo", zones, talk, obj,
      intro: () => [["voce", "<b>NAUFRAGHI DEL PALLONE</b>. Episodio 1. Il volo di ritorno dei Rondine doveva durare sei ore e un panino. È durato sei ore, un panino e un'isola."], ["voce", "Il pilota automatico ha avuto un'idea. Nessuno sa quale."]],
    };
  }
  boot();
})();
