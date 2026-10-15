// js/cavallo-c2.js - IL CAVALLO STAR · Capitolo 2 «Il set»
// Gli studi di Lustrino: teatri di posa, la mensa, il campo di prova. Il regista Orazio Manovella, la scrittrice Viola Penna che
// vuole raccontare il vero Baldo, e Max Allegria, il cane più felice della televisione, con la sua sitcom rivale. La partita di
// beneficenza, e poi lo scandalo: Baldo, in diretta, dice una sciocchezza enorme.
(function () {
  "use strict";
  function boot() { const D = window.__cavallo; if (!D || !D.addChapter || !D._has || !D._has(1)) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    K.cast("cs_regista", { beard: "pizzetto", acc: ["occhiali", "berretto"], name: "Orazio Manovella, il regista", tag: "gray", hair: "#c8c8c8", style: "messy", skin: "#e0b890", eye: "#3a3a3a", bg: ["#fff4f8", "#3a2a3a"], shirt: "#3a2a3a" },
      "Il regista di «Zoccoli d'Oro», allora e adesso. Gira ogni scena dodici volte e poi sceglie la prima. Parla col megafono anche quando sei a un metro. Dice che il calcio e la televisione sono la stessa cosa: «Conta il finale».");
    K.cast("cs_viola", { acc: ["occhiali", "taccuino"], name: "Viola Penna, scrittrice", tag: "", hair: "#2a1a3a", style: "long", skin: "#c68642", eye: "#2a1a1a", bg: ["#fff4f8", "#a8d8a8"], shirt: "#a8d8a8" },
      "Scrittrice. La casa editrice le ha chiesto la biografia di Baldo: trecento pagine di trofei e sorrisi. Lei vuole scrivere quella vera. Fa domande lente e ascolta le risposte fino in fondo, cosa che a Lustrino non fa nessuno.");
    K.cast("cs_max", { shape: "cane", acc: ["fischietto"], name: "Max Allegria", tag: "", hair: "#d8a040", skin: "#f0c870", eye: "#3a2a1a", bg: ["#fff4f8", "#7ab8e8"], shirt: "#7ab8e8" },
      "Labrador dorato, protagonista di «Cuccioli in Campo», la sitcom sul calcio che ha preso il posto di «Zoccoli d'Oro». Felice sempre, di tutto, con tutti. Considera Baldo il suo migliore amico. Baldo lo considera il suo peggior nemico. Max non se n'è accorto.");
    K.cos("cs_c2", { kind: "acc", label: "Sciarpa da prima serata", val: "sciarpa", from: "Capitolo 2 di Il Cavallo Star" });
    const goal = (s) => ({
      0: "Gli studi di Lustrino. Il regista Orazio Manovella ti cerca col megafono.",
      1: "Viola Penna, la scrittrice, ti aspetta alla mensa degli studi.",
      2: "La partita di beneficenza contro Cuccioli in Campo: Max Allegria è al campo di prova.",
      3: "Lucilla corre verso di te con quattro telefoni che squillano. È successo qualcosa.",
    }[s] || "Il secondo capitolo è concluso. Puoi continuare con il Capitolo 3.");
    const zones = {
      cs_studios: {
        region: "studio", name: "Il Cavallo Star · Gli studi di Lustrino", short: "Gli studi", sub: "I teatri di posa, la mensa, il campo di prova", bg: "cs_studios", time: "giorno", travel: [17, 20],
        w: 34, h: 22, start: [17, 20], items: [[1, 20], [32, 11], [20, 20]], itemCos: "cs_vhs",
        areas: [[12, 12, 24, 18, "Il campo di prova"], [0, 0, 33, 21, "Gli studi di Lustrino"]],
        flavor: { t: "Un albero di plastica, ma molto convincente. Ha vinto un premio come «miglior albero non protagonista».", l: "Un lampione di scena: è alto la metà di un lampione vero, per sembrare grande in televisione." },
        intro: [["voce", "Gli studi di Lustrino: capannoni bianchi con numeri enormi, carrelli di costumi che passano, una giraffa vera che fa la comparsa e chiede il cachet in foglie."], ["voce", "Sopra il Teatro 1 c'è un cartello nuovo: «ZOCCOLI D'ORO · IL RITORNO». Sopra il Teatro 2, più grande, uno vecchio: «CUCCIOLI IN CAMPO · STAGIONE 22»."]],
        npcs: (s) => [{ id: "cs_regista", at: [17, 10] }, { id: "cs_baldo", at: [5, 10] }, { id: "cs_ugo", at: [8, 18] }, { id: "cs_max", at: [22, 15] }, ...(s === 3 ? [{ id: "cs_lucilla", at: [19, 19] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 0, 0, 21, "a"); lay(33, 0, 33, 21, "a"); lay(0, 21, 33, 21, "a");
          lay(1, 19, 32, 20, ":"); lay(17, 7, 17, 20, ":"); lay(1, 8, 32, 9, ":"); lay(12, 12, 24, 18, "-");
          house(2, 2, 8, 5, { door: [6, 6], roof: "#f0b8c8", wall: "#f4f0f8", rr: 2, enter: "Il Teatro 1: il salotto di «Zoccoli d'Oro» ricostruito com'era nel 1994. Il divano, il quadro storto, la porta che non si apre mai. Baldo ci entra in punta di zoccoli, come in chiesa." });
          house(12, 2, 8, 5, { door: [16, 6], roof: "#7ab8e8", wall: "#f4f0f8", rr: 2, enter: "Il Teatro 2: lo spogliatoio di «Cuccioli in Campo». Tutto è morbido, colorato, a prova di morso. Alle pareti, ventidue stagioni di foto di Max Allegria che sorride." });
          house(24, 2, 8, 5, { door: [28, 6], roof: "#a8d8a8", wall: "#fff8e8", rr: 2, enter: { to: "cs_mensa", at: [7, 9] } });
          house(2, 13, 5, 3, { door: [4, 15], roof: "#ffe08a", wall: "#f4e8f8", rr: 1, enter: "La roulotte di Baldo: uno specchio con le lampadine, una spazzola per criniera, una foto di lui puledro su un campetto di terra. Quella non la mostra a nessuno." });
          [[10, 10], [24, 10]].forEach(([x, y]) => put(x, y, "K")); [[11, 12], [25, 12]].forEach(([x, y]) => put(x, y, "F")); lay(28, 14, 30, 14, "A");
          [[31, 17], [9, 13]].forEach(([x, y]) => put(x, y, "t")); [[14, 10], [27, 18]].forEach(([x, y]) => put(x, y, "l")); put(1, 11, "P"); put(32, 15, "P"); put(9, 19, "s");
        },
      },
      cs_mensa: {
        interior: true, region: "interno", name: "Il Cavallo Star · La mensa degli studi", short: "La mensa", sub: "Vassoi, comparse, una scrittrice", bg: "cs_studios", w: 16, h: 12, start: [7, 9], outside: ["cs_studios", 28, 7],
        act: { T: "Guarda i tavoli", L: "Guarda il bancone", v: "Esci" },
        flavor: { T: ["Un tavolo di comparse vestite da vigili, che mangiano in silenzio. Sono pagate per non parlare. Anche a pranzo.", "Un tavolo con una giraffa che mangia insalata da un secchio. Ti saluta con educazione."], L: "Il bancone: il menu del giorno è «Pasta del protagonista» (abbondante) e «Pasta della comparsa» (uguale, ma con meno parmigiano)." },
        intro: [["voce", "La mensa: vassoi, chiacchiere, un megafono abbandonato su un tavolo. In fondo, da sola, una donna con un taccuino scrive senza alzare la testa."]],
        npcs: () => [{ id: "cs_viola", at: [7, 4] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(1, 1, 14, 1, "L"); lay(2, 6, 5, 6, "T"); lay(10, 6, 13, 6, "T"); },
      },
    };
    function beneficenza() {
      K.ciakMatch({ title: "Ciak! Si Gioca · La partita di beneficenza", minutes: 60, takes: 2, opp: { name: "Cuccioli in Campo", color: "#7ab8e8", players: [{ name: "Max Allegria" }, { name: "Briciola" }] },
        script: [{ k: "pari", t: "Max Allegria abbraccia tutti, anche l'arbitro. Il pubblico applaude l'abbraccio." }, { k: "loro", t: "Max corre felice, inciampa, il pallone entra lo stesso. Gol loro." }, { k: "noi", t: "Baldo fa la sua finta del 1995: l'avversario si siede. Tu segni." }, { k: "pari", t: "Un contrasto drammatico a centrocampo. Baldo cade al rallentatore." }, { k: "loro", t: "Contropiede dei Cuccioli: gol, e Max fa il giro del campo. Due volte." }, { k: "noi", t: "Ultima scena: Baldo ti lancia, tu segni di testa. Fine." }],
        intro: "<p>La partita di beneficenza contro <b>Cuccioli in Campo</b>, davanti a tutta Lustrino. Il copione la fa finire in <b>pareggio</b>, per non offendere nessuno. Ma tu vuoi vincere? Allora devi <b>improvvisare</b> almeno una volta.</p>", winTitle: "ZOCCOLI BATTE CUCCIOLI!" }, (r) => {
        if (!r.win) return K.stampa("beneficenza_no", { fama: 1 }, () => K.scene([["cs_max", "[felice] Che bella partita! Rifacciamola! (Scodinzola.) Rifacciamola sempre!"]], () => K.enterZone("cs_studios"), "cs_studios"));
        setStep(N, 3); bond("baldo", 2);
        K.stampa("beneficenza", { fama: 2 }, () => K.scene([["cs_baldo", "[felice] Abbiamo battuto Cuccioli in Campo! (Galoppa sul posto.) Ventidue stagioni! E noi in una partita! (Pausa.) Max, stai bene?"], ["cs_max", "[felice] Benissimo! Avete giocato benissimo! Ti voglio bene, Baldo! (Lo abbraccia. Baldo resta rigido come un attaccapanni. Poi, piano, ricambia.)"], ["voce", "Mentre tutti festeggiano, Lucilla arriva di corsa dal parcheggio. I suoi quattro telefoni squillano insieme."]], () => K.enterZone("cs_studios"), "cs_studios"));
      });
    }
    function comparse() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["cs_ugo", r && r.win ? "[felice] Vinto contro le comparse! Idea: un film dove le comparse vincono. Si chiama «Le Comparse». Dura tre ore e nessuno parla." : "[ride] Hanno vinto le comparse. Finalmente un po' di gloria anche per loro. Me lo segno: «film sulle comparse»."]], () => K.enterZone("cs_studios"), "cs_studios");
      ask("cs_ugo", "Le comparse vestite da vigili sfidano chiunque in pausa pranzo. Non parlano, ma giocano benissimo. Ci stai?", [
        { label: "A Ciak! Si Gioca", sub: "La partita della saga, a scene", cls: "hot", fn: () => K.ciakMatch({ title: "Ciak! Si Gioca · Contro le comparse", minutes: 30, takes: 2, mates: [{ name: "Ugo" }], opp: { name: "Le Comparse Vigili", color: "#5a6a9a", players: [{ name: "Vigile 1" }, { name: "Vigile 2" }] },
          script: [{ k: "pari", t: "Le comparse fischiano un fallo. Non sono arbitri: sono vigili. Fischiano lo stesso." }, { k: "noi", t: "Ugo tira da centrocampo, per scherzo. Entra." }, { k: "loro", t: "Le comparse segnano in silenzio. Non esultano: non sono pagate per esultare." }] }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "cs_comparse", alt: "az,cage,hd", force: false, oppTeam: "Le Comparse Vigili", oppColor: "#5a6a9a", us: "Zoccoli d'Oro", homeKit: ["#f0b8c8", "#ffe08a"], mate: "Ugo", squad: ["Ugo", "Baldo", "Lucilla"], chap: "Il Cavallo Star · Contro le comparse", bg: "cs_studios", oppNames: ["Vigile 1", "Vigile 2", "Vigile 3", "Vigile 4", "Il Vigile Capo"], intro: "Nel cortile degli studi, in pausa pranzo.", done: after }) },
        { label: "Dopo", fn: done },
      ], "cs_studios");
    }
    const talk = {
      cs_regista() {
        const s = S();
        if (s === 0) return K.scene([["cs_regista", "(Al megafono, da un metro.) BENVENUTA, SPALLA! Domani giriamo la prima puntata del reboot. Oggi c'è un problema: la casa editrice vuole la biografia di Baldo, la scrittrice è in mensa, e Baldo non vuole parlarle."], ["cs_regista", "[pensa] (Abbassa il megafono.) Lui non parla mai di sé. Parla solo del personaggio. Vai da lei. Magari a te dice cosa vuole sapere."]], () => { setStep(N, 1); quest("cs_viola", "La biografia di Baldo", "Viola Penna, in mensa."); done(); }, "cs_studios");
        return say([["cs_regista", "(Al megafono.) CONTA IL FINALE! (A nessuno in particolare.)"]]);
      },
      cs_viola() {
        if (S() === 1) return K.scene([["cs_viola", "[pensa] (Alza la testa dal taccuino, piano.) Sei la spalla. Siediti. (Aspetta.) La casa editrice vuole trecento pagine di trofei. Io vorrei sapere una cosa sola: perché un cavallo di cinquantadue anni vuole tornare in televisione a fare la stessa battuta di trent'anni fa?"], ["cs_viola", "Non me lo dirà, se glielo chiedo io. Forse a te sì. Lui oggi ha la partita di beneficenza contro Max Allegria. Dopo una partita, le persone dicono la verità. È l'unico momento."]], () => { setStep(N, 2); questDone("cs_viola"); quest("cs_beneficenza", "La partita di beneficenza", "Contro Cuccioli in Campo, al campo di prova. Max Allegria vi aspetta."); done(); }, "cs_mensa");
        return say([["cs_viola", S() >= 3 ? "[pensa] Hai sentito cos'è successo? Lucilla ti cerca. (Scrive qualcosa. Non te lo fa vedere.)" : "Scrivo una frase al giorno. Quella vera. Le altre si scrivono da sole."]]);
      },
      cs_baldo() { return say([["cs_baldo", S() >= 3 ? "[triste] (Non ti guarda.) Lucilla ti spiegherà. Io non ce la faccio." : S() === 2 ? "Max Allegria. (Lo dice come una parolaccia.) Ventidue stagioni. Ventidue! Io ne ho fatte cinque. Erano più belle. Vinciamo, spalla." : "[pensa] Una biografia? Di me? (Si guarda allo specchio della roulotte.) Scrivete il personaggio. Il personaggio è meglio di me."]]); },
      cs_max() {
        if (S() === 2) return ask("cs_max", "[felice] Ciao! Ciao! Sei la spalla di Baldo! Che bello! (Ti annusa la mano.) Profumi di provino. La partita di beneficenza! Per i canili di Lustrino! Giochiamo? Giochiamo!", [{ label: "Gioca la partita di beneficenza", sub: "Ciak! Si Gioca · partita importante", cls: "hot", fn: beneficenza }, { label: "Non ancora", fn: done }], "cs_studios");
        return say([["cs_max", "[felice] Baldo è il mio migliore amico! Lui dice di no, ma scherza sempre!"]]);
      },
      cs_ugo() { return comparse(); },
      cs_lucilla() {
        if (S() === 3) return ask("cs_lucilla", "(Con quattro telefoni.) Il talk show di stamattina. In diretta. Gli chiedono di «Zoccoli d'Oro» e lui dice: «Il calcio? L'ho inventato io». (Si siede per terra.) Il calcio. Inventato. Da un cavallo. Tutta Lustrino ride. Domani esce il giornale. Cosa diciamo?", [
          { label: "«Era una battuta, fa parte del copione»", sub: "Lo copri: la fama è salva", big: true, fn: () => fine2("copre") },
          { label: "«Diciamo la verità, con Viola»", sub: "Baldo chiede scusa, e racconta perché", big: true, fn: () => fine2("verita") },
        ], "cs_studios");
        return say([["cs_lucilla", "Quattro telefoni. Tutti per lui. Sempre per lui."]]);
      },
    };
    function fine2(kind) {
      F.set(kind === "copre" ? "cs_copre" : "cs_verita", true); bond("baldo", kind === "verita" ? 2 : 1);
      const msg = K.reward("c2:cs", { coins: 90, cos: ["cs_c2"] }); finishChapter(N, kind); setStep(N, 9);
      K.stampa(kind, kind === "verita" ? { verita: 4 } : { fama: 3 }, () => K.scene(kind === "verita" ? [["cs_baldo", "[triste] (Seduto in mensa davanti a Viola.) Ho detto che il calcio l'ho inventato io perché… (lunga pausa) perché da puledro giocavo su un campetto di terra, e mi sembrava di averlo inventato davvero. Ogni volta. Poi è diventato un lavoro."], ["cs_viola", "[felice] (Scrive. Una frase sola.) Questa è la prima pagina."], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La puntata in diretta».`]]
        : [["cs_baldo", "[furbo] (Legge il giornale e sorride, ma solo con la bocca.) «Era una battuta». Ottimo. Bravissima, spalla. (Pausa.) Bravissimi tutti. (Chiude la porta della roulotte. Non esce fino a sera.)"], ["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3: «La puntata in diretta».`]], () => K.openMain(), "cs_studios"));
    }
    return { n: N, title: "Il set", sub: "Gli studi, Viola Penna, Max Allegria, la partita di beneficenza, lo scandalo", goal, start: "cs_studios", introBg: "cs_studios", zones, talk,
      intro: () => [["voce", "<b>IL CAVALLO STAR</b>. Episodio 2. Il primo giorno sul set. Baldo arriva tre ore prima, si trucca da solo, ripete «Che zoccolata!» quaranta volte davanti allo specchio. Nessuno gliel'ha chiesto."]] };
  }
  boot();
})();
