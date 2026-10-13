// js/pugno-c1.js - PER UN PUGNO DI RIGORI · Capitolo 1 «Un cavallo, una sella e un pallone»
// L'arrivo a El Paso del Rigore a dorso di mulo, l'incontro con lo Sceriffo Cooper,
// la sarsaparilla al Saloon El Palo con Carmela, le battute macabre di Barnaba il Becchino
// e il primo duello dal dischetto a «Stangata» contro i Vice dello Sceriffo.
(function () {
  "use strict";
  function boot() {
    const D = window.__pugno;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("pr_sceriffo", { acc: ["cappellino"], name: "Sceriffo Cooper", tag: "gold", hair: "#451a03", style: "slick", skin: "#e0ac7e", eye: "#2a1a0a", beard: true, bg: ["#fef3c7", "#ea580c"], shirt: "#ea580c" },
      "Lo sceriffo di El Paso. Mastica uno stecchino di legno, porta una stella di latta a sei punte e difende la porta con due guantoni da lavoro in cuoio rinforzato: «Qui la legge si fa dai dodici passi».");

    K.cast("pr_carmela", { acc: ["bandana"], name: "Carmela la Locandiera", tag: "", hair: "#1c1917", style: "bun", skin: "#d9a57a", eye: "#15803d", bg: ["#fef3c7", "#b45309"], shirt: "#b45309" },
      "Proprietaria del Saloon El Palo. Serve sarsaparilla gelata, fagioli alla messicana e consigli su come spiazzare i portieri del deserto. Ha visto passare tutti i campioni della frontiera.");

    K.cast("pr_barnaba", { acc: ["berretto"], name: "Barnaba il Becchino", tag: "blue", hair: "#64748b", style: "buzz", skin: "#cbd5e1", eye: "#1e293b", bg: ["#451a03", "#1c1917"], shirt: "#1c1917" },
      "Il becchino ufficiale del villaggio. Gira con un metro di legno pieghevole e prende le misure dei pali: «Un tiro alto sopra la traversa merita una lapide con epigrafe in rima baciata».");

    K.cast("pr_doc", { acc: ["occhiali"], name: "Doc Holliday", tag: "", hair: "#e2e8f0", style: "slick", skin: "#f8fafc", eye: "#334155", beard: true, bg: ["#fef3c7", "#78350f"], shirt: "#78350f" },
      "Medico, farmacista e scommettitore incallito. Analizza la traiettoria del pallone calcolando la velocità del vento e l'angolo di rotazione con una precisione quasi scientifica.");

    K.cos("pr_c1", { kind: "shirt", label: "Gilet di pelle con frange", val: "#b45309", from: "Capitolo 1 di Per un pugno di rigori" });
    K.lore("l_stangata", { t: "Stangata · I Rigori del Mezzogiorno", d: "A El Paso le dispute si regolano a Stangata: duelli dal dischetto con tamburo a sei colpi, mira a tensione oscillante e quick-draw al rintocco della campana." });
    K.lore("l_manifesti", { t: "I Manifesti WANTED", d: "Le taglie in dollari ($) affisse alla forca di El Paso: ogni gol e ogni duello vinto accresce la tua fama tra la legge e i desperados." });

    const goal = (s) => ({
      0: "Sei arrivato a El Paso del Rigore. Lo Sceriffo Cooper ti aspetta in mezzo alla via polverosa.",
      1: "Entra nel Saloon El Palo e parla con Carmela per conoscere i segreti dei tiratori della contea.",
      2: "Barnaba il Becchino e Doc Holliday ti attendono davanti al Saloon per preparare la sfida.",
      3: "Il primo duello a mezzogiorno! Sfida i Vice dello Sceriffo dal dischetto a Stangata!"
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      pr_cittadina: {
        region: "cittadina", name: "El Paso del Rigore · Via Maestra", short: "Via Maestra", sub: "La polvere, i cactus, l'ufficio dello sceriffo e il saloon", bg: "pr_cittadina", time: "giorno", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 6], [29, 6], [15, 19]],
        areas: [[10, 8, 22, 14, "Il centro della via polverosa"], [0, 0, 31, 21, "El Paso del Rigore"]],
        flavor: {
          t: "Il palo dei manifesti: decine di fogli Wanted sventolano nel vento secco.",
          C: "Un imponente cactus saguaro con spine acuminate.",
          B: "Una botte cerchiata di ferro con polvere di sarsaparilla."
        },
        intro: [
          ["voce", "El Paso del Rigore: un villaggio di assi di pino arse dal sole dove i cavalli nitriscono piano e l'aria profuma di cuoio, sabbia e polvere da sparo."],
          ["voce", "Sei arrivato a dorso di mulo con il tuo vecchio pallone di cuoio cucito a mano nella bisaccia. Lo stecchino dello Sceriffo Cooper ti punta contro."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "pr_sceriffo", at: [8, 18] }] : [{ id: "pr_sceriffo", at: [20, 14] }]),
          ...(s >= 2 ? [{ id: "pr_barnaba", at: [14, 9] }, { id: "pr_doc", at: [18, 9] }] : []),
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          house(2, 2, 7, 5, { door: [5, 6], roof: "#78350f", wall: "#fef3c7", rr: 1, enter: "L'Ufficio dello Sceriffo Cooper: celle con sbarre pesanti e una rastrelliera piena di scarpini sequestrati." });
          house(11, 2, 10, 5, { door: [16, 6], roof: "#b45309", wall: "#fed7aa", rr: 2, enter: { to: "pr_saloon", at: [7, 9] } });
          house(23, 2, 7, 5, { door: [26, 6], roof: "#451a03", wall: "#e2e8f0", rr: 1, enter: "La Bottega di Barnaba: bare di abete allineate e bandierine di calcio d'angolo nere." });
          // Elementi scenici western
          put(16, 9, "T"); put(26, 17, "W");
          [[9, 8], [21, 8]].forEach(([x, y]) => put(x, y, "B"));
          [[11, 14], [25, 12], [8, 14]].forEach(([x, y]) => put(x, y, "C"));
          lay(7, 6, 18, 6, "S");
          put(4, 17, "s");
        }
      },
      pr_saloon: {
        interior: true, region: "saloon", name: "El Paso · Saloon El Palo", short: "Saloon El Palo", sub: "Pianoforte scordato, bancone di noce e sarsaparilla", bg: "pr_saloon", w: 16, h: 12, start: [7, 9], outside: ["pr_cittadina", 16, 7],
        act: { T: "Guarda il bancone", P: "Ascolta il pianoforte", B: "Guarda la botte", v: "Esci" },
        flavor: {
          T: "Il bancone di legno di noce: c'è un solco profondo lasciato da un bicchiere fatto scivolare da un pistolero.",
          P: "Il pianoforte a muro: ha tre tasti mancanti ma suona ancora con grinta.",
          B: "Una botte colma di sarsaparilla piccante della Carmela."
        },
        intro: [["voce", "Il Saloon El Palo: porte a vento che cigolano, aria densa e profumo di tabacco e spezie. Dietro al bancone, Carmela ti scruta con due occhi da falco."]],
        npcs: () => [{ id: "pr_carmela", at: [7, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "B");
          put(12, 5, "P");
          put(3, 8, "T"); put(11, 8, "T");
        }
      }
    };

    const talk = {
      pr_sceriffo(K) {
        const s = S();
        if (s === 0) {
          say([
            ["pr_sceriffo", "[sposta lo stecchino con la lingua] Fermati lì, forestiero. Non muovere un muscolo."],
            ["hero", "Sono solo un viaggiatore. Ho fatto trecento miglia sul mulo."],
            ["pr_sceriffo", "Vedo cosa hai legato alla sella. Cuoio spesso, cuciture a mano, dodici spicchi... Quello è un pallone regolamentare da rigore, e qui a El Paso c'è una sola legge."],
            ["pr_sceriffo", "La legge dei dodici passi. Se vuoi circolare per la via maestra devi dimostrare di saper calciare dritto. Vai da Carmela al Saloon El Palo, rinfrescati la gola e poi ci vediamo al dischetto."]
          ]);
          quest("Dissetati al Saloon", "Raggiungi il Saloon El Palo ed entra dalle porte a vento per parlare con Carmela.");
          setStep(1);
          K.manifesto("arrivo", { taglia: 50, legge: 10, freddezza: 10 });
        } else if (s === 1) {
          say([["pr_sceriffo", "[guarda l'orologio da taschino] Carmela ti aspetta al Saloon. E non bere troppo in fretta: la sabbia nei polmoni fa sbagliare i rigori."]]);
        } else if (s >= 3) {
          ask("Sfidi i Vice dello Sceriffo dal dischetto?", [
            ["Sfida dal Dischetto (Stangata)", () => {
              say([
                ["pr_sceriffo", "[fischia verso il vicolo] Ehi, ragazzi! Fuori i guanti di cuoio. Vediamo se questo forestiero ha il piede fermo o se gli tremano gli speroni!"],
                ["hero", "Mettete pure i vostri migliori portieri sulla riga di calce. Calcio dove batte il sole."]
              ]);
              K.stangataMatch({
                turns: 4,
                us: "Il Gringo",
                opp: { name: "I Vice dello Sceriffo", color: "#b45309", style: "equilibrata" }
              }, (res) => {
                if (res.win) {
                  say([
                    ["pr_sceriffo", "[tira un lungo sospiro e sorride] Per tutti i coyote del canyon... Due tiri all'incrocio e una finta che ha mandato il mio miglior vice a raccogliere fichi d'india!"],
                    ["pr_sceriffo", "[ti batte una mano pesante sulla spalla] Mi piaci, ragazzo. Hai fegato e polpaccio d'acciaio. Tieni questo gilet di pelle con le frange: da oggi sei ufficialmente un tiratore autorizzato della contea."],
                    ["hero", "Grazie, sceriffo. Ma ho sentito parlare di un certo Ramon..."],
                    ["pr_sceriffo", "[il sorriso si spegne] Ramon Sette Tiri. Il capobanda dei Desperados di Rio Bravo. Ha giurato che prima o poi conquisterà El Paso con un assedio di rigori. Ne riparliamo stanotte."]
                  ]);
                  questDone("Dissetati al Saloon");
                  bond("taglia", 150);
                  bond("legge", 15);
                  bond("freddezza", 25);
                  K.giveCos("pr_c1");
                  finishChapter(N, { title: "IL PRIMO SPARO DAL DISCHETTO", badge: "🤠 Pistolero" });
                } else {
                  say([
                    ["pr_sceriffo", "[scuote la testa] Il vento del deserto ti ha fatto sbandare il tiro, ragazzo. Riprendi fiato e riprova quando sei pronto. Nessuno lascia El Paso senza aver centrato il bersaglio!"]
                  ]);
                }
              });
            }],
            ["Non ancora", () => say([["pr_sceriffo", "Fai con calma. Il sole a picco non scappa mica."]])]
          ]);
        }
      },
      pr_carmela(K) {
        const s = S();
        if (s === 1) {
          say([
            ["pr_carmela", "[pulisce un bicchiere con uno straccio di lino] Benvenuto a El Paso, sconosciuto. Dalla faccia sembri uno che ha calciato più rigori di quante siano le stelle sul cielo del Texas."],
            ["hero", "Cerco solo un posto dove riposare e un campo dove allenarmi."],
            ["pr_carmela", "[ride con una risata calda] Allenarsi? Qui non ci si allena, qui si duella! Ogni mezzogiorno c'è una sfida. Chi perde paga i fagioli per tutti."],
            ["pr_carmela", "Ascoltami bene: lo Sceriffo Cooper ha riflessi eccezionali con la mano destra, ma se lo guardi fisso negli occhi e tiri rasoterra a sinistra lo spiazzi sette volte su dieci."],
            ["hero", "Prendo nota, signora Carmela. E chi sono Barnaba e Doc che aspettano fuori?"],
            ["pr_carmela", "Barnaba misura le porte e Doc calcola le traiettorie. Vai a salutarli: se ottieni il loro favore avrai tutto il villaggio dalla tua parte."]
          ]);
          setStep(2);
          bond("freddezza", 10);
        } else {
          say([["pr_carmela", "Una sarsaparilla fresca è il miglior tonico per le gambe. Bevi piano e mira all'incrocio!"]]);
        }
      },
      pr_barnaba(K) {
        const s = S();
        if (s === 2) {
          say([
            ["pr_barnaba", "[misura la distanza con un metro di legno pieghevole] Undici passi... dodici passi... Perfetto. Il dischetto è alla distanza aurea."],
            ["hero", "Buongiorno. Siete voi il becchino?"],
            ["pr_barnaba", "Barnaba, al vostro servizio. Quando un attaccante tira alle stelle io scavo una piccola fossa simbolica per il suo orgoglio perduto. Ma per te sento che non servirà: hai il passo felpato del vero goleador."],
            ["pr_doc", "[aggiustandosi gli occhiali rotondi] Confermo. Angolo di apertura del piede: 45 gradi. Coefficiente di attrito dell'aria: quasi nullo. Ragazzo, se tiri con decisione i vice dello sceriffo non vedranno nemmeno la palla."]
          ]);
          say([["voce", "Tutto è pronto. Lo Sceriffo Cooper ti aspetta al centro della via polverosa per il tuo primo duello di rigori!"]]);
          setStep(3);
        } else {
          say([["pr_barnaba", "Il sole è a picco: l'ora perfetta per un duello dal dischetto!"]]);
        }
      },
      pr_doc(K) {
        say([["pr_doc", "[annuisce con aria sapiente] Ricordati: la traiettoria parabolica nel deserto risente delle correnti ascensionali. Se tiri a mezza altezza la palla galleggia come un falco!"]]);
      }
    };

    return {
      n: N,
      title: "Un cavallo, una sella e un pallone",
      desc: "L'arrivo a El Paso del Rigore, l'incontro con lo Sceriffo Cooper, Carmela e il primo duello a Stangata.",
      goal: () => goal(S()),
      zones,
      talk,
      intro: () => {
        setStep(0);
        K.teleport("pr_cittadina", 4, 18);
      }
    };
  }

  boot();
})();
