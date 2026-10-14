// js/marea.js - «MAREA» · il motore di partita originale di «Naufraghi del Pallone»
// Una partita 2 contro 2 più i portieri su un campo di celle, in riva al mare. Il mare sale mentre si gioca e si mangia le celle:
// prima i bordi, poi il centro. Cella bagnata = si va piano; cella sommersa = non si passa e il pallone affonda (se non va veloce:
// i tiri forti rimbalzano sull'acqua come sassi). Quando si segna, il mare si ritira dalla tua metà e si prende un pezzo di quella
// avversaria. Se una metà sparisce del tutto, ha perso chi la perde. Si segna prima che sparisca la tua metà.
// Comandi (telefono): TOCCO su un compagno = passa (senza palla: scatto) · TRASCINA = tira nella direzione · TOCCO su una cella = alza
// una pedana (terra asciutta per qualche secondo; tre alla volta, tornano col tempo).
// Tastiera: frecce = cursore sulle celle · Spazio/Invio = tocco sul cursore · X = tira verso il cursore · P = passa · T = tira in porta.
// Legge la difficoltà e il carattere degli avversari da window.__sagaCore.cur; alla fine chiama __sagaCore.endMatch() e o.onDone({ a, b, win, quit, data }).
// Espone window.__marea.state (con finish()) per i test, e window.__marea.sim per le simulazioni di bilanciamento.
(function () {
  "use strict";
  if (window.__marea) return;

  const COLS = 10, ROWS = 6, CW = 30, CH = 30, FW = COLS * CW, FH = ROWS * CH, CVW = 320, CVH = 200, OX = 10, OY = 14;
  const GY0 = 60, GY1 = 120; // la bocca della porta (due celle centrali)
  const KDEEP = 2.2, DUR = 100, CHMAX = 3, PEDT = 9;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hyp = Math.hypot;
  const hex = (c) => { c = String(c || "#888").replace("#", ""); if (c.length === 3) c = c.replace(/./g, "$&$&"); const n = parseInt(c, 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const cdist = (a, b) => { const x = hex(a), y = hex(b); return hyp(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };

  let STATE = null;

  // ------------------------------------------------------------------ SIMULAZIONE (senza grafica)
  // newSim(o, rnd) crea la partita; step(S, dt) la fa avanzare. Il disegno e i comandi stanno sopra.
  function parOpp(o) {
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: {}, style: "" }, DF = Object.assign({ opp: 1, steal: 1, shot: 1, gk0: 0, gk1: 0 }, cur.opts || {});
    const st = (o && o.opp && o.opp.style) || cur.style || "equilibrata", B = (o && o.bonus) || {};
    return { opp: DF.opp, steal: DF.steal, shot: DF.shot, gk0: DF.gk0 + 0.02 * (B.df || 0), gk1: DF.gk1, style: st, at: B.at || 0, df: B.df || 0, te: B.te || 0 };
  }
  function newSim(o, rnd) {
    o = o || {}; rnd = rnd || Math.random;
    const par = parOpp(o), mates = o.mates || [], oppN = (o.opp && o.opp.players) || [];
    const S = { o, par, rnd, t: 0, D: o.duration || DUR, a: 0, b: 0, phase: "play", over: false, golden: false, L: 0, bias: [0, 0], charges: CHMAX, chT: 0, pass: 0, ev: [], pause: 0, kick: 0, data: { gol: 0, pedane: 0, affondati: 0, mare: false, parate: 0 }, cells: [], P: [], ball: { x: FW / 2, y: FH / 2, vx: 0, vy: 0, car: null, last: 0, lock: 0, who: null, sink: 0 }, hint: "", seaWho: -1, sprintCd: 0 };
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const dr = Math.abs(r + 0.5 - ROWS / 2) / (ROWS / 2), dc = Math.abs(c + 0.5 - COLS / 2) / (COLS / 2);
      S.cells.push({ thr: 0.1 + 0.5 * (1 - dr) + 0.2 * (1 - dc) + 0.12 * rnd(), lvl: 0, ped: 0 });
    }
    const mk = (team, role, name, x, y, look) => ({ team, role, name, x, y, hx: x, hy: y, vx: 0, vy: 0, stun: 0, sprint: 0, face: team ? -1 : 1, look: look || {}, anim: rnd() * 6, ho: 0 });
    const hl = o.heroLook || {};
    S.P.push(mk(0, "f", (o.hero && o.hero.name) || hl.name || "Tu", 100, 62, { skin: hl.skin, hair: hl.hair, hero: true }));
    S.P.push(mk(0, "f", (mates[0] && mates[0].name) || "Bora", 100, 118, mates[0] || {}));
    S.P.push(mk(0, "k", (mates[1] && mates[1].name) || "Portiere", 9, 90, mates[1] || {}));
    S.P.push(mk(1, "f", (oppN[0] && oppN[0].name) || "Scoglio", 200, 62, oppN[0] || {}));
    S.P.push(mk(1, "f", (oppN[1] && oppN[1].name) || "Fiorenzo", 200, 118, oppN[1] || {}));
    S.P.push(mk(1, "k", (o.opp && o.opp.keeper && o.opp.keeper.name) || "Portiere", FW - 9, 90, (o.opp && o.opp.keeper) || {}));
    kickoff(S, 0);
    return S;
  }
  const cellI = (x, y) => clamp(Math.floor(y / CH), 0, ROWS - 1) * COLS + clamp(Math.floor(x / CW), 0, COLS - 1);
  const eff = (S, c) => (c.ped > 0 ? 0 : c.lvl);
  const lvlAt = (S, x, y) => eff(S, S.cells[cellI(x, y)]);
  const deepAt = (S, x, y) => lvlAt(S, x, y) >= 2;
  const speedAt = (S, x, y) => { const l = lvlAt(S, x, y); return l < 1 ? 1 : l < 2 ? 0.58 : 0.2; };
  const fieldP = (S, team) => S.P.filter((p) => p.team === team && p.role === "f");
  const keeper = (S, team) => S.P.find((p) => p.team === team && p.role === "k");

  function kickoff(S, team) {
    S.P.forEach((p) => { p.x = p.hx; p.y = p.hy; p.vx = p.vy = 0; p.stun = 0; p.sprint = 0; });
    const k = fieldP(S, team)[0]; k.x = FW / 2 - (team ? -8 : 8); k.y = FH / 2;
    const B = S.ball; B.vx = B.vy = 0; B.lock = 0; B.sink = 0; take(S, k); S.pass = 0; S.pause = 0.7;
  }
  function take(S, p) { const B = S.ball; B.car = p; B.who = p; B.last = p.team; B.vx = B.vy = 0; B.hold = 0; p.ho = 0; B.prot = 1.2; B.x = p.x + p.face * 5; B.y = p.y + 1; S.rcv = null; }
  const teamDir = (t) => (t ? -1 : 1);
  const atkX = (t) => (t ? 0 : FW);
  const ownX = (t) => (t ? FW : 0);

  // il livello del mare: sale col tempo; ogni gol lo sposta (verso l'altra metà)
  function seaTarget(S, c, ci) {
    const col = ci % COLS, half = col < COLS / 2 ? 0 : 1;
    let L = S.L + S.bias[half]; if (c.ped > 0) L = -1;
    return clamp((L - c.thr) * KDEEP, 0, 3);
  }
  function drowned(S, half) {
    let n = 0; for (let r = 0; r < ROWS; r++) for (let c = half * 5; c < half * 5 + 5; c++) { const k = S.cells[r * COLS + c]; if (eff(S, k) < 2) n++; }
    return n;
  }

  // ------------------------------------------------------------------ movimento
  function blockedAt(S, p, x, y) {
    if (p.role === "k") return x < (p.team ? FW - 24 : 3) || x > (p.team ? FW - 3 : 24) || y < 40 || y > 140;
    return x < 3 || x > FW - 3 || y < 3 || y > FH - 3 || deepAt(S, x, y);
  }
  function move(S, p, tx, ty, sp, dt) {
    const d = hyp(tx - p.x, ty - p.y); if (d < 0.8) { p.vx = p.vy = 0; return; }
    const k = sp * (p.stun > 0 ? 0.12 : 1) * (p.sprint > 0 ? 1.5 : 1) * speedAt(S, p.x, p.y) * Math.min(1, d / 6 + 0.35);
    let mx = ((tx - p.x) / d) * k * dt, my = ((ty - p.y) / d) * k * dt;
    if (!blockedAt(S, p, p.x + mx, p.y + my)) { p.x += mx; p.y += my; }
    else if (!blockedAt(S, p, p.x + mx, p.y)) p.x += mx;
    else if (!blockedAt(S, p, p.x, p.y + my)) p.y += my;
    p.vx = mx / dt; p.vy = my / dt; if (Math.abs(mx) > 0.02) p.face = mx > 0 ? 1 : -1;
  }
  function nearestDry(S, x, y) {
    let best = null, bd = 1e9;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { if (eff(S, S.cells[r * COLS + c]) >= 1.6) continue; const cx = c * CW + CW / 2, cy = r * CH + CH / 2, d = hyp(cx - x, cy - y); if (d < bd) { bd = d; best = [cx, cy]; } }
    return best || [FW / 2, FH / 2];
  }
  // una cella dove non si può stare: spingi via
  function flee(S, p) {
    if (p.role === "k") return;
    if (lvlAt(S, p.x, p.y) >= 2) { const q = nearestDry(S, p.x, p.y); p.x = q[0] + (S.rnd() - 0.5) * 8; p.y = q[1] + (S.rnd() - 0.5) * 8; p.stun = 0.9; if (S.ball.car === p) { S.ball.car = null; S.ball.x = p.x; S.ball.y = p.y; S.ball.vx = S.ball.vy = 0; S.ball.lock = 0.3; } S.ev.push(["splash", p.x, p.y]); }
  }
  // una posizione sicura per andare: se la cella è quasi sommersa, cerca accanto
  function safeSpot(S, x, y) {
    if (lvlAt(S, x, y) < 1.5) return [x, y];
    const q = nearestDry(S, x, y); return q;
  }

  // ------------------------------------------------------------------ palla
  function kick(S, p, tx, ty, v, noise) {
    const B = S.ball; let a = Math.atan2(ty - p.y, tx - p.x) + (noise || 0);
    B.car = null; B.vx = Math.cos(a) * v; B.vy = Math.sin(a) * v; B.last = p.team; B.who = p; B.lock = 0.35; B.x = p.x + Math.cos(a) * 6; B.y = p.y + Math.sin(a) * 6; B.kicker = p; B.hold = 0;
    S.ev.push(["kick", B.x, B.y, v]);
  }
  function doPass(S, from, to, speedF) {
    if (!to || to === from) return false;
    const ld = 0.3, tx = to.x + to.vx * ld, ty = to.y + to.vy * ld; kick(S, from, tx, ty, 170 * (speedF || 1), 0); S.rcv = to; S.pass++; S.data.passaggi = (S.data.passaggi || 0) + (from.team === 0 ? 1 : 0); return true;
  }
  function doShot(S, p, tx, ty, power, noise) {
    kick(S, p, tx, ty, 120 + 150 * clamp(power, 0, 1), noise); S.shot = { team: p.team, t: S.t }; S.data.tiri = (S.data.tiri || 0) + (p.team === 0 ? 1 : 0);
  }
  function loseBall(S, from, to) { if (S.ball.car === from) { take(S, to); from.stun = Math.max(from.stun, 0.45); } }

  // ------------------------------------------------------------------ intelligenza: movimento di squadra
  function teamMove(S, team, dt) {
    const par = S.par, B = S.ball, ps = fieldP(S, team), dir = teamDir(team), fx = team === 0 ? 1 : par.opp, sty = team === 1 ? par.style : "equilibrata";
    const car0 = B.car, have = car0 && car0.team === team, other = car0 && car0.team !== team;
    const base = 53 * fx * (sty === "pressing" && team ? 1.05 : 1);
    ps.forEach((p, i) => {
      if (p.stun > 0) p.stun -= dt; if (p.sprint > 0) p.sprint -= dt;
      let tx = p.hx, ty = p.hy, sp = base;
      if (car0 === p && B.car === p) { // chi ha la palla corre verso la porta, aggirando gli avversari
        const opp = fieldP(S, 1 - team); let ay = FH / 2 + (S.rnd() < 0 ? 0 : 0);
        opp.forEach((q) => { if (Math.abs(q.x - p.x) < 52 && (q.x - p.x) * dir > -8) ay += (p.y >= q.y ? 1 : -1) * (60 - Math.abs(q.y - p.y)) * 0.8; });
        ty = clamp(ay, 22, FH - 22); tx = atkX(team) - dir * 22; sp = (team === 0 ? 46 : 46 * fx) * (sty === "contropiede" && p.x * dir < FW * 0.45 * (team ? -1 : 1) + (team ? FW : 0) ? 1.12 : 1);
      } else if (have) { // il compagno si smarca davanti, dall'altra parte
        const c = car0; tx = clamp(c.x + dir * 52, 20, FW - 20); ty = c.y < FH / 2 ? clamp(c.y + 52, 22, FH - 22) : clamp(c.y - 52, 22, FH - 22); sp = base * 0.96;
      } else if (other) { // difesa: il più vicino pressa, l'altro copre
        const dB = hyp(p.x - B.x, p.y - B.y), mate = ps[1 - i], dM = hyp(mate.x - B.x, mate.y - B.y), pr = dB <= dM;
        const ownSide = Math.abs(B.x - ownX(team)) < 150;
        if (sty === "difensiva" && !ownSide) { tx = ownX(team) + dir * 120; ty = B.y; }
        else if (pr || sty === "pressing") { tx = B.x; ty = B.y; sp = base * 1.04; }
        else { tx = ownX(team) + dir * 58; ty = (B.y + FH / 2) / 2; }
      } else { // palla libera: il più vicino la prende
        const dB = hyp(p.x - B.x, p.y - B.y), mate = ps[1 - i], dM = hyp(mate.x - B.x, mate.y - B.y);
        if (dB <= dM || p.sprint > 0) { tx = B.x + B.vx * 0.25; ty = B.y + B.vy * 0.25; sp = base * 1.02; } else { tx = (p.hx + B.x) / 2; ty = (p.hy + B.y) / 2; }
      }
      if (p.sprint > 0 && !have) { tx = B.x; ty = B.y; }
      if (lvlAt(S, tx, ty) >= 1.6) { const q = safeSpot(S, tx, ty); tx = q[0]; ty = q[1]; }
      move(S, p, tx, ty, sp, dt); flee(S, p);
    });
    // il portiere
    const k = keeper(S, team);
    if (k) {
      if (k.stun > 0) k.stun -= dt;
      const gx = team ? FW - 9 : 9, near = Math.abs(B.x - ownX(team)) < 170, kf = team === 0 ? 1 + 0.04 * (S.par.df || 0) : par.opp;
      if (B.car === k) { k.hold = (k.hold || 0) + dt; move(S, k, gx, FH / 2, 40, dt); }
      else move(S, k, gx + dir * (near ? 8 : 0), near ? clamp(B.y, 48, 132) : FH / 2, 52 * kf, dt);
    }
  }
  // decisioni della squadra avversaria (e del pilota automatico di prova): passa o tira
  function aiDecide(S, team, dt) {
    const B = S.ball, c = B.car; if (!c || c.team !== team || c.role !== "f" || S.pause > 0) return;
    const par = S.par, dir = teamDir(team), mate = fieldP(S, team).find((q) => q !== c), opp = fieldP(S, 1 - team), fx = team === 1 ? par.opp : 1;
    const dg = Math.abs(atkX(team) - c.x), press = opp.some((q) => hyp(q.x - c.x, q.y - c.y) < 26);
    const sf = team === 1 ? par.shot : 1, sty = team === 1 ? par.style : "equilibrata";
    c.ho = (c.ho || 0) + dt; if (c.ho < 0.45) return;
    const shootRate = (dg < 130 ? 0.6 + (130 - dg) / 70 : 0) * sf * (sty === "difensiva" ? 0.75 : 1) * (sty === "contropiede" ? 1.1 : 1);
    if (shootRate && S.rnd() < shootRate * dt) {
      const side = S.rnd() < 0.5 ? -1 : 1, ty = FH / 2 + side * (8 + S.rnd() * 18), err = (S.rnd() - 0.5) * 2 * (team === 1 ? 0.13 / Math.max(0.6, sf) : 0.05);
      return doShot(S, c, atkX(team), ty, 0.55 + S.rnd() * 0.4, err);
    }
    if (press && mate && S.rnd() < 1.9 * dt && (mate.x - c.x) * dir > -40) return doPass(S, c, mate);
    if (!press && mate && S.rnd() < 0.18 * dt && (mate.x - c.x) * dir > 20) return doPass(S, c, mate);
  }

  // ------------------------------------------------------------------ passo di simulazione
  function step(S, dt, pilot) {
    if (S.over) return;
    const B = S.ball, par = S.par;
    S.t += dt; S.ev.length = 0;
    // il mare
    const k = S.golden ? 2.2 : 1, prog = clamp(S.t / S.D, 0, 1);
    S.L = 1.45 * Math.pow(prog, 1.05) + (S.golden ? (S.t - S.D) * 0.045 : 0) + 0.05 * Math.sin(S.t / 3.1) * prog;
    S.bias[0] = Math.max(-0.35, Math.min(0.9, S.bias[0])); S.bias[1] = Math.max(-0.35, Math.min(0.9, S.bias[1]));
    S.cells.forEach((c, i) => { if (c.ped > 0) c.ped -= dt; const t = seaTarget(S, c, i), r = t > c.lvl ? 0.55 : 0.35; c.lvl += clamp(t - c.lvl, -r * dt, r * dt); });
    S.chT += dt; if (S.charges < CHMAX && S.chT > 5) { S.charges++; S.chT = 0; } if (S.charges >= CHMAX) S.chT = 0;
    if (S.sprintCd > 0) S.sprintCd -= dt;
    if (S.pause > 0) { S.pause -= dt; if (S.phase === "goal" && S.pause <= 0) { S.phase = "play"; kickoff(S, S.kick); } return; }
    // squadre e palla
    teamMove(S, 0, dt); teamMove(S, 1, dt); aiDecide(S, 1, dt); if (pilot) pilot(S, dt); else if (S.autoPilot) autopilot(S, dt);
    if (B.car) { const c = B.car; B.x = c.x + c.face * 5; B.y = c.y + 1; B.vx = B.vy = 0; if (c.role === "k" && c.hold > 0.9) { const m = fieldP(S, c.team).reduce((a, q) => (a && hyp(a.x - c.x, a.y - c.y) < hyp(q.x - c.x, q.y - c.y) ? a : q), null); if (m) { doPass(S, c, m, 0.9); } } }
    else ballStep(S, dt);
    if (B.lock > 0) B.lock -= dt; if (B.prot > 0) B.prot -= dt;
    // contrasti: chi è vicino a chi ha la palla gliela può togliere
    if (B.car && B.car.role === "f" && !(B.prot > 0)) {
      const c = B.car;
      fieldP(S, 1 - c.team).forEach((d) => {
        if (d.stun > 0 || hyp(d.x - c.x, d.y - c.y) > 10) return;
        const rate = d.team === 0 ? 0.32 * (1 + 0.05 * (par.df || 0)) : 0.32 * par.steal * (par.style === "pressing" ? 1.12 : 1);
        if (S.rnd() < rate * dt) { loseBall(S, c, d); S.ev.push(["tackle", d.x, d.y]); }
      });
      // anche il portiere avversario raccoglie chi gli arriva addosso
      const kk = keeper(S, 1 - c.team); if (kk && hyp(kk.x - c.x, kk.y - c.y) < 10 && S.rnd() < 2 * dt) { loseBall(S, c, kk); S.data.parate++; }
    }
    // gol, uscite, annegamenti
    if (B.x < -2 && B.y >= GY0 && B.y <= GY1) return goal(S, 1);
    if (B.x > FW + 2 && B.y >= GY0 && B.y <= GY1) return goal(S, 0);
    S.P.forEach((p) => { if (p.role === "f") flee(S, p); });
    const dr = [drowned(S, 0), drowned(S, 1)];
    if ((dr[0] <= 3 || dr[1] <= 3) && dr[0] !== dr[1]) return end(S, dr[0] < dr[1] ? 1 : 0, true);
    if (S.t >= S.D && !S.golden) { if (S.a !== S.b) return end(S); S.golden = true; S.ev.push(["golden"]); }
    if (S.golden && S.t >= S.D + 50) { const w = dr[0] === dr[1] ? 1 : dr[0] > dr[1] ? 0 : 1; return end(S, w, true); }
  }
  function ballStep(S, dt) {
    const B = S.ball;
    // pozioni: chi prende la palla libera
    if (B.sink > 0) { B.sink -= dt; if (B.sink <= 0) { const q = nearestDry(S, B.x, B.y), t = 1 - B.last, c = fieldP(S, t).reduce((a, p) => (a && hyp(a.x - q[0], a.y - q[1]) < hyp(p.x - q[0], p.y - q[1]) ? a : p), null); B.x = q[0]; B.y = q[1]; B.vx = B.vy = 0; if (c) { c.x = q[0] + (t ? 8 : -8); c.y = q[1]; take(S, c); } } return; }
    const sp = hyp(B.vx, B.vy), cl = lvlAt(S, B.x, B.y);
    const fr = cl < 1 ? 0.9 : cl < 2 ? 2.8 : sp > 110 ? 1.6 : 7; // asciutto, bagnato, acqua (se va forte, rimbalza come un sasso)
    const f = Math.exp(-fr * dt); B.vx *= f; B.vy *= f; B.x += B.vx * dt; B.y += B.vy * dt;
    if (cl >= 2 && hyp(B.vx, B.vy) < 60 && !B.car) { B.sink = 0.8; B.vx = B.vy = 0; S.data.affondati++; S.ev.push(["splash", B.x, B.y]); return; }
    // muri e porte
    if (B.y < 2) { B.y = 2; B.vy = Math.abs(B.vy) * 0.6; } if (B.y > FH - 2) { B.y = FH - 2; B.vy = -Math.abs(B.vy) * 0.6; }
    if (B.x < 0 && (B.y < GY0 || B.y > GY1)) { B.x = 0; B.vx = Math.abs(B.vx) * 0.6; } if (B.x > FW && (B.y < GY0 || B.y > GY1)) { B.x = FW; B.vx = -Math.abs(B.vx) * 0.6; }
    if (B.x < -14 || B.x > FW + 14) { B.vx *= 0.3; }
    // i portieri parano
    S.P.forEach((p) => {
      if (p.role !== "k" || B.car) return;
      if (hyp(p.x - B.x, p.y - B.y) > 11 || (B.lock > 0 && B.who === p)) return;
      const toward = p.team === 0 ? B.vx < 0 : B.vx > 0, v = hyp(B.vx, B.vy);
      if (v < 70) { take(S, p); return; }
      if (!toward) return; if (p.sv && S.t - p.sv < 0.6) return; p.sv = S.t;
      const gk = p.team === 0 ? S.par.gk0 : S.par.gk1, ps = clamp(0.76 + gk - (v - 150) / 600, 0.3, 0.94);
      if (S.rnd() < ps) { take(S, p); p.hold = 0; S.data.parate += p.team === 1 ? 1 : 0; S.ev.push(["save", p.x, p.y]); } else S.ev.push(["miss", p.x, p.y]);
    });
    if (B.car) return;
    // chi la raccoglie: vicinanza, velocità e un po' di fortuna
    const v = hyp(B.vx, B.vy);
    if (v > 215) return;
    let best = null, bp = 0;
    S.P.forEach((p) => {
      if (p.role === "k" || p.stun > 0 || (B.lock > 0 && B.who === p)) return;
      const d = hyp(p.x - B.x, p.y - B.y), R = p === S.rcv ? 13 : 9.5; if (d > R) return;
      const rate = (p === S.rcv ? 16 : 9) * (p.team === 1 ? S.par.steal : 1); const pr = 1 - Math.exp(-rate * dt) * (1 - 0) ;
      if (S.rnd() < pr && pr > bp) { best = p; bp = pr; }
    });
    if (best) take(S, best);
  }
  function goal(S, team) {
    if (team === 0) S.a++; else S.b++; S.data.gol++;
    S.bias[1 - team] += 0.24; S.bias[team] -= 0.26; S.kick = 1 - team; S.phase = "goal"; S.pause = 1.9; S.ev.push(["goal", team]); S.lastGoal = team;
    S.ball.car = null; S.ball.vx = S.ball.vy = 0;
    if (S.golden) end(S);
  }
  function end(S, sea, bySea) {
    if (S.over) return; S.over = true;
    if (bySea) { S.data.mare = true; S.seaWho = sea; if (sea === 0) { if (S.a <= S.b) S.a = S.b + 1; } else if (S.b <= S.a) S.b = S.a + 1; }
    S.phase = "over"; S.ev.push(["end"]);
  }
  // un giocatore di prova: passa, tira e alza pedane come farebbe una persona decente
  function autopilot(S, dt) {
    const B = S.ball, c = B.car; if (!c || c.team !== 0 || c.role !== "f" || S.pause > 0) return;
    c.ho = (c.ho || 0) + dt; if (c.ho < 0.5) return;
    const mate = fieldP(S, 0).find((q) => q !== c), opp = fieldP(S, 1), dg = FW - c.x, press = opp.some((q) => hyp(q.x - c.x, q.y - c.y) < 28);
    if (dg < 130 && S.rnd() < (0.7 + (130 - dg) / 70) * dt) return doShot(S, c, FW, FH / 2 + (S.rnd() < 0.5 ? -1 : 1) * (8 + S.rnd() * 16), 0.6 + S.rnd() * 0.4, (S.rnd() - 0.5) * 0.06);
    if (press && mate && S.rnd() < 1.9 * dt) return doPass(S, c, mate);
    if (S.charges > 0 && S.rnd() < 0.05 * dt) { const q = S.cells.findIndex((k) => k.lvl > 1.4 && k.ped <= 0); if (q >= 0) { S.cells[q].ped = PEDT; S.charges--; S.data.pedane++; } }
  }
  const raiseCell = (S, i) => { const c = S.cells[i]; if (!c || S.charges <= 0 || c.ped > 0) return false; c.ped = PEDT; c.lvl = Math.min(c.lvl, 1.2); S.charges--; S.chT = 0; S.data.pedane++; S.ev.push(["ped", (i % COLS) * CW + CW / 2, Math.floor(i / COLS) * CH + CH / 2]); return true; };

  // ------------------------------------------------------------------ DISEGNO
  function css() {
    if (document.getElementById("mrCss")) return; const st = document.createElement("style"); st.id = "mrCss";
    st.textContent = `.mrOv{position:fixed;inset:0;z-index:9000;background:linear-gradient(180deg,#0e7490,#164e63);display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 10px;font-family:'Trebuchet MS',system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#ecfeff;overflow:hidden}
.mrOv .hud{width:min(100%,520px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #fde68a;border-radius:14px;background:rgba(6,40,52,.82);padding:5px 12px;font:800 12px 'Trebuchet MS',system-ui}
.mrOv .hud .n1{text-align:right}.mrOv .hud .sc{font:900 22px 'Trebuchet MS',system-ui;color:#fde68a;text-align:center}.mrOv .hud small{display:block;font:700 10px system-ui;opacity:.8;text-align:center}
.mrOv .bar{width:min(100%,520px);display:flex;gap:10px;align-items:center;justify-content:space-between;font:800 12px system-ui}
.mrOv .bar .t{font:900 13px system-ui;color:#fde68a}.mrOv .bar .pd{display:flex;gap:4px;align-items:center}.mrOv .bar .pd i{display:inline-block;width:16px;height:9px;border-radius:2px;background:#8a6a3a;border:1px solid #3f2a10;opacity:.28}.mrOv .bar .pd i.on{opacity:1}
.mrOv canvas{width:min(100%,520px);height:auto;aspect-ratio:320/200;flex:none;border:3px solid #fde68a;border-radius:14px;background:#0e7490;touch-action:none}
.mrOv .msg{width:min(100%,520px);min-height:34px;border-radius:10px;background:rgba(6,40,52,.78);border:1px solid rgba(253,230,138,.5);padding:5px 10px;font:700 12.5px/1.35 system-ui;text-align:center}
.mrOv .pad{width:min(100%,520px);display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mrOv .pad button{min-height:52px;border-radius:14px;border:2px solid #fde68a;background:rgba(6,40,52,.9);color:#ecfeff;font:900 14px system-ui;cursor:pointer;padding:5px}.mrOv .pad button small{display:block;font:600 10px system-ui;opacity:.8;margin-top:2px}.mrOv .pad button:active{background:#0f766e}
.mrOv .quit{position:absolute;right:8px;bottom:8px;min-height:30px;font-size:11px;padding:3px 10px;border-radius:10px;border:2px solid #fde68a;background:rgba(6,40,52,.9);color:#ecfeff;opacity:.85}
.mrOv .ov{position:absolute;inset:0;background:rgba(6,40,52,.9);display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;z-index:2}
.mrOv .card{max-width:440px;width:100%;border:3px solid #fde68a;border-radius:18px;background:#ecfeff;color:#0b3b45;padding:14px;box-shadow:6px 6px 0 #14b8a6}.mrOv .card h3{margin:0 0 8px;font:900 21px 'Trebuchet MS',system-ui;color:#0f766e}.mrOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.mrOv .card .big{font:900 34px 'Trebuchet MS',system-ui;text-align:center}
.mrOv .card ul{margin:6px 0 6px 18px;padding:0;font-size:13px;line-height:1.5}
.mrOv .card .goB{width:100%;margin-top:10px;background:#14b8a6;color:#fff;font:900 15px system-ui;min-height:50px;border:3px solid #0f766e;border-radius:14px;cursor:pointer}`;
    document.head.appendChild(st);
  }
  const C = { sand: ["#e8d9a6", "#e1d19b"], wet: "#b9a574", deep: ["#0e8aa0", "#0a6f8a"], night: ["#0a2a4c", "#0c3358"] };
  function draw(S, g, fr, cursor, aim, nightK) {
    const night = nightK === "notte", dusk = nightK === "tramonto";
    // mare tutto intorno
    const sea = g.createLinearGradient(0, 0, 0, CVH); sea.addColorStop(0, night ? "#0b2f52" : "#2cb6cc"); sea.addColorStop(1, night ? "#0a2a4c" : "#1b97b4"); g.fillStyle = sea; g.fillRect(0, 0, CVW, CVH);
    for (let i = 0; i < 18; i++) { const x = (i * 47 + fr * 0.4) % 340 - 10, y = (i * 29) % CVH; g.fillStyle = night ? "rgba(150,255,235,.16)" : "rgba(255,255,255,.18)"; g.fillRect(x, y, 14, 1); }
    g.save(); g.translate(OX, OY);
    // sabbia asciutta: il campo
    g.fillStyle = "#c9b27a"; g.fillRect(-3, -3, FW + 6, FH + 6);
    S.cells.forEach((c, i) => {
      const x = (i % COLS) * CW, y = Math.floor(i / COLS) * CH, l = eff(S, c), ci = i % COLS, ri = Math.floor(i / COLS);
      g.fillStyle = night ? ((ci + ri) % 2 ? "#6f6a58" : "#67624f") : (ci + ri) % 2 ? C.sand[0] : C.sand[1]; g.fillRect(x, y, CW, CH);
      if (l > 0.02) { // bagnato: la sabbia scurisce; sommerso: acqua che si muove
        const wl = clamp(l, 0, 3), a = Math.min(1, wl / 2);
        if (wl < 2) { g.fillStyle = `rgba(40,140,170,${0.2 + 0.4 * (wl / 2)})`; g.fillRect(x, y, CW, CH); g.fillStyle = `rgba(255,255,255,${0.1 * wl})`; for (let k = 0; k < 3; k++) g.fillRect(x + 3 + ((k * 11 + fr / 5) % 24), y + 6 + k * 9, 6, 1); }
        else {
          g.fillStyle = night ? C.night[(ci + ri) % 2] : C.deep[(ci + ri) % 2]; g.globalAlpha = Math.min(1, (wl - 1.4) / 0.8); g.fillRect(x, y, CW, CH); g.globalAlpha = 1;
          for (let k = 0; k < 3; k++) { g.fillStyle = night ? "rgba(120,255,230,.35)" : "rgba(255,255,255,.28)"; g.fillRect(x + ((fr / 3 + k * 13 + ci * 7) % 28), y + 5 + k * 10, 7, 1); }
          if (night) { const a = 0.3 + 0.5 * Math.abs(Math.sin(fr / 20 + i)); g.fillStyle = `rgba(110,255,225,${a})`; g.fillRect(x + (i * 7) % 26 + 2, y + (i * 11) % 24 + 2, 2, 2); g.fillRect(x + (i * 13) % 26 + 2, y + (i * 5) % 24 + 2, 1, 1); }
        }
        if (wl > 1.2 && wl < 2.3) { g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, CW - 1, CH - 1); }
      }
      if (c.ped > 0) { // la pedana di legno: assi, e un anello che si consuma
        g.fillStyle = "#8a6a3a"; g.fillRect(x + 3, y + 3, CW - 6, CH - 6); for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? "#a98858" : "#9a7a4a"; g.fillRect(x + 3, y + 4 + k * 6, CW - 6, 5); } g.strokeStyle = "#4a3418"; g.lineWidth = 1.5; g.strokeRect(x + 3.5, y + 3.5, CW - 7, CH - 7);
        const f = clamp(c.ped / PEDT, 0, 1); g.strokeStyle = f < 0.3 ? "#fca5a5" : "#fde68a"; g.lineWidth = 2; g.beginPath(); g.arc(x + CW / 2, y + CH / 2, 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * f); g.stroke();
      }
      // le righe del campo
      g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, CW - 1, CH - 1);
    });
    // linea di metà campo e cerchio
    g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 2; g.beginPath(); g.moveTo(FW / 2, 0); g.lineTo(FW / 2, FH); g.stroke(); g.beginPath(); g.arc(FW / 2, FH / 2, 24, 0, 7); g.stroke();
    // bordo di legno di mare
    g.fillStyle = "#6a4a22"; g.fillRect(-3, -3, FW + 6, 3); g.fillRect(-3, FH, FW + 6, 3); g.fillRect(-3, -3, 3, GY0 + 3); g.fillRect(-3, GY1, 3, FH - GY1 + 3); g.fillRect(FW, -3, 3, GY0 + 3); g.fillRect(FW, GY1, 3, FH - GY1 + 3);
    // le porte: pali di legno e rete
    [0, 1].forEach((t) => { const x = t ? FW : 0, d = t ? 1 : -1; g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(t ? x : x - 12, GY0, 12, GY1 - GY0); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1; for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(x, GY0 + k * 15); g.lineTo(x + d * 12, GY0 + k * 15); g.stroke(); } for (let k = 0; k <= 3; k++) { g.beginPath(); g.moveTo(x + d * k * 4, GY0); g.lineTo(x + d * k * 4, GY1); g.stroke(); } g.fillStyle = "#a98858"; g.fillRect(x - 2, GY0 - 3, 4, 6); g.fillRect(x - 2, GY1 - 3, 4, 6); g.fillStyle = t ? "#fb7185" : "#60a5fa"; g.fillRect(x - 1, GY0 - 12, 2, 10); g.fillRect(x + d * 2, GY0 - 12, 6 * d, 4); });
    // cursore (tastiera)
    if (cursor) { const cx = cursor.c * CW, cy = cursor.r * CH; g.strokeStyle = "#fef08a"; g.lineWidth = 2; g.setLineDash([4, 3]); g.strokeRect(cx + 1.5, cy + 1.5, CW - 3, CH - 3); g.setLineDash([]); }
    // giocatori e palla, in ordine di profondità
    const order = S.P.slice().sort((a, b) => a.y - b.y), B = S.ball;
    const person = (p) => {
      const col = p.team === 0 ? S.cA : S.cB, look = p.look || {}, skin = look.skin || (p.team ? "#d9a679" : "#e0ac7e"), hair = look.hair || (p.team ? "#3a2a1a" : "#2b1d14");
      g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(p.x, p.y + 6, 6, 2.4, 0, 0, 7); g.fill();
      const sw = Math.sin(fr / 4 + p.anim) * (hyp(p.vx, p.vy) > 6 ? 2 : 0), sink = lvlAt(S, p.x, p.y) >= 1 ? 2 : 0;
      g.fillStyle = "#3a2a1a"; g.fillRect(p.x - 3, p.y + 1 + sink * 0.3, 2, 5 - sink * 0.5 + sw * 0.3); g.fillRect(p.x + 1, p.y + 1 + sink * 0.3, 2, 5 - sink * 0.5 - sw * 0.3);
      g.fillStyle = p.role === "k" ? "#facc15" : col; g.fillRect(p.x - 4, p.y - 6 + sink * 0.4, 8, 8 - sink * 0.4);
      g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(p.x - 4, p.y - 6 + sink * 0.4, 8, 1.5);
      g.fillStyle = skin; g.beginPath(); g.arc(p.x, p.y - 10 + sink * 0.4, 4.2, 0, 7); g.fill();
      g.fillStyle = hair; g.beginPath(); g.arc(p.x, p.y - 11.2 + sink * 0.4, 4.3, Math.PI, 0); g.fill(); g.fillRect(p.x - 4.3, p.y - 11.4 + sink * 0.4, 8.6, 1.4);
      if (p.stun > 0) { g.fillStyle = "#fde047"; g.fillRect(p.x - 5 + (fr % 10), p.y - 18, 2, 2); g.fillRect(p.x + 3 - (fr % 10) * 0.5, p.y - 17, 2, 2); }
      if (sink) { g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1; g.beginPath(); g.ellipse(p.x, p.y + 5, 7, 2.5, 0, 0, 7); g.stroke(); }
      if (p.look && p.look.hero) { g.fillStyle = "#fde047"; g.beginPath(); g.moveTo(p.x, p.y - 21); g.lineTo(p.x - 3, p.y - 26); g.lineTo(p.x + 3, p.y - 26); g.closePath(); g.fill(); }
    };
    const label = (p) => { // il nome va SOTTO i piedi, mai sulla testa
      const nm = String(p.name || "").slice(0, 7); g.font = "bold 6px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.lineWidth = 2; g.strokeStyle = "rgba(0,0,0,.65)"; g.strokeText(nm, p.x, p.y + 14); g.fillStyle = p.team === 0 ? "#fff" : "#fde8e8"; g.fillText(nm, p.x, p.y + 14); g.textAlign = "left";
    };
    order.forEach((p) => { if (B.car && B.car === p) person(p); else person(p); });
    // palla (un cocco)
    if (!B.car || true) {
      const sink = B.sink > 0; g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(B.x, B.y + 3, 4, 1.6, 0, 0, 7); g.fill();
      if (!sink) { g.fillStyle = "#6a4a22"; g.beginPath(); g.arc(B.x, B.y - 1.5, 3.8, 0, 7); g.fill(); g.fillStyle = "#8a6636"; g.beginPath(); g.arc(B.x - 0.8, B.y - 2.2, 2.6, 0, 7); g.fill(); g.fillStyle = "#2b1d10"; g.fillRect(B.x - 1.8, B.y - 2.6, 1, 1); g.fillRect(B.x + 0.4, B.y - 2.9, 1, 1); g.fillRect(B.x - 0.4, B.y - 0.6, 1, 1); }
      else { g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 1; const r = 3 + (0.8 - B.sink) * 12; g.beginPath(); g.arc(B.x, B.y, r, 0, 7); g.stroke(); }
    }
    order.forEach(label);
    // mira del tiro
    if (aim) { g.strokeStyle = "rgba(254,240,138,.95)"; g.lineWidth = 2; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(aim.x0, aim.y0); g.lineTo(aim.x1, aim.y1); g.stroke(); g.setLineDash([]); g.fillStyle = "#fef08a"; g.beginPath(); g.arc(aim.x1, aim.y1, 3, 0, 7); g.fill(); }
    // effetti
    S.fx = (S.fx || []).filter((f) => f.life > 0); S.fx.forEach((f) => { f.life--; if (f.k === "splash") { g.strokeStyle = `rgba(255,255,255,${f.life / 30})`; g.lineWidth = 1; g.beginPath(); g.arc(f.x, f.y, 3 + (30 - f.life) * 0.5, 0, 7); g.stroke(); } else if (f.k === "conf") { f.x += f.vx; f.y += f.vy; f.vy += 0.05; g.fillStyle = f.c; g.fillRect(f.x, f.y, 2, 2); } else if (f.k === "txt") { g.font = "900 22px 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#0b3b45"; g.globalAlpha = Math.min(1, f.life / 20); g.strokeText(f.t, FW / 2, f.y); g.fillStyle = f.c; g.fillText(f.t, FW / 2, f.y); g.globalAlpha = 1; g.textAlign = "left"; f.y -= 0.3; } });
    g.restore();
    // il buio della notte, con il plancton che brilla sull'acqua
    if (night) { g.fillStyle = "rgba(5,15,40,.28)"; g.fillRect(0, 0, CVW, CVH); } else if (dusk) { g.fillStyle = "rgba(255,140,60,.12)"; g.fillRect(0, 0, CVW, CVH); }
    // il livello del mare (a sinistra, una colonna)
    const lv = clamp(S.L / 1.6, 0, 1); g.fillStyle = "rgba(6,40,52,.7)"; g.fillRect(1, 20, 6, 150); g.fillStyle = night ? "#5eead4" : "#7dd3fc"; g.fillRect(2, 20 + 148 * (1 - lv), 4, 148 * lv);
  }

  // ------------------------------------------------------------------ PARTITA
  function start(opts) {
    css(); const o = opts || {}, C0 = window.__sagaCore;
    const S = newSim(o);
    S.cA = o.usColor || "#1d4ed8"; S.cB = (o.opp && o.opp.color) || "#e11d48"; if (cdist(S.cA, S.cB) < 110) S.cB = cdist(S.cA, "#e11d48") > 110 ? "#e11d48" : "#16a34a";
    S.cursor = { c: 6, r: 2 }; S.autoPilot = false; STATE = S;
    const el = document.createElement("div"); el.className = "mrOv";
    el.innerHTML = `<div class="hud"><div class="n0"><span style="color:${esc(S.cA)}">●</span> ${esc(o.us || "I Rondine")}</div><div><div class="sc" id="mrSc">0 – 0</div><small id="mrTm">1:40</small></div><div class="n1">${esc((o.opp && o.opp.name) || "Avversari")} <span style="color:${esc(S.cB)}">●</span></div></div>
<div class="bar"><span class="t" id="mrSea">Mare: bassa</span><span class="pd" id="mrPd" title="Pedane"></span></div>
<canvas id="mrCv" width="${CVW}" height="${CVH}"></canvas>
<div class="msg" id="mrMsg">Tocca un compagno per passare · trascina per tirare · tocca una cella per alzare una pedana</div>
<div class="pad"><button type="button" id="mrPass">↦ PASSA<small>al compagno</small></button><button type="button" id="mrShoot">⚽ TIRA<small>verso la porta</small></button></div>`;
    document.body.appendChild(el);
    const cv = el.querySelector("#mrCv"), g = cv.getContext("2d"), scEl = el.querySelector("#mrSc"), tmEl = el.querySelector("#mrTm"), seaEl = el.querySelector("#mrSea"), pdEl = el.querySelector("#mrPd"), msgEl = el.querySelector("#mrMsg");
    let raf = 0, last = performance.now(), fr = 0, aim = null, dragging = null, msgT = 0, started = false, closed = false;
    const say = (t, secs) => { msgEl.textContent = t; msgT = secs || 2.6; };
    const fase = () => { try { return window.__naufraghi && window.__naufraghi.clock ? window.__naufraghi.clock.fase() : "giorno"; } catch (e) { return "giorno"; } };
    function pt(e) { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * CVW - OX, ((e.clientY - r.top) / r.height) * CVH - OY]; }
    const mine = () => S.P.filter((p) => p.team === 0 && p.role === "f");
    const ours = () => S.ball.car && S.ball.car.team === 0;
    function tapAt(x, y) {
      if (!started || S.over || S.pause > 0) return;
      // un compagno vicino al tocco?
      let best = null, bd = 28; mine().concat(S.P.filter((p) => p.team === 0 && p.role === "k")).forEach((p) => { const d = hyp(p.x - x, p.y - y); if (d < bd) { bd = d; best = p; } });
      if (best) {
        if (ours() && S.ball.car !== best) { doPass(S, S.ball.car, best); say(`Passaggio a ${best.name}.`, 1.4); return; }
        if (!ours() && best.role === "f" && S.sprintCd <= 0) { best.sprint = 1.4; S.sprintCd = 2.4; say(`${best.name} scatta!`, 1.2); return; }
        if (S.ball.car === best) { say("Hai già la palla: tocca un compagno per passare, o trascina per tirare.", 2.2); return; }
      }
      const i = cellI(x, y); if (x < 0 || y < 0 || x > FW || y > FH) return;
      if (raiseCell(S, i)) say("Pedana alzata: terra asciutta per qualche secondo.", 1.6); else say(S.charges <= 0 ? "Niente pedane: aspetta che tornino." : "Lì c'è già una pedana.", 1.4);
    }
    function shootDir(dx, dy, power) {
      if (!started || S.over || S.pause > 0) return; if (!ours() || S.ball.car.role === "k") { say("Non hai la palla.", 1.2); return; }
      const c = S.ball.car, m = hyp(dx, dy) || 1; doShot(S, c, c.x + (dx / m) * 100, c.y + (dy / m) * 100, power, (Math.random() - 0.5) * 0.05); say("Tiro!", 0.9);
    }
    cv.addEventListener("pointerdown", (e) => { if (!started) return; e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (er) {} const [x, y] = pt(e); dragging = { x, y, x1: x, y1: y }; });
    cv.addEventListener("pointermove", (e) => { if (!dragging) return; const [x, y] = pt(e); dragging.x1 = x; dragging.y1 = y; const c = S.ball.car; if (hyp(x - dragging.x, y - dragging.y) > 12 && c && c.team === 0) { const dx = x - dragging.x, dy = y - dragging.y, m = hyp(dx, dy); aim = { x0: c.x, y0: c.y, x1: c.x + (dx / m) * Math.min(90, m * 1.6), y1: c.y + (dy / m) * Math.min(90, m * 1.6) }; } });
    cv.addEventListener("pointerup", (e) => { if (!dragging) return; const d = dragging; dragging = null; aim = null; const dx = d.x1 - d.x, dy = d.y1 - d.y, m = hyp(dx, dy); if (m > 14) shootDir(dx, dy, clamp(m / 70, 0.35, 1)); else tapAt(d.x, d.y); });
    cv.addEventListener("pointercancel", () => { dragging = null; aim = null; });
    const bestMate = () => { const c = S.ball.car, ms = mine().filter((p) => p !== c); return ms.sort((a, b) => b.x - a.x)[0]; };
    el.querySelector("#mrPass").onclick = () => { if (!started || S.over || !ours()) return; const m = bestMate(); if (m && S.ball.car !== m) { doPass(S, S.ball.car, m); say(`Passaggio a ${m.name}.`, 1.4); } };
    el.querySelector("#mrShoot").onclick = () => { if (!started || S.over || !ours()) return; const c = S.ball.car; shootDir(FW - c.x, FH / 2 - c.y + (Math.random() - 0.5) * 24, 0.85); };
    const kd = (e) => {
      if (!started || S.over) return; const k = e.key, cu = S.cursor; let used = true; if (k.indexOf("Arrow") === 0 || k === " " || k === "Enter") S.kbd = true;
      if (k === "ArrowLeft") cu.c = Math.max(0, cu.c - 1); else if (k === "ArrowRight") cu.c = Math.min(COLS - 1, cu.c + 1); else if (k === "ArrowUp") cu.r = Math.max(0, cu.r - 1); else if (k === "ArrowDown") cu.r = Math.min(ROWS - 1, cu.r + 1);
      else if (k === " " || k === "Enter") tapAt(cu.c * CW + CW / 2, cu.r * CH + CH / 2);
      else if (k === "x" || k === "X") { const c = S.ball.car; if (c) shootDir(cu.c * CW + CW / 2 - c.x, cu.r * CH + CH / 2 - c.y, 0.9); }
      else if (k === "p" || k === "P") el.querySelector("#mrPass").click(); else if (k === "t" || k === "T") el.querySelector("#mrShoot").click();
      else used = false; if (used) e.preventDefault();
    };
    window.addEventListener("keydown", kd);
    // la schermata delle regole e quella finale
    const card = (h, body, btn, fn) => { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${h}</h3>${body}<button type="button" class="goB">${btn}</button></div>`; el.appendChild(ov); ov.querySelector(".goB").onclick = () => { ov.remove(); fn(); }; };
    function close() { closed = true; cancelAnimationFrame(raf); window.removeEventListener("keydown", kd); el.remove(); if (STATE === S) STATE = null; }
    function finish(quit) {
      if (S.res) return; if (!S.over) { S.over = true; S.phase = "over"; }
      const bySea = S.data.mare, a = quit ? 0 : S.a, b = quit ? Math.max(1, S.b) : S.b, win = !quit && a > b;
      S.res = { a, b, win, quit: !!quit, data: Object.assign({}, S.data) };
      const why = quit ? "Hai lasciato il campo." : bySea ? (S.seaWho === 0 ? "Il mare si è preso la metà dei Rondine." : "Il mare si è preso la metà avversaria.") : "Fischio finale.";
      card(quit ? "Partita interrotta" : win ? o.winTitle || "VITTORIA!" : "Sconfitta", `<p class="big">${a} – ${b}</p><p>${esc(why)}<br>Pedane alzate ${S.data.pedane} · palloni affondati ${S.data.affondati} · gol ${S.data.gol}</p>`, "Concludi la partita ▸", () => {
        close(); if (C0 && C0.endMatch) C0.endMatch(); if (typeof o.onDone === "function") o.onDone(S.res);
      });
    }
    S.finish = finish;
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    function hud() {
      scEl.textContent = `${S.a} – ${S.b}`; const left = Math.max(0, Math.ceil(S.D - S.t)); tmEl.textContent = S.golden ? "ALTA MAREA: gol d'oro!" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      const dd = [drowned(S, 0), drowned(S, 1)]; seaEl.textContent = `La tua metà: ${dd[0]}/30 · loro: ${dd[1]}/30`;
      pdEl.innerHTML = [0, 1, 2].map((i) => `<i class="${i < S.charges ? "on" : ""}"></i>`).join("") + `<span style="margin-left:4px;font-size:11px">pedane</span>`;
    }
    function frame(now) {
      if (closed) return; const dt = clamp((now - last) / 1000, 0, 0.05); last = now; fr++;
      if (started && !S.over && !S.res) {
        let n = Math.max(1, Math.round(dt / (1 / 60))), h = dt / n; for (let i = 0; i < n; i++) step(S, h);
        S.ev.forEach((e) => { if (e[0] === "goal") { S.fx = S.fx || []; S.fx.push({ k: "txt", t: e[1] === 0 ? "GOL!" : "GOL LORO", c: e[1] === 0 ? "#fde047" : "#fda4af", y: FH / 2, life: 90 }); for (let k = 0; k < 40; k++) S.fx.push({ k: "conf", x: FW / 2, y: FH / 2, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 2.5, c: ["#fde047", "#34d399", "#38bdf8", "#f9a8d4"][k % 4], life: 70 + (k % 20) }); tone(e[1] === 0 ? [523, 659, 784, 1047] : [330, 262, 196], 0.18); say(e[1] === 0 ? "Gol! Il mare si ritira dalla tua metà." : "Gol loro: il mare avanza sulla tua metà.", 2.6); }
          else if (e[0] === "splash") { S.fx = S.fx || []; S.fx.push({ k: "splash", x: e[1], y: e[2], life: 30 }); tone([240], 0.08); }
          else if (e[0] === "kick") tone([180], 0.04); else if (e[0] === "save") { say("Parata!", 1.2); tone([392, 330], 0.08); } else if (e[0] === "ped") tone([300, 380], 0.06); else if (e[0] === "golden") { say("Pareggio: sale l'Alta Marea. Il prossimo gol vince!", 3.2); tone([196, 262], 0.15); } else if (e[0] === "end") finish(false); });
        if (msgT > 0) { msgT -= dt; if (msgT <= 0) msgEl.textContent = S.golden ? "Alta Marea: gol d'oro. Segna prima che sparisca la tua metà!" : ours() ? "Hai la palla: passa, tira o alza una pedana." : "Senza palla: tocca un compagno per farlo scattare."; }
        hud();
      }
      draw(S, g, fr, S.kbd ? S.cursor : null, aim, fase()); raf = requestAnimationFrame(frame);
    }
    function tone(fs, v) { try { const u = window.__sagaCore && window.__sagaCore.util; if (u && u.tone) fs.forEach((f, i) => u.tone(f, 0.12, "triangle", v || 0.06, i * 0.07)); } catch (e) {} }
    card(esc(o.title || "Marea"), `${o.intro ? `<p>${esc(o.intro)}</p>` : ""}<p>Il campo è fatto di <b>celle</b> e il <b>mare sale</b> mentre si gioca: prima i bordi, poi il centro.</p><ul><li><b>Cella bagnata</b>: si va piano.</li><li><b>Cella sommersa</b>: non si passa, e il pallone affonda (se non va veloce: i tiri forti rimbalzano sull'acqua).</li><li>Ogni <b>gol</b>: il mare si ritira dalla tua metà e si prende un pezzo di quella avversaria.</li><li>Se una metà sparisce, <b>perde chi la perde</b>. Segna prima!</li></ul><p><b>Tocca un compagno</b> per passare (senza palla: scatto) · <b>trascina</b> per tirare · <b>tocca una cella</b> per alzare una pedana asciutta (tre alla volta). Tastiera: frecce, Spazio, X, P, T.</p>`, "Si gioca! ▸", () => { started = true; last = performance.now(); say("Si parte! Il mare è ancora basso.", 2.4); });
    hud(); raf = requestAnimationFrame(frame);
    return true;
  }

  window.__marea = { start, newSim, step, raiseCell, doPass, doShot, kickoff, parOpp, autopilot, constants: { COLS, ROWS, CW, CH, FW, FH, GY0, GY1, DUR }, get state() { return STATE; }, stop() { const e = document.querySelector(".mrOv"); if (e) e.remove(); STATE = null; } };
})();
