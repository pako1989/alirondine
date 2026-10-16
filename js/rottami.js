// js/rottami.js - «CAMPO DI ROTTAMI» · Motore di partita originale di «Cenere e Gloria»
// Partita a turni su un campo di lamiere: si tira con la fionda a molla (trascina e rilascia) e si para con lo scudo di latta.
//  - 5 tiri a testa, alternati: tiro tuo (fionda), poi tiro avversario (scudo che muovi col dito)
//  - Lamiere mobili che deviano il pallone, vento di sabbia che spinge in verticale, portiere di latta
//  - Parità dopo i 5 turni: tre turni ad oltranza, poi vince chi ha segnato di più; se resta pari è sconfitta
(function () {
  "use strict";
  if (window.__rottami) return;

  const W = 360, H = 210, GY = 178, R = 5, G = 0.07, GOAL_TOP = 92;
  const PANELS = [{ x: 118, base: 158, amp: 10, h: 28, ph: 0, sp: 1 }, { x: 168, base: 66, amp: 22, h: 34, ph: 2.1, sp: 1.3 }, { x: 218, base: 112, amp: 24, h: 30, ph: 4.2, sp: 0.8 }];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let audioCtx = null;
  function snd(kind) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === "suspended") audioCtx.resume();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime;
      const f = { clang: [220, 90, 0.12], goal: [440, 880, 0.3], save: [160, 120, 0.15], shoot: [300, 150, 0.1] }[kind] || [200, 100, 0.1];
      o.type = kind === "clang" ? "square" : "triangle";
      o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t + f[2]);
      g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + f[2]);
      o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + f[2] + 0.02);
    } catch (e) {}
  }

  const S = {
    active: false, opts: {}, raf: null, onDone: null, root: null, cv: null,
    scoreA: 0, scoreB: 0, round: 0, rounds: [], extra: 0, phase: "intro", timer: 0, t: 0,
    ball: null, shield: { y: 150, ty: 150 }, keeper: { y: 150 }, wind: 0, lvl: 0.55,
    drag: null, banner: "", sub: "", kb: { u: false, d: false }, hist: [], fx: [], lastRes: ""
  };

  function level() {
    const c = (window.__sagaCore && window.__sagaCore.cur) || {};
    const d = String(c.diff || "normale");
    return d === "storia" ? 0.35 : d === "sfida" ? 0.78 : 0.55;
  }
  const bonus = () => S.opts.bonus || {};
  const panelY = (p, t) => p.base + p.amp * Math.sin(t * 0.03 * p.sp + p.ph);
  const windNow = () => S.wind * (1 - 0.1 * (bonus().te || 0));

  function newBall(attack) {
    return attack ? { x: 34, y: 166, vx: 0, vy: 0, fly: false, age: 0, side: "A" } : { x: 338, y: 150, vx: 0, vy: 0, fly: false, age: 0, side: "B" };
  }

  // un passo di fisica: ritorna null se la palla vola ancora, altrimenti "goal" | "save" | "miss"
  function stepBall(b, t, keeperY, shieldY, shieldH, out) {
    b.age++;
    b.vy += G + windNow();
    b.x += b.vx; b.y += b.vy;
    if (b.y + R >= GY) { b.y = GY - R; b.vy = -b.vy * 0.45; b.vx *= 0.82; if (Math.abs(b.vy) < 0.6) b.vy = 0; }
    if (b.y - R < 0) { b.y = R; b.vy = Math.abs(b.vy) * 0.4; }
    for (const p of PANELS) {
      const cy = panelY(p, t);
      if (Math.abs(b.x - p.x) < 4 + R && Math.abs(b.y - cy) < p.h / 2 + R) {
        b.vx = -b.vx * 0.4; b.vy += (b.y - cy) * 0.05;
        b.x = b.x < p.x ? p.x - 4 - R - 0.5 : p.x + 4 + R + 0.5;
        if (out) out.clang = true;
      }
    }
    if (b.side === "A") {
      if (Math.abs(b.x - 307) < 7 + R && Math.abs(b.y - keeperY) < 11 + R) { b.vx = -Math.abs(b.vx) * 0.5; return "save"; }
      if (b.x >= 322) return b.y >= GOAL_TOP ? "goal" : "miss";
      if (b.x < 0 || b.y > H) return "miss";
    } else {
      if (b.x <= 56 && b.x >= 40 && Math.abs(b.y - shieldY) < shieldH / 2 + R) { b.vx = Math.abs(b.vx) * 0.5 + 1; return "save"; }
      if (b.x <= 22) return b.y >= GOAL_TOP ? "goal" : "miss";
      if (b.x > W + 20 || b.y > H) return "miss";
    }
    if (b.age > 420) return "miss";
    if (b.y >= GY - R - 0.5 && Math.abs(b.vx) < 0.35 && b.age > 30) return "miss";
    return null;
  }

  function shieldH() { return 38 + 3 * (bonus().df || 0); }

  // simula un tiro a vuoto per l'anteprima e per il pilota automatico
  function simulate(vx, vy, t0, maxSteps) {
    const b = { x: 34, y: 166, vx, vy, age: 0, side: "A" };
    const pts = [];
    let ky = S.keeper.y;
    for (let i = 0; i < maxSteps; i++) {
      const sp = 0.6 + S.lvl * 1.0; ky = clamp(ky + clamp((b.y - ky) * 0.06, -sp, sp), 112, 164);
      const r = stepBall(b, t0 + i, ky, 0, 0, null);
      pts.push([b.x, b.y]);
      if (r) return { res: r, pts };
    }
    return { res: null, pts };
  }

  // ------------------------------------------------------------ flusso
  function startMatch(opts) {
    S.active = true; S.opts = opts || {}; S.onDone = S.opts.onDone || S.opts.done || function () {};
    S.scoreA = 0; S.scoreB = 0; S.round = 0; S.extra = 0; S.t = 0; S.hist = []; S.fx = []; S.lvl = level();
    S.rounds = []; for (let i = 0; i < 5; i++) S.rounds.push("A", "D");
    S.phase = S.opts.auto ? "aim" : "intro"; S.timer = 0; S.wind = 0; S.keeper.y = 150; S.shield.y = S.shield.ty = 150;
    S.ball = newBall(true); S.banner = "CAMPO DI ROTTAMI"; S.sub = "";
    mountUI(); bindEvents(); prepareRound();
    S.raf = requestAnimationFrame(loop);
    return true;
  }

  function prepareRound() {
    const k = S.rounds[S.round];
    S.wind = (Math.random() - 0.5) * 0.045 * (0.6 + S.lvl);
    S.ball = newBall(k === "A");
    S.drag = null;
    if (k === "A") { S.banner = "TIRA!"; S.sub = "Trascina all'indietro e rilascia: più lontano = più forte."; S.phase = S.phase === "intro" ? "intro" : "aim"; }
    else { S.banner = "PARA!"; S.sub = "Muovi lo scudo di latta su e giù col dito."; S.phase = S.phase === "intro" ? "intro" : "wait"; S.timer = 55; }
    if (S.opts.auto) S.phase = k === "A" ? "aim" : "wait";
  }

  function launchOpp() {
    const b = S.ball, lvl = S.lvl;
    let best = null;
    // il rivale prova diversi tiri a vuoto e sceglie uno che arriva in porta (più spesso se il livello è alto)
    for (let i = 0; i < 40; i++) {
      const sp = 4.6 + Math.random() * 3.6, ang = Math.PI + 0.12 + Math.random() * 0.85;
      const vx = Math.cos(ang) * sp * 1.1, vy = Math.sin(ang) * sp * 1.1;
      const c = { x: b.x, y: b.y, vx, vy, age: 0, side: "B" };
      let res = null, ty = 0;
      for (let k = 0; k < 400 && !res; k++) { res = stepBall(c, S.t + 55 + k, 0, -999, 0, null); if (c.x < 70 && !ty) ty = c.y; }
      if (res === "goal") { const away = Math.abs(ty - S.shield.y); if (!best || away > best.away) best = { vx, vy, away }; }
    }
    if (best && Math.random() < 0.15 + lvl * 0.5) { b.vx = best.vx; b.vy = best.vy + (Math.random() - 0.5) * (1 - lvl) * 0.6; }
    else { b.vx = -(4.5 + Math.random() * 3); b.vy = -(Math.random() * 3.5); }
    b.fly = true; S.phase = "fly"; snd("shoot");
  }

  function launchMine(vx, vy) {
    const b = S.ball; b.vx = vx; b.vy = vy; b.fly = true; S.phase = "fly"; snd("shoot");
  }

  function resolve(res) {
    const k = S.rounds[S.round];
    let msg;
    if (k === "A") { if (res === "goal") { S.scoreA++; msg = "GOL! Rete di rottami!"; snd("goal"); } else if (res === "save") { msg = "Parata del portiere di latta."; snd("save"); } else msg = "Fuori!"; }
    else { if (res === "goal") { S.scoreB++; msg = "Gol subito."; snd("goal"); } else if (res === "save") { msg = "PARATA!"; snd("save"); } else msg = "Fuori: ti è andata bene."; }
    S.hist.push([k, res]); S.banner = msg; S.sub = ""; S.phase = "result"; S.timer = 50;
  }

  function nextRound() {
    S.round++;
    if (S.round >= S.rounds.length) {
      if (S.scoreA !== S.scoreB || S.extra >= 3) return endMatch();
      S.extra++; S.rounds.push("A", "D");
    }
    prepareRound();
  }

  function endMatch() {
    S.phase = "end";
    const win = S.scoreA > S.scoreB;
    S.banner = win ? "VITTORIA!" : S.scoreA === S.scoreB ? "PARI: SCONFITTA" : "SCONFITTA";
    S.sub = `${S.scoreA} - ${S.scoreB}`;
    if (S.opts.auto) return finishMatch(win);
    if (S.root) { const b = S.root.querySelector("#ceDone"); if (b) b.style.display = "block"; }
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

  // ------------------------------------------------------------ pilota automatico
  function autoAim() {
    let best = null, bestScore = -1e9;
    for (let i = 0; i < 70; i++) {
      const sp = 5 + Math.random() * 4.2, ang = -0.1 - Math.random() * 0.75;
      const vx = Math.cos(ang) * sp * 1.15, vy = Math.sin(ang) * sp * 1.15;
      const r = simulate(vx, vy, S.t + 4, 380);
      const last = r.pts[r.pts.length - 1] || [0, 0];
      const sc = r.res === "goal" ? 100 - Math.abs(last[1] - 152) * 0.2 : r.res === "save" ? 10 : -Math.abs(last[0] - 320) * 0.1;
      if (sc > bestScore) { bestScore = sc; best = [vx, vy]; }
    }
    const n = (1 - S.lvl) * 0.3 + 0.15;
    if (best) launchMine(best[0] + (Math.random() - 0.5) * n, best[1] + (Math.random() - 0.5) * n);
    else launchMine(6, -2);
  }

  function autoShield() {
    const b = S.ball; if (!b.fly) return;
    const c = { x: b.x, y: b.y, vx: b.vx, vy: b.vy, age: b.age, side: "B" };
    let ty = 150;
    for (let i = 0; i < 300; i++) {
      c.vy += G + windNow(); c.x += c.vx; c.y += c.vy;
      if (c.y + R >= GY) { c.y = GY - R; c.vy = -c.vy * 0.45; c.vx *= 0.82; }
      for (const p of PANELS) { const cy = panelY(p, S.t + i); if (Math.abs(c.x - p.x) < 4 + R && Math.abs(c.y - cy) < p.h / 2 + R) { c.vx = -c.vx * 0.55; c.vy += (c.y - cy) * 0.05; c.x = c.x < p.x ? p.x - 9.5 : p.x + 9.5; } }
      if (c.x <= 56) { ty = c.y; break; }
    }
    S.shield.ty = ty + (Math.random() - 0.5) * (S.lvl * 50);
  }

  // ------------------------------------------------------------ aggiornamento
  function update() {
    S.t++;
    // portiere: oscilla, poi segue la palla
    const b = S.ball, k = S.rounds[S.round];
    if (S.phase === "fly" && k === "A") {
      const sp = 0.6 + S.lvl * 1.0; S.keeper.y += clamp((b.y - S.keeper.y) * 0.06, -sp, sp);
    } else S.keeper.y = 138 + 22 * Math.sin(S.t * 0.04);
    S.keeper.y = clamp(S.keeper.y, 112, 164);
    // scudo
    if (S.kb.u) S.shield.ty -= 3.2; if (S.kb.d) S.shield.ty += 3.2;
    S.shield.ty = clamp(S.shield.ty, 120, 170);
    S.shield.y += clamp(S.shield.ty - S.shield.y, -4.5, 4.5);

    if (S.phase === "aim" && S.opts.auto && S.t % 20 === 0) autoAim();
    if (S.phase === "wait") { if (S.opts.auto) S.shield.ty = 150; if (--S.timer <= 0) launchOpp(); }
    if (S.phase === "fly") {
      if (k === "D" && S.opts.auto) autoShield();
      const o = {};
      const res = stepBall(b, S.t, S.keeper.y, S.shield.y, shieldH(), o);
      if (o.clang) snd("clang");
      if (S.t % 2 === 0) S.fx.push([b.x, b.y, 14]);
      if (res) resolve(res);
    }
    if (S.phase === "result" && --S.timer <= 0) nextRound();
    S.fx = S.fx.map((f) => [f[0], f[1], f[2] - 1]).filter((f) => f[2] > 0);
  }

  // ------------------------------------------------------------ disegno
  function render(g) {
    const sky = g.createLinearGradient(0, 0, 0, GY);
    sky.addColorStop(0, "#3b2a1a"); sky.addColorStop(0.6, "#c9803a"); sky.addColorStop(1, "#e8b36a");
    g.fillStyle = sky; g.fillRect(0, 0, W, GY);
    g.fillStyle = "rgba(255,230,170,.55)"; g.beginPath(); g.arc(250, 62, 22, 0, 7); g.fill();
    g.fillStyle = "#7a4a22"; g.beginPath(); g.moveTo(0, GY - 30); for (let x = 0; x <= W; x += 30) g.lineTo(x, GY - 30 - 10 * Math.sin(x * 0.04 + 1)); g.lineTo(W, GY); g.lineTo(0, GY); g.fill();
    g.fillStyle = "#c79a5a"; g.fillRect(0, GY, W, H - GY);
    g.fillStyle = "#a87a40"; for (let x = (S.t * 0.2) % 24; x < W; x += 24) g.fillRect(x, GY + 10, 12, 2);
    // vento di sabbia
    const wv = windNow();
    g.strokeStyle = "rgba(255,225,170,.35)"; g.lineWidth = 1;
    for (let i = 0; i < 14; i++) { const y = ((i * 37 + S.t * (1 + Math.abs(wv) * 40)) % GY), x = (i * 53 + S.t * 2) % W; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 10, y + wv * 220); g.stroke(); }
    // porte
    g.strokeStyle = "#5a3a1a"; g.lineWidth = 3;
    g.strokeRect(322, GOAL_TOP, 30, GY - GOAL_TOP); g.strokeRect(8, GOAL_TOP, 14, GY - GOAL_TOP);
    g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(322, GOAL_TOP, 30, GY - GOAL_TOP);
    // lamiere
    PANELS.forEach((p) => { const cy = panelY(p, S.t); g.fillStyle = "#8a5a3a"; g.fillRect(p.x - 4, cy - p.h / 2, 8, p.h); g.fillStyle = "#c2703a"; g.fillRect(p.x - 4, cy - p.h / 2, 3, p.h); g.fillStyle = "#3a2a1a"; g.fillRect(p.x - 1, cy - p.h / 2 + 3, 2, 3); g.fillRect(p.x - 1, cy + p.h / 2 - 6, 2, 3); });
    // portiere di latta
    const ky = S.keeper.y; g.fillStyle = "#9aa4ac"; g.fillRect(300, ky - 11, 14, 22); g.fillStyle = "#4b5563"; g.fillRect(303, ky - 8, 8, 5); g.fillStyle = "#ef4444"; g.fillRect(305, ky - 7, 2, 2); g.fillRect(308, ky - 7, 2, 2);
    // scudo
    const sh = shieldH(); g.fillStyle = "#6b7280"; g.fillRect(44, S.shield.y - sh / 2, 8, sh); g.fillStyle = "#e5e7eb"; g.fillRect(44, S.shield.y - sh / 2, 3, sh);
    // scia
    S.fx.forEach((f) => { g.fillStyle = `rgba(255,255,255,${f[2] / 40})`; g.beginPath(); g.arc(f[0], f[1], 2, 0, 7); g.fill(); });
    // anteprima mira
    const b = S.ball;
    if (S.phase === "aim" && S.drag && S.drag.len > 6) {
      const sim = simulate(S.drag.vx, S.drag.vy, S.t, 14 + 5 * (bonus().at || 0));
      g.fillStyle = "rgba(255,255,255,.8)"; sim.pts.forEach((p, i) => { if (i % 2 === 0) g.fillRect(p[0] - 1, p[1] - 1, 2, 2); });
      g.strokeStyle = "#fde68a"; g.lineWidth = 2; g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x - S.drag.dx, b.y - S.drag.dy); g.stroke();
    }
    // palla
    g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(b.x, b.y, R, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1; g.stroke();
    // HUD
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 0, W, 22);
    g.fillStyle = "#fde68a"; g.font = "bold 12px system-ui"; g.textAlign = "left";
    g.fillText(`TU ${S.scoreA} - ${S.scoreB} LORO`, 8, 15);
    g.textAlign = "center"; g.fillText(`Turno ${Math.min(S.round + 1, S.rounds.length)}/${S.rounds.length}${S.extra ? " (oltranza)" : ""}`, 180, 15);
    g.textAlign = "right"; g.fillText(`Vento ${wv > 0.002 ? "↓" : wv < -0.002 ? "↑" : "·"}${S.opts.mate ? " · con " + S.opts.mate : ""}`, W - 8, 15);
    g.textAlign = "center"; g.font = "bold 16px system-ui"; g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 3;
    if (S.phase !== "fly" && S.phase !== "aim") { g.strokeText(S.banner, 180, 100); g.fillText(S.banner, 180, 100); }
    else if (S.phase === "aim" && S.banner) { g.font = "bold 11px system-ui"; g.strokeText(S.sub, 180, 40); g.fillText(S.sub, 180, 40); }
    // schermata iniziale
    if (S.phase === "intro") {
      g.fillStyle = "rgba(20,10,0,.85)"; g.fillRect(20, 30, 320, 130);
      g.fillStyle = "#fde68a"; g.font = "bold 14px system-ui"; g.fillText("CAMPO DI ROTTAMI", 180, 52);
      g.fillStyle = "#fff"; g.font = "11px system-ui";
      ["5 tiri a testa, in alternanza.", "TIRO: trascina all'indietro e rilascia (fionda).", "PARATA: muovi lo scudo col dito o con ↑ ↓.", "Le lamiere deviano la palla, il vento la spinge.", "Pari dopo i turni extra: sconfitta."].forEach((t, i) => g.fillText(t, 180, 74 + i * 16));
    }
  }

  // ------------------------------------------------------------ DOM e comandi
  function mountUI() {
    unmountUI();
    const el = document.createElement("div");
    el.id = "rottami-overlay";
    el.style.cssText = "position:fixed;inset:0;z-index:99999;background:#1a0f06;display:flex;flex-direction:column;align-items:center;justify-content:center;touch-action:none;font-family:system-ui,sans-serif";
    el.innerHTML = `<div style="width:100%;max-width:480px;display:flex;flex-direction:column;align-items:center;padding:4px">
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:2px 8px;color:#fde68a;font-size:12px;font-weight:bold"><span>🔩 ${esc(S.opts.title || "Campo di Rottami")}</span><button id="ceClose" style="background:#7f1d1d;color:#fff;border:none;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer">Esci</button></div>
      <div style="position:relative;width:100%;aspect-ratio:${W}/${H};max-height:62vh;background:#000;border:2px solid #b45309;border-radius:6px;overflow:hidden"><canvas id="ceCv" width="${W}" height="${H}" style="width:100%;height:auto;flex:none;display:block;touch-action:none"></canvas></div>
      <button id="ceStart" style="margin-top:8px;width:100%;padding:12px;background:#b45309;color:#fff;border:none;border-radius:6px;font-weight:bold;font-size:14px;cursor:pointer">Via!</button>
      <button id="ceDone" style="display:none;margin-top:8px;width:100%;padding:12px;background:#15803d;color:#fff;border:none;border-radius:6px;font-weight:bold;font-size:14px;cursor:pointer">Continua ▸</button></div>`;
    document.body.appendChild(el);
    S.root = el; S.cv = el.querySelector("#ceCv");
    el.querySelector("#ceClose").onclick = () => finishMatch(false);
    el.querySelector("#ceStart").onclick = () => { if (S.phase === "intro") { S.phase = "wait"; prepareRound(); el.querySelector("#ceStart").style.display = "none"; } };
    el.querySelector("#ceDone").onclick = () => finishMatch(S.scoreA > S.scoreB);
    if (S.opts.auto) el.querySelector("#ceStart").style.display = "none";
  }
  function unmountUI() { const el = document.getElementById("rottami-overlay"); if (el && el.parentNode) el.parentNode.removeChild(el); S.root = null; S.cv = null; }

  const pt = (e) => { const r = S.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (W / r.width), y: (e.clientY - r.top) * (H / r.height) }; };
  function onDown(e) {
    if (!S.active) return; e.preventDefault();
    const p = pt(e);
    if (S.phase === "aim") S.drag = { x0: p.x, y0: p.y, dx: 0, dy: 0, len: 0, vx: 0, vy: 0 };
    else if (S.rounds[S.round] === "D") S.shield.ty = p.y;
  }
  function onMove(e) {
    if (!S.active) return; const p = pt(e);
    if (S.phase === "aim" && S.drag) {
      let dx = p.x - S.drag.x0, dy = p.y - S.drag.y0, len = Math.hypot(dx, dy);
      if (len > 70) { dx *= 70 / len; dy *= 70 / len; len = 70; }
      S.drag.dx = dx; S.drag.dy = dy; S.drag.len = len; S.drag.vx = -dx * 0.13; S.drag.vy = -dy * 0.13;
    } else if (S.rounds[S.round] === "D" && e.buttons !== 0) S.shield.ty = p.y;
  }
  function onUp() {
    if (!S.active) return;
    if (S.phase === "aim" && S.drag) { const d = S.drag; S.drag = null; if (d.len > 8) launchMine(d.vx, d.vy); }
  }
  function onKeyDown(e) {
    if (!S.active) return;
    if (e.key === "ArrowUp" || e.key === "w") S.kb.u = true;
    if (e.key === "ArrowDown" || e.key === "s") S.kb.d = true;
    if ((e.key === " " || e.key === "Enter") && S.phase === "aim") { launchMine(7.2, -2.4 + (S.kb.u ? -1 : 0) + (S.kb.d ? 1 : 0)); e.preventDefault(); }
    if ((e.key === " " || e.key === "Enter") && S.phase === "intro") { const b = S.root && S.root.querySelector("#ceStart"); if (b) b.click(); }
  }
  function onKeyUp(e) { if (e.key === "ArrowUp" || e.key === "w") S.kb.u = false; if (e.key === "ArrowDown" || e.key === "s") S.kb.d = false; }
  function bindEvents() {
    S.cv.addEventListener("pointerdown", onDown); window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp);
  }
  function unbindEvents() { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); }

  function loop() {
    if (!S.active) return;
    for (let k = S.opts.fast ? 24 : 1; k > 0 && S.active; k--) update();
    if (S.cv) { const g = S.cv.getContext("2d"); if (g) render(g); }
    if (S.active) S.raf = requestAnimationFrame(loop);
  }

  window.__rottami = {
    start: startMatch, _dbg: { stepBall, simulate },
    state: {
      get active() { return S.active; }, get raw() { return S; }, get scoreA() { return S.scoreA; }, get scoreB() { return S.scoreB; },
      finish: function (win) { if (typeof win === "boolean") { if (win && S.scoreA <= S.scoreB) S.scoreA = S.scoreB + 1; } finishMatch(S.scoreA > S.scoreB); }
    }
  };
})();
