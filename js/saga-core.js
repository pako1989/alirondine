// js/saga-core.js - MOTORE SAGA COMUNE
// Nasce dai motori delle ultime saghe (Libro dei Finali, Doppio Turno, Cristalli del Campo, Il Muro): stessa ossatura
// (salvataggio proprio, capitoli, zone camminabili sul motore TRZ di game.js, dialoghi, diario, finali, menu, uscita),
// ma ogni pezzo si può sostituire o allargare. Non limita la saga: tutto ciò che non serve si ignora, tutto ciò che serve
// di nuovo si aggiunge con un gancio (tessere, atmosfere, oggetti, meccaniche di zona, diario, menu, partite).
//
//   const E = window.__sagaCore.create({
//     id: "vento", key: "ali-di-rondine.vento", title: "La Valle del Vento Gentile", icon: "🍃", bg: "ve_valle", chapters: 3,
//     stats: { fiducia: [-9, 9, 0] },            // numeri propri della saga (salvati e controllati)
//     regions: { valle: { grass: [...], path: [...], stone: [...], wall: [...], water: [...], tall, tint, tintA, fx: "petals", dark } },
//     floors: "~", solid: "M", paint: { M(K, sx, sy, tx, ty, fr) {...} },  // tessere nuove o ridisegnate
//     floorPaint(K, f, sx, sy, tx, ty) { return false },                      // pavimenti propri (true = disegnato)
//     mood(g, fr, K) {},                                                      // atmosfera extra sopra quella comune
//     theme: { accent: "#7ab86a", ink: "#f4efe0", paper: "rgba(20,30,24,.84)", font: "Georgia, serif" },
//     heroLook(h, K) { return { shirt: "#..." } },
//     journal: { name: "Il Quaderno", sub: "...", html(K) { return "..." } },
//     endings: { id: ["TITOLO", "descrizione", "indizio"] },
//     mainExtra(K) { return [{ label, sub, fn }] }, zoneMenuExtra(K) { return [...] },
//     plugins: [{ zone(zid, spec, Z, K), tick(zid, spec, px, py, dt, K), top(g, zid, spec, cx, cy, d, K), enter(zid, spec, K) }],
//     rest: { ch: "s", label: "Riposa", text: "..." },
//   });
//   E.addChapter((K) => ({ n: 1, title, sub, goal(step), intro(), start: "zona", zones: {...}, patch: {...}, talk: {...}, obj: {...}, news(id, step) }));
//   window.__vento = E.api;   // { open, menuEntry, endings, info, addChapter, ... }
//
// Novità del motore rispetto alle saghe precedenti (da usare se servono):
//  - CASE DEGLI SCENARI: nel build, L.house(x, y, w, h, { door, enter }) dove enter è
//      "testo"                                   → la porta dà solo una descrizione
//      { room: "casa"|"bottega"|"mulino"|"locanda", name, who: [{ id, at }], id, chest, flavor } → si entra in una stanza
//                                                  arredata in automatico (diversa per ogni casa), con i personaggi da parlarci
//      { to: "zona", at: [tx, ty] }              → si entra in un interno disegnato a mano
//  - PROVE: K.evidence(id, { t, d, icon }) le definisce, K.giveClue(id) le dà, K.hasClue(id); K.present({ who, prompt, ok: [id], right(id), wrong(id), bg })
//    apre la scelta «Presenta la prova» (stile aula di tribunale): si sceglie un indizio tra quelli raccolti. Si leggono nel diario.
//  - COMMISSIONI: K.quest(id, titolo, descrizione) per darle, K.questDone(id) per chiuderle; si leggono nel diario.
//  - INTERNI: si entra davvero nelle case. Nella zona esterna spec.doors = { "x,y": "id_interno" } (o { to, at, locked(K) }),
//    l'interno è una zona con interior: true; la freccia «v» (o spec.exits) riporta fuori, davanti alla porta giusta.
//    Arredi pronti per gli interni: B letto · H camino · D credenza · T tavolo · L libreria · W parete con finestra.
//  - ORA DEL GIORNO: spec.time = "alba" | "giorno" | "tramonto" | "notte" (o una funzione del passo): luci e colori cambiano.
//  - VIAGGIO RAPIDO: cfg.travel = true e spec.travel = [tx, ty]: dal menu si torna nei luoghi già visitati.
//  - «NELLA PUNTATA PRECEDENTE»: chi torna dopo qualche ora ritrova tre righe di riassunto.
//  - MUSICHE: cfg.music = { tema: { bpm, chords, lead, bass, arp, drum… } } (stesso formato dei temi di game.js), cfg.musicMain = tema
//    delle zone e delle scene della saga (gli sfondi col prefisso di cfg.bg); spec.music cambia il tema di una zona; o.music in una partita.
//  - OSPITI DA ALTRE SAGHE: cfg.cameos = [{ id, zone, at: [tx, ty], when(K), lines: [[chi, testo], …] | talk(K) }]. Un personaggio
//    di un'altra saga compare solo se quella saga l'hai già giocata (K.otherSaga("ali-di-rondine.muro") legge il suo salvataggio).
//  - EPOCHE DELLE ZONE: spec.eras = { nome: { label, build(L, K), npcs(s), region, time, filter: "bn"|"seppia"|"anni70"|"pixel" } }.
//    K.setEra(zid, nome) (o null per il presente) ricostruisce la zona com'era allora, nello stesso punto; K.eraOf(zid).
//  - FILTRI D'EPOCA: K.filter(g, nome) colora qualsiasi tela (anche le partite): bianco e nero muto, seppia, anni '70, pixel 8-bit.
//  - FINALI CON INDIZIO: endings: { id: [titolo, descrizione, indizio] }; l'indizio si legge nel diario e nell'Album.
// Kit di partita: window.__sagaCore.pitch(o) è una partitella 2+portiere contro 2+portiere, con levetta, TIRA e PASSA,
// presentazione, intervallo e risultato, tutta personalizzabile con ganci (vento, regole, filtri, ostacoli, eventi).
(function () {
  "use strict";
  if (window.__sagaCore) return;

  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; return h >>> 0; };
  const rnd = (tx, ty, k) => hash(tx * 73 + ty * 131 + (k || 0) * 17) / 4294967296;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const frNow = () => Math.floor(performance.now() / 16);

  // ------------------------------------------------------------------ audio sintetico (niente file)
  let actx = null;
  function ac() { if (!actx && (window.AudioContext || window.webkitAudioContext)) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (actx && actx.state === "suspended") safe(() => actx.resume()); return actx; }
  const muted = () => safe(() => { const s = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni") || "{}"); return s.sfx === false || s.sound === false; }, false);
  function tone(f, d, type, vol, when, slide) { const c = ac(); if (!c || muted()) return; safe(() => { const t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02); }); }
  function noise(d, vol, hp) { const c = ac(); if (!c || muted()) return; safe(() => { const n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), x = b.getChannelData(0); for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = b; f.type = "highpass"; f.frequency.value = hp || 800; g.gain.value = vol || 0.05; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); }); }
  const SFX0 = {
    chest: () => [330, 415, 494].forEach((f, i) => tone(f, 0.12, "triangle", 0.06, i * 0.08)),
    ding: () => [880, 988, 1175].forEach((f, i) => tone(f, 0.08, "triangle", 0.05, i * 0.05)),
    choice: () => { tone(523, 0.18, "triangle", 0.05); tone(784, 0.3, "sine", 0.04, 0.12); },
    warn: () => tone(220, 0.25, "square", 0.04, 0, 180),
    rest: () => [392, 494, 587, 784].forEach((f, i) => tone(f, 0.3, "sine", 0.04, i * 0.12)),
    end: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.45, "triangle", 0.05, i * 0.16)),
    step: () => tone(70, 0.2, "sine", 0.08, 0, 50),
    wind: () => noise(0.8, 0.03, 600),
  };

  // ------------------------------------------------------------------ tessere comuni
  // Pavimenti: , erba/terra · : sentiero · + lastre · - campo · " tappeto · = assi · ; erba alta
  // Solidi: a muro · t albero · r roccia · y casa · q porta · w acqua · s punto di riposo · x baule · f staccionata · l lanterna
  //         b panca · g porta da calcio · j tribuna · n cartello · p colonna · z casse · u bancarella · fiori e frecce di uscita > < ^ v
  const FLOORS0 = ',:+-"=;';
  // DIFFICOLTÀ di ogni saga (si sceglie al primo avvio, si cambia dal menu): velocità e furbizia degli avversari, parate, monete
  const DIFFS = {
    storia: { label: "Storia", sub: "Per goderti la trama: avversari più lenti e meno precisi, il tuo portiere para di più", opp: 0.88, steal: 0.6, shot: 0.7, gk0: 0.15, gk1: -0.08, team: 0.82, coins: 1 },
    normale: { label: "Normale", sub: "L'equilibrio pensato per la saga", opp: 1, steal: 1, shot: 1, gk0: 0, gk1: 0, team: 0.95, coins: 1 },
    sfida: { label: "Sfida", sub: "Avversari più veloci e cattivi, il portiere para meno · monete × 1,5", opp: 1.1, steal: 1.3, shot: 1.15, gk0: -0.1, gk1: 0.08, team: 1.08, coins: 1.5 },
  };
  // il «carattere» degli avversari nelle partite del kit: equilibrata, pressing, difensiva, contropiede (e si adatta al punteggio)
  const STYLES = { equilibrata: "equilibrati", pressing: "pressing alto", difensiva: "tutti dietro", contropiede: "contropiede" };
  let CUR = { diff: "normale", style: "" };
  const SOLID0 = "atryqwsxflbgjnpzuBHDTLW";
  const REG0 = { grass: ["#4a7a3a", "#527f3f", "#467036"], path: ["#9a8a64", "#8e7e5a"], stone: ["#8a8a80", "#808076"], wall: ["#6a5a4a", "#5e4e40"], water: ["#2a5a7a", "#30648a"], tall: "#5f8a45", tint: "255,230,190", tintA: 0.08, fx: "", dark: 0.12 };

  // filtri d'epoca: si applicano a qualsiasi tela già disegnata (mondo camminabile, partite, scene)
  let PIX = null;
  function filter(g, kind, W, H) {
    W = W || 320; H = H || 200; const fr = frNow();
    if (kind === "bn" || kind === "seppia") {
      g.save(); g.globalCompositeOperation = "saturation"; g.fillStyle = "#808080"; g.fillRect(0, 0, W, H);
      if (kind === "seppia") { g.globalCompositeOperation = "color"; g.fillStyle = "rgba(160,120,70,.45)"; g.fillRect(0, 0, W, H); }
      g.restore(); g.save(); // pellicola: graffi, polvere, tremolio della luce
      g.fillStyle = `rgba(255,250,235,${0.03 + 0.03 * Math.sin(fr / 3)})`; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 3; i++) { const x = (hash(Math.floor(fr / 4) * 7 + i) % W); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x, 0, 1, H); }
      for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(20,15,10,.35)"; g.fillRect(hash(fr * 13 + i) % W, hash(fr * 7 + i * 3) % H, 1.5, 1.5); }
      const vg = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.85); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H); g.restore();
    } else if (kind === "anni70") {
      g.save(); g.globalCompositeOperation = "soft-light"; g.fillStyle = "rgba(255,150,60,.35)"; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "saturation"; g.fillStyle = "rgba(255,0,0,.25)"; g.fillRect(0, 0, W, H); g.restore();
      g.save(); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(${i % 2 ? "255,240,200" : "40,20,10"},.08)`; g.fillRect(hash(fr * 11 + i) % W, hash(fr * 5 + i * 7) % H, 2, 2); }
      const vg = g.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(40,20,0,.45)"); g.fillStyle = vg; g.fillRect(0, 0, W, H); g.restore();
    } else if (kind === "pixel") {
      const cv = g.canvas, k = 4, w = Math.max(1, Math.floor(cv.width / k)), h = Math.max(1, Math.floor(cv.height / k));
      if (!PIX || PIX.width !== w || PIX.height !== h) { PIX = document.createElement("canvas"); PIX.width = w; PIX.height = h; PIX.g = PIX.getContext("2d"); }
      PIX.g.imageSmoothingEnabled = true; PIX.g.clearRect(0, 0, w, h); PIX.g.drawImage(cv, 0, 0, w, h);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(PIX, 0, 0, cv.width, cv.height); g.restore();
      g.save(); g.globalCompositeOperation = "saturation"; g.fillStyle = "rgba(255,0,0,.35)"; g.fillRect(0, 0, W, H); g.restore();
      g.save(); g.fillStyle = "rgba(0,0,0,.12)"; for (let y = 0; y < H; y += 2) g.fillRect(0, y, W, 1); g.restore();
    }
  }

  function create(cfg) {
    cfg = obj(cfg);
    const ID = String(cfg.id || "saga"), KEY = cfg.key || "ali-di-rondine." + ID, TS = 16, NCH = cfg.chapters || 3, TITLE = cfg.title || "Saga", ICON = cfg.icon || "📖", BG0 = cfg.bg || "title";
    const TH = Object.assign({ accent: "#e8c46a", ink: "#f4efe0", paper: "rgba(18,20,26,.84)", font: "Georgia, serif", chipBg: "#2a2c34ee", chipBorder: "#8a8070" }, obj(cfg.theme));
    let api = null, tries = 0, EXIT = null, inMatch = false;
    const SFX = Object.assign({}, SFX0, obj(cfg.sfx));

    // -------------------------------------------------------------- salvataggio
    const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
    const STATS = obj(cfg.stats), LORE = {}, ENDINGS = Object.assign({}, obj(cfg.endings));
    function norm(o) {
      o = obj(o);
      const m = { v: 1, ch: clampI(o.ch, 1, 9, 1), step: {}, flags: {}, rew: {}, done: {}, zone: "", log: [], intro: {}, ends: [], lore: [], wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0), last: clampI(o.last, 0, 1e14, 0), st: {}, diff: DIFFS[o.diff] ? o.diff : "normale", diffSet: !!o.diffSet };
      Object.keys(STATS).forEach((k) => { const [a, b, d] = STATS[k]; m.st[k] = clampI(obj(o.st)[k], a, b, d); });
      const st = obj(o.step); Object.keys(st).slice(0, 20).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
      const fl = obj(o.flags); let c = 0;
      Object.keys(fl).forEach((k) => { if (c >= 400 || !FLAG_RE.test(k)) return; const v = fl[k]; if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v)) || (typeof v === "string" && v.length <= 40)) { m.flags[k] = v; c++; } });
      Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 250) m.rew[k] = 1; });
      const dn = obj(o.done); Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n && typeof dn[k] === "string" && dn[k].length <= 24) m.done[n] = dn[k]; });
      m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
      m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 220)).slice(-80);
      Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
      m.ends = [...new Set(arr(o.ends).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 16);
      m.lore = [...new Set(arr(o.lore).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 60);
      return m;
    }
    let MEM = null;
    const mem = () => MEM || (MEM = norm(safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {})));
    const save = () => { safe(() => localStorage.setItem(KEY, JSON.stringify(mem()))); };
    const reload = () => { MEM = null; return mem(); };
    const F = {
      get: (k, d) => { const v = mem().flags[k]; return v === undefined ? d : v; },
      set: (k, v) => { if (FLAG_RE.test(k)) { mem().flags[k] = v; save(); } },
      is: (k) => !!mem().flags[k],
      add: (k, n) => { const v = (+mem().flags[k] || 0) + (n || 1); F.set(k, v); return v; },
    };
    const stepOf = (ch) => mem().step[ch] | 0;
    const setStep = (ch, n) => { mem().step[ch] = clampI(n, 0, 99, 0); save(); };
    const note = (txt) => { const m = mem(); if (!m.log.includes(txt)) { m.log.push(txt); if (m.log.length > 80) m.log.shift(); save(); } };
    const once = (key, fn) => { const m = mem(); if (m.rew[key]) return false; m.rew[key] = 1; save(); fn(); return true; };
    const stat = (k) => mem().st[k] | 0;
    const bond = (k, d) => { const m = mem(), s = STATS[k]; if (!s) return 0; m.st[k] = Math.max(s[0], Math.min(s[1], (m.st[k] | 0) + d)); save(); return m.st[k]; };

    // -------------------------------------------------------------- il Campione
    const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
    function T(s) {
      const h = hero() || { name: "Campione", num: 9, shotName: "il tuo tiro" };
      return String(s).replace(/\{n\}/g, () => h.name).replace(/\{num\}/g, () => h.num).replace(/\{tiro\}/g, () => h.shotName || "il tuo tiro");
    }
    function castHero() {
      const h = hero(), C = api && api.CAST; if (!h || !C) return;
      const extra = cfg.heroLook ? obj(safe(() => cfg.heroLook(h, K), {})) : {};
      C.hero = Object.assign({}, C.hero || {}, { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye, bg: ["#1a1c24", TH.accent], shirt: h.shirt, num: String(h.num), acc: h.acc, accId: h.accId, cap: h.acc === "cappellino" ? "#ffd23f" : h.acc === "berretto" ? "#26324a" : undefined }, extra);
    }
    const coinsGive = (n) => (n > 0 && typeof window.addCoins === "function" ? safe(() => { window.addCoins(n); return n; }, 0) : 0);
    const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

    // -------------------------------------------------------------- epoche e filtri
    const eraOf = (zid) => { const e = F.get("era_" + zid, ""); const z = ZONES[zid]; return e && z && z.spec.eras && z.spec.eras[e] ? e : null; };
    const eraSpec = (zid) => { const e = eraOf(zid); return e ? ZONES[zid].spec.eras[e] : null; };
    // -------------------------------------------------------------- tessere
    const REG = {}; Object.keys(obj(cfg.regions)).forEach((k) => { REG[k] = Object.assign({}, REG0, cfg.regions[k]); }); if (!Object.keys(REG).length) REG.base = Object.assign({}, REG0);
    const REG_FIRST = Object.keys(REG)[0];
    if (!REG.casa && !REG.interno) REG.interno = Object.assign({}, REG0, { wall: ["#c8a87a", "#bc9c6e"], stone: ["#b8a890", "#ac9c84"], path: ["#c8a878", "#bc9c6c"], tint: "255,210,150", tintA: 0.1, fx: "dust", dark: 0.16 }); // stanze automatiche
    const FLOORS = FLOORS0 + (cfg.floors || ""), SOLID = (SOLID0 + (cfg.solid || "")).split("").filter((c) => !FLOORS.includes(c)).join("");
    const isFloor = (ch) => !!ch && FLOORS.includes(ch);
    const ZX = { map: null, under: null, meta: null, id: "", rg: REG[REG_FIRST], rk: REG_FIRST, lights: [], decor: [], spec: null };
    const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
    const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
    let GP = null;
    const ctx = () => GP || (GP = document.getElementById("cv").getContext("2d"));
    const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
    function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
    const light = (x, y, r, rgb, a) => { if (ZX.lights.length < 60) ZX.lights.push([x, y, r, rgb, a]); };
    const shadow = (sx, sy, w) => { GP.fillStyle = "rgba(0,0,0,.25)"; GP.beginPath(); GP.ellipse(sx + 9, sy + 14, w || 7, 2.6, 0, 0, 7); GP.fill(); };
    const later = (fn) => { if (ZX.decor.length < 80) ZX.decor.push(fn); }; // disegna sopra le tessere (per oggetti alti: statue, mulini, alberi grandi)

    function floorPaint(f, sx, sy, tx, ty) {
      if (cfg.floorPaint && cfg.floorPaint(K, f, sx, sy, tx, ty)) return;
      const R = ZX.rg, r = rnd(tx, ty, 1);
      if (f === ",") { P(sx, sy, 16, 16, R.grass[hash(tx * 3 + ty * 7) % R.grass.length]); for (let i = 0; i < 4; i++) P(sx + ((tx * 5 + i * 4) % 15), sy + ((ty * 7 + i * 5) % 13), 1, 3, "rgba(0,0,0,.14)"); if (r < 0.05) P(sx + 5, sy + 6, 2, 2, "rgba(255,250,220,.7)"); }
      else if (f === ":") { P(sx, sy, 16, 16, R.path[(tx + ty) % 2]); for (let i = 0; i < 3; i++) P(sx + ((tx * 7 + i * 5) % 14), sy + ((ty * 5 + i * 6) % 14), 2, 1, "rgba(0,0,0,.18)"); if (undAt(tx, ty - 1) !== ":" && at(tx, ty - 1) !== ":") P(sx, sy, 16, 1, "rgba(0,0,0,.12)"); }
      else if (f === "+") { P(sx, sy, 16, 16, R.stone[(tx + ty) % 2]); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.18)"); P(sx + 15, sy, 1, 16, "rgba(0,0,0,.14)"); P(sx, sy, 16, 1, "rgba(255,255,255,.1)"); if (r < 0.12) P(sx + 4, sy + 6, 5, 1, "rgba(0,0,0,.2)"); }
      else if (f === "-") { P(sx, sy, 16, 16, tx % 2 ? "#4f8a3e" : "#57943f"); for (let i = 0; i < 3; i++) P(sx + ((tx * 5 + i * 5) % 15), sy + ((ty * 7 + i * 4) % 13), 1, 3, "rgba(255,255,255,.1)"); }
      else if (f === '"') { P(sx, sy, 16, 16, "#6a2a2a"); P(sx, sy + 1, 16, 1, "rgba(232,196,106,.45)"); P(sx, sy + 14, 16, 1, "rgba(232,196,106,.45)"); }
      else if (f === "=") { P(sx, sy, 16, 16, "#7a5a3a"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.25)"); P(sx, sy, 16, 1, "#9a7a4a"); }
      else if (f === ";") { P(sx, sy, 16, 16, R.grass[hash(tx * 3 + ty * 7) % R.grass.length]); const fr = frNow(), sw = Math.sin(fr / 30 + tx * 0.7 + ty) * 1.5 + (ZX.wind || 0); for (let i = 0; i < 7; i++) { const x = sx + 1 + i * 2.2 + ((tx + i) % 2), h = 10 + ((tx * 3 + i * 5 + ty) % 6); GP.strokeStyle = i % 2 ? R.tall : "#4a7034"; GP.lineWidth = 1.4; GP.beginPath(); GP.moveTo(x, sy + 15); GP.quadraticCurveTo(x + sw * 0.5, sy + 15 - h * 0.6, x + sw, sy + 15 - h); GP.stroke(); } }
      else P(sx, sy, 16, 16, R.grass[0]);
    }
    function houseTile(sx, sy, tx, ty) {
      const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx], R = ZX.rg;
      if (!m) { P(sx, sy, 16, 16, R.wall[0]); return; }
      const o = m.o, roof = o.roof || "#8a4a3a", wall = o.wall || "#d8c8a8";
      if (m.ry < o.rr) {
        P(sx, sy, 16, 16, roof); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(0,0,0,.22)"); for (let i = 0; i < 16; i += 4) P(sx + i + (m.ry % 2) * 2, sy, 1, 16, "rgba(0,0,0,.1)");
        if (m.ry === 0) P(sx, sy, 16, 2, "rgba(255,255,255,.18)"); if (m.ry === o.rr - 1) P(sx, sy + 13, 16, 3, "rgba(0,0,0,.35)");
        if (o.chimney && m.rx === o.w - 2 && m.ry === 0) { P(sx + 4, sy - 6, 6, 10, "#5a4a3a"); const f = frNow(); for (let i = 0; i < 3; i++) { GP.fillStyle = `rgba(220,220,220,${0.35 - i * 0.1})`; GP.beginPath(); GP.arc(sx + 7 + Math.sin(f / 20 + i) * 2 + (ZX.wind || 0) * i, sy - 10 - i * 5 - (f / 6 % 5), 2 + i, 0, 7); GP.fill(); } }
        return;
      }
      P(sx, sy, 16, 16, wall); P(sx, sy, 16, 1, "rgba(0,0,0,.2)");
      if (o.timber) { P(sx, sy + 7, 16, 2, o.timber); if (m.rx % 2 === 0) P(sx, sy, 2, 16, o.timber); }
      const win = m.rx > 0 && m.rx < o.w - 1 && m.rx % 2 === 1 && !(o.door && o.door[0] === tx && o.door[1] === ty);
      if (win) { const lit = o.lit != null ? o.lit : rnd(tx, ty, 5) < 0.5; P(sx + 4, sy + 3, 8, 8, "#3a2a1a"); P(sx + 5, sy + 4, 6, 6, lit ? "#ffd98a" : "#7aa0c0"); P(sx + 7, sy + 4, 1, 6, "#3a2a1a"); P(sx + 5, sy + 7, 6, 1, "#3a2a1a"); if (o.flowers) { P(sx + 3, sy + 11, 10, 2, "#6a4a2a"); for (let i = 0; i < 4; i++) P(sx + 4 + i * 2.4, sy + 9, 2, 2, ["#e85a6a", "#ffd23f", "#f2f2f2", "#c77dff"][(tx + i) % 4]); } if (lit) light(sx + 8, sy + 7, 14, "255,210,130", 0.35); }
      if (m.rx === 0) P(sx, sy, 1, 16, "rgba(255,255,255,.12)"); if (m.rx === o.w - 1) P(sx + 15, sy, 1, 16, "rgba(0,0,0,.3)");
    }
    function arrowTile(ch, sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const b = Math.sin(frNow() / 8) * 1.5;
      GP.fillStyle = TH.accent; GP.strokeStyle = "rgba(0,0,0,.5)"; GP.lineWidth = 1; GP.beginPath();
      if (ch === ">") { GP.moveTo(sx + 4 + b, sy + 4); GP.lineTo(sx + 12 + b, sy + 8); GP.lineTo(sx + 4 + b, sy + 12); } else if (ch === "<") { GP.moveTo(sx + 12 - b, sy + 4); GP.lineTo(sx + 4 - b, sy + 8); GP.lineTo(sx + 12 - b, sy + 12); } else if (ch === "v") { GP.moveTo(sx + 4, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 12, sy + 4 + b); } else { GP.moveTo(sx + 4, sy + 12 - b); GP.lineTo(sx + 8, sy + 4 - b); GP.lineTo(sx + 12, sy + 12 - b); }
      GP.closePath(); GP.fill(); GP.stroke();
    }
    const ground = (sx, sy, tx, ty) => floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    const PAINT0 = {
      a(sx, sy, tx, ty) { const R = ZX.rg; P(sx, sy, 16, 16, R.wall[(tx + ty) % 2]); P(sx, sy + 7, 16, 1, "rgba(0,0,0,.25)"); P(sx + ((ty % 2) * 8), sy, 1, 7, "rgba(0,0,0,.2)"); P(sx + (((ty + 1) % 2) * 8), sy + 8, 1, 8, "rgba(0,0,0,.2)"); if (at(tx, ty - 1) !== "a") P(sx, sy, 16, 2, "rgba(255,255,255,.14)"); if (at(tx, ty + 1) !== "a") P(sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); },
      t(sx, sy, tx, ty, fr) { ground(sx, sy, tx, ty); shadow(sx, sy, 8); P(sx + 6, sy + 6, 4, 9, "#5a3e24"); const sw = Math.sin(fr / 60 + tx * 0.7) * 0.8 + (ZX.wind || 0) * 0.6, c = ZX.rg.tree || ["#2f5a2a", "#3e7032", "#5a9a44"]; GP.fillStyle = c[0]; GP.beginPath(); GP.arc(sx + 8 + sw, sy - 1, 8, 0, 7); GP.fill(); GP.fillStyle = c[1]; GP.beginPath(); GP.arc(sx + 7 + sw, sy - 3, 6.5, 0, 7); GP.fill(); GP.fillStyle = c[2]; GP.beginPath(); GP.arc(sx + 5 + sw, sy - 5, 3, 0, 7); GP.fill(); },
      r(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 7); GP.fillStyle = "#7a7a72"; GP.beginPath(); GP.ellipse(sx + 8, sy + 9, 7, 6, 0, 0, 7); GP.fill(); GP.fillStyle = "rgba(255,255,255,.2)"; GP.beginPath(); GP.ellipse(sx + 6, sy + 6, 3.5, 2.5, -0.4, 0, 7); GP.fill(); if (rnd(tx, ty, 3) < 0.4) P(sx + 4, sy + 12, 5, 2, "rgba(70,110,50,.6)"); },
      y: (sx, sy, tx, ty) => houseTile(sx, sy, tx, ty),
      q(sx, sy, tx, ty) { const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx]; P(sx, sy, 16, 16, (m && m.o.wall) || ZX.rg.wall[0]); P(sx + 3, sy + 2, 10, 14, "#5a3a22"); P(sx + 3, sy + 2, 10, 2, "#7a5a32"); P(sx + 8, sy + 2, 1, 14, "rgba(0,0,0,.35)"); P(sx + 10, sy + 9, 2, 2, "#e8c46a"); },
      w(sx, sy, tx, ty, fr) { const R = ZX.rg; P(sx, sy, 16, 16, R.water[(tx + ty) % 2]); const o = (fr / 3 + tx * 5 + ty * 3) % 16; P(sx + o - 4, sy + 4 + (ty % 2) * 6, 6, 1, "rgba(255,255,255,.3)"); if (at(tx, ty - 1) !== "w") P(sx, sy, 16, 2, "rgba(255,255,255,.3)"); },
      s(sx, sy, tx, ty, fr) { ground(sx, sy, tx, ty); shadow(sx, sy, 6); P(sx + 3, sy + 9, 10, 6, "#5a5a62"); P(sx + 2, sy + 8, 12, 2, "#7a7a82"); for (let i = 0; i < 3; i++) { const h = 4 + Math.abs(Math.sin(fr / 6 + i * 2)) * 4; P(sx + 4 + i * 3, sy + 8 - h, 2, h, i === 1 ? "#ffd36b" : "#ff8a3a"); } light(sx + 8, sy + 5, 24, "255,170,80", 0.45); },
      x(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 7); const open = ZX.chestOpen && ZX.chestOpen(tx, ty); P(sx + 2, sy + 6, 12, 8, "#7a4a24"); P(sx + 2, sy + 9, 12, 1, "#c9a227"); if (open) { P(sx + 2, sy + 2, 12, 4, "#4a2a14"); P(sx + 3, sy + 6, 10, 2, "#1a120a"); } else { P(sx + 2, sy + 3, 12, 4, "#8a5a2c"); P(sx + 7, sy + 7, 2, 3, "#ffd23f"); } },
      f(sx, sy, tx, ty) { ground(sx, sy, tx, ty); P(sx, sy + 6, 16, 2, "#8a6a40"); P(sx, sy + 10, 16, 2, "#8a6a40"); P(sx + 2, sy + 4, 2, 11, "#a07a48"); P(sx + 12, sy + 4, 2, 11, "#a07a48"); },
      l(sx, sy, tx, ty, fr) { ground(sx, sy, tx, ty); shadow(sx, sy, 3); P(sx + 7, sy + 2, 2, 13, "#3a3a3a"); P(sx + 4, sy - 2, 8, 6, "#2a2a2a"); P(sx + 5, sy - 1, 6, 4, "#ffd98a"); light(sx + 8, sy + 1, 24 + Math.sin(fr / 10 + tx) * 2, "255,200,110", 0.45); },
      b(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 7); P(sx + 1, sy + 6, 14, 3, "#8a6a40"); P(sx + 2, sy + 9, 2, 5, "#5a3a1a"); P(sx + 12, sy + 9, 2, 5, "#5a3a1a"); },
      g(sx, sy, tx, ty) { ground(sx, sy, tx, ty); P(sx + 2, sy + 2, 12, 12, "rgba(255,255,255,.18)"); for (let i = 3; i < 14; i += 3) { P(sx + i, sy + 2, 1, 12, "rgba(255,255,255,.45)"); P(sx + 2, sy + i, 12, 1, "rgba(255,255,255,.45)"); } P(sx + 1, sy + 1, 14, 2, "#f2f2f2"); },
      j(sx, sy, tx, ty, fr) { P(sx, sy, 16, 16, "#5a4a40"); P(sx, sy + 7, 16, 2, "rgba(0,0,0,.3)"); const c = ZX.standCol || ["#e85a4a", "#3fa7ff", "#ffd23f"]; for (let i = 0; i < 2; i++) for (let k = 0; k < 2; k++) { const jmp = (Math.floor(fr / 12) + tx + i) % 5 === 0 ? 1 : 0; P(sx + 2 + i * 7, sy + 2 + k * 8 - jmp, 5, 5, c[(tx + i + k) % c.length]); P(sx + 3 + i * 7, sy + 1 + k * 8 - jmp, 3, 2, "#e0b48a"); } },
      n(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 4); P(sx + 7, sy + 7, 2, 8, "#5a3a1a"); P(sx + 2, sy + 1, 12, 8, "#b08a5a"); P(sx + 2, sy + 1, 12, 1, "#d0aa7a"); P(sx + 4, sy + 4, 8, 1, "#3a2a10"); P(sx + 4, sy + 6, 6, 1, "#3a2a10"); },
      p(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 6); const c = ZX.rg.column || "#c8c0b0"; P(sx + 3, sy - 4, 10, 18, c); P(sx + 3, sy - 4, 3, 18, "rgba(255,255,255,.2)"); P(sx + 10, sy - 4, 3, 18, "rgba(0,0,0,.2)"); P(sx + 2, sy - 6, 12, 3, c); P(sx + 2, sy + 12, 12, 3, c); },
      z(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 7); if ((tx + ty) % 2) { P(sx + 3, sy + 3, 10, 12, "#7a5a34"); P(sx + 3, sy + 5, 10, 1, "#3a2a10"); P(sx + 3, sy + 11, 10, 1, "#3a2a10"); } else { P(sx + 2, sy + 4, 12, 10, "#9a7a4a"); P(sx + 2, sy + 4, 12, 1, "#ba9a6a"); P(sx + 7, sy + 4, 1, 10, "rgba(0,0,0,.3)"); } },
      u(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 8); P(sx + 1, sy + 7, 14, 7, "#7a5a30"); P(sx + 1, sy + 7, 14, 1, "#aa8a50"); const c = ["#e85a4a", "#ffd23f", "#7ab86a", "#f2e2c0"]; for (let i = 0; i < 3; i++) { GP.fillStyle = c[(tx + i) % 4]; GP.beginPath(); GP.arc(sx + 4 + i * 4, sy + 6, 2, 0, 7); GP.fill(); } P(sx, sy - 2, 16, 3, (tx % 2) ? "#e85a4a" : "#f2e2c0"); },
      // arredi degli interni
      B(sx, sy, tx, ty) { ground(sx, sy, tx, ty); const top = at(tx, ty - 1) !== "B"; P(sx + 1, sy + (top ? 2 : 0), 14, top ? 14 : 13, "#8a5a32"); if (top) { P(sx + 2, sy + 3, 12, 5, "#f4efe0"); P(sx + 2, sy + 7, 12, 1, "rgba(0,0,0,.15)"); } else { P(sx + 2, sy, 12, 11, ZX.spec && ZX.spec.quilt || "#c85a5a"); for (let i = 0; i < 3; i++) P(sx + 3 + i * 4, sy + 2, 2, 8, "rgba(255,255,255,.18)"); P(sx + 1, sy + 13, 14, 2, "#5a3a1a"); } },
      H(sx, sy, tx, ty, fr) { P(sx, sy, 16, 16, "#8a7a6a"); P(sx, sy, 16, 3, "#6a5a4a"); P(sx + 2, sy + 5, 12, 11, "#2a1a14"); for (let i = 0; i < 3; i++) { const h = 3 + Math.abs(Math.sin(fr / 5 + i * 2)) * 5; P(sx + 4 + i * 3, sy + 15 - h, 2, h, i === 1 ? "#ffd36b" : "#ff7a2a"); } P(sx + 3, sy + 14, 10, 2, "#5a3a1a"); light(sx + 8, sy + 12, 30, "255,150,60", 0.5); },
      D(sx, sy, tx, ty) { ground(sx, sy, tx, ty); P(sx + 1, sy - 4, 14, 19, "#7a4a2a"); P(sx + 2, sy - 3, 12, 6, "#5a3418"); for (let i = 0; i < 4; i++) { GP.fillStyle = ["#f4efe0", "#7ab8d8", "#e8c46a", "#c85a5a"][(tx + i) % 4]; GP.beginPath(); GP.arc(sx + 4 + i * 2.7, sy, 1.4, 0, 7); GP.fill(); } P(sx + 2, sy + 4, 6, 10, "#8a5a32"); P(sx + 8, sy + 4, 6, 10, "#8a5a32"); P(sx + 7, sy + 8, 1, 2, "#e8c46a"); P(sx + 8, sy + 8, 1, 2, "#e8c46a"); },
      T(sx, sy, tx, ty) { ground(sx, sy, tx, ty); shadow(sx, sy, 7); P(sx + 1, sy + 3, 14, 8, "#a07040"); P(sx + 1, sy + 3, 14, 1, "#c09060"); P(sx + 2, sy + 11, 2, 4, "#6a4a24"); P(sx + 12, sy + 11, 2, 4, "#6a4a24"); if (rnd(tx, ty, 2) < 0.5) { P(sx + 5, sy + 4, 5, 3, "#f4efe0"); P(sx + 6, sy + 5, 3, 1, "#c85a5a"); } else { P(sx + 9, sy + 2, 3, 4, "#7ab8d8"); P(sx + 4, sy + 5, 4, 2, "#e8c46a"); } },
      L(sx, sy, tx, ty) { P(sx, sy, 16, 16, "#5a3a20"); for (let i = 0; i < 3; i++) { P(sx + 1, sy + 1 + i * 5, 14, 4, "#2a1a10"); for (let k = 0; k < 6; k++) P(sx + 2 + k * 2.2, sy + 1 + i * 5 + (k % 3 === 0 ? 1 : 0), 1.8, 4 - (k % 3 === 0 ? 1 : 0), ["#a8322a", "#e8c46a", "#3a6a8a", "#5a8a4a", "#d8c8a0"][(tx + i + k) % 5]); } },
      W(sx, sy, tx, ty, fr) { PAINT.a(sx, sy, tx, ty); const night = timeNow() === "notte"; P(sx + 3, sy + 2, 10, 10, "#5a3a20"); P(sx + 4, sy + 3, 8, 8, night ? "#1a2a4a" : timeNow() === "tramonto" ? "#ffb070" : "#a8d8f0"); P(sx + 7, sy + 3, 1, 8, "#5a3a20"); P(sx + 4, sy + 6, 8, 1, "#5a3a20"); if (night) P(sx + 5, sy + 4, 1, 1, "#fff"); else light(sx + 8, sy + 14, 16, "255,240,200", 0.25); P(sx + 2, sy + 12, 12, 2, "#7a5a32"); },
      ">": (sx, sy, tx, ty) => arrowTile(">", sx, sy, tx, ty), "<": (sx, sy, tx, ty) => arrowTile("<", sx, sy, tx, ty), "^": (sx, sy, tx, ty) => arrowTile("^", sx, sy, tx, ty), v: (sx, sy, tx, ty) => arrowTile("v", sx, sy, tx, ty),
    };
    const PAINT = Object.assign({}, PAINT0);
    Object.keys(obj(cfg.paint)).forEach((ch) => { const fn = cfg.paint[ch]; PAINT[ch] = (sx, sy, tx, ty, fr) => fn(K, sx, sy, tx, ty, fr); });
    function drawTile(ch, sx, sy, tx, ty) {
      ctx();
      if (isFloor(ch) && !cfg.paint?.[ch]) { floorPaint(ch, sx, sy, tx, ty); return true; }
      const fn = PAINT[ch]; if (fn) { fn(sx, sy, tx, ty, frNow()); return true; }
      floorPaint(",", sx, sy, tx, ty); return true;
    }
    function makeLayers(w, h, base) {
      const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(base || ",")), meta = Array.from({ length: h }, () => Array(w).fill(null));
      ZX.under = u; ZX.meta = meta;
      const put = (x, y, ch) => { if (m[y] && x >= 0 && x < w) { m[y][x] = ch; if (isFloor(ch)) u[y][x] = ch; } };
      const lay = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, ch); };
      const autos = [];
      const house = (x, y, hw, hh, o) => { o = Object.assign({ w: hw, h: hh, rr: Math.max(1, Math.floor(hh / 2)) }, o || {}); if (o.enter && o.door) autos.push({ x: o.door[0], y: o.door[1], def: o.enter }); for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < hw; xx++) { put(x + xx, y + yy, "y"); if (meta[y + yy]) meta[y + yy][x + xx] = { o, rx: xx, ry: yy }; } if (o.door) { put(o.door[0], o.door[1], o.door[2] || "q"); if (meta[o.door[1]]) meta[o.door[1]][o.door[0]] = { o, rx: o.door[0] - x, ry: o.door[1] - y }; } };
      const tag = (x, y, data) => { if (meta[y]) meta[y][x] = Object.assign({}, meta[y][x] || {}, { tag: data }); }; // dati liberi su una tessera (es. «questo mulino è il n. 3»)
      return { lay, put, house, tag, w, h, under: u, meta, autos };
    }

    // -------------------------------------------------------------- atmosfera
    let BLUR = null; const PART = []; const FX = { enter: -999, title: "" };
    function particles(g, fr, kind) {
      while (PART.length < 34) PART.push({ x: Math.random() * 320, y: Math.random() * 200, s: Math.random(), p: Math.random() * 6.28 });
      const wnd = ZX.wind || 0;
      if (kind === "rain") { g.strokeStyle = "rgba(170,190,230,.32)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 46; i++) { const x = (i * 47 + fr * 1.6) % 340 - 10, y = (i * 71 + fr * 5) % 210 - 5; g.moveTo(x, y); g.lineTo(x - 2 + wnd, y + 7); } g.stroke(); return; }
      PART.forEach((p) => {
        if (kind === "wind") { p.x += 1.2 + p.s * 1.6 + wnd; p.y += Math.sin(fr / 30 + p.p) * 0.3; g.fillStyle = p.s > 0.5 ? "rgba(255,255,255,.28)" : "rgba(220,210,180,.6)"; g.fillRect(p.x, p.y, p.s > 0.5 ? 9 + p.s * 8 : 2, 1); }
        else if (kind === "fog") { if (p.s > 0.45) return; p.x += 0.15 + p.s * 0.2; g.fillStyle = `rgba(225,230,225,${0.03 + p.s * 0.05})`; g.beginPath(); g.ellipse(p.x, p.y, 40 + p.s * 30, 10 + p.s * 6, 0, 0, 7); g.fill(); }
        else if (kind === "snow") { p.y += 0.3 + p.s * 0.5; p.x += Math.sin(fr / 40 + p.p) * 0.4 + wnd * 0.5; g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(p.x, p.y, 1 + (p.s > 0.6), 1 + (p.s > 0.6)); }
        else if (kind === "petals" || kind === "leaves") { p.y += 0.25 + p.s * 0.35; p.x += Math.sin(fr / 35 + p.p) * 0.6 + 0.3 + wnd; g.save(); g.translate(p.x, p.y); g.rotate(fr / 30 + p.p); g.fillStyle = kind === "petals" ? (p.s > 0.5 ? "rgba(255,200,215,.9)" : "rgba(255,240,245,.9)") : (p.s > 0.5 ? "rgba(220,160,60,.85)" : "rgba(150,170,60,.85)"); g.beginPath(); g.ellipse(0, 0, 2.4, 1.2, 0, 0, 7); g.fill(); g.restore(); }
        else if (kind === "float") { p.x += Math.sin(fr / 90 + p.p) * 0.25 + (p.s - 0.5) * 0.2; p.y += Math.cos(fr / 110 + p.p * 2) * 0.22; g.save(); g.translate(p.x, p.y); g.rotate(fr / 60 * (p.s - 0.5) + p.p); g.fillStyle = p.s > 0.7 ? "rgba(200,240,255,.55)" : p.s > 0.35 ? "rgba(255,220,150,.45)" : "rgba(180,190,210,.4)"; g.fillRect(-1, -1, p.s > 0.7 ? 2 : 3, p.s > 0.7 ? 2 : 1.5); g.restore(); if (p.y < -5) p.y = 204; }
        else if (kind === "fireflies") { p.x += Math.sin(fr / 50 + p.p) * 0.4; p.y += Math.cos(fr / 60 + p.p) * 0.3; const a = 0.4 + 0.5 * Math.sin(fr / 12 + p.p * 3); if (a > 0.2) { g.save(); g.globalCompositeOperation = "lighter"; glow(g, p.x, p.y, 5, "220,255,140", a * 0.7); g.restore(); g.fillStyle = `rgba(240,255,180,${a})`; g.fillRect(p.x, p.y, 1, 1); } }
        else if (kind === "sparks") { p.y -= 0.4 + p.s * 0.6; p.x += Math.sin(fr / 20 + p.p) * 0.4; g.fillStyle = `rgba(255,${150 + p.s * 80 | 0},80,${0.5 + p.s * 0.4})`; g.fillRect(p.x, p.y, 1, 1); if (p.y < -5) p.y = 205; }
        else { p.y += 0.05 + p.s * 0.05; p.x += Math.sin(fr / 80 + p.p) * 0.15; g.fillStyle = `rgba(255,230,180,${0.2 + p.s * 0.3})`; g.fillRect(p.x, p.y, 1, 1); }
        if (p.x > 340) p.x = -40; if (p.x < -50) p.x = 330; if (p.y > 205) p.y = -5;
      });
    }
    // ora del giorno della zona: cambia il colore della luce e accende le lanterne di sera
    function timeNow() { const sp = ZX.era && ZX.era.time ? ZX.era : ZX.spec; if (!sp || !sp.time) return "giorno"; const zr = ZONES[ZX.id]; return typeof sp.time === "function" ? safe(() => sp.time(zr ? stepOf(zr.ch) : 0, K), "giorno") : sp.time; }
    const TIME_FX = { alba: ["255,170,190", 0.16, "rgba(40,20,60,.10)"], tramonto: ["255,140,60", 0.2, "rgba(60,20,40,.14)"], notte: ["70,90,170", 0.0, "rgba(8,12,40,.48)"] };
    function mood(g, fr) {
      const R = ZX.rg, tod = timeNow(), tf = TIME_FX[tod];
      if (tf) { if (tf[1]) { g.save(); g.globalCompositeOperation = "soft-light"; g.fillStyle = `rgba(${tf[0]},${tf[1] * 2.5})`; g.fillRect(0, 0, 320, 200); g.restore(); } g.fillStyle = tf[2]; g.fillRect(0, 0, 320, 200); }
      const lk = tod === "notte" ? 1.5 : tod === "tramonto" ? 1.1 : 0.8;
      g.save(); g.globalCompositeOperation = "lighter"; ZX.lights.forEach(([x, y, r, rgb, a]) => glow(g, x, y, r * (tod === "notte" ? 1.3 : 1), rgb, Math.min(1, a * lk))); g.restore(); ZX.lights.length = 0;
      if (tod === "notte" && !ZX.spec?.interior) for (let i = 0; i < 18; i++) { const tw = Math.sin(fr / 20 + i * 1.7) > 0.3; if (tw) { g.fillStyle = "rgba(255,255,230,.8)"; g.fillRect((i * 97) % 320, (i * 53) % 40, 1, 1); } }
      [].concat(R.fx || []).forEach((k) => k && particles(g, fr, k));
      if (cfg.mood) safe(() => cfg.mood(g, fr, K));
      if (ZX.era && ZX.era.filter) safe(() => filter(g, ZX.era.filter));
      if (R.tintA) { g.save(); g.globalCompositeOperation = "soft-light"; g.fillStyle = `rgba(${R.tint},${R.tintA * 2.2})`; g.fillRect(0, 0, 320, 200); g.restore(); }
      if (cfg.depthBlur !== false) safe(() => { // bordi sfocati (profondità, come nelle saghe HD-2D)
        const cv = g.canvas, cw = cv.width, chh = cv.height, s = chh / 200;
        if (!BLUR || BLUR.width !== cw || BLUR.height !== chh) { BLUR = document.createElement("canvas"); BLUR.width = cw; BLUR.height = chh; BLUR.g = BLUR.getContext("2d"); }
        const b = BLUR.g; b.clearRect(0, 0, cw, chh); b.filter = `blur(${1.2 * s}px)`; b.drawImage(cv, 0, 0); b.filter = "none";
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); [[0, 12, 0.8], [12, 12, 0.4], [188, 12, 0.8], [176, 12, 0.4]].forEach(([y, h, a]) => { g.globalAlpha = a; g.drawImage(BLUR, 0, y * s, cw, h * s, 0, y * s, cw, h * s); }); g.restore();
      });
      const vg = g.createRadialGradient(160, 100, 80, 160, 100, 210); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(5,5,10,${(R.dark || 0) + 0.12})`); g.fillStyle = vg; g.fillRect(0, 0, 320, 200);
      const e = fr - FX.enter;
      if (e >= 0 && e < 150 && FX.title) { // cartiglio con il nome del luogo
        const a = e < 20 ? e / 20 : e > 120 ? (150 - e) / 30 : 1; g.save(); g.globalAlpha = a; g.font = `bold 11px ${TH.font}`; const w = g.measureText(FX.title).width + 40, x = 160 - w / 2, y = 38;
        g.fillStyle = TH.paper; g.fillRect(x, y, w, 22); g.fillStyle = TH.accent; g.fillRect(x, y, 3, 22); g.fillRect(x + w - 3, y, 3, 22); g.fillStyle = TH.ink; g.textAlign = "center"; g.fillText(FX.title, 160, y + 15); g.textAlign = "left"; g.restore();
      }
    }

    // -------------------------------------------------------------- capitoli e zone
    const CHAPTERS = {}, ZONES = {}, COS = {}, PENDING = [], PLUG = arr(cfg.plugins);
    const PASS = Object.freeze({ pass: true }); // K.PASS: «qui risponde il capitolo prima»
    const zoneRec = () => (api ? ZONES[api.trZone()] || null : null);
    const bgNow = () => (zoneRec() && zoneRec().spec.bg) || BG0;
    const activeChapter = () => { const m = mem(); let best = null; Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => { if (n <= m.ch) best = CHAPTERS[n]; }); return best || CHAPTERS[1] || null; };
    const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);
    const goalNow = () => { const c = activeChapter(); return c && c.goal ? T(c.goal(stepOf(c.n))) : ""; };
    const chainFor = (zr) => { const m = mem(); return Object.keys(CHAPTERS).map(Number).filter((n) => n >= zr.ch && n <= m.ch).sort((a, b) => b - a).map((n) => CHAPTERS[n]); };
    function refreshZone() {
      const zr = zoneRec(); if (!zr) return;
      const c = CHAPTERS[zr.ch]; castHero();
      const s = stepOf(c.n), es = eraSpec(api.trZone()); let list = es ? (es.npcs ? es.npcs(s) : []) : zr.spec.npcs ? zr.spec.npcs(s) : [];
      chainFor(zr).slice().reverse().forEach((cc) => { const p = cc.n !== zr.ch && cc.patch && cc.patch[api.trZone()]; if (p && p.npcs) list = p.npcs(stepOf(cc.n), list); });
      arr(cfg.cameos).forEach((c) => { if (c.zone === api.trZone() && !list.some((n) => n.id === c.id) && safe(() => c.when(K), false)) list.push({ id: c.id, at: c.at, cameo: true }); });
      // IL GRUPPO: i compagni di cfg.party(K) camminano in fila dietro al Campione (non bloccano, ci si parla guardandoli)
      if (cfg.party && !zr.spec.noParty) arr(safe(() => cfg.party(K), [])).forEach((id, i) => { if (!list.some((n) => n.id === id)) { const p = api.trPos && api.trPos(); list.push({ id, ghost: true, follower: i, at: p ? [Math.floor(p[0] / TS), Math.floor((p[1] - 4) / TS)] : zr.spec.start }); } });
      zr.Z.npcs = list.filter((n) => CAST_OK(n.id));
      const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(s) : zr.spec.hints || {}), gl = goalNow(), tip = typeof zr.spec.tip === "function" ? zr.spec.tip(s) : zr.spec.tip || "";
      [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => { if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (tip ? tip + " " : "") + (hints[k] || ""); });
      zr.Z.hints = hints;
    }
    let soon = 0;
    const refreshSoon = () => { clearTimeout(soon); soon = setTimeout(() => safe(refreshZone), 0); };
    const done = () => { refreshZone(); api.trResume(); };
    function lines(ls, bg) { return ls.map((l) => api.L(l[0], T(l[1]), l[2] || bg || bgNow())); }
    function say(ls, then) { api.trSay(lines(ls), typeof then === "function" ? then : done); }
    function ask(who, prompt, opts, bg) { api.trAsk(who, esc(T(prompt)).replace(/\n/g, "<br>"), opts.map((o) => ({ label: T(o.label), sub: o.sub ? T(o.sub) : undefined, cls: o.cls || "", disabled: !!o.disabled, fn: o.fn ? () => { if (o.big) SFX.choice(); o.fn(); } : o.fn })), bg || bgNow()); }
    function reward(key, o) {
      const msg = [];
      once(key, () => { if (o.coins) { const n = coinsGive(Math.round(o.coins * (DIFFS[mem().diff] || DIFFS.normale).coins)); if (n) msg.push(`+${n} monete`); } (o.cos ? [].concat(o.cos) : []).forEach((id) => { const c = api.COSM && api.COSM[id] && safe(() => api.bCos(id), false) ? api.COSM[id].label : null; if (c) msg.push(`Nuovo in guardaroba: ${c}`); }); });
      return msg;
    }
    function setTiles(x0, y0, x1, y1, ch) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ZX.map && ZX.map[y] && x >= 0 && x < ZX.map[y].length) { ZX.map[y][x] = ch; if (isFloor(ch) && ZX.under && ZX.under[y]) ZX.under[y][x] = ch; } }
    function go(zid, tx, ty) { const tr = api.trRec(); tr.pos[zid] = [tx * TS + 8, ty * TS + 12]; enterZone(zid); }
    function enterZone(zid) {
      const zr = ZONES[zid]; if (!zr) return;
      const m = mem(); m.zone = zid; m.last = Date.now(); save();
      castHero(); api.trRec().seen[zid] = true;
      FX.enter = frNow(); FX.title = zr.spec.short;
      PLUG.forEach((p) => p.enter && safe(() => p.enter(zid, zr.spec, K)));
      if (zr.spec.onEnter) safe(() => zr.spec.onEnter(K));
      api.trGo(zid); refreshZone();
      if (!m.intro[zid]) { m.intro[zid] = 1; save(); if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done); }
    }

    // -------------------------------------------------------------- bauli, riposo, diario
    const chestKey = (zid, tx, ty) => `x_${zid}_${tx}_${ty}`;
    function learnLore(id, quiet) { const m = mem(); if (!LORE[id] || m.lore.includes(id)) return false; m.lore.push(id); save(); if (!quiet) SFX.ding(); return true; }
    function openChest(zid, tx, ty, def) {
      const k = chestKey(zid, tx, ty);
      if (F.is(k)) return say([["voce", (cfg.texts && cfg.texts.chestEmpty) || "Il baule è vuoto."]]);
      F.set(k, true); SFX.chest();
      const msg = def && def.cos ? reward("chest:" + k, { cos: def.cos }) : [];
      if (def && def.coins) { const n = coinsGive(def.coins); if (n) msg.unshift(`+${n} monete`); }
      if (def && def.lore) learnLore(def.lore, true);
      say([["voce", `${(cfg.texts && cfg.texts.chestOpen) || "Apri il baule."} ${def && def.text ? def.text + " " : ""}${msg.length ? "<b>" + msg.join(" · ") + "</b>" : ""}${def && def.lore && LORE[def.lore] ? ` · Nel ${esc(JN().toLowerCase())}: «${LORE[def.lore].t}».` : ""}`]]);
    }
    const REST = Object.assign({ ch: "s", label: "Riposa", text: "Ti fermi un momento. (Il gioco salva da solo: qui puoi rileggere il diario.)" }, obj(cfg.rest));
    function rest(back) {
      SFX.rest(); refreshZone();
      ask("voce", REST.text, [{ label: JN(), cls: "hot", fn: () => journal(() => rest(back), true) }, { label: "Riprendi il cammino", fn: back || done }]);
    }
    const JN = () => (cfg.journal && cfg.journal.name) || "Il Diario";
    const BOND_TXT = (v) => (v >= 5 ? "fortissimo" : v >= 3 ? "forte" : v >= 1 ? "c'è" : v <= -3 ? "incrinato" : "nessuno");
    function journalHtml() {
      if (cfg.journal && cfg.journal.html) return cfg.journal.html(K);
      const m = mem(), h0 = hero() || { name: "Campione", num: 9 };
      const stats = Object.keys(STATS).filter((k) => STATS[k][3]).map((k) => `${esc(STATS[k][3])}: ${BOND_TXT(m.st[k])}`).join(" · ");
      const lore = Object.keys(LORE).map((k) => (m.lore.includes(k) ? `• <b>${esc(LORE[k].t)}</b><br><span style="color:var(--dim)">${esc(T(LORE[k].d))}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
      return `<b>${esc(h0.name)}</b> · n. ${esc(h0.num)}${stats ? "<br>" + stats : ""}<br><br><b>Pagine</b> (${m.lore.length}/${Object.keys(LORE).length})<br>${lore || "<span style='color:var(--dim)'>Niente, per ora.</span>"}<br><br><b>Finali</b><br>${endingsHtml()}`;
    }
    function endingsHtml() { const m = mem(); return Object.keys(ENDINGS).map((k) => (m.ends.includes(k) ? `✓ <b>${esc(ENDINGS[k][0])}</b> <span style="color:var(--dim)">${esc(ENDINGS[k][1])}</span>` : `<span style='color:var(--dim)'>• ??? ${ENDINGS[k][2] ? "· " + esc(ENDINGS[k][2]) : ""}</span>`)).join("<br>"); }
    function journal(back, inZone) {
      const html = journalHtml() + cluesHtml() + questsHtml();
      if (inZone) return api.trAsk("voce", html, [{ label: "◂ Indietro", fn: back }], bgNow());
      api.scene(BG0, "voce", html, [{ label: "◂ Indietro", fn: back }], JN());
    }
    function finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok").slice(0, 24); if (m.ch <= n && n < NCH) m.ch = n + 1; save(); SFX.end(); }

    // -------------------------------------------------------------- zone sul motore TRZ
    // PERSONAGGI CHE CAMMINANO: un PNG con route: [[x,y], [x,y], …] gira per la zona (speed, pause). Si ferma e si gira
    // verso il Campione quando gli passi accanto, così ci si può sempre parlare. La posizione resta anche cambiando capitolo.
    const WALK = {};
    function walkTick(zid) {
      const zr = ZONES[zid]; if (!zr || !zr.Z.npcs) return null; const me = api.trPos && api.trPos();
      zr.Z.npcs.forEach((n) => {
        if (!Array.isArray(n.route) || n.route.length < 2) return;
        const k = zid + ":" + n.id, w = WALK[k] || (WALK[k] = { x: n.route[0][0] * TS + 8, y: n.route[0][1] * TS + 12, i: 1, wait: 0, ph: 0 });
        const near = me && Math.hypot(me[0] - w.x, me[1] - w.y) < 28;
        if (near) { n.walk = 0; n.face = Math.abs(me[0] - w.x) > Math.abs(me[1] - w.y) ? (me[0] < w.x ? "left" : "right") : me[1] < w.y ? "up" : "down"; }
        else if (w.wait > 0) { w.wait--; n.walk = 0; }
        else {
          const tg = n.route[w.i % n.route.length], tx = tg[0] * TS + 8, ty = tg[1] * TS + 12, dx = tx - w.x, dy = ty - w.y, d = Math.hypot(dx, dy), sp = n.speed || 0.45;
          if (d <= sp) { w.x = tx; w.y = ty; w.i++; w.wait = n.pause == null ? 50 : n.pause; n.walk = 0; }
          else { w.x += (dx / d) * sp; w.y += (dy / d) * sp; n.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up"; w.ph += 0.18; n.walk = w.ph; }
        }
        n.px = w.x; n.py = w.y; n.at = [Math.floor(w.x / TS), Math.floor((w.y - 4) / TS)];
      });
      return null;
    }
    const TRAIL = { zid: "", pts: [] };
    function followTick(zid) {
      const zr = ZONES[zid], me = api.trPos && api.trPos(); if (!zr || !zr.Z.npcs || !me) return null;
      const fol = zr.Z.npcs.filter((n) => n.ghost); if (!fol.length) return null;
      if (TRAIL.zid !== zid || !TRAIL.pts.length || Math.hypot(me[0] - TRAIL.pts[0][0], me[1] - TRAIL.pts[0][1]) > 40) { TRAIL.zid = zid; TRAIL.pts = [[me[0], me[1]]]; }
      const moved = Math.hypot(me[0] - TRAIL.pts[0][0], me[1] - TRAIL.pts[0][1]) >= 1.2; if (moved) { TRAIL.pts.unshift([me[0], me[1]]); if (TRAIL.pts.length > 90) TRAIL.pts.length = 90; }
      fol.forEach((n) => {
        const i = Math.min(TRAIL.pts.length - 1, (n.follower + 1) * 11), p = TRAIL.pts[i], q = TRAIL.pts[Math.max(0, i - 3)];
        n.px = p[0]; n.py = p[1]; n.at = [Math.floor(p[0] / TS), Math.floor((p[1] - 4) / TS)];
        if (moved && i > 0) { const dx = q[0] - p[0], dy = q[1] - p[1]; if (Math.abs(dx) + Math.abs(dy) > 0.5) n.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up"; n.wph = (n.wph || 0) + 0.25; n.walk = n.wph; } else n.walk = 0;
      });
      return null;
    }
    const GRV = { zid: "", x: 0, y: 0, vx: 0, vy: 0, ang: 0, mode: "" };
    function gravOf(spec, chN, zid) { const es = zid ? eraSpec(zid) : null, g = es && es.gravity !== undefined ? es.gravity : spec.gravity; return String((typeof g === "function" ? safe(() => g(K, stepOf(chN)), "") : g) || ""); }
    function gravFree(x, y) { for (const [ox, oy] of [[-5, -4], [5, -4], [-5, 2], [5, 2]]) { const c = at(Math.floor((x + ox) / TS), Math.floor((y + oy) / TS)); if (c === undefined || c === null || SOLID.includes(c) || "~#TSGMORWLNHBDW".includes(c)) return false; } return true; }
    function gravTick(zid, spec, chN, px, py) {
      const G = GRV, mode = gravOf(spec, chN, zid); G.mode = mode;
      if (G.zid !== zid || Math.hypot(px - G.x, py - G.y) > 6) { G.zid = zid; G.x = px; G.y = py; G.vx = G.vy = 0; }
      const flip = /flip/.test(mode), zero = /zero/.test(mode);
      if (!flip && !zero) { G.x = px; G.y = py; return null; }
      const k = (api.trKeys && api.trKeys()) || {}; let ix = (k.right ? 1 : 0) - (k.left ? 1 : 0), iy = (k.down ? 1 : 0) - (k.up ? 1 : 0);
      if (flip) { ix = -ix; iy = -iy; } if (ix && iy) { ix *= 0.72; iy *= 0.72; }
      if (flip && (ix || iy) && api.trFace) api.trFace(ix && !iy ? (ix > 0 ? "right" : "left") : iy > 0 ? "down" : "up");
      if (zero) { G.vx = G.vx * 0.965 + ix * 1.5 * 0.035 * 1.6; G.vy = G.vy * 0.965 + iy * 1.5 * 0.035 * 1.6; const v = Math.hypot(G.vx, G.vy); if (v > 2.2) { G.vx *= 2.2 / v; G.vy *= 2.2 / v; } }
      else { G.vx = ix * 1.5; G.vy = iy * 1.5; }
      if (gravFree(G.x + G.vx, G.y)) G.x += G.vx; else G.vx = zero ? -G.vx * 0.5 : 0;
      if (gravFree(G.x, G.y + G.vy)) G.y += G.vy; else G.vy = zero ? -G.vy * 0.5 : 0;
      return [G.x, G.y];
    }
    // la visuale ruota quando la gravità è girata (animata, così si vede il «giro»)
    function gravView(g) {
      const want = /flip/.test(GRV.mode) && GRV.zid === ZX.id ? Math.PI : 0; GRV.ang += (want - GRV.ang) * 0.08; if (Math.abs(want - GRV.ang) < 0.01) GRV.ang = want;
      if (GRV.ang < 0.01) return;
      const cv = g.canvas; if (!GRV.cv || GRV.cv.width !== cv.width || GRV.cv.height !== cv.height) { GRV.cv = document.createElement("canvas"); GRV.cv.width = cv.width; GRV.cv.height = cv.height; }
      const t = GRV.cv.getContext("2d"); t.clearRect(0, 0, cv.width, cv.height); t.drawImage(cv, 0, 0);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = "#05060c"; g.fillRect(0, 0, cv.width, cv.height); g.translate(cv.width / 2, cv.height / 2); g.rotate(GRV.ang); g.drawImage(GRV.cv, -cv.width / 2, -cv.height / 2); g.restore();
    }
    function registerZone(chN, zid, spec) {
      const rk = spec.region && REG[spec.region] ? spec.region : REG_FIRST;
      const syncZX = () => { const es = eraSpec(zid), rk2 = es && es.region && REG[es.region] ? es.region : rk; ZX.id = zid; ZX.rk = rk2; ZX.rg = REG[rk2]; ZX.era = es; ZX.eraName = eraOf(zid); ZX.spec = spec; ZX.standCol = spec.stands; ZX.chestOpen = (tx, ty) => F.is(chestKey(zid, tx, ty)); };
      const Z = {
        name: spec.name, short: spec.short, sub: spec.sub || "", need: 0, w: spec.w, h: spec.h, start: spec.start, theme: spec.music || cfg.musicMain || "torino", isCustomSaga: true,
        bus: "uscita", busLabel: "Esci dalla saga",
        item: spec.item || cfg.item || ["Piuma", "Piume"], itemCos: spec.itemCos, items: spec.items || [], bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: spec.pitch || [-20, -20, 1, 1],
        solid: SOLID, act: Object.assign({ [REST.ch]: REST.label, x: "Apri il baule" }, obj(cfg.act), spec.act || {}), intro: [],
        me: () => { const c = api.CAST.hero || api.CAST.leo; return Object.assign({}, c); },
        pass: () => (cfg.pass ? safe(() => cfg.pass(K, zid), "") || "" : ""), // tessere che l'eroe può attraversare adesso (forme, poteri)
        heroFx: cfg.heroFx ? () => safe(() => cfg.heroFx(K, zid), null) : null, // l'aspetto dell'eroe in esplorazione: { s: scala, dy: volo, cape: colore, aura }
        drawItem(x, y, i) {
          const g = ctx(), f = frNow();
          if (cfg.drawItem) return safe(() => cfg.drawItem(g, x, y, i, f, K));
          g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 9, "255,240,200", 0.35 + 0.15 * Math.sin(f / 10 + i)); g.restore();
          g.save(); g.translate(x, y); g.rotate(-0.6 + Math.sin(f / 20 + i) * 0.2); g.fillStyle = "#f4efe0"; g.beginPath(); g.ellipse(0, 0, 2.5, 6.5, 0, 0, 7); g.fill(); g.fillStyle = "#9a9a8a"; g.fillRect(-0.5, -6, 1, 12); g.restore();
        },
      };
      Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => `Menu in basso: ${JN()} ed Esci.` });
      Z.build = function (m) {
        ZX.map = m; syncZX(); ctx();
        const Ls = makeLayers(spec.w, spec.h, spec.base || ","); Ls.lay(0, 0, spec.w - 1, spec.h - 1, spec.base || ",");
        const es = eraSpec(zid); if (es && es.build) es.build(Ls, K); else spec.build(Ls, K);
        chainFor(ZONES[zid]).slice().reverse().forEach((cc) => { const p = cc.n !== chN && cc.patch && cc.patch[zid]; if (p && p.build) p.build(Ls, stepOf(cc.n), K); });
        spec.__doors = {};
        Ls.autos.forEach((a, i) => {
          const d = a.def, k = a.x + "," + a.y;
          if (typeof d === "string" || d.text && !d.room && !d.to) { spec.__doors[k] = { text: typeof d === "string" ? d : d.text }; return; }
          if (d.to) { spec.__doors[k] = d; return; }
          const iid = d.id || (zid.slice(0, 18) + "_i" + i);
          if (!ZONES[iid]) registerZone(chN, iid, autoRoom(iid, d, spec));
          spec.__doors[k] = { to: iid, locked: d.locked };
        });
        refreshSoon();
      };
      Z.tile = function (ch, sx, sy, tx, ty) { ctx(); if (ZX.id !== zid) syncZX(); return drawTile(ch, sx, sy, tx, ty); };
      const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow(), step: stepOf(chN) });
      // negli interni basta camminare sulla soglia (la freccia in basso) per uscire
      if (spec.interior) { const ex = spec.exits ? Object.keys(spec.exits) : null; let armed = false; spec.__exitTick = (px, py) => { const tx = Math.floor(px / TS), ty = Math.floor((py - 4) / TS), on = ex ? ex.includes(tx + "," + ty) : at(tx, ty) === "v"; if (!on) { armed = true; return null; } if (armed) { armed = false; setTimeout(() => safe(() => leaveInterior(zid)), 0); } return null; }; }
      // GRAVITÀ della zona (spec.gravity: "zero" | "flip" | "zeroflip", o una funzione (K, step) che restituisce uno di questi):
      //  - zero: si fluttua, con inerzia (i comandi spingono, e quando li lasci continui a scivolare e rimbalzi sui muri);
      //  - flip: la gravità è girata, la visuale ruota di 180° e i comandi restano quelli dello schermo.
      // meccaniche per-zona: spec.tick (movimento del Campione, può spostarlo) e i plugin della saga
      const ticks = []; if (spec.__exitTick) ticks.push((px, py) => spec.__exitTick(px, py)); if (spec.tick) ticks.push((px, py, dt) => spec.tick(px, py, dt, K, stepOf(chN))); PLUG.forEach((p) => { if (p.tick) ticks.push((px, py, dt) => p.tick(zid, spec, px, py, dt, K)); }); if (spec.gravity || (spec.eras && Object.values(spec.eras).some((e) => e.gravity))) ticks.unshift((px, py) => gravTick(zid, spec, chN, px, py));
      ticks.push(() => walkTick(zid)); ticks.push(() => followTick(zid));
      if (ticks.length) Z.tick = function (px, py, dt, moving) { if (api.trZone() !== zid) return null; let r = null; ticks.forEach((t) => { const q = safe(() => t(r ? r[0] : px, r ? r[1] : py, Math.min(0.05, dt || 0.016), moving), null); if (q && q.length === 2) r = q; }); return r; };
      Z.decor = function (cx, cy) { const d = dd(cx, cy); ZX.decor.splice(0).forEach((fn) => safe(() => fn(GP, cx, cy, d))); if (spec.decor) safe(() => spec.decor(GP, cx, cy, d, K)); };
      Z.top = function (cx, cy) {
        const d = dd(cx, cy);
        if (spec.top) safe(() => spec.top(GP, cx, cy, d, K));
        chainFor(ZONES[zid]).forEach((cc) => { const p = cc.n !== chN && cc.patch && cc.patch[zid]; if (p && p.top) safe(() => p.top(GP, cx, cy, d, stepOf(cc.n), K)); });
        PLUG.forEach((p) => p.top && safe(() => p.top(GP, zid, spec, cx, cy, d, K)));
        safe(() => gravView(GP));
        safe(() => mood(GP, frNow()));
        if (spec.hud) safe(() => spec.hud(GP, K, stepOf(chN)));
        PLUG.forEach((p) => p.hud && safe(() => p.hud(GP, zid, spec, K)));
      };
      Z.onObj = function (ch, tx, ty) {
        let f = null;
        chainFor(ZONES[zid]).some((c) => { f = c.obj && (c.obj[zid + ":" + ch + ":" + tx + "," + ty] || c.obj[zid + ":" + ch]); return !!f; });
        if (f) { f({ ch, tx, ty, zid }); return true; }
        const own = spec.objects && (spec.objects[tx + "," + ty] || spec.objects[ch]); if (own) { own({ ch, tx, ty, zid }, K); return true; }
        const plug = PLUG.find((p) => p.obj && p.obj(ch, tx, ty, zid, spec, K)); if (plug) return true;
        const dr = (spec.doors && spec.doors[tx + "," + ty]) || (spec.__doors && spec.__doors[tx + "," + ty]);
        if (dr) { if (dr.text && !dr.to) say([["voce", dr.text]], done); else enterDoor(zid, tx, ty, dr); return true; }
        if (spec.interior && (ch === "v" || (spec.exits && spec.exits[tx + "," + ty]))) { leaveInterior(zid); return true; }
        if (ch === REST.ch) { rest(done); return true; }
        if (ch === "x") { const def = spec.chests && spec.chests[tx + "," + ty]; openChest(zid, tx, ty, def || { coins: 10 }); return true; }
        const flav = spec.flavor && (spec.flavor[tx + "," + ty] || spec.flavor[ch]);
        if (flav) { say([["voce", Array.isArray(flav) ? pick(flav) : flav]], done); return true; }
        if (Z.act[tx + "," + ty] || Z.act[ch]) { say([["voce", (cfg.texts && cfg.texts.nothing) || "Niente di speciale."]], done); return true; }
        return false;
      };
      Z.menu = () => zoneMenu();
      PLUG.forEach((p) => p.zone && safe(() => p.zone(zid, spec, Z, K)));
      api.TRZ[zid] = Z;
      ZONES[zid] = { ch: chN, spec, Z };
    }

    // -------------------------------------------------------------- stanze automatiche: arredi diversi per ogni casa (seme = id)
    const ROOM_TXT = {
      B: ["Un letto rifatto con cura. Sul cuscino, l'impronta di un sonno lungo.", "Un letto con una coperta a quadri. Qualcuno ci ha dimenticato un libro aperto."],
      H: ["Il camino scoppietta. L'odore di legna ti entra nei vestiti e ci resta.", "Sulla mensola del camino, una fila di sassi lisci. Ognuno ha una data scritta a matita."],
      D: ["La credenza: piatti spaiati, un barattolo di miele, una tazza con il manico incollato.", "Nella credenza, dietro i bicchieri buoni, una scatola di latta piena di bottoni."],
      T: ["Sul tavolo, briciole e una tovaglia ricamata a mano.", "Il tavolo ha un cassetto che non si apre. Nessuno ricorda cosa ci sia dentro."],
      L: ["Libri vecchi, con le orecchie alle pagine. Uno parla di calcio, con le figure.", "Uno scaffale pieno di quaderni. Sulle coste, solo anni: 1987, 1988, 1989…"],
      W: ["Dalla finestra si vede la strada di fuori. Da qui dentro, sembra più piccola.", "Il vetro ha una bolla. Se ci guardi attraverso, il mondo si piega un po'."],
      z: ["Casse e sacchi. Uno ha un buco, e ne esce un filo di farina.", "Barili impilati. Uno suona vuoto. Uno suona pieno. Uno, stranamente, risponde."],
      b: ["Una panca consumata da tante attese."],
    };
    function autoRoom(iid, d, outer) {
      const kind = d.room || "casa", hs = hash(iid + kind), r = (k) => (hash(iid + ":" + k) % 1000) / 1000;
      const W = 20, Hh = 13, door = [10, 12], start = [10, 10];
      const reg = REG.casa ? "casa" : REG.interno ? "interno" : REG_FIRST;
      const spots = [[10, 4], [5, 7], [15, 7], [7, 9], [13, 9]];
      return {
        interior: true, region: reg, name: d.name || "Una casa", short: d.name || "Una casa", sub: d.sub || "", bg: d.bg || outer.bg, w: W, h: Hh, start, quilt: ["#c85a5a", "#5a8ac8", "#7ab86a", "#d8a83a"][hs % 4],
        intro: d.intro ? [["voce", d.intro]] : [],
        npcs: (s) => arr(typeof d.who === "function" ? safe(() => d.who(s, K), []) : d.who).map((w, i) => ({ id: typeof w === "string" ? w : w.id, at: (w && typeof w === "object" && Array.isArray(w.at) && w.at) || spots[i % spots.length] })), // (attenzione: "testo".at è una funzione)
        chests: d.chest ? { "18,10": d.chest } : {},
        act: Object.assign({ B: "Guarda il letto", H: "Scaldati al camino", D: "Apri la credenza", T: "Guarda il tavolo", L: "Sfoglia i libri", W: "Guarda dalla finestra", z: "Guarda le casse", b: "Siediti", v: "Esci" }, d.act || {}),
        flavor: Object.assign({}, ROOM_TXT, obj(cfg.roomText), d.flavor || {}),
        build(L) {
          const { lay, put } = L, floor = kind === "bottega" || kind === "ufficio" || kind === "spogliatoio" ? "+" : kind === "mulino" ? ":" : "=";
          lay(0, 0, W - 1, Hh - 1, floor); lay(0, 0, W - 1, 1, "a"); lay(0, 0, 0, Hh - 1, "a"); lay(W - 1, 0, W - 1, Hh - 1, "a"); lay(0, Hh - 1, W - 1, Hh - 1, "a"); put(door[0], door[1], "v");
          [3 + (hs % 3), 15 - (hs % 2)].forEach((x) => put(x, 1, "W"));
          if (kind !== "bottega" && kind !== "spogliatoio") lay(7, 6, 12, 8, '"');
          const corner = (hs >> 3) % 2; // l'arredamento cambia lato da casa a casa
          const L0 = corner ? 2 : 16, L1 = corner ? 16 : 2;
          if (kind === "casa") { put(10, 1, "H"); put(L0, 3, "B"); put(L0, 4, "B"); if (r("d") < 0.7) put(L0 + (corner ? 2 : -2), 2, "D"); put(L1, 5, "T"); put(L1 + (corner ? -1 : 1), 5, "T"); if (r("l") < 0.6) { put(L1, 2, "L"); put(L1 + (corner ? -1 : 1), 2, "L"); } put(L1, 6, "b"); if (r("z") < 0.5) put(corner ? 18 : 1, 10, "z"); }
          else if (kind === "bottega") { for (let x = 2; x <= 17; x += 2) put(x, 2, r("s" + x) < 0.5 ? "D" : "L"); lay(4, 5, 15, 5, "T"); put(9, 5, floor); put(10, 5, floor); [[2, 9], [3, 9], [17, 9], [16, 10]].forEach(([x, y]) => put(x, y, "z")); }
          else if (kind === "mulino") { put(L1, 1, "H"); [[2, 3], [3, 3], [2, 4], [16, 3], [17, 3], [17, 4], [16, 9], [17, 9], [2, 9]].forEach(([x, y]) => put(x, y, "z")); put(L0 === 2 ? 5 : 14, 6, "T"); put(10, 3, "p"); }
          else if (kind === "ufficio") { [[2, 2], [3, 2], [16, 2], [17, 2]].forEach(([x, y]) => put(x, y, "D")); [[5, 4], [6, 4], [13, 4], [14, 4], [5, 8], [6, 8], [13, 8], [14, 8]].forEach(([x, y]) => put(x, y, "T")); [[5, 5], [13, 5], [5, 9], [13, 9]].forEach(([x, y]) => put(x, y, "b")); put(L1, 10, "L"); put(L1 + (corner ? -1 : 1), 10, "L"); }
          else if (kind === "spogliatoio") { for (let x = 2; x <= 17; x++) if (x !== 10 && x % 3) put(x, 2, "D"); [[4, 6], [5, 6], [6, 6], [13, 6], [14, 6], [15, 6]].forEach(([x, y]) => put(x, y, "b")); put(2, 10, "z"); put(17, 9, "z"); }
          else { put(10, 1, "H"); [[4, 4], [15, 4], [4, 9], [15, 9]].forEach(([x, y]) => { put(x, y, "T"); put(x + 1, y, "T"); put(x, y + 1, "b"); }); [[2, 2], [17, 2], [2, 3]].forEach(([x, y]) => put(x, y, "z")); }
          if (d.chest) put(18, 10, "x");
          if (d.build) d.build(L, K);
        },
        // dettagli che rendono viva una stanza: quadri e mensole sulla parete, piante negli angoli, la lampada appesa, la luce delle finestre
        decor(g, cx, cy, dd) {
          const X = dd.X, Y = dd.Y, pal = ["#c85a5a", "#5a8ac8", "#7ab86a", "#d8a83a", "#a87ac8"];
          [6 + (hs % 4), 12 + (hs % 3)].forEach((x, i) => { if (x === 10) return; const px = X(x) + 3, py = Y(0) + 6; g.fillStyle = "#6a4a2a"; g.fillRect(px - 1, py - 1, 12, 10); g.fillStyle = pal[(hs + i) % 5]; g.fillRect(px, py, 10, 8); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(px + 2, py + 4, 6, 2); g.fillStyle = "#f4efe0"; g.beginPath(); g.arc(px + 7, py + 2.5, 1.4, 0, 7); g.fill(); });
          if (kind !== "bottega") { const sx = X(corner ? 13 : 4), sy = Y(1) + 2; g.fillStyle = "#8a5a32"; g.fillRect(sx, sy + 8, 22, 2); for (let k = 0; k < 4; k++) { g.fillStyle = pal[(hs + k) % 5]; g.fillRect(sx + 2 + k * 5, sy + 3 + (k % 2), 3, 5 - (k % 2)); } }
          [[1, 2], [18, 11], [1, 11]].forEach(([x, y], i) => { if ((hs >> i) % 2 && !(x === 18 && d.chest)) { const px = X(x) + 8, py = Y(y) + 14; g.fillStyle = "#a0583a"; g.fillRect(px - 4, py - 6, 8, 6); g.fillStyle = i % 2 ? "#4f9444" : "#3e7a3a"; g.beginPath(); g.arc(px, py - 9, 5, 0, 7); g.arc(px - 3, py - 12, 3.5, 0, 7); g.arc(px + 3, py - 12, 3.5, 0, 7); g.fill(); } });
          const lx = X(10), ly = Y(4) - 6; g.strokeStyle = "#3a2a1a"; g.lineWidth = 1; g.beginPath(); g.moveTo(lx, Y(2)); g.lineTo(lx, ly); g.stroke(); g.fillStyle = "#c9a227"; g.beginPath(); g.moveTo(lx - 5, ly + 5); g.lineTo(lx, ly); g.lineTo(lx + 5, ly + 5); g.fill(); light(lx, ly + 8, 46, "255,210,140", 0.35);
          [3 + (hs % 3), 15 - (hs % 2)].forEach((x) => { const px = X(x) + 8, py = Y(2); const gr = g.createLinearGradient(px, py, px + 10, py + 50); gr.addColorStop(0, "rgba(255,240,200,.22)"); gr.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(px - 6, py); g.lineTo(px + 6, py); g.lineTo(px + 16, py + 50); g.lineTo(px - 2, py + 50); g.closePath(); g.fill(); });
        },
      };
    }
    // commissioni: piccole missioni date dai personaggi (si leggono nel diario)
    const QUESTS = {};
    function quest(id, title, desc) { QUESTS[id] = { title, desc }; if (!F.get("q_" + id)) { F.set("q_" + id, 1); SFX.ding(); note(`Commissione: ${title}`); if (api && api.trToast) safe(() => api.trToast("Nuova commissione: " + title)); } }
    function questDone(id) { if (F.get("q_" + id) === 2) return false; F.set("q_" + id, 2); SFX.choice(); if (api && api.trToast && QUESTS[id]) safe(() => api.trToast("Commissione completata: " + QUESTS[id].title)); return true; }
    const questState = (id) => F.get("q_" + id, 0);
    function questsHtml() {
      const ids = Object.keys(QUESTS).filter((k) => questState(k)); if (!ids.length) return "";
      return "<br><br><b>Commissioni</b><br>" + ids.map((k) => (questState(k) === 2 ? `✓ <span style="color:var(--dim)">${esc(QUESTS[k].title)}</span>` : `• <b>${esc(QUESTS[k].title)}</b> · ${esc(T(QUESTS[k].desc))}`)).join("<br>");
    }

    // prove e indizi (per le saghe di indagine, ma non solo)
    const EVID = {};
    const hasClue = (id) => F.get("ev_" + id) === true;
    function giveClue(id, quiet) { if (!EVID[id] || hasClue(id)) return false; F.set("ev_" + id, true); if (!quiet) { SFX.ding(); if (api && api.trToast) safe(() => api.trToast("Nuova prova: " + EVID[id].t)); } note("Prova: " + EVID[id].t); return true; }
    function cluesHtml() { const ids = Object.keys(EVID).filter(hasClue); if (!Object.keys(EVID).length) return ""; return `<br><br><b>Prove</b> (${ids.length}/${Object.keys(EVID).length})<br>` + (ids.length ? ids.map((k) => `${EVID[k].icon || "🔎"} <b>${esc(EVID[k].t)}</b><br><span style="color:var(--dim)">${esc(T(EVID[k].d))}</span>`).join("<br>") : "<span style='color:var(--dim)'>Nessuna, per ora.</span>"); }
    function present(o) {
      const ids = Object.keys(EVID).filter(hasClue), ok = [].concat(o.ok || []);
      const opts = ids.map((id) => ({ label: `${EVID[id].icon || "🔎"} ${EVID[id].t}`, sub: EVID[id].short || "", fn: () => { if (ok.includes(id)) { SFX.choice(); if (o.right) o.right(id); } else { SFX.warn(); if (o.wrong) o.wrong(id); } } }));
      if (o.back) opts.push({ label: "◂ Non ancora", sub: "Torna a cercare prove", fn: o.back });
      ask(o.who || "voce", `${o.prompt || "Quale prova presenti?"}\n\nPRESENTA LA PROVA · ${ids.length} raccolte`, opts.length ? opts : [{ label: "Non hai ancora prove", fn: o.back || done }], o.bg);
    }

    // -------------------------------------------------------------- interni: entrare e uscire dalle case
    function enterDoor(fromZid, tx, ty, d) {
      d = typeof d === "string" ? { to: d } : d || {};
      const lock = d.locked ? safe(() => d.locked(K), false) : false;
      if (lock) return say([["voce", typeof lock === "string" ? lock : "La porta è chiusa."]]);
      const zr = ZONES[d.to]; if (!zr) return say([["voce", d.text || "La porta è chiusa."]]);
      F.set("ret_" + d.to, `${fromZid}|${tx}|${ty + 1}`); SFX.step();
      const at2 = d.at || zr.spec.start; go(d.to, at2[0], at2[1]);
    }
    function leaveInterior(zid) {
      const r = String(F.get("ret_" + zid, "")).split("|"), z = ZONES[r[0]];
      if (z && ZONES[zid] && ZONES[zid].spec.interior) { SFX.step(); return go(r[0], +r[1], +r[2]); }
      const sp = ZONES[zid] && ZONES[zid].spec, out = sp && sp.outside; if (out) return go(out[0], out[1], out[2]);
      done();
    }
    // viaggio rapido tra i luoghi già visitati (cfg.travel, spec.travel = [tx, ty])
    function travelMenu(back) {
      const m = mem(), seen = api.trRec().seen || {}, here = api.trZone();
      const opts = Object.keys(ZONES).filter((z) => ZONES[z].spec.travel && ZONES[z].ch <= m.ch && seen[z] && z !== here).map((z) => ({ label: ZONES[z].spec.short, sub: ZONES[z].spec.sub || "", fn: () => { const t = ZONES[z].spec.travel; go(z, t[0], t[1]); } }));
      api.trAsk("voce", opts.length ? "<b>Viaggio rapido</b><br>Dove vuoi andare?" : "<b>Viaggio rapido</b><br>Non conosci ancora altri luoghi.", [...opts, { label: "◂ Indietro", fn: back }], bgNow());
    }

    // -------------------------------------------------------------- partite
    // squadra avversaria predefinita per le partite del gioco (il gioco la vuole sempre: senza, il 3 contro 3 non parte)
    function defTeam(o) {
      const nm = o.oppTeam || "Avversari", k = (o.oppPower || 0.95) * ((DIFFS[mem().diff] || DIFFS.normale).team / 0.95);
      return (t, s) => { s = s || {}; const b = Number(s.tiro) || 12, d = Number(s.drib || s.contrasto) || b; return { name: nm, vs: o.oppVs || nm, color: o.oppColor || "#5a5a6a", atk: t(b * k), def: t(d * k), vel: t(b * k), names: Array.isArray(o.oppNames) ? o.oppNames.slice() : undefined }; };
    }
    function playMatch(o) {
      castHero(); inMatch = true;
      api.matchPick({
        alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget, homeKit: o.homeKit, cageField: o.cageField,
        force: o.force !== false && !!o.alt && !/,/.test(o.alt), id: o.id, chap: o.chap ? T(o.chap) : TITLE, intro: o.intro ? T(o.intro) : "", mate: o.mate, mateGeneric: true, us: o.us, min: o.min || 45, team: o.team || defTeam(o), venue: o.venue, weather: o.weather, bg: o.bg, hero: undefined,
        onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else if (r.a < r.b) m.losses++; save(); refreshZone(); safe(() => o.done(r), null); },
      });
    }
    // la partita originale della saga: o.mode(opts) deve chiamare opts.onDone({ a, b, win })
    function ownMatch(start, o) {
      castHero(); const h = hero() || {}; CUR = { diff: mem().diff || "normale", style: o.oppStyle || "" };
      api.scene(o.bg || bgNow(), "voce", "La partita è cominciata.", [{ label: "◂ Torna a camminare", fn: done }], T(o.title || TITLE));
      inMatch = true;
      const ok = safe(() => start(Object.assign({}, o, { title: T(o.title || ""), heroLook: { name: h.name || "Campione", skin: h.skin, hair: h.hair, shirt: o.shirt || h.shirt || TH.accent }, onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else m.losses++; save(); refreshZone(); safe(() => o.done(r), null); } })), false);
      if (ok === false) { inMatch = false; say([["voce", "La partita non si è caricata. Ricarica la pagina e riprova."]]); }
    }

    // -------------------------------------------------------------- menu
    function leave() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
    function zoneMenu() {
      const c = activeChapter(), m = mem();
      const extra = cfg.zoneMenuExtra ? arr(safe(() => cfg.zoneMenuExtra(K), [])) : [];
      api.trAsk("voce", `<b>${esc(TITLE)}</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · ${esc(JN())}: ${m.lore.length} pagine</span>`, [
        { label: JN(), sub: (cfg.journal && cfg.journal.sub) || "Persone, scoperte, finali", cls: "hot", fn: () => journal(zoneMenu, true) },
        ...(cfg.travel && !(zoneRec() && zoneRec().spec.interior) ? [{ label: "Viaggio rapido", sub: "Nei luoghi che conosci già", fn: () => travelMenu(zoneMenu) }] : []),
        ...extra,
        { label: `Esci da ${TITLE}`, sub: "Progressi e posizione restano salvati", cls: "hot", fn: leave },
      ], bgNow());
    }
    function openMain(o) {
      if (o && typeof o.onExit === "function") EXIT = o.onExit;
      reload();
      const h = hero();
      if (!h) return api.scene(BG0, "voce", `<b>${esc(TITLE)}</b><br>${esc((cfg.texts && cfg.texts.noHero) || "Prima crea il tuo Campione.")}`, [
        { label: "Crea il tuo Campione", sub: "Nome, numero e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
        { label: "◂ Indietro", fn: leave },
      ], TITLE);
      castHero();
      const c = activeChapter(), m = mem(), cur = c && m.done[c.n], nextOk = !!CHAPTERS[(c ? c.n : 0) + 1];
      const status = m.done[NCH] ? `Storia conclusa. Finali trovati: ${m.ends.length} su ${Object.keys(ENDINGS).length}.` : cur ? (nextOk ? "Il prossimo capitolo ti aspetta." : "Capitolo concluso · il prossimo è in arrivo.") : goalNow();
      const extra = cfg.mainExtra ? arr(safe(() => cfg.mainExtra(K), [])) : [];
      api.scene(BG0, "voce", `<b>${ICON} ${esc(TITLE)}</b><br>${esc(h.name)}${cfg.heroTitle ? " · " + esc(safe(() => cfg.heroTitle(K), "")) : ""}<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${esc(status)}</span>`, [
        { label: c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Inizia il Capitolo ${c.n}` : "Inizia la storia") : "Continua la storia", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
        { label: JN(), sub: (cfg.journal && cfg.journal.sub) || "Persone, scoperte, finali", fn: () => journal(openMain, false) },
        ...extra,
        { label: `Difficoltà: ${DIFFS[m.diff].label}`, sub: DIFFS[m.diff].sub, fn: () => diffMenu(openMain) },
        { label: "Capitoli", sub: "Rigioca i capitoli già sbloccati", fn: chapters },
        { label: "◂ Indietro", fn: leave },
      ], TITLE);
    }
    function diffMenu(back, first) {
      const m = mem();
      api.scene(BG0, "voce", `<b>${first ? "Prima di cominciare: come vuoi giocare le partite?" : "Difficoltà delle partite"}</b><br><span style="color:var(--dim)">Vale per tutta la saga. La puoi cambiare quando vuoi dal menu della saga. La storia e i finali non cambiano.</span>`,
        Object.keys(DIFFS).map((k) => ({ label: (k === "normale" ? "Normale" : DIFFS[k].label) + (m.diff === k && !first ? " ✓" : ""), sub: DIFFS[k].sub, cls: k === "normale" ? "hot" : "", fn: () => { m.diff = k; m.diffSet = true; save(); back(); } })), TITLE);
    }
    function chapters() {
      const m = mem(), opts = [];
      for (let n = 1; n <= NCH; n++) {
        const c = CHAPTERS[n], open = c && (n === 1 || m.done[n - 1] || m.ch >= n);
        if (open) opts.push({ label: `${m.done[n] ? "✓" : "▸"} Capitolo ${n} · ${c.title}`, sub: m.done[n] ? "Concluso · rigioca" : c.sub || "", cls: m.ch === n ? "hot" : "", fn: () => { m.ch = n; save(); continueStory(); } });
        else opts.push({ label: `• Capitolo ${n} · ${c ? c.title : "???"}`, sub: c ? "Finisci il capitolo prima" : "In arrivo", disabled: true, fn: chapters });
      }
      opts.push({ label: "Ricomincia da capo", sub: "Cancella solo questo salvataggio", fn: resetAsk });
      opts.push({ label: "◂ Indietro", fn: openMain });
      api.scene(BG0, "voce", `<b>Capitoli</b><br>${esc((cfg.texts && cfg.texts.chapters) || "Le scelte restano: cambiano il finale.")}`, opts, TITLE + " · Capitoli");
    }
    function resetAsk() {
      api.scene(BG0, "voce", `<b>Ricominciare?</b><br>Si cancellano scelte, diario e finali di ${esc(TITLE)}. Monete e cosmetici restano tuoi.`, [
        { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
        { label: "◂ No", fn: chapters },
      ], TITLE);
    }
    // «Nella puntata precedente»: se torni dopo qualche ora, tre righe per ricordare dove eri
    function recap(then) {
      const m = mem(), c = activeChapter(); if (!c || !m.last || Date.now() - m.last < 6 * 3600e3 || !m.intro["ch" + c.n]) return then();
      const last = m.log.slice(-2), g = goalNow();
      api.play(lines([["voce", `<b>Nella puntata precedente…</b><br>${esc("Capitolo " + c.n + " · " + c.title)}.${last.length ? "<br>" + last.map((x) => "• " + esc(T(x))).join("<br>") : ""}${g ? "<br><span style='color:var(--dim)'>Adesso: " + esc(g) + "</span>" : ""}`]], BG0), then);
    }
    function continueStory() {
      const c = activeChapter(), m = mem(); if (!c) return;
      if (!m.diffSet && !m.intro["ch" + c.n] && c.n === 1) return diffMenu(continueStory, true);
      if (!m.intro["ch" + c.n]) {
        m.intro["ch" + c.n] = 1; m.last = Date.now(); save();
        return api.play(lines(c.intro(), c.introBg || BG0), () => { const z = ZONES[c.start]; go(c.start, z.spec.start[0], z.spec.start[1]); });
      }
      const zid = m.zone && ZONES[m.zone] && ZONES[m.zone].ch <= m.ch ? m.zone : c.start;
      recap(() => enterZone(zid));
    }

    // -------------------------------------------------------------- kit per i capitoli
    const K = {
      get api() { return api; }, ID, TITLE, TS, T, esc, hash, rnd, pick, safe, F, mem, save, stepOf, setStep, note, once, reward, coinsGive, bal, hero, castHero, stat, bond,
      PASS, say, ask, done, go, enterZone, eraOf, gravity: () => GRV.mode, GRV, filter, setEra: (zid, era) => { F.set("era_" + zid, era || ""); if (api && api.trZone() === zid) { const pos = api.trPos && api.trPos(), tr = api.trRec(); if (pos) tr.pos[zid] = pos; FX.enter = frNow(); FX.title = era && ZONES[zid].spec.eras[era] ? ZONES[zid].spec.eras[era].label || ZONES[zid].spec.short : ZONES[zid].spec.short; api.trGo(zid); refreshZone(); } }, otherSaga: (key) => safe(() => JSON.parse(localStorage.getItem(key) || "null"), null), quest, questDone, questState, evidence: (id, d) => { EVID[id] = d; }, giveClue, hasClue, present, loreList: () => Object.keys(LORE).map((k) => [k, LORE[k]]), enterDoor, leaveInterior, travelMenu, timeNow, playMatch, ownMatch, finishChapter, setTiles, SFX, tone, noise, glow, frNow, refreshZone, bgNow, journal, leave, lines, learnLore, ENDINGS, ZX, light, later, shadow, at, undAt, isFloor, floorPaint, ground, TH,
      P: (x, y, w, h, c) => { ctx(); P(x, y, w, h, c); }, get g() { return ctx(); },
      zone: (zid) => ZONES[zid] || null, inZone: (zid) => !!(api && api.trZone() === zid),
      scene: (ls, then, bg) => api.play(lines(ls, bg || BG0), then),
      lore: (id, d) => { LORE[id] = d; },
      cast: (id, c, bio) => { if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c); if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio; },
      cos: (id, d) => { COS[id] = d; if (api && api.COSM && !api.COSM[id]) api.COSM[id] = d; },
      end: (id) => { const m = mem(); if (ENDINGS[id] && !m.ends.includes(id)) { m.ends.push(id); save(); } },
      ending: (id, d) => { ENDINGS[id] = d; },
      continueStory: () => continueStory(), hasChapter: (n) => !!CHAPTERS[n], setInMatch: (v) => { inMatch = !!v; }, openMain: () => openMain(),
    };
    function addChapter(fn) {
      if (!api) { PENDING.push(fn); return; }
      const def = typeof fn === "function" ? fn(K) : fn;
      if (!def || !def.n || CHAPTERS[def.n]) return;
      CHAPTERS[def.n] = def;
      Object.keys(def.zones || {}).forEach((zid) => registerZone(def.n, zid, def.zones[zid]));
      Object.keys(def.patch || {}).forEach((zid) => { const p = def.patch[zid]; if (p.act && ZONES[zid]) Object.assign(ZONES[zid].Z.act, p.act); });
    }
    function start() {
      Object.keys(COS).forEach((id) => { if (api.COSM && !api.COSM[id]) api.COSM[id] = COS[id]; });
      const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
      const chained = !(desc && desc.set);
      const prev = chained ? window.trTalkHook : null;
      const mineC = (id) => { const zr = zoneRec(); if (!zr || !zr.Z.npcs.some((n) => n.id === id)) return null; return chainFor(zr).find((c) => c.talk && c.talk[id]) || null; };
      const cameoOf = (id) => { const zr = zoneRec(); if (!zr || !zr.Z.npcs.some((n) => n.id === id && n.cameo)) return null; return arr(cfg.cameos).find((c) => c.id === id && c.zone === api.trZone()) || null; };
      window.trTalkHook = function (id) {
        const cm = cameoOf(id); if (cm) { castHero(); F.set("cameo_" + id, true); safe(() => (cm.talk ? cm.talk(K) : say(cm.lines)), null); return true; }
        const c = mineC(id);
        if (c) { // un capitolo può restituire K.PASS: allora risponde il capitolo precedente che conosce quel personaggio
          castHero(); const zr = zoneRec(), list = chainFor(zr).filter((cc) => cc.talk && cc.talk[id]);
          for (const cc of list) { const r = safe(() => cc.talk[id](), null); if (r !== PASS) return true; }
          done(); return true;
        }
        return chained && typeof prev === "function" ? prev(id) : false;
      };
      const prevNews = window.trNewsHook;
      window.trNewsHook = function (id) { if (cameoOf(id)) return !F.is("cameo_" + id); const c = zoneRec() && mineC(id); if (c) return c.news ? !!safe(() => c.news(id, stepOf(c.n)), false) : false; return typeof prevNews === "function" ? prevNews(id) : null; };
      PENDING.splice(0).forEach(addChapter);
      safe(() => { Object.keys(obj(cfg.music)).forEach((id) => api.musicTheme && api.musicTheme(id, cfg.music[id])); const pre = (String(BG0).match(/^[a-z]+_/) || [])[0]; if (pre && cfg.musicMain && api.musicBg) api.musicBg(pre, cfg.musicMain); Object.keys(obj(cfg.musicBg)).forEach((k) => api.musicBg && api.musicBg(k, cfg.musicBg[k])); });
      chip();
      if (cfg.onReady) safe(() => cfg.onReady(K));
    }
    function chip() {
      const cid = "scExit_" + ID; if (document.getElementById(cid)) return;
      if (!document.getElementById("scExitCss")) { const st = document.createElement("style"); st.id = "scExitCss"; st.textContent = ".scExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:6px;border:2px solid;font:700 13px/1.1 Georgia,serif;box-shadow:0 2px 8px #0008}.scExit.on{display:block}body.scMM #stats{margin-bottom:54px}"; document.head.appendChild(st); }
      const b = document.createElement("button"); b.id = cid; b.className = "scExit"; b.type = "button"; b.textContent = "✕ Esci"; b.setAttribute("aria-label", "Esci da " + TITLE);
      b.style.background = TH.chipBg; b.style.borderColor = TH.chipBorder; b.style.color = TH.ink;
      b.onclick = () => { if (inMatch) { const hb = document.getElementById("homeBtn"); if (hb) hb.click(); return; } if (zoneRec()) leave(); };
      document.body.appendChild(b);
      const oc = document.getElementById("ovlCh");
      if (oc) oc.addEventListener("click", (e) => { if (inMatch && e.target && e.target.closest && e.target.closest("button.danger")) { inMatch = false; setTimeout(() => safe(() => api.trExitTo(function () {})), 0); } });
      setInterval(() => {
        const hud = document.getElementById("matchHud"), live = !!(hud && !hud.hidden), zr = zoneRec(), own = !!document.querySelector(".scPitch");
        const on = !own && !!((zr && document.body.classList.contains("borgo")) || (inMatch && live));
        b.classList.toggle("on", on); if (inMatch) document.body.classList.toggle("scMM", !!live); b.textContent = inMatch && live ? "✕ Esci dalla partita" : "✕ Esci";
      }, 400);
    }
    function init() {
      const a = window.__borgoApi;
      if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match || !a.matchPick) { if (++tries < 200) setTimeout(init, 150); return; }
      api = a; start();
    }
    const pub = {
      version: 1, KEY, addChapter, open: openMain, SFX, _has: (n) => !!CHAPTERS[n],
      menuEntry(back) {
        const h = hero(), c = activeChapter(), m = mem();
        return { label: `${ICON} ${TITLE}`, cls: "hot", fn: () => openMain({ onExit: back }), sub: h ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "saga"}${cfg.menuSub ? " · " + cfg.menuSub : ""}` : "Crea prima il tuo campione" };
      },
      endings() { const m = mem(); return Object.keys(ENDINGS).map((k) => ({ id: k, title: ENDINGS[k][0], desc: ENDINGS[k][1], hint: ENDINGS[k][2] || "", found: m.ends.includes(k) })); },
      info() { const m = mem(); return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), ends: m.ends.slice(), flags: Object.assign({}, m.flags), lore: m.lore.slice(), st: Object.assign({}, m.st), wins: m.wins }; },
      _dbg: /[?&]debug\b/.test(location.search || "") ? { mem, ZONES, CHAPTERS, ZX, go, F, LORE, K } : undefined,
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
    registerGuest(cfg, mem);
    return { api: pub, K };
  }

  // ==================================================================== KIT DI PARTITA
  // Campo verticale (si attacca verso l'alto), telecamera che segue il pallone, 2 + portiere per parte.
  // Ganci (tutti facoltativi), ricevono S (lo stato):
  //   setup(S) · tick(S) ogni fotogramma · ballForce(S, b) per spingere il pallone (vento, pendenze) · speed(S, p, v) per cambiare la velocità
  //   bg(g, S, cy) sfondo dietro al campo · field(g, S) sul prato · under(g, S) sotto i giocatori · over(g, S) sopra · hud(g, S) in alto
  //   post(g, S, W, VH) filtri su tutto (bianco e nero, pixel…) · person(g, S, p, look) per disegnare i giocatori a modo proprio
  //   onGoal(S, team) · intro (html) · halftime (testo) · rules { half, extra, keeperSave, steal }
  function pitch(o) {
    if (document.querySelector(".scPitch")) return false;
    o = Object.assign({ half: 40 }, o || {});
    const W = 240, VH = 360, WH = o.long || 600, XL = 30, XR = 210, GY0 = 40, GY1 = WH - 40, GW = o.goalW || 56, CX = 120;
    const DF = DIFFS[o.diff || CUR.diff] || DIFFS.normale, STYLE0 = o.oppStyle || CUR.style || "equilibrata";
    const H = o.hooks || {}, TH = Object.assign({ accent: "#e8c46a", bg: "#14161c", panel: "#2a2c34", border: "#8a8070", ink: "#e8e2d4", font: "Georgia, serif", tira: "#a8322a", passa: "#2c5f8a" }, o.theme || {});
    const snd = {
      kick: () => tone(220, 0.08, "square", 0.07, 0, 120), goal: () => [392, 523, 659, 784].forEach((f, i) => tone(f, 0.2, "triangle", 0.08, i * 0.08)),
      save: () => tone(180, 0.15, "sawtooth", 0.06, 0, 90), whistle: () => { tone(1800, 0.12, "sine", 0.05); tone(1800, 0.3, "sine", 0.05, 0.16); },
    };
    const S = { o, W, VH, WH, XL, XR, GY0, GY1, GW, CX, a: 0, b: 0, half: 0, t: 0, dur: (o.half || 40) * 60, run: false, over: false, fx: [], flash: null, recap: [], shots: 0, pass: 0, cam: WH - VH, shake: 0,
      hero: { x: CX, y: WH - 180, team: 0, me: true }, mate: { x: CX - 40, y: WH - 220, team: 0 }, gk0: { x: CX, y: GY1 - 8, team: 0, gk: true },
      opp: [{ x: CX, y: 180, team: 1 }, { x: CX + 40, y: 150, team: 1 }], gk1: { x: CX, y: GY0 + 8, team: 1, gk: true },
      ball: { x: CX, y: WH / 2, vx: 0, vy: 0, z: 0, vz: 0, own: null, cd: 0 }, ptr: null, keys: {}, data: {}, snd, pop, tone, noise };
    const all = () => [S.hero, S.mate, S.gk0, ...S.opp, S.gk1];
    S.all = all;
    function pop(txt, x, y, col) { S.fx.push({ txt, x, y, t: 55, col: col || TH.accent }); }
    function kickoff(toTeam) {
      const my = WH / 2; S.hero.x = CX; S.hero.y = my + 30; S.mate.x = CX - 40; S.mate.y = my + 60; S.opp[0].x = CX; S.opp[0].y = my - 30; S.opp[1].x = CX + 40; S.opp[1].y = my - 60; S.gk0.x = CX; S.gk1.x = CX;
      const b = S.ball; b.x = CX; b.y = toTeam === 0 ? my + 18 : my - 18; b.vx = b.vy = b.z = b.vz = 0; b.own = toTeam === 0 ? S.hero : S.opp[0]; b.cd = 0; b.last = null;
      if (H.kickoff) safe(() => H.kickoff(S, toTeam));
    }
    S.kickoff = kickoff;
    const stunned = (p) => (p.stun | 0) > 0;
    // il carattere degli avversari, che si adatta al punteggio: chi vince nel finale si chiude, chi perde attacca
    function styleNow() {
      const st = typeof STYLE0 === "function" ? safe(() => STYLE0(S), "equilibrata") : STYLE0, late = S.half === 1 && S.t > S.dur * 0.5, lead = S.b - S.a;
      if (late && lead >= 1 && st !== "contropiede") return "difensiva"; if (late && lead <= -1) return "pressing"; return STYLES[st] ? st : "equilibrata";
    }
    S.styleNow = () => styleNow();
    function speedOf(p) {
      let v = p === S.hero ? 1.65 : p === S.mate ? 1.4 : p.gk ? 1.25 : 1.25 * (o.hard ? 1.1 : 1);
      if (p === S.ball.own) v *= 0.9; if (stunned(p)) v *= 0.15;
      if (p.team === 1) { v *= DF.opp; if ((p.boost | 0) > 0) { v *= 1.2; p.boost--; } }
      return H.speed ? safe(() => H.speed(S, p, v), v) : v;
    }
    const blocked = (x, y) => !!(H.blocked && safe(() => H.blocked(S, x, y), false));
    function step(p, nx, ny) { if (!blocked(nx, p.y)) p.x = nx; if (!blocked(p.x, ny)) p.y = ny; }
    function moveTo(p, tx, ty, sp) { const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy); if (d < 1) return; const v = Math.min(sp, d); step(p, p.x + dx / d * v, p.y + dy / d * v); p.dir = Math.atan2(dy, dx); }
    function kick(p, vx, vy, lob) { const b = S.ball; b.own = null; b.vx = vx; b.vy = vy; b.vz = lob ? 3.2 : 0.8; b.z = 0.1; b.cd = 12; b.last = p; snd.kick(); }
    function shoot(p, power, aimX) {
      const gy = p.team === 0 ? GY0 : GY1, dist = Math.abs(p.y - gy), spread = 6 + dist * 0.08;
      const tx = (aimX == null ? CX : aimX) + (Math.random() - 0.5) * spread * 2, ang = Math.atan2(gy - p.y, tx - p.x);
      kick(p, Math.cos(ang) * power, Math.sin(ang) * power, dist > 200); S.ball.shot = p.team;
      if (p.team === 0) { S.shots++; pop("TIRO!", p.x, p.y - 14, "#ffb347"); }
    }
    function passTo(p, q) {
      const lead = 16, tx = q.x, ty = q.y + (q.team === 0 ? -lead : lead), ang = Math.atan2(ty - p.y, tx - p.x), d = Math.hypot(tx - p.x, ty - p.y), sp = Math.min(5.6, 2.8 + d / 45);
      kick(p, Math.cos(ang) * sp, Math.sin(ang) * sp, d > 120); S.ball.shot = -1; S.ball.passTo = q; if (p.team === 0) S.pass++;
    }
    S.shoot = shoot; S.passTo = passTo; S.moveTo = moveTo; S.speedOf = speedOf;
    // COMANDI: un tocco = come sempre. TIRA tenuto premuto carica il tiro: levetta di lato = tiro a effetto, levetta indietro = pallonetto.
    // PASSA tenuto premuto: con la palla = dai e vai (il compagno te la ridà); senza palla = guidi il compagno con la levetta.
    const joy = () => { if (S.ptr) { const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay; return [Math.abs(jx) > 8 ? Math.sign(jx) : 0, Math.abs(jy) > 8 ? Math.sign(jy) : 0]; } return [(S.keys.ArrowRight ? 1 : 0) - (S.keys.ArrowLeft ? 1 : 0), (S.keys.ArrowDown ? 1 : 0) - (S.keys.ArrowUp ? 1 : 0)]; };
    function act(kind) { press(kind); release(kind); } // compatibilità: un tocco secco
    function press(kind) {
      if (!S.run) return;
      if (H.act && safe(() => H.act(S, kind), false)) return;
      const b = S.ball, h = S.hero;
      if (kind === "tira") {
        if (b.own === h) S.chg = { t: 0 };
        else if (b.own === S.mate) shoot(S.mate, 6.8, CX);
        else if ((h.slide | 0) <= 0 && !stunned(h) && Math.hypot(b.x - h.x, b.y - h.y) < 60) { h.slide = 16; h.dir = Math.atan2(b.y - h.y, b.x - h.x); pop("CONTRASTO!", h.x, h.y - 12, "#ff8a3d"); S.tone(160, 0.12, "sawtooth", 0.05); } // scivolata sul pallone
        else { h.dash = 18; pop("SCATTO!", h.x, h.y - 12, "#7ac8ff"); }
      }
      else if (kind === "passa") { if (b.own === S.mate) { passTo(S.mate, h); return; } S.ph = { t: 0, ball: b.own === h }; }
    }
    function release(kind) {
      const b = S.ball, h = S.hero;
      if (kind === "tira" && S.chg) {
        const t = S.chg.t; S.chg = null; if (!S.run || b.own !== h) return;
        const [jx, jy] = joy(), power = t < 8 ? 7.4 : 6.2 + Math.min(1, t / 40) * 3.4;
        if (t >= 8 && jy > 0) { shoot(h, 5.4, CX); b.vz = 4.4; b.z = 0.5; pop("PALLONETTO!", h.x, h.y - 24, "#ffd23f"); }
        else if (t >= 8 && jx) { shoot(h, power, CX - jx * 18); b.curve = jx * 0.11; pop("A EFFETTO!", h.x, h.y - 24, "#ffd23f"); }
        else { shoot(h, power, CX + (h.x - CX) * 0.2 + (S.ptr ? (S.ptr.x - S.ptr.ax) * 0.8 : 0)); if (t >= 30) { S.shake = 6; pop("BOLIDE!", h.x, h.y - 24, "#ff8a3d"); } }
      }
      if (kind === "passa" && S.ph) {
        const ph = S.ph; S.ph = null; if (!S.run) return;
        if (ph.ball && !ph.done && b.own === h) passTo(h, S.mate);
        else if (!ph.ball && !ph.ctrl) { S.mate.call = 50; pop("QUI!", S.mate.x, S.mate.y - 12, "#7ac8ff"); }
      }
    }
    function holdTick() {
      const b = S.ball, h = S.hero;
      if (h.slide > 0) { // la scivolata: veloce verso il pallone; se lo tocchi lo rubi, se no resti a terra un momento
        h.slide--; const sp = speedOf(h) * 2.3; step(h, h.x + Math.cos(h.dir) * sp, h.y + Math.sin(h.dir) * sp);
        if (Math.hypot(b.x - h.x, b.y - h.y) < 11 && b.own !== h) {
          const owner = b.own, pr = !owner ? 1 : owner.gk ? 0.15 : Math.max(0.35, Math.min(0.92, 0.75 / DF.steal));
          if (Math.random() < pr) { if (owner) { owner.stun = 30; } b.own = h; b.cd = 14; b.passTo = null; b.curve = 0; h.slide = 0; pop("PRESA!", h.x, h.y - 14, "#4fd1a5"); S.data.tackles = (S.data.tackles | 0) + 1; }
          else { h.slide = 0; h.stun = 20; pop("SALTATO!", h.x, h.y - 14, TH.ink); }
        } else if (h.slide === 0) { h.stun = 18; pop("A VUOTO", h.x, h.y - 14, TH.ink); }
      }
      if (S.chg) { S.chg.t++; if (b.own !== h) S.chg = null; else if (S.chg.t >= 50) release("tira"); }
      if (S.ph) {
        S.ph.t++;
        if (S.ph.ball && !S.ph.done && S.ph.t >= 20 && b.own === h) { S.ph.done = true; passTo(h, S.mate); h.dash = 34; S.oneTwo = 100; pop("DAI E VAI!", h.x, h.y - 14, "#7ac8ff"); }
        if (!S.ph.ball && !S.ph.ctrl && S.ph.t >= 12) { S.ph.ctrl = true; pop("GUIDI IL COMPAGNO", S.mate.x, S.mate.y - 14, "#7ac8ff"); }
      }
      if (S.oneTwo > 0) { S.oneTwo--; if (b.own === S.mate && b.cd <= 0) { passTo(S.mate, h); S.oneTwo = 0; pop("…E TORNA!", S.mate.x, S.mate.y - 14, "#7ac8ff"); } }
    }
    S.press = press; S.release = release;
    function control() {
      const h = S.ph && S.ph.ctrl ? S.mate : S.hero; let dx = 0, dy = 0; if ((h.slide | 0) > 0) return;
      if (S.keys.ArrowLeft) dx -= 1; if (S.keys.ArrowRight) dx += 1; if (S.keys.ArrowUp) dy -= 1; if (S.keys.ArrowDown) dy += 1;
      const sp = speedOf(h) * ((h.dash | 0) > 0 ? 1.7 : 1); if (h.dash > 0) h.dash--;
      if (dx || dy) { const d = Math.hypot(dx, dy); step(h, h.x + dx / d * sp, h.y + dy / d * sp); h.dir = Math.atan2(dy, dx); }
      else if (S.ptr) { const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay, jl = Math.hypot(jx, jy); if (jl > 3) { const f = Math.min(1, jl / 16) * sp; step(h, h.x + jx / jl * f, h.y + jy / jl * f); h.dir = Math.atan2(jy, jx); } }
    }
    function ai() {
      if (H.ai && safe(() => H.ai(S), false)) return;
      const b = S.ball, h = S.hero, m = S.mate, [o1, o2] = S.opp;
      if (S.ph && S.ph.ctrl) { /* il compagno lo guidi tu */ }
      else if (b.own === m) { const near = S.opp.some((q) => Math.hypot(q.x - m.x, q.y - m.y) < 28); if (m.y < GY0 + 130 && Math.random() < 0.05) shoot(m, 6.8, CX - 16 + Math.random() * 32); else if (near && Math.random() < 0.07) passTo(m, h); else moveTo(m, CX + Math.sin(S.t / 40) * 50, GY0 + 90, speedOf(m)); }
      else if (b.own === h) moveTo(m, h.x < CX ? CX + 50 : CX - 50, Math.max(GY0 + 60, h.y - 80), speedOf(m));
      else if ((m.call | 0) > 0 || (b.own && b.own.team === 1 && Math.hypot(b.x - m.x, b.y - m.y) < 90) || (!b.own && Math.hypot(b.x - m.x, b.y - m.y) < Math.hypot(b.x - h.x, b.y - h.y))) { moveTo(m, b.x, b.y, speedOf(m)); if (m.call) m.call--; }
      else moveTo(m, h.x < CX ? CX + 50 : CX - 50, Math.min(GY1 - 60, Math.max(GY0 + 80, b.y - 30)), speedOf(m) * 0.8);
      const chaser = Math.hypot(o1.x - b.x, o1.y - b.y) < Math.hypot(o2.x - b.x, o2.y - b.y) ? o1 : o2, sty = styleNow();
      S.opp.forEach((q) => {
        if (b.own === q) {
          const blockers = [h, m].filter((r) => Math.abs(r.x - q.x) < 24 && r.y > q.y && r.y - q.y < 44), near = sty === "difensiva" ? 90 : 120;
          if (q.y > GY1 - near && Math.random() < 0.055 * DF.shot) shoot(q, 6, CX - 16 + Math.random() * 32);
          else if (blockers.length && Math.random() < (sty === "difensiva" ? 0.07 : 0.04)) passTo(q, q === o1 ? o2 : o1);
          else moveTo(q, q.x + (blockers.length ? (q.x < CX ? 20 : -20) : (CX - q.x) * 0.1), GY1, speedOf(q));
        } else if (q === chaser) moveTo(q, b.x, b.y, speedOf(q));
        else if (sty === "pressing" && !(b.own && b.own.team === 1)) moveTo(q, b.x + (q.x < b.x ? -14 : 14), b.y - 10, speedOf(q) * 0.92); // il secondo va a raddoppiare
        else if (sty === "difensiva" && !(b.own && b.own.team === 1)) moveTo(q, Math.max(CX - 40, Math.min(CX + 40, b.x)), GY0 + 70, speedOf(q) * 0.9); // resta davanti alla porta
        else if (sty === "contropiede" && !(b.own && b.own.team === 1)) moveTo(q, CX + (b.x < CX ? 50 : -50), Math.min(GY1 - 110, Math.max((GY0 + GY1) / 2, b.y + 140)), speedOf(q) * 0.8); // aspetta alto, pronto a ripartire
        else moveTo(q, b.own && b.own.team === 1 ? CX + (b.x < CX ? 45 : -45) : (b.x + CX) / 2, b.own && b.own.team === 1 ? Math.min(GY1 - 60, b.y + 50) : Math.max(GY0 + 60, b.y - 60), speedOf(q) * 0.85);
      });
      const gkMove = (gk) => moveTo(gk, Math.max(CX - GW / 2 + 6, Math.min(CX + GW / 2 - 6, b.x)), gk.y, speedOf(gk)); gkMove(S.gk0); gkMove(S.gk1);
    }
    function keeperSave(gk, b) { if (b.z > 14) return false; const sp = Math.hypot(b.vx, b.vy), pr = H.keeper ? safe(() => H.keeper(S, gk, b), null) : null; if (Math.abs(gk.x - b.x) < 12 && Math.random() < (pr != null ? pr : sp > 6.5 ? 0.42 : 0.72) + (gk.team === 0 ? DF.gk0 : DF.gk1)) { b.own = gk; gk.hold = 0; b.cd = 10; b.z = 0; snd.save(); pop("PARATA!", gk.x, gk.y + (gk.team === 1 ? 16 : -10), "#7ac8ff"); return true; } return false; }
    function goal(team) {
      if (team === 0) { S.a++; S.flash = { txt: "GOL!", sub: "", t: 70 }; snd.goal(); S.recap.push(`gol nel ${S.half + 1}° tempo`); }
      else { S.b++; S.flash = { txt: "GOL LORO", sub: "", t: 60 }; snd.save(); }
      if (H.onGoal) safe(() => H.onGoal(S, team));
      kickoff(team === 0 ? 1 : 0); hud();
    }
    function physics() {
      const b = S.ball;
      if (b.cd > 0) b.cd--;
      if (b.own) {
        const p = b.own, a = p.dir == null ? (p.team === 0 ? -Math.PI / 2 : Math.PI / 2) : p.dir;
        b.x = p.x + Math.cos(a) * 7; b.y = p.y + 3 + Math.sin(a) * 7; b.vx = b.vy = 0; b.z = 0;
        if (stunned(p)) { b.own = null; b.vx = (Math.random() - 0.5) * 2; b.vy = (Math.random() - 0.5) * 2; b.cd = 8; return; }
        all().forEach((q) => { if (q.team !== p.team && !q.gk && !stunned(q) && (q.tk | 0) <= 0 && Math.hypot(q.x - b.x, q.y - b.y) < 9) { const pr = q.team === 0 ? 0.55 : 0.22 * (o.hard ? 1.35 : 1) * DF.steal * (styleNow() === "pressing" ? 1.35 : 1); if (Math.random() < pr) { b.own = q; b.cd = 16; pop("RUBATA!", q.x, q.y - 12, TH.ink); if (q.team === 1 && styleNow() === "contropiede") S.opp.forEach((r) => (r.boost = 90)); } q.tk = 24; } });
        all().forEach((q) => { if (q.tk > 0) q.tk--; });
        if (p.gk) { const to = p.team === 0 ? (Math.random() < 0.5 ? S.hero : S.mate) : S.opp[(Math.random() * 2) | 0]; if (++p.hold > 30) { p.hold = 0; passTo(p, to); } }
        return;
      }
      if (b.curve) { b.vx += b.curve; b.curve *= 0.95; if (Math.abs(b.curve) < 0.004) b.curve = 0; } // il tiro a effetto curva
      if (H.ballForce) safe(() => H.ballForce(S, b));
      b.x += b.vx; b.y += b.vy; const fr = b.z > 0.5 ? 0.992 : 0.979; b.vx *= fr; b.vy *= fr;
      if (b.z > 0 || b.vz > 0) { b.z += b.vz; b.vz -= o.gravity || 0.16; if (b.z <= 0) { b.z = 0; b.vz = Math.abs(b.vz) > 1 ? -b.vz * 0.35 : 0; } }
      if (b.x < XL + 2) { b.x = XL + 2; b.vx = Math.abs(b.vx) * 0.6; } if (b.x > XR - 2) { b.x = XR - 2; b.vx = -Math.abs(b.vx) * 0.6; }
      const inGoal = Math.abs(b.x - CX) < GW / 2 && b.z < 18;
      if (b.y < GY0) { if (inGoal) { if (keeperSave(S.gk1, b)) return; return goal(0); } b.y = GY0; b.vy = Math.abs(b.vy) * 0.7; }
      if (b.y > GY1) { if (inGoal) { if (keeperSave(S.gk0, b)) return; return goal(1); } b.y = GY1; b.vy = -Math.abs(b.vy) * 0.7; }
      if (b.cd <= 0 && b.z < 9) {
        let best = null, bd = 9e9;
        all().forEach((q) => { if (stunned(q)) return; const d = Math.hypot(q.x - b.x, q.y - b.y), sp = Math.hypot(b.vx, b.vy), r = q.gk ? 11 : (sp > 4.5 && q !== b.passTo ? 6 : 9); if (d < r && d < bd) { best = q; bd = d; } });
        if (best) { b.own = best; b.passTo = null; b.curve = 0; best.hold = 0; b.z = 0; if (best.gk && b.shot != null && b.shot !== best.team && Math.hypot(b.vx, b.vy) > 3) { snd.save(); pop("PARATA!", best.x, best.y - 12, "#7ac8ff"); } }
      }
    }
    function person(g, p, look, own) {
      if (H.person && safe(() => H.person(g, S, p, look, own), false)) return;
      const st = stunned(p);
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(p.x, p.y + 7, 7, 3, 0, 0, 7); g.fill();
      g.fillStyle = look.shirt; g.strokeStyle = "#1a1a1a"; g.lineWidth = 1.2; g.beginPath(); g.arc(p.x, p.y + 1, 6, 0, 7); g.fill(); g.stroke();
      g.fillStyle = look.skin || "#e0b48a"; g.beginPath(); g.arc(p.x, p.y - 6, 4.5, 0, 7); g.fill(); g.stroke();
      if (look.hair) { g.fillStyle = look.hair; g.beginPath(); g.arc(p.x, p.y - 7.5, 4.5, Math.PI, 0); g.fill(); }
      if (own) { g.strokeStyle = TH.accent; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y + 1, 9, 0, 7); g.stroke(); }
      if (st) { g.fillStyle = "#ffd36b"; g.font = "8px serif"; g.fillText("✦", p.x - 3 + Math.sin(S.t / 3) * 3, p.y - 14); }
      if (look.label) { g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#f2ead8"; g.fillText(look.label, p.x, p.y + 16); g.textAlign = "left"; }
    }
    function draw() {
      const g = S.g, b = S.ball;
      const target = Math.max(0, Math.min(WH - VH, b.y - VH * 0.5)); S.cam += (target - S.cam) * 0.12; const cy = S.cam, sh = S.shake > 0 ? (Math.random() - 0.5) * S.shake * 0.5 : 0; if (S.shake > 0) S.shake--;
      g.fillStyle = TH.bg; g.fillRect(0, 0, W, VH);
      if (H.bg) safe(() => H.bg(g, S, cy));
      g.save(); g.translate(sh, -cy);
      if (H.field) safe(() => H.field(g, S));
      else { for (let y = 0; y < WH; y += 30) { g.fillStyle = (y / 30) % 2 ? "#4f8a3e" : "#57943f"; g.fillRect(XL, y, XR - XL, 30); } }
      g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 1.5; g.strokeRect(XL, GY0, XR - XL, GY1 - GY0); g.beginPath(); g.moveTo(XL, (GY0 + GY1) / 2); g.lineTo(XR, (GY0 + GY1) / 2); g.stroke(); g.beginPath(); g.arc(CX, (GY0 + GY1) / 2, 22, 0, 7); g.stroke();
      g.strokeRect(CX - 44, GY0, 88, 36); g.strokeRect(CX - 44, GY1 - 36, 88, 36);
      g.fillStyle = "#f2efe6"; g.fillRect(CX - GW / 2, GY0 - 10, GW, 10); g.fillRect(CX - GW / 2, GY1, GW, 10); g.strokeStyle = "#2a2a2a"; g.lineWidth = 1.5; g.strokeRect(CX - GW / 2, GY0 - 10, GW, 10); g.strokeRect(CX - GW / 2, GY1, GW, 10);
      if (H.under) safe(() => H.under(g, S));
      const O = o, hc = O.hero || {}, mc = O.mate || {}, kit = (O.opp && O.opp.kit) || "#2a2a33", names = (O.opp && O.opp.names) || ["", ""], skins = (O.opp && O.opp.skins) || ["#d9b38c", "#c68642"], hairs = (O.opp && O.opp.hairs) || ["#1a1a1a", "#3a2a1a"];
      const list = [[S.gk0, { shirt: O.gk0 || "#e8c46a", skin: hc.skin, hair: "#2b1d14" }], [S.mate, { shirt: mc.shirt || TH.passa, skin: mc.skin, hair: mc.hair, label: (mc.name || "").split(" ")[0] }], [S.hero, { shirt: hc.shirt || TH.tira, skin: hc.skin, hair: hc.hair, label: hc.name || "Tu" }], [S.opp[0], { shirt: kit, skin: skins[0], hair: hairs[0], label: names[0] }], [S.opp[1], { shirt: kit, skin: skins[1], hair: hairs[1], label: names[1] }], [S.gk1, { shirt: O.gk1 || "#5a5a62", skin: "#e0b48a", hair: "#1a1a1a" }]];
      list.sort((p, q) => p[0].y - q[0].y).forEach(([p, look]) => person(g, p, look, b.own === p));
      // il pallone, con l'ombra a terra quando vola
      if (b.z > 0.5) { g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(b.x, b.y + 2, 3.5, 1.6, 0, 0, 7); g.fill(); }
      const by = b.y - b.z, br = 3.5 + Math.min(2.5, b.z / 12);
      g.fillStyle = "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1.2; g.beginPath(); g.arc(b.x, by, br, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#111"; g.beginPath(); g.arc(b.x, by, br * 0.34, 0, 7); g.fill();
      if (S.chg) { const k = Math.min(1, S.chg.t / 40), hx = S.hero.x, hy = S.hero.y + 12; g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(hx - 13, hy, 26, 4); g.fillStyle = k < 0.5 ? "#ffd23f" : k < 0.9 ? "#ff8a3d" : "#ff4d5a"; g.fillRect(hx - 12, hy + 1, 24 * k, 2); }
      if (S.ph && S.ph.ctrl) { const mx = S.mate.x, my = S.mate.y - 20 + Math.sin(S.t / 6) * 1.5; g.fillStyle = "#7ac8ff"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(mx - 5, my - 6); g.lineTo(mx + 5, my - 6); g.lineTo(mx, my); g.closePath(); g.fill(); g.stroke(); }
      if (H.over) safe(() => H.over(g, S));
      if (S.run) { const hx = S.hero.x, hy = S.hero.y - 20 + Math.sin(S.t / 6) * 1.5; g.fillStyle = "#ffd23f"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx - 6, hy - 7); g.lineTo(hx + 6, hy - 7); g.lineTo(hx, hy); g.closePath(); g.fill(); g.stroke(); }
      S.fx = S.fx.filter((f) => f.t > 0); S.fx.forEach((f) => { f.t--; f.y -= 0.4; g.font = `900 11px ${TH.font}`; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#111"; g.strokeText(f.txt, f.x, f.y); g.fillStyle = f.col; g.fillText(f.txt, f.x, f.y); g.textAlign = "left"; });
      g.restore();
      const hy0 = S.hero.y - cy; if (hy0 < 6 || hy0 > VH - 6) { const yy = hy0 < 6 ? 22 : VH - 8; g.fillStyle = "#ffd23f"; g.beginPath(); if (hy0 < 6) { g.moveTo(S.hero.x - 6, yy); g.lineTo(S.hero.x + 6, yy); g.lineTo(S.hero.x, yy - 8); } else { g.moveTo(S.hero.x - 6, yy); g.lineTo(S.hero.x + 6, yy); g.lineTo(S.hero.x, yy + 6); } g.closePath(); g.fill(); }
      if (H.post) safe(() => H.post(g, S, W, VH));
      if (S.ptr && S.run) { const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay, jl = Math.hypot(jx, jy), k = jl > 24 ? 24 / jl : 1; g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(S.ptr.ax, S.ptr.ay, 26, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 2; g.beginPath(); g.arc(S.ptr.ax, S.ptr.ay, 26, 0, 7); g.stroke(); g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(S.ptr.ax + jx * k, S.ptr.ay + jy * k, 10, 0, 7); g.fill(); }
      if (S.flash && S.flash.t > 0) { S.flash.t--; g.fillStyle = "rgba(10,12,18,.75)"; g.fillRect(0, VH / 2 - 24, W, 44); g.fillStyle = TH.accent; g.font = `900 22px ${TH.font}`; g.textAlign = "center"; g.fillText(S.flash.txt, W / 2, VH / 2 + 2); if (S.flash.sub) { g.font = "bold 10px sans-serif"; g.fillStyle = TH.ink; g.fillText(S.flash.sub, W / 2, VH / 2 + 15); } g.textAlign = "left"; }
      g.fillStyle = "rgba(10,12,18,.8)"; g.fillRect(0, 0, W, 15); g.fillStyle = TH.accent; g.font = "bold 9px sans-serif"; g.fillText(`${S.extra ? "suppl." : S.half === 0 ? "1° tempo" : "2° tempo"} · ${Math.max(0, Math.ceil((S.dur - S.t) / 60))}s`, 5, 11);
      g.font = "bold 7px sans-serif"; g.fillStyle = "rgba(232,226,212,.75)"; g.fillText(`${DF.label.toUpperCase()} · avversari: ${STYLES[styleNow()]}`, 5, 24);
      if (H.hud) safe(() => H.hud(g, S));
    }
    function hud() { if (!S.el) return; S.el.querySelector(".n0").textContent = o.us || "Noi"; S.el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; S.el.querySelector(".n1").textContent = (o.opp && o.opp.name) || "Avversari"; }
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const bt = document.createElement("button"); bt.type = "button"; bt.className = "tira"; bt.textContent = btn; bt.style.background = TH.tira; bt.style.borderColor = TH.border; bt.onclick = () => { ov.remove(); fn(); }; ov.appendChild(bt); S.el.appendChild(ov); return ov; }
    function endHalf() {
      S.run = false; snd.whistle();
      if (S.half === 0) { S.half = 1; return card(`Fine del primo tempo · ${S.a} – ${S.b}`, `<p>${esc(o.halftime || "Si cambia aria. Secondo tempo.")}</p>`, "Secondo tempo ▸", () => { S.t = 0; kickoff(1); S.run = true; snd.whistle(); if (H.second) safe(() => H.second(S)); }); }
      if (S.a === S.b && !S.extra && o.extra !== false) { S.extra = true; S.t = 0; S.dur = 20 * 60; S.flash = { txt: "SUPPLEMENTARI!", sub: "chi segna vince", t: 80 }; kickoff(0); S.run = true; return; }
      finish();
    }
    function finish(quit) {
      if (S.over) return; S.over = true; S.run = false;
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: S.data };
      const extra = H.result ? safe(() => H.result(S, res), "") : "";
      card(quit ? "Partita abbandonata" : res.win ? (o.winTitle || "VITTORIA!") : S.a === S.b ? "Pareggio" : "Sconfitta", `<p style="font-size:22px;font-weight:900">${S.a} – ${S.b}</p><p>Tiri ${S.shots} · Passaggi ${S.pass} · Contrasti vinti ${S.data.tackles | 0}${extra ? " · " + extra : ""}</p>`, "Continua ▸", () => close(res));
    }
    function close(res) { CUR = { diff: "normale", style: "" }; cancelAnimationFrame(S.raf); window.removeEventListener("keydown", S.kd, true); window.removeEventListener("keyup", S.ku, true); S.el.remove(); PITCH = null; try { o.onDone(res); } catch (e) { console.error(e); } }
    // i pulsanti cambiano nome a seconda di chi ha la palla: TIRA/PASSA con la palla, CONTRASTO/CHIAMA senza
    let LBL = "";
    function labels() {
      const b = S.ball, mine = b.own === S.hero || b.own === S.mate, near = Math.hypot(b.x - S.hero.x, b.y - S.hero.y) < 60, k = (mine ? "m" : near ? "n" : "f") + (b.own === S.hero ? "h" : "");
      if (k === LBL || !S.el) return; LBL = k;
      S.el.querySelector(".tira").textContent = mine ? o.tiraLabel || "TIRA" : near ? "CONTRASTO" : "SCATTO";
      S.el.querySelector(".passa").textContent = mine ? o.passaLabel || "PASSA" : "CHIAMA";
    }
    function loop() {
      if (S.over && !S.el.isConnected) return;
      if (S.run) {
        S.t++; holdTick(); control(); ai(); if (H.tick) safe(() => H.tick(S)); physics();
        [S.hero, S.mate, ...S.opp].forEach((p) => { p.x = Math.max(XL + 4, Math.min(XR - 4, p.x)); p.y = Math.max(GY0 + 4, Math.min(GY1 - 4, p.y)); if (p.stun > 0) p.stun--; });
        if (S.t >= S.dur || (S.extra && S.a !== S.b)) endHalf();
      }
      draw(); labels(); S.raf = requestAnimationFrame(loop);
    }
    // interfaccia
    if (!document.getElementById("scPitchCss")) {
      const st = document.createElement("style"); st.id = "scPitchCss";
      st.textContent = `.scPitch{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:8px 8px 10px;gap:6px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none}
.scPitch .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid;border-radius:6px;padding:4px 10px;font-weight:800;font-size:13px}
.scPitch .hud .n1{text-align:right}.scPitch .hud .n0,.scPitch .hud .n1{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.scPitch .hud .sc{font-size:22px;letter-spacing:2px}
.scPitch canvas{width:min(100%,420px,calc((100vh - 170px) * 0.6667));aspect-ratio:2/3;border:2px solid;border-radius:4px;touch-action:none}
.scPitch .pad{width:min(100%,420px);display:grid;grid-template-columns:1fr 1fr 70px;gap:8px}
.scPitch button{font:800 16px system-ui,sans-serif;border:2px solid;border-radius:8px;padding:12px 6px;cursor:pointer;color:#fff}.scPitch .esci{font-size:12px}
.scPitch .ov{position:absolute;inset:0;background:rgba(10,12,18,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;overflow:auto}
.scPitch .card{border:2px solid;border-radius:8px;padding:12px;max-width:400px;width:100%}.scPitch .card h3{margin:0 0 6px;font-size:20px}.scPitch .card p{margin:4px 0;font-size:14px;line-height:1.35}`;
      document.head.appendChild(st);
    }
    const el = document.createElement("div"); el.className = "scPitch"; el.style.background = TH.bg; el.style.color = TH.ink;
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${VH * 2}"></canvas><div class="pad"><button type="button" class="tira">${esc(o.tiraLabel || "TIRA")}</button><button type="button" class="passa">${esc(o.passaLabel || "PASSA")}</button><button type="button" class="esci">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    const hb = el.querySelector(".hud"); hb.style.background = TH.panel; hb.style.borderColor = TH.border; el.querySelector(".sc").style.cssText = `color:${TH.accent};font-family:${TH.font}`;
    el.querySelectorAll("button").forEach((b) => { b.style.borderColor = TH.border; }); el.querySelector(".tira").style.background = TH.tira; el.querySelector(".passa").style.background = TH.passa; el.querySelector(".esci").style.background = TH.panel;
    const cv = el.querySelector("canvas"); cv.style.borderColor = TH.border; S.g = cv.getContext("2d"); S.g.scale(2, 2);
    const css2 = () => { el.querySelectorAll(".card").forEach((c) => { c.style.background = TH.panel; c.style.borderColor = TH.border; const h3 = c.querySelector("h3"); if (h3) { h3.style.color = TH.accent; h3.style.fontFamily = TH.font; } }); };
    new MutationObserver(css2).observe(el, { childList: true });
    const toLocal = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * VH }; };
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const q = toLocal(e); S.ptr = { ax: q.x, ay: q.y, x: q.x, y: q.y }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (S.ptr) { const q = toLocal(e); S.ptr.x = q.x; S.ptr.y = q.y; } });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => cv.addEventListener(ev, () => { S.ptr = null; }));
    [["tira", ".tira"], ["passa", ".passa"]].forEach(([k, sel]) => { const bt = el.querySelector(sel); bt.addEventListener("pointerdown", (e) => { e.preventDefault(); try { bt.setPointerCapture(e.pointerId); } catch (er) {} press(k); }); ["pointerup", "pointercancel"].forEach((ev) => bt.addEventListener(ev, () => release(k))); });
    el.querySelector(".esci").onclick = () => { if (!S.over) finish(true); };
    S.kd = (e) => { if (/^Arrow/.test(e.key)) { S.keys[e.key] = true; e.preventDefault(); e.stopPropagation(); } else if (e.key === " " || e.key === "z") { if (!e.repeat) press("tira"); e.preventDefault(); e.stopPropagation(); } else if (e.key === "x") { if (!e.repeat) press("passa"); e.preventDefault(); e.stopPropagation(); } };
    S.ku = (e) => { if (/^Arrow/.test(e.key)) { S.keys[e.key] = false; e.stopPropagation(); } else if (e.key === " " || e.key === "z") { release("tira"); e.stopPropagation(); } else if (e.key === "x") { release("passa"); e.stopPropagation(); } };
    window.addEventListener("keydown", S.kd, true); window.addEventListener("keyup", S.ku, true);
    S.act = act; S.finish = finish; S.goal = goal; S.card = card;
    if (H.setup) safe(() => H.setup(S));
    kickoff(0); hud();
    card(o.title || "Partita", `${o.intro || ""}<p style="opacity:.85;font-size:12.5px">Difficoltà: <b>${DF.label}</b> · avversari: <b>${STYLES[STYLES[STYLE0] ? STYLE0 : "equilibrata"]}</b></p><p><b>Levetta</b>: appoggia il dito dove vuoi sul campo e trascinalo; il Campione ha la freccia gialla. <b>${esc(o.tiraLabel || "TIRA")}</b>: un tocco tira, <b>tienilo premuto</b> per caricare (levetta di lato = a effetto, levetta indietro = pallonetto); senza palla diventa <b>CONTRASTO</b> (scivolata: se prendi il pallone è tuo, se sbagli resti a terra un momento) o <b>SCATTO</b> se la palla è lontana. <b>${esc(o.passaLabel || "PASSA")}</b>: un tocco passa; tenuto premuto con la palla è il <b>dai e vai</b>, senza palla <b>guidi il compagno</b> con la levetta. Si attacca verso l'alto.</p>`, "Fischio d'inizio ▸", () => { S.run = true; snd.whistle(); });
    css2(); PITCH = S; loop(); return true;
  }
  let PITCH = null;

  // ospiti al Borgo: cfg.guest = { id, lines } → il personaggio passa a trovarti nel Borgo Marino quando la saga ha almeno un finale
  function registerGuest(cfg, mem) { if (!cfg.guest) return; const go = (n) => { if (window.__borgoGuests) window.__borgoGuests.add({ id: cfg.guest.id, lines: cfg.guest.lines, when: () => safe(() => mem().ends.length > 0, false) }); else if (n < 60) setTimeout(() => go(n + 1), 250); }; go(0); }
  window.__sagaCore = { version: 1, create, pitch, filter, get pitchState() { return PITCH; }, get cur() { return Object.assign({}, CUR, { opts: DIFFS[CUR.diff] || DIFFS.normale }); }, endMatch: () => { CUR = { diff: "normale", style: "" }; }, setCur: (diff, style) => { CUR = { diff: DIFFS[diff] ? diff : "normale", style: STYLES[style] ? style : "" }; }, DIFFS, STYLES, util: { safe, esc, hash, rnd, pick, tone, noise, frNow } };
})();
