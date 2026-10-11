// js/libro-finali-partita.js - LA PARTITA SCRITTA (modalità originale del «Libro che Mangiava i Finali»)
// Una partita in tre «pagine» (tempi) su un campo a fumetto, giocata in verticale col dito.
// Prima di ogni pagina il Narratore scrive una parola-regola contro di te (NEBBIA, SPECCHIO, PIOGGIA, CANCELLA, FINE)
// e tu ne scegli una dal tuo pennino: le parole raccolte nella saga sono il tuo mazzo. Ogni parola del Narratore ha la sua
// parola contraria (LUCE, DRITTO, SOLE, PENNA, ANCORA). Le altre danno un vantaggio (SOFFIO, DOPPIO, LARGA, MURO, APERTO, PONTE).
// Comandi: trascina il dito sul campo (il Campione va verso il dito), TIRA, PASSA. Da tastiera: frecce, Spazio (tira), X (passa).
// Uso: window.__lbPartitaScritta.start({ title, hero:{name,skin,hair,shirt}, mate:{name,skin,hair,shirt}, words:[id...], opp:{name,boss}, onDone({a,b,win,recap}) })
(function () {
  "use strict";
  if (window.__lbPartitaScritta) return;
  const W = 240, H = 360, GY0 = 40, GY1 = 340, XL = 12, XR = 228;
  const BOSS = {
    nebbia: { w: "NEBBIA", d: "Il pallone si vede solo vicino a te.", c: "luce" },
    specchio: { w: "SPECCHIO", d: "Destra e sinistra si scambiano.", c: "dritto" },
    pioggia: { w: "PIOGGIA", d: "Il pallone si impantana, tutti più lenti.", c: "sole" },
    cancella: { w: "CANCELLA", d: "Il tuo primo gol della pagina non vale.", c: "penna" },
    fine: { w: "FINE", d: "La pagina dura molto meno.", c: "ancora" },
  };
  const MINE = {
    ponte: ["PONTE", "Passaggi istantanei, mai intercettati."], luce: ["LUCE", "Contro NEBBIA. Altrimenti: tiri più precisi."], soffio: ["SOFFIO", "Tiri più forti."],
    aperto: ["APERTO", "Il portiere avversario esce dai pali."], muro: ["MURO", "Un muretto protegge la tua porta."], dritto: ["DRITTO", "Contro SPECCHIO. Altrimenti: corri più veloce."],
    sole: ["SOLE", "Contro PIOGGIA. Altrimenti: il pallone corre di più."], doppio: ["DOPPIO", "I tuoi gol valgono due."], ancora: ["ANCORA", "Contro FINE. Altrimenti: +10 secondi."],
    penna: ["PENNA", "Contro CANCELLA. Altrimenti: il primo gol vale doppio."], larga: ["LARGA", "La porta avversaria si allarga."],
  };
  const SFXW = ["BOOM!", "SBAM!", "PAF!", "SWOOSH!", "ZAC!", "TONF!"];
  let S = null;

  // ---------------------------------------------------------------- audio minimo
  let ac = null;
  function beep(f, d, type, v, sl) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = type || "square"; o.frequency.setValueAtTime(f, t); if (sl) o.frequency.exponentialRampToValueAtTime(sl, t + d); g.gain.setValueAtTime(v || 0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02); } catch (e) {} }
  const snd = { kick: () => beep(220, 0.08, "square", 0.07, 120), goal: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.08), i * 70)); }, save: () => beep(180, 0.15, "sawtooth", 0.06, 90), whistle: () => { beep(1800, 0.12, "sine", 0.05); setTimeout(() => beep(1800, 0.25, "sine", 0.05), 160); }, word: () => [392, 523, 659].forEach((f, i) => setTimeout(() => beep(f, 0.15, "triangle", 0.07), i * 60)) };

  // ---------------------------------------------------------------- DOM
  function css() {
    if (document.getElementById("lbPSstyle")) return;
    const st = document.createElement("style"); st.id = "lbPSstyle";
    st.textContent = `#lbPS{position:fixed;inset:0;z-index:300;background:#1b1b2b;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:8px 8px 10px;gap:6px;font-family:"M PLUS Rounded 1c",system-ui,sans-serif;color:#111;touch-action:none;user-select:none;-webkit-user-select:none}
#lbPS .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;background:#fffbea;border:3px solid #111;border-radius:6px;padding:4px 10px;font-weight:800;font-size:13px;color:#111;box-shadow:3px 3px 0 #111}
#lbPS .hud .n1{text-align:right}#lbPS .hud .n0,#lbPS .hud .n1{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#lbPS .hud .sc{font:900 22px Impact,"Arial Black",sans-serif;letter-spacing:2px;color:#e63946;-webkit-text-stroke:1px #111}
#lbPS canvas{width:min(100%,420px,calc((100vh - 170px) * 0.6667));aspect-ratio:2/3;border:3px solid #111;border-radius:4px;background:#fffbea;box-shadow:4px 4px 0 #111;touch-action:none}
#lbPS .pad{width:min(100%,420px);display:grid;grid-template-columns:1fr 1fr 70px;gap:8px}
#lbPS button{font:800 16px "M PLUS Rounded 1c",system-ui,sans-serif;border:3px solid #111;border-radius:8px;padding:12px 6px;box-shadow:3px 3px 0 #111;cursor:pointer;color:#111}
#lbPS button:active{transform:translate(2px,2px);box-shadow:1px 1px 0 #111}
#lbPS .tira{background:#e63946;color:#fff}#lbPS .passa{background:#3fa7ff;color:#fff}#lbPS .esci{background:#ddd;font-size:12px}
#lbPS .ov{position:absolute;inset:0;background:rgba(17,17,30,.86);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;overflow:auto}
#lbPS .card{background:#fffbea;border:3px solid #111;border-radius:8px;box-shadow:4px 4px 0 #111;padding:12px;max-width:400px;width:100%}
#lbPS .card h3{margin:0 0 6px;font-family:"Dela Gothic One",Impact,sans-serif;font-size:20px}
#lbPS .card p{margin:4px 0;font-size:14px;line-height:1.35}
#lbPS .boss{background:#111;color:#ffd95a;border-color:#ffd95a}
#lbPS .words{display:grid;gap:8px;width:100%;max-width:400px}
#lbPS .words button{background:#fffbea;text-align:left;font-size:15px}#lbPS .words button.counter{background:#ffd95a}
#lbPS .words button small{display:block;font-weight:600;font-size:12px;margin-top:2px}`;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- stato partita
  function newState(o) {
    return {
      o, a: 0, b: 0, page: 0, t: 0, dur: 0, run: false, over: false, words: (o.words || []).filter((w) => MINE[w]), used: [], mine: null, boss: null, fx: [], flash: null,
      hero: { x: 120, y: 260, vx: 0, vy: 0, team: 0, h: true, c: o.hero }, mate: { x: 70, y: 230, team: 0, c: o.mate }, gk0: { x: 120, y: GY1 - 8, team: 0, gk: true },
      opp: [{ x: 120, y: 120, team: 1 }, { x: 170, y: 90, team: 1 }], gk1: { x: 120, y: GY0 + 8, team: 1, gk: true },
      ball: { x: 120, y: 200, vx: 0, vy: 0, own: null, cd: 0 }, ptr: null, keys: {}, canceled: false, firstGoal: true, recap: [], pass: 0, shots: 0,
    };
  }
  const has = (k) => S && S.mine === k;
  const bossOn = (k) => S && S.boss === k && !(S.mine === BOSS[k].c);
  const all = () => [S.hero, S.mate, S.gk0, ...S.opp, S.gk1];
  const goalW = (team) => (team === 1 ? (has("larga") ? 104 : 64) : 64); // larghezza della porta di quella squadra (1 = avversari, in alto)
  function kickoff(toTeam) {
    S.hero.x = 120; S.hero.y = 250; S.mate.x = 70; S.mate.y = 230; S.opp[0].x = 120; S.opp[0].y = 130; S.opp[1].x = 172; S.opp[1].y = 100; S.gk0.x = 120; S.gk1.x = 120;
    S.ball.x = 120; S.ball.y = toTeam === 0 ? 238 : 142; S.ball.vx = S.ball.vy = 0; S.ball.own = toTeam === 0 ? S.hero : S.opp[0]; S.ball.cd = 0;
  }
  function pop(txt, x, y, col) { S.fx.push({ txt, x, y, t: 50, col: col || "#e63946" }); }

  // ---------------------------------------------------------------- logica
  function speedOf(p) {
    let v = p === S.hero ? 1.6 : p === S.mate ? 1.35 : p.gk ? 1.25 : 1.22;
    if (p.team === 1 && !p.gk && S.o.hard) v *= 1.08;
    if (p === S.hero && has("dritto") && S.boss !== "specchio") v *= 1.15;
    if (bossOn("pioggia")) v *= 0.9;
    if (p.team === 1 && S.ball.own === p) v *= 0.92;
    if (p === S.ball.own) v *= 0.9;
    return v;
  }
  function moveTo(p, tx, ty, sp) { const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy); if (d < 1) return; const v = Math.min(sp, d); p.x += dx / d * v; p.y += dy / d * v; p.dir = Math.atan2(dy, dx); }
  function shoot(p, power, aimX) {
    const gy = p.team === 0 ? GY0 : GY1, spreadK = has("luce") && S.boss !== "nebbia" ? 0.4 : 1;
    const dist = Math.abs(p.y - gy), spread = (8 + dist * 0.12) * spreadK;
    const tx = (aimX == null ? 120 : aimX) + (Math.random() - 0.5) * spread * 2, ang = Math.atan2(gy - p.y, tx - p.x);
    const pw = power * (p.team === 0 && has("soffio") ? 1.3 : 1);
    S.ball.own = null; S.ball.vx = Math.cos(ang) * pw; S.ball.vy = Math.sin(ang) * pw; S.ball.cd = 14; S.ball.shot = p.team; S.ball.last = p;
    snd.kick(); if (p.team === 0) { S.shots++; pop(SFXW[(Math.random() * SFXW.length) | 0], p.x, p.y - 14, "#e63946"); }
  }
  function passTo(p, q) {
    const lead = 14, tx = q.x, ty = q.y + (q.team === 0 ? -lead : lead), ang = Math.atan2(ty - p.y, tx - p.x), d = Math.hypot(tx - p.x, ty - p.y);
    const sp = p.team === 0 && has("ponte") ? 9 : Math.min(5.2, 2.6 + d / 40);
    S.ball.own = null; S.ball.vx = Math.cos(ang) * sp; S.ball.vy = Math.sin(ang) * sp; S.ball.cd = 10; S.ball.shot = -1; S.ball.last = p; S.ball.passTo = q; snd.kick();
    if (p.team === 0) S.pass++;
  }
  function act(kind) {
    if (!S || !S.run) return;
    const b = S.ball, h = S.hero;
    if (kind === "tira") {
      if (b.own === h) { const aim = 120 + (h.x - 120) * 0.25 + (S.ptr ? (S.ptr.x - h.x) * 0.2 : 0); shoot(h, 7, aim); }
      else if (b.own === S.mate) shoot(S.mate, 6.6, 120);
      else { h.dash = 18; pop("ZOOM!", h.x, h.y - 12, "#3fa7ff"); }
    } else if (kind === "passa") {
      if (b.own === h) passTo(h, S.mate);
      else if (b.own === S.mate) passTo(S.mate, h);
      else { // pressione: chiama il compagno sul pallone
        S.mate.call = 40; pop("QUI!", S.mate.x, S.mate.y - 12, "#3fa7ff");
      }
    }
  }
  function control() {
    const h = S.hero; let dx = 0, dy = 0;
    if (S.keys.ArrowLeft) dx -= 1; if (S.keys.ArrowRight) dx += 1; if (S.keys.ArrowUp) dy -= 1; if (S.keys.ArrowDown) dy += 1;
    const mir = bossOn("specchio") ? -1 : 1;
    let sp = speedOf(h) * ((h.dash | 0) > 0 ? 1.7 : 1); if (h.dash > 0) h.dash--;
    if (dx || dy) { const d = Math.hypot(dx, dy); h.x += dx * mir / d * sp; h.y += dy / d * sp; h.dir = Math.atan2(dy, dx * mir); }
    else if (S.ptr) { const tx = mir === 1 ? S.ptr.x : 240 - S.ptr.x; moveTo(h, tx, S.ptr.y, sp); }
  }
  function ai() {
    const b = S.ball, h = S.hero, m = S.mate, [o1, o2] = S.opp;
    // compagno
    if (b.own === m) {
      const near = S.opp.some((o) => Math.hypot(o.x - m.x, o.y - m.y) < 26);
      if (m.y < 150 && Math.random() < 0.05) shoot(m, 6.4, 100 + Math.random() * 40);
      else if (near && Math.random() < 0.08) passTo(m, h);
      else moveTo(m, 120 + Math.sin(S.t / 40) * 50, 90, speedOf(m));
    } else if (b.own === h) moveTo(m, h.x < 120 ? 170 : 70, Math.max(80, h.y - 60), speedOf(m));
    else if ((m.call | 0) > 0 || (b.own && b.own.team === 1 && Math.hypot(b.x - m.x, b.y - m.y) < 70) || (!b.own && Math.hypot(b.x - m.x, b.y - m.y) < Math.hypot(b.x - h.x, b.y - h.y))) { moveTo(m, b.x, b.y, speedOf(m)); if (m.call) m.call--; }
    else moveTo(m, h.x < 120 ? 170 : 70, Math.min(300, Math.max(90, b.y - 20)), speedOf(m) * 0.8);
    // avversari
    const chaser = Math.hypot(o1.x - b.x, o1.y - b.y) < Math.hypot(o2.x - b.x, o2.y - b.y) ? o1 : o2, other = chaser === o1 ? o2 : o1;
    S.opp.forEach((o) => {
      if (b.own === o) {
        const blockers = [h, m].filter((q) => Math.abs(q.x - o.x) < 22 && q.y > o.y && q.y - o.y < 40);
        if (o.y > 262 && Math.random() < 0.06) shoot(o, 5.6, 100 + Math.random() * 40);
        else if (blockers.length && Math.random() < 0.04) passTo(o, o === o1 ? o2 : o1);
        else moveTo(o, o.x + (blockers.length ? (o.x < 120 ? 18 : -18) : (120 - o.x) * 0.1), GY1, speedOf(o));
      } else if (o === chaser) moveTo(o, b.x, b.y, speedOf(o) * (bossOn("pioggia") ? 1 : 1) * (has("dritto") ? 1 : 1) * (S.o.lento ? 0.9 : 1));
      else moveTo(o, b.own && b.own.team === 1 ? 120 + (b.x < 120 ? 50 : -50) : (b.x + 120) / 2, b.own && b.own.team === 1 ? Math.min(300, b.y + 40) : Math.max(70, b.y - 50), speedOf(o) * 0.85);
    });
    // portieri
    const gkMove = (gk, team) => { const w = goalW(team) / 2 - 6, off = team === 1 && has("aperto") ? Math.sin(S.t / 30) * 34 : 0; const tx = Math.max(120 - w, Math.min(120 + w, b.x)) + off; moveTo(gk, tx, gk.y, speedOf(gk) * (team === 1 && has("aperto") ? 0.6 : 1)); };
    gkMove(S.gk0, 0); gkMove(S.gk1, 1);
  }
  function physics() {
    const b = S.ball;
    if (b.cd > 0) b.cd--;
    if (b.own) {
      const p = b.own, a = p.dir == null ? (p.team === 0 ? -Math.PI / 2 : Math.PI / 2) : p.dir;
      b.x = p.x + Math.cos(a) * 7; b.y = p.y + 3 + Math.sin(a) * 7; b.vx = b.vy = 0;
      // contrasti
      all().forEach((q) => { if (q.team !== p.team && !q.gk && (q.tk | 0) <= 0 && Math.hypot(q.x - b.x, q.y - b.y) < 9) { const pr = q.team === 0 ? 0.55 : 0.2 * (S.o.hard ? 1.4 : 1); if (Math.random() < pr) { b.own = q; b.cd = 16; pop("ZAC!", q.x, q.y - 12, "#111"); } q.tk = 24; } });
      all().forEach((q) => { if (q.tk > 0) q.tk--; });
      // il portiere che ha la palla rilancia
      if (p.gk) { const to = p.team === 0 ? (Math.random() < 0.5 ? S.hero : S.mate) : S.opp[(Math.random() * 2) | 0]; if (++p.hold > 30) { p.hold = 0; passTo(p, to); } }
      return;
    }
    const fr = bossOn("pioggia") ? 0.955 : has("sole") ? 0.988 : 0.978;
    b.x += b.vx; b.y += b.vy; b.vx *= fr; b.vy *= fr;
    if (b.x < XL + 3) { b.x = XL + 3; b.vx = Math.abs(b.vx) * 0.8; } if (b.x > XR - 3) { b.x = XR - 3; b.vx = -Math.abs(b.vx) * 0.8; }
    // muretto davanti alla porta (MURO)
    if (has("muro") && b.y > GY1 - 30 && b.y < GY1 - 22 && b.x > 100 && b.x < 140 && b.vy > 0) { b.vy = -Math.abs(b.vy) * 0.7; pop("TONF!", b.x, b.y - 8, "#111"); }
    // porte e fondo
    const inTop = Math.abs(b.x - 120) < goalW(1) / 2, inBot = Math.abs(b.x - 120) < goalW(0) / 2;
    if (b.y < GY0) {
      if (inTop) { if (keeperSave(S.gk1, b)) return; return goal(0); }
      b.y = GY0; b.vy = Math.abs(b.vy) * 0.7;
    }
    if (b.y > GY1) {
      if (inBot) { if (keeperSave(S.gk0, b)) return; return goal(1); }
      b.y = GY1; b.vy = -Math.abs(b.vy) * 0.7;
    }
    // ricezione
    if (b.cd <= 0) {
      let best = null, bd = 9e9;
      all().forEach((q) => { const d = Math.hypot(q.x - b.x, q.y - b.y), sp = Math.hypot(b.vx, b.vy); const r = q.gk ? 11 : (sp > 4.5 && q !== b.passTo ? 6 : 9); if (d < r && d < bd) { if (b.last && b.last.team === 0 && has("ponte") && b.passTo && q.team === 1) return; best = q; bd = d; } });
      if (best) { b.own = best; b.passTo = null; best.hold = 0; if (best.gk && b.shot != null && b.shot !== best.team && Math.hypot(b.vx, b.vy) > 3) { snd.save(); pop("PARATA!", best.x, best.y - 12, "#3fa7ff"); } }
    }
  }
  function keeperSave(gk, b) {
    const reach = gk.team === 1 && has("aperto") ? 7 : 13, sp = Math.hypot(b.vx, b.vy);
    if (Math.abs(gk.x - b.x) < reach && Math.random() < (sp > 6.5 ? 0.45 : 0.75)) { b.own = gk; gk.hold = 0; b.cd = 10; snd.save(); pop("PARATA!", gk.x, gk.y + (gk.team === 1 ? 16 : -10), "#3fa7ff"); return true; }
    return false;
  }
  function goal(team) {
    if (team === 0) {
      if (bossOn("cancella") && !S.canceled) { S.canceled = true; S.flash = { txt: "CANCELLATO!", c: "#111", t: 70 }; pop("SCRATCH!", 120, GY0 + 20, "#111"); S.recap.push("gol cancellato dal Narratore"); kickoff(1); return; }
      let n = has("doppio") ? 2 : 1; if (S.firstGoal && (has("penna") && S.boss !== "cancella")) n *= 2;
      S.firstGoal = false; S.a += n; S.flash = { txt: n > 1 ? `GOL x${n}!` : "GOL!", c: "#e63946", t: 70 }; snd.goal(); S.recap.push(`gol (${S.page + 1}ª pagina)`); kickoff(1);
    } else { S.b += 1; S.flash = { txt: "GOL LORO…", c: "#111", t: 60 }; snd.save(); kickoff(0); }
    hud();
  }

  // ---------------------------------------------------------------- disegno (fumetto)
  function chibi(g, p, col, skin, hair, label, own) {
    g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(p.x, p.y + 7, 7, 3, 0, 0, 7); g.fill();
    g.fillStyle = col; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.arc(p.x, p.y + 1, 6, 0, 7); g.fill(); g.stroke();
    g.fillStyle = skin || "#f2c9a0"; g.beginPath(); g.arc(p.x, p.y - 6, 4.5, 0, 7); g.fill(); g.stroke();
    if (hair) { g.fillStyle = hair; g.beginPath(); g.arc(p.x, p.y - 7.5, 4.5, Math.PI, 0); g.fill(); }
    if (own) { g.strokeStyle = "#ffd95a"; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y + 1, 9, 0, 7); g.stroke(); }
    if (label) { g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#111"; g.fillText(label, p.x, p.y + 16); g.textAlign = "left"; }
  }
  function draw() {
    const g = S.g, b = S.ball;
    g.fillStyle = "#fffbea"; g.fillRect(0, 0, W, H);
    // campo a fumetto
    g.fillStyle = has("sole") && !bossOn("pioggia") ? "#7fdc6a" : "#6cc94a"; g.fillRect(XL, GY0, XR - XL, GY1 - GY0);
    for (let y = GY0; y < GY1; y += 40) { g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(XL, y, XR - XL, 20); }
    g.fillStyle = "rgba(0,0,0,.08)"; for (let y = GY0 + 4; y < GY1; y += 8) for (let x = XL + ((y / 8) % 2) * 4 + 2; x < XR; x += 8) g.fillRect(x, y, 1.5, 1.5);
    g.strokeStyle = "#fff"; g.lineWidth = 2; g.strokeRect(XL + 2, GY0, XR - XL - 4, GY1 - GY0); g.beginPath(); g.moveTo(XL, 190); g.lineTo(XR, 190); g.stroke(); g.beginPath(); g.arc(120, 190, 24, 0, 7); g.stroke();
    g.strokeRect(120 - 50, GY0, 100, 40); g.strokeRect(120 - 50, GY1 - 40, 100, 40);
    // porte
    const gw1 = goalW(1), gw0 = goalW(0);
    g.fillStyle = "#fff"; g.fillRect(120 - gw1 / 2, GY0 - 12, gw1, 12); g.strokeStyle = "#111"; g.lineWidth = 2; g.strokeRect(120 - gw1 / 2, GY0 - 12, gw1, 12);
    g.fillRect(120 - gw0 / 2, GY1, gw0, 12); g.strokeRect(120 - gw0 / 2, GY1, gw0, 12);
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 1; for (let i = 4; i < gw1; i += 6) { g.beginPath(); g.moveTo(120 - gw1 / 2 + i, GY0 - 12); g.lineTo(120 - gw1 / 2 + i, GY0); g.stroke(); }
    if (has("muro")) { g.fillStyle = "#c0644a"; g.fillRect(100, GY1 - 30, 40, 8); g.strokeStyle = "#111"; g.strokeRect(100, GY1 - 30, 40, 8); g.fillStyle = "#111"; g.font = "bold 6px sans-serif"; g.fillText("MURO", 112, GY1 - 24); }
    // giocatori
    const O = S.o, hc = O.hero || {}, mc = O.mate || {};
    chibi(g, S.gk0, "#ffd95a", hc.skin, "#2b1d14", "", b.own === S.gk0);
    chibi(g, S.mate, mc.shirt || "#3fa7ff", mc.skin, mc.hair, mc.name ? mc.name.split(" ")[0] : "", b.own === S.mate);
    chibi(g, S.hero, hc.shirt || "#e63946", hc.skin, hc.hair, hc.name || "Tu", b.own === S.hero);
    S.opp.forEach((o, i) => { chibi(g, o, "#111", "#d9b38c", "#111", ["Capo", "Verso"][i], b.own === o); g.fillStyle = "#fff"; g.font = "bold 7px serif"; g.textAlign = "center"; g.fillText("¶", o.x, o.y + 4); g.textAlign = "left"; });
    chibi(g, S.gk1, "#5a5a6a", "#b07a52", "#1a1a22", O.boss ? "Narratore" : "", b.own === S.gk1);
    // pallone
    const fog = bossOn("nebbia");
    const vis = !fog || Math.hypot(b.x - S.hero.x, b.y - S.hero.y) < 60 || Math.hypot(b.x - S.mate.x, b.y - S.mate.y) < 40;
    if (vis) { g.fillStyle = "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.arc(b.x, b.y, 3.5, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#111"; g.beginPath(); g.arc(b.x, b.y, 1.2, 0, 7); g.fill(); }
    if (fog) { const gr = g.createRadialGradient(S.hero.x, S.hero.y, 30, S.hero.x, S.hero.y, 110); gr.addColorStop(0, "rgba(230,230,240,0)"); gr.addColorStop(1, "rgba(230,230,240,.92)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    if (bossOn("pioggia")) { g.strokeStyle = "rgba(60,90,160,.5)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 50; i++) { const x = (i * 37 + S.t * 3) % W, y = (i * 53 + S.t * 7) % H; g.moveTo(x, y); g.lineTo(x - 3, y + 8); } g.stroke(); }
    if (bossOn("specchio")) { g.fillStyle = "rgba(160,200,255,.12)"; g.fillRect(0, 0, W / 2, H); g.strokeStyle = "rgba(60,90,160,.5)"; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(120, 0); g.lineTo(120, H); g.stroke(); g.setLineDash([]); }
    // dito
    if (S.ptr && S.run) { g.strokeStyle = "rgba(17,17,17,.35)"; g.lineWidth = 1.5; g.beginPath(); g.arc(S.ptr.x, S.ptr.y, 10, 0, 7); g.stroke(); }
    // onomatopee
    S.fx = S.fx.filter((f) => f.t > 0);
    S.fx.forEach((f) => { f.t--; f.y -= 0.4; g.save(); g.translate(f.x, f.y); g.rotate(-0.12); g.font = "900 12px Impact, sans-serif"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#fff"; g.strokeText(f.txt, 0, 0); g.fillStyle = f.col; g.fillText(f.txt, 0, 0); g.restore(); });
    if (S.flash && S.flash.t > 0) { S.flash.t--; g.save(); g.translate(120, 180); g.rotate(-0.08); const s = 1 + Math.max(0, (S.flash.t - 50) / 20); g.scale(s, s); g.fillStyle = "#ffd95a"; g.strokeStyle = "#111"; g.lineWidth = 3; star(g, 0, 0, 70, 34, 14); g.fill(); g.stroke(); g.font = "900 22px Impact, sans-serif"; g.textAlign = "center"; g.fillStyle = S.flash.c; g.fillText(S.flash.txt, 0, 8); g.restore(); }
    // didascalia con le parole attive
    g.fillStyle = "#ffd95a"; g.fillRect(0, 0, W, 16); g.strokeStyle = "#111"; g.lineWidth = 2; g.strokeRect(1, 1, W - 2, 15);
    g.fillStyle = "#111"; g.font = "bold 9px sans-serif"; g.fillText(`Pag. ${S.page + 1}/3 · ${Math.max(0, Math.ceil((S.dur - S.t) / 60))}s`, 5, 12);
    g.textAlign = "right"; g.fillText(`${S.mine ? MINE[S.mine][0] : "—"} contro ${S.boss ? BOSS[S.boss].w : "—"}${S.boss && S.mine === BOSS[S.boss].c ? " ✓" : ""}`, W - 5, 12); g.textAlign = "left";
  }
  function star(g, x, y, r1, r2, n) { g.beginPath(); for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = (i / (n * 2)) * Math.PI * 2; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.6); } g.closePath(); }
  function hud() { if (!S || !S.el) return; S.el.querySelector(".n0").textContent = (S.o.hero && S.o.hero.name) || "Tu"; S.el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; S.el.querySelector(".n1").textContent = (S.o.opp && S.o.opp.name) || "Avversari"; }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------------------------------------------------------------- pagine e parole
  const BOSS_ORDER = () => ["nebbia", Math.random() < 0.5 ? "specchio" : "pioggia", Math.random() < 0.5 ? "cancella" : "fine"];
  function choosePage() {
    S.run = false;
    const boss = S.bossSeq[S.page]; S.boss = boss; S.mine = null; S.canceled = false; S.firstGoal = true;
    const left = S.words.filter((w) => !S.used.includes(w));
    // si pescano 3 parole; se tra le rimaste c'è la contraria della parola del Narratore, una delle tre è sempre quella
    const ctr = BOSS[boss].c, pool = left.filter((w) => w !== ctr).sort(() => Math.random() - 0.5), hand = (left.includes(ctr) ? [ctr] : []).concat(pool).slice(0, 3).sort(() => Math.random() - 0.5);
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card boss"><h3>Pagina ${S.page + 1} di 3</h3><p>Il Narratore scrive: <b style="font-size:18px">${BOSS[boss].w}</b></p><p>${esc(BOSS[boss].d)}</p></div>
      <div class="card"><p><b>Scegli la tua parola</b> (ogni parola si usa una volta sola). ${left.includes(ctr) ? `La parola contraria è <b>${MINE[ctr][0]}</b>.` : "Non hai la parola contraria: scegli un vantaggio."}</p></div><div class="words"></div>`;
    const box = ov.querySelector(".words");
    hand.forEach((w) => { const bt = document.createElement("button"); bt.type = "button"; if (w === ctr) bt.className = "counter"; bt.innerHTML = `✒ ${MINE[w][0]}${w === ctr ? " ★" : ""}<small>${esc(MINE[w][1])}</small>`; bt.onclick = () => { S.mine = w; S.used.push(w); snd.word(); ov.remove(); startPage(); }; box.appendChild(bt); });
    const none = document.createElement("button"); none.type = "button"; none.innerHTML = hand.length ? "Nessuna parola<small>Tieni le parole per le pagine dopo</small>" : "Comincia la pagina<small>Il pennino è vuoto</small>"; none.onclick = () => { ov.remove(); startPage(); }; box.appendChild(none);
    S.el.appendChild(ov);
  }
  function startPage() {
    S.t = 0; S.dur = (bossOn("fine") ? 22 : 35) * 60 + (has("ancora") && S.boss !== "fine" ? 600 : 0);
    if (S.page > 0) kickoff(S.page % 2 === 1 ? 1 : 0); S.run = true; snd.whistle();
    S.flash = { txt: `PAGINA ${S.page + 1}`, c: "#111", t: 60 };
  }
  function endPage() {
    S.run = false; snd.whistle();
    S.page++;
    if (S.page < 3) return choosePage();
    if (S.a === S.b && !S.extra) { S.extra = true; S.page = 2; S.boss = null; S.mine = null; S.dur = 20 * 60; S.t = 0; S.flash = { txt: "PAGINA EXTRA!", c: "#e63946", t: 80 }; kickoff(0); S.run = true; return; }
    finish();
  }
  function finish(quit) {
    if (!S || S.over) return; S.over = true; S.run = false;
    const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, recap: S.recap.length ? ` <span style="color:var(--dim)">(${S.recap.slice(0, 6).join(", ")})</span>` : "" };
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${quit ? "Partita abbandonata" : res.win ? "VITTORIA!" : S.a === S.b ? "Pareggio" : "Sconfitta"}</h3><p style="font-size:22px;font-weight:900">${S.a} – ${S.b}</p><p>Tiri ${S.shots} · Passaggi ${S.pass}</p></div>`;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "tira"; bt.textContent = "Torna al libro ▸"; bt.onclick = () => close(res); ov.appendChild(bt);
    S.el.appendChild(ov);
  }
  function close(res) {
    const s = S; S = null;
    cancelAnimationFrame(s.raf); window.removeEventListener("keydown", s.kd, true); window.removeEventListener("keyup", s.ku, true);
    s.el.remove();
    try { s.o.onDone(res); } catch (e) { console.error(e); }
  }
  function loop() {
    if (!S) return;
    if (S.run) { S.t++; control(); ai(); physics(); [S.hero, S.mate, ...S.opp].forEach((p) => { p.x = Math.max(XL + 4, Math.min(XR - 4, p.x)); p.y = Math.max(GY0 + 4, Math.min(GY1 - 4, p.y)); }); if (S.t >= S.dur) endPage(); }
    draw(); S.raf = requestAnimationFrame(loop);
  }

  function start(o) {
    if (S) return false;
    css(); S = newState(o || {});
    S.bossSeq = BOSS_ORDER();
    const el = document.createElement("div"); el.id = "lbPS";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="pad"><button type="button" class="tira">TIRA</button><button type="button" class="passa">PASSA</button><button type="button" class="esci">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    const cv = el.querySelector("canvas"); S.g = cv.getContext("2d"); S.g.scale(2, 2);
    const toLocal = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); S.ptr = toLocal(e); try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (S && S.ptr) S.ptr = toLocal(e); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => cv.addEventListener(ev, () => { if (S) S.ptr = null; }));
    el.querySelector(".tira").addEventListener("pointerdown", (e) => { e.preventDefault(); act("tira"); });
    el.querySelector(".passa").addEventListener("pointerdown", (e) => { e.preventDefault(); act("passa"); });
    el.querySelector(".esci").onclick = () => { if (S && !S.over) finish(true); };
    S.kd = (e) => { if (!S) return; if (/^Arrow/.test(e.key)) { S.keys[e.key] = true; e.preventDefault(); e.stopPropagation(); } else if (e.key === " " || e.key === "z") { act("tira"); e.preventDefault(); e.stopPropagation(); } else if (e.key === "x") { act("passa"); e.preventDefault(); e.stopPropagation(); } };
    S.ku = (e) => { if (S && /^Arrow/.test(e.key)) { S.keys[e.key] = false; e.stopPropagation(); } };
    window.addEventListener("keydown", S.kd, true); window.addEventListener("keyup", S.ku, true);
    kickoff(0); hud();
    // spiegazione iniziale
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${esc(o.title || "La Partita Scritta")}</h3><p>Tre <b>pagine</b> da 35 secondi. Prima di ogni pagina il Narratore scrive una parola contro di te, e tu ne scegli una dal tuo pennino.</p><p><b>Trascina il dito</b> sul campo: il Campione va verso il dito. <b>TIRA</b> calcia verso la porta in alto (senza palla: scatto). <b>PASSA</b> serve il compagno (senza palla: lo chiama sul pallone).</p><p>Ogni parola del Narratore ha una contraria (★). Vinci con più gol alla fine della terza pagina.</p></div>`;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "tira"; bt.textContent = "Volta la prima pagina ▸"; bt.onclick = () => { ov.remove(); choosePage(); }; ov.appendChild(bt);
    el.appendChild(ov);
    loop();
    return true;
  }
  window.__lbPartitaScritta = { start, get state() { return S; }, _act: act, _finish: () => finish(false) };
})();
