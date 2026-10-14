// js/dungeon-partita.js - «LE STANZE DELL'IPOGEO» · la partita originale di «Dungeon di Fine Stagione» (motore proprio, NON il kit di partita)
// Una partita è una STANZA di un dungeon-stadio: campo piccolo (15×9 caselle) visto dall'alto, in pixel art scura con luci di torcia,
// con pilastri, spine che escono dal pavimento, getti di fuoco e fosse senza fondo. Giochi da SOLO contro un avversario mitico che ha
// UNA meccanica sua (il Minotauro carica in linea retta, Meda ti pietrifica con lo sguardo, i Cerbero hanno tre teste in porta…).
//  - Comandi: trascina sul campo per muoverti (levetta) · SCATTO (schivata che travolge e, sul pallone, fa un tiro forte) · TIRO.
//    Tastiera: frecce/WASD, Spazio = tiro, Maiusc/X = scatto.
//  - Il pallone è fisico: lo porti col corpo, rimbalza su pilastri e pareti, cade nelle fosse. Segna nel portale dell'avversario.
//  - Hai dei CUORI (il «fiato»): le trappole e gli attacchi mitici li tolgono; a zero sei a terra e la stanza è persa.
//  - I DONI: dopo ogni stanza si sceglie 1 tra 3 doni. Valgono SOLO dentro la run in corso (non toccano mai le partite normali).
// Uso: window.__dungeon.start({ title, us, usColor, kind, layout, lvl, seed, gifts:[ids], hearts, maxHearts, time, goals, opp:{ name, color, style },
//        hero:{ name }, heroLook:{ skin, hair, shirt }, bonus:{ at, df, te }, intro, onDone })  → r.data = { kind, hearts, hits, perfect, ko, gifts, secs }
//   start({ run: true, rooms: 3, opp: { kind } }) gioca una piccola run intera (3 stanze con i doni in mezzo): è quello che usano la Sala Giochi e i Sogni.
//   window.__dungeon.pickGift({ have, seed, min, title }, cb) apre la scelta dei 3 doni; GIFTS, KINDS, LAYOUTS sono esportati.
// Si aggancia a window.__dungeon (creato da js/dungeon.js, la saga): state, start, pickGift, GIFTS, KINDS.
(function () {
  "use strict";
  const A = window.__dungeon || (window.__dungeon = {});
  if (A.start) return;
  const T = 16, GW = 15, GH = 9, W = GW * T, H = GH * T, GY0 = 48, GY1 = 96, MY = 72;
  const R = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), hyp = Math.hypot;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; return h >>> 0; };
  const rng = (seed) => { let s = hash(seed) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const util = () => (window.__sagaCore && window.__sagaCore.util) || null;
  const tone = (f, d, t, v, w, sl) => { const u = util(); if (u) u.tone(f, d, t, v, w, sl); };
  const noise = (d, v, hp) => { const u = util(); if (u) u.noise(d, v, hp); };
  let STATE = null;

  // ------------------------------------------------------------------ i mitici (una meccanica ciascuno)
  const KINDS = {
    scheletri: { name: "Gli Scheletri del Terzo Anello", e: "💀", col: "#cfc8b4", goals: 2, layouts: ["pilastri", "colonne"], hint: "Se li travolgi con lo scatto cadono a pezzi per un po': approfittane." },
    arpie: { name: "Le Arpie del Fischio", e: "🦅", col: "#9a5ac8", goals: 2, layouts: ["fosse", "pilastri"], hint: "Le arpie rubano il pallone in volo e lo portano via: colpiscile con lo scatto per farlo cadere." },
    golem: { name: "Il Golem di Pietra Pomice", e: "🗿", col: "#8a8478", goals: 2, layouts: ["pilastri", "spine"], hint: "Il golem blocca la porta. Fagli rimbalzare il pallone addosso per incrinarlo. Attento ai massi che cadono." },
    medusa: { name: "Meda, la Medusa Mediana", e: "🐍", col: "#4ab87a", goals: 2, layouts: ["colonne", "bracieri"], hint: "Lo sguardo di Meda ti pietrifica: nasconditi dietro i pilastri quando il cono diventa rosso." },
    idra: { name: "L'Idra dalle Mille Maglie", e: "🐉", col: "#7ac84a", goals: 3, layouts: ["bracieri", "fosse"], hint: "A ogni gol l'Idra mette su una testa nuova. Non fermarti nelle pozze di acido." },
    spettri: { name: "Gli Spettri dell'Ultimo Minuto", e: "👻", col: "#a8c8f0", goals: 2, layouts: ["spine", "colonne"], hint: "Gli spettri passano nei muri quando sono trasparenti: colpiscili solo quando sono solidi." },
    cerbero: { name: "Cerbero, portiere a tre teste", e: "🐕", col: "#c83a2a", goals: 3, boss: 1, layouts: ["bracieri"], hint: "Tre teste in porta, mai ferme: tira dove non ci sono. Più segni, più corrono." },
    minotauro: { name: "Asterio, il Terzino del Labirinto", e: "🐂", col: "#a8503a", goals: 2, boss: 1, layouts: ["arena"], hint: "Asterio carica in linea retta (lo vedi dalla striscia rossa). Schivalo con lo scatto e fallo sbattere contro un pilastro." },
    cenere: { name: "Mister Cenere", e: "🔥", col: "#ff7a1a", goals: 3, boss: 2, layouts: ["tribuna"], hint: "Il suo fischio manda un'onda: ripararsi dietro un pilastro o schivare con lo scatto. Più segni, peggio va." },
  };
  const LAYOUTS = {
    pilastri: [[4, 2, "p"], [4, 6, "p"], [7, 4, "p"], [10, 2, "p"], [10, 6, "p"]],
    colonne: [[5, 1, "p"], [5, 2, "p"], [9, 6, "p"], [9, 7, "p"], [7, 4, "p"], [3, 4, "p"], [11, 4, "p"]],
    fosse: [[6, 3, "L"], [6, 5, "L"], [8, 3, "L"], [8, 5, "L"], [7, 1, "p"], [7, 7, "p"]],
    spine: [[4, 3, "^"], [4, 5, "^"], [7, 2, "^"], [7, 6, "^"], [10, 3, "^"], [10, 5, "^"], [7, 4, "p"]],
    bracieri: [[4, 4, "f"], [10, 4, "f"], [7, 2, "f"], [7, 6, "f"], [6, 4, "p"], [8, 4, "p"]],
    arena: [[5, 3, "p"], [5, 5, "p"], [9, 3, "p"], [9, 5, "p"], [7, 1, "^"], [7, 7, "^"]],
    tribuna: [[4, 2, "p"], [4, 6, "p"], [10, 2, "p"], [10, 6, "p"], [7, 4, "p"]],
  };

  // ------------------------------------------------------------------ i doni (valgono solo dentro la run)
  const GIFTS = {
    scarpe: { n: "Scarpini di Brace", e: "👟", r: "c", d: "Corri più veloce (+12%)." },
    cuore: { n: "Cuore di Pietra", e: "🪨", r: "c", d: "+1 cuore massimo, e ne recuperi uno." },
    tiro_forte: { n: "Piede di Tuono", e: "🦶", r: "c", d: "I tiri partono più forti (+25%)." },
    magnete: { n: "Calamita d'Ossidiana", e: "🧲", r: "c", d: "Il pallone ti resta incollato ai piedi." },
    lanterna: { n: "Lanterna del Mister", e: "🏮", r: "c", d: "Trappole e attacchi si annunciano più a lungo." },
    clessidra: { n: "Clessidra Spezzata", e: "⏳", r: "c", d: "+12 secondi in ogni stanza." },
    scatto_lungo: { n: "Scatto Lungo", e: "💨", r: "c", d: "Lo scatto va più lontano e si ricarica prima." },
    rimbalzo: { n: "Rimbalzo di Ferro", e: "🏓", r: "c", d: "Il pallone rimbalza sulle pareti senza perdere forza." },
    scatto2: { n: "Doppio Scatto", e: "⚡", r: "r", d: "Due cariche di scatto, una dopo l'altra." },
    scudo: { n: "Scudo di Rune", e: "🛡️", r: "r", d: "In ogni stanza il primo colpo non ti toglie niente." },
    perforante: { n: "Tiro Perforante", e: "🏹", r: "r", d: "I tuoi tiri attraversano chi si para davanti." },
    gol_cuore: { n: "Gol di Brace", e: "❤️‍🔥", r: "r", d: "Ogni gol che segni ti restituisce un cuore." },
    occhio: { n: "Specchio di Meda", e: "🪞", r: "e", d: "Lo sguardo non ti ferma. E chi travolgi resta stordito il doppio." },
    patto: { n: "Patto del Fischietto", e: "📯", r: "e", d: "Ti basta un gol in meno per vincere, ma hai un cuore massimo in meno." },
    scia: { n: "Scia Rovente", e: "☄️", r: "e", d: "Lo scatto lascia una scia di fuoco che stordisce chi la tocca." },
    fulmine: { n: "Tiro Fulmine", e: "🌩️", r: "e", d: "Il tiro subito dopo uno scatto è velocissimo e stordisce chi colpisce." },
  };
  const RARC = { c: ["Comune", "#9aa5b1"], r: ["Raro", "#3a8ad8"], e: ["Epico", "#d8903a"] };
  function rollGifts(have, seed, min) {
    const r = rng("dg-gift-" + seed), pool = Object.keys(GIFTS).filter((id) => !(have || []).includes(id)), out = [];
    const rar = () => { const x = r(); return min === "r" ? (x < 0.7 ? "r" : "e") : x < 0.58 ? "c" : x < 0.88 ? "r" : "e"; };
    for (let guard = 0; out.length < 3 && guard < 60; guard++) {
      const want = rar(), cand = pool.filter((id) => !out.includes(id) && GIFTS[id].r === want);
      if (cand.length) out.push(cand[Math.floor(r() * cand.length)]);
      else if (guard > 40) { const any = pool.filter((id) => !out.includes(id)); if (any.length) out.push(any[Math.floor(r() * any.length)]); }
    }
    return out;
  }
  function mods(gifts, bonus) {
    const g = new Set(gifts || []), b = bonus || {};
    return {
      speed: g.has("scarpe") ? 1.12 : 1, maxHearts: 4 + (g.has("cuore") ? 1 : 0) - (g.has("patto") ? 1 : 0) + ((b.df | 0) >= 2 ? 1 : 0),
      charges: g.has("scatto2") ? 2 : 1, dashLen: g.has("scatto_lungo") ? 1.4 : 1, dashCd: g.has("scatto_lungo") ? 0.72 : 1,
      kick: (g.has("tiro_forte") ? 1.25 : 1) * (1 + 0.03 * (b.at | 0)), magnet: g.has("magnete"), warn: g.has("lanterna") ? 1.45 : 1, time: (g.has("clessidra") ? 12 : 0) + 3 * (b.te | 0),
      bounce: g.has("rimbalzo"), shield: g.has("scudo"), pierce: g.has("perforante"), heal: g.has("gol_cuore"), eye: g.has("occhio"), pact: g.has("patto"), trail: g.has("scia"), thunder: g.has("fulmine"),
    };
  }

  // ------------------------------------------------------------------ mappa
  function buildGrid(layout) {
    const rows = []; for (let y = 0; y < GH; y++) { const r = []; for (let x = 0; x < GW; x++) { let c = "."; if (y === 0 || y === GH - 1) c = "#"; else if (x === 0) c = y >= 3 && y <= 5 ? "G" : "#"; else if (x === GW - 1) c = y >= 3 && y <= 5 ? "g" : "#"; r.push(c); } rows.push(r); }
    (LAYOUTS[layout] || LAYOUTS.pilastri).forEach(([x, y, c]) => { rows[y][x] = c; });
    return rows;
  }

  // ------------------------------------------------------------------ pixel art (tessere 16×16 disegnate a mano, una volta sola)
  let TILES = null;
  function mk(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function buildTiles() {
    const t = {}, px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    const floor = (seed, base, dark, lite) => { const c = mk(T, T), g = c.getContext("2d"); px(g, 0, 0, T, T, base); px(g, 0, 15, T, 1, dark); px(g, 15, 0, 1, T, dark); px(g, 0, 0, T, 1, lite); px(g, 0, 0, 1, T, lite); const r = rng("fl" + seed); for (let i = 0; i < 9; i++) px(g, (r() * 14 + 1) | 0, (r() * 14 + 1) | 0, 1, 1, i % 2 ? dark : lite); if (seed % 3 === 0) { px(g, 3, 5, 4, 1, dark); px(g, 6, 6, 3, 1, dark); px(g, 9, 7, 2, 1, dark); } return c; };
    t.f = [floor(1, "#3b3430", "#2c2623", "#4a423c"), floor(2, "#38322e", "#2a2421", "#473f39"), floor(3, "#3e3732", "#2e2824", "#4d453f"), floor(4, "#3a332f", "#2b2522", "#483f3a")];
    const wall = (k) => { const c = mk(T, T), g = c.getContext("2d"); px(g, 0, 0, T, T, "#241d1c"); for (let r = 0; r < 4; r++) { const o = (r + k) % 2 ? 0 : 4; for (let x = -4 + o; x < T; x += 8) { px(g, x + 1, r * 4 + 1, 7, 3, r % 2 ? "#4a403c" : "#51463f"); px(g, x + 1, r * 4 + 1, 7, 1, "#625348"); } } return c; };
    t.w = [wall(0), wall(1)];
    { const c = mk(T, T), g = c.getContext("2d"); px(g, 0, 0, T, T, "#2c2623"); px(g, 2, 3, 12, 12, "#50463f"); px(g, 3, 2, 10, 2, "#6a5c50"); px(g, 2, 4, 2, 11, "#6a5c50"); px(g, 12, 4, 2, 11, "#3a322d"); px(g, 4, 6, 8, 8, "#5a4f46"); px(g, 7, 7, 2, 5, "#ff9a3a"); px(g, 6, 9, 4, 1, "#ff9a3a"); px(g, 2, 14, 12, 2, "#1a1513"); t.p = c; }
    const spike = (lv) => { const c = mk(T, T), g = c.getContext("2d"); g.drawImage(t.f[0], 0, 0); px(g, 1, 1, 14, 14, "#2a2421"); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const x = 2 + i * 3.5 | 0, y = 2 + j * 3.5 | 0; if (lv === 0) px(g, x, y, 2, 2, "#15110f"); else if (lv === 1) { px(g, x, y, 2, 2, "#6a6460"); px(g, x, y, 1, 1, "#c8c0b4"); } else { px(g, x, y - 1, 2, 4, "#c8c0b4"); px(g, x, y - 2, 1, 2, "#fff"); px(g, x + 1, y + 1, 1, 2, "#6a6460"); } } return c; };
    t.s = [spike(0), spike(1), spike(2)];
    const vent = (lv) => { const c = mk(T, T), g = c.getContext("2d"); g.drawImage(t.f[1], 0, 0); px(g, 3, 3, 10, 10, "#1a1513"); px(g, 4, 4, 8, 8, "#2c2623"); if (lv >= 1) { px(g, 5, 5, 6, 6, lv === 1 ? "#7a2a14" : "#ff6a1a"); px(g, 6, 6, 4, 4, lv === 1 ? "#c8501a" : "#ffd23f"); } else { px(g, 6, 6, 4, 4, "#15110f"); px(g, 7, 7, 2, 2, "#3a1a10"); } return c; };
    t.v = [vent(0), vent(1), vent(2)];
    t.L = []; for (let k = 0; k < 4; k++) { const c = mk(T, T), g = c.getContext("2d"); px(g, 0, 0, T, T, "#0a0806"); px(g, 0, 0, T, 2, "#1d1815"); px(g, 0, 0, 2, T, "#1d1815"); const r = rng("ab" + k); for (let i = 0; i < 5; i++) px(g, (r() * 12 + 2) | 0, (r() * 12 + 2) | 0, 2, 1, i % 2 ? "#3a1a12" : "#5a2a14"); t.L.push(c); }
    t.gate = []; for (const side of [0, 1]) { const arr = []; for (let k = 0; k < 2; k++) { const c = mk(T, T), g = c.getContext("2d"), col = side ? ["#ff5a2a", "#ffb04a"] : ["#4a9aff", "#9ad4ff"]; px(g, 0, 0, T, T, "#0b0908"); px(g, side ? 0 : 12, 0, 4, T, "#51463f"); px(g, side ? 0 : 12, 0, 4, 1, "#6a5c50"); px(g, side ? 4 : 2, 2, 2, 12, col[k]); px(g, side ? 8 : 6, 4, 2, 8, col[1 - k]); px(g, side ? 11 : 9, 6, 1, 4, col[k]); arr.push(c); } t.gate.push(arr); }
    return t;
  }

  // ------------------------------------------------------------------ gli sprite (rettangoli: ognuno ha una sagoma sua)
  const P = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
  function sprHero(g, x, y, S, fr) {
    const L = S.look, d = S.hero.dir, mv = S.hero.moving ? ((fr >> 3) & 1) : 0, st = S.hero.stone > 0;
    g.save(); g.translate(Math.round(x), Math.round(y)); if (d < 0) g.scale(-1, 1);
    P(g, -5, 3, 10, 3, "rgba(0,0,0,.35)");
    const skin = st ? "#8a8a8a" : L.skin, shirt = st ? "#6a6a6a" : L.shirt, hair = st ? "#5a5a5a" : L.hair;
    P(g, -3, 0 - mv, 2, 5, "#1b1813"); P(g, 1, 0 + mv, 2, 5, "#1b1813"); P(g, -4, 4 - mv, 3, 2, "#1b1813"); P(g, 1, 4 + mv, 3, 2, "#1b1813");
    P(g, -4, -8, 8, 8, shirt); P(g, -4, -8, 8, 1, "rgba(255,255,255,.22)"); P(g, -4, -1, 8, 2, "rgba(0,0,0,.25)");
    P(g, -6, -7 + mv, 2, 5, skin); P(g, 4, -7 - mv, 2, 5, skin);
    P(g, -3, -15, 7, 7, skin); P(g, -4, -16, 8, 3, hair); P(g, -4, -14, 1, 3, hair); P(g, 2, -12, 1, 1, "#14100c"); P(g, 3, -11, 1, 1, "#e8d8c0");
    g.restore();
  }
  function sprFoe(g, f, S, fr) {
    const k = f.k, x = Math.round(f.x), y = Math.round(f.y), fl = f.dir < 0 ? -1 : 1, bob = ((fr >> 3) & 1);
    g.save(); g.translate(x, y); if (fl < 0) g.scale(-1, 1);
    const sh = (w) => P(g, -w / 2, f.r - 3, w, 3, "rgba(0,0,0,.35)");
    if (f.stun > 0 && (k === "sk" || k === "cb")) { sh(12); P(g, -5, 0, 10, 3, "#d8d0b8"); P(g, -2, -3, 4, 3, "#e8e0cc"); P(g, -4, 2, 3, 1, "#8a8070"); g.restore(); return; }
    if (k === "sk") { sh(10); P(g, -3, 1 - bob, 2, 5, "#cfc8b4"); P(g, 1, 1 + bob, 2, 5, "#cfc8b4"); P(g, -4, -8, 8, 9, "#2a2420"); P(g, -3, -7, 6, 1, "#d8d0b8"); P(g, -3, -5, 6, 1, "#d8d0b8"); P(g, -3, -3, 6, 1, "#d8d0b8"); P(g, -4, -15, 8, 7, "#e8e0cc"); P(g, -3, -13, 2, 2, "#15110f"); P(g, 1, -13, 2, 2, "#15110f"); P(g, -2, -13, 1, 1, "#5ad8ff"); P(g, 2, -13, 1, 1, "#5ad8ff"); P(g, -2, -9, 4, 1, "#a89c84"); P(g, -6, -7 + bob, 2, 5, "#cfc8b4"); P(g, 4, -7 - bob, 2, 5, "#cfc8b4"); P(g, -4, -9, 8, 1, f.col || "#cfc8b4"); }
    else if (k === "cb") { sh(12); P(g, -6, -5, 12, 6, "#6a1a14"); P(g, -6, 1 - bob, 2, 4, "#4a100c"); P(g, 4, 1 + bob, 2, 4, "#4a100c"); P(g, 3, -9, 6, 6, "#8a2218"); P(g, 8, -7, 2, 3, "#4a100c"); P(g, 4, -8, 1, 1, "#ffd23f"); P(g, 3, -11, 2, 3, "#4a100c"); P(g, -8, -6, 3, 2, "#6a1a14"); }
    else if (k === "sn") { sh(10); P(g, -5, -3, 10, 5, "#2a8a4a"); P(g, -6, -1, 2, 3, "#2a8a4a"); P(g, 3, -8, 4, 6, "#3aa85a"); P(g, 4, -7, 1, 1, "#ffd23f"); P(g, 6, -4, 2, 1, "#c83a3a"); P(g, -3, -4, 2, 1, "#1a5a2a"); P(g, 0, -4, 2, 1, "#1a5a2a"); }
    else if (k === "ar") { const fl2 = Math.sin(S.t * 14 + f.x) * 5; P(g, -5, 8, 10, 2, "rgba(0,0,0,.3)"); P(g, -3, -6 + fl2 * 0.1, 6, 9, "#6a3a8a"); P(g, -2, -12, 5, 5, "#e0b890"); P(g, -3, -13, 6, 2, "#2a1a3a"); P(g, 1, -10, 1, 1, "#14100c"); g.fillStyle = "#8a4aba"; g.beginPath(); g.moveTo(-3, -5); g.lineTo(-13, -9 - fl2); g.lineTo(-9, 0); g.closePath(); g.fill(); g.beginPath(); g.moveTo(3, -5); g.lineTo(13, -9 - fl2); g.lineTo(9, 0); g.closePath(); g.fill(); P(g, -2, 3, 1, 3, "#e8d070"); P(g, 1, 3, 1, 3, "#e8d070"); }
    else if (k === "go") { const cr = f.stun > 0; sh(26); P(g, -9, -2, 18, 12, cr ? "#5a554c" : "#7a7468"); P(g, -9, -2, 18, 2, cr ? "#6a655c" : "#9a9488"); P(g, -7, -12, 14, 11, cr ? "#625d54" : "#8a8478"); P(g, -7, -12, 14, 2, "#a8a296"); P(g, -5, -8, 3, 2, cr ? "#3a1a10" : "#ff7a1a"); P(g, 2, -8, 3, 2, cr ? "#3a1a10" : "#ff7a1a"); P(g, -2, -3, 4, 4, cr ? "#3a1a10" : "#ff9a3a"); P(g, -13, -4, 5, 9, "#6a655c"); P(g, 8, -4, 5, 9, "#6a655c"); if (cr) { P(g, -1, -12, 1, 8, "#15110f"); P(g, 3, -6, 1, 7, "#15110f"); P(g, -6, 0, 5, 1, "#15110f"); } }
    else if (k === "me") { sh(12); P(g, -5, -3, 10, 12, "#5a2a7a"); P(g, -5, 7, 10, 2, "#3a1a5a"); P(g, -3, -11, 7, 8, "#7ad0a0"); for (let i = -2; i <= 2; i++) { P(g, i * 2 - 1, -17 + (i & 1) * 2 + Math.round(Math.sin(S.t * 5 + i) * 1.5), 2, 6, "#2a9a5a"); P(g, i * 2, -18 + (i & 1) * 2, 1, 1, "#ffd23f"); } P(g, -3, -8, 7, 2, "#14100c"); P(g, -2, -8, 2, 1, "#4ad8ff"); P(g, 1, -8, 2, 1, "#4ad8ff"); P(g, -1, -4, 3, 1, "#b04a6a"); }
    else if (k === "id") { sh(14); P(g, -6, -2, 12, 10, "#3a7a2a"); P(g, -3, -13, 3, 12, "#4a9a34"); P(g, 3, -10, 3, 9, "#4a9a34"); P(g, -5, -17, 6, 5, "#5ab842"); P(g, 3, -14, 5, 5, "#5ab842"); P(g, -3, -16, 1, 1, "#ffd23f"); P(g, 5, -13, 1, 1, "#ffd23f"); P(g, -1, -13, 2, 1, "#c83a3a"); P(g, -6, 5 + bob, 3, 3, "#2a5a1a"); P(g, 3, 5 - bob, 3, 3, "#2a5a1a"); }
    else if (k === "sp") { const al = f.ghost ? 0.42 : 0.92; g.globalAlpha = al; P(g, -5, 6, 10, 2, "rgba(0,0,0,.25)"); P(g, -5, -9, 10, 14, "#bcd4f0"); P(g, -4, -11, 8, 3, "#bcd4f0"); P(g, -5, 4, 3, 3, "#bcd4f0"); P(g, 2, 4 + bob, 3, 3, "#bcd4f0"); P(g, -3, -7, 2, 3, "#1a2a4a"); P(g, 1, -7, 2, 3, "#1a2a4a"); P(g, -1, -3, 3, 2, "#1a2a4a"); P(g, -4, -9, 8, 1, "#e8f4ff"); g.globalAlpha = 1; }
    else if (k === "mi") { const dz = f.state === "dizzy", ch = f.state === "charge"; sh(22); P(g, -8, -3, 16, 12, "#7a3422"); P(g, -9, -1, 4, 9, "#7a3422"); P(g, 6, 5 + bob, 3, 4, "#4a1a10"); P(g, -6, 5 - bob, 3, 4, "#4a1a10"); P(g, -7, -4, 14, 3, "#a85a3a"); P(g, -6, -14, 12, 11, "#8a4028"); P(g, -9, -16, 3, 6, "#e8e0cc"); P(g, 6, -16, 3, 6, "#e8e0cc"); P(g, -10, -17, 2, 3, "#e8e0cc"); P(g, 8, -17, 2, 3, "#e8e0cc"); P(g, -3, -9, 2, 2, dz ? "#e8e0cc" : ch ? "#ff3a1a" : "#ffd23f"); P(g, 2, -9, 2, 2, dz ? "#e8e0cc" : ch ? "#ff3a1a" : "#ffd23f"); P(g, -3, -5, 6, 3, "#c8805a"); P(g, -1, -4, 2, 1, "#ffd23f"); P(g, -8, 2, 16, 2, "#2a1a14"); if (dz) { for (let i = 0; i < 3; i++) P(g, Math.cos(S.t * 6 + i * 2.1) * 8, -22 + Math.sin(S.t * 6 + i * 2.1) * 2, 2, 2, "#ffd23f"); } }
    else if (k === "ce") { sh(12); P(g, -3, 1 - bob, 3, 6, "#15151a"); P(g, 1, 1 + bob, 3, 6, "#15151a"); P(g, -5, -9, 10, 11, "#1d1d24"); P(g, -5, -9, 10, 2, "#ff7a1a"); P(g, 3, -9, 1, 11, "#ff7a1a"); P(g, -3, -17, 7, 8, "#c8956a"); P(g, -4, -19, 9, 4, "#a8acb4"); P(g, -3, -14, 2, 1, "#14100c"); P(g, 1, -14, 2, 1, "#14100c"); P(g, -1, -11, 3, 1, "#7a4a2a"); P(g, 3, -10, 3, 2, "#e8e0cc"); P(g, -7, -8 + bob, 2, 6, "#1d1d24"); P(g, 5, -8 - bob, 2, 6, "#1d1d24"); const fa = 0.55 + 0.25 * Math.sin(S.t * 9); g.fillStyle = `rgba(255,120,30,${fa})`; for (let i = 0; i < 4; i++) g.fillRect(-6 + i * 4, -22 - ((S.t * 14 + i * 5) % 7), 1, 2); }
    g.restore();
  }

  // ------------------------------------------------------------------ CSS
  function css() {
    if (document.getElementById("dgCss")) return; const st = document.createElement("style"); st.id = "dgCss";
    st.textContent = `.dgOv{position:fixed;inset:0;z-index:300;background:#0b0907;color:#f3e6cf;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:'Trebuchet MS',system-ui,sans-serif;user-select:none;-webkit-user-select:none;overflow:auto;touch-action:manipulation}
.dgOv .top{width:min(100%,480px);display:grid;grid-template-columns:1fr auto 1fr;gap:6px;align-items:center;border:2px solid #5a3a22;border-radius:8px;background:#1a1411;padding:4px 10px;font:800 12px system-ui}
.dgOv .top .l{display:flex;flex-direction:column;gap:1px;min-width:0}.dgOv .top .l b{font-size:11px;color:#ffb04a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dgOv .hearts{letter-spacing:1px;color:#ff5a4a;font-size:14px}
.dgOv .top .sc{font:900 22px 'Courier New',monospace;color:#ffd23f;text-align:center}.dgOv .top .r{text-align:right;color:#cdbfa6}.dgOv .top .r b{color:#ffb04a}
.dgOv .gifts{width:min(100%,480px);min-height:20px;display:flex;flex-wrap:wrap;gap:3px;font-size:14px;line-height:1}
.dgOv .gifts span{background:#241b16;border:1px solid #5a3a22;border-radius:5px;padding:2px 4px}
.dgOv .cv{position:relative;width:min(100%,480px);flex:none}
.dgOv canvas{display:block;width:100%;height:auto;aspect-ratio:240/144;flex:none;image-rendering:pixelated;image-rendering:crisp-edges;border:3px solid #5a3a22;border-radius:6px;background:#050403;touch-action:none}
.dgOv .stick{position:absolute;width:76px;height:76px;margin:-38px 0 0 -38px;border-radius:50%;border:2px solid rgba(255,176,74,.55);background:rgba(255,176,74,.08);pointer-events:none;display:none}.dgOv .stick i{position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:rgba(255,176,74,.55)}
.dgOv .banner{position:absolute;left:0;right:0;top:34%;text-align:center;font:900 24px 'Courier New',monospace;color:#ffd23f;text-shadow:0 2px 0 #000,0 0 12px #ff7a1a;pointer-events:none;letter-spacing:1px}
.dgOv .msg{width:min(100%,480px);min-height:34px;background:#1a1411;border:2px solid #5a3a22;border-radius:8px;padding:5px 9px;font-size:12.5px;line-height:1.35;color:#e8dcc4}.dgOv .msg b{color:#ffb04a}
.dgOv .pad{width:min(100%,480px);display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dgOv .pad button{min-height:62px;border-radius:12px;border:3px solid #5a3a22;background:#2a1f18;color:#ffe9c0;font:900 15px system-ui;cursor:pointer;padding:5px;touch-action:manipulation}.dgOv .pad button small{display:block;font:600 10px system-ui;opacity:.75;margin-top:2px}
.dgOv .pad .dash{background:#3a2210;border-color:#ff7a1a}.dgOv .pad .kick{background:#15283a;border-color:#4a9aff}.dgOv .pad button:active{filter:brightness(1.35)}.dgOv .pad button.cd{opacity:.5}
.dgOv .quit{position:absolute;right:6px;bottom:6px;min-height:30px;font-size:11px;padding:3px 9px;border-radius:8px;border:2px solid #5a3a22;background:#1a1411;color:#cdbfa6}
.dgOv .ov{position:absolute;inset:0;background:rgba(8,6,5,.94);display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;z-index:3}
.dgOv .card{max-width:440px;width:100%;border:3px solid #5a3a22;border-radius:12px;background:#1a1411;padding:14px;box-shadow:6px 6px 0 #000,0 0 22px rgba(255,122,26,.25)}.dgOv .card h3{margin:0 0 6px;font:900 20px 'Courier New',monospace;color:#ffb04a;letter-spacing:1px}
.dgOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.dgOv .card .big{font:900 34px 'Courier New',monospace;color:#ffd23f}.dgOv .card .hint{color:#9ad4ff}.dgOv .card .keys{opacity:.8;font-size:12px}
.dgOv .card .goB,.dgOv .gcard{width:100%;margin-top:10px;background:#3a2210;color:#ffe9c0;font:900 15px system-ui;min-height:50px;border:3px solid #ff7a1a;border-radius:10px;cursor:pointer}
.dgOv .gcard{display:grid;grid-template-columns:44px 1fr;gap:8px;text-align:left;padding:8px 10px;background:#241b16;border-color:var(--rc,#9aa5b1);margin-top:8px}.dgOv .gcard .e{font-size:28px;display:flex;align-items:center;justify-content:center}.dgOv .gcard b{font-size:14px}.dgOv .gcard em{font-style:normal;font-size:10px;color:var(--rc);text-transform:uppercase;letter-spacing:1px;margin-left:6px}.dgOv .gcard span{display:block;font:500 12px system-ui;opacity:.9;margin-top:2px}`;
    document.head.appendChild(st);
  }

  // ------------------------------------------------------------------ SCELTA DEI DONI
  function pickGift(o, cb) {
    css(); o = o || {};
    const ids = rollGifts(o.have || [], o.seed == null ? Date.now() : o.seed, o.min);
    const host = document.querySelector(".dgOv") || document.body, ov = document.createElement("div"); ov.className = "dgOv"; ov.style.zIndex = 305;
    ov.innerHTML = `<div class="ov" style="position:fixed"><div class="card"><h3>${esc(o.title || "Un dono dalla Brace")}</h3><p>Scegline <b>uno</b>. Vale solo finché dura questa discesa: se torni al Campo Base lo lasci qui.</p>${ids.map((id) => `<button type="button" class="gcard" data-g="${id}" style="--rc:${RARC[GIFTS[id].r][1]}"><span class="e" style="display:flex">${GIFTS[id].e}</span><span><b>${esc(GIFTS[id].n)}</b><em>${RARC[GIFTS[id].r][0]}</em><span>${esc(GIFTS[id].d)}</span></span></button>`).join("")}</div></div>`;
    document.body.appendChild(ov); tone(660, 0.25, "triangle", 0.06, 0, 990);
    ov.querySelectorAll("[data-g]").forEach((b) => (b.onclick = () => { ov.remove(); tone(880, 0.2, "triangle", 0.06); if (cb) cb(b.dataset.g); }));
    return ids;
  }

  // ------------------------------------------------------------------ UNA STANZA
  function startRoom(o) {
    css();
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1, steal: 1, shot: 1 }, style: "" }, DF = Object.assign({ opp: 1, steal: 1, shot: 1 }, cur.opts || {});
    const kind = KINDS[o.kind] ? o.kind : "scheletri", KD = KINDS[kind], layout = o.layout && LAYOUTS[o.layout] ? o.layout : KD.layouts[0];
    const M = mods(o.gifts, o.bonus), gifts = (o.gifts || []).slice();
    const style = (o.opp && o.opp.style) || cur.style || "equilibrata", lvl = clamp(o.lvl | 0 || 1, 1, 3);
    const sk = { sp: DF.opp * (style === "pressing" ? 1.07 : 1) * (1 + 0.05 * (lvl - 1)), steal: DF.steal, shot: DF.shot, style };
    const maxH = Math.max(1, o.maxHearts || M.maxHearts), goalsNeed = Math.max(1, (o.goals || KD.goals) - (M.pact ? 1 : 0));
    const S = {
      o, kind, KD, layout, grid: buildGrid(layout), M, gifts, sk, lvl, t: 0, time: (o.time || (KD.boss ? 80 : 55)) + M.time, a: 0, b: 0, goalsNeed, over: false, phase: "intro", ot: false,
      hearts: clamp(o.hearts == null ? maxH : o.hearts, 1, maxH), maxH, shield: M.shield, hits: 0, kicks: 0, dashes: 0, lostHearts: 0, ko: false,
      look: Object.assign({ skin: "#e0ac7e", hair: "#2b1d14", shirt: "#1f5fbf" }, o.heroLook || {}), foes: [], fx: [], heads: [], parts: [], trail: [], manual: false, lastSafe: [30, MY], shake: 0, banner: "", bannerT: 0, msg: "",
      input: { x: 0, y: 0 }, keys: {}, seed: o.seed == null ? hash(kind + layout) : o.seed,
    };
    S.hero = { x: 30, y: MY, vx: 0, vy: 0, dir: 1, fx: 1, fy: 0, r: 5, dash: 0, dcd: 0, charges: M.charges, kcd: 0, inv: 0, stun: 0, stone: 0, tk: 0, moving: false, tackleCd: 0, thunder: 0 };
    S.ball = { x: W / 2, y: MY, vx: 0, vy: 0, r: 3, hidden: 0, owner: null, last: "" };
    STATE = S;
    // ---- l'overlay
    const el = document.createElement("div"); el.className = "dgOv";
    const names = { us: o.us || "Il Campione", opp: (o.opp && o.opp.name) || KD.name };
    el.innerHTML = `<div class="top"><div class="l"><b>${esc(o.title || KD.name)}</b><span class="hearts"></span></div><div class="sc">0 – 0</div><div class="r"><b class="tm">0:00</b><br><span class="gl"></span></div></div><div class="gifts"></div><div class="cv"><canvas width="${W}" height="${H}"></canvas><div class="stick"><i></i></div><div class="banner"></div></div><div class="msg"></div><div class="pad"><button type="button" class="dash">⚡ SCATTO<small>schiva e travolgi · sul pallone = tiro forte</small></button><button type="button" class="kick">⚽ TIRO<small>calcia dove guardi</small></button></div>`;
    document.body.appendChild(el); S.el = el;
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
    const LC = mk(W, H), lg = LC.getContext("2d");
    if (!TILES) TILES = buildTiles();
    const $ = (s) => el.querySelector(s);
    const say = (h) => { $(".msg").innerHTML = h; };
    const banner = (t, d) => { S.banner = t; S.bannerT = d || 1.2; };
    // ---- suoni
    const sfx = { kick: () => { tone(180, 0.09, "square", 0.05, 0, 90); noise(0.05, 0.03, 900); }, dash: () => noise(0.12, 0.04, 1500), hurt: () => { tone(160, 0.25, "sawtooth", 0.07, 0, 60); noise(0.12, 0.05, 400); }, goal: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "triangle", 0.06, i * 0.09)), lose: () => [330, 262, 196].forEach((f, i) => tone(f, 0.3, "sawtooth", 0.05, i * 0.14)), warn: () => tone(520, 0.08, "square", 0.03), thud: () => { tone(70, 0.3, "sine", 0.1, 0, 40); noise(0.1, 0.05, 300); }, whistle: () => { tone(1500, 0.5, "sine", 0.05, 0, 1900); tone(1480, 0.5, "sine", 0.04, 0.02, 1860); } };
    // ---- tessere e collisioni
    const at = (tx, ty) => (S.grid[ty] && S.grid[ty][tx]) || "#";
    const solidG = (c) => c === "#" || c === "p" || c === "G" || c === "g", groundPass = (c) => !solidG(c) && c !== "L", airPass = (c) => c !== "#";
    function blocked(x, y, r, pass) {
      const x0 = Math.floor((x - r) / T), x1 = Math.floor((x + r) / T), y0 = Math.floor((y - r) / T), y1 = Math.floor((y + r) / T);
      for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) { if (pass(at(tx, ty))) continue; const cx = clamp(x, tx * T, tx * T + T), cy = clamp(y, ty * T, ty * T + T); if (hyp(x - cx, y - cy) < r) return true; }
      return false;
    }
    function moveE(e, dx, dy, pass) { let hx = false, hy = false; if (dx) { if (!blocked(e.x + dx, e.y, e.r, pass)) e.x += dx; else hx = true; } if (dy) { if (!blocked(e.x, e.y + dy, e.r, pass)) e.y += dy; else hy = true; } e.x = clamp(e.x, 8, W - 8); e.y = clamp(e.y, 8, H - 8); return hx || hy; }
    // ---- i nemici
    const FK = { x: 0, y: 0, vx: 0, vy: 0, r: 5, sp: 40, stun: 0, dir: -1, t: 0, role: "att", fly: false, ghost: false, hold: 0, stuck: 0, cd: 0 };
    const mkFoe = (p) => { const f = Object.assign({}, FK, p, { sx: p.x, sy: p.y }); f.sp = (p.sp || 40) * sk.sp; S.foes.push(f); return f; };
    function spawnFoes() {
      S.foes.length = 0;
      if (kind === "scheletri") { mkFoe({ k: "sk", x: 190, y: 54, sp: 40, role: "att" }); mkFoe({ k: "sk", x: 202, y: 90, sp: 36, role: "def", col: "#ff7a1a" }); }
      else if (kind === "arpie") { mkFoe({ k: "ar", x: 178, y: 36, sp: 62, fly: true, r: 5, st: "hunt" }); mkFoe({ k: "ar", x: 184, y: 108, sp: 58, fly: true, r: 5, st: "hunt" }); }
      else if (kind === "golem") { mkFoe({ k: "go", x: 198, y: MY, sp: 27, r: 11, role: "def", heavy: 1, armor: 0, rock: 3 }); mkFoe({ k: "sk", x: 168, y: 60, sp: 38, role: "att", col: "#8a8478" }); }
      else if (kind === "medusa") { mkFoe({ k: "me", x: 206, y: MY, sp: 0, r: 7, role: "static", ang: Math.PI, gaze: 0, cool: 1.5, heavy: 1 }); mkFoe({ k: "sn", x: 172, y: 60, sp: 52, role: "att" }); }
      else if (kind === "idra") { mkFoe({ k: "id", x: 200, y: MY, sp: 32, r: 7, role: "def", spit: 3 }); mkFoe({ k: "id", x: 172, y: 50, sp: 36, r: 7, role: "att" }); }
      else if (kind === "spettri") { mkFoe({ k: "sp", x: 186, y: 50, sp: 56, role: "att", ph: 0 }); mkFoe({ k: "sp", x: 200, y: 94, sp: 52, role: "def", ph: 1.1 }); }
      else if (kind === "cerbero") { mkFoe({ k: "cb", x: 176, y: 72, sp: 36, r: 6, role: "att" }); S.heads = [0, 1, 2].map((i) => ({ i, x: 212, y: MY, ph: i * 2.1, w: 1.3 + i * 0.45, amp: 20, bite: 0 })); }
      else if (kind === "minotauro") { mkFoe({ k: "mi", x: 196, y: MY, sp: 36, r: 9, role: "att", state: "norm", chT: 3 + R() * 1.2, charge: 0, dirx: -1, diry: 0, heavy: 1 }); }
      else if (kind === "cenere") { mkFoe({ k: "ce", x: 192, y: MY, sp: 58, r: 6, role: "att", whT: 5.5, cardT: 4, chT: 5, state: "norm", dirx: -1, diry: 0 }); S.ring = null; }
    }
    function resetPositions(kick) {
      Object.assign(S.hero, { x: 30, y: MY, vx: 0, vy: 0, dash: 0, stun: 0, stone: 0, inv: 0 }); Object.assign(S.ball, { x: W / 2, y: MY, vx: 0, vy: 0, hidden: 0, owner: null });
      S.foes.forEach((f) => { f.x = f.sx; f.y = f.sy; f.vx = f.vy = 0; f.stun = 0; if (f.st) f.st = "hunt"; if (f.state) f.state = "norm"; });
      S.fx = S.fx.filter((x) => x.keep); S.ring = null; S.lastSafe = [30, MY]; S.hero.charges = M.charges;
    }
    function addFoeLater() { if (kind === "idra" && S.foes.length < 5) mkFoe({ k: "id", x: 196, y: 40 + R() * 60, sp: 34, r: 7, role: R() < 0.5 ? "def" : "att" }); if (kind === "cenere" && S.foes.length < 3) mkFoe({ k: "sk", x: 204, y: S.a === 1 ? 56 : 88, sp: 46, r: 6, role: "def", col: "#ff7a1a" }); if (kind === "cerbero") { S.heads.forEach((h) => (h.w *= 1.15)); if (S.a === 1) mkFoe({ k: "cb", x: 190, y: 40, sp: 46, r: 6, role: "def" }); } }
    // ---- la fisica del pallone
    function ballStep(dt) {
      const b = S.ball; if (b.hidden > 0) { b.hidden -= dt; if (b.hidden <= 0) { Object.assign(b, { x: W / 2, y: MY, vx: 0, vy: 0 }); } return; }
      if (b.owner) { const f = b.owner; b.x = f.x + (f.dir > 0 ? 3 : -3); b.y = f.y + 5; b.vx = b.vy = 0; return; }
      { const tx0 = Math.floor(b.x / T), ty0 = Math.floor(b.y / T), c0 = at(tx0, ty0); if (c0 === "#" || c0 === "p") { let best = null, bd = 1e9; for (let yy = 1; yy < GH - 1; yy++) for (let xx = 1; xx < GW - 1; xx++) if (at(xx, yy) === ".") { const d = hyp(xx * T + 8 - b.x, yy * T + 8 - b.y); if (d < bd) { bd = d; best = [xx * T + 8, yy * T + 8]; } } if (best) { b.x = best[0]; b.y = best[1]; b.vx = b.vy = 0; } } } // palla incastrata in un muro: torna in campo
      const sp0 = hyp(b.vx, b.vy), steps = Math.max(1, Math.ceil(sp0 * dt / 3)), h = dt / steps, fr = Math.pow(0.5, h / 0.9);
      for (let i = 0; i < steps; i++) {
        b.x += b.vx * h; b.y += b.vy * h; b.vx *= fr; b.vy *= fr;
        // porte
        if (b.y > GY0 + 2 && b.y < GY1 - 2) { if (b.x > W - 9) return goal("us"); if (b.x < 9) return goal("opp"); }
        // pareti e pilastri
        const x0 = Math.floor((b.x - b.r) / T), x1 = Math.floor((b.x + b.r) / T), y0 = Math.floor((b.y - b.r) / T), y1 = Math.floor((b.y + b.r) / T);
        for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
          const c = at(tx, ty); if (c === "L") { if (tx * T + 4 < b.x && b.x < tx * T + 12 && ty * T + 4 < b.y && b.y < ty * T + 12) { b.hidden = 0.9; b.vx = b.vy = 0; tone(300, 0.3, "sine", 0.04, 0, 90); return; } continue; }
          const gateCell = (c === "G" || c === "g") && b.y > GY0 && b.y < GY1; if (!(c === "#" || c === "p" || (c === "G" || c === "g")) || gateCell) continue;
          const cx = clamp(b.x, tx * T, tx * T + T), cy = clamp(b.y, ty * T, ty * T + T), d = hyp(b.x - cx, b.y - cy);
          if (d < b.r) { let nx = b.x - cx, ny = b.y - cy; if (d < 0.01) { nx = b.x < tx * T + 8 ? -1 : 1; ny = 0; } else { nx /= d; ny /= d; } b.x = cx + nx * (b.r + 0.1); b.y = cy + ny * (b.r + 0.1); const dot = b.vx * nx + b.vy * ny; if (dot < 0) { const e = M.bounce ? 1.0 : 0.78; b.vx -= (1 + e) * dot * nx; b.vy -= (1 + e) * dot * ny; if (-dot > 30) tone(220, 0.04, "square", 0.02); } }
        }
        b.x = clamp(b.x, 4, W - 4); b.y = clamp(b.y, T + b.r, H - T - b.r);
      }
    }
    function goal(who) {
      if (S.phase !== "play") return; S.ball.vx = S.ball.vy = 0;
      if (who === "us") { S.a++; sfx.goal(); banner("GOL!", 1.4); if (M.heal && S.hearts < S.maxH) { S.hearts++; } addFoeLater(); say("<b>Gol!</b> Il portale dell'avversario vibra."); }
      else { S.b++; sfx.lose(); banner("GOL LORO", 1.4); say("Hanno segnato nel tuo portale. Rialzati."); }
      S.phase = "goal"; S.pt = 1.5; S.shake = 0.3; hud();
    }
    // ---- l'eroe
    function hurt(n, src, kx, ky) {
      const h = S.hero; if (h.inv > 0 || S.phase !== "play") return false;
      if (S.shield) { S.shield = false; h.inv = 1.0; banner("SCUDO!", 0.7); tone(900, 0.2, "triangle", 0.05, 0, 400); return false; }
      S.hearts -= n; S.lostHearts += n; h.inv = 1.3; h.stun = Math.max(h.stun, 0.28); S.shake = 0.25; sfx.hurt();
      if (kx != null) { h.vx = kx * 80; h.vy = ky * 80; }
      if (S.ball.owner === null && hyp(S.ball.x - h.x, S.ball.y - h.y) < 14) { S.ball.vx += (R() - 0.5) * 80; S.ball.vy += (R() - 0.5) * 80; }
      if (S.hearts <= 0) { S.hearts = 0; S.ko = true; end(); }
      hud(); return true;
    }
    function doKick(fromDash) {
      const h = S.hero, b = S.ball; if (S.phase !== "play" || h.stun > 0 || h.kcd > 0 || b.owner || b.hidden > 0) return;
      if (hyp(b.x - h.x, b.y - h.y) > 16) return;
      let ang = Math.atan2(h.fy, h.fx); const gx = W - 6, gy = MY, ta = Math.atan2(gy - b.y, gx - b.x), da = Math.atan2(Math.sin(ta - ang), Math.cos(ta - ang));
      if (Math.abs(da) < 0.55) ang += da * 0.7; // aiuto alla mira verso la porta
      let sp = 168 * M.kick * (fromDash ? 1.3 : 1); if (h.thunder > 0) { sp *= 1.45; b.th = 2.5; h.thunder = 0; } b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp; b.last = "us"; b.pierce = M.pierce ? 1.2 : 0;
      h.kcd = 0.3; S.kicks++; sfx.kick(); for (let i = 0; i < 4; i++) S.parts.push({ x: b.x, y: b.y, vx: (R() - 0.5) * 50, vy: (R() - 0.5) * 50, l: 0.3, c: "#e8d8b0" });
    }
    function doDash() {
      const h = S.hero; if (S.phase !== "play" || h.stun > 0 || h.dash > 0 || h.charges <= 0) return;
      let dx = S.input.x, dy = S.input.y; const m = hyp(dx, dy); if (m < 0.2) { dx = h.fx; dy = h.fy; } else { dx /= m; dy /= m; }
      h.dash = 0.17 * M.dashLen; h.dvx = dx * 205; h.dvy = dy * 205; h.inv = Math.max(h.inv, h.dash + 0.08); h.charges--; h.dcd = (1.25 * M.dashCd); S.dashes++; sfx.dash(); if (M.thunder) h.thunder = 1.1;
      el.querySelector(".dash").classList.add("cd");
    }
    // ---- l'IA dei nemici
    const gateOpp = [10, MY];
    function stepFoes(dt) {
      const h = S.hero, b = S.ball;
      S.foes.forEach((f) => {
        f.t += dt; if (f.cd > 0) f.cd -= dt;
        if (f.stun > 0) { f.stun -= dt; f.vx *= 0.8; f.vy *= 0.8; if (f.k === "go" && f.stun <= 0) f.armor = 2.2; if (f.state === "dizzy" && f.stun <= 0) f.state = "norm"; return; }
        if (f.armor > 0) f.armor -= dt;
        const fn = { sk: chaser, cb: chaser, sn: chaser, id: idra, sp: spettro, ar: arpia, go: golem, me: medusa, mi: minotauro, ce: cenere }[f.k] || chaser; fn(f, dt);
        // separazione dagli altri
        S.foes.forEach((o2) => { if (o2 === f || o2.ghost || f.ghost || f.fly !== o2.fly) return; const d = hyp(f.x - o2.x, f.y - o2.y), m = f.r + o2.r; if (d < m && d > 0.01) { const p = (m - d) * 0.5; if (!f.heavy) { f.x += (f.x - o2.x) / d * p; f.y += (f.y - o2.y) / d * p; } } });
        if (f.vx > 0.5) f.dir = 1; else if (f.vx < -0.5) f.dir = -1;
      });
    }
    function steer(f, tx, ty, sp, dt, pass) {
      let dx = tx - f.x, dy = ty - f.y; const d = hyp(dx, dy); if (d < 1.5) { f.vx = f.vy = 0; return d; }
      dx /= d; dy /= d; if (f.sideT > 0) { f.sideT -= dt; const sx = -dy * f.side, sy = dx * f.side; dx = dx * 0.4 + sx; dy = dy * 0.4 + sy; const n = hyp(dx, dy) || 1; dx /= n; dy /= n; }
      f.vx = dx * sp; f.vy = dy * sp; const px = f.x, py = f.y; moveE(f, f.vx * dt, f.vy * dt, pass || (f.fly ? airPass : groundPass));
      if (hyp(f.x - px, f.y - py) < sp * dt * 0.25) { f.stuck += dt; if (f.stuck > 0.35) { f.stuck = 0; f.sideT = 0.6; f.side = R() < 0.5 ? 1 : -1; } } else f.stuck = Math.max(0, f.stuck - dt * 2);
      return d;
    }
    function foeBall(f, dt, kickSp) {
      const b = S.ball; if (b.hidden > 0 || b.owner) return false;
      const d = hyp(b.x - f.x, b.y - f.y); if (d < f.r + b.r + 1 && !f.ghost) {
        const nx = (b.x - f.x) / (d || 1), ny = (b.y - f.y) / (d || 1); b.x = f.x + nx * (f.r + b.r + 1.2); b.y = f.y + ny * (f.r + b.r + 1.2); b.vx = f.vx * 1.15 + nx * 18; b.vy = f.vy * 1.15 + ny * 18; b.last = "opp"; f.hold += dt;
        const dg = hyp(gateOpp[0] - f.x, gateOpp[1] - f.y);
        if (f.hold > 0.35 && (dg < 82 || f.hold > 1.7) && S.t - (f.lk || -9) > 0.9) { const a = Math.atan2(gateOpp[1] + (R() - 0.5) * 26 - f.y, gateOpp[0] - f.x) + (R() - 0.5) * 0.4 / Math.max(0.6, sk.shot); const s = (kickSp || 150) * (0.9 + 0.2 * sk.shot); b.vx = Math.cos(a) * s; b.vy = Math.sin(a) * s; f.lk = S.t; f.hold = 0; sfx.kick(); }
        return true;
      }
      f.hold = Math.max(0, f.hold - dt); return false;
    }
    function chaser(f, dt) {
      const b = S.ball, h = S.hero, st = sk.style; let tx, ty, sp = f.sp, role = f.role;
      if (st === "contropiede" && b.x < 110 && role === "att") role = "def"; if (st === "difensiva" && b.x < 140 && role === "att") role = "def"; if (st === "pressing" && role === "def" && b.x > 150) role = "att";
      const near = hyp(b.x - f.x, b.y - f.y);
      if (b.owner && b.owner !== f) { tx = b.owner.x; ty = b.owner.y; } else if (near < f.r + 9 && !b.hidden) { tx = gateOpp[0]; ty = gateOpp[1]; sp *= 0.88; } else if (role === "def" && !(b.x > 118 && near < 70)) { tx = 196; ty = clamp(b.y, 54, 90); sp *= 0.8; } else { tx = b.x + b.vx * 0.15; ty = b.y + b.vy * 0.15; }
      if (b.hidden > 0) { tx = W / 2; ty = MY; }
      steer(f, tx, ty, sp, dt); foeBall(f, dt);
    }
    function idra(f, dt) {
      chaser(f, dt); if (f.spit != null) { f.spit -= dt; if (f.spit <= 0) { f.spit = 3.6; S.fx.push({ t: "acid", x: clamp(h0().x + h0().vx * 0.3, 20, W - 20), y: clamp(h0().y + h0().vy * 0.3, 16, H - 16), d: 0.9 * M.warn, life: 0, from: f }); sfx.warn(); } }
    }
    const h0 = () => S.hero;
    function spettro(f, dt) {
      f.ph = (f.ph || 0) + dt; const cy = f.ph % 2.5, wasGhost = f.ghost; f.ghost = cy > 1.4; f.fly = f.ghost;
      if (!f.ghost && wasGhost && blocked(f.x, f.y, f.r, groundPass)) { f.ghost = true; f.fly = true; f.ph -= dt; }
      chaser(f, dt);
    }
    function arpia(f, dt) {
      const b = S.ball, h = S.hero; f.flap = (f.flap || 0) + dt;
      if (f.st === "hunt") { const free = !b.owner && !b.hidden; steer(f, free ? b.x : 190, free ? b.y : 60, f.sp, dt, airPass); if (free && hyp(b.x - f.x, b.y - f.y) < 9) { b.owner = f; f.st = "carry"; f.perch = [120 + R() * 90, 24 + R() * 96]; f.ct = 0; b.last = "opp"; tone(700, 0.15, "sawtooth", 0.04, 0, 1100); } }
      else if (f.st === "carry") { f.ct += dt; steer(f, f.perch[0], f.perch[1], f.sp * 1.05, dt, airPass); if (hyp(f.perch[0] - f.x, f.perch[1] - f.y) < 6 || f.ct > 3.2) { if (b.owner === f) { b.owner = null; b.vx = (R() - 0.5) * 60; b.vy = (R() - 0.5) * 60; } f.st = "cool"; f.ct = 0; } }
      else { f.ct += dt; steer(f, 200, f.sy, f.sp, dt, airPass); if (f.ct > 1.2) f.st = "hunt"; }
    }
    function golem(f, dt) {
      const b = S.ball; const ty = b.x > 100 ? clamp(b.y, 54, 90) : MY; steer(f, 198, ty, f.sp, dt); f.rock -= dt;
      if (f.rock <= 0) { f.rock = 3.5; S.fx.push({ t: "rock", x: clamp(S.hero.x + S.hero.vx * 0.4, 20, W - 20), y: clamp(S.hero.y + S.hero.vy * 0.4, 16, H - 16), d: 1.0 * M.warn, life: 0 }); sfx.warn(); }
    }
    function medusa(f, dt) {
      const h = S.hero, ta = Math.atan2(h.y - f.y, h.x - f.x), da = Math.atan2(Math.sin(ta - f.ang), Math.cos(ta - f.ang)); f.ang += clamp(da, -1, 1) * Math.min(1, dt * 1.1);
      if (f.cool > 0) { f.cool -= dt; f.gaze = 0; return; }
      const d = hyp(h.x - f.x, h.y - f.y), inCone = d < 104 && Math.abs(Math.atan2(Math.sin(ta - f.ang), Math.cos(ta - f.ang))) < 0.42 && los(f.x, f.y, h.x, h.y);
      if (inCone && !M.eye && h.stone <= 0) { f.gaze += dt * M.warn > 0 ? dt / M.warn : dt; if (f.gaze >= 0.7) { h.stone = 1.5; h.stun = Math.max(h.stun, 1.5); f.gaze = 0; f.cool = 2.4; S.shake = 0.3; tone(110, 0.5, "sawtooth", 0.07, 0, 50); say("<b>Pietrificato!</b> Ti muovi di nuovo tra poco."); } } else f.gaze = Math.max(0, f.gaze - dt * 1.5);
    }
    function los(x0, y0, x1, y1) { const n = Math.ceil(hyp(x1 - x0, y1 - y0) / 4); for (let i = 1; i < n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; const c = at(Math.floor(x / T), Math.floor(y / T)); if (c === "#" || c === "p") return false; } return true; }
    function minotauro(f, dt) {
      const h = S.hero, b = S.ball;
      if (f.state === "norm") { chaser(f, dt); f.chT -= dt; if (f.chT <= 0) { f.state = "tele"; f.tt = 0.95 * M.warn; sfx.warn(); } }
      else if (f.state === "tele") { f.tt -= dt; f.vx = f.vy = 0; const a = Math.atan2(h.y - f.y, h.x - f.x); f.dirx = Math.cos(a); f.diry = Math.sin(a); f.dir = f.dirx > 0 ? 1 : -1; if (f.tt <= 0) { f.state = "charge"; f.charge = 1.5; tone(95, 0.4, "sawtooth", 0.07, 0, 60); } }
      else if (f.state === "charge") {
        f.charge -= dt; const sp = 165 * sk.sp, hit = moveE(f, f.dirx * sp * dt, f.diry * sp * dt, groundPass); f.vx = f.dirx * sp; f.vy = f.diry * sp;
        if (hyp(b.x - f.x, b.y - f.y) < f.r + 5 && !b.owner) { b.vx = f.dirx * 190; b.vy = f.diry * 190; b.last = "opp"; }
        if (hit) { f.state = "dizzy"; f.stun = 2.3; f.chT = 3.3 + R() * 1.2; sfx.thud(); S.shake = 0.4; say("<b>Asterio sbatte la testa!</b> È stordito: approfitta."); }
        else if (f.charge <= 0) { f.state = "norm"; f.chT = 3.2 + R() * 1.2; }
      }
    }
    function cenere(f, dt) {
      const h = S.hero; S.phaseN = Math.min(2, S.a);
      if (f.state === "tele") { f.tt -= dt; f.vx = f.vy = 0; const a = Math.atan2(h.y - f.y, h.x - f.x); f.dirx = Math.cos(a); f.diry = Math.sin(a); if (f.tt <= 0) { f.state = "charge"; f.charge = 0.9; sfx.thud(); } }
      else if (f.state === "charge") { f.charge -= dt; const sp = 130 * sk.sp, hit = moveE(f, f.dirx * sp * dt, f.diry * sp * dt, groundPass); f.vx = f.dirx * sp; f.vy = f.diry * sp; if (hit) { f.state = "norm"; f.stun = 1.2; S.shake = 0.3; sfx.thud(); } else if (f.charge <= 0) f.state = "norm"; }
      else { const b = S.ball; let role = b.x > 150 ? "def" : "att"; f.role = role; chaser(f, dt); }
      f.whT -= dt; if (f.whT <= 0 && !S.ring && !S.ringT) { S.ringT = 1.0 * M.warn; f.whT = 7.2 - S.phaseN * 0.8; sfx.warn(); }
      if (S.phaseN >= 1) { f.cardT -= dt; if (f.cardT <= 0) { f.cardT = 5.2; for (let i = 0; i < 2; i++) S.fx.push({ t: "card", x: clamp(h.x + (R() - 0.5) * 60, 22, W - 22), y: clamp(h.y + (R() - 0.5) * 50, 20, H - 20), d: 1.0 * M.warn, life: 0 }); sfx.warn(); } }
      if (S.phaseN >= 2 && f.state === "norm") { f.chT -= dt; if (f.chT <= 0) { f.chT = 5; f.state = "tele"; f.tt = 0.8 * M.warn; sfx.warn(); } }
    }
    // ---- aggiornamento
    function update(dt) {
      if (S.over) return; S.t += dt; const h = S.hero, b = S.ball;
      if (S.bannerT > 0) { S.bannerT -= dt; if (S.bannerT <= 0) S.banner = ""; } if (S.shake > 0) S.shake -= dt;
      S.parts = S.parts.filter((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt; return p.l > 0; });
      if (S.phase === "count") { S.ct -= dt; if (S.ct <= 0) { S.phase = "play"; banner("VIA!", 0.7); } else banner(String(Math.ceil(S.ct)), 0.3); return; }
      if (S.phase === "goal") { S.pt -= dt; if (S.pt <= 0) { if (S.a >= S.goalsNeed) return end(); if (S.b >= S.goalsNeed) return end(); resetPositions(); S.phase = "count"; S.ct = 1.2; } return; }
      if (S.phase !== "play") return;
      S.time -= dt; if (S.time <= 0) { if (S.a !== S.b || S.ot) return end(); S.ot = true; S.time = 20; banner("GOL D'ORO!", 1.5); say("<b>Pari:</b> il primo gol vince. Il dungeon non ammette pareggi."); }
      // eroe
      if (h.kcd > 0) h.kcd -= dt; if (h.inv > 0) h.inv -= dt; if (h.stun > 0) h.stun -= dt; if (h.stone > 0) h.stone -= dt; if (h.tackleCd > 0) h.tackleCd -= dt; if (h.thunder > 0) h.thunder -= dt;
      if (h.charges < M.charges) { h.dcd -= dt; if (h.dcd <= 0) { h.charges++; h.dcd = 1.25 * M.dashCd; if (h.charges >= M.charges) el.querySelector(".dash").classList.remove("cd"); } } else el.querySelector(".dash").classList.remove("cd");
      let ix = S.input.x, iy = S.input.y; const kx = (S.keys.ArrowRight || S.keys.d ? 1 : 0) - (S.keys.ArrowLeft || S.keys.a ? 1 : 0), ky = (S.keys.ArrowDown || S.keys.s ? 1 : 0) - (S.keys.ArrowUp || S.keys.w ? 1 : 0); if (kx || ky) { ix = kx; iy = ky; }
      const im = hyp(ix, iy); if (im > 1) { ix /= im; iy /= im; }
      if (h.stun > 0 && h.dash <= 0) { ix = iy = 0; }
      const sp = 62 * M.speed * (S.inAcid ? 0.45 : 1);
      if (h.dash > 0) { h.dash -= dt; const hit = moveE(h, h.dvx * dt, h.dvy * dt, (c) => !solidG(c)); h.vx = h.dvx; h.vy = h.dvy; if (hit) h.dash = 0; if (M.trail) S.trail.push({ x: h.x, y: h.y, l: 2.2 }); }
      else { h.vx += (ix * sp - h.vx) * Math.min(1, dt * 14); h.vy += (iy * sp - h.vy) * Math.min(1, dt * 14); moveE(h, h.vx * dt, h.vy * dt, (c) => !solidG(c)); }
      h.moving = hyp(h.vx, h.vy) > 12; if (im > 0.25) { h.fx = ix / im; h.fy = iy / im; if (Math.abs(ix) > 0.2) h.dir = ix > 0 ? 1 : -1; }
      // buchi: se non stai scattando cadi
      const tc = at(Math.floor(h.x / T), Math.floor(h.y / T));
      if (tc === "L" && h.dash <= 0) { hurt(1); h.x = S.lastSafe[0]; h.y = S.lastSafe[1]; h.vx = h.vy = 0; say("<b>Sei caduto in una fossa!</b> Un cuore in meno, ma ti rimettono in piedi."); } else if (tc !== "L" && tc !== "^" && tc !== "f") S.lastSafe = [h.x, h.y];
      trapsStep(dt);
      // pallone vs eroe
      const dh = hyp(b.x - h.x, b.y - h.y);
      if (!b.owner && !b.hidden && dh < h.r + b.r + 1.5) {
        const nx = (b.x - h.x) / (dh || 1), ny = (b.y - h.y) / (dh || 1); b.x = h.x + nx * (h.r + b.r + 1.6); b.y = h.y + ny * (h.r + b.r + 1.6); b.vx = h.vx * 1.22 + nx * 16; b.vy = h.vy * 1.22 + ny * 16; b.last = "us";
        if (h.dash > 0) { b.vx = h.dvx * 1.1 * M.kick; b.vy = h.dvy * 1.1 * M.kick; S.kicks++; sfx.kick(); if (h.thunder > 0) { b.vx *= 1.4; b.vy *= 1.4; b.th = 2.5; h.thunder = 0; } b.pierce = M.pierce ? 1.2 : 0; }
      } else if (M.magnet && !b.owner && !b.hidden && dh < 22 && h.stun <= 0 && S.t - (h.mgOff || 0) > 0) { const tx = h.x + h.fx * 9, ty = h.y + h.fy * 9; b.vx += (tx - b.x) * 9 * dt * 10; b.vy += (ty - b.y) * 9 * dt * 10; b.vx *= 0.96; b.vy *= 0.96; }
      if (kx || ky || S.keys[" "] === 2) { /* tastiera gestita da keydown */ }
      stepFoes(dt); foeHero(dt); ballStep(dt); if (S.phase !== "play") return;
      // pallone vs nemici bloccanti (golem, teste, medusa)
      S.foes.forEach((f) => { if (!f.heavy || f.k === "mi") return; const d = hyp(b.x - f.x, b.y - f.y), m = f.r + b.r; if (d < m && !b.owner && !b.hidden && !(b.pierce > 0 && b.last === "us")) { const nx = (b.x - f.x) / (d || 1), ny = (b.y - f.y) / (d || 1), sp2 = hyp(b.vx, b.vy); b.x = f.x + nx * (m + 0.2); b.y = f.y + ny * (m + 0.2); const dot = b.vx * nx + b.vy * ny; if (dot < 0) { b.vx -= 1.7 * dot * nx; b.vy -= 1.7 * dot * ny; } if (f.k === "go" && sp2 > 80 && f.stun <= 0 && f.armor <= 0) { f.stun = 2.6; sfx.thud(); S.shake = 0.3; say("<b>Il golem si incrina!</b> Per un po' non si muove."); } } });
      S.heads.forEach((hd) => { hd.y = MY + Math.sin(S.t * hd.w + hd.ph) * hd.amp; if (hd.bite > 0) hd.bite -= dt; const d = hyp(b.x - hd.x, b.y - hd.y); if (d < 8.5 && !b.owner && !(b.pierce > 0 && b.last === "us")) { const nx = (b.x - hd.x) / (d || 1), ny = (b.y - hd.y) / (d || 1); b.x = hd.x + nx * 9; b.y = hd.y + ny * 9; const dot = b.vx * nx + b.vy * ny; if (dot < 0) { b.vx -= 1.8 * dot * nx; b.vy -= 1.8 * dot * ny; } tone(150, 0.1, "square", 0.04); } if (hyp(h.x - hd.x, h.y - hd.y) < 13 && hd.bite <= 0) { hd.bite = 1.8; hurt(1, hd, -1, 0); } });
      if (b.pierce > 0) b.pierce -= dt; if (b.th > 0) { b.th -= dt; if (hyp(b.vx, b.vy) < 60) b.th = 0; }
      if (S.ringT > 0) { S.ringT -= dt; if (S.ringT <= 0) { const c = S.foes[0]; S.ring = { x: c.x, y: c.y, r: 4, hit: false }; sfx.whistle(); S.shake = 0.3; } }
      if (S.ring) { S.ring.r += 105 * dt; const rg = S.ring; if (!rg.hit && Math.abs(hyp(h.x - rg.x, h.y - rg.y) - rg.r) < 7 && los(rg.x, rg.y, h.x, h.y)) { rg.hit = true; if (h.inv <= 0) { hurt(1); h.stun = Math.max(h.stun, 0.7); } } const db = hyp(b.x - rg.x, b.y - rg.y); if (Math.abs(db - rg.r) < 6 && !b.owner) { b.vx += (b.x - rg.x) / (db || 1) * 120; b.vy += (b.y - rg.y) / (db || 1) * 120; } if (rg.r > 260) S.ring = null; }
      fxStep(dt);
      S.inAcid = S.fx.some((e) => e.t === "puddle" && hyp(h.x - e.x, h.y - e.y) < 12);
      if (S.inAcid) { S.acidT = (S.acidT || 0) + dt; if (S.acidT > 1.0) { S.acidT = 0; hurt(1); } } else S.acidT = 0;
      S.trail = S.trail.filter((p) => { p.l -= dt; if (p.l > 0) S.foes.forEach((f) => { if (!f.heavy && hyp(f.x - p.x, f.y - p.y) < f.r + 4 && f.stun <= 0) f.stun = 1.2; }); return p.l > 0; });
      hud();
    }
    function trapsStep(dt) {
      const h = S.hero; if (h.dash > 0) return; const tx = Math.floor(h.x / T), ty = Math.floor(h.y / T), c = at(tx, ty), cy = trapPhase(tx, ty);
      if (c === "^" && cy === 2 && h.inv <= 0) hurt(1, null, -h.fx, -h.fy);
      if (c === "f" && cy === 2 && hyp(h.x - (tx * T + 8), h.y - (ty * T + 8)) < 9 && h.inv <= 0) hurt(1, null, -h.fx, -h.fy);
      S.foes.forEach((f) => { if (f.fly || f.ghost || f.heavy) return; const fc = at(Math.floor(f.x / T), Math.floor(f.y / T)); if (fc === "f" && trapPhase(Math.floor(f.x / T), Math.floor(f.y / T)) === 2 && f.stun <= 0) f.stun = 1.3; });
    }
    // 0 riposo · 1 avviso · 2 attivo
    function trapPhase(tx, ty) { const c = at(tx, ty); if (c !== "^" && c !== "f") return 0; const per = c === "^" ? 2.8 : 3.4, t = ((S.t + tx * 0.43 + ty * 0.29) % per), w = 0.75 * M.warn, act = c === "^" ? 0.9 : 0.6; if (t > per - act) return 2; if (t > per - act - w) return 1; return 0; }
    function fxStep(dt) {
      S.fx.forEach((e) => {
        e.life += dt;
        if (e.t === "rock" && !e.done && e.life >= e.d) { e.done = 1; sfx.thud(); S.shake = 0.3; if (hyp(S.hero.x - e.x, S.hero.y - e.y) < 13 && S.hero.inv <= 0) hurt(1); if (hyp(S.ball.x - e.x, S.ball.y - e.y) < 14 && !S.ball.owner) { S.ball.vx += (S.ball.x - e.x) * 5; S.ball.vy += (S.ball.y - e.y) * 5; } for (let i = 0; i < 8; i++) S.parts.push({ x: e.x, y: e.y, vx: (R() - 0.5) * 90, vy: (R() - 0.7) * 80, l: 0.5, c: "#8a8478" }); e.life = e.d + 0.5; e.gone = 1; }
        else if (e.t === "acid" && !e.done && e.life >= e.d) { e.done = 1; e.t = "puddle"; e.life = 0; e.d = 4.2; }
        else if (e.t === "puddle" && e.life > e.d) e.gone = 1;
        else if (e.t === "card" && !e.done && e.life >= e.d) { e.done = 1; e.act = 2.2; }
        else if (e.t === "card" && e.done) { e.act -= dt; if (hyp(S.hero.x - e.x, S.hero.y - e.y) < 9 && S.hero.inv <= 0 && S.hero.dash <= 0) hurt(1); if (e.act <= 0) e.gone = 1; }
      });
      S.fx = S.fx.filter((e) => !e.gone || (e.t === "rock" && e.life < e.d + 0.4));
    }
    // ---- scontri eroe/nemici
    function foeHero(dt) {
      const h = S.hero, b = S.ball;
      S.foes.forEach((f) => {
        if (f.ghost) return; const d = hyp(h.x - f.x, h.y - f.y), m = h.r + f.r;
        if (d < m && d > 0.01) {
          const nx = (h.x - f.x) / d, ny = (h.y - f.y) / d;
          if (h.dash > 0 && !(f.heavy && f.k !== "mi" && f.k !== "me") && f.stun <= 0) { f.stun = (f.k === "sk" || f.k === "cb" || f.k === "sn" ? 2.4 : 1.0) * (M.eye ? 2 : 1); f.vx = -nx * 80; f.vy = -ny * 80; sfx.thud(); if (f.st === "carry" && b.owner === f) { b.owner = null; b.vx = nx * 40; b.vy = ny * 40; f.st = "cool"; f.ct = 0; } if (f.k === "ar") f.st = "cool"; if (f.state === "tele") f.state = "norm"; if (M.thunder && h.thunder > 0) { f.stun += 1; } S.shake = 0.15; for (let i = 0; i < 5; i++) S.parts.push({ x: f.x, y: f.y, vx: (R() - 0.5) * 70, vy: (R() - 0.5) * 70, l: 0.4, c: "#e8e0cc" }); }
          else if (f.k === "mi" && f.state === "charge") { hurt(1, f, f.dirx, f.diry); f.state = "norm"; f.chT = 3 + R(); f.stun = 0.6; }
          else if (f.k === "ce" && f.state === "charge") { hurt(1, f, f.dirx, f.diry); f.state = "norm"; f.stun = 0.5; }
          else if (f.stun <= 0 && f.k !== "me") {
            if (!f.heavy) { h.x += nx * (m - d) * 0.5; h.y += ny * (m - d) * 0.5; f.x -= nx * (m - d) * 0.5; f.y -= ny * (m - d) * 0.5; } else { h.x += nx * (m - d); h.y += ny * (m - d); }
            if (h.tackleCd <= 0 && h.dash <= 0 && hyp(b.x - h.x, b.y - h.y) < 15 && !b.owner && f.k !== "go") { b.vx = (b.x - h.x) * 8 + f.vx; b.vy = (b.y - h.y) * 8 + f.vy; b.last = "opp"; h.tackleCd = 0.8; h.stun = Math.max(h.stun, 0.3); f.stun = 0.25; tone(240, 0.08, "square", 0.04); say("Ti hanno rubato il pallone: usa lo scatto per travolgerli."); }
          }
        }
      });
    }
    // ---- fine stanza
    function end(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const win = !quit && !S.ko && S.a > S.b && (S.a >= S.goalsNeed || S.time <= 0 || S.ot || true) && S.b < S.goalsNeed;
      let a = S.a, bb = S.b; if (!win && bb <= a) bb = a + 1; if (quit) { a = 0; bb = Math.max(1, bb); }
      const res = { a, b: bb, win: !!win, quit: !!quit, data: { kind, hearts: S.hearts, maxHearts: S.maxH, hits: S.lostHearts, kicks: S.kicks, dashes: S.dashes, perfect: S.lostHearts === 0, ko: S.ko, gifts: gifts.slice(), secs: Math.round(S.t) } };
      const title = quit ? "Stanza abbandonata" : win ? o.winTitle || "STANZA SUPERATA!" : S.ko ? "SEI A TERRA" : S.a === S.b ? "PARI: NON BASTA" : "STANZA PERSA";
      sfx[win ? "goal" : "lose"]();
      const ov = document.createElement("div"); ov.className = "ov";
      ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3><p class="big">${a} – ${bb}</p><p>${win ? `Cuori rimasti: <b>${S.hearts}/${S.maxH}</b>${res.data.perfect ? " · <b>senza un graffio!</b>" : ""}` : S.ko ? "I tuoi cuori sono finiti. Il dungeon ti rimanda all'ingresso: ma ricorderai tutto." : quit ? "Torni indietro." : "Il fischio decide: nel dungeon il pareggio non basta."}</p></div>`;
      const btn = document.createElement("button"); btn.type = "button"; btn.className = "goB"; btn.textContent = "Avanti ▸"; ov.querySelector(".card").appendChild(btn); $(".cv").appendChild(ov); ov.style.position = "fixed";
      btn.onclick = () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); };
      S.res = res;
    }
    // ---- HUD
    function hud() {
      $(".hearts").textContent = "♥".repeat(S.hearts) + "♡".repeat(Math.max(0, S.maxH - S.hearts)) + (S.shield ? " 🛡" : "");
      $(".sc").textContent = `${S.a} – ${S.b}`; const t = Math.max(0, Math.ceil(S.time)); $(".tm").textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}${S.ot ? " ★" : ""}`; $(".gl").textContent = `primo a ${S.goalsNeed}`;
      const gi = $(".gifts"); const sig = gifts.join(); if (gi.dataset.s !== sig) { gi.dataset.s = sig; gi.innerHTML = gifts.map((id) => `<span title="${esc(GIFTS[id].n)}">${GIFTS[id].e}</span>`).join(""); }
    }
    // ---- disegno
    function draw() {
      const fr = Math.floor(S.t * 60), sx = S.shake > 0 ? (R() - 0.5) * 3 : 0, sy = S.shake > 0 ? (R() - 0.5) * 3 : 0;
      g.save(); g.translate(Math.round(sx), Math.round(sy));
      for (let ty = 0; ty < GH; ty++) for (let tx = 0; tx < GW; tx++) {
        const c = at(tx, ty), X = tx * T, Y = ty * T;
        if (c === "#") g.drawImage(TILES.w[(tx + ty) & 1], X, Y); else if (c === "G" || c === "g") g.drawImage(TILES.gate[c === "g" ? 1 : 0][(fr >> 4) & 1], X, Y);
        else { g.drawImage(TILES.f[(tx * 7 + ty * 3) & 3], X, Y); if (c === "p") g.drawImage(TILES.p, X, Y); else if (c === "L") g.drawImage(TILES.L[(fr >> 4) & 3], X, Y); else if (c === "^") g.drawImage(TILES.s[trapPhase(tx, ty)], X, Y); else if (c === "f") g.drawImage(TILES.v[trapPhase(tx, ty)], X, Y); }
      }
      // linee del campo (rune sul pavimento)
      g.fillStyle = "rgba(255,150,60,.10)"; g.fillRect(W / 2 - 1, T, 2, H - 2 * T); g.strokeStyle = "rgba(255,150,60,.12)"; g.beginPath(); g.arc(W / 2, MY, 22, 0, 7); g.stroke();
      // effetti a terra
      S.fx.forEach((e) => {
        if (e.t === "rock" || e.t === "acid" || e.t === "card") { const p = clamp(e.life / e.d, 0, 1), a = 0.2 + 0.35 * p; if (!e.done) { g.fillStyle = e.t === "acid" ? `rgba(120,255,60,${a})` : `rgba(255,60,30,${a})`; if (e.t === "card") g.fillRect(e.x - 8, e.y - 8, 16, 16); else { g.beginPath(); g.arc(e.x, e.y, 13 * (0.5 + 0.5 * p), 0, 7); g.fill(); } if (e.t === "rock" || e.t === "acid") { g.strokeStyle = "rgba(255,255,255,.5)"; g.strokeRect(e.x - 1, e.y - 1, 2, 2); } } else if (e.t === "card") { g.fillStyle = "#ffd23f"; g.fillRect(e.x - 7, e.y - 7, 14, 14); g.fillStyle = "#c8281a"; g.fillRect(e.x - 5, e.y - 5, 10, 10); } }
        else if (e.t === "puddle") { g.fillStyle = "rgba(110,230,50,.42)"; g.beginPath(); g.ellipse(e.x, e.y, 12, 8, 0, 0, 7); g.fill(); g.fillStyle = "rgba(200,255,120,.5)"; g.fillRect(e.x - 3 + Math.sin(S.t * 4) * 2, e.y - 1, 2, 1); }
        else if (e.t === "rock") { g.fillStyle = "#8a8478"; g.fillRect(e.x - 5, e.y - 4, 10, 7); }
      });
      S.trail.forEach((p) => { g.fillStyle = `rgba(255,${100 + p.l * 40 | 0},20,${Math.min(0.7, p.l * 0.4)})`; g.fillRect(p.x - 4, p.y - 3, 8, 6); });
      // minotauro: striscia di avviso
      S.foes.forEach((f) => { if ((f.k === "mi" || f.k === "ce") && f.state === "tele") { const a = 0.25 + 0.3 * Math.sin(S.t * 24); g.strokeStyle = `rgba(255,50,30,${a + 0.3})`; g.lineWidth = f.k === "mi" ? 12 : 8; g.globalAlpha = 0.35; g.beginPath(); g.moveTo(f.x, f.y); g.lineTo(f.x + f.dirx * 230, f.y + f.diry * 230); g.stroke(); g.globalAlpha = 1; g.lineWidth = 1; g.fillStyle = "#ff3a1a"; g.fillRect(f.x - 1, f.y - 28, 3, 7); g.fillRect(f.x - 1, f.y - 19, 3, 3); } });
      // sguardo di Meda
      S.foes.forEach((f) => { if (f.k !== "me") return; const col = f.cool > 0 ? "100,100,110" : f.gaze > 0.1 ? "255,60,40" : "90,255,150"; g.fillStyle = `rgba(${col},${f.cool > 0 ? 0.06 : 0.16 + f.gaze * 0.25})`; g.beginPath(); g.moveTo(f.x, f.y - 4); g.arc(f.x, f.y - 4, 104, f.ang - 0.42, f.ang + 0.42); g.closePath(); g.fill(); });
      // porta di Cerbero
      S.heads.forEach((hd) => { const ph = hd.bite > 0; g.fillStyle = "#3a0c08"; g.fillRect(hd.x - 5, hd.y - 8, 12, 16); g.fillStyle = "#8a2218"; g.fillRect(hd.x - 8, hd.y - 6, 12, 12); g.fillStyle = "#c83a2a"; g.fillRect(hd.x - 8, hd.y - 6, 12, 2); g.fillStyle = "#ffd23f"; g.fillRect(hd.x - 7, hd.y - 3, 2, 2); g.fillRect(hd.x - 3, hd.y - 3, 2, 2); g.fillStyle = "#e8e0cc"; g.fillRect(hd.x - 8, hd.y + 2 + (ph ? 2 : 0), 12, 2); g.fillStyle = "#4a100c"; g.fillRect(hd.x - 2, hd.y - 10, 3, 4); });
      // ombre sotto le entità e pallone
      const ents = [{ y: S.hero.y, f: () => sprHero(g, S.hero.x, S.hero.y + 4, S, fr) }];
      S.foes.forEach((f) => ents.push({ y: f.y + (f.fly ? 30 : 0), f: () => { const lift = f.fly ? -12 : 0; g.save(); g.translate(0, lift); sprFoe(g, f, S, fr); g.restore(); } }));
      ents.sort((p, q) => p.y - q.y).forEach((e) => e.f());
      const b = S.ball; if (!b.hidden) { g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(Math.round(b.x - 3), Math.round(b.y + 2), 6, 2); g.fillStyle = b.th > 0 ? "#9ad4ff" : "#f2ead8"; g.fillRect(Math.round(b.x - 2), Math.round(b.y - 3), 5, 5); g.fillStyle = b.th > 0 ? "#fff" : "#2a2420"; g.fillRect(Math.round(b.x - 1), Math.round(b.y - 2), 2, 2); g.fillStyle = "#fff"; g.fillRect(Math.round(b.x - 2), Math.round(b.y - 3), 2, 1); if (b.pierce > 0) { g.fillStyle = "#ffd23f"; g.fillRect(Math.round(b.x - 5), Math.round(b.y), 3, 1); } }
      // il fischio
      if (S.ring) { g.strokeStyle = "rgba(255,200,120,.75)"; g.lineWidth = 3; g.beginPath(); g.arc(S.ring.x, S.ring.y, S.ring.r, 0, 7); g.stroke(); g.lineWidth = 1; }
      if (S.ringT > 0) { const c = S.foes[0]; g.strokeStyle = `rgba(255,120,60,${0.3 + 0.3 * Math.sin(S.t * 20)})`; g.beginPath(); g.arc(c.x, c.y, 10 + (1 - S.ringT) * 18, 0, 7); g.stroke(); }
      S.parts.forEach((p) => { g.fillStyle = p.c; g.fillRect(Math.round(p.x), Math.round(p.y), 2, 2); });
      // luci di torcia
      const dark = S.kind === "cenere" ? (S.a >= 2 ? 0.88 : 0.66) : S.kind === "medusa" ? 0.6 : 0.58; lg.globalCompositeOperation = "source-over"; lg.fillStyle = `rgba(6,4,8,${dark})`; lg.fillRect(0, 0, W, H); lg.globalCompositeOperation = "destination-out";
      const hole = (x, y, r, a) => { const gr = lg.createRadialGradient(x, y, 2, x, y, r); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, "rgba(0,0,0,0)"); lg.fillStyle = gr; lg.fillRect(x - r, y - r, r * 2, r * 2); };
      const TORCH = [[24, 6], [88, 6], [152, 6], [216, 6], [40, H - 4], [120, H - 4], [200, H - 4]];
      const fl = (i) => 1 + Math.sin(S.t * 9 + i * 2) * 0.05 + Math.sin(S.t * 23 + i) * 0.03;
      if (S.kind !== "cenere" || S.a < 2) TORCH.forEach(([x, y], i) => hole(x, y, 52 * fl(i), 0.85));
      hole(S.hero.x, S.hero.y - 6, 44, 0.9); if (!b.hidden) hole(b.x, b.y, 24, 0.55); hole(8, MY, 40, 0.8); hole(W - 8, MY, 40, 0.8);
      S.foes.forEach((f) => { if (f.k === "ce" || f.k === "mi" || f.k === "go") hole(f.x, f.y - 6, 30, 0.5); });
      S.fx.forEach((e) => { if (e.t === "puddle") hole(e.x, e.y, 22, 0.5); });
      for (let ty = 0; ty < GH; ty++) for (let tx = 0; tx < GW; tx++) { const c = at(tx, ty); if (c === "f" && trapPhase(tx, ty) > 0) hole(tx * T + 8, ty * T + 8, 36, 0.8); if (c === "L") hole(tx * T + 8, ty * T + 8, 14, 0.2); }
      lg.globalCompositeOperation = "source-over"; g.drawImage(LC, 0, 0);
      // alone caldo delle torce e braci
      g.globalCompositeOperation = "lighter"; TORCH.forEach(([x, y], i) => { const gr = g.createRadialGradient(x, y, 1, x, y, 30); gr.addColorStop(0, `rgba(255,150,60,${0.22 * fl(i)})`); gr.addColorStop(1, "rgba(255,120,30,0)"); g.fillStyle = gr; g.fillRect(x - 30, y - 30, 60, 60); }); g.globalCompositeOperation = "source-over";
      for (let i = 0; i < 9; i++) { const ex = (i * 53 + S.t * 9 + Math.sin(S.t + i) * 8) % W, ey = H - ((S.t * (6 + i % 4 * 3) + i * 31) % H); g.fillStyle = i % 2 ? "rgba(255,170,70,.7)" : "rgba(255,110,40,.6)"; g.fillRect(Math.round(ex), Math.round(ey), 1, 1); }
      // torce sui muri (sopra la luce)
      TORCH.forEach(([x, y], i) => { const up = y < 20; g.fillStyle = "#3a2a1a"; g.fillRect(x - 1, up ? 6 : H - 10, 3, 6); const f2 = 2 + Math.round(Math.sin(S.t * 14 + i) * 1); g.fillStyle = "#ff7a1a"; g.fillRect(x - 1, (up ? 3 : H - 13) - f2 + 2, 3, 4 + f2 - 2); g.fillStyle = "#ffd23f"; g.fillRect(x, (up ? 4 : H - 12) - f2 + 2, 1, 3); });
      // etichetta delle onde e dell'avviso sulle teste mai: niente scritte sopra i personaggi (solo punti esclamativi dei nemici)
      g.restore();
      const bn = $(".banner"); bn.textContent = S.banner || ""; bn.style.opacity = S.banner ? 1 : 0;
    }
    // ---- comandi (tocco/trascinamento + tastiera)
    let ptr = null; const stk = $(".stick"), cvw = $(".cv");
    const rect = () => cv.getBoundingClientRect();
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (er) {} const r = rect(); ptr = { id: e.pointerId, x0: e.clientX, y0: e.clientY }; stk.style.display = "block"; stk.style.left = e.clientX - r.left + "px"; stk.style.top = e.clientY - r.top + "px"; stk.firstElementChild.style.transform = "translate(0,0)"; });
    cv.addEventListener("pointermove", (e) => { if (!ptr || e.pointerId !== ptr.id) return; const dx = e.clientX - ptr.x0, dy = e.clientY - ptr.y0, m = hyp(dx, dy), R0 = 30; if (m < 6) { S.input.x = S.input.y = 0; return; } const k = Math.min(1, m / R0); S.input.x = dx / m * k; S.input.y = dy / m * k; stk.firstElementChild.style.transform = `translate(${dx / m * Math.min(m, R0)}px,${dy / m * Math.min(m, R0)}px)`; });
    const up = (e) => { if (!ptr || e.pointerId !== ptr.id) return; ptr = null; S.input.x = S.input.y = 0; stk.style.display = "none"; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    const bt = (sel, fn) => $(sel).addEventListener("pointerdown", (e) => { e.preventDefault(); fn(); });
    bt(".dash", doDash); bt(".kick", () => doKick(false));
    const kd = (e) => { if (!el.isConnected) return; if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (!S.keys[" "]) doKick(false); S.keys[" "] = 1; } else if (e.key === "Shift" || e.key === "x" || e.key === "X") { e.preventDefault(); if (!S.keys.Shift) doDash(); S.keys.Shift = 1; } else if (/^(Arrow|[wasdWASD])/.test(e.key)) { e.preventDefault(); S.keys[e.key.length === 1 ? e.key.toLowerCase() : e.key] = 1; } };
    const ku = (e) => { if (e.key === " " || e.key === "Enter") S.keys[" "] = 0; else if (e.key === "Shift" || e.key === "x" || e.key === "X") S.keys.Shift = 0; else delete S.keys[e.key.length === 1 ? e.key.toLowerCase() : e.key]; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => { if (S.phase === "intro") end(true); else end(true); }; el.appendChild(q);
    // ---- partenza: schermata di presentazione con le regole
    spawnFoes(); hud();
    const gset = gifts.length ? `<p>Doni in tasca: ${gifts.map((id) => GIFTS[id].e + " " + esc(GIFTS[id].n)).join(" · ")}.</p>` : "";
    const intro = document.createElement("div"); intro.className = "ov"; intro.style.position = "fixed";
    intro.innerHTML = `<div class="card"><h3>${esc(o.title || KD.name)}</h3>${o.intro ? `<p>${o.intro}</p>` : ""}<p>Una stanza dell'Ipogeo: segna nel portale rosso a destra (<b>primo a ${goalsNeed}</b>) prima che finisca il tempo. Hai <b>${S.hearts}/${S.maxH} cuori</b>: trappole e mostri li tolgono, a zero sei a terra.</p><p class="hint">${esc(KD.hint)}</p>${gset}<p class="keys"><b>Trascina</b> sul campo per muoverti · <b>⚡ SCATTO</b> schiva e travolge (sul pallone è un tiro forte) · <b>⚽ TIRO</b> calcia dove guardi.<br>Tastiera: frecce/WASD, Spazio = tiro, Maiusc o X = scatto.</p></div>`;
    const go = document.createElement("button"); go.type = "button"; go.className = "goB"; go.textContent = "Entra nella stanza ▸"; intro.querySelector(".card").appendChild(go); el.appendChild(intro);
    go.onclick = () => { intro.remove(); S.phase = "count"; S.ct = 2.4; say(`<b>${esc(names.opp)}</b> — ${esc(KD.hint)}`); tone(220, 0.3, "triangle", 0.05, 0, 440); };
    S.update = update; S.finish = (quit) => { if (S.phase === "intro") { intro.remove(); } S.phase = "play"; end(quit); }; S.skipIntro = () => { if (S.phase === "intro") { intro.remove(); S.phase = "play"; } }; S.names = names; S.spawn = spawnFoes;
    S.score = (who) => goal(who);
    let last = performance.now();
    const loop = (t) => { if (!el.isConnected) return; const dt = Math.min(0.05, (t - last) / 1000); last = t; if (!S.manual) { const n = dt > 0.026 ? 2 : 1; for (let i = 0; i < n; i++) update(dt / n); } draw(); S.raf = requestAnimationFrame(loop); };
    S.raf = requestAnimationFrame(loop);
    return true;
  }

  // ------------------------------------------------------------------ UNA PICCOLA RUN (Sala Giochi e Sogni): stanze con i doni in mezzo
  function startRun(o) {
    if (document.querySelector(".dgOv")) return false;
    const rooms = Math.max(2, o.rooms || 3), fin = (o.opp && o.opp.kind) || o.kind || "minotauro", pool = ["scheletri", "arpie", "spettri", "golem", "medusa"], r = rng("dgrun" + (o.seed || Date.now())), seq = [];
    while (seq.length < rooms - 1) { const k = pool[Math.floor(r() * pool.length)]; if (!seq.includes(k)) seq.push(k); }
    seq.push(fin);
    let gifts = [], hearts = null, gf = 0, ga = 0, won = 0, i = 0;
    const base = Object.assign({}, o, { run: false });
    const next = () => {
      const k = seq[i], last = i === seq.length - 1;
      const ok = startRoom(Object.assign({}, base, { kind: k, layout: undefined, gifts, hearts, maxHearts: undefined, lvl: last ? 2 : 1, seed: (o.seed || 7) + i, title: `${o.title ? o.title + " · " : ""}Stanza ${i + 1}/${seq.length}`, opp: Object.assign({}, o.opp || {}, { name: KINDS[k].name }), onDone: (res) => {
        gf += res.a; ga += res.b; if (res.quit) return o.onDone && o.onDone({ a: gf, b: Math.max(1, ga), win: false, quit: true, data: { rooms: won, gifts } });
        if (!res.win) return o.onDone && o.onDone({ a: gf, b: Math.max(1, ga), win: false, quit: false, data: { rooms: won, gifts, ko: res.data.ko } });
        won++; i++; hearts = Math.min(res.data.maxHearts, res.data.hearts + 1);
        if (i >= seq.length) return o.onDone && o.onDone({ a: gf, b: ga, win: true, quit: false, data: { rooms: won, gifts, hearts } });
        pickGift({ have: gifts, seed: (o.seed || 7) * 31 + i, title: "Un dono per la prossima stanza" }, (id) => { gifts = gifts.concat(id); next(); });
      } }));
      if (ok === false) return false;
      return true;
    };
    return next();
  }

  function start(o) { o = o || {}; if (document.querySelector(".dgOv")) return false; return o.run ? startRun(o) : startRoom(o); }
  A.start = start; A.pickGift = pickGift; A.GIFTS = GIFTS; A.KINDS = KINDS; A.LAYOUTS = LAYOUTS; A.rollGifts = rollGifts; A.mods = mods; A.RARC = RARC;
  Object.defineProperty(A, "state", { get() { return STATE; }, configurable: true });
})();
