// js/circuiti-emp.js - «CIRCUITO EMP & SOVRACCARICO» · il minigioco di Neo-Rondine 2099 (e del cabinato in Sala Giochi)
// Griglia al neon: mira (trascina sul campo, oppure ◀ ▶ e ± potenza; la linea gialla mostra le prime due deviazioni) e scaglia la sfera conduttrice. Ogni rimbalzo su un nodo verde carica il condensatore (+25%; i nodi rossi, a polarità
// invertita, lo scaricano). I cyborg sulla rotaia tolgono carica e deviano la sfera. A carica 100% (o col tasto EMP, da 60%) l'impulso stordisce i cyborg e spegne
// il portiere per qualche secondo. Vince chi segna i gol richiesti entro i tiri a disposizione.
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (3 tiri sul livello 1, senza conseguenze); il «?» la riapre. Richiede js/mini.js.
// Opzioni: title, level (1-3), oppName, te (carica iniziale), df (meno carica persa), at (un tiro in più), tutorial (false = niente spiegazione), onDone({win, a (gol), b (richiesti), shots}).
// Test: window.__emp.state.finish(win) · .fire(angolo, potenza) · pulsante #emGo.
(function () {
  "use strict";
  if (window.__emp) return;
  const M = window.__mini, W = M.W, H = 220, LX = 34, LY = 110, GX = 352, GY0 = 70, GY1 = 150;
  const esc = M.esc;
  let S = null, ui = null, raf = 0, tutC = null, fxo = null;
  const LV = {
    1: { shots: 6, need: 2, cy: [{ x: 200, a: 70, sp: 0.016, w: 10, h: 26 }], nodes: [[110, 70, 16], [150, 150, 16], [270, 100, 16]], laser: [], gk: { h: 28, sp: 0.7, react: 0 }, pol: false },
    2: { shots: 5, need: 3, cy: [{ x: 170, a: 80, sp: 0.03, w: 10, h: 26 }, { x: 250, a: 70, sp: 0.04, w: 10, h: 26 }], nodes: [[100, 60, 13], [120, 160, 13], [210, 110, 13], [295, 70, 13]], laser: [{ x: 300, y0: 90, y1: 135 }], gk: { h: 32, sp: 0.9, react: 0.3 }, pol: false },
    3: { shots: 5, need: 3, cy: [{ x: 165, a: 85, sp: 0.04, w: 10, h: 28 }, { x: 240, a: 75, sp: 0.05, w: 10, h: 28 }], nodes: [[95, 55, 12], [115, 165, 12], [200, 110, 12], [290, 62, 12], [290, 160, 12]], laser: [{ x: 322, y0: 90, y1: 130 }], gk: { h: 38, sp: 1.2, react: 0.85 }, pol: true }
  };
  const L = () => LV[Math.max(1, Math.min(3, S.o.level || 1))];
  function cyY(c) { return 110 + Math.sin(S.t * c.sp + c.x) * c.a * 0.9; }
  function gkY() { const g = L().gk; if (S.stun.gk > 0) return -60; const tgt = S.ball && S.ball.on ? S.ball.y : 110; S.gky += (Math.sin(S.t * 0.04) * 38 + 110 - S.gky) * 0.05 * (1 - g.react) + (tgt - S.gky) * 0.045 * g.react; S.gky = Math.max(GY0 + 8, Math.min(GY1 - 8, S.gky)); return S.gky; }
  function nodePol(i) { return !L().pol ? 1 : (Math.floor(S.t / 240) + i) % 3 === 0 ? -1 : 1; }
  function laserOn() { return L().laser.length && Math.floor(S.t / 90) % 2 === 0; }
  function log(t) { if (!S || S.demo) return; S.log = t; if (ui) ui.lg.textContent = t; }
  function hud() {
    if (!ui || !S || S.demo) return; ui.hud.innerHTML = S.practice ? `<b>Prova libera</b><span>Gol ${S.goals}/${L().need}</span><span>Tiri ${S.left}</span><span>Carica ${Math.round(S.charge)}%</span>` : `<b>Gol ${S.goals}/${L().need}</b><span>Tiri ${S.left}</span><span>⚡ Carica ${Math.round(S.charge)}%</span>`;
    const em = ui.bt.querySelector("#emE"); if (em) em.disabled = !(S.charge >= 60 && S.ball.on); const fb = ui.bt.querySelector("#emF"); if (fb) fb.disabled = S.ball.on || S.over;
  }
  function emp() { S.stun.cy = 190; S.stun.gk = 150; S.charge = 0; S.flash = 18; if (!S.demo) { fxo.banner("EMP!", "#f0abfc"); fxo.shake(5); } log("EMP! I cyborg sono storditi e il portiere è spento."); hud(); }
  function fire(ang, pow) {
    if (!S || S.ball.on || S.over || S.left <= 0) return false;
    if (ang != null) S.ang = ang; if (pow != null) S.pow = pow;
    const a = (S.ang * Math.PI) / 180, v = 3 + S.pow * 0.075;
    S.ball = { on: true, x: LX, y: LY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, trail: [], age: 0 }; S.left--; S.charge = Math.max(S.charge, 0); log("Sfera scaricata."); hud(); return true;
  }
  function endShot(txt) { S.ball.on = false; if (S.demo) return; log(txt); if (S.goals >= L().need) return finish(true); if (S.left <= 0) return finish(false); hud(); }
  function step() {
    S.t++; if (S.stun.cy > 0) S.stun.cy--; if (S.stun.gk > 0) S.stun.gk--; if (S.flash > 0) S.flash--;
    const gy = gkY(), b = S.ball; S.gyv = gy; if (!b.on) return;
    for (let k = 0; k < 2; k++) {
      b.x += b.vx / 2; b.y += b.vy / 2; b.age++; if (b.age % 4 === 0) { b.trail.push([b.x, b.y]); if (b.trail.length > 14) b.trail.shift(); }
      if (b.y < 14) { b.y = 14; b.vy = Math.abs(b.vy); } if (b.y > H - 14) { b.y = H - 14; b.vy = -Math.abs(b.vy); } if (b.x < 12) { b.x = 12; b.vx = Math.abs(b.vx); }
      L().nodes.forEach(([nx, ny, r], i) => {
        const d = Math.hypot(b.x - nx, b.y - ny); if (d < r + 5 && d > 0.1 && !(b.hitN === i && b.age - b.hitAt < 8)) {
          const nxn = (b.x - nx) / d, nyn = (b.y - ny) / d, dot = b.vx * nxn + b.vy * nyn; b.vx -= 2 * dot * nxn; b.vy -= 2 * dot * nyn; b.hitN = i; b.hitAt = b.age;
          const p = nodePol(i); S.charge = Math.max(0, Math.min(100, S.charge + p * 25)); S.pulse.push([nx, ny, 0, p]); if (!S.demo) fxo.text(p > 0 ? "+25%" : "−25%", nx, ny - 16, p > 0 ? "#6ee7b7" : "#fb7185"); log(p > 0 ? "Nodo carico: +25%." : "Nodo a polarità invertita: scarica la sfera."); if (S.charge >= 100) emp(); hud();
        }
      });
      L().cy.forEach((c) => { const cy = cyY(c); if (S.stun.cy > 0) return; if (Math.abs(b.x - c.x) < c.w / 2 + 5 && Math.abs(b.y - cy) < c.h / 2 + 5 && !(b.hitC === c.x && b.age - b.hitCAt < 12)) { b.vx = -b.vx * 0.9; b.vy += (b.y - cy) * 0.05; S.charge = Math.max(0, S.charge - Math.max(10, 35 - 8 * (S.o.df | 0))); b.hitC = c.x; b.hitCAt = b.age; if (!S.demo) fxo.text("−carica", c.x, cy - 20, "#fca5a5"); log("Un cyborg intercetta: perdi carica."); hud(); } });
      if (laserOn()) L().laser.forEach((l) => { if (Math.abs(b.x - l.x) < 6 && b.y > l.y0 && b.y < l.y1) { b.vx = -Math.abs(b.vx); b.x = l.x - 7; log("Barriera laser: respinta."); } });
      if (b.x >= GX - 4) {
        if (b.y > GY0 && b.y < GY1) {
          if (S.stun.gk <= 0 && Math.abs(b.y - gy) < L().gk.h / 2 + 5) { b.vx = -Math.abs(b.vx) * 0.8; b.x = GX - 8; if (!S.demo) fxo.text("PARATA", GX - 30, gy - 20, "#7dd3fc"); log("Parata di Z-Zero."); }
          else { S.goals++; S.pulse.push([GX, b.y, 0, 1]); S.flash = 10; if (!S.demo) { fxo.banner("GOL!", "#6ee7b7"); fxo.burst(GX, b.y, 24, ["#6ee7b7", "#e0f2fe", "#f0abfc"]); } return endShot("GOL! La barriera di frequenza cede."); }
        } else { b.vx = -Math.abs(b.vx); b.x = GX - 8; }
      }
    }
    const v = Math.hypot(b.vx, b.vy); b.vx *= 0.996; b.vy *= 0.996; if (v < 0.7 || b.age > 900) return endShot("La sfera si ferma: tiro fallito.");
  }
  // traiettoria prevista (solo muri e nodi, prime due deviazioni)
  function predict() {
    const a = (S.ang * Math.PI) / 180, v = 3 + S.pow * 0.075; let x = LX, y = LY, vx = Math.cos(a) * v, vy = Math.sin(a) * v, bounces = 0, hn = -1; const pts = [];
    for (let i = 0; i < 140 && bounces < 3; i++) {
      x += vx / 2; y += vy / 2; let bo = false;
      if (y < 14) { y = 14; vy = Math.abs(vy); bo = true; } if (y > H - 14) { y = H - 14; vy = -Math.abs(vy); bo = true; } if (x < 12) { x = 12; vx = Math.abs(vx); bo = true; }
      L().nodes.forEach(([nx, ny, r], k) => { const d = Math.hypot(x - nx, y - ny); if (d < r + 5 && d > 0.1 && hn !== k) { const ux = (x - nx) / d, uy = (y - ny) / d, dot = vx * ux + vy * uy; vx -= 2 * dot * ux; vy -= 2 * dot * uy; hn = k; bo = true; } });
      if (bo) bounces++; if (i % 4 === 0) pts.push([x, y, bounces]); if (x >= GX - 4) break;
    }
    return pts;
  }
  function draw(g, aimOn) {
    g.fillStyle = "#030610"; g.fillRect(0, 0, W, H);
    g.strokeStyle = "rgba(34,211,238,.10)"; g.lineWidth = 1; for (let x = 0; x <= W; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.strokeStyle = "#0e7490"; g.lineWidth = 3; g.strokeRect(6, 6, W - 12, H - 12);
    if (S.flash) { g.fillStyle = `rgba(240,171,252,${S.flash / 40})`; g.fillRect(0, 0, W, H); }
    const gy = S.gyv == null ? 110 : S.gyv;
    g.fillStyle = "#0b2a45"; g.beginPath(); g.arc(LX, LY, 12, 0, 7); g.fill(); g.strokeStyle = "#22d3ee"; g.lineWidth = 2; g.beginPath(); g.arc(LX, LY, 12, 0, 7); g.stroke();
    const a = (S.ang * Math.PI) / 180;
    if (!S.ball.on && aimOn !== false) {
      predict().forEach((p, i) => { g.globalAlpha = Math.max(0.25, 1 - i * 0.025); g.fillStyle = p[2] === 0 ? "#fbbf24" : p[2] === 1 ? "#fde68a" : "#fef9c3"; g.beginPath(); g.arc(p[0], p[1], 1.8, 0, 7); g.fill(); }); g.globalAlpha = 1;
      g.strokeStyle = "rgba(251,191,36,.9)"; g.lineWidth = 2; g.beginPath(); g.moveTo(LX, LY); g.lineTo(LX + Math.cos(a) * (14 + S.pow * 0.25), LY + Math.sin(a) * (14 + S.pow * 0.25)); g.stroke();
      g.fillStyle = "#fde68a"; g.font = "700 9px system-ui"; g.textAlign = "left"; g.fillText("potenza " + S.pow, 52, 22);
    }
    L().nodes.forEach(([x, y, r], i) => { const p = nodePol(i), c = p > 0 ? "#34d399" : "#f43f5e"; g.fillStyle = "rgba(5,10,30,.9)"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = c; g.lineWidth = 3; g.shadowColor = c; g.shadowBlur = 10; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.shadowBlur = 0; g.fillStyle = c; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.fillText(p > 0 ? "+" : "−", x, y + 4); });
    L().laser.forEach((l) => { if (laserOn()) { g.strokeStyle = "#f43f5e"; g.lineWidth = 3; g.shadowColor = "#f43f5e"; g.shadowBlur = 10; g.beginPath(); g.moveTo(l.x, l.y0); g.lineTo(l.x, l.y1); g.stroke(); g.shadowBlur = 0; } else { g.strokeStyle = "rgba(244,63,94,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(l.x, l.y0); g.lineTo(l.x, l.y1); g.stroke(); } });
    L().cy.forEach((c) => { const y = cyY(c), st = S.stun.cy > 0; g.fillStyle = st ? "#334155" : "#a78bfa"; g.fillRect(c.x - c.w / 2, y - c.h / 2, c.w, c.h); g.fillStyle = st ? "#64748b" : "#f0abfc"; g.fillRect(c.x - 3, y - c.h / 2 + 4, 6, 4); if (st) { g.strokeStyle = "#fde047"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(c.x - 8, y - 6); g.lineTo(c.x, y); g.lineTo(c.x - 6, y + 6); g.stroke(); } });
    g.strokeStyle = S.stun.gk > 0 ? "#fb7185" : "#22d3ee"; g.lineWidth = 3; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(GX, GY0); g.lineTo(GX, GY1); g.stroke(); g.setLineDash([]);
    if (S.stun.gk <= 0) { g.fillStyle = "rgba(56,189,248,.8)"; g.fillRect(GX - 9, gy - L().gk.h / 2, 8, L().gk.h); g.fillStyle = "#fde047"; g.fillRect(GX - 10, gy - L().gk.h / 2 - 3, 10, 3); }
    S.pulse = S.pulse.filter((p) => p[2] < 24); S.pulse.forEach((p) => { p[2]++; g.strokeStyle = p[3] > 0 ? `rgba(52,211,153,${1 - p[2] / 24})` : `rgba(244,63,94,${1 - p[2] / 24})`; g.lineWidth = 2; g.beginPath(); g.arc(p[0], p[1], 8 + p[2], 0, 7); g.stroke(); });
    const b = S.ball; if (b.on) { b.trail.forEach((t, i) => { g.fillStyle = `rgba(103,232,249,${i / 28})`; g.beginPath(); g.arc(t[0], t[1], 2 + i / 5, 0, 7); g.fill(); }); g.fillStyle = "#e0f2fe"; g.shadowColor = "#22d3ee"; g.shadowBlur = 12; g.beginPath(); g.arc(b.x, b.y, 5, 0, 7); g.fill(); g.shadowBlur = 0; }
    g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(12, H - 24, 96, 12); g.fillStyle = S.charge >= 60 ? "#f0abfc" : "#0e7490"; g.fillRect(14, H - 22, 92 * S.charge / 100, 8); g.strokeStyle = "#22d3ee"; g.lineWidth = 1; g.strokeRect(12, H - 24, 96, 12); g.fillStyle = "#fff"; g.font = "700 8px system-ui"; g.textAlign = "left"; g.fillText("CARICA " + Math.round(S.charge) + "%  (EMP da 60)", 16, H - 14);
  }

  // ------------------------------------------------------------ spiegazione
  function demoState(o) { return { o: o || { level: 1 }, demo: true, t: 0, ang: 0, pow: 70, goals: 0, left: 99, charge: 0, ball: { on: false, trail: [] }, stun: { cy: 0, gk: 0 }, gky: 110, pulse: [], flash: 0, over: false }; }
  const cap = (g, t, y) => { g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(0, y - 14, W, 22); g.fillStyle = "#67e8f9"; g.font = "800 12px system-ui"; g.textAlign = "center"; g.fillText(t, W / 2, y + 2); };
  function playDemo(g, f, d, label, setup) {
    const hold = S; S = d; try { if (!d.ball.on && d.left > 0 && f % 200 === 40) { if (setup) setup(d); fire(); } if (d.ball.on || true) step(); draw(g, true); } finally { S = hold; }
    cap(g, label, 214);
  }
  const D = { a: null, b: null, c: null };
  const PAGES = [
    { t: "Mira e scarica", p: "<b>Trascina sul campo</b> per mirare (o usa ◀ ▶ e ± potenza). La linea gialla mostra dove andrà la sfera: <b>rimbalza</b> sui muri e sui nodi. Poi premi <b>⚡ SCARICA</b>. Il campo è il tuo: la porta è a destra, difesa dal portiere Z-Zero.", draw(g, f) { if (f === 1 || !D.a) D.a = demoState(); const d = D.a; d.ang = Math.round(Math.sin(f * 0.02) * 30 - 4); d.pow = 70; const hold = S; S = d; try { d.t++; d.gyv = gkY(); draw(g, true); } finally { S = hold; } cap(g, "angolo " + d.ang + "° · linea gialla = traiettoria", 214); } },
    { t: "Nodi e carica", p: "Ogni rimbalzo su un <b>nodo verde</b> carica il condensatore (+25%). I nodi <b>rossi</b> (livelli alti) lo scaricano. I <b>cyborg viola</b> sulla rotaia ti tolgono carica. A <b>100%</b> scatta l'EMP da solo; da <b>60%</b> puoi lanciarlo col tasto <b>⚡ EMP</b> mentre la sfera è in corsa.", draw(g, f) { if (f === 1 || !D.b) { D.b = demoState(); D.b.ang = 8; D.b.pow = 80; } playDemo(g, f, D.b, "carica: " + Math.round(D.b.charge) + "%", (d) => { d.ang = [-24, 8, 28][Math.floor(f / 200) % 3]; }); } },
    { t: "EMP e gol", p: "L'<b>EMP</b> stordisce i cyborg e <b>spegne il portiere</b> per qualche secondo: è il momento di segnare. Servono i <b>gol richiesti</b> entro i tiri a disposizione. Provalo con la Prova libera: 3 tiri, senza conseguenze.", draw(g, f) { if (f === 1 || !D.c) { D.c = demoState(); D.c.ang = 2; D.c.pow = 85; D.c.charge = 100; } const d = D.c; if (f % 220 === 30) { d.stun.cy = 190; d.stun.gk = 150; d.charge = 0; d.flash = 18; } playDemo(g, f, d, d.stun.gk > 0 ? "EMP! portiere spento: tira!" : "il portiere para...", (x) => { x.ang = 2; if (x.stun.gk <= 0 && f % 220 < 60) { x.stun.cy = 190; x.stun.gk = 150; x.flash = 18; } }); } }
  ];

  // ------------------------------------------------------------ stato
  function mk(o, practice) {
    const o2 = practice ? Object.assign({}, o, { level: 1 }) : o;
    const s = { o: o2, practice: !!practice, t: 0, ang: 0, pow: 60, goals: 0, left: 0, charge: 0, ball: { on: false, trail: [] }, stun: { cy: 0, gk: 0 }, gky: 110, pulse: [], flash: 0, over: false, win: false, log: practice ? "Prova libera: 3 tiri sul livello 1, non conta." : "Mira e scarica la sfera." };
    S = s; s.left = practice ? 3 : L().shots + ((o.at | 0) > 0 ? 1 : 0); s.charge = practice ? 0 : Math.min(60, 10 * (o.te | 0)); return s;
  }
  function controls() {
    if (!ui || !S) return; const bt = ui.bt;
    if (S.over && S.practice) { bt.innerHTML = `<button class="go" id="emRe">↺ Riprova</button><button class="go" id="emGo2">▶ Gioca davvero</button>`; bt.querySelector("#emRe").onclick = () => restart(true); bt.querySelector("#emGo2").onclick = () => restart(false); return; }
    if (S.over) { bt.innerHTML = `<button class="go" id="emGo">Continua ▸</button>`; bt.querySelector("#emGo").onclick = () => close(S.win); return; }
    bt.innerHTML = `<button id="emL">◀ Angolo</button><button id="emR">Angolo ▶</button><button id="emM">− Potenza</button><button id="emP">+ Potenza</button><button class="pw" id="emF" style="flex:2 1 120px">⚡ SCARICA</button><button class="pw" id="emE" style="flex:1 1 90px" disabled>⚡ EMP</button>`;
    const ok = () => S && !(tutC && tutC.open);
    bt.querySelector("#emL").onclick = () => { if (ok()) S.ang = Math.max(-70, S.ang - 2); }; bt.querySelector("#emR").onclick = () => { if (ok()) S.ang = Math.min(70, S.ang + 2); };
    bt.querySelector("#emM").onclick = () => { if (ok()) S.pow = Math.max(30, S.pow - 5); }; bt.querySelector("#emP").onclick = () => { if (ok()) S.pow = Math.min(100, S.pow + 5); };
    bt.querySelector("#emF").onclick = () => { if (ok()) fire(); }; bt.querySelector("#emE").onclick = () => { if (ok() && S.charge >= 60 && S.ball.on) emp(); };
    hud();
  }
  function finish(win) {
    if (!S || S.over) return; if (tutC) tutC.close(); tutC = null; S.over = true; S.win = !!win; S.ball.on = false;
    const r = S.goals + "/" + L().need; log(S.practice ? "Prova finita: riprova o gioca davvero." : win ? `Impulso riuscito: ${r} gol. La rete è tua.` : `Tiri finiti: ${r} gol. Il circuito non cede.`);
    if (!S.practice) fxo.banner(win ? "VITTORIA!" : "SCONFITTA", win ? "#6ee7b7" : "#fca5a5");
    hud(); controls(); if (window.__emp.state) window.__emp.state.done = !!win;
  }
  function restart(practice) { mk(OPT, practice); fxo = M.fx(); hud(); controls(); }
  let OPT = null;
  function close(win) { cancelAnimationFrame(raf); const o = OPT, r = { win: !!win, a: S.goals, b: L().need, shots: Math.max(0, L().shots - S.left), recap: "" }; if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__emp.state = null; o.onDone && o.onDone(r); }
  function aimFrom(ev) { const r = ui.cv.getBoundingClientRect(), x = (ev.clientX - r.left) * (W / r.width) - LX, y = (ev.clientY - r.top) * (H / r.height) - LY; S.ang = Math.max(-70, Math.min(70, Math.round((Math.atan2(y, Math.max(8, x)) * 180) / Math.PI))); S.pow = Math.max(30, Math.min(100, Math.round(Math.hypot(x, y) * 0.5))); }
  function loop() {
    if (!ui || !S) return; const g = ui.g; g.setTransform(M.SS, 0, 0, M.SS, 0, 0); if (!(tutC && tutC.open)) step();
    const sh = fxo.sh > 0 ? (Math.random() - 0.5) * fxo.sh : 0; g.save(); g.translate(sh, 0); draw(g, !S.over); g.restore(); fxo.tick(); fxo.draw(g); raf = requestAnimationFrame(loop);
  }
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); OPT = o; ui = M.shell("emOv", "🔌 " + (o.title || "Circuito EMP") + (o.level ? " · Liv. " + o.level : ""), "#22d3ee"); ui.root.style.background = "#05030f";
    ui.cv.setAttribute("height", String(H * M.SS)); fxo = M.fx(); mk(o, false); tutC = null;
    const dn = (e) => { if (!S || S.ball.on || S.over || (tutC && tutC.open)) return; aimFrom(e); }; ui.cv.addEventListener("pointerdown", dn); ui.cv.addEventListener("pointermove", (e) => { if (e.buttons) dn(e); });
    ui.help.onclick = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "emp", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } }); };
    window.__emp.state = { finish, fire, tut: () => !!(tutC && tutC.open), get goals() { return S.goals; }, get left() { return S.left; }, get charge() { return S.charge; }, get ang() { return S.ang; }, get over() { return S.over; }, get practice() { return S.practice; }, force: (c) => { S.charge = c; hud(); }, emp: () => emp() };
    hud(); controls(); loop();
    if (o.tutorial !== false && !M.seen("emp")) tutC = M.tut({ root: ui.root, key: "emp", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } });
    return true;
  }
  window.__emp = { start, state: null };
})();
