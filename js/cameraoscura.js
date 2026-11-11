// js/cameraoscura.js - «LA CAMERA OSCURA» · motore di «La Foto del '58» (e cabinato «Camera Oscura» in Sala Giochi)
// Un negativo nella bacinella: la foto affiora piano, poi comincia a scurirsi (sovraesposizione). Prima che diventi nera devi dire CHI È CHI.
// Tocchi un volto, scegli un nome. Il gioco non dice mai se una risposta è giusta: conferma (timbro granata) solo quando TRE volti sono giusti insieme,
// come il Taccuino della saga. Gli indizi sono frasi («Aldo porta i baffi», «Bruno è subito a sinistra di Carlo», «il capitano sta in piedi»).
// 🔦 Luce rossa: rivela un volto, ma brucia tempo. Vince chi conferma tutti i volti prima del nero.
// Opzioni: { title, n (volti 4-8), diff 0..2, time (secondi, 0 = senza tempo), seed, people: [{ id, name, look }] (volti fissi della storia: ritratto vero + tratti),
//   intro, tutorial, onDone({ win, a: confermati, b: volti, hints, secs, quit }) }. look = { hat, baffi, occhiali, sciarpa, fascia, portiere, barba }
// A tempo o no: opzione in Impostazioni (localStorage "ali-di-rondine.camera-tempo", "0" = senza tempo).
// Test: window.__cameraOscura.state (phase, faces(), names(), assign(f, n), solve(), locked(), hint(), finish(win)) · pulsante #coGo a fine partita.
(function () {
  "use strict";
  if (window.__cameraOscura) return;
  const M = window.__mini, SS = 2, W = 380, H = 230, esc = M.esc, safe = M.safe;
  const LS = "ali-di-rondine.camera-tempo";
  const timedOn = () => safe(() => localStorage.getItem(LS) !== "0", true);
  const setTimed = (v) => safe(() => localStorage.setItem(LS, v ? "1" : "0"), 0);
  const NAMES = ["Aldo", "Bruno", "Carlo", "Duilio", "Ezio", "Franco", "Gino", "Italo", "Lino", "Mario", "Nello", "Osvaldo", "Piero", "Remo", "Sergio", "Tullio", "Ugo", "Vasco", "Walter", "Zeno", "Elio", "Fausto", "Oreste", "Rino"];
  const TRAITS = { hat: ["porta il cappello", "non porta il cappello"], baffi: ["porta i baffi", "non porta i baffi"], occhiali: ["porta gli occhiali", "non porta gli occhiali"], sciarpa: ["ha la sciarpa al collo", "non ha la sciarpa"], barba: ["ha la barba", "non ha la barba"] };
  const rng = (seed) => { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const shuffle = (a, r) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function perms(n) { const out = [], p = []; const used = Array(n).fill(false); (function rec() { if (p.length === n) { out.push(p.slice()); return; } for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; p.push(i); rec(); p.pop(); used[i] = false; } })(); return out; }
  // ------------------------------------------------------------ il generatore: volti in due file, tratti, indizi finché la soluzione è unica
  function make(o) {
    const r = rng(o.seed || Math.floor(Math.random() * 1e9));
    let P;
    if (o.people && o.people.length) P = o.people.map((p) => ({ id: p.id, name: p.name, look: Object.assign({}, p.look || {}) }));
    else {
      const n = Math.max(4, Math.min(8, o.n || 5 + (o.diff | 0))), nm = shuffle(NAMES.slice(), r).slice(0, n);
      P = nm.map((name) => ({ name, look: { hat: r() < 0.35, baffi: r() < 0.4, occhiali: r() < 0.3, sciarpa: r() < 0.3, barba: r() < 0.2, skin: Math.floor(r() * 3), hair: Math.floor(r() * 4) } }));
      P[Math.floor(r() * n)].look.fascia = true; let gk = Math.floor(r() * n); if (P[gk].look.fascia) gk = (gk + 1) % n; P[gk].look.portiere = true;
    }
    const n = P.length, back = Math.ceil(n / 2);
    // posizione: la faccia i della foto è la persona order[i]
    const order = shuffle([...Array(n).keys()], r);
    const faces = order.map((pi, i) => ({ p: pi, row: i < back ? 0 : 1, col: i < back ? i : i - back, rowN: i < back ? back : n - back }));
    const look = (fi) => P[faces[fi].p].look;
    const at = (row, col) => faces.findIndex((f) => f.row === row && f.col === col);
    // candidati: ogni indizio è vero per la soluzione (face fi = persona p) e si prova su una permutazione q (q[fi] = persona)
    const C = [], nmOf = (p) => P[p].name, fOf = (q, p) => q.indexOf(p);
    for (let p = 0; p < n; p++) {
      const fi = order.indexOf(p), f = faces[fi], L = look(fi);
      Object.keys(TRAITS).forEach((t) => { const v = !!L[t]; if (v || r() < 0.5) C.push({ t: `${nmOf(p)} ${TRAITS[t][v ? 0 : 1]}.`, w: 1, test: (q) => !!look(fOf(q, p))[t] === v }); });
      C.push({ t: `${nmOf(p)} ${f.row ? "è nella fila davanti, in ginocchio" : "è nella fila dietro, in piedi"}.`, w: 1, test: (q) => faces[fOf(q, p)].row === f.row });
      if (f.col === 0) C.push({ t: `${nmOf(p)} è il primo a sinistra della sua fila.`, w: 2, test: (q) => faces[fOf(q, p)].col === 0 && faces[fOf(q, p)].row === f.row });
      if (f.col === f.rowN - 1) C.push({ t: `${nmOf(p)} è l'ultimo a destra della sua fila.`, w: 2, test: (q) => { const g = faces[fOf(q, p)]; return g.col === g.rowN - 1 && g.row === f.row; } });
      const rt = at(f.row, f.col + 1); if (rt >= 0) { const p2 = order[rt]; C.push({ t: `${nmOf(p)} è subito a sinistra di ${nmOf(p2)}.`, w: 2, test: (q) => { const a = faces[fOf(q, p)], b = faces[fOf(q, p2)]; return a.row === b.row && b.col === a.col + 1; } }); }
      if (f.row === 0) { const fr = at(1, f.col); if (fr >= 0) { const p2 = order[fr]; C.push({ t: `${nmOf(p)} sta proprio dietro a ${nmOf(p2)}.`, w: 2, test: (q) => { const a = faces[fOf(q, p)], b = faces[fOf(q, p2)]; return a.row === 0 && b.row === 1 && a.col === b.col; } }); } }
      if (L.fascia) C.push({ t: `Il capitano (la fascia al braccio) è ${nmOf(p)}.`, w: 1, test: (q) => !!look(fOf(q, p)).fascia });
      if (L.portiere) C.push({ t: `In porta giocava ${nmOf(p)} (la maglia chiara).`, w: 1, test: (q) => !!look(fOf(q, p)).portiere });
      for (let k = 0; k < 2; k++) { const p2 = Math.floor(r() * n); if (p2 !== p && !!L.hat !== !!P[p2].look.hat) C.push({ t: `Tra ${nmOf(p)} e ${nmOf(p2)}, il cappello ce l'ha ${L.hat ? nmOf(p) : nmOf(p2)}.`, w: 1, test: (q) => !!look(fOf(q, L.hat ? p : p2)).hat && !look(fOf(q, L.hat ? p2 : p)).hat }); }
    }
    // tutte le permutazioni (n ≤ 8: 40320) filtrate con indizi scelti a caso finché resta una sola soluzione
    let pool = perms(n); const used = [];
    shuffle(C, r);
    for (const c of C) { if (pool.length <= 1) break; const nx = pool.filter(c.test); if (nx.length < pool.length && nx.length >= 1) { pool = nx; used.push(c); } }
    if (pool.length > 1) faces.forEach((f, fi) => { if (pool.length > 1) { const p = f.p, c = { t: `${nmOf(p)} è il volto n. ${fi + 1}.`, test: (q) => q[fi] === p }; pool = pool.filter(c.test); used.push(c); } });
    // un aiuto in più a difficoltà bassa: indizi veri ma ridondanti
    const extra = o.extra != null ? o.extra : [2, 1, 0][Math.max(0, Math.min(2, o.diff | 0))]; C.filter((c) => !used.includes(c)).slice(0, extra).forEach((c) => used.push(c));
    // ordine leggibile: prima i ruoli e le file, poi i tratti, poi le relazioni
    used.sort((a, b) => (a.w || 1) - (b.w || 1));
    return { P, faces, clues: used.map((c) => c.t), sol: order.slice() };
  }
  // ------------------------------------------------------------ disegno di un volto in posa (seppia; il solo colore è il granata della maglia)
  const SKIN = ["#e3c39b", "#d4ab80", "#c39467"], HAIR = ["#2b1d12", "#5a3f26", "#8a6a44", "#c9b48a"];
  function fig(g, x, y, s, L, im, tag, st) {
    g.save(); g.translate(x, y); g.scale(s, s);
    const kneel = st.row === 1;
    g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(0, kneel ? 20 : 30, 12, 3, 0, 0, 7); g.fill();
    // corpo: maglia granata (o chiara per il portiere), calzoncini, gambe
    if (!kneel) { g.fillStyle = "#efe6d2"; g.fillRect(-7, 12, 14, 7); g.fillStyle = "#3b2d1f"; g.fillRect(-6, 19, 4, 10); g.fillRect(2, 19, 4, 10); g.fillStyle = "#1f1710"; g.fillRect(-7, 27, 6, 3); g.fillRect(1, 27, 6, 3); }
    else { g.fillStyle = "#efe6d2"; g.fillRect(-8, 12, 16, 5); g.fillStyle = "#3b2d1f"; g.fillRect(-9, 16, 8, 4); g.fillRect(3, 14, 4, 6); }
    const sh = L.portiere ? "#cfc6b4" : L.coach ? "#4a3b2b" : "#7f1d1d";
    g.fillStyle = sh; g.beginPath(); g.roundRect(-10, -3, 20, 16, 4); g.fill(); g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 1; g.stroke();
    if (!L.coach) { g.fillStyle = L.portiere ? "#8a8070" : "#f5ead6"; g.fillRect(-3, -3, 6, 3); }
    if (L.fascia) { g.fillStyle = "#f5ead6"; g.fillRect(-11, 2, 4, 4); g.fillStyle = "#1c1917"; g.font = "800 4px Georgia"; g.textAlign = "center"; g.fillText("C", -9, 5.4); }
    if (L.sciarpa) { g.fillStyle = "#d6c9ad"; g.fillRect(-7, -4, 14, 3); g.fillRect(4, -2, 3, 8); }
    // testa: il ritratto vero (in seppia) oppure una testa disegnata coi tratti
    const hy = -11;
    if (im && im.complete && im.naturalWidth) { g.save(); g.beginPath(); g.arc(0, hy, 9, 0, 7); g.clip(); g.filter = "sepia(0.9) contrast(1.05)"; g.drawImage(im, -9.5, hy - 10, 19, 19); g.filter = "none"; g.restore(); }
    else {
      g.fillStyle = SKIN[L.skin | 0] || SKIN[0]; g.beginPath(); g.ellipse(0, hy, 7, 8, 0, 0, 7); g.fill();
      g.fillStyle = HAIR[L.hair | 0] || HAIR[0]; g.beginPath(); g.ellipse(0, hy - 5, 7.5, 4.2, 0, Math.PI, 0); g.fill(); g.fillRect(-7.5, hy - 5, 2, 5); g.fillRect(5.5, hy - 5, 2, 5);
      g.fillStyle = "#1c1917"; g.fillRect(-3.2, hy - 1, 1.6, 1.6); g.fillRect(1.6, hy - 1, 1.6, 1.6);
      if (L.occhiali) { g.strokeStyle = "#1c1917"; g.lineWidth = 0.8; g.strokeRect(-4.5, hy - 2.2, 3.6, 3); g.strokeRect(0.9, hy - 2.2, 3.6, 3); g.beginPath(); g.moveTo(-0.9, hy - 1); g.lineTo(0.9, hy - 1); g.stroke(); }
      if (L.baffi) { g.fillStyle = HAIR[L.hair | 0] || "#2b1d12"; g.fillRect(-3.5, hy + 2.5, 7, 1.6); }
      if (L.barba) { g.fillStyle = "rgba(43,29,18,.75)"; g.beginPath(); g.ellipse(0, hy + 5, 5.5, 3.5, 0, 0, Math.PI); g.fill(); }
      g.fillStyle = "#7a5a3a"; g.fillRect(-1.5, hy + 4.6, 3, 0.8);
    }
    if (L.hat) { g.fillStyle = "#3a2c1e"; g.fillRect(-9, hy - 8, 18, 2.4); g.beginPath(); g.roundRect(-6, hy - 14, 12, 7, 2); g.fill(); g.fillStyle = "#5a4630"; g.fillRect(-6, hy - 9.5, 12, 1.4); }
    // stato: selezionato, nome scritto sotto, timbro confermato
    if (st.sel) { g.strokeStyle = "#fbbf24"; g.lineWidth = 1.6; g.beginPath(); g.arc(0, hy, 12, 0, 7); g.stroke(); }
    g.restore();
    if (tag) { g.save(); g.font = "700 7px Georgia"; const w = g.measureText(tag).width + 6, ty = y + (kneel ? 25 : 34) * s; g.fillStyle = st.ok ? "#7f1d1d" : "#f5ead6"; g.fillRect(x - w / 2, ty - 6, w, 9); g.fillStyle = st.ok ? "#fff" : "#1c1917"; g.textAlign = "center"; g.fillText(tag, x, ty + 1); g.restore(); }
    if (st.ok) { g.save(); g.translate(x + 8 * s, y - 18 * s); g.rotate(-0.3); g.strokeStyle = "rgba(127,29,29,.9)"; g.lineWidth = 1.4; g.beginPath(); g.arc(0, 0, 5, 0, 7); g.stroke(); g.fillStyle = "#7f1d1d"; g.font = "900 7px Georgia"; g.textAlign = "center"; g.fillText("✔", 0, 2.5); g.restore(); }
    if (st.num != null) { g.save(); g.fillStyle = "rgba(245,234,214,.85)"; g.font = "800 6px Georgia"; g.textAlign = "center"; g.fillText(String(st.num), x, y - 26 * s); g.restore(); }
  }
  // ------------------------------------------------------------ la scena: bacinella, carta, foto che affiora e poi si scurisce
  let S = null, ui = null, raf = 0, fxo = null, tutC = null;
  function pos(fi) {
    const f = S.Z.faces[fi], n = f.rowN, sp = Math.min(46, 250 / n), x0 = 190 - ((n - 1) * sp) / 2;
    return [x0 + f.col * sp, f.row ? 150 : 104, Math.min(1.25, sp / 40)];
  }
  function scene(g, f) {
    // tavolo della camera oscura e luce rossa
    g.fillStyle = "#140806"; g.fillRect(0, 0, W, H); const gl = g.createRadialGradient(190, 20, 10, 190, 40, 260); gl.addColorStop(0, "rgba(220,38,38,.35)"); gl.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gl; g.fillRect(0, 0, W, H);
    g.fillStyle = "#2a1410"; g.beginPath(); g.roundRect(22, 24, 336, 196, 14); g.fill(); g.fillStyle = "#3a1d16"; g.beginPath(); g.roundRect(28, 30, 324, 184, 10); g.fill();
    // il liquido
    g.fillStyle = "rgba(120,40,30,.35)"; g.fillRect(32, 34, 316, 176); for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(255,120,100,.08)"; g.beginPath(); g.ellipse(190 + Math.sin(f / 40 + i) * 30, 120, 60 + i * 20 + Math.sin(f / 20 + i) * 4, 18 + i * 6, 0, 0, 7); g.stroke(); }
    // la carta fotografica
    const dev = Math.min(1, S.t / 2.2), bur = S.time ? Math.max(0, (S.t - 2.2) / S.time) : 0;
    g.save(); g.translate(0, Math.sin(f / 30) * 0.6); g.fillStyle = "#efe6d2"; g.fillRect(44, 40, 292, 160); g.fillStyle = "#d8c8a6"; g.fillRect(52, 46, 276, 148);
    // fondale della foto: muro e cielo della piazza
    const bg = g.createLinearGradient(0, 46, 0, 194); bg.addColorStop(0, "#b8a27c"); bg.addColorStop(0.55, "#9a845e"); bg.addColorStop(1, "#7a6648"); g.fillStyle = bg; g.fillRect(52, 46, 276, 148);
    g.fillStyle = "rgba(60,44,28,.35)"; for (let i = 0; i < 9; i++) g.fillRect(56 + i * 31, 52, 26, 30); g.fillStyle = "#8a7454"; g.fillRect(52, 120, 276, 74);
    g.globalAlpha = dev;
    S.Z.faces.forEach((fc, fi) => { const [x, y, s] = pos(fi), p = S.Z.P[fc.p], L = Object.assign({}, p.look); const im = p.id ? M.img(p.id) : null; const a = S.as[fi], ok = S.ok[fi];
      fig(g, x, y, s, L, im, a != null ? S.Z.P[a].name : "", { row: fc.row, sel: S.sel === fi, ok, num: fi + 1 }); });
    g.globalAlpha = 1;
    if (bur > 0) { g.fillStyle = `rgba(20,10,4,${Math.min(0.92, bur * bur * 0.95)})`; g.fillRect(52, 46, 276, 148); }
    g.restore();
    // il tempo: una striscia di carta che si annerisce
    if (S.time) { const k = Math.max(0, 1 - bur); g.fillStyle = "#3a1d16"; g.fillRect(40, 214, 300, 8); g.fillStyle = k > 0.3 ? "#fbbf24" : "#dc2626"; g.fillRect(41, 215, 298 * k, 6); g.fillStyle = "#fef3c7"; g.font = "700 7px system-ui"; g.textAlign = "left"; g.fillText("BAGNO", 6, 221); }
    fxo.draw(g);
  }
  // ------------------------------------------------------------ partita
  function mk(o, practice) {
    const Z = make(o); const n = Z.faces.length;
    return { o, practice, Z, as: Array(n).fill(null), ok: Array(n).fill(false), sel: null, t: 0, time: o.time != null ? o.time : (timedOn() ? [170, 140, 115][Math.max(0, Math.min(2, o.diff | 0))] + (n > 6 ? 20 : 0) : 0), hints: 0, phase: "play", over: false, win: false, last: performance.now() };
  }
  const locked = () => S.ok.filter(Boolean).length;
  function confirm() {
    const open = S.Z.faces.map((f, i) => i).filter((i) => !S.ok[i]), good = open.filter((i) => S.as[i] === S.Z.faces[i].p);
    let now = []; if (good.length >= 3) now = good.slice(0, Math.floor(good.length / 3) * 3); else if (open.length < 3 && good.length === open.length) now = good;
    now.forEach((i) => (S.ok[i] = true));
    if (now.length) { fxo.banner(now.length === 3 ? "TRE GIUSTI!" : "GIUSTI!", "#fbbf24"); now.forEach((i) => { const [x, y] = pos(i); fxo.burst(x, y - 14, 10, ["#fbbf24", "#7f1d1d", "#fef3c7"]); }); log(`✔ Confermati: ${now.map((i) => esc(S.Z.P[S.Z.faces[i].p].name)).join(", ")}.`); }
    if (locked() === S.Z.faces.length) return finish(true);
    buttons();
  }
  function assign(fi, pi) {
    if (!S || S.over || S.ok[fi]) return;
    // un nome sta su un volto solo: se era altrove, lo togli di là
    if (pi != null) S.as.forEach((a, i) => { if (a === pi && i !== fi && !S.ok[i]) S.as[i] = null; });
    S.as[fi] = pi; S.sel = null; confirm();
  }
  function hint() {
    if (!S || S.over) return; const open = S.Z.faces.map((f, i) => i).filter((i) => !S.ok[i]); if (!open.length) return;
    const fi = open[Math.floor(Math.random() * open.length)], pi = S.Z.faces[fi].p; S.hints++;
    S.as.forEach((a, i) => { if (a === pi && i !== fi && !S.ok[i]) S.as[i] = null; }); S.as[fi] = pi; S.ok[fi] = true; if (S.time) S.t += S.time * 0.18;
    log(`🔦 Luce rossa: il volto ${fi + 1} è <b>${esc(S.Z.P[pi].name)}</b>.${S.time ? " (Il bagno brucia più in fretta.)" : ""}`);
    if (locked() === S.Z.faces.length) return finish(true); buttons();
  }
  function log(t) { if (!ui) return; S.log = t; clues(); }
  function clues() {
    if (!ui || !S) return;
    ui.lg.innerHTML = (S.log ? `<div style="margin-bottom:5px">${S.log}</div>` : "") + `<b>Indizi</b><ol style="margin:3px 0 0 18px;padding:0">${S.Z.clues.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>`;
  }
  function buttons() {
    if (!ui || !S || S.over) return;
    if (S.sel == null) { ui.bt.innerHTML = `<button data-h="1">🔦 Luce rossa<small>rivela un volto${S.time ? " · brucia tempo" : ""}</small></button><button data-q="1">◂ Esci<small>la foto resta nella bacinella</small></button>`; ui.bt.querySelector("[data-h]").onclick = hint; ui.bt.querySelector("[data-q]").onclick = () => { S.quit = true; finish(false); }; return; }
    const fi = S.sel, taken = new Set(S.as.filter((a, i) => a != null && S.ok[i]));
    ui.bt.innerHTML = S.Z.P.map((p, pi) => (taken.has(pi) ? "" : `<button data-p="${pi}" style="min-height:44px;min-width:70px;${S.as[fi] === pi ? "background:#7f1d1d" : ""}">${esc(p.name)}</button>`)).join("") + `<button data-p="-1" style="min-height:44px;min-width:70px">✖<small>togli</small></button>`;
    ui.bt.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => assign(fi, +b.dataset.p < 0 ? null : +b.dataset.p)));
  }
  function hud() {
    if (!ui || !S) return; const n = S.Z.faces.length;
    ui.hud.innerHTML = `<span>🖼️ Volti <b>${n}</b></span><span>✔ Confermati <b>${locked()}/${n}</b></span><span>✎ Scritti <b>${S.as.filter((a) => a != null).length}</b></span>${S.hints ? `<span>🔦 ${S.hints}</span>` : ""}${S.time ? `<span>⏳ <b>${Math.max(0, Math.ceil(S.time + 2.2 - S.t))}</b> s</span>` : "<span>⏳ senza tempo</span>"}`;
  }
  function tap(e) {
    if (!S || S.over || (tutC && tutC.open)) return; const r = ui.cv.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width, y = (e.clientY - r.top) * H / r.height;
    let best = -1, bd = 26; S.Z.faces.forEach((f, fi) => { const [fx, fy] = pos(fi), d = Math.hypot(fx - x, fy - 4 - y); if (d < bd) { bd = d; best = fi; } });
    if (best >= 0 && !S.ok[best]) { S.sel = S.sel === best ? null : best; buttons(); }
  }
  function finish(win) {
    if (!S || S.over) return; S.over = true; S.win = !!win && !S.quit; S.phase = "end";
    if (S.win) fxo.banner("SVILUPPATA!", "#fbbf24"); else if (!S.quit) fxo.banner("TUTTO NERO", "#dc2626");
    ui.bt.innerHTML = `<button class="go" id="coGo">${S.quit ? "◂ Esci" : "Continua ▸"}</button>`; ui.bt.querySelector("#coGo").onclick = close;
    if (!S.quit) log(S.practice ? "Prova finita: niente conta." : S.win ? `La foto è sviluppata: ${S.Z.faces.length} volti, ${S.Z.faces.length} nomi.${S.hints ? ` (Luce rossa usata ${S.hints} ${S.hints > 1 ? "volte" : "volta"}.)` : ""}` : `La carta è diventata nera. Confermati ${locked()} volti su ${S.Z.faces.length}.`);
  }
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S; if (ui) ui.root.remove(); ui = null; S = null;
    safe(() => window.__sagaCore && window.__sagaCore.endMatch(), 0);
    if (st.practice) return start(st.o);
    st.o.onDone && st.o.onDone({ win: !!st.win, quit: !!st.quit, a: st.ok.filter(Boolean).length, b: st.ok.length, hints: st.hints, secs: Math.round(st.t), data: { names: st.Z.P.map((p) => p.name) } });
  }
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop); const now = performance.now(), dt = Math.min(0.1, (now - S.last) / 1000); S.last = now; if (tutC && tutC.open) return;
    S.f = (S.f || 0) + 1; if (!S.over) { S.t += dt; if (S.time && S.t > S.time + 2.2) finish(false); }
    fxo.tick(); if (S.f % 10 === 0) hud();
    const g = ui.g; g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); safe(() => scene(g, S.f), 0);
  }
  // ------------------------------------------------------------ spiegazione
  function demo(g, f, k) {
    const keep = S; S = mk({ seed: 7, n: 5, time: 60 }, false); S.t = k === 0 ? Math.min(2.2, f / 40) : 2.2 + (k === 2 ? 30 : 4);
    if (k >= 1) { S.as[0] = S.Z.faces[0].p; S.as[1] = S.Z.faces[1].p; S.sel = 2; } if (k === 2) { S.as[2] = S.Z.faces[2].p; [0, 1, 2].forEach((i) => (S.ok[i] = true)); S.sel = null; }
    const fx0 = fxo; fxo = fxo || M.fx(); safe(() => scene(g, f), 0); fxo = fx0; S = keep;
  }
  const PAGES = [
    { t: "Il negativo nella bacinella", p: "La foto <b>affiora</b> nel bagno di sviluppo. Poi comincia a <b>scurirsi</b>: la striscia in basso è il tempo che resta prima che diventi tutta nera.", draw: (g, f) => demo(g, f, 0) },
    { t: "Chi è chi", p: "Tocca un <b>volto</b>, poi il <b>nome</b>. Leggi gli <b>indizi</b> sotto: tratti (cappello, baffi, occhiali), file (in piedi o in ginocchio), chi sta accanto a chi, il capitano, il portiere. Un nome va su un volto solo.", draw: (g, f) => demo(g, f, 1) },
    { t: "Tre alla volta", p: "Il gioco <b>non ti dice</b> se un nome è giusto. Conferma (timbro granata) solo quando <b>tre volti</b> sono giusti insieme. Così non si va a tentativi. 🔦 <b>Luce rossa</b>: rivela un volto, ma il bagno brucia più in fretta. Il tempo si spegne in Impostazioni.", draw: (g, f) => demo(g, f, 2) }
  ];
  function start(o) {
    o = o || {}; cancelAnimationFrame(raf); if (ui) ui.root.remove();
    ui = M.shell("coOv", "🎞️ " + (o.title || "La Camera Oscura"), "#fca5a5"); ui.root.style.background = "#0c0504"; ui.cv.width = W * SS; ui.cv.height = H * SS;
    ui.lg.style.maxHeight = "34vh"; ui.lg.style.overflow = "auto"; ui.bt.style.maxHeight = "30vh"; ui.bt.style.overflow = "auto";
    fxo = M.fx(); S = mk(o, false); tutC = null;
    ui.cv.addEventListener("pointerdown", tap);
    const openTut = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "cameraoscura", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) { S = mk(Object.assign({}, o, { seed: 0 }), true); fxo = M.fx(); clues(); buttons(); } } }); };
    ui.help.onclick = openTut;
    window.__cameraOscura.state = {
      get phase() { return S && S.phase; }, get over() { return !!(S && S.over); },
      faces: () => (S ? S.Z.faces.map((f) => f.p) : []), names: () => (S ? S.Z.P.map((p) => p.name) : []), clues: () => (S ? S.Z.clues.slice() : []),
      assign: (fi, pi) => assign(fi, pi), sel: (fi) => { if (S) { S.sel = fi; buttons(); } }, locked: () => (S ? locked() : 0), hint: () => hint(),
      solve: () => { if (S) S.Z.faces.forEach((f, fi) => { if (!S.over && !S.ok[fi]) assign(fi, f.p); }); },
      finish: (win) => { if (!S) return; if (tutC) { tutC.close(); tutC = null; } if (win) S.ok = S.ok.map(() => true); finish(!!win); },
      time: () => (S ? S.time : 0)
    };
    log(o.intro || ""); buttons(); hud(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("cameraoscura"))) openTut();
    return true;
  }
  window.__cameraOscura = { start, make, timedOn, setTimed, state: null };
})();
