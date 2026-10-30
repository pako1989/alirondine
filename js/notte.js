// js/notte.js - «L'ULTIMA NOTTE»: difesa del villaggio a ondate (Sette per Sasso Nero). Vista dall'alto: quattro porte (N, E, S, O) e il granaio al centro.
// I predoni arrivano dai sentieri, picchiano la porta e, se la porta cade, corrono al granaio. Il Campione corre dove tocchi e calcia la palla da kemari
// al predone più vicino; ogni porta ha le sue costruzioni (palizzata = più resistenza, fossato = rallenta, trappola = colpisce i primi, torretta = frecce)
// e il compagno che la difende (arco, lama, cura, rete, muro, stratega). «Calcio del Vento» (si carica coi colpi) spazza tutto intorno al Campione.
// Opzioni: start({ title, gates: { n|e|s|o: { def, ditch, trap, tower, who: { id, n, pow } } }, waves: [[[tipo, quanti, porta?], …], …], granaio, rain,
//   boss: true (l'ultima ondata ha il capo), tutorial, onDone({ win, a, b, data: { gates, fell, kills, granaio, waves } }) })
// Tipi di predone: base · lesto (a cavallo) · scudo · capo · corvo (il capo dei predoni). Dove manca la porta, arrivano da una porta a caso.
(function () {
  "use strict";
  if (window.__notte) return;
  const M = window.__mini || {}, W = 380, H = 230, SS = 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), now = () => performance.now() / 1000, rnd = Math.random;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const CX = 190, CY = 118;
  const GATES = { n: { x: CX, y: 30, sx: CX, sy: -10, n: "Nord", icon: "⬆️" }, e: { x: 340, y: CY, sx: W + 10, sy: CY, n: "Est", icon: "➡️" }, s: { x: CX, y: 206, sx: CX, sy: H + 10, n: "Sud", icon: "⬇️" }, o: { x: 40, y: CY, sx: -10, sy: CY, n: "Ovest", icon: "⬅️" } };
  const GK = ["n", "e", "s", "o"];
  const FOES = {
    base: { hp: 2, sp: 22, hit: 1, r: 5, col: "#7f1d1d", n: "Predone" },
    lesto: { hp: 2, sp: 42, hit: 1, r: 6, col: "#b45309", n: "Cavaliere" },
    scudo: { hp: 5, sp: 16, hit: 1, r: 6, col: "#334155", n: "Scudo", armor: 1 },
    capo: { hp: 12, sp: 15, hit: 3, r: 8, col: "#1c1917", n: "Capobanda" },
    corvo: { hp: 32, sp: 17, hit: 4, r: 10, col: "#991b1b", n: "Corvo Rosso", boss: 1 }
  };
  const POW = {
    arco: { n: "Arco", d: "Frecce lontane, una al secondo" }, lama: { n: "Lama", d: "Colpi forti a chi arriva sotto la porta" }, cura: { n: "Cura", d: "Ripara la porta piano piano" },
    rete: { n: "Rete", d: "Rallenta i predoni vicini alla porta" }, muro: { n: "Muro", d: "La porta prende metà dei colpi" }, stratega: { n: "Stratega", d: "Il Calcio del Vento si carica il doppio" }
  };
  let S = null, ui = null, raf = 0, tutC = null, lastT = 0;
  function diffK() { try { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; } catch (e) { return 1; } }
  function mk(o, practice) {
    const k = diffK(), gs = {};
    GK.forEach((g) => { const c = (o.gates || {})[g] || {}; const max = 10 + 6 * (c.def | 0); gs[g] = { k: g, max, hp: max, ditch: !!c.ditch, trap: (c.trap | 0) * 2, tower: !!c.tower, who: c.who || null, cd: 0, fell: false, heal: 0 }; });
    const waves = practice ? [[["base", 4], ["lesto", 2]]] : (o.waves && o.waves.length ? o.waves : [[["base", 6]], [["base", 5], ["lesto", 3]], [["scudo", 3], ["base", 4], ["capo", 1]]]);
    const strat = GK.some((g) => gs[g].who && gs[g].who.pow === "stratega");
    return { o, k, practice: !!practice, gates: gs, waves, wave: -1, queue: [], spawnT: 0, pause: 2.2, foes: [], balls: [], arrows: [], fx: [], txt: [],
      hero: { x: CX, y: CY + 22, tx: CX, ty: CY + 22, cd: 0, face: 1 }, wind: 0, windMax: 12, strat, kills: 0, granaio: o.granaio || 20, granaioMax: o.granaio || 20,
      t: 0, f: 0, phase: "play", win: false, ended: false, rain: !!o.rain, banner: null };
  }
  function nextWave() {
    S.wave++; if (S.wave >= S.waves.length) return end(true);
    const q = []; S.waves[S.wave].forEach(([tp, n, g]) => { for (let i = 0; i < (n | 0); i++) q.push({ tp, g: g || null }); });
    for (let i = q.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [q[i], q[j]] = [q[j], q[i]]; } // l'ordine cambia a ogni notte
    const boss = q.findIndex((x) => x.tp === "corvo"); if (boss >= 0) q.push(q.splice(boss, 1)[0]);
    S.queue = q; S.spawnT = 0.4; S.banner = { t: S.wave === S.waves.length - 1 && S.waves.length > 1 ? "ULTIMA ONDATA" : `ONDATA ${S.wave + 1}`, a: 90 };
  }
  function spawn(it) {
    const F0 = FOES[it.tp] || FOES.base, g = it.g && GATES[it.g] ? it.g : GK[Math.floor(rnd() * 4)], G = GATES[g];
    const side = (rnd() - 0.5) * 50, vert = g === "n" || g === "s";
    const hp = Math.ceil(F0.hp * (S.k > 1.05 ? 1.25 : S.k < 0.95 ? 0.8 : 1));
    S.foes.push({ tp: it.tp, g, x: G.sx + (vert ? side : 0), y: G.sy + (vert ? 0 : side), hp, max: hp, sp: F0.sp * (0.9 + rnd() * 0.2) * S.k, st: "walk", cd: 0, slow: 0, hitT: 0, trapped: false, F: F0 });
  }
  const gateFor = (f) => S.gates[f.g], G2 = (g) => GATES[g];
  function hurt(f, d, from) {
    if (f.hp <= 0) return; const a = f.F.armor && from === "arrow" ? 0.5 : 1; f.hp -= d * a; f.hitT = 8;
    if (f.hp <= 0) { S.kills++; S.wind = Math.min(S.windMax, S.wind + (S.strat ? 2 : 1)); burst(f.x, f.y, f.F.boss ? 18 : 7, f.F.boss ? "#fbbf24" : "#fca5a5"); if (f.F.boss) say("CORVO ROSSO CADE!", "#fde047"); }
  }
  function burst(x, y, n, c) { for (let i = 0; i < n; i++) { const a = rnd() * 7, v = 0.6 + rnd() * 1.6; S.fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, a: 22 + rnd() * 10, c }); } }
  function say(t, c) { S.txt.push({ t, c: c || "#fff", y: 70, a: 60 }); }
  function wind() {
    if (!S || S.phase !== "play" || S.wind < S.windMax) return false;
    S.wind = 0; const h = S.hero; burst(h.x, h.y, 26, "#e0f2fe"); S.fx.push({ ring: 1, x: h.x, y: h.y, r: 6, a: 24 });
    S.foes.forEach((f) => { const d = Math.hypot(f.x - h.x, f.y - h.y); if (d < 78) { hurt(f, 3, "wind"); const k = 22 / Math.max(10, d); f.x += (f.x - h.x) * k * 0.4; f.y += (f.y - h.y) * k * 0.4; } });
    say("CALCIO DEL VENTO!", "#bae6fd"); controls(); return true;
  }
  function tapTo(x, y) { if (!S || S.phase !== "play") return; S.hero.tx = clamp(x, 8, W - 8); S.hero.ty = clamp(y, 8, H - 8); }
  function step(dt) {
    if (!S || S.ended) return;
    S.t += dt; S.f++;
    if (S.pause > 0) { S.pause -= dt; if (S.pause <= 0) nextWave(); }
    else if (S.queue.length) { S.spawnT -= dt; if (S.spawnT <= 0) { spawn(S.queue.shift()); S.spawnT = Math.max(0.5, 1.6 - S.wave * 0.18) * (0.7 + rnd() * 0.6); } }
    else if (!S.foes.length && S.phase === "play") { if (S.wave >= S.waves.length - 1) return end(true); S.pause = 3; GK.forEach((g) => { const G = S.gates[g]; if (!G.fell) G.hp = Math.min(G.max, G.hp + 2); }); say("Respiro… le porte si rinforzano", "#bbf7d0"); }
    // il Campione corre e calcia
    const h = S.hero, dx = h.tx - h.x, dy = h.ty - h.y, dd = Math.hypot(dx, dy), sp = 95 * dt;
    if (dd > 1) { h.x += (dx / dd) * Math.min(sp, dd); h.y += (dy / dd) * Math.min(sp, dd); h.face = dx < 0 ? -1 : 1; }
    h.cd -= dt;
    if (h.cd <= 0) { let best = null, bd = 74; S.foes.forEach((f) => { const d = Math.hypot(f.x - h.x, f.y - h.y); if (f.hp > 0 && d < bd) { bd = d; best = f; } }); if (best) { S.balls.push({ x: h.x, y: h.y - 4, tg: best, t: 0 }); h.cd = 0.62; } }
    S.balls.forEach((b) => { const f = b.tg; b.t += dt; if (!f || f.hp <= 0) { b.dead = true; return; } const ex = f.x - b.x, ey = f.y - b.y, e = Math.hypot(ex, ey); if (e < 6) { hurt(f, 1, "ball"); b.dead = true; burst(f.x, f.y, 4, "#fef3c7"); return; } const v = 260 * dt; b.x += (ex / e) * v; b.y += (ey / e) * v; if (b.t > 1) b.dead = true; });
    S.balls = S.balls.filter((b) => !b.dead);
    // le porte: torretta e compagni
    GK.forEach((g) => {
      const G = S.gates[g], P = G2(g); G.cd -= dt; G.heal -= dt;
      const near = (r) => S.foes.filter((f) => f.hp > 0 && Math.hypot(f.x - P.x, f.y - P.y) < r);
      if (G.tower && G.cd <= 0) { const t = near(95)[0]; if (t) { S.arrows.push({ x: P.x, y: P.y, tg: t, d: 1 }); G.cd = 1.3; } }
      const w = G.who && !G.fell ? G.who.pow : null;
      if (w === "arco") { if ((G.acd = (G.acd || 0) - dt) <= 0) { const t = near(115)[0]; if (t) { S.arrows.push({ x: P.x, y: P.y, tg: t, d: 1 }); G.acd = 0.95; } } }
      if (w === "lama") { if ((G.acd = (G.acd || 0) - dt) <= 0) { const t = near(30)[0]; if (t) { hurt(t, 2, "lama"); burst(t.x, t.y, 5, "#e5e7eb"); G.acd = 0.8; } } }
      if (w === "cura" && G.heal <= 0) { G.hp = Math.min(G.max, G.hp + 1); G.heal = 2.2; }
      if (w === "rete") near(40).forEach((f) => { f.slow = 0.3; });
    });
    S.arrows.forEach((a) => { const f = a.tg; if (!f || f.hp <= 0) { a.dead = true; return; } const ex = f.x - a.x, ey = f.y - a.y, e = Math.hypot(ex, ey); if (e < 5) { hurt(f, a.d, "arrow"); a.dead = true; return; } const v = 230 * dt; a.x += (ex / e) * v; a.y += (ey / e) * v; });
    S.arrows = S.arrows.filter((a) => !a.dead);
    // i predoni
    S.foes.forEach((f) => {
      if (f.hp <= 0) return; f.hitT = Math.max(0, f.hitT - 1); f.cd -= dt; const G = gateFor(f), P = G2(f.g);
      let tx, ty; if (f.st === "walk") { tx = P.x; ty = P.y; } else { tx = CX; ty = CY; }
      const ex = tx - f.x, ey = ty - f.y, e = Math.hypot(ex, ey);
      let v = f.sp * dt * (f.slow > 0 ? 0.45 : 1); f.slow = Math.max(0, f.slow - dt);
      if (G.ditch && f.st === "walk" && e < 46) v *= 0.55;
      if (G.trap > 0 && !f.trapped && f.st === "walk" && e < 54) { f.trapped = true; G.trap--; hurt(f, 2, "trap"); burst(f.x, f.y, 8, "#a16207"); }
      if (f.st === "walk") {
        if (e > 10) { f.x += (ex / e) * v; f.y += (ey / e) * v; }
        else if (G.fell) f.st = "in";
        else if (f.cd <= 0) { const dmg = f.F.hit * (G.who && G.who.pow === "muro" && !G.fell ? 0.5 : 1); G.hp -= dmg; f.cd = 1.1; S.fx.push({ x: P.x + (rnd() - 0.5) * 10, y: P.y + (rnd() - 0.5) * 10, vx: 0, vy: -0.4, a: 14, c: "#fde68a" }); if (G.hp <= 0 && !G.fell) { G.hp = 0; G.fell = true; say(`La porta ${P.n} cede!`, "#fca5a5"); burst(P.x, P.y, 16, "#a16207"); } }
      } else {
        if (e > 14) { f.x += (ex / e) * v; f.y += (ey / e) * v; }
        else if (f.cd <= 0) { S.granaio -= f.F.hit; f.cd = 1.2; burst(CX, CY, 4, "#facc15"); if (S.granaio <= 0) { S.granaio = 0; end(false); } }
      }
    });
    S.foes = S.foes.filter((f) => f.hp > 0);
    S.fx.forEach((p) => { if (p.ring) { p.r += 4; p.a--; return; } p.x += p.vx; p.y += p.vy; p.a--; }); S.fx = S.fx.filter((p) => p.a > 0);
    S.txt.forEach((x) => { x.y -= 0.35; x.a--; }); S.txt = S.txt.filter((x) => x.a > 0);
    if (S.banner) { S.banner.a--; if (S.banner.a <= 0) S.banner = null; }
    if (S.f % 6 === 0) controls(true);
  }
  function end(win) {
    if (!S || S.ended) return; S.ended = true; S.phase = "end"; S.win = S.practice ? true : !!win; hud(); controls(); lg();
  }
  // ------------------------------------------------------------ disegno
  function man(g, x, y, col, s, face, f, hat) {
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(x, y + 5 * s, 5 * s, 1.8 * s, 0, 0, 7); g.fill();
    const b = Math.sin(f / 4 + x) * 0.8; g.fillStyle = col; g.fillRect(x - 3 * s, y - 4 * s + b, 6 * s, 8 * s); g.fillStyle = "#e8c4a0"; g.beginPath(); g.arc(x, y - 6 * s + b, 2.6 * s, 0, 7); g.fill();
    if (hat) { g.fillStyle = hat; g.beginPath(); g.moveTo(x - 5 * s, y - 6.5 * s + b); g.lineTo(x, y - 10 * s + b); g.lineTo(x + 5 * s, y - 6.5 * s + b); g.fill(); }
  }
  function village(g, st, f) {
    // terra battuta, risaie, sentieri verso le porte
    g.fillStyle = "#1a2a1c"; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) { const rx = [8, 262, 8, 262][i], ry = [8, 8, 150, 150][i]; g.fillStyle = "#1f3b3a"; g.fillRect(rx, ry, 110, 72); for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(147,197,253,${0.08 + 0.05 * Math.sin(f / 30 + k + i)})`; g.fillRect(rx + 4, ry + 6 + k * 11, 102, 2); } for (let k = 0; k < 40; k++) { g.fillStyle = "#3f6b2a"; g.fillRect(rx + 6 + (k * 23) % 98, ry + 4 + ((k * 7) % 6) * 11, 1, 4); } }
    g.fillStyle = "#4a3a28"; g.fillRect(CX - 10, 0, 20, H); g.fillRect(0, CY - 10, W, 20);
    // palizzata del villaggio (anello) con le porte
    g.strokeStyle = "#6b4423"; g.lineWidth = 5; g.strokeRect(40, 30, W - 80, H - 60 - 4 + 0); g.strokeStyle = "#8b5a2b"; g.lineWidth = 1; for (let x = 44; x < W - 40; x += 6) { g.beginPath(); g.moveTo(x, 27); g.lineTo(x, 33); g.moveTo(x, 203); g.lineTo(x, 209); g.stroke(); }
    // case col tetto di paglia
    [[90, 70], [130, 60], [250, 66], [290, 78], [86, 160], [130, 170], [252, 168], [292, 156]].forEach(([x, y], i) => { g.fillStyle = "#5b4636"; g.fillRect(x - 12, y - 6, 24, 14); g.fillStyle = "#a16207"; g.beginPath(); g.moveTo(x - 16, y - 4); g.lineTo(x, y - 16); g.lineTo(x + 16, y - 4); g.fill(); g.fillStyle = `rgba(253,186,116,${0.35 + 0.25 * Math.sin(f / 9 + i)})`; g.fillRect(x - 3, y, 5, 4); });
    // il granaio al centro
    const gp = st.granaio / st.granaioMax; g.fillStyle = "#3b2414"; g.fillRect(CX - 18, CY - 12, 36, 24); g.fillStyle = "#854d0e"; g.beginPath(); g.moveTo(CX - 23, CY - 10); g.lineTo(CX, CY - 26); g.lineTo(CX + 23, CY - 10); g.fill();
    g.fillStyle = "#facc15"; g.font = "8px serif"; g.textAlign = "center"; g.fillText("🌾", CX, CY + 4);
    g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(CX - 20, CY + 15, 40, 4); g.fillStyle = gp > 0.5 ? "#facc15" : gp > 0.25 ? "#fb923c" : "#ef4444"; g.fillRect(CX - 20, CY + 15, 40 * gp, 4);
    // le porte: legno, costruzioni, compagno, fiaccole
    GK.forEach((k) => {
      const G = st.gates[k], P = GATES[k], vert = k === "n" || k === "s", hp = G.max ? G.hp / G.max : 0;
      if (G.ditch) { g.fillStyle = "rgba(30,64,175,.55)"; if (vert) g.fillRect(P.x - 26, P.y + (k === "n" ? -20 : 12), 52, 6); else g.fillRect(P.x + (k === "o" ? -20 : 14), P.y - 26, 6, 52); }
      if (G.trap > 0) for (let i = 0; i < Math.min(4, G.trap); i++) { const ox = vert ? -12 + i * 8 : (k === "o" ? -34 : 30), oy = vert ? (k === "n" ? -32 : 30) : -12 + i * 8; g.fillStyle = "#a16207"; g.fillRect(P.x + ox - 2, P.y + oy - 2, 4, 4); g.fillStyle = "#e5e7eb"; g.fillRect(P.x + ox - 1, P.y + oy - 3, 1, 2); g.fillRect(P.x + ox + 1, P.y + oy - 3, 1, 2); }
      if (G.fell) { g.fillStyle = "#3f2a1a"; g.fillRect(P.x - 9, P.y - 3, 7, 6); g.fillRect(P.x + 3, P.y - 2, 6, 5); }
      else { g.fillStyle = hp > 0.5 ? "#8b5a2b" : hp > 0.25 ? "#a16207" : "#b91c1c"; if (vert) g.fillRect(P.x - 12, P.y - 4, 24, 8); else g.fillRect(P.x - 4, P.y - 12, 8, 24); g.strokeStyle = "#3f2a1a"; g.lineWidth = 1; g.strokeRect(vert ? P.x - 12 : P.x - 4, vert ? P.y - 4 : P.y - 12, vert ? 24 : 8, vert ? 8 : 24); }
      if (G.tower) { const tx = P.x + (vert ? 20 : 0), ty = P.y + (vert ? 0 : 20); g.fillStyle = "#5b3a22"; g.fillRect(tx - 4, ty - 10, 8, 14); g.fillStyle = "#a16207"; g.fillRect(tx - 6, ty - 12, 12, 3); }
      [[-16, -6], [16, -6]].forEach(([ox, oy], i) => { const x = P.x + (vert ? ox : oy), y = P.y + (vert ? oy : ox); g.fillStyle = `rgba(253,186,116,${0.12 + 0.06 * Math.sin(f / 5 + i + k.charCodeAt(0))})`; g.beginPath(); g.arc(x, y, 14, 0, 7); g.fill(); g.fillStyle = "#fb923c"; g.fillRect(x - 1, y - 3 + Math.sin(f / 3 + i) * 0.6, 2, 3); });
      if (G.who && !G.fell) { const wx = P.x + (vert ? -26 : (k === "o" ? 12 : -12)), wy = P.y + (vert ? (k === "n" ? 12 : -12) : -24); if (M.man && G.who.img) M.man(g, wx, wy + 6, { col: "#1e3a8a", ring: "#e5e7eb", img: G.who.img, s: 0.5 }); else man(g, wx, wy, "#1e3a8a", 0.9, 1, f, "#e5e7eb"); g.font = "700 6px system-ui"; g.fillStyle = "#e2e8f0"; g.textAlign = "center"; g.fillText(G.who.n, wx, wy - 12); }
      g.fillStyle = "rgba(0,0,0,.6)"; const bx = P.x - 14, by = P.y + (k === "s" ? -16 : 10) + (vert ? 0 : 6); g.fillRect(bx, by, 28, 3); g.fillStyle = G.fell ? "#57534e" : hp > 0.5 ? "#22c55e" : hp > 0.25 ? "#facc15" : "#ef4444"; g.fillRect(bx, by, 28 * hp, 3);
    });
  }
  function scene(g, st, f) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); village(g, st, f);
    st.foes.forEach((e) => { man(g, e.x, e.y, e.hitT ? "#fecaca" : e.F.col, e.F.boss ? 1.6 : e.tp === "capo" ? 1.3 : 1, 1, f, e.F.boss ? "#dc2626" : null); if (e.tp === "lesto") { g.fillStyle = "#57534e"; g.fillRect(e.x - 6, e.y + 2, 12, 4); } if (e.tp === "scudo") { g.fillStyle = "#94a3b8"; g.fillRect(e.x - 6, e.y - 4, 3, 8); } if (e.max > 2) { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(e.x - 8, e.y - 14 * (e.F.boss ? 1.4 : 1), 16, 2); g.fillStyle = "#ef4444"; g.fillRect(e.x - 8, e.y - 14 * (e.F.boss ? 1.4 : 1), 16 * (e.hp / e.max), 2); } });
    const h = st.hero; g.strokeStyle = "rgba(186,230,253,.18)"; g.lineWidth = 1; g.beginPath(); g.arc(h.x, h.y, 74, 0, 7); g.stroke();
    man(g, h.x, h.y, "#b91c1c", 1.15, h.face, f, "#facc15"); if (Math.hypot(h.tx - h.x, h.ty - h.y) > 3) { g.strokeStyle = "rgba(250,204,21,.6)"; g.beginPath(); g.arc(h.tx, h.ty, 4, 0, 7); g.stroke(); }
    st.balls.forEach((b) => { g.fillStyle = "#fef3c7"; g.beginPath(); g.arc(b.x, b.y, 2.4, 0, 7); g.fill(); g.strokeStyle = "#92400e"; g.lineWidth = 0.6; g.stroke(); });
    st.arrows.forEach((a) => { g.strokeStyle = "#e5e7eb"; g.lineWidth = 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(a.x - 4, a.y - 2); g.stroke(); });
    st.fx.forEach((p) => { if (p.ring) { g.strokeStyle = `rgba(224,242,254,${p.a / 24})`; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.stroke(); return; } g.globalAlpha = Math.min(1, p.a / 14); g.fillStyle = p.c; g.fillRect(p.x, p.y, 2, 2); g.globalAlpha = 1; });
    // la notte: buio intorno e pioggia
    const gr = g.createRadialGradient(CX, CY, 40, CX, CY, 240); gr.addColorStop(0, "rgba(5,10,30,0)"); gr.addColorStop(1, "rgba(5,10,30,.55)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (st.rain) { g.strokeStyle = "rgba(186,230,253,.25)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 60; i++) { const x = (i * 37 + f * 3) % W, y = (i * 53 + f * 7) % H; g.moveTo(x, y); g.lineTo(x - 2, y + 6); } g.stroke(); }
    st.txt.forEach((x) => { g.globalAlpha = Math.min(1, x.a / 20); g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillStyle = x.c; g.fillText(x.t, CX, x.y); g.globalAlpha = 1; });
    if (st.banner) { g.globalAlpha = Math.min(1, st.banner.a / 25); g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 96, W, 30); g.font = "900 18px system-ui"; g.textAlign = "center"; g.fillStyle = "#fde68a"; g.fillText(st.banner.t, CX, 117); g.globalAlpha = 1; }
    if (st.phase === "end") { g.fillStyle = "rgba(2,6,23,.75)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 22px system-ui"; g.fillStyle = st.win ? "#fde047" : "#fca5a5"; g.fillText(st.practice ? "PROVA FINITA" : st.win ? "L'ALBA!" : "IL GRANAIO BRUCIA…", W / 2, 84); g.font = "800 12px system-ui"; g.fillStyle = "#fff"; const fell = GK.filter((k) => st.gates[k].fell).map((k) => GATES[k].n); g.fillText(`Predoni respinti ${st.kills} · granaio ${Math.round(100 * st.granaio / st.granaioMax)}%`, W / 2, 110); g.fillText(fell.length ? "Porte cadute: " + fell.join(", ") : "Nessuna porta è caduta", W / 2, 128); }
  }
  // ------------------------------------------------------------ interfaccia
  function hud() {
    if (!ui || !S) return; const left = S.queue.length + S.foes.length;
    ui.hud.innerHTML = `<b>Ondata ${Math.max(1, S.wave + 1)}/${S.waves.length}</b><span>Predoni ${left}</span><span>🌾 Granaio ${Math.round(100 * S.granaio / S.granaioMax)}%</span><span>Respinti ${S.kills}</span>`;
  }
  let lastBt = "";
  function controls(soft) {
    if (!ui || !S) return;
    if (S.phase === "end") { if (soft) return; ui.bt.innerHTML = S.practice ? `<button class="go" id="ntRe">↺ Riprova</button><button class="go" id="ntGo2">▶ Difendi davvero</button>` : `<button class="go" id="ntGo" style="flex-basis:100%">Fine ▸</button>`; lastBt = ""; const q = (id) => ui.bt.querySelector(id); if (q("#ntGo")) q("#ntGo").onclick = close; if (q("#ntRe")) q("#ntRe").onclick = () => restart(true); if (q("#ntGo2")) q("#ntGo2").onclick = () => restart(false); return; }
    const full = S.wind >= S.windMax, key = (full ? 1 : 0) + ":" + Math.floor(S.wind) + GK.map((k) => (S.gates[k].fell ? 1 : 0)).join("");
    if (soft && key === lastBt) return; lastBt = key;
    ui.bt.innerHTML = GK.map((k) => `<button data-g="${k}" style="${S.gates[k].fell ? "opacity:.55" : ""}">${GATES[k].icon}<small>${GATES[k].n}</small></button>`).join("") + `<button data-w="1" style="flex-basis:100%;min-height:46px;border-color:${full ? "#bae6fd" : "#475569"};${full ? "background:#0c4a6e" : ""}">🌀 Calcio del Vento<small>${full ? "pronto: spazza i predoni intorno a te" : `si carica coi colpi · ${Math.floor(S.wind)}/${S.windMax}`}</small></button>`;
    ui.bt.querySelectorAll("button[data-g]").forEach((b) => b.addEventListener("pointerdown", (ev) => { ev.preventDefault(); const P = GATES[b.dataset.g]; tapTo(P.x + (P.x < CX ? 14 : P.x > CX ? -14 : 0), P.y + (P.y < CY ? 14 : P.y > CY ? -14 : 0)); }));
    const bw = ui.bt.querySelector("button[data-w]"); if (bw) bw.addEventListener("pointerdown", (ev) => { ev.preventDefault(); wind(); });
  }
  function lg() {
    if (!ui || !S) return;
    ui.lg.innerHTML = S.phase === "end" ? (S.practice ? "Prova finita: nulla conta." : S.win ? "L'ultima ondata si ritira nel buio. Il villaggio respira." : "I predoni sono arrivati al granaio. Si può riprovare.")
      : "Tocca la mappa (o una porta) per correre: il Campione calcia da solo al predone più vicino (cerchio azzurro). Le porte reggono con le costruzioni e con chi le difende. Se una porta cade, i predoni corrono al <b>granaio 🌾</b>.";
  }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); const n = now(), dt = clamp(n - lastT, 0, 0.05); lastT = n; if (!(tutC && tutC.open)) step(dt); if (ui) scene(ui.g, S, S.f); if (S && S.f % 10 === 0) hud(); }
  function restart(practice) { const o = S.o; S = mk(o, practice); lastT = now(); hud(); controls(); lg(); }
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S, o = st.o; ui.root.remove(); ui = null; S = null;
    try { window.__sagaCore && window.__sagaCore.endMatch(); } catch (e) {}
    const gates = {}; GK.forEach((k) => { gates[k] = Math.round(100 * st.gates[k].hp / st.gates[k].max); });
    const fell = GK.filter((k) => st.gates[k].fell), gp = Math.round(100 * st.granaio / st.granaioMax);
    o.onDone && o.onDone({ win: !!st.win, a: gp, b: 1, quit: false, data: { gates, fell, kills: st.kills, granaio: gp, waves: st.waves.length } });
  }
  // ------------------------------------------------------------ spiegazione
  function demo(f, k) {
    const st = mk({ gates: { n: { def: 1, tower: true, who: { n: "Kiku", pow: "arco" } }, e: { ditch: true, trap: 1 }, s: { def: 2, who: { n: "Okuma", pow: "muro" } }, o: {} } }, false);
    st.wave = 0; st.pause = 0; const t = (f % 240) / 240;
    st.foes = [{ tp: "base", g: "e", x: 360 - t * 40, y: CY + 6, hp: 2, max: 2, st: "walk", F: FOES.base, hitT: 0 }, { tp: "lesto", g: "n", x: CX - 8, y: 4 + t * 20, hp: 2, max: 2, st: "walk", F: FOES.lesto, hitT: 0 }, { tp: "capo", g: "o", x: 10 + t * 20, y: CY - 4, hp: 9, max: 12, st: "walk", F: FOES.capo, hitT: 0 }];
    st.hero.x = k === 1 ? 70 + Math.sin(f / 30) * 10 : CX + 40; st.hero.y = k === 1 ? CY + Math.cos(f / 30) * 8 : CY + 30; st.hero.tx = st.hero.x; st.hero.ty = st.hero.y;
    if (k === 2) { st.gates.o.fell = true; st.gates.o.hp = 0; st.foes[2].st = "in"; st.foes[2].x = 70 + t * 80; st.wind = st.windMax; }
    if (f % 30 < 15) st.balls.push({ x: st.hero.x + 10, y: st.hero.y - 6, tg: st.foes[0], t: 0 }); return st;
  }
  const PAGES = [
    { t: "Corri e calcia", p: "Sei il Campione: <b>tocca la mappa</b> (o una porta in basso) e corri lì. Calci da solo la palla da kemari al predone più vicino, dentro il cerchio azzurro.", draw: (g, f) => scene(g, demo(f, 1), f) },
    { t: "Le porte", p: "Quattro porte, ognuna con quello che hai costruito: <b>palizzata</b> (regge di più), <b>fossato</b> (rallenta), <b>trappole</b> (colpiscono i primi), <b>torretta</b> (frecce). E con chi la difende: ognuno ha il suo modo.", draw: (g, f) => scene(g, demo(f, 0), f) },
    { t: "Il granaio", p: "Se una porta cade, i predoni corrono al <b>granaio 🌾</b> in mezzo al villaggio: se si svuota, la notte è persa. Il <b>🌀 Calcio del Vento</b> si carica coi colpi e spazza tutto intorno a te.", draw: (g, f) => scene(g, demo(f, 2), f) }
  ];
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("ntOv", "🏯 " + (o.title || "L'Ultima Notte"), "#fca5a5"); ui.root.style.background = "#0a0f1c";
    if (o.gates) GK.forEach((k) => { const w = o.gates[k] && o.gates[k].who; if (w && w.id && M.img && !w.img) w.img = M.img(w.id); });
    S = mk(o, false); tutC = null; lastT = now(); ui.cv.style.height = "auto"; ui.cv.style.flex = "none";
    ui.cv.addEventListener("pointerdown", (ev) => { ev.preventDefault(); const r = ui.cv.getBoundingClientRect(); tapTo((ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * H); });
    const openTut = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) { tutC = M.tut({ root: ui.root, key: "notte", pages: PAGES, onClose: (pr) => { tutC = null; restart(!!pr); } }); } };
    ui.help.onclick = openTut;
    window.__notte.state = {
      get phase() { return S && S.phase; }, get wave() { return S ? S.wave : -1; }, get foes() { return S ? S.foes.length + S.queue.length : 0; }, get kills() { return S ? S.kills : 0; },
      get granaio() { return S ? S.granaio : 0; }, get wind() { return S ? S.wind : 0; }, gates: () => (S ? GK.map((k) => [k, S.gates[k].hp, S.gates[k].max, S.gates[k].fell, S.gates[k].who && S.gates[k].who.pow]) : []),
      tut: () => !!(tutC && tutC.open), tapTo, wind, hero: () => (S ? [S.hero.x, S.hero.y] : null),
      tick: (sec) => { if (!S) return; let k = Math.round((sec || 0) / 0.016); while (k-- > 0 && S && !S.ended) step(0.016); },
      finish: (win) => { if (tutC) { tutC = null; const el = ui && ui.root.querySelector(".tut"); if (el) el.remove(); ui && ui.root.classList.remove("tutOn"); } end(!!win); }
    };
    hud(); controls(); lg(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("notte"))) openTut();
    return true;
  }
  window.__notte = { start, FOES, GATES, POW, state: null };
})();
