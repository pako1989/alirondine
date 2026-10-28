// js/pausa.js - «SQUADRA IN PAUSA» · motore di scontro in tempo reale con pausa tattica (Missione Senza Ritorno, stile Mass Effect)
// Vista dall'alto. I Raccoglitori avanzano da destra verso la tua barricata. Tocchi un nemico = calci un pallone contro di lui; tocchi il terreno = il Campione si sposta.
// «⏸ Ruota»: il tempo si ferma e scegli il potere di un compagno (ognuno ne ha uno, con ricarica), poi tocchi il bersaglio. I compagni sparano da soli, piano.
// Ondate: vinci se resisti a tutte; perdi se la barricata cade o il Campione resta senza energia.
// Opzioni: title, foeCol / foeEye (colori dei nemici), waves: [[tipo, quanti], ...] per ondata (tipi: base, scudo, lesto, grosso, boss), mates: [{ id, n, icon, pow }], bonus (0-3), arena: "ponte"|"nave"|"tana"|"sale"|"torre"|"campo"|"flotta",
//   tutorial (false = niente spiegazione), onDone({ a, b, win, lost }). Poteri: tiro, onda, schiuma, rete, scudo, drone, ombra, hack.
// Test: window.__pausa.state.finish(win) · .tap(x, y) · .wheel() · .power(i) · .kills · pulsante #paGo. Richiede js/mini.js.
(function () {
  "use strict";
  if (window.__pausa) return;
  const M = window.__mini || {}, W = M.W || 380, H = M.H || 230, esc = M.esc || ((s) => String(s == null ? "" : s));
  const BARX = 70, POW = {
    tiro: { n: "Tiro di precisione", icon: "🎯", cd: 420, d: "3 danni a un bersaglio, rompe gli scudi" },
    onda: { n: "Onda d'urto", icon: "💥", cd: 540, d: "Spinge indietro chi è vicino al bersaglio, 1 danno" },
    schiuma: { n: "Schiuma collante", icon: "🫧", cd: 520, d: "Rallenta e logora una zona" },
    rete: { n: "Rete", icon: "🕸️", cd: 480, d: "Ferma un nemico per 3 secondi, 2 danni" },
    scudo: { n: "Barricata", icon: "🛡️", cd: 600, d: "Ripara la barricata" },
    drone: { n: "Drone esca", icon: "🛸", cd: 560, d: "Attira i nemici per 5 secondi" },
    ombra: { n: "Colpo dall'ombra", icon: "🗡️", cd: 780, d: "Mette a terra un nemico (non il capo)" },
    hack: { n: "Riprogramma", icon: "📡", cd: 720, d: "Un nemico combatte per te per 6 secondi" },
    calcio: { n: "Tiro caricato", icon: "⚽", cd: 360, d: "2 danni, rompe gli scudi" }
  };
  const TYPES = {
    base: { hp: 2, sp: 0.32, col: "#1f2937", r: 7, dmg: 4 },
    scudo: { hp: 3, sp: 0.24, col: "#334155", r: 8, dmg: 5, sh: 1 },
    lesto: { hp: 1, sp: 0.6, col: "#3f3f46", r: 6, dmg: 3 },
    grosso: { hp: 6, sp: 0.18, col: "#111827", r: 11, dmg: 9 },
    boss: { hp: 14, sp: 0.16, col: "#422006", r: 14, dmg: 12, sh: 1, boss: 1 }
  };
  let S = null, ui = null, raf = 0, tutC = null;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function diffK() { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; }
  // ------------------------------------------------------------ stato
  function mk(o, practice) {
    const mates = (o.mates || []).slice(0, 2).map((m, i) => ({ id: m.id, n: m.n, icon: m.icon || "🙂", pow: POW[m.pow] ? m.pow : "tiro", x: 40, y: 80 + i * 70, cd: 0, shot: 60 + i * 40, img: M.img && M.img(m.id) }));
    const waves = practice ? [[["base", 3]]] : (o.waves && o.waves.length ? o.waves : [[["base", 4]], [["base", 3], ["lesto", 2]], [["scudo", 2], ["base", 3]]]);
    return { o, mates, waves, wave: 0, queue: [], spawnT: 40, foes: [], balls: [], zones: [], decoy: null, hero: { x: 46, y: 115, tx: 46, ty: 115, hp: 100, cd: 0 }, bar: 100, paused: false, sel: null, phase: "play", kills: 0, f: 0, log: practice ? "Prova libera: una sola ondata, nulla conta." : "", practice: !!practice, fxo: M.fx(), bonus: Math.max(0, Math.min(3, o.bonus | 0)), arena: o.arena || "ponte" };
  }
  function fillQueue() {
    const w = S.waves[S.wave] || [], q = []; w.forEach(([t, n]) => { for (let i = 0; i < n; i++) q.push(TYPES[t] ? t : "base"); });
    S.queue = q.sort(() => Math.random() - 0.5); const bi = S.queue.indexOf("boss"); if (bi > 0) S.queue.push(S.queue.splice(bi, 1)[0]);
    S.fxo.banner(S.practice ? "PROVA" : `ONDATA ${S.wave + 1}/${S.waves.length}`, "#7dd3fc"); S.spawnT = 50;
  }
  function spawn(t) { const T = TYPES[t], k = diffK(); S.foes.push({ t, x: W + 10, y: 40 + Math.random() * (H - 80), hp: T.hp, max: T.hp, sp: T.sp * k * (0.9 + Math.random() * 0.2), r: T.r, col: (S.o.foeCol && !T.boss) ? S.o.foeCol : T.col, eye: S.o.foeEye || "#facc15", sh: T.sh ? 1 : 0, boss: !!T.boss, dmg: T.dmg, stun: 0, slow: 0, ally: 0, atk: 0, wob: Math.random() * 6 }); }
  // ------------------------------------------------------------ colpi
  function hurt(e, n, breakSh) {
    if (!e || e.hp <= 0) return; if (e.sh && !breakSh) { S.fxo.text("SCUDO", e.x, e.y - 12, "#93c5fd"); n = Math.max(0, n - 1); }
    if (breakSh && e.sh) { e.sh = 0; S.fxo.text("SCUDO ROTTO", e.x, e.y - 14, "#fde047"); }
    e.hp -= n; S.fxo.burst(e.x, e.y, 6, ["#fff", "#94a3b8"]);
    if (e.hp <= 0) { S.kills++; S.fxo.burst(e.x, e.y, 14, ["#fde047", "#f97316", "#fff"]); if (e.boss) S.fxo.shake(8); }
  }
  function kick(from, e, dmg, br, col) { S.balls.push({ x: from.x, y: from.y, e, dmg, br: !!br, col: col || "#f8fafc", sp: 5.5 }); }
  function foeAt(x, y, rad) { let best = null, bd = rad || 18; S.foes.forEach((e) => { if (e.hp <= 0) return; const d = Math.hypot(e.x - x, e.y - y); if (d < bd + e.r) { bd = d; best = e; } }); return best; }
  function usePower(m, x, y) {
    const p = m.pow, e = foeAt(x, y, 22), b = S.bonus;
    if (p === "tiro" || p === "calcio") { if (!e) return false; kick(m, e, (p === "tiro" ? 3 : 2) + (b >= 2 ? 1 : 0), true, p === "tiro" ? "#fde047" : "#f8fafc"); }
    else if (p === "onda") { S.foes.forEach((f) => { if (f.hp > 0 && Math.hypot(f.x - x, f.y - y) < 54) { f.x = Math.min(W + 6, f.x + 60); f.stun = 40; hurt(f, 1, false); } }); S.zones.push({ x, y, r: 54, t: 22, c: "rgba(168,85,247,", k: "onda" }); S.fxo.shake(5); }
    else if (p === "schiuma") S.zones.push({ x, y, r: 42, t: 300, c: "rgba(134,239,172,", k: "schiuma" });
    else if (p === "rete") { if (!e) return false; e.stun = 180; hurt(e, 2, false); S.zones.push({ x: e.x, y: e.y, r: 16, t: 30, c: "rgba(226,232,240,", k: "rete" }); }
    else if (p === "scudo") { S.bar = Math.min(100, S.bar + 35 + b * 5); S.fxo.text("+BARRICATA", BARX, 60, "#86efac"); }
    else if (p === "drone") S.decoy = { x: Math.max(BARX + 30, x), y, t: 300 };
    else if (p === "ombra") { if (!e) return false; if (e.boss) hurt(e, 4, true); else hurt(e, 99, true); S.fxo.text("OMBRA", e.x, e.y - 16, "#c4b5fd"); }
    else if (p === "hack") { if (!e) return false; if (e.boss) { e.stun = 120; S.fxo.text("RESISTE", e.x, e.y - 16, "#fca5a5"); } else e.ally = 360; }
    m.cd = POW[p].cd; return true;
  }
  // ------------------------------------------------------------ tick
  function step() {
    if (S.phase !== "play" || S.paused) return;
    const h = S.hero;
    // spostamento del Campione (resta dietro la barricata)
    const dx = h.tx - h.x, dy = h.ty - h.y, d = Math.hypot(dx, dy); if (d > 1) { h.x += dx / d * Math.min(2.2, d); h.y += dy / d * Math.min(2.2, d); }
    h.cd > 0 && h.cd--; h.kc > 0 && h.kc--; S.mates.forEach((m, i) => { m.cd > 0 && m.cd--; m.x += ((h.x - 18) - m.x) * 0.05; m.y += ((h.y + (i ? 34 : -34)) - m.y) * 0.05; m.y = Math.max(22, Math.min(H - 22, m.y));
      if (--m.shot <= 0) { m.shot = 130 - S.bonus * 10; const t = S.foes.filter((e) => e.hp > 0 && !e.ally).sort((a, b) => a.x - b.x)[0]; if (t) kick(m, t, 1, false, "#cbd5e1"); } });
    // ondate
    if (S.queue.length) { if (--S.spawnT <= 0) { spawn(S.queue.shift()); S.spawnT = Math.max(28, 70 - S.wave * 8) / diffK(); } }
    // nemici
    S.foes.forEach((e) => {
      if (e.hp <= 0) return; e.wob += 0.15;
      if (e.ally > 0) { e.ally--; const t = S.foes.find((o) => o !== e && o.hp > 0 && !o.ally && Math.hypot(o.x - e.x, o.y - e.y) < 90); if (t && S.f % 40 === 0) kick(e, t, 1, false, "#a5f3fc"); return; }
      if (e.stun > 0) { e.stun--; return; }
      let sp = e.sp; S.zones.forEach((z) => { if (z.k === "schiuma" && Math.hypot(z.x - e.x, z.y - e.y) < z.r) { sp *= 0.4; if (S.f % 45 === 0) hurt(e, 1, false); } });
      const tgt = S.decoy ? S.decoy : { x: BARX + e.r, y: e.y };
      if (e.x > tgt.x + 2) { e.x -= sp; e.y += (tgt.y - e.y) * 0.01 * sp; } else if (++e.atk >= 60) { e.atk = 0; if (!S.decoy) { S.bar -= e.dmg * (S.practice ? 0.3 : 1); S.fxo.shake(3); S.fxo.burst(BARX, e.y, 6, ["#fbbf24", "#78350f"]); } }
      // i nemici vicini alla barricata tirano anche al Campione
      if (e.x < BARX + 70 && S.f % (e.boss ? 70 : 140) === Math.floor(e.wob * 10) % (e.boss ? 70 : 140) && !S.decoy) { S.balls.push({ x: e.x, y: e.y, tx: h.x, ty: h.y, foe: true, dmg: e.boss ? 9 : 4, sp: 3.4, col: "#ef4444" }); }
    });
    if (S.decoy && --S.decoy.t <= 0) S.decoy = null;
    // palloni
    S.balls = S.balls.filter((b) => {
      if (b.foe) { const dx = b.tx - b.x, dy = b.ty - b.y, d = Math.hypot(dx, dy); if (d < 6) { if (Math.hypot(h.x - b.tx, h.y - b.ty) < 14) { h.hp -= b.dmg * (S.practice ? 0.3 : 1) * (1 - S.bonus * 0.1); S.fxo.text("-" + b.dmg, h.x, h.y - 14, "#fca5a5"); } return false; } b.x += dx / d * b.sp; b.y += dy / d * b.sp; return true; }
      const e = b.e; if (!e || e.hp <= 0) return false; const dx = e.x - b.x, dy = e.y - b.y, d = Math.hypot(dx, dy); if (d < e.r + 2) { hurt(e, b.dmg, b.br); return false; } b.x += dx / d * b.sp; b.y += dy / d * b.sp; return true;
    });
    S.zones = S.zones.filter((z) => --z.t > 0);
    S.foes = S.foes.filter((e) => e.hp > 0 || false);
    // fine
    if (S.bar <= 0 || h.hp <= 0) { S.bar = Math.max(0, S.bar); h.hp = Math.max(0, h.hp); return end(false); }
    if (!S.queue.length && !S.foes.length) { if (S.wave + 1 >= S.waves.length) return end(true); S.wave++; fillQueue(); }
  }
  // ------------------------------------------------------------ disegno
  function arena(g, f) {
    const A = S ? S.arena : "ponte";
    if (A === "nave") { g.fillStyle = "#1e293b"; g.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 24) for (let y = 0; y < H; y += 24) { g.fillStyle = (x + y) % 48 ? "#243247" : "#22304a"; g.fillRect(x, y, 23, 23); g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(x + 2, y + 2, 2, 2); } g.fillStyle = "#0f172a"; g.fillRect(0, 0, W, 16); g.fillRect(0, H - 16, W, 16); for (let x = 10; x < W; x += 60) { g.fillStyle = `rgba(56,189,248,${0.4 + 0.3 * Math.sin(f / 15 + x)})`; g.fillRect(x, 6, 30, 3); } }
    else if (A === "tana") { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "#1c1917"); gr.addColorStop(1, "#3b1d0e"); g.fillStyle = gr; g.fillRect(0, 0, W, H); for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(234,179,8,${0.1 + 0.08 * Math.sin(f / 20 + i)})`; g.beginPath(); g.ellipse((i * 67) % W, (i * 41) % H, 9, 5, i, 0, 7); g.fill(); } g.strokeStyle = "rgba(120,53,15,.6)"; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(0, 30 + i * 36); g.bezierCurveTo(120, 10 + i * 36, 260, 60 + i * 36, W, 30 + i * 36); g.stroke(); } }
    else if (A === "sale") { g.fillStyle = "#e7e5e4"; g.fillRect(0, 0, W, H); for (let i = 0; i < 70; i++) { g.fillStyle = i % 3 ? "rgba(168,162,158,.25)" : "rgba(255,255,255,.6)"; g.fillRect((i * 83) % W, (i * 47) % H, 10 + (i % 4) * 6, 1); } g.strokeStyle = "rgba(120,113,108,.35)"; g.lineWidth = 1; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo((i * 61) % W, 0); g.lineTo((i * 61 + 40) % W, H); g.stroke(); } const gr = g.createRadialGradient(W - 40, 20, 0, W - 40, 20, 200); gr.addColorStop(0, `rgba(255,237,160,${0.45 + 0.08 * Math.sin(f / 20)})`); gr.addColorStop(1, "rgba(255,237,160,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    else if (A === "campo") { g.fillStyle = "#3f4f36"; g.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 30) { g.fillStyle = (x / 30) % 2 ? "#44563a" : "#3b4a33"; g.fillRect(x, 0, 30, H); } g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 2; g.strokeRect(14, 14, W - 28, H - 28); g.beginPath(); g.arc(W / 2, H / 2, 34, 0, 7); g.stroke(); for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(90,110,70,.6)"; g.fillRect((i * 71) % W, (i * 37) % H, 2, 5); } g.strokeStyle = "rgba(180,200,230,.35)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 50; i++) { const x = (i * 47 + f * 1.4) % (W + 20) - 10, y = (i * 71 + f * 5) % (H + 10) - 5; g.moveTo(x, y); g.lineTo(x - 2, y + 7); } g.stroke(); }
    else if (A === "flotta") { g.fillStyle = "#1a6699"; g.fillRect(0, 0, W, H); for (let i = 0; i < 30; i++) { g.fillStyle = "rgba(255,255,255,.3)"; g.fillRect((i * 59 + f * 0.6) % W, (i * 31) % H, 8, 1); } for (let b = 0; b < 3; b++) { const y = 24 + b * ((H - 48) / 3), h = (H - 48) / 3 - 8; g.fillStyle = ["#7c4a1e", "#6b3f19", "#85521f"][b]; g.fillRect(0, y, W, h); for (let x = 0; x < W; x += 12) { g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x, y, 1, h); } g.fillStyle = ["#b91c1c", "#1d4ed8", "#7e22ce"][b]; g.fillRect(0, y + h - 3, W, 3); } }
    else if (A === "torre") { g.fillStyle = "#1c1917"; g.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 32) for (let y = 0; y < H; y += 32) { g.fillStyle = (x / 32 + y / 32) % 2 ? "#292524" : "#44403c"; g.fillRect(x, y, 32, 32); } g.fillStyle = "rgba(125,211,252,.18)"; g.fillRect(0, 0, W, 14); for (let x = 0; x < W; x += 46) { g.fillStyle = "#a16207"; g.fillRect(x + 20, 0, 2, 14); } for (let i = 0; i < 5; i++) { g.fillStyle = "#57534e"; g.fillRect(110 + i * 50, 40 + (i % 2) * 110, 26, 14); g.fillStyle = "rgba(250,204,21,.25)"; g.fillRect(112 + i * 50, 42 + (i % 2) * 110, 22, 3); } }
    else { g.fillStyle = "#0b1220"; g.fillRect(0, 0, W, H); g.fillStyle = "#4b5563"; g.fillRect(0, 22, W, H - 44); for (let x = 0; x < W; x += 16) { g.fillStyle = x % 32 ? "#525c6b" : "#4b5563"; g.fillRect(x, 22, 15, H - 44); } g.fillStyle = "#94a3b8"; g.fillRect(0, 20, W, 3); g.fillRect(0, H - 23, W, 3); for (let x = 6; x < W; x += 40) { g.fillStyle = "#64748b"; g.fillRect(x, 12, 3, 10); g.fillRect(x, H - 22, 3, 10); } for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(56,189,248,${0.25 + 0.2 * Math.sin(f / 30 + i)})`; g.fillRect((i * 53 + f * 0.4) % W, 4 + (i % 3) * 4, 6, 1); g.fillRect((i * 71 + f * 0.3) % W, H - 8 + (i % 2) * 3, 6, 1); } }
    // barricata
    const hp = S ? S.bar / 100 : 1; for (let y = 26; y < H - 26; y += 14) { g.fillStyle = hp > 0.5 ? "#a16207" : hp > 0.2 ? "#92400e" : "#7f1d1d"; g.fillRect(BARX - 5, y, 10, 12); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(BARX - 5, y, 10, 2); }
  }
  function foeDraw(g, e) {
    g.save(); g.translate(e.x, e.y + Math.sin(e.wob) * 1.2); g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(0, e.r, e.r, e.r * 0.35, 0, 0, 7); g.fill();
    g.fillStyle = e.ally ? "#0e7490" : e.col; g.beginPath(); g.ellipse(0, 0, e.r * 0.8, e.r, 0, 0, 7); g.fill(); g.strokeStyle = e.ally ? "#67e8f9" : "#a16207"; g.lineWidth = 1.4; g.stroke();
    // maschera da insetto: due occhi gialli
    g.fillStyle = e.ally ? "#a5f3fc" : (e.eye || "#facc15"); g.beginPath(); g.ellipse(-e.r * 0.3, -e.r * 0.35, e.r * 0.22, e.r * 0.15, -0.4, 0, 7); g.ellipse(e.r * 0.3, -e.r * 0.35, e.r * 0.22, e.r * 0.15, 0.4, 0, 7); g.fill();
    if (e.sh) { g.strokeStyle = "rgba(147,197,253,.85)"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, e.r + 4, -1.2, 1.2); g.stroke(); }
    if (e.stun) { g.fillStyle = "#e2e8f0"; g.font = "8px serif"; g.textAlign = "center"; g.fillText("✦", Math.sin(e.wob * 2) * 5, -e.r - 4); }
    if (e.boss || e.max > 2) { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(-12, -e.r - 9, 24, 3); g.fillStyle = "#ef4444"; g.fillRect(-12, -e.r - 9, 24 * Math.max(0, e.hp / e.max), 3); }
    g.restore();
  }
  function scene(g, st, f, demo) {
    g.setTransform(M.SS, 0, 0, M.SS, 0, 0); g.clearRect(0, 0, W, H); const sv = S; S = st; arena(g, f);
    const sh = st.fxo && st.fxo.sh > 0 ? (Math.random() - 0.5) * st.fxo.sh : 0; g.save(); g.translate(sh, 0);
    st.zones.forEach((z) => { g.fillStyle = z.c + (z.k === "schiuma" ? 0.25 : 0.35) + ")"; g.beginPath(); g.arc(z.x, z.y, z.r * (z.k === "onda" ? 1.2 - z.t / 30 : 1), 0, 7); g.fill(); });
    if (st.decoy) { g.save(); g.translate(st.decoy.x, st.decoy.y + Math.sin(f / 6) * 3); g.fillStyle = "#38bdf8"; g.beginPath(); g.ellipse(0, 0, 9, 4, 0, 0, 7); g.fill(); g.fillStyle = "#e0f2fe"; g.fillRect(-1, -6, 2, 4); g.restore(); }
    st.foes.forEach((e) => foeDraw(g, e));
    st.mates.forEach((m) => M.man(g, m.x, m.y, { col: "#0f766e", ring: m.cd ? "#64748b" : "#5eead4", icon: m.icon, img: m.img, s: 0.85 }));
    const h = st.hero, hl = (st.o && st.o.heroLook) || {}; M.man(g, h.x, h.y, { col: hl.shirt || "#1d4ed8", skin: hl.skin, ring: "#fde047", icon: "⭐", s: 1 });
    st.balls.forEach((b) => { g.fillStyle = b.col; g.beginPath(); g.arc(b.x, b.y, b.foe ? 2.5 : 3, 0, 7); g.fill(); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(b.x - 1, b.y - 1, 2, 2); });
    g.restore();
    if (st.paused) { g.fillStyle = "rgba(15,23,42,.45)"; g.fillRect(0, 0, W, H); g.strokeStyle = "rgba(125,211,252,.7)"; g.lineWidth = 2; g.strokeRect(3, 3, W - 6, H - 6); g.font = "900 13px system-ui"; g.fillStyle = "#7dd3fc"; g.textAlign = "center"; g.fillText(st.sel != null ? "Tocca il bersaglio" : "PAUSA TATTICA · scegli un potere", W / 2, 18); }
    // barre
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(6, H - 14, 110, 9); g.fillStyle = "#facc15"; g.fillRect(8, H - 12, 106 * Math.max(0, st.bar / 100), 5); g.font = "700 7px system-ui"; g.fillStyle = "#fff"; g.textAlign = "left"; g.fillText("BARRICATA", 10, H - 16);
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(W - 116, H - 14, 110, 9); g.fillStyle = "#60a5fa"; g.fillRect(W - 114, H - 12, 106 * Math.max(0, st.hero.hp / 100), 5); g.fillStyle = "#fff"; g.textAlign = "right"; g.fillText("ENERGIA", W - 8, H - 16);
    st.fxo && st.fxo.tick(); st.fxo && st.fxo.draw(g); S = sv;
  }
  // ------------------------------------------------------------ interfaccia
  function powers() { return [{ id: "hero", n: "Tu", icon: "⭐", pow: "calcio", get cd() { return S.hero.cd; }, set cd(v) { S.hero.cd = v; }, get x() { return S.hero.x; }, get y() { return S.hero.y; } }].concat(S.mates); }
  function hud() { ui.hud.innerHTML = `<b>Ondata ${Math.min(S.wave + 1, S.waves.length)}/${S.waves.length}</b><span class="bar"><i style="width:${S.bar}%"></i></span><span>Abbattuti ${S.kills}</span>`; }
  function controls() {
    const done = S.phase === "end";
    if (done) { ui.bt.innerHTML = S.practice ? `<button class="go" id="paRe">↺ Riprova</button><button class="go" id="paGo2">▶ Gioca davvero</button>` : `<button class="go" id="paGo" style="flex-basis:100%">Fine ▸</button>`; }
    else if (S.paused) ui.bt.innerHTML = powers().map((m, i) => { const P = POW[m.pow], c = m.cd; return `<button data-p="${i}" ${c ? "disabled" : ""} class="${S.sel === i ? "pw" : ""}">${esc(P.icon)} ${esc(m.n)}<small>${esc(P.n)}${c ? " · " + Math.ceil(c / 60) + "s" : ""}</small></button>`; }).join("") + `<button class="go" id="paRes">▶ Riprendi</button>`;
    else ui.bt.innerHTML = `<button class="go" id="paWh" style="flex-basis:100%">⏸ Ruota dei poteri</button>`;
    ui.bt.querySelectorAll("button[data-p]").forEach((b) => (b.onclick = () => { S.sel = +b.dataset.p; S.log = `${POW[powers()[S.sel].pow].d}. Tocca il bersaglio sul campo.`; controls(); lg(); }));
    const q = (id) => ui.bt.querySelector(id); if (q("#paWh")) q("#paWh").onclick = wheel; if (q("#paRes")) q("#paRes").onclick = () => { S.paused = false; S.sel = null; controls(); }; if (q("#paGo")) q("#paGo").onclick = close; if (q("#paRe")) q("#paRe").onclick = () => restart(true); if (q("#paGo2")) q("#paGo2").onclick = () => restart(false);
  }
  function lg() { ui.lg.innerHTML = S.log || "Tocca un nemico per calciargli un pallone. Tocca il terreno dietro la barricata per spostarti. <b>⏸ Ruota</b>: ferma il tempo e usa i poteri della squadra."; }
  function wheel() { if (S.phase !== "play") return; S.paused = true; S.sel = null; S.log = "Tempo fermo. Scegli chi agisce."; controls(); lg(); }
  function tap(x, y) {
    if (!S || S.phase !== "play") return;
    if (S.paused) { if (S.sel == null) return; const m = powers()[S.sel]; if (m.cd) return; if (usePower(m, x, y)) { S.paused = false; S.sel = null; S.log = ""; controls(); lg(); } else { S.log = "Lì non c'è un bersaglio valido."; lg(); } return; }
    const e = foeAt(x, y, 16);
    if (e) { if (!(S.hero.kc > 0)) { kick(S.hero, e, 1 + (S.bonus >= 3 ? 1 : 0), false); S.hero.kc = 16; } return; }
    S.hero.tx = Math.max(16, Math.min(BARX - 12, x)); S.hero.ty = Math.max(28, Math.min(H - 28, y));
  }
  function end(win) {
    S.phase = "end"; S.paused = false; S.win = !!win; S.log = win ? "Hanno smesso di arrivare. La squadra respira." : S.bar <= 0 ? "La barricata è caduta. Ritirata!" : "Sei a terra. La squadra ti trascina via.";
    S.fxo.banner(win ? "RESISTITO!" : "RITIRATA", win ? "#fde047" : "#f87171"); if (win) S.fxo.burst(W / 2, 100, 40, ["#fde047", "#7dd3fc", "#fff"]); hud(); controls(); lg();
  }
  function close() { cancelAnimationFrame(raf); raf = 0; const st = S, o = st.o; ui.root.remove(); ui = null; S = null; try { window.__sagaCore && window.__sagaCore.endMatch(); } catch (e) {} o.onDone && o.onDone({ a: st.kills, b: st.win ? 0 : 1, win: !!st.win, lost: st.win ? 0 : 1, quit: false }); }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); S.f++; step(); scene(ui.g, S, S.f); if (S.f % 15 === 0) { hud(); if (S.paused) controls(); } }
  function restart(practice) { const o = S.o; S = mk(o, practice); fillQueue(); hud(); controls(); lg(); }
  // ------------------------------------------------------------ spiegazione
  function demo(kind) {
    const st = mk({ mates: [{ id: "d1", n: "Garro", icon: "🎯", pow: "tiro" }, { id: "d2", n: "Mordini", icon: "🫧", pow: "schiuma" }] }, false);
    st.foes = [{ t: "base", x: 220, y: 80, hp: 2, max: 2, sp: 0, r: 7, col: "#1f2937", sh: 0, stun: 0, slow: 0, ally: 0, atk: 0, wob: 0 }, { t: "scudo", x: 260, y: 140, hp: 3, max: 3, sp: 0, r: 8, col: "#334155", sh: 1, stun: 0, slow: 0, ally: 0, atk: 0, wob: 1 }, { t: "grosso", x: 320, y: 110, hp: 6, max: 6, sp: 0, r: 11, col: "#111827", sh: 0, stun: 0, slow: 0, ally: 0, atk: 0, wob: 2 }];
    if (kind === "pause") st.paused = true; if (kind === "zone") st.zones = [{ x: 240, y: 110, r: 42, t: 999, c: "rgba(134,239,172,", k: "schiuma" }];
    return st;
  }
  const PAGES = [
    { t: "Tieni la barricata", p: "I <b>Raccoglitori</b> arrivano da destra a ondate e colpiscono la tua barricata. <b>Tocca un nemico</b> per calciargli un pallone; <b>tocca il terreno</b> dietro la barricata per spostarti. I compagni tirano da soli, ma piano.", draw: (g, f) => { const st = demo(""); st.balls = [{ x: 60 + (f % 60) * 2.6, y: 115 - (f % 60) * 0.5, e: null, col: "#fff" }]; scene(g, st, f); } },
    { t: "La Ruota dei poteri", p: "Premi <b>⏸ Ruota</b>: il tempo si ferma. Scegli un compagno e il suo potere, poi tocca il bersaglio. Ogni potere ha una ricarica. Gli <b>scudi</b> blu si rompono solo con tiri potenti (tuo tiro caricato, tiro di precisione, colpo dall'ombra).", draw: (g, f) => scene(g, demo("pause"), f) },
    { t: "Chi porti conta", p: "Ogni compagno ha un potere diverso: rete, onda d'urto, schiuma che rallenta, drone esca, barricata nuova, perfino riprogrammare un nemico. Scegli la squadra prima della missione. Vinci se resisti a tutte le ondate.", draw: (g, f) => scene(g, demo("zone"), f) }
  ];
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("paOv", "⏸ " + (o.title || "Squadra in Pausa"), "#7dd3fc"); ui.root.style.background = "#060b18";
    S = mk(o, false); fillQueue(); tutC = null; ui.cv.style.height = "auto"; ui.cv.style.flex = "none";
    ui.cv.addEventListener("pointerdown", (ev) => { const r = ui.cv.getBoundingClientRect(); tap((ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * H); });
    const openTut = () => { if (S && S.phase === "play" && !(tutC && tutC.open)) { S.paused = true; tutC = M.tut({ root: ui.root, key: "pausa", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); else { S.paused = false; controls(); } } }); } };
    ui.help.onclick = openTut;
    window.__pausa.state = { get kills() { return S ? S.kills : 0; }, get phase() { return S && S.phase; }, get paused() { return S && S.paused; }, get foes() { return S ? S.foes.length : 0; }, get hero() { return S && { x: S.hero.x, y: S.hero.y, tx: S.hero.tx, ty: S.hero.ty }; }, tut: () => !!(tutC && tutC.open), tap, wheel, power: (i) => { S.sel = i; controls(); }, finish: (win) => { if (tutC) { tutC.close(); tutC = null; } end(win !== false); close(); } };
    hud(); controls(); lg(); loop();
    if (o.tutorial !== false && !M.seen("pausa")) openTut();
    return true;
  }
  window.__pausa = { start, state: null, POW };
})();
