// js/razzo-c1.js - RAZZOPACCO · CONSEGNE DAL FUTURO · Capitolo 1 «Scongelato»
// Il Campione si risveglia in una cella criogenica di Nova Frattaglia, anno 3011. Un robot postino lo scongela per sbaglio
// (cercava un ghiacciolo). L'unico lavoro per cui ha «esperienza»: corriere alla Razzopacco, dall'altra parte del canale di
// neon. Ci si arriva solo coi tubi pneumatici. Prima consegna a tempo, poi la sfida della OmniPacco.
(function () {
  "use strict";
  function boot() { const D = window.__razzo; if (!D || !D.addChapter) return setTimeout(boot, 120); D.addChapter(chapter1); }
  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);
    K.cast("rz_ferruccio", { shape: "robot", acc: ["cappellino"], name: "Ferruccio, robot postino", tag: "", hair: "#c8a040", skin: "#a8b0c0", eye: "#ff5a5a", bg: ["#1a1030", "#c8a040"], shirt: "#ff8a3a" },
      "Robot postino della Razzopacco, modello FR-11, anno di fabbricazione 2987. Sogna di fare il telecronista sportivo: commenta tutto quello che succede, anche quando nessuno glielo chiede. Ti ha scongelato per sbaglio. Cercava un ghiacciolo al limone.");
    K.cast("rz_ottavia", { acc: ["occhiali", "lente"], name: "Professoressa Ottavia Bollicini", tag: "gray", hair: "#f4f4f4", style: "bun", skin: "#f0d8c0", eye: "#5a8a3a", bg: ["#1a1030", "#9af0c8"], shirt: "#e8f4f0" },
      "Centosessantadue anni, inventrice e proprietaria della Razzopacco. Ha inventato il tubo pneumatico interplanetario, la spremuta di cometa e il forno a gravità zero (che non funziona). Si mantiene giovane bevendo spremuta di cometa. Dice di sì a tutto e poi chiede «cosa ho detto di sì?».");
    K.cast("rz_borea", { acc: ["cuffie"], name: "Capitana Borea", tag: "", hair: "#5a2a8a", style: "ponytail", skin: "#c68642", eye: "#3a2a1a", bg: ["#1a1030", "#c8a8ff"], shirt: "#2a2a4a" },
      "La pilota del razzo della Razzopacco. Ex portiera della Lega Orbitale: ha parato un asteroide, una volta, e ne va fiera. Calma, precisa, stufa. Ha un solo sogno: un giorno di lavoro in cui niente prenda fuoco.");
    K.cast("rz_timbro", { shape: "blob", acc: ["occhiali"], name: "Ragionier Timbro", tag: "", hair: "#3a8a6a", skin: "#7ad8a8", eye: "#1a1a1a", bg: ["#1a1030", "#7ad8a8"], shirt: "#3a8a6a" },
      "Il contabile della Razzopacco, un alieno gelatinoso del sistema di Bùrocra. Ama i moduli, i timbri e le ricevute in triplice copia. Quando è felice, diventa verde più chiaro. Non è mai stato verde più chiaro.");
    K.cast("rz_plof", { shape: "blob", acc: "", name: "Il Signor Plof", tag: "", hair: "#ff8ac8", skin: "#ffb0d8", eye: "#1a1a1a", bg: ["#1a1030", "#ff8ac8"], shirt: "#ff5aa8" },
      "Cliente affezionato del Bar Orbitale: una medusa elegante che ordina pacchi in continuazione e non ne apre mai nessuno. Dice che il bello è l'attesa.");
    K.cast("rz_zeta", { acc: ["occhiali"], name: "Agente Zeta della OmniPacco", tag: "", hair: "#1a1a1a", style: "slick", skin: "#e8d0c0", eye: "#5a6ad8", bg: ["#1a1030", "#5a6ad8"], shirt: "#c8d0ff" },
      "Impiegato modello della OmniPacco: giacca a specchio, sorriso a specchio, cartellino a specchio. Compra ditte piccole per conto di Orsola Monòpoli. Ha un'offerta per tutto. Anche per te.");
    K.cos("rz_c1", { kind: "shirt", label: "Tuta da corriere Razzopacco", val: "#ff8a3a", from: "Capitolo 1 di Razzopacco · Consegne dal Futuro" });
    K.cos("rz_stamps", { kind: "acc", label: "Berretto da corriere", val: "cappellino", from: "Trova i francobolli spaziali della Razzopacco" });
    K.lore("l_tubi", { t: "I tubi pneumatici", d: "A Nova Frattaglia non si cammina: si viaggia nei tubi. Ti metti davanti alla stazione d'ottone, entri e vieni sparato in una capsula di vetro sopra canali, case e strade. Il tubo fa «fssst». Tutti dicono di esserci abituati." });
    K.lore("l_consegna", { t: "Consegna a Rete", d: "Lo sport di corrieri del 3011. Il pallone è un pacco, i giocatori sono razzetti. Tocca dove vuoi volare; col pacco a bordo LANCIA lo spara dove stai andando. I pianeti attirano il pacco e curvano i lanci: la linea gialla mostra la curva. I tubi ti portano dall'altra parte, gli asteroidi ti fanno perdere il pacco. Pacco intatto in porta: consegna perfetta." });
    const goal = (s) => ({
      0: "Sei in una cella criogenica. Un robot ti guarda. Ti chiede se sei un ghiacciolo.",
      1: "Un lavoro: la Razzopacco, oltre il canale di neon. Ci si arriva solo col tubo pneumatico.",
      2: "Prima consegna: il pacco per il Signor Plof, al Bar Orbitale sulla piattaforma a sud. Col tubo, e in fretta.",
      3: "Davanti alla Razzopacco c'è un signore con la giacca a specchio. Vuole sfidarvi.",
      4: "Avete battuto la OmniPacco Express. La Professoressa ha un contratto per te.",
    }[s] || "Il primo capitolo è concluso. Puoi continuare con il Capitolo 2.");
    const zones = {
      rz_crio: {
        interior: true, region: "interno", name: "Razzopacco · Il Criogenico Municipale", short: "Il Criogenico", sub: "Celle frigorifere, brina, un robot", bg: "rz_crio", w: 16, h: 12, start: [7, 8], outside: ["rz_citta", 4, 6],
        act: { P: "Guarda le celle", K: "Guarda i pacchi", v: "Esci" },
        flavor: { P: ["Una cella criogenica. Etichetta: «Sig. Vattelapesca, 2031. Da scongelare quando inventano i calzini che non si perdono».", "Una cella vuota. La tua. Dentro c'è ancora l'impronta della tua testa nella brina.", "Una cella con dentro un cane. Etichetta: «Scongelare solo con biscotto»."] },
        intro: [["voce", "Freddo. Molto freddo. Poi una luce, un ronzio, una voce metallica che dice: «Ghiacciolo al limone, gusto originale»."], ["voce", "Apri gli occhi. Non sei un ghiacciolo. Sei in una cella frigorifera. E il calendario sul muro dice: 3011."]],
        npcs: (s) => (s === 0 ? [{ id: "rz_ferruccio", at: [9, 6] }] : []),
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); [2, 4, 6, 9, 11, 13].forEach((x) => put(x, 2, "P")); put(2, 6, "P"); put(13, 6, "P"); put(3, 9, "K"); put(12, 9, "K"); },
      },
      rz_citta: {
        region: "citta", name: "Razzopacco · Nova Frattaglia", short: "Nova Frattaglia", sub: "Il canale di neon, i tubi, la Razzopacco, il Bar Orbitale", bg: "rz_citta", time: "tramonto", travel: [26, 9],
        w: 34, h: 24, start: [4, 6], itemCos: "rz_stamps", items: [[2, 21], [31, 12], [20, 22]],
        areas: [[18, 17, 32, 22, "La piattaforma del Bar Orbitale"], [18, 1, 32, 15, "Il quartiere della Razzopacco"], [0, 0, 33, 23, "Nova Frattaglia"]],
        flavor: { t: "Un albero sintetico: le foglie si accendono quando qualcuno passa. Le tue si accendono un po' meno.", l: "Un lampione che ti saluta per nome. Sbaglia il nome." },
        intro: [["voce", "Nova Frattaglia, anno 3011. Il cielo è viola, il canale è di neon liquido, e sopra ogni cosa corrono tubi di vetro che fanno «fssst». Dentro i tubi, capsule. Dentro le capsule, gente che va al lavoro."], ["voce", "Nessuno cammina più di dieci metri, qui. Per attraversare il canale c'è solo il tubo: la stazione d'ottone è là, vicino all'acqua."]],
        tubes: [
          { at: [12, 10], path: [[14, 8], [19, 8]], out: [20, 10] },
          { at: [19, 12], path: [[17, 13.5], [14, 13.5]], out: [12, 12] },
          { at: [21, 14], path: [[21, 16], [24, 16.5]], out: [24, 19], when: (K) => K.stepOf(1) >= 2, shut: "Il tubo per il Bar Orbitale. Cartello: «Solo per clienti e corrieri». Non sei ancora né l'uno né l'altro." },
          { at: [19, 21], path: [[19, 16]], out: [19, 13] },
        ],
        npcs: (s) => [...(s >= 1 ? [{ id: "rz_ferruccio", at: s >= 2 ? [8, 12] : [6, 7] }] : []), { id: "rz_plof", at: [22, 20] }, ...(s === 3 ? [{ id: "rz_zeta", at: [26, 12] }] : [])],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a"); lay(0, 23, 33, 23, "a");
          lay(15, 1, 17, 22, "w"); lay(18, 16, 32, 16, "w");
          lay(4, 6, 4, 12, ":"); lay(4, 10, 13, 12, ":"); lay(2, 13, 4, 21, ":"); lay(18, 6, 31, 6, ":"); lay(20, 7, 20, 14, ":"); lay(18, 17, 32, 22, "_");
          house(2, 2, 6, 4, { door: [4, 5], roof: "#7ad8ff", wall: "#c8d8f0", rr: 2, enter: { to: "rz_crio", at: [7, 9] } });
          house(9, 2, 4, 3, { door: [10, 4], roof: "#ff5aa8", wall: "#3a3a5a", rr: 1, enter: "L'edicola dei robot: riviste di bulloni, figurine di satelliti, un giornale che si legge da solo ad alta voce. Il titolo di oggi: «OMNIPACCO COMPRA ANCHE IL LUNEDÌ»." });
          house(19, 2, 6, 4, { door: [21, 5], roof: "#ff8a3a", wall: "#e8d8c0", rr: 2, enter: { to: "rz_sede", at: [7, 9] } });
          house(27, 2, 5, 3, { door: [29, 4], roof: "#c8a040", wall: "#5a5a7a", rr: 1, enter: "L'hangar della Razzopacco: un razzo arancione con tre toppe, una scala a pioli, una gallina meccanica che fa la guardia. Sul fianco, a mano: «CONSEGNIAMO TUTTO. PRIMA O POI»." });
          house(27, 18, 5, 3, { door: [29, 20], roof: "#ff8ac8", wall: "#2a2a4a", rr: 1, enter: "Il Bar Orbitale: bancone di vetro, sgabelli che galleggiano, un barista con sei braccia che fa sei cappuccini insieme. Specialità: il cornetto a gravità zero (si mangia di lato)." });
          lay(28, 8, 31, 9, "U"); put(12, 10, "O"); put(19, 12, "O"); put(21, 14, "O"); put(19, 21, "O");
          [[8, 14], [25, 9]].forEach(([x, y]) => put(x, y, "A")); put(30, 13, "Y"); put(25, 7, "K"); put(26, 7, "K"); put(3, 12, "s");
          [[7, 17], [11, 19], [13, 15], [10, 7], [31, 11]].forEach(([x, y]) => put(x, y, "t")); [[6, 9], [23, 11], [24, 21]].forEach(([x, y]) => put(x, y, "l"));
        },
      },
      rz_sede: {
        interior: true, region: "interno", name: "Razzopacco · La sede", short: "La Razzopacco", sub: "Pacchi, moduli, la Professoressa", bg: "rz_sede", w: 16, h: 12, start: [7, 9], outside: ["rz_citta", 21, 6],
        act: { K: "Guarda i pacchi", T: "Guarda il tavolo", L: "Guarda gli scaffali", v: "Esci" },
        flavor: { T: "Il tavolo delle riunioni: una mappa stellare, tre tazze di spremuta di cometa, un modulo di Timbro con scritto «RIUNIONE: SÌ / NO / FORSE (barrare)».", L: "Scaffali di invenzioni della Professoressa: il cucchiaio che si raffredda da solo, l'ombrello per la pioggia di meteore, il «Tostapane del Tempo» (tosta il pane di ieri)." },
        intro: [["voce", "La sede della Razzopacco: pacchi fino al soffitto, un tubo pneumatico che sputa fogli, una pianta carnivora che mangia solo ricevute. Sulla porta: «Si assume. Qualsiasi cosa. Davvero»."]],
        npcs: () => [{ id: "rz_ottavia", at: [7, 4] }, { id: "rz_timbro", at: [12, 6] }, { id: "rz_borea", at: [3, 6] }],
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(7, 11, "v"); lay(1, 1, 14, 1, "L"); lay(5, 6, 9, 6, "T"); [[1, 9], [2, 9], [13, 9], [14, 9], [14, 3]].forEach(([x, y]) => put(x, y, "K")); },
      },
    };
    function matchExpress() {
      K.consegnaMatch({ title: "Consegna a Rete · Contro la OmniPacco Express", oppStyle: "equilibrata", secs: 100, minutes: 60,
        opp: { name: "OmniPacco Express", color: "#5a6ad8", players: [{ name: "Agente Zeta" }, { name: "Agente Ypsilon" }], keeper: { name: "Il Drone Z-0" } },
        intro: "<p>La prima partita: la OmniPacco Express gioca ordinata. Prova a <b>curvare</b> un lancio attorno al pianeta arancione, o a passare nel <b>tubo</b> in alto per sbucare in basso.</p>", winTitle: "CONSEGNA RIUSCITA!" }, (r) => {
        if (!r.win) return K.scene([["rz_zeta", "[furbo] (Si sistema la giacca a specchio.) Peccato. La OmniPacco ringrazia per la partecipazione. Riprovate, se volete: noi abbiamo tempo. Il tempo è nostro. L'abbiamo comprato."]], () => K.enterZone("rz_citta"), "rz_citta");
        setStep(N, 4); K.learnLore("l_consegna"); bond("ditta", 2);
        K.scene([["rz_ferruccio", "[felice] E LA RAZZOPACCO VINCE! Che consegna, signore e signori! Che curva! Il pianeta arancione non se l'aspettava! (Pausa.) Mi scusi. Mi capita."], ["rz_zeta", "[sorpreso] (Il sorriso a specchio si incrina appena.) Interessante. Orsola Monòpoli vorrà saperlo. (Ti porge un biglietto da visita: a specchio.) Ci rivedremo alla Coppa dei Corrieri."]], () => K.enterZone("rz_citta"), "rz_citta");
      });
    }
    function robot() { // la partita secondaria: la modalità la scegli tu
      const after = (r) => K.scene([["rz_ferruccio", r && r.win ? "[felice] VITTORIA! (Si gira la testa di 360 gradi per la gioia.) Lo scriverò nel mio diario di bordo. Alla voce «giorni belli». È la prima voce." : "[ride] Abbiamo perso, ma con stile. Lo stile è l'unica cosa che non si consegna."]], () => K.enterZone("rz_citta"), "rz_citta");
      ask("rz_ferruccio", "BIP. I robot postini del turno di notte giocano una partitella nel piazzale. Mi manca un giocatore. E un commentatore. Faccio io il commentatore. Tu giochi. Come?", [
        { label: "A Consegna a Rete", sub: "La partita della saga, coi razzetti", cls: "hot", fn: () => K.consegnaMatch({ title: "Consegna a Rete · La partitella dei robot postini", oppStyle: "pressing", secs: 80, minutes: 45, mate: { name: "Ferruccio" }, opp: { name: "Turno di Notte", color: "#7a8a9a", players: [{ name: "FR-12" }, { name: "FR-9" }], keeper: { name: "Il Timbratore" } } }, after) },
        { label: "Un'altra modalità", sub: "Scegli tu: 3 contro 3, 2D HD o la Gabbia", fn: () => K.playMatch({ id: "rz_robot", alt: "az,cage,hd", force: false, oppTeam: "Turno di Notte", oppColor: "#7a8a9a", us: "Razzopacco", homeKit: ["#ff8a3a", "#c8a040"], mate: "Ferruccio", squad: ["Ferruccio", "Capitana Borea", "Timbro"], chap: "Razzopacco · La partitella dei robot postini", bg: "rz_citta", oppNames: ["FR-12", "FR-9", "FR-7", "FR-3", "Il Timbratore"], intro: "Nel piazzale di Nova Frattaglia, sotto i tubi.", done: after }) },
        { label: "Dopo", fn: done },
      ], "rz_citta");
    }
    const talk = {
      rz_ferruccio() {
        const s = S();
        if (s === 0) return K.scene([["rz_ferruccio", "[sorpreso] BIP. Lei non è un ghiacciolo al limone. (Controlla l'etichetta.) «Campione, 2025, da scongelare quando serve». Serve? Non lo so. Ormai è fatta."], ["rz_ferruccio", "[felice] Benvenuto nel 3011! Il calcio esiste ancora, il caffè no, i tubi sì. Le serve un lavoro? La Razzopacco assume chiunque. Davvero chiunque: hanno assunto me. È oltre il canale di neon. Col tubo, naturalmente. Nessuno cammina più."]], () => { setStep(N, 1); K.learnLore("l_tubi"); quest("rz_lavoro", "Un lavoro nel 3011", "La Razzopacco è oltre il canale di neon: prendi il tubo pneumatico."); done(); }, "rz_crio");
        if (s >= 2) return ask("rz_ferruccio", "[felice] Il corriere nuovo! Bella corsa nel tubo? Io ci ho perso un bullone, la prima volta. Ce l'ho ancora, il bullone, ma non so più dove andava.", [{ label: "La partitella dei robot postini", sub: "Partita secondaria · scegli tu la modalità", fn: robot }, { label: "Dopo", fn: done }], "rz_citta");
        return say([["rz_ferruccio", "E IL CORRIERE SI AVVICINA ALLA STAZIONE DEL TUBO… (Abbassa la voce.) Sto facendo pratica. Per il telegiornale sportivo. Mi scusi."]]);
      },
      rz_ottavia() {
        const s = S();
        if (s === 1) return K.scene([["rz_ottavia", "[sorpreso] Un cliente? No. Un dipendente! (Ti stringe la mano. Ha una presa sorprendente, per centosessantadue anni.) Sei del 2025? Che meraviglia. Allora sai giocare a calcio vero. E sai portare le cose da un posto all'altro. Assunto!"], ["rz_ottavia", "[furbo] Primo pacco: per il Signor Plof, al Bar Orbitale. Sulla piattaforma a sud, oltre il tubo. Hai novanta secondi. (Pausa.) Perché novanta? Perché l'ho detto. Vai, vai!"]], () => { setStep(N, 2); questDone("rz_lavoro"); quest("rz_plof", "Il pacco del Signor Plof", "Al Bar Orbitale, sulla piattaforma a sud. In fretta."); K.pacco("plof", { n: "Per il Sig. Plof", secs: 90 }); done(); }, "rz_sede");
        if (s === 4) return ask("rz_ottavia", "(Tira fuori un contratto lungo quattro metri.) La OmniPacco vuole comprarci. Tu li hai battuti. Mi servi, ragazzo. Firmi il contratto a vita? (Lo srotola.) Clausola 14: pagamento in panini. Clausola 15: i panini sono veri.", [
          { label: "«Firmo. A vita.»", sub: "Il contratto a vita", big: true, fn: () => fine1("contratto") },
          { label: "«Facciamo un mese di prova»", sub: "Libero di andartene", big: true, fn: () => fine1("prova") },
        ], "rz_sede");
        return say([["rz_ottavia", s >= 2 ? "Il Signor Plof aspetta! Il bello dell'attesa ce l'ha già avuto, adesso tocca al pacco." : "Spremuta di cometa? No? Fai bene: ti fa diventare vecchio come me. Cioè giovane. Non ricordo."]]);
      },
      rz_timbro() { return say([["rz_timbro", S() >= 2 ? "Hai compilato il modulo di partenza del pacco? E quello di arrivo? E quello che certifica di aver compilato gli altri due? (Diventa di un verde più scuro.) No. Certo che no." : "Benvenuto. Modulo di assunzione, in triplice copia. Firmi qui, qui e qui. (Ti porge una penna.) Anche lì. E lì. E sulla mia mano, per sicurezza."]]); },
      rz_borea() { return say([["rz_borea", S() >= 3 ? "[furbo] La OmniPacco Express. Ho parato contro di loro, ai tempi della Lega Orbitale. Tirano dritto. Tu curva. Il pianeta arancione è tuo amico." : "Capitana Borea. Piloto il razzo. (Sospira.) Oggi niente ha preso fuoco. Ancora."]]); },
      rz_plof() {
        if (S() === 2 && F.get("rz_pk") === "plof") {
          const ok = K.consegnato("plof"); setStep(N, 3); questDone("rz_plof");
          return K.scene([["rz_plof", ok ? "[felice] (Fluttua di gioia.) In orario! Che emozione! (Prende il pacco. Non lo apre.) Ecco la mancia: tre crediti e una conchiglia. Il bello è l'attesa, ma anche la puntualità ha il suo fascino." : "[pensa] Un po' in ritardo. Ma l'attesa, sa… (Prende il pacco. Non lo apre.) L'attesa è la parte migliore. Lei me ne ha regalata di più. Grazie."], ["voce", "Torni verso la Razzopacco. Davanti alla porta ti aspetta un signore con una giacca a specchio: ci vedi dentro la tua faccia, preoccupata."]], done, "rz_citta");
        }
        return say([["rz_plof", "Ho ordinato un pacco. Non so cosa c'è dentro. È bellissimo."]]);
      },
      rz_zeta() {
        if (S() === 3) return ask("rz_zeta", "(Sorriso a specchio.) Agente Zeta, OmniPacco. La signora Monòpoli vuole comprare la Razzopacco. La Professoressa dice di no. Allora facciamo come si fa nel 3011: una partita a Consegna a Rete. Se vinciamo noi, ci pensate meglio.", [{ label: "Sfida la OmniPacco Express", sub: "Consegna a Rete · partita importante", cls: "hot", fn: matchExpress }, { label: "Non ancora", fn: done }], "rz_citta");
        return say([["rz_zeta", "La OmniPacco ringrazia. Per cosa? Per tutto. Preventivamente."]]);
      },
    };
    function fine1(kind) {
      F.set(kind === "contratto" ? "rz_contratto" : "rz_prova", true); bond("ditta", kind === "contratto" ? 3 : 1);
      const msg = K.reward("c1:rz", { coins: 70, cos: ["rz_c1"] }); finishChapter(N, kind); setStep(N, 5);
      K.scene(kind === "contratto" ? [["rz_ottavia", "[felice] Firmato! (Il contratto si arrotola da solo e scappa nel tubo pneumatico.) Era l'unica copia. Non importa: Timbro ne ha fatte tre. Benvenuto nella Razzopacco. Per sempre. O finché i panini saranno veri."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il giro dei pianeti».`]]
        : [["rz_ottavia", "[ride] Un mese di prova! Prudente. Mi piace. Anch'io ho fatto un mese di prova, nel 2871. Sono ancora qui. (Ti dà una tuta arancione.) Benvenuto, corriere."], ["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2: «Il giro dei pianeti».`]], () => K.openMain(), "rz_sede");
    }
    return { n: N, title: "Scongelato", sub: "Il Criogenico, i tubi di Nova Frattaglia, la prima consegna, la OmniPacco Express", goal, start: "rz_crio", introBg: "rz_titolo", zones, talk,
      intro: () => [["voce", "<b>RAZZOPACCO · CONSEGNE DAL FUTURO</b>. Episodio 1. Nel 2025 ti addormenti in una cella frigorifera del supermercato, per ripararti dal caldo. Succede. Ti svegli novecentottantasei anni dopo."]] };
  }
  boot();
})();
