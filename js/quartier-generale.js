// js/quartier-generale.js - La Casa delle Stelle: il Quartier Generale delle 108 Stelle come luogo da percorrere a piedi
// Una zona del Borgo camminabile (TRZ.casa_stelle) che CRESCE coi quattro livelli del Quartier Generale (8 / 36 / 72 / 108 persone):
//   magazzino -> Spogliatoio -> Cortile -> Tribuna -> Casa delle 108 Stelle (otto stanze). Le parti non ancora aperte sono facciate chiuse.
// Ogni persona del roster (Stelle, residenti, reclute) sta come PNG nella stanza che gli somiglia; Pina tiene il Registro (la vecchia schermata).
// Bonus: SOLO economia e cosmetici (monete una tantum per livello, un barattolo giornaliero, foto da raccogliere, cosmetici HQ_COS esistenti).
// Mai statistiche, mai niente che tocchi le partite di storia o di Carriera.
// Va incluso DOPO game.js (e dopo cage-borgo.js / settimana-molo.js / diario-scoperte.js, ma non è obbligatorio: i moduli si leggono al volo).
// Salvataggio proprio: ali-di-rondine.quartier-generale (solo memoria narrativa, premi già presi, un giorno-per-premio).
(function () {
  "use strict";
  if (window.__casaStelleLoaded) return;
  window.__casaStelleLoaded = true;
  const DEBUG = /[?&]debug\b/.test(location.search || "");
  const ID = "casa_stelle", KEY = "ali-di-rondine.quartier-generale", MW = 44, MH = 36, TS = 16;
  let tries = 0;

  function init() {
    const api = window.__borgoApi;
    if (!api || !api.hq || !api.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    start(api);
  }

  function start(api) {
    const hq = api.hq, CAST = api.CAST, L = api.L, TRZ = api.TRZ;
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
    const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
    const cv2 = document.getElementById("cv"), g = cv2 && cv2.getContext("2d");
    const P = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

    // ------------------------------------------------------------------ memoria propria
    const mem = () => { try { const o = JSON.parse(localStorage.getItem(KEY) || "{}"); const m = o && typeof o === "object" && !Array.isArray(o) ? o : {}; ["rew", "day", "talked"].forEach((k) => { if (!m[k] || typeof m[k] !== "object" || Array.isArray(m[k])) m[k] = {}; }); return m; } catch (e) { return { rew: {}, day: {}, talked: {} }; } };
    const memSet = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignora */ } };
    const today = () => api.todayKey();
    const coins = (n) => { if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); return n; } catch (e) { return 0; } } return 0; };

    // ------------------------------------------------------------------ livello
    const people = () => { const seen = {}, out = []; safe(() => hq.roster(), []).forEach((p) => { if (p && p.id && !seen[p.id] && CAST[p.id]) { seen[p.id] = 1; out.push(p); } }); return out; };
    const count = () => safe(() => hq.count(), 0);
    const level = () => { const n = count(); return hq.levels.filter((x) => n >= x.need).length; };
    const LV_NAME = ["Il vecchio magazzino", "Spogliatoio", "Cortile", "Tribuna", "Casa delle 108 Stelle"];

    // ------------------------------------------------------------------ stanze
    // lv = livello a cui si apre; slots = tile dove può stare un PNG (verificati con BFS)
    const ROOMS = {
      hall: { name: "Il Magazzino", lv: 0, slots: [[17, 19], [18, 15], [26, 17], [27, 20], [24, 15], [19, 20]] },
      spog: { name: "Lo Spogliatoio", lv: 1, slots: [[3, 16], [10, 16], [3, 18], [6, 19], [10, 19], [8, 18]] },
      cort: { name: "Il Cortile", lv: 2, slots: [[9, 28], [11, 26], [16, 29], [17, 25], [26, 25], [29, 28], [32, 25], [36, 25], [38, 29], [8, 30], [26, 30], [37, 27]] },
      trib: { name: "La Tribuna", lv: 3, slots: [[35, 17], [39, 17], [34, 18], [40, 18], [34, 21], [38, 20], [41, 16], [41, 20], [33, 20]] },
      cucina: { name: "La Cucina Grande", lv: 4, slots: [[3, 4], [10, 4], [4, 5], [9, 5], [11, 3]] },
      biblio: { name: "La Biblioteca", lv: 4, slots: [[14, 4], [20, 4], [13, 5], [21, 5]] },
      musica: { name: "La Sala della Musica", lv: 4, slots: [[27, 3], [30, 3], [24, 5], [30, 5], [28, 5]] },
      serra: { name: "La Serra", lv: 4, slots: [[35, 4], [39, 4], [34, 5], [40, 5], [38, 3]] },
      officina: { name: "L'Officina", lv: 4, slots: [[3, 10], [9, 10], [7, 12], [2, 12]] },
      giochi: { name: "La Sala Giochi", lv: 4, slots: [[11, 10], [16, 10], [16, 12], [11, 12]] },
      osserv: { name: "L'Osservatorio", lv: 4, slots: [[27, 10], [27, 12], [33, 12], [31, 12]] },
      mare: { name: "La Sala del Mare", lv: 4, slots: [[35, 10], [40, 10], [40, 12], [35, 12]] },
    };
    const ROOM_KEYS = Object.keys(ROOMS), CASA = ["cucina", "biblio", "musica", "serra", "officina", "giochi", "osserv", "mare"];
    // se la stanza giusta è ancora chiusa, la persona si ferma nella parte aperta più simile
    const FALL = { cucina: ["cort", "hall"], biblio: ["trib", "hall"], musica: ["cort", "trib", "hall"], serra: ["cort", "hall"], officina: ["spog", "cort", "hall"], giochi: ["spog", "cort", "hall"], osserv: ["trib", "hall"], mare: ["cort", "trib", "hall"], spog: ["cort", "hall"], cort: ["hall"], trib: ["cort", "hall"], hall: ["hall"] };
    // stanza di casa: calciatori allo Spogliatoio, tifosi in Tribuna, banconi e chiacchiere al Cortile; il resto per mestiere
    const FIXED = {
      mattia: "spog", kevin: "spog", saverio: "spog", pietrino: "spog", mirko: "spog", nico: "spog", tommy: "spog", ruggeri: "spog", rocco: "spog", sv_brando: "spog", sv_palleggio: "spog",
      sv_voltagabbana: "trib", sv_grancassa: "trib", nonna: "trib", pina: "hall", aurelio: "trib", sv_pasquino: "trib", sv_bice: "giochi", sv_morgana: "giochi", sv_ugolino: "giochi", sv_portici: "giochi", sv_monetina: "giochi", sv_nando: "musica", sv_gattara: "serra",
      sv_tazzulella: "cort", tonino: "cort", sv_graziella: "cort", sv_sergio: "cort", sv_ida: "cort", baciccia: "cort", sv_amo: "cort", sv_colosseo: "cort",
      papa: "cucina", rita: "cucina", beassunta: "cucina", beevaristo: "cucina",
      sara: "biblio", anselmo: "biblio", begualtiero: "musica", settimio: "officina", benives: "officina",
      gigi: "osserv", ester: "osserv", benuccio: "osserv", bebruna: "osserv", ornella: "serra", betobia: "serra", bemirta: "serra",
      beschizzo: "mare", besandrone: "mare", befosca: "giochi", belupo: "mare",
    };
    const RULES = [
      ["osserv", /astronom|telescop|faro |lanterna|bussola|nottola|guardiano|cremagliera|binocol|marea|fanal|lampion|capitano|cielo/],
      ["mare", /nuotat|pescator|pedal|zattera|bagnin|sirena|scoglio|naufrag|barca|tonn|spiagg|abbronz|scogliera/],
      ["musica", /banda|trombett|musica|attric|teatro|puparo|tamburo|pizzica|gondolier|tranvier|campanell|cinema|sipario|dj /],
      ["cucina", /cuoc|fornai|pizzaiol|pasticc|cioccolat|barista|caffè|granit|orecchiett|mensa|seppie|focacc|cannol|acciug|olio/],
      ["serra", /basilic|capre|api |apicoltr|limon|erborist|ulivo|veterinar|tartarugh|orto|giardin|vignai/],
      ["officina", /elettricist|sart|scultor|vetro|maschere|costum|statuin|presepe|tetti|trull|rammend|reti |aquilon|costruttor|latta|falegnam|ricam/],
      ["biblio", /libr|enigmist|cartograf|archeolog|giornal|manifest|francobol|posta|lettere|ornitolog|pesatore|sudoku/],
      ["giochi", /bocc|palleggi|flipper|portier|spaventapasseri|calcio|gioc/],
    ];
    function homeRoom(p) {
      if (FIXED[p.id]) return FIXED[p.id];
      const s = hq.star(p.id), txt = ((s && s.bio) || "").toLowerCase() + " " + String(p.name || "").toLowerCase() + " ";
      for (const [k, re] of RULES) if (re.test(txt)) return k;
      return CASA[hash(p.id) % CASA.length];
    }
    function availRoom(home, lvl) {
      if (ROOMS[home] && ROOMS[home].lv <= lvl) return home;
      for (const k of FALL[home] || ["hall"]) if (ROOMS[k].lv <= lvl) return k;
      return "hall";
    }

    // ------------------------------------------------------------------ stato della zona
    let curMap = null, under = null, placed = {}, pinned = null, visitSeed = "", state = { back: null, fromBorgo: true }, lvlNow = 0;

    function choose(lvl) {
      const list = people().filter((p) => p.id !== "pina" && p.id !== "leo");
      const byRoom = {};
      list.forEach((p) => { const k = availRoom(homeRoom(p), lvl); (byRoom[k] = byRoom[k] || []).push(p); });
      const out = [], pl = {};
      ROOM_KEYS.forEach((k) => {
        const room = ROOMS[k], arr = byRoom[k] || [];
        const slots = room.slots.filter((s) => curMap && isFloor(curMap[s[1]] && curMap[s[1]][s[0]]));
        const sh = arr.slice().sort((a, b) => hash(a.id + "~" + visitSeed) - hash(b.id + "~" + visitSeed));
        let pick = sh.slice(0, slots.length);
        if (pinned) { const pp = arr.find((p) => p.id === pinned); if (pp && !pick.includes(pp)) pick = pick.slice(0, Math.max(0, slots.length - 1)).concat([pp]); }
        pick.forEach((p, i) => { out.push({ id: p.id, at: slots[i].slice() }); pl[p.id] = k; });
      });
      // chi non ha trovato posto nella propria stanza è di passaggio dal Magazzino (a rotazione: la visita dopo tocca ad altri)
      const hall = ROOMS.hall, hs = hall.slots.filter((sl) => curMap && isFloor(curMap[sl[1]] && curMap[sl[1]][sl[0]])).filter((sl) => !out.some((o) => o.at[0] === sl[0] && o.at[1] === sl[1]));
      const left = list.filter((p) => !pl[p.id]).sort((a, b) => hash(a.id + "^" + visitSeed) - hash(b.id + "^" + visitSeed));
      hs.forEach((sl, i) => { if (left[i]) { out.push({ id: left[i].id, at: sl.slice() }); pl[left[i].id] = "hall"; } });
      return { npcs: out, placed: pl, byRoom };
    }
    const FLOORS = "abcpthr.";
    const isFloor = (c) => !!c && FLOORS.includes(c);

    // ------------------------------------------------------------------ la zona
    const Z = TRZ[ID] = {
      name: "Casa delle Stelle", short: "Casa delle Stelle", sub: "Il magazzino che cresce: spogliatoio, cortile, tribuna e la casa di tutto il Borgo",
      need: 0, w: MW, h: MH, start: [21, 31], theme: "torino", bus: "a piedi", busLabel: "Esci dalla Casa delle Stelle",
      item: ["Foto del Quartier Generale", "Foto"], itemCos: "hq_stemma",
      items: [[10, 21], [29, 18], [3, 30], [40, 24], [41, 15], [3, 8], [40, 8], [21, 11]],
      bld: [], npcs: [], areas: [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: "XEqQvkyuglzjfedCAsowinmxFYH",
      tail: "Per uscire: il portone in fondo, o il Menu.",
      act: { E: "Esci", l: "Lavagna tattica", Q: "Panca dello spogliatoio", u: "Biliardino", g: "Gashapon", d: "Sfida del giorno", z: "Tabellone", j: "Albo d'oro", f: "Trofei", e: "Il Diario", y: "Registro", C: "Barattolo", A: "Leggi la targa", s: "Guarda i libri", o: "Assaggia", w: "Guarda il banco", i: "Suona", n: "Guarda", m: "Guarda i pesci", F: "Guarda", H: "Guarda", k: "Guarda le casse", v: "Apri un armadietto" },
      intro: [["voce", "Il portone del vecchio magazzino cigola."]],
    };

    function blocks(lvl) {
      const need = hq.levels.map((x) => x.need), n = count();
      const out = [], mk = (id, x, y, w, h, label, sign, roof, wall) => out.push({ id, x, y, w, h, roof: roof || "#6b5c4a", wall: wall || "#8a7a64", label, sign });
      const sg = (i, tx, ty, nm) => [tx, ty, nm, `servono ${need[i]} persone (${Math.min(n, need[i])}/${need[i]})`];
      if (lvl < 1) mk("spog_chiuso", 2, 14, 10, 8, "SPOGLIATOIO", sg(0, 7, 17.5, "SPOGLIATOIO · CHIUSO"));
      if (lvl < 2) { mk("cort_sx", 2, 23, 18, 9, "CORTILE", sg(1, 15, 27.5, "CORTILE · CHIUSO"), "#5d6b4a", "#7a8660"); mk("cort_dx", 24, 23, 18, 9, "CORTILE", null, "#5d6b4a", "#7a8660"); }
      if (lvl < 3) mk("trib_chiusa", 32, 14, 10, 8, "TRIBUNA", sg(2, 36.5, 17.5, "TRIBUNA · CHIUSA"), "#5a5f6a", "#7d8290");
      if (lvl < 4) mk("casa_chiusa", 2, 2, 40, 11, "CASA DELLE 108 STELLE", sg(3, 22, 10, "CASA DELLE 108 STELLE · CHIUSA"), "#55495a", "#756a7c");
      return out;
    }

    function hintsFor(lvl) {
      const n = count(), need = hq.levels.map((x) => x.need), left = (i) => Math.max(0, need[i] - n);
      return {
        "Il Magazzino": lvl >= 4 ? "Il vecchio magazzino è diventato l'atrio di casa. Pina tiene il Registro; le casse sono rimaste, per affetto." : lvl >= 1 ? "Un magazzino con meno casse e più voci. Il Registro è in fondo a sinistra, il barattolo a destra." : "Un magazzino vuoto: casse, polvere e un Registro che aspetta nomi. Con otto persone si apre il resto.",
        "Lo Spogliatoio": "Armadietti, panche e una lavagna tattica. La lavagna porta alla Squadra; la panca, allo Spogliatoio vero.",
        "Il Cortile": lvl >= 2 ? "Sedie portate da casa, un biliardino, un distributore di pupazzetti e una lavagna che propone la sfida del giorno." : `Un vialetto tra due recinti. Il cortile si apre con ${need[1]} persone: ne mancano ${left(1)}.`,
        "La Tribuna": "Gradini, bandierine, il tabellone della Settimana del Molo e il mare che non tifa per nessuno.",
        "Il Corridoio delle Stelle": "Un corridoio lungo la casa, con otto porte e la sensazione di essere aspettati.",
        "Lo Scalone": "Una targa di ottone e due piante che nessuno sa chi annaffia.",
        "La Cucina Grande": "Pentole da centotto porzioni e un odore che richiama persone dall'altra parte del Borgo.",
        "La Biblioteca": "Libri con dediche di sconosciuti. Ora si conoscono tutti.",
        "La Sala della Musica": "Un piano che stona con dignità e una banda che prova sempre la stessa battuta.",
        "La Serra": "Piante, un'arnia e un'umidità da giungla dei poveri.",
        "L'Officina": "Viti spaiate, un banco e l'idea che tutto si possa aggiustare, anche le cose non rotte.",
        "La Sala Giochi": "Un biliardino e un tavolo da bocce. Le regole sono appese al muro e non le rispetta nessuno.",
        "L'Osservatorio": "Un telescopio fatto con due tubi e una gran fiducia nel cielo.",
        "La Sala del Mare": "Un acquario, salsedine sulle sedie e conchiglie come fermacarte.",
        "Il Vialetto": lvl < 2 ? `Un vialetto tra due recinti. Il cortile si apre con ${need[1]} persone.` : "Il vialetto che porta al portone.",
        "Fuori dal portone": "La strada del Borgo. Il portone è alle tue spalle.",
      };
    }
    function areasFor(lvl) {
      const a = [];
      if (lvl >= 4) a.push([19, 9, 24, 13, "Lo Scalone"], [2, 2, 11, 5, "La Cucina Grande"], [13, 2, 21, 5, "La Biblioteca"], [23, 2, 31, 5, "La Sala della Musica"], [33, 2, 41, 5, "La Serra"],
        [2, 10, 9, 12, "L'Officina"], [11, 10, 17, 12, "La Sala Giochi"], [26, 10, 33, 12, "L'Osservatorio"], [35, 10, 41, 12, "La Sala del Mare"], [2, 7, 41, 8, "Il Corridoio delle Stelle"]);
      a.push([2, 14, 12, 21, "Lo Spogliatoio"], [31, 14, 41, 21, "La Tribuna"], [13, 14, 30, 21, "Il Magazzino"]);
      a.push(lvl >= 2 ? [2, 23, 41, 31, "Il Cortile"] : [2, 22, 41, 31, "Il Vialetto"]);
      a.push([0, 0, 43, 35, "Casa delle Stelle"]);
      return a;
    }

    // rigenera PNG (in base a livello, giorno, visita e persona cercata)
    function refreshNpcs() {
      const pick = choose(lvlNow), npcs = [{ id: "pina", at: [15, 17] }].concat(pick.npcs);
      placed = pick.placed; Z.npcs = npcs;
      return pick;
    }

    Z.build = function (m, fill) {
      curMap = m; under = Array.from({ length: MH }, () => Array(MW).fill("."));
      const lvl = lvlNow = level();
      Z.bld = blocks(lvl); Z.hints = hintsFor(lvl); Z.areas = areasFor(lvl);
      fill(0, 0, MW - 1, MH - 1, "."); fill(0, 0, MW - 1, 0, "~"); fill(MW - 1, 0, MW - 1, MH - 1, "~"); fill(0, MH - 1, MW - 1, MH - 1, "~"); fill(0, 1, 0, MH - 2, "T");
      fill(1, 1, 42, 32, "W");
      const flo = (x0, y0, x1, y1, ch) => { fill(x0, y0, x1, y1, ch); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) under[y][x] = ch; };
      const put = (x, y, ch) => { m[y][x] = ch; };
      flo(1, 33, 42, 34, "r");
      // magazzino
      flo(13, 14, 30, 21, "a"); flo(20, 22, 23, 22, "b"); flo(20, 23, 23, 31, "p"); put(21, 32, "E"); put(22, 32, "E");
      const crates = [[13, 14], [14, 14], [15, 14], [13, 15], [29, 14], [30, 14], [30, 15], [29, 21], [30, 21], [30, 20], [13, 21], [13, 20]];
      crates.slice(0, [12, 9, 6, 4, 3][lvl]).forEach(([x, y]) => put(x, y, "k"));
      [[14, 16], [15, 16], [16, 16]].forEach(([x, y]) => put(x, y, "y")); put(28, 16, "C");
      if (lvl >= 2) [[16, 20], [17, 20]].forEach(([x, y]) => put(x, y, "q"));
      if (lvl >= 3) [[26, 21], [27, 21]].forEach(([x, y]) => put(x, y, "q"));
      // spogliatoio
      if (lvl >= 1) {
        flo(2, 14, 11, 21, "a"); flo(12, 17, 12, 18, "a");
        for (let x = 2; x <= 11; x++) put(x, 14, x === 6 || x === 7 ? "l" : "v");
        [3, 4, 5, 8, 9, 10].forEach((x) => { put(x, 17, "q"); put(x, 20, "q"); }); put(6, 17, "Q"); put(7, 17, "Q");
      }
      // cortile
      if (lvl >= 2) {
        flo(2, 23, 41, 31, "p");
        put(5, 25, "u"); put(6, 25, "u"); put(14, 23, "g"); put(28, 23, "d"); put(34, 27, "F");
        [[2, 23], [41, 23], [2, 31], [41, 31], [12, 31], [30, 31], [17, 23]].forEach(([x, y]) => put(x, y, "Y"));
        [[9, 24], [10, 24], [31, 30], [32, 30], [4, 29], [5, 29], [26, 28], [27, 28]].forEach(([x, y]) => put(x, y, "q"));
      }
      // tribuna
      if (lvl >= 3) {
        flo(32, 14, 41, 21, "t"); flo(31, 17, 31, 18, "a");
        put(33, 14, "e"); put(34, 14, "z"); put(35, 14, "z"); put(36, 14, "z"); put(38, 14, "j"); put(40, 14, "f");
        [16, 19].forEach((y) => { [34, 35, 36, 38, 39, 40].forEach((x) => put(x, y, "q")); });
      }
      // casa delle 108 stelle
      if (lvl >= 4) {
        flo(19, 9, 24, 13, "c"); flo(2, 7, 41, 8, "b");
        flo(2, 2, 11, 5, "b"); flo(13, 2, 21, 5, "a"); flo(23, 2, 31, 5, "c"); flo(33, 2, 41, 5, ".");
        flo(2, 10, 9, 12, "b"); flo(11, 10, 17, 12, "a"); flo(26, 10, 33, 12, "a"); flo(35, 10, 41, 12, "b");
        [[6, 6], [7, 6], [16, 6], [17, 6], [26, 6], [27, 6], [36, 6], [37, 6]].forEach(([x, y]) => flo(x, y, x, y, "b"));
        [[5, 9], [6, 9], [13, 9], [14, 9], [29, 9], [30, 9], [37, 9], [38, 9]].forEach(([x, y]) => flo(x, y, x, y, "b"));
        // cucina
        [3, 4, 9, 10].forEach((x) => put(x, 2, "o")); [6, 7].forEach((x) => put(x, 3, "x"));
        // biblioteca
        for (let x = 13; x <= 21; x++) put(x, 2, "s"); [16, 17, 18].forEach((x) => put(x, 4, "x"));
        // musica
        put(24, 2, "i"); put(25, 2, "i"); put(31, 2, "x");
        // serra
        put(34, 2, "H"); put(40, 2, "H"); put(33, 2, "Y"); put(41, 2, "Y"); put(38, 3, "Y");
        // officina
        [3, 4, 5].forEach((x) => put(x, 12, "w")); put(9, 12, "k");
        // giochi
        put(13, 12, "u"); put(14, 12, "u"); put(17, 12, "q");
        // osservatorio
        put(32, 10, "n"); put(33, 10, "q"); put(26, 12, "q");
        // mare
        [36, 37, 38].forEach((x) => put(x, 12, "m")); put(41, 12, "q");
        // scalone
        put(19, 10, "A"); put(24, 10, "A"); put(19, 13, "Y"); put(24, 13, "Y");
      }
      refreshNpcs();
    };
    // area di una tile (per i pavimenti/atmosfere): colore di base per i mobili
    const FLOOR_AT = (tx, ty) => (under && under[ty] && under[ty][tx]) || "a";

    // ------------------------------------------------------------------ disegno
    function floorPaint(f, sx, sy, tx, ty) {
      if (f === "a") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#aa7e4f" : "#a47849"); P(sx, sy + 7, 16, 1, "#80582f"); P(sx, sy + 15, 16, 1, "#80582f"); P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#87603a"); P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 7, "#87603a"); }
      else if (f === "b") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#c9c3b4" : "#c0baab"); P(sx, sy + 15, 16, 1, "#a19b8c"); P(sx + 15, sy, 1, 16, "#a19b8c"); }
      else if (f === "c") { P(sx, sy, 16, 16, "#8b3a48"); P(sx, sy, 16, 1, "#a04b59"); P(sx, sy + 15, 16, 1, "#702d39"); if ((tx + ty) % 2 === 0) P(sx + 6, sy + 6, 4, 4, "#a14f5c"); }
      else if (f === "p") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8f887a" : "#958e80"); P(sx, sy + 7, 16, 1, "#6f695d"); P(sx + (ty % 2 ? 5 : 12), sy, 1, 7, "#6f695d"); P(sx + (ty % 2 ? 11 : 3), sy + 8, 1, 7, "#6f695d"); }
      else if (f === "t") { P(sx, sy, 16, 16, "#cfc7b4"); P(sx, sy + 15, 16, 1, "#a9a190"); P(sx, sy, 16, 1, "#e0d9c8"); if ((tx + ty) % 3 === 0) P(sx + 5, sy + 6, 3, 2, "#bfb7a3"); }
      else if (f === "r") { P(sx, sy, 16, 16, "#5b5d65"); if (tx % 3 === 0) P(sx + 3, sy + 7, 9, 1, "#c8c8b0"); }
      else { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#63b04e" : "#67b552"); if ((tx * 5 + ty * 7) % 9 === 0) { P(sx + 4, sy + 6, 2, 2, "#fff4c2"); P(sx + 11, sy + 10, 2, 2, "#c77dff"); } }
    }
    const at = (x, y) => (curMap && curMap[y] && curMap[y][x]) || "W";
    function wallPaint(sx, sy, tx, ty) {
      const below = at(tx, ty + 1), face = below !== "W" && below !== "#" && below !== "~" && below !== "X" && below !== "T";
      if (face) {
        P(sx, sy, 16, 16, "#d9ccae"); P(sx, sy, 16, 3, "#a99b80"); P(sx, sy + 13, 16, 3, "#76664e"); P(sx, sy + 12, 16, 1, "#b7a98c");
        if (tx % 4 === 1 && ty < 31) { P(sx + 3, sy + 4, 10, 7, "#5a4a36"); P(sx + 4, sy + 5, 8, 5, "#8fc6dc"); P(sx + 8, sy + 5, 1, 5, "#5a4a36"); P(sx + 4, sy + 5, 8, 1, "#c9ebf5"); }
        else if (tx % 7 === 3) { P(sx + 6, sy + 5, 4, 6, "#c8553d"); P(sx + 7, sy + 6, 2, 2, "#ffd23f"); }
      } else { P(sx, sy, 16, 16, "#8f8370"); P(sx, sy, 16, 2, "#a89c86"); P(sx + (tx % 2 ? 3 : 9), sy + 8, 4, 1, "#7a6f5e"); }
    }
    function desk(sx, sy, c1, c2) { P(sx, sy + 3, 16, 12, c1); P(sx, sy + 3, 16, 2, c2); P(sx + 1, sy + 15, 2, 1, "#00000044"); P(sx + 13, sy + 15, 2, 1, "#00000044"); }

    const PAINT = {
      v(sx, sy) { P(sx + 1, sy + 1, 14, 15, "#3d5a86"); P(sx + 1, sy + 1, 14, 2, "#5578a8"); P(sx + 8, sy + 3, 1, 12, "#2a4166"); P(sx + 3, sy + 5, 3, 1, "#1b2a45"); P(sx + 10, sy + 5, 3, 1, "#1b2a45"); P(sx + 6, sy + 9, 1, 2, "#e8d9a0"); P(sx + 10, sy + 9, 1, 2, "#e8d9a0"); },
      q(sx, sy) { P(sx, sy + 5, 16, 6, "#8a5a2e"); P(sx, sy + 5, 16, 2, "#b0794a"); P(sx + 1, sy + 11, 2, 4, "#5c3b1e"); P(sx + 13, sy + 11, 2, 4, "#5c3b1e"); },
      k(sx, sy) { P(sx + 1, sy + 3, 14, 13, "#9b7545"); P(sx + 1, sy + 3, 14, 2, "#c29a63"); P(sx + 1, sy + 9, 14, 1, "#6e5230"); P(sx + 7, sy + 3, 2, 13, "#6e5230"); P(sx + 3, sy + 6, 3, 1, "#3b2c18"); },
      C(sx, sy, tx, ty, fr) { P(sx + 2, sy + 4, 12, 11, "#6b4a2a"); P(sx + 2, sy + 4, 12, 3, "#8c6238"); P(sx + 7, sy + 8, 2, 3, "#ffd23f"); if (fr % 90 < 8) P(sx + 11, sy + 2, 2, 2, "#fff"); },
      g(sx, sy, tx, ty, fr) { P(sx + 2, sy + 8, 12, 8, "#b22a35"); P(sx + 2, sy + 8, 12, 2, "#d04650"); P(sx + 3, sy + 1, 10, 8, "#bfe3f0"); P(sx + 3, sy + 1, 10, 1, "#fff"); const cs = ["#ff9ec0", "#ffd23f", "#57d68d", "#3fa7ff", "#c77dff"]; for (let i = 0; i < 6; i++) P(sx + 4 + (i % 3) * 3, sy + 3 + Math.floor(i / 3) * 3, 3, 3, cs[(i + (fr >> 5)) % 5]); P(sx + 6, sy + 11, 4, 3, "#2a1a1a"); P(sx + 11, sy + 10, 2, 2, "#ffd23f"); },
      d(sx, sy, tx, ty, fr) { P(sx + 1, sy + 1, 14, 14, "#3a2f24"); P(sx + 2, sy + 2, 12, 11, "#e8c35a"); P(sx + 4, sy + 4, 8, 1, "#5a3a22"); P(sx + 4, sy + 7, 6, 1, "#5a3a22"); P(sx + 4, sy + 9, 7, 1, "#5a3a22"); if (fr % 80 < 10) P(sx + 11, sy + 3, 2, 2, "#fff"); },
      j(sx, sy) { P(sx + 1, sy + 1, 14, 15, "#4a3320"); P(sx + 2, sy + 2, 12, 11, "#e8dcc0"); P(sx + 4, sy + 4, 8, 1, "#8c7a5a"); P(sx + 4, sy + 6, 8, 1, "#8c7a5a"); P(sx + 4, sy + 8, 5, 1, "#8c7a5a"); P(sx + 10, sy + 9, 3, 3, "#ffd23f"); },
      f(sx, sy, tx, ty, fr) { P(sx + 1, sy + 1, 14, 15, "#4a3320"); P(sx + 2, sy + 2, 12, 11, "#9fcfe0"); P(sx + 5, sy + 5, 6, 5, "#ffd23f"); P(sx + 7, sy + 10, 2, 2, "#ffd23f"); P(sx + 5, sy + 12, 6, 1, "#8c6a1c"); P(sx + 4, sy + 5, 1, 3, "#ffd23f"); P(sx + 11, sy + 5, 1, 3, "#ffd23f"); if (fr % 100 < 10) P(sx + 10, sy + 3, 2, 2, "#fff"); },
      e(sx, sy) { desk(sx, sy, "#7a4f2a", "#a8764a"); P(sx + 2, sy + 4, 11, 7, "#f4f1e6"); P(sx + 3, sy + 5, 9, 1, "#2a2a2a"); P(sx + 3, sy + 7, 4, 3, "#bdb9a8"); P(sx + 8, sy + 7, 4, 1, "#7a766a"); P(sx + 8, sy + 9, 4, 1, "#7a766a"); },
      s(sx, sy, tx) { P(sx, sy + 1, 16, 15, "#5c3b1e"); P(sx, sy + 7, 16, 1, "#3c2512"); const cs = ["#b22a35", "#3476bd", "#e8c35a", "#2f9e55", "#c77dff", "#e98a6b"]; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) P(sx + 1 + i * 2.4, sy + 2 + r * 7, 2, 5, cs[(i + r * 2 + tx) % 6]); },
      o(sx, sy, tx, ty, fr) { P(sx, sy + 3, 16, 13, "#7d838c"); P(sx, sy + 3, 16, 3, "#b4bac4"); P(sx + 3, sy + 7, 10, 5, "#3a3d45"); P(sx + 4, sy + 6, 8, 2, "#5b606a"); if ((fr >> 3) % 2) P(sx + 6, sy + 3, 2, 2, "#e8e8e8"); P(sx + 5, sy + 13, 2, 2, "#ff9a3c"); P(sx + 10, sy + 13, 2, 2, "#ffd23f"); },
      x(sx, sy, tx) { P(sx, sy + 4, 16, 10, "#9a6a3a"); P(sx, sy + 4, 16, 2, "#c49060"); P(sx + 1, sy + 14, 2, 2, "#5c3b1e"); P(sx + 13, sy + 14, 2, 2, "#5c3b1e"); P(sx + 3, sy + 7, 4, 3, "#f2f2f2"); P(sx + 10, sy + 7, 4, 3, "#f2f2f2"); if (tx % 2) P(sx + 7, sy + 6, 2, 3, "#c8553d"); },
      w(sx, sy, tx) { P(sx, sy + 4, 16, 12, "#6c4a2a"); P(sx, sy + 4, 16, 3, "#a8764a"); if (tx % 3 === 0) { P(sx + 3, sy + 1, 2, 7, "#aab"); P(sx + 7, sy + 2, 5, 2, "#c8553d"); } else if (tx % 3 === 1) { P(sx + 4, sy + 2, 8, 3, "#555a66"); P(sx + 12, sy + 3, 2, 5, "#ffd23f"); } else { P(sx + 3, sy + 3, 3, 3, "#c8c8c8"); P(sx + 9, sy + 3, 3, 3, "#c8c8c8"); P(sx + 5, sy + 8, 6, 1, "#3c2512"); } },
      n(sx, sy) { P(sx + 7, sy + 8, 2, 8, "#5c3b1e"); P(sx + 3, sy + 14, 10, 2, "#5c3b1e"); g.save(); g.translate(sx + 8, sy + 8); g.rotate(-0.7); P(-9, -3, 18, 6, "#2f4a8a"); P(-9, -3, 4, 6, "#c8c8c8"); P(5, -2, 3, 4, "#ffd23f"); g.restore(); },
      m(sx, sy, tx, ty, fr) { P(sx, sy + 2, 16, 13, "#2a5f7c"); P(sx + 1, sy + 3, 14, 10, "#4fb6dc"); P(sx, sy + 2, 16, 1, "#c8d8e0"); const t = fr / 30 + tx; P(sx + 3 + Math.floor((Math.sin(t) + 1) * 4), sy + 6, 4, 2, "#ff8a3c"); P(sx + 8 + Math.floor((Math.cos(t * 0.8) + 1) * 2), sy + 9, 3, 2, "#ffd23f"); P(sx + 2, sy + 11, 12, 2, "#e8d9a0"); },
      F(sx, sy, tx, ty, fr) { g.fillStyle = "#6f695d"; g.beginPath(); g.arc(sx + 8, sy + 8, 8, 0, 7); g.fill(); g.fillStyle = "#3fa7ff"; g.beginPath(); g.arc(sx + 8, sy + 8, 6, 0, 7); g.fill(); P(sx + 7, sy + 3 + ((fr >> 3) % 2), 2, 4, "#e8f6ff"); P(sx + 5, sy + 8, 6, 1, "#9fd6ff"); },
      Y(sx, sy) { P(sx + 4, sy + 10, 8, 6, "#a8553d"); P(sx + 3, sy + 9, 10, 2, "#c46a4f"); g.fillStyle = "#2e7d3a"; g.beginPath(); g.arc(sx + 8, sy + 6, 6, 0, 7); g.fill(); g.fillStyle = "#4aa356"; g.beginPath(); g.arc(sx + 6, sy + 4, 3, 0, 7); g.fill(); P(sx + 10, sy + 5, 2, 2, "#ff9ec0"); },
      A(sx, sy) { P(sx + 2, sy + 2, 12, 13, "#5c3b1e"); P(sx + 3, sy + 3, 10, 10, "#c9a24a"); P(sx + 5, sy + 5, 6, 1, "#7a5a1a"); P(sx + 5, sy + 7, 6, 1, "#7a5a1a"); P(sx + 5, sy + 9, 4, 1, "#7a5a1a"); P(sx + 6, sy + 14, 4, 2, "#3c2512"); },
    };

    // chi disegna cosa: ritorna true se la tile è nostra
    Z.tile = function (ch, sx, sy, tx, ty) {
      if (FLOORS.includes(ch) && ch !== ".") { floorPaint(ch, sx, sy, tx, ty); return true; }
      if (ch === "W") { wallPaint(sx, sy, tx, ty); return true; }
      if (ch === "X") { P(sx, sy, 16, 16, "#6b5c4a"); return true; }
      const f = PAINT[ch];
      if (!f) return false;
      floorPaint(FLOOR_AT(tx, ty), sx, sy, tx, ty);
      const fr = Math.floor(performance.now() / 16);
      f(sx, sy, tx, ty, fr);
      return true;
    };
    // pezzi su più tile (biliardino, scrivania, lavagna, tabellone, piano, portone): guardano la tile accanto
    PAINT.u = function (sx, sy, tx, ty) { P(sx, sy + 3, 16, 12, "#2f6b3a"); P(sx, sy + 3, 16, 2, "#4f9559"); P(sx, sy + 13, 16, 2, "#5c3b1e"); for (let i = 0; i < 3; i++) { P(sx + 2 + i * 5, sy + 2, 1, 13, "#c8c8c8"); P(sx + 1 + i * 5, sy + 6 + (i % 2) * 3, 3, 3, (i + tx) % 2 ? "#c8102e" : "#3476bd"); } if (at(tx - 1, ty) !== "u") P(sx + 12, sy + 8, 2, 2, "#fff"); };
    PAINT.y = function (sx, sy, tx, ty) { desk(sx, sy, "#7a4f2a", "#a8764a"); if (at(tx - 1, ty) !== "y") { P(sx + 4, sy + 5, 8, 6, "#f2ecd8"); P(sx + 7, sy + 5, 1, 6, "#b9b095"); P(sx + 5, sy + 7, 2, 1, "#6b6350"); P(sx + 9, sy + 7, 2, 1, "#6b6350"); } if (at(tx + 1, ty) !== "y") { P(sx + 8, sy + 4, 1, 6, "#2a2a2a"); P(sx + 9, sy + 3, 3, 3, "#ffd23f"); } };
    PAINT.Q = function (sx, sy, tx, ty) { PAINT.q(sx, sy); if (at(tx - 1, ty) !== "Q") { P(sx + 7, sy + 1, 7, 4, "#f2f2f2"); P(sx + 8, sy + 2, 5, 1, "#c8102e"); } else { P(sx + 3, sy + 2, 5, 3, "#f2f2f2"); P(sx + 5, sy + 1, 3, 2, "#ffd23f"); } };
    PAINT.l = function (sx, sy, tx, ty) { const first = at(tx - 1, ty) !== "l"; P(sx, sy + 1, 16, 14, "#3a2f24"); P(sx + (first ? 1 : 0), sy + 2, first ? 15 : 15, 12, "#26402f"); if (first) { P(sx + 4, sy + 5, 2, 2, "#f2f2f2"); P(sx + 9, sy + 8, 2, 2, "#f2f2f2"); P(sx + 5, sy + 6, 5, 1, "#f2f2f2"); } else { P(sx + 3, sy + 4, 2, 2, "#ffd23f"); P(sx + 8, sy + 9, 3, 1, "#f2f2f2"); P(sx + 2, sy + 7, 9, 1, "#f2f2f288"); } };
    PAINT.z = function (sx, sy, tx, ty) { const f = at(tx - 1, ty) !== "z", l2 = at(tx + 1, ty) !== "z"; P(sx, sy + 1, 16, 13, "#20242c"); P(sx + (f ? 1 : 0), sy + 2, 16 - (f ? 1 : 0) - (l2 ? 1 : 0), 11, "#11151b"); if (!f && !l2) { P(sx + 3, sy + 4, 3, 6, "#e04b4b"); P(sx + 10, sy + 4, 3, 6, "#e04b4b"); P(sx + 7, sy + 6, 2, 1, "#e04b4b"); P(sx + 7, sy + 8, 2, 1, "#e04b4b"); } else if (f) { P(sx + 4, sy + 4, 8, 2, "#ffd23f"); P(sx + 4, sy + 8, 8, 2, "#9be2ff"); } else { P(sx + 3, sy + 4, 8, 2, "#ffd23f"); P(sx + 3, sy + 8, 8, 2, "#9be2ff"); } };
    PAINT.i = function (sx, sy, tx, ty) { const f = at(tx - 1, ty) !== "i"; P(sx, sy + 1, 16, 14, "#1d1d22"); P(sx, sy + 8, 16, 7, "#f4f1e6"); for (let k = 0; k < 4; k++) P(sx + 1 + k * 4, sy + 8, 1, 7, "#8a8a8a"); P(sx + (f ? 3 : 1), sy + 8, 2, 4, "#1d1d22"); P(sx + (f ? 7 : 5), sy + 8, 2, 4, "#1d1d22"); P(sx + (f ? 11 : 9), sy + 8, 2, 4, "#1d1d22"); };
    PAINT.E = function (sx, sy, tx, ty) { const left = at(tx - 1, ty) === "E"; P(sx, sy, 16, 16, "#76664e"); P(sx, sy + 1, 16, 15, "#6b4a2a"); P(sx, sy + 1, 16, 2, "#8c6238"); P(left ? sx + 14 : sx, sy + 3, 2, 13, "#4a3320"); P(left ? sx + 10 : sx + 3, sy + 9, 2, 3, "#ffd23f"); if (!left) { g.font = "bold 5px sans-serif"; } };

    // decorazioni sul pavimento / sulla parete (sotto i PNG)
    Z.decor = function (cx, cy) {
      const lvl = lvlNow, fr = performance.now() / 16;
      const on = (x, y) => x > -80 && x < 400 && y > -40 && y < 240;
      const label = (txt, tx0, tx1, ty) => { const x = ((tx0 + tx1 + 1) / 2) * TS - cx, y = ty * TS - cy; if (!on(x, y)) return; g.font = "bold 6px sans-serif"; const tw = g.measureText(txt).width + 6; P(x - tw / 2, y + 1, tw, 9, "#2a2218cc"); P(x - tw / 2, y + 1, tw, 1, "#c9a24a"); g.textAlign = "center"; g.fillStyle = "#fff5d0"; g.fillText(txt, x, y + 8); g.textAlign = "left"; };
      label("MAGAZZINO", 13, 30, 13); label("USCITA", 21, 22, 31.4);
      if (lvl >= 1) label("SPOGLIATOIO", 2, 11, 13);
      if (lvl >= 2) label("CORTILE", 2, 19, 22);
      if (lvl >= 3) label("TRIBUNA", 32, 41, 13);
      if (lvl >= 4) { label("CUCINA", 2, 11, 1); label("BIBLIOTECA", 13, 21, 1); label("MUSICA", 23, 31, 1); label("SERRA", 33, 41, 1); label("OFFICINA", 2, 9, 9); label("GIOCHI", 11, 17, 9); label("OSSERVATORIO", 26, 33, 9); label("MARE", 35, 41, 9); }
      // tappeto del magazzino col saluto
      const rx = 18 * TS - cx, ry = 17 * TS - cy + 2;
      if (on(rx, ry)) { P(rx, ry, 9 * TS, 3 * TS, "#7a2f3a"); P(rx + 2, ry + 2, 9 * TS - 4, 3 * TS - 4, "#a24a58"); g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#ffe9a8"; g.fillText(lvl >= 4 ? "TUTTI QUI" : "BENVENUTI", rx + 4.5 * TS, ry + 1.5 * TS + 3); g.textAlign = "left"; }
      // campetto a gessetto in cortile
      if (lvl >= 2) {
        const bx = 3 * TS - cx, by = 26 * TS - cy + 4;
        if (on(bx, by)) { g.strokeStyle = "#ffffff77"; g.lineWidth = 1; g.strokeRect(bx + 0.5, by + 0.5, 10 * TS - 1, 4 * TS - 6); g.beginPath(); g.moveTo(bx + 5 * TS + 0.5, by); g.lineTo(bx + 5 * TS + 0.5, by + 4 * TS - 6); g.stroke(); g.beginPath(); g.arc(bx + 5 * TS, by + 2 * TS - 3, 8, 0, 7); g.stroke(); }
        // lucine
        const ly = 22.9 * TS - cy;
        for (let i = 0; i < 38; i++) { const x = (2 + i) * TS - cx + 8; if (x < -4 || x > 324) continue; const yy = ly + Math.sin(i * 1.7) * 1.5; P(x, yy, 1, 1, "#00000055"); P(x - 1, yy + 1, 3, 3, ["#ffd23f", "#ff9ec0", "#9be2ff", "#57d68d"][(i + (fr / 40 | 0)) % 4]); }
      }
      // bandierine della Tribuna
      if (lvl >= 3) {
        for (let i = 0; i < 9; i++) { const x = (32 + i) * TS - cx + 8, y = 21.55 * TS - cy; if (x < -8 || x > 330) continue; P(x - 3, y, 7, 4, i % 2 ? "#9d3c48" : "#354f82"); }
      }
      // tappeti delle stanze di casa
      if (lvl >= 4) {
        [[24, 3, 6, 2, "#2d5f7a"], [4, 4, 6, 1, "#8a5a2a"], [14, 4, 7, 1, "#355f3a"], [11, 11, 6, 1, "#8a5a2a"]].forEach(([tx, ty, w, h, c]) => { const x = tx * TS - cx, y = ty * TS - cy + 4; if (on(x, y)) { P(x, y, w * TS, h * TS - 4, c); P(x + 2, y + 2, w * TS - 4, h * TS - 8, "#ffffff22"); } });
        const x = 20 * TS - cx, y = 10 * TS - cy; if (on(x, y)) { P(x, y, 4 * TS, 3 * TS, "#6a2530"); P(x + 3, y + 3, 4 * TS - 6, 3 * TS - 6, "#8b3a48"); }
      }
    };
    // facciate chiuse: assi inchiodati e un lucchetto, sopra tutto
    Z.top = function (cx, cy) {
      const fr = performance.now() / 16;
      (Z.bld || []).forEach((b) => {
        const x = b.x * TS - cx, y = b.y * TS - cy, w = b.w * TS, h = b.h * TS;
        if (x > 340 || y > 220 || x + w < -20 || y + h < -10) return;
        const mx = x + w / 2, my = y + h * 0.5 - 14;
        if (b.id === "casa_chiusa") { for (let i = 0; i < 4; i++) { const px2 = x + w * (0.12 + i * 0.25); P(px2, y + 22, 3, h - 30, "#7a5a36"); } }
        g.save(); g.translate(mx, my); g.rotate(0.35); P(-22, -2, 44, 5, "#8a6a3c"); P(-22, -2, 44, 1, "#b08a52"); g.restore();
        g.save(); g.translate(mx, my); g.rotate(-0.35); P(-22, -2, 44, 5, "#7a5a36"); P(-22, -2, 44, 1, "#a07c46"); g.restore();
        P(mx - 4, my - 3, 8, 7, "#c9a24a"); g.strokeStyle = "#c9a24a"; g.lineWidth = 1; g.strokeRect(mx - 2.5, my - 8.5, 5, 6);
        if (b.sign) {
          const sx = b.sign[0] * TS - cx, sy = b.sign[1] * TS - cy; g.font = "bold 7px sans-serif"; const w1 = Math.max(g.measureText(b.sign[2]).width, g.measureText(b.sign[3]).width) + 10;
          P(sx - w1 / 2, sy - 10, w1, 22, "#241c14ee"); P(sx - w1 / 2, sy - 10, w1, 1, "#c9a24a"); P(sx - w1 / 2, sy + 11, w1, 1, "#c9a24a"); g.textAlign = "center"; g.fillStyle = "#ffd23f"; g.fillText(b.sign[2], sx, sy); g.fillStyle = "#fff5d0"; g.fillText(b.sign[3], sx, sy + 9); g.textAlign = "left";
        }
      });
      void fr;
    };
    Z.drawItem = function (x, y, i) {
      const it = Z.items[i];
      if (curMap && curMap[it[1]] && !isFloor(curMap[it[1]][it[0]])) return; // la foto sta in una parte ancora chiusa: non si vede
      g.save(); g.translate(x, y); g.rotate(((i % 3) - 1) * 0.18);
      P(-4, -5, 9, 10, "#f5f2e8"); P(-3, -4, 7, 6, ["#6fa8d6", "#d6a56f", "#8fc47f", "#d68f9f"][i % 4]); P(-1, -2, 3, 3, "#f2d6b0"); P(-4, 5, 9, 1, "#00000022");
      g.restore();
    };

    // ------------------------------------------------------------------ dialoghi
    const ROOM_LINES = {
      hall: ["Si è seduto vicino alle casse del magazzino. Dice che portano fortuna, o almeno pazienza.", "Aspetta il suo turno per scrivere sul Registro. Il turno dura da un quarto d'ora."],
      spog: ["Ha lasciato le scarpe sotto la panca. Le ritrova sempre, ed è un piccolo miracolo quotidiano.", "Ripassa la lavagna con aria da stratega. La lavagna dice «pareggio»; lui ha letto «vittoria»."],
      cort: ["Si gode il sole del cortile, nel quarto d'ora in cui nessuno chiede niente a nessuno.", "Ha portato la sua sedia da casa. Nessuno ha il coraggio di dirgli che era di qualcun altro."],
      trib: ["Da quassù si vede il mare e si riconoscono tutti. Lui lo fa a voce alta, con nome e cognome.", "Siede in tribuna anche quando non c'è la partita. Dice che la partita non c'è mai quando c'è lui."],
      cucina: ["Gira un mestolo con la serietà di un direttore d'orchestra. La zuppa non ha mai suonato meglio.", "Assaggia, aggiunge sale, assaggia. Il ciclo va avanti dal mattino e nessuno si lamenta."],
      biblio: ["Sfoglia un libro lasciato aperto. Ogni tanto ride da solo, ed è un buon segno.", "Dice che in biblioteca si parla piano. Poi lo spiega per un'ora e mezza."],
      musica: ["Prova la stessa battuta da una settimana. Dice che manca la pausa; la pausa, per ora, arriva fuori tempo.", "Canticchia. Sottovoce, ma con convinzione."],
      serra: ["Parla alle piante in tono pratico. Le piante ascoltano: l'ha detto la più grande, che è anche la più educata.", "Annaffia con delicatezza una pianta e con decisione un'altra. Sono le uniche due persone che conosce davvero."],
      officina: ["Ha un cacciavite in tasca e una teoria in testa. La teoria è più difficile da avvitare.", "Aggiusta una cosa che non era rotta. Ora è rotta, ma «in modo migliore»."],
      giochi: ["Fa finta di non voler giocare. Si riconosce dall'occhio che segue il pallone.", "Ha un record di palleggi che nessuno ha visto, quindi vale la sua parola."],
      osserv: ["Guarda lontano con l'aria di chi sa dove guardare. A volte è vero.", "Scruta l'orizzonte. L'orizzonte, per ora, non ha niente da dichiarare."],
      mare: ["Ha ancora i capelli bagnati e nessuna intenzione di asciugarli. «Sono del mestiere», dice.", "Racconta il mare come lo racconta chi non ha mai perso un giorno di maree. Ha ragione lui."],
    };
    const roomOf = (id) => ROOMS[placed[id]] || ROOMS.hall;
    const nameOf = (id) => { const p = people().find((x) => x.id === id); return p ? p.name : CAST[id] ? CAST[id].name : id; };
    const go = (fn) => () => { try { fn(); } catch (e) { api.trSay([L("voce", "Qualcosa si è inceppato. Riprova tra un attimo.")], api.trResume); if (DEBUG) console.error(e); } };

    function personMenu(id) {
      safe(() => api.seeCard && api.seeCard(id)); // la carta (se esiste) si sblocca solo dopo l'incontro
      const m = mem(); const first = !m.talked[id]; m.talked[id] = 1; memSet(m);
      const rk = placed[id] || "hall", room = ROOMS[rk], name = nameOf(id);
      const lines = ROOM_LINES[rk] || ROOM_LINES.hall, blurb = lines[hash(id + today()) % lines.length];
      api.trAsk(id, `<span style="color:var(--dim)">${esc(room.name)}</span><br>${esc(blurb)}${first ? "<br><em>Il Registro ne prende nota.</em>" : ""}`, [
        { label: `Due parole con ${name}`, sub: "Una scena breve al Quartier Generale", cls: "hot", fn: go(() => hq.talkIn(id, api.trResume)) },
        { label: "Dov'è tutto il resto?", sub: "Pina sa dove stanno le persone", fn: go(() => pinaMenu()) },
      ]);
    }

    const PINA_CHAT = [
      "Il Registro ha una regola sola: chi entra, scrive. Gigi ha scritto «volo» e ha disegnato un gabbiano. Lo conto come firma.",
      "Ho provato a fare il giornale della Casa. Il primo titolo era «Tutti presenti». Il secondo: «Quasi tutti: manca Gigi».",
      "Una casa si riconosce dai nomi sulla porta e dalle tazze sbeccate. Qui abbiamo tutte e due.",
      "Quando hai riaperto il magazzino ho pensato: otto persone e una lampadina. Adesso guardati intorno: la lampadina fa il suo dovere.",
      "Le persone entrano, scrivono il nome, restano. Il difficile non è farle arrivare: è convincerle a lasciare qualche sedia agli altri.",
      "Sai qual è la cosa che mi commuove? Non i nomi in elenco. I nomi in elenco che ormai si salutano.",
    ];
    function levelLine() {
      const n = count(), lv = lvlNow, next = hq.levels[lv] || null;
      return `<b>${esc(LV_NAME[lv])}</b> · ${n}/${hq.total()} persone<br><span style="color:var(--dim)">${next ? `Prossima struttura: ${esc(next.name)} · ancora ${Math.max(0, next.need - n)} persone da incontrare o reclutare.` : "Tutte le stanze sono aperte. Il resto è ospitalità."}</span>`;
    }
    function pinaMenu() {
      const m = mem(), met = !!m.pina;
      m.pina = 1; memSet(m);
      const head = met ? "«Eccoti, Leo. Il Registro è aperto, la penna scrive e Gigi non ha ancora firmato oggi. Cosa ti serve?»" : "«Leo! Benvenuto alla Casa delle Stelle. Io tengo il Registro: chi entra, scrive. Se cerchi qualcuno, chiedi a me. Se cerchi guai, chiedi a Gigi.»";
      api.trAsk("pina", `${head}<br>${levelLine()}`, [
        { label: "Il Registro", sub: "L'elenco delle persone, le Stelle e due parole con ognuno", cls: "hot", fn: go(() => hq.page(api.trResume)) },
        { label: "Chi stai cercando?", sub: "Pina lo fa trovare nella sua stanza", fn: go(() => finder(0)) },
        { label: "Quattro chiacchiere", sub: "Titoli, ironie e qualche ricordo", fn: go(() => { const mm = mem(), n = mm.chat | 0; mm.chat = n + 1; memSet(mm); const lines = [L("pina", PINA_CHAT[n % PINA_CHAT.length])]; if (lvlNow >= 4 && n % 3 === 2) lines.push(L("leo", "Centootto. E mi sembra ancora che ne manchi uno.")); api.trSay(lines, pinaMenu); }) },
      ]);
    }
    function finder(page) {
      const list = people().filter((p) => p.id !== "pina").sort((a, b) => a.name.localeCompare(b.name, "it")), size = 5, max = Math.max(0, Math.ceil(list.length / size) - 1), p = Math.max(0, Math.min(page, max));
      const opts = list.slice(p * size, p * size + size).map((x) => {
        const rk = availRoom(homeRoom(x), lvlNow);
        return { label: x.name, sub: ROOMS[rk].name, fn: go(() => { pinned = x.id; refreshNpcs(); api.trResume(); api.trToast(`${x.name}: ${ROOMS[rk].name}`); }) };
      });
      if (p > 0) opts.unshift({ label: "◂ Precedenti", fn: go(() => finder(p - 1)) });
      if (p < max) opts.push({ label: "Altri ▸", sub: `${p + 1}/${max + 1}`, fn: go(() => finder(p + 1)) });
      if (!list.length) opts.push({ label: "Nessuno, per ora", sub: "Il Registro è ancora bianco", fn: go(pinaMenu) });
      api.trAsk("pina", "«Dimmi un nome e ti dico dove sta. Le persone cambiano stanza, a rotazione: io no, sono fissa.»", opts);
    }

    // ------------------------------------------------------------------ oggetti
    const FLAV = {
      k: ["Casse con scritto «FRAGILE», «ACCIUGHE» e, a matita, «non aprire senza Pina». Nessuno ha aperto. Pina sa.", "Una cassa porta ancora l'etichetta del primo trasloco: «Roba di Leo (non è roba)»."],
      v: ["Un armadietto con «Gigi» scritto a pennarello, poi cancellato, poi riscritto. Dentro: un pallone e un panino.", "Armadietto numero otto. Dentro un calzino spaiato e un biglietto: «Il compagno è in lavatrice»."],
      s: ["Gli scaffali sono pieni di libri con le dediche di gente che non conosceva nessuno. Adesso si conoscono tutti.", "Un libro si apre da solo su una pagina sottolineata a matita: «Una casa si fa anche con i ritorni». Niente firma."],
      o: ["La zuppa borbotta in una pentola da centotto porzioni. Assaggi dal mestolo: sa di casa e di un po' di pepe.", "Cartello sopra i fornelli: «Si assaggia solo con le mani pulite». Sotto, a pennarello: «e con un po' di fiducia»."],
      w: ["Sul banco: un cacciavite, un barattolo di viti spaiate e il disegno di una porta. La porta è già montata. Il disegno si è offeso."],
      i: ["Premi un tasto: il piano risponde con una nota stonata e, dalla stanza accanto, qualcuno dice «bravo» senza ironia. Succede solo qui."],
      n: ["Guardi nel telescopio. Vedi il Faro, tre gabbiani e un signore che ti saluta con il cappello. Ricambi: non si sa mai."],
      m: ["Nell'acquario nuota un pesce rosso che tutti chiamano «il Presidente». Nessuno sa perché. Lui, con dignità, non risponde."],
      F: ["La fontana del cortile fa un rumore tranquillo. Sul bordo, tre monetine e un biglietto: «Per i desideri piccoli»."],
      H: ["L'arnia ronza piano. Un cartellino: «Miele del Quartier Generale: sa di rosmarino e di tregua»."],
    };
    const pickOf = (arr, seed) => arr[hash(seed + today()) % arr.length];
    const resume = () => api.trResume();
    const say = (who, txt) => api.trSay([L(who, txt)], resume);

    function exitHouse() {
      const back = state.back, toBorgo = state.fromBorgo || typeof back !== "function";
      api.trExitTo(toBorgo ? null : back, true);
    }
    function modalAsk(who, html, label, sub, open) {
      api.trAsk(who, html, [{ label, sub, cls: "hot", fn: go(open) }]);
    }
    function trofei() {
      const out = [], mo = window.__moloSettimana, cage = window.__cageHd;
      const mi = mo && safe(() => mo.info(), null), ci = cage && safe(() => cage.info(), null);
      out.push(`Stelle del Borgo reclutate: <b>${safe(() => hq.starsRec(), 0)}</b>`);
      out.push(`Persone in Casa: <b>${count()}/${hq.total()}</b>`);
      if (mi) out.push(`Coppe del Molo in bacheca: <b>${mi.cups | 0}</b> · spille: <b>${mi.pins | 0}</b>`);
      if (ci) out.push(`Gabbia del Molo: titoli <b>${ci.titles | 0}</b> · coppe <b>${ci.cups | 0}</b> · boss <b>${ci.bosses | 0}/3</b>`);
      out.push(`Strutture aperte: <b>${lvlNow}/4</b>`);
      api.trAsk("pina", `«La bacheca dei trofei. Quello che non vedi qui è nella vetrina di qualcun altro, o nel cuore di Gigi.»<br><span style="color:var(--dim)">${out.join("<br>")}</span>`, []);
    }
    function barattolo() {
      const m = mem(), n = 2 + lvlNow;
      if (m.day.jar === today()) return api.trSay([L("voce", "Il barattolo delle monete della Casa è già stato svuotato oggi. Sul coperchio, a pennarello: «Domani. Non insistere.»")], resume);
      m.day.jar = today(); const got = coins(n); memSet(m);
      api.trSay([L("voce", pickOf(["Il barattolo delle monete del Quartier Generale: dentro, qualche moneta, un bottone e un bigliettino di Settimio «per i lavori».", "Tra le monete del barattolo trovi un'etichetta: «Offerta libera. Anche libera di non esserci»."], "jar")), L("voce", `Ne ricavi <em>+${got} monete</em>. Una volta al giorno: il barattolo si ricarica da solo, con la fiducia di tutti.`)], resume);
    }
    function lavagna() {
      api.trAsk("ruggeri", "«La lavagna è mia, ma i nomi li scrivete voi. Chi gioca davanti, chi dietro, chi porta le arance a metà tempo. Cosa vuoi aggiustare?»", [
        { label: "Squadra e compagni", sub: "Chi gioca, come, con chi", cls: "hot", fn: go(() => hq.squadra(resume)) },
        { label: "Lo spogliatoio vero", sub: "Il morale e due parole con chi ne ha voglia", fn: go(() => hq.spMenu(resume)) },
      ]);
    }
    function sfida() {
      api.trAsk("ruggeri", "«La lavagna del giorno: una sfida uguale per tutti, cambia a mezzanotte. Per giocarla si esce dalla Casa: poi basta rientrare dal portone.»", [
        { label: "Vai alla Sfida del giorno", sub: "Ti porta alla schermata della sfida", cls: "hot", fn: go(() => api.trExitTo(() => hq.daily(), true)) },
      ]);
    }
    const OBJ = {
      E: () => api.trAsk("voce", "Il portone del Quartier Generale. Fuori, il Borgo; dentro, tutti gli altri.", [{ label: "Esci in strada", sub: "Si rientra dal portone, quando vuoi", cls: "hot", fn: go(exitHouse) }]),
      l: lavagna, Q: lavagna,
      u: () => modalAsk("voce", "Il biliardino del Quartier Generale: omini di legno, un pallone di plastica e regole che cambiano a seconda di chi perde.", "Gioca a biliardino", "La sfida del Bar, in due contro il tavolo", () => { if (window.openBiliardino) window.openBiliardino(0, resume); else api.trSay([L("voce", "Il biliardino è fuori servizio. Gli omini sono in pausa sindacale.")], resume); }),
      g: () => modalAsk("voce", "Il distributore dei Pupazzetti della Costa. Qualcuno l'ha messo qui accanto alla fontana «per equilibrio», dice Tonino.", "Apri il distributore", "Gashapon 3D: i pupazzetti della Costa", () => { if (window.openGachaModal) window.openGachaModal(); else api.trSay([L("voce", "Il distributore è vuoto. Dentro, solo un biglietto: «Torno subito».")], resume); }),
      d: sfida,
      z: () => { const mo = window.__moloSettimana; if (mo && mo.open) mo.open({ onExit: resume }); else say("voce", "Il tabellone è spento. Sotto la lavagnetta, a gesso: «Torniamo la prossima settimana»."); },
      j: () => { const mo = window.__moloSettimana; if (mo && mo.open) mo.open({ view: "albo", onExit: resume }); else say("voce", "L'albo d'oro: una pagina bianca, una penna e molta fiducia nel futuro."); },
      f: trofei,
      e: () => { const d = window.__diarioScoperte; if (d && d.open) d.open({ onExit: resume, borgo: true }); else say("voce", "Una pila di Corriere di Pina, ancora caldi di inchiostro. Il titolo di oggi: «Tutto sotto controllo (forse)»."); },
      y: () => pinaMenu(),
      C: barattolo,
      A: () => { const n = count(); say("voce", `Targa di ottone: «Casa delle 108 Stelle». Sotto, scritto a mano: <i>${n}/${hq.total()} persone</i>. E più sotto, più piccolo: «Chi manca ha comunque un posto.»`); },
    };
    Object.keys(FLAV).forEach((ch) => { OBJ[ch] = () => say("voce", pickOf(FLAV[ch], ch)); });
    Z.onObj = function (ch) { const f = OBJ[ch]; if (!f) return false; go(f)(); return true; };

    // menu del Menu (tasto Menu / Esc)
    Z.menu = function () {
      api.trAsk("voce", `${levelLine()}<br><span style="color:var(--dim)">Monete: ${safe(() => window.bCoins(), 0)}</span>`, [
        { label: "Il Registro", sub: "Le persone e le Stelle", fn: go(() => hq.page(api.trResume)) },
        { label: "Esci dalla Casa delle Stelle", sub: "Si rientra dal portone", cls: "hot", fn: go(exitHouse) },
      ]);
    };

    // ------------------------------------------------------------------ hook (solo i propri id; mai il getter dentro la funzione)
    const mine = (id) => api.trZone() === ID && (id === "pina" || !!placed[id]);
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set); // con accessor (cage-borgo.js) la catena la fa il setter
    const prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      if (mine(id)) { if (id === "pina") pinaMenu(); else personMenu(id); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
    const prevNews = window.trNewsHook;
    window.trNewsHook = function (id) {
      if (api.trZone() === ID) {
        if (id === "pina") { const m = mem(); return !m.pina; }
        if (placed[id]) return !mem().talked[id];
      }
      return typeof prevNews === "function" ? prevNews(id) : null;
    };

    // ------------------------------------------------------------------ ingresso
    const LV_NEWS = [
      ["pina", "Edizione straordinaria: dietro il magazzino si è aperto lo Spogliatoio. Armadietti, panche e una lavagna tattica. Da lì si arriva alla Squadra e a tutto il resto."],
      ["tommy", "Il cortile è aperto! C'è il biliardino, il distributore dei pupazzetti e la lavagna della sfida del giorno. Sulla fontana nessuno è d'accordo, ma intanto ci si siede."],
      ["gigi", "La Tribuna! Si vede il tabellone della Settimana del Molo, l'albo d'oro, il Diario del Corriere e il mare, che non tifa per nessuno. Io tifo per il tetto."],
      ["papa", "Ci siamo, Leo. Cucina, biblioteca, sala della musica, serra, officina, sala giochi, osservatorio e la stanza del mare. Ognuno ha trovato il suo posto. Fate il giro."],
    ];
    const LV_AFTER = [null, null, null, ["leo", "Una volta era un magazzino dietro il campo, con le casse e la polvere. Adesso ha un posto per ognuno. Non lo dico a nessuno, ma sono un po' emozionato."]];
    const REW = [10, 15, 20, 30];
    function enter(o) {
      o = o || {}; state = { back: o.back || null, fromBorgo: o.fromBorgo !== false && !!o.fromBorgo };
      pinned = null;
      const m = mem(), n = count(), lvl = level(), prevLv = m.lv | 0, lines = [], tr = api.trRec();
      const cos = safe(() => hq.cosUnlock(n), []) || [];
      m.visit = (m.visit | 0) + 1; visitSeed = `${today()}#${m.visit}`;
      if (!m.met) { m.met = 1; lines.push(["voce", "Il portone del vecchio magazzino cigola, poi si arrende. Dentro: casse, polvere e un Registro vuoto con la penna legata a una cordicella."], ["pina", "Leo! Qui si scrive il nome di chi arriva. Più nomi ci sono, più stanze si aprono. E se qualcuno ti dice che è «solo un magazzino», digli che anche il Borgo era «solo un Borgo»."]); }
      for (let l = prevLv + 1; l <= lvl; l++) {
        lines.push(LV_NEWS[l - 1]); if (LV_AFTER[l - 1]) lines.push(LV_AFTER[l - 1]);
        if (!m.rew[l]) { m.rew[l] = 1; const got = coins(REW[l - 1]); if (got) lines.push(["voce", `Dalla cassa comune: <em>+${got} monete</em>.`]); }
      }
      if (cos.length) lines.push(["voce", `Nuovo in guardaroba: ${cos.map(esc).join(", ")}.`]);
      m.lv = Math.max(prevLv, lvl); memSet(m);
      Z.intro = lines.length ? lines : [["voce", "La Casa delle Stelle."]];
      if (tr.seen && lines.length) delete tr.seen[ID];
      if (tr.pos) delete tr.pos[ID];
      api.trGo(ID);
    }

    window.__casaStelle = {
      version: 1, enter,
      info: () => ({ level: level(), people: count(), placed: Object.keys(placed).length }),
    };
    if (DEBUG) window.__casaStelle._dbg = { ROOMS, Z, homeRoom, availRoom, choose, mem, memSet, KEY, level, people, get placed() { return placed; }, get map() { return curMap; }, refreshNpcs, pinaMenu, personMenu, OBJ, exitHouse, pin: (id) => { pinned = id; refreshNpcs(); } };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
