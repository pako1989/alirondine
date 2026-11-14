// js/ballo.js - «IL BALLO IN MASCHERA» · minigioco di «Il Conte di Montecalcio» (e cabinato «Ballo in Maschera» in Sala Giochi)
// Gli invitati sfilano nella sala. Ognuno ti conosce con una faccia sola, e lo dice con un segno: 🥂 calice = i Salotti (maschera del Conte), 🧺 cesto = la Strada (Berto il Mercante),
// ⚽ pallone = il Campo (il Custode). Quando un invitato è nella zona del saluto, tocca la maschera giusta. Sbagliare faccia, o salutare un intruso (🎭 senza segno), fa salire il Sospetto.
// Un invitato ignorato si offende (Sospetto +1). Al Sospetto massimo vieni smascherato. Vince chi saluta abbastanza invitati.
// Opzioni: { title, n (invitati), need, diff 0..2, seed, calm (ritmo calmo), intro, onDone({ win, quit, a: salutati, b: invitati, susp }) }
// Ritmo calmo: opzione in Impostazioni (localStorage "ali-di-rondine.ballo-calmo", "1" = invitati più lenti).
// Test: window.__ballo.state (guests(), press(0|1|2), greeted(), susp(), over, solve(), finish(win)) · pulsante #baGo a fine partita.
(function () {
  "use strict";
  if (window.__ballo) return;
  const M = window.__mini, SS = 2, W = 380, H = 230, esc = M.esc, safe = M.safe;
  const LS = "ali-di-rondine.ballo-calmo";
  const calmOn = () => safe(() => localStorage.getItem(LS) === "1", false);
  const setCalm = (v) => safe(() => localStorage.setItem(LS, v ? "1" : "0"), 0);
  const MASKS = [{ n: "Conte", ic: "🎩", col: "#7f1d1d" }, { n: "Mercante", ic: "🧢", col: "#92400e" }, { n: "Custode", ic: "🔑", col: "#14532d" }];
  const TELL = ["🥂", "🧺", "⚽"], SKIN = ["#e8c4a0", "#d9a679", "#f1d9c0", "#b87a4b"], HAIR = ["#1c1917", "#7c2d12", "#a3a3a3", "#3f3f46"], CLOTH = ["#4c1d95", "#92400e", "#14532d"];
  const ZX0 = 140, ZX1 = 240;
  let S = null, ui = null, raf = 0, fxo = null, tutC = null;
  const rng = (seed) => { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  function mk(o, practice) {
    const r = rng(o.seed || Math.floor(Math.random() * 1e9)), d = Math.max(0, Math.min(2, o.diff | 0)), n = o.n || (practice ? 8 : 14 + d * 2), calm = o.calm != null ? o.calm : calmOn();
    const sp = (calm ? 34 : 46) + d * 7, gap = 124 / sp, guests = []; for (let i = 0; i < n; i++) { const dec = i > 2 && r() < 0.18 + d * 0.04; guests.push({ i, c: dec ? -1 : Math.floor(r() * 3), x: -20, t0: i * gap + r() * 0.3, skin: SKIN[Math.floor(r() * 4)], hair: HAIR[Math.floor(r() * 4)], st: "wait", flash: 0 }); }
    const real = guests.filter((g) => g.c >= 0).length;
    return { o, practice, guests, n, real, need: o.need || Math.max(4, Math.round(real * (practice ? 0.5 : 0.72))), maxS: practice ? 99 : 4, sp, t: 0, cur: 0, greeted: 0, susp: 0, over: false, win: false, quit: false, last: performance.now(), f: 0, log: "" };
  }
  const total = () => S.guests.filter((g) => g.st === "done").length;
  function bad(g, why) { S.susp++; fxo.shake(3); fxo.text("Sospetto +1", g ? g.x : 190, 120, "#f87171"); log(why); if (S.susp >= S.maxS && !S.over) finish(false); }
  function press(mi) {
    if (!S || S.over || (tutC && tutC.open)) return false; S.cur = mi;
    const g = S.guests.filter((q) => q.st === "walk" && q.x >= ZX0 && q.x <= ZX1).sort((a, b) => b.x - a.x)[0];
    if (!g) { log("Nessuno da salutare, per ora. Aspetta che entri nella zona del saluto."); return false; }
    if (g.c === mi) { g.st = "done"; g.ok = true; S.greeted++; fxo.burst(g.x, 118, 12, ["#fbbf24", "#7f1d1d", "#fde68a"]); fxo.text("Che piacere!", g.x, 108, "#fde68a"); log(`${MASKS[mi].ic} Saluto giusto: ${MASKS[mi].n}. Salutati ${S.greeted}/${S.need}.`); }
    else { g.st = "done"; g.ok = false; bad(g, g.c < 0 ? "🎭 Era un intruso senza segno: il saluto non gli era dovuto." : `${TELL[g.c]} Quell'invitato ti conosceva come <b>${MASKS[g.c].n}</b>.`); }
    buttons(); hud(); if (S && !S.over && S.guests.every((q) => q.st === "done")) finish(S.greeted >= S.need); return true;
  }
  function log(t) { if (!ui || !S) return; S.log = t; ui.lg.innerHTML = t + `<br><span style="color:var(--dim,#9ab)">🥂 Salotti → 🎩 Conte · 🧺 Strada → 🧢 Mercante · ⚽ Campo → 🔑 Custode · 🎭 senza segno: ignora.</span>`; }
  function buttons() {
    if (!ui || !S || S.over) return;
    ui.bt.innerHTML = MASKS.map((m, i) => `<button data-m="${i}" style="${S.cur === i ? "background:" + m.col : ""}">${m.ic} ${m.n}<small>${["1 · Salotti", "2 · Strada", "3 · Campo"][i]}</small></button>`).join("") + `<button data-q="1">◂ Esci<small>lasci il ballo</small></button>`;
    ui.bt.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => press(+b.dataset.m)));
    ui.bt.querySelector("[data-q]").onclick = () => { S.quit = true; finish(false); };
  }
  function hud() { if (!ui || !S) return; ui.hud.innerHTML = `<span>🥂 Salutati <b>${S.greeted}/${S.need}</b></span><span>🎭 Invitati <b>${total()}/${S.n}</b></span><span>👁️ Sospetto <b>${S.susp}/${S.maxS > 90 ? "–" : S.maxS}</b></span>`; }
  function figure(g, q, y) {
    const pulse = q.st === "walk" && q.x >= ZX0 && q.x <= ZX1;
    M.man(g, q.x, y, { col: q.c < 0 ? "#52525b" : CLOTH[q.c], skin: q.skin, icon: q.c < 0 ? "🎭" : "", s: 1.05, arms: pulse ? -2 : 4, ring: pulse ? "#fbbf24" : "#fff", rw: pulse ? 2.6 : 1.6 });
    if (q.c >= 0) { g.font = "13px serif"; g.textAlign = "center"; g.fillText(TELL[q.c], q.x, y - 30 + Math.sin(S.f / 9 + q.i) * 1.5); }
  }
  function scene(g, f) {
    g.fillStyle = "#1c0a0e"; g.fillRect(0, 0, W, H); const fl = g.createLinearGradient(0, 70, 0, H); fl.addColorStop(0, "#5a1520"); fl.addColorStop(1, "#2e0a13"); g.fillStyle = fl; g.fillRect(0, 70, W, H - 70);
    g.fillStyle = "#2a1015"; g.fillRect(0, 0, W, 70); for (let i = 0; i < 6; i++) { const x = 30 + i * 64; g.fillStyle = "#3a0e18"; g.fillRect(x - 12, 6, 24, 54); g.fillStyle = "rgba(255,200,120,.14)"; g.fillRect(x - 9, 9, 18, 48); }
    for (let i = 0; i < 4; i++) { const x = 55 + i * 90; g.fillStyle = "#ca8a04"; g.fillRect(x - 1, 0, 2, 22); g.fillStyle = "rgba(255,190,90," + (0.7 + 0.2 * Math.sin(f / 7 + i)) + ")"; for (let k = -2; k <= 2; k++) g.fillRect(x + k * 5 - 1, 22 + Math.abs(k), 2, 4); const gl = g.createRadialGradient(x, 26, 2, x, 26, 40); gl.addColorStop(0, "rgba(255,200,110,.25)"); gl.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gl; g.fillRect(x - 40, 0, 80, 70); }
    g.fillStyle = "rgba(224,180,74,.35)"; g.fillRect(0, 140, W, 1);
    // la zona del saluto
    const act = S.guests.some((q) => q.st === "walk" && q.x >= ZX0 && q.x <= ZX1); g.fillStyle = act ? "rgba(251,191,36,.20)" : "rgba(255,255,255,.07)"; g.fillRect(ZX0, 92, ZX1 - ZX0, 64); g.strokeStyle = act ? "#fbbf24" : "rgba(255,255,255,.3)"; g.setLineDash([4, 3]); g.strokeRect(ZX0 + 0.5, 92.5, ZX1 - ZX0 - 1, 63); g.setLineDash([]);
    g.fillStyle = "rgba(253,230,138,.8)"; g.font = "700 7px system-ui"; g.textAlign = "center"; g.fillText("ZONA DEL SALUTO", (ZX0 + ZX1) / 2, 88);
    S.guests.filter((q) => q.st === "walk").forEach((q) => figure(g, q, 130));
    // tu, davanti: la maschera addosso
    const m = MASKS[S.cur]; M.man(g, 190, 196, { col: m.col, icon: m.ic, s: 1.3, arms: 2, ring: "#fde68a" });
    g.font = "700 9px system-ui"; g.fillStyle = "#fde68a"; g.textAlign = "center"; g.fillText(m.n, 190, 222);
    // intrusi e striscia degli invitati
    g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(8, 8, 124, 14); g.fillStyle = "#fbbf24"; g.fillRect(9, 9, 122 * Math.min(1, total() / S.n), 12); g.fillStyle = "#fef3c7"; g.font = "700 8px system-ui"; g.textAlign = "left"; g.fillText("INVITATI " + total() + "/" + S.n, 12, 18);
    for (let i = 0; i < Math.min(S.maxS, 8); i++) { g.fillStyle = i < S.susp ? "#dc2626" : "rgba(255,255,255,.2)"; g.fillText("👁", W - 14 - i * 14, 18); }
    fxo.draw(g);
  }
  function step(dt) {
    S.t += dt;
    S.guests.forEach((q) => {
      if (q.st === "wait" && S.t >= q.t0) q.st = "walk";
      if (q.st !== "walk") return; q.x += S.sp * dt;
      if (q.x > ZX1 + 6) { q.st = "done"; if (q.c >= 0) { q.ok = false; bad(q, `${TELL[q.c]} Un invitato è passato senza un saluto: si è offeso.`); } else q.ok = true; hud(); }
    });
    if (!S.over && S.guests.every((q) => q.st === "done")) finish(S.greeted >= S.need);
  }
  function finish(win) {
    if (!S || S.over) return; S.over = true; S.win = !!win && !S.quit;
    if (S.win) fxo.banner("BALLO RIUSCITO!", "#fbbf24"); else if (!S.quit) fxo.banner(S.susp >= S.maxS ? "SMASCHERATO" : "TROPPI SCONTENTI", "#dc2626");
    ui.bt.innerHTML = `<button class="go" id="baGo">${S.quit ? "◂ Esci" : "Continua ▸"}</button>`; ui.bt.querySelector("#baGo").onclick = close;
    if (!S.quit) log(S.practice ? "Prova finita: niente conta." : S.win ? `Valzer finito: ${S.greeted} invitati salutati con la faccia giusta, Sospetto ${S.susp}.` : S.susp >= S.maxS ? "Qualcuno ha cominciato a sommare le facce: ti sei tradito." : `Hai salutato ${S.greeted} invitati su ${S.need} necessari.`);
  }
  function close() {
    cancelAnimationFrame(raf); raf = 0; document.removeEventListener("keydown", onKey); const st = S; if (ui) ui.root.remove(); ui = null; S = null;
    safe(() => window.__sagaCore && window.__sagaCore.endMatch(), 0);
    if (st.practice) return start(st.o);
    st.o.onDone && st.o.onDone({ win: !!st.win, quit: !!st.quit, a: st.greeted, b: st.n, susp: st.susp });
  }
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop); const now = performance.now(), dt = Math.min(0.1, (now - S.last) / 1000); S.last = now; if (tutC && tutC.open) return;
    S.f++; if (!S.over) step(dt); fxo.tick(); if (S.f % 10 === 0) hud();
    const g = ui.g; g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); safe(() => scene(g, S.f), 0);
  }
  function demo(g, f, k) {
    const keep = S; S = mk({ seed: 5, n: 6, calm: true }, true); S.cur = k === 2 ? 1 : 0; S.guests.forEach((q, i) => { q.st = i === 0 ? "walk" : "wait"; q.c = k === 2 ? 1 : 0; q.x = 150 + (f % 80) * 0.6; }); const fx0 = fxo; fxo = fxo || M.fx(); safe(() => scene(g, f), 0); fxo = fx0; S = keep;
  }
  const PAGES = [
    { t: "Un ballo, tre facce", p: "Gli invitati sfilano. Ognuno ti conosce con <b>una faccia sola</b>: il segno sopra la testa dice quale. <b>🥂 calice</b> = i Salotti (<b>Conte</b>). <b>🧺 cesto</b> = la Strada (<b>Mercante</b>). <b>⚽ pallone</b> = il Campo (<b>Custode</b>).", draw: (g, f) => demo(g, f, 0) },
    { t: "Saluta nella zona", p: "Quando un invitato entra nella <b>zona del saluto</b> (il riquadro tratteggiato) tocca la <b>maschera giusta</b>. Se ne scegli un'altra, o saluti un 🎭 senza segno, il Sospetto sale. Anche chi passa senza saluto si offende.", draw: (g, f) => demo(g, f, 2) },
    { t: "Quanti ne servono", p: "Devi salutare abbastanza invitati prima che il Sospetto arrivi al massimo (4). Vuoi più calma? In Impostazioni c'è <b>Il Ballo: ritmo calmo</b>. Su tastiera: 1, 2, 3.", draw: (g, f) => demo(g, f, 1) }
  ];
  function onKey(e) { if (!S || !ui) return; if (e.key === "1" || e.key === "2" || e.key === "3") press(+e.key - 1); }
  function start(o) {
    o = o || {}; cancelAnimationFrame(raf); if (ui) ui.root.remove();
    ui = M.shell("baOv", "🎭 " + (o.title || "Il Ballo in Maschera"), "#fbbf24"); ui.root.style.background = "#12060a";
    ui.lg.style.maxHeight = "30vh"; ui.lg.style.overflow = "auto";
    fxo = M.fx(); S = mk(o, false); tutC = null; document.addEventListener("keydown", onKey);
    const openTut = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "ballo", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) { S = mk(Object.assign({}, o, { seed: 0 }), true); fxo = M.fx(); log("Prova libera: niente conta."); buttons(); } } }); };
    ui.help.onclick = openTut;
    window.__ballo.state = {
      get over() { return !!(S && S.over); }, guests: () => (S ? S.guests.map((q) => ({ c: q.c, st: q.st, x: q.x })) : []), greeted: () => (S ? S.greeted : 0), susp: () => (S ? S.susp : 0), need: () => (S ? S.need : 0),
      press: (m) => press(m), tick: (s) => { if (S) step(s); },
      solve: () => { if (!S) return; S.guests.forEach((q) => { if (q.st !== "done") { q.st = "done"; if (q.c >= 0 && S.greeted < S.need) { q.ok = true; S.greeted++; } } }); finish(S.greeted >= S.need); },
      finish: (win) => { if (!S) return; if (tutC) { tutC.close(); tutC = null; } finish(!!win); }
    };
    log(o.intro || "Gli invitati stanno entrando. Aspetta che uno arrivi nella zona del saluto."); buttons(); hud(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("ballo"))) openTut();
    return true;
  }
  window.__ballo = { start, calmOn, setCalm, state: null };
})();
