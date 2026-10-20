// js/gala-pp.js - «PING-PONG DA SALONE» · il minigioco di «Il Rapimento del Pallone d'Oro» (e del cabinato in Sala Giochi)
// Tavolo visto da dietro. La pallina arriva su una di tre corsie: colpiscila nella finestra giusta con ↖ ↑ ↗ per scegliere dove rimandarla. L'avversario mostra una «posa»
// (verso quale corsia si sbilancia) ma può fingere. Rimanda dove NON si è sbilanciato, con buon tempismo, per fargli sbagliare. Primi a 7 punti.
// Opzioni: title, level (1-3), oppName, te (finestra più larga), df (un punto perso ti viene concesso), at (parti avanti di un punto), onDone({win, a, b}). Test: window.__pingpong.state.finish(win) · .hit(-1|0|1).
(function () {
  "use strict";
  if (window.__pingpong) return;
  const W = 380, H = 230, TOP = 36, BOT = 205, WIN = 7;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LV = { 1: { dur: 1.5, feint: 0.1, tough: 0.2 }, 2: { dur: 1.25, feint: 0.25, tough: 0.3 }, 3: { dur: 1.05, feint: 0.4, tough: 0.4 } };
  let S = null, root = null, cv = null, raf = 0;
  function css() {
    if (document.getElementById("ppCss")) return;
    const st = document.createElement("style"); st.id = "ppCss";
    st.textContent = `#ppOv{position:fixed;inset:0;z-index:300;background:#1a0f08;color:#fdf6e3;font-family:Georgia,serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto}
#ppOv h3{margin:0;font-size:15px;color:#facc15;display:flex;justify-content:space-between;gap:8px}
#ppOv .sc{display:flex;gap:6px;font-size:13px}#ppOv .sc b{flex:1;text-align:center;background:#2c1a0e;border:1px solid #b8860b;border-radius:8px;padding:5px}
#ppOv canvas{width:100%;max-height:52vh;background:#0f1a12;border:2px solid #b8860b;border-radius:10px;touch-action:none}
#ppOv .bt{display:flex;gap:6px}#ppOv .bt button{flex:1;min-height:52px;border-radius:10px;border:2px solid #facc15;background:#3b2314;color:#fdf6e3;font-size:16px;font-weight:700}
#ppOv .lg{font-size:12px;color:#fde68a;min-height:34px;background:#24150b;border-radius:8px;padding:6px 8px}
#ppOv .go{min-height:46px;border-radius:10px;border:2px solid #fbbf24;background:#92400e;color:#fff;font-size:16px;font-weight:700;width:100%}`;
    document.head.appendChild(st);
  }
  const L = () => LV[Math.max(1, Math.min(3, S.o.level || 1))];
  const laneX = (lane, t) => { const half = 60 + t * 85; return W / 2 + lane * (half * 0.62); };
  const yAt = (t) => TOP + (BOT - TOP) * t;
  function log(t) { S.log = t; const e = root && root.querySelector(".lg"); if (e) e.textContent = t; }
  function hud() { const e = root && root.querySelector("#ppSc"); if (e) e.innerHTML = `<b>Tu ${S.a}</b><b>${esc(S.o.oppName || "Avversario")} ${S.b}</b><b>A ${WIN}</b>`; }
  function serve() {
    if (S.over) return; S.rally = 0; S.dir = 1; S.t = 0; S.lane = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.hitDone = false; S.lean = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.cover = Math.random() < L().feint ? [-1, 0, 1][Math.floor(Math.random() * 3)] : S.lean; S.wait = 0.5;
  }
  function speed() { return 1 / Math.max(0.55, L().dur - 0.04 * S.rally); }
  function winWidth() { return 0.1 + 0.015 * (S.o.te | 0); }
  function point(you, why) {
    if (you) S.a++; else if (S.saved < (S.o.df | 0) && S.b < WIN) { S.saved++; log(why + " Ma un punto ti viene concesso: la tua difesa tiene."); S.wait = 0.9; S.phase = "wait"; hud(); serve(); return; } else S.b++;
    log(why); hud(); S.phase = "wait";
    if (S.a >= WIN) return setTimeout(() => finish(true), 300); if (S.b >= WIN) return setTimeout(() => finish(false), 300);
    serve(); S.wait = 0.9;
  }
  function hit(aim) {
    if (!S || S.over || S.dir !== 1) return false; const w = winWidth(), d = Math.abs(S.t - 0.92);
    if (S.t < 0.7) { log("Troppo presto: la racchetta taglia l'aria."); return false; }
    if (d > w) { log("Fuori tempo."); return false; }
    const q = d < w * 0.35 ? 2 : d < w * 0.7 ? 1 : 0; S.dir = -1; S.aim = aim; S.quality = q; S.rally++;
    const away = aim !== S.cover, p = (away ? 0.78 : 0.14) + q * 0.08 - L().tough * 0.3 + (S.rally > 6 ? 0.06 : 0);
    S.oppMiss = Math.random() < Math.max(0.04, Math.min(0.95, p));
    S.lane = aim; log(q === 2 ? "Colpo perfetto!" : q === 1 ? "Buon colpo." : "Colpo debole.");
    return true;
  }
  function step(dt) {
    if (S.over) return; if (S.wait > 0) { S.wait -= dt; return; } S.phase = "play";
    const sp = speed();
    if (S.dir === 1) { S.t += dt * sp; if (S.t > 0.92 + winWidth() + 0.02) { point(false, "Troppo tardi: punto per " + (S.o.oppName || "l'avversario") + "."); } }
    else { S.t -= dt * sp * 1.05; if (S.t <= 0.04) { if (S.oppMiss) point(true, "Punto! " + (S.o.oppName || "L'avversario") + " non ci arriva."); else { S.dir = 1; S.rally++; S.lane = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.lean = [-1, 0, 1][Math.floor(Math.random() * 3)]; S.cover = Math.random() < L().feint ? [-1, 0, 1][Math.floor(Math.random() * 3)] : S.lean; log("Rimandata! Guarda dove si sbilancia."); } } }
  }
  function draw() {
    const g = cv.getContext("2d"); g.clearRect(0, 0, W, H); g.fillStyle = "#0f1a12"; g.fillRect(0, 0, W, H);
    const quad = (t0, t1, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(laneX(-1.6, t0), yAt(t0)); g.lineTo(laneX(1.6, t0), yAt(t0)); g.lineTo(laneX(1.6, t1), yAt(t1)); g.lineTo(laneX(-1.6, t1), yAt(t1)); g.closePath(); g.fill(); };
    quad(0, 1, "#14532d"); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 2; g.beginPath(); g.moveTo(laneX(-1.6, 0), yAt(0)); g.lineTo(laneX(1.6, 0), yAt(0)); g.lineTo(laneX(1.6, 1), yAt(1)); g.lineTo(laneX(-1.6, 1), yAt(1)); g.closePath(); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 1; [-0.53, 0.53].forEach((l) => { g.beginPath(); g.moveTo(laneX(l * 1.9, 0), yAt(0)); g.lineTo(laneX(l * 1.9, 1), yAt(1)); g.stroke(); });
    g.strokeStyle = "#e5e7eb"; g.lineWidth = 3; g.beginPath(); g.moveTo(laneX(-1.7, 0.5), yAt(0.5)); g.lineTo(laneX(1.7, 0.5), yAt(0.5)); g.stroke(); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(laneX(-1.7, 0.5), yAt(0.5) - 12, laneX(1.7, 0.5) - laneX(-1.7, 0.5), 12);
    // avversario con la «posa»
    const ox = laneX(S.cover * 0.9, 0), tell = S.lean; g.fillStyle = "#7c2d12"; g.fillRect(ox - 12, TOP - 30, 24, 30); g.fillStyle = "#e0b890"; g.beginPath(); g.arc(ox, TOP - 36, 8, 0, 7); g.fill(); g.fillStyle = "#facc15"; g.fillRect(ox + tell * 14 - 3, TOP - 26, 6, 12);
    g.fillStyle = "rgba(250,204,21,.85)"; g.font = "bold 10px Georgia"; g.textAlign = "center"; g.fillText(tell < 0 ? "◀ si sbilancia" : tell > 0 ? "si sbilancia ▶" : "▲ al centro", W / 2, 12); g.textAlign = "left";
    // racchetta giocatore
    const px = laneX(S.lane * 0.9, 1); g.fillStyle = "#3b2314"; g.fillRect(px - 3, BOT + 4, 6, 14); g.fillStyle = "#dc2626"; g.beginPath(); g.ellipse(px, BOT + 3, 15, 9, 0, 0, 7); g.fill();
    // pallina
    const t = Math.max(0, Math.min(1, S.t)), bx = laneX(S.lane, t), by = yAt(t) - Math.sin(t * 3.14) * 18; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(bx, yAt(t), 5 + 3 * t, 2 + t, 0, 0, 7); g.fill(); g.fillStyle = "#fff7e0"; g.beginPath(); g.arc(bx, by, 3.5 + 4 * t, 0, 7); g.fill();
    // finestra del colpo
    if (S.dir === 1) { const w = winWidth(), a = yAt(0.92 - w), b = yAt(0.92 + w); g.strokeStyle = "rgba(250,204,21,.7)"; g.setLineDash([4, 3]); g.strokeRect(laneX(S.lane, 1) - 28, a, 56, b - a); g.setLineDash([]); }
  }
  let last = 0;
  function loop(ts) { if (!S) return; const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts; step(dt); draw(); raf = requestAnimationFrame(loop); }
  function finish(win) {
    if (!S || S.over) return; S.over = true; cancelAnimationFrame(raf);
    const bt = root.querySelector(".bt"); log(win ? `Vinci ${S.a}-${S.b}. Applausi, e un calice che si rovescia.` : `Perdi ${S.a}-${S.b}. L'avversario si ventila con la racchetta.`);
    if (bt) bt.innerHTML = `<button class="go" id="ppGo">Continua ▸</button>`; const gb = root.querySelector("#ppGo"); if (gb) gb.onclick = () => close(win);
    window.__pingpong.state.done = win;
  }
  function close(win) { cancelAnimationFrame(raf); const o = S.o, r = { win: !!win, a: S.a, b: S.b }; if (root) root.remove(); root = null; cv = null; S = null; window.__pingpong.state = null; o.onDone && o.onDone(r); }
  function start(o) {
    css(); cancelAnimationFrame(raf); if (root) root.remove();
    root = document.createElement("div"); root.id = "ppOv"; document.body.appendChild(root);
    S = { o, a: (o.at | 0) > 0 ? 1 : 0, b: 0, saved: 0, t: 0, dir: 1, lane: 0, over: false, rally: 0, lean: 0, cover: 0, wait: 0.6, phase: "wait", log: "Aspetta la pallina e rimandala nella finestra tratteggiata." };
    root.innerHTML = `<h3><span>${esc(o.title || "Ping-Pong da Salone")}</span><span>Livello ${o.level || 1}</span></h3><div class="sc" id="ppSc"></div><canvas width="${W}" height="${H}"></canvas>
<div class="bt"><button id="ppL">↖ Sinistra</button><button id="ppC">↑ Dritto</button><button id="ppR">Destra ↗</button></div><div class="lg">${esc(S.log)}</div>`;
    cv = root.querySelector("canvas"); root.querySelector("#ppL").onclick = () => hit(-1); root.querySelector("#ppC").onclick = () => hit(0); root.querySelector("#ppR").onclick = () => hit(1);
    window.__pingpong.state = { finish, hit, get a() { return S.a; }, get b() { return S.b; }, get over() { return S.over; }, get t() { return S.t; } };
    serve(); hud(); last = performance.now(); raf = requestAnimationFrame(loop); return true;
  }
  window.__pingpong = { start, state: null };
})();
