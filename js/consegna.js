// js/consegna.js - «CONSEGNA A RETE» · la partita originale di «Razzopacco · Consegne dal Futuro» (motore proprio, NON il kit di partita)
// Si gioca nello spazio, fra due portelloni di consegna. Il pallone è un PACCO e i giocatori sono razzetti da corriere.
// Si GUIDA col dito: il razzo vola verso il punto che tocchi (o trascini), con l'inerzia dello spazio. Col pacco a bordo, LANCIA lo
// spara nella direzione in cui voli: la linea tratteggiata mostra dove andrà, perché i due PIANETI in mezzo al campo lo attirano e
// ne curvano la traiettoria (un tiro può girare attorno a un pianeta ed entrare dall'angolo). PASSA lo manda al compagno.
// In alto e in basso c'è un TUBO PNEUMATICO: chi ci entra (razzo o pacco) esce dall'altra parte, più veloce. Gli ASTEROIDI vanno su e
// giù: se ci sbatti col pacco lo perdi e il pacco si AMMACCA. Una consegna con il pacco intatto è una «consegna perfetta».
// Per rubare il pacco basta toccare il razzo che lo porta. Ogni portellone ha un drone-portiere che va su e giù.
// Uso: window.__consegna.start({ title, us, usColor, hero:{ name }, mate:{ name }, opp:{ name, color, players:[{ name }], keeper:{ name } },
//   secs, minutes, oppStyle, intro, winTitle, onDone })   → r.data = { lanci, consegne, perfette, recuperi, ammaccati, tubi }
(function () {
  "use strict";
  if (window.__consegna) return;
  const W = 320, H = 200, X0 = 10, X1 = 310, Y0 = 12, Y1 = 192, GY0 = 76, GY1 = 124, GM = 100;
  const PLANETS = [{ x: 116, y: 64, r: 13, m: 95, c: ["#ffb07a", "#c8603a"], ring: true }, { x: 204, y: 138, r: 11, m: 80, c: ["#9af0c8", "#3a9a7a"], ring: false }];
  const PORT = [{ x: 160, y: Y0 + 4 }, { x: 160, y: Y1 - 4 }];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  // l'attrazione dei pianeti sul pacco libero (e un po' sui razzi)
  function pull(x, y, k) { let ax = 0, ay = 0; PLANETS.forEach((p) => { const dx = p.x - x, dy = p.y - y, d = Math.max(p.r + 4, Math.hypot(dx, dy)); const a = (p.m / (d * d)) * k; ax += (dx / d) * a; ay += (dy / d) * a; }); return [ax, ay]; }
  let STATE = null;
  function start(o) {
    if (document.querySelector(".rnOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.82 : 1;
    const usCol = o.usColor || "#ff7a3a", opp = Object.assign({ name: "Avversari", color: "#5a6ad8", players: [], keeper: { name: "Il drone" } }, o.opp || {});
    while (opp.players.length < 2) opp.players.push({ name: ["Il primo", "Il secondo"][opp.players.length] });
    const ship = (team, x, y, p, me) => ({ team, x, y, vx: 0, vy: 0, ang: team ? Math.PI : 0, p, me: !!me, cool: 0, tube: 0, hit: 0 });
    const S = { o, a: 0, b: 0, t: 0, el0: 0, secs: o.secs || 100, nMin: o.minutes || 90, phase: "intro", over: false, fast: 1, tgt: null, keys: {}, fx: null, shake: 0,
      ships: [ship(0, 110, 100, Object.assign({ name: "Tu" }, o.hero || o.heroLook), true), ship(0, 70, 60, Object.assign({ name: "Il compagno" }, o.mate)), ship(1, 220, 70, opp.players[0]), ship(1, 250, 130, opp.players[1])],
      keepers: [{ x: X0 + 7, y: GM }, { x: X1 - 7, y: GM }], parcel: { x: 120, y: 100, vx: 0, vy: 0, own: null, noPick: 0, last: 0, dent: 0, spin: 0 },
      rocks: [{ x: 66, y: 50, r: 7, ph: 0 }, { x: 254, y: 150, r: 7, ph: 2 }, { x: 160, y: 100, r: 5, ph: 4 }],
      stars: Array.from({ length: 70 }, (_, i) => ({ x: R() * W, y: R() * H, z: 1 + (i % 3) })),
      data: { lanci: 0, consegne: 0, perfette: 0, recuperi: 0, ammaccati: 0, tubi: 0 } };
    const [HERO, MATE, OP1, OP2] = S.ships;
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "rnOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="clock"></i><span class="tip"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="pad"><button type="button" class="pass">↪ PASSA</button><button type="button" class="thr">📦 LANCIA</button></div><div class="help">Tocca o trascina sul campo: il razzo vola lì. Tasti: frecce, Spazio lancia, P passa.</div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__rnAC = window.__rnAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const tip = (t) => { el.querySelector(".tip").innerHTML = t; };
    const fx = (text, col, stamp) => { S.fx = { text, col: col || "#ffd23f", t: 0, stamp: !!stamp }; };
    const elapsed = () => S.el0 / 60;
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".clock").textContent = `${Math.min(S.nMin, Math.round((elapsed() / S.secs) * S.nMin))}'`; const P = S.parcel; el.querySelector(".thr").disabled = P.own !== HERO; el.querySelector(".pass").disabled = P.own !== HERO; if (S.phase === "play") tip(!P.own ? "Pacco libero: prendilo!" : P.own.team ? `Pacco a <b>${esc(opp.name)}</b>: tocca il razzo che lo porta.` : P.own === HERO ? "Pacco tuo: <b>LANCIA</b> verso il portellone a destra. La linea gialla mostra la curva." : `Il pacco ce l'ha ${esc(P.own.p.name || "il compagno")}: smarcati.`); };
    // ------------------------------------------------------------ calcio d'inizio
    function kickoff(team) {
      const P = S.parcel; [[110, 100], [70, 56], [210, 70], [240, 136]].forEach(([x, y], i) => { const s = S.ships[i]; s.x = x; s.y = y; s.vx = s.vy = 0; s.cool = 20; s.ang = s.team ? Math.PI : 0; });
      if (team) { OP1.x = 196; OP1.y = 100; } S.keepers.forEach((k) => (k.y = GM));
      P.own = team ? OP1 : HERO; P.last = team; P.vx = P.vy = 0; P.dent = 0; P.noPick = 0; S.tgt = null; S.phase = "play";
      tip(team ? `Pacco a <b>${esc(opp.name)}</b>: tocca il razzo che lo porta per rubarlo.` : "Pacco tuo: vola verso il portellone a destra e <b>LANCIA</b>.");
    }
    // ------------------------------------------------------------ lanci
    function launch(s, ang, sp) {
      const P = S.parcel; if (P.own !== s) return false;
      P.own = null; P.x = s.x + Math.cos(ang) * 9; P.y = s.y + Math.sin(ang) * 9; P.vx = Math.cos(ang) * sp + s.vx * 0.3; P.vy = Math.sin(ang) * sp + s.vy * 0.3; P.noPick = 12; P.last = s.team; P.by = s;
      if (s.team === 0) S.data.lanci++; tone(s.team ? 300 : 520, 0.18, "triangle", 0.05, s.team ? 200 : 880); return true;
    }
    const thrAng = (s) => (Math.hypot(s.vx, s.vy) > 0.4 ? Math.atan2(s.vy, s.vx) : s.ang);
    function throwHero() { if (S.phase !== "play") return false; return launch(HERO, thrAng(HERO), 4.4); }
    function passHero() { if (S.phase !== "play" || S.parcel.own !== HERO) return false; const tx = MATE.x + MATE.vx * 12, ty = MATE.y + MATE.vy * 12; return launch(HERO, Math.atan2(ty - HERO.y, tx - HERO.x), 3.6); }
    // ------------------------------------------------------------ fisica
    function steer(s, tx, ty, max, acc) {
      const dx = tx - s.x, dy = ty - s.y, d = Math.hypot(dx, dy);
      if (d > 3) { const k = Math.min(1, d / 30); s.vx += (dx / d) * acc * k; s.vy += (dy / d) * acc * k; }
      const v = Math.hypot(s.vx, s.vy), mx = max * (S.parcel.own === s ? 0.9 : 1); if (v > mx) { s.vx *= mx / v; s.vy *= mx / v; }
    }
    function moveShip(s) {
      const [ax, ay] = pull(s.x, s.y, 0.25); s.vx += ax; s.vy += ay; s.vx *= 0.97; s.vy *= 0.97; s.x += s.vx; s.y += s.vy;
      if (Math.hypot(s.vx, s.vy) > 0.3) s.ang = Math.atan2(s.vy, s.vx);
      if (s.x < X0 + 14) { s.x = X0 + 14; s.vx = Math.abs(s.vx) * 0.5; } if (s.x > X1 - 14) { s.x = X1 - 14; s.vx = -Math.abs(s.vx) * 0.5; }
      if (s.y < Y0 + 6) { s.y = Y0 + 6; s.vy = Math.abs(s.vy) * 0.5; } if (s.y > Y1 - 6) { s.y = Y1 - 6; s.vy = -Math.abs(s.vy) * 0.5; }
      PLANETS.forEach((p) => { const dx = s.x - p.x, dy = s.y - p.y, d = Math.hypot(dx, dy) || 1; if (d < p.r + 6) { s.x = p.x + (dx / d) * (p.r + 6); s.y = p.y + (dy / d) * (p.r + 6); s.vx += (dx / d) * 0.6; s.vy += (dy / d) * 0.6; } });
      // il tubo pneumatico: dentro da una parte, fuori dall'altra, più veloce
      if (s.tube > 0) s.tube--; else PORT.forEach((q, i) => { if (Math.hypot(s.x - q.x, s.y - q.y) < 10) { const o2 = PORT[1 - i]; s.x = o2.x; s.y = o2.y + (i ? 12 : -12); s.vy = (i ? 2.6 : -2.6); s.tube = 40; if (s.team === 0) S.data.tubi++; tone(260, 0.3, "sine", 0.05, 900); } });
      if (s.cool > 0) s.cool--; if (s.hit > 0) s.hit--;
      // gli asteroidi: chi ci sbatte col pacco, lo perde (e il pacco si ammacca)
      S.rocks.forEach((r) => { if (Math.hypot(s.x - r.x, s.y - r.y) < r.r + 6) { const dx = s.x - r.x, dy = s.y - r.y, d = Math.hypot(dx, dy) || 1; s.vx = (dx / d) * 1.8; s.vy = (dy / d) * 1.8; s.hit = 20; const P = S.parcel; if (P.own === s) { P.own = null; P.x = s.x; P.y = s.y; P.vx = -s.vx; P.vy = -s.vy; P.noPick = 14; P.dent++; if (s.team === 0) S.data.ammaccati++; tone(150, 0.3, "square", 0.05); fx("AMMACCATO!", "#ff8a5a"); } } });
    }
    function moveParcel() {
      const P = S.parcel; if (P.noPick > 0) P.noPick--;
      if (P.own) { const s = P.own; P.x = s.x + Math.cos(s.ang) * 8; P.y = s.y + Math.sin(s.ang) * 8; P.vx = s.vx; P.vy = s.vy; return; }
      const [ax, ay] = pull(P.x, P.y, 1); P.vx += ax; P.vy += ay; P.vx *= 0.993; P.vy *= 0.993; const v = Math.hypot(P.vx, P.vy); if (v > 5.5) { P.vx *= 5.5 / v; P.vy *= 5.5 / v; }
      P.x += P.vx; P.y += P.vy; P.spin += v * 0.1;
      PLANETS.forEach((p) => { const dx = P.x - p.x, dy = P.y - p.y, d = Math.hypot(dx, dy) || 1; if (d < p.r + 3) { const nx = dx / d, ny = dy / d, dot = P.vx * nx + P.vy * ny; P.vx -= 1.6 * dot * nx; P.vy -= 1.6 * dot * ny; P.x = p.x + nx * (p.r + 3); P.y = p.y + ny * (p.r + 3); } });
      S.rocks.forEach((r) => { const dx = P.x - r.x, dy = P.y - r.y, d = Math.hypot(dx, dy) || 1; if (d < r.r + 3) { const nx = dx / d, ny = dy / d, dot = P.vx * nx + P.vy * ny; if (dot < 0) { P.vx -= 1.8 * dot * nx; P.vy -= 1.8 * dot * ny; P.dent++; tone(170, 0.15, "square", 0.04); } } });
      PORT.forEach((q, i) => { if (P.port > 0) return; if (Math.hypot(P.x - q.x, P.y - q.y) < 9) { const o2 = PORT[1 - i]; P.x = o2.x; P.y = o2.y + (i ? 10 : -10); P.vy = (i ? 1 : -1) * Math.max(3, Math.abs(P.vy) * 1.2); P.port = 30; tone(300, 0.3, "sine", 0.05, 1000); } }); if (P.port > 0) P.port--;
      if (P.y < Y0 + 3) { P.y = Y0 + 3; P.vy = Math.abs(P.vy) * 0.8; } if (P.y > Y1 - 3) { P.y = Y1 - 3; P.vy = -Math.abs(P.vy) * 0.8; }
      // i droni-portieri
      S.keepers.forEach((k, i) => { if (Math.abs(P.x - k.x) < 5 && Math.abs(P.y - k.y) < 11 && (i ? P.vx > 0 : P.vx < 0)) { P.vx = -P.vx * 0.55; P.vy += (P.y - k.y) * 0.12; P.x = k.x + (i ? -6 : 6); P.noPick = 4; fx("PARATA!", i ? "#ff8a7a" : "#7ad8ff"); tone(i ? 220 : 600, 0.2, "triangle", 0.05); } });
      // consegna!
      if (P.x <= X0) { if (P.y > GY0 && P.y < GY1) return goal(1); P.x = X0 + 1; P.vx = Math.abs(P.vx) * 0.7; }
      if (P.x >= X1) { if (P.y > GY0 && P.y < GY1) return goal(0); P.x = X1 - 1; P.vx = -Math.abs(P.vx) * 0.7; }
      // si raccoglie toccandolo
      if (P.noPick <= 0) { let best = null, bd = 10; S.ships.forEach((s) => { const d = dist(s, P); if (d < bd && s.hit <= 0) { bd = d; best = s; } }); if (best) { const was = P.last; P.own = best; if (best.team !== was) P.dent = 0; if (best.team === 0 && was === 1) S.data.recuperi++; P.last = best.team; tone(best.team ? 340 : 700, 0.08, "triangle", 0.04); } }
    }
    function goal(team) {
      const P = S.parcel, perfect = P.dent === 0; S.phase = "goal"; S.shake = 18;
      if (team === 0) { S.a++; S.data.consegne++; if (perfect) S.data.perfette++; fx(perfect ? "CONSEGNA PERFETTA!" : "CONSEGNATO!", "#ff4a3a", true); tone(660, 0.6, "triangle", 0.06, 1320); }
      else { S.b++; fx("CONSEGNA A LORO…", "#5a6ad8", true); tone(160, 0.6, "sawtooth", 0.05); }
      hud(); setTimeout(() => { if (!S.over && S.el0 / 60 < S.secs) kickoff(team === 0 ? 1 : 0); }, 1100 / S.fast);
    }
    // ------------------------------------------------------------ chi ruba il pacco a chi
    function contacts() {
      const P = S.parcel, c = P.own; if (!c) return;
      S.ships.forEach((s) => { if (s.team === c.team || s.cool > 0 || c.cool > 0 || dist(s, c) > 12) return; s.cool = 26; c.cool = 18;
        const p = s.team === 0 ? 0.55 / oppK : 0.34 * oppK * (DF.steal || 1); if (R() < p) { P.own = s; P.last = s.team; P.dent = 0; c.hit = 16; if (s.team === 0) S.data.recuperi++; tone(s.team ? 220 : 760, 0.15, "triangle", 0.05); fx(s.team ? "RUBATO!" : "RECUPERO!", s.team ? "#ff8a7a" : "#7ad87a"); }
        else { tone(400, 0.06, "square", 0.03); } });
    }
    // ------------------------------------------------------------ cervelli
    const oppMax = 1.85 * (oppK > 1 ? 1.08 : oppK < 1 ? 0.92 : 1), oppAcc = 0.11;
    function ai() {
      const P = S.parcel, c = P.own, ours = c && c.team === 0, theirs = c && c.team === 1;
      // il compagno
      if (MATE !== c) { if (ours) steer(MATE, Math.min(X1 - 40, HERO.x + 70), HERO.y < GM ? 140 : 60, 1.8, 0.1); else if (theirs) steer(MATE, c.x - 8, c.y, 1.9, 0.11); else steer(MATE, P.x, P.y, 1.8, 0.1); }
      else { const near = [OP1, OP2].some((s) => dist(s, MATE) < 16); if ((MATE.x > 214 && Math.abs(MATE.y - GM) < 60) || (near && R() < 0.05)) { const ky = S.keepers[1].y, ty = ky > GM ? GY0 + 8 : GY1 - 8; launch(MATE, Math.atan2(ty - MATE.y, X1 - MATE.x), 4.2); } else if (near && HERO.x > MATE.x && R() < 0.04) launch(MATE, Math.atan2(HERO.y - MATE.y, HERO.x - MATE.x), 3.6); else steer(MATE, X1 - 30, GM + (MATE.y < GM ? -20 : 20), 1.7, 0.1); }
      // gli avversari
      [OP1, OP2].forEach((s, i) => {
        if (s === c) {
          const near = [HERO, MATE].some((q) => dist(q, s) < 16);
          if ((s.x < 104 + (style === "contropiede" ? 16 : 0) && Math.abs(s.y - GM) < 64) || (near && R() < 0.035)) { const ky = S.keepers[0].y, ty = ky > GM ? GY0 + 8 + R() * 8 : GY1 - 8 - R() * 8; launch(s, Math.atan2(ty - s.y, X0 - s.x) + (R() - 0.5) * 0.25, 4 * (DF.shot || 1)); }
          else if (near && R() < 0.03) { const m = i ? OP1 : OP2; launch(s, Math.atan2(m.y - s.y, m.x - s.x), 3.4); }
          else steer(s, X0 + 40, GM + (s.y < GM ? -24 : 24), oppMax, oppAcc);
          return;
        }
        if (theirs) { steer(s, Math.max(X0 + 50, c.x - 60), c.y < GM ? 150 : 50, oppMax * 0.9, oppAcc); return; }
        const chaser = style === "pressing" || i === 0 || !c;
        if (ours && chaser) steer(s, c.x + c.vx * 6, c.y + c.vy * 6, oppMax, oppAcc);
        else if (ours) steer(s, style === "difensiva" ? 262 : (c.x + X1) / 2, style === "difensiva" ? GM : (c.y + GM) / 2, oppMax * 0.85, oppAcc);
        else steer(s, P.x, P.y, oppMax, oppAcc);
      });
      // i droni-portieri: il loro reagisce secondo la difficoltà
      const pr = S.parcel; S.keepers.forEach((k, i) => { const coming = i ? pr.x > 200 : pr.x < 120, ty = coming ? clamp(pr.y + pr.vy * 4, GY0 + 6, GY1 - 6) : GM, sp = i ? 1.05 * oppK * (DF.gk1 || 1) : 1.45 * (DF.gk0 || 1); k.y += clamp(ty - k.y, -sp, sp); });
    }
    // ------------------------------------------------------------ comandi del Campione
    function control() {
      const k = S.keys, dx = (k.right ? 1 : 0) - (k.left ? 1 : 0), dy = (k.down ? 1 : 0) - (k.up ? 1 : 0);
      if (dx || dy) S.tgt = { x: HERO.x + dx * 40, y: HERO.y + dy * 40 };
      if (S.tgt) { steer(HERO, S.tgt.x, S.tgt.y, 2.25, 0.16); if (Math.hypot(S.tgt.x - HERO.x, S.tgt.y - HERO.y) < 5 && !dx && !dy) S.tgt = null; }
    }
    function step() {
      if (S.phase !== "play") return;
      S.el0++; S.t++; S.rocks.forEach((r, i) => { r.ph += 0.012; r.y = 100 + Math.sin(r.ph) * (i === 2 ? 30 : 62); });
      control(); ai(); S.ships.forEach(moveShip); contacts(); moveParcel();
      if (S.el0 % 20 === 0) hud();
      if (S.el0 / 60 >= S.secs && S.phase === "play") finish();
    }
    // ------------------------------------------------------------ disegno: spazio retrofuturo, pianeti, tubi d'ottone, razzetti
    function predict() { const s = HERO, a = thrAng(s), p = { x: s.x + Math.cos(a) * 9, y: s.y + Math.sin(a) * 9, vx: Math.cos(a) * 4.4 + s.vx * 0.3, vy: Math.sin(a) * 4.4 + s.vy * 0.3 }, out = []; for (let i = 0; i < 70; i++) { const [ax, ay] = pull(p.x, p.y, 1); p.vx = (p.vx + ax) * 0.993; p.vy = (p.vy + ay) * 0.993; p.x += p.vx; p.y += p.vy; if (p.y < Y0 || p.y > Y1) p.vy = -p.vy; if (i % 4 === 0) out.push([p.x, p.y]); if (p.x < X0 || p.x > X1 || PLANETS.some((q) => Math.hypot(p.x - q.x, p.y - q.y) < q.r)) break; } return out; }
    function rocket(s, col) {
      const fl = Math.hypot(s.vx, s.vy); g.save(); g.translate(s.x, s.y); g.rotate(s.ang);
      if (fl > 0.4) { g.fillStyle = S.t % 4 < 2 ? "#ffd23f" : "#ff8a3a"; g.beginPath(); g.moveTo(-7, -2.5); g.lineTo(-7 - fl * 3 - R() * 2, 0); g.lineTo(-7, 2.5); g.fill(); }
      g.fillStyle = col; g.strokeStyle = "#111"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(9, 0); g.quadraticCurveTo(2, -6, -7, -4.5); g.lineTo(-7, 4.5); g.quadraticCurveTo(2, 6, 9, 0); g.fill(); g.stroke();
      g.fillStyle = "#e8f6ff"; g.beginPath(); g.arc(2, 0, 2.4, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "#c8a040"; g.fillRect(-8, -6, 3, 3); g.fillRect(-8, 3, 3, 3);
      g.restore();
      if (s.hit > 0 && S.t % 4 < 2) { g.strokeStyle = "#fff"; g.beginPath(); g.arc(s.x, s.y, 10, 0, 7); g.stroke(); }
      g.font = "700 6px system-ui"; g.textAlign = "center"; g.fillStyle = s.me ? "#ffd23f" : "rgba(255,255,255,.7)"; g.fillText(String(s.p.name || "").split(" ")[0].slice(0, 9), s.x, s.y + 15);
    }
    function draw() {
      g.setTransform(2, 0, 0, 2, 0, 0); if (S.shake > 0) { S.shake--; g.translate((R() - 0.5) * S.shake * 0.3, (R() - 0.5) * S.shake * 0.3); }
      const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#0a0a2a"); bg.addColorStop(0.55, "#1a1446"); bg.addColorStop(1, "#2a1036"); g.fillStyle = bg; g.fillRect(-6, -6, W + 12, H + 12);
      const neb = g.createRadialGradient(240, 50, 4, 240, 50, 120); neb.addColorStop(0, "rgba(255,120,180,.18)"); neb.addColorStop(1, "rgba(255,120,180,0)"); g.fillStyle = neb; g.fillRect(0, 0, W, H);
      S.stars.forEach((s) => { s.x -= 0.05 * s.z; if (s.x < 0) s.x = W; g.fillStyle = s.z === 3 ? "#fff" : s.z === 2 ? "#c8d8ff" : "#7a7aa8"; g.fillRect(s.x, s.y, s.z === 3 ? 1.5 : 1, s.z === 3 ? 1.5 : 1); });
      // le linee del campo, al neon
      g.strokeStyle = "rgba(120,220,255,.25)"; g.lineWidth = 1; g.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); g.beginPath(); g.moveTo(160, Y0); g.lineTo(160, Y1); g.stroke(); g.beginPath(); g.arc(160, 100, 26, 0, 7); g.stroke();
      // i tubi pneumatici in alto e in basso
      PORT.forEach((q, i) => { g.fillStyle = "rgba(170,230,255,.25)"; g.fillRect(q.x - 7, i ? q.y : 0, 14, i ? H - q.y : q.y); g.strokeStyle = "#c8a040"; g.lineWidth = 2.5; g.beginPath(); g.ellipse(q.x, q.y, 9, 4, 0, 0, 7); g.stroke(); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1; g.beginPath(); g.arc(q.x, q.y, 3 + ((S.t / 3) % 6), 0, 7); g.stroke(); });
      // i portelloni: bocche di tubo d'ottone con la luce
      [[X0, usCol, 0], [X1, opp.color, 1]].forEach(([x, c, i]) => { g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(i ? x : x - 10, GY0, 10, GY1 - GY0); g.fillStyle = c; g.globalAlpha = 0.35 + 0.15 * Math.sin(S.t / 10); g.fillRect(i ? x - 3 : x, GY0, 3, GY1 - GY0); g.globalAlpha = 1; g.strokeStyle = "#c8a040"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, GY0 - 6); g.lineTo(x, GY0); g.moveTo(x, GY1); g.lineTo(x, GY1 + 6); g.stroke(); g.fillStyle = "#c8a040"; g.fillRect(x - 4, GY0 - 3, 8, 3); g.fillRect(x - 4, GY1, 8, 3); });
      // i pianeti (con l'alone di gravità)
      PLANETS.forEach((p) => { g.strokeStyle = "rgba(255,255,255,.07)"; for (let k = 1; k <= 3; k++) { g.beginPath(); g.arc(p.x, p.y, p.r + k * 9 + ((S.t / 4) % 9), 0, 7); g.stroke(); }
        const gr = g.createRadialGradient(p.x - p.r * 0.4, p.y - p.r * 0.4, 1, p.x, p.y, p.r); gr.addColorStop(0, p.c[0]); gr.addColorStop(1, p.c[1]); g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill();
        if (p.ring) { g.strokeStyle = "rgba(255,230,180,.7)"; g.lineWidth = 1.5; g.beginPath(); g.ellipse(p.x, p.y, p.r * 1.8, p.r * 0.45, -0.3, 0, 7); g.stroke(); } });
      // gli asteroidi
      S.rocks.forEach((r) => { g.fillStyle = "#7a6a5a"; g.strokeStyle = "#3a2a2a"; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.28 + r.ph, rr = r.r * (0.8 + ((k * 7) % 3) * 0.12); g.lineTo(r.x + Math.cos(a) * rr, r.y + Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#5a4a3a"; g.fillRect(r.x - 2, r.y - 1, 2, 2); });
      // la traiettoria prevista del lancio
      if (S.parcel.own === HERO && S.phase === "play") { g.fillStyle = "rgba(255,210,63,.75)"; predict().forEach(([x, y], i) => { g.globalAlpha = 1 - i / 20; g.fillRect(x - 1, y - 1, 2, 2); }); g.globalAlpha = 1; }
      if (S.tgt) { g.strokeStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.arc(S.tgt.x, S.tgt.y, 4, 0, 7); g.stroke(); }
      // i droni-portieri
      S.keepers.forEach((k, i) => { g.fillStyle = i ? opp.color : usCol; g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.ellipse(k.x, k.y, 4, 10, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#e8f6ff"; g.fillRect(k.x - 1, k.y - 3, 2, 2); });
      S.ships.forEach((s) => rocket(s, s.team ? opp.color : usCol));
      // il pacco: scatola col nastro adesivo
      const P = S.parcel; g.save(); g.translate(P.x, P.y); if (!P.own) g.rotate(P.spin); g.fillStyle = P.dent ? "#a87a4a" : "#c89a5a"; g.strokeStyle = "#5a3a1a"; g.lineWidth = 1; g.fillRect(-4, -4, 8, 8); g.strokeRect(-4, -4, 8, 8); g.fillStyle = "#e8d8a0"; g.fillRect(-0.8, -4, 1.6, 8); if (P.dent) { g.strokeStyle = "#3a2a1a"; g.beginPath(); g.moveTo(-3, 1); g.lineTo(-1, 3); g.stroke(); } g.restore();
      // gli effetti: il timbro «CONSEGNATO»
      if (S.fx) { const F = S.fx; F.t++; const a = Math.max(0, 1 - F.t / 60);
        if (F.stamp) { const s = 1 + Math.max(0, 8 - F.t) * 0.12; g.save(); g.translate(160, 92); g.rotate(-0.16); g.scale(s, s); g.globalAlpha = Math.min(1, a * 1.6); g.strokeStyle = F.col; g.lineWidth = 3; g.font = "900 18px 'Courier New', monospace"; g.textAlign = "center"; const w = g.measureText(F.text).width + 16; g.strokeRect(-w / 2, -16, w, 26); g.fillStyle = F.col; g.fillText(F.text, 0, 3); g.restore(); g.globalAlpha = 1; }
        else { g.font = "900 13px Impact, 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = `rgba(10,10,30,${a})`; g.strokeText(F.text, 160, 30); g.globalAlpha = a; g.fillStyle = F.col; g.fillText(F.text, 160, 30); g.globalAlpha = 1; }
        if (F.t > 60) S.fx = null; }
    }
    function loop() { if (!el.isConnected) return; for (let i = 0; i < S.fast; i++) step(); draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ comandi: tocco, trascinamento, tastiera
    const toCanvas = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
    let down = false;
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); down = true; S.tgt = toCanvas(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener("pointermove", (e) => { if (down) S.tgt = toCanvas(e); });
    cv.addEventListener("pointerup", () => { down = false; }); cv.addEventListener("pointercancel", () => { down = false; });
    el.querySelector(".thr").addEventListener("pointerdown", (e) => { e.preventDefault(); throwHero(); });
    el.querySelector(".pass").addEventListener("pointerdown", (e) => { e.preventDefault(); passHero(); });
    const KM = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", a: "left", d: "right", w: "up", s: "down" };
    const kd = (e) => { if (!el.isConnected) return; if (KM[e.key]) { S.keys[KM[e.key]] = true; e.preventDefault(); } else if (e.key === " ") { throwHero(); e.preventDefault(); } else if (e.key === "p" || e.key === "P") passHero(); };
    const ku = (e) => { if (KM[e.key]) S.keys[KM[e.key]] = false; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    // ------------------------------------------------------------ inizio e fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "CONSEGNA RIUSCITA!" : S.a === S.b ? "Pareggio" : "Pacco reso al mittente", `<p class="big">${S.a} – ${S.b}</p><p>Consegne ${S.data.consegne} (perfette ${S.data.perfette}) · lanci ${S.data.lanci} · recuperi ${S.data.recuperi} · viaggi nel tubo ${S.data.tubi}</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.steer = (x, y) => { S.tgt = { x, y }; return true; }; S.throw = throwHero; S.pass = passHero; S.kickoff = kickoff;
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Consegna a Rete", `${o.intro || ""}<p>Tocca o trascina sul campo: il tuo razzo <b>vola</b> lì. Col pacco a bordo, <b>LANCIA</b> lo spara dove stai volando: la linea gialla mostra la curva, perché i <b>pianeti</b> lo attirano.</p><p>Il <b>tubo</b> in alto e in basso ti porta dall'altra parte. Gli <b>asteroidi</b> ti fanno perdere il pacco. Per rubarlo, tocca il razzo che lo porta.</p>`, "Si parte! ▸", () => { kickoff(0); hud(); });
    hud(); draw(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("rnCss")) return; const st = document.createElement("style"); st.id = "rnCss";
    st.textContent = `.rnOv{position:fixed;inset:0;z-index:300;background:#0a0a1e;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#fff;overflow:auto}
.rnOv .hud{width:min(100%,460px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #c8a040;border-radius:12px;background:linear-gradient(#2a1a4a,#1a1030);padding:4px 12px;font:800 12px system-ui;box-shadow:0 0 12px rgba(255,138,58,.35)}
.rnOv .hud .n0{color:var(--us)}.rnOv .hud .n1{text-align:right;color:#c8d0ff}.rnOv .hud .sc{font:900 22px 'Courier New',monospace;color:#ffd23f}
.rnOv .bar{width:min(100%,460px);display:flex;gap:8px;align-items:center;font:600 12px system-ui}.rnOv .bar i{font-style:normal;color:#ffd23f;font-family:'Courier New',monospace;font-weight:900}.rnOv .tip{flex:1;opacity:.9}.rnOv .tip b{color:#ffd23f}
.rnOv canvas{width:min(100%,460px);height:auto;aspect-ratio:320/200;flex:none;border:2px solid #c8a040;border-radius:14px;touch-action:none}
.rnOv .pad{width:min(100%,460px);display:grid;grid-template-columns:1fr 1.4fr;gap:8px}
.rnOv .pad button{min-height:54px;border-radius:14px;border:2px solid #c8a040;background:#2a1a4a;color:#fff;font:900 15px system-ui;cursor:pointer}.rnOv .pad .thr{background:linear-gradient(#ff8a3a,#d8501a)}.rnOv button:disabled{opacity:.4}
.rnOv .help{width:min(100%,460px);font-size:11px;opacity:.65}
.rnOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid #c8a040;background:#1a1030;color:#fff}
.rnOv .ov{position:absolute;inset:0;background:rgba(10,10,30,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.rnOv .card{max-width:440px;width:100%;border:3px solid #c8a040;border-radius:16px;background:linear-gradient(#2a1a4a,#140c28);color:#fff;padding:14px;box-shadow:0 0 30px rgba(255,138,58,.3)}.rnOv .card h3{margin:0 0 8px;font:900 22px 'Courier New',monospace;color:#ff8a3a}.rnOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.rnOv .card b{color:#ffd23f}.rnOv .card .big{font:900 34px 'Courier New',monospace;color:#ffd23f}
.rnOv .card .goB{width:100%;margin-top:10px;background:linear-gradient(#ff8a3a,#d8501a);color:#fff;font:900 15px system-ui;min-height:50px;border:2px solid #c8a040;border-radius:12px}`;
    document.head.appendChild(st);
  }
  window.__consegna = { start, PLANETS, get state() { return STATE; } };
})();
