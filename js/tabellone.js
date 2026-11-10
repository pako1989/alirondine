// js/tabellone.js - «IL TABELLONE» · motore del gioco dell'oca per «Il Gioco dell'Oca del Conte» (e per il cabinato «Oca Express» in Sala Giochi)
// Tabellone di 63 caselle a spirale (9×7) disegnato come il viale di ghiaia del parco: oche, ponte, locanda, pozzo, labirinto, prigione, la Morte e il traguardo.
// Si gioca una «tirata» (da o.from a o.to): due dadi, e col LANCIO A TEMPO (opzione in Impostazioni) se fermi il cursore nella fascia verde correggi il tiro di ±1.
// Gli eredi muovono da soli, ognuno col suo carattere: il notaio bara (+1 di nascosto: con la Lente lo becchi e torna indietro di 3), la medium «prevede» il tuo tiro
// (se lo indovina avanza di 2: correggi il tiro e la smentisci), l'ex terzino entra in scivolata se ti sta a un passo, la cuoca ti regala un biscotto, i gemelli litigano.
// Caselle-campo: Rigore (mira a tempo), Punizione (alzo sopra la barriera), Dribbling (tre frecce in fila). Riuscita +2, errore −2.
// Caselle-storia (o.story): una carta con un personaggio e 2-3 scelte; le scelte tornano nel risultato (picks/flags) e possono spostare, fermare o dare carte.
// Carte-imprevisto in mano (o.hand: id di CARDS): Biscotto +1, Oca di carta (rilancio), Santino (salta una casella cattiva), Lente (becca il notaio), Corda (scambio col primo).
// Opzioni: { title, from, to, rivals: [{ id, n, icon, col, ai }], hand, story: { casella: { who, t, text, opts: [{ label, sub, eff: { move, skip, give, flag } }] } },
//   race (true: finisce appena arriva il primo), diff 0..2, timed, tutorial, draw (carte pescabili), onDone({ win, rank, pos, turns, used, picks, flags, caught, sfide, quit, data }) }
// Test: window.__tabellone.state (phase, pos(id), force(d1, d2), fast(), roll(), pick(i), finish(win)) · pulsante #tbGo a fine tirata.
(function () {
  "use strict";
  if (window.__tabellone) return;
  const M = window.__mini, SS = 2, W = 380, H = 262, esc = M.esc, safe = M.safe;
  const LS = "ali-di-rondine.oca-tempo";
  const timedOn = () => safe(() => localStorage.getItem(LS) !== "0", true);
  const setTimed = (v) => safe(() => localStorage.setItem(LS, v ? "1" : "0"), 0);
  // ------------------------------------------------------------ la spirale: casella i → colonna, riga (si parte in basso a sinistra, si finisce al centro)
  const GX = 10, GY = 22, CW = 40, CH = 34;
  const SP = (() => { const pos = [[-0.32, 6]], seen = new Set(), D = [[1, 0], [0, -1], [-1, 0], [0, 1]]; let x = 0, y = 6, d = 0;
    for (let i = 1; i <= 63; i++) { pos.push([x, y]); seen.add(x + "," + y); if (i === 63) break; let nx = x + D[d][0], ny = y + D[d][1]; if (nx < 0 || nx > 8 || ny < 0 || ny > 6 || seen.has(nx + "," + ny)) { d = (d + 1) % 4; nx = x + D[d][0]; ny = y + D[d][1]; } x = nx; y = ny; }
    return pos; })();
  const cxy = (i) => { const p = SP[Math.max(0, Math.min(63, i))]; return [GX + p[0] * CW + CW / 2, GY + p[1] * CH + CH / 2]; };
  // ------------------------------------------------------------ le caselle classiche
  const BASE = { 6: { k: "ponte", to: 12 }, 19: { k: "locanda", skip: 1 }, 31: { k: "pozzo", skip: 2 }, 42: { k: "labirinto", to: 33 }, 52: { k: "prigione", skip: 2 }, 58: { k: "morte" }, 63: { k: "fine" },
    3: { k: "rigore" }, 11: { k: "dribbling" }, 16: { k: "punizione" }, 25: { k: "rigore" }, 29: { k: "dribbling" }, 38: { k: "punizione" }, 47: { k: "rigore" }, 56: { k: "dribbling" }, 61: { k: "punizione" },
    8: { k: "trappola" }, 34: { k: "trappola" }, 49: { k: "trappola" }, 21: { k: "scambio" }, 44: { k: "scambio" }, 13: { k: "carta" }, 26: { k: "carta" }, 39: { k: "carta" }, 53: { k: "carta" } };
  [5, 9, 14, 18, 23, 27, 32, 36, 41, 45, 50, 54, 59].forEach((n) => (BASE[n] = { k: "oca" }));
  const KM = {
    oca: ["Oca", "Avanzi ancora dello stesso numero."], ponte: ["Il Ponte", "Salti alla casella 12."], locanda: ["La Locanda", "Fermo un turno."], pozzo: ["Il Pozzo", "Fermo due turni."],
    labirinto: ["Il Labirinto", "Torni alla 33."], prigione: ["La Prigione", "Fermo due turni."], morte: ["La Morte", "Torni all'inizio della tirata."], fine: ["Il Traguardo", "La casella 63."],
    rigore: ["Rigore", "Segna: +2. Sbaglia: −2."], punizione: ["Punizione", "Alza sopra la barriera: +2. Sbaglia: −2."], dribbling: ["Dribbling", "Tre finte in fila: +2. Sbaglia: −2."],
    trappola: ["La Buca", "Indietro di 3."], scambio: ["Lo Scambio", "Prendi il posto di chi è più avanti."], carta: ["Carta", "Peschi una carta-imprevisto."]
  };
  const BAD = { locanda: 1, pozzo: 1, prigione: 1, labirinto: 1, morte: 1, trappola: 1 };
  const CARDS = {
    biscotto: { n: "Biscotto di Ernestina", icon: "🍪", d: "+1 al prossimo tiro." }, ocacarta: { n: "Oca di carta", icon: "🪿", d: "Dopo la mossa rilanci i dadi." },
    santino: { n: "Santino del Conte", icon: "🕯️", d: "Salti la prossima casella cattiva (resta finché non serve)." }, lente: { n: "Lente del notaio", icon: "🔍", d: "Tienila in mano: quando il notaio bara, lo becchi." },
    corda: { n: "Corda del ponte", icon: "🪢", d: "Scambi il posto con chi è primo." }
  };
  const AIN = { notaio: "bara", medium: "prevede i tuoi tiri", terzino: "entra in scivolata", cuoca: "ti passa un biscotto", gemello: "litiga col fratello", base: "gioca e basta" };
  let S = null, ui = null, raf = 0, tutC = null, fxo = null;
  const rnd = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wait = (ms) => new Promise((r) => setTimeout(r, S && S.fast ? 1 : ms));
  const cellOf = (i) => (S.board[i] || {}).k || "";
  const hero = () => S.P[0];
  function mk(o, practice) {
    const board = {}; Object.keys(BASE).forEach((k) => (board[k] = Object.assign({}, BASE[k]))); Object.keys(o.board || {}).forEach((k) => (board[k] = Object.assign({}, o.board[k])));
    const story = practice ? {} : Object.assign({}, o.story || {}); Object.keys(story).forEach((k) => { if (!board[k]) board[k] = { k: "storia" }; else board[k].story = true; });
    const from = o.from | 0, to = o.to || 63, h = o.heroLook || {};
    const P = [{ id: "hero", hero: true, n: h.name || "Tu", icon: "⭐", col: h.shirt || "#1f5fbf", pos: from, ax: 0, ay: 0, skip: 0, done: false }]
      .concat((practice ? (o.rivals || []).slice(0, 1) : o.rivals || []).map((r) => Object.assign({ pos: from, skip: 0, done: false, ai: "base", col: "#7c2d12", icon: "♟️" }, r, { img: M.img(r.id) })));
    P.forEach((p) => { const [x, y] = cxy(p.pos); p.ax = x; p.ay = y; });
    return { o, practice, board, story, seen: {}, from, to, P, cur: 0, turn: 0, phase: "roll", dice: [1, 1], spin: 0, cur01: 0, curT: 0, hand: (o.hand || []).filter((c) => CARDS[c]).slice(), used: [], picks: {}, flags: {},
      bonus: 0, extra: false, caught: 0, sfide: { ok: 0, ko: 0 }, pred: 0, fixWin: 0, mini: null, card: null, ranked: [], over: false, win: false, f: 0, msg: "", geese: [0, 1, 2].map((i) => ({ x: -30 - i * 140, y: 0, row: i % 2, sp: 0.35 + rnd() * 0.2 })),
      diff: clamp(o.diff == null ? 1 : o.diff, 0, 2), timed: o.timed != null ? !!o.timed : timedOn(), forced: null, fast: false, resolve: null, gift: false, tackleCd: 0, dbl: 0 };
  }
  // ------------------------------------------------------------ disegno
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
  function goose(g, x, y, s, f, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); const b = Math.sin(f / 5) * 1;
    g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(0, 7, 7, 2, 0, 0, 7); g.fill(); g.fillStyle = "#f8fafc"; g.beginPath(); g.ellipse(0, 1 + b * 0.3, 7, 5, 0, 0, 7); g.fill(); g.fillStyle = "#e2e8f0"; g.beginPath(); g.ellipse(-2, 2, 4, 3, 0.3, 0, 7); g.fill();
    g.strokeStyle = "#f8fafc"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(4, 0); g.quadraticCurveTo(7, -3, 6, -8 + b); g.stroke(); C(g, 6.5, -8 + b, 2.2, "#f8fafc"); R(g, 8, -8.5 + b, 3, 1.6, "#f59e0b"); R(g, 6.5, -9.5 + b, 1, 1, "#111");
    R(g, -2, 6, 1.2, 2 + (f % 10 < 5 ? 1 : 0), "#f59e0b"); R(g, 1, 6, 1.2, 2 + (f % 10 < 5 ? 0 : 1), "#f59e0b"); g.restore(); }
  function icon(g, k, x, y, f) {
    g.save(); g.translate(x, y);
    if (k === "oca") goose(g, 0, 2, 1, f, false);
    else if (k === "ponte") { g.strokeStyle = "#7c4a1e"; g.lineWidth = 3; g.beginPath(); g.arc(0, 8, 11, Math.PI, 0); g.stroke(); R(g, -12, 6, 24, 2, "#a16207"); for (let i = -9; i <= 9; i += 4.5) R(g, i, -3 + Math.abs(i) * 0.2, 1.2, 9, "#7c4a1e"); R(g, -14, 9, 28, 3, "#38bdf8"); }
    else if (k === "locanda") { R(g, -9, -2, 18, 11, "#fde68a"); g.fillStyle = "#b91c1c"; g.beginPath(); g.moveTo(-11, -2); g.lineTo(0, -10); g.lineTo(11, -2); g.fill(); R(g, -2, 3, 4, 6, "#78350f"); R(g, 4, 0, 3, 3, f % 60 < 40 ? "#fbbf24" : "#f59e0b"); R(g, 8, -14, 2, 5, "#57534e"); C(g, 9, -16 - (f / 8 % 4), 1.6, "rgba(226,232,240,.6)"); }
    else if (k === "pozzo") { g.fillStyle = "#78716c"; g.beginPath(); g.ellipse(0, 4, 10, 5, 0, 0, 7); g.fill(); g.fillStyle = "#0c4a6e"; g.beginPath(); g.ellipse(0, 3, 7, 3, 0, 0, 7); g.fill(); R(g, -9, -10, 2, 13, "#57534e"); R(g, 7, -10, 2, 13, "#57534e"); R(g, -10, -11, 20, 2, "#7c2d12"); R(g, -0.5, -9, 1, 8 + Math.sin(f / 20) * 2, "#d6d3d1"); }
    else if (k === "labirinto") { g.strokeStyle = "#166534"; g.lineWidth = 3; g.strokeRect(-11, -10, 22, 20); g.beginPath(); g.moveTo(-5, -10); g.lineTo(-5, 4); g.moveTo(1, 10); g.lineTo(1, -4); g.moveTo(6, -4); g.lineTo(11, -4); g.stroke(); C(g, 8, 6, 1.8, "#fbbf24"); }
    else if (k === "prigione") { R(g, -10, -10, 20, 20, "#44403c"); for (let i = -8; i <= 8; i += 4) R(g, i, -10, 1.6, 20, "#a8a29e"); R(g, -10, -2, 20, 1.6, "#a8a29e"); }
    else if (k === "morte") { C(g, 0, -2, 8, "#e7e5e4"); R(g, -5, 3, 10, 5, "#e7e5e4"); C(g, -3, -2, 2.2, "#1c1917"); C(g, 3, -2, 2.2, "#1c1917"); R(g, -3, 5, 1, 3, "#1c1917"); R(g, 0, 5, 1, 3, "#1c1917"); R(g, 3, 5, 1, 3, "#1c1917"); }
    else if (k === "fine") { const h = 6 + Math.sin(f / 6) * 1.5; R(g, -11, 4, 22, 6, "#a8a29e"); R(g, -9, 2, 18, 3, "#38bdf8"); R(g, -1.5, -6, 3, 9, "#d6d3d1"); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + f / 30; C(g, Math.cos(a) * 5, -6 - h + Math.abs(Math.sin(a + f / 10)) * h, 1.2, "rgba(186,230,253,.9)"); } C(g, 0, -7 - h, 2, "#e0f2fe"); }
    else if (k === "rigore" || k === "punizione" || k === "dribbling") { g.strokeStyle = "#f8fafc"; g.lineWidth = 1.5; g.strokeRect(-11, -9, 22, 8); C(g, 0, 5, 4.5, "#f8fafc"); R(g, -1.5, 3.5, 3, 3, "#111"); g.fillStyle = "#14532d"; g.font = "900 7px system-ui"; g.textAlign = "center"; g.fillText(k[0].toUpperCase(), 0, -2.5); }
    else if (k === "trappola") { g.fillStyle = "#292524"; g.beginPath(); g.ellipse(0, 3, 10, 5, 0, 0, 7); g.fill(); g.fillStyle = "#57534e"; g.beginPath(); g.ellipse(0, 1.5, 10, 4, 0, Math.PI, 0); g.fill(); }
    else if (k === "scambio") { g.strokeStyle = "#7c3aed"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-9, -3); g.lineTo(8, -3); g.moveTo(4, -7); g.lineTo(8, -3); g.lineTo(4, 1); g.moveTo(9, 5); g.lineTo(-8, 5); g.moveTo(-4, 1); g.lineTo(-8, 5); g.lineTo(-4, 9); g.stroke(); }
    else if (k === "carta") { g.rotate(-0.15); R(g, -7, -10, 14, 19, "#fef3c7"); g.strokeStyle = "#b45309"; g.lineWidth = 1.5; g.strokeRect(-7, -10, 14, 19); g.fillStyle = "#b45309"; g.font = "900 10px Georgia, serif"; g.textAlign = "center"; g.fillText("?", 0, 3); }
    else if (k === "storia") { const p = 0.5 + 0.5 * Math.sin(f / 9); g.fillStyle = `rgba(190,18,60,${0.25 * p})`; g.beginPath(); g.arc(0, 0, 13, 0, 7); g.fill(); C(g, 0, 0, 8, "#be123c"); C(g, 0, 0, 5.5, "#e11d48"); g.fillStyle = "#fde68a"; g.font = "900 9px Georgia, serif"; g.textAlign = "center"; g.fillText("C", 0, 3.5); }
    g.restore();
  }
  function board(g, f) {
    // il parco: prato, bordo di siepe, ghiaia
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#3f7a35"); gr.addColorStop(1, "#2f6a2c"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) R(g, (i * 53) % W, (i * 37 + 20) % H, 1, 2, "rgba(190,242,100,.18)");
    R(g, 0, 0, W, 20, "#1f4d24"); for (let x = 0; x < W; x += 10) C(g, x + 5, 4 + Math.sin(x) * 1.5, 7, x % 20 ? "#2d6a30" : "#25602a");
    for (let i = 1; i <= 63; i++) {
      const [x, y] = cxy(i), c = S.board[i] || {}, k = c.k || "", act = i >= S.from && i <= S.to, x0 = x - CW / 2 + 1, y0 = y - CH / 2 + 1;
      g.globalAlpha = act ? 1 : 0.42;
      R(g, x0, y0, CW - 2, CH - 2, "#cbb98f"); R(g, x0 + 1, y0 + 1, CW - 4, CH - 4, k === "morte" ? "#57534e" : k === "fine" ? "#fde68a" : k === "oca" ? "#f1ead6" : BAD[k] ? "#d6c3a0" : k === "storia" || c.story ? "#f5d0d6" : (i % 2 ? "#e9dcc0" : "#e2d2b0"));
      R(g, x0 + 1, y0 + CH - 5, CW - 4, 2, "rgba(0,0,0,.12)"); for (let k2 = 0; k2 < 4; k2++) R(g, x0 + 3 + ((i * 7 + k2 * 9) % (CW - 8)), y0 + 4 + ((i * 5 + k2 * 7) % (CH - 9)), 1.5, 1, "rgba(120,100,70,.35)");
      g.fillStyle = k === "morte" ? "#e7e5e4" : "#57432a"; g.font = "800 7px system-ui"; g.textAlign = "left"; g.fillText(String(i), x0 + 2, y0 + 8);
      if (k) icon(g, k, x + 3, y + 3, f + i * 7); if (c.story && k !== "storia") icon(g, "storia", x + 12, y - 9, f);
      if (i === S.to && i !== 63) { R(g, x + 10, y - 15, 1.5, 14, "#44403c"); g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(11.5 + x, y - 15); g.lineTo(x + 20, y - 12 + Math.sin(f / 6)); g.lineTo(x + 11.5, y - 9); g.fill(); }
      g.globalAlpha = 1;
    }
    if (S.from > 0) { const [x, y] = cxy(S.from); g.strokeStyle = "#16a34a"; g.lineWidth = 2; g.strokeRect(x - CW / 2 + 1, y - CH / 2 + 1, CW - 2, CH - 2); }
    else { const [x, y] = cxy(1); g.fillStyle = "#14532d"; g.font = "900 6px system-ui"; g.textAlign = "center"; g.fillText("VIA ▸", x - 6, y + 14); }
    // oche vere che attraversano il parco
    S.geese.forEach((q, i) => { q.x += q.sp; if (q.x > W + 40) { q.x = -40 - rnd() * 200; q.row = (q.row + 1) % 3; } const y = q.row === 0 ? 12 : q.row === 1 ? GY + 3 * CH : GY + 6 * CH + 12; g.globalAlpha = q.row === 1 ? 0.85 : 1; goose(g, q.x, y, 0.9, f + i * 13, false); g.globalAlpha = 1; });
    // la casella in cui sei
    const me = hero(), [mx, my] = cxy(me.pos); g.strokeStyle = `rgba(250,204,21,${0.5 + 0.4 * Math.sin(f / 6)})`; g.lineWidth = 2; g.strokeRect(mx - CW / 2 + 1, my - CH / 2 + 1, CW - 2, CH - 2);
  }
  function pawn(g, p, x, y, f) {
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y + 9, 7, 2.5, 0, 0, 7); g.fill();
    R(g, x - 5, y + 1, 10, 8, p.col); g.strokeStyle = "rgba(0,0,0,.5)"; g.lineWidth = 1; g.strokeRect(x - 5, y + 1, 10, 8);
    g.save(); g.beginPath(); g.arc(x, y - 3, 6.5, 0, 7); g.clip(); const im = p.img;
    if (im && im.complete && im.naturalWidth) g.drawImage(im, x - 6.5, y - 10, 13, 13); else { g.fillStyle = p.hero ? "#fde68a" : "#e7d5c0"; g.fillRect(x - 7, y - 10, 14, 14); g.font = "9px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(p.icon, x, y - 2.5); g.textBaseline = "alphabetic"; }
    g.restore(); g.strokeStyle = p.hero ? "#facc15" : "#fff"; g.lineWidth = p.hero ? 2 : 1.2; g.beginPath(); g.arc(x, y - 3, 6.5, 0, 7); g.stroke();
    if (p.skip > 0) { g.fillStyle = "#fff"; g.font = "800 6px system-ui"; g.textAlign = "center"; g.fillText("z".repeat(Math.min(3, p.skip)), x + 8, y - 9 - (f / 10 % 3)); }
  }
  function die(g, x, y, v, s, rot) {
    g.save(); g.translate(x, y); g.rotate(rot || 0); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(-s / 2 + 2, -s / 2 + 3, s, s); g.fillStyle = "#fffbeb"; g.beginPath(); g.roundRect(-s / 2, -s / 2, s, s, s / 5); g.fill(); g.strokeStyle = "#a16207"; g.lineWidth = 1.5; g.stroke();
    const d = s / 4, P = { 1: [[0, 0]], 2: [[-d, -d], [d, d]], 3: [[-d, -d], [0, 0], [d, d]], 4: [[-d, -d], [d, -d], [-d, d], [d, d]], 5: [[-d, -d], [d, -d], [0, 0], [-d, d], [d, d]], 6: [[-d, -d], [d, -d], [-d, 0], [d, 0], [-d, d], [d, d]] }[v] || [];
    P.forEach(([a, b]) => C(g, a, b, s / 11, v === 1 ? "#b91c1c" : "#1c1917")); g.restore();
  }
  function scene(g, f) {
    board(g, f);
    // pedine: chi è nella stessa casella si stringe
    const by = {}; S.P.forEach((p) => { const k = Math.round(p.ax) + "," + Math.round(p.ay); (by[k] = by[k] || []).push(p); });
    Object.values(by).forEach((L) => L.forEach((p, i) => { const n = L.length, ox = n > 1 ? (i - (n - 1) / 2) * 9 : 0; pawn(g, p, p.ax + ox, p.ay - (p.hop || 0), f); }));
    // striscia in alto
    const cur = S.P[S.cur] || hero(); g.fillStyle = "rgba(15,23,15,.75)"; g.fillRect(0, 0, W, 18); g.fillStyle = "#fef3c7"; g.font = "800 8px system-ui"; g.textAlign = "left";
    g.fillText(S.over ? "Tirata finita" : `Turno ${S.turn + 1} · ${cur.hero ? "tocca a te" : "tocca a " + cur.n}`, 6, 12); g.textAlign = "right"; g.fillText(`Casella ${hero().pos} → ${S.to}${S.from ? "  (dalla " + S.from + ")" : ""}`, W - 6, 12);
    if (S.pred && !S.over) { g.textAlign = "center"; g.fillStyle = "#e9d5ff"; g.fillText(`🔮 La medium prevede: ${S.pred}`, W / 2, 12); }
    // dadi e lancio a tempo
    if (S.phase === "spin" || S.phase === "fix" || S.showDice > 0) {
      g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(W / 2 - 70, 82, 140, 70); const sp = S.phase === "spin";
      die(g, W / 2 - 22, 112, S.dice[0], 30, sp ? Math.sin(f / 2) * 0.4 : 0); die(g, W / 2 + 22, 112, S.dice[1], 30, sp ? -Math.sin(f / 2.3) * 0.4 : 0);
      if (S.timed && (sp || S.phase === "fix")) { const bx = W / 2 - 60, by2 = 136, bw = 120, gz = S.green; R(g, bx, by2, bw, 8, "#1c1917"); R(g, bx + bw * gz[0], by2, bw * (gz[1] - gz[0]), 8, "#16a34a"); R(g, bx + bw * S.cur01 - 1.5, by2 - 3, 3, 14, "#facc15"); g.fillStyle = "#fef3c7"; g.font = "700 7px system-ui"; g.textAlign = "center"; g.fillText(sp ? "ferma nel verde: correggi di 1" : S.fixWin ? "NEL VERDE!" : "fuori", W / 2, 150); }
    }
    if (S.mini) drawMini(g, f);
    if (S.card) drawCard(g, f);
    if (S.over) { g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 90, W, 60); g.textAlign = "center"; g.font = "900 20px Georgia, serif"; g.fillStyle = S.win ? "#fde68a" : "#e7e5e4"; g.fillText(S.practice ? "PROVA FINITA" : S.win ? "PRIMO AL TRAGUARDO!" : `ARRIVATO ${S.rank}°`, W / 2, 120); g.font = "700 9px system-ui"; g.fillStyle = "#fef3c7"; g.fillText(`${S.turn} turni · campo ${S.sfide.ok}/${S.sfide.ok + S.sfide.ko}${S.caught ? " · notaio beccato " + S.caught : ""}`, W / 2, 138); }
    fxo.draw(g);
  }
  // ------------------------------------------------------------ minigiochi delle caselle-campo
  function drawMini(g, f) {
    const m = S.mini; g.fillStyle = "rgba(10,30,14,.92)"; g.fillRect(20, 26, W - 40, H - 34); g.strokeStyle = "#fde68a"; g.lineWidth = 2; g.strokeRect(20, 26, W - 40, H - 34);
    for (let i = 0; i < 6; i++) R(g, 22, 70 + i * 28, W - 44, 14, i % 2 ? "#2f6b33" : "#357538");
    g.fillStyle = "#fde68a"; g.font = "900 12px system-ui"; g.textAlign = "center"; g.fillText(KM[m.k][0].toUpperCase() + (m.who ? " · " + m.who : ""), W / 2, 42);
    const gx = W / 2 - 70, gw = 140, gy = 58;
    if (m.k === "rigore" || m.k === "punizione") {
      g.strokeStyle = "#f8fafc"; g.lineWidth = 3; g.beginPath(); g.moveTo(gx, gy + 50); g.lineTo(gx, gy); g.lineTo(gx + gw, gy); g.lineTo(gx + gw, gy + 50); g.stroke(); g.strokeStyle = "rgba(248,250,252,.25)"; g.lineWidth = 1; for (let i = 8; i < gw; i += 10) { g.beginPath(); g.moveTo(gx + i, gy); g.lineTo(gx + i, gy + 50); g.stroke(); }
      const kx = gx + gw / 2 + (m.kd || 0) * (m.t > 0 ? Math.min(1, m.t / 12) : 0) * 44; R(g, kx - 7, gy + 22, 14, 20, "#f59e0b"); C(g, kx, gy + 17, 5, "#e0b48a"); R(g, kx - 16, gy + 24, 9, 4, "#f59e0b"); R(g, kx + 7, gy + 24, 9, 4, "#f59e0b");
      if (m.k === "punizione") for (let i = 0; i < 4; i++) { const bx = W / 2 - 24 + i * 14; R(g, bx - 4, 130, 10, 20, "#be123c"); C(g, bx + 1, 126, 4.5, "#e0b48a"); }
      const aimX = gx + gw / 2 + m.a * (gw / 2 + 14), aimY = m.k === "punizione" ? gy + 50 - m.h * 64 : gy + 30;
      if (m.t <= 0) { g.strokeStyle = "#facc15"; g.lineWidth = 2; g.beginPath(); g.arc(aimX, aimY, 6, 0, 7); g.moveTo(aimX - 9, aimY); g.lineTo(aimX + 9, aimY); g.moveTo(aimX, aimY - 9); g.lineTo(aimX, aimY + 9); g.stroke(); }
      if (m.k === "punizione") { R(g, gx + gw + 18, gy - 12, 6, 64, "#1c1917"); R(g, gx + gw + 18, gy - 12 + 64 * (1 - m.ok[1]), 6, 64 * (m.ok[1] - m.ok[0]), "#16a34a"); R(g, gx + gw + 15, gy + 52 - m.h * 64, 12, 3, "#facc15"); }
      else { R(g, gx - 14, gy + 62, gw + 28, 5, "#1c1917"); }
      const bp = m.t > 0 ? Math.min(1, m.t / 14) : 0, bx = W / 2 + (aimX - W / 2) * bp, by = 205 + (aimY - 205) * bp - Math.sin(bp * Math.PI) * (m.k === "punizione" ? 40 : 6);
      C(g, bx, by, 5 - bp * 1.5, "#f8fafc"); R(g, bx - 1.5, by - 1.5, 3, 3, "#111");
    } else if (m.k === "dribbling") {
      const dx = W / 2 + Math.sin(f / 9) * 30; R(g, dx - 7, 92, 14, 22, "#7c2d12"); C(g, dx, 86, 6, "#e0b48a"); R(g, dx - 18, 100, 11, 4, "#7c2d12"); R(g, dx + 7, 100, 11, 4, "#7c2d12");
      const ar = { l: "←", u: "↑", r: "→" }; g.font = "900 26px system-ui"; m.seq.forEach((s, i) => { g.fillStyle = i < m.i ? "#4ade80" : i === m.i ? "#facc15" : "rgba(254,243,199,.4)"; g.fillText(ar[s], W / 2 - 50 + i * 50, 160); });
      R(g, W / 2 - 60, 172, 120, 6, "#1c1917"); R(g, W / 2 - 60, 172, 120 * clamp(m.left / m.max, 0, 1), 6, "#f59e0b");
      C(g, W / 2 + (m.i - 1) * 30, 200, 5, "#f8fafc");
    }
    if (m.res != null) { g.font = "900 22px system-ui"; g.fillStyle = m.res ? "#4ade80" : "#f87171"; g.strokeStyle = "#000"; g.lineWidth = 4; const t = m.res ? (m.k === "dribbling" ? "SALTATO!" : "GOL!") : m.k === "dribbling" ? "PALLA PERSA" : m.miss ? "FUORI!" : "PARATA!"; g.strokeText(t, W / 2, 245); g.fillText(t, W / 2, 245); }
  }
  function sfida(k, who) {
    return new Promise((res) => {
      const d = S.diff, m = { k, who, t: 0, a: -1, h: 0, kd: 0, res: null, ok: [0.5 - 0.04 * d, 0.84 - 0.04 * d], seq: [], i: 0, left: 0, max: 0, done: (v) => { m.res = v; ui.bt.innerHTML = ""; setTimeout(() => { S.mini = null; res(v); }, S.fast ? 1 : 900); } };
      m.ok = [0.48 + 0.03 * d, 0.86 - 0.03 * d];
      S.mini = m; const sp = 0.045 + 0.012 * d;
      if (k === "dribbling") {
        m.seq = [0, 1, 2].map(() => ["l", "u", "r"][Math.floor(rnd() * 3)]); m.max = m.left = 150 - d * 25;
        const tap = (s) => { if (m.res != null) return; if (s === m.seq[m.i]) { m.i++; fxo.text("✓", W / 2 - 50 + (m.i - 1) * 50, 140, "#4ade80"); if (m.i >= 3) m.done(true); } else m.done(false); };
        ui.bt.innerHTML = `<button data-d="l">←</button><button data-d="u">↑</button><button data-d="r">→</button>`; ui.bt.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => tap(b.dataset.d)));
        m.tick = () => { if (m.res == null && --m.left <= 0) m.done(false); }; m.auto = () => { m.seq.forEach(tap); };
      } else {
        m.tick = () => { if (m.t > 0) { if (++m.t === 16) { const save = k === "rigore" ? Math.abs(m.a - m.kd * 0.66) < 0.36 : false; m.miss = k === "rigore" ? Math.abs(m.a) > 0.95 : !(m.h >= m.ok[0] && m.h <= m.ok[1]); m.done(!save && !m.miss); } return; } m.ph = (m.ph || 0) + sp; if (k === "rigore") m.a = Math.sin(m.ph) * 1.05; else { m.h = 0.5 + 0.5 * Math.sin(m.ph); m.a = Math.sin(m.ph * 0.37) * 0.5; } };
        const shoot = () => { if (m.t > 0 || m.res != null) return; m.t = 1; m.kd = [-1, 0, 1][Math.floor(rnd() * 3)]; ui.bt.innerHTML = ""; };
        ui.bt.innerHTML = `<button class="pw" data-s="1">⚽ ${k === "rigore" ? "Tira!" : "Calcia!"}<small>${k === "rigore" ? "lontano dal portiere, dentro i pali" : "quando l'alzo è nel verde"}</small></button>`; ui.bt.querySelector("[data-s]").onclick = shoot;
        m.auto = (good) => { if (k === "rigore") { m.a = good ? 0.8 : 0; m.t = 1; m.kd = good ? -1 : 0; } else { m.h = good ? (m.ok[0] + m.ok[1]) / 2 : 0.1; m.t = 1; m.kd = 0; } };
      }
      ui.lg.innerHTML = `<b>${esc(KM[k][0])}</b>: ${k === "rigore" ? "il mirino scorre da un palo all'altro: tira quando è lontano dal centro, ma dentro la porta." : k === "punizione" ? "l'alzo sale e scende a destra: calcia quando è nella fascia verde, sopra la barriera e sotto la traversa." : "tocca le tre frecce nell'ordine, prima che finisca il tempo."}`;
    });
  }
  // ------------------------------------------------------------ carta-storia
  function drawCard(g, f) {
    const c = S.card; g.fillStyle = "rgba(20,10,6,.86)"; g.fillRect(0, 18, W, H - 18);
    g.save(); g.translate(W / 2, 128); g.rotate(Math.sin(f / 40) * 0.01); R(g, -150, -96, 300, 192, "#fef3c7"); g.strokeStyle = "#9f1239"; g.lineWidth = 3; g.strokeRect(-146, -92, 292, 184); g.strokeStyle = "#b45309"; g.lineWidth = 1; g.strokeRect(-141, -87, 282, 174);
    const im = c.img; R(g, -132, -78, 70, 70, "#e7d5c0"); if (im && im.complete && im.naturalWidth) g.drawImage(im, -132, -78, 70, 70); else { g.font = "40px serif"; g.textAlign = "center"; g.fillText(c.icon || "📜", -97, -30); }
    g.strokeStyle = "#78350f"; g.lineWidth = 2; g.strokeRect(-132, -78, 70, 70);
    g.fillStyle = "#7f1d1d"; g.font = "900 14px Georgia, serif"; g.textAlign = "left"; g.fillText(c.t || "Una casella", -52, -60); g.fillStyle = "#78350f"; g.font = "italic 700 9px Georgia, serif"; g.fillText(`Casella ${c.cell}${c.n ? " · " + c.n : ""}`, -52, -46);
    g.fillStyle = "#1c1917"; g.font = "10px Georgia, serif"; const words = String(c.text || "").replace(/<[^>]+>/g, "").split(" "); let line = "", y = -26, x0 = -52;
    words.forEach((w) => { const tt = line ? line + " " + w : w; if (g.measureText(tt).width > (y < 0 ? 186 : 270)) { g.fillText(line, x0, y); line = w; y += 13; if (y >= 2) x0 = -132; } else line = tt; }); if (line) g.fillText(line, x0, y);
    C(g, 128, 74, 11, "#9f1239"); g.fillStyle = "#fde68a"; g.font = "900 10px Georgia, serif"; g.textAlign = "center"; g.fillText("P", 128, 78); g.restore();
  }
  function story(cell) {
    return new Promise((res) => {
      const st = S.story[cell]; S.seen[cell] = true; const im = st.who ? M.img(st.who) : null; S.card = Object.assign({ cell, img: im }, st);
      ui.lg.innerHTML = `<b>${esc(st.t || "Casella " + cell)}</b> · ${st.text || ""}`;
      const opts = st.opts && st.opts.length ? st.opts : [{ label: "Avanti ▸" }];
      ui.bt.innerHTML = opts.map((o, i) => `<button data-o="${i}">${esc(o.label)}${o.sub ? `<small>${esc(o.sub)}</small>` : ""}</button>`).join("");
      const pick = async (i) => { ui.bt.innerHTML = ""; S.card = null; S.picks[cell] = i; const e = (opts[i] && opts[i].eff) || {}; if (opts[i] && opts[i].after) ui.lg.innerHTML = opts[i].after; await effect(hero(), e); await wait(opts[i] && opts[i].after ? 1400 : 200); res(i); };
      ui.bt.querySelectorAll("[data-o]").forEach((b) => (b.onclick = () => pick(+b.dataset.o))); S.pickFn = pick;
    });
  }
  async function effect(p, e) {
    if (e.flag) S.flags[e.flag] = true; if (e.give && CARDS[e.give]) { S.hand.push(e.give); fxo.text(CARDS[e.give].icon + " +1", p.ax, p.ay - 14, "#fde68a"); }
    if (e.skip) p.skip += e.skip; if (e.bonus) S.bonus += e.bonus;
    if (e.move) await moveTo(p, clamp(p.pos + e.move, S.from, S.to), true);
    if (e.rival && e.rmove) { const r = S.P.find((q) => q.id === e.rival); if (r && !r.done) await moveTo(r, clamp(r.pos + e.rmove, S.from, S.to - 1), true); }
  }
  // ------------------------------------------------------------ movimento
  async function moveTo(p, to, jump) {
    const step = to > p.pos ? 1 : -1;
    if (jump) { const [x, y] = cxy(to); const sx = p.ax, sy = p.ay; for (let t = 1; t <= 10; t++) { p.ax = sx + (x - sx) * t / 10; p.ay = sy + (y - sy) * t / 10; p.hop = Math.sin(t / 10 * Math.PI) * 14; await wait(30); } p.hop = 0; p.pos = to; return; }
    while (p.pos !== to) { p.pos += step; const [x, y] = cxy(p.pos); const sx = p.ax, sy = p.ay; for (let t = 1; t <= 4; t++) { p.ax = sx + (x - sx) * t / 4; p.ay = sy + (y - sy) * t / 4; p.hop = Math.sin(t / 4 * Math.PI) * 6; await wait(28); } p.hop = 0; if (p.hero) S.tick && S.tick(); }
  }
  async function moveBy(p, n) {
    const tgt = p.pos + n;
    if (tgt <= S.to) return moveTo(p, tgt);
    if (S.to === 63) { await moveTo(p, 63); const back = 63 - (tgt - 63); log(`${p.n}: troppo lungo, rimbalza indietro alla ${back}.`); await wait(250); return moveTo(p, Math.max(S.from, back)); }
    return moveTo(p, S.to);
  }
  function log(t) { S.msg = t; if (ui && !S.card && !S.mini) ui.lg.innerHTML = t; }
  const nm = (p) => (p.hero ? "Tu" : p.n);
  async function arrive(p) {
    if (p.done || p.pos < S.to) return false; p.done = true; S.ranked.push(p); fxo.burst(p.ax, p.ay, 24, ["#fde68a", "#f8fafc", "#4ade80"]);
    log(p.hero ? `<b>Sei arrivato alla ${S.to}!</b>` : `<b>${esc(p.n)}</b> arriva alla ${S.to}.`);
    if (p.hero || (S.o.race && !S.practice) || S.P.every((q) => q.done)) { S.over = true; S.rank = S.ranked.indexOf(hero()) + 1 || S.ranked.length + 1; S.win = S.rank === 1; }
    await wait(500); return true;
  }
  async function land(p, n, prev, depth) {
    if (await arrive(p)) return;
    // la casella è già occupata: chi c'era torna dove eri tu (regola antica)
    const other = S.P.find((q) => q !== p && !q.done && q.pos === p.pos && p.pos !== S.from && !BASE[p.pos]);
    if (other && prev != null && prev !== p.pos) { log(`${nm(p)} ${p.hero ? "arrivi" : "arriva"} sulla casella di ${nm(other)}: ${nm(other)} torna alla ${prev}.`); await wait(350); await moveTo(other, prev, true); }
    const c = S.board[p.pos] || {}, k = c.k; if (!k || k === "storia") return;
    if (BAD[k] && p.hero && S.hand.includes("santino")) { use("santino"); log(`🕯️ Il Santino del Conte ti salva da ${KM[k][0]}.`); fxo.text("🕯️", p.ax, p.ay - 12, "#fde68a"); await wait(600); return; }
    const say = (t) => { log(`${nm(p)} · <b>${KM[k][0]}</b>: ${t}`); };
    if (k === "oca") { if ((depth || 0) > 3) return; say(`avanti ancora di ${n}!`); fxo.text("🪿 +" + n, p.ax, p.ay - 12, "#fff"); await wait(400); const pv = p.pos; await moveBy(p, n); return land(p, n, pv, (depth || 0) + 1); }
    if (k === "ponte") { say("salti alla 12."); await wait(300); await moveTo(p, Math.min(c.to || 12, S.to), true); return land(p, 0, null, 9); }
    if (k === "locanda" || k === "pozzo" || k === "prigione") { p.skip += c.skip || 1; say(`fermo ${c.skip || 1} ${c.skip > 1 ? "turni" : "turno"}.`); await wait(500); return; }
    if (k === "labirinto") { say(`ti perdi tra le siepi: torni alla ${Math.max(S.from, c.to || 33)}.`); await wait(500); await moveTo(p, Math.max(S.from, c.to || 33), true); return; }
    if (k === "morte") { say(`torni alla ${S.from || 1}.`); fxo.shake && fxo.shake(6); await wait(600); await moveTo(p, S.from, true); return; }
    if (k === "trappola") { say("indietro di 3."); await wait(400); await moveTo(p, Math.max(S.from, p.pos - 3)); return; }
    if (k === "scambio") { const lead = S.P.filter((q) => q !== p && !q.done && q.pos > p.pos).sort((a, b) => b.pos - a.pos)[0]; if (!lead) { say("nessuno davanti: niente scambio."); await wait(400); return; } say(`scambio con ${nm(lead)} (casella ${lead.pos})!`); const a = p.pos, b = lead.pos; await Promise.all([moveTo(p, b, true), moveTo(lead, a, true)]); return; }
    if (k === "carta") { if (p.hero) { const pool = (S.o.draw || Object.keys(CARDS)).filter((x) => CARDS[x]), id = pool[Math.floor(rnd() * pool.length)]; S.hand.push(id); say(`peschi ${CARDS[id].icon} <b>${CARDS[id].n}</b>.`); fxo.text(CARDS[id].icon, p.ax, p.ay - 12, "#fde68a"); await wait(700); } else { const v = rnd() < 0.5 ? 2 : -2; say(v > 0 ? "carta buona, avanti di 2." : "carta storta, indietro di 2."); await wait(400); await moveTo(p, clamp(p.pos + v, S.from, S.to - 1)); } return; }
    if (k === "rigore" || k === "punizione" || k === "dribbling") {
      let ok; if (p.hero) { ok = await sfida(k, ""); if (ok) S.sfide.ok++; else S.sfide.ko++; } else { ok = rnd() < (p.ai === "terzino" ? 0.65 : 0.5); say(ok ? "ce la fa: +2." : "sbaglia: −2."); await wait(500); }
      if (p.hero) say(ok ? "riuscito! +2." : "niente da fare: −2."); await moveTo(p, clamp(p.pos + (ok ? 2 : -2), S.from, S.to)); if (await arrive(p)) return; return;
    }
  }
  function use(id) { const i = S.hand.indexOf(id); if (i >= 0) { S.hand.splice(i, 1); S.used.push(id); } }
  // ------------------------------------------------------------ turni
  const roll = () => [1 + Math.floor(rnd() * 6), 1 + Math.floor(rnd() * 6)];
  function input(btns, msg) { return new Promise((res) => { S.resolve = res; if (msg) log(msg); ui.bt.innerHTML = btns.map((b, i) => `<button data-b="${i}" class="${b.cls || ""}" ${b.dis ? "disabled" : ""}>${b.label}${b.sub ? `<small>${b.sub}</small>` : ""}</button>`).join(""); ui.bt.querySelectorAll("[data-b]").forEach((b) => (b.onclick = () => { const f = btns[+b.dataset.b]; if (f && f.v !== undefined) { ui.bt.innerHTML = ""; S.resolve = null; res(f.v); } })); S.btns = btns; }); }
  async function heroTurn(p) {
    const med = S.P.find((q) => q.ai === "medium" && !q.done);
    S.pred = med ? 4 + Math.floor(rnd() * 7) : 0;
    for (;;) {
      const hand = S.hand.filter((c) => c !== "lente" && c !== "santino");
      const b = [{ label: "🎲 Lancia i dadi", sub: S.timed ? "poi ferma il cursore nel verde" : "due dadi", cls: "pw", v: "roll" }];
      if (hand.length) b.push({ label: `🃏 Carte (${hand.length})`, sub: hand.map((c) => CARDS[c].icon).join(" "), v: "cards" });
      b.push({ label: "◂ Esci", sub: "la tirata si riprende dopo", v: "quit" });
      const a = await input(b, `${S.bonus ? `🍪 +${S.bonus} al tiro. ` : ""}${S.pred ? `🔮 ${esc(med.n)} prevede <b>${S.pred}</b>: se fai proprio quel numero, avanza di 2. ` : ""}${S.extra ? "🪿 Dopo la mossa rilanci. " : ""}Tocca a te.`);
      if (a === "quit") { S.quit = true; S.over = true; return; }
      if (a === "cards") { const c = await input(hand.map((id) => ({ label: `${CARDS[id].icon} ${CARDS[id].n}`, sub: CARDS[id].d, v: id })).concat([{ label: "◂ Indietro", v: "" }]), "Quale carta giochi?"); if (c) await playCard(c); if (S.over) return; continue; }
      break;
    }
    // il lancio
    S.phase = "spin"; S.dice = roll(); const w = 0.2 - 0.03 * S.diff, c0 = 0.25 + rnd() * 0.5; S.green = [c0 - w / 2, c0 + w / 2]; S.cur01 = 0; S.curT = 0;
    const stop = await new Promise((res) => { S.resolve = res; ui.bt.innerHTML = `<button class="pw" id="tbStop">⏱ ${S.timed ? "Ferma!" : "…"}</button>`; ui.bt.querySelector("#tbStop").onclick = () => res(true); S.spinLeft = S.timed ? 150 : 40; });
    S.resolve = null; const d = S.forced || roll(); S.forced = null; S.dice = d.slice(); ui.bt.innerHTML = "";
    let sum = d[0] + d[1]; S.fixWin = S.timed && stop === true && S.cur01 >= S.green[0] && S.cur01 <= S.green[1];
    if (S.fixWin) { S.phase = "fix"; const v = await input([{ label: `− 1 → ${sum - 1}`, v: -1 }, { label: `Tieni ${sum}`, v: 0, cls: "pw" }, { label: `+ 1 → ${sum + 1}`, v: 1 }], `Nel verde! Hai fatto <b>${sum}</b>: puoi correggerlo di uno.`); sum += v; }
    S.phase = "move"; S.showDice = 40;
    if (S.bonus) { sum += S.bonus; log(`🍪 +${S.bonus}: avanzi di ${sum}.`); S.bonus = 0; } else log(`Hai fatto <b>${sum}</b>.`);
    if (S.pred && sum === S.pred && med) { log(`🔮 «L'avevo visto!» ${esc(med.n)} avanza di 2.`); await wait(500); await moveTo(med, Math.min(S.to - 1, med.pos + 2)); }
    else if (S.pred && med) { fxo.text("🔮 ✗", med.ax, med.ay - 14, "#e9d5ff"); }
    S.pred = 0; await wait(250);
    const prev = p.pos; await moveBy(p, sum); await storyCheck(prev); await land(p, sum, prev);
    if (!S.over) await storyCheck(prev);
    if (!S.over && S.extra) { S.extra = false; log("🪿 L'Oca di carta: rilanci!"); await wait(500); await heroTurn(p); }
  }
  async function storyCheck(from) { const me = hero(); for (const c of Object.keys(S.story).map(Number).sort((a, b) => a - b)) { if (!S.seen[c] && c <= me.pos && c > (S.from || 0) && !S.over) await story(c); } }
  async function playCard(id) {
    const me = hero(); use(id); fxo.text(CARDS[id].icon, me.ax, me.ay - 14, "#fde68a");
    if (id === "biscotto") { S.bonus += 1; log("🍪 Il prossimo tiro vale uno in più."); }
    else if (id === "ocacarta") { S.extra = true; log("🪿 Dopo questa mossa rilanci."); }
    else if (id === "corda") { const lead = S.P.filter((q) => q !== me && !q.done).sort((a, b) => b.pos - a.pos)[0]; if (lead && lead.pos > me.pos) { log(`🪢 Scambi il posto con ${esc(lead.n)}.`); const a = me.pos, b = lead.pos; await Promise.all([moveTo(me, b, true), moveTo(lead, a, true)]); await storyCheck(a); } else log("🪢 Sei già primo: la corda resta inutilizzata. Peccato."); }
    await wait(300);
  }
  async function aiTurn(p) {
    let d = roll(), sum = d[0] + d[1], cheat = false; S.dice = d; S.showDice = 30;
    if (p.ai === "notaio" && rnd() < 0.3 && p.pos + sum < S.to) { cheat = true; sum += 1; }
    log(`${esc(p.n)} tira: <b>${d[0] + d[1]}</b>${cheat ? " … e il dado, chissà come, gira di uno." : ""}`); await wait(450);
    if (cheat && S.hand.includes("lente")) { S.caught++; S.flags.beccato = (S.flags.beccato || 0) + 1; log(`🔍 Con la Lente lo vedi: <b>${esc(p.n)} ha girato il dado!</b> Torna indietro di 3.`); fxo.banner("BECCATO!", "#fde68a"); await wait(900); await moveTo(p, Math.max(S.from, p.pos - 3)); return; }
    const prev = p.pos, heroWas = hero().pos; await moveBy(p, sum); await land(p, sum, prev);
    const me = hero(); if (S.over) return;
    if (p.ai === "terzino" && !me.done && --S.tackleCd <= 0 && Math.abs(p.pos - me.pos) <= 1 && me.pos > S.from && !p.done) { S.tackleCd = 3; log(`🦵 ${esc(p.n)} entra in scivolata: <b>indietro di uno</b>. «Sulla palla, eh!»`); fxo.shake && fxo.shake(4); await wait(700); await moveTo(me, me.pos - 1); }
    if (p.ai === "cuoca" && !S.gift && prev < heroWas && p.pos > heroWas) { S.gift = true; S.hand.push("biscotto"); log(`🍪 ${esc(p.n)} ti passa davanti e ti lascia un biscotto. «Mangia, sei sciupato.»`); await wait(800); }
    if (p.ai === "gemello") { const tw = S.P.find((q) => q !== p && q.ai === "gemello" && !q.done && q.pos === p.pos); if (tw) { p.skip = tw.skip = 1; log(`💢 ${esc(p.n)} e ${esc(tw.n)} sulla stessa casella: litigano. <b>Fermi un turno</b> tutti e due.`); await wait(800); } }
  }
  async function game() {
    while (!S.over) {
      for (let i = 0; i < S.P.length && !S.over; i++) {
        const p = S.P[i]; S.cur = i; if (p.done) continue;
        if (p.skip > 0) { p.skip--; log(`${esc(nm(p))}: fermo un turno.`); await wait(350); continue; }
        if (p.hero) await heroTurn(p); else await aiTurn(p);
        if (S.forceEnd) return;
      }
      S.turn++; if (S.turn > 80 && !S.over) { S.over = true; S.rank = S.P.length; }
    }
    end();
  }
  function end() {
    S.phase = "end"; hud(); ui.bt.innerHTML = `<button class="go" id="tbGo">${S.quit ? "◂ Esci" : "Continua ▸"}</button>`; ui.bt.querySelector("#tbGo").onclick = close;
    if (!S.quit) log(S.practice ? "Prova finita: niente conta." : S.win ? `Primo alla ${S.to}! Gli eredi ti guardano storto. Il Conte, da qualche parte, ride.` : `Arrivi ${S.rank}° alla ${S.to}. La tirata è comunque tua: il gioco va avanti.`);
  }
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S; ui.root.remove(); ui = null; S = null;
    safe(() => window.__sagaCore && window.__sagaCore.endMatch(), 0);
    if (st.practice) return start(st.o);
    st.o.onDone && st.o.onDone({ win: !!st.win && !st.quit, quit: !!st.quit, rank: st.rank || 0, pos: st.P[0].pos, turns: st.turn, used: st.used.slice(), hand: st.hand.slice(), picks: Object.assign({}, st.picks), flags: Object.assign({}, st.flags), caught: st.caught, sfide: Object.assign({}, st.sfide), a: st.win ? 1 : 0, b: st.rank > 1 ? 1 : 0, data: { rank: st.rank, caught: st.caught, sfide: st.sfide, turns: st.turn } });
  }
  function hud() {
    if (!ui || !S) return;
    ui.hud.innerHTML = S.P.map((p) => `<span style="white-space:nowrap">${p.hero ? "⭐" : p.icon} <b style="color:${p.hero ? "#facc15" : "#fef3c7"}">${esc(p.hero ? "Tu" : p.n.split(" ")[0])}</b> ${p.done ? "🏁" : p.pos}${p.skip ? " 💤" : ""}</span>`).join(" · ")
      + (S.hand.length ? ` · 🃏 ${S.hand.map((c) => CARDS[c].icon).join("")}` : "");
  }
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop); if (tutC && tutC.open) return; S.f++;
    if (S.phase === "spin") { S.dice = [1 + Math.floor(rnd() * 6), 1 + Math.floor(rnd() * 6)]; S.curT += 0.035 + 0.012 * S.diff; S.cur01 = 0.5 + 0.5 * Math.sin(S.curT * 2.2); if (S.spinLeft > 0 && --S.spinLeft <= 0 && S.resolve) S.resolve(false); }
    if (S.showDice > 0 && S.phase !== "spin") S.showDice--;
    if (S.mini && S.mini.tick) S.mini.tick(); fxo.tick();
    if (S.f % 10 === 0) hud();
    const g = ui.g; g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); safe(() => scene(g, S.f), 0);
  }
  // ------------------------------------------------------------ spiegazione
  function demo(g, f, k) {
    const keep = S; S = mk({ from: k === 2 ? 40 : 0, to: 63, rivals: [{ id: "x", n: "Notaio", icon: "🎩", ai: "notaio", col: "#334155" }, { id: "y", n: "Cuoca", icon: "🍳", ai: "cuoca", col: "#b91c1c" }] }, false);
    S.P[0].pos = k === 2 ? 47 : 4 + Math.floor(f / 30) % 9; S.P[1].pos = 9; S.P[2].pos = 12; S.P.forEach((p) => { [p.ax, p.ay] = cxy(p.pos); }); S.f = f; S.geese = keep ? keep.geese : S.geese;
    if (k === 1) { S.phase = "spin"; S.timed = true; S.green = [0.4, 0.58]; S.cur01 = 0.5 + 0.5 * Math.sin(f / 14); S.dice = [1 + (Math.floor(f / 6) % 6), 1 + (Math.floor(f / 7) % 6)]; }
    if (k === 2) { S.mini = { k: "rigore", t: 0, a: Math.sin(f / 18), h: 0, kd: 0, res: null, ok: [0.5, 0.8], seq: [] }; }
    const fx0 = fxo; fxo = fxo || M.fx(); safe(() => scene(g, f), 0); fxo = fx0; S = keep;
  }
  const PAGES = [
    { t: "Il tabellone del Conte", p: "Sessantatré caselle a spirale, dal <b>VIA</b> al centro. Le <b>oche</b> ti fanno avanzare ancora, il <b>Ponte</b> salta alla 12, Locanda, Pozzo e Prigione ti fermano, il Labirinto ti rimanda indietro, la <b>Morte</b> all'inizio della tirata. Gli eredi giocano con te: il notaio bara, la medium prevede, il terzino entra in scivolata.", draw: (g, f) => demo(g, f, 0) },
    { t: "Lancio a tempo", p: "Tocca <b>Lancia</b>: i dadi girano e sotto scorre un cursore. Tocca <b>Ferma</b> quando è nella <b>fascia verde</b>: puoi correggere il tiro di uno (per prendere un'oca, evitare la Morte o smentire la medium). Si spegne in Impostazioni.", draw: (g, f) => demo(g, f, 1) },
    { t: "Caselle-campo e carte", p: "<b>Rigore</b>, <b>Punizione</b> e <b>Dribbling</b> sono minigiochi lampo: +2 se riesci, −2 se sbagli. Le <b>carte</b> (🍪 🪿 🕯️ 🔍 🪢) si giocano prima di tirare. Le caselle con il <b>sigillo rosso</b> raccontano qualcosa e chiedono una scelta.", draw: (g, f) => demo(g, f, 2) }
  ];
  function start(o) {
    o = o || {}; cancelAnimationFrame(raf); if (ui) ui.root.remove();
    ui = M.shell("tbOv", "🪿 " + (o.title || "Il Tabellone"), "#fde68a"); ui.root.style.background = "#0f1a0c"; ui.cv.width = W * SS; ui.cv.height = H * SS;
    fxo = M.fx(); S = mk(o, false); tutC = null;
    const openTut = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "tabellone", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) { S.forceEnd = true; S = mk(o, true); fxo = M.fx(); game(); } } }); };
    ui.help.onclick = openTut;
    window.__tabellone.state = {
      get phase() { return S && S.phase; }, get over() { return !!(S && S.over); }, get turn() { return S ? S.turn : 0; }, get hand() { return S ? S.hand.slice() : []; }, get mini() { return S && S.mini ? S.mini.k : null; }, get card() { return S && S.card ? S.card.cell : null; },
      pos: (id) => { const p = S && S.P.find((q) => q.id === (id || "hero")); return p ? p.pos : -1; }, players: () => (S ? S.P.map((p) => [p.id, p.pos, p.done]) : []),
      force: (a, b) => { if (S) S.forced = [a, b]; }, fast: (v) => { if (S) S.fast = v !== false; }, timed: (v) => { if (S) S.timed = !!v; },
      roll: () => { if (S && S.resolve && S.btns) { const b = S.btns.find((x) => x.v === "roll"); if (b) { const r = S.resolve; S.resolve = null; ui.bt.innerHTML = ""; r("roll"); return true; } } return false; },
      stop: () => { if (S && S.phase === "spin" && S.resolve) { S.resolve(true); return true; } return false; },
      pick: (i) => { if (S && S.card && S.pickFn) { S.pickFn(i || 0); return true; } return false; },
      mini: () => (S && S.mini ? S.mini.k : null), miniWin: (v) => { if (S && S.mini && S.mini.auto) S.mini.auto(v !== false); },
      choose: (v) => { if (S && S.resolve && S.btns) { const b = S.btns.find((x) => x.v === v); if (b) { const r = S.resolve; S.resolve = null; ui.bt.innerHTML = ""; r(v); return true; } } return false; },
      warp: (n) => { if (S) { const p = S.P[0]; p.pos = n; [p.ax, p.ay] = cxy(n); } }, rivalsAt: (n) => { if (S) S.P.slice(1).forEach((p) => { p.pos = n; [p.ax, p.ay] = cxy(n); }); },
      finish: (win) => { if (!S) return; if (tutC) { tutC.close(); tutC = null; } S.forceEnd = true; S.over = true; S.win = !!win; S.rank = win ? 1 : 2; end(); }
    };
    hud(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("tabellone"))) openTut();
    game();
    return true;
  }
  const SPI = {}; SP.forEach((p, i) => { if (i) SPI[p[0] + "," + p[1]] = i; });
  window.__tabellone = { start, CARDS, KM, BASE, SPI, timedOn, setTimed, cxy, state: null };
})();
