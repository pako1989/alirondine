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

  // Helper monete del gioco
  function getUserCoins() {
    try {
      if (typeof window.coins === "function") return window.coins();
      const raw = localStorage.getItem("ali-di-rondine.monete");
      if (raw) return parseInt(raw, 10) || 0;
    } catch (e) {}
    return 30; // Minimo per provare subito se nuovo salvataggio
  }

  function deductUserCoins(amount) {
    try {
      if (typeof window.addCoins === "function") {
        window.addCoins(-amount);
        return true;
      }
      const cur = getUserCoins();
      localStorage.setItem("ali-di-rondine.monete", Math.max(0, cur - amount));
      return true;
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

    const baseGeo = new T.CylinderGeometry(0.85, 0.95, 0.22, 8);
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
    const ringGeo = new T.TorusGeometry(0.88, 0.03, 8, 24);
    const ringMat = new T.MeshStandardMaterial({ color: 0xffe277, metalness: 0.9, roughness: 0.2 });
    const ringMesh = new T.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.22;
    toyMeshGroup.add(ringMesh);

    // 2. Scarpini Giocattolo
    const bootGeo = new T.BoxGeometry(0.18, 0.12, 0.32);
    const bootMat = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });
    const bL = new T.Mesh(bootGeo, bootMat); bL.position.set(-0.25, 0.28, 0.05);
    const bR = new T.Mesh(bootGeo, bootMat); bR.position.set(0.25, 0.28, 0.05);
    toyMeshGroup.add(bL, bR);

    // 3. Gambe / Calzettoni
    const legGeo = new T.CylinderGeometry(0.08, 0.08, 0.3, 8);
    const legMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const lmL = new T.Mesh(legGeo, legMat); lmL.position.set(-0.25, 0.48, 0);
    const lmR = new T.Mesh(legGeo, legMat); lmR.position.set(0.25, 0.48, 0);
    toyMeshGroup.add(lmL, lmR);

    // 4. Pantaloncini
    const shortsGeo = new T.CylinderGeometry(0.32, 0.28, 0.26, 12);
    const shortsMat = new T.MeshStandardMaterial({ color: parseInt(toy.shortsColor.replace("#", "0x")), roughness: 0.5 });
    const shortsMesh = new T.Mesh(shortsGeo, shortsMat);
    shortsMesh.position.y = 0.72;
    toyMeshGroup.add(shortsMesh);

    // 5. Torso / Maglietta
    const torsoGeo = new T.CylinderGeometry(0.36, 0.32, 0.46, 12);
    const shirtMat = new T.MeshStandardMaterial({ color: parseInt(toy.shirtColor.replace("#", "0x")), roughness: 0.4 });
    const torsoMesh = new T.Mesh(torsoGeo, shirtMat);
    torsoMesh.position.y = 1.05;
    toyMeshGroup.add(torsoMesh);

    // Numero di maglia o stemma sul petto (piccolo cubo smussato bianco)
    const numGeo = new T.BoxGeometry(0.16, 0.16, 0.02);
    const numMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const numMesh = new T.Mesh(numGeo, numMat);
    numMesh.position.set(0, 1.08, 0.35);
    toyMeshGroup.add(numMesh);

    // 6. Braccia e Mani Giocattolo
    const armGeo = new T.CylinderGeometry(0.07, 0.07, 0.38, 8);
    const armMat = new T.MeshStandardMaterial({ color: parseInt(toy.shirtColor.replace("#", "0x")), roughness: 0.5 });
    const armL = new T.Mesh(armGeo, armMat);
    armL.position.set(-0.46, 1.02, 0);
    armL.rotation.z = 0.35;
    const armR = new T.Mesh(armGeo, armMat);
    armR.position.set(0.46, 1.02, 0);
    armR.rotation.z = -0.35;
    toyMeshGroup.add(armL, armR);

    // Guanti o mani in carne
    const handGeo = new T.SphereGeometry(0.1, 8, 8);
    const handMat = new T.MeshStandardMaterial({
      color: toy.acc === "gloves" || toy.id.includes("nico") ? 0xffd23f : parseInt(toy.skinColor.replace("#", "0x")),
      roughness: 0.6
    });
    const hL = new T.Mesh(handGeo, handMat); hL.position.set(-0.55, 0.85, 0);
    const hR = new T.Mesh(handGeo, handMat); hR.position.set(0.55, 0.85, 0);
    toyMeshGroup.add(hL, hR);

    // 7. Grande Testa Stile Pupazzetto / Chibi
    const headGeo = new T.SphereGeometry(0.44, 16, 16);
    const headMat = new T.MeshStandardMaterial({ color: parseInt(toy.skinColor.replace("#", "0x")), roughness: 0.45 });
    const headMesh = new T.Mesh(headGeo, headMat);
    headMesh.position.y = 1.55;
    toyMeshGroup.add(headMesh);

    // Capelli sagomati
    const hairGeo = new T.SphereGeometry(0.47, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const hairMat = new T.MeshStandardMaterial({ color: parseInt(toy.hairColor.replace("#", "0x")), roughness: 0.65 });
    const hairMesh = new T.Mesh(hairGeo, hairMat);
    hairMesh.position.y = 1.62;
    toyMeshGroup.add(hairMesh);

    // Ciuffo sporgente avanti
    const tuftGeo = new T.ConeGeometry(0.18, 0.3, 8);
    const tuftMesh = new T.Mesh(tuftGeo, hairMat);
    tuftMesh.rotation.x = Math.PI / 3;
    tuftMesh.position.set(0, 1.88, 0.32);
    toyMeshGroup.add(tuftMesh);

    // Occhi stile giocattolo anni '80
    const eyeGeo = new T.SphereGeometry(0.06, 8, 8);
    const eyeMat = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const eyeL = new T.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.16, 1.56, 0.4);
    const eyeR = new T.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.16, 1.56, 0.4);
    toyMeshGroup.add(eyeL, eyeR);

    // Sorriso stampato
    const smileGeo = new T.TorusGeometry(0.08, 0.02, 6, 12, Math.PI);
    const smileMat = new T.MeshBasicMaterial({ color: 0x4a1e12 });
    const smileMesh = new T.Mesh(smileGeo, smileMat);
    smileMesh.position.set(0, 1.44, 0.42);
    smileMesh.rotation.z = Math.PI;
    toyMeshGroup.add(smileMesh);

    // 8. Accessorio Caratteristico (Pallone, Ali, Coppa, ecc.)
    if (toy.acc === "ball" || !toy.acc) {
      const ballGeo = new T.SphereGeometry(0.24, 12, 12);
      const ballMat = new T.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.25 });
      const ballMesh = new T.Mesh(ballGeo, ballMat);
      ballMesh.position.set(0.52, 0.34, 0.28);
      toyMeshGroup.add(ballMesh);
    } else if (toy.acc === "wings") {
      const wingGeo = new T.BoxGeometry(0.9, 0.35, 0.05);
      const wingMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.85 });
      const wL = new T.Mesh(wingGeo, wingMat); wL.position.set(-0.6, 1.25, -0.3); wL.rotation.y = 0.4; wL.rotation.z = 0.2;
      const wR = new T.Mesh(wingGeo, wingMat); wR.position.set(0.6, 1.25, -0.3); wR.rotation.y = -0.4; wR.rotation.z = -0.2;
      toyMeshGroup.add(wL, wR);
    } else if (toy.acc === "trophy_cup") {
      const cupGeo = new T.CylinderGeometry(0.24, 0.12, 0.45, 12);
      const cupMat = new T.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.95, roughness: 0.1 });
      const cupMesh = new T.Mesh(cupGeo, cupMat);
      cupMesh.position.set(0.55, 1.2, 0.3);
      toyMeshGroup.add(cupMesh);
    }

    threeScene.add(toyMeshGroup);

    // Animazione di rotazione dolce
    if (threeAnimId) cancelAnimationFrame(threeAnimId);
    let t = 0;
    function animate() {
      threeAnimId = requestAnimationFrame(animate);
      t += 0.015;
      if (toyMeshGroup) {
        toyMeshGroup.rotation.y += 0.008;
        toyMeshGroup.position.y = Math.sin(t) * 0.04;
      }
      threeRenderer.render(threeScene, threeCamera);
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

    if (coinsEl) coinsEl.textContent = getUserCoins();
    if (shardsEl) shardsEl.textContent = data.shards || 0;
    if (pityEl) pityEl.textContent = `${data.pity || 0}/30`;
    if (ownedEl) ownedEl.textContent = `${Object.keys(data.owned).length}/${TOY_CATALOG.length}`;
  }

  // --- LOGICA DI PESCATA CON ANIMAZIONE ---
  let isPulling = false;

  function handlePull(count) {
    if (isPulling) return;
    const cost = count === 1 ? 15 : 130;
    const userCoins = getUserCoins();

    if (userCoins < cost) {
      if (window.toast) {
        window.toast(`Monete insufficienti! Ne servono ${cost}. Gioca partite per guadagnarne altre.`, "warn", "🪙");
      }
      return;
    }

    deductUserCoins(cost);
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
