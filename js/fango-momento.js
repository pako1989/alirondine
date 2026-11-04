// js/fango-momento.js - «IL MOMENTO»: il minigioco di «Dal Fango alla Leggenda». In una partita della carriera tu non giochi novanta minuti:
// giochi i tre, quattro momenti in cui il pallone arriva a te. Vista dall'alto, porta in cima.
//  · AZIONE: levetta (trascina sul campo, o frecce) per portare palla tra i difensori; ⚡ DRIBBLA = finta, per un attimo nessuno ti prende (poi si ricarica);
//    🎯 TIRA apre la mira (un segno corre sulla linea di porta), secondo tocco = tiro lì. Più sei vicino, meno tempo ha il portiere.
//  · PUNIZIONE: tocco 1 ferma la mira, tocco 2 ferma la forza (zona verde = sopra la barriera e sotto la traversa).
//  · RIGORE: un tocco ferma la mira; il portiere sceglie un lato. Angolo = gol sicuro se entra, ma il palo è vicino.
// start({ title, moments:[{ kind:"azione"|"punizione"|"rigore", txt }], need (gol per vincere, default metà), lv (1-5 difficoltà), ovr (40-99 valutazione del giocatore),
//   oppColor, heroLook:{ name, skin, hair, shirt }, tutorial, onDone({ win, a: gol, b: momenti, data:{ goals, res:[...] } }) })
// Per il cabinato della Sala Giochi: start({ title, rounds, need, lv }) genera da solo una serie mista di momenti.
(function () {
  "use strict";
  if (window.__fangoMomento) return;
  const M = window.__mini || {}, W = 380, H = 230, SS = 2;
  const GX0 = 148, GX1 = 232, GY = 22, GC = 190;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), now = () => performance.now() / 1000, hyp = Math.hypot;
  const BK = "ali-di-rondine.fango.momento.best";
  const best = () => { try { return +localStorage.getItem(BK) || 0; } catch (e) { return 0; } };
  const saveBest = (n) => { try { if (n > best()) localStorage.setItem(BK, String(n)); } catch (e) {} };
  const KINDS = { azione: "Azione", punizione: "Punizione", rigore: "Rigore" };
  let S = null, ui = null, raf = 0, tutC = null, lastT = 0, F = null, joy = null, keys = {};
  function diffK() { try { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; } catch (e) { return 1; } }

  function series(n) { const out = []; for (let i = 0; i < n; i++) out.push({ kind: i % 4 === 3 ? "rigore" : i % 3 === 2 ? "punizione" : "azione" }); return out; }
  function mk(o, practice) {
    const moments = practice ? [{ kind: "azione", txt: "Prova libera: nulla conta." }] : (o.moments && o.moments.length ? o.moments : series(o.rounds || 4));
    return { o, practice: !!practice, moments, i: 0, goals: 0, res: [], lv: clamp(o.lv || 2, 1, 6) * (practice ? 0.7 : diffK()), ovr: clamp(o.ovr || 60, 30, 99), need: o.need || Math.ceil(moments.length / 2), t: 0, f: 0, phase: "intro", cur: null, ended: false, win: false, pause: 0 };
  }
  // ---------------------------------------------------------------- un momento
  function setup(quiet) {
    const m = S.moments[S.i], lv = S.lv, k = m.kind; joy = null;
    const c = { kind: k, txt: m.txt || "", t: 0, ball: null, aim: null, pow: null, gk: { x: GC, y: GY + 8, tx: GC, dive: 0 }, defs: [], p: null, dodge: 0, cd: 0, clock: 0, sub: "move", out: null };
    if (k === "azione") {
      c.p = { x: 120 + Math.random() * 140, y: 206 };
      const n = clamp(Math.round(1 + lv * 0.7), 2, 5);
      for (let i = 0; i < n; i++) c.defs.push({ x: 90 + ((i + 0.5) / n) * 200 + (Math.random() - 0.5) * 30, y: 70 + Math.random() * 70, vx: 0, vy: 0, lag: 0.15 + Math.random() * 0.3, stun: 0 });
      c.clock = 8 + (S.ovr - 60) / 20;
    } else if (k === "punizione") {
      c.p = { x: 120 + Math.random() * 140, y: 118 + Math.random() * 20 }; c.sub = "aim";
      const dx = GC - c.p.x, dy = GY - c.p.y, l = hyp(dx, dy), bx = c.p.x + dx / l * 34, by = c.p.y + dy / l * 34;
      const nb = clamp(Math.round(2 + lv * 0.5), 3, 5); for (let i = 0; i < nb; i++) c.defs.push({ x: bx + (i - (nb - 1) / 2) * 9 * (-dy / l), y: by + (i - (nb - 1) / 2) * 9 * (dx / l), wall: true });
      c.gk.x = GC + (c.p.x < GC ? 10 : -10);
    } else { c.p = { x: GC, y: 84 }; c.sub = "aim"; }
    S.cur = c; S.phase = "intro"; S.pause = 1.1; if (quiet) return;
    F && F.banner((k === "rigore" ? "RIGORE" : k === "punizione" ? "PUNIZIONE" : "IL MOMENTO") + " " + (S.i + 1), "#fde047");
    controls(); lg();
  }
  const sweepSpeed = () => clamp(0.85 + S.lv * 0.2 - (S.ovr - 60) / 80, 0.6, 2.2); // giri al secondo del segno di mira
  function startAim() { const c = S.cur; if (!c || c.aim) return; c.sub = "aim"; c.aim = { x: GX0 - 10, d: 1 }; controls(); }
  function press() { // TIRA / tocco
    const c = S && S.cur; if (!c || S.phase !== "play" || c.ball) return false;
    if (c.kind === "azione") { if (!c.aim) { startAim(); return true; } return kick(c.aim.x, 1); }
    if (c.kind === "punizione") {
      if (c.sub === "aim") { if (!c.aim) { c.aim = { x: GX0 - 10, d: 1 }; return true; } c.sub = "pow"; c.pow = { v: 0, d: 1 }; controls(); return true; }
      if (c.sub === "pow") return kick(c.aim.x, c.pow.v);
    }
    if (c.kind === "rigore") { if (!c.aim) { c.aim = { x: GX0 - 10, d: 1 }; return true; } return kick(c.aim.x, 1); }
    return false;
  }
  function dodge() { const c = S && S.cur; if (!c || c.kind !== "azione" || S.phase !== "play" || c.cd > 0 || c.ball) return false; c.dodge = 0.55; c.cd = 2.2 - (S.ovr - 60) / 60; F && F.text("FINTA!", c.p.x, c.p.y - 18, "#a5f3fc"); return true; }
  function kick(tx, pw) {
    const c = S.cur, p = c.p, d = hyp(tx - p.x, GY - p.y), sp = 300 + (S.ovr - 60) * 1.5;
    c.ball = { x: p.x, y: p.y - 6, tx, ty: GY - 2, t: 0, dur: d / sp, pw, curve: c.kind === "punizione" ? (tx > p.x ? -1 : 1) * 18 : 0, h: 0 };
    // il portiere: va verso il tiro alla sua velocità, con riflessi legati alla difficoltà
    const reach = 10 + S.lv * 1.6, gsp = 55 + S.lv * 16, guess = Math.random() < 0.28 + S.lv * 0.08;
    if (c.kind === "rigore") { c.gk.tx = guess ? tx + (Math.random() - 0.5) * 16 : GC + (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 18); if (Math.random() < 0.12) c.gk.tx = GC; c.gk.spd = 160; }
    else { c.gk.tx = tx; c.gk.spd = gsp; }
    c.gk.reach = reach; c.aim = null; controls(); return true;
  }
  function resolve(kind, txt) {
    const c = S.cur; if (c.out) return; c.out = kind; const gol = kind === "gol";
    if (gol) { S.goals++; F && (F.banner("GOOOL!", "#fde047"), F.burst(c.ball ? c.ball.x : GC, GY + 4, 26, ["#fde047", "#fff", "#f97316"]), F.shake(5)); }
    else F && F.banner(txt || "NIENTE", "#fca5a5");
    S.res.push({ kind: c.kind, out: kind }); S.pause = 1.5; S.phase = "after"; controls(); lg();
  }
  function next() { S.i++; if (S.i >= S.moments.length) { if (S.practice) { S.i = 0; return setup(); } return end(S.goals >= S.need); } setup(); }
  function step(dt) {
    if (!S || S.ended) return; S.t += dt; S.f++; F && F.tick();
    const c = S.cur; if (!c) return;
    if (S.pause > 0) { S.pause -= dt; if (S.pause <= 0) { if (S.phase === "intro") { S.phase = "play"; controls(); lg(); } else if (S.phase === "after") next(); } return; }
    if (S.phase !== "play") return;
    c.t += dt; c.dodge = Math.max(0, c.dodge - dt); c.cd = Math.max(0, c.cd - dt);
    // segni di mira e forza
    if (c.aim) { c.aim.x += c.aim.d * (GX1 - GX0 + 20) * sweepSpeed() * dt; if (c.aim.x > GX1 + 10) { c.aim.x = GX1 + 10; c.aim.d = -1; } if (c.aim.x < GX0 - 10) { c.aim.x = GX0 - 10; c.aim.d = 1; } }
    if (c.pow) { c.pow.v += c.pow.d * dt * (1.1 + S.lv * 0.12); if (c.pow.v > 1) { c.pow.v = 1; c.pow.d = -1; } if (c.pow.v < 0) { c.pow.v = 0; c.pow.d = 1; } }
    // portiere: segue la palla (o il giocatore) e si tuffa sul tiro
    const gk = c.gk, tgt = c.ball ? gk.tx : clamp(c.p.x * 0.35 + GC * 0.65, GX0 + 6, GX1 - 6), gs = c.ball ? gk.spd : 40;
    gk.x += clamp(tgt - gk.x, -gs * dt, gs * dt);
    if (c.kind === "azione" && !c.ball) {
      // giocatore: levetta o frecce
      let ax = 0, ay = 0; if (joy && joy.on) { ax = joy.dx; ay = joy.dy; } if (keys.l) ax -= 1; if (keys.r) ax += 1; if (keys.u) ay -= 1; if (keys.d) ay += 1;
      const l = hyp(ax, ay); if (l > 0.12) { const v = (62 + S.ovr * 0.55) * (c.aim ? 0.35 : 1) * Math.min(1, l); c.p.x = clamp(c.p.x + ax / Math.max(1, l) * v * dt, 30, W - 30); c.p.y = clamp(c.p.y + ay / Math.max(1, l) * v * dt, GY + 26, H - 10); }
      // difensori: vanno dove sarai tra un attimo
      c.defs.forEach((d) => {
        if (d.stun > 0) { d.stun -= dt; return; }
        const px = c.p.x + (ax || 0) * 18 * d.lag * 3, py = c.p.y + (ay || 0) * 18 * d.lag * 3, dx = px - d.x, dy = py - d.y, l2 = hyp(dx, dy) || 1, sp = (40 + S.lv * 11) * (c.aim ? 0.6 : 1);
        d.vx += (dx / l2 * sp - d.vx) * Math.min(1, dt * 3); d.vy += (dy / l2 * sp - d.vy) * Math.min(1, dt * 3); d.x += d.vx * dt; d.y += d.vy * dt;
        if (hyp(d.x - c.p.x, d.y - c.p.y) < 10) { if (c.dodge > 0) { d.stun = 0.8; F && F.text("SALTATO!", d.x, d.y - 12, "#bbf7d0"); } else resolve("persa", "PALLA PERSA"); }
      });
      c.clock -= dt; if (c.clock <= 0 && !c.out) resolve("tempo", "TROPPO TARDI");
      if (c.p.y < GY + 34 && !c.aim && !c.out) startAim();
    }
    // il pallone in volo
    const b = c.ball;
    if (b && !c.out) {
      b.t += dt / Math.max(0.12, b.dur); const k = clamp(b.t, 0, 1);
      b.x = c.p.x + (b.tx - c.p.x) * k + Math.sin(k * Math.PI) * b.curve; b.y = (c.p.y - 6) + (b.ty - (c.p.y - 6)) * k;
      if (c.kind === "punizione") { b.h = Math.sin(k * Math.PI) * (b.pw * 34); const wl = c.defs[0]; const passing = c.defs.length && k > 0.2 && k < 0.45; if (passing && b.h < 13) return resolve("barriera", "IN BARRIERA"); }
      if (k >= 1) {
        if (c.kind === "punizione" && b.pw > 0.82) return resolve("fuori", "ALTA!");
        if (b.tx < GX0 + 1 || b.tx > GX1 - 1) return resolve("fuori", b.tx < GX0 - 4 || b.tx > GX1 + 4 ? "FUORI!" : "PALO!");
        if (Math.abs(gk.x - b.x) < gk.reach) { F && F.burst(gk.x, gk.y, 10, ["#fff", "#93c5fd"]); return resolve("parata", "PARATA!"); }
        resolve("gol");
      }
    }
  }
  function end(win) { if (!S || S.ended) return; S.ended = true; S.phase = "end"; S.win = !!win; if (!S.practice) saveBest(S.goals); controls(); lg(); }

  // ---------------------------------------------------------------- disegno
  function pitch(g, f) {
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? "#2f8a3a" : "#37a043"; g.fillRect(0, i * 23, W, 23); }
    // un po' di fango, come si deve
    g.fillStyle = "rgba(90,68,48,.35)"; [[GC, 60, 40, 10, 0], [100, 190, 26, 8, 0.2], [290, 150, 20, 6, 0]].forEach(([x, y, rx, ry, r]) => { g.beginPath(); g.ellipse(x, y, rx, ry, r, 0, 7); g.fill(); });
    g.strokeStyle = "rgba(255,255,255,.85)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, GY); g.lineTo(W, GY); g.stroke(); g.strokeRect(90, GY, 200, 72); g.strokeRect(150, GY, 80, 26); g.beginPath(); g.arc(GC, GY + 72, 22, 0.25, Math.PI - 0.25); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.arc(GC, GY + 56, 1.6, 0, 7); g.fill();
    // porta con rete
    g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(GX0, 2, GX1 - GX0, GY - 2); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 0.6; for (let x = GX0; x <= GX1; x += 6) { g.beginPath(); g.moveTo(x, 2); g.lineTo(x, GY); g.stroke(); } for (let y = 4; y < GY; y += 5) { g.beginPath(); g.moveTo(GX0, y); g.lineTo(GX1, y); g.stroke(); }
    g.strokeStyle = "#f8fafc"; g.lineWidth = 3; g.beginPath(); g.moveTo(GX0, GY); g.lineTo(GX0, 2); g.lineTo(GX1, 2); g.lineTo(GX1, GY); g.stroke();
    // cartelloni
    g.fillStyle = "#111827"; g.fillRect(0, 0, GX0 - 10, 10); g.fillRect(GX1 + 10, 0, W - GX1 - 10, 10); g.font = "800 7px system-ui"; g.fillStyle = "#fde047"; g.fillText("CARNI SGHEMBI", 30, 8); g.fillText("BAR SPORT STERPAGLIA", GX1 + 24, 8);
  }
  function scene(g, st, f) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); const sh = F && F.sh > 0 ? (Math.random() - 0.5) * F.sh : 0; g.translate(sh, 0);
    pitch(g, f); const c = st.cur; if (!c) return;
    const hl = (st.o && st.o.heroLook) || {}, oc = (st.o && st.o.oppColor) || "#1d4ed8";
    // segno di mira sulla linea di porta
    if (c.aim) { const x = c.aim.x, inn = x > GX0 && x < GX1; g.fillStyle = inn ? "#fde047" : "#f87171"; g.beginPath(); g.moveTo(x, GY + 2); g.lineTo(x - 5, GY + 10); g.lineTo(x + 5, GY + 10); g.fill(); g.strokeStyle = inn ? "rgba(253,224,71,.5)" : "rgba(248,113,113,.4)"; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(c.p.x, c.p.y - 6); g.lineTo(x, GY + 4); g.stroke(); g.setLineDash([]); }
    // portiere
    const gk = c.gk; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(gk.x, gk.y + 6, 9, 2.6, 0, 0, 7); g.fill(); g.fillStyle = "#facc15"; g.fillRect(gk.x - 7, gk.y - 5, 14, 10); g.fillStyle = "#e8c8a0"; g.beginPath(); g.arc(gk.x, gk.y - 8, 4, 0, 7); g.fill(); g.fillStyle = "#f8fafc"; g.fillRect(gk.x - 12, gk.y - 3, 4, 4); g.fillRect(gk.x + 8, gk.y - 3, 4, 4);
    // difensori o barriera
    c.defs.forEach((d, i) => { const stun = d.stun > 0; g.globalAlpha = stun ? 0.5 : 1; if (M.man) M.man(g, d.x, d.y, { s: 0.7, col: oc, shorts: "#0f172a", arms: d.wall ? -6 : null }); g.globalAlpha = 1; });
    // il giocatore (tu)
    const p = c.p; if (c.dodge > 0) { g.strokeStyle = "rgba(165,243,252,.8)"; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y - 4, 13, 0, 7); g.stroke(); }
    if (M.man) M.man(g, p.x, p.y, { s: 0.8, col: hl.shirt || "#7f1d1d", shorts: "#111827", skin: hl.skin || "#e9bf96", num: hl.num || 9, img: M.img ? M.img("mf_me") : null });
    g.fillStyle = "#fde047"; g.beginPath(); g.moveTo(p.x, p.y - 30); g.lineTo(p.x - 4, p.y - 36); g.lineTo(p.x + 4, p.y - 36); g.fill();
    // pallone
    const b = c.ball; if (b && !c.out) { g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(b.x, b.y + 2, 3.5, 1.4, 0, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(b.x, b.y - (b.h || 0), 3.4, 0, 7); g.fill(); g.strokeStyle = "#334155"; g.lineWidth = 0.7; g.stroke(); }
    else if (!c.ball) { g.fillStyle = "#fff"; g.beginPath(); g.arc(p.x + 5, p.y + 6, 3.2, 0, 7); g.fill(); g.strokeStyle = "#334155"; g.lineWidth = 0.7; g.stroke(); }
    // barra della forza (punizione)
    if (c.pow) { const x = 344, y = 60, h = 110; g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(x, y, 16, h); g.fillStyle = "#16a34a"; g.fillRect(x + 2, y + h * (1 - 0.8), 12, h * 0.35); g.fillStyle = "#fde047"; g.fillRect(x - 3, y + h * (1 - c.pow.v) - 2, 22, 4); g.font = "800 7px system-ui"; g.fillStyle = "#fff"; g.fillText("FORZA", x - 4, y - 4); }
    // levetta disegnata
    if (joy && joy.on) { g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 2; g.beginPath(); g.arc(joy.x0, joy.y0, 22, 0, 7); g.stroke(); g.fillStyle = "rgba(255,255,255,.55)"; g.beginPath(); g.arc(joy.x0 + joy.dx * 20, joy.y0 + joy.dy * 20, 9, 0, 7); g.fill(); }
    if (c.kind === "azione" && st.phase === "play") { g.font = "900 12px system-ui"; g.textAlign = "right"; g.fillStyle = c.clock < 2.5 ? "#f87171" : "#fff"; g.fillText("⏱ " + Math.max(0, c.clock).toFixed(1), W - 8, H - 8); g.textAlign = "left"; }
    F && F.draw(g);
    if (st.phase === "end") { g.setTransform(SS, 0, 0, SS, 0, 0); g.fillStyle = "rgba(2,6,23,.75)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 22px system-ui"; g.fillStyle = st.win ? "#fde047" : "#fca5a5"; g.fillText(st.win ? "IL TUO MOMENTO" : "NON ERA LA SERATA", W / 2, 96); g.font = "800 12px system-ui"; g.fillStyle = "#fff"; g.fillText(`Gol ${st.goals} su ${st.moments.length} momenti · record ${best()}`, W / 2, 120); g.textAlign = "left"; }
  }
  function hud() { if (!ui || !S) return; const c = S.cur; ui.hud.innerHTML = `<b>${S.practice ? "Prova" : "Momento " + Math.min(S.i + 1, S.moments.length) + "/" + S.moments.length}</b><span>${c ? KINDS[c.kind] : ""}</span><span>⚽ Gol ${S.goals}${S.practice ? "" : " · ne servono " + S.need}</span><span>⭐ ${S.ovr}</span>`; }
  function controls() {
    if (!ui || !S) return; hud();
    if (S.phase === "end") { ui.bt.innerHTML = `<button class="go" id="fmGo" style="flex-basis:100%">Fine ▸</button>`; ui.bt.querySelector("#fmGo").onclick = close; return; }
    const c = S.cur, az = c && c.kind === "azione";
    const lbl = !c ? "🎯 TIRA" : c.kind === "punizione" ? (c.sub === "pow" ? "💥 CALCIA" : c.aim ? "🎯 FERMA LA MIRA" : "🎯 MIRA") : c.kind === "rigore" ? (c.aim ? "🎯 TIRA LÌ" : "🎯 MIRA") : c.aim ? "🎯 TIRA LÌ" : "🎯 TIRA";
    ui.bt.innerHTML = `${az ? `<button id="fmDr">⚡ DRIBBLA</button>` : ""}<button id="fmTi" style="flex:2">${lbl}</button>${S.practice ? `<button id="fmEx">✕ Basta prova</button>` : ""}`;
    const tb = ui.bt.querySelector("#fmTi"); tb.onpointerdown = (e) => { e.preventDefault(); press(); controls(); };
    const db = ui.bt.querySelector("#fmDr"); if (db) db.onpointerdown = (e) => { e.preventDefault(); dodge(); };
    const ex = ui.bt.querySelector("#fmEx"); if (ex) ex.onclick = () => restart(false);
  }
  function lg() {
    if (!ui || !S) return; const c = S.cur;
    if (S.phase === "end") { ui.lg.innerHTML = S.win ? "Hai fatto quello che serviva, quando serviva. Domani lo racconteranno meglio di com'è andata." : "Il pallone è arrivato, il momento no. Capita anche ai campioni: a loro però lo perdonano prima."; return; }
    const base = c && c.kind === "azione" ? "<b>Trascina</b> sul campo per correre (o frecce). <b>⚡ Dribbla</b>: per un attimo i difensori non ti prendono. <b>🎯 Tira</b>: il segno corre sulla porta, tocca di nuovo per tirare lì." : c && c.kind === "punizione" ? "Tocca per far partire la <b>mira</b>, tocca di nuovo per fermarla, poi ferma la <b>forza</b> nella zona verde: sopra la barriera, sotto la traversa." : "Tocca per far partire la <b>mira</b>, poi tira. Il portiere sceglie un lato: vicino al palo è più sicuro, se entra.";
    ui.lg.innerHTML = (c && c.txt ? `<i>${c.txt}</i><br>` : "") + base;
  }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); const n = now(), dt = clamp(n - lastT, 0, 0.05); lastT = n; if (!(tutC && tutC.open)) step(dt); if (ui) scene(ui.g, S, S.f); if (S && S.f % 10 === 0) hud(); }
  function restart(practice) { const o = S.o; S = mk(o, practice); F = M.fx ? M.fx() : null; lastT = now(); setup(); }
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S, o = st.o; window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku);
    if (ui) ui.root.remove(); ui = null; S = null; try { window.__sagaCore && window.__sagaCore.endMatch(); } catch (e) {}
    o.onDone && o.onDone({ win: !!st.win, a: st.goals, b: st.moments.length, quit: false, data: { goals: st.goals, res: st.res } });
  }
  const KM = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d" };
  function kd(e) { if (!S) return; const k = KM[e.key]; if (k) { keys[k] = 1; e.preventDefault(); } if (e.key === " " || e.key === "Enter") { e.preventDefault(); press(); controls(); } if (e.key === "Shift" || e.key === "x") dodge(); }
  function ku(e) { const k = KM[e.key]; if (k) keys[k] = 0; }
  // spiegazione in tre pagine, con scene animate
  function demo(kind, fn) { let st = null; return (g, f) => { const sv = S; if (!st) { st = mk({ heroLook: {}, oppColor: "#1d4ed8" }, true); st.moments = [{ kind }]; S = st; setup(true); st.phase = "play"; st.pause = 0; } S = st; try { fn(S.cur, f); scene(g, S, f); } finally { S = sv; } }; }
  const PAGES = [
    { t: "Il tuo momento", p: "In carriera non giochi novanta minuti: giochi i <b>momenti</b> in cui il pallone arriva a te. <b>Trascina</b> sul campo per correre verso la porta (o usa le frecce). Se un difensore ti tocca, palla persa. Il tempo è poco.", draw: demo("azione", (c, f) => { c.p.x = 190 + Math.sin(f / 30) * 60; c.p.y = 190 - (f % 120); c.defs.forEach((d, i) => { d.x = c.p.x + Math.cos(f / 20 + i * 2) * 30; d.y = c.p.y - 30 - i * 10; }); }) },
    { t: "Dribbla e tira", p: "<b>⚡ Dribbla</b>: per un attimo nessuno ti prende e chi ti tocca resta sul posto. Poi si ricarica. <b>🎯 Tira</b>: un segno corre sulla linea di porta, tocca di nuovo per tirare lì. Più sei vicino, meno tempo ha il portiere.", draw: demo("azione", (c, f) => { c.p.y = 90; c.aim = { x: GX0 + ((f * 1.5) % (GX1 - GX0)), d: 1 }; c.dodge = (f % 80) < 30 ? 0.3 : 0; }) },
    { t: "Punizioni e rigori", p: "<b>Punizione</b>: ferma la mira, poi ferma la forza nella <b>zona verde</b> (troppo piano = barriera, troppo forte = alta). <b>Rigore</b>: ferma la mira; il portiere sceglie un lato. Vicino al palo è più sicuro, ma se esci è fuori.", draw: demo("punizione", (c, f) => { c.aim = { x: GX0 + 10 + ((f * 1.2) % 60), d: 1 }; c.pow = { v: (Math.sin(f / 15) + 1) / 2, d: 1 }; }) },
  ];
  function pos(ev) { const r = ui.cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * W, y: (ev.clientY - r.top) / r.height * H }; }
  function start(o) {
    o = o || {}; cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("fmOv", "🥾 " + (o.title || "Il Momento"), "#f59e0b"); ui.root.style.background = "#0c130b";
    S = mk(o, false); F = M.fx ? M.fx() : null; tutC = null; joy = null; keys = {}; lastT = now(); ui.cv.style.height = "auto"; ui.cv.style.flex = "none";
    const cv = ui.root.querySelector("canvas");
    cv.addEventListener("pointerdown", (ev) => { ev.preventDefault(); if (!S || S.phase === "end") return; const c = S.cur; if (c && c.kind !== "azione") { press(); controls(); return; } const p = pos(ev); joy = { on: true, x0: p.x, y0: p.y, dx: 0, dy: 0, id: ev.pointerId }; try { cv.setPointerCapture(ev.pointerId); } catch (e) {} });
    cv.addEventListener("pointermove", (ev) => { if (!joy || !joy.on) return; const p = pos(ev), dx = p.x - joy.x0, dy = p.y - joy.y0, l = hyp(dx, dy), k = Math.min(1, l / 22) / (l || 1); joy.dx = dx * k; joy.dy = dy * k; });
    const up = () => { if (joy) joy.on = false; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const openTut = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "fangomomento", pages: PAGES, onClose: (pr) => { tutC = null; restart(!!pr); } }); };
    ui.help.onclick = openTut;
    window.__fangoMomento.state = {
      get phase() { return S && S.phase; }, get goals() { return S ? S.goals : 0; }, get i() { return S ? S.i : 0; }, get cur() { return S && S.cur; }, tut: () => !!(tutC && tutC.open),
      press, dodge, tick: (sec) => { if (!S) return; let k = Math.round((sec || 0) / 0.016); while (k-- > 0 && S && !S.ended) step(0.016); },
      move: (x, y) => { if (S && S.cur && S.cur.p) { S.cur.p.x = x; S.cur.p.y = y; } },
      finish: (win, goals) => { if (tutC) { tutC.close(); tutC = null; } if (S) { if (goals != null) S.goals = goals; end(!!win); } }
    };
    setup(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("fangomomento"))) openTut();
    return true;
  }
  window.__fangoMomento = { start, state: null };
})();
