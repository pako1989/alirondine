// js/storia-campione.js - VALLOMBRA: la storia a puntate del Campione creato dall'utente
// Ambientazione nuova (NON il Borgo marino): Vallombra, paese di montagna a 1.100 m sopra un mare di nebbia (il «Latte»),
// con la funivia, la vecchia Miniera della Luce e il Campo Sospeso. Personaggi tutti nuovi, tono ironico di base con episodi seri,
// colpi di scena, scelte che contano (flag salvati), più finali.
// Motore a capitoli (data-driven): ogni capitolo è una funzione registrata con addChapter() che riceve la cassetta degli attrezzi X
// (dialoghi, scelte, flag, passi, premi una tantum, zone camminabili, partita breve). Il capitolo 1 è completo; i successivi si aggiungono
// con addChapter({ n: 2, ... }) senza toccare il motore (vedi il piano in /mnt/project-files/storia-campione/piano.md).
// Si appoggia alle zone camminabili TRZ di game.js (stesso sistema del Borgo, dello Stadio e del Quartier Generale) e a window.__borgoApi.
// Ricompense: SOLO monete (una tantum) e cosmetici del guardaroba. MAI statistiche, mai effetti sulla storia o sulla Carriera principali.
// Va incluso DOPO game.js. Salvataggio proprio e normalizzato: ali-di-rondine.storia-campione (non tocca nessun altro salvataggio;
// le posizioni delle zone vivono, come per le altre zone camminabili, nel record «tr» del Borgo).
(function () {
  "use strict";
  if (window.__storiaCampioneLoaded) return;
  window.__storiaCampioneLoaded = true;
  const DEBUG = /[?&]debug\b/.test(location.search || "");
  const KEY = "ali-di-rondine.storia-campione", TS = 16;
  let tries = 0, api = null, EXIT = null;

  // ------------------------------------------------------------------ utilità
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const obj = (o) => (o && typeof o === "object" && !Array.isArray(o) ? o : {});
  const arr = (a) => (Array.isArray(a) ? a : []);
  const clampI = (v, a, b, d) => { v = Math.round(+v); return Number.isFinite(v) ? Math.max(a, Math.min(b, v)) : d; };
  const rnd = (tx, ty, k) => hash(tx * 73 + ty * 131 + k * 17) / 4294967296;

  // ------------------------------------------------------------------ salvataggio normalizzato
  const FLAG_RE = /^[a-z0-9_]{1,40}$/, REW_RE = /^[a-z0-9_:]{1,60}$/, ZONE_RE = /^[a-z0-9_]{1,24}$/;
  function norm(o) {
    o = obj(o);
    const m = { v: 1, ch: clampI(o.ch, 1, 99, 1), step: {}, flags: {}, rew: {}, done: {}, zone: "", lan: [], log: [], intro: {}, visit: clampI(o.visit, 0, 1e6, 0), wins: clampI(o.wins, 0, 1e6, 0), losses: clampI(o.losses, 0, 1e6, 0) };
    const st = obj(o.step); Object.keys(st).slice(0, 99).forEach((k) => { const n = clampI(k, 1, 99, 0); if (n) m.step[n] = clampI(st[k], 0, 99, 0); });
    const fl = obj(o.flags); let c = 0;
    Object.keys(fl).forEach((k) => {
      if (c >= 240 || !FLAG_RE.test(k)) return; const v = fl[k];
      if (typeof v === "boolean") m.flags[k] = v;
      else if (typeof v === "number" && Number.isFinite(v)) m.flags[k] = Math.max(-1e6, Math.min(1e6, Math.round(v)));
      else if (typeof v === "string" && v.length <= 24) m.flags[k] = v;
      else return;
      c++;
    });
    Object.keys(obj(o.rew)).forEach((k) => { if (REW_RE.test(k) && Object.keys(m.rew).length < 200) m.rew[k] = 1; });
    const dn = obj(o.done); Object.keys(dn).forEach((k) => { const n = clampI(k, 1, 99, 0); if (n && typeof dn[k] === "string" && dn[k].length <= 24) m.done[n] = dn[k]; });
    m.zone = typeof o.zone === "string" && ZONE_RE.test(o.zone) ? o.zone : "";
    m.lan = [...new Set(arr(o.lan).filter((x) => typeof x === "string" && FLAG_RE.test(x)))].slice(0, 60);
    m.log = arr(o.log).filter((x) => typeof x === "string").map((x) => x.slice(0, 200)).slice(-120);
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
  const note = (txt) => { const m = mem(); if (!m.log.includes(txt)) { m.log.push(txt); if (m.log.length > 120) m.log.shift(); save(); } };
  const once = (key, fn) => { const m = mem(); if (m.rew[key]) return false; m.rew[key] = 1; save(); fn(); return true; };

  // ------------------------------------------------------------------ il campione
  const hero = () => safe(() => (typeof window.heroLoad === "function" ? window.heroLoad() : null), null);
  const SHOT = { saetta: "un tiro dritto come un righello", serpentina: "un tiro che prende la curva da solo", parabola: "una parabola che chiede permesso alle nuvole", martello: "un tiro che bussa alla rete prima di entrare", traversa: "un tiro che bacia la traversa e poi ci ripensa", saudade: "un tiro malinconico che arriva comunque", muro: "un tiro che rimbalza due volte per essere sicuro" };
  // segnaposto nei testi: {n} nome, {num} numero di maglia, {tiro} nome del tiro speciale, {tipo} descrizione del tipo di tiro
  function T(s) {
    const h = hero() || { name: "Campione", num: 9, shotName: "IL TIRO", shot: "saetta" };
    return String(s).replace(/\{n\}/g, () => h.name).replace(/\{num\}/g, () => h.num).replace(/\{tiro\}/g, () => h.shotName || "IL TIRO").replace(/\{tipo\}/g, () => SHOT[h.shot] || "un tiro tutto tuo");
  }
  // maglia indossata a Vallombra (solo estetica): dipende dalla scelta «kit» del capitolo 1
  const kitCol = () => { const k = F.get("kit", ""); return k === "old" ? "#e9a64a" : k === "new" ? "#1b2f7a" : null; };
  function castHero() {
    const h = hero(), C = api && api.CAST; if (!h || !C) return;
    const kc = kitCol();
    C.hero = { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: "#2a1a0a", bg: [kc || h.shirt, "#ffd23f"], shirt: kc || h.shirt, num: String(h.num), acc: h.acc, cap: h.acc === "cappellino" ? "#ffd23f" : h.acc === "berretto" ? "#26324a" : undefined };
  }
  const coinsGive = (n) => { if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); return n; } catch (e) { return 0; } } return 0; };
  const bal = () => safe(() => window.bCoins(), 0);

  // ------------------------------------------------------------------ sfondi dei dialoghi (320x200), pixel-art procedurale
  let MOOD = 0; // 0 tramonto · 1 sera · 2 notte
  const grad = (g, x, y, w, h, stops) => { const gr = g.createLinearGradient(0, y, 0, y + h); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  function ridge(g, W, base, amp, seed, col, snow) {
    g.fillStyle = col; g.beginPath(); g.moveTo(0, 200);
    const pts = [];
    for (let x = 0; x <= W + 8; x += 8) { const y = base - amp * (0.5 + 0.3 * Math.sin(x * 0.037 + seed) + 0.25 * Math.sin(x * 0.091 + seed * 2.3) + 0.15 * Math.sin(x * 0.21 + seed * 4)); pts.push([x, y]); g.lineTo(x, y); }
    g.lineTo(W + 8, 200); g.closePath(); g.fill();
    if (snow) { g.fillStyle = "rgba(255,255,255,.5)"; pts.forEach(([x, y]) => { if (y < base - amp * 0.78) g.fillRect(x - 3, y, 6, 2); }); }
  }
  function fogBand(g, W, y0, y1, f, tone) {
    grad(g, 0, y0, W, y1 - y0, [tone[0] + "00", tone[0], tone[1]]);
    for (let i = 0; i < 9; i++) { const x = ((i * 83 + f * (0.25 + (i % 3) * 0.1)) % (W + 120)) - 60, y = y0 + 14 + (i * 29) % Math.max(10, y1 - y0 - 10); g.fillStyle = "rgba(255,255,255,.13)"; g.beginPath(); g.ellipse(x, y, 46 + (i % 4) * 10, 7, 0, 0, 7); g.fill(); }
  }
  function glow(g, x, y, r, rgb, a) { const gr = g.createRadialGradient(x, y, 1, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function sky(g, W, H, f) {
    const n = MOOD;
    grad(g, 0, 0, W, H, [n >= 2 ? "#0a0f2e" : n === 1 ? "#272863" : "#2d3470", n >= 2 ? "#18204e" : n === 1 ? "#80508e" : "#c8668a", n >= 2 ? "#2b3868" : n === 1 ? "#e8905e" : "#f6b36a"]);
    if (n >= 1) for (let i = 0; i < 46; i++) { const tw = (f / 20 + i) % 7 < 0.5; R(g, (i * 83) % W, (i * 37) % 96, 1, 1, tw ? "#ffffff" : "#aab4e8"); }
    if (n >= 2) { glow(g, 252, 34, 40, "200,215,255", 0.35); g.fillStyle = "#eef2ff"; g.beginPath(); g.arc(252, 34, 10, 0, 7); g.fill(); g.fillStyle = "#0e1436"; g.beginPath(); g.arc(256, 31, 9, 0, 7); g.fill(); }
    else { glow(g, 236, 112, 70, "255,200,140", n === 1 ? 0.4 : 0.6); g.fillStyle = n === 1 ? "#ffcf9a" : "#ffe3b0"; g.beginPath(); g.arc(236, 116, 17, Math.PI, 0); g.fill(); }
  }
  function lampGlow(g, x, y, f) { glow(g, x, y, 14 + Math.sin(f / 30 + x) * 1.5, "127,227,208", MOOD >= 1 ? 0.55 : 0.3); R(g, x - 1, y - 1, 3, 3, "#bff7ea"); }
  function houseSil(g, x, y, w, h, roof, wall, f, lit) {
    R(g, x, y, w, h, wall); g.fillStyle = roof; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + w / 2, y - h * 0.55); g.lineTo(x + w + 3, y); g.fill();
    for (let i = 0; i < Math.max(1, Math.floor(w / 12)); i++) { const on = (hash(x + i * 7) % 4) !== 0 && (lit || MOOD < 2); R(g, x + 3 + i * 11, y + 4, 5, 6, on ? "#ffcf6b" : "#2a2f4a"); }
  }
  function bgPaese(g, W, H, f) {
    const n = MOOD, dark = n >= 2;
    sky(g, W, H, f);
    ridge(g, W, 122, 50, 1.3, dark ? "#1a2150" : "#4c4a88", true);
    ridge(g, W, 134, 40, 4.1, dark ? "#121842" : "#34376f", true);
    g.strokeStyle = "#0a0e24"; g.lineWidth = 1; g.beginPath(); g.moveTo(-4, 56); g.lineTo(W + 4, 108); g.stroke();
    const t = ((f * 0.0021) % 1.5) - 0.25, cx = -4 + t * (W + 8), cy = 56 + t * 52;
    R(g, cx, cy, 1, 5, "#0a0e24"); R(g, cx - 8, cy + 4, 16, 10, "#c8422e"); R(g, cx - 8, cy + 4, 16, 2, "#e8704e"); R(g, cx - 6, cy + 7, 5, 4, "#ffd98a"); R(g, cx + 1, cy + 7, 5, 4, "#ffd98a");
    fogBand(g, W, 118, H, f, dark ? ["#3a4476", "#242b58"] : ["#d6d8ee", "#a9afd8"]);
    houseSil(g, 6, 150, 44, 34, dark ? "#1a1f44" : "#5a3a4a", dark ? "#262c58" : "#8a7a9a", f, 1); houseSil(g, 52, 160, 30, 26, dark ? "#1a1f44" : "#4a3a52", dark ? "#262c58" : "#7a6a8a", f, 1);
    houseSil(g, 236, 146, 40, 38, dark ? "#1a1f44" : "#5a3a4a", dark ? "#262c58" : "#8a7a9a", f, 1); houseSil(g, 284, 160, 40, 28, dark ? "#1a1f44" : "#4a3a52", dark ? "#262c58" : "#7a6a8a", f, 1);
    R(g, 0, 184, W, 16, dark ? "#10143a" : "#2a2850"); lampGlow(g, 92, 168, f); lampGlow(g, 218, 170, f); lampGlow(g, 160, 176, f);
  }
  function bgCampo(g, W, H, f) {
    const n = MOOD, dark = n >= 2;
    sky(g, W, H, f);
    ridge(g, W, 108, 44, 2.2, dark ? "#1a2150" : "#4c4a88", true);
    fogBand(g, W, 104, H, f, dark ? ["#3a4476", "#242b58"] : ["#d6d8ee", "#a9afd8"]);
    // il campo, in prospettiva, sospeso sul Latte
    g.fillStyle = "#3f8a4e"; g.beginPath(); g.moveTo(70, 116); g.lineTo(250, 116); g.lineTo(306, 176); g.lineTo(14, 176); g.closePath(); g.fill();
    for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? "#47954f" : "#3a8148"; g.beginPath(); const a = i / 7, b = (i + 1) / 7; g.moveTo(70 - 56 * a + 180 * 0, 116 + 60 * a); g.lineTo(250 + 56 * a, 116 + 60 * a); g.lineTo(250 + 56 * b, 116 + 60 * b); g.lineTo(70 - 56 * b, 116 + 60 * b); g.closePath(); g.fill(); }
    g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1; g.beginPath(); g.moveTo(160, 116); g.lineTo(160, 176); g.stroke(); g.beginPath(); g.ellipse(160, 146, 26, 9, 0, 0, 7); g.stroke();
    R(g, 62, 100, 2, 16, "#e8e8f0"); R(g, 62, 100, 12, 2, "#e8e8f0"); R(g, 246, 100, 2, 16, "#e8e8f0"); R(g, 236, 100, 12, 2, "#e8e8f0");
    R(g, 8, 176, W - 16, 4, "#5a4a3a");
    [[14, 30], [W - 20, 30]].forEach(([x, y]) => { R(g, x, y, 3, 150, "#2a2f48"); R(g, x - 8, y - 6, 19, 8, "#2a2f48"); for (let i = 0; i < 4; i++) R(g, x - 6 + i * 5, y - 4, 4, 4, dark ? "#fff7d0" : "#d8d4c0"); if (dark) { g.save(); g.globalCompositeOperation = "lighter"; glow(g, x + 1, y - 2, 70, "255,240,180", 0.28); g.restore(); } });
  }
  function bgMiniera(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#05070f", "#0c1424", "#101a2c"]);
    R(g, 0, 0, 70, H, "#0a0e18"); R(g, W - 70, 0, 70, H, "#0a0e18");
    // l'imbocco: cornice di travi e assi inchiodate, con la luce che respira dalle fessure
    R(g, 82, 28, 156, 150, "#241a12"); R(g, 82, 28, 156, 8, "#4a3622"); R(g, 82, 28, 10, 150, "#4a3622"); R(g, 228, 28, 10, 150, "#4a3622");
    const br = 0.35 + 0.25 * Math.sin(f / 26);
    R(g, 96, 44, 128, 134, "#04060c");
    glow(g, 160, 120, 90, "90,235,210", br);
    for (let i = 0; i < 6; i++) { R(g, 96, 52 + i * 21, 128, 9, "#5a432a"); R(g, 96, 52 + i * 21, 128, 1, "#7a5c3a"); R(g, 100, 55 + i * 21, 2, 2, "#2a1c10"); R(g, 218, 55 + i * 21, 2, 2, "#2a1c10"); if (i % 2) R(g, 96 + ((i * 37) % 100), 61 + i * 21, 3, 6, `rgba(127,227,208,${0.4 + br})`); }
    [[30, 150, 7], [48, 168, 5], [270, 140, 8], [250, 166, 6], [20, 90, 4]].forEach(([x, y, s], i) => {
      glow(g, x, y, 22, "90,235,210", 0.3 + 0.12 * Math.sin(f / 22 + i)); g.fillStyle = "#3ad1b4"; g.beginPath(); g.moveTo(x - s, y + s); g.lineTo(x - s * 0.3, y - s * 1.8); g.lineTo(x + s * 0.4, y - s * 1.3); g.lineTo(x + s, y + s); g.closePath(); g.fill(); g.fillStyle = "#b9fff0"; g.fillRect(x - 1, y - s, 1, s);
    });
    g.strokeStyle = "#4a5068"; g.lineWidth = 2; g.beginPath(); g.moveTo(140, 178); g.lineTo(60, 200); g.moveTo(180, 178); g.lineTo(260, 200); g.stroke();
    fogBand(g, W, 168, H, f, ["#4a5278", "#2a3050"]);
  }
  function bgInterno(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#4a2f1c", "#6b4326"]);
    for (let i = 0; i < 16; i++) R(g, i * 20, 0, 1, H, "rgba(0,0,0,.18)");
    R(g, 20, 36, 70, 70, "#26180e"); grad(g, 24, 40, 62, 62, ["#cfd3ea", "#a9afd8"]); R(g, 54, 40, 2, 62, "#26180e"); R(g, 24, 70, 62, 2, "#26180e");
    for (let i = 0; i < 4; i++) { const x = ((i * 47 + f * 0.2) % 90) - 10; g.fillStyle = "rgba(255,255,255,.2)"; g.beginPath(); g.ellipse(24 + x % 62, 52 + i * 12, 16, 4, 0, 0, 7); g.fill(); }
    R(g, 120, 52, 180, 4, "#2a1a0e"); R(g, 120, 92, 180, 4, "#2a1a0e");
    for (let i = 0; i < 8; i++) { R(g, 128 + i * 21, 40, 9, 12, ["#e8e0c8", "#c8553d", "#3a6a9c", "#e0a23a"][i % 4]); R(g, 136 + i * 21, 44, 3, 5, "#e8e0c8"); R(g, 128 + i * 21, 80, 14, 12, ["#1b2f7a", "#e9a64a", "#c8422e", "#e8e0c8"][i % 4]); }
    R(g, 0, 150, W, 50, "#3a2415"); R(g, 0, 150, W, 4, "#8a5a34");
    R(g, 159, 0, 2, 30, "#1a1008"); g.fillStyle = "#e0a23a"; g.beginPath(); g.moveTo(148, 40); g.lineTo(172, 40); g.lineTo(164, 28); g.lineTo(156, 28); g.fill();
    glow(g, 160, 44, 90, "255,200,110", 0.45 + 0.05 * Math.sin(f / 18));
  }
  function bgFoto(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#1c140d", "#2e2216"]);
    for (let i = 0; i < 14; i++) R(g, 0, i * 15, W, 1, "rgba(255,230,180,.04)");
    R(g, 34, 16, 252, 160, "#efe6cf"); R(g, 40, 22, 240, 126, "#c9b48a"); grad(g, 40, 22, 240, 126, ["#d6c49c", "#b49c70"]);
    const fx = FOTO || { num: 9, name: "?" };
    for (let i = 0; i < 11; i++) {
      const back = i < 6, x = back ? 64 + i * 38 : 84 + (i - 6) * 40, y = back ? 62 : 98, isMe = i === 3;
      R(g, x - 8, y + 12, 16, 26, back ? "#5a3a22" : "#6a4a2e"); R(g, x - 8, y + 12, 16, 3, "#8a6a46");
      g.fillStyle = isMe ? "#d8c8a0" : "#8a6a46"; g.beginPath(); g.arc(x, y + 4, 8, 0, 7); g.fill();
      if (!isMe) R(g, x - 8, y - 4, 16, 4, "#3a2a1a");
      g.font = "bold 8px sans-serif"; g.textAlign = "center"; g.fillStyle = isMe ? `rgba(127,255,224,${0.7 + 0.3 * Math.sin(f / 14)})` : "#e8d8b0";
      g.fillText(String(isMe ? fx.num : [1, 2, 4, 0, 6, 7, 8, 5, 10, 11, 3][i] || i + 1), x, y + 28);
      if (isMe) { glow(g, x, y + 4, 26, "127,255,224", 0.4 + 0.15 * Math.sin(f / 14)); g.strokeStyle = "rgba(127,255,224,.9)"; g.lineWidth = 1; g.strokeRect(x - 10, y - 8, 20, 46); }
    }
    g.fillStyle = "rgba(60,40,20,.75)"; g.fillRect(48, 148, 224, 22); g.textAlign = "center";
    g.font = "bold 8px sans-serif"; g.fillStyle = "#e8d8b0"; g.fillText("LA SQUADRA DEL 6:43 · FINALE DELLA COPPA", 160, 158, 214);
    g.font = "bold 8px sans-serif"; g.fillStyle = `rgba(127,255,224,${0.75 + 0.25 * Math.sin(f / 12)})`; g.fillText(`N. ${fx.num} · ${String(fx.name).toUpperCase()}`, 160, 167, 214);
    g.textAlign = "left";
  }
  // capitolo 2 · il Latte visto da dentro: nebbia lilla, lanterne ancorate, sagome del pubblico lontano e una porta di nebbia
  function bgLatte(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#1a1f48", "#3a3f78", "#7a78b0"]);
    for (let i = 0; i < 30; i++) R(g, (i * 71) % W, (i * 29) % 90, 1, 1, ((f / 22 + i) % 6) < 0.5 ? "#ffffff" : "#8f98d8");
    // gradinate lontane di nebbia con il pubblico: sagome senza volto
    for (let r = 0; r < 3; r++) for (let i = 0; i < 26; i++) { const x = 6 + i * 12 + (r % 2) * 6, y = 96 + r * 11 + Math.sin(f / 50 + i + r) * 0.8; g.fillStyle = `rgba(30,36,84,${0.32 - r * 0.07})`; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); g.fillRect(x - 3, y + 2, 6, 8); }
    // la porta di nebbia, di sbieco
    R(g, 232, 82, 2, 54, "rgba(230,236,255,.7)"); R(g, 282, 82, 2, 54, "rgba(230,236,255,.7)"); R(g, 232, 82, 52, 2, "rgba(230,236,255,.7)");
    for (let i = 0; i < 6; i++) R(g, 234, 86 + i * 8, 48, 1, "rgba(230,236,255,.25)");
    fogBand(g, W, 100, H, f, ["#8f94c8", "#585e9c"]);
    [[40, 70, 0], [118, 52, 1], [190, 66, 2], [296, 48, 3]].forEach(([x, y, k]) => { const yy = y + Math.sin(f / 40 + k * 1.7) * 3; g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, yy, 34, "127,227,208", 0.55); g.restore(); R(g, x - 1, yy - 14, 2, 8, "#1c2236"); R(g, x - 5, yy - 6, 10, 13, "#1c2236"); R(g, x - 3, yy - 4, 6, 9, "#bff7ea"); R(g, x - 1, yy - 2, 2, 5, "#ffffff"); });
    R(g, 0, 168, W, 32, "#4a508c"); for (let i = 0; i < 10; i++) R(g, i * 34 - ((f / 3) % 34), 172 + (i % 3) * 7, 22, 3, "rgba(230,236,255,.35)");
  }
  // capitolo 2 · gli spogliatoi di sera: armadietti, panca, lampada a ciondolo
  function bgSpogliatoi(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#1e1a24", "#2e2630"]);
    R(g, 0, 150, W, 50, "#3a3040"); R(g, 0, 150, W, 3, "#6a5a70");
    for (let i = 0; i < 12; i++) { const x = 10 + i * 25, open = i === 11; R(g, x, 34, 22, 112, "#46526e"); R(g, x, 34, 22, 3, "#7a88a8"); R(g, x + 2, 40, 18, 100, open ? "#0c0f18" : "#5a6a86"); if (open) { R(g, x + 4, 50, 5, 40, "#c8553d"); R(g, x + 11, 88, 7, 14, "#e0d8b8"); R(g, x + 12, 100, 4, 3, "#e9a64a"); } else { for (let k = 0; k < 4; k++) R(g, x + 6, 48 + k * 4, 10, 1, "#3a4660"); R(g, x + 16, 82, 2, 6, "#d8d2b8"); } R(g, x + 6, 120, 10, 6, "#d8d2b8"); }
    R(g, 40, 160, 240, 8, "#8a5a34"); R(g, 40, 160, 240, 2, "#a8764a"); R(g, 50, 168, 6, 22, "#4a3322"); R(g, 264, 168, 6, 22, "#4a3322");
    R(g, 159, 0, 2, 16, "#1a1008"); R(g, 150, 16, 20, 5, "#e0a23a"); g.save(); g.globalCompositeOperation = "lighter"; glow(g, 160, 24, 110, "255,200,110", 0.4 + 0.04 * Math.sin(f / 18)); g.restore();
    R(g, 0, 0, W, 30, "rgba(0,0,0,.35)");
  }
  // capitolo 3 · le gallerie: tunnel in prospettiva, travi, binari che convergono verso una luce turchese, carrello e cristalli
  function bgGallerie(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#04060c", "#0a1020", "#0e1a2c"]);
    g.fillStyle = "#0c1220"; g.beginPath(); g.moveTo(0, 0); g.lineTo(112, 62); g.lineTo(112, 148); g.lineTo(0, 200); g.fill();
    g.beginPath(); g.moveTo(W, 0); g.lineTo(W - 112, 62); g.lineTo(W - 112, 148); g.lineTo(W, 200); g.fill();
    R(g, 112, 62, W - 224, 86, "#02040a"); glow(g, 160, 108, 74, "90,235,210", 0.34 + 0.1 * Math.sin(f / 24));
    for (let k = 0; k < 3; k++) { const t = k / 3, x0 = 4 + t * 108, y0 = 4 + t * 58, w = 312 - t * 216; R(g, x0, y0, 5 - k, 196 - t * 120, "#4a3622"); R(g, W - x0 - (5 - k), y0, 5 - k, 196 - t * 120, "#4a3622"); R(g, x0, y0, w, 5 - k, "#5a432a"); }
    g.strokeStyle = "#5a6078"; g.lineWidth = 2; g.beginPath(); g.moveTo(112, 200); g.lineTo(148, 148); g.moveTo(208, 200); g.lineTo(172, 148); g.stroke();
    for (let i = 0; i < 6; i++) { const t = i / 6, y = 152 + t * 48, hw = 24 + t * 50; R(g, 160 - hw, y, hw * 2, 2 + t * 2, "#3a2a1c"); }
    [[26, 140, 8], [292, 120, 9], [50, 88, 5], [270, 74, 6], [18, 60, 4]].forEach(([x, y, s], i) => { glow(g, x, y, 24, "90,235,210", 0.3 + 0.12 * Math.sin(f / 20 + i)); g.fillStyle = "#3ad1b4"; g.beginPath(); g.moveTo(x - s, y + s); g.lineTo(x - s * 0.3, y - s * 1.8); g.lineTo(x + s * 0.4, y - s * 1.3); g.lineTo(x + s, y + s); g.closePath(); g.fill(); R(g, x - 1, y - s, 1, s, "#b9fff0"); });
    R(g, 200, 150, 30, 14, "#3d4254"); R(g, 200, 150, 30, 3, "#7a829c"); R(g, 205, 164, 5, 5, "#14161e"); R(g, 220, 164, 5, 5, "#14161e"); g.fillStyle = "#2fb89c"; g.beginPath(); g.moveTo(204, 150); g.lineTo(208, 140); g.lineTo(214, 150); g.fill();
    fogBand(g, W, 160, H, f, ["#2a3a50", "#18202e"]);
  }
  // capitolo 3 · la Galleria Quattro: il muro delle undici maglie, la porta di luce in fondo, binari e nebbia bassa
  function bgQuattro(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#03050b", "#0b1222", "#14213a"]);
    R(g, 0, 150, W, 50, "#0e1424"); R(g, 0, 150, W, 2, "#2a3a56");
    for (let i = 0; i < 11; i++) { const x = 18 + i * 27, mid = i === 5, col = mid ? "#e6ecf0" : i % 2 ? "#e9a64a" : "#1b2f7a"; R(g, x + 8, 38, 2, 8, "#5a432a"); g.fillStyle = col; g.beginPath(); g.moveTo(x, 50); g.lineTo(x + 5, 46); g.lineTo(x + 13, 46); g.lineTo(x + 18, 50); g.lineTo(x + 15, 56); g.lineTo(x + 14, 54); g.lineTo(x + 14, 84); g.lineTo(x + 4, 84); g.lineTo(x + 4, 54); g.lineTo(x + 3, 56); g.closePath(); g.fill(); if (mid) { glow(g, x + 9, 66, 30, "127,255,224", 0.45 + 0.15 * Math.sin(f / 14)); R(g, x + 6, 62, 6, 8, `rgba(127,255,224,${0.6 + 0.3 * Math.sin(f / 12)})`); } else R(g, x + 6, 62, 6, 2, "#ffffff55"); }
    R(g, 0, 36, W, 3, "#4a3622");
    R(g, 262, 92, 3, 58, "#dfe6ea"); R(g, 312, 92, 3, 58, "#dfe6ea"); R(g, 262, 92, 53, 3, "#dfe6ea"); for (let i = 0; i < 7; i++) R(g, 265, 96 + i * 8, 47, 1, "rgba(127,255,224,.35)");
    g.strokeStyle = "#5a6078"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 176); g.lineTo(W, 176); g.moveTo(0, 190); g.lineTo(W, 190); g.stroke(); for (let i = 0; i < 12; i++) R(g, i * 28 + 6, 172, 5, 22, "#3a2a1c");
    glow(g, 160, 104, 120, "90,235,210", 0.14);
    fogBand(g, W, 150, H, f, ["#2a3a58", "#16203a"]);
  }
  function bgMunicipio(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#3a2822", "#5a4034"]);
    R(g, 0, 118, W, 82, "#3a2616"); R(g, 0, 116, W, 3, "#8a5a34"); for (let i = 0; i < 16; i++) { R(g, i * 20 + 3, 124, 14, 70, "#46301c"); R(g, i * 20 + 3, 124, 14, 1, "#6a4a2c"); }
    R(g, 20, 26, 84, 82, "#1a1008"); grad(g, 25, 31, 74, 72, ["#cfd3ea", "#a9afd8"]); R(g, 61, 31, 2, 72, "#1a1008"); R(g, 25, 65, 74, 2, "#1a1008");
    for (let i = 0; i < 4; i++) { const x = ((i * 47 + f * 0.2) % 90) - 10; g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.ellipse(25 + (x % 74), 44 + i * 14, 18, 4, 0, 0, 7); g.fill(); }
    // lo stemma del Comune: scudo blu con montagna e lampada
    g.fillStyle = "#e9a64a"; g.beginPath(); g.moveTo(166, 28); g.lineTo(214, 28); g.lineTo(214, 66); g.lineTo(190, 92); g.lineTo(166, 66); g.closePath(); g.fill();
    g.fillStyle = "#1b2f7a"; g.beginPath(); g.moveTo(170, 32); g.lineTo(210, 32); g.lineTo(210, 64); g.lineTo(190, 86); g.lineTo(170, 64); g.closePath(); g.fill();
    g.fillStyle = "#e8ecf6"; g.beginPath(); g.moveTo(174, 66); g.lineTo(190, 42); g.lineTo(206, 66); g.closePath(); g.fill(); glow(g, 190, 52, 16, "127,227,208", 0.7); R(g, 189, 50, 3, 3, "#bff7ea");
    R(g, 146, 24, 5, 70, "#c8422e"); R(g, 232, 24, 5, 70, "#c8422e"); R(g, 151, 24, 14, 6, "#d9a441"); R(g, 218, 24, 14, 6, "#d9a441");
    for (let i = 0; i < 7; i++) { R(g, 14 + i * 44, 150, 28, 14, "#2a1a10"); R(g, 14 + i * 44, 140, 28, 12, "#3a2616"); R(g, 14 + i * 44, 140, 28, 1, "#6a4a2c"); }
    R(g, 0, 176, W, 24, "#2c1a1e"); R(g, 0, 176, W, 2, "#d9a441");
    glow(g, 160, 8, 120, "255,200,110", 0.42 + 0.05 * Math.sin(f / 18));
  }
  function bgArchivio(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#05070d", "#0e1422", "#131b2c"]);
    [[0, 0], [W - 96, 0]].forEach(([x0]) => { R(g, x0, 14, 96, 176, "#1a130c"); for (let r = 0; r < 5; r++) { R(g, x0, 18 + r * 34, 96, 3, "#3a2816"); for (let i = 0; i < 12; i++) { const h = 14 + (hash(r * 13 + i + x0) % 10); R(g, x0 + 3 + i * 8, 18 + r * 34 + 31 - h, 6, h, ["#c8553d", "#3a6a9c", "#e0a23a", "#e8e0c8", "#5a7a4a", "#7a4a6a"][hash(r * 7 + i * 3 + x0) % 6]); } } });
    g.strokeStyle = "#2a3350"; g.lineWidth = 1; g.beginPath(); g.moveTo(96, 190); g.lineTo(140, 120); g.moveTo(W - 96, 190); g.lineTo(W - 140, 120); g.stroke();
    R(g, 138, 20, 44, 100, "#0a0e1a");
    const br = 0.5 + 0.25 * Math.sin(f / 22);
    g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(90,235,210,${br})`; g.lineWidth = 2; g.beginPath(); g.moveTo(160, 20); g.lineTo(154, 46); g.lineTo(166, 66); g.lineTo(156, 92); g.lineTo(162, 118); g.stroke(); g.restore();
    glow(g, 160, 70, 80, "90,235,210", 0.22 + 0.06 * Math.sin(f / 22));
    R(g, 158, 0, 2, 22, "#1a1008"); g.fillStyle = "#e0a23a"; g.beginPath(); g.moveTo(148, 34); g.lineTo(172, 34); g.lineTo(164, 22); g.lineTo(156, 22); g.fill(); glow(g, 160, 38, 90, "255,200,110", 0.4 + 0.05 * Math.sin(f / 15));
    R(g, 0, 176, W, 24, "#10151f"); R(g, 0, 176, W, 1, "#2a3350");
  }
  // capitolo 5 · Cima Alta di giorno: sopra il Latte, chalet giallo fluo con tetti verdi, bandiere dei Camosci e la funivia che arriva
  function chaletSil(g, x, y, w, h, f, k) {
    const dark = MOOD >= 1;
    R(g, x, y, w, h, dark ? "#a7bd2a" : "#d6f23a"); R(g, x, y + h - 4, w, 4, "#00000030");
    g.fillStyle = dark ? "#1d2a24" : "#2b4a34"; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + w / 2, y - h * 0.5); g.lineTo(x + w + 3, y); g.fill();
    g.fillStyle = "#eef4ff"; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + w / 2, y - h * 0.5); g.lineTo(x + w / 2, y - h * 0.5 + 3); g.lineTo(x - 1, y + 1); g.fill();
    for (let i = 0; i < Math.max(1, Math.floor(w / 13)); i++) R(g, x + 4 + i * 12, y + 6, 6, 7, dark && (hash(k + i) % 3) ? "#ffcf6b" : "#3a4a7a");
  }
  function bgCima(g, W, H, f) {
    const n = MOOD, dark = n >= 1;
    if (dark) sky(g, W, H, f);
    else { grad(g, 0, 0, W, H, ["#5aa6ea", "#9fd0f6", "#e3f3ff"]); glow(g, 250, 34, 50, "255,244,200", 0.55); g.fillStyle = "#fff7d8"; g.beginPath(); g.arc(250, 34, 10, 0, 7); g.fill(); }
    ridge(g, W, 104, 46, 0.6, dark ? "#4c4a88" : "#8fa6d0", true);
    ridge(g, W, 124, 34, 3.3, dark ? "#34376f" : "#6d86b8", true);
    // il cavo della funivia, che sale da sinistra, e la cabina rossa
    g.strokeStyle = "#1c2236"; g.lineWidth = 1; g.beginPath(); g.moveTo(-4, 126); g.lineTo(96, 60); g.stroke();
    const t = ((f * 0.0019) % 1.5) - 0.25, cx = -4 + t * 100, cy = 126 - t * 66;
    if (t > 0 && t < 1) { R(g, cx, cy, 1, 5, "#1c2236"); R(g, cx - 8, cy + 4, 16, 10, "#c8422e"); R(g, cx - 8, cy + 4, 16, 2, "#e8704e"); R(g, cx - 6, cy + 7, 5, 4, "#ffd98a"); R(g, cx + 1, cy + 7, 5, 4, "#ffd98a"); }
    fogBand(g, W, 128, H, f, dark ? ["#b9aedc", "#8c85c0"] : ["#f2f6ff", "#cfd9f2"]);
    chaletSil(g, 8, 150, 52, 34, f, 1); chaletSil(g, 66, 160, 34, 26, f, 2); chaletSil(g, 224, 146, 46, 40, f, 3); chaletSil(g, 276, 158, 42, 28, f, 4);
    // bandiere dei Camosci sui pali
    [[116, 150], [196, 150], [150, 164]].forEach(([x, y], i) => { R(g, x, y - 36, 2, 40, "#2a2f48"); const w = Math.sin(f / 18 + i * 2) * 2; g.fillStyle = "#e4ff3a"; g.beginPath(); g.moveTo(x + 2, y - 36); g.lineTo(x + 22, y - 33 + w); g.lineTo(x + 20, y - 21 + w); g.lineTo(x + 2, y - 22); g.fill(); R(g, x + 9, y - 31, 3, 6, "#1a1a1a"); R(g, x + 8, y - 33, 1, 3, "#1a1a1a"); R(g, x + 12, y - 33, 1, 3, "#1a1a1a"); });
    R(g, 0, 186, W, 14, dark ? "#d4d8ee" : "#f4f7ff"); R(g, 0, 186, W, 1, "#b8c2e6");
  }
  // capitolo 5 · l'Osteria del Camoscio: assi, camino, mensola con tre Coppe e un piedistallo vuoto, foto appese, un fischietto giallo
  function bgOsteria(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#3a2616", "#5a3a22"]);
    for (let i = 0; i < 16; i++) R(g, i * 20, 0, 1, H, "rgba(0,0,0,.2)");
    R(g, 0, 152, W, 48, "#2e1c10"); R(g, 0, 152, W, 4, "#8a5a34");
    // camino
    R(g, 14, 70, 70, 84, "#6a5a52"); R(g, 22, 90, 54, 64, "#14100c"); R(g, 12, 66, 74, 6, "#8a7a70");
    g.save(); g.globalCompositeOperation = "lighter"; glow(g, 49, 130, 60, "255,160,70", 0.4 + 0.08 * Math.sin(f / 9)); g.restore();
    for (let i = 0; i < 4; i++) { const h = 10 + ((f / 4 + i * 9) % 14); g.fillStyle = i % 2 ? "#ff9a2e" : "#ffd23f"; g.beginPath(); g.moveTo(34 + i * 10, 154); g.lineTo(39 + i * 10, 154 - h); g.lineTo(44 + i * 10, 154); g.fill(); }
    // mensola con le tre Coppe e il piedistallo vuoto
    R(g, 112, 52, 190, 5, "#2a1a0e"); R(g, 112, 52, 190, 1, "#8a5a34");
    for (let i = 0; i < 4; i++) { const x = 130 + i * 44; if (i < 3) { g.fillStyle = "#e0b441"; g.beginPath(); g.moveTo(x - 9, 28); g.lineTo(x + 9, 28); g.lineTo(x + 5, 42); g.lineTo(x - 5, 42); g.fill(); R(g, x - 2, 42, 4, 6, "#c89a2a"); R(g, x - 8, 48, 16, 4, "#8a6a2a"); R(g, x - 6, 30, 2, 8, "#fff1b8"); } else { R(g, x - 8, 48, 16, 4, "#5a4a3a"); g.strokeStyle = "rgba(255,230,160,.5)"; g.setLineDash([2, 2]); g.strokeRect(x - 8, 26, 16, 22); g.setLineDash([]); } }
    // foto appese, una con la figura tagliata via
    [[118, 70, 30, 22], [160, 68, 34, 26], [206, 72, 28, 20], [250, 70, 32, 24]].forEach(([x, y, w, h], i) => { R(g, x, y, w, h, "#2a1a0e"); R(g, x + 2, y + 2, w - 4, h - 4, "#cdb78e"); for (let k = 0; k < 4; k++) { R(g, x + 5 + k * 6, y + h - 10, 4, 6, i === 1 && k === 2 ? "#cdb78e" : "#6a4a2e"); R(g, x + 6 + k * 6, y + h - 14, 3, 3, i === 1 && k === 2 ? "#cdb78e" : "#7a5a3e"); } });
    // il fischietto giallo di plastica appeso a un chiodo
    R(g, 272, 100, 2, 2, "#1a1008"); g.strokeStyle = "#e4c43a"; g.lineWidth = 1; g.beginPath(); g.moveTo(273, 102); g.lineTo(273, 112); g.stroke(); R(g, 268, 112, 10, 5, "#ffd23f"); R(g, 276, 113, 4, 3, "#e0a82a"); R(g, 270, 114, 2, 2, "#8a6a10");
    // banco con boccali e specchiera
    R(g, 100, 120, 214, 34, "#6a4426"); R(g, 100, 120, 214, 4, "#a8764a"); R(g, 100, 154, 214, 6, "#4a3322");
    for (let i = 0; i < 6; i++) { R(g, 112 + i * 30, 106, 9, 14, "#e8e0c8"); R(g, 119 + i * 30, 109, 3, 7, "#e8e0c8"); R(g, 113 + i * 30, 106, 7, 3, "#fff6e0"); }
    glow(g, 160, 8, 110, "255,200,110", 0.4 + 0.04 * Math.sin(f / 18)); R(g, 159, 0, 2, 14, "#1a1008"); g.fillStyle = "#e0a23a"; g.beginPath(); g.moveTo(148, 24); g.lineTo(172, 24); g.lineTo(164, 12); g.lineTo(156, 12); g.fill();
  }
  // capitolo 5 · il Campo Alto: tribune giallo fluo, tabellone, cartelloni dello sponsor, nebbia tutt'intorno
  function bgCampoAlto(g, W, H, f) {
    const dark = MOOD >= 1;
    if (dark) sky(g, W, H, f); else { grad(g, 0, 0, W, H, ["#5aa6ea", "#9fd0f6", "#e3f3ff"]); glow(g, 262, 30, 40, "255,244,200", 0.5); }
    ridge(g, W, 96, 40, 1.8, dark ? "#4c4a88" : "#8fa6d0", true);
    fogBand(g, W, 100, H, f, dark ? ["#b9aedc", "#8c85c0"] : ["#f2f6ff", "#cfd9f2"]);
    // tribune
    [[0, 1], [W - 78, -1]].forEach(([x0, dir]) => { for (let r = 0; r < 5; r++) { const y = 70 + r * 14; R(g, x0, y, 78, 12, r % 2 ? "#d6f23a" : "#b8d42a"); R(g, x0, y, 78, 1, "#ffffff55"); for (let i = 0; i < 9; i++) if ((hash(r * 9 + i + x0) % 4) !== 0) { g.fillStyle = ["#2a2f48", "#c8422e", "#1a1a1a", "#e8e8f0"][hash(i + r) % 4]; g.beginPath(); g.arc(x0 + 6 + i * 8.5, y + 4, 2.4, 0, 7); g.fill(); } } });
    // tabellone
    R(g, 118, 22, 84, 30, "#10141f"); R(g, 118, 22, 84, 2, "#d6f23a"); g.textAlign = "center"; g.font = "bold 14px sans-serif"; g.fillStyle = "#ff9a2e"; g.fillText("0 - 0", 160, 44); g.font = "bold 6px sans-serif"; g.fillStyle = "#d6f23a"; g.fillText("CAMOSCI · OSPITI", 160, 32); g.textAlign = "left";
    R(g, 156, 52, 8, 22, "#2a2f48");
    // il prato in prospettiva e i cartelloni
    g.fillStyle = "#3f8a4e"; g.beginPath(); g.moveTo(84, 116); g.lineTo(236, 116); g.lineTo(300, 180); g.lineTo(20, 180); g.closePath(); g.fill();
    for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? "#47954f" : "#3a8148"; const a = i / 7, b = (i + 1) / 7; g.beginPath(); g.moveTo(84 - 64 * a, 116 + 64 * a); g.lineTo(236 + 64 * a, 116 + 64 * a); g.lineTo(236 + 64 * b, 116 + 64 * b); g.lineTo(84 - 64 * b, 116 + 64 * b); g.closePath(); g.fill(); }
    g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1; g.beginPath(); g.moveTo(160, 116); g.lineTo(160, 180); g.stroke(); g.beginPath(); g.ellipse(160, 148, 28, 10, 0, 0, 7); g.stroke();
    R(g, 78, 106, 2, 10, "#e8e8f0"); R(g, 78, 106, 10, 2, "#e8e8f0"); R(g, 232, 106, 2, 10, "#e8e8f0"); R(g, 224, 106, 10, 2, "#e8e8f0");
    for (let i = 0; i < 5; i++) { R(g, 16 + i * 60, 180, 56, 14, i % 2 ? "#1a1a1a" : "#2b4a34"); R(g, 16 + i * 60, 180, 56, 1, "#d6f23a"); g.font = "bold 7px sans-serif"; g.fillStyle = "#e4ff3a"; g.textAlign = "center"; g.fillText("LUMEN", 44 + i * 60, 190, 50); g.textAlign = "left"; }
    if (dark) { g.save(); g.globalCompositeOperation = "lighter"; [[20, 36], [W - 20, 36]].forEach(([x, y]) => glow(g, x, y, 70, "255,240,180", 0.3)); g.restore(); }
  }
  // capitolo 5 · la baita del Fischio: legno scuro, stufa, una parete di fischietti, il cannocchiale alla finestra sul Campo Alto
  function bgBaita(g, W, H, f) {
    grad(g, 0, 0, W, H, ["#1c120a", "#38241a"]);
    for (let i = 0; i < 16; i++) R(g, i * 20, 0, 1, H, "rgba(0,0,0,.25)");
    R(g, 0, 156, W, 44, "#241408"); R(g, 0, 156, W, 3, "#6a4426");
    // la parete dei fischietti
    R(g, 14, 20, 150, 108, "#2a190d"); R(g, 14, 20, 150, 2, "#5a3a22");
    for (let r = 0; r < 4; r++) for (let i = 0; i < 8; i++) { const x = 22 + i * 18, y = 30 + r * 24, k = r * 8 + i; R(g, x + 3, y - 5, 1, 5, "#1a1008"); if (k >= 26) continue; g.fillStyle = ["#c9ccd6", "#b08a3c", "#9aa0b0", "#d8b44a"][k % 4]; g.beginPath(); g.ellipse(x + 3, y + 5, 6, 4, 0, 0, 7); g.fill(); R(g, x + 6, y + 3, 7, 3, g.fillStyle); R(g, x + 1, y + 3, 2, 2, "#00000066"); }
    // finestra sul crinale e luci lontane del Campo Alto
    R(g, 190, 36, 84, 66, "#0d0905"); grad(g, 194, 40, 76, 58, dark2() ? ["#1a2150", "#3a3f78"] : ["#7fb4ee", "#dff0ff"]); R(g, 230, 40, 2, 58, "#0d0905"); R(g, 194, 68, 76, 2, "#0d0905");
    g.fillStyle = "#4c4a88"; g.beginPath(); g.moveTo(194, 98); g.lineTo(214, 84); g.lineTo(232, 92); g.lineTo(250, 78); g.lineTo(270, 90); g.lineTo(270, 98); g.fill();
    R(g, 245, 82, 10, 3, "#d6f23a"); glow(g, 250, 83, 14, "230,255,90", 0.4);
    // cannocchiale su treppiede
    R(g, 206, 100, 2, 36, "#1a1008"); R(g, 220, 100, 2, 36, "#1a1008"); R(g, 213, 100, 2, 36, "#1a1008"); g.fillStyle = "#6a5a3a"; g.beginPath(); g.moveTo(198, 92); g.lineTo(232, 80); g.lineTo(234, 86); g.lineTo(200, 98); g.fill(); R(g, 228, 79, 6, 8, "#2a2418");
    // stufa
    R(g, 56, 134, 52, 22, "#2e2c34"); R(g, 56, 134, 52, 3, "#4a4852"); R(g, 64, 140, 22, 12, "#0e0a08");
    g.save(); g.globalCompositeOperation = "lighter"; glow(g, 75, 146, 40, "255,150,60", 0.4 + 0.08 * Math.sin(f / 8)); g.restore();
    // occhiali da sole appesi a un chiodo (il paio gemello)
    R(g, 292, 56, 2, 2, "#0a0604"); R(g, 286, 60, 12, 5, "#0a0a0a"); R(g, 298, 60, 12, 5, "#0a0a0a"); R(g, 297, 61, 2, 1, "#0a0a0a");
    glow(g, 160, 6, 100, "255,190,100", 0.25);
  }
  const dark2 = () => MOOD >= 1;

  let FOTO = null;
  const BGS = { vl_paese: bgPaese, vl_campo: bgCampo, vl_miniera: bgMiniera, vl_interno: bgInterno, vl_foto: bgFoto, vl_latte: bgLatte, vl_spogliatoi: bgSpogliatoi, vl_gallerie: bgGallerie, vl_quattro: bgQuattro, vl_municipio: bgMunicipio, vl_archivio: bgArchivio, vl_cima: bgCima, vl_cimaalta: bgCima, vl_osteria: bgOsteria, vl_campoalto: bgCampoAlto, vl_baita: bgBaita };
  const prevBg = window.renderDetailedBg;
  window.renderDetailedBg = function (kind, g, W, H, frame) {
    if (BGS[kind]) { safe(() => BGS[kind](g, W || 320, H || 200, frame || 0)); return true; }
    return typeof prevBg === "function" ? prevBg.apply(this, arguments) : false;
  };

  // ------------------------------------------------------------------ set di tessere di Vallombra (16x16, pixel-art)
  // pavimenti:  ,=lastricato di montagna  p=piazza con intarsi di lumina  :=sentiero di ghiaia  "=prato alpino  ==assi di legno
  //             y=erba del campo  ;=pista in terra rossa  _=roccia della miniera  -=binari
  // oggetti:    a=parete di roccia  f=il Latte (nebbia)  r=parapetto  e=tetto  h=facciata  t=larice  l=lampione di lumina  k=cabina
  //             n=bacheca  F=fontana  u m v q w=porte  > < ^=cancelli  x=tavolo/casse  b=panchina  o=palco  z=banco della geologa
  //             j=gradinata  X=assi dell'imbocco  Y=travi dell'imbocco  C=cristalli di lumina
  //             capitolo 2:  g=nebbia calpestabile  i=piastrelle dello spogliatoio  (oggetti) G=nebbia fitta  A=ancora (lanterna)  U=pallone  E=pietra d'eco
  //                          W=parete di legno  K=armadietto  Z=porta interna  d=cancello verso il basso
  //             capitolo 3:  Q=cristallo di fase  D=porta di lumina  R=carrello  M=maglia appesa  N=maglia vuota  H=elmetto del minatore  P=parete incisa
  //             capitolo 4:  c=tappeto del Municipio  (oggetti) S=scaffale di faldoni  T=scrivania/tavolo  B=cassetti del Registro  O=tassello (pennino, timbro, sigillo, stemma)  J=vetrina  L=scala dell'archivio
  const FLOORS = ',p:"=y;_-gicsI';
  const SOLID = "afrehtlknFumvqwx><^bozjXYCGAUEWKZdQDRMNHPSTBOJLV#%";
  const isFloor = (c) => !!c && FLOORS.includes(c);
  const ZX = { map: null, under: null, meta: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
  const metaAt = (tx, ty) => (ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx]) || null;
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  const ANC = { "13,3": 1, "25,15": 2, "5,22": 3 }; // ancore (lanterne) del Latte: posizione -> numero
  let GP = null; // contesto 2d di game.js
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 1);
    if (f === "s") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#eef3fc" : "#e6edfa"); if (r < 0.5) P(sx + 3 + ((r * 90) | 0) % 9, sy + 4 + ((r * 50) | 0) % 8, 2, 1, "#c4d0ec"); if (r > 0.8) P(sx + 9, sy + 11, 1, 1, "#c4d0ec"); return; }
    if (f === "I") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#bfe0f4" : "#cdeaf8"); P(sx, sy, 16, 1, "#e6f6ff"); if (r < 0.4) { P(sx + 3, sy + 5, 7, 1, "#ffffff"); P(sx + 5, sy + 6, 3, 1, "#c4e4f6"); } return; }
    if (f === ",") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#6b7388" : "#727a8f"); P(sx, sy + 7, 16, 1, "#565d70"); P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#565d70"); P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8, "#565d70"); if (r < 0.12) P(sx + 6, sy + 10, 3, 2, "#8a93a6"); }
    else if (f === "p" && ZX.id === "vl_latte") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#b4bbe0" : "#bcc3e6"); P(sx, sy, 16, 1, "#dde1f6"); P(sx, sy + 15, 16, 1, "#8d94bf"); P(sx + 15, sy, 1, 16, "#8d94bf"); if ((tx * 3 + ty * 5) % 5 === 0) { P(sx + 6, sy + 6, 4, 4, "#6f86a8"); P(sx + 7, sy + 7, 2, 2, "#7fe3d0"); } }
    else if (f === "p") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8d95aa" : "#949cb0"); P(sx, sy, 16, 1, "#a7aec1"); P(sx, sy + 15, 16, 1, "#6f778c"); P(sx + 15, sy, 1, 16, "#6f778c"); if ((tx * 3 + ty * 5) % 7 === 0) { P(sx + 6, sy + 6, 4, 4, "#3a6a74"); P(sx + 7, sy + 7, 2, 2, "#7fe3d0"); } }
    else if (f === ":") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8a7a64" : "#847460"); for (let i = 0; i < 4; i++) P(sx + ((hash(tx * 9 + ty * 3 + i) % 13)), sy + ((hash(tx + ty * 7 + i * 5) % 13)), 2, 1, "#6f6150"); }
    else if (f === '"') { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#5c8a4c" : "#639453"); if (r < 0.5) { P(sx + 3 + ((r * 90) | 0) % 8, sy + 6, 1, 5, "#3f6a35"); P(sx + 8 + ((r * 50) | 0) % 5, sy + 4, 1, 6, "#4a7a3d"); } if (r > 0.86) { P(sx + 5, sy + 9, 2, 2, "#fff6e0"); P(sx + 5, sy + 8, 2, 1, "#ffd23f"); } else if (r < 0.08) { P(sx + 10, sy + 5, 2, 2, "#7a9cff"); } }
    else if (f === "=") { P(sx, sy, 16, 16, "#8a5a34"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "#6a4224"); P(sx + ((tx * 5 + ty) % 2 ? 4 : 11), sy, 1, 16, "#7a4e2c"); }
    else if (f === "y") { P(sx, sy, 16, 16, tx % 2 ? "#4f9a55" : "#58a35d"); if (r < 0.14) P(sx + 4, sy + 5, 1, 3, "#3f8247"); }
    else if (f === ";") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#a8573f" : "#a05039"); if (r < 0.2) P(sx + 5, sy + 8, 3, 1, "#8a4632"); }
    else if (f === "_") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#2d3142" : "#313648"); if (r < 0.3) P(sx + 3 + ((r * 100) | 0) % 9, sy + 4 + ((r * 77) | 0) % 8, 2, 1, "#454b60"); }
    else if (f === "g") { const n = MOOD >= 2; P(sx, sy, 16, 16, n ? "#3c4678" : "#cdd1ea"); P(sx + 1, sy + 1, 14, 14, n ? "#46508a" : "#dde1f4"); if (r < 0.3) P(sx + 4 + ((r * 77) | 0) % 7, sy + 5 + ((r * 41) | 0) % 6, 2, 1, n ? "#8d9be0" : "#7fe3d0"); const w = (frNow() / 3 + tx * 11 + ty * 7) % 30; P(sx + w - 8, sy + 3 + (tx + ty) % 9, 8, 1, n ? "#59649e" : "#f4f6ff"); }
    else if (f === "c") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#6a2a34" : "#732f3a"); P(sx, sy, 16, 1, "#8a4450"); if (at(tx - 1, ty) !== "c") P(sx, sy, 2, 16, "#d9a441"); if (at(tx + 1, ty) !== "c") P(sx + 14, sy, 2, 16, "#d9a441"); if (r < 0.2) P(sx + 6, sy + 7, 3, 2, "#82414c"); }
    else if (f === "i") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8c93a6" : "#9aa1b3"); P(sx, sy, 16, 1, "#b4bacb"); P(sx, sy + 15, 16, 1, "#6a7084"); P(sx + 15, sy, 1, 16, "#6a7084"); if (r < 0.12) P(sx + 5, sy + 6, 3, 2, "#7a8196"); }
    else if (f === "-") { floorPaint("_", sx, sy, tx, ty); const v = (at(tx, ty - 1) === "-" || at(tx, ty + 1) === "-") && at(tx - 1, ty) !== "-" && at(tx + 1, ty) !== "-"; if (v) { P(sx + 3, sy, 2, 16, "#6a6f80"); P(sx + 11, sy, 2, 16, "#6a6f80"); for (let i = 0; i < 4; i++) P(sx + 1, sy + i * 4 + 1, 14, 2, "#4a3626"); } else { P(sx, sy + 3, 16, 2, "#6a6f80"); P(sx, sy + 11, 16, 2, "#6a6f80"); for (let i = 0; i < 4; i++) P(sx + i * 4 + 1, sy + 1, 2, 14, "#4a3626"); } }
  }
  const lit = (tx, ty) => MOOD >= 1 && hash(tx * 31 + ty * 17) % 5 !== 0;
  function wallStrata(sx, sy, tx, ty, base, hi, lo) {
    P(sx, sy, 16, 16, base); P(sx, sy + 4, 16, 1, lo); P(sx, sy + 10, 16, 1, lo); P(sx + ((hash(tx * 3 + ty) % 9) + 2), sy, 1, 4, lo); P(sx + ((hash(tx + ty * 5) % 9) + 3), sy + 5, 1, 5, lo);
    if (at(tx, ty - 1) !== "a") P(sx, sy, 16, 2, hi);
    if (rnd(tx, ty, 2) < 0.2) { P(sx + 3, sy + 12, 5, 2, "#4f6a45"); P(sx + 4, sy + 11, 3, 1, "#5f7f52"); }
  }
  function houseTile(ch, sx, sy, tx, ty) {
    const m = metaAt(tx, ty) || { r: "#7a3a2e", w: "#c4a77d" };
    if (ch === "e") {
      const top = at(tx, ty - 1) !== "e", bot = at(tx, ty + 1) !== "e";
      P(sx, sy, 16, 16, m.r); for (let i = 0; i < 4; i++) { P(sx, sy + i * 4 + 3, 16, 1, "#00000030"); P(sx + ((i + tx) % 2 ? 0 : 8), sy + i * 4, 1, 3, "#00000028"); }
      if (top) { P(sx, sy, 16, 3, "#ffffff2a"); P(sx, sy + 3, 16, 1, "#00000040"); }
      if (bot) { P(sx, sy + 13, 16, 3, "#00000050"); }
      if (m.snow && top) { P(sx, sy, 16, 4, "#eef2fb"); P(sx, sy + 4, 16, 1, "#c4cde6"); }
      if (m.chim && tx === m.chim[0] && ty === m.chim[1]) { P(sx + 5, sy + 1, 6, 9, "#5a4a42"); P(sx + 4, sy, 8, 2, "#3a2e2a"); }
      return;
    }
    // facciata
    P(sx, sy, 16, 16, m.w); P(sx, sy + 12, 16, 4, "#00000022"); P(sx, sy, 16, 1, "#00000030");
    if (at(tx, ty - 1) === "h") { /* secondo piano: nessuna cornice */ } else P(sx, sy + 1, 16, 1, "#ffffff22");
    if (m.wood) { for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 2, 16, 1, "#00000026"); }
    const below = at(tx, ty + 1) === "h";
    if (tx % 2 === (m.ox || 0) && below) {
      const on = lit(tx, ty);
      P(sx + 3, sy + 3, 10, 8, "#3a2e2a"); P(sx + 4, sy + 4, 8, 6, on ? "#ffcf6b" : "#6a7ca4"); if (on) { P(sx + 4, sy + 4, 8, 2, "#fff1b8"); } P(sx + 7, sy + 4, 2, 6, "#3a2e2a"); P(sx + 2, sy + 11, 12, 2, "#6a4a30");
      if (m.shut) { P(sx + 1, sy + 3, 2, 8, m.shut); P(sx + 13, sy + 3, 2, 8, m.shut); }
    }
  }
  function doorTile(ch, sx, sy, tx, ty) {
    houseTile("h", sx, sy, tx, ty);
    P(sx + 2, sy + 2, 12, 14, "#2a1c12"); P(sx + 3, sy + 3, 10, 13, ch === "m" ? "#6a4a2c" : ch === "w" ? "#4a5a7a" : "#8a5a34");
    P(sx + 3, sy + 3, 10, 2, "#ffffff22"); if (ch === "m") { P(sx + 8, sy + 3, 1, 13, "#2a1c12"); P(sx + 4, sy + 9, 3, 1, "#2a1c12"); P(sx + 9, sy + 9, 3, 1, "#2a1c12"); } else P(sx + 10, sy + 9, 2, 2, "#ffd23f");
    if (ch === "u") { for (let i = 0; i < 6; i++) P(sx + 1 + i * 2, sy - 1, 2, 4, i % 2 ? "#f2e8d8" : "#b3487a"); }
    if (ch === "q") { P(sx + 6, sy - 3, 1, 6, "#cfd3e6"); P(sx + 3, sy - 3, 7, 1, "#cfd3e6"); }
    if (ch === "v") { P(sx + 3, sy - 1, 10, 4, "#1d3a5a"); }
  }
  function gateTile(ch, sx, sy, tx, ty) {
    floorPaint(ch === "^" || ch === "d" ? ":" : ",", sx, sy, tx, ty);
    P(sx + 1, sy + 1, 3, 15, "#5a3a22"); P(sx + 12, sy + 1, 3, 15, "#5a3a22"); P(sx, sy, 16, 3, "#6a4426"); P(sx + 1, sy, 14, 1, "#8a6238");
    g2(GP, ch, sx, sy);
  }
  function g2(g, ch, sx, sy) { // freccia sul cancello
    g.fillStyle = "#ffd23f"; g.beginPath();
    if (ch === ">") { g.moveTo(sx + 6, sy + 6); g.lineTo(sx + 11, sy + 9); g.lineTo(sx + 6, sy + 12); }
    else if (ch === "<") { g.moveTo(sx + 10, sy + 6); g.lineTo(sx + 5, sy + 9); g.lineTo(sx + 10, sy + 12); }
    else if (ch === "d") { g.moveTo(sx + 5, sy + 6); g.lineTo(sx + 8, sy + 12); g.lineTo(sx + 11, sy + 6); }
    else { g.moveTo(sx + 5, sy + 11); g.lineTo(sx + 8, sy + 5); g.lineTo(sx + 11, sy + 11); }
    g.fill();
  }
  const PAINT = {
    a(sx, sy, tx, ty) { wallStrata(sx, sy, tx, ty, "#3d4254", "#5b6178", "#2c303e"); },
    f(sx, sy, tx, ty, fr) {
      const night = MOOD >= 2; P(sx, sy, 16, 16, night ? "#2e3866" : "#cfd3ea");
      for (let i = 0; i < 3; i++) { const w = (fr / 2.2 + tx * 9 + ty * 5 + i * 21) % 36; P(sx + w - 10, sy + 2 + i * 5, 11 + i * 2, 2, night ? "#4a5686" : "#e9ecf8"); }
      if (at(tx, ty - 1) !== "f") { P(sx, sy, 16, 3, night ? "#3a4678" : "#dfe2f2"); }
    },
    r(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy + 8, 16, 2, "#5a4a3a"); P(sx, sy + 8, 16, 1, "#8a6a46"); P(sx + 1, sy + 4, 2, 11, "#4a3a2c"); P(sx + 12, sy + 4, 2, 11, "#4a3a2c"); P(sx, sy + 13, 16, 2, "#00000028"); },
    e: (sx, sy, tx, ty) => houseTile("e", sx, sy, tx, ty), h: (sx, sy, tx, ty) => houseTile("h", sx, sy, tx, ty),
    t(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 6, sy + 10, 4, 6, "#5a3a22"); const c = rnd(tx, ty, 3) < 0.5 ? ["#c98a2a", "#e0a23a", "#f2c25a"] : ["#a8782a", "#c98a2a", "#e0a23a"]; GP.fillStyle = c[0]; GP.beginPath(); GP.moveTo(sx + 8, sy - 6); GP.lineTo(sx + 14, sy + 11); GP.lineTo(sx + 2, sy + 11); GP.fill(); GP.fillStyle = c[1]; GP.beginPath(); GP.moveTo(sx + 8, sy - 2); GP.lineTo(sx + 13, sy + 8); GP.lineTo(sx + 3, sy + 8); GP.fill(); P(sx + 6, sy + 1, 2, 2, c[2]); P(sx + 9, sy + 6, 2, 2, c[2]); },
    l(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 7, sy + 4, 2, 12, "#2e3446"); P(sx + 5, sy + 1, 6, 5, "#1c2236"); P(sx + 6, sy + 2, 4, 3, MOOD >= 1 ? "#bff7ea" : "#7fe3d0"); if ((fr >> 5) % 9 === 0) P(sx + 7, sy + 3, 2, 1, "#ffffff"); },
    k(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const L = at(tx - 1, ty) !== "k", Rr = at(tx + 1, ty) !== "k"; P(sx + (L ? 1 : 0), sy + 2, 16 - (L ? 1 : 0) - (Rr ? 1 : 0), 13, "#c8422e"); P(sx, sy + 2, 16, 2, "#e8704e"); P(sx, sy + 13, 16, 2, "#8a2a1e"); P(sx + 3, sy + 6, 10, 5, "#ffd98a"); P(sx + 3, sy + 6, 10, 1, "#fff1b8"); if (tx % 2) P(sx + 7, sy + 6, 2, 5, "#8a2a1e"); if (L) P(sx + 2, sy, 1, 3, "#2a2f44"); if (Rr) P(sx + 13, sy, 1, 3, "#2a2f44"); },
    n(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 2, sy + 2, 12, 9, "#6a4a2c"); P(sx + 3, sy + 3, 10, 7, "#f2e8d0"); P(sx + 4, sy + 4, 8, 1, "#6a5a4a"); P(sx + 4, sy + 6, 6, 1, "#6a5a4a"); P(sx + 4, sy + 8, 7, 1, "#6a5a4a"); P(sx + 7, sy + 11, 2, 5, "#4a3322"); },
    F(sx, sy, tx, ty, fr) { floorPaint("p", sx, sy, tx, ty); const L = at(tx - 1, ty) !== "F", Rr = at(tx + 1, ty) !== "F", Tt = at(tx, ty - 1) !== "F", Bb = at(tx, ty + 1) !== "F"; P(sx + (L ? 2 : 0), sy + (Tt ? 2 : 0), 16 - (L ? 2 : 0) - (Rr ? 2 : 0), 16 - (Tt ? 2 : 0) - (Bb ? 2 : 0), "#9aa2b8"); P(sx + (L ? 4 : 0), sy + (Tt ? 4 : 0), 16 - (L ? 4 : 0) - (Rr ? 4 : 0), 16 - (Tt ? 4 : 0) - (Bb ? 4 : 0), "#2f7f86"); const w = (fr / 8 + tx * 3 + ty) % 10; P(sx + 3 + w, sy + 6, 3, 1, "#9ff3e0"); if ((fr >> 4) % 5 === (tx + ty) % 5) P(sx + 8, sy + 8, 2, 2, "#d8fff6"); },
    u: (sx, sy, tx, ty) => doorTile("u", sx, sy, tx, ty), m: (sx, sy, tx, ty) => doorTile("m", sx, sy, tx, ty), v: (sx, sy, tx, ty) => doorTile("v", sx, sy, tx, ty), q: (sx, sy, tx, ty) => doorTile("q", sx, sy, tx, ty), w: (sx, sy, tx, ty) => doorTile("w", sx, sy, tx, ty),
    ">": (sx, sy, tx, ty) => gateTile(">", sx, sy, tx, ty), "<": (sx, sy, tx, ty) => gateTile("<", sx, sy, tx, ty), "^": (sx, sy, tx, ty) => gateTile("^", sx, sy, tx, ty),
    x(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const bar = ZX.id === "vl_paese"; if (bar) { P(sx + 1, sy + 4, 14, 8, "#7a4f2a"); P(sx + 1, sy + 4, 14, 2, "#a8764a"); P(sx + 2, sy + 12, 2, 4, "#4a3322"); P(sx + 12, sy + 12, 2, 4, "#4a3322"); P(sx + 4, sy + 1, 4, 5, "#f2e8d8"); P(sx + 5, sy + 2, 2, 2, "#7a3a2a"); P(sx + 10, sy + 2, 3, 4, "#e8d8b8"); } else { P(sx + 2, sy + 5, 12, 10, "#8a6238"); P(sx + 2, sy + 5, 12, 2, "#b08850"); P(sx + 7, sy + 5, 2, 10, "#5a4024"); } },
    b(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 1, sy + 7, 14, 3, "#8a5a34"); P(sx + 1, sy + 4, 14, 2, "#a8764a"); P(sx + 2, sy + 10, 2, 5, "#4a3322"); P(sx + 12, sy + 10, 2, 5, "#4a3322"); },
    o(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 1, sy + 5, 14, 11, "#6a4426"); P(sx + 1, sy + 5, 14, 2, "#a8764a"); P(sx + 3, sy + 8, 10, 6, "#1b2f7a"); P(sx + 6, sy + 9, 4, 4, "#e9a64a"); if (tx % 2 === 0) { P(sx + 11, sy + 0, 1, 6, "#2a2f44"); P(sx + 10, sy - 1, 3, 2, "#cfd3e6"); } },
    z(sx, sy, tx, ty, fr) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 1, sy + 6, 14, 9, "#5a6a4a"); P(sx + 1, sy + 6, 14, 2, "#7a8a62"); if (tx % 2 === 0) { P(sx + 3, sy + 2, 3, 5, "#3ad1b4"); P(sx + 4, sy + 3, 1, 3, "#b9fff0"); P(sx + 9, sy + 3, 4, 3, "#cfd3e6"); P(sx + 10, sy + 1, 2, 2, "#2a2f44"); } else { P(sx + 3, sy + 3, 8, 4, "#e8e0c8"); P(sx + 4, sy + 4, 6, 1, "#6a5a4a"); P(sx + 4, sy + 5, 4, 1, "#6a5a4a"); if ((fr >> 5) % 2) P(sx + 11, sy + 3, 2, 2, "#7fe3d0"); } },
    j(sx, sy, tx, ty) { floorPaint(undAt(tx, ty), sx, sy, tx, ty); const c = (tx >> 2) % 2 ? "#1b2f7a" : "#e9a64a"; P(sx, sy + 3, 16, 3, "#8a5a34"); P(sx, sy + 7, 16, 5, c); P(sx, sy + 7, 16, 1, "#ffffff33"); P(sx, sy + 12, 16, 3, "#6a4224"); P(sx + 2, sy + 15, 2, 1, "#00000044"); },
    X(sx, sy, tx, ty, fr) { floorPaint("_", sx, sy, tx, ty); P(sx, sy, 16, 16, "#05080f"); const br = 0.4 + 0.3 * Math.sin(fr / 26); GP.save(); GP.globalCompositeOperation = "lighter"; GP.fillStyle = `rgba(80,230,205,${br * 0.5})`; GP.fillRect(sx, sy, 16, 16); GP.restore(); for (let i = 0; i < 3; i++) { P(sx, sy + 1 + i * 5, 16, 3, "#5a432a"); P(sx, sy + 1 + i * 5, 16, 1, "#7a5c3a"); P(sx + 3 + i * 4, sy + 1 + i * 5, 2, 2, "#2a1c10"); } },
    Y(sx, sy, tx, ty) { floorPaint("_", sx, sy, tx, ty); P(sx, sy, 16, 16, "#4a3622"); P(sx, sy, 16, 2, "#6a4c30"); P(sx + 3, sy, 1, 16, "#3a2a1a"); P(sx + 11, sy, 1, 16, "#3a2a1a"); if (ty <= 2) P(sx, sy + 12, 16, 4, "#2a1c10"); },
    C(sx, sy, tx, ty, fr) { floorPaint("_", sx, sy, tx, ty); GP.save(); GP.globalCompositeOperation = "lighter"; const a = 0.25 + 0.12 * Math.sin(fr / 22 + tx); GP.fillStyle = `rgba(80,230,205,${a})`; GP.beginPath(); GP.arc(sx + 8, sy + 9, 13, 0, 7); GP.fill(); GP.restore(); GP.fillStyle = "#2fb89c"; GP.beginPath(); GP.moveTo(sx + 2, sy + 15); GP.lineTo(sx + 5, sy + 3); GP.lineTo(sx + 8, sy + 15); GP.fill(); GP.fillStyle = "#3ad1b4"; GP.beginPath(); GP.moveTo(sx + 7, sy + 15); GP.lineTo(sx + 11, sy + 0); GP.lineTo(sx + 14, sy + 15); GP.fill(); P(sx + 10, sy + 3, 1, 8, "#b9fff0"); P(sx + 4, sy + 6, 1, 5, "#b9fff0"); },
    d: (sx, sy, tx, ty) => gateTile("d", sx, sy, tx, ty),
    G(sx, sy, tx, ty, fr) {
      const n = MOOD >= 2; P(sx, sy, 16, 16, n ? "#262f5c" : "#9ea4cc");
      for (let i = 0; i < 3; i++) { const w = (fr / 2.6 + tx * 13 + ty * 7 + i * 19) % 40; P(sx + w - 14, sy + 2 + i * 5, 16 + i * 3, 3, n ? "#3a4580" : "#b9bfe0"); }
      P(sx, sy + ((fr >> 3) + tx * 3) % 16, 16, 1, n ? "#3a4580" : "#c6cbe8");
      const edge = n ? "#46508a" : "#d4d8ee";
      if (at(tx - 1, ty) === "g" || at(tx - 1, ty) === "p") P(sx, sy, 2, 16, edge); if (at(tx + 1, ty) === "g" || at(tx + 1, ty) === "p") P(sx + 14, sy, 2, 16, edge);
      if (at(tx, ty - 1) === "g" || at(tx, ty - 1) === "p") P(sx, sy, 16, 2, edge); if (at(tx, ty + 1) === "g" || at(tx, ty + 1) === "p") P(sx, sy + 14, 16, 2, edge);
    },
    A(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const lit = !!ANC[tx + "," + ty] && F.is("anc" + ANC[tx + "," + ty]);
      P(sx + 7, sy + 5, 2, 11, "#2e3446"); P(sx + 4, sy + 13, 8, 3, "#3a4256"); P(sx + 6, sy, 4, 1, "#6a7390");
      P(sx + 4, sy + 1, 8, 9, "#1c2236"); P(sx + 5, sy + 2, 6, 7, lit ? "#bff7ea" : (fr >> 4) % 7 === 0 ? "#5a7a8a" : "#3a4660");
      if (lit) P(sx + 7, sy + 3, 2, 4, "#ffffff");
    },
    U(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const g = GP, cx = sx + 8, cy = sy + 9;
      g.fillStyle = "#f4f2ea"; g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill(); g.strokeStyle = "#2a2f44"; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.stroke();
      P(cx - 1, cy - 1, 3, 3, "#2a2f44"); P(cx - 4, cy - 2, 2, 2, "#2a2f44"); P(cx + 2, cy - 3, 2, 2, "#2a2f44"); P(cx - 2, cy + 3, 2, 2, "#2a2f44"); P(cx + 3, cy + 1, 2, 2, "#2a2f44");
      if ((fr >> 4) % 6 === 0) P(cx - 3, cy - 5, 2, 1, "#ffffff");
    },
    E(sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx + 3, sy + 4, 10, 12, "#59607a"); P(sx + 4, sy + 3, 8, 2, "#6c748f"); P(sx + 3, sy + 14, 10, 2, "#00000033");
      const a = 0.5 + 0.5 * Math.sin(fr / 18 + tx); P(sx + 7, sy + 6, 2, 6, `rgba(127,227,208,${0.5 + a * 0.5})`); P(sx + 5, sy + 8, 6, 2, `rgba(127,227,208,${0.4 + a * 0.4})`);
    },
    W(sx, sy, tx, ty) {
      P(sx, sy, 16, 16, "#4a3322"); for (let i = 0; i < 4; i++) P(sx + i * 4, sy, 1, 16, "#3a2616"); P(sx, sy, 16, 1, "#6a4a30");
      if (at(tx, ty + 1) !== "W") { P(sx, sy + 12, 16, 4, "#2a1a0e"); P(sx, sy + 12, 16, 1, "#7a5a3a"); }
    },
    K(sx, sy, tx, ty) {
      floorPaint("i", sx, sy, tx, ty); const n = tx - 1, open = n === 12 && F.is("s2_locker"); P(sx + 1, sy - 2, 14, 18, "#46526e"); P(sx + 1, sy - 2, 14, 1, "#7a88a8"); P(sx + 2, sy - 1, 12, 16, open ? "#10141f" : "#5a6a86");
      if (open) { P(sx + 3, sy + 2, 3, 7, "#c8553d"); P(sx + 7, sy + 5, 5, 8, "#e0d8b8"); P(sx + 9, sy + 11, 3, 2, "#e9a64a"); } else { for (let i = 0; i < 3; i++) P(sx + 4, sy + i * 2, 8, 1, "#3a4660"); P(sx + 11, sy + 8, 2, 3, "#d8d2b8"); }
      P(sx + 5, sy + 12, 6, 2, "#d8d2b8");
    },
    Z(sx, sy, tx, ty) {
      PAINT.W(sx, sy, tx, ty); P(sx + 2, sy - 6, 12, 22, "#2a1c12"); P(sx + 3, sy - 5, 10, 21, "#6a4a2c"); P(sx + 10, sy + 6, 2, 2, "#ffd23f"); P(sx + 3, sy - 5, 10, 2, "#ffffff22");
    },
  };
  function drawTile(ch, sx, sy, tx, ty) {
    GP = GP || document.getElementById("cv").getContext("2d");
    if (isFloor(ch)) { floorPaint(ch, sx, sy, tx, ty); return true; }
    const f = PAINT[ch]; if (!f) return false;
    if ((ch === "e" || ch === "h") || "umvqw".includes(ch)) { /* disegnano da sole */ }
    f(sx, sy, tx, ty, frNow());
    return true;
  }
  const onScr = (x, y) => x > -90 && x < 420 && y > -70 && y < 270;

  // sagome delle zone: pavimenti con memoria («under») per gli oggetti, e case con colori propri
  function makeLayers(w, h) {
    const m = ZX.map, u = Array.from({ length: h }, () => Array(w).fill(",")), meta = Array.from({ length: h }, () => Array(w).fill(null));
    ZX.under = u; ZX.meta = meta;
    const lay = (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (m[y] && x >= 0 && x < w) { m[y][x] = ch; if (isFloor(ch)) u[y][x] = ch; } };
    const put = (x, y, ch) => { if (m[y] && x >= 0 && x < w) { m[y][x] = ch; if (isFloor(ch)) u[y][x] = ch; } };
    // casa: x,y,w,h con tetto su h-2 righe e facciata su 2; o = {roof, wall, door:[x,y,ch], chim, snow, ox, wood, shut}
    const house = (x, y, ww, hh, o) => {
      o = o || {};
      for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) { const roof = j < hh - 2; put(x + i, y + j, roof ? "e" : "h"); meta[y + j][x + i] = { r: o.roof || "#7a3a2e", w: o.wall || "#c4a77d", chim: o.chim ? [x + o.chim, y] : null, snow: !!o.snow, ox: o.ox || 0, wood: !!o.wood, shut: o.shut || null }; }
      if (o.door) put(o.door[0], o.door[1], o.door[2]);
    };
    return { lay, put, house };
  }

  // ------------------------------------------------------------------ motore a capitoli
  const CHAPTERS = {}, ZONES = {}, LANDEF = {}, LAN_TOTAL = 12;
  const COS = {
    vl_stambecchi: { kind: "shirt", label: "Maglia degli Stambecchi", val: "#1b2f7a", from: "Gioca la partita di presentazione a Vallombra" },
    vl_sessantatre: { kind: "shirt", label: "Maglia del 6:43", val: "#e9a64a", from: "Concludi il capitolo 1 di Vallombra" },
    vl_argento: { kind: "hairc", label: "Capelli Argento nebbia", val: "#c9d3e6", from: "Raccogli tutte le schegge di lumina a Vallombra Alta" },
    vl_ambra: { kind: "hairc", label: "Capelli Ambra del Campo", val: "#e0a23a", from: "Raccogli tutte le schegge di lumina al Campo Sospeso" },
    vl_lumina: { kind: "hairc", label: "Capelli Lumina", val: "#5fe0c8", from: "Raccogli tutte le schegge di lumina all'Imbocco" },
  };
  const zoneRec = () => ZONES[api.trZone()] || null;
  const bgNow = () => (zoneRec() && zoneRec().spec.bg) || "vl_paese";
  const activeChapter = () => { const m = mem(); let best = null; Object.keys(CHAPTERS).map(Number).sort((a, b) => a - b).forEach((n) => { if (n <= m.ch) best = CHAPTERS[n]; }); return best || CHAPTERS[1] || null; };
  const chapterOfZone = (zid) => (ZONES[zid] ? CHAPTERS[ZONES[zid].ch] : null);
  function refreshMood() { const c = activeChapter(); MOOD = c && c.mood ? c.mood(stepOf(c.n)) : 0; const zr = safe(zoneRec, null); if (zr && zr.spec.moodMin) MOOD = Math.max(MOOD, zr.spec.moodMin); }
  // capitoli «attivi» (sbloccati) dal più recente al più vecchio: i capitoli nuovi possono ritoccare le zone dei precedenti (patch)
  const chainFor = (zr) => Object.keys(CHAPTERS).map(Number).filter((n) => n <= mem().ch && n >= zr.ch).sort((a, b) => b - a).map((n) => CHAPTERS[n]);
  const patchesOf = (zid) => ((ZONES[zid] && ZONES[zid].patches) || []).filter((p) => p.ch <= mem().ch);
  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch]; refreshMood(); castHero();
    let list = zr.spec.npcs ? zr.spec.npcs(stepOf(c.n)) : [], hints = Object.assign({}, typeof zr.spec.hints === "function" ? zr.spec.hints(stepOf(c.n)) : zr.spec.hints || {});
    patchesOf(api.trZone()).forEach((p) => { if (p.npcs) list = p.npcs(list, stepOf(p.ch)); if (p.hints) Object.assign(hints, p.hints(stepOf(p.ch))); });
    zr.Z.npcs = list.filter((n) => CAST_OK(n.id));
    // l'obiettivo, con le direzioni, va in testa al testo del luogo (altrimenti sulla pagina piccola resta tagliato sotto la descrizione)
    const gl = goalNow();
    [...new Set([...(zr.spec.areas || []).map((a) => a[4]), zr.spec.short])].forEach((k) => { if (k) hints[k] = (gl ? "Obiettivo: " + gl + " · " : "") + (hints[k] || ""); });
    zr.Z.hints = hints;
  }
  const CAST_OK = (id) => !!(api.CAST && api.CAST[id]);

  // dialoghi e scelte (nel mondo camminabile)
  function say(lines, then) { const bg = bgNow(); api.trSay(lines.map((l) => api.L(l[0], T(l[1]), l[2] || bg)), then); }
  function ask(who, prompt, opts, bg) {
    api.trAsk(who, esc(T(prompt)).replace(/\n/g, "<br>"), opts.map((o) => ({ label: T(o.label), sub: o.sub ? T(o.sub) : undefined, cls: o.cls || "", disabled: !!o.disabled, fn: o.fn })), bg || bgNow());
  }
  const done = () => { refreshZone(); api.trResume(); };
  function reward(key, o) {
    const msg = [];
    once(key, () => {
      if (o.coins) { const n = coinsGive(o.coins); if (n) msg.push(`+${n} monete`); }
      (o.cos ? [].concat(o.cos) : []).forEach((id) => { const c = api.COSM && api.COSM[id] && safe(() => api.bCos(id), false) ? api.COSM[id].label : null; if (c) msg.push(`Nuovo in guardaroba: ${c}`); });
    });
    return msg;
  }
  function lanAdd(id) { const m = mem(); if (!m.lan.includes(id)) { m.lan.push(id); save(); const d = LANDEF[id]; if (d) api.trToast(`Lanterna accesa: ${d.name}`); return true; } return false; }

  // viaggi tra le zone
  function go(zid, tx, ty) { const tr = api.trRec(); tr.pos[zid] = [tx * TS + 8, ty * TS + 12]; enterZone(zid); }
  function enterZone(zid) {
    const zr = ZONES[zid]; if (!zr) return;
    const m = mem(); m.zone = zid; save();
    refreshMood(); castHero();
    api.trRec().seen[zid] = true; // la presentazione la facciamo noi, con gli sfondi di Vallombra
    api.trGo(zid);
    refreshZone();
    if (!m.intro[zid]) { m.intro[zid] = 1; save(); if (zr.spec.intro && zr.spec.intro.length) return say(zr.spec.intro, done); }
    api.trToast(zr.spec.short);
  }
  function registerZone(chN, zid, spec) {
    const Z = {
      name: spec.name, short: spec.short, sub: spec.sub || "", need: 0, w: spec.w, h: spec.h, start: spec.start, theme: spec.theme || "torino", bus: "funivia", busLabel: "Esci da Vallombra",
      item: spec.item || ["Scheggia di lumina", "Schegge"], itemCos: spec.itemCos, items: spec.items || [], bld: [], npcs: [], areas: spec.areas || [], hints: {}, pitch: [-20, -20, 1, 1],
      solid: SOLID, act: Object.assign({}, spec.act || {}), intro: [],
      me: () => { const c = api.CAST.hero || api.CAST.leo; return Object.assign({}, c, { shirt: kitCol() || c.shirt || "#ff4d5a" }); },
      drawItem(x, y, i) { const g = GP || document.getElementById("cv").getContext("2d"); g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 11, "90,235,210", 0.5 + 0.2 * Math.sin(frNow() / 12 + i)); g.restore(); g.fillStyle = "#3ad1b4"; g.beginPath(); g.moveTo(x - 3, y + 4); g.lineTo(x - 1, y - 6); g.lineTo(x + 3, y - 3); g.lineTo(x + 4, y + 4); g.closePath(); g.fill(); g.fillStyle = "#c8fff4"; g.fillRect(x - 1, y - 4, 1, 6); },
    };
    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => "Menu in basso: Taccuino ed Esci." });
    Z.build = function (m) {
      ZX.map = m; ZX.id = zid; GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h); Ls.lay(0, 0, spec.w - 1, spec.h - 1, ",");
      spec.build(Ls); patchesOf(zid).forEach((p) => { if (p.build) p.build(Ls); }); refreshZoneSoon();
    };
    Z.tile = function (ch, sx, sy, tx, ty) { GP = GP || document.getElementById("cv").getContext("2d"); return drawTile(ch, sx, sy, tx, ty); };
    const dd = (cx, cy) => ({ X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() });
    Z.decor = function (cx, cy) { if (spec.decor) spec.decor(cx, cy, dd(cx, cy)); patchesOf(zid).forEach((p) => { if (p.decor) p.decor(cx, cy, dd(cx, cy)); }); };
    Z.top = function (cx, cy) { if (spec.top) spec.top(cx, cy, dd(cx, cy)); patchesOf(zid).forEach((p) => { if (p.top) p.top(cx, cy, dd(cx, cy)); }); };
    Z.onObj = function (ch, tx, ty) {
      const zr = ZONES[zid]; let f = null;
      chainFor(zr).some((c) => { const o = c.obj; if (!o) return false; f = o[zid + ":" + ch + ":" + tx + "," + ty] || o[zid + ":" + ch] || (c.n === chN ? o[ch] : null); return !!f; });
      if (!f) return false; f({ ch, tx, ty, zid }); return true;
    };
    Z.menu = () => zoneMenu();
    TRZ_SET(zid, Z);
    ZONES[zid] = { ch: chN, spec, Z };
  }
  const TRZ_SET = (zid, Z) => { api.TRZ[zid] = Z; };
  let soon = 0;
  function refreshZoneSoon() { clearTimeout(soon); soon = setTimeout(() => safe(refreshZone), 0); }

  // ------------------------------------------------------------------ menu in gioco, taccuino, lanterne
  const goalNow = () => { const c = activeChapter(); return c && c.goal ? T(c.goal(stepOf(c.n))) : ""; };
  function leave() {
    const back = EXIT || window.title;
    EXIT = null;
    api.trExitTo(typeof back === "function" ? back : null);
  }
  function zoneMenu() {
    const c = activeChapter(), h = hero();
    api.trAsk("voce", `<b>Vallombra</b> · ${esc(c ? "Capitolo " + c.n + " · " + c.title : "")}<br><span style="color:var(--dim)">${esc(goalNow())}<br>Monete ${bal()} · Lanterne ${mem().lan.length}/${LAN_TOTAL}${h ? " · " + esc(h.name) : ""}</span>`, [
      { label: "Taccuino di " + (h ? h.name : "viaggio"), sub: "Indizi, lanterne e scheda", cls: "hot", fn: () => notebook(zoneMenu, true) },
      { label: "Esci da Vallombra", sub: "La storia e la posizione restano salvate", cls: "hot", fn: leave },
    ], bgNow());
  }
  function sceneOrAsk(inZone, html, opts, title) {
    if (inZone) return api.trAsk("voce", html, opts.filter((o) => !/^◂ Torna a esplorare/.test(o.label)), bgNow());
    return api.scene(bgNow(), "voce", html, opts, title);
  }
  function notebook(back, inZone) {
    const m = mem(), h = hero() || { name: "Campione", num: 9, shotName: "", shot: "saetta" };
    const clues = m.log.slice(-9).map((x) => `• ${esc(T(x))}`).join("<br>") || "<span style='color:var(--dim)'>Ancora nessuna annotazione.</span>";
    const lanN = m.lan.length;
    const html = `<b>${esc(h.name)}</b> · n. ${esc(h.num)}<br><span style="color:var(--dim)">«${esc(h.shotName || "")}» · ${esc(SHOT[h.shot] || "un tiro tutto tuo")}</span><br><br><b>Appunti</b><br>${clues}<br><br><span style="color:var(--dim)">Lanterne accese ${lanN}/${LAN_TOTAL} · Vittorie ${m.wins} · Sconfitte ${m.losses}</span>`;
    sceneOrAsk(inZone, html, [
      { label: "Le Lanterne", sub: "Chi ti ha dato una mano", fn: () => lanterne(() => notebook(back, inZone), inZone) },
      { label: "◂ Indietro", fn: back },
    ], "Vallombra · Taccuino");
  }
  function lanterne(back, inZone) {
    const m = mem(), rows = [];
    Object.keys(LANDEF).forEach((id) => { const d = LANDEF[id], on = m.lan.includes(id); rows.push(`${on ? "✓" : "•"} <b>${esc(d.name)}</b> <span style="color:var(--dim)">${esc(on ? d.role : d.met && F.is(d.met) ? "Conosciuto · non ancora con te" : "???")}</span>`); });
    for (let i = rows.length; i < LAN_TOTAL; i++) rows.push(`<span style="color:var(--dim)">• ???</span>`);
    sceneOrAsk(inZone, `<b>Le Lanterne di Vallombra</b> · ${m.lan.length}/${LAN_TOTAL}<br>${rows.join("<br>")}`, [{ label: "◂ Indietro", fn: back }], "Vallombra · Lanterne");
  }

  // ------------------------------------------------------------------ schermate fuori dal mondo camminabile
  function leaveToModes() { const back = EXIT || window.title; EXIT = null; api.trExitTo(typeof back === "function" ? back : null); }
  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    reload(); refreshMood();
    const h = hero();
    if (!h) {
      return api.scene("vl_paese", "voce", "<b>Vallombra</b> · Il paese sopra la nebbia<br>Questa storia è fatta per il tuo Campione: nome, aspetto e tiro entrano in scena. Prima serve crearlo.", [
        { label: "Crea il tuo campione", sub: "Nome, numero e tiro speciale", cls: "hot", fn: () => { if (typeof window.heroEditor === "function") window.heroEditor(openMain); } },
        { label: "◂ Modalità", fn: leaveToModes },
      ], "Vallombra");
    }
    castHero();
    const c = activeChapter(), m = mem(), allDone = c && m.done[c.n];
    const nextN = c ? c.n + 1 : 2, nextOk = !!CHAPTERS[nextN];
    api.scene("vl_paese", "voce", `<b>Vallombra</b> · Il paese sopra la nebbia<br>${esc(h.name)}, n. ${esc(h.num)} · «${esc(h.shotName || "")}»<br><span style="color:var(--dim)">${c ? esc("Capitolo " + c.n + " · " + c.title) : ""}<br>${allDone ? (nextOk ? "Il prossimo capitolo ti aspetta." : "Capitolo concluso · il prossimo è in arrivo.") : esc(goalNow())}</span>`, [
      { label: allDone && !nextOk ? "Torna a Vallombra" : c && !m.intro["ch" + c.n] ? (c.n > 1 ? `Inizia il capitolo ${c.n}` : "Comincia") : "Continua", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
      { label: "Taccuino di " + h.name, sub: `Appunti e Lanterne ${m.lan.length}/${LAN_TOTAL}`, fn: () => notebook(openMain, false) },
      { label: "Capitoli", sub: "Le puntate della storia", fn: chapters },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Vallombra");
  }
  function chapters() {
    const m = mem(), rows = [];
    for (let n = 1; n <= 8; n++) { const c = CHAPTERS[n]; rows.push(c && (n === 1 || m.done[n - 1] || m.ch >= n) ? `${m.done[n] ? "✓" : "▸"} <b>Capitolo ${n}</b> · ${esc(c.title)} <span style="color:var(--dim)">${esc(m.done[n] ? "concluso" : c.sub || "")}</span>` : `<span style="color:var(--dim)">• Capitolo ${n} · ???</span>`); }
    api.scene("vl_campo", "voce", `<b>Le puntate di Vallombra</b><br>${rows.join("<br>")}<br><span style="color:var(--dim)">Le scelte restano salvate: cambiano battute, alleanze e finali.</span>`, [
      { label: "Ricomincia la storia", sub: "Cancella solo questo salvataggio", fn: resetAsk },
      { label: "◂ Indietro", fn: openMain },
    ], "Vallombra · Capitoli");
  }
  function resetAsk() {
    api.scene("vl_paese", "voce", "<b>Ricominciare da capo?</b><br>Si cancellano scelte, appunti e progressi della storia di Vallombra. Monete e cosmetici già ricevuti restano tuoi.", [
      { label: "Sì, ricomincia", cls: "hot", fn: () => { MEM = norm({}); save(); openMain(); } },
      { label: "◂ No, torna indietro", fn: chapters },
    ], "Vallombra");
  }
  function continueStory() {
    const c = activeChapter(), m = mem(); if (!c) return;
    castHero(); refreshMood(); m.visit++; save();
    const start = m.zone && ZONES[m.zone] ? m.zone : c.start;
    if (!m.intro["ch" + c.n]) {
      m.intro["ch" + c.n] = 1; save();
      return api.play(c.intro().map(([w, t, bg]) => api.L(w, T(t), bg || "vl_paese")), () => enterZone(c.start));
    }
    enterZone(start);
  }

  // ------------------------------------------------------------------ cassetta degli attrezzi per i capitoli
  let inMatch = false;
  const VENUE_VAL = { ads: [["STAMBECCHI DI VALLOMBRA", "#14532d"], ["LATTE DELL'ALTA VALLE", "#e2e8f0"], ["MINIERA DI LUMINA", "#92400e"], ["FORMAGGI DEL PASSO", "#a16207"]], crowd: ["#14532d", "#78350f", "#e8e0d0", "#475569", "#f0c9a0"], ground: ["#4f7a52", "#5a8a5c"], patches: "rgba(240,246,252,.55)", tint: "rgba(180,200,230,.1)", glow: "235,245,255", fx: { spd: 0.97 } };
  function playMatch(o) {
    castHero(); inMatch = true;
    api.matchPick({ alt: o.alt, oppNames: o.oppNames, squad: o.squad, azPitch: o.azPitch, cageMut: o.cageMut, cageTarget: o.cageTarget, homeKit: o.homeKit, cageField: o.cageField, force: o.force, weather: o.weather, id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate, mateGeneric: true, us: o.us || "Stambecchi", min: o.min || 45, team: o.team, venue: o.venue || VENUE_VAL, hero: undefined,
      onDone: (r) => { inMatch = false; const m = mem(); if (r.win) m.wins++; else if (r.a < r.b) m.losses++; save(); refreshZone(); o.done(r); } });
  }
  function finishChapter(n, ending) { const m = mem(); m.done[n] = String(ending || "ok").slice(0, 24); if (m.ch <= n) m.ch = n + 1; save(); }
  const XTOOLS = {
    get api() { return api; }, TS, T, esc, hash, rnd, safe, F, mem, save, stepOf, setStep, note, once, reward, coinsGive, bal, hero, castHero, say, ask, done, go, enterZone, playMatch, finishChapter, lanAdd, notebook, zoneMenu, leave,
    P: (x, y, w, h, c) => P(x, y, w, h, c), R, glow, grad, floorPaint, drawTile, makeLayers, PAINT, FLOORS, SOLID, onScr, frNow, refreshZone, bgNow,
    setFoto: (o) => { FOTO = o; }, getMood: () => MOOD, setMood: (n) => { MOOD = n; },
    lanDef: (id, d) => { LANDEF[id] = d; },
    cast: (id, c, bio) => { if (api.CAST && !api.CAST[id]) api.CAST[id] = Object.assign({ tag: "", eye: "#2a2a2a", skin: "#e0b48a" }, c); if (bio && api.BIO && !api.BIO[id]) api.BIO[id] = bio; },
    cos: (id, d) => { COS[id] = d; if (api && api.COSM && !api.COSM[id]) api.COSM[id] = d; },
    ctx: (g) => { GP = g; }, zone: registerZone,
    // gestori e notizie del capitolo precedente per lo stesso personaggio (un capitolo nuovo può ridefinire un personaggio solo in certe zone e passare la mano altrove)
    talkOf: (id, below) => { const c = prevCh(id, below); return c ? c.talk[id] : null; },
    newsOf: (id, below) => { const c = prevCh(id, below); return c && c.news ? !!c.news(id, stepOf(c.n)) : false; },
    get timing() { return api && api.timing; },
    setTiles: (x0, y0, x1, y1, ch) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ZX.map && ZX.map[y] && x >= 0 && x < ZX.map[y].length) { ZX.map[y][x] = ch; if (isFloor(ch) && ZX.under && ZX.under[y]) ZX.under[y][x] = ch; } },
    // ritocca una zona di un capitolo precedente: { npcs(list, step), hints(step), build(L), decor, top, act:{} } (attivo quando il capitolo è sbloccato)
    patch: (zid, chN, p) => { const zr = ZONES[zid]; if (!zr) return; p.ch = chN; (zr.patches || (zr.patches = [])).push(p); if (p.act) Object.assign(zr.Z.act, p.act); },
  };
  const prevCh = (id, below) => Object.keys(CHAPTERS).map(Number).filter((n) => n < below).sort((a, b) => b - a).map((n) => CHAPTERS[n]).find((c) => c.talk && c.talk[id]) || null;
  function addChapter(fn) {
    if (!api) { PENDING.push(fn); return; }
    const def = typeof fn === "function" ? fn(XTOOLS) : fn;
    if (!def || !def.n || CHAPTERS[def.n]) return;
    CHAPTERS[def.n] = def;
    Object.keys(def.zones || {}).forEach((zid) => registerZone(def.n, zid, def.zones[zid]));
  }
  const PENDING = [];

  // ------------------------------------------------------------------ avvio e ganci
  function start() {
    Object.keys(COS).forEach((id) => { if (api.COSM && !api.COSM[id]) api.COSM[id] = COS[id]; });
    const desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    const chained = !(desc && desc.set); // con accessor (cage-borgo.js) la catena la fa il setter
    const prev = chained ? window.trTalkHook : null;
    const mineC = (id) => { const zr = zoneRec(); if (!zr || !zr.Z.npcs.some((n) => n.id === id)) return null; return chainFor(zr).find((c) => c.talk && c.talk[id]) || null; };
    const mine = (id) => { const c = mineC(id); return c ? c.talk[id] : null; };
    window.trTalkHook = function (id) {
      const f = mine(id);
      if (f) { castHero(); f(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
    const prevNews = window.trNewsHook;
    window.trNewsHook = function (id) {
      const zr = zoneRec();
      const c = zr && mineC(id);
      if (c) return c.news ? !!c.news(id, stepOf(c.n)) : false;
      return typeof prevNews === "function" ? prevNews(id) : null;
    };
    PENDING.splice(0).forEach(addChapter);
    chip();
  }

  // pulsante «Esci» sempre visibile mentre si cammina a Vallombra
  function chip() {
    if (document.getElementById("scExit")) return;
    const st = document.createElement("style");
    st.textContent = "#scExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:10px;border:1px solid #ffffff55;background:#1b2f7acc;color:#fff;font:700 13px/1.1 system-ui,sans-serif;letter-spacing:.2px;box-shadow:0 2px 8px #0008}#scExit.on{display:block}body.svMM #stats{margin-bottom:54px}#scExit:active{transform:translateY(1px)}";
    document.head.appendChild(st);
    const b = document.createElement("button"); b.id = "scExit"; b.type = "button"; b.textContent = "✕ Esci"; b.setAttribute("aria-label", "Esci da Vallombra");
    b.onclick = () => {
      if (inMatch) { const h = document.getElementById("homeBtn"); if (h) h.click(); return; } // in partita: la conferma di uscita è quella della Home
      if (zoneRec()) leave();
    };
    document.body.appendChild(b);
    // se in partita si conferma l'uscita («Torna alla Home»), dopo la Home si ripristina lo stato dei moduli a piedi (stesso salvataggio di prima)
    const oc = document.getElementById("ovlCh");
    if (oc) oc.addEventListener("click", (e) => { if (inMatch && e.target && e.target.closest && e.target.closest("button.danger")) { inMatch = false; setTimeout(() => safe(() => api.trExitTo(function () {})), 0); } });
    setInterval(() => {
      const hud = document.getElementById("matchHud"), live = !!(hud && !hud.hidden);
      const on = !!((zoneRec() && document.body.classList.contains("borgo")) || (inMatch && live));
      b.classList.toggle("on", on); document.body.classList.toggle("svMM", !!(inMatch && live)); b.textContent = inMatch && live ? "✕ Esci dalla partita" : "✕ Esci";
    }, 400);
  }

  function init() {
    const a = window.__borgoApi;
    if (!a || !a.TRZ || !a.trGo || !a.play || !a.scene || !a.match) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a; start();
  }

  window.__storiaCampione = {
    version: 1,
    addChapter,
    open: openMain,
    menuEntry(back) {
      const h = hero(), c = activeChapter(), m = mem();
      return { label: "⛰️ Vallombra · La Storia del Campione", cls: "hot", fn: () => openMain({ onExit: back }),
        sub: h ? `${h.name} · ${c ? "Capitolo " + c.n + (m.done[c.n] ? " concluso" : " in corso") : "avventura e mistero"}` : "Crea prima il tuo campione · avventura e mistero a puntate" };
    },
    info() { const m = mem(); return { ch: m.ch, step: Object.assign({}, m.step), done: Object.assign({}, m.done), lan: m.lan.length, flags: Object.keys(m.flags).length }; },
  };

  // ------------------------------------------------------------------ luci comuni (lampioni, finestre accese, lumina) e nebbia in primo piano
  function tileLights(g, cx, cy) {
    if (MOOD < 1) return;
    g.save(); g.globalCompositeOperation = "lighter";
    const t0x = Math.floor(cx / TS), t0y = Math.floor(cy / TS);
    for (let ty = t0y; ty <= t0y + 13; ty++) for (let tx = t0x; tx <= t0x + 21; tx++) {
      const ch = at(tx, ty), x = tx * TS - cx + 8, y = ty * TS - cy + 8;
      if (ch === "l") glow(g, x, y - 4, MOOD >= 2 ? 30 : 20, "127,227,208", MOOD >= 2 ? 0.5 : 0.28);
      else if (ch === "h" && tx % 2 === ((metaAt(tx, ty) || {}).ox || 0) && at(tx, ty + 1) === "h" && lit(tx, ty)) glow(g, x, y - 1, MOOD >= 2 ? 22 : 14, "255,200,110", MOOD >= 2 ? 0.34 : 0.2);
      else if (ch === "C") glow(g, x, y, 26, "90,235,210", 0.3);
      else if (ch === "u" || ch === "q") glow(g, x, y + 2, 18, "255,190,110", 0.3);
      else if (ch === "A") { const lit = !!ANC[tx + "," + ty] && F.is("anc" + ANC[tx + "," + ty]); glow(g, x, y - 4, lit ? (MOOD >= 2 ? 40 : 32) : 12, "127,227,208", lit ? 0.6 : 0.15); }
      else if (ch === "U") glow(g, x, y, 22, "200,255,245", 0.4);
      else if (ch === "E") glow(g, x, y, 15, "127,227,208", 0.22);
      else if (ch === "K" && F.is("s2_locker") && tx === 13) glow(g, x, y, 22, "255,210,120", 0.3);
    }
    g.restore();
  }
  function moodTint(g) {
    const W = 320, H = 200;
    g.fillStyle = MOOD >= 2 ? "rgba(8,12,44,.46)" : MOOD === 1 ? "rgba(70,46,130,.2)" : "rgba(255,160,90,.08)"; g.fillRect(0, 0, W, H);
  }
  function fogFront(g, cy, y0tile, fr) {
    const W = 320, y = y0tile * TS - cy; if (y > 200) return;
    const gr = g.createLinearGradient(0, y - 18, 0, y + 70); gr.addColorStop(0, "rgba(220,224,244,0)"); gr.addColorStop(1, MOOD >= 2 ? "rgba(70,80,130,.5)" : "rgba(226,229,246,.5)"); g.fillStyle = gr; g.fillRect(0, Math.max(0, y - 18), W, 200);
    g.fillStyle = MOOD >= 2 ? "rgba(120,130,190,.14)" : "rgba(255,255,255,.2)";
    for (let i = 0; i < 6; i++) { const x = ((i * 97 + fr * (0.3 + (i % 3) * 0.12)) % (W + 140)) - 70; g.beginPath(); g.ellipse(x, y + 8 + (i % 3) * 9, 50, 5, 0, 0, 7); g.fill(); }
  }
  function plaque(g, txt, x, y) {
    g.font = "bold 6px sans-serif"; const tw = g.measureText(txt).width + 8; if (!onScr(x, y)) return;
    R(g, x - tw / 2, y, tw, 9, "#1e2430dd"); R(g, x - tw / 2, y, tw, 1, "#7fe3d0"); g.textAlign = "center"; g.fillStyle = "#f4efdc"; g.fillText(txt, x, y + 7); g.textAlign = "left";
  }
  function smoke(g, x, y, fr) { for (let i = 0; i < 4; i++) { const t = ((fr / 40 + i * 0.25) % 1), a = (1 - t) * 0.35; g.fillStyle = `rgba(230,230,240,${a})`; g.beginPath(); g.arc(x + Math.sin(t * 5 + i) * 3 + t * 6, y - t * 22, 2 + t * 4, 0, 7); g.fill(); } }

  // ================================================================== CAPITOLO 1 · LA CORSA DELLE 6:43
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc } = X;
    const N = 1, S = () => X.stepOf(N), kit = () => F.get("kit", ""), has = (k) => F.is(k);

    // ---- personaggi (tutti nuovi)
    const cast = (id, name, o, bio) => X.cast(id, Object.assign({ name }, o), bio);
    cast("vl_teodora", "Teodora Brinzi", { tag: "gray", hair: "#c9ccd6", style: "bun", skin: "#d9a57a", bg: ["#1c2a4a", "#e9a64a"], glasses: true, cap: "#1d3a5a", shirt: "#2b4a6f" }, "Capocabina della funivia di Vallombra da quarant'anni. Rispetta l'orario più delle leggi e le leggi più dei sentimenti, e se uno dei due prende il sopravvento lo scrive nel registro, a matita.");
    cast("vl_fosco", "Fosco Quarantotto", { tag: "gray", hair: "#e6e0d0", style: "messy", skin: "#e0b48a", bg: ["#3a2a1a", "#d9a441"], beard: true, shirt: "#6b4a2a" }, "Custode del Magazzino degli Stambecchi. Si dichiara tredicesimo giocatore, non ha mai giocato e ha spolverato ogni giorno lo stesso armadietto per ventisei anni, «per abitudine».");
    cast("vl_mirtilla", "Mirtilla Zanzotto", { tag: "gold", hair: "#7a2a5a", style: "long", skin: "#f0c9a8", bg: ["#5a1f4a", "#ffb3c7"], shirt: "#b3487a" }, "Gestisce il Rifugio Tre Tazze ed è anche segretaria, cassiera, massaggiatrice e, in caso di pioggia, allenatrice degli Stambecchi. Le sue cioccolate hanno nomi di nebbie. Non chiamatela mai «nebbia», chiamatela «Latte».");
    cast("vl_remo", "Remo Valanga", { tag: "blue", hair: "#0f0f0f", style: "cresta", skin: "#c98f63", bg: ["#c8ff2a", "#2a2a2a"], shades: true, shirt: "#d6f23a" }, "Capitano dei Camosci di Cima Alta, tre Coppe in fila e occhiali da sole portati anche dentro il Latte. Dice che lo proteggono dalla luce dei suoi successi.");
    cast("vl_bianca", "Bianca Rovedo", { tag: "blue", hair: "#1a3a5a", style: "codino", skin: "#8a5a3a", bg: ["#2a4a3a", "#e8a33d"], glasses: true, shirt: "#e8a33d" }, "Meccanica ufficiale della funivia e di tutto ciò che si rompe a Vallombra, cioè tutto. Fa la rampa della stazione in nove secondi e giura che dieci minuti di partita li passa a correggere la difesa.");
    cast("vl_agata", "Agata Sassi", { tag: "gray", hair: "#8a3a1a", style: "slick", skin: "#f2d0b0", bg: ["#1a3a3a", "#7fe3d0"], glasses: true, shirt: "#4a7a5a" }, "Geologa. Studia la lumina, la pietra che brilla da sola nella vecchia miniera, e misura tutto: il terreno, il ritardo del fischio e la pazienza degli interlocutori.");
    cast("vl_cornelio", "Cornelio Brumasecca", { tag: "", hair: "#cfcfd6", style: "slick", skin: "#eec39c", bg: ["#4a1f2a", "#ffd23f"], glasses: true, shirt: "#7a1f2a" }, "Sindaco di Vallombra da tre mandati. I suoi discorsi durano sette minuti e dicono due cose, di solito la stessa. Non gioca, ma parla per undici.");
    cast("vl_lampionaio", "Il Lampionaio", { tag: "", hair: "#1a1a22", style: "buzz", skin: "#8a7a6c", eye: "#7fe3d0", bg: ["#06101a", "#7fe3d0"], cap: "#222a3a", shirt: "#222a3a" }, "Nessuno l'ha mai visto in faccia. Accende i lampioni del sentiero sopra il campo; nessuno sa chi paghi l'olio. Parla solo con il gesso, su una lavagnetta di lumina.");
    cast("vl_noemi", "Noemi Etere", { tag: "blue", hair: "#2a6a8a", style: "long", skin: "#f3cfb0", bg: ["#16325c", "#7fe3d0"], shirt: "#2a6a8a" }, "La voce di Radio Nebbia, 91,3 sul dial: l'unica emittente che dà il meteo con un'accuratezza incrollabile («nebbia, con possibilità di nebbia»).");
    cast("vl_tonio", "Tonio Fiocco", { tag: "", hair: "#5a4a3a", style: "messy", skin: "#e8bf98", bg: ["#2a3a1a", "#c8ff2a"], shirt: "#d6f23a" }, "Portiere dei Camosci. Il suo lavoro, dice, è stare fermo e sembrare una porta più piccola.");
    cast("vl_gisella", "Gisella Cima", { tag: "", hair: "#d4502a", style: "codino", skin: "#f2cfae", bg: ["#2a3a1a", "#c8ff2a"], shirt: "#d6f23a" }, "Centrocampista dei Camosci. Tifa Camosci anche quando perde, soprattutto quando perde.");
    X.lanDef("vl_bianca", { name: "Bianca Rovedo", role: "Meccanica · ala veloce", met: "bianca_met" });
    X.lanDef("vl_mirtilla", { name: "Mirtilla Zanzotto", role: "Segreteria e cioccolate", met: "mirtilla_met" });
    X.lanDef("vl_fosco", { name: "Fosco Quarantotto", role: "Il tredicesimo giocatore", met: "fosco_met" });
    X.lanDef("vl_agata", { name: "Agata Sassi", role: "Geologa · consulente", met: "agata_met" });
    X.lanDef("vl_remo", { name: "Remo Valanga", role: "Rivale dei Camosci", met: "remo_met" });
    X.lanDef("vl_teodora", { name: "Teodora Brinzi", role: "Capocabina", met: "teodora_met" });

    const goal = (s) => ({
      0: "Presentati a Teodora, in stazione.",
      1: "Raggiungi Mirtilla al Rifugio Tre Tazze, in piazza.",
      2: !has("kit_done") && !has("bianca_in") ? "Trova una maglia da Fosco (magazzino) e una compagna: Bianca, alla cabina." : !has("kit_done") ? "Prima di andare al Campo: fatti dare una maglia da Fosco, al Magazzino Stambecchi (edificio in alto a sinistra, porta in basso)." : "Convinci Bianca, la meccanica, a giocare con te: è alla cabina, in basso a sinistra, vicino alla stazione.",
      3: "Vai al Campo Sospeso: esci dal paese dal cancello a EST (freccia gialla, in fondo a destra, oltre la fontana e il Rifugio). Il sindaco ti aspetta.",
      4: "Torna in paese.",
      5: "Fosco ti aspetta al magazzino.",
      6: "Teodora ti aspetta nell'ufficio della stazione.",
      7: "Segui il sentiero dei Lampioni: dal Campo, il cancello in alto a destra.",
    }[s] || "Capitolo concluso. Gira per Vallombra e raccogli le ultime schegge di lumina.");

    // ---- luoghi
    const LAMPS_P = [[9, 14], [31, 14], [13, 11], [25, 11], [14, 20], [37, 11]];
    const zones = {
      vl_paese: {
        name: "Vallombra · Il paese sopra la nebbia", short: "Vallombra Alta", sub: "Mille e cento metri, la funivia e il Latte", w: 40, h: 26, start: [13, 21], theme: "torino", bg: "vl_paese",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_argento", items: [[2, 4], [37, 15], [17, 19], [12, 22]],
        act: { n: "Leggi la bacheca", k: "Guarda la cabina", F: "Guarda la fontana", u: "Entra nel Rifugio", m: "Guarda il magazzino", v: "Ufficio della stazione", q: "Radio Nebbia", ">": "Sentiero del Campo", x: "Guarda il tavolo" },
        areas: [[1, 15, 14, 23, "La Stazione Alta"], [26, 4, 36, 11, "Il Rifugio Tre Tazze"], [1, 5, 12, 11, "Il Magazzino degli Stambecchi"], [14, 3, 20, 7, "Radio Nebbia"], [13, 8, 26, 16, "Piazza della Lanterna"], [14, 22, 38, 25, "Il Parapetto"], [0, 12, 39, 14, "Via del Latte"]],
        hints: () => ({
          "La Stazione Alta": "La stazione della funivia: una cabina rossa agganciata al cavo e un orologio fermo su un orario preciso.",
          "Il Rifugio Tre Tazze": "Tavolini, un camino e un'insegna che promette cioccolata «di tutte le nebbie».",
          "Il Magazzino degli Stambecchi": "Il magazzino del club: porta di legno, vernice sbiadita, un armadietto spolverato più di tutti gli altri.",
          "Radio Nebbia": "Una casetta con un'antenna storta. Da dentro, una voce dà il meteo.",
          "Piazza della Lanterna": "Una fontana che brilla da sola. Fosco dice che si beve, Agata dice di no, Mirtilla dice che si paga.",
          "Il Parapetto": "Oltre la ringhiera il paese finisce e comincia il Latte: bianco, fermo, in ascolto.",
          "Via del Latte": "La via principale: lampioni di lumina, finestre calde e un'idea molto alta dell'orario.",
          "Vallombra Alta": "Vallombra: mille e cento metri, centoventi abitanti.",
        }),
        intro: [["voce", "Vallombra: mille e cento metri, centoventi abitanti e un'opinione molto alta del proprio orario. Sotto il parapetto non c'è valle: c'è il Latte, un mare di nebbia ferma che tiene i tetti come un vassoio."], ["voce", "Le finestre hanno la luce dei caminetti. I lampioni ne hanno una turchese, che non è di nessun fornitore."]],
        npcs: (s) => {
          const o = [{ id: "vl_teodora", at: [11, 22] }, { id: "vl_mirtilla", at: [31, 10] }, { id: "vl_fosco", at: [7, 11] }];
          if (!has("bianca_in")) o.push({ id: "vl_bianca", at: [6, 22] });
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(1, 6, 38, 11, ":"); lay(1, 3, 38, 5, '"'); lay(0, 0, 39, 2, "a"); lay(0, 3, 0, 23, "a"); lay(39, 3, 39, 23, "a"); lay(14, 8, 25, 16, "p");
          [[2, 3], [6, 4], [10, 3], [13, 5], [23, 4], [24, 3], [29, 3], [33, 4], [37, 3], [36, 5]].forEach(([x, y]) => put(x, y, "t"));
          house(3, 6, 8, 5, { roof: "#7a3a2e", wall: "#c4a77d", door: [6, 10, "m"], chim: 5, wood: true, snow: true });
          house(15, 4, 5, 4, { roof: "#46557a", wall: "#9fb3c8", door: [17, 7, "q"], ox: 1 });
          house(26, 5, 9, 5, { roof: "#7a3a2e", wall: "#e0c9a0", wood: true, door: [30, 9, "u"], chim: 2, ox: 1, snow: true });
          house(36, 6, 3, 4, { roof: "#46557a", wall: "#d8c9a8", shut: "#6a4a30" });
          house(30, 15, 6, 4, { roof: "#2b4a6f", wall: "#d8c9a8", shut: "#6a4a30", snow: true });
          house(20, 18, 6, 4, { roof: "#7a3a2e", wall: "#c9b8a0", shut: "#4a6a8a" });
          house(2, 15, 10, 6, { roof: "#2b4a6f", wall: "#d8c9a8", door: [5, 20, "v"], snow: true });
          lay(1, 21, 13, 23, "="); lay(14, 23, 38, 23, "r"); lay(0, 24, 39, 25, "f"); lay(26, 10, 35, 11, "=");
          put(7, 22, "k"); put(8, 22, "k"); put(9, 22, "k");
          put(19, 11, "F"); put(20, 11, "F"); put(19, 12, "F"); put(20, 12, "F");
          LAMPS_P.forEach(([x, y]) => put(x, y, "l"));
          put(13, 19, "n"); put(15, 15, "b"); put(24, 15, "b"); put(28, 10, "x"); put(34, 10, "x");
          put(39, 12, ">"); put(39, 13, ">");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          // il cavo della funivia, col la cabina che scivola sopra il Latte
          const x0 = X_(11) + 4, y0 = Y_(15) + 2, x1 = X_(47), y1 = Y_(25.6);
          g.strokeStyle = "#1c2236"; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
          const t = ((fr * 0.0016) % 1.3) - 0.15, bx = x0 + (x1 - x0) * t, by = y0 + (y1 - y0) * t;
          if (t > 0 && t < 1) { R(g, bx, by, 1, 5, "#1c2236"); R(g, bx - 6, by + 5, 12, 8, "#c8422e"); R(g, bx - 6, by + 5, 12, 2, "#e8704e"); R(g, bx - 4, by + 8, 3, 3, "#ffd98a"); R(g, bx + 1, by + 8, 3, 3, "#ffd98a"); }
          // l'orologio della stazione, fermo sulle 6:43
          const ccx = X_(7) + 8, ccy = Y_(19) + 7; if (onScr(ccx, ccy)) { g.fillStyle = "#efe6cf"; g.beginPath(); g.arc(ccx, ccy, 6, 0, 7); g.fill(); g.strokeStyle = "#2a2f44"; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(ccx, ccy); g.lineTo(ccx + Math.sin(3.52) * 3, ccy - Math.cos(3.52) * 3); g.moveTo(ccx, ccy); g.lineTo(ccx + Math.sin(4.5) * 5, ccy - Math.cos(4.5) * 5); g.stroke(); }
          plaque(g, "STAZIONE ALTA · 1.100 m", X_(7), Y_(20) - 2); plaque(g, "MAGAZZINO STAMBECCHI", X_(7), Y_(10) - 2); plaque(g, "RIFUGIO TRE TAZZE", X_(30.5), Y_(9) - 2); plaque(g, "RADIO NEBBIA 91,3", X_(17.5), Y_(7) - 2);
          smoke(g, X_(28) + 8, Y_(5) + 2, fr); smoke(g, X_(8) + 8, Y_(6) + 2, fr + 17);
          // ghirlanda di lumine fra i lampioni della piazza
          const gx0 = X_(13) + 8, gx1 = X_(25) + 8, gy = Y_(11) + 2; if (onScr(gx0, gy) || onScr(gx1, gy)) { g.strokeStyle = "#3a4256"; g.beginPath(); g.moveTo(gx0, gy); g.quadraticCurveTo((gx0 + gx1) / 2, gy + 14, gx1, gy); g.stroke(); for (let i = 1; i < 9; i++) { const k = i / 9, px_ = gx0 + (gx1 - gx0) * k, py_ = gy + 14 * 2 * k * (1 - k) * 0.5 * 2 / 2; R(g, px_ - 1, py_ + 1, 3, 3, (fr >> 4) % 9 === i ? "#ffffff" : "#7fe3d0"); } }
        },
        top(cx, cy, d) { const g = GP; fogFront(g, cy, 22.4, d.fr); moodTint(g); tileLights(g, cx, cy); },
      },

      vl_campo: {
        name: "Vallombra · Il Campo Sospeso", short: "Il Campo Sospeso", sub: "Un campo da calcio appeso sopra la nebbia", w: 36, h: 22, start: [2, 10], theme: "napoli", bg: "vl_campo",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_ambra", items: [[2, 15], [30, 12], [10, 3], [24, 3]],
        act: { o: "Guarda il palco", z: "Guarda gli strumenti", j: "Guarda la gradinata", "<": "Torna in paese", "^": "Sentiero dei Lampioni", w: "Gli spogliatoi", x: "Guarda le casse" },
        areas: [[0, 3, 6, 8, "Gli spogliatoi"], [6, 5, 27, 15, "Il Campo Sospeso"], [28, 0, 32, 8, "Il sentiero dei Lampioni"], [8, 16, 25, 17, "La gradinata"], [0, 18, 35, 21, "Il bordo del Latte"], [4, 4, 31, 17, "La pista"]],
        hints: (s) => ({
          "Gli spogliatoi": "Una baracca di legno con la porta che cigola in due note. Dentro, ganci, panche e un'aria di sconfitte rispettabili.",
          "Il Campo Sospeso": s >= 4 ? "Il campo dopo la partita: l'erba segnata dai tacchetti e il Latte che sale piano oltre le porte." : "Un campo da calcio costruito su una terrazza di roccia. Dietro le porte non c'è niente: soltanto Latte. Il pallone, se va lungo, ritorna.",
          "Il sentiero dei Lampioni": "Un sentiero di ghiaia con lampioni di lumina. Va su, verso la miniera.",
          "La gradinata": "Gradoni di legno blu e ambra. In tutto, trentadue posti: ventisei prenotati dal sindaco.",
          "Il bordo del Latte": "Un parapetto basso e poi il bianco. Qualcosa, laggiù, fa un rumore di sala d'attesa.",
          "La pista": "La pista di terra rossa attorno al campo, tracciata a passi da qualcuno di buona volontà.",
          "Il Campo Sospeso (short)": "",
        }),
        intro: [["voce", "Il Campo Sospeso: una terrazza di roccia, un prato rasato dal vento e due porte che guardano nel vuoto. Un gabbiano, in alto, finge di arbitrare."]],
        npcs: (s) => {
          const o = [];
          if (s >= 2) { o.push({ id: "vl_agata", at: [29, 8] }, { id: "vl_remo", at: [14, 12] }, { id: "vl_tonio", at: [25, 10] }, { id: "vl_gisella", at: [21, 14] }); }
          if (s >= 3) o.push({ id: "vl_cornelio", at: [15, 3] });
          if (has("bianca_in")) o.push({ id: "vl_bianca", at: [9, 12] });
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 3, 35, 17, ":"); lay(0, 0, 35, 2, "a"); lay(0, 3, 0, 17, "a"); lay(5, 4, 29, 16, ";"); lay(6, 5, 27, 15, "y"); lay(8, 17, 25, 17, "j");
          lay(0, 18, 32, 18, "r"); lay(0, 19, 35, 21, "f"); lay(32, 3, 32, 17, "r"); lay(33, 3, 35, 18, "f");
          house(1, 3, 4, 5, { roof: "#46557a", wall: "#9fb3c8", door: [2, 7, "w"], snow: true });
          put(16, 3, "o"); put(17, 3, "o"); put(29, 7, "z"); put(30, 7, "z");
          put(2, 12, "x"); put(2, 13, "x");
          [[3, 13], [9, 3], [29, 3]].forEach(([x, y]) => put(x, y, "l")); put(31, 9, "l");
          put(0, 10, "<"); put(0, 11, "<"); put(30, 2, "^"); put(31, 2, "^");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          const x0 = X_(6) + 0.5, y0 = Y_(5) + 0.5, w = 22 * TS - 1, h = 11 * TS - 1;
          if (x0 > -400 && x0 < 400) {
            g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 1; g.strokeRect(x0, y0, w, h); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke();
            g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 24, 0, 7); g.stroke(); g.strokeRect(x0, y0 + 2.5 * TS, 3 * TS, 6 * TS); g.strokeRect(x0 + w - 3 * TS, y0 + 2.5 * TS, 3 * TS, 6 * TS);
            g.strokeStyle = "#e8e8f0"; g.lineWidth = 2; g.strokeRect(x0 - 7, y0 + 4 * TS, 7, 3 * TS); g.strokeRect(x0 + w, y0 + 4 * TS, 7, 3 * TS);
            R(g, x0 + w / 2 - 2, y0 + h / 2 - 2, 4, 4, "#fff");
          }
          // festoni della Coppa lungo il lato nord
          for (let i = 0; i < 18; i++) { const x = X_(7 + i) + 4, y = Y_(4) + 3 + Math.sin(i * 0.9) * 2; if (onScr(x, y)) { g.fillStyle = i % 2 ? "#e9a64a" : "#1b2f7a"; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x + 3, y); g.lineTo(x, y + 6); g.fill(); } }
          plaque(g, "COPPA DEI TRE VERSANTI", X_(16.5) + 8, Y_(2) + 6); plaque(g, "SPOGLIATOI", X_(3), Y_(7) - 2);
          // fari ai quattro angoli
          [[5, 4], [28, 4], [5, 16], [28, 16]].forEach(([tx, ty]) => { const x = X_(tx) + 8, y = Y_(ty); if (onScr(x, y)) { R(g, x, y - 18, 2, 22, "#2a2f48"); R(g, x - 6, y - 24, 14, 6, "#2a2f48"); for (let i = 0; i < 3; i++) R(g, x - 5 + i * 5, y - 23, 4, 4, MOOD >= 2 ? "#fff7d0" : "#d8d4c0"); } });
        },
        top(cx, cy, d) {
          const g = GP; fogFront(g, cy, 18.6, d.fr); moodTint(g); tileLights(g, cx, cy);
          if (MOOD >= 2) { g.save(); g.globalCompositeOperation = "lighter"; [[5, 4], [28, 4], [5, 16], [28, 16]].forEach(([tx, ty]) => glow(g, tx * TS - cx + 9, ty * TS - cy - 16, 60, "255,240,180", 0.3)); g.restore(); }
        },
      },

      vl_miniera: {
        name: "Vallombra · L'Imbocco", short: "L'Imbocco", sub: "La vecchia Miniera della Luce", w: 28, h: 18, start: [2, 11], theme: "puntanera", bg: "vl_miniera",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_lumina", items: [[3, 7], [19, 8], [25, 7]],
        act: { n: "Leggi l'avviso", X: "Guarda le assi", C: "Guarda la lumina", "<": "Torna al Campo" },
        areas: [[11, 2, 16, 10, "L'imbocco della miniera"], [0, 11, 27, 13, "Il sentiero dei Lampioni"], [0, 14, 27, 17, "Il Latte"], [0, 2, 27, 10, "La parete di roccia"]],
        hints: () => ({
          "L'imbocco della miniera": "L'imbocco, chiuso da assi inchiodate. Dalle fessure filtra una luce turchese che si alza e si abbassa, come un respiro.",
          "Il sentiero dei Lampioni": "I lampioni sono accesi. Di solito, dicono, non lo sono.",
          "Il Latte": "Sotto il sentiero il Latte è fermo. Qualche lanterna ci galleggia dentro, a mezz'aria, senza nessuno a reggerla.",
          "La parete di roccia": "Cristalli di lumina incastonati nella roccia: brillano senza chiedere il permesso a nessuno.",
          "L'Imbocco": "L'imbocco della Miniera della Luce.",
        }),
        intro: [["voce", "L'Imbocco della Miniera della Luce. Le travi sono nere di anni, le assi nuove di chiodi. Lungo il sentiero i lampioni si accendono uno dopo l'altro mentre cammini: sembrano accorgersi di te."]],
        npcs: (s) => (s === 7 ? [{ id: "vl_lampionaio", at: [22, 12] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 17, "_"); lay(0, 0, 27, 1, "a"); lay(0, 2, 10, 4, "a"); lay(17, 2, 27, 4, "a"); lay(0, 2, 0, 13, "a"); lay(27, 2, 27, 13, "a");
          lay(1, 11, 26, 13, ":"); lay(11, 5, 16, 10, ":"); lay(13, 5, 14, 10, "-"); lay(0, 14, 27, 17, "f");
          [[11, 2], [11, 3], [11, 4], [16, 2], [16, 3], [16, 4], [12, 2], [13, 2], [14, 2], [15, 2]].forEach(([x, y]) => put(x, y, "Y"));
          lay(12, 3, 15, 4, "X");
          [[4, 6], [7, 9], [20, 6], [23, 9], [9, 4]].forEach(([x, y]) => put(x, y, "C"));
          [[3, 10], [9, 10], [18, 10], [24, 10]].forEach(([x, y]) => put(x, y, "l"));
          put(2, 10, "n"); put(0, 11, "<"); put(0, 12, "<");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          plaque(g, "MINIERA DELLA LUCE · 1931", X_(13.5) + 8, Y_(1) + 4);
          // lanterne che galleggiano nel Latte, senza nessuno a reggerle
          [3, 7, 12, 17, 22, 26].forEach((tx, i) => { const x = X_(tx) + 8, y = Y_(15) + 6 + Math.sin(fr / 40 + i * 1.7) * 3 + (i % 2) * 14; if (!onScr(x, y)) return; g.save(); g.globalCompositeOperation = "lighter"; glow(g, x, y, 20, "127,227,208", 0.5); g.restore(); R(g, x - 3, y - 4, 6, 8, "#1c2236"); R(g, x - 2, y - 3, 4, 6, "#bff7ea"); R(g, x - 1, y - 6, 2, 2, "#1c2236"); });
          for (let i = 0; i < 14; i++) { const x = ((i * 53 + fr * 0.2) % 340) - 10, y = ((i * 71 + Math.sin(fr / 60 + i) * 8) % 200); R(g, x, y, 1, 1, "rgba(160,255,235,.5)"); }
        },
        top(cx, cy, d) {
          const g = GP; fogFront(g, cy, 14.2, d.fr);
          const gr = g.createRadialGradient(160, 110, 40, 160, 110, 190); gr.addColorStop(0, "rgba(2,6,16,0)"); gr.addColorStop(1, "rgba(2,6,16,.55)"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200);
          g.save(); g.globalCompositeOperation = "lighter"; const t0x = Math.floor(cx / TS), t0y = Math.floor(cy / TS);
          for (let ty = t0y; ty <= t0y + 13; ty++) for (let tx = t0x; tx <= t0x + 21; tx++) { const ch = at(tx, ty), x = tx * TS - cx + 8, y = ty * TS - cy + 8; if (ch === "l") glow(g, x, y - 4, 28, "127,227,208", 0.45); else if (ch === "C") glow(g, x, y, 28, "90,235,210", 0.32); else if (ch === "X") glow(g, x, y, 26, "90,235,210", 0.25 + 0.15 * Math.sin(d.fr / 26)); }
          g.restore();
        },
      },
    };

    // ---- helper di scena
    const BG = { P: "vl_paese", C: "vl_campo", M: "vl_miniera", I: "vl_interno", F: "vl_foto" };
    const sw = (lines, bg) => lines.map((l) => (l.length > 2 ? l : [l[0], l[1], bg]));
    const chip = (arrLines) => arrLines[Math.floor(Math.random() * arrLines.length)];
    const shotLine = () => { const h = hero(); return h ? h.shotName : "il tuo tiro"; };
    function mood(s) { return s >= 5 ? 2 : s >= 4 ? 1 : 0; }

    // ---- Teodora
    function teodora() {
      const s = S();
      if (s === 0) return teodoraArrivo();
      if (s === 6) return teodoraRegistro();
      F.set("teodora_met", true);
      const opts = [
        { label: "Una domanda sull'orario", sub: "Teodora ne sa", fn: () => say(sw([["vl_teodora", chip(["L'ultima cabina scende alle 18:20 e risale alle 18:43. Chi la perde dorme in paese. Il paese è accogliente, ma fa domande.", "Gli orari non sono un'opinione. Sono la sola cosa, quassù, che nessuno si permette di contraddire. Neanche il sindaco, che ci prova.", "Ho scritto l'orario a mano ogni anno per quarant'anni. Ho cambiato la penna tre volte. L'orario mai."])]], BG.P), done) },
        { label: "La cabina della sera", sub: s >= 5 ? "Dopo quello che hai visto" : "Chi la guida?", fn: () => say(sw(s >= 5 ? [["vl_teodora", "Non posso risponderti qui. Non con la gente alla finestra. Vieni in ufficio quando sei pronto."], ["vl_teodora", "Ho solo una cosa da dirti: non esiste nessuno che la guidi."]] : s >= 3 ? [["vl_teodora", "La sera, la cabina fa quello che vuole. Io le tengo compagnia con il lucchetto."]] : [["vl_teodora", "La guida il cavo. Il cavo è una persona seria."], ["vl_teodora", "…Di solito."]], BG.P), done) },
      ];
      if (S() >= 8) opts[1] = { label: "Dopo il Capitolo 1", sub: "Cosa ne pensa Teodora", fn: () => say(sw([["vl_teodora", "Stanotte non ho chiuso il lucchetto. Sono rimasta alla finestra tutto il tempo a guardare il cavo."], ["vl_teodora", "Non è passato nessuno. Ma il cavo ha cantato, per un minuto intero, una nota che conosco. Poi ha smesso."]], BG.P), done) };
      ask("vl_teodora", s >= 7 ? "«Il sentiero è dal Campo, cancello in alto a destra. Fa' attenzione ai lampioni. Se ti sembra che ti guardino, è perché ti guardano.»" : "«Dimmi, e fai in fretta: la 18:20 non aspetta nessuno. Neanche me.»", opts, BG.P);
    }
    function teodoraArrivo() {
      F.set("teodora_met", true);
      say(sw([["vl_teodora", "Fermo lì. Biglietto. E non faccia quella faccia: l'ultima cabina, a Vallombra, è una questione di dignità."]], BG.P), () => ask("voce", "Come rispondi?", [
        { label: "«Ecco il biglietto. E ho il numero giusto.»", sub: "Sicuro di te", fn: () => tono("sicuro") },
        { label: "«Strano: in cabina non c'era nessuno.»", sub: "Attento ai dettagli", fn: () => tono("attento") },
        { label: "«Biglietto? Credevo fosse a offerta libera.»", sub: "Ironico", fn: () => tono("ironico") },
      ], BG.P));
    }
    function tono(t) {
      F.set("tono", t);
      const a = t === "sicuro" ? [["vl_teodora", "Il numero giusto. Lo dicono tutti: poi salgono e scoprono che il numero giusto è l'altitudine, millecento. Il biglietto lo timbro lo stesso."]]
        : t === "attento" ? [["vl_teodora", "…"], ["vl_teodora", "Già. Strano."], ["vl_teodora", "Le cabine, a volte, si fanno compagnia da sole. Il biglietto, comunque, lo timbro lo stesso."]]
          : [["vl_teodora", "Offerta libera è il prezzo della cioccolata. Il biglietto è tre euro oppure un aneddoto. Mi basta breve."], ["hero", "Un aneddoto breve: sono qui."], ["vl_teodora", "Accettato. Il più corto dell'anno."]];
      say(sw([...a, ["vl_teodora", "Ecco Vallombra: millecento metri, centoventi abitanti e un orario che rispettiamo più delle leggi. Sotto di noi c'è il Latte. Non chiamarlo nebbia davanti a Mirtilla: la offende."], ["vl_teodora", "Il Rifugio Tre Tazze è in piazza, a destra della fontana. Mirtilla ti aspetta da due giorni. Dice di aver scritto lei la lettera. Dice anche molte altre cose."], ["voce", "(Sei salito con l'ultima cabina. A bordo non c'era nessuno. Hai pensato che fosse automatica.)"]], BG.P), () => {
        setStep(N, 1); note("Sono arrivato a Vallombra con l'ultima cabina della funivia. A bordo non c'era nessuno."); done();
      });
    }

    // ---- Mirtilla
    function mirtilla() {
      const s = S();
      if (s === 0) return say(sw([["vl_mirtilla", "Sei già passato dalla stazione? Teodora ti timbra, poi vieni da me. È la regola: la regola è sua, ma io la faccio rispettare con il sorriso."]], BG.P), done);
      if (s === 1) return mirtillaScena();
      F.set("mirtilla_met", true);
      const opts = [
        { label: "Una cioccolata, grazie", sub: "Il menu delle nebbie", fn: () => say(sw([["vl_mirtilla", chip(["Nebbia bianca, con panna. Nebbia fitta, doppio cacao. Schiarita, senza zucchero: la vendo pochissimo, la prendono solo i pessimisti.", "Il «Latte di Latte»: cioccolata, latte e un cucchiaino di silenzio. Offre la casa. La casa sono io.", "Oggi c'è la «Nebbia con vista». Non si vede niente ma costa di più."])], ["voce", "La cioccolata è densa e caldissima, e sa leggermente di pietra bagnata. Ti scalda fino alle scarpe."]], BG.P), done) },
        { label: "Cosa mi dici degli Stambecchi?", sub: "La storia del club", fn: () => say(sw([["vl_mirtilla", s >= 5 ? "Ho visto Fosco uscire dal magazzino con la faccia di chi ha un segreto in tasca. A Vallombra i segreti si vedono: fanno gonfiare le tasche." : "Gli Stambecchi: blu notte e ambra, come il cielo prima che si accendano i lampioni. Siamo in sei, più tu. Più Fosco, che dice di essere il tredicesimo."]], BG.P), done) },
      ];
      ask("vl_mirtilla", "«Siediti, siediti. Qui si ragiona meglio con le mani occupate.»", opts, BG.P);
    }
    function mirtillaScena() {
      F.set("mirtilla_met", true);
      say(sw([
        ["vl_mirtilla", "Eccolo! Eccoci! Il numero {num}! Sono Mirtilla Zanzotto: segretaria, cassiera, massaggiatrice e, in caso di pioggia, allenatrice degli Stambecchi."],
        ["hero", "Sei stata tu a scrivermi la lettera?"],
        ["vl_mirtilla", "Certo che l'ho scritta io!"], ["vl_mirtilla", "…Cioè. L'ho trovata sul bancone, già affrancata, con scritto «Per il Rifugio». Ma l'ho approvata. Una firma di approvazione conta come una scritta."],
        ["vl_mirtilla", "La Coppa dei Tre Versanti: Vallombra, Cima Alta e Valle Fonda. Si gioca ogni estate sul campo di chi ospita. Noi non vinciamo dal '98, cioè da ventisei anni, cioè da sempre, se chiedi a Cima Alta."],
        ["vl_mirtilla", "Abbiamo sei giocatori, un pallone un po' sgonfio e un sindaco. Il sindaco non gioca, ma parla per undici."],
      ], BG.P), () => ask("voce", "Cosa le chiedi?", [
        { label: "«Perché proprio io?»", sub: "Il perché della lettera", fn: () => { F.set("chiesto", "perche"); say(sw([["vl_mirtilla", "Perché la lettera diceva il tuo numero. Il tuo numero e basta: niente osservatori, niente telefonate. Qui, quando una cosa succede senza spiegazioni, di solito è una buona cosa."], ["vl_mirtilla", "Oppure è una cosa che nessuno vuole spiegare. Ma questo non lo dire al sindaco."]], BG.P), remoEntra); } },
        { label: "«Cos'è successo nel '98?»", sub: "Il silenzio del paese", fn: () => { F.set("chiesto", "novantotto"); say(sw([["vl_mirtilla", "La finale. Poi il Crollo, in miniera. Poi il silenzio."], ["vl_mirtilla", "Chiedi a Fosco, se ti va. Io… io faccio le cioccolate."]], BG.P), remoEntra); } },
      ], BG.P));
    }
    function remoEntra() {
      F.set("remo_met", true);
      say(sw([
        ["voce", "Dalla piazza arriva un passo di scarpe nuove e di nessuna vergogna. Un ragazzo in tuta giallo fluo, con gli occhiali da sole nella nebbia, ti guarda dall'alto di un metro e settantasei."],
        ["vl_remo", "Che profumo di dilettanti! Remo Valanga, capitano dei Camosci di Cima Alta. Tre Coppe in fila e un'abbronzatura che non c'entra niente col Latte."],
        ["vl_mirtilla", "Porta gli occhiali da sole nella nebbia da quando ha vinto la prima Coppa. Dice che lo proteggono."],
        ["vl_remo", "Dalla luce dei miei successi. Allora, il nuovo? Partita di presentazione stasera al Campo Sospeso: voi con quei sei più il nuovo, noi con la nostra squadra. Se perdete, Mirtilla ci offre il caffè per un anno."],
        ["vl_mirtilla", "Io non ho mai…"], ["vl_remo", "Ha detto di sì il suo sguardo."],
      ], BG.P), () => ask("voce", "Cosa rispondi a Remo?", [
        { label: "«Accetto. Portate pure gli occhiali, vi serviranno.»", sub: "Cordiale e tagliente", fn: () => remoRisposta(1) },
        { label: "«Giochiamo. Ma se vinco, via gli occhiali da sole.»", sub: "Una scommessa", fn: () => remoRisposta(2) },
        { label: "«Non prendo ordini da chi fa ombra nella nebbia.»", sub: "Ostile", fn: () => remoRisposta(3) },
      ], BG.P));
    }
    function remoRisposta(k) {
      F.set("remo", k); if (k === 2) F.set("remo_bet", true);
      const a = k === 1 ? [["vl_remo", "Mi piace. Ti mangio in dieci minuti, ma mi piace."]]
        : k === 2 ? [["vl_remo", "…Gli occhiali. Sei crudele. Va bene: se vinci, giù gli occhiali. Se perdi, mi scrivi «VALANGA» sul pallone, in stampatello."]]
          : [["vl_remo", "Ah. Allora parlerà il campo. Il campo è chiaro: è sospeso su venti metri di niente."]];
      say(sw([...a, ["voce", "Remo se ne va verso il Campo, con le mani in tasca e il passo di chi sa di essere guardato. Un gabbiano gli tiene dietro per un tratto, in segno di rispetto."],
        ["vl_mirtilla", "Ti servono una maglia, una compagna di squadra e, se ci tieni, un parere sul terreno. Fosco ha le maglie. Bianca sa correre e riparare cabine. Agata sa tutto del suolo. Nell'ordine che ti pare."]], BG.P), () => {
        setStep(N, 2); X.lanAdd("vl_mirtilla"); note("Mirtilla dice di aver scritto lei la lettera. In realtà l'ha trovata sul bancone, già affrancata."); note(k === 3 ? "Remo Valanga, capitano dei Camosci, mi ha sfidato. Non mi è piaciuto. Il campo parlerà." : k === 2 ? "Scommessa con Remo Valanga: se vinco, si toglie gli occhiali da sole." : "Remo Valanga mi ha sfidato per stasera. Sembra più simpatico di quanto vorrebbe."); done();
      });
    }

    // ---- Fosco
    function fosco() {
      const s = S();
      if (s < 2) return say(sw([["vl_fosco", "Torna quando Mirtilla ti manda. Non apro il magazzino a chi non ha il biglietto timbrato e il discorso di Mirtilla."]], BG.P), done);
      if (s === 5) return foto();
      if (!has("kit_done")) return foscoMaglia();
      F.set("fosco_met", true);
      const opts = [
        { label: "Il tredicesimo giocatore", sub: "Una carriera mai iniziata", fn: () => say(sw([["vl_fosco", chip(["Sono il tredicesimo giocatore, io. Sono sempre stato il tredicesimo. Non ho mai giocato, ma ci sono sempre stato: da ventisei anni nessuno mi ha mai sostituito.", "Il tredicesimo giocatore non entra mai. Fa quello che nessun altro fa: crede.", "Ho una pettorina con il numero tredici. Ce l'ho dal '98. L'ho lavata sette volte. Una per anno, per i primi sette anni."])]], BG.I), done) },
        { label: "Il magazzino", sub: "Cosa c'è dentro", fn: () => say(sw([["vl_fosco", s >= 6 ? "Il magazzino non cambia. Cambiano le persone che ci entrano: tu, per esempio. Sei il primo in ventisei anni che non ha chiesto «dov'è l'uscita»." : "Quattordici palloni sgonfi, tre porte smontate, un trofeo con il manico incollato e un armadietto lucido. Il resto è polvere e promesse."]], BG.I), done) },
      ];
      ask("vl_fosco", s >= 6 ? "«Hai parlato con Teodora? Allora sai più di me. Chiedimi pure, ma non ti prometto niente.»" : "«Entra, entra. Non toccare i palloni: hanno paura.»", opts, BG.I);
    }
    function foscoMaglia() {
      F.set("fosco_met", true);
      say(sw([
        ["vl_fosco", "Ventisei anni che aspetto qualcuno che mi chieda una maglia. Entra, entra: non toccare i palloni, hanno paura."],
        ["voce", "Il magazzino sa di cera, lana bagnata e tempo fermo. In fondo c'è un armadietto con un numero dipinto a mano: il {num}. È pulito. Lucido. Come se qualcuno lo spolverasse ogni giorno."],
        ["hero", "Perché l'armadietto del {num} è così in ordine?"],
        ["vl_fosco", "Perché lo spolvero. …Perché i numeri sbagliati ci si annoia a spolverarli."], ["vl_fosco", "Dentro c'è una maglia. Vecchia, ma stirata. Oppure ne ho sei nuove, blu notte, comprate da Mirtilla in saldo: sul petto c'è uno stambecco che sembra una capra."],
      ], BG.I), () => ask("voce", "Quale maglia indossi?", [
        { label: "La maglia vecchia", sub: "Quella dell'armadietto {num}", fn: () => scelta("old") },
        { label: "La maglia nuova", sub: "Blu notte, con lo stambecco-capra", fn: () => scelta("new") },
      ], BG.I));
    }
    function scelta(k) {
      F.set("kit", k); F.set("kit_done", true); X.castHero();
      const a = k === "old" ? [["vl_fosco", "…Ha una cucitura sulla spalla. L'ha cucita Aurelio con il filo da pesca, perché il filo normale non teneva. Non è comoda, ma è giusta."], ["voce", "La maglia ti sta come se qualcuno avesse già misurato. Odora di cera e di montagna, e di qualcosa di antico che non sai dire."]]
        : [["vl_fosco", "Fai bene. Le cose vecchie si rispettano, non si indossano."], ["vl_fosco", "…Io le indosso, però. Quando nessuno vede."]];
      note(k === "old" ? "L'armadietto del mio numero era già pronto, con una maglia stirata. Ho indossato quella." : "Ho preferito la maglia nuova. Fosco spolvera ancora l'altra.");
      say(sw([...a, ["vl_fosco", "Sono il tredicesimo giocatore, io. Sono sempre stato il tredicesimo. Non ho mai giocato, ma ci sono sempre stato."]], BG.I), () => {
        X.lanAdd("vl_fosco");
        if (has("bianca_in")) { setStep(N, 3); } done();
      });
    }

    // ---- Bianca
    function bianca() {
      const s = S();
      if (has("bianca_in")) return biancaDopo();
      if (s < 2) return say(sw([["vl_bianca", "Non ho tempo, ho una cabina da rimettere a posto. La numero tre fa un rumore che non dovrebbe fare."], ["vl_bianca", "Torna quando Mirtilla ti manda. Senza ordini non mi muovo: i bulloni sono più loquaci."]], BG.P), done);
      F.set("bianca_met", true);
      say(sw([
        ["voce", "Da sotto la cabina spuntano un paio di scarponi, una chiave inglese e una voce."],
        ["vl_bianca", "Tre minuti. La numero tre fa un rumore che… ah. Tu sei il nuovo."],
        ["vl_bianca", "Bianca Rovedo. Meccanica ufficiale della funivia, meccanica ufficiale di tutto quello che si rompe a Vallombra, cioè tutto."],
        ["hero", "Mirtilla dice che sai correre."], ["vl_bianca", "Mirtilla dice un sacco di cose. Cosa vuoi?"],
      ], BG.P), () => ask("voce", "Come la convinci?", [
        { label: "«Mi serve una che corre e che ripara. Sei l'unica.»", sub: "Onesto", fn: () => biancaScelta(1) },
        { label: "«Giochi e ti prometto una cabina nuova. Non so come.»", sub: "Una battuta", fn: () => biancaScelta(2) },
        { label: "«Scommetto che dopo dieci minuti sei già stanca.»", sub: "Una sfida", fn: () => biancaScelta(3) },
      ], BG.P));
    }
    function biancaScelta(k) {
      F.set("bianca", k);
      const a = k === 1 ? [["vl_bianca", "Detta così mi fa quasi piacere. Quasi."]] : k === 2 ? [["vl_bianca", "Una cabina nuova… guarda che ti prendo in parola. Le promesse sulle cabine pesano."]] : [["vl_bianca", "Stanca?! Faccio la rampa della stazione in nove secondi. Dieci minuti li passo a sistemarti la difesa."]];
      say(sw([...a, ["vl_bianca", "Va bene, ci sono. Ma ho un patto: se la cabina tre suona ancora, sospendo la partita e vado a vedere."], ["voce", "Bianca si pulisce le mani su uno straccio che era già del colore dell'olio. «Ci vediamo al Campo. Si va a est: il cancello con la freccia gialla, in fondo al paese, oltre il Rifugio.»"]], BG.P), () => {
        F.set("bianca_in", true); X.lanAdd("vl_bianca"); note(k === 2 ? "Bianca Rovedo gioca con noi. Le ho promesso una cabina nuova. Non so come." : k === 3 ? "Bianca Rovedo gioca con noi. L'ho sfidata e mi ha risposto con una rampa in nove secondi." : "Bianca Rovedo, meccanica, gioca con noi.");
        if (has("kit_done")) setStep(N, 3); done();
      });
    }
    function biancaDopo() {
      const k = F.get("bianca", 1), s = S();
      const L1 = s >= 8 ? ["La cabina tre, stanotte, ha fatto il suo rumore. Poi si è fermata di colpo, come quando ascolta.", "Ho smontato tutto: nessun difetto. Ma continua a fare quel rumore. Ho cominciato a pensare che non sia un difetto, ma una frase."]
        : s >= 5 ? ["Fosco ha la faccia di chi sa qualcosa. E quando Fosco ha quella faccia, si ritira nel magazzino e lucida cose che sono già lucide.", "Qualunque cosa sia, io sono nella tua squadra. Anche se è una squadra di sei, più un fantasma."]
          : [k === 2 ? "Mi devi una cabina. Non ho dimenticato." : k === 3 ? "Dieci minuti, hai detto. Vediamo chi respira per primo." : "Pronta. Per le gambe, per le chiavi e per i guai."];
      say(sw([["vl_bianca", chip(L1)]], BG.C), done);
    }

    // ---- Agata
    function agata() {
      F.set("agata_met", true);
      const s = S();
      if (!has("agata_visto")) {
        return say(sw([
          ["vl_agata", "Non camminare sulla linea di fondo: è sospesa su venti metri di niente. Ho misurato."],
          ["vl_agata", "Agata Sassi, geologa. Studio la lumina: la pietra della miniera. Brilla da sola da duecento milioni di anni e, da ventisei anni, un po' di più."],
          ["vl_agata", "Il terreno qui vibra. Sempre alla stessa ora: alle diciotto e quarantatré."],
          ["hero", "Vibra… come un fischio?"], ["vl_agata", "Come un fischio che nessuno ha ancora finito di fare."],
        ], BG.C), () => ask("voce", "Agata ti porge una bussola con un ago turchese.", [
          { label: "Accetta la bussola di lumina", sub: "L'ago segue la luce, non il nord", fn: () => { F.set("agata_visto", true); F.set("compass", true); X.lanAdd("vl_agata"); note("Agata Sassi mi ha dato una bussola di lumina. L'ago segue la luce, non il nord."); say(sw([["vl_agata", "Nel Latte può servire. Oppure può portarti dove non vuoi. Quando ti mostra una strada comoda, comincia a sospettare."]], BG.C), done); } },
          { label: "«Grazie, non mi serve»", sub: "Meglio fidarsi di sé", fn: () => { F.set("agata_visto", true); F.set("compass", false); note("Ho rifiutato la bussola di lumina di Agata."); say(sw([["vl_agata", "Fidarsi di sé è una virtù. Anche misurarsi, però. La bussola resta qui, nel caso cambiassi idea."]], BG.C), done); } },
        ], BG.C));
      }
      const L1 = s >= 6 ? ["Stanotte il terreno non ha vibrato. Ha parlato. In ventisei anni di misure, non era mai successo.", "Se la lumina è un registratore, qualcuno ha premuto «play»."]
        : ["Ho calcolato che il pallone, calciato a quaranta metri, impiega tre secondi per tornare dal Latte. Non spiego perché. Registro.", "Le schegge che trovi in giro sono lumina caduta dalle vene. Non metterle sotto il cuscino: la prima volta ho dormito poco.", "I Camosci tirano da sinistra. Per statistica e per sconforto."];
      ask("vl_agata", "«Il terreno, oggi, ha un umore strano.»", [
        { label: "Chiedi della lumina", fn: () => say(sw([["vl_agata", chip(L1)]], BG.C), done) },
        ...(F.get("compass", null) === false ? [{ label: "Chiedi la bussola", sub: "Hai cambiato idea", fn: () => { F.set("compass", true); X.lanAdd("vl_agata"); note("Alla fine ho preso la bussola di lumina di Agata."); say(sw([["vl_agata", "Sapevo che l'avresti presa. Gli scettici sono i miei clienti migliori."]], BG.C), done); } }] : []),
      ], BG.C);
    }

    // ---- Cornelio e la partita
    function cornelio() {
      const s = S();
      if (s < 3) return say(sw([["vl_cornelio", "Cittadino! Un attimo di pazienza: il discorso non è ancora pronto. Sono in quarta stesura."]], BG.C), done);
      F.set("cornelio_met", true);
      if (s === 3) {
        return say(sw([
          ["voce", "Il sindaco Cornelio Brumasecca sale sul palco e comincia a parlare. Il discorso dura sette minuti. Ne dice due."],
          ["vl_cornelio", "Cittadini! Stambecchi! Camosci! Turisti — se ce ne sono — e gabbiani, che sono qui per i resti! Vallombra è una comunità che guarda avanti, indietro, di lato e, con le dovute precauzioni, in basso."],
          ["vl_cornelio", "Per ragioni di orario, e per rispetto dei regolamenti, il fischio finale sarà alle diciotto e quarantatré. Come da tradizione."],
          ["voce", "Al «diciotto e quarantatré» il sindaco si ferma mezzo secondo di troppo. Poi riparte con una frase sul turismo."],
          ["vl_gisella", "Tradizione? Hanno una tradizione di perdere!"], ["vl_cornelio", "Ordine, signorina Cima! Un'ammonizione verbale: l'ho appena data."],
          ["vl_cornelio", "Ecco il nuovo numero {num}! Gradita presenza! Il Comune la ringrazia, e così il gabbiano."],
        ], BG.C), preMatch);
      }
      const L1 = s >= 8 ? ["Stanotte non ho dormito. Ho guardato la funivia dalla finestra fino all'alba. Non dirlo a nessuno. Tantomeno a Teodora.", "C'è una cosa che il sindaco deve a questo paese. Non so ancora quanto. Ma ho cominciato a fare i conti."]
        : ["Il pubblico di oggi: due Camosci, un gabbiano, Mirtilla in lontananza e io. Un'affluenza record.", "Una cosa che il sindaco non dice nei discorsi: ogni sera, alle 18:43, faccio un passo indietro dal palco. Per ragioni di sicurezza. Del palco."];
      ask("vl_cornelio", "«Possiamo ripetere la partita di presentazione, se il pubblico lo chiede. Il pubblico, al momento, sono io.»", [
        { label: "Chiedi del sindaco", fn: () => say(sw([["vl_cornelio", chip(L1)]], BG.C), done) },
        { label: "Rigiocare la partita", sub: "Amichevole contro i Camosci", fn: () => preMatch(true) },
      ], BG.C);
    }
    function preMatch(friendly) {
      const k = F.get("remo", 1);
      const pre = k === 2 ? [["vl_remo", "Ricordati la scommessa, {n}. Gli occhiali sono pronti a partire. Ma quel «{tiro}» dovrà essere sul serio {tipo}."]] : k === 3 ? [["vl_remo", "Parlano tanto di quel «{tiro}». Io preferisco i fatti. E la nebbia."]] : [["vl_remo", "Allora, {n}: fammi vedere quel «{tiro}» di cui parla il nome. Ho gli occhiali apposta."]];
      say(sw([...(friendly === true ? [] : pre), ["vl_bianca", "Se suona la cabina tre, mi fermo. Per il resto, palla a me e sparisci."], ["voce", "Fischio d'inizio: dietro le porte c'è il Latte, e il pallone, se va lungo, torna da solo."]], BG.C), () => matchOne(friendly === true));
    }
    function matchOne(friendly) {
      X.playMatch({
        id: "vl1", alt: "az", azPitch: "erba", chap: "Vallombra · Il Campo Sospeso", mate: "Bianca",
        intro: "Partita di presentazione al Campo Sospeso contro <em>i Camosci di Cima Alta</em>, un tempo solo. Dietro le porte c'è il Latte: se il pallone va lungo, torna da solo. Bianca gioca con te e controlla la cabina tre con un orecchio.",
        team: (t, s) => ({ vs: "i Camosci di Cima Alta", name: "Camosci di Cima Alta", color: "#c8e82a", defs: [["Gisella Cima", t(s.drib * 0.74)], ["Il Bufalo", t(s.drib * 0.8)], ["Tonio Fiocco", t(s.drib * 0.78)]], atk: [["Remo Valanga", t(s.tiro * 0.86)], ["Gisella Cima", t(s.tiro * 0.72)]], gk: ["Tonio Fiocco", t(s.tiro * 0.92)], power: t(s.tiro * 0.74), special: ["VALANGA DI CIMA ALTA", t(s.tiro * 1.08)] }),
        done: (r) => matchFine(r, friendly),
      });
    }
    function matchFine(r, friendly) {
      F.set("m1_a", r.a); F.set("m1_b", r.b);
      const first = !has("m1_played");
      if (friendly && !first) {
        const msg = r.win ? reward("vl_m1_win", { coins: 10 }) : [];
        return X.say(sw([["voce", `Amichevole finita ${r.a}–${r.b}.${msg.length ? " " + msg.join(" · ") + "." : ""}`], ["vl_remo", r.win ? "Un'altra? Va bene. Mi sto abituando a perdere. Non dirlo ai miei." : "Rivincita finita. Sono ancora il re della terrazza. Ma ho sentito il campo respirare."]], BG.C), done);
      }
      F.set("m1_played", true); F.set("m1_win", r.win);
      const rw = [...reward("vl_m1_cos", { cos: "vl_stambecchi" }), ...(r.win ? reward("vl_m1_win", { coins: 10 }) : [])];
      const k = F.get("remo", 1), bet = has("remo_bet"), b = F.get("bianca", 1);
      const L1 = r.win ? [
        ["voce", `Finisce ${r.a}–${r.b}.`],
        ["vl_cornelio", "VITTORIA! Storica! Dopo ventisei… ventisette partite senza vittorie, una partita di presentazione vinta! Metto a verbale! Anzi, no, il verbale è chiuso: lo scrivo a penna sul palco!"],
        ...(bet ? [["voce", "Remo si toglie gli occhiali da sole. Ha gli occhi arrossati dalla nebbia."], ["vl_remo", "Allergia. Alla nebbia. Ai discorsi del sindaco. A te. Ma un patto è un patto."], ["vl_remo", "Giù gli occhiali, {n}. Ma domani li metto di nuovo, e tu non dici niente."]] : k === 3 ? [["vl_remo", "Fortuna. Il Campo Sospeso porta fortuna ai sospesi."]] : [["vl_remo", "Bel tiro, {n}. Alla prossima c'è la Coppa vera: lì non ci sono i discorsi del sindaco a salvarvi."]]),
      ] : [
        ["voce", `Finisce ${r.a}–${r.b}.`],
        ["vl_cornelio", "Una sconfitta onorevole! Il Comune ha già stampato il comunicato: contiene la parola «onorevole» in grassetto."],
        ...(k === 3 ? [["vl_remo", "Come previsto: il campo parla chiaro. A volte ha la voce di un Camoscio."]] : bet ? [["vl_remo", "Gli occhiali restano dove sono. Ma quel «{tiro}» mi ha fatto spostare le lenti sulla fronte, e te lo concedo."]] : [["vl_remo", "Non male, per un nuovo. Domani, se vuoi, rivincita: ti aspetto sul prato, con gli occhiali sulla fronte."]]),
        ["vl_bianca", b === 2 ? "Mi devi ancora una cabina, ricordi? Non perdere la testa per questo." : b === 3 ? "Dieci minuti li ho retti. Ora respiro mezz'ora." : "Contano le gambe, non i discorsi. Domani ci prendiamo il resto."],
      ];
      note(r.win ? `Partita di presentazione vinta ${r.a}–${r.b} sui Camosci.` : `Partita di presentazione persa ${r.a}–${r.b}, ma con onore.`);
      setStep(N, 5);
      X.say(sw([...L1, ...(rw.length ? [["voce", rw.join(" · ") + "."]] : []),
        ["voce", "Il Campo si svuota. Il Latte sale di un metro, come ogni sera, e comincia a prendersi i lampioni uno per uno."],
        ["vl_bianca", "Fosco chiedeva di te, prima. Aveva la faccia di quando sa qualcosa. Vai al magazzino, io finisco con la cabina."]], BG.C), done);
    }

    // ---- Remo, Tonio, Gisella
    function remo() {
      const s = S(), k = F.get("remo", 1);
      F.set("remo_met", true);
      if (s === 2) return say(sw([["vl_remo", k === 3 ? "Ancora senza squadra? Ti consiglio gli occhiali da sole. Aiutano con l'imbarazzo." : "Ancora a preparare la squadra? Prenditela comoda. Io intanto mi alleno a vincere."]], BG.C), done);
      if (s === 3) return say(sw([["vl_remo", "Allora? Il sindaco ha ancora una pagina di discorso. Quando ha finito, si comincia."]], BG.C), done);
      const opts = [{ label: "Rigiocare la partita", sub: "Amichevole contro i Camosci", fn: () => preMatch(true) }, { label: "Parla con Remo", fn: () => say(sw([["vl_remo", s >= 8 ? "Qualcosa è successo, stanotte. Il Latte ha fatto un rumore che non gli avevo mai sentito. Non dirlo a nessuno: nemmeno ai miei. Sono dei Camosci, ma non sono stupidi." : chip(["Sai perché ho cominciato a giocare con gli occhiali? Perché da bambino un gabbiano mi ha rubato un panino e io l'ho guardato negli occhi. Lui ha vinto. Da allora proteggo i miei.", "Cima Alta è a due ore da qui. Ci vengo volentieri. Il campo è sospeso, la gente è strana, la cioccolata è buona. Ma non lo ripetere."])]], BG.C), done) }];
      ask("vl_remo", "«Sempre in giro, {n}? Meglio così: i campioni si vedono dal passo.»", opts, BG.C);
    }
    function tonio() { say(sw([["vl_tonio", chip(["Sono il portiere dei Camosci. Il mio lavoro è stare fermo e sembrare una porta più piccola.", "Il pallone torna sempre, dal Latte. Mi hanno detto che è un effetto della lumina. Io credo solo che sia educato.", "Remo dice che sono il suo portiere. Io dico che sono il suo parafulmine."])]], BG.C), done); }
    function gisella() { say(sw([["vl_gisella", chip(["Tifo Camosci anche quando perdiamo. Soprattutto quando perdiamo: è lì che ci vuole stile.", "Il sindaco ha parlato sette minuti, ha detto due cose. Io le ho contate: una era «tradizione».", "Cima Alta e Vallombra si odiano da ventisei anni. Prima ci volevamo bene. Poi è successa una cosa, e ora ci odiamo per rispetto."])]], BG.C), done); }

    // ---- la foto (notte)
    function foto() {
      F.set("fosco_met", true);
      const nome = hero() ? hero().name : "?", num = hero() ? hero().num : 9;
      say(sw([
        ["vl_fosco", "Siediti. Questa non la mostro nemmeno al sindaco. Soprattutto al sindaco."],
        ["voce", "Fosco toglie un panno da una cornice. La fotografia è color seppia, con le pieghe del tempo e un bordo che sa di cantina."],
      ], BG.I), () => { X.setFoto({ num, name: nome }); say(sw([
        ["vl_fosco", "La Squadra del 6:43. Undici in campo e uno in panchina, il giorno della finale di ventisei anni fa. Poi la miniera, poi il Crollo, poi più niente. La squadra si dissolse quella notte. Chi dice che sono scappati, chi dice che si sono vergognati. Chi dice… la nebbia."],
        ["vl_fosco", "Guarda il quarto da sinistra, in fila dietro."],
        ["voce", "Il quarto giocatore ha la faccia sbiadita, come cancellata da un pollice. Sulla maglia c'è il numero {num}. Sotto la fotografia, una riga di inchiostro verde ancora umido di luce: «N. {num} · {n}»."],
        ["hero", "…È il mio nome."],
        ["vl_fosco", "Ieri sera quella riga non c'era. C'era un vuoto. L'ho guardato per ventisei anni."],
        ["vl_fosco", "Il Lampionaio mi ha riportato la cornice il mese scorso. Dice che ora era in ordine."],
        ["hero", "Il Lampionaio?"],
        ["vl_fosco", "Quello che accende i lampioni del sentiero, sopra il campo. Nessuno sa chi paghi l'olio. Nessuno l'ha mai visto in faccia. Teodora dice che la lanterna arriva sempre prima di lui."],
      ], BG.F), () => ask("voce", "Cosa fai di questo segreto?", [
        { label: "«Per ora teniamolo tra noi.»", sub: "Silenzio", fn: () => foto2("segreto") },
        { label: "«Devo dirlo a Teodora. Lei conosce gli orari.»", sub: "Teodora", fn: () => foto2("teodora") },
        { label: "«Chiediamo a Mirtilla: sa tutto del paese.»", sub: "Mirtilla", fn: () => foto2("mirtilla") },
      ], BG.F)); });
    }
    function foto2(w) {
      F.set("told", w);
      const a = w === "segreto" ? [["vl_fosco", "Parli come chi sa quanto pesa un segreto. Bene."]] : w === "teodora" ? [["vl_fosco", "Teodora lo sa già, in un certo modo. Ma sentirselo dire da te le farà un altro effetto."]] : [["vl_fosco", "Mirtilla? Domani lo sapranno anche i gabbiani. Ma almeno lo sapranno con una cioccolata in mano."]];
      note(w === "segreto" ? "Nella fotografia del 1998 c'è il mio nome, scritto con inchiostro di lumina. Non l'ho detto a nessuno." : w === "teodora" ? "Nella fotografia del 1998 c'è il mio nome, in inchiostro di lumina. Lo dirò a Teodora." : "Nella fotografia del 1998 c'è il mio nome, in inchiostro di lumina. Mirtilla lo sa già.");
      say(sw([...a, ["vl_fosco", "Una cosa: Teodora ha mandato a dire che vuole vederti. Nell'ufficio della stazione. Dice che il registro «ha una novità». Dice la parola «novità» come si dice «temporale»."]], BG.I), () => { setStep(N, 6); done(); });
    }

    // ---- il registro di Teodora
    function teodoraRegistro() {
      F.set("teodora_met", true);
      const told = F.get("told", "segreto");
      const t0 = told === "teodora" ? "Mi hai detto quello che hai visto nella fotografia. Hai fatto bene: pochi, quassù, sanno tenere una verità senza ripeterla." : told === "mirtilla" ? "Mirtilla è passata a dire «niente di niente» con una faccia che diceva tutto. Quindi lo so." : "Mi hai tenuta fuori, immagino per delicatezza. Lo apprezzo. Poco, ma lo apprezzo.";
      say(sw([
        ["voce", "L'ufficio della stazione: una stanza con un orologio fermo, un bollitore e un registro lungo e stretto, tenuto come una reliquia."],
        ["vl_teodora", t0],
        ["vl_teodora", "Ti faccio vedere questo. Il registro delle corse."],
        ["voce", "L'ultima riga di ventisei anni fa dice: «18:43 · corsa speciale · la squadra · NON ARRIVATA»."],
        ["vl_teodora", "Poi nulla. Righe vuote per ventisei anni. E stasera, qui sotto, con la mia calligrafia, ma io non l'ho scritto: «18:43 · una persona · ARRIVATA»."],
        ["hero", "La cabina non l'ha guidata nessuno."],
        ["vl_teodora", "Lo so. L'ho vista partire da sola, ogni sera, dal Crollo. Scende alle 18:20, sale alle 18:43, vuota. Io metto il lucchetto. Il lucchetto, la mattina, è aperto."],
        ["vl_teodora", "Stasera, per la prima volta in ventisei anni, non è salita vuota."],
      ], BG.I), () => ask("voce", "Cosa proponi a Teodora?", [
        { label: "«Chiudiamo la funivia stanotte.»", sub: "Prudenza", fn: () => teodora2("chiusa") },
        { label: "«Teniamola aperta. Voglio sapere chi ci sale.»", sub: "Curiosità", fn: () => teodora2("aperta") },
      ], BG.I));
    }
    function teodora2(w) {
      F.set("funivia", w);
      const a = w === "chiusa" ? [["vl_teodora", "Ho chiuso la funivia due volte, in ventisei anni. Entrambe le volte la cabina è partita lo stesso. Ma stanotte, la chiudo io. Con tutti i lucchetti."]] : [["vl_teodora", "Sapevo che l'avresti detto. L'ultimo che l'ha detto era mio fratello Aurelio. Era il capitano."], ["voce", "Teodora non aggiunge altro. Per un attimo guarda l'orologio fermo, poi l'ordine delle penne sul tavolo."]];
      note(w === "chiusa" ? "Ho proposto di chiudere la funivia, per stanotte." : "Ho voluto lasciare la funivia aperta. Teodora ha un fratello, Aurelio, che era il capitano della Squadra del 6:43.");
      if (w === "chiusa") F.set("fratello", false); else F.set("fratello", true);
      say(sw([...a, ["vl_teodora", "Il sentiero dei Lampioni parte dal Campo, dal cancello in alto a destra. Stasera i lampioni sono accesi, e di solito non lo sono. Vai a vedere. Prendi una torcia." + (has("compass") ? " Hai la bussola di Agata? Tienila in tasca." : "")], ["vl_teodora", "E non seguire l'ago, se te lo mostra. Gli aghi, nel Latte, fanno quello che vogliono."]], BG.I), () => { X.lanAdd("vl_teodora"); setStep(N, 7); done(); });
    }

    // ---- il Lampionaio: la fine del capitolo
    function lampionaio() {
      const asked = F.get("lamp_q", 0);
      if (asked === 0) {
        return say(sw([
          ["voce", "Alla fine del sentiero, una figura regge una lanterna alta. Porta un cappotto lungo, un berretto da fabbro e, sul braccio, una fascia da capitano sbiadita. Il volto resta nella parte dell'ombra, come se la luce non avesse il permesso."],
          ["voce", "Non parla. Solleva una piccola lavagna di lumina e vi scrive col gesso, lettera per lettera: «TI ASPETTAVAMO ALLE 18:43.»"],
        ], BG.M), lampQ);
      }
      lampQ();
    }
    function lampQ() {
      const q = F.get("lamp_q", 0), got = (k) => (q & k) !== 0;
      const opts = [
        { label: "«Chi sei?»", fn: () => lampA(1, "UNO CHE ACCENDE.") },
        { label: "«Dov'è la squadra?»", fn: () => lampA(2, "IN CAMPO. LA PARTITA NON È FINITA.") },
        { label: "«Cosa vuoi da me?»", fn: () => lampA(4, "UN MINUTO.") },
      ].map((o, i) => (got(1 << i) ? Object.assign(o, { sub: "Già chiesto" }) : o));
      if (q) opts.push({ label: "Basta domande", sub: "Guardi la lanterna", cls: "hot", fn: lampFine });
      ask("voce", "La lanterna si muove appena. Il gesso aspetta.", opts, BG.M);
    }
    function lampA(bit, txt) {
      F.set("lamp_q", (F.get("lamp_q", 0) | bit));
      say(sw([["voce", `Il gesso scrive: «${txt}»`]], BG.M), lampQ);
    }
    function lampFine() {
      say(sw([
        ["voce", "La lavagna si cancella sotto il pollice del Lampionaio. Poi, con una grafia più lenta: «MANCA UN MINUTO.»"],
        ["voce", "Sotto il sentiero il Latte si illumina da dentro, di un turchese che respira. Ne sale un suono lontano: un pubblico che ride, che canta, che trattiene il fiato. E un fischio. Lungo, solo a metà, come se l'arbitro avesse smesso di soffiare ma non di volerlo."],
      ], BG.M), () => ask("voce", "Cosa fai?", [
        { label: "Segui la lanterna nel Latte", sub: "Un passo oltre il parapetto", fn: () => lampSce(1) },
        { label: "Aspetti il mattino", sub: "Resti sul sentiero", fn: () => lampSce(0) },
      ], BG.M));
    }
    function lampSce(k) {
      F.set("latte", k);
      const a = k ? [["voce", "Fai un passo verso il bordo. Il Lampionaio ti mette un braccio davanti, con una dolcezza da maestro. Sulla lavagna: «NON ANCORA.»"]] : [["voce", "Rimani dove sei, con le mani nelle tasche e il fiato corto. Il Lampionaio annuisce una sola volta. Sulla lavagna: «BRAVO. DOMANI NON SARÀ PIÙ SEMPLICE.»"]];
      say(sw([...a, ["voce", "La figura arretra nel Latte con la lanterna alta. I lampioni, uno dopo l'altro, si spengono verso il basso, come se qualcuno stesse scendendo una scala. Dove stava, resta un'ultima scheggia di lumina."],
        ["vl_noemi", "…Radio Nebbia, qui Noemi. Ripeto la segnalazione, perché la ripeto da due minuti e continuo a non crederci: alle 18:43 è stato letto il nome «{n}». Meteo: nebbia. Chi ascolta, risponda."]], BG.M), fineCapitolo);
    }
    function fineCapitolo() {
      X.finishChapter(N, "sospeso"); setStep(N, 8); note("Il Lampionaio mi ha detto: MANCA UN MINUTO. Il Latte ha cominciato a rispondere.");
      const rw = reward("vl_ch1", { coins: 40, cos: "vl_sessantatre" });
      X.say(sw([["voce", "CAPITOLO 1 · LA CORSA DELLE 6:43 · CONCLUSO"], ["voce", (rw.length ? rw.join(" · ") + ". " : "") + "Il Latte ha cominciato a rispondere. Il Capitolo 2 non è ancora pronto: nel frattempo puoi girare per Vallombra, raccogliere le ultime schegge e parlare con tutti."]], BG.M), () => { go("vl_paese", 12, 21); });
    }

    // ---- oggetti
    const flav = (lines, bg) => () => say(sw([["voce", chip(lines)]], bg || BG.P), done);
    const obj = {
      n: () => { const zr = X.api.trZone(); return zr === "vl_miniera" ? say(sw([["voce", "Un avviso di latta, arrugginito agli angoli: «PERICOLO DI CROLLO. ACCESSO VIETATO. (dal 1998)». Sotto, a gesso nuovo: «le assi sono chiuse da fuori. La luce, da dentro.»"]], BG.M), done) : say(sw([["voce", S() >= 6 ? "Orario della funivia: «Discesa 18:20 · Salita 18:43». L'ultima riga è cancellata e riscritta, con un'altra grafia: «Salita 18:43 (sempre)»." : "Orario della funivia: «Discesa 18:20 · Salita 18:43». Un foglio in basso avverte: «La puntualità è un modo di volersi bene.»"]], BG.P), done); },
      k: () => say(sw([["voce", S() >= 6 ? "La cabina numero sei: fredda come la roccia, con un tintinnio basso del cavo che somiglia a una parola. Dentro, sul sedile, c'è una brina che disegna un numero: il {num}." : "Una cabina rossa agganciata al cavo. Dentro, i sedili sono ancora tiepidi, come se qualcuno si fosse appena alzato. Sul vetro, un alito appannato."]], BG.P), done),
      F: flav(["La fontana brilla da sola, di un turchese tranquillo. Fosco dice che si beve. Agata dice di no. Mirtilla dice che si paga.", "L'acqua della fontana va su e giù a un ritmo che somiglia a un respiro. Se ci metti l'orecchio, senti un lontano pubblico.", "Sul bordo qualcuno ha inciso: «Non fidarti di chi ti dice che è solo nebbia»."]),
      "vl_campo:x": flav(["Casse di legno con scritto «CAMOSCI · NON TOCCARE». Dentro, a giudicare dal rumore, ci sono divise e un panino."], BG.C),
      x: flav(["Un tavolino con due tazze vuote e una macchia che sembra la cartina del Trentino.", "Un tavolo con una tovaglia a quadri e un cartello: «Riservato ai pessimisti (sconto del 10%)»."]),
      u: () => say(sw([["voce", "Il Rifugio Tre Tazze: un camino, otto sgabelli, una lavagna con le nebbie del giorno e un gatto che osserva tutti con una perplessità definitiva. Mirtilla è fuori, in terrazza."]], BG.I), done),
      m: () => say(sw([["voce", S() >= 5 ? "La porta del magazzino è accostata. Da dentro filtra la luce calda di una lampada e un odore di cera: Fosco sta aspettando." : "La porta del magazzino degli Stambecchi: legno scurito, vernice sbiadita, un lucchetto che non chiude. Fosco dice che serve a dare dignità."]], BG.I), done),
      v: () => say(sw([["voce", "L'ufficio della stazione. Sulla porta, un cartello: «Si prega di non confondere il ritardo con la fantasia». Sotto, a matita: «Teodora».", BG.P]], BG.P), done),
      q: () => { const s = S(); say(sw([["voce", "La casetta di Radio Nebbia: un microfono grande come un frutto, una tazza di Mirtilla e un altoparlante che grattugia le onde."], s >= 6 ? ["vl_noemi", "…Meteo: nebbia. Oggi alle 18:43 il Latte ha emesso un suono. Chi sa di che nota si tratta, scriva al giornale radio. Chi non lo sa, scriva comunque."] : ["vl_noemi", chip(["Radio Nebbia, qui Noemi. Meteo: nebbia, con possibilità di nebbia. Domani: schiarite di nebbia.", "Il giornale radio di oggi: nessuna novità. Il Latte è salito di un metro. Il sindaco ha parlato. In ordine di importanza.", "È tempo di una canzone. Questa è dedicata a chi sa dove va. Ripeto: dedicata. Non per voi."])]], BG.I), done); },
      w: flav(["Gli spogliatoi: una baracca di legno che cigola in due note. Dentro, ganci, panche e un'aria di sconfitte rispettabili.", "Sul muro dello spogliatoio, a pennarello: «Chi perde offre. Chi vince offre di più.» Lo ha scritto Fosco, nel '97."], BG.C),
      o: flav(["Il palco del sindaco: quattro assi, un microfono e un leggio con un discorso di sette pagine di cui si usano due.", "Dietro il palco c'è una scatola con scritto «Discorsi di riserva». Contiene sempre lo stesso discorso."], BG.C),
      z: () => say(sw([["voce", "Il banco di Agata: bussole, lenti, sacchetti di campioni e un quaderno pieno di numeri. Uno, a margine, è cerchiato tre volte: 18:43."]], BG.C), done),
      j: flav(["La gradinata: trentadue posti, ventisei prenotati dal sindaco.", "I gradoni di legno blu e ambra sono caldi: qualcuno si è alzato un momento fa. Nessuno si è alzato."], BG.C),
      X: () => say(sw([["voce", S() >= 7 ? "Le assi dell'imbocco sono inchiodate da fuori. Ma i chiodi sono arrugginiti dalla parte sbagliata: come se fossero stati piantati da dentro." : "L'imbocco è chiuso da assi inchiodate. Dalle fessure filtra una luce turchese che si alza e si abbassa, come un respiro."]], BG.M), done),
      C: flav(["Un cristallo di lumina grande come un pugno. Brilla senza chiedere il permesso a nessuno. Se lo tocchi, senti un fischio lontano.", "La lumina è tiepida. Hai la sensazione che, se ti appoggiassi, qualcuno dall'altra parte appoggerebbe a sua volta."], BG.M),
      ">": () => go("vl_campo", 2, 10),
      "<": () => { const z = X.api.trZone(); return z === "vl_campo" ? go("vl_paese", 38, 12) : go("vl_campo", 31, 4); },
      "^": () => { if (S() < 7) return say(sw([["voce", "Il cancello del sentiero dei Lampioni è chiuso con una catena e un cartello: «Si apre al calar della notte. O quando Teodora lo decide.»"]], BG.C), done); go("vl_miniera", 2, 11); },
    };
    const talk = { vl_teodora: teodora, vl_mirtilla: mirtilla, vl_fosco: fosco, vl_bianca: bianca, vl_agata: agata, vl_cornelio: cornelio, vl_remo: remo, vl_tonio: tonio, vl_gisella: gisella, vl_lampionaio: lampionaio };

    return {
      n: N, title: "La Corsa delle 6:43", sub: "Arrivo a Vallombra, i Camosci e un nome che non dovrebbe essere lì", start: "vl_paese", zones, talk, obj, goal, mood,
      news: (id, s) => {
        if (id === "vl_teodora") return s === 0 || s === 6;
        if (id === "vl_mirtilla") return s === 1;
        if (id === "vl_fosco") return (s >= 2 && s < 5 && !has("kit_done")) || s === 5;
        if (id === "vl_bianca") return s >= 2 && !has("bianca_in");
        if (id === "vl_agata") return s >= 2 && !has("agata_visto");
        if (id === "vl_cornelio") return s === 3;
        if (id === "vl_remo") return s === 3;
        if (id === "vl_lampionaio") return s === 7;
        return false;
      },
      intro: () => [
        ["voce", "Il Latte arriva fino ai finestrini: bianco, fermo, con l'aria di chi ascolta. L'ultima cabina della funivia sale verso Vallombra con un cigolio da orchestra di provincia.", BG.P],
        ["voce", "In tasca hai una lettera di carta ruvida: «Cercasi numero {num} per la Coppa dei Tre Versanti. Vitto: cioccolata. Alloggio: dipende. Firmato: gli Stambecchi (quel che ne resta)». Nessun indirizzo di ritorno. A pensarci, nessun mittente.", BG.P],
        ["voce", "La cabina si ferma. Le porte si aprono da sole, con un po' di scena.", BG.P],
      ],
    };
  });

  // ================================================================== CAPITOLO 2 · IL LATTE
  // Nuove zone: la discesa del sentiero dei Lampioni (tornanti sopra il Latte), il Latte camminabile (nebbia a tessere che si schiudono,
  // tre Ancore da accendere) e gli spogliatoi. Ritocca anche il paese, il Campo e l'Imbocco del capitolo 1 (patch).
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, once, reward, hero, esc } = X;
    const N = 2, S = () => X.stepOf(N), has = (k) => F.is(k);
    const BG = { P: "vl_paese", C: "vl_campo", M: "vl_miniera", I: "vl_interno", L: "vl_latte", S: "vl_spogliatoi", F: "vl_foto" };
    const sw = (lines, bg) => lines.map((l) => (l.length > 2 ? l : [l[0], l[1], bg]));
    const chip = (a) => a[Math.floor(Math.random() * a.length)];
    const tono = () => F.get("tono", "ironico");
    const tl = (o) => ["hero", o[tono()] || o.ironico || o.sicuro];
    const zoneNow = () => X.api.trZone();
    const remoId = () => (has("remo_bet") && has("m1_win") ? "vl_remo_ns" : "vl_remo");
    const remoHelps = () => has("remo_help") || has("remo_pent");
    const anc = () => (has("anc1") ? 1 : 0) + (has("anc2") ? 1 : 0) + (has("anc3") ? 1 : 0);

    // ---- personaggi nuovi
    const cast = (id, name, o, bio) => X.cast(id, Object.assign({ name }, o), bio);
    cast("vl_ettore", "Ettore Brina", { tag: "", hair: "#3a2a1a", style: "slick", skin: "#e8bf98", bg: ["#2a2f48", "#ffd23f"], glasses: true, shirt: "#4a6a3a" }, "Cacciatore di misteri per il canale «Brividi d'Alta Quota»: 41 iscritti, 40 dei quali sua madre. Indossa un gilet con diciannove tasche e un'espressione che dice «lo sapevo».");
    cast("vl_viola", "Viola Brina", { tag: "", hair: "#d4502a", style: "long", skin: "#f2cfae", bg: ["#2a2f48", "#7fe3d0"], shirt: "#2a3a6a" }, "Sorella e operatrice di Ettore. Filma sempre la cosa sbagliata, quasi sempre per sbaglio, e quasi sempre è più interessante.");
    cast("vl_rosalba", "Rosalba Tana", { tag: "", hair: "#6a4a2a", style: "codino", skin: "#d9a57a", bg: ["#3a2a1a", "#c8a05a"], shirt: "#9a7a4a" }, "Capitana delle Marmotte di Valle Fonda. Dorme in panchina, si sveglia al fischio e segna al primo tiro. Dice che è una tattica. È una tattica.");
    cast("vl_remo_ns", "Remo Valanga", { tag: "blue", hair: "#0f0f0f", style: "cresta", skin: "#c98f63", bg: ["#c8ff2a", "#2a2a2a"], shirt: "#d6f23a" }, "Capitano dei Camosci di Cima Alta. Da quando ha perso la scommessa, gli occhiali da sole li porta in tasca. Dice che si vede tutto più nitido, e questo lo preoccupa.");
    X.lanDef("vl_noemi", { name: "Noemi Etere", role: "La voce di Radio Nebbia", met: "noemi_met" });
    X.lanDef("vl_cornelio", { name: "Cornelio Brumasecca", role: "Il sindaco · il dodicesimo", met: "cornelio_met" });
    X.cos("vl_marmotta", { kind: "acc", label: "Sciarpa delle Marmotte", val: "#8a6a3a", from: "Gioca la prima partita ufficiale della Coppa" });
    X.cos("vl_stemma_latte", { kind: "acc", label: "Stemma del Latte", val: "#7fe3d0", from: "Concludi il capitolo 2 di Vallombra" });
    X.cos("vl_lilla", { kind: "hairc", label: "Capelli Lilla nebbia", val: "#b9a8e8", from: "Raccogli tutte le schegge di lumina sul sentiero in discesa" });
    X.cos("vl_fascia_nebbia", { kind: "acc", label: "Fascia della Nebbia", val: "#cfd3ea", from: "Raccogli tutte le schegge di lumina nel Latte" });

    const mood = (s) => (s >= 8 ? 2 : s >= 7 ? 1 : 0);

    // ---- obiettivi: sempre con la direzione (est/ovest/sopra/sotto) e che cosa cercare
    const goal = (s) => {
      const c = has("compass");
      if (s === 0) return "Parla con Mirtilla: Rifugio Tre Tazze, in ALTO a destra della fontana (NORD-EST), sulla terrazza.";
      if (s === 1) return "Parla con Noemi di Radio Nebbia: la casetta con l'antenna, in ALTO a sinistra della fontana.";
      if (s === 2) return "Vai al Campo Sospeso (cancello a EST, in fondo a destra) e parla con Agata, al banco in ALTO a destra.";
      if (s === 3) return remoBlocca() ? "Vai all'Imbocco: dal Campo cancello in ALTO a destra, poi tutto a EST. In fondo Remo blocca il passaggio: parlagli." : "Vai all'Imbocco: dal Campo cancello in ALTO a destra (NORD-EST), poi tutto a EST fino al cancello nuovo.";
      if (s === 4) return "Scendi i tornanti verso il BASSO, fino al cancello con la freccia in giù, in fondo a destra.";
      if (s === 5) {
        if (!has("anc1")) return "Prima Ancora: vai a EST nel corridoio di assi, fino alla lanterna di ferro." + (c ? " Segui i puntini." : " Bianca ti aspetta là.");
        if (!has("anc2")) return "Seconda Ancora: continua a EST, poi scendi a SUD fino alla grande piazza: la lanterna è al centro." + (c ? " Segui i puntini." : "");
        if (!has("anc3")) return "Terza Ancora: torna a OVEST per il corridoio basso, poi scendi a SUD fino all'isola: lanterna a sinistra." + (c ? " Segui i puntini." : "");
        return "Prendi il pallone al Dischetto, al centro dei cerchi sull'isola.";
      }
      if (s === 6) return "Parla con il sindaco Cornelio, sul palco in ALTO al centro del Campo: la partita sta per cominciare.";
      if (s === 7) return "Segui il sindaco agli SPOGLIATOI: capanna in ALTO a sinistra del Campo, porta in basso." + (needEttore() ? " Davanti alla porta c'è Ettore: parlagli." : "");
      if (s === 8) return "Parla con Cornelio: è sulla panca in fondo agli spogliatoi, a DESTRA.";
      if (s === 9) return "Vai all'Imbocco: dal Campo cancello in ALTO a destra (NORD-EST), poi al CENTRO, verso le assi: qualcuno bussa.";
      return "Capitolo concluso. Il Capitolo 3 comincia all'Imbocco: dal Campo cancello in ALTO a destra (NORD-EST), poi al CENTRO, verso le travi.";
    };
    function remoBlocca() { return F.get("remo", 1) === 3 && !has("remo_sab"); }
    function needEttore() { return F.get("told", "segreto") === "mirtilla" && !has("ettore_via"); }

    // ---- luoghi
    const GUIDE = { // percorsi della bussola, per tappa (coordinate in tessere)
      0: [[8, 3], [12, 3]],
      1: [[14, 3], [27, 3], [27, 12], [26, 14]],
      2: [[24, 16], [17, 16], [8, 16], [8, 20], [6, 21]],
      3: [[6, 22], [8, 22]],
    };
    const ring = () => { X.setTiles(8, 21, 10, 21, "p"); X.setTiles(8, 22, 8, 22, "p"); X.setTiles(10, 22, 10, 22, "p"); X.setTiles(8, 23, 10, 23, "p"); }; // apre il cerchio di nebbia intorno al Dischetto (il pallone resta al centro)
    const legNow = () => (!has("anc1") ? 0 : !has("anc2") ? 1 : !has("anc3") ? 2 : has("ball") ? -1 : 3);
    const ECHO = [
      "Un'onda di voci lontane: «Dai, Stambecchi! Dai, ragazzi!» Poi, più vicino: «Passa! PASSA!»",
      "Tamburi, o scarponi sulle assi di una gradinata. Qualcuno intona un coro: «Sei-quarantatré, sei-quarantatré…» e non lo finisce mai.",
      "Una radiolina gracchia la telecronaca: «…palla a Brinzi, Brinzi che… il pubblico è in piedi…». Poi il silenzio, preciso come un taglio.",
      "Una voce di donna, in lontananza: «Aurelio! La cena!» Una risata. Poi più niente.",
      "Il fischio di un arbitro, a metà: comincia, si ferma, ricomincia. Come se non decidesse quanto lungo.",
      "Un bambino di allora chiede al padre: «Papà, perché si sono tutti fermati?» Il padre non risponde. L'eco, per educazione, nemmeno.",
    ];
    const SIGNS = {
      "2,4": "Gesso sulla roccia, con una grafia alta e stretta: «PIÙ GIÙ.» Poi una freccia, che segue il sentiero.",
      "23,8": "Gesso su un palo: «A DESTRA NON SI PUÒ. A SINISTRA NEMMENO. SEGUI I LAMPIONI.»",
      "4,14": "Gesso, quasi cancellato dall'umido: «HAI ASPETTATO ABBASTANZA.» Sotto, a lettere più nuove: «ANCHE IO.»",
      "23,19": "Una lavagnetta appesa al cancello: «IL LATTE È FERMO PERCHÉ ASPETTA. NON FARLO ASPETTARE ANCORA.»",
    };

    const zones = {
      vl_discesa: {
        name: "Vallombra · La discesa dei Lampioni", short: "La discesa", sub: "Tornanti sopra il Latte", w: 28, h: 24, start: [2, 3], theme: "puntanera", bg: "vl_miniera",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_lilla", items: [[2, 6], [20, 14], [2, 20], [23, 20]],
        act: { n: "Leggi il gesso", "<": "Torna all'Imbocco", d: "Scendi verso il Latte", x: "Guarda le casse" },
        areas: [[1, 2, 24, 4, "Il tornante alto"], [22, 5, 24, 10, "La curva a destra"], [1, 5, 21, 8, "Il prato dei larici"], [3, 9, 24, 11, "Il secondo tornante"], [3, 12, 5, 17, "La scala di sasso"], [6, 12, 21, 15, "Il prato delle lanterne"], [3, 16, 24, 18, "Il terzo tornante"], [1, 19, 21, 21, "Il prato basso"], [22, 19, 24, 22, "La soglia del Latte"], [25, 0, 27, 23, "Il vuoto"]],
        hints: () => ({
          "Il tornante alto": "Il sentiero dei Lampioni scende a tornanti. I lampioni sono accesi, e la ringhiera, a destra, guarda solo nebbia.",
          "La curva a destra": "Il sentiero svolta a destra e prosegue verso il basso.",
          "Il prato dei larici": "Un prato alpino con larici d'ambra. L'erba è bagnata da una nebbia che sale.",
          "Il secondo tornante": "Il sentiero torna verso sinistra. Più giù, la nebbia sembra più vicina di quanto dovrebbe.",
          "La scala di sasso": "Una scala di sasso, scavata nella roccia, scende al tornante di sotto.",
          "Il prato delle lanterne": "Lanterne di ferro piantate nell'erba, spente. Nessuno le ha mai accese; nessuno le ha mai tolte.",
          "Il terzo tornante": "L'ultimo tornante: a destra, in fondo, il cancello verso il basso.",
          "Il prato basso": "L'erba qui è fradicia di Latte. Si sente un rumore da sala d'attesa.",
          "La soglia del Latte": "Il cancello verso il basso: oltre c'è il Latte, e il Latte, oggi, ti aspetta.",
          "Il vuoto": "Oltre la ringhiera non c'è niente: soltanto Latte, bianco e fermo.",
          "La discesa": "La discesa del sentiero dei Lampioni.",
        }),
        intro: [["voce", "Il sentiero dei Lampioni non finisce all'Imbocco: continua. Scende a tornanti lungo la roccia, e a ogni curva il Latte è un po' più vicino, come un animale grande che si abitua a te."]],
        npcs: (s) => {
          const o = [];
          if (F.get("told", "") === "mirtilla") o.push({ id: "vl_ettore", at: [12, 7] }, { id: "vl_viola", at: [15, 7] });
          if (s >= 4 && s <= 5) { if (F.get("remo", 1) !== 3) o.push({ id: remoId(), at: [18, 20] }, { id: "vl_tonio", at: [20, 20] }, { id: "vl_gisella", at: [16, 21] }); else if (has("remo_sab")) o.push({ id: remoId(), at: [18, 20] }); }
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 27, 23, "a");
          lay(1, 2, 24, 4, ":"); lay(22, 5, 24, 10, ":"); lay(3, 9, 24, 11, ":"); lay(3, 12, 5, 17, ":"); lay(3, 16, 24, 18, ":"); lay(22, 19, 24, 21, ":");
          lay(1, 5, 21, 8, '"'); lay(6, 12, 21, 15, '"'); lay(1, 19, 21, 21, '"');
          lay(26, 2, 27, 23, "f"); lay(0, 22, 27, 23, "f"); lay(25, 2, 25, 21, "r");
          [[4, 6], [9, 7], [17, 6], [20, 8], [8, 13], [14, 14], [19, 13], [5, 20], [11, 21], [19, 20], [2, 16], [1, 13]].forEach(([x, y]) => put(x, y, "t"));
          [[6, 3], [14, 3], [20, 4], [11, 10], [20, 10], [10, 17], [18, 17], [4, 11]].forEach(([x, y]) => put(x, y, "l"));
          [[2, 4], [23, 8], [4, 14], [23, 19]].forEach(([x, y]) => put(x, y, "n"));
          put(0, 3, "<"); put(0, 4, "<"); put(22, 22, "d"); put(23, 22, "d"); put(24, 22, "d");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          plaque(g, "SENTIERO DEI LAMPIONI · DISCESA", X_(12) + 8, Y_(1) + 4);
          for (let i = 0; i < 10; i++) { const x = ((i * 61 + fr * 0.25) % 380) - 20, y = ((i * 47 + Math.sin(fr / 60 + i) * 7) % 380) - 20; if (x > 0 && x < 320 && y > 0 && y < 200) R(g, x, y, 1, 1, "rgba(160,255,235,.5)"); }
          // le lanterne spente del prato
          [[9, 13], [15, 13], [12, 14]].forEach(([tx, ty]) => { const x = X_(tx) + 8, y = Y_(ty) + 8; if (onScr(x, y)) { R(g, x - 1, y - 6, 2, 10, "#2e3446"); R(g, x - 3, y - 9, 6, 6, "#1c2236"); R(g, x - 2, y - 8, 4, 4, "#3a4660"); } });
        },
        top(cx, cy, d) {
          const g = GP; fogFront(g, cy, 20.2, d.fr); moodTint(g); tileLights(g, cx, cy);
          g.save(); g.fillStyle = "rgba(226,229,246,.16)"; g.fillRect(0, 0, 320, 200); g.restore();
        },
      },

      vl_latte: {
        name: "Vallombra · Il Latte", short: "Il Latte", sub: "Nebbia ferma, tre Ancore, un pallone", w: 36, h: 26, start: [4, 3], theme: "puntanera", bg: "vl_latte", moodMin: 1,
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_fascia_nebbia", items: [[3, 9], [22, 3], [30, 17], [4, 24]],
        act: { A: "Guarda la lanterna", U: "Prendi il pallone", E: "Ascolta la pietra", "^": "Torna al sentiero", b: "Guarda la panchina" },
        areas: [[1, 1, 7, 4, "La sporgenza"], [2, 5, 3, 9, "La rientranza"], [8, 2, 18, 4, "Il corridoio di assi"], [19, 2, 28, 4, "Oltre la prima nebbia"], [26, 5, 28, 12, "La scala di nebbia"], [20, 13, 31, 18, "La piazza del Latte"], [8, 15, 19, 16, "Il corridoio basso"], [8, 17, 9, 19, "La discesa all'isola"], [3, 20, 15, 24, "L'isola del Dischetto"]],
        hints: () => ({
          "La sporgenza": "L'ultimo pezzo di roccia. Oltre il bordo comincia il Latte, che qui non è più un panorama: è un posto. Il cancello in alto riporta sul sentiero.",
          "La rientranza": "Una rientranza nella nebbia, sotto la sporgenza. Una pietra sussurra.",
          "Il corridoio di assi": "Assi di luce tiepida sospese nel bianco. A est, una piazzola con una lanterna di ferro: la prima Ancora.",
          "Oltre la prima nebbia": "La nebbia fitta si è aperta come una tenda. Più avanti il corridoio svolta verso il basso.",
          "La scala di nebbia": "Una scala di nebbia compatta, che scende verso una grande piazza.",
          "La piazza del Latte": "Una piazza grande come un campo, con una lanterna al centro: la seconda Ancora. Il bianco, intorno, ha forme di spalti.",
          "Il corridoio basso": "Il corridoio verso ovest, che prima era chiuso da nebbia fitta.",
          "La discesa all'isola": "Il corridoio scende verso un'isola con dei cerchi bianchi sul fondo.",
          "L'isola del Dischetto": "Un'isola con il cerchio di centrocampo e un dischetto. In un angolo, una panchina di nebbia. Una lanterna a sinistra: la terza Ancora.",
          "Il Latte": "Dentro il Latte.",
        }),
        intro: [],
        npcs: (s) => {
          const o = [];
          if (s >= 4) o.push({ id: "vl_agata", at: [6, 2] });
          const g = { 0: [14, 4], 1: [26, 16], 2: [4, 23], 3: [12, 22], "-1": [2, 3] }[legNow()] || [2, 3];
          if (has("compass") || s !== 5) o.push({ id: "vl_bianca", at: [2, 3] }); else o.push({ id: "vl_bianca", at: g });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 25, "G");
          lay(1, 1, 7, 4, ":"); lay(8, 2, 18, 4, "g"); lay(12, 2, 14, 4, "p"); lay(19, 2, 20, 4, "G"); lay(21, 2, 28, 4, "g"); lay(26, 5, 28, 12, "g");
          lay(20, 13, 31, 18, "g"); lay(24, 14, 26, 16, "p"); lay(8, 15, 19, 16, "g"); lay(15, 15, 16, 16, "G"); lay(8, 17, 9, 19, "g");
          lay(3, 20, 15, 24, "g"); lay(5, 21, 13, 23, "p"); lay(2, 5, 3, 9, "g"); lay(8, 21, 10, 23, "G");
          put(9, 22, "p"); put(9, 22, "U"); put(13, 3, "A"); put(25, 15, "A"); put(5, 22, "A");
          [[1, 2], [7, 2], [1, 4], [7, 4]].forEach(([x, y]) => put(x, y, "l"));
          [[10, 2], [30, 14], [21, 18], [4, 20], [2, 7], [28, 8], [18, 4]].forEach(([x, y]) => put(x, y, "E"));
          put(13, 22, "b"); put(3, 1, "^"); put(4, 1, "^");
          if (has("anc1")) X.setTiles(19, 2, 20, 4, "g");
          if (has("anc2")) X.setTiles(15, 15, 16, 16, "g");
          if (has("anc3")) ring();
          if (has("ball")) X.setTiles(9, 22, 9, 22, "p");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          for (let i = 0; i < 18; i++) { const x = ((i * 53 + fr * 0.2) % 340) - 10, y = ((i * 71 + Math.sin(fr / 60 + i) * 8) % 220) - 10; R(g, x, y, 1, 1, "rgba(190,255,240,.55)"); }
          // pubblico di nebbia: sagome senza volto, lontane, nei punti in cui il bianco è più fitto
          [[31, 3], [33, 6], [33, 9], [31, 11], [0, 12], [1, 15], [33, 21], [32, 23], [17, 7], [22, 9], [14, 11], [2, 17], [1, 23]].forEach(([tx, ty], i) => {
            const x = X_(tx) + 8, y = Y_(ty) + 12 + Math.sin(fr / 70 + i) * 1.5; if (!onScr(x, y)) return;
            g.fillStyle = `rgba(36,44,96,${0.35 + 0.1 * Math.sin(fr / 40 + i)})`; g.beginPath(); g.arc(x, y - 9, 4, 0, 7); g.fill(); g.fillRect(x - 4, y - 5, 8, 12);
          });
          // la porta di nebbia sul lato sinistro dell'isola
          const gx = X_(1), gy = Y_(21); if (onScr(gx, gy)) { g.strokeStyle = "rgba(235,240,255,.55)"; g.lineWidth = 2; g.strokeRect(gx, gy, 14, 3 * TS); }
          // i cerchi dell'isola: centrocampo e dischetto
          const ix = X_(9) + 8, iy = Y_(22) + 8; if (onScr(ix, iy)) { g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.beginPath(); g.arc(ix, iy, 28, 0, 7); g.stroke(); R(g, ix - 1, iy - 1, 3, 3, "rgba(255,255,255,.9)"); }
          // il pallone che galleggia sopra il dischetto non ancora aperto
          // percorso della bussola, tappa per tappa
          const leg = legNow();
          if (has("compass") && S() === 5 && GUIDE[leg]) {
            const pts = GUIDE[leg].map(([tx, ty]) => [X_(tx) + 8, Y_(ty) + 8]); let len = 0; const seg = [];
            for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); len += l; }
            for (let k = 0; k < len; k += 11) {
              let t = (k + (fr * 0.35) % 11), a = 0; if (t > len) continue; let i = 0; while (i < seg.length - 1 && t > seg[i]) { t -= seg[i]; i++; }
              const p0 = pts[i], p1 = pts[i + 1]; const f = seg[i] ? t / seg[i] : 0, px_ = p0[0] + (p1[0] - p0[0]) * f, py_ = p0[1] + (p1[1] - p0[1]) * f; if (!onScr(px_, py_)) continue;
              a = 0.5 + 0.4 * Math.sin(fr / 14 + k); g.save(); g.globalCompositeOperation = "lighter"; glow(g, px_, py_, 7, "90,235,210", a); g.restore(); R(g, px_ - 1, py_ - 1, 3, 3, "#b9fff0");
            }
          }
        },
        top(cx, cy, d) {
          const g = GP; moodTint(g); tileLights(g, cx, cy);
          const gr = g.createRadialGradient(160, 100, 50, 160, 100, 200); gr.addColorStop(0, "rgba(180,190,255,0)"); gr.addColorStop(1, "rgba(20,24,70,.5)"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200);
        },
      },

      vl_spogliatoi: {
        name: "Vallombra · Gli spogliatoi", short: "Gli spogliatoi", sub: "Dodici armadietti e una lampada", w: 16, h: 10, start: [7, 7], theme: "torino", bg: "vl_spogliatoi", moodMin: 1,
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_ambra", items: [],
        act: { K: "Guarda l'armadietto", Z: "Esci dagli spogliatoi", b: "Guarda la panca" },
        areas: [[1, 2, 14, 7, "Gli spogliatoi"]],
        hints: (s) => ({ "Gli spogliatoi": s >= 8 ? "Dodici armadietti, sei panche, una lampada a ciondolo. L'orologio sul muro è fermo sulle 6:43. Il sindaco è in fondo, a destra." : "Dodici armadietti e una lampada a ciondolo. Odore di cera e di sconfitte rispettabili.", "Vallombra": "Gli spogliatoi." }),
        intro: [["voce", "Gli spogliatoi del Campo Sospeso: dodici armadietti di ferro, una panca per ogni paura e un orologio sul muro che si è fermato prima di tutti."]],
        npcs: (s) => (s === 7 || s === 8 ? [{ id: "vl_cornelio", at: [13, 3] }] : []),
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 9, "W"); lay(1, 3, 14, 7, "i");
          for (let x = 2; x <= 13; x++) put(x, 2, "K");
          [4, 5, 6, 7, 8, 9].forEach((x) => put(x, 5, "b")); put(7, 8, "Z"); put(8, 8, "Z");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          const ccx = X_(8) + 8, ccy = Y_(1) + 6; g.fillStyle = "#efe6cf"; g.beginPath(); g.arc(ccx, ccy, 7, 0, 7); g.fill(); g.strokeStyle = "#2a2f44"; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(ccx, ccy); g.lineTo(ccx + Math.sin(3.52) * 3.5, ccy - Math.cos(3.52) * 3.5); g.moveTo(ccx, ccy); g.lineTo(ccx + Math.sin(4.5) * 5.5, ccy - Math.cos(4.5) * 5.5); g.stroke();
          plaque(g, "SPOGLIATOI · CAMPO SOSPESO", X_(8) + 8, Y_(0) + 2);
          for (let i = 0; i < 6; i++) { const x = X_(2 + i * 2) + 8; /* targhette */ }
        },
        top(cx, cy, d) {
          const g = GP; moodTint(g); tileLights(g, cx, cy);
          g.save(); g.globalCompositeOperation = "lighter"; glow(g, 8 * TS - cx + 8, 4 * TS - cy, 110, "255,200,110", 0.2 + 0.02 * Math.sin(d.fr / 16)); g.restore();
        },
      },
    };

    // ---- ritocchi alle zone del capitolo 1 (attivi quando il capitolo 2 è sbloccato)
    const paeseNpcs = (list, s) => {
      const o = list.filter((n) => n.id !== "vl_bianca");
      o.push({ id: "vl_noemi", at: [18, 8] });
      const told = F.get("told", "segreto");
      if (s <= 5 || told === "mirtilla") o.push({ id: "vl_ettore", at: [22, 13] });
      if (told === "mirtilla" && s <= 5) o.push({ id: "vl_viola", at: [24, 14] });
      return o;
    };
    const campoNpcs = (list, s) => {
      let o = list.slice();
      const rem = F.get("remo", 1);
      if (s >= 3 && s <= 5) o = o.filter((n) => !["vl_remo", "vl_tonio", "vl_gisella"].includes(n.id) || (rem === 3 && n.id !== "vl_remo"));
      if (s >= 4 && s <= 5) o = o.filter((n) => n.id !== "vl_bianca");
      if (s >= 6) { o = o.filter((n) => !["vl_remo", "vl_tonio", "vl_gisella"].includes(n.id)); o.push({ id: remoId(), at: [11, 15] }, { id: "vl_tonio", at: [13, 15] }, { id: "vl_gisella", at: [15, 15] }); }
      if (s >= 6 && s <= 7) o.push({ id: "vl_rosalba", at: [22, 9] });
      if (s >= 7 && s <= 9) o = o.filter((n) => n.id !== "vl_cornelio");
      if (s === 7 && needEttore()) o.push({ id: "vl_ettore", at: [3, 8] }, { id: "vl_viola", at: [5, 9] });
      return o;
    };
    X.patch("vl_paese", N, { npcs: paeseNpcs });
    X.patch("vl_campo", N, {
      npcs: campoNpcs,
      act: { w: "Gli spogliatoi" },
      decor(cx, cy, d) {
        if (S() < 6) return;
        const g = GP, mir = F.get("told", "segreto") === "mirtilla", n = mir ? 26 : 14;
        for (let i = 0; i < n; i++) {
          const tx = 8 + (i * 7) % 18, x = d.X(tx) + 8 + ((i * 5) % 7) - 3, y = d.Y(17) + 4 + (i % 2) * 3; if (!onScr(x, y)) continue;
          const cols = ["#1b2f7a", "#e9a64a", "#d6f23a", "#9a7a4a", "#b3487a"]; g.fillStyle = "#e0b48a"; g.beginPath(); g.arc(x, y - 4, 2.4, 0, 7); g.fill(); g.fillStyle = cols[(i * 3 + (i >> 1)) % 5]; g.fillRect(x - 3, y - 2, 6, 6);
        }
      },
    });
    X.patch("vl_miniera", N, {
      act: { ">": "Il sentiero in discesa" },
      npcs: (list, s) => {
        const o = list.slice();
        if (s >= 3 && s <= 4 && remoBlocca()) o.push({ id: remoId(), at: [26, 12] });
        if (s === 9) o.push({ id: "vl_lampionaio", at: [13, 7] });
        return o;
      },
      hints: (s) => (s === 9 ? { "L'imbocco della miniera": "Dalle assi arriva un bussare lento, dall'interno: tre colpi, poi una pausa. La luce turchese è quasi una voce.", "Il sentiero dei Lampioni": "Il sentiero a est scende verso il Latte. Qui, davanti all'imbocco, i lampioni sono accesi tutti insieme." } : s >= 10 ? { "L'imbocco della miniera": "Le assi sono cadute: dietro c'è un corridoio di binari e una luce turchese che respira. La prima galleria è aperta." } : {}),
      build(L) {
        const { put } = L;
        if (S() >= 3) { put(27, 12, ">"); put(27, 13, ">"); }
        if (remoBlocca()) { put(26, 11, "x"); put(26, 13, "x"); }
      },
    });

    // ================= scene
    const toast = (m) => { if (m && m.length) X.api.trToast(m.join(" · ")); };

    // ---- Mirtilla (mattina)
    function mirtilla() {
      const s = S(), told = F.get("told", "segreto");
      if (s === 0) return mirtillaMattina();
      F.set("mirtilla_met", true);
      const opts = [
        { label: "Una cioccolata, grazie", sub: "Il menu delle nebbie", fn: () => say(sw([["vl_mirtilla", chip(["Oggi c'è la «Nebbia al Pallone»: cioccolata, panna e il vago senso di aver perso qualcosa. Offre la casa. La casa sono io.", "«Schiarita Tardiva», senza zucchero e senza speranza. La prendono solo i pessimisti e Fosco.", "Nebbia fitta, doppia panna, con una spolverata di cacao a forma di Coppa. Non somiglia a una Coppa. Somiglia a una brocca."])], ["voce", "Densa, caldissima, un filo salata. Ti scalda fino ai lacci."]], BG.I), done) },
        { label: "Cosa si dice in paese?", sub: "Il giro delle chiacchiere", fn: () => say(sw([["vl_mirtilla", s >= 10 ? "Si dice che il sindaco, stasera, abbia chiuso il discorso con un sospiro. Si dice che l'Imbocco abbia aperto gli occhi. Si dice che dovrei mettere un'insegna nuova sul Rifugio: «Cioccolata e misteri»." : told === "mirtilla" ? "Si dice di te. Sono io che lo dico, ma per prudenza lo attribuisco a «una voce»." : told === "teodora" ? "Si dice che Teodora parli con la cabina. Lo dice lei stessa, ma a bassa voce." : "Si dice che tu abbia la faccia di chi sa e non dice. È un complimento, a Vallombra."]], BG.I), done) },
      ];
      if (s >= 1 && s <= 5) opts.push({ label: "Il pallone ufficiale", sub: "Aggiornamenti", fn: () => say(sw([["vl_mirtilla", s <= 2 ? "Se lo trovi, riportalo prima delle sei. Altrimenti il sindaco proclama la cerimonia funebre del pallone: ha già scritto il discorso, e dura nove minuti." : "Vai, vai: ogni minuto che passa, un'idea nuova di Cornelio. L'ultima: sostituire il pallone con un cocomero. Il regolamento non lo vieta."]], BG.I), done) });
      ask("vl_mirtilla", s >= 6 ? "«Allora? Ti vedo con la faccia di chi ha avuto una giornata.»" : "«Siediti, siediti. Qui si ragiona meglio con le mani occupate.»", opts, BG.I);
    }
    function mirtillaMattina() {
      F.set("mirtilla_met", true);
      const told = F.get("told", "segreto");
      const t0 = told === "mirtilla" ? [
        ["vl_mirtilla", "Prima di tutto: io non ho detto niente. Ho solo detto «forse», ieri sera, a poche persone. Alle undici i «forse» erano centododici."],
        tl({ sicuro: "Ti avevo chiesto discrezione.", attento: "Qui dentro le orecchie sono più delle tazze.", ironico: "Centododici. E io che volevo restare riservato." }),
        ["vl_mirtilla", "Il «forse» è contagioso. Guarda la piazza: sono arrivati due da fuori con una telecamera, «cacciatori di misteri». Li ho messi al tavolo vicino al gatto, che non si impressiona."],
      ] : told === "teodora" ? [
        ["vl_mirtilla", "Teodora mi ha detto di non dire niente a nessuno. L'ho detto soltanto al gatto. Il gatto non parla, ma ha una faccia che racconta."],
        ["vl_mirtilla", "Il paese lo sa lo stesso: Teodora ha tenuto la finestra illuminata tutta la notte, e quello, a Vallombra, vale un comunicato."],
      ] : [
        ["vl_mirtilla", "Tu non mi hai detto niente. Hai la faccia di una tasca piena: l'ho capito lo stesso. Non l'ho raccontato a nessuno, per la prima volta in vita mia, e mi è venuto il mal di pancia."],
        ["vl_mirtilla", "Il paese però lo sa. Non da me: da Radio Nebbia, che l'ha letto in diretta senza accorgersene."],
      ];
      say(sw([
        ["voce", "La mattina dopo il Rifugio Tre Tazze è pieno come una domenica. Mirtilla ti aspetta sulla terrazza, con un vassoio, due tazze e il fiato corto di chi ha corso senza spostarsi."],
        ["vl_mirtilla", "Eccoti! Siediti, ma non troppo: abbiamo un'emergenza. Io sto bene, è la Coppa."],
        ...t0,
        ["vl_mirtilla", "La Coppa dei Tre Versanti: oggi, ore diciotto, Vallombra contro le Marmotte di Valle Fonda, qui al Campo. Fischio finale alle diciotto e quarantatré, come da tradizione del sindaco. Regolamento, articolo quattro: si gioca col Pallone Ufficiale. Articolo quattro bis: il Pallone Ufficiale è quello della finale del '98."],
        ["vl_mirtilla", "Stava nella teca sopra il camino da ventisei anni. Stamattina la teca è chiusa con il lucchetto, da dentro. E il pallone non c'è."],
        ["voce", "Sul pavimento, dalla teca alla porta, corre una scia di brina. Fuori, sulla soglia, la brina prosegue e sale sul sentiero. Verso l'alto."],
        ["vl_mirtilla", "Se non lo troviamo entro le sei vinciamo a tavolino. Cioè perdiamo tre a zero a tavolino, che è peggio: a tavolino non ci sono nemmeno gli applausi."],
      ], BG.I), () => ask("voce", "Come la prendi?", [
        { label: "«Lo cerco io. Un pallone che scappa lascia una scia.»", sub: "Determinato", fn: () => mirtillaFine(1) },
        { label: "«Chi ha le chiavi della teca?»", sub: "Investigativo", fn: () => mirtillaFine(2) },
        { label: "«Perdere a tavolino è una bella tradizione.»", sub: "Ironico", fn: () => mirtillaFine(3) },
      ], BG.I));
    }
    function mirtillaFine(k) {
      F.set("pallone_q", k);
      const a = k === 1 ? [["vl_mirtilla", "Ecco, così si parla. Una scia di brina… vai a sentire Noemi: ha la finestra sul sentiero e dorme col microfono acceso."]]
        : k === 2 ? [["vl_mirtilla", "Le chiavi le ho io, il sindaco ne ha una e Fosco ne ha una che non funziona più. Tre chiavi, un lucchetto chiuso da dentro: un mistero molto ben organizzato. Vai da Noemi, che sente tutto."]]
          : [["vl_mirtilla", "Spiritoso. Non dirlo al sindaco: ha già scritto il discorso sulla vittoria a tavolino, con un paragrafo di rammarico. Vai da Noemi, che ha una finestra sul sentiero."]];
      say(sw([...a, ["voce", "Mirtilla ti infila in tasca un panino alla cioccolata «per il viaggio». Il viaggio, per ora, è fino alla casetta con l'antenna."]], BG.I), () => {
        setStep(N, 1); note("Il Pallone Ufficiale del '98 è sparito dalla teca del Rifugio: una scia di brina sale sul sentiero."); done();
      });
    }

    // ---- Noemi
    function noemi() {
      const s = S(); F.set("noemi_met", true);
      if (s === 0) return say(sw([["vl_noemi", "…Radio Nebbia, qui Noemi, in diretta e quasi sveglia. Prima parla con Mirtilla, che ha il copione dei pettegolezzi: l'ordine è sacro."]], BG.P), done);
      if (s === 1) return noemiScena();
      const opts = [{ label: "Che tempo fa?", sub: "Il meteo di Noemi", fn: () => say(sw([["vl_noemi", s >= 7 ? "Meteo: nebbia, con possibilità di nebbia. Ma stasera la nebbia ha una voce, e la voce ha un accento di quarant'anni fa." : chip(["Meteo: nebbia, con possibilità di nebbia. Domani: schiarite di nebbia. Dopodomani: ancora lei.", "Oggi alle 18:43 il Latte potrebbe alzarsi di un metro. Le probabilità sono: tante.", "Temperature in lieve calo. Morale in lieve calo. Cioccolata in lieve rialzo."])]], BG.P), done) }];
      if (s >= 2) opts.push({ label: "Il nastro di ieri sera", sub: "Riascoltalo", fn: () => say(sw([["voce", "Il nastro gracchia. Una voce piatta legge «{n}». Dietro, un pubblico trattiene il fiato. Poi, un secondo prima dello stop: «Palla?»"], ["vl_noemi", has("intervista") ? "La tua voce in diretta ha preso il cinquantatré per cento di ascolto. A Vallombra significa sessantatré persone." : "Lo riascolto ogni sera, per sicurezza. Non so contro cosa."]], BG.P), done) });
      ask("vl_noemi", has("intervista") ? "«Ehi, voce nuova! Qui si trasmette anche in tua assenza.»" : "«Radio Nebbia, il giornale radio che non cambia mai.»", opts, BG.P);
    }
    function noemiScena() {
      say(sw([
        ["voce", "Sul piazzale davanti a Radio Nebbia, Noemi Etere tiene un microfono in una mano e una brioche nell'altra, e riesce a non far cadere nessuno dei due."],
        ["vl_noemi", "Il nome di ieri sera l'ho letto io, ma non l'ho letto io. La bocca era la mia; le parole no. Ho un nastro, se vuoi sentirlo."],
        ["voce", "Il nastro gracchia. Una voce piatta, senza età, legge: «{n}». Alle sue spalle, quasi inudibile, un pubblico prende fiato. Poi, un secondo prima dello stop: «Palla?»"],
        ["vl_noemi", "Quel «palla?» non l'ho detto io. E stanotte, tra le tre e dieci e le tre e dodici, l'antenna ha captato un oggetto sferico in salita, a velocità costante. Lo chiamo «il Pallone dell'Eterno». Mia madre lo chiama «quella cosa che disturba il programma»."],
        ["vl_noemi", "La direzione è il sentiero dei Lampioni, oltre il Campo. Chiedi ad Agata: ha il vecchio ricevitore, e il terreno lo sente prima di tutti."],
        ["voce", "Noemi ti porge il microfono con l'espressione di chi offre una caramella a un bambino prudente."],
      ], BG.P), () => ask("voce", "Cosa fai del microfono?", [
        { label: "Accetti l'intervista in diretta", sub: "«Parla il Campione»", fn: () => noemiFine(true) },
        { label: "«Niente interviste, per ora.»", sub: "Riservato", fn: () => noemiFine(false) },
      ], BG.P));
    }
    function noemiFine(yes) {
      F.set("intervista", yes);
      const a = yes ? [["hero", "Qui… {n}. Sono in cerca di un pallone. Se qualcuno lo vede, sappia che non è un UFO."], ["vl_noemi", "Un minuto di diretta e già il Rifugio chiama per chiedere se «è vero». Da oggi sei una voce di Radio Nebbia. Ti metto in rubrica tra il meteo e i necrologi, che a Vallombra hanno lo stesso pubblico."]]
        : [["hero", "Preferisco cercare prima e parlare dopo."], ["vl_noemi", "Rispetto. Radio Nebbia resta in ascolto: è l'unico mestiere in cui si può tacere forte."]];
      say(sw([...a, ["voce", "Noemi spegne il microfono, e per un istante la sua voce è soltanto una voce. «Se senti il Latte parlare, fammelo sapere. Io ci sto dentro dalle sei del mattino e non mi ha ancora detto buongiorno.»"]], BG.P), () => {
        if (yes) X.lanAdd("vl_noemi");
        setStep(N, 2); note(yes ? "Noemi mi ha messo in onda: il nastro dice il mio nome e un «palla?». Il pallone sale verso l'Imbocco." : "Noemi ha registrato il mio nome e un «palla?». Il pallone sale verso l'Imbocco."); done();
      });
    }

    // ---- Agata
    function agata() {
      const s = S(), z = zoneNow(); F.set("agata_met", true);
      if (z === "vl_latte") return agataLatte();
      if (s < 2) return say(sw([["vl_agata", "Il terreno oggi ha un umore strano. Se cerchi qualcosa, parla prima con Mirtilla e con Noemi: ho un protocollo, e la fila non si salta."]], BG.C), done);
      if (s === 2) return agataScena();
      const L1 = s >= 10 ? ["Il terreno ha smesso di vibrare dopo il tiro dell'altra sera. Ora fa un'altra cosa: sta fermo. È peggio.", "Ho misurato l'Imbocco stanotte. Quarantatré battiti al minuto. Come un cuore a riposo, o a metà partita."] : s >= 6 ? ["Il pallone ritrovato pesa quattrocentoquaranta grammi, cioè esattamente come un pallone qualunque. Questo è il dato più strano di tutti.", "Quando sei uscito dal Latte il sismografo ha disegnato una linea piatta. Una linea piatta, per ventisei anni, non l'avevo mai vista."] : ["Il pallone, a quaranta metri, impiega tre secondi per tornare. Non spiego perché. Registro.", "Le schegge sparse sono lumina caduta dalle vene. Non metterle sotto il cuscino."];
      const o = [{ label: "Chiedi della lumina", fn: () => say(sw([["vl_agata", chip(L1)]], BG.C), done) }];
      if (F.get("compass", null) === false) o.push({ label: "Chiedi la bussola", sub: "Hai cambiato idea", fn: () => { F.set("compass", true); X.lanAdd("vl_agata"); note("Alla fine ho preso la bussola di lumina di Agata."); say(sw([["vl_agata", "Sapevo che l'avresti presa. Gli scettici sono i miei clienti migliori."]], BG.C), done); } });
      ask("vl_agata", "«Il terreno, oggi, ha un umore strano.»", o, BG.C);
    }
    function agataScena() {
      const partA = [
        ["voce", "Al banco di Agata il quaderno è aperto su una pagina piena di numeri, e un numero, in mezzo, è cerchiato tre volte."],
        ["vl_agata", "Il pallone. Sì. Alle tre e undici il sismografo ha segnato un punto, uno solo, come un'unghia sul vetro. Poi una linea retta verso l'Imbocco. Un pallone che sale su un sentiero che sale: ne prendo atto e non lo spiego."],
        ["vl_agata", "Sull'Imbocco, a est, c'è un cancello che non c'era. Alto un metro e novanta, pesa meno dell'aria. Oltre c'è una discesa. Ti consiglio di scenderla con qualcuno che sappia tornare."],
      ];
      const partB = () => {
        const c = has("compass");
        say(sw([
          ["vl_agata", c ? "La bussola ce l'hai: tienila in tasca e guardala quando serve. L'ago segue la luce: dove le lanterne chiamano, punta. Fidati, ma con giudizio: gli aghi, nel Latte, hanno un carattere." : "Niente bussola, d'accordo. Allora ti serve Bianca: i bulloni sentono la lumina meglio di qualsiasi ago, e lei parla coi bulloni."],
          ["vl_agata", "Un'ultima cosa, scrivila. Il fischio che il terreno fa alle 18:43 ha un ritmo: corto, lungo, corto. Un fischio sbagliato, direi: nessun arbitro fischia così per scelta. Se il Latte ti chiede un fischio, quello è il fischio."],
          ["voce", "Agata strappa una pagina dal quaderno e te la porge: tre trattini, uno lungo e due corti, in ordine."],
        ], BG.C), () => { setStep(N, 3); note("Agata: il fischio del Latte fa «corto, lungo, corto». Un fischio sbagliato."); note("Il pallone sale dall'Imbocco: a est c'è un cancello nuovo che scende verso il Latte."); done(); });
      };
      say(sw(partA, BG.C), () => {
        if (has("agata_visto")) return partB();
        ask("voce", "Agata ti porge una bussola con un ago turchese.", [
          { label: "Accetta la bussola di lumina", sub: "L'ago segue la luce, non il nord", fn: () => { F.set("agata_visto", true); F.set("compass", true); X.lanAdd("vl_agata"); note("Agata Sassi mi ha dato una bussola di lumina. L'ago segue la luce, non il nord."); partB(); } },
          { label: "«Grazie, non mi serve»", sub: "Meglio fidarsi di sé", fn: () => { F.set("agata_visto", true); F.set("compass", false); note("Ho rifiutato la bussola di lumina di Agata."); partB(); } },
        ], BG.C);
      });
    }
    function agataLatte() {
      const asked = [
        { label: "Dove devo andare?", sub: "Indicazioni", fn: () => say(sw([["vl_agata", T(goal(S()))]], BG.L), done) },
        { label: "Come funziona la corda?", sub: "Sicurezza", fn: () => say(sw([["vl_agata", "Tre tiri: il Latte sale, torna indietro. Un tiro lungo: va tutto bene. Nessun tiro: sono io che ho perso il filo, e in quel caso grido. A bassa voce, ma grido."]], BG.L), done) },
      ];
      ask("vl_agata", "«Io tengo l'altro capo. Tu tieni il passo.»", asked, BG.L);
    }

    // ---- Bianca
    function bianca() {
      const z = zoneNow(), s = S(), k = F.get("bianca", 1);
      if (z === "vl_latte") return biancaLatte();
      const L1 = s >= 10 ? ["La cabina tre, stanotte, ha smesso di fare rumore. Ho passato un'ora a sentire il silenzio. Mi manca.", "Mi devi ancora una cabina. Ma credo che per un po' la cabina tre voglia stare dov'è."]
        : s >= 6 ? ["Ho lasciato la chiave inglese alla soglia del Latte. Non perché avessi paura: perché non sapevo dove metterla, dentro.", k === 2 ? "Mi devi ancora una cabina. Dopo oggi, ne voglio una col sedile riscaldato." : "Sei tornato intero con un pallone intero. Le giornate così non capitano mai due volte."]
          : ["Il pallone è sparito senza lasciare una vite. Come un pallone? Come un fantasma meccanico.", k === 3 ? "Dieci minuti, hai detto. Oggi ne servono di più." : "Pronta. Per le gambe, per le chiavi e per i guai."];
      say(sw([["vl_bianca", chip(L1)]], BG.C), done);
    }
    function biancaLatte() {
      const c = has("compass"), s = S();
      const o = [{ label: "Dove devo andare?", sub: "Indicazioni", fn: () => say(sw([["vl_bianca", T(goal(s))]], BG.L), done) }];
      if (!c) o.push({ label: "Dove sei?", sub: "Ti fa strada", fn: () => say(sw([["vl_bianca", "Mi metto davanti, vicino a dove devi andare. Quando ti serve la prossima tappa, cerca la mia sagoma e il tintinnio della chiave inglese."]], BG.L), done) });
      ask("vl_bianca", c ? "«Sono qui con te. Il resto lo fa l'ago.»" : "«Seguimi. E non toccare niente di lucido.»", o, BG.L);
    }

    // ---- Remo
    function camosciFriendly() {
      X.playMatch({
        id: "vl2c", alt: "az", azPitch: "erba", chap: "Vallombra · Il Campo Sospeso", mate: "Bianca",
        intro: "Rivincita amichevole contro <em>i Camosci di Cima Alta</em>, un tempo solo. Dietro le porte il Latte aspetta; il pallone, se va lungo, torna.",
        team: (t, s) => ({ vs: "i Camosci di Cima Alta", name: "Camosci di Cima Alta", color: "#c8e82a", defs: [["Gisella Cima", t(s.drib * 0.74)], ["Il Bufalo", t(s.drib * 0.8)], ["Tonio Fiocco", t(s.drib * 0.78)]], atk: [["Remo Valanga", t(s.tiro * 0.86)], ["Gisella Cima", t(s.tiro * 0.72)]], gk: ["Tonio Fiocco", t(s.tiro * 0.92)], power: t(s.tiro * 0.74), special: ["VALANGA DI CIMA ALTA", t(s.tiro * 1.08)] }),
        done: (r) => { const msg = r.win ? reward("vl_m1_win", { coins: 10 }) : []; X.say(sw([["voce", `Amichevole finita ${r.a}–${r.b}.${msg.length ? " " + msg.join(" · ") + "." : ""}`], [remoId(), r.win ? "Un'altra? Va bene. Mi sto abituando a perdere. Non dirlo ai miei." : "Rivincita finita. Sono ancora il re della terrazza. Ma ho sentito il campo respirare."]], BG.C), done); },
      });
    }
    function remo() {
      const z = zoneNow(), s = S(), id = remoId(), k = F.get("remo", 1);
      F.set("remo_met", true);
      if (z === "vl_miniera") return remoBlocco();
      if (z === "vl_discesa") return remoDiscesa();
      const L1 = s >= 10 ? [remoHelps() ? "La corda l'ho ancora nelle mani, sai? Mi sveglio la notte e stringo il cuscino. Sono sempre stato un tipo da corda." : "Non so cosa ci sia là sotto, {n}. So che stanotte ho dormito con la luce accesa. Non dirlo ai Camosci."]
        : s >= 6 ? [remoHelps() ? "Gioco con te, oggi. Tonio e Gisella fanno il tifo dal lato sbagliato per abitudine." : "Io faccio il tifo. Dal lato giusto: il mio.", "Il Pallone Ufficiale del '98 è tornato. Da dove, non lo chiedo. Ho già i miei motivi per dormire male."]
          : s <= 2 ? [k === 3 ? "Ah, il pallone sparito? Mi dispiace tanto. (sorride) Strada chiusa per lavori, comunque." : has("remo_bet") && has("m1_win") ? "Senza occhiali ho la sensazione di essere in mutande. Non si dice, ma lo dico: la luce del Campo è molto forte." : "Ho sentito che avete perso un pallone. I Camosci non entrano nel Latte, ma la corda la tengono. Ci vediamo laggiù."]
            : ["Non fermarti qui a chiacchierare con me: ti aspettano tutti da un'altra parte."];
      const o = [{ label: "Parla con Remo", fn: () => say(sw([[id, chip(L1)]], BG.C), done) }, { label: "Rivincita amichevole", sub: "Contro i Camosci, un tempo", fn: camosciFriendly }];
      ask(id, "«Sempre in giro, {n}? I campioni si vedono dal passo.»", s <= 5 ? o.slice(0, 1) : o, BG.C);
    }
    function remoBlocco() {
      const id = remoId();
      say(sw([
        ["voce", "In fondo al sentiero, davanti al cancello nuovo, Remo è seduto su una cassa con le gambe accavallate. Dietro di lui, due transenne di plastica gialla: «CAMOSCI COSTRUZIONI»."],
        [id, "Strada chiusa per lavori. Lavori in corso, lavori in corso, lavori: si lavora. Non si passa."],
        tl({ sicuro: "I Camosci Costruzioni non esistono.", attento: "Le transenne hanno ancora il prezzo attaccato.", ironico: "Complimenti: due transenne e già un'impresa." }),
        [id, "Esistono da stamattina. Soci: io e il mio sorriso. Dieci minuti di ritardo, {n}, giusto perché vi vengano i sudori freddi. La partita è alle sei: se saltate, saltate. Io non c'entro."],
        ["voce", "Dal cancello arriva un filo d'aria fredda, e un profumo di cera e di lumina. Sulla traversa, a gesso, qualcuno ha scritto: «ORA.»"],
      ], BG.M), () => ask("voce", "Come convinci Remo a spostarsi?", [
        { label: "«Spostati. C'è qualcosa di più grande del campionato.»", sub: "Serio", fn: () => remoSposta(1) },
        { label: "«Ti offro una cioccolata di nebbia fitta, doppia panna.»", sub: "Ironico", fn: () => remoSposta(2) },
      ], BG.M));
    }
    function remoSposta(k) {
      const id = remoId();
      const a = k === 1 ? [[id, "…Dici sul serio."], ["voce", "Remo ti guarda, poi guarda la traversa del cancello, poi di nuovo te. Il sorriso gli scivola via come una tuta bagnata."], [id, "Sai, ho sentito un fischio, stanotte. Dalla finestra di Cima Alta. Lungo, solo a metà. Non l'ho detto a nessuno."]]
        : [[id, "…Doppia?"], ["hero", "Doppia. Con le cialde."], [id, "Mi hai preso dal punto debole: sono i Camosci, ma sono anche un uomo di gola."]];
      say(sw([...a, [id, "Passate. E non guardatemi: ho gli occhi lucidi per il vento."], ["voce", "Remo sposta le transenne con un'eleganza finta di chi le ha messe lì per un buon motivo. Il passaggio è libero."]], BG.M), () => { F.set("remo_sab", k); note("Remo aveva messo due transenne per ritardarci. Poi si è spostato."); done(); });
    }
    function remoDiscesa() {
      const id = remoId(), k = F.get("remo", 1), ns = id === "vl_remo_ns";
      if (has("remo_help") || has("remo_pent")) return say(sw([[id, chip(["La corda è tesa, la senti? Se il Latte sale, tira. Se non risponde, tira più forte.", "Tonio ha portato un thermos. Lo ha riempito di cioccolata di nebbia fitta. È al terzo giro. Non dirlo a Mirtilla.", "Non scendo, ma sto qui. Chi sta alla corda non ha una parte minore: ha una parte più lunga."])]], BG.M), done);
      if (k === 3) {
        return say(sw([
          ["voce", "Remo è seduto su un sasso, gli occhiali in mano e lo sguardo di chi ha litigato con la propria coscienza e ha perso ai punti."],
          [id, "Ho guardato giù. Ho guardato il Latte. …Non è nebbia, {n}. Ci sono voci."],
          [id, "Le transenne le ho messe io. Volevo che arrivaste tardi. Che la partita saltasse. Non volevo farvi male: volevo vincere. È diverso. È peggio, in effetti."],
        ], BG.M), () => ask("voce", "Cosa rispondi a Remo?", [
          { label: "«Capita. Adesso tieni la corda.»", sub: "Pratico", fn: () => remoPent(1) },
          { label: "«Domani offri il caffè a Mirtilla per un anno.»", sub: "Ironico", fn: () => remoPent(2) },
          { label: "«Non mi fido. Ma tieni la corda.»", sub: "Freddo", fn: () => remoPent(3) },
        ], BG.M));
      }
      say(sw([
        ["voce", "Sul prato basso i Camosci hanno srotolato una corda grossa come un braccio, annodata a un larice. Tonio ci siede sopra, Gisella la controlla ogni tre secondi." + (ns ? " Remo è senza occhiali: li tiene in tasca e li tocca ogni tanto, come un dente che manca." : "")],
        [id, k === 1 ? "Eccoti. Il Latte non ci va, ai Camosci. Ma la corda la teniamo noi. Se mi sentite dire che non ho paura, è per tradizione." : "Scommessa persa, occhiali in tasca, e ora anche una corda da tenere. Questa è la settimana peggiore della mia vita e mi sento stranamente bene."],
        ["vl_gisella", "I Camosci hanno un motto: «Cima Alta, ma mai troppo alta». Per oggi lo modifichiamo: «Cima Alta, e tieni la corda»."],
      ], BG.M), () => { F.set("remo_help", true); X.lanAdd("vl_remo"); note("I Camosci tengono la corda sul prato basso. Remo ha messo da parte l'orgoglio per un giorno."); done(); });
    }
    function remoPent(k) {
      const id = remoId();
      const a = k === 1 ? [[id, "Capita. Detto da te suona come una medaglia che pesa."]] : k === 2 ? [[id, "Un anno intero? Ho una dignità, {n}. È in tasca, con gli occhiali. Va bene, un anno."]] : [[id, "Giusto. Non fidarti. Ma vedrai che la corda non la mollo."]];
      say(sw([...a, ["voce", "Remo si alza, annoda la corda al larice con un nodo che sembra un'opinione, e fa un cenno a Tonio e a Gisella, che sono già al lavoro: non aspettavano altro."]], BG.M), () => { F.set("remo_pent", k); if (k !== 3) X.lanAdd("vl_remo"); note("Remo si è pentito delle transenne e tiene la corda sul prato basso."); done(); });
    }
    function tonio() { say(sw([["vl_tonio", S() >= 10 ? "Il Latte, laggiù, ha il rumore di una porta che si chiude piano. Io faccio il portiere, so cosa vuol dire." : chip(["Sono il portiere dei Camosci. Il mio lavoro è stare fermo e sembrare una porta più piccola. Oggi tengo anche la corda: una porta con le mani.", "Ho una teoria: il Latte è il portiere più grosso del mondo. Gli tiri e ti restituisce il pallone con educazione.", "Gisella dice che sono pallido. Sono i Camosci: siamo tutti un po' gialli."])]], zoneNow() === "vl_discesa" ? BG.M : BG.C), done); }
    function gisella() { say(sw([["vl_gisella", chip(["Tifo Camosci anche quando perdiamo. Oggi tifo Camosci e tifo la corda: è un doppio incarico.", "Il sindaco dice che le Marmotte dormono in panchina. Io dico che la panchina è il loro posto di lavoro.", "Remo non è cattivo. È solo un Camoscio con troppo sole addosso."])]], zoneNow() === "vl_discesa" ? BG.M : BG.C), done); }

    // ---- Teodora, Fosco
    function teodora() {
      const s = S(), fun = F.get("funivia", "aperta");
      F.set("teodora_met", true);
      const opts = [
        { label: "Come va la funivia?", sub: fun === "chiusa" ? "La notte dei lucchetti" : "La notte aperta", fn: () => say(sw(fun === "chiusa"
          ? [["vl_teodora", "Ho messo tutti i lucchetti, due volte, e li ho contati ad alta voce. La cabina è partita lo stesso, vuota, alle 18:43. Allora ho smesso di discutere con lei."], ["vl_teodora", "Mi sono fidata di te. Non lo faccio spesso: l'ultima volta che mi sono fidata di qualcuno, era qualcuno che aveva un fischietto e una promessa. Lascia stare. Il registro è aggiornato."]]
          : [["vl_teodora", "L'ho lasciata aperta come hai detto. È salita tre volte, vuota. Alla terza, ho ringraziato. Non so perché."], ["vl_teodora", "Ho scritto ogni corsa a matita. La matita si cancella; quello che è stato non si cancella. L'ho scritto sul registro, con la riga sottolineata."]], BG.I), done) },
        { label: "Una domanda sull'orario", sub: "Teodora ne sa", fn: () => say(sw([["vl_teodora", s >= 7 ? "Alle 18:43 il paese tende l'orecchio. Quest'anno è la prima volta che lo fa senza vergogna. Prendilo come un progresso." : chip(["L'ultima cabina scende alle 18:20 e risale alle 18:43. Oggi, per la partita, ho fatto un'eccezione: la 18:43 la prende anche chi vuole vedere il fischio finale.", "Gli orari non sono un'opinione. Sono la sola cosa, quassù, che nessuno si permette di contraddire. Neanche il sindaco, che ci prova."])]], BG.I), done) },
      ];
      ask("vl_teodora", s >= 10 ? "«Stasera non ho chiuso il lucchetto. L'ho appoggiato, solo appoggiato.»" : "«Dimmi, e fai in fretta: la 18:20 non aspetta nessuno. Neanche me.»", opts, BG.I);
    }
    function fosco() {
      const s = S();
      F.set("fosco_met", true);
      const opts = [
        { label: "Il tredicesimo giocatore", sub: "Una carriera mai iniziata", fn: () => say(sw([["vl_fosco", chip(["Il tredicesimo giocatore non entra mai. Fa quello che nessun altro fa: crede.", "Ho una pettorina con il numero tredici. L'ho lavata sette volte. Una per anno, per i primi sette anni."])]], BG.I), done) },
        { label: "La fotografia del '98", sub: "Ancora sul muro?", fn: () => say(sw(s >= 6 ? [["vl_fosco", "La fotografia: undici in campo e uno in panchina, dice la didascalia. Sulla panchina c'è un ragazzo con dei guanti. Ho la sua faccia davanti agli occhi da ventisei anni."], ["vl_fosco", "Il nome non me lo ricordo. Strano: so il nome di tutti, anche dei miei debitori. Il suo no. Come se qualcuno l'avesse tolto con la gomma. O con il pollice."]] : [["vl_fosco", "La fotografia è tornata nel cassetto. Quando la guardo troppo, l'inchiostro verde sembra respirare."]], BG.I), done) },
      ];
      ask("vl_fosco", s >= 10 ? "«Hai il passo di chi ha visto una porta aprirsi. Siediti: ti offro un panino.»" : "«Entra, entra. Non toccare i palloni: hanno paura.»", opts, BG.I);
    }

    // ---- Ettore e Viola
    function ettore() {
      const z = zoneNow(), s = S(), told = F.get("told", "segreto");
      F.set("ettore_met", true);
      if (z === "vl_campo" && s === 7 && needEttore()) return ettoreSoglia();
      const L1 = told === "mirtilla" ? ["Siamo qui dalle sette. «Brividi d'Alta Quota», 41 iscritti, 40 dei quali mia madre. Una fonte attendibile — Mirtilla — ci ha detto «forse» tre volte. Per noi vale un documento.", "Abbiamo il drone. Non vola, ma è molto minaccioso a terra.", "Il Latte è la nostra puntata più alta. Letteralmente: millecento metri."]
        : ["Siamo saliti per la radio: «alle 18:43 è stato letto un nome». Un nome! A Vallombra! In diretta! Capisci che roba.", "Brividi d'Alta Quota, 41 iscritti. Quaranta sono mia madre, l'altro è mia madre con l'altro account.", "Se mi dici dov'è il fantasma, ti cito nei ringraziamenti. Se non c'è, ti cito comunque."];
      say(sw([["vl_ettore", chip(L1)]], z === "vl_discesa" ? BG.M : BG.P), done);
    }
    function viola() { say(sw([["vl_viola", chip(["Sto filmando il paese. Ho ripreso un gabbiano che mi guardava. Lo uso nel titolo.", "Ettore dice «ci siamo», ogni tre minuti. Finora ci siamo sempre stati.", "Il Latte, in telecamera, viene meno bianco di come sembra. È più… affollato."])]], zoneNow() === "vl_discesa" ? BG.M : BG.P), done); }
    function ettoreSoglia() {
      say(sw([
        ["voce", "Davanti alla porta degli spogliatoi Ettore ha piazzato un cavalletto e Viola una telecamera da spalla. Il sindaco è appena entrato."],
        ["vl_ettore", "In diretta dal Campo Sospeso: il sindaco è sparito negli spogliatoi con un'aria colpevole. Colpevole di cosa non sappiamo, ma sono quarantuno iscritti ad aspettarlo."],
        ["vl_viola", "Sono quaranta. Mamma si è disiscritta durante la partita."], ["vl_ettore", "…Quaranta."],
      ], BG.C), () => ask("voce", "Cosa fai con Ettore?", [
        { label: "«Fermi. È una cosa seria, non uno spettacolo.»", sub: "Sincero", fn: () => ettoreFine("rispetto") },
        { label: "«Alle nove la radio svela tutto. Qui non c'è niente.»", sub: "Una bugia comoda", fn: () => ettoreFine("bugia") },
      ], BG.C));
    }
    function ettoreFine(w) {
      F.set("ettore_t", w); F.set("ettore_via", true);
      if (w === "bugia") F.set("bugia", true);
      const a = w === "rispetto" ? [["vl_ettore", "…Seria. Sì. (abbassa la telecamera) I misteri veri non si riprendono: si aspettano. Lo scrivo nei ringraziamenti."], ["vl_viola", "Lo scrive sempre nei ringraziamenti e poi non lo mette."]] : [["vl_ettore", "Alle nove! Alle nove. Viola, spegni, andiamo a Radio Nebbia a prendere un buon posto. Se c'è un UFO lo voglio di tre quarti."], ["voce", "Se ne vanno tutti e due di corsa, e la porta degli spogliatoi, per la prima volta in tutta la giornata, è solo una porta."]];
      note(w === "rispetto" ? "Ettore e Viola hanno rinunciato alla diretta davanti agli spogliatoi. Ho detto la verità." : "Ho mandato via Ettore e Viola con una bugia: «alle nove la radio svela tutto».");
      say(sw(a, BG.C), () => { done(); });
    }

    // ---- Rosalba e la partita
    function rosalba() {
      const s = S();
      if (s === 6) return say(sw([["vl_rosalba", "Rosalba Tana, capitana delle Marmotte di Valle Fonda. Mi sveglio al fischio: tra cinque minuti, o quando il sindaco finisce il discorso. Il più tardi dei due."]], BG.C), done);
      const o = [{ label: "Parla con Rosalba", fn: () => say(sw([["vl_rosalba", chip(["Le Marmotte hanno tre regole: riposo, riposo e un contropiede. Il contropiede è la parte che si vede.", "Quel «{tiro}» è un tiro serio. Ma le Marmotte fanno un sonno serio. Vediamo chi si sveglia per primo.", "Dormo in panchina e segno al primo tiro. Non è fortuna, è sonno ben allenato."])]], BG.C), done) }, { label: "Rivincita amichevole", sub: "Contro le Marmotte, un tempo", fn: () => matchMarmotte(true) }];
      ask("vl_rosalba", "«Sveglia? No. Ma disponibile.»", o, BG.C);
    }
    function cornelioPrima() {
      const g = has("guanto");
      say(sw([
        ["voce", "Il sindaco sta sul palco con le sette pagine del discorso in mano e il cronometro in tasca. Ti vede arrivare con il pallone in braccio e si ferma a metà di una frase sul turismo."],
        ["vl_cornelio", "…Il Pallone Ufficiale. Il… (si ferma) Dove?"],
        tl({ sicuro: "Nel Latte. Era dove doveva essere.", attento: "Sul dischetto di un campo che non c'è.", ironico: "Aveva preso una scorciatoia di tre decenni." }),
        ["vl_cornelio", "Nel Latte. Naturalmente. Dove altro. (si schiarisce la gola) Il regolamento prevede la verbalizzazione del ritrovamento, un brindisi con acqua del rubinetto e il fischio d'inizio, in quest'ordine. Saltiamo il brindisi: abbiamo fretta."],
      ], BG.C), () => {
        if (!g) return preMatch2();
        ask("voce", "In tasca hai il guanto con la C ricamata.", [
          { label: "Mostragli il guanto", sub: "Guardi la sua faccia", fn: () => guantoMostra(true) },
          { label: "Tieni il guanto in tasca", sub: "Per ora", fn: () => guantoMostra(false) },
        ], BG.C);
      });
    }
    function guantoMostra(y) {
      F.set("guanto_mostrato", y);
      if (!y) return preMatch2();
      note("Ho mostrato il guanto con la C al sindaco. Si è irrigidito, come un palo.");
      say(sw([
        ["voce", "Il sindaco guarda il guanto. Poi guarda te. Poi guarda il guanto, e per un secondo e mezzo sembra molto più giovane e molto più stanco."],
        ["vl_cornelio", "È… un guanto. I guanti sono tutti uguali. Hanno cinque dita: è la loro caratteristica principale."],
        ["voce", "Non te lo restituisce subito. Lo tiene in mano mezzo secondo di troppo, come quel «diciotto e quarantatré»."],
        ["vl_cornelio", "Tienilo tu. Io ho una partita da annunciare."],
      ], BG.C), preMatch2);
    }
    function preMatch2() {
      const id = remoId(), help = remoHelps();
      say(sw([
        ["vl_rosalba", "Ecco il nuovo numero {num}. Bel tiro, dicono, quel «{tiro}». Le Marmotte non sono veloci, ma sono pazienti, e la pazienza segna."],
        [help ? id : "vl_bianca", help ? "Gioco con te, {n}. Per oggi i Camosci sono una squadra mista: noi facciamo il tifo, e io faccio anche il resto." : "Palla a me e sparisci. Se suona la cabina tre, mi fermo; ma stavolta a cabina tre l'ho legata."],
        ["voce", "Fischio d'inizio, alle diciotto in punto. Il Campo Sospeso è pieno come non lo era dal '98: Camosci, Marmotte, curiosi e qualche gabbiano con l'aria di chi ha prenotato."],
      ], BG.C), () => matchMarmotte(false));
    }
    function matchMarmotte(friendly) {
      const help = remoHelps();
      X.playMatch({
        id: "vl2", alt: "hd,az", azPitch: "erba", chap: "Vallombra · Coppa dei Tre Versanti", mate: help ? "Remo" : "Bianca",
        intro: `Prima partita ufficiale della Coppa dei Tre Versanti contro <em>le Marmotte di Valle Fonda</em>, un tempo solo. ${help ? "Remo dei Camosci gioca con te per oggi" : "Bianca gioca con te"}, e dietro le porte il Latte tiene il fiato.`,
        team: (t, s) => ({ vs: "le Marmotte di Valle Fonda", name: "Marmotte di Valle Fonda", color: "#9a7a4a", defs: [["Rosalba Tana", t(s.drib * 0.8)], ["Pina Tana", t(s.drib * 0.84)], ["Il Tasso", t(s.drib * 0.82)]], atk: [["Rosalba Tana", t(s.tiro * 0.9)], ["Ugo Sotterra", t(s.tiro * 0.8)]], gk: ["Orsolina Tana", t(s.tiro * 0.97)], power: t(s.tiro * 0.8), special: ["IL RISVEGLIO DELLE MARMOTTE", t(s.tiro * 1.12)] }),
        done: (r) => matchFine2(r, friendly),
      });
    }
    function matchFine2(r, friendly) {
      F.set("m2_a", r.a); F.set("m2_b", r.b);
      const first = !has("m2_played");
      if (friendly && !first) {
        const msg = r.win ? reward("vl_m2_win", { coins: 10 }) : [];
        return X.say(sw([["voce", `Rivincita finita ${r.a}–${r.b}.${msg.length ? " " + msg.join(" · ") + "." : ""}`], ["vl_rosalba", r.win ? "Mi sono svegliata tardi. Succede. Al ritorno dormo meno." : "Una vittoria piccola, lenta, comoda. Come una cuccetta."]], BG.C), done);
      }
      F.set("m2_played", true); F.set("m2_win", r.win);
      const rw = [...reward("vl_m2_cos", { cos: "vl_marmotta" }), ...(r.win ? reward("vl_m2_win", { coins: 10 }) : [])];
      const help = remoHelps(), id = remoId();
      const L1 = r.win ? [
        ["voce", `Finisce ${r.a}–${r.b}.`],
        ["vl_rosalba", "Perso! Ma è un bel perdere: stanchezza onesta, quella di una marmotta che ha corso. Tornerò in letargo con la coscienza a posto."],
        ["vl_cornelio", "VITTORIA, per la seconda volta in due giorni! Il Comune la riconosce come tale e propone una targa. Una targa piccola, per ragioni di bilancio."],
      ] : [
        ["voce", `Finisce ${r.a}–${r.b}.`],
        ["vl_rosalba", "Vinto! Con la calma, con il sonno, con un contropiede. Nella nostra famiglia lo chiamiamo «effetto marmotta». Non lo spieghiamo: lo ripetiamo."],
        ["vl_cornelio", "Una sconfitta onorevole! Il comunicato del Comune ha la parola «onorevole» in grassetto, già stampato da stamattina per prudenza."],
      ];
      const remoLine = help ? [[id, r.win ? "Abbiamo giocato insieme. Non lo dirò a Cima Alta. Lo scriverò sul muro del bagno, quando sarò solo." : "Peccato. Ma ho giocato nei tuoi colori: da oggi la giornata peggiore della mia vita ha una maglia."]] : [[id, F.get("remo", 1) === 3 ? "Non mi è dispiaciuto vedervi correre. Non lo ripeto." : "Bella partita, {n}. Ci vediamo a Cima Alta: lì giochiamo sul serio."]];
      note(r.win ? `Prima partita di Coppa vinta ${r.a}–${r.b} sulle Marmotte.` : `Prima partita di Coppa persa ${r.a}–${r.b} con le Marmotte.`);
      X.say(sw([...L1, ...remoLine, ...(rw.length ? [["voce", rw.join(" · ") + "."]] : []),
        ["voce", "Sul palco, Cornelio guarda l'orologio. Sono le diciotto e quarantadue. Il sindaco sta zitto, che è un fatto già straordinario."],
        ["voce", "Alle diciotto e quarantatré in punto fa un passo indietro dal palco, come ogni sera. Poi un secondo passo. Poi un terzo. Poi gira l'angolo dietro gli spogliatoi, con la fascia tricolore in mano come uno straccio."],
        ["vl_bianca", "Hai visto? Non è andato a prendere un caffè. Ha camminato come uno che va a un funerale in cui è l'unico invitato."]], BG.C), () => { setStep(N, 7); note("Alle 18:43, finita la partita, il sindaco è scomparso dietro gli spogliatoi."); done(); });
    }

    // ---- Cornelio
    function cornelio() {
      const z = zoneNow(), s = S();
      F.set("cornelio_met", true);
      if (z === "vl_spogliatoi") return s === 8 ? confessione() : s === 7 ? (setStep(N, 8), confessione()) : done();
      if (s === 6) return cornelioPrima();
      const L1 = s >= 10 ? ["Stamattina ho aperto il discorso con una frase nuova. Non era una frase del tutto vera. Ma era di quelle che ci si prova.", "Alle 18:43 faccio ancora il passo indietro. Ma ora so per chi."] : s >= 3 ? ["Se il pallone non si trova, il regolamento prevede la cerimonia funebre del pallone. Durata: nove minuti. Ci vuole un oratore. Sono io.", "Non scendere sul sentiero dopo le sei, ragazzo. Non… non dopo le sei. Dico per l'orario."] : ["Il pubblico di oggi: due Camosci, un gabbiano, Mirtilla in lontananza e io. Un'affluenza record.", "Una cosa che il sindaco non dice nei discorsi: ogni sera, alle 18:43, faccio un passo indietro dal palco. Per ragioni di sicurezza. Del palco."];
      ask("vl_cornelio", s >= 10 ? "«Sindaco, a disposizione. Fuori orario, ma a disposizione.»" : "«Possiamo ripetere la partita di presentazione, se il pubblico lo chiede. Il pubblico, al momento, sono io.»", [{ label: "Chiedi del sindaco", fn: () => say(sw([["vl_cornelio", chip(L1)]], BG.C), done) }], BG.C);
    }
    function confessione() {
      const gm = has("guanto_mostrato");
      say(sw([
        ["voce", "Il sindaco è seduto sulla panca in fondo, davanti all'ultimo armadietto, quello con lo sportello socchiuso. Non ha più il discorso in mano: ha un guanto da portiere, piccolo, di cuoio vecchio. Il destro."],
        ["vl_cornelio", gm ? "Me l'hai mostrato, prima. Ho fatto finta di niente. Faccio finta di niente da ventisei anni, ci sono diventato bravo: ma non così bravo." : "Entra. Chiudi la porta, i fantasmi fanno corrente."],
        tl({ sicuro: "Sapevo che sarebbe venuto qui, sindaco.", attento: "Ogni sera alle 18:43 fa un passo indietro dal palco. L'ho contato.", ironico: "Un sindaco in uno spogliatoio, al buio. Capita nelle migliori commedie e nelle peggiori tragedie." }),
        ["vl_cornelio", "Dodici armadietti. Undici in campo, uno in panchina. Il dodicesimo è questo. Era mio."],
        ["voce", "L'orologio sul muro è fermo sulle sei e quarantatré. Sullo sportello socchiuso, sotto la vernice, una targhetta tolta con un coltello: restano i quattro buchi delle viti."],
        ["vl_cornelio", "Avevo vent'anni. Ero il portiere di riserva degli Stambecchi, e il mio compito in panchina era tenere caldi i guanti. Il titolare era un altro, un ragazzo che… (si ferma) il suo nome non lo dico io. Lo dirà chi ha il diritto di dirlo."],
        ["vl_cornelio", "Era la finale. Al quarantatreesimo del secondo tempo l'arbitro fischiò un fallo che non c'era, e fischiò storto: corto, lungo, corto. Aurelio Brinzi, il capitano, lo sentì e capì. Non so cosa capì. Si voltò verso la panchina e gridò una sola parola: «La miniera!»"],
        ["vl_cornelio", "In un minuto la squadra era fuori dal campo. Scesero tutti di corsa lungo il sentiero, in maglia e scarpini. Sotto c'era il turno di notte: quattordici uomini. Aurelio mi lanciò il fischietto dei minatori, quello del «tutti fuori»: «Corné, se senti il botto, fischia forte, così sapranno quanto manca. Tu resta qui.»"],
        ["vl_cornelio", "Sentii il botto. Alle diciotto e quarantatré, per l'esattezza: il campo tremò, il Latte salì, il cielo diventò latte. Il fischietto era in mano mia. Avevo le labbra aperte."],
        ["vl_cornelio", "E non fischiai. Mi infilai in questo armadietto, con lo sportello chiuso dall'interno. Per un'ora. Per due. Quando uscii il sentiero non c'era più e il paese diceva che la squadra era scappata."],
        ["vl_cornelio", "Non l'ho mai corretto. Io, che avevo il fischietto. Io, che sapevo. Ho lasciato che li chiamassero vigliacchi per ventisei anni, per non dover dire chi lo era davvero."],
        ["vl_cornelio", "Mi hanno fatto sindaco. Ogni sera alle diciotto e quarantatré dico una frase al palco, una qualunque, e faccio un passo indietro per lasciare il posto a chi non è tornato. Non è tradizione, {n}. È una penitenza con la fascia tricolore."],
      ], BG.S), () => ask("voce", "Cosa rispondi a Cornelio?", [
        { label: "«Eri un ragazzo di vent'anni, spaventato.»", sub: "Comprensione", fn: () => corn("comp") },
        { label: "«Il paese deve sapere la verità. Tutta.»", sub: "Verità", fn: () => corn("verita") },
        { label: "Siedi accanto a lui, in silenzio.", sub: "Presenza", fn: () => corn("silenzio") },
      ], BG.S));
    }
    function corn(t) {
      F.set("cornelio_t", t);
      const a = t === "comp" ? [["vl_cornelio", "Vent'anni. Sì. Ma quel ragazzo è diventato un uomo di quarantasei che ha avuto ventisei anni per correggersi, e ha usato quel tempo per scrivere discorsi. Mi hai fatto un regalo e un affronto insieme. Come i sindaci."], ["voce", "Per la prima volta il sindaco sorride. È un sorriso piccolo, storto, e tutto vero."]]
        : t === "verita" ? [["vl_cornelio", "Lo so. Lo so da ventisei anni. È facile dirlo, sai, a chi non c'era. (alza la testa) Ma hai ragione, {n}. Ho più paura della verità che del Latte. E il Latte, stasera, l'ho guardato in faccia."], ["vl_cornelio", "Lo dirò. Non stasera: non reggo la piazza, stasera. Ma lo dirò. Ti do la mia parola, che a un sindaco costa."]]
          : [["voce", "Ti siedi. La panca è fredda e scricchiola. Non dici niente. Cornelio non dice niente. Fuori il Latte fa il suo rumore di sala d'attesa."], ["vl_cornelio", "…Grazie. In ventisei anni nessuno si è seduto accanto a me senza parlare. Il silenzio, da soli, è una stanza stretta; in due diventa uno spogliatoio."]];
      say(sw(a, BG.S), corn2);
    }
    function corn2() {
      const t = F.get("cornelio_t", "silenzio");
      say(sw([
        ["voce", "Cornelio ti porge il guanto destro. Tu tiri fuori il sinistro, quello del dischetto. Messi uno accanto all'altro, i due guanti fanno un paio. Sul polsino di entrambi, la stessa C ricamata a filo rosso."],
        ["vl_cornelio", "Il Latte te l'ha dato. Allora aveva ragione il Lampionaio, quando mi lasciava un biglietto sotto la porta del municipio: «IL PORTIERE TORNERÀ.» Pensavo ce l'avesse con me. Ce l'aveva con loro."],
        ["voce", "Dalla tasca interna della giacca tira fuori un fischietto di ottone, annerito, con un nastro rosso sbiadito. Il fischietto del turno di notte."],
        ["vl_cornelio", "Non l'ho mai usato. Non ho mai avuto il coraggio di buttarlo. Prendilo. Se qualcuno deve fischiare, non sarò io: sono troppo in ritardo. Tu forse no."],
      ], BG.S), () => {
        F.set("fischietto", true); F.set("s2_locker", true);
        note("Cornelio era il portiere di riserva del '98: non fischiò, si nascose. Mi ha dato il fischietto dei minatori.");
        if (F.get("funivia", "aperta") === "chiusa") return teodoraEntra(t);
        ask("voce", "Cornelio ti guarda. «E adesso… Teodora. Lo dirai a lei?»", [
          { label: "«Glielo dirò io, con le parole più piccole che ho.»", sub: "Lo dirai", fn: () => teoScelta("dirai") },
          { label: "«Aspetto che sia lei a chiedertelo, quando se la sente.»", sub: "Aspetterai", fn: () => teoScelta("aspetto") },
        ], BG.S);
      });
    }
    function teoScelta(w) {
      F.set("teodora_sa", w);
      const a = w === "dirai" ? [["vl_cornelio", "Giusto. Dillo con le parole più piccole che hai. Le grandi, a Teodora, non le ha mai sopportate."]] : [["vl_cornelio", "Aspettare. Io ci sono bravo, sai? Ho ventisei anni di pratica. Ma almeno aspetterò senza nascondermi."]];
      say(sw(a, BG.S), fineSpogliatoi);
    }
    function teodoraEntra(t) {
      F.set("teodora_sa", "sa");
      say(sw([
        ["voce", "La porta cigola. Sulla soglia c'è Teodora, con il cappotto della stazione e il registro sotto il braccio. Ha l'aria di chi ha seguito il sindaco per dodici minuti e ne ha ascoltati sette."],
        ["vl_teodora", "Mi fido di te, ragazzo. Con la funivia chiusa ho visto la cabina partire lo stesso, e ho pensato: questa persona ascolta anche i fischi che non ha sentito. Sono venuta dietro di voi."],
        ["vl_cornelio", "Teodora… tuo fratello mi disse di restare e di fischiare. Io…"],
        ["vl_teodora", t === "verita" ? "Lo dirai al paese. E io starò in piazza, in prima fila. Non per perdonarti: per ascoltare." : t === "comp" ? "Hai passato ventisei anni in questa stanza, Cornelio. Io ventisei anni su una banchina. Non siamo molto diversi: solo che io avevo l'orario." : "Non dico niente. Se parlo adesso è per ferire, e non voglio. Domani. Non stasera. Stasera sono soltanto la sorella di Aurelio."],
        ["vl_teodora", "Aurelio mi disse una frase, l'ultima volta: «Tieni caldo l'orario.» Non ho mai capito chi dovesse tenerlo caldo. Credevo fosse un compito. Era un invito ad aspettare."],
      ], BG.S), fineSpogliatoi);
    }
    function fineSpogliatoi() {
      const t = F.get("cornelio_t", "silenzio");
      say(sw([
        ["vl_cornelio", "Vai. Il Latte non aspetta, e neanche il resto. Io… resto un momento con i guanti."],
        ["voce", "Quando esci, l'aria della notte ha l'odore di cera e di nebbia. Il Campo Sospeso è vuoto, i fari sono spenti. Sotto il parapetto il Latte si è alzato di un metro, e respira."],
        ["vl_noemi", F.get("told", "segreto") === "mirtilla" ? "…Radio Nebbia, qui Noemi, con un avviso agli ascoltatori che stanno filmando il sentiero con un cavalletto: Ettore, non è un UFO. Meteo: nebbia. E, alle 18:43, tre colpi dall'Imbocco, di nuovo. Chi ascolta, risponda." : "…Radio Nebbia, qui Noemi. Meteo: nebbia. Alle 18:43 il Latte ha mandato in onda un suono nuovo: tre colpi, dall'Imbocco. Corto, lungo, corto. Chi ascolta, risponda."],
      ], BG.C), () => {
        if (t !== "verita") X.lanAdd("vl_cornelio");
        setStep(N, 9); note("Tre colpi dall'Imbocco: corto, lungo, corto. Qualcuno bussa da dentro."); go("vl_campo", 3, 9);
      });
    }

    // ---- il Latte: ingresso, Ancore, pallone
    function latteIngresso() {
      if (has("latte_ingr")) { if (S() < 5) setStep(N, 5); return go("vl_latte", 4, 3); }
      F.set("latte_ingr", true);
      const l = F.get("latte", 0), c = has("compass"), old = F.get("kit", "") === "old";
      say(sw([
        ["voce", "In fondo ai tornanti il sentiero finisce su una sporgenza di roccia grande come una tovaglia. Oltre il bordo c'è il Latte: da qui non è più un panorama, è un posto. Il bianco arriva al petto e aspetta."],
        ["vl_agata", "Sono arrivata prima, con la corda e il quaderno. Non entro: il mio compito è tenere l'altro capo. Se il Latte sale, tira tre volte."],
        ["vl_agata", "Ho misurato tre punti dove il bianco è più duro. Chiamiamole Ancore: lanterne agganciate al fondo che reggono un pezzo di Latte fermo. Se le accendi, il Latte ti lascia passare. La prima è a EST, nel corridoio di assi."],
        ...(c ? [["vl_agata", "La bussola ti aiuterà: l'ago segue la luce, e dove le Ancore chiamano, punta. Quando il bianco ti fa girare la testa, guarda l'ago."]] : [["vl_bianca", "Senza bussola ti faccio strada io: a me le lanterne parlano. Voglio dire: i bulloni delle lanterne. Mi metto avanti, seguimi e non toccare niente di lucido."]]),
        ["voce", l === 1 ? "Sul bordo, appena visibile, il gesso del Lampionaio: «LA FRETTA, L'ALTRA VOLTA. ORA È DIVERSO.» Quasi un rimprovero, quasi un invito." : "Sul bordo, appena visibile, il gesso del Lampionaio: «HAI ASPETTATO. ORA PUOI.» Sembra, quasi, un grazie."],
        tl({ sicuro: "Va bene. Entriamo.", attento: "Conto i passi. Se tiro tre volte, tornate a prendermi.", ironico: "Un'altra giornata di lavoro in un mare che non bagna." }),
        ...(old ? [["voce", "La cucitura della maglia vecchia, sulla spalla, brilla appena: il Latte ti sente e fa un passo indietro per lasciarti spazio."]] : []),
      ], BG.L), () => { setStep(N, 5); note("Sono sceso al Latte: tre Ancore da accendere. Agata tiene l'altro capo della corda."); go("vl_latte", 4, 3); });
    }
    const ANCN = (tx, ty) => ANC[tx + "," + ty] || 0;
    function ancora({ tx, ty }) {
      const n = ANCN(tx, ty);
      if (has("anc" + n)) return say(sw([["voce", "L'Ancora è accesa e ferma, come un faro che ha smesso di cercare qualcuno." + (n === 3 ? " Il cerchio di nebbia intorno al dischetto è aperto." : "")]], BG.L), done);
      if (n === 1) return anc1(); if (n === 2) return anc2(); if (n === 3) return anc3();
      done();
    }
    function ancGiu(n, txt) { F.set("anc" + n, true); const m = reward("vl_anc" + n, { coins: 5 }); note(txt); X.api.trToast(["", "Prima Ancora accesa", "Seconda Ancora accesa", "Terza Ancora accesa"][n] + (m.length ? " · " + m.join(" · ") : "")); }
    function anc1() {
      const old = F.get("kit", "") === "old";
      say(sw([
        ["voce", "Una lanterna di ferro pende da un gancio che non è appeso a niente. Dentro, il lumino è spento. A terra, il solco di una corda che qualcuno, tanto tempo fa, ha tirato per l'ultima volta."],
        ["voce", has("compass") ? "L'ago della bussola si ferma, soddisfatto, puntando alla lanterna." : "Bianca picchietta un bullone con la chiave inglese: «Vibra. È quella giusta.»"],
        ["voce", "Appoggi al lumino una scheggia di lumina. La fiamma attacca come se avesse aspettato un fiammifero per ventisei anni."],
        ["voce", "E il Latte risponde. Non è un suono: è una folla. «Brinzi! Brinzi! Lampo! Lampo!» Poi un tamburo, una trombetta, il rotolare di un pallone su un prato di bianco."],
        ...(old ? [["voce", "Poi la luce tocca la cucitura della tua maglia, e il coro si ferma. Una voce sola, da lontano, dice a bassa voce: «È arrivato il tredicesimo.»"]] : [["voce", "Poi la folla si ferma di colpo, come quando tutti guardano la stessa cosa. Una voce, da lontano, dice sottovoce: «…è tardi. Dov'è il tredicesimo?»"]]),
        tl({ sicuro: "Sono io. Sono qui.", attento: "Brinzi. Lampo. Due nomi: uno è un soprannome, l'altro un cognome. So chi cerco.", ironico: "Per un mare di nebbia ha un pubblico molto caloroso." }),
        ["voce", "Davanti a te la nebbia fitta si scioglie come una tenda tirata da una mano gentile. Il corridoio prosegue a est."],
      ], BG.L), () => { ancGiu(1, "Prima Ancora accesa: il Latte ha riaperto un corridoio verso est."); X.setTiles(19, 2, 20, 4, "g"); done(); });
    }
    function anc2() {
      say(sw([
        ["voce", "Al centro della piazza c'è la seconda lanterna. Non si accende con la lumina: la scheggia non attacca. Sulla base, scritto a gesso: «NON SI ACCENDE. SI CHIAMA.»"],
        ["voce", "Capisci che serve un fischio. Quale? Quello giusto, o il Latte non apre. (Il taccuino, dal menu in basso, ricorda cosa ha misurato Agata.)"],
      ], BG.L), () => fischio([]));
    }
    function fischio(seq) {
      const want = ["c", "l", "c"], nm = { c: "corto", l: "lungo" };
      if (seq.length >= 3) {
        if (seq.every((x, i) => x === want[i])) return anc2Ok();
        const e = F.add("fischi_err", 1);
        const hint = e === 1 ? (has("compass") ? "L'ago della bussola batte contro il vetro: tic… TOC… tic." : "Bianca, a mezza voce, ritmando col piede: «corto… lungo… corto».") : "La lanterna si accende per un istante e scrive nel bianco, a lettere di luce: CORTO · LUNGO · CORTO.";
        return say(sw([["voce", `Fischi: ${seq.map((x) => nm[x]).join(" · ")}. Il Latte scuote la testa con una pazienza da bibliotecaria.`], ["voce", hint]], BG.L), () => fischio([]));
      }
      ask("voce", `Prendi fiato. Il fischio giusto è quello sbagliato.${seq.length ? " Finora: " + seq.map((x) => nm[x]).join(" · ") + "." : ""}`, [
        { label: "Fischio corto", sub: "Un colpo secco", fn: () => fischio(seq.concat("c")) },
        { label: "Fischio lungo", sub: "A pieni polmoni", fn: () => fischio(seq.concat("l")) },
      ], BG.L);
    }
    function anc2Ok() {
      say(sw([
        ["voce", "Il fischio esce storto, esatto, fuori tempo di proposito. La lanterna si accende con un colpo di luce che non fa ombra."],
        ["voce", "Dal bianco sale un altro rumore: quello di una panchina. Voci di ragazzi, un tintinnio di scarpini, una radiolina. Poi due voci vicine, a mezzo tono:"],
        ["voce", "«Mister, e io?» — «Tu resti qui, in panchina. Tieni caldi i guanti.» — «…Agli ordini.»"],
        ["voce", "Poi il fischio della finale, storto come il tuo. E un respiro di gente che si alza tutta insieme."],
        ["voce", "A ovest, nel corridoio basso, la nebbia fitta si apre come una porta a due ante."],
      ], BG.L), () => { ancGiu(2, "Seconda Ancora accesa: in panchina c'era uno che teneva caldi i guanti."); X.setTiles(15, 15, 16, 16, "g"); done(); });
    }
    function anc3() {
      say(sw([
        ["voce", "Sul lato dell'isola, accanto a una panchina di nebbia, la terza lanterna ha un lumino spento. Questa non si accende con una scheggia né con un fischio: vuole un nome."],
        ["voce", "Ai piedi della lanterna, in lettere di gesso: «DI' CHI SEI.»"],
      ], BG.L), () => ask("voce", "Cosa dici alla lanterna?", [
        { label: "Il tuo nome: «{n}»", sub: "Chi sei per gli altri", fn: () => anc3Ok("nome") },
        { label: "Il tuo numero: «{num}»", sub: "Il posto che ti aspettava", fn: () => anc3Ok("numero") },
        { label: "Il tuo tiro: «{tiro}»", sub: "Chi sei con il pallone", fn: () => anc3Ok("tiro") },
      ], BG.L));
    }
    function anc3Ok(w) {
      F.set("anc3_via", w);
      const a = w === "nome" ? ["La lanterna ripete il tuo nome a mezza voce, due volte, come per impararlo. Sembra volerti bene più del necessario."] : w === "numero" ? ["La lanterna ripete il numero {num} e si accende di colpo: un posto, finalmente, occupato."] : ["La lanterna ripete «{tiro}» con la voce di tanti, e si accende bianca come una vittoria. Il Latte ha un debole per i tiri con un nome."];
      say(sw([["voce", a[0]], ["voce", "Intorno al dischetto, al centro dell'isola, il cerchio di nebbia fitta si apre in quattro petali. Al centro qualcosa respira, tondo e chiaro."]], BG.L), () => { ancGiu(3, "Terza Ancora accesa: il cerchio intorno al dischetto è aperto."); ring(); done(); });
    }
    function palla() {
      if (has("ball")) return done();
      say(sw([
        ["voce", "Al centro del cerchio, sul dischetto, c'è il Pallone Ufficiale del '98: cuoio chiaro, cuciture annerite, un'etichetta sbiadita «COPPA DEI TRE VERSANTI». Non è fermo: respira, appena, come un animale che dorme."],
        ["voce", "Mentre ti chini, il Latte intorno prende forma: due pali, una traversa, una rete di nebbia. Nella porta c'è una sagoma piccola, con guanti troppo grandi, che si sistema sulla linea come chi non ha mai giocato una partita vera."],
        ["voce", "Il Latte pronuncia «{tiro}», a bassa voce, come si pronuncia il nome di un parente."],
        tl({ sicuro: "Ventisei anni di attesa. Li risolvo in un tiro.", attento: "È piccolo. Il guanto è troppo grande, o la mano è troppo giovane.", ironico: "Mai segnato a un portiere di nebbia. Curriculum arricchito." }),
      ], BG.L), () => ask("voce", "Come tiri?", [
        { label: "Con tutta la forza", sub: "{tiro}, a pieno ritmo", fn: () => tiroLatte(1) },
        { label: "Piazzato, con calma", sub: "Scegli l'angolo", fn: () => tiroLatte(2) },
        { label: "Un tocco morbido", sub: "Quasi uno scusa", fn: () => tiroLatte(3) },
      ], BG.L));
    }
    function tiroLatte(k) {
      F.set("tiro_latte", k);
      const a = k === 1 ? "Calci con tutto quello che hai. Il portiere di nebbia si tuffa con molta convinzione e tre secondi di ritardo: {tiro} entra come {tipo}." : k === 2 ? "Scegli l'angolo con la pazienza di chi ha tempo. Il portiere sceglie l'angolo opposto e saluta il tiro con la mano, per educazione." : "Un tocco morbido, quasi un permesso. Il portiere tende le braccia; il pallone gli passa tra i guanti, come tra due persone che non si sono mai incontrate.";
      say(sw([
        ["voce", a],
        ["voce", "Silenzio. Poi l'intero Latte esplode: ventisei anni di «gol» arrivano insieme, e il bianco trema come un lenzuolo steso al vento. Un fischio lungo, di soddisfazione. Poi niente."],
        ["voce", "Il portiere di nebbia si toglie il guanto sinistro, lo posa sul dischetto e resta lì un momento con la mano nuda. Poi si dissolve con la scrupolosa lentezza di chi ha paura di disturbare."],
        ["voce", "Sul dischetto resta un guanto da portiere, piccolo, di cuoio vecchio. All'interno del polsino, ricamata a filo rosso, una C."],
        ["voce", "Il pallone ti rotola ai piedi, tiepido. Il Latte, delicato, ti prende sotto le braccia, si fa per dire, e ti riporta su, in un modo che a descriverlo si perde il filo."],
      ], BG.L), () => {
        F.set("ball", true); F.set("guanto", true); X.setTiles(9, 22, 9, 22, "p");
        const m = reward("vl_ball", { coins: 10 });
        note("Ho ritrovato il Pallone Ufficiale sul dischetto del Latte. Il portiere di nebbia ha lasciato un guanto con una C.");
        setStep(N, 6); X.api.trToast(m.length ? m.join(" · ") : "Pallone Ufficiale ritrovato"); go("vl_campo", 12, 16);
      });
    }
    function echoStone() { say(sw([["voce", chip(ECHO)]], BG.L), done); }
    function panchinaLatte() { say(sw([["voce", "Una panchina di nebbia, a dodici posti. Undici sono vuoti da ventisei anni; il dodicesimo, in fondo, è appena stato lasciato libero. Il sedile è ancora tiepido, e qualcuno ci ha dimenticato un nastro per i capelli. No: un laccio da guanto."]], BG.L), done); }

    // ---- Imbocco, Campo, spogliatoi
    function gateImbocco() {
      if (S() < 3) return say(sw([["voce", "Il sentiero finisce contro la roccia. Nient'altro."]], BG.M), done);
      const go2 = () => { if (S() === 3) { setStep(N, 4); note("Dal cancello nuovo dell'Imbocco il sentiero dei Lampioni scende verso il Latte."); } go("vl_discesa", 2, 3); };
      if (!has("gate_seen")) { F.set("gate_seen", true); return say(sw([["voce", "Il cancello nuovo è di legno chiaro, e sa di cera. Una freccia gialla, a gesso, indica il basso. Sembra lì da sempre e da stamattina."]], BG.M), go2); }
      go2();
    }
    function doorSpog() {
      const s = S();
      if (s < 7) return say(sw([["voce", chip(["Gli spogliatoi: una baracca di legno che cigola in due note. Dentro, ganci, panche e un'aria di sconfitte rispettabili.", "Sul muro dello spogliatoio, a pennarello: «Chi perde offre. Chi vince offre di più.» Lo ha scritto Fosco, nel '97."])]], BG.C), done);
      if (s === 7 && needEttore()) return say(sw([["voce", "Davanti alla porta degli spogliatoi Ettore ha piazzato un cavalletto, e Viola una telecamera. Così non si entra: parla prima con Ettore."]], BG.C), done);
      if (s === 7) setStep(N, 8);
      if (s <= 8) return go("vl_spogliatoi", 7, 7);
      say(sw([["voce", "Gli spogliatoi sono vuoti e in ordine. Sull'ultimo armadietto, lo sportello aperto mostra due guanti da portiere, appesi a un gancio."]], BG.C), done);
    }
    function locker({ tx }) {
      const n = tx - 1, h = hero(), me = h && +h.num === n;
      const t = {
        1: "N. 1 · «PORTIERE». Il nome è stato grattato via con la punta di un coltello. Dentro, due ginocchiere e un tubo di crema per le mani, ancora aperto.",
        2: "N. 2. Dentro, un paio di scarpini con la suola consumata solo sul lato sinistro. Un biglietto: «Mi hanno detto di correggere il piede. Il piede non ascolta.»",
        3: "N. 3. Dentro, una sciarpa blu notte e ambra, annodata a un gancio con un nodo che sembra una promessa.",
        4: "N. 4. Dentro, una lattina di cioccolata di nebbia, vuota, con la scritta a pennarello «DOPO LA PARTITA».",
        5: "N. 5. Dentro, un fischietto d'arbitro regalato per scherzo, con un biglietto: «Per quando sarete stufi di me».",
        6: "N. 6. Dentro, una divisa piegata come una bandiera e un rosario di gomma da masticare.",
        7: "N. 7. Dentro, un mazzo di carte da briscola con una carta in più: un dodici.",
        8: "N. 8. Dentro, un quaderno di formazioni disegnate a matita. Tutte con undici nomi. In fondo a ogni pagina, un dodicesimo cerchio, vuoto.",
        9: "N. 9. Dentro, una foto ritagliata da un giornale: una squadra in fila, undici sorrisi e un'ombra sulla panchina.",
        10: "N. 10 · «A. BRINZI — CAPITANO». Dentro, una fascia sbiadita e, appuntato sul fondo, un biglietto: «Se non torno, la fascia la porta chi torna.»",
        11: "N. 11. Dentro, un paio di guanti da inverno e una lettera mai spedita, con la scritta «PER LA NONNA, CHE LI HA FATTI».",
      };
      let txt = n === 12 ? (has("s2_locker") ? "N. 12. Sullo sportello aperto la targhetta è tornata, a lettere nuove: «C. BRUMASECCA · PORTIERE (RISERVA)». Dentro, scarpini mai usati e un gancio vuoto, dove stavano i guanti." : "N. 12. Sportello socchiuso, targhetta tolta con un coltello: restano i buchi delle viti. Dentro, scarpini mai usati e un gancio vuoto, dove si appendono i guanti.") : t[n] || "Un armadietto di ferro, tiepido.";
      if (me) txt += " Sul bordo c'è un adesivo, nuovo di zecca: «RISERVATO AL TREDICESIMO.»";
      say(sw([["voce", txt]], BG.S), done);
    }

    // ---- finale: l'Imbocco
    function lampionaio() {
      if (S() !== 9) return done();
      const fis = has("fischietto");
      say(sw([
        ["voce", "Davanti all'imbocco, nella notte, il Lampionaio è fermo con la lanterna alta e il berretto da fabbro. Non scrive niente. Ascolta."],
        ["voce", "Dalle assi arriva un bussare. Tre colpi: corto, lungo, corto. Poi una pausa. Poi di nuovo. Come un fischio che non ha il fiato per essere un fischio."],
        ["voce", "Il Lampionaio solleva la lavagna di lumina. Il gesso scrive piano: «DA DENTRO.»"],
        ...(fis ? [["voce", "Il fischietto di ottone, nella tua tasca, diventa tiepido come un animale che ha riconosciuto una voce."]] : []),
        ["voce", "I chiodi delle assi cominciano a uscire da soli, uno dopo l'altro, dalla parte sbagliata, con un piccolo suono di denti che si staccano. La prima asse cade. La seconda. La terza."],
        ["voce", "Dietro c'è un corridoio di binari e di luce turchese che respira. In fondo, in fila, undici piccole luci ferme, come lanterne a una veglia. E una dodicesima, più piccola e più lontana, ancora spenta."],
        tl({ sicuro: "Ci scendiamo. Tutti.", attento: "Undici. E una dodicesima, spenta. So di chi è.", ironico: "Per un Imbocco chiuso da ventisei anni ha un ottimo servizio d'accoglienza." }),
        ["voce", "La luce si abbassa, come per dire: «Adesso tocca a voi.» Sulla lavagna: «LA PRIMA GALLERIA È APERTA.»"],
        ["vl_noemi", "…Radio Nebbia, qui Noemi. Meteo: nebbia. E nel mezzo della nebbia, adesso, una porta. Ripeto: una porta. Chi ascolta, vada a vedere. E porti una lanterna."],
      ], BG.M), fineCapitolo);
    }
    function fineCapitolo() {
      X.finishChapter(N, "latte"); setStep(N, 10); note("Le assi dell'Imbocco sono cadute da dentro: la prima galleria è aperta.");
      const rw = reward("vl_ch2", { coins: 50, cos: "vl_stemma_latte" });
      X.say(sw([["voce", "CAPITOLO 2 · IL LATTE · CONCLUSO"], ["voce", (rw.length ? rw.join(" · ") + ". " : "") + "L'Imbocco è aperto. Il Capitolo 3 comincia da qui: parla con chi ti aspetta sul sentiero, davanti alle assi cadute."]], BG.M), done);
    }

    // ---- oggetti
    const obj = {
      "vl_miniera:>": gateImbocco,
      "vl_miniera:X": () => say(sw([["voce", S() >= 9 ? "Le assi dell'imbocco vibrano al ritmo di tre colpi. Corto, lungo, corto. Dal basso, da dentro." : "Le assi dell'imbocco sono inchiodate da fuori. Ma i chiodi sono arrugginiti dalla parte sbagliata: come se fossero stati piantati da dentro."]], BG.M), done),
      "vl_discesa:<": () => go("vl_miniera", 25, 12),
      "vl_discesa:n": ({ tx, ty }) => say(sw([["voce", SIGNS[tx + "," + ty] || "Gesso sulla roccia: «CONTINUA.»"]], BG.M), done),
      "vl_discesa:d": latteIngresso,
      "vl_latte:^": () => go("vl_discesa", 23, 21),
      "vl_latte:A": ancora,
      "vl_latte:U": palla,
      "vl_latte:E": echoStone,
      "vl_latte:b": panchinaLatte,
      "vl_spogliatoi:K": locker,
      "vl_spogliatoi:b": () => say(sw([["voce", "Una panca di legno consumata dai sederi di dodici paure diverse."]], BG.S), done),
      "vl_spogliatoi:Z": () => go("vl_campo", 3, 9),
      "vl_campo:w": doorSpog,
    };
    const talk = { vl_mirtilla: mirtilla, vl_noemi: noemi, vl_agata: agata, vl_remo: remo, vl_remo_ns: remo, vl_tonio: tonio, vl_gisella: gisella, vl_bianca: bianca, vl_teodora: teodora, vl_fosco: fosco, vl_cornelio: cornelio, vl_ettore: ettore, vl_viola: viola, vl_rosalba: rosalba, vl_lampionaio: lampionaio };

    return {
      n: N, title: "Il Latte", sub: "Una Coppa da giocare, un pallone che scappa e la nebbia che ti aspetta", start: "vl_paese", zones, talk, obj, goal, mood,
      news: (id, s) => {
        const z = zoneNow();
        if (id === "vl_mirtilla") return s === 0;
        if (id === "vl_noemi") return s === 1;
        if (id === "vl_agata") return s === 2 && z === "vl_campo";
        if (id === "vl_remo" || id === "vl_remo_ns") return (s === 3 && z === "vl_miniera") || (s >= 4 && s <= 5 && z === "vl_discesa" && !has("remo_help") && !has("remo_pent"));
        if (id === "vl_cornelio") return (s === 6 && z === "vl_campo") || (s === 8 && z === "vl_spogliatoi");
        if (id === "vl_ettore") return s === 7 && needEttore() && z === "vl_campo";
        if (id === "vl_lampionaio") return s === 9;
        return false;
      },
      intro: () => {
        const told = F.get("told", "segreto"), fun = F.get("funivia", "aperta");
        return [
          ["voce", "Il mattino dopo, Vallombra si sveglia con la radio accesa e le finestre aperte. Alle 18:43 di ieri il Latte ha letto un nome. Nel tempo di una cioccolata, il paese lo sa.", BG.P],
          ["voce", told === "mirtilla" ? "Mirtilla, per riservatezza, l'ha detto soltanto a tutti. Sul sentiero della stazione sono già comparsi due forestieri con una telecamera." : told === "teodora" ? "Teodora non ha detto niente a nessuno. Ma ha lasciato la finestra illuminata tutta la notte, e quello, a Vallombra, vale un comunicato." : "Tu non hai detto niente a nessuno. Il paese, che di segreti ha un fiuto da cane da tartufo, lo sa lo stesso.", BG.P],
          ["voce", fun === "chiusa" ? "La funivia, stanotte, è partita anche con tutti i lucchetti: Teodora li ha contati due volte, ad alta voce." : "La funivia è rimasta aperta tutta la notte. È salita, scesa e salita ancora, sempre vuota. Teodora ha segnato ogni corsa sul registro, a matita, con la mano ferma di chi si è appena rassegnata.", BG.P],
          tl({ sicuro: "Hai dormito poco e bene, come chi sa dove deve andare.", attento: "Hai contato i rumori della notte: undici. Il dodicesimo non l'hai sentito, e questo ti preoccupa.", ironico: "Hai dormito poco. Il cuscino ha opinioni sulla nebbia." }).concat(BG.P),
          ["voce", "Oggi c'è la prima partita ufficiale della Coppa dei Tre Versanti. Ti aspettano al Rifugio Tre Tazze.", BG.P],
        ];
      },
    };
  });

  // ================================================================== CAPITOLO 3 · LA MINIERA DELLA LUCE
  // Nuove zone: le Gallerie (binari, carrelli, cristalli da rimettere in fase, la Sala delle Lampade) e la Galleria Quattro (le undici maglie,
  // la porta di luce, la Camera del Minuto). Ritocca anche l'Imbocco e il paese del capitolo 1 (patch). Rompicapo: cristalli di fase (4 cristalli,
  // ognuno cambia anche i vicini) e due prove di tempismo (il freno del carrello, i cinque rigori contro Berto) con il tempismo di game.js.
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, hero, esc } = X;
    const N = 3, S = () => X.stepOf(N), has = (k) => F.is(k);
    const BG = { P: "vl_paese", C: "vl_campo", M: "vl_miniera", I: "vl_interno", L: "vl_latte", S: "vl_spogliatoi", F: "vl_foto", G: "vl_gallerie", Q: "vl_quattro" };
    const sw = (lines, bg) => lines.map((l) => (l.length > 2 ? l : [l[0], l[1], bg]));
    const chip = (a) => a[Math.floor(Math.random() * a.length)];
    const tono = () => F.get("tono", "ironico");
    const tl = (o) => ["hero", o[tono()] || o.ironico || o.sicuro];
    const zoneNow = () => X.api.trZone();
    const MINE = ["vl_miniera", "vl_gallerie", "vl_galleria4"];
    const inMine = () => MINE.includes(zoneNow());
    const remoId = () => (has("remo_bet") && has("m1_win") ? "vl_remo_ns" : "vl_remo");
    const remoHelps = () => has("remo_help") || has("remo_pent");
    const guida = () => F.get("guida", "bianca");
    const compId = () => (guida() === "agata" ? "vl_agata" : "vl_bianca");
    const otherId = () => (guida() === "agata" ? "vl_bianca" : "vl_agata");
    const compName = () => (guida() === "agata" ? "Agata" : "Bianca");
    const ettoreOn = () => F.get("told", "") === "mirtilla";
    const toast = (m) => X.api.trToast(m);

    // ---- personaggi nuovi
    const cast = (id, name, o, bio) => X.cast(id, Object.assign({ name }, o), bio);
    cast("vl_berto", "Berto Quarantotto", { tag: "", hair: "#3a2a1a", style: "messy", skin: "#e0b48a", bg: ["#0c1424", "#7fe3d0"], shirt: "#1b2f7a" }, "Portiere degli Stambecchi nella finale del '98. Si fascia le dita con un nodo a farfalla, ripete «ottantanove» come un'avemaria e non sa che sono passati ventisei anni. Il fratello minore, quando lui giocava, aveva otto anni e uno sgabello per vederlo.");
    cast("vl_gedeone", "Gedeone Roccia", { tag: "gray", hair: "#8a8a90", style: "buzz", skin: "#c98f63", bg: ["#2a1f12", "#d9a441"], beard: true, cap: "#d9a441", shirt: "#c98a2a" }, "Capoturno di giorno della Miniera della Luce. Conta i suoi uomini tre volte, all'entrata e all'uscita, e una quarta per scrupolo. Non ha mai perso nessuno, e non vuole cominciare adesso.");
    cast("vl_dina", "Dina Pietra", { tag: "", hair: "#5a2a1a", style: "codino", skin: "#d9a57a", bg: ["#2a1f12", "#d9a441"], cap: "#d9a441", shirt: "#8a5a34" }, "Minatrice del turno di giorno e campionessa di solitario in galleria. Bara, ma con una tale eleganza che nessuno ha mai osato dirglielo.");
    cast("vl_arbitro", "Gaudenzio Fischietti", { tag: "", hair: "#1a1a1a", style: "slick", skin: "#e8bf98", bg: ["#050608", "#e8e8e8"], shirt: "#15151a" }, "L'arbitro della finale del '98, o meglio la sua eco: la lumina registra anche chi ha sbagliato. Porta il fischietto in bocca da ventisei anni e non riesce a toglierlo.");
    cast("vl_mirella", "Mirella Cresta", { tag: "", hair: "#d4502a", style: "codino", skin: "#f2cfae", bg: ["#0c1424", "#e9a64a"], shirt: "#e9a64a" }, "Ala destra della Squadra del 6:43. Urla «palla a me» da ventisei anni e si ostina a non essere ascoltata, che è la tradizione dell'ala.");
    cast("vl_pio", "Pio Ravelli", { tag: "gray", hair: "#222222", style: "buzz", skin: "#c98f63", bg: ["#0c1424", "#1b2f7a"], shirt: "#1b2f7a" }, "Difensore centrale. Parla poco, marca l'aria e dice che l'aria, in una galleria, è l'avversario più scorretto.");
    cast("vl_duilio", "Duilio Pesce", { tag: "", hair: "#6a4a2a", style: "messy", skin: "#e8bf98", bg: ["#0c1424", "#e9a64a"], shirt: "#e9a64a" }, "Terzino destro. Il piede sinistro lo consuma più del destro: dice che è il piede che pensa.");
    X.lanDef("vl_berto", { name: "Berto Quarantotto", role: "Il portiere del 6:43", met: "berto_met" });
    X.lanDef("vl_gedeone", { name: "Gedeone Roccia", role: "Il capoturno che conta tre volte", met: "gedeone_met" });
    X.lanDef("vl_ettore", { name: "Ettore Brina", role: "Cacciatore di misteri (rispettoso)", met: "ettore_met" });
    X.cos("vl_stemma_miniera", { kind: "acc", label: "Stemma della Miniera", val: "#3ad1b4", from: "Concludi il capitolo 3 di Vallombra" });
    X.cos("vl_fascia_minatore", { kind: "acc", label: "Fascia del Minatore", val: "#d9a441", from: "Raccogli tutte le schegge di lumina nelle Gallerie" });
    X.cos("vl_vena", { kind: "hairc", label: "Capelli Vena di lumina", val: "#2fb89c", from: "Raccogli tutte le schegge di lumina nella Galleria Quattro" });

    const mood = (s) => (s >= 2 ? 2 : 1);

    // ---- obiettivi: sempre con la direzione (est/ovest/sopra/sotto) e che cosa cercare
    const goal = (s) => {
      if (s === 0) return "Parla con Fosco, sul sentiero davanti all'ingresso della miniera (CENTRO, in ALTO, tra le travi): il gruppo è là.";
      if (s === 1) return "Entra nella miniera: ingresso in ALTO al centro, tra le travi. Cerca il cancello con la freccia in su.";
      if (s === 2) return "Sala delle Fasi: binari verso EST, 4 cristalli sulla parete in ALTO. Toccali: devono accendersi tutti.";
      if (s === 3) return "Esci in BASSO (SUD) dalla porta di lumina, scendi il pozzo e tocca il carrello: frenalo con il tempismo.";
      if (s === 4) return "Sala delle Lampade (SUD): parla con Gedeone, il capoturno, in mezzo alla sala tra le due panche.";
      if (s === 5) return "Scendi alla Galleria Quattro: cancello con la freccia in giù, in fondo alla sala, in BASSO (SUD).";
      if (s === 6) return "Galleria Quattro: va' a OVEST lungo i binari fino al portiere con le mani fasciate. In ALTO, le 11 maglie.";
      if (s === 7) return "Attraversa la porta di luce a EST fino alla Camera del Minuto e parla con l'arbitro, al centro.";
      if (s === 8) return "Risali: cancello con la freccia in su, in ALTO al centro (poi su per le Gallerie fino all'Imbocco).";
      return "Capitolo concluso. Il Capitolo 4, Il Registro, ti aspetta: dal menu Vallombra scegli «Inizia il capitolo 4». Intanto raccogli le schegge e parla con tutti.";
    };

    // ---- stato dei cristalli di fase (4 cristalli: toccarne uno cambia anche i vicini)
    const QXS = [24, 27, 30, 33], CR0 = [false, true, false, false];
    const crv = (i) => F.get("cr" + i, CR0[i]);
    const crOn = (tx) => { const i = QXS.indexOf(tx); return i >= 0 && !!crv(i); };

    // ---- tessere nuove
    const JER = { 3: "BERTO", 5: "DUILIO", 7: "SASSO", 9: "NANDO", 11: "PIO", 13: "GINO", 22: "MIRELLA", 24: "ORESTE", 26: "TULLIO", 28: "LAMPO" };
    const HELM = ["O. ROVEDO · caposquadra", "T. SERENA", "M. CALCE", "E. DOSSO", "F. LASTRA", "V. PIGNA", "B. MORENA", "A. GRIGNO", "C. TORCHIO", "R. SCAGLIA", "D. FERRO", "L. BAITA", "N. CIMA", "S. VENA"];
    X.PAINT.Q = function (sx, sy, tx, ty, fr) {
      floorPaint("_", sx, sy, tx, ty); const i = Math.max(0, QXS.indexOf(tx)), on = crOn(tx), g = GP;
      P(sx + 3, sy + 12, 10, 4, "#3a4256"); P(sx + 3, sy + 12, 10, 1, "#5b6178");
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(80,230,205,${on ? 0.32 + 0.12 * Math.sin(fr / 14 + i) : 0.04})`; g.beginPath(); g.arc(sx + 8, sy + 7, on ? 14 : 6, 0, 7); g.fill(); g.restore();
      g.fillStyle = on ? "#3ad1b4" : "#4a4670"; g.beginPath(); g.moveTo(sx + 4, sy + 13); g.lineTo(sx + 7, sy + 1); g.lineTo(sx + 10, sy + 4); g.lineTo(sx + 12, sy + 13); g.closePath(); g.fill();
      P(sx + 8, sy + 3, 1, 7, on ? "#b9fff0" : "#8a84b8");
      for (let k = 0; k < 4; k++) P(sx + 3 + k * 3, sy + 14, 2, 1, k === i ? (on ? "#b9fff0" : "#8a84b8") : "#2a3040");
    };
    X.PAINT.D = function (sx, sy, tx, ty, fr) {
      floorPaint("_", sx, sy, tx, ty); P(sx, sy, 16, 16, "#10131c"); const a = 0.4 + 0.25 * Math.sin(fr / 20 + ty), g = GP;
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(90,235,210,${a * 0.22})`; g.fillRect(sx, sy, 16, 16); g.restore();
      for (let i = 0; i < 4; i++) { P(sx + 2 + i * 4, sy, 2, 16, `rgba(90,235,210,${a})`); P(sx + 2 + i * 4, sy, 1, 16, "#d8fff6"); }
      P(sx, sy, 16, 2, "#5a432a"); P(sx, sy + 14, 16, 2, "#5a432a");
    };
    X.PAINT.R = function (sx, sy, tx, ty) {
      floorPaint("-", sx, sy, tx, ty); const g = GP;
      P(sx + 1, sy + 4, 14, 9, "#59607a"); P(sx + 1, sy + 4, 14, 2, "#7a829c"); P(sx + 2, sy + 6, 12, 6, "#3d4254");
      g.fillStyle = "#3ad1b4"; g.beginPath(); g.moveTo(sx + 3, sy + 6); g.lineTo(sx + 5, sy + 1); g.lineTo(sx + 8, sy + 6); g.fill(); g.beginPath(); g.moveTo(sx + 7, sy + 6); g.lineTo(sx + 10, sy); g.lineTo(sx + 13, sy + 6); g.fill();
      P(sx + 3, sy + 13, 3, 3, "#20232e"); P(sx + 10, sy + 13, 3, 3, "#20232e");
    };
    X.PAINT.M = function (sx, sy, tx, ty) {
      wallStrata(sx, sy, tx, ty, "#262c3e", "#3a4258", "#1a1f2e"); const g = GP, col = (tx >> 1) % 2 ? "#1b2f7a" : "#e9a64a";
      P(sx + 7, sy, 2, 3, "#8a6a46"); g.fillStyle = col; g.beginPath(); g.moveTo(sx + 3, sy + 5); g.lineTo(sx + 6, sy + 3); g.lineTo(sx + 10, sy + 3); g.lineTo(sx + 13, sy + 5); g.lineTo(sx + 12, sy + 8); g.lineTo(sx + 11, sy + 7); g.lineTo(sx + 11, sy + 15); g.lineTo(sx + 5, sy + 15); g.lineTo(sx + 5, sy + 7); g.lineTo(sx + 4, sy + 8); g.closePath(); g.fill();
      P(sx + 7, sy + 3, 2, 1, "#ffffff66"); P(sx + 6, sy + 9, 4, 1, "#ffffff44"); if (tx === 28) P(sx + 6, sy + 11, 4, 2, "#7fe3d0");
    };
    X.PAINT.N = function (sx, sy, tx, ty, fr) {
      wallStrata(sx, sy, tx, ty, "#262c3e", "#3a4258", "#1a1f2e"); const g = GP, p = 0.65 + 0.3 * Math.sin(fr / 14);
      P(sx + 7, sy, 2, 3, "#8a6a46"); g.fillStyle = "#e6ecf0"; g.beginPath(); g.moveTo(sx + 3, sy + 5); g.lineTo(sx + 6, sy + 3); g.lineTo(sx + 10, sy + 3); g.lineTo(sx + 13, sy + 5); g.lineTo(sx + 12, sy + 8); g.lineTo(sx + 11, sy + 7); g.lineTo(sx + 11, sy + 15); g.lineTo(sx + 5, sy + 15); g.lineTo(sx + 5, sy + 7); g.lineTo(sx + 4, sy + 8); g.closePath(); g.fill();
      g.fillStyle = `rgba(20,200,170,${p})`; g.font = "bold 8px sans-serif"; g.textAlign = "center"; g.fillText(String(T("{num}")), sx + 8, sy + 12); g.textAlign = "left";
    };
    X.PAINT.H = function (sx, sy, tx, ty) {
      wallStrata(sx, sy, tx, ty, "#3d4254", "#5b6178", "#2c303e"); const g = GP;
      P(sx + 7, sy + 1, 2, 3, "#8a6a46"); g.fillStyle = tx === 3 ? "#e9a64a" : "#d9a441"; g.beginPath(); g.arc(sx + 8, sy + 11, 6, Math.PI, 0); g.fill(); P(sx + 2, sy + 11, 12, 2, "#a8782a"); P(sx + 7, sy + 6, 2, 3, "#fff1b8"); if (tx === 3) P(sx + 5, sy + 9, 6, 1, "#c8422e");
    };
    X.PAINT.P = function (sx, sy, tx, ty, fr) {
      P(sx, sy, 16, 16, "#12182a"); P(sx, sy, 16, 1, "#2a3656"); const g = GP;
      for (let i = 0; i < 5; i++) { const a = 0.35 + 0.3 * Math.sin(fr / 18 + i + ty); P(sx + 2, sy + 2 + i * 3, 4 + ((i * 5 + ty * 3) % 9), 1, `rgba(120,240,220,${a})`); }
    };

    function mineLights(g, cx, cy) {
      g.save(); g.globalCompositeOperation = "lighter"; const t0x = Math.floor(cx / TS), t0y = Math.floor(cy / TS), fr = frNow();
      for (let ty = t0y; ty <= t0y + 13; ty++) for (let tx = t0x; tx <= t0x + 21; tx++) {
        const ch = at(tx, ty), x = tx * TS - cx + 8, y = ty * TS - cy + 8;
        if (ch === "Q") { if (crOn(tx)) glow(g, x, y, 26, "90,235,210", 0.4); }
        else if (ch === "D") glow(g, x, y, 24, "90,235,210", 0.3 + 0.1 * Math.sin(fr / 20));
        else if (ch === "N") glow(g, x, y, 34, "127,255,224", 0.5);
        else if (ch === "H") glow(g, x, y + 2, 12, "255,220,140", tx === 3 ? 0.3 : 0.2);
        else if (ch === "P") glow(g, x, y, 18, "90,235,210", 0.25);
        else if (ch === "R") glow(g, x, y - 2, 16, "90,235,210", 0.2);
      }
      g.restore();
    }
    function vignette(g) { const gr = g.createRadialGradient(160, 100, 40, 160, 100, 190); gr.addColorStop(0, "rgba(2,6,16,0)"); gr.addColorStop(1, "rgba(2,6,16,.6)"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200); }
    function motes(g, d, n) { for (let i = 0; i < n; i++) { const x = ((i * 53 + d.fr * 0.2) % 340) - 10, y = ((i * 71 + Math.sin(d.fr / 60 + i) * 8) % 220) - 10; R(g, x, y, 1, 1, "rgba(160,255,235,.5)"); } }
    function ghost(g, x, y, i, a) { g.fillStyle = `rgba(110,200,200,${a})`; g.beginPath(); g.arc(x, y - 9, 4, 0, 7); g.fill(); g.fillRect(x - 4, y - 5, 8, 12); }

    const zones = {
      vl_gallerie: {
        name: "Vallombra · Le Gallerie", short: "Le Gallerie", sub: "Binari, carrelli e cristalli di lumina", w: 40, h: 29, start: [6, 3], theme: "puntanera", bg: "vl_gallerie", moodMin: 2,
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_fascia_minatore", items: [[3, 8], [33, 9], [25, 12], [4, 25]],
        act: { Q: "Rimetti in fase il cristallo", D: "Guarda la porta di lumina", R: "Guarda il carrello", H: "Leggi l'elmetto", n: "Leggi il tabellone", C: "Guarda la lumina", E: "Ascolta la pietra", x: "Guarda le casse", b: "Guarda la panca", l: "Guarda la lampada", "^": "Risali all'Imbocco", d: "Scendi alla Galleria Quattro" },
        areas: [[2, 2, 10, 8, "L'ingresso"], [11, 4, 21, 6, "Il corridoio dei binari"], [22, 3, 34, 9, "La Sala delle Fasi"], [28, 10, 28, 18, "Il pozzo dei carrelli"], [25, 12, 27, 13, "La nicchia"], [20, 19, 36, 26, "La Sala delle Lampade"], [3, 21, 17, 25, "Gli armadietti dei minatori"], [18, 22, 19, 23, "Il passaggio"]],
        hints: (s) => ({
          "L'ingresso": "Binari verso est, un tabellone dei turni a sinistra. Il cancello in alto riporta all'Imbocco.",
          "Il corridoio dei binari": "Binari al centro e carrelli parcheggiati. A est, una sala illuminata di turchese.",
          "La Sala delle Fasi": s >= 3 ? "I quattro cristalli sono in fase. In basso la porta di lumina è aperta." : "Quattro cristalli a pedane sulla parete in alto: cambiano fase a coppie. In basso, la porta di lumina.",
          "Il pozzo dei carrelli": has("cart_ok") ? "Il pozzo scende, ora libero: il carrello è stato frenato." : "Un passaggio stretto: un carrello pieno di lumina ostruisce i binari.",
          "La nicchia": "Una nicchia con attrezzi dimenticati e un secchio che brilla.",
          "La Sala delle Lampade": "Lampade appese, panche e un tavolo da carte. In fondo, il cancello con la freccia in giù.",
          "Gli armadietti dei minatori": "Quattordici elmetti appesi in fila sulla parete in alto. Uno ha una striscia rossa.",
          "Il passaggio": "Il passaggio tra la Sala delle Lampade e il guardaroba.",
          "Le Gallerie": "Le gallerie della Miniera della Luce.",
        }),
        intro: [["voce", "Entrando, il rumore del Latte si spegne come una porta chiusa piano. Il pavimento è pietra scura, con due binari che si perdono nel turchese; le travi di larice sono nere di fumo e di anni, ma non una scricchiola."], ["voce", "La luce non ha una fonte. È nella roccia, nei cristalli, nei bordi dei binari: cammina a un passo davanti a te, come un cane che sa la strada."]],
        npcs: (s) => {
          const o = [{ id: "vl_gedeone", at: [24, 22] }, { id: "vl_dina", at: [31, 22] }];
          const c = compId();
          if (s <= 2) o.push({ id: c, at: [23, 7] }, { id: "vl_fosco", at: [25, 7] });
          else if (s === 3) o.push({ id: c, at: [25, 13] }, { id: "vl_fosco", at: [26, 12] });
          else o.push({ id: c, at: [26, 20] }, { id: "vl_fosco", at: [30, 20] });
          if (ettoreOn() && F.get("ettore_t", "") === "bugia" && !has("ettore3")) o.push({ id: "vl_ettore", at: [21, 25] }, { id: "vl_viola", at: [22, 25] });
          return o.filter((n) => !(s >= 6 && (n.id === c || n.id === "vl_fosco")));
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 39, 28, "a");
          lay(2, 2, 10, 8, "_"); lay(2, 5, 10, 5, "-"); lay(11, 4, 21, 6, "_"); lay(11, 5, 21, 5, "-");
          lay(22, 3, 34, 9, "_"); lay(22, 5, 27, 5, "-"); lay(28, 5, 28, 9, "-");
          lay(28, 10, 28, 18, "_"); lay(28, 11, 28, 18, "-"); lay(25, 12, 27, 13, "_");
          lay(20, 19, 36, 26, "_"); lay(28, 19, 28, 24, "-");
          lay(3, 21, 17, 25, "_"); lay(18, 22, 19, 23, "_");
          put(5, 1, "^"); put(6, 1, "^"); put(28, 27, "d"); put(29, 27, "d");
          QXS.forEach((x) => put(x, 3, "Q"));
          if (!has("p1_ok")) put(28, 10, "D");
          if (!has("cart_ok")) put(28, 14, "R");
          put(8, 5, "R"); put(16, 5, "R"); put(31, 24, "R");
          for (let x = 3; x <= 16; x++) put(x, 20, "H");
          [[2, 2], [10, 8], [18, 4], [13, 6], [22, 3], [34, 3], [22, 9], [34, 9], [36, 26], [20, 26], [17, 25], [3, 25]].forEach(([x, y]) => put(x, y, "C"));
          [[9, 2], [2, 8], [12, 4], [20, 6], [25, 8], [31, 8], [21, 20], [35, 20], [22, 26]].forEach(([x, y]) => put(x, y, "l"));
          [[10, 3], [34, 5], [26, 25], [5, 23]].forEach(([x, y]) => put(x, y, "E"));
          put(3, 3, "n"); put(31, 23, "x"); put(32, 23, "x"); put(20, 20, "x"); put(20, 21, "x"); put(22, 22, "b"); put(26, 22, "b");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          plaque(g, "MINIERA DELLA LUCE · GALLERIA 1-3", X_(6) + 8, Y_(2) + 3);
          plaque(g, "SALA DELLE FASI", X_(28) + 8, Y_(2) + 3);
          plaque(g, "SALA DELLE LAMPADE", X_(28) + 8, Y_(19) + 3);
          motes(g, d, 16);
          [[24, 23], [29, 24], [33, 21], [23, 24]].forEach(([tx, ty], i) => { const x = X_(tx) + 8, y = Y_(ty) + 12 + Math.sin(fr / 60 + i) * 1.4; if (onScr(x, y)) ghost(g, x, y, i, 0.1 + 0.05 * Math.sin(fr / 30 + i)); });
        },
        top(cx, cy, d) { const g = GP; moodTint(g); tileLights(g, cx, cy); mineLights(g, cx, cy); vignette(g); },
      },

      vl_galleria4: {
        name: "Vallombra · La Galleria Quattro", short: "La Galleria Quattro", sub: "Undici maglie e una porta di luce", w: 40, h: 26, start: [16, 3], theme: "puntanera", bg: "vl_quattro", moodMin: 2,
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_vena", items: [[3, 15], [28, 15], [37, 9]],
        act: { M: "Guarda la maglia", N: "Guarda la maglia vuota", D: "Guarda la porta di luce", P: "Leggi la parete", E: "Ascolta la pietra", b: "Guarda la panchina", l: "Guarda la lampada", "^": "Risali alle Gallerie" },
        areas: [[14, 2, 19, 6, "Il pozzo della Quattro"], [2, 7, 29, 16, "La Galleria Quattro"], [31, 8, 38, 14, "La Camera del Minuto"]],
        hints: (s) => ({
          "Il pozzo della Quattro": "Una scala dall'alto e un pozzo di luce. A sud si apre la galleria; il cancello in alto risale.",
          "La Galleria Quattro": s >= 7 ? "In alto le 11 maglie, a ovest la porta con Berto, a est la porta di luce aperta." : "In alto le undici maglie; a ovest un portiere sotto una porta di luce; a est una porta chiusa.",
          "La Camera del Minuto": "Una camera rotonda: a est una parete che scrive, al centro un arbitro. Orologio fermo a 89:00.",
        }),
        intro: [
          ["voce", "La scala finisce in una galleria lunga come un campo di calcio. I binari corrono al centro, senza una fine che si veda; l'aria è ferma e profuma di cera, come negli spogliatoi, e di qualcosa di tiepido, che somiglia a un respiro trattenuto."],
          ["voce", "Sulla parete in alto, appese a undici ganci, ci sono le maglie. Blu notte e ambra, alternate. Dieci hanno un nome ricamato sotto il colletto. L'undicesima, al centro, è bianca come carta e porta soltanto un numero: {num}. Appena la guardi, il numero si scalda come un nome pronunciato."],
          ["vl_fosco", "…Le maglie. (si ferma sul primo scalino, la lanterna gli trema nella mano) Le ho lucidate con la cera per ventisei anni, senza averle mai viste. Capisci? Le ho lucidate a memoria."],
          ["voce", "In fondo, a ovest, sotto una porta da calcio fatta di luce e di nebbia, c'è un uomo con i guanti. Non guanti: le dita fasciate di nastro bianco, un nodo a farfalla su ogni mano. Va avanti e indietro sulla linea, sempre dello stesso passo, e ripete a mezza voce: «Ottantanove. Ottantanove. Ottantanove.»"],
          ["vl_fosco", "Le mani. …Il nodo a farfalla. (a voce così bassa che sembra un pensiero) Lo faceva sempre così, quel nodo. L'ho imparato guardandolo."],
        ],
        npcs: (s) => {
          const o = [{ id: "vl_mirella", at: [12, 14] }, { id: "vl_pio", at: [16, 9] }, { id: "vl_duilio", at: [24, 13] }, { id: "vl_berto", at: [4, 11] }];
          if (s >= 6) o.push({ id: "vl_arbitro", at: [35, 11] });
          if (s === 6) o.push({ id: "vl_fosco", at: [17, 4] }, { id: compId(), at: [15, 4] });
          else if (s === 7 || s === 8) o.push({ id: "vl_fosco", at: [6, 12] }, { id: compId(), at: [6, 10] });
          else if (s >= 9 && F.get("fosco", "su") === "giu") o.push({ id: "vl_fosco", at: [23, 15] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 39, 25, "a");
          lay(14, 2, 19, 6, "_"); lay(2, 7, 29, 16, "_"); lay(2, 11, 29, 11, "-");
          [3, 5, 7, 9, 11, 13, 22, 24, 26, 28].forEach((x) => put(x, 6, "M")); put(20, 6, "N");
          put(15, 1, "^"); put(16, 1, "^");
          lay(31, 8, 38, 14, "_"); lay(31, 11, 38, 11, "-");
          if (has("porta4")) { lay(30, 10, 30, 12, "_"); put(30, 11, "-"); } else { put(30, 10, "D"); put(30, 11, "D"); put(30, 12, "D"); }
          put(39, 10, "P"); put(39, 11, "P"); put(39, 12, "P");
          [21, 23, 25, 27].forEach((x) => put(x, 16, "b"));
          [[36, 9], [36, 13], [9, 15], [24, 8]].forEach(([x, y]) => put(x, y, "E"));
          [[32, 8], [32, 14], [38, 8], [38, 14], [14, 2], [19, 2], [2, 16], [29, 7]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          plaque(g, "GALLERIA QUATTRO · 89'", X_(8) + 8, Y_(7) + 3);
          plaque(g, "CAMERA DEL MINUTO", X_(35) + 8, Y_(8) + 3);
          motes(g, d, 18);
          // la porta da calcio di luce, a ovest
          const gx = X_(2), gy = Y_(9); if (onScr(gx, gy)) { g.strokeStyle = "rgba(235,250,255,.8)"; g.lineWidth = 2; g.beginPath(); g.moveTo(gx + 2, gy + 5 * TS); g.lineTo(gx + 2, gy); g.lineTo(gx + 2, gy); g.stroke(); g.fillStyle = "rgba(235,250,255,.8)"; g.fillRect(gx, gy - 2, 3, 5 * TS + 2); g.fillRect(gx, gy - 2, 12, 3); g.fillRect(gx, gy + 5 * TS - 2, 12, 3); g.strokeStyle = "rgba(127,255,224,.25)"; g.lineWidth = 1; for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(gx, gy + i * TS); g.lineTo(gx + 10, gy + i * TS); g.stroke(); } }
          // l'orologio della camera
          const ck = X_(35) + 8, cy2 = Y_(9) + 4; if (onScr(ck, cy2)) { g.fillStyle = "#0a0f1c"; g.fillRect(ck - 14, cy2 - 6, 28, 12); g.strokeStyle = "#7fe3d0"; g.lineWidth = 1; g.strokeRect(ck - 14, cy2 - 6, 28, 12); g.fillStyle = `rgba(127,255,224,${0.8 + 0.2 * Math.sin(fr / 12)})`; g.font = "bold 8px sans-serif"; g.textAlign = "center"; g.fillText("89:00", ck, cy2 + 3); g.textAlign = "left"; }
          // la Squadra, in sospeso: sagome di nebbia ferme in campo
          [[8, 9], [10, 13], [14, 12], [19, 14], [21, 9], [26, 10], [27, 14], [6, 15]].forEach(([tx, ty], i) => { const x = X_(tx) + 8, y = Y_(ty) + 12 + Math.sin(fr / 70 + i) * 1.4; if (onScr(x, y)) ghost(g, x, y, i, 0.16 + 0.06 * Math.sin(fr / 35 + i)); });
        },
        top(cx, cy, d) { const g = GP; moodTint(g); tileLights(g, cx, cy); mineLights(g, cx, cy); vignette(g); },
      },
    };

    // ---- ritocchi alle zone dei capitoli precedenti (attivi quando il capitolo 3 è sbloccato)
    X.patch("vl_paese", N, {
      npcs: (list, s) => list.filter((n) => !(n.id === "vl_fosco" && (s <= 8 || F.get("fosco", "su") === "giu"))),
    });
    X.patch("vl_miniera", N, {
      act: { "^": "Entra nella miniera" },
      hints: (s) => ({ "L'imbocco della miniera": s <= 1 ? "Le assi sono cadute: un ingresso scuro con i binari che salgono. Sul sentiero, davanti, aspetta il gruppo." : "I binari salgono nel buio: il cancello con la freccia in su, in alto al centro, entra nelle gallerie." }),
      build(L) { const { lay, put } = L; lay(12, 3, 15, 4, "_"); lay(13, 4, 14, 4, "-"); put(13, 3, "^"); put(14, 3, "^"); },
      npcs: (list, s) => {
        const o = list.filter((n) => n.id !== "vl_lampionaio");
        if (s <= 1) {
          o.push({ id: "vl_fosco", at: [11, 11] }, { id: "vl_bianca", at: [14, 12] }, { id: "vl_agata", at: [17, 11] }, { id: "vl_cornelio", at: [19, 13] }, { id: "vl_lampionaio", at: [22, 12] });
          if (remoHelps()) o.push({ id: remoId(), at: [8, 12] }, { id: "vl_tonio", at: [9, 13] });
          if (ettoreOn() && F.get("ettore_t", "") === "rispetto") o.push({ id: "vl_ettore", at: [4, 12] }, { id: "vl_viola", at: [5, 13] });
        } else if (s <= 8) {
          o.push({ id: otherId(), at: [14, 12] }, { id: "vl_cornelio", at: [19, 13] });
          if (remoHelps()) o.push({ id: remoId(), at: [8, 12] }, { id: "vl_tonio", at: [9, 13] });
        } else {
          o.push({ id: "vl_lampionaio", at: [22, 12] }, { id: "vl_cornelio", at: [19, 13] });
          if (remoHelps()) o.push({ id: remoId(), at: [8, 12] }, { id: "vl_tonio", at: [9, 13] });
          if (ettoreOn() && F.get("ettore_t", "") === "rispetto") o.push({ id: "vl_ettore", at: [4, 12] }, { id: "vl_viola", at: [5, 13] });
        }
        return o;
      },
    });

    // ================= scene
    const delegate = (id) => { const p = X.talkOf(id, N); if (p) p(); else done(); };
    const stateStr = () => [0, 1, 2, 3].map((j) => (crv(j) ? "◆" : "◇")).join(" ");
    const sumPts = (pts) => pts.reduce((a, b) => a + b, 0);
    // tempismo di game.js (barra da fermare nella zona verde); se manca, un ripiego a scelte rapide
    function timing(label, rounds, bg, react, fin) {
      if (typeof X.timing === "function") return X.timing(label, rounds, bg, react, fin);
      const pts = [];
      const next = () => {
        if (pts.length >= rounds) return fin(pts);
        ask("voce", `${esc(label)} · prova ${pts.length + 1} di ${rounds}: scegli il momento.`, [1, 2, 3].map((k) => ({ label: ["Subito", "Un attimo", "Adesso"][k - 1], fn: () => { const n = Math.random() < 0.34 ? 3 : Math.random() < 0.6 ? 2 : 1; pts.push(n); say([["voce", react(n)]], next); } })), bg);
      };
      next();
    }

    // ---- l'Imbocco: il gruppo, poi la scelta di chi scende
    function foscoImbocco() {
      if (S() >= 1) return say(sw([["vl_fosco", chip(["Io sono pronto da ventisei anni. Se mi dici «ora», prendo il cappello.", "Ho portato tre panini. Uno è per me, uno è per te e uno è per quel che c'è là sotto: non si va a trovare qualcuno a mani vuote.", "Non farmi parlare, adesso. Ho un nodo qui (si tocca lo stomaco) e a parlare si scioglie al momento sbagliato."])]], BG.M), done);
      const cor = F.get("cornelio_t", "silenzio"), fis = has("fischietto");
      const corLine = cor === "verita" ? "Stamattina ho parlato in piazza. Non ho fatto il passo indietro, ho fatto un passo avanti. Mi hanno ascoltato in diciotto, due si sono addormentati e Mirtilla ha pianto nel grembiule. Per Vallombra è un trionfo." : cor === "comp" ? "Ho dormito, per la prima volta in ventisei anni. Con i guanti sul comodino. Il sogno era noiosissimo: nessuno mi chiamava vigliacco." : "Non ho dormito. Ho fatto un discorso da solo, in cucina. Stavolta brevissimo: quattro parole. Le tengo per quando servono.";
      say(sw([
        ["voce", "Davanti all'ingresso della miniera il sentiero dei Lampioni si è riempito di gente con una lanterna in mano. Nessuno ha detto «venite»: sono venuti. A Vallombra i guai si risolvono così, in assemblea, a piedi e con una torcia."],
        ["vl_fosco", "Ventisei anni che spolvero un armadietto. Adesso l'armadietto ha una scala. (guarda le travi) Io scendo, e non mi dite di no. Sono il tredicesimo giocatore: se non entro io, chi entra?"],
        tl({ sicuro: "Scendi con me. Qualcuno deve conoscere la strada.", attento: "Hai un'aria che non è solo coraggio, Fosco.", ironico: "Il tredicesimo che prima era un armadietto e ora una guida alpina: promozione." }),
        ["vl_fosco", "Ho un motivo mio, in più. Non è un bel motivo: è vecchio. Lo dico giù, se serve."],
        ["vl_bianca", "La miniera ha tre livelli, un pozzo e quarantadue pericoli certificati. Ho portato la chiave inglese. Non so a cosa servirà, ma mi sento più alta."],
        ["vl_agata", "Non è un'escursione. Il terreno, là sotto, non mi ha mai risposto. Oggi risponde: mi preoccupa più del silenzio." + (has("compass") ? " La bussola l'hai? Dentro l'ago segue la luce, non il nord." : "")],
        ["vl_cornelio", corLine + (fis ? " Il fischietto ce l'hai tu. Io resto qui, all'ingresso: tengo l'altro capo. Stavolta, se sento il botto, fischio." : " Io resto qui, all'ingresso: tengo l'altro capo. Stavolta, se sento il botto, fischio.")],
        ...(remoHelps() ? [[remoId(), "Cima Alta tiene la corda, come ieri. Tonio ha portato il thermos. Se tiri tre volte, tiriamo su. Se non tiri, tiriamo lo stesso."]] : []),
        ...(ettoreOn() && F.get("ettore_t", "") === "rispetto" ? [["vl_ettore", "Io e Viola restiamo qui, con la telecamera spenta. Ho scritto sul quaderno: «alcune porte si filmano; questa si aspetta». Ti lascio il faretto: non fa niente, ma fa scena."]] : []),
        ["voce", "Sull'architrave, a gesso, il Lampionaio ha scritto: «SOTTO NON C'È NIENTE DA VINCERE. SOLO DA FINIRE.» Ognuno guarda il buio tra le travi. Nessuno lo guarda per primo."],
      ], BG.M), () => ask("voce", "Fosco viene con te. Con chi altri scendi?", [
        { label: "Con Bianca", sub: "Meccanica · carrelli e binari", cls: "hot", fn: () => scegli("bianca") },
        { label: "Con Agata", sub: "Geologa · cristalli e fasi", cls: "hot", fn: () => scegli("agata") },
      ], BG.M));
    }
    function scegli(w) {
      F.set("guida", w); X.lanAdd(w === "agata" ? "vl_agata" : "vl_bianca");
      const rispetto = ettoreOn() && F.get("ettore_t", "") === "rispetto";
      if (rispetto) { F.set("faro", true); X.lanAdd("vl_ettore"); }
      const a = w === "bianca" ? [["vl_bianca", "Allora io. I carrelli sono fatti di bulloni e i bulloni mi parlano, di solito per lamentarsi. Agata tiene la corda: sa tenere il passo anche da ferma."], ["vl_agata", "Tengo l'altro capo. Se il filo tira tre volte, torno a cercarvi con una cattiveria che non ti dico."]]
        : [["vl_agata", "Allora io. La lumina si capisce in fase: due cristalli stonati si sentono come due violini. Bianca tiene la corda, ha le mani per questo."], ["vl_bianca", "Io qui con la chiave inglese. Tienila come un testimone, ma non lanciarla: è mia."]];
      say(sw([...a, ["vl_fosco", "Vi seguo. Se mi vedete rallentare, non fatevi venire il rimorso: guardate avanti."], ["voce", "Cornelio accende per te una lampada e te la porge con due mani, come un oggetto di vetro. «Fischia, se serve.» " + (rispetto ? "Ettore ti infila in tasca il suo faretto con una solennità da cerimonia." : "")]], BG.M), () => {
        setStep(N, 1); note(`Scendo nella miniera con Fosco e ${compName()}. Cornelio tiene l'altro capo; sull'architrave il Lampionaio ha scritto: «sotto non c'è niente da vincere, solo da finire».`); done();
      });
    }
    function bianca() {
      const z = zoneNow(), s = S();
      if (z === "vl_miniera") return say(sw([["vl_bianca", s <= 1 ? "Io ci vado volentieri, ma ho paura dei carrelli: sono la sola cosa che io rispetti più dei bulloni." : "Tengo la corda, mentre voi scendete. Una corda è una chiave inglese che non si rompe."]], BG.M), done);
      if (z === "vl_paese" || z === "vl_campo" || !MINE.includes(z)) return delegate("vl_bianca");
      if (guida() !== "bianca") return delegate("vl_bianca");
      return compagno();
    }
    function agata() {
      const z = zoneNow(), s = S();
      if (z === "vl_miniera") return say(sw([["vl_agata", s <= 1 ? "Vieni a dirmi come finisce. La lumina, vista da fuori, è bellissima e non spiega niente." : "Tengo l'altro capo. Se il terreno trema tre volte, lo dico a Bianca: lei gli parla meglio di me."]], BG.M), done);
      if (!MINE.includes(z)) return delegate("vl_agata");
      if (guida() !== "agata") return delegate("vl_agata");
      return compagno();
    }
    function compagno() {
      const s = S(), b = guida() === "bianca", id = compId();
      const hint = s <= 2 ? (b ? "I cristalli si spingono a coppie: se ne tocchi uno, strattona anche i vicini. Gli ultimi due sono i più testardi. Prova col primo e col terzo, magari." : "Ogni cristallo chiama i suoi vicini, come un coro: tocchi uno e ne cambia tre. Conta le fasi: quattro in fila. Il primo e il terzo, direi.")
        : s === 3 ? (b ? "Il freno è a ghiera. Piano, piano, e poi di colpo: così lo prendi senza che il carrello si offenda. Io, se tocco, te lo faccio fermare in tre giri." : "Il carrello pesa cinquecento chili ma sta fermo da ventisei anni: non vuole correre. Girando la manovella al momento giusto lo convinci.")
          : s === 4 ? "In fondo alla sala c'è un cancello che scende. Prima di scendere, chiedi al capoturno: i minatori sanno quello che la roccia non dice."
            : s === 5 ? "Scendiamo? Io ho paura, ma una paura precisa, con le misure. Si gestisce." : s <= 8 ? "Sto con te. Non so dire altro, e per me è già tanto." : "Mi tengo la scheggia in tasca. Non per portarla via: per ricordarmi che la luce può anche stare ferma.";
      const o = [{ label: "Che facciamo ora?", sub: "Un consiglio", fn: () => say(sw([[id, hint]], BG.G), done) }];
      if (s >= 2) o.push({ label: "Come ti senti?", sub: "Due parole", fn: () => say(sw([[id, b ? chip(["Il rumore dei carrelli, qui, è un rumore da casa. Ho paura che mi piaccia.", "Mio nonno diceva: sotto terra si impara a tacere in due lingue. Io le conosco entrambe.", "Ho la chiave inglese. Se arriva un fantasma, gli stringo un bullone."]) : chip(["Il sismografo, qui, avrebbe una crisi di nervi: la roccia batte quarantatré al minuto.", "Misuro tutto, ma qui sotto vorrei non misurare niente. È una sensazione che non conoscevo.", "La lumina si comporta come un animale: se la guardi dritto, si ritira. Guardala di lato."])]], BG.G), done) });
      ask(id, b ? "«Dimmi tu: io faccio la strada, tu fai la direzione.»" : "«Dimmi tu: io faccio il rilievo, tu fai la scelta.»", o, BG.G);
    }

    // ---- ingresso della miniera
    function gateDentro() {
      const s = S();
      if (s < 1) return say(sw([["voce", "L'ingresso è aperto, ma non sei solo e non sei pronto: parla prima con Fosco e con gli altri, sul sentiero."]], BG.M), done);
      if (has("imb3")) return go("vl_gallerie", 6, 3);
      F.set("imb3", true);
      say(sw([
        ["voce", "Il primo passo oltre le travi è l'ultimo sotto il cielo. Dietro di te il rumore del Latte si spegne piano, come una televisione in un'altra stanza."],
        ["vl_fosco", "Fa freddo. Eppure non è freddo di inverno. È freddo di luogo chiuso a lungo."],
        ["voce", "I binari salgono nella roccia e si perdono in una luce turchese che respira. La luce non ha una fonte: sta nei cristalli, nei bordi dei binari, nei gesti di chi cammina."],
        ["vl_cornelio", "(dalla bocca della miniera, forte, con la voce del sindaco che non sa sussurrare) FISCHIATE, SE SERVE! FISCHIATE!"],
        tl({ sicuro: "Andiamo. Tenete il passo.", attento: "Sto contando le travi. Sono centoquarantatré. Se diventano di più, usciamo.", ironico: "Regole della casa: non toccare, non correre, non ascoltare il Latte." }),
      ], BG.G), () => { if (S() === 1) { setStep(N, 2); note("Sono dentro la miniera. Binari verso est: una sala con quattro cristalli da rimettere in fase."); } go("vl_gallerie", 6, 3); });
    }

    // ---- la Sala delle Fasi
    function cristallo({ tx }) {
      const i = QXS.indexOf(tx);
      if (i < 0) return done();
      if (has("p1_ok")) return say(sw([["voce", "Il cristallo è caldo e fermo, in fase con gli altri tre. Quando lo sfiori, tutta la sala risponde con un suono basso, come una persona che annuisce."]], BG.G), done);
      const press = () => {
        [i - 1, i, i + 1].forEach((j) => { if (j >= 0 && j < 4) F.set("cr" + j, !crv(j)); });
        const n = F.add("cr_n", 1);
        if ([0, 1, 2, 3].every(crv)) return crRisolto();
        const hint = n % 8 === 0 ? [[compId(), n >= 16 ? "Tocca il primo, poi il terzo. Fidati." : guida() === "bianca" ? "Non toccarli a caso: due colpi al posto giusto valgono dieci a caso. Pensa a quali accendono i vicini." : "Il sistema è semplice: ogni tocco inverte tre cristalli (quello e i vicini). Cerca di capire quale mossa accende ciò che manca."]] : [];
        const after = () => { done(); toast("Fasi " + stateStr() + " · ◆ acceso"); };
        if (hint.length) return say(sw(hint, BG.G), after);
        after();
      };
      if (!has("cr_seen")) {
        F.set("cr_seen", true);
        return say(sw([
          ["voce", "Quattro cristalli di lumina in fila, ciascuno su una pedana con un puntino che dice il suo posto: primo, secondo, terzo, quarto. Due sono tiepidi e due scuri. Il quarto, quando ti avvicini, canta una nota mezza stonata."],
          [compId(), guida() === "bianca" ? "Sono accordati a coppie. Se ne tocchi uno, cambia anche il suo vicino: come due bulloni su una stessa flangia. Devono brillare tutti insieme, o la porta in basso non si apre." : "Fase: ogni cristallo risuona con quelli accanto. Toccandone uno, cambiano lui e i vicini. Servono tutti accesi, contemporaneamente: poi la porta cede."],
          ...(has("fischietto") ? [["voce", "Il fischietto di ottone, in tasca, vibra appena quando sei vicino al cristallo che stona. Come un cane da punta."]] : []),
          ["vl_fosco", "A me sembra un gioco da bar. Quelli dove si perde sempre e si ride lo stesso."],
        ], BG.G), press);
      }
      press();
    }
    function crRisolto() {
      F.set("p1_ok", true); X.setTiles(28, 10, 28, 10, "_");
      const m = reward("vl_p1", { coins: 8 });
      say(sw([
        ["voce", "L'ultimo cristallo si accende e per un istante i quattro cantano all'unisono: una nota sola, bassa, che ti sale per le caviglie e arriva ai denti. La sala si riempie di un turchese pieno, stabile, come un respiro finalmente lungo."],
        ["voce", "In fondo alla sala, in basso, la porta di lumina perde le sue barre una dopo l'altra, come dita che si aprono. Dietro, un pozzo stretto con i binari che scendono."],
        [compId(), guida() === "bianca" ? "Ecco. Quarantadue pericoli certificati e abbiamo risolto il primo con un gioco da bar." : "Quattro cristalli, quattro fasi, un'unica nota. L'ho annotata. Non la dimenticherò."],
        ["vl_fosco", "Un gioco da bar che ti apre una porta. In effetti ne ho giocati di peggiori."],
        ...(m.length ? [["voce", m.join(" · ") + "."]] : []),
      ], BG.G), () => { if (S() === 2) { setStep(N, 3); note("Quattro cristalli in fase: la porta di lumina si è aperta. Più giù, un carrello ostruisce il pozzo."); } done(); });
    }
    function portaD({ tx, ty }) {
      const z = zoneNow();
      if (z === "vl_galleria4") return say(sw([["voce", has("porta4") ? "La porta di luce è aperta, e il tempo, di là, è appena più lento." : "Una porta fatta di barre di luce, alta come la galleria. Dall'altra parte qualcuno sembra respirare a tempo con la barra più bassa. Non si apre con la forza: si apre quando chi sta di guardia dice di sì."]], BG.Q), done);
      say(sw([["voce", "La porta di lumina vibra: le quattro barre cambiano colore insieme ai quattro cristalli della sala. Finché non sono tutti in fase, non cede."]], BG.G), done);
    }

    // ---- il pozzo e il carrello (tempismo)
    function carrello({ tx, ty }) {
      if (!(tx === 28 && ty === 14)) return say(sw([["voce", chip(["Un carrello parcheggiato sui binari: ruote d'acciaio, un carico di lumina grezza e la scritta «NON SPINGERE» sbarrata e riscritta «SPINGI SOLO SE SEI SICURO».", "Un carrello vuoto, a parte un panino fossilizzato con la scritta «DINA». Meglio non toccare.", "Un carrello da cinquecento chili. Le ruote sono ferme da ventisei anni, ma il metallo è tiepido, come di chi è appena sceso."])]], BG.G), done);
      if (has("cart_ok")) return done();
      const f = F.get("cart_f", 0);
      const start = () => ask("voce", f ? "Il freno aspetta di nuovo la tua mano." : "Il freno a ghiera è lì, a portata di mano.", [
        { label: "Gira la manovella del freno", sub: "3 prove di tempismo", cls: "hot", fn: freno },
        { label: "Lascia perdere, per ora", fn: done },
      ], BG.G);
      if (f) return start();
      say(sw([
        ["voce", "Nel punto più stretto del pozzo, un carrello pieno di lumina grezza occupa tutta la larghezza dei binari. È fermo su una pendenza: sotto le ruote, il freno a ghiera tiene tutto con un solo giro di manovella."],
        [compId(), guida() === "bianca" ? "Se lo tolgo senza frenare, parte. Se lo freno troppo forte, si pianta. Serve una mano che senta il momento: la stessa mano del tiro, in fondo." : "Il carrello pesa quanto una piccola utilitaria e tiene in bilico una discesa. Girare la manovella al momento giusto: non prima, non dopo."],
        ["vl_fosco", "Lo vedi quel punto verde sulla ghiera? Quando passa lì, ferma. Per il resto, è come saper tirare un rigore."],
      ], BG.G), start);
    }
    function freno() {
      const f = F.get("cart_f", 0), need = Math.max(3, (guida() === "bianca" ? 4 : 5) - (f >= 2 ? 2 : f >= 1 ? 1 : 0));
      timing("Freno", 3, "night", (k) => k === 3 ? "<b>Clac!</b> La ghiera scatta nel punto esatto, senza un fiato." : k === 2 ? "<b>Quasi.</b> Il carrello trema, poi si accontenta." : "<b>Slitta.</b> La ghiera gira a vuoto e il carrello fa un rutto di ferro.", (pts) => {
        const tot = sumPts(pts);
        if (tot >= need) return carrelloOk(tot);
        F.add("cart_f", 1);
        say(sw([["voce", `Freno: ${tot} su 9 (ne servivano ${need}). Il carrello oscilla, sbuffa e torna fermo, con aria di chi ha vinto ai punti.`], [compId(), chip(["Si riprova. Con più calma: il freno non è un avversario, è un bullone con la testa dura.", "Ancora: la ghiera ha un punto, e il punto non si sposta. Sei tu che ti muovi.", "Non è la forza: è il momento. Respira, guarda la ghiera, e dai il colpo quando passa."])]], BG.G), () => ask("voce", "Riprovi?", [{ label: "Riprova il freno", cls: "hot", sub: "Il tempismo diventa più indulgente", fn: freno }, { label: "Non adesso", fn: done }], BG.G));
      });
    }
    function carrelloOk(tot) {
      F.set("cart_ok", true); X.setTiles(28, 14, 28, 14, "-");
      const m = reward("vl_cart", { coins: 8 });
      say(sw([
        ["voce", `Freno: ${tot} su 9. La manovella ti scatta in mano, la ghiera si blocca, e il carrello, liberato dal suo peso, scende per conto proprio su un binario laterale, adagio, con la dignità di chi ha ceduto il posto.`],
        [compId(), guida() === "bianca" ? "Il carrello l'ho sentito sorridere. Non so come si faccia, ma l'ho sentito." : "Il carrello si è assestato su un angolo che non avevo previsto. Lo scrivo. La lumina non sbaglia mai: sbaglia chi la misura."],
        ["vl_fosco", "Se questo è il primo ostacolo, siamo a metà. Se è l'ultimo, siamo in vacanza."],
        ...(m.length ? [["voce", m.join(" · ") + "."]] : []),
        ["voce", "Il pozzo è libero. In fondo, i binari entrano in una sala illuminata da lampade appese: una pausa pranzo di ventisei anni fa."],
      ], BG.G), () => { if (S() === 3) { setStep(N, 4); note("Ho frenato il carrello: il pozzo porta a una sala con lampade e minatori fermi in pausa."); } done(); });
    }

    // ---- la Sala delle Lampade: Gedeone, Dina, la partitella dei turni
    function gedeone() {
      const s = S(); F.set("gedeone_met", true);
      if (s < 4) return say(sw([["vl_gedeone", "Fuori turno, fuori orario. E senza il panino, per giunta."]], BG.G), done);
      if (s === 4) return gedeoneScena();
      const v = F.get("gedeone", "taci") === "verita";
      const o = [{ label: "Come va, Gedeone?", fn: () => say(sw([["vl_gedeone", v ? chip(["Il conto torna. Lo ripeto ogni mezz'ora per sicurezza.", "Ho smesso di contare tre volte. Ora conto due. Per scrupolo ne tengo una in tasca.", "Il thermos si è svuotato di un dito, una volta. Ora lo tengo come una reliquia."]) : chip(["Sedici, quindici, quattordici… Dimmi quando torni se il conto torna.", "Il thermos è sempre pieno. Ormai è un peso, non una scorta.", "La caposquadra, la Rovedo, contava sempre per ultima. Aveva un modo di chiudere il conto che nessuno ha mai copiato."])]], BG.G), done) }];
      if (s >= 5) o.push({ label: "Sfida: la partitella dei turni", sub: "Un tempo, contro il Turno di Giorno", fn: () => matchTurni() });
      ask("vl_gedeone", v ? "«Giovanotto! Il conto torna, e tu hai la faccia di chi ha un altro da farsi tornare.»" : "«Giovanotto, vuoi un panino o una risposta? Ho solo il primo.»", o, BG.G);
    }
    function gedeoneScena() {
      const b = guida() === "bianca";
      say(sw([
        ["voce", "Nella Sala delle Lampade il tempo ha la forma di una pausa pranzo. Quattro lampade accese, un thermos che non si svuota e due minatori con il casco giallo che ti guardano come si guarda uno che arriva da lontano e non ha la faccia del posto."],
        ["vl_gedeone", "Alt! Fuori turno e fuori orario. I visitatori, qui, sono ammessi solo il giorno dell'inaugurazione e solo se portano il panino."],
        tl({ sicuro: "Sono qui per la squadra, capoturno.", attento: "Lei è il capoturno di giorno. Cosa è successo quaggiù, quella sera?", ironico: "Il panino ce l'ho. L'ha fatto Mirtilla: dentro c'è una cioccolata." }),
        ["vl_gedeone", "Squadra? Ah, la finale! Tutto il paese a vedere gli Stambecchi, e noi qui di turno, io e Dina, con quelli di notte che salivano alle sette. Pagavano doppio, quella settimana: ordine della Società, «scendere comunque». Col doppio non si fanno troppe domande, ragazzo."],
        ["vl_gedeone", "Alle sei e quaranta sento correre sulla scala. Una squadra intera, maglie blu e ambra, scarpini, il fango del campo ancora addosso. Il capitano per primo, un tipo alto con la fascia, un fischietto da minatore tra i denti e una faccia che non ti dico: «TUTTI FUORI! È UNA CARICA! LA TRE, LA TRE!»"],
        ["vl_gedeone", "Il turno di notte era in galleria Tre: quattordici uomini e la caposquadra, la Rovedo, una donna con un elmetto più grosso della testa, che li contava come i miei, tre volte. Li hanno spinti tutti nel condotto dei fumi, sulla scala di ferro. La squadra ha tenuto aperta la Quattro per far passare l'ultimo. Poi… poi il botto."],
        [compId(), b ? "…Rovedo. (si schiarisce la gola, troppo forte) È un cognome comune, quassù. Ce ne saranno quarantadue." : "Rovedo. L'archivio catastale ne conta quattro, di famiglie. Lo annoto."],
        ["voce", "Gedeone si ferma. Guarda il suo thermos, che non si svuota, come se fosse la prima volta che lo vede. Dina, accanto a lui, abbassa le carte. Nessuno, nella sala, respira."],
        ["vl_gedeone", "Dimmelo tu, giovanotto, che vieni da fuori: sono saliti tutti? Io conto sedici, quindici, quattordici… li ho contati tre volte. Ma dal botto in poi il conto non mi torna mai."],
      ], BG.G), () => ask("vl_gedeone", "Cosa rispondi a Gedeone?", [
        { label: "«Sono saliti tutti e quattordici. Li hanno salvati loro.»", sub: "Dici la verità, tutta", fn: () => gedeoneFine("verita") },
        { label: "«Non lo so ancora. Sto cercando di scoprirlo.»", sub: "Taci, per non spezzare l'eco", fn: () => gedeoneFine("taci") },
      ], BG.G));
    }
    function gedeoneFine(w) {
      F.set("gedeone", w);
      const a = w === "verita" ? [
        ["vl_gedeone", "…Quattordici. (si siede, di colpo) Quattordici. Allora il conto torna. Il conto torna!"],
        ["voce", "Piange e ride insieme. Intorno a lui i minatori battono tre volte il casco sul tavolo, come si fa quando si esce dal turno e si è tutti. Il thermos, per la prima volta in ventisei anni, si svuota di un dito: una goccia di tè, tiepida, cade sul tavolo e fuma."],
      ] : [
        ["vl_gedeone", "Non lo sai ancora. (annuisce, lento) Allora vale la pena di scendere e saperlo. Non ti dico altro: ho già detto troppo a chi non conosco."],
        ["voce", "Il thermos rimane pieno. Il conto, per ora, non torna. Gedeone riprende le carte senza guardarle."],
      ];
      say(sw([...a,
        ["vl_gedeone", "Prendi la mia lampada. In Quattro, sotto la Tre, la roccia non lascia vedere i piedi: la lumina ti riconosce, è fatta così. E se vedi un ragazzo con le mani fasciate… digli che il conto, per me, " + (w === "verita" ? "torna" : "lo sto ancora facendo") + "."],
        ["voce", "La lampada è di rame, con un vetro appannato e dentro un seme di lumina che batte come un cuore piccolo. Quando la prendi, si accende da sola."],
      ], BG.G), () => {
        F.set("lampada", true); if (w === "verita") X.lanAdd("vl_gedeone");
        setStep(N, 5); note(w === "verita" ? "Ho detto a Gedeone che i quattordici sono salvi. Mi ha dato la lampada per la Quattro." : "Gedeone non sa se i quattordici si sono salvati: gli ho taciuto la verità. Mi ha dato la lampada per la Quattro.");
        note("Gedeone: il turno di notte (14 + la caposquadra Rovedo) è uscito dal condotto dei fumi; la squadra ha tenuto aperta la Quattro."); done();
      });
    }
    function dina() {
      const s = S();
      const o = [{ label: "Chiedi della partita a carte", fn: () => say(sw([["vl_dina", chip(["Il solitario si vince solo barando. Io bara con tale eleganza che il mazzo mi ringrazia.", "Il mio asso di cuori è un po' più asso degli altri. Non dirlo a Gedeone: è l'unico che non se n'è accorto.", "Quattordici carte coperte, una scoperta: questo è il sistema. Non funziona. Ma è il mio."])]], BG.G), done) }];
      if (s >= 5) o.push({ label: "Sfida: la partitella dei turni", sub: "Un tempo, contro il Turno di Giorno", fn: () => matchTurni() });
      ask("vl_dina", s >= 5 ? "«Dopo il pranzo, si gioca. Sono ventisei anni che aspetto il pareggio.»" : "«Siediti, ma non sbirciare.»", o, BG.G);
    }
    function matchTurni() {
      const first = !has("m3_played");
      say(sw([["vl_dina", first ? "Pausa pranzo: si fa una partitella tra turni. Un tempo solo, porte di casse, l'arbitro è il thermos. Chi vince offre il tè." : "Un'altra? Il tè lo offro io, ma il pareggio non lo regalo."]], BG.G), () => X.playMatch({
        id: "vl3", chap: "Vallombra · Sala delle Lampade", mate: guida() === "agata" ? "Agata" : "Bianca",
        intro: "Partitella tra turni nella Sala delle Lampade, un tempo solo: <em>il Turno di Giorno</em> contro di te e " + compName() + ". Le porte sono due casse, il pallone è una zolla di lumina grezza, e il fischio, dicono, è del thermos.",
        team: (t, st) => ({ vs: "il Turno di Giorno", name: "Turno di Giorno", color: "#d9a441", defs: [["Gedeone Roccia", t(st.drib * 0.78)], ["Dina Pietra", t(st.drib * 0.8)], ["Il Badile", t(st.drib * 0.82)]], atk: [["Dina Pietra", t(st.tiro * 0.82)], ["Il Piccone", t(st.tiro * 0.8)]], gk: ["Il Cestone", t(st.tiro * 0.93)], power: t(st.tiro * 0.78), special: ["LA PAUSA PRANZO", t(st.tiro * 1.08)] }),
        done: (r) => {
          F.set("m3_played", true); if (r.win) F.set("m3_win", true);
          const msg = r.win ? reward("vl_m3_win", { coins: 10 }) : [];
          note(r.win ? `Partitella nella Sala delle Lampade vinta ${r.a}–${r.b}.` : `Partitella nella Sala delle Lampade ${r.a}–${r.b}.`);
          X.say(sw([["voce", `Finisce ${r.a}–${r.b}.${msg.length ? " " + msg.join(" · ") + "." : ""}`], ["vl_dina", r.win ? "Il tè lo offro io. Ma il prossimo, il pareggio me lo prendo: te lo scrivo sul mazzo." : "Il tè lo offri tu. Sono ventisei anni che aspetto di dirlo a qualcuno che non sia Gedeone."], ["vl_gedeone", "Al fischio del thermos si sta tutti zitti. Ha un fischio che sembra un sospiro, ma è un fischio."]], BG.G), done);
        },
      }));
    }
    function ettore() {
      const z = zoneNow();
      if (z === "vl_miniera") return say(sw([["vl_ettore", chip(["Io e Viola siamo qui, a camera spenta. Non sappiamo cosa sia peggio: non filmare o non crederci.", "Ho ripetuto il titolo della puntata trenta volte: «Il Latte parla». Trenta. Poi ho smesso, perché non parlava a me.", "Il faretto che ti ho dato è sei lumen. Non servono. Ma dentro sei lumen si sta più tranquilli."])]], BG.M), done);
      if (z !== "vl_gallerie") return delegate("vl_ettore");
      if (has("ettore3")) return done();
      say(sw([
        ["voce", "Dietro una catasta di casse, accovacciati sotto un telo cerato, due forestieri con il gilet pieno di tasche e una telecamera spenta stretta al petto."],
        ["vl_ettore", "Non è come sembra. È peggio: siamo qui per documentare. Quando dicevi «alle nove la radio svela tutto» ho pensato: va bene, aspettiamo dentro."],
        ["vl_viola", "Abbiamo seguito i binari. Poi una porta si è chiusa. Poi una pausa pranzo è cominciata. Non è che ci stiano ignorando: ci stanno aspettando."],
        ["vl_ettore", "Non sparate. Cioè, parlate: ma pianissimo."],
      ], BG.G), () => ask("voce", "Cosa fai con Ettore e Viola?", [
        { label: "Li accompagni fuori, all'Imbocco", sub: "Subito, senza discutere", fn: () => ettoreFine("out") },
        { label: "Li lasci lì, se stanno zitti", sub: "Una bugia ripagata", fn: () => ettoreFine("stay") },
      ], BG.G));
    }
    function ettoreFine(w) {
      F.set("ettore3", w);
      const a = w === "out" ? [["vl_ettore", "Ci riporti su? Grazie. Ti prometto una cosa: se vedo un fantasma, non lo filmo. Lo saluto."], ["voce", "Viola e Ettore si arrampicano a tentoni verso le casse, trovano i binari e salgono, passo dopo passo, verso la luce dell'Imbocco. Dietro di loro, la telecamera spenta si accende da sola un secondo e filma il soffitto."]]
        : [["vl_ettore", "Zitti come marmotte. Anzi: come le Marmotte, che sono più furbe."], ["voce", "Si accovacciano di nuovo sotto il telo e, con un cenno, si turano la bocca a vicenda. Qualcosa, nella sala, sembra approvare."]];
      note(w === "out" ? "Ho riportato Ettore e Viola all'Imbocco, senza storie." : "Ettore e Viola sono rimasti nascosti nella Sala delle Lampade, zitti.");
      say(sw(a, BG.G), done);
    }

    // ---- oggetti di arredo e racconto
    function elmetto({ tx }) {
      const i = tx - 3, n = HELM[i] || "ignoto";
      const rov = i === 0;
      say(sw([["voce", rov ? "Il primo elmetto è più grosso degli altri, con una striscia rossa dipinta sulla visiera e la scritta «O. ROVEDO · CAPOSQUADRA». Dentro, un biglietto piegato: «Contati. Tutti.»" : `Un elmetto giallo, con il nome dipinto sulla visiera: «${n}». Il gancio è liscio, consumato da una mano che lo prendeva ogni sera e lo riappendeva ogni mattina.`], ...(rov ? [[guida() === "bianca" ? "vl_bianca" : "vl_fosco", guida() === "bianca" ? "…Rovedo. (non dice altro; poi, più piano) Mia nonna aveva un elmetto grosso così, in cantina. Diceva che era un secchio." : "Contati. Tutti. (guarda l'elmetto come si guarda uno specchio) Mi sa che la signora sapeva contare."]] : [])], BG.G), done);
    }
    function tabellone() {
      say(sw([["voce", "Il tabellone dei turni, in legno e vernice nera. TURNO DI NOTTE: quattordici nomi scritti a gesso, in una grafia ordinata. In cima, sottolineato due volte: «CAPOSQUADRA: O. ROVEDO». In basso, un'unica riga a mano diversa: «Nessuno manca all'appello.»"], ...(guida() === "bianca" ? [["vl_bianca", "Sai cosa penso? Penso che sia una bella calligrafia. E basta."]] : [["vl_agata", "Il gesso è stato ripassato di recente. Da una mano sola. Lo annoto."]])], BG.G), done);
    }
    function pietra() { say(sw([["voce", chip(["Un tintinnio di picconi, lontano, a tempo; poi un «Ohe!» e un riso. Poi il silenzio di una pausa che dura da sempre.", "Una voce di donna conta ad alta voce: «…undici, dodici, tredici, quattordici.» Si ferma. Ricomincia da capo. Non è ansia: è metodo.", "Un fischio da minatore, corto, lungo, corto: il codice per «tutti fuori». Si ripete, e ogni volta c'è meno aria dentro.", "Uno stivale che scende una scala di ferro. Un altro. Un altro ancora. Poi un respiro di sollievo, tutti insieme."])]], zoneNow() === "vl_galleria4" ? BG.Q : BG.G), done); }
    function crist() { say(sw([["voce", chip(["La lumina brilla senza fare rumore. Se la guardi dritto si ritira un po', come un animale timido: guardala di lato.", "Un grappolo di lumina grande come un pugno. Al tatto è tiepida e dà la sensazione di un pensiero appena pensato.", "I cristalli di lumina, qui, sono più vecchi del paese. Al paese, naturalmente, nessuno l'ha detto."])]], BG.G), done); }
    function cassa() { say(sw([["voce", chip(["Casse di legno con scritto «LUMINA GREZZA · NON SBATTERE». Qualcuno ha aggiunto: «NEMMENO IL PANINO».", "Una cassa di ferri per picconi, ordinati per misura, con un'etichetta di inventario scritta con una cura quasi affettuosa.", "Una cassa piena di caschi di scorta. Uno ha il nome «PRESTITO» dipinto sopra. Nessuno l'ha mai restituito."])]], BG.G), done); }
    function panca() { say(sw([["voce", zoneNow() === "vl_galleria4" ? "La panchina dei dodici posti: undici consumati dalle attese, il dodicesimo ancora nuovo di zecca. Sul sedile, tracciata col gesso, una sagoma di ginocchia raccolte e due mani appoggiate. Qualcuno ha aspettato qui, e ha continuato ad aspettare quando è finito il suo turno." : "Una panca di legno con una tacca ogni anno di servizio. L'ultima tacca è del '98. Sotto, a pennarello: «Mi siedo cinque minuti».", ]], zoneNow() === "vl_galleria4" ? BG.Q : BG.G), done); }
    function lampada() { say(sw([["voce", "Una lampada di rame appesa a un gancio: dentro, un seme di lumina che batte piano. Si accende quando passi e si spegne quando ti allontani, con un rispetto da maggiordomo."]], zoneNow() === "vl_galleria4" ? BG.Q : BG.G), done); }
    function gateGiu() {
      if (S() < 5 || !has("lampada")) return say(sw([["voce", "Un cancello di ferro e di assi, con la freccia in giù. Oltre, una scala si perde nel buio, e il buio è così fitto che sembra fatto di lana. Senza una lampada che ti riconosca, non si scende: parla prima con Gedeone, il capoturno."]], BG.G), done);
      if (S() === 5) { setStep(N, 6); note("Scendo alla Galleria Quattro con la lampada di Gedeone."); }
      go("vl_galleria4", 16, 3);
    }
    function gateSu() {
      const z = zoneNow();
      if (z === "vl_gallerie") { if (S() >= 8) { go("vl_miniera", 13, 6); return finale(); } return go("vl_miniera", 13, 5); }
      if (S() >= 8) return gateSuFinale();
      go("vl_gallerie", 28, 26);
    }
    function gateSuFinale() { go("vl_miniera", 13, 6); finale(); }

    // ---- la Galleria Quattro: maglie, Berto, la scelta di Fosco
    function maglia({ tx }) {
      const nm = JER[tx]; if (!nm) return done();
      const T_ = {
        3: "«BERTO». Il portiere. Un rattoppo di filo rosso sulla manica sinistra, fatto da una mano che sapeva cucire solo i bottoni e ha dovuto imparare anche il resto in una notte.",
        5: "«DUILIO». Il terzino. Il bordo del polsino sinistro è già liso: dicono che quel braccio facesse più strada dell'altro.",
        7: "«SASSO». Il terzino sinistro. Sulla schiena, in lettere minuscole, qualcuno ha scritto «aspettatemi».",
        9: "«NANDO». Il mediano. Nella tasca interna, un biglietto di tram di un tram che non esiste più.",
        11: "«PIO». Il difensore centrale. La maglia è piegata in tre, come una bandiera di casa.",
        13: "«GINO». Il mediano. Dalla tasca spunta un pezzo di gomma da masticare, ancora fresco di menta.",
        22: "«MIRELLA». L'ala. Sul petto, ricamato a mano e storto, un fulmine piccolo piccolo.",
        24: "«ORESTE». La mezzala. Una matita infilata sotto il colletto, con la punta consumata dalle formazioni.",
        26: "«TULLIO». Il centravanti. Il colletto è sporco di rossetto: un bacio fatto prima della partita, per scaramanzia.",
        28: "«LAMPO». La maglia del capitano. La più consumata di tutte, con una fascia sbiadita cucita al bicipite e, sul retro, il nome Brinzi. Mentre la guardi, la lumina nel cucito si accende e si spegne a ritmo, come un lampione che non decide se è l'ora.",
      }[tx];
      say(sw([["voce", T_], ...(tx === 28 ? [["voce", "Alle tue spalle, fuori dalle gallerie, lontanissimo, i lampioni del sentiero tremano tutti insieme. Hai l'impressione che qualcuno abbia alzato la testa."]] : [])], BG.Q), done);
    }
    function magliaVuota() {
      const old = F.get("kit", "") === "old";
      say(sw([
        ["voce", "La maglia bianca. Niente nome, nessun ricamo: soltanto il numero {num}, in lettere di lumina, che si scalda e si raffredda a ritmo del tuo respiro." + (old ? " La cucitura sulla spalla della tua maglia vecchia risponde, a distanza, con un filo di luce: sono fratelli di filo da pesca." : "")],
        ["voce", "Sul gancio c'è ancora il cartellino, scritto a mano: «PER CHI ARRIVA.»"],
        ["vl_fosco", "L'ha lasciata Aurelio. Sono sicuro: lo stesso filo del cartellino, lo stesso modo di attaccare le cose a un gancio. L'ha lasciata per te, e non sapeva nemmeno che ti avrebbe chiamato {n}."],
        tl({ sicuro: "La indosserò quando sarà ora.", attento: "Non è ancora il momento. Il minuto è sospeso, ma io no.", ironico: "Ventisei anni di attesa e non c'è nemmeno un attaccapanni libero." }),
      ], BG.Q), () => { F.set("maglia_vista", true); note("Alla Galleria Quattro c'è una maglia bianca col mio numero, con un cartellino: «per chi arriva»."); done(); });
    }
    function berto() {
      const s = S(); F.set("berto_met", true);
      if (s === 6) return bertoScena();
      const pari = has("berto_pari");
      const o = [{ label: "Chiedi della partita", fn: () => say(sw([["vl_berto", pari ? "Pari, ragazzo. Un pari al novantesimo non esiste, ma io lo invento per te. Quando tornerai, tirerai meglio." : "Ottantanove minuti, un gol per parte, e il pallone in mezzo che non vuole sapere chi lo ha. È una bella partita. Sono ventisei anni che non la finisco."]], BG.Q), done) },
        { label: "Chiedi di Fosco", fn: () => say(sw([["vl_berto", F.get("fosco", "su") === "giu" ? "Il fratellino è seduto sulla panchina. Sembra un bambino che aspetta lo scuolabus, ma ha la faccia di nostra madre. Io lo guardo e non so se ridere o piangere. Faccio tutte e due, ma senza voce." : "Fosco è tornato su. Ha detto «con il pallone giusto». Io lo aspetto: nel minuto, lui arriva sempre in orario."]], BG.Q), done) }];
      if (s >= 7) o.push({ label: "Chiedi dell'arbitro", fn: () => say(sw([["vl_berto", "Là in fondo, nella Camera. Ha il fischietto da ventisei anni nella bocca e non lo ha mai usato: ogni volta che prova, gli esce un fischio storto. Non è un cattivo. È uno che ha avuto paura di una busta."]], BG.Q), done) });
      ask("vl_berto", "«Ottantanove. Sempre ottantanove. Ma stavolta ho compagnia.»", o, BG.Q);
    }
    function bertoScena() {
      say(sw([
        ["voce", "Berto è fermo sulla linea di porta, con le mani fasciate di nastro bianco e il peso sulle punte. Fa tre passi, si ferma, ne fa tre indietro. Sembra un orologio a pendolo con le scarpe."],
        ["vl_berto", "Eccolo! Il tredicesimo! Finalmente. (ti guarda dall'alto in basso come si guarda una cosa che aspettava da tempo) Ottantanove minuti, uno a uno. Il mister ha detto: «Serve un tiro che nessuno si aspetta». Io dico: serve un tiro, punto."],
        ["voce", "Fosco ti si è fermato alle spalle. Non dice niente. Ha le mani strette attorno al manico della lanterna come ci si regge a una ringhiera."],
        ["vl_berto", "Facciamo così: cinque rigori. Io qua, tu là. Se mi segni quanto basta, ti dico dove sta l'altra metà della partita. Se non mi segni, tiri domani, e dopodomani, e così via finché la partita non decide."],
        tl({ sicuro: "Va bene. Mettiti in porta.", attento: "Il tuo è un nodo a farfalla. Mi ricorda qualcuno.", ironico: "Un portiere che chiede i rigori per iscritto: finalmente un professionista." }),
      ], BG.Q), () => ask("vl_berto", "«Allora? Cinque rigori. Hai il tiro?»", [
        { label: "Accetti la sfida dei cinque rigori", sub: "5 prove di tempismo · serve precisione", cls: "hot", fn: rigori },
        { label: "Un momento, prima respiri", fn: done },
      ], BG.Q));
    }
    function rigori() {
      const f = F.get("berto_f", 0), need = Math.max(6, 9 - f);
      timing("Rigore", 5, "night", (k) => k === 3 ? "<b>" + T("{tiro}") + "!</b> Berto si tuffa, tocca appena, e la rete di nebbia luminosa trema come un lenzuolo steso al vento." : k === 2 ? "<b>Parato… quasi.</b> Berto devia sul palo, e il rumore è di un campanile lontano." : "<b>Parato.</b> Berto si rialza, scuote la testa: «Troppo educato, tredicesimo.»", (pts) => {
        const tot = sumPts(pts);
        if (tot >= need) return bertoPass(tot, false);
        const nf = F.add("berto_f", 1);
        if (nf >= 3) return bertoPass(tot, true);
        say(sw([["voce", `Rigori: ${tot} su 15 (ne servivano ${need}). Berto si rialza dall'ultimo tuffo, si sistema il nastro e ti indica la linea con due dita.`], ["vl_berto", chip(["Quasi, quasi. Il pallone, quando va, va bene: è la strada che ha un'idea sua.", "Hai il tiro, ma non il tempo. Il tempo si tira insieme al pallone, ragazzo.", "Ancora. Io ho tutta la partita. Tu hai solo cinque tiri."])]], BG.Q), () => ask("vl_berto", "«Ancora cinque?»", [{ label: "Riprova i rigori", cls: "hot", sub: "Berto, a ogni prova, è un po' meno severo", fn: rigori }, { label: "Non adesso", fn: done }], BG.Q));
      });
    }
    function bertoPass(tot, pari) {
      F.set("berto_ok", true); if (pari) F.set("berto_pari", true);
      const m = reward("vl_berto", { coins: 15 });
      say(sw([
        ["voce", pari ? `Rigori: ${tot} su 15. Dopo tre sconfitte onorevoli, Berto alza le mani e ride, sul serio, come non faceva da un quarto di secolo.` : `Rigori: ${tot} su 15. L'ultimo tiro entra: la rete di nebbia luminosa si gonfia e si sgonfia, e il portiere resta con le braccia aperte a guardare il punto in cui il pallone non c'è più.`],
        ["vl_berto", pari ? "Pari! Ci fermiamo qui. Sei più testardo di me, e io sono uno che ha aspettato ventisei… (si ferma) ventisei che? Ottantanove minuti, ho detto. Dico sempre ottantanove." : "…Eh. (abbassa le mani, fasciate, e le guarda come fossero di un altro) Troppo tardi per vincere e troppo presto per perdere. Lo sai che mi sono dimenticato l'ultima volta che ho parato sul serio?"],
        ["vl_berto", "Il nodo a farfalla. Il nastro. Mi fascio le dita prima di ogni partita da quando avevo dodici anni. L'ho insegnato io a mio fratello piccolo. O meglio: lui mi guardava, e poi lo rifaceva sul suo dito, e il suo era più bello."],
        ["voce", "Dietro di te, la lanterna di Fosco trema. Non è la lanterna."],
        ["vl_fosco", "Berto."],
        ["voce", "Il portiere si volta. Guarda Fosco con la fronte aggrottata di chi cerca un volto in una folla, e non lo trova."],
        ["vl_berto", "Non ho fratelli con quella voce. Mio fratello ha otto anni e una voce così (alza la mano a mezzo metro da terra) e sale su uno sgabello per vedermi parare. Questa è la voce di uno che ha fumato per quarant'anni e ha smesso per sbaglio."],
        ["vl_fosco", "Ho smesso per Teodora. Aveva un orario anche per le sigarette, e io no. (la voce gli si rompe) Ho otto anni, Berto, da tanto tempo. Ne ho sessantasei. Ho spolverato il tuo armadietto ogni mattina."],
        ["vl_berto", "…il mio armadietto."],
        ["vl_fosco", "Ogni mattina. Con lo straccio e la cera. Senza sapere perché. Per istinto. Come si innaffia la pianta di un amico che è partito. E il tuo numero uno, quello con il nome grattato via, lo lucidavo di sera, quando non mi vedeva nessuno."],
        ["voce", "Berto non risponde. Guarda le sue mani fasciate, poi quelle di Fosco, nodose, con le macchie dell'età. Poi di nuovo le sue. Con lentezza di chi traduce, siede sulla linea di porta come un bambino stanco."],
        ["vl_berto", "Ventisei anni. Il minuto non passa, per noi: per voi sì. (alza gli occhi) Dimmi una cosa, fratellino. La mamma?"],
        ["vl_fosco", "Ha aspettato. Poi ha smesso di aspettare, che è un'altra cosa. È rimasta con la radio accesa fino all'ultimo, quella che dà il meteo. Diceva che prima o poi avrebbero dato la formazione."],
        ["vl_berto", "(ride, e piange, e continua a ridere) Dovevamo vincere tre a due. Lo sapevo. Lo sapevo dall'inizio."],
        ["voce", "Per un po' nessuno parla. Dalla panchina dei dodici posti, il silenzio sembra una persona seduta ad ascoltare."],
        ["vl_berto", "Ti spiego, tredicesimo. Il tredicesimo non è chi viene dopo: è chi continua. Fosco lo è da ventisei anni. Tu forse lo sarai. Ma per lui… (si volta verso Fosco) fratellino, io non ti trattengo. Ma posso tenerti il posto, se vuoi. Non è un'idea: è una porta. Si apre nei due sensi, fino al fischio."],
      ], BG.Q), () => ask("voce", "Fosco si asciuga la faccia con il dorso della mano, guarda Berto, guarda te. Cosa gli dici?", [
        { label: "«Resta, se vuoi. Hai diritto a un minuto.»", sub: "Lasci scegliere il cuore", fn: () => foscoScelta("giu", "tu") },
        { label: "«Torna su. Chi tiene l'orario, se non c'è chi aspetta?»", sub: "Lasci scegliere il dovere", fn: () => foscoScelta("su", "tu") },
        { label: "«Decidi tu, Fosco. Io ti aspetto.»", sub: "Gli lasci la scelta, tutta", fn: () => foscoScelta(F.get("cornelio_t", "") === "verita" || F.get("teodora_sa", "aspetto") !== "aspetto" ? "su" : "giu", "lui") },
      ], BG.Q));
    }
    function foscoScelta(w, chi) {
      F.set("fosco", w); F.set("fosco_by", chi); if (chi === "lui" && w === "su") F.set("fosco_prom", true);
      const a = w === "giu" ? [
        ["vl_fosco", chi === "tu" ? "Resto. Non per sempre: per il tempo che serve. Ho aspettato ventisei anni fuori, posso aspettare un po' dentro." : "Resto. Non perché non voglia tornare: perché adesso devo restare. Berto ha tenuto la porta ventisei anni. Posso tenerla io per una sera."],
        ["vl_berto", "Un posto sulla panchina c'è. Il dodicesimo: lo teneva Corné, ma non lo usa. Siediti. Ti spiego come si ripete «ottantanove» senza perdere la voce."],
        ["vl_fosco", "Dillo a Mirtilla, quando sali: che mi riservi il panino delle sei. Lo porterai tu, ogni giorno, se hai voglia. E non dire niente a Teodora finché non glielo dico io."],
      ] : [
        ["vl_fosco", chi === "tu" ? "Torno. Il paese non può restare senza chi spolvera. E tu, Berto, non ti muovere." : "Torno. Se Cornelio ha parlato, qualcuno dovrà guardare il paese in faccia al suo fianco. E Teodora ha già una sedia in meno a Natale: non le faccio un'altra assenza."],
        ["vl_berto", "Non mi muovo da ventisei anni, fratellino. Quando mai." ],
        ["vl_fosco", chi === "lui" ? "Una notte, però: stanotte resto qui con te, a fare il tredicesimo come si deve. Poi su, col pallone giusto. È un patto, Berto." : "Torno col pallone giusto. E con la formazione, quella vera, da leggere alla radio."],
      ];
      say(sw([...a,
        ["voce", "Berto si alza, si dà una manata sui pantaloni come si fa a fine allenamento e allunga una mano fasciata. Tu la stringi. È tiepida, appena un po' elettrica."],
        ["vl_berto", "La porta di luce, a est, è aperta. L'arbitro è di là: ottantanovesimo minuto, e lui ha ancora il fischietto in bocca. Digli che non si fischia a metà."],
        ["voce", "Sul muro, accanto alla maglia 1, una piccola luce turchese si accende e si spegne, e per la prima volta il nastro bianco sulle mani di Berto sembra una fascia da capitano."],
      ], BG.Q), () => {
        X.lanAdd("vl_berto"); F.set("porta4", true); X.setTiles(30, 10, 30, 12, "_"); X.setTiles(30, 11, 30, 11, "-");
        const m = [];
        note(w === "giu" ? "Fosco ha incontrato suo fratello Berto, il portiere del 6:43, e resta con lui per ora." : "Fosco ha incontrato suo fratello Berto, il portiere del 6:43, e torna su con noi.");
        note("La porta di luce a est è aperta: oltre c'è la Camera del Minuto, con l'arbitro.");
        setStep(N, 7); toast("Berto ti ha dato la sua Lanterna"); done();
      });
    }
    function eco(id) {
      const L1 = {
        vl_mirella: ["Palla a me! Palla a me! (sorride) Lo dico da ventisei anni. Una volta qualcuno la deve passare, no?", "Quel «{tiro}» ha un nome bello. Chiamalo come vuoi, ma tiralo piano: la porta è di nebbia, si disfa.", "Abbiamo giocato in undici più uno. Il dodicesimo era nostro, anche se non è sceso. Il tredicesimo… sei tu? Il dodicesimo non ti riconosce: ti sta aspettando da fuori."],
        vl_pio: ["Io marco l'aria. Qualcuno deve.", "Un difensore è uno che si fida del compagno dietro. Io, dietro, avevo Berto. Mi fido ancora.", "Di corsa, ragazzo, o si arriva tardi. Tardi, dicono, è il solo difetto che non si perdona a un difensore."],
        vl_duilio: ["Il piede sinistro lo consumo prima: è il piede che pensa. Il destro corre e basta.", "Sai qual è la prima regola del terzino? Non avere paura di chi ti passa davanti. La seconda: non averne di chi ti passa dietro.", "Dicono che il tempo qui non passi. Non è vero: passa, ma solo per i capelli. Guardami, sono ancora tutti miei."],
      }[id];
      say(sw([[id, chip(L1)]], BG.Q), done);
    }
    function foscoMina() {
      const s = S(), z = zoneNow();
      if (z === "vl_galleria4" && s >= 9 && F.get("fosco", "su") === "giu") return foscoGiu();
      const L1 = s <= 2 ? ["Quando ero piccolo salivo su uno sgabello per vedere una porta. La porta non l'ho mai vista da vicino. Strano, vero? A forza di guardarla da lontano, ne ho fatto un'abitudine.", "Qui sotto fa un freddo che sa di casa. Non so da dove mi venga questa certezza."]
        : s === 3 ? ["Il carrello? Sono bravo con le cose che stanno ferme. È con quelle che si muovono che ho qualche difficoltà.", "Se non ti dispiace non guardo il carrello: mi ricorda un funerale."]
          : s === 4 ? ["Ho una sensazione strana. Come quando entri in una stanza e senti che qualcuno ha appena smesso di parlare di te."]
            : s === 5 ? ["Giù, nella Quattro. Dicono che ci fosse un campo di calcio, lì sotto: lo sapevi? Una galleria lunga come un campo. Gliel'ho sentito dire a un minatore, una volta. Era già vecchio."]
              : s === 6 ? ["…Non parlarmi adesso. Mi sa che se parlo mi sveglio."] : ["Hai visto? Mio fratello ha gli stessi occhi di nostra madre. Io ho preso la voce di nostro padre. Che bella spartizione."];
      ask("vl_fosco", s >= 7 ? "«Mi sono fermato un momento. Poi riparto.»" : "«Avanti, avanti. Io vi seguo da dietro: è il posto del tredicesimo.»", [{ label: "Come va?", fn: () => say(sw([["vl_fosco", chip(L1)]], z === "vl_galleria4" ? BG.Q : BG.G), done) }], z === "vl_galleria4" ? BG.Q : BG.G);
    }
    function foscoGiu() {
      const ba = has("fosco_prom");
      const o = [
        { label: "Come stai, qui sotto?", fn: () => say(sw([["vl_fosco", chip(["Meglio di quanto pensi. Sono seduto, non ho fretta, e c'è mio fratello che parla di parate. Se questo è il paradiso, è molto umano: ci si annoia con garbo.", "Ho imparato a dire «ottantanove» senza perdere la voce. Ottantanove. Ottantanove. Vedi? Funziona.", "Berto mi insegna i nodi. Lui fa il nodo a farfalla e io lo imito. Il mio è migliore, dice lui. Lo dice per gentilezza."])]], BG.Q), done) },
        { label: "Torna a casa con me", sub: "Gli chiedi di risalire", fn: () => say(sw([["vl_fosco", ba ? "Una notte, ho detto. È passata. Ora ti seguo su, ma non ti chiedo di non voltarti: io mi volterò per tutti e due." : "Non adesso. Non ancora. Aspetto la fine della partita: so che la finirete. Dopo, ti prometto, su a spolverare l'armadietto giusto."]], BG.Q), () => { if (ba && F.get("fosco", "") !== "su") { F.set("fosco", "su"); note("Fosco è risalito con me: la notte è finita."); } done(); }) },
      ];
      ask("vl_fosco", "«Siediti. La panchina è comoda; il dodicesimo posto, poi, non lo usa nessuno.»", o, BG.Q);
    }
    function foscoPaese() {
      const s = S();
      if (s < 9 || F.get("fosco", "su") !== "su") return delegate("vl_fosco");
      const o = [
        { label: "Com'è tornare su?", fn: () => say(sw([["vl_fosco", chip(["Strano. La scala che sale è più alta di quella che scende. Dicono che sia l'età; io dico che è la lumina.", "Ho spolverato anche il numero uno, stamattina. Con lo straccio nuovo. Sul retro c'è una scritta che prima non vedevo: «per Fosco».", "Mirtilla mi ha fatto la cioccolata «Nebbia Riconquistata». Non ho capito se è una lode o una minaccia."])]], BG.P), done) },
        { label: "Di Berto", fn: () => say(sw([["vl_fosco", has("fosco_prom") ? "Ho detto una notte. La notte è andata. Berto ha detto: «Corri su e aspettaci». Mi sembra una buona definizione di tredicesimo." : "Ha tenuto la porta ventisei anni. Io la terrò al magazzino, finché non finite la partita. È il mio turno."]], BG.P), done) },
      ];
      ask("vl_fosco", "«Sono qui, sono io, sono di nuovo io. Non so ancora quale dei tre.»", o, BG.P);
    }

    // ---- la Camera del Minuto: l'arbitro
    function parete() {
      say(sw([["voce", S() >= 8 ? "La parete di lumina scrive, in lettere lente e fredde, la stessa riga che l'arbitro ha detto: «REGISTRO · MUNICIPIO · IV CASSETTO». Poi la cancella, e la riscrive, come chi vuole essere sicuro che tu l'abbia letta." : "La parete di lumina scrive e cancella righe lente: sillabe, frammenti di nomi, un numero di cassetto che non si lascia leggere intero. Sembra un registro che sta ancora decidendo cosa essere."]], BG.Q), done);
    }
    function arbitro() {
      const s = S();
      if (s < 7) return done();
      if (s > 7) return say(sw([["vl_arbitro", has("arbitro") && F.get("arbitro", "") === "comp" ? chip(["Lo dirò. Lo dirò a voce alta, quando il fischio mi tornerà. Il fischio mi sta tornando: lo sento fra i denti.", "Stai attento al Registro. Nel quarto cassetto la mia firma è vera. Quella dell'altro è bella, ma finta come un sorriso da fotografia."]) : chip(["Corto, lungo, corto. Ho finito il codice. Mi manca il fischio vero: quello che si fa per chiudere, non per aprire.", "Non fischiare a metà, ragazzo. Mai. Chi lo fa passa il resto della vita a finire la frase."])]], BG.Q), done);
      say(sw([
        ["voce", "La Camera del Minuto è rotonda e bassa, come l'interno di un orologio. Sul muro a est la parete di lumina scrive e cancella righe lente. Al centro, in divisa nera dai bordi sbiaditi, c'è un uomo con un fischietto in bocca e il polso alzato. Non soffia. Non respira. Fischierebbe, ma non ci riesce."],
        ["voce", "L'orologio al suo polso è fermo sulle sei e quarantatré. Quello sul muro segna 89:00. I due orari non si parlano."],
        ["vl_arbitro", "(si toglie a fatica il fischietto, che lascia un segno bianco sulle labbra) Chi sei? Non sei in lista. …Nessuno è in lista, a quest'ora: la partita è finita da un pezzo, ma nessuno mi dice come."],
        tl({ sicuro: "Lei è l'arbitro della finale.", attento: "Corto, lungo, corto. Era il suo fischio.", ironico: "Mi hanno detto che fischia male. Volevo verificare di persona." }),
        ["vl_arbitro", "Corto, lungo, corto. (ride, e non ride) Sì. Era il mio. Ognuno fischia in un modo solo: io ho imparato a fischiare in codice. Quarantatreesimo, fallo di mano che non c'era, fischio storto. Mi pagarono perché fosse storto."],
        ["vl_arbitro", "Mi dissero: «Una carica controllata, signor Fischietti. La miniera è vuota, tutti alla partita, anche i turni. Un fischio al momento giusto per tenere il pubblico sul campo, e una busta.» Una busta. Con una somma, e una ricevuta da firmare. L'ho firmata con una firma tutta in tondo, di quelle che ti insegnano a scuola."],
        ["vl_arbitro", "Chi mi pagò? Un ingegnere. Guanti bianchi anche d'estate. Parlava piano, come i medici e come chi non ha mai alzato la voce con nessuno. Il nome…"],
        ["voce", "Si porta il fischietto alla bocca per dire il nome, e il nome esce come un fischio senza fiato. Ci prova tre volte. Alla terza, ti guarda con una vergogna semplice, da ragazzino."],
        ["vl_arbitro", "Il fischio mi è rimasto in gola e il nome ci sta davanti. Ma il referto no: lo scrissi a mano alle undici di quella notte, con le dita che tremavano. Lo consegnai al segretario comunale, uno con la voce da corvo. La ricevuta è incollata sul retro. Sta nel Registro, in Municipio. Quarto cassetto."],
        ["vl_arbitro", "Un'altra cosa. Ho un figlio. Ha cinque anni, a Cima Alta, e un fischietto di plastica gialla con cui fischia dal balcone ogni volta che passa una cabina. Sua madre gli ha dato il cognome suo, non il mio. Ha fatto bene. (stringe il fischietto) Se la ricevuta viene fuori, non so se mi perdonerà. Ma se la tengo nascosta è peggio."],
        ["voce", "Sul muro, la parete di lumina si ferma di scrivere. Poi, lenta e netta, traccia la riga: «REGISTRO · MUNICIPIO · IV CASSETTO». Sotto, in lettere più piccole: «PRIMA CHE ARRIVINO.»"],
      ], BG.Q), () => ask("vl_arbitro", "Cosa gli dici?", [
        { label: "«Il suo fischio ha tenuto in trappola una squadra e quattordici uomini.»", sub: "Accusi", fn: () => arbitroFine("acc") },
        { label: "«Mi serve la prova, non la sua assoluzione.»", sub: "Pratico", fn: () => arbitroFine("prag") },
        { label: "«Ha eseguito un ordine. Il peso è di chi l'ha dato. Ci aiuti a dirlo.»", sub: "Compassione", fn: () => arbitroFine("comp") },
      ], BG.Q));
    }
    function arbitroFine(w) {
      F.set("arbitro", w);
      const a = w === "acc" ? [["vl_arbitro", "Lo so. Lo so, ragazzo. Dillo più forte, dillo ancora: è l'unica cosa che mi fa sentire il fischietto. Se non lo sento, non ci credo."], ["voce", "Si porta il fischietto alle labbra e, per la prima volta, un suono vero lo attraversa: corto, lungo, corto, ma dritto. Il suono si spegne contro la roccia, e lui si copre la faccia con le due mani aperte."]]
        : w === "prag" ? [["vl_arbitro", "Giusto. La prova c'è. L'assoluzione non l'ho mai chiesta a nessuno: l'ho solo aspettata. Quarto cassetto: prendila e portala a chi sa leggerla."], ["voce", "Annuisce una sola volta, a scatti, come chi ha imparato a ricevere un ordine anche quando è un favore."]]
          : [["vl_arbitro", "…Lo dirò. Lo dirò se qualcuno mi chiede dove mettere la voce. Nessuno me l'ha mai chiesto. Né l'avvocato, né la moglie, né il prete."], ["voce", "Respira. Per la prima volta in ventisei anni il suo petto si alza e si abbassa, piano, a tempo con un orologio che non c'è."]];
      note(w === "acc" ? "L'arbitro Gaudenzio Fischietti mi ha detto di una busta, di un ingegnere con i guanti bianchi, di una ricevuta incollata sul referto. L'ho accusato." : w === "prag" ? "L'arbitro Gaudenzio Fischietti: busta, ingegnere con guanti bianchi, ricevuta incollata sul referto. Gli ho chiesto solo la prova." : "L'arbitro Gaudenzio Fischietti: busta, ingegnere con guanti bianchi, ricevuta incollata sul referto. Gli ho detto che il peso è di chi ha dato l'ordine.");
      note("Il referto con la ricevuta è nel Registro del Municipio, quarto cassetto. Ha anche un figlio, a Cima Alta.");
      say(sw([...a,
        ["voce", "Poi la Camera si fa buia, una luce per volta, come un teatro a fine serata. Da molto lontano, dalla porta di luce, Berto grida: «OTTANTANOVE!» e qualcuno risponde, a mezza voce, «…novanta».", ],
        ["voce", "La lumina ti solleva con delicatezza, come una mano che sa quanto pesi, e ti riporta su per i binari, per le sale, per i cristalli. Nessuno ti ferma. Sembra che il minuto, per una sera, ti abbia concesso di uscire."],
      ], BG.Q), () => { setStep(N, 8); go("vl_miniera", 13, 6); finale(); });
    }

    // ---- l'Imbocco: gli altri, e il finale
    function cornelio() {
      const z = zoneNow(), s = S();
      if (z !== "vl_miniera") return delegate("vl_cornelio");
      const L1 = s <= 1 ? ["Io resto qui, all'ingresso. Sono bravo a stare dove si aspetta: ho vent'anni di esperienza.", "La lampada l'ho accesa con le mie mani. Non tremavano. Quasi."] : s <= 8 ? ["Se vi sento fischiare, fischio anch'io. Se non vi sento, fischio lo stesso. Il fischio è una forma di preghiera con meno parole.", "Sono sul sentiero da due ore. Per la prima volta in ventisei anni non ho fatto nessun discorso. È più difficile del previsto."] : ["Le chiavi del Registro le tengo in tasca, accanto al guanto. Pesano meno di quanto pensassi e più di quanto vorrei.", "Mi sono tolto la fascia tricolore, stasera. Sotto, la camicia era più stropicciata del discorso. Ma respirava meglio."];
      say(sw([["vl_cornelio", chip(L1)]], BG.M), done);
    }
    function tonio() { if (zoneNow() !== "vl_miniera") return delegate("vl_tonio"); say(sw([["vl_tonio", chip(["Una porta, per sembrare più piccola, deve stare ferma. Una corda, invece, per sembrare utile, deve tirare. Io faccio tutte e due.", "Ho il thermos. Se qualcuno esce, lo offro. Se nessuno esce, lo bevo io, per scaramanzia.", "Gisella dice che sono pallido. Siamo Camosci: pallidi non lo siamo mai, siamo gialli."])]], BG.M), done); }
    function remoT(id) {
      if (zoneNow() !== "vl_miniera") return delegate(id);
      say(sw([[id, chip(["La corda è tesa. Non so a cosa, ma è tesa. Se tiri tre volte, tiro anch'io. Se non tiri, tiro lo stesso: sono i Camosci, siamo testardi.", "Là sotto non entro. Non perché abbia paura: perché so che dentro, per un'ora, non servo a niente. Fuori servo. E mi sembra già un progresso.", "Sai cosa ho capito? Che tenere la corda è la parte più lunga. E meno male, perché io, di cose lunghe, ne ho poche."])]], BG.M), done);
    }
    function viola() { if (!MINE.includes(zoneNow())) return delegate("vl_viola"); say(sw([["vl_viola", zoneNow() === "vl_miniera" ? chip(["Ho chiuso l'obiettivo con il cappuccio. Lui dice: «non sprecare la batteria». Io dico che certe cose non vanno registrate, vanno ricordate.", "Ettore ha scritto «grazie» sul quaderno. Poi l'ha cancellato, perché «suona troppo definitivo». Poi l'ha riscritto."]) : "Il Latte, in telecamera, viene meno bianco di come sembra. Qui sotto è l'opposto: è più bianco di come sembra. Mi prende la nausea del bello."]], zoneNow() === "vl_miniera" ? BG.M : BG.G), done); }
    function lampionaio() {
      if (zoneNow() !== "vl_miniera") return delegate("vl_lampionaio");
      const s = S();
      if (s >= 9) return say(sw([["voce", chip(["Il Lampionaio solleva la lavagna, senza fretta, e scrive: «IL REGISTRO. IV CASSETTO. PRIMA DELLE NOVE.» Poi, più piano: «GRAZIE PER IL MINUTO.»", "Accende, uno dopo l'altro, i lampioni del sentiero. Quando arriva all'ultimo si ferma e ti guarda: nel gesso, sulla lavagna di lumina, compare un'unica parola: «ANCORA.»", "Il Lampionaio segue con lo sguardo la lumina che si spegne sull'Imbocco. Scrive: «LA PORTA È APERTA. NON È ANCORA FINITA.» E sotto, piccolissimo: «BENE.»"])]], BG.M), done);
      say(sw([["voce", chip(["Il Lampionaio scrive: «SOTTO NON C'È NIENTE DA VINCERE. SOLO DA FINIRE.» Poi, dopo un attimo, aggiunge: «PRENDI IL PASSO. NON LA FRETTA.»", "Sulla lavagna, a gesso: «HAI VENTISEI ANNI DI MENO DI QUANTO TI SERVA. VA' PIANO.»"])]], BG.M), done);
    }
    function finale() {
      const su = F.get("fosco", "su") !== "giu", sa = F.get("teodora_sa", "aspetto"), c = compId(), oth = otherId(), rem = remoHelps();
      say(sw([
        ["voce", "Il pozzo ti restituisce con la grazia di chi ha fatto un favore e non vuole ringraziamenti. Sei sul sentiero dei Lampioni, all'aperto, con la lumina che ti si spegne addosso come una brace. Laggiù, la stazione dice 6:43. Come sempre."],
        ["voce", su ? "Fosco esce per ultimo, con la lanterna spenta e uno spago legato al polso con un nodo a farfalla. Non dice niente. Per Fosco è un record." : "Fosco è rimasto in fondo alla Quattro, seduto sulla panchina dei dodici posti, a tenere la porta. Ti sei voltato una volta sola. Lui ti ha fatto il saluto del tredicesimo: un dito alla fronte e un sorriso con dentro tutto."],
        [c, c === "vl_bianca" ? "Rovedo. (fa una pausa lunga) Non lo dico a nessuno. Lo dico a voi. Mia nonna ha un elmetto in cantina, grosso, con una striscia rossa. Non ho mai chiesto perché. Ora credo di saperlo, e credo che questo cambi qualcosa."  : "Rovedo. L'ho annotato. Lo dico a bassa voce, perché so quanto vale: ho il sospetto che Bianca abbia in casa un elmetto con una striscia rossa."],
        ...(rem ? [[remoId(), "Tre tiri? Non li ho sentiti. Ho tirato lo stesso. (si schiarisce la gola) Siete salvi? Allora il resto me lo racconti con la cioccolata."]] : []),
        ["voce", "Dal paese sale, con il cappotto della stazione e il registro sotto il braccio, Teodora. Arriva con il passo di chi corre senza correre. Accanto a lei, Cornelio, che ha ancora le chiavi in mano e le guarda come un oggetto che non gli appartiene."],
        ["vl_teodora", sa === "aspetto" ? "Cornelio non mi ha detto niente, ancora. Aspetta il momento. Io aspetto che sia lui a sceglierlo. Ma ho messo una sedia in fondo alla sala del registro, per lui." : "Cornelio mi ha detto tutto, stamattina. Ho scritto il suo nome nel registro, a penna, non a matita. Non era perdono: era inchiostro."],
        ["vl_teodora", "Alle 18:43 la cabina è salita. Non vuota: con una persona. Scendeva dal vagone con un cappotto grigio e i guanti bianchi. Il registro dice «ARRIVATO». Gli orari li rispetto, i guanti bianchi no."],
        ["voce", "Nessuno parla. Il Lampionaio, in cima ai lampioni, solleva la lavagna: «IL REGISTRO. IV CASSETTO. PRIMA CHE ARRIVINO.»"],
        ["vl_cornelio", "Ho le chiavi del Registro. Il municipio ha un archivio, in fondo all'archivio un armadio, nell'armadio un cassetto: il quarto. L'ho tenuto chiuso per ventisei anni perché non volevo leggere cosa dicesse di me. (porge una chiave di ferro, annerita, con un nastro rosso) Ora voglio leggerlo con te."],
        tl({ sicuro: "Domani, all'alba. Con le chiavi e con la verità.", attento: "L'arbitro ha detto «prima che arrivino». Chi sono, «loro»?", ironico: "Un uomo con i guanti bianchi che arriva in funivia e non chiede dove si mangia: sospetto già dal cappotto." }),
        ["vl_noemi", F.get("intervista", false) ? "…Radio Nebbia, qui Noemi. Meteo: nebbia. E un signore in cappotto grigio in cerca dell'Ufficio Turismo. A Vallombra, ripeto, non c'è mai stato. Chi ascolta, lo accompagni dove vuole, ma non troppo in fretta. E a {n}, se mi ascolta: sei in diretta, e ti vogliamo bene." : "…Radio Nebbia, qui Noemi. Meteo: nebbia. E un signore in cappotto grigio in cerca dell'Ufficio Turismo. A Vallombra, ripeto, non c'è mai stato. Chi ascolta, lo accompagni dove vuole, ma non troppo in fretta."],
        ["voce", "Agata guarda lo schermo del telefono, lo gira a faccia in giù sul palmo e dice: «Una chiamata che aspettavo. E che speravo non arrivasse stasera.» Poi lo mette in tasca, a faccia in giù anche lì."],
        ...(ettoreOn() ? [["voce", "Più in basso, dietro un larice, un gilet con diciannove tasche e una telecamera spenta: Ettore e Viola ti fanno il cenno di chi ha capito di non aver capito."]] : []),
      ], BG.M), fineCapitolo);
    }
    function fineCapitolo() {
      X.finishChapter(N, "miniera"); setStep(N, 9);
      note("Il Registro del Municipio, quarto cassetto: Cornelio mi ha dato le chiavi. Un uomo con il cappotto grigio e i guanti bianchi è arrivato in funivia.");
      const rw = reward("vl_ch3", { coins: 50, cos: "vl_stemma_miniera" });
      X.say(sw([["voce", "CAPITOLO 3 · LA MINIERA DELLA LUCE · CONCLUSO"], ["voce", (rw.length ? rw.join(" · ") + ". " : "") + "Il Capitolo 4 ti aspetta: il Registro del Municipio, quarto cassetto. Dal menu di Vallombra scegli «Inizia il capitolo 4». Nel frattempo puoi tornare in miniera, raccogliere le ultime schegge, giocare la partitella con il Turno di Giorno e parlare con tutti."]], BG.M), done);
    }

    // ---- oggetti e personaggi
    const obj = {
      "vl_miniera:^": gateDentro,
      "vl_gallerie:^": gateSu, "vl_gallerie:d": gateGiu, "vl_gallerie:Q": cristallo, "vl_gallerie:D": portaD, "vl_gallerie:R": carrello, "vl_gallerie:H": elmetto, "vl_gallerie:n": tabellone,
      "vl_gallerie:C": crist, "vl_gallerie:E": pietra, "vl_gallerie:x": cassa, "vl_gallerie:b": panca, "vl_gallerie:l": lampada,
      "vl_galleria4:^": gateSu, "vl_galleria4:M": maglia, "vl_galleria4:N": magliaVuota, "vl_galleria4:D": portaD, "vl_galleria4:P": parete, "vl_galleria4:E": pietra, "vl_galleria4:b": panca, "vl_galleria4:l": lampada,
    };
    const talk = {
      vl_fosco: () => { const z = zoneNow(); if (z === "vl_paese") return foscoPaese(); if (z === "vl_miniera") return foscoImbocco(); if (MINE.includes(z)) return foscoMina(); return delegate("vl_fosco"); },
      vl_bianca: bianca, vl_agata: agata, vl_cornelio: cornelio, vl_tonio: tonio, vl_viola: viola, vl_ettore: ettore, vl_lampionaio: lampionaio,
      vl_remo: () => remoT("vl_remo"), vl_remo_ns: () => remoT("vl_remo_ns"),
      vl_gedeone: gedeone, vl_dina: dina, vl_berto: berto, vl_arbitro: arbitro,
      vl_mirella: () => eco("vl_mirella"), vl_pio: () => eco("vl_pio"), vl_duilio: () => eco("vl_duilio"),
    };

    return {
      n: N, title: "La Miniera della Luce", sub: "Binari, cristalli e undici maglie appese", start: "vl_miniera", zones, talk, obj, goal, mood,
      news: (id, s) => {
        const z = zoneNow();
        if (id === "vl_fosco") return z === "vl_paese" ? false : (z === "vl_miniera" && s === 0);
        if (!MINE.includes(z)) return X.newsOf(id, N);
        if (id === "vl_gedeone") return s === 4;
        if (id === "vl_berto") return s === 6;
        if (id === "vl_arbitro") return s === 7;
        if (id === "vl_ettore") return z === "vl_gallerie" && !has("ettore3");
        return false;
      },
      intro: () => [
        ["voce", "La notte del Latte non è finita: è passata in un'altra stanza. All'Imbocco della miniera le assi sono cadute, una dopo l'altra, da sole, e dentro c'è un corridoio di binari e di luce turchese che respira.", BG.M],
        ["voce", "Il paese lo sa: Noemi ha dato la notizia tra il meteo e i necrologi. Quando il cielo si è fatto scuro, sul sentiero dei Lampioni c'erano già dodici persone con una torcia e una faccia.", BG.M],
        ["voce", "Ventisei anni fa, qui dentro, qualcuno ha lasciato un conto aperto. Nessuno l'ha firmato, nessuno l'ha chiuso. Oggi tocca a te scendere a vedere quanto manca.", BG.M],
      ],
    };
  });

  // ================================================================== CAPITOLO 4 · IL REGISTRO
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, hero, esc } = X;
    const N = 4, S = () => X.stepOf(N), has = (k) => F.is(k);
    const BG = { P: "vl_paese", C: "vl_campo", M: "vl_miniera", U: "vl_municipio", A: "vl_archivio", Q: "vl_quattro" };
    const sw = (lines, bg) => lines.map((l) => (l.length > 2 ? l : [l[0], l[1], bg]));
    const chip = (a) => a[Math.floor(Math.random() * a.length)];
    const tono = () => F.get("tono", "ironico");
    const tl = (o) => ["hero", o[tono()] || o.ironico || o.sicuro];
    const zoneNow = () => X.api.trZone();
    const inM = () => zoneNow() === "vl_municipio" || zoneNow() === "vl_archivio";
    const toast = (m) => X.api.trToast(m);
    const guida = () => F.get("guida", "bianca");
    const compId = () => (guida() === "agata" ? "vl_agata" : "vl_bianca");
    const otherId = () => (guida() === "agata" ? "vl_bianca" : "vl_agata");
    const compName = () => (guida() === "agata" ? "Agata" : "Bianca");
    const remoId = () => (has("remo_bet") && has("m1_win") ? "vl_remo_ns" : "vl_remo");
    const ettoreOn = () => F.get("told", "") === "mirtilla";
    const PH = () => F.get("ph", 0);
    const delegate = (id) => { const p = X.talkOf(id, N); if (p) p(); else done(); };
    const bgHere = () => (zoneNow() === "vl_archivio" ? BG.A : zoneNow() === "vl_municipio" ? BG.U : X.bgNow());

    // ---- personaggi nuovi
    const cast = (id, name, o, bio) => X.cast(id, Object.assign({ name }, o), bio);
    cast("vl_vermiglio", "Ing. Lucio Vermiglio", { tag: "gray", hair: "#b9bdc9", style: "slick", skin: "#e8d6c4", glasses: true, bg: ["#1c1f2a", "#cfd3dc"], shirt: "#5b6073" }, "Ingegnere della Società Lumen. Cappotto grigio e guanti bianchi, anche d'estate: «per principio, non mi piace lasciare impronte». Parla piano come i medici e come chi non ha mai alzato la voce con nessuno, perché non ne ha mai avuto bisogno.");
    cast("vl_sigillo", "Avv. Ilaria Sigillo", { tag: "", hair: "#1a1a22", style: "bun", skin: "#d9a57a", glasses: true, bg: ["#2a1f3a", "#c8a2e0"], shirt: "#3a2a5a" }, "L'avvocata della Società Lumen. Fa notare subito che il suo cognome è anche la sua professione, perché i clienti ridono sempre al secondo incontro. Porta un decreto in cartellina e un orologio che va sempre cinque minuti avanti, per gli altri.");
    cast("vl_corvi", "Ornello Corvi", { tag: "gray", hair: "#d8d8e0", style: "messy", skin: "#e0c6a8", glasses: true, bg: ["#2a2a1f", "#c8b878"], shirt: "#4a4a3a" }, "Segretario comunale in pensione da quindici anni, ma ancora al suo sportello perché nessuno ha avuto il coraggio di dirglielo. Ha la voce di un cancello e il timbro più veloce della valle. Ufficio Anagrafe, Stato Civile, Tributi, Oggetti Smarriti e, il giovedì, Pesi e Misure.");
    cast("vl_ottavia", "Ottavia Rovedo", { tag: "gray", hair: "#d0d0d8", style: "bun", skin: "#c98f63", bg: ["#3a1f1f", "#e0a23a"], shirt: "#8a3a2a", cap: "#d9a441" }, "Nonna di Bianca. Per quarant'anni minatrice, caposquadra del turno di notte. Dice di essere sopravvissuta «per distrazione». Ogni martedì si siede nell'atrio del Municipio con il numero 15 in mano, e aspetta.");
    X.lanDef("vl_ottavia", { name: "Ottavia Rovedo", role: "La caposquadra che si dimenticò di contarsi", met: "ottavia_met" });
    X.cos("vl_stemma_registro", { kind: "acc", label: "Stemma del Registro", val: "#d9a441", from: "Concludi il capitolo 4 di Vallombra" });
    X.cos("vl_fascia_registro", { kind: "acc", label: "Fascia dell'Archivista", val: "#8a3a4a", from: "Raccogli tutte le schegge di lumina al Municipio" });
    X.cos("vl_inchiostro", { kind: "hairc", label: "Capelli Inchiostro", val: "#2a4a8a", from: "Raccogli tutte le schegge di lumina nell'Archivio" });

    const mood = (s) => (s >= 5 ? 1 : 0);

    // ---- obiettivi: sempre con la direzione e che cosa cercare
    const goal = (s) => {
      if (s === 0) return "Parla con Cornelio, il sindaco, nell'atrio del Municipio (CENTRO, ai piedi dello scalone).";
      if (s === 1) return "Sala del Consiglio: passaggio a EST dell'atrio. Parla con l'uomo in cappotto grigio, in fondo, vicino al tavolo.";
      if (s === 2) return "Ufficio Anagrafe: passaggio a OVEST dell'atrio. Parla con Corvi, il segretario, in fondo allo sportello.";
      if (s === 3) {
        const ph = PH();
        if (ph >= 1) return "Archivio, in BASSO a destra: la scena col cassetto IV è in corso. Parla con chi è con te (Corvi, la compagna, i due ospiti).";
        const miss = [!has("cl_a") ? "bacheca del pianerottolo (ALTO)" : "", !has("cl_b") ? "vetrina del sindaco (Municipio, ufficio a NORD-OVEST)" : "", !has("cl_c") ? "Corvi" : ""].filter(Boolean);
        if (!has("arch_in")) return "Scendi all'Archivio: scala con la freccia in giù, in ALTO in fondo allo scalone (NORD).";
        return miss.length ? "Archivio: servono 3 indizi per i 4 tasselli. Cerca: " + miss.join(", ") + "." : "Archivio, in BASSO: metti in ordine i 4 tasselli (a sinistra), poi tira il IV cassetto (a destra).";
      }
      if (s === 4) return "Risali nell'atrio: Ottavia Rovedo è seduta sulla panca a EST (lato destro dell'atrio), con il numero 15 in mano.";
      if (s === 5) return "Esci dal Municipio: cancello con la freccia in giù, in BASSO (SUD) dell'atrio. Fuori in piazza ti aspettano.";
      return "Capitolo concluso. Per il Capitolo 5 vai alla Stazione di Vallombra (la cabina per Cima Alta) o usa «Continua»: nel frattempo raccogli le schegge, gioca con gli impiegati e parla con tutti.";
    };

    // ---- stato dei tasselli (pennino, timbro, sigillo, stemma) e soluzione
    const SYM = ["Pennino", "Timbro", "Sigillo", "Stemma"], SOL = [0, 2, 3, 1], DISC_MAX = 7;
    const tw = (i) => F.get("tw" + i, i);
    const orderStr = () => [0, 1, 2, 3].map((i) => SYM[tw(i)]).join(" · ");
    const rightN = () => [0, 1, 2, 3].filter((i) => tw(i) === SOL[i]).length;

    // ---- tessere nuove
    const CASS = ["#c8553d", "#3a6a9c", "#e0a23a", "#e8e0c8", "#5a7a4a", "#7a4a6a"];
    X.PAINT.S = function (sx, sy, tx, ty) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy - 2, 16, 18, "#4a3322"); P(sx, sy - 2, 16, 1, "#6a4c30");
      for (let r = 0; r < 3; r++) {
        const y = sy + r * 5 + 3; P(sx + 1, y + 1, 14, 1, "#2a1c10");
        for (let i = 0; i < 7; i++) { const h = 3 + (hash(tx * 7 + ty * 3 + r * 5 + i) % 3); P(sx + 1 + i * 2, y - h + 1, 2, h, CASS[hash(tx * 3 + ty + r * 11 + i * 5) % 6]); }
      }
      P(sx, sy + 14, 16, 2, "#00000044");
    };
    X.PAINT.T = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const felt = ZX.id === "vl_municipio" && tx >= 28 && ty >= 12;
      P(sx, sy + 3, 16, 10, felt ? "#2f5a3e" : "#7a4f2a"); P(sx, sy + 3, 16, 2, felt ? "#4a7a58" : "#a8764a"); P(sx, sy + 13, 16, 3, "#00000033");
      if (!felt) { P(sx + 1, sy + 13, 2, 3, "#4a3322"); P(sx + 13, sy + 13, 2, 3, "#4a3322"); }
      const k = hash(tx * 5 + ty * 9) % 5;
      if (k === 0) { P(sx + 3, sy + 5, 6, 5, "#f2e8d0"); P(sx + 4, sy + 6, 4, 1, "#6a5a4a"); P(sx + 4, sy + 8, 3, 1, "#6a5a4a"); }
      else if (k === 1) { P(sx + 10, sy + 5, 3, 4, "#1c2236"); P(sx + 11, sy + 3, 1, 3, "#e8e0c8"); }
      else if (k === 2) { P(sx + 4, sy + 5, 8, 3, "#e8e0c8"); P(sx + 5, sy + 6, 5, 1, "#8a7a5a"); }
    };
    X.PAINT.B = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const n = tx - 31, open = n === 3 && F.is("cass_open"), g = GP;
      P(sx, sy - 2, 16, 18, "#56607a"); P(sx, sy - 2, 16, 1, "#8a94b0"); P(sx + 1, sy, 14, 14, "#46506a");
      P(sx + 2, sy + 2, 12, 11, open ? "#10141f" : "#5a6684"); P(sx + 2, sy + 2, 12, 1, "#7a88a8");
      if (open) { P(sx + 3, sy + 5, 10, 7, "#e0d8b8"); P(sx + 3, sy + 5, 10, 1, "#b8ae88"); P(sx + 5, sy + 7, 6, 1, "#8a7a5a"); }
      else { P(sx + 5, sy + 7, 6, 2, "#d8d2b8"); P(sx + 7, sy + 4, 2, 2, "#2a2f44"); }
      g.fillStyle = "#e8e0c8"; g.font = "bold 5px sans-serif"; g.textAlign = "center"; g.fillText(["I", "II", "III", "IV"][Math.max(0, Math.min(3, n))], sx + 8, sy + 14); g.textAlign = "left";
      if (n === 3 && !open) { g.save(); g.globalCompositeOperation = "lighter"; glow(g, sx + 8, sy + 8, 14, "255,210,120", 0.22 + 0.06 * Math.sin(fr / 14)); g.restore(); }
    };
    X.PAINT.O = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const i = tx - 25, st = tw(Math.max(0, Math.min(3, i))), g = GP, ok = F.is("cass_open");
      P(sx + 1, sy + 3, 14, 13, "#2a2f44"); P(sx + 1, sy + 3, 14, 1, "#5a6384"); P(sx + 2, sy + 5, 12, 9, "#161a2a");
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,210,120,${ok ? 0.34 : 0.14 + 0.05 * Math.sin(fr / 12 + i)})`; g.beginPath(); g.arc(sx + 8, sy + 9, 8, 0, 7); g.fill(); g.restore();
      if (st === 0) { g.fillStyle = "#e8ecf6"; g.beginPath(); g.moveTo(sx + 8, sy + 5); g.lineTo(sx + 11, sy + 11); g.lineTo(sx + 8, sy + 13); g.lineTo(sx + 5, sy + 11); g.closePath(); g.fill(); P(sx + 8, sy + 7, 1, 4, "#161a2a"); }
      else if (st === 1) { P(sx + 6, sy + 5, 4, 4, "#c8a26a"); P(sx + 7, sy + 5, 2, 1, "#e8d09a"); P(sx + 4, sy + 9, 8, 3, "#3a2a1c"); P(sx + 4, sy + 9, 8, 1, "#6a4a2c"); }
      else if (st === 2) { g.fillStyle = "#c8422e"; g.beginPath(); g.arc(sx + 8, sy + 9, 4.5, 0, 7); g.fill(); g.fillStyle = "#8a2a1e"; g.beginPath(); g.arc(sx + 8, sy + 9, 2.4, 0, 7); g.fill(); P(sx + 6, sy + 7, 1, 1, "#ff9a86"); }
      else { g.fillStyle = "#d9a441"; g.beginPath(); g.moveTo(sx + 4, sy + 5); g.lineTo(sx + 12, sy + 5); g.lineTo(sx + 12, sy + 10); g.lineTo(sx + 8, sy + 14); g.lineTo(sx + 4, sy + 10); g.closePath(); g.fill(); g.fillStyle = "#1b2f7a"; g.beginPath(); g.moveTo(sx + 5, sy + 6); g.lineTo(sx + 11, sy + 6); g.lineTo(sx + 11, sy + 10); g.lineTo(sx + 8, sy + 13); g.lineTo(sx + 5, sy + 10); g.closePath(); g.fill(); P(sx + 8, sy + 7, 1, 3, "#e8ecf6"); }
      for (let k = 0; k < 4; k++) P(sx + 3 + k * 3, sy + 14, 2, 1, k === st ? "#ffd98a" : "#3a4256");
    };
    X.PAINT.J = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const g = GP, stem = ZX.id === "vl_municipio" && tx === 9 && ty === 4;
      P(sx, sy - 2, 16, 18, "#4a3322"); P(sx + 1, sy - 1, 14, 15, "#10141f"); P(sx + 1, sy - 1, 14, 15, "#9fb8d033");
      if (stem) { g.fillStyle = "#d9a441"; g.beginPath(); g.moveTo(sx + 3, sy + 1); g.lineTo(sx + 13, sy + 1); g.lineTo(sx + 13, sy + 8); g.lineTo(sx + 8, sy + 13); g.lineTo(sx + 3, sy + 8); g.closePath(); g.fill(); g.fillStyle = "#1b2f7a"; g.beginPath(); g.moveTo(sx + 4, sy + 2); g.lineTo(sx + 12, sy + 2); g.lineTo(sx + 12, sy + 8); g.lineTo(sx + 8, sy + 12); g.lineTo(sx + 4, sy + 8); g.closePath(); g.fill(); g.fillStyle = "#e8ecf6"; g.beginPath(); g.moveTo(sx + 5, sy + 8); g.lineTo(sx + 8, sy + 4); g.lineTo(sx + 11, sy + 8); g.fill(); }
      else { P(sx + 6, sy + 9, 4, 4, "#d9a441"); P(sx + 5, sy + 4, 6, 5, "#e8c35a"); P(sx + 4, sy + 5, 1, 3, "#e8c35a"); P(sx + 11, sy + 5, 1, 3, "#e8c35a"); P(sx + 6, sy + 5, 1, 2, "#fff1b8"); }
      P(sx + 2, sy - 1, 1, 15, "#ffffff22");
    };
    X.PAINT.L = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); P(sx, sy, 16, 16, "#120e0a");
      for (let i = 0; i < 4; i++) { P(sx + i, sy + i * 4, 16 - i * 2, 3, i % 2 ? "#3a2a1c" : "#4a3626"); P(sx + i, sy + i * 4, 16 - i * 2, 1, "#6a4c30"); }
      P(sx, sy, 2, 16, "#5a3a22"); P(sx + 14, sy, 2, 16, "#5a3a22"); g2(GP, "d", sx, sy);
    };

    function vignette(g) { const gr = g.createRadialGradient(160, 100, 40, 160, 100, 190); gr.addColorStop(0, "rgba(2,6,16,0)"); gr.addColorStop(1, "rgba(2,6,16,.58)"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200); }
    function motes(g, d, n, a) { for (let i = 0; i < n; i++) { const x = ((i * 53 + d.fr * 0.15) % 340) - 10, y = ((i * 71 + Math.sin(d.fr / 60 + i) * 8) % 220) - 10; R(g, x, y, 1, 1, `rgba(${a || "160,255,235"},.5)`); } }
    function extraLights(g, cx, cy) {
      g.save(); g.globalCompositeOperation = "lighter"; const t0x = Math.floor(cx / TS), t0y = Math.floor(cy / TS), fr = frNow();
      for (let ty = t0y; ty <= t0y + 13; ty++) for (let tx = t0x; tx <= t0x + 21; tx++) {
        const ch = at(tx, ty), x = tx * TS - cx + 8, y = ty * TS - cy + 8;
        if (ch === "l") glow(g, x, y - 4, 30, ZX.id === "vl_municipio" ? "255,205,130" : "255,200,120", ZX.id === "vl_municipio" ? 0.26 : 0.34);
        else if (ch === "O") glow(g, x, y, 16, "255,210,120", 0.2);
        else if (ch === "J") glow(g, x, y, 14, "255,230,170", 0.16);
        else if (ch === "L") glow(g, x, y, 16, "255,190,110", 0.14);
      }
      g.restore();
    }

    const zones = {
      vl_municipio: {
        name: "Vallombra · Il Municipio", short: "Il Municipio", sub: "Sportelli, verbali e un sindaco che non sa sussurrare", w: 36, h: 26, start: [17, 20], theme: "torino", bg: "vl_municipio",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_fascia_registro", items: [[3, 19], [33, 8], [7, 5], [23, 17]],
        act: { n: "Leggi", J: "Guarda la vetrina", T: "Guarda la scrivania", S: "Guarda gli scaffali", b: "Guarda la panca", l: "Guarda la lampada", x: "Guarda le casse", L: "Scendi all'Archivio", d: "Esci in piazza" },
        areas: [[12, 11, 23, 21, "L'atrio"], [15, 4, 20, 10, "Lo scalone"], [6, 4, 13, 9, "L'ufficio del sindaco"], [2, 11, 10, 20, "L'Ufficio Anagrafe"], [25, 7, 34, 21, "La Sala del Consiglio"]],
        hints: (s) => ({
          "L'atrio": s >= 5 ? "L'uscita è in BASSO (SUD). Sulla panca a EST, Ottavia." : "Ovest: Anagrafe. Est: Sala del Consiglio. Nord: scalone e scala dell'Archivio. Un albo pretorio e un eliminacode.",
          "Lo scalone": s >= 3 ? "In fondo, in ALTO, la scala con la freccia in giù porta all'Archivio." : "Una passatoia bordeaux e, in fondo, una scala con la freccia in giù: l'Archivio, chiuso a chiave.",
          "L'ufficio del sindaco": "Scaffali di discorsi numerati e una vetrina con lo stemma del Comune: la didascalia può servire.",
          "L'Ufficio Anagrafe": "Uno sportello lungo, scaffali di moduli e Corvi in fondo, a destra. Orario: quando c'è.",
          "La Sala del Consiglio": "Un lungo tavolo col panno verde, quattordici sedie e lo stemma alla parete. Qui si decide. Quasi.",
          "Il Municipio": "Il Municipio di Vallombra.",
        }),
        intro: [["voce", "Il Municipio di Vallombra ha un orologio sul frontone fermo alle undici e dieci, un cartello «ORARIO DI SPORTELLO: QUANDO C'È» e un odore di cera, di carta e di decisioni rimandate."], ["voce", "L'atrio è una sala col soffitto alto e le panche di legno. A ovest l'Anagrafe, a est la Sala del Consiglio, in fondo allo scalone una scala che scende: l'Archivio."]],
        npcs: (s) => {
          const ph = PH(), arch = s === 3 && ph >= 3, o = [{ id: "vl_ottavia", at: [21, 14] }, { id: "vl_corvi", at: [9, 15] }];
          if (s === 3 && ph < 3) o.push({ id: "vl_cornelio", at: [28, 10] }); else if (!arch) o.push({ id: "vl_cornelio", at: [17, 17] });
          if (s <= 3 && !arch) o.push({ id: "vl_vermiglio", at: [30, 10] }, { id: "vl_sigillo", at: [32, 10] });
          if (s <= 2) o.push({ id: compId(), at: [15, 18] });
          if (s <= 3 && !arch && guida() === "bianca") o.push({ id: "vl_agata", at: [19, 12] });
          if (s <= 3 && !arch && guida() === "agata") o.push({ id: "vl_bianca", at: [20, 19] });
          if (s >= 4) o.push({ id: "vl_bianca", at: [19, 15] }, { id: "vl_agata", at: [14, 19] });
          if (s >= 3 && s <= 5) o.push({ id: "vl_noemi", at: [13, 17] });
          if (ettoreOn() && s <= 5) o.push({ id: "vl_ettore", at: [13, 14] }, { id: "vl_viola", at: [14, 14] });
          if (F.get("fosco", "su") !== "giu") o.push({ id: "vl_fosco", at: [21, 19] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 25, "W");
          lay(12, 11, 23, 21, ","); lay(15, 12, 20, 20, "c");
          lay(15, 4, 20, 10, ","); lay(17, 5, 18, 10, "c");
          lay(6, 4, 13, 9, "="); lay(14, 7, 14, 8, "=");
          lay(2, 11, 10, 20, "="); lay(11, 15, 11, 16, "=");
          lay(25, 7, 34, 21, "="); lay(27, 9, 32, 19, "c"); lay(24, 14, 24, 15, "=");
          put(17, 4, "L"); put(18, 4, "L"); put(17, 22, "d"); put(18, 22, "d");
          // atrio
          [[22, 13], [22, 14], [22, 15]].forEach(([x, y]) => put(x, y, "b"));
          put(13, 12, "n"); put(13, 15, "n"); put(13, 11, "J"); put(22, 11, "J");
          [[13, 20], [22, 20], [15, 11], [20, 11]].forEach(([x, y]) => put(x, y, "l"));
          // ufficio del sindaco
          lay(6, 4, 7, 4, "S"); put(9, 4, "J"); lay(8, 6, 10, 6, "T"); put(12, 8, "x"); put(12, 9, "x"); put(13, 9, "x"); put(6, 9, "l");
          // anagrafe
          lay(3, 14, 8, 14, "T"); lay(3, 12, 9, 12, "S"); put(2, 17, "x"); put(2, 18, "x"); put(4, 18, "b"); put(5, 18, "b"); put(2, 13, "l"); put(10, 19, "l");
          // sala del consiglio
          lay(28, 12, 31, 16, "T"); [[26, 9], [26, 10], [26, 19], [34, 19]].forEach(([x, y]) => put(x, y, "b")); put(30, 7, "n");
          [[25, 8], [34, 9], [25, 20], [34, 20]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          plaque(g, "MUNICIPIO DI VALLOMBRA", X_(17.5) + 8, Y_(11) - 4);
          plaque(g, "UFFICIO ANAGRAFE · quando c'è", X_(6) + 8, Y_(11) + 2);
          plaque(g, "SALA DEL CONSIGLIO", X_(29.5) + 8, Y_(7) + 2);
          plaque(g, "UFFICIO DEL SINDACO", X_(10) + 8, Y_(4) - 2);
          // l'orologio dell'atrio, fermo alle undici e dieci
          const ccx = X_(17.5) + 8, ccy = Y_(11) + 9; if (onScr(ccx, ccy)) { g.fillStyle = "#efe6cf"; g.beginPath(); g.arc(ccx, ccy, 6, 0, 7); g.fill(); g.strokeStyle = "#2a2f44"; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(ccx, ccy); g.lineTo(ccx + Math.sin(0.35) * 5, ccy - Math.cos(0.35) * 5); g.moveTo(ccx, ccy); g.lineTo(ccx + Math.sin(5.5) * 3, ccy - Math.cos(5.5) * 3); g.stroke(); }
          // il display dell'eliminacode: sempre 14
          const ex = X_(13) + 8, ey = Y_(15) + 4; if (onScr(ex, ey)) { R(g, ex - 7, ey - 5, 14, 8, "#0a0f1c"); g.fillStyle = "#ff7a4a"; g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillText("14", ex, ey + 2); g.textAlign = "left"; }
          motes(g, d, 6, "255,230,170");
        },
        top(cx, cy, d) { const g = GP; moodTint(g); tileLights(g, cx, cy); extraLights(g, cx, cy); },
      },

      vl_archivio: {
        name: "Vallombra · L'Archivio", short: "L'Archivio", sub: "Faldoni, polvere e una crepa che brilla", w: 38, h: 26, start: [17, 3], theme: "puntanera", bg: "vl_archivio", moodMin: 1,
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_inchiostro", items: [[8, 14], [34, 16], [27, 22], [20, 3]],
        act: { n: "Leggi la bacheca", S: "Guarda gli scaffali", T: "Guarda il tavolo", B: "Guarda il cassetto", O: "Gira il tassello", C: "Guarda la lumina", E: "Ascolta la pietra", x: "Guarda le casse", l: "Guarda la lampada", "^": "Risali all'atrio" },
        areas: [[14, 2, 21, 5, "Il pianerottolo"], [3, 6, 36, 18, "La sala degli scaffali"], [23, 19, 36, 24, "La Sala del Registro"]],
        hints: (s) => {
          const d = F.get("disc", 0), ph = PH();
          return {
            "Il pianerottolo": "La scala torna all'atrio (ALTO). Sul muro la bacheca con le regole dell'archivista: leggila. Il sindaco, sopra, parla ancora.",
            "La sala degli scaffali": ph >= 3 ? "Gli ospiti sono scesi: parla con loro." : `Scaffali di faldoni; al CENTRO il tavolo di consultazione. Attraverso il tubo della stufa arriva la voce di Cornelio (minuto ${Math.min(d + 1, DISC_MAX)} di ${DISC_MAX}).`,
            "La Sala del Registro": has("cass_open") ? "Il IV cassetto è aperto. Parla con chi è con te." : "I 4 tasselli a sinistra (toccali per cambiare simbolo), l'armadio a destra: il IV cassetto è l'ultimo.",
            "L'Archivio": "L'Archivio comunale, sotto il Municipio.",
          };
        },
        intro: [
          ["voce", "La scala scende per ventitré gradini, ciascuno con un'opinione diversa sull'umidità. In fondo, un pianerottolo, una lampada appesa a un gancio e un odore di cantina, di carta vecchia e di qualcosa di tiepido che non dovrebbe esserci."],
          ["voce", "L'Archivio è una sala lunga come un fienile, con scaffali fino al soffitto e faldoni etichettati a mano: «TRIBUTI 1962», «CANI (CENSIMENTO)», «LAMENTELE (VARIE)», «LAMENTELE (VARIE II)». Nel muro, a est, una crepa fa trasudare una luce turchese: la lumina è arrivata fin qui, passando sotto le case."],
          ["voce", "Dal soffitto, attraverso il tubo della stufa, scende ovattata la voce di Cornelio: «…e dunque, riassumendo il mio riassunto…»"],
        ],
        npcs: (s) => {
          const ph = PH(), o = [];
          if (s >= 3 && ph < 7) {
            const c = compId();
            if (ph === 0) o.push({ id: c, at: [19, 4] });
            else o.push({ id: c, at: [27, 22] });
            if (ph >= 2 && ph < 7) o.push({ id: "vl_corvi", at: [30, 22] });
            if (ph >= 3 && guida() === "bianca") o.push({ id: "vl_agata", at: [25, 22] });
            if (ph >= 3) o.push({ id: "vl_vermiglio", at: [26, 18] }, { id: "vl_sigillo", at: [31, 18] }, { id: "vl_cornelio", at: [33, 18] });
          }
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 37, 25, "a");
          lay(14, 2, 21, 5, "i"); put(17, 1, "^"); put(18, 1, "^");
          lay(3, 6, 36, 18, "i");
          lay(29, 19, 30, 19, "i"); lay(24, 20, 35, 24, "i");
          lay(3, 6, 13, 6, "S"); lay(22, 6, 36, 6, "S");
          [6, 10, 24, 28, 32].forEach((x) => { lay(x, 8, x, 12, "S"); lay(x, 15, x, 17, "S"); });
          lay(14, 13, 18, 14, "T");
          lay(25, 24, 28, 24, "O"); lay(31, 24, 34, 24, "B");
          put(15, 5, "n");
          [[14, 3], [21, 3], [3, 10], [36, 10], [3, 17], [36, 17], [24, 21], [35, 21]].forEach(([x, y]) => put(x, y, "l"));
          [[36, 13], [3, 13], [24, 23], [35, 23]].forEach(([x, y]) => put(x, y, "C"));
          [[12, 17], [12, 16], [20, 17]].forEach(([x, y]) => put(x, y, "x"));
          [[35, 8], [4, 12]].forEach(([x, y]) => put(x, y, "E"));
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y;
          plaque(g, "ARCHIVIO COMUNALE", X_(17.5) + 8, Y_(2) + 2);
          plaque(g, "REGISTRO · I-IV", X_(31) + 32, Y_(23) + 2);
          plaque(g, "TASSELLI", X_(25) + 32, Y_(23) + 2);
          motes(g, d, 18);
        },
        top(cx, cy, d) { const g = GP; moodTint(g); tileLights(g, cx, cy); extraLights(g, cx, cy); vignette(g); },
      },
    };

    // ---- ritocchi alle zone dei capitoli precedenti (attivi quando il capitolo 4 è sbloccato)
    X.patch("vl_paese", N, {
      act: { w: "Entra nel Municipio" },
      hints: () => ({ "Vallombra Alta": "Il Municipio ha la porta blu sul lato destro della piazza, in basso (SUD-EST), sotto il tetto con la neve." }),
      build(L) { L.put(32, 18, "w"); },
      decor(cx, cy, d) { plaque(GP, "MUNICIPIO", d.X(32) + 8, d.Y(16) + 6); },
      npcs: (list, s) => list.filter((n) => !(n.id === "vl_noemi" && s >= 3 && s <= 5)),
    });

    // ================= scene
    const cornelioInfo = () => F.get("cornelio_t", "silenzio");

    // ---- atrio: Cornelio e l'inizio
    function cornelio() {
      if (!inM()) return delegate("vl_cornelio");
      const z = zoneNow(), s = S();
      if (z === "vl_archivio") return arcTalk("vl_cornelio");
      if (s === 0) return cornelioStart();
      if (s === 1) return say(sw([["vl_cornelio", "Alla Sala del Consiglio, a est. Guarda l'ingegnere e non nominare il cassetto: l'educazione, con certa gente, è un'arma. Io intanto limo il discorso. Sono a tre pagine e mezza, ho tagliato il paragrafo sulle marmotte."]], BG.U), done);
      if (s === 2) return say(sw([["vl_cornelio", "Corvi è a ovest, all'Anagrafe, dietro lo sportello. Non chiamarlo «signor Corvi», non chiamarlo «segretario»: chiamalo «dottore». Si offende, ma si ammorbidisce."]], BG.U), done);
      if (s === 3) return say(sw([["vl_cornelio", chip(["(senza fermarsi, con la mano che fa un cerchio) …e quindi, passando al terzo punto del mio secondo punto, che è in realtà il quarto…", "(a voce bassa, tra una frase e l'altra) Quanti minuti? Dimmi che ne ho ancora. Ho già detto tutto quel che so della storia del larice.", "(solenne, voltandosi verso la Sala) …e per concludere il preambolo, che si distingue dalla premessa per un'unghia…"])]], BG.U), done);
      const o = [{ label: "Come stai, sindaco?", fn: () => say(sw([["vl_cornelio", s >= 5 ? chip(["Ho parlato dodici minuti, ieri. Quello che non ho detto, stavolta, l'hanno detto i fogli. Mi sento come un cappello che ha finalmente trovato la testa.", "Non sono più il sindaco dei discorsi lunghi. Sono il sindaco di una cosa sola: il cassetto. Ci si abitua."]) : chip(["Dopo un discorso di quel genere ho il fiato di un soffietto bucato. Ma la voce, per una volta, era solo mia.", "Ho incrociato lo sguardo di Corvi, in archivio. Siamo due vecchi ladri di silenzio che si guardano. Non è un legame; è un'assicurazione."])]], BG.U), done) }];
      ask("vl_cornelio", s >= 5 ? "«Siamo ancora qui. È già una vittoria da bar.»" : "«Dimmi, dimmi. Ho la voce sciolta e la coscienza ancora in lavorazione.»", o, BG.U);
    }
    function cornelioStart() {
      const t = cornelioInfo(), fun = F.get("funivia", "aperta");
      const dorm = t === "verita" ? "Dopo la piazza ho dormito tre ore. Per un sindaco è un record: di solito dormo in consiglio." : t === "comp" ? "Ho dormito con il guanto sul comodino. Il sogno aveva un finale, per una volta, ed era noiosissimo: nessuno mi chiamava vigliacco." : "Non ho dormito. Ho preparato un discorso di quattro minuti e mezzo, il più breve della mia carriera. Mi sento svenire.";
      say(sw([
        ["voce", "L'atrio del Municipio profuma di cera e di decisioni rimandate. Cornelio ti aspetta ai piedi dello scalone, con la fascia tricolore messa di sbieco e un fascio di fogli sotto il braccio. Ha l'aria di chi ha provato un discorso, l'ha buttato e ne ha trovato uno più corto."],
        ["vl_cornelio", dorm],
        ["vl_cornelio", "Sono arrivati stamattina, con la prima corsa. Due. L'uomo coi guanti bianchi è l'ingegner Lucio Vermiglio, della Società Lumen: la stessa che ventisei anni fa chiuse la miniera «per esaurimento del filone». Con lui un'avvocata, la dottoressa Ilaria Sigillo, e un decreto: «verifica conservativa dell'archivio comunale», efficace da mezzogiorno. Dopo mezzogiorno, quel che sta nell'archivio è «sotto sigillo»: non si tocca, non si legge, non si porta via."],
        ["vl_cornelio", fun === "chiusa" ? "Teodora giura che la funivia era chiusa con tre lucchetti. La cabina li ha ignorati con una certa eleganza." : "Teodora ha tenuto la funivia aperta, come avevi voluto. Nel registro ha segnato «ARRIVATO» a matita, in segno di dubbio."],
        tl({ sicuro: "Allora non c'è tempo da perdere. Cominciamo.", attento: "Guanti bianchi, mezzogiorno, un decreto. Chi arriva con tanto anticipo vuole anticipare qualcuno.", ironico: "Un decreto con orario: la burocrazia ha finalmente trovato qualcosa da rispettare." }),
        ["vl_cornelio", "Il quarto cassetto del Registro ha due serrature. Questa (la chiave col nastro rosso, quella che hai) apre la porta dell'Archivio, in fondo allo scalone. Il cassetto si apre con una combinazione di quattro tasselli, e la combinazione la sapeva uno solo: il segretario comunale, Corvi. Corvi è in pensione da quindici anni, ma è ancora allo sportello, perché nessuno ha avuto il cuore di dirglielo."],
        ["vl_cornelio", "Prima di tutto, però, vai a guardare l'uomo. La Sala del Consiglio è a est. Non nominare il cassetto: guarda, ascolta, sii educato. Io intanto preparo l'unica arma che ho: un discorso. Sette minuti, se mi lasciano. Dopo, se serve, ne invento altri."],
      ], BG.U), () => { setStep(N, 1); note("Cap. 4: alla Società Lumen serve l'archivio prima di mezzogiorno. Cornelio mi manda a guardare l'ingegnere, nella Sala del Consiglio (EST)."); done(); });
    }

    // ---- la Sala del Consiglio: Vermiglio e Sigillo
    function vermiglio() {
      if (!inM()) return done();
      const z = zoneNow(), s = S();
      if (z === "vl_archivio") return arcTalk("vl_vermiglio");
      if (s === 0) return say(sw([["vl_vermiglio", "Il sindaco è nell'atrio, mi dicono. Parli prima con lui, mi raccomando: sono un uomo che rispetta le gerarchie. Dopo venga pure. Mi trova qui. Il Municipio, a quest'ora, è l'unico posto in cui si sta in piedi con comodo."]], BG.U), done);
      if (s === 1) return vermiglioPrima();
      return say(sw([["vl_vermiglio", chip(["Il tempo, {n}, è l'unica cosa che un archivio possieda in abbondanza. Lo usi bene: a mezzogiorno si chiude.", "Ho sentito che il sindaco ha preso la parola. Un oratore di razza: ne ho conosciuti pochi capaci di parlare tanto senza lasciare traccia.", "Prego, si accomodi. Le sedie del Consiglio sono comode, e l'ho sempre trovato indicativo."])]], BG.U), done);
    }
    function vermiglioPrima() {
      const fun = F.get("funivia", "aperta"), arb = F.get("arbitro", "prag");
      say(sw([
        ["voce", "La Sala del Consiglio ha un lungo tavolo col panno verde, quattordici sedie, lo stemma del Comune alla parete e un'aria di verbali che si ripetono. In fondo, in piedi accanto alla finestra, un uomo in cappotto grigio guarda il Latte come si guarda un bilancio. Ha i guanti bianchi, uno dei quali sta sistemando con cura sull'altro."],
        ["vl_vermiglio", fun === "chiusa" ? "Mi dicono che la funivia fosse chiusa. L'ho trovata ugualmente disponibile. A Vallombra le cose sono più accomodanti delle persone." : "Ottima, la vostra funivia. La cabina è salita da sola, a quanto pare: ero l'unico passeggero e l'unico a non sorprendermene."],
        ["vl_sigillo", "Dottoressa Ilaria Sigillo, studio legale Sigillo & Sigillo. Il mio cognome è anche la mia professione. Lo faccio notare subito, perché i clienti ridono sempre al secondo incontro."],
        ["vl_vermiglio", "Lucio Vermiglio, ingegnere. Società Lumen. Lei è il Campione, {n}. Ho sentito il suo nome alla radio, ieri sera, alle diciotto e quarantatré. Strano: i nomi, di solito, li conosco prima che qualcuno li pronunci."],
        ["vl_vermiglio", "Mi chiedevo cosa facesse un campione in una valle che ha dimenticato il calcio. Poi ho letto il suo numero: {num}. Ho pensato: ecco, un numero che non compare in nessuna formazione. È un difetto di compilazione, immagino. Si corregge con una nota a margine."],
        ["voce", "Parla piano, come i medici e come chi non ha mai alzato la voce con nessuno perché non ne ha mai avuto bisogno. Non sorride: sistema l'angolo della bocca, ogni tanto, come si raddrizza un quadro."],
        ["vl_sigillo", "Mezzogiorno, Campione. Il decreto è efficace a mezzogiorno. Dopo quell'ora, l'archivio e il suo contenuto sono sotto sequestro conservativo. Per la «bonifica documentale». Siamo molto fieri del termine."],
        ["vl_vermiglio", "I guanti? Per principio. Non mi piace lasciare impronte."],
      ], BG.U), () => ask("voce", "L'ingegnere ti guarda e aspetta, come chi sa già cosa dirai e vuole sentirlo lo stesso. Cosa rispondi?", [
        { label: "«Vallombra non ha niente da nascondere, ingegnere.»", sub: "Fermo", fn: () => vermP("fermo") },
        { label: "«Lei c'era, ventisei anni fa.»", sub: "Accusa", fn: () => vermP("accuso") },
        { label: "«I guanti: per il pane o per il sarto?»", sub: "Ironia", fn: () => vermP("ironia") },
      ], BG.U));
      void arb;
    }
    function vermP(w) {
      F.set("verm", w);
      const a = w === "fermo" ? [["vl_vermiglio", "Nessuno ha niente da nascondere. È solo che alcuni lo nascondono meglio, e altri lo nascondono in un cassetto. Il tempo, poi, fa il resto: lo trasforma in cassetto per tutti."]]
        : w === "accuso" ? [["voce", "Per un istante, appena, l'angolo della bocca dell'ingegnere non si raddrizza."], ["vl_vermiglio", "Ero giovane e molto zelante. Ricordo la partita: un disastro sportivo. La squadra se ne andò dal campo prima del fischio. Non è una colpa: è un fatto, e i fatti, a differenza delle opinioni, hanno il pregio di non invecchiare."]]
          : [["vl_vermiglio", "Per il pane. Lo mangio tre volte l'anno, in occasioni solenni. Il resto del tempo mi nutro di contratti."], ["vl_sigillo", "Il pane è un contratto, in fondo: farina contro denaro. Lo dico per il verbale."]];
      say(sw([...a,
        ["vl_vermiglio", "A mezzogiorno il Comune ci consegnerà l'archivio. Se ha qualcosa da cercare, {n}, ha tempo fino ad allora. La gentilezza, a Vallombra, si misura all'orario: mi dicono che sia l'unica moneta che non si svaluta."],
        ["voce", "Esci dalla Sala con la sensazione di aver parlato con una persona che ha appena smesso di sorridere per rispetto di te. Fuori, Cornelio ti fa un cenno: l'Anagrafe, a ovest."],
      ], BG.U), () => {
        setStep(N, 2); note("L'ing. Lucio Vermiglio (guanti bianchi) e l'avv. Sigillo: sequestro conservativo dell'archivio a mezzogiorno. Mi serve Corvi, all'Anagrafe (OVEST), per la combinazione.");
        done();
      });
    }
    function sigillo() {
      if (zoneNow() === "vl_archivio") return arcTalk("vl_sigillo");
      say(sw([["vl_sigillo", chip(["Il decreto non ammette repliche prima di mezzogiorno. Dopo mezzogiorno non ammette nemmeno la parola «replica».", "Ho cinque minuti di anticipo sull'orologio e dodici di vantaggio sulla vostra pazienza. Non è una minaccia: è un'agenda.", "Non ho nulla contro i campioni. Ho molto contro i cassetti che si aprono da soli."])]], BG.U), done);
    }

    // ---- l'Anagrafe: Corvi
    function corvi() {
      if (!inM()) return delegate("vl_corvi");
      const z = zoneNow(), s = S();
      if (z === "vl_archivio") return arcTalk("vl_corvi");
      if (s <= 1) return say(sw([["vl_corvi", "Prossimo! No, aspetti. Non è il suo turno. Non è il turno di nessuno. Torni quando ha parlato con il sindaco: e non mi faccia quella faccia, ho le palpebre allenate."]], BG.U), done);
      if (s === 2) return corviScena();
      const o = [
        { label: "Ripetimi la regola", sub: "Il sigillo e il timbro", fn: () => say(sw([["vl_corvi", "Il sigillo non va mai accanto al timbro: la ceralacca si macchia. Una regola semplice, scritta nel 1981. Nessuno l'ha mai letta; tutti l'hanno rispettata per sbaglio."]], BG.U), done) },
        { label: "Il Modulo 27-bis?", fn: () => say(sw([["vl_corvi", chip(["Il 27-bis esiste, ora. Ne ho stampate tre copie e le ho archiviate sotto «Varie, ma importanti».", "Il 27-bis l'ho inventato apposta. Verrà sicuramente ricordato come il più breve e il più inutile degli atti della mia carriera."])]], BG.U), done) },
      ];
      if (s >= 4) o.push({ label: "Sfida: Anagrafe contro Tributi", sub: "Un tempo, nel cortile del Municipio", fn: matchImpiegati });
      ask("vl_corvi", s >= 4 ? "«Il cassetto è aperto, il sindaco ha parlato. Ho un po' di tempo libero, per la prima volta dal 1998.»" : "«Siediti sulla sedia bassa: serve a farti sentire più piccolo del regolamento.»", o, BG.U);
    }
    function corviScena() {
      say(sw([
        ["voce", "Lo sportello dell'Ufficio Anagrafe è lungo come un banco di macelleria. Dietro, un uomo molto magro con un timbro in ogni mano e una cesoia a ghigliottina per i moduli. Sul vetro un cartello: «ORARIO: QUANDO C'È. CHIUSO PER LUTTO TUTTI I GIOVEDÌ». Il campanello è una campana da mucca. Non la suoni: lo guardi, e lui timbra qualcosa a caso per farti capire che c'è."],
        ["vl_corvi", "Prossimo! (non alza gli occhi) Modulo 27-bis in triplice copia, marca da bollo, fotografia a mezzo busto e una ragione di vita."],
        tl({ sicuro: "Non ho il 27-bis. Ho una chiave.", attento: "Il 27-bis non risulta in nessun elenco dei moduli comunali.", ironico: "La ragione di vita ce l'ho. La marca da bollo me la presta qualcuno?" }),
        ["vl_corvi", "Il 27-bis non esiste. L'ho inventato adesso, e infatti non ne ho una copia. Ornello Corvi, segretario comunale dal 1981. In pensione dal 2009, ma nessuno ha avuto il coraggio di dirmelo: ci ha pensato l'orario, e l'orario, quassù, non si sa più chi lo faccia."],
        ["voce", "Gli mostri la chiave di ferro col nastro rosso. Il timbro che stava per calare si ferma a mezz'aria, come un gabbiano che ha sentito un rumore."],
        ["vl_corvi", "…La chiave del sindaco. Quella del cassetto IV. (posa i timbri, uno per uno, come si posano le armi) L'ultima volta che l'ho vista in giro ero più giovane di tutti. Adesso sono più vecchio di tutti. In mezzo c'è stato un quarto di secolo di niente."],
        ["vl_corvi", "Per aprire un cassetto ci vuole «legittimo interesse», e l'interesse si prova con una prova. Che prova ha, giovane?"],
      ], BG.U), () => {
        const o = [];
        if (has("fischietto")) o.push({ label: "Il fischietto dei minatori", sub: "Me l'ha dato Cornelio", cls: "hot", fn: () => corviProva("fischietto") });
        o.push({ label: "La parola dell'arbitro", sub: "«Quarto cassetto, prima che arrivino»", cls: "hot", fn: () => corviProva("arbitro") });
        o.push({ label: "Il mio nome sulla fotografia", sub: "In inchiostro di lumina, anno 1998", cls: "hot", fn: () => corviProva("foto") });
        if (has("maglia_vista")) o.push({ label: "La maglia bianca col mio numero", sub: "«Per chi arriva»", cls: "hot", fn: () => corviProva("maglia") });
        ask("vl_corvi", "«Allora? Il regolamento è chiaro: una prova.»", o.slice(0, 4), BG.U);
      });
    }
    function corviProva(k) {
      F.set("corvi_prova", k);
      const a = {
        fischietto: ["vl_corvi", "(lo prende con due dita, come si prende un uccello) Il fischietto del turno di notte. L'ho sentito suonare una volta sola, e quella volta non sono riuscito a uscire dall'ufficio per ore. Va bene: legittimo. Più che legittimo."],
        arbitro: ["vl_corvi", "Gaudenzio. (la voce gli si incrina e diventa il gracchio più umano che tu abbia mai sentito) Lui l'ha detto? Allora anche lui ha ancora una voce, da qualche parte. Io non l'ho più sentita da quando venne a consegnarmi il referto, tremando come un fischietto nel vento."],
        foto: ["vl_corvi", "Il suo nome, in lumina. (lunga pausa) Quella fotografia ha una dedica sul retro, lo sapeva? «A chi arriva.» L'ha scritta Aurelio Brinzi di suo pugno, con la mia penna. Gliel'avevo prestata. Non me l'ha mai restituita."],
        maglia: ["vl_corvi", "Il numero tredici. Aurelio venne da me, quel mattino, a chiedere se si potesse registrare all'anagrafe un giocatore che non c'era ancora. Gli dissi di no, per regolamento. Lui rise e disse: «Allora lo registro io»."],
      }[k];
      say(sw([a,
        ["vl_corvi", "Va bene. Il cassetto IV si apre con quattro tasselli: Pennino, Timbro, Sigillo e Stemma, le quattro cose di una scrivania onesta. L'ordine lo stabilii io, nel 1981, in un regolamento che nessuno ha mai letto. Una regola ve la dico gratis perché la ceralacca mi sta antipatica: il sigillo non va mai accanto al timbro, o si macchia. Le altre due sono scritte: una sul pianerottolo dell'Archivio, e una, dicono, nella vetrina del sindaco. Cornelio la legge ogni mattina senza sapere cosa legge."],
        ["vl_corvi", "Un'altra cosa. Ho scritto una bugia, una volta. La racconterò quando sarà il momento, se avrò il coraggio. E se avrete ancora tempo."],
        ["voce", "La campana da mucca suona da sola, un colpo. Corvi la guarda con rimprovero, come un cane che abbia parlato fuori turno."],
      ], BG.U), () => {
        F.set("cl_c", true); setStep(N, 3);
        note("Regola di Corvi: il sigillo non va mai accanto al timbro. I tasselli sono Pennino, Timbro, Sigillo e Stemma. Altri indizi: bacheca dell'Archivio e vetrina del sindaco.");
        done();
      });
    }

    // ---- oggetti dell'atrio e degli uffici
    function oggettoMuni({ ch, tx, ty }) {
      const T_ = {
        n: () => (tx === 13 && ty === 12 ? "L'albo pretorio. «AVVISO: la via principale resta chiusa al transito fino a data da destinarsi. Il transito, nel frattempo, è invitato a non transitare.» Sotto, a penna: «L'abbiamo chiusa due volte, la via, e due volte si è riaperta da sola»." : tx === 13 && ty === 15 ? "L'eliminacode: un totem rosso con un display che segna «14» da ventisei anni. Il biglietto successivo sporge dalla fessura, il numero 15, ingiallito. Su un lato qualcuno ha scritto a pennarello: «È inutile aspettare. Aspetto lo stesso»." : "L'ordine del giorno della Sala del Consiglio. Punto 1: approvazione del verbale. Punto 2: approvazione del verbale del verbale. Punto 3: varie ed eventuali. Punto 4: il punto 3."),
        J: () => (tx === 9 && ty === 4 ? null : "Una vetrina con tre Coppe dei Tre Versanti: due di latta, una d'argento. Il cartellino dice: «Vinte dai nostri». Sotto, in piccolo, a matita: «(i nostri, quando erano più numerosi)»."),
        T: () => (ty === 14 ? "Lo sportello lungo dell'Anagrafe: timbri in fila come soldatini, un registro dei nati, un registro dei morti e uno dei «né l'uno né l'altro (varie)»." : ty === 6 ? "La scrivania del sindaco: una pila di discorsi con un fermacarte a forma di larice. Il discorso in cima s'intitola «Sulla necessità, o forse sull'inutilità, dell'idea di rotatoria»." : "Il lungo tavolo del Consiglio, col panno verde consumato davanti a ogni sedia. Ogni sedia ha una targhetta; quella del sindaco ha un cuscino."),
        S: () => (ty === 12 ? "Scaffali di moduli: «NASCITA», «MORTE», «ORTI (PERMESSI)», «ORTI (DIVIETI)», «VARIE», «VARIE (RIPOSTE)». Un modulo ha un post-it: «NON COMPILARE. Già compilato da te»." : "Gli scaffali del sindaco: discorsi rilegati in tela, numerati e datati. Il n. 11 si intitola «Perché non parlo mai dei fatti»."),
        b: () => (ty >= 13 && ty <= 15 && tx === 22 ? "Una panca di legno consumata dall'attesa. In mezzo ci si siede in tre, ai lati in due, e al centro, per tradizione, c'è sempre una sedia di meno." : "Una panca. Il legno ha un solco a forma di persona, e il solco ha l'aria di aspettare qualcuno."),
        l: () => "Una lampada a olio col vetro appannato e dentro un seme di lumina che batte piano. Le lampade del Municipio non si spengono mai: dicono sia per risparmiare sul fiammifero.",
        x: () => "Scatoloni di discorsi del sindaco, numerati e datati dal 1998 a oggi. Su uno c'è scritto «DA NON RILEGGERE», su un altro «DA NON RILEGGERE MAI», su un terzo, a matita: «ma rileggere questo».",
      }[ch];
      if (ch === "J" && tx === 9 && ty === 4) return clueB();
      const txt = T_ ? T_() : null; if (!txt) return done();
      say(sw([["voce", txt]], BG.U), done);
    }
    function clueB() {
      const first = !has("cl_b"); F.set("cl_b", true);
      say(sw([
        ["voce", "La vetrina del sindaco custodisce lo stemma del Comune, esposto dal 1931: uno scudo blu con la montagna bianca e una lampada turchese. Sotto, una didascalia ingiallita, scritta a penna d'oca."],
        ["voce", "«LO STEMMA STA NEL MEZZO: NÉ PRIMO, NÉ ULTIMO. IL COMUNE NON APRE IL CAMMINO E NON LO CHIUDE: LO ACCOMPAGNA.»"],
        ...(first ? [["hero", "Né primo né ultimo. Il Comune sta in mezzo, come sempre."]] : []),
      ], BG.U), () => { note("Vetrina del sindaco: lo Stemma sta nel mezzo, né primo né ultimo."); done(); });
    }
    function esci() {
      const s = S();
      go("vl_paese", 32, 19);
      if (s === 5 && !has("fin4")) return finaleHook();
      X.api.trToast("Di nuovo in piazza");
    }

    // ---- verso l'Archivio
    function scala() {
      const s = S();
      if (s < 3) return say(sw([["voce", "La porta dell'Archivio ha una serratura grossa come un pugno e un cartello: «ACCESSO SU AUTORIZZAZIONE DEL SEGRETARIO». Con la chiave del sindaco puoi aprirla, ma Corvi non ti ha ancora autorizzato: parla prima con lui, a ovest."]], BG.U), done);
      if (s >= 4) return go("vl_archivio", 17, 3);
      if (!has("arch_in")) return archStart();
      go("vl_archivio", 17, 3);
    }
    function archStart() {
      F.set("arch_in", true);
      say(sw([
        ["voce", "Giri la chiave col nastro rosso. La serratura scatta con un suono di ossa che si rimettono a posto. Dalla Sala del Consiglio, a est, si sente aprire una porta: è Cornelio, con il fascio di fogli e il fiato pieno."],
        ["vl_cornelio", "(a voce altissima, per coprire il rumore della scala) SIGNORI! SIGNORE! EGREGIA AVVOCATA! INGEGNERE! PERMETTETEMI, PRIMA DI OGNI VERIFICA, UN BREVE INCISO SULLA STORIA DI QUESTO COMUNE, CHE CONTA MILLECENTO METRI DI ALTITUDINE E NOVECENTOQUARANTATRÉ ANNI DI SFORTUNA AMMINISTRATIVA!"],
        ["vl_vermiglio", "(da dietro la porta, con un tono di gentilezza chirurgica) Il sindaco ha un'eloquenza di cui ero stato avvisato."],
        ["vl_sigillo", "Segno l'ora."],
        ["vl_cornelio", "(in lontananza, già nel mezzo del primo paragrafo) …E DUNQUE, nel trecentoquindicesimo anno dalla fondazione del primo lampione…"],
        ["voce", "La porta si chiude. Hai il tempo di un discorso: sette minuti, se Cornelio tiene. Scendi."],
      ], BG.U), () => { note("Cornelio tiene a bada l'ingegnere con un discorso di sette minuti. Ho il tempo di aprire il cassetto IV, giù in Archivio."); go("vl_archivio", 17, 3); });
    }

    // ---- l'Archivio: indizi e oggetti
    function bacheca() {
      const first = !has("cl_a"); F.set("cl_a", true);
      say(sw([
        ["voce", "Una bacheca di sughero sul pianerottolo, con un solo foglio ingiallito, scritto in una grafia a macchina da scrivere e rifinito a penna."],
        ["voce", "«REGOLE DELL'ARCHIVISTA (ed. 1981). 1. Prima si scrive, col pennino. 2. Poi si chiude, col sigillo. 3. Poi si convalida, col timbro. 4. Non si salta mai un passaggio: nemmeno per fretta, nemmeno per amore.» In calce, a mano: «O. C.»."],
        ...(first ? [[compId(), guida() === "bianca" ? "Pennino, sigillo, timbro. Come montare un motore: prima si smonta, poi si ingrassa, poi si dice che è colpa di qualcun altro." : "Un ordine di tre passaggi. Lo annoto: è un vincolo, e un vincolo è l'inizio di ogni soluzione."]] : []),
      ], BG.A), () => { note("Bacheca dell'Archivio: prima il Pennino, poi il Sigillo, poi il Timbro."); done(); });
    }
    function lockHint() {
      const miss = [!has("cl_a") ? "la bacheca sul pianerottolo (ALTO)" : "", !has("cl_b") ? "la vetrina nell'ufficio del sindaco (al piano di sopra, NORD-OVEST)" : "", !has("cl_c") ? "Corvi" : ""].filter(Boolean);
      if (miss.length) return `Ci mancano indizi: ${miss.join(", ")}.`;
      return "Abbiamo tutto: prima il pennino, poi il sigillo, poi il timbro; lo stemma sta in mezzo (né primo né ultimo); il sigillo non tocca il timbro. Prova a metterli in fila da sinistra a destra.";
    }
    function tassello({ tx }) {
      const i = tx - 25; if (i < 0 || i > 3) return done();
      if (has("cass_open")) return say(sw([["voce", "I tasselli sono fermi nell'ordine giusto: Pennino, Sigillo, Stemma, Timbro. Il cassetto, adesso, non fa più storie."]], BG.A), done);
      const press = () => { F.set("tw" + i, (tw(i) + 1) % 4); done(); toast("Tasselli: " + orderStr()); };
      if (!has("tw_seen")) {
        F.set("tw_seen", true);
        return say(sw([
          ["voce", "Quattro tasselli di ottone su quattro pedane, appoggiati a una lastra di marmo: ciascuno mostra un simbolo che cambia a ogni tocco. Pennino, Timbro, Sigillo, Stemma. Quattro posti, quattro simboli, un ordine solo."],
          [compId(), guida() === "bianca" ? "Sono ruote dentate senza dentini. Ci vuole l'ordine giusto: devono incastrarsi da sinistra a destra, uno dopo l'altro, senza ripetizioni. Se sbagli, il cassetto lo sente." : "Una permutazione di quattro elementi: ventiquattro combinazioni. Con gli indizi, una sola. Ma ogni tentativo sbagliato costa: sopra, Cornelio sta bruciando i suoi minuti."],
          ["voce", "Il tentativo si fa al cassetto IV, a destra: se i tasselli non sono giusti ti dice quanti sono al posto giusto. Ma ogni prova sbagliata è un minuto di discorso in meno."],
        ], BG.A), press);
      }
      press();
    }
    function armadio({ tx }) {
      const n = tx - 31; if (n < 0 || n > 3) return done();
      if (n < 3) return say(sw([["voce", ["Il cassetto I: «FESTE PATRONALI 1971-1994». Dentro, quattordici programmi a stampa e una nota: «Il fuoco d'artificio del '84 non è stato un incidente ma una sorpresa».", "Il cassetto II: «OBBLIGAZIONI DEL COMUNE». Dentro, solo ricevute di cioccolata e una cambiale in lire a nome di un certo «Brumasecca, C.».", "Il cassetto III: «LAMENTELE (DEFINITIVE)». È pieno. Nessuno ha mai osato aprire il V."][n]]], BG.A), done);
      if (has("cass_open")) return say(sw([["voce", "Il IV cassetto è aperto e vuoto. Sul fondo, un cerchio più chiaro nella polvere, dove stavano i fascicoli. Li hai in tasca, o li ha chi li ha."]], BG.A), done);
      const k = rightN(), d = F.get("disc", 0);
      if (k === 4) return aperto();
      const nd = F.add("disc", 1);
      const frase = k === 0 ? "Il cassetto non si muove: nessun tassello al posto giusto." : `Il cassetto vibra, poi si ferma: ${k} tassell${k === 1 ? "o" : "i"} su 4 al posto giusto.`;
      void d;
      const dopo = () => { done(); toast(`Minuto ${Math.min(nd + 1, DISC_MAX)} di ${DISC_MAX} del discorso`); };
      if (nd >= DISC_MAX) return say(sw([["voce", frase], ["voce", "Dal soffitto la voce di Cornelio si spezza: «…e con questo… signori… io… (tossisce)». Silenzio. Poi passi sulla scala."]], BG.A), () => { F.set("tardi", true); F.set("ph", 1); F.set("cass_open", true); apertoTardi(); });
      const hint = nd === 2 || nd === 4 ? [[compId(), lockHint()]] : [];
      say(sw([["voce", `${frase} Di sopra, attraverso il tubo della stufa: «…e quindi, riassumendo il mio riassunto del riassunto…» (minuto ${nd} di ${DISC_MAX})`], ...hint], BG.A), dopo);
    }
    function aperto() {
      F.set("cass_open", true); F.set("ph", 1);
      const m = reward("vl_p4", { coins: 8 });
      say(sw([
        ["voce", "L'ultimo tassello scatta nella sua sede. Pennino, Sigillo, Stemma, Timbro: un ordine che pare scritto per una persona onesta con un sistema. Dalla lastra di marmo sale un tintinnio di molle, come un orologio che si ricorda di essere un orologio."],
        ["voce", "Il IV cassetto scivola fuori con un sospiro di legno e di polvere. Dentro, legati da un nastro rosso sbiadito, quattro fascicoli. Sul primo, a stampatello: «PRATICA 98/43 · NON DISPERDERE»."],
        ...(m.length ? [["voce", m.join(" · ") + "."]] : []),
      ], BG.A), docs);
    }
    function apertoTardi() {
      say(sw([
        ["vl_corvi", "(compare dal buio, con una lampada in mano, e posa le dita su quattro tasselli con una velocità da pianista) Pennino, sigillo, stemma, timbro. Come nel regolamento. Il cassetto si apre così."],
        ["voce", "Il IV cassetto scivola fuori. Dentro, legati da un nastro rosso sbiadito, quattro fascicoli. «PRATICA 98/43 · NON DISPERDERE»."],
      ], BG.A), docs);
    }
    function docs() {
      const b = guida() === "bianca", ag = guida() === "agata";
      say(sw([
        ["voce", "Primo fascicolo. «REFERTO DI GARA · Finale della Coppa dei Tre Versanti · Direttore di gara: G. Fischietti.» In calce, a matita, una riga tremante: «al 43' fischio senza fallo, per ordine ricevuto». Sul retro, incollata con la colla di allora, una ricevuta: «Ricevo dalla Società Lumen S.p.A. la somma di lire diciottomilioni per prestazioni di arbitraggio. F.to: ing. L. Vermiglio per la Società. F.to: G. Fischietti, residente a Cima Alta, presso V. Valanga.»"],
        ["voce", "La firma dell'ingegnere è tutta in tondo, di quelle che ti insegnano a scuola; la V ha due ricci, uno dentro l'altro, come un gancio."],
        [compId(), b ? "Valanga. Come il capitano dei Camosci. …Sarà un cognome diffuso, lassù. Ci sono più Valanga a Cima Alta che grilli." : "«Presso V. Valanga.» Cognome comune a Cima Alta: lo annoto. Le coincidenze, in un archivio, costano meno di tutto il resto."],
        ["voce", "Secondo fascicolo. «ORDINE DI SERVIZIO N. 43 · Società Lumen S.p.A. · Alla direzione di cantiere. Oggetto: assestamento livello 3. Si dispone la carica di assestamento per le ore 18:43 di sabato, in concomitanza con la finale (popolazione all'aperto). Il turno di notte è confermato: nessuna comunicazione al personale. Il sinistro dovrà risultare accidentale. Nulla osta: L.V.»"],
        ["voce", "Terzo fascicolo. «VERBALE DELL'ABBANDONO · Al 43° del secondo tempo la squadra degli Stambecchi lasciò il campo senza giustificazione, in preda al panico…» Il resto della pagina è quasi bianco: l'inchiostro del testo è sbiadito fino a un'ombra color tè. Sopravvive soltanto la firma, in nero fitto: «O. Corvi, segretario»; e sotto, in una grafia più piccola e più antica: «sotto dettatura»."],
        ["voce", "Quarto fascicolo. «POLIZZA 98/0043 · Mutua Alterna · Contraente: Società Lumen S.p.A.» Una clausola, la dodicesima, è sottolineata a matita: «Qualora sia accertato il dolo, la Compagnia è tenuta a rimborsare al Comune le spese di bonifica definitiva dell'impianto, mediante riempimento con malta cementizia, dall'imbocco al IV livello.»"],
        ag ? ["vl_agata", "(piano, senza guardarti) Questa polizza… la conosco. Cioè: ne conosco una uguale. (si schiarisce la gola) Va archiviata bene. Ha un valore."] : [compId(), "Una polizza. Cemento «dall'imbocco al IV livello». Non so cosa significhi, ma ho un brutto presentimento. I presentimenti, nel mio mestiere, di solito sono bulloni che si allentano."],
        tl({ sicuro: "Qui c'è tutto. Un ordine, una ricevuta, una bugia sbiadita.", attento: "L'ordine non è firmato per esteso. La ricevuta sì.", ironico: "Un archivio che ha custodito tutto e non ha detto niente per ventisei anni: un modello di professionalità." }),
      ], BG.A), () => {
        note("IV cassetto: referto di Fischietti con ricevuta firmata Vermiglio (presso V. Valanga, Cima Alta); Ordine di servizio n. 43 (turno di notte confermato); verbale dell'abbandono con inchiostro sbiadito, 'sotto dettatura'; polizza con la clausola 12 (bonifica con cemento).");
        F.set("ph", 2); corviConf();
      });
    }
    function corviConf() {
      const tardi = has("tardi");
      say(sw([
        ...(tardi ? [] : [["voce", "Passi leggeri sulla scala. Il rumore non è di scarpe: è di un uomo che ha imparato a scendere piano per non farsi sentire dalla propria coscienza. Corvi compare nel cono di luce della lampada, con una chiave nella tasca del grembiule e le palpebre abbassate."]]),
        ["vl_corvi", "Il terzo fascicolo. Quello bianco. (si avvicina, e per una volta la voce da cancello suona da persona) Il verbale dell'abbandono l'ho scritto io, giovane. Dettato, alle sei di mattina, in questa stanza, da un uomo con i guanti bianchi, che aspettava in piedi col cappotto addosso."],
        ["vl_corvi", "Ero giovane. Avevo un posto e un mutuo. Mi dissero: «Una pagina, signor segretario, una sola, e il Comune avrà un contributo per il campo». Scrissi. Ma sapevo cosa fare dell'inchiostro. L'inchiostro ferrogallico di cantina, mescolato con aceto, dura venticinque anni. Poi sparisce."],
        ["vl_corvi", "Ho scritto la bugia con l'inchiostro che sbiadisce e conservato la verità nei documenti che durano. Ho aspettato che la bugia sparisse da sola. È sparita. Il paese se la ricorda lo stesso. Le bugie, vedi, hanno un inchiostro migliore delle verità: restano in bocca anche quando non sono più sulla carta."],
        ["voce", "Si toglie gli occhiali, li pulisce con il grembiule, li rimette. Sotto, gli occhi sono quelli di un bambino che ha rotto un vetro ventisei anni fa e sta ancora aspettando di essere sgridato."],
      ], BG.A), () => ask("vl_corvi", "«Dimmi tu che cosa sono, adesso. Mi basta una parola.»", [
        { label: "«Un testimone. L'unico con la penna.»", sub: "Fiducia", fn: () => corviPick("testimone") },
        { label: "«Poteva dirlo vent'anni fa.»", sub: "Rimprovero", fn: () => corviPick("rimprovero") },
        { label: "«Venga con noi, adesso. Basta così.»", sub: "Presenza", fn: () => corviPick("presenza") },
      ], BG.A));
    }
    function corviPick(w) {
      F.set("corvi_t", w);
      const a = w === "testimone" ? [["vl_corvi", "Un testimone. (assapora la parola come un liquore) In ventisei anni nessuno mi ha chiamato così. Mi hanno chiamato «Dottore», «Signor Corvi», «Quello dello sportello». Testimone mi manca come un guanto spaiato."]]
        : w === "rimprovero" ? [["vl_corvi", "Sì. Potevo. Lo so, lo so. (chiude gli occhi) Ogni anno mi dicevo «l'anno prossimo». Dopo vent'anni ho smesso di dirmelo per vergogna: l'anno prossimo è diventato una scusa con la barba."]]
          : [["vl_corvi", "Con voi. (si schiarisce la gola due volte) Non so se so camminare dalla parte giusta. Ho sempre camminato dalla parte dello sportello."]];
      say(sw([...a, ["voce", "Dalla scala, in cima, una voce stanca: «…e per tutte queste ragioni, io direi, signori… (si sente un tonfo di sedia)». Poi, nel silenzio, il rumore netto di un tacco sottile."]], BG.A), () => { F.set("ph", 3); note("Corvi ha scritto il verbale falso 'sotto dettatura' con inchiostro che sbiadisce. Ora è un testimone."); arrivo(); });
    }
    function arrivo() {
      const tardi = has("tardi"), ag = guida() === "agata";
      say(sw([
        ["voce", "Passi sulla scala: due paia. Uno è un tacco sottile; l'altro non fa rumore, e per questo lo senti. Dietro, un passo lento e stanco: il sindaco, con la fascia in mano come un fazzoletto."],
        ["vl_cornelio", tardi ? "Sette minuti, ingegnere! Ho parlato sette minuti e mezzo. (ansima) È il record del Comune, e il mio, e il vostro." : "Scusate… non ho… più… argomenti. L'ultimo era il larice. Ho finito con il larice."],
        ["vl_sigillo", tardi ? "Tre minuti al mezzogiorno. E il sequestro, ricordo al sindaco, decorre indipendentemente dal suo fiato." : "Dodici meno cinque. Il sequestro decorre tra cinque minuti, indipendentemente dal suo fiato, sindaco."],
        ["vl_vermiglio", "(si ferma in cima al cono di luce, a un passo dal cassetto aperto) Ah. Il Registro. Quarto cassetto. (e per la prima volta, nella sua voce, una cosa che somiglia a un respiro) Lei è una persona molto efficiente, {n}. Io, alla sua età, ero soltanto molto zelante."],
        ...(ag ? [] : [["voce", "Dietro di loro, con una cartella contro il petto, scende Agata. Non incrocia il tuo sguardo. Si ferma all'ultimo gradino come davanti a un esame che non ha studiato."]]),
        ["vl_vermiglio", "Il cassetto è aperto, vedo, e sono presenti i fascicoli. Dottoressa Sigillo, prego."],
        ["vl_sigillo", "Da questo momento il materiale è sotto sequestro conservativo, ai sensi del decreto. Consegnare."],
        ["vl_vermiglio", "Un momento, avvocata. Il Campione ha l'aria di chi vorrebbe dire qualcosa. Gli conceda pure di parlare: è un'abitudine di questo luogo, dicono, e l'ho sempre trovata affascinante."],
      ], BG.A), () => { F.set("ph", 4); F.set("cl_i", 0); F.set("cl_e", 0); conf(0); });
    }

    // ---- il confronto: tre affermazioni, quattro documenti
    const DOCS = {
      referto: ["Il referto di Fischietti", "Con la ricevuta incollata"],
      ordine: ["L'Ordine di servizio n. 43", "«Il turno di notte è confermato»"],
      verbale: ["Il verbale dell'abbandono", "L'inchiostro sbiadito"],
      polizza: ["La polizza 98/0043", "Con la clausola 12"],
    };
    const CL = [
      { who: "vl_vermiglio", q: "Cominciamo dal principio, {n}. Quella sera il turno di notte era a casa. La miniera era vuota. Una carica di assestamento non fa male a nessuno, se nessuno c'è. Mi mostri un solo documento che dica il contrario.", p: "Che prova metti sul tavolo?", order: ["referto", "ordine", "polizza", "verbale"], ok: "ordine", h: "Cerca il foglio che parla del turno di notte: chi doveva restare, e chi non doveva sapere.",
        good: () => [["voce", "Posi l'Ordine di servizio sul tavolo e lo leggi ad alta voce, sillaba per sillaba, come un notaio col raffreddore. «Il turno di notte è confermato. Nessuna comunicazione al personale. Il sinistro dovrà risultare accidentale.»"], ["vl_sigillo", "(a mezza voce) Ingegnere…"], ["vl_vermiglio", "Un ordine di servizio è una bozza di intenzioni. Le intenzioni, {n}, non hanno mai fatto crollare niente."], ["voce", "Lo dice con calma, ma il guanto che regge il cappotto stringe una piega in più."]],
        bad: { referto: "Un arbitro che si fece pagare per un fischio sbagliato. Interessante, ma non dice chi fosse in galleria: il campo e la miniera sono due luoghi distinti, anche a Vallombra.", polizza: "Una polizza dimostra che qualcuno aveva un contratto. Non chi stesse sotto terra. Non confonda le assicurazioni con le anagrafi.", verbale: "Il verbale dell'abbandono riguarda la squadra, non il turno. Mi sorprende: lei è venuto qui per il turno di notte, o sbaglio?" } },
      { who: "vl_vermiglio", q: "Passiamo alla squadra. C'è un verbale, nello stesso cassetto, scritto dal segretario comunale in persona: gli Stambecchi lasciarono il campo al 43° del secondo tempo, in preda al panico. Un atto pubblico. Vorrà contestare un atto pubblico?", p: "Quale foglio gli opponi?", order: ["verbale", "polizza", "referto", "ordine"], ok: "verbale", h: "Cerca il foglio in cui l'inchiostro è sparito: e la riga, accanto alla firma, che dice come fu scritto.",
        good: () => { const w = F.get("corvi_t", "testimone"); return [["hero", "Quell'atto pubblico è bianco, ingegnere. L'inchiostro è sbiadito. Resta la firma e una riga: «sotto dettatura»."], ["vl_corvi", w === "rimprovero" ? "L'ho scritto io, con l'inchiostro che sparisce. L'ha dettato lei, ingegnere, in questa stanza, alle sei di una mattina di ventisei anni fa. Con i guanti. Dovevo dirlo vent'anni fa; lo dico adesso." : w === "presenza" ? "L'ho scritto io, con l'inchiostro che sparisce. L'ha dettato lei, ingegnere, in questa stanza, alle sei di una mattina di ventisei anni fa. Con i guanti. Io sono qui, e resto qui." : "L'ho scritto io, con l'inchiostro che sparisce. L'ha dettato lei, ingegnere, in questa stanza, alle sei di una mattina di ventisei anni fa. Con i guanti. Lo dico da testimone, adesso."], ["vl_vermiglio", "Un vecchio impiegato che ricorda di aver detto una bugia. Che comodo."], ["vl_corvi", "Comodo? Mi è costato ventisei anni."]]; },
        bad: { referto: "Un fischio storto non è una squadra che ha paura. Non risponde alla mia domanda: ne risponde a un'altra, più interessante, e più dannosa per l'arbitro.", ordine: "Un ordine di servizio della Società non cambia quel che un segretario ha verbalizzato. Cerchi meglio.", polizza: "Una polizza non verbalizza niente sul campo da calcio. A meno che lei non intenda assicurare il pallone." } },
      { who: "vl_vermiglio", q: "E veniamo alla ricevuta: quella firma tutta in tondo. Un arbitro che ha preso soldi è un testimone senza credito, e un pezzo di carta lo scrive chiunque. Mi dimostri che quella V a due ricci è la mia.", p: "Come lo dimostri?", order: ["polizza", "referto", "verbale", "ordine"], ok: "referto", h: "Cerca il foglio con la firma intera: e confrontala con quella in calce al decreto dell'avvocata.",
        good: () => { const arb = F.get("arbitro", "prag"); return [["hero", "Avvocata, mi presta il decreto? Quello a firma dell'ingegnere, per il sequestro."], ["voce", "Sigillo esita, poi lo porge con due dita, come un biglietto del tram. Lo appoggi accanto alla ricevuta. Le due firme si guardano da trenta centimetri e ventisei anni di distanza: la stessa V, lo stesso doppio ricciolo, lo stesso tondo di scuola."], ["vl_corvi", "Il tondo di scuola. Quello l'ho visto sul pagamento del Comune per la bonifica del campo, nel '98. Stesso gancio."], ["vl_sigillo", "(a bassa voce, controllando l'orologio che non c'entra) …Ingegnere."], ["voce", arb === "acc" ? "Ripensi all'arbitro, alla sua Camera del Minuto, alle parole dure che gli hai detto: la ricevuta gli dà ragione e torto insieme. Lui ha preso la busta. Ma è un uomo che l'ha anche conservata." : arb === "comp" ? "Ripensi all'arbitro, alla sua Camera del Minuto, a quello che gli hai detto: «il peso è di chi ha dato l'ordine». Eccolo, il peso, sul tavolo, con una V a due ricci." : "Ripensi all'arbitro, alla sua Camera del Minuto: la prova che gli avevi chiesto è qui, davanti a tutti, con la sua firma accanto a quella di chi pagava."]]; },
        bad: { ordine: "Il mio «Nulla osta» sull'ordine è soltanto una sigla, L.V.: potrebbe essere di chiunque. Luigi Vecchi. Lucia Viola. Non mi pare un argomento.", polizza: "La polizza riguarda un contratto tra due società, non la mia mano. Non lo dico io: lo dice il diritto.", verbale: "Il verbale porta la firma di Corvi, non la mia. Sceglie con cura i suoi testimoni, {n}: ma li sceglie male." } },
    ];
    function conf(i) {
      if (i >= CL.length) return confEnd();
      const c = CL[i];
      say(sw([[c.who, c.q]], BG.A), () => confAsk(i));
    }
    function confAsk(i) {
      const c = CL[i];
      ask("voce", c.p || "Che prova metti sul tavolo?", c.order.map((k) => ({ label: DOCS[k][0], sub: DOCS[k][1], cls: "hot", fn: () => confPick(i, k) })), BG.A);
    }
    function confPick(i, k) {
      const c = CL[i];
      if (k === c.ok) { return say(sw(c.good(), BG.A), () => { F.set("cl_i", i + 1); conf(i + 1); }); }
      const e = F.add("cl_e", 1), here = F.add("cl_w" + i, 1);
      const hint = here >= 2 ? [[compId(), c.h]] : [];
      say(sw([["vl_vermiglio", c.bad[k]], ...hint], BG.A), () => confAsk(i));
    }
    function confEnd() {
      const e = F.get("cl_e", 0), perfect = e === 0, tardi = has("tardi");
      F.set("conf_ok", perfect);
      const m = perfect ? reward("vl_conf", { coins: 10 }) : [];
      note(perfect ? "Ho smontato le tre affermazioni di Vermiglio senza sbagliare un colpo." : `Ho smontato le tre affermazioni di Vermiglio (con ${e} ${e === 1 ? "inciampo" : "inciampi"}).`);
      say(sw([
        ["voce", "Cala un silenzio da interno di cassaforte. Dal tubo della stufa non scende più nessuna voce: il sindaco, in fondo alla scala, si è seduto sull'ultimo gradino con la testa tra le mani, e non ha più niente da riassumere."],
        ...(m.length ? [["voce", m.join(" · ") + "."]] : []),
        ["voce", "Vermiglio si toglie un guanto bianco. Sotto, la mano è quella di un uomo qualsiasi, con un neo vicino al pollice. Si frega il polso, piano, come chi scopre di averne uno."],
        ["vl_vermiglio", perfect ? "Complimenti. Ho perso un'udienza in un sotterraneo, davanti a un campione di calcio e a un segretario in pensione. La racconterò: ma non a tutti." : "Vedo che la mia posizione è meno solida di quanto sperassi, ma più solida di quanto sperate voi."],
        ...(tardi ? [["vl_vermiglio", "Il sindaco ha esaurito gli argomenti al minuto sette. Ne ha inventato un altro al minuto otto. Poi ha ceduto. Anche questo, in fondo, è un modo di resistere."]] : []),
        ["vl_vermiglio", "Ma mi permetta di essere onesto, giacché oggi lo siamo tutti. Quei fogli sono gravi, per me e per la Società. Non sono gravi per tutti allo stesso modo. Dottoressa Sassi: lo spiega lei al nostro amico, o lo faccio io?"],
      ], BG.A), () => { F.set("ph", 5); reveal(); });
    }

    // ---- la rivelazione di Agata e la scelta
    function reveal() {
      F.set("ph", 6);
      const ag = guida() === "agata", comp = has("compass"), told = F.get("told", "segreto");
      say(sw([
        ["voce", ag ? "Agata, accanto a te, smette di respirare per una frazione di secondo. Poi mette la cartella a terra, con una cura che non ha mai avuto per niente." : "Agata, all'ultimo gradino, posa la cartella a terra con una cura che non ha mai avuto per niente."],
        ["vl_agata", "È vero. (a te, in faccia) Non lavoro soltanto per l'Università. Da novembre sono perito incaricato della Mutua Alterna: la compagnia che nel '98 pagò alla Società Lumen il sinistro della miniera. Quando è emerso il sospetto di un dolo, mi hanno mandata qui a cercare. A Vallombra sono da marzo. «Geologa» è vero: ho un master, due cani e una paura dei sismografi. Non è vero che ero qui per caso."],
        ["vl_agata", comp ? "La bussola era vera: l'ago seguiva la luce, non il nord. Non ti ho mentito sull'ago. Ti ho mentito sul portafoglio." : "Non ti ho mentito sulla lumina: quella, la misuro sul serio. Ti ho mentito su chi mi pagava per misurarla."],
        ...(ag ? [["vl_agata", "Eri con me nella miniera. Ho sentito la roccia cantare e ho pensato che avrei dovuto dirtelo. Poi non ho più trovato il momento: o ne avevo troppo."]] : [[compId(), "Agata. …Tu lavori per l'assicurazione? (la voce di Bianca non è arrabbiata: è peggio, è sorpresa) Io ti ho prestato la chiave inglese."]]),
        ...(told === "teodora" ? [["vl_agata", "Teodora mi ha raccontato di Aurelio, una sera, al registro. Io le ho detto che lavoravo sulle rocce. Era vero. Ma non tutto."]] : []),
        ["vl_agata", "La clausola 12. (alza la polizza) Se il dolo viene accertato, la Mutua non solo si rivale sulla Società: deve sostenere i costi di bonifica definitiva. Riempire la miniera di malta cementizia, dall'imbocco al IV livello. Per sempre. Sarebbe la fine di tutto ciò che brilla là sotto. E della Squadra, immagino, comunque si chiami quello che c'è in fondo alla Quattro."],
        ["vl_vermiglio", "Si dice così: «la Mutua risarcisce, il Comune è tranquillo, la miniera sparisce sotto quattromila tonnellate di cemento con la benedizione del sindaco». Io perdo, certo: pago una penale. Ma la penale non è un crollo. Il cemento, invece, sì. Per quello, {n}, sono pronto a pagare. Le consiglio la dottoressa: è l'atto più rapido e più elegante."],
        ["vl_agata", "Io non lo decido. Se me le dai, la Mutua apre la pratica; ho trenta giorni per far cambiare la perizia, e li userò tutti, e non ti prometto che basteranno. Se le tieni tu, nessuno ti obbligherà a niente. Se vuoi che il paese sappia… (guarda Corvi, poi Cornelio) il paese ha sentito troppo poco per troppo tempo."],
        ["vl_sigillo", "Il sequestro decorre tra quattro minuti. Tutto ciò che esce da questo sotterraneo dopo quell'ora è sottrazione di atto pubblico. Siete pregati di decidere con la solennità del caso."],
      ], BG.A), scelta);
    }
    function scelta() {
      ask("voce", "I fascicoli del IV cassetto sono sul tavolo di consultazione. A chi li affidi?", [
        { label: "Ad Agata, per la via legale", sub: "Deposito ufficiale · rischio: la bonifica col cemento", cls: "hot", fn: () => esito("agata") },
        { label: "Li tieni tu", sub: "Nessuno ne sa niente · rischio: la caccia", cls: "hot", fn: () => esito("tenute") },
        { label: "A Noemi, in diretta", sub: "Il paese sa tutto · rischio: la reazione", cls: "hot", fn: () => esito("radio") },
      ], BG.A);
    }
    function esito(w) {
      F.set("prove", w); F.set("prove_agata", w === "agata"); F.set("prove_tenute", w === "tenute"); F.set("prove_radio", w === "radio");
      const c = cornelioInfo(), tardi = has("tardi");
      if (w === "agata") {
        say(sw([
          ["vl_agata", "(prende i fascicoli con due mani, come si prende un vaso antico) Li porto a un notaio, a Milano, con copia conforme. Il deposito sarà ufficiale. Nessuno potrà dire che li ho scritti io."],
          ["vl_vermiglio", "(un applauso con i guanti, uno solo, piano) Brava. Un atto di fiducia vale più di un'idea. Il resto, lo vedremo nelle clausole."],
          ["vl_agata", "(senza guardarlo) Io le clausole le leggo meglio di lei, ingegnere. Ho trenta giorni. Li userò tutti."],
          ["vl_cornelio", c === "verita" ? "La miniera non si cementa finché c'è un sindaco che sa dire «no» in sette minuti. Con una pausa per il larice." : "Se mi chiedono la firma sul cemento, la darò quando avrò finito di leggere. Comincio ora. Al ritmo dei miei discorsi, ho tempo."],
          ["voce", "Sigillo guarda l'orologio: manca un minuto. Mette il sigillo al cassetto vuoto con un gesto veloce, un po' stanco. È la prima volta che si vede, in lei, qualcosa di simile alla fretta."],
        ], BG.A), () => { X.lanAdd("vl_agata"); finisciScelta("Le prove sono ad Agata, che le deposita da un notaio: la Mutua apre la pratica e potrebbe cementare la miniera. Ha trenta giorni per impedirlo."); });
      } else if (w === "tenute") {
        say(sw([
          ["voce", "Pieghi i quattro fascicoli, uno dentro l'altro, e li infili sotto la maglia, contro la pelle. Carta vecchia, tiepida, che sa di cantina. Nessuno ti ferma."],
          ["vl_sigillo", "Il sequestro decorre tra tre minuti. Tutto ciò che esce da qui…"],
          ["vl_cornelio", "(si alza, con tutta la fascia tricolore, la voce che sta tornando) Il Municipio è mio fino a mezzogiorno, avvocata. Ho una fascia e la uso: fuori tutti, a nome del Comune dichiaro l'archivio… in manutenzione. Per ragioni di umidità. Sette minuti di umidità."],
          ["vl_vermiglio", "Si fa presto a dire «ce le teniamo». Ma sa cosa succede alle prove che nessuno ha il coraggio di consegnare? Diventano fogli di carta. Stasera, {n}, avrò il piacere di invitarla a cena. Non verrà. Io apparecchio lo stesso."],
          ["vl_agata", "Io non te le toglierò. Ma tienile dove nessuno le troverà: neppure io."],
          ...(guida() === "bianca" ? [["vl_bianca", "Le portiamo in officina. Nessuno apre un cassetto di ruote dentate, se non lo sa."]] : []),
        ], BG.A), () => finisciScelta("Ho tenuto le prove io: nessuno ne sa niente. Vermiglio mi ha invitato 'a cena, stasera': mi sta cercando."));
      } else {
        const noemi = "vl_noemi";
        say(sw([
          ["voce", "Pieghi i fascicoli e sali la scala di corsa, tre gradini alla volta. In cima, nel corridoio, c'è già Noemi Etere con il microfono portatile e una cuffia di traverso: aveva sentito il silenzio del sindaco e capito che il silenzio, per una radio, è una notizia."],
          [noemi, "Hai trenta secondi, il cavo è corto e il sindaco ha già esaurito le batterie. Dimmi che cosa c'è sul tavolo, e dimmelo come se parlassi a una persona sola."],
        ], BG.A), () => { go("vl_municipio", 17, 6); radioScena(); });
        return;
      }
    }
    function radioScena() {
      const noemi = "vl_noemi", intervista = F.get("intervista", false);
      say(sw([
        [noemi, intervista ? "Radio Nebbia, qui Noemi Etere. Sono in diretta dal Municipio di Vallombra, e l'ospite è ancora lei: {n}, che alle diciotto e quarantatré ci ha già tenuto compagnia. Stavolta, mi dicono, ha un cassetto." : "Radio Nebbia, qui Noemi Etere. Sono in diretta dal Municipio di Vallombra. Il meteo è sempre quello: nebbia. Ma stamattina, nel quarto cassetto dell'archivio, la nebbia ha trovato una carta."],
        ["voce", "Leggi i fascicoli al microfono, uno dopo l'altro. Il referto di Fischietti. L'Ordine di servizio n. 43. La ricevuta diciottomilioni. Il verbale dell'abbandono, bianco. Attraverso gli altoparlanti dell'albo pretorio, e dalle radio della piazza, la voce di Noemi esce nella valle."],
        ["vl_vermiglio", "(sulla scala, con calma ghiacciata) La pubblicazione di atti sotto sequestro è un reato, {n}. Lo dico come cortesia, non come minaccia."],
        ["vl_sigillo", "Pubblicazione prima del termine. Sarà un piacere sporgere denuncia contro la radio, il sindaco, il campione e il gabbiano che passava."],
        [noemi, "(in onda, senza abbassare la voce) Ingegnere, ho una buona notizia: ci ascoltano in centoventi. Sono gli abitanti di Vallombra e l'ultimo gabbiano. Sono tutti molto attenti."],
        ["voce", "Dalla piazza sale un rumore che non è un applauso, né un coro: è il rumore di un paese che per ventisei anni ha tenuto il fiato e finalmente lo lascia andare, tutti insieme."],
        ["vl_cornelio", "…Io, per il verbale, dichiaro che il Comune è d'accordo con la radio. Il Comune non ha mai avuto un portavoce così efficace, e lo dico con una certa invidia."],
      ], BG.U), () => { X.lanAdd("vl_noemi"); finisciScelta("Ho dato le prove a Noemi: le ha lette in diretta a tutta la valle. Vermiglio e la Sigillo minacciano denunce."); });
    }
    function finisciScelta(txt) {
      F.set("ph", 7); setStep(N, 4); note(txt);
      note("Agata lavora per la Mutua Alterna: la clausola 12 prevede il cemento nella miniera se il dolo è accertato.");
      if (zoneNow() !== "vl_municipio") go("vl_municipio", 17, 6);
      say(sw([
        ["voce", "Quando risali nell'atrio sono le dodici meno due. Il Municipio ha il suo aspetto di sempre: cera, carta e decisioni rimandate. Ma il rumore è cambiato, come cambia il rumore di un edificio dopo che qualcuno ha detto una verità: più sordo, più vero."],
        ["voce", "Sulla panca a est, sotto l'eliminacode, la vecchia signora che aspetta il suo numero ha posato i ferri da calza. Ti sta guardando. Hai la sensazione che ti stia guardando da ventisei anni."],
      ], BG.U), done);
    }
    function arcTalk(id) {
      if (S() === 3 && PH() >= 1 && PH() < 7) return resume();
      if (S() !== 3 && id === "vl_cornelio") return done();
      done();
    }
    function resume() {
      const ph = PH();
      if (ph === 1) return docs();
      if (ph === 2) return corviConf();
      if (ph === 3) return arrivo();
      if (ph === 4) return conf(F.get("cl_i", 0));
      if (ph === 5) return reveal();
      if (ph === 6) return scelta();
      done();
    }

    // ---- Ottavia Rovedo
    function ottavia() {
      if (!inM()) return done();
      F.set("ottavia_met", true);
      const s = S();
      if (s < 4) return ottaviaPre();
      if (s === 4) return ottaviaScena();
      const L1 = ["Tengo il biglietto, ma non per aspettare: per ricordare. Sono due cose che si assomigliano da lontano e si distinguono da vicino.", "Gedeone mi ha fatto avere un panino. Il pane è duro, il ripieno è il conto: quindici. È il miglior panino della mia vita.", "Bianca ha preso l'elmetto dalla cantina. Mi ha detto: «Nonna, è un secchio». Le ho detto: «È un elmetto». Ha detto: «È un secchio con un'idea»."];
      say(sw([["vl_ottavia", chip(L1)]], BG.U), done);
    }
    function ottaviaPre() {
      const o = [
        { label: "Chi sta aspettando, signora?", fn: () => say(sw([["vl_ottavia", "Il mio turno. A Vallombra il turno è lungo: ho il numero 15 in mano da ventisei anni. L'eliminacode è fermo sul 14. Non mi dispiace: nel frattempo ho fatto diciassette maglioni."]], BG.U), done) },
        { label: "Il numero 15?", fn: () => say(sw([["vl_ottavia", "Il quindici è mio. Il resto lo sa il registro. Passi a trovarmi quando avrà aperto il cassetto: avremo un po' da dirci."]], BG.U), done) },
      ];
      ask("vl_ottavia", "«Siediti, giovane, o stai in piedi con grazia: il pavimento è del Comune.»", o, BG.U);
    }
    function ottaviaScena() {
      const g = F.get("gedeone", "taci"), c = compId(), bi = guida() === "bianca";
      say(sw([
        ["voce", "Ottavia Rovedo ha ottantuno anni, uno scialle lilla, i ferri da calza in grembo e il biglietto dell'eliminacode stretto fra due dita. Sotto lo scialle, appesa a un cordino, si intravede una striscia di stoffa rossa: la striscia di un elmetto. Siede in mezzo alla panca, che a Vallombra è il modo di dire che si occupa un posto per sempre."],
        ["vl_ottavia", "Siediti. (batte la mano sul legno) Io non ho mai scelto di essere interrogata: ho scelto di essere seduta. Tu sei {n}. Lo ha detto la radio, e prima della radio una lampada che si è accesa da sola nel mio salotto. Ho ottantuno anni e non mi stupisco più delle lampade."],
        ["vl_ottavia", "Il numero 15. (alza il biglietto) Quella notte eravamo in quindici, nel turno: quattordici uomini e io, la caposquadra. Aurelio Brinzi, il capitano, quel ragazzo con la fascia e il fischietto da minatore tra i denti, gridò «Contali, Ottavia!» mentre spingeva l'ultimo su per la scala del condotto. Io contai. Dodici. Tredici. Quattordici. Poi il botto."],
        ["vl_ottavia", "Non mi sono contata. Da ventisei anni dico «quattordici», e tutti annuiscono, e io penso: «ne manca uno». Ne manca sempre uno. Ero io. Sono uscita per ultima e nessuno dice quanto manca a chi esce per ultimo."],
        ["vl_ottavia", g === "verita" ? "Gedeone Roccia mi ha mandato a dire, con il nipote del fornaio, che il conto torna. «Quindici», ha scritto. Ho pianto sul brodo. Il brodo ne ha avuto un vantaggio." : "Gedeone Roccia, dicono, è giù da qualche parte e conta ancora. Ha sempre contato male, poverino: non per scarsa testa, per eccesso di cuore."],
        ["vl_ottavia", "Aurelio mi disse un'altra cosa, mentre mi spingeva. Mi disse: «Dica a mia sorella che la lettera arriverà dopo.» Io non l'ho mai detto a Teodora. Avevo paura di farla sperare. A cinquantacinque anni, si ha paura di tutto, tranne che di quello che serve."],
      ], BG.U), () => ask("vl_ottavia", "Ottavia ti guarda con gli occhi di chi ha aspettato di essere ascoltata più a lungo di chi parla. Cosa rispondi?", [
        { label: "«Lo dirò io a Teodora.»", sub: "Prendi il compito", fn: () => ottaviaPick("dirai") },
        { label: "«Il suo conto è quindici, signora. Da oggi.»", sub: "Le rendi il conto", fn: () => ottaviaPick("conto") },
        { label: "«Lei non deve niente a nessuno.»", sub: "La liberi", fn: () => ottaviaPick("nulla") },
      ], BG.U));
      void c; void bi;
    }
    function ottaviaPick(w) {
      F.set("ottavia_t", w);
      const bi = guida() === "bianca";
      const a = w === "dirai" ? [["vl_ottavia", "Ecco: un compito. È più leggero di una promessa e pesa lo stesso. Grazie, giovane. Le parole di Aurelio non andavano portate da una vecchia: andavano portate da qualcuno che arriva."]]
        : w === "conto" ? [["vl_ottavia", "Quindici. (assapora il numero) Quindici. Detto da te suona come un nome. …Non lo dirò più «quattordici». Lo dirò a Gedeone, al fornaio, al gabbiano."]]
          : [["vl_ottavia", "Si deve sempre, giovane. Con le persone vive si salda a rate: un panino, una tisana, una buona parola. Ma sei gentile. Mi ricordi qualcuno che aveva i capelli in disordine e una fascia da capitano."]];
      say(sw([...a,
        ["voce", bi ? "Bianca si ferma a tre passi dalla panca, con le mani nere di grasso e gli occhi più lucidi di una chiave inglese appena tolta dall'olio." : "Bianca, che qualcuno è andato a chiamare in officina, entra nell'atrio con le mani nere di grasso. Si ferma a tre passi dalla panca, come davanti a una porta che ha sempre visto chiusa."],
        bi ? ["vl_bianca", "Io ti ho tenuto la corda là sotto, nel buio, e pensavo di tenere la corda a uno che scende. Invece la tenevo a mia nonna. (guarda l'elmetto sotto lo scialle) L'elmetto con la striscia rossa. Il «secchio» di cantina. Non ho mai chiesto perché."] : ["vl_bianca", "Mi hanno detto in officina che la nonna parlava con una lampada. Ho pensato: finalmente un'idea sua. (guarda lo scialle, la striscia rossa) L'elmetto del secchio. Non ho mai chiesto perché."],
        ["vl_ottavia", "Era l'ultimo dei miei, tesoro. Gliel'ho dato io. «Tienilo come un secchio», dissi. Era più semplice che dirti «tienilo come una colpa»."],
        ["vl_bianca", "Mia nonna è viva perché undici scemi in maglia blu e ambra hanno tenuto aperta una porta. Io sono nata perché loro l'hanno tenuta aperta. Questo è… un debito, ecco. Non so a chi si paga. Alla Squadra, immagino: e per ora, alla persona che li sta andando a cercare."],
        tl({ sicuro: "Allora dammi una mano: tieni la corda anche di qui.", attento: "Non è un debito, Bianca. È una parentela: si eredita, e non si salda, si passa.", ironico: "Prendo solo pagamenti in bulloni. Ma ne ho bisogno pochi." }),
        ["vl_bianca", "Da oggi vengo dove vai. Non per fare la guardia del corpo: per fare quello che fa una meccanica. Tenere insieme le cose finché reggono. E poi aggiustarle con più cattiveria."],
        ["vl_ottavia", "Tieni, giovane. (ti porge il biglietto con il numero 15, ingiallito) Non è un regalo: è un incarico. Se qualcuno chiama il quindici, rispondi tu."],
      ], BG.U), () => {
        F.set("bianca_debito", true); X.lanAdd("vl_bianca"); X.lanAdd("vl_ottavia"); F.set("biglietto15", true);
        note("Ottavia Rovedo, nonna di Bianca, era la caposquadra del turno di notte: quindici persone, non quattordici. Bianca ha un debito di vita con la Squadra. Aurelio aveva detto a Ottavia: 'la lettera arriverà dopo'.");
        setStep(N, 5); done();
      });
    }

    // ---- la piazza: il finale del capitolo
    function finaleHook() {
      F.set("fin4", true);
      const rad = has("prove_radio"), ag = has("prove_agata"), keep = has("prove_tenute"), rem = remoId(), su = F.get("fosco", "su") !== "giu";
      say(sw([
        ["voce", rad ? "La piazza della Lanterna è piena come per la Coppa. Mezzo paese è venuto a sentire dal vivo quello che ha già sentito dalla radio. Qualcuno ha tirato fuori le sedie, qualcuno ha portato il thermos, e Mirtilla ha invitato tutti a una cioccolata chiamata «Nebbia Chiarita»." : ag ? "La piazza della Lanterna è piena come per la Coppa: i giornali non ci sono, ma c'è Mirtilla, che ha già sentito tutto da tre fonti diverse e ne sa di più di tutte." : "La piazza della Lanterna è silenziosa come un palcoscenico a luci spente. Qualcuno ti guarda dalle finestre, qualcuno dalle porte. Mirtilla, per una volta, non dice niente: porge una tazza e basta."],
        ["vl_teodora", "Il registro. Alle 12:05 la cabina è ripartita con due passeggeri: un ingegnere in cappotto grigio e un'avvocata con una cartellina. Il biglietto dell'ingegnere dice «Vallombra – Cima Alta, sola andata». Non ho segnato «PARTITO». Ho segnato «PARTITO (PER ORA)»."],
        ...(keep ? [["vl_teodora", "Dicono che stasera qualcuno dovrà andare a una cena. Non andare."]] : []),
        ["vl_teodora", rad ? "E, giovane, ho sentito la radio. Aurelio… (si ferma) …ha una sorella che da ventisei anni scrive «ARRIVATO» a matita perché ha paura che l'inchiostro gli dia ragione." : "E, giovane, ho sentito le voci. Aurelio… (si ferma) …ha una sorella che da ventisei anni scrive «ARRIVATO» a matita perché ha paura che l'inchiostro gli dia ragione."],
        ["vl_noemi", "Radio Nebbia, qui Noemi. Meteo: nebbia. Notizie: Cima Alta ha ritirato la tregua. Derby con i Camosci al Campo Alto, sabato. Il nuovo main sponsor dei Camosci è, cito, «Lumen Energie Alpine». Il capitano Valanga dichiara: «Giocheremo con gli occhiali». Il portiere dei Camosci dichiara: «Giocheremo con lo sponsor»."],
        ["voce", rem === "vl_remo_ns" ? "Remo è sulla banchina della cabina, con Tonio. Gli occhiali da sole sono in tasca, nel taschino, e la mano sulla tasca come su un cuore." : "Remo è sulla banchina della cabina, con Tonio. Gli occhiali da sole sono dove sono sempre stati, e dietro le lenti il suo sguardo non si capisce."],
        [rem, "Ho sentito il nome. Quello dell'arbitro. (non scherza: è la prima volta che non ha una battuta pronta) Non lo so dire. Non so che cosa significhi. So soltanto che sabato si gioca a casa mia, e che voglio che veniate. Senza Società, se potete. Con la Società, se dovete."],
        ["vl_tonio", "Il capitano non si toglie gli occhiali da ieri. Dice che servono, ma non dice a cosa."],
        ...(su ? [["vl_fosco", "Ho spolverato anche il Municipio. L'armadietto, però, è rimasto il migliore. Quando si finirà questa storia, l'armadietto numero tredici lo lucido io, e ci appendo il tuo nome."]] : [["voce", "Fosco non c'è: è giù, con Berto, a ripetere «ottantanove» senza perdere la voce. Mirtilla gli tiene il panino delle sei, da qualche parte, in un tovagliolo."]]),
        ["voce", "In cima al sentiero, i lampioni si accendono uno dopo l'altro, in pieno giorno. Il Lampionaio, in cima all'ultimo, ha la lavagna sollevata sopra la testa. Scrive, per tutti, a lettere grandi: «ORA I CAMOSCI. E LA LETTERA CHE NON È MAI ARRIVATA.»"],
      ], BG.P), fineCapitolo);
    }
    function fineCapitolo() {
      X.finishChapter(N, "registro"); setStep(N, 6);
      note("Cima Alta: derby sabato, con i Camosci sponsorizzati dalla Società Lumen. Ottavia: la lettera di Aurelio 'arriverà dopo'. Remo ha sentito il nome dell'arbitro.");
      const rw = reward("vl_ch4", { coins: 50, cos: "vl_stemma_registro" });
      X.say(sw([["voce", "CAPITOLO 4 · IL REGISTRO · CONCLUSO"], ["voce", (rw.length ? rw.join(" · ") + ". " : "") + "Il Capitolo 5 ti aspetta a Cima Alta: prendi la cabina alla Stazione, oppure usa «Continua». Nel frattempo puoi tornare al Municipio, raccogliere le ultime schegge, giocare con gli impiegati e parlare con tutti."]], BG.P), done);
    }

    // ---- compagni, Noemi, ospiti
    function compagnoMuni(id) {
      const z = zoneNow(), s = S(), isB = id === "vl_bianca";
      if (z === "vl_archivio" && s === 3 && PH() >= 1 && PH() < 7) return resume();
      if (z === "vl_archivio") {
        if (id !== compId()) return done();
        const o = [{ label: "Che facciamo ora?", sub: "Un consiglio", fn: () => say(sw([[id, has("cass_open") ? "Il cassetto è aperto. Leggi con calma, che noi teniamo il tempo." : lockHint()]], BG.A), done) }];
        return ask(id, isB ? "«Dimmi tu: io faccio i bulloni, tu fai le combinazioni.»" : "«Dimmi tu: io leggo gli indizi, tu li metti in fila.»", o, BG.A);
      }
      if (s <= 2) {
        const L1 = isB ? ["Un municipio è un'officina di moduli. I bulloni sono timbri, le chiavi inglesi sono avvocati. Ho una fifa blu.", "Ho portato la chiave inglese anche qui. Non si sa mai: i cassetti hanno le viti, no?"] : ["Un decreto per la «bonifica documentale». Parole che nelle mie relazioni suonano come «distruzione di prove». Lo annoto.", "L'archivio di un comune è un sedimento: strati di carta come strati di roccia. Ma io, qui, non ho il martello."];
        return say(sw([[id, chip(L1)]], BG.U), done);
      }
      if (s === 3) return say(sw([[id, id === "vl_agata" ? "Io vado di sotto. Prima o poi dovrai sapere. (distoglie lo sguardo) Prima o poi dirò." : "Tieni la chiave, io tengo l'occhio sulla Sala. Se l'ingegnere si muove, urlo. Con una voce da meccanica."]], BG.U), done);
      // dopo il cassetto
      const pr = F.get("prove", "tenute");
      if (id === "vl_agata") {
        const o = [{ label: "Come stai?", fn: () => say(sw([["vl_agata", pr === "agata" ? "Il notaio ha detto: «Trenta giorni». Ho risposto: «Ne ho venti di troppo.» Mi ha guardata come si guarda una persona che dice la verità per sbaglio." : pr === "radio" ? "Mi sono tolta il cartellino della Mutua e l'ho appeso alla bacheca dell'albo, dove Corvi appende le cose che non vuole perdere. Se serve, lo riprendo." : "Non hai voluto darmele. Ti capisco. Io avrei fatto lo stesso, se non avessi un contratto: ecco cosa vuol dire un contratto."]], BG.U), done) }];
        return ask("vl_agata", "«Se vuoi dirmi che sono una bugiarda, fallo adesso. Poi non ho più tempo di essere imbarazzata.»", o, BG.U);
      }
      say(sw([["vl_bianca", chip(["Mia nonna mi ha detto che ha avuto una vita lunga perché si è dimenticata di morire. Io le ho detto che ha avuto una vita lunga perché non ha mai chiesto il permesso.", "Ho un debito, adesso. Mi piace: ha il peso giusto, come un bullone da dodici."])]], BG.U), done);
    }
    function noemi() {
      const z = zoneNow(), s = S();
      if (!inM()) { if (s >= 6) return say(sw([["vl_noemi", chip(["Radio Nebbia, qui Noemi. Meteo: nebbia, con possibilità di derby. Cima Alta, dicono, ha rimesso a posto le porte.", "Ieri ho letto un nome alla radio e per un attimo ho sentito la valle ascoltarmi. Poi è tornato il meteo: ma io ho ancora la pelle d'oca."])]], BG.P), done); return delegate("vl_noemi"); }
      if (z === "vl_archivio") return done();
      const pr = F.get("prove", "");
      say(sw([["vl_noemi", s === 3 ? "Resto qui, con il microfono staccato e le orecchie accese. Il tuo sindaco sta parlando da cinque minuti: è la trasmissione più lunga che abbia mai ascoltato in diretta." : s === 4 ? "Se mai ti serve la radio, ci sono. Dico «se mai» per scaramanzia: tra un'ora potrei dover chiedere io qualcosa a te." : pr === "radio" ? "Ho letto un nome ad alta voce e per un attimo mi è sembrato che la valle mi ascoltasse. Poi è tornato il meteo, ma io ho ancora la pelle d'oca." : "Quando vuoi che qualcosa si sappia, io ho il microfono. Quando vuoi che si sappia con calma, ho anche la camomilla."]], BG.U), done);
    }
    function ettore() {
      if (!inM()) return delegate("vl_ettore");
      const rispetto = F.get("ettore_t", "") === "rispetto";
      say(sw([["vl_ettore", rispetto ? "Siamo qui in qualità di pubblico. Telecamera spenta. Quaderno acceso: ho scritto «oggi il Municipio si è comportato bene» e poi ho cancellato «bene», che sapeva di recensione." : "Io non sto filmando. Sto… (tiene la telecamera dietro la schiena) …conservando l'immagine nella memoria interna. Sì. È un'espressione tecnica."]], BG.U), done);
    }
    function viola() {
      if (!inM()) return delegate("vl_viola");
      say(sw([["vl_viola", chip(["Ettore ha un quaderno e una teoria: la teoria è che in un municipio si nascondano più misteri che in una grotta. Io credo che abbia ragione, e mi dà fastidio.", "Qui il silenzio ha il peso della carta. Meglio così: la telecamera non gliela avrei mai perdonata."])]], BG.U), done);
    }
    function fosco() {
      if (!inM()) return delegate("vl_fosco");
      say(sw([["vl_fosco", chip(["Teodora mi ha mandato a spolverare il Municipio: dice che se c'è un posto che ha bisogno di uno straccio è questo. Ha ragione, e non mi paga.", "Gli archivi mi piacciono: cose in ordine, ognuna col suo posto. La mia vita, fino a ieri, era un armadietto. Adesso è un cassetto. Un passo avanti.", "Berto direbbe: «Se c'è una scala, la scendi». Io ho paura delle scale, ma mi fido del suo consiglio. Non scendo oggi."])]], BG.U), done);
    }
    function teodoraT() {
      if (inM() || S() < 6) return delegate("vl_teodora");
      say(sw([["vl_teodora", chip(["Cima Alta, il biglietto di Vermiglio. L'ho tenuto da parte. Se una cabina può partire a vuoto per ventisei anni, un biglietto può aspettare una settimana.", "La lettera. Se esiste, arriverà. Aurelio non era uno che prometteva a vuoto: era uno che aspettava la fine di una frase.", "Ho scritto «PARTITO (PER ORA)» a penna. Per la prima volta ho paura che l'inchiostro mi dia ragione."])]], BG.P), done);
    }
    function remoT(id) {
      if (inM()) return done();
      delegate(id);
    }

    // ---- partitella facoltativa: Anagrafe contro Tributi
    function matchImpiegati() {
      const first = !has("m4_played");
      say(sw([["vl_corvi", first ? "Ogni anno l'Anagrafe sfida i Tributi nel cortile, dietro il Municipio. Un tempo solo, porte di scatoloni, arbitro la campana da mucca. Chi vince offre il caffè, chi perde compila il modulo. Non c'è mai stato un pareggio: la burocrazia non li prevede." : "Un'altra? Il caffè lo offro io. Il modulo di sconfitta lo stampiamo in due copie."]], BG.U), () => X.playMatch({
        id: "vl4", alt: "az", azPitch: "campo", chap: "Vallombra · Cortile del Municipio", mate: compName(),
        intro: "Partitella nel cortile del Municipio, un tempo solo: <em>i Tributi</em> contro di te e " + compName() + ". Le porte sono due scatoloni, il pallone è un faldone arrotolato e il fischio, dicono, è della campana da mucca.",
        team: (t, st) => ({ vs: "i Tributi", name: "Tributi", color: "#c8a24a", defs: [["Il Ragioniere", t(st.drib * 0.78)], ["La Protocollista", t(st.drib * 0.8)], ["L'Usciere", t(st.drib * 0.82)]], atk: [["Il Geometra", t(st.tiro * 0.82)], ["La Protocollista", t(st.tiro * 0.8)]], gk: ["L'Ufficiale Stato Civile", t(st.tiro * 0.93)], power: t(st.tiro * 0.78), special: ["LA PRATICA URGENTE", t(st.tiro * 1.08)] }),
        done: (r) => {
          F.set("m4_played", true); if (r.win) F.set("m4_win", true);
          const msg = r.win ? reward("vl_m4_win", { coins: 10 }) : [];
          note(r.win ? `Partitella nel cortile del Municipio vinta ${r.a}–${r.b}.` : `Partitella nel cortile del Municipio ${r.a}–${r.b}.`);
          X.say(sw([["voce", `Finisce ${r.a}–${r.b}.${msg.length ? " " + msg.join(" · ") + "." : ""}`], ["vl_corvi", r.win ? "Il caffè lo offro io. Ma il modulo di sconfitta, quello sì, lo stampo ugualmente: serve da ricordo." : "Il caffè lo offri tu. Il modulo lo compiliamo insieme, in triplice copia, con una bella calligrafia."]], BG.U), done);
        },
      }));
    }

    // ---- oggetti dell'Archivio
    function oggettoArch({ ch, tx, ty }) {
      const T_ = {
        S: ["Faldoni a perdita d'occhio, etichettati a mano: «TRIBUTI 1962», «CANI (CENSIMENTO)», «LAMENTELE (VARIE)», «LAMENTELE (VARIE II)». Un faldone, in basso, è etichettato semplicemente «LA VERITÀ (parziale)». È vuoto.", "Uno scaffale di registri dei nati. Sulla costa di uno, qualcuno ha scritto «Aurelio Brinzi · cl. 1971» e poi, più piano, «ora sarebbe più vecchio di me».", "Il settore «Opere pubbliche». Un faldone riporta: «Rotatoria (progetto, 11 versioni)». Un altro: «Rotatoria (consuntivo)». Un terzo: «Rotatoria (perché no)»."],
        T: ["Il tavolo di consultazione. Un registro aperto sull'ultima firma di consultazione: «O. Corvi, 14 maggio 1998». Sotto, nessun altro nome, nemmeno quello del tempo.", "Il tavolo ha una scanalatura a forma di mano, consumata da chi ha consultato qualcosa in fretta. L'ultimo graffio è fresco: stamattina, forse."],
        C: ["La lumina filtra dalla crepa nel muro, come un respiro. È la stessa pietra della miniera: arriva qui passando sotto le case, come una radice.", "Un grappolo di lumina grande come un pugno, tiepido. Quando lo guardi dritto, si ritira; di lato, no."],
        E: ["Una pietra che trasuda un brusio. Una voce di donna, lontana, dice «un attimo, che il sindaco sta finendo» e poi ride, e poi più nulla. L'archivio, qui, ha un'eco di sala d'attesa.", "Dalla pietra sale un battito di timbri, a ritmo di marcia, poi un «Prossimo!» ventisei anni fa, poi di nuovo la polvere."],
        x: ["Casse di carte da buttare. In cima, una scritta: «DA BUTTARE NEL 2005». Qualcuno ha corretto: «DA BUTTARE NEL 2006». Poi «2007». Poi ha lasciato perdere.", "Una cassa con un'etichetta ormai illeggibile e un panino fossilizzato con la scritta «CORVI». Meglio non toccare."],
        l: ["Una lampada a olio appesa a un gancio, con un seme di lumina che batte piano. Si accende quando passi e si spegne quando ti allontani, con un rispetto da maggiordomo."],
      }[ch];
      if (!T_) return done();
      say(sw([["voce", chip(T_)]], BG.A), done);
    }

    // ---- oggetti e personaggi
    const obj = {
      "vl_paese:w": () => { go("vl_municipio", 17, 21); },
      "vl_municipio:d": esci, "vl_municipio:L": scala,
      "vl_municipio:n": oggettoMuni, "vl_municipio:J": oggettoMuni, "vl_municipio:T": oggettoMuni, "vl_municipio:S": oggettoMuni, "vl_municipio:b": oggettoMuni, "vl_municipio:l": oggettoMuni, "vl_municipio:x": oggettoMuni,
      "vl_archivio:^": () => go("vl_municipio", 17, 6), "vl_archivio:n": bacheca, "vl_archivio:O": tassello, "vl_archivio:B": armadio,
      "vl_archivio:S": oggettoArch, "vl_archivio:T": oggettoArch, "vl_archivio:C": oggettoArch, "vl_archivio:E": oggettoArch, "vl_archivio:x": oggettoArch, "vl_archivio:l": oggettoArch,
    };
    const talk = {
      vl_cornelio: cornelio, vl_vermiglio: vermiglio, vl_sigillo: sigillo, vl_corvi: corvi, vl_ottavia: ottavia, vl_noemi: noemi, vl_ettore: ettore, vl_viola: viola, vl_fosco: fosco, vl_teodora: teodoraT,
      vl_bianca: () => (inM() ? compagnoMuni("vl_bianca") : delegate("vl_bianca")), vl_agata: () => (inM() ? compagnoMuni("vl_agata") : delegate("vl_agata")),
      vl_remo: () => remoT("vl_remo"), vl_remo_ns: () => remoT("vl_remo_ns"),
    };

    return {
      n: N, title: "Il Registro", sub: "Un cassetto, quattro tasselli e un'ora di tempo", start: "vl_municipio", zones, talk, obj, goal, mood,
      news: (id, s) => {
        if (!inM()) return X.newsOf(id, N);
        if (zoneNow() === "vl_archivio") return s === 3 && PH() >= 1 && PH() < 7 && [compId(), "vl_vermiglio", "vl_corvi", "vl_cornelio", "vl_agata"].includes(id);
        if (id === "vl_cornelio") return s === 0;
        if (id === "vl_vermiglio") return s === 1;
        if (id === "vl_corvi") return s === 2;
        if (id === "vl_ottavia") return s === 4;
        return false;
      },
      intro: () => [
        ["voce", "All'alba la lumina della miniera si è spenta come una brace che ha finito il suo lavoro; il sentiero dei Lampioni è rimasto acceso, per cortesia. Il paese si sveglia a rate, tra finestre che si accendono e gabbiani che non fanno commenti.", BG.P],
        ["voce", "Nella tasca hai una chiave di ferro, annerita, con un nastro rosso. Pesa come un compito in classe. Cornelio ti ha dato appuntamento al Municipio, «prima che arrivino»: e «loro», a quanto pare, sono arrivati con la prima corsa, hanno dormito al Rifugio e ordinato una tisana senza zucchero e senza nome.", BG.P],
        ["voce", "A Vallombra il Municipio ha un orologio sul frontone fermo alle undici e dieci. Nessuno sa chi l'abbia fermato. Si sospetta il Comune, che da sempre è in ritardo di principio.", BG.U],
      ],
    };
  });


  // ================================================================== CAPITOLO 5 · I CAMOSCI
  // Nuove zone: Cima Alta (il villaggio giallo fluo sopra il Latte), il Campo Alto (lo stadio dei Camosci, sede del derby) e la Baita del Fischio.
  // Ritocca anche la stazione di Vallombra (la cabina sale a Cima Alta) via patch. Il derby si gioca in due tempi (due api.match) con
  // la «Regola del Campo Alto»: arbitro designato dallo sponsor. Ricompense: solo monete (una tantum) e cosmetici.
  addChapter(function (X) {
    const { T, F, say, ask, done, go, note, setStep, reward, hero, esc } = X;
    const N = 5, S = () => X.stepOf(N), has = (k) => F.is(k);
    const BG = { P: "vl_paese", C: "vl_cima", O: "vl_osteria", A: "vl_campoalto", B: "vl_baita", S: "vl_spogliatoi" };
    const sw = (lines, bg) => lines.map((l) => (l.length > 2 ? l : [l[0], l[1], bg]));
    const chip = (a) => a[Math.floor(Math.random() * a.length)];
    const tono = () => F.get("tono", "ironico");
    const tl = (o) => ["hero", o[tono()] || o.ironico || o.sicuro];
    const zoneNow = () => X.api.trZone();
    const MINE = ["vl_cimaalta", "vl_campoalto", "vl_baita"];
    const inC = () => MINE.includes(zoneNow());
    const toast = (m) => X.api.trToast(m);
    const guida = () => F.get("guida", "bianca");
    const compId = () => (guida() === "agata" ? "vl_agata" : "vl_bianca");
    const compName = () => (guida() === "agata" ? "Agata" : "Bianca");
    const isB = () => guida() !== "agata";
    const remoId = () => (has("remo_bet") && has("m1_win") ? "vl_remo_ns" : "vl_remo");
    const remoHelps = () => has("remo_help") || has("remo_pent");
    const delegate = (id) => { const p = X.talkOf(id, N); if (p) p(); else done(); };
    const PH = () => F.get("ph5", 0);
    const proofs = () => ["cl5_a", "cl5_b", "cl5_c"].filter((k) => has(k)).length;
    const bgHere = () => ({ vl_cimaalta: BG.C, vl_campoalto: BG.A, vl_baita: BG.B }[zoneNow()] || X.bgNow());

    // ---- personaggi nuovi
    const cast = (id, name, o, bio) => X.cast(id, Object.assign({ name }, o), bio);
    cast("vl_vica", "Ludovica «Vica» Valanga", { tag: "gold", hair: "#b5532a", style: "codino", skin: "#c98f63", bg: ["#d6f23a", "#3a2616"], shirt: "#d6f23a" }, "Ex ala dei Camosci e oggi oste dell'Osteria del Camoscio. Sa fare il panino che non contiene camoscio, la polenta del derby e il silenzio. Il silenzio le riesce meglio, e le costa di più.");
    cast("vl_gaudenzio", "Gaudenzio Fischietti", { tag: "gray", hair: "#d8d8e0", style: "slick", skin: "#e8bf98", shades: true, beard: true, bg: ["#3a2616", "#e0a23a"], shirt: "#6a5a4a" }, "L'arbitro della finale del '98, in carne, ossa e occhiali scuri. Vive in una baita sopra Cima Alta con ventisei fischietti appesi al muro. Non fischia da allora. Guarda ogni partita col cannocchiale.");
    cast("vl_neve", "Rag. Ruggero Neve", { tag: "gold", hair: "#f4f4f8", style: "slick", skin: "#f0c9a8", bg: ["#1c2a4a", "#e4ff3a"], shirt: "#2b4a34" }, "Presidente dei Camosci, albergatore, allenatore delle giovanili e, il giovedì, parroco supplente. Vende neve (anzi, la affitta) e sorride con tutti i denti, compresi quelli che non sono suoi.");
    cast("vl_zelo", "Vitaliano Zelo", { tag: "", hair: "#1a1a1a", style: "buzz", skin: "#d9a57a", bg: ["#ff4fbf", "#1a1a1a"], shirt: "#ff4fbf" }, "Arbitro di livello quattro, dipendente di «Lumen Servizi Sportivi». Tuta rosa fluo, fischietto cromato, una forte opinione sul fuorigioco e nessuna sul resto. Ha ammonito un gabbiano a luglio.");
    X.cos("vl_camoscio", { kind: "shirt", label: "Maglia Camoscio", val: "#d6f23a", from: "Concludi il capitolo 5 di Vallombra" });
    X.cos("vl_fascia_cima", { kind: "acc", label: "Fascia dei Camosci", val: "#e4ff3a", from: "Raccogli tutte le schegge di lumina a Cima Alta" });
    X.cos("vl_neve_cap", { kind: "hairc", label: "Capelli Neve alta", val: "#eef4ff", from: "Raccogli tutte le schegge di lumina al Campo Alto" });
    X.cos("vl_baita_cap", { kind: "hairc", label: "Capelli Rosso camoscio", val: "#b5532a", from: "Raccogli tutte le schegge di lumina alla Baita del Fischio" });

    // ---- sole fino al tramonto del derby, poi sera
    const mood = (s) => (s >= 6 ? 1 : 0);

    // ---- obiettivi: sempre con la direzione e che cosa cercare
    const goal = (s) => {
      const ph = PH();
      if (s === 0) return "Cima Alta: parla con Gisella, la steward, in piazza (CENTRO della mappa, sotto il tabellone).";
      if (s === 1) return "Il Chalet del Presidente Neve è in ALTO a destra (NORD-EST), con l'insegna dello sponsor. Parla con lui sulla terrazza, davanti alla porta.";
      if (s === 2) return "Il Campo Alto è a EST: dalla piazza, il cancello a destra (freccia gialla). Parla con Remo sul prato.";
      if (s === 3) return (zoneNow() === "vl_campoalto" ? "Torna in piazza (dal Campo Alto esci dal cancello a OVEST). " : "") + "L'Osteria del Camoscio è in ALTO a sinistra (NORD-OVEST), con la tenda a righe. Parla con Vica sulla soglia.";
      if (s === 4 && zoneNow() === "vl_baita") return "Sei sul sentiero del Fischio: la baita è a EST, al centro (porta con il camino). Parla con l'uomo sul portico.";
      if (s === 4) return "Il sentiero del Fischio parte dalla piazza di Cima Alta, in ALTO (NORD): cancello con la freccia in su. In cima c'è la baita: parla con l'uomo sul portico.";
      if (s === 5) {
        if (ph === 1) return "Intervallo al Campo Alto: tocca il pallone al CENTRO del prato per far ripartire la scena dello spogliatoio.";
        if (ph === 2) return "Secondo tempo: tocca il pallone al CENTRO del prato per riprendere.";
        if (ph === 3) return "Fischio finale: tocca il pallone al CENTRO del prato per chiudere la giornata.";
        const away = zoneNow() !== "vl_campoalto" ? "Il Campo Alto è a EST della piazza di Cima Alta (cancello giallo). " : "";
        const miss = [!has("cl5_a") ? "la vetrina dei trofei in piazza (ALTO, a destra del tabellone)" : "", !has("cl5_b") ? "la Sala Arbitri (porta in ALTO a destra del campo)" : "", !has("cl5_c") ? "la panchina dei Camosci (OVEST, bordo del prato)" : ""].filter(Boolean);
        return away + "Il derby: al Campo Alto, tocca il pallone al CENTRO del prato per il calcio d'inizio. Prima, se vuoi, cerca prove sull'arbitro" + (miss.length ? ": " + miss.join(", ") : " (le hai tutte)") + ".";
      }
      if (s === 6) return "Si fa sera: torna a Cima Alta, alla Stazione di Cima (in BASSO a sinistra, SUD-OVEST). Vica ti aspetta in banchina, davanti alle cabine.";
      return "Capitolo concluso. Il Capitolo 6 non è ancora pronto: nel frattempo raccogli le schegge, ripassa dai Camosci e dalla baita, parla con tutti.";
    };

    // ---- tessere nuove: V=stendardo dei Camosci  #=tabellone  %=cannocchiale  (pavimenti: s=neve  I=ghiaccio)
    X.PAINT.V = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const g = GP, w = Math.sin(fr / 14 + tx) * 1.5;
      P(sx + 3, sy - 14, 2, 30, "#2a2f48"); P(sx + 2, sy - 15, 4, 2, "#8a93a6");
      g.fillStyle = "#e4ff3a"; g.beginPath(); g.moveTo(sx + 5, sy - 13); g.lineTo(sx + 15, sy - 11 + w); g.lineTo(sx + 14, sy + 1 + w); g.lineTo(sx + 5, sy + 1); g.fill();
      P(sx + 8, sy - 7, 3, 5, "#1a1a1a"); P(sx + 7, sy - 9, 1, 3, "#1a1a1a"); P(sx + 11, sy - 9, 1, 3, "#1a1a1a");
    };
    X.PAINT["#"] = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const g = GP, L = at(tx - 1, ty) !== "#", Rr = at(tx + 1, ty) !== "#";
      P(sx + (L ? 1 : 0), sy - 2, 16 - (L ? 1 : 0) - (Rr ? 1 : 0), 16, "#10141f"); P(sx + (L ? 1 : 0), sy - 2, 16, 2, "#d6f23a"); P(sx + (L ? 1 : 0), sy + 12, 16, 2, "#2a2f48");
      const k = (tx + (ty << 1)) % 4, lit = (fr >> 5) % 3; g.fillStyle = "#ff9a2e"; g.font = "bold 8px sans-serif"; g.textAlign = "center";
      g.fillText(ZX.id === "vl_campoalto" ? ["C", "A", "M", "·"][k] : "", sx + 8, sy + 8); g.textAlign = "left";
      P(sx + 3, sy + 10, 2, 1, lit === 0 ? "#ffd23f" : "#3a2a10"); P(sx + 11, sy + 10, 2, 1, lit === 1 ? "#ffd23f" : "#3a2a10");
    };
    X.PAINT["%"] = function (sx, sy, tx, ty, fr) {
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const g = GP;
      P(sx + 7, sy + 7, 2, 9, "#1a1008"); P(sx + 4, sy + 14, 2, 2, "#1a1008"); P(sx + 10, sy + 14, 2, 2, "#1a1008");
      g.fillStyle = "#6a5a3a"; g.beginPath(); g.moveTo(sx + 2, sy + 8); g.lineTo(sx + 13, sy + 2); g.lineTo(sx + 14, sy + 5); g.lineTo(sx + 3, sy + 11); g.fill(); P(sx + 12, sy + 1, 3, 5, "#2a2418"); P(sx + 1, sy + 7, 2, 4, "#c9ccd6");
      if ((fr >> 5) % 4 === 0) P(sx + 13, sy + 2, 1, 1, "#ffffff");
    };
    // le gradinate del Campo Alto sono gialle e nere, non blu e ambra
    const j0 = X.PAINT.j;
    X.PAINT.j = function (sx, sy, tx, ty, fr) {
      if (ZX.id !== "vl_campoalto") return j0(sx, sy, tx, ty, fr);
      floorPaint(undAt(tx, ty), sx, sy, tx, ty); const c = (tx >> 1) % 2 ? "#e4ff3a" : "#b8d42a";
      P(sx, sy + 3, 16, 3, "#2a2f48"); P(sx, sy + 7, 16, 5, c); P(sx, sy + 7, 16, 1, "#ffffff55"); P(sx, sy + 12, 16, 3, "#1a1a1a"); P(sx + 2, sy + 15, 2, 1, "#00000044");
      if (hash(tx * 7 + ty) % 5 === 0) { const g = GP; g.fillStyle = ["#2a2f48", "#c8422e", "#e8e8f0"][hash(tx + ty * 3) % 3]; g.beginPath(); g.arc(sx + 8, sy + 4, 2.4, 0, 7); g.fill(); }
    };

    function motes(g, d, n, a) { for (let i = 0; i < n; i++) { const x = ((i * 53 + d.fr * 0.15) % 340) - 10, y = ((i * 71 + Math.sin(d.fr / 60 + i) * 8) % 220) - 10; R(g, x, y, 1, 1, `rgba(${a || "255,255,255"},.55)`); } }
    function snowfall(g, d) { for (let i = 0; i < 26; i++) { const x = ((i * 47 + d.fr * (0.12 + (i % 4) * 0.03) + Math.sin(d.fr / 70 + i) * 10) % 340) - 10, y = ((i * 31 + d.fr * (0.2 + (i % 3) * 0.06)) % 215) - 8; R(g, x, y, 1 + (i % 3 === 0 ? 1 : 0), 1 + (i % 3 === 0 ? 1 : 0), "rgba(255,255,255,.7)"); } }
    function eveningLights(g, cx, cy) {
      g.save(); g.globalCompositeOperation = "lighter"; const t0x = Math.floor(cx / TS), t0y = Math.floor(cy / TS);
      for (let ty = t0y; ty <= t0y + 13; ty++) for (let tx = t0x; tx <= t0x + 21; tx++) {
        const ch = at(tx, ty), x = tx * TS - cx + 8, y = ty * TS - cy + 8;
        if (ch === "V") glow(g, x, y - 4, 20, "230,255,80", 0.22);
        else if (ch === "#") glow(g, x, y, 22, "255,150,50", 0.2);
        else if (ch === "J") glow(g, x, y, 14, "255,230,170", 0.2);
      }
      g.restore();
    }

    const zones = {
      vl_cimaalta: {
        name: "Cima Alta · Il villaggio dei Camosci", short: "Cima Alta", sub: "Millenovecento metri, quattrocento abitanti e tutto giallo", w: 44, h: 28, start: [5, 22], theme: "torino", bg: "vl_cima",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_fascia_cima", items: [[2, 8], [41, 6], [12, 22], [26, 23]],
        act: { k: "Guarda la cabina", u: "Entra nell'Osteria", w: "Guarda il Chalet", v: "Guarda l'ufficio", J: "Guarda i trofei", "#": "Guarda il tabellone", V: "Guarda lo stendardo", b: "Guarda la panca", n: "Leggi la bacheca", l: "Guarda la lampada", t: "Guarda il larice", ">": "Verso il Campo Alto", "^": "Sentiero del Fischio", x: "Guarda le casse" },
        areas: [[1, 16, 8, 23, "La Stazione di Cima"], [6, 3, 15, 9, "L'Osteria del Camoscio"], [30, 3, 39, 10, "Il Chalet Neve"], [20, 3, 25, 8, "Il sentiero del Fischio"], [14, 9, 29, 18, "La Piazza dei Camosci"], [30, 11, 42, 16, "La via del Campo Alto"], [1, 24, 42, 27, "Il Parapetto"]],
        hints: (s) => ({
          "La Stazione di Cima": s >= 6 ? "La banchina delle cabine, in BASSO a sinistra. Vica aspetta lì." : "La stazione d'arrivo: banchina, cabine rosse e un ufficio con le tende gialle. Il cavo sale dal Latte e si ferma qui.",
          "L'Osteria del Camoscio": "L'osteria dei Camosci, in ALTO a sinistra: tenda a righe gialle e nere, lavagna del menu e un odore di polenta.",
          "Il Chalet Neve": "Il Chalet del Presidente, in ALTO a destra: terrazza con gli ombrelloni gialli e, sul tetto, l'insegna dello sponsor.",
          "Il sentiero del Fischio": s >= 4 ? "Il sentiero sale in ALTO fino a una baita sulla cresta. Il cancello è aperto." : "Un cancello con una catena e un cartello: «Proprietà privata. Non fischiare».",
          "La Piazza dei Camosci": "La piazza: tabellone dei risultati (3 Coppe) e vetrina dei trofei in ALTO; a EST la via per il campo, a OVEST la stazione.",
          "La via del Campo Alto": "La strada ghiaiosa che porta a EST, al cancello giallo del Campo Alto.",
          "Il Parapetto": "Oltre la ringhiera c'è il Latte, e da qualche parte lì sotto Vallombra. Da qui il mare di nebbia sembra uno spettacolo; da giù, un problema.",
          "Cima Alta": "Cima Alta: millenovecento metri di giallo.",
        }),
        intro: [
          ["voce", "Cima Alta è così alta che il Latte, da qui, sembra una moquette. Il sole batte forte e il paese lo restituisce a tinte fosforescenti: chalet gialli come evidenziatori, tetti verdi, balconi con camosci di legno e bandiere con un camoscio nero che sembra molto sicuro di sé."],
          ["voce", "Ovunque, un'insegna: LUMEN ENERGIE ALPINE · OFFICIAL PARTNER. È sulla stazione, sulla fontana, sulla lavagna del bar. Su un cane, no: il cane ha ancora un po' di dignità."],
        ],
        npcs: (s) => {
          const o = [], ph = PH(), c = compId();
          if (s === 0) o.push({ id: "vl_gisella", at: [21, 13] }, { id: c, at: [7, 22] });
          if (s === 1) o.push({ id: "vl_neve", at: [34, 10] }, { id: "vl_vermiglio", at: [36, 10] }, { id: "vl_sigillo", at: [37, 10] }, { id: c, at: [33, 11] });
          if (s >= 2 && s <= 5) { o.push({ id: c, at: [20, 14] }); if (s <= 4) o.push({ id: "vl_neve", at: [34, 10] }, { id: "vl_vermiglio", at: [36, 10] }, { id: "vl_sigillo", at: [37, 10] }); }
          if (s >= 3 && s <= 5) o.push({ id: "vl_vica", at: [11, 10] });
          if (s >= 2 && s <= 4) o.push({ id: "vl_gisella", at: [24, 12] });
          if (s === 6) o.push({ id: "vl_vica", at: [6, 22] }, { id: c, at: [5, 21] });
          if (s >= 7) o.push({ id: "vl_vica", at: [11, 10] }, { id: "vl_gisella", at: [21, 13] }, { id: c, at: [20, 14] });
          void ph; return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 43, 2, "a"); lay(0, 3, 0, 23, "a"); lay(43, 3, 43, 23, "a");
          lay(1, 3, 42, 23, ":"); lay(1, 3, 5, 12, "s"); lay(40, 3, 42, 11, "s"); lay(14, 9, 29, 18, ",");
          lay(1, 24, 42, 24, "r"); lay(0, 25, 43, 27, "f");
          house(6, 3, 9, 6, { roof: "#2b4a34", wall: "#d6f23a", door: [10, 8, "u"], chim: 2, ox: 1, wood: true, snow: true });
          house(30, 3, 10, 6, { roof: "#2b4a34", wall: "#f2f6ff", door: [34, 8, "w"], ox: 0, snow: true, shut: "#c8422e" });
          house(1, 16, 7, 5, { roof: "#2b4a34", wall: "#d6f23a", door: [4, 20, "v"], snow: true, shut: "#1a1a1a" });
          house(9, 17, 5, 4, { roof: "#46557a", wall: "#d6f23a", snow: true, shut: "#2b4a34" });
          house(33, 17, 6, 5, { roof: "#2b4a34", wall: "#d6f23a", ox: 1, snow: true });
          house(21, 19, 6, 4, { roof: "#2a3550", wall: "#d6f23a", ox: 0, shut: "#1a1a1a" });
          put(3, 23, "k"); put(4, 23, "k"); put(5, 23, "k");
          [[14, 9], [29, 9], [14, 18], [29, 18]].forEach(([x, y]) => put(x, y, "V"));
          lay(16, 9, 19, 9, "#"); put(26, 9, "J"); put(27, 9, "J");
          put(18, 19, "n"); put(16, 13, "b"); put(27, 13, "b"); put(17, 16, "b"); put(26, 16, "b");
          [[14, 13], [29, 13], [13, 22], [31, 22]].forEach(([x, y]) => put(x, y, "l"));
          [[8, 11], [12, 11], [31, 11], [40, 11], [36, 23], [40, 20], [16, 21], [19, 23], [29, 21], [2, 14], [41, 17]].forEach(([x, y]) => put(x, y, "t"));
          put(43, 13, ">"); put(43, 14, ">"); put(22, 2, "^"); put(23, 2, "^");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          plaque(g, "STAZIONE DI CIMA · 1.900 m", X_(4) + 8, Y_(15) + 2); plaque(g, "OSTERIA DEL CAMOSCIO", X_(10.5), Y_(2) + 8); plaque(g, "CHALET NEVE · LUMEN", X_(35), Y_(2) + 8);
          plaque(g, "TABELLONE DELLE COPPE", X_(18) + 8, Y_(8) + 4); plaque(g, "TROFEI", X_(27) + 8, Y_(8) + 4);
          plaque(g, "VIA DEL CAMPO ALTO ▸", X_(37), Y_(11) + 6);
          // il cavo della funivia che arriva dal Latte, in basso a sinistra, e la cabina che scivola
          const x0 = X_(2) - 40, y0 = Y_(27.8), x1 = X_(4.5), y1 = Y_(23) + 3; g.strokeStyle = "#1c2236"; g.lineWidth = 1; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
          const t = ((fr * 0.0014) % 1.4) - 0.1, bx = x0 + (x1 - x0) * t, by = y0 + (y1 - y0) * t;
          if (t > 0 && t < 1 && onScr(bx, by)) { R(g, bx, by, 1, 4, "#1c2236"); R(g, bx - 6, by + 4, 12, 8, "#c8422e"); R(g, bx - 6, by + 4, 12, 2, "#e8704e"); R(g, bx - 4, by + 7, 3, 3, "#ffd98a"); R(g, bx + 1, by + 7, 3, 3, "#ffd98a"); }
          // striscione di benvenuto fra i tetti
          const sx = X_(14) + 8, ex = X_(29) + 8, sy = Y_(8) - 6; if (onScr(sx, sy) || onScr(ex, sy)) { g.strokeStyle = "#2a2f48"; g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo((sx + ex) / 2, sy + 10, ex, sy); g.stroke(); for (let i = 1; i < 12; i++) { const k = i / 12, px_ = sx + (ex - sx) * k, py_ = sy + 10 * 2 * k * (1 - k); g.fillStyle = i % 2 ? "#e4ff3a" : "#1a1a1a"; g.beginPath(); g.moveTo(px_ - 4, py_); g.lineTo(px_ + 4, py_); g.lineTo(px_, py_ + 7); g.fill(); } }
          smoke(g, X_(8) + 8, Y_(3) + 2, fr); smoke(g, X_(36) + 8, Y_(3) + 2, fr + 21);
          if (MOOD < 1) snowfall(g, d); else motes(g, d, 10, "255,230,170");
        },
        top(cx, cy, d) { const g = GP; fogFront(g, cy, 24.4, d.fr); moodTint(g); tileLights(g, cx, cy); eveningLights(g, cx, cy); },
      },

      vl_campoalto: {
        name: "Cima Alta · Il Campo Alto", short: "Il Campo Alto", sub: "Lo stadio dei Camosci, sede del derby", w: 40, h: 26, start: [2, 12], theme: "napoli", bg: "vl_campoalto",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_neve_cap", items: [[3, 21], [37, 21], [12, 23], [22, 23]],
        act: { w: "Guarda lo spogliatoio", m: "Sala Arbitri", U: "Il pallone al centro", "#": "Guarda il tabellone", j: "Guarda la gradinata", b: "Guarda la panchina", T: "Guarda il tavolo", x: "Guarda le casse", "<": "Torna in paese", V: "Guarda lo stendardo", l: "Guarda il faro" },
        areas: [[1, 3, 6, 9, "Lo spogliatoio dei Camosci"], [33, 3, 38, 9, "La Sala Arbitri"], [33, 10, 38, 18, "Il palco dello sponsor"], [2, 13, 6, 18, "La cabina di Radio Nebbia"], [8, 6, 31, 18, "Il prato del Campo Alto"], [7, 5, 32, 19, "La pista"], [8, 3, 31, 4, "Il tabellone"], [8, 20, 31, 22, "La gradinata"], [1, 21, 38, 24, "Dietro la gradinata"]],
        hints: (s) => ({
          "Lo spogliatoio dei Camosci": "Una baracca di legno con la porta gialla. Dentro, ganci, pettorine fluo e un coro che prova da solo.",
          "La Sala Arbitri": "In ALTO a destra: una porta di legno con un cartello «ARBITRI · SI PREGA DI NON FISCHIARE». Si può guardare dentro.",
          "Il palco dello sponsor": "Un palchetto di assi con tavoli, ombrelloni e il logo dello sponsor ripetuto fino alla nausea.",
          "La cabina di Radio Nebbia": "Un tavolo, un microfono grande come un frutto e Noemi, che trasmette in diretta anche i silenzi.",
          "Il prato del Campo Alto": s === 5 ? "Il pallone al CENTRO del prato: toccalo per cominciare (o riprendere) il derby." : "Il prato è rasato con il righello. Cinque Camosci e un gabbiano si riscaldano. Il pallone è al centro.",
          "La pista": "La pista di terra rossa che gira attorno al prato. Sulla panchina dei Camosci (OVEST) qualcuno ha dimenticato un taccuino.",
          "Il tabellone": "Il tabellone, in ALTO: segna CAMOSCI contro OSPITI e, in piccolo, il nome dello sponsor.",
          "La gradinata": "Gradoni gialli e neri. Ottocento posti, di cui seicento già occupati da gente che ha portato la propria sedia.",
          "Dietro la gradinata": "Lo spazio dietro le tribune, pieno di casse, bandiere arrotolate e panini dimenticati.",
          "Il Campo Alto": "Il Campo Alto di Cima Alta.",
        }),
        intro: [
          ["voce", "Il Campo Alto è un prato perfetto: rasato con il righello, tribune giallo fluo, ottocento posti, un tabellone elettronico e, tutto attorno, cartelloni neri con una sola parola gialla: LUMEN."],
          ["voce", "Sull'erba c'è una scritta tracciata con la calce: BENVENUTI OSPITI (NON TROPPO). La calce è fresca; la fiducia, meno."],
        ],
        npcs: (s) => {
          const o = [], ph = PH(), c = compId(), derby = s === 5;
          if (s >= 2) o.push({ id: "vl_noemi", at: [4, 15] });
          if (s === 2 || s === 3 || s === 4) o.push({ id: remoId(), at: [15, 10] }, { id: "vl_tonio", at: [12, 13] }, { id: "vl_zelo", at: [28, 9] }, { id: c, at: [5, 12] });
          if (derby) {
            o.push({ id: "vl_zelo", at: [28, 9] }, { id: "vl_tonio", at: [12, 13] }, { id: c, at: [5, 12] }, { id: "vl_cornelio", at: [8, 21] }, { id: "vl_mirtilla", at: [10, 22] });
            if (ph <= 1) o.push({ id: remoId(), at: [15, 10] }, { id: "vl_gisella", at: [7, 14] });
            o.push({ id: "vl_neve", at: [35, 14] }, { id: "vl_vermiglio", at: [36, 13] }, { id: "vl_sigillo", at: [37, 13] });
            if (ph >= 1 && ph <= 3) o.push({ id: "vl_gaudenzio", at: [9, 3] });
          }
          if (s >= 6) o.push({ id: remoId(), at: [15, 10] }, { id: "vl_tonio", at: [12, 13] }, { id: c, at: [5, 12] });
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 2, "a"); lay(0, 3, 0, 24, "a"); lay(39, 3, 39, 24, "a"); lay(0, 25, 39, 25, "a");
          lay(1, 3, 38, 24, ":"); lay(7, 5, 32, 19, ";"); lay(8, 6, 31, 18, "y");
          lay(9, 4, 30, 4, "j"); lay(9, 20, 30, 20, "j"); lay(34, 10, 38, 17, "=");
          house(1, 3, 5, 6, { roof: "#2b4a34", wall: "#d6f23a", door: [3, 8, "w"], snow: true, shut: "#1a1a1a" });
          house(33, 3, 5, 6, { roof: "#46557a", wall: "#cfd3e6", door: [35, 8, "m"], snow: true, shut: "#6a4a30" });
          lay(17, 3, 20, 3, "#"); put(19, 12, "U");
          lay(3, 14, 4, 14, "T"); put(2, 15, "x"); put(2, 16, "x");
          lay(35, 12, 36, 12, "T"); put(34, 16, "b"); put(38, 16, "b");
          put(6, 10, "b"); put(6, 11, "b"); put(6, 9, "b");
          [[6, 5], [33, 5], [6, 19], [33, 19]].forEach(([x, y]) => put(x, y, "V"));
          [[7, 4], [32, 4], [7, 22], [32, 22]].forEach(([x, y]) => put(x, y, "l"));
          put(0, 12, "<"); put(0, 13, "<");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y, fr = d.fr;
          const x0 = X_(8) + 0.5, y0 = Y_(6) + 0.5, w = 24 * TS - 1, h = 13 * TS - 1;
          if (x0 > -500 && x0 < 500) {
            g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 1; g.strokeRect(x0, y0, w, h); g.beginPath(); g.moveTo(x0 + w / 2, y0); g.lineTo(x0 + w / 2, y0 + h); g.stroke();
            g.beginPath(); g.arc(x0 + w / 2, y0 + h / 2, 26, 0, 7); g.stroke(); g.strokeRect(x0, y0 + 3.5 * TS, 3 * TS, 6 * TS); g.strokeRect(x0 + w - 3 * TS, y0 + 3.5 * TS, 3 * TS, 6 * TS);
            g.strokeStyle = "#e8e8f0"; g.lineWidth = 2; g.strokeRect(x0 - 7, y0 + 5 * TS, 7, 3 * TS); g.strokeRect(x0 + w, y0 + 5 * TS, 7, 3 * TS);
            // cartelloni dello sponsor lungo la linea di fondo, scritta di calce sul prato
            for (let i = 0; i < 8; i++) { const bx = x0 + 6 + i * 48, by = y0 - 6; R(g, bx, by, 44, 5, "#1a1a1a"); R(g, bx, by, 44, 1, "#d6f23a"); }
            g.save(); g.globalAlpha = 0.55; g.fillStyle = "#ffffff"; g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillText("BENVENUTI OSPITI (NON TROPPO)", x0 + w / 2, y0 + h - 10); g.restore(); g.textAlign = "left";
            // coni per lo slalom
            [0, 1, 2, 3, 4].forEach((i) => { const cxx = x0 + 52 + i * 28, cyy = y0 + 28 + ((i % 2) ? 14 : -4) + 20; g.fillStyle = "#ff7a1e"; g.beginPath(); g.moveTo(cxx - 3, cyy + 4); g.lineTo(cxx, cyy - 4); g.lineTo(cxx + 3, cyy + 4); g.fill(); R(g, cxx - 1, cyy - 1, 2, 1, "#ffffff"); });
          }
          plaque(g, "SPOGLIATOIO CAMOSCI", X_(3) + 8, Y_(2) + 6); plaque(g, "SALA ARBITRI", X_(35) + 8, Y_(2) + 6); plaque(g, "PALCO LUMEN", X_(36) + 8, Y_(9) + 6); plaque(g, "RADIO NEBBIA 91,3", X_(3.5), Y_(13) - 2);
          if (MOOD < 1) snowfall(g, d);
        },
        top(cx, cy, d) { const g = GP; fogFront(g, cy, 24.0, d.fr); moodTint(g); tileLights(g, cx, cy); eveningLights(g, cx, cy); },
      },

      vl_baita: {
        name: "Cima Alta · La Baita del Fischio", short: "La Baita del Fischio", sub: "Una cresta, un cannocchiale e ventisei fischietti", w: 30, h: 20, start: [2, 14], theme: "puntanera", bg: "vl_baita",
        item: ["Scheggia di lumina", "Schegge"], itemCos: "vl_baita_cap", items: [[3, 5], [26, 15], [11, 17]],
        act: { m: "Guarda la porta", "%": "Guarda col cannocchiale", x: "Guarda la legna", b: "Guarda la panca", t: "Guarda il larice", "<": "Torna a Cima Alta", l: "Guarda la lampada" },
        areas: [[16, 3, 24, 11, "La baita"], [25, 6, 28, 10, "Il belvedere"], [4, 8, 9, 12, "Il laghetto gelato"], [1, 13, 15, 16, "Il sentiero"], [1, 3, 28, 18, "La cresta"]],
        hints: (s) => ({
          "La baita": s >= 4 ? "Una baita di tronchi con il camino acceso. Sul portico, davanti alla porta, c'è un uomo con gli occhiali da sole. Parlagli." : "Una baita di tronchi, chiusa.",
          "Il belvedere": "Un cannocchiale su treppiede, puntato verso il Campo Alto: da qui si vede ogni gradone, ogni panchina, ogni volto.",
          "Il laghetto gelato": "Un laghetto ghiacciato. Qualcuno ha scritto sul ghiaccio, a passi, un solo numero: 26.",
          "Il sentiero": "Il sentiero torna a Cima Alta, a OVEST. Il cancello è in fondo a sinistra.",
          "La cresta": "La cresta, a milleottocento e rotti metri, con il vento che fischia da solo (corto, lungo, corto).",
          "La Baita del Fischio": "La baita di Gaudenzio.",
        }),
        intro: [
          ["voce", "Il sentiero del Fischio sale a tornanti fra i larici, un cartello ogni cento metri: «PROPRIETÀ PRIVATA», «NON FISCHIARE», «NON FISCHIARE, GRAZIE», «SE FISCHI TI SENTE». In cima, sulla cresta, una baita di tronchi con il camino acceso."],
          ["voce", "Il vento qui fischia da solo, e lo fa in codice: corto, lungo, corto."],
        ],
        npcs: (s) => (s >= 4 && s <= 5 ? [{ id: "vl_gaudenzio", at: [20, 11] }, { id: compId(), at: [14, 14] }] : s >= 6 ? [{ id: "vl_gaudenzio", at: [20, 11] }] : []),
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 19, "a"); lay(1, 3, 28, 18, "s"); lay(1, 13, 15, 16, ":"); lay(14, 10, 22, 12, ":"); lay(4, 8, 9, 12, "I"); lay(25, 6, 28, 10, ":");
          house(16, 3, 9, 7, { roof: "#5a3a22", wall: "#8a6238", door: [20, 9, "m"], chim: 6, wood: true, snow: true, ox: 1 });
          put(15, 11, "x"); put(15, 12, "x"); put(19, 11, "b"); put(26, 8, "%");
          [[2, 4], [13, 6], [27, 4], [24, 14], [7, 16], [18, 17], [5, 6], [11, 9], [22, 17], [3, 11]].forEach(([x, y]) => put(x, y, "t"));
          put(13, 14, "l"); put(0, 14, "<"); put(0, 15, "<");
        },
        decor(cx, cy, d) {
          const g = GP, X_ = d.X, Y_ = d.Y;
          plaque(g, "BAITA DEL FISCHIO", X_(20.5), Y_(2) + 8); plaque(g, "26", X_(6.5) + 8, Y_(10) + 4);
          snowfall(g, d);
        },
        top(cx, cy, d) { const g = GP; moodTint(g); tileLights(g, cx, cy); const gr = g.createRadialGradient(160, 100, 60, 160, 100, 200); gr.addColorStop(0, "rgba(10,10,30,0)"); gr.addColorStop(1, "rgba(10,10,30,.28)"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200); },
      },
    };


    // ---- ritocchi alle zone dei capitoli precedenti (attivi quando il capitolo 5 è sbloccato)
    const CAMOSCI = ["vl_remo", "vl_remo_ns", "vl_tonio", "vl_gisella"];
    ["vl_paese", "vl_campo", "vl_discesa", "vl_latte", "vl_spogliatoi", "vl_miniera"].forEach((zid) => {
      X.patch(zid, N, {
        npcs: (list) => list.filter((n) => !CAMOSCI.includes(n.id) && !(n.id === "vl_vica")),
        hints: zid === "vl_paese" ? () => ({ "La Stazione Alta": "La cabina rossa, in BASSO a sinistra: da qui si sale a Cima Alta. Guardala e scegli «Sali a Cima Alta»." }) : undefined,
      });
    });
    X.patch("vl_paese", N, { act: { k: "Cabina per Cima Alta" } });

    // ================= scene
    const cornelioT = () => F.get("cornelio_t", "silenzio");

    // ---- Gisella: l'accredito
    function gisella() {
      if (!inC()) return delegate("vl_gisella");
      const s = S(), z = zoneNow();
      if (s === 0 && z === "vl_cimaalta") return gisellaArrivo();
      const L = s >= 7 ? ["Lo striscione NON TOCCATE LA CABINA è pronto. Manca soltanto una parola: «giusto». La stiamo discutendo da tre ore.", "Ho consegnato a Tonio il thermos e a Remo un panino. A Remo il panino l'ha portato nostra madre, ma io lo scrivo lo stesso a mio nome."]
        : z === "vl_campoalto" ? ["I nonni scortatori sono sei. Il più veloce fa quindici metri al minuto. È considerato un atleta.", "La regola del Campo Alto dice che l'ospite non paga. L'ospite, però, consuma: il lampione è offerto dallo sponsor, il buio è a pagamento."]
          : ["Tifo Camosci anche quando perdiamo. Soprattutto quando perdiamo: è lì che si vede il carattere e si sente il coro.", "Il Presidente dice «benvenuto» tre volte al giorno. Lo ha registrato: lo fa suonare dal citofono quando è in bagno."];
      say(sw([["vl_gisella", chip(L)]], bgHere()), done);
    }
    function gisellaArrivo() {
      const k = F.get("remo", 1), bet = has("remo_bet") && has("m1_win"), c = compId();
      say(sw([
        ["voce", "Al centro della piazza, sotto il tabellone dei risultati, Gisella Cima è in piedi su una cassetta della frutta con un megafono e una pettorina gialla con scritto STEWARD (CAMOSCIO). Dietro di lei, appeso a due pali, uno striscione dipinto a mano: BENVENUTI OSPITI (NON TROPPO)."],
        ["vl_gisella", "BENVENUTI A CIMA ALTA! (al megafono, a un metro da te) Siete a milleottocento metri, quattrocentodieci abitanti, tre Coppe in fila e un solo bar con la licenza per il camoscio. Nel panino il camoscio non c'è, c'è il nome. Ci hanno consigliato di non indagare."],
        [c, isB() ? "Gialli. Tutti gialli. Un colore da segnale di pericolo: sarà un caso." : "Giallo fluo: nel colore, sarebbe zolfo. Tossico, ma visibile. Sarà una scelta di marketing."],
        ["vl_gisella", "Questo è il vostro accredito: «OSPITE (NON PAGANTE)». Va portato al collo. Chi non lo porta viene scortato fuori piazza da un nonno. Ne abbiamo sei, sono gentilissimi e lentissimi: un'evasione costa ore."],
        ["vl_gisella", "Programma: oggi, Vigilia. Domani, Vigilia della Vigilia. Sabato, derby. Prima, però, il Presidente Neve vuole darvi il benvenuto. Dice sempre «benvenuto» prima di dire «no». Il Chalet è in alto a destra, sotto l'insegna che non potete non vedere."],
        ["vl_gisella", k === 3 && !remoHelps() ? "Remo non ha voluto riceverti. Dice che ti riceve in campo. Gli piace il dramma, e lo sa gestire." : bet ? "Remo vi aspetta al Campo Alto senza occhiali, quindi è di cattivo umore. Un umore con la luce, per una volta." : "Remo è al campo ad allenarsi. Dice che è per preparare il derby. In realtà è per non stare in piazza: ha ricevuto tre telefonate della mamma, una al minuto."],
        tl({ sicuro: "Allora andiamo dal Presidente. Con calma e a testa alta.", attento: "Tre telefonate in un minuto. Annoto: qui c'è qualcosa di cui non si parla.", ironico: "Un benvenuto che precede un no: abbiamo già passato una dogana più sincera." }),
      ], BG.C), () => { setStep(N, 1); note("Cima Alta, giovedì: il Presidente Neve ci aspetta al Chalet (ALTO a destra). Il derby è sabato, arbitro designato dallo sponsor Lumen."); done(); });
    }

    // ---- il Chalet: Neve, Zelo, Vermiglio e (forse) la cena
    function neve() {
      if (!inC()) return delegate("vl_neve");
      const s = S();
      if (s === 1) return neveScena();
      if (zoneNow() === "vl_campoalto") return neveDerby();
      const L = s >= 7 ? ["Il bilancio della giornata: un derby, due colpi di scena e una cassa del bar vuota. Direi in pareggio.", "Presidente, sì. Ma da oggi anche garante. Mi sono preso un incarico che non so ancora scrivere."]
        : ["Benvenuti, benvenuti, benvenuti. Se vi manca qualcosa, non venite da me: mi mancherebbe qualcosa anch'io.", "La neve di quest'anno è a pagamento. Quella dell'anno prossimo è già in prelazione."];
      say(sw([["vl_neve", chip(L)]], bgHere()), done);
    }
    function neveScena() {
      const pr = F.get("prove", "tenute"), rad = pr === "radio", ag = pr === "agata";
      say(sw([
        ["voce", "Il Chalet Neve ha una terrazza con gli ombrelloni gialli, un'insegna a neon (LUMEN ENERGIE ALPINE · OFFICIAL PARTNER) e uno zerbino con scritto «WELCOME (CON RISERVA)». Un uomo con un sorriso a trentadue denti, venti dei quali suoi, ti viene incontro a braccia aperte."],
        ["vl_neve", "BENVENUTI! Ruggero Neve: presidente dei Camosci, albergatore, allenatore delle giovanili e, il giovedì, parroco supplente. Vendo neve. Anzi: la affitto, con opzione di riscatto a primavera."],
        ["vl_neve", "Il derby, dunque! Due tempi da quarantacinque, campo mio, regole mie e arbitro designato dallo sponsor, «per garantire regolarità e buonumore». È la Regola del Campo Alto: vecchia di ventisei anni, quindi antica."],
        ["voce", "A un tavolino in disparte, un uomo in tuta rosa fluo con un fischietto cromato al collo si alza, si inchina e fischia: un colpo secco. Un cameriere ha un sussulto, un gabbiano si sposta di tre metri."],
        ["vl_neve", "Vitaliano Zelo! Livello quattro. Ha ammonito un gabbiano, a luglio. Un professionista: il gabbiano non ha protestato."],
        ["vl_zelo", "Il regolamento dice: ammonire chi sbaglia. Io lo applico con rigore e con un certo senso del ritmo. Qui ho un metodo: chi viene da fuori sbaglia di più."],
        ["voce", "Al tavolo accanto, con il giornale aperto e i guanti bianchi posati sul bordo come un secondo paio di mani, l'ingegner Vermiglio. L'avvocata Sigillo gli versa un bicchiere d'acqua. Il vino non lo beve: «il vino parla, l'acqua ascolta»."],
        ...(rad ? [["vl_vermiglio", "Ho sentito la radio, ieri. Un nome letto ad alta voce davanti a mezza valle: coraggio da dilettanti, sempre ammirevole. La Società ha già dato mandato agli avvocati. Ma sono qui per il calcio, {n}: una Coppa non si querela."], ["vl_neve", "(il sorriso perde quattro denti tutti insieme) Cima Alta ha ascoltato la radio. È un paese molto sensibile alle accuse. Specie alle accuse sulle persone di Cima Alta."]]
          : ag ? [["vl_vermiglio", "La dottoressa Sassi, mi dicono, ha depositato dei documenti presso un notaio milanese. Trenta giorni e un po' di pazienza reciproca. La Società è paziente per natura e per bilancio. Nel frattempo, il derby: una cortesia fra vicini."], ["vl_sigillo", "Le cortesie, ingegnere, hanno sempre un costo. Segno."]]
            : [["vl_vermiglio", "Il derby, {n}. Sono un uomo semplice: mi piace sapere come finisce una cosa prima che cominci. In un ingegnere è un difetto professionale."], ["vl_sigillo", "Per ora non segno niente. È un segno di rispetto."]]),
        ["vl_vermiglio", "Sono lo sponsor, non l'arbitro: la differenza è un tratto di penna. Ma mi piace pensare che una Coppa sia una cosa seria, e che una cosa seria meriti qualcuno di serio a fischiarla. Il signor Zelo lo è."],
      ], BG.C), () => ask("voce", "Neve ti guarda con un sorriso che aspetta, Zelo con un fischietto che aspetta, Vermiglio con una calma che ha già aspettato. Cosa rispondi?", [
        { label: "«Un arbitro designato dallo sponsor? Non è la regola di nessuno.»", sub: "Protesti", fn: () => neveR("protesta") },
        { label: "«Va benissimo. Basta che fischi giusto.»", sub: "Ironico", fn: () => neveR("ironia") },
        { label: "«Gioco dove mi mettete. Il campo è uguale per tutti.»", sub: "Sportivo", fn: () => neveR("sport") },
      ], BG.C));
    }
    function neveR(w) {
      F.set("neve_t", w);
      const a = w === "protesta" ? [["vl_neve", "(il sorriso resta, ma tiene una mano sul portafoglio) Protesta accolta e archiviata. Il regolamento prevede il diritto di lamentarsi, ma entro il fischio d'inizio. Dopo si sconta in ammonizione."]]
        : w === "ironia" ? [["vl_zelo", "Giusto è un avverbio. Io preferisco i verbi: fischio, ammonisco, espello."], ["vl_neve", "Bravo, bravo! Mi piace chi ride del regolamento. Ride bene chi ride ultimo, ma il regolamento ride per ultimo e con più voce."]]
          : [["vl_neve", "Ecco uno sportivo! Gioco dove mi mettete: magari lo mettessero nei cartelli all'ingresso. Ho già ordinato la targa."]];
      const c = compId();
      say(sw([...a,
        [c, isB() ? "Un arbitro dello sponsor, uno sponsor dei guanti. Questa partita ha più cinghie che bulloni." : "Un arbitro dello sponsor. Conflitto d'interessi: nel mio mestiere lo si risolve con un terzo perito. Qui il terzo è il vento."],
      ], BG.C), () => (pr() === "tenute" ? cenaInvito() : neveFine()));
      function pr() { return F.get("prove", "tenute"); }
    }
    function cenaInvito() {
      say(sw([
        ["vl_vermiglio", "Un'ultima cosa. Stasera, alle venti, nel salottino privato del Chalet, cenerò da solo: mi dicono che sia una cattiva abitudine. Sarei lieto di averla ospite. Sono un uomo che parla meglio a tavola. Porti l'appetito e (non guarda la tasca, ma la tasca sente) quello che ha con sé."],
        ["voce", "Ricordi la frase di Teodora, sul registro: «Dicono che stasera qualcuno dovrà andare a una cena. Non andare.»"],
      ], BG.C), () => ask("voce", "L'invito è cortese e preciso come un conto.", [
        { label: "«Non verrò. Non mangio con chi parla con i guanti.»", sub: "Rifiuti", fn: () => cena("no") },
        { label: "«Verrò. Per ascoltare, non per firmare.»", sub: "Vai alla cena", fn: () => cena("ascolto") },
      ], BG.C));
    }
    function cena(w) {
      F.set("cena", w);
      if (w === "no") {
        return say(sw([
          ["vl_vermiglio", "(si rimette il guanto con un gesto di rammarico professionale) Capisco. La tavola, qui, è apparecchiata per due: se cambia idea, la cena è fredda ma l'offerta no."],
          [compId(), "Hai fatto bene a non andare. Un ingegnere che apparecchia è un ingegnere che costruisce."],
        ], BG.C), neveFine);
      }
      say(sw([
        ["voce", "Il salottino privato del Chalet ha un camino acceso, un tavolo per due e una lampada con il paralume a forma di camoscio. Vermiglio ti versa un bicchiere d'acqua, con i guanti, e il tuo si guarda nel suo come due cose che sanno di essere uguali."],
        ["vl_vermiglio", "Sono fiero della Società Lumen. Un club è una macchina per far credere a mille persone che il tempo si possa fermare. Io faccio lo stesso con i cantieri: la differenza è che io mi faccio pagare."],
        ["vl_vermiglio", "Una fondazione per gli Stambecchi: campo nuovo a Vallombra, luci, tetto, spogliatoi con l'acqua calda, settecentomila. In cambio i fascicoli del IV cassetto restano dove stanno, e la miniera si chiude con grazia. Con una cerimonia, un nastro e un panino."],
        ["vl_vermiglio", "Non siamo mostri. Per ventisei anni abbiamo mantenuto persone che altrimenti avrebbero sofferto da sole: una madre, per dirne una, e il suo ragazzo, con una squadra e due Coppe regalate. La riconoscenza è un contratto che nessuno firma e tutti rispettano."],
        ["voce", "Non fa nomi. Non ne ha bisogno: ti guarda come chi ha messo una moneta in un buco e sente già il tintinnio."],
      ], "vl_interno"), () => ask("voce", "Il camino scoppietta. Sigillo, in piedi, segna qualcosa con una stilografica. Cosa rispondi?", [
        { label: "«No. Una squadra non si compra: si costruisce.»", sub: "Rifiuti a tavola", fn: () => cenaR("rifiuto") },
        { label: "«Mi dia tempo fino a sabato.»", sub: "Prendi tempo", fn: () => cenaR("tempo") },
      ], "vl_interno"));
    }
    function cenaR(w) {
      F.set("cena_t", w);
      say(sw([
        w === "rifiuto" ? ["vl_vermiglio", "Una risposta nobile e scomoda. La nobiltà, a tavola, è un piatto che si raffredda subito."] : ["vl_vermiglio", "Tempo. L'unica cosa che le sto offrendo gratis, ed è la sola che a Vallombra vale ancora qualcosa."],
        ["vl_vermiglio", "Sabato, dopo la partita, la sua risposta mi arriverà in campo, senza bisogno di parole. Buonanotte, {n}."],
        ["voce", "Esci nel freddo con la sensazione di aver mangiato poco e capito troppo. «Una madre e il suo ragazzo, con una squadra.» Chi?"],
      ], "vl_interno"), () => { note("A cena Vermiglio ha offerto 700.000 per gli Stambecchi: ha detto che la Società mantiene da 26 anni 'una madre e il suo ragazzo, con una squadra'. Chi?"); neveFine(); });
    }
    function neveFine() {
      note("Cima Alta: il derby è sabato, con la Regola del Campo Alto (arbitro Zelo, designato dallo sponsor). Remo è al Campo Alto, a EST.");
      setStep(N, 2); done();
    }
    function neveDerby() {
      const s = S(), ph = PH();
      if (s === 5 && ph === 0) {
        const pr = F.get("prove", "tenute");
        return say(sw([["vl_neve", pr === "radio" ? "Qui a Cima Alta la radio la ascoltiamo, la capiamo e la mettiamo in cornice. Non ci piace che la si usi per dare lezioni di morale. Giochiamo, giochiamo: a fine partita ci stringeremo la mano, a Dio piacendo."
          : chip(["Un ottimo derby, un ottimo derby! Tutti vogliono bene a tutti, soprattutto ai biglietti venduti.", "Ho fatto stampare i programmi: la formazione degli ospiti è in corpo sei. Giusto per non farla pesare."])]], BG.A), done);
      }
      say(sw([["vl_neve", chip(["Vede com'è bello il Campo Alto? Quel verde non è naturale: è sponsorizzato.", "Mi scusi: ho un'emozione. Non so ancora quale."])]], BG.A), done);
    }
    function vermigliot() {
      if (!inC()) return delegate("vl_vermiglio");
      const s = S();
      if (s === 1) return neveScena();
      say(sw([["vl_vermiglio", chip(s === 5 ? ["Il campo è stato lisciato come un foglio. Mi piace pensare che anche il risultato lo sia.", "Un derby è una questione di equilibrio: pesi che si compensano, forze che si annullano. È la mia filosofia anche per le demolizioni."] : ["Il tempo, {n}, è l'unica cosa che un archivio possieda in abbondanza. Lo usi bene.", "Non mi trovo male qui. Il silenzio, a Cima Alta, è acquistato e rilegato."])]], bgHere()), done);
    }
    function sigillot() {
      if (!inC()) return delegate("vl_sigillo");
      if (S() === 1) return neveScena();
      say(sw([["vl_sigillo", chip(["Cinque minuti d'anticipo sull'orologio, e dodici sulla vostra pazienza. È una politica aziendale.", "Ho le firme di tre persone, un timbro e un'opinione. Segno l'opinione per ultima."])]], bgHere()), done);
    }

    // ---- Remo al Campo Alto
    function remoOpening() {
      const k = F.get("remo", 1), id = remoId(), ns = id === "vl_remo_ns";
      if (k === 3 && !remoHelps()) return [[id, "Il turista che fa ombra. Ti aspettavo con un comitato di benvenuto: ho mandato i nonni. Hanno fatto cinque metri e sono già stanchi."], ["voce", ns ? "Ha il volto nudo e, a giudicare dalle occhiate, la cosa lo infastidisce parecchio." : "Gli occhiali da sole, come sempre, sembrano chiedere scusa a nessuno."]];
      if (ns) return [[id, "Eccolo. Vedi? Niente occhiali. Mi sento nudo e osservato: colpa tua. Il campo di casa mi guarda come un parente che arriva senza telefonare."]];
      if (remoHelps()) return [[id, "Hai visto, sul Campo Alto non c'è nemmeno un filo di Latte. Nessuno ti tiene la corda, qui. (gli scappa una smorfia) Tranquillo: la terrò io. In campo, di solito, si tiene la palla."]];
      return [[id, "Ecco il nuovo. Ti ha dato il benvenuto Neve? Quando dice «benvenuto», controlla il portafoglio. Di solito è già vuoto."]];
    }
    function remo() {
      if (!inC()) return remoT();
      const s = S(), z = zoneNow(), id = remoId(), k = F.get("remo", 1);
      F.set("remo_met", true);
      if (z === "vl_campoalto" && s === 2) return remoCampo();
      if (z === "vl_campoalto" && s === 5 && PH() === 0) return remoPre();
      const o = [];
      if (z === "vl_campoalto" && s >= 3) o.push({ label: "Sfida allo slalom", sub: has("slalom_ok") ? "Rigiocalo, per orgoglio" : "Tre passaggi fra i coni", fn: slalom });
      o.push({ label: "Parla con Remo", fn: () => say(sw([[id, chip(remoLines(s, k))]], bgHere()), done) });
      ask(id, s >= 7 ? "«Ti aspettavo. O meglio: non sapevo di aspettare, ma ti aspettavo.»" : "«Mi fai fare un tiro? Ma uno solo, che poi mi sento in obbligo.»", o, bgHere());
    }
    function remoLines(s, k) {
      const sc = F.get("remo_scelta", "");
      if (s >= 7) return sc === "verita" || sc === "due" ? ["Mio padre fischia. Dico per dire: non fischia, ha un modo di respirare con due note. È una cosa che si impara in ventisei anni e quaranta minuti.", "Ho ancora i suoi occhiali. Li porto in testa, come un cappello. Se mi guardano male dico che è moda.", "A Vica ho detto: «Anche tu mi dovevi qualcosa.» Ha risposto: «Il panino. E te l'ho dato ogni giorno.»"] : sc === "padre" ? ["Non parliamone. Giochiamo. Tre Coppe sono tre Coppe.", "Mi hai fatto un favore e un danno. Il danno ancora non lo so calcolare."] : ["Mia madre mi ha parlato a lungo. Io ho ascoltato a lungo. Il resto lo faremo a pezzi, un pezzo a domenica.", "C'è un uomo, in cima al sentiero, che porta i miei occhiali. Non gli ho ancora detto niente. Anzi: forse sì."];
      if (s === 5) return ["Prima della partita non parlo: respiro. Dopo, parlo per due.", "Zelo oggi ha gli occhi lucidi. Non è emozione: è il rosa fluo che gli dà alla retina."];
      return k === 3 && !remoHelps() ? ["Non farti illusioni: abbiamo tre Coppe in bacheca e un quarto posto in programma.", "Non sono tuo amico. Ma se ti serve un posto dove stare, in piazza ce n'è uno senza sponsor."] : ["Il Campo Alto è il campo di casa. È facile giocare in casa: il pubblico è tuo, il vento è tuo, la sfortuna è dell'ospite.", "Dopo il derby ti offro una polenta. Poi, se vinci, ti offro una seconda polenta. Se perdi, te ne offro tre."];
    }
    function remoCampo() {
      const id = remoId(), k = F.get("remo", 1), c = compId();
      say(sw([
        ["voce", "Remo palleggia da solo al centro del campo, con la maglia gialla fluo dei Camosci e la faccia di uno che non dorme bene da due notti. Tonio, in porta, sembra una porta più piccola."],
        ...remoOpening(),
        [id, "Ascolta. Quella cosa alla radio. Il nome. Ho sentito «Fischietti, Gaudenzio». Ho sentito «residente a Cima Alta». Poi Noemi ha parlato di meteo e io sono rimasto lì, con un panino in mano, a chiedermi perché mi fosse venuto da deglutire."],
        [id, "Qui a Cima Alta nessuno si chiama Fischietti. Ho chiesto in giro: tutti hanno cambiato argomento, persino il parroco, che è Neve, ed è un record, perché Neve cambia argomento molto più spesso che parrocchia."],
        [id, "Mia madre tiene l'Osteria, in alto a sinistra. Con me da stamattina risponde a monosillabi. Con gli ospiti no: dice che gli ospiti non possono ricattarla con il «dimmi cos'hai». Parlale tu. A me dà la minestra, a te può dare una risposta."],
        [c, isB() ? "«Presso V. Valanga.» Ce l'ho sulla punta delle chiavi inglesi. Non è un nome comune: è un nome di famiglia." : "«Presso V. Valanga.» Una V e un cognome. Nel mio mestiere, un'iniziale è già un indizio. Due sono una confessione."],
      ], BG.A), () => ask("voce", "Remo ti guarda con gli occhi di chi si prepara a una domanda e ne teme la risposta. Sulla ricevuta del referto c'era scritto «presso V. Valanga». Glielo dici?", [
        { label: "Gli dici della ricevuta", sub: "«Presso V. Valanga, Cima Alta»", cls: "hot", fn: () => remoR(true) },
        { label: "Non ancora", sub: "Prima parli con sua madre", fn: () => remoR(false) },
      ], BG.A));
      void k;
    }
    function remoR(told) {
      const id = remoId();
      F.set("remo_ric", told);
      const a = told ? [[id, "…«V. Valanga». (si siede sul pallone; è la prima volta che lo vedi seduto) Mia madre si chiama Ludovica. Ma Valanga a Cima Alta è come Rossi: ce ne sono quattro famiglie, due cugini e una zia di troppo."], ["voce", "Lo dice in fretta, come chi fischietta nel buio. Poi si alza, con un sorriso che non regge."], [id, "Non adesso. Ho una partita da vincere: se corro da mia madre adesso, la perdo comunque. Ma ti ringrazio. Non so ancora di cosa."]]
        : [[id, "Allora vai tu. Io ho un gabbiano da dribblare e una squadra da convincere che non si vince con le parole. (guarda altrove) Si vince con gli occhiali. O senza."]];
      say(sw([...a, ["voce", "Remo si riprende il pallone e lo rimette in gioco con un colpo secco. «Se ti va, prima o poi, sfidami allo slalom: i coni sono lì e io sono più lento di come dico.»"]], BG.A), () => {
        note(told ? "Ho detto a Remo della ricevuta 'presso V. Valanga'. L'ha presa male, in fretta. Sua madre tiene l'Osteria (ALTO a sinistra)." : "Remo non sa della ricevuta. Sua madre Vica tiene l'Osteria (ALTO a sinistra), mi ha detto di parlarle io.");
        setStep(N, 3); done();
      });
    }
    function remoPre() {
      const id = remoId(), sc = F.get("remo_ric", false);
      say(sw([
        [id, has("slalom_ok") ? "Mi hai battuto sullo slalom: non farti idee. Oggi non c'è nessun cono." : "Oggi niente chiacchiere. Mi sento come davanti al dentista: posso fare l'eroe, ma ho paura."],
        ...(sc ? [[id, "E smettila di guardarmi come se dovessi dirmi qualcosa. Lo so che devi dirmi qualcosa. Dopo il fischio."]] : []),
        ["voce", "Remo calcia il pallone in alto e lo riprende col petto, in quel modo che i professionisti chiamano «controllo» e i tifosi «un colpo di fortuna con stile»."],
      ], BG.A), done);
    }
    function remoT() { delegate(remoId()); }

    // ---- lo slalom (prova a tempismo, facoltativa)
    function slalom() {
      const id = remoId(), f = F.get("slalom_f", 0), need = Math.max(3, 5 - f), first = !has("slalom_met");
      F.set("slalom_met", true);
      const go_ = () => {
        const tm = X.timing;
        const fallback = (label, rounds, bg, react, fin) => { const pts = []; const next = () => { if (pts.length >= rounds) return fin(pts); ask("voce", `${esc(label)} · passaggio ${pts.length + 1} di ${rounds}: scegli il momento.`, [1, 2, 3].map((k) => ({ label: ["Subito", "Un attimo", "Adesso"][k - 1], fn: () => { const n = Math.random() < 0.34 ? 3 : Math.random() < 0.6 ? 2 : 1; pts.push(n); say([["voce", react(n)]], next); } })), bg); }; next(); };
        (typeof tm === "function" ? tm : fallback)("Slalom", 3, "night", (k) => k === 3 ? "<b>Pulito!</b> Il cono ondeggia ma resta in piedi. Remo fischietta tra i denti." : k === 2 ? "<b>Sfiorato.</b> Il cono tossisce e si rimette dritto." : "<b>Giù.</b> Il cono rotola via con la dignità di un camoscio.", (pts) => {
          const tot = pts.reduce((a, b) => a + b, 0);
          if (tot >= need) {
            F.set("slalom_ok", true); const m = reward("vl_c5_slalom", { coins: 8 });
            return say(sw([["voce", `Slalom: ${tot} su 9${m.length ? " · " + m.join(" · ") : ""}.`], [id, chip(["Mi hai battuto a casa mia, sui miei coni, con le mie mutande. (si accorge di cosa ha detto) Colori. Con i miei colori.", "Non è stato un caso. Non è stato nemmeno un favore. È stato un sorpasso. Mi fa male dirlo: complimenti."])]], BG.A), done);
          }
          F.add("slalom_f", 1);
          say(sw([["voce", `Slalom: ${tot} su 9 (ne servivano ${need}).`], [id, chip(["Sei veloce, ma i coni sono permalosi. Riprova: la seconda volta è la più educata.", "Non è una brutta prova. È una prova cortese. E la cortesia, sui coni, si paga."])]], BG.A), () => ask("voce", "Riprovi?", [{ label: "Riprova lo slalom", cls: "hot", sub: "Il tempismo diventa più indulgente", fn: slalom }, { label: "Non adesso", fn: done }], BG.A));
        });
      };
      say(sw([[id, first ? "Lo slalom dei Camosci: cinque coni, tre passaggi. Il primo è veloce, il secondo è più veloce, il terzo è un'opinione. Fermi la barra nella zona verde e il pallone fa il resto. Se mi tieni il passo, ti offro una polenta. Anche se perdi, ma più piccola." : "Tre passaggi: stessa barra, stessi coni. Ti restano le gambe?"]], BG.A), go_);
    }

    // ---- indizi sull'arbitro (A: vetrina dei trofei, B: Sala Arbitri, C: taccuino di Zelo)
    function clueA() {
      const first = !has("cl5_a"); F.set("cl5_a", true);
      const c = compId();
      say(sw([
        ["voce", "La vetrina dei trofei di Cima Alta contiene tre Coppe dei Tre Versanti e un piedistallo vuoto con la scritta «PER LA QUARTA». Sotto ogni coppa, una targhetta d'ottone con l'anno e il nome dell'arbitro."],
        ["voce", "«ARBITRO: V. ZELO · DESIGNATO DA: LUMEN SERVIZI SPORTIVI.» Tre targhette. Tre volte lo stesso nome, lo stesso designatore e la stessa grafia a pennino: tondo, di scuola, con un gancio sulla V."],
        ...(first ? [[c, isB() ? "Tre Coppe vinte con lo stesso arbitro e lo stesso sponsor. A un meccanico, questo ricorda una cinghia che gira sempre dallo stesso lato." : "Una serie di tre con la stessa variabile esplicativa: nel mio mestiere sarebbe un campione non randomizzato. Lo annoto."]] : []),
      ], BG.C), () => { note("Le tre Coppe di Cima Alta: stesso arbitro (V. Zelo), stesso designatore (Lumen Servizi Sportivi). Prova A."); toast(`Prove sull'arbitro: ${proofs()} su 3`); done(); });
    }
    function clueB() {
      const s = S();
      if (s < 2) return say(sw([["voce", "La Sala Arbitri è chiusa a chiave. Quando parlerai con Remo, forse qualcuno ti darà il permesso di entrare."]], BG.A), done);
      const first = !has("cl5_b"); F.set("cl5_b", true);
      const c = compId();
      say(sw([
        ["voce", "La Sala Arbitri: un attaccapanni, una brandina, una cesta di fischietti cromati e, sul tavolino, una cartellina con la scritta «LUMEN SERVIZI SPORTIVI · DESIGNAZIONI RISERVATE»."],
        ["voce", "Dentro, un foglio: «DERBY CIMA ALTA – VALLOMBRA · Esito indicativo: 2–1 CAMOSCI · Cartellini: 3 alla squadra ospite, 0 ai locali · Minuto consigliato per il rigore: 71'». In calce, a penna e in tondo di scuola: «Cordialità, L.V.»"],
        ...(first ? [[c, isB() ? "«Minuto consigliato.» Questo non è un arbitro: è un orologio con la tuta rosa." : "«Esito indicativo.» Nel mio mestiere si chiamerebbe una previsione. Nel loro, una prenotazione."]] : []),
      ], BG.A), () => { note("Sala Arbitri: designazione riservata 'esito indicativo 2–1 Camosci, 3 cartellini agli ospiti, rigore consigliato al 71'', firmata L.V. Prova B."); toast(`Prove sull'arbitro: ${proofs()} su 3`); done(); });
    }
    function clueC({ tx, ty }) {
      if (!(tx === 6 && ty === 10)) return say(sw([["voce", chip(["La panchina dei Camosci: un lungo asse di legno con i nomi incisi dei titolari. In fondo, un nome grattato via e riscritto tre volte.", "Una panchina con un cuscino per il Presidente e un cartello: «NON CAMBIARE GLI ARBITRI SUL RISCALDAMENTO»."])]], BG.A), done);
      const first = !has("cl5_c"); F.set("cl5_c", true);
      const c = compId();
      say(sw([
        ["voce", "Sull'asse, infilato sotto un cuscino con il camoscio ricamato, c'è un taccuino a spirale con una copertina rosa fluo e una penna cromata legata al filo. Sul frontespizio: «V. ZELO · PROMEMORIA TECNICO»."],
        ["voce", "Pagina uno: «Ammonire per primo il 9 ospite. Al 12'. Anche se non ha fatto niente: è un numero che porta sfortuna.» Pagina due: «Dopo i 60 minuti il fischio deve diventare corto. Se l'ospite protesta, giallo. Se ride, giallo e mezzo.»"],
        ...(first ? [[c, isB() ? "«Giallo e mezzo.» Neanche un tornio ha mai inventato un numero così." : "«Giallo e mezzo.» Nel mio rapporto lo chiamerei «arbitrio». Un po' lessicale, un po' giuridico."]] : []),
      ], BG.A), () => { note("Il taccuino di Zelo: 'ammonire per primo il 9 ospite al 12'', 'giallo e mezzo se ride'. Prova C."); toast(`Prove sull'arbitro: ${proofs()} su 3`); done(); });
    }
    function zelo() {
      if (!inC()) return done();
      const s = S(), ph = PH();
      if (s === 5 && ph === 0 && proofs() >= 2 && !has("zelo_sa")) {
        return ask("vl_zelo", "«Che c'è? Se avete qualcosa da dire, lo dite al Presidente. Se avete qualcosa da fischiare, sapete dove trovarmi.»", [
          { label: "Mostragli le prove", sub: `Ne hai ${proofs()} su 3: cartellina, targhette, taccuino`, cls: "hot", fn: zeloSa },
          { label: "Lascia perdere", fn: () => say(sw([["vl_zelo", "Allora fischio. È un buon sistema: chi lo ascolta, lo capisce."]], BG.A), done) },
        ], BG.A);
      }
      const L = has("zelo_sa") ? ["(sudando) Il regolamento prevede il diritto di sbagliare, no? Ecco. Io lo uso con parsimonia.", "Mi hanno detto «giallo e mezzo». Io, onestamente, non so nemmeno dove si compra la mezza."]
        : s >= 7 ? ["Il rosa fluo? Un regalo della Società. Mi han detto che mi dona. Non ho mai capito a cosa.", "Ho ancora il fischietto. Ma non so più cosa dirgli."]
          : ["Il fuorigioco lo decido io quando lo vedo. A volte lo vedo prima.", "Il segreto di un buon arbitro? Fischiare con convinzione. Se poi si sbaglia, lo si dice con un'altra convinzione."];
      say(sw([["vl_zelo", chip(L)]], BG.A), done);
    }
    function zeloSa() {
      F.set("zelo_sa", true);
      const c = compId(), pr = proofs();
      say(sw([
        ["voce", "Gli metti davanti la cartellina, le targhette fotografate e il taccuino. Zelo prende il taccuino con due dita, lo gira, lo gira ancora e lo posa come un uovo sodo."],
        ["vl_zelo", "Io… non sono io. Cioè sono io, ma non l'ho scritto io. Cioè l'ho scritto io, ma sotto dettatura. (si accorge di cosa ha detto) Ho una famiglia. Una nonna, un cane e due rate dell'auto."],
        [c, isB() ? "Sotto dettatura. Anche questa l'abbiamo già sentita." : "«Sotto dettatura.» Il tono, la costruzione: l'avevo già letta nel quarto fascicolo."],
        ["vl_zelo", "Arbitrerò dritto. Giuro. Faccio i falli e le ammonizioni giuste. Ma non so se mi basta il fiato, ho già l'affanno."],
        ["voce", `Zelo si asciuga la fronte con la manica rosa fluo e si allontana di mezzo passo, come un cane che abbia visto il veterinario${pr >= 3 ? " e il suo avvocato" : ""}.`],
      ], BG.A), () => { note("Ho mostrato le prove a Zelo: arbitrerà più dritto. 'Sotto dettatura', ha detto."); done(); });
    }


    // ---- Vica, l'Osteria e il baule che si apre con un fischio
    const FISC = [
      { n: "PERICOLO", p: [0, 1, 0], d: "un corto, un lungo, un corto" },
      { n: "HO CAPITO", p: [0, 0, 1], d: "due corti e un lungo" },
      { n: "VENGO", p: [1, 0, 0], d: "un lungo e due corti" },
    ];
    const symOf = (a) => a.map((v) => (v ? "▬" : "●")).join("  ");
    function vica() {
      if (!inC()) return delegate("vl_vica");
      const s = S();
      if (s === 3) return vicaFlow();
      if (s === 6) return stazioneScena();
      const L = s >= 7 ? ["Il panino Camoscio, da oggi, contiene qualcosa: contiene una storia. Il prezzo è lo stesso.", "Mio figlio mi ha detto: «Mamma, grazie». Mi sono messa a pelare le patate per non farmi vedere. Le patate le ho già pelate stamattina: ho pelato le stesse due volte."]
        : s === 4 ? ["Il sentiero del Fischio è dietro la piazza, in alto. Digli che ti manda il vento. Lui capisce i venti: sono gli unici che non gli chiedono di perdonarsi.", "Vai da lui. Io qui accendo la polenta e mi faccio coraggio, che è un lavoro lungo."]
          : ["Il derby è un derby. La polenta, una polenta. Sono le cose che non cambiano: è quello che mi tiene in piedi.", "Zelo ha ordinato un panino senza camoscio. Gli ho dato quello col camoscio. Se ne è accorto solo per l'espressione."];
      say(sw([["vl_vica", chip(L)]], bgHere()), done);
    }
    function vicaFlow() {
      if (!has("vica_met")) return vicaIntro();
      if (!has("fischi_ok")) return ask("vl_vica", "«Il baule è lì sotto, vicino al camino. Dimmi tu quando vuoi riprovare.»", [
        { label: "Prova il baule", sub: "Il fischio in codice", cls: "hot", fn: () => fischioRound(0) },
        { label: "Riascolta la storia", sub: "Dall'inizio", fn: vicaIntro },
      ], BG.O);
      if (!has("vica_t")) return baule();
      done();
    }
    function vicaIntro() {
      const c = compId(), ric = has("remo_ric");
      F.set("vica_met", true);
      say(sw([
        ["voce", "L'Osteria del Camoscio ha la tenda a righe gialle e nere e una lavagna: «PANINO CAMOSCIO (non contiene camoscio, contiene fiducia) · POLENTA DEL DERBY · BIRRA (sì)». Sulla soglia, con un grembiule giallo e le braccia incrociate come due porte che si chiudono, una donna di cinquantacinque anni ti guarda senza dire niente.", BG.C],
        ["vl_vica", "Il nuovo. Il tredici. (lo dice senza sorpresa, come chi legge un orario) Entra, che la nebbia ascolta, anche quassù. Io sono Vica. Ludovica Valanga: ala dei Camosci, anno '98, e padrona di questo posto da quando i piedi hanno smesso di ascoltarmi.", BG.C],
        ["voce", "Dentro, l'osteria odora di polenta e di legna di larice. Su una mensola, tre Coppe dei Tre Versanti e un piedistallo vuoto; alle pareti, squadre in posa con la faccia di chi sta per vincere qualcosa. Sul bancone, appeso a un chiodo, un fischietto di plastica gialla."],
        ["vl_vica", ric ? "Mio figlio mi ha detto che gli hai parlato di una ricevuta. Mi ha chiesto se «V. Valanga» fosse una cugina. Gli ho detto: «Chiedilo a chi sa leggere le ricevute.» Eccoti." : "Mio figlio ti ha mandato da me, e io so perché. Mi ha chiesto di un nome letto alla radio e io gli ho dato la minestra. Non è una risposta, ma scalda."],
        ["vl_vica", "Non ti racconto il resto adesso. Non è questione di fiducia: è questione di serratura. Sotto il camino c'è un baule che non apro dal '98. L'ha chiuso Aurelio Brinzi in persona, con la mano e con un fischio: si apre solo con la frase giusta."],
        ["vl_vica", "Aurelio era il capitano degli Stambecchi, io dei Camosci. Ci chiamavamo «Capitano» a vicenda, per scherzo, e poi sul serio. Avevamo il codice dei Tre Versanti, quello dei soccorsi alpini: lo imparano tutti i capitani il primo anno. Corto, lungo, corto: PERICOLO. Due corti e un lungo: HO CAPITO. Un lungo e due corti: VENGO."],
        ["vl_vica", "Io non riesco più a fischiarli. Ogni volta mi esce un singhiozzo. Fischia tu, al posto mio: la serratura è a canne, ascolta, e non fa differenza tra una bocca e un'altra. Basta che sia onesta."],
        [c, isB() ? "Un baule con un cilindro a fischio. Una cosa di precisione, più che di forza. Mi piace." : "Un meccanismo acustico a codice. Per principio, qualunque oggetto che ascolta ha un'impedenza: la trovo ragionevole."],
      ], BG.O), () => { note("Vica Valanga: il baule dei capitani si apre con il codice di fischio dei Tre Versanti: PERICOLO (corto-lungo-corto), HO CAPITO (due corti e un lungo), VENGO (un lungo e due corti)."); fischioRound(0); });
    }
    function fischioRound(r, again) {
      const f = FISC[r], c = compId(), hint = F.get("fischi_f", 0) >= 2 || again;
      const look = r === 0 ? `${f.n}: ${symOf(f.p)}` : r === 1 ? `${f.n}: ${f.d}` : `${f.n}`;
      say(sw([
        ["voce", `Vica si china sul baule. Il coperchio ha una piccola bocca di ottone, da cui esce un respiro freddo. «${["Prima", "Seconda", "Terza"][r]} frase: ${f.n}.»${r === 0 ? " (Ascolta: " + symOf(f.p) + " · un cerchio è un corto, una barra è un lungo.)" : r === 1 ? " (" + f.d + ".)" : ""}`, BG.O],
        ...(hint && r === 2 ? [[c, "È l'ultima: un lungo e due corti. Respira, poi comincia dal lungo."]] : []),
      ], BG.O), () => fischioInput(r, [], look));
    }
    function fischioInput(r, cur, look) {
      const f = FISC[r];
      ask("voce", `${f.n} · ${cur.length} di ${f.p.length}${cur.length ? "\n" + symOf(cur) : ""}`, [
        { label: "● Corto", sub: "Un colpo di fischio", cls: "hot", fn: () => fischioStep(r, cur, 0) },
        { label: "▬ Lungo", sub: "Un fiato più lungo", cls: "hot", fn: () => fischioStep(r, cur, 1) },
        { label: "↺ Riascolta", sub: "Vica lo ripete", fn: () => { F.add("fischi_r", 1); fischioRound(r, true); } },
      ], BG.O);
      void look;
    }
    function fischioStep(r, cur, v) {
      const f = FISC[r], nx = cur.concat([v]);
      if (nx.length < f.p.length) return fischioInput(r, nx);
      const ok = nx.every((x, i) => x === f.p[i]);
      if (!ok) {
        F.add("fischi_f", 1);
        return say(sw([
          ["voce", "Il baule risponde con un colpo secco, da pugno su una porta. Il respiro freddo si ritira."],
          [compId(), isB() ? "Ricomincia. Gli errori si fanno una volta: la seconda si fa la correzione." : "Un errore di sequenza. Ricomincia: la serratura non penalizza, ma non scorda."],
        ], BG.O), () => fischioRound(r));
      }
      if (r < 2) return say(sw([["voce", `Il baule risponde con un clic limpido: ${FISC[r].n}, accettato. Dalla bocca di ottone sale un po' di calore, come quando si accende una stufa.`], ["vl_vica", r === 0 ? "Pericolo. L'ultima volta che l'ho sentito fischiare così ero in una curva e non sapevo ancora cosa fosse." : "Ho capito. (pausa) Anche se è passato un quarto di secolo, è così che mi ricordo: con una parola in più."]], BG.O), () => fischioRound(r + 1));
      F.set("fischi_ok", true);
      const m = reward("vl_c5_fischi", { coins: 8 });
      say(sw([["voce", "Il terzo clic è il più grave. La serratura gira, i cardini sospirano e il coperchio si alza di un dito da solo."], ...(m.length ? [["voce", m.join(" · ") + "."]] : [])], BG.O), baule);
    }
    function baule() {
      const c = compId(), ar = F.get("arbitro", "prag");
      say(sw([
        ["voce", "Il baule si apre con un sospiro di naftalina e di legno. Dentro, in ordine: una busta bianca e quadrata, con scritto a stilografica «TEO · DOPO»; una maglia gialla fluo col numero 7, piegata da ventisei anni; e una fotografia in cornice di cartone."],
        ["voce", "Nella fotografia Vica, a ventinove anni, ride a bocca aperta in maglia dei Camosci. Sulle sue ginocchia un bambino di cinque anni stringe fra i denti un fischietto di plastica gialla. Accanto a loro la cornice è tagliata con le forbici: un uomo è stato asportato, e di lui restano soltanto un braccio e, sul polso, un paio di occhiali da sole appesi per la stanghetta."],
        [c, isB() ? "Il braccio. Gli occhiali. (guarda il bambino) …Quegli occhiali. Li porta ancora." : "L'iconografia è chiara: ritaglio, polso, occhiali. Il bambino, anche. (si ferma) Il fischietto: lo stesso che è appeso al chiodo."],
        ["vl_vica", "Sì. (non si volta) Il bambino è Remo. Il braccio è di suo padre. Gaudenzio Fischietti: quello del referto, quello della ricevuta «presso V. Valanga». Sono io, V. Valanga. Il cognome è mio, il resto è suo."],
        ["vl_vica", "Quella notte, alle undici, scrisse il referto sul tavolo della cucina, con le mani che non ubbidivano. All'alba lo portò al segretario comunale e tornò a casa senza dire una parola. Si sedette in cucina e non si alzò per ore. Il giorno dopo c'era il Crollo. Il giorno dopo ancora, una persona della Società mi propose «una borsa di studio per il ragazzo»."],
        ["vl_vica", "L'ho accettata per Remo. Poi ho capito che era un guinzaglio. Ho continuato ad accettarla per Remo, poi per abitudine, poi per vergogna. E Cima Alta ha vinto tre Coppe in fila con lo stesso arbitro e lo stesso silenzio, e nessuno ha avuto il coraggio di dire a Remo che le aveva vinte col naso nel vuoto."],
        ["vl_vica", "In paese lo sappiamo in tre: io, Neve e il nonno Albino, che fa il guardiano. Gli altri sanno solo che l'arbitro del '98 è «quello lassù», e che a nominarlo porta sfortuna. Remo non lo sa. Gli ho detto che suo padre era partito per lavoro. Non gli ho mai detto che il lavoro era fischiare."],
        ...(ar === "comp" ? [["vl_vica", "So che gli hai parlato, giù. L'eco, intendo. Lo so perché quella notte, e in tutte le altre, qualcosa di lui è rimasto sotto: ogni tanto, in cantina, sento tossire."]] : []),
        ["voce", "Posa la fotografia sul bancone, con la faccia in giù, come si posa una carta da giocare che non si vuole vincere."],
      ], BG.O), () => ask("vl_vica", "«A Remo lo dirò io, dopo il derby. O lo dirai tu. O lo dirà nessuno, e allora lo dirà il campo. Cosa ti sembra giusto?»", [
        { label: "«Glielo dico io, prima di giocare. Ha diritto a saperlo.»", sub: "Prima del fischio", fn: () => vicaT("verita") },
        { label: "«Aspetto il fischio finale. Poi decidi tu.»", sub: "Un patto", fn: () => vicaT("patto") },
        { label: "«Non sta a me né a te: sta a lui, quando lo chiederà.»", sub: "Lasci a Remo la scelta", fn: () => vicaT("lui") },
      ], BG.O));
    }
    function vicaT(w) {
      F.set("vica_t", w);
      const a = w === "verita" ? [["vl_vica", "Se glielo dici tu, dillo bene. È fragile come un vetro d'oro: fargli male è facile, curarlo no. (si asciuga le mani sul grembiule che non è bagnato) Va bene. Ma dillo con le due mani."]]
        : w === "patto" ? [["vl_vica", "Il fischio finale. Va bene. E se non ti riesce di trattenerti, ti perdono: sono cresciuta con un uomo che non tratteneva niente, tranne la voce."]]
          : [["vl_vica", "Quando lo chiederà. (sorride, finalmente, a metà) Hai l'aria di chi sa aspettare. È una rarità, da queste parti: ti tengo la polenta."]];
      say(sw([...a,
        ["vl_vica", "La lettera la consegno io a Teodora. In mano, non per posta e non per radio. Falla salire: la cabina delle sei e quarantatré, sai, sale da sola, ma qualcuno deve riceverla."],
        ["vl_vica", "E poi… (guarda la finestra, verso il sentiero) c'è un uomo in cima al sentiero del Fischio. Non gli parlo da ventisei anni: lui non mi ha mai chiamata, io non l'ho mai cercato. Digli che ti manda il vento. Digli «corto, lungo, corto». Lui capisce."],
        ["voce", "Vica rimette dentro la maglia numero 7 e chiude il baule. Poi, dopo un attimo, la riprende e te la porge piegata: «Questa non serve a nessuno chiusa in un baule. Prendila a fine giornata, quando avremo capito di chi è.»"],
      ], BG.O), () => {
        note("Remo Valanga è figlio di Gaudenzio Fischietti, l'arbitro del '98. Vica l'ha taciuto per 26 anni: la Società le pagava 'una borsa di studio'. Il padre vive nella Baita del Fischio (ALTO, sentiero a NORD).");
        setStep(N, 4); done();
      });
    }

    // ---- la Baita del Fischio: Gaudenzio
    function gaudenzio() {
      if (!inC()) return delegate("vl_gaudenzio");
      const s = S(), z = zoneNow();
      if (z === "vl_baita" && s === 4) return gaudScena();
      const sc = F.get("remo_scelta", "");
      if (z === "vl_campoalto") return say(sw([["vl_gaudenzio", chip(s === 5 ? ["(senza voltarsi, l'occhio al cannocchiale) Da qui si vede tutto. Anche il tempo che manca. Non disturbare: sto guardando mio figlio correre sul lato sbagliato dell'arbitro.", "Corto, lungo, corto. Non lo dico a nessuno. Lo dico a me, per sentire se ho ancora il fiato."] : ["Il campo è più bello visto da qui sopra. Da giù è soltanto più vicino.", "Ho il fischietto d'ottone nella tasca. Pesa quanto un pezzo di pane."])]], BG.A), done);
      const L = s >= 7 ? (sc === "verita" || sc === "due" ? ["Mi ha chiamato per nome, con il tono di chi prova una parola in una lingua studiata per corrispondenza. Gli ho risposto allo stesso modo. Funziona, a metà. A metà va bene.", "Ho tolto dalla parete l'ultimo gancio vuoto. Non serve più aspettare un fischietto che non arriva."] : ["Aspetto. È la mia specialità. Ho vent'anni di esperienza e tutti gratis.", "Mio figlio non è venuto. Ma ha guardato: l'ho visto dal cannocchiale. Mi basta per oggi."]) : ["Da qui si vede il Campo Alto, la cabina e quasi tutta la mia colpa. Il quasi è una consolazione.", "Il vento qui fischia da solo. Io lo lascio fare: è più bravo."];
      say(sw([["vl_gaudenzio", chip(L)]], BG.B), done);
    }
    function gaudScena() {
      const ar = F.get("arbitro", "prag"), bet = has("remo_bet") && has("m1_win"), c = compId();
      F.set("gaud_met", true);
      const apertura = ar === "comp" ? "Lei è quello della Camera del Minuto. Mi ha detto dove mettere la voce. L'ho messa in un cassetto, sotto il letto. Non l'ho mai aperto: ma ogni notte lo sento respirare."
        : ar === "acc" ? "Lei mi ha accusato, laggiù. Aveva ragione. (si toglie gli occhiali un istante, li rimette) Viene a ripeterlo? Si accomodi: ho tenuto una sedia, da ventisei anni, per chi doveva dirmelo."
          : "Lei voleva la prova, non l'assoluzione. L'ha avuta: la ricevuta sta dov'è. (abbassa il cannocchiale) Ora che cosa vuole, che non sia già in un cassetto?";
      say(sw([
        ["voce", "Sul portico della baita un uomo siede su una sedia a dondolo con un cannocchiale in grembo. Ha settant'anni scarsi, la barba bianca come una pagina e gli occhiali da sole, scuri, in una giornata di nuvole. Alla cintura, un fischietto d'ottone che non tocca."],
        ["voce", "Dietro di lui, attraverso la porta socchiusa, si vede una parete tappezzata di fischietti: ventisei, in file ordinate. Gli ultimi ganci sono vuoti, come in attesa."],
        ["vl_gaudenzio", "«Corto, lungo, corto.» Mi ha mandato il vento, immagino, o Vica. Non so quale dei due sia più testardo."],
        ["vl_gaudenzio", apertura],
        ["vl_gaudenzio", "Non si stupisca che sappia. Quel che ho lasciato là sotto parla anche con la mia voce. A volte me ne sveglio con il sapore di ruggine."],
        ["vl_gaudenzio", "Ventisei fischietti: uno per ogni anno che non ho fischiato. Il primo me lo sono comprato un mese dopo il Crollo. Dopo, uno a marzo, come i calendari. Mi dicono che sia un hobby, come i francobolli. Non ho mai detto di no."],
        ["vl_gaudenzio", "Vuole la storia. Gliela dico, ma corta: la lunga ce l'ho in cassetto. Il giovedì prima della finale vennero a casa mia due uomini: un autista e un ingegnere con i guanti bianchi. Una busta, diciotto milioni e una ricevuta. Mi chiesero poco: un fischio al quarantatreesimo senza fallo, «per tenere il pubblico sul campo fino alle diciotto e quarantatré, ci sono lavori di sicurezza alle gallerie». Dissero «sicurezza». Io dissi sì. Una casa nuova, una scuola per il ragazzo."],
        ["vl_gaudenzio", "Alle sei meno dieci, dal cerchio di centrocampo, vidi i camion della Società che salivano verso l'imbocco, e il turno di notte che non c'era sugli spalti. I minatori ci sono sempre, a una finale. Quella sera no. Capii. Troppo tardi per rifiutare, abbastanza presto per tradire."],
        ["vl_gaudenzio", "Al quarantatreesimo fischiai. Come mi avevano chiesto: senza fallo. Ma lo feci in codice. Corto, lungo, corto: PERICOLO. Il fischio dei capitani dei Tre Versanti. L'unico che Aurelio avrebbe capito. Lui capì. (si ferma, e il cannocchiale gli trema sulle ginocchia) Capì e scese, e la squadra scese con lui. Per questo i quattordici sono usciti. Ed è per questo che gli undici non sono usciti."],
        ["vl_gaudenzio", "Ho fischiato giusto, ragazzo, e ho fischiato la loro fine. Non ho più fischiato da allora. Né un fallo, né un compleanno. Solo il vento, qui, al mio posto."],
        [c, isB() ? "Il fischio in codice. Il «fallo che non c'era». (piano) Il primo avviso che ha sentito il capitano… era suo." : "Dunque il «fischio storto» era un avviso cifrato. Le prove documentali sono ancora contro di lei, ma l'intenzione… cambia la lettura del verbale."],
      ], BG.B), () => { F.set("sos_vista", true); note("Gaudenzio Fischietti, nella baita: al 43' ha fischiato corto-lungo-corto (PERICOLO) per avvisare Aurelio. Senza il suo fischio i quattordici minatori non sarebbero usciti."); gaudScelta(bet); });
    }
    function gaudScelta(bet) {
      ask("voce", "L'uomo ti guarda, per quanto si possa guardare con le lenti scure. Dietro di lui, sulla soglia, la parete dei fischietti si muove al vento. Cosa gli dici?", [
        { label: "«Suo figlio sta per giocare la quarta partita truccata e non lo sa.»", sub: "La colpa", fn: () => gaudT("colpa", bet) },
        { label: "«Sabato serve un arbitro onesto. Non so chi chiamare, tranne uno.»", sub: "Il dovere", fn: () => gaudT("dovere", bet) },
        { label: "«Non venga per la partita. Venga perché è suo padre.»", sub: "L'amore", fn: () => gaudT("amore", bet) },
      ], BG.B);
    }
    function gaudT(w, bet) {
      F.set("gaud_t", w);
      const a = w === "colpa" ? [["vl_gaudenzio", "La quarta. (ripete, lento) Lo so. Lo vedo dal cannocchiale: il rosa fluo che fischia dalla parte giusta di una certa busta. Non ho mai mandato un avviso a nessuno, da allora. Neanche a lui."]]
        : w === "dovere" ? [["vl_gaudenzio", "Un arbitro onesto. (sorride sotto la barba, e il sorriso gli viene storto, come una strada di montagna) Ce ne sarebbe uno. Ha la mano rovinata e la coscienza buona. Ma non fischia."]]
          : [["vl_gaudenzio", "Suo padre. (la parola gli cade sul portico come un piatto) Nessuno me l'aveva più detto in questo modo. Mia madre diceva «tu sei mio figlio»; mia moglie «tu sei mio marito». Quella parola lì, la tengo in fondo."]];
      say(sw([...a,
        ["vl_gaudenzio", "Non scendo, ragazzo. Non per orgoglio: perché a un figlio non si può imporre un padre. Scendo se mi chiama lui. Lui, non un campione, non una Società. Se alza la mano dalla panchina e guarda verso la curva in alto a sinistra, io scendo. Il tempo di un fischietto."],
        ["vl_gaudenzio", "Gli lasciai un paio di occhiali sul davanzale, quella mattina: ne avevo due paia, uguali. Da bambino la luce mi faceva piangere, a me. Penso che a lui no: ma li porta. Ho visto col cannocchiale che li porta, da ventisei anni. È la cosa più bella che mi resti: il figlio che porta i miei occhiali."],
        ...(bet ? [["vl_gaudenzio", "Ho visto che da un po' non li porta più. Per una scommessa, mi dicono. Se è stato con lei che ha perso gli occhiali, ringrazi pure l'avversario: ha cominciato a guardare."]] : []),
        ["voce", "Si porta il fischietto d'ottone alle labbra per la prima volta da ventisei anni. Non soffia. Lo tiene lì, come chi ascolta una conchiglia. Poi lo toglie."],
        ["vl_gaudenzio", "Vada. Il derby è fra due giorni. La curva in alto a sinistra è la mia. Il resto, ormai, è del vento."],
      ], BG.B), () => {
        setStep(N, 5); note(w === "amore" ? "Gaudenzio scenderà se Remo gli fa cenno dalla panchina, guardando la curva in ALTO a sinistra del Campo Alto. Gli ho detto: 'venga perché è suo padre'." : "Gaudenzio scenderà solo se Remo glielo chiede: dovrà alzare la mano e guardare la curva in ALTO a sinistra del Campo Alto.");
        done();
      });
    }
    function cannocchiale() {
      const s = S();
      say(sw([["voce", s >= 4 ? "Guardi nel cannocchiale. Il Campo Alto sembra a portata di mano: si leggono i cartelloni dello sponsor, si contano le sedie portate da casa. Sulla panchina dei Camosci un taccuino rosa fluo spunta da sotto un cuscino. Qui sopra, ogni cosa fa meno rumore e più male." : "Un cannocchiale su treppiede, puntato verso il Campo Alto. Per ora, guardare dentro ti sembra un'indelicatezza."]], BG.B), done);
    }


    // ---- il derby: la Regola del Campo Alto (arbitro dello sponsor) e due tempi
    const lean = () => (has("remo_bet") ? 1 : 0) + (remoHelps() ? 1 : 0) + (has("slalom_ok") ? 1 : 0) + (has("remo_ric") ? 1 : 0) + (F.get("remo", 1) === 3 && !remoHelps() ? -1 : 0) + (F.get("vica_t", "") === "verita" ? 1 : 0);
    const edge1 = () => Math.max(0.02, 0.12 - 0.03 * Math.min(2, proofs()) - (has("zelo_sa") ? 0.03 : 0));
    const edge2 = () => { const r = F.get("ref2", "zelo"); return (r === "gaud" ? -0.04 : r === "cornelio" ? 0 : Math.max(0.04, 0.13 - 0.02 * Math.min(2, proofs()))) + (F.get("remo_scelta", "") === "padre" ? 0.04 : 0); };
    // il Campo Alto: erba rasata con la neve a chiazze, cartelloni neri e gialli dello sponsor, tifosi gialli e neri
    const VENUE_CAM = { ads: [["LUMEN ENERGIE ALPINE", "#1a1a1a"], ["CAMOSCI DI CIMA ALTA", "#d6f23a"], ["LUMEN SERVIZI SPORTIVI", "#2a2f48"], ["POLENTA DEL DERBY", "#b5532a"]], crowd: ["#d6f23a", "#1a1a1a", "#e4ff3a", "#f2f6ff", "#2b4a34"], ground: ["#5d9a4e", "#68a656"], patches: "rgba(244,248,255,.62)", tint: "rgba(214,242,58,.07)", glow: "250,255,200", fx: { spd: 0.97 } };
    const camosci = (t, st, e) => ({ vs: "i Camosci di Cima Alta", name: "Camosci di Cima Alta", color: "#d6f23a", defs: [["Gisella Cima", t(st.drib * 0.8 * (1 + e))], ["Il Bufalo", t(st.drib * 0.86 * (1 + e))], ["Tonio Fiocco", t(st.drib * 0.82 * (1 + e))]], atk: [["Remo Valanga", t(st.tiro * 0.92 * (1 + e))], ["Gisella Cima", t(st.tiro * 0.78 * (1 + e))]], gk: ["Tonio Fiocco", t(st.tiro * 0.96 * (1 + e))], power: t(st.tiro * 0.8 * (1 + e)), special: ["VALANGA FLUO", t(st.tiro * 1.12 * (1 + e))] });
    function palla() {
      const s = S(), ph = PH();
      if (s !== 5) return say(sw([["voce", s >= 6 ? "Il pallone del derby, fermo sul dischetto, con la scritta LUMEN un po' sbiadita. Qualcuno ci ha disegnato sopra, a pennarello, due occhiali da sole." : "Un pallone nuovo di zecca, lucido come una mela, con la scritta LUMEN. Lo guardi senza toccarlo: sai che il giorno del derby sarà l'unico a non avere paura."]], BG.A), done);
      if (ph === 0) return preDerby();
      if (ph === 1) return halftime();
      if (ph === 2) return secondoTempo();
      return postMatch();
    }
    function preDerby() {
      const c = compId(), pr = proofs(), zs = has("zelo_sa"), first = !has("pre5");
      F.set("pre5", true);
      const L = first ? [
        ["voce", "Il pallone è sul dischetto del centrocampo. Cima Alta è venuta tutta: ottocento posti, seicento sedie portate da casa, sei nonni scortatori in prima fila con i cappelli e un coro che fa le prove da tre ore. Sul bordo del campo sventolano bandiere gialle col camoscio nero."],
        ["vl_noemi", "Qui Radio Nebbia, in diretta dal Campo Alto! Oggi trasmettiamo l'alta quota, la bassa quota e le quote d'umore. Meteo: sole fluo, vento neutro, pronostico riservato. L'arbitro ha ammonito il pallone per precauzione."],
        ["vl_zelo", zs ? "Il regolamento della Regola del Campo Alto: l'arbitro è designato dallo sponsor. (si schiarisce la gola, e per la prima volta si sente un po' di coscienza in quel fischietto) L'arbitro è tenuto alla correttezza." : "Regola del Campo Alto, articolo uno: l'arbitro è designato dallo sponsor. Articolo due: l'arbitro ha sempre ragione. Articolo tre: vedi articolo uno."],
        ["voce", `Remo ti stringe la mano a centrocampo con troppo vigore e la lascia con troppo ritardo. ${pr >= 2 ? "Sul tuo taccuino, in tasca, hai prove di quanto sia sbilanciato questo campo." : "Intorno a voi, tutto sembra in ordine: ed è ciò che preoccupa."}`],
        [c, isB() ? "Fischio d'inizio fra un minuto. Palla a me, e tu pensa a tutto il resto. Compreso l'arbitro: tienilo d'occhio." : "Inizio. Mi tengo il centrocampo; tu l'area. L'arbitro lo osservo io: ho un'idea sul suo metodo di misura."],
      ] : [["voce", "I giocatori sono in posizione, il pubblico sta in piedi, Zelo ha il fischietto già in bocca."]];
      say(sw(L, BG.A), () => ask("voce", "Il pallone al centro. Zelo guarda l'orologio, Remo il cielo, gli ottocento posti guardano te.", [
        { label: "Calcio d'inizio", sub: "Primo tempo · 45'", cls: "hot", fn: primoTempo },
        { label: "Aspetta un momento", sub: "Prima voglio guardarmi intorno", fn: done },
      ], BG.A));
    }
    function primoTempo() {
      const z = has("zelo_sa");
      X.playMatch({
        id: "vl5a", alt: "hd", force: true, weather: "neve", venue: VENUE_CAM, homeKit: ["#1b2f7a", "#d9a441"], chap: "Vallombra · Derby al Campo Alto · 1° tempo", mate: compName(),
        intro: "Derby con i Camosci al Campo Alto, primo tempo (45'). <b>Regola del Campo Alto</b>: l'arbitro è designato dallo sponsor" + (z ? " (ma da quando Zelo sa che sai, fischia con la mano sul cuore)" : ", e si vede: i cartellini cadono come neve") + ". " + compName() + " gioca con te.",
        team: (t, st) => camosci(t, st, edge1()),
        done: (r) => {
          F.set("m5a_a", r.a); F.set("m5a_b", r.b); F.set("ph5", 1);
          note(`Derby, primo tempo: ${r.a}–${r.b}.`);
          halftime();
        },
      });
    }
    function halftime() {
      const a = F.get("m5a_a", 0), b = F.get("m5a_b", 0), c = compId(), zs = has("zelo_sa"), pr = proofs();
      const lead = a > b ? "Gli Stambecchi sono avanti" : a < b ? "I Camosci sono avanti" : "Si va all'intervallo in parità";
      say(sw([
        ["voce", `Fischio dell'intervallo: ${a}–${b}. ${lead}. ${zs ? "Zelo ha arbitrato con una scrupolosità che gli costa il sudore di tre magliette." : "Zelo ha ammonito due ospiti e un gabbiano; ai locali, un sorriso."}`, BG.A],
        ["vl_noemi", a > b ? "Qui Radio Nebbia: Vallombra avanti sul Campo Alto! Il pubblico di casa ha smesso di cantare per chiedere il regolamento. Pare che il regolamento sia sparito." : a < b ? "Qui Radio Nebbia: Camosci in vantaggio, e ci mancherebbe. Lo dico con gentilezza: il vantaggio ha un fischietto rosa fluo e una buona cognizione del cartellino." : "Qui Radio Nebbia: parità al Campo Alto. Nessuno ci crede, nemmeno l'arbitro, che controlla il referto."],
        ["voce", "Nel tunnel degli spogliatoi, la luce è quella di una lampada a olio che ha deciso di fare la lampadina. Hai la maglia appiccicata alla schiena e il fiato di chi ha corso tanto e parlato poco."],
        [c, isB() ? "Ho contato sei fischi storti. Sei. Ho pensato di tirargli addosso una chiave inglese: la sto tenendo per la ripresa." : `Cinque decisioni anomale su otto: il campione non è significativo, ma il trend sì. ${pr >= 2 ? "E i nostri documenti dicono lo stesso." : ""}`],
        ["voce", "In fondo al tunnel, controluce, c'è Remo. È solo. Ha la maglia fradicia e gli occhiali da sole sulla fronte, come una corona fuori posto."],
      ], BG.S), htRemo);
    }
    function htRemo() {
      const id = remoId(), ric = has("remo_ric"), vt = F.get("vica_t", ""), ns = id === "vl_remo_ns";
      say(sw([
        [id, "Ho fatto il giro dei falli. Tre fischiati contro di voi che non c'erano. Un fallo di mano su Gisella: la mano era mia. Lo so, perché ce l'avevo io. (cerca le parole) Se vinciamo così, non è vincere."],
        [id, "In curva, in alto a sinistra, c'è un vecchio con gli occhiali da sole che mi guarda da quarantacinque minuti. Ha il mio modo di correre, anche da fermo: di lato, come se si scusasse. Non lo conosco. Non so perché lo riconosco."],
        ...(ric ? [[id, "E tu mi hai detto una cosa, ieri. «Presso V. Valanga». Ho chiesto a mia madre: ha cambiato discorso tre volte. Una volta sul meteo, una sulle patate, una sul parroco."]] : [[id, "Mia madre, stamattina, mi ha accompagnato fino al cancello e non mi ha dato il panino. Non l'ha mai fatto. Ho pensato: o è morto qualcuno o qualcuno sta per dirmi qualcosa."]]),
        [id, "Voi due sapete. Lo vedo dalla faccia: quella di chi tiene fra le mani un oggetto che non è suo. Dimmelo, " + (ns ? "senza occhiali, a faccia nuda" : "e se ti serve, non guardo") + ". Prima del secondo tempo."],
      ], BG.S), () => {
        const opts = [
          { label: "«Tuo padre è Gaudenzio Fischietti. L'arbitro del '98.»", sub: vt === "patto" ? "Rompi il patto con Vica" : "La verità, dritta", fn: () => remoR2("diretta") },
          { label: "«Chiedilo a tua madre, a fine partita. Fidati di lei.»", sub: "Rimandi al fischio finale", fn: () => remoR2("madre") },
          { label: "«Guarda in curva, in alto a sinistra. Poi decidi.»", sub: "Lo lasci vedere", fn: () => remoR2("curva") },
        ];
        if (has("sos_vista")) opts.push({ label: "«Tuo padre ha fischiato l'SOS. Per questo i quattordici sono usciti.»", sub: "Quel che sai dalla baita", cls: "hot", fn: () => remoR2("sos") });
        ask("voce", "Remo aspetta, con il fiato corto e lo sguardo di chi si prepara al peggio e spera in un altro. Cosa fai?", opts, BG.S);
      });
    }
    function decideRemo(w) {
      const l = lean();
      if (w === "sos") return "due";
      if (w === "madre") return "attesa";
      if (w === "curva") return l >= 0 ? "verita" : "padre";
      return l >= 2 ? "verita" : "padre";
    }
    function remoR2(w) {
      const id = remoId();
      F.set("remo_sa", w);
      if (w === "diretta" && F.get("vica_t", "") === "patto") F.set("patto_rotto", true);
      const sc = decideRemo(w); F.set("remo_scelta", sc);
      const a = w === "diretta" ? [
        [id, "…No. (ride, e non c'è niente di divertente) Dimmelo un'altra volta, ma con la faccia di chi scherza."],
        ["voce", "Non scherzi. Remo sillaba il nome come una parola in una lingua che non parla."],
        [id, "Gaudenzio. Quello che ha preso i soldi. Quello che il paese chiama «quello lassù». Quello per cui nessuno si ferma quando passa il sentiero. (si porta una mano agli occhiali che non porta) Quello che mi ha lasciato un paio di occhiali sul davanzale. Mia madre mi ha sempre detto che erano di mio nonno."],
      ] : w === "madre" ? [
        [id, "A fine partita. (inspira, e il respiro gli esce a pezzi) Va bene. Se c'è una verità, aspetta i novanta minuti? Le verità sono come gli arbitri: sbagliano, ma non si possono sospendere."],
        ["voce", "Annuisce e si mette gli occhiali sul naso. Le lenti nascondono tutto, tranne le mani, che gli tremano."],
      ] : w === "curva" ? [
        ["voce", "Remo alza gli occhi alla curva in alto a sinistra. Laggiù, in piedi, un uomo con gli occhiali da sole e la barba bianca ha appoggiato una mano al parapetto. Lo guarda. Non agita il braccio, non dice niente: porta la mano al volto, come per sistemarsi gli occhiali."],
        ["voce", "Remo, a sua volta, porta la mano agli occhiali. È lo stesso gesto, con la stessa inclinazione di polso, a cinquanta metri di distanza e ventisei anni di ritardo."],
        [id, "…Ah. (una sola sillaba, bassa) Allora è così."],
      ] : [
        [id, "L'SOS dei capitani? Mia madre, per svegliarmi da bambino, fischiava così: corto, lungo, corto. Diceva che era l'allarme dei Camosci. Diceva che serviva per salvare qualcuno. (lo dice piano, come uno che scopre una cosa che sapeva da sempre) Era… suo."],
        ["voce", "Remo si siede sulla panca dello spogliatoio, a gambe larghe, con i gomiti sulle ginocchia. Per un po' fa solo respiri."],
        [id, "Dunque mio padre non è soltanto quello che ha preso la busta. È anche quello che ha fischiato per avvisare. (guarda te) Perché non me l'ha detto nessuno? Perché dovevo scoprire prima la parte brutta?"],
      ];
      say(sw(a, BG.S), () => htDecisione(sc, w));
    }
    function htDecisione(sc, w) {
      const id = remoId(), c = compId(), pr = proofs();
      if (sc === "verita" || sc === "due") {
        return say(sw([
          [id, sc === "due" ? "Allora giochiamo la ripresa a modo mio. Con un arbitro che abbia un motivo per fischiare giusto. Il motivo ce l'ha in tribuna, in alto a sinistra." : "La ripresa la giochiamo con un arbitro che non sia dello sponsor. Che sia mio padre o l'arcangelo Gabriele, per me è uguale. (si morde un labbro) Non è vero. Non è uguale."],
          ["voce", "Remo sale i gradini della curva, uno alla volta, con le mani lungo i fianchi, come si sale a ricevere un premio o una condanna. Il vecchio si alza. I due si guardano da due metri, entrambi con gli occhiali scuri, e per un attimo sembrano la stessa persona in due anni diversi."],
          ["vl_gaudenzio", sc === "due" ? "Hai il passo di tua madre." : "Hai il passo di tua madre. E gli occhiali miei."],
          [id, sc === "due" ? "Non ti chiamo papà, non ancora. Ti chiamo arbitro. Fischia giusto, una volta, per quarantacinque minuti. Il resto, poi." : "Ti chiamo come arbitro, non come padre. Il resto, dopo. Se c'è un dopo."],
          ["vl_gaudenzio", sc === "due" ? "Quarantacinque, uno più uno meno. (la voce gli si incrina, e si accorge che si incrina) Ho un fischietto d'ottone nella tasca che aspetta da ventisei anni. Credo che sia contento."  : "Accetto il lavoro. (si tocca la tasca dove il fischietto d'ottone pesa più di un pezzo di pane) Il resto lo conservo, per quando sarà."],
          ["voce", "Zelo, sul bordo del campo, si toglie il fischietto cromato dal collo con l'aria di chi sia stato appena tolto da una pratica. Neve spalanca le braccia: «Ma non è nel regolamento!» Vermiglio, accanto a lui, scuote piano la testa."],
          ["vl_vermiglio", "Un cambio d'arbitro è un cambio d'arbitro. Il contratto parla di fischio, non di fischiatore. Lo lascio fare: sono curioso di sentirlo."],
          [c, isB() ? "Si è tolto gli occhiali? Non si è tolto gli occhiali. Ha fatto bene: certe cose si fanno con le lenti scure, per non farsi vedere piangere dal pubblico." : "Ha mantenuto gli occhiali. Gli stessi, identici, di suo figlio. È una prova di identità: la più bella che abbia mai raccolto."],
        ], BG.S), () => { F.set("ref2", "gaud"); X.lanAdd("vl_remo"); note(sc === "due" ? "Remo sa tutto, SOS compreso. Ha chiamato suo padre ad arbitrare il secondo tempo." : "Remo sa che è figlio di Gaudenzio. Ha chiamato suo padre ad arbitrare il secondo tempo, come arbitro."); F.set("ph5", 2); done(); });
      }
      const L = sc === "padre" ? [
        ["voce", "Remo si rimette gli occhiali sul naso e chiude la discussione con le due mani, come si chiude una porta di vetro."],
        [id, w === "diretta" ? "Non mi interessa. Mio padre è partito per lavoro: se faceva l'arbitro, ha fatto un lavoro come tanti. I fischietti si comprano ovunque." : "Non cambia niente. Vince chi gioca. Giochiamo. Il resto non mi riguarda, e se mi riguarda, mi riguarderà dopo."],
        [id, "E tu, " + T("{n}") + ": non toccare Zelo. È mio. Il fischio è il mio fischio. Siamo i Camosci: ci teniamo i nostri."],
      ] : [
        [id, "Dopo. Lo dirà mia madre, dopo i novanta minuti. (si rimette gli occhiali con due dita) Se fischia ancora storto, lo dico io a Zelo. Non a voce: con il pallone."],
      ];
      say(sw(L, BG.S), () => {
        if (pr >= 2) return ask("voce", "Hai in tasca la cartellina di Sala Arbitri, le targhette fotografate e il taccuino. Neve è lì, a due passi, e sta fingendo di leggere un programma. Gli porti le prove?", [
          { label: "Mostra le prove a Neve", sub: `Ne hai ${pr} su 3`, cls: "hot", fn: htNeve },
          { label: "Tieniti le prove per dopo", fn: htFine },
        ], BG.S);
        htFine();
      });
    }
    function htNeve() {
      const nt = F.get("neve_t", "ironia"), c = compId();
      say(sw([
        ["voce", "Neve prende la cartellina con la delicatezza di chi regge un piatto di brodo troppo pieno. Legge una riga, poi un'altra, poi smette di leggere e cerca il sorriso. Il sorriso è in un altro giacchetto."],
        ["vl_neve", nt === "protesta" ? "Lei me l'aveva detto, a modo suo: «non è la regola di nessuno». Io ho risposto «protesta archiviata». (si siede) Ho archiviato un paese." : "Io… non sapevo i dettagli. Sapevo di un arbitro «professionale», uno sponsor «generoso», una gestione «oculata». Non sapevo il minuto del rigore. Il 71'. (tossisce) È il mio compleanno."],
        ["vl_neve", "Zelo non arbitra il secondo tempo. Chiedo a Vallombra un nome di fiducia. Chi avete?"],
        [c, isB() ? "Abbiamo il sindaco. Ha una fascia, una voce e sette minuti di discorso da fare prima di ogni fischio. È l'unico che nessuno ha mai pagato per niente." : "Il sindaco di Vallombra. Non ha conflitti d'interesse: non ha interessi. E, soprattutto, ha un orologio."],
        ["vl_cornelio", "(compare da dietro un cartellone, con la fascia e il fiato già pronti) Per arbitrare occorre, in primo luogo, un breve inciso sulla storia del fischio, che risale, come sappiamo tutti…"],
        ["vl_neve", "Basta così! Arbitra lei. Ma niente discorso."],
        ["vl_cornelio", "…Solo il preambolo."],
      ], BG.S), () => { F.set("ref2", "cornelio"); F.set("prove_neve", true); note("Neve ha tolto Zelo dal secondo tempo dopo aver visto le prove. Arbitrerà Cornelio, con fascia e preambolo."); htFine(); });
    }
    function htFine() {
      const sc = F.get("remo_scelta", "");
      if (!has("ref2")) F.set("ref2", "zelo");
      F.set("ph5", 2);
      note(F.get("ref2", "zelo") === "zelo" ? "Secondo tempo ancora con Zelo: la Regola del Campo Alto resta in vigore." : `Secondo tempo con ${F.get("ref2") === "cornelio" ? "Cornelio" : "Gaudenzio"} arbitro.`);
      say(sw([["voce", sc === "padre" ? "Torni in campo nel rumore, con il fiato corto e gli occhi di Remo fissi su di te come un muro." : "Torni in campo nel rumore, con il fiato corto e un'impressione strana: qualcosa, sotto l'erba, ha cambiato inclinazione."]], BG.A), done);
    }
    function secondoTempo() {
      const a = F.get("m5a_a", 0), b = F.get("m5a_b", 0), r2 = F.get("ref2", "zelo"), sc = F.get("remo_scelta", "");
      const arb = r2 === "gaud" ? "Gaudenzio Fischietti, con un fischietto d'ottone fermo da ventisei anni" : r2 === "cornelio" ? "il sindaco Cornelio, con la fascia e un preambolo" : "ancora Zelo, con la Regola del Campo Alto";
      X.playMatch({
        id: "vl5b", alt: "az", force: true, azPitch: "neve", weather: "neve", venue: VENUE_CAM, chap: "Vallombra · Derby al Campo Alto · 2° tempo", mate: compName(),
        intro: `Derby al Campo Alto, secondo tempo (45'). Primo tempo: ${a}–${b}. Arbitro: ${arb}.${sc === "padre" ? " Remo gioca arrabbiato." : sc === "verita" || sc === "due" ? " Remo gioca a testa alta, e senza risparmiarsi." : ""} ${compName()} gioca con te.`,
        team: (t, st) => camosci(t, st, edge2()),
        done: (r) => { F.set("m5b_a", r.a); F.set("m5b_b", r.b); F.set("ph5", 3); note(`Derby, secondo tempo: ${r.a}–${r.b}.`); postMatch(); },
      });
    }
    function totale() { return [F.get("m5a_a", 0) + F.get("m5b_a", 0), F.get("m5a_b", 0) + F.get("m5b_b", 0)]; }
    function postMatch() {
      const [A, B] = totale();
      if (!has("m5_set")) {
        if (A === B && !has("m5_rig")) return shootout(A, B);
        F.set("m5_win", A > B || F.get("m5_rig", "") === "win"); F.set("m5_set", true);
      }
      chiusura(A, B);
    }
    function shootout(A, B) {
      const sc = F.get("remo_scelta", ""), need = 5;
      say(sw([["voce", `Fischio finale: ${A}–${B}. Parità sul Campo Alto. Il regolamento del derby non ammette pareggi: si decide ai rigori. Tre tiri a testa, il portiere è Tonio Fiocco, che ha il viso di una porta più piccola.`, BG.A], ["vl_tonio", "Il mio lavoro è stare fermo e sembrare più piccolo. Oggi proverò a sembrare più alto."]], BG.A), () => {
        const tm = X.timing;
        const fb = (label, rounds, bg, react, fin) => { const pts = []; const next = () => { if (pts.length >= rounds) return fin(pts); ask("voce", `${esc(label)} · rigore ${pts.length + 1} di ${rounds}: scegli il momento.`, [1, 2, 3].map((k) => ({ label: ["Subito", "Un attimo", "Adesso"][k - 1], fn: () => { const n = Math.random() < 0.34 ? 3 : Math.random() < 0.6 ? 2 : 1; pts.push(n); say([["voce", react(n)]], next); } })), bg); }; next(); };
        (typeof tm === "function" ? tm : fb)("Rigori", 3, "night", (k) => k === 3 ? "<b>" + T("{tiro}") + "!</b> Tonio si tuffa, tocca appena, e la rete trema." : k === 2 ? "<b>Quasi.</b> Tonio devia sul palo, e il campo trattiene il fiato." : "<b>Parato.</b> Tonio si rialza e fa il saluto ai Camosci.", (pts) => {
          const tot = pts.reduce((a, b) => a + b, 0), win = tot >= need;
          F.set("m5_rig", win ? "win" : "lose"); F.set("m5_win", win); F.set("m5_set", true);
          say(sw([["voce", `Rigori: ${tot} su 9 (ne servivano ${need}). ${win ? "Il pallone entra, la rete si gonfia e il Campo Alto resta zitto un secondo intero, che a Cima Alta è un record." : "Tonio blocca l'ultimo con le due mani, come si ferma una ciotola che scivola. Il Campo Alto esplode."}`], ...(sc === "padre" && !win ? [[remoId(), "Non sono felice di vincere così. Ma non sono neanche triste."]] : [])], BG.A), () => chiusura(A, B));
        });
      });
    }
    function chiusura(A, B) {
      const win = has("m5_win"), r2 = F.get("ref2", "zelo"), sc = F.get("remo_scelta", ""), c = compId(), id = remoId();
      const m = win ? reward("vl_m5_win", { coins: 10 }) : [];
      const rig = F.get("m5_rig", "");
      const L = [
        ["voce", `Fischio finale del derby: ${A}–${B}${rig ? (rig === "win" ? " (ai rigori, per noi)" : " (ai rigori, per loro)") : ""}. ${win ? "Gli Stambecchi vincono sul Campo Alto." : "I Camosci tengono il Campo Alto."}${m.length ? " " + m.join(" · ") + "." : ""}`, BG.A],
        ["vl_noemi", win ? "Qui Radio Nebbia! Vallombra vince a Cima Alta, e non succedeva dalla preistoria del campionato. Ringrazio il meteo, il pubblico di casa e l'arbitro, per aver scelto il momento giusto per essere imparziale." : "Qui Radio Nebbia: i Camosci tengono il Campo Alto. Vallombra esce a testa alta, il che, a milleottocento metri, è una cosa letteralmente vera."],
      ];
      if (r2 === "gaud") L.push(
        ["voce", "A centrocampo, Gaudenzio Fischietti si toglie il fischietto d'ottone dalla bocca. Gli tremano le labbra e non sa come farle smettere. Dal Campo Alto sale un applauso che parte timido, da due sedie, e poi cresce: nessuno ha capito chi sia, ma tutti hanno capito cosa ha fatto."],
        ["voce", "Dalla tribuna scende Vica, con il grembiule giallo ancora addosso. Si ferma a un metro da lui. Si guardano per un tempo che il tabellone non sa misurare."],
        ["vl_vica", "Hai fischiato giusto, Gaudenzio."], ["vl_gaudenzio", "Dopo ventisei anni."], ["vl_vica", "Io ne ho contati ventisei e mezzo. Vieni a mangiare: la polenta si fredda, e il ragazzo ha fame di spiegazioni."],
      );
      else if (r2 === "cornelio") L.push(
        ["vl_cornelio", "Vi comunico che la partita si è svolta secondo il regolamento, il buonsenso e la mia vecchia ernia. Ho fischiato diciassette volte. Una era al gabbiano; mi è sembrato giusto."],
        ["vl_neve", "(col sorriso a metà) Riconosco che la gestione dell'incontro è stata esemplare. Diciamo: sospetta ma esemplare."],
      );
      else L.push(
        ["voce", "Zelo fischia la fine con una espressione da bollitore che cede. Il Campo Alto applaude, per abitudine, come si applaude il tempo che passa."],
        ["vl_neve", "Un derby corretto, un derby corretto! Un derby come i derby devono essere: con tre cartellini e una buona acustica."],
      );
      if (sc === "padre") L.push(
        [id, "Hai giocato bene. Anche troppo. Non mi aspetto un grazie: il grazie, se c'è, ce l'ho in tasca, e dura meno degli occhiali."],
        ["voce", "Si allontana verso il tunnel senza voltarsi. In tribuna, in alto a sinistra, un vecchio con gli occhiali da sole è rimasto in piedi, finché il tunnel non l'ha inghiottito."],
        ["vl_vica", "Ci pensa lui. A volte i figli si fanno scudo con le braccia dei padri, senza accorgersi che sono le stesse. Non è un figlio cattivo: è un figlio con la testa dura. È dei Valanga."],
      );
      else if (sc === "attesa") L.push(
        ["voce", "Vica scende dalla tribuna con il grembiule ancora addosso e porta Remo a un lato del campo, accanto alla panchina. Da lontano si vedono due persone parlare: lei con le mani aperte, lui con le braccia incrociate. A un certo punto lei si ferma. Lui guarda la curva in alto a sinistra."],
        ["voce", "Quando Remo ricompare, ha gli occhiali in mano. Non dice niente. Si siede sulla panchina con i gomiti sulle ginocchia, accanto a te, e per un po' non guardate nessuno."],
        [id, "Mi ha detto tutto. Anche la parte che nessuno sapeva. Non lo odio. Non lo perdono. Per ora, lo osservo. È già un passo."],
      );
      else L.push(
        [id, "Mi ha detto tutto, mio padre, con due fischi e il silenzio. (guarda in alto, verso la curva) Non so come si fa a volere bene a uno che hai conosciuto soltanto per le sue assenze. Ma imparo: imparo in fretta, di solito."],
      );
      if (F.get("vica_t", "") === "patto" && has("patto_rotto")) L.push(["vl_vica", "Mi avevi promesso il fischio finale. (non c'è rabbia: c'è qualcosa di più antico) Ma sapevi che a volte si deve parlare prima del fischio. Hai fatto quello che io non avrei saputo fare. Non ti ringrazio ancora: ti terrò la polenta calda."]);
      L.push(
        [c, isB() ? "Vorrei dire qualcosa di intelligente. Sono troppo stanca anche per le chiavi inglesi. Un derby, una famiglia, un paese: è più di quel che sopporta un turno." : "Annoto per i posteri: il campione non è mai stato più significativo. (si ferma) E io non ho mai avuto meno voglia di annotare."],
        ["vl_vermiglio", win ? "Una vittoria sportiva è una cosa seria, {n}. Congratulazioni. Ma le vittorie, in ingegneria, sono ordinarie: si calcolano. Ci vediamo lunedì: ho l'agenda piena." : "Una sconfitta sportiva è un fatto ordinario, {n}. Si archivia. Ci vediamo lunedì: ho l'agenda piena."],
        ["voce", "L'ingegnere si infila i guanti uno per volta, con un ritmo da orologio, e lascia il palco con Sigillo alle calcagna. Il tintinnio dei suoi passi sulle assi suona come un conto alla rovescia."],
        ["vl_vica", "Il sole sta calando. Vieni alla Stazione di Cima, in basso a sinistra del paese: la cabina delle sei e quarantatré sale da sola, e io ho una busta da consegnare. Radio Nebbia ha già chiamato chi serve."],
        ["vl_noemi", "Messaggio per Teodora Brinzi, capocabina di Vallombra. C'è una busta per te a Cima Alta. Il mittente ha ventisei anni di ritardo e un'ottima calligrafia. Ripeto: ventisei anni di ritardo."],
      );
      say(sw(L, BG.A), () => { F.set("ph5", 4); setStep(N, 6); note("Il derby è finito. Vica aspetta alla Stazione di Cima (SUD-OVEST): Radio Nebbia ha chiamato Teodora."); done(); });
    }


    // ---- la Stazione di Cima: la lettera di Aurelio e il gancio per il capitolo 6
    function stazioneScena() {
      const sc = F.get("remo_scelta", ""), su = F.get("fosco", "su") !== "giu", gau = F.get("ref2", "") === "gaud", c = compId();
      const remoV = sc === "verita" || sc === "due" || sc === "attesa", id = remoId();
      F.set("fin5", true);
      say(sw([
        ["voce", "Il sole cala sul Latte e lo tinge di rosa e di lilla. Sulla banchina di Cima Alta i lampioni si accendono uno dopo l'altro, con una cortesia in ritardo. Vica ha tolto il grembiule e messo una giacca buona, di quelle che si tirano fuori per i funerali e per i matrimoni.", BG.C],
        ["vl_vica", "Non so se ho fatto bene a metterla. Gli abiti buoni, per me, hanno un difetto: puzzano di Occasione."],
        ["voce", "Dal cavo arriva un canto basso, una nota sola. Poi la cabina emerge dalla nebbia, rossa nell'ultima luce, cigolando come un'orchestra di provincia. Le porte si aprono da sole, con un po' di scena."],
        ["voce", "Scende Teodora Brinzi con il registro sotto il braccio e il berretto della compagnia. È sola: nella cabina non c'è nemmeno un posto vuoto in più."],
        ["vl_teodora", su ? "Il biglietto me lo sono timbrato da sola. Prima volta in ventisei anni che salgo da passeggera. Ho lasciato la stazione a Fosco, con l'ordine di non toccare niente. Quindi sarà tutto sottosopra, ma in ordine." : "Il biglietto me lo sono timbrato da sola. Prima volta in ventisei anni che salgo da passeggera. Ho lasciato la stazione a Mirtilla, con l'ordine di non toccare niente. Quindi starà assaggiando le cioccolate."],
        ["vl_teodora", "Vica Valanga."], ["vl_vica", "Teo."], ["vl_teodora", "Sei in ritardo."], ["vl_vica", "Di ventisei anni e mezzo."], ["vl_teodora", "Mezzo?"], ["vl_vica", "Li conto io."],
        ["vl_vica", "Questa è per te. Me l'ha data tuo fratello la mattina della finale. Diceva «dopo». Non ho capito dopo cosa. Poi è arrivato un «dopo» così lungo che mi sono vergognata di consegnarla. Ti avevo detto che sarei venuta io, ricordi? Non sono venuta. Sono rimasta in ritardo."],
        ["voce", "Teodora prende la busta bianca con la scritta «TEO · DOPO», a stilografica, e la tiene in mano come si tiene un uccello caduto dal nido. Non la apre."],
        ["vl_teodora", "Tu leggila. (a Vica, e la voce le trema in un punto solo, nel mezzo) No: tu no. Non ce la faccio a sentire come la pronuncerai. La leggo io, ad alta voce, così, se piango, lo saprete tutti e non dovrò spiegarlo. " + T("{n}") + ", tu resta: il biglietto non te l'ho fatto pagare, in fondo."],
      ], BG.C), () => lettera(sc, su, gau, c, remoV, id));
    }
    function lettera(sc, su, gau, c, remoV, id) {
      say(sw([
        ["voce", "Teodora apre la busta con il pollice, senza strappare. La carta è ruvida, scritta fitta, da una mano che correva avanti ai pensieri. Si schiarisce la gola come davanti a un microfono. Poi legge."],
        ["vl_teodora", "«Teo, se stai leggendo questa, la partita è finita in un modo che non avevo previsto, e io sono in ritardo. Non è una novità: il mio ritardo ha sempre irritato la tua puntualità.»"],
        ["vl_teodora", "«Non aspettarmi con la cabina. Aspettami con il pranzo (il tuo brodo, quello col sedano). Se tardo troppo, scrivi ARRIVATO a matita: l'inchiostro non si cancella, la matita sì, e io voglio poter correggere.»"],
        ["vl_teodora", "«Ti ho lasciato due cose. La prima è una chiave: la trovi nella costa del tuo registro, sotto la carta. Non chiude niente. Apre, e sta alla cabina numero uno. Non chiedermi quale: lo capirai quando la vedrai.»"],
        ["vl_teodora", "«La seconda è un posto. Nell'armadietto di Fosco c'è una maglia col numero tredici. Non è mia, non è di nessuno. È di uno che arriverà. Quando arriva, non fargli pagare il biglietto, anche se il regolamento dice di sì.»"],
        ["vl_teodora", "«P.S. Se senti fischiare corto-lungo-corto da un posto che non è un campo, non spaventarti: è un amico che ha detto la cosa giusta nel modo sbagliato. Digli grazie per me. Tuo, anche in ritardo, Aurelio.»"],
        ["voce", "Nessuno parla. Il cavo, sopra le teste, canta la stessa nota di prima, e per un momento sembra che la risposta venga dal fondo del Latte. Teodora piega la lettera in quattro, la mette nel registro, e con il pollice scorre lungo la costa. Si ferma. Sotto la carta incollata da ventisei anni, qualcosa è duro."],
        ["vl_teodora", "Una chiave. (la tiene sul palmo; è piccola, scura, con un nastro rosso sbiadito) «Cabina numero uno.» Vallombra ha sei cabine. La prima è la sei: la numero uno non esiste. O non è esistita, finora."],
      ], BG.C), () => lettera2(sc, su, gau, c, remoV, id));
    }
    function lettera2(sc, su, gau, c, remoV, id) {
      const L = [];
      if (gau) L.push(
        ["voce", "In fondo alla banchina, appoggiato al palo dell'ultimo lampione, c'è Gaudenzio Fischietti. È sceso con la giacca della festa e gli occhiali da sole. Non ha osato avvicinarsi, e adesso non osa nemmeno andarsene."],
        ["vl_teodora", "«Un amico che ha detto la cosa giusta nel modo sbagliato.» (si volta, lenta) Lei è quello del fischio. Quello del quarantatreesimo."],
        ["vl_gaudenzio", "Sì. (la voce gli esce asciutta, come un lenzuolo) Ho fischiato giusto e ho fischiato la loro fine, signora. Non le chiedo niente. Non me lo merito."],
        ["vl_teodora", "Mio fratello è sceso perché lei ha fischiato. Ed è per quello che quattordici persone hanno rivisto il cielo. Io non sono capace di perdonare e non sono capace di ringraziare, ma ho un biglietto per dire una cosa sola: grazie. È suo. Non gliela faccio pagare."],
        ["voce", "Gaudenzio si toglie, finalmente, gli occhiali da sole. Gli occhi sono rossi, vecchi e chiari. Porta il fischietto d'ottone alle labbra e fischia, piano, tre note: corto, lungo, corto. Dal cavo, lontano, la nota risponde.", ],
      );
      else L.push(
        ["vl_vica", "L'amico del P.S. lo conosci. È quello del sentiero del Fischio, quello che chiamano «lassù». È suo, il fischio del quarantatreesimo. L'ha mandato Aurelio a ringraziare? Credo di sì."],
        ["vl_teodora", "Domani salgo da lui. A piedi: in cabina non ci sono mai riuscita a fare pace con qualcuno. Il cavo, invece, ha fatto pace da solo, e senza avvisare."],
      );
      if (remoV) L.push(
        ["voce", "Dalle scale arrivano Remo e Tonio, con un thermos che sbuffa vapore e due tazze di plastica. Remo tiene gli occhiali da sole in mano, e li guarda come si guarda un oggetto che ha cambiato nome."],
        [id, "Mia madre non ha detto niente a nessuno. Ho dedotto. (a Teodora) Signora, io sono il figlio di quello che ha fischiato. Non so ancora se sia una cosa di cui vergognarsi o di cui vantarsi. Ma se c'è da dire grazie a qualcuno, comincio io: tuo fratello ha capito un fischio, e per ventisei anni nessuno ha capito il suo."],
        ["vl_teodora", "Non è un cognome da perdonare. È un cognome da sapere. Prendo il caffè, grazie."],
      );
      else L.push(["voce", "Sulla banchina, un po' lontano, c'è un ragazzo con gli occhiali da sole che guarda la cabina senza avvicinarsi. Vica lo vede e non dice niente. Gli alza una mano, a metà. Lui non la alza. Poi, di scatto, si volta e se ne va."]);
      L.push(
        ["vl_teodora", "Lascio ARRIVATO a matita. Come ha chiesto lui. (apre il registro e scrive, in una riga nuova, con una grafia che non ha mai avuto tanta fretta) Ma stasera aggiungo una parola a penna: PUNTUALE."],
        [c, isB() ? "Ho il magone di un cuscinetto a sfere sotto carico. È una sensazione che non mi capita. La sto annotando." : "Le statistiche sulla puntualità, a Vallombra, sono un genere narrativo. Questa è la prima volta che ne leggo la fine felice."],
      );
      say(sw(L, BG.C), () => finaleHook(sc, su, gau, remoV));
    }
    function finaleHook(sc, su, gau, remoV) {
      const id = remoId();
      say(sw([
        ["voce", "Nel buio che sale, sulla panca della banchina, la radio a transistor di Vica gracchia da sola. Una voce alta, nasale e un po' emozionata: Noemi."],
        ["vl_noemi", "Qui Radio Nebbia, edizione straordinaria. Dal fondovalle: una colonna di mezzi pesanti della Società Lumen ha lasciato Valle Fonda diretta a Vallombra. A bordo, secondo fonti prudenti, un ordine di demolizione per la funivia e di sigillo definitivo per la miniera. Esecuzione: lunedì, ore sei e quarantatré. Il meteo: nebbia."],
        ["vl_teodora", "Lunedì. Alle sei e quarantatré. (chiude il registro, piano) Hanno scelto l'ora della prima corsa. Hanno senso dell'umorismo, come tutti quelli che non ridono mai."],
        ["vl_vica", "Domenica ti restituisco il campo. Lunedì, se serve, ti restituisco anche me."],
        ...(remoV ? [[id, "I Camosci scendono con voi. Tonio ha già caricato il thermos. Gisella ha già scritto lo striscione: NON TOCCATE LA CABINA (TOCCATELA PIANO). Lo sponsor non lo vuole in tribuna. Faremo a meno dello sponsor."]]
          : [["vl_vica", "Mio figlio ha paura di quello che resta di me. Ci penserà. Non è uno scemo: è un Valanga. I Valanga, di solito, arrivano tardi e quando arrivano portano tutto."]]),
        ...(su ? [] : [["voce", "Da Vallombra, per radio, si sente una voce lontanissima ma inequivocabile: Mirtilla, che chiama il rifugio per un'emergenza di cioccolata."]]),
        ["voce", "Sul pilone alto della funivia, dove il cavo passa dal Latte alla roccia, una figura in cappotto ha acceso l'ultimo lume. Regge una lavagna sollevata sopra la testa. Scrive, in lettere grandi, per tutti: «LA CABINA NUMERO UNO. LUNEDÌ.»"],
        tl({ sicuro: "Allora lunedì andiamo a prenderci la numero uno.", attento: "Una chiave, una cabina che non esiste e un orario. Lunedì sarà una giornata piena.", ironico: "Sei cabine, una numero uno, un lunedì: la burocrazia ha trovato un nuovo modo di farsi voler bene." }),
      ], BG.C), () => fineCapitolo(sc, gau));
      void sc;
    }
    function fineCapitolo(sc, gau) {
      X.finishChapter(N, "camosci"); setStep(N, 7);
      X.lanAdd("vl_teodora");
      if (sc === "attesa") F.set("remo_scelta", "verita");
      if (sc === "verita" || sc === "due" || sc === "attesa") X.lanAdd("vl_remo");
      note("Cap. 5 concluso: lunedì alle 6:43 la Società Lumen demolisce la funivia e sigilla la miniera. Aurelio ha lasciato una chiave per la 'cabina numero uno' nella costa del registro di Teodora.");
      const rw = reward("vl_ch5", { coins: 50, cos: "vl_camoscio" });
      X.say(sw([["voce", "CAPITOLO 5 · I CAMOSCI · CONCLUSO"], ["vl_vica", "Ecco la maglia, la numero 7. Non è del tredici, lo so. Ma finché il tredici non ti starà addosso del tutto, la 7 è la sua miglior imitazione. Prendila: è la Maglia Camoscio."], ["voce", (rw.length ? rw.join(" · ") + ". " : "") + "Il Capitolo 6 non è ancora pronto. Nel frattempo puoi tornare a Cima Alta, raccogliere le ultime schegge, parlare con Remo, con Vica e con tutti gli altri." + (gau ? " Gaudenzio ha lasciato la baita aperta." : "")]], BG.C), done);
    }

    // ---- porte, cabina e oggetti
    function cabinaVallombra() {
      const s = S();
      ask("voce", "La cabina rossa è ferma sul binario d'attesa, agganciata al cavo. Dai finestrini si vede la nebbia e, più su, un puntino giallo fosforescente: Cima Alta. Una targhetta sul fianco dice: «SOLA ANDATA (PER ORA)».", [
        { label: "Sali a Cima Alta", sub: s >= 7 ? "Torna dai Camosci" : s === 6 ? "La cabina delle sei e quarantatré" : "Il derby ti aspetta", cls: "hot", fn: () => go("vl_cimaalta", 5, 22) },
        { label: "Non adesso", fn: done },
      ], BG.P);
    }
    function cabinaCima() {
      const s = S();
      ask("voce", s === 6 ? "La cabina, ferma sulla banchina di Cima Alta. Dai finestrini si vede la nebbia e, più giù, un puntino turchese: Vallombra." : "La cabina rossa di Cima Alta, ferma sul binario. Dai finestrini si vede il Latte e, in fondo, un puntino turchese: Vallombra.", [
        { label: "Scendi a Vallombra", sub: "Si torna quando vuoi", fn: () => go("vl_paese", 8, 21) },
        { label: "Resta a Cima Alta", fn: done },
      ], BG.C);
    }
    function sentiero() {
      if (S() < 4) return say(sw([["voce", "Il cancello del sentiero del Fischio è chiuso con una catena e un cartello: «PROPRIETÀ PRIVATA. NON FISCHIARE.» Qualcuno ha aggiunto a pennarello: «(ma se proprio)»."]], BG.C), done);
      go("vl_baita", 1, 14);
    }
    function osteriaPorta() {
      const s = S();
      if (s < 3) return say(sw([["voce", "L'Osteria del Camoscio è chiusa per «preparazione derby». Da dentro si sente un frullatore e una voce di donna che parla da sola con grande ritmo."]], BG.C), done);
      say(sw([["voce", "La porta dell'Osteria è aperta. Il profumo di polenta vince su tutte le obiezioni. La titolare è davanti alla soglia."]], BG.C), done);
    }
    function chaletPorta() {
      say(sw([["voce", S() === 1 ? "La porta del Chalet è aperta. Sulla terrazza ti aspettano tre persone e un cameriere." : "Il Chalet Neve: porta di larice, targa d'ottone con scritto «PRESIDENZA» e sotto, in corpo più piccolo, il logo dello sponsor. Il campanello suona la musica dei Camosci."]], BG.C), done);
    }
    const flav = (arr, bg) => () => say(sw([["voce", chip(arr)]], bg || bgHere()), done);
    const oggetti = {
      "vl_cimaalta:#": flav(["Il tabellone delle Coppe: tre colonne, tre anni, tre volte CAMOSCI. La quarta colonna è vuota e piena di aspettativa.", "Sul tabellone, in basso, una scritta a gesso: «Prossima Coppa: sabato. Cartellini: tutti pronti.»"]),
      "vl_cimaalta:V": flav(["Un'asta con una bandiera gialla fluo e un camoscio nero. Il camoscio ha l'aria di chi sa dove andare, e non lo dice.", "Lo stendardo dei Camosci. Una pubblicità di fianco dice «Sponsor ufficiale: Lumen». Il camoscio, nel disegno, guarda altrove."]),
      "vl_cimaalta:b": flav(["Una panca gialla con la scritta «OFFERTA DALLA SOCIETÀ». Tutto il villaggio è offerto dalla Società: l'unica cosa che non offre è la gratuità.", "Una panca fresca di vernice gialla. Chi si siede si alza con il pantalone giallo: dicono che sia un battesimo."]),
      "vl_cimaalta:n": flav(["Bacheca: «Si cerca camoscio smarrito (vero)». «Si vende neve, trattabile». «Messa alle 18; per i tifosi dei Camosci, alle 18:05, dopo l'inno».", "Bacheca: «ASSEMBLEA STRAORDINARIA: la Società offre uno sconto sulla prossima Coppa». Qualcuno ha sbarrato «prossima» e scritto «seguente»."]),
      "vl_cimaalta:l": flav(["Un lampione con la luce bianca a LED e il logo dello sponsor. Non brilla da solo: dipende da una bolletta. È meno poetico e più preciso.", "Un lampione a LED. Sul palo, un adesivo: «Illuminiamo il tuo futuro (a pagamento)»."]),
      "vl_cimaalta:t": flav(["Un larice, con la neve sui rami. A Cima Alta anche gli alberi sono gialli a settembre: è l'unica concessione alla natura.", "Un larice con il tronco ricoperto di nastrini gialli. Servono a ricordare che qui si vince. Non si dice chi vince."]),
      "vl_cimaalta:v": flav(["L'ufficio della stazione di Cima: tende gialle, un orario affisso («Partenze: quando c'è nebbia»), e un cartello di Teodora, portato qui tempo fa: «Si prega di non confondere il ritardo con la fantasia».", "L'ufficio d'arrivo della funivia. Sul bancone una campanella e un cartello: «Suonare una volta. Aspettare. Suonare ancora»."]),
      "vl_cimaalta:x": flav(["Casse di divise dei Camosci, ordinate per taglia e per grado di fluo.", "Una cassa piena di pettorine gialle e una col cartello «PETTORINE (ALTRE)»."]),
      "vl_campoalto:#": flav(["Il tabellone elettronico. Per ora segna 0–0, un orologio fermo e «SPONSOR UFFICIALE: LUMEN». Lo sponsor, almeno, non si è dimenticato di accendere.", "Un tabellone con due righe di lampadine: CAMOSCI e OSPITI. Gli ospiti hanno le lampadine più piccole."]),
      "vl_campoalto:j": flav(["Le gradinate gialle e nere. Ci sono sedie portate da casa, con i nomi scritti sul retro: «NONNA ILDA», «ALDO (NON MOVERE)».", "Un gradino con un cuscino ricamato «CAMOSCI» e, sotto, in piccolo, «(ma anche Vallombra, se serve)»."]),
      "vl_campoalto:T": flav(["Un tavolo con il microfono di Radio Nebbia, due tazze di camomilla e un bigliettino: «Silenzio. In diretta.»", "Il tavolo di Noemi: il microfono grande come un frutto e un posacenere pieno di caramelle."]),
      "vl_campoalto:x": flav(["Casse di materiale sportivo: coni, pettorine, un pallone con scritto «ULTIMO». Il pallone, interrogato, non risponde.", "Una cassa con l'etichetta «PALLONI DI RISERVA (PER LA RISERVA)»."]),
      "vl_campoalto:V": flav(["Lo stendardo dei Camosci, sul bordo del campo, si muove pigro. Il camoscio nero sembra voltarsi appena."]),
      "vl_campoalto:l": flav(["Un faro con il logo dello sponsor. Di sera, dicono, illumina anche chi non ne ha bisogno.", "Il faro del Campo Alto: quattro lampade, tre accese. La quarta serve a ricordare che nessuno è perfetto."]),
      "vl_campoalto:w": flav(["Lo spogliatoio dei Camosci: dalla porta gialla escono voci di cori sbilenchi e l'odore di canfora. Qualcuno prova l'inno dei Camosci a quattro voci. Ne vengono fuori due."]),
      "vl_baita:x": flav(["Una catasta di legna di larice, ordinata con la precisione di chi non ha altro da contare. In cima, un biglietto: «Per Vica. Se viene».", "La legna è tagliata a misura di camino, e di un camino solo: quello della baita."], BG.B),
      "vl_baita:b": flav(["Una panca sotto il portico, con due sedute consumate. Una, a sinistra, è più consumata dell'altra: l'altra aspetta.", "Una panca di tronchi, con un cuscino rosso scolorito. Il cuscino è per qualcuno che non è mai venuto, e continua a esserlo."], BG.B),
      "vl_baita:t": flav(["Un larice carico di neve. Sul tronco, a altezza d'uomo, sono incisi ventisei tagli verticali. Uno per anno. Gli ultimi sono freschi.", "Un larice con un fischietto di legno appeso a un ramo. Il vento lo fa suonare: corto, lungo, corto."], BG.B),
      "vl_baita:l": flav(["Una lampada a olio appesa al palo del portico. Si accende da sola, la sera, per cortesia verso chi cammina nel buio."], BG.B),
    };
    function baitaPorta() {
      say(sw([["voce", S() >= 4 ? "La porta della baita è socchiusa: dentro, il camino acceso e la parete dei fischietti. Il padrone di casa è sul portico, accanto a te, e sembra voler restare lì." : "La porta della baita è chiusa. Da dentro non viene nessun rumore, eccetto un tintinnio, a volte, di metallo sottile mosso dal vento."]], BG.B), done);
    }
    function spogliatoio() {
      say(sw([["voce", "Lo spogliatoio dei Camosci: dalla porta gialla escono voci di cori sbilenchi e un odore di canfora e di entusiasmo. Qualcuno prova l'inno dei Camosci a quattro voci. Ne vengono fuori due."]], BG.A), done);
    }

    // ---- gli altri personaggi di Cima Alta
    function tonio() {
      if (!inC()) return delegate("vl_tonio");
      const s = S();
      say(sw([["vl_tonio", chip(s >= 7 ? ["Il thermos è pronto. Ho aggiunto cioccolata di nebbia fitta. Non so che fine farà: so che farà compagnia.", "Il capitano dice «scendiamo». Io dico «scendiamo con le mutande calde». Siamo d'accordo al cinquanta per cento."] : s === 5 ? ["Il mio lavoro è stare fermo e sembrare una porta più piccola. Oggi proverò a sembrare più alta: devo rimediare con l'ingegno.", "Hanno detto che la neve di oggi è sponsorizzata. Non l'ho capito: io la prendo come viene."] : ["Il capitano non dorme da due notti. Io, da quando parlo con lui, dormo il doppio.", "A Cima Alta si diventa portieri per via della pendenza: se non ti metti in porta, rotoli."])]], bgHere()), done);
    }
    function noemi() {
      if (!inC()) return delegate("vl_noemi");
      const s = S(), pr = F.get("prove", "tenute");
      say(sw([["vl_noemi", s === 5 ? "Mi sono piazzata qui con tavolo, microfono e termos: la postazione migliore del Campo Alto. Da dove sono vedo sia lo sponsor sia il pubblico, e per ora hanno la stessa espressione." : s >= 6 ? "Ho trasmesso la partita, la cabina, la lettera (senza nome) e il meteo. Il meteo ha preso più telefonate." : pr === "radio" ? "Qui mi guardano storto, per via del nome letto in diretta. Ma mi hanno anche portato un caffè. Cima Alta è un posto complicato: ti offende e ti nutre." : "Radio Nebbia, in trasferta! Meteo: sole giallo fluo. Attenzione agli occhi, e alle accuse."]], bgHere()), done);
    }
    function cornelio() {
      if (!inC()) return delegate("vl_cornelio");
      const t = cornelioT();
      say(sw([["vl_cornelio", chip(["Sono qui in veste di sindaco ospite, di spettatore e, all'occorrenza, di arbitro. A Cima Alta le cariche sono come le sedie: si portano da casa.", t === "verita" ? "Ho preparato un discorso di nove minuti per il derby. L'ho ridotto a un minuto e mezzo. Mi sento come un cappello che ha perso il fiocco." : "Ho preparato un discorso. Non lo leggo: lo tengo in tasca, come un fischietto da usare solo in emergenza."])]], BG.A), done);
    }
    function mirtilla() {
      if (!inC()) return delegate("vl_mirtilla");
      say(sw([["vl_mirtilla", chip(["Ho portato la cioccolata «Nebbia Gialla». Contiene cioccolato, un tocco di cannella e un rimorso. Si vende bene.", "Il Presidente Neve mi ha detto che l'ospitalità, a Cima Alta, è gratuita. Gli ho venduto una cioccolata a prezzo pieno: gratuita non vuol dire gratis."])]], BG.A), done);
    }
    function comp(id) {
      if (!inC()) return delegate(id);
      if (id !== compId()) return delegate(id);
      const s = S(), b = isB();
      const o = [
        { label: "Che facciamo ora?", sub: "Un consiglio", fn: () => say(sw([[id, goal(s)]], bgHere()), done) },
        { label: "Cosa pensi di Cima Alta?", fn: () => say(sw([[id, chip(b ? ["Mi piace il giallo. Mi piace molto meno che sia tutto del medesimo giallo, come in una catena di montaggio.", "Una cabina che arriva in cima a un paese fluo: la prima cosa che ho pensato è stata «qui qualcuno ha paura del buio».", "Il Presidente ha più denti dei suoi stessi argomenti."] : ["Il giallo non è il colore della gioia: è il colore dell'avvertimento. Fatene quello che volete.", "Tre Coppe in fila, stesso arbitro, stesso sponsor. Lo annoto con la penna rossa.", "Il Presidente sorride a ventotto denti e mente a nessuno: è una combinazione rara."])]], bgHere()), done) },
      ];
      ask(id, b ? "«Dimmi tu: io faccio i bulloni, tu fai i tiri.»" : "«Dimmi tu: io leggo gli indizi, tu li metti in fila.»", o, bgHere());
    }

    // ---- oggetti e personaggi
    const obj = Object.assign({}, oggetti, {
      "vl_paese:k": cabinaVallombra,
      "vl_cimaalta:k": cabinaCima, "vl_cimaalta:>": () => go("vl_campoalto", 1, 12), "vl_cimaalta:^": sentiero,
      "vl_cimaalta:u": osteriaPorta, "vl_cimaalta:w": chaletPorta, "vl_cimaalta:J": clueA,
      "vl_campoalto:<": () => go("vl_cimaalta", 42, 13), "vl_campoalto:m": clueB, "vl_campoalto:U": palla, "vl_campoalto:b": clueC, "vl_campoalto:w": spogliatoio,
      "vl_baita:<": () => go("vl_cimaalta", 22, 4), "vl_baita:m": baitaPorta, "vl_baita:%": cannocchiale,
    });
    const talk = {
      vl_gisella: gisella, vl_neve: neve, vl_vermiglio: vermigliot, vl_sigillo: sigillot, vl_remo: remo, vl_remo_ns: remo, vl_zelo: zelo,
      vl_vica: vica, vl_gaudenzio: gaudenzio, vl_tonio: tonio, vl_noemi: noemi, vl_cornelio: cornelio, vl_mirtilla: mirtilla,
      vl_bianca: () => comp("vl_bianca"), vl_agata: () => comp("vl_agata"),
    };

    return {
      n: N, title: "I Camosci", sub: "Un derby, un fischio e una lettera in ritardo", start: "vl_cimaalta", zones, talk, obj, goal, mood,
      news: (id, s) => {
        if (!inC()) return X.newsOf(id, N);
        if (id === "vl_gisella") return s === 0;
        if (id === "vl_neve") return s === 1;
        if (id === remoId()) return s === 2;
        if (id === "vl_vica") return s === 3 || s === 6;
        if (id === "vl_gaudenzio") return s === 4;
        return false;
      },
      intro: () => [
        ["voce", "La cabina sale dal Latte come un pesce che cambia idea. A mille e cento metri l'aria sa di caminetto; sopra, sa di sole, di plastica nuova e di vernice fresca. Il cavo canta una nota sola, un po' stonata, che a un orecchio fino parrebbe un avviso.", BG.P],
        ["voce", "Cima Alta compare tutta insieme: chalet gialli come evidenziatori, tetti verdi, bandiere con un camoscio nero e, sopra la stazione, un'insegna grande quanto una casa: BENVENUTI A CIMA ALTA · 3 COPPE DI FILA (LA QUARTA IN ARRIVO). Sotto, più piccola: LUMEN ENERGIE ALPINE · OFFICIAL PARTNER.", BG.C],
        [compId(), isB() ? "Gialli. Tutti gialli. Un colore da segnale di pericolo: sarà un caso. Ho preso la chiave inglese: non si sa mai con la vernice fresca." : "Colore Pantone «evidenziatore». In geologia sarebbe zolfo: tossico, ma vistoso. Tengo il taccuino a portata di mano.", BG.C],
        ["voce", "È giovedì. Il derby con i Camosci è sabato, al Campo Alto, con la Regola di casa: arbitro designato dallo sponsor. Intanto, Cima Alta sorride. Sorride troppo, come chi ha un conto da pagare e un cassetto da tenere chiuso.", BG.C],
      ],
    };
  });



  // ------------------------------------------------------------------ debug e avvio
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  if (DEBUG) {
    window.__sc = Object.assign(window.__sc || {}, { KEY, mem, save, reload, norm, F, stepOf, setStep, CHAPTERS, ZONES, go, enterZone, openMain, chapters, notebook, TS, setMood: (n) => { MOOD = n; }, XTOOLS, finishChapter, once, playMatch });
    Object.defineProperty(window.__sc, "api", { configurable: true, get: () => api });
    Object.defineProperty(window.__sc, "MOOD", { configurable: true, get: () => MOOD });
  }
})();
