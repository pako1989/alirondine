// js/tempo-c2.js - RONDINE 1938-2038 · Capitolo 2 «Il gol che non c'è»
// 1978: la finale della Coppa delle Rondini. Il Bar da Ines, il flipper, il gol di Rino che la storia non ricorda.
// Dietro il gol sparito c'è una macchina con un occhio solo, e una persona che la conosce da molto prima di te.
(function () {
  "use strict";
  function boot() { const D = window.__tempo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter2); }
  function chapter2(K) {
    const { F, say, ask, done, go, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);
    const houseCol = () => { const e = K.ZX.eraName; return e === "1938" ? { roof: "#5a4a3a", wall: "#9a9486" } : e === "1978" ? { roof: "#a8522a", wall: "#e8c89a" } : { roof: "#2a1a6a", wall: "#3a3a8a" }; };

    K.cast("rt_quarzo78", { acc: ["occhiali"], name: "Ottavio Quarzo (1978)", tag: "", hair: "#1a1410", style: "messy", skin: "#e8c4a0", eye: "#4a6a8a", bg: ["#3a2a18", "#e8a030"], shirt: "#8a6a3a" },
      "Quarant'anni nel 1978, l'orologiaio più giovane del Club. Un treppiede, una cinepresa e una macchina con un occhio solo. Cammina come chi porta qualcosa che non vorrebbe aver costruito.");
    K.cos("rt_c2", { kind: "shirt", label: "Maglia della Coppa '78", val: "#e8a030", from: "Completa il Capitolo 2 di Rondine 1938-2038" });
    K.cos("rt_gettone", { kind: "acc", label: "Gettone del flipper", val: "occhiali", from: "Il flipper del Bar da Ines" });
    K.lore("l_ines78", { t: "Ines, quarant'anni", d: "Nel 1978 Ines gestisce il bar che era dei suoi. Ha una cicatrice sul gomito, una voce da bancone e una fotografia di una neonata in carrozzina in un cassetto che non apre mai. Dice che il flipper le porta consiglio." });
    K.lore("l_finale78", { t: "La finale del '78", d: "Rondinara contro il Real Gambero, minuto 89. Rino colpisce di testa e la palla entra. Poi una macchina con un occhio solo dice «no», e l'arbitro le crede. Il Club perde ai rigori e per quarant'anni nessuno ricorda più il gol." });
    K.lore("l_occhio", { t: "L'Occhio di Quarzo", d: "Una cinepresa con una calcolatrice dentro: la prima macchina che rivede i gol. Funzionava benissimo, tranne quella volta. Il VAR Totale è il suo nipote: ha ereditato l'occhio e l'abitudine a non fidarsi di nessuno." });
    K.lore("l_gettone", { t: "Il gettone del flipper", d: "Un gettone di ottone con una rondine incisa. Il flipper «Gol!» lo accetta in cambio di una pallina. Nella tasca resta tiepido: vale un TEMPO in più nelle Palle del Tempo, ma solo qui, dentro questa storia." });

    const goal = (s) => ({
      0: "Il Professor Quarzo ti aspetta nell'Officina. Il Quadrante ha una ghiera nuova.",
      1: "Sali sul Pullman, nell'Officina, e scegli il 1978.",
      2: "È il 1978. Parla con Ines, nel Bar (in alto a destra) e con Rino, in piazza. La finale è alle sei, al campo.",
      3: "Il Mister aspetta al campo, a est. La finale della Coppa delle Rondini sta per cominciare.",
      4: "In tribuna c'è qualcuno che ti aspetta. Vai al campo, nel 1978.",
    }[s] || "Capitolo concluso. L'ultima partita, nel Quadrante.");

    // ------------------------------------------------------------ zone
    const zones = {
      rt_bar: {
        interior: true, region: "officina", name: "Rondine 1938-2038 · Il Bar da Ines", short: "Il Bar da Ines", sub: "Bancone, jukebox e un flipper", bg: "rt_bar", w: 14, h: 10, start: [6, 8], outside: ["rt_piazzale", 23, 6], items: [[11, 8]],
        act: { M: "Guarda il bancone", L: "Guarda gli scaffali", Y: "Gioca al flipper", v: "Esci", b: "Siediti", x: "Guarda il jukebox" },
        flavor: { M: "Il bancone, con il registratore di cassa a manovella. Il caffè costa trecento lire; la storia, di più.", L: "Bottiglie con etichette in tre lingue e una in aramaico. Una, in alto, dice solo «ADESSO».", b: "Ti siedi. Il tavolino ha un segno tondo: da cent'anni, tutti ci appoggiano la stessa tazza.", x: "Il jukebox: tre canzoni, tutte con la parola «domani». Una è incisa in verticale, come se qualcuno l'avesse suonata al contrario." },
        intro: [["voce", "Il Bar da Ines, 1978. Odore di caffè, di sigaretta spenta e di un flipper che lampeggia da solo. Sulla porta, un cartello: «SI ACCETTANO GETTONI, PROMESSE E FOTOGRAFIE»."]],
        npcs: () => [{ id: "rt_ines78", at: [8, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 1, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(6, 9, "v");
          lay(2, 3, 7, 3, "M"); put(2, 2, "L"); put(9, 2, "L"); put(12, 2, "L"); put(11, 2, "Y"); put(10, 5, "b"); put(10, 7, "b"); put(2, 7, "x");
        },
      },
    };

    // ------------------------------------------------------------ l'Occhio e la finale
    function partita2() {
      K.palla({
        title: "Palla del Tempo · La Coppa delle Rondini", eras: [1978, 2038], bg: "rt_campo78", oppStyle: "pressing", secs: 44,
        opp: { name: "Real Gambero", color: "#d84a4a", players: [{ name: "Tinca" }, { name: "Branzino" }], keeper: { name: "Lo Scoglio" } },
        mate: { name: "Rino", skin: "#d9a679", hair: "#5a3a1a" },
        intro: "<p>La finale del '78, minuto dopo minuto. Il Real Gambero è più forte, ma la Palla del Tempo ha un conto da pareggiare: finito il primo tempo, la partita <b>salta nel 2038</b> e riprende sul prato di luce. Quello che lasci nel 1978 lo ritrovi lì. Usa il <b>TEMPO</b> per fermare gli avversari.</p>",
        done: (r) => {
          if (r.quit) return say([["voce", "Lasci il campo. Rino alza le spalle: «La finale non scappa. Io sì, se continui a pensarci»."]]);
          F.set("rt_m2", r.win ? "vinta" : "persa");
          if (!r.win) return K.scene([["voce", "Il fischio finale. Il Real Gambero alza la coppa, e i tifosi del Rondinara, in silenzio, applaudono lo stesso."], ["rt_mister", "[triste] Ragazzi. Quando volete."]], () => K.enterZone("rt_campo"), "rt_campo78");
          F.set("rt_gol78", true); K.learnLore("l_finale78", true);
          K.scene([
            ["voce", "Il pallone entra al minuto 89, di testa, e questa volta nessuno lo annulla. Il campo del 2038, lì accanto, risponde con un lampo azzurro. Sul tabellone, in grassetto: «1978 · RINO SABBIONI 89'»."],
            ["rt_rino", "[felice] È dentro! È dentro, Mister! …Aspetta: è dentro davvero, e io me lo ricordo."],
          ], () => { setStep(N, 4); K.enterZone("rt_campo"); say([["voce", "In tribuna, in fondo, c'è un uomo con un treppiede. Non applaude: sta guardando la macchina."]]); }, "rt_campo78");
        },
      });
    }
    function occhio(kind) {
      F.set("rt_occhio", kind);
      if (kind === "spento") { bond("vera", -1); F.set("rt_cavo_tagliato", true); } else if (kind === "mite") bond("vera", 1); else bond("club", 1);
      K.learnLore("l_occhio", true);
      const msg = K.reward("ch:rt_c2", { coins: 100, cos: ["rt_c2", "rt_gettone"] }); F.set("rt_gettone", true);
      finishChapter(N); setStep(N, 5); questDone("rt_gol78");
      const L = {
        spento: [["rt_quarzo78", "…Allora lo spengo io. Con le mie mani, davanti a te. Se un occhio sbaglia, si chiude."], ["voce", "Stacca un cavo, poi un altro. La luce rossa della macchina fa un ultimo tremito, come un animale che si addormenta. Il treppiede sembra, d'un tratto, più leggero."]],
        mite: [["rt_quarzo78", "Un occhio che chiede scusa. Un occhio che dice «forse». Non l'ho mai pensato: e questo, ragazzo, è proprio il guaio."], ["voce", "Apre uno sportello, aggiunge una molla, una rotellina. Sulla targa scrive, con un pennarello: «DUBBIO»."]],
        lasciato: [["rt_quarzo78", "Lo lasci com'è? Anche dopo quello che ha fatto? …Forse hai ragione tu: la prossima volta ci penserò prima. Mi serve solo una prossima volta."], ["voce", "Lo guarda come si guarda un figlio che ha sbagliato un compito. Poi spegne la luce rossa, ma non il resto."]],
      }[kind];
      K.scene(L.concat([["voce", `<b>Fine del Capitolo 2 · Il gol che non c'è.</b> ${msg.join(" · ")}<br><span style="color:var(--dim)">Il Quadrante, nell'Officina, ha l'ultima ghiera. E Tilly ti cerca al piazzale.</span>`]]), () => { K.viaggia(2038); K.openMain(); }, "rt_campo78");
    }
    function quarzoScena() {
      K.scene([
        ["voce", "L'uomo con il treppiede è giovane, e ha già le mani del Professore: dita lunghe, nervose, macchiate di olio. Quando ti vede, non sorride."],
        ["rt_quarzo78", "Sei quello della partita. Quello che non parla come noi. …Hai visto cos'ha fatto, la mia macchina, l'anno scorso?"],
        ["rt_quarzo78", "L'Occhio: una cinepresa e una calcolatrice. Doveva dire la verità sui gol. Nel '77, in finale, ha detto «no» a un gol vero. L'arbitro ha creduto a lei, non a me. Non mi ha creduto nessuno, perché non mi ero mai sbagliato."],
        ["rt_quarzo78", "[triste] Poi ha cominciato a rivedere tutto. Ogni partita, ogni anno. Da quarant'anni la nascondo sotto il letto, e da quarant'anni la sento respirare."],
        ["voce", "Ti si ferma il fiato. Il Professore del 2038, quello con il tè che fuma e i capelli bianchi, ha le stesse mani. Non c'è stato nessun «ho sentito Tilly». C'è stato sempre lui."],
      ], () => ask("rt_quarzo78", "Dunque: che ne facciamo, dell'Occhio?", [
        { label: "«Spegnilo. Oggi»", sub: "Un occhio che sbaglia si chiude", cls: "hot", big: true, fn: () => occhio("spento") },
        { label: "«Insegnagli il dubbio»", sub: "Un occhio che dice «forse»", big: true, fn: () => occhio("mite") },
        { label: "«Lascialo com'è, e impara»", sub: "Un occhio non è un colpevole", big: true, fn: () => occhio("lasciato") },
      ], "rt_campo78"), "rt_campo78");
    }

    // ------------------------------------------------------------ dialoghi
    const talk = {
      rt_quarzo() {
        const s = S();
        if (s >= 5) return say([["rt_quarzo", "Ho la ghiera nuova, e un tè che non fuma più. Non so dirti se è meglio. So che è mio."]]);
        if (s < 1) return say([
          ["rt_quarzo", "[triste] Entra, entra. Ho preso il caffè al contrario, stamattina: sono già pentito di quello che sto per dire."],
          ["rt_quarzo", "Il VAR Totale ha scelto la sua seconda strada: il 1978. La finale della Coppa delle Rondini. Un gol che c'era, e che adesso non è mai stato."],
          ["rt_quarzo", "La ghiera del 1978 è tarata. Va' al Bar da Ines, parla con Rino e con il Mister. Giocate quella finale: è la nostra partita da pareggiare. E, ti prego…"],
          ["rt_quarzo", "…se vedi un uomo con un treppiede, non dirgli niente. È un tipo che non ha bisogno di sentirsi dire cosa deve fare."],
        ], () => { setStep(N, 1); K.learnLore("l_occhio"); quest("rt_gol78", "Il gol che non c'è", "Sali sul Pullman e scegli il 1978: il VAR Totale ha cancellato un gol nella finale della Coppa delle Rondini."); done(); });
        say([["rt_quarzo", s === 1 ? "Il Pullman, il Quadrante, il 1978. Non toccare niente di quello che vedi con un treppiede." : "Il 1978: Ines, Rino, il Mister, il campo. Io qui. E dai, non fare quella faccia: il tè è buono."]]);
      },
      rt_ines78() {
        const s = S();
        if (F.is("rt_ines1")) return say([["rt_ines78", s >= 4 ? "Un uomo con il treppiede, in tribuna? L'ho visto. Non ha mai bevuto un caffè da me. Quelli che non bevono, di solito, hanno qualcosa da farsi perdonare." : "Il caffè lo paghi dopo la partita. Se perdi, offre la casa."]]);
        F.set("rt_ines1", true); K.learnLore("l_ines78", true);
        const base = [
          ["rt_ines78", "Sei quello che Rino chiama «il forestiero». Mi chiamo Ines, e questo bar è mio da quando mia madre ha smesso di avere la schiena."],
          ["rt_ines78", "Qui si pagano il caffè, il tè e i guai: con gettoni, con promesse, con fotografie. Se non hai niente, offre la casa e il guaio lo teniamo noi."],
        ];
        if (F.is("rt_foto")) return say(base.concat([
          ["voce", "Le mostri la fotografia della carrozzina. Ines la prende con due dita, la gira, la rigira. Poi si siede, che per lei è una cosa mai vista."],
          ["rt_ines78", "[triste] Quella sono io. Avevo quattro mesi. E questo… questo è l'uomo con le scarpe strane. Mia madre me ne ha parlato per quarant'anni. Diceva: «Un forestiero ti ha tenuto in braccio, e tu gli devi un favore»."],
          ["rt_ines78", "Prendi: un gettone del flipper. È di ottone, con una rondine. Lo diedi a mio padre l'ultima volta che gli diedi qualcosa. Il flipper, stasera, ti dirà una cosa. Ti dirà sempre una cosa."],
        ]), () => { F.set("rt_gettone", true); bond("club", 1); say([["voce", "Il gettone è tiepido, come se qualcuno l'avesse appena stretto in mano. «Vale un TEMPO in più», senti dire a un orologio, da qualche parte."]], done); });
        say(base.concat([["rt_ines78", "Non hai una fotografia? Allora la storia la racconti tu, un giorno. Ora va' da Rino: è fuori, in piazza, con le basette che gli danno ragione."]]), () => { bond("club", 1); done(); });
      },
      rt_rino() {
        const s = S();
        if (s >= 3) return say([["rt_rino", "Il Mister ti aspetta al campo. Io ho le basette: lui ha il piano."]]);
        if (K.ep() !== 1978) return done();
        say([
          ["rt_rino", "Rino Sabbioni, ala sinistra. E tu sei quello che ha segnato il primo gol del Club, cent'anni fa? Eh sì. Lo so dalle scarpe."],
          ["rt_rino", "Stasera si gioca la finale. Il Real Gambero è una squadra di pescatori col cuore di ferro. Abbiamo perso l'anno scorso per un gol che io… che io ricordo diverso. Ma nessuno mi ascolta."],
          ["rt_rino", "Il Mister è al campo. Vai: ti vuole in squadra. Io corro, tu fai il resto."],
        ], () => { setStep(N, 3); bond("club", 1); done(); });
      },
      rt_mister() {
        if (K.ep() !== 1978) return done();
        const here = K.api.trZone(), s = S();
        if (here === "rt_campo") {
          if (s < 3) return say([["rt_mister", "Ragazzi. Prima parla con Ines e con Rino. Poi ne riparliamo."]]);
          return ask("rt_mister", F.get("rt_m2") === "persa" ? "Ragazzi. Si ricomincia?" : "Ragazzi. La finale. Quattro cose: corri, passa, tira, e non ascoltare l'arbitro quando parla con una macchina.", [
            { label: "Gioca la finale", sub: "Palla del Tempo · 1978 e 2038", cls: "hot", fn: partita2 },
            { label: "Ancora un momento", fn: done },
          ], "rt_campo78");
        }
        say([["rt_mister", K.pick(["Ragazzi.", "Ragazzi. Il pallone è rotondo, il campo è piatto, l'arbitro è un uomo. Il resto è una pausa caffè.", "Ragazzi: la finale è alle sei. Chi arriva alle sei e cinque, resta in tribuna con la mamma."])]]);
      },
      rt_quarzo78() { if (S() === 4 && K.ep() === 1978 && !F.is("rt_occhio")) return quarzoScena(); return say([["rt_quarzo78", "Vai. La sera è bella. Io ho una macchina da mettere a posto."]]); },
      rt_tilly() {
        const s = S();
        if (K.mem().ch >= 3) return say([["rt_tilly", "Il VAR Totale ha scelto la strada più lunga: sta venendo qui. Lo sento nei cavi."]]);
        if (s >= 5) return say([["rt_tilly", "Il tabellone dice «1978 · RINO SABBIONI 89'»: lo vedo sempre, adesso. Non so come, ma l'ha riportato un gettone. Anche il mio, e non so perché."]]);
        say([["rt_tilly", "Il Professore è in Officina, e il Pullman ha la ghiera nuova. Io sto qui: le macchine, a volte, hanno bisogno di compagnia."]]);
      },
    };
    const obj = {
      "rt_bar:Y": () => {
        const era = K.ep();
        if (era !== 1978) return say([["voce", "Il flipper è spento, nero. Sul vetro, a pennarello: «GOL! (fuori servizio)»."]]);
        ask("voce", "Il flipper «Gol!»: tre luci, due palette, una pallina d'ottone. Sulla biglia c'è una rondine incisa.", [
          { label: "Gioca una pallina", sub: "Mille punti la pallina, cento anni il tilt", cls: "hot", fn: () => { K.tone(660, 0.1, "square", 0.05, 0); say([["voce", K.pick(["La pallina rimbalza tre volte, sfiora la rondine e cade nel buco. «TILT!», dice la macchina, e poi, piano: «scusa».", "Tre bumper, un tunnel, un ponte. 18.400 punti: abbastanza per un caffè.", "La pallina esce dal campo e rimbalza sul pavimento. Ines la raccoglie senza guardarti."])]], done); } },
          { label: "Dai una botta (tilt)", sub: "Ines non guarda, ma sente", fn: () => { say([["rt_ines78", "[pensa] Il flipper è come i giocatori: quando lo senti, vuol dire che hai già sbagliato."], ["voce", "Il flipper fa «TILT» e si spegne. Dal cassetto sotto esce un foglietto: «Ogni gol mancato è un gol che aspetta»."]], done); } },
          { label: "Non adesso", fn: done },
        ], "rt_bar");
      },
      "rt_bar:v": () => go("rt_piazzale", 23, 6),
    };
    const patch = {
      rt_piazzale: {
        build(L) {
          const C = houseCol(), era = K.ZX.eraName;
          L.house(20, 1, 7, 5, { door: [23, 5], roof: C.roof, wall: C.wall, rr: 3, lit: true, flowers: era !== "1938",
            enter: era === "1978" ? { to: "rt_bar", at: [6, 8] } : era === "1938" ? "L'osteria del Moro. Dentro, voci e fumo: parlano tutti insieme dell'inaugurazione. La porta è chiusa a chiave: «torniamo subito»." : "Il Bar Orbitale. Sulla porta, un avviso: «CHIUSO PER CENTENARIO»; sotto, a penna: «e per revisione»." });
        },
        npcs(s, list) {
          if (K.ep() === 1978 && K.mem().ch >= 2 && S() >= 4) return list.filter((n) => n.id !== "rt_mister");
          return list;
        },
      },
      rt_campo: {
        npcs(s, list) {
          if (K.ep() === 1978) { const o = [{ id: "rt_mister", at: [12, 8] }, { id: "rt_rino", at: [22, 13] }]; if (S() === 4) o.push({ id: "rt_quarzo78", at: [5, 15] }); return list.concat(o); }
          return list;
        },
      },
    };
    K.viaggio = K.viaggio || []; K.viaggio.push((ep) => { if (K.mem().ch === 2 && S() === 1 && ep === 1978) setStep(N, 2); });
    return { n: N, title: "Il gol che non c'è", sub: "1978: la finale, un bar, una macchina con un occhio solo", goal, start: "rt_officina", introBg: "rt_officina", zones, talk, obj, patch,
      intro: () => [["voce", "L'Officina del Professor Quarzo, la mattina dopo, che è sempre la sera prima. Il tè fuma, il Pullman ha una ghiera in più e il Professore ti guarda come chi deve dirti una cosa e prima ne dice altre dieci."]] };
  }
  boot();
})();
