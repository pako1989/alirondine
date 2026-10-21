// js/mondiale-cat.js - «AZIONE A CATENA» (ex Catena d'attacco) · il minigioco di «Ali di Rondine · Mondiale Giovanile» (e del cabinato in Sala Giochi)
// Vista dall'alto su un campo vero. Hai la palla in basso: tre compagni davanti a te, due difensori che scorrono in mezzo.
// Ogni linea di passaggio è VERDE se è libera, ROSSA se un difensore la intercetta: tocca il compagno (o il suo pulsante) quando è verde.
// Dopo tre passaggi puliti tira: scegli l'angolo dove il portiere NON è. Una catena senza intercetti è «perfetta».
// Le sinergie di ruolo (regista→ala, ala→punta…) allargano la linea libera (★). Alla prima partita parte una spiegazione in 3 pagine con prova senza tempo; il «?» la riapre.
// Opzioni: title, level (1-3), oppName, team [{id,n,icon,rk}], syn(a,b), roles, te (portiere meno reattivo), df (un'intercettazione perdonata), at (secondi in più),
// tutorial (false = niente spiegazione), onDone({win, perfect, passes}). Test: window.__catena.state.pass(0|1|2) · .shoot(-1|0|1) · .finish(win) · .blockedNow · .keeperX.
(function () {
  "use strict";
  if (window.__catena) return;
  const W = 380, H = 230, SS = 2, KEY = "ali-di-rondine.catena", esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const LV = { 1: { time: 26, blk: 30, sp: 1.1, kp: 38, free: 1 }, 2: { time: 21, blk: 26, sp: 1.5, kp: 32, free: 1 }, 3: { time: 17, blk: 22, sp: 1.9, kp: 28, free: 0 } };
  let S = null, root = null, cv = null, raf = 0, TUT = null, KD = null;
  const seen = () => safe(() => localStorage.getItem(KEY) === "1", false), markSeen = () => safe(() => localStorage.setItem(KEY, "1"), 0);
  const IMG = {}; const imgOf = (id) => { if (id === "hero" || !id) return null; if (IMG[id] !== undefined) return IMG[id]; const u = safe(() => window.__sogni.port(id), null); if (!u) return (IMG[id] = null); const i = new Image(); i.src = u; return (IMG[id] = i); };
  function css() {
    if (document.getElementById("catCss")) return;
    const st = document.createElement("style"); st.id = "catCss";
    st.textContent = `#catOv{position:fixed;inset:0;z-index:300;background:#06150e;color:#ecfdf5;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}#catOv .wr{max-width:560px;margin:0 auto;padding:8px;display:flex;flex-direction:column;gap:7px;min-height:100%}
#catOv .top{display:flex;justify-content:space-between;align-items:center;gap:8px}#catOv h3{margin:0;font:900 17px system-ui;color:#fde047}#catOv .hp{width:38px;height:38px;border-radius:50%;border:2px solid #fde047;background:#0f3d24;color:#fde047;font:900 18px system-ui}
#catOv .hud{display:flex;align-items:center;gap:10px;background:#0b2a1a;border:1px solid #16a34a;border-radius:10px;padding:6px 10px;font-size:13px}#catOv .pips{display:flex;gap:5px}#catOv .pip{width:16px;height:16px;border-radius:50%;border:2px solid #4ade80;background:transparent}#catOv .pip.on{background:#4ade80;box-shadow:0 0 8px #4ade80}
#catOv .tm{flex:1;height:10px;border-radius:6px;background:#052e16;border:1px solid #166534;overflow:hidden}#catOv .tm i{display:block;height:100%;background:#fde047;transition:width .2s}#catOv .tm.lo i{background:#f87171}#catOv .ph{font-weight:800;color:#fde047;min-width:52px;text-align:right}
#catOv .cvw{position:relative}#catOv canvas{display:block;width:100%;height:auto;border:2px solid #16a34a;border-radius:12px;background:#14532d;touch-action:none}
#catOv .bt{display:flex;gap:6px}#catOv .bt button{flex:1;min-height:58px;border-radius:12px;border:2px solid #fde047;background:#0f3d24;color:#ecfdf5;font:800 14px system-ui;padding:4px;position:relative}#catOv .bt button small{display:block;font-size:11px;font-weight:500;color:#bbf7d0}
#catOv .bt button .dot{position:absolute;top:5px;right:6px;width:11px;height:11px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px #4ade80}#catOv .bt button.bl{border-color:#7f1d1d;opacity:.8}#catOv .bt button.bl .dot{background:#ef4444;box-shadow:0 0 6px #ef4444}
#catOv .lg{font-size:13px;color:#bbf7d0;min-height:38px;background:#0b2a1a;border-radius:10px;padding:7px 10px;line-height:1.35}
#catOv .go{min-height:50px;border-radius:12px;border:2px solid #fde047;background:#166534;color:#fff;font:900 16px system-ui;width:100%}
#catOv.tutOn .cvw,#catOv.tutOn .bt,#catOv.tutOn .lg,#catOv.tutOn .hud{display:none}#catOv .tut{border-radius:12px;background:#0b2a1a;border:1px solid #16a34a;display:flex;flex-direction:column;padding:12px;gap:9px}#catOv .tut h4{margin:0;font:900 16px system-ui;color:#fde047}#catOv .tut p{margin:0;font-size:13px;line-height:1.4}#catOv .tut canvas{width:100%}
#catOv .tut .nv{display:flex;gap:6px;margin-top:4px}#catOv .tut .nv button{flex:1;min-height:42px;border-radius:10px;border:2px solid #fde047;background:#0f3d24;color:#fff;font:800 14px system-ui}#catOv .tut .nv .pr{background:#166534}`;
    document.head.appendChild(st);
  }
  const lvOf = (st) => LV[Math.max(1, Math.min(3, (st.o && st.o.level) || 1))];
  const sy = (st, a, b) => (st.o && st.o.syn ? st.o.syn(a, b) : 0);
  const laneX = (i) => 70 + i * 120;
  const dx = (st, d) => W / 2 + Math.sin(st.f * 0.04 * lvOf(st).sp * d.v + d.ph) * 150;
  const kxOf = (st) => W / 2 + Math.sin(st.f * 0.05 * lvOf(st).sp + st.kph) * 62;
  function blockedIn(st, i) {
    const hx = st.holder.x, hy = 200, tx = laneX(i), ty = 70, ey = 140, k = (hy - ey) / (hy - ty), lx = hx + (tx - hx) * k;
    const q = sy(st, st.holder.rk, st.targets[i].rk), r = Math.max(8, lvOf(st).blk - 5 * q);
    return st.def.some((d) => Math.abs(dx(st, d) - lx) < r);
  }
  const blocked = (i) => blockedIn(S, i);
  const teamOf = (o) => (o.team && o.team.length ? o.team : [{ id: "hero", n: "Campione", icon: "⭐", rk: "" }]).slice(0, 5);
  function newTargetsFor(st) {
    const pool = st.team.filter((m) => m.id !== st.holder.id), out = [];
    while (out.length < 3) { const m = pool.length ? pool.splice(Math.floor(Math.random() * pool.length), 1)[0] : { id: "x" + out.length, n: "Compagno", icon: "👟", rk: "" }; out.push(m); }
    st.targets = out;
  }
  function mkState(o, practice) {
    const team = teamOf(o), lv = LV[Math.max(1, Math.min(3, o.level || 1))];
    const st = { o, team, holder: Object.assign({}, team[0], { x: W / 2 }), passes: 0, f: 0, t: lv.time + 3 * (o.at | 0), t0: lv.time + 3 * (o.at | 0), phase: "pass", over: false, win: false, clean: true, free: lv.free + (o.df ? 1 : 0), kph: Math.random() * 6, def: [{ ph: Math.random() * 6, v: 1 }, { ph: Math.random() * 6, v: 1.37 }], bonus: 0, anim: null, shot: null, fxs: [], parts: [], banner: null, practice: !!practice, paused: false, log: "Tocca il compagno quando la linea è verde." };
    newTargetsFor(st); return st;
  }
  // ------------------------------------------------------------ disegno
  function man(g, x, y, o) {
    const s = o.s || 1, col = o.col || "#2563eb"; g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(0, 9, 10, 3.5, 0, 0, 7); g.fill();
    g.fillStyle = o.shorts || "#f8fafc"; g.beginPath(); g.roundRect(-6, 3, 12, 6, 2); g.fill();
    g.fillStyle = col; g.strokeStyle = "rgba(0,0,0,.65)"; g.lineWidth = 1.2; g.beginPath(); g.roundRect(-8, -7, 16, 13, 4); g.fill(); g.stroke();
    if (o.arms) { g.strokeStyle = "#e8c8a0"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(-8, -3); g.lineTo(-13, o.arms); g.moveTo(8, -3); g.lineTo(13, o.arms); g.stroke(); }
    if (o.num != null) { g.fillStyle = "rgba(255,255,255,.9)"; g.font = "900 8px system-ui"; g.textAlign = "center"; g.fillText(String(o.num), 0, 4); }
    const im = o.img, hy = -13; g.save(); g.beginPath(); g.arc(0, hy, 7.5, 0, 7); g.clip(); if (im && im.complete && im.naturalWidth) g.drawImage(im, -7.5, hy - 8, 15, 15); else { g.fillStyle = o.skin || "#e8c8a0"; g.fillRect(-8, hy - 8, 16, 16); if (o.icon) { g.font = "10px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(o.icon, 0, hy + 1); g.textBaseline = "alphabetic"; } } g.restore();
    g.strokeStyle = o.ring || "#fff"; g.lineWidth = o.rw || 1.8; g.beginPath(); g.arc(0, hy, 7.5, 0, 7); g.stroke(); g.restore();
  }
  function pitch(g, st) {
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? "#1f8a45" : "#1b7d3e"; g.fillRect(0, i * 23, W, 23); }
    g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 2; g.strokeRect(6, 3, W - 12, H - 6); g.strokeRect(70, 3, 240, 52); g.strokeRect(130, 3, 120, 24); g.beginPath(); g.arc(W / 2, 55, 26, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); g.beginPath(); g.arc(W / 2, H, 40, Math.PI, 0); g.stroke(); g.fillStyle = "rgba(255,255,255,.7)"; g.beginPath(); g.arc(W / 2, 40, 2, 0, 7); g.fill();
    // porta con rete
    g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(124, -2, 132, 16); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 0.7; for (let x = 124; x <= 256; x += 6) { g.beginPath(); g.moveTo(x, -2); g.lineTo(x, 14); g.stroke(); } for (let y = 0; y <= 14; y += 5) { g.beginPath(); g.moveTo(124, y); g.lineTo(256, y); g.stroke(); }
    g.fillStyle = "#fff"; g.fillRect(122, 12, 136, 3); g.fillRect(122, -2, 3, 17); g.fillRect(255, -2, 3, 17);
    [[8, 5], [W - 8, 5]].forEach(([x, y]) => { g.fillStyle = "#facc15"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (x < 100 ? 9 : -9), y + 3); g.lineTo(x, y + 6); g.fill(); g.fillStyle = "#e5e7eb"; g.fillRect(x - 0.5, y - 4, 1, 10); });
  }
  function ballAt(st) {
    if (st.anim) { const a = st.anim, k = Math.min(1, a.t / a.n); return [a.fx + (a.tx - a.fx) * k, a.fy + (a.ty - a.fy) * k - Math.sin(k * Math.PI) * 10]; }
    if (st.shot) { const a = st.shot, k = Math.min(1, a.t / a.n); return [st.holder.x + (a.tx - st.holder.x) * k, 204 + (a.ty - 204) * k - Math.sin(k * Math.PI) * 6]; }
    return [st.holder.x + 11, 207];
  }
  function scene(g, st, demo) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); pitch(g, st);
    const f = st.f, pass = st.phase === "pass", sh = st.phase === "shot" || st.phase === "end" && st.shot;
    // linee di passaggio: verde = libera, rossa = intercettata
    if (pass) st.targets.forEach((m, i) => {
      const x = laneX(i), q = sy(st, st.holder.rk, m.rk), bl = blockedIn(st, i), hx = st.holder.x, k = 60 / 130, lx = hx + (x - hx) * k;
      g.save(); g.lineCap = "round"; if (bl) { g.strokeStyle = "rgba(239,68,68,.85)"; g.lineWidth = 2.5; g.setLineDash([6, 6]); g.lineDashOffset = -f * 0.3; } else { g.strokeStyle = "#86efac"; g.shadowColor = "#4ade80"; g.shadowBlur = 8; g.lineWidth = 3 + Math.min(3, q); }
      g.beginPath(); g.moveTo(hx, 192); g.lineTo(x, 80); g.stroke(); g.restore();
      if (bl) { g.strokeStyle = "#fecaca"; g.lineWidth = 3; g.beginPath(); g.moveTo(lx - 5, 135); g.lineTo(lx + 5, 145); g.moveTo(lx + 5, 135); g.lineTo(lx - 5, 145); g.stroke(); }
    });
    // portiere, difensori, compagni, giocatore: dal fondo in avanti
    const kx = st.keeperDive != null ? st.keeperDive : kxOf(st);
    if (st.phase !== "pass" || demo === "shot") man(g, kx, 20, { col: "#facc15", shorts: "#1f2937", ring: "#fff7ae", arms: -4, icon: "🧤", s: 0.95 });
    if (sh) { const zs = [[-1, "↖"], [0, "↑"], [1, "↗"]]; zs.forEach(([s0, ch]) => { const cx = W / 2 + s0 * 62, near = Math.abs(cx - kxOf(st)) < 36; if (st.phase !== "shot") return; g.fillStyle = near ? "rgba(239,68,68,.35)" : "rgba(74,222,128,.4)"; g.beginPath(); g.roundRect(cx - 20, 18, 40, 26, 6); g.fill(); g.fillStyle = near ? "#fecaca" : "#dcfce7"; g.font = "900 14px system-ui"; g.textAlign = "center"; g.fillText(near ? "✖" : ch, cx, 36); }); }
    st.def.forEach((d) => { const x = dx(st, d); g.fillStyle = "rgba(239,68,68,.16)"; g.beginPath(); g.ellipse(x, 142, lvOf(st).blk * 0.55, 14, 0, 0, 7); g.fill(); man(g, x, 138, { col: "#b91c1c", ring: "#fca5a5", arms: 2, num: 4, s: 1.05 }); });
    if (pass) st.targets.forEach((m, i) => { const q = sy(st, st.holder.rk, m.rk), free = !blockedIn(st, i); man(g, laneX(i), 70, { col: "#1d4ed8", ring: q ? "#fde047" : "#bfdbfe", rw: q ? 2.6 : 1.8, img: imgOf(m.id), icon: m.icon, num: i + 1, s: 1.05 }); g.fillStyle = free ? "#4ade80" : "#f87171"; g.beginPath(); g.arc(laneX(i) + 12, 52, 4, 0, 7); g.fill(); if (q) { g.fillStyle = "#fde047"; g.font = "bold 9px system-ui"; g.textAlign = "center"; g.fillText("★".repeat(Math.min(3, q)), laneX(i), 94); } g.fillStyle = "#fff"; g.font = "bold 9px system-ui"; g.textAlign = "center"; g.strokeStyle = "#0008"; g.lineWidth = 2.5; g.strokeText(String(m.n).split(" ")[0], laneX(i), 50); g.fillText(String(m.n).split(" ")[0], laneX(i), 50); });
    man(g, st.holder.x, 198, { col: "#2563eb", ring: "#fde047", rw: 2.8, img: imgOf(st.holder.id), icon: st.holder.icon, num: 10, s: 1.2, arms: 1 });
    // suggerimento: pulsa sul primo compagno libero
    if ((demo === "pass" || demo === "syn" || (!st.over && st.hint)) && pass) { const i = [0, 1, 2].find((j) => !blockedIn(st, j)); if (i != null) { const a = 0.5 + 0.5 * Math.sin(f * 0.15); g.strokeStyle = `rgba(253,224,71,${0.4 + 0.5 * a})`; g.lineWidth = 3; g.beginPath(); g.arc(laneX(i), 62, 17 + a * 3, 0, 7); g.stroke(); g.font = "18px serif"; g.textAlign = "center"; g.fillText("👆", laneX(i) + 4, 96 + a * 4); } }
    // palla
    const b = ballAt(st); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(b[0], b[1] + 6, 4.5, 2, 0, 0, 7); g.fill(); g.fillStyle = "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(b[0], b[1], 4.2, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#222"; g.beginPath(); g.arc(b[0] + 0.8, b[1] - 0.5, 1.4, 0, 7); g.fill();
    st.parts.forEach((p) => { g.globalAlpha = Math.min(1, p.l / 14); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); }); g.globalAlpha = 1;
    g.font = "900 12px system-ui"; g.textAlign = "center"; st.fxs.forEach((x) => { g.globalAlpha = Math.min(1, x.l / 18); g.strokeStyle = "#000"; g.lineWidth = 3; g.fillStyle = x.c; g.strokeText(x.t, x.x, x.y - (40 - x.l) * 0.6); g.fillText(x.t, x.x, x.y - (40 - x.l) * 0.6); }); g.globalAlpha = 1;
    if (st.banner) { const k = Math.min(1, (60 - st.banner.l) / 8), a = Math.min(1, st.banner.l / 14); g.save(); g.globalAlpha = a; g.translate(W / 2, 118); g.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(-W / 2, -26, W, 52); g.font = "900 34px system-ui"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = "#000"; g.fillStyle = st.banner.c; g.strokeText(st.banner.t, 0, 12); g.fillText(st.banner.t, 0, 12); g.restore(); }
  }
  // ------------------------------------------------------------ logica
  function log(t) { if (!S) return; S.log = t; const e = root && root.querySelector(".lg"); if (e) e.textContent = t; }
  const fxAdd = (t, x, y, c) => { S.fxs.push({ t, x, y, c: c || "#fde047", l: 40 }); };
  function burst(x, y, n, cols) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 0.8 + Math.random() * 2.4; S.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.2, l: 30 + Math.random() * 30, c: cols[i % cols.length], s: 2 + Math.random() * 2 }); } }
  function hud() {
    const e = root && root.querySelector("#catSc"); if (!e || !S) return; const frac = S.practice ? 1 : Math.max(0, S.t / S.t0);
    e.innerHTML = `<div class="pips">${[0, 1, 2].map((i) => `<span class="pip${S.passes > i ? " on" : ""}"></span>`).join("")}</div><div class="tm${!S.practice && S.t < 6 ? " lo" : ""}"><i style="width:${frac * 100}%"></i></div><span class="ph">${S.practice ? "Prova" : S.phase === "shot" ? "Tiro!" : S.phase === "end" ? "" : Math.max(0, Math.ceil(S.t)) + "s"}</span>`;
  }
  function buttons() {
    const bt = root && root.querySelector(".bt"); if (!bt || !S) return;
    if (S.phase === "pass") bt.innerHTML = S.targets.map((m, i) => { const q = sy(S, S.holder.rk, m.rk); return `<button data-i="${i}"><i class="dot"></i>${i + 1} · ${esc(m.icon)} ${esc(String(m.n).split(" ")[0])}<small>${esc((S.o.roles || {})[m.rk] || m.rk || "—")} ${q ? "★".repeat(Math.min(3, q)) : ""}</small></button>`; }).join("");
    else if (S.phase === "shot") bt.innerHTML = `<button data-s="-1">↖ Sinistra<small>angolo</small></button><button data-s="0">↑ Centro<small>potente</small></button><button data-s="1">↗ Destra<small>angolo</small></button>`;
    else bt.innerHTML = S.practice ? `<button class="go" id="catRe" style="flex:1">↺ Riprova</button><button class="go" id="catGo2" style="flex:1">▶ Gioca davvero</button>` : `<button class="go" id="catGo">Continua ▸</button>`;
    bt.querySelectorAll("button[data-i]").forEach((b) => (b.onclick = () => pass(+b.dataset.i)));
    bt.querySelectorAll("button[data-s]").forEach((b) => (b.onclick = () => shoot(+b.dataset.s)));
    const g = bt.querySelector("#catGo"); if (g) g.onclick = () => close(S.win);
    const re = bt.querySelector("#catRe"); if (re) re.onclick = () => restart(true); const g2 = bt.querySelector("#catGo2"); if (g2) g2.onclick = () => restart(false);
  }
  function pass(i) {
    if (!S || S.over || S.phase !== "pass") return false;
    const m = S.targets[i], tx = laneX(i), hx = S.holder.x;
    if (blocked(i)) {
      const d = S.def.slice().sort((a, b) => Math.abs(dx(S, a) - (hx + (tx - hx) * (60 / 130))) - Math.abs(dx(S, b) - (hx + (tx - hx) * (60 / 130))))[0], ix = dx(S, d);
      S.anim = { fx: hx + 11, fy: 207, tx: ix, ty: 142, t: 0, n: 12 };
      if (S.free > 0) { S.free--; S.clean = false; fxAdd("Quasi!", ix, 120, "#f87171"); log("Intercettato! Ti sei salvato per un soffio: riprova con una linea verde."); return false; }
      S.banner = { t: "INTERCETTATO!", c: "#f87171", l: 60 }; return finish(false, "Intercettato: il difensore legge il passaggio e la catena si spezza. Aspetta che la linea diventi verde.");
    }
    const q = sy(S, S.holder.rk, m.rk); S.bonus += q; S.passes++; S.anim = { fx: hx + 11, fy: 207, tx, ty: 74, t: 0, n: 14 }; S.holder = Object.assign({}, m, { x: tx }); fxAdd(q ? "Bel passaggio ★" : "Bel passaggio", tx, 58, q ? "#fde047" : "#86efac");
    log(`Passaggio ${S.passes}/3 verso ${S.holder.n}.`);
    if (S.passes >= 3) { S.phase = "shot"; S.hint = false; log("Tre passaggi puliti! Tira nell'angolo VERDE: la zona rossa è dove arriva il portiere."); } else newTargetsFor(S);
    hud(); buttons(); return true;
  }
  function shoot(side) {
    if (!S || S.over || S.phase !== "shot") return false;
    const cx = W / 2 + side * 62, kx = kxOf(S), reach = lvOf(S).kp - 3 * (S.o.te | 0) - 3 * S.bonus + (side === 0 ? 6 : 0), ok = Math.abs(cx - kx) > Math.max(10, reach);
    S.shot = { side, win: ok, t: 0, n: 22, tx: cx, ty: ok ? 4 : 18 }; S.kStart = kx; S.kEnd = ok ? kx + (cx >= kx ? -1 : 1) * 4 + (cx - kx) * 0.35 : cx;
    S.banner = { t: ok ? "GOL!" : "PARATA!", c: ok ? "#fde047" : "#f87171", l: 70 };
    return finish(ok, ok ? (side === 0 ? "Fucilata centrale: il portiere si è già buttato." : "Palla nell'angolo! Il portiere arriva tardi.") : "Parata. Il portiere era nella zona rossa: guarda dove va prima di tirare.");
  }
  function finish(win, msg) {
    if (!S || S.over) return; S.over = true; S.win = win; S.phase = "end"; log(msg || (win ? "Gol!" : "Palla persa.")); if (win) burst(W / 2, 40, 60, ["#fde047", "#4ade80", "#fff", "#60a5fa"]); buttons(); hud(); return true;
  }
  function restart(practice) { if (!S) return; const o = S.o; S = mkState(o, practice); S.hint = !!practice; hudAll(); }
  function hudAll() { hud(); buttons(); log(S.log); }
  function close(win) { const o = S.o, r = { win: !!win, perfect: !!win && S.clean, passes: S.passes }; cancelAnimationFrame(raf); if (KD) { removeEventListener("keydown", KD); KD = null; } if (root) root.remove(); root = null; S = null; TUT = null; window.__catena.state = null; if (o.onDone) o.onDone(r); }
  // ------------------------------------------------------------ spiegazione (3 pagine con scena animata)
  const PAGES = [
    { t: "1 · Passa la palla", demo: "pass", p: "Sei in basso con la palla. Tre compagni sono davanti. Due difensori rossi si muovono avanti e indietro: se uno è sulla linea, il passaggio viene intercettato.<br><b style='color:#86efac'>Linea VERDE = libera, tocca il compagno. Linea ROSSA con ✖ = bloccata, aspetta.</b>" },
    { t: "2 · Ruoli e stelle ★", demo: "syn", p: "Ogni compagno ha un ruolo. Passare tra ruoli che si intendono (regista→ala, ala→punta…) dà ★: la linea resta libera anche quando il difensore è vicino, e il tiro finale diventa più facile.<br>Una catena <b>senza intercetti</b> è «perfetta»." },
    { t: "3 · Tira!", demo: "shot", p: "Dopo 3 passaggi puliti tiri. Il portiere va avanti e indietro: la zona <b style='color:#fca5a5'>rossa</b> è dove arriva, quella <b style='color:#86efac'>verde</b> è libera. Tocca l'angolo verde (o il pulsante) prima che finisca il tempo." },
  ];
  function demoState(kind) {
    const team = [{ id: "hero", n: "Campione", icon: "⭐", rk: "a" }, { id: "d1", n: "Elio", icon: "🎯", rk: "b" }, { id: "d2", n: "Nina", icon: "💨", rk: "c" }, { id: "d3", n: "Bruno", icon: "🔥", rk: "d" }];
    const o = { level: 1, team, syn: kind === "syn" ? (a, b) => (a === "a" && b === "b" ? 2 : a === "a" && b === "c" ? 1 : 0) : () => 0 };
    const st = mkState(o, false); st.o = o; st.holder = Object.assign({}, team[0], { x: W / 2 }); st.targets = [team[1], team[2], team[3]]; if (kind === "shot") { st.phase = "shot"; st.passes = 3; st.holder = Object.assign({}, team[2], { x: 190 }); } return st;
  }
  function openTut(page) {
    const wrap = root && root.querySelector(".wr"); if (!wrap) return; if (!TUT) { if (S) S.paused = true; } root.classList.add("tutOn");
    TUT = { page: page | 0, st: null, cv: null, raf: 0 }; let el = wrap.querySelector(".tut"); if (!el) { el = document.createElement("div"); el.className = "tut"; wrap.insertBefore(el, wrap.querySelector(".cvw")); }
    const pg = PAGES[TUT.page], last = TUT.page === PAGES.length - 1;
    el.innerHTML = `<h4>${pg.t}</h4><canvas width="${W * SS}" height="${H * SS}"></canvas><p>${pg.p}</p><div class="nv">${TUT.page ? `<button data-a="b">◂ Indietro</button>` : `<button data-a="x">Salta</button>`}${last ? `<button class="pr" data-a="pr">🎮 Prova libera</button><button class="pr" data-a="go">▶ Gioca</button>` : `<button class="pr" data-a="n">Avanti ▸</button>`}</div>`;
    TUT.st = demoState(pg.demo); TUT.cv = el.querySelector("canvas"); const g = TUT.cv.getContext("2d");
    const lp = () => { if (!TUT || !TUT.cv || !TUT.cv.isConnected) return; TUT.st.f++; scene(g, TUT.st, pg.demo); TUT.raf = requestAnimationFrame(lp); }; lp();
    el.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { const a = b.dataset.a; cancelAnimationFrame(TUT.raf); if (a === "n") return openTut(TUT.page + 1); if (a === "b") return openTut(TUT.page - 1); closeTut(a === "pr"); }));
  }
  function closeTut(practice) { const el = root && root.querySelector(".tut"); if (TUT) cancelAnimationFrame(TUT.raf); if (el) el.remove(); if (root) root.classList.remove("tutOn"); TUT = null; markSeen(); if (practice) { restart(true); } else if (S) S.paused = false; }
  // ------------------------------------------------------------ ciclo
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop); const g = cv.getContext("2d");
    S.parts = S.parts.filter((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; return --p.l > 0; }); S.fxs = S.fxs.filter((x) => --x.l > 0); if (S.banner && --S.banner.l <= 0) S.banner = null;
    if (S.anim && ++S.anim.t > S.anim.n + 4) S.anim = null;
    if (S.shot) { S.shot.t++; const k = Math.min(1, Math.max(0, (S.shot.t - 5) / 14)); S.keeperDive = S.kStart + (S.kEnd - S.kStart) * k; }
    if (!S.over && !S.paused) {
      S.f++; if (!S.practice) S.t -= 1 / 60; if (!S.practice && S.t <= 0) { S.banner = { t: "TEMPO!", c: "#f87171", l: 60 }; finish(false, "Tempo scaduto: la difesa si è ricomposta."); } else if (S.f % 6 === 0) { hud(); const bt = root.querySelectorAll(".bt button[data-i]"); bt.forEach((b, i) => b.classList.toggle("bl", S.phase === "pass" && blocked(i))); }
    }
    scene(g, S);
  }
  function start(o) {
    css(); if (root) root.remove(); cancelAnimationFrame(raf); if (KD) removeEventListener("keydown", KD);
    root = document.createElement("div"); root.id = "catOv"; document.body.appendChild(root); S = mkState(o, false); TUT = null;
    root.innerHTML = `<div class="wr"><div class="top"><h3>${esc(o.title || "Azione a catena")} · Livello ${o.level || 1}</h3><button class="hp" aria-label="Come si gioca">?</button></div><div class="hud" id="catSc"></div><div class="cvw"><canvas width="${W * SS}" height="${H * SS}"></canvas></div><div class="bt"></div><div class="lg">${esc(S.log)}</div></div>`;
    cv = root.querySelector("canvas");
    root.querySelector(".hp").onclick = () => { if (!TUT && S && !S.over) openTut(0); };
    cv.addEventListener("pointerdown", (e) => { if (!S || S.over || TUT) return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H; if (S.phase === "shot") shoot(x < W * 0.38 ? -1 : x > W * 0.62 ? 1 : 0); else if (S.phase === "pass" && y < 130) pass(Math.max(0, Math.min(2, Math.round((x - 70) / 120)))); });
    KD = (e) => { if (!S || S.over || TUT) return; if (S.phase === "pass" && "123".includes(e.key) && e.key) pass(+e.key - 1); else if (S.phase === "shot") { if (e.key === "ArrowLeft" || e.key === "a") shoot(-1); else if (e.key === "ArrowRight" || e.key === "d") shoot(1); else if (e.key === "ArrowUp" || e.key === "w") shoot(0); } }; addEventListener("keydown", KD);
    window.__catena.state = { pass: (i) => pass(i), shoot: (s) => shoot(s), finish: (w) => finish(!!w, w ? "Gol!" : "Palla persa."), close: () => S && close(S.win), tut: () => !!TUT, get phase() { return S.phase; }, get passes() { return S.passes; }, get over() { return S.over; }, get keeperX() { return kxOf(S); }, get blockedNow() { return [0, 1, 2].map(blocked); }, get practice() { return S.practice; } };
    buttons(); hud(); loop(); if (o.tutorial !== false && !seen()) openTut(0); return true;
  }
  window.__catena = { start, state: null };
})();
