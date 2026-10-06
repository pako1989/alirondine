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
  // Mappe 8x9: '.' prato, '#' ostacolo, '~' cespuglio (+2 difesa, -15% colpire), 'G' faro (meta)
  const CHAPTERS = [
    {
      id: "ch1", title: "Il Molo Vecchio", tag: "Elimina i Pescatori", obj: { type: "rout", text: "Sconfiggi tutti i Pescatori del Molo." },
      par: 6, parText: "Vinci entro 6 turni",
      theme: { g1: "#2f8f5b", g2: "#277a4d", tint: "rgba(255,160,50,0.13)", wall: "crate" },
      map: ["........", ".~....~.", "..#..#..", "........", "...~~...", "........", ".#....#.", "........", "........"],
      team: [["leo", 3, 7], ["nico", 5, 7], ["chicco", 4, 8]],
      enemies: [
        { name: "Gino il Mozzo", style: "potenza", hp: 20, atk: 9, def: 3, spd: 3, skl: 4, mov: 3, x: 3, y: 1, kit: "#9a6b2f", hair: "#555", skin: "#d9a066" },
        { name: "Rino Tirante", style: "potenza", hp: 22, atk: 9, def: 4, spd: 3, skl: 4, mov: 3, x: 5, y: 0, hold: true, kit: "#9a6b2f", hair: "#222", skin: "#c68642" },
        { name: "Baciccia Sr", style: "velocita", hp: 17, atk: 8, def: 2, spd: 7, skl: 5, mov: 4, x: 6, y: 2, kit: "#9a6b2f", hair: "#bbb", skin: "#e0ac69" }
      ],
      intro: [
        { s: "Leo", t: "Il campo del molo è illuminato solo dalle lampare. Se qui ci rispettano, ci rispetta tutta la costa." },
        { s: "Nico", t: "I Pescatori del Molo? Menano come fabbri e profumano di acciuga. Io però corro più forte!" },
        { s: "Baciccia", t: "Ricordate il triangolo: Tecnica batte Potenza, Potenza batte Velocità, Velocità batte Tecnica. Giocate d'astuzia, non di orgoglio." }
      ],
      outro: { s: "Gino il Mozzo", t: "Bella partita, ragazzi. Domani vi offro il fritto misto. Ma la rivincita è mia." }
    },
    {
      id: "ch2", title: "Assedio dei Gabbiani", tag: "Resisti 6 turni", obj: { type: "survive", turns: 6, text: "Resisti 6 turni: i Gabbiani del Porto vogliono i panini!" },
      par: 5, parText: "Sconfiggi almeno 5 gabbiani", parKind: "kills",
      theme: { g1: "#3b9a6a", g2: "#31845a", tint: "rgba(120,180,255,0.12)", wall: "crate" },
      map: ["........", "........", ".~....~.", "........", "..#..#..", "...~~...", "........", ".~....~.", "........"],
      team: [["leo", 3, 7], ["sara", 4, 7], ["chicco", 3, 6], ["nico", 4, 6]],
      enemies: [
        { name: "Gabbiano Beccone", style: "velocita", hp: 12, atk: 8, def: 1, spd: 8, skl: 5, mov: 5, x: 1, y: 0, fly: true, kit: "#e5e7eb", hair: "#f59e0b", skin: "#fef3c7" },
        { name: "Gabbiano Pigolone", style: "velocita", hp: 12, atk: 8, def: 1, spd: 8, skl: 5, mov: 5, x: 3, y: 0, fly: true, kit: "#e5e7eb", hair: "#f59e0b", skin: "#fef3c7" },
        { name: "Gabbiano Rubapane", style: "tecnica", hp: 13, atk: 8, def: 2, spd: 7, skl: 6, mov: 5, x: 5, y: 0, fly: true, kit: "#cbd5e1", hair: "#f59e0b", skin: "#fef3c7" }
      ],
      waves: [
        { turn: 2, list: [
          { name: "Gabbiano Strillone", style: "velocita", hp: 12, atk: 8, def: 1, spd: 8, skl: 5, mov: 5, fly: true, kit: "#e5e7eb", hair: "#f59e0b", skin: "#fef3c7" },
          { name: "Gabbiano Sfacciato", style: "tecnica", hp: 13, atk: 8, def: 2, spd: 7, skl: 6, mov: 5, fly: true, kit: "#cbd5e1", hair: "#f59e0b", skin: "#fef3c7" }
        ] },
        { turn: 4, list: [
          { name: "Gabbiano Reale", style: "potenza", hp: 24, atk: 10, def: 4, spd: 4, skl: 5, mov: 4, fly: true, kit: "#94a3b8", hair: "#f59e0b", skin: "#fef3c7", boss: false },
          { name: "Gabbiano Lampo", style: "velocita", hp: 12, atk: 8, def: 1, spd: 9, skl: 5, mov: 5, fly: true, kit: "#e5e7eb", hair: "#f59e0b", skin: "#fef3c7" }
        ] }
      ],
      intro: [
        { s: "Sara", t: "Ho tirato fuori il cestino del pranzo e... ragazzi, c'è uno stormo che ci guarda. Non mi piace come ci guarda." },
        { s: "Chicco", t: "Sono gabbiani, mica draghi. Un panino a testa e se ne vanno." },
        { s: "Leo", t: "Non è il panino, è una questione di principio. Compatti, e teniamo la palla lontana dalle loro ali!" }
      ],
      outro: { s: "Sara", t: "Il cestino è salvo. Quell'ultimo gabbiano mi ha lasciato una piuma... la tengo, è il mio portafortuna." }
    },
    {
      id: "ch3", title: "Corsa al Faro", tag: "Raggiungi il Faro", obj: { type: "reach", turns: 9, text: "Porta Leo sul Faro (casella gialla) entro 9 turni." },
      par: 6, parText: "Arriva entro 6 turni",
      theme: { g1: "#2d7f66", g2: "#256b56", tint: "rgba(70,90,200,0.20)", wall: "rock" },
      map: ["##.GG.##", "#..~~..#", "...##...", ".~....~.", "##.~~.##", "........", ".#....#.", "........", "........"],
      team: [["leo", 3, 8], ["sara", 4, 8], ["nico", 2, 7], ["chicco", 5, 7], ["tommy", 3, 7]],
      enemies: [
        { name: "Custode Aldo", style: "potenza", hp: 24, atk: 10, def: 4, spd: 3, skl: 5, mov: 3, x: 2, y: 1, hold: true, kit: "#7f1d1d", hair: "#777", skin: "#d9a066" },
        { name: "Lampista Ines", style: "tecnica", hp: 17, atk: 9, def: 2, spd: 5, skl: 7, mov: 3, x: 5, y: 2, hold: true, rng: [2, 2], kit: "#7f1d1d", hair: "#4b2e83", skin: "#f1c27d" },
        { name: "Cane Pippo", style: "velocita", hp: 15, atk: 8, def: 1, spd: 9, skl: 5, mov: 5, x: 1, y: 3, kit: "#7f1d1d", hair: "#a16207", skin: "#a16207" },
        { name: "Gigi Marinaio", style: "potenza", hp: 22, atk: 10, def: 4, spd: 3, skl: 5, mov: 3, x: 5, y: 3, hold: true, kit: "#7f1d1d", hair: "#222", skin: "#c68642" }
      ],
      intro: [
        { s: "Leo", t: "Il Faro è spento da stanotte e il custode dice che solo chi arriva in cima per primo può riaccenderlo." },
        { s: "Tommy", t: "Posso riaccenderlo io! Ho un cannone... ah, no, quello serve per i difensori. Vabbè, ci penso strada facendo." },
        { s: "Sara", t: "Leo, non devi vincere ogni duello. Devi solo arrivare in cima. Noi apriamo la strada, tu corri." }
      ],
      outro: { s: "Leo", t: "La luce gira sul mare. Qualcuno, da qualche parte, la sta guardando e sa che può tornare a casa." }
    },
    {
      id: "ch4", title: "I Corsari di Capitan Vanni", tag: "Batti il Capitano", obj: { type: "boss", text: "Sconfiggi Capitan Vanni: la ciurma si arrende con lui." },
      par: 8, parText: "Vinci entro 8 turni",
      theme: { g1: "#2a8556", g2: "#226f48", tint: "rgba(210,60,40,0.14)", wall: "rock" },
      map: ["........", ".~.##.~.", "........", "...~~...", ".#....#.", "........", "..~..~..", "........", "........"],
      team: [["leo", 3, 8], ["sara", 4, 8], ["nico", 2, 7], ["chicco", 5, 7], ["tommy", 4, 7]],
      enemies: [
        { name: "Capitan Vanni", style: "tecnica", hp: 34, atk: 11, def: 5, spd: 6, skl: 8, mov: 3, x: 3, y: 0, hold: true, boss: true, kit: "#111827", hair: "#9ca3af", skin: "#d9a066" },
        { name: "Corsaro Bruno", style: "potenza", hp: 26, atk: 10, def: 4, spd: 3, skl: 5, mov: 3, x: 2, y: 2, kit: "#111827", hair: "#222", skin: "#c68642" },
        { name: "Corsaro Silvano", style: "velocita", hp: 20, atk: 9, def: 2, spd: 8, skl: 6, mov: 5, x: 6, y: 2, kit: "#111827", hair: "#b45309", skin: "#e8b88a" },
        { name: "Lo Sparagnino", style: "tecnica", hp: 18, atk: 9, def: 2, spd: 5, skl: 7, mov: 3, x: 5, y: 1, hold: true, rng: [2, 2], kit: "#111827", hair: "#555", skin: "#f1c27d" },
        { name: "Tonno Pesante", style: "potenza", hp: 26, atk: 10, def: 5, spd: 2, skl: 4, mov: 3, x: 1, y: 2, hold: true, kit: "#111827", hair: "#222", skin: "#d9a066" }
      ],
      intro: [
        { s: "Capitan Vanni", t: "Siete arrivati fin qui, ragazzi del Borgo? Bravi. Ma il trofeo del Faro appartiene ai Corsari da quando avevo i capelli!" },
        { s: "Leo", t: "La Rondine non abbassa mai la cresta. Ognuno di noi gioca per quelli che non possono essere qui stasera." },
        { s: "Don Aurelio", t: "Coraggio figlioli: testa alta, palla a terra e cuore fino al novantesimo. E poi, caffè per tutti!" }
      ],
      outro: { s: "Capitan Vanni", t: "Mi avete battuto con garbo. Terrò la sciarpa della Rondine nella mia cabina. Ci vediamo alla prossima marea." }
    }
  ];

  const REWARDS = { ch1: 3, ch2: 4, ch3: 4, ch4: 6 };

  const TUTORIAL = [
    { ico: "🛡️", t: "Benvenuto in Rondine Emblem", b: "Una battaglia a turni sul campo di calcio. Muovi la tua squadra, sconfiggi i rivali e porta a termine l'obiettivo del capitolo. Se <b>Leo</b> (il capitano) va ko, la partita è persa." },
    { ico: "👆", t: "Muovi e attacca", b: "Tocca un tuo giocatore: le caselle <b style='color:#7db4ff'>blu</b> sono dove può andare, quelle <b style='color:#ff8a8a'>rosse</b> dove può colpire. Poi scegli: <b>Attacca</b> toccando un rivale, usa l'<b>Abilità</b> o <b>Attendi</b>. Tocca un rivale per vedere il suo raggio d'azione." },
    { ico: "🔺", t: "Il triangolo dello stile", b: "<b style='color:#7db4ff'>Tecnica</b> batte <b style='color:#ff8a8a'>Potenza</b>, <b style='color:#ff8a8a'>Potenza</b> batte <b style='color:#ffd84d'>Velocità</b>, <b style='color:#ffd84d'>Velocità</b> batte <b style='color:#7db4ff'>Tecnica</b>. Chi ha il vantaggio colpisce di più e sbaglia meno. Prima di ogni attacco vedi l'anteprima di danni e probabilità." },
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
  function teamLevel() { return Math.min(4, Math.floor(totalStars() / 3)); }

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
      alpha: 1, alphaT: 1, flash: 0, lunge: null, hpv: 0, hold: false, fly: false, boss: false, leader: false
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
  function buildEnemy(e, x, y) {
    const r = Object.assign({}, e);
    const d = save.diff;
    r.hp = Math.round(r.hp * (d === "easy" ? 0.85 : d === "hard" ? 1.15 : 1));
    r.atk = Math.max(3, r.atk + (d === "easy" ? -1 : d === "hard" ? 2 : 0));
    if (x != null) { r.x = x; r.y = y; }
    r.role = r.boss ? "Capitano avversario" : r.hold ? "Presidia la zona" : "Assalta";
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
    if (!team("p").length) { finish(false, "Tutta la squadra è ko."); return true; }
    const t = S.ch.obj.type;
    if (t === "rout" && !team("e").length) { finish(true); return true; }
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
  function startBattle(ci) {
    const ch = CHAPTERS[ci];
    S = {
      ci, ch, units: [], uid: 1, turn: 1, phase: "player", mode: "idle", sel: null, insp: null, busy: false, over: false,
      floaters: [], parts: [], shake: 0, proj: null, focus: null, active: null, stats: { ko: 0, kills: 0 },
      moveSet: new Set(), threat: new Set(), R: null, atkList: [], abTargets: [], target: null, abMode: null, origin: null, msg: ""
    };
    ch.team.forEach((p) => S.units.push(buildPlayer(p[0], p[1], p[2])));
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
    return "Tocca un tuo giocatore. Quando hai finito, premi Fine turno.";
  }

  function startPlayerTurn() {
    S.phase = "player"; S.busy = false; S.mode = "idle"; S.sel = null; S.insp = null; S.active = null;
    S.units.forEach((u) => {
      if (u.team === "p") { u.acted = false; u.moved = false; u.guard = false; if (u.cd > 0) u.cd--; }
    });
    S.msg = hintFor();
    snd("playWhistle");
    updateBar();
    renderPanel();
  }

  function allActed() { return team("p").every((u) => u.acted); }

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
    if (obj.type === "survive" && S.turn >= obj.turns) { finish(true); return; }
    if (obj.type === "reach" && S.turn >= obj.turns) { finish(false, "Il Faro resta spento: tempo scaduto."); return; }
    // rinforzi
    const wave = (S.ch.waves || []).find((w) => w.turn === S.turn);
    if (wave) {
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
    if (id === "lancio") return S.units.filter((x) => x.hp > 0 && x.team === "p" && x !== u && x.acted && dist(u, x) <= 3);
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
.rem-panel{flex:0 0 auto;background:#0b1320;border-top:2px solid #1e3a5f;padding:8px 10px calc(8px + env(safe-area-inset-bottom));height:clamp(200px,36vh,260px);overflow-y:auto;overflow-x:hidden}
.rem-msg{font-size:13px;color:#cbd5e1;line-height:1.35;margin:0 0 8px}
.rem-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.rem-row.one{grid-template-columns:1fr}
.rem-row.three{grid-template-columns:1fr 1fr 1fr;gap:6px}.rem-row.three .rem-btn{font-size:12.5px;padding:4px 4px}
.rem-btn{min-height:46px;border:0;border-radius:10px;background:#1d4ed8;color:#fff;font-size:14px;font-weight:700;padding:6px 10px;cursor:pointer;line-height:1.15}
.rem-btn.red{background:#c2303c}.rem-btn.gray{background:#334155}.rem-btn.green{background:#15803d}.rem-btn.gold{background:#b7791f}
.rem-btn:disabled{opacity:.4;cursor:default}
.rem-btn small{display:block;font-weight:400;font-size:10.5px;opacity:.85}
.rem-card{background:#111c30;border:1px solid #243552;border-radius:10px;padding:7px 9px;margin-bottom:8px;font-size:12.5px;line-height:1.35}
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
.rem-dlg{margin-top:auto;background:#111c30;border:2px solid #38bdf8;border-radius:14px;padding:12px;min-height:150px}
.rem-dlg .who{display:flex;align-items:center;gap:10px;margin-bottom:8px}
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

  function showScreen(html) {
    const el = q("#remScreen");
    if (!el) return;
    el.innerHTML = html ? `<div class="rem-screen">${html}</div>` : "";
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
      ab = `<div class="rem-dim" style="margin-top:3px"><b style="color:#fde68a">${u.ab.name}</b> ${u.cd > 0 ? "(tra " + u.cd + " t.)" : ""} ${u.ab.desc}</div>`;
    }
    const extra = [u.fly ? "vola sopra gli ostacoli" : "", u.guard ? "in difesa (-50%)" : "", u.team === "e" ? (u.hold ? "presidia" : "all'attacco") : ""].filter(Boolean).join(" · ");
    return `<div class="rem-card"><div><span class="n">${u.name}</span><span class="rem-chip" style="background:${st.c}">${st.l} ${st.n}</span></div>
      <div class="rem-dim">${u.role || ""}</div>
      <div class="rem-hp"><i style="width:${pct}%;background:${col}"></i></div>
      <div class="rem-stats"><span>❤ ${u.hp}/${u.maxHp}</span><span>ATK ${u.atk}</span><span>DIF ${u.def}</span><span>VEL ${u.spd}</span><span>MOV ${u.mov}</span><span>${rng}</span></div>
      ${extra ? `<div class="rem-dim">${extra}</div>` : ""}${ab}</div>`;
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
    return `<div class="rem-card rem-fc"><div><b>${a.name} ➜ ${d.name}</b>${advTxt}</div>
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
      const left = team("p").filter((u) => !u.acted).length;
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
    S = null;
    updateBar();
    const p = q("#remPanel"); if (p) p.innerHTML = `<p class="rem-msg">Seleziona difficoltà e capitolo. Le stelle fanno crescere la squadra.</p>`;
    let cards = "";
    CHAPTERS.forEach((c, i) => {
      const cl = save.cleared[c.id];
      const prevOk = i === 0 || save.cleared[CHAPTERS[i - 1].id];
      const stars = cl ? "★".repeat(cl.stars) + "☆".repeat(3 - cl.stars) : "☆☆☆";
      cards += `<button class="rem-ch" data-ch="${i}" ${prevOk ? "" : "disabled"}><b>${prevOk ? "" : "🔒 "}Cap. ${i + 1} · ${c.title}</b><span>${prevOk ? "🎯 " + c.tag : "Completa il capitolo precedente"}</span><span class="st">${stars}</span></button>`;
    });
    const lv = teamLevel();
    const nextAt = (lv + 1) * 3;
    showScreen(`
      <h1>Rondine Emblem</h1>
      <div class="sub">Tattica a turni sul campo del Borgo. Livello squadra <b style="color:#fde68a">${lv + 1}</b>${lv < 4 ? ` (prossimo a ${nextAt} ★)` : " (massimo)"} · ★ ${totalStars()}/${CHAPTERS.length * 3}${lv ? ` · bonus: +${2 * lv} energia, +${Math.floor((lv + 1) / 2)} attacco` : ""}</div>
      <div class="rem-seg">${Object.keys(DIFFS).map((k) => `<button data-d="${k}" class="${save.diff === k ? "on" : ""}">${DIFFS[k]}</button>`).join("")}</div>
      ${cards}
      <div class="rem-row" style="margin-top:6px"><button class="rem-btn gray" data-m="help">❓ Come si gioca</button><button class="rem-btn red" data-m="exit">Esci ✕</button></div>`);
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

  const SPEAKER_COL = { Leo: "#1d4ed8", Nico: "#d97706", Sara: "#be185d", Chicco: "#15803d", Tommy: "#7c3aed", Baciccia: "#475569", "Don Aurelio": "#6b21a8", "Capitan Vanni": "#111827", "Gino il Mozzo": "#9a6b2f" };

  function showDialogue(lines, i, after) {
    if (i >= lines.length) { after(); return; }
    const l = lines[i];
    S_dlg = { lines, i, after };
    showScreen(`
      <div style="text-align:right"><button class="rem-btn gray" style="min-width:90px" data-dlg="skip">Salta ⏭</button></div>
      <div class="rem-dlg" data-dlg="next">
        <div class="who"><div class="rem-av" style="background:${SPEAKER_COL[l.s] || "#334155"}">${l.s[0]}</div><b style="font-size:17px;color:#7dd3fc">${l.s}</b></div>
        <p>${l.t}</p>
        <div class="rem-hintc">Tocca per continuare ▸ (${i + 1}/${lines.length})</div>
      </div>`);
  }
  let S_dlg = null;

  function startChapter(ci) {
    const ch = CHAPTERS[ci];
    S = null;
    updateBar();
    const p = q("#remPanel"); if (p) p.innerHTML = "";
    showDialogue(ch.intro, 0, () => { startBattle(ci); });
    // pre-schermata con titolo capitolo
    const first = q(".rem-dlg");
    if (first) first.insertAdjacentHTML("afterbegin", `<div class="rem-dim" style="font-size:12px;margin-bottom:6px">Capitolo ${ci + 1} · ${ch.title}</div>`);
  }

  function showResult(win, reason) {
    const ch = S.ch, ci = S.ci;
    let stars = 0, lines = "", coinTxt = "", newStars = 0;
    if (win) {
      const par = ch.parKind === "kills" ? S.stats.kills >= ch.par : S.turn <= ch.par;
      const noKo = S.stats.ko === 0;
      stars = 1 + (par ? 1 : 0) + (noKo ? 1 : 0);
      lines = `<div class="rem-rule">★ Capitolo superato</div>
        <div class="rem-rule" style="opacity:${par ? 1 : 0.5}">${par ? "★" : "☆"} ${ch.parText}${ch.parKind === "kills" ? ` (fatti: ${S.stats.kills})` : ` (turno ${S.turn})`}</div>
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
    showScreen(`
      <div class="rem-big" style="color:${win ? "#fde68a" : "#ff8a8a"}">${win ? "VITTORIA!" : "SCONFITTA"}</div>
      <div style="text-align:center;font-size:34px;color:#fbbf24;letter-spacing:6px">${win ? "★".repeat(stars) + "☆".repeat(3 - stars) : "☆☆☆"}</div>
      <div class="sub" style="text-align:center">${win ? ch.title : reason}</div>
      ${win ? `<div class="rem-dlg" style="margin-top:6px;min-height:0"><div class="who"><div class="rem-av" style="background:${SPEAKER_COL[ch.outro.s] || "#334155"}">${ch.outro.s[0]}</div><b style="color:#7dd3fc">${ch.outro.s}</b></div><p>${ch.outro.t}</p></div>` : `<div class="rem-rule">Non si molla: nessun giocatore è davvero ko, in panchina si ricarica tutto. Prova un'altra tattica: usa il triangolo e i cespugli!</div>`}
      ${lines}${coinTxt}
      ${win && newStars ? `<div class="rem-rule" style="color:#7ee0a1">Nuove stelle: +${newStars} · Livello squadra ${lv + 1}</div>` : ""}
      <div class="rem-row" style="margin-top:auto;padding-top:10px">
        ${next ? `<button class="rem-btn green" data-r="next">Capitolo ${ci + 2} ▸</button>` : `<button class="rem-btn" data-r="retry">${win ? "Rigioca" : "Riprova"} ↻</button>`}
        <button class="rem-btn gray" data-r="menu">☰ Capitoli</button>
      </div>
      ${next ? `<div class="rem-row one" style="margin-top:8px"><button class="rem-btn gray" data-r="retry">Rigioca questo ↻</button></div>` : ""}`);
    S.lastCi = ci;
    saveCi = ci;
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
    const t = Math.max(24, Math.floor(Math.min((w - 6) / COLS, (h - 6) / (ROWS + 0.45))));
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
    // sfondo
    const bg = cx.createLinearGradient(0, 0, 0, lay.h);
    bg.addColorStop(0, "#0a1626"); bg.addColorStop(1, "#06101c");
    cx.fillStyle = bg; cx.fillRect(0, 0, lay.w, lay.h);
    // spessore della zolla
    cx.fillStyle = "#3b2a1a";
    cx.fillRect(lay.ox, lay.oy + ROWS * t, COLS * t, Math.min(8, t * 0.18));
    cx.fillStyle = "rgba(0,0,0,0.4)";
    cx.fillRect(lay.ox + 4, lay.oy + ROWS * t + Math.min(8, t * 0.18), COLS * t, 4);
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const px = lay.ox + x * t, py = lay.oy + y * t;
        const c = tileAt(x, y);
        cx.fillStyle = (y % 2 === 0) ? th.g1 : th.g2;
        if ((x + y) % 2 === 0) cx.fillStyle = (y % 2 === 0) ? th.g2 : th.g1;
        cx.fillRect(px, py, t, t);
        cx.strokeStyle = "rgba(255,255,255,0.05)";
        cx.strokeRect(px + 0.5, py + 0.5, t - 1, t - 1);
        if (c === "G") {
          const g = 0.35 + 0.2 * Math.sin(now / 350);
          cx.fillStyle = `rgba(255,214,102,${g})`;
          cx.fillRect(px, py, t, t);
        }
      }
    }
    // linee campo
    cx.strokeStyle = "rgba(255,255,255,0.35)"; cx.lineWidth = 2;
    cx.strokeRect(lay.ox + 1, lay.oy + 1, COLS * t - 2, ROWS * t - 2);
    cx.beginPath(); cx.moveTo(lay.ox, lay.oy + (ROWS * t) / 2); cx.lineTo(lay.ox + COLS * t, lay.oy + (ROWS * t) / 2); cx.stroke();
    cx.beginPath(); cx.arc(lay.ox + (COLS * t) / 2, lay.oy + (ROWS * t) / 2, t * 1.3, 0, Math.PI * 2); cx.stroke();
  }

  function drawObstacles(now) {
    const t = lay.t, th = S.ch.theme;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const c = tileAt(x, y);
        const px = lay.ox + x * t, py = lay.oy + y * t;
        if (c === "#") {
          cx.fillStyle = "rgba(0,0,0,0.35)";
          cx.beginPath(); cx.ellipse(px + t / 2, py + t * 0.88, t * 0.42, t * 0.12, 0, 0, Math.PI * 2); cx.fill();
          if (th.wall === "crate") {
            cx.fillStyle = "#a16207"; rr(cx, px + t * 0.1, py + t * 0.12, t * 0.8, t * 0.74, 3); cx.fill();
            cx.strokeStyle = "#713f12"; cx.lineWidth = 2; cx.stroke();
            cx.beginPath(); cx.moveTo(px + t * 0.12, py + t * 0.3); cx.lineTo(px + t * 0.88, py + t * 0.3);
            cx.moveTo(px + t * 0.12, py + t * 0.62); cx.lineTo(px + t * 0.88, py + t * 0.62);
            cx.moveTo(px + t * 0.12, py + t * 0.14); cx.lineTo(px + t * 0.88, py + t * 0.84); cx.stroke();
          } else {
            cx.fillStyle = "#64748b";
            cx.beginPath(); cx.moveTo(px + t * 0.1, py + t * 0.86); cx.lineTo(px + t * 0.25, py + t * 0.25); cx.lineTo(px + t * 0.55, py + t * 0.12); cx.lineTo(px + t * 0.9, py + t * 0.45); cx.lineTo(px + t * 0.88, py + t * 0.86); cx.closePath(); cx.fill();
            cx.fillStyle = "rgba(255,255,255,0.18)";
            cx.beginPath(); cx.moveTo(px + t * 0.25, py + t * 0.25); cx.lineTo(px + t * 0.55, py + t * 0.12); cx.lineTo(px + t * 0.6, py + t * 0.5); cx.closePath(); cx.fill();
          }
        } else if (c === "~") {
          cx.fillStyle = "rgba(0,0,0,0.18)";
          cx.beginPath(); cx.ellipse(px + t / 2, py + t * 0.82, t * 0.4, t * 0.12, 0, 0, Math.PI * 2); cx.fill();
          const sway = Math.sin(now / 900 + x) * 1.2;
          [["#1f7a3d", 0.3, 0.6, 0.2], ["#2a9a4c", 0.55, 0.5, 0.24], ["#37b35c", 0.45, 0.68, 0.2], ["#2a9a4c", 0.7, 0.68, 0.17]].forEach((b) => {
            cx.fillStyle = b[0]; cx.beginPath(); cx.arc(px + t * b[1] + sway * 0.3, py + t * b[2], t * b[3], 0, Math.PI * 2); cx.fill();
          });
        } else if (c === "G") {
          cx.fillStyle = "rgba(0,0,0,0.3)";
          cx.beginPath(); cx.ellipse(px + t / 2, py + t * 0.9, t * 0.3, t * 0.08, 0, 0, Math.PI * 2); cx.fill();
          // faro
          cx.fillStyle = "#f8fafc"; cx.beginPath(); cx.moveTo(px + t * 0.3, py + t * 0.9); cx.lineTo(px + t * 0.4, py + t * 0.3); cx.lineTo(px + t * 0.6, py + t * 0.3); cx.lineTo(px + t * 0.7, py + t * 0.9); cx.closePath(); cx.fill();
          cx.fillStyle = "#dc2626"; cx.fillRect(px + t * 0.34, py + t * 0.5, t * 0.32, t * 0.12);
          cx.fillStyle = "#fde047"; cx.fillRect(px + t * 0.4, py + t * 0.18, t * 0.2, t * 0.14);
          cx.fillStyle = "#dc2626"; cx.fillRect(px + t * 0.36, py + t * 0.1, t * 0.28, t * 0.08);
        }
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
    const idle = u.acted && u.team === "p" ? 0 : Math.sin(now / 300 + u.uid * 1.7) * t * 0.018;
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
    if (u.leader) { cx.fillStyle = "#fbbf24"; cx.fillRect(-11, -2, 22, 3); }
    if (u.boss) { cx.fillStyle = "#fbbf24"; cx.beginPath(); cx.moveTo(-8, -23); cx.lineTo(-8, -31); cx.lineTo(-4, -26); cx.lineTo(0, -32); cx.lineTo(4, -26); cx.lineTo(8, -31); cx.lineTo(8, -23); cx.closePath(); cx.fill(); }
    // iniziale
    cx.fillStyle = "#fff"; cx.font = "bold 11px sans-serif"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText(u.name[0], 0, 1);
    if (u.acted && u.team === "p") { cx.fillStyle = "rgba(15,23,42,0.5)"; rr(cx, -14, -25, 28, 44, 10); cx.fill(); }
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
      const bg = cx.createLinearGradient(0, 0, 0, lay.h);
      bg.addColorStop(0, "#0a1626"); bg.addColorStop(1, "#102a3f");
      cx.fillStyle = bg; cx.fillRect(0, 0, lay.w, lay.h);
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
        get S() { return S; }, get lay() { return lay; }, get save() { return save; }, ROWS, COLS,
        cellXY(gx, gy) { const r = cv.getBoundingClientRect(); return { x: r.left + lay.ox + (gx + 0.5) * lay.t, y: r.top + lay.oy + (gy + 0.5) * lay.t }; }
      };
    }
  };
})();
