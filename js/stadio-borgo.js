// js/stadio-borgo.js - Lo Stadio del Borgo: il vecchio stadio in rovina, da ricostruire a tappe e da percorrere a piedi
// Una zona del Borgo camminabile (TRZ.stadio_borgo) che CAMBIA in 5 tappe: 0 rovina · 1 spalti · 2 prato e tribuna · 3 torri faro · 4 inaugurazione.
// Ingresso: il varco nel muro del vecchio stadio sulla strada della costa (edificio "stadio" in BLD di game.js) oppure la voce nel menu del Borgo.
// Ogni tappa si paga con monete e/o col "Fondo del Molo" (settimane d'oro della Settimana del Molo + stagioni vinte in Carriera, Gabbia,
// Coppa del Molo e Matchday Director). Capocantiere Fiorenzo Calcina, il custode Settimio e i PNG di contorno compaiono tappa dopo tappa.
// Dallo stadio inaugurato il tabellone lancia le finali di Gabbia, Coppa del Molo e Matchday Director (regole delle modalità invariate).
// Bonus: SOLO economia (piccolo incasso giornaliero del botteghino) e cosmetici (bandiere dello stadio, figurine, maglie/capelli del guardaroba).
// Mai statistiche, mai niente che tocchi le partite di storia o di Carriera.
// Va incluso DOPO game.js (e dopo quartier-generale.js / settimana-molo.js / cage-borgo.js: i moduli si leggono al volo, nessun ordine obbligatorio).
// Salvataggio proprio: ali-di-rondine.stadio-borgo (non tocca nessun altro salvataggio; legge soltanto, in sola lettura, quelli delle modalità).
(function () {
  "use strict";
  if (window.__stadioBorgoLoaded) return;
  window.__stadioBorgoLoaded = true;
  const DEBUG = /[?&]debug\b/.test(location.search || "");
  const ID = "stadio_borgo", KEY = "ali-di-rondine.stadio-borgo", MW = 44, MH = 36, TS = 16;
  const COST = [0, 40, 90, 160, 250];           // monete per arrivare alla tappa 1..4
  const GOLD_CR = 70, SEAS_CR = 45;             // credito del Fondo: per settimana d'oro / per stagione vinta
  const STG = [
    { n: "Rovina", s: "Erbacce e cancelli chiusi" },
    { n: "Spalti", s: "I gradoni tornano a vedersi" },
    { n: "Prato e tribuna", s: "Erba tagliata e posti a sedere" },
    { n: "Torri faro", s: "Luci per le sere di partita" },
    { n: "Inaugurazione", s: "Coro, bandiere e finali" },
  ];
  const FLAGS = [
    ["borgo", "Bandiera del Borgo", "#1e5aa8", "#f2f2f2"], ["rondine", "Bandiera della Rondine", "#c8102e", "#ffd23f"],
    ["molo", "Bandiera del Molo", "#0e7490", "#fde68a"], ["faro", "Bandiera del Faro", "#f2f2f2", "#c8102e"], ["gabbia", "Bandiera della Gabbia", "#374151", "#fbbf24"],
  ];
  const FLAG_PRICE = 10;
  const STK = ["Il mulo Ottavio", "Il cuscino del tredici", "Le forbici di Settimio", "La cassetta del '51", "La torre più alta", "Il nastro storto", "Il gabbiano in porta", "Il metro da novantotto"];
  const INCASSO = [0, 0, 2, 4, 6];              // monete al giorno dal botteghino, per tappa
  const ITEMS = [[41, 31, 0], [2, 32, 0], [3, 3, 1], [40, 17, 1], [21, 16, 1]]; // biglietti d'epoca: x, y, tappa minima
  const TOWERS = [[5, 8], [38, 8], [5, 24], [38, 24]];
  let tries = 0;

  // ------------------------------------------------------------------ memoria propria (leggibile anche senza il Borgo: serve a drawBorgo)
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  function mem() {
    let o = {};
    try { o = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { o = {}; }
    o = obj(o);
    o.v = 1; o.stage = Math.max(0, Math.min(4, o.stage | 0)); o.used = Math.max(0, o.used | 0); o.visit = o.visit | 0;
    ["scene", "gold", "day", "talked", "chat", "finals", "cos"].forEach((k) => { o[k] = obj(o[k]); });
    o.flags = arr(o.flags).filter((x) => typeof x === "string"); o.stk = arr(o.stk).filter((x) => (x | 0) === x && x >= 0 && x < STK.length);
    return o;
  }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignora */ } }
  const stageNow = () => mem().stage;

  // ------------------------------------------------------------------ ingresso sulla strada del Borgo (disegnato da game.js tramite BLD "stadio")
  function drawBorgo(g, x, y, w, h, night, frame) {
    const st = stageNow(), P = (a, b, c, d, col) => { g.fillStyle = col; g.fillRect(a, b, c, d); };
    const cx = x + w / 2;
    P(x, y, w, h, "#8e8a83");
    for (let i = 0; i < w; i += 8) P(x + i, y + 6 + ((i / 8) % 2) * 4, 5, 2, "#76726b");
    // pilastri del varco
    P(x - 1, y - 7, 6, 23, "#b9b3a6"); P(x - 1, y - 7, 6, 2, "#d9d3c6"); P(x + w - 5, y - 7, 6, 23, "#b9b3a6"); P(x + w - 5, y - 7, 6, 2, "#d9d3c6");
    // cartello sopra il varco
    const col = st >= 4 ? "#1f4e9c" : st >= 2 ? "#3d5f8c" : "#5a5f66";
    P(cx - 20, y - 12, 40, 10, col); P(cx - 20, y - 12, 40, 1, "#ffffff55");
    g.font = "bold 6px sans-serif"; g.textAlign = "center"; g.fillStyle = st === 0 ? "#cfc9bb" : "#fff";
    g.fillText(st === 0 ? "STADIO · CHIUSO" : "STADIO DEL BORGO", cx, y - 5); g.textAlign = "left";
    if (st === 0) { // catena e cartello storto
      P(cx - 7, y + 4, 14, 1, "#3a3a3a"); for (let i = 0; i < 4; i++) P(cx - 7 + i * 4, y + 3, 2, 3, "#555");
    }
    if (st === 1 || st === 2) { P(x + 6, y - 20, 1, 14, "#8a6a3c"); P(x + 6, y - 20, 10, 1, "#8a6a3c"); P(x + 12, y - 20, 1, 6, "#c8553d"); }
    if (st >= 3) { // torri faro sui pilastri
      [x + 2, x + w - 2].forEach((lx) => { P(lx - 1, y - 16, 3, 9, "#7d8794"); P(lx - 3, y - 19, 7, 3, "#2a2f38"); P(lx - 2, y - 18, 5, 1, night ? "#fff7c8" : "#e8e4d0"); });
      if (night) { g.save(); g.globalCompositeOperation = "lighter"; [x + 2, x + w - 2].forEach((lx) => { const gr = g.createRadialGradient(lx, y - 14, 1, lx, y - 14, 26); gr.addColorStop(0, "rgba(255,240,170,.5)"); gr.addColorStop(1, "rgba(255,240,170,0)"); g.fillStyle = gr; g.fillRect(lx - 26, y - 40, 52, 52); }); g.restore(); }
    }
    if (st >= 4) { const sw = Math.sin(frame / 14) * 1.2; [x + 2, x + w - 2].forEach((fx, i) => { P(fx, y - 22, 1, 6, "#624b3c"); P(fx + 1, y - 22, 7 + sw, 3, i ? "#ffd23f" : "#c8102e"); P(fx + 1, y - 19, 7 - sw, 3, i ? "#c8102e" : "#ffd23f"); }); }
  }
  window.__stadioBorgo = { version: 1, stage: stageNow, drawBorgo, enter: null, info: () => ({ stage: stageNow() }) };

  function init() {
    const api = window.__borgoApi;
    if (!api || !api.TRZ || !api.trGo) { if (++tries < 200) setTimeout(init, 150); return; }
    start(api);
  }

  function start(api) {
    const TRZ = api.TRZ, CAST = api.CAST, L = api.L;
    const cv2 = document.getElementById("cv"), g = cv2 && cv2.getContext("2d");
    const P = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const today = () => api.todayKey();
    const bal = () => safe(() => window.bCoins(), 0);
    const give = (n) => { if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); return n; } catch (e) { return 0; } } return 0; };
    // spesa verificata: true solo se il saldo è davvero sceso
    const spend = (n) => { const before = bal(); if (n <= 0 || before < n || typeof window.addCoins !== "function") return false; try { window.addCoins(-n); } catch (e) { return false; } return bal() === before - n; };
    const SB = (who, t) => L(who, t, "stadium");

    // ------------------------------------------------------------------ personaggi
    const base = (o) => Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, o);
    CAST.sb_capo = CAST.sb_capo || base({ name: "Fiorenzo Calcina", tag: "gray", hair: "#b8b8b8", style: "buzz", skin: "#d49a68", bg: ["#f2c94c", "#6b7280"], beard: true, cap: "#f2c94c", shirt: "#e08a1e" });
    CAST.sb_custode = CAST.sb_custode || Object.assign({}, CAST.settimio || base({ name: "Settimio", hair: "#f1f1f1", style: "buzz", shirt: "#556b2f" }), { name: "Settimio" });
    CAST.sb_mimmo = CAST.sb_mimmo || base({ name: "Mimmo", tag: "blue", hair: "#3a2a1a", style: "messy", skin: "#f2c9a0", bg: ["#c8102e", "#ffd23f"], shirt: "#c8102e" });
    CAST.sb_delfina = CAST.sb_delfina || Object.assign({}, CAST.nonna || base({ hair: "#f1f1f1", style: "bun", skin: "#f0c9a8" }), { name: "Delfina del Tredici", shirt: "#1e5aa8", bg: ["#1e5aa8", "#e0f2fe"] });
    CAST.sb_gennaro = CAST.sb_gennaro || base({ name: "Gennaro Noccioline", tag: "blue", hair: "#2b1d14", style: "messy", skin: "#e2a574", bg: ["#d97706", "#fde68a"], cap: "#ffffff", shirt: "#d97706" });
    CAST.sb_speaker = CAST.sb_speaker || base({ name: "Ermete Megafono", tag: "gold", hair: "#4a2c2a", style: "slick", skin: "#eec39c", bg: ["#7c3aed", "#fde68a"], glasses: true, shirt: "#7c3aed" });
    CAST.sb_coro = CAST.sb_coro || base({ name: "Bepi Diapason", tag: "blue", hair: "#9a9a9a", style: "buzz", skin: "#d9a57a", bg: ["#16325c", "#ffe7a0"], beard: true, shirt: "#16325c" });

    // cosmetici del guardaroba (solo colori; nessun effetto in partita)
    if (api.COSM) Object.assign(api.COSM, {
      sb_cantiere: { kind: "shirt", label: "Maglia giallo cantiere", val: "#f2c94c", from: "Porta lo Stadio del Borgo alla tappa Prato e tribuna" },
      sb_stadio: { kind: "shirt", label: "Maglia dell'inaugurazione", val: "#1f4e9c", from: "Inaugura lo Stadio del Borgo" },
      sb_biglietti: { kind: "hairc", label: "Capelli Biglietto d'epoca", val: "#d8c79a", from: "Raccogli i biglietti d'epoca dello Stadio del Borgo" },
      sb_album: { kind: "hairc", label: "Capelli Oro album", val: "#e9b949", from: "Completa l'album delle figurine dello Stadio" },
    });
    const cosGive = (id) => safe(() => (api.bCos && api.COSM && api.COSM[id] && api.bCos(id) ? api.COSM[id].label : null), null);

    // ------------------------------------------------------------------ Fondo del Molo: settimane d'oro + stagioni vinte (sola lettura)
    function goldWeeks(m) {
      safe(() => {
        const o = JSON.parse(localStorage.getItem("ali-di-rondine.settimana-molo") || "{}"), wk = obj(obj(o).weeks);
        Object.keys(wk).forEach((k) => {
          const r = obj(wk[k]), pts = obj(r.pts); let t = 0;
          ["cage", "action", "director"].forEach((md) => { let s = 0; const p = obj(pts[md]); Object.keys(p).forEach((x) => { s += p[x] | 0; }); t += Math.min(20, s); });
          if (t >= 40) m.gold[k] = 1;
        });
      });
      safe(() => { const mo = window.__moloSettimana, i = mo && mo.info && mo.info(); if (i && i.tier >= 3 && i.wk) m.gold[i.wk] = 1; });
      return Math.min(8, Object.keys(m.gold).length);
    }
    function seasonsWon() {
      const cap = (n) => Math.max(0, Math.min(6, n | 0)), out = { carriera: 0, gabbia: 0, coppa: 0, director: 0 };
      out.carriera = cap(safe(() => JSON.parse(localStorage.getItem("ali-di-rondine.carriera.record") || "{}").titles, 0));
      out.gabbia = cap(safe(() => window.__cageHd.info().titles, 0));
      out.coppa = cap(safe(() => window.__actionHd.state().titles, 0));
      out.director = cap(safe(() => window.__directorHd.state().seasonsDone, 0));
      out.tot = out.carriera + out.gabbia + out.coppa + out.director;
      return out;
    }
    function fund() {
      const m = mem(), gw = goldWeeks(m), sw = seasonsWon();
      memSet(m);
      const credit = gw * GOLD_CR + sw.tot * SEAS_CR;
      return { gold: gw, seasons: sw, credit, used: m.used, avail: Math.max(0, credit - m.used) };
    }

    // ------------------------------------------------------------------ stato della zona
    let ST = 0, cur = null, under = null, state = { fromBorgo: true };
    const Z = TRZ[ID] = {
      name: "Stadio del Borgo", short: "Stadio del Borgo", sub: "Il vecchio stadio che si ricostruisce a tappe", need: 0, w: MW, h: MH, start: [21, 31], theme: "genova", bus: "a piedi", busLabel: "Esci dallo Stadio",
      item: ["Biglietto d'epoca", "Biglietti"], itemCos: api.COSM ? "sb_biglietti" : "arancio",
      items: ITEMS.map((a) => [a[0], a[1]]),
      bld: [], npcs: [], areas: [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: "XfKbkiwvxjlqFzE",
      tail: "Per uscire: il cancello in fondo al piazzale, o il Menu.",
      act: { E: "Esci", K: "Guarda il cancello", b: "Guarda", k: "Guarda", i: "Bacheca dei lavori", w: "Guarda", v: "Bancarella", x: "Botteghino", j: "Leggi la targa", l: "Guarda il basamento", q: "Guarda i seggiolini", F: "Guarda la torre", z: "Tabellone" },
      intro: [["voce", "Il Comunale del Borgo."]],
    };

    const baseCh = (x, y) => (y >= 26 ? "p" : y <= 7 ? "t" : x <= 5 || x >= 38 ? "t" : x >= 8 && x <= 35 && y >= 10 && y <= 20 ? "u" : "a");
    const FLOORS = "ptau";
    const isFloor = (c) => !!c && FLOORS.includes(c);

    Z.build = function (m, fill) {
      cur = m; ST = stageNow(); under = Array.from({ length: MH }, (_, y) => Array.from({ length: MW }, (_, x) => baseCh(x, y)));
      const put = (x, y, ch) => { if (m[y] && x >= 0 && x < MW) m[y][x] = ch; };
      fill(0, 0, MW - 1, MH - 1, "X");
      fill(1, 1, 42, 25, "f");                                   // muro d'anello
      fill(2, 2, 41, 7, "t"); fill(2, 8, 5, 24, "t"); fill(38, 8, 41, 24, "t");   // tribuna nord e curve
      fill(6, 8, 37, 9, "a"); fill(6, 21, 37, 24, "a"); fill(6, 10, 7, 20, "a"); fill(36, 10, 37, 20, "a"); // pista
      fill(8, 10, 35, 20, "u");                                  // prato
      fill(2, 26, 41, 32, "p"); fill(1, 26, 1, 33, "f"); fill(42, 26, 42, 33, "f"); fill(1, 33, 42, 33, "f");
      put(21, 33, "E"); put(22, 33, "E");
      if (ST === 0) { put(21, 25, "K"); put(22, 25, "K"); } else { put(21, 25, "p"); put(22, 25, "p"); }
      // cantiere (sempre), finché serve
      put(9, 27, "i"); put(10, 27, "i");
      if (ST < 4) { put(3, 27, "b"); put(4, 27, "b"); [[2, 31], [3, 31], [13, 30], [13, 31]].forEach(([x, y]) => put(x, y, "k")); }
      if (ST < 2) [[2, 26], [15, 26], [33, 26], [41, 26]].forEach(([x, y]) => put(x, y, "w"));
      // torri faro (rotte finché non arriva la tappa 3)
      TOWERS.forEach(([x, y]) => put(x, y, "F"));
      // tabellone sul muro sud, dentro
      [14, 15, 16, 17].forEach((x) => put(x, 24, "z"));
      if (ST >= 2) {
        for (let x = 12; x <= 31; x++) if (x !== 16 && x !== 27) { put(x, 4, "q"); put(x, 6, "q"); }
        put(21, 8, "l");
        put(27, 26, "x"); put(28, 26, "x");
        put(34, 28, "v"); put(35, 28, "v");
      }
      if (ST >= 4) { put(25, 26, "j"); }
      refreshNpcs();
    };

    function npcSpots() {
      const out = [];
      out.push({ id: "sb_capo", at: ST >= 4 ? [24, 28] : [8, 29] });
      out.push({ id: "sb_custode", at: ST === 0 ? [19, 27] : ST === 1 ? [24, 22] : [14, 5] });
      if (ST >= 1) out.push({ id: "sb_mimmo", at: ST >= 4 ? [40, 20] : [3, 15] });
      if (ST >= 2) { out.push({ id: "sb_delfina", at: [13, 5] }); out.push({ id: "sb_gennaro", at: [34, 29] }); }
      if (ST >= 4) { out.push({ id: "sb_speaker", at: [24, 23] }); out.push({ id: "sb_coro", at: [39, 12] }); }
      return out;
    }
    function refreshNpcs() { Z.npcs = npcSpots(); }

    function areasFor() {
      return [
        [2, 27, 14, 32, "Il cantiere"], [0, 26, 43, 35, "Il piazzale"],
        [2, 2, 41, 7, "La tribuna"], [2, 8, 5, 24, "La curva ovest"], [38, 8, 41, 24, "La curva est"],
        [8, 10, 35, 20, "Il prato"], [0, 0, 43, 25, "Bordo campo"],
      ];
    }
    function hintsFor() {
      const s = ST;
      return {
        "Il cantiere": s === 0 ? "Una betoniera, sacchi di cemento e una bacheca coi lavori. Il capocantiere ha il metro di suo padre e molta fiducia." : s < 4 ? "Il cantiere lavora ancora: sacchi, betoniera e la bacheca dei lavori." : "Il cantiere ha chiuso. Restano la bacheca e una pila di sacchi, per affetto.",
        "Il piazzale": s === 0 ? "Un piazzale con l'erba tra le pietre e un cancello incatenato. Ma l'aria è già quella di una partita." : s < 2 ? "Il piazzale è pulito. Dietro il cancello, i gradoni." : s < 4 ? "Un botteghino, una bancarella e il cancello aperto." : "Bandierine, targa e il cancello spalancato. Sembra una festa di paese, e lo è.",
        "La tribuna": s === 1 ? "Gradoni di cemento nudo, con i ferri che spuntano. Da qui si vede tutto, soprattutto quanto manca." : s === 0 ? "Sotto le erbacce si indovinano dei gradini." : "La tribuna centrale: seggiolini blu e rossi, posti numerati. Il tredici e il quattordici sono presi.",
        "La curva ovest": "Gradoni in curva. Da qui il campo sembra più grande e il mare più vicino.",
        "La curva est": s >= 4 ? "La curva del coro. Qualcuno ha scritto «non siamo bravi, siamo in tanti»." : "Gradoni in curva, con vista sul Faro.",
        "Il prato": s < 2 ? "Erba alta, qualche palo e una porta senza rete. Il prato ha idee sue." : s < 4 ? "Un prato tagliato a strisce, con le righe quasi dritte." : "Il prato dell'inaugurazione. Nessuno ci cammina sopra, tranne tutti.",
        "Bordo campo": "La pista intorno al campo, col tabellone sul muro sud.",
        "Stadio del Borgo": "Il vecchio stadio del Borgo.",
      };
    }
    function prepareZone() { Z.areas = areasFor(); Z.hints = hintsFor(); }
    const baseBuild = Z.build;
    Z.build = function (m, fill) { baseBuild(m, fill); prepareZone(); };

    // ------------------------------------------------------------------ disegno
    const at = (x, y) => (cur && cur[y] && cur[y][x]) || "X";
    const rnd = (tx, ty, k) => hash(tx * 73 + ty * 131 + k * 17) / 4294967296;
    function tuft(sx, sy, tx, ty, dense) {
      const r = rnd(tx, ty, 1); if (r > dense) return;
      P(sx + 3 + ((r * 90) | 0) % 8, sy + 6, 2, 7, "#3d5a26"); P(sx + 6 + ((r * 50) | 0) % 6, sy + 4, 2, 9, "#4c7030"); if (r < dense * 0.3) P(sx + 9, sy + 5, 2, 2, "#e8d36a");
    }
    function floorPaint(f, sx, sy, tx, ty) {
      if (f === "p") {
        P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8d877b" : "#938c80"); P(sx, sy + 7, 16, 1, "#6f695d"); P(sx + (ty % 2 ? 5 : 12), sy, 1, 7, "#6f695d"); P(sx + (ty % 2 ? 11 : 3), sy + 8, 1, 7, "#6f695d");
        if (ST === 0) tuft(sx, sy, tx, ty, 0.12);
      } else if (f === "t") {
        const nord = ty <= 7;
        if (ST === 0) { P(sx, sy, 16, 16, "#667058"); P(sx + 1, sy + 3, 14, 3, "#7c8570"); P(sx, sy + 9, 16, 2, "#4f5944"); if (rnd(tx, ty, 2) < 0.4) P(sx + 4, sy + 11, 7, 4, "#8a8f82"); tuft(sx, sy, tx, ty, 0.7); }
        else if (ST === 1) { P(sx, sy, 16, 16, "#a6a195"); P(sx, sy + 7, 16, 2, "#c1bcb0"); P(sx, sy + 15, 16, 1, "#7f7a6e"); P(sx, sy + 8, 16, 1, "#847f73"); if (rnd(tx, ty, 3) < 0.18) { P(sx + 5, sy - 1, 1, 8, "#6a4a2c"); P(sx + 10, sy + 1, 1, 7, "#6a4a2c"); } }
        else { P(sx, sy, 16, 16, nord ? ((tx + ty) % 2 ? "#c9cfdc" : "#c2c9d8") : ((tx + ty) % 2 ? "#dccfae" : "#d5c8a6")); P(sx, sy + 7, 16, 2, nord ? "#dfe4ee" : "#ece0c2"); P(sx, sy + 15, 16, 1, "#8c8f9a"); P(sx, sy + 8, 16, 1, "#9a9ca6"); }
      } else if (f === "a") {
        if (ST === 0) { P(sx, sy, 16, 16, "#7d5646"); P(sx + 2, sy + 6, 11, 1, "#5e3f33"); P(sx + 7, sy + 2, 1, 9, "#5e3f33"); tuft(sx, sy, tx, ty, 0.45); }
        else if (ST === 1) { P(sx, sy, 16, 16, "#936248"); P(sx + 2, sy + 6, 11, 1, "#76503b"); }
        else { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#b4543c" : "#ad4f38"); P(sx, sy + 7, 16, 1, "#d9826a"); P(sx, sy + 15, 16, 1, "#8f3e2b"); }
      } else {
        if (ST === 0) { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#54703a" : "#58743e"); tuft(sx, sy, tx, ty, 0.85); }
        else if (ST === 1) { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#5a7b40" : "#5e8044"); tuft(sx, sy, tx, ty, 0.45); }
        else { P(sx, sy, 16, 16, tx % 2 ? "#3fa34d" : "#46ad54"); if (ST >= 3 && tx % 2) P(sx, sy, 16, 16, "#ffffff10"); }
      }
    }
    function wallPaint(sx, sy, tx, ty) {
      const below = at(tx, ty + 1), face = below !== "f" && below !== "X";
      if (!face) { P(sx, sy, 16, 16, "#5a5249"); P(sx, sy, 16, 2, "#766d62"); return; }
      if (ST === 0) {
        P(sx, sy, 16, 16, "#8a7c68"); P(sx, sy, 16, 3, "#6f6252"); P(sx, sy + 13, 16, 3, "#5d5244");
        if (rnd(tx, ty, 4) < 0.45) { P(sx + 4, sy + 5, 3, 6, "#5f7f4a"); P(sx + 9, sy + 7, 2, 5, "#6e8f58"); }
        P(sx + 6 + (tx % 3) * 2, sy + 4, 1, 9, "#6a5e4e");
        if (tx % 5 === 2 && ty === 25) { P(sx + 3, sy + 6, 10, 2, "#9a3a3a"); P(sx + 5, sy + 9, 6, 2, "#9a3a3a"); }
      } else {
        P(sx, sy, 16, 16, "#d3cab6"); P(sx, sy, 16, 3, "#a89e88"); P(sx, sy + 13, 16, 3, "#7a6f5a"); P(sx, sy + 12, 16, 1, "#b7ad96");
        if (ST >= 2) P(sx, sy + 8, 16, 3, ST >= 4 ? "#1f4e9c" : "#2f5f9a");
        if (tx % 4 === 1) { P(sx + 3, sy + 3, 10, 7, "#4f4637"); P(sx + 4, sy + 4, 8, 5, "#8fc6dc"); }
      }
    }
    const under_ = (tx, ty) => (under && under[ty] && under[ty][tx]) || "p";
    const PAINT = {
      K(sx, sy, tx) {
        P(sx, sy, 16, 16, "#7a6d5b"); P(sx, sy, 16, 3, "#5e5344");
        for (let i = 0; i < 4; i++) P(sx + 2 + i * 4, sy + 3, 2, 13, "#3b3f45");
        P(sx, sy + 5, 16, 2, "#4a4f57"); P(sx, sy + 11, 16, 2, "#4a4f57");
        if (tx === 21) { P(sx + 12, sy + 6, 6, 2, "#6a6e75"); P(sx + 13, sy + 7, 4, 5, "#c9a24a"); }
      },
      b(sx, sy, tx, ty, fr) { P(sx + 1, sy + 12, 14, 3, "#00000033"); if (tx % 2 === 1) { g.fillStyle = "#e0861c"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 9, 6, 0.3, 0, 7); g.fill(); g.fillStyle = "#f2a53a"; g.beginPath(); g.ellipse(sx + 7, sy + 6, 7, 3, 0.3, 0, 7); g.fill(); P(sx + 1, sy + 12, 5, 3, "#3b3f45"); } else { P(sx + 4, sy + 11, 10, 4, "#3b3f45"); P(sx + 6, sy + 8, 6, 3, "#9a9a9a"); if ((fr >> 3) % 2) P(sx + 12, sy + 6, 2, 2, "#d8d8d8"); } },
      k(sx, sy, tx, ty) { P(sx + 1, sy + 4, 14, 12, "#b5b0a2"); P(sx + 1, sy + 4, 14, 2, "#d3cfc2"); P(sx + 3, sy + 8, 10, 3, "#3d5f8c"); P(sx + 2, sy + 12, 12, 1, "#8f8a7d"); if ((tx + ty) % 2) P(sx + 6, sy + 2, 6, 3, "#c4bfb1"); },
      i(sx, sy, tx) {
        P(sx, sy + 2, 16, 14, "#6b4a2a"); P(sx, sy + 2, 16, 2, "#8c6238"); P(sx + 1, sy + 4, 14, 9, "#e8dcc0"); P(sx + 3, sy + 14, 2, 2, "#4a3320"); P(sx + 11, sy + 14, 2, 2, "#4a3320");
        if (tx % 2 === 1) { for (let k = 0; k < 4; k++) P(sx + 2 + k * 3, sy + 6, 2, 3, ST > k ? "#2f9e55" : "#c9bfa2"); P(sx + 2, sy + 10, 11, 1, "#8c7a5a"); }
        else { P(sx + 3, sy + 6, 9, 1, "#8c7a5a"); P(sx + 3, sy + 8, 6, 1, "#8c7a5a"); P(sx + 11, sy + 5, 3, 3, "#c8553d"); }
      },
      w(sx, sy, tx, ty) { g.fillStyle = "#3d5a26"; g.beginPath(); g.arc(sx + 8, sy + 9, 7, 0, 7); g.fill(); g.fillStyle = "#4f7a32"; g.beginPath(); g.arc(sx + 6, sy + 7, 4, 0, 7); g.fill(); P(sx + 10, sy + 6, 2, 2, "#e8d36a"); P(sx + 5, sy + 10, 2, 2, "#f2f2f2"); },
      v(sx, sy, tx) { P(sx, sy + 3, 16, 6, tx % 2 ? "#c8102e" : "#f2f2f2"); P(sx, sy + 3, 16, 1, "#00000022"); P(sx, sy + 9, 16, 7, "#7a4f2a"); P(sx, sy + 9, 16, 2, "#a8764a"); if (tx % 2) { P(sx + 3, sy + 11, 3, 3, "#d9a441"); P(sx + 8, sy + 11, 3, 3, "#e8e0c8"); } else { P(sx + 3, sy + 11, 2, 4, "#3476bd"); P(sx + 8, sy + 11, 2, 4, "#c8102e"); } },
      x(sx, sy, tx) { P(sx, sy + 2, 16, 14, "#7a4f2a"); P(sx, sy + 2, 16, 3, "#a8764a"); if (tx % 2 === 0) { P(sx + 3, sy + 6, 11, 6, "#2a2218"); P(sx + 4, sy + 7, 9, 4, "#8fc6dc"); P(sx + 3, sy + 12, 11, 2, "#c9a24a"); } else { P(sx + 2, sy + 6, 8, 3, "#f5e6c8"); g.fillStyle = "#3a2a1a"; g.font = "bold 5px sans-serif"; g.fillText("BIGL.", sx + 2, sy + 9); P(sx + 2, sy + 11, 10, 3, "#5c3b1e"); } },
      j(sx, sy) { P(sx + 1, sy + 1, 14, 15, "#5a5348"); P(sx + 2, sy + 2, 12, 11, "#cfc9b8"); P(sx + 4, sy + 4, 8, 1, "#6a5e4e"); P(sx + 4, sy + 6, 8, 1, "#6a5e4e"); P(sx + 4, sy + 8, 5, 1, "#6a5e4e"); P(sx + 10, sy + 9, 3, 3, "#c9a24a"); },
      l(sx, sy, tx, ty, fr) { P(sx + 2, sy + 4, 12, 12, "#8d877b"); P(sx + 2, sy + 4, 12, 3, "#b6b0a2"); P(sx + 5, sy + 8, 6, 4, "#6a5e4e"); P(sx + 7, sy + 9, 2, 2, "#c9a24a"); if (fr % 90 < 8) P(sx + 12, sy + 2, 2, 2, "#fff"); },
      q(sx, sy, tx) { const c = (tx >> 2) % 2 ? "#c8102e" : "#1e5aa8"; P(sx, sy + 4, 16, 9, c); P(sx, sy + 4, 16, 2, "#ffffff33"); P(sx + 1, sy + 13, 14, 2, "#00000033"); for (let k = 0; k < 3; k++) P(sx + 2 + k * 5, sy + 7, 3, 3, "#ffffff55"); },
      F(sx, sy, tx, ty) { if (ST >= 3) { P(sx + 3, sy + 10, 10, 6, "#6f7884"); P(sx + 3, sy + 10, 10, 2, "#98a2ae"); P(sx + 6, sy + 2, 4, 10, "#a9b3bf"); } else { P(sx + 4, sy + 11, 8, 5, "#6a4a30"); P(sx + 6, sy + 6, 3, 6, "#85543a"); P(sx + 5, sy + 13, 3, 1, "#a8683f"); } },
      z(sx, sy, tx, ty, fr) {
        if (ST < 4) { P(sx, sy + 1, 16, 15, "#9a9486"); P(sx, sy + 1, 16, 2, "#b7b1a2"); P(sx + 2, sy + 4, 1, 12, "#7a7468"); P(sx + 9, sy + 5, 1, 11, "#7a7468"); if (tx === 14 || tx === 17) P(sx + (tx === 14 ? 1 : 13), sy + 1, 2, 15, "#6a5e4e"); return; }
        P(sx, sy + 1, 16, 15, "#1a1f27"); P(sx, sy + 1, 16, 2, "#3a4250"); P(sx + 1, sy + 3, 14, 11, "#0e1218");
        g.fillStyle = "#ffb000"; g.font = "bold 8px sans-serif"; g.textAlign = "center";
        const txt = ["BORGO", "0", ":", "0"][tx - 14] || ""; g.fillText(txt, sx + 8, sy + 12, 15); g.textAlign = "left"; if (tx === 16 && (fr >> 5) % 2) P(sx + 7, sy + 5, 2, 2, "#ffb000");
      },
      E(sx, sy, tx, ty) { const left = at(tx - 1, ty) === "E"; P(sx, sy, 16, 16, "#5a5249"); P(sx, sy + 1, 16, 15, "#6b4a2a"); P(sx, sy + 1, 16, 2, "#8c6238"); P(left ? sx + 14 : sx, sy + 3, 2, 13, "#4a3320"); P(left ? sx + 10 : sx + 3, sy + 9, 2, 3, "#ffd23f"); },
    };
    Z.tile = function (ch, sx, sy, tx, ty) {
      if (FLOORS.includes(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
      if (ch === "X") { P(sx, sy, 16, 16, "#1b232c"); if ((tx * 7 + ty * 3) % 11 === 0) P(sx + 6, sy + 6, 2, 2, "#232d38"); return true; }
      if (ch === "f") { wallPaint(sx, sy, tx, ty); return true; }
      const f = PAINT[ch];
      if (!f) return false;
      if (ch !== "K" && ch !== "E") floorPaint(under_(tx, ty), sx, sy, tx, ty);
      f(sx, sy, tx, ty, Math.floor(performance.now() / 16));
      return true;
    };

    const on = (x, y) => x > -80 && x < 400 && y > -60 && y < 260;
    function label(txt, tx0, tx1, ty, dy) {
      const x = ((tx0 + tx1 + 1) / 2) * TS - Z._cx, y = ty * TS - Z._cy + (dy || 0); if (!on(x, y)) return;
      g.font = "bold 6px sans-serif"; const tw = g.measureText(txt).width + 6; P(x - tw / 2, y + 1, tw, 9, "#1e2430cc"); P(x - tw / 2, y + 1, tw, 1, "#c9a24a"); g.textAlign = "center"; g.fillStyle = "#fff5d0"; g.fillText(txt, x, y + 8); g.textAlign = "left";
    }
    Z.decor = function (cx, cy) {
      Z._cx = cx; Z._cy = cy;
      const fr = performance.now() / 16, fl = mem().flags;
      const X = (tx) => tx * TS - cx, Y = (ty) => ty * TS - cy;
      // il cantiere: ghiaia, transenne, sacchi
      if (ST < 4) {
        const x = X(2), y = Y(27); if (on(x, y)) { P(x, y, 13 * TS, 6 * TS, "#b8a888"); for (let i = 0; i < 40; i++) P(x + ((i * 53) % 205), y + ((i * 37) % 93), 2, 1, "#9a8a6c"); P(x, y, 13 * TS, 2, "#e0b83a"); P(x, y + 6 * TS - 2, 13 * TS, 2, "#e0b83a"); for (let i = 0; i < 13; i++) P(x + i * TS + 4, y, 6, 2, "#3a3a3a"); }
      } else {
        const x = X(2), y = Y(27); if (on(x, y)) { P(x, y, 13 * TS, 6 * TS, "#7e9a63"); for (let i = 0; i < 22; i++) { P(x + ((i * 61) % 200), y + ((i * 41) % 90), 3, 3, ["#ff9ec0", "#ffd23f", "#f2f2f2", "#c77dff"][i % 4]); } }
      }
      // righe del campo
      if (ST >= 2) {
        g.strokeStyle = "#ffffffcc"; g.lineWidth = 1;
        const x0 = X(8) + 0.5, y0 = Y(10) + 0.5, w = 28 * TS - 1, h = 11 * TS - 1;
        if (x0 > -500 && x0 < 400) {
          g.strokeRect(x0, y0, w, h); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke();
          g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 22, 0, 7); g.stroke();
          g.strokeRect(x0, y0 + 2.5 * TS, 4 * TS, 6 * TS); g.strokeRect(x0 + w - 4 * TS, y0 + 2.5 * TS, 4 * TS, 6 * TS);
          g.strokeRect(x0 - 8, y0 + 4 * TS, 8, 3 * TS); g.strokeRect(x0 + w, y0 + 4 * TS, 8, 3 * TS);
        }
      } else if (ST <= 1) { // porta storta senza rete
        const x = X(8), y = Y(14); if (on(x, y)) { P(x - 6, y, 2, 3 * TS, "#7a5a3a"); P(x - 6, y, 8, 2, "#7a5a3a"); P(x - 6, y + 3 * TS - 2, 6, 2, "#7a5a3a"); }
      }
      // ponteggio sui gradoni (tappa 1)
      if (ST === 1) for (let i = 0; i < 11; i++) { const x = X(3 + i * 4), y = Y(7); if (on(x, y)) { P(x, y - 20, 2, 36, "#8a6a3c"); P(x - 2, y - 8, 22, 2, "#a8844c"); P(x + 8, y - 24, 2, 40, "#8a6a3c"); } }
      // tappa 0: macerie e graffiti
      if (ST === 0) [[10, 14], [20, 12], [30, 17], [14, 18]].forEach(([tx, ty]) => { const x = X(tx), y = Y(ty); if (on(x, y)) { P(x, y + 6, 10, 6, "#6a665c"); P(x + 3, y + 3, 6, 5, "#85817a"); } });
      // bandiere comprate (e bandierine di festa)
      FLAGS.forEach((f, i) => {
        if (!fl.includes(f[0]) || ST < 2) return;
        const tx = [6, 11, 18, 25, 31][i], x = X(tx) + 8, y = Y(1) + 5; if (!on(x, y)) return;
        const sw = Math.sin(fr / 16 + i) * 1.5; P(x, y - 6, 1, 20, "#624b3c"); P(x + 1, y - 5, 12 + sw, 5, f[2]); P(x + 1, y, 12 - sw, 4, f[3]);
      });
      if (ST >= 4) {
        for (let i = 0; i < 40; i++) { const x = X(2) + i * TS + 8, y = Y(25.55); if (x < -8 || x > 330) continue; P(x - 3, y, 7, 5, ["#1e9e4a", "#f2f2f2", "#c8102e"][i % 3]); }
        // folla in tribuna e in curva (decor, non PNG)
        const t0x = Math.floor(cx / TS) - 1, t0y = Math.floor(cy / TS) - 1;
        for (let ty = t0y; ty <= t0y + 14; ty++) for (let tx = t0x; tx <= t0x + 22; tx++) {
          if (at(tx, ty) !== "t" || rnd(tx, ty, 9) > 0.34) continue;
          const bob = Math.sin(fr / 7 + tx * 2 + ty) > 0.7 ? -1 : 0, x = X(tx) + 3 + ((rnd(tx, ty, 5) * 8) | 0), y = Y(ty) + 5 + bob;
          P(x, y + 3, 4, 5, ["#c8102e", "#1e5aa8", "#ffd23f", "#f2f2f2"][(tx + ty) % 4]); P(x, y, 4, 3, ["#f2c9a0", "#d49a68", "#e8b98e"][(tx * 3 + ty) % 3]);
        }
        const nx = X(39), ny = Y(10); if (on(nx, ny)) { g.fillStyle = "#fff5d0"; g.font = "bold 9px sans-serif"; const k = (fr / 40) | 0; g.fillText("♪", nx - 6 + Math.sin(fr / 20) * 4, ny - (fr % 50) * 0.4); g.fillText("♫", nx + 8, ny - ((fr + 25) % 50) * 0.4 - 4); void k; }
      }
      label("CANTIERE", 2, 13, 26, 0); label("USCITA", 21, 22, 31.5, 0);
      if (ST >= 1) { label("TRIBUNA", 8, 32, 1, 8); label("CURVA OVEST", 2, 5, 7.2, 0); label("CURVA EST", 38, 41, 7.2, 0); }
    };

    Z.top = function (cx, cy) {
      const fr = performance.now() / 16, X = (tx) => tx * TS - cx, Y = (ty) => ty * TS - cy;
      // cartello sul cancello incatenato
      if (ST === 0) { const x = X(22), y = Y(25); if (on(x, y)) { P(x - 28, y - 14, 56, 16, "#e8dcc0"); P(x - 28, y - 14, 56, 2, "#c9a24a"); g.font = "bold 5px sans-serif"; g.textAlign = "center"; g.fillStyle = "#6b2a1a"; g.fillText("CHIUSO PER LAVORI", x, y - 7); g.fillStyle = "#4a3320"; g.fillText("(dal 1998)", x, y - 1); g.textAlign = "left"; } }
      // torri faro: pali, teste, luci
      TOWERS.forEach(([tx, ty], i) => {
        const x = X(tx) + 8, y = Y(ty) + 6; if (x < -40 || x > 360 || y < -60 || y > 260) return;
        if (ST < 3) { P(x - 2, y - 14, 4, 16, "#6a4a30"); g.save(); g.translate(x, y - 14); g.rotate(i % 2 ? 0.6 : -0.6); P(-6, -2, 12, 4, "#4a3a2e"); g.restore(); return; }
        P(x - 2, y - 36, 4, 38, "#9aa5b1"); P(x - 2, y - 36, 1, 38, "#c7d0da"); P(x - 9, y - 44, 18, 8, "#2a2f38");
        for (let k = 0; k < 4; k++) P(x - 7 + k * 4, y - 42, 3, 4, "#fff7c8");
      });
      if (ST >= 3) {
        g.fillStyle = "rgba(8,14,44,.22)"; g.fillRect(0, 0, 320, 200);
        g.save(); g.globalCompositeOperation = "lighter";
        const pool = (x, y, r, a) => { const gr = g.createRadialGradient(x, y, 2, x, y, r); gr.addColorStop(0, `rgba(255,244,190,${a})`); gr.addColorStop(1, "rgba(255,244,190,0)"); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
        TOWERS.forEach(([tx, ty]) => { const x = X(tx) + 8, y = Y(ty) + 6; if (x < -140 || x > 460 || y < -140 || y > 340) return; pool(x, y - 40, 40, 0.55); pool(x + (tx < 20 ? 60 : -60), y + (ty < 16 ? 50 : -50), 90, 0.34); });
        [[21.5, 26], [10, 29], [33, 29], [3, 28], [40, 28]].forEach(([tx, ty]) => { const x = X(tx) + 8, y = Y(ty); if (x < -60 || x > 380) return; pool(x, y, 46, 0.3); });
        g.restore();
        [[21.5, 26], [10, 29], [33, 29]].forEach(([tx, ty]) => { const x = X(tx) + 8, y = Y(ty); if (on(x, y)) { P(x - 1, y - 14, 2, 15, "#3a3f47"); P(x - 3, y - 17, 6, 4, "#fff7c8"); } });
      }
    };

    Z.drawItem = function (x, y, i) {
      if (ITEMS[i] && ITEMS[i][2] > ST) return;
      g.save(); g.translate(x, y); g.rotate(((i % 3) - 1) * 0.2);
      P(-5, -4, 10, 8, "#f1e3b8"); P(-5, -4, 10, 1, "#fff7d8"); P(-5, 3, 10, 1, "#c9b583"); P(-2, -3, 1, 6, "#c9b583"); P(0, -2, 4, 1, "#8c6a2a"); P(0, 0, 3, 1, "#8c6a2a");
      g.restore();
    };

    // ------------------------------------------------------------------ dialoghi
    const go = (fn) => () => { try { fn(); } catch (e) { api.trSay([L("voce", "Qualcosa si è inceppato. Riprova tra un attimo.")], api.trResume); if (DEBUG) console.error(e); } };
    const resume = () => api.trResume();
    const say = (who, txt) => api.trSay([SB(who, txt)], resume);
    const scene = (lines, then) => api.trSay(lines.map(([w, t]) => SB(w, t)), then || resume);
    const nameOf = (id) => (CAST[id] ? CAST[id].name : id);
    const pickDay = (a, seed) => a[hash(seed + today()) % a.length];

    // scene delle tappe: ironia di cantiere e un momento serio per ognuna
    const SC = [
      [
        ["voce", "Il Comunale del Borgo ha tre cose rimaste intatte: la catena al cancello, il cartello «CHIUSO PER LAVORI» e l'erba, che lavora per conto suo dal 1998."],
        ["sb_custode", "Non guardare l'erba, si offende. La taglio con le forbici, un metro quadro al giorno. A questo ritmo il campo è pronto per i tuoi nipoti."],
        ["sb_capo", "Fiorenzo Calcina, capocantiere. L'elmetto era di mio padre; il metro pure: novantotto centimetri, ma lui li chiamava cento."],
        ["sb_capo", "Quattro lavori e un preventivo scritto sul retro di un sacco di cemento. Prima i gradoni, poi prato e tribuna, poi le luci, poi l'inaugurazione."],
        ["sb_capo", "Si paga con le monete. Oppure col Fondo del Molo: le settimane d'oro e le stagioni vinte pagano i mattoni, e pagano meglio."],
        ["leo", "Io ho un pallone e qualche moneta. Da dove si comincia?"],
        ["sb_capo", "Dalla bacheca dei lavori, qui nel cantiere. Si firma, si paga, e io prometto di non dire «una settimana» quando intendo «un mese»."],
      ],
      [
        ["voce", "Per tre giorni il cantiere fa rumore di betoniera e di Fiorenzo che dà ordini a un mulo. Il quarto giorno, sotto le erbacce, spuntano i gradoni."],
        ["sb_capo", "I gradoni c'erano da sempre. Li avevano coperti di erbacce, come si fa con le cose che fanno male. Io ho solo tolto il resto."],
        ["sb_mimmo", "Posso sedermi? È la prima volta che entro. L'ho sempre sentito da fuori: quando segnavano si sentiva «OOOH» da dietro il muro."],
        ["sb_capo", "Siediti dove vuoi, giovanotto. Il primo gradino però è il più importante: regge tutti gli altri. Nessuno lo guarda mai."],
        ["sb_mimmo", "Io lo guardo."],
        ["sb_custode", "(a Leo, piano) Suo nonno stava in terza fila. Cantava stonato. Non glielo dire: lo sa già."],
      ],
      [
        ["voce", "Il prato è tagliato, le righe sono bianche (quasi dritte) e nella tribuna centrale sono arrivati i primi seggiolini. Sotto il basamento, la pala di Fiorenzo batte su qualcosa di metallo."],
        ["sb_capo", "Un attimo. Questa non è una tubatura. È... è la cassetta di mio padre."],
        ["voce", "Dentro: una lista di ventidue nomi a matita, una moneta del 1951 e un biglietto piegato in quattro."],
        ["sb_capo", "«Chi costruisce uno stadio non lo vedrà finito. Lo vedranno i figli di chi lo guarda. — O. Calcina, capomastro.» Scriveva le cose importanti su biglietti piccoli, per non farsi vedere a piangere."],
        ["sb_delfina", "Il tredici è mio dal 1964. Mi sono portata il cuscino. Se qualcuno si siede al tredici, il cuscino lo sa."],
        ["sb_custode", "E io sono al quattordici. Da sessant'anni ci salutiamo e non parliamo della cosa."],
        ["sb_gennaro", "Noccioline, bibite, bandierine! Prezzi onesti, quasi. Il quasi è la mia commissione."],
      ],
      [
        ["voce", "Quattro torri faro, alte come il campanile di San Pietro (secondo Fiorenzo; secondo il geometra, un po' meno). Il collaudo è alle nove di sera."],
        ["sb_capo", "Si accende tutto insieme. Se salta la luce al Borgo vi do il mio numero di telefono. Che non funziona."],
        ["voce", "Clic. Le torri si accendono una a una, come quattro gabbiani che aprono gli occhi. Da lontano il Faro risponde con un lampo."],
        ["sb_custode", "Nell'82, la notte del blackout, abbiamo giocato qui alla luce delle lanterne. Sedici lanterne, tre gabbiani spaventati, un arbitro che segnava i falli a memoria. Nessuno ha perso. Nemmeno il buio."],
        ["sb_capo", "Mia moglie Gelsomina dice che le torri le tolgono il sonno. Poi le guarda tutta la sera dalla finestra, col maglione sulle spalle."],
      ],
      [
        ["voce", "Sabato. Bandiere sulle torri, striscioni appesi con lo scotch, un nastro tricolore lungo quanto la strada. La banda di San Pietro ha portato tre trombe e un tamburo senza pelle."],
        ["sb_speaker", "Signore e signori, benvenuti allo Stadio del Borgo! Capienza ufficiale: duemila. Capienza reale: quanta ne serve per guardarsi in faccia."],
        ["sb_capo", "Le forbici! Chi ha le forbici?"],
        ["sb_custode", "(estrae le forbici da giardino) Sono le uniche che ho."],
        ["voce", "Il nastro cade con un taglio sbilenco. Il coro attacca: stonato, felicissimo, in ritardo di un verso."],
        ["sb_capo", "(si toglie l'elmetto, per la prima volta) Sulla targa ho fatto incidere i ventidue nomi del '51. E sotto, quelli di chi ha comprato un mattone. Uno è «Leo M.». Sta tra Mimmo e il mulo."],
        ["leo", "Il mulo ha un nome?"],
        ["sb_capo", "Adesso sì: Ottavio. Mio padre avrebbe riso. O chiesto il conto."],
        ["sb_speaker", "E ora, come in ogni vero stadio, le finali si giocano quando volete voi. Il tabellone è sul muro sud."],
      ],
    ];

    // chiacchiere a rotazione: { s: tappa minima, t: testo }
    const CHAT = {
      sb_capo: [
        [0, "Il segreto del cantiere è fare finta di sapere cosa si sta facendo. Il secondo segreto è che ogni tanto è vero."],
        [0, "L'elmetto di mio padre mi sta largo. Ci ho messo dentro un giornale piegato: l'Eco del Tirreno del '78. Si legge male, ma tiene."],
        [0, "Il mulo non ha un nome. Dice che i nomi portano responsabilità. Si vede che ha fatto il sindacalista."],
        [1, "Un gradino sembra niente. Poi qualcuno ci si siede e diventa il posto di un'intera famiglia. Ho smesso di sottovalutare i gradini."],
        [2, "Quando ho trovato la cassetta ho dovuto sedermi. Per fortuna c'era un gradino."],
        [3, "Gelsomina dice che le torri le tolgono il sonno. Poi le guarda tutta la sera, col maglione sulle spalle. Fa finta di non guardare."],
        [4, "Il giorno dopo l'inaugurazione sono tornato qui da solo, alle sei. Ho acceso una torre sola, per sentire se faceva rumore. Faceva un ronzio. Mi è piaciuto."],
      ],
      sb_custode: [
        [0, "Taglio un metro quadro al giorno con le forbici. Con la falciatrice l'erba lo capisce e si offende."],
        [0, "Le chiavi del cancello sono tre. Una l'ho persa nell'87, una la porto al collo e una è in fondo al mare. Non chiedere."],
        [1, "I gradoni nuovi odorano di cemento. Quelli vecchi odoravano di pioggia e di panini. L'odore tornerà: aspetta in tribuna."],
        [2, "Posto quattordici. Da lì si vede la traversa di sinistra e il cuscino di Delfina. Non ti dico in che ordine li guardo."],
        [3, "Con la luce l'erba cresce diversa, giuro. La sera fa un verde che non ha nome. Se lo dico ad Anselmo, mi ci dipinge una barca."],
        [4, "Sessantatré anni di custode. Oggi mi hanno fatto sedere in tribuna a guardare. Non ero abituato: mi sono alzato tre volte a controllare il prato."],
      ],
      sb_mimmo: [
        [1, "Ho contato i gradoni: sono quarantadue. Uno è più basso degli altri: l'ho chiamato Paolo."],
        [1, "Mio nonno veniva qui con una sciarpa che pungeva. Quando segnavano mi alzava sulle spalle. Io non c'ero. Me l'ha raccontato così bene che è come se ci fossi stato."],
        [2, "Il prato è così verde che mi vergogno a camminarci. Poi ci cammino."],
        [3, "Dalla finestra di casa mia, con le torri accese, si vede lo stadio. Mamma dice «spegni la luce e a letto». Spengo la mia e guardo la loro."],
        [4, "Domani sono raccattapalle. Ho il numero sulla pettorina: il quattordici. Settimio dice che porta fortuna. Non gli ho detto che è il suo posto."],
      ],
      sb_delfina: [
        [2, "Il tredici è mio dal 1964. Se qualcuno si siede al tredici, il cuscino lo sa."],
        [2, "Con Settimio ci salutiamo da sessant'anni. È il più bel rapporto della mia vita e non gli ho mai detto grazie."],
        [3, "Con le luci è diverso. Prima si vedeva il campo. Adesso si vedono anche le facce di quelli che guardano il campo."],
        [4, "Alla prima partita porto la termos. Per chi avrà freddo. Il freddo non avvisa."],
      ],
      sb_gennaro: [
        [2, "Ho venduto la prima bandierina a un bimbo senza soldi. Gliel'ho fatta pagare con un bacio alla nonna. Un affare."],
        [2, "Noccioline, bibite, bandierine! Il quasi è la mia commissione."],
        [3, "Con le torri accese si compra di più. Sarà la luce. O la fame, che di sera è più sincera."],
        [4, "Ho ordinato mille bandierine per l'inaugurazione. Ne ho vendute novecentonovanta. Le altre dieci le ha prese il vento."],
      ],
      sb_speaker: [
        [4, "Il mio mestiere è dire «e il pallone arriva!» anche quando arriva una pantofola. Il pubblico perdona, la pantofola no."],
        [4, "Il microfono è del '71. Ha la voce di un altro. Io ci metto il cuore, lui ci mette il fruscio."],
        [4, "Alla fine di ogni partita dico sempre la stessa frase: «Grazie di essere venuti». La penso davvero. È il mio segreto."],
      ],
      sb_coro: [
        [4, "Il coro ha centododici elementi. Cantano in cinque tonalità diverse; la sesta la inventa Settimio."],
        [4, "Il mio compito è dare la nota. La nota la dà sempre il gabbiano, io la ripeto con più dignità."],
        [4, "Non siamo bravi: siamo in tanti. L'ho scritto sulla curva. Poi ho cancellato «bravi» e ho scritto «fortunati»."],
      ],
    };
    function chatLines(id) {
      const m = mem(), pool = (CHAT[id] || []).filter((c) => c[0] <= ST), n = m.chat[id] | 0;
      m.chat[id] = n + 1; memSet(m);
      return pool.length ? [SB(id, pool[n % pool.length][1])] : [SB(id, "…")];
    }
    const talkedToday = (id) => mem().talked[id] === today();
    const markTalked = (id) => { const m = mem(); m.talked[id] = today(); memSet(m); };

    // ---- lavori: pagamento e tappe
    function lavoriHtml(f) {
      const m = mem(), rows = STG.map((s, i) => `${i <= m.stage ? "✓" : "•"} <b>${esc(s.n)}</b>${i ? ` · ${COST[i]} monete` : ""} <span style="color:var(--dim)">${esc(s.s)}</span>`);
      return rows.join("<br>") + `<br><br><span style="color:var(--dim)">Monete: ${bal()} · Fondo del Molo: ${f.avail} credito (${f.gold} sett. d'oro, ${f.seasons.tot} stagioni vinte)</span>`;
    }
    function lavori() {
      const m = mem(), f = fund(), s = m.stage + 1;
      if (s > 4) return api.trAsk("sb_capo", `«Lavori finiti. Il registro dice: quattro su quattro. Io dico: finché c'è un gradino da avvitare, non sono finiti.»<br><br>${lavoriHtml(f)}`, [{ label: "Il Fondo del Molo", sub: "Settimane d'oro e stagioni vinte", fn: go(fondo) }]);
      const cost = COST[s], opts = [];
      const can = bal() >= cost, useF = Math.min(f.avail, cost), coinsF = cost - useF;
      opts.push({ label: `Paga ${cost} monete`, sub: can ? `Avvia: ${STG[s].n}` : `Ti mancano ${cost - bal()} monete`, cls: can ? "hot" : "", disabled: !can, fn: go(() => buildStage(false)) });
      if (f.avail > 0) opts.push({ label: `Usa il Fondo del Molo`, sub: `−${useF} credito${coinsF ? ` e ${coinsF} monete` : ""}${bal() >= coinsF ? "" : ` · ti mancano ${coinsF - bal()} monete`}`, cls: bal() >= coinsF ? "hot" : "", disabled: bal() < coinsF, fn: go(() => buildStage(true)) });
      opts.push({ label: "Il Fondo del Molo", sub: "Come si guadagna credito", fn: go(fondo) });
      api.trAsk("sb_capo", `«Prossima tappa: <b>${esc(STG[s].n)}</b>. ${esc(STG[s].s)}. Costo: ${cost} monete.»<br><br>${lavoriHtml(f)}`, opts);
    }
    function fondo() {
      const f = fund();
      api.trAsk("sb_capo", `«Il Fondo del Molo lo alimentano i ragazzi del Molo, non io. Ogni <b>settimana d'oro</b> (40 punti nella Settimana del Molo) vale ${GOLD_CR} di credito; ogni <b>stagione vinta</b> in Carriera, Gabbia, Coppa del Molo o Matchday Director, ${SEAS_CR}. Il credito paga i mattoni al posto delle monete.»<br><br><span style="color:var(--dim)">Settimane d'oro: ${f.gold}/8 · Stagioni: Carriera ${f.seasons.carriera}, Gabbia ${f.seasons.gabbia}, Coppa ${f.seasons.coppa}, Director ${f.seasons.director}<br>Credito ${f.credit} · usato ${f.used} · disponibile <b>${f.avail}</b></span>`, [{ label: "◂ Bacheca dei lavori", fn: go(lavori) }]);
    }
    function buildStage(useFund) {
      const m = mem(), f = fund(), s = m.stage + 1; if (s > 4) return;
      const cost = COST[s], credit = useFund ? Math.min(f.avail, cost) : 0, need = cost - credit;
      if (bal() < need) return say("sb_capo", "Mi mancano ancora un po' di monete, giovanotto. I mattoni non accettano promesse. Le accetta solo il mulo.");
      if (need > 0 && !spend(need)) return say("sb_capo", "La cassa del cantiere non risponde. Riprova tra poco.");
      m.used += credit; m.stage = s; memSet(m);
      const got = [];
      if (s === 2) { const c = cosGive("sb_cantiere"); if (c) got.push(c); }
      if (s === 4) { const c = cosGive("sb_stadio"); if (c) got.push(c); }
      state.pendingCos = got;
      enter({ fromBorgo: state.fromBorgo, upgrade: true });
    }

    // ---- menu dei PNG
    function capoMenu() {
      const m = mem(), f = fund(), s = m.stage, nextOk = s < 4 && (bal() >= COST[s + 1] || f.avail >= COST[s + 1]);
      markTalked("sb_capo");
      const head = s >= 4 ? "«Il cantiere ha chiuso. Io no: ho ancora il metro di mio padre e la sensazione che manchi un gradino.»" : nextOk ? "«Hai il fondo per la prossima tappa, giovanotto? Mi sa di sì. Si firma alla bacheca.»" : s === 0 ? "«Fiorenzo Calcina, a rapporto. Il preventivo è scritto sul sacco. Il sacco è in magazzino. Il magazzino è sul sacco.»" : "«Si lavora, si lavora. Il cantiere va a monete e a stagioni vinte: come la vita, ma con meno burocrazia.»";
      api.trAsk("sb_capo", head, [
        { label: s >= 4 ? "Il registro dei lavori" : "Avvia la prossima tappa", sub: s >= 4 ? "Quattro tappe su quattro" : `${STG[s + 1].n} · ${COST[s + 1]} monete`, cls: s < 4 ? "hot" : "", fn: go(lavori) },
        { label: "Il Fondo del Molo", sub: `Credito disponibile: ${f.avail}`, fn: go(fondo) },
        ...(s >= 4 ? [{ label: "Le finali dello Stadio", sub: "Dal tabellone, sul muro sud", fn: go(finals) }] : []),
        { label: "Quattro chiacchiere", sub: "Cemento, ricordi e un mulo", fn: go(() => api.trSay(chatLines("sb_capo"), capoMenu)) },
      ]);
    }
    function simpleMenu(id, head, extra) {
      markTalked(id);
      const opts = (extra || []).concat([{ label: "Due chiacchiere", sub: nameOf(id), fn: go(() => api.trSay(chatLines(id), resume)) }]);
      api.trAsk(id, head, opts);
    }
    function custodeMenu() {
      const lines = { 0: "«Il cancello? Chiuso. La chiave? Al collo. Il fabbro? Morto nel '96, ma la chiave regge.»", 1: "«Controllo i gradoni uno per uno. Fiorenzo dice che non serve. Io controllo.»", 2: "«Posto quattordici, Moretti. Se vuoi vedere la traversa di sinistra, siediti al quindici.»", 3: "«L'erba, la sera, è un'altra cosa. Per fortuna si taglia uguale.»", 4: "«Settimio, custode. Per la prima volta in sessantatré anni, anche spettatore.»" };
      simpleMenu("sb_custode", lines[ST]);
    }
    function mimmoMenu() { simpleMenu("sb_mimmo", ["", "«Ciao! Sai che il primo gradino è il più importante?»", "«Hai visto le righe? Sono quasi dritte!»", "«Dalla mia finestra tra poco si vedranno le luci.»", "«Domani c'è la prima partita. Io raccatto.»"][ST]); }
    function delfinaMenu() { simpleMenu("sb_delfina", ["", "", "«Il tredici, tesoro. Il cuscino è mio, la vista è di tutti.»", "«Ti piacciono le luci? A me fanno venire voglia di fare un maglione.»", "«Quando comincia la partita, si zittisce tutto e si sente il cuscino.»"][ST]); }
    function speakerMenu() {
      simpleMenu("sb_speaker", "«Ermete Megafono, la voce dello stadio! Per le finali, il tabellone è lì. Se mi chiedi di annunciare, annuncio.»", [{ label: "Le finali dello Stadio", sub: "Gabbia, Coppa del Molo, Matchday Director", cls: "hot", fn: go(finals) }]);
    }
    function coroMenu() {
      simpleMenu("sb_coro", "«Bepi Diapason, direttore del coro. La nota la dà il gabbiano, io la ripeto.»", [{ label: "Intona il coro", sub: "Una canzone sola, in ritardo di un verso", fn: go(() => scene([["voce", "Bepi alza il braccio. Centododici persone prendono fiato nello stesso momento, il che non succede mai."], ["sb_coro", "Un, due, tre... \"Borgo, Borgo, vola sul mare...\""], ["voce", "Il coro parte in cinque tonalità. La sesta, un po' più su, è Settimio. Il gabbiano della torre risponde con una nota sua, e per un attimo suona tutto bene."]])) }]);
    }

    // ---- Gennaro: figurine e bandiere (solo cosmetici)
    function gennaroMenu() {
      const m = mem(), got = m.stk.length, claimed = m.day.stk === today();
      markTalked("sb_gennaro");
      const opts = [
        { label: claimed ? "Figurina del giorno (già presa)" : "Figurina del giorno", sub: got >= STK.length ? "Album completo" : `Album ${got}/${STK.length} · una al giorno, in omaggio`, cls: claimed || got >= STK.length ? "" : "hot", disabled: claimed || got >= STK.length, fn: go(stickerToday) },
        { label: "L'album delle figurine", sub: `${got}/${STK.length}`, fn: go(album) },
        { label: "Bandiere per lo stadio", sub: `${m.flags.length}/${FLAGS.length} · ${FLAG_PRICE} monete l'una · si appendono in tribuna`, fn: go(flagShop) },
        { label: "Due chiacchiere", sub: "Noccioline e prezzi onesti", fn: go(() => api.trSay(chatLines("sb_gennaro"), gennaroMenu)) },
      ];
      api.trAsk("sb_gennaro", "«Noccioline, bibite, bandierine! Una figurina al giorno è un omaggio della casa; le bandiere no, ma durano più delle noccioline.»", opts);
    }
    function stickerToday() {
      const m = mem(); if (m.day.stk === today()) return say("sb_gennaro", "Oggi te l'ho già data. Domani ne trovo un'altra. Le figurine sono come i gabbiani: arrivano da sole.");
      const missing = STK.map((_, i) => i).filter((i) => !m.stk.includes(i));
      if (!missing.length) return say("sb_gennaro", "L'album è completo. Non ho più niente da darti, se non una nocciolina.");
      const k = missing[hash(today() + "stk") % missing.length]; m.stk.push(k); m.day.stk = today(); memSet(m);
      const lines = [SB("sb_gennaro", `Questa è nuova: «${STK[k]}». Incollala con cura. Con la colla di Pina, se la trovi.`)];
      if (m.stk.length >= STK.length) { const c = cosGive("sb_album"); lines.push(SB("voce", `Album completo! ${c ? "Nuovo in guardaroba: " + c + "." : "Gennaro ti stringe la mano con le noccioline."}`)); }
      api.trSay(lines, gennaroMenu);
    }
    function album() {
      const m = mem();
      api.trAsk("sb_gennaro", `«L'album dello Stadio.»<br><br>${STK.map((n, i) => (m.stk.includes(i) ? `✓ <b>${esc(n)}</b>` : `• <span style="color:var(--dim)">???</span>`)).join("<br>")}`, [{ label: "◂ Gennaro", fn: go(gennaroMenu) }]);
    }
    function flagShop() {
      const m = mem(), opts = FLAGS.map((f) => {
        const own = m.flags.includes(f[0]);
        return { label: f[1], sub: own ? "Appesa in tribuna ✓" : `${FLAG_PRICE} monete${bal() >= FLAG_PRICE ? "" : " · ti mancano " + (FLAG_PRICE - bal())}`, disabled: own || bal() < FLAG_PRICE, fn: go(() => buyFlag(f[0])) };
      });
      opts.push({ label: "◂ Gennaro", fn: go(gennaroMenu) });
      api.trAsk("sb_gennaro", "«Bandiere di stoffa vera, cucite da Clotilde. Le appendo io in tribuna: tu scegli, io salgo sulla scala.»", opts);
    }
    function buyFlag(id) {
      const m = mem(); if (m.flags.includes(id) || bal() < FLAG_PRICE) return flagShop();
      if (!spend(FLAG_PRICE)) return flagShop();
      m.flags.push(id); memSet(m);
      api.trSay([SB("sb_gennaro", `${FLAGS.find((f) => f[0] === id)[1]}: appesa. Vista dalla tribuna fa sempre la sua figura.`)], flagShop);
    }

    // ---- botteghino: piccolo incasso giornaliero
    function botteghino() {
      const m = mem(), n = INCASSO[ST];
      if (!n) return say("voce", "Il botteghino è chiuso. Sul vetro, un biglietto: «Torno quando c'è qualcosa da vedere».");
      if (m.day.inc === today()) return say("voce", "Il cassetto del botteghino è vuoto: oggi hai già incassato. Sul vetro, a pennarello: «Domani. Non insistere.»");
      m.day.inc = today(); memSet(m); const got = give(n);
      api.trSay([L("voce", pickDay(["Il cassetto del botteghino: qualche biglietto staccato, un bottone e un'offerta libera lasciata da qualcuno che non vuole ringraziamenti.", "Nel cassetto, tra le matite di Fiorenzo, trovi gli incassi di ieri: pochi, ma contati due volte."], "inc"), "stadium"), L("voce", `Ne ricavi <em>+${got} monete</em>. Una volta al giorno: più lo stadio cresce, più il cassetto pesa.`, "stadium")], resume);
    }

    // ---- il tabellone: le finali di Gabbia, Coppa del Molo e Matchday Director
    function snap(mode) {
      return safe(() => {
        if (mode === "cage") { const i = window.__cageHd.info(); return (i.titles | 0) + (i.cups | 0); }
        if (mode === "action") { const i = window.__actionHd.state(); return (i.titles | 0) + (i.cupWon | 0); }
        const i = window.__directorHd.state(); return (i.won | 0) + (i.seasonsDone | 0);
      }, 0);
    }
    const FIN = {
      cage: {
        who: "Don Tullio", ico: "👟", name: "Finale della Gabbia", sub: "Coppa a eliminazione, tra le reti del Molo",
        pre: [["sb_speaker", "Signore e signori, questa sera la Gabbia del Molo viene a giocare in uno stadio vero. Sono arrivati gli Scaricatori in trasferta, con le cassette del pesce al posto delle sedie."], ["voce", "Don Tullio ha portato le chiavi. Non servono, ma gli piace tenerle in mano."]],
        win: "La finale è tua. Don Tullio, in tribuna, batte un colpo sulla ringhiera. Uno solo. Per il rumore.", lose: "Non stavolta. Dalla tribuna, Don Tullio alza il pollice: in Gabbia si perde sempre con un po' di dignità e un po' di cemento.",
        has: () => !!(window.__cageHd && window.__cageHd.start),
        run: (back) => window.__cageHd.start({ screen: "cup", onExit: back, from: "borgo" }),
      },
      action: {
        who: "Ginetta", ico: "⚽", name: "Finale della Coppa del Molo", sub: "Tabellone a eliminazione, cinque contro cinque",
        pre: [["sb_speaker", "La Coppa del Molo sbarca allo Stadio! Arbitra Ginetta Bandierina, che ha letto il regolamento. Tutto il regolamento."], ["voce", "Dalla curva sale un odore di fritto. Nando ha portato la friggitrice: è la quarta volta che dice «solo per stasera»."]],
        win: "Coppa del Molo, finale vinta. Ginetta alza il fischietto come un trofeo, e il trofeo, per una volta, glielo lasciano fare.", lose: "La finale è andata altrove. Ginetta ti passa un cartoccio di frittura: «Rivincita quando il vento gira. Gira sempre».",
        has: () => !!(window.__actionHd && window.__actionHd.start),
        run: (back) => window.__actionHd.start({ mode: "cup", onExit: back }),
      },
      director: {
        who: "Spigola e Dina", ico: "📋", name: "Finale di Matchday Director", sub: "La Rondine FC dalla panchina",
        pre: [["sb_speaker", "In panchina, per la società: il Commendator Spigola e la segretaria Dina Cartella, con tre copie della formazione. A matita, non si sa mai."], ["voce", "Il Presidente guarda lo stadio nuovo e si commuove un po'. Dina gli passa un fazzoletto e il foglio con la distinta."]],
        win: "Episodio vinto dalla panchina. Il Presidente dice che era tutto previsto; Dina ha già archiviato la partita nella cartella «Varie».", lose: "Questa è andata male, ma la distinta è a posto. Dina l'ha archiviata comunque: «Si impara dalle cartelle».",
        has: () => !!(window.__directorHd && window.__directorHd.start),
        run: (back) => { const s = safe(() => window.__directorHd.state(), null); window.__directorHd.start(Object.assign({ onExit: back, from: "borgo" }, s && s.next && s.won > 0 ? { opp: s.next.id } : {})); },
      },
    };
    function playFinal(key) {
      const F = FIN[key];
      if (!F.has()) return api.trSay([SB("sb_speaker", "Questa finale non è in programma: i riflettori ci sono, ma la squadra non è arrivata.")], finals);
      const before = snap(key);
      scene(F.pre, () => {
        safe(() => {
          F.run(() => {
            const win = snap(key) > before, m = mem(); m.finals[key] = (m.finals[key] | 0) + 1; if (win) m.finals[key + "W"] = (m.finals[key + "W"] | 0) + 1; memSet(m);
            api.trSay([SB("sb_speaker", win ? F.win : F.lose)], resume);
          });
        });
      });
    }
    function finals() {
      const m = mem(), mo = safe(() => window.__moloSettimana.info(), null);
      const opts = Object.keys(FIN).map((k) => ({ label: `${FIN[k].ico} ${FIN[k].name}`, sub: FIN[k].has() ? `${FIN[k].sub}${m.finals[k] ? " · giocate " + m.finals[k] : ""}` : "Modalità non disponibile", cls: FIN[k].has() ? "hot" : "", disabled: !FIN[k].has(), fn: go(() => playFinal(k)) }));
      if (mo) opts.push({ label: "🏆 La Settimana del Molo", sub: mo.sub, fn: go(() => window.__moloSettimana.open({ view: mo.pending ? "ceremony" : "board", onExit: resume })) });
      api.trAsk("sb_speaker", "«Il tabellone dello Stadio: tre finali, tre storie. Le regole sono quelle di sempre: cambia soltanto il pubblico, che adesso c'è.»", opts);
    }

    // ---- oggetti
    const FLAV = {
      b: ["Una betoniera color arancio, con scritto «Ernestina» a pennarello. Gira da sola, quando nessuno la guarda. Fiorenzo giura di no.", "La betoniera borbotta. Fiorenzo dice che sta pensando. Settimio dice che sta digerendo."],
      k: ["Sacchi di cemento impilati con una cura quasi affettuosa. Su uno, a matita: «NON SEDERSI (Moretti)».", "Una pila di sacchi. Quello in cima ha un'etichetta di scorta: «Domani, forse»."],
      w: ["Un ciuffo di erbacce alto come un ginocchio. Ha un'aria soddisfatta: ha resistito più del cartello.", "Erbacce. Qualcuno ha appeso al gambo un bigliettino: «Non strappare: sto lavorando»."],
      F: ["Una torre faro. Alla base, una targhetta: «Gelsomina, per le sere in cui si torna tardi».", "La torre faro: più alta del campanile secondo Fiorenzo, più bassa secondo il geometra. Il gabbiano, in cima, non commenta."],
      q: ["Seggiolini blu e rossi, numerati. Il tredici ha un cuscino ricamato; il quattordici, una macchia di caffè d'annata."],
      j: ["Sulla targa: «Stadio del Borgo, 1951 – oggi». Sotto, ventidue nomi, poi un elenco di chi ha comprato un mattone. Uno è «Leo M.». Tra Mimmo e «il mulo (Ottavio)»."],
    };
    const OBJ = {
      E: () => api.trAsk("voce", "Il cancello in fondo al piazzale. Fuori, la strada della costa; dentro, tutto il resto.", [{ label: "Esci sulla strada", sub: "Si rientra dal varco, quando vuoi", cls: "hot", fn: go(exitStadium) }]),
      K: () => scene([["voce", "Una catena grossa come un polso, un lucchetto più vecchio di Fiorenzo e un cartello: «CHIUSO PER LAVORI (dal 1998)». L'erba, dall'altra parte, sembra applaudire."], ["sb_custode", "Il lucchetto lo apre soltanto la bacheca dei lavori. Chiedilo a Fiorenzo, che ha il metro."]]),
      i: lavori, x: botteghino, v: gennaroMenu,
      l: () => scene([["voce", "Un basamento di pietra con una lastra di ferro sollevata: sotto, il vuoto lasciato dalla cassetta del '51."], ["sb_capo", "L'ho lasciata aperta. Ogni tanto ci guardo dentro e non c'è più niente, e mi sembra pieno."]]),
      z: () => (ST >= 4 ? finals() : scene([["voce", "Un tabellone coperto da un telo grigio, legato con sette nodi diversi. Sul telo, a gessetto: «Si accende quando lo stadio sarà finito.»"], ["sb_capo", "Quando avrò finito, sarà il primo a ricordarmelo."]])),
    };
    Object.keys(FLAV).forEach((ch) => { OBJ[ch] = () => say("voce", pickDay(FLAV[ch], ch)); });
    Z.onObj = function (ch) { const f = OBJ[ch]; if (!f) return false; go(f)(); return true; };

    function exitStadium() { api.trExitTo(null, "stadio"); }
    Z.menu = function () {
      const m = mem(), f = fund();
      api.trAsk("voce", `<b>${esc(STG[m.stage].n)}</b> · tappa ${m.stage}/4<br><span style="color:var(--dim)">${esc(STG[m.stage].s)} · Monete ${bal()} · Fondo del Molo ${f.avail}</span>`, [
        { label: m.stage >= 4 ? "Le finali dello Stadio" : "Bacheca dei lavori", sub: m.stage >= 4 ? "Gabbia, Coppa del Molo, Matchday Director" : `Prossima tappa: ${STG[m.stage + 1].n} · ${COST[m.stage + 1]} monete`, cls: "hot", fn: go(m.stage >= 4 ? finals : lavori) },
        { label: "Esci dallo Stadio", sub: "Sulla strada della costa", fn: go(exitStadium) },
      ]);
    };

    // ------------------------------------------------------------------ hook (solo i propri id; mai il getter dentro la funzione)
    const TALK = { sb_capo: capoMenu, sb_custode: custodeMenu, sb_mimmo: mimmoMenu, sb_delfina: delfinaMenu, sb_gennaro: gennaroMenu, sb_speaker: speakerMenu, sb_coro: coroMenu };
    const mine = (id) => api.trZone() === ID && Object.prototype.hasOwnProperty.call(TALK, id) && Z.npcs.some((n) => n.id === id);
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set); // con accessor (cage-borgo.js) la catena la fa il setter
    const prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      if (mine(id)) { go(TALK[id])(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
    const prevNews = window.trNewsHook;
    window.trNewsHook = function (id) {
      if (api.trZone() === ID && mine(id)) {
        if (id === "sb_capo") { const m = mem(), f = fund(); return !m.scene[m.stage] || (m.stage < 4 && (bal() >= COST[m.stage + 1] || f.avail >= COST[m.stage + 1])); }
        if (id === "sb_gennaro") { const m = mem(); return m.day.stk !== today() && m.stk.length < STK.length; }
        return !talkedToday(id);
      }
      return typeof prevNews === "function" ? prevNews(id) : null;
    };

    // ------------------------------------------------------------------ ingresso
    function enter(o) {
      o = o || {};
      state.fromBorgo = o.fromBorgo !== false;
      const m = mem(), tr = api.trRec(), lines = [];
      m.visit = (m.visit | 0) + 1;
      for (let s = 0; s <= m.stage; s++) if (!m.scene[s]) { m.scene[s] = 1; SC[s].forEach(([w, t]) => lines.push([w, t])); }
      memSet(m);
      tr.seen[ID] = true; if (tr.pos) delete tr.pos[ID];
      const cos = state.pendingCos || []; state.pendingCos = null;
      if (cos.length) lines.push(["voce", `Nuovo in guardaroba: ${cos.join(", ")}.`]);
      api.trGo(ID);
      if (lines.length) scene(lines, () => { resume(); api.trToast(`Stadio del Borgo · ${STG[m.stage].n}`); });
    }
    window.__stadioBorgo.enter = enter;
    window.__stadioBorgo.info = () => { const m = mem(), f = fund(); return { stage: m.stage, name: STG[m.stage].n, next: m.stage < 4 ? COST[m.stage + 1] : 0, fund: f.avail, finals: m.finals, flags: m.flags.length, stickers: m.stk.length }; };

    // voce nel menu del Borgo
    const MN = api.MN_BORGO_BTN;
    if (Array.isArray(MN) && !MN.some((f) => f && f.__stadio)) {
      const f = () => {
        const m = mem();
        return { label: "🏟️ Stadio del Borgo", sub: `${STG[m.stage].n} · tappa ${m.stage}/4${m.stage < 4 ? " · prossima: " + COST[m.stage + 1] + " monete" : " · finali di Gabbia, Coppa e Director"}`, cls: m.stage >= 4 ? "hot" : "", fn: () => enter({ fromBorgo: false }) };
      };
      f.__stadio = 1; MN.push(f);
    }
    if (DEBUG) window.__stadioBorgo._dbg = { Z, KEY, mem, memSet, fund, buildStage, lavori, finals, OBJ, TALK, FIN, COST, STG, TOWERS, ITEMS, SC, CHAT, get map() { return cur; }, get stage() { return ST; }, exitStadium, stickerToday, buyFlag, botteghino, gennaroMenu };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
