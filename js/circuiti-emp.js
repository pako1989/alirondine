// js/circuiti-emp.js - «CIRCUITO EMP & SOVRACCARICO» · il minigioco di Neo-Rondine 2099 (e del cabinato in Sala Giochi)
// Griglia al neon 380x220: mira (angolo e potenza) e scaglia la sfera conduttrice. Ogni rimbalzo su un nodo carica il condensatore (+25%; i nodi rossi, a polarità
// invertita, lo scaricano). I cyborg sulla rotaia tolgono carica e deviano la sfera. A carica 100% (o col tasto EMP, da 60%) l'impulso stordisce i cyborg e spegne
// il portiere per qualche secondo. Vince chi segna i gol richiesti entro i tiri a disposizione.
// Opzioni: title, level (1-3), oppName, onDone({win, a (gol), b (richiesti), shots}). Test: window.__emp.state.finish(win) · .fire(angolo, potenza).
(function () {
  "use strict";
  if (window.__emp) return;
  const W = 380, H = 220, LX = 34, LY = 110, GX = 352, GY0 = 70, GY1 = 150;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let S = null, root = null, cv = null, raf = 0;
  const LV = {
    1: { shots: 6, need: 2, cy: [{ x: 200, a: 70, sp: 0.016, w: 10, h: 26 }], nodes: [[110, 70, 16], [150, 150, 16], [270, 100, 16]], laser: [], gk: { h: 28, sp: 0.7, react: 0 }, pol: false },
    2: { shots: 5, need: 3, cy: [{ x: 170, a: 80, sp: 0.03, w: 10, h: 26 }, { x: 250, a: 70, sp: 0.04, w: 10, h: 26 }], nodes: [[100, 60, 13], [120, 160, 13], [210, 110, 13], [295, 70, 13]], laser: [{ x: 300, y0: 90, y1: 135 }], gk: { h: 32, sp: 0.9, react: 0.3 }, pol: false },
    3: { shots: 5, need: 3, cy: [{ x: 165, a: 85, sp: 0.04, w: 10, h: 28 }, { x: 240, a: 75, sp: 0.05, w: 10, h: 28 }], nodes: [[95, 55, 12], [115, 165, 12], [200, 110, 12], [290, 62, 12], [290, 160, 12]], laser: [{ x: 322, y0: 90, y1: 130 }], gk: { h: 38, sp: 1.2, react: 0.85 }, pol: true }
  };
  function css() {
    if (document.getElementById("emCss")) return;
    const st = document.createElement("style"); st.id = "emCss";
    st.textContent = `#emOv{position:fixed;inset:0;z-index:300;background:#05030f;color:#c8f4ff;font-family:'Trebuchet MS',sans-serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto}
#emOv h3{margin:0;font-size:15px;color:#22d3ee;display:flex;justify-content:space-between;gap:8px}
#emOv .sc{display:flex;gap:6px;font-size:13px}#emOv .sc b{flex:1;text-align:center;background:#0b1630;border:1px solid #0e7490;border-radius:8px;padding:5px}
#emOv canvas{width:100%;max-height:52vh;background:#030610;border:2px solid #0e7490;border-radius:10px;touch-action:none}
#emOv .bt{display:flex;gap:6px;flex-wrap:wrap}#emOv .bt button{flex:1;min-width:64px;min-height:46px;border-radius:10px;border:2px solid #22d3ee;background:#0b2a45;color:#c8f4ff;font-size:14px;font-weight:700}
#emOv .bt button.hot{border-color:#f0abfc;background:#581c87}#emOv .bt button:disabled{opacity:.35}
#emOv .lg{font-size:12px;color:#7dd3fc;min-height:34px;background:#060c1c;border-radius:8px;padding:6px 8px}
#emOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#b45309;color:#fff;font-size:16px;font-weight:700}`;
    document.head.appendChild(st);
  }
  const L = () => LV[Math.max(1, Math.min(3, S.o.level || 1))];
  function cyY(c) { return 110 + Math.sin(S.t * c.sp + c.x) * c.a * 0.9; }
  function gkY() { const g = L().gk; if (S.stun.gk > 0) return -60; const tgt = S.ball && S.ball.on ? S.ball.y : 110; S.gky += (Math.sin(S.t * 0.04) * 38 + 110 - S.gky) * 0.05 * (1 - g.react) + (tgt - S.gky) * 0.045 * g.react; S.gky = Math.max(GY0 + 8, Math.min(GY1 - 8, S.gky)); return S.gky; }
  function nodePol(i) { return !L().pol ? 1 : (Math.floor(S.t / 240) + i) % 3 === 0 ? -1 : 1; }
  function laserOn() { return L().laser.length && Math.floor(S.t / 90) % 2 === 0; }
  function log(t) { S.log = t; const e = root && root.querySelector(".lg"); if (e) e.textContent = t; }
  function hud() {
    if (!root) return;
    const q = (s) => root.querySelector(s); if (!q("#emSc")) return;
    q("#emSc").innerHTML = `<b>Gol ${S.goals}/${L().need}</b><b>Tiri ${S.left}</b><b>Carica ${Math.round(S.charge)}%</b>`;
    const em = q("#emE"); if (em) em.disabled = !(S.charge >= 60 && S.ball.on);
    const fb = q("#emF"); if (fb) fb.disabled = S.ball.on || S.over;
  }
  function emp() { S.stun.cy = 190; S.stun.gk = 150; S.charge = 0; S.flash = 18; log("EMP! I cyborg sono storditi e il portiere è spento."); hud(); }
  function fire(ang, pow) {
    if (!S || S.ball.on || S.over || S.left <= 0) return false;
    if (ang != null) S.ang = ang; if (pow != null) S.pow = pow;
    const a = (S.ang * Math.PI) / 180, v = 3 + S.pow * 0.075;
    S.ball = { on: true, x: LX, y: LY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, trail: [], age: 0 }; S.left--; S.charge = Math.max(S.charge, 0); log("Sfera scaricata."); hud(); return true;
  }
  function endShot(txt) { S.ball.on = false; log(txt); if (S.goals >= L().need) return finish(true); if (S.left <= 0) return finish(false); hud(); }
  function step() {
    S.t++; if (S.stun.cy > 0) S.stun.cy--; if (S.stun.gk > 0) S.stun.gk--; if (S.flash > 0) S.flash--;
    const gy = gkY(), b = S.ball; if (!b.on) { draw(gy); return; }
    for (let k = 0; k < 2; k++) {
      b.x += b.vx / 2; b.y += b.vy / 2; b.age++; if (b.age % 4 === 0) { b.trail.push([b.x, b.y]); if (b.trail.length > 14) b.trail.shift(); }
      if (b.y < 14) { b.y = 14; b.vy = Math.abs(b.vy); } if (b.y > H - 14) { b.y = H - 14; b.vy = -Math.abs(b.vy); } if (b.x < 12) { b.x = 12; b.vx = Math.abs(b.vx); }
      L().nodes.forEach(([nx, ny, r], i) => {
        const d = Math.hypot(b.x - nx, b.y - ny); if (d < r + 5 && d > 0.1 && !(b.hitN === i && b.age - b.hitAt < 8)) {
          const nxn = (b.x - nx) / d, nyn = (b.y - ny) / d, dot = b.vx * nxn + b.vy * nyn; b.vx -= 2 * dot * nxn; b.vy -= 2 * dot * nyn; b.hitN = i; b.hitAt = b.age;
          const p = nodePol(i); S.charge = Math.max(0, Math.min(100, S.charge + p * 25)); S.pulse.push([nx, ny, 0, p]); log(p > 0 ? "Nodo carico: +25%." : "Nodo a polarità invertita: scarica la sfera."); if (S.charge >= 100) emp(); hud();
        }
      });
      L().cy.forEach((c) => { const cy = cyY(c); if (S.stun.cy > 0) return; if (Math.abs(b.x - c.x) < c.w / 2 + 5 && Math.abs(b.y - cy) < c.h / 2 + 5 && !(b.hitC === c.x && b.age - b.hitCAt < 12)) { b.vx = -b.vx * 0.9; b.vy += (b.y - cy) * 0.05; S.charge = Math.max(0, S.charge - Math.max(10, 35 - 8 * (S.o.df | 0))); b.hitC = c.x; b.hitCAt = b.age; log("Un cyborg intercetta: perdi carica."); hud(); } });
      if (laserOn()) L().laser.forEach((l) => { if (Math.abs(b.x - l.x) < 6 && b.y > l.y0 && b.y < l.y1) { b.vx = -Math.abs(b.vx); b.x = l.x - 7; log("Barriera laser: respinta."); } });
      if (b.x >= GX - 4) {
        if (b.y > GY0 && b.y < GY1) {
          if (S.stun.gk <= 0 && Math.abs(b.y - gy) < L().gk.h / 2 + 5) { b.vx = -Math.abs(b.vx) * 0.8; b.x = GX - 8; log("Parata di Z-Zero."); }
          else { S.goals++; S.pulse.push([GX, b.y, 0, 1]); S.flash = 10; return endShot("GOL! La barriera di frequenza cede."); }
        } else { b.vx = -Math.abs(b.vx); b.x = GX - 8; }
      }
    }
    const v = Math.hypot(b.vx, b.vy); b.vx *= 0.996; b.vy *= 0.996; if (v < 0.7 || b.age > 900) return endShot("La sfera si ferma: tiro fallito.");
    draw(gy);
  }
  function draw(gy) {
    if (!cv) return; const g = cv.getContext("2d"); g.clearRect(0, 0, W, H); g.fillStyle = "#030610"; g.fillRect(0, 0, W, H);
    g.strokeStyle = "rgba(34,211,238,.10)"; g.lineWidth = 1; for (let x = 0; x <= W; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.strokeStyle = "#0e7490"; g.lineWidth = 3; g.strokeRect(6, 6, W - 12, H - 12);
    if (S.flash) { g.fillStyle = `rgba(240,171,252,${S.flash / 40})`; g.fillRect(0, 0, W, H); }
    g.fillStyle = "#0b2a45"; g.beginPath(); g.arc(LX, LY, 12, 0, 7); g.fill(); g.strokeStyle = "#22d3ee"; g.beginPath(); g.arc(LX, LY, 12, 0, 7); g.stroke();
    const a = (S.ang * Math.PI) / 180; if (!S.ball.on) { g.strokeStyle = "rgba(251,191,36,.8)"; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(LX, LY); g.lineTo(LX + Math.cos(a) * (20 + S.pow * 1.6), LY + Math.sin(a) * (20 + S.pow * 1.6)); g.stroke(); g.setLineDash([]); }
    L().nodes.forEach(([x, y, r], i) => { const p = nodePol(i), c = p > 0 ? "#34d399" : "#f43f5e"; g.fillStyle = "rgba(5,10,30,.9)"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.strokeStyle = c; g.lineWidth = 3; g.shadowColor = c; g.shadowBlur = 10; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.shadowBlur = 0; g.fillStyle = c; g.font = "bold 12px sans-serif"; g.textAlign = "center"; g.fillText(p > 0 ? "+" : "−", x, y + 4); });
    L().laser.forEach((l) => { if (laserOn()) { g.strokeStyle = "#f43f5e"; g.lineWidth = 3; g.shadowColor = "#f43f5e"; g.shadowBlur = 10; g.beginPath(); g.moveTo(l.x, l.y0); g.lineTo(l.x, l.y1); g.stroke(); g.shadowBlur = 0; } else { g.strokeStyle = "rgba(244,63,94,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(l.x, l.y0); g.lineTo(l.x, l.y1); g.stroke(); } });
    L().cy.forEach((c) => { const y = cyY(c), st = S.stun.cy > 0; g.fillStyle = st ? "#334155" : "#a78bfa"; g.fillRect(c.x - c.w / 2, y - c.h / 2, c.w, c.h); g.fillStyle = st ? "#64748b" : "#f0abfc"; g.fillRect(c.x - 3, y - c.h / 2 + 4, 6, 4); if (st) { g.strokeStyle = "#fde047"; g.beginPath(); g.moveTo(c.x - 8, y - 6); g.lineTo(c.x, y); g.lineTo(c.x - 6, y + 6); g.stroke(); } });
    g.strokeStyle = S.stun.gk > 0 ? "#fb7185" : "#22d3ee"; g.lineWidth = 3; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(GX, GY0); g.lineTo(GX, GY1); g.stroke(); g.setLineDash([]);
    if (S.stun.gk <= 0) { g.fillStyle = "rgba(56,189,248,.8)"; g.fillRect(GX - 9, gy - L().gk.h / 2, 8, L().gk.h); g.fillStyle = "#fde047"; g.fillRect(GX - 10, gy - L().gk.h / 2 - 3, 10, 3); }
    S.pulse = S.pulse.filter((p) => p[2] < 24); S.pulse.forEach((p) => { p[2]++; g.strokeStyle = p[3] > 0 ? `rgba(52,211,153,${1 - p[2] / 24})` : `rgba(244,63,94,${1 - p[2] / 24})`; g.lineWidth = 2; g.beginPath(); g.arc(p[0], p[1], 8 + p[2], 0, 7); g.stroke(); });
    const b = S.ball; if (b.on) { b.trail.forEach((t, i) => { g.fillStyle = `rgba(103,232,249,${i / 28})`; g.beginPath(); g.arc(t[0], t[1], 2 + i / 5, 0, 7); g.fill(); }); g.fillStyle = "#e0f2fe"; g.shadowColor = "#22d3ee"; g.shadowBlur = 12; g.beginPath(); g.arc(b.x, b.y, 5, 0, 7); g.fill(); g.shadowBlur = 0; }
    g.fillStyle = "#22d3ee"; g.fillRect(14, H - 20, 80, 8); g.fillStyle = S.charge >= 60 ? "#f0abfc" : "#0e7490"; g.fillRect(14, H - 20, 80 * S.charge / 100, 8);
  }
  function loop() { if (!S) return; step(); raf = requestAnimationFrame(loop); }
  function finish(win) {
    if (!S || S.over) return; S.over = true; cancelAnimationFrame(raf); S.ball.on = false;
    const bt = root.querySelector(".bt"), r = S.goals + "/" + L().need; log(win ? `Impulso riuscito: ${r} gol. La rete è tua.` : `Tiri finiti: ${r} gol. Il circuito non cede.`);
    if (bt) bt.innerHTML = `<button class="go" id="emGo">Continua ▸</button>`; const g = root.querySelector("#emGo"); if (g) g.onclick = () => close(win);
    window.__emp.state.done = win; draw(0);
  }
  function close(win) { cancelAnimationFrame(raf); const o = S.o, r = { win: !!win, a: S.goals, b: L().need, shots: Math.max(0, L().shots - S.left), recap: "" }; if (root) root.remove(); root = null; cv = null; S = null; window.__emp.state = null; o.onDone && o.onDone(r); }
  function aimFrom(ev) { const r = cv.getBoundingClientRect(), x = (ev.clientX - r.left) * (W / r.width) - LX, y = (ev.clientY - r.top) * (H / r.height) - LY; S.ang = Math.max(-70, Math.min(70, Math.round((Math.atan2(y, Math.max(8, x)) * 180) / Math.PI))); S.pow = Math.max(30, Math.min(100, Math.round(Math.hypot(x, y) * 0.5))); }
  function start(o) {
    css(); cancelAnimationFrame(raf); if (root) root.remove();
    root = document.createElement("div"); root.id = "emOv"; document.body.appendChild(root);
    S = { o, t: 0, ang: 0, pow: 60, goals: 0, left: 0, charge: 0, ball: { on: false, trail: [] }, stun: { cy: 0, gk: 0 }, gky: 110, pulse: [], flash: 0, over: false, log: "Mira e scarica la sfera." };
    S.left = L().shots + ((S.o.at | 0) > 0 ? 1 : 0); S.charge = Math.min(60, 10 * (S.o.te | 0)); // zaino: tecnica = carica iniziale, difesa = meno perdita contro i cyborg, attacco = un tiro in più
    root.innerHTML = `<h3><span>${esc(o.title || "Circuito EMP")}</span><span>Livello ${o.level || 1}</span></h3><div class="sc" id="emSc"></div><canvas width="${W}" height="${H}"></canvas>
<div class="bt"><button id="emL">◀ Angolo</button><button id="emR">Angolo ▶</button><button id="emM">− Potenza</button><button id="emP">+ Potenza</button></div>
<div class="bt"><button class="hot" id="emF">⚡ SCARICA</button><button class="hot" id="emE" disabled>⚡ EMP</button></div><div class="lg">${esc(S.log)}</div>`;
    cv = root.querySelector("canvas");
    const dn = (e) => { if (S.ball.on || S.over) return; aimFrom(e); }; cv.addEventListener("pointerdown", dn); cv.addEventListener("pointermove", (e) => { if (e.buttons) dn(e); });
    root.querySelector("#emL").onclick = () => { S.ang = Math.max(-70, S.ang - 2); }; root.querySelector("#emR").onclick = () => { S.ang = Math.min(70, S.ang + 2); };
    root.querySelector("#emM").onclick = () => { S.pow = Math.max(30, S.pow - 5); log("Potenza " + S.pow); }; root.querySelector("#emP").onclick = () => { S.pow = Math.min(100, S.pow + 5); log("Potenza " + S.pow); };
    root.querySelector("#emF").onclick = () => fire(); root.querySelector("#emE").onclick = () => { if (S.charge >= 60 && S.ball.on) emp(); };
    window.__emp.state = { finish, fire, get goals() { return S.goals; }, get left() { return S.left; }, get charge() { return S.charge; }, get ang() { return S.ang; }, get over() { return S.over; }, force: (c) => { S.charge = c; hud(); }, emp: () => emp() };
    hud(); loop(); return true;
  }
  window.__emp = { start, state: null };
})();
