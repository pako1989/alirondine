// js/bottoni.js - «SUPER-BOTTONI» · la partita originale di «Il Mantello Granata» (motore proprio, NON il kit di partita)
// Calcio a bottoni visto dall'alto, A TURNI, con la fisica: ogni giocatore è un disco. Tocca un tuo disco, tira indietro
// come una fionda (più tiri, più forte) e lascia: il disco parte, urta, rimbalza sulle sponde, spinge il pallone.
// Poi tocca all'avversario. Vince chi segna di più nei tiri a disposizione (in parità: golden gol, poi pari).
//  - SUPERPOTERE: ogni partita l'eroe ne ha uno diverso (o.power). La barra POTERE si riempie toccando il pallone,
//    con le carambole e segnando; piena, il bottone POTERE carica il prossimo tiro:
//      fulmine  · il disco parte fortissimo e passa ATTRAVERSO gli avversari (tocca solo il pallone)
//      gigante  · il disco diventa enorme per tutto il tiro (spinge tutto, para tutto)
//      calamita · il pallone, finché corre, è attirato dalla porta avversaria
//      gelo     · gli avversari restano congelati: salti il loro prossimo turno
//      doppio   · dopo questo tiro ne hai subito un altro
//  - CONTRO-POTERE del cattivo (o.oppPower), quando la SUA barra è piena: colla (il tuo prossimo tiro va a metà forza),
//    specchio (il tuo prossimo tiro esce a specchio, destra e sinistra invertite), vento (durante il tuo tiro soffia di lato).
// Grafica da fumetto americano: retino a punti (Ben-Day), contorni neri, scoppi «POW!» sugli urti forti, didascalie gialle
// del narratore, e la tavola a tutto schermo per i gol e i poteri. Difficoltà e carattere degli avversari dal motore delle saghe.
// Uso: window.__bottoni.start({ title, us, opp:{ name, color, players }, mates:[{name, skin, hair}], heroLook, power, oppPower, shots, intro, onDone })
(function () {
  "use strict";
  if (window.__bottoni) return;
  const W = 240, H = 360, RD = 13, RB = 7, MOUTH = 38, LINE = 16, WALL = 6, MAXP = 11;
  const POW = {
    fulmine: { name: "FULMINE GRANATA", sub: "Il prossimo tiro passa attraverso gli avversari", sfx: "ZZAAKK" },
    gigante: { name: "BOTTONE GIGANTE", sub: "Il prossimo disco diventa enorme", sfx: "BOOOM" },
    calamita: { name: "CALAMITA", sub: "Il pallone è attirato dalla porta avversaria", sfx: "VUUMM" },
    gelo: { name: "GELO", sub: "Gli avversari saltano il prossimo turno", sfx: "KRIIK" },
    doppio: { name: "DOPPIO TOCCO", sub: "Dopo questo tiro, subito un altro", sfx: "TWIP-TWIP" },
  };
  const OPOW = {
    colla: { name: "COLLA", sub: "Il tuo prossimo tiro va a metà forza", sfx: "SPLOTCH" },
    specchio: { name: "SPECCHIO", sub: "Il tuo prossimo tiro esce a specchio", sfx: "PLING" },
    vento: { name: "VENTO", sub: "Durante il tuo tiro soffia di lato", sfx: "FSSSHH" },
  };
  const BURST = ["POW!", "SBAM!", "BONK!", "TUNK!", "WHAM!", "KLONK!"];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let STATE = null;
  function start(o) {
    if (document.querySelector(".btOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppCol = (o.opp && o.opp.color) || "#2a4a8a", hexd = (a, b) => { try { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); } catch (e) { return 999; } };
    let usCol = o.usColor || (o.heroLook && o.heroLook.shirt) || "#8a1a2a"; if (hexd(usCol, oppCol) < 110) usCol = hexd("#d82a3a", oppCol) < 110 ? "#f4ecdc" : "#d82a3a"; // le due squadre devono distinguersi
    const hero = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14" }, o.heroLook || {});
    const mates = (o.mates || []).slice(0, 3);
    const oppP = ((o.opp && o.opp.players) || [{ name: "Avversario" }]).slice(0, 4);
    // o.powers = [..]: i poteri girano (uno dopo l'altro, a ogni uso) e la barra riparte da metà
    const powers = Array.isArray(o.powers) ? o.powers.filter((k) => POW[k]) : null, opow = OPOW[o.oppPower] ? o.oppPower : "";
    let power = powers && powers.length ? powers[0] : POW[o.power] ? o.power : "", pIdx = 0;
    const S = { o, a: 0, b: 0, turn: 0, shots: o.shots || 8, extra: 0, who: 0, phase: "intro", t: 0, fx: [], panel: null, cap: null, meter: 0, ometer: 0, armed: "", curse: "", frozen: false, bonus: false, aim: null, data: { tiri: 0, tocchi: 0, poteri: 0, pow: 0 }, over: false };
    STATE = S;
    // ------------------------------------------------------------ interfaccia
    css();
    const el = document.createElement("div"); el.className = "btOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="cap"></div><canvas width="${W * 2}" height="${H * 2}"></canvas>
<div class="bars"><div class="bar me"><i></i><b>POTERE</b></div><div class="bar op"><i></i><b>CATTIVO</b></div></div>
<div class="pad"><button type="button" data-k="pow" class="pow" disabled>POTERE</button><button type="button" data-k="quit" class="quit">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = (o.opp && o.opp.name) || "Avversari";
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", oppCol);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__btAC = window.__btAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "square"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const shotsLeft = (w) => S.shots + S.extra - Math.floor((S.turn + (w ? 0 : 1)) / 2);
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`;
      el.querySelector(".me i").style.width = `${S.meter}%`; el.querySelector(".op i").style.width = `${opow ? S.ometer : 0}%`; el.querySelector(".op").style.visibility = opow ? "visible" : "hidden";
      const b = el.querySelector(".pow"), ok = !!power && S.meter >= 100 && S.who === 0 && S.phase === "aim" && !S.armed; b.disabled = !ok; b.classList.toggle("on", ok); b.textContent = S.armed ? `${POW[S.armed].name} PRONTO` : power ? `POTERE · ${POW[power].name}` : "NESSUN POTERE";
      el.querySelector(".cap").innerHTML = S.cap ? esc(S.cap) : S.phase === "aim" ? `TOCCA A TE · tira indietro un tuo bottone come una fionda${S.curse ? ` · ${OPOW[S.curse].name}!` : ""}` : S.phase === "opp" || S.phase === "oppwait" ? "TOCCA A LORO…" : "…";
    };
    const say = (txt) => { S.cap = txt; S.capT = 110; };
    const burst = (txt, x, y, big, col) => S.fx.push({ txt, x, y, t: big ? 70 : 40, big, col, rot: (Math.random() - 0.5) * 0.5 });
    const BN = o.bonus || {}, addMeter = (n) => { if (power && !S.armed) S.meter = Math.min(100, S.meter + n * (1 + 0.15 * (BN.te | 0))); };
    // ------------------------------------------------------------ dischi e campo
    const disc = (team, p, x, y, gk) => ({ team, p, x, y, vx: 0, vy: 0, r: RD, m: 1, gk: !!gk, x0: x, y0: y });
    const D = [];
    D.push(disc(0, Object.assign({ hero: true }, hero), W / 2, H - 120));
    const mx = [[W / 2 - 60, H - 90], [W / 2 + 60, H - 90], [W / 2, H - 40]];
    mates.forEach((m, i) => D.push(disc(0, m, mx[i][0], mx[i][1], i === 2)));
    const ox = [[W / 2, 120], [W / 2 - 60, 90], [W / 2 + 60, 90], [W / 2, 40]];
    oppP.forEach((p, i) => D.push(disc(1, p, ox[i][0], ox[i][1], i === 3)));
    const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, r: RB, m: 0.55, ball: true };
    function kickoff(conceded) { D.forEach((d) => { d.x = d.x0; d.y = d.y0; d.vx = d.vy = 0; d.big = 0; d.ghost = 0; }); ball.x = W / 2; ball.y = conceded === 1 ? H / 2 - 22 : conceded === 0 ? H / 2 + 22 : H / 2; ball.vx = ball.vy = 0; ball.magnet = 0; }
    const all = () => D.concat([ball]);
    const moving = () => all().some((b) => Math.abs(b.vx) + Math.abs(b.vy) > 0.06);
    function walls(b) {
      const inMouth = b.ball && Math.abs(b.x - W / 2) < MOUTH - b.r * 0.4;
      if (b.x - b.r < WALL) { b.x = WALL + b.r; b.vx = Math.abs(b.vx) * 0.8; }
      if (b.x + b.r > W - WALL) { b.x = W - WALL - b.r; b.vx = -Math.abs(b.vx) * 0.8; }
      if (!inMouth) {
        if (b.y - b.r < LINE) { b.y = LINE + b.r; b.vy = Math.abs(b.vy) * 0.8; }
        if (b.y + b.r > H - LINE) { b.y = H - LINE - b.r; b.vy = -Math.abs(b.vy) * 0.8; }
      } else {
        if (b.y - b.r < 2) { b.y = 2 + b.r; b.vy = Math.abs(b.vy) * 0.3; }
        if (b.y + b.r > H - 2) { b.y = H - 2 - b.r; b.vy = -Math.abs(b.vy) * 0.3; }
        if (b.y < LINE || b.y > H - LINE) { const l = W / 2 - MOUTH + b.r, r = W / 2 + MOUTH - b.r; if (b.x < l) { b.x = l; b.vx = Math.abs(b.vx) * 0.5; } if (b.x > r) { b.x = r; b.vx = -Math.abs(b.vx) * 0.5; } }
      }
    }
    function collide(a, b) {
      if ((a.ghost && !b.ball) || (b.ghost && !a.ball)) return; // il fulmine attraversa gli avversari
      const ra = a.r * (a.big ? 1.8 : 1), rb = b.r * (b.big ? 1.8 : 1), dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01, ov = ra + rb - d;
      if (ov <= 0) return;
      const nx = dx / d, ny = dy / d, ma = a.big ? a.m * 4 : a.m, mb = b.big ? b.m * 4 : b.m;
      a.x -= nx * ov * (mb / (ma + mb)); a.y -= ny * ov * (mb / (ma + mb)); b.x += nx * ov * (ma / (ma + mb)); b.y += ny * ov * (ma / (ma + mb));
      const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv > 0) return;
      const j = (-(1 + 0.86) * rv) / (1 / ma + 1 / mb);
      a.vx -= (j / ma) * nx; a.vy -= (j / ma) * ny; b.vx += (j / mb) * nx; b.vy += (j / mb) * ny;
      const hit = -rv;
      if (a.ball || b.ball) { const dd = a.ball ? b : a; S.lastTouch = dd.team; if (dd.team === 0 && S.who === 0) { S.data.tocchi++; addMeter(18); } else if (dd.team === 1 && opow) S.ometer = Math.min(100, S.ometer + 12); }
      if (hit > 4.2) { S.data.pow++; burst(pick(BURST), (a.x + b.x) / 2, (a.y + b.y) / 2 - 10, hit > 7); tone(140 + Math.random() * 60, 0.09, "square", 0.05); S.shake = Math.min(8, hit); if (S.who === 0) addMeter(6); }
      else tone(420 + Math.random() * 200, 0.03, "triangle", 0.03);
    }
    function physics() {
      for (let k = 0; k < 2; k++) {
        all().forEach((b) => {
          if (S.frozen && b.team === 1) { b.vx = b.vy = 0; return; }
          if (b.ball && b.magnet) { const gx = W / 2 - b.x, gy = 0 - b.y, gd = Math.hypot(gx, gy) || 1; b.vx += (gx / gd) * 0.06; b.vy += (gy / gd) * 0.06; }
          if (S.wind && S.who === 0) b.vx += S.wind * 0.012;
          b.x += b.vx / 2; b.y += b.vy / 2; const fr = b.ball ? 0.988 : 0.983; b.vx *= fr; b.vy *= fr;
          if (Math.abs(b.vx) + Math.abs(b.vy) < 0.06) { b.vx = b.vy = 0; }
          walls(b);
        });
        const L = all(); for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) collide(L[i], L[j]);
      }
      // gol: il pallone è tutto dentro la porta
      if (ball.y < LINE - 4) return goal(0);
      if (ball.y > H - LINE + 4) return goal(1);
    }
    // ------------------------------------------------------------ turni
    function goal(side) {
      if (side === 0) { S.a++; addMeter(30); } else { S.b++; if (opow) S.ometer = Math.min(100, S.ometer + 25); }
      S.phase = "goal"; [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(side ? f / 2 : f, 0.16, side ? "sawtooth" : "triangle", 0.06), i * 90));
      S.panel = { t: 110, txt: side ? "GOL LORO!" : "GOOOOL!!", sub: side ? pick(["Il cattivo ride. Per ora.", "Un colpo basso. Ma l'eroe si rialza.", "Intanto, nella nostra porta…"]) : pick(["L'eroe colpisce ancora!", "La città esulta!", "Nessun bottone è troppo lontano!"]), col: side ? oppCol : usCol, sfx: side ? "SIGH…" : "KABOOM!" };
      S.panel.next = () => { kickoff(side); afterTurn(true); };
      hud();
    }
    function endShot() {
      D.forEach((d) => { d.big = 0; d.ghost = 0; }); ball.magnet = 0; S.wind = 0;
      afterTurn(false);
    }
    function afterTurn(fromGoal) {
      if (S.over) return;
      const was = S.who;
      if (was === 0 && S.bonus && !fromGoal) { S.bonus = false; S.phase = "aim"; say("DOPPIO TOCCO: tira ancora!"); hud(); return; }
      S.bonus = false; S.turn++;
      if (S.frozen && was === 0) { S.frozen = false; S.turn++; say("Gli avversari sono ancora congelati: tocca di nuovo a te!"); }
      else if (was === 1) S.frozen = false;
      if (S.turn >= (S.shots + S.extra) * 2) {
        if (S.a !== S.b || S.extra >= 2 || o.extra === false) return finish();
        S.extra++; say("PARITÀ! Golden gol: chi segna vince.");
      }
      if (S.extra && S.a !== S.b) return finish();
      S.who = S.turn % 2; S.phase = S.who === 0 ? "aim" : "oppwait"; S.t = 0; hud();
    }
    function flick(i, ang, p) {
      const d = D[i]; if (!d || S.over) return false;
      p = Math.max(0, Math.min(1, p));
      if (S.who === 0) {
        if (S.phase !== "aim" || d.team !== 0) return false;
        if (S.curse === "colla") p *= 0.5; if (S.curse === "specchio") ang = Math.PI - ang; if (S.curse === "vento") S.wind = Math.random() < 0.5 ? -1 : 1;
        if (S.curse) burst(OPOW[S.curse].sfx, d.x, d.y - 24, false, oppCol); S.curse = "";
        if (S.armed === "fulmine") { d.ghost = 1; p = Math.min(1.5, p * 1.5); } if (S.armed === "gigante") d.big = 1; if (S.armed === "calamita") ball.magnet = 1; if (S.armed === "gelo") S.frozen = true; if (S.armed === "doppio") S.bonus = true;
        S.armed = ""; S.data.tiri++;
      }
      d.vx = Math.cos(ang) * p * MAXP; d.vy = Math.sin(ang) * p * MAXP; S.phase = "roll"; S.t = 0; S.aim = null; S.shooter = d;
      tone(300 + p * 300, 0.08, "triangle", 0.05, 120); hud(); return true;
    }
    function usePower() {
      if (!power || S.meter < 100 || S.who !== 0 || S.phase !== "aim" || S.armed) return;
      S.meter = 0; S.armed = power; S.data.poteri++; (S.data.usati = S.data.usati || {})[power] = 1;
      const P = POW[power]; S.panel = { t: 90, txt: P.name + "!", sub: P.sub, col: usCol, sfx: P.sfx, next: () => { S.phase = "aim"; hud(); } }; S.phase = "panel"; tone(220, 0.5, "sawtooth", 0.05, 880); hud();
      if (powers && powers.length > 1) { pIdx = (pIdx + 1) % powers.length; power = powers[pIdx]; S.meter = 50; S.nextPow = power; }
    }
    function oppCurse() { // il cattivo usa il suo contro-potere
      S.ometer = 0; S.curse = opow; const P = OPOW[opow];
      S.panel = { t: 90, txt: P.name + "!", sub: P.sub, col: oppCol, sfx: P.sfx, villain: true, next: () => oppShot() }; S.phase = "panel"; tone(110, 0.5, "sawtooth", 0.05, 55); hud();
    }
    // l'intelligenza dell'avversario: sceglie il disco e il tiro che manda il pallone verso la nostra porta
    function oppShot() {
      const own = D.map((d, i) => [d, i]).filter(([d]) => d.team === 1), goalX = W / 2 + (Math.random() - 0.5) * MOUTH, goalY = H + 10;
      const press = style === "pressing" ? 1.15 : 1, noise = Math.max(0.03, 0.22 / (DF.opp || 1) - 0.05) + 0.03 * (BN.df | 0);
      let best = null;
      own.forEach(([d, i]) => {
        const gx = goalX - ball.x, gy = goalY - ball.y, gd = Math.hypot(gx, gy), ux = gx / gd, uy = gy / gd, tx = ball.x - ux * (RB + RD - 1), ty = ball.y - uy * (RB + RD - 1);
        const dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy), behind = (d.y < ball.y ? 1 : 0.35), block = D.some((e) => e !== d && segDist(d.x, d.y, tx, ty, e.x, e.y) < RD * 1.6) ? 0.3 : 1;
        let score = behind * block * (1 / (1 + dist / 120)) * (d.gk && style !== "contropiede" ? 0.4 : 1);
        if (style === "difensiva" && ball.y < H / 2) score *= d.gk ? 0.2 : 1.2;
        if (!best || score > best.s) best = { s: score, i, ang: Math.atan2(dy, dx), p: Math.min(1, (0.45 + dist / 260) * press * (0.85 + DF.opp * 0.2)) };
      });
      if (!best) return afterTurn(false);
      flick(best.i, best.ang + (Math.random() - 0.5) * noise * 2, best.p);
    }
    function segDist(x1, y1, x2, y2, px, py) { const vx = x2 - x1, vy = y2 - y1, l = vx * vx + vy * vy || 1, t = Math.max(0, Math.min(1, ((px - x1) * vx + (py - y1) * vy) / l)); return Math.hypot(x1 + vx * t - px, y1 + vy * t - py); }
    // ------------------------------------------------------------ ciclo
    function tick() {
      S.t++; if (S.capT > 0 && --S.capT === 0) S.cap = null;
      if (S.panel) { if (--S.panel.t <= 0) { const n = S.panel.next; S.panel = null; if (n) n(); } return; }
      if (S.phase === "roll") { physics(); if (S.phase === "roll" && (S.t > 40 && !moving() || S.t > 600)) endShot(); }
      else if (S.phase === "oppwait") { if (S.t > 40) { if (S.frozen) { S.frozen = false; afterTurn(false); } else if (opow && S.ometer >= 100) oppCurse(); else oppShot(); } }
      if (S.shake > 0) S.shake *= 0.85;
    }
    // ------------------------------------------------------------ disegno (fumetto americano)
    const ink = "#121212";
    function dots(x, y, w, h, col, step) { g.fillStyle = col; for (let yy = y; yy < y + h; yy += step) for (let xx = x + ((yy / step) % 2 ? step / 2 : 0); xx < x + w; xx += step) { g.beginPath(); g.arc(xx, yy, step * 0.22, 0, 7); g.fill(); } }
    function star(x, y, r0, r1, n, rot) { g.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r0 : r1; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); }
    function drawDisc(d) {
      const r = d.r * (d.big ? 1.8 : 1), sp = Math.hypot(d.vx, d.vy);
      if (sp > 3) { g.strokeStyle = "rgba(18,18,18,.35)"; g.lineWidth = 1.5; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(d.x - d.vx * 2 + k * 4 * (d.vy / sp), d.y - d.vy * 2 - k * 4 * (d.vx / sp)); g.lineTo(d.x - d.vx * 5 + k * 4 * (d.vy / sp), d.y - d.vy * 5 - k * 4 * (d.vx / sp)); g.stroke(); } }
      g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.arc(d.x + 2, d.y + 3, r, 0, 7); g.fill();
      if (d.p && d.p.hero && d.team === 0) { g.fillStyle = "#6a0a1a"; g.beginPath(); g.moveTo(d.x - r * 0.7, d.y + 2); g.lineTo(d.x + r * 0.7, d.y + 2); g.lineTo(d.x + r * 1.1 + Math.sin(S.t / 6) * 2, d.y + r * 1.6); g.lineTo(d.x - r * 1.1 - Math.sin(S.t / 6) * 2, d.y + r * 1.6); g.closePath(); g.fill(); g.strokeStyle = ink; g.lineWidth = 1.2; g.stroke(); }
      g.fillStyle = d.team ? oppCol : usCol; g.beginPath(); g.arc(d.x, d.y, r, 0, 7); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke();
      g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.arc(d.x - r * 0.3, d.y - r * 0.3, r * 0.45, 0, 7); g.fill();
      // la testa vista dall'alto: capelli e un po' di viso
      g.fillStyle = (d.p && d.p.skin) || "#e0ac7e"; g.beginPath(); g.arc(d.x, d.y, r * 0.5, 0, 7); g.fill(); g.strokeStyle = ink; g.lineWidth = 1; g.stroke();
      g.fillStyle = (d.p && d.p.hair) || ink; g.beginPath(); g.arc(d.x, d.y - (d.team ? -1 : 1) * r * 0.12, r * 0.42, 0, 7); g.fill();
      if (d.p && d.p.hero) { g.strokeStyle = "#ffd23f"; g.lineWidth = 2; g.beginPath(); g.arc(d.x, d.y, r + 2.5, 0, 7); g.stroke(); }
      if (d.gk) { g.fillStyle = "#fff"; g.font = "bold 6px sans-serif"; g.textAlign = "center"; g.fillText("P", d.x, d.y + r + 7); g.textAlign = "left"; }
      if (d.ghost) { g.strokeStyle = "#ffe84a"; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 6; i++) { const a = S.t / 3 + i; g.moveTo(d.x + Math.cos(a) * r, d.y + Math.sin(a) * r); g.lineTo(d.x + Math.cos(a + 0.3) * (r + 8), d.y + Math.sin(a + 0.3) * (r + 8)); } g.stroke(); }
      if (S.frozen && d.team === 1) { g.fillStyle = "rgba(160,220,255,.55)"; g.beginPath(); g.arc(d.x, d.y, r + 3, 0, 7); g.fill(); g.strokeStyle = "#e8f8ff"; g.lineWidth = 1; g.stroke(); }
    }
    function draw() {
      const sh = S.shake || 0; g.setTransform(2, 0, 0, 2, (Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh);
      // il campo: verde a retino, linee spesse da inchiostro
      g.fillStyle = "#3f9a4a"; g.fillRect(0, 0, W, H); dots(0, 0, W, H, "rgba(20,60,20,.28)", 6);
      for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)"; g.fillRect(0, i * (H / 6), W, H / 6); }
      g.strokeStyle = "#f6f1e4"; g.lineWidth = 2; g.strokeRect(WALL, LINE, W - WALL * 2, H - LINE * 2); g.beginPath(); g.moveTo(WALL, H / 2); g.lineTo(W - WALL, H / 2); g.stroke(); g.beginPath(); g.arc(W / 2, H / 2, 32, 0, 7); g.stroke();
      g.strokeRect(W / 2 - 60, LINE, 120, 46); g.strokeRect(W / 2 - 60, H - LINE - 46, 120, 46);
      // le porte
      [[0, oppCol], [1, usCol]].forEach(([s, col]) => { const y = s ? H - LINE : 2; g.fillStyle = "rgba(246,241,228,.85)"; g.fillRect(W / 2 - MOUTH, y, MOUTH * 2, LINE - 2); g.strokeStyle = "rgba(18,18,18,.4)"; g.lineWidth = 0.6; for (let x = W / 2 - MOUTH; x <= W / 2 + MOUTH; x += 6) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + LINE - 2); g.stroke(); } g.strokeStyle = col; g.lineWidth = 3; g.strokeRect(W / 2 - MOUTH, y, MOUTH * 2, LINE - 2); });
      // le sponde: un bordo di cartone disegnato
      g.strokeStyle = ink; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
      if (S.wind) { g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1; for (let i = 0; i < 10; i++) { const y = (i * 37 + S.t) % H, x = ((S.t * 3 * S.wind + i * 50) % W + W) % W; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18 * S.wind, y); g.stroke(); } }
      D.forEach(drawDisc);
      // il pallone
      if (ball.magnet) { g.strokeStyle = "rgba(255,80,80,.7)"; g.lineWidth = 1; for (let i = 1; i < 4; i++) { g.beginPath(); g.arc(ball.x, ball.y, RB + i * 4 + (S.t % 8) / 2, -2.4, -0.7); g.stroke(); } }
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.arc(ball.x + 2, ball.y + 2, RB, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(ball.x, ball.y, RB, 0, 7); g.fill(); g.strokeStyle = ink; g.lineWidth = 1.5; g.stroke();
      g.fillStyle = ink; star(ball.x, ball.y, 1.6, 3, 5, S.t / 20 + ball.x / 10); g.fill();
      // la fionda: la linea della mira e la freccia di dove andrà
      if (S.aim) { const d = D[S.aim.i], p = S.aim.p, a = S.aim.ang, len = 20 + p * 70; g.strokeStyle = "#121212"; g.lineWidth = 2; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(d.x, d.y); g.lineTo(d.x - Math.cos(a) * p * 50, d.y - Math.sin(a) * p * 50); g.stroke(); g.setLineDash([]);
        g.strokeStyle = p > 0.85 ? "#ffd23f" : "#fff"; g.lineWidth = 3; g.beginPath(); g.moveTo(d.x + Math.cos(a) * (d.r + 3), d.y + Math.sin(a) * (d.r + 3)); g.lineTo(d.x + Math.cos(a) * len, d.y + Math.sin(a) * len); g.stroke();
        g.fillStyle = g.strokeStyle; g.beginPath(); g.moveTo(d.x + Math.cos(a) * (len + 7), d.y + Math.sin(a) * (len + 7)); g.lineTo(d.x + Math.cos(a + 2.6) * 7 + Math.cos(a) * len, d.y + Math.sin(a + 2.6) * 7 + Math.sin(a) * len); g.lineTo(d.x + Math.cos(a - 2.6) * 7 + Math.cos(a) * len, d.y + Math.sin(a - 2.6) * 7 + Math.sin(a) * len); g.closePath(); g.fill(); }
      else if (S.phase === "aim") D.forEach((d) => { if (d.team === 0) { g.strokeStyle = `rgba(255,255,255,${0.4 + 0.4 * Math.sin(S.t / 8)})`; g.lineWidth = 1.5; g.beginPath(); g.arc(d.x, d.y, d.r + 5, 0, 7); g.stroke(); } });
      // gli scoppi «POW!»
      S.fx = S.fx.filter((f) => f.t-- > 0); S.fx.forEach((f) => { const k = Math.min(1, (f.big ? 70 : 40) - f.t) / 6, s = Math.min(1, k); g.save(); g.translate(f.x, f.y); g.rotate(f.rot); g.scale(s, s); g.fillStyle = "#ffd23f"; star(0, 0, f.big ? 16 : 11, f.big ? 30 : 20, 9, 0); g.fill(); g.strokeStyle = ink; g.lineWidth = 2; g.stroke(); g.font = `900 ${f.big ? 15 : 10}px Impact, sans-serif`; g.textAlign = "center"; g.fillStyle = f.col || "#d82a2a"; g.lineWidth = 3; g.strokeStyle = "#fff"; g.strokeText(f.txt, 0, 5); g.fillText(f.txt, 0, 5); g.restore(); });
      // la tavola a tutto schermo (gol, poteri)
      if (S.panel) {
        const p = S.panel, k = Math.min(1, (100 - Math.min(100, p.t)) / 10);
        g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = p.villain ? "#2a1a3a" : "#f6e24a"; g.fillRect(0, 0, W, H); dots(0, 0, W, H, p.villain ? "rgba(140,80,200,.4)" : "rgba(216,42,42,.35)", 8);
        g.strokeStyle = p.villain ? "rgba(200,160,255,.4)" : "rgba(18,18,18,.25)"; g.lineWidth = 1.5; for (let i = 0; i < 36; i++) { const a = (i / 36) * 6.28; g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * 60, H / 2 + Math.sin(a) * 60); g.lineTo(W / 2 + Math.cos(a) * 400, H / 2 + Math.sin(a) * 400); g.stroke(); }
        g.save(); g.translate(W / 2, H / 2 - 20); g.scale(k, k); g.rotate(-0.08); g.fillStyle = "#fff"; star(0, 0, 70, 104, 14, S.t / 60); g.fill(); g.strokeStyle = ink; g.lineWidth = 3; g.stroke();
        g.font = "900 26px Impact, sans-serif"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = ink; g.strokeText(p.txt, 0, 9); g.fillStyle = p.col; g.fillText(p.txt, 0, 9); g.restore();
        g.fillStyle = "#ffe84a"; g.strokeStyle = ink; g.lineWidth = 2; g.fillRect(14, H - 88, W - 28, 34); g.strokeRect(14, H - 88, W - 28, 34); g.fillStyle = ink; g.font = "bold 10px 'Comic Sans MS', 'Trebuchet MS', sans-serif"; g.textAlign = "center"; g.fillText(p.sub, W / 2, H - 67);
        g.font = "900 20px Impact, sans-serif"; g.fillStyle = p.villain ? "#e8d8ff" : ink; g.fillText(p.sfx, W / 2, H - 22); g.textAlign = "left";
        g.strokeStyle = ink; g.lineWidth = 4; g.strokeRect(4, 4, W - 8, H - 8);
      }
      // tiri rimasti
      if (!S.panel) { g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = "rgba(18,18,18,.7)"; g.fillRect(W - 58, H / 2 - 9, 52, 18); g.fillStyle = "#fff"; g.font = "bold 8px sans-serif"; g.fillText(S.extra ? "GOLDEN GOL" : `TIRI ${Math.max(0, shotsLeft(true))}`, W - 54, H / 2 + 3); }
    }
    function loop() { if (!el.isConnected) return; if (S.phase !== "intro" && !S.over) tick(); draw(); hud(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ comandi: la fionda
    const toField = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]; };
    cv.addEventListener("pointerdown", (e) => {
      e.preventDefault(); if (S.phase !== "aim" || S.who !== 0) return; const [x, y] = toField(e);
      let bi = -1, bd = 1e9; D.forEach((d, i) => { if (d.team !== 0) return; const dd = Math.hypot(d.x - x, d.y - y); if (dd < bd) { bd = dd; bi = i; } });
      if (bi < 0 || bd > RD + 18) return; S.drag = { i: bi, x0: x, y0: y }; S.aim = { i: bi, ang: 0, p: 0 }; try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    });
    cv.addEventListener("pointermove", (e) => { if (!S.drag) return; const [x, y] = toField(e), d = D[S.drag.i], dx = d.x - x, dy = d.y - y, l = Math.hypot(dx, dy); S.aim = { i: S.drag.i, ang: Math.atan2(dy, dx), p: Math.min(1, l / 90) }; });
    const up = () => { if (!S.drag) return; const a = S.aim; S.drag = null; if (a && a.p > 0.08) flick(a.i, a.ang, a.p); else S.aim = null; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", () => { S.drag = null; S.aim = null; });
    el.querySelector(".pow").addEventListener("pointerdown", (e) => { e.preventDefault(); usePower(); });
    el.querySelector(".quit").addEventListener("pointerdown", (e) => { e.preventDefault(); finish(true); });
    // tastiera: ◀▶ sceglie il disco, ▲▼ la forza, Q/E ruota la mira, spazio tira, P potere
    const kd = (e) => {
      if (S.phase !== "aim" || S.who !== 0) { if (e.key === "Escape") finish(true); return; }
      const mine = D.map((d, i) => i).filter((i) => D[i].team === 0); if (!S.aim) S.aim = { i: mine[0], ang: -Math.PI / 2, p: 0.6 };
      const a = S.aim, k = e.key;
      if (k === "ArrowLeft" || k === "ArrowRight") { const j = mine.indexOf(a.i); a.i = mine[(j + (k === "ArrowLeft" ? mine.length - 1 : 1)) % mine.length]; }
      else if (k === "ArrowUp" || k === "ArrowDown") a.p = Math.max(0.1, Math.min(1, a.p + (k === "ArrowUp" ? 0.1 : -0.1)));
      else if (k === "q" || k === "e") a.ang += k === "q" ? -0.12 : 0.12;
      else if (k === " " || k === "Enter") flick(a.i, a.ang, a.p);
      else if (k === "p") usePower(); else return;
      e.preventDefault(); e.stopPropagation();
    };
    window.addEventListener("keydown", kd, true);
    // ------------------------------------------------------------ fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: S.data };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Tiri ${S.data.tiri} · Tocchi di palla ${S.data.tocchi} · Carambole ${S.data.pow} · Poteri ${S.data.poteri}</p>`, "Continua ▸", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd, true); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.flick = flick; S.usePower = usePower; S.D = D; S.ball = ball; Object.defineProperty(S, "power", { get: () => power });
    const pw = powers && powers.length > 1 ? `<p><b>I poteri della squadra</b>, a turno: ${powers.map((k) => POW[k].name).join(" → ")}. Dopo ogni potere usato arriva il successivo, e la barra riparte da metà.</p>` : power ? `<p><b>Il tuo potere: ${POW[power].name}</b> — ${POW[power].sub}. La barra si riempie toccando il pallone e con le carambole; piena, premi <b>POTERE</b> prima di tirare.</p>` : "";
    const opw = opow ? `<p><b>Attento al cattivo: ${OPOW[opow].name}</b> — ${OPOW[opow].sub}, quando la sua barra è piena.</p>` : "";
    card(o.title || "Super-Bottoni", `${o.intro || ""}<p><b>Come si gioca</b>: tocca uno dei tuoi bottoni, <b>tira indietro</b> come una fionda e lascia. Più tiri, più va forte. Spingi il pallone nella porta in alto. Poi tocca a loro.</p>${pw}${opw}<p style="opacity:.8;font-size:12px">${S.shots} tiri a testa · avversari: ${esc(style)}</p>`, "Fischio d'inizio ▸", () => { S.phase = "aim"; S.who = 0; say("Tocca a te! Tira indietro un bottone."); hud(); });
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("btCss")) return; const st = document.createElement("style"); st.id = "btCss";
    st.textContent = `.btOv{position:fixed;inset:0;z-index:300;background:#f6e24a radial-gradient(rgba(216,42,42,.25) 22%,transparent 24%) 0 0/10px 10px;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#121212}
.btOv .hud{width:min(100%,400px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:3px solid #121212;background:#fff;padding:3px 10px;font:900 13px system-ui;box-shadow:4px 4px 0 #121212;transform:rotate(-.6deg)}
.btOv .hud .n0{color:var(--us)}.btOv .hud .n1{text-align:right;color:var(--opp)}.btOv .hud .sc{font:900 24px Impact,sans-serif;letter-spacing:2px;color:#121212}
.btOv .cap{width:min(100%,400px);min-height:20px;background:#ffe84a;border:2px solid #121212;padding:3px 8px;font:700 12px/1.25 'Comic Sans MS','Trebuchet MS',sans-serif;box-shadow:2px 2px 0 #121212;text-transform:uppercase}
.btOv canvas{width:min(100%,400px,calc((100vh - 230px) * .6667));height:auto;aspect-ratio:2/3;flex:none;border:3px solid #121212;box-shadow:5px 5px 0 #121212;background:#3f9a4a;touch-action:none}
.btOv .bars{width:min(100%,400px);display:grid;grid-template-columns:1fr 1fr;gap:8px}.btOv .bar{position:relative;height:14px;border:2px solid #121212;background:#fff}.btOv .bar i{display:block;height:100%;width:0;background:repeating-linear-gradient(45deg,var(--us) 0 5px,#ffd23f 5px 8px);transition:width .2s}.btOv .bar.op i{background:repeating-linear-gradient(45deg,var(--opp) 0 5px,#121212 5px 8px)}.btOv .bar b{position:absolute;inset:0;text-align:center;font:900 9px/10px system-ui;letter-spacing:2px;text-shadow:0 0 3px #fff}
.btOv .pad{width:min(100%,400px);display:grid;grid-template-columns:1fr 76px;gap:8px}
.btOv button{min-height:48px;border:3px solid #121212;background:#fff;font:900 14px Impact,system-ui,sans-serif;letter-spacing:1px;box-shadow:3px 3px 0 #121212;color:#121212;cursor:pointer}
.btOv button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #121212}.btOv .pow:disabled{opacity:.45}.btOv .pow.on{background:var(--us);color:#ffd23f;animation:btPulse .5s infinite alternate}.btOv .quit{font-size:12px}
@keyframes btPulse{to{transform:scale(1.04) rotate(-1deg)}}
.btOv .ov{position:absolute;inset:0;background:rgba(246,226,74,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
.btOv .card{max-width:420px;width:100%;border:3px solid #121212;background:#fff;box-shadow:6px 6px 0 #121212;padding:14px}.btOv .card h3{margin:0 0 8px;font:900 26px Impact,sans-serif;letter-spacing:1px;color:#d82a2a;-webkit-text-stroke:1px #121212}.btOv .card p{margin:6px 0;font-size:14px;line-height:1.4}.btOv .card .big{font:900 34px Impact,sans-serif}.btOv .card button{width:100%;margin-top:10px;background:#d82a2a;color:#fff}`;
    document.head.appendChild(st);
  }
  window.__bottoni = { start, POW, OPOW, get state() { return STATE; } };
})();
