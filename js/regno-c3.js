// js/regno-c3.js - CRONACHE DEL REGNO ULTIMO · Capitolo 3 «Il Duello di Corona»
// La notte prima del Duello: i tre capi, la Cappella dei Sovrani, il segreto della Palla e la finale sulla Piazza d'Armi.
// L'avversario dipende dalle alleanze; i quattro finali dipendono da tutto quello che hai fatto.
(function () {
  "use strict";
  function boot() { const D = window.__regno; if (!D || !D.addChapter || !D._has || !D._has(2)) return setTimeout(boot, 120); D.addChapter(chapter3); }
  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N), HS = ["lupi", "gabbiani", "cervi"];
    const visti = () => HS.filter((h) => F.is("re_v_" + h)).length;

    K.cast("re_tullio", { acc: ["bandana"], name: "Tullio Valverde, Capo dei Corvi", tag: "gray", hair: "#3a3a3a", style: "side", skin: "#e0c8a8", eye: "#3a5a3a", beard: true, bg: ["#2a2030", "#8a7a9a"], shirt: "#3a2a40" },
      "Il capo dei Corvi di Rocca Nera, che da tre mesi assediano un angolo del Regno con molta pazienza e poche idee. Ha la calligrafia di suo padre e il carattere di sua madre.");
    K.cos("re_c3", { kind: "shirt", label: "Casacca della Piazza d'Armi", val: "#c8a040", from: "Capitolo 3 di Cronache del Regno Ultimo" });
    K.cos("re_regina", { kind: "shirt", label: "Cotta dei Tre Stendardi", val: "#a82a3a", from: "Finale «La Regina dei Tre Stendardi»" });
    K.cos("re_consiglio", { kind: "shirt", label: "Mantello del Consiglio", val: "#7a5a2a", from: "Finale «Il Consiglio della Palla»" });
    K.cos("re_ferro", { kind: "shirt", label: "Corazza di Ferro", val: "#4a4f5e", from: "Finale «La Corona di Ferro»" });
    K.cos("re_perpetuo", { kind: "shirt", label: "Maglia del Duello Perpetuo", val: "#e8c860", from: "Finale segreto «Il Duello Perpetuo»" });
    K.lore("l_cronaca", { t: K.PAGINE.l_cronaca[0], d: K.PAGINE.l_cronaca[1] });

    const goal = (s) => ({
      0: "La notte prima del Duello: parla con la Principessa Oriele, sui bastioni (Castelalto, il cancello a est del Cortile).",
      1: `Ascolta i tre capi delle Casate prima del Duello: ${visti()}/3.`,
      2: "Oriele vuole parlarti: ha la chiave della Cappella dei Sovrani.",
      3: "Scendi nella Cappella dei Sovrani (la casa grigia sui bastioni): c'è la Cripta.",
      4: "È l'alba: il Duello di Corona ti aspetta sulla Piazza d'Armi (cancello a est dei bastioni).",
      5: "Hai vinto il Duello. Parla con la Principessa Oriele: tocca a te decidere come finisce.",
    }[s] || "La saga è conclusa. Rigioca i capitoli per cercare gli altri finali.");

    // l'avversario: il campione della Casata che hai trascurato di più; se hai tutte e tre le alleanze, il Capo dei Corvi
    const rivale = () => {
      const v = HS.map((h) => [h, K.stat(h)]); if (v.every((x) => x[1] >= 3)) return { id: "re_tullio", name: "I Corvi di Tullio Valverde", color: "#3a2a40", style: "pressing", chi: "Tullio e i suoi Corvi" };
      const low = v.slice().sort((a, b) => a[1] - b[1])[0][0];
      return { lupi: { id: "re_ulderico", name: "Le Lance di Ulderico", color: "#8b95ab", style: "pressing", chi: "Ulderico dei Lupi" }, gabbiani: { id: "re_scilla", name: "Le Vele di Scilla", color: "#38a8d8", style: "contropiede", chi: "Scilla dei Gabbiani" }, cervi: { id: "re_selvano", name: "I Rami di Selvano", color: "#5aa862", style: "equilibrata", chi: "Selvano dei Cervi" } }[low];
    };
    const puoi = {
      regina: () => true,
      consiglio: () => F.is("re_cripta_vista") && HS.every((h) => K.stat(h) >= 1),
      ferro: () => K.stat("lupi") >= 6 || F.is("re_giuro_ferro"),
      perpetuo: () => HS.every((h) => K.stat(h) >= 3) && K.lorePagine() >= 3 && F.is("re_spia_vera") && K.stat("fiducia") >= 5,
    };

    const zones = {
      re_vigilia: {
        region: "cortile", name: "Castelalto · I Bastioni della Vigilia", short: "Bastioni della Vigilia", sub: "Torce, patti da firmare e la Cappella dei Sovrani", bg: "re_vigilia", time: "notte", travel: [15, 17],
        w: 30, h: 20, start: [15, 17], items: [[4, 14], [25, 14], [26, 3]],
        banners: { "7,12": "lupi", "15,12": "gabbiani", "22,12": "cervi" },
        areas: [[2, 6, 27, 16, "I Bastioni della Vigilia"], [0, 0, 29, 19, "La Vigilia di Castelalto"]],
        links: { "0,10": ["re_cortile", 30, 11], "29,10": ["re_piazza", 1, 10] },
        chests: { "3,3": { coins: 45, text: "Dietro un braciere spento, una cassetta di ferro con le paghe di tre notti di vigilia, mai riscosse: i soldati le lasciano lì «per non disturbare». Una moneta è stata infilata da parte: c'è scritto «per il Campione»." } },
        flavor: { F: "Un braciere di ferro: il fuoco della vigilia non si spegne mai prima dell'alba. Lo dice il Patto, articolo sei. Lo dicono anche i soldati, soprattutto d'inverno.", K: "Il tavolo dei patti: tre calamai, tre penne, tre pergamene bianche. Nessuno firma niente fino all'alba: per tradizione, e per prudenza.", n: "Il cartello della Vigilia: «Si prega di non parlare dei Corvi. Si prega di non pensare ai Corvi. Si prega di dormire». Dormire è fuori portata.", y: "" },
        intro: [["voce", "I bastioni di Castelalto, la notte prima del Duello. Bracieri accesi in fila, tre tavoli per tre Casate, e sopra il parapetto una luce che non è di torcia: il cielo comincia, molto lontano, a schiarire."]],
        npcs: (s) => [{ id: "re_oriele", at: [14, 14] }, { id: "re_brando", at: [6, 9] }, { id: "re_perla", at: [23, 9] }, { id: "re_cedro", at: [18, 8] }, { id: "re_fiorino", at: [10, 15] }, ...(F.get("re_mirta", "") === "accusata" ? [] : [{ id: "re_mirta", at: [20, 15] }])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 19, 29, 19, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a");
          lay(1, 1, 28, 18, "+"); lay(1, 10, 28, 10, ":"); lay(13, 6, 16, 18, ":");
          put(0, 10, "<"); put(29, 10, ">");
          house(12, 1, 6, 5, { door: [14, 5], roof: "#4a4f5e", wall: "#8a8478", rr: 2, enter: { to: "re_cripta", at: [10, 12], locked: (KK) => (F.is("re_chiave") || KK.stepOf(3) >= 3 ? false : "La Cappella dei Sovrani è chiusa: la chiave ce l'ha la Principessa.") } });
          put(7, 12, "I"); put(15, 12, "I"); put(22, 12, "I"); [[5, 7], [24, 7], [9, 14], [20, 14], [3, 12], [27, 12]].forEach(([x, y]) => put(x, y, "F"));
          lay(5, 4, 8, 4, "K"); lay(21, 4, 24, 4, "K"); put(3, 3, "x"); put(2, 17, "s"); put(26, 17, "n");
        },
      },
      re_cripta: {
        interior: true, region: "cripta", name: "Castelalto · La Cripta dei Sovrani", short: "Cripta dei Sovrani", sub: "Pietra, silenzio e una palla di cuoio su un piedistallo", bg: "re_cripta", time: "notte", w: 20, h: 14, start: [10, 12], outside: ["re_vigilia", 14, 6], base: "+", items: [[3, 6], [16, 6]],
        act: { v: "Risali", Y: "Osserva il piedistallo", A: "Leggi la lastra" },
        flavor: { A: "Una lastra di pietra con un nome e due date. Le date sono molto lontane l'una dall'altra, e sotto c'è una sola riga, incisa piano: «Cuoco».", F: "Una torcia da cripta: fa più luce che calore, come i buoni consigli." },
        intro: [["voce", "La scala scende di tre piani. In fondo, una sala di pietra con le lastre dei sovrani, uno accanto all'altro. In mezzo a tutte, un piedistallo. Sul piedistallo, una palla di cuoio che brilla appena."]],
        npcs: () => [{ id: "re_oriele", at: [8, 8] }],
        objects: {
          "10,3": () => {
            const prima = F.is("re_cripta_vista");
            const lines = [["voce", "La Palla del Giuramento: cuoio scuro, rammendato mille volte. Sul fianco, una cucitura più fina delle altre, quasi nascosta. Oriele passa il pollice sul filo."], ["re_oriele", "[pensa] Mio nonno diceva che non l'ha mai aperta nessuno. Aveva ragione: non si apre. È già chiusa, da sempre. Da dentro."], ["voce", "Sotto la Palla, su una targa di rame: «Qui, Tobia il Cuoco, primo re, cucì nel cuoio la corona perché nessuno potesse portarla in testa e tutti potessero farla rotolare. Chi gioca con la Palla regna. Chi regna con la Palla non gioca più»."], ["re_oriele", "[sorpreso] Capisci? Non c'è una corona da vincere. C'è una Palla da tenere in gioco. Il Duello non serve a scegliere un re: serve a ricordare che nessuno lo è. (Si ferma.) E adesso non so più se voglio vincere."]];
            if (prima) return say([["re_oriele", "(Con la mano sul cuoio.) Domani si gioca. Qualunque cosa decidiamo, la Palla resterà così: chiusa, rammendata e un po' più antica di tutti noi."]], done);
            F.set("re_cripta_vista", true); K.learnLore("l_cronaca"); bond("fiducia", 1);
            say(lines, () => { if (S() === 3) { setStep(N, 4); questDone("re_cripta"); quest("re_duello", "Il Duello di Corona", "Sulla Piazza d'Armi, all'alba (cancello a est dei bastioni)."); } K.scene([["voce", "<b>Pagina della Cronaca.</b> Hai trovato il segreto della Palla del Giuramento (Libro delle Casate)."]], done, "re_cripta"); });
          },
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 13, "+"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 13, "a"); lay(19, 0, 19, 13, "a"); lay(0, 13, 19, 13, "a");
          put(10, 13, "v"); put(10, 3, "Y"); [[4, 1], [8, 1], [12, 1], [16, 1]].forEach(([x, y]) => put(x, y, "A")); [[7, 4], [13, 4], [3, 10], [16, 10]].forEach(([x, y]) => put(x, y, "F"));
        },
      },
      re_piazza: {
        region: "piazza", name: "Castelalto · La Piazza d'Armi", short: "Piazza d'Armi", sub: "Il palco, la folla e una palla sola", bg: "re_piazza", time: "alba", travel: [2, 10],
        w: 32, h: 20, start: [2, 10], items: [[5, 4], [27, 15], [6, 16]],
        banners: { "9,6": "lupi", "15,6": "gabbiani", "21,6": "cervi" },
        areas: [[9, 1, 24, 7, "Il palco del Duello"], [2, 8, 29, 17, "La piazza"], [0, 0, 31, 19, "La Piazza d'Armi"]],
        links: { "0,10": ["re_vigilia", 28, 10] },
        chests: { "28,3": { coins: 40, text: "Sotto una panca del palco, un cesto di fichi finti e un biglietto: «Per il Campione, che non ascolta: grazie». Non c'è firma. I fichi sono buoni." } },
        flavor: { n: "Il tabellone: «Duello di Corona, tre tempi. Ingresso libero. Applausi facoltativi. Gli spergiuri sono pregati di spergiurare altrove».", F: "Una torcia della piazza, accesa dall'alba: a Castelalto si accende tutto in anticipo, ma qui, per una volta, è in orario.", K: "Il banchetto del popolo: pane, olive e una brocca di vino annacquato per ragioni dinastiche.", y: "" },
        intro: [["voce", "La Piazza d'Armi all'alba: tre tribune di colori diversi, un palco di legno nuovo, una folla che ha dormito pochissimo. Al centro, un cerchio di calce e un piedistallo vuoto: la Palla arriverà dopo."]],
        npcs: (s) => [{ id: "re_evaristo", at: [16, 9] }, { id: "re_oriele", at: [14, 10] }, { id: "re_fiorino", at: [8, 12] }, { id: "re_gatto", at: [13, 3] }, { id: "re_anselmo", at: [12, 3] }, { id: "re_tullio", at: [26, 12] }],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 19, 31, 19, "a"); lay(0, 0, 0, 19, "a"); lay(31, 0, 31, 19, "a");
          lay(1, 1, 30, 18, ":"); lay(1, 10, 30, 10, "+"); lay(9, 1, 24, 7, "+"); lay(9, 7, 24, 7, "+"); put(0, 10, "<");
          lay(9, 4, 9, 4, "K"); put(9, 6, "I"); put(15, 6, "I"); put(21, 6, "I"); lay(3, 14, 6, 14, "K"); lay(24, 14, 27, 14, "K"); put(28, 3, "x"); put(4, 3, "n"); [[7, 8], [25, 8], [4, 17], [27, 17]].forEach(([x, y]) => put(x, y, "F")); put(2, 17, "s");
          put(29, 6, "t"); put(2, 6, "t");
        },
      },
    };
    const patch = { re_trono: { npcs: (s, list) => list } };

    // ------------------------------------------------------------ i capi delle Casate alla Vigilia
    const visitato = (h) => { F.set("re_v_" + h, true); if (visti() >= 3 && S() === 1) { setStep(N, 2); questDone("re_capi"); quest("re_chiaveq", "La chiave della Cappella", "La Principessa Oriele ti aspetta sui bastioni."); } };
    function brando() {
      if (F.is("re_v_lupi")) return say([["re_brando", "(Non ti guarda.) Domani, sulla piazza, ci rivedremo. Comunque vada, ricordati che non sorrido mai, e che stasera sto per farlo."]], done);
      ask("re_brando", "(La spada da cerimonia è sul tavolo, ancora nel fodero. Ti guarda come si guarda una mappa.) Domani si decide. Voglio saperlo adesso, Campione: giochi per il Regno, o per me?", [
        { label: "«Giuro fedeltà ai Lupi, Generale»", sub: "Favore +2 ai Lupi · i Gabbiani si offendono · apre il finale di ferro", fn: () => { F.set("re_giuro_ferro", true); K.dai("lupi", 2); K.dai("gabbiani", -1); visitato("lupi"); say([["re_brando", "[felice] Un giuramento. (Lo scrive su un foglietto, che mette in tasca.) Lo custodirò come una cosa che non si può restituire. Domani, alla Piazza: avanti, e non voltarti."]], done); } },
        { label: "«Gioco per tutti, Generale»", sub: "Favore +1 ai Cervi e fiducia della Principessa", fn: () => { K.dai("cervi", 1); bond("fiducia", 1); visitato("lupi"); say([["re_brando", "[arrabbiato] Per tutti. È la risposta più difficile. (Si schiarisce la voce.) Rispetto la fatica di chi la dà. Non prometto di capirla."]], done); } },
        { label: "«Niente guerra, qualunque cosa succeda»", sub: "Favore +1 ai Lupi e ai Cervi", fn: () => { K.dai("lupi", 1); K.dai("cervi", 1); F.set("re_pace_brando", true); visitato("lupi"); say([["re_brando", "(Una pausa lunghissima.) Qualunque cosa. (Annuisce.) Ho sedicimila lance, e per sedicimila giorni sapevo cosa farne. Domani, per la prima volta, sono contento di non saperlo."]], done); } },
      ], "re_vigilia");
    }
    function perla() {
      if (F.is("re_v_gabbiani")) return say([["re_perla", "(Ha chiuso il registro.) Il conto è pari, Campione. Anzi, a tuo favore. Una cosa che non mi succede da vent'anni: cerchiamo di non dirlo in giro."]], done);
      ask("re_perla", "(Ti porge una pergamena con un sigillo di cera azzurra.) Un contratto, Campione. Se domani vinci, i Gabbiani avranno il diritto di prelazione sul porto di Castelalto. Firma, e hai la mia nave. Non firmare, e hai la mia stima, che si paga meno.", [
        { label: "Firmare", sub: "Favore +2 ai Gabbiani · i Cervi lo notano", fn: () => { K.dai("gabbiani", 2); K.dai("cervi", -1); F.set("re_contratto", true); visitato("gabbiani"); say([["re_perla", "(Soffia sul sigillo.) Un uomo, o una donna, di parola. Rarissimi: li annoto con l'inchiostro rosso."]], done); } },
        { label: "Rifiutare con garbo", sub: "Favore +1 ai Gabbiani e fiducia della Principessa", fn: () => { K.dai("gabbiani", 1); bond("fiducia", 1); visitato("gabbiani"); say([["re_perla", "[sorpreso] Hai rifiutato un contratto senza insultarlo. (Riavvolge la pergamena.) Ne ho visti pochi. Non ci perdi niente: l'ho scritto male apposta."]], done); } },
        { label: "Proporre i forzieri in comune", sub: "Favore +1 a Gabbiani e Cervi: una voce per il Consiglio", fn: () => { K.dai("gabbiani", 1); K.dai("cervi", 1); F.set("re_forzieri", true); visitato("gabbiani"); say([["re_perla", "(Per la prima volta alza gli occhi dal registro.) In comune. È un'idea ridicola, e questo spiega perché nessuno ci aveva pensato. Ne riparleremo. Con tre testimoni."]], done); } },
      ], "re_vigilia");
    }
    function cedro() {
      if (F.is("re_v_cervi")) return say([["re_cedro", F.is("re_spia_vera") ? "(Non alza gli occhi dal libro.) Domani, sulla piazza, ci sarà mio figlio. Per la prima volta in tre anni, sono contento di sapere dove siede." : "Secondo l'articolo sei, la vigilia si passa in silenzio. Mi permetto di rispettarlo, e di esserne infastidito."]], done);
      const prove = F.is("re_ind_lettera") && F.is("re_ind_inchiostro");
      const menu = () => ask("re_cedro", "(Ha tre libri aperti e un quarto in testa. Ti guarda con la solita cortesia: quella di chi sta preparando una frase.) Campione. Qualche minuto, prima dell'alba: ne ho a disposizione solo uno, poi arriva l'articolo nove.", [
        { label: "Mostrare la lettera", sub: prove ? "Le dita nere d'inchiostro, i fogli con il nome «Tullio»" : "Ti servono la lettera e la testimonianza di Mirta", disabled: !prove, cls: "hot", fn: () => { F.set("re_spia_vera", true); say([
          ["re_cedro", "(Guarda la lettera. Poi, lentamente, si toglie gli occhiali.) Sì. L'ho scritta io. Tutte e quattro."],
          ["re_cedro", "[triste] Tullio è mio figlio. Ha lasciato casa a diciassette anni, e adesso comanda i Corvi. Gli scrivevo quello che sapevo: dove il Regno era debole, per fargli capire dove non colpire. Non erano segreti di guerra: erano segreti di pace, e lui li leggeva come ordini. Un padre fa le cose più stupide con la calligrafia più bella."],
          ["re_cedro", "Non ho mai tradito il Patto, Campione. Ho solo cercato di impedire che servisse. (Pausa.) Decidi tu quello che sarà di me."],
        ], () => ask("re_cedro", "Che cosa fai della lettera?", [
          { label: "La tengo io, e taccio", sub: "Favore +2 ai Cervi · la verità resta tra voi", fn: () => { K.dai("cervi", 2); F.set("re_cedro_protetto", true); visitato("cervi"); say([["re_cedro", "(La piega, con cura.) Un favore che non dimenticherò. Secondo l'articolo che non ho ancora scritto: i debiti vanno pagati in silenzio."]], done); } },
          { label: "La mostro alla Principessa", sub: "Fiducia della Principessa +2 · i Cervi si raffreddano", fn: () => { bond("fiducia", 2); K.dai("cervi", -1); F.set("re_cedro_detto", true); visitato("cervi"); say([["re_cedro", "(Annuisce.) Giusto. A corte, la verità ha un solo difetto: è il rimedio di cui nessuno ha mai voglia. Vado io da lei, prima dell'alba. Non voglio che lo scopra da un vassoio."]], done); } },
        ], "re_vigilia")); } },
        { label: "«Che cosa dice l'articolo nove, Lord Cedro?»", sub: "Favore +1 ai Cervi", fn: () => { K.dai("cervi", 1); visitato("cervi"); say([["re_cedro", "Che chi regna deve poter essere sostituito. Il guaio è che nessuno ha ancora trovato chi. (Sorride, con fatica.) Domani, sulla piazza, qualcuno proverà a trovarlo con i piedi."]], done); } },
        { label: "Chiedere il parere dei Cervi sul Consiglio della Palla", sub: F.is("re_buco") ? "Il buco di legge lo conoscete entrambi" : "Ti manca il buco del Patto", disabled: !F.is("re_buco"), fn: () => { K.dai("cervi", 2); F.set("re_consiglio_cedro", true); visitato("cervi"); say([["re_cedro", "Un Consiglio al posto della Corona. Con tre Casate e un gatto. (Ride, per la prima volta.) Secondo l'articolo che invento adesso, è perfettamente legale. Domani verificheremo se lo è anche in pratica."]], done); } },
      ], "re_vigilia");
      menu();
    }

    // ------------------------------------------------------------ la finale
    function gioca() {
      const r = rivale();
      K.coronaMatch({
        title: "Duello di Corona · Piazza d'Armi", us: "Il Campione senza Stendardo", intro: `All'alba, davanti alle tre Casate, ${r.chi} scende in campo contro il Campione senza Stendardo. Tre tempi, una carica a testa, e il Consiglio nell'intervallo.`,
        opp: { name: r.name, color: r.color, style: r.style }, tempi: 3, winTitle: "VITTORIA DEL DUELLO DI CORONA!",
        council: [
          { q: "Prima del secondo tempo i tre capi ti mandano, ciascuno, un dono: una spilla, un anello, una foglia d'argento. Evaristo sussurra che accettarli tutti sarebbe scortese, e rifiutarli tutti peggio.", opts: [
            { label: "La spilla dei Lupi", sub: "Favore ai Lupi", fav: { lupi: 1 }, say: "Brando, sulla tribuna grigia, abbassa il mento di un centimetro. Per lui, un applauso a scena aperta." },
            { label: "L'anello dei Gabbiani", sub: "Favore ai Gabbiani", fav: { gabbiani: 1 }, say: "Perla alza due dita: due monete, di stima." },
            { label: "La foglia dei Cervi", sub: "Favore ai Cervi", fav: { cervi: 1 }, say: "Lord Cedro gira una pagina. È il suo modo di dire «bravo»." },
          ] },
          { q: "Ultimo intervallo. Sugli spalti qualcuno ha cominciato a battere le mani a tempo. Non è chiaro per chi. Il vecchio re, dal palco, sembra sveglio.", opts: [
            { label: "Salutare i Lupi", sub: "Favore ai Lupi", fav: { lupi: 1 }, say: "Il Nord risponde con un colpo di lancia a terra. Un colpo solo, ma si sente fino al porto." },
            { label: "Salutare il Porto", sub: "Favore ai Gabbiani", fav: { gabbiani: 1 }, say: "Le vele si alzano tutte insieme: è un trucco di Scilla, e funziona." },
            { label: "Salutare tutti insieme", sub: "Un poco a ognuno", fav: { lupi: 1, gabbiani: 1, cervi: 1 }, say: "Per un secondo la piazza tace. Poi, da qualche parte, un gatto miagola. Va bene lo stesso." },
          ] },
        ],
      }, (res) => {
        if (res && res.win) { F.set("re_vinto", true); setStep(N, 5); questDone("re_duello"); quest("re_fine", "La Corona", "Parla con la Principessa Oriele."); say([["voce", `Fischio finale. La Piazza d'Armi esplode: tre tribune, tre colori, un solo rumore. ${r.chi} ti stringe la mano, con le dita ancora tremanti e una dignità intatta.`], ["re_evaristo", "[felice] Con tutto il rispetto, Campione: è la prima volta in ottant'anni che ho dimenticato di annotare il risultato."]], done); }
        else say([["re_evaristo", "(Chiude il taccuino, piano.) Perdere è una cerimonia come un'altra, Campione. Con tutto il rispetto: tra un'ora si ripete, e stavolta chiedo di annotare meno."]], done);
      });
    }
    function fine(kind) {
      const R = { regina: { coins: 150, cos: ["re_c3", "re_regina"] }, consiglio: { coins: 160, cos: ["re_c3", "re_consiglio"] }, ferro: { coins: 160, cos: ["re_c3", "re_ferro"] }, perpetuo: { coins: 260, cos: ["re_c3", "re_perpetuo"] } }[kind];
      const msg = K.reward("end:" + kind, R); K.end(kind); finishChapter(N, kind); setStep(N, 6); questDone("re_fine");
      const E = K.ENDINGS[kind];
      const L = {
        regina: [["re_oriele", "(Alza la Palla con tutte e due le mani. Per un istante sembra molto più alta di sé stessa.) Giuro di tenerla in gioco. Di non tenerla per me. Di farla rotolare anche quando pesa."], ["re_anselmo", "[ride] E io che speravo di poter finalmente morire in pace. Non ancora, ragazzo: voglio vedere cosa combina il gatto."], ["re_fiorino", "(Accorda il liuto.) «Salì sul palco la Regina senza trono, e la Palla le disse: vedi? Non è poi così pesante.» Rima. Per una volta, rima."]],
        consiglio: [["re_oriele", "(Con il pollice sulla cucitura.) Se tagliamo il filo, la Corona torna a rotolare. Non è più di nessuno. È di tutti. (Alza gli occhi sulle tre tribune.) Chi vuole tenerla, la tenga con altri due."], ["re_cedro", "Secondo l'articolo tredici, e per la prima volta senza riserve: è legale."], ["re_brando", "[arrabbiato] Odio tutto questo. (Pausa.) Ma è una bella idea. Non lo ripeto."]],
        ferro: [["re_brando", "(Prende la Palla con una mano sola, come una cosa che non ha mai pensato di meritare.) Giuro di difenderla. E, siccome so fare solo quello, di difendere anche chi me lo ricorda ogni giorno."], ["re_oriele", "(Piano.) Studierò. Mi hai promesso un Regno in ordine, Generale. Il Regno ha anche altro: ricordatelo."], ["re_perla", "(Chiude il registro.) Un Re di ferro. Voglio vedere i conti. Prima o poi."]],
        perpetuo: [["re_oriele", "(Alza la Palla, la guarda, e la rimette sul piedistallo.) Nessuna corona. Ogni anno, qui, si gioca per decidere chi guida il Regno per dodici mesi. Si può sempre rigiocare. Le guerre finiscono perché si può sempre rigiocare."], ["re_anselmo", "[ride] Quarant'anni che non ridevo così. Posso dirlo? È stata un'idea da cuoco."], ["re_tullio", "(Dal fondo della piazza, con il mantello dei Corvi sulle spalle.) Padre. (Cedro alza la mano, senza parlare. Basta.)"]],
      }[kind];
      K.scene([...L, ["voce", `<b>FINALE · ${E[0]}.</b> ${E[1]}<br><span style="color:var(--dim)">${msg.join(" · ")}<br>Finali trovati: ${K.mem().ends.length} su 4.</span>`]], () => K.openMain(), "re_piazza");
    }
    function endingAsk() {
      const op = (k, label, sub, cls) => ({ label, sub: puoi[k]() ? sub : "Non ancora possibile: " + sub, disabled: !puoi[k](), big: true, cls, fn: () => fine(k) });
      ask("re_oriele", "(Ha ancora la polvere della piazza sul mantello.) Hai vinto, Campione. Adesso tocca a me chiedertelo, perché nessun altro oserebbe: come finisce?", [
        op("perpetuo", "«Nessuna corona: giochiamo ogni anno»", "Il Duello Perpetuo (segreto)", "hot"),
        op("consiglio", "«Tagliamo il filo: la Corona è di tutti»", "Il Consiglio della Palla"),
        op("ferro", "«Il Generale ha giurato: lascia che regni»", "La Corona di Ferro"),
        op("regina", "«Regina, Altezza»", "La Regina dei Tre Stendardi"),
      ], "re_piazza");
    }

    const talk = {
      re_oriele() {
        const s = S();
        if (s === 0) return say([
          ["re_oriele", "(Sui bastioni, con il mantello rosso. I bracieri la illuminano a pezzi.) Domani all'alba. Hai le Casate, in qualche misura, e io ho un sospetto che non mi lascia dormire."],
          ["re_oriele", "I tre capi sono qui, ciascuno al suo tavolo. Parlaci: ognuno ti chiederà qualcosa, e ognuno ricorderà la risposta. Quando hai finito, torna da me. C'è un posto che devo mostrarti, e non è sulla mappa."],
        ], () => { setStep(N, 1); quest("re_capi", "I tre capi delle Casate", "Ascolta Brando, Perla e Cedro ai loro tavoli, sui bastioni."); done(); });
        if (s === 1) return say([["re_oriele", `Hai ascoltato ${visti()} capi su tre. Gli altri ti aspettano: la Vigilia non dura per sempre. Dura, però, quanto basta.`]], done);
        if (s === 2) return say([
          ["re_oriele", "[pensa] Ho visto come ti hanno guardato. Il Generale, con il rispetto che nasconde; Perla, con il conto che finge di non fare; Cedro, con un peso. Tutti hanno qualcosa da dirti stanotte. Io ti devo una cosa soltanto."],
          ["re_oriele", "(Estrae una chiave di ferro, grande come una mano.) Quella della Cappella dei Sovrani. Il nonno me l'ha data tre anni fa, e mi ha detto: «Aprila solo quando nessuno ti sta guardando». Adesso nessuno ci guarda. Vieni."],
        ], () => { F.set("re_chiave", true); setStep(N, 3); questDone("re_chiaveq"); quest("re_cripta", "La Cappella dei Sovrani", "La casa grigia sui bastioni: scendi nella Cripta e osserva il piedistallo."); done(); });
        if (s === 3) return say([["re_oriele", "La Cappella è la casa grigia, in cima ai bastioni. Io ti aspetto sotto, davanti al piedistallo."]], done);
        if (s === 4) return say([["re_oriele", K.inZone("re_piazza") ? "Siamo qui. La folla, le tribune, il palco. Quando sei pronto, parla con Evaristo: ha il fischietto, e dice che gli trema la mano." : "È l'alba. Il Duello ti aspetta sulla Piazza d'Armi: il cancello è a est dei bastioni."]], done);
        if (s === 5) return K.inZone("re_piazza") ? endingAsk() : say([["re_oriele", "Ti aspetto sulla Piazza d'Armi, quando vuoi. Ho ancora la polvere del Duello sul mantello, e voglio che lo sappiano tutti."]], done);
        return say([["re_oriele", "(Sorride.) La Palla è in gioco. Il resto è un dettaglio. Se vuoi rigiocare un capitolo, la porta dei capitoli è sempre aperta: gli altri finali ti aspettano."]], done);
      },
      re_brando() { if (S() <= 1 && K.inZone("re_vigilia")) return brando(); return K.PASS; },
      re_perla() { if (S() <= 1 && K.inZone("re_vigilia")) return perla(); return K.PASS; },
      re_cedro() { if (S() <= 1 && K.inZone("re_vigilia")) return cedro(); return K.PASS; },
      re_mirta() {
        const a = F.get("re_mirta", "");
        say([["re_mirta", a === "difesa" ? "(Lascia il vassoio, per un attimo.) Domani non ascolterò niente, signore. Solo il Duello. (Sorride.) Sono la prima a dirlo: sembra incredibile." : "Un vassoio di fichi per la vigilia. Finti, ma buoni. Se ha fame, signore, ne ho un altro."]], done);
      },
      re_fiorino() {
        say([["re_fiorino", S() >= 5 ? "(Accorda il liuto.) Ho la ballata, Campione: tre strofe in più del necessario, come sempre. Ma stavolta, giuro, le strofe in più sono le più belle." : "«Cantò il bardo sui bastioni, e tutti dormirono. La Corona, intanto, no.» (Si ferma.) Non rima. Mi dispiace, non rima neanche nella vita."]], done);
      },
      re_evaristo() {
        const s = S();
        if (s < 4) return K.PASS;
        if (s === 4) return ask("re_evaristo", "(Con il fischietto d'argento in mano, che trema appena.) Campione. La Piazza è piena, le Casate sono sedute, e la Palla è sul piedistallo. Con tutto il rispetto: possiamo cominciare?", [
          { label: "Il Duello di Corona", sub: `Avversario: ${rivale().chi}`, cls: "hot", big: true, fn: gioca },
          { label: "Un momento ancora", fn: done },
        ], "re_piazza");
        return say([["re_evaristo", "Con tutto il rispetto: un Duello che finisce bene è la peggior cosa che possa capitare a un ciambellano. Non ho più niente da proibire."]], done);
      },
      re_anselmo() { say([["re_anselmo", s5() ? "(Sorride, con le ginocchia che non sente.) Bel Duello, ragazzo. Ho dormito per metà, ma la parte che ho visto era buona." : "Tra poco comincia. Non sono nervoso: alla mia età, il nervosismo è un lusso da cortigiani."]], done); },
      re_gatto() { say([["voce", "Sua Maestà Pallina è seduta sul bordo del palco e guarda la Palla con la stessa attenzione con cui guarderebbe una pallina da gatto. Qualcuno dovrebbe avvisarla."]], done); },
      re_tullio() {
        const sp = F.is("re_spia_vera");
        say([["re_tullio", sp ? "(A braccia incrociate, con un mantello nero e un'aria troppo composta.) Mio padre mi scrive in bella calligrafia da tre anni. Non ho mai risposto: i Corvi non scrivono. Ma li ho letti tutti, e stanotte ho tolto l'assedio. Non diteglielo." : "(Un uomo con un mantello nero, in fondo alla folla.) Non è il mio posto. Sono qui solo perché volevo vedere come finisce. Una partita è un buon modo di finire una guerra: lo dico io, che ne ho fatta una per sbaglio."]], done);
      },
    };
    function s5() { return S() >= 5; }

    return {
      n: N, title: "Il Duello di Corona", sub: "La Vigilia, la Cripta, la Piazza d'Armi e quattro finali", goal: () => goal(S()), start: "re_vigilia", introBg: "re_titolo", zones, patch, talk,
      intro: () => { setStep(N, 0); return [["voce", "<b>CRONACHE DEL REGNO ULTIMO</b>, capitolo 3. È la notte prima del Duello. A Castelalto nessuno ha chiuso occhio, tranne il gatto: i bracieri sono accesi, le tre Casate vegliano ai loro tavoli, e in cima ai bastioni la Principessa ti aspetta."]]; },
    };
  }
  boot();
})();
