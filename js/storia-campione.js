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
  let FOTO = null;
  const BGS = { vl_paese: bgPaese, vl_campo: bgCampo, vl_miniera: bgMiniera, vl_interno: bgInterno, vl_foto: bgFoto };
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
  const FLOORS = ',p:"=y;_-';
  const SOLID = "afrehtlknFumvqwx><^bozjXYC";
  const isFloor = (c) => !!c && FLOORS.includes(c);
  const ZX = { map: null, under: null, meta: null, id: "", cvs: null };
  const at = (tx, ty) => (ZX.map && ZX.map[ty] && ZX.map[ty][tx]) || "a";
  const metaAt = (tx, ty) => (ZX.meta && ZX.meta[ty] && ZX.meta[ty][tx]) || null;
  const undAt = (tx, ty) => (ZX.under && ZX.under[ty] && ZX.under[ty][tx]) || ",";
  let GP = null; // contesto 2d di game.js
  const P = (x, y, w, h, c) => { GP.fillStyle = c; GP.fillRect(x, y, w, h); };
  const frNow = () => Math.floor(performance.now() / 16);

  function floorPaint(f, sx, sy, tx, ty) {
    const r = rnd(tx, ty, 1);
    if (f === ",") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#6b7388" : "#727a8f"); P(sx, sy + 7, 16, 1, "#565d70"); P(sx + (ty % 2 ? 4 : 11), sy, 1, 7, "#565d70"); P(sx + (ty % 2 ? 11 : 4), sy + 8, 1, 8, "#565d70"); if (r < 0.12) P(sx + 6, sy + 10, 3, 2, "#8a93a6"); }
    else if (f === "p") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8d95aa" : "#949cb0"); P(sx, sy, 16, 1, "#a7aec1"); P(sx, sy + 15, 16, 1, "#6f778c"); P(sx + 15, sy, 1, 16, "#6f778c"); if ((tx * 3 + ty * 5) % 7 === 0) { P(sx + 6, sy + 6, 4, 4, "#3a6a74"); P(sx + 7, sy + 7, 2, 2, "#7fe3d0"); } }
    else if (f === ":") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#8a7a64" : "#847460"); for (let i = 0; i < 4; i++) P(sx + ((hash(tx * 9 + ty * 3 + i) % 13)), sy + ((hash(tx + ty * 7 + i * 5) % 13)), 2, 1, "#6f6150"); }
    else if (f === '"') { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#5c8a4c" : "#639453"); if (r < 0.5) { P(sx + 3 + ((r * 90) | 0) % 8, sy + 6, 1, 5, "#3f6a35"); P(sx + 8 + ((r * 50) | 0) % 5, sy + 4, 1, 6, "#4a7a3d"); } if (r > 0.86) { P(sx + 5, sy + 9, 2, 2, "#fff6e0"); P(sx + 5, sy + 8, 2, 1, "#ffd23f"); } else if (r < 0.08) { P(sx + 10, sy + 5, 2, 2, "#7a9cff"); } }
    else if (f === "=") { P(sx, sy, 16, 16, "#8a5a34"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "#6a4224"); P(sx + ((tx * 5 + ty) % 2 ? 4 : 11), sy, 1, 16, "#7a4e2c"); }
    else if (f === "y") { P(sx, sy, 16, 16, tx % 2 ? "#4f9a55" : "#58a35d"); if (r < 0.14) P(sx + 4, sy + 5, 1, 3, "#3f8247"); }
    else if (f === ";") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#a8573f" : "#a05039"); if (r < 0.2) P(sx + 5, sy + 8, 3, 1, "#8a4632"); }
    else if (f === "_") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#2d3142" : "#313648"); if (r < 0.3) P(sx + 3 + ((r * 100) | 0) % 9, sy + 4 + ((r * 77) | 0) % 8, 2, 1, "#454b60"); }
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
    floorPaint(ch === "^" ? ":" : ",", sx, sy, tx, ty);
    P(sx + 1, sy + 1, 3, 15, "#5a3a22"); P(sx + 12, sy + 1, 3, 15, "#5a3a22"); P(sx, sy, 16, 3, "#6a4426"); P(sx + 1, sy, 14, 1, "#8a6238");
    g2(GP, ch, sx, sy);
  }
  function g2(g, ch, sx, sy) { // freccia sul cancello
    g.fillStyle = "#ffd23f"; g.beginPath();
    if (ch === ">") { g.moveTo(sx + 6, sy + 6); g.lineTo(sx + 11, sy + 9); g.lineTo(sx + 6, sy + 12); }
    else if (ch === "<") { g.moveTo(sx + 10, sy + 6); g.lineTo(sx + 5, sy + 9); g.lineTo(sx + 10, sy + 12); }
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
  function refreshMood() { const c = activeChapter(); MOOD = c && c.mood ? c.mood(stepOf(c.n)) : 0; }
  function refreshZone() {
    const zr = zoneRec(); if (!zr) return;
    const c = CHAPTERS[zr.ch]; refreshMood(); castHero();
    zr.Z.npcs = (zr.spec.npcs ? zr.spec.npcs(stepOf(c.n)) : []).filter((n) => CAST_OK(n.id));
    zr.Z.hints = typeof zr.spec.hints === "function" ? zr.spec.hints(stepOf(c.n)) : zr.spec.hints || {};
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
    Object.defineProperty(Z, "tail", { enumerable: true, configurable: true, get: () => { const c = CHAPTERS[chN]; return `${c && c.goal ? "Obiettivo: " + T(c.goal(stepOf(chN))) + " " : ""}Menu in basso: Taccuino ed Esci.`; } });
    Z.build = function (m) {
      ZX.map = m; ZX.id = zid; GP = document.getElementById("cv").getContext("2d");
      const Ls = makeLayers(spec.w, spec.h); Ls.lay(0, 0, spec.w - 1, spec.h - 1, ",");
      spec.build(Ls); refreshZoneSoon();
    };
    Z.tile = function (ch, sx, sy, tx, ty) { GP = GP || document.getElementById("cv").getContext("2d"); return drawTile(ch, sx, sy, tx, ty); };
    Z.decor = function (cx, cy) { if (spec.decor) spec.decor(cx, cy, { X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() }); };
    Z.top = function (cx, cy) { if (spec.top) spec.top(cx, cy, { X: (tx) => tx * TS - cx, Y: (ty) => ty * TS - cy, fr: frNow() }); };
    Z.onObj = function (ch, tx, ty) { const c = CHAPTERS[chN]; const f = c && c.obj && (c.obj[zid + ":" + ch] || c.obj[ch]); if (!f) return false; f({ ch, tx, ty, zid }); return true; };
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
      { label: allDone && !nextOk ? "Torna a Vallombra" : m.visit ? "Continua" : "Comincia", sub: c ? `Capitolo ${c.n} · ${c.title}` : "", cls: "hot", fn: continueStory },
      { label: "Taccuino di " + h.name, sub: `Appunti e Lanterne ${m.lan.length}/${LAN_TOTAL}`, fn: () => notebook(openMain, false) },
      { label: "Capitoli", sub: "Le puntate della storia", fn: chapters },
      { label: "◂ Modalità", fn: leaveToModes },
    ], "Vallombra");
  }
  function chapters() {
    const m = mem(), rows = [];
    for (let n = 1; n <= 8; n++) { const c = CHAPTERS[n]; rows.push(c ? `${m.done[n] ? "✓" : "▸"} <b>Capitolo ${n}</b> · ${esc(c.title)} <span style="color:var(--dim)">${esc(m.done[n] ? "concluso" : c.sub || "")}</span>` : `<span style="color:var(--dim)">• Capitolo ${n} · ???</span>`); }
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
  function playMatch(o) {
    castHero();
    api.match({ id: o.id, chap: o.chap, intro: T(o.intro), mate: o.mate, mateGeneric: true, us: o.us || "Stambecchi", min: o.min || 45, team: o.team, hero: undefined,
      onDone: (r) => { const m = mem(); if (r.win) m.wins++; else if (r.a < r.b) m.losses++; save(); refreshZone(); o.done(r); } });
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
  };
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
    const mine = (id) => { const zr = zoneRec(); if (!zr) return null; const c = CHAPTERS[zr.ch]; return c && c.talk && c.talk[id] && zr.Z.npcs.some((n) => n.id === id) ? c.talk[id] : null; };
    window.trTalkHook = function (id) {
      const f = mine(id);
      if (f) { castHero(); f(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
    const prevNews = window.trNewsHook;
    window.trNewsHook = function (id) {
      const zr = zoneRec();
      if (zr && mine(id)) { const c = CHAPTERS[zr.ch]; return c.news ? !!c.news(id, stepOf(c.n)) : false; }
      return typeof prevNews === "function" ? prevNews(id) : null;
    };
    PENDING.splice(0).forEach(addChapter);
    chip();
  }

  // pulsante «Esci» sempre visibile mentre si cammina a Vallombra
  function chip() {
    if (document.getElementById("scExit")) return;
    const st = document.createElement("style");
    st.textContent = "#scExit{position:fixed;left:8px;bottom:8px;z-index:60;display:none;min-height:36px;padding:6px 12px;border-radius:10px;border:1px solid #ffffff55;background:#1b2f7acc;color:#fff;font:700 13px/1.1 system-ui,sans-serif;letter-spacing:.2px;box-shadow:0 2px 8px #0008}#scExit.on{display:block}#scExit:active{transform:translateY(1px)}";
    document.head.appendChild(st);
    const b = document.createElement("button"); b.id = "scExit"; b.type = "button"; b.textContent = "✕ Esci"; b.setAttribute("aria-label", "Esci da Vallombra");
    b.onclick = () => { if (zoneRec()) leave(); };
    document.body.appendChild(b);
    setInterval(() => { const on = !!(zoneRec() && document.body.classList.contains("borgo")); b.classList.toggle("on", on); }, 400);
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
        id: "vl1", chap: "Vallombra · Il Campo Sospeso", mate: "Bianca",
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

  // ------------------------------------------------------------------ debug e avvio
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  if (DEBUG) {
    window.__sc = Object.assign(window.__sc || {}, { KEY, mem, save, reload, norm, F, stepOf, setStep, CHAPTERS, ZONES, go, enterZone, openMain, chapters, notebook, TS, setMood: (n) => { MOOD = n; }, XTOOLS, finishChapter, once, playMatch });
    Object.defineProperty(window.__sc, "api", { configurable: true, get: () => api });
    Object.defineProperty(window.__sc, "MOOD", { configurable: true, get: () => MOOD });
  }
})();
