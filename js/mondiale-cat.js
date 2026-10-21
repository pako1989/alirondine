// js/mondiale-cat.js - «CATENA D'ATTACCO» · il minigioco di «Ali di Rondine · Mondiale Giovanile» (e del cabinato in Sala Giochi)
// Vista dall'alto. Hai la palla: tre compagni sono davanti a te e due difensori scorrono in mezzo. Tocca il compagno quando la linea di passaggio è libera.
// Dopo tre passaggi puliti il portiere si muove in porta: tira nell'angolo dove NON si trova. Hai poco tempo. Una catena senza intercetti è «perfetta».
// Le sinergie di ruolo (regista→ala, ala→punta…) allargano la linea libera. Opzioni: title, level (1-3), oppName, team [{id,n,icon,rk}], syn(a,b), roles, te (portiere meno reattivo),
// df (un'intercettazione perdonata), at (secondi in più), onDone({win, perfect, passes}). Test: window.__catena.state.pass(0|1|2) · .shoot(-1|0|1) · .finish(win).
(function () {
  "use strict";
  if (window.__catena) return;
  const W = 380, H = 230, esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LV = { 1: { time: 26, blk: 30, sp: 1.1, kp: 38, free: 1 }, 2: { time: 21, blk: 26, sp: 1.5, kp: 32, free: 1 }, 3: { time: 17, blk: 22, sp: 1.9, kp: 28, free: 0 } };
  let S = null, root = null, cv = null, raf = 0;
  function css() {
    if (document.getElementById("catCss")) return;
    const st = document.createElement("style"); st.id = "catCss";
    st.textContent = `#catOv{position:fixed;inset:0;z-index:300;background:#06150e;color:#ecfdf5;font-family:'Trebuchet MS',sans-serif;display:flex;flex-direction:column;gap:6px;padding:8px;overflow:auto}
#catOv h3{margin:0;font-size:15px;color:#fde047;display:flex;justify-content:space-between;gap:8px}
#catOv .sc{display:flex;gap:6px;font-size:13px}#catOv .sc b{flex:1;text-align:center;background:#0b2a1a;border:1px solid #16a34a;border-radius:8px;padding:5px}
#catOv canvas{width:100%;max-height:50vh;background:#14532d;border:2px solid #16a34a;border-radius:10px;touch-action:none}
#catOv .bt{display:flex;gap:6px}#catOv .bt button{flex:1;min-height:56px;border-radius:10px;border:2px solid #fde047;background:#0f3d24;color:#ecfdf5;font-size:14px;font-weight:700;padding:4px}
#catOv .bt button small{display:block;font-size:11px;font-weight:400;color:#bbf7d0}
#catOv .lg{font-size:12px;color:#bbf7d0;min-height:34px;background:#0b2a1a;border-radius:8px;padding:6px 8px}
#catOv .go{min-height:46px;border-radius:10px;border:2px solid #fde047;background:#166534;color:#fff;font-size:16px;font-weight:700;width:100%}`;
    document.head.appendChild(st);
  }
  const L = () => LV[Math.max(1, Math.min(3, S.o.level || 1))];
  const sy = (a, b) => (S.o.syn ? S.o.syn(a, b) : 0);
  function log(t) { S.log = t; const e = root && root.querySelector(".lg"); if (e) e.textContent = t; }
  function hud() { const e = root && root.querySelector("#catSc"); if (e) e.innerHTML = `<b>Passaggi ${S.passes}/3</b><b>⏱ ${Math.max(0, Math.ceil(S.t))}s</b><b>${S.phase === "shot" ? "Tiro" : "Catena"}</b>`; }
  function newTargets() {
    const pool = S.team.filter((m) => m.id !== S.holder.id); const out = [];
    while (out.length < 3) { const m = pool.length ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0] : { id: "x" + out.length, n: "Compagno", icon: "👟", rk: "" }; out.push(m); }
    S.targets = out;
  }
  function buttons() {
    const bt = root.querySelector(".bt"); if (!bt) return;
    if (S.phase === "pass") bt.innerHTML = S.targets.map((m, i) => { const q = sy(S.holder.rk, m.rk); return `<button data-i="${i}">${esc(m.icon)} ${esc(m.n)}<small>${esc((S.o.roles || {})[m.rk] || m.rk || "—")} ${q ? "★".repeat(Math.min(3, q)) : ""}</small></button>`; }).join("");
    else if (S.phase === "shot") bt.innerHTML = `<button data-s="-1">↖ Sinistra<small>angolo</small></button><button data-s="0">↑ Centro<small>potente</small></button><button data-s="1">↗ Destra<small>angolo</small></button>`;
    else bt.innerHTML = `<button class="go" id="catGo">Continua ▸</button>`;
    bt.querySelectorAll("button[data-i]").forEach((b) => (b.onclick = () => pass(+b.dataset.i)));
    bt.querySelectorAll("button[data-s]").forEach((b) => (b.onclick = () => shoot(+b.dataset.s)));
    const g = bt.querySelector("#catGo"); if (g) g.onclick = () => close(S.win);
  }
  const laneX = (i) => 70 + i * 120;
  const dx = (d) => W / 2 + Math.sin(S.f * 0.04 * L().sp * d.v + d.ph) * 150;
  function blocked(i) {
    const hx = S.holder.x, hy = 200, tx = laneX(i), ty = 70, ey = 140, k = (hy - ey) / (hy - ty), lx = hx + (tx - hx) * k;
    const syn = sy(S.holder.rk, S.targets[i].rk), r = Math.max(8, L().blk - 5 * syn);
    return S.def.some((d) => Math.abs(dx(d) - lx) < r);
  }
  function pass(i) {
    if (!S || S.over || S.phase !== "pass") return false;
    if (blocked(i)) {
      if (S.free > 0) { S.free--; S.clean = false; log("Intercettato! Ti sei salvato per un soffio: riprova."); return false; }
      return finish(false, "Intercettato: il difensore legge il passaggio e la catena si spezza.");
    }
    S.bonus += sy(S.holder.rk, S.targets[i].rk); S.passes++; S.holder = Object.assign({}, S.targets[i], { x: laneX(i) }); log(`Bel passaggio verso ${S.holder.n}.`);
    if (S.passes >= 3) { S.phase = "shot"; log("Tre passaggi puliti. Tira dove il portiere non è!"); } else newTargets();
    hud(); buttons(); return true;
  }
  function shoot(side) {
    if (!S || S.over || S.phase !== "shot") return false;
    const cx = W / 2 + side * 62, kx = W / 2 + Math.sin(S.f * 0.05 * L().sp + S.kph) * 62, reach = L().kp - 3 * (S.o.te | 0) - 3 * S.bonus + (side === 0 ? 6 : 0);
    return Math.abs(cx - kx) > Math.max(10, reach) ? finish(true, side === 0 ? "Fucilata centrale: il portiere si è già buttato." : "Palla nell'angolo! Il portiere arriva tardi.") : finish(false, "Parata. Il portiere era dall'altra parte, ma ci arriva.");
  }
  function finish(win, msg) {
    if (!S || S.over) return; S.over = true; S.win = win; S.phase = "end"; log(msg || (win ? "Gol!" : "Palla persa.")); buttons(); hud(); return true;
  }
  function close(win) { const o = S.o, r = { win: !!win, perfect: !!win && S.clean, passes: S.passes }; cancelAnimationFrame(raf); if (root) root.remove(); root = null; S = null; window.__catena.state = null; o.onDone && o.onDone(r); }
  function draw() {
    const g = cv.getContext("2d"); g.clearRect(0, 0, W, H);
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#15803d" : "#166534"; g.fillRect(0, i * 29, W, 29); }
    g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 2; g.strokeRect(70, 4, 240, 50); g.strokeRect(130, 4, 120, 22); g.beginPath(); g.arc(W / 2, H, 40, Math.PI, 0); g.stroke();
    // porta e portiere
    g.fillStyle = "#e5e7eb"; g.fillRect(124, 0, 132, 4); g.fillRect(124, 0, 4, 14); g.fillRect(252, 0, 4, 14);
    if (S.phase !== "pass") { const kx = W / 2 + Math.sin(S.f * 0.05 * L().sp + S.kph) * 62; g.fillStyle = "#facc15"; g.beginPath(); g.arc(kx, 20, 9, 0, 7); g.fill(); g.fillStyle = "#111"; g.fillRect(kx - 6, 18, 12, 3); }
    // difensori
    S.def.forEach((d) => { const x = dx(d); g.fillStyle = "#7f1d1d"; g.beginPath(); g.arc(x, 140, 10, 0, 7); g.fill(); g.strokeStyle = "#fca5a5"; g.lineWidth = 2; g.stroke(); });
    // compagni e linee di passaggio
    if (S.phase === "pass") S.targets.forEach((m, i) => {
      const x = laneX(i), q = sy(S.holder.rk, m.rk); g.strokeStyle = q ? "rgba(253,224,71,.55)" : "rgba(255,255,255,.28)"; g.setLineDash([5, 5]); g.lineWidth = 2; g.beginPath(); g.moveTo(S.holder.x, 200); g.lineTo(x, 70); g.stroke(); g.setLineDash([]);
      g.fillStyle = "#1d4ed8"; g.beginPath(); g.arc(x, 70, 11, 0, 7); g.fill(); g.strokeStyle = q ? "#fde047" : "#bfdbfe"; g.lineWidth = 2; g.stroke(); g.fillStyle = "#fff"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText(String(i + 1), x, 74);
    });
    g.fillStyle = "#2563eb"; g.beginPath(); g.arc(S.holder.x, 200, 12, 0, 7); g.fill(); g.strokeStyle = "#fde047"; g.lineWidth = 3; g.stroke();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(S.holder.x + 12, 206, 4, 0, 7); g.fill(); g.textAlign = "left";
  }
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop);
    if (S.over) { draw(); return; }
    S.f++; S.t -= 1 / 60; if (S.t <= 0) { finish(false, "Tempo scaduto: la difesa si è ricomposta."); return; } if (S.f % 15 === 0) hud(); draw();
  }
  function start(o) {
    css(); if (root) root.remove(); cancelAnimationFrame(raf);
    root = document.createElement("div"); root.id = "catOv"; document.body.appendChild(root);
    const team = (o.team && o.team.length ? o.team : [{ id: "hero", n: "Campione", icon: "⭐", rk: "" }]).slice(0, 5);
    const lv = LV[Math.max(1, Math.min(3, o.level || 1))];
    S = { o, team, holder: Object.assign({}, team[0], { x: W / 2 }), passes: 0, f: 0, t: lv.time + 3 * (o.at | 0), phase: "pass", over: false, win: false, clean: true, free: lv.free + (o.df ? 1 : 0), kph: Math.random() * 6, def: [{ ph: Math.random() * 6, v: 1 }, { ph: Math.random() * 6, v: 1.37 }], log: "Tocca il compagno quando la linea tratteggiata è libera." };
    S.bonus = 0; newTargets();
    root.innerHTML = `<h3><span>${esc(o.title || "Catena d'attacco")}</span><span>Livello ${o.level || 1}</span></h3><div class="sc" id="catSc"></div><canvas width="${W}" height="${H}"></canvas><div class="bt"></div><div class="lg">${esc(S.log)}</div>`;
    cv = root.querySelector("canvas");
    window.__catena.state = { pass: (i) => pass(i), shoot: (s) => shoot(s), finish: (w) => finish(!!w, w ? "Gol!" : "Palla persa."), close: () => S && close(S.win), get phase() { return S.phase; }, get passes() { return S.passes; }, get over() { return S.over; }, get keeperX() { return W / 2 + Math.sin(S.f * 0.05 * L().sp + S.kph) * 62; }, get blockedNow() { return [0, 1, 2].map(blocked); } };
    buttons(); hud(); loop(); return true;
  }
  window.__catena = { start, state: null };
})();
