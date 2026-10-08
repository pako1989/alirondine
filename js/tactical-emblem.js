// js/tactical-emblem.js - Rondine Emblem: RPG tattico a griglia (stile "Emblem", parodia generica)
// Entry point: window.openTacticalEmblemMode(onExit)
(function () {
  "use strict";

  // ---------------------------------------------------------------- costanti
  const SAVE_KEY = "ali-di-rondine.emblem-save";
  const COLS = 8;
  const ROWS = 9;
  const DIRS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  const DEBUG = /[?&]debug/.test(location.search);

  const STYLES = {
    tecnica: { n: "Tecnica", c: "#3a86ff", l: "T", beats: "potenza" },
    potenza: { n: "Potenza", c: "#e63946", l: "P", beats: "velocita" },
    velocita: { n: "Velocità", c: "#ffbe0b", l: "V", beats: "tecnica" }
  };
  const DIFFS = { easy: "Facile", normal: "Normale", hard: "Difficile" };

  // ---------------------------------------------------------------- squadra
  const ROSTER = {
    leo: {
      id: "leo", name: "Leo", role: "Regista · Capitano", style: "tecnica", hp: 24, atk: 10, def: 3, spd: 6, skl: 7, mov: 4, rng: [1, 1],
      kit: "#1d4ed8", kit2: "#fff", hair: "#3b2314", skin: "#f1c27d", leader: true,
      ab: { id: "lancio", name: "Lancio Rondine", cd: 4, desc: "Un compagno che ha già agito (entro 3 caselle) può muoversi e agire ancora." }
    },
    nico: {
      id: "nico", name: "Nico", role: "Ala · Velocista", style: "velocita", hp: 20, atk: 9, def: 2, spd: 9, skl: 6, mov: 5, rng: [1, 1],
      kit: "#1d4ed8", kit2: "#fff", hair: "#e0a526", skin: "#e8b88a",
      ab: { id: "fuga", name: "Colpo e fuga", cd: 2, desc: "Attacca un avversario vicino, poi ripiega fino a 3 caselle." }
    },
    chicco: {
      id: "chicco", name: "Chicco", role: "Mediano · Muro", style: "potenza", hp: 30, atk: 9, def: 5, spd: 3, skl: 4, mov: 3, rng: [1, 1],
      kit: "#1d4ed8", kit2: "#fff", hair: "#222", skin: "#d9a066",
      ab: { id: "muro", name: "Muro dei Trabucchi", cd: 3, desc: "Fino al prossimo turno subisce metà danni." }
    },
    sara: {
      id: "sara", name: "Sara", role: "Tiro dalla distanza", style: "tecnica", hp: 19, atk: 8, def: 2, spd: 6, skl: 8, mov: 4, rng: [2, 2],
      kit: "#1d4ed8", kit2: "#fff", hair: "#7c2d12", skin: "#f1c27d",
      ab: { id: "borraccia", name: "Borraccia del Bar", cd: 2, desc: "Un compagno entro 2 caselle (anche lei) recupera 10 energia." }
    },
    tommy: {
      id: "tommy", name: "Tommy", role: "Bomber · Cannone", style: "potenza", hp: 22, atk: 12, def: 2, spd: 4, skl: 5, mov: 3, rng: [1, 1],
      kit: "#1d4ed8", kit2: "#fff", hair: "#b45309", skin: "#e8b88a",
      ab: { id: "cannone", name: "Cannone del Borgo", cd: 2, desc: "Tiro a 2-3 caselle, +3 danni, nessun contrattacco." }
    }
  };

  // ---------------------------------------------------------------- capitoli
  // Mappe 8x9: '.' prato/pavimento, '#' ostacolo, '~' copertura (+2 difesa, -15% colpire), 'G' meta (faro/campanile/falo)
  // Campi dei capitoli: scene = sfondo disegnato, tex = fondo delle caselle, cover = aspetto della copertura, wall = aspetto degli ostacoli,
  // goal = aspetto della meta, amb = effetto atmosfera, deco = decori puramente estetici [tipo, x, y]
  // Obiettivi: rout (sconfiggi tutti), survive (resisti N turni), reach (Leo sulla meta), boss (batti il capitano),
  //            protect (resisti N turni tenendo in piedi un alleato fermo), hold (a fine turno N un giocatore deve stare sulla meta)
  const E = (name, style, hp, atk, def, spd, skl, mov, x, y, o) => Object.assign({ name, style, hp, atk, def, spd, skl, mov, x, y }, o || {});
  const PESC = { kit: "#9a6b2f" };
  const GULL = { kit: "#e5e7eb", hair: "#f59e0b", skin: "#fef3c7", fly: true, fx: "gull" };
  const COR = { kit: "#111827" };
  const GATTO = { kit: "#78716c", hair: "#d6d3d1", skin: "#fcd9b6", fx: "cat" };
  const MONELLO = { kit: "#ca8a04" };
  const SCIACALLO = { kit: "#312e81" };
  const SQUALO = { kit: "#0e7490" };
  const STORM = { kit: "#475569", hair: "#cbd5e1", skin: "#fef3c7", fly: true, fx: "gull" };
  const GLORIA = { kit: "#7c2d12" };

  const CHAPTERS = [
    {
      id: "ch1", title: "Il Molo Vecchio", tag: "Elimina i Pescatori", obj: { type: "rout", text: "Sconfiggi tutti i Pescatori del Molo." },
      par: 6, parText: "Vinci entro 6 turni", ctx: "Sera · Molo Vecchio", ico: "⚓",
      theme: { g1: "#2f8f5b", g2: "#277a4d", tint: "rgba(255,160,50,0.13)", wall: "crate", scene: "dusk", tex: "pitch", edge: "#5b4326",
        deco: [["bollard", 0, 4], ["bollard", 7, 4], ["coil", 1, 8], ["lamp", 0, 0], ["lamp", 7, 0], ["barrel", 7, 7]] },
      map: ["........", ".~....~.", "..#..#..", "........", "...~~...", "........", ".#....#.", "........", "........"],
      team: [["leo", 3, 7], ["nico", 5, 7], ["chicco", 4, 8]],
      enemies: [
        E("Gino il Mozzo", "potenza", 20, 9, 3, 3, 4, 3, 3, 1, { kit: "#9a6b2f", hair: "#555", skin: "#d9a066", por: "gino" }),
        E("Rino Tirante", "potenza", 22, 9, 4, 3, 4, 3, 5, 0, { hold: true, kit: "#9a6b2f", hair: "#222", skin: "#c68642" }),
        E("Baciccia Sr", "velocita", 17, 8, 2, 7, 5, 4, 6, 2, { kit: "#9a6b2f", hair: "#bbb", skin: "#e0ac69" })
      ],
      intro: [
        { s: "Arturo", t: "Radio Molo, buonasera. Sul Molo Vecchio si gioca con le lampare accese e il tifo spento. Sono Arturo e commento anche l'aria, gratis." },
        { s: "Leo", t: "Il campo del molo è illuminato solo dalle lampare. Se qui ci rispettano, ci rispetta tutta la costa." },
        { s: "Nico", t: "I Pescatori del Molo? Menano come fabbri e profumano di acciuga. Io però corro più forte!" },
        { s: "Baciccia", t: "Ricordate il triangolo: Tecnica batte Potenza, Potenza batte Velocità, Velocità batte Tecnica. Giocate d'astuzia, non di orgoglio." }
      ],
      outro: [
        { s: "Gino il Mozzo", t: "Bella partita, ragazzi. Domani vi offro il fritto misto. Ma la rivincita è mia." },
        { s: "Chicco", t: "Il fritto misto è un argomento serio. Accetto a nome di tutta la squadra, e delle squadre future." },
        { s: "Leo", t: "Primo passo fatto. Ma il Torneo dei Moli è lungo come la costa." }
      ]
    },
    {
      id: "ch2", title: "Assedio dei Gabbiani", tag: "Resisti 6 turni", obj: { type: "survive", turns: 6, text: "Resisti 6 turni: i Gabbiani del Porto vogliono i panini!" },
      par: 5, parText: "Sconfiggi almeno 5 gabbiani", parKind: "kills", ctx: "Mezzogiorno · Banchina del Porto", ico: "🕊️",
      theme: { g1: "#3b9a6a", g2: "#31845a", tint: "rgba(120,180,255,0.12)", wall: "crate", scene: "day", tex: "pitch", edge: "#5b4326",
        deco: [["fishcrate", 0, 0], ["fishcrate", 7, 8], ["bollard", 0, 3], ["bollard", 7, 3], ["coil", 7, 0]] },
      map: ["........", "........", ".~....~.", "........", "..#..#..", "...~~...", "........", ".~....~.", "........"],
      team: [["leo", 3, 7], ["sara", 4, 7], ["chicco", 3, 6], ["nico", 4, 6]],
      enemies: [
        E("Gabbiano Beccone", "velocita", 12, 8, 1, 8, 5, 5, 1, 0, GULL),
        E("Gabbiano Pigolone", "velocita", 12, 8, 1, 8, 5, 5, 3, 0, GULL),
        E("Gabbiano Rubapane", "tecnica", 13, 8, 2, 7, 6, 5, 5, 0, Object.assign({}, GULL, { kit: "#cbd5e1" }))
      ],
      waves: [
        { turn: 2, list: [
          E("Gabbiano Strillone", "velocita", 12, 8, 1, 8, 5, 5, null, null, GULL),
          E("Gabbiano Sfacciato", "tecnica", 13, 8, 2, 7, 6, 5, null, null, GULL)
        ] },
        { turn: 4, list: [
          E("Gabbiano Reale", "potenza", 24, 10, 4, 4, 5, 4, null, null, Object.assign({}, GULL, { kit: "#94a3b8" })),
          E("Gabbiano Lampo", "velocita", 12, 8, 1, 9, 5, 5, null, null, GULL)
        ] }
      ],
      intro: [
        { s: "Sara", t: "Ho tirato fuori il cestino del pranzo e... ragazzi, c'è uno stormo che ci guarda. Non mi piace come ci guarda." },
        { s: "Chicco", t: "Sono gabbiani, mica draghi. Un panino a testa e se ne vanno." },
        { s: "Arturo", t: "Radio Molo, ultim'ora: i gabbiani del porto hanno proclamato lo sciopero della dieta. Si consiglia di tenere il pranzo al sicuro, o in un posto che nessuno raggiunge." },
        { s: "Leo", t: "Non è il panino, è una questione di principio. Compatti, e teniamo la palla lontana dalle loro ali!" }
      ],
      outro: [
        { s: "Sara", t: "Il cestino è salvo. Quell'ultimo gabbiano mi ha lasciato una piuma... la tengo, è il mio portafortuna." },
        { s: "Chicco", t: "Io il panino l'ho mangiato prima. Per sicurezza." },
        { s: "Nico", t: "Ottima strategia, Chicco. Anzi: la migliore del torneo." }
      ]
    },
    {
      id: "ch3", title: "Corsa al Faro", tag: "Raggiungi il Faro", obj: { type: "reach", turns: 9, text: "Porta Leo sul Faro (casella gialla) entro 9 turni." },
      par: 6, parText: "Arriva entro 6 turni", ctx: "Notte · Scogliera di Punta Rondine", ico: "🗼",
      theme: { g1: "#2d7f66", g2: "#256b56", tint: "rgba(70,90,200,0.20)", wall: "rock", scene: "faro", tex: "stone", edge: "#334155", goal: "faro",
        deco: [["shell", 1, 5], ["shell", 6, 7], ["lamp", 0, 8], ["puddle", 3, 5]] },
      map: ["##.GG.##", "#..~~..#", "...##...", ".~....~.", "##.~~.##", "........", ".#....#.", "........", "........"],
      team: [["leo", 3, 8], ["sara", 4, 8], ["nico", 2, 7], ["chicco", 5, 7], ["tommy", 3, 7]],
      enemies: [
        E("Custode Aldo", "potenza", 24, 10, 4, 3, 5, 3, 2, 1, { hold: true, kit: "#7f1d1d", hair: "#777", skin: "#d9a066" }),
        E("Lampista Ines", "tecnica", 17, 9, 2, 5, 7, 3, 5, 2, { hold: true, rng: [2, 2], kit: "#7f1d1d", hair: "#4b2e83", skin: "#f1c27d" }),
        E("Cane Pippo", "velocita", 15, 8, 1, 9, 5, 5, 1, 3, { kit: "#7f1d1d", hair: "#a16207", skin: "#a16207", fx: "cat" }),
        E("Gigi Marinaio", "potenza", 22, 10, 4, 3, 5, 3, 5, 3, { hold: true, kit: "#7f1d1d", hair: "#222", skin: "#c68642" })
      ],
      intro: [
        { s: "Ester", t: "Centotredici gradini, ragazzi, e il gatto dorme sulla manovella: non svegliatelo, ha un pessimo carattere. Stanotte il Faro è spento." },
        { s: "Leo", t: "Il custode dice che solo chi arriva in cima per primo può riaccenderlo." },
        { s: "Tommy", t: "Posso riaccenderlo io! Ho un cannone... ah, no, quello serve per i difensori. Vabbè, ci penso strada facendo." },
        { s: "Sara", t: "Leo, non devi vincere ogni duello. Devi solo arrivare in cima. Noi apriamo la strada, tu corri." }
      ],
      outro: [
        { s: "Leo", t: "La luce gira sul mare. Qualcuno, da qualche parte, la sta guardando e sa che può tornare a casa." },
        { s: "Ester", t: "Il gatto si è svegliato e ti ha guardato male. Da lui è un grande complimento." }
      ]
    },
    {
      id: "ch4", title: "I Corsari di Capitan Vanni", tag: "Batti il Capitano", obj: { type: "boss", text: "Sconfiggi Capitan Vanni: la ciurma si arrende con lui." },
      par: 8, parText: "Vinci entro 8 turni", ctx: "Notte · Banchina dei Corsari", ico: "🏴‍☠️",
      theme: { g1: "#2a8556", g2: "#226f48", tint: "rgba(210,60,40,0.14)", wall: "rock", scene: "ship", tex: "planks", edge: "#3b1d1d",
        deco: [["barrel", 0, 8], ["barrel", 7, 8], ["coil", 0, 3], ["lamp", 7, 3], ["flag", 3, 0]] },
      map: ["........", ".~.##.~.", "........", "...~~...", ".#....#.", "........", "..~..~..", "........", "........"],
      team: [["leo", 3, 8], ["sara", 4, 8], ["nico", 2, 7], ["chicco", 5, 7], ["tommy", 4, 7]],
      enemies: [
        E("Capitan Vanni", "tecnica", 34, 11, 5, 6, 8, 3, 3, 0, { hold: true, boss: true, kit: "#111827", hair: "#9ca3af", skin: "#d9a066", por: "vanni" }),
        E("Corsaro Bruno", "potenza", 26, 10, 4, 3, 5, 3, 2, 2, { kit: "#111827", hair: "#222", skin: "#c68642" }),
        E("Corsaro Silvano", "velocita", 20, 9, 2, 8, 6, 5, 6, 2, { kit: "#111827", hair: "#b45309", skin: "#e8b88a" }),
        E("Lo Sparagnino", "tecnica", 18, 9, 2, 5, 7, 3, 5, 1, { hold: true, rng: [2, 2], kit: "#111827", hair: "#555", skin: "#f1c27d" }),
        E("Tonno Pesante", "potenza", 26, 10, 5, 2, 4, 3, 1, 2, { hold: true, kit: "#111827", hair: "#222", skin: "#d9a066" })
      ],
      intro: [
        { s: "Capitan Vanni", t: "Siete arrivati fin qui, ragazzi del Borgo? Bravi. Ma il trofeo del Faro appartiene ai Corsari da quando avevo i capelli!" },
        { s: "Leo", t: "La Rondine non abbassa mai la cresta. Ognuno di noi gioca per quelli che non possono essere qui stasera." },
        { s: "Don Aurelio", t: "Coraggio figlioli: testa alta, palla a terra e cuore fino al novantesimo. E poi, caffè per tutti!" }
      ],
      outro: [
        { s: "Capitan Vanni", t: "Mi avete battuto con garbo. Terrò la sciarpa della Rondine nella mia cabina. Ci vediamo alla prossima marea." },
        { s: "Ginetta", t: "Complimenti per i Corsari! Ah, dimenticavo: vi ho appena iscritti alle Sei Prove del Borgo. Non è un invito, è un regolamento." },
        { s: "Leo", t: "Sei prove? Ginetta, chi ha scritto questo regolamento?" },
        { s: "Ginetta", t: "Io, stamattina. Presentatevi al Mercato all'alba. Portate una sciarpa e un po' di pazienza." }
      ]
    },
    {
      id: "ch5", title: "Il Mercato all'Alba", tag: "Proteggi Pina", ctx: "Alba · Banchina del Pesce", ico: "🐟",
      obj: { type: "protect", turns: 6, text: "Proteggi la Signora Pina per 6 turni: non può muoversi!" },
      par: 0.5, parText: "Pina resta sopra metà energia", parKind: "vip",
      hint1: "Pina non si muove: i Gattoni la attaccheranno. Bloccali, e cura Pina con la Borraccia di Sara.",
      theme: { g1: "#8b7a63", g2: "#7c6c57", tint: "rgba(255,170,120,0.16)", wall: "stall", cover: "basket", scene: "market", tex: "cobble", edge: "#7a3b24",
        deco: [["fishcrate", 0, 0], ["fishcrate", 7, 2], ["puddle", 3, 4], ["puddle", 5, 8], ["lamp", 0, 4], ["lamp", 7, 6], ["coil", 1, 8]] },
      map: ["........", ".~#..#~.", "........", "..#..#..", "........", ".~....~.", "..#..#..", "........", "........"],
      vip: { id: "pina", name: "Signora Pina", role: "Edicolante · Da proteggere", style: "tecnica", hp: 34, atk: 5, def: 2, spd: 2, skl: 3, mov: 0, x: 3, y: 6, kit: "#57b0a0", hair: "#a0457a", skin: "#f0c9a8", por: "pina" },
      team: [["leo", 4, 6], ["sara", 3, 7], ["chicco", 3, 5], ["nico", 4, 7], ["tommy", 2, 7]],
      enemies: [
        E("Gattone Marmellata", "velocita", 13, 8, 1, 8, 6, 5, 0, 0, GATTO),
        E("Gatto Tigrato", "potenza", 18, 9, 3, 5, 5, 4, 4, 1, Object.assign({}, GATTO, { kit: "#a16207" })),
        E("Micione Nero", "tecnica", 14, 9, 2, 6, 7, 4, 6, 0, Object.assign({}, GATTO, { kit: "#1f2937" })),
        E("Facchino Bruto", "potenza", 26, 10, 4, 3, 5, 3, 3, 2, { hold: true, kit: "#6b4f2a", hair: "#222", skin: "#c68642" })
      ],
      waves: [
        { turn: 2, list: [E("Gattone Sfrontato", "velocita", 13, 8, 1, 8, 6, 5, null, null, GATTO), E("Gatto Rosso", "potenza", 18, 9, 3, 5, 5, 4, null, null, Object.assign({}, GATTO, { kit: "#b45309" }))] },
        { turn: 4, list: [E("Micione Grigio", "tecnica", 14, 9, 2, 6, 7, 4, null, null, Object.assign({}, GATTO, { kit: "#64748b" })), E("Facchino Sbadiglio", "potenza", 24, 10, 4, 3, 5, 3, null, null, { kit: "#6b4f2a", hair: "#555", skin: "#d9a066" })] }
      ],
      intro: [
        { s: "Ginetta", t: "Ammessi ufficialmente alle Sei Prove del Borgo! Chi le supera tutte porta la Lanterna d'Argento in testa al corteo di San Pietro. Articolo uno: non si discute con la Giuria. La Giuria sono io." },
        { s: "Leo", t: "Sei prove? Fino a ieri era una. E questa Lanterna d'Argento da quanto esiste?" },
        { s: "Ginetta", t: "Da stamattina. Ma è scritta in maiuscolo, quindi vale. Prima prova: il Mercato all'Alba. I Gattoni di Banchina vogliono le acciughe di Pina." },
        { s: "Pina", t: "Io non mi sposto. Il Corriere esce anche sotto assedio. Ragazzi, davanti a me i gatti, dietro di me la prima pagina." },
        { s: "Chicco", t: "Dicono che rubino tutto quello che profuma di pesce. Io profumo di fritto: sono al sicuro." },
        { s: "Sara", t: "Chicco, il fritto è pesce. Pina non può muoversi: blocchiamo i passaggi e teniamola in piedi fino alla campana delle sette." }
      ],
      outro: [
        { s: "Pina", t: "Mai vista una difesa così. Domani in prima pagina: «La Rondine salva le acciughe». Il titolo è da rifare, il concetto regge." },
        { s: "Nico", t: "E i Gattoni?" },
        { s: "Pina", t: "Dormono sulle ceste vuote, sazi e felici. Hanno perso, ma il pranzo l'hanno fatto lo stesso." },
        { s: "Ginetta", t: "Prova uno su sei: superata. Il regolamento ti dà ragione, Pina. Come sempre dà ragione a me." }
      ]
    },
    {
      id: "ch6", title: "I Tetti del Borgo", tag: "Raggiungi il Campanile", ctx: "Mattino · Tetti di Borgo Marino", ico: "🔔",
      obj: { type: "reach", turns: 8, text: "Porta Leo al Campanile (casella gialla) entro 8 turni.", fail: "Le campane restano legate: tempo scaduto." },
      par: 6, parText: "Arriva entro 6 turni",
      hint1: "I Monelli tirano palloncini d'acqua da lontano: usa i panni stesi come copertura e fai strada a Leo.",
      theme: { g1: "#a8553a", g2: "#97482f", tint: "rgba(255,200,110,0.15)", wall: "chimney", cover: "laundry", scene: "roofs", tex: "roof", edge: "#5b2a1c", goal: "campanile",
        deco: [["pot", 0, 8], ["pot", 7, 7], ["antenna", 2, 3], ["antenna", 5, 5], ["cat", 6, 8]] },
      map: ["..#...#.", ".~..#.~G", "..~...#.", ".#..~...", "...#..~.", ".~...#..", "..~...#.", ".#...~..", "........"],
      team: [["leo", 3, 8], ["nico", 2, 8], ["sara", 4, 8], ["chicco", 5, 8], ["tommy", 5, 7]],
      enemies: [
        E("Pietrino", "tecnica", 18, 8, 2, 6, 6, 3, 5, 1, { hold: true, kit: "#ffd23f", hair: "#8a5a2a", skin: "#f5d0ae", por: "pietrino" }),
        E("Monello Cerbottana", "tecnica", 12, 7, 1, 6, 7, 3, 4, 3, { hold: true, rng: [2, 2], kit: "#ca8a04", hair: "#444", skin: "#e8b88a" }),
        E("Monello Scarafaggio", "velocita", 12, 7, 1, 8, 5, 5, 1, 2, { kit: "#ca8a04", hair: "#a16207", skin: "#f1c27d" }),
        E("Monello Fionda", "tecnica", 12, 7, 1, 6, 7, 3, 6, 4, { rng: [2, 2], kit: "#ca8a04", hair: "#222", skin: "#d9a066" }),
        E("Piccione Viaggiatore", "velocita", 13, 8, 1, 9, 5, 5, 3, 0, { kit: "#94a3b8", hair: "#cbd5e1", skin: "#e2e8f0", fly: true, fx: "gull" }),
        E("Gatto del Tetto", "velocita", 14, 8, 1, 9, 6, 5, 7, 5, GATTO)
      ],
      intro: [
        { s: "Don Aurelio", t: "Figlioli, le campane non suonano da stamattina: qualcuno ha legato le corde al campanile. Io salgo le scale una volta al giorno, e oggi l'ho già fatto." },
        { s: "Pietrino", t: "Siamo noi, i Monelli del Campanile! Se Leo ci raggiunge sul tetto, restituiamo le corde. Ma Leo è scarso: non ce la fa." },
        { s: "Leo", t: "Lo dice con la stessa ammirazione di sempre, vero?" },
        { s: "Sara", t: "Con il massimo dell'ammirazione, Leo. Non farti commuovere." },
        { s: "Nico", t: "Tetti, tegole e palloncini d'acqua. Mi piace!" },
        { s: "Tommy", t: "Io soffro un po' di vertigini." },
        { s: "Chicco", t: "Io di fame. Possiamo fare presto?" }
      ],
      outro: [
        { s: "Pietrino", t: "Hai vinto... sei meno scarso di quanto pensassi. Sei quasi normale." },
        { s: "Leo", t: "È il complimento più bello che mi abbiano mai fatto." },
        { s: "Don Aurelio", t: "Le campane suonano di nuovo. Benedico le ginocchia di tutti, anche quelle dei Monelli. Soprattutto le loro." },
        { s: "Pietrino", t: "Da quassù si vede tutto il Borgo. Quando sarò grande voglio fare questo: stare in alto e vedere tutti tornare a casa." },
        { s: "Leo", t: "Allora non sei scarso nemmeno tu, Pietrino." }
      ]
    },
    {
      id: "ch7", title: "Il Fuoco della Scogliera", tag: "Tieni acceso il Falò", ctx: "Notte · Scogliera di Punta Rondine", ico: "🔥",
      obj: { type: "hold", turns: 7, text: "Alla fine del turno 7 un giocatore deve stare sul Falò (casella gialla)." },
      par: 6, parText: "Sconfiggi almeno 6 Sciacalli", parKind: "kills",
      hint1: "Resta vicino al Falò e dai il cambio a chi è ferito: alla fine del turno 7 qualcuno deve essere sopra.",
      theme: { g1: "#3b4a52", g2: "#334148", tint: "rgba(20,30,80,0.30)", wall: "rock", cover: "tuft", scene: "cliff", tex: "rock", edge: "#1e293b", goal: "falo", amb: "fog",
        deco: [["shell", 0, 7], ["shell", 7, 2], ["puddle", 2, 4], ["puddle", 6, 7], ["lamp", 0, 6]] },
      map: ["#......#", ".#.~~.#.", "..~..~..", ".#....#.", "...##...", "..~G.~..", ".#....#.", "........", "#......#"],
      team: [["leo", 4, 6], ["nico", 2, 6], ["chicco", 4, 5], ["sara", 3, 7], ["tommy", 5, 6]],
      enemies: [
        E("Mastro Gancio", "potenza", 28, 11, 4, 4, 6, 3, 3, 1, { hold: true, kit: "#312e81", hair: "#111", skin: "#c68642", por: "gancio" }),
        E("Sciacallo Uncino", "velocita", 18, 9, 2, 8, 6, 5, 1, 0, SCIACALLO),
        E("Sciacallo Remo", "potenza", 22, 10, 3, 4, 5, 3, 5, 2, Object.assign({}, SCIACALLO, { hair: "#777", skin: "#d9a066" })),
        E("Sciacalla Rete", "tecnica", 16, 9, 2, 6, 7, 3, 6, 0, Object.assign({}, SCIACALLO, { rng: [2, 2], hair: "#a16207", skin: "#f1c27d" }))
      ],
      waves: [
        { turn: 2, list: [E("Sciacallo Torcia", "velocita", 17, 9, 2, 8, 6, 5, null, null, SCIACALLO), E("Sciacallo Pala", "potenza", 22, 10, 3, 4, 5, 3, null, null, Object.assign({}, SCIACALLO, { skin: "#d9a066" }))] },
        { turn: 4, list: [E("Sciacalla Corda", "tecnica", 16, 9, 2, 6, 7, 3, null, null, Object.assign({}, SCIACALLO, { rng: [2, 2], skin: "#f1c27d" })), E("Sciacallo Piede di Porco", "potenza", 24, 10, 4, 3, 5, 3, null, null, SCIACALLO)] }
      ],
      beats: [{ id: "ettore", turn: 4, lines: [
        { s: "Anselmo", t: "Sapete perché lo tengo acceso? Mio fratello Ettore tornava sempre dalla stessa rotta. Una notte il fuoco era spento. Non l'ho più rivisto." },
        { s: "Leo", t: "Stanotte nessuno si perde, Anselmo. Te lo prometto." },
        { s: "Sara", t: "Ancora tre turni. Tutti vicini al fuoco, a turno, e ci diamo il cambio." }
      ] }],
      intro: [
        { s: "Ester", t: "Stanotte il vento gira e il Faro è in avaria: la lampada si è fermata a metà giro. Il gatto ha lasciato la manovella, ed è un cattivo segno." },
        { s: "Anselmo", t: "Dodici barche sono fuori, ragazzi. C'è solo il mio fuoco sulla scogliera a far da faro. E c'è chi vuole spegnerlo." },
        { s: "Sara", t: "Chi vorrebbe spegnere un fuoco in una notte così?" },
        { s: "Anselmo", t: "Gli Sciacalli di Marea. Aspettano che una barca si schianti per portar via il carico. Non fanno male a nessuno, dicono. Basta non chiedere a chi sta a bordo." },
        { s: "Leo", t: "Tieni il fuoco acceso, Anselmo. Noi teniamo lontani loro." },
        { s: "Anselmo", t: "Il fuoco non si difende solo con le mani. Bisogna che qualcuno gli stia vicino, fino all'ultima barca." }
      ],
      outro: [
        { s: "Anselmo", t: "Dodici barche, dodici ritorni. I pesci mi danno sempre ragione, stanotte per fortuna hanno sbagliato strada." },
        { s: "Ester", t: "Il gatto è tornato sulla manovella. È il segnale: il mare ha finito di arrabbiarsi." },
        { s: "Anselmo", t: "Grazie, ragazzi. Per Ettore. E per tutti gli altri." },
        { s: "Leo", t: "Il fuoco resta acceso finché serve." }
      ]
    },
    {
      id: "ch8", title: "Il Derby di Punta Nera", tag: "Batti gli Squali", ctx: "Pomeriggio · Spiaggia di Punta Nera", ico: "🦈",
      obj: { type: "rout", text: "Sconfiggi tutti gli Squali di Punta Nera." },
      par: 8, parText: "Vinci entro 8 turni",
      hint1: "Sabbia e ciuffi d'erba marina danno copertura. Gli Squali sono tanti: attira i più veloci e colpiscili uno alla volta.",
      theme: { g1: "#d9b970", g2: "#cdac62", tint: "rgba(255,210,120,0.12)", wall: "boat", cover: "tuft", scene: "beach", tex: "sand", edge: "#8a6d3b",
        deco: [["shell", 1, 3], ["shell", 6, 6], ["star", 4, 2], ["star", 2, 8], ["umbrella", 7, 0], ["umbrella", 0, 5]] },
      map: ["........", ".~..~~..", "..#..#..", "........", ".~....~.", "...##...", "........", ".~.~~.~.", "........"],
      team: [["leo", 3, 8], ["sara", 4, 8], ["nico", 2, 8], ["chicco", 3, 7], ["tommy", 4, 7]],
      enemies: [
        E("Rocco Scafati", "tecnica", 32, 12, 5, 6, 8, 4, 3, 1, { hold: true, kit: "#0a3a4a", hair: "#141414", skin: "#d9a57a", por: "rocco" }),
        E("Dentone", "potenza", 28, 11, 4, 3, 5, 3, 1, 2, SQUALO),
        E("Pinna Rossa", "velocita", 22, 10, 2, 9, 6, 5, 6, 2, Object.assign({}, SQUALO, { hair: "#b91c1c", skin: "#e8b88a" })),
        E("Martello", "potenza", 30, 11, 5, 2, 4, 3, 4, 0, Object.assign({}, SQUALO, { hold: true, skin: "#c68642" })),
        E("Verdesca", "tecnica", 20, 10, 3, 6, 8, 3, 6, 0, Object.assign({}, SQUALO, { hold: true, rng: [2, 2], hair: "#4b5563", skin: "#f1c27d" })),
        E("Remora", "velocita", 19, 9, 2, 8, 6, 5, 0, 1, Object.assign({}, SQUALO, { skin: "#d9a066" }))
      ],
      intro: [
        { s: "Rocco", t: "Il Borgo in casa degli Squali! Se volete la Lanterna d'Argento passate dalla sabbia di Punta Nera. Quarta prova: la mia." },
        { s: "Tonino", t: "Gelati, gelati! Oggi lancio il gusto «Squalo alla menta». Sa di dentifricio con un retrogusto di rimpianto." },
        { s: "Rocco", t: "Lo sognavo in vetrina da una vita! Grazie, Tonino." },
        { s: "Tonino", t: "Ne ho venduti tre. Due a lui." },
        { s: "Nico", t: "Rocco, ricordi il derby d'autunno?" },
        { s: "Rocco", t: "Perfettamente: l'abbiamo vinto noi." },
        { s: "Leo", t: "Diciamo che rimetto in ordine i ricordi sul campo." },
        { s: "Sara", t: "Sei Squali, tutti compatti. Calma e passo dopo passo: non andiamo a prenderli, li aspettiamo." }
      ],
      outro: [
        { s: "Rocco", t: "Mi avete battuto sulla mia sabbia. Giuro che il prossimo derby lo vinco io. Intanto la prova è vostra." },
        { s: "Tonino", t: "Per festeggiare: gelato Squalo alla menta. Offre Rocco." },
        { s: "Rocco", t: "Non offro niente!" },
        { s: "Chicco", t: "Lo accetto con onore, a nome di Rocco." },
        { s: "Leo", t: "Senza avversari come te, la Lanterna non varrebbe niente." },
        { s: "Rocco", t: "...Non montarti la testa, Rondine." }
      ]
    },
    {
      id: "ch9", title: "Tempesta sul Porto", tag: "Resisti alla tempesta", ctx: "Notte · Porto Vecchio", ico: "⛈️",
      obj: { type: "survive", turns: 8, text: "Resisti 8 turni: la tempesta flagella il Porto Vecchio!" },
      par: 8, parText: "Sconfiggi almeno 8 nemici", parKind: "kills",
      hint1: "Arrivano ondate: tieni la squadra compatta tra le casse e usa le abilità appena sono pronte.",
      theme: { g1: "#3f5565", g2: "#364b59", tint: "rgba(20,40,90,0.28)", wall: "crate", cover: "net", scene: "storm", tex: "wet", edge: "#1e293b", amb: "rain",
        deco: [["puddle", 2, 2], ["puddle", 5, 5], ["puddle", 3, 8], ["bollard", 0, 5], ["bollard", 7, 5], ["lamp", 0, 0], ["lamp", 7, 8]] },
      map: ["........", ".#.~~.#.", "........", "..#..#..", ".~....~.", "........", ".#.~~.#.", "........", "........"],
      team: [["leo", 3, 7], ["sara", 4, 7], ["chicco", 3, 6], ["nico", 2, 7], ["tommy", 5, 7]],
      enemies: [
        E("Gabbiano della Tempesta", "velocita", 15, 9, 1, 9, 6, 5, 1, 0, STORM),
        E("Gabbiano Fulmine", "tecnica", 15, 9, 2, 8, 7, 5, 6, 0, STORM),
        E("Granchio Gigante", "potenza", 30, 10, 6, 2, 4, 2, 3, 2, { kit: "#b91c1c", hair: "#7f1d1d", skin: "#fca5a5", fx: "crab" })
      ],
      waves: [
        { turn: 2, list: [E("Sciacallo Fradicio", "velocita", 19, 9, 2, 8, 6, 5, null, null, SCIACALLO), E("Sciacallo Marea", "potenza", 24, 10, 3, 4, 5, 3, null, null, SCIACALLO), E("Gabbiano Burrasca", "velocita", 15, 9, 1, 9, 6, 5, null, null, STORM)] },
        { turn: 4, list: [E("Granchio Corazza", "potenza", 30, 10, 6, 2, 4, 2, null, null, { kit: "#b91c1c", hair: "#7f1d1d", skin: "#fca5a5", fx: "crab" }), E("Sciacalla Lampo", "tecnica", 17, 10, 2, 6, 8, 3, null, null, Object.assign({}, SCIACALLO, { rng: [2, 2] })), E("Gabbiano Saetta", "tecnica", 15, 9, 2, 8, 7, 5, null, null, STORM)] },
        { turn: 6, list: [E("Mastro Gancio", "potenza", 32, 11, 5, 4, 6, 3, null, null, { kit: "#312e81", hair: "#111", skin: "#c68642", por: "gancio" }), E("Gabbiano Tuono", "velocita", 15, 9, 1, 9, 6, 5, null, null, STORM)] }
      ],
      beats: [{ id: "vanni", turn: 5, lines: [
        { s: "Capitan Vanni", t: "Un Corsaro non lascia un porto in difficoltà. Alle cime e alle barche pensiamo noi: voi tenete lontani quei gabbiani!" },
        { s: "Leo", t: "Vanni?! Ma non eravamo nemici?" },
        { s: "Capitan Vanni", t: "Fino a ieri. Stasera siamo tutti equipaggio. Non dirlo in giro: ho una reputazione da pirata." },
        { s: "Sara", t: "Ho paura, Leo. Non per me. Per chi non vediamo." },
        { s: "Leo", t: "Nessuno resta indietro. Mai." }
      ] }],
      intro: [
        { s: "Arturo", t: "Radio Molo, edizione straordinaria! Il maltempo ha scoperchiato il porto, e anche il mio mestolo. Si sconsiglia di uscire. Si sconsiglia anche di restare, ma è l'unica cosa che possiamo fare." },
        { s: "Don Tullio", t: "Ecco le lampade di scorta del magazzino. Ho le chiavi da quarant'anni e per la prima volta me le chiedono con le buone maniere." },
        { s: "Sara", t: "Le barche sono ancora ormeggiate: se le onde le portano via, il Borgo perde i suoi pescatori. Dobbiamo resistere finché la tempesta non passa." },
        { s: "Nico", t: "Quindi siamo noi contro il maltempo?" },
        { s: "Sara", t: "E contro tutto quello che il maltempo si è portato dietro." },
        { s: "Tommy", t: "Io reggo. È il tetto che non regge." },
        { s: "Leo", t: "Quinta prova. Se reggiamo qui, reggiamo ovunque." }
      ],
      outro: [
        { s: "Arturo", t: "Radio Molo, ultime notizie: il porto ha retto, il mestolo è stato ritrovato, il cielo ha smesso di piangere. Merito della Rondine, dice la redazione. E la redazione sono io." },
        { s: "Capitan Vanni", t: "Alla prossima marea, ragazzi. E giuro che non ho aiutato nessuno." },
        { s: "Don Tullio", t: "Le lampade me le rimettete a posto voi. Sto scherzando. Forse." },
        { s: "Leo", t: "Una prova ancora. Poi il corteo." }
      ]
    },
    {
      id: "ch10", title: "La Notte della Lanterna", tag: "Batti Zio Libeccio", ctx: "Sera di San Pietro · Stadio Vecchio", ico: "🏮",
      obj: { type: "boss", text: "Sconfiggi Zio Libeccio: le Vecchie Glorie si arrendono con lui." },
      par: 9, parText: "Vinci entro 9 turni",
      hint1: "Zio Libeccio si infuria a metà energia: colpisci in squadra e non lasciare Leo da solo in prima linea.",
      theme: { g1: "#2f8f5b", g2: "#277a4d", tint: "rgba(255,190,90,0.12)", wall: "pillar", cover: "bench", scene: "stadium", tex: "pitch", edge: "#44403c", amb: "confetti",
        deco: [["flag", 0, 1], ["flag", 7, 1], ["lamp", 0, 8], ["lamp", 7, 8], ["flag", 3, 8], ["flag", 4, 8]] },
      map: ["#......#", "........", "..~..~..", ".#....#.", "...~~...", ".#....#.", "..~..~..", "........", "........"],
      team: [["leo", 3, 8], ["sara", 4, 8], ["nico", 2, 8], ["chicco", 3, 7], ["tommy", 4, 7]],
      enemies: [
        E("Zio Libeccio", "tecnica", 44, 12, 6, 6, 9, 3, 3, 1, { hold: true, boss: true, rage: 2, kit: "#7c2d12", hair: "#d8d4cc", skin: "#d49a68", por: "libeccio" }),
        E("Tramontana", "potenza", 34, 11, 6, 2, 5, 3, 2, 2, Object.assign({}, GLORIA, { hold: true, hair: "#ccc", skin: "#c68642" })),
        E("Ponente", "potenza", 30, 11, 5, 3, 5, 3, 5, 2, Object.assign({}, GLORIA, { hold: true, hair: "#aaa", skin: "#d9a066" })),
        E("Scirocco", "velocita", 26, 11, 3, 9, 7, 5, 6, 1, Object.assign({}, GLORIA, { hair: "#bbb", skin: "#e0ac69" })),
        E("Grecale", "tecnica", 24, 11, 3, 6, 9, 3, 1, 1, Object.assign({}, GLORIA, { rng: [2, 2], hair: "#ddd", skin: "#f1c27d" })),
        E("Ostro", "tecnica", 28, 11, 4, 5, 8, 4, 4, 3, Object.assign({}, GLORIA, { hair: "#999", skin: "#d49a68" }))
      ],
      beats: [
        { id: "baciccia", turn: 3, lines: [
          { s: "Baciccia", t: "Forza Rondine! Forza, ragazzi! E forza anche... beh, soprattutto per Ferri." },
          { s: "Nonna Ferri", t: "Baciccia, ti sento." },
          { s: "Baciccia", t: "Non parlavo di te, Ferri. Parlavo del cielo." },
          { s: "Nonna Ferri", t: "È coperto." }
        ] },
        { id: "rage", bossHalf: true, lines: [
          { s: "Zio Libeccio", t: "Adesso sì che si gioca! Ostro, Grecale, con me: facciamogli sentire il vento del Borgo!" },
          { s: "Settimio", t: "Ricordo ogni traversa di questo campo. Ragazzi, non fate svanire l'ultima." },
          { s: "Leo", t: "Non la faremo svanire. Squadra: avanti insieme!" }
        ] }
      ],
      intro: [
        { s: "Presidente Spigola", t: "Signore e signori, cittadini e gabbiani! La Sesta Prova della Lanterna d'Argento si disputa qui, al Vecchio Stadio, contro le Vecchie Glorie. Dina segna i presenti. Anche i gabbiani." },
        { s: "Settimio", t: "Dal '62 taglio quest'erba con le forbici. Domani arrivano le ruspe per rifare il campo, ed è giusto così. Ma stasera il prato è vostro, ragazzi. Fatelo ricordare." },
        { s: "Nonna Ferri", t: "Leo, Nico: vi ho procurato gli avversari più bravi del Borgo. La procura è un'arte. Baciccia, smettila di guardarmi." },
        { s: "Zio Libeccio", t: "Eravamo il vento del Borgo quando i vostri nonni correvano dietro a una vescica di maiale. Mostrateci cosa avete imparato dal mare." },
        { s: "Leo", t: "Siamo la Rondine. Giochiamo per chi può esserci e per chi non può. Stasera giochiamo anche per loro." }
      ],
      outro: [
        { s: "Zio Libeccio", t: "Mi avete battuto con garbo. Cosa vi aspettavate dalle Vecchie Glorie? Un gran finale, mi pare." },
        { s: "Zio Libeccio", t: "La Lanterna d'Argento la porta in corteo chi vince l'ultima prova. Da stasera tocca a voi. Quando la sera si fa buia, qualcuno deve accenderla." },
        { s: "Leo", t: "Mia madre diceva che una luce accesa è un modo di dire «ti aspetto». La porterò così." },
        { s: "Settimio", t: "Vecchio prato, ultima partita. Non poteva finire meglio." },
        { s: "Pina", t: "Prima pagina: «La Rondine accende la Lanterna». Stavolta il titolo regge." },
        { s: "Presidente Spigola", t: "Il corteo di San Pietro può partire! Dina, segna tutto. Soprattutto i biscotti." },
        { s: "Baciccia", t: "Ferri... stai piangendo?" },
        { s: "Nonna Ferri", t: "È la salsedine, Baciccia." }
      ]
    }
  ];

  const REWARDS = { ch1: 3, ch2: 4, ch3: 4, ch4: 6, ch5: 5, ch6: 5, ch7: 6, ch8: 6, ch9: 7, ch10: 10 };
  const MAXLV = 6;

  const TUTORIAL = [
    { ico: "🛡️", t: "Benvenuto in Rondine Emblem", b: "Una battaglia a turni sul campo di calcio. Muovi la tua squadra, sconfiggi i rivali e porta a termine l'obiettivo del capitolo. Se <b>Leo</b> (il capitano) va ko, la partita è persa." },
    { ico: "👆", t: "Muovi e attacca", b: "Tocca un tuo giocatore: le caselle <b style='color:#7db4ff'>blu</b> sono dove può andare, quelle <b style='color:#ff8a8a'>rosse</b> dove può colpire. Poi scegli: <b>Attacca</b> toccando un rivale, usa l'<b>Abilità</b> o <b>Attendi</b>. Tocca un rivale per vedere il suo raggio d'azione." },
    { ico: "🔺", t: "Il triangolo dello stile", b: "<b style='color:#7db4ff'>Tecnica</b> batte <b style='color:#ff8a8a'>Potenza</b>, <b style='color:#ff8a8a'>Potenza</b> batte <b style='color:#ffd84d'>Velocità</b>, <b style='color:#ffd84d'>Velocità</b> batte <b style='color:#7db4ff'>Tecnica</b>. Chi ha il vantaggio colpisce di più e sbaglia meno. Prima di ogni attacco vedi l'anteprima di danni e probabilità." },
    { ico: "🎯", t: "Obiettivi diversi", b: "Non si vince sempre eliminando tutti: in alcuni capitoli devi <b>resistere</b> a ondate di avversari, portare <b>Leo</b> su una meta, <b>proteggere</b> un alleato che non può muoversi, tenere acceso un <b>Falò</b> o battere il <b>capitano</b>. L'obiettivo è sempre scritto sopra la scacchiera." },
    { ico: "⭐", t: "Cespugli, abilità, stelle", b: "I <b>cespugli</b> danno +2 difesa. Ogni giocatore ha un'abilità speciale che si ricarica dopo qualche turno. In ogni capitolo puoi vincere fino a 3 stelle: più stelle, più la squadra cresce di livello." }
  ];

  // ---------------------------------------------------------------- variabili
  let root = null, cv = null, cx = null, rafId = 0, styleEl = null, onExitCb = null;
  let timers = new Set();
  let save = null;
  let S = null; // battaglia corrente
  let lay = { t: 40, ox: 0, oy: 0, w: 300, h: 300, dpr: 1 };
  let lastFrame = 0;
  let alive = false;
  let listeners = [];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const q = (sel) => root && root.querySelector(sel);
  const FAST = () => (DEBUG && window.__emblemFast ? 0.05 : 1);

  function snd(name) {
    try { if (window.HD2DAudio && typeof window.HD2DAudio[name] === "function") window.HD2DAudio[name](); } catch (e) { /* audio opzionale */ }
  }

  function wait(ms) {
    return new Promise((res) => {
      const id = setTimeout(() => { timers.delete(id); res(); }, Math.max(0, ms * FAST()));
      timers.add(id);
    });
  }

  // ---------------------------------------------------------------- salvataggio
  function loadSave() {
    const s = { v: 1, diff: "normal", tut: false, cleared: {}, paid: {} };
    try {
      const o = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (o && typeof o === "object") {
        if (DIFFS[o.diff]) s.diff = o.diff;
        s.tut = !!o.tut;
        CHAPTERS.forEach((c) => {
          const cl = o.cleared && o.cleared[c.id];
          if (cl && Number.isFinite(cl.stars)) s.cleared[c.id] = { stars: clamp(Math.floor(cl.stars), 1, 3), best: Number.isFinite(cl.best) ? cl.best : 99 };
          if (o.paid && o.paid[c.id]) s.paid[c.id] = true;
        });
      }
    } catch (e) { /* default sicuri */ }
    return s;
  }
  function writeSave() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* storage non disponibile */ }
  }
  function totalStars() {
    return CHAPTERS.reduce((n, c) => n + ((save.cleared[c.id] && save.cleared[c.id].stars) || 0), 0);
  }
  function teamLevel() { return Math.min(MAXLV, Math.floor(totalStars() / 3)); }

  // ---------------------------------------------------------------- mappa / unità
  function tileAt(x, y) { return S.ch.map[y] ? S.ch.map[y][x] : "#"; }
  function inb(x, y) { return x >= 0 && y >= 0 && x < COLS && y < ROWS; }
  function isWall(x, y) { return tileAt(x, y) === "#"; }
  function isCover(x, y) { return tileAt(x, y) === "~"; }
  function unitAt(x, y) { return S.units.find((u) => u.hp > 0 && u.x === x && u.y === y) || null; }
  function dist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
  function team(t) { return S.units.filter((u) => u.hp > 0 && u.team === t); }
  function advOf(a, d) { return STYLES[a].beats === d ? 1 : STYLES[d].beats === a ? -1 : 0; }

  function makeUnit(r, x, y, tm, extra) {
    const u = Object.assign({
      uid: S.uid++, rng: [1, 1], team: tm, x, y, dx: x, dy: y, acted: false, moved: false, cd: 0, guard: false,
      alpha: 1, alphaT: 1, flash: 0, lunge: null, hpv: 0, hold: false, fly: false, boss: false, leader: false, vip: false
    }, r, extra || {});
    u.maxHp = u.hp; u.hpv = u.hp;
    return u;
  }

  function buildPlayer(id, x, y) {
    const r = Object.assign({}, ROSTER[id]);
    const lv = teamLevel();
    r.hp += 2 * lv; r.atk += Math.floor((lv + 1) / 2); r.def += Math.floor(lv / 2);
    const u = makeUnit(r, x, y, "p", { pid: id });
    u.cd = 0;
    return u;
  }
  function buildVip(v) {
    const u = makeUnit(Object.assign({ rng: [1, 1] }, v), v.x, v.y, "p", { pid: v.id, vip: true, acted: true, moved: true, role: v.role || "Da proteggere" });
    return u;
  }
  function buildEnemy(e, x, y) {
    const r = Object.assign({}, e);
    const d = save.diff;
    r.hp = Math.round(r.hp * (d === "easy" ? 0.85 : d === "hard" ? 1.15 : 1));
    r.atk = Math.max(3, r.atk + (d === "easy" ? -1 : d === "hard" ? 2 : 0));
    if (x != null) { r.x = x; r.y = y; }
    r.role = r.role || (r.boss ? "Capitano avversario" : r.hold ? "Presidia la zona" : "Assalta");
    return makeUnit(r, r.x, r.y, "e", { startHold: !!e.hold });
  }

  // ---------------------------------------------------------------- percorsi / portata
  function reach(u, limit) {
    const dmap = new Map(), prev = new Map();
    const sk = u.y * COLS + u.x;
    dmap.set(sk, 0);
    const queue = [sk];
    while (queue.length) {
      const k = queue.shift();
      const x = k % COLS, y = (k / COLS) | 0, d = dmap.get(k);
      if (d >= limit) continue;
      for (let i = 0; i < 4; i++) {
        const nx = x + DIRS[i][0], ny = y + DIRS[i][1];
        if (!inb(nx, ny)) continue;
        const nk = ny * COLS + nx;
        if (dmap.has(nk)) continue;
        if (!u.fly && isWall(nx, ny)) continue;
        const o = unitAt(nx, ny);
        if (o && o.team !== u.team) continue;
        dmap.set(nk, d + 1); prev.set(nk, k); queue.push(nk);
      }
    }
    const stops = [];
    dmap.forEach((d, k) => {
      const x = k % COLS, y = (k / COLS) | 0;
      if (isWall(x, y)) return;
      const o = unitAt(x, y);
      if (o && o !== u) return;
      stops.push({ x, y, k, d });
    });
    return { dmap, prev, stops };
  }
  function pathTo(R, k) {
    const p = [];
    while (k != null) { p.unshift({ x: k % COLS, y: (k / COLS) | 0 }); k = R.prev.get(k); }
    return p.slice(1);
  }
  function ringTiles(x, y, rng, out) {
    for (let dy = -rng[1]; dy <= rng[1]; dy++) {
      for (let dx = -rng[1]; dx <= rng[1]; dx++) {
        const m = Math.abs(dx) + Math.abs(dy);
        if (m < rng[0] || m > rng[1]) continue;
        const nx = x + dx, ny = y + dy;
        if (inb(nx, ny)) out.add(ny * COLS + nx);
      }
    }
  }
  function threatSet(u, R) {
    const set = new Set();
    R.stops.forEach((s) => ringTiles(s.x, s.y, u.rng, set));
    R.stops.forEach((s) => set.delete(s.k));
    return set;
  }
  function targetsFrom(u, x, y, rng) {
    rng = rng || u.rng;
    return S.units.filter((t) => t.hp > 0 && t.team !== u.team && (() => { const m = Math.abs(t.x - x) + Math.abs(t.y - y); return m >= rng[0] && m <= rng[1]; })());
  }

  // ---------------------------------------------------------------- combattimento
  function combat(a, d, o) {
    o = o || {};
    const adv = advOf(a.style, d.style);
    const cov = isCover(d.x, d.y) ? 1 : 0;
    let dmg = Math.max(1, a.atk + (o.bonus || 0) + adv * 2 - d.def - cov * 2);
    if (d.guard) dmg = Math.max(1, Math.ceil(dmg / 2));
    const hit = clamp(80 + (a.skl - d.spd) * 3 + adv * 15 - cov * 15, 25, 100);
    const crit = clamp((a.skl - 2) * 2 + (adv > 0 ? 8 : 0), 0, 40);
    let critDmg = Math.round(dmg * 1.6);
    if (d.guard) critDmg = Math.max(1, Math.ceil(critDmg));
    const m = dist(a, d);
    let counter = null;
    if (!o.noCounter && m >= d.rng[0] && m <= d.rng[1]) {
      counter = combat(d, a, { noCounter: true });
    }
    return { adv, dmg, hit, crit, critDmg, counter };
  }

  function floater(x, y, text, color, big) {
    S.floaters.push({ x, y, text, color: color || "#fff", t0: performance.now(), big: !!big });
  }
  function sparks(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 3;
      S.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 1, color });
    }
  }

  function applyHit(a, d, o) {
    o = o || {};
    const f = combat(a, d, o);
    const hit = Math.random() * 100 < f.hit;
    if (!hit) {
      floater(d.x, d.y, "Parata!", "#cbd5e1");
      snd("playBounce");
      return { hit: false, dmg: 0 };
    }
    const crit = Math.random() * 100 < f.crit;
    const dmg = crit ? f.critDmg : f.dmg;
    d.hp = Math.max(0, d.hp - dmg);
    d.flash = 1;
    floater(d.x, d.y, (crit ? "CRITICO " : "") + "-" + dmg, crit ? "#ffb703" : "#ff6b6b", crit);
    sparks(d.x, d.y, crit ? "#ffd166" : "#fff", crit ? 14 : 6);
    S.shake = Math.max(S.shake, crit ? 9 : 4);
    snd(crit ? "playEmblemCrit" : "playEmblemClash");
    if (d.hp > 0 && d.rage && !d.raged && d.hp <= d.maxHp / 2) {
      d.raged = true; d.atk += d.rage; d.flash = 1;
      floater(d.x, d.y - 0.4, "Furia!", "#ff9f1c", true);
      sparks(d.x, d.y, "#ff9f1c", 16);
    }
    if (d.hp <= 0) {
      d.alphaT = 0;
      if (d.team === "p") S.stats.ko++;
      else S.stats.kills++;
      floater(d.x, d.y - 0.4, d.team === "p" ? "Ko!" : "Fuori!", "#fff", true);
    }
    return { hit: true, dmg, crit };
  }

  async function lunge(a, d) {
    const vx = Math.sign(d.x - a.x), vy = Math.sign(d.y - a.y);
    const m = dist(a, d);
    if (m > 1) {
      S.proj = { x0: a.x, y0: a.y, x1: d.x, y1: d.y, t0: performance.now(), dur: 260 * FAST() + 1 };
      await wait(270);
      S.proj = null;
    } else {
      a.lunge = { vx, vy, t0: performance.now() };
      await wait(170);
    }
  }

  async function duel(a, d, o) {
    o = o || {};
    S.focus = d;
    await lunge(a, d);
    applyHit(a, d, o);
    await wait(380);
    if (d.hp > 0 && !o.noCounter) {
      const m = dist(a, d);
      if (m >= d.rng[0] && m <= d.rng[1]) {
        await lunge(d, a);
        applyHit(d, a, {});
        await wait(380);
      }
    }
    S.focus = null;
    if (checkEnd()) return;
  }

  // ---------------------------------------------------------------- fine partita
  function checkEnd() {
    if (S.over) return true;
    const leo = S.units.find((u) => u.pid === "leo");
    if (leo && leo.hp <= 0) { finish(false, "Leo è ko: la squadra deve ritirarsi."); return true; }
    const vip = S.units.find((u) => u.vip);
    if (vip && vip.hp <= 0) { finish(false, vip.name + " è ko: la missione è fallita."); return true; }
    if (!squad().length) { finish(false, "Tutta la squadra è ko."); return true; }
    const t = S.ch.obj.type;
    if (t === "rout" && !team("e").length && !wavesPending()) { finish(true); return true; }
    if (t === "boss" && !S.units.some((u) => u.boss && u.hp > 0)) { finish(true); return true; }
    if (t === "reach" && leo && leo.hp > 0 && tileAt(leo.x, leo.y) === "G") { finish(true); return true; }
    return false;
  }

  async function finish(win, reason) {
    if (S.over) return;
    S.over = true; S.busy = true; S.mode = "idle"; S.sel = null;
    renderPanel();
    await wait(win ? 900 : 700);
    if (!alive) return;
    showResult(win, reason);
  }

  // ---------------------------------------------------------------- turni
  function squad() { return team("p").filter((u) => !u.vip); }
  function wavesPending() { return (S.ch.waves || []).some((w) => w.turn >= S.turn && !(S.wavesDone && S.wavesDone[w.turn])); }
  function startBattle(ci) {
    const ch = CHAPTERS[ci];
    S = {
      ci, ch, units: [], uid: 1, turn: 1, phase: "player", mode: "idle", sel: null, insp: null, busy: false, over: false,
      floaters: [], parts: [], shake: 0, proj: null, focus: null, active: null, stats: { ko: 0, kills: 0 }, wavesDone: {}, beatsDone: {},
      moveSet: new Set(), threat: new Set(), R: null, atkList: [], abTargets: [], target: null, abMode: null, origin: null, msg: ""
    };
    ch.team.forEach((p) => S.units.push(buildPlayer(p[0], p[1], p[2])));
    if (ch.vip) S.units.push(buildVip(ch.vip));
    ch.enemies.forEach((e) => S.units.push(buildEnemy(e)));
    S.units.forEach((u) => { u.alpha = 1; });
    S.msg = hintFor();
    showScreen("");
    layoutCanvas();
    updateBar();
    renderPanel();
  }

  function hintFor() {
    if (S.ch.id === "ch1" && S.turn === 1) return "Tocca Leo (il capitano) per vedere dove può muoversi.";
    if (S.ch.id === "ch1" && S.turn === 2) return "Sfrutta il triangolo: Tecnica batte Potenza. Tocca un rivale per vedere il suo raggio.";
    if (S.ch.hint1 && S.turn === 1) return S.ch.hint1;
    return "Tocca un tuo giocatore. Quando hai finito, premi Fine turno.";
  }

  function startPlayerTurn() {
    S.phase = "player"; S.busy = false; S.mode = "idle"; S.sel = null; S.insp = null; S.active = null;
    S.units.forEach((u) => {
      if (u.team === "p" && !u.vip) { u.acted = false; u.moved = false; u.guard = false; if (u.cd > 0) u.cd--; }
    });
    S.msg = hintFor();
    snd("playWhistle");
    updateBar();
    renderPanel();
    checkBeats();
  }

  // dialoghi a metà battaglia: a un dato turno, oppure quando il capitano scende a metà energia
  function checkBeats() {
    if (!S || S.over || !S.ch.beats) return;
    const boss = S.units.find((u) => u.boss);
    const b = S.ch.beats.find((x) => !S.beatsDone[x.id] && ((x.turn && x.turn === S.turn) || (x.bossHalf && boss && boss.hp > 0 && boss.hp <= boss.maxHp / 2)));
    if (!b) return;
    S.beatsDone[b.id] = true;
    S.busy = true;
    renderPanel();
    showDialogue(b.lines, 0, () => {
      showScreen("");
      if (!S) return;
      S.busy = false;
      renderPanel();
    }, { beat: true });
  }

  function allActed() { return squad().every((u) => u.acted); }

  function maybeAutoEnd() {
    if (S.over) return;
    if (allActed()) { S.busy = true; renderPanel(); wait(450).then(() => { if (alive && S && !S.over) endPlayerTurn(true); }); }
  }

  function endPlayerTurn(auto) {
    if (!S || S.busy && !auto || S.over || S.phase !== "player") return;
    S.sel = null; S.insp = null; S.mode = "idle"; S.phase = "enemy"; S.busy = true;
    S.msg = "Turno avversario...";
    updateBar(); renderPanel();
    runEnemyPhase();
  }

  async function runEnemyPhase() {
    await wait(450);
    const order = team("e").sort((a, b) => nearestPlayerDist(a) - nearestPlayerDist(b));
    for (const e of order) {
      if (!alive || S.over) return;
      if (e.hp <= 0) continue;
      await enemyAct(e);
      if (S.over || !alive) return;
    }
    S.active = null;
    // fine turno avversario
    const obj = S.ch.obj;
    if ((obj.type === "survive" || obj.type === "protect") && S.turn >= obj.turns) { finish(true); return; }
    if (obj.type === "hold" && S.turn >= obj.turns) {
      if (squad().some((u) => tileAt(u.x, u.y) === "G")) { finish(true); return; }
      finish(false, "Il Falò si è spento: nessuno lo presidiava allo scadere del tempo."); return;
    }
    if (obj.type === "reach" && S.turn >= obj.turns) { finish(false, obj.fail || "Il Faro resta spento: tempo scaduto."); return; }
    // rinforzi
    const wave = (S.ch.waves || []).find((w) => w.turn === S.turn);
    if (wave) {
      S.wavesDone[wave.turn] = true;
      S.msg = "Arrivano rinforzi!";
      renderPanel();
      const free = [];
      for (let x = 0; x < COLS; x++) if (!isWall(x, 0) && !unitAt(x, 0)) free.push(x);
      wave.list.forEach((e) => {
        if (!free.length) return;
        const x = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        const u = buildEnemy(e, x, 0);
        u.alpha = 0; u.alphaT = 1;
        S.units.push(u);
        sparks(x, 0, "#fff", 8);
      });
      snd("playWhistle");
      await wait(700);
    }
    S.turn++;
    startPlayerTurn();
  }

  function nearestPlayerDist(e) {
    let m = 99;
    team("p").forEach((p) => { m = Math.min(m, dist(e, p)); });
    return m;
  }

  function distMapToPlayers(e) {
    const dm = new Map();
    const queue = [];
    team("p").forEach((p) => { const k = p.y * COLS + p.x; dm.set(k, 0); queue.push(k); });
    while (queue.length) {
      const k = queue.shift();
      const x = k % COLS, y = (k / COLS) | 0, d = dm.get(k);
      for (let i = 0; i < 4; i++) {
        const nx = x + DIRS[i][0], ny = y + DIRS[i][1];
        if (!inb(nx, ny)) continue;
        const nk = ny * COLS + nx;
        if (dm.has(nk)) continue;
        if (!e.fly && isWall(nx, ny)) continue;
        dm.set(nk, d + 1); queue.push(nk);
      }
    }
    return dm;
  }

  async function stepPath(u, path) {
    for (const p of path) {
      u.x = p.x; u.y = p.y;
      await wait(105);
    }
    await wait(60);
  }

  async function enemyAct(e) {
    S.active = e;
    await wait(220);
    const diff = save.diff;
    const R = reach(e, e.mov);
    const options = [];
    R.stops.forEach((s) => {
      targetsFrom(e, s.x, s.y).forEach((t) => {
        // valutazione dalla casella ipotetica
        const ox = e.x, oy = e.y;
        e.x = s.x; e.y = s.y;
        const f = combat(e, t, {});
        e.x = ox; e.y = oy;
        let sc = (f.hit / 100) * Math.min(f.dmg, t.hp);
        if (f.dmg >= t.hp) sc += (f.hit / 100) * 25;
        if (f.adv > 0) sc += 3;
        if (f.counter) sc -= (f.counter.hit / 100) * Math.min(f.counter.dmg, e.hp) * (diff === "hard" ? 0.9 : diff === "easy" ? 0.15 : 0.5);
        if (t.leader) sc += diff === "hard" ? 10 : diff === "normal" ? 4 : 0;
        if (t.vip) sc += diff === "hard" ? 6 : diff === "normal" ? 3 : 0;
        sc += (1 - t.hp / t.maxHp) * 4;
        if (diff !== "easy" && isCover(s.x, s.y)) sc += 1.5;
        sc -= s.d * 0.02;
        options.push({ s, t, sc });
      });
    });
    let choice = null;
    if (options.length) {
      options.sort((a, b) => b.sc - a.sc);
      choice = (diff === "easy" && Math.random() < 0.4) ? options[Math.floor(Math.random() * options.length)] : options[0];
    }
    if (choice) {
      if (choice.s.k !== e.y * COLS + e.x) await stepPath(e, pathTo(R, choice.s.k));
      if (e.hp > 0 && choice.t.hp > 0) await duel(e, choice.t, {});
      if (S.over) return;
    } else if (!e.hold || e.hp < e.maxHp) {
      const dm = distMapToPlayers(e);
      let best = null;
      R.stops.forEach((s) => {
        const dd = dm.has(s.k) ? dm.get(s.k) : 99;
        const sc = dd * 10 - (isCover(s.x, s.y) ? 1 : 0) + s.d * 0.01;
        if (!best || sc < best.sc) best = { s, sc };
      });
      if (best && best.s.k !== e.y * COLS + e.x) await stepPath(e, pathTo(R, best.s.k));
    } else {
      await wait(120);
    }
    e.acted = true;
    S.active = null;
  }

  // ---------------------------------------------------------------- input giocatore
  function deselect() {
    S.sel = null; S.mode = "idle"; S.moveSet = new Set(); S.threat = new Set(); S.atkList = []; S.target = null; S.abMode = null; S.abTargets = [];
  }

  function select(u) {
    S.sel = u; S.insp = null; S.target = null; S.abMode = null;
    S.origin = { x: u.x, y: u.y };
    S.mode = u.moved ? "moved" : "selected";
    refreshSel();
    snd("playSelect");
    S.msg = "";
    renderPanel();
  }

  function refreshSel() {
    const u = S.sel;
    if (S.mode === "selected") {
      S.R = reach(u, u.mov);
      S.moveSet = new Set(S.R.stops.map((s) => s.k));
      S.threat = threatSet(u, S.R);
    } else {
      S.R = null; S.moveSet = new Set(); S.threat = new Set();
    }
    S.atkList = targetsFrom(u, u.x, u.y);
  }

  function inspect(e) {
    S.insp = e;
    const R = reach(e, e.mov);
    S.inspMove = new Set(R.stops.map((s) => s.k));
    S.inspThreat = threatSet(e, R);
    snd("playSelect");
    renderPanel();
  }

  function onCell(gx, gy) {
    if (!S || S.busy || S.over || S.phase !== "player") return;
    if (!inb(gx, gy)) return;
    const u = unitAt(gx, gy);
    const k = gy * COLS + gx;
    const m = S.mode;
    if (m === "idle") {
      if (u && u.team === "p" && !u.acted) select(u);
      else if (u && u.team === "e") inspect(u);
      else if (u && u.team === "p") { S.insp = u; S.inspMove = new Set(); S.inspThreat = new Set(); renderPanel(); }
      else { S.insp = null; renderPanel(); }
      return;
    }
    if (m === "selected" || m === "moved") {
      const s = S.sel;
      if (u === s) { if (m === "selected") { S.mode = "moved"; refreshSel(); renderPanel(); } return; }
      if (u && u.team === "e" && S.atkList.includes(u)) { askAttack(u, null); return; }
      if (m === "selected" && !u && S.moveSet.has(k)) { moveSel(gx, gy); return; }
      if (u && u.team === "p" && !u.acted && m === "selected") { select(u); return; }
      if (u && u.team === "e") { inspect(u); return; }
      if (m === "selected") { deselect(); S.insp = null; renderPanel(); }
      return;
    }
    if (m === "confirm") {
      if (u && u === S.target) { doConfirm(); return; }
      cancelConfirm();
      return;
    }
    if (m === "ability") {
      if (u && S.abTargets.includes(u)) { abilityOn(u); return; }
      if (S.abMode && S.abMode.ally && u && S.abTargets.includes(u)) return;
      cancelAbility();
      return;
    }
    if (m === "retreat") {
      if (S.moveSet.has(k) && (!u || u === S.sel)) retreatTo(gx, gy);
      return;
    }
  }

  async function moveSel(gx, gy) {
    const s = S.sel;
    const R = S.R;
    const path = pathTo(R, gy * COLS + gx);
    S.busy = true; renderPanel();
    s.moved = true;
    snd("playBounce");
    await stepPath(s, path);
    S.busy = false;
    S.mode = "moved";
    refreshSel();
    if (checkEnd()) return;
    S.msg = "";
    renderPanel();
  }

  function undoMove() {
    const s = S.sel;
    if (!s || !S.origin) return;
    s.x = S.origin.x; s.y = S.origin.y; s.moved = false;
    S.mode = "selected"; S.target = null;
    refreshSel();
    renderPanel();
  }

  function askAttack(t, opts) {
    S.target = t; S.abMode = opts || null;
    S.mode = "confirm";
    renderPanel();
  }
  function cancelConfirm() {
    S.target = null; S.abMode = null;
    S.mode = S.sel && S.sel.moved ? "moved" : "selected";
    refreshSel();
    renderPanel();
  }

  async function doConfirm() {
    const a = S.sel, d = S.target, ab = S.abMode;
    if (!a || !d) return;
    S.busy = true; S.mode = "idle"; S.target = null; S.abMode = null;
    S.moveSet = new Set(); S.threat = new Set(); S.atkList = [];
    renderPanel();
    const o = {};
    if (ab && ab.id === "cannone") { o.bonus = 3; o.noCounter = true; a.cd = ROSTER.tommy.ab.cd + 1; floater(a.x, a.y, "Cannone!", "#ffd166", true); }
    if (ab && ab.id === "fuga") { a.cd = ROSTER.nico.ab.cd + 1; floater(a.x, a.y, "Colpo e fuga!", "#ffd166", true); }
    await duel(a, d, o);
    if (S.over || !alive) return;
    if (ab && ab.id === "fuga" && a.hp > 0) {
      const R = reach(a, 3);
      S.R = R; S.moveSet = new Set(R.stops.map((s) => s.k));
      S.sel = a; S.mode = "retreat"; S.busy = false;
      S.msg = "Tocca una casella per ripiegare.";
      renderPanel();
      return;
    }
    a.acted = true;
    S.busy = false; deselect(); S.msg = "";
    renderPanel();
    maybeAutoEnd();
  }

  async function retreatTo(gx, gy) {
    const a = S.sel;
    const path = pathTo(S.R, gy * COLS + gx);
    S.busy = true; renderPanel();
    await stepPath(a, path);
    a.acted = true;
    S.busy = false; deselect(); S.msg = "";
    renderPanel();
    maybeAutoEnd();
  }

  function waitSel() {
    const s = S.sel;
    if (!s) return;
    s.acted = true; s.moved = true;
    deselect(); S.msg = "";
    snd("playSelect");
    renderPanel();
    maybeAutoEnd();
  }

  function abilityReady(u) { return u.ab && u.cd <= 0; }

  function abilityTargets(u) {
    const id = u.ab && u.ab.id;
    if (id === "lancio") return S.units.filter((x) => x.hp > 0 && x.team === "p" && !x.vip && x !== u && x.acted && dist(u, x) <= 3);
    if (id === "borraccia") return S.units.filter((x) => x.hp > 0 && x.team === "p" && x.hp < x.maxHp && dist(u, x) <= 2);
    if (id === "cannone") return targetsFrom(u, u.x, u.y, [2, 3]);
    if (id === "fuga") return targetsFrom(u, u.x, u.y, [1, 1]);
    if (id === "muro") return [u];
    return [];
  }

  function useAbility() {
    const u = S.sel;
    if (!u || !abilityReady(u)) return;
    const id = u.ab.id;
    const tg = abilityTargets(u);
    if (!tg.length) return;
    if (id === "muro") {
      u.guard = true; u.cd = u.ab.cd + 1; u.acted = true; u.moved = true;
      floater(u.x, u.y, "Muro! (-50%)", "#7db4ff", true);
      sparks(u.x, u.y, "#7db4ff", 10);
      snd("playWall");
      deselect(); S.msg = ""; renderPanel(); maybeAutoEnd();
      return;
    }
    S.mode = "ability"; S.abMode = u.ab; S.abTargets = tg;
    S.msg = id === "lancio" ? "Scegli il compagno che deve ripartire." : id === "borraccia" ? "Scegli chi rifocillare." : "Scegli il bersaglio.";
    renderPanel();
  }

  function abilityOn(t) {
    const u = S.sel, ab = S.abMode;
    if (ab.id === "cannone" || ab.id === "fuga") { askAttack(t, ab); return; }
    if (ab.id === "lancio") {
      t.acted = false; t.moved = false;
      u.acted = true; u.moved = true; u.cd = ab.cd + 1;
      floater(t.x, t.y, "Ancora in gioco!", "#7ee0a1", true);
      sparks(t.x, t.y, "#7ee0a1", 12);
      snd("playKick");
    } else if (ab.id === "borraccia") {
      const before = t.hp;
      t.hp = Math.min(t.maxHp, t.hp + 10);
      u.acted = true; u.moved = true; u.cd = ab.cd + 1;
      floater(t.x, t.y, "+" + (t.hp - before), "#7ee0a1", true);
      sparks(t.x, t.y, "#7ee0a1", 10);
      snd("playSelect");
    }
    deselect(); S.msg = ""; renderPanel(); maybeAutoEnd();
  }

  function cancelAbility() {
    S.abMode = null; S.abTargets = [];
    S.mode = S.sel && S.sel.moved ? "moved" : "selected";
    refreshSel();
    S.msg = "";
    renderPanel();
  }

  // ---------------------------------------------------------------- ritratti
  // Usa window.__borgoApi.portraitImg (game.js): disegna il busto del personaggio e restituisce un dataURL. Tutto in try/catch:
  // senza Borgo (o senza ritratto) si ripiega sull'iniziale colorata. Chi non ha una scheda nel Borgo usa un profilo semplice (spec).
  const mkP = (name, hair, style, skin, b0, b1, shirt, x) => Object.assign({ name, tag: "", hair, style, skin, eye: "#2a2a2a", bg: [b0, b1], shirt }, x || {});
  const PORTS = {
    leo: ["leo"], nico: ["nico"], sara: ["sara"], tommy: ["tommy"],
    chicco: ["em_chicco", mkP("Chicco", "#222", "messy", "#d9a066", "#1d4ed8", "#7dd3fc", "#1d4ed8")],
    baciccia: ["baciccia"], aurelio: ["aurelio"], pina: ["pina"], nonna: ["nonna"], settimio: ["settimio"], anselmo: ["anselmo"], ester: ["ester"], rocco: ["rocco"], tonino: ["tonino"], pietrino: ["pietrino"],
    ginetta: ["ginetta_molo", mkP("Ginetta Bandierina", "#7c2d12", "long", "#f1c6a0", "#fde68a", "#f97316", "#111827")],
    arturo: ["arturo_molo", mkP("Arturo Altoparlante", "#6b7280", "messy", "#e9be95", "#7dd3fc", "#e0f2fe", "#0e7490", { glasses: true })],
    tullio: ["don_tullio", mkP("Don Tullio", "#c9c5bd", "buzz", "#d49a68", "#78350f", "#d6b98c", "#78716c", { beard: true, cap: "#57534e" })],
    spigola: ["presidente_spigola", mkP("Presidente Spigola", "#2a2a2a", "slick", "#e0b48a", "#7c2d12", "#fcd34d", "#7c2d12", { cap: "#7c2d12" })],
    gino: ["em_gino", mkP("Gino il Mozzo", "#555", "buzz", "#d9a066", "#9a6b2f", "#fcd9a0", "#9a6b2f", { beard: true })],
    vanni: ["em_vanni", mkP("Capitan Vanni", "#9ca3af", "slick", "#d9a066", "#111827", "#b91c1c", "#111827", { beard: true, cap: "#111827" })],
    gancio: ["em_gancio", mkP("Mastro Gancio", "#111", "slick", "#c68642", "#312e81", "#a5b4fc", "#312e81", { beard: true })],
    libeccio: ["em_libeccio", mkP("Zio Libeccio", "#d8d4cc", "messy", "#d49a68", "#7c2d12", "#fdba74", "#7c2d12", { beard: true })]
  };
  const SPEAKER_KEY = {
    "Leo": "leo", "Nico": "nico", "Sara": "sara", "Tommy": "tommy", "Chicco": "chicco", "Baciccia": "baciccia", "Don Aurelio": "aurelio", "Pina": "pina", "Nonna Ferri": "nonna",
    "Settimio": "settimio", "Anselmo": "anselmo", "Ester": "ester", "Rocco": "rocco", "Tonino": "tonino", "Pietrino": "pietrino", "Ginetta": "ginetta", "Arturo": "arturo",
    "Don Tullio": "tullio", "Presidente Spigola": "spigola", "Gino il Mozzo": "gino", "Capitan Vanni": "vanni", "Mastro Gancio": "gancio", "Zio Libeccio": "libeccio"
  };
  const SPEAKER_COL = {
    Leo: "#1d4ed8", Nico: "#d97706", Sara: "#be185d", Chicco: "#15803d", Tommy: "#7c3aed", Baciccia: "#475569", "Don Aurelio": "#6b21a8", "Capitan Vanni": "#7f1d1d", "Gino il Mozzo": "#9a6b2f",
    Pina: "#0f766e", "Nonna Ferri": "#0369a1", Settimio: "#4d7c0f", Anselmo: "#b45309", Ester: "#1e3a8a", Rocco: "#0e7490", Tonino: "#db2777", Pietrino: "#ca8a04", Ginetta: "#ea580c",
    Arturo: "#0e7490", "Don Tullio": "#78716c", "Presidente Spigola": "#b45309", "Mastro Gancio": "#4338ca", "Zio Libeccio": "#9a3412"
  };
  const portCache = {};
  function portrait(key) {
    if (!key) return "";
    if (portCache[key]) return portCache[key];
    let url = "";
    try {
      const api = window.__borgoApi, p = PORTS[key];
      if (p && api && typeof api.portraitImg === "function") url = api.portraitImg(p[0], p[1]) || "";
    } catch (e) { url = ""; }
    if (url) portCache[key] = url;
    return url;
  }
  const STYLES_P = ["spiky", "messy", "buzz", "slick", "bun", "long"];
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
  // ritratto di un'unità: giocatori e personaggi con scheda -> pid/por; i rivali generici ricevono un profilo semplice coi loro colori
  function unitPortrait(u) {
    try {
      let key = u.pid || u.por;
      if (key && PORTS[key]) return portrait(key);
      key = "a:" + u.name;
      if (!PORTS[key]) {
        const h = hashStr(u.name);
        const st = u.fx === "gull" || u.fx === "cat" || u.fx === "crab" ? "spiky" : STYLES_P[h % STYLES_P.length];
        PORTS[key] = ["em_a" + h, mkP(u.name, u.hair || "#333", st, u.skin || "#e8b88a", u.kit || "#334155", u.fx ? "#fef3c7" : "#cbd5e1", u.kit || "#334155", { beard: !u.fx && h % 5 === 0 })];
      }
      return portrait(key);
    } catch (e) { return ""; }
  }
  function ptImg(url, size, col, cls) {
    return url ? `<img class="rem-pt ${cls || ""}" src="${url}" alt="" width="${size}" height="${size}" style="width:${size}px;height:${size}px;border-color:${col || "#38bdf8"}">` : "";
  }
  function colorOf(name) { return SPEAKER_COL[name] || "#475569"; }

  // ---------------------------------------------------------------- sfondi
  // Ogni capitolo ha un tema: cielo/mare/profili disegnati a canvas con gradienti (nessuna immagine esterna). Le funzioni scalano su w x h.
  const sr = (i) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  function skyG(c, w, h, stops, y1) {
    const g = c.createLinearGradient(0, 0, 0, y1 || h);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function starsF(c, w, maxY, n, now) {
    for (let i = 0; i < n; i++) {
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(now / 800 + i * 1.3));
      c.fillStyle = `rgba(255,255,255,${(tw * 0.85).toFixed(2)})`;
      c.fillRect(sr(i) * w, sr(i + 77) * maxY, 1.6, 1.6);
    }
  }
  function seaF(c, w, h, y0, a, b, now, amp, foam) {
    const g = c.createLinearGradient(0, y0, 0, h);
    g.addColorStop(0, a); g.addColorStop(1, b);
    c.fillStyle = g; c.fillRect(0, y0, w, h - y0);
    c.lineWidth = 1.4;
    for (let r = 0; r < 5; r++) {
      const y = y0 + (h - y0) * (0.12 + r * 0.19);
      c.strokeStyle = foam || "rgba(255,255,255,0.14)";
      c.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const yy = y + Math.sin(x / (22 + r * 6) + now / (700 - r * 60) + r) * amp * (0.6 + r * 0.25);
        if (x === 0) c.moveTo(x, yy); else c.lineTo(x, yy);
      }
      c.stroke();
    }
  }
  function cloudF(c, x, y, s, a) {
    c.fillStyle = `rgba(255,255,255,${a})`;
    [[0, 0, 1], [0.9, 0.2, 0.8], [-0.9, 0.25, 0.7], [0.3, -0.35, 0.8]].forEach((p) => { c.beginPath(); c.arc(x + p[0] * s, y + p[1] * s, p[2] * s * 0.7, 0, Math.PI * 2); c.fill(); });
  }
  function poly(c, pts, fill) { c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); }
  function towerF(c, x, base, hh, now, beam) {
    const bw = hh * 0.2;
    if (beam) {
      const a = Math.sin(now / 1500) * 0.9;
      const g = c.createLinearGradient(x, base - hh, x + Math.sin(a) * hh * 3, base - hh);
      g.addColorStop(0, "rgba(255,240,170,0.5)"); g.addColorStop(1, "rgba(255,240,170,0)");
      c.fillStyle = g;
      const dir = a >= 0 ? 1 : -1;
      c.beginPath(); c.moveTo(x, base - hh); c.lineTo(x + dir * hh * 4, base - hh - hh * 0.5); c.lineTo(x + dir * hh * 4, base - hh + hh * 0.45); c.closePath(); c.fill();
    }
    poly(c, [[x - bw, base], [x - bw * 0.6, base - hh], [x + bw * 0.6, base - hh], [x + bw, base]], "#e2e8f0");
    c.fillStyle = "#dc2626"; c.fillRect(x - bw * 0.8, base - hh * 0.62, bw * 1.6, hh * 0.1); c.fillRect(x - bw * 0.7, base - hh * 0.3, bw * 1.4, hh * 0.1);
    c.fillStyle = "#fde047"; c.fillRect(x - bw * 0.45, base - hh - hh * 0.1, bw * 0.9, hh * 0.1);
    poly(c, [[x - bw * 0.7, base - hh - hh * 0.1], [x, base - hh - hh * 0.22], [x + bw * 0.7, base - hh - hh * 0.1]], "#7f1d1d");
  }
  function boatF(c, x, y, s, col, sail) {
    poly(c, [[x - s, y], [x + s, y], [x + s * 0.7, y + s * 0.4], [x - s * 0.7, y + s * 0.4]], col);
    c.fillStyle = col; c.fillRect(x - 1, y - s * 1.3, 2, s * 1.3);
    if (sail) poly(c, [[x + 2, y - s * 1.25], [x + s * 0.9, y - s * 0.1], [x + 2, y - s * 0.1]], sail);
  }
  function birdsF(c, w, y, now, n, col) {
    c.strokeStyle = col; c.lineWidth = 1.6;
    for (let i = 0; i < n; i++) {
      const x = ((sr(i + 5) * w + now / (40 + i * 7)) % (w + 40)) - 20, yy = y + sr(i + 9) * 40 + Math.sin(now / 400 + i) * 4, f = Math.sin(now / 130 + i) * 3;
      c.beginPath(); c.moveTo(x - 6, yy + f); c.quadraticCurveTo(x - 2, yy - 3, x, yy); c.quadraticCurveTo(x + 2, yy - 3, x + 6, yy + f); c.stroke();
    }
  }
  function glowF(c, x, y, r, col) {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col); g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function housesF(c, w, base, hh, cols, windows, now) {
    let x = -10, i = 0;
    while (x < w) {
      const bw = hh * (0.45 + sr(i + 3) * 0.4), bh = hh * (0.5 + sr(i + 11) * 0.5);
      c.fillStyle = cols[i % cols.length]; c.fillRect(x, base - bh, bw, bh);
      poly(c, [[x - 2, base - bh], [x + bw / 2, base - bh - hh * 0.2], [x + bw + 2, base - bh]], "rgba(60,20,20,0.55)");
      if (windows) for (let k = 0; k < 3; k++) { c.fillStyle = sr(i * 7 + k) > 0.35 ? "rgba(253,224,71,0.85)" : "rgba(30,41,59,0.8)"; c.fillRect(x + bw * (0.15 + 0.3 * (k % 2)), base - bh + hh * (0.12 + 0.2 * Math.floor(k / 2 + (k % 2) * 0.5)), bw * 0.2, hh * 0.1); }
      x += bw + 2; i++;
    }
  }
  function buntingF(c, w, y, sag, now) {
    const cols = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f472b6"];
    c.strokeStyle = "rgba(255,255,255,0.5)"; c.lineWidth = 1;
    c.beginPath(); for (let x = 0; x <= w; x += 8) { const yy = y + Math.sin((x / w) * Math.PI) * sag; if (!x) c.moveTo(x, yy); else c.lineTo(x, yy); } c.stroke();
    for (let x = 6, i = 0; x < w; x += 14, i++) {
      const yy = y + Math.sin((x / w) * Math.PI) * sag + Math.sin(now / 500 + i) * 1.2;
      poly(c, [[x, yy], [x + 8, yy], [x + 4, yy + 11]], cols[i % cols.length]);
    }
  }

  const SCENES = {
    menu(c, w, h, now) {
      skyG(c, w, h, ["#050b18", "#0b1f3a", "#17466b"], h * 0.62);
      starsF(c, w, h * 0.5, 60, now);
      glowF(c, w * 0.2, h * 0.16, h * 0.18, "rgba(226,232,240,0.5)");
      c.fillStyle = "#f1f5f9"; c.beginPath(); c.arc(w * 0.2, h * 0.16, h * 0.04, 0, Math.PI * 2); c.fill();
      poly(c, [[w * 0.55, h * 0.62], [w * 0.7, h * 0.5], [w * 0.9, h * 0.54], [w, h * 0.62]], "#0b1220");
      towerF(c, w * 0.8, h * 0.56, h * 0.26, now, true);
      seaF(c, w, h, h * 0.62, "#0b2a45", "#06101c", now, 2.5);
      for (let i = 0; i < 7; i++) { glowF(c, w * (0.1 + 0.13 * i), h * (0.7 + sr(i) * 0.2), 10, `rgba(253,224,71,${(0.25 + 0.25 * Math.sin(now / 500 + i)).toFixed(2)})`); }
    },
    dusk(c, w, h, now) {
      skyG(c, w, h, ["#312e81", "#9d174d", "#f97316", "#fcd34d"], h * 0.58);
      glowF(c, w * 0.5, h * 0.55, h * 0.4, "rgba(253,186,116,0.6)");
      c.fillStyle = "#fde68a"; c.beginPath(); c.arc(w * 0.5, h * 0.58, h * 0.07, Math.PI, 0); c.fill();
      cloudF(c, w * 0.2 + Math.sin(now / 4000) * 8, h * 0.18, h * 0.05, 0.25);
      cloudF(c, w * 0.78 + Math.sin(now / 5000) * 8, h * 0.28, h * 0.04, 0.2);
      poly(c, [[0, h * 0.58], [w * 0.18, h * 0.5], [w * 0.38, h * 0.58]], "#3b1d4a");
      seaF(c, w, h, h * 0.58, "#7c2d12", "#1e1b4b", now, 2.5, "rgba(253,224,71,0.18)");
      c.fillStyle = "rgba(253,224,71,0.18)"; c.fillRect(w * 0.47, h * 0.58, w * 0.06, h * 0.42);
      boatF(c, w * 0.78, h * 0.62 + Math.sin(now / 700) * 1.5, h * 0.06, "#0f0a1e", "#2a1030");
      boatF(c, w * 0.16, h * 0.66 + Math.sin(now / 800) * 1.5, h * 0.045, "#0f0a1e", null);
      for (let i = 0; i < 6; i++) glowF(c, w * (0.1 + 0.16 * i), h * (0.7 + sr(i + 4) * 0.2), 9, `rgba(253,224,71,${(0.3 + 0.25 * Math.sin(now / 450 + i)).toFixed(2)})`);
    },
    day(c, w, h, now) {
      skyG(c, w, h, ["#38bdf8", "#7dd3fc", "#e0f2fe"], h * 0.6);
      glowF(c, w * 0.8, h * 0.14, h * 0.2, "rgba(254,249,195,0.8)");
      c.fillStyle = "#fef08a"; c.beginPath(); c.arc(w * 0.8, h * 0.14, h * 0.045, 0, Math.PI * 2); c.fill();
      cloudF(c, ((now / 90) % (w + 80)) - 40, h * 0.2, h * 0.05, 0.7);
      cloudF(c, ((now / 130 + w * 0.5) % (w + 80)) - 40, h * 0.34, h * 0.04, 0.55);
      seaF(c, w, h, h * 0.6, "#0ea5e9", "#075985", now, 2.4, "rgba(255,255,255,0.28)");
      c.fillStyle = "#78350f"; c.fillRect(0, h * 0.6, w * 0.34, h * 0.025);
      for (let i = 0; i < 4; i++) c.fillRect(w * (0.03 + i * 0.1), h * 0.6, 3, h * 0.07);
      boatF(c, w * 0.72, h * 0.64 + Math.sin(now / 700) * 1.5, h * 0.06, "#7f1d1d", "#f8fafc");
      birdsF(c, w, h * 0.3, now, 6, "rgba(255,255,255,0.9)");
    },
    faro(c, w, h, now) {
      skyG(c, w, h, ["#020617", "#0f172a", "#1e3a5f"], h * 0.66);
      starsF(c, w, h * 0.5, 70, now);
      glowF(c, w * 0.16, h * 0.15, h * 0.16, "rgba(226,232,240,0.45)");
      c.fillStyle = "#e2e8f0"; c.beginPath(); c.arc(w * 0.16, h * 0.15, h * 0.035, 0, Math.PI * 2); c.fill();
      seaF(c, w, h, h * 0.66, "#0b2540", "#030a15", now, 2.5);
      poly(c, [[w * 0.5, h * 0.66], [w * 0.62, h * 0.5], [w * 0.8, h * 0.46], [w, h * 0.5], [w, h * 0.66]], "#0a1220");
      towerF(c, w * 0.82, h * 0.48, h * 0.34, now, true);
      poly(c, [[0, h * 0.66], [0, h * 0.58], [w * 0.2, h * 0.62], [w * 0.3, h * 0.66]], "#0a1220");
    },
    ship(c, w, h, now) {
      skyG(c, w, h, ["#1c0a0a", "#7f1d1d", "#c2410c"], h * 0.62);
      glowF(c, w * 0.3, h * 0.55, h * 0.3, "rgba(251,146,60,0.45)");
      seaF(c, w, h, h * 0.62, "#3b0a0a", "#0a0305", now, 3, "rgba(251,146,60,0.18)");
      const bob = Math.sin(now / 900) * 2, x = w * 0.5, y = h * 0.62 + bob, s = Math.min(w, h) * 0.42;
      poly(c, [[x - s, y - s * 0.2], [x + s, y - s * 0.2], [x + s * 0.7, y + s * 0.18], [x - s * 0.8, y + s * 0.18]], "#050208");
      [[-0.45, 0.9], [0.1, 1.05], [0.6, 0.8]].forEach((m, i) => {
        c.fillStyle = "#050208"; c.fillRect(x + m[0] * s - 1.5, y - s * m[1] - s * 0.2, 3, s * m[1]);
        poly(c, [[x + m[0] * s + 3, y - s * m[1] - s * 0.1], [x + m[0] * s + s * 0.4 + Math.sin(now / 500 + i) * 3, y - s * 0.4], [x + m[0] * s + 3, y - s * 0.3]], "#14070c");
      });
      c.fillStyle = "#050208"; c.fillRect(x + 0.1 * s, y - s * 1.3, s * 0.18, s * 0.1);
      glowF(c, x - s * 0.3, y - s * 0.1, 18, "rgba(253,224,71,0.6)");
    },
    market(c, w, h, now) {
      skyG(c, w, h, ["#fbcfe8", "#fde68a", "#fed7aa"], h * 0.7);
      glowF(c, w * 0.7, h * 0.4, h * 0.34, "rgba(254,243,199,0.8)");
      housesF(c, w, h * 0.78, Math.min(h * 0.34, w * 0.5), ["#b45309", "#9a3412", "#a16207", "#be123c", "#0f766e"], true, now);
      c.fillStyle = "#6b3f1e"; c.fillRect(0, h * 0.78, w, h * 0.22);
      buntingF(c, w, h * 0.04, h * 0.05, now);
      buntingF(c, w, h * 0.16, h * 0.05, now + 400);
      for (let i = 0; i < 4; i++) { const x = w * (0.1 + i * 0.25); [["#ef4444", "#fff"], ["#3b82f6", "#fff"]][i % 2].forEach((col, k) => { c.fillStyle = col; c.fillRect(x + k * 8, h * 0.74, 8, h * 0.05); }); poly(c, [[x - 4, h * 0.74], [x + 20, h * 0.74], [x + 12, h * 0.7], [x + 4, h * 0.7]], i % 2 ? "#1d4ed8" : "#dc2626"); }
    },
    roofs(c, w, h, now) {
      skyG(c, w, h, ["#7dd3fc", "#bae6fd", "#fde68a"], h * 0.65);
      glowF(c, w * 0.25, h * 0.2, h * 0.3, "rgba(254,243,199,0.9)");
      c.fillStyle = "#fde047"; c.beginPath(); c.arc(w * 0.25, h * 0.2, h * 0.05, 0, Math.PI * 2); c.fill();
      cloudF(c, ((now / 110) % (w + 80)) - 40, h * 0.3, h * 0.05, 0.6);
      const base = h * 0.8;
      for (let i = 0; i < 7; i++) { const x = w * (i / 6) - 8, rw = w * 0.2; poly(c, [[x, base], [x + rw / 2, base - h * (0.16 + sr(i + 2) * 0.1)], [x + rw, base]], ["#b45309", "#9a3412", "#c2410c"][i % 3]); c.fillStyle = "#44403c"; c.fillRect(x + rw * 0.65, base - h * 0.2 - sr(i) * h * 0.05, rw * 0.1, h * 0.07); }
      const tx = w * 0.82; c.fillStyle = "#d6d3d1"; c.fillRect(tx - w * 0.05, base - h * 0.45, w * 0.1, h * 0.45); poly(c, [[tx - w * 0.06, base - h * 0.45], [tx, base - h * 0.58], [tx + w * 0.06, base - h * 0.45]], "#9a3412");
      c.fillStyle = "#292524"; c.fillRect(tx - w * 0.02, base - h * 0.38, w * 0.04, h * 0.08);
      c.fillStyle = "#fbbf24"; c.beginPath(); c.arc(tx + Math.sin(now / 300) * 2, base - h * 0.3, h * 0.02, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#7c2d12"; c.fillRect(0, base, w, h - base);
      birdsF(c, w, h * 0.14, now, 5, "rgba(30,41,59,0.8)");
    },
    cliff(c, w, h, now) {
      skyG(c, w, h, ["#01030a", "#0b1530", "#1e293b"], h * 0.6);
      starsF(c, w, h * 0.45, 50, now);
      seaF(c, w, h, h * 0.6, "#0a1c34", "#02060d", now, 3);
      for (let i = 0; i < 5; i++) glowF(c, w * (0.12 + sr(i + 20) * 0.76), h * (0.62 + sr(i + 30) * 0.08) + Math.sin(now / 800 + i) * 1.5, 8, "rgba(253,224,71,0.55)");
      poly(c, [[0, h * 0.64], [0, h * 0.4], [w * 0.14, h * 0.36], [w * 0.26, h * 0.52], [w * 0.34, h * 0.64]], "#05080f");
      poly(c, [[w, h * 0.66], [w, h * 0.34], [w * 0.88, h * 0.4], [w * 0.74, h * 0.5], [w * 0.68, h * 0.66]], "#05080f");
      glowF(c, w * 0.5, h * 0.62, h * 0.32, `rgba(251,146,60,${(0.4 + 0.12 * Math.sin(now / 90)).toFixed(2)})`);
      c.fillStyle = "#fb923c"; poly(c, [[w * 0.47, h * 0.66], [w * 0.5 + Math.sin(now / 80) * 2, h * 0.55], [w * 0.53, h * 0.66]], "#fb923c");
    },
    beach(c, w, h, now) {
      skyG(c, w, h, ["#38bdf8", "#bae6fd", "#fef9c3"], h * 0.4);
      glowF(c, w * 0.15, h * 0.12, h * 0.2, "rgba(254,249,195,0.9)");
      c.fillStyle = "#fde047"; c.beginPath(); c.arc(w * 0.15, h * 0.12, h * 0.045, 0, Math.PI * 2); c.fill();
      seaF(c, w, h * 0.55, h * 0.3, "#22d3ee", "#0e7490", now, 2.2, "rgba(255,255,255,0.35)");
      c.fillStyle = "#e8cf8a"; c.fillRect(0, h * 0.5, w, h * 0.5);
      c.strokeStyle = "rgba(255,255,255,0.8)"; c.lineWidth = 2; c.beginPath(); for (let x = 0; x <= w; x += 6) { const yy = h * 0.5 + Math.sin(x / 18 + now / 500) * 3; if (!x) c.moveTo(x, yy); else c.lineTo(x, yy); } c.stroke();
      const fx = ((now / 25) % (w + 60)) - 30; poly(c, [[fx, h * 0.42], [fx + 12, h * 0.42], [fx + 4, h * 0.36]], "#334155");
      c.strokeStyle = "rgba(255,255,255,0.5)"; c.beginPath(); c.moveTo(fx - 4, h * 0.425); c.lineTo(fx + 16, h * 0.425); c.stroke();
      c.fillStyle = "#b91c1c"; c.fillRect(w * 0.82, h * 0.66, 2, h * 0.14); poly(c, [[w * 0.82 - 16, h * 0.66], [w * 0.82 + 18, h * 0.66], [w * 0.82 + 1, h * 0.6]], "#ef4444");
      birdsF(c, w, h * 0.1, now, 3, "rgba(30,41,59,0.7)");
    },
    storm(c, w, h, now) {
      skyG(c, w, h, ["#020617", "#0f172a", "#334155"], h * 0.6);
      for (let i = 0; i < 6; i++) cloudF(c, ((sr(i) * w * 1.4 + now / (140 + i * 20)) % (w + 120)) - 60, h * (0.06 + sr(i + 4) * 0.2), h * 0.09, 0.5 - i * 0.04);
      const ph = (now % 4800) / 4800, fl = ph < 0.03 ? 1 : ph > 0.05 && ph < 0.07 ? 0.6 : 0;
      if (fl) { c.fillStyle = `rgba(226,232,240,${0.35 * fl})`; c.fillRect(0, 0, w, h); c.strokeStyle = `rgba(254,249,195,${fl})`; c.lineWidth = 2.5; c.beginPath(); c.moveTo(w * 0.7, 0); c.lineTo(w * 0.66, h * 0.15); c.lineTo(w * 0.72, h * 0.2); c.lineTo(w * 0.63, h * 0.42); c.stroke(); }
      seaF(c, w, h, h * 0.6, "#134e4a", "#020a0a", now, 5.5, "rgba(203,213,225,0.22)");
      boatF(c, w * 0.2, h * 0.66 + Math.sin(now / 350) * 4, h * 0.05, "#020617", null);
      boatF(c, w * 0.8, h * 0.7 + Math.sin(now / 400 + 2) * 4, h * 0.045, "#020617", null);
    },
    stadium(c, w, h, now) {
      skyG(c, w, h, ["#1e1b4b", "#6d28d9", "#fb923c"], h * 0.55);
      starsF(c, w, h * 0.25, 30, now);
      const base = h * 0.58;
      for (let r = 0; r < 4; r++) { c.fillStyle = ["#292524", "#1c1917", "#292524", "#1c1917"][r]; c.fillRect(0, base - h * 0.04 * (4 - r), w, h * 0.05); for (let k = 0; k < 40; k++) { c.fillStyle = ["#ef4444", "#fbbf24", "#60a5fa", "#f472b6", "#a3e635"][(k + r) % 5]; const yy = base - h * 0.04 * (4 - r) + Math.sin(now / 250 + k + r) * 1.2; c.fillRect((k / 40) * w + sr(k + r * 9) * 4, yy + 2, 3, 4); } }
      [0.1, 0.9].forEach((p) => { c.fillStyle = "#44403c"; c.fillRect(w * p - 2, h * 0.12, 4, base - h * 0.12); glowF(c, w * p, h * 0.12, h * 0.16, "rgba(254,249,195,0.85)"); c.fillStyle = "#fffbeb"; c.fillRect(w * p - 9, h * 0.1, 18, 6); });
      c.fillStyle = "#14532d"; c.fillRect(0, base, w, h - base);
      buntingF(c, w, h * 0.3, h * 0.06, now);
    }
  };
  const thumbCache = {};
  function thumb(key) {
    if (thumbCache[key]) return thumbCache[key];
    let url = "";
    try {
      const o = document.createElement("canvas"); o.width = 144; o.height = 84;
      const g = o.getContext("2d"); SCENES[key](g, 144, 84, 600);
      url = o.toDataURL("image/png");
    } catch (e) { url = ""; }
    thumbCache[key] = url;
    return url;
  }

  // atmosfera in primo piano (sopra la scacchiera)
  const AMBIENT = {
    rain(c, w, h, now) {
      c.strokeStyle = "rgba(186,230,253,0.35)"; c.lineWidth = 1;
      c.beginPath();
      for (let i = 0; i < 70; i++) { const x = (sr(i) * (w + 80) - (now / 6) % 1 + now * 0.05 * (0.6 + sr(i + 3))) % (w + 80) - 40, y = ((sr(i + 50) * h) + now * (0.45 + sr(i + 9) * 0.3)) % h; c.moveTo(x, y); c.lineTo(x - 5, y + 11); }
      c.stroke();
    },
    fog(c, w, h, now) {
      for (let i = 0; i < 3; i++) { const y = h * (0.25 + i * 0.28), x = ((now / (60 + i * 25)) % (w * 2)) - w; const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, "rgba(203,213,225,0)"); g.addColorStop(0.5, "rgba(203,213,225,0.16)"); g.addColorStop(1, "rgba(203,213,225,0)"); c.fillStyle = g; c.fillRect(x, y, w, h * 0.18); c.fillRect(x + w * 2, y, w, h * 0.18); }
    },
    confetti(c, w, h, now) {
      const cols = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#f472b6"];
      for (let i = 0; i < 36; i++) { const x = (sr(i) * w + Math.sin(now / 600 + i) * 12), y = (sr(i + 40) * h + now * (0.03 + sr(i + 8) * 0.03)) % h; c.fillStyle = cols[i % 5]; c.globalAlpha = 0.65; c.fillRect(x, y, 4, 2.5); }
      c.globalAlpha = 1;
    }
  };

  // decori puramente estetici sopra le caselle libere
  function drawDeco(c, kind, px, py, t, now) {
    const cx0 = px + t / 2, cy0 = py + t / 2;
    c.save();
    c.globalAlpha = 0.85;
    switch (kind) {
      case "bollard": c.fillStyle = "#334155"; rr(c, cx0 - t * 0.1, cy0 - t * 0.05, t * 0.2, t * 0.3, 3); c.fill(); c.fillStyle = "#64748b"; c.fillRect(cx0 - t * 0.13, cy0 - t * 0.1, t * 0.26, t * 0.08); break;
      case "coil": c.strokeStyle = "#d6b370"; c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(cx0, cy0 + t * 0.1, t * (0.2 - i * 0.05), t * (0.1 - i * 0.025), 0, 0, Math.PI * 2); c.stroke(); } break;
      case "lamp": c.fillStyle = "#1f2937"; c.fillRect(cx0 - 1.5, cy0 - t * 0.3, 3, t * 0.55); glowF(c, cx0, cy0 - t * 0.32, t * 0.5, `rgba(253,224,71,${(0.5 + 0.15 * Math.sin(now / 300 + px)).toFixed(2)})`); c.fillStyle = "#fde047"; c.beginPath(); c.arc(cx0, cy0 - t * 0.32, t * 0.07, 0, Math.PI * 2); c.fill(); break;
      case "barrel": c.fillStyle = "#92400e"; rr(c, cx0 - t * 0.17, cy0 - t * 0.2, t * 0.34, t * 0.42, 5); c.fill(); c.strokeStyle = "#451a03"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx0 - t * 0.17, cy0 - t * 0.08); c.lineTo(cx0 + t * 0.17, cy0 - t * 0.08); c.moveTo(cx0 - t * 0.17, cy0 + t * 0.1); c.lineTo(cx0 + t * 0.17, cy0 + t * 0.1); c.stroke(); break;
      case "fishcrate": c.fillStyle = "#e2e8f0"; c.fillRect(cx0 - t * 0.24, cy0 - t * 0.08, t * 0.48, t * 0.24); c.fillStyle = "#7dd3fc"; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(cx0 - t * 0.12 + i * t * 0.12, cy0 - t * 0.08, t * 0.06, t * 0.025, 0, 0, Math.PI * 2); c.fill(); } break;
      case "shell": c.fillStyle = "#fde7d0"; c.beginPath(); c.arc(cx0, cy0 + t * 0.1, t * 0.1, Math.PI, 0); c.fill(); c.strokeStyle = "#e5a98a"; c.lineWidth = 1; for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(cx0, cy0 + t * 0.1); c.lineTo(cx0 + i * t * 0.07, cy0 + t * 0.02); c.stroke(); } break;
      case "puddle": c.fillStyle = "rgba(125,211,252,0.28)"; c.beginPath(); c.ellipse(cx0, cy0 + t * 0.1, t * 0.3, t * 0.12, 0, 0, Math.PI * 2); c.fill(); c.strokeStyle = "rgba(255,255,255,0.3)"; c.lineWidth = 1; c.beginPath(); c.ellipse(cx0, cy0 + t * 0.1, t * (0.1 + 0.1 * ((now / 900 + px) % 1)), t * 0.04, 0, 0, Math.PI * 2); c.stroke(); break;
      case "flag": c.fillStyle = "#e5e7eb"; c.fillRect(cx0 - 1, cy0 - t * 0.3, 2, t * 0.55); poly(c, [[cx0 + 1, cy0 - t * 0.3], [cx0 + t * 0.3 + Math.sin(now / 200 + px) * 2, cy0 - t * 0.2], [cx0 + 1, cy0 - t * 0.08]], "#1d4ed8"); break;
      case "pot": c.fillStyle = "#c2410c"; poly(c, [[cx0 - t * 0.14, cy0 - t * 0.02], [cx0 + t * 0.14, cy0 - t * 0.02], [cx0 + t * 0.1, cy0 + t * 0.2], [cx0 - t * 0.1, cy0 + t * 0.2]], "#c2410c"); c.fillStyle = "#16a34a"; c.beginPath(); c.arc(cx0, cy0 - t * 0.08, t * 0.12, 0, Math.PI * 2); c.fill(); break;
      case "antenna": c.strokeStyle = "#475569"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx0, cy0 + t * 0.25); c.lineTo(cx0, cy0 - t * 0.3); c.moveTo(cx0 - t * 0.2, cy0 - t * 0.15); c.lineTo(cx0 + t * 0.2, cy0 - t * 0.15); c.moveTo(cx0 - t * 0.14, cy0 - t * 0.25); c.lineTo(cx0 + t * 0.14, cy0 - t * 0.25); c.stroke(); break;
      case "cat": c.fillStyle = "#1f2937"; c.beginPath(); c.ellipse(cx0, cy0 + t * 0.12, t * 0.17, t * 0.1, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(cx0 + t * 0.14, cy0 + t * 0.02, t * 0.08, 0, Math.PI * 2); c.fill(); poly(c, [[cx0 + t * 0.09, cy0 - t * 0.04], [cx0 + t * 0.11, cy0 - t * 0.13], [cx0 + t * 0.15, cy0 - t * 0.04]], "#1f2937"); break;
      case "star": c.fillStyle = "#fb923c"; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 1.2566; poly(c, [[cx0 + Math.cos(a - 0.3) * t * 0.04, cy0 + t * 0.1 + Math.sin(a - 0.3) * t * 0.04], [cx0 + Math.cos(a) * t * 0.16, cy0 + t * 0.1 + Math.sin(a) * t * 0.16], [cx0 + Math.cos(a + 0.3) * t * 0.04, cy0 + t * 0.1 + Math.sin(a + 0.3) * t * 0.04]], "#fb923c"); } break;
      case "umbrella": c.strokeStyle = "#78350f"; c.lineWidth = 2; c.beginPath(); c.moveTo(cx0, cy0 + t * 0.25); c.lineTo(cx0, cy0 - t * 0.12); c.stroke(); c.fillStyle = "#ef4444"; c.beginPath(); c.arc(cx0, cy0 - t * 0.12, t * 0.3, Math.PI, 0); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.arc(cx0, cy0 - t * 0.12, t * 0.3, Math.PI * 1.35, Math.PI * 1.65); c.lineTo(cx0, cy0 - t * 0.12); c.fill(); break;
      default: break;
    }
    c.restore();
  }

  // texture delle caselle
  function tileTex(c, px, py, t, x, y, tex) {
    c.lineWidth = 1;
    if (tex === "planks" || tex === "wet") {
      c.strokeStyle = "rgba(0,0,0,0.22)"; c.beginPath();
      for (let i = 1; i < 3; i++) { c.moveTo(px, py + (t * i) / 3); c.lineTo(px + t, py + (t * i) / 3); }
      const jx = px + t * (0.25 + 0.5 * sr(x * 7 + y * 3)); c.moveTo(jx, py); c.lineTo(jx, py + t / 3);
      const jx2 = px + t * (0.25 + 0.5 * sr(x * 5 + y * 11)); c.moveTo(jx2, py + t / 3); c.lineTo(jx2, py + (2 * t) / 3);
      c.stroke();
      if (tex === "wet") { c.fillStyle = "rgba(186,230,253,0.10)"; c.fillRect(px + t * 0.1, py + t * 0.15, t * 0.5, t * 0.06); }
    } else if (tex === "cobble") {
      c.strokeStyle = "rgba(0,0,0,0.2)"; c.beginPath();
      for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { const cxx = px + t * (0.25 + 0.5 * k + (r % 2) * 0.2), cyy = py + t * (0.18 + r * 0.32); c.moveTo(cxx + t * 0.16, cyy); c.ellipse(cxx, cyy, t * 0.16, t * 0.12, 0, 0, Math.PI * 2); }
      c.stroke();
    } else if (tex === "stone") {
      c.strokeStyle = "rgba(0,0,0,0.22)"; c.beginPath();
      c.moveTo(px, py + t / 2); c.lineTo(px + t, py + t / 2);
      const o = (x + y) % 2 ? 0.3 : 0.7; c.moveTo(px + t * o, py); c.lineTo(px + t * o, py + t / 2);
      c.moveTo(px + t * (1 - o), py + t / 2); c.lineTo(px + t * (1 - o), py + t); c.stroke();
    } else if (tex === "roof") {
      c.strokeStyle = "rgba(60,20,10,0.28)"; c.beginPath();
      for (let r = 0; r < 2; r++) for (let k = 0; k < 2; k++) { const cxx = px + t * (0.25 + 0.5 * k + r * 0.25), cyy = py + t * (0.25 + r * 0.5); c.moveTo(cxx - t * 0.25, cyy); c.arc(cxx, cyy, t * 0.25, Math.PI, 0, true); }
      c.stroke();
    } else if (tex === "rock") {
      c.strokeStyle = "rgba(0,0,0,0.25)"; c.beginPath();
      const a = sr(x * 13 + y * 7), b = sr(x * 3 + y * 17);
      c.moveTo(px + t * a, py); c.lineTo(px + t * (0.4 + b * 0.3), py + t * 0.45); c.lineTo(px + t * (b * 0.9), py + t * 0.8);
      c.moveTo(px + t * (0.4 + b * 0.3), py + t * 0.45); c.lineTo(px + t, py + t * (0.3 + a * 0.4)); c.stroke();
    } else if (tex === "sand") {
      c.fillStyle = "rgba(120,80,30,0.2)";
      for (let i = 0; i < 5; i++) c.fillRect(px + t * sr(x * 31 + y * 17 + i), py + t * sr(x * 11 + y * 29 + i * 3), 1.6, 1.6);
      c.strokeStyle = "rgba(255,255,255,0.18)"; c.beginPath(); c.moveTo(px + t * 0.15, py + t * 0.7); c.quadraticCurveTo(px + t * 0.4, py + t * 0.6, px + t * 0.65, py + t * 0.72); c.stroke();
    }
  }

  // copertura ('~'), ostacoli ('#') e meta ('G') a seconda del tema del capitolo
  function drawCover(c, kind, px, py, t, now, x) {
    c.fillStyle = "rgba(0,0,0,0.18)";
    c.beginPath(); c.ellipse(px + t / 2, py + t * 0.82, t * 0.4, t * 0.12, 0, 0, Math.PI * 2); c.fill();
    if (kind === "basket") {
      [[0.3, 0.62], [0.62, 0.55], [0.48, 0.74]].forEach((b, i) => { c.fillStyle = i === 1 ? "#a16207" : "#ca8a04"; rr(c, px + t * (b[0] - 0.15), py + t * (b[1] - 0.12), t * 0.3, t * 0.22, 4); c.fill(); c.strokeStyle = "#713f12"; c.lineWidth = 1; c.beginPath(); c.moveTo(px + t * (b[0] - 0.15), py + t * b[1]); c.lineTo(px + t * (b[0] + 0.15), py + t * b[1]); c.stroke(); });
      c.fillStyle = "#7dd3fc"; c.beginPath(); c.ellipse(px + t * 0.62, py + t * 0.45, t * 0.07, t * 0.03, 0.4, 0, Math.PI * 2); c.fill();
    } else if (kind === "laundry") {
      c.strokeStyle = "#78350f"; c.lineWidth = 2; c.beginPath(); c.moveTo(px + t * 0.05, py + t * 0.2); c.lineTo(px + t * 0.95, py + t * 0.2); c.stroke();
      [["#f8fafc", 0.12], ["#60a5fa", 0.4], ["#f472b6", 0.68]].forEach((s, i) => { const sw = Math.sin(now / 500 + x + i) * 1.5; poly(c, [[px + t * s[1], py + t * 0.2], [px + t * (s[1] + 0.22), py + t * 0.2], [px + t * (s[1] + 0.22) + sw, py + t * 0.75], [px + t * s[1] + sw, py + t * 0.72]], s[0]); });
    } else if (kind === "net") {
      c.strokeStyle = "#a8a29e"; c.lineWidth = 1.2; c.fillStyle = "rgba(168,162,158,0.16)"; rr(c, px + t * 0.1, py + t * 0.2, t * 0.8, t * 0.62, 6); c.fill();
      c.beginPath(); for (let i = 1; i < 5; i++) { c.moveTo(px + t * 0.1 + t * 0.16 * i, py + t * 0.2); c.lineTo(px + t * 0.1 + t * 0.16 * i, py + t * 0.82); c.moveTo(px + t * 0.1, py + t * 0.2 + t * 0.12 * i); c.lineTo(px + t * 0.9, py + t * 0.2 + t * 0.12 * i); } c.stroke();
      c.fillStyle = "#f97316"; [[0.2, 0.28], [0.8, 0.3], [0.5, 0.78]].forEach((f) => { c.beginPath(); c.arc(px + t * f[0], py + t * f[1], t * 0.05, 0, Math.PI * 2); c.fill(); });
    } else if (kind === "tuft") {
      const sway = Math.sin(now / 700 + x) * 2;
      c.strokeStyle = "#65a30d"; c.lineWidth = 2.2;
      for (let i = 0; i < 7; i++) { const bx = px + t * (0.2 + i * 0.1); c.beginPath(); c.moveTo(bx, py + t * 0.82); c.quadraticCurveTo(bx + sway * 0.4, py + t * 0.55, bx + (i - 3) * 3 + sway, py + t * (0.32 + (i % 3) * 0.08)); c.stroke(); }
    } else if (kind === "bench") {
      c.fillStyle = "#78350f"; c.fillRect(px + t * 0.1, py + t * 0.5, t * 0.8, t * 0.1); c.fillRect(px + t * 0.1, py + t * 0.3, t * 0.8, t * 0.08);
      c.fillStyle = "#292524"; c.fillRect(px + t * 0.16, py + t * 0.6, t * 0.06, t * 0.2); c.fillRect(px + t * 0.78, py + t * 0.6, t * 0.06, t * 0.2); c.fillRect(px + t * 0.16, py + t * 0.3, t * 0.06, t * 0.3); c.fillRect(px + t * 0.78, py + t * 0.3, t * 0.06, t * 0.3);
    } else {
      const sway = Math.sin(now / 900 + x) * 1.2;
      [["#1f7a3d", 0.3, 0.6, 0.2], ["#2a9a4c", 0.55, 0.5, 0.24], ["#37b35c", 0.45, 0.68, 0.2], ["#2a9a4c", 0.7, 0.68, 0.17]].forEach((b) => {
        c.fillStyle = b[0]; c.beginPath(); c.arc(px + t * b[1] + sway * 0.3, py + t * b[2], t * b[3], 0, Math.PI * 2); c.fill();
      });
    }
  }

  function drawWall(c, kind, px, py, t) {
    c.fillStyle = "rgba(0,0,0,0.35)";
    c.beginPath(); c.ellipse(px + t / 2, py + t * 0.88, t * 0.42, t * 0.12, 0, 0, Math.PI * 2); c.fill();
    if (kind === "crate") {
      c.fillStyle = "#a16207"; rr(c, px + t * 0.1, py + t * 0.12, t * 0.8, t * 0.74, 3); c.fill();
      c.strokeStyle = "#713f12"; c.lineWidth = 2; c.stroke();
      c.beginPath(); c.moveTo(px + t * 0.12, py + t * 0.3); c.lineTo(px + t * 0.88, py + t * 0.3);
      c.moveTo(px + t * 0.12, py + t * 0.62); c.lineTo(px + t * 0.88, py + t * 0.62);
      c.moveTo(px + t * 0.12, py + t * 0.14); c.lineTo(px + t * 0.88, py + t * 0.84); c.stroke();
    } else if (kind === "stall") {
      c.fillStyle = "#6b4423"; c.fillRect(px + t * 0.12, py + t * 0.42, t * 0.76, t * 0.42);
      c.fillStyle = "#e2e8f0"; c.fillRect(px + t * 0.16, py + t * 0.5, t * 0.68, t * 0.16);
      c.fillStyle = "#7dd3fc"; [0.28, 0.5, 0.7].forEach((f) => { c.beginPath(); c.ellipse(px + t * f, py + t * 0.55, t * 0.06, t * 0.025, 0, 0, Math.PI * 2); c.fill(); });
      for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? "#f8fafc" : "#dc2626"; poly(c, [[px + t * (0.08 + i * 0.21), py + t * 0.2], [px + t * (0.29 + i * 0.21), py + t * 0.2], [px + t * (0.3 + i * 0.21), py + t * 0.42], [px + t * (0.07 + i * 0.21), py + t * 0.42]], c.fillStyle); }
      c.fillStyle = "#4a2c14"; c.fillRect(px + t * 0.1, py + t * 0.2, t * 0.04, t * 0.64); c.fillRect(px + t * 0.86, py + t * 0.2, t * 0.04, t * 0.64);
    } else if (kind === "chimney") {
      c.fillStyle = "#7c2d12"; c.fillRect(px + t * 0.25, py + t * 0.22, t * 0.5, t * 0.62);
      c.fillStyle = "#9a3412"; for (let r = 0; r < 4; r++) for (let k = 0; k < 2; k++) c.fillRect(px + t * (0.27 + k * 0.24 + (r % 2) * 0.1), py + t * (0.26 + r * 0.14), t * 0.2, t * 0.1);
      c.fillStyle = "#44403c"; c.fillRect(px + t * 0.2, py + t * 0.14, t * 0.6, t * 0.1);
    } else if (kind === "boat") {
      poly(c, [[px + t * 0.08, py + t * 0.5], [px + t * 0.92, py + t * 0.5], [px + t * 0.78, py + t * 0.82], [px + t * 0.22, py + t * 0.82]], "#9a3412");
      c.fillStyle = "#fef3c7"; c.fillRect(px + t * 0.1, py + t * 0.5, t * 0.8, t * 0.07);
      c.fillStyle = "#1e3a8a"; c.fillRect(px + t * 0.28, py + t * 0.32, t * 0.44, t * 0.18);
    } else if (kind === "pillar") {
      c.fillStyle = "#a8a29e"; c.fillRect(px + t * 0.28, py + t * 0.2, t * 0.44, t * 0.64);
      c.fillStyle = "#d6d3d1"; c.fillRect(px + t * 0.22, py + t * 0.14, t * 0.56, t * 0.1); c.fillRect(px + t * 0.22, py + t * 0.78, t * 0.56, t * 0.08);
      c.fillStyle = "rgba(0,0,0,0.15)"; c.fillRect(px + t * 0.52, py + t * 0.24, t * 0.2, t * 0.54);
    } else {
      c.fillStyle = "#64748b";
      c.beginPath(); c.moveTo(px + t * 0.1, py + t * 0.86); c.lineTo(px + t * 0.25, py + t * 0.25); c.lineTo(px + t * 0.55, py + t * 0.12); c.lineTo(px + t * 0.9, py + t * 0.45); c.lineTo(px + t * 0.88, py + t * 0.86); c.closePath(); c.fill();
      c.fillStyle = "rgba(255,255,255,0.18)";
      c.beginPath(); c.moveTo(px + t * 0.25, py + t * 0.25); c.lineTo(px + t * 0.55, py + t * 0.12); c.lineTo(px + t * 0.6, py + t * 0.5); c.closePath(); c.fill();
    }
  }

  function drawGoal(c, kind, px, py, t, now) {
    c.fillStyle = "rgba(0,0,0,0.3)";
    c.beginPath(); c.ellipse(px + t / 2, py + t * 0.9, t * 0.3, t * 0.08, 0, 0, Math.PI * 2); c.fill();
    if (kind === "falo") {
      c.fillStyle = "#44403c"; for (let i = 0; i < 3; i++) { c.save(); c.translate(px + t / 2, py + t * 0.85); c.rotate(-0.6 + i * 0.6); c.fillRect(-t * 0.04, -t * 0.34, t * 0.08, t * 0.34); c.restore(); }
      const f = Math.sin(now / 70) * t * 0.04;
      poly(c, [[px + t * 0.28, py + t * 0.8], [px + t * 0.5 + f, py + t * 0.18], [px + t * 0.72, py + t * 0.8]], "#ea580c");
      poly(c, [[px + t * 0.36, py + t * 0.8], [px + t * 0.5 - f, py + t * 0.34], [px + t * 0.64, py + t * 0.8]], "#fbbf24");
      poly(c, [[px + t * 0.43, py + t * 0.8], [px + t * 0.5 + f, py + t * 0.52], [px + t * 0.57, py + t * 0.8]], "#fef9c3");
    } else if (kind === "campanile") {
      c.fillStyle = "#e7e5e4"; c.fillRect(px + t * 0.28, py + t * 0.28, t * 0.44, t * 0.62);
      c.fillStyle = "#292524"; rr(c, px + t * 0.4, py + t * 0.38, t * 0.2, t * 0.24, 4); c.fill();
      poly(c, [[px + t * 0.24, py + t * 0.28], [px + t * 0.5, py + t * 0.04], [px + t * 0.76, py + t * 0.28]], "#9a3412");
      const sw = Math.sin(now / 250) * t * 0.04; c.fillStyle = "#fbbf24"; c.beginPath(); c.arc(px + t * 0.5 + sw, py + t * 0.5, t * 0.09, 0, Math.PI * 2); c.fill();
    } else {
      c.fillStyle = "#f8fafc"; c.beginPath(); c.moveTo(px + t * 0.3, py + t * 0.9); c.lineTo(px + t * 0.4, py + t * 0.3); c.lineTo(px + t * 0.6, py + t * 0.3); c.lineTo(px + t * 0.7, py + t * 0.9); c.closePath(); c.fill();
      c.fillStyle = "#dc2626"; c.fillRect(px + t * 0.34, py + t * 0.5, t * 0.32, t * 0.12);
      c.fillStyle = "#fde047"; c.fillRect(px + t * 0.4, py + t * 0.18, t * 0.2, t * 0.14);
      c.fillStyle = "#dc2626"; c.fillRect(px + t * 0.36, py + t * 0.1, t * 0.28, t * 0.08);
    }
  }

  // ---------------------------------------------------------------- stili / DOM
  const CSS = `
.rem-root{position:fixed;inset:0;z-index:999999;display:flex;flex-direction:column;background:#050b14;color:#e2e8f0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;height:100vh;height:100dvh;width:100vw;overflow:hidden;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.rem-root *{box-sizing:border-box}
.rem-root h1,.rem-root h2{text-shadow:none;letter-spacing:0;text-transform:none;font-family:inherit}
.rem-head{display:flex;align-items:center;gap:6px;padding:4px 8px;background:#0b1320;border-bottom:1px solid #1e293b;min-height:52px;flex:0 0 auto}
.rem-head h2{margin:0;font-size:15px;color:#7dd3fc;line-height:1.15;flex:1;min-width:0}
.rem-head h2 small{display:block;font-weight:400;font-size:11px;color:#94a3b8}
.rem-hbtn{min-width:46px;min-height:46px;border:0;border-radius:10px;background:#1e293b;color:#fff;font-size:18px;font-weight:700;cursor:pointer}
.rem-hbtn.x{background:#c2303c;font-size:14px;padding:0 12px}
.rem-bar{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:5px 10px;background:#0f172a;font-size:12px;line-height:1.25;flex:0 0 auto;border-bottom:1px solid #1e293b}
.rem-bar b{color:#fde68a}
.rem-stage{position:relative;flex:1 1 auto;min-height:0;background:#0a1220}
.rem-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:manipulation}
.rem-panel{flex:0 0 auto;background:#0b1320;border-top:2px solid #1e3a5f;padding:8px 10px calc(8px + env(safe-area-inset-bottom));height:clamp(212px,38vh,270px);overflow-y:auto;overflow-x:hidden}
.rem-msg{font-size:13px;color:#cbd5e1;line-height:1.35;margin:0 0 8px}
.rem-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.rem-row.one{grid-template-columns:1fr}
.rem-row.three{grid-template-columns:1fr 1fr 1fr;gap:6px}.rem-row.three .rem-btn{font-size:12.5px;padding:4px 4px}
.rem-btn{min-height:46px;border:0;border-radius:10px;background:#1d4ed8;color:#fff;font-size:14px;font-weight:700;padding:6px 10px;cursor:pointer;line-height:1.15}
.rem-btn.red{background:#c2303c}.rem-btn.gray{background:#334155}.rem-btn.green{background:#15803d}.rem-btn.gold{background:#b7791f}
.rem-btn:disabled{opacity:.4;cursor:default}
.rem-btn small{display:block;font-weight:400;font-size:10.5px;opacity:.85}
.rem-card.pt{display:flex;gap:8px;align-items:flex-start}
.rem-cb{min-width:0;flex:1}
.rem-pt{display:block;border-radius:10px;border:2px solid #38bdf8;background:#0b1320;flex:0 0 auto;object-fit:cover}
.rem-pt.round{border-radius:50%}
.rem-card{background:#111c30;border:1px solid #243552;border-radius:10px;padding:7px 9px;margin-bottom:8px;font-size:12.5px;line-height:1.35}
.rem-card .abd{margin-top:3px;font-size:11.5px;line-height:1.3}
@media (max-height:700px){.rem-card .abd{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}
.rem-card .n{font-weight:800;font-size:14px;color:#fff}
.rem-chip{display:inline-block;padding:1px 7px;border-radius:99px;font-size:11px;font-weight:700;color:#0b1320;margin-left:6px}
.rem-stats{display:flex;flex-wrap:wrap;gap:3px 10px;margin:3px 0;color:#cbd5e1;font-size:12px}
.rem-hp{height:7px;border-radius:4px;background:#1e293b;overflow:hidden;margin:3px 0}
.rem-hp i{display:block;height:100%;background:#22c55e}
.rem-fc div{display:flex;justify-content:space-between;gap:8px}
.rem-good{color:#7ee0a1}.rem-bad{color:#ff8a8a}.rem-dim{color:#94a3b8}
.rem-screen{position:absolute;inset:0;z-index:5;background:rgba(5,11,20,.97);overflow-y:auto;overflow-x:hidden;padding:12px 14px calc(14px + env(safe-area-inset-bottom));display:flex;flex-direction:column}
.rem-screen>*{flex-shrink:0}
.rem-screen h1{margin:4px 0 2px;font-size:22px;color:#7dd3fc}
.rem-screen .sub{color:#94a3b8;font-size:13px;margin-bottom:10px}
.rem-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:6px 0 12px}
.rem-seg button{min-height:46px;border:2px solid #243552;background:#111c30;color:#cbd5e1;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer}
.rem-seg button.on{border-color:#38bdf8;background:#0c4a6e;color:#fff}
.rem-ch{width:100%;text-align:left;display:block;min-height:64px;border:1px solid #243552;background:#111c30;color:#e2e8f0;border-radius:12px;padding:9px 12px;margin-bottom:8px;cursor:pointer;font-family:inherit}
.rem-ch b{font-size:15px;color:#fff}.rem-ch span{display:block;font-size:12px;color:#94a3b8;margin-top:2px}
.rem-ch .st{color:#fbbf24;font-size:17px;letter-spacing:2px}
.rem-ch:disabled{opacity:.45}
.rem-dlg{margin-top:auto;background:rgba(17,28,48,.94);border:2px solid #38bdf8;border-radius:14px;padding:10px;min-height:130px;display:flex;gap:10px;align-items:flex-start;box-shadow:0 6px 22px rgba(0,0,0,.5)}
.rem-dlg .rem-pt{width:68px;height:68px;border-radius:12px}
.rem-dlg .rem-tb{min-width:0;flex:1}
.rem-dlg .who{display:flex;align-items:center;gap:10px;margin-bottom:4px}
.rem-screen.sc{background:linear-gradient(180deg,rgba(5,11,20,0) 0%,rgba(5,11,20,.12) 45%,rgba(5,11,20,.78) 100%)}
.rem-screen.sc.beat{background:linear-gradient(180deg,rgba(5,11,20,0) 0%,rgba(5,11,20,0) 50%,rgba(5,11,20,.72) 100%)}
.rem-screen.mn{background:rgba(5,11,20,.8)}
.rem-top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.rem-cap{font-size:13px;font-weight:800;color:#fde68a;line-height:1.25;min-width:0;background:rgba(5,11,20,.62);padding:5px 9px;border-radius:9px}
.rem-cap small{display:block;font-weight:500;font-size:11.5px;color:#cbd5e1}
.rem-sep{margin:8px 2px 6px;font-size:12px;color:#fde68a;font-weight:800;letter-spacing:.3px;border-bottom:1px solid #3b2f12;padding-bottom:3px}
.rem-ch{display:flex;gap:10px;align-items:center}
.rem-ch img.th{width:72px;height:42px;border-radius:7px;flex:0 0 auto;border:1px solid #243552;object-fit:cover}
.rem-ch .tx{min-width:0;flex:1}
.rem-fc .pp{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-start}
.rem-fc .pp img{width:30px;height:30px;border-radius:7px;border:2px solid #475569}
.rem-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;color:#fff;border:3px solid #fff;flex:0 0 auto}
.rem-dlg p{margin:0;font-size:16px;line-height:1.45;color:#f1f5f9}
.rem-hintc{margin-top:8px;text-align:right;font-size:12px;color:#94a3b8}
.rem-big{font-size:26px;font-weight:900;text-align:center;margin:6px 0}
.rem-dots{display:flex;gap:6px;justify-content:center;margin:8px 0}.rem-dots i{width:8px;height:8px;border-radius:50%;background:#334155}.rem-dots i.on{background:#38bdf8}
.rem-rule{background:#111c30;border-radius:10px;padding:8px 10px;margin:6px 0;font-size:13px}
`;

  function mount() {
    styleEl = document.createElement("style");
    styleEl.id = "remStyle";
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
    root = document.createElement("div");
    root.id = "tacticalEmblemModal";
    root.className = "rem-root";
    root.innerHTML = `
      <div class="rem-head">
        <div style="font-size:24px">🛡️</div>
        <h2>Rondine Emblem<small>RPG tattico · Tecnica &gt; Potenza &gt; Velocità</small></h2>
        <button class="rem-hbtn" id="remHelp" aria-label="Come si gioca">?</button>
        <button class="rem-hbtn x" id="remClose">Chiudi ✕</button>
      </div>
      <div class="rem-bar" id="remBar"></div>
      <div class="rem-stage" id="remStage"><canvas id="emblemCanvas"></canvas><div id="remScreen"></div></div>
      <div class="rem-panel" id="remPanel"></div>`;
    document.body.appendChild(root);
    cv = q("#emblemCanvas");
    cx = cv.getContext("2d");
  }

  function on(target, ev, fn, opt) {
    target.addEventListener(ev, fn, opt);
    listeners.push([target, ev, fn, opt]);
  }

  function cleanup() {
    alive = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    timers.forEach((id) => clearTimeout(id));
    timers = new Set();
    listeners.forEach((l) => l[0].removeEventListener(l[1], l[2], l[3]));
    listeners = [];
    if (root && root.parentNode) root.parentNode.removeChild(root);
    if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    root = null; styleEl = null; cv = null; cx = null; S = null;
    if (DEBUG) { try { delete window.__emblem; } catch (e) { window.__emblem = null; } }
  }

  function closeAll() {
    const cb = onExitCb;
    cleanup();
    onExitCb = null;
    if (typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  function showScreen(html, cls) {
    const el = q("#remScreen");
    if (!el) return;
    el.innerHTML = html ? `<div class="rem-screen${cls ? " " + cls : ""}">${html}</div>` : "";
    const pn = q("#remPanel");
    if (pn) pn.style.display = html ? "none" : "";
  }

  function updateBar() {
    const b = q("#remBar");
    if (!b) return;
    if (!S) { b.innerHTML = `<span>Scegli un capitolo</span><span>Livello squadra <b>${teamLevel() + 1}</b> · ★ ${totalStars()}/${CHAPTERS.length * 3}</span>`; return; }
    const o = S.ch.obj;
    const lim = o.turns ? `/${o.turns}` : "";
    b.innerHTML = `<span>🎯 ${o.text}</span><span style="white-space:nowrap">Turno <b>${S.turn}${lim}</b> · ${DIFFS[save.diff]}</span>`;
  }

  // ---------------------------------------------------------------- pannello
  function unitCard(u, withAb) {
    const st = STYLES[u.style];
    const pct = Math.round((u.hp / u.maxHp) * 100);
    const col = pct > 50 ? "#22c55e" : pct > 25 ? "#eab308" : "#ef4444";
    const rng = u.rng[0] === u.rng[1] ? (u.rng[0] === 1 ? "contatto" : "gittata " + u.rng[0]) : `gittata ${u.rng[0]}-${u.rng[1]}`;
    let ab = "";
    if (withAb && u.ab) {
      ab = `<div class="rem-dim abd"><b style="color:#fde68a">${u.ab.name}</b> ${u.cd > 0 ? "(tra " + u.cd + " t.)" : ""} ${u.ab.desc}</div>`;
    }
    const extra = [u.fly ? "vola sopra gli ostacoli" : "", u.guard ? "in difesa (-50%)" : "", u.vip ? "non può muoversi: va protetta" : "", u.team === "e" ? (u.hold ? "presidia" : "all'attacco") : ""].filter(Boolean).join(" · ");
    const pi = unitPortrait(u);
    const pimg = ptImg(pi, 52, u.team === "p" ? "#60a5fa" : "#f87171");
    return `<div class="rem-card${pi ? " pt" : ""}">${pimg}<div class="rem-cb"><div><span class="n">${u.name}</span><span class="rem-chip" style="background:${st.c}">${st.l} ${st.n}</span> <span class="rem-dim">${u.role || ""}</span></div>
      <div class="rem-hp"><i style="width:${pct}%;background:${col}"></i></div>
      <div class="rem-stats"><span>❤ ${u.hp}/${u.maxHp}</span><span>ATK ${u.atk}</span><span>DIF ${u.def}</span><span>VEL ${u.spd}</span><span>MOV ${u.mov}</span><span>${rng}</span></div>
      ${extra ? `<div class="rem-dim">${extra}</div>` : ""}${ab}</div></div>`;
  }

  function forecastHtml() {
    const a = S.sel, d = S.target;
    const o = {};
    if (S.abMode && S.abMode.id === "cannone") { o.bonus = 3; o.noCounter = true; }
    const f = combat(a, d, o);
    const advTxt = f.adv > 0 ? `<span class="rem-good">▲ Vantaggio di stile</span>` : f.adv < 0 ? `<span class="rem-bad">▼ Svantaggio di stile</span>` : `<span class="rem-dim">Stili alla pari</span>`;
    const after = Math.max(0, d.hp - f.dmg);
    const lethal = f.dmg >= d.hp ? ` <b class="rem-good">Fuori!</b>` : "";
    let cnt = `<div class="rem-dim"><span>Contrattacco</span><span>nessuno</span></div>`;
    if (f.counter) {
      const lethC = f.counter.dmg >= a.hp ? ` <b class="rem-bad">Ko!</b>` : "";
      cnt = `<div><span>Contrattacco di ${d.name}</span><b class="rem-bad">${f.counter.dmg} danni · ${f.counter.hit}%${lethC}</b></div>`;
    }
    const pa = ptImg(unitPortrait(a), 30, "#60a5fa"), pd = ptImg(unitPortrait(d), 30, "#f87171");
    return `<div class="rem-card rem-fc"><div class="pp">${pa}<b>${a.name}</b> ➜ ${pd}<b>${d.name}</b></div><div>${advTxt}</div>
      <div><span>Colpo${S.abMode ? " (" + S.abMode.name + ")" : ""}</span><b class="rem-good">${f.dmg} danni · ${f.hit}%${lethal}</b></div>
      <div><span>Critico</span><span>${f.crit}% (${f.critDmg} danni)</span></div>
      <div><span>Energia di ${d.name}</span><span>${d.hp} ➜ ${after}</span></div>${cnt}</div>`;
  }

  function renderPanel() {
    const p = q("#remPanel");
    if (!p) return;
    if (!S) { p.innerHTML = ""; return; }
    let h = "";
    const m = S.mode;
    if (S.over) {
      h = `<p class="rem-msg">Partita conclusa...</p>`;
    } else if (S.phase === "enemy" || S.busy) {
      h = `<p class="rem-msg">${S.phase === "enemy" ? (S.msg || "Turno avversario...") : (S.msg || "...")}</p>`;
      if (S.phase === "enemy" && S.active) h += unitCard(S.active, false);
      if (S.phase !== "enemy" && S.sel && S.sel.hp > 0) h += unitCard(S.sel, false);
    } else if (m === "idle") {
      if (S.insp) h += unitCard(S.insp, true);
      h += `<p class="rem-msg">${S.msg || "Tocca un tuo giocatore."}</p>`;
      const left = squad().filter((u) => !u.acted).length;
      h += `<div class="rem-row"><button class="rem-btn red" data-a="end">Fine turno ⏩<small>${left} da muovere</small></button><button class="rem-btn gray" data-a="menu">☰ Menu</button></div>`;
    } else if (m === "selected" || m === "moved") {
      const u = S.sel;
      h += unitCard(u, true);
      const hasT = S.atkList.length;
      let msg = m === "selected" ? "Caselle blu: movimento. Rosse: dove puoi colpire." : "";
      if (m === "moved" || m === "selected") msg = hasT ? "Tocca un rivale evidenziato per attaccarlo." : (m === "moved" ? "Nessun rivale a portata. Usa un'abilità o Attendi." : msg);
      h += `<p class="rem-msg">${msg}</p>`;
      const abOk = u.ab && abilityReady(u) && abilityTargets(u).length > 0;
      const abLbl = u.ab ? `✨ ${u.ab.name}<small>${abilityReady(u) ? (abOk ? "pronta" : "nessun bersaglio") : "ricarica " + u.cd + " t."}</small>` : "";
      h += `<div class="rem-row ${u.ab ? "three" : ""}">`;
      if (u.ab) h += `<button class="rem-btn gold" data-a="ab" ${abOk ? "" : "disabled"}>${abLbl}</button>`;
      h += `<button class="rem-btn green" data-a="wait">Attendi ✓</button>`;
      h += m === "moved" && S.origin && (S.origin.x !== u.x || S.origin.y !== u.y) ? `<button class="rem-btn gray" data-a="undo">↩ Annulla mossa</button>` : `<button class="rem-btn gray" data-a="desel">Deseleziona</button>`;
      h += `</div>`;
    } else if (m === "confirm") {
      h += forecastHtml();
      h += `<div class="rem-row"><button class="rem-btn red" data-a="go">⚔️ Conferma</button><button class="rem-btn gray" data-a="back">Indietro</button></div>`;
    } else if (m === "ability") {
      h += `<p class="rem-msg">${S.msg}</p><div class="rem-row one"><button class="rem-btn gray" data-a="abback">Annulla</button></div>`;
    } else if (m === "retreat") {
      h += `<p class="rem-msg">${S.msg}</p><div class="rem-row one"><button class="rem-btn gray" data-a="stay">Resta qui</button></div>`;
    }
    p.innerHTML = h;
  }

  function onPanelClick(e) {
    const b = e.target.closest("button[data-a]");
    if (!b || !S || S.over) return;
    const a = b.dataset.a;
    if (a === "end") { snd("playSelect"); endPlayerTurn(); }
    else if (a === "menu") { if (confirm_("Tornare alla scelta capitoli? La partita in corso andrà persa.")) showMenu(); }
    else if (a === "ab") useAbility();
    else if (a === "wait") waitSel();
    else if (a === "undo") undoMove();
    else if (a === "desel") { deselect(); renderPanel(); }
    else if (a === "go") doConfirm();
    else if (a === "back") cancelConfirm();
    else if (a === "abback") cancelAbility();
    else if (a === "stay") { const u = S.sel; if (u) { u.acted = true; deselect(); S.msg = ""; renderPanel(); maybeAutoEnd(); } }
  }

  function confirm_(msg) {
    try { return window.confirm(msg); } catch (e) { return true; }
  }

  // ---------------------------------------------------------------- schermate
  function showMenu() {
    S = null; bgCh = null;
    updateBar();
    const p = q("#remPanel"); if (p) p.innerHTML = `<p class="rem-msg">Seleziona difficoltà e capitolo. Le stelle fanno crescere la squadra.</p>`;
    let cards = "";
    CHAPTERS.forEach((c, i) => {
      const cl = save.cleared[c.id];
      const prevOk = i === 0 || save.cleared[CHAPTERS[i - 1].id];
      const stars = cl ? "★".repeat(cl.stars) + "☆".repeat(3 - cl.stars) : "☆☆☆";
      if (i === 4) cards += `<div class="rem-sep">🏮 Le Sei Prove del Borgo · la Lanterna d'Argento</div>`;
      const th = thumb(c.theme.scene);
      cards += `<button class="rem-ch" data-ch="${i}" ${prevOk ? "" : "disabled"}>${th ? `<img class="th" src="${th}" alt="" width="72" height="42">` : ""}<div class="tx"><b>${prevOk ? c.ico + " " : "🔒 "}Cap. ${i + 1} · ${c.title}</b><span>${prevOk ? "🎯 " + c.tag : "Completa il capitolo precedente"}</span><span class="st">${stars}</span></div></button>`;
    });
    const lv = teamLevel();
    const nextAt = (lv + 1) * 3;
    showScreen(`
      <h1>Rondine Emblem</h1>
      <div class="sub">Tattica a turni sul campo del Borgo. Livello squadra <b style="color:#fde68a">${lv + 1}</b>${lv < MAXLV ? ` (prossimo a ${nextAt} ★)` : " (massimo)"} · ★ ${totalStars()}/${CHAPTERS.length * 3}${lv ? ` · bonus: +${2 * lv} energia, +${Math.floor((lv + 1) / 2)} attacco` : ""}</div>
      <div class="rem-seg">${Object.keys(DIFFS).map((k) => `<button data-d="${k}" class="${save.diff === k ? "on" : ""}">${DIFFS[k]}</button>`).join("")}</div>
      ${cards}
      <div class="rem-row" style="margin-top:6px"><button class="rem-btn gray" data-m="help">❓ Come si gioca</button><button class="rem-btn red" data-m="exit">Esci ✕</button></div>`, "mn");
  }

  function showTutorial(i, thenMenu) {
    const s = TUTORIAL[i];
    const last = i === TUTORIAL.length - 1;
    showScreen(`
      <div style="text-align:center;font-size:54px;margin-top:10px">${s.ico}</div>
      <h1 style="text-align:center">${s.t}</h1>
      <div class="rem-rule" style="font-size:15px;line-height:1.5">${s.b}</div>
      <div class="rem-dots">${TUTORIAL.map((_, j) => `<i class="${j === i ? "on" : ""}"></i>`).join("")}</div>
      <div class="rem-row" style="margin-top:auto"><button class="rem-btn gray" data-t="skip">${last ? "Chiudi" : "Salta"}</button><button class="rem-btn" data-t="${last ? "skip" : "next"}" data-i="${i + 1}">${last ? "Si gioca! ▸" : "Avanti ▸"}</button></div>`);
  }


  let bgCh = null; // capitolo il cui sfondo è mostrato fuori dalla battaglia (dialoghi iniziali)
  function showDialogue(lines, i, after, o) {
    o = o || {};
    if (i >= lines.length) { S_dlg = null; after(); return; }
    const l = lines[i];
    S_dlg = { lines, i, after, o };
    const ch = S ? S.ch : bgCh;
    const col = colorOf(l.s);
    const pi = portrait(l.p || SPEAKER_KEY[l.s]);
    const av = pi ? ptImg(pi, 68, col) : `<div class="rem-av" style="background:${col}">${l.s ? l.s[0] : "·"}</div>`;
    const cap = ch && !o.beat ? `<div class="rem-cap">Capitolo ${CHAPTERS.indexOf(ch) + 1} · ${ch.title}<small>${ch.ctx || ""}</small></div>` : `<div></div>`;
    showScreen(`
      <div class="rem-top">${cap}<button class="rem-btn gray" style="min-width:84px;min-height:40px" data-dlg="skip">Salta ⏭</button></div>
      <div class="rem-dlg" data-dlg="next" style="border-color:${col}">
        ${av}
        <div class="rem-tb"><div class="who"><b style="font-size:16px;color:#7dd3fc">${l.s}</b></div>
        <p>${l.t}</p>
        <div class="rem-hintc">Tocca per continuare ▸ (${i + 1}/${lines.length})</div></div>
      </div>`, o.beat || o.outro ? "sc beat" : "sc");
  }
  let S_dlg = null;

  function startChapter(ci) {
    const ch = CHAPTERS[ci];
    S = null; bgCh = ch;
    updateBar();
    const p = q("#remPanel"); if (p) p.innerHTML = "";
    showDialogue(ch.intro, 0, () => { startBattle(ci); });
  }

  function showResult(win, reason) {
    const ch = S.ch, ci = S.ci;
    let stars = 0, lines = "", coinTxt = "", newStars = 0;
    if (win) {
      const vipU = S.units.find((u) => u.vip);
      const par = ch.parKind === "kills" ? S.stats.kills >= ch.par : ch.parKind === "vip" ? !!vipU && vipU.hp >= vipU.maxHp * ch.par : S.turn <= ch.par;
      const noKo = S.stats.ko === 0;
      stars = 1 + (par ? 1 : 0) + (noKo ? 1 : 0);
      const parNote = ch.parKind === "kills" ? ` (fatti: ${S.stats.kills})` : ch.parKind === "vip" ? (vipU ? ` (${vipU.hp}/${vipU.maxHp})` : "") : ` (turno ${S.turn})`;
      lines = `<div class="rem-rule">★ Capitolo superato</div>
        <div class="rem-rule" style="opacity:${par ? 1 : 0.5}">${par ? "★" : "☆"} ${ch.parText}${parNote}</div>
        <div class="rem-rule" style="opacity:${noKo ? 1 : 0.5}">${noKo ? "★" : "☆"} Nessun compagno ko</div>`;
      const old = save.cleared[ch.id];
      const prevStars = old ? old.stars : 0;
      newStars = Math.max(0, stars - prevStars);
      save.cleared[ch.id] = { stars: Math.max(prevStars, stars), best: old ? Math.min(old.best, S.turn) : S.turn };
      if (!save.paid[ch.id]) {
        save.paid[ch.id] = true;
        const n = REWARDS[ch.id] || 0;
        if (n && typeof window.addCoins === "function") { try { window.addCoins(n); coinTxt = `<div class="rem-rule" style="color:#fde68a">🪙 Prima vittoria: +${n} monete!</div>`; } catch (e) { /* ignora */ } }
      }
      writeSave();
      if (ci === CHAPTERS.length - 1 && window.fireConfetti) { try { window.fireConfetti(); } catch (e) { /* ignora */ } }
      snd("playGoal");
    } else {
      snd("playWhistle");
    }
    const lv = teamLevel();
    const next = win && ci < CHAPTERS.length - 1;
    const draw = () => showScreen(`
      <div class="rem-big" style="color:${win ? "#fde68a" : "#ff8a8a"}">${win ? "VITTORIA!" : "SCONFITTA"}</div>
      <div style="text-align:center;font-size:34px;color:#fbbf24;letter-spacing:6px">${win ? "★".repeat(stars) + "☆".repeat(3 - stars) : "☆☆☆"}</div>
      <div class="sub" style="text-align:center">${win ? ch.title : reason}</div>
      ${win ? "" : `<div class="rem-rule">Non si molla: nessun giocatore è davvero ko, in panchina si ricarica tutto. Prova un'altra tattica: usa il triangolo e i cespugli!</div>`}
      ${lines}${coinTxt}
      ${win && newStars ? `<div class="rem-rule" style="color:#7ee0a1">Nuove stelle: +${newStars} · Livello squadra ${lv + 1}</div>` : ""}
      <div class="rem-row" style="margin-top:auto;padding-top:10px">
        ${next ? `<button class="rem-btn green" data-r="next">Capitolo ${ci + 2} ▸</button>` : `<button class="rem-btn" data-r="retry">${win ? "Rigioca" : "Riprova"} ↻</button>`}
        <button class="rem-btn gray" data-r="menu">☰ Capitoli</button>
      </div>
      ${next ? `<div class="rem-row one" style="margin-top:8px"><button class="rem-btn gray" data-r="retry">Rigioca questo ↻</button></div>` : ""}`);
    S.lastCi = ci;
    saveCi = ci;
    if (win && ch.outro && ch.outro.length) showDialogue(ch.outro, 0, draw, { outro: true }); else draw();
  }
  let saveCi = 0;

  function onScreenClick(e) {
    const t = e.target;
    const ch = t.closest("[data-ch]");
    if (ch && !ch.disabled) { startChapter(+ch.dataset.ch); return; }
    const d = t.closest("[data-d]");
    if (d) { save.diff = d.dataset.d; writeSave(); showMenu(); return; }
    const mm = t.closest("[data-m]");
    if (mm) { if (mm.dataset.m === "help") showTutorial(0, true); else if (mm.dataset.m === "exit") closeAll(); return; }
    const tt = t.closest("[data-t]");
    if (tt) {
      if (tt.dataset.t === "next") showTutorial(+tt.dataset.i, true);
      else { save.tut = true; writeSave(); if (S && !S.over) showScreen(""); else showMenu(); }
      return;
    }
    const dk = t.closest("[data-dlg]");
    if (dk && S_dlg) {
      if (dk.dataset.dlg === "skip") { const a = S_dlg.after; S_dlg = null; a(); }
      else showDialogue(S_dlg.lines, S_dlg.i + 1, S_dlg.after);
      return;
    }
    const r = t.closest("[data-r]");
    if (r) {
      const ci = saveCi;
      if (r.dataset.r === "next") startChapter(ci + 1);
      else if (r.dataset.r === "retry") startChapter(ci);
      else showMenu();
    }
  }

  // ---------------------------------------------------------------- disegno
  function layoutCanvas() {
    if (!cv) return;
    const st = q("#remStage");
    const w = st.clientWidth, h = st.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = Math.max(1, Math.floor(w * dpr));
    cv.height = Math.max(1, Math.floor(h * dpr));
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const t = Math.max(24, Math.floor(Math.min((w - 6) / COLS, (h - 6) / (ROWS + 0.9))));
    lay = { t, w, h, dpr, ox: Math.floor((w - COLS * t) / 2), oy: Math.floor((h - ROWS * t) / 2 + t * 0.2) };
  }

  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }

  function drawBoard(now) {
    const t = lay.t, th = S.ch.theme;
    // sfondo del capitolo
    (SCENES[th.scene] || SCENES.menu)(cx, lay.w, lay.h, now);
    // bordo della scacchiera (spessore)
    cx.fillStyle = th.edge || "#3b2a1a";
    cx.fillRect(lay.ox - 3, lay.oy - 3, COLS * t + 6, ROWS * t + 3 + Math.min(8, t * 0.18));
    cx.fillStyle = "rgba(0,0,0,0.4)";
    cx.fillRect(lay.ox + 4, lay.oy + ROWS * t + Math.min(8, t * 0.18), COLS * t, 4);
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = lay.ox + x * t, py = lay.oy + y * t;
        const c = tileAt(x, y);
        cx.fillStyle = (y % 2 === 0) ? th.g1 : th.g2;
        if ((x + y) % 2 === 0) cx.fillStyle = (y % 2 === 0) ? th.g2 : th.g1;
        cx.fillRect(px, py, t, t);
        tileTex(cx, px, py, t, x, y, th.tex);
        cx.strokeStyle = "rgba(255,255,255,0.05)";
        cx.strokeRect(px + 0.5, py + 0.5, t - 1, t - 1);
        if (c === "G") {
          const g = 0.35 + 0.2 * Math.sin(now / 350);
          cx.fillStyle = `rgba(255,214,102,${g})`;
          cx.fillRect(px, py, t, t);
        }
      }
    }
    // decori
    (th.deco || []).forEach((d) => { if (!isWall(d[1], d[2]) && tileAt(d[1], d[2]) === ".") drawDeco(cx, d[0], lay.ox + d[1] * t, lay.oy + d[2] * t, t, now); });
    // linee campo
    if (th.tex === "pitch") {
      cx.strokeStyle = "rgba(255,255,255,0.35)"; cx.lineWidth = 2;
      cx.strokeRect(lay.ox + 1, lay.oy + 1, COLS * t - 2, ROWS * t - 2);
      cx.beginPath(); cx.moveTo(lay.ox, lay.oy + (ROWS * t) / 2); cx.lineTo(lay.ox + COLS * t, lay.oy + (ROWS * t) / 2); cx.stroke();
      cx.beginPath(); cx.arc(lay.ox + (COLS * t) / 2, lay.oy + (ROWS * t) / 2, t * 1.3, 0, Math.PI * 2); cx.stroke();
    }
  }

  function drawObstacles(now) {
    const t = lay.t, th = S.ch.theme;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const c = tileAt(x, y);
        const px = lay.ox + x * t, py = lay.oy + y * t;
        if (c === "#") drawWall(cx, th.wall, px, py, t);
        else if (c === "~") drawCover(cx, th.cover, px, py, t, now, x);
        else if (c === "G") drawGoal(cx, th.goal, px, py, t, now);
      }
    }
  }

  function key2xy(k) { return { x: k % COLS, y: (k / COLS) | 0 }; }

  function fillTile(k, fill, stroke, inset) {
    const p = key2xy(k), t = lay.t, i = inset == null ? 2 : inset;
    const px = lay.ox + p.x * t + i, py = lay.oy + p.y * t + i;
    cx.fillStyle = fill; cx.fillRect(px, py, t - 2 * i, t - 2 * i);
    if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = 1.5; cx.strokeRect(px, py, t - 2 * i, t - 2 * i); }
  }
  function ringUnit(u, color, now) {
    const t = lay.t;
    const px = lay.ox + u.dx * t + t / 2, py = lay.oy + u.dy * t + t / 2;
    cx.strokeStyle = color; cx.lineWidth = 3;
    cx.beginPath(); cx.arc(px, py, t * (0.46 + 0.04 * Math.sin(now / 160)), 0, Math.PI * 2); cx.stroke();
  }

  function drawHighlights(now) {
    if (S.over) return;
    if (S.phase === "player") {
      const m = S.mode;
      if (m === "selected") {
        S.threat.forEach((k) => fillTile(k, "rgba(230,57,70,0.30)", "rgba(255,120,120,0.55)"));
        S.moveSet.forEach((k) => fillTile(k, "rgba(58,134,255,0.38)", "#6aa5ff"));
      }
      if (m === "retreat") S.moveSet.forEach((k) => fillTile(k, "rgba(58,134,255,0.38)", "#6aa5ff"));
      if (m === "selected" || m === "moved") {
        if (S.sel) {
          // gittata dalla posizione corrente
          const set = new Set(); ringTiles(S.sel.x, S.sel.y, S.sel.rng, set);
          if (m === "moved") set.forEach((k) => fillTile(k, "rgba(230,57,70,0.22)", "rgba(255,120,120,0.45)"));
        }
        S.atkList.forEach((u) => ringUnit(u, "#ff4d5a", now));
      }
      if (m === "confirm" && S.target) ringUnit(S.target, "#ffd166", now);
      if (m === "ability") S.abTargets.forEach((u) => ringUnit(u, "#7ee0a1", now));
      if (S.sel) ringUnit(S.sel, "#ffffff", now);
    }
    if (S.insp && S.phase === "player" && S.mode === "idle") {
      if (S.insp.team === "e") {
        S.inspThreat.forEach((k) => fillTile(k, "rgba(255,140,40,0.30)", "rgba(255,170,80,0.55)"));
        S.inspMove.forEach((k) => fillTile(k, "rgba(255,140,40,0.22)", "rgba(255,170,80,0.4)"));
      }
      ringUnit(S.insp, "#ffd166", now);
    }
    if (S.active) ringUnit(S.active, "#ff9f1c", now);
  }

  function drawUnit(u, now) {
    const t = lay.t;
    if (u.alpha <= 0.02) return;
    const px = lay.ox + u.dx * t + t / 2;
    let py = lay.oy + u.dy * t + t * 0.58;
    let lx = 0, ly = 0;
    if (u.lunge) {
      const p = (now - u.lunge.t0) / 220;
      if (p >= 1) u.lunge = null; else { const s = Math.sin(p * Math.PI) * t * 0.35; lx = u.lunge.vx * s; ly = u.lunge.vy * s; }
    }
    const idle = u.acted && u.team === "p" && !u.vip ? 0 : Math.sin(now / 300 + u.uid * 1.7) * t * 0.018;
    const sc = t / 46;
    cx.save();
    cx.globalAlpha = clamp(u.alpha, 0, 1);
    // ombra
    cx.fillStyle = "rgba(0,0,0,0.35)";
    cx.beginPath(); cx.ellipse(px, py + t * 0.28, t * 0.3, t * 0.1, 0, 0, Math.PI * 2); cx.fill();
    // anello stile
    cx.strokeStyle = STYLES[u.style].c; cx.lineWidth = 2.5;
    cx.beginPath(); cx.ellipse(px, py + t * 0.28, t * 0.34, t * 0.12, 0, 0, Math.PI * 2); cx.stroke();
    cx.translate(px + lx, py + ly + idle);
    cx.scale(sc, sc);
    if (u.fx === "crab") { cx.fillStyle = "#dc2626"; cx.beginPath(); cx.arc(-17, -3, 5.5, 0, Math.PI * 2); cx.fill(); cx.beginPath(); cx.arc(17, -3, 5.5, 0, Math.PI * 2); cx.fill(); cx.fillStyle = "#0b1320"; cx.fillRect(-19, -4, 4, 1.5); cx.fillRect(15, -4, 4, 1.5); }
    if (u.fly) { // ali per i gabbiani
      cx.fillStyle = "rgba(255,255,255,0.85)";
      const fl = Math.sin(now / 90 + u.uid) * 4;
      cx.beginPath(); cx.ellipse(-16, -6 + fl, 9, 4, -0.5, 0, Math.PI * 2); cx.fill();
      cx.beginPath(); cx.ellipse(16, -6 - fl, 9, 4, 0.5, 0, Math.PI * 2); cx.fill();
    }
    // gambe
    cx.fillStyle = "#1f2937"; cx.fillRect(-7, 8, 5, 10); cx.fillRect(2, 8, 5, 10);
    cx.fillStyle = "#e5e7eb"; cx.fillRect(-8, 15, 7, 4); cx.fillRect(1, 15, 7, 4);
    // maglia
    cx.fillStyle = u.kit; rr(cx, -11, -8, 22, 18, 5); cx.fill();
    cx.fillStyle = u.kit2 || "rgba(255,255,255,0.22)"; cx.globalAlpha = clamp(u.alpha, 0, 1) * (u.kit2 ? 1 : 0.5); cx.fillRect(-11, 1, 22, 3); cx.globalAlpha = clamp(u.alpha, 0, 1);
    // braccia
    cx.fillStyle = u.skin; cx.fillRect(-14, -5, 4, 9); cx.fillRect(10, -5, 4, 9);
    // testa
    cx.fillStyle = u.skin; cx.beginPath(); cx.arc(0, -15, 8.5, 0, Math.PI * 2); cx.fill();
    cx.fillStyle = u.hair; cx.beginPath(); cx.arc(0, -17, 8.8, Math.PI, 0); cx.fill();
    cx.fillStyle = "#111"; cx.fillRect(-4, -15, 2, 2); cx.fillRect(2, -15, 2, 2);
    if (u.fx === "cat") { cx.fillStyle = u.hair; cx.beginPath(); cx.moveTo(-8, -20); cx.lineTo(-6, -29); cx.lineTo(-1, -22); cx.closePath(); cx.fill(); cx.beginPath(); cx.moveTo(8, -20); cx.lineTo(6, -29); cx.lineTo(1, -22); cx.closePath(); cx.fill(); cx.strokeStyle = "#111"; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(-9, -12); cx.lineTo(-14, -13); cx.moveTo(9, -12); cx.lineTo(14, -13); cx.stroke(); }
    if (u.fx === "gull") { cx.fillStyle = "#f59e0b"; cx.beginPath(); cx.moveTo(-2, -13); cx.lineTo(2, -13); cx.lineTo(0, -8); cx.closePath(); cx.fill(); }
    if (u.vip) { cx.fillStyle = "#fbbf24"; cx.beginPath(); cx.moveTo(0, -29); cx.bezierCurveTo(-8, -37, -14, -27, 0, -20); cx.bezierCurveTo(14, -27, 8, -37, 0, -29); cx.fill(); cx.strokeStyle = "#7c2d12"; cx.lineWidth = 1.2; cx.stroke(); }
    if (u.leader) { cx.fillStyle = "#fbbf24"; cx.fillRect(-11, -2, 22, 3); }
    if (u.boss) { cx.fillStyle = "#fbbf24"; cx.beginPath(); cx.moveTo(-8, -23); cx.lineTo(-8, -31); cx.lineTo(-4, -26); cx.lineTo(0, -32); cx.lineTo(4, -26); cx.lineTo(8, -31); cx.lineTo(8, -23); cx.closePath(); cx.fill(); }
    // iniziale
    cx.fillStyle = "#fff"; cx.font = "bold 11px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(u.name[0], 0, 1);
    if (u.acted && u.team === "p" && !u.vip) { cx.fillStyle = "rgba(15,23,42,0.5)"; rr(cx, -14, -25, 28, 44, 10); cx.fill(); }
    if (u.flash > 0) { cx.fillStyle = `rgba(255,255,255,${Math.min(1, u.flash)})`; rr(cx, -14, -25, 28, 44, 10); cx.fill(); }
    if (u.guard) { cx.strokeStyle = "#7db4ff"; cx.lineWidth = 3; cx.beginPath(); cx.arc(0, -3, 24, 0, Math.PI * 2); cx.stroke(); }
    cx.restore();
    // barra energia
    cx.save();
    cx.globalAlpha = clamp(u.alpha, 0, 1);
    const bw = t * 0.72, bx = px - bw / 2, by = lay.oy + u.dy * t + t * 0.03;
    cx.fillStyle = "rgba(0,0,0,0.65)"; cx.fillRect(bx - 1, by - 1, bw + 2, 7);
    const hp = clamp(u.hpv / u.maxHp, 0, 1);
    cx.fillStyle = hp > 0.5 ? "#22c55e" : hp > 0.25 ? "#eab308" : "#ef4444";
    cx.fillRect(bx, by, bw * hp, 5);
    if (S.mode === "confirm" && S.target === u && S.sel) {
      const f = combat(S.sel, u, S.abMode && S.abMode.id === "cannone" ? { bonus: 3, noCounter: true } : {});
      const after = clamp((u.hp - f.dmg) / u.maxHp, 0, 1);
      cx.fillStyle = "rgba(255,255,255,0.85)"; cx.fillRect(bx + bw * after, by, bw * (hp - after), 5);
    }
    // badge stile
    cx.fillStyle = STYLES[u.style].c;
    cx.beginPath(); cx.arc(px + t * 0.34, py + t * 0.2, t * 0.14, 0, Math.PI * 2); cx.fill();
    cx.strokeStyle = "#0b1320"; cx.lineWidth = 1.5; cx.stroke();
    cx.fillStyle = "#0b1320"; cx.font = `bold ${Math.round(t * 0.2)}px sans-serif`; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(STYLES[u.style].l, px + t * 0.34, py + t * 0.21);
    // squadra: punto bordo
    cx.fillStyle = u.team === "p" ? "#60a5fa" : "#f87171";
    cx.fillRect(bx - 1, by - 1, 3, 7);
    cx.restore();
  }

  function drawFx(now, dt) {
    const t = lay.t;
    // proiettile
    if (S.proj) {
      const p = clamp((now - S.proj.t0) / Math.max(1, S.proj.dur), 0, 1);
      const x = S.proj.x0 + (S.proj.x1 - S.proj.x0) * p, y = S.proj.y0 + (S.proj.y1 - S.proj.y0) * p;
      const px = lay.ox + x * t + t / 2, py = lay.oy + y * t + t / 2 - Math.sin(p * Math.PI) * t * 0.6;
      cx.fillStyle = "#fff"; cx.beginPath(); cx.arc(px, py, t * 0.14, 0, Math.PI * 2); cx.fill();
      cx.fillStyle = "#111"; cx.beginPath(); cx.arc(px, py, t * 0.06, 0, Math.PI * 2); cx.fill();
    }
    // particelle
    S.parts = S.parts.filter((p) => p.life > 0);
    S.parts.forEach((p) => {
      p.x += p.vx * dt * 3 / t * 20; p.y += p.vy * dt * 3 / t * 20; p.vy += dt * 3; p.life -= dt * 2;
      const px = lay.ox + p.x * t + t / 2 + p.vx * (1 - p.life) * 14, py = lay.oy + p.y * t + t / 2 + p.vy * (1 - p.life) * 10;
      cx.globalAlpha = clamp(p.life, 0, 1); cx.fillStyle = p.color;
      cx.fillRect(px, py, 3, 3);
    });
    cx.globalAlpha = 1;
    // numeri
    S.floaters = S.floaters.filter((f) => now - f.t0 < 1100);
    S.floaters.forEach((f) => {
      const a = (now - f.t0) / 1100;
      const px = lay.ox + f.x * t + t / 2, py = lay.oy + f.y * t - a * t * 0.8;
      cx.globalAlpha = clamp(1.5 - a * 1.3, 0, 1);
      cx.font = `900 ${Math.round(t * (f.big ? 0.42 : 0.36))}px sans-serif`;
      cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.lineWidth = 4; cx.strokeStyle = "#0b1320"; cx.strokeText(f.text, px, py);
      cx.fillStyle = f.color; cx.fillText(f.text, px, py);
    });
    cx.globalAlpha = 1;
  }

  function frame(ts) {
    if (!alive) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (ts - lastFrame) / 1000 || 0.016);
    lastFrame = ts;
    if (!cx) return;
    cx.setTransform(lay.dpr, 0, 0, lay.dpr, 0, 0);
    cx.clearRect(0, 0, lay.w, lay.h);
    if (!S) {
      const tn = performance.now();
      (SCENES[bgCh ? bgCh.theme.scene : "menu"] || SCENES.menu)(cx, lay.w, lay.h, tn);
      if (bgCh && bgCh.theme.amb && AMBIENT[bgCh.theme.amb]) AMBIENT[bgCh.theme.amb](cx, lay.w, lay.h, tn);
      return;
    }
    const now = performance.now();
    // animazioni stato
    const k = 1 - Math.exp(-dt * 18);
    S.units.forEach((u) => {
      u.dx += (u.x - u.dx) * k; u.dy += (u.y - u.dy) * k;
      if (Math.abs(u.x - u.dx) < 0.01) u.dx = u.x;
      if (Math.abs(u.y - u.dy) < 0.01) u.dy = u.y;
      u.alpha += (u.alphaT - u.alpha) * (1 - Math.exp(-dt * 6));
      u.hpv += (u.hp - u.hpv) * (1 - Math.exp(-dt * 9));
      if (Math.abs(u.hp - u.hpv) < 0.05) u.hpv = u.hp;
      if (u.flash > 0) u.flash = Math.max(0, u.flash - dt * 4);
    });
    S.shake = Math.max(0, S.shake - dt * 30);
    cx.save();
    if (S.shake > 0) cx.translate((Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake);
    drawBoard(now);
    drawHighlights(now);
    drawObstacles(now);
    const sorted = S.units.filter((u) => u.alpha > 0.02).sort((a, b) => a.dy - b.dy);
    sorted.forEach((u) => drawUnit(u, now));
    drawFx(now, dt);
    cx.restore();
    // atmosfera HD2D: tinta + vignetta + luci
    cx.fillStyle = S.ch.theme.tint; cx.fillRect(0, 0, lay.w, lay.h);
    if (S.ch.theme.amb && AMBIENT[S.ch.theme.amb]) AMBIENT[S.ch.theme.amb](cx, lay.w, lay.h, now);
    const vg = cx.createRadialGradient(lay.w / 2, lay.h / 2, Math.min(lay.w, lay.h) * 0.35, lay.w / 2, lay.h / 2, Math.max(lay.w, lay.h) * 0.75);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)");
    cx.fillStyle = vg; cx.fillRect(0, 0, lay.w, lay.h);
  }

  // ---------------------------------------------------------------- input canvas
  function onCanvasTap(e) {
    if (!S || !cv) return;
    const r = cv.getBoundingClientRect();
    const gx = Math.floor((e.clientX - r.left - lay.ox) / lay.t);
    const gy = Math.floor((e.clientY - r.top - lay.oy) / lay.t);
    onCell(gx, gy);
  }

  // ---------------------------------------------------------------- apertura
  window.openTacticalEmblemMode = function (onExit) {
    if (root) cleanup();
    onExitCb = onExit;
    save = loadSave();
    alive = true;
    S = null;
    mount();
    on(cv, "click", onCanvasTap);
    on(root, "click", (e) => {
      if (e.target.closest("#remClose")) { closeAll(); return; }
      if (e.target.closest("#remHelp")) { showTutorial(0, true); return; }
      if (e.target.closest("#remPanel")) { onPanelClick(e); return; }
      if (e.target.closest("#remScreen")) onScreenClick(e);
    });
    on(window, "resize", () => { layoutCanvas(); });
    if (typeof ResizeObserver === "function") {
      const ro = new ResizeObserver(() => layoutCanvas());
      ro.observe(q("#remStage"));
      listeners.push([{ removeEventListener() { ro.disconnect(); } }, "", null, null]);
    }
    on(window, "orientationchange", () => { setTimeout(layoutCanvas, 200); });
    layoutCanvas();
    updateBar();
    lastFrame = performance.now();
    rafId = requestAnimationFrame(frame);
    if (!save.tut) showTutorial(0, true); else showMenu();
    // ricalcola il layout appena il DOM è stabile
    setTimeout(layoutCanvas, 60);
    if (DEBUG) {
      window.__emblem = {
        get S() { return S; }, get lay() { return lay; }, get save() { return save; }, ROWS, COLS, CHAPTERS, REWARDS, MAXLV,
        // scorciatoie di debug: vittoria immediata, e funzioni interne per un bot di prova
        win() { if (S && !S.over) finish(true); },
        lose() { if (S && !S.over) finish(false, "debug"); },
        fn: { select, moveSel, askAttack, doConfirm, waitSel, endPlayerTurn, useAbility, abilityOn, abilityReady, abilityTargets, reach, combat, targetsFrom, unitAt, tileAt, dist, deselect, undoMove, retreatTo, isWall, squad, team, portrait, unitPortrait, thumb, startChapter, startBattle, showMenu },
        cellXY(gx, gy) { const r = cv.getBoundingClientRect(); return { x: r.left + lay.ox + (gx + 0.5) * lay.t, y: r.top + lay.oy + (gy + 0.5) * lay.t }; }
      };
    }
  };
})();
