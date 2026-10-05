// ================= MODALITÀ GACHA: IL DISTRIBUTORE DEL BAR MORETTI =================
// Pupazzetti e Miniature 3D da Collezione «Mini-Leggende della Costa»
// - Macchinetta Gashapon vintage in ghisa rossa e campana di vetro
// - Pescata 1x (15 monete) e Multi-pescata 10x (130 monete con 4★ garantito)
// - Sistema di rarità: 3★ Bronzo, 4★ Argento, 5★ Oro Foil, 6★ Arcobaleno Olografico
// - Apertura capsula con animazione 2D + Statuina Giocattolo 3D interattiva (Three.js)
// - Vetrinetta in legno da collezione con ispezione 3D a 360° e negozio scambi con frammenti
(function () {
  "use strict";

  const K_DATA = "ali-di-rondine.gacha-toys";

  // --- CATALOGO DEI 24 PUPAZZETTI GIOCATTOLO ---
  const TOY_CATALOG = [
    // 3★ COMUNI (Basetta Bronzo)
    {
      id: "baciccia_boots",
      name: "Baciccia Pescatore",
      title: "Il Maestro dei Nodi",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#1d4872",
      shortsColor: "#112233",
      hairColor: "#d0d5dd",
      skinColor: "#d89e72",
      headType: "cap",
      acc: "pipe",
      quote: "«Il mare non mente mai. E neanche un cross ben calciato.»",
      lore: "Versione giocattolo con stivali impermeabili in gomma verde e pipa in radica rimovibile.",
      bonus: "+2 Contrasto sulle fasce"
    },
    {
      id: "aurelio_bless",
      name: "Don Aurelio",
      title: "Il Parroco del Borgo",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#222226",
      shortsColor: "#161618",
      hairColor: "#f0f0f0",
      skinColor: "#f3cc9c",
      headType: "bald",
      acc: "bell",
      quote: "«Benedico i pali della porta ogni domenica prima dell'omelia.»",
      lore: "Include mini-campanella in metallo. Se scuoti il pupazzetto, tintinna davvero!",
      bonus: "+5% probabilità di palo salvifico"
    },
    {
      id: "rita_trofie",
      name: "Rita della Trattoria",
      title: "Regina del Pesto a Mortaio",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#ffffff",
      shortsColor: "#2b4a2e",
      hairColor: "#42281a",
      skinColor: "#f4c69d",
      headType: "bun",
      acc: "bowl",
      quote: "«Se non mangi due etti di trofie prima del derby, non scendi in campo!»",
      lore: "Grembiulino in stoffa con macchia di pesto autentico serigrafata a mano.",
      bonus: "+10 Grinta iniziale a inizio partita"
    },
    {
      id: "tonino_caffe",
      name: "Tonino del Bar",
      title: "Signore del Bancone",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#b3202c",
      shortsColor: "#1a1a1a",
      hairColor: "#1a1a1a",
      skinColor: "#dfaa7d",
      headType: "short",
      acc: "coffee",
      quote: "«Un espresso ristretto e palla lunga. Tattica semplice e vincente.»",
      lore: "Posa classica con tazzina fumante in mano e grembiule della Rondine.",
      bonus: "+1 Moneta a ogni gol segnato"
    },
    {
      id: "ragazzino_molo",
      name: "Ragazzino del Campetto",
      title: "La Promessa di Scoglio",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#ffd23f",
      shortsColor: "#b3202c",
      hairColor: "#6a3b1a",
      skinColor: "#f5cd9e",
      headType: "messy",
      acc: "ball",
      quote: "«Da grande voglio tirare forte come Leo Moretti!»",
      lore: "Ginocchia sbucciate dipinte a mano e pallone di cuoio consumato sotto il piede.",
      bonus: "+2 Velocità nei primi 15 minuti"
    },
    {
      id: "pescivendolo",
      name: "Gino il Pescivendolo",
      title: "La Voce dei Caruggi",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#3a76b8",
      shortsColor: "#ffffff",
      hairColor: "#333333",
      skinColor: "#e0ad84",
      headType: "cap",
      acc: "fish",
      quote: "«Acciughe fresche e diagonali strette! Non si passa!»",
      lore: "Statuina con cassetta di pesce fresco in miniatura. Odora leggermente di salsedine.",
      bonus: "+2 Difesa sui calci d'angolo"
    },
    {
      id: "gabbiano_mascotte",
      name: "Gabbiano Ufficiale",
      title: "Il Distrattore Aereo",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#f8f9fa",
      shortsColor: "#e9ecef",
      hairColor: "#ffd23f",
      skinColor: "#ffffff",
      headType: "beak",
      acc: "focaccia_piece",
      quote: "«CRAAA! (Traduzione: quel fuorigioco non c'era affatto!)»",
      lore: "Il celebre gabbiano che rubò il panino al guardalinee durante la semifinale del '94.",
      bonus: "+3% errore per i tiratori avversari"
    },
    {
      id: "gigi_clown",
      name: "Gigi Mascotte",
      title: "Il Cuore della Panchina",
      stars: 3,
      rarityName: "Comune",
      pedestal: "bronze",
      shirtColor: "#ff4d5a",
      shortsColor: "#ffffff",
      hairColor: "#111111",
      skinColor: "#dfaa7d",
      headType: "spiky",
      acc: "banner",
      quote: "«Ho fatto tre ore di stretching per esultare al tuo gol!»",
      lore: "Statuina snodabile con striscione 'FORZA RONDINE' che sventola davvero.",
      bonus: "+5 Recupero fiato nell'intervallo"
    },

    // 4★ RARI (Basetta Argento Cromato)
    {
      id: "bruno_tackle",
      name: "Bruno Sabatini",
      title: "Il Mastino della Difesa",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#3a1450",
      shortsColor: "#1f092b",
      hairColor: "#1d140e",
      skinColor: "#e2b186",
      headType: "stern",
      acc: "ball",
      quote: "«Se passa la palla non passa l'uomo. Se passa l'uomo non passa la palla.»",
      lore: "Placcatura argento cromato lucido. Posa in scivolata implacabile con zolla sollevata.",
      bonus: "+4 Contrasto e intimidazione sui duelli"
    },
    {
      id: "fede_parabola",
      name: "Fede Lanza",
      title: "Piede di Velluto",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#1d3fa3",
      shortsColor: "#ffffff",
      hairColor: "#2a1e12",
      skinColor: "#f6d5ae",
      headType: "stylish",
      acc: "ball",
      quote: "«Il pallone va accarezzato prima di spedirlo nel sette.»",
      lore: "Statuina con braccio aperto a bilanciare la postura per la punizione perfetta.",
      bonus: "+4 Precisione tiri da fermo"
    },
    {
      id: "tommy_flash",
      name: "Tommy Diallo",
      title: "Il Fulmine delle Fasce",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#b3202c",
      shortsColor: "#ffffff",
      hairColor: "#ffd23f",
      skinColor: "#8c5632",
      headType: "blond_afro",
      acc: "comet",
      quote: "«Tu mettila nello spazio, al resto penso io con le gambe!»",
      lore: "Scia d'aria trasparente in plastica acrilica montata dietro i tacchetti.",
      bonus: "+5 Velocità negli scatti di contropiede"
    },
    {
      id: "nico_gelato",
      name: "Nico con Gelato",
      title: "Il Portiere Goloso",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#19a0b8",
      shortsColor: "#0b263d",
      hairColor: "#ff7a22",
      skinColor: "#f6ce9d",
      headType: "orange_hair",
      acc: "icecream",
      quote: "«Paro anche le mosche al volo, basta che dopo andiamo da Tonino.»",
      lore: "Coppetta di gelato pistacchio e limone nella mano sinistra, guanto dorato nella destra.",
      bonus: "+4 Parata sui tiri ravvicinati"
    },
    {
      id: "sara_tactics",
      name: "Sara col Tablet",
      title: "Il Cervello della Squadra",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#ffffff",
      shortsColor: "#1f3a63",
      hairColor: "#3a2012",
      skinColor: "#f3cd9f",
      headType: "ponytail",
      acc: "tablet",
      quote: "«I numeri non mentono: il loro terzino sinistro lascia sempre tre metri di buco.»",
      lore: "Tablet con schermo fosforescente che mostra lo schema 4-3-3 della Rondine.",
      bonus: "+3 Lettura anticipata nei duelli"
    },
    {
      id: "garnier_gk",
      name: "Garnier Portierone",
      title: "La Ghigliottina Transalpina",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#1b4d3e",
      shortsColor: "#0f2b23",
      hairColor: "#222222",
      skinColor: "#eed0aa",
      headType: "mustache",
      acc: "cap",
      quote: "«Une balle bien arrêtée vaut tous les discours du monde.»",
      lore: "Elegante berretto anni '70 e baffetto alla francese dipinto con cura millimetrica.",
      bonus: "+3 Parata su pallonetti e tiri da fuori"
    },
    {
      id: "dario_muro",
      name: "Dario il Capitano",
      title: "La Roccia di Pietra",
      stars: 4,
      rarityName: "Raro",
      pedestal: "silver",
      shirtColor: "#b3202c",
      shortsColor: "#ffffff",
      hairColor: "#2c1d11",
      skinColor: "#deb087",
      headType: "bandana",
      acc: "armband",
      quote: "«Finché batte il cuore e reggono i tendini, questa fascia non si toglie.»",
      lore: "Fascia da capitano giallo oro in rilievo sul braccio sinistro muscoloso.",
      bonus: "+4 Grinta a tutta la squadra"
    },

    // 5★ SUPER STAR (Basetta Oro con Effetto Foil)
    {
      id: "leo_rondine_gold",
      name: "Leo Moretti #10",
      title: "L'Erede del Golfo (Tiro della Rondine)",
      stars: 5,
      rarityName: "Super Star",
      pedestal: "gold",
      shirtColor: "#b3202c",
      shortsColor: "#ffffff",
      hairColor: "#2a1810",
      skinColor: "#f3cb9e",
      headType: "leo_flow",
      acc: "wings",
      quote: "«Vola alta, piccola rondine... Dritta sotto l'incrocio dei pali!»",
      lore: "Edizione limitata in posa aerea con ali traslucide dorate che spuntano dalle spalle.",
      bonus: "+6 Potenza al Tiro della Rondine"
    },
    {
      id: "nico_flying_cat",
      name: "Nico «Gatto Volante»",
      title: "Il Balzo Prodigioso",
      stars: 5,
      rarityName: "Super Star",
      pedestal: "gold",
      shirtColor: "#ffd23f",
      shortsColor: "#111118",
      hairColor: "#ff7a22",
      skinColor: "#f6ce9d",
      headType: "cat_ears",
      acc: "springs",
      quote: "«MIAO! Non si passa, manco se la tiri col cannone!»",
      lore: "Molle meccaniche dorate sotto la suola per simulare l'incredibile balzo del gatto.",
      bonus: "+7 Riflessi estremi e miracoli sui rigori"
    },
    {
      id: "kenji_orient_wall",
      name: "Kenji «Il Muro d'Oriente»",
      title: "La Parata a Due Mani",
      stars: 5,
      rarityName: "Super Star",
      pedestal: "gold",
      shirtColor: "#0d2b45",
      shortsColor: "#ffffff",
      hairColor: "#050508",
      skinColor: "#f2cca0",
      headType: "topknot",
      acc: "barrier",
      quote: "«Lo spirito calmo ferma qualsiasi tempesta di cuoio.»",
      lore: "Include barriera semitrasparente esagonale con scudo dorato e guantoni corazzati.",
      bonus: "+6 Parata murata e presa sicura"
    },
    {
      id: "tsubasa_comet",
      name: "Tsubasa Ozora",
      title: "Il Campione del Cielo",
      stars: 5,
      rarityName: "Super Star",
      pedestal: "gold",
      shirtColor: "#ffffff",
      shortsColor: "#1d4480",
      hairColor: "#111115",
      skinColor: "#f5cd9d",
      headType: "shonen_wild",
      acc: "falcon",
      quote: "«Il pallone è il mio migliore amico... E vola sempre verso la porta!»",
      lore: "Scia cosmica di fuoco bianco-blu e falco dorato montato sulla caviglia.",
      bonus: "+6 Dribbling e Tiri al Volo acrobatici"
    },
    {
      id: "jojo_arrow",
      name: "Jojo «La Freccia»",
      title: "La Samba del Tigullio",
      stars: 5,
      rarityName: "Super Star",
      pedestal: "gold",
      shirtColor: "#208b3a",
      shortsColor: "#ffd23f",
      hairColor: "#1a1208",
      skinColor: "#7d4825",
      headType: "braids",
      acc: "gold_boots",
      quote: "«Se guardi i miei piedi hai già perso. Guarda la rete, la trovi lì.»",
      lore: "Scarpini dorati specchiati e bandana verdeoro che si muove al tocco.",
      bonus: "+6 Finta di corpo e accelerazione letale"
    },
    {
      id: "crane_captain",
      name: "Il Capitano Crane",
      title: "Il Corsaro del Ponente",
      stars: 5,
      rarityName: "Super Star",
      pedestal: "gold",
      shirtColor: "#111827",
      shortsColor: "#b3202c",
      hairColor: "#e5e7eb",
      skinColor: "#e5b88f",
      headType: "slick",
      acc: "sword",
      quote: "«Il campo è un mare tempestoso. E io decido dove soffia il vento.»",
      lore: "Finitura opaca deluxe con basetta in metallo pesante e stemma corsaro dorato.",
      bonus: "+5 Contrasto e carisma difensivo"
    },

    // 6★ LEGGENDE MITICHE (Basetta Arcobaleno Prisma Olografico)
    {
      id: "enzo_1982",
      name: "Papà Enzo Moretti '82",
      title: "L'Eroe della Promozione",
      stars: 6,
      rarityName: "Leggenda Mitica",
      pedestal: "rainbow",
      shirtColor: "#b3202c",
      shortsColor: "#f7f2e4",
      hairColor: "#2e190f",
      skinColor: "#deb085",
      headType: "classic_curly",
      acc: "trophy_cup",
      quote: "«Un giorno toccherà a te, Leo. Ma questo gol del 1982 è ancora nell'aria.»",
      lore: "Pezzo rarissimo numerato. Maglia di lana autentica '82, baffo iconico e Coppa della Costa d'oro massiccio alzata al cielo.",
      bonus: "+8 Grinta, +8 Tiro e aura leggendaria a tutta la squadra"
    },
    {
      id: "nonna_panda_1968",
      name: "Nonna Ferri '68 sulla Panda",
      title: "La Prima Tifosa della Costa",
      stars: 6,
      rarityName: "Leggenda Mitica",
      pedestal: "rainbow",
      shirtColor: "#ffd23f",
      shortsColor: "#1d3fa3",
      hairColor: "#ffffff",
      skinColor: "#f3cb9c",
      headType: "glasses_grandma",
      acc: "mini_panda",
      quote: "«Ho fatto tutta la statale in seconda per portarvi la focaccia e gridare GOOOL!»",
      lore: "Statuina con mini Panda 30 rossa rombante ai piedi e clacson sonoro interattivo.",
      bonus: "+15 Grinta e rigenerazione immediata dopo ogni gol subito"
    },
    {
      id: "ines_countess_1970",
      name: "Contessa Ines '70",
      title: "La Fata Madrina del Borgo",
      stars: 6,
      rarityName: "Leggenda Mitica",
      pedestal: "rainbow",
      shirtColor: "#581c87",
      shortsColor: "#3b0764",
      hairColor: "#e2e8f0",
      skinColor: "#fce7f3",
      headType: "noble_updo",
      acc: "diamond",
      quote: "«Il denaro compra i muri... Ma l'orgoglio del Borgo non è in vendita.»",
      lore: "Abito regale in velluto damascato e diadema di cristallo prismatico olografico.",
      bonus: "+20% Monete vinte in tutte le partite e sfide"
    },
    {
      id: "hero_custom_gold",
      name: "Il Tuo Campione d'Oro",
      title: "La Nuova Leggenda Consacrata",
      stars: 6,
      rarityName: "Leggenda Mitica",
      pedestal: "rainbow",
      shirtColor: "#ffd23f",
      shortsColor: "#ffffff",
      hairColor: "#2a1810",
      skinColor: "#f3cb9e",
      headType: "classic_curly",
      acc: "trophy_cup",
      quote: "«Il calcio della Riviera ha un nuovo eroe.»",
      lore: "Miniatura celebrativa intarsiata d'oro massiccio e platino prismatico che riflette il tuo campione creato!",
      bonus: "+10 a tutte le statistiche e carisma leggendario"
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
        if (d && d.owned) return d;
      }
    } catch (e) {}
    // Starter: regala 1 pupazzetto per cominciare
    const init = {
      owned: { ragazzino_molo: 1 },
      shards: 10,
      pullCount: 1,
      pity: 1
    };
    saveGachaData(init);
    return init;
  }

  function saveGachaData(d) {
    try {
      localStorage.setItem(K_DATA, JSON.stringify(d));
    } catch (e) {}
  }

  // Helper monete del gioco - Sincronizzato con il Borgo e il salvataggio principale
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
    return 0; // Se non ci sono monete sono 0, mai 30 fittizie infinite!
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

  // --- LOGICA DI PESCATA (RNG & PITY) ---
  function pullSingleToy(data) {
    data.pullCount = (data.pullCount || 0) + 1;
    data.pity = (data.pity || 0) + 1;

    let targetStar = 3;
    const r = Math.random() * 100;

    // Hard Pity a 30 tiri per 5★ o 6★ garantito!
    if (data.pity >= 30) {
      targetStar = Math.random() < 0.25 ? 6 : 5;
      data.pity = 0;
    } else if (r < 1.2) {
      targetStar = 6; // 1.2% Leggenda Mitica
      data.pity = 0;
    } else if (r < 9.0) {
      targetStar = 5; // 7.8% Super Star
      data.pity = 0;
    } else if (r < 32.0) {
      targetStar = 4; // 23% Raro
    } else {
      targetStar = 3; // 68% Comune
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
    container.innerHTML = "";

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    threeScene = new window.THREE.Scene();
    threeCamera = new window.THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    threeCamera.position.set(0, 1.2, 3.8);
    threeCamera.lookAt(0, 0.7, 0);

    threeRenderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeRenderer.toneMapping = window.THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.2;
    container.appendChild(threeRenderer.domElement);

    // Luci
    const amb = new window.THREE.AmbientLight(0xffffff, 0.9);
    threeScene.add(amb);

    const dir1 = new window.THREE.DirectionalLight(0xfff5e6, 1.8);
    dir1.position.set(2, 4, 3);
    threeScene.add(dir1);

    const dir2 = new window.THREE.DirectionalLight(0x70a5ff, 1.2);
    dir2.position.set(-3, 2, -2);
    threeScene.add(dir2);

    const rim = new window.THREE.DirectionalLight(0xffd23f, 1.5);
    rim.position.set(0, 3, -3);
    threeScene.add(rim);

    // Controlli di rotazione touch e mouse
    let isDragging = false, prevX = 0;
    const onDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };
    const onMove = (e) => {
      if (!isDragging || !toyMeshGroup) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const delta = x - prevX;
      prevX = x;
      toyMeshGroup.rotation.y += delta * 0.015;
    };
    const onUp = () => { isDragging = false; };

    container.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    container.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return true;
  }

  function build3DToyMesh(rawToy) {
    if (!threeScene || !window.THREE) return;
    const toy = resolveToy(rawToy);
    if (toyMeshGroup) threeScene.remove(toyMeshGroup);

    const T = window.THREE;
    toyMeshGroup = new T.Group();

    // 1. Basetta Esagonale da Pupazzetto Giocattolo
    let baseCol = 0x8a5a36; // bronzo
    let roughness = 0.5;
    let metalness = 0.6;
    if (toy.pedestal === "silver") { baseCol = 0xd0d5dd; metalness = 0.9; roughness = 0.2; }
    else if (toy.pedestal === "gold") { baseCol = 0xffd23f; metalness = 0.95; roughness = 0.15; }
    else if (toy.pedestal === "rainbow") { baseCol = 0xff70a6; metalness = 0.85; roughness = 0.1; }

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
    const ringMat = new T.MeshStandardMaterial({ color: 0xffe277, metalness: 0.9, roughness: 0.2 });
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
      const darkWingMat = new T.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
      const yellowBeakMat = new T.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2 });
      const orangeLegMat = new T.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
      const eyeMat = new T.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

      // Zampette arancioni
      const legGeo = new T.CylinderGeometry(0.04, 0.04, 0.45, 6);
      const legL = new T.Mesh(legGeo, orangeLegMat); legL.position.set(-0.16, 0.38, 0);
      const legR = new T.Mesh(legGeo, orangeLegMat); legR.position.set(0.16, 0.38, 0);
      const footGeo = new T.BoxGeometry(0.12, 0.04, 0.22);
      const footL = new T.Mesh(footGeo, orangeLegMat); footL.position.set(-0.16, 0.22, 0.06);
      const footR = new T.Mesh(footGeo, orangeLegMat); footR.position.set(0.16, 0.22, 0.06);
      toyMeshGroup.add(legL, legR, footL, footR);

      // Corpo da gabbiano
      const bodyGeo = new T.SphereGeometry(0.42, 14, 14);
      bodyGeo.scale(0.85, 0.95, 1.25);
      const bodyMesh = new T.Mesh(bodyGeo, birdMat);
      bodyMesh.position.set(0, 0.85, 0);
      bodyMesh.rotation.x = -0.15;
      toyMeshGroup.add(bodyMesh);

      // Coda piumata
      const tailGeo = new T.BoxGeometry(0.35, 0.06, 0.4);
      const tailMesh = new T.Mesh(tailGeo, birdMat);
      tailMesh.position.set(0, 0.9, -0.6);
      tailMesh.rotation.x = -0.3;
      toyMeshGroup.add(tailMesh);

      // Ali grigie ripiegate sui fianchi
      const wingGeo = new T.BoxGeometry(0.1, 0.35, 0.7);
      const wingL = new T.Mesh(wingGeo, greyMat); wingL.position.set(-0.36, 0.95, -0.05); wingL.rotation.y = 0.12; wingL.rotation.z = -0.1;
      const wingR = new T.Mesh(wingGeo, greyMat); wingR.position.set(0.36, 0.95, -0.05); wingR.rotation.y = -0.12; wingR.rotation.z = 0.1;
      const tipGeo = new T.BoxGeometry(0.08, 0.2, 0.3);
      const tipL = new T.Mesh(tipGeo, darkWingMat); tipL.position.set(-0.37, 0.9, -0.4);
      const tipR = new T.Mesh(tipGeo, darkWingMat); tipR.position.set(0.37, 0.9, -0.4);
      toyMeshGroup.add(wingL, wingR, tipL, tipR);

      // Testa rotonda
      const headGeo = new T.SphereGeometry(0.32, 14, 14);
      const headMesh = new T.Mesh(headGeo, birdMat);
      headMesh.position.set(0, 1.35, 0.25);
      toyMeshGroup.add(headMesh);

      // Occhietti
      const eyeGeo = new T.SphereGeometry(0.045, 8, 8);
      const eL = new T.Mesh(eyeGeo, eyeMat); eL.position.set(-0.25, 1.4, 0.35);
      const eR = new T.Mesh(eyeGeo, eyeMat); eR.position.set(0.25, 1.4, 0.35);
      toyMeshGroup.add(eL, eR);

      // Becco giallo con punta rossa
      const beakGeo = new T.ConeGeometry(0.12, 0.45, 8);
      const beakMesh = new T.Mesh(beakGeo, yellowBeakMat);
      beakMesh.rotation.x = Math.PI / 2;
      beakMesh.position.set(0, 1.32, 0.65);
      const redSpotGeo = new T.BoxGeometry(0.06, 0.06, 0.08);
      const redSpotMat = new T.MeshBasicMaterial({ color: 0xef4444 });
      const redSpot = new T.Mesh(redSpotGeo, redSpotMat);
      redSpot.position.set(0, 1.28, 0.72);
      toyMeshGroup.add(beakMesh, redSpot);

      // Focaccia ligure nel becco
      const focacciaGeo = new T.BoxGeometry(0.32, 0.05, 0.2);
      const focacciaMat = new T.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
      const focacciaMesh = new T.Mesh(focacciaGeo, focacciaMat);
      focacciaMesh.position.set(0, 1.3, 0.82);
      focacciaMesh.rotation.y = 0.25;
      toyMeshGroup.add(focacciaMesh);

      threeScene.add(toyMeshGroup);
      startToyAnimation();
      return;
    }

    // -------------------------------------------------------------
    // MODELLI UMANI: CARATTERIZZAZIONE PRECISA DI OGNI PERSONAGGIO
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

    // 2. Calzature / Scarpini / Stivali di gomma
    let bootCol = 0x111111;
    if (isFisherman) bootCol = 0xca8a04; // stivali impermeabili gialli da lupo di mare
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

    // 3. Gambe / Pantaloncini o Abito lungo
    if (!isPriest && !isCountess) {
      const sockCol = isFisherman ? 0x1e293b : (toy.id.includes("nico") ? 0x0f172a : 0xffffff);
      const legGeo = new T.CylinderGeometry(0.08, 0.08, 0.3, 8);
      const legMat = new T.MeshStandardMaterial({ color: sockCol, roughness: 0.6 });
      const lmL = new T.Mesh(legGeo, legMat); lmL.position.set(-0.25, 0.48, 0);
      const lmR = new T.Mesh(legGeo, legMat); lmR.position.set(0.25, 0.48, 0);
      toyMeshGroup.add(lmL, lmR);

      // Pantaloncini da gioco
      const shortsGeo = new T.CylinderGeometry(0.33, 0.29, 0.28, 12);
      const shortsMat = new T.MeshStandardMaterial({ color: parseInt(toy.shortsColor.replace("#", "0x")), roughness: 0.5 });
      const shortsMesh = new T.Mesh(shortsGeo, shortsMat);
      shortsMesh.position.y = 0.72;
      toyMeshGroup.add(shortsMesh);
    } else {
      // Tonaca talare per Don Aurelio o Abito nobile per Contessa
      const robeCol = isPriest ? 0x111116 : 0x581c87;
      const robeGeo = new T.CylinderGeometry(0.34, 0.52, 0.9, 16);
      const robeMat = new T.MeshStandardMaterial({ color: robeCol, roughness: 0.7 });
      const robeMesh = new T.Mesh(robeGeo, robeMat);
      robeMesh.position.y = 0.78;
      toyMeshGroup.add(robeMesh);

      if (isPriest) {
        // Colletto bianco clericale romano
        const collarGeo = new T.CylinderGeometry(0.18, 0.18, 0.08, 12);
        const collarMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const collarMesh = new T.Mesh(collarGeo, collarMat);
        collarMesh.position.y = 1.3;
        toyMeshGroup.add(collarMesh);

        // Croce pettorale d'oro
        const crossV = new T.BoxGeometry(0.04, 0.16, 0.02);
        const crossH = new T.BoxGeometry(0.11, 0.04, 0.02);
        const crossMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.9, roughness: 0.2 });
        const c1 = new T.Mesh(crossV, crossMat); c1.position.set(0, 1.12, 0.36);
        const c2 = new T.Mesh(crossH, crossMat); c2.position.set(0, 1.15, 0.36);
        toyMeshGroup.add(c1, c2);
      }
    }

    // 4. Torso / Maglietta
    const torsoGeo = new T.CylinderGeometry(0.36, 0.32, 0.46, 12);
    const shirtColorNum = parseInt(toy.shirtColor.replace("#", "0x"));
    const shirtMat = new T.MeshStandardMaterial({ color: shirtColorNum, roughness: 0.4 });
    const torsoMesh = new T.Mesh(torsoGeo, shirtMat);
    torsoMesh.position.y = 1.05;
    toyMeshGroup.add(torsoMesh);

    // Grembiule da lavoro (Nonna Rita, Tonino, Pescivendolo)
    if (isGrandma || isTonino || toy.id.includes("pescivendolo")) {
      const apronGeo = new T.BoxGeometry(0.38, 0.5, 0.04);
      const apronCol = isTonino ? 0x991b1b : (isGrandma ? 0xf8fafc : 0x0284c7);
      const apronMat = new T.MeshStandardMaterial({ color: apronCol, roughness: 0.5 });
      const apronMesh = new T.Mesh(apronGeo, apronMat);
      apronMesh.position.set(0, 0.98, 0.22);
      toyMeshGroup.add(apronMesh);

      if (isGrandma) {
        // Macchia di pesto ligure autentico
        const spotGeo = new T.SphereGeometry(0.06, 6, 6);
        spotGeo.scale(1, 1, 0.2);
        const pestoMat = new T.MeshBasicMaterial({ color: 0x15803d });
        const spotMesh = new T.Mesh(spotGeo, pestoMat);
        spotMesh.position.set(0.08, 0.98, 0.25);
        toyMeshGroup.add(spotMesh);
      }
    }

    // Stemma / Numero 10 sul petto per i capitani
    if (isLeo || isEnzo || isTsubasa) {
      const numGeo = new T.BoxGeometry(0.18, 0.18, 0.02);
      const numMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const numMesh = new T.Mesh(numGeo, numMat);
      numMesh.position.set(0, 1.08, 0.35);
      toyMeshGroup.add(numMesh);
    }

    // Fascia da capitano giallo oro in rilievo
    if (isLeo || isDario || isEnzo) {
      const bandGeo = new T.CylinderGeometry(0.085, 0.085, 0.1, 10);
      const bandMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.8, roughness: 0.2 });
      const bandMesh = new T.Mesh(bandGeo, bandMat);
      bandMesh.position.set(-0.46, 1.05, 0);
      toyMeshGroup.add(bandMesh);
    }

    // 5. Braccia
    const armGeo = new T.CylinderGeometry(0.07, 0.07, 0.38, 8);
    const armMat = new T.MeshStandardMaterial({ color: shirtColorNum, roughness: 0.5 });
    const armL = new T.Mesh(armGeo, armMat);
    const armR = new T.Mesh(armGeo, armMat);

    if (isEnzo && toy.acc === "trophy_cup") {
      // Braccia alzate verso il cielo che stringono la coppa
      armL.position.set(-0.42, 1.25, 0); armL.rotation.z = 2.4;
      armR.position.set(0.42, 1.25, 0); armR.rotation.z = -2.4;
    } else {
      armL.position.set(-0.46, 1.02, 0); armL.rotation.z = 0.35;
      armR.position.set(0.46, 1.02, 0); armR.rotation.z = -0.35;
    }
    toyMeshGroup.add(armL, armR);

    // Mani o Guantoni
    const skinNum = parseInt(toy.skinColor.replace("#", "0x"));
    const handGeo = isNico ? new T.BoxGeometry(0.18, 0.18, 0.12) : new T.SphereGeometry(0.1, 8, 8);
    const handMat = new T.MeshStandardMaterial({
      color: isNico ? 0xf59e0b : skinNum,
      roughness: isNico ? 0.3 : 0.6
    });
    const hL = new T.Mesh(handGeo, handMat);
    const hR = new T.Mesh(handGeo, handMat);
    if (isEnzo && toy.acc === "trophy_cup") {
      hL.position.set(-0.25, 1.45, 0);
      hR.position.set(0.25, 1.45, 0);
    } else {
      hL.position.set(-0.55, 0.85, 0);
      hR.position.set(0.55, 0.85, 0);
    }
    toyMeshGroup.add(hL, hR);

    // 6. Testa
    const headGeo = new T.SphereGeometry(0.44, 16, 16);
    const headMat = new T.MeshStandardMaterial({ color: skinNum, roughness: 0.45 });
    const headMesh = new T.Mesh(headGeo, headMat);
    headMesh.position.y = 1.55;
    toyMeshGroup.add(headMesh);

    // Occhi stile collezionabile
    const eyeGeo = new T.SphereGeometry(0.06, 8, 8);
    const eyeMat = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const eyeL = new T.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.16, 1.56, 0.4);
    const eyeR = new T.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.16, 1.56, 0.4);
    toyMeshGroup.add(eyeL, eyeR);

    // Sorriso
    const smileGeo = new T.TorusGeometry(0.08, 0.02, 6, 12, Math.PI);
    const smileMat = new T.MeshBasicMaterial({ color: 0x4a1e12 });
    const smileMesh = new T.Mesh(smileGeo, smileMat);
    smileMesh.position.set(0, 1.44, 0.42);
    smileMesh.rotation.z = Math.PI;
    toyMeshGroup.add(smileMesh);

    // -------------------------------------------------------------
    // ACCONCIATURE & COPRICAPI SU MISURA
    // -------------------------------------------------------------
    const hairColorNum = parseInt(toy.hairColor.replace("#", "0x"));
    const hairMat = new T.MeshStandardMaterial({ color: hairColorNum, roughness: 0.7 });

    if (isFisherman) {
      // Berretto in lana da marinaio ligure con risvolto
      const capGeo = new T.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const capMat = new T.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
      const capMesh = new T.Mesh(capGeo, capMat);
      capMesh.position.y = 1.68;
      const brimGeo = new T.TorusGeometry(0.46, 0.08, 8, 20);
      const brimMesh = new T.Mesh(brimGeo, capMat);
      brimMesh.rotation.x = Math.PI / 2;
      brimMesh.position.y = 1.66;
      toyMeshGroup.add(capMesh, brimMesh);

      // Barba folta marinara grigia che incornicia la mascella
      const beardGeo = new T.TorusGeometry(0.38, 0.12, 8, 16, Math.PI * 0.85);
      const beardMat = new T.MeshStandardMaterial({ color: hairColorNum, roughness: 0.8 });
      const beardMesh = new T.Mesh(beardGeo, beardMat);
      beardMesh.rotation.x = Math.PI / 2;
      beardMesh.position.set(0, 1.48, 0.12);
      toyMeshGroup.add(beardMesh);
    } else if (isPriest) {
      // Chierica da parroco con corona di capelli bianchi
      const tonsureGeo = new T.TorusGeometry(0.42, 0.09, 8, 16, Math.PI * 1.2);
      const tonsureMat = new T.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
      const tonsureMesh = new T.Mesh(tonsureGeo, tonsureMat);
      tonsureMesh.rotation.x = 2.2;
      tonsureMesh.position.set(0, 1.6, -0.05);
      toyMeshGroup.add(tonsureMesh);
    } else if (isGrandma) {
      // Chignon di Nonna
      const hairGeo = new T.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hairMesh = new T.Mesh(hairGeo, hairMat);
      hairMesh.position.y = 1.62;
      const bunGeo = new T.SphereGeometry(0.24, 12, 12);
      const bunMesh = new T.Mesh(bunGeo, hairMat);
      bunMesh.position.set(0, 1.9, -0.2);
      toyMeshGroup.add(hairMesh, bunMesh);

      // Occhiali da vista cerchiati dorati
      const glassesFrameMat = new T.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
      const lensGeo = new T.TorusGeometry(0.09, 0.015, 6, 16);
      const lensL = new T.Mesh(lensGeo, glassesFrameMat); lensL.position.set(-0.16, 1.56, 0.44);
      const lensR = new T.Mesh(lensGeo, glassesFrameMat); lensR.position.set(0.16, 1.56, 0.44);
      const bridgeGeo = new T.BoxGeometry(0.08, 0.015, 0.015);
      const bridge = new T.Mesh(bridgeGeo, glassesFrameMat); bridge.position.set(0, 1.56, 0.44);
      toyMeshGroup.add(lensL, lensR, bridge);
    } else if (isTommy) {
      // Afro volumoso biondo/dorato
      const afroGeo = new T.SphereGeometry(0.62, 14, 14);
      const afroMat = new T.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.9 });
      const afroMesh = new T.Mesh(afroGeo, afroMat);
      afroMesh.position.set(0, 1.72, -0.05);
      toyMeshGroup.add(afroMesh);
    } else if (isNico) {
      // Capelli arancioni ribelli e spettinati
      const nicoHairGeo = new T.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const nicoHairMat = new T.MeshStandardMaterial({ color: 0xff7a22, roughness: 0.7 });
      const nicoHairMesh = new T.Mesh(nicoHairGeo, nicoHairMat);
      nicoHairMesh.position.y = 1.62;
      toyMeshGroup.add(nicoHairMesh);

      for (let i = 0; i < 5; i++) {
        const spikeGeo = new T.ConeGeometry(0.12, 0.28, 6);
        const spike = new T.Mesh(spikeGeo, nicoHairMat);
        spike.position.set((i - 2) * 0.14, 1.95, 0.2 - Math.abs(i - 2) * 0.05);
        spike.rotation.x = 0.3;
        spike.rotation.z = -(i - 2) * 0.2;
        toyMeshGroup.add(spike);
      }

      if (toy.headType === "cat_ears" || toy.id.includes("flying_cat")) {
        const earMat = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
        const earGeo = new T.ConeGeometry(0.14, 0.3, 4);
        const earL = new T.Mesh(earGeo, earMat); earL.position.set(-0.32, 2.05, 0.05); earL.rotation.z = 0.3;
        const earR = new T.Mesh(earGeo, earMat); earR.position.set(0.32, 2.05, 0.05); earR.rotation.z = -0.3;
        toyMeshGroup.add(earL, earR);

        const tailGeo = new T.TorusGeometry(0.3, 0.05, 6, 16, Math.PI * 0.75);
        const tailMesh = new T.Mesh(tailGeo, earMat);
        tailMesh.position.set(0.1, 0.75, -0.4);
        tailMesh.rotation.y = Math.PI / 2;
        toyMeshGroup.add(tailMesh);
      }
    } else if (isSara) {
      // Coda di cavallo e occhiali rettangolari
      const hairGeo = new T.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hairMesh = new T.Mesh(hairGeo, hairMat);
      hairMesh.position.y = 1.62;
      const ponyGeo = new T.CylinderGeometry(0.08, 0.14, 0.45, 8);
      const ponyMesh = new T.Mesh(ponyGeo, hairMat);
      ponyMesh.position.set(0, 1.55, -0.55);
      ponyMesh.rotation.x = -0.7;
      toyMeshGroup.add(hairMesh, ponyMesh);

      const frameMat = new T.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
      const gBox = new T.BoxGeometry(0.42, 0.1, 0.02);
      const gMesh = new T.Mesh(gBox, frameMat);
      gMesh.position.set(0, 1.56, 0.43);
      toyMeshGroup.add(gMesh);
    } else if (isTsubasa) {
      // Acconciatura shonen ad aculei
      const baseHair = new T.SphereGeometry(0.48, 14, 14);
      const tsubasaMat = new T.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 });
      const baseMesh = new T.Mesh(baseHair, tsubasaMat);
      baseMesh.position.set(0, 1.62, -0.05);
      toyMeshGroup.add(baseMesh);

      const spikeData = [
        [-0.35, 1.85, -0.2, 0.8, -0.6],
        [0.35, 1.85, -0.2, 0.8, 0.6],
        [0, 2.05, -0.25, 0.9, 0],
        [-0.45, 1.55, -0.1, 0.2, -0.8],
        [0.45, 1.55, -0.1, 0.2, 0.8],
        [0, 1.9, 0.35, -0.6, 0]
      ];
      spikeData.forEach(([x, y, z, rx, rz]) => {
        const spGeo = new T.ConeGeometry(0.18, 0.45, 6);
        const spMesh = new T.Mesh(spGeo, tsubasaMat);
        spMesh.position.set(x, y, z);
        spMesh.rotation.x = rx;
        spMesh.rotation.z = rz;
        toyMeshGroup.add(spMesh);
      });
    } else if (isEnzo || isTonino || toy.headType === "mustache") {
      // Baffo iconico anni '80
      const stacheGeo = new T.BoxGeometry(0.24, 0.07, 0.05);
      const stacheMat = new T.MeshStandardMaterial({ color: hairColorNum, roughness: 0.8 });
      const stacheMesh = new T.Mesh(stacheGeo, stacheMat);
      stacheMesh.position.set(0, 1.48, 0.43);
      toyMeshGroup.add(stacheMesh);

      const hairGeo = new T.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hairMesh = new T.Mesh(hairGeo, hairMat);
      hairMesh.position.y = 1.62;
      toyMeshGroup.add(hairMesh);
    } else {
      // Capelli classici sagomati con ciuffo
      const hairGeo = new T.SphereGeometry(0.48, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hairMesh = new T.Mesh(hairGeo, hairMat);
      hairMesh.position.y = 1.62;
      const tuftGeo = new T.ConeGeometry(0.18, 0.32, 8);
      const tuftMesh = new T.Mesh(tuftGeo, hairMat);
      tuftMesh.rotation.x = Math.PI / 3;
      tuftMesh.position.set(0, 1.88, 0.35);
      toyMeshGroup.add(hairMesh, tuftMesh);
    }

    // -------------------------------------------------------------
    // ACCESSORI CARATTERISTICI FEDELI
    // -------------------------------------------------------------
    if (toy.acc === "wings" || isLeo) {
      // Ali di Rondine Dorate
      const wingMat = new T.MeshStandardMaterial({
        color: 0xffd23f,
        metalness: 0.85,
        roughness: 0.15,
        transparent: true,
        opacity: 0.88
      });
      const wingL = new T.BoxGeometry(0.85, 0.32, 0.04);
      const wMeshL = new T.Mesh(wingL, wingMat);
      wMeshL.position.set(-0.65, 1.25, -0.28);
      wMeshL.rotation.y = 0.45;
      wMeshL.rotation.z = 0.25;

      const wingR = new T.BoxGeometry(0.85, 0.32, 0.04);
      const wMeshR = new T.Mesh(wingR, wingMat);
      wMeshR.position.set(0.65, 1.25, -0.28);
      wMeshR.rotation.y = -0.45;
      wMeshR.rotation.z = -0.25;
      toyMeshGroup.add(wMeshL, wMeshR);

      // Pallone ai piedi
      const ballGeo = new T.SphereGeometry(0.24, 12, 12);
      const ballMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      const ballMesh = new T.Mesh(ballGeo, ballMat);
      ballMesh.position.set(0.48, 0.32, 0.28);
      toyMeshGroup.add(ballMesh);
    } else if (toy.acc === "trophy_cup" || isEnzo) {
      // Coppa d'Oro Storica
      const cupMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.95, roughness: 0.1 });
      const cupBody = new T.CylinderGeometry(0.28, 0.14, 0.45, 14);
      const cupMesh = new T.Mesh(cupBody, cupMat);
      const cupBase = new T.CylinderGeometry(0.2, 0.22, 0.12, 12);
      const cupBaseMesh = new T.Mesh(cupBase, cupMat);
      cupBaseMesh.position.y = -0.25;
      cupMesh.add(cupBaseMesh);

      const handleGeo = new T.TorusGeometry(0.16, 0.03, 6, 12, Math.PI);
      const hL = new T.Mesh(handleGeo, cupMat); hL.position.set(-0.28, 0.05, 0); hL.rotation.z = Math.PI / 2;
      const hR = new T.Mesh(handleGeo, cupMat); hR.position.set(0.28, 0.05, 0); hR.rotation.z = -Math.PI / 2;
      cupMesh.add(hL, hR);

      if (isEnzo) {
        cupMesh.position.set(0, 1.82, 0.08);
      } else {
        cupMesh.position.set(0.55, 1.15, 0.28);
      }
      toyMeshGroup.add(cupMesh);
    } else if (toy.acc === "icecream" || (isNico && toy.id.includes("gelato"))) {
      // Gelato pistacchio e limone
      const coneGeo = new T.ConeGeometry(0.1, 0.35, 8);
      const coneMat = new T.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
      const coneMesh = new T.Mesh(coneGeo, coneMat);
      coneMesh.rotation.x = Math.PI;
      coneMesh.position.set(0.65, 0.9, 0.25);

      const scoopPistacchio = new T.SphereGeometry(0.12, 8, 8);
      const pistacchioMat = new T.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.5 });
      const s1 = new T.Mesh(scoopPistacchio, pistacchioMat); s1.position.y = -0.2;
      coneMesh.add(s1);

      const scoopLimone = new T.SphereGeometry(0.1, 8, 8);
      const limoneMat = new T.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5 });
      const s2 = new T.Mesh(scoopLimone, limoneMat); s2.position.set(0, -0.32, 0.04);
      coneMesh.add(s2);

      toyMeshGroup.add(coneMesh);
    } else if (toy.acc === "coffee" || isTonino) {
      // Caffè espresso
      const saucerGeo = new T.CylinderGeometry(0.16, 0.14, 0.03, 10);
      const ceramicMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const saucer = new T.Mesh(saucerGeo, ceramicMat);
      saucer.position.set(0.55, 0.88, 0.25);

      const cupGeo = new T.CylinderGeometry(0.09, 0.07, 0.12, 10);
      const cup = new T.Mesh(cupGeo, ceramicMat);
      cup.position.y = 0.08;
      saucer.add(cup);

      const coffeeLiquid = new T.CylinderGeometry(0.08, 0.08, 0.02, 8);
      const coffeeMat = new T.MeshBasicMaterial({ color: 0x3d1c06 });
      const cLiq = new T.Mesh(coffeeLiquid, coffeeMat);
      cLiq.position.y = 0.13;
      saucer.add(cLiq);

      toyMeshGroup.add(saucer);
    } else if (toy.acc === "pipe" || isFisherman) {
      // Pipa marinara in radica
      const pipeBowl = new T.CylinderGeometry(0.05, 0.04, 0.1, 8);
      const pipeMat = new T.MeshStandardMaterial({ color: 0x5c2c16, roughness: 0.4 });
      const pMesh = new T.Mesh(pipeBowl, pipeMat);
      pMesh.position.set(0.25, 1.45, 0.45);
      const stemGeo = new T.CylinderGeometry(0.02, 0.02, 0.14, 6);
      const stem = new T.Mesh(stemGeo, pipeMat);
      stem.rotation.x = Math.PI / 3;
      stem.position.set(-0.04, -0.02, -0.05);
      pMesh.add(stem);
      toyMeshGroup.add(pMesh);
    } else if (toy.acc === "bell" || isPriest) {
      // Campanella d'ottone di Don Aurelio
      const bellGeo = new T.CylinderGeometry(0.05, 0.14, 0.2, 10);
      const bellMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.9, roughness: 0.15 });
      const bellMesh = new T.Mesh(bellGeo, bellMat);
      bellMesh.position.set(0.55, 0.85, 0.25);
      const handleGeo = new T.CylinderGeometry(0.025, 0.025, 0.12, 6);
      const hMesh = new T.Mesh(handleGeo, new T.MeshStandardMaterial({ color: 0x3d1c06 }));
      hMesh.position.y = 0.15;
      bellMesh.add(hMesh);
      toyMeshGroup.add(bellMesh);
    } else if (toy.acc === "tablet" || isSara) {
      // Tablet tattico verde
      const tabGeo = new T.BoxGeometry(0.32, 0.22, 0.02);
      const tabMat = new T.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const tabMesh = new T.Mesh(tabGeo, tabMat);
      tabMesh.position.set(0.5, 0.95, 0.28);
      tabMesh.rotation.x = -0.4;
      tabMesh.rotation.y = -0.3;

      const screenGeo = new T.BoxGeometry(0.28, 0.18, 0.01);
      const screenMat = new T.MeshBasicMaterial({ color: 0x22c55e });
      const screenMesh = new T.Mesh(screenGeo, screenMat);
      screenMesh.position.z = 0.015;
      tabMesh.add(screenMesh);
      toyMeshGroup.add(tabMesh);
    } else if (toy.acc === "mini_panda" || toy.id.includes("panda")) {
      // Mini Panda 30 rossa ai piedi
      const pandaGroup = new T.Group();
      const carBody = new T.BoxGeometry(0.5, 0.24, 0.32);
      const carMat = new T.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6, roughness: 0.3 });
      const bodyM = new T.Mesh(carBody, carMat);
      bodyM.position.y = 0.16;
      pandaGroup.add(bodyM);

      const cabGeo = new T.BoxGeometry(0.32, 0.18, 0.3);
      const cabMat = new T.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
      const cabM = new T.Mesh(cabGeo, cabMat);
      cabM.position.set(-0.04, 0.34, 0);
      pandaGroup.add(cabM);

      const wheelGeo = new T.CylinderGeometry(0.08, 0.08, 0.06, 8);
      const wheelMat = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
      [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].forEach(([wx, wz]) => {
        const w = new T.Mesh(wheelGeo, wheelMat);
        w.rotation.x = Math.PI / 2;
        w.position.set(wx, 0.08, wz);
        pandaGroup.add(w);
      });

      const headlightGeo = new T.SphereGeometry(0.04, 6, 6);
      const hlMat = new T.MeshBasicMaterial({ color: 0xfef08a });
      const hl1 = new T.Mesh(headlightGeo, hlMat); hl1.position.set(0.25, 0.18, -0.1);
      const hl2 = new T.Mesh(headlightGeo, hlMat); hl2.position.set(0.25, 0.18, 0.1);
      pandaGroup.add(hl1, hl2);

      pandaGroup.position.set(0.5, 0.22, 0.25);
      pandaGroup.rotation.y = -0.6;
      toyMeshGroup.add(pandaGroup);
    } else {
      // Default: Pallone da calcio classico
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
            <div style="font-size:11px; color:#9cb5db;">Mini-Leggende & Pupazzetti della Costa 3D</div>
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
        <div style="display:flex; align-items:center; gap:5px;">
          <span>🧩 Frammenti:</span>
          <b id="gachaShardsCount" style="color:#57d68d; font-size:14px;">0</b>
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
          <button type="button" id="gachaCabinetBtn" style="flex:1; background:#1e293b; color:#cbd5e1; border:1px solid #475569; border-radius:6px; padding:8px; font-size:12px; font-weight:bold; cursor:pointer;">
            🧸 Vetrinetta Collezione (<span id="gachaOwnedCount">0/24</span>)
          </button>
          <button type="button" id="gachaRatesBtn" style="flex:1; background:#1e293b; color:#cbd5e1; border:1px solid #475569; border-radius:6px; padding:8px; font-size:12px; font-weight:bold; cursor:pointer;">
            📊 Rarità & Info Banner
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
    gachaModalEl.querySelector("#gachaRatesBtn").onclick = () => showRatesInfo();

    return gachaModalEl;
  }

  // Disegno 2D della Macchinetta Gashapon
  let crankAngle = 0;
  let isCranking = false;

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

    // Interno campana
    const glassGrad = g.createRadialGradient(cx - 25, cy - 25, 10, cx, cy, r);
    glassGrad.addColorStop(0, "#60a5fa44");
    glassGrad.addColorStop(0.8, "#1e3a8a33");
    glassGrad.addColorStop(1, "#0f172a66");
    g.fillStyle = glassGrad;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Palline colorate gashapon all'interno
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

      // Metà superiore bianca della capsula
      g.fillStyle = "rgba(255,255,255,0.7)";
      g.beginPath();
      g.arc(bx, by, 12, Math.PI, Math.PI * 2);
      g.fill();

      // Riflesso lucido
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.beginPath();
      g.arc(bx - 3, by - 3, 3, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    // Bordo e riflesso di vetro
    g.strokeStyle = "rgba(255,255,255,0.6)";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();

    // Riflesso curvo bianco sulla campana
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 4;
    g.beginPath();
    g.arc(cx, cy, r - 6, Math.PI * 1.05, Math.PI * 1.55);
    g.stroke();

    // Coperchio superiore cromato
    g.fillStyle = "#cbd5e1";
    g.beginPath();
    g.roundRect(cx - 50, cy - r - 12, 100, 16, [6, 6, 0, 0]);
    g.fill();
    g.fillStyle = "#94a3b8";
    g.beginPath();
    g.arc(cx, cy - r - 12, 8, 0, Math.PI * 2);
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

    // Mozzo centrale
    g.fillStyle = "#64748b";
    g.beginPath(); g.arc(0, 0, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#cbd5e1";
    g.beginPath(); g.arc(0, 0, 9, 0, Math.PI * 2); g.fill();

    // Bracci della manovella (a farfalla / croce)
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

    // Sportellino trasparente sollevabile
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

    // Animazione rotazione manovella
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
        // Se è multi 10x e l'ultimo non è ancora almeno 4★, garantiscilo!
        if (count === 10 && i === 9 && !results.some((r) => r.toy.stars >= 4)) {
          data.pity = 30; // forza il tiro
        }
        results.push(pullSingleToy(data));
      }

      updateHeaderCounters();
      isPulling = false;

      // Mostra schermata rivelazione
      showPullRevealModal(results);
    }
  }

  // --- MODALE RIVELAZIONE DELLA STATUINA 3D ---
  let revealModalEl = null;

  function showPullRevealModal(results) {
    if (!revealModalEl) {
      revealModalEl = document.createElement("div");
      revealModalEl.id = "gachaRevealModal";
      revealModalEl.style.cssText = `
        position: fixed; inset: 0; z-index: 1000000;
        background: rgba(3, 7, 18, 0.95); backdrop-filter: blur(10px);
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        padding: 16px; box-sizing: border-box; font-family: var(--body, system-ui, sans-serif); color: #fff;
      `;
      document.body.appendChild(revealModalEl);
    }

    revealModalEl.style.display = "flex";

    // Mostra uno per uno o griglia
    let currentIndex = 0;

    function renderCurrentToy() {
      const item = results[currentIndex];
      const toy = item.toy;

      // Effetto coriandoli se 5★ o 6★!
      if (toy.stars >= 5) {
        try {
          if (window.triggerTrophyCelebration) window.triggerTrophyCelebration();
          else if (window.triggerGoalCelebration) window.triggerGoalCelebration(true);
        } catch (e) {}
      }

      const starIcons = "★".repeat(toy.stars);
      const starColor = toy.stars === 6 ? "#ff70a6" : toy.stars === 5 ? "#ffd23f" : toy.stars === 4 ? "#60a5fa" : "#cd7f32";

      revealModalEl.innerHTML = `
        <!-- Header -->
        <div style="width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 13px; color: #94a3b8;">
            Capsula ${currentIndex + 1} di ${results.length}
          </div>
          <div style="font-size: 18px; color: ${starColor}; text-shadow: 0 0 10px ${starColor}; font-weight: bold;">
            ${starIcons} ${toy.rarityName.toUpperCase()}
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
        <div style="width: 100%; max-width: 420px; background: rgba(30, 41, 59, 0.7); border: 1.5px solid ${starColor}66; border-radius: 12px; padding: 12px; box-sizing: border-box; text-align: center;">
          <div style="font-size: 18px; font-weight: 900; color: #fff; font-family: var(--display, sans-serif);">${toy.name}</div>
          <div style="font-size: 12px; color: var(--gold, #ffd23f); font-weight: bold; margin-bottom: 4px;">${toy.title}</div>
          <div style="font-size: 12px; font-style: italic; color: #cbd5e1; margin-bottom: 6px;">${toy.quote}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">${toy.lore}</div>
          <div style="font-size: 12px; font-weight: bold; color: #4ade80;">✨ Effetto: ${toy.bonus}</div>

          ${item.isDuplicate ? `
            <div style="margin-top: 8px; font-size: 11px; background: rgba(234, 179, 8, 0.2); border: 1px dashed #eab308; border-radius: 6px; padding: 4px 8px; color: #fde047;">
              ♻️ Doppione convertito in: <b>+${item.shardReward} Frammenti di Plastica Pregiata</b>
            </div>
          ` : `
            <div style="margin-top: 8px; font-size: 11px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; border-radius: 6px; padding: 4px 8px; color: #86efac;">
              🎉 NUOVO GIOCATTOLO AGGIUNTO ALLA TUA COLLEZIONE!
            </div>
          `}
        </div>

        <!-- Tasti avanti / chiudi -->
        <div style="width: 100%; max-width: 420px; display: flex; gap: 10px; margin-top: 10px;">
          ${currentIndex < results.length - 1 ? `
            <button type="button" id="gachaNextBtn" style="flex:1; background:linear-gradient(180deg, #2563eb, #1d4ed8); color:#fff; border:1.5px solid #60a5fa; border-radius:8px; padding:12px; font-size:14px; font-weight:bold; cursor:pointer;">
              Prossima Capsula ▸
            </button>
          ` : `
            <button type="button" id="gachaDoneBtn" style="flex:1; background:linear-gradient(180deg, #16a34a, #15803d); color:#fff; border:1.5px solid #4ade80; border-radius:8px; padding:12px; font-size:14px; font-weight:bold; cursor:pointer;">
              ✓ Ritiro Completato
            </button>
          `}
        </div>
      `;

      // Inizializza Three.js sul contenitore
      const c = document.getElementById("toy3DContainer");
      if (c && initThreeForToy(c)) {
        build3DToyMesh(toy);
      }

      // Eventi
      const nextBtn = document.getElementById("gachaNextBtn");
      if (nextBtn) {
        nextBtn.onclick = () => {
          currentIndex++;
          renderCurrentToy();
        };
      }

      const doneBtn = document.getElementById("gachaDoneBtn");
      if (doneBtn) {
        doneBtn.onclick = () => {
          revealModalEl.style.display = "none";
          if (threeAnimId) cancelAnimationFrame(threeAnimId);
          updateHeaderCounters();
        };
      }
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
      <div style="width: 100%; max-width: 480px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid rgba(255,255,255,0.15); padding-bottom: 8px;">
        <div>
          <div style="font-size:16px; font-weight:900; color:var(--gold, #ffd23f);">🧸 VETRINETTA DEI PUPAZZETTI</div>
          <div style="font-size:11px; color:#c7a685;">Collezione Mini-Leggende: ${ownedCount} su ${TOY_CATALOG.length} raccolti</div>
        </div>
        <button type="button" id="cabinetCloseBtn" style="background:#b3202c; color:#fff; border:1px solid #ff4d5a; border-radius:6px; padding:6px 12px; font-size:12px; font-weight:bold; cursor:pointer;">✕ Chiudi</button>
      </div>

      <!-- Mensole in legno da collezione -->
      <div style="width: 100%; max-width: 480px; flex: 1; margin: 12px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; overflow-y: auto; padding: 6px;">
        ${TOY_CATALOG.map((rawToy) => {
          const toy = resolveToy(rawToy);
          const count = data.owned[toy.id] || 0;
          const isOwned = count > 0;
          const starColor = toy.stars === 6 ? "#ff70a6" : toy.stars === 5 ? "#ffd23f" : toy.stars === 4 ? "#60a5fa" : "#cd7f32";

          return `
            <div class="cabinet-toy-slot" data-id="${toy.id}" style="background: ${isOwned ? "rgba(40, 25, 18, 0.85)" : "rgba(15, 12, 10, 0.7)"}; border: 1.5px solid ${isOwned ? starColor : "#4a3528"}; border-radius: 10px; padding: 8px 4px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; cursor: ${isOwned ? "pointer" : "default"}; box-shadow: 0 4px 8px rgba(0,0,0,0.5); position: relative; min-height: 120px;">
              <div style="font-size: 10px; color: ${starColor}; font-weight: bold;">
                ${"★".repeat(toy.stars)}
              </div>
              <div style="font-size: ${isOwned ? "34px" : "28px"}; filter: ${isOwned ? "drop-shadow(0 4px 6px rgba(0,0,0,0.6))" : "grayscale(1) brightness(0.2)"}; margin: 4px 0;">
                ${isOwned ? (toy.stars >= 5 ? "🏆" : "⚽") : "🔒"}
              </div>
              <div style="font-size: 11px; font-weight: bold; text-align: center; color: ${isOwned ? "#fff" : "#785b46"}; line-height: 1.2;">
                ${isOwned ? toy.name : "???"}
              </div>
              <div style="font-size: 9px; color: ${isOwned ? "#ffd23f" : "#554030"}; margin-top: 2px;">
                ${isOwned ? (count > 1 ? `${count} copie` : "1 copia") : "Non trovato"}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <!-- Footer Info -->
      <div style="width: 100%; max-width: 480px; font-size: 11px; color: #a88a6d; text-align: center;">
        Tocca una statuina sbloccata per ispezionarla in 3D a 360° con i suoi dettagli!
      </div>
    `;

    // Chiudi
    cabinetModalEl.querySelector("#cabinetCloseBtn").onclick = () => {
      cabinetModalEl.style.display = "none";
    };

    // Click su statuina posseduta
    cabinetModalEl.querySelectorAll(".cabinet-toy-slot").forEach((el) => {
      el.onclick = () => {
        const id = el.getAttribute("data-id");
        if (data.owned[id]) {
          const toy = resolveToy(TOY_CATALOG.find((t) => t.id === id));
          if (toy) {
            showPullRevealModal([{ toy, isDuplicate: false, shardReward: 0 }]);
          }
        } else {
          if (window.toast) window.toast("Statuina non ancora trovata nel distributore!", "warn", "🔒");
        }
      };
    });
  }

  // Info Rarità
  function showRatesInfo() {
    alert(
      "🎰 PROBABILITÀ DEL GASHAPON DEL BAR MORETTI:\n\n" +
      "• 3★ COMUNI (Bronzo): 68.0%\n" +
      "• 4★ RARI (Argento Cromato): 23.0%\n" +
      "• 5★ SUPER STAR (Oro Foil): 7.8%\n" +
      "• 6★ LEGGENDE MITICHE (Arcobaleno Olografico): 1.2%\n\n" +
      "✨ PITY GARANTITO: Al 30° tiro consecutivo senza 5★/6★, la prossima capsula conterrà al 100% una Super Star o una Leggenda!\n\n" +
      "🪙 Multi-pescata (10x): Garantisce sempre almeno un pupazzetto 4★ Raro o superiore!"
    );
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

  console.log("✓ Modalità Gacha (Pupazzetti 3D del Bar Moretti) caricata con successo");
})();
