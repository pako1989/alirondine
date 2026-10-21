// js/gala-pp.js - «PING-PONG DA SALONE» · il minigioco di «Il Rapimento del Pallone d'Oro» (e del cabinato in Sala Giochi)
// Tavolo visto da dietro in un salone. La pallina arriva su una di tre corsie: colpiscila nella finestra tratteggiata (si accende «ORA!») e scegli dove rimandarla con ↖ ↑ ↗ (o toccando il tavolo a sinistra, al centro, a destra).
// L'avversario sta in una corsia (il CORPO) e tiene la racchetta verso un'altra (la POSA, può fingere): rimanda lontano da dove sta lui. Primi a 7 punti.
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (primo a 2, senza conseguenze); il «?» la riapre. Richiede js/mini.js.
// Opzioni: title, level (1-3), oppName, te (finestra più larga), df (un punto perso ti viene concesso), at (parti avanti di un punto), tutorial (false = niente spiegazione), onDone({win, a, b}).
// Test: window.__pingpong.state.finish(win) · .hit(-1|0|1) · pulsante #ppGo.
(function () {
  "use strict";
  if (window.__pingpong) return;
  const M = window.__mini, W = M.W, H = M.H, esc = M.esc, TOP = 68, BOT = 200, WIN = 7;
  const LV = { 1: { dur: 1.5, feint: 0.1, tough: 0.2 }, 2: { dur: 1.25, feint: 0.25, tough: 0.3 }, 3: { dur: 1.05, feint: 0.4, tough: 0.4 } };
  let S = null, ui = null, raf = 0, tutC = null, fxo = null, last = 0;
  const L = () => LV[Math.max(1, Math.min(3, S.o.level || 1))];
  const laneX = (lane, t) => { const half = 60 + t * 85; return W / 2 + lane * (half * 0.62); };
  const yAt = (t) => TOP + (BOT - TOP) * t;
  const winW = (te) => 0.1 + 0.015 * (te | 0);

  // ------------------------------------------------------------ grafica
  function room(g, f) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#2a1608"); gr.addColorStop(1, "#120a05"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 24) { g.fillStyle = x % 48 ? "rgba(120,60,20,.18)" : "rgba(160,90,30,.14)"; g.fillRect(x, 0, 12, 70); }
    g.fillStyle = "rgba(0,0,0,.45)"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(14 + i * 14, 66 + (i % 3) * 3, 7, 0, 7); g.fill(); g.beginPath(); g.arc(W - 14 - i * 14, 66 + (i % 2) * 3, 7, 0, 7); g.fill(); }
    const gl = g.createRadialGradient(W / 2, 10, 4, W / 2, 10, 120); gl.addColorStop(0, "rgba(253,224,130,.5)"); gl.addColorStop(1, "rgba(253,224,130,0)"); g.fillStyle = gl; g.fillRect(0, 0, W, 130);
    g.strokeStyle = "#a16207"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(W / 2, 0); g.lineTo(W / 2, 8); g.stroke(); g.fillStyle = "#fde68a"; for (let i = -2; i <= 2; i++) { g.beginPath(); g.arc(W / 2 + i * 9, 12 + Math.abs(i) * 1.5, 2.6 + (Math.sin(f * 0.1 + i) + 1) * 0.3, 0, 7); g.fill(); }
    g.fillStyle = "#1c1209"; g.fillRect(0, 205, W, H - 205);
  }
  function table(g) {
    const q = (t0, t1, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(laneX(-1.6, t0), yAt(t0)); g.lineTo(laneX(1.6, t0), yAt(t0)); g.lineTo(laneX(1.6, t1), yAt(t1)); g.lineTo(laneX(-1.6, t1), yAt(t1)); g.closePath(); g.fill(); };
    g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(laneX(-1.6, 1) + 8, yAt(1), laneX(1.6, 1) - laneX(-1.6, 1) - 16, 8);
    q(0, 1, "#14532d"); q(0, 0.5, "rgba(255,255,255,.04)"); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 2; g.beginPath(); g.moveTo(laneX(-1.6, 0), yAt(0)); g.lineTo(laneX(1.6, 0), yAt(0)); g.lineTo(laneX(1.6, 1), yAt(1)); g.lineTo(laneX(-1.6, 1), yAt(1)); g.closePath(); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.2)"; g.lineWidth = 1; [-0.53, 0.53].forEach((l) => { g.beginPath(); g.moveTo(laneX(l * 1.9, 0), yAt(0)); g.lineTo(laneX(l * 1.9, 1), yAt(1)); g.stroke(); });
  }
  function net(g) { const y = yAt(0.5), a = laneX(-1.75, 0.5), b = laneX(1.75, 0.5); g.fillStyle = "rgba(255,255,255,.22)"; g.fillRect(a, y - 12, b - a, 12); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; for (let x = a; x < b; x += 6) { g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x, y); g.stroke(); } g.strokeStyle = "#e5e7eb"; g.lineWidth = 3; g.beginPath(); g.moveTo(a, y - 12); g.lineTo(b, y - 12); g.stroke(); g.fillStyle = "#9ca3af"; g.fillRect(a - 3, y - 16, 4, 18); g.fillRect(b - 1, y - 16, 4, 18); }
  function opp(g, f, st, o) {
    const ox = laneX(st.cover * 0.9, 0), hx = ox + st.lean * 20, by = TOP - 2, sw = Math.sin(f * 0.1) * 1.5;
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(ox, TOP + 2, 17, 4, 0, 0, 7); g.fill();
    g.fillStyle = "#7c2d12"; g.beginPath(); g.moveTo(ox - 14, by); g.lineTo(ox - 10, by - 28); g.lineTo(ox + 10, by - 28); g.lineTo(ox + 14, by); g.closePath(); g.fill(); g.fillStyle = "#fff"; g.fillRect(ox - 3, by - 28, 6, 12); g.fillStyle = "#111"; g.fillRect(ox - 2, by - 24, 4, 3);
    g.strokeStyle = "#7c2d12"; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(ox + (st.lean >= 0 ? 9 : -9), by - 24); g.lineTo(hx, by - 12 + sw); g.stroke();
    g.fillStyle = "#e0b890"; g.beginPath(); g.arc(ox, by - 38, 9, 0, 7); g.fill(); g.fillStyle = "#2b1d14"; g.beginPath(); g.arc(ox, by - 41, 9, Math.PI, 0); g.fill(); g.fillStyle = "#111"; g.fillRect(ox - 5, by - 39, 3, 2); g.fillRect(ox + 2, by - 39, 3, 2);
    g.fillStyle = "#facc15"; g.beginPath(); g.arc(hx, by - 12 + sw, 6, 0, 7); g.fill(); g.strokeStyle = "#92400e"; g.lineWidth = 1.5; g.stroke(); g.strokeStyle = "#e5e7eb"; g.fillStyle = "#e5e7eb"; g.font = "700 9px system-ui"; g.textAlign = "center";
    if (o && o.label !== false) { g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(W / 2 - 74, 2, 148, 15); g.fillStyle = "#fde68a"; g.fillText("racchetta " + (st.lean < 0 ? "◀ a sinistra" : st.lean > 0 ? "a destra ▶" : "▲ al centro"), W / 2, 13); }
  }
  // st: {t, dir, lane, cover, lean, wt (larghezza finestra), trail[]}
  function scene(g, f, st, o) {
    o = o || {}; room(g, f); table(g); opp(g, f, st, o);
    if (st.dir === 1 && o.win !== false) { const w = st.wt, a = yAt(0.92 - w), b = yAt(0.92 + w), inw = Math.abs(st.t - 0.92) <= w, x = laneX(st.lane, 1); g.fillStyle = inw ? "rgba(74,222,128,.25)" : "rgba(250,204,21,.08)"; g.fillRect(x - 28, a, 56, b - a); g.strokeStyle = inw ? "#4ade80" : "rgba(250,204,21,.75)"; g.lineWidth = inw ? 2.5 : 1.5; g.setLineDash(inw ? [] : [4, 3]); g.strokeRect(x - 28, a, 56, b - a); g.setLineDash([]); if (inw) { g.fillStyle = "#4ade80"; g.font = "900 13px system-ui"; g.textAlign = "center"; g.fillText("ORA!", x, a - 5); } }
    net(g);
    const t = Math.max(0, Math.min(1, st.t)), bx = laneX(st.lane, t), by = yAt(t) - Math.sin(t * 3.14) * 18;
    (st.trail || []).forEach((p, i, a) => { g.globalAlpha = (i + 1) / a.length * 0.35; g.fillStyle = "#fff7e0"; g.beginPath(); g.arc(p[0], p[1], 2 + 3 * p[2], 0, 7); g.fill(); }); g.globalAlpha = 1;
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(bx, yAt(t), 5 + 3 * t, 2 + t, 0, 0, 7); g.fill(); g.fillStyle = "#fff7e0"; g.beginPath(); g.arc(bx, by, 3.5 + 4 * t, 0, 7); g.fill(); g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; g.stroke();
    const px = laneX((o.pl == null ? st.lane : o.pl) * 0.9, 1), sw = o.swing || 0; g.save(); g.translate(px, BOT + 8); g.rotate(-sw * 0.9); g.fillStyle = "#3b2314"; g.fillRect(-3, 0, 6, 16); g.fillStyle = "#dc2626"; g.beginPath(); g.ellipse(0, -2, 16, 10, 0, 0, 7); g.fill(); g.strokeStyle = "#7f1d1d"; g.lineWidth = 2; g.stroke(); g.restore();
  }

  // ------------------------------------------------------------ spiegazione
  const cap = (g, t, y) => { g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(0, y - 14, W, 22); g.fillStyle = "#fde047"; g.font = "800 12px system-ui"; g.textAlign = "center"; g.fillText(t, W / 2, y + 2); };
  const PAGES = [
    { t: "Colpisci al momento giusto", p: "La pallina arriva verso di te. Quando entra nella <b>finestra tratteggiata</b> si accende <b>ORA!</b>: premi una direzione. Troppo presto o troppo tardi, il punto è dell'avversario. Più sei al centro, più il colpo è forte.", draw(g, f) { const c = f % 150, t = Math.min(1.02, 0.1 + c / 150 * 0.95); scene(g, f, { t, dir: 1, lane: 0, cover: -1, lean: -1, wt: 0.12 }, { label: false }); cap(g, Math.abs(t - 0.92) <= 0.12 ? "ORA! premi ↖ ↑ o ↗" : "aspetta la finestra...", 218); } },
    { t: "Scegli dove rimandarla", p: "<b>↖ Sinistra · ↑ Dritto · Destra ↗</b>: decidi la corsia del rimando (puoi anche toccare il tavolo a sinistra, al centro o a destra). L'avversario sta in una corsia col <b>corpo</b>: manda la pallina <b>lontano da lui</b>.", draw(g, f) { const c = f % 170, st = { t: c < 60 ? 0.9 : Math.max(0.05, 0.9 - (c - 60) / 90 * 0.85), dir: c < 60 ? 1 : -1, lane: c < 60 ? 0 : 1, cover: -1, lean: -1, wt: 0.12 }; scene(g, f, st, { pl: 0, label: false, swing: c > 58 && c < 72 ? 1 : 0, win: false }); cap(g, c < 60 ? "lui sta a sinistra..." : c < 140 ? "rimando a destra: lontano da lui" : "PUNTO!", 218); } },
    { t: "Occhio alla posa", p: "A volte l'avversario <b>finge</b>: la racchetta gialla indica una corsia ma il corpo sta in un'altra. Fidati del <b>corpo</b>. Ai livelli alti fingerà di più. Vince chi arriva a 7.", draw(g, f) { scene(g, f, { t: 0.2, dir: -1, lane: 0, cover: 1, lean: -1, wt: 0.12 }, { win: false }); cap(g, "racchetta ◀ ma corpo ▶ → rimanda a sinistra", 218); } }
  ];

  // ------------------------------------------------------------ stato
  function mk(o, practice) {
    return { o, practice: !!practice, a: !practice && (o.at | 0) > 0 ? 1 : 0, b: 0, goal: practice ? 2 : WIN, saved: 0, t: 0, dir: 1, lane: 0, over: false, win: false, rally: 0, lean: 0, cover: 0, wait: 0.6, phase: "wait", aim: 0, swing: 0, trail: [], log: practice ? "Prova libera: primo a 2 punti, non conta." : "Aspetta la pallina e rimandala nella finestra tratteggiata." };
  }
  function hud() { if (!ui || !S) return; ui.hud.innerHTML = `<b>Tu ${S.a}</b><span>·</span><b>${esc(S.o.oppName || "Avversario")} ${S.b}</b><span>${S.practice ? "prova a " + S.goal : "a " + S.goal}</span>`; ui.lg.textContent = S.log; }
  function log(t) { if (!S) return; S.log = t; if (ui) ui.lg.textContent = t; }
  function controls() {
    if (!ui || !S) return; const bt = ui.bt;
    if (S.over && S.practice) { bt.innerHTML = `<button class="go" id="ppRe">↺ Riprova</button><button class="go" id="ppGo2">▶ Gioca davvero</button>`; bt.querySelector("#ppRe").onclick = () => restart(true); bt.querySelector("#ppGo2").onclick = () => restart(false); return; }
    if (S.over) { bt.innerHTML = `<button class="go" id="ppGo">Continua ▸</button>`; bt.querySelector("#ppGo").onclick = () => close(S.win); return; }
    bt.innerHTML = `<button id="ppL">↖ Sinistra</button><button id="ppC">↑ Dritto</button><button id="ppR">Destra ↗</button>`;
    [["#ppL", -1], ["#ppC", 0], ["#ppR", 1]].forEach(([s, v]) => (bt.querySelector(s).onpointerdown = (e) => { e.preventDefault(); if (!(tutC && tutC.open)) hit(v); }));
  }
  function serve() {
    if (S.over) return; S.rally = 0; S.dir = 1; S.t = 0; S.lane = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.hitDone = false; S.lean = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.cover = Math.random() < L().feint ? [-1, 0, 1][Math.floor(Math.random() * 3)] : S.lean; S.wait = 0.5; S.trail = [];
  }
  const speed = () => 1 / Math.max(0.55, L().dur - 0.04 * S.rally);
  function point(you, why) {
    const px = W / 2;
    if (you) { S.a++; fxo.banner("PUNTO!", "#86efac"); fxo.burst(px, 70, 22, ["#fde047", "#fff", "#4ade80"]); }
    else if (!S.practice && S.saved < (S.o.df | 0) && S.b < WIN) { S.saved++; log(why + " Ma un punto ti viene concesso: la tua difesa tiene."); S.wait = 0.9; S.phase = "wait"; hud(); serve(); return; }
    else { S.b++; fxo.banner("PERSO", "#fca5a5"); }
    log(why); hud(); S.phase = "wait";
    if (S.a >= S.goal || S.b >= S.goal) S.wait = 9;
    if (S.a >= S.goal) return setTimeout(() => finish(true), 350); if (S.b >= S.goal) return setTimeout(() => finish(false), 350);
    serve(); S.wait = 0.9;
  }
  function hit(aim) {
    if (!S || S.over || S.dir !== 1) return false; const w = winW(S.o.te), d = Math.abs(S.t - 0.92);
    if (S.wait > 0) return false;
    if (S.t < 0.7) { log("Troppo presto: la racchetta taglia l'aria."); S.swing = 1; fxo.text("presto!", laneX(S.lane, 1), 170, "#fca5a5"); return false; }
    if (d > w) { log("Fuori tempo."); S.swing = 1; fxo.text("fuori tempo", laneX(S.lane, 1), 170, "#fca5a5"); return false; }
    const q = d < w * 0.35 ? 2 : d < w * 0.7 ? 1 : 0; S.dir = -1; S.aim = aim; S.quality = q; S.rally++; S.swing = 1;
    const away = aim !== S.cover, p = (away ? 0.78 : 0.14) + q * 0.08 - L().tough * 0.3 + (S.rally > 6 ? 0.06 : 0);
    S.oppMiss = Math.random() < Math.max(0.04, Math.min(0.95, p));
    S.lane = aim; log(q === 2 ? "Colpo perfetto!" : q === 1 ? "Buon colpo." : "Colpo debole."); fxo.text(q === 2 ? "PERFETTO!" : q === 1 ? "buono" : "debole", laneX(aim, 1), 170, q === 2 ? "#fde047" : "#fff"); fxo.burst(laneX(aim, 1), 190, q === 2 ? 14 : 6, ["#fff", "#fde047"]);
    return true;
  }
  function step(dt) {
    if (S.over) return; S.swing = Math.max(0, S.swing - dt * 5); if (S.wait > 0) { S.wait -= dt; return; } S.phase = "play";
    const sp = speed(), tx = laneX(S.lane, Math.max(0, Math.min(1, S.t))), ty = yAt(Math.max(0, Math.min(1, S.t))) - Math.sin(Math.max(0, Math.min(1, S.t)) * 3.14) * 18; S.trail.push([tx, ty, S.t]); if (S.trail.length > 9) S.trail.shift();
    if (S.dir === 1) { S.t += dt * sp; if (S.t > 0.92 + winW(S.o.te) + 0.02) { point(false, "Troppo tardi: punto per " + (S.o.oppName || "l'avversario") + "."); } }
    else { S.t -= dt * sp * 1.05; if (S.t <= 0.04) { if (S.oppMiss) point(true, "Punto! " + (S.o.oppName || "L'avversario") + " non ci arriva."); else { S.dir = 1; S.rally++; S.lane = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.lean = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.cover = Math.random() < L().feint ? [-1, 0, 1][Math.floor(Math.random() * 3)] : S.lean; S.trail = []; log("Rimandata! Guarda dove sta e dove tiene la racchetta."); fxo.text("rimandata!", W / 2, 60, "#fca5a5"); } } }
  }
  function finish(win) {
    if (!S || S.over) return; if (tutC) tutC.close(); tutC = null; S.over = true; S.win = !!win;
    log(S.practice ? "Prova finita: riprova o gioca davvero." : win ? `Vinci ${S.a}-${S.b}. Applausi, e un calice che si rovescia.` : `Perdi ${S.a}-${S.b}. L'avversario si ventila con la racchetta.`);
    if (!S.practice) fxo.banner(win ? "VITTORIA!" : "SCONFITTA", win ? "#86efac" : "#fca5a5");
    hud(); controls(); if (window.__pingpong.state) window.__pingpong.state.done = win;
  }
  function restart(practice) { const o = S.o; S = mk(o, practice); fxo = M.fx(); serve(); hud(); controls(); }
  function close(win) { cancelAnimationFrame(raf); const o = S.o, r = { win: !!win, a: S.a, b: S.b }; if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__pingpong.state = null; o.onDone && o.onDone(r); }
  function loop(ts) {
    if (!S || !ui) return; const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts; if (!(tutC && tutC.open)) step(dt);
    const g = ui.g; g.setTransform(M.SS, 0, 0, M.SS, 0, 0); const sh = fxo.sh > 0 ? (Math.random() - 0.5) * fxo.sh : 0; g.save(); g.translate(sh, 0);
    scene(g, ts / 16, { t: S.t, dir: S.dir, lane: S.lane, cover: S.cover, lean: S.lean, wt: winW(S.o.te), trail: S.trail }, { swing: S.swing, pl: S.dir === 1 ? S.lane : S.aim }); g.restore(); fxo.tick(); fxo.draw(g);
    raf = requestAnimationFrame(loop);
  }
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("ppOv", "🏓 " + (o.title || "Ping-Pong da Salone") + (o.level ? " · Liv. " + o.level : ""), "#facc15"); ui.root.style.background = "#1a0f08";
    fxo = M.fx(); S = mk(o, false); tutC = null;
    ui.cv.addEventListener("pointerdown", (e) => { if (!S || S.over || (tutC && tutC.open)) return; const r = ui.cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; hit(x < 0.34 ? -1 : x > 0.66 ? 1 : 0); });
    ui.help.onclick = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "pingpong", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } }); };
    window.__pingpong.state = { finish, hit, tut: () => !!(tutC && tutC.open), get a() { return S.a; }, get b() { return S.b; }, get over() { return S.over; }, get t() { return S.t; }, get practice() { return S.practice; } };
    serve(); hud(); controls(); last = performance.now(); raf = requestAnimationFrame(loop);
    if (o.tutorial !== false && !M.seen("pingpong")) tutC = M.tut({ root: ui.root, key: "pingpong", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } });
    return true;
  }
  window.__pingpong = { start, state: null };
})();
