// js/zonarossa.js - «ZONA ROSSA» · Motore di partita originale di «Il Torneo dei Quattordici»
// Calcio 2 contro 2 in tempo reale su un'arena che si restringe, come in un battle royale sportivo:
//  - muovi il tuo giocatore trascinando il dito (o frecce / WASD) e tiri col pulsante TIRA (o Spazio)
//  - dopo 10 secondi due fasce rosse avanzano dal bordo alto e basso del campo
//  - chi resta nella fascia rossa perde fiato: a zero va KO per 2,5 secondi e riparte dalla sua porta
//  - 60 secondi (o primo a 3 gol). Se è pari, morte improvvisa con le fasce che si chiudono. Pari finale = sconfitta
(function () {
  "use strict";
  if (window.__zonarossa) return;

  const W = 360, H = 220, FX0 = 16, FX1 = 344, FY0 = 26, FY1 = 204, GY0 = 84, GY1 = 146, R = 9, RB = 5;
  const FULL = 3600, SUDDEN = 3000, WIN_GOALS = 3, BAND_START = 600, BAND_MAX = 56;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let audioCtx = null;
  function snd(kind) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime;
      const f = { kick: [260, 120, 0.09], goal: [330, 880, 0.35], ko: [200, 60, 0.3], whistle: [900, 900, 0.18], warn: [440, 330, 0.2] }[kind] || [200, 100, 0.1];
      o.type = kind === "ko" ? "sawtooth" : "triangle";
      o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t + f[2]);
      g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + f[2]);
      o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + f[2] + 0.02);
    } catch (e) {}
  }

  const S = {
    active: false, opts: {}, raf: null, onDone: null, root: null, cv: null,
    scoreA: 0, scoreB: 0, t: 0, clock: 0, phase: "intro", timer: 0, sudden: false, lvl: 0.55, autoLvl: 0.62,
    discs: [], ball: null, ix: 0, iy: 0, kickReq: false, kickCd: 0, stick: null, kb: { u: false, d: false, l: false, r: false },
    banner: "", sub: "", fx: [], idle: 0, warned: false
  };

  function level() {
    const c = (window.__sagaCore && window.__sagaCore.cur) || {};
    const d = String(c.diff || "normale");
    return d === "storia" ? 0.35 : d === "sfida" ? 0.78 : 0.55;
  }
  const bonus = () => S.opts.bonus || {};

  const HOME = {
    A0: [118, 115], A1: [66, 115], B0: [242, 115], B1: [294, 115]
  };

  function makeDiscs() {
    const mk = (team, i, hero) => {
      const h = HOME[team + i];
      return { team, i, hero: !!hero, x: h[0], y: h[1], vx: 0, vy: 0, hx: h[0], hy: h[1], stam: 100, ko: 0, face: team === "A" ? 0 : Math.PI };
    };
    return [mk("A", 0, true), mk("A", 1, false), mk("B", 0, false), mk("B", 1, false)];
  }

  function resetKick(towardA) {
    S.discs.forEach((d) => { d.x = d.hx; d.y = d.hy; d.vx = d.vy = 0; d.ko = 0; d.stam = Math.max(d.stam, 60); });
    S.ball = { x: (FX0 + FX1) / 2, y: (FY0 + FY1) / 2, vx: towardA ? 0.2 : -0.2, vy: 0 };
    S.phase = "kick"; S.timer = 60;
  }

  function startMatch(opts) {
    S.active = true; S.opts = opts || {}; S.onDone = S.opts.onDone || S.opts.done || function () {};
    S.scoreA = 0; S.scoreB = 0; S.t = 0; S.clock = 0; S.sudden = false; S.fx = []; S.idle = 0; S.warned = false;
    S.lvl = level(); S.autoLvl = S.opts.autoLvl || 0.62;
    S.discs = makeDiscs(); S.ix = S.iy = 0; S.kickReq = false; S.kickCd = 0; S.stick = null;
    resetKick(true);
    S.phase = S.opts.auto ? "kick" : "intro"; S.banner = "ZONA ROSSA"; S.sub = "";
    mountUI(); bindEvents();
    S.raf = requestAnimationFrame(loop);
    return true;
  }

  // spessore delle fasce rosse in questo istante
  function band() {
    if (S.sudden) return clamp(40 + (S.clock - FULL) / 40, 40, 78);
    return clamp((S.clock - BAND_START) / (FULL - BAND_START) * BAND_MAX, 0, BAND_MAX);
  }
  const dangerAt = (y, bt) => bt > 1 && (y - 3 < FY0 + bt || y + 3 > FY1 - bt);

  // ------------------------------------------------------------ intelligenza dei giocatori comandati dal computer
  function aiMove(d, lvl, spd) {
    const dir = d.team === "A" ? 1 : -1, goalX = d.team === "A" ? FX1 : FX0, ownX = d.team === "A" ? FX0 : FX1, b = S.ball, bt = band();
    const mates = S.discs.filter((m) => m.team === d.team && m.ko <= 0 && (!m.hero || S.opts.auto));
    const dist = (m) => Math.hypot(m.x - b.x, m.y - b.y);
    // l'attaccante è il più vicino alla palla; per il compagno di squadra del giocatore conta di più la difesa
    let att = mates.slice().sort((p, q) => dist(p) - dist(q))[0];
    if (!S.opts.auto && d.team === "A" && !d.hero) { const hero = S.discs[0]; if (hero.ko <= 0 && dist(hero) < dist(d) + 22) att = hero; }
    const isAtt = att === d;
    let tx, ty;
    const gy = (GY0 + GY1) / 2;
    if (isAtt) {
      const gx = goalX - b.x, gyv = gy - b.y, gl = Math.hypot(gx, gyv) || 1;
      tx = b.x - (gx / gl) * (R + RB + 1); ty = b.y - (gyv / gl) * (R + RB + 1);
      if (Math.hypot(d.x - tx, d.y - ty) < 6) { tx = b.x; ty = b.y; }
      // se la palla sta dietro di me, giro attorno
      if ((b.x - d.x) * dir < -4) { tx = d.x - dir * 8; ty = d.y + (b.y > d.y ? 22 : -22); }
    } else {
      tx = ownX + dir * clamp(Math.abs(b.x - ownX) * 0.45 + 26, 40, 108);
      ty = (FY0 + FY1) / 2 + (b.y - (FY0 + FY1) / 2) * 0.55;
    }
    ty = clamp(ty, FY0 + bt + R + 3, FY1 - bt - R - 3);
    const dx = tx - d.x, dy = ty - d.y, dl = Math.hypot(dx, dy) || 1;
    const acc = 0.30 * spd;
    d.vx += (dx / dl) * acc * Math.min(1, dl / 14); d.vy += (dy / dl) * acc * Math.min(1, dl / 14);
    // tiro quando la palla è davanti a me e vicina
    if (isAtt && d.kc <= 0) {
      const bd = Math.hypot(d.x - b.x, d.y - b.y);
      if (bd < R + RB + 5 && (b.x - d.x) * dir > -2) {
        const aim = Math.atan2(gy - b.y + (Math.random() - 0.5) * 36 * (1 - lvl), goalX - b.x) + (Math.random() - 0.5) * (1 - lvl) * 0.5;
        doKick(d, aim, 5.4 + lvl * 1.0);
      }
    }
  }

  function doKick(d, ang, pw) {
    const b = S.ball;
    b.vx += Math.cos(ang) * pw; b.vy += Math.sin(ang) * pw;
    const sp = Math.hypot(b.vx, b.vy); if (sp > 9) { b.vx *= 9 / sp; b.vy *= 9 / sp; }
    d.kc = 22; d.face = ang; snd("kick");
  }

  // ------------------------------------------------------------ fisica
  function stepDisc(d, spd, friction) {
    d.x += d.vx; d.y += d.vy;
    d.vx *= friction; d.vy *= friction;
    const sp = Math.hypot(d.vx, d.vy); if (sp > spd) { d.vx *= spd / sp; d.vy *= spd / sp; }
    d.x = clamp(d.x, FX0 + R, FX1 - R); d.y = clamp(d.y, FY0 + R, FY1 - R);
    if (Math.abs(d.vx) + Math.abs(d.vy) > 0.2) d.face = Math.atan2(d.vy, d.vx);
  }

  function heroInput(d) {
    if (S.opts.auto) return false;
    let ix = S.ix, iy = S.iy;
    if (S.kb.l) ix -= 1; if (S.kb.r) ix += 1; if (S.kb.u) iy -= 1; if (S.kb.d) iy += 1;
    const l = Math.hypot(ix, iy); if (l > 1) { ix /= l; iy /= l; }
    const spd = 2.15 * (1 + 0.03 * (bonus().df || 0));
    d.vx += ix * 0.42; d.vy += iy * 0.42;
    S._spdHero = spd; S._in = [ix, iy];
    if (S.kickReq) {
      S.kickReq = false;
      const b = S.ball;
      if (d.kc <= 0 && Math.hypot(d.x - b.x, d.y - b.y) < R + RB + 9) {
        const gy = (GY0 + GY1) / 2, goalAng = Math.atan2(gy - b.y, FX1 - b.x);
        let ang = Math.hypot(ix, iy) > 0.3 ? Math.atan2(iy, ix) : goalAng;
        let diff = ang - goalAng; while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
        if (Math.abs(diff) < 0.55 + 0.08 * (bonus().te || 0)) ang = goalAng;
        doKick(d, ang, 6.3 * (1 + 0.05 * (bonus().at || 0)));
      }
    }
    return true;
  }

  function collide() {
    const ds = S.discs.filter((d) => d.ko <= 0);
    for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
      const a = ds[i], c = ds[j], dx = c.x - a.x, dy = c.y - a.y, dl = Math.hypot(dx, dy) || 0.01;
      if (dl < 2 * R) {
        const nx = dx / dl, ny = dy / dl, push = (2 * R - dl) / 2;
        a.x -= nx * push; a.y -= ny * push; c.x += nx * push; c.y += ny * push;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) { a.vx += nx * rv * 0.6; a.vy += ny * rv * 0.6; c.vx -= nx * rv * 0.6; c.vy -= ny * rv * 0.6; }
      }
    }
    const b = S.ball;
    for (const d of ds) {
      const dx = b.x - d.x, dy = b.y - d.y, dl = Math.hypot(dx, dy) || 0.01;
      if (dl < R + RB) {
        const nx = dx / dl, ny = dy / dl;
        b.x = d.x + nx * (R + RB); b.y = d.y + ny * (R + RB);
        const rvn = (b.vx - d.vx) * nx + (b.vy - d.vy) * ny;
        if (rvn < 0) { b.vx -= 1.75 * rvn * nx; b.vy -= 1.75 * rvn * ny; }
      }
    }
  }

  function stepBall() {
    const b = S.ball;
    b.x += b.vx; b.y += b.vy; b.vx *= 0.987; b.vy *= 0.987;
    const sp = Math.hypot(b.vx, b.vy); if (sp > 9.5) { b.vx *= 9.5 / sp; b.vy *= 9.5 / sp; }
    if (b.y < FY0 + RB) { b.y = FY0 + RB; b.vy = Math.abs(b.vy) * 0.8; }
    if (b.y > FY1 - RB) { b.y = FY1 - RB; b.vy = -Math.abs(b.vy) * 0.8; }
    const inMouth = b.y > GY0 + 1 && b.y < GY1 - 1;
    if (b.x < FX0 + RB && !inMouth) { b.x = FX0 + RB; b.vx = Math.abs(b.vx) * 0.8; }
    if (b.x > FX1 - RB && !inMouth) { b.x = FX1 - RB; b.vx = -Math.abs(b.vx) * 0.8; }
    if (b.x < FX0 - 10) return "B";
    if (b.x > FX1 + 10) return "A";
    return null;
  }

  function goal(team) {
    if (team === "A") S.scoreA++; else S.scoreB++;
    S.banner = team === "A" ? "GOL TUO!" : "GOL LORO."; S.sub = `${S.scoreA} - ${S.scoreB}`;
    snd("goal"); S.fx.push({ k: "flash", t: 30, team });
    if (S.scoreA >= WIN_GOALS || S.scoreB >= WIN_GOALS || S.sudden) { S.phase = "pause"; S.timer = 50; S._endAfter = true; return; }
    S.phase = "pause"; S.timer = 70; S._endAfter = false;
  }

  function update() {
    S.t++;
    if (S.phase === "kick") { if (--S.timer <= 0) { S.phase = "play"; S.banner = ""; snd("whistle"); } else S.banner = S.timer > 40 ? "PRONTI" : S.timer > 20 ? "ATTENTI" : "VIA!"; }
    if (S.phase === "pause") {
      S.discs.forEach((d) => stepDisc(d, 1.5, 0.9));
      if (--S.timer <= 0) { if (S._endAfter) return endMatch(); resetKick(S.scoreA <= S.scoreB); }
      return;
    }
    if (S.phase === "end") return;
    const playing = S.phase === "play", bt = playing ? band() : 0;
    if (playing) S.clock++;
    if (playing && !S.warned && S.clock >= BAND_START - 120) { S.warned = true; S.banner = "LE FASCE ROSSE SI STRINGONO"; snd("warn"); S.bannerT = 90; }
    if (S.bannerT) { if (--S.bannerT <= 0) { S.banner = ""; S.bannerT = 0; } }
    // giocatori
    S.discs.forEach((d) => {
      d.kc = Math.max(0, (d.kc || 0) - 1);
      if (d.ko > 0) { d.ko--; if (d.ko <= 0) { d.x = d.hx; d.y = d.hy; d.vx = d.vy = 0; d.stam = 100; } return; }
      let spd = 1.5;
      if (d.hero && !S.opts.auto) { heroInput(d); spd = S._spdHero || 2.15; }
      else if (playing || S.phase === "kick") {
        const lvl = d.team === "B" ? S.lvl : d.hero ? S.autoLvl : 0.5 + 0.2 * (bonus().te || 0) * 0.5;
        spd = d.team === "B" ? 1.45 + 0.75 * S.lvl : d.hero ? 1.9 + 0.5 * S.autoLvl : 1.7;
        if (S.phase === "play") aiMove(d, lvl, spd);
      }
      stepDisc(d, spd, 0.9);
      // fiato
      if (playing && dangerAt(d.y, bt)) {
        d.stam -= 0.85 * (1 - 0.08 * (bonus().df || 0) * (d.team === "A" ? 1 : 0));
        if (d.stam <= 0) { d.ko = 150; d.vx = d.vy = 0; d.stam = 0; snd("ko"); S.fx.push({ k: "ko", x: d.x, y: d.y, t: 40 }); }
      } else d.stam = Math.min(100, d.stam + 0.45);
    });
    if (S.phase === "play" || S.phase === "kick") {
      collide();
      const g = stepBall();
      if (S.phase === "play" && g) return goal(g);
      if (S.phase === "play") {
        const sp = Math.hypot(S.ball.vx, S.ball.vy);
        if (sp < 0.06) { if (++S.idle > 200) { S.ball.vx = (Math.random() - 0.5) * 3; S.ball.vy = (Math.random() - 0.5) * 3; S.idle = 0; } } else S.idle = 0;
        // fine tempo
        if (!S.sudden && S.clock >= FULL) {
          if (S.scoreA !== S.scoreB) return endMatch();
          S.sudden = true; S.banner = "MORTE IMPROVVISA"; S.bannerT = 120; snd("whistle");
        } else if (S.sudden && S.clock >= FULL + SUDDEN) {
          // ultimo spareggio: vince chi ha più fiato residuo (pari = loro)
          const st = (t) => S.discs.filter((d) => d.team === t).reduce((n, d) => n + (d.ko > 0 ? 0 : d.stam), 0);
          if (st("A") > st("B") + 1) S.scoreA++; else S.scoreB++;
          return endMatch();
        }
      }
    }
    S.fx = S.fx.map((f) => Object.assign({}, f, { t: f.t - 1 })).filter((f) => f.t > 0);
  }

  function endMatch() {
    S.phase = "end";
    const win = S.scoreA > S.scoreB;
    S.banner = win ? "VITTORIA!" : S.scoreA === S.scoreB ? "PARI: SCONFITTA" : "ELIMINATI";
    S.sub = `${S.scoreA} - ${S.scoreB}`;
    if (S.opts.auto) return finishMatch(win);
    if (S.root) { const b = S.root.querySelector("#zrDone"); if (b) b.style.display = "block"; const k = S.root.querySelector("#zrKick"); if (k) k.style.display = "none"; }
  }

  function finishMatch(win) {
    if (!S.active) return;
    S.active = false;
    if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; }
    unbindEvents(); unmountUI();
    if (window.__sagaCore && typeof window.__sagaCore.endMatch === "function") { try { window.__sagaCore.endMatch(); } catch (e) {} }
    const r = { a: S.scoreA, b: S.scoreB, win: win !== undefined ? !!win : S.scoreA > S.scoreB, quit: false, data: { a: S.scoreA, b: S.scoreB } };
    if (typeof S.onDone === "function") S.onDone(r);
  }

  // ------------------------------------------------------------ disegno
  function drawDisc(g, d, isHeroLike) {
    const A = d.team === "A", col = A ? "#38bdf8" : "#f97316", dark = A ? "#0c4a6e" : "#7c2d12";
    if (d.ko > 0) { g.fillStyle = "rgba(120,120,130,.55)"; g.beginPath(); g.arc(d.x, d.y, R, 0, 7); g.fill(); g.fillStyle = "#e5e7eb"; g.font = "bold 9px system-ui"; g.textAlign = "center"; g.fillText("KO", d.x, d.y + 3); return; }
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(d.x, d.y + R - 1, R, 3, 0, 0, 7); g.fill();
    g.fillStyle = dark; g.beginPath(); g.arc(d.x, d.y, R, 0, 7); g.fill();
    g.fillStyle = col; g.beginPath(); g.arc(d.x, d.y, R - 2, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(d.x + Math.cos(d.face) * 4, d.y + Math.sin(d.face) * 4, 2.2, 0, 7); g.fill();
    if (isHeroLike) { g.strokeStyle = "#fff"; g.lineWidth = 2; g.beginPath(); g.arc(d.x, d.y, R + 2.5, 0, 7); g.stroke(); }
    if (d.stam < 99) { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(d.x - 10, d.y - R - 7, 20, 3); g.fillStyle = d.stam > 40 ? "#4ade80" : "#ef4444"; g.fillRect(d.x - 10, d.y - R - 7, 20 * d.stam / 100, 3); }
  }

  function render(g) {
    const bt = S.phase === "intro" ? 0 : band();
    // campo
    g.fillStyle = "#0b1d2a"; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? "#12402f" : "#0f3828"; g.fillRect(FX0 + i * (FX1 - FX0) / 9, FY0, (FX1 - FX0) / 9 + 1, FY1 - FY0); }
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.5; g.strokeRect(FX0, FY0, FX1 - FX0, FY1 - FY0);
    g.beginPath(); g.moveTo((FX0 + FX1) / 2, FY0); g.lineTo((FX0 + FX1) / 2, FY1); g.stroke();
    g.beginPath(); g.arc((FX0 + FX1) / 2, (FY0 + FY1) / 2, 26, 0, 7); g.stroke();
    // porte
    g.fillStyle = "rgba(56,189,248,.35)"; g.fillRect(FX0 - 12, GY0, 12, GY1 - GY0); g.strokeStyle = "#38bdf8"; g.lineWidth = 2; g.strokeRect(FX0 - 12, GY0, 12, GY1 - GY0);
    g.fillStyle = "rgba(249,115,22,.35)"; g.fillRect(FX1, GY0, 12, GY1 - GY0); g.strokeStyle = "#f97316"; g.strokeRect(FX1, GY0, 12, GY1 - GY0);
    // fasce rosse
    if (bt > 0.5) {
      const pulse = 0.28 + 0.1 * Math.sin(S.t / 8);
      [[FY0, bt], [FY1 - bt, bt]].forEach(([y, h]) => {
        g.fillStyle = `rgba(220,38,38,${pulse + 0.1})`; g.fillRect(FX0, y, FX1 - FX0, h);
        g.strokeStyle = "rgba(254,202,202,.35)"; g.lineWidth = 3;
        for (let x = FX0 - 30 + (S.t % 18); x < FX1; x += 18) { g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + 18, y); g.stroke(); }
      });
      g.fillStyle = "#fecaca"; g.fillRect(FX0, FY0 + bt - 1, FX1 - FX0, 2); g.fillRect(FX0, FY1 - bt - 1, FX1 - FX0, 2);
    }
    // scia della palla
    S.fx.forEach((f) => { if (f.k === "ko") { g.fillStyle = `rgba(239,68,68,${f.t / 40})`; g.beginPath(); g.arc(f.x, f.y, 24 - f.t * 0.4, 0, 7); g.fill(); } });
    // giocatori e palla
    S.discs.forEach((d) => drawDisc(g, d, d.hero));
    const b = S.ball;
    g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(b.x, b.y, RB, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1; g.stroke();
    // stick virtuale
    if (S.stick) {
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.beginPath(); g.arc(S.stick.x0, S.stick.y0, 24, 0, 7); g.stroke();
      g.fillStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.arc(S.stick.x0 + S.stick.dx, S.stick.y0 + S.stick.dy, 9, 0, 7); g.fill();
    }
    // HUD
    g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, 0, W, 22);
    g.font = "bold 12px system-ui"; g.textAlign = "left"; g.fillStyle = "#7dd3fc"; g.fillText(`TU ${S.scoreA}`, 8, 15);
    g.textAlign = "right"; g.fillStyle = "#fdba74"; g.fillText(`${S.scoreB} LORO`, W - 8, 15);
    const left = S.sudden ? 0 : Math.max(0, Math.ceil((FULL - S.clock) / 60));
    g.textAlign = "center"; g.fillStyle = "#fff";
    g.fillText(S.sudden ? "MORTE IMPROVVISA" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}${S.opts.mate ? " · con " + S.opts.mate : ""}`, 180, 15);
    // zona in chiusura
    if (S.phase === "play" && !S.sudden && S.clock < BAND_START) { g.fillStyle = "rgba(254,202,202,.9)"; g.font = "10px system-ui"; g.fillText(`Fasce rosse tra ${Math.ceil((BAND_START - S.clock) / 60)} s`, 180, 214); }
    if (S.banner && S.phase !== "intro") {
      g.textAlign = "center"; g.font = "bold 18px system-ui"; g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 4;
      g.strokeText(S.banner, 180, 112); g.fillText(S.banner, 180, 112);
      if (S.sub && (S.phase === "pause" || S.phase === "end")) { g.font = "bold 13px system-ui"; g.strokeText(S.sub, 180, 132); g.fillText(S.sub, 180, 132); }
    }
    if (S.phase === "intro") {
      g.fillStyle = "rgba(4,10,20,.93)"; g.fillRect(14, 28, 332, 176);
      g.strokeStyle = "#ef4444"; g.lineWidth = 2; g.strokeRect(14, 28, 332, 176);
      g.textAlign = "center"; g.fillStyle = "#fca5a5"; g.font = "bold 15px system-ui"; g.fillText("ZONA ROSSA", 180, 50);
      g.fillStyle = "#fff"; g.font = "11px system-ui";
      ["Sei il disco con l'anello bianco (azzurro), con un compagno.", "MUOVITI: trascina il dito nel campo (o frecce / WASD).", "TIRA: pulsante TIRA (o Spazio), vicino alla palla.", "Dopo 10 secondi due FASCE ROSSE avanzano dai bordi.", "Nella fascia perdi fiato: a zero sei KO per 2,5 secondi.", "Vince chi segna di più in 60 s, o chi arriva a 3 gol.", "Pari: morte improvvisa, fasce che si chiudono. Pari = sconfitta."].forEach((t, i) => g.fillText(t, 180, 74 + i * 18));
    }
  }

  // ------------------------------------------------------------ DOM e comandi
  function mountUI() {
    unmountUI();
    const el = document.createElement("div");
    el.id = "zonarossa-overlay";
    el.style.cssText = "position:fixed;inset:0;z-index:99999;background:#060b14;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;user-select:none;font-family:system-ui,sans-serif";
    el.innerHTML = `<div style="width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;padding:4px">
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:2px 8px;color:#fca5a5;font-size:12px;font-weight:bold"><span>🔴 ${esc(S.opts.title || "Zona Rossa")}</span><button id="zrClose" style="background:#1f2937;color:#e5e7eb;border:1px solid #4b5563;border-radius:4px;padding:3px 8px;font-size:11px">✕ Esci</button></div>
      <div style="position:relative;width:100%;aspect-ratio:${W}/${H};max-height:58vh;background:#000;border:2px solid #b91c1c;border-radius:6px;overflow:hidden"><canvas id="zrCv" width="${W}" height="${H}" style="width:100%;height:auto;flex:none;display:block;touch-action:none"></canvas></div>
      <button id="zrStart" style="margin-top:8px;width:100%;padding:12px;background:#b91c1c;color:#fff;border:none;border-radius:6px;font-weight:bold;font-size:14px;cursor:pointer">Ho capito, via!</button>
      <button id="zrKick" style="display:none;margin-top:8px;width:100%;min-height:72px;padding:12px;background:#0369a1;color:#fff;border:none;border-radius:10px;font-weight:bold;font-size:20px;cursor:pointer;touch-action:none">⚽ TIRA</button>
      <button id="zrDone" style="display:none;margin-top:8px;width:100%;padding:12px;background:#15803d;color:#fff;border:none;border-radius:6px;font-weight:bold;font-size:14px;cursor:pointer">Continua ▸</button></div>`;
    document.body.appendChild(el);
    S.root = el; S.cv = el.querySelector("#zrCv");
    el.querySelector("#zrClose").onclick = () => finishMatch(false);
    el.querySelector("#zrStart").onclick = () => { if (S.phase === "intro") { S.phase = "kick"; S.timer = 60; el.querySelector("#zrStart").style.display = "none"; el.querySelector("#zrKick").style.display = "block"; } };
    const k = el.querySelector("#zrKick");
    k.addEventListener("pointerdown", (e) => { e.preventDefault(); S.kickReq = true; });
    el.querySelector("#zrDone").onclick = () => finishMatch(S.scoreA > S.scoreB);
    if (S.opts.auto) { el.querySelector("#zrStart").style.display = "none"; }
  }
  function unmountUI() { const el = document.getElementById("zonarossa-overlay"); if (el && el.parentNode) el.parentNode.removeChild(el); S.root = null; S.cv = null; }

  const pt = (e) => { const r = S.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; };
  function onDown(e) { if (!S.active || S.phase === "intro") return; e.preventDefault(); const p = pt(e); S.stick = { x0: p.x, y0: p.y, dx: 0, dy: 0 }; }
  function onMove(e) {
    if (!S.active || !S.stick) return; const p = pt(e);
    let dx = p.x - S.stick.x0, dy = p.y - S.stick.y0; const l = Math.hypot(dx, dy);
    if (l > 24) { dx *= 24 / l; dy *= 24 / l; }
    S.stick.dx = dx; S.stick.dy = dy; S.ix = dx / 24; S.iy = dy / 24;
  }
  function onUp() { if (!S.active) return; S.stick = null; S.ix = S.iy = 0; }
  function onKeyDown(e) {
    if (!S.active) return;
    const k = e.key;
    if (k === "ArrowUp" || k === "w") S.kb.u = true; if (k === "ArrowDown" || k === "s") S.kb.d = true;
    if (k === "ArrowLeft" || k === "a") S.kb.l = true; if (k === "ArrowRight" || k === "d") S.kb.r = true;
    if (k === " " || k === "Enter") { e.preventDefault(); if (S.phase === "intro") { const b = S.root && S.root.querySelector("#zrStart"); if (b) b.click(); } else S.kickReq = true; }
  }
  function onKeyUp(e) { const k = e.key; if (k === "ArrowUp" || k === "w") S.kb.u = false; if (k === "ArrowDown" || k === "s") S.kb.d = false; if (k === "ArrowLeft" || k === "a") S.kb.l = false; if (k === "ArrowRight" || k === "d") S.kb.r = false; }
  function bindEvents() {
    S.cv.addEventListener("pointerdown", onDown); window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp);
  }
  function unbindEvents() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); }

  function loop() {
    if (!S.active) return;
    if (S.phase !== "intro") for (let k = S.opts.fast ? 24 : 1; k > 0 && S.active; k--) update();
    else S.t++;
    if (S.cv) { const g = S.cv.getContext("2d"); if (g) render(g); }
    if (S.active) S.raf = requestAnimationFrame(loop);
  }

  window.__zonarossa = {
    start: startMatch, _dbg: { S, update },
    state: {
      get active() { return S.active; }, get raw() { return S; }, get scoreA() { return S.scoreA; }, get scoreB() { return S.scoreB; },
      finish: function (win) { if (typeof win === "boolean") { if (win && S.scoreA <= S.scoreB) S.scoreA = S.scoreB + 1; } finishMatch(S.scoreA > S.scoreB); }
    }
  };
})();
