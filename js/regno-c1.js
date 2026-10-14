// js/regno-c1.js - CRONACHE DEL REGNO ULTIMO · Capitolo 1 «Il Campione senza Stendardo»
// Castelalto, tre giorni prima del Duello di Corona. Il ciambellano spiega la regola, il vecchio re riunisce il Consiglio delle Casate,
// e il Generale mette alla prova il Campione con la Partita d'Assedio sulle mura. Poi, sulle mura, la Principessa.
(function () {
  "use strict";
  function boot() { const D = window.__regno; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    // ------------------------------------------------------------ il cast di tutta la saga (nomi inventati)
    K.cast("re_evaristo", { acc: ["occhiali", "taccuino"], name: "Evaristo Cappamagna, ciambellano", tag: "", hair: "#8a8a92", style: "ordinato", skin: "#e8c8a8", eye: "#2a2a3a", beard: false, bg: ["#3a1426", "#e8b84a"], shirt: "#5a2a4a" },
      "Il ciambellano di Castelalto: trentasei anni di cerimonie, due manuali di protocollo e un taccuino su cui annota tutto, anche le cose che non succedono. Dice «con tutto il rispetto» quando sta per essere scortese.");
    K.cast("re_fiorino", { acc: ["cappellino", "fiore"], name: "Fiorino da Tre Ponti, il Bardo", tag: "", hair: "#7a4a2a", style: "curly", skin: "#f0d0b0", eye: "#3a5a2a", beard: false, bg: ["#2a1a3a", "#e8b84a"], shirt: "#3a6a8a" },
      "Il bardo di corte. Canta le ballate del Regno con tre strofe in più del necessario, perché «i cantastorie si pagano a verso». Sa tutto di tutti, e fa finta di non saperlo solo quando gli conviene.");
    K.cast("re_mirta", { acc: ["grembiule"], name: "Mirta, detta la Gazza", tag: "", hair: "#2a2a34", style: "braids", skin: "#e8c0a0", eye: "#2a2a3a", beard: false, bg: ["#2a2a34", "#c8a040"], shirt: "#6a6a7a" },
      "La cameriera dai vassoi sempre pieni. Non ascolta mai niente, dice: è il primo requisito del mestiere. Ha lo sguardo di chi ha contato le porte di una stanza prima di entrarci.");
    K.cast("re_anselmo", { acc: ["corona"], name: "Re Anselmo il Vecchio", tag: "gold", hair: "#e8e8e8", style: "bald", skin: "#e0b890", eye: "#3a3a5a", beard: true, bg: ["#7a1f2a", "#e8c860"], shirt: "#a82a3a" },
      "Il re del Regno Ultimo. Ha ottantadue anni, un trono più alto di lui e una pazienza infinita per le cose importanti. Per le altre, un gatto.");
    K.cast("re_oriele", { acc: ["medaglia"], name: "Principessa Oriele di Castelalto", tag: "", hair: "#5a2a1a", style: "long", skin: "#f0d0b8", eye: "#3a5a8a", beard: false, bg: ["#3a1426", "#e8b84a"], shirt: "#7a1f2a" },
      "La nipote del re e sua unica erede. Parla poco e ascolta molto, che a corte è considerato un difetto. Vuole una cosa sola: che il Regno non finisca come l'Impero.");
    K.cast("re_brando", { acc: ["medaglia"], name: "Generale Brando Ferrano", tag: "gray", hair: "#6a6a72", style: "buzz", skin: "#d8b08a", eye: "#2a2a34", beard: true, bg: ["#4a5266", "#8b95ab"], shirt: "#4a5266" },
      "Capo della Casata dei Lupi. Sedici mila lance, un solo sorriso all'anno (se piove). Dice che la pace è una guerra che si è messa in ordine.");
    K.cast("re_perla", { acc: ["borsa"], name: "Dama Perla Marenghi", tag: "", hair: "#e8d8b8", style: "bun", skin: "#f0d0b0", eye: "#2a7aa8", beard: false, bg: ["#2a6a9a", "#e8e0c8"], shirt: "#2a7aa8" },
      "Capo della Casata dei Gabbiani. Settanta navi e i conti sempre in ordine. Sa il prezzo di tutto, e a volte anche il valore, che è una cosa diversa.");
    K.cast("re_cedro", { acc: ["lente"], name: "Lord Cedro Valverde", tag: "", hair: "#9a9a8a", style: "side", skin: "#e0c8a8", eye: "#3a5a3a", beard: true, bg: ["#2a5a3a", "#c8c8a0"], shirt: "#2a5a3a" },
      "Capo della Casata dei Cervi. Giurista, bibliotecario, signore di una foresta. Non dice mai «penso»: dice «secondo l'articolo».");
    K.cast("re_gatto", { shape: "gatto", name: "Sua Maestà Pallina", tag: "", hair: "#e8a860", skin: "#e8a860", eye: "#3a8a3a", bg: ["#7a1f2a", "#e8c860"], shirt: "#e8a860" },
      "Il gatto reale. Dorme sul cuscino del trono dal giorno in cui il re ha smesso di sedercisi. Nessuno sa chi comandi davvero.");
    K.cast("re_ulderico", { acc: ["bandana"], name: "Ulderico Fendivento, Campione dei Lupi", tag: "gray", hair: "#c8c8d0", style: "spiky", skin: "#e0b890", eye: "#3a4a6a", beard: false, bg: ["#4a5266", "#c8d0e0"], shirt: "#8b95ab" },
      "Il campione scelto dal Generale. Veloce, leale e poco fantasioso: con lui la strategia è «avanti».");
    ["lupi:#8b95ab:casco:buzz", "gabbiani:#38a8d8:bandana:messy", "cervi:#5aa862:cappellino:long"].forEach((s) => { const [h, c, a, st] = s.split(":"); if (K.api.CAST && !K.api.CAST["re_s_" + h]) K.api.CAST["re_s_" + h] = { tag: "", name: "Scorta di Casata", hair: "#4a3a2a", style: st, skin: "#e0b890", eye: "#2a2a2a", bg: ["#2a1426", c], shirt: c, acc: [a] }; });

    K.cos("re_c1", { kind: "shirt", label: "Cotta del Campione senza Stendardo", val: "#7a1f2a", from: "Capitolo 1 di Cronache del Regno Ultimo" });
    K.lore("l_patto", { t: "Il Patto di Cuoio", d: K.PAGINE.l_patto[1] });
    K.lore("l_castelalto", { t: "Castelalto", d: "La fortezza sulla roccia: palazzo, torri e un cortile in cui, da quando il Regno è l'ultimo, non si è mai combattuto davvero. Si è solo discusso molto, a voce alta." });

    const goal = (s) => ({
      0: "Castelalto, vigilia del Duello. Parla con il ciambellano Evaristo, nel Cortile.",
      1: "Il Re ha riunito il Consiglio delle Casate: entra nel Palazzo, nella Sala del Trono.",
      2: "Il Generale Brando ti aspetta sulle Mura (la Torre della Guardia, a sinistra): la Partita d'Assedio.",
      3: "Hai vinto la Partita d'Assedio. La Principessa è salita sulle Mura: raggiungila.",
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");
    const prima = () => F.get("re_prima", "");

    const zones = {
      re_cortile: {
        region: "cortile", name: "Castelalto · Il Cortile delle Tre Casate", short: "Cortile di Castelalto", sub: "Stendardi, banchetti e torce alla vigilia del Duello", bg: "re_cortile", time: "tramonto", travel: [16, 19], base: "+",
        w: 32, h: 22, start: [16, 19], items: [[3, 13], [28, 14], [10, 19]],
        banners: { "6,9": "lupi", "12,9": "gabbiani", "19,9": "cervi" },
        chests: { "29,8": { coins: 20, lore: "l_patto", text: "Dietro un sacco di farina c'è un rotolo di pergamena con un sigillo di cera: «Patto di Cuoio, copia di servizio». Qualcuno l'ha usato per fermare una finestra." } },
        areas: [[2, 10, 29, 12, "Il piazzale degli stendardi"], [3, 16, 28, 16, "I banchetti della vigilia"], [0, 0, 31, 21, "Il Cortile di Castelalto"]],
        flavor: { n: "L'avviso del ciambellano: «Il Duello di Corona si terrà all'alba del terzo giorno. È gradito il silenzio. È gradito anche il mutismo. Firmato: E. Cappamagna». Sotto, a matita: «Con tutto il rispetto».", F: "Una torcia di ferro, accesa tre ore prima del bisogno: a corte si accende tutto in anticipo, per non sembrare impreparati." },
        intro: [["voce", "Castelalto sorge sulla roccia come un pugno: il palazzo al centro, le torri ai lati, e davanti il Cortile delle Tre Casate, dove tre stendardi ricordano a tutti che il Regno è fatto di tre pezzi."], ["voce", "Dall'alto delle mura si sente un tamburo, lontano. Sono i Corvi di Rocca Nera, che da tre mesi assediano un angolo del Regno con molta pazienza e poche idee. Nel cortile, intanto, si apparecchia."]],
        npcs: (s) => [{ id: "re_evaristo", at: [15, 9] }, { id: "re_fiorino", at: [21, 14] }, { id: "re_mirta", at: [24, 15] }],
        links: { "16,21": ["re_strada", 15, 2] },
        build(L, K) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(14, 7, 17, 20, ":"); lay(2, 10, 29, 12, ":");
          house(9, 1, 14, 6, { door: [16, 6], roof: "#7a1f2a", wall: "#cbbfae", rr: 2, lit: 1, enter: { to: "re_trono", at: [10, 12] } });
          house(1, 2, 6, 5, { door: [4, 6], roof: "#4a4f5e", wall: "#8a8478", rr: 1, enter: { to: "re_mura", at: [2, 8] } });
          house(25, 2, 6, 5, { door: [27, 6], roof: "#854d0e", wall: "#d8c8a8", rr: 1, lit: 1, enter: "La Cucina Reale: fumo, pentole e un paiolo grande come una barca. Dalla finestra una voce urla: «Chi ha toccato il cinghiale?!». Nessuno ha toccato il cinghiale." });
          [[6, 9], [12, 9], [19, 9], [25, 9]].forEach(([x, y]) => put(x, y, "I"));
          [[13, 8], [18, 8], [13, 14], [18, 14], [3, 16], [28, 16], [3, 9]].forEach(([x, y]) => put(x, y, "F"));
          lay(4, 16, 9, 16, "K"); lay(22, 16, 27, 16, "K"); put(29, 8, "x"); put(2, 19, "s"); put(19, 19, "n"); if (K.hasChapter(2) && ((K.mem().done || {})[1])) put(16, 21, "v");
        },
      },
      re_trono: {
        interior: true, region: "sala", name: "Castelalto · La Sala del Trono", short: "Sala del Trono", sub: "Arazzi, banchetti e un gatto su un cuscino", bg: "re_trono", time: "tramonto", w: 20, h: 14, start: [10, 12], outside: ["re_cortile", 16, 7], items: [[2, 5], [17, 3], [2, 12]],
        act: { v: "Esci", V: "Guarda il trono" },
        flavor: { V: "Il trono di Castelalto: schienale altissimo, cuscino cremisi, un'impronta di zampa al centro. Il re dice che l'ultimo che ci si è seduto sopra era un cuoco. Nessuno ha il coraggio di chiedere se scherzasse.", A: "Un arazzo con le tre Casate che si danno la mano. L'arazzista, per prudenza, ha lasciato i volti in bianco.", K: "Un banchetto apparecchiato per quaranta e ordinato per cinquanta: a corte non si sbaglia mai per difetto.", F: "Una torcia da parete. Sopra, un cartello: «Non appoggiare gli arazzi».", Y: "" },
        intro: [["voce", "La Sala del Trono: soffitto a travi, arazzi lunghi quattro metri, due file di tavoli per un banchetto che nessuno ha ancora il coraggio di cominciare. In fondo, il trono. Sul trono, un gatto."]],
        npcs: (s) => [{ id: "re_anselmo", at: [10, 3] }, { id: "re_gatto", at: [11, 3] }, { id: "re_oriele", at: [8, 4] }, { id: "re_brando", at: [4, 5] }, { id: "re_perla", at: [15, 5] }, { id: "re_cedro", at: [15, 7] }, { id: "re_mirta", at: [7, 11] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 13, "+"); lay(0, 0, 19, 0, "a"); lay(0, 0, 0, 13, "a"); lay(19, 0, 19, 13, "a"); lay(0, 13, 19, 13, "a");
          lay(9, 2, 10, 12, '"'); put(10, 13, "v"); put(10, 1, "V"); [3, 6, 13, 16].forEach((x) => put(x, 0, "A"));
          [[7, 3], [12, 2]].forEach(([x, y]) => put(x, y, "F")); lay(3, 8, 6, 8, "K"); lay(3, 10, 6, 10, "K"); lay(13, 9, 16, 9, "K"); lay(13, 11, 16, 11, "K");
        },
      },
      re_mura: {
        interior: true, region: "cortile", name: "Castelalto · Le Mura d'Assedio", short: "Mura di Castelalto", sub: "Balestre, fuochi nemici e un Generale che non sorride", bg: "re_mura", time: "notte", w: 26, h: 10, start: [2, 8], outside: ["re_cortile", 4, 7], items: [[24, 3], [10, 7]], base: "+",
        act: { v: "Scendi le scale", J: "Guarda la balista" },
        flavor: { J: "Una balista da assedio: tre metri di legno e corda, puntata verso il campo dei Corvi. Qualcuno ha scritto sul calcio, in bella calligrafia: «Non è un giocattolo».", F: "Una torcia da ronda, che con il vento fa un rumore da bandiera.", z: "Sacchi di sabbia e barili di pece. Il Generale conta ogni barile ogni sera, per sport." },
        intro: [["voce", "Il camminamento di ronda: pietra fredda, merli, il vento di una notte che profuma di fumo. Oltre il parapetto, nel buio, brillano i fuochi dei Corvi di Rocca Nera, uno ogni dieci passi, ordinatissimi."]],
        npcs: (s) => [{ id: "re_brando", at: [13, 4] }, ...(s >= 3 ? [{ id: "re_oriele", at: [22, 5] }] : [])],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 25, 9, "a"); lay(1, 2, 24, 8, "+"); put(2, 9, "v");
          [6, 12, 18, 23].forEach((x) => put(x, 2, "J")); [4, 9, 15, 21].forEach((x) => put(x, 2, "F")); put(20, 8, "z"); put(21, 8, "z");
        },
      },
    };

    // ------------------------------------------------------------ dialoghi
    const BRANDO_INFO = [["re_oriele", "Brando non vuole la Corona. Vuole che i suoi soldati abbiano una casa quando la guerra finirà. Sedici mila lance, e nessuna terra da arare."]];
    const talk = {
      re_evaristo() {
        const s = S();
        const menu = () => ask("re_evaristo", "[pensa] Posso offrirle altre informazioni, Campione. Tutte con tutto il rispetto.", [
          { label: "Che cos'è il Patto di Cuoio?", sub: "Un po' di storia, e una cosa che quasi nessuno sa", fn: () => { F.set("re_info_cervi", true); say([["re_evaristo", "Il Patto è la legge del Regno: tredici articoli scritti su cuoio, perché la carta, dice la tradizione, brucia più in fretta della pazienza. Lord Cedro lo conosce a memoria. Il primo articolo dice che nessuno possiede la Palla: chi la porta, la porta per tutti."], ["re_evaristo", "[furbo] Mi permetto un'osservazione, che non ho mai fatto in pubblico: il Patto, da nessuna parte, dice cosa succede se i duellanti sono tutti d'accordo. È un buco di legge. Lord Cedro ci pensa da vent'anni, e ne parla solo la notte."]], menu); } },
          { label: "Come funziona il Duello di Corona?", sub: "Tre tempi, il Consiglio nell'intervallo", fn: () => say([["re_evaristo", "Tre tempi sulla Piazza d'Armi. In ogni tempo una carica per parte: voi correte al portone, poi difendete il vostro. Tra un tempo e l'altro si riunisce il Consiglio delle Casate, e lì si perde più facilmente che in campo."], ["re_evaristo", "Le Casate prestano i loro poteri a chi ha il loro favore: l'Ariete dei Lupi, la Marea dei Gabbiani, l'Occhio dei Cervi. Dal menu, alla voce «Le Casate», vedete come state messi. Non è necessario piacere a tutti. È necessario non dispiacere a tutti insieme."]], menu) },
          { label: "Vado", fn: done },
        ], "re_cortile");
        if (s === 0) return say([
          ["re_evaristo", "[sospira] Il Campione senza Stendardo. Lo scrivo con la maiuscola, perché è una carica, e con la minuscola nel cuore, perché è un guaio."],
          ["hero", "Mi hanno detto che qui si gioca una partita per decidere chi comanda."],
          ["re_evaristo", "Con tutto il rispetto: è più complicato, e anche più ridicolo. Dopo la caduta dell'Impero dei Cento Troni restano un re di ottantadue anni, una Principessa e tre Casate che si odiano con molta educazione: i Lupi del Nord, i Gabbiani del Porto, i Cervi del Bosco."],
          ["re_evaristo", "Per non farsi la guerra, ottant'anni fa decisero che ogni disputa si sarebbe giocata a pallone, sulla Piazza d'Armi, con la Palla del Giuramento. Il Duello di Corona. Chi gioca per la Corona non porta i colori di nessuna Casata: così nessuno vince per sé. Da qui, il Campione senza Stendardo."],
          ["re_evaristo", "[pensa] Lei è stato scelto perché nessuno la conosce. È un complimento. Credo."],
          ["re_evaristo", "Il Re ha convocato il Consiglio nella Sala del Trono. Il Palazzo è lì, in fondo al viale. Non si inchini troppo: il re non lo sopporta, e il gatto nemmeno."],
        ], () => { setStep(N, 1); quest("re_cons", "Il Consiglio delle Casate", "Presentati al Re nella Sala del Trono."); menu(); });
        return menu();
      },
      re_fiorino() {
        const menu = () => ask("re_fiorino", "[felice] Una ballata, un'informazione, o tutte e due? Sono pagato a verso: la seconda costa meno.", [
          { label: "Cantami la storia del Regno", sub: "Tre strofe in più del necessario", fn: () => { K.learnLore("l_castelalto"); say([["re_fiorino", "(Accorda il liuto, che si accorda da solo per educazione.) «Cadde l'Impero dei Cento Troni, e i cento troni si fecero legna; tre generali si guardarono, e uno disse: giochiamo.»"], ["re_fiorino", "«Venne un cuoco con un pallone, e disse: la corona è qui dentro. Nessuno gli credette, ma tutti giocarono.» (Si ferma.) Qui il testo originale finisce, e si dice che l'ultima strofa la sappia solo il re. In realtà me la sono dimenticata io, ma non lo dica."]], menu); } },
          { label: "Che cosa sai dei Gabbiani?", sub: "Un cantastorie sa sempre qualcosa", fn: () => { F.set("re_info_gabbiani", true); say([["re_fiorino", "Dama Perla? (Abbassa la voce.) Ha settanta navi e un solo rimpianto: la settantunesima, partita vent'anni fa con il suo sposo e mai tornata. Dicono che sia l'unica cosa che non si possa contare."], ["re_fiorino", "[pensa] Se vuole l'amicizia dei Gabbiani, non le offra niente: le dica la verità sui conti. È l'unica moneta che non ha mai incassato in vita sua."]], menu); } },
          { label: "A dopo", fn: done },
        ], "re_cortile");
        return menu();
      },
      re_mirta() {
        const s = S();
        say([[s >= 3 ? "re_mirta" : "re_mirta", s === 0 ? "[sorpreso] (Si ferma con un vassoio di fichi, che sono fuori stagione.) Non ho sentito niente, signore. Non ascolto mai: è il primo requisito del mestiere. Se vuole un fico, sono finti. Ma buoni." : s <= 2 ? "I vassoi hanno le orecchie, signore: io sono solo quella che li porta. (Sposta una brocca di mezzo centimetro, per niente.)" : "Un bel Duello, quello sulle mura. Dall'altra parte del cortile si sentivano i fuochi dei Corvi. E anche altro: da un tetto, in fondo, qualcuno ha fischiato due note. Non so chi."]], done);
      },
      re_anselmo() {
        const s = S();
        if (s === 0) return say([["re_anselmo", "[ride] Non hai ancora parlato col ciambellano, vero? Ha il vizio di spiegare le cose prima del Re. Va' da lui: io aspetto. Alla mia età, aspettare è un'attività a tempo pieno."]], done);
        if (s === 1) {
          return say([
            ["voce", "Il Consiglio delle Casate è già in sala: il Generale Brando in piedi come una statua di sé stesso, Dama Perla con un registro, Lord Cedro con tre libri e uno sguardo da biblioteca. La Principessa Oriele è accanto al trono. Sul trono, il gatto."],
            ["re_anselmo", "[ride] Alzati, ragazzo. In questa sala si inginocchiano tutti, ma io non sento più le ginocchia, quindi mi risparmio la scena."],
            ["re_anselmo", "Sono vecchio e sto per morire: non ancora, ma con comodo, come tutto quello che faccio. Il Regno Ultimo ha bisogno di qualcuno che lo guidi quando non ci sarò più. Il Patto dice che lo si decide con il Duello di Corona, all'alba del terzo giorno. Oriele è mia nipote, e io sono di parte, quindi non conto."],
            ["re_brando", "[arrabbiato] La Corona spetta a chi sa difenderla. Io ho sedicimila lance."],
            ["re_perla", "La Corona spetta a chi sa mantenerla. Io ho settanta navi, e i conti in ordine."],
            ["re_cedro", "La Corona spetta a chi sa leggerla. Secondo l'articolo nove, e salvo errori, io ho ragione. Gli errori, in genere, sono altrui."],
            ["re_oriele", "[triste] E io ho una zia che mi dice sempre che ho gli occhi di mio nonno. (Pausa.) Non sono sicura sia un argomento."],
            ["voce", "In fondo alla sala, una cameriera inciampa: una coppa d'argento rotola sul tappeto con un tintinnio che arriva fino al soffitto. Nessuno si volta. Oriele sì."],
            ["re_anselmo", "Tu giochi per la Corona senza stendardo, ragazzo: nessuno ti ha scelto, nessuno ti deve niente. Per questo ti ho voluto. Ma tre Casate dovranno fidarsi di te, e la fiducia, quando non c'è niente da dare, si compra con l'attenzione."],
          ], () => ask("re_anselmo", "Le tre Casate hanno già chiesto di parlarti. A chi concedi la prima risposta?", [
            { label: "Al Generale Brando", sub: "I Lupi: favore +1", fn: () => { F.set("re_prima", "lupi"); K.dai("lupi", 1); say([["re_brando", "(Annuisce, con la precisione di un chiodo.) Bene. Ti aspetto sulle Mura: la Torre della Guardia, a sinistra del Cortile. Voglio vedere le tue gambe, prima di vedere le tue idee."]], fine1); } },
            { label: "A Dama Perla", sub: "I Gabbiani: favore +1", fn: () => { F.set("re_prima", "gabbiani"); K.dai("gabbiani", 1); say([["re_perla", "(Chiude il registro.) Un cliente educato. Il Generale vorrà metterti alla prova sulle Mura: la Torre della Guardia, a sinistra del Cortile. Valuta bene prima di sudare: è la sola moneta che il Generale accetta."]], fine1); } },
            { label: "A Lord Cedro", sub: "I Cervi: favore +1", fn: () => { F.set("re_prima", "cervi"); K.dai("cervi", 1); say([["re_cedro", "(Chiude il libro sul dito.) Secondo l'articolo quattro, il primo ad essere ascoltato ha diritto di essere ricordato. Mi permetto di ricordarglielo. Il Generale vi attende sulle Mura: la Torre della Guardia, a sinistra del Cortile."]], fine1); } },
          ], "re_trono"));
        }
        return say([["re_anselmo", s === 2 ? "Il Generale ti aspetta sulle Mura, ragazzo. Non farlo aspettare: ha un solo modo di essere paziente, ed è irritarsi in silenzio." : "Hai vinto una partita contro i Corvi. Per me è una buona notizia. Per i Corvi, una bozza di cattiva."]], done);
        function fine1() { setStep(N, 2); quest("re_assedio", "La Partita d'Assedio", "Raggiungi il Generale Brando sulle Mura (Torre della Guardia, a sinistra del Cortile)."); done(); }
      },
      re_gatto() { say([["voce", "Sua Maestà Pallina ti guarda con l'aria di chi ha già deciso e sta solo aspettando che gli altri lo capiscano. Un orecchio si gira verso il Generale. Poi verso Dama Perla. Poi verso Lord Cedro. Poi, per tutti e tre, sbadiglia."]], done); },
      re_oriele() {
        const s = S();
        if (s < 3 || !K.inZone("re_mura")) return say([["re_oriele", s <= 1 ? "[pensa] (Parla piano, senza muovere le labbra più del necessario.) Quando c'è un re vecchio e tre Casate, i muri hanno le orecchie. Non solo i muri: anche i vassoi." : "Le Mura sono dall'altra parte del Cortile, a sinistra. Il Generale ha detto che, se vinci, mi sarò più simpatica. Non so se sia un complimento."]], done);
        const menu = () => ask("re_oriele", "(Guarda i fuochi dei Corvi, tutti in fila.) Quella partita… Hai un bel modo di correre, Campione. Ce l'avevi già, o l'hai trovato qui?", [
          { label: "Come stai, Altezza?", sub: "La fiducia di Oriele cresce", fn: () => { if (!F.is("re_ori_1")) { F.set("re_ori_1", true); bond("fiducia", 1); } say([["re_oriele", "[triste] Come una che ha tre giorni per diventare un'altra persona. (Sorride poco.) Grazie di averlo chiesto: ai Consigli nessuno chiede a nessuno come sta. Si chiede cosa ne pensa."]], menu); } },
          { label: "Che cosa vuole davvero Brando?", sub: "Una cosa che quasi nessuno sa", fn: () => { F.set("re_info_lupi", true); say([...BRANDO_INFO, ["re_oriele", "Me l'ha detto una notte, per sbaglio, davanti a una zuppa. Se vincessi io, glielo concederei volentieri. Se vincesse lui, mi servirebbe una vittoria più grande, per rimediare."]], menu); } },
          { label: "Finiamo la giornata", sub: "Il capitolo si conclude", cls: "hot", fn: chiudi },
        ], "re_mura");
        return menu();
        function chiudi() {
          questDone("re_assedio"); K.reward("c1", { coins: 80, cos: ["re_c1"] }); K.learnLore("l_castelalto", true);
          finishChapter(1, "stendardo"); setStep(N, 5);
          K.scene([
            ["re_oriele", "(Ti porge un nastro bianco, ricamato a mano.) Non è uno stendardo. Non vuoi stendardi, e non puoi averne. Ma questo si porta sotto la cotta, dove nessuno lo vede, e dove si ricorda."],
            ["re_fiorino", "(Dal fondo del camminamento, accordando il liuto.) «Salì sulle mura il Campione senza bandiera, e disse: non porto colori, porto la palla.» Non rima, ma verrà."],
            ["voce", `<b>CAPITOLO 1 CONCLUSO.</b> Hai superato la prova delle Mura, e il Regno ha cominciato ad accorgersi di te. Le tre Casate ora ti aspettano a casa loro. <br><span style="color:var(--dim)">Ricompensa: monete e la Cotta del Campione senza Stendardo (Guardaroba).</span>`],
          ], () => K.openMain(), "re_mura");
        }
      },
      re_brando() {
        const s = S();
        if (s < 2) return say([["re_brando", s === 0 ? "(Non ti guarda.) Il Campione. Con tutto il rispetto di cui sono capace, cioè poco, e solo per il Re." : "Sulle Mura, senza chiacchiere. Quando hai finito di salutare tutti."]], done);
        if (s === 2) {
          return say([
            ["re_brando", "[arrabbiato] Il Campione senza Stendardo. Le gambe le hai? Sulle Mura serve più la testa, ma le gambe, a volte, sono la testa."],
            ["re_brando", "Quei fuochi sono i Corvi di Rocca Nera: un capobanda che da tre mesi si siede a tre tiri di balestra dalle mie mura e dice che vuole il pane. Io dico che vuole il trono. A pallone, il Regno ha sempre deciso. Gioca la Partita d'Assedio: se vinci tu, i Corvi tolgono il campo."],
            ["re_brando", "Regola del Duello: in campo si corre, si salta e si legge il gioco. Nell'intervallo, il Consiglio ti offre qualcosa da mangiare. Pensaci prima di mordere."],
          ], () => ask("re_brando", "Giochi la Partita d'Assedio sotto le Mura?", [
            { label: "Gioca la Partita d'Assedio", sub: "Duello di Corona · partita forzata", cls: "hot", fn: gioca },
            { label: "Non ancora", fn: done },
          ], "re_mura"));
        }
        return say([["re_brando", "[felice] Hai vinto. (Si schiarisce la voce.) Non sorrido mai, quindi immagina che l'abbia fatto. Il Regno ha un Campione. Vedremo se ha anche un Re."]], done);
        function gioca() {
          K.coronaMatch({
            title: "Partita d'Assedio · Mura di Castelalto", us: "Il Campione senza Stendardo", intro: "Sotto le Mura, i Corvi di Rocca Nera sfidano il Regno. Se perdono, tolgono l'assedio. Tre tempi, una carica a testa.",
            opp: { name: "I Corvi di Rocca Nera", color: "#3a2a40", style: "pressing" }, tempi: 3,
            council: [
              { q: "Intervallo. Dalle Mura il Generale Brando ti manda un boccale d'orzo («per i muscoli») e, dalla torre accanto, Dama Perla una focaccia al rosmarino («per l'umore»). Entrambi guardano cosa scegli.", opts: [
                { label: "Il boccale del Generale", sub: "Favore ai Lupi · i Gabbiani si offendono un po'", fav: { lupi: 1, gabbiani: -1 }, say: "Brando annuisce, in silenzio. Per lui è un contratto." },
                { label: "La focaccia di Dama Perla", sub: "Favore ai Gabbiani · i Lupi si offendono un po'", fav: { gabbiani: 1, lupi: -1 }, say: "Perla sorride, alza due dita e segna qualcosa sul registro." },
                { label: "Entrambi, a metà ciascuno", sub: "Nessuno si offende; Lord Cedro prende nota", fav: { cervi: 1 }, say: "Dalla terza torre, Lord Cedro scrive sul taccuino: «Equilibrio. Notevole, in un soldato.»" },
              ] },
              { q: "Secondo intervallo. Sulle Mura qualcuno ha attaccato un cartello: «Il Campione senza Stendardo gioca per chi?». Il ciambellano Evaristo gira i tacchi e finge di non aver visto.", opts: [
                { label: "«Per il Regno»", sub: "Favore ai Cervi", fav: { cervi: 1 }, say: "Un coro stonato risponde dalle Mura: il Regno, per ora, è uno solo. Lord Cedro tossisce, commosso." },
                { label: "«Per chi mi tiene al caldo»", sub: "Favore ai Gabbiani", fav: { gabbiani: 1 }, say: "La Dama del Porto ride per la prima volta in tre giorni: un suono breve, tipo una cassa che si chiude." },
                { label: "«Per chi mi tiene alla larga dai guai»", sub: "Favore ai Lupi", fav: { lupi: 1 }, say: "Brando, dalla balista, alza un pugno: per lui è praticamente un abbraccio." },
              ] },
            ],
          }, (r) => {
            if (r && r.win) { setStep(N, 3); questDone("re_assedio"); quest("re_orie", "La Principessa sulle Mura", "Oriele ti aspetta in fondo al camminamento."); say([["re_brando", "[felice] Hai gambe, e una testa, che è più raro. I Corvi tolgono il campo domattina: è la prima volta che un assedio finisce per una partita ben giocata. Dormirò peggio, ma più contento."], ["voce", "In fondo al camminamento, sotto l'ultima torcia, una figura con il mantello rosso guarda i fuochi dei Corvi spegnersi, uno alla volta."]], done); }
            else say([["re_brando", "(Chiude gli occhi.) Hai perso. I Corvi ridono, io no. Riprova: stavolta guardati i fossati."]], done);
          });
        }
      },
      re_perla() { say([["re_perla", K.liv("gabbiani") >= 2 ? "Un amico. Mi costa dirlo, ma sei un buon affare. Se perdi, ti rimborso la sconfitta: è un modo di dire, non una promessa." : "(Gira una pagina del registro.) Tutto ha un prezzo, Campione. Il difficile è capire chi lo paga."]], done); },
      re_cedro() { say([["re_cedro", K.liv("cervi") >= 2 ? "Secondo l'articolo sette, gli amici si scelgono con calma. Mi permetto di anticipare il verdetto: lei, per ora, mi è simpatico. Da archiviare con riserva." : "(Alza gli occhi dal libro, a metà frase.) Giovanotto, un consiglio: legga il Patto. Poi lo rilegga. Poi lo legga ai Lupi, a voce alta, e li guardi in faccia."]], done); },
    };
    return {
      n: N, title: "Il Campione senza Stendardo", sub: "Castelalto, il Re, il Consiglio e la Partita d'Assedio", goal: () => goal(S()), start: "re_cortile", introBg: "re_titolo", zones, talk,
      intro: () => { setStep(N, 0); return [["voce", "<b>CRONACHE DEL REGNO ULTIMO</b>, capitolo 1. Quando l'Impero cadde, nessuno ebbe il coraggio di dire «e adesso?». Restò un solo regno, l'ultimo: tre Casate, un re vecchissimo e una regola assurda. Tu arrivi a Castelalto tre giorni prima del Duello, senza un titolo e, per legge, senza uno stendardo."]]; },
    };
  }
  boot();
})();
