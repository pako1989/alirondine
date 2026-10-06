// ================= MODALITÀ GACHA: IL DISTRIBUTORE DEL BAR MORETTI =================
// Pupazzetti e Miniature 3D da Collezione «Mini-Leggende della Costa»
// - Macchinetta Gashapon vintage in ghisa rossa e campana di vetro
// - Pescata 1x (15 monete) e Multi-pescata 10x (130 monete con 4★ garantito)
// - Sistema di rarità: 3★ Bronzo, 4★ Argento, 5★ Oro Foil, 6★ Arcobaleno Olografico
// - Fonderia Frammenti & Banco Scambi: riscatto statuine mancanti, forgiatura monete/biglietti dorati e upgrade ★+
// - Vetrinetta in legno da collezione con ispezione 3D a 360° e 40 pupazzetti da collezionare
(function () {
  "use strict";

  const K_DATA = "ali-di-rondine.gacha-toys";

  // --- CATALOGO DI 40 PUPAZZETTI GIOCATTOLO DELLA COSTA ---
  const TOY_CATALOG = [
    // ==========================================
    // 3★ COMUNI (Basetta Bronzo Vintage) - 10 Pupazzetti
    // ==========================================
    {
      id: "baciccia_boots",
      name: "Baciccia Pescatore",
      title: "Il Maestro dei Nodi",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · I Pionieri del Molo",
      pedestal: "bronze",
      shirtColor: "#1d4872",
      shortsColor: "#112233",
      hairColor: "#d0d5dd",
      skinColor: "#d89e72",
      headType: "cap",
      acc: "pipe",
      quote: "«Il mare non mente mai. E neanche un cross ben calciato.»",
      lore: "Modellino vintage in gomma vulcanizzata con stivali verdi cerati e pipa in radica rimovibile. Tiratura Bar Moretti 1986.",
      bonus: "+2 Contrasto sulle fasce",
      statKey: "def",
      statVal: 0.02
    },
    {
      id: "aurelio_bless",
      name: "Don Aurelio",
      title: "Il Parroco del Borgo",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · I Pionieri del Molo",
      pedestal: "bronze",
      shirtColor: "#222226",
      shortsColor: "#161618",
      hairColor: "#f0f0f0",
      skinColor: "#f3cc9c",
      headType: "bald",
      acc: "bell",
      quote: "«Benedico i pali della porta ogni domenica prima dell'omelia.»",
      lore: "Include mini-campanella in ottone massiccio. Se scuoti il pupazzetto, tintinna davvero!",
      bonus: "+5% probabilità di deviazione salvifica",
      statKey: "def",
      statVal: 0.02
    },
    {
      id: "rita_trofie",
      name: "Rita della Trattoria",
      title: "Regina del Pesto a Mortaio",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · I Sapori della Costa",
      pedestal: "bronze",
      shirtColor: "#ffffff",
      shortsColor: "#2b4a2e",
      hairColor: "#42281a",
      skinColor: "#f4c69d",
      headType: "bun",
      acc: "apron",
      quote: "«Due etti di trofie prima della partita e correte fino ai supplementari!»",
      lore: "Grembiule in cotone plastificato con macchia di basilico DOP dipinta a mano. Un classico introvabile.",
      bonus: "+15% Ricarica energia nel secondo tempo",
      statKey: "en",
      statVal: 0.005
    },
    {
      id: "tonino_caffe",
      name: "Tonino del Bar",
      title: "Signore del Bancone",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · I Sapori della Costa",
      pedestal: "bronze",
      shirtColor: "#b3202c",
      shortsColor: "#1a1a1a",
      hairColor: "#1a1a1a",
      skinColor: "#e8b88a",
      headType: "short_part",
      acc: "coffee",
      quote: "«Un espresso doppio per Leo, ristretto per papà, gratis se vincete il derby.»",
      lore: "Statuetta con tazzina in ceramica incollata alla mano. Ha l'aroma di miscela arabica tostate sul molo.",
      bonus: "+1 Scatto iniziale",
      statKey: "spd",
      statVal: 0.015
    },
    {
      id: "ragazzino_molo",
      name: "Il Raccattapalle del Molo",
      title: "Guardiano delle Scogliere",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · Giovani Promesse",
      pedestal: "bronze",
      shirtColor: "#f59e0b",
      shortsColor: "#1e3a8a",
      hairColor: "#5c3317",
      skinColor: "#f5caa0",
      headType: "messy",
      acc: "ball",
      quote: "«Se la palla finisce tra gli scogli, mi tuffo io a prenderla!»",
      lore: "Il pupazzetto ha le ginocchia sbucciate dipinte di rosso vivo e un retino da pesca giocattolo.",
      bonus: "+10% Velocità recupero palloni vaganti",
      statKey: "spd",
      statVal: 0.015
    },
    {
      id: "pescivendolo",
      name: "Gino il Pescivendolo",
      title: "Voce del Mercato Ittico",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · I Mestieri del Borgo",
      pedestal: "bronze",
      shirtColor: "#0284c7",
      shortsColor: "#0f172a",
      hairColor: "#475569",
      skinColor: "#d99b70",
      headType: "side_part",
      acc: "fish_crate",
      quote: "«Acciughe fresche e tiri al volo: solo roba di prima scelta!»",
      lore: "Modellino in plastica rigida con cassetta di pesce azzurro glitterato. Portafortuna storico.",
      bonus: "+2 Monete bonus per vittoria",
      statKey: "coin",
      statVal: 1
    },
    {
      id: "gabbiano_mascotte",
      name: "Il Gabbiano Fortunato",
      title: "Spettatore Non Pagante",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · Fauna della Riviera",
      pedestal: "bronze",
      shirtColor: "#ffffff",
      shortsColor: "#ffffff",
      hairColor: "#94a3b8",
      skinColor: "#ffffff",
      headType: "beak",
      acc: "focaccia_slice",
      quote: "«KRAAA! La focaccia del capitano è mia!»",
      lore: "Scultura tridimensionale di gabbiano con pezzo di focaccia nel becco. È appollaiato sulla traversa.",
      bonus: "+3% Deviazione fortunata dei cross",
      statKey: "def",
      statVal: 0.015
    },
    {
      id: "gigi_clown",
      name: "Gigi Mascotte della Fossa",
      title: "Tamburino della Curva",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · Tifo Organizzato",
      pedestal: "bronze",
      shirtColor: "#ef4444",
      shortsColor: "#1d4ed8",
      hairColor: "#ffd23f",
      skinColor: "#fcd34d",
      headType: "afro",
      acc: "drum",
      quote: "«RONDINE ALÉ! Fino al novantesimo e anche dopo!»",
      lore: "Fascia amaranto in testa e mini-tamburo in latta. Il primo pupazzetto distribuito alle sagre.",
      bonus: "+5 Morale di squadra",
      statKey: "en",
      statVal: 0.005
    },
    {
      id: "tonio_trabucchi",
      name: "Mastro Tonio dei Trabucchi",
      title: "Il Calafato delle Querce",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · I Maestri d'Ascia",
      pedestal: "bronze",
      shirtColor: "#78350f",
      shortsColor: "#451a03",
      hairColor: "#71717a",
      skinColor: "#c28854",
      headType: "straw_hat",
      acc: "wooden_hammer",
      quote: "«Il legno di quercia regge le onde. Una buona difesa regge qualsiasi assedio.»",
      lore: "Miniatura in resina d'ebano con cappello di paglia modellato e martello d'ottone da calafato.",
      bonus: "+2 Solidità sui calci piazzati",
      statKey: "def",
      statVal: 0.02
    },
    {
      id: "bice_bocce",
      name: "Nonna Bice delle Bocce",
      title: "La Geometra del Pallino",
      stars: 3,
      rarityName: "Comune",
      series: "Serie 1 · Campioni del Circolo",
      pedestal: "bronze",
      shirtColor: "#15803d",
      shortsColor: "#14532d",
      hairColor: "#e4e4e7",
      skinColor: "#f3c59a",
      headType: "bun",
      acc: "bocce_ball",
      quote: "«Tirare forte è da giovani frettolosi. Accostare al millimetro è da maestri.»",
      lore: "Include mini-boccia in acciaio lucidato a specchio che riflette i riflettori del campo.",
      bonus: "+3 Precisione passaggi rasoterra",
      statKey: "spd",
      statVal: 0.015
    },

    // ==========================================
    // 4★ RARI (Basetta Argento Cromato) - 14 Pupazzetti
    // ==========================================
    {
      id: "bruno_tackle",
      name: "Bruno lo Stopper",
      title: "Il Muro di Ghisa",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Difensori di Roccia",
      pedestal: "silver",
      shirtColor: "#1e3a8a",
      shortsColor: "#172554",
      hairColor: "#1c1917",
      skinColor: "#e0a97a",
      headType: "buzz",
      acc: "knee_brace",
      quote: "«O passa la palla, o passa l'attaccante. Entrambi mai.»",
      lore: "Edizione cromata con ginocchiera ortopedica dorata e zolle d'erba in rilievo sulla basetta d'argento.",
      bonus: "+4 Efficacia nelle scivolate",
      statKey: "def",
      statVal: 0.035
    },
    {
      id: "fede_parabola",
      name: "Federico il Regista",
      title: "Compasso di Centrocampo",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Cervelli del Gioco",
      pedestal: "silver",
      shirtColor: "#1e3a8a",
      shortsColor: "#ffffff",
      hairColor: "#854d0e",
      skinColor: "#f6caa0",
      headType: "medium_curly",
      acc: "wristband",
      quote: "«Io guardo il compagno prima ancora che riceva la palla.»",
      lore: "Statuina bilanciata con precisione: la traiettoria del pallone segue un filo d'argento invisibile.",
      bonus: "+3 Precisione passaggi filtranti",
      statKey: "spd",
      statVal: 0.025
    },
    {
      id: "tommy_flash",
      name: "Tommy il Pendolino",
      title: "Freccia della Fascia Destra",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Ali Inafferrabili",
      pedestal: "silver",
      shirtColor: "#1e3a8a",
      shortsColor: "#ffffff",
      hairColor: "#ca8a04",
      skinColor: "#fed7aa",
      headType: "wind_spiky",
      acc: "scuff_shoes",
      quote: "«L'importante non è essere veloci. È partire prima degli altri.»",
      lore: "Scia di fumo trasparente attaccata ai talloni. Scarpini vintage arancioni fluorescenti.",
      bonus: "+5% Velocità di scatto in Calcio d'Azione",
      statKey: "spd",
      statVal: 0.035
    },
    {
      id: "nico_gelato",
      name: "Nico Relax al Bar",
      title: "Il Portiere Fuori Servizio",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Momenti di Borgo",
      pedestal: "silver",
      shirtColor: "#f97316",
      shortsColor: "#111827",
      hairColor: "#ea580c",
      skinColor: "#fed7aa",
      headType: "wild_orange",
      acc: "icecream",
      quote: "«Parare è bello, ma un cono fiordilatte e pistacchio lo è di più.»",
      lore: "Nico in divisa d'allenamento con gelato a tre gusti modellato in resina satinata.",
      bonus: "+4 Sicurezza nelle prese aeree",
      statKey: "def",
      statVal: 0.03
    },
    {
      id: "sara_tactics",
      name: "Sara la Giornalista",
      title: "La Penna Affilata della Riviera",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Cronache Sportive",
      pedestal: "silver",
      shirtColor: "#059669",
      shortsColor: "#064e3b",
      hairColor: "#312e81",
      skinColor: "#fcd34d",
      headType: "bob_glasses",
      acc: "tablet",
      quote: "«Il cronista non tifa. Ma se segna Moretti scrive in neretto.»",
      lore: "Occhiali metallici tartarugati e tablet tattico con grafici del pressing avversario.",
      bonus: "+10% Analisi debolezze portiere avversario",
      statKey: "spd",
      statVal: 0.025
    },
    {
      id: "garnier_gk",
      name: "Garnier il Baluardo",
      title: "La Roccia d'Oltremare",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Giganti dei Pali",
      pedestal: "silver",
      shirtColor: "#475569",
      shortsColor: "#0f172a",
      hairColor: "#0f172a",
      skinColor: "#64748b",
      headType: "military",
      acc: "steel_gloves",
      quote: "«Nessun pallone varca questa linea senza il mio permesso.»",
      lore: "Guantoni d'acciaio lucido con palmi in caucciù antiscivolo. Pesa il doppio di un pupazzetto normale.",
      bonus: "+6% Parate sui tiri potenti",
      statKey: "def",
      statVal: 0.035
    },
    {
      id: "dario_muro",
      name: "Dario il Capitano Esule",
      title: "Recordman del Porto",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Leggende Moretti",
      pedestal: "silver",
      shirtColor: "#dc2626",
      shortsColor: "#ffffff",
      hairColor: "#172554",
      skinColor: "#f5caa0",
      headType: "bandana",
      acc: "bandana_red",
      quote: "«13 tiri al muro del porto. Batti il record e ne riparliamo.»",
      lore: "Bandana rossa legata dietro la nuca con lembi svolazzanti e maglia numero 9 della prima era.",
      bonus: "+4 Precisione rimbalzi al muro",
      statKey: "spd",
      statVal: 0.03
    },
    {
      id: "pietrino_fantasista",
      name: "Pietrino il Fantasista",
      title: "Il Re del Sombrero",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · I Ragazzini del Caruggio",
      pedestal: "silver",
      shirtColor: "#10b981",
      shortsColor: "#065f46",
      hairColor: "#451a03",
      skinColor: "#fcd34d",
      headType: "curly_cap",
      acc: "school_bag",
      quote: "«Prima faccio i compiti, poi faccio tunnel a tutto il quartiere!»",
      lore: "Statuina giocattolo con cartella scolastica di cuoio e pallone incollato al collo del piede.",
      bonus: "+3 Dribbling e agilità",
      statKey: "spd",
      statVal: 0.03
    },
    {
      id: "kevin_pedalo",
      name: "Kevin del Pedalò",
      title: "Il Razzer dello Scoglio",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · I Bagnini dello Scoglio",
      pedestal: "silver",
      shirtColor: "#0284c7",
      shortsColor: "#ff7a45",
      hairColor: "#eab308",
      skinColor: "#d97706",
      headType: "spiky_blond",
      acc: "yellow_pedalo",
      quote: "«Traino i pedalò sulla battigia: sulle fasce nessuno regge il mio passo!»",
      lore: "Piedi nudi con granelli di sabbia dorata incastonati e mini-pedalò rosso agganciato alla basetta.",
      bonus: "+4 Velocità di scatto sulle fasce",
      statKey: "spd",
      statVal: 0.035
    },
    {
      id: "saverio_cozza",
      name: "Saverio Cozza",
      title: "Lo Stopper di Pietra Lavica",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Gli Squali di Punta Nera",
      pedestal: "silver",
      shirtColor: "#0a3a4a",
      shortsColor: "#06222b",
      hairColor: "#18181b",
      skinColor: "#a16207",
      headType: "buzz_dark",
      acc: "rock_reef",
      quote: "«Entro in tackle anche sui tombini con grinta di scoglio!»",
      lore: "Plastica ultra-densa pesante con basetta intagliata a forma di scoglio aguzzo e cozze.",
      bonus: "+4 Contrasti rocciosi",
      statKey: "def",
      statVal: 0.035
    },
    {
      id: "mattia_saracinesca",
      name: "Mattia la Saracinesca",
      title: "Il Portierone dei Pulcini",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Le Nuove Leve",
      pedestal: "silver",
      shirtColor: "#ffd23f",
      shortsColor: "#333333",
      hairColor: "#3f220f",
      skinColor: "#fcd34d",
      headType: "cap_backwards",
      acc: "giant_gloves",
      quote: "«Mangio focaccia tra i pali, ma sui tiri non passa uno spillo!»",
      lore: "Include mini-trancio di focaccia rimovibile e guanti giganti arancioni con cuscinetti imbottiti.",
      bonus: "+5% Parate sui tiri ravvicinati",
      statKey: "def",
      statVal: 0.035
    },
    {
      id: "mirko_caruggi",
      name: "Mirko dei Caruggi",
      title: "Il Dribblatore della Superba",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Talenti di Genova",
      pedestal: "silver",
      shirtColor: "#8b5cf6",
      shortsColor: "#4c1d95",
      hairColor: "#171717",
      skinColor: "#fed7aa",
      headType: "coppola_hat",
      acc: "striped_scarf",
      quote: "«Nei caruggi stretti ho imparato a tirare a giro dove non c'è spazio.»",
      lore: "Indossa coppola ligure vintage in panno scuro e sciarpa di seta a righe amaranto.",
      bonus: "+3 Precisione tiri a giro",
      statKey: "spd",
      statVal: 0.03
    },
    {
      id: "ilario_lanterna",
      name: "Ilario il Marinaio del Faro",
      title: "Occhi sul Mare Aperto",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Uomini di Mare",
      pedestal: "silver",
      shirtColor: "#1e3a5f",
      shortsColor: "#0f172a",
      hairColor: "#9ca3af",
      skinColor: "#d97706",
      headType: "sailor_cap",
      acc: "binoculars",
      quote: "«Vedo partire il tiro prima ancora che tocchi il piede del centravanti.»",
      lore: "Impermeabile cerato giallo canarino con binocolo nautico d'ottone inciso a mano.",
      bonus: "+3 Lettura delle traiettorie avversarie",
      statKey: "def",
      statVal: 0.03
    },
    {
      id: "gigi_gabbiano",
      name: "Gigi & Il Gabbiano Complice",
      title: "Il Duo Imprevedibile",
      stars: 4,
      rarityName: "Raro",
      series: "Serie 2 · Personaggi dello Scoglio",
      pedestal: "silver",
      shirtColor: "#ff7a45",
      shortsColor: "#1d4ed8",
      hairColor: "#ffd23f",
      skinColor: "#fcd34d",
      headType: "bird_on_head",
      acc: "flag",
      quote: "«KRAAA! Abbiamo il vento e il gabbiano dalla nostra parte!»",
      lore: "Statuina con piccolo gabbiano in miniatura appollaiato sul cappello di Gigi mentre sventola la bandiera.",
      bonus: "+4 Disturbo sui portieri avversari",
      statKey: "spd",
      statVal: 0.03
    },

    // ==========================================
    // 5★ SUPER STAR (Basetta Oro Foil Lucido) - 11 Pupazzetti
    // ==========================================
    {
      id: "leo_rondine_gold",
      name: "Leo Moretti · Ali Spiegate",
      title: "Il Capitano della Rinascita",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Campioni Assoluti",
      pedestal: "gold",
      shirtColor: "#b3202c",
      shortsColor: "#ffffff",
      hairColor: "#1a1a1a",
      skinColor: "#f6caa0",
      headType: "flying_hair",
      acc: "wings_gold",
      quote: "«Il pallone vola se ci crediamo tutti insieme.»",
      lore: "Statuetta dorata con ali di rondine prismatiche trasparenti che riflettono la luce dello stadio.",
      bonus: "+5 a Tiro e Velocità in Calcio d'Azione",
      statKey: "spd",
      statVal: 0.05
    },
    {
      id: "nico_flying_cat",
      name: "Nico · Il Gatto Volante",
      title: "Il Tuffo Miracoloso",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Campioni Assoluti",
      pedestal: "gold",
      shirtColor: "#f97316",
      shortsColor: "#0f172a",
      hairColor: "#ea580c",
      skinColor: "#fed7aa",
      headType: "cat_ears",
      acc: "flying_gloves",
      quote: "«MIAO! Quella palla era all'incrocio, adesso è mia!»",
      lore: "Posa acrobatica orizzontale a mezz'aria sospesa su un perno trasparente. Orecchie da gatto magnetiche.",
      bonus: "+8% Parate spettacolari e riflessi felini",
      statKey: "def",
      statVal: 0.05
    },
    {
      id: "kenji_orient_wall",
      name: "Kenji Wakabayashi",
      title: "La Saracinesca d'Oriente",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Leggende dei Manga",
      pedestal: "gold",
      shirtColor: "#15803d",
      shortsColor: "#ffffff",
      hairColor: "#0f172a",
      skinColor: "#fde047",
      headType: "orient_cap",
      acc: "giant_gloves",
      quote: "«Nessun tiro da fuori area entrerà mai nella mia porta.»",
      lore: "Celebre cappellino bianco col visore rosso tirato sugli occhi. Resina pesante da collezione.",
      bonus: "+10% Resistenza ai tiri speciali",
      statKey: "def",
      statVal: 0.05
    },
    {
      id: "tsubasa_comet",
      name: "Tsubasa Ozora",
      title: "La Cometa del Drive Shot",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Leggende dei Manga",
      pedestal: "gold",
      shirtColor: "#ffffff",
      shortsColor: "#1d4ed8",
      hairColor: "#111827",
      skinColor: "#fde047",
      headType: "spiky_anime",
      acc: "drive_comet",
      quote: "«Il pallone è il mio migliore amico!»",
      lore: "Posa di tiro a mezz'aria con scia cometa celeste spiralata attorno alla gamba destra.",
      bonus: "+6 Potenza Tiro Speciale e parabole veloci",
      statKey: "spd",
      statVal: 0.05
    },
    {
      id: "jojo_arrow",
      name: "Jotaro Stand Kicker",
      title: "Lo Spirito Inarrestabile",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Eroi Straordinari",
      pedestal: "gold",
      shirtColor: "#312e81",
      shortsColor: "#1e1b4b",
      hairColor: "#030712",
      skinColor: "#fbcfe8",
      headType: "cap_hair_blend",
      acc: "stand_aura",
      quote: "«Yare yare daze... Il tuo tiro è prevedibile.»",
      lore: "Aura viola semitrasparente che fluttua dietro il pupazzetto con catena dorata sul colletto.",
      bonus: "+8 Grinta iniziale e contrasti titanici",
      statKey: "en",
      statVal: 0.012
    },
    {
      id: "crane_captain",
      name: "Capitano della Gru",
      title: "La Sentinella del Porto",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Giganti d'Acciaio",
      pedestal: "gold",
      shirtColor: "#ca8a04",
      shortsColor: "#713f12",
      hairColor: "#e5e7eb",
      skinColor: "#b45309",
      headType: "helmet_yellow",
      acc: "crane_hook",
      quote: "«Sollevo container da quaranta tonnellate. Una punizione non mi spaventa.»",
      lore: "Casco giallo da cantiere e gancio di gru in ottone massiccio. Basetta con finto asfalto bagnato.",
      bonus: "+5 Contrasto a terra e muri difensivi",
      statKey: "def",
      statVal: 0.05
    },
    {
      id: "sandro_riva_captain",
      name: "Sandro Riva il Capitano",
      title: "La Guida Indomita del Borgo",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Eroi del Borgo",
      pedestal: "gold",
      shirtColor: "#831843",
      shortsColor: "#ffffff",
      hairColor: "#18181b",
      skinColor: "#e0a97a",
      headType: "bearded_leader",
      acc: "captain_armband",
      quote: "«Finché un solo compagno corre, la partita non è finita.»",
      lore: "Fascia amaranto in rilievo con barbetta scolpita e sguardo fiero. Ispirato alla storica finale del 2006.",
      bonus: "+6 Grinta e carica a tutta la squadra",
      statKey: "en",
      statVal: 0.012
    },
    {
      id: "tina_rondinella",
      name: "Tina la Piccola Rondine",
      title: "La Mascotte Portafortuna",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · La Fortuna della Rondine",
      pedestal: "gold",
      shirtColor: "#38bdf8",
      shortsColor: "#ffffff",
      hairColor: "#451a03",
      skinColor: "#fcd34d",
      headType: "cute_ribbon",
      acc: "chibi_wings",
      quote: "«FORZA RONDINELLE! Ho disegnato un gol per voi!»",
      lore: "Mantellina azzurra con piccole ali piumate e fiocco di seta. Se scossa delicatamente diffonde glitter dorati.",
      bonus: "+2 Monete bonus per ogni vittoria e fortuna aumentata",
      statKey: "coin",
      statVal: 2
    },
    {
      id: "lupo_voltri",
      name: "Il Lupo di Voltri",
      title: "Il Predatore dell'Area di Rigore",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · I Rivali della Riviera",
      pedestal: "gold",
      shirtColor: "#18181b",
      shortsColor: "#09090b",
      hairColor: "#71717a",
      skinColor: "#d4d4d8",
      headType: "wolf_crest",
      acc: "silver_fangs",
      quote: "«Annuso il gol prima che il cross tocchi terra.»",
      lore: "Cresta argentata affilata e zanne stilizzate in metallo cromato. Tifosi e collezionisti ne vanno matti.",
      bonus: "+5 Potenza tiri di testa e stacco",
      statKey: "spd",
      statVal: 0.045
    },
    {
      id: "aldo_lanza_geometra",
      name: "Aldo Lanza il Geometra",
      title: "La Mente degli Anni '80",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Maestri della Tattica",
      pedestal: "gold",
      shirtColor: "#1e3a8a",
      shortsColor: "#ffffff",
      hairColor: "#52525b",
      skinColor: "#fed7aa",
      headType: "glasses_retro",
      acc: "golden_compass",
      quote: "«Il calcio è geometria applicata ai sentimenti.»",
      lore: "Occhiali tartarugati stile anni '80 con compasso dorato nella mano sinistra. Statuina da bacheca nobiliare.",
      bonus: "+5 Precisione passaggi lunghi e lanci",
      statKey: "spd",
      statVal: 0.045
    },
    {
      id: "rondinoid_3000",
      name: "Rondinoid 3000",
      title: "Il Mecha della Lega Galattica",
      stars: 5,
      rarityName: "Super Star",
      series: "Serie 3 · Multiverso Futurama",
      pedestal: "gold",
      shirtColor: "#0284c7",
      shortsColor: "#0369a1",
      hairColor: "#38bdf8",
      skinColor: "#94a3b8",
      headType: "mecha_visor",
      acc: "mecha_armor",
      quote: "«CALCOLO TRAIETTORIA: GOL AL 99.98% DI PROBABILITÀ.»",
      lore: "Finitura cromata specchiata con reattori sui tacchetti e visore LED azzurro fluorescente. Prodotto a Nuova New York.",
      bonus: "+20% Ricarica energia speciale in Calcio d'Azione",
      statKey: "en",
      statVal: 0.015
    },

    // ==========================================
    // 6★ LEGGENDE MITICHE (Basetta Arcobaleno Olografica) - 5 Pupazzetti
    // ==========================================
    {
      id: "enzo_1982",
      name: "Enzo Moretti 1982",
      title: "Il Trionfo di Madrid",
      stars: 6,
      rarityName: "Leggenda Mitica",
      series: "Serie 4 · Miti Indimenticabili",
      pedestal: "rainbow",
      shirtColor: "#1d4ed8",
      shortsColor: "#ffffff",
      hairColor: "#1c1917",
      skinColor: "#f5caa0",
      headType: "curly_80s",
      acc: "trophy_cup",
      quote: "«Campioni del Mondo! Questa coppa è per il Borgo e per chi ci aspetta al molo.»",
      lore: "Dettaglio maniacale con maglia azzurra cucita e coppa del mondo d'oro massiccio alzata al cielo col sorriso di papà.",
      bonus: "+10 a tutte le statistiche della squadra",
      statKey: "all",
      statVal: 0.06
    },
    {
      id: "nonna_panda_1968",
      name: "Nonna Ferri & Panda 30",
      title: "Il Rally dei Caruggi",
      stars: 6,
      rarityName: "Leggenda Mitica",
      series: "Serie 4 · Miti Indimenticabili",
      pedestal: "rainbow",
      shirtColor: "#b91c1c",
      shortsColor: "#7f1d1d",
      hairColor: "#e5e7eb",
      skinColor: "#fce7f3",
      headType: "glasses_grandma",
      acc: "mini_panda",
      quote: "«Frenare? Chi frena sui caruggi perde tempo e le lasagne si freddano!»",
      lore: "Diorama spettacolare con Nonna al volante e la leggendaria Panda 30 rossa che curva su due ruote!",
      bonus: "+15% Velocità di ripartenza in contropiede",
      statKey: "spd",
      statVal: 0.06
    },
    {
      id: "ines_countess_1970",
      name: "Contessa Ines Spinola",
      title: "La Mecenate della Riviera",
      stars: 6,
      rarityName: "Leggenda Mitica",
      series: "Serie 4 · Miti Indimenticabili",
      pedestal: "rainbow",
      shirtColor: "#581c87",
      shortsColor: "#3b0764",
      hairColor: "#e2e8f0",
      skinColor: "#fce7f3",
      headType: "noble_updo",
      acc: "diamond",
      quote: "«Il denaro compra i muri... Ma l'orgoglio del Borgo non è in vendita.»",
      lore: "Abito regale in velluto damascato e diadema di cristallo prismatico olografico che riflette l'arcobaleno.",
      bonus: "+25% Monete vinte in tutte le partite e sfide",
      statKey: "coin",
      statVal: 3
    },
    {
      id: "dario_leo_doppia_rondine",
      name: "Fratelli Moretti · Doppia Rondine",
      title: "La Rovesciata Sincronizzata",
      stars: 6,
      rarityName: "Leggenda Mitica",
      series: "Serie 4 · Miti Indimenticabili",
      pedestal: "rainbow",
      shirtColor: "#b3202c",
      shortsColor: "#ffffff",
      hairColor: "#172554",
      skinColor: "#f5caa0",
      headType: "double_pose",
      acc: "fire_ball",
      quote: "«UNO, DUE... VOLA RONDINE! Il colpo che spacca la rete!»",
      lore: "Il capolavoro supremo del distributore: Leo e Dario colti nell'istante esatto della rovesciata doppia sincronizzata con pallone infuocato a mezz'aria.",
      bonus: "+8 Velocità, +8 Tiro e +15% Furia della Rondine",
      statKey: "all",
      statVal: 0.07
    },
    {
      id: "hero_custom_gold",
      name: "Il Tuo Campione d'Oro",
      title: "La Nuova Leggenda Consacrata",
      stars: 6,
      rarityName: "Leggenda Mitica",
      series: "Serie 4 · Il Tuo Destino",
      pedestal: "rainbow",
      shirtColor: "#ffd23f",
      shortsColor: "#ffffff",
      hairColor: "#2a1810",
      skinColor: "#f3cb9e",
      headType: "classic_curly",
      acc: "trophy_cup",
      quote: "«Il calcio della Riviera ha un nuovo eroe.»",
      lore: "Miniatura celebrativa intarsiata d'oro massiccio e platino prismatico che riflette fedelmente il tuo campione creato!",
      bonus: "+10 a tutte le statistiche e carisma leggendario",
      statKey: "all",
      statVal: 0.08
    }
  ];

  function resolveToy(t) {
    if (!t) return t;
    if (t.id === "hero_custom_gold") {
      try {
        const h = typeof window.heroLoad === "function" ? window.heroLoad() : JSON.parse(localStorage.getItem("ali-di-rondine.eroe") || "null");
        if (h && h.name) {
          return {
            ...t,
            name: `${h.name} #${h.num}`,
            title: `Tiro: ${h.shotName || "Fulmine del Golfo"}`,
            shirtColor: h.shirt || "#ffd23f",
            hairColor: h.hair || "#2a1810",
            skinColor: h.skin || "#f3cb9e",
            quote: `«La maglia numero ${h.num} non si toglie mai.»`
          };
        }
      } catch (e) {}
    }
    return t;
  }

  // --- STATO E PERSISTENZA ---
  function getGachaData() {
    try {
      const raw = localStorage.getItem(K_DATA);
      if (raw) {
        const d = JSON.parse(raw);
        if (d && d.owned) {
          d.upgraded = d.upgraded || {};
          return d;
        }
      }
    } catch (e) {}
    // Starter: regala 1 pupazzetto per cominciare
    const init = {
      owned: { ragazzino_molo: 1 },
      shards: 15,
      pullCount: 1,
      pity: 1,
      upgraded: {},
      goldenTicket: false
    };
    saveGachaData(init);
    return init;
  }

  function saveGachaData(d) {
    try {
      localStorage.setItem(K_DATA, JSON.stringify(d));
    } catch (e) {}
  }

  // Calcolo del bonus cumulativo di tutti i pupazzetti per Calcio d'Azione
  window.getGachaToyBonus = function () {
    try {
      const data = getGachaData();
      const b = { spd: 0, def: 0, coin: 0, en: 0 };
      TOY_CATALOG.forEach(t => {
        if (data.owned[t.id]) {
          const isUpgraded = !!(data.upgraded && data.upgraded[t.id]);
          const mult = isUpgraded ? 2.0 : 1.0;
          const val = (t.statVal || 0) * mult;
          if (t.statKey === "spd") b.spd += val;
          else if (t.statKey === "def") b.def += val;
          else if (t.statKey === "coin") b.coin += Math.round(val);
          else if (t.statKey === "en") b.en += val;
          else if (t.statKey === "all") {
            b.spd += val * 0.5;
            b.def += val * 0.5;
            b.en += val * 0.1;
            b.coin += Math.round(val * 20);
          }
        }
      });
      // Cap bilanciati per non rompere il gioco
      b.spd = Math.min(0.25, b.spd);
      b.def = Math.min(0.25, b.def);
      b.coin = Math.min(10, b.coin);
      b.en = Math.min(0.04, b.en);
      return b;
    } catch (e) {
      return { spd: 0, def: 0, coin: 0, en: 0 };
    }
  };

  // Helper monete del gioco
  function getUserCoins() {
    try {
      if (typeof window.bCoins === "function") return window.bCoins();
      if (typeof window.coins === "function") return window.coins();
      const rawBorgo = localStorage.getItem("ali-di-rondine.borgo");
      if (rawBorgo) {
        const b = JSON.parse(rawBorgo);
        if (b && typeof b.coins === "number") return b.coins;
      }
      const raw = localStorage.getItem("ali-di-rondine.monete");
      if (raw) return parseInt(raw, 10) || 0;
    } catch (e) {}
    return 0;
  }

  function deductUserCoins(amount) {
    try {
      let deducted = false;
      if (typeof window.addCoins === "function") {
        window.addCoins(-amount);
        deducted = true;
      }
      const rawBorgo = localStorage.getItem("ali-di-rondine.borgo");
      if (rawBorgo) {
        const b = JSON.parse(rawBorgo);
        if (b && typeof b.coins === "number") {
          b.coins = Math.max(0, b.coins - amount);
          localStorage.setItem("ali-di-rondine.borgo", JSON.stringify(b));
          deducted = true;
        }
      }
      const raw = localStorage.getItem("ali-di-rondine.monete");
      if (raw) {
        const cur = parseInt(raw, 10) || 0;
        localStorage.setItem("ali-di-rondine.monete", Math.max(0, cur - amount));
      }
      return deducted;
    } catch (e) {
      return false;
    }
  }

  function addUserCoins(amount) {
    try {
      if (typeof window.addCoins === "function") {
        window.addCoins(amount);
      }
      const rawBorgo = localStorage.getItem("ali-di-rondine.borgo");
      if (rawBorgo) {
        const b = JSON.parse(rawBorgo);
        if (b && typeof b.coins === "number") {
          b.coins += amount;
          localStorage.setItem("ali-di-rondine.borgo", JSON.stringify(b));
        }
      }
    } catch (e) {}
  }

  // --- LOGICA DI PESCATA (RNG & PITY) ---
  function pullSingleToy(data) {
    data.pullCount = (data.pullCount || 0) + 1;
    data.pity = (data.pity || 0) + 1;

    let targetStar = 3;
    const r = Math.random() * 100;

    // Se è attivo un Biglietto Dorato forgiato nella fonderia
    if (data.goldenTicket) {
      targetStar = Math.random() < 0.35 ? 6 : 5;
      data.goldenTicket = false;
      data.pity = 0;
    }
    // Hard Pity a 30 tiri per 5★ o 6★ garantito!
    else if (data.pity >= 30) {
      targetStar = Math.random() < 0.25 ? 6 : 5;
      data.pity = 0;
    } else if (r < 1.5) {
      targetStar = 6; // 1.5% Leggenda Mitica
      data.pity = 0;
    } else if (r < 10.0) {
      targetStar = 5; // 8.5% Super Star
      data.pity = 0;
    } else if (r < 35.0) {
      targetStar = 4; // 25% Raro
    } else {
      targetStar = 3; // 65% Comune
    }

    const pool = TOY_CATALOG.filter((t) => t.stars === targetStar);
    const chosen = pool[Math.floor(Math.random() * pool.length)] || TOY_CATALOG[0];

    const isDuplicate = !!(data.owned[chosen.id]);
    data.owned[chosen.id] = (data.owned[chosen.id] || 0) + 1;

    // Ricompensa doppioni in Frammenti di Plastica Pregiata
    let shardReward = 0;
    if (isDuplicate) {
      shardReward = chosen.stars === 3 ? 5 : chosen.stars === 4 ? 15 : chosen.stars === 5 ? 50 : 150;
      data.shards = (data.shards || 0) + shardReward;
    }

    saveGachaData(data);
    return { toy: chosen, isDuplicate, shardReward };
  }

  // --- RENDERING 3D DEL PUPAZZETTO (THREE.JS) ---
  let threeRenderer = null, threeScene = null, threeCamera = null, threeAnimId = null;
  let toyMeshGroup = null;

  function initThreeForToy(container) {
    if (!window.THREE) return false;
    if (threeAnimId) cancelAnimationFrame(threeAnimId);
    while (container.firstChild) container.removeChild(container.firstChild);

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 300;

    threeScene = new window.THREE.Scene();
    threeCamera = new window.THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    threeCamera.position.set(0, 1.4, 4.2);
    threeCamera.lookAt(0, 1.15, 0);

    threeRenderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeRenderer.toneMapping = window.THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.25;
    container.appendChild(threeRenderer.domElement);

    // Luci da studio fotografico per pupazzetti
    const amb = new window.THREE.AmbientLight(0xffffff, 0.95);
    threeScene.add(amb);

    const dir1 = new window.THREE.DirectionalLight(0xfff5e6, 2.0);
    dir1.position.set(3, 5, 4);
    threeScene.add(dir1);

    const dir2 = new window.THREE.DirectionalLight(0x70a5ff, 1.3);
    dir2.position.set(-4, 3, -2);
    threeScene.add(dir2);

    const rim = new window.THREE.DirectionalLight(0xffd23f, 1.6);
    rim.position.set(0, 4, -3);
    threeScene.add(rim);

    // Controlli rotazione interattiva
    let isDragging = false, prevX = 0;
    const onStart = (clientX) => { isDragging = true; prevX = clientX; };
    const onMove = (clientX) => {
      if (!isDragging || !toyMeshGroup) return;
      const delta = clientX - prevX;
      prevX = clientX;
      toyMeshGroup.rotation.y += delta * 0.015;
    };
    const onEnd = () => { isDragging = false; };

    container.addEventListener("mousedown", (e) => onStart(e.clientX));
    window.addEventListener("mousemove", (e) => onMove(e.clientX));
    window.addEventListener("mouseup", onEnd);

    container.addEventListener("touchstart", (e) => { if (e.touches[0]) onStart(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchmove", (e) => { if (e.touches[0]) onMove(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchend", onEnd);

    return true;
  }

  function build3DToyMesh(rawToy) {
    if (!threeScene || !window.THREE) return;
    const toy = resolveToy(rawToy);
    if (toyMeshGroup) threeScene.remove(toyMeshGroup);

    const data = getGachaData();
    const isUpgraded = !!(data.upgraded && data.upgraded[toy.id]);

    const T = window.THREE;
    toyMeshGroup = new T.Group();

    // 1. Basetta Esagonale da Pupazzetto Giocattolo
    let baseCol = 0x8a5a36; // bronzo
    let roughness = 0.5;
    let metalness = 0.6;
    if (toy.pedestal === "silver") { baseCol = 0xd0d5dd; metalness = 0.9; roughness = 0.2; }
    else if (toy.pedestal === "gold") { baseCol = 0xffd23f; metalness = 0.95; roughness = 0.15; }
    else if (toy.pedestal === "rainbow") { baseCol = 0xff70a6; metalness = 0.85; roughness = 0.1; }

    if (isUpgraded) {
      baseCol = 0x67e8f9; // bagliore ciano cromato per statuine potenziate
      metalness = 0.98;
      roughness = 0.08;
    }

    const baseGeo = new T.CylinderGeometry(0.88, 0.98, 0.22, 8);
    const baseMat = new T.MeshStandardMaterial({
      color: baseCol,
      metalness,
      roughness,
      flatShading: true
    });
    const baseMesh = new T.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.11;
    toyMeshGroup.add(baseMesh);

    // Anello dorato inciso sulla basetta
    const ringGeo = new T.TorusGeometry(0.9, 0.03, 8, 24);
    const ringMat = new T.MeshStandardMaterial({ color: isUpgraded ? 0x38bdf8 : 0xffe277, metalness: 0.95, roughness: 0.15 });
    const ringMesh = new T.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.22;
    toyMeshGroup.add(ringMesh);

    // -------------------------------------------------------------
    // CASO SPECIALE: GABBIANO MASCOTTE (Gabbiano 3D completo)
    // -------------------------------------------------------------
    if (toy.id === "gabbiano_mascotte" || toy.headType === "beak") {
      const birdMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const greyMat = new T.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
      const yellowBeakMat = new T.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2 });
      const orangeLegMat = new T.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
      const eyeMat = new T.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

      const legGeo = new T.CylinderGeometry(0.04, 0.04, 0.45, 6);
      const legL = new T.Mesh(legGeo, orangeLegMat); legL.position.set(-0.16, 0.38, 0);
      const legR = new T.Mesh(legGeo, orangeLegMat); legR.position.set(0.16, 0.38, 0);
      toyMeshGroup.add(legL, legR);

      const bodyGeo = new T.SphereGeometry(0.42, 14, 14);
      bodyGeo.scale(0.85, 0.95, 1.25);
      const bodyMesh = new T.Mesh(bodyGeo, birdMat);
      bodyMesh.position.set(0, 0.85, 0);
      toyMeshGroup.add(bodyMesh);

      const headGeo = new T.SphereGeometry(0.32, 14, 14);
      const headMesh = new T.Mesh(headGeo, birdMat);
      headMesh.position.set(0, 1.35, 0.25);
      toyMeshGroup.add(headMesh);

      const beakGeo = new T.ConeGeometry(0.12, 0.45, 8);
      const beakMesh = new T.Mesh(beakGeo, yellowBeakMat);
      beakMesh.rotation.x = Math.PI / 2;
      beakMesh.position.set(0, 1.32, 0.65);
      toyMeshGroup.add(beakMesh);

      const focacciaGeo = new T.BoxGeometry(0.32, 0.05, 0.2);
      const focacciaMat = new T.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
      const focacciaMesh = new T.Mesh(focacciaGeo, focacciaMat);
      focacciaMesh.position.set(0, 1.3, 0.82);
      toyMeshGroup.add(focacciaMesh);

      threeScene.add(toyMeshGroup);
      startToyAnimation();
      return;
    }

    // -------------------------------------------------------------
    // MODELLI UMANI & SAGHE SPECIALI
    // -------------------------------------------------------------
    const isPriest = toy.id.includes("aurelio") || toy.headType === "bald";
    const isFisherman = toy.id.includes("baciccia") || toy.id.includes("pescivendolo");
    const isGrandma = toy.id.includes("rita") || toy.id.includes("nonna") || toy.headType === "glasses_grandma" || toy.headType === "bun";
    const isNico = toy.id.includes("nico");
    const isTommy = toy.id.includes("tommy");
    const isSara = toy.id.includes("sara");
    const isTonino = toy.id.includes("tonino");
    const isEnzo = toy.id.includes("enzo");
    const isCountess = toy.id.includes("ines") || toy.headType === "noble_updo";
    const isLeo = toy.id.includes("leo");
    const isTsubasa = toy.id.includes("tsubasa");
    const isDario = toy.id.includes("dario");

    // Calzature
    let bootCol = 0x111111;
    if (isFisherman) bootCol = 0xca8a04;
    else if (toy.acc === "gold_boots" || toy.stars === 6) bootCol = 0xffd23f;
    else if (toy.shirtColor === "#1d3fa3" || isTsubasa) bootCol = 0xffffff;

    const bootGeo = new T.BoxGeometry(0.18, 0.14, 0.34);
    const bootMat = new T.MeshStandardMaterial({
      color: bootCol,
      metalness: (toy.acc === "gold_boots" || toy.stars === 6) ? 0.8 : 0.1,
      roughness: 0.4
    });
    const bL = new T.Mesh(bootGeo, bootMat); bL.position.set(-0.25, 0.28, 0.05);
    const bR = new T.Mesh(bootGeo, bootMat); bR.position.set(0.25, 0.28, 0.05);
    toyMeshGroup.add(bL, bR);

    // Gambe / Pantaloncini
    if (!isPriest && !isCountess) {
      const sockCol = isFisherman ? 0x1e293b : (toy.id.includes("nico") ? 0x0f172a : 0xffffff);
      const legGeo = new T.CylinderGeometry(0.08, 0.08, 0.3, 8);
      const legMat = new T.MeshStandardMaterial({ color: sockCol, roughness: 0.6 });
      const lmL = new T.Mesh(legGeo, legMat); lmL.position.set(-0.25, 0.48, 0);
      const lmR = new T.Mesh(legGeo, legMat); lmR.position.set(0.25, 0.48, 0);
      toyMeshGroup.add(lmL, lmR);

      const shortsGeo = new T.CylinderGeometry(0.33, 0.29, 0.28, 12);
      const shortsMat = new T.MeshStandardMaterial({ color: parseInt(toy.shortsColor.replace("#", "0x")), roughness: 0.5 });
      const shortsMesh = new T.Mesh(shortsGeo, shortsMat);
      shortsMesh.position.y = 0.72;
      toyMeshGroup.add(shortsMesh);
    } else {
      const robeCol = isPriest ? 0x111116 : 0x581c87;
      const robeGeo = new T.CylinderGeometry(0.34, 0.52, 0.9, 16);
      const robeMat = new T.MeshStandardMaterial({ color: robeCol, roughness: 0.7 });
      const robeMesh = new T.Mesh(robeGeo, robeMat);
      robeMesh.position.y = 0.78;
      toyMeshGroup.add(robeMesh);
    }

    // Torso / Maglietta
    const torsoGeo = new T.CylinderGeometry(0.36, 0.32, 0.46, 12);
    const shirtColorNum = parseInt(toy.shirtColor.replace("#", "0x"));
    const shirtMat = new T.MeshStandardMaterial({ color: shirtColorNum, roughness: 0.4 });
    const torsoMesh = new T.Mesh(torsoGeo, shirtMat);
    torsoMesh.position.y = 1.05;
    toyMeshGroup.add(torsoMesh);

    // Braccia
    const armGeo = new T.CylinderGeometry(0.07, 0.07, 0.38, 8);
    const armMat = new T.MeshStandardMaterial({ color: shirtColorNum, roughness: 0.5 });
    const armL = new T.Mesh(armGeo, armMat);
    const armR = new T.Mesh(armGeo, armMat);
    armL.position.set(-0.46, 1.02, 0); armL.rotation.z = 0.35;
    armR.position.set(0.46, 1.02, 0); armR.rotation.z = -0.35;
    toyMeshGroup.add(armL, armR);

    // Mani o Guantoni
    const skinNum = parseInt(toy.skinColor.replace("#", "0x"));
    const handGeo = isNico || toy.acc === "giant_gloves" ? new T.BoxGeometry(0.22, 0.22, 0.15) : new T.SphereGeometry(0.1, 8, 8);
    const handMat = new T.MeshStandardMaterial({
      color: (isNico || toy.acc === "giant_gloves") ? 0xf59e0b : skinNum,
      roughness: 0.4
    });
    const hL = new T.Mesh(handGeo, handMat);
    const hR = new T.Mesh(handGeo, handMat);
    hL.position.set(-0.55, 0.85, 0);
    hR.position.set(0.55, 0.85, 0);
    toyMeshGroup.add(hL, hR);

    // Testa
    const headGeo = new T.SphereGeometry(0.44, 16, 16);
    const headMat = new T.MeshStandardMaterial({ color: skinNum, roughness: 0.45 });
    const headMesh = new T.Mesh(headGeo, headMat);
    headMesh.position.y = 1.55;
    toyMeshGroup.add(headMesh);

    // Occhi
    const eyeGeo = new T.SphereGeometry(0.06, 8, 8);
    const eyeMat = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const eyeL = new T.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.16, 1.56, 0.4);
    const eyeR = new T.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.16, 1.56, 0.4);
    toyMeshGroup.add(eyeL, eyeR);

    // Capelli / Copricapi
    const hairColorNum = parseInt(toy.hairColor.replace("#", "0x"));
    const hairMat = new T.MeshStandardMaterial({ color: hairColorNum, roughness: 0.7 });
    const hairGeo = new T.SphereGeometry(0.48, 14, 14);
    const hairMesh = new T.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 1.65, -0.05);
    toyMeshGroup.add(hairMesh);

    // Accessorio speciale ai piedi o in mano
    if (toy.acc === "trophy_cup" || isEnzo) {
      const cupMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.95, roughness: 0.1 });
      const cupBody = new T.CylinderGeometry(0.28, 0.14, 0.45, 14);
      const cupMesh = new T.Mesh(cupBody, cupMat);
      cupMesh.position.set(0.55, 1.15, 0.28);
      toyMeshGroup.add(cupMesh);
    } else if (toy.acc === "icecream") {
      const coneGeo = new T.ConeGeometry(0.1, 0.35, 8);
      const coneMat = new T.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const coneMesh = new T.Mesh(coneGeo, coneMat);
      coneMesh.rotation.x = Math.PI;
      coneMesh.position.set(0.65, 0.9, 0.25);
      toyMeshGroup.add(coneMesh);
    } else if (toy.acc === "mini_panda") {
      const pandaBody = new T.BoxGeometry(0.48, 0.22, 0.3);
      const pandaMat = new T.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
      const pM = new T.Mesh(pandaBody, pandaMat);
      pM.position.set(0.5, 0.25, 0.25);
      toyMeshGroup.add(pM);
    } else {
      // Pallone classico da collezione
      const ballGeo = new T.SphereGeometry(0.24, 12, 12);
      const ballMat = new T.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.25 });
      const ballMesh = new T.Mesh(ballGeo, ballMat);
      ballMesh.position.set(0.52, 0.34, 0.28);
      toyMeshGroup.add(ballMesh);
    }

    threeScene.add(toyMeshGroup);
    startToyAnimation();
  }

  function startToyAnimation() {
    if (threeAnimId) cancelAnimationFrame(threeAnimId);
    let t = 0;
    function animate() {
      threeAnimId = requestAnimationFrame(animate);
      t += 0.015;
      if (toyMeshGroup) {
        toyMeshGroup.rotation.y += 0.008;
        toyMeshGroup.position.y = Math.sin(t) * 0.04;
      }
      if (threeRenderer && threeScene && threeCamera) {
        threeRenderer.render(threeScene, threeCamera);
      }
    }
    animate();
  }

  // --- MODALE FONDERIA DEI FRAMMENTI (SHARD FOUNDRY) ---
  let foundryModalEl = null;

  function openGachaFoundryModal(onClose) {
    if (!foundryModalEl) {
      foundryModalEl = document.createElement("div");
      foundryModalEl.id = "gachaFoundryModal";
      foundryModalEl.style.cssText = `
        position: fixed; inset: 0; z-index: 1000008;
        background: radial-gradient(circle at center, #1b263b 0%, #0d131f 100%);
        display: none; flex-direction: column; align-items: center; justify-content: space-between;
        padding: 14px; box-sizing: border-box; font-family: var(--body, system-ui, sans-serif); color: #fff;
        overflow-y: auto; user-select: none;
      `;
      document.body.appendChild(foundryModalEl);
    }

    let activeTab = "craft"; // "craft", "forge", "upgrade"

    function renderFoundry() {
      const data = getGachaData();
      const userCoins = getUserCoins();
      const missingToys = TOY_CATALOG.filter(t => !data.owned[t.id]);
      const ownedToys = TOY_CATALOG.filter(t => !!data.owned[t.id]);

      foundryModalEl.style.display = "flex";
      foundryModalEl.innerHTML = `
        <!-- Header Fonderia -->
        <div style="width: 100%; max-width: 520px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid rgba(255,255,255,0.15); padding-bottom: 8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:26px;">🧩</span>
            <div>
              <div style="font-size:16px; font-weight:900; color:#57d68d; letter-spacing:0.5px;">FONDERIA & BANCO SCAMBI DEI FRAMMENTI</div>
              <div style="font-size:11px; color:#9cb5db;">Trasforma i doppioni in pezzi mancanti, monete e potenziamenti ★+</div>
            </div>
          </div>
          <button type="button" id="foundryCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:6px 12px; font-size:12px; font-weight:bold; cursor:pointer;">✕ Chiudi</button>
        </div>

        <!-- Barra Risorse -->
        <div style="width: 100%; max-width: 520px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.45); border-radius: 8px; padding: 8px 14px; margin: 8px 0; font-size: 13px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span>🧩 Frammenti Disponibili:</span>
            <b id="fShards" style="color:#57d68d; font-size:16px;">${data.shards || 0}</b>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span>🪙 Monete:</span>
            <b id="fCoins" style="color:#ffd23f; font-size:14px;">${userCoins}</b>
          </div>
        </div>

        <!-- Selettore Schede -->
        <div style="width: 100%; max-width: 520px; display: flex; gap: 6px; margin-bottom: 8px;">
          <button type="button" id="fTabCraft" style="flex:1; padding:8px 4px; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer; background:${activeTab === "craft" ? "#2563eb" : "#1e293b"}; color:#fff; border:1px solid ${activeTab === "craft" ? "#60a5fa" : "#334155"};">
            🔨 Scolpisci Mancanti (${missingToys.length})
          </button>
          <button type="button" id="fTabForge" style="flex:1; padding:8px 4px; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer; background:${activeTab === "forge" ? "#d97706" : "#1e293b"}; color:#fff; border:1px solid ${activeTab === "forge" ? "#fbbf24" : "#334155"};">
            🪙 Forgia Monete
          </button>
          <button type="button" id="fTabUpgrade" style="flex:1; padding:8px 4px; border-radius:6px; font-size:12px; font-weight:bold; cursor:pointer; background:${activeTab === "upgrade" ? "#7c3aed" : "#1e293b"}; color:#fff; border:1px solid ${activeTab === "upgrade" ? "#a78bfa" : "#334155"};">
            ✨ Potenzia ★+ (${ownedToys.length})
          </button>
        </div>

        <!-- Contenuto Scheda Attiva -->
        <div style="width: 100%; max-width: 520px; flex: 1; overflow-y: auto; padding: 4px;">
          ${activeTab === "craft" ? `
            <div style="font-size:12px; color:#94a3b8; margin-bottom:8px;">
              Usa i frammenti dei doppioni per creare direttamente i pupazzetti che ancora non hai trovato nel distributore!
            </div>
            ${missingToys.length === 0 ? `
              <div style="text-align:center; padding:30px; color:#4ade80; font-weight:bold;">
                🎉 CONGRATULAZIONI! Hai collezionato tutti i 40 pupazzetti del catalogo!
              </div>
            ` : `
              <div style="display:flex; flex-direction:column; gap:8px;">
                ${missingToys.map(toy => {
                  const cost = toy.stars === 3 ? 25 : toy.stars === 4 ? 60 : toy.stars === 5 ? 150 : 300;
                  const canAfford = (data.shards || 0) >= cost;
                  const starColor = toy.stars === 6 ? "#ff70a6" : toy.stars === 5 ? "#ffd23f" : toy.stars === 4 ? "#60a5fa" : "#cd7f32";
                  return `
                    <div style="background:rgba(30,41,59,0.7); border:1.5px solid ${starColor}66; border-radius:10px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <div style="font-size:11px; color:${starColor}; font-weight:bold;">${"★".repeat(toy.stars)} ${toy.rarityName.toUpperCase()}</div>
                        <div style="font-size:14px; font-weight:bold; color:#fff;">${toy.name}</div>
                        <div style="font-size:11px; color:#cbd5e1;">${toy.title} · <span style="color:#4ade80;">${toy.bonus}</span></div>
                      </div>
                      <button type="button" class="btn-craft-toy" data-id="${toy.id}" data-cost="${cost}" style="background:${canAfford ? "#16a34a" : "#334155"}; color:#fff; border:1px solid ${canAfford ? "#4ade80" : "#475569"}; border-radius:6px; padding:8px 12px; font-size:12px; font-weight:bold; cursor:${canAfford ? "pointer" : "not-allowed"}; opacity:${canAfford ? "1" : "0.6"};">
                        Scolpisci (🧩 ${cost})
                      </button>
                    </div>
                  `;
                }).join("")}
              </div>
            `}
          ` : activeTab === "forge" ? `
            <div style="font-size:12px; color:#94a3b8; margin-bottom:12px;">
              Fondi i frammenti in eccesso per ottenere monete o il leggendario <b>Biglietto Dorato</b> che garantisce una Super Star o Leggenda al prossimo tiro!
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div style="background:rgba(30,41,59,0.7); border:1.5px solid #fbbf2466; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:bold; font-size:14px; color:#ffd23f;">Borsa di Monete Piccola (🪙 40)</div>
                  <div style="font-size:11px; color:#cbd5e1;">Fondi 20 frammenti per un po' di spiccioli immediati al Bar</div>
                </div>
                <button type="button" class="btn-forge-action" data-type="coins20" style="background:#d97706; color:#fff; border:1px solid #fbbf24; border-radius:6px; padding:8px 12px; font-size:12px; font-weight:bold; cursor:pointer;">
                  Fondi (🧩 20)
                </button>
              </div>

              <div style="background:rgba(30,41,59,0.7); border:1.5px solid #fbbf2488; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:bold; font-size:14px; color:#ffd23f;">Forziere di Monete Grande (🪙 120)</div>
                  <div style="font-size:11px; color:#cbd5e1;">Fondi 50 frammenti per quasi un'intera multi-pescata 10x!</div>
                </div>
                <button type="button" class="btn-forge-action" data-type="coins50" style="background:#b45309; color:#fff; border:1px solid #fbbf24; border-radius:6px; padding:8px 12px; font-size:12px; font-weight:bold; cursor:pointer;">
                  Fondi (🧩 50)
                </button>
              </div>

              <div style="background:rgba(88,28,135,0.4); border:1.5px solid #c084fc; border-radius:10px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:bold; font-size:14px; color:#f0abfc;">🎟️ Biglietto Dorato del Barista</div>
                  <div style="font-size:11px; color:#cbd5e1;">La prossima singola pescata conterrà al 100% un pupazzetto 5★ o 6★!</div>
                  <div style="font-size:10px; color:#a855f7; margin-top:2px;">${data.goldenTicket ? "✨ Già attivo per la prossima pescata!" : "Non attivo"}</div>
                </div>
                <button type="button" class="btn-forge-action" data-type="ticket" style="background:${data.goldenTicket ? "#475569" : "#9333ea"}; color:#fff; border:1px solid #c084fc; border-radius:6px; padding:8px 12px; font-size:12px; font-weight:bold; cursor:${data.goldenTicket ? "not-allowed" : "pointer"};" ${data.goldenTicket ? "disabled" : ""}>
                  Forgia (🧩 100)
                </button>
              </div>
            </div>
          ` : `
            <div style="font-size:12px; color:#94a3b8; margin-bottom:8px;">
              Applica la <b>Lucidatura a Specchio (★+)</b> alle miniature già possedute (30 frammenti): la basetta diventa cromata lucida e il bonus di gioco viene <b>raddoppiato</b>!
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${ownedToys.map(toy => {
                const isUp = !!(data.upgraded && data.upgraded[toy.id]);
                const canAfford = (data.shards || 0) >= 30;
                const starColor = toy.stars === 6 ? "#ff70a6" : toy.stars === 5 ? "#ffd23f" : toy.stars === 4 ? "#60a5fa" : "#cd7f32";
                return `
                  <div style="background:rgba(30,41,59,0.7); border:1.5px solid ${isUp ? "#38bdf8" : starColor + "66"}; border-radius:10px; padding:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <div style="font-size:11px; color:${starColor}; font-weight:bold;">
                        ${"★".repeat(toy.stars)}${isUp ? " <span style='color:#38bdf8; font-weight:900;'>[★+ POTENZIATO]</span>" : ""}
                      </div>
                      <div style="font-size:14px; font-weight:bold; color:#fff;">${toy.name}</div>
                      <div style="font-size:11px; color:#cbd5e1;">Effetto: <span style="color:#4ade80;">${toy.bonus} ${isUp ? "(x2 ATTIVO!)" : ""}</span></div>
                    </div>
                    ${isUp ? `
                      <span style="font-size:11px; color:#38bdf8; font-weight:bold; background:rgba(56,189,248,0.2); border:1px solid #38bdf8; border-radius:6px; padding:4px 8px;">
                        MASSIMO ✓
                      </span>
                    ` : `
                      <button type="button" class="btn-upgrade-toy" data-id="${toy.id}" style="background:${canAfford ? "#7c3aed" : "#334155"}; color:#fff; border:1px solid ${canAfford ? "#a78bfa" : "#475569"}; border-radius:6px; padding:8px 12px; font-size:12px; font-weight:bold; cursor:${canAfford ? "pointer" : "not-allowed"}; opacity:${canAfford ? "1" : "0.6"};">
                        Potenzia (🧩 30)
                      </button>
                    `}
                  </div>
                `;
              }).join("")}
            </div>
          `}
        </div>
      `;

      // Eventi Schede
      foundryModalEl.querySelector("#foundryCloseBtn").onclick = () => {
        foundryModalEl.style.display = "none";
        updateHeaderCounters();
        if (typeof onClose === "function") onClose();
      };

      foundryModalEl.querySelector("#fTabCraft").onclick = () => { activeTab = "craft"; renderFoundry(); };
      foundryModalEl.querySelector("#fTabForge").onclick = () => { activeTab = "forge"; renderFoundry(); };
      foundryModalEl.querySelector("#fTabUpgrade").onclick = () => { activeTab = "upgrade"; renderFoundry(); };

      // Azioni Scolpisci
      foundryModalEl.querySelectorAll(".btn-craft-toy").forEach(b => {
        b.onclick = () => {
          const id = b.getAttribute("data-id");
          const cost = parseInt(b.getAttribute("data-cost"), 10) || 25;
          const d = getGachaData();
          if ((d.shards || 0) < cost) {
            if (window.toast) window.toast(`Frammenti insufficienti! Ne hai ${d.shards || 0}, ne servono ${cost}.`, "warn", "🧩");
            return;
          }
          d.shards -= cost;
          d.owned[id] = 1;
          saveGachaData(d);
          const toy = resolveToy(TOY_CATALOG.find(t => t.id === id));
          if (window.toast) window.toast(`Statuina scolpita con successo: ${toy.name}!`, "success", "✨");
          try { if (window.sfx) window.sfx("goal"); } catch (e) {}
          renderFoundry();
          updateHeaderCounters();
        };
      });

      // Azioni Forgia Monete
      foundryModalEl.querySelectorAll(".btn-forge-action").forEach(b => {
        b.onclick = () => {
          const type = b.getAttribute("data-type");
          const d = getGachaData();
          if (type === "coins20") {
            if ((d.shards || 0) < 20) {
              if (window.toast) window.toast("Servono 20 frammenti per questa forgiatura!", "warn", "🧩");
              return;
            }
            d.shards -= 20;
            saveGachaData(d);
            addUserCoins(40);
            if (window.toast) window.toast("+40 Monete d'oro forgiate!", "success", "🪙");
          } else if (type === "coins50") {
            if ((d.shards || 0) < 50) {
              if (window.toast) window.toast("Servono 50 frammenti per questa forgiatura!", "warn", "🧩");
              return;
            }
            d.shards -= 50;
            saveGachaData(d);
            addUserCoins(120);
            if (window.toast) window.toast("+120 Monete d'oro forgiate!", "success", "🪙");
          } else if (type === "ticket") {
            if ((d.shards || 0) < 100) {
              if (window.toast) window.toast("Servono 100 frammenti per il Biglietto Dorato!", "warn", "🧩");
              return;
            }
            d.shards -= 100;
            d.goldenTicket = true;
            saveGachaData(d);
            if (window.toast) window.toast("🎟️ Biglietto Dorato forgiato! Prossima pescata 5★/6★ garantita!", "success", "✨");
          }
          try { if (window.sfx) window.sfx("coin"); } catch (e) {}
          renderFoundry();
          updateHeaderCounters();
        };
      });

      // Azioni Upgrade ★+
      foundryModalEl.querySelectorAll(".btn-upgrade-toy").forEach(b => {
        b.onclick = () => {
          const id = b.getAttribute("data-id");
          const d = getGachaData();
          if ((d.shards || 0) < 30) {
            if (window.toast) window.toast("Servono 30 frammenti per potenziare la miniatura a ★+!", "warn", "🧩");
            return;
          }
          d.shards -= 30;
          d.upgraded = d.upgraded || {};
          d.upgraded[id] = 1;
          saveGachaData(d);
          const toy = resolveToy(TOY_CATALOG.find(t => t.id === id));
          if (window.toast) window.toast(`Miniatura potenziata a ★+: ${toy.name} (Bonus x2 attivo)!`, "success", "🌟");
          try { if (window.sfx) window.sfx("goal"); } catch (e) {}
          renderFoundry();
          updateHeaderCounters();
        };
      });
    }

    renderFoundry();
  }
  window.openGachaFoundryModal = openGachaFoundryModal;

  // --- MODALE GACHA PRINCIPALE ---
  let gachaModalEl = null;

  function createGachaModal() {
    if (gachaModalEl) return gachaModalEl;

    gachaModalEl = document.createElement("div");
    gachaModalEl.id = "gachaMainModal";
    gachaModalEl.style.cssText = `
      position: fixed; inset: 0; z-index: 999999;
      background: radial-gradient(circle at center, #132442 0%, #060b14 100%);
      display: none; flex-direction: column; align-items: center; justify-content: space-between;
      padding: 12px; box-sizing: border-box; font-family: var(--body, system-ui, sans-serif);
      color: #fff; overflow-y: auto; user-select: none; -webkit-user-select: none;
    `;

    gachaModalEl.innerHTML = `
      <!-- Intestazione -->
      <div style="width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1.5px solid rgba(255,255,255,0.15);">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:24px;">🎰</span>
          <div>
            <div style="font-size:15px; font-weight:900; color:var(--gold, #ffd23f); text-shadow:0 2px 4px #000; letter-spacing:0.5px;">GASHAPON DEL BAR MORETTI</div>
            <div style="font-size:11px; color:#9cb5db;">Mini-Leggende & Pupazzetti della Costa 3D (${TOY_CATALOG.length} Statuine)</div>
          </div>
        </div>
        <button type="button" id="gachaCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:6px 12px; font-size:12px; font-weight:bold; cursor:pointer;">✕ Chiudi</button>
      </div>

      <!-- Barra Valute & Pity -->
      <div style="width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.4); border-radius: 8px; padding: 6px 12px; margin: 6px 0; font-size: 12px;">
        <div style="display:flex; align-items:center; gap:5px;">
          <span>🪙 Monete:</span>
          <b id="gachaCoinsCount" style="color:#ffd23f; font-size:14px;">0</b>
        </div>
        <div style="display:flex; align-items:center; gap:5px; cursor:pointer;" id="gachaShardsClick">
          <span>🧩 Frammenti:</span>
          <b id="gachaShardsCount" style="color:#57d68d; font-size:14px;">0</b>
          <span style="font-size:10px; color:#38bdf8; text-decoration:underline;">(Fonderia)</span>
        </div>
        <div style="font-size:11px; color:#a0b8df;">
          Pity 5★/6★: <b id="gachaPityCount" style="color:#ff7a22;">0/30</b>
        </div>
      </div>

      <!-- Schermata Centrale del Distributore (2D Canvas) -->
      <div id="gachaMachineWrapper" style="position: relative; width: 100%; max-width: 340px; aspect-ratio: 1 / 1.1; margin: 4px auto; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <canvas id="gachaMachineCanvas" width="340" height="374" style="width: 100%; height: 100%; border-radius: 12px; box-shadow: 0 12px 28px rgba(0,0,0,0.6);"></canvas>
      </div>

      <!-- Pulsanti Azione e Menu -->
      <div style="width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
        <div style="display: flex; gap: 8px; width: 100%;">
          <button type="button" id="gachaPull1Btn" style="flex:1; background:linear-gradient(180deg, #2563eb, #1d4ed8); color:#fff; border:2px solid #60a5fa; border-radius:8px; padding:10px 4px; font-weight:bold; font-size:13px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.4); display:flex; flex-direction:column; align-items:center; gap:2px;">
            <span>GIRA 1 CAPSULA</span>
            <span style="font-size:11px; color:#ffd23f;">🪙 15 Monete</span>
          </button>
          <button type="button" id="gachaPull10Btn" style="flex:1.2; background:linear-gradient(180deg, #d97706, #b45309); color:#fff; border:2px solid #fbbf24; border-radius:8px; padding:10px 4px; font-weight:bold; font-size:13px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.4); display:flex; flex-direction:column; align-items:center; gap:2px;">
            <span>🎰 SCARICA 10 CAPSULE</span>
            <span style="font-size:11px; color:#ffd23f;">🪙 130 Monete (4★ Garantito!)</span>
          </button>
        </div>

        <div style="display: flex; gap: 8px; width: 100%;">
          <button type="button" id="gachaCabinetBtn" style="flex:1.2; background:#1e293b; color:#cbd5e1; border:1px solid #475569; border-radius:6px; padding:8px; font-size:12px; font-weight:bold; cursor:pointer;">
            🧸 Vetrinetta (<span id="gachaOwnedCount">0/${TOY_CATALOG.length}</span>)
          </button>
          <button type="button" id="gachaFoundryBtn" style="flex:1.2; background:linear-gradient(180deg, #059669, #047857); color:#fff; border:1px solid #34d399; border-radius:6px; padding:8px; font-size:12px; font-weight:bold; cursor:pointer;">
            🧩 Fonderia Frammenti
          </button>
          <button type="button" id="gachaRatesBtn" style="flex:0.8; background:#1e293b; color:#cbd5e1; border:1px solid #475569; border-radius:6px; padding:8px; font-size:12px; font-weight:bold; cursor:pointer;">
            📊 Info Rarità
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(gachaModalEl);

    // Eventi
    gachaModalEl.querySelector("#gachaCloseBtn").onclick = () => {
      gachaModalEl.style.display = "none";
    };
    gachaModalEl.querySelector("#gachaPull1Btn").onclick = () => handlePull(1);
    gachaModalEl.querySelector("#gachaPull10Btn").onclick = () => handlePull(10);
    gachaModalEl.querySelector("#gachaCabinetBtn").onclick = () => openGachaCabinetModal();
    gachaModalEl.querySelector("#gachaFoundryBtn").onclick = () => openGachaFoundryModal();
    gachaModalEl.querySelector("#gachaShardsClick").onclick = () => openGachaFoundryModal();
    gachaModalEl.querySelector("#gachaRatesBtn").onclick = () => showRatesInfo();

    return gachaModalEl;
  }

  // Disegno 2D della Macchinetta Gashapon
  let crankAngle = 0;

  function drawGachaMachine() {
    const cv = document.getElementById("gachaMachineCanvas");
    if (!cv) return;
    const g = cv.getContext("2d");
    const W = cv.width, H = cv.height;

    // Sfondo caldo da Bar d'epoca
    const bgGrad = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 200);
    bgGrad.addColorStop(0, "#1d3254");
    bgGrad.addColorStop(1, "#0c1524");
    g.fillStyle = bgGrad;
    g.fillRect(0, 0, W, H);

    // Piedistallo metallico inferiore
    g.fillStyle = "#1e2229";
    g.fillRect(70, 310, 200, 50);
    g.fillStyle = "#b3202c";
    g.fillRect(75, 305, 190, 8);

    // Corpo centrale distributore in ghisa rossa amaranto
    const bodyGrad = g.createLinearGradient(70, 0, 270, 0);
    bodyGrad.addColorStop(0, "#8a1620");
    bodyGrad.addColorStop(0.5, "#d92b3a");
    bodyGrad.addColorStop(1, "#73121a");
    g.fillStyle = bodyGrad;
    g.beginPath();
    g.roundRect(70, 155, 200, 155, [0, 0, 12, 12]);
    g.fill();

    // Campana di vetro sferica superiore con le palline
    const cx = W / 2, cy = 110, r = 82;
    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.clip();

    const glassGrad = g.createRadialGradient(cx - 25, cy - 25, 10, cx, cy, r);
    glassGrad.addColorStop(0, "#60a5fa44");
    glassGrad.addColorStop(0.8, "#1e3a8a33");
    glassGrad.addColorStop(1, "#0f172a66");
    g.fillStyle = glassGrad;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);

    const ballColors = ["#ef4444", "#3b82f6", "#eab308", "#10b981", "#a855f7", "#ec4899", "#f97316"];
    const seed = 42;
    for (let i = 0; i < 28; i++) {
      const bx = cx + Math.sin(i * 1.7 + seed) * (r - 20) * 0.85;
      const by = cy + 18 + Math.cos(i * 2.3 + seed) * (r - 28) * 0.75;
      const bCol = ballColors[i % ballColors.length];

      g.fillStyle = bCol;
      g.beginPath();
      g.arc(bx, by, 12, 0, Math.PI * 2);
      g.fill();

      g.fillStyle = "rgba(255,255,255,0.7)";
      g.beginPath();
      g.arc(bx, by, 12, Math.PI, Math.PI * 2);
      g.fill();

      g.fillStyle = "rgba(255,255,255,0.85)";
      g.beginPath();
      g.arc(bx - 3, by - 3, 3, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    g.strokeStyle = "rgba(255,255,255,0.6)";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();

    g.fillStyle = "#cbd5e1";
    g.beginPath();
    g.roundRect(cx - 50, cy - r - 12, 100, 16, [6, 6, 0, 0]);
    g.fill();

    // Mascherina metallica frontale cromata
    g.fillStyle = "#334155";
    g.beginPath();
    g.roundRect(110, 175, 120, 68, 8);
    g.fill();
    g.strokeStyle = "#94a3b8";
    g.lineWidth = 2;
    g.stroke();

    // Fessura moneta
    g.fillStyle = "#0f172a";
    g.fillRect(cx - 24, 185, 48, 5);

    // Manovella rotante cromata al centro
    g.save();
    g.translate(cx, 218);
    g.rotate(crankAngle);

    g.fillStyle = "#64748b";
    g.beginPath(); g.arc(0, 0, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#cbd5e1";
    g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();

    g.fillStyle = "#cbd5e1";
    g.beginPath();
    g.roundRect(-28, -6, 56, 12, 4);
    g.roundRect(-6, -28, 12, 56, 4);
    g.fill();
    g.restore();

    // Vano / Sportellino di uscita delle capsule in basso
    g.fillStyle = "#0f172a";
    g.beginPath();
    g.roundRect(cx - 36, 256, 72, 44, [8, 8, 4, 4]);
    g.fill();
    g.strokeStyle = "#475569";
    g.lineWidth = 2;
    g.stroke();

    g.fillStyle = "rgba(100,150,220,0.3)";
    g.fillRect(cx - 32, 260, 64, 34);
    g.fillStyle = "#94a3b8";
    g.font = "bold 9px sans-serif";
    g.textAlign = "center";
    g.fillText("RITIRO", cx, 280);
  }

  function updateHeaderCounters() {
    const data = getGachaData();
    const coinsEl = document.getElementById("gachaCoinsCount");
    const shardsEl = document.getElementById("gachaShardsCount");
    const pityEl = document.getElementById("gachaPityCount");
    const ownedEl = document.getElementById("gachaOwnedCount");

    const curCoins = getUserCoins();
    if (coinsEl) coinsEl.textContent = curCoins;
    if (shardsEl) shardsEl.textContent = data.shards || 0;
    if (pityEl) pityEl.textContent = `${data.pity || 0}/30`;
    if (ownedEl) ownedEl.textContent = `${Object.keys(data.owned).length}/${TOY_CATALOG.length}`;

    const b1 = document.getElementById("gachaPull1Btn");
    const b10 = document.getElementById("gachaPull10Btn");
    if (b1) {
      if (curCoins < 15) {
        b1.style.opacity = "0.55";
        b1.style.filter = "grayscale(0.6)";
      } else {
        b1.style.opacity = "1";
        b1.style.filter = "none";
      }
    }
    if (b10) {
      if (curCoins < 130) {
        b10.style.opacity = "0.55";
        b10.style.filter = "grayscale(0.6)";
      } else {
        b10.style.opacity = "1";
        b10.style.filter = "none";
      }
    }
  }

  // --- LOGICA DI PESCATA CON ANIMAZIONE ---
  let isPulling = false;

  function handlePull(count) {
    if (isPulling) return;
    const cost = count === 1 ? 15 : 130;
    const userCoins = getUserCoins();

    if (userCoins < cost) {
      if (window.toast) {
        window.toast(`🪙 Monete insufficienti! Ne hai solo ${userCoins}, ne servono ${cost}. Gioca partite, sfide o missioni nel Borgo per guadagnarne altre!`, "warn", "🔒");
      }
      updateHeaderCounters();
      return;
    }

    deductUserCoins(cost);
    updateHeaderCounters();
    isPulling = true;

    let spinFrames = 0;
    const maxSpin = 24;
    function spinCrank() {
      crankAngle += (Math.PI * 2) / 8;
      drawGachaMachine();
      spinFrames++;
      if (spinFrames < maxSpin) {
        requestAnimationFrame(spinCrank);
      } else {
        finishPull();
      }
    }

    try {
      if (window.sfx) window.sfx("kick");
    } catch (e) {}

    spinCrank();

    function finishPull() {
      const data = getGachaData();
      const results = [];

      for (let i = 0; i < count; i++) {
        if (count === 10 && i === 9 && !results.some((r) => r.toy.stars >= 4)) {
          data.pity = 30;
        }
        results.push(pullSingleToy(data));
      }

      updateHeaderCounters();
      isPulling = false;
      showPullRevealModal(results);
    }
  }

  // --- MODALE RIVELAZIONE DELLA STATUINA 3D ---
  let revealModalEl = null;

  function showPullRevealModal(results, fromCabinet = false) {
    if (!revealModalEl) {
      revealModalEl = document.createElement("div");
      revealModalEl.id = "gachaRevealModal";
      document.body.appendChild(revealModalEl);
    }

    revealModalEl.style.cssText = `
      position: fixed; inset: 0; z-index: 1000005;
      background: rgba(3, 7, 18, 0.96); backdrop-filter: blur(12px);
      display: flex; flex-direction: column; align-items: center; justify-content: space-between;
      padding: 16px; box-sizing: border-box; font-family: var(--body, system-ui, sans-serif); color: #fff;
    `;

    revealModalEl.style.display = "flex";
    let currentIndex = 0;

    function renderCurrentToy() {
      const item = results[currentIndex];
      const toy = item.toy;
      const data = getGachaData();
      const isUpgraded = !!(data.upgraded && data.upgraded[toy.id]);

      if (!fromCabinet && toy.stars >= 5) {
        try {
          if (window.triggerTrophyCelebration) window.triggerTrophyCelebration();
          else if (window.triggerGoalCelebration) window.triggerGoalCelebration(true);
        } catch (e) {}
      }

      const starIcons = "★".repeat(toy.stars);
      const starColor = toy.stars === 6 ? "#ff70a6" : toy.stars === 5 ? "#ffd23f" : toy.stars === 4 ? "#60a5fa" : "#cd7f32";

      revealModalEl.innerHTML = `
        <!-- Header -->
        <div style="width: 100%; max-width: 440px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 13px; color: #94a3b8;">
            ${fromCabinet ? "🔍 ISPEZIONE 3D MINIATURA" : `Capsula ${currentIndex + 1} di ${results.length}`}
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="font-size: 16px; color: ${starColor}; text-shadow: 0 0 10px ${starColor}; font-weight: bold;">
              ${starIcons} ${toy.rarityName.toUpperCase()}${isUpgraded ? " <span style='color:#38bdf8;'>★+</span>" : ""}
            </div>
            <button type="button" id="gachaTopCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:4px 10px; font-size:12px; font-weight:bold; cursor:pointer;">✕</button>
          </div>
        </div>

        <!-- Vista 3D interattiva -->
        <div id="toy3DContainer" style="width: 280px; height: 300px; position: relative; margin: 10px auto; cursor: grab;">
          <!-- Three.js inserito qui -->
        </div>
        <div style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: -6px;">
          👆 Trascina con il dito o il mouse per ruotare la statuina a 360°
        </div>

        <!-- Scheda informativa giocattolo -->
        <div style="width: 100%; max-width: 440px; background: rgba(30, 41, 59, 0.75); border: 1.5px solid ${isUpgraded ? "#38bdf8" : starColor}66; border-radius: 12px; padding: 12px; box-sizing: border-box; text-align: center;">
          <div style="font-size: 18px; font-weight: 900; color: #fff; font-family: var(--display, sans-serif);">${toy.name}</div>
          <div style="font-size: 12px; color: var(--gold, #ffd23f); font-weight: bold; margin-bottom: 2px;">${toy.title}</div>
          <div style="font-size: 11px; color: #93c5fd; margin-bottom: 4px;">🏷️ ${toy.series || "Serie 1"}</div>
          <div style="font-size: 12px; font-style: italic; color: #cbd5e1; margin-bottom: 6px;">${toy.quote}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px; line-height: 1.35;">${toy.lore}</div>
          <div style="font-size: 12px; font-weight: bold; color: #4ade80;">✨ Effetto: ${toy.bonus} ${isUpgraded ? "<b>(RADDOPPIATO x2!)</b>" : ""}</div>

          ${!fromCabinet ? (item.isDuplicate ? `
            <div style="margin-top: 8px; font-size: 11px; background: rgba(234, 179, 8, 0.2); border: 1px dashed #eab308; border-radius: 6px; padding: 4px 8px; color: #fde047;">
              ♻️ Doppione convertito in: <b>+${item.shardReward} Frammenti di Plastica Pregiata</b>
            </div>
          ` : `
            <div style="margin-top: 8px; font-size: 11px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; border-radius: 6px; padding: 4px 8px; color: #86efac;">
              🎉 NUOVO GIOCATTOLO AGGIUNTO ALLA TUA COLLEZIONE!
            </div>
          `) : ""}
        </div>

        <!-- Tasti avanti / chiudi -->
        <div style="width: 100%; max-width: 440px; display: flex; gap: 10px; margin-top: 10px;">
          ${!fromCabinet && currentIndex < results.length - 1 ? `
            <button type="button" id="gachaNextBtn" style="flex:1; background:linear-gradient(180deg, #2563eb, #1d4ed8); color:#fff; border:1.5px solid #60a5fa; border-radius:8px; padding:12px; font-size:14px; font-weight:bold; cursor:pointer;">
              Prossima Capsula ▸
            </button>
          ` : `
            <button type="button" id="gachaDoneBtn" style="flex:1; background:${fromCabinet ? "linear-gradient(180deg, #2563eb, #1d4ed8)" : "linear-gradient(180deg, #16a34a, #15803d)"}; color:#fff; border:1.5px solid ${fromCabinet ? "#60a5fa" : "#4ade80"}; border-radius:8px; padding:12px; font-size:14px; font-weight:bold; cursor:pointer;">
              ${fromCabinet ? "◂ Torna alla Vetrinetta" : "✓ Ritiro Completato"}
            </button>
          `}
        </div>
      `;

      const c = document.getElementById("toy3DContainer");
      if (c && initThreeForToy(c)) {
        build3DToyMesh(toy);
      }

      const closeFn = () => {
        revealModalEl.style.display = "none";
        if (threeAnimId) cancelAnimationFrame(threeAnimId);
        updateHeaderCounters();
      };

      const topCloseBtn = document.getElementById("gachaTopCloseBtn");
      if (topCloseBtn) topCloseBtn.onclick = closeFn;

      const nextBtn = document.getElementById("gachaNextBtn");
      if (nextBtn) {
        nextBtn.onclick = () => {
          currentIndex++;
          renderCurrentToy();
        };
      }

      const doneBtn = document.getElementById("gachaDoneBtn");
      if (doneBtn) doneBtn.onclick = closeFn;
    }

    renderCurrentToy();
  }

  // --- VETRINETTA COLLEZIONE PUPAZZETTI (WOODEN CABINET) ---
  let cabinetModalEl = null;

  function openGachaCabinetModal() {
    if (!cabinetModalEl) {
      cabinetModalEl = document.createElement("div");
      cabinetModalEl.id = "gachaCabinetModal";
      cabinetModalEl.style.cssText = `
        position: fixed; inset: 0; z-index: 1000001;
        background: radial-gradient(circle at center, #1e1511 0%, #0c0806 100%);
        display: none; flex-direction: column; align-items: center; justify-content: space-between;
        padding: 14px; box-sizing: border-box; font-family: var(--body, system-ui, sans-serif); color: #fff;
        overflow-y: auto;
      `;
      document.body.appendChild(cabinetModalEl);
    }

    const data = getGachaData();
    const ownedCount = Object.keys(data.owned).length;

    cabinetModalEl.style.display = "flex";
    cabinetModalEl.innerHTML = `
      <!-- Header Vetrinetta -->
      <div style="width: 100%; max-width: 520px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid rgba(255,255,255,0.15); padding-bottom: 8px;">
        <div>
          <div style="font-size:16px; font-weight:900; color:var(--gold, #ffd23f);">🧸 VETRINETTA DEI PUPAZZETTI</div>
          <div style="font-size:11px; color:#c7a685;">Collezione Mini-Leggende: ${ownedCount} su ${TOY_CATALOG.length} raccolti · 🧩 Frammenti: ${data.shards || 0}</div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" id="cabinetFoundryBtn" style="background:#059669; color:#fff; border:1px solid #34d399; border-radius:6px; padding:6px 10px; font-size:11px; font-weight:bold; cursor:pointer;">🧩 Fonderia</button>
          <button type="button" id="cabinetCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:6px 12px; font-size:12px; font-weight:bold; cursor:pointer;">✕ Chiudi</button>
        </div>
      </div>

      <!-- Mensole in legno da collezione -->
      <div style="width: 100%; max-width: 520px; flex: 1; margin: 12px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; overflow-y: auto; padding: 6px;">
        ${TOY_CATALOG.map((rawToy) => {
          const toy = resolveToy(rawToy);
          const count = data.owned[toy.id] || 0;
          const isOwned = count > 0;
          const isUp = !!(data.upgraded && data.upgraded[toy.id]);
          const starColor = toy.stars === 6 ? "#ff70a6" : toy.stars === 5 ? "#ffd23f" : toy.stars === 4 ? "#60a5fa" : "#cd7f32";

          return `
            <div class="cabinet-toy-slot" data-id="${toy.id}" style="background: ${isOwned ? (isUp ? "rgba(14, 46, 74, 0.9)" : "rgba(40, 25, 18, 0.85)") : "rgba(15, 12, 10, 0.7)"}; border: 1.5px solid ${isUp ? "#38bdf8" : (isOwned ? starColor : "#4a3528")}; border-radius: 10px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.5); position: relative; min-height: 120px;">
              <div style="font-size: 10px; color: ${starColor}; font-weight: bold;">
                ${"★".repeat(toy.stars)}${isUp ? " <span style='color:#38bdf8;'>★+</span>" : ""}
              </div>
              <div style="font-size: ${isOwned ? "34px" : "28px"}; filter: ${isOwned ? "drop-shadow(0 4px 6px rgba(0,0,0,0.6))" : "grayscale(1) brightness(0.2)"}; margin: 4px 0;">
                ${isOwned ? (toy.stars >= 5 ? "🏆" : "⚽") : "🔒"}
              </div>
              <div style="font-size: 11px; font-weight: bold; text-align: center; color: ${isOwned ? "#fff" : "#785b46"}; line-height: 1.2;">
                ${isOwned ? toy.name : "???"}
              </div>
              <div style="font-size: 9px; color: ${isOwned ? (isUp ? "#38bdf8" : "#ffd23f") : "#554030"}; margin-top: 2px;">
                ${isOwned ? (isUp ? "★+ Potenziato" : (count > 1 ? `${count} copie` : "1 copia")) : "Tocca per scolpire"}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Footer Info -->
      <div style="width: 100%; max-width: 520px; font-size: 11px; color: #a88a6d; text-align: center;">
        Tocca una statuina sbloccata per ispezionarla in 3D a 360°, oppure tocca un lucchetto per scolpirlo nella Fonderia!
      </div>
    `;

    cabinetModalEl.querySelector("#cabinetCloseBtn").onclick = () => {
      cabinetModalEl.style.display = "none";
    };

    cabinetModalEl.querySelector("#cabinetFoundryBtn").onclick = () => {
      openGachaFoundryModal(() => {
        openGachaCabinetModal();
      });
    };

    cabinetModalEl.querySelectorAll(".cabinet-toy-slot").forEach((el) => {
      el.onclick = () => {
        const id = el.getAttribute("data-id");
        if (data.owned[id]) {
          const toy = resolveToy(TOY_CATALOG.find((t) => t.id === id));
          if (toy) {
            showPullRevealModal([{ toy, isDuplicate: false, shardReward: 0 }], true);
          }
        } else {
          const toy = resolveToy(TOY_CATALOG.find((t) => t.id === id));
          const cost = toy.stars === 3 ? 25 : toy.stars === 4 ? 60 : toy.stars === 5 ? 150 : 300;
          if (confirm(`Non hai ancora trovato «${toy.name}» (${toy.stars}★).\n\nVuoi aprire la Fonderia dei Frammenti per scolpirlo direttamente per ${cost} frammenti?`)) {
            openGachaFoundryModal(() => {
              openGachaCabinetModal();
            });
          }
        }
      };
    });
  }

  // Info Rarità & Regole senza window.alert
  function showRatesInfo() {
    const existing = document.getElementById("gachaRatesModal");
    if (existing) existing.remove();

    const m = document.createElement("div");
    m.id = "gachaRatesModal";
    m.style.cssText = `
      position: fixed; inset: 0; z-index: 1000010;
      background: rgba(3, 7, 18, 0.88); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 14px;
      font-family: var(--body, system-ui, sans-serif); color: #fff;
    `;
    m.innerHTML = `
      <div style="background:#0f172a; border:2px solid #b88648; border-radius:14px; padding:18px; max-width:440px; width:100%; box-shadow:0 16px 36px rgba(0,0,0,0.7);">
        <div style="font-size:16px; font-weight:bold; color:#ffd23f; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
          <span>🎰</span> PROBABILITÀ DEL GASHAPON DEL BAR MORETTI
        </div>
        <div style="font-size:12px; color:#cbd5e1; line-height:1.5; margin-bottom:12px;">
          <div>• <b style="color:#cd7f32;">3★ COMUNI (Bronzo):</b> 65.0%</div>
          <div>• <b style="color:#60a5fa;">4★ RARI (Argento Cromato):</b> 25.0%</div>
          <div>• <b style="color:#ffd23f;">5★ SUPER STAR (Oro Foil):</b> 8.5%</div>
          <div>• <b style="color:#ff70a6;">6★ LEGGENDE MITICHE (Arcobaleno):</b> 1.5%</div>
          <br>
          <div>✨ <b>PITY GARANTITO:</b> Al 30° tiro consecutivo senza 5★/6★, la prossima capsula conterrà al 100% una Super Star o una Leggenda!</div>
          <br>
          <div>🪙 <b>MULTI-PESCATA (10x):</b> Garantisce sempre almeno un pupazzetto 4★ Raro o superiore!</div>
          <br>
          <div>🧩 <b>FRAMMENTI & FONDERIA:</b> I doppioni diventano frammenti pregiati utilizzabili per scolpire statuine mancanti, forgiare monete o potenziare i pupazzetti a ★+!</div>
        </div>
        <button type="button" id="closeRatesModalBtn" style="width:100%; background:#2563eb; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Ho capito</button>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector("#closeRatesModalBtn").onclick = () => m.remove();
    m.onclick = (e) => { if (e.target === m) m.remove(); };
  }

  // --- API PUBBLICA GLOBALE ---
  window.openGachaModal = function () {
    const modal = createGachaModal();
    modal.style.display = "flex";
    updateHeaderCounters();
    drawGachaMachine();
  };

  window.openGachaCabinetModal = function () {
    openGachaCabinetModal();
  };

  console.log("✓ Modalità Gacha (Pupazzetti 3D del Bar Moretti - 40 miniature) caricata con successo");
})();
