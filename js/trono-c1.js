// js/trono-c1.js - IL TRONO DI CUOIO · Capitolo 1 «Il figlio senza nome»
// Rocca Tasso, nelle colline di Tanagrigia. Lord Ubaldo Tasso, vecchio e testardo, fa chiamare il figlio che non ha mai
// riconosciuto: Casa Pietrabruna chiede il passo della Gola, e lo vuole giocare al Concilio. Brunilde, l'erede legittima,
// non si fida di te. Il maestro d'armi Gualtiero sì, ma lui si fida anche dei cavalli.
(function () {
  "use strict";
  function boot() { const D = window.__trono; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N), C = K.CASATE;

    K.cast("tc_ubaldo", { acc: ["corona", "barba"], name: "Lord Ubaldo Tasso", tag: "gray", hair: "#c8c8c8", style: "messy", skin: "#e0b48a", eye: "#3a3a2a", bg: ["#2a1a0c", "#6a5a3a"], shirt: "#6a5a3a" },
      "Signore di Rocca Tasso e delle colline di Tanagrigia. Ha vinto due Tornei del Trono da giovane, e da allora non ha più cambiato idea su niente. Non ti ha mai riconosciuto come figlio. Non ti ha mai nemmeno mandato via.");
    K.cast("tc_brunilde", { acc: ["fascia"], name: "Brunilde Tasso", tag: "", hair: "#5a3a1a", style: "braids", skin: "#f0d0b0", eye: "#3a5a3a", bg: ["#2a1a0c", "#c8a050"], shirt: "#6a5a3a" },
      "Figlia legittima di Lord Ubaldo, erede di Casa Tasso, capitana della squadra della rocca. Gioca da centrale e parla allo stesso modo: chiude tutte le strade. Tu sei il fratello che non ha scelto, e non ha ancora deciso cosa farne.");
    K.cast("tc_gualtiero", { acc: ["barba"], name: "Ser Gualtiero, maestro d'armi", tag: "", hair: "#8a8a8a", style: "short", skin: "#c68642", eye: "#2a2a2a", bg: ["#2a1a0c", "#8a8a8a"], shirt: "#5a5a5a" },
      "Il maestro d'armi di Rocca Tasso: insegna la spada, il cavallo e il calcio, nell'ordine. Ti ha cresciuto lui, nel cortile, tra un allenamento e l'altro. Sostiene che il pallone è la spada di chi ha buon cuore.");
    K.cast("tc_ardo", { acc: ["mantello"], name: "Lord Ardo Pietrabruna", tag: "", hair: "#3a3a3a", style: "ordinato", skin: "#d9a679", eye: "#3a3a3a", bg: ["#2a1a0c", "#c8b898"], shirt: "#5a4a3a" },
      "Signore delle montagne di Pietrabruna. Parla poco, e quando dà la sua parola la incide su una pietra, letteralmente: ne ha un cortile pieno. Non ha mai rotto un patto. Pretende lo stesso dagli altri.");
    K.cos("tc_c1", { kind: "shirt", label: "Maglia di Casa Tasso", val: "#6a5a3a", from: "Capitolo 1 del Trono di Cuoio" });
    K.cos("tc_sigilli1", { kind: "acc", label: "Sigillo di cera al collo", val: "medaglia", from: "Trova tutti i sigilli di cera di Rocca Tasso" });
    K.lore("l_trono", { t: "Il Trono di Cuoio", d: "Cucito con il cuoio del primo pallone della storia. Ogni sette anni, il Torneo del Trono decide quale casata ci siede: le altre sei giocano secondo le sue regole." });
    K.lore("l_concilio", { t: "Il Concilio", d: "A Valdoro le partite importanti si giocano in due tempi: al tavolo, dove si firmano i patti con la cera, e al campo, dove si scopre chi li rispetta." });
    const goal = (s) => ({
      0: "Lord Ubaldo ti ha fatto chiamare nella Sala Grande: la porta del mastio, in alto al centro.",
      1: "Brunilde, tua sorella, si allena nel cortile a sinistra.",
      2: "Lord Ardo Pietrabruna aspetta alla porta della rocca, in basso.",
      3: "Hai giocato il Concilio. Torna da Lord Ubaldo, nella Sala Grande.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      tc_rocca: {
        region: "rocca", name: "Il Trono di Cuoio · Rocca Tasso", short: "Rocca Tasso", sub: "Il cortile della rocca, nelle colline di Tanagrigia", bg: "tc_rocca", time: "giorno", travel: [15, 18],
        w: 30, h: 22, start: [15, 18], itemCos: "tc_sigilli1", items: [[2, 2], [27, 3], [26, 19]], banners: "tasso",
        areas: [[20, 11, 27, 17, "Il campo d'allenamento"], [0, 0, 29, 21, "Rocca Tasso"]],
        flavor: { t: "Un vecchio castagno. Sulla corteccia, incise, le iniziali di tutti i bambini della rocca. Le tue sono le più piccole, in basso, quasi nascoste." },
        intro: [["voce", "Rocca Tasso, nelle colline di Tanagrigia. Mura grigie, stendardi marroni con il tasso, e un cortile dove da trecento anni si gioca a calcio con le stesse regole: chi perde pulisce le stalle."], ["voce", "Stamattina, però, nessuno gioca. Sulla porta c'è un cavallo con i colori di Pietrabruna. E Lord Ubaldo ha fatto chiamare te. Proprio te."]],
        npcs: (s) => [{ id: "tc_brunilde", at: [7, 13] }, { id: "tc_gualtiero", at: [24, 13] }, ...(s >= 2 && s <= 3 ? [{ id: "tc_ardo", at: [17, 19] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 21, 29, 21, "a"); lay(0, 0, 0, 21, "a"); lay(29, 0, 29, 21, "a");
          lay(12, 9, 18, 16, "+"); lay(15, 8, 15, 20, ":"); lay(5, 12, 11, 12, ":"); lay(19, 12, 21, 12, ":"); lay(21, 11, 27, 17, ":");
          house(11, 2, 8, 6, { door: [15, 7], roof: "#4a3a2a", wall: "#8a8478", rr: 3, enter: { to: "tc_sala", at: [10, 10] } });
          house(3, 3, 5, 4, { door: [5, 6], roof: "#6a4a2a", wall: "#9a8a6a", rr: 2, enter: "Le stalle. Sette cavalli, uno per ogni giorno della settimana. Quello della domenica ti riconosce e sbuffa: è il tuo, anche se non è mai stato scritto da nessuna parte." });
          house(22, 3, 5, 4, { door: [24, 6], roof: "#5a3a2a", wall: "#9a8a6a", rr: 2, enter: "La cucina della rocca. La cuoca ti allunga una pagnotta senza dire niente, come ogni mattina da quando avevi sei anni. «Oggi mangia due volte», dice. «Oggi ti serve.»" });
          [[11, 9], [19, 9], [11, 16], [19, 16]].forEach(([x, y]) => put(x, y, "Q"));
          [[3, 17], [6, 19], [26, 9], [2, 9], [9, 2], [20, 2]].forEach(([x, y]) => put(x, y, "t")); put(4, 15, "s");
        },
      },
      tc_sala: {
        interior: true, region: "casa", name: "Il Trono di Cuoio · La Sala Grande", short: "La Sala Grande", sub: "Il mastio di Rocca Tasso", bg: "tc_sala", w: 20, h: 13, start: [10, 10], outside: ["tc_rocca", 15, 8], banners: "tasso",
        act: { T: "Guarda la tavola", H: "Guarda il camino", L: "Guarda gli scaffali", v: "Esci" },
        flavor: { T: "La tavola lunga di Casa Tasso: trenta posti. Il tuo, da sempre, è l'ultimo, vicino alla porta. Oggi qualcuno ha spostato la sedia più avanti. Di un posto solo.", H: "Il camino del mastio. Sopra, appeso, il primo pallone di Casa Tasso: cuoio, cuciture a mano, e un rammendo fatto da Lord Ubaldo da ragazzo.", L: "Le cronache di Casa Tasso: trecento anni di partite, patti e matrimoni. Il tuo nome non c'è. Nella pagina dell'anno in cui sei nato, però, c'è una riga cancellata." },
        intro: [["voce", "La Sala Grande: travi annerite, stendardi alle pareti, una tavola lunga e un camino dove si potrebbe arrostire un bue. In fondo, sulla sedia alta, Lord Ubaldo Tasso. Ti guarda come si guarda il tempo prima di una partita."]],
        npcs: () => [{ id: "tc_ubaldo", at: [10, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 19, 12, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a"); lay(0, 12, 19, 12, "a"); put(10, 12, "v"); lay(5, 7, 14, 7, "T"); put(16, 1, "H"); lay(2, 1, 4, 1, "L"); [[7, 2], [13, 2]].forEach(([x, y]) => put(x, y, "Q")); put(2, 10, "s"); },
      },
    };
    function training() { // la partita secondaria: un allenamento nel cortile, la modalità la scegli tu
      K.playMatch({ id: "tc_cortile", alt: "az,cage,hd", force: false, oppTeam: "I garzoni della rocca", oppColor: "#8a7a5a", mate: "Ser Gualtiero", us: "Rocca Tasso", homeKit: [C.tasso.c, C.tasso.c2], chap: "Il Trono di Cuoio · L'allenamento nel cortile", bg: "tc_rocca", oppNames: ["Stalliere", "Garzone", "Fabbro", "Cuoco", "Sguattero"], intro: "Nel cortile di Rocca Tasso, come quando eri piccolo: tu e Ser Gualtiero contro i garzoni. Chi perde pulisce le stalle.",
        done: (r) => { if (r.win) bond("onore", 1); K.scene([["tc_gualtiero", r.win ? "[ride] Ecco. Così. Al Concilio non si vince solo coi patti: prima o poi bisogna anche tirare in porta." : "[pensa] Le stalle ti aspettano, ragazzo. Ma hai giocato con la testa alta. Al tavolo del Concilio, è quella che guardano."]], () => K.enterZone("tc_rocca"), "tc_rocca"); } });
    }
    function match() {
      K.concilio({ title: "Il Concilio · Casa Tasso contro Casa Pietrabruna", us: "Casa Tasso", opp: { name: "Casa Pietrabruna", color: C.pietrabruna.c, sigil: C.pietrabruna.s, honor: 0.85 }, oppStyle: "difensiva",
        cards: ["centro", "sinistra", "destra", "tregua"], ravens: F.is("tc_corvo") ? 1 : 0, turns: 8, winTitle: "IL PASSO DELLA GOLA RESTA AI TASSO",
        intro: "<p>Lord Ardo vuole il passo della Gola. Se vince Pietrabruna, la strada delle colline sarà sua per sette anni. Si gioca al Concilio: prima il tavolo, poi il campo.</p>" }, (r) => {
        if (!r.win) return K.scene([["tc_ardo", "[pensa] Non stavolta, Tasso. (Ti guarda a lungo.) Rigiochiamo all'alba, se vuoi. Pietrabruna non ha fretta: le montagne aspettano."]], () => K.enterZone("tc_rocca"), "tc_rocca");
        setStep(N, 3); K.learnLore("l_concilio"); if (!r.data.tradimenti) F.set("tc_pietra_amica", true);
        K.scene([["voce", "Fischio finale. Il passo della Gola resta a Casa Tasso. Nel cortile, i garzoni battono i mestoli sui secchi."], ["tc_ardo", r.data.tradimenti ? "[arrabbiato] Hai vinto. Rompendo un patto. (Prende una pietra dal cortile, ci incide un segno, la getta nel pozzo.) Pietrabruna non dimentica. Ricordatelo, il giorno del Consiglio." : "[felice] Hai vinto e non hai tradito. (Prende una pietra, ci incide il tuo nome, te la mette in mano.) Questa è la parola di Pietrabruna: quando avrai bisogno di un voto, avrai il nostro."]], () => K.enterZone("tc_rocca"), "tc_rocca");
      });
    }
    const talk = {
      tc_ubaldo() {
        const s = S();
        if (s === 0) return say([["tc_ubaldo", "[pensa] Siediti. No, non lì. (Indica la sedia accanto alla sua.) Lì."], ["tc_ubaldo", "Lord Ardo Pietrabruna vuole il passo della Gola. Lo vuole giocare al Concilio, come si fa a Valdoro: patti al tavolo, poi la partita. E non vuole giocarlo con Brunilde. Vuole giocarlo con te."], ["tc_ubaldo", "[furbo] Dice che un figlio senza nome non ha niente da perdere, e quindi non mente. È un uomo di pietra, Ardo: crede che le persone siano come le montagne. Va', parla con tua sorella. Poi vai alla porta."]], () => { setStep(N, 1); if (F.get("tc_cred") === undefined) K.setCred(5); K.learnLore("l_trono"); quest("tc_gola", "Il passo della Gola", "Brunilde nel cortile, poi Lord Ardo alla porta della rocca."); done(); });
        if (s === 3) return ask("tc_ubaldo", "(Si alza. Non lo fa mai, per nessuno.) Il passo è nostro. Fra un mese, ad Altavalle, si apre il Consiglio delle Casate per il Torneo del Trono. Casa Tasso ci andrà.\n\nChi porterà il nostro stendardo?", [
          { label: "«Lo porterò io. Con il nostro nome»", sub: "Chiedi di essere riconosciuto", big: true, fn: () => fine1("nome") },
          { label: "«Lo porti Brunilde. Io le copro le spalle»", sub: "Lascia il posto all'erede", big: true, fn: () => fine1("spalle") },
        ], "tc_sala");
        return say([["tc_ubaldo", s >= 4 ? "[pensa] Altavalle è piena di corvi. Parla poco, ascolta molto, e non firmare niente prima di cena." : "Pietrabruna aspetta. Le montagne sono pazienti, ma Ardo no."]]);
      },
      tc_brunilde() {
        if (S() === 1) return ask("tc_brunilde", "(Tira un pallone contro il muro, lo riprende, lo ritira.) Così nostro padre manda te. Al tavolo del Concilio. Con il nostro nome. Che non è il tuo.\n\n(Il pallone si ferma.) Va bene. Ma se perdi il passo della Gola, lo perdo io. Cosa vuoi da me?", [
          { label: "«Insegnami il Concilio, sorella»", sub: "Lei ti presta il suo corvo", big: true, fn: () => sister(true) },
          { label: "«Niente. Il nome me lo guadagno da solo»", sub: "Credibilità +1", big: true, fn: () => sister(false) },
        ], "tc_rocca");
        return say([["tc_brunilde", S() >= 3 ? "[sorpreso] Hai tenuto il passo. (Ti lancia il pallone.) …Non male, fratello. Non dirlo a nessuno che te l'ho detto." : "Lord Ardo è alla porta. Non farlo aspettare: per lui l'attesa è un'offesa scolpita."]]);
      },
      tc_gualtiero() {
        return ask("tc_gualtiero", "Ragazzo. (Ti sistema il colletto come quando avevi sei anni.) Il Concilio è una partita per gente che parla. Io sono un uomo che corre. Vuoi fare due tiri nel cortile, prima? Come ai vecchi tempi.", [
          { label: "Allenamento nel cortile", sub: "Partita secondaria · scegli tu la modalità", big: true, fn: training },
          { label: "«Com'è il Concilio, maestro?»", fn: () => say([["tc_gualtiero", "[pensa] Al tavolo firmi i patti: «nessuno attacca al centro», «tregua al terzo turno». Se ti credono, accettano. Poi, al campo, i patti dicono dove l'altro non andrà. Finché lo rispetta."], ["tc_gualtiero", "[furbo] Pietrabruna non tradisce quasi mai. Ma «quasi» è la parola più importante di Valdoro."]]) },
          { label: "Non ora", fn: done },
        ], "tc_rocca");
      },
      tc_ardo() {
        if (S() === 2) return ask("tc_ardo", "(Un uomo alto come una porta, con un mantello di lana grezza.) Il figlio senza nome. Bene. (Batte il pugno sul petto.) Pietrabruna chiede il passo della Gola. Lo giochiamo al Concilio. Al tavolo ti dirò sì o no, e il mio sì è una pietra.\n\nSiediti.", [{ label: "Siedi al tavolo del Concilio", sub: "Il Concilio · la partita dei patti", cls: "hot", fn: match }, { label: "Non ancora", fn: done }], "tc_rocca");
        return say([["tc_ardo", F.is("tc_pietra_amica") ? "La mia parola è tua. Le pietre non cambiano idea." : "Ci rivedremo ad Altavalle."]]);
      },
    };
    function sister(teach) {
      if (teach) { F.set("tc_corvo", true); bond("onore", 1); } else K.setCred(K.cred() + 1);
      K.scene(teach ? [["tc_brunilde", "[sorpreso] …Me lo chiedi? (Fischia. Un corvo scende dalla torre e le si posa sul braccio.) Si chiama Inchiostro. Al tavolo, mandalo a sentire cosa pensano davvero: ti dirà se il loro onore è saldo o marcio."], ["tc_brunilde", "Riportamelo. E riporta anche il passo della Gola."]]
        : [["tc_brunilde", "[furbo] Da solo. (Mezzo sorriso.) È la cosa più da Tasso che tu abbia mai detto. Va', Lord Ardo ti aspetta. E bada: a Valdoro, chi va da solo al tavolo torna con meno amici, ma con più rispetto."]], () => { setStep(N, 2); done(); }, "tc_rocca");
    }
    function fine1(kind) {
      if (kind === "nome") { F.set("tc_riconosciuto", true); K.setCred(K.cred() + 1); } else { F.set("tc_brunilde_alleata", true); bond("onore", 2); }
      const msg = K.reward("c1:tc", { coins: 60, cos: ["tc_c1"] }); finishChapter(N, kind); setStep(N, 5); questDone("tc_gola");
      K.scene(kind === "nome" ? [["tc_ubaldo", "[pensa] (Prende la penna d'oca. Apre le cronache alla pagina della riga cancellata. Scrive.) Ecco. Di Casa Tasso. Era ora, forse. (Non ti guarda.) Non farmene pentire."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Altavalle».`]]
        : [["tc_brunilde", "[felice] (Ti mette una mano sulla spalla, davanti a tutta la sala.) Allora andiamo insieme. Io porto lo stendardo. Tu porti il resto: le parole, i patti, i corvi. Siamo una casata, no?"], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Altavalle».`]], () => K.openMain(), "tc_sala");
    }
    return { n: N, title: "Il figlio senza nome", sub: "Rocca Tasso, Lord Ardo, il primo Concilio", goal, start: "tc_rocca", introBg: "tc_titolo", zones, talk,
      intro: () => [["voce", "<b>IL TRONO DI CUOIO.</b> Il continente di Valdoro: sette casate, sette squadre, un trono cucito con il primo pallone della storia. Ogni sette anni si gioca per sederci sopra. Mancano due mesi."], ["voce", "Tu sei cresciuto a Rocca Tasso, nel cortile, tra i cavalli e i palloni. Tutti sanno chi è tuo padre. Lui, finora, ha fatto finta di no."]] };
  }
  boot();
})();
