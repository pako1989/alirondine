// js/viva.js - «PARTITA VIVA» · calcio con fisica vera, costruito con Phaser 3 (js/vendor/phaser.min.js, caricato solo quando serve).
// Campo a bordi (stile calcetto): la palla ha inerzia, rimbalza su sponde e pali, il portiere para in base a DIF e potenza del tiro. Si gioca con i personaggi della Squadra dei Sogni.
// La squadra ha n giocatori IN TOTALE, portiere compreso (5 = 4 + portiere, 3 = 2 + portiere): la carta Portiere va in porta, altrimenti quella con più DIF.
// Comandi: joystick (js/stick.js) + TIRA (tieni premuto per caricare, la direzione del joystick mira) + PASSA (senza palla: CAMBIA giocatore) + SCATTO (fiato).
// Con la palla: TIRA tira, PASSA passa al compagno nella direzione del joystick. Senza palla: TIRA = scivolata, PASSA = cambia giocatore.
// Opzioni: team [id carta ×n] (default: la Squadra dei Sogni), foes [carte], n (3|5, default 5), level (1-5), title, oppName, color, bonus {at,df,te}, tutorial (false = niente), onDone({win, level, goals, conceded, stars}). Richiede js/mini.js e js/stick.js.
// Test: window.__viva.state { sc (scena), press(k, down), stick(x, y), sim(frames), finish(win), auto(on) }.
(function () {
  "use strict";
  if (window.__viva) return;
  const ZOOM = 1.3, M = window.__mini, W = 720, H = 400, VW = 380, VH = 240, R = 9, GH = 50; // campo, vista, raggio giocatore, mezza apertura della porta
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const S = () => window.__sogni;
  const LV = ["", "Amichevole", "Derby di quartiere", "Partita vera", "Big match", "Finale dei Sogni"];
  let ui = null, game = null, OPT = {}, ST = null, tutC = null;
  function loadPhaser(ok, ko) {
    if (window.Phaser) return ok();
    const s = document.createElement("script"); s.src = "js/vendor/phaser.min.js?v=1"; s.onload = () => (window.Phaser ? ok() : ko()); s.onerror = ko; document.head.appendChild(s);
  }
  // ------------------------------------------------------------ squadre
  const dfOf = (c) => safe(() => S().eff(c).df, c.df || 0);
  function withKeeper(cards) { const gk = cards.find((c) => c.role === "P") || cards.slice().sort((a, b) => dfOf(b) - dfOf(a))[0]; return cards.filter((c) => c !== gk).concat([gk]); }
  function myCards(n, ids) { return S().squad(n, ids).all; }
  function myCardsOld(n, ids) {
    const s = S(); if (!s) return [];
    const r = safe(() => s._load(), { own: [], team: [] }), tc = (ids || r.team).map((id) => s.BY[id]).filter(Boolean), pick = [];
    const gk = tc.find((c) => c.role === "P"); if (gk) pick.push(gk);
    tc.forEach((c) => { if (pick.length < n && !pick.includes(c)) pick.push(c); });
    (r.own || []).map((id) => s.BY[id]).filter(Boolean).sort((a, b) => (b.at + b.df + b.te) - (a.at + a.df + a.te)).forEach((c) => { if (pick.length < n && !pick.includes(c)) pick.push(c); });
    const pool = s.CARDS.slice().sort((a, b) => (a.at + a.df + a.te) - (b.at + b.df + b.te)); while (pick.length < n) pick.push(pool[(pick.length * 11) % pool.length]);
    return withKeeper(pick.slice(0, n));
  }
  function foeCards(n, rand) {
    const all = S().CARDS, ss = [...new Set(all.map((c) => c.saga))], th = ss[Math.floor(rand() * ss.length)], pool = all.filter((c) => c.saga === th), p = pool.length >= n ? pool : all, out = [], used = {};
    for (let i = 0; i < n; i++) { let c; for (let k = 0; k < 20; k++) { c = p[Math.floor(rand() * p.length)]; if (!used[c.id]) break; } used[c.id] = 1; out.push(c); }
    return { cards: withKeeper(out), name: safe(() => S().SAGHE[th][1], "I Rivali") };
  }
  const HOME5 = [[0.17, 0.28], [0.17, 0.72], [0.3, 0.5], [0.43, 0.5]], HOME3 = [[0.22, 0.32], [0.42, 0.62]];
  function mkPlayer(card, team, i, nf, m, bonus, home) {
    const e = safe(() => S().eff(card), card), b = team ? { at: 0, df: 0, te: 0 } : bonus || {}, at = e.at * m + (b.at | 0) * 6, df = e.df * m + (b.df | 0) * 6, te = e.te * m + (b.te | 0) * 6;
    const H0 = home || (nf === 4 ? HOME5 : HOME3)[i] || [0.1, 0.5], hx = team ? W - H0[0] * W : H0[0] * W;
    const role = card.role === "P" ? "P" : card.role === "B" ? "A" : card.role || "C";
    return { id: card.id, name: String(safe(() => S().name(card.id), card.id)).split(/[ ,]/)[0], card, team, i, role, x: hx, y: H0[1] * H, hx, hy: H0[1] * H, vx: 0, vy: 0, fx: team ? -1 : 1, fy: 0, spd: 1.45 + te / 170, pw: 5.4 + at / 40, drib: te, tack: df, kdf: df, stun: 0, slide: 0, keeper: false, hold: 0, cd: 0, sh: 0 };
  }
  function mkKeeper(card, team, m, bonus) { const p = mkPlayer(card, team, 0, 4, m, bonus); p.keeper = true; p.role = "P"; p.x = p.hx = team ? W - 16 : 16; p.y = p.hy = H / 2; p.fx = team ? -1 : 1; return p; }
  // ------------------------------------------------------------ scena Phaser
  function makeScene(cfg) {
    const PH = window.Phaser;
    return class Viva extends PH.Scene {
      constructor() { super("viva"); }
      create() {
        const sc = this; sc.cfg = cfg; window.__viva.scene = sc; sc.over = false; sc.auto = false; sc.t = 0; sc.score = [0, 0]; sc.half = 0; sc.extra = false; sc.frame = 0; sc.freeze = 0; sc.shots = [0, 0]; sc.charge = 0; sc.hudT = 0; sc.banner = null; sc.stam = 100;
        sc.keys = { shoot: false, pass: false, sprint: false }; sc.stk = { x: 0, y: 0, m: 0 }; sc.rand = Math.random; sc.cm = "";
        const nf = cfg.n - 1, m0 = 1, mF = 1 + (cfg.level - 3) * 0.05;
        const lay = (cs) => safe(() => S().lineup(cs), cs.map((c, i) => ({ c, fx: [0.43, 0.3, 0.17, 0.17][i] || 0.2, fy: i % 2 ? 0.7 : 0.3 })));
        sc.P = lay(cfg.mine.slice(0, nf)).map((q, i) => mkPlayer(q.c, 0, i, nf, m0, cfg.bonus, [q.fx * 0.92, q.fy])).concat([mkKeeper(cfg.mine[nf], 0, m0, cfg.bonus)]);
        sc.Q = lay(cfg.foes.slice(0, nf)).map((q, i) => mkPlayer(q.c, 1, i, nf, mF, null, [q.fx * 0.92, q.fy])).concat([mkKeeper(cfg.foes[nf], 1, mF)]);
        sc.all = sc.P.concat(sc.Q); sc.nf = nf; sc.ctl = sc.P[0]; sc.ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, owner: null, cool: 0, kick: 0, sp: 0 };
        sc.drawField(); sc.gfx = sc.add.graphics().setDepth(5); sc.top = sc.add.graphics().setDepth(30).setScrollFactor(0);
        sc.msg = sc.add.text(VW / 2, 70, "", { fontFamily: "system-ui", fontSize: "28px", fontStyle: "900", color: "#fde047", stroke: "#000", strokeThickness: 5, align: "center" }).setOrigin(0.5).setDepth(40).setScrollFactor(0);
        sc.cams = sc.cameras.main; sc.cams.setBounds(0, 0, W, H); sc.cams.setZoom(ZOOM); sc.cams.scrollX = W / 2 - VW / 2; sc.cams.scrollY = H / 2 - VH / 2;
        // ritratti delle carte come teste
        sc.all.forEach((p) => { const u = safe(() => S().port(p.id), null); if (!u) return; const im = new Image(); im.onload = () => { if (!sc.sys || !sc.sys.isActive()) return; const k = "pt_" + p.id + "_" + p.team; if (!sc.textures.exists(k)) sc.textures.addImage(k, im); p.im = sc.add.image(p.x, p.y, k).setDisplaySize(15, 15).setDepth(6); }; im.src = u; });
        sc.kickoff(0);
        sc.input.keyboard && sc.input.keyboard.on("keydown", (e) => { if (e.code === "Space") sc.keys.shoot = true; if (e.code === "KeyZ") sc.keys.pass = true; });
        sc.input.keyboard && sc.input.keyboard.on("keyup", (e) => { if (e.code === "Space") sc.releaseShoot(); });
      }
      drawField() {
        const sc = this, g = sc.add.graphics().setDepth(0);
        g.fillStyle(0x14532d, 1); g.fillRect(-20, -20, W + 40, H + 40);
        for (let i = 0; i < 12; i++) { g.fillStyle(i % 2 ? 0x166534 : 0x15803d, 1); g.fillRect(i * (W / 12), 0, W / 12, H); }
        g.lineStyle(2, 0xffffff, 0.8); g.strokeRect(2, 2, W - 4, H - 4); g.lineBetween(W / 2, 2, W / 2, H - 2); g.strokeCircle(W / 2, H / 2, 46);
        g.strokeRect(2, H / 2 - 80, 90, 160); g.strokeRect(W - 92, H / 2 - 80, 90, 160); g.strokeRect(2, H / 2 - 36, 34, 72); g.strokeRect(W - 36, H / 2 - 36, 34, 72);
        g.fillStyle(0xffffff, 0.9); g.fillCircle(W / 2, H / 2, 3);
        g.fillStyle(0x0f172a, 1); g.fillRect(-14, H / 2 - GH, 14, GH * 2); g.fillRect(W, H / 2 - GH, 14, GH * 2); g.lineStyle(3, 0xe5e7eb, 1); g.strokeRect(-14, H / 2 - GH, 14, GH * 2); g.strokeRect(W, H / 2 - GH, 14, GH * 2);
        g.fillStyle(0xe5e7eb, 1); [[0, H / 2 - GH], [0, H / 2 + GH], [W, H / 2 - GH], [W, H / 2 + GH]].forEach(([x, y]) => g.fillCircle(x, y, 4));
        // tribune e cartelloni a bordo campo
        g.fillStyle(0x1e293b, 1); g.fillRect(-20, -20, W + 40, 18); g.fillRect(-20, H + 2, W + 40, 18);
        (cfg.ads || [["RONDINE FC", 0xc8301e], ["PORTO LUCE", 0x1e6ac8], ["TRATTORIA PINA", 0xc83a7a], ["RADIO 98.6", 0x8a3ac8]]).forEach((a, i) => { for (const y of [-16, H + 4]) { g.fillStyle(a[1], 1); g.fillRect(40 + i * 170, y, 120, 12); } });
      }
      kickoff(team) {
        const sc = this; sc.all.forEach((p) => { p.x = p.hx + (p.keeper ? 0 : (p.team ? -1 : 1) * 0); p.y = p.hy; p.vx = p.vy = 0; p.stun = 0; p.slide = 0; p.hold = 0; p.fx = p.team ? -1 : 1; p.fy = 0; });
        const b = sc.ball, k = (team ? sc.Q : sc.P)[0]; b.x = W / 2; b.y = H / 2; b.vx = b.vy = 0; b.cool = 10; b.kick = team; k.x = W / 2 - (team ? -14 : 14); k.y = H / 2; b.owner = k; k.hold = 0; if (!team) sc.ctl = k;
      }
      mates(p) { return p.team ? this.Q : this.P; }
      foes(p) { return p.team ? this.P : this.Q; }
      goalX(team) { return team ? 0 : W; }
      // ---- azioni
      shoot(p, ch, aimY) {
        const sc = this, b = sc.ball; if (b.owner !== p) return; const gx = sc.goalX(p.team), ty = clamp(aimY, H / 2 - GH + 8, H / 2 + GH - 8), dx = gx - p.x, dy = ty - p.y, l = Math.hypot(dx, dy) || 1;
        const sp = p.pw * (0.7 + 0.55 * ch) + 2.4, err = (sc.rand() - 0.5) * (0.22 - Math.min(0.14, p.drib / 700)) * (1.3 - ch * 0.6);
        const c = Math.cos(err), s = Math.sin(err); b.vx = ((dx / l) * c - (dy / l) * s) * sp; b.vy = ((dx / l) * s + (dy / l) * c) * sp; b.owner = null; b.cool = 14; b.kick = p.team; b.sp = sp; p.hold = 0; sc.shots[p.team]++; p.cd = 10; sc.sfx("shoot");
      }
      pass(p, to) {
        const sc = this, b = sc.ball; if (b.owner !== p || !to) return; const dx = to.x + to.vx * 9 - p.x, dy = to.y + to.vy * 9 - p.y, l = Math.hypot(dx, dy) || 1, sp = 4.6 + Math.min(2.6, l / 80);
        b.vx = (dx / l) * sp; b.vy = (dy / l) * sp; b.owner = null; b.cool = 12; b.kick = p.team; b.to = to; b.sp = sp * 0.5; p.hold = 0; p.cd = 8;
      }
      bestMate(p, dx, dy) {
        let best = null, bs = -1e9; this.mates(p).forEach((m) => { if (m === p || m.keeper) return; const ex = m.x - p.x, ey = m.y - p.y, l = Math.hypot(ex, ey) || 1; let s = -l * 0.25; if (dx || dy) s += ((ex / l) * dx + (ey / l) * dy) * 70; else s += (p.team ? -ex : ex) * 0.2; if (this.foes(p).some((o) => !o.keeper && dist(o, m) < 28)) s -= 25; if (s > bs) { bs = s; best = m; } }); return best;
      }
      tackle(p) {
        const sc = this, b = sc.ball, o = b.owner; if (p.cd > 0 || p.stun > 0) return; p.cd = 26;
        if (!o || o.team === p.team || dist(p, o) > 24) { p.slide = 14; const l = Math.hypot(p.fx, p.fy) || 1; p.sx = (p.fx / l) * 4.8; p.sy = (p.fy / l) * 4.8; return; }
        const pr = clamp(0.45 + (p.tack - o.drib) / 220, 0.2, 0.88); if (sc.rand() < pr) { b.owner = p; b.cool = 8; p.hold = 0; o.stun = 22; sc.sfx("tackle"); } else p.stun = 18;
      }
      releaseShoot() { const sc = this; if (!sc.keys.shoot) return; sc.keys.shoot = false; const p = sc.ctl, b = sc.ball; if (b.owner === p && !p.keeper) sc.shoot(p, clamp(sc.charge, 0.05, 1), H / 2 + sc.stk.y * GH); else if (b.owner !== p) sc.tackle(p); sc.charge = 0; }
      // ---- IA
      ai(p) {
        const sc = this, b = sc.ball, mt = sc.mates(p), fo = sc.foes(p), L = sc.cfg.level, atk = (b.owner && b.owner.team === p.team) || (!b.owner && b.kick === p.team), own = b.owner === p, tg = sc.goalX(p.team);
        const out = { x: p.x, y: p.y, s: p.spd * (0.82 + L * 0.04) };
        if (p.keeper) {
          const ex = p.team ? W - 16 : 16; out.x = ex + (p.team ? -1 : 1) * Math.min(24, Math.abs(b.x - ex) / 8); out.y = clamp(b.y * 0.5 + H / 4, H / 2 - GH + 6, H / 2 + GH - 6);
          const toward = p.team ? b.vx > 1.2 : b.vx < -1.2; if (!b.owner && toward && b.kick !== p.team) { const t = (ex - b.x) / (b.vx || 1); if (t > 0 && t < 50) { out.y = clamp(b.y + b.vy * t, H / 2 - GH + 4, H / 2 + GH - 4); out.s = p.spd * 1.8; } }
          if (own) { p.hold++; if (p.hold > 36) sc.pass(p, sc.bestMate(p, p.team ? -1 : 1, 0) || mt.find((x) => !x.keeper)); out.s = 0; }
          return out;
        }
        if (own) {
          const dgx = tg - p.x, dd = Math.hypot(dgx, H / 2 - p.y), pressed = fo.some((o) => !o.keeper && dist(o, p) < 22);
          if (dd < 210 && sc.rand() < 0.04 + L * 0.006) { sc.shoot(p, 0.5 + sc.rand() * 0.5, H / 2 + (sc.rand() - 0.5) * GH * 1.4); return out; }
          if (pressed && sc.rand() < 0.07) { const m = sc.bestMate(p, p.team ? -1 : 1, 0); if (m) { sc.pass(p, m); return out; } }
          let ty = p.y; const bl = fo.filter((o) => !o.keeper && Math.abs(o.x - p.x) < 70 && (p.team ? o.x < p.x : o.x > p.x)); if (bl.length) ty = p.y + (bl[0].y > p.y ? -1 : 1) * 50; else ty = p.y + (H / 2 - p.y) * 0.25;
          out.x = tg; out.y = ty; return out;
        }
        const cand = mt.filter((x) => !x.keeper).sort((a, c) => dist(a, b) - dist(c, b)), chaser = cand[0] === p || (cand[1] === p && !atk && dist(p, b) < 90) || (b.to === p && !b.owner);
        if (chaser) {
          out.x = b.x + b.vx * 6; out.y = b.y + b.vy * 6; out.s = p.spd * (0.95 + L * 0.05);
          if (b.owner && b.owner.team !== p.team && dist(p, b.owner) < 22 && sc.rand() < 0.02 + L * 0.008) sc.tackle(p);
          return out;
        }
        const fw = p.team ? -1 : 1, sh = clamp((b.x - W / 2) * 0.45, -120, 120);
        if (atk) { const o = b.owner || b; out.x = clamp(o.x + fw * (60 + p.i * 26), 40, W - 40); out.y = clamp(p.hy + (o.y - H / 2) * 0.4, 30, H - 30); }
        else { out.x = clamp(p.hx + sh * 0.6, 30, W - 30); out.y = clamp(p.hy + (b.y - H / 2) * 0.35, 30, H - 30); }
        return out;
      }
      move(p, tx, ty, sp) {
        const dx = tx - p.x, dy = ty - p.y, l = Math.hypot(dx, dy); if (l < 3) { p.vx *= 0.7; p.vy *= 0.7; return; }
        const k = Math.min(1, l / 14); p.vx += ((dx / l) * sp * k - p.vx) * 0.22; p.vy += ((dy / l) * sp * k - p.vy) * 0.22;
      }
      // ---- un passo di fisica (1/60 s)
      step() {
        const sc = this, b = sc.ball; if (sc.over) return; sc.frame++;
        if (sc.freeze > 0) { sc.freeze--; if (sc.freeze === 0) { sc.msg.setText(""); if (sc.pendingEnd) return sc.end(); sc.kickoff(sc.lastScorer === 0 ? 1 : 0); } return; }
        sc.t++; const limit = sc.extra ? 30 * 60 : cfg.dur;
        if (sc.t >= limit) { if (sc.score[0] !== sc.score[1] || sc.extra) return sc.end(); sc.extra = true; sc.t = 0; sc.say("GOLDEN GOL: chi segna vince!", 2); }
        // controllo del giocatore
        const ctl = sc.ctl, v = sc.auto ? null : sc.stk, spr = !sc.auto && sc.keys.sprint && sc.stam > 4;
        if (b.owner && b.owner.team === 0 && !b.owner.keeper) sc.ctl = b.owner; else if (sc.t % 10 === 0) { const nb = sc.P.filter((x) => !x.keeper).sort((a, c) => dist(a, b) - dist(c, b))[0]; if (nb && nb !== sc.ctl && dist(nb, b) + 14 < dist(sc.ctl, b)) sc.ctl = nb; }
        if (sc.keys.pass) { sc.keys.pass = false; const p = sc.ctl; if (b.owner === p) sc.pass(p, sc.bestMate(p, v ? v.x : 0, v ? v.y : 0)); else { const arr = sc.P.filter((x) => !x.keeper).sort((a, c) => dist(a, b) - dist(c, b)); const i = arr.indexOf(p); sc.ctl = arr[(i + 1) % arr.length]; } }
        if (sc.keys.shoot && b.owner === sc.ctl) sc.charge = Math.min(1, sc.charge + 1 / 40); else if (!sc.keys.shoot) sc.charge = 0;
        sc.stam = clamp(sc.stam + (spr ? -0.8 : 0.35), 0, 100);
        sc.all.forEach((p) => {
          if (p.cd > 0) p.cd--; if (p.stun > 0) { p.stun--; p.vx *= 0.8; p.vy *= 0.8; p.x += p.vx; p.y += p.vy; return; }
          let tgt; if (p === sc.ctl && !sc.auto && !p.keeper) { const m = v.m || 0; sc.move(p, p.x + v.x * 100, p.y + v.y * 100, m > 0.1 ? p.spd * (spr ? 1.5 : 1) * Math.min(1, m * 1.2) : 0); if (m <= 0.1) { p.vx *= 0.8; p.vy *= 0.8; } }
          else if (p.slide > 0) { p.slide--; p.vx = p.sx; p.vy = p.sy; const o = b.owner; if (o && o.team !== p.team && dist(p, o) < 16 && p.slide > 1) { p.slide = 0; if (sc.rand() < 0.3 + (p.tack - o.drib) / 300) { b.owner = p; b.cool = 8; p.hold = 0; o.stun = 24; } else p.stun = 14; } if (p.slide === 0) p.stun = Math.max(p.stun, 12); if (!b.owner && dist(p, b) < R + 6) { b.vx = p.sx * 1.4; b.vy = p.sy * 1.4; b.kick = p.team; b.cool = 6; } }
          else { tgt = sc.ai(p); sc.move(p, tgt.x, tgt.y, tgt.s); }
          const sp = Math.hypot(p.vx, p.vy); if (sp > 0.25) { p.fx = p.vx / sp; p.fy = p.vy / sp; }
          p.x += p.vx; p.y += p.vy; p.x = clamp(p.x, R, W - R); p.y = clamp(p.y, R + 2, H - R - 2);
          if (p.keeper) p.x = clamp(p.x, p.team ? W - 60 : 8, p.team ? W - 8 : 60);
        });
        // separazione dei giocatori
        for (let i = 0; i < sc.all.length; i++) for (let j = i + 1; j < sc.all.length; j++) { const a = sc.all[i], c = sc.all[j], d = dist(a, c); if (d < R * 1.7 && d > 0.01) { const k = (R * 1.7 - d) / 2 / d; a.x += (a.x - c.x) * k; a.y += (a.y - c.y) * k; c.x -= (a.x - c.x) * k; c.y -= (a.y - c.y) * k; } }
        // palla
        if (b.cool > 0) b.cool--;
        if (b.owner) {
          const o = b.owner, l = Math.hypot(o.fx, o.fy) || 1; b.x = o.x + (o.fx / l) * (R + 3); b.y = o.y + (o.fy / l) * (R + 3); b.vx = b.vy = 0; o.hold++;
          if (o.hold > 420) { o.hold = 0; b.owner = null; b.vx = o.fx * 3; b.vy = o.fy * 3; b.cool = 10; }
          sc.foes(o).forEach((q) => { if (!q.keeper && q.stun <= 0 && dist(q, o) < R * 2 + 1 && sc.rand() < 0.012 + (q.tack - o.drib) / 9000) { b.owner = q; b.cool = 8; q.hold = 0; } });
        } else {
          b.x += b.vx; b.y += b.vy; const sp = Math.hypot(b.vx, b.vy); b.vx *= 0.987; b.vy *= 0.987; b.sp = sp; if (sp < 0.05) b.vx = b.vy = 0;
          if (b.y < 4) { b.y = 4; b.vy = Math.abs(b.vy) * 0.75; } if (b.y > H - 4) { b.y = H - 4; b.vy = -Math.abs(b.vy) * 0.75; }
          const inMouth = Math.abs(b.y - H / 2) < GH;
          [[0, H / 2 - GH], [0, H / 2 + GH], [W, H / 2 - GH], [W, H / 2 + GH]].forEach(([px, py]) => { const dx = b.x - px, dy = b.y - py, d = Math.hypot(dx, dy); if (d < 7 && d > 0.01) { const n = (dx * b.vx + dy * b.vy) / d; if (n < 0) { b.vx -= 1.8 * n * dx / d; b.vy -= 1.8 * n * dy / d; } b.x = px + dx / d * 7; b.y = py + dy / d * 7; sc.sfx("post"); } });
          if (b.x < 0) { if (inMouth) return sc.goal(1); b.x = 0; b.vx = Math.abs(b.vx) * 0.7; } if (b.x > W) { if (inMouth) return sc.goal(0); b.x = W; b.vx = -Math.abs(b.vx) * 0.7; }
          // parate
          [sc.P[sc.nf], sc.Q[sc.nf]].forEach((k) => { const toward = k.team ? b.vx > 0.5 : b.vx < -0.5; if (!b.owner && toward && sp > 2.5 && b.kick !== k.team && dist(b, k) < 20 && k.stun <= 0) { const big = Math.max(0.1, Math.min(0.92, 0.82 + (k.kdf - 55) / 260 - (sp - 6) * 0.045 - (sc.cfg.level - 3) * (k.team ? -0.02 : 0.02))); if (sc.rand() < big) { sc.saves = (sc.saves || 0) + 1; if (sp > 6.5 || sc.rand() < 0.5) { b.vx = (k.team ? -1 : 1) * (2 + sc.rand() * 2); b.vy = (sc.rand() - 0.5) * 4; b.kick = k.team; b.cool = 10; } else { b.owner = k; k.hold = 0; } sc.say(`${k.name} para!`, 1); sc.sfx("save"); } } });
          // recupero palla libera
          if (b.cool <= 0 && !b.owner) { const near = sc.all.filter((p) => p.stun <= 0 && p.slide <= 0 && dist(p, b) < R + 4 && !(p.keeper && sp > 2.5) && !(p.team === b.kick && sp > 4.5 && b.to !== p)).sort((a, c) => dist(a, b) - dist(c, b)); if (near.length && (sp < 7.2 || near[0].keeper)) { b.owner = near[0]; near[0].hold = 0; b.vx = b.vy = 0; b.to = null; } }
          if (sp > 4 && !b.owner) sc.all.forEach((p) => { if (!p.keeper && p.team !== b.kick && p.stun <= 0 && dist(p, b) < R + 2 && sc.rand() < 0.3 + (p.tack - 50) / 400) { b.vx *= -0.4; b.vy = (sc.rand() - 0.5) * 4; b.kick = p.team; b.cool = 5; } });
        }
      }
      goal(team) {
        const sc = this; sc.score[team]++; sc.lastScorer = team; sc.freeze = 110; sc.ball.owner = null; sc.ball.vx = sc.ball.vy = 0; const who = sc.all.filter((p) => p.team === team && !p.keeper).sort((a, c) => dist(a, sc.ball) - dist(c, sc.ball))[0];
        sc.msg.setText(team === 0 ? "GOOOL!" : "GOL SUBITO"); sc.cams.shake(220, 0.006); sc.say(team === 0 ? `GOOOL! ${who ? who.name : ""} la mette dentro! ${sc.score[0]}-${sc.score[1]}` : `Rete avversaria: ${who ? who.name : "loro"} punisce. ${sc.score[0]}-${sc.score[1]}`, 3); sc.sfx("goal");
        if (sc.extra) { sc.pendingEnd = true; }
      }
      end() {
        const sc = this; if (sc.over) return; sc.over = true; let win = sc.score[0] > sc.score[1];
        if (sc.score[0] === sc.score[1]) win = sc.shots[0] + (sc.saves || 0) * 0 >= sc.shots[1];
        window.__viva.over(win, sc.score[0], sc.score[1]);
      }
      finishNow(win) { const sc = this; if (sc.over) return; sc.score = win ? [Math.max(1, sc.score[0]), Math.min(sc.score[1], Math.max(0, sc.score[0] - 1))] : [sc.score[0], sc.score[0] + 1]; sc.over = true; window.__viva.over(win, sc.score[0], sc.score[1]); }
      say(t) { if (ui) ui.lg.innerHTML = t; }
      sfx(k) { safe(() => { const a = window.__sfx || (window.SFX), f = a && a[k]; if (f) f(); }, 0); }
      update(time, delta) {
        const sc = this; sc.acc = (sc.acc || 0) + Math.min(50, delta); while (sc.acc >= 1000 / 60) { sc.acc -= 1000 / 60; if (!sc.pause) sc.step(); }
        sc.render(); sc.hudT += delta; if (sc.hudT > 150) { sc.hudT = 0; window.__viva.hud(sc); }
      }
      render() {
        const sc = this, g = sc.gfx, b = sc.ball; g.clear();
        const fx = b.owner ? b.owner.x : b.x, fy = b.owner ? b.owner.y : b.y; const hx = VW / (2 * ZOOM), hy = VH / (2 * ZOOM); sc.cams.scrollX += (clamp(fx - VW / 2, hx - VW / 2, W - hx - VW / 2) - sc.cams.scrollX) * 0.12; sc.cams.scrollY += (clamp(fy - VH / 2, hy - VH / 2, H - hy - VH / 2) - sc.cams.scrollY) * 0.12;
        const ord = sc.all.concat().sort((a, c) => a.y - c.y);
        ord.forEach((p) => {
          g.fillStyle(0x000000, 0.28); g.fillEllipse(p.x, p.y + 8, 15, 6);
          const col = p.keeper ? (p.team ? 0xe8d030 : 0x3ac878) : p.team ? 0xe8453a : 0x2f86f0, wob = Math.sin((sc.frame + p.i * 7) / 3) * Math.min(1, Math.hypot(p.vx, p.vy)) * 1.5;
          g.fillStyle(0x111827, 1); g.fillRect(p.x - 4 + wob, p.y + 2, 3, 6); g.fillRect(p.x + 1 - wob, p.y + 2, 3, 6);
          g.fillStyle(col, 1); g.fillRoundedRect(p.x - 6, p.y - 6, 12, 10, 3); g.fillStyle(0xffffff, 0.9); g.fillRect(p.x - 1, p.y - 3, 2, 4);
          if (p.stun > 0) { g.fillStyle(0xfde047, 1); g.fillCircle(p.x - 6, p.y - 22 + Math.sin(sc.frame / 4) * 2, 2); g.fillCircle(p.x + 6, p.y - 22 - Math.sin(sc.frame / 4) * 2, 2); }
          if (p.im) p.im.setPosition(p.x, p.y - 13); else { g.fillStyle(0xe0b890, 1); g.fillCircle(p.x, p.y - 12, 6); }
        });
        const c = sc.ctl; if (c && !sc.auto) { g.lineStyle(2, 0xfde047, 1); g.strokeEllipse(c.x, c.y + 8, 20, 9); g.fillStyle(0xfde047, 1); g.fillTriangle(c.x - 4, c.y - 28, c.x + 4, c.y - 28, c.x, c.y - 22); }
        // palla
        g.fillStyle(0x000000, 0.3); g.fillEllipse(b.x, b.y + 4, 8, 3); g.fillStyle(0xffffff, 1); g.fillCircle(b.x, b.y, 4); g.fillStyle(0x111827, 1); g.fillCircle(b.x + 1, b.y - 1, 1.6);
        if (sc.charge > 0 && c) { const w = 30 * sc.charge; g.fillStyle(0x000000, 0.5); g.fillRect(c.x - 16, c.y + 14, 32, 5); g.fillStyle(sc.charge > 0.85 ? 0xf87171 : 0xfbbf24, 1); g.fillRect(c.x - 15, c.y + 15, w, 3); g.lineStyle(1, 0xffffff, 0.35); g.lineBetween(c.x, c.y, c.x + (c.team ? -1 : 1) * 60, H / 2 + sc.stk.y * GH); }
      }
      // ---- test
      sim(n) { for (let i = 0; i < n && !this.over; i++) this.step(); }
    };
  }
  // ------------------------------------------------------------ interfaccia
  const PAGES = [
    { t: "Muovi e scatta", p: "Joystick a sinistra per muoverti: il giocatore col cerchio giallo è il tuo. SCATTO consuma fiato, che torna da solo.", draw(g, f) { g.fillStyle = "#15803d"; g.fillRect(0, 0, 380, 230); g.strokeStyle = "#fff8"; g.strokeRect(10, 10, 360, 210); const x = 120 + ((f * 2) % 120); g.fillStyle = "#2f86f0"; g.fillRect(x, 105, 12, 14); g.strokeStyle = "#fde047"; g.beginPath(); g.ellipse(x + 6, 124, 12, 5, 0, 0, 7); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.arc(x + 20, 120, 4, 0, 7); g.fill(); } },
    { t: "Passa e tira", p: "Con la palla: PASSA al compagno nella direzione del joystick; TIRA tenendo premuto per caricare (più forte, meno preciso), su/giù col joystick per mirare. Senza palla: TIRA è una scivolata, PASSA cambia giocatore.", draw(g, f) { g.fillStyle = "#15803d"; g.fillRect(0, 0, 380, 230); g.fillStyle = "#0f172a"; g.fillRect(340, 90, 30, 50); g.fillStyle = "#2f86f0"; g.fillRect(150, 105, 12, 14); const t = (f % 90) / 90; g.fillStyle = "#fff"; g.beginPath(); g.arc(170 + t * 175, 118 - Math.sin(t * 3) * 6, 4, 0, 7); g.fill(); g.fillStyle = "#fbbf24"; g.fillRect(140, 150, 40 * t, 6); } },
    { t: "Il tuo portiere", p: "Il portiere è una delle tue carte: la carta Portiere se c'è, altrimenti quella con più DIF. Para da solo. Se la squadra ha Intesa e sintonia, tiri e contrasti ricevono un bonus.", draw(g, f) { g.fillStyle = "#15803d"; g.fillRect(0, 0, 380, 230); g.fillStyle = "#0f172a"; g.fillRect(20, 80, 20, 70); g.fillStyle = "#3ac878"; g.fillRect(48, 108 + Math.sin(f / 10) * 18, 12, 14); g.fillStyle = "#fff"; g.beginPath(); g.arc(250 - (f % 80) * 2, 115, 4, 0, 7); g.fill(); } }
  ];
  function hud(sc) {
    if (!ui || !sc) return; const t = sc.extra ? "GOLDEN" : Math.max(0, Math.ceil((cfg0().dur - sc.t) / 60)) + "s", sp = Math.round(sc.stam);
    ui.hud.style.whiteSpace = "nowrap"; ui.hud.style.flexWrap = "nowrap"; ui.hud.style.justifyContent = "space-between"; ui.hud.innerHTML = `<span style="white-space:nowrap">⚽ <b>${sc.score[0]} - ${sc.score[1]}</b></span><span style="white-space:nowrap">⏱ <b>${t}</b></span><span style="white-space:nowrap">👟 <b>${sp}%</b></span><span style="opacity:.8;white-space:nowrap">${esc(OPT.oppName || "Rivali")}</span>`;
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let CFG = null; const cfg0 = () => CFG;
  function over(win, a, b) {
    if (!ui || !ST) return; ST.win = win; ST.goals = a; ST.conc = b; ST.stars = win ? 1 + (a - b >= 2 ? 1 : 0) + (b === 0 ? 1 : 0) : 0; ST.done = true; hud(window.__viva.scene);
    ui.lg.innerHTML = win ? `<b>VITTORIA ${a}-${b}!</b> ${"⭐".repeat(ST.stars)}` : `<b>Sconfitta ${a}-${b}.</b> Riprova: passa di più e tira da dentro l'area.`;
    ui.bt.innerHTML = `<button data-a="retry">↻ Rigioca</button><button data-a="ok" class="go">${win ? "Continua ▸" : "Chiudi"}</button>`;
    ui.bt.querySelectorAll("button").forEach((x) => (x.onclick = () => { if (x.dataset.a === "retry") begin(ST.level); else close(win); }));
  }
  function controls() {
    const wrap = document.createElement("div"); wrap.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:6px"; const stk = window.__stick.make({ size: 130 }); stk.el.style.flex = "none";
    const bw = document.createElement("div"); bw.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:6px;flex:1;max-width:230px"; bw.innerHTML = `<button data-k="shoot" class="vb" style="grid-column:1/3;min-height:64px;background:#b45309;border-color:#fbbf24">TIRA<small>tieni premuto</small></button><button data-k="pass" class="vb" style="min-height:54px">PASSA<small>cambia</small></button><button data-k="sprint" class="vb" style="min-height:54px">SCATTO<small>fiato</small></button>`;
    bw.querySelectorAll("button").forEach((b) => { b.style.cssText += ";border:2px solid #7dd3fc;border-radius:12px;color:#fff;font:900 15px system-ui;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;touch-action:none;user-select:none;-webkit-user-select:none"; if (!b.style.background) b.style.background = "rgba(255,255,255,.1)"; });
    wrap.appendChild(stk.el); wrap.appendChild(bw); const sc = () => game && game.scene.keys.viva;
    bw.querySelectorAll("button").forEach((b) => { const k = b.dataset.k;
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); const s = sc(); if (!s) return; try { b.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } if (k === "pass") s.keys.pass = true; else s.keys[k] = true; });
      const up = () => { const s = sc(); if (!s) return; if (k === "shoot") s.releaseShoot(); else if (k === "sprint") s.keys.sprint = false; }; b.addEventListener("pointerup", up); b.addEventListener("pointercancel", up); b.addEventListener("lostpointercapture", up); });
    ui.stk = stk; return wrap;
  }
  function begin(n) {
    const lvl = clamp(n | 0 || 3, 1, 5); ST = { level: lvl, win: false, done: false, goals: 0, conc: 0, stars: 0 };
    if (game) { try { game.destroy(true); } catch (e) { /* ok */ } game = null; }
    const nn = OPT.n === 3 ? 3 : 5, rand = Math.random, mine = myCards(nn, OPT.team), fo = OPT.foes && OPT.foes.length >= nn ? { cards: withKeeper(OPT.foes.slice(0, nn)), name: OPT.oppName } : foeCards(nn, rand);
    OPT.oppName = OPT.oppName || fo.name; CFG = { n: nn, level: lvl, mine, foes: fo.cards, bonus: OPT.bonus || {}, dur: (OPT.secs || 100) * 60 };
    ui.lg.innerHTML = `<b>${LV[lvl]}.</b> ${nn === 3 ? "3 contro 3" : "5 contro 5"}, portiere compreso. In porta: <b>${esc(mine[nn - 1] ? safe(() => S().name(mine[nn - 1].id), "") : "")}</b>.`;
    ui.bt.innerHTML = ""; ui.holder.innerHTML = ""; if (ui.ctl) { ui.ctl.remove(); ui.ctl = null; }
    const Scn = makeScene(Object.assign({}, CFG)); Scn.prototype.cfg = CFG;
    game = new window.Phaser.Game({ type: window.Phaser.CANVAS, parent: ui.holder, width: VW, height: VH, backgroundColor: "#14532d", banner: false, audio: { noAudio: true }, scale: { mode: window.Phaser.Scale.FIT, autoCenter: window.Phaser.Scale.CENTER_BOTH }, input: { touch: { capture: true }, keyboard: true }, scene: Scn });
    ui.ctl = controls(); ui.holder.parentNode.insertBefore(ui.ctl, ui.holder.nextSibling); ui.bt.parentNode.removeChild(ui.bt); ui.ctl.parentNode.insertBefore(ui.bt, ui.ctl.nextSibling);
    const stkLoop = () => { const s = game && game.scene.keys.viva; if (s && ui && ui.stk) s.stk = ui.stk.v; if (ui) requestAnimationFrame(stkLoop); }; stkLoop();
  }
  function close(w) {
    const o = OPT, r = { win: !!w && !!(ST && ST.win), level: ST ? ST.level : 0, goals: ST ? ST.goals : 0, conceded: ST ? ST.conc : 0, stars: ST ? ST.stars : 0 };
    if (game) { try { game.destroy(true); } catch (e) { /* ok */ } game = null; } if (ui) ui.root.remove(); ui = null; ST = null; tutC = null; window.__viva.scene = null;
    if (o.onDone) o.onDone(r);
  }
  function start(o) {
    if (ui) ui.root.remove(); OPT = o || {}; const n = clamp(OPT.level | 0 || 3, 1, 5);
    ui = M.shell("vivaOv", "⚽ " + (OPT.title || "Partita Viva"), "#fbbf24"); ui.root.style.background = "#06140c"; ui.cv.style.display = "none";
    ui.holder = document.createElement("div"); ui.holder.style.cssText = "width:100%;aspect-ratio:" + VW + "/" + VH + ";position:relative;border:2px solid rgba(255,255,255,.2);border-radius:12px;overflow:hidden;touch-action:none;background:#14532d";
    ui.cv.parentNode.insertBefore(ui.holder, ui.cv.nextSibling);
    const quit = document.createElement("button"); quit.textContent = "✕"; quit.setAttribute("aria-label", "Esci"); quit.className = "hp"; quit.style.cssText = "margin-left:6px"; quit.onclick = () => close(false); ui.root.querySelector(".top").appendChild(quit);
    ui.help.onclick = () => { if (!(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "viva", pages: PAGES, onClose: () => { tutC = null; } }); };
    ui.lg.textContent = "Carico il motore Phaser…";
    loadPhaser(() => {
      if (!ui) return; begin(n);
      if (OPT.tutorial !== false && !M.seen("viva")) tutC = M.tut({ root: ui.root, key: "viva", pages: PAGES, onClose: () => { tutC = null; } });
    }, () => { if (ui) ui.lg.innerHTML = "Serve la connessione la prima volta per caricare il motore Phaser. Riprova più tardi."; });
    return true;
  }
  window.__viva = { start, hud, over, scene: null, LV: LV,
    state: { finish(w) { const sc = window.__viva.scene; if (sc && !sc.over) sc.finishNow(!!w); }, press(k, down) { const sc = window.__viva.scene; if (!sc) return; if (k === "shoot" && !down) sc.releaseShoot(); else if (k === "pass") sc.keys.pass = !!down; else sc.keys[k] = !!down; }, stick(x, y) { const sc = window.__viva.scene; if (sc) sc.stk = { x, y, m: Math.min(1, Math.hypot(x, y)) }; },
      sim(n) { const sc = window.__viva.scene; if (sc) sc.sim(n); }, auto(on) { const sc = window.__viva.scene; if (sc) sc.auto = !!on; }, get over() { return !!(ST && ST.done); } } };
})();
