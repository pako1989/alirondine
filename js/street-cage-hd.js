// js/street-cage-hd.js - Street Football 2D HD · "La Gabbia del Molo"
// 3v3 da strada in una gabbia verticale: muri che rimbalzano, sponde che valgono doppio, Grinta e Trabucco.
// Entry: window.openStreetCageMode(onExit)
(function () {
  "use strict";

  // ---------------------------------------------------------------- costanti
  const KEY_PROG = "ali-di-rondine.cage-hd-progress";
  const KEY_SET = "ali-di-rondine.cage-hd-settings";
  const DEBUG = /[?&]debug/.test(location.search || "");

  const CW = 540, CH = 860;
  const L = 22, R = CW - 22, T = 22, B = CH - 22, LENY = B - T;
  const BR = 8;          // raggio palla
  const PR = 14;         // raggio giocatore
  const STEP = 1 / 60;
  const MATCH_SECS = 150;
  const MX = 70, MY = 90;

  const LEVELS = [
    {
      name: "Scaricatori del Mercato", tag: "MER", kit: "#f97316", kit2: "#fde68a", skin: ["#d9a679", "#c68642", "#e8b88c"], names: ["Tano", "Ciccio Gru", "Bepi Stiva"],
      spd: 0.9, react: 20, dash: 0.004, noise: 34, bank: 0.1, target: 7, read: 0.1, mut: "Nessuna regola strana", mutKey: "",
      hint: "Escono dal turno all'alba e giocano con la stessa grazia con cui spostano le cassette di pesce. Il capo, Tano, ha il fiato di un mantice rotto.",
      win: "Tano perde e offre il caffè a tutti. Poi si accorge che il bar è chiuso dal 2011. Passa un gatto. Per qualche secondo nessuno dice niente, e va benissimo così.",
    },
    {
      name: "Le Gemelle Schiuma", tag: "SCH", kit: "#d946ef", kit2: "#0f172a", skin: ["#e8b88c", "#e8b88c", "#c68642"], names: ["Rina", "Rosa", "Cugino Memo"],
      spd: 0.97, react: 14, dash: 0.007, noise: 24, bank: 0.25, target: 8, read: 0.5, mut: "Cemento bagnato: la palla scivola di più", mutKey: "wet",
      hint: "Rina e Rosa finiscono le frasi l'una dell'altra, e anche i passaggi. Il cugino Memo è lì «per fare numero». Fa spesso il numero sbagliato.",
      win: "Rina e Rosa ti salutano all'unisono, finendo la stessa frase a metà. Nessuna delle due ha capito chi ha vinto, ma entrambe giurano di averlo previsto.",
    },
    {
      name: "La Vecchia Guardia del Molo", tag: "VEC", kit: "#a8a29e", kit2: "#78350f", skin: ["#d9a679", "#c68642", "#d9a679"], names: ["Don Tullio", "Mastro Remo", "Ciro Mezzaluna"],
      spd: 0.98, react: 12, dash: 0.008, noise: 18, bank: 0.35, target: 8, read: 0.75, mut: "Pareti di gomma: i muri non frenano la palla", mutKey: "rubber",
      hint: "Hanno costruito questa gabbia con le proprie mani, quarant'anni fa. Giocano piano e non sbagliano mai l'angolo: lo conoscono a memoria.",
      win: "Don Tullio ti porge il lucchetto della Gabbia, arrugginito dal sale. «L'abbiamo chiusa ogni sera per quarant'anni, aspettando qualcuno che la riaprisse.» Mastro Remo si soffia il naso con un fazzoletto grande come una vela.",
    },
    {
      name: "Mastro Cavalletto & Co.", tag: "CAV", kit: "#18181b", kit2: "#facc15", skin: ["#c68642", "#8d5524", "#e8b88c"], names: ["Mastro Cavalletto", "Sgrinfia", "Palanca"],
      spd: 1.04, react: 8, dash: 0.011, noise: 10, bank: 0.4, target: 9, read: 0.95, mut: "Porte strette: gli spazi si riducono", mutKey: "narrow",
      hint: "Il Re della Gabbia: non perde da prima che esistesse il telefono col filo. Ha un casco da cantiere, tre dita per mano e nessuna pietà.",
      win: "Mastro Cavalletto si toglie il casco da cantiere e ti stringe la mano con tre dita. «Il re è chi lascia la porta aperta.» Poi, più piano: «E il fritto, adesso, lo offri tu.»",
    },
  ];
  const COINS = [3, 4, 4, 5]; // 16 monete totali, solo alla prima vittoria
  const DIFFS = [
    { n: "Facile", spd: 0.92, react: 8, noise: 14, usr: 1.05 },
    { n: "Normale", spd: 1.0, react: 0, noise: 0, usr: 1.0 },
    { n: "Duro", spd: 1.06, react: -3, noise: -6, usr: 1.0 },
  ];
  const HOME = [
    { name: "Leo", spd: 4.8, kit: "#2563eb", kit2: "#bae6fd", skin: "#e8b88c", hair: "#3b2314" },
    { name: "Nico", spd: 5.1, kit: "#0ea5e9", kit2: "#ffffff", skin: "#f5d0ae", hair: "#e8a33d" },
    { name: "Dario", spd: 4.5, kit: "#1e3a8a", kit2: "#facc15", skin: "#e9bf96", hair: "#2b1d14" },
  ];
  // posizioni base nel sistema della squadra: u = avanzamento (0 propria porta, 1 porta avversaria), v = larghezza
  const SLOT = [{ u: 0.5, v: 0.32, role: "Fronte" }, { u: 0.42, v: 0.68, role: "Jolly" }, { u: 0.2, v: 0.5, role: "Muro" }];

  // ================================================================ ESPANSIONE · dati
  // Chiavi di salvataggio proprie: i salvataggi vecchi (progress/settings) restano intatti.
  const KEY_EXT = "ali-di-rondine.cage-hd-ext";
  const KEY_SEASON = "ali-di-rondine.cage-hd-season";
  const KEY_CUP = "ali-di-rondine.cage-hd-cup";
  const DAILY_IDS = ["sp", "cl", "ru", "we", "tr", "la", "su", "pe", "co", "tu", "go", "bm"];
  ["mer", "sch", "vec", "cav"].forEach((id, i) => { LEVELS[i].id = id; LEVELS[i].tier = i; });

  const EXTRA = [
    {
      id: "fri", tier: 1, name: "Friggitori Uniti", tag: "FRI", kit: "#eab308", kit2: "#7c2d12", skin: ["#d9a679", "#e8b88c", "#c68642"], names: ["Peppe Olio", "La Bionda", "Saro Sale"],
      spd: 0.95, react: 15, dash: 0.006, noise: 26, bank: 0.2, target: 7, read: 0.45, mut: "Nessuna regola strana", mutKey: "",
      hint: "Tengono la squadra come la friggitoria: tutto a olio caldo e niente lasciato al caso. Giocano con i guanti da forno, per abitudine e per scaramanzia.",
      win: "Peppe Olio perde e offre un cartoccio a tutti. Il cartoccio è per tre. Siete in dodici. Nessuno protesta: è il fritto, non l'aritmetica.",
    },
    {
      id: "ret", tier: 2, name: "Rete & Reti", tag: "RET", kit: "#0ea5e9", kit2: "#f0f9ff", skin: ["#e8b88c", "#c68642", "#d9a679"], names: ["Gisella", "Baldo Nodo", "Marzio Maglia"],
      spd: 0.97, react: 12, dash: 0.007, noise: 20, bank: 0.45, target: 8, read: 0.7, mut: "Nessuna regola strana", mutKey: "",
      hint: "Rammendano le reti dei pescatori da una vita. Annodano anche i passaggi: lenti, ma quando arrivano sono impossibili da sciogliere. Amano le sponde come i nodi piani.",
      win: "Gisella ti restituisce la palla con un nodo sopra. «Per ricordarti che qui si ritorna.» Baldo Nodo applaude con le mani sporche di pece. Marzio non capisce, ma applaude più forte.",
    },
    {
      id: "geo", tier: 2, name: "Studio Associato Geometri", tag: "GEO", kit: "#64748b", kit2: "#fde68a", skin: ["#e8b88c", "#d9a679", "#e8b88c"], names: ["Geom. Rossi", "Geom. Bruni", "Dott. Squadra"],
      spd: 1.0, react: 10, dash: 0.008, noise: 14, bank: 0.3, target: 8, read: 0.8, mut: "Porte strette: gli spazi si riducono", mutKey: "narrow",
      hint: "Misurano il fuorigioco col metro da cantiere. Qui il fuorigioco non esiste. Misurano lo stesso, e ti mandano la parcella.",
      win: "Il Geometra Rossi ti consegna un verbale: «Sconfitta regolare, nessuna difformità». Il Dottor Squadra lo timbra. Non c'era nessun timbro in Gabbia, ne ha portato uno.",
    },
  ];
  const BOSSES = [
    {
      id: "gru", tier: 3, boss: true, ab: "gru", name: "Sandra «la Gru» & i Container", tag: "GRU", kit: "#ef4444", kit2: "#111827", skin: ["#c68642", "#e8b88c", "#8d5524"], names: ["Sandra la Gru", "Nino Cavo", "Tonnellata"],
      spd: 1.0, react: 9, dash: 0.01, noise: 12, bank: 0.35, target: 8, read: 0.9, mut: "Il Cassone: ogni 30 secondi una porta si restringe per 7", mutKey: "", coin: 5, gt: 3, ch: 7,
      hint: "Dalla cabina della gru vede tutto il molo e non scende mai. Per voi è scesa. Ha il passo di un container e il tiro di un carroponte.",
      pre: "Dall'alto: «Ragazzi, il Cassone ve lo faccio vedere io!»",
      win: "Sandra la Gru tocca il cemento con la suola e resta ferma un secondo, come chi ritrova una cosa vecchia. «Scusate. Non lo sentivo da otto anni.» Nino Cavo si volta per non ridere. Tonnellata no.",
    },
    {
      id: "nan", tier: 3, boss: true, ab: "fuoco", name: "Nando Frittura & i Fornelli", tag: "FRT", kit: "#f59e0b", kit2: "#451a03", skin: ["#d9a679", "#c68642", "#e8b88c"], names: ["Nando Frittura", "Olio Primo", "Frittella"],
      spd: 1.02, react: 8, dash: 0.011, noise: 11, bank: 0.3, target: 8, read: 0.95, mut: "Fuoco di Nando: ogni 40 secondi un Trabucco nemico", mutKey: "", coin: 6, gt: 3, ch: 8,
      hint: "Fa il fritto del molo da quarant'anni. Gioca come cuoce: a fuoco alto, senza guardare il timer e con una sicurezza che non si spiega.",
      pre: "Nando: «Tutto a fuoco vivo! Il cartoccio è per chi vince!»",
      win: "Nando Frittura posa il tegame e ti stringe la mano unta. «Il cartoccio è per te. E per tutti. Ho fritto per il quartiere intero, quindi abbiamo del tempo.» Il gabbiano rimane a distanza di sicurezza.",
    },
    {
      id: "mar", tier: 3, boss: true, ab: "marea", name: "La Capitana Marea", tag: "MAR", kit: "#0f766e", kit2: "#ecfeff", skin: ["#e8b88c", "#c68642", "#d9a679"], names: ["Capitana Marea", "Mozzo", "Gabbiere"],
      spd: 1.04, react: 7, dash: 0.012, noise: 9, bank: 0.45, target: 9, read: 1.0, mut: "Alta marea: ogni 25 secondi il pavimento si bagna per 8", mutKey: "", coin: 8, gt: 4, ch: 9,
      hint: "Comanda la Capitaneria del molo e conta le barche che rientrano, una per una. Gioca con la stessa calma di chi ha già visto tutti i temporali.",
      pre: "Marea, al megafono: «Squadra al completo? Si salpa.»",
      win: "La Capitana Marea si toglie il berretto e lo mette sotto il braccio. «Rientrato.» Lo dice a te, e lo scrive sul registro. Alle sue spalle, le luci del porto si accendono tutte insieme.",
    },
  ];
  const TEAMS_ALL = LEVELS.concat(EXTRA, BOSSES);
  const WAVE_SEQ = [LEVELS[0], LEVELS[1], EXTRA[0], LEVELS[2], EXTRA[1], EXTRA[2], LEVELS[3]];
  const teamById = (id) => TEAMS_ALL.find((t) => t.id === id) || LEVELS[0];

  // compagni: i tre storici + cinque reclute (si ingaggiano col Diario)
  const POOL = {
    leo: { id: "leo", name: "Leo", spd: 4.8, kit: "#2563eb", kit2: "#bae6fd", skin: "#e8b88c", hair: "#3b2314", tr: "", bio: "Il capitano per ostinazione. Corre dritto, tira dritto, a volte pensa dritto." },
    nico: { id: "nico", name: "Nico", spd: 5.1, kit: "#0ea5e9", kit2: "#ffffff", skin: "#f5d0ae", hair: "#e8a33d", tr: "", bio: "Veloce di piedi e di bocca. Quando non passa la palla, passa il tempo." },
    dario: { id: "dario", name: "Dario", spd: 4.5, kit: "#1e3a8a", kit2: "#facc15", skin: "#e9bf96", hair: "#2b1d14", tr: "", bio: "Stessa grinta di Leo, più pazienza. Un po'." },
    zoe: { id: "zoe", name: "Zoe", spd: 5.3, kit: "#ec4899", kit2: "#fdf2f8", skin: "#d9a679", hair: "#7c2d12", tr: "scatto", rec: 1, bio: "Consegna i gelati dello Scoglio in bici, in salita, controvento. Dice che la Gabbia è «troppo piana».", pitch: "Scatto: la spallata si ricarica più in fretta." },
    mimi: { id: "mimi", name: "Mimì", spd: 4.9, kit: "#eab308", kit2: "#1c1917", skin: "#e8b88c", hair: "#1f1a17", tr: "passaggio", rec: 2, bio: "Fattorina in bici del molo. Conosce ogni indirizzo, quindi anche ogni compagno.", pitch: "Passaggio: i suoi passaggi viaggiano più veloci." },
    brando: { id: "brando", name: "Brando", spd: 4.7, kit: "#f8fafc", kit2: "#b45309", skin: "#c68642", hair: "#e5e7eb", tr: "tiro", rec: 3, bio: "Bagnino. D'estate sulla torretta, d'inverno in Gabbia. Le mani sono sempre bianche di crema solare, i tiri anche.", pitch: "Tiro: le sue botte partono più forti." },
    osvaldo: { id: "osvaldo", name: "Otello", spd: 4.3, kit: "#334155", kit2: "#fb923c", skin: "#8d5524", hair: "#111827", tr: "tenuta", rec: 5, bio: "Scarica le casse al molo. Se c'è da fare muro, si piazza lui: non per merito, per ingombro.", pitch: "Tenuta: le spallate subite lo stendono meno." },
    nina: { id: "nina", name: "Nina", spd: 5.0, kit: "#16a34a", kit2: "#ecfccb", skin: "#e8b88c", hair: "#3b2314", tr: "sponda", rec: 6, bio: "Ripara biciclette. Conosce l'angolo di ogni raggio, quindi anche quello di ogni sponda.", pitch: "Sponda: ogni sponda che tenta le carica la Grinta." },
  };
  const TRAIT_N = { "": "", scatto: "Scatto", passaggio: "Passaggio", tiro: "Tiro", tenuta: "Tenuta", sponda: "Sponda" };

  // estetica
  const KITS = [
    { n: "Originale", k: null, k2: null, p: 0 }, { n: "Blu Rondine", k: "#2563eb", k2: "#ffffff", p: 2 }, { n: "Arancio Gabbia", k: "#f97316", k2: "#1f2937", p: 3 },
    { n: "Verde Molo", k: "#16a34a", k2: "#f0fdf4", p: 3 }, { n: "Notte di Porto", k: "#111827", k2: "#facc15", p: 4 }, { n: "Strisce Corsare", k: "#be123c", k2: "#fff1f2", p: 5 },
    { n: "Oro di Tullio", k: "#ca8a04", k2: "#1c1917", p: 0, gate: "title" },
  ];
  const BALLS = [
    { n: "Classica", a: "#ffffff", b: "#1d4ed8", p: 0 }, { n: "Arancio da Gabbia", a: "#fdba74", b: "#7c2d12", p: 2 }, { n: "Notturna", a: "#a5f3fc", b: "#0e7490", p: 3 },
    { n: "Peppino", a: "#fefce8", b: "#eab308", p: 3 }, { n: "Dorata", a: "#fde68a", b: "#a16207", p: 0, gate: "boss" },
  ];
  const FIELDS = [
    { n: "Sera sul porto", sky: ["#0f1830", "#1c1a2a", "#0f1220"], fl: [0, 0, 0], lamp: "253,224,71", p: 0 },
    { n: "Alba", sky: ["#2a1a3a", "#7c3a2a", "#3a2a2a"], fl: [14, 4, -6], lamp: "254,215,170", p: 3 },
    { n: "Notte fonda", sky: ["#04060d", "#080b16", "#05070d"], fl: [-8, -8, -4], lamp: "186,230,253", p: 3 },
    { n: "Temporale", sky: ["#1f2937", "#273244", "#1a2230"], fl: [-2, 2, 8], lamp: "203,213,225", p: 4 },
  ];
  const TAGS = ["RON", "MOL", "GAB", "LEO", "ALI"];
  const GATE_TXT = { title: "Si apre più avanti", boss: "Si apre più avanti" };

  // modificatori di partita
  const MODS = [
    { id: "team", n: "Della squadra", d: "Vale la regola tipica dell'avversario." },
    { id: "none", n: "Nessuno", d: "Gabbia pulita, regole normali." },
    { id: "wet", n: "Cemento bagnato", d: "La palla scivola di più." },
    { id: "rubber", n: "Pareti di gomma", d: "I muri non frenano la palla." },
    { id: "narrow", n: "Porte strette", d: "Gli spazi si riducono." },
    { id: "wide", n: "Porte larghe", d: "Più spazio per tutti, e per le figuracce." },
    { id: "heavy", n: "Palla di piombo", d: "Palla pesante: si ferma presto." },
    { id: "turbo", n: "Turbo", d: "Tutti corrono il 12% in più." },
    { id: "gold", n: "Sponda d'oro", d: "Il gol di sponda vale 3 punti." },
    { id: "grint", n: "Grinta doppia", d: "La Grinta si riempie il doppio." },
  ];
  const modName = (id) => (MODS.find((m) => m.id === id) || MODS[1]).n;

  // battute del quartiere (ironiche di base)
  const QUIP = {
    pre: ["Dal balcone, Nives: «Fate meno rumore dopo le dieci!». Sono le cinque.", "Tano indica il bar chiuso: «Offro io!». Nessuno raccoglie.", "Il gabbiano del tetto prende posto. Ha già deciso come va a finire.", "Don Tullio gira il lucchetto in tasca. Fa il rumore del sale."],
    goal: ["Nives batte un colpo sulla ringhiera. Uno. Per il rumore.", "Mastro Remo si commuove. Si sente il fazzoletto, come una vela.", "Il gabbiano approva: una piuma cade, di approvazione.", "Tano alza un caffè immaginario. È anche buono.", "Don Tullio annuisce. Per lui è una standing ovation."],
    conc: ["Nives: «Andava bene così!». Non andava bene così.", "Passa un gatto. Nessuno osa fermarlo.", "Tano: «Colpa del fondo!». Il fondo è di cemento, Tano.", "Il gabbiano si volta dall'altra parte, per delicatezza.", "Qualcuno dice «Ci può stare». Non ci stava."],
    wall: ["Il muro ti ringrazia: era un po' che nessuno lo trattava così bene.", "La rete canta col vento: do diesis, più o meno.", "Una sponda così la mette in cornice anche Remo."],
    end: ["Il sole cala sul molo e il gabbiano lascia il tetto.", "Nives chiude la finestra, ma piano. È un segnale.", "Tullio passa con il lucchetto e lo rimette in tasca. Per ora.", "Sul muro, tra i graffiti, qualcuno ha aggiunto un nome nuovo. Nessuno ammette chi.", "La rete vibra ancora. Dentro, per un secondo, sembra di sentire quarant'anni di partite.", "Una bicicletta passa lenta davanti alla Gabbia. Il fattorino guarda dentro, sorride, e va."],
  };
  const pickQ = (a) => a[Math.floor(Math.random() * a.length)];

  // cast ricorrente del quartiere (per le scene del Diario)
  const CASTC = {
    voce: { n: "", c: "#64748b" }, tullio: { n: "Don Tullio", c: "#a8a29e" }, remo: { n: "Mastro Remo", c: "#78350f" }, gino: { n: "Tano", c: "#f97316" },
    rina: { n: "Rina", c: "#d946ef" }, rita: { n: "Rosa", c: "#a855f7" }, nives: { n: "Signora Nives", c: "#f472b6" }, cav: { n: "Mastro Cavalletto", c: "#facc15" },
    zoe: { n: "Zoe", c: "#ec4899" }, mimi: { n: "Mimì", c: "#eab308" }, brando: { n: "Brando", c: "#e5e7eb" }, osvaldo: { n: "Otello", c: "#fb923c" }, nina: { n: "Nina", c: "#16a34a" },
    sandra: { n: "Sandra la Gru", c: "#ef4444" }, nino: { n: "Nino Cavo", c: "#b91c1c" }, nando: { n: "Nando Frittura", c: "#f59e0b" }, marea: { n: "Capitana Marea", c: "#0f766e" }, elio: { n: "Elio (cartolina)", c: "#38bdf8" },
  };

  // il filo narrativo: si apre a tappe, il resto resta «???»
  const CHAPTERS = [
    {
      id: "c0", t: "Il lucchetto", w: "Sera sul molo", need: () => true,
      lines: [
        ["voce", "Il molo, di sera. Una rete alta quanto due piani, un pavimento a scacchi di cemento, un lucchetto arrugginito appeso a un gancio. Dal tetto di fronte, un gabbiano ti guarda come un ispettore."],
        ["tullio", "Eccolo, il ragazzo della Rondine. Io sono Don Tullio, custode della Gabbia. Custode vuol dire che ho le chiavi. Le chiavi vogliono dire che mi chiamano alle sei del mattino."],
        ["nives", "(dal balcone) Ragazzo! Fate meno rumore dopo le dieci! ...Cioè. Fate rumore. Ma con garbo."],
        ["tullio", "Qui la palla non esce: rimbalza. È la regola numero uno. La numero due è che la numero uno si può discutere. Ma non con la rete."],
        ["voce", "Nella Gabbia del Molo c'è sempre qualcuno da battere, qualcuno da conoscere e un caffè che non arriverà. Si comincia quando vuoi."],
      ],
    },
    {
      id: "c1", t: "Il caffè che non c'è", w: "Davanti al bar", need: () => starsOf(0) > 0, rec: "zoe",
      lines: [
        ["gino", "Hai vinto, bravo. Vieni, ti offro un caffè. Il bar è lì, vedi? Con la saracinesca abbassata."],
        ["voce", "La saracinesca è abbassata dal 2011. Sul vetro, un cartello a pennarello: «TORNO SUBITO»."],
        ["zoe", "Lui ti offre il caffè, io ti porto il gelato: insieme facciamo un bar. Sono Zoe, consegno per Lo Scoglio. Corro in bici in salita, la tua Gabbia è piatta: mi annoio."],
        ["tullio", "Zoe corre come chi deve consegnare un gelato prima che si sciolga. Cioè sempre."],
        ["gino", "Sai perché non ho più riaperto? Perché ogni mattina alle cinque il primo cliente era Tullio. Senza di lui il bar non aveva senso, e poi abbiamo scoperto che anche senza il bar ci si trova. Il caffè è finto, la compagnia no."],
      ],
    },
    {
      id: "c2", t: "Il terzo posto", w: "A bordo campo", need: () => starsOf(1) > 0, rec: "mimi",
      lines: [
        ["rina", "Sai perché Cugino Memo gioca con noi? Perché a noi due..."],
        ["rita", "...manca sempre qualcuno. Ma a quest'ora è di solito Memo a mancare."],
        ["rina", "Eravamo in tre, da piccoli. Beppe, nostro fratello, lavora su un traghetto, in mezzo al mare, e ci scrive ogni domenica."],
        ["rita", "Così Memo sta al suo posto. «Per fare numero». Beppe ci chiama il sabato: «Come va il numero?»"],
        ["mimi", "Io sono Mimì, la fattorina del molo: consegno quello che al postino pesa. Ho sentito: l'unico indirizzo che conosco a memoria senza guardare è il vostro. Passatemi la palla, so già dove spedirla."],
      ],
    },
    {
      id: "c3", t: "Il balcone di Nives", w: "Terzo piano", need: () => totalGames() >= 6, rec: "brando",
      lines: [
        ["nives", "Sono Nives, terzo piano, quella dei «fate meno rumore». Sto qui dal '71. Quando hanno chiuso la Gabbia, per un anno, ho avuto un silenzio troppo grande."],
        ["nives", "Allora adesso mi lamento io e giocate voi. Funziona così: io mi lamento, voi giocate, e la sera non cala mai del tutto."],
        ["brando", "Io sono Brando, bagnino. D'estate sto sulla torretta, d'inverno vengo qui. Ho le mani bianche di crema solare e i tiri anche: nessuno vede arrivare la palla, in mezzo al riverbero."],
        ["nives", "Ragazzo, se fai un gol di sponda batto un colpo sulla ringhiera. Uno. Per tre ne devi fare tre."],
      ],
    },
    {
      id: "c4", t: "Quarant'anni di sera", w: "La rete, al tramonto", need: () => starsOf(2) > 0, rec: "osvaldo",
      lines: [
        ["tullio", "Il lucchetto l'ho chiuso ogni sera per quarant'anni, alle undici. E ogni mattina alle sei l'ho riaperto, anche quando non c'era nessuno ad aspettare."],
        ["remo", "(si soffia il naso, rumore di vela) Che vuoi, Tullio, sei sentimentale."],
        ["tullio", "Eravamo in cinque, nel 1987. Io, Remo, Ciro, Nandino ed Elio. Il terreno era un parcheggio dimenticato: ognuno portò un pezzo di rete e un secchio di cemento."],
        ["voce", "Sul muro, accanto al graffito «1987», ci sono cinque impronte di mano nel cemento. Quattro sono grandi. Una è un po' più piccola, e più storta."],
        ["tullio", "Il resto della storia te la racconto un'altra sera."],
        ["osvaldo", "Io sono Otello, scarico casse al molo. Se c'è da fare muro, mi piazzo io. Non per merito: per ingombro."],
      ],
    },
    {
      id: "c5", t: "Il casco", w: "Il campo, a notte", need: () => starsOf(3) > 0, rec: "nina",
      lines: [
        ["cav", "Il casco? Lo porto perché in cantiere mi hanno insegnato che la testa è l'unico pezzo che non si cambia. Le dita, invece... diciamo che sono sparse in giro."],
        ["voce", "Mastro Cavalletto si toglie il casco. Dentro, a pennarello, c'è scritto: «PER IL RE». Dice che era suo. Poi dice che era del nonno. Poi cambia discorso."],
        ["cav", "Il Re non è chi vince sempre. È chi, quando perde, tiene la porta aperta all'altro. L'ho imparato tardi, da una bambina di dieci anni che mi batté in finale con una sponda."],
        ["nina", "Quella bambina ero io. Oggi aggiusto biciclette e ho ancora il pallone. Lui ha ancora il casco. Siamo pari."],
        ["cav", "Il fritto, comunque, lo offri tu. E non protestare."],
      ],
    },
    {
      id: "c6", t: "La cartolina di Elio", w: "Sulla rete", need: () => EXT.stat.cupWins >= 1 || EXT.stat.seasonGames >= 3,
      lines: [
        ["tullio", "Ti dovevo la storia del quinto. Elio si imbarcò nell'89 su un mercantile, «solo per una stagione». Cinque stagioni, poi dieci. Poi una cartolina l'anno."],
        ["voce", "Sulla rete, con le mollette, ci sono le cartoline: Rotterdam, Singapore, Valparaíso, Durban, Busan, Anversa. Ognuna dice: «La palla rimbalza anche qui. Elio»."],
        ["remo", "In ogni foto c'è un campetto di porto. Cerca le reti: sono sempre uguali alla nostra. Le hanno copiate da noi, giurano."],
        ["tullio", "Il lucchetto non lo cambio, per lui: se torna, deve poter entrare."],
        ["nives", "(piano, dal balcone) Ragazzo, questa è la parte in cui non si fa rumore."],
        ["voce", "Per una volta il gabbiano non ruba niente. Rimane sul tetto, in silenzio, come un secondo custode."],
      ],
    },
    {
      id: "c7", t: "Il turno di Sandra", w: "Sotto la gru", need: () => bossDone("gru"),
      lines: [
        ["sandra", "Da qui, in cabina, vedo tutto il porto: container, barche, e la vostra rete che sembra un fazzoletto a scacchi. Da quassù voi siete la cosa più viva di tutto il molo."],
        ["nino", "Sandra non scende mai dalla gru. Oggi è scesa per voi. È la prima volta che tocca il cemento da otto anni."],
        ["sandra", "Il cemento è più duro di come lo ricordavo. Complimenti: siete la prima squadra che mi fa sentire il pavimento."],
        ["tullio", "Gru e Gabbia: due sistemi per tenere le cose in aria. La nostra, però, regge meglio."],
      ],
    },
    {
      id: "c8", t: "Il fritto della riapertura", w: "L'Apecar di Nando", need: () => bossDone("nan"),
      lines: [
        ["nando", "Io ti offro un cartoccio e non è una mancia, è un risarcimento."],
        ["remo", "Nando, il cartoccio è per tre."],
        ["nando", "Allora lo faccio di sette. Il fritto è come l'amicizia: se non basta, si allunga."],
        ["voce", "Il fritto arriva su un foglio gigante steso sul cofano di un'Apecar. Tutti mangiano in piedi, unti e contenti. Il gabbiano ruba un'alice e la perde subito, in volo."],
        ["gino", "Per la prima volta dal 2011, il bar chiuso sembra un posto dove ci si poteva sedere. Sembra."],
      ],
    },
    {
      id: "c9", t: "La marea", w: "In fondo al molo", need: () => bossDone("mar"),
      lines: [
        ["marea", "Ogni sera alle diciannove e trenta controllo le luci del porto e conto le barche che rientrano. Conto anche voi."],
        ["marea", "Una volta mi è capitato un conto che non tornava. Da allora guardo anche la Gabbia illuminata, e so che il molo non è mai del tutto buio."],
        ["voce", "La marea sale sotto il molo. Le luci della Gabbia si riflettono nell'acqua come monete lanciate in alto e mai ricadute."],
        ["marea", "Torna quando vuoi, ragazzo. Ti segno nel registro, alla voce «rientrato»."],
      ],
    },
    {
      id: "c10", t: "Il lucchetto resta aperto", w: "La notte della riapertura", need: () => bossDone("mar") && (EXT.stat.titles > 0 || EXT.stat.cups > 0),
      lines: [
        ["voce", "Notte di riapertura. Nastri appesi alla rete, cartocci vuoti ai pali e una cartolina nuova, appuntata con tre mollette: «Torno presto. Tenete aperto. Elio»."],
        ["tullio", "Ragazzo. Questo lucchetto lo tengo da quarant'anni. Stasera lo togli tu."],
        ["voce", "Il lucchetto cade nel secchio con un clang di sale e di tempo. Nessuno lo raccoglie."],
        ["nives", "(dal balcone, a squarciagola) Fate rumore! Tutto il rumore che volete!"],
        ["cav", "Il Re della Gabbia è chi lascia la porta aperta."],
        ["voce", "La Gabbia resta aperta, di notte: per Elio, per Tano che non apre, per il gabbiano, per chi arriva. Da stasera la palla non rimbalza solo sui muri."],
      ],
    },
    {
      id: "c11", t: "Le sere", w: "Dopo cena", need: () => EXT.daily.best >= 3,
      lines: [
        ["tullio", "Tre sere di fila, ragazzo. Hai gli orari di un custode. Ti stai rovinando."],
        ["gino", "Io ti offro il caffè finto, tu mi offri la compagnia vera. Il bar chiuso sta andando in attivo."],
        ["nives", "Ti ho visto da qui. Fai le sponde troppo vicine al muro. Ma bene."],
        ["voce", "Il gabbiano ti guarda. Poi si volta. Poi torna. È, per lui, un'affettuosa conferma."],
      ],
    },
  ];

  // ---------------------------------------------------------------- salvataggi
  function lsGet(key, def) {
    try { const raw = localStorage.getItem(key); if (!raw) return def; const o = JSON.parse(raw); return o && typeof o === "object" ? o : def; } catch (e) { return def; }
  }
  function lsSet(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  function loadProg() {
    const o = lsGet(KEY_PROG, {});
    const arr = (a) => LEVELS.map((_, i) => Math.max(0, Math.min(3, (a && a[i]) | 0)));
    return { stars: arr(o.stars), coin: arr(o.coin), played: o.played | 0, wins: o.wins | 0, pts: o.pts | 0, bestCombo: o.bestCombo | 0, tut: o.tut ? 1 : 0 };
  }
  function loadSet() {
    const o = lsGet(KEY_SET, {});
    return { ctrl: o.ctrl === "touch" ? "touch" : "stick", diff: [0, 1, 2].indexOf(o.diff) >= 0 ? o.diff : 1, sound: o.sound === 0 ? 0 : 1 };
  }
  let PROG = loadProg(), SET = loadSet();
  const saveProg = () => lsSet(KEY_PROG, PROG);
  const saveSet = () => lsSet(KEY_SET, SET);

  // ---------------------------------------------------------------- salvataggi espansione
  const num = (v, d, a, b) => { v = +v; return isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const dayKey = (d) => { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const todayK = () => (DEBUG && window.__cgdDay) || dayKey();
  const prevK = (k) => { const p = k.split("-").map(Number), d = new Date(p[0], p[1] - 1, p[2]); d.setDate(d.getDate() - 1); return dayKey(d); };
  function defExt() {
    return {
      gt: 0, read: [], pool: ["leo", "nico", "dario"], squad: ["leo", "nico", "dario"],
      cos: { kit: 0, ball: 0, field: 0, tag: 0, own: { kit: [0], ball: [0], field: [0], tag: [0] } },
      daily: { day: "", done: [0, 0, 0], streak: 0, last: "", best: 0, tk: [] }, ex: {},
      coin: {}, boss: {},
      rec: { free: 0, freeW: 0, surv: 0, time: {}, penW: 0, penL: 0, penG: 0, train: 0, daily: 0 },
      opt: { free: { opp: "mer", target: 7, secs: 150, mod: "team" }, surv: { lives: 3, mod: "none" }, time: { secs: 90, opp: "mer", mod: "none" }, pen: { n: 5, opp: "mer" }, train: { opp: "dummy", gr: 0, mod: "none" }, season: { len: 0 } },
      stat: { seasons: 0, titles: 0, cups: 0, seasonGames: 0, cupWins: 0, games: 0, trab: 0 },
    };
  }
  function loadExt() {
    const o = lsGet(KEY_EXT, {}), e = defExt();
    e.gt = num(o.gt, 0, 0, 99999) | 0;
    if (Array.isArray(o.read)) e.read = o.read.filter((x, i, a) => CHAPTERS.some((c) => c.id === x) && a.indexOf(x) === i);
    if (Array.isArray(o.pool)) e.pool = e.pool.concat(o.pool.filter((x) => POOL[x] && POOL[x].rec && e.pool.indexOf(x) < 0));
    if (Array.isArray(o.squad) && o.squad.length === 3 && o.squad.every((x) => e.pool.indexOf(x) >= 0) && new Set(o.squad).size === 3) e.squad = o.squad.slice();
    const oc = o.cos || {};
    [["kit", KITS], ["ball", BALLS], ["field", FIELDS], ["tag", TAGS]].forEach(([k, arr]) => {
      const own = oc.own && Array.isArray(oc.own[k]) ? oc.own[k].filter((i) => Number.isInteger(i) && i >= 0 && i < arr.length) : [];
      if (own.indexOf(0) < 0) own.unshift(0);
      e.cos.own[k] = own;
      const cur = oc[k] | 0; e.cos[k] = cur >= 0 && cur < arr.length ? cur : 0;
    });
    const od = o.daily || {};
    e.daily = { day: typeof od.day === "string" ? od.day : "", done: [0, 1, 2].map((i) => (od.done && od.done[i] ? 1 : 0)), streak: num(od.streak, 0, 0, 9999) | 0, last: typeof od.last === "string" ? od.last : "", best: num(od.best, 0, 0, 9999) | 0, tk: Array.isArray(od.tk) ? od.tk.filter((x) => Array.isArray(x) && DAILY_IDS.indexOf(x[0]) >= 0 && TEAMS_ALL.some((t) => t.id === x[1])).slice(0, 3) : [] };
    if (o.ex && typeof o.ex === "object") TEAMS_ALL.forEach((t) => { if (o.ex[t.id]) e.ex[t.id] = num(o.ex[t.id], 0, 0, 3) | 0; });
    if (o.coin && typeof o.coin === "object") Object.keys(o.coin).forEach((k) => { if (o.coin[k]) e.coin[k] = 1; });
    if (o.boss && typeof o.boss === "object") BOSSES.forEach((b) => { if (o.boss[b.id]) e.boss[b.id] = 1; });
    if (o.rec && typeof o.rec === "object") {
      ["free", "freeW", "surv", "penW", "penL", "penG", "train", "daily"].forEach((k) => { e.rec[k] = num(o.rec[k], 0, 0, 999999) | 0; });
      if (o.rec.time && typeof o.rec.time === "object") Object.keys(o.rec.time).forEach((k) => { e.rec.time[k] = num(o.rec.time[k], 0, 0, 9999) | 0; });
    }
    if (o.opt && typeof o.opt === "object") Object.keys(e.opt).forEach((g) => { const og = o.opt[g]; if (og && typeof og === "object") Object.keys(e.opt[g]).forEach((k) => { if (typeof og[k] === typeof e.opt[g][k]) e.opt[g][k] = og[k]; }); });
    if (o.stat && typeof o.stat === "object") Object.keys(e.stat).forEach((k) => { e.stat[k] = num(o.stat[k], 0, 0, 999999) | 0; });
    return e;
  }
  let EXT = loadExt();
  const saveExt = () => lsSet(KEY_EXT, EXT);

  const starsOf = (i) => PROG.stars[i] | 0;
  const totalGames = () => (PROG.played | 0) + (EXT.stat.games | 0);
  const bossDone = (id) => !!EXT.boss[id];
  const readCh = (id) => EXT.read.indexOf(id) >= 0;
  const chOpen = (c) => { try { return !!c.need(); } catch (e) { return false; } };
  const unreadCount = () => CHAPTERS.filter((c) => chOpen(c) && !readCh(c.id)).length;
  function teamOpen(t) {
    switch (t.id) {
      case "mer": return true; case "sch": return starsOf(0) > 0; case "vec": return starsOf(1) > 0; case "cav": return starsOf(2) > 0;
      case "fri": return starsOf(0) > 0; case "ret": return starsOf(1) > 0; case "geo": return starsOf(2) > 0;
      case "gru": return starsOf(1) > 0; case "nan": return bossDone("gru") && starsOf(2) > 0; case "mar": return bossDone("nan") && starsOf(3) > 0;
      default: return false;
    }
  }
  const openTeams = (boss) => TEAMS_ALL.filter((t) => !!t.boss === !!boss && teamOpen(t));
  const gateOk = (g) => (!g ? true : g === "title" ? EXT.stat.titles > 0 : g === "boss" ? BOSSES.every((b) => bossDone(b.id)) : true);
  const COS = { kit: KITS, ball: BALLS, field: FIELDS, tag: TAGS };
  const cosItem = (k, i) => { const it = COS[k][i]; return typeof it === "string" ? { n: it, p: i ? 1 : 0 } : it; };
  const cosOwned = (k, i) => EXT.cos.own[k].indexOf(i) >= 0 || (cosItem(k, i).p === 0 && gateOk(cosItem(k, i).gate));
  const myTag = () => TAGS[EXT.cos.tag] || "RON";
  function addGt(n) { EXT.gt += n; saveExt(); }
  // monete del gioco: SOLO via window.addCoins e SOLO alla prima vittoria (chiave unica per sfida)
  function giveCoin(key, n) {
    if (EXT.coin[key]) return 0;
    EXT.coin[key] = 1; saveExt();
    if (typeof window.addCoins === "function") { try { window.addCoins(n); } catch (e) { /* ignora */ } }
    return n;
  }
  function moloPt(kind, id) { try { window.dispatchEvent(new CustomEvent("molo:punti", { detail: { mode: "cage", kind: kind, id: String(id) } })); } catch (e) { /* ignora */ } } // Settimana del Molo

  // ---------------------------------------------------------------- stato modulo
  let root = null, cv = null, cx = null, ui = null, stage = null;
  let raf = 0, lastTs = 0, acc = 0, paused = false, closed = true, onExitCb = null;
  let G = null, bgCache = null, vigCache = null, vigKey = "";
  let cleanup = [], timers = [], uiState = "menu";
  const input = { jx: 0, jy: 0, kx: 0, ky: 0, tx: 0, ty: 0, touchOn: false, sprint: false, charging: false, chargeF: 0, passEdge: false, bankEdge: false, shootRel: false, trab: false, keyShoot: false };
  const stick = { id: -1, ox: 0, oy: 0, bx: 0, by: 0 };

  const snd = (name, a) => { if (SET.sound && window.HD2DAudio && typeof window.HD2DAudio[name] === "function") { try { window.HD2DAudio[name](a); } catch (e) { /* ignora */ } } };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const later = (fn, ms) => { const id = setTimeout(() => { timers = timers.filter((x) => x !== id); fn(); }, ms); timers.push(id); return id; };
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  // geometria dipendente dal livello
  function ghw() { return G ? G.fx.mh : 56; }
  function mouth() { const h = ghw(); return [CW / 2 - h, CW / 2 + h]; }
  const goalY = (attTeam) => (attTeam === 0 ? T : B); // porta attaccata da attTeam
  const ownY = (t) => (t === 0 ? B : T);
  const dirY = (t) => (t === 0 ? -1 : 1);
  const uOf = (t, y) => (t === 0 ? (B - y) / LENY : (y - T) / LENY);
  const yOfU = (t, u) => (t === 0 ? B - u * LENY : T + u * LENY);
  const xOfV = (v) => L + v * (R - L);

  // ---------------------------------------------------------------- CSS
  function injectCss() {
    if (document.getElementById("cgd-css")) return;
    const st = document.createElement("style");
    st.id = "cgd-css";
    st.textContent = `
.cgd-root{position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;z-index:999999;display:flex;flex-direction:column;background:#0a0e17;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden;outline:none}
.cgd-root *{box-sizing:border-box}
.cgd-top{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:4px 8px;padding-top:max(4px,env(safe-area-inset-top));background:linear-gradient(#1a1410,#120e0b);border-bottom:1px solid #4a3a28;z-index:30}
.cgd-ib{width:44px;height:44px;border-radius:12px;border:1px solid #6b5338;background:#2a1f15;color:#fff;font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto;padding:0;touch-action:manipulation}
.cgd-ib:active{background:#43301f}
.cgd-sc{flex:1;min-width:0;text-align:center;line-height:1.1}
.cgd-sc b{font:800 22px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;white-space:nowrap}
.cgd-sc small{display:block;font-size:11px;color:#c9b79a;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cgd-ta{color:#7dd3fc}.cgd-tb{color:#fdba74}
.cgd-bars{display:flex;gap:6px;justify-content:center;align-items:center;margin-top:3px}
.cgd-bar{position:relative;width:110px;height:8px;border-radius:5px;background:#2a1f15;overflow:hidden;border:1px solid #6b5338}
.cgd-bar i{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#f59e0b,#fb923c)}
.cgd-bar.full{box-shadow:0 0 8px #fb923c;border-color:#fdba74}
.cgd-cmb{font:800 11px system-ui;color:#fde047;min-width:44px;text-align:left}
.cgd-stage{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
.cgd-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}
.cgd-pad{position:absolute;left:0;top:0;bottom:0;width:56%;z-index:5;touch-action:none}
.cgd-pad.all{width:100%}
.cgd-stk{position:absolute;width:112px;height:112px;margin:-56px 0 0 -56px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(40,25,10,.35);z-index:6;pointer-events:none;opacity:.55;display:none}
.cgd-stk.on{opacity:1;background:rgba(40,25,10,.5)}
.cgd-stk i{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fdba74,#c2410c);border:2px solid #ffedd5;box-shadow:0 3px 8px rgba(0,0,0,.5)}
.cgd-btns{position:absolute;right:0;bottom:0;width:236px;height:240px;z-index:8;pointer-events:none}
.cgd-b{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.55);color:#fff;font-weight:800;font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;box-shadow:0 5px 14px rgba(0,0,0,.55);cursor:pointer;padding:0;line-height:1.05;text-shadow:0 1px 2px #000}
.cgd-b small{font-size:9px;font-weight:600;opacity:.85}
.cgd-b.dn{transform:scale(.93);filter:brightness(1.35)}
.cgd-b.shoot{width:90px;height:90px;right:14px;bottom:max(20px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#fb923c,#c2410c);font-size:16px}
.cgd-b.bank{width:78px;height:78px;right:114px;bottom:max(14px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#38bdf8,#0369a1)}
.cgd-b.pass{width:66px;height:66px;right:20px;bottom:128px;background:radial-gradient(circle at 35% 30%,#a3e635,#4d7c0f);font-size:12px}
.cgd-b.trab{width:66px;height:66px;right:104px;bottom:106px;background:radial-gradient(circle at 35% 30%,#fde047,#dc2626);font-size:12px;display:none;animation:cgdP .6s infinite alternate}
.cgd-b.trab.on{display:flex}
@keyframes cgdP{from{box-shadow:0 0 6px #facc15}to{box-shadow:0 0 24px #f97316}}
.cgd-chg{position:absolute;left:50%;bottom:136px;width:150px;height:10px;margin-left:-75px;border-radius:6px;background:rgba(0,0,0,.55);border:1px solid #fff;z-index:7;display:none;overflow:hidden;pointer-events:none}
.cgd-chg i{display:block;height:100%;width:0;background:linear-gradient(90deg,#fde047,#ef4444)}
.cgd-msg{position:absolute;left:50%;top:12%;transform:translateX(-50%);z-index:9;pointer-events:none;background:rgba(10,14,23,.88);border:1px solid #fb923c;border-radius:12px;padding:7px 14px;font-weight:800;font-size:15px;text-align:center;max-width:92%;display:none}
.cgd-banner{position:absolute;left:0;right:0;top:30%;z-index:12;text-align:center;pointer-events:none;display:none}
.cgd-banner .cgd-bg{display:inline-block;padding:10px 26px 12px;background:linear-gradient(90deg,transparent,rgba(20,12,6,.94) 14%,rgba(20,12,6,.94) 86%,transparent);animation:cgdIn .3s cubic-bezier(.2,1.4,.4,1)}
.cgd-banner h1{margin:0;font:900 40px/1 system-ui,sans-serif;letter-spacing:2px;color:#fde047;text-shadow:0 3px 0 #b45309,0 0 22px rgba(251,146,60,.8)}
.cgd-banner.bad h1{color:#fdba74;text-shadow:0 3px 0 #7c2d12}
.cgd-banner p{margin:6px 0 0;font-size:15px;font-weight:700;color:#f1e6d4}
@keyframes cgdIn{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
.cgd-ui{position:absolute;inset:0;z-index:20;display:none;overflow-y:auto;overflow-x:hidden;background:#0c0804;touch-action:pan-y;-webkit-overflow-scrolling:touch}
.cgd-ui.on{display:block}
.cgd-card{max-width:440px;margin:0 auto;padding:14px 14px calc(18px + env(safe-area-inset-bottom))}
.cgd-card h2{margin:4px 0 2px;font-size:22px;color:#fdba74}
.cgd-card h3{margin:14px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#a8957a}
.cgd-card p{margin:6px 0;font-size:14px;line-height:1.4;color:#e5d9c6}
.cgd-sub{font-size:13px;color:#a8957a}
.cgd-opp{display:flex;align-items:center;gap:10px;width:100%;min-height:58px;margin:6px 0;padding:8px 10px;border-radius:14px;border:1px solid #6b5338;background:#241a10;color:#fff;text-align:left;cursor:pointer;font:inherit;touch-action:manipulation}
.cgd-opp:active{background:#37271a}
.cgd-opp[disabled]{opacity:.45;cursor:default}
.cgd-crest{flex:0 0 38px;height:38px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px}
.cgd-opp b{display:block;font-size:15px}
.cgd-opp span{font-size:12px;color:#c9b79a}
.cgd-opp em{margin-left:auto;font-style:normal;color:#fde047;font-size:15px;letter-spacing:1px;white-space:nowrap}
.cgd-seg{display:flex;gap:6px;margin:4px 0 8px}
.cgd-seg button{flex:1;min-height:44px;border-radius:10px;border:1px solid #6b5338;background:#241a10;color:#e5d9c6;font:700 13px system-ui;cursor:pointer;padding:4px;touch-action:manipulation}
.cgd-seg button.on{background:#c2410c;border-color:#fdba74;color:#fff}
.cgd-btn{display:block;width:100%;min-height:50px;margin:8px 0;border-radius:14px;border:0;background:linear-gradient(#fb923c,#c2410c);color:#fff;font:800 16px system-ui;cursor:pointer;touch-action:manipulation}
.cgd-btn.sec{background:#3a2a1a;border:1px solid #6b5338;font-size:14px}
.cgd-btn.red{background:linear-gradient(#ef4444,#b91c1c)}
.cgd-score{font:900 48px/1 ui-monospace,Menlo,monospace;text-align:center;margin:8px 0;letter-spacing:2px}
.cgd-stars{text-align:center;font-size:30px;color:#fde047;letter-spacing:6px}
.cgd-quote{border-left:3px solid #fb923c;padding:4px 10px;margin:10px 0;color:#f1e6d4;font-style:italic}
.cgd-stat{display:flex;justify-content:space-between;font-size:13px;color:#e5d9c6;border-bottom:1px solid #4a3a28;padding:5px 0}
.cgd-dots{text-align:center;margin:10px 0;color:#5b4a35;font-size:22px}.cgd-dots b{color:#fb923c}
.cgd-rule{background:#2a1f15;border:1px solid #6b5338;border-radius:10px;padding:6px 10px;margin:8px 0;font-size:13px;color:#fdba74}
.cgd-tile{display:flex;flex-direction:column;align-items:flex-start;gap:2px;min-height:76px;padding:8px 10px;border-radius:14px;border:1px solid #6b5338;background:#241a10;color:#fff;text-align:left;cursor:pointer;font:inherit;touch-action:manipulation;position:relative}
.cgd-tile:active{background:#37271a}
.cgd-tile i{font-style:normal;font-size:20px;line-height:1}
.cgd-tile b{font-size:14px}
.cgd-tile span{font-size:11px;color:#c9b79a;line-height:1.25}
.cgd-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
.cgd-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cgd-bdg{display:inline-block;min-width:18px;padding:0 5px;border-radius:9px;background:#ef4444;color:#fff;font:800 11px/18px system-ui;text-align:center}
.cgd-gt{display:inline-block;padding:3px 10px;border-radius:12px;background:#0c4a6e;border:1px solid #38bdf8;color:#bae6fd;font:800 14px system-ui}
.cgd-gtrow{display:flex;align-items:center;gap:8px;margin:6px 0}
.cgd-seg.w{flex-wrap:wrap}.cgd-seg.w button{flex:1 1 calc(50% - 6px)}
.cgd-seg.c button{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:52px}
.cgd-seg.c small{font-size:10px;color:#c9b79a;font-weight:600}
.cgd-seg.c button.on small{color:#ffedd5}
.cgd-opp.pick{border-color:#fde047}
.cgd-note{background:#2a1f15;border:1px solid #fde047;border-radius:10px;padding:6px 10px;margin:8px 0;font-size:13px;color:#fde68a;display:none}
.cgd-tb{border:1px solid #4a3a28;border-radius:10px;overflow:hidden;margin:8px 0;font-size:12px}
.cgd-tr{display:grid;grid-template-columns:22px 1fr 24px 24px 24px 24px 30px 30px;gap:2px;padding:5px 6px;border-bottom:1px solid #3a2c1c;align-items:center;text-align:center}
.cgd-tr span:nth-child(2){text-align:left;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.cgd-tr small{color:#a8957a;font-size:10px}
.cgd-tr.h{background:#2a1f15;color:#a8957a;font-weight:700}.cgd-tr.me{background:#3a2610;color:#fde68a}
.cgd-me{color:#fde047;font-weight:800}
.cgd-sc2{border-left:3px solid #fb923c;padding:6px 12px;margin:12px 0;background:rgba(255,255,255,.04);border-radius:0 10px 10px 0;min-height:110px}
.cgd-sc2 b{font-size:13px}.cgd-sc2 p{font-size:15px}
.cgd-pshoot{position:absolute;left:50%;bottom:max(24px,env(safe-area-inset-bottom));transform:translateX(-50%);width:170px;height:64px;border-radius:32px;border:3px solid #ffedd5;background:radial-gradient(circle at 35% 30%,#fb923c,#c2410c);font:900 20px system-ui;color:#fff;z-index:8;touch-action:none;display:none;align-items:center;justify-content:center;box-shadow:0 5px 14px rgba(0,0,0,.55)}
.cgd-pz{position:absolute;z-index:8;display:none;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:3px}
.cgd-pz button{background:rgba(251,146,60,.16);border:2px dashed rgba(253,186,116,.75);color:#fff;font:800 11px system-ui;touch-action:none;padding:0;cursor:pointer}
.cgd-pz button:active{background:rgba(251,146,60,.5)}
.cgd-root.pen .cgd-btns,.cgd-root.pen .cgd-pad,.cgd-root.pen .cgd-stk{display:none!important}
`;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- sfondo (cache)
  function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function buildBg(mh, fld) {
    fld = fld || FIELDS[0];
    const bw = CW + MX * 2, bh = CH + MY * 2;
    const c = document.createElement("canvas"); c.width = bw; c.height = bh;
    const g = c.getContext("2d");
    g.translate(MX, MY);
    const r = seeded(31);
    // esterno: sera sul porto
    let gr = g.createLinearGradient(0, -MY, 0, CH + MY);
    gr.addColorStop(0, fld.sky[0]); gr.addColorStop(0.5, fld.sky[1]); gr.addColorStop(1, fld.sky[2]);
    g.fillStyle = gr; g.fillRect(-MX, -MY, bw, bh);
    // container in alto
    const cc = ["#7f1d1d", "#1e3a8a", "#14532d", "#78350f", "#4c1d95", "#0f766e"];
    for (let i = 0; i < 6; i++) {
      const x = -MX + i * 108, h = 34 + (i % 3) * 8;
      g.fillStyle = cc[i]; g.fillRect(x, -60 - h * 0.2, 100, h);
      g.fillStyle = "rgba(0,0,0,.25)"; for (let k = 6; k < 100; k += 9) g.fillRect(x + k, -60 - h * 0.2, 2, h);
      g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(x, -60 - h * 0.2, 100, 4);
    }
    g.strokeStyle = "#34415c"; g.lineWidth = 5; g.beginPath(); g.moveTo(430, -86); g.lineTo(430, -30); g.moveTo(380, -86); g.lineTo(520, -86); g.stroke();
    // case in basso con finestre accese
    for (let i = 0; i < 6; i++) {
      const x = -MX + i * 108, h = 44 + (i * 17) % 28;
      g.fillStyle = ["#3b2f40", "#2f3a4a", "#463a34", "#2d3e3a"][i % 4]; g.fillRect(x, CH + 28, 104, h);
      for (let wx = 10; wx < 90; wx += 24) for (let wy = 8; wy < h - 6; wy += 20) { g.fillStyle = r() > 0.4 ? "#fde68a" : "#1b2231"; g.fillRect(x + wx, CH + 28 + wy, 11, 12); }
    }
    // lampioni laterali
    [[-34, 120], [-34, 440], [-34, 760], [CW + 34, 120], [CW + 34, 440], [CW + 34, 760]].forEach(([x, y]) => {
      const rg = g.createRadialGradient(x, y, 2, x, y, 70);
      rg.addColorStop(0, `rgba(${fld.lamp},.5)`); rg.addColorStop(1, `rgba(${fld.lamp},0)`);
      g.fillStyle = rg; g.fillRect(x - 70, y - 70, 140, 140);
      g.fillStyle = "#fef3c7"; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
    });
    // pavimento
    const tile = 54;
    for (let ty = 0; ty < Math.ceil(CH / tile); ty++) for (let tx = 0; tx < Math.ceil(CW / tile); tx++) {
      const v = (tx + ty) % 2; const sh = 36 + v * 5 + Math.floor(r() * 5);
      g.fillStyle = `rgb(${clamp(sh + 4 + fld.fl[0], 0, 255)},${clamp(sh + 8 + fld.fl[1], 0, 255)},${clamp(sh + 20 + fld.fl[2], 0, 255)})`; g.fillRect(tx * tile, ty * tile, tile, tile);
    }
    g.strokeStyle = "rgba(0,0,0,.28)"; g.lineWidth = 1.5;
    for (let x = 0; x <= CW; x += tile) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); }
    for (let y = 0; y <= CH; y += tile) { g.beginPath(); g.moveTo(0, y); g.lineTo(CW, y); g.stroke(); }
    // crepe
    g.strokeStyle = "rgba(0,0,0,.4)"; g.lineWidth = 1.4;
    for (let i = 0; i < 9; i++) { let x = r() * CW, y = r() * CH; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += rnd2(r, -26, 26); y += rnd2(r, 6, 26); g.lineTo(x, y); } g.stroke(); }
    // macchie d'olio e pozzanghere
    for (let i = 0; i < 5; i++) { const x = 60 + r() * (CW - 120), y = 120 + r() * (CH - 240); g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y, 20 + r() * 20, 12 + r() * 12, r() * 3, 0, 7); g.fill(); }
    [[130, 250, 52, 20], [410, 610, 60, 22], [300, 450, 34, 14]].forEach(([x, y, rx, ry]) => {
      const pg = g.createLinearGradient(x - rx, y, x + rx, y);
      pg.addColorStop(0, "rgba(120,170,230,.28)"); pg.addColorStop(1, "rgba(250,220,150,.28)");
      g.fillStyle = pg; g.beginPath(); g.ellipse(x, y, rx, ry, 0.2, 0, 7); g.fill();
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1.5; g.stroke();
    });
    // segni di campo
    g.strokeStyle = "rgba(125,211,252,.75)"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(L, CH / 2); g.lineTo(R, CH / 2); g.stroke();
    g.beginPath(); g.arc(CW / 2, CH / 2, 70, 0, 7); g.stroke();
    g.fillStyle = "rgba(125,211,252,.8)"; g.beginPath(); g.arc(CW / 2, CH / 2, 5, 0, 7); g.fill();
    g.strokeStyle = "rgba(251,146,60,.8)"; g.lineWidth = 4;
    g.beginPath(); g.arc(CW / 2, T, 110, 0, Math.PI); g.stroke();
    g.beginPath(); g.arc(CW / 2, B, 110, Math.PI, Math.PI * 2); g.stroke();
    g.save(); g.translate(CW / 2, CH / 2); g.rotate(-Math.PI / 2); g.fillStyle = "rgba(255,255,255,.1)"; g.font = "900 46px system-ui"; g.textAlign = "center"; g.fillText("GABBIA DEL MOLO", 0, -90); g.restore();
    // muri (fascia perimetrale) con mattoni e graffiti
    g.fillStyle = "#3c3f4d";
    const wall = (x, y, w, h) => { g.fillRect(x, y, w, h); };
    wall(-14, -14, CW + 28, T + 14); wall(-14, B, CW + 28, CH - B + 14); wall(-14, -14, L + 14, CH + 28); wall(R, -14, CW - R + 14, CH + 28);
    g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1;
    for (let y = -14; y < CH + 14; y += 11) { g.beginPath(); g.moveTo(-14, y); g.lineTo(L, y); g.moveTo(R, y); g.lineTo(CW + 14, y); g.stroke(); }
    for (let x = -14; x < CW + 14; x += 18) { g.beginPath(); g.moveTo(x, -14); g.lineTo(x, T); g.moveTo(x, B); g.lineTo(x, CH + 14); g.stroke(); }
    // bordo superiore chiaro dei muri (cordolo)
    g.strokeStyle = "#7c8196"; g.lineWidth = 3; g.strokeRect(L, T, R - L, B - T);
    g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 2; g.strokeRect(L - 2, T - 2, R - L + 4, B - T + 4);
    // graffiti
    const tag = (txt, x, y, rot, col, size) => { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.font = `900 ${size}px system-ui`; g.textAlign = "center"; g.fillText(txt, 0, 0); g.restore(); };
    tag("FORZA MOLO", 11, 200, -Math.PI / 2, "#f472b6", 14); tag("DA BEPPE ♥", 11, 480, -Math.PI / 2, "#fde047", 13); tag("RONDINE", 11, 700, -Math.PI / 2, "#38bdf8", 14);
    tag("CIAO MAMMA", CW - 11, 230, Math.PI / 2, "#a3e635", 13); tag("1987", CW - 11, 450, Math.PI / 2, "#fb923c", 14); tag("NO PARCHEGGIO", CW - 11, 690, Math.PI / 2, "#f87171", 12);
    // porte: bocche nei muri con rete
    [[0, T], [1, B]].forEach(([bottom, y]) => {
      const x0 = CW / 2 - mh, x1 = CW / 2 + mh, s = bottom ? 1 : -1;
      g.fillStyle = "#06080e"; g.fillRect(x0, Math.min(y, y + s * 34), x1 - x0, 34 + (bottom ? 14 : 0));
      g.fillStyle = bottom ? "rgba(56,189,248,.18)" : "rgba(251,146,60,.18)"; g.fillRect(x0, Math.min(y, y + s * 34), x1 - x0, 34);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
      for (let i = x0; i <= x1; i += 8) { g.beginPath(); g.moveTo(i, y); g.lineTo(i, y + s * 34); g.stroke(); }
      for (let k = 0; k <= 34; k += 8) { g.beginPath(); g.moveTo(x0, y + s * k); g.lineTo(x1, y + s * k); g.stroke(); }
      g.lineWidth = 6; g.strokeStyle = bottom ? "#38bdf8" : "#fb923c"; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0, y + s * 34); g.lineTo(x1, y + s * 34); g.lineTo(x1, y); g.stroke();
      g.fillStyle = "#facc15"; g.beginPath(); g.arc(x0, y, 6, 0, 7); g.arc(x1, y, 6, 0, 7); g.fill();
    });
    // rete metallica (sovrapposta ai muri e oltre)
    g.save();
    g.beginPath(); g.rect(-MX, -MY, bw, bh); g.rect(L, T, R - L, B - T); g.clip("evenodd");
    g.strokeStyle = "rgba(180,190,210,.24)"; g.lineWidth = 1;
    for (let k = -bh; k < bw + bh; k += 12) { g.beginPath(); g.moveTo(-MX + k, -MY); g.lineTo(-MX + k + bh, -MY + bh); g.stroke(); g.beginPath(); g.moveTo(-MX + k, -MY + bh); g.lineTo(-MX + k + bh, -MY); g.stroke(); }
    g.restore();
    g.strokeStyle = "#5b6377"; g.lineWidth = 5;
    for (let y = 0; y <= CH; y += 215) { g.beginPath(); g.moveTo(L - 12, y); g.lineTo(L - 12, y + 3); g.moveTo(R + 12, y); g.lineTo(R + 12, y + 3); g.stroke(); }
    // luce dei riflettori
    [[60, 60], [CW - 60, 60], [60, CH - 60], [CW - 60, CH - 60]].forEach(([x, y]) => {
      const rg = g.createRadialGradient(x, y, 10, x, y, 300);
      rg.addColorStop(0, "rgba(255,240,200,.16)"); rg.addColorStop(1, "rgba(255,240,200,0)");
      g.fillStyle = rg; g.fillRect(x - 300, y - 300, 600, 600);
    });
    return c;
  }
  function rnd2(r, a, b) { return a + r() * (b - a); }

  // ---------------------------------------------------------------- partita
  function mkTeam(team, lv) {
    const sq = squadDefs(), kt = KITS[EXT.cos.kit] || KITS[0];
    return SLOT.map((s, i) => {
      const h = team === 0 ? sq[i] : null;
      return {
        team, i, name: team === 0 ? h.name : lv.names[i], role: s.role, bu: s.u, bv: s.v,
        x: xOfV(s.v), y: yOfU(team, s.u), vx: 0, vy: 0, face: team === 0 ? -Math.PI / 2 : Math.PI / 2,
        spd: team === 0 ? h.spd : [4.8, 4.6, 4.4][i], kit: team === 0 ? (kt.k || h.kit) : lv.kit, kit2: team === 0 ? (kt.k2 || h.kit2) : lv.kit2,
        skin: team === 0 ? h.skin : lv.skin[i], hair: team === 0 ? h.hair : ["#1f1a17", "#4a2c12", "#9ca3af"][i],
        tr: team === 0 ? h.tr : "", dcd: team === 0 && h.tr === "scatto" ? 38 : 56, res: team === 0 && h.tr === "tenuta" ? 0.55 : 1,
        stun: 0, cd: 0, dash: 0, dashCd: 0, think: 0, wind: 0, windKind: "", ph: Math.random() * 6, dribT: null,
      };
    });
  }

  const squadDefs = () => EXT.squad.map((id) => POOL[id] || POOL.leo);
  const MODFX = { wet: { frc: 0.9935 }, rubber: { e: 1.0 }, narrow: { mh: 42 }, wide: { mh: 72 }, heavy: { frc: 0.979 }, turbo: { spd: 1.12 }, gold: { bank: 2 }, grint: { gr: 2 } };

  // cfg: { mode, lv, li, di, mod, target, secs, lives, oppSpd, passive, daily, boss }
  function newMatch(cfg) {
    const lv = cfg.lv || LEVELS[0], di = cfg.di == null ? SET.diff : cfg.di;
    const mod = cfg.mod === undefined || cfg.mod === "team" ? (lv.mutKey || "none") : cfg.mod;
    const fx = Object.assign({ frc: 0.988, e: 0.9, mh: 56, spd: 1, gr: 1, bank: 1 }, MODFX[mod] || {});
    fx.mh0 = fx.mh;
    G = {
      li: cfg.li == null ? -1 : cfg.li, lv, D: DIFFS[di], di, cfg, mode: cfg.mode || "tour", tier: lv.tier || 0, mod, fx,
      target: cfg.target == null ? lv.target : cfg.target, secs: cfg.secs == null ? MATCH_SECS : cfg.secs,
      lives: cfg.lives || 0, maxLives: cfg.lives || 0, wave: 1, passive: !!cfg.passive, daily: cfg.daily == null ? null : cfg.daily, boss: lv.boss ? lv.ab : "", bossT: 0, bossCharge: 0,
      state: "kickoff", timer: 70, score: [0, 0], t: 0, golden: false,
      tm: [mkTeam(0, lv), mkTeam(1, lv)], pl: [],
      ball: { x: CW / 2, y: CH / 2, vx: 0, vy: 0, owner: null, lastTeam: 0, lastP: null, passTo: null, bounces: 0, fire: 0, rot: 0, trail: [], bankPass: false },
      ctl: null, ctlLock: 0, chase: [null, null],
      grinta: 30, combo: 0, comboT: 0, intesaT: 0, lastPass: null,
      parts: [], flashes: [], shake: 0, flash: 0, zoom: 1, zx: CW / 2, zy: CH / 2,
      stats: { shots: [0, 0], banks: 0, spallate: 0, bestCombo: 0, intese: 0, spGoals: 0, trab: 0 },
      goalTeam: 0, goalT: 0, ended: false, tick: 0, label: "", labelT: 0, hintBank: false, hintTimer: 0, quipT: 0,
      FRC: fx.frc, E: fx.e,
    };
    G.pl = G.tm[0].concat(G.tm[1]);
    G.ctl = G.tm[0][0];
    G.tm[1].forEach((p) => { p.spd *= lv.spd * G.D.spd * fx.spd * (cfg.oppSpd || 1); });
    G.tm[0].forEach((p) => { p.spd *= G.D.usr * fx.spd; });
    if (G.mode === "pen") { G.state = "play"; G.pen = mkPen(cfg); return G; }
    setupKickoff(0);
    return G;
  }

  function setupKickoff(team) {
    const b = G.ball;
    G.pl.forEach((p) => { p.x = xOfV(p.bv); p.y = yOfU(p.team, p.bu * 0.8); p.vx = p.vy = 0; p.stun = 0; p.cd = 0; p.dash = 0; p.think = 0; p.wind = 0; p.face = p.team === 0 ? -Math.PI / 2 : Math.PI / 2; });
    const k = G.tm[team][0];
    k.x = CW / 2; k.y = CH / 2 - dirY(team) * -30 + dirY(team) * 0; k.y = CH / 2 + (team === 0 ? 32 : -32);
    b.x = CW / 2; b.y = CH / 2; b.vx = b.vy = 0; b.owner = k; b.passTo = null; b.fire = 0; b.bounces = 0; b.lastTeam = team; b.lastP = k; b.trail.length = 0; b.bankPass = false;
    G.state = "kickoff"; G.timer = 70; G.zoom = 1;
    if (team === 0) G.ctl = k;
    G.combo = 0; G.lastPass = null;
    snd("playWhistle", true);
  }

  function say(txt, ms) {
    const el = stage && stage.querySelector(".cgd-msg"); if (!el) return;
    el.textContent = txt; el.style.display = "block"; G.msgT = Math.round((ms || 1400) / 16.67);
  }
  function banner(h, p, bad, ms) {
    const el = stage && stage.querySelector(".cgd-banner"); if (!el) return;
    el.className = "cgd-banner" + (bad ? " bad" : ""); el.innerHTML = `<div class="cgd-bg"><h1>${h}</h1><p>${p || ""}</p></div>`; el.style.display = "block"; G.bannerT = Math.round(ms / 16.67);
  }
  function addGrinta(n) { if (G) G.grinta = clamp(G.grinta + n * G.fx.gr, 0, 100); }
  function spark(x, y, n, col, sp) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, s = rnd(0.5, sp || 3); G.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(14, 30), max: 30, col, size: rnd(1.4, 3.2) }); } }

  // ---------------------------------------------------------------- calci e passaggi
  function kickBall(p, tx, ty, v0, opts) {
    opts = opts || {};
    const b = G.ball;
    const a = Math.atan2(ty - p.y, tx - p.x);
    b.owner = null; b.x = p.x + Math.cos(a) * (PR + 2); b.y = p.y + Math.sin(a) * (PR + 2);
    b.vx = Math.cos(a) * v0; b.vy = Math.sin(a) * v0; b.lastTeam = p.team; b.lastP = p; b.passTo = opts.to || null; b.fire = opts.fire || 0; b.bounces = 0; b.bankPass = !!opts.bank;
    p.cd = 22; p.face = a; b.trail.length = 0;
    snd("playKick", opts.snd || 1);
  }
  function threatAt(p, x, y) { let m = 999; G.tm[1 - p.team].forEach((q) => { const d = dist(q.x, q.y, x, y); if (d < m) m = d; }); return m; }
  function laneClear(p, tx, ty, r) {
    const dx = tx - p.x, dy = ty - p.y, l2 = dx * dx + dy * dy || 1; let m = 999;
    G.tm[1 - p.team].forEach((q) => { let t = ((q.x - p.x) * dx + (q.y - p.y) * dy) / l2; t = clamp(t, 0, 1); const d = dist(q.x, q.y, p.x + dx * t, p.y + dy * t); if (d < m) m = d; });
    return m > (r || 26);
  }
  const passSpeed = (d) => clamp(7.5 + d * 0.014, 9.5, 16);

  function doPass(p, m) {
    const d = dist(p.x, p.y, m.x, m.y), v0 = passSpeed(d) * (p.tr === "passaggio" ? 1.1 : 1);
    const lead = clamp(d / v0, 0, 20) * 0.5;
    kickBall(p, clamp(m.x + m.vx * lead, L + 10, R - 10), clamp(m.y + m.vy * lead, T + 10, B - 10), v0, { to: m, snd: 0.85 });
    G.lastPass = { from: p, to: m, t: G.t };
    if (p.team === 0) { G.ctl = m; G.ctlLock = 18; }
  }

  // sponda: specchia il bersaglio rispetto al muro laterale; ritorna null se impossibile
  function bankPoint(p, tx, ty, side) {
    const wx = side < 0 ? L + BR : R - BR;
    const mx = wx + (wx - tx) / G.E; // il muro smorza la componente orizzontale: specchio "allungato"
    // il punto di impatto sul muro deve stare dentro al campo
    const t = (wx - p.x) / (mx - p.x);
    if (!(t > 0.03 && t < 0.97)) return null;
    const my = ty, yy = p.y + (my - p.y) * t; // y d'impatto sul muro
    if (yy < T + 30 || yy > B - 30) return null;
    return { x: mx, y: my, ix: wx, iy: yy, len: dist(p.x, p.y, wx, yy) + dist(wx, yy, tx, ty) };
  }
  function bestBank(p, tx, ty, prefer) {
    let best = null;
    [-1, 1].forEach((s) => {
      const bp = bankPoint(p, tx, ty, s);
      if (!bp) return;
      let score = -bp.len;
      if (prefer && prefer !== 0 && Math.sign(prefer) === s) score += 220;
      if (!laneClear(p, bp.ix, bp.iy, 22)) score -= 160;
      if (!best || score > best.score) best = Object.assign({ score, side: s }, bp);
    });
    return best;
  }

  function aimGoal(p, noise, jx) {
    const [x0, x1] = mouth();
    let ax = CW / 2;
    if (jx !== undefined && Math.abs(jx) > 0.25) ax = CW / 2 + clamp(jx, -1, 1) * ((x1 - x0) / 2 - 12);
    else {
      // lato più lontano dal difensore
      const q = G.tm[1 - p.team].reduce((m, c) => (Math.abs(c.x - CW / 2) < Math.abs(m.x - CW / 2) ? c : m), G.tm[1 - p.team][0]);
      ax = CW / 2 + (q.x > CW / 2 ? -1 : 1) * ((x1 - x0) * 0.28);
    }
    ax += rnd(-1, 1) * noise;
    return { x: clamp(ax, x0 + 8, x1 - 8), y: goalY(p.team) };
  }

  function userShoot(p, ch, trab) {
    const jx = input.jx + input.kx;
    let intesa = false;
    if (G.lastPass && G.lastPass.to === p && G.t - G.lastPass.t < 3 && G.lastPass.from.i !== p.i && G.lastPass.from.i < 2 && p.i < 2) intesa = true;
    const tgt = aimGoal(p, intesa ? 0 : 3 + ch * 9, jx);
    let v0 = (11 + 8 * ch) * (p.tr === "tiro" ? 1.07 : 1);
    if (intesa) { v0 *= 1.12; G.stats.intese++; addGrinta(14); say("DOPPIETTA " + G.tm[0][0].name.toUpperCase() + "-" + G.tm[0][1].name.toUpperCase() + "!", 1500); spark(p.x, p.y, 20, "#7dd3fc", 4); G.flash = 6; snd("playEmblemCrit"); }
    if (trab) {
      G.grinta = 0;
      kickBall(p, CW / 2, goalY(p.team), 22, { fire: 1, snd: 1.4 });
      G.shake = 10; G.flash = 8; banner("TRABUCCO!", "Niente lo ferma. Nemmeno il buon senso.", false, 1200); snd("playEmblemCrit");
    } else kickBall(p, tgt.x, tgt.y, v0, { snd: 0.9 + ch * 0.4 });
    G.stats.shots[0]++;
  }
  function aiShoot(p) {
    const tgt = aimGoal(p, G.lv.noise + G.D.noise, undefined);
    if (G.boss === "fuoco" && G.bossCharge >= 1) { G.bossCharge = 0; kickBall(p, tgt.x, tgt.y, 21, { fire: 1, snd: 1.4 }); G.stats.shots[1]++; G.shake = 8; say("TRABUCCO DI NANDO!", 1300); return; }
    kickBall(p, tgt.x, tgt.y, rnd(11, 14.5), { snd: 1 });
    G.stats.shots[1]++;
  }

  function mates(p) { return G.tm[p.team].filter((m) => m !== p); }
  function passScore(p, m, hint) {
    const d = dist(p.x, p.y, m.x, m.y);
    if (d < 50 || d > 640) return -9;
    const adv = (uOf(p.team, m.y) - uOf(p.team, p.y)) * LENY;
    const open = clamp(threatAt(p, m.x, m.y), 0, 120) / 120;
    const lane = laneClear(p, m.x, m.y, 26) ? 1 : -0.7;
    let s = adv * 0.003 + open * 0.9 + lane * 0.7 - d * 0.0004;
    if (hint) { const al = ((m.x - p.x) * hint.x + (m.y - p.y) * hint.y) / d; s = al * 2.2 + open * 0.3 + lane * 0.3; if (al < 0.3) s -= 5; }
    return s;
  }
  function bestPass(p, hint) {
    let best = null, bs = -99;
    mates(p).forEach((m) => { const s = passScore(p, m, hint); if (s > bs) { bs = s; best = m; } });
    return best ? { m: best, score: bs } : null;
  }

  // ---------------------------------------------------------------- movimento
  function moveTo(p, tx, ty, mul, tight) {
    const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
    let sp = p.spd * (mul || 1);
    if (d < 36 && !tight) sp *= Math.max(0.15, d / 36);
    const wx = d > 2 ? (dx / d) * sp : 0, wy = d > 2 ? (dy / d) * sp : 0;
    p.vx += (wx - p.vx) * 0.24; p.vy += (wy - p.vy) * 0.24;
  }
  function integrate(p) {
    if (p.stun > 0) { p.stun--; p.vx *= 0.82; p.vy *= 0.82; }
    p.x = clamp(p.x + p.vx, L + PR, R - PR); p.y = clamp(p.y + p.vy, T + PR, B - PR);
    if (p.cd > 0) p.cd--; if (p.dashCd > 0) p.dashCd--;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > 0.5) { p.face = Math.atan2(p.vy, p.vx); p.ph += sp * 0.12; }
  }
  function startDash(p, tx, ty) {
    if (p.dashCd > 0 || p.stun > 0 || p.dash > 0) return false;
    p.dash = 12; p.dashCd = p.dcd || 56; p.face = Math.atan2(ty - p.y, tx - p.x);
    snd("playTackle"); return true;
  }
  function dashStep(p) {
    p.dash--;
    p.vx = Math.cos(p.face) * p.spd * 2.5; p.vy = Math.sin(p.face) * p.spd * 2.5;
    if (p.dash === 0) p.stun = 9;
    // contatto
    G.tm[1 - p.team].forEach((q) => {
      if (q.stun > 18) return;
      if (dist(p.x, p.y, q.x, q.y) < PR * 2 + 4) {
        q.stun = Math.round(38 * (q.res || 1)); q.vx = Math.cos(p.face) * 5; q.vy = Math.sin(p.face) * 5; G.shake = Math.max(G.shake, 4);
        G.stats.spallate += p.team === 0 ? 1 : 0;
        spark(q.x, q.y, 10, "#fde68a", 3); snd("playTackle");
        if (G.ball.owner === q) { if (Math.random() < 0.88) { G.ball.owner = p; G.ball.lastTeam = p.team; G.ball.lastP = p; G.ball.passTo = null; q.cd = 50; if (p.team === 0) { addGrinta(9); say("Spallata! Palla tua", 800); G.ctl = p; G.ctlLock = 12; } } }
        p.dash = 0; p.stun = 4;
      }
    });
  }

  // ---------------------------------------------------------------- IA
  function computeChasers() {
    const b = G.ball, ref = b.owner ? b.owner : { x: b.x + b.vx * 6, y: b.y + b.vy * 6 };
    for (let t = 0; t < 2; t++) {
      let best = null, bd = 1e9;
      G.tm[t].forEach((p) => { if (p === G.ctl) return; const d = dist(p.x, p.y, ref.x, ref.y); if (d < bd) { bd = d; best = p; } });
      G.chase[t] = best;
    }
  }
  function formTarget(p, hasPoss) {
    const b = G.ball, t = p.team, bu = uOf(t, b.y), bv = (b.x - L) / (R - L);
    let u = p.bu + (bu - 0.5) * 0.34 + (hasPoss ? 0.17 : -0.05), v = p.bv + (bv - 0.5) * 0.4;
    if (hasPoss && p.role !== "Muro") v = p.role === "Fronte" ? (bv < 0.5 ? 0.74 : 0.26) : (bv < 0.5 ? 0.3 : 0.7);
    u = p.role === "Muro" ? clamp(u, 0.1, 0.42) : clamp(u, 0.25, 0.9);
    return { x: xOfV(clamp(v, 0.12, 0.88)), y: yOfU(t, u) };
  }

  function updateAI(p) {
    const b = G.ball;
    if (G.passive && p.team === 1) { p.vx *= 0.5; p.vy *= 0.5; integrate(p); return; }
    if (p.stun > 0) { integrate(p); return; }
    if (p.dash > 0) { dashStep(p); integrate(p); return; }
    if (b.owner === p) { aiCarrier(p); integrate(p); return; }
    if (b.passTo === p && !b.owner) { moveTo(p, b.x + b.vx * 6, b.y + b.vy * 6, 1.05, true); integrate(p); return; }
    if (p.role === "Muro" && !b.owner && (p.team === 0 ? b.vy > 2 : b.vy < -2)) { // legge la traiettoria (anche dopo la sponda) e chiude la porta
      const yl = yOfU(p.team, 0.12), dt = (yl - b.y) / b.vy;
      if (dt > 0 && dt < 75) {
        const read = clamp(G.lv.read + (p.team === 1 ? [-0.25, 0, 0.1][G.di] : 0.3), 0, 1);
        if (p.errFor !== b.lastP || p.errBall !== b.bounces) { p.errFor = b.lastP; p.errBall = b.bounces; p.readErr = rnd(-1, 1) * (1 - read) * 100; }
        let xp = b.x + b.vx * dt; const lo = L + BR, hi = R - BR;
        for (let k = 0; k < 3; k++) { if (xp < lo) xp = 2 * lo - xp; else if (xp > hi) xp = 2 * hi - xp; }
        moveTo(p, clamp(xp + p.readErr, CW / 2 - 80, CW / 2 + 80), yl, 1.05 + 0.3 * read, true); integrate(p); return;
      }
    }
    const ot = b.owner ? b.owner.team : -1;
    if (ot !== p.team) {
      const ref = b.owner || { x: b.x + b.vx * 5, y: b.y + b.vy * 5 };
      if (p === G.chase[p.team] && p.role !== "Muro" || (p === G.chase[p.team] && dist(p.x, p.y, ref.x, ref.y) < 200)) {
        moveTo(p, ref.x, ref.y, 1, true);
        if (b.owner && p.team === 1 && dist(p.x, p.y, ref.x, ref.y) < 70 && Math.random() < G.lv.dash + (G.di * 0.003)) startDash(p, ref.x, ref.y);
        if (b.owner && p.team === 0 && dist(p.x, p.y, ref.x, ref.y) < 60 && Math.random() < 0.006) startDash(p, ref.x, ref.y);
      } else {
        const f = formTarget(p, false);
        if (p.role === "Muro") { // si piazza sulla linea palla-porta, a guardia della bocca
          const gx = CW / 2, gy = ownY(p.team), bx = ref.x - gx, by = ref.y - gy, bl = Math.hypot(bx, by) || 1, off = clamp(bl * 0.22, 46, 92);
          f.x = clamp(gx + bx / bl * off, CW / 2 - 70, CW / 2 + 70); f.y = gy + dirY(p.team) * Math.max(26, Math.abs(by / bl) * off);
        }
        moveTo(p, f.x, f.y, p.role === "Muro" ? 1.12 : 0.9, p.role === "Muro");
      }
    } else { const f = formTarget(p, true); moveTo(p, f.x, f.y, 0.95); }
    integrate(p);
  }

  function aiCarrier(p) {
    const b = G.ball, t = p.team;
    if (G.state !== "play") { p.vx *= 0.7; p.vy *= 0.7; return; }
    const gy = goalY(t);
    if (p.wind > 0) { // preparazione del tiro: si ferma un attimo, si può contrastare
      p.wind--; p.vx *= 0.6; p.vy *= 0.6;
      if (p.wind === 0) {
        if (p.windKind === "bank") {
          const [x0, x1] = mouth();
          const bb = bestBank(p, CW / 2 + rnd(-1, 1) * (x1 - x0) * 0.3 + rnd(-1, 1) * (G.lv.noise + G.D.noise), gy, 0);
          if (bb && bb.len < 900) { kickBall(p, bb.x, bb.y, clamp(9.5 + bb.len * 0.011, 10.5, 15.5), { bank: true, snd: 1 }); G.stats.shots[1]++; return; }
        }
        aiShoot(p);
      }
      return;
    }
    if (p.think > 0) { p.think--; const tg = p.dribT || { x: CW / 2, y: gy }; moveTo(p, tg.x, tg.y, 0.94, true); return; }
    p.think = Math.max(5, G.lv.react + G.D.react + Math.floor(Math.random() * 5));
    const dg = dist(p.x, p.y, CW / 2, gy), near = threatAt(p, p.x, p.y);
    if (t === 1) {
      const wl = Math.max(10, 20 - G.di * 3 - (G.tier >= 2 ? 3 : 0));
      if (dg < 330 && laneClear(p, CW / 2, gy, 24) && Math.abs(p.x - CW / 2) < 230) { p.wind = wl; p.windKind = "shoot"; return; }
      if (dg < 170) { p.wind = Math.round(wl * 0.6); p.windKind = "shoot"; return; }
      if (dg > 230 && uOf(1, p.y) > 0.3 && Math.random() < G.lv.bank + G.di * 0.04) { p.wind = wl; p.windKind = "bank"; return; }
    }
    const pass = bestPass(p);
    if (pass && ((near < 56 && pass.score > 0.2) || (pass.score > 1.2 && Math.random() < 0.4))) { if (t === 0 && p === G.ctl) return; doPass(p, pass.m); return; }
    let ax = 0;
    G.tm[1 - t].forEach((q) => { const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy); if (d < 110 && dy * dirY(t) > -10) { const w = (110 - d) / 110; ax -= Math.sign(dx || (Math.random() - 0.5)) * w * 170; } });
    p.dribT = { x: clamp(CW / 2 + (p.x - CW / 2) * 0.4 + ax, L + 30, R - 30), y: gy };
  }

  // ---------------------------------------------------------------- utente
  function userUpdate(p) {
    const b = G.ball;
    if (p.stun > 0) { integrate(p); return; }
    if (p.dash > 0) { dashStep(p); integrate(p); return; }
    let jx = input.jx + input.kx, jy = input.jy + input.ky, mag = Math.hypot(jx, jy);
    if (input.touchOn && SET.ctrl === "touch") {
      const dx = input.tx - p.x, dy = input.ty - p.y, d = Math.hypot(dx, dy);
      if (d > 10) { jx = dx / d; jy = dy / d; mag = Math.min(1, d / 36); } else { jx = jy = mag = 0; }
    }
    if (mag > 1) { jx /= mag; jy /= mag; mag = 1; }
    const sp = p.spd * (b.owner === p ? 0.95 : 1);
    if (mag > 0.12) { const m2 = Math.min(1, mag * 1.15); p.vx += (jx / mag * sp * m2 - p.vx) * 0.3; p.vy += (jy / mag * sp * m2 - p.vy) * 0.3; }
    else { p.vx *= 0.7; p.vy *= 0.7; }
    integrate(p);
  }

  function canTouch(p) { const b = G.ball; return b.owner === p || (!b.owner && dist(p.x, p.y, b.x, b.y) < 34 && p.cd <= 0); }

  function userActions() {
    const p = G.ctl, b = G.ball;
    if (G.state !== "play" && G.state !== "kickoff") { input.passEdge = input.bankEdge = input.shootRel = input.trab = false; return; }
    if (input.charging) input.chargeF++;
    const touch = canTouch(p);
    if (input.passEdge) {
      input.passEdge = false;
      if (touch) {
        let hint = null; const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
        if (mg > 0.3) hint = { x: jx / mg, y: jy / mg };
        const bp = bestPass(p, hint) || bestPass(p);
        if (bp) { doPass(p, bp.m); addGrinta(1.5); }
      } else {
        const o = b.owner && b.owner.team === 1 ? b.owner : null;
        const tx = o ? o.x : b.x, ty = o ? o.y : b.y;
        startDash(p, dist(p.x, p.y, tx, ty) < 240 ? tx : p.x + Math.cos(p.face) * 80, dist(p.x, p.y, tx, ty) < 240 ? ty : p.y + Math.sin(p.face) * 80);
      }
    }
    if (input.bankEdge) {
      input.bankEdge = false;
      if (touch) userBank(p);
    }
    if (input.shootRel) {
      input.shootRel = false;
      const ch = clamp(input.chargeF / 30, 0.2, 1); input.chargeF = 0;
      if (touch) userShoot(p, ch, false);
    }
    if (input.trab) { input.trab = false; if (G.grinta >= 100 && touch) userShoot(p, 1, true); }
  }

  function userBank(p) {
    const jx = input.jx + input.kx;
    const [x0, x1] = mouth();
    const inAtt = uOf(0, p.y) > 0.42;
    let tx, ty, to = null;
    if (inAtt) { tx = CW / 2 + rnd(-1, 1) * (x1 - x0) * 0.3 + rnd(-1, 1) * 9; ty = goalY(0); }
    else {
      const bp = bestPass(p, null); if (!bp) { tx = CW / 2; ty = goalY(0); } else { to = bp.m; tx = to.x; ty = to.y; }
    }
    const bb = bestBank(p, tx, ty, jx > 0.3 ? 1 : jx < -0.3 ? -1 : 0);
    if (!bb) { // nessuna sponda utile: tiro/passaggio normale
      if (to) doPass(p, to); else userShoot(p, 0.7, false);
      return;
    }
    const v0 = clamp(10.5 + bb.len * 0.0115, 11, 17.5);
    kickBall(p, bb.x, bb.y, v0, { bank: true, to, snd: 1 });
    if (to) { G.lastPass = { from: p, to, t: G.t }; G.ctl = to; G.ctlLock = 25; G.ball.bankPass = true; } else G.stats.shots[0]++;
    G.stats.banks++;
    if (p.tr === "sponda") addGrinta(3);
  }

  // ---------------------------------------------------------------- palla
  function wallFlash(x, y, vertical) { G.flashes.push({ x, y, v: vertical, life: 14 }); }
  function updateBall() {
    const b = G.ball;
    b.rot += Math.hypot(b.vx, b.vy) * 0.09;
    if (b.owner) {
      const o = b.owner;
      const ox = o.x + Math.cos(o.face) * (PR + 5), oy = o.y + Math.sin(o.face) * (PR + 5);
      b.x += (ox - b.x) * 0.5; b.y += (oy - b.y) * 0.5; b.vx = o.vx; b.vy = o.vy; b.lastTeam = o.team; b.lastP = o; b.fire = 0;
      b.x = clamp(b.x, L + BR, R - BR); b.y = clamp(b.y, T + BR, B - BR);
      return;
    }
    const sp0 = Math.hypot(b.vx, b.vy);
    b.vx *= G.FRC; b.vy *= G.FRC;
    b.x += b.vx; b.y += b.vy;
    if (b.fire || sp0 > 12) { b.trail.unshift({ x: b.x, y: b.y }); if (b.trail.length > 12) b.trail.pop(); } else if (b.trail.length) b.trail.pop();
    if (b.fire) {
      if (Math.random() < 0.7) G.parts.push({ x: b.x, y: b.y, vx: rnd(-.6, .6), vy: rnd(-.6, .6), life: 18, max: 18, col: "#fb923c", size: 3 });
      G.pl.forEach((q) => { if (q.team !== b.lastTeam && q.stun < 20 && dist(q.x, q.y, b.x, b.y) < PR + BR + 4) { q.stun = Math.round(46 * (q.res || 1)); q.vx = b.vx * 0.35; q.vy = b.vy * 0.35; spark(q.x, q.y, 10, "#fde047", 4); snd("playTackle"); } });
      if (Math.hypot(b.vx, b.vy) < 9) b.fire = 0;
    }
    // cap velocità
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > 24) { b.vx *= 24 / sp; b.vy *= 24 / sp; }
    // muri laterali
    const E = G.E;
    if (b.x < L + BR) { b.x = L + BR; b.vx = Math.abs(b.vx) * E; onBounce(b.x - BR, b.y, true); }
    else if (b.x > R - BR) { b.x = R - BR; b.vx = -Math.abs(b.vx) * E; onBounce(b.x + BR, b.y, true); }
    // porte / muri alto e basso
    const [x0, x1] = mouth();
    if (G.state === "play") {
      if (b.y < T + BR || b.y > B - BR) {
        const top = b.y < CH / 2;
        const inMouth = b.x > x0 + 6 && b.x < x1 - 6;
        if (inMouth) {
          if ((top && b.y < T - 2) || (!top && b.y > B + 2)) { goalScored(top ? 0 : 1); return; }
        } else {
          if (top) { b.y = T + BR; b.vy = Math.abs(b.vy) * E; } else { b.y = B - BR; b.vy = -Math.abs(b.vy) * E; }
          onBounce(b.x, top ? T : B, false);
        }
      }
      // pali
      [x0, x1].forEach((px) => { [T, B].forEach((py) => { const d = dist(b.x, b.y, px, py); if (d < BR + 5) { const nx = (b.x - px) / (d || 1), ny = (b.y - py) / (d || 1); const dot = b.vx * nx + b.vy * ny; if (dot < 0) { b.vx -= 1.9 * dot * nx; b.vy -= 1.9 * dot * ny; b.x = px + nx * (BR + 5); b.y = py + ny * (BR + 5); snd("playPost"); G.shake = Math.max(G.shake, 4); say("PALO!", 700); spark(px, py, 8, "#fff", 3); } } }); });
    }
  }
  function onBounce(x, y, vertical) {
    const b = G.ball;
    b.bounces++;
    snd("playWall"); wallFlash(x, y, vertical);
    spark(x, y, 5, "#fde68a", 2.2);
    if (b.lastTeam === 0) addGrinta(2.5);
  }

  function pickups() {
    const b = G.ball;
    if (b.owner || G.state !== "play") return;
    let best = null, bd = 1e9; const sp = Math.hypot(b.vx, b.vy);
    G.pl.forEach((p) => {
      if (p.stun > 0 || p.cd > 0 || p.dash > 0) return;
      if (G.passive && p.team === 1) return;
      if (b.fire && p.team !== b.lastTeam) return;
      let R2 = PR + BR + 3; if (b.passTo === p) R2 += 8; if (p === G.ctl) R2 += 3; if (sp > 16) R2 -= 5;
      const d = dist(p.x, p.y, b.x, b.y);
      if (d < R2 && d < bd) { bd = d; best = p; }
    });
    if (best) {
      const prev = b.lastTeam, prevPass = G.lastPass, bounced = b.bounces > 0;
      b.owner = best; b.lastTeam = best.team; b.lastP = best; b.fire = 0;
      if (best.team === 0) {
        G.ctl = best;
        if (prevPass && prevPass.to === best && prev === 0) {
          addGrinta(4);
          if (bounced && b.bankPass) { G.combo++; G.comboT = 360; addGrinta(7); say(G.combo >= 2 ? `Sponda! Combo x${G.combo}` : "Sponda!", 1000); if (G.combo > G.stats.bestCombo) G.stats.bestCombo = G.combo; }
          if (prevPass.from.i !== best.i && prevPass.from.i < 2 && best.i < 2) { G.intesaT = 150; addGrinta(4); say("Una-due " + G.tm[0][0].name + "-" + G.tm[0][1].name + "!", 900); }
        }
      } else if (prev === 0 && G.combo) { G.combo = 0; }
      b.passTo = null; b.bounces = 0; b.bankPass = false;
    }
  }

  // ---------------------------------------------------------------- gol
  function goalScored(scoreFor) {
    const b = G.ball, scorer = b.lastTeam === scoreFor ? b.lastP : null;
    const bounced = b.bounces > 0 && b.lastTeam === scoreFor;
    let pts = 1 + (bounced ? G.fx.bank : 0);
    if (b.fire) pts = Math.max(pts, 2);
    G.score[scoreFor] += pts; G.goalTeam = scoreFor; G.goalPts = pts;
    if (scoreFor === 0 && b.fire) G.stats.trab++;
    if (scoreFor === 1 && G.mode === "surv") G.lives = Math.max(0, G.lives - 1);
    G.state = "goal"; G.goalT = 0; G.shake = 11; G.flash = 8;
    G.zx = b.x; G.zy = b.y < CH / 2 ? T + 95 : B - 95;
    spark(b.x, b.y, 36, scoreFor === 0 ? "#7dd3fc" : "#fdba74", 5);
    snd("playGoal");
    const nm = scorer ? scorer.name : "Autorete";
    const tag = b.fire ? "TRABUCCO " : bounced ? "SPONDA " : "";
    if (scoreFor === 0) { banner(pts > 1 ? `${tag}+${pts}!` : "GOOOL!", `${nm} · ${fmtTime()}`, false, 1900); if (bounced) G.stats.spGoals++; }
    else banner(pts > 1 ? `${tag}+${pts} ${G.lv.tag}` : "GOL " + G.lv.tag, `${nm} · ${fmtTime()}`, true, 1700);
    if (scoreFor === 1) addGrinta(12);
    if (G.t - G.quipT > 9 && Math.random() < 0.45) { G.quipT = G.t; say(pickQ(scoreFor === 0 ? QUIP.goal : QUIP.conc), 2600); }
    b.owner = null; b.passTo = null; b.fire = 0; b.vx *= 0.3; b.vy *= 0.3;
    G.combo = 0;
  }
  function fmtTime() { const s = Math.floor(G.t); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

  // ---------------------------------------------------------------- step
  function step() {
    G.tick++;
    if (G.shake > 0) G.shake *= 0.9;
    if (G.flash > 0) G.flash--;
    if (G.msgT > 0 && --G.msgT === 0) { const el = stage.querySelector(".cgd-msg"); if (el) el.style.display = "none"; }
    if (G.bannerT > 0 && --G.bannerT === 0) { const el = stage.querySelector(".cgd-banner"); if (el) el.style.display = "none"; }
    for (let i = G.parts.length - 1; i >= 0; i--) { const q = G.parts[i]; q.x += q.vx; q.y += q.vy; q.life--; if (q.life <= 0) G.parts.splice(i, 1); }
    for (let i = G.flashes.length - 1; i >= 0; i--) { if (--G.flashes[i].life <= 0) G.flashes.splice(i, 1); }
    if (G.ctlLock > 0) G.ctlLock--;
    if (G.comboT > 0 && --G.comboT === 0) G.combo = 0;
    if (G.intesaT > 0) G.intesaT--;
    const st = G.state;
    if (st === "end") return;
    if (G.mode === "pen") { stepPen(); return; }
    if (st === "kickoff") {
      G.timer--; G.pl.forEach(integrate); updateBall();
      const moved = Math.abs(input.jx + input.kx) + Math.abs(input.jy + input.ky) > 0.3 || input.passEdge || input.shootRel || input.touchOn || input.bankEdge;
      if (G.timer <= 0 || (G.ball.owner && G.ball.owner.team === 0 && moved)) { G.state = "play"; G.timer = 0; }
      return;
    }
    if (st === "goal") {
      G.goalT++;
      const b = G.ball; b.vx *= 0.88; b.vy *= 0.88; b.x += b.vx; b.y += b.vy; b.x = clamp(b.x, CW / 2 - ghw() + 8, CW / 2 + ghw() - 8); b.y = clamp(b.y, T - 30, B + 30);
      G.pl.forEach((p) => { p.vx *= 0.9; p.vy *= 0.9; integrate(p); });
      if (G.goalT > 62) afterGoal();
      return;
    }
    // play
    G.t += STEP * (DEBUG && window.__cgdTS ? window.__cgdTS : 1);
    if (G.boss) bossTick();
    if (G.mode === "train" && G.cfg.gr) G.grinta = 100;
    if (endCheck()) return;
    chooseControl(); computeChasers();
    G.pl.forEach((p) => { if (p === G.ctl) userUpdate(p); else updateAI(p); });
    separate(); updateBall(); if (G.state !== "play") return;
    userActions(); pickups();
    if (G.tier <= 0 && G.mode !== "train" && !G.hintBank && G.t > 14) { G.hintBank = true; say("Prova SPONDA: la palla rimbalza sul muro e vale doppio!", 3200); }
  }

  function chooseControl() {
    const b = G.ball;
    if (b.owner && b.owner.team === 0) { G.ctl = b.owner; return; }
    if (b.passTo && b.passTo.team === 0 && !b.owner) { G.ctl = b.passTo; return; }
    if (G.ctlLock > 0) return;
    const ref = b.owner ? b.owner : { x: b.x + b.vx * 6, y: b.y + b.vy * 6 };
    let best = null, bd = 1e9;
    G.tm[0].forEach((p) => { const d = dist(p.x, p.y, ref.x, ref.y); if (d < bd) { bd = d; best = p; } });
    const cd = dist(G.ctl.x, G.ctl.y, ref.x, ref.y);
    if (best !== G.ctl && bd < cd - 30) { G.ctl = best; G.ctlLock = 12; }
  }
  function separate() {
    const pl = G.pl;
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
      const a = pl[i], c = pl[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy);
      if (d < PR * 2 && d > 0.01) { const o = (PR * 2 - d) * 0.3; a.x -= dx / d * o; a.y -= dy / d * o; c.x += dx / d * o; c.y += dy / d * o; }
    }
  }
  function endCheck() {
    const m = G.mode;
    if (m === "train") return false;
    if (m === "surv") { if (G.lives <= 0) { endMatch(); return true; } return false; }
    if (G.score[0] >= G.target || G.score[1] >= G.target) { endMatch(); return true; }
    if (G.secs && G.t >= G.secs && !G.golden) {
      if (m === "time" || G.score[0] !== G.score[1]) { endMatch(); return true; }
      G.golden = true; banner("PUNTO D'ORO", "Il prossimo punto vince", false, 1600); snd("playWhistle", true);
    }
    if (G.golden && G.t >= G.secs + 30 && !G.cfg.noDraw) { endMatch(); return true; }
    return false;
  }
  // abilità dei boss di quartiere
  function bossTick() {
    G.bossT++;
    const f = G.bossT, fx = G.fx;
    if (G.boss === "gru") { const ph = f % 1800, on = ph > 1500; fx.mh = on ? 34 : fx.mh0; if (ph === 1500) say("IL CASSONE! La porta si restringe", 1800); }
    else if (G.boss === "marea") { const ph = f % 1500, on = ph > 1020; G.FRC = on ? 0.9935 : fx.frc; if (ph === 1020) say("ALTA MAREA! Pavimento bagnato", 1800); }
    else if (G.boss === "fuoco") { if (f % 2400 === 2399) { G.bossCharge = 1; say("Il Trabucco di Nando è carico!", 1800); } }
  }
  function nextWave() {
    G.wave++;
    const t = WAVE_SEQ[(G.wave - 1) % WAVE_SEQ.length], k = G.wave - 1, ramp = Math.min(0.28, 0.025 * k);
    const lv = Object.assign({}, t, { react: Math.max(5, t.react - Math.floor(k / 2)), noise: Math.max(6, t.noise - k) });
    G.lv = lv; G.tier = Math.min(3, lv.tier || 0);
    G.tm[1] = mkTeam(1, lv); G.tm[1].forEach((p) => { p.spd *= lv.spd * G.D.spd * G.fx.spd * (1 + ramp); });
    G.pl = G.tm[0].concat(G.tm[1]); G.chase = [null, null];
    banner("ONDATA " + G.wave, esc(lv.name), false, 1500);
  }
  function afterGoal() {
    const el = stage.querySelector(".cgd-banner"); if (el) el.style.display = "none";
    if (G.mode === "surv") { if (G.lives <= 0) { endMatch(); return; } if (G.goalTeam === 0) nextWave(); setupKickoff(1 - G.goalTeam); return; }
    if (G.mode === "train") { setupKickoff(0); return; }
    if (G.golden || G.score[0] >= G.target || G.score[1] >= G.target) { endMatch(); return; }
    setupKickoff(1 - G.goalTeam);
  }
  function endMatch() {
    if (G.ended) return;
    G.ended = true; G.state = "end"; snd("playWhistle", true);
    banner("FINE!", `${G.score[0]} - ${G.score[1]}`, false, 2200);
    later(() => { if (!closed) showResult(); }, 1600);
  }

  // ---------------------------------------------------------------- rigori (mini-partita a sé)
  const PZ = [[-1, 1], [0, 1], [1, 1], [-1, 0], [0, 0], [1, 0]]; // colonna, riga (1 = alto)
  function mkPen(cfg) {
    const di = G.di;
    return {
      n: cfg.n || 5, side: 0, taken: [0, 0], hist: [[], []], sd: false, ph: "intro", t: 0, over: false,
      cur: { x: 0, y: 0.5 }, aim: null, kz: null, res: "", tgt: null, dive: null, oz: null, o0: "on", tellC: 0, dAt: 0, rect: { x: 0, y: 0, w: 100, h: 50 }, uiKey: "",
      sx: 0.036 + 0.007 * G.tier + 0.004 * di, sy: 0.052 + 0.006 * G.tier + 0.004 * di,
    };
  }
  const penCol = (x) => (x < -0.33 ? -1 : x > 0.33 ? 1 : 0);
  function setPh(ph) { const P = G.pen; P.ph = ph; P.t = 0; penUiSync(); }
  function penUiSync() {
    if (!root || !G || G.mode !== "pen") return;
    const P = G.pen, sh = root.querySelector(".cgd-pshoot"), pz = root.querySelector(".cgd-pz");
    if (!sh || !pz) return;
    sh.style.display = P.ph === "aim" && !P.over ? "flex" : "none";
    pz.style.display = P.side === 1 && (P.ph === "tell" || P.ph === "fly") && !P.over ? "grid" : "none";
  }
  function prepOppShot() {
    const P = G.pen, r = Math.random(), col = r < 0.38 ? -1 : r < 0.62 ? 0 : 1, row = Math.random() < 0.5 ? 1 : 0, q = Math.random();
    const wideP = 0.1 - G.tier * 0.02, postP = 0.05;
    P.oz = { c: col, r: row }; P.o0 = q < wideP ? "wide" : q < wideP + postP ? "post" : "on";
    P.tellC = Math.random() < 0.62 ? col : [-1, 0, 1][Math.floor(Math.random() * 3)];
    P.dive = null; P.kz = null;
  }
  function penShoot() {
    if (!G || G.mode !== "pen") return; const P = G.pen;
    if (P.ph !== "aim" || P.over) return;
    const a = { x: P.cur.x, y: P.cur.y }; P.aim = a; G.stats.shots[0]++;
    const zc = penCol(a.x), zr = a.y > 0.5 ? 1 : 0;
    let r = "goal";
    if (Math.abs(a.x) > 1.06 || a.y > 1.02) r = "wide";
    else if (Math.abs(a.x) > 0.95 || a.y > 0.94) r = "post";
    else {
      const pg = 0.2 + 0.06 * G.tier + 0.05 * G.di;
      const kz = Math.random() < pg ? { c: zc, r: zr } : (() => { const z = PZ[Math.floor(Math.random() * 6)]; return { c: z[0], r: z[1] }; })();
      P.kz = kz; const edge = Math.abs(a.x) > 0.8;
      if (kz.c === zc && kz.r === zr) r = edge && Math.random() < 0.45 ? "goal" : "save";
      else if (kz.c === zc && !edge && Math.random() < 0.3) r = "save";
    }
    if (!P.kz) P.kz = { c: [-1, 0, 1][Math.floor(Math.random() * 3)], r: Math.random() < 0.5 ? 1 : 0 };
    P.res = r; P.dAt = G.tick; snd("playKick", 1.1); setPh("fly");
  }
  function penDive(c, r) {
    if (!G || G.mode !== "pen") return; const P = G.pen;
    if (P.over || P.side !== 1 || P.dive || !(P.ph === "tell" || (P.ph === "fly" && P.t < 14))) return;
    P.dive = { c, r }; P.dAt = G.tick; snd("playTackle");
  }
  function penResolveOpp() {
    const P = G.pen, o = P.oz, d = P.dive;
    let r = P.o0 === "on" ? "goal" : P.o0;
    if (r === "goal" && d) { if (d.c === o.c && d.r === o.r) r = "save"; else if (d.c === o.c && Math.random() < 0.35) r = "save"; }
    P.res = r; P.kz = d || { c: 0, r: 0 };
  }
  function penFinish() { // il tiro è arrivato: aggiorna segnapunti
    const P = G.pen, side = P.side, r = P.res;
    if (r === "goal") { G.score[side]++; G.shake = 7; snd("playGoal"); } else snd(r === "post" ? "playPost" : "playWhistle");
    P.hist[side].push(r === "goal" ? 1 : 0);
    const nm = side === 0 ? myTag() : G.lv.tag;
    const txt = { goal: "GOL!", save: "PARATA!", post: "PALO!", wide: "FUORI!" }[r];
    banner(txt, `${nm} · ${G.score[0]} - ${G.score[1]}`, side === 1 && r === "goal", 1000);
    if (side === 0 && r === "save") say(pickQ(["Il portiere si rialza con la palla e uno sguardo da film.", "Parata. Dal balcone, Nives: «Bravo, il portiere!»", "Il gabbiano è passato dietro la porta, per vedere meglio."]), 2200);
    setPh("res");
  }
  function penAdvance() {
    const P = G.pen; P.taken[P.side]++;
    const [a, b] = G.score, ta = P.taken[0], tb = P.taken[1], n = P.n;
    let fin = false;
    if (!P.sd) {
      if (a > b + (n - tb) || b > a + (n - ta)) fin = true;
      else if (ta >= n && tb >= n) { if (a !== b) fin = true; else { P.sd = true; say("A OLTRANZA: chi sbaglia perde", 1600); } }
    } else if (ta === tb && a !== b) fin = true;
    else if (ta >= n + 12 && tb >= n + 12) { G.score[Math.random() < 0.5 ? 0 : 1]++; fin = true; }
    if (fin) { P.over = true; penUiSync(); endMatch(); return; }
    P.side = 1 - P.side; P.aim = null; P.dive = null; P.res = ""; P.kz = null; setPh("intro");
  }
  function stepPen() {
    const P = G.pen; if (P.over) { P.t++; return; }
    P.t++;
    const t = P.t;
    if (P.ph === "intro") {
      if (t === 2) say(P.side === 0 ? "Tocca a te: ferma il mirino e TIRA" : "Tocca a loro: tocca dove tuffarti!", 1500);
      if (t > 50) { if (P.side === 0) { setPh("aim"); } else { prepOppShot(); setPh("tell"); } }
    } else if (P.ph === "aim") {
      P.cur.x = Math.sin(t * P.sx) * 1.2; P.cur.y = 0.5 + Math.sin(t * P.sy + 1) * 0.62;
      if (t > 60 * 12) penShoot(); // il tempo c'è: dopo 12 secondi tira da solo
    } else if (P.ph === "tell") {
      if (t > 72) { snd("playKick", 1.1); setPh("fly"); }
    } else if (P.ph === "fly") {
      if (P.side === 1 && t === 15) penResolveOpp();
      if (t >= 34) penFinish();
    } else if (P.ph === "res") { if (t > 62) { const el = stage.querySelector(".cgd-banner"); if (el) el.style.display = "none"; penAdvance(); } }
  }
  function renderPen(g, cw, ch) {
    const P = G.pen, gw = Math.min(cw * 0.84, 340), gh = gw * 0.46, gx = (cw - gw) / 2, gy = Math.max(84, ch * 0.15), fy = gy + gh;
    P.rect = { x: gx, y: gy, w: gw, h: gh };
    const key = [gx, gy, gw, gh].map(Math.round).join(","); if (P.uiKey !== key && root) { P.uiKey = key; const pz = root.querySelector(".cgd-pz"); if (pz) { pz.style.left = gx + "px"; pz.style.top = gy + "px"; pz.style.width = gw + "px"; pz.style.height = gh + "px"; } }
    const fld = FIELDS[EXT.cos.field] || FIELDS[0];
    let gr = g.createLinearGradient(0, 0, 0, ch); gr.addColorStop(0, fld.sky[0]); gr.addColorStop(0.5, "#2b2f42"); gr.addColorStop(1, "#171b27"); g.fillStyle = gr; g.fillRect(0, 0, cw, ch);
    g.fillStyle = "#3c3f4d"; g.fillRect(0, gy - 30, cw, gh + 34);
    g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1;
    for (let y = gy - 30; y < fy + 4; y += 11) { g.beginPath(); g.moveTo(0, y); g.lineTo(cw, y); g.stroke(); }
    for (let x = 0; x < cw; x += 18) { g.beginPath(); g.moveTo(x, gy - 30); g.lineTo(x, fy + 4); g.stroke(); }
    g.fillStyle = "#262b3a"; g.fillRect(0, fy, cw, ch - fy);
    g.strokeStyle = "rgba(125,211,252,.18)";
    for (let k = -7; k <= 7; k++) { g.beginPath(); g.moveTo(cw / 2 + k * gw * 0.07, fy); g.lineTo(cw / 2 + k * cw * 0.2, ch); g.stroke(); }
    for (let k = 1; k < 8; k++) { const y = fy + (ch - fy) * Math.pow(k / 8, 1.7); g.beginPath(); g.moveTo(0, y); g.lineTo(cw, y); g.stroke(); }
    // porta con rete
    g.fillStyle = "#06080e"; g.fillRect(gx, gy, gw, gh);
    g.strokeStyle = "rgba(255,255,255,.28)"; g.lineWidth = 1;
    for (let x = gx; x <= gx + gw; x += 9) { g.beginPath(); g.moveTo(x, gy); g.lineTo(x, fy); g.stroke(); }
    for (let y = gy; y <= fy; y += 9) { g.beginPath(); g.moveTo(gx, y); g.lineTo(gx + gw, y); g.stroke(); }
    const sq = squadDefs(), kt = KITS[EXT.cos.kit] || KITS[0], oc = { kit: G.lv.kit, kit2: G.lv.kit2, skin: G.lv.skin[0], hair: "#1f1a17" };
    const ours = (i) => { const h = sq[i % 3]; return { kit: kt.k || h.kit, kit2: kt.k2 || h.kit2, skin: h.skin, hair: h.hair }; };
    const person = (x, y, sc, c, face, ph, rot) => { g.save(); g.translate(x, y); if (rot) g.rotate(rot); g.scale(sc, sc); drawPlayer(g, { x: 0, y: 0, vx: 0, vy: 0, ph: ph || 0, dash: 0, face, kit: c.kit, kit2: c.kit2, skin: c.skin, hair: c.hair, name: "", wind: 0, stun: 0 }, false, G.tick); g.restore(); };
    const zx = (c) => gx + gw / 2 + c * gw * 0.33, zy = (r) => gy + gh * (r ? 0.36 : 0.76);
    // portiere
    const kc = P.side === 0 ? oc : ours(2);
    let kx = gx + gw / 2, ky = fy - 14, krot = 0;
    const dz = P.side === 0 ? (P.aim ? P.kz : null) : P.dive;
    if (dz) { const kk = clamp((G.tick - P.dAt) / 10, 0, 1); kx += (zx(dz.c) - kx) * kk; ky += (zy(dz.r) - ky) * kk * 0.8; krot = dz.c * 0.9 * kk; }
    person(kx, ky, 2.2, kc, Math.PI / 2, 0, krot);
    g.strokeStyle = "#fb923c"; g.lineWidth = 6; g.beginPath(); g.moveTo(gx, fy); g.lineTo(gx, gy); g.lineTo(gx + gw, gy); g.lineTo(gx + gw, fy); g.stroke();
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(gx, gy, 6, 0, 7); g.arc(gx + gw, gy, 6, 0, 7); g.fill();
    // dischetto, tiratore e palla
    const sx = cw / 2, sy = Math.min(ch * 0.72, fy + (ch - fy) * 0.5);
    g.fillStyle = "#fde68a"; g.beginPath(); g.ellipse(sx, sy, 7, 3, 0, 0, 7); g.fill();
    let bx = sx, by = sy - 6, br = 11, tgt = null;
    if (P.side === 0 && P.aim) { const a = P.aim; tgt = { x: gx + gw / 2 + a.x * gw / 2, y: gy + gh * (1 - clamp(a.y, -0.1, 1.2)) }; }
    else if (P.side === 1 && P.oz) { const o = P.oz; tgt = { x: zx(o.c) + (o.c === 0 ? 0 : o.c * 8), y: zy(o.r) }; if (P.o0 === "wide") { tgt.x = gx + gw / 2 + (o.c || 1) * gw * 0.62; tgt.y = gy + gh * 0.2; } else if (P.o0 === "post") tgt.x = gx + gw / 2 + (o.c || 1) * gw * 0.5; }
    const flying = P.ph === "fly" || P.ph === "res";
    if (flying && tgt) {
      const u = clamp(P.ph === "res" ? 1 : P.t / 30, 0, 1), e = 1 - Math.pow(1 - u, 2);
      let ex = tgt.x, ey = tgt.y; if (P.res === "save") { ex = kx; ey = ky - 20; }
      bx = sx + (ex - sx) * e; by = sy - 6 + (ey - sy + 6) * e - Math.sin(u * Math.PI) * 22; br = 11 - 5 * e;
    }
    const sh = P.side === 0 ? ours(P.taken[0]) : oc, lean = P.side === 1 && P.ph === "tell" ? P.tellC * 14 * Math.min(1, P.t / 40) : 0;
    const run = P.ph === "tell" ? P.t * 0.4 : 0;
    person(sx + lean, sy + 44 - (P.ph === "tell" ? Math.min(30, P.t * 0.5) : 0), 2.3, sh, -Math.PI / 2, run, 0);
    const bl = BALLS[EXT.cos.ball] || BALLS[0];
    g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(bx, sy - 2, br * 0.8, br * 0.35, 0, 0, 7); g.fill();
    g.fillStyle = bl.a; g.beginPath(); g.arc(bx, by, br, 0, 7); g.fill(); g.fillStyle = bl.b; g.beginPath(); g.arc(bx, by, br * 0.38, 0, 7); g.fill();
    g.strokeStyle = "#111"; g.lineWidth = 1.2; g.beginPath(); g.arc(bx, by, br, 0, 7); g.stroke();
    // mirino
    if (P.ph === "aim") {
      const cx0 = gx + gw / 2 + P.cur.x * gw / 2, cy0 = gy + gh * (1 - P.cur.y);
      g.strokeStyle = "#fde047"; g.lineWidth = 3; g.beginPath(); g.arc(cx0, cy0, 13, 0, 7); g.moveTo(cx0 - 20, cy0); g.lineTo(cx0 + 20, cy0); g.moveTo(cx0, cy0 - 20); g.lineTo(cx0, cy0 + 20); g.stroke();
    }
    // segnapunti dei tiri
    g.font = "bold 13px system-ui"; g.textAlign = "left";
    [[0, myTag(), "#7dd3fc"], [1, G.lv.tag, "#fdba74"]].forEach(([s, tg, col], k) => {
      const yy = gy - 38 + k * 18; g.fillStyle = col; g.fillText(tg, 12, yy);
      let d = ""; const tot = Math.max(P.n, P.hist[s].length);
      for (let i = 0; i < tot; i++) d += i < P.hist[s].length ? (P.hist[s][i] ? "● " : "✕ ") : "· ";
      g.fillStyle = "#fff"; g.fillText(d, 54, yy);
    });
    const vg = g.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.45, cw / 2, ch / 2, Math.max(cw, ch) * 0.8); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.45)"); g.fillStyle = vg; g.fillRect(0, 0, cw, ch);
    if (G.flash > 0) { g.fillStyle = `rgba(255,255,255,${G.flash * 0.04})`; g.fillRect(0, 0, cw, ch); }
  }

  // ---------------------------------------------------------------- render
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; vigKey = ""; }
    return dpr;
  }
  function drawPlayer(g, p, isCtl, tick) {
    const x = p.x, y = p.y, sp = Math.hypot(p.vx, p.vy), sw = sp > 0.6 ? Math.sin(p.ph) * 4 : 0;
    g.fillStyle = "rgba(0,0,0,.38)"; g.beginPath(); g.ellipse(x, y + 12, 13, 5.5, 0, 0, 7); g.fill();
    if (isCtl) { g.strokeStyle = "#facc15"; g.lineWidth = 2.6; g.beginPath(); g.ellipse(x, y + 12, 18, 8.5, 0, 0, 7); g.stroke(); }
    if (p.dash > 0) { g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(p.face) * 28, y - Math.sin(p.face) * 28); g.stroke(); }
    g.fillStyle = "#e5e7eb"; g.fillRect(x - 6, y + 2 + (sw > 0 ? 0 : 1), 4.6, 9 + sw * 0.4); g.fillRect(x + 1.5, y + 2 + (sw > 0 ? 1 : 0), 4.6, 9 - sw * 0.4);
    g.fillStyle = "#111827"; g.fillRect(x - 6, y + 10 + sw * 0.4, 5.2, 3.2); g.fillRect(x + 1.5, y + 10 - sw * 0.4, 5.2, 3.2);
    const lean = Math.cos(p.face) * 1.6;
    g.fillStyle = p.kit; g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10.5, 10, 0, 0, 7); g.fill();
    g.fillStyle = p.kit2; g.fillRect(x - 10.5 + lean * 0.5, y - 6, 21, 2.8);
    g.fillStyle = p.skin; g.beginPath(); g.arc(x - 11 + lean, y - 3 + sw * 0.3, 2.8, 0, 7); g.arc(x + 11 + lean, y - 3 - sw * 0.3, 2.8, 0, 7); g.fill();
    g.beginPath(); g.arc(x + lean, y - 17, 6.4, 0, 7); g.fill();
    g.fillStyle = p.hair; g.beginPath(); g.arc(x + lean, y - 19, 6.6, Math.PI, 0); g.fill();
    if (p.name === "Dario") { g.fillStyle = "#facc15"; g.fillRect(x + lean - 6.6, y - 21, 13.2, 3); }
    if (p.name === "Mastro Cavalletto") { g.fillStyle = "#facc15"; g.beginPath(); g.arc(x + lean, y - 20, 7, Math.PI, 0); g.fill(); g.fillRect(x + lean - 8, y - 20, 16, 2); }
    g.fillStyle = "#111"; g.fillRect(x + lean + Math.cos(p.face) * 2.4 - 0.8, y - 16.5, 1.7, 1.9);
    if (p.wind > 0) { g.fillStyle = "#ef4444"; g.font = "900 18px system-ui"; g.textAlign = "center"; g.fillText("!", x, y - 30 - Math.sin(tick * 0.5) * 2); }
    if (p.stun > 8) { g.fillStyle = "#fde047"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText("✦", x + 5, y - 28 - Math.sin(tick * 0.4) * 2); }
    if (isCtl) {
      const yy = y - 34 + Math.sin(tick * 0.18) * 2;
      g.fillStyle = "#facc15"; g.beginPath(); g.moveTo(x - 6, yy - 8); g.lineTo(x + 6, yy - 8); g.lineTo(x, yy); g.closePath(); g.fill();
      g.font = "bold 11px system-ui"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,.8)"; g.strokeText(p.name, x, yy - 12); g.fillStyle = "#fff"; g.fillText(p.name, x, yy - 12);
    }
  }

  function render() {
    const dpr = resize(), g = cx, cw = cv.width / dpr, ch = cv.height / dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#0a0e17"; g.fillRect(0, 0, cw, ch);
    if (!G) return;
    if (G.mode === "pen") { renderPen(g, cw, ch); return; }
    const bgk = G.fx.mh0 + "|" + EXT.cos.field;
    if (!bgCache || bgCache._n !== bgk) { bgCache = buildBg(G.fx.mh0, FIELDS[EXT.cos.field] || FIELDS[0]); bgCache._n = bgk; }
    const b = G.ball;
    let s = Math.min(cw / (CW + 30), ch / (CH + 30));
    if (cw > ch) s = Math.max(s, Math.min(cw / (CW + 30), ch / 620)); // in orizzontale ingrandisce e segue la palla
    // zoom cinematografico sul gol
    let fx = CW / 2, fy = CH / 2;
    if (G.state === "goal") { const k = Math.min(1, G.goalT / 25); const z = 1 + 0.55 * k; s *= z; fx = CW / 2 + (G.zx - CW / 2) * k; fy = CH / 2 + (G.zy - CH / 2) * 0.85 * k; }
    // se la vista è più stretta del campo, segue la palla
    const vw2 = cw / (2 * s), vh2 = ch / (2 * s);
    if (vw2 < CW / 2 + 15) fx = clamp(b.x, vw2 - 15, CW - vw2 + 15);
    if (vh2 < CH / 2 + 15) fy = clamp(G.state === "goal" ? fy : b.y, vh2 - 15, CH - vh2 + 15);
    else if (G.state !== "goal") fy = CH / 2 + (vh2 * 2 - (CH + 30)) * 0.36; // lascia libera la porta di casa sopra i pulsanti
    let shx = 0, shy = 0; if (G.shake > 0.3) { shx = rnd(-1, 1) * G.shake; shy = rnd(-1, 1) * G.shake; }
    G.view = { s, cw, ch, cx: fx + shx / s, cy: fy + shy / s };
    g.save();
    g.translate(cw / 2, ch / 2); g.scale(s, s); g.translate(-G.view.cx, -G.view.cy);
    g.drawImage(bgCache, -MX, -MY);
    if (G.boss === "gru" && G.fx.mh < G.fx.mh0) { // il Cassone: i container chiudono la bocca delle porte
      g.fillStyle = "#b91c1c"; const w = G.fx.mh0 - G.fx.mh;
      [[T - 34, 34], [B, 34]].forEach(([y, h]) => { g.fillRect(CW / 2 - G.fx.mh0, y, w, h); g.fillRect(CW / 2 + G.fx.mh, y, w, h); });
      g.strokeStyle = "rgba(0,0,0,.4)"; g.lineWidth = 1; for (let k = 0; k < w; k += 6) [[T - 34, 34], [B, 34]].forEach(([y, h]) => { g.beginPath(); g.moveTo(CW / 2 - G.fx.mh0 + k, y); g.lineTo(CW / 2 - G.fx.mh0 + k, y + h); g.moveTo(CW / 2 + G.fx.mh + k, y); g.lineTo(CW / 2 + G.fx.mh + k, y + h); g.stroke(); });
    }
    if (G.boss === "marea" && G.FRC < G.fx.frc) { g.fillStyle = "rgba(56,189,248,.15)"; g.fillRect(L, T, R - L, B - T); }

    // lampi sui muri
    G.flashes.forEach((f) => { const a = f.life / 14; g.strokeStyle = `rgba(253,230,138,${a})`; g.lineWidth = 5 * a + 1; g.lineCap = "round"; g.beginPath(); if (f.v) { g.moveTo(f.x, f.y - 30); g.lineTo(f.x, f.y + 30); } else { g.moveTo(f.x - 30, f.y); g.lineTo(f.x + 30, f.y); } g.stroke(); });

    // guida alla mira / passaggio per l'utente
    if (G.state === "play" && b.owner === G.ctl) {
      const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
      const bp = bestPass(G.ctl, mg > 0.3 ? { x: jx / mg, y: jy / mg } : null) || bestPass(G.ctl);
      if (bp) { const m = bp.m; g.strokeStyle = "rgba(163,230,53,.9)"; g.lineWidth = 2.4; g.setLineDash([6, 6]); g.lineDashOffset = -G.tick * 0.5; g.beginPath(); g.ellipse(m.x, m.y + 12, 20, 9, 0, 0, 7); g.stroke(); g.setLineDash([]); }
      if (uOf(0, G.ctl.y) > 0.4) {
        const bb = bestBank(G.ctl, CW / 2, goalY(0), jx > 0.3 ? 1 : jx < -0.3 ? -1 : 0);
        if (bb) { g.strokeStyle = "rgba(56,189,248,.35)"; g.lineWidth = 2; g.setLineDash([4, 8]); g.beginPath(); g.moveTo(G.ctl.x, G.ctl.y); g.lineTo(bb.ix, bb.iy); g.lineTo(CW / 2, goalY(0)); g.stroke(); g.setLineDash([]); }
      }
    }
    // giocatori + palla ordinati per y
    const list = G.pl.map((p) => ({ y: p.y, p })); list.push({ y: b.y + 0.1, ball: true });
    list.sort((a, c) => a.y - c.y);
    list.forEach((o) => {
      if (o.ball) {
        g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(b.x, b.y + 4, 7, 3.4, 0, 0, 7); g.fill();
        const bounced = b.bounces > 0 && !b.owner;
        b.trail.forEach((t, i) => { g.fillStyle = b.fire ? `rgba(251,146,60,${0.6 - i * 0.045})` : bounced ? `rgba(125,211,252,${0.45 - i * 0.035})` : `rgba(255,255,255,${0.3 - i * 0.022})`; g.beginPath(); g.arc(t.x, t.y - 4, 6 - i * 0.4, 0, 7); g.fill(); });
        g.save(); g.translate(b.x, b.y - 4); g.rotate(b.rot);
        const bl = BALLS[EXT.cos.ball] || BALLS[0];
        g.fillStyle = b.fire ? "#fde68a" : bl.a; g.beginPath(); g.arc(0, 0, BR, 0, 7); g.fill();
        g.fillStyle = b.fire ? "#dc2626" : bl.b; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(Math.cos(a) * 4.2, Math.sin(a) * 4.2, 1.9, 0, 7); g.fill(); }
        g.beginPath(); g.arc(0, 0, 2, 0, 7); g.fill(); g.restore();
        g.strokeStyle = "#111"; g.lineWidth = 1.1; g.beginPath(); g.arc(b.x, b.y - 4, BR, 0, 7); g.stroke();
      } else drawPlayer(g, o.p, o.p === G.ctl && G.state !== "end", G.tick);
    });
    G.parts.forEach((q) => { g.globalAlpha = Math.max(0, q.life / q.max); g.fillStyle = q.col; g.beginPath(); g.arc(q.x, q.y, q.size, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    if (input.charging && G.ctl) { const c = clamp(input.chargeF / 30, 0, 1), px = G.ctl.x, py = G.ctl.y - 48; g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(px - 20, py, 40, 6); g.fillStyle = c > 0.85 ? "#ef4444" : "#fde047"; g.fillRect(px - 19, py + 1, 38 * c, 4); }
    g.restore();

    const key = cw + "x" + ch;
    if (vigKey !== key) { vigCache = g.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.4, cw / 2, ch / 2, Math.max(cw, ch) * 0.78); vigCache.addColorStop(0, "rgba(0,0,0,0)"); vigCache.addColorStop(1, "rgba(0,0,0,.5)"); vigKey = key; }
    g.fillStyle = vigCache; g.fillRect(0, 0, cw, ch);
    if (G.flash > 0) { g.fillStyle = `rgba(255,255,255,${G.flash * 0.04})`; g.fillRect(0, 0, cw, ch); }
    if (G.state === "kickoff" && G.timer > 0) { g.font = "bold 14px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(cw / 2 - 100, ch * 0.5 - 12, 200, 26); g.fillStyle = "#fde047"; g.fillText("Muoviti o passa per iniziare", cw / 2, ch * 0.5 + 6); }
    if (G.intesaT > 0) { g.font = "bold 12px system-ui"; g.textAlign = "center"; g.fillStyle = "#7dd3fc"; g.fillText("INTESA PRONTA: tira!", cw / 2, ch - 10); }
  }

  function hud() {
    if (!G || !root) return;
    const sc = root.querySelector(".cgd-sc");
    const left = G.secs ? Math.max(0, Math.ceil(G.secs - G.t)) : 0, tm = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
    const m = G.mode;
    let sub;
    if (m === "pen") { const P = G.pen; sub = `Rigori · ${P.sd ? "a oltranza" : "tiro " + Math.min(P.n, Math.floor(P.taken[0] + (P.side === 0 ? 1 : 0)))} di ${P.n}`; }
    else if (m === "surv") sub = `Ondata ${G.wave} · ${"♥".repeat(G.lives)}${"♡".repeat(Math.max(0, G.maxLives - G.lives))} · ${DIFFS[G.di].n}`;
    else if (m === "time") sub = `Sfida a tempo · ${tm}`;
    else if (m === "train") sub = "Allenamento · senza tempo";
    else sub = `${G.target < 999 ? "A " + G.target + " punti · " : ""}${G.golden ? "PUNTO D'ORO" : G.secs ? tm : "senza limite"} · ${DIFFS[G.di].n}`;
    sc.querySelector("b").innerHTML = `<span class="cgd-ta">${myTag()}</span> ${G.score[0]} - ${G.score[1]} <span class="cgd-tb">${G.lv.tag}</span>`;
    sc.querySelector("small").textContent = sub;
    const gb = root.querySelector(".cgd-bar");
    gb.firstElementChild.style.width = G.grinta + "%"; gb.classList.toggle("full", G.grinta >= 100);
    root.querySelector(".cgd-cmb").textContent = G.combo >= 2 ? "COMBO x" + G.combo : "";
    root.querySelector(".cgd-b.trab").classList.toggle("on", G.grinta >= 100 && G.state === "play");
    const chg = root.querySelector(".cgd-chg"); chg.style.display = "none"; // la barra è nel campo
  }

  function loop(ts) {
    if (closed) return;
    raf = requestAnimationFrame(loop);
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000; lastTs = ts; if (dt > 0.1) dt = 0.1;
    if (G && uiState === "play" && !paused) {
      acc += dt * (G.state === "goal" && G.goalT < 40 ? 0.4 : 1);
      let n = 0;
      while (acc >= STEP && n < 5) { step(); acc -= STEP; n++; if (!G || closed) return; }
      if (n === 5) acc = 0;
      hud();
    } else acc = 0;
    render();
  }

  // ---------------------------------------------------------------- input
  function onKey(e, down) {
    if (closed) return;
    const k = e.key; let used = true;
    if (G && G.mode === "pen" && uiState === "play") {
      if (!down) return;
      if (k === " " || k === "Enter" || k === "x" || k === "X" || k === "z" || k === "Z") { penShoot(); e.preventDefault(); return; }
      const zi = "123456".indexOf(k); if (zi >= 0) { const z = [[-1, 1], [0, 1], [1, 1], [-1, 0], [0, 0], [1, 0]][zi]; penDive(z[0], z[1]); e.preventDefault(); return; }
    }
    if (k === "ArrowUp" || k === "w" || k === "W") input.ky = down ? -1 : (input.ky < 0 ? 0 : input.ky);
    else if (k === "ArrowDown" || k === "s" || k === "S") input.ky = down ? 1 : (input.ky > 0 ? 0 : input.ky);
    else if (k === "ArrowLeft" || k === "a" || k === "A") input.kx = down ? -1 : (input.kx < 0 ? 0 : input.kx);
    else if (k === "ArrowRight" || k === "d" || k === "D") input.kx = down ? 1 : (input.kx > 0 ? 0 : input.kx);
    else if (k === "z" || k === "Z" || k === " ") { if (down && !e.repeat) input.passEdge = true; }
    else if (k === "c" || k === "C") { if (down && !e.repeat) input.bankEdge = true; }
    else if (k === "x" || k === "X" || k === "Enter") {
      if (down && !e.repeat) { input.charging = true; input.chargeF = 0; input.keyShoot = true; }
      else if (!down && input.keyShoot) { input.charging = false; input.shootRel = true; input.keyShoot = false; }
    }
    else if ((k === "v" || k === "V") && down) input.trab = true;
    else if ((k === "p" || k === "P" || k === "Escape") && down) { if (uiState === "play") pauseGame(); }
    else used = false;
    if (used) e.preventDefault();
  }

  function bindPad() {
    const pad = root.querySelector(".cgd-pad"), stk = root.querySelector(".cgd-stk"), knob = stk.firstElementChild;
    const rect = () => stage.getBoundingClientRect(); const RAD = 52;
    const toWorld = (px, py) => { const r = rect(), v = G && G.view; if (!v) return; input.tx = (px - r.left - v.cw / 2) / v.s + v.cx; input.ty = (py - r.top - v.ch / 2) / v.s + v.cy; };
    pad.addEventListener("pointerdown", (e) => {
      if (stick.id !== -1) return; e.preventDefault(); stick.id = e.pointerId;
      try { pad.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
      const r = rect();
      if (SET.ctrl === "touch") { input.touchOn = true; toWorld(e.clientX, e.clientY); return; }
      stick.ox = clamp(e.clientX - r.left, 62, r.width - 62); stick.oy = clamp(e.clientY - r.top, 62, r.height - 62);
      stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; stk.style.display = "block"; stk.classList.add("on"); knob.style.transform = "translate(0,0)";
      stick.bx = e.clientX; stick.by = e.clientY; input.jx = input.jy = 0;
    });
    pad.addEventListener("pointermove", (e) => {
      if (e.pointerId !== stick.id) return; e.preventDefault();
      if (SET.ctrl === "touch") { toWorld(e.clientX, e.clientY); return; }
      const dx = e.clientX - stick.bx, dy = e.clientY - stick.by, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / RAD);
      input.jx = dx / d * m; input.jy = dy / d * m;
      if (d > RAD) { stick.bx = e.clientX - dx / d * RAD; stick.by = e.clientY - dy / d * RAD; const r = rect(); stick.ox = clamp(stick.bx - r.left, 62, r.width - 62); stick.oy = clamp(stick.by - r.top, 62, r.height - 62); stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; }
      knob.style.transform = `translate(${input.jx * RAD}px,${input.jy * RAD}px)`;
    });
    const up = (e) => { if (e.pointerId !== stick.id) return; stick.id = -1; input.jx = input.jy = 0; input.touchOn = false; stk.classList.remove("on"); knob.style.transform = "translate(0,0)"; showDefaultStick(); };
    pad.addEventListener("pointerup", up); pad.addEventListener("pointercancel", up); pad.addEventListener("lostpointercapture", up);
  }
  function showDefaultStick() {
    const stk = root && root.querySelector(".cgd-stk"); if (!stk) return;
    if (SET.ctrl === "stick" && uiState === "play") { stk.style.display = "block"; stk.style.left = "78px"; stk.style.top = (stage.clientHeight - 92) + "px"; } else stk.style.display = "none";
  }
  function bindBtn(el, onDown, onUp) {
    let id = -1;
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); id = e.pointerId; try { el.setPointerCapture(id); } catch (er) { /* ignora */ } el.classList.add("dn"); onDown && onDown(); });
    const end = (e) => { if (e.pointerId !== id) return; id = -1; el.classList.remove("dn"); onUp && onUp(); };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end); el.addEventListener("lostpointercapture", end);
  }

  // ================================================================ schermate
  function showUi(html) { ui.innerHTML = `<div class="cgd-card">${html}</div>`; ui.classList.add("on"); ui.scrollTop = 0; }
  function hideUi() { ui.classList.remove("on"); ui.innerHTML = ""; }
  const stars = (n) => "★".repeat(n) + "☆".repeat(3 - n);
  const gtTag = () => `<span class="cgd-gt" title="Gettoni di Gabbia">◆ ${EXT.gt}</span>`;
  const note = (t) => { const n = ui && ui.querySelector(".cgd-note"); if (n) { n.textContent = t || ""; n.style.display = t ? "block" : "none"; } };
  function act(map) {
    ui.querySelectorAll("[data-a]").forEach((el) => {
      el.onclick = () => { const f = map[el.dataset.a]; if (f) { snd("playSelect"); f(el.dataset.p, el); } };
    });
  }
  const segH = (k, items, cur, wide) => `<div class="cgd-seg${wide ? " w" : ""}">` + items.map(([v, l]) => `<button data-a="${k}" data-p="${v}" class="${String(v) === String(cur) ? "on" : ""}">${esc(l)}</button>`).join("") + "</div>";
  const tile = (a, ico, t, s, bdg) => `<button class="cgd-tile" data-a="${a}"><i>${ico}</i><b>${t}${bdg ? ` <span class="cgd-bdg">${bdg}</span>` : ""}</b><span>${s}</span></button>`;
  const hashS = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const shuffle = (a, r) => { r = r || Math.random; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const lockRow = (hintTxt) => `<div class="cgd-opp" style="opacity:.5"><div class="cgd-crest" style="border-color:#6b5338;color:#a8957a">?</div><div><b>???</b><span>${hintTxt}</span></div><em>🔒</em></div>`;
  const crest = (t) => `<div class="cgd-crest" style="border-color:${t.kit2};background:${t.kit};color:${t.kit2}">${t.tag}</div>`;
  const newOpenChapters = () => CHAPTERS.filter((c) => chOpen(c)).map((c) => c.id);

  // ---------------------------------------------------------------- hub
  function showHub() {
    uiState = "menu"; paused = false;
    if (!readCh("c0")) return showScene("c0", 0, showHub);
    const unread = unreadCount(), dl = dailyEnsure() && EXT.daily.done.filter((x) => !x).length, sea = SEA && SEA.active && !SEA.done, cup = CUP && CUP.active && !CUP.done;
    const done = LEVELS.filter((_, i) => PROG.stars[i] > 0).length;
    let h = `<h2>La Gabbia del Molo</h2><p class="cgd-sub">${esc(HUBQ())}</p><div class="cgd-gtrow">${gtTag()}<span class="cgd-sub">Gettoni di Gabbia · servono per l'estetica</span></div>`;
    h += `<div class="cgd-grid">`;
    h += tile("tour", "🏆", "Il torneo", `Squadre del molo · ${done}/${LEVELS.length}`);
    h += tile("boss", "👑", "Boss di quartiere", `${BOSSES.filter((b) => bossDone(b.id)).length}/${BOSSES.length} battuti`);
    h += tile("free", "⚽", "Partita libera", "Regole a scelta");
    h += tile("surv", "🛡", "Sopravvivenza", `Record ondata ${EXT.rec.surv}`);
    h += tile("time", "⏱", "Sfida a tempo", "Più punti possibili");
    h += tile("pen", "🎯", "Rigori", `Segnati ${EXT.rec.penG}`);
    h += tile("train", "🧤", "Allenamento", "Senza fretta, senza regole");
    h += tile("season", "📋", "Campionato", sea ? "Stagione in corso" : seasonUnlocked() ? "Classifica e stagione" : "???");
    h += tile("cup", "🥇", "Coppa", cup ? "Coppa in corso" : cupUnlocked() ? "Eliminazione diretta" : "???");
    h += tile("daily", "📅", "Sfida del giorno", dl ? `${dl} da fare · serie ${dailyStreak()}` : "Tutte fatte, a domani", dl || "");
    h += tile("squad", "👟", "Squadra", squadDefs().map((p) => p.name).join(" · "));
    h += tile("cos", "🎨", "Estetica", "Maglie, palle, campi");
    h += tile("diary", "📖", "Diario del molo", `${CHAPTERS.filter((c) => readCh(c.id)).length}/${CHAPTERS.length} pagine`, unread || "");
    h += tile("opts", "⚙", "Opzioni", "Controlli, difficoltà, audio");
    h += `</div>`;
    h += `<p class="cgd-sub" style="text-align:center;margin-top:12px">Partite: ${totalGames()} · Vittorie: ${PROG.wins} · Punti fatti: ${PROG.pts} · Miglior combo: x${PROG.bestCombo}</p>`;
    h += `<button class="cgd-btn sec" data-a="exit">Esci dalla Gabbia</button>`;
    showUi(h);
    act({ tour: showTour, boss: showBoss, free: () => showSetup("free"), surv: () => showSetup("surv"), time: () => showSetup("time"), pen: () => showSetup("pen"), train: () => showSetup("train"), season: showSeason, cup: showCup, daily: showDaily, squad: showSquad, cos: showCos, diary: showDiary, opts: showOpts, exit: () => closeAll() });
    if (!PROG.tut) { PROG.tut = 1; saveProg(); showTutorial(0, showHub); }
  }
  const HUBQ = () => {
    const a = [];
    if (!starsOf(0)) a.push("Don Tullio gira il lucchetto in tasca: «Comincia dai Mercatali. Sono gentili. Per modo di dire.»");
    if (unreadCount()) a.push("Sulla rete c'è qualcosa di nuovo. Nives dice che non è stata lei.");
    if (EXT.stat.titles) a.push("Sul muro hanno scritto il tuo nome con il gesso. Nives sostiene che sia vandalismo. Lo ha riscritto due volte.");
    a.push(pickQ(QUIP.pre));
    return a[Math.floor(Math.random() * a.length)];
  };

  function showOpts() {
    uiState = "menu";
    showUi(`<h2>Opzioni</h2><h3>Controlli</h3>${segH("ctrl", [["stick", "Joystick"], ["touch", "Tocca e corri"]], SET.ctrl)}
      <h3>Difficoltà</h3>${segH("diff", DIFFS.map((d, i) => [i, d.n]), SET.diff)}
      <h3>Audio</h3>${segH("sound", [[1, "Suoni attivi"], [0, "Muto"]], SET.sound)}
      <button class="cgd-btn sec" data-a="tut">Come si gioca</button><button class="cgd-btn sec" data-a="back">Indietro</button>`);
    const set = (k) => (v) => { SET[k] = k === "ctrl" ? v : +v; saveSet(); showOpts(); };
    act({ ctrl: set("ctrl"), diff: set("diff"), sound: set("sound"), tut: () => showTutorial(0, showOpts), back: showHub });
  }

  function showTutorial(step, back) {
    uiState = "tut";
    const T = [
      ["Muoviti", "Tieni premuto a sinistra: compare il joystick. Oppure scegli «Tocca e corri» e trascina dove vuoi andare. Comandi il giocatore col cerchio giallo, e il campo è tutto visibile: la Gabbia è piccola, e anche per questo ci si fa male (a parole)."],
      ["Tira, passa, spallata", "TIRO: tieni premuto e rilascia, stick di lato per scegliere l'angolo. PASSA manda la palla al compagno indicato dal cerchio verde. Senza palla, PASSA è la SPALLATA: scatto e botta, il rivale vola e la palla è tua."],
      ["La sponda", "SPONDA fa rimbalzare la palla sul muro: in attacco punta alla porta, in difesa cerca un compagno. Un gol dopo almeno un rimbalzo vale 2 punti. Una sponda ricevuta da un compagno accende la COMBO."],
      ["Grinta e Trabucco", "Rimbalzi, spallate e passaggi riempiono la GRINTA. Piena, compare il tasto dorato: il Trabucco è un tiro di fuoco che butta a terra chi incontra e vale 2. Passaggio Leo-Nico e tiro subito: Doppietta, tiro potenziato e preciso."],
      ["Rigori", "Ai rigori il mirino oscilla: premi TIRA nel momento giusto. Quando para l'avversario, guarda il tiratore: si china verso l'angolo (quasi sempre), e tu tocca la zona dove tuffarti prima che calci."],
    ];
    const t = T[step];
    showUi(`<h2>${t[0]}</h2><div class="cgd-dots">${T.map((_, i) => (i === step ? "<b>●</b>" : "●")).join(" ")}</div><p>${t[1]}</p>
      <button class="cgd-btn" data-a="next">${step < T.length - 1 ? "Avanti" : "Ho capito"}</button>${step > 0 ? '<button class="cgd-btn sec" data-a="prev">Indietro</button>' : ""}`);
    act({ next: () => (step < T.length - 1 ? showTutorial(step + 1, back) : back()), prev: () => showTutorial(step - 1, back) });
  }

  // ---------------------------------------------------------------- torneo e boss
  const starsFor = (t) => { const i = LEVELS.indexOf(t); return i >= 0 ? starsOf(i) : (EXT.ex[t.id] | 0); };
  const coinFor = (t) => { const i = LEVELS.indexOf(t); return i >= 0 ? COINS[i] : 3 + (t.tier | 0); };
  const tourCfg = (t) => ({ kind: "tour", mode: "tour", lv: t, li: LEVELS.indexOf(t), target: t.target, secs: MATCH_SECS });
  const bossCfg = (b) => ({ kind: "boss", mode: "tour", lv: b, li: -1, target: b.target, secs: MATCH_SECS });

  function showTour() {
    uiState = "menu";
    const list = WAVE_SEQ.filter((t, i, a) => a.indexOf(t) === i);
    let h = `<h2>Il torneo del molo</h2><p class="cgd-sub">Ogni squadra ne apre un'altra. Quelle che non conosci ancora restano «???».</p>`;
    list.forEach((t) => {
      const open = teamOpen(t);
      h += open ? `<button class="cgd-opp" data-a="go" data-p="${t.id}">${crest(t)}<div><b>${esc(t.name)}</b><span>${starsFor(t) ? "Battuta" : "Da affrontare"} · ${esc(t.mut)}</span></div><em>${stars(starsFor(t))}</em></button>` : lockRow("Si apre battendo una squadra più avanti.");
    });
    h += `<button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({ go: (id) => showBrief(tourCfg(teamById(id)), showTour), back: showHub });
  }
  function showBoss() {
    uiState = "menu";
    let h = `<h2>Boss di quartiere</h2><p class="cgd-sub">Tre persone che il molo conosce da una vita. Ognuno ha un'abilità che cambia le regole a metà partita.</p>`;
    BOSSES.forEach((b) => {
      const open = teamOpen(b);
      h += open ? `<button class="cgd-opp" data-a="go" data-p="${b.id}">${crest(b)}<div><b>${esc(b.name)}</b><span>${bossDone(b.id) ? "Battuto" : "Da sfidare"} · ${esc(b.mut)}</span></div><em>${bossDone(b.id) ? "★" : "⚔"}</em></button>` : lockRow("Si apre più avanti.");
    });
    h += `<button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({ go: (id) => showBrief(bossCfg(teamById(id)), showBoss), back: showHub });
  }

  function modeRule(cfg) { return cfg.mod === undefined || cfg.mod === "team" ? cfg.lv.mut : modName(cfg.mod) + ": " + (MODS.find((m) => m.id === cfg.mod) || MODS[1]).d; }
  function showBrief(cfg, back, extra) {
    uiState = "intro"; const lv = cfg.lv, k = cfg.kind;
    let rew = "";
    if (k === "tour") rew = `Premio prima vittoria: ${coinFor(lv)} monete${(LEVELS.indexOf(lv) >= 0 ? PROG.coin[LEVELS.indexOf(lv)] : EXT.coin["ex-" + lv.id]) ? " (già incassato)" : ""}`;
    else if (k === "boss") rew = `Premio prima vittoria: ${lv.coin} monete e ${lv.gt} gettoni${EXT.coin["boss-" + lv.id] ? " (già incassato)" : ""}`;
    else if (k === "daily") rew = `Premio: ${DAILY_GT[cfg.slot]} gettoni`;
    showUi(`<h2>${esc(cfg.title || lv.name)}</h2><p class="cgd-sub">${esc(cfg.sub || "")}${rew ? (cfg.sub ? " · " : "") + rew : ""}</p>
      <div class="cgd-quote">${esc(lv.hint)}</div>${lv.pre ? `<p>${esc(lv.pre)}</p>` : ""}
      <div class="cgd-rule">Regola: ${esc(modeRule(cfg))}</div>
      <div class="cgd-stat"><span>Obiettivo</span><span>${cfg.mode === "pen" ? "Serie da " + cfg.n + " rigori" : cfg.mode === "time" ? "Più punti in " + cfg.secs + " secondi" : cfg.mode === "surv" ? "Resisti con " + cfg.lives + " vite" : "Primo a " + cfg.target + " punti" + (cfg.secs ? " (o in vantaggio allo scadere)" : "")}</span></div>
      <div class="cgd-stat"><span>Punti</span><span>Gol 1 · Sponda ${1 + (cfg.mod === "gold" ? 2 : 1)} · Trabucco 2</span></div>
      ${k === "tour" ? '<div class="cgd-stat"><span>★ ★★ ★★★</span><span>Vittoria · +3 di scarto · max 1 subito</span></div>' : ""}${extra || ""}
      <div class="cgd-g2"><button class="cgd-btn" data-a="go">Entra</button><button class="cgd-btn sec" data-a="back">Indietro</button></div>`);
    act({ go: () => { cfg.back = back; launch(cfg); }, back });
  }

  // ---------------------------------------------------------------- partite rapide: libera / sopravvivenza / tempo / rigori / allenamento
  const oppItems = (dummy) => (dummy ? [["dummy", "Sagoma ferma"]] : []).concat(openTeams(false).map((t) => [t.id, t.name]));
  const modItems = () => MODS.map((m) => [m.id, m.n]);
  function showSetup(kind) {
    uiState = "menu"; const o = EXT.opt[{ free: "free", surv: "surv", time: "time", pen: "pen", train: "train" }[kind]];
    if (o.opp && o.opp !== "dummy" && !teamOpen(teamById(o.opp))) o.opp = "mer";
    const info = {
      free: ["Partita libera", "Una partita come la vuoi tu: avversario, punti, tempo e modificatore. Vale come allenamento serio: niente premio in monete, solo gettoni per le vittorie.", `Giocate ${EXT.rec.free} · vinte ${EXT.rec.freeW}`],
      surv: ["Sopravvivenza", "Le squadre arrivano a ondate, sempre più toste. Ogni gol subito costa una vita; ogni gol tuo chiama l'ondata dopo.", `Record: ondata ${EXT.rec.surv}`],
      time: ["Sfida a tempo", "Niente avversario da battere: solo il cronometro. Fai più punti che puoi.", `Record (${o.secs}s): ${EXT.rec.time[o.secs] || 0} punti`],
      pen: ["Rigori", "Una serie secca dal dischetto, in una Gabbia di cemento e senza il tifo di nessuno. Tranne il gabbiano.", `Serie vinte ${EXT.rec.penW} · perse ${EXT.rec.penL} · rigori segnati ${EXT.rec.penG}`],
      train: ["Allenamento", "Campo libero per provare sponde, Trabucco e passaggi. Nessun risultato, nessun premio, nessun giudizio.", `Allenamenti ${EXT.rec.train}`],
    }[kind];
    let h = `<h2>${info[0]}</h2><p class="cgd-sub">${info[1]}</p><p class="cgd-sub">${info[2]}</p>`;
    const fld = (k, lab, items, wide) => { h += `<h3>${lab}</h3>` + segH(k, items, o[k], wide); };
    if (kind === "free") { fld("opp", "Avversario", oppItems(), 1); fld("target", "Punti per vincere", [[3, "3"], [5, "5"], [7, "7"], [10, "10"]]); fld("secs", "Tempo", [[90, "1:30"], [150, "2:30"], [240, "4:00"], [0, "Senza"]]); fld("mod", "Modificatore", modItems(), 1); }
    if (kind === "surv") { fld("lives", "Vite", [[1, "1"], [2, "2"], [3, "3"], [5, "5"]]); fld("mod", "Modificatore", modItems(), 1); }
    if (kind === "time") { fld("secs", "Durata", [[60, "1:00"], [90, "1:30"], [120, "2:00"], [180, "3:00"]]); fld("opp", "Avversario", oppItems(), 1); fld("mod", "Modificatore", modItems(), 1); }
    if (kind === "pen") { fld("n", "Rigori a testa", [[3, "3"], [5, "5"], [7, "7"]]); fld("opp", "Portiere e tiratore", oppItems(), 1); }
    if (kind === "train") { fld("opp", "Avversari", oppItems(true), 1); fld("gr", "Grinta", [[0, "Normale"], [1, "Sempre piena"]]); fld("mod", "Modificatore", modItems(), 1); }
    h += `<div class="cgd-g2"><button class="cgd-btn" data-a="go">Gioca</button><button class="cgd-btn sec" data-a="back">Indietro</button></div>`;
    showUi(h);
    const map = { back: showHub, go: () => launch(quickCfg(kind)) };
    ["opp", "target", "secs", "mod", "lives", "n", "gr"].forEach((k) => { map[k] = (v) => { o[k] = typeof o[k] === "number" ? +v : v; saveExt(); const sc = ui.scrollTop; showSetup(kind); ui.scrollTop = sc; }; });
    act(map);
  }
  function quickCfg(kind) {
    const o = EXT.opt[kind], lv = o.opp && o.opp !== "dummy" ? teamById(o.opp) : LEVELS[0], base = { kind, back: () => showSetup(kind), lv, mod: o.mod };
    if (kind === "free") return Object.assign(base, { mode: "free", target: o.target, secs: o.secs });
    if (kind === "surv") return Object.assign(base, { mode: "surv", lv: LEVELS[0], lives: o.lives, target: 999, secs: 0 });
    if (kind === "time") return Object.assign(base, { mode: "time", target: 999, secs: o.secs });
    if (kind === "pen") return Object.assign(base, { mode: "pen", n: o.n, mod: "none" });
    return Object.assign(base, { mode: "train", target: 999, secs: 0, passive: o.opp === "dummy", gr: o.gr });
  }

  // ---------------------------------------------------------------- campionato
  const SEA_N = (id) => (id === "ron" ? "Rondine" : teamById(id).name);
  const SEA_T = (id) => (id === "ron" ? myTag() : teamById(id).tag);
  const strOf = (id) => (id === "ron" ? 1.3 + Math.min(0.5, EXT.stat.games * 0.01) : 0.8 + (teamById(id).tier | 0) * 0.22);
  const seasonUnlocked = () => openTeams(false).length >= 3;
  function loadSeason() {
    const o = lsGet(KEY_SEASON, null);
    if (!o || !Array.isArray(o.teams) || !Array.isArray(o.fix) || !o.table) return null;
    if (!o.teams.every((t) => t === "ron" || TEAMS_ALL.some((x) => x.id === t))) return null;
    return o;
  }
  const saveSea = () => lsSet(KEY_SEASON, SEA);
  let SEA = loadSeason();
  function robin(ids) {
    const a = ids.slice(); if (a.length % 2) a.push(null);
    const n = a.length, rounds = [];
    for (let r = 0; r < n - 1; r++) {
      const m = []; for (let i = 0; i < n / 2; i++) { const x = a[i], y = a[n - 1 - i]; if (x && y) m.push(r % 2 ? [y, x] : [x, y]); }
      rounds.push(m); a.splice(1, 0, a.pop());
    }
    return rounds;
  }
  const rowNew = () => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, gs: 0, pts: 0 });
  function tabAdd(tb, a, b, ga, gb) {
    const x = tb[a], y = tb[b]; x.p++; y.p++; x.gf += ga; x.gs += gb; y.gf += gb; y.gs += ga;
    if (ga > gb) { x.w++; y.l++; x.pts += 3; } else if (ga < gb) { y.w++; x.l++; y.pts += 3; } else { x.d++; y.d++; x.pts++; y.pts++; }
  }
  function simPair(a, b) {
    const sa = strOf(a), sb = strOf(b), f = (s, o) => Math.max(0, Math.round(3.4 * s / (s + o) * (0.55 + Math.random() * 0.9) + (Math.random() - 0.5) * 1.6));
    return [f(sa, sb), f(sb, sa)];
  }
  function sorted(tb) { return Object.keys(tb).sort((a, b) => tb[b].pts - tb[a].pts || (tb[b].gf - tb[b].gs) - (tb[a].gf - tb[a].gs) || tb[b].gf - tb[a].gf || (a === "ron" ? -1 : 0)); }
  function newSeason(len) {
    const opp = shuffle(openTeams(false).slice(0, 7).map((t) => t.id));
    if ((opp.length + 1) % 2) opp.pop();
    const ids = ["ron"].concat(opp); let fix = robin(ids);
    if (len === 1) fix = fix.concat(robin(ids).map((r) => r.map(([x, y]) => [y, x])));
    const table = {}; ids.forEach((i) => (table[i] = rowNew()));
    SEA = { active: true, done: false, teams: ids, len, fix, round: 0, table, log: [], pos: 0 };
    saveSea(); EXT.opt.season.len = len; saveExt();
  }
  const myPair = () => (SEA.fix[SEA.round] || []).find((p) => p[0] === "ron" || p[1] === "ron");
  function seaTable() {
    const ord = sorted(SEA.table);
    let h = `<div class="cgd-tb"><div class="cgd-tr h"><span>#</span><span>Squadra</span><span>G</span><span>V</span><span>N</span><span>S</span><span>DR</span><span>Pt</span></div>`;
    ord.forEach((id, i) => { const r = SEA.table[id]; h += `<div class="cgd-tr${id === "ron" ? " me" : ""}"><span>${i + 1}</span><span>${esc(SEA_T(id))} <small>${esc(SEA_N(id))}</small></span><span>${r.p}</span><span>${r.w}</span><span>${r.d}</span><span>${r.l}</span><span>${r.gf - r.gs > 0 ? "+" : ""}${r.gf - r.gs}</span><b>${r.pts}</b></div>`; });
    return h + "</div>";
  }
  function showSeason() {
    uiState = "menu";
    if (!seasonUnlocked()) { showUi(`<h2>Campionato</h2>${lockRow("Si apre dopo aver battuto gli Scaricatori e un paio di altre squadre nel torneo.")}<button class="cgd-btn sec" data-a="back">Indietro</button>`); return act({ back: showHub }); }
    if (!SEA) {
      showUi(`<h2>Campionato del molo</h2><p class="cgd-sub">Un girone tra le squadre che hai già conosciuto. Ogni giornata giochi tu (primo a 5 punti o in vantaggio dopo 2 minuti), le altre partite le giocano loro, a modo loro. 3 punti per la vittoria, 1 per il pari.</p>
        <h3>Formula</h3>${segH("len", [[0, "Solo andata"], [1, "Andata e ritorno"]], EXT.opt.season.len)}
        <p class="cgd-sub">Squadre in girone: ${(openTeams(false).length + 1) % 2 ? openTeams(false).length : openTeams(false).length + 1}. Il campionato si allarga man mano che scopri altre squadre.</p>
        <p class="cgd-sub">Titoli vinti: ${EXT.stat.titles} · stagioni giocate: ${EXT.stat.seasons}</p>
        <button class="cgd-btn" data-a="new">Inizia la stagione</button><button class="cgd-btn sec" data-a="back">Indietro</button>`);
      return act({ len: (v) => { EXT.opt.season.len = +v; saveExt(); showSeason(); }, new: () => { newSeason(EXT.opt.season.len); showSeason(); }, back: showHub });
    }
    let h = `<h2>Campionato del molo</h2>`;
    if (SEA.done) {
      h += `<p class="cgd-sub">Stagione conclusa: ${SEA.pos}° posto.</p>${seaTable()}<div class="cgd-quote">${esc(SEA.pos === 1 ? "Don Tullio appende una targa sulla rete, con il nastro adesivo. La targa dice «CAMPIONI». Sotto, a penna: «(del molo)». Per lui è già troppo." : SEA.pos <= 3 ? "Sul podio, in terza fila, ma sul podio. Nives dal balcone grida «Ai miei tempi sarebbe stato peggio!». È un complimento." : "Stagione dura. Tano ti offre un caffè finto: «Offre la casa». La casa è chiusa. Ma il gesto è vero.")}</div>`;
      h += `<button class="cgd-btn" data-a="again">Nuova stagione</button><button class="cgd-btn sec" data-a="back">Indietro</button>`;
      showUi(h); return act({ again: () => { SEA = null; try { localStorage.removeItem(KEY_SEASON); } catch (e) { /* ignora */ } showSeason(); }, back: showHub });
    }
    const pr = myPair(), opp = pr ? (pr[0] === "ron" ? pr[1] : pr[0]) : null;
    h += `<p class="cgd-sub">Giornata ${SEA.round + 1} di ${SEA.fix.length}${SEA.len ? " · andata e ritorno" : " · solo andata"}</p>${seaTable()}`;
    if (SEA.log.length) h += `<h3>Ultimi risultati</h3>` + SEA.log.slice(-3).reverse().map((l) => `<div class="cgd-stat"><span>G${l[0]}</span><span>Rondine ${l[1]}-${l[2]} ${esc(SEA_N(l[3]))}</span></div>`).join("");
    h += `<button class="cgd-btn" data-a="play">Gioca contro ${esc(opp ? SEA_N(opp) : "?")}</button><button class="cgd-btn sec" data-a="drop" data-p="0">Abbandona la stagione</button><button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({
      play: () => { const lv = teamById(opp); showBrief({ kind: "season", mode: "tour", lv, li: -1, target: 5, secs: 120, title: "Giornata " + (SEA.round + 1), sub: "Campionato · " + SEA_N(opp) }, showSeason); },
      drop: (p, el) => { if (el.dataset.p === "0") { el.dataset.p = "1"; el.textContent = "Sicuro? Tocca ancora per abbandonare"; return; } SEA = null; try { localStorage.removeItem(KEY_SEASON); } catch (e) { /* ignora */ } showSeason(); },
      back: showHub,
    });
  }
  function seasonAfter(a, c) {
    const pr = myPair(), opp = pr[0] === "ron" ? pr[1] : pr[0];
    tabAdd(SEA.table, "ron", opp, a, c); SEA.log.push([SEA.round + 1, a, c, opp]);
    SEA.fix[SEA.round].forEach((p) => { if (p !== pr) { const s = simPair(p[0], p[1]); tabAdd(SEA.table, p[0], p[1], s[0], s[1]); } });
    SEA.round++; EXT.stat.seasonGames++;
    let msg = "";
    if (SEA.round >= SEA.fix.length) {
      SEA.done = true; SEA.pos = sorted(SEA.table).indexOf("ron") + 1; EXT.stat.seasons++;
      const g = SEA.pos === 1 ? 12 : SEA.pos <= 3 ? 5 : 2; EXT.gt += g; msg = `Stagione finita: ${SEA.pos}° posto, +${g} gettoni.`;
      if (SEA.pos === 1) { moloPt("title", "season"); EXT.stat.titles++; const c2 = giveCoin("title", 10); if (c2) msg += ` Primo titolo: +${c2} monete.`; }
    }
    saveSea(); saveExt(); return msg;
  }

  // ---------------------------------------------------------------- coppa a eliminazione
  const cupUnlocked = () => openTeams(false).length >= 3;
  function loadCup() {
    const o = lsGet(KEY_CUP, null);
    if (!o || !Array.isArray(o.alive) || !Array.isArray(o.pairs)) return null;
    if (!o.alive.every((t) => t === "ron" || TEAMS_ALL.some((x) => x.id === t))) return null;
    return o;
  }
  let CUP = loadCup();
  const saveCup = () => lsSet(KEY_CUP, CUP);
  const cupRound = () => (CUP.alive.length >= 8 ? "Quarti di finale" : CUP.alive.length === 4 ? "Semifinali" : "Finale");
  const cupPairs = (ids) => { const p = []; for (let i = 0; i < ids.length; i += 2) p.push([ids[i], ids[i + 1]]); return p; };
  function newCup() {
    const opp = openTeams(false).map((t) => t.id), size = opp.length >= 7 ? 8 : 4;
    const ids = shuffle(["ron"].concat(shuffle(opp).slice(0, size - 1)));
    CUP = { active: true, done: false, champ: false, alive: ids, pairs: cupPairs(ids), log: [], out: "" }; saveCup();
  }
  function showCup() {
    uiState = "menu";
    if (!cupUnlocked()) { showUi(`<h2>Coppa del molo</h2>${lockRow("Si apre dopo aver battuto gli Scaricatori e un paio di altre squadre nel torneo.")}<button class="cgd-btn sec" data-a="back">Indietro</button>`); return act({ back: showHub }); }
    let h = `<h2>Coppa del molo</h2>`;
    if (!CUP) {
      showUi(h + `<p class="cgd-sub">Eliminazione diretta: si perde, si torna a casa. In caso di pareggio si continua a oltranza, punto d'oro senza limite di tempo. Con 7 squadre scoperte si gioca dai quarti; prima, dalle semifinali.</p>
        <p class="cgd-sub">Coppe vinte: ${EXT.stat.cups} · partite vinte in coppa: ${EXT.stat.cupWins}</p><button class="cgd-btn" data-a="new">Sorteggia il tabellone</button><button class="cgd-btn sec" data-a="back">Indietro</button>`);
      return act({ new: () => { newCup(); showCup(); }, back: showHub });
    }
    const draw = () => CUP.pairs.map((p) => `<div class="cgd-stat"><span class="${p[0] === "ron" ? "cgd-me" : ""}">${esc(SEA_N(p[0]))}</span><span class="${p[1] === "ron" ? "cgd-me" : ""}">${esc(SEA_N(p[1]))}</span></div>`).join("");
    if (CUP.done) {
      h += `<p class="cgd-sub">${CUP.champ ? "Hai vinto la Coppa del molo!" : "Eliminato: " + esc(CUP.out)}</p><div class="cgd-quote">${esc(CUP.champ ? "La coppa è un secchio verniciato d'oro, con i manici. Tullio la solleva, Remo la tiene ferma, il gabbiano la guarda con rispetto. Resta lì a lungo, in silenzio. Nives batte un colpo sulla ringhiera. Uno." : "Si esce a testa alta, per quel che serve in cemento. Tano: «Il tabellone è come il caffè: va riprovato». Il bar è chiuso, ma è un buon consiglio.")}</div>`;
      showUi(h + `<button class="cgd-btn" data-a="again">Nuova coppa</button><button class="cgd-btn sec" data-a="back">Indietro</button>`);
      return act({ again: () => { CUP = null; try { localStorage.removeItem(KEY_CUP); } catch (e) { /* ignora */ } showCup(); }, back: showHub });
    }
    const mine = CUP.pairs.find((p) => p[0] === "ron" || p[1] === "ron"), opp = mine[0] === "ron" ? mine[1] : mine[0];
    h += `<p class="cgd-sub">${cupRound()} · ${CUP.alive.length} squadre in gara</p><h3>Il tabellone</h3>${draw()}`;
    h += `<button class="cgd-btn" data-a="play">Gioca contro ${esc(SEA_N(opp))}</button><button class="cgd-btn sec" data-a="drop" data-p="0">Ritirati dalla coppa</button><button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({
      play: () => showBrief({ kind: "cup", mode: "tour", lv: teamById(opp), li: -1, target: 5, secs: 120, noDraw: true, title: cupRound(), sub: "Coppa · si gioca a oltranza" }, showCup),
      drop: (p, el) => { if (el.dataset.p === "0") { el.dataset.p = "1"; el.textContent = "Sicuro? Tocca ancora per ritirarti"; return; } CUP = null; try { localStorage.removeItem(KEY_CUP); } catch (e) { /* ignora */ } showCup(); },
      back: showHub,
    });
  }
  function cupAfter(win) {
    const mine = CUP.pairs.find((p) => p[0] === "ron" || p[1] === "ron"), opp = mine[0] === "ron" ? mine[1] : mine[0], rn = cupRound();
    let msg = "";
    if (!win) { CUP.done = true; CUP.out = rn + ", contro " + SEA_N(opp); const g = 1; EXT.gt += g; msg = `Eliminato in ${rn.toLowerCase()}. +${g} gettone.`; }
    else {
      EXT.stat.cupWins++;
      const next = CUP.pairs.map((p) => { if (p === mine) return "ron"; const sa = strOf(p[0]), sb = strOf(p[1]); return Math.random() < sa / (sa + sb) ? p[0] : p[1]; });
      EXT.gt += 2; msg = `${rn} superata. +2 gettoni.`;
      if (next.length === 1) { CUP.done = true; CUP.champ = true; moloPt("cup", "cup"); EXT.stat.cups++; EXT.gt += 8; msg = "Coppa vinta! +10 gettoni."; const c2 = giveCoin("cup", 8); if (c2) msg += ` Prima coppa: +${c2} monete.`; }
      else { CUP.alive = next; CUP.pairs = cupPairs(next); }
    }
    saveCup(); saveExt(); return msg;
  }

  // ---------------------------------------------------------------- sfide del giorno
  const DAILY_GT = [2, 3, 5];
  const DAILY_T = [
    { id: "sp", t: "Sponda d'autore", d: "Vinci con almeno 2 gol di sponda.", mk: () => ({ target: 5 }), ok: (g, a, c) => a > c && g.stats.spGoals >= 2 },
    { id: "cl", t: "Porta inviolata", d: "Vinci senza subire gol.", mk: () => ({ target: 4 }), ok: (g, a, c) => a > c && c === 0 },
    { id: "ru", t: "Pareti di gomma", d: "Vinci con le pareti di gomma.", mk: () => ({ target: 5, mod: "rubber" }), ok: (g, a, c) => a > c },
    { id: "we", t: "Cemento bagnato", d: "Vinci sul bagnato.", mk: () => ({ target: 5, mod: "wet" }), ok: (g, a, c) => a > c },
    { id: "tr", t: "Il fuoco del molo", d: "Segna almeno un Trabucco.", mk: () => ({ target: 5 }), ok: (g) => g.stats.trab >= 1 },
    { id: "la", t: "Partita lampo", d: "60 secondi: segna 5 punti.", mk: () => ({ mode: "time", secs: 60, target: 999 }), ok: (g, a) => a >= 5 },
    { id: "su", t: "Resistere", d: "Con 2 vite, arriva all'ondata 3.", mk: () => ({ mode: "surv", lives: 2, target: 999, secs: 0 }), ok: (g) => g.wave >= 3 },
    { id: "pe", t: "Dal dischetto", d: "Vinci una serie di 3 rigori.", mk: () => ({ mode: "pen", n: 3 }), ok: (g, a, c) => a > c },
    { id: "co", t: "Gioco di squadra", d: "Raggiungi una combo x3.", mk: () => ({ target: 5 }), ok: (g) => g.stats.bestCombo >= 3 },
    { id: "tu", t: "Tutto di fretta", d: "Vinci con il Turbo.", mk: () => ({ target: 5, mod: "turbo" }), ok: (g, a, c) => a > c },
    { id: "go", t: "Sponda d'oro", d: "Vinci: la sponda vale 3.", mk: () => ({ target: 5, mod: "gold" }), ok: (g, a, c) => a > c },
    { id: "bm", t: "Muro sicuro", d: "Fai almeno 3 sponde in una partita.", mk: () => ({ target: 4 }), ok: (g) => g.stats.banks >= 3 },
  ];
  function dailyEnsure() {
    const d = EXT.daily, k = todayK();
    if (d.day !== k || !Array.isArray(d.tk) || d.tk.length !== 3) {
      const open = openTeams(false), r = seeded(hashS(k)), idx = DAILY_T.map((_, i) => i);
      d.tk = [0, 1, 2].map((s) => { const ti = idx.splice(Math.floor(r() * idx.length), 1)[0], lim = Math.max(1, Math.ceil(open.length * (s + 1) / 3)); return [DAILY_T[ti].id, open[Math.floor(r() * lim)].id]; });
      d.day = k; d.done = [0, 0, 0]; saveExt();
    }
    return true;
  }
  const dailyStreak = () => (EXT.daily.last === todayK() || EXT.daily.last === prevK(todayK()) ? EXT.daily.streak : 0);
  function dailyCfg(s) {
    const t = DAILY_T.find((x) => x.id === EXT.daily.tk[s][0]) || DAILY_T[0], lv = teamById(EXT.daily.tk[s][1]);
    return Object.assign({ kind: "daily", mode: "tour", lv, li: -1, secs: 120, slot: s, tpl: t.id, back: showDaily, title: t.t, sub: "Sfida del giorno · " + t.d }, t.mk());
  }
  function showDaily() {
    uiState = "menu"; dailyEnsure();
    const d = EXT.daily;
    let h = `<h2>Sfida del giorno</h2><p class="cgd-sub">Tre sfide nuove ogni giorno, sempre diverse. Premio in gettoni, mai in monete. ${d.done.every((x) => x) ? "Fatto tutto: a domani." : ""}</p>
      <div class="cgd-gtrow">${gtTag()}<span class="cgd-sub">Serie: ${dailyStreak()} giorni · migliore ${d.best}</span></div>`;
    d.tk.forEach((x, s) => {
      const t = DAILY_T.find((y) => y.id === x[0]) || DAILY_T[0], lv = teamById(x[1]);
      h += `<button class="cgd-opp" data-a="go" data-p="${s}" ${d.done[s] ? "disabled" : ""}>${crest(lv)}<div><b>${esc(t.t)}</b><span>${esc(t.d)} · contro ${esc(lv.name)}</span></div><em>${d.done[s] ? "✔" : "◆" + DAILY_GT[s]}</em></button>`;
    });
    h += `<p class="cgd-sub">Tutte e tre nello stesso giorno: +4 gettoni di bonus e la serie cresce.</p><button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({ go: (s) => { const cfg = dailyCfg(+s); showBrief(cfg, showDaily); }, back: showHub });
  }
  function dailyAfter(g, a, c) {
    const d = EXT.daily, s = g.cfg.slot, t = DAILY_T.find((x) => x.id === g.cfg.tpl) || DAILY_T[0];
    if (d.done[s] || !t.ok(g, a, c)) return { ok: false, msg: d.done[s] ? "" : "Sfida non riuscita: riprovaci quando vuoi." };
    d.done[s] = 1; EXT.gt += DAILY_GT[s]; EXT.rec.daily++;
    let msg = `Sfida superata: +${DAILY_GT[s]} gettoni.`;
    if (d.done.every((x) => x)) {
      d.streak = d.last === prevK(todayK()) ? d.streak + 1 : 1; d.last = todayK(); d.best = Math.max(d.best, d.streak); EXT.gt += 4; msg += ` Tutte e tre: +4 gettoni, serie ${d.streak}.`;
    }
    saveExt(); return { ok: true, msg };
  }

  // ---------------------------------------------------------------- squadra
  let swapSel = "";
  function showSquad() {
    uiState = "menu";
    let h = `<h2>La squadra</h2><p class="cgd-sub">Tre in campo: Fronte (davanti), Jolly (a metà) e Muro (dietro). Tocca un compagno in panchina, poi uno dei titolari da sostituire.</p>`;
    h += `<h3>In campo</h3>`;
    EXT.squad.forEach((id, i) => { const p = POOL[id]; h += `<button class="cgd-opp${swapSel ? " pick" : ""}" data-a="st" data-p="${id}"><div class="cgd-crest" style="border-color:${p.kit2};background:${p.kit};color:${p.kit2}">${SLOT[i].role.slice(0, 2).toUpperCase()}</div><div><b>${p.name} · ${SLOT[i].role}</b><span>${p.tr ? esc(p.pitch) : esc(p.bio)}</span></div></button>`; });
    const bench = EXT.pool.filter((id) => EXT.squad.indexOf(id) < 0), hid = Object.keys(POOL).filter((id) => EXT.pool.indexOf(id) < 0);
    h += `<h3>In panchina</h3>`;
    if (!bench.length) h += `<p class="cgd-sub">Nessuno. Per ora.</p>`;
    bench.forEach((id) => { const p = POOL[id]; h += `<button class="cgd-opp${swapSel === id ? " pick" : ""}" data-a="bn" data-p="${id}"><div class="cgd-crest" style="border-color:${p.kit2};background:${p.kit};color:${p.kit2}">${p.name[0]}</div><div><b>${p.name}${p.tr ? " · " + TRAIT_N[p.tr] : ""}</b><span>${esc(p.bio)} ${p.tr ? esc(p.pitch) : ""}</span></div><em>${swapSel === id ? "scegli chi esce" : ""}</em></button>`; });
    hid.forEach(() => { h += lockRow("Si unisce al molo più avanti, strada facendo."); });
    h += `<button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({
      bn: (id) => { swapSel = swapSel === id ? "" : id; showSquad(); },
      st: (id) => { if (!swapSel) return; const i = EXT.squad.indexOf(id); if (i >= 0) { EXT.squad[i] = swapSel; swapSel = ""; saveExt(); } showSquad(); },
      back: () => { swapSel = ""; showHub(); },
    });
  }

  // ---------------------------------------------------------------- estetica
  function showCos(msg) {
    uiState = "menu";
    const G4 = [["kit", "Maglia", KITS], ["ball", "Palla", BALLS], ["field", "Campo", FIELDS], ["tag", "Sigla", TAGS]];
    let h = `<h2>Estetica</h2><div class="cgd-gtrow">${gtTag()}<span class="cgd-sub">Solo estetica: nessun vantaggio in campo.</span></div><div class="cgd-note" style="display:${msg ? "block" : "none"}">${esc(msg || "")}</div>`;
    G4.forEach(([k, lab]) => {
      h += `<h3>${lab}</h3><div class="cgd-seg w c">`;
      COS[k].forEach((_, i) => {
        const it = cosItem(k, i), own = cosOwned(k, i), cur = EXT.cos[k] === i, gated = !own && !gateOk(it.gate);
        const nm = gated ? "???" : it.n, sub = cur ? "In uso" : own ? "Scegli" : gated ? GATE_TXT[it.gate] : "◆ " + it.p;
        h += `<button data-a="c" data-p="${k}|${i}" class="${cur ? "on" : ""}"><b>${esc(nm)}</b><small>${esc(sub)}</small></button>`;
      });
      h += `</div>`;
    });
    h += `<button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({
      c: (p) => {
        const [k, s] = p.split("|"), i = +s, it = cosItem(k, i);
        if (cosOwned(k, i)) { EXT.cos[k] = i; if (EXT.cos.own[k].indexOf(i) < 0 && it.p === 0) EXT.cos.own[k].push(i); saveExt(); bgCache = null; return showCos(); }
        if (!gateOk(it.gate)) return showCos("Questo si apre più avanti.");
        if (EXT.gt < it.p) return showCos(`Servono ${it.p} gettoni: ne hai ${EXT.gt}.`);
        EXT.gt -= it.p; EXT.cos.own[k].push(i); EXT.cos[k] = i; saveExt(); bgCache = null; showCos(`Preso: ${it.n}.`);
      },
      back: showHub,
    });
  }

  // ---------------------------------------------------------------- diario del molo
  const HINT_LOCK = ["Una porta ancora chiusa.", "Qualcuno non ha ancora parlato.", "Serve ancora un po' di strada.", "Prima bisogna giocare."];
  function showDiary() {
    uiState = "menu";
    let h = `<h2>Diario del molo</h2><p class="cgd-sub">Le storie del quartiere si aprono a tappe, giocando. Quello che non conosci ancora resta «???».</p>`;
    CHAPTERS.forEach((c, i) => {
      if (chOpen(c)) h += `<button class="cgd-opp" data-a="rd" data-p="${c.id}"><div class="cgd-crest" style="border-color:#6b5338;color:#fdba74">${i + 1}</div><div><b>${esc(c.t)}</b><span>${esc(c.w)}${c.rec && !readCh(c.id) ? " · qualcuno ti aspetta" : ""}</span></div><em>${readCh(c.id) ? "✔" : "NUOVO"}</em></button>`;
      else h += lockRow(HINT_LOCK[i % HINT_LOCK.length]);
    });
    h += `<button class="cgd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    act({ rd: (id) => showScene(id, 0, showDiary), back: showHub });
  }
  function showScene(id, i, back) {
    const c = CHAPTERS.find((x) => x.id === id); uiState = "scene";
    const ln = c.lines[i], who = CASTC[ln[0]] || CASTC.voce, last = i === c.lines.length - 1;
    showUi(`<h3>${esc(c.t)} · ${esc(c.w)}</h3><div class="cgd-dots">${c.lines.map((_, k) => (k === i ? "<b>●</b>" : "●")).join(" ")}</div>
      <div class="cgd-sc2" style="border-color:${who.c}">${who.n ? `<b style="color:${who.c}">${esc(who.n)}</b>` : ""}<p${who.n ? "" : ' style="font-style:italic"'}>${esc(ln[1])}</p></div>
      <button class="cgd-btn" data-a="next">${last ? "Chiudi la pagina" : "Avanti"}</button>${i > 0 ? '<button class="cgd-btn sec" data-a="prev">Indietro</button>' : ""}`);
    act({
      next: () => {
        if (!last) return showScene(id, i + 1, back);
        let m = "";
        if (!readCh(id)) { EXT.read.push(id); EXT.gt += 1; if (c.rec && EXT.pool.indexOf(c.rec) < 0) { EXT.pool.push(c.rec); m = POOL[c.rec].name + " entra in squadra (la trovi in panchina)."; } saveExt(); }
        if (m) { showUi(`<h2>${esc(c.t)}</h2><div class="cgd-quote">${esc(m)}</div><p class="cgd-sub">+1 gettone di Gabbia.</p><button class="cgd-btn" data-a="ok">Continua</button>`); act({ ok: back }); } else back();
      },
      prev: () => showScene(id, i - 1, back),
    });
  }

  // ---------------------------------------------------------------- avvio partita
  function launch(cfg) {
    hideUi(); uiState = "play"; paused = false; bgCache = null;
    if (cfg.mode === "pen") cfg.mod = "none";
    newMatch(cfg);
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false; input.chargeF = 0; input.passEdge = input.bankEdge = input.shootRel = input.trab = false; input.touchOn = false;
    root.classList.toggle("pen", cfg.mode === "pen");
    stage.querySelector(".cgd-pad").classList.toggle("all", SET.ctrl === "touch");
    if (cfg.kind === "tour" && cfg.li >= 0) PROG.played++; else EXT.stat.games++;
    if (cfg.kind === "free") EXT.rec.free++; if (cfg.kind === "train") EXT.rec.train++;
    saveProg(); saveExt();
    showDefaultStick(); acc = 0; lastTs = 0; hud();
    if (cfg.mode !== "pen") say(cfg.lv.pre || pickQ(QUIP.pre), 3000);
  }

  // ---------------------------------------------------------------- risultato
  const LOSE_Q = [
    "Perso. Succede, la Gabbia non fa sconti e nemmeno il caffè. Un vecchio dal balcone grida «Andava bene così!». Non è vero, ma è un gesto d'amore.",
    "Hai perso, ma almeno hai rimbalzato con stile. Di quelli che lasciano il segno sul muro: se ci guardi bene, c'è ancora.",
    "Tullio ti passa un secchio d'acqua e un'occhiata paterna: «Il muro è lì anche domani. Tu pure, spero».",
    "Tano: «Colpa del fondo!». Il fondo è di cemento, Tano. Ma intanto ti offre un caffè immaginario. Di quelli che consolano davvero.",
  ];
  function showResult() {
    uiState = "result";
    const cfg = G.cfg, k = cfg.kind, m = G.mode, [a, c] = G.score;
    const before = newOpenChapters(), win = a > c, draw = a === c;
    let st = 0, coins = 0, gt = 0, title = win ? "Vittoria!" : draw ? "Pareggio" : "Sconfitta", extra = "", quote = "", btns = "", map = {};
    PROG.pts += a; PROG.bestCombo = Math.max(PROG.bestCombo, G.stats.bestCombo); EXT.stat.trab += G.stats.trab;
    const back = cfg.back || showHub;
    if (win) PROG.wins++;
    if (k === "tour") {
      const li = G.li, lv = cfg.lv;
      if (win) {
        st = 1 + (a - c >= 3 ? 1 : 0) + (c <= 1 ? 1 : 0); gt = st;
        if (li >= 0) { PROG.stars[li] = Math.max(PROG.stars[li], st); if (!PROG.coin[li]) { PROG.coin[li] = 1; coins = COINS[li]; if (typeof window.addCoins === "function") { try { window.addCoins(coins); } catch (e) { /* ignora */ } } } }
        else { EXT.ex[lv.id] = Math.max(EXT.ex[lv.id] | 0, st); coins = giveCoin("ex-" + lv.id, coinFor(lv)); }
      }
    } else if (k === "boss") {
      if (win) { st = 1; gt = EXT.boss[cfg.lv.id] ? 1 : cfg.lv.gt; if (!EXT.boss[cfg.lv.id]) { EXT.boss[cfg.lv.id] = 1; coins = giveCoin("boss-" + cfg.lv.id, cfg.lv.coin); } }
    } else if (k === "free") { if (win) { EXT.rec.freeW++; gt = 1; } }
    else if (k === "surv") { title = "Ondata " + G.wave; EXT.rec.surv = Math.max(EXT.rec.surv, G.wave); gt = Math.max(0, G.wave - 1); extra = `<div class="cgd-stat"><span>Ondata raggiunta</span><span>${G.wave} (record ${EXT.rec.surv})</span></div>`; }
    else if (k === "time") { title = "Tempo!"; const old = EXT.rec.time[cfg.secs] | 0; EXT.rec.time[cfg.secs] = Math.max(old, a); gt = Math.floor(a / 4); extra = `<div class="cgd-stat"><span>Punti segnati</span><span>${a}${a > old ? " · nuovo record" : " (record " + old + ")"}</span></div>`; }
    else if (k === "pen") { if (win) { EXT.rec.penW++; gt = 1; } else if (!draw) EXT.rec.penL++; EXT.rec.penG += a; }
    else if (k === "train") title = "Allenamento concluso";
    else if (k === "season") { extra = `<p style="text-align:center;color:#fde047;font-weight:800">${esc(seasonAfter(a, c) || "Giornata registrata.")}</p>`; }
    else if (k === "cup") { extra = `<p style="text-align:center;color:#fde047;font-weight:800">${esc(cupAfter(win))}</p>`; }
    else if (k === "daily") { const r = dailyAfter(G, a, c); extra = `<p style="text-align:center;color:${r.ok ? "#fde047" : "#fdba74"};font-weight:800">${esc(r.msg)}</p>`; }
    if (gt && k !== "daily") { EXT.gt += gt; }
    if (win) moloPt(k === "boss" ? "boss" : "win", k + ":" + (cfg.lv ? (cfg.lv.id || cfg.lv.tag || cfg.lv.name) : ""));
    if (k === "surv" && G.wave >= 4) moloPt("feat", "surv4");
    if (k === "time" && a >= 8) moloPt("feat", "time8");
    saveProg(); saveExt();
    const fresh = newOpenChapters().filter((x) => before.indexOf(x) < 0 && !readCh(x)).map((x) => CHAPTERS.find((y) => y.id === x).t);
    const lvq = cfg.lv && cfg.lv.win;
    quote = (win && (k === "tour" || k === "boss") && lvq) ? lvq : win ? pickQ(["Il gabbiano scende sul tetto più basso, per vedere meglio. Per lui è una festa.", "Mastro Remo si soffia il naso. Rumore di vela. È un sì."]) : draw ? "Pari e patta. Nessuno vince, nessuno perde, il sole cala. Il gabbiano sul tetto della rete è l'unico ad aver capito tutto." : LOSE_Q[Math.floor(Math.random() * LOSE_Q.length)];
    if (k === "time") quote = a >= 8 ? "Il cronometro ti guarda come Nives guarda il bucato: con rispetto e un po' di sospetto." : a ? "Il tempo è finito. Dal balcone: «Già?». È il complimento più lungo che Nives conosca." : "Il cronometro non ha pietà, e nemmeno un caffè. Il prossimo giro va meglio: la rete è sempre lì.";
    if (k === "surv") quote = G.wave >= 4 ? "Quattro squadre, un solo fiato. Mastro Remo si commuove: rumore di vela, a lungo." : "Le ondate vanno e vengono, come la marea sotto il molo. Tullio: «Prima o poi si impara il ritmo».";
    if (k === "train") quote = "Nessun risultato, e va bene così. Tullio, con il lucchetto in mano: «Ogni sera una palla in più. Alla fine fanno una stagione».";
    const gtLine = gt && k !== "daily" ? `<p style="text-align:center;color:#7dd3fc;font-weight:800">+${gt} gettoni di Gabbia</p>` : "";
    const showScore = m !== "surv" && k !== "train";
    // pulsanti
    const again = !["season", "cup", "daily", "boss"].includes(k) || k === "boss";
    let next = null; const lvIdx = k === "tour" ? WAVE_SEQ.indexOf(cfg.lv) : -1;
    if (k === "tour" && win && lvIdx >= 0 && lvIdx < WAVE_SEQ.length - 1 && teamOpen(WAVE_SEQ[lvIdx + 1])) next = WAVE_SEQ[lvIdx + 1];
    if (next) btns += `<button class="cgd-btn" data-a="next">Prossima: ${esc(next.name)}</button>`;
    if (again) btns += `<button class="cgd-btn ${next ? "sec" : ""}" data-a="again">Rigioca</button>`;
    btns += `<button class="cgd-btn sec" data-a="menu">${k === "season" ? "Alla classifica" : k === "cup" ? "Al tabellone" : "Indietro"}</button><button class="cgd-btn sec" data-a="hub">Menu principale</button>`;
    showUi(`<h2>${title}</h2>${showScore ? `<div class="cgd-score"><span style="color:#7dd3fc">${a}</span> - <span style="color:#fdba74">${c}</span></div>` : ""}
      <p class="cgd-sub" style="text-align:center">${esc(myTag())} · ${esc(cfg.title || (cfg.lv ? cfg.lv.name : ""))}</p>${win && st ? `<div class="cgd-stars">${k === "boss" ? "★" : stars(st)}</div>` : ""}
      ${coins ? `<p style="text-align:center;color:#fde047;font-weight:800">+${coins} monete (prima vittoria)</p>` : ""}${gtLine}${extra}
      <div class="cgd-quote">${esc(quote)}</div><p class="cgd-sub" style="text-align:center">${esc(pickQ(QUIP.end))}</p>
      ${fresh.length ? `<p style="text-align:center;color:#fde047;font-weight:800">📖 Nuova pagina nel Diario del molo</p>` : ""}
      ${m === "pen" ? "" : `<div class="cgd-stat"><span>Gol di sponda</span><span>${G.stats.spGoals}</span></div><div class="cgd-stat"><span>Sponde tentate</span><span>${G.stats.banks}</span></div><div class="cgd-stat"><span>Spallate</span><span>${G.stats.spallate}</span></div><div class="cgd-stat"><span>Miglior combo</span><span>x${G.stats.bestCombo}</span></div>`}${btns}`);
    map.next = () => showBrief(tourCfg(next), back); map.again = () => launch(cfg); map.menu = back; map.hub = showHub;
    if (k === "boss") map.again = () => showBrief(bossCfg(cfg.lv), back);
    act(map);
  }

  function pauseGame() {
    if (uiState !== "play") return;
    uiState = "pause"; paused = true; input.charging = false; input.jx = input.jy = 0;
    const k = G.cfg.kind, canRst = !["season", "cup", "daily"].includes(k);
    showUi(`<h2>In pausa</h2><p class="cgd-sub">${esc(G.lv.name)} · ${G.score[0]} - ${G.score[1]}</p><button class="cgd-btn" data-a="res">Riprendi</button>
      <h3>Controlli</h3>${segH("ctrl", [["stick", "Joystick"], ["touch", "Tocca e corri"]], SET.ctrl)}
      <div class="cgd-g2"><button class="cgd-btn sec" data-a="tut">Come si gioca</button>${canRst ? '<button class="cgd-btn sec" data-a="rst">Ricomincia</button>' : ""}</div>
      ${k === "train" ? '<button class="cgd-btn sec" data-a="fin">Termina l\'allenamento</button>' : ""}<button class="cgd-btn red" data-a="menu">Abbandona (menu)</button>`);
    act({
      res: resumeGame,
      ctrl: (v) => { SET.ctrl = v; saveSet(); ui.querySelectorAll('[data-a="ctrl"]').forEach((x) => x.classList.toggle("on", x.dataset.p === v)); stage.querySelector(".cgd-pad").classList.toggle("all", SET.ctrl === "touch"); },
      tut: () => showTutorial(0, pauseGame), rst: () => launch(G.cfg), fin: () => { hideUi(); uiState = "play"; paused = false; endMatch(); },
      menu: () => { const b = G.cfg.back || showHub; G = null; root.classList.remove("pen"); b(); },
    });
  }
  function resumeGame() { hideUi(); uiState = "play"; paused = false; lastTs = 0; acc = 0; showDefaultStick(); }

  function route(o) {
    o = o || {}; const s = o.screen || "hub";
    const q = { free: "free", surv: "surv", time: "time", pen: "pen", train: "train" };
    if (q[s]) { if (o.opp && (o.opp === "dummy" || teamOpen(teamById(o.opp)))) EXT.opt[q[s]].opp = o.opp; return showSetup(s); }
    if (s === "bossfight" && o.opp) { const b = BOSSES.find((x) => x.id === o.opp); if (b && teamOpen(b)) return showBrief(bossCfg(b), showBoss); }
    const R = { hub: showHub, tour: showTour, boss: showBoss, season: showSeason, cup: showCup, daily: showDaily, squad: showSquad, cos: showCos, diary: showDiary, opts: showOpts };
    (R[s] || showHub)();
  }

  // ---------------------------------------------------------------- apertura / chiusura
  function closeAll(silent) {
    if (closed && !root) return;
    closed = true; cancelAnimationFrame(raf);
    timers.forEach(clearTimeout); timers = [];
    cleanup.forEach((fn) => { try { fn(); } catch (e) { /* ignora */ } }); cleanup = [];
    if (root) { root.remove(); root = null; }
    cv = cx = ui = stage = null; G = null;
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false;
    const cb = onExitCb; onExitCb = null;
    if (silent !== true && typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  function openCage(onExit, opts) {
    if (root) closeAll(true);
    injectCss();
    onExitCb = onExit; PROG = loadProg(); SET = loadSet();
    closed = false; paused = false; lastTs = 0; acc = 0; G = null; uiState = "menu"; bgCache = null;
    root = document.createElement("div");
    root.className = "cgd-root"; root.id = "streetCageModal"; root.tabIndex = 0;
    root.innerHTML = `
      <div class="cgd-top">
        <button class="cgd-ib" data-a="pause" aria-label="Pausa">⏸</button>
        <div class="cgd-sc"><b>RON 0 - 0 ---</b><small>La Gabbia del Molo</small>
          <div class="cgd-bars"><div class="cgd-bar" title="Grinta"><i></i></div><span class="cgd-cmb"></span></div></div>
        <button class="cgd-ib" data-a="close" aria-label="Chiudi">✕</button>
      </div>
      <div class="cgd-stage">
        <canvas></canvas>
        <div class="cgd-pad"></div><div class="cgd-stk"><i></i></div>
        <div class="cgd-msg"></div><div class="cgd-banner"></div><div class="cgd-chg"><i></i></div>
        <button class="cgd-pshoot" aria-label="Tira">TIRA</button>
        <div class="cgd-pz">${[[-1,1,"ALTO SX"],[0,1,"ALTO"],[1,1,"ALTO DX"],[-1,0,"BASSO SX"],[0,0,"BASSO"],[1,0,"BASSO DX"]].map((z) => `<button data-c="${z[0]}" data-r="${z[1]}" aria-label="Tuffo ${z[2]}">${z[2]}</button>`).join("")}</div>
        <div class="cgd-btns">
          <button class="cgd-b shoot" aria-label="Tiro">TIRO<small>tieni e rilascia</small></button>
          <button class="cgd-b bank" aria-label="Sponda">SPONDA<small>rimbalza</small></button>
          <button class="cgd-b pass" aria-label="Passa">PASSA<small>spallata</small></button>
          <button class="cgd-b trab" aria-label="Trabucco">🔥<small>TRABUCCO</small></button>
        </div>
        <div class="cgd-ui"></div>
      </div>`;
    document.body.appendChild(root);
    stage = root.querySelector(".cgd-stage"); cv = root.querySelector("canvas"); cx = cv.getContext("2d"); ui = root.querySelector(".cgd-ui");
    root.querySelector('[data-a="close"]').onclick = () => { if (uiState === "play") pauseGame(); else closeAll(); };
    root.querySelector('[data-a="pause"]').onclick = () => { if (uiState === "play") pauseGame(); else if (uiState === "pause") resumeGame(); };
    bindPad();
    bindBtn(root.querySelector(".cgd-b.shoot"), () => { if (uiState === "play") { input.charging = true; input.chargeF = 0; } }, () => { if (input.charging) { input.charging = false; input.shootRel = true; } });
    bindBtn(root.querySelector(".cgd-b.bank"), () => { if (uiState === "play") input.bankEdge = true; });
    bindBtn(root.querySelector(".cgd-b.pass"), () => { if (uiState === "play") input.passEdge = true; });
    bindBtn(root.querySelector(".cgd-b.trab"), () => { if (uiState === "play") input.trab = true; });
    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
    window.addEventListener("keydown", kd, { passive: false }); window.addEventListener("keyup", ku, { passive: false });
    const vis = () => { if (document.hidden && uiState === "play") pauseGame(); };
    document.addEventListener("visibilitychange", vis);
    cleanup.push(() => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); document.removeEventListener("visibilitychange", vis); });
    root.querySelector(".cgd-pshoot").addEventListener("pointerdown", (e) => { e.preventDefault(); if (uiState === "play") penShoot(); });
    root.querySelectorAll(".cgd-pz button").forEach((b) => b.addEventListener("pointerdown", (e) => { e.preventDefault(); if (uiState === "play") penDive(+b.dataset.c, +b.dataset.r); }));
    if (DEBUG) window.__cgd = { G: () => G, input, SET, PROG: () => PROG, EXT: () => EXT, SEA: () => SEA, CUP: () => CUP, start: (cfg) => { cfg = cfg || {}; if (cfg.lv && typeof cfg.lv === "string") cfg.lv = teamById(cfg.lv); cfg.kind = cfg.kind || "free"; cfg.lv = cfg.lv || LEVELS[0]; launch(cfg); }, hub: showHub, ts: (n) => { window.__cgdTS = n; }, save: saveExt, DAILY_T, CHAPTERS, POOL };
    raf = requestAnimationFrame(loop);
    root.focus();
    route(opts);
  }
  window.openStreetCageMode = function (onExit) { openCage(onExit, null); };
  // API per il Borgo camminabile e per altri moduli: screen = hub|tour|boss|free|surv|time|pen|train|season|cup|daily|squad|cos|diary|opts|bossfight (+ opp)
  window.__cageHd = {
    start: function (opts) { opts = opts || {}; openCage(opts.onExit, opts); },
    info: function () { dailyEnsure(); return { unread: unreadCount(), dailyLeft: EXT.daily.done.filter((x) => !x).length, season: !!(SEA && SEA.active && !SEA.done), cup: !!(CUP && CUP.active && !CUP.done), stars: LEVELS.map((_, i) => starsOf(i)), bosses: BOSSES.filter((b) => bossDone(b.id)).length, titles: EXT.stat.titles, cups: EXT.stat.cups, gt: EXT.gt, open: openTeams(false).length, chapters: EXT.read.length }; },
    version: 2,
  };
})();
