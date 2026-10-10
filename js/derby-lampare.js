/* Derby delle Lampare — 4 contro 4 giocato, di notte, sulla sabbia.
   Passaggio a peso, tiro caricato, vento di mare, Tiro di Elio.
   window.openDerbyLampare(onExit | {onExit, story, elio, wind}) */
(function () {
  "use strict";
  const SAVE = "ali-di-rondine.caletta";
  const SND = "ali-di-rondine.suoni";
  const VW = 1000, VH = 620;
  const F = { l: 86, t: 46, r: 914, b: 574 };
  const MIDY = (F.t + F.b) / 2;
  const GH = 156;
  const GT = MIDY - GH / 2;
  const GB = MIDY + GH / 2;
  const HOME = ["Sandro", "Chicco", "Leo", "Nico"];
  const AWAY = ["Lampara", "Nino", "Mira", "Elio"];

  let root, cv, ctx, raf, alive, onExit, opts;
  let M, keys = {}, stick = { on: false, x: 0, y: 0 };
  let hold = { pass: 0, shot: 0, sprint: false, tackle: false, elio: false };
  const listeners = [];

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function len(x, y) { return Math.hypot(x, y); }
  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function soundOn() { try { return localStorage.getItem(SND) !== "off"; } catch (e) { return true; } }
  function blip(freq, dur, type, gain) {
    if (!soundOn()) return;
    try {
      const ac = window.__derbyAC || (window.__derbyAC = new (window.AudioContext || window.webkitAudioContext)());
      if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, ac.currentTime);
      g.gain.setValueAtTime(gain || 0.05, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + dur + 0.02);
    } catch (e) {}
  }
  function elioKnown(force) {
    if (force) return true;
    try {
      const d = JSON.parse(localStorage.getItem(SAVE) || "null");
      return !!(d && (d.elio || d.step >= 5 || (d.endings && d.endings.length)));
    } catch (e) { return false; }
  }
  function heroName() {
    try { const h = window.heroLoad && window.heroLoad(); if (h && h.name) return h.name; } catch (e) {}
    return "Leo";
  }

  function spawnTeam(team) {
    const form = [
      { role: "GK", fx: 0.07, fy: 0.50 },
      { role: "DF", fx: 0.30, fy: 0.30 },
      { role: "MD", fx: 0.48, fy: 0.66 },
      { role: "FW", fx: 0.70, fy: 0.40 },
    ];
    const names = team === 0 ? HOME.slice() : AWAY.slice();
    if (team === 0) names[2] = heroName();
    const span = F.r - F.l;
    const tall = F.b - F.t;
    return form.map((f, i) => {
      const x = team === 0 ? F.l + span * f.fx : F.r - span * f.fx;
      const y = F.t + tall * f.fy;
      return { team, i, role: f.role, name: names[i], x, y, vx: 0, vy: 0, face: team === 0 ? 0 : Math.PI, hx: x, hy: y, cd: 0, lung: 0 };
    });
  }

  function create(o) {
    const story = !!(o && o.story);
    const dur = story ? 76 : 100;
    const m = {
      story, dur, time: 0, half: 1, phase: "play", phaseT: 0,
      us: 0, them: 0, wind: { x: (o && o.wind) || 36, y: 14 },
      elio: elioKnown(o && o.elio), elioCd: 0,
      msg: "Fischio d'inizio. La sabbia è bassa, il vento no.",
      msgT: 2.2, shake: 0, players: [], ball: null, ctrl: 2, kickTeam: 0,
    };
    m.players = spawnTeam(0).concat(spawnTeam(1));
    m.ball = { x: (F.l + F.r) / 2, y: MIDY, z: 0, vx: 0, vy: 0, vz: 0, owner: null, last: 0, curl: 0, special: 0 };
    const k = m.players[2];
    m.ball.owner = k;
    return m;
  }

  function resetPositions(kickTeam) {
    const fresh = spawnTeam(0).concat(spawnTeam(1));
    fresh.forEach((p, i) => {
      M.players[i].x = p.x; M.players[i].y = p.y;
      M.players[i].vx = 0; M.players[i].vy = 0; M.players[i].lung = 0;
    });
    const b = M.ball;
    b.x = (F.l + F.r) / 2; b.y = MIDY; b.z = 0; b.vx = 0; b.vy = 0; b.vz = 0; b.curl = 0; b.special = 0;
    const recv = M.players.find((p) => p.team === kickTeam && p.role === "MD");
    b.owner = recv;
    b.last = kickTeam;
    M.ctrl = recv.i;
  }

  function controlPlayer() {
    const ours = M.players.filter((p) => p.team === 0);
    const b = M.ball;
    if (b.owner && b.owner.team === 0) return b.owner;
    let best = ours[2], bd = 1e9;
    ours.forEach((p) => {
      if (p.role === "GK" && dist(p, b) > 70) return;
      const d = dist(p, b);
      if (d < bd) { bd = d; best = p; }
    });
    return best;
  }

  function inputVec() {
    let x = 0, y = 0;
    if (keys.a || keys.arrowleft) x -= 1;
    if (keys.d || keys.arrowright) x += 1;
    if (keys.w || keys.arrowup) y -= 1;
    if (keys.s || keys.arrowdown) y += 1;
    if (stick.on) { x += stick.x; y += stick.y; }
    const l = len(x, y);
    if (l > 1) { x /= l; y /= l; }
    return { x, y, l };
  }

  function steer(p, tx, ty, dt, spd) {
    const dx = tx - p.x, dy = ty - p.y, d = len(dx, dy) || 1;
    const ux = dx / d, uy = dy / d;
    p.vx = ux * spd; p.vy = uy * spd;
    if (d > 4) p.face = Math.atan2(uy, ux);
    p.x = clamp(p.x + p.vx * dt, F.l + 16, F.r - 16);
    p.y = clamp(p.y + p.vy * dt, F.t + 14, F.b - 14);
  }

  function kick(p, ang, spd, lift, special) {
    const b = M.ball;
    b.owner = null;
    b.x = p.x + Math.cos(ang) * 18;
    b.y = p.y + Math.sin(ang) * 18;
    b.z = 2;
    b.vx = Math.cos(ang) * spd;
    b.vy = Math.sin(ang) * spd;
    b.vz = lift;
    b.last = p.team;
    b.curl = special ? (p.y < MIDY ? 70 : -70) : 0;
    b.special = special ? 1.1 : 0;
    p.cd = 0.28;
    blip(special ? 520 : 180, special ? 0.18 : 0.06, special ? "sawtooth" : "triangle", special ? 0.05 : 0.04);
  }

  function nearestMate(p, aim) {
    let best = null, score = -1e9;
    M.players.forEach((q) => {
      if (q === p || q.team !== p.team || q.role === "GK") return;
      const dx = q.x - p.x, dy = q.y - p.y;
      const d = len(dx, dy);
      if (d < 28 || d > 340) return;
      const dir = Math.atan2(aim.y, aim.x || (p.team === 0 ? 1 : -1));
      const ang = Math.atan2(dy, dx);
      let diff = Math.abs(Math.atan2(Math.sin(ang - dir), Math.cos(ang - dir)));
      if (Math.abs(aim.x) + Math.abs(aim.y) < 0.2) diff = 0.4;
      const s = 180 - d * 0.35 - diff * 80;
      if (s > score) { score = s; best = q; }
    });
    return best;
  }

  function doPass(p, power, aim) {
    const m = nearestMate(p, aim);
    if (!m) { doShot(p, power * 0.45, aim); return; }
    const gx = p.team === 0 ? 1 : -1;
    const lead = 24 + power * 110;
    const tx = clamp(m.x + gx * lead, F.l + 20, F.r - 20);
    const ty = clamp(m.y + aim.y * 20, F.t + 16, F.b - 16);
    const ang = Math.atan2(ty - p.y, tx - p.x);
    const d = Math.hypot(tx - p.x, ty - p.y);
    kick(p, ang, clamp(280 + d * 0.9 + power * 80, 260, 640), power > 0.62 ? 70 : 12, 0);
    M.msg = power > 0.62 ? "Traversone. Il vento ci mette la firma." : "Passaggio filtrante, o quasi.";
    M.msgT = 1.3;
  }

  function doShot(p, power, aim) {
    const gx = p.team === 0 ? F.r + 6 : F.l - 6;
    let gy = MIDY + (Math.random() * 2 - 1) * 24;
    if (p.team === 0 && Math.abs(aim.y) > 0.15) gy = MIDY + clamp(aim.y, -1, 1) * (GH * 0.42);
    gy = clamp(gy, GT + 10, GB - 10);
    const ang = Math.atan2(gy - p.y, gx - p.x);
    kick(p, ang, 420 + 380 * power, 50 + 190 * power * power, 0);
    M.msg = power > 0.75 ? "Tiro carico. La sabbia si alza dopo." : "Conclusione.";
    M.msgT = 1.2;
  }

  function doElio(p, aim) {
    if (!M.elio || M.elioCd > 0 || !M.ball.owner || M.ball.owner !== p) return;
    const attacking = p.team === 0 ? p.x > (F.l + F.r) / 2 : p.x < (F.l + F.r) / 2;
    if (!attacking) { M.msg = "Il Tiro di Elio nasce oltre la metà campo."; M.msgT = 1.4; return; }
    const gx = p.team === 0 ? F.r + 4 : F.l - 4;
    const gy = clamp(MIDY + (aim.y || 0) * GH * 0.4, GT + 12, GB - 12);
    const ang = Math.atan2(gy - p.y, gx - p.x);
    kick(p, ang, 700, 210, 1);
    M.elioCd = 18;
    M.msg = "Tiro di Elio. Sale, mente, e rientra.";
    M.msgT = 1.8;
  }

  function tackle(p) {
    if (p.cd > 0 || p.lung > 0) return;
    p.lung = 0.18;
    p.hit = false;
    p.face = p.face || 0;
    p.lvx = Math.cos(p.face) * 320;
    p.lvy = Math.sin(p.face) * 320;
    p.cd = 0.55;
    blip(90, 0.05, "square", 0.03);
  }

  function closestToBall(team) {
    let best = null, bd = 1e9;
    M.players.forEach((p) => {
      if (p.team !== team || p.role === "GK") return;
      const d = dist(p, M.ball);
      if (d < bd) { bd = d; best = p; }
    });
    return best;
  }

  function ai(p, dt, user) {
    if (p === user || p.lung > 0) return;
    const b = M.ball;
    let tx = p.hx, ty = p.hy, spd = p.team === 0 ? 168 : 176;
    if (p.role === "GK") {
      tx = p.hx;
      const targetY = b.owner ? b.owner.y : b.y + b.vy * 0.15;
      ty = clamp(targetY, GT + 8, GB - 8);
      spd = 200;
      steer(p, tx, ty, dt, spd);
      return;
    }
    if (b.owner === p) {
      const gx = p.team === 0 ? F.r : F.l;
      const near = Math.abs(p.x - gx) < 200;
      if (near && Math.random() < dt * 1.6) doShot(p, 0.62, { x: 0, y: (MIDY - p.y) / 80 });
      else if (Math.random() < dt * 0.7) doPass(p, 0.4, { x: p.team === 0 ? 1 : -1, y: 0 });
      else steer(p, gx, MIDY + Math.sin(M.time * 2 + p.i) * 50, dt, spd);
      return;
    }
    const loose = !b.owner;
    const chasing = loose || (b.owner && b.owner.team !== p.team);
    if (chasing && closestToBall(p.team) === p) {
      tx = b.x; ty = b.y; spd = 200;
      if (b.owner && b.owner.team !== p.team && dist(p, b.owner) < 26 && p.cd <= 0) tackle(p);
    } else {
      const push = (b.owner && b.owner.team === p.team ? 1 : 0.35) * (p.team === 0 ? 36 : -36);
      tx = clamp(p.hx + (b.x - p.hx) * 0.22 + push, F.l + 30, F.r - 30);
      ty = clamp(p.hy + (b.y - p.hy) * 0.18, F.t + 20, F.b - 20);
    }
    steer(p, tx, ty, dt, spd);
  }

  function moveUser(p, dt, aim) {
    const sprint = keys.shift || hold.sprint;
    const spd = (sprint ? 236 : 188) * (p.role === "GK" ? 0.86 : 1);
    if (aim.l > 0.12) {
      p.face = Math.atan2(aim.y, aim.x);
      p.vx = aim.x * spd; p.vy = aim.y * spd;
    } else {
      p.vx *= Math.exp(-8 * dt); p.vy *= Math.exp(-8 * dt);
    }
    p.x = clamp(p.x + p.vx * dt, F.l + 16, F.r - 16);
    p.y = clamp(p.y + p.vy * dt, F.t + 14, F.b - 14);
  }

  function physics(dt) {
    const b = M.ball;
    if (b.special > 0) {
      b.special -= dt;
      b.vy += b.curl * dt * (b.special > 0.45 ? 1 : -1.4);
    }
    if (!b.owner) {
      b.vz -= 620 * dt;
      b.z += b.vz * dt;
      if (b.z <= 0) {
        b.z = 0;
        if (b.vz < 0) b.vz *= -0.25;
        if (Math.abs(b.vz) < 30) b.vz = 0;
        b.vx *= Math.exp(-1.55 * dt);
        b.vy *= Math.exp(-1.55 * dt);
      } else {
        b.vx += M.wind.x * dt * 2.2;
        b.vy += M.wind.y * dt * 2.2;
        b.vx *= Math.exp(-0.12 * dt);
        b.vy *= Math.exp(-0.12 * dt);
      }
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.z < 16) {
        let best = null, bd = 18;
        M.players.forEach((p) => {
          if (p.cd > 0.2) return;
          const d = dist(p, b);
          if (d < bd) { bd = d; best = p; }
        });
        if (best && len(b.vx, b.vy) < 520) b.owner = best;
      }
    } else {
      const p = b.owner;
      const mouth = 16;
      b.x = p.x + Math.cos(p.face) * mouth;
      b.y = p.y + Math.sin(p.face) * mouth;
      b.z = 0; b.vx = p.vx; b.vy = p.vy; b.vz = 0;
    }
    const inMouth = b.y > GT + 4 && b.y < GB - 4 && b.z < 28;
    if (b.x >= F.r && inMouth) return score(0);
    if (b.x <= F.l && inMouth) return score(1);
    if (b.x < F.l - 6 || b.x > F.r + 6 || b.y < F.t - 6 || b.y > F.b + 6) {
      const who = b.last === 0 ? 1 : 0;
      b.x = clamp(b.x, F.l + 10, F.r - 10);
      b.y = clamp(b.y, F.t + 10, F.b - 10);
      b.vx = 0; b.vy = 0; b.vz = 0; b.z = 0; b.owner = null; b.curl = 0; b.special = 0;
      const recv = M.players.find((p) => p.team === who && p.role !== "GK");
      if (recv) { recv.x = b.x; recv.y = b.y; b.owner = recv; }
      M.msg = "Rinvio dalla sabbia. Niente rimesse lunghe: il mare è il quarto uomo.";
      M.msgT = 1.2;
    }
  }

  function score(team) {
    if (team === 0) M.us += 1; else M.them += 1;
    M.phase = "goal";
    M.phaseT = 1.35;
    M.kickTeam = team === 0 ? 1 : 0;
    M.shake = 8;
    M.msg = team === 0 ? "Gol delle Rondine. La rete tiene, per poco." : "Gol delle Lampare. La lampada non perdona.";
    M.msgT = 1.6;
    blip(team === 0 ? 660 : 220, 0.2, "square", 0.05);
    M.ball.owner = null; M.ball.vx = 0; M.ball.vy = 0;
  }

  function step(dt) {
    if (!M) return;
    dt = Math.min(dt, 0.05);
    M.time += M.phase === "play" ? dt : 0;
    M.msgT = Math.max(0, M.msgT - dt);
    M.shake = Math.max(0, M.shake - dt * 18);
    M.elioCd = Math.max(0, M.elioCd - dt);
    M.players.forEach((p) => { p.cd = Math.max(0, p.cd - dt); });
    if (M.phase === "goal" || M.phase === "half") {
      M.phaseT -= dt;
      if (M.phaseT <= 0) {
        if (M.phase === "half") { M.wind.x *= -1; M.wind.y *= -0.6; M.half = 2; }
        const kick = M.phase === "goal" ? M.kickTeam : 1;
        M.phase = "play";
        resetPositions(kick);
      }
      return;
    }
    if (M.half === 1 && M.time >= M.dur / 2) {
      M.phase = "half"; M.phaseT = 1.5;
      M.msg = "Intervallo. Il vento cambia lato, come le versioni della storia.";
      M.msgT = 1.6;
      return;
    }
    if (M.time >= M.dur) {
      M.phase = "end";
      M.msg = M.us === M.them ? "Pareggio. La marea non firma autografi." : (M.us > M.them ? "Vittoria sulla sabbia." : "Le Lampare tengono il pallone, stanotte.");
      return;
    }
    const user = controlPlayer();
    M.ctrl = user.i;
    const aim = inputVec();
    if (user.lung > 0) {
      user.lung -= dt;
      user.x = clamp(user.x + user.lvx * dt, F.l + 16, F.r - 16);
      user.y = clamp(user.y + user.lvy * dt, F.t + 14, F.b - 14);
    } else moveUser(user, dt, aim);
    M.players.forEach((p) => {
      if (p.lung > 0 && p !== user) {
        p.lung -= dt;
        p.x = clamp(p.x + p.lvx * dt, F.l + 16, F.r - 16);
        p.y = clamp(p.y + p.lvy * dt, F.t + 14, F.b - 14);
      }
      ai(p, dt, user);
      const owner = M.ball.owner;
      if (p.lung > 0 && !p.hit && owner && owner !== p && dist(p, owner) < 22) {
        p.hit = true;
        const dot = Math.cos(p.face) * (owner.x - p.x) + Math.sin(p.face) * (owner.y - p.y);
        if (dot > 0) {
          M.ball.owner = p;
          M.msg = p.team === 0 ? "Palla recuperata." : "Contrasto delle Lampare.";
          M.msgT = 0.8;
        } else if (p.team !== owner.team) {
          M.msg = "Fallo alle spalle. Il vento fischia al posto dell'arbitro.";
          M.msgT = 1.3;
          p.cd = 0.8;
          M.ball.owner = owner;
        }
      }
    });
    if (hold.pass > 0) hold.pass += dt;
    if (hold.shot > 0) hold.shot += dt;
    if (hold.tackle) { tackle(user); hold.tackle = false; }
    if (hold.elio) { doElio(user, aim); hold.elio = false; }
    physics(dt);
  }

  function release(kind) {
    if (!M || M.phase !== "play") return;
    const user = controlPlayer();
    if (!M.ball.owner || M.ball.owner !== user) { hold[kind] = 0; return; }
    const power = clamp((hold[kind] || 0.08) / 0.55, 0.12, 1);
    const aim = inputVec();
    if (kind === "pass") doPass(user, power, aim);
    if (kind === "shot") doShot(user, power, aim);
    hold[kind] = 0;
  }

  function draw() {
    const w = cv.width, h = cv.height;
    const sx = w / VW, sy = h / VH, s = Math.min(sx, sy);
    const ox = (w - VW * s) / 2, oy = (h - VH * s) / 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#061018";
    ctx.fillRect(0, 0, w, h);
    ctx.setTransform(s, 0, 0, s, ox + (M.shake ? (Math.random() - 0.5) * M.shake : 0), oy);
    const sea = ctx.createLinearGradient(0, 0, 0, VH);
    sea.addColorStop(0, "#0b2944");
    sea.addColorStop(1, "#07111c");
    ctx.fillStyle = sea;
    ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = "rgba(186,230,253,.15)";
    ctx.fillRect(0, 18 + Math.sin(M.time) * 2, VW, 8);
    ctx.fillStyle = "#c6a36a";
    round(F.l, F.t, F.r - F.l, F.b - F.t, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.8)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo((F.l + F.r) / 2, F.t); ctx.lineTo((F.l + F.r) / 2, F.b); ctx.stroke();
    ctx.beginPath(); ctx.arc((F.l + F.r) / 2, MIDY, 54, 0, 7); ctx.stroke();
    [[F.l, 0], [F.r, Math.PI]].forEach(([x, rot]) => {
      ctx.save(); ctx.translate(x, MIDY); ctx.rotate(rot);
      ctx.strokeRect(0, -70, 70, 140);
      ctx.restore();
    });
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#e7e5e4";
    [[F.l, GT, F.l, GB], [F.r, GT, F.r, GB]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    // luci
    [[120, 40], [880, 40], [120, 580], [880, 580]].forEach((p, i) => {
      const g = ctx.createRadialGradient(p[0], p[1], 4, p[0], p[1], 90);
      g.addColorStop(0, "rgba(253,224,71,.35)");
      g.addColorStop(1, "rgba(253,224,71,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p[0], p[1], 90, 0, 7); ctx.fill();
    });
    const b = M.ball;
    M.players.forEach((p) => drawP(p, p === controlPlayer()));
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.beginPath(); ctx.ellipse(b.x, b.y + 10 + b.z * 0.05, 8, 4, 0, 0, 7); ctx.fill();
    ctx.fillStyle = b.special > 0 ? "#fde68a" : "#f8fafc";
    ctx.beginPath(); ctx.arc(b.x, b.y - b.z * 0.45, 7, 0, 7); ctx.fill();
    ctx.strokeStyle = "#1d4ed8"; ctx.lineWidth = 2;
    ctx.stroke();
    hud();
    if (M.phase === "end") endCard();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function round(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawP(p, mine) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.beginPath(); ctx.ellipse(2, 8, 11, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = p.team === 0 ? "#1d4ed8" : "#eab308";
    ctx.beginPath(); ctx.arc(0, 0, mine ? 13 : 11, 0, 7); ctx.fill();
    ctx.lineWidth = mine ? 3 : 1;
    ctx.strokeStyle = mine ? "#fff" : "rgba(0,0,0,.35)";
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = "700 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(p.role === "GK" ? "P" : String(p.i + 1), 0, 3);
    if (mine) {
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#fef3c7";
      ctx.fillText(p.name, 0, -18);
    }
    ctx.restore();
  }

  function hud() {
    ctx.fillStyle = "rgba(6,12,24,.78)";
    round(16, 10, 360, 46, 10); ctx.fill();
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Rondine  " + M.us + "  –  " + M.them + "  Lampare", 28, 40);
    const minute = Math.min(90, Math.floor((M.time / M.dur) * 90));
    ctx.font = "13px sans-serif";
    ctx.fillText(minute + "'  ·  " + (M.half === 1 ? "1° tempo" : "2° tempo"), 250, 40);
    ctx.fillStyle = "rgba(6,12,24,.78)";
    round(390, 10, 250, 46, 10); ctx.fill();
    ctx.fillStyle = "#fde68a";
    ctx.font = "13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Vento", 404, 30);
    ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(470, 32);
    ctx.lineTo(470 + clamp(M.wind.x, -70, 70), 32 + clamp(M.wind.y, -16, 16));
    ctx.stroke();
    if (M.elio) {
      ctx.fillStyle = M.elioCd > 0 ? "#cbd5e1" : "#fbbf24";
      ctx.fillText(M.elioCd > 0 ? "Elio " + Math.ceil(M.elioCd) + "s" : "Tiro di Elio pronto  ·  G", 404, 48);
    }
    if (M.msgT > 0) {
      ctx.fillStyle = "rgba(6,12,24,.8)";
      round(150, VH - 128, 700, 32, 8); ctx.fill();
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(M.msg, VW / 2, VH - 107);
    }
    if (hold.shot > 0 || hold.pass > 0) {
      const pwr = clamp(((hold.shot || hold.pass) ) / 0.55, 0, 1);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(VW / 2 - 80, 64, 160, 8);
      ctx.fillStyle = hold.shot > 0 ? "#f97316" : "#38bdf8";
      ctx.fillRect(VW / 2 - 80, 64, 160 * pwr, 8);
    }
  }

  function endCard() {
    ctx.fillStyle = "rgba(2,6,16,.72)";
    ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "700 28px sans-serif";
    ctx.fillText(M.us + " – " + M.them, VW / 2, VH / 2 - 30);
    ctx.font = "16px sans-serif";
    ctx.fillText(M.msg, VW / 2, VH / 2 + 4);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#fde68a";
    ctx.fillText(M.story ? "Invio  ·  torna alla caletta" : "Invio  ·  rivincita    Esc  ·  esci", VW / 2, VH / 2 + 40);
  }

  function finish(quit) {
    const res = { us: M ? M.us : 0, them: M ? M.them : 0, quit: !!quit };
    const cb = onExit;
    destroy();
    if (cb) cb(res);
  }

  function destroy() {
    alive = false;
    cancelAnimationFrame(raf);
    listeners.splice(0).forEach(([el, ev, fn, opt]) => el.removeEventListener(ev, fn, opt));
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null; M = null; keys = {}; hold = { pass: 0, shot: 0, sprint: false, tackle: false, elio: false };
  }

  function on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); listeners.push([el, ev, fn, opt]); }

  function loop(now) {
    if (!alive || !M) return;
    const dt = Math.min(0.04, ((now - (loop.p || now)) / 1000) || 0.016);
    loop.p = now;
    if (M.phase !== "end") step(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function button(label, css) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.style.cssText = "border:0;border-radius:999px;color:#fff;font-weight:700;cursor:pointer;touch-action:none;" + css;
    return b;
  }

  function open(back, maybe) {
    let o = {};
    if (typeof back === "function") { onExit = back; o = maybe || {}; }
    else { o = back || {}; onExit = o.onExit || null; }
    if (alive) destroy();
    opts = o;
    M = create(o);
    alive = true;
    root = document.createElement("div");
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "Derby delle Lampare");
    root.style.cssText = "position:fixed;inset:0;z-index:10040;background:#061018;touch-action:none;font-family:sans-serif;";
    cv = document.createElement("canvas");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    root.appendChild(cv);
    const exit = button("Esci", "position:absolute;top:12px;right:12px;z-index:2;background:#111827;border:1px solid #fbbf24;padding:8px 14px;");
    exit.onclick = () => finish(true);
    root.appendChild(exit);
    const joy = document.createElement("div");
    joy.style.cssText = "position:absolute;left:16px;bottom:16px;width:120px;height:120px;border-radius:60px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.25);z-index:2;";
    const knob = document.createElement("div");
    knob.style.cssText = "position:absolute;width:44px;height:44px;border-radius:22px;background:#fff;left:38px;top:38px;";
    joy.appendChild(knob);
    root.appendChild(joy);
    const bar = document.createElement("div");
    bar.style.cssText = "position:absolute;right:16px;bottom:16px;display:flex;gap:8px;z-index:2;";
    const bPass = button("Pass", "width:68px;height:68px;background:#0284c7;");
    const bShot = button("Tiro", "width:68px;height:68px;background:#ea580c;");
    const bTak = button("Entr", "width:68px;height:68px;background:#334155;");
    const bEli = button("Elio", "width:68px;height:68px;background:#b45309;");
    bar.appendChild(bPass); bar.appendChild(bShot); bar.appendChild(bTak);
    if (M.elio) bar.appendChild(bEli);
    root.appendChild(bar);
    document.body.appendChild(root);
    ctx = cv.getContext("2d");
    function fit() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.floor(root.clientWidth * dpr);
      cv.height = Math.floor(root.clientHeight * dpr);
    }
    fit();
    function setStick(ev, onStick) {
      if (!onStick) { stick.on = false; stick.x = 0; stick.y = 0; knob.style.left = "38px"; knob.style.top = "38px"; return; }
      const box = joy.getBoundingClientRect();
      let dx = ev.clientX - (box.left + box.width / 2);
      let dy = ev.clientY - (box.top + box.height / 2);
      const m = Math.hypot(dx, dy) || 1;
      const k = Math.min(38, m);
      stick.on = k > 8;
      stick.x = (dx / m) * (k / 38);
      stick.y = (dy / m) * (k / 38);
      knob.style.left = (38 + (dx / m) * k) + "px";
      knob.style.top = (38 + (dy / m) * k) + "px";
    }
    on(joy, "pointerdown", (e) => { joy.setPointerCapture(e.pointerId); setStick(e, true); e.preventDefault(); });
    on(joy, "pointermove", (e) => { if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) setStick(e, true); });
    on(joy, "pointerup", () => setStick(null, false));
    function bindHold(btn, key) {
      on(btn, "pointerdown", (e) => { e.preventDefault(); hold[key] = 0.01; if (key === "tackle" || key === "elio") hold[key] = true; });
      on(btn, "pointerup", () => { if (key === "pass" || key === "shot") release(key); });
      on(btn, "pointerleave", () => { if (hold[key] > 0 && (key === "pass" || key === "shot")) release(key); });
    }
    bindHold(bPass, "pass"); bindHold(bShot, "shot"); bindHold(bTak, "tackle"); bindHold(bEli, "elio");
    on(window, "resize", fit);
    on(window, "keydown", (e) => {
      if (!alive) return;
      const k = e.key.toLowerCase();
      if ([" ", "enter", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k) || "wasdjklg".includes(k) || k === "escape" || k === "shift") {
        e.preventDefault(); e.stopImmediatePropagation();
      }
      if (k === "escape") { finish(true); return; }
      if (k === "enter" && M && M.phase === "end") {
        if (M.story) finish(false);
        else { const keep = onExit; const o2 = opts; destroy(); open(keep, o2); }
        return;
      }
      if (k === "j" && !hold.pass) hold.pass = 0.01;
      if (k === "k" && !hold.shot) hold.shot = 0.01;
      if (k === "l") hold.tackle = true;
      if (k === "g") hold.elio = true;
      if (k === "shift") hold.sprint = true;
      keys[k] = true;
    }, true);
    on(window, "keyup", (e) => {
      const k = e.key.toLowerCase();
      keys[k] = false;
      if (k === "j") release("pass");
      if (k === "k") release("shot");
      if (k === "shift") hold.sprint = false;
    }, true);
    raf = requestAnimationFrame(loop);
  }

  window.openDerbyLampare = open;
  window.__derbyLampare = { open, _create: create, _step: step, _release: release, _get() { return M; }, _set(m) { M = m; }, _hold: hold, _keys: keys };
})();
