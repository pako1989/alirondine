// js/libro-finali.js - IL LIBRO CHE MANGIAVA I FINALI
// Saga fiabesca e meta-narrativa per il Campione creato dall'utente (heroLoad()).
// Ispirazioni: La Storia Infinita, Paper Mario, Cuore d'inchiostro, Undertale.
// Il Campione entra in un vecchio libro di fiabe sul calcio a cui qualcuno sta mangiando i finali.
// Meccaniche proprie:
//  - INCHIOSTRO: si raccolgono PAROLE (PONTE, LUCE, SOFFIO...) e si scrivono sulle pagine bianche della mappa:
//    la mappa cambia davvero (compare un ponte, si accende il buio, si apre una porta). Le stesse parole sono il mazzo
//    della «Partita Scritta» (capitolo 3).
//  - NOTE A MARGINE: il Narratore a volte racconta cose che non vedi. Puoi obiettare: le contraddizioni scoperte
//    contano per i finali.
//  - LETTERE DELL'AUTRICE: 4 pagine nascoste, una per capitolo, dietro le pagine bianche più difficili.
//  - IMBROGLI: alcune pagine permettono di scrivere «VINTO» e saltare una sfida. Si può. Il libro se lo ricorda.
// Ogni capitolo ha uno stile grafico diverso: acquerello, xilografia, fumetto, matita.
// Zone camminabili sul motore TRZ di game.js (window.__borgoApi), sfondi di scena in js/bg-scenarios.js (chiavi lb_*).
// Ricompense: SOLO monete (una tantum) e cosmetici. Salvataggio proprio: ali-di-rondine.libro-finali.
(function () {
  "use strict";
  if (window.__libroFinaliLoaded) return;
  window.__libroFinaliLoaded = true;
  const KEY = "ali-di-rondine.libro-finali", TS = 16;
  let tries = 0, api = null, EXIT = null;

  // ------------------------------------------------------------------ utilità
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; return h >>> 0; };
  const rnd = (tx, ty, k) => hash(tx * 73 + ty * 131 + (k || 0) * 17) / 4294967296;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const frNow = () => Math.floor(performance.now() / 16);

  // ------------------------------------------------------------------ audio (piccoli suoni di carta e pennino)
  let actx = null;
  function ac() { if (!actx && (window.AudioContext || window.webkitAudioContext)) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } if (actx && actx.state === "suspended") safe(() => actx.resume()); return actx; }
  function tone(f, d, type, vol, when, slide) {
    const c = ac(); if (!c) return;
    safe(() => { const t = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol || 0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02); });
  }
  function noise(d, vol, hp) {
    const c = ac(); if (!c) return;
    safe(() => { const n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n); const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); f.type = "highpass"; f.frequency.value = hp || 1800; g.gain.value = vol || 0.12; s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); });
  }
  const SFX = {
    page: () => { noise(0.28, 0.16, 2400); tone(220, 0.12, "triangle", 0.03, 0.05, 160); },
    scribble: () => { for (let i = 0; i < 6; i++) tone(900 + Math.random() * 600, 0.05, "square", 0.025, i * 0.06, 500); },
    word: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, "triangle", 0.09, i * 0.07)); },
    bad: () => { tone(330, 0.22, "sawtooth", 0.05, 0, 180); },
    secret: () => { [392, 494, 587, 784, 988].forEach((f, i) => tone(f, 0.5, "sine", 0.08, i * 0.11)); },
    margin: () => { tone(880, 0.08, "square", 0.05); tone(660, 0.18, "square", 0.05, 0.09); },
    narr: () => { tone(110, 0.6, "sine", 0.08, 0, 98); tone(165, 0.5, "sine", 0.04, 0.05); },
  };

  // ------------------------------------------------------------------ salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  // le parole d'inchiostro (anche carte della Partita Scritta)
  const WORDS = {
    ponte: { w: "PONTE", d: "Unisce due cose separate. Sulla mappa: attraversa le pagine bianche.", m: "I passaggi arrivano subito e non si intercettano." },
    luce: { w: "LUCE", d: "Accende il buio di una pagina.", m: "Cancella la NEBBIA del Narratore. Senza nebbia: il tuo tiro va più dritto." },
    soffio: { w: "SOFFIO", d: "Il fiato del Lupo, ritrovato in fondo al bosco.", m: "I tuoi tiri partono più forti." },
    aperto: { w: "APERTO", d: "Apre quello che è chiuso, se è chiuso per finta.", m: "Il portiere avversario esce dai pali e lascia la porta più scoperta." },
    muro: { w: "MURO", d: "Mette qualcosa di solido dove non c'era niente.", m: "Un muretto davanti alla tua porta." },
    dritto: { w: "DRITTO", d: "Raddrizza le cose storte.", m: "Cancella lo SPECCHIO del Narratore. Senza specchio: corri più veloce." },
    sole: { w: "SOLE", d: "Asciuga ciò che è bagnato, anche le lacrime d'inchiostro.", m: "Cancella la PIOGGIA del Narratore. Senza pioggia: il pallone corre di più." },
    doppio: { w: "DOPPIO", d: "Raddoppia. Attenzione a cosa.", m: "I tuoi gol valgono due." },
    ancora: { w: "ANCORA", d: "Fa durare le cose un po' di più.", m: "Cancella la FINE del Narratore: la pagina dura di più." },
    penna: { w: "PENNA", d: "La parola di chi scrive. Pesa più delle altre.", m: "Cancella CANCELLA del Narratore. Senza CANCELLA: il primo gol vale doppio." },
    larga: { w: "LARGA", d: "Allarga quello che è stretto.", m: "La porta avversaria si allarga." },
    vinto: { w: "VINTO", d: "Una parola che chiude le partite senza giocarle. Comoda. Troppo comoda.", m: "" },
  };
  const LETTER_TOTAL = 4;
  function norm(o) {
    o = obj(o);
    const m = { v: 1, ch: clampI(o.ch, 1, 9, 1), step: {}, flags: {}, rew: {}, done: {}, zone: "", words: [], marg: [], lett: [], ends: [], log: [], intro: {}, wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0), cheat: clampI(o.cheat, 0, 99, 0) };
    const st = obj(o.step); Object.keys(st).slice(0, 20).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); let c = 0;
    Object.keys(fl).forEach((k) => {
      if (c >= 300 || !FLAG_RE.test(k)) return; const v = fl[k];
      if (typeof v === "boolean") m.flags[k] = v;
      else if (typeof v === "number" && Number.isFinite(v)) m.flags[k] = Math.max(-1e6, Math.min(1e6, Math.round(v)));
      else if (typeof v === "string" && v.length <= 24) m.flags[k] = v;
      else return;
      c++;
    });
    Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 200) m.rew[k] = 1; });
    const dn = obj(o.done); Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 9, 0); if (n && typeof dn[k] === "string" && dn[k].length <= 24) m.done[n] = dn[k]; });
    m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
    m.words = [...new Set(arr(o.words).filter((x) => typeof x === "string" && WORDS[x]))];
    m.marg = [...new Set(arr(o.marg).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 30);
    m.lett = [...new Set(arr(o.lett).map((x) => clampI(x, 1, LETTER_TOTAL, 0)).filter(Boolean))];
    m.ends = [...new Set(arr(o.ends).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 12);
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 220)).slice(-80);
    Object.keys(obj(o.intro)).forEach((k) => { if (FLAG_RE.test(k)) m.intro[k] = 1; });
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
  const knows = (id) => mem().words.includes(id);

  // ------------------------------------------------------------------ il Campione
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  const SHOT = { saetta: "un tiro dritto come una riga di quaderno", serpentina: "un tiro che si piega come una pagina al vento", parabola: "un pallonetto che volta pagina sopra il portiere", martello: "un tiro che sembra il tonfo di un'enciclopedia", traversa: "un tiro che bacia la traversa come un segnalibro", saudade: "un tiro malinconico come l'ultima riga di una storia", muro: "un tiro pesante come un volume rilegato in pelle" };
  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "il tuo tiro", shot: "saetta" };
    return String(s).replace(/\{n\}/g, () => h.name).replace(/\{num\}/g, () => h.num).replace(/\{tiro\}/g, () => h.shotName || "il tuo tiro").replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro tutto tuo");
  }
  function castHero() {
    const h = hero(), C = api && api.CAST; if (!h || !C) return;
    C.hero = { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#2a1a0a", bg: [h.shirt || "#3b3a4a", "#f4ecd8"], shirt: h.shirt, num: String(h.num), acc: h.acc, cap: h.acc === "cappellino" ? "#ffd23f" : h.acc === "berretto" ? "#26324a" : undefined };
  }
  const coinsGive = (n) => (n > 0 && typeof window.addCoins === "function" ? safe(() => { window.addCoins(n); return n; }, 0) : 0);
  const bal = () => safe(() => (typeof window.bCoins === "function" ? window.bCoins() : 0), 0);

  // ------------------------------------------------------------------ STILI GRAFICI DEL LIBRO
  // Ogni capitolo è illustrato in un modo diverso: le stesse tessere cambiano tratto e palette.
  const STY = {
    acq: { // acquerello
      paper: "#f4ecd8", ink: "#3b3a4a", g1: "#9fc580", g2: "#b3d395", g3: "#8db872", path: "#e6d2a8", path2: "#d9c193", tree: "#4f8452", tree2: "#78ad69", trunk: "#7a5a3a",
      wall: "#d8c3a0", wall2: "#c4ab85", roof: "#c0644a", water: "#8fb8d8", water2: "#a9cbe4", stone: "#b8b0a2", accent: "#d9734e", pitch: ["#93c47d", "#a2cf8b"], blank: "#fbf7ec", line: "rgba(59,58,74,.35)",
    },
    xil: { // xilografia
      paper: "#efe5cf", ink: "#1d1a17", g1: "#e2d6bb", g2: "#d8cbac", g3: "#cfc19f", path: "#efe5cf", path2: "#e0d3b6", tree: "#1d1a17", tree2: "#3a332c", trunk: "#1d1a17",
      wall: "#e7dcc3", wall2: "#1d1a17", roof: "#a8231f", water: "#1d1a17", water2: "#3a332c", stone: "#cfc3a6", accent: "#a8231f", pitch: ["#e6dac0", "#d9ccaf"], blank: "#fbf8ef", line: "rgba(29,26,23,.8)",
    },
    fum: { // fumetto
      paper: "#fffbea", ink: "#111111", g1: "#7ed957", g2: "#6cc94a", g3: "#94e46e", path: "#ffd95a", path2: "#f5c842", tree: "#2e9e4f", tree2: "#45c065", trunk: "#8b5a2b",
      wall: "#4aa3df", wall2: "#2b7bb9", roof: "#e63946", water: "#3fa7ff", water2: "#7cc4ff", stone: "#c9ced8", accent: "#e63946", pitch: ["#55c26b", "#62d077"], blank: "#ffffff", line: "#111111",
    },
    mat: { // matita
      paper: "#f6f5ef", ink: "#4a4a4a", g1: "#ecebe4", g2: "#e4e3db", g3: "#dddcd3", path: "#f2f1ea", path2: "#d8d7cf", tree: "#7a7a76", tree2: "#9b9b96", trunk: "#5e5e5a",
      wall: "#e9e8e1", wall2: "#8d8d88", roof: "#9a9a95", water: "#cfcfc9", water2: "#e0e0da", stone: "#d2d1c9", accent: "#5a6b8c", pitch: ["#e8e7df", "#dfded6"], blank: "#ffffff", line: "rgba(74,74,74,.55)",
    },
  };
  // Pavimenti: , terreno · : sentiero · ; prato fiorito · = assi del ponte · - campo da gioco · + lastricato · " tappeto · ' pagina scritta
  const FLOORS = ',:;=-+"\'';
  // Solidi: a bordo pagina · t albero · h siepe · k roccia · _ pagina bianca · z buio · w fiume d'inchiostro · f staccionata · c muro di carte
  //         y casa · x cassa/torchio · l lampione · b panchina · i pila di libri · j gradinata · n cartello · e leggio · q porta · Q porta chiusa
  //         * parola · & lettera dell'Autrice · u pozzo · p fungo/vaso · g porta da calcio · P tabellone · Y trono · K tana · Z colonna di carta
  const SOLID = "athk_zwfcyxlbijneqQ*&upgPYKZ";
  const isFloor = (ch) => !!ch && FLOORS.includes(ch);
  const ZX = { map: null, under: null, meta: null, id: "", st: STY.acq, stk: "acq" };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  let GP = null;
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const onScr = (x, y) => x > -40 && x < 360 && y > -40 && y < 240;
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  // contorno «a mano»: tremolio leggero per l'acquerello e la matita, tratto netto per fumetto e xilografia
  function outline(sx, sy, w, h, tx, ty) {
    const s = ZX.stk, st = ZX.st;
    if (s === "fum") { P(sx, sy, w, 1, st.ink); P(sx, sy + h - 1, w, 1, st.ink); P(sx, sy, 1, h, st.ink); P(sx + w - 1, sy, 1, h, st.ink); return; }
    if (s === "xil") { P(sx, sy + h - 1, w, 1, st.ink); P(sx + w - 1, sy, 1, h, st.ink); return; }
    const j = rnd(tx, ty, 9) < 0.5 ? 1 : 0;
    P(sx + j, sy, w - 1, 1, st.line); P(sx, sy + h - 1, w - j, 1, st.line);
  }
  // trame di stile sopra un riempimento
  function texture(sx, sy, tx, ty, kind) {
    const s = ZX.stk, st = ZX.st, r = rnd(tx, ty, 3);
    if (s === "acq") { if (r < 0.5) { GP.fillStyle = "rgba(255,255,255,.18)"; GP.beginPath(); GP.ellipse(sx + 4 + r * 8, sy + 5 + r * 6, 5, 3, r * 3, 0, 7); GP.fill(); } if (r > 0.82) P(sx + 9, sy + 11, 3, 2, "rgba(120,90,60,.12)"); }
    else if (s === "xil") { for (let i = 0; i < 3; i++) P(sx + ((tx * 5 + i * 6) % 14), sy + 3 + i * 5, 3 + (i % 2), 1, kind === "dark" ? "rgba(239,229,207,.5)" : "rgba(29,26,23,.28)"); }
    else if (s === "fum") { if ((tx + ty) % 2 === 0) for (let y = 2; y < 16; y += 4) for (let x = 2 + ((y / 4) % 2) * 2; x < 16; x += 4) P(sx + x, sy + y, 1, 1, "rgba(0,0,0,.12)"); }
    else if (s === "mat") { GP.strokeStyle = "rgba(90,90,90,.18)"; GP.lineWidth = 1; GP.beginPath(); for (let i = 0; i < 3; i++) { const yy = sy + 3 + i * 5 + r * 2; GP.moveTo(sx + 1, yy + 2); GP.lineTo(sx + 14, yy); } GP.stroke(); }
  }
  // erba a chiazze morbide (niente scacchiera): tono deciso a gruppi di 2x2 tessere, con una sfumatura interna
  function grassBase(sx, sy, tx, ty) {
    const st = ZX.st, n = rnd(tx >> 1, ty >> 1, 7) * 0.7 + rnd(tx, ty, 8) * 0.3;
    P(sx, sy, 16, 16, n < 0.38 ? st.g1 : n < 0.72 ? st.g2 : st.g3);
    const n2 = rnd(tx + 1, ty, 11);
    if (n2 < 0.35) { GP.fillStyle = n < 0.5 ? st.g3 : st.g1; GP.globalAlpha = 0.45; GP.beginPath(); GP.ellipse(sx + 4 + n2 * 20, sy + 6 + n2 * 10, 7, 4, n2 * 4, 0, 7); GP.fill(); GP.globalAlpha = 1; }
  }
  function floorPaint(f, sx, sy, tx, ty) {
    const st = ZX.st, r = rnd(tx, ty, 1);
    if (f === ",") { grassBase(sx, sy, tx, ty); texture(sx, sy, tx, ty); if (r < 0.14) { P(sx + 4, sy + 9, 1, 3, st.g3); P(sx + 6, sy + 8, 1, 4, st.g3); P(sx + 5, sy + 7, 1, 5, st.g3); } }
    else if (f === ":") { P(sx, sy, 16, 16, st.path); if (r < 0.3) P(sx + 3 + r * 20 % 9, sy + 5, 3, 2, st.path2); if (r > 0.7) P(sx + 9, sy + 11, 2, 2, st.path2); if (ZX.stk === "mat") texture(sx, sy, tx, ty); }
    else if (f === ";") { grassBase(sx, sy, tx, ty); texture(sx, sy, tx, ty); const cols = ZX.stk === "xil" ? [st.accent, st.ink] : ZX.stk === "mat" ? ["#9b9b96", "#bdbdb7"] : ["#f2a5b8", "#ffe28a", "#ffffff", "#c9a7f2"]; for (let i = 0; i < 3; i++) { const x = sx + 2 + ((tx * 7 + i * 5) % 12), y = sy + 2 + ((ty * 5 + i * 7) % 12); P(x, y, 2, 2, cols[(tx + ty + i) % cols.length]); } }
    else if (f === "=") { P(sx, sy, 16, 16, ZX.stk === "mat" ? "#e9e8e1" : "#b98a5a"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, ZX.stk === "xil" ? st.ink : "rgba(70,45,25,.5)"); P(sx + 1, sy, 1, 16, "rgba(70,45,25,.35)"); P(sx + 14, sy, 1, 16, "rgba(70,45,25,.35)"); if (ZX.stk === "acq") { GP.fillStyle = "rgba(59,58,74,.65)"; GP.font = "bold 5px serif"; GP.fillText("PONTE".charAt((tx + ty) % 5), sx + 6, sy + 10); } }
    else if (f === "-") { const c = st.pitch; P(sx, sy, 16, 16, tx % 2 ? c[0] : c[1]); texture(sx, sy, tx, ty); }
    else if (f === "+") { P(sx, sy, 16, 16, (tx + ty) % 2 ? st.stone : st.path2); P(sx, sy, 16, 1, "rgba(0,0,0,.12)"); P(sx, sy, 1, 16, "rgba(0,0,0,.08)"); if (ZX.stk === "fum") P(sx + 7, sy + 7, 2, 2, "rgba(0,0,0,.18)"); }
    else if (f === '"') { P(sx, sy, 16, 16, ZX.stk === "xil" ? "#a8231f" : ZX.stk === "fum" ? "#e63946" : "#a5584a"); P(sx, sy + 2, 16, 1, "rgba(255,240,200,.35)"); P(sx, sy + 13, 16, 1, "rgba(255,240,200,.35)"); }
    else if (f === "'") { P(sx, sy, 16, 16, st.blank); GP.fillStyle = "rgba(60,60,80,.28)"; for (let i = 0; i < 3; i++) P(sx + 2, sy + 3 + i * 4, 6 + ((tx * 3 + ty + i) % 8), 1, "rgba(60,60,80,.25)"); }
    else { P(sx, sy, 16, 16, st.g1); }
  }
  // ---- case: house(x,y,w,h,opts) scrive «y» e ricorda le parti (tetto, muri, finestre)
  function houseTile(sx, sy, tx, ty) {
    const m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx], st = ZX.st;
    if (!m) { P(sx, sy, 16, 16, st.wall); outline(sx, sy, 16, 16, tx, ty); return; }
    const o = m.o, roof = o.roof || st.roof, wall = o.wall || st.wall;
    if (m.ry === 0) { // tetto
      P(sx, sy, 16, 16, roof);
      if (ZX.stk === "xil") { for (let i = 0; i < 16; i += 3) P(sx + i, sy + 2, 1, 12, "rgba(29,26,23,.55)"); }
      else if (o.straw) { for (let i = 0; i < 16; i += 2) P(sx + i, sy + 3 + (i % 4), 1, 11, "rgba(140,100,30,.45)"); }
      else { P(sx, sy + 5, 16, 1, "rgba(0,0,0,.18)"); P(sx, sy + 11, 16, 1, "rgba(0,0,0,.18)"); P(sx + ((tx * 5) % 8), sy, 1, 5, "rgba(0,0,0,.12)"); }
      P(sx, sy + 14, 16, 2, "rgba(0,0,0,.28)");
      if (m.rx === 0) P(sx, sy, 2, 16, "rgba(0,0,0,.2)");
      if (o.chim && m.rx === o.chim) { P(sx + 5, sy - 6, 6, 8, ZX.stk === "fum" ? "#8b5a2b" : st.stone); P(sx + 4, sy - 7, 8, 2, st.ink); }
      if (ZX.stk === "fum") P(sx, sy, 16, 1, st.ink);
      return;
    }
    P(sx, sy, 16, 16, wall);
    if (o.wood) for (let i = 3; i < 16; i += 4) P(sx, sy + i, 16, 1, "rgba(80,50,25,.35)");
    if (o.brick) for (let r = 0; r < 4; r++) { P(sx, sy + r * 4 + 3, 16, 1, "rgba(120,40,30,.35)"); P(sx + ((r % 2) * 8 + 3), sy + r * 4, 1, 4, "rgba(120,40,30,.35)"); }
    if (o.straw) for (let i = 0; i < 16; i += 3) P(sx + i, sy, 1, 16, "rgba(150,110,40,.3)");
    texture(sx, sy, tx, ty);
    const win = m.ry === 1 && m.rx > 0 && m.rx < o.w - 1 && (m.rx % 2 === 1);
    if (win && !(o.door && o.door[0] === tx)) {
      const lit = ZX.stk !== "mat";
      P(sx + 4, sy + 3, 8, 8, ZX.stk === "xil" ? st.ink : "#3b3a4a"); P(sx + 5, sy + 4, 6, 6, lit ? (ZX.stk === "xil" ? "#efe5cf" : "#ffe7a3") : "#ffffff"); P(sx + 7, sy + 4, 1, 6, ZX.stk === "xil" ? st.ink : "#3b3a4a"); P(sx + 5, sy + 6, 6, 1, ZX.stk === "xil" ? st.ink : "#3b3a4a");
      if (o.shut) { P(sx + 2, sy + 3, 2, 8, o.shut); P(sx + 12, sy + 3, 2, 8, o.shut); }
    }
    if (m.rx === 0) P(sx, sy, 1, 16, "rgba(0,0,0,.22)");
    if (m.rx === o.w - 1) P(sx + 15, sy, 1, 16, "rgba(0,0,0,.3)");
    if (ZX.stk === "fum") { if (m.rx === 0) P(sx, sy, 1, 16, st.ink); if (m.rx === o.w - 1) P(sx + 15, sy, 1, 16, st.ink); if (m.ry === o.h - 1) P(sx, sy + 15, 16, 1, st.ink); }
  }
  function doorTile(sx, sy, tx, ty, locked) {
    const st = ZX.st, m = ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx];
    P(sx, sy, 16, 16, (m && m.o.wall) || st.wall);
    P(sx + 3, sy + 2, 10, 14, locked ? "#5a4636" : ZX.stk === "xil" ? st.accent : "#7a4a2a"); P(sx + 3, sy + 2, 10, 2, "rgba(0,0,0,.25)");
    P(sx + 10, sy + 9, 2, 2, "#ffd23f");
    if (locked) { P(sx + 3, sy + 7, 10, 2, "#2a2a2a"); P(sx + 6, sy + 10, 4, 4, "#c9a227"); P(sx + 7, sy + 11, 2, 2, "#2a2a2a"); }
    if (ZX.stk === "fum") { P(sx + 3, sy + 2, 10, 1, st.ink); P(sx + 3, sy + 2, 1, 14, st.ink); P(sx + 12, sy + 2, 1, 14, st.ink); }
  }
  function arrowTile(ch, sx, sy, tx, ty) {
    floorPaint(undAt(tx, ty), sx, sy, tx, ty);
    const fr = frNow(), b = Math.sin(fr / 8) * 1.5;
    GP.fillStyle = ZX.stk === "xil" ? ZX.st.accent : ZX.stk === "mat" ? "#5a6b8c" : "#ffd23f"; GP.strokeStyle = ZX.st.ink; GP.lineWidth = 1; GP.beginPath();
    if (ch === ">") { GP.moveTo(sx + 4 + b, sy + 4); GP.lineTo(sx + 12 + b, sy + 8); GP.lineTo(sx + 4 + b, sy + 12); }
    else if (ch === "<") { GP.moveTo(sx + 12 - b, sy + 4); GP.lineTo(sx + 4 - b, sy + 8); GP.lineTo(sx + 12 - b, sy + 12); }
    else if (ch === "v") { GP.moveTo(sx + 4, sy + 4 + b); GP.lineTo(sx + 8, sy + 12 + b); GP.lineTo(sx + 12, sy + 4 + b); }
    else { GP.moveTo(sx + 4, sy + 12 - b); GP.lineTo(sx + 8, sy + 4 - b); GP.lineTo(sx + 12, sy + 12 - b); }
    GP.closePath(); GP.fill(); GP.stroke();
  }
  const PAINT = {
    a(sx, sy, tx, ty) { // bordo della pagina: carta spessa con la piega
      const st = ZX.st; P(sx, sy, 16, 16, ZX.stk === "fum" ? "#111" : ZX.stk === "xil" ? st.ink : "#cdbf9f");
      if (ZX.stk === "acq") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#cbbd9c" : "#d3c6a6"); for (let i = 0; i < 3; i++) P(sx, sy + 3 + i * 5, 16, 1, "rgba(120,100,70,.25)"); }
      if (ZX.stk === "mat") { P(sx, sy, 16, 16, "#dcdbd3"); GP.strokeStyle = "rgba(80,80,80,.35)"; GP.beginPath(); GP.moveTo(sx, sy + 16); GP.lineTo(sx + 16, sy); GP.moveTo(sx + 8, sy + 16); GP.lineTo(sx + 16, sy + 8); GP.stroke(); }
      if (at(tx, ty + 1) !== "a" && ZX.stk !== "fum") P(sx, sy + 14, 16, 2, "rgba(0,0,0,.22)");
    },
    t(sx, sy, tx, ty, fr) { // albero ritagliato, con l'ombra di carta
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const st = ZX.st, sw = Math.sin(fr / 40 + tx) * 0.8;
      GP.fillStyle = "rgba(0,0,0,.18)"; GP.beginPath(); GP.ellipse(sx + 10, sy + 14, 8, 3, 0, 0, 7); GP.fill();
      P(sx + 7, sy + 8, 3, 7, st.trunk); P(sx + 7, sy + 8, 1, 7, "rgba(255,255,255,.18)");
      const big = rnd(tx, ty, 6) < 0.5 ? 1 : 0;
      GP.fillStyle = st.tree; GP.beginPath(); GP.arc(sx + 8 + sw, sy + 4, 8 + big, 0, 7); GP.arc(sx + 3 + sw, sy + 7, 5, 0, 7); GP.arc(sx + 13 + sw, sy + 7, 5, 0, 7); GP.fill();
      GP.fillStyle = st.tree2; GP.beginPath(); GP.arc(sx + 6 + sw, sy + 1, 4, 0, 7); GP.arc(sx + 11 + sw, sy + 3, 3, 0, 7); GP.fill();
      if (ZX.stk === "acq") { GP.fillStyle = "rgba(40,70,50,.25)"; GP.beginPath(); GP.ellipse(sx + 9 + sw, sy + 9, 7, 3, 0, 0, 7); GP.fill(); }
      if (ZX.stk === "fum" || ZX.stk === "xil") { GP.strokeStyle = st.ink; GP.lineWidth = 1; GP.beginPath(); GP.arc(sx + 8 + sw, sy + 4, 8 + big, Math.PI * 0.9, Math.PI * 2.1); GP.stroke(); }
      if (ZX.stk === "xil") { for (let i = 0; i < 4; i++) P(sx + 4 + i * 2, sy + 3 + i, 1, 5, "#efe5cf"); }
      if (ZX.stk === "mat") { GP.strokeStyle = "rgba(70,70,70,.5)"; GP.beginPath(); GP.arc(sx + 8 + sw, sy + 4, 8, 0.4, 5.6); GP.stroke(); }
      if (ZX.stk === "acq" && rnd(tx, ty, 5) < 0.3) { P(sx + 5, sy + 3, 2, 2, "#e8806a"); P(sx + 11, sy + 1, 2, 2, "#e8806a"); P(sx + 13, sy + 6, 2, 2, "#e8806a"); }
    },
    h(sx, sy, tx, ty) { // siepe
      const st = ZX.st; P(sx, sy, 16, 16, st.tree); P(sx, sy, 16, 3, st.tree2);
      for (let i = 0; i < 5; i++) P(sx + ((tx * 3 + i * 5) % 14), sy + 4 + ((ty + i * 3) % 10), 2, 2, ZX.stk === "xil" ? "#efe5cf" : st.tree2);
      if (ZX.stk === "xil" && (tx + ty) % 3 === 0) P(sx + 7, sy + 7, 2, 2, st.accent);
      outline(sx, sy, 16, 16, tx, ty);
    },
    k(sx, sy, tx, ty) { // roccia
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const st = ZX.st;
      GP.fillStyle = st.stone; GP.beginPath(); GP.moveTo(sx + 2, sy + 14); GP.lineTo(sx + 4, sy + 5); GP.lineTo(sx + 9, sy + 2); GP.lineTo(sx + 14, sy + 7); GP.lineTo(sx + 14, sy + 14); GP.closePath(); GP.fill();
      GP.strokeStyle = ZX.stk === "acq" ? "rgba(59,58,74,.4)" : st.ink; GP.lineWidth = 1; GP.stroke(); P(sx + 6, sy + 5, 3, 2, "rgba(255,255,255,.35)");
    },
    _(sx, sy, tx, ty, fr) { // pagina bianca: il vuoto lasciato da un finale mangiato
      P(sx, sy, 16, 16, ZX.st.blank);
      const edgeU = at(tx, ty - 1) !== "_", edgeD = at(tx, ty + 1) !== "_", edgeL = at(tx - 1, ty) !== "_", edgeR = at(tx + 1, ty) !== "_";
      GP.fillStyle = "rgba(60,60,80,.25)";
      if (edgeU) for (let i = 0; i < 16; i += 2) P(sx + i, sy + (hash(tx * 9 + i) % 3), 2, 1, "rgba(60,60,80,.35)");
      if (edgeD) for (let i = 0; i < 16; i += 2) P(sx + i, sy + 15 - (hash(ty * 7 + i) % 3), 2, 1, "rgba(60,60,80,.35)");
      if (edgeL) P(sx, sy, 1, 16, "rgba(60,60,80,.25)"); if (edgeR) P(sx + 15, sy, 1, 16, "rgba(60,60,80,.25)");
      if ((tx * 7 + ty * 3 + Math.floor(fr / 20)) % 11 === 0) { GP.fillStyle = "rgba(90,107,140,.5)"; GP.font = "7px serif"; GP.fillText("…", sx + 4, sy + 10); }
    },
    z(sx, sy, tx, ty, fr) { // buio d'inchiostro
      P(sx, sy, 16, 16, ZX.stk === "mat" ? "#3a3a3a" : "#14121c");
      const a = 0.25 + 0.15 * Math.sin(fr / 30 + tx + ty);
      P(sx + ((tx * 5) % 12), sy + ((ty * 7) % 12), 2, 2, `rgba(160,140,220,${a})`);
    },
    w(sx, sy, tx, ty, fr) { // fiume d'inchiostro
      const st = ZX.st; P(sx, sy, 16, 16, ZX.stk === "acq" ? "#4b5c86" : st.water);
      const o = (fr / 3 + tx * 5) % 16; P(sx + o - 4, sy + 4 + (ty % 2) * 6, 6, 1, ZX.stk === "xil" ? "#efe5cf" : "rgba(255,255,255,.45)");
      if (ZX.stk === "acq" && rnd(tx, ty, 2) < 0.15) { GP.fillStyle = "rgba(255,255,255,.6)"; GP.font = "6px serif"; GP.fillText(["a", "e", "o", "r"][(tx + ty) % 4], sx + 5, sy + 12); }
    },
    f(sx, sy, tx, ty) { // staccionata
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const c = ZX.stk === "xil" ? ZX.st.ink : ZX.stk === "mat" ? "#8d8d88" : "#9a6a3a";
      P(sx, sy + 6, 16, 2, c); P(sx, sy + 11, 16, 2, c); P(sx + 2, sy + 3, 2, 12, c); P(sx + 11, sy + 3, 2, 12, c);
    },
    c(sx, sy, tx, ty) { // muro di carte da gioco
      const st = ZX.st, red = (tx + ty) % 2 === 0;
      P(sx, sy, 16, 16, "#f8f2e2"); P(sx, sy, 16, 1, st.ink); P(sx, sy, 1, 16, st.ink); P(sx + 15, sy, 1, 16, st.ink); P(sx, sy + 15, 16, 1, st.ink);
      GP.fillStyle = red ? st.accent : st.ink; GP.font = "bold 9px serif"; GP.textAlign = "center"; GP.fillText(red ? "♥" : "♠", sx + 8, sy + 11); GP.textAlign = "left";
      P(sx + 2, sy + 2, 2, 3, red ? st.accent : st.ink);
    },
    y: (sx, sy, tx, ty) => houseTile(sx, sy, tx, ty),
    q: (sx, sy, tx, ty) => doorTile(sx, sy, tx, ty, false),
    Q: (sx, sy, tx, ty) => doorTile(sx, sy, tx, ty, true),
    x(sx, sy, tx, ty) { // cassa / torchio
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const ink = ZX.st.ink;
      if (ZX.stk === "fum") { P(sx + 1, sy + 2, 14, 13, "#5d6d7e"); P(sx + 3, sy + 4, 10, 4, "#2c3e50"); P(sx + 1, sy + 2, 14, 1, ink); P(sx + 1, sy + 14, 14, 1, ink); P(sx + 6, sy, 4, 3, "#f5c842"); return; }
      P(sx + 2, sy + 4, 12, 11, "#a87a4a"); P(sx + 2, sy + 4, 12, 2, "#c89a6a"); P(sx + 2, sy + 9, 12, 1, "rgba(0,0,0,.3)"); P(sx + 7, sy + 4, 2, 11, "rgba(0,0,0,.25)");
      if (ZX.stk === "xil") { P(sx + 2, sy + 4, 12, 1, ink); P(sx + 2, sy + 14, 12, 1, ink); }
    },
    l(sx, sy, tx, ty, fr) { // lampione-candela
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const ink = ZX.st.ink;
      P(sx + 7, sy + 4, 2, 11, ZX.stk === "mat" ? "#7a7a76" : "#3b3a4a"); P(sx + 5, sy + 14, 6, 2, ink);
      P(sx + 5, sy, 6, 5, ZX.stk === "mat" ? "#ffffff" : "#ffe7a3"); P(sx + 5, sy, 6, 1, ink);
      if (ZX.stk !== "mat") { GP.save(); GP.globalCompositeOperation = "lighter"; glow(GP, sx + 8, sy + 2, 12 + Math.sin(fr / 14 + tx) * 1.5, "255,220,140", 0.35); GP.restore(); }
    },
    b(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const c = ZX.stk === "xil" ? ZX.st.ink : "#8a5a3a"; P(sx + 1, sy + 6, 14, 3, c); P(sx + 1, sy + 3, 14, 2, c); P(sx + 2, sy + 9, 2, 5, c); P(sx + 12, sy + 9, 2, 5, c); },
    i(sx, sy, tx, ty) { // pila di libri
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      const cols = ZX.stk === "xil" ? ["#1d1a17", "#a8231f", "#efe5cf"] : ZX.stk === "mat" ? ["#9b9b96", "#c9c9c3", "#7a7a76"] : ["#c0644a", "#5a7fa8", "#d9a441", "#6a9a5a"];
      for (let i = 0; i < 4; i++) { const w = 10 + ((tx + i * 3) % 4); P(sx + 8 - w / 2 + (i % 2), sy + 13 - i * 3, w, 3, cols[(tx + ty + i) % cols.length]); P(sx + 8 - w / 2 + (i % 2), sy + 13 - i * 3, w, 1, "rgba(255,255,255,.3)"); }
    },
    j(sx, sy, tx, ty) { // gradinata
      const st = ZX.st; P(sx, sy, 16, 16, ZX.stk === "xil" ? "#e0d3b6" : "#c9b08a"); P(sx, sy + 7, 16, 2, "rgba(0,0,0,.25)"); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.3)");
      const cols = ZX.stk === "xil" ? [st.ink, st.accent] : ["#f2a5b8", "#5a7fa8", "#d9a441", "#7aab6e"]; if (rnd(tx, ty, 4) < 0.6) { P(sx + 3, sy + 2, 4, 5, cols[tx % cols.length]); P(sx + 4, sy, 2, 2, "#f0c9a0"); }
    },
    n(sx, sy, tx, ty) { // cartello
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const ink = ZX.st.ink;
      P(sx + 7, sy + 8, 2, 8, ZX.stk === "mat" ? "#7a7a76" : "#7a4a2a"); P(sx + 1, sy + 1, 14, 9, ZX.stk === "fum" ? "#ffffff" : "#e8d6b0"); P(sx + 1, sy + 1, 14, 1, ink); P(sx + 1, sy + 9, 14, 1, ink);
      P(sx + 3, sy + 4, 10, 1, ink); P(sx + 3, sy + 6, 7, 1, ink);
    },
    e(sx, sy, tx, ty) { // leggio con il libro aperto
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 7, sy + 8, 2, 8, "#6a4a2a"); P(sx + 1, sy + 3, 14, 6, "#fbf7ec"); P(sx + 8, sy + 3, 1, 6, "#b9a98a"); P(sx + 2, sy + 5, 5, 1, "rgba(60,60,80,.4)"); P(sx + 9, sy + 5, 5, 1, "rgba(60,60,80,.4)");
    },
    u(sx, sy, tx, ty, fr) { // pozzo dei desideri d'inchiostro
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy + 6, 12, 9, ZX.st.stone); P(sx + 3, sy + 7, 10, 4, "#2a3550"); P(sx + 5 + Math.sin(fr / 20) * 2, sy + 8, 2, 1, "rgba(255,255,255,.6)"); P(sx + 2, sy + 1, 2, 6, "#6a4a2a"); P(sx + 12, sy + 1, 2, 6, "#6a4a2a"); P(sx + 1, sy, 14, 2, ZX.st.roof);
    },
    p(sx, sy, tx, ty) { // fungo di carta
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 6, sy + 9, 4, 6, "#f4ecd8"); GP.fillStyle = ZX.stk === "xil" ? ZX.st.accent : ZX.stk === "mat" ? "#9b9b96" : "#d9534f"; GP.beginPath(); GP.ellipse(sx + 8, sy + 9, 7, 5, 0, Math.PI, 0); GP.fill(); P(sx + 4, sy + 6, 2, 2, "#fff"); P(sx + 10, sy + 5, 2, 2, "#fff");
    },
    g(sx, sy, tx, ty) { // porta da calcio vista dall'alto (pali)
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy + 2, 12, 12, "rgba(255,255,255,.35)"); for (let i = 3; i < 14; i += 3) { P(sx + i, sy + 2, 1, 12, "rgba(255,255,255,.6)"); P(sx + 2, sy + i, 12, 1, "rgba(255,255,255,.6)"); } P(sx + 1, sy + 1, 14, 2, "#ffffff"); P(sx + 1, sy + 1, 2, 14, "#ffffff"); P(sx + 13, sy + 1, 2, 14, "#ffffff");
    },
    P(sx, sy, tx, ty, fr) { // tabellone segnapunti
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy + 1, 16, 11, "#2a2a33"); P(sx + 1, sy + 2, 14, 9, "#101018"); P(sx + 7, sy + 12, 2, 4, "#5a5a66");
      GP.fillStyle = (Math.floor(fr / 30) % 2) ? "#ffd23f" : "#ff8a3d"; GP.font = "bold 6px monospace"; GP.fillText(F.get("tab_" + ZX.id, "?:?"), sx + 2, sy + 9);
    },
    Y(sx, sy, tx, ty) { // trono
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const st = ZX.st; P(sx + 2, sy, 12, 15, st.accent); P(sx + 4, sy + 3, 8, 7, "#f8f2e2"); P(sx + 2, sy, 12, 1, st.ink); GP.fillStyle = st.ink; GP.font = "bold 7px serif"; GP.textAlign = "center"; GP.fillText("♠", sx + 8, sy + 9); GP.textAlign = "left";
    },
    K(sx, sy, tx, ty, fr) { // tana del Gommapane
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); GP.fillStyle = "#1d1a17"; GP.beginPath(); GP.ellipse(sx + 8, sy + 10, 7, 5, 0, 0, 7); GP.fill();
      if ((fr / 50 | 0) % 3 === 0) { P(sx + 5, sy + 9, 2, 2, "#ffffff"); P(sx + 9, sy + 9, 2, 2, "#ffffff"); }
    },
    Z(sx, sy, tx, ty) { // colonna di carta arrotolata
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 3, sy, 10, 16, "#f8f2e2"); P(sx + 3, sy, 2, 16, "rgba(0,0,0,.12)"); P(sx + 11, sy, 2, 16, "rgba(0,0,0,.2)"); for (let i = 2; i < 16; i += 4) P(sx + 5, sy + i, 6, 1, "rgba(60,60,80,.3)");
    },
    "*"(sx, sy, tx, ty, fr) { // una parola che galleggia
      floorPaint(undAt(tx, ty), sx, sy, tx, ty);
      const w = (ZX.wordAt && ZX.wordAt(tx, ty)) || "?", b = Math.sin(fr / 12 + tx) * 2;
      GP.save(); GP.globalCompositeOperation = "lighter"; glow(GP, sx + 8, sy + 6 + b, 16, ZX.stk === "mat" ? "90,107,140" : "255,215,120", 0.45); GP.restore();
      GP.font = "bold 7px Georgia, serif"; GP.textAlign = "center"; GP.fillStyle = "#fff"; GP.fillText(WORDS[w] ? WORDS[w].w : "?", sx + 9, sy + 9 + b); GP.fillStyle = ZX.st.ink; GP.fillText(WORDS[w] ? WORDS[w].w : "?", sx + 8, sy + 8 + b); GP.textAlign = "left";
    },
    "&"(sx, sy, tx, ty, fr) { // lettera dell'Autrice
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const b = Math.sin(fr / 15) * 1.5;
      GP.save(); GP.globalCompositeOperation = "lighter"; glow(GP, sx + 8, sy + 8, 18, "200,170,255", 0.45); GP.restore();
      P(sx + 3, sy + 4 + b, 10, 8, "#fbf7ec"); GP.fillStyle = "#a8231f"; GP.beginPath(); GP.moveTo(sx + 3, sy + 4 + b); GP.lineTo(sx + 8, sy + 9 + b); GP.lineTo(sx + 13, sy + 4 + b); GP.stroke(); P(sx + 7, sy + 8 + b, 3, 3, "#a8231f");
    },
    ">": (sx, sy, tx, ty) => arrowTile(">", sx, sy, tx, ty),
    "<": (sx, sy, tx, ty) => arrowTile("<", sx, sy, tx, ty),
    "^": (sx, sy, tx, ty) => arrowTile("^", sx, sy, tx, ty),
    v: (sx, sy, tx, ty) => arrowTile("v", sx, sy, tx, ty),
  };
  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const fn = PAINT[ch];
    if (fn) { fn(sx, sy, tx, ty, frNow()); return true; }
    floorPaint(",", sx, sy, tx, ty); return true; // qualsiasi lettera sconosciuta: almeno il terreno della pagina
  }
  function makeLayers(w, h) {
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(",")), meta = Array.from({ length: h }, () => Array(w).fill(null));
    ZX.under = u; ZX.meta = meta;
    const put = (x, y, ch) => { if (m[y] && x >= 0 && x < w) { m[y][x] = ch; if (isFloor(ch)) u[y][x] = ch; } };
    const lay = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(x, y, ch); };
    const house = (x, y, hw, hh, o) => {
      o = Object.assign({ w: hw, h: hh }, o || {});
      for (let yy = 0; yy < hh; yy++) for (let xx = 0; xx < hw; xx++) { put(x + xx, y + yy, "y"); if (meta[y + yy]) meta[y + yy][x + xx] = { o, rx: xx, ry: yy }; }
      if (o.door) { put(o.door[0], o.door[1], o.door[2] || "q"); if (meta[o.door[1]]) meta[o.door[1]][o.door[0]] = { o, rx: o.door[0] - x, ry: o.door[1] - y }; }
    };
    return { lay, put, house, w, h };
  }

  // ------------------------------------------------------------------ capitoli, zone, ganci
  const CHAPTERS = {}, ZONES = {}, COS = {};
  const PENDING = [];
  const zoneRec = () => (api ? ZONES[api.trZone()] || null : null);
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "lb_radura";
  const activeChapter = () => { const m = mem(); let best = null; Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => { if (n <= m.ch) best = CHAPTERS[n]; }); return best || CHAPTERS[1] || null; };
  const CAST_OK = (id) => !!(api && api.CAST && api.CAST[id]);
  const goalNow = () => { const c = activeChapter(); return c && c.goal ? T(c.goal(stepOf(c.n))) : ""; };
  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch]; castHero();
    const s = stepOf(c.n), list = zr.spec.npcs ? zr.spec.npcs(s) : [];
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id));
    const hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(s) : zr.spec.hints || {});
    const gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => { if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (hints[k] || ""); });
    zr.Z.hints = hints;
  }
  let soon = 0;
  const refreshSoon = () => { clearTimeout(soon); soon = setTimeout(() => safe(refreshZone), 0); };

  // dialoghi e scelte: ogni dialogo torna SEMPRE alla mappa, a meno che si passi esplicitamente a un altro dialogo o a una partita
  const done = () => { refreshZone(); api.trResume(); };
  function lines(ls, bg) { return ls.map((l) => api.L(l[0], T(l[1]), l[2] || bg || bgNow())); }
  function say(ls, then) { api.trSay(lines(ls), typeof then === "function" ? then : done); }
  function ask(who, prompt, opts, bg) {
    api.trAsk(who, esc(T(prompt)).replace(/\n/g, "<br>"), opts.map((o) => ({ label: T(o.label), sub: o.sub ? T(o.sub) : undefined, cls: o.cls || "", disabled: !!o.disabled, fn: o.fn })), bg || bgNow());
  }
  // il Narratore parla; se la sua frase contraddice ciò che vedi, puoi obiettare (nota a margine)
  function narr(text, then, objection) {
    SFX.narr();
    const go = typeof then === "function" ? then : done;
    if (!objection || mem().marg.includes(objection.id)) return say([["lb_narratore", text]], go);
    say([["lb_narratore", text]], () => ask("voce", "Il Narratore ha appena detto: «" + text + "»\nÈ davvero così?", [
      { label: "✒ Obietta: «" + objection.say + "»", sub: "Una nota a margine", cls: "hot", fn: () => margin(objection.id, objection.note, () => say(objection.reply || [["lb_narratore", "…Licenza poetica. Proseguiamo."]], go)) },
      { label: "Lascia correre", sub: "Il racconto continua", fn: go },
    ]));
  }
  function margin(id, txt, then) {
    const m = mem();
    if (!m.marg.includes(id)) { m.marg.push(id); save(); note("Nota a margine: " + txt); SFX.margin(); safe(() => api.trToast("✒ Nota a margine: " + m.marg.length)); }
    if (typeof then === "function") then(); else done();
  }
  function learn(id, then) {
    const m = mem(); if (!WORDS[id]) return then ? then() : done();
    const isNew = !m.words.includes(id);
    if (isNew) { m.words.push(id); save(); SFX.word(); }
    say([["voce", isNew ? `Hai imparato la parola <b>${WORDS[id].w}</b>. ${WORDS[id].d}` : `La parola ${WORDS[id].w} è già nel tuo pennino.`]].map((l) => [l[0], l[1].replace(/<\/?b>/g, "")]), then);
  }
  function letter(n, txt, then) {
    const m = mem();
    if (!m.lett.includes(n)) { m.lett.push(n); save(); SFX.secret(); note(`Lettera dell'Autrice n. ${n}`); }
    say([["voce", `Una lettera piegata in quattro, con una calligrafia minuta e una macchia di caffè. In alto: «Lettera ${n} di ${LETTER_TOTAL}».`], ["lb_autrice", txt]], then);
  }
  function reward(key, o) {
    const msg = [];
    once(key, () => {
      if (o.coins) { const n = coinsGive(o.coins); if (n) msg.push(`+${n} monete`); }
      (o.cos ? [].concat(o.cos) : []).forEach((id) => { const c = api.COSM && api.COSM[id] && safe(() => api.bCos(id), false) ? api.COSM[id].label : null; if (c) msg.push(`Nuovo in guardaroba: ${c}`); });
    });
    return msg;
  }
  function setTiles(x0, y0, x1, y1, ch) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ZX.map && ZX.map[y] && x >= 0 && x < ZX.map[y].length) { ZX.map[y][x] = ch; if (isFloor(ch) && ZX.under && ZX.under[y]) ZX.under[y][x] = ch; }
  }

  // ------------------------------------------------------------------ effetti sulla mappa: il giro di pagina, gli schizzi d'inchiostro
  const FX = { enter: -999, splash: [] };
  function splash(tx, ty) { for (let i = 0; i < 18; i++) FX.splash.push({ x: tx * TS + 8, y: ty * TS + 8, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.8) * 3, t: 40 + Math.random() * 20 }); }
  function styleOverlay(g, cx, cy, fr) {
    const s = ZX.stk;
    if (s === "acq") { // carta e macchie d'acquerello che si muovono piano
      g.fillStyle = "rgba(244,236,216,.08)"; g.fillRect(0, 0, 320, 200);
      for (let i = 0; i < 5; i++) { const x = (i * 83 + fr * 0.05) % 360 - 20, y = (i * 47) % 200; g.fillStyle = ["rgba(242,165,184,.06)", "rgba(143,184,216,.07)", "rgba(255,226,138,.06)"][i % 3]; g.beginPath(); g.ellipse(x, y, 40, 22, i, 0, 7); g.fill(); }
    } else if (s === "xil") {
      g.fillStyle = "rgba(29,26,23,.05)"; for (let y = 0; y < 200; y += 3) g.fillRect(0, y, 320, 1);
    } else if (s === "fum") {
      g.fillStyle = "rgba(0,0,0,.07)"; for (let y = 0; y < 200; y += 6) for (let x = (y / 6) % 2 * 3; x < 320; x += 6) { const d = Math.hypot(x - 160, y - 100) / 190; if (d > 0.62) g.fillRect(x, y, 2, 2); }
      g.strokeStyle = "#111"; g.lineWidth = 3; g.strokeRect(1.5, 1.5, 317, 197);
    } else if (s === "mat") {
      g.strokeStyle = "rgba(80,80,80,.12)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 10; i++) { const y = (i * 23 + fr * 0.1) % 200; g.moveTo(0, y); g.lineTo(320, y + 6); } g.stroke();
    }
    const vg = g.createRadialGradient(160, 100, 80, 160, 100, 200); vg.addColorStop(0, "rgba(60,40,20,0)"); vg.addColorStop(1, s === "mat" ? "rgba(90,90,90,.25)" : "rgba(60,40,20,.28)"); g.fillStyle = vg; g.fillRect(0, 0, 320, 200);
  }
  function topFx(g, cx, cy) {
    const fr = frNow();
    FX.splash = FX.splash.filter((p) => p.t > 0);
    FX.splash.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.t--; g.fillStyle = `rgba(30,25,50,${Math.min(1, p.t / 30)})`; g.fillRect(p.x - cx, p.y - cy, 2, 2); });
    styleOverlay(g, cx, cy, fr);
    const k = fr - FX.enter; // giro di pagina all'ingresso
    if (k >= 0 && k < 34) {
      const t = k / 34, x = 320 * (1 - t);
      g.fillStyle = ZX.st.paper; g.fillRect(0, 0, x, 200);
      const sh = g.createLinearGradient(x - 30, 0, x, 0); sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.35)"); g.fillStyle = sh; g.fillRect(x - 30, 0, 30, 200);
      g.fillStyle = "#fffdf6"; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 26 * (1 - t), 100, x, 200); g.lineTo(x, 200); g.fill();
      if (t < 0.5) { g.fillStyle = "rgba(59,58,74,.55)"; g.font = "italic 10px Georgia, serif"; g.textAlign = "center"; g.fillText(zoneRec() ? zoneRec().spec.short : "", x / 2, 104); g.textAlign = "left"; }
    }
  }

  // ------------------------------------------------------------------ entrare nelle zone
  function go(zid, tx, ty) { const tr = api.trRec(); tr.pos[zid] = [tx * TS + 8, ty * TS + 12]; enterZone(zid); }
  function enterZone(zid) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(); m.zone = zid; save(); castHero();
    api.trRec().seen[zid] = true;
    FX.enter = frNow(); SFX.page();
    api.trGo(zid);
    refreshZone();
    if (!m.intro[zid]) { m.intro[zid] = 1; save(); if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done); }
    api.trToast(zr.spec.short);
  }
  // scrivere su una pagina bianca: le parole conosciute come opzioni
  const WRONG = {
    ponte: "Scrivi PONTE. Le lettere si stendono, cercano due rive da unire, non le trovano e si arrotolano offese dentro il pennino.",
    luce: "Scrivi LUCE. Per un attimo il bianco diventa luminosissimo. Poi torna bianco, ma più consapevole.",
    soffio: "Scrivi SOFFIO. Una folata ti spettina e si porta via le lettere. Il bianco resta lì, pettinato.",
    aperto: "Scrivi APERTO. Il bianco si spalanca con grande dignità. Dietro c'è altro bianco.",
    muro: "Scrivi MURO. Adesso c'è un muro davanti al vuoto. Il vuoto, da dietro, sembra divertito.",
    dritto: "Scrivi DRITTO. La pagina si raddrizza di mezzo millimetro, ringrazia e non cambia altro.",
    sole: "Scrivi SOLE. Fa caldo, per un istante. Il bianco si abbronza appena. Resta bianco.",
    doppio: "Scrivi DOPPIO. Ora il bianco è il doppio. Bel lavoro.",
    ancora: "Scrivi ANCORA. Il bianco ricomincia da capo. Era già all'inizio.",
    penna: "Scrivi PENNA. La parola pesa, si appoggia sulla carta… e aspetta che tu scriva qualcos'altro.",
    larga: "Scrivi LARGA. Il vuoto si allarga un pochino. Non era quello che volevi.",
    vinto: "Scrivi VINTO. Non c'è niente da vincere, qui. Le lettere restano a galleggiare imbarazzate, poi svaniscono.",
  };
  function writeAt(zr, sp) {
    const known = mem().words.filter((w) => w !== "vinto" || sp.cheat);
    const opts = known.map((w) => ({ label: "✒ " + WORDS[w].w, sub: WORDS[w].d, fn: () => {
      SFX.scribble();
      if (w === sp.need) {
        F.set("wr_" + sp.id, true);
        setTiles(sp.area[0], sp.area[1], sp.area[2], sp.area[3], sp.to);
        splash((sp.area[0] + sp.area[2]) / 2, (sp.area[1] + sp.area[3]) / 2);
        const after = () => (sp.then ? sp.then() : done());
        return say(sp.ok || [["voce", `Scrivi ${WORDS[w].w}. L'inchiostro corre sulla pagina e la pagina ti dà ragione.`]], after);
      }
      SFX.bad();
      say([["voce", WRONG[w] || "La parola scivola via dalla carta."]], done);
    } }));
    if (!opts.length) return say([["voce", sp.empty || "Una pagina bianca. Qui ci andrebbe scritta una parola, ma il tuo pennino è ancora vuoto."]], done);
    ask("voce", sp.prompt || "Una pagina bianca, morbida come neve. Il pennino ti prude tra le dita. Cosa scrivi?", [...opts, { label: "Lascia stare", fn: done }]);
  }

  function registerZone(chN, zid, spec) {
    const stk = spec.style || "acq";
    const wordAt = (tx, ty) => (spec.words || {})[tx + "," + ty];
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0, w: spec.w, h: spec.h, start: spec.start, theme: "torino", isCustomSaga: true,
      bus: "libro", busLabel: "Chiudi il libro",
      item: spec.item || ["Goccia d'inchiostro", "Gocce"], itemCos: spec.itemCos, items: spec.items || [], bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({ "*": "Raccogli la parola", "&": "Leggi la lettera", _: "Scrivi sulla pagina bianca", z: "Scrivi nel buio", Q: "Scrivi sulla porta chiusa" }, spec.act || {}), intro: [],
      me: () => { const c = api.CAST.hero || api.CAST.leo; return Object.assign({}, c); },
      drawItem(x, y, i) {
        const g = GP || document.getElementById("cv").getContext("2d");
        g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 10, "120,110,220", 0.45 + 0.15 * Math.sin(frNow() / 10 + i)); g.restore();
        g.fillStyle = stk === "mat" ? "#4a4a4a" : "#2a2550"; g.beginPath(); g.moveTo(x, y - 6); g.quadraticCurveTo(x + 5, y + 1, x, y + 4); g.quadraticCurveTo(x - 5, y + 1, x, y - 6); g.fill();
        g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(x - 2, y - 1, 1, 2);
      },
    };
    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: il Segnalibro e Chiudi il libro." });
    Z.build = function (m) {
      ZX.map = m; ZX.id = zid; ZX.stk = stk; ZX.st = STY[stk]; ZX.wordAt = wordAt; GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h); Ls.lay(0, 0, spec.w - 1, spec.h - 1, ",");
      spec.build(Ls);
      // parole già raccolte, pagine già scritte, lettere già lette
      Object.keys(spec.words || {}).forEach((k) => { const [x, y] = k.split(",").map(Number); if (knows(spec.words[k]) || F.is("wd_" + zid + "_" + k.replace(",", "_"))) Ls.put(x, y, undAt(x, y)); else Ls.put(x, y, "*"); });
      (spec.writes || []).forEach((sp) => { if (F.is("wr_" + sp.id)) Ls.lay(sp.area[0], sp.area[1], sp.area[2], sp.area[3], sp.to); });
      if (spec.letter) { const [x, y] = spec.letter.at; Ls.put(x, y, mem().lett.includes(spec.letter.n) ? undAt(x, y) : "&"); }
      if (spec.after) spec.after(Ls);
      refreshSoon();
    };
    Z.tile = function (ch, sx, sy, tx, ty) { GP = GP || document.getElementById("cv").getContext("2d"); if (ZX.id !== zid) { ZX.id = zid; ZX.stk = stk; ZX.st = STY[stk]; ZX.wordAt = wordAt; } return drawTile(ch, sx, sy, tx, ty); };
    const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() });
    Z.decor = function (cx, cy) { if (spec.decor) safe(() => spec.decor(GP, cx, cy, dd(cx, cy))); };
    Z.top = function (cx, cy) { if (spec.top) safe(() => spec.top(GP, cx, cy, dd(cx, cy))); safe(() => topFx(GP, cx, cy)); };
    Z.onObj = function (ch, tx, ty) {
      const zr = ZONES[zid];
      if (ch === "*") {
        const w = wordAt(tx, ty); if (!w) return false;
        F.set("wd_" + zid + "_" + tx + "_" + ty, true); setTiles(tx, ty, tx, ty, undAt(tx, ty)); splash(tx, ty);
        learn(w, () => { const c = CHAPTERS[chN]; if (c && c.onWord) return c.onWord(w); done(); });
        return true;
      }
      if (ch === "&" && spec.letter) { setTiles(tx, ty, tx, ty, undAt(tx, ty)); letter(spec.letter.n, spec.letter.txt, done); return true; }
      if ("_zQ".includes(ch)) {
        const sp = (spec.writes || []).find((s) => tx >= s.area[0] && tx <= s.area[2] && ty >= s.area[1] && ty <= s.area[3]);
        if (sp && !(sp.when && !sp.when())) { writeAt(zr, sp); return true; }
        say([["voce", ch === "z" ? "Buio fitto, come una pagina chiusa. Qui non serve ancora scrivere niente: forse più avanti." : ch === "Q" ? "Una porta chiusa a chiave. La serratura ha la forma di una parola." : "Una pagina bianca. È il pezzo di storia che qualcuno ha mangiato. Ci torni quando hai la parola giusta."]], done);
        return true;
      }
      const c = CHAPTERS[chN];
      const f = c && c.obj && (c.obj[zid + ":" + ch + ":" + tx + "," + ty] || c.obj[zid + ":" + ch]);
      if (f) { f({ ch, tx, ty, zid }); return true; }
      const a = Z.act[tx + "," + ty] || Z.act[ch];
      const flav = spec.flavor && (spec.flavor[tx + "," + ty] || spec.flavor[ch]);
      if (flav) { say([["voce", Array.isArray(flav) ? pick(flav) : flav]], done); return true; }
      if (a) { say([["voce", "Lo guardi bene. Sulla carta, qui, c'è solo quello che si vede."]], done); return true; }
      return false;
    };
    Z.menu = () => zoneMenu();
    api.TRZ[zid] = Z;
    ZONES[zid] = { ch: chN, spec, Z };
  }

  // ------------------------------------------------------------------ menu in gioco e il Segnalibro (taccuino)
  function leave() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  function zoneMenu() {
    const c = activeChapter(), m = mem();
    api.trAsk("voce", `<b>Il Libro che Mangiava i Finali</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Parole ${m.words.length} · Note a margine ${m.marg.length} · Lettere ${m.lett.length}/${LETTER_TOTAL} · Monete ${bal()}</span>`, [
      { label: "Il Segnalibro", sub: "Parole, note a margine, lettere e finali", cls: "hot", fn: () => notebook(zoneMenu, true) },
      { label: "Chiudi il libro", sub: "Progressi e posizione restano salvati", cls: "hot", fn: leave },
    ], bgNow());
  }
  const ENDINGS = {
    fine: ["FINE", "Il libro si chiude con tutti i suoi finali al loro posto."],
    fine_storta: ["FINE?", "Il libro si chiude, ma qualche finale è rimasto storto."],
    aperto: ["IL LIBRO APERTO", "Il libro non finisce più: ogni lettura scrive un finale nuovo."],
    narratore: ["IL NUOVO NARRATORE", "Resti dentro il libro. Ora la voce sei tu."],
    penna: ["LA PENNA AL LETTORE", "Il finale segreto. La penna passa di mano."],
  };
  const TALES = [["fin1", "I Tre Porcellini", { vero: "Finale vero: il Lupo soffia, la casa di mattoni resiste", riscritto: "Finale riscritto: il Lupo diventa il quarto porcellino" }],
    ["fin2", "La Regina di Picche", { vero: "Finale vero: nessuno la batté mai", riscritto: "Finale riscritto: un giorno perse, e fu felice" }],
    ["fin3", "La Banda dei Balloon", { vero: "Finale vero: la banda finisce in prigione, tra le vignette", riscritto: "Finale riscritto: la banda apre un teatro di nuvolette" }]];
  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "", shot: "saetta" };
    const words = m.words.length ? m.words.map((w) => `<b>${esc(WORDS[w].w)}</b>`).join(" · ") : "<span style='color:var(--dim)'>Nessuna parola, per ora.</span>";
    const tales = TALES.map(([k, n, o]) => { const v = F.get(k, ""); return `• <b>${esc(n)}</b>: <span style="color:var(--dim)">${esc(v ? o[v] || v : "da scrivere")}</span>`; }).join("<br>");
    const ends = Object.keys(ENDINGS).map((k) => m.ends.includes(k) ? `✓ <b>${esc(ENDINGS[k][0])}</b> <span style="color:var(--dim)">${esc(ENDINGS[k][1])}</span>` : `<span style="color:var(--dim)">• ???</span>`).join("<br>");
    const notes = m.log.slice(-6).map((x) => `• ${esc(T(x))}`).join("<br>") || "<span style='color:var(--dim)'>Ancora nessun appunto.</span>";
    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)} · «${esc(h.shotName || "")}»<br><br><b>Parole nel pennino</b><br>${words}<br><br><b>Fiabe</b><br>${tales}<br><br><b>Note a margine</b> ${m.marg.length} · <b>Lettere dell'Autrice</b> ${m.lett.length}/${LETTER_TOTAL}${m.cheat ? ` · <span style="color:#ff8a8a">Imbrogli ${m.cheat}</span>` : ""}<br><br><b>Finali del Libro</b><br>${ends}<br><br><b>Ultimi appunti</b><br>${notes}`;
    const opts = [{ label: "Le parole, una per una", sub: "Cosa fanno sulla mappa e nella Partita Scritta", fn: () => wordsPage(() => notebook(back, inZone), inZone) }, { label: "◂ Indietro", fn: back }];
    if (inZone) return api.trAsk("voce", html, opts.filter((o) => o.label !== "◂ Indietro").concat([{ label: "◂ Indietro", fn: back }]), bgNow());
    api.scene("lb_copertina", "voce", html, opts, "Il Segnalibro");
  }
  function wordsPage(back, inZone) {
    const m = mem();
    const html = m.words.length ? m.words.map((w) => `<b>${esc(WORDS[w].w)}</b> · ${esc(WORDS[w].d)}${WORDS[w].m ? `<br><span style="color:var(--dim)">In partita: ${esc(WORDS[w].m)}</span>` : ""}`).join("<br><br>") : "Il pennino è vuoto.";
    if (inZone) return api.trAsk("voce", html, [{ label: "◂ Indietro", fn: back }], bgNow());
    api.scene("lb_copertina", "voce", html, [{ label: "◂ Indietro", fn: back }], "Le parole");
  }

  // ------------------------------------------------------------------ partite
  let inMatch = false;
  function playMatch(o) {
    castHero(); inMatch = true;
    api.matchPick({
      alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget, homeKit: o.homeKit, cageField: o.cageField,
      force: o.force !== false && !!o.alt && !/,/.test(o.alt), id: o.id, chap: T(o.chap), intro: T(o.intro), mate: o.mate, mateGeneric: true, us: o.us, min: o.min || 45, team: o.team, venue: o.venue, weather: o.weather, bg: o.bg, hero: undefined,
      onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else if (r.a < r.b) m.losses++; save(); refreshZone(); safe(() => o.done(r), null); },
    });
  }
  function finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok").slice(0, 24); if (m.ch <= n) m.ch = n + 1; save(); }
  function cheat() { const m = mem(); m.cheat = Math.min(99, m.cheat + 1); save(); note("Hai scritto VINTO invece di giocare."); }

  // ------------------------------------------------------------------ cassetta degli attrezzi dei capitoli
  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, pick, safe, F, mem, save, stepOf, setStep, note, once, reward, coinsGive, bal, hero, castHero,
    say, ask, narr, margin, learn, letter, knows, done, go, enterZone, playMatch, finishChapter, cheat, setTiles, splash, SFX, WORDS, STY, glow, onScr, frNow, refreshZone, bgNow, notebook, leave,
    lines, scene: (ls, then) => api.play(lines(ls, "lb_copertina"), then),
    cast: (id, c, bio) => { if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c); if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio; },
    cos: (id, d) => { COS[id] = d; if (api && api.COSM && !api.COSM[id]) api.COSM[id] = d; },
    end: (id) => { const m = mem(); if (ENDINGS[id] && !m.ends.includes(id)) { m.ends.push(id); save(); } },
    ENDINGS, continueStory: () => continueStory(), hasChapter: (n) => !!CHAPTERS[n],
  };
  function addChapter(fn) {
    if (!api) { PENDING.push(fn); return; }
    const def = typeof fn === "function" ? fn(XTOOLS) : fn;
    if (!def || !def.n || CHAPTERS[def.n]) return;
    CHAPTERS[def.n] = def;
    Object.keys(def.zones || {}).forEach((zid) => registerZone(def.n, zid, def.zones[zid]));
  }

  // ------------------------------------------------------------------ schermate fuori dal mondo camminabile
  function leaveToModes() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  const lastCh = () => Math.max(...Object.keys(CHAPTERS).map(Number), 1);
  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    reload();
    const h = hero();
    if (!h) {
      return api.scene("lb_copertina", "voce", "<b>Il Libro che Mangiava i Finali</b><br>Questa storia ha bisogno di un protagonista: il tuo Campione. Nome, aspetto e tiro speciale finiscono dentro le pagine.", [
        { label: "Crea il tuo Campione", sub: "Nome, numero e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
        { label: "◂ Modalità", fn: leaveToModes },
      ], "Il Libro");
    }
    castHero();
    const c = activeChapter(), m = mem(), cur = c && m.done[c.n], nextOk = !!CHAPTERS[(c ? c.n : 0) + 1];
    const status = m.done[4] ? `Il libro è finito. Finali trovati: ${m.ends.length} su ${Object.keys(ENDINGS).length}.` : cur ? (nextOk ? "Il prossimo capitolo ti aspetta." : "Capitolo concluso · le pagine dopo sono ancora in tipografia.") : goalNow();
    api.scene("lb_copertina", "voce", `<b>📖 Il Libro che Mangiava i Finali</b><br>${esc(h.name)} · n. ${esc(h.num)} · «${esc(h.shotName || "")}»<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${esc(status)}</span>`, [
      { label: c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Volta pagina: Capitolo ${c.n}` : "Apri il libro") : "Continua a leggere", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
      { label: "Il Segnalibro", sub: `Parole ${m.words.length} · Note a margine ${m.marg.length} · Lettere ${m.lett.length}/${LETTER_TOTAL}`, fn: () => notebook(openMain, false) },
      { label: "Indice dei capitoli", sub: "Rileggi i capitoli già sbloccati", fn: chapters },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Il Libro");
  }
  function chapters() {
    const m = mem(), opts = [];
    for (let n = 1; n <= 4; n++) {
      const c = CHAPTERS[n], open = c && (n === 1 || m.done[n - 1] || m.ch >= n);
      if (open) opts.push({ label: `${m.done[n] ? "✓" : "▸"} Capitolo ${n} · ${c.title}`, sub: m.done[n] ? "Concluso · rileggi le sue pagine" : c.sub || "In corso", cls: m.ch === n ? "hot" : "", fn: () => { m.ch = n; save(); continueStory(); } });
      else opts.push({ label: `• Capitolo ${n} · ${c ? c.title : "???"}`, sub: c ? "Finisci il capitolo prima" : "Pagine ancora in tipografia", disabled: true, fn: chapters });
    }
    opts.push({ label: "Ricomincia il libro", sub: "Cancella solo questo salvataggio", fn: resetAsk });
    opts.push({ label: "◂ Indietro", fn: openMain });
    api.scene("lb_copertina", "voce", "<b>Indice</b><br>Un capitolo per ogni fiaba, uno stile per ogni capitolo. Le scelte restano scritte: cambiano le fiabe e il finale del libro.", opts, "Il Libro · Indice");
  }
  function resetAsk() {
    api.scene("lb_copertina", "voce", "<b>Ricominciare il libro?</b><br>Si cancellano scelte, parole, note e finali di questa saga. Monete e cosmetici già ricevuti restano tuoi.", [
      { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
      { label: "◂ No", fn: chapters },
    ], "Il Libro");
  }
  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    castHero();
    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save();
      return api.play(lines(c.intro(), "lb_copertina"), () => { const z = ZONES[c.start]; go(c.start, z.spec.start[0], z.spec.start[1]); });
    }
    const zid = m.zone && ZONES[m.zone] && ZONES[m.zone].ch <= m.ch ? m.zone : c.start;
    enterZone(zid);
  }

  // ------------------------------------------------------------------ avvio, ganci dei dialoghi, pulsante di uscita
  function start() {
    Object.keys(COS).forEach((id) => { if (api.COSM && !api.COSM[id]) api.COSM[id] = COS[id]; });
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set);
    const prev = chained ? window.trTalkHook : null;
    const mineC = (id) => { const zr = zoneRec(); if (!zr || !zr.Z.npcs.some((n) => n.id === id)) return null; const c = CHAPTERS[zr.ch]; return c && c.talk && c.talk[id] ? c : null; };
    window.trTalkHook = function (id) {
      const c = mineC(id);
      if (c) { castHero(); safe(() => c.talk[id](), null); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
    const prevNews = window.trNewsHook;
    window.trNewsHook = function (id) {
      const c = zoneRec() && mineC(id);
      if (c) return c.news ? !!safe(() => c.news(id, stepOf(c.n)), false) : false;
      return typeof prevNews === "function" ? prevNews(id) : null;
    };
    PENDING.splice(0).forEach(addChapter);
    chip();
  }
  function chip() {
    if (document.getElementById("lbExit")) return;
    const st = document.createElement("style");
    st.textContent = "#lbExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:10px;border:1px solid #3b3a4a;background:#f4ecd8ee;color:#3b3a4a;font:700 13px/1.1 Georgia,serif;box-shadow:0 2px 8px #0008}#lbExit.on{display:block}#lbExit:active{transform:translateY(1px)}body.lbMM #stats{margin-bottom:54px}";
    document.head.appendChild(st);
    const b = document.createElement("button"); b.id = "lbExit"; b.type = "button"; b.textContent = "✕ Chiudi il libro"; b.setAttribute("aria-label", "Chiudi il libro");
    b.onclick = () => { if (inMatch) { const hb = document.getElementById("homeBtn"); if (hb) hb.click(); return; } if (zoneRec()) leave(); };
    document.body.appendChild(b);
    const oc = document.getElementById("ovlCh");
    if (oc) oc.addEventListener("click", (e) => { if (inMatch && e.target && e.target.closest && e.target.closest("button.danger")) { inMatch = false; setTimeout(() => safe(() => api.trExitTo(function () {})), 0); } });
    setInterval(() => {
      const hud = document.getElementById("matchHud"), live = !!(hud && !hud.hidden);
      const on = !!((zoneRec() && document.body.classList.contains("borgo")) || (inMatch && live));
      b.classList.toggle("on", on); document.body.classList.toggle("lbMM", !!(inMatch && live)); b.textContent = inMatch && live ? "✕ Esci dalla partita" : "✕ Chiudi il libro";
    }, 400);
  }
  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match || !a.matchPick) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a; start();
  }

  window.__libroFinali = {
    version: 1, KEY,
    addChapter, open: openMain, SFX, _has: (n) => !!CHAPTERS[n],
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return { label: "📖 Il Libro che Mangiava i Finali", cls: "hot", fn: () => openMain({ onExit: back }),
        sub: h ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "fiaba e mistero"} · fiaba meta-narrativa` : "Crea prima il tuo campione · fiaba meta-narrativa a capitoli" };
    },
    info() { const m = mem(); return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), words: m.words.slice(), marg: m.marg.length, lett: m.lett.slice(), ends: m.ends.slice(), cheat: m.cheat }; },
    _dbg: /[?&]debug\b/.test(location.search || "") ? { mem, ZONES, CHAPTERS, ZX, reload, go, setStep, F, at } : undefined,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
