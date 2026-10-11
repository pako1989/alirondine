// js/muro-partita.js - PARTITA SUL MURO (modalità originale della saga «Il Muro»)
// Si gioca sul camminamento in cima alle mura di Cintavecchia: un campo lunghissimo e stretto, la telecamera segue il pallone.
// A sinistra, giù, la città. A destra, giù, la terra di fuori con i Colossi. Ogni tanto un COLOSSO APPOGGIA LA MANO sul muro:
// prima un'ombra avvisa dove cadrà, poi la mano resta lì qualche secondo come un ostacolo (chi è sotto viene spinto via, stordito).
// Se il pallone cade giù dal muro è RIMESSA per l'altra squadra. Due tempi. Variante finale (o.friendly): le mani aiutano,
// e il pallone che le colpisce rimbalza verso la porta avversaria (in alto).
// Comandi: levetta virtuale (appoggi il dito dove vuoi e trascini), TIRA, PASSA. Da tastiera: frecce, Spazio (tira), X (passa).
// Uso: window.__muroPartita.start({ title, us, hero:{name,skin,hair,shirt}, mate:{...}, opp:{name,kit,names:[a,b]}, hands, friendly, wind, night, hard, half, onDone({a,b,win,recap}) })
(function () {
  "use strict";
  if (window.__muroPartita) return;
  const W = 240, VH = 360, WH = 600, XL = 44, XR = 196, GY0 = 40, GY1 = 560, GW = 56;
  let S = null;
  let ac = null;
  function beep(f, d, type, v, sl) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = type || "square"; o.frequency.setValueAtTime(f, t); if (sl) o.frequency.exponentialRampToValueAtTime(sl, t + d); g.gain.setValueAtTime(v || 0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02); } catch (e) {} }
  const snd = { kick: () => beep(220, 0.08, "square", 0.07, 120), goal: () => [392, 523, 659, 784].forEach((f, i) => setTimeout(() => beep(f, 0.2, "triangle", 0.08), i * 80)), save: () => beep(180, 0.15, "sawtooth", 0.06, 90), whistle: () => { beep(1700, 0.12, "sine", 0.05); setTimeout(() => beep(1700, 0.25, "sine", 0.05), 160); }, hand: () => { beep(70, 0.5, "sawtooth", 0.09, 40); beep(110, 0.3, "square", 0.05, 50); }, warn: () => beep(140, 0.3, "sine", 0.05, 120), out: () => beep(500, 0.25, "sine", 0.05, 200) };

  function css() {
    if (document.getElementById("muPMstyle")) return;
    const st = document.createElement("style"); st.id = "muPMstyle";
    st.textContent = `#muPM{position:fixed;inset:0;z-index:300;background:#14161c;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:8px 8px 10px;gap:6px;font-family:system-ui,sans-serif;color:#e8e2d4;touch-action:none;user-select:none;-webkit-user-select:none}
#muPM .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;background:#2a2c34;border:2px solid #8a8070;border-radius:6px;padding:4px 10px;font-weight:800;font-size:13px}
#muPM .hud .n1{text-align:right}#muPM .hud .n0,#muPM .hud .n1{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#muPM .hud .sc{font:900 22px Georgia,serif;letter-spacing:2px;color:#e8c46a}
#muPM canvas{width:min(100%,420px,calc((100vh - 170px) * 0.6667));aspect-ratio:2/3;border:2px solid #8a8070;border-radius:4px;background:#5a5a62;touch-action:none}
#muPM .pad{width:min(100%,420px);display:grid;grid-template-columns:1fr 1fr 70px;gap:8px}
#muPM button{font:800 16px system-ui,sans-serif;border:2px solid #8a8070;border-radius:8px;padding:12px 6px;cursor:pointer;color:#fff}
#muPM .tira{background:#a8322a}#muPM .passa{background:#2c5f8a}#muPM .esci{background:#3a3c44;font-size:12px}
#muPM .ov{position:absolute;inset:0;background:rgba(10,12,18,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;overflow:auto}
#muPM .card{background:#2a2c34;border:2px solid #8a8070;border-radius:8px;padding:12px;max-width:400px;width:100%}
#muPM .card h3{margin:0 0 6px;font-family:Georgia,serif;font-size:20px;color:#e8c46a}#muPM .card p{margin:4px 0;font-size:14px;line-height:1.35}`;
    document.head.appendChild(st);
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function newState(o) {
    return { o, a: 0, b: 0, half: 0, t: 0, dur: (o.half || 40) * 60, run: false, over: false, fx: [], flash: null, recap: [], shots: 0, pass: 0, outs: 0, handsN: 0, cam: WH - VH, shake: 0,
      hero: { x: 120, y: 420, team: 0 }, mate: { x: 80, y: 380, team: 0 }, gk0: { x: 120, y: GY1 - 8, team: 0, gk: true },
      opp: [{ x: 120, y: 180, team: 1 }, { x: 160, y: 150, team: 1 }], gk1: { x: 120, y: GY0 + 8, team: 1, gk: true },
      ball: { x: 120, y: 300, vx: 0, vy: 0, own: null, cd: 0 }, ptr: null, keys: {}, hands: [], nextHand: 360 };
  }
  const all = () => [S.hero, S.mate, S.gk0, ...S.opp, S.gk1];
  function pop(txt, x, y, col) { S.fx.push({ txt, x, y, t: 55, col: col || "#e8c46a" }); }
  function kickoff(toTeam) {
    S.hero.x = 120; S.hero.y = 330; S.mate.x = 80; S.mate.y = 360; S.opp[0].x = 120; S.opp[0].y = 270; S.opp[1].x = 160; S.opp[1].y = 240; S.gk0.x = 120; S.gk1.x = 120;
    const b = S.ball; b.x = 120; b.y = toTeam === 0 ? 318 : 282; b.vx = b.vy = 0; b.own = toTeam === 0 ? S.hero : S.opp[0]; b.cd = 0; b.last = null;
  }
  function stunned(p) { return (p.stun | 0) > 0; }
  function speedOf(p) {
    let v = p === S.hero ? 1.65 : p === S.mate ? 1.4 : p.gk ? 1.25 : 1.25 * (S.o.hard ? 1.08 : 1);
    if (p === S.ball.own) v *= 0.9; if (stunned(p)) v *= 0.15; return v;
  }
  // le mani bloccano: un giocatore non può entrare nell'ellisse di una mano appoggiata
  function blocked(x, y) { return S.hands.some((h) => h.st === "down" && ((x - h.x) / h.rx) ** 2 + ((y - h.y) / h.ry) ** 2 < 1); }
  function step(p, nx, ny) { if (!blocked(nx, p.y)) p.x = nx; if (!blocked(p.x, ny)) p.y = ny; }
  function moveTo(p, tx, ty, sp) { const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy); if (d < 1) return; const v = Math.min(sp, d); step(p, p.x + dx / d * v, p.y + dy / d * v); p.dir = Math.atan2(dy, dx); }
  function shoot(p, power, aimX) {
    const gy = p.team === 0 ? GY0 : GY1, dist = Math.abs(p.y - gy), spread = 6 + dist * 0.08;
    const tx = (aimX == null ? 120 : aimX) + (Math.random() - 0.5) * spread * 2, ang = Math.atan2(gy - p.y, tx - p.x);
    const b = S.ball; b.own = null; b.vx = Math.cos(ang) * power; b.vy = Math.sin(ang) * power; b.cd = 14; b.shot = p.team; b.last = p; snd.kick();
    if (p.team === 0) { S.shots++; pop("TIRO!", p.x, p.y - 14, "#ffb347"); }
  }
  function passTo(p, q) {
    const lead = 16, tx = q.x, ty = q.y + (q.team === 0 ? -lead : lead), ang = Math.atan2(ty - p.y, tx - p.x), d = Math.hypot(tx - p.x, ty - p.y), sp = Math.min(5.6, 2.8 + d / 45);
    const b = S.ball; b.own = null; b.vx = Math.cos(ang) * sp; b.vy = Math.sin(ang) * sp; b.cd = 10; b.shot = -1; b.last = p; b.passTo = q; snd.kick(); if (p.team === 0) S.pass++;
  }
  function act(kind) {
    if (!S || !S.run) return;
    const b = S.ball, h = S.hero;
    if (kind === "tira") { if (b.own === h) shoot(h, 7.4, 120 + (h.x - 120) * 0.2 + (S.ptr ? (S.ptr.x - S.ptr.ax) * 0.8 : 0)); else if (b.own === S.mate) shoot(S.mate, 6.8, 120); else { h.dash = 18; pop("SCATTO!", h.x, h.y - 12, "#7ac8ff"); } }
    else if (kind === "passa") { if (b.own === h) passTo(h, S.mate); else if (b.own === S.mate) passTo(S.mate, h); else { S.mate.call = 50; pop("QUI!", S.mate.x, S.mate.y - 12, "#7ac8ff"); } }
  }
  function control() {
    const h = S.hero; let dx = 0, dy = 0;
    if (S.keys.ArrowLeft) dx -= 1; if (S.keys.ArrowRight) dx += 1; if (S.keys.ArrowUp) dy -= 1; if (S.keys.ArrowDown) dy += 1;
    const sp = speedOf(h) * ((h.dash | 0) > 0 ? 1.7 : 1); if (h.dash > 0) h.dash--;
    if (dx || dy) { const d = Math.hypot(dx, dy); step(h, h.x + dx / d * sp, h.y + dy / d * sp); h.dir = Math.atan2(dy, dx); }
    else if (S.ptr) { const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay, jl = Math.hypot(jx, jy); if (jl > 3) { const f = Math.min(1, jl / 16) * sp; step(h, h.x + jx / jl * f, h.y + jy / jl * f); h.dir = Math.atan2(jy, jx); } }
  }
  function ai() {
    const b = S.ball, h = S.hero, m = S.mate, [o1, o2] = S.opp;
    if (b.own === m) { const near = S.opp.some((o) => Math.hypot(o.x - m.x, o.y - m.y) < 28); if (m.y < GY0 + 130 && Math.random() < 0.05) shoot(m, 6.8, 104 + Math.random() * 32); else if (near && Math.random() < 0.07) passTo(m, h); else moveTo(m, 120 + Math.sin(S.t / 40) * 40, GY0 + 90, speedOf(m)); }
    else if (b.own === h) moveTo(m, h.x < 120 ? 165 : 75, Math.max(GY0 + 60, h.y - 80), speedOf(m));
    else if ((m.call | 0) > 0 || (b.own && b.own.team === 1 && Math.hypot(b.x - m.x, b.y - m.y) < 90) || (!b.own && Math.hypot(b.x - m.x, b.y - m.y) < Math.hypot(b.x - h.x, b.y - h.y))) { moveTo(m, b.x, b.y, speedOf(m)); if (m.call) m.call--; }
    else moveTo(m, h.x < 120 ? 165 : 75, Math.min(GY1 - 60, Math.max(GY0 + 80, b.y - 30)), speedOf(m) * 0.8);
    const chaser = Math.hypot(o1.x - b.x, o1.y - b.y) < Math.hypot(o2.x - b.x, o2.y - b.y) ? o1 : o2;
    S.opp.forEach((o) => {
      if (b.own === o) {
        const blockers = [h, m].filter((q) => Math.abs(q.x - o.x) < 24 && q.y > o.y && q.y - o.y < 44);
        if (o.y > GY1 - 120 && Math.random() < 0.055) shoot(o, 6, 104 + Math.random() * 32);
        else if (blockers.length && Math.random() < 0.04) passTo(o, o === o1 ? o2 : o1);
        else moveTo(o, o.x + (blockers.length ? (o.x < 120 ? 20 : -20) : (120 - o.x) * 0.1), GY1, speedOf(o));
      } else if (o === chaser) moveTo(o, b.x, b.y, speedOf(o));
      else moveTo(o, b.own && b.own.team === 1 ? 120 + (b.x < 120 ? 45 : -45) : (b.x + 120) / 2, b.own && b.own.team === 1 ? Math.min(GY1 - 60, b.y + 50) : Math.max(GY0 + 60, b.y - 60), speedOf(o) * 0.85);
    });
    const gkMove = (gk) => moveTo(gk, Math.max(120 - GW / 2 + 6, Math.min(120 + GW / 2 - 6, b.x)), gk.y, speedOf(gk)); gkMove(S.gk0); gkMove(S.gk1);
  }
  // ---------------------------------------------------------------- le mani dei Colossi
  function hands() {
    if (S.o.hands === false) return;
    if (--S.nextHand <= 0) {
      S.nextHand = (S.o.handRate || 420) + Math.random() * 180;
      // dove: preferibilmente vicino al pallone, mai dentro le aree
      const y = Math.max(GY0 + 70, Math.min(GY1 - 70, S.ball.y + (Math.random() - 0.5) * 120)), x = XL + 26 + Math.random() * (XR - XL - 52);
      S.hands.push({ x, y, rx: 26, ry: 18, st: "warn", t: 110, side: Math.random() < 0.5 ? -1 : 1 }); snd.warn();
    }
    S.hands.forEach((hd) => {
      hd.t--;
      if (hd.st === "warn" && hd.t <= 0) {
        hd.st = "down"; hd.t = S.o.friendly ? 260 : 330; S.shake = 14; snd.hand(); S.handsN++;
        pop(S.o.friendly ? "UNA MANO AMICA!" : "TUM!", hd.x, hd.y - 26, S.o.friendly ? "#7ae0a0" : "#ff8a6a");
        all().forEach((p) => { const dx = p.x - hd.x, dy = p.y - hd.y; if ((dx / hd.rx) ** 2 + (dy / hd.ry) ** 2 < 1.2) { const d = Math.hypot(dx, dy) || 1; p.x = hd.x + dx / d * (hd.rx + 8); p.y = hd.y + dy / d * (hd.ry + 8); if (!p.gk) p.stun = 40; } });
        const b = S.ball; if (!b.own && ((b.x - hd.x) / hd.rx) ** 2 + ((b.y - hd.y) / hd.ry) ** 2 < 1) { b.vy = -3; b.vx = (Math.random() - 0.5) * 3; }
      } else if (hd.st === "down" && hd.t <= 0) { hd.st = "up"; hd.t = 30; }
    });
    S.hands = S.hands.filter((hd) => !(hd.st === "up" && hd.t <= 0));
    all().forEach((p) => { if (p.stun > 0) p.stun--; });
  }
  function physics() {
    const b = S.ball;
    if (b.cd > 0) b.cd--;
    if (b.own) {
      const p = b.own, a = p.dir == null ? (p.team === 0 ? -Math.PI / 2 : Math.PI / 2) : p.dir;
      b.x = p.x + Math.cos(a) * 7; b.y = p.y + 3 + Math.sin(a) * 7; b.vx = b.vy = 0;
      if (stunned(p)) { b.own = null; b.vx = (Math.random() - 0.5) * 2; b.vy = (Math.random() - 0.5) * 2; b.cd = 8; return; }
      all().forEach((q) => { if (q.team !== p.team && !q.gk && !stunned(q) && (q.tk | 0) <= 0 && Math.hypot(q.x - b.x, q.y - b.y) < 9) { const pr = q.team === 0 ? 0.55 : 0.22 * (S.o.hard ? 1.35 : 1); if (Math.random() < pr) { b.own = q; b.cd = 16; pop("RUBATA!", q.x, q.y - 12, "#e8e2d4"); } q.tk = 24; } });
      all().forEach((q) => { if (q.tk > 0) q.tk--; });
      if (p.gk) { const to = p.team === 0 ? (Math.random() < 0.5 ? S.hero : S.mate) : S.opp[(Math.random() * 2) | 0]; if (++p.hold > 30) { p.hold = 0; passTo(p, to); } }
      return;
    }
    if (S.o.wind) b.vx += Math.sin(S.t / 90) * 0.02;
    b.x += b.vx; b.y += b.vy; b.vx *= 0.979; b.vy *= 0.979;
    // le mani appoggiate: il pallone ci rimbalza (nella variante finale, verso la porta avversaria)
    S.hands.forEach((hd) => { if (hd.st !== "down") return; const dx = b.x - hd.x, dy = b.y - hd.y; if ((dx / (hd.rx + 3)) ** 2 + (dy / (hd.ry + 3)) ** 2 < 1) { const d = Math.hypot(dx, dy) || 1, sp = Math.max(2.5, Math.hypot(b.vx, b.vy)); if (S.o.friendly) { const ang = Math.atan2(GY0 - b.y, 120 - b.x); b.vx = Math.cos(ang) * (sp + 1.5); b.vy = Math.sin(ang) * (sp + 1.5); pop("SPINTA!", b.x, b.y - 10, "#7ae0a0"); } else { b.vx = dx / d * sp * 0.8; b.vy = dy / d * sp * 0.8; } b.x = hd.x + dx / d * (hd.rx + 4); b.y = hd.y + dy / d * (hd.ry + 4); b.cd = 6; } });
    // giù dal muro: rimessa per chi non l'ha toccata per ultimo
    if (b.x < XL - 2 || b.x > XR + 2) {
      const lastTeam = b.last ? b.last.team : 1, team = lastTeam === 0 ? 1 : 0, side = b.x < XL ? XL + 4 : XR - 4;
      const takers = team === 0 ? [S.hero, S.mate] : S.opp, q = takers.reduce((a, c) => (Math.hypot(c.x - side, c.y - b.y) < Math.hypot(a.x - side, a.y - b.y) ? c : a));
      q.x = side; q.y = Math.max(GY0 + 30, Math.min(GY1 - 30, b.y)); q.stun = 0; b.own = q; b.cd = 20; S.outs++; snd.out();
      S.flash = { txt: "GIÙ DAL MURO!", sub: team === 0 ? "rimessa nostra" : "rimessa loro", t: 60 }; return;
    }
    const inGoal = Math.abs(b.x - 120) < GW / 2;
    if (b.y < GY0) { if (inGoal) { if (keeperSave(S.gk1, b)) return; return goal(0); } b.y = GY0; b.vy = Math.abs(b.vy) * 0.7; }
    if (b.y > GY1) { if (inGoal) { if (keeperSave(S.gk0, b)) return; return goal(1); } b.y = GY1; b.vy = -Math.abs(b.vy) * 0.7; }
    if (b.cd <= 0) {
      let best = null, bd = 9e9;
      all().forEach((q) => { if (stunned(q)) return; const d = Math.hypot(q.x - b.x, q.y - b.y), sp = Math.hypot(b.vx, b.vy), r = q.gk ? 11 : (sp > 4.5 && q !== b.passTo ? 6 : 9); if (d < r && d < bd) { best = q; bd = d; } });
      if (best) { b.own = best; b.passTo = null; best.hold = 0; if (best.gk && b.shot != null && b.shot !== best.team && Math.hypot(b.vx, b.vy) > 3) { snd.save(); pop("PARATA!", best.x, best.y - 12, "#7ac8ff"); } }
    }
  }
  function keeperSave(gk, b) { const sp = Math.hypot(b.vx, b.vy); if (Math.abs(gk.x - b.x) < 12 && Math.random() < (sp > 6.5 ? 0.42 : 0.72)) { b.own = gk; gk.hold = 0; b.cd = 10; snd.save(); pop("PARATA!", gk.x, gk.y + (gk.team === 1 ? 16 : -10), "#7ac8ff"); return true; } return false; }
  function goal(team) {
    if (team === 0) { S.a++; S.flash = { txt: "GOL!", sub: "", t: 70 }; snd.goal(); S.recap.push(`gol nel ${S.half + 1}° tempo`); kickoff(1); }
    else { S.b++; S.flash = { txt: "GOL LORO", sub: "", t: 60 }; snd.save(); kickoff(0); }
    hud();
  }
  // ---------------------------------------------------------------- disegno
  function person(g, p, col, skin, hair, label, own) {
    const st = stunned(p);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(p.x, p.y + 7, 7, 3, 0, 0, 7); g.fill();
    g.fillStyle = col; g.strokeStyle = "#1a1a1a"; g.lineWidth = 1.2; g.beginPath(); g.arc(p.x, p.y + 1, 6, 0, 7); g.fill(); g.stroke();
    g.fillStyle = skin || "#e0b48a"; g.beginPath(); g.arc(p.x, p.y - 6, 4.5, 0, 7); g.fill(); g.stroke();
    if (hair) { g.fillStyle = hair; g.beginPath(); g.arc(p.x, p.y - 7.5, 4.5, Math.PI, 0); g.fill(); }
    if (own) { g.strokeStyle = "#e8c46a"; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y + 1, 9, 0, 7); g.stroke(); }
    if (st) { g.fillStyle = "#ffd36b"; g.font = "8px serif"; g.fillText("✦", p.x - 3 + Math.sin(S.t / 3) * 3, p.y - 14); }
    if (label) { g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#f2ead8"; g.fillText(label, p.x, p.y + 16); g.textAlign = "left"; }
  }
  function hand(g, hd) {
    if (hd.st === "warn") { const k = 1 - hd.t / 110; g.fillStyle = `rgba(0,0,0,${0.15 + k * 0.4})`; g.beginPath(); g.ellipse(hd.x, hd.y, hd.rx * (0.6 + k * 0.4), hd.ry * (0.6 + k * 0.4), 0, 0, 7); g.fill(); if ((S.t >> 3) % 2) { g.strokeStyle = "rgba(255,120,90,.8)"; g.lineWidth = 1.5; g.beginPath(); g.ellipse(hd.x, hd.y, hd.rx, hd.ry, 0, 0, 7); g.stroke(); } return; }
    const lift = hd.st === "up" ? (30 - hd.t) * 2 : 0, x = hd.x, y = hd.y - lift, col = S.o.friendly ? "#8a9a8a" : "#8a8278", dk = S.o.friendly ? "#5a6a5a" : "#5a5248";
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(hd.x, hd.y + 4, hd.rx + 2, hd.ry, 0, 0, 7); g.fill();
    // il palmo e le dita di pietra, che arrivano da fuori (lato destro o sinistro)
    g.fillStyle = col; g.strokeStyle = dk; g.lineWidth = 1.5;
    g.beginPath(); g.ellipse(x, y, hd.rx * 0.75, hd.ry * 0.85, 0, 0, 7); g.fill(); g.stroke();
    for (let i = 0; i < 4; i++) { const fx = x - 15 + i * 10; g.beginPath(); g.ellipse(fx, y - hd.ry * 0.9, 4, 8, 0, 0, 7); g.fill(); g.stroke(); }
    g.beginPath(); g.ellipse(x + hd.side * hd.rx * 0.9, y + 2, 9, 5, hd.side * 0.5, 0, 7); g.fill(); g.stroke();
    g.fillStyle = dk; for (let i = 0; i < 3; i++) g.fillRect(x - 10 + i * 8, y - 2 + (i % 2) * 4, 5, 1);
    // il braccio che scende dal bordo
    g.fillStyle = col; const ex = hd.side > 0 ? XR + 30 : XL - 30; g.beginPath(); g.moveTo(x + hd.side * 10, y - 8); g.lineTo(ex, y - 26); g.lineTo(ex, y + 16); g.lineTo(x + hd.side * 10, y + 10); g.closePath(); g.fill(); g.stroke();
    if (S.o.friendly) { g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(x, y, 2, x, y, 30); gr.addColorStop(0, "rgba(120,240,160,.35)"); gr.addColorStop(1, "rgba(120,240,160,0)"); g.fillStyle = gr; g.fillRect(x - 30, y - 30, 60, 60); g.restore(); }
  }
  function draw() {
    const g = S.g, b = S.ball, night = !!S.o.night;
    const target = Math.max(0, Math.min(WH - VH, b.y - VH * 0.5)); S.cam += (target - S.cam) * 0.12; const cy = S.cam, sh = S.shake > 0 ? (Math.random() - 0.5) * S.shake * 0.5 : 0; if (S.shake > 0) S.shake--;
    // sfondo: a sinistra la città giù in basso, a destra la terra di fuori (parallasse)
    g.fillStyle = night ? "#0e1220" : "#3a4a6a"; g.fillRect(0, 0, W, VH);
    for (let i = 0; i < 18; i++) { const y = ((i * 40 - cy * 0.4) % (VH + 40) + VH + 40) % (VH + 40) - 20; g.fillStyle = night ? "#1a1e2e" : ["#7a5a4a", "#8a6a5a", "#6a4a3a"][i % 3]; g.fillRect(2 + (i % 3) * 6, y, 26, 18); g.fillStyle = night ? "#ffd98a" : "#ffe9b0"; if ((i * 7) % 3 === 0) g.fillRect(8 + (i % 3) * 6, y + 6, 3, 3); }
    for (let i = 0; i < 14; i++) { const y = ((i * 55 - cy * 0.35) % (VH + 60) + VH + 60) % (VH + 60) - 30; g.fillStyle = night ? "#142018" : "#4a6a3a"; g.fillRect(XR + 12, y, 40, 30); g.fillStyle = night ? "#1e2a22" : "#5f7f45"; for (let k = 0; k < 4; k++) g.fillRect(XR + 14 + k * 9, y + 4 + (k % 2) * 8, 2, 8); }
    // un Colosso lontano che guarda il campo
    const cx2 = XR + 30 + Math.sin(S.t / 200) * 4, cyy = 120 - cy * 0.2; g.fillStyle = night ? "rgba(60,60,70,.6)" : "rgba(90,85,80,.6)"; g.fillRect(cx2 - 10, cyy, 20, 60); g.beginPath(); g.arc(cx2, cyy - 6, 10, 0, 7); g.fill(); g.fillStyle = "rgba(255,200,120,.6)"; g.fillRect(cx2 - 5, cyy - 8, 3, 2); g.fillRect(cx2 + 2, cyy - 8, 3, 2);
    g.save(); g.translate(sh, -cy);
    // il camminamento: lastre di pietra, merli ai lati
    g.fillStyle = night ? "#4a4a52" : "#8a8478"; g.fillRect(XL - 10, 0, XR - XL + 20, WH);
    for (let y = 0; y < WH; y += 16) for (let x = XL - 10; x < XR + 10; x += 24) { g.fillStyle = (((x + y) / 8) | 0) % 2 ? (night ? "#52525a" : "#958e80") : (night ? "#46464e" : "#827c70"); g.fillRect(x + ((y / 16) % 2) * 12, y, 23, 15); }
    for (let y = 0; y < WH; y += 22) { g.fillStyle = night ? "#3a3a42" : "#6a6458"; g.fillRect(XL - 12, y, 8, 12); g.fillRect(XR + 4, y, 8, 12); }
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.5; g.strokeRect(XL, GY0, XR - XL, GY1 - GY0); g.beginPath(); g.moveTo(XL, (GY0 + GY1) / 2); g.lineTo(XR, (GY0 + GY1) / 2); g.stroke(); g.beginPath(); g.arc(120, (GY0 + GY1) / 2, 22, 0, 7); g.stroke();
    g.strokeRect(120 - 44, GY0, 88, 36); g.strokeRect(120 - 44, GY1 - 36, 88, 36);
    // stendardi della Guardia
    for (let y = 70; y < WH; y += 140) { g.fillStyle = "#a8322a"; g.fillRect(XL - 10, y, 6, 18); g.fillRect(XR + 4, y + 70 > WH ? y : y + 70, 6, 18); }
    // porte
    g.fillStyle = "#e8e2d4"; g.fillRect(120 - GW / 2, GY0 - 10, GW, 10); g.fillRect(120 - GW / 2, GY1, GW, 10); g.strokeStyle = "#2a2a2a"; g.lineWidth = 1.5; g.strokeRect(120 - GW / 2, GY0 - 10, GW, 10); g.strokeRect(120 - GW / 2, GY1, GW, 10);
    S.hands.forEach((hd) => { if (hd.st === "warn") hand(g, hd); });
    const O = S.o, hc = O.hero || {}, mc = O.mate || {}, kit = (O.opp && O.opp.kit) || "#2a2a33", names = (O.opp && O.opp.names) || ["", ""];
    const list = [[S.gk0, "#e8c46a", hc.skin, "#2b1d14", ""], [S.mate, mc.shirt || "#2c5f8a", mc.skin, mc.hair, (mc.name || "").split(" ")[0]], [S.hero, hc.shirt || "#a8322a", hc.skin, hc.hair, hc.name || "Tu"], [S.opp[0], kit, "#d9b38c", "#1a1a1a", names[0]], [S.opp[1], kit, "#c68642", "#3a2a1a", names[1]], [S.gk1, "#5a5a62", "#b07a52", "#1a1a22", ""]];
    list.sort((p, q) => p[0].y - q[0].y).forEach(([p, c, s2, hr, lb]) => person(g, p, c, s2, hr, lb, b.own === p));
    S.hands.forEach((hd) => { if (hd.st !== "warn") hand(g, hd); });
    g.fillStyle = "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1.2; g.beginPath(); g.arc(b.x, b.y, 3.5, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#111"; g.beginPath(); g.arc(b.x, b.y, 1.2, 0, 7); g.fill();
    if (S.run) { const hx = S.hero.x, hy = S.hero.y - 20 + Math.sin(S.t / 6) * 1.5; g.fillStyle = "#ffd23f"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx - 6, hy - 7); g.lineTo(hx + 6, hy - 7); g.lineTo(hx, hy); g.closePath(); g.fill(); g.stroke(); }
    S.fx = S.fx.filter((f) => f.t > 0); S.fx.forEach((f) => { f.t--; f.y -= 0.4; g.font = "900 11px Georgia, serif"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#111"; g.strokeText(f.txt, f.x, f.y); g.fillStyle = f.col; g.fillText(f.txt, f.x, f.y); g.textAlign = "left"; });
    g.restore();
    // indicatori fuori schermo: il Campione e le ombre delle mani
    const hy0 = S.hero.y - cy; if (hy0 < 6 || hy0 > VH - 6) { const yy = hy0 < 6 ? 22 : VH - 8; g.fillStyle = "#ffd23f"; g.beginPath(); if (hy0 < 6) { g.moveTo(S.hero.x - 6, yy); g.lineTo(S.hero.x + 6, yy); g.lineTo(S.hero.x, yy - 8); } else { g.moveTo(S.hero.x - 6, yy); g.lineTo(S.hero.x + 6, yy); g.lineTo(S.hero.x, yy + 6); } g.fill(); }
    if (night) { const gr = g.createRadialGradient(S.hero.x, S.hero.y - cy, 50, S.hero.x, S.hero.y - cy, 220); gr.addColorStop(0, "rgba(5,8,20,0)"); gr.addColorStop(1, "rgba(5,8,20,.65)"); g.fillStyle = gr; g.fillRect(0, 0, W, VH); }
    if (S.ptr && S.run) { const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay, jl = Math.hypot(jx, jy), k = jl > 24 ? 24 / jl : 1; g.fillStyle = "rgba(255,255,255,.12)"; g.beginPath(); g.arc(S.ptr.ax, S.ptr.ay, 26, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 2; g.beginPath(); g.arc(S.ptr.ax, S.ptr.ay, 26, 0, 7); g.stroke(); g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.arc(S.ptr.ax + jx * k, S.ptr.ay + jy * k, 11, 0, 7); g.fill(); }
    if (S.flash && S.flash.t > 0) { S.flash.t--; g.fillStyle = "rgba(10,12,18,.75)"; g.fillRect(0, VH / 2 - 24, W, 44); g.fillStyle = "#e8c46a"; g.font = "900 22px Georgia, serif"; g.textAlign = "center"; g.fillText(S.flash.txt, W / 2, VH / 2 + 2); if (S.flash.sub) { g.font = "bold 10px sans-serif"; g.fillStyle = "#e8e2d4"; g.fillText(S.flash.sub, W / 2, VH / 2 + 15); } g.textAlign = "left"; }
    g.fillStyle = "rgba(10,12,18,.8)"; g.fillRect(0, 0, W, 15); g.fillStyle = "#e8c46a"; g.font = "bold 9px sans-serif"; g.fillText(`${S.half === 0 ? "1°" : "2°"} tempo · ${Math.max(0, Math.ceil((S.dur - S.t) / 60))}s`, 5, 11);
    g.textAlign = "right"; g.fillStyle = S.hands.some((h) => h.st === "warn") ? "#ff8a6a" : "#e8e2d4"; g.fillText(S.hands.some((h) => h.st === "warn") ? "⚠ UNA MANO STA SCENDENDO" : S.o.hands === false ? "il muro è quieto" : `mani: ${S.handsN}`, W - 5, 11); g.textAlign = "left";
  }
  function hud() { if (!S || !S.el) return; S.el.querySelector(".n0").textContent = S.o.us || "Guardia del Muro"; S.el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; S.el.querySelector(".n1").textContent = (S.o.opp && S.o.opp.name) || "Avversari"; }
  function endHalf() {
    S.run = false; snd.whistle();
    if (S.half === 0) { S.half = 1; const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>Fine del primo tempo · ${S.a} – ${S.b}</h3><p>${esc(S.o.halftime || "Il vento cambia direzione. Laggiù, oltre il muro, i Colossi si sono fermati a guardare.")}</p></div>`; const bt = document.createElement("button"); bt.type = "button"; bt.className = "tira"; bt.textContent = "Secondo tempo ▸"; bt.onclick = () => { ov.remove(); S.t = 0; S.hands = []; S.nextHand = 300; kickoff(1); S.run = true; snd.whistle(); }; ov.appendChild(bt); S.el.appendChild(ov); return; }
    if (S.a === S.b && !S.extra) { S.extra = true; S.t = 0; S.dur = 20 * 60; S.flash = { txt: "SUPPLEMENTARI!", sub: "chi segna vince", t: 80 }; kickoff(0); S.run = true; return; }
    finish();
  }
  function finish(quit) {
    if (!S || S.over) return; S.over = true; S.run = false;
    const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, recap: S.recap.length ? ` <span style="color:var(--dim)">(${S.recap.slice(0, 5).join(", ")} · palloni giù dal muro: ${S.outs})</span>` : "" };
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${quit ? "Partita abbandonata" : res.win ? "VITTORIA SUL MURO!" : S.a === S.b ? "Pareggio" : "Sconfitta"}</h3><p style="font-size:22px;font-weight:900">${S.a} – ${S.b}</p><p>Tiri ${S.shots} · Passaggi ${S.pass} · Mani dei Colossi ${S.handsN} · Palloni giù dal muro ${S.outs}</p></div>`;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "tira"; bt.textContent = "Continua ▸"; bt.onclick = () => close(res); ov.appendChild(bt); S.el.appendChild(ov);
  }
  function close(res) { const s = S; S = null; cancelAnimationFrame(s.raf); window.removeEventListener("keydown", s.kd, true); window.removeEventListener("keyup", s.ku, true); s.el.remove(); try { s.o.onDone(res); } catch (e) { console.error(e); } }
  function loop() {
    if (!S) return;
    if (S.run) { S.t++; control(); ai(); hands(); physics(); [S.hero, S.mate, ...S.opp].forEach((p) => { p.x = Math.max(XL + 4, Math.min(XR - 4, p.x)); p.y = Math.max(GY0 + 4, Math.min(GY1 - 4, p.y)); }); if (S.t >= S.dur || (S.extra && S.a !== S.b)) endHalf(); }
    draw(); S.raf = requestAnimationFrame(loop);
  }
  function start(o) {
    if (S) return false;
    css(); S = newState(o || {});
    const el = document.createElement("div"); el.id = "muPM";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${VH * 2}"></canvas><div class="pad"><button type="button" class="tira">TIRA</button><button type="button" class="passa">PASSA</button><button type="button" class="esci">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    const cv = el.querySelector("canvas"); S.g = cv.getContext("2d"); S.g.scale(2, 2);
    const toLocal = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * VH }; };
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const q = toLocal(e); S.ptr = { ax: q.x, ay: q.y, x: q.x, y: q.y }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (S && S.ptr) { const q = toLocal(e); S.ptr.x = q.x; S.ptr.y = q.y; } });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => cv.addEventListener(ev, () => { if (S) S.ptr = null; }));
    el.querySelector(".tira").addEventListener("pointerdown", (e) => { e.preventDefault(); act("tira"); });
    el.querySelector(".passa").addEventListener("pointerdown", (e) => { e.preventDefault(); act("passa"); });
    el.querySelector(".esci").onclick = () => { if (S && !S.over) finish(true); };
    S.kd = (e) => { if (!S) return; if (/^Arrow/.test(e.key)) { S.keys[e.key] = true; e.preventDefault(); e.stopPropagation(); } else if (e.key === " " || e.key === "z") { act("tira"); e.preventDefault(); e.stopPropagation(); } else if (e.key === "x") { act("passa"); e.preventDefault(); e.stopPropagation(); } };
    S.ku = (e) => { if (S && /^Arrow/.test(e.key)) { S.keys[e.key] = false; e.stopPropagation(); } };
    window.addEventListener("keydown", S.kd, true); window.addEventListener("keyup", S.ku, true);
    kickoff(0); hud();
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${esc(o.title || "Partita sul Muro")}</h3><p>Si gioca in cima alle mura: il campo è <b>lungo e stretto</b>, la telecamera segue il pallone. Attacchi verso l'alto.</p><p><b>Levetta</b>: appoggia il dito dove vuoi sul campo e trascinalo. Il Campione ha la freccia gialla. <b>TIRA</b> (senza palla: scatto), <b>PASSA</b> (senza palla: chiami il compagno).</p><p>${o.hands === false ? "Stasera i Colossi sono lontani." : o.friendly ? "Le <b>mani dei Colossi</b> stavolta aiutano: se il pallone le colpisce, schizza verso la porta in alto." : "Quando vedi un'<b>ombra</b> sul campo, spostati: un <b>Colosso appoggia la mano</b> sul muro, e la mano resta lì come un ostacolo."} Se il pallone <b>cade giù dal muro</b>, è rimessa per l'altra squadra.</p></div>`;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "tira"; bt.textContent = "Fischio d'inizio ▸"; bt.onclick = () => { ov.remove(); S.run = true; snd.whistle(); }; ov.appendChild(bt); el.appendChild(ov);
    loop(); return true;
  }
  window.__muroPartita = { start, get state() { return S; }, _act: act, _finish: () => finish(false) };
})();
