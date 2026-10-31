// js/assedio.js - «L'ASSEDIO A ONDATE»: motore d'azione di «La Notte dei Tifosi Morti» (stile survivors). Vista dall'alto, un'arena più grande dello schermo
// che scorre col Campione. Ti muovi trascinando il dito (joystick dove tocchi) o con le frecce/WASD; il Campione calcia da solo al tifoso più vicino.
// I tifosi respinti lasciano gettoni: a ogni livello il gioco si ferma e scegli 1 potere su 3 (tiro a effetto che rimbalza, sciarpa che gira, fischietto…).
// Allo scadere del tempo arriva il capo (tamburo, megafono, capo ultras, mascotte): respingilo e la notte è tua. Se l'energia finisce, si riprova.
// Diversa da: L'Ultima Notte (difesa statica delle porte e del granaio, niente livelli), Arena dei Sogni (a turni), Dungeon (stanze a turni).
// Opzioni: start({ title, arena: "campo"|"tribuna"|"curva"|"parcheggio"|"arena", time: secondi, mix: ["tifoso", …], boss: "tamburo"|"megafono"|"ringhio"|"mascotte"|null,
//   perks: { id: livello } (poteri di partenza, dal Bivio dei Poteri del core), allies: [{ id, n, pow }], hp, endless, bestKey, tutorial, rate, onDone({ win, a, b, data }) })
// Poteri dei compagni (pow): bomber · cura · flash · scopa · benedizione · coro · muro.
(function () {
  "use strict";
  if (window.__assedio) return;
  const M = window.__mini || {}, W = 380, H = 230, SS = 2, WW = 760, WH = 520;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), now = () => performance.now() / 1000, rnd = Math.random, hyp = Math.hypot;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const FOES = {
    tifoso: { hp: 2, sp: 26, dmg: 1, r: 6, xp: 1, n: "Tifoso", sh: "#6d28d9", sc: "#facc15" },
    corridore: { hp: 1.5, sp: 46, dmg: 1, r: 5, xp: 1, n: "Corridore", sh: "#7c3aed", sc: "#fde047" },
    panzone: { hp: 9, sp: 15, dmg: 2, r: 9, xp: 4, n: "Panzone", sh: "#4c1d95", sc: "#eab308" },
    tamburino: { hp: 4, sp: 20, dmg: 1, r: 7, xp: 2, n: "Tamburino", sh: "#581c87", sc: "#facc15", aura: 1 },
    lanciatore: { hp: 3, sp: 24, dmg: 1, r: 6, xp: 2, n: "Lanciarotoli", sh: "#6b21a8", sc: "#f8fafc", far: 1 },
    tamburo: { hp: 60, sp: 17, dmg: 2, r: 14, xp: 20, n: "Il Gran Tamburo", sh: "#3b0764", sc: "#facc15", boss: "tamburo" },
    megafono: { hp: 80, sp: 19, dmg: 2, r: 13, xp: 24, n: "Il Megafono", sh: "#3b0764", sc: "#f472b6", boss: "megafono" },
    ringhio: { hp: 110, sp: 22, dmg: 3, r: 14, xp: 30, n: "Ringhio, capo ultras", sh: "#1e1b4b", sc: "#facc15", boss: "ringhio" },
    mascotte: { hp: 150, sp: 16, dmg: 3, r: 18, xp: 40, n: "Valtortino, la mascotte", sh: "#a16207", sc: "#7c3aed", boss: "mascotte" }
  };
  const PERKS = {
    potenza: { n: "Tiro potente", icon: "💥", d: "Ogni pallone fa più male.", max: 5 },
    raffica: { n: "Raffica", icon: "⏩", d: "Calci più spesso.", max: 5 },
    rimbalzo: { n: "Tiro a effetto", icon: "↪️", d: "Il pallone rimbalza su un altro tifoso.", max: 4 },
    doppietta: { n: "Doppietta", icon: "⚽", d: "Un pallone in più a ogni calcio.", max: 4 },
    sciarpa: { n: "Sciarpa rotante", icon: "🧣", d: "Una sciarpa ti gira intorno e respinge chi tocca.", max: 4 },
    fischietto: { n: "Fischietto", icon: "📣", d: "Ogni tanto un fischio stordisce chi è vicino.", max: 4 },
    rovesciata: { n: "Rovesciata", icon: "🤸", d: "Calci anche alle spalle, e il pallone passa attraverso.", max: 4 },
    scarpini: { n: "Scarpini nuovi", icon: "👟", d: "Corri più veloce.", max: 4 },
    calamita: { n: "Tasche larghe", icon: "🧲", d: "Raccogli i gettoni da più lontano.", max: 4 },
    borraccia: { n: "Borraccia", icon: "🧃", d: "Più energia, e ti rimette in forze.", max: 4 },
    parastinchi: { n: "Parastinchi", icon: "🛡️", d: "I morsi fanno meno male.", max: 3 },
    coro: { n: "Coro di casa", icon: "🎶", d: "Canti forte: i tifosi vicini rallentano.", max: 3 }
  };
  const POW = {
    bomber: { n: "Cannonata", d: "un tiro che passa attraverso tutti" }, cura: { n: "Cura", d: "ti rimette un po' di energia" }, flash: { n: "Flash", d: "acceca chi è sullo schermo" },
    scopa: { n: "Scopa", d: "spazza chi gli sta intorno" }, benedizione: { n: "Acqua santa", d: "un anello che rallenta" }, coro: { n: "Coro", d: "i tifosi vicini a lui rallentano" }, muro: { n: "Muro", d: "respinge chi lo tocca" }
  };
  // arene: colori del fondo, ostacoli (rettangoli nel mondo), luci
  const ARENAS = {
    campo: { n: "Il campo", obs: [[30, 236, 14, 48], [716, 236, 14, 48]], lights: [[40, 40], [720, 40], [40, 480], [720, 480]] },
    tribuna: { n: "La tribuna", obs: [[150, 120, 16, 16], [300, 120, 16, 16], [450, 120, 16, 16], [600, 120, 16, 16], [150, 380, 16, 16], [300, 380, 16, 16], [450, 380, 16, 16], [600, 380, 16, 16], [330, 236, 100, 40]], lights: [[120, 60], [380, 60], [640, 60]] },
    curva: { n: "La curva", obs: [[90, 150, 220, 8], [450, 150, 220, 8], [90, 300, 220, 8], [450, 300, 220, 8], [360, 420, 40, 40]], lights: [[60, 40], [700, 40], [380, 30]] },
    parcheggio: { n: "Il parcheggio", obs: [[110, 90, 44, 22], [250, 90, 44, 22], [470, 90, 44, 22], [610, 90, 44, 22], [110, 400, 44, 22], [470, 400, 44, 22], [610, 400, 44, 22], [250, 400, 44, 22], [560, 230, 120, 40]], lights: [[200, 250], [400, 120], [400, 400], [700, 250]] },
    arena: { n: "L'Arena", obs: [[200, 160, 20, 20], [540, 160, 20, 20], [200, 340, 20, 20], [540, 340, 20, 20]], lights: [[380, 60], [380, 460], [60, 260], [700, 260]] }
  };
  let S = null, ui = null, raf = 0, tutC = null, lastT = 0, bgCache = {};
  function diffK() { try { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; } catch (e) { return 1; } }
  function heroShirt() { try { return (JSON.parse(localStorage.getItem("ali-di-rondine.campione")) || {}).shirt || "#1f5fbf"; } catch (e) { return "#1f5fbf"; } }
  function mk(o, practice) {
    const k = diffK(), pk = {}; Object.keys(PERKS).forEach((id) => { pk[id] = clamp(((o.perks || {})[id] | 0), 0, PERKS[id].max); });
    const st = { o, k, practice: !!practice, arena: ARENAS[o.arena] ? o.arena : "campo", time: practice ? 40 : (o.time || 150), boss: practice ? null : (o.boss || null), mix: (o.mix && o.mix.length ? o.mix : ["tifoso", "corridore"]),
      hero: { x: WW / 2, y: WH / 2 + 40, hp: 0, max: 0, inv: 0, face: [1, 0], cd: 0.6, rcd: 2.5, fcd: 5, sp: 70 }, pk, lv: 1, xp: 0, need: 5, foes: [], balls: [], shots: [], gems: [], fx: [], txt: [], rings: [], puddles: [],
      allies: (practice ? [] : (o.allies || [])).slice(0, 3).map((a, i) => ({ id: a.id, n: a.n, pow: a.pow, img: a.img || null, x: WW / 2 + (i - 1) * 24, y: WH / 2 + 60, cd: 1 + i, ang: i * 2.1 })),
      t: 0, f: 0, spawnT: 1, phase: "play", win: false, ended: false, kills: 0, bossOn: false, bossDead: false, banner: null, pick: null, cam: [0, 0], stick: null, keys: {}, shirt: heroShirt(), shake: 0 };
    st.hero.max = (o.hp || 10) + 3 * pk.borraccia; st.hero.hp = st.hero.max; return st;
  }
  // ------------------------------------------------------------ mondo
  function blocked(x, y, r) { const A = ARENAS[S.arena].obs; for (let i = 0; i < A.length; i++) { const b = A[i]; if (x + r > b[0] && x - r < b[0] + b[2] && y + r > b[1] && y - r < b[1] + b[3]) return b; } return null; }
  function moveBody(e, dx, dy, r) { const nx = clamp(e.x + dx, r, WW - r), ny = clamp(e.y + dy, r, WH - r); if (!blocked(nx, e.y, r)) e.x = nx; if (!blocked(e.x, ny, r)) e.y = ny; }
  function spawn(tp, near) {
    const F0 = FOES[tp] || FOES.tifoso, h = S.hero; let x, y, n = 0;
    do { const a = rnd() * 6.283, d = near ? 40 + rnd() * 30 : 230 + rnd() * 60; x = clamp(h.x + Math.cos(a) * d, 10, WW - 10); y = clamp(h.y + Math.sin(a) * d, 10, WH - 10); n++; } while ((blocked(x, y, F0.r) || (!near && hyp(x - h.x, y - h.y) < 150)) && n < 12);
    const hm = S.k > 1.05 ? 1.3 : S.k < 0.95 ? 0.75 : 1, grow = 1 + (S.o.endless ? Math.floor(S.t / 60) * 0.35 : 0), hp = F0.hp * hm * grow * (F0.boss ? 1 : 1 + S.t / Math.max(60, S.time) * 0.6);
    const e = { tp, F: F0, x, y, hp, max: hp, sp: F0.sp * (0.88 + rnd() * 0.24), cd: 1 + rnd(), hit: 0, stun: 0, slow: 0, bob: rnd() * 6, note: rnd() * 200, st: 0, sx: 0, sy: 0 };
    S.foes.push(e); return e;
  }
  function addXp(v) { S.xp += v; while (S.xp >= S.need && S.phase === "play") { S.xp -= S.need; S.lv++; S.need = Math.round(5 + S.lv * 4 + S.lv * S.lv * 0.4); offer(); } }
  function offer() {
    const pool = Object.keys(PERKS).filter((id) => S.pk[id] < PERKS[id].max); if (!pool.length) { S.hero.hp = S.hero.max; say("Energia piena!", "#86efac"); return; }
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    S.pick = pool.slice(0, 3); S.phase = "pick"; controls(); lg();
  }
  function choose(i) {
    if (!S || S.phase !== "pick" || !S.pick || !S.pick[i]) return false; const id = S.pick[i]; S.pk[id]++; S.pick = null; S.phase = "play";
    if (id === "borraccia") { S.hero.max += 3; S.hero.hp = S.hero.max; }
    say(`${PERKS[id].icon} ${PERKS[id].n} · Liv. ${S.pk[id]}`, "#fde68a"); burst(S.hero.x, S.hero.y, 16, "#fde68a"); controls(); lg(); return id;
  }
  function burst(x, y, n, c) { for (let i = 0; i < n; i++) { const a = rnd() * 7, v = 0.5 + rnd() * 1.8; S.fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, a: 18 + rnd() * 12, c }); } }
  function say(t, c) { S.txt.push({ t, c: c || "#fff", y: 60, a: 70 }); }
  function hurt(e, d, kind) {
    if (e.hp <= 0) return; e.hp -= d; e.hit = 6;
    if (kind !== "dot") { const h = S.hero, a = Math.atan2(e.y - h.y, e.x - h.x), kb = e.F.boss ? 1 : 4; moveBody(e, Math.cos(a) * kb, Math.sin(a) * kb, e.F.r); }
    if (e.hp <= 0) {
      S.kills++; burst(e.x, e.y, e.F.boss ? 30 : 8, e.F.boss ? "#fde047" : "#a3e635");
      const xp = e.F.xp; for (let i = 0; i < Math.min(5, xp); i++) S.gems.push({ x: e.x + (rnd() - 0.5) * 12, y: e.y + (rnd() - 0.5) * 12, v: Math.ceil(xp / Math.min(5, xp)), big: xp >= 4 });
      if (!e.F.boss && rnd() < 0.025) S.gems.push({ x: e.x, y: e.y, food: 1 });
      if (!e.F.boss && rnd() < 0.008) S.gems.push({ x: e.x, y: e.y, smoke: 1 });
      if (e.F.boss) { S.bossDead = true; say(e.F.n.toUpperCase() + " È A TERRA!", "#fde047"); S.shake = 14; if (!S.o.endless) setTimeout(() => S && !S.ended && end(true), 900); else { S.bossOn = false; } }
    }
  }
  function hitHero(d) {
    const h = S.hero; if (h.inv > 0 || S.ended) return; const red = 1 - 0.2 * S.pk.parastinchi; h.hp -= d * red; h.inv = 0.7 + 0.15 * S.pk.parastinchi; S.shake = 6; burst(h.x, h.y, 6, "#fca5a5");
    if (h.hp <= 0) { h.hp = 0; end(false); }
  }
  function nearest(x, y, range, skip) { let best = null, bd = range; for (const e of S.foes) { if (e.hp <= 0 || (skip && skip.includes(e))) continue; const d = hyp(e.x - x, e.y - y); if (d < bd) { bd = d; best = e; } } return best; }
  function kick() {
    const h = S.hero, n = 1 + S.pk.doppietta, used = [];
    for (let i = 0; i < n; i++) { const t = nearest(h.x, h.y, 150, used); if (!t) break; used.push(t); S.balls.push({ x: h.x, y: h.y - 3, tg: t, t: 0, rb: S.pk.rimbalzo, hitL: [] }); }
    return used.length;
  }
  function boss() {
    S.bossOn = true; const e = spawn(S.boss); e.x = clamp(S.hero.x + 160, 30, WW - 30); e.y = clamp(S.hero.y - 80, 30, WH - 30); if (blocked(e.x, e.y, e.F.r)) { e.x = WW / 2; e.y = 60; }
    S.banner = { t: "ARRIVA " + e.F.n.toUpperCase(), a: 110 }; S.shake = 10; return e;
  }
  // ------------------------------------------------------------ passo di gioco
  function step(dt) {
    if (!S || S.ended || S.phase !== "play") return;
    S.t += dt; S.f++; const h = S.hero;
    // movimento: joystick a dito o tastiera
    let mx = 0, my = 0; const K0 = S.keys;
    if (K0.l) mx -= 1; if (K0.r) mx += 1; if (K0.u) my -= 1; if (K0.d) my += 1;
    if (S.stick && S.stick.on) { const dx = S.stick.cx - S.stick.x0, dy = S.stick.cy - S.stick.y0, d = hyp(dx, dy); if (d > 4) { mx = dx / Math.max(d, 26); my = dy / Math.max(d, 26); } }
    const ml = hyp(mx, my); if (ml > 1) { mx /= ml; my /= ml; }
    const sp = h.sp * (1 + 0.12 * S.pk.scarpini) * dt; if (ml > 0.05) { moveBody(h, mx * sp, my * sp, 6); h.face = [mx / (ml || 1), my / (ml || 1)]; }
    h.inv = Math.max(0, h.inv - dt);
    // calcio automatico, rovesciata, fischietto
    h.cd -= dt; if (h.cd <= 0) { if (kick()) h.cd = Math.max(0.28, 0.9 * Math.pow(0.86, S.pk.raffica)); else h.cd = 0.15; }
    if (S.pk.rovesciata) { h.rcd -= dt; if (h.rcd <= 0) { h.rcd = Math.max(1.1, 2.6 - 0.35 * S.pk.rovesciata); S.shots.push({ x: h.x, y: h.y, vx: -h.face[0] * 230, vy: -h.face[1] * 230, d: 1.5 + 0.5 * S.pk.rovesciata, life: 1.1, pierce: 1, col: "#fef3c7", hit: [] }); } }
    if (S.pk.fischietto) { h.fcd -= dt; if (h.fcd <= 0) { h.fcd = Math.max(2.5, 6.5 - 0.9 * S.pk.fischietto); const R = 55 + 15 * S.pk.fischietto; S.rings.push({ x: h.x, y: h.y, r: 6, R, a: 1, c: "#fde68a" }); S.foes.forEach((e) => { if (hyp(e.x - h.x, e.y - h.y) < R) { e.stun = e.F.boss ? 0.4 : 1.4; hurt(e, 1, "dot"); } }); } }
    // spawn
    if (!S.bossOn || S.o.endless) {
      S.spawnT -= dt; const pr = clamp(S.t / S.time, 0, 1.4), rate = (S.o.rate || 1) * S.k;
      if (S.spawnT <= 0 && S.foes.length < 110) { const n = 1 + Math.floor(pr * 2.2 + (S.o.endless ? S.t / 70 : 0)); for (let i = 0; i < n; i++) { const pool = S.mix.filter((tp, j) => j === 0 || pr > j * 0.18); spawn(pool[Math.floor(rnd() * pool.length)]); } S.spawnT = Math.max(0.35, 1.5 - pr * 1.05) / rate; }
    } else if (S.f % 150 === 0 && S.foes.length < 40) spawn(S.mix[0]);
    if (!S.bossOn && !S.bossDead && S.boss && S.t >= S.time) boss();
    if (S.o.endless && !S.bossOn && S.t > 0 && Math.floor(S.t) % 120 === 0 && Math.floor(S.t - dt) % 120 !== 0) { S.boss = ["tamburo", "megafono", "ringhio", "mascotte"][Math.floor(S.t / 120 - 1) % 4]; S.bossDead = false; boss(); }
    if (!S.boss && !S.o.endless && S.t >= S.time) return end(true);
    // palloni a ricerca
    S.balls.forEach((b) => {
      b.t += dt; let tg = b.tg; if (!tg || tg.hp <= 0) { tg = b.tg = nearest(b.x, b.y, 120, b.hitL); if (!tg) { b.dead = true; return; } }
      const ex = tg.x - b.x, ey = tg.y - b.y, e = hyp(ex, ey);
      if (e < tg.F.r + 2) { hurt(tg, 1 + 0.5 * S.pk.potenza, "ball"); b.hitL.push(tg); burst(tg.x, tg.y, 3, "#fef3c7"); if (b.rb > 0) { b.rb--; b.tg = nearest(tg.x, tg.y, 100, b.hitL); if (!b.tg) b.dead = true; } else b.dead = true; return; }
      const v = 300 * dt; b.x += (ex / e) * v; b.y += (ey / e) * v; if (b.t > 1.4) b.dead = true;
    });
    S.balls = S.balls.filter((b) => !b.dead);
    // tiri dritti (rovesciata, cannonata) e rotoli dei lanciatori
    S.shots.forEach((s) => {
      s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt; if (s.life <= 0 || s.x < 0 || s.y < 0 || s.x > WW || s.y > WH || blocked(s.x, s.y, 1)) { s.dead = true; return; }
      if (s.foe) { if (hyp(s.x - h.x, s.y - h.y) < 7) { hitHero(1); s.dead = true; } return; }
      for (const e of S.foes) { if (e.hp > 0 && !s.hit.includes(e) && hyp(e.x - s.x, e.y - s.y) < e.F.r + 3) { hurt(e, s.d, "shot"); s.hit.push(e); if (!s.pierce) { s.dead = true; break; } } }
    });
    S.shots = S.shots.filter((s) => !s.dead);
    // sciarpa rotante
    if (S.pk.sciarpa) { const n = S.pk.sciarpa, R = 26 + 3 * n; for (let i = 0; i < n; i++) { const a = S.t * 3.2 + (i * 6.283) / n, sx = h.x + Math.cos(a) * R, sy = h.y + Math.sin(a) * R; for (const e of S.foes) if (e.hp > 0 && hyp(e.x - sx, e.y - sy) < e.F.r + 5 && (e.sc0 || 0) <= S.t) { e.sc0 = S.t + 0.45; hurt(e, 1 + 0.25 * n, "scarf"); } } }
    // compagni
    S.allies.forEach((a, i) => {
      a.ang += dt * 0.6; const tx = h.x + Math.cos(a.ang + i * 2.1) * 30, ty = h.y + Math.sin(a.ang + i * 2.1) * 22; moveBody(a, (tx - a.x) * Math.min(1, dt * 4), (ty - a.y) * Math.min(1, dt * 4), 5);
      a.cd -= dt; if (a.cd > 0 && a.pow !== "coro") return;
      if (a.pow === "bomber") { const t = nearest(a.x, a.y, 200); if (t) { const d = hyp(t.x - a.x, t.y - a.y) || 1; S.shots.push({ x: a.x, y: a.y, vx: (t.x - a.x) / d * 260, vy: (t.y - a.y) / d * 260, d: 4, life: 1.2, pierce: 1, col: "#fb923c", big: 1, hit: [] }); a.cd = 2.6; } else a.cd = 0.3; }
      else if (a.pow === "cura") { if (h.hp < h.max) { h.hp = Math.min(h.max, h.hp + 1); S.fx.push({ x: h.x, y: h.y - 10, vx: 0, vy: -0.5, a: 30, c: "#86efac", plus: 1 }); } a.cd = 7; }
      else if (a.pow === "flash") { const vis = S.foes.filter((e) => Math.abs(e.x - S.cam[0] - W / 2) < W / 2 && Math.abs(e.y - S.cam[1] - H / 2) < H / 2); if (vis.length > 4) { vis.forEach((e) => { e.stun = e.F.boss ? 0.5 : 1.6; }); S.flash = 10; a.cd = 9; } else a.cd = 1; }
      else if (a.pow === "scopa") { let any = 0; S.foes.forEach((e) => { if (hyp(e.x - a.x, e.y - a.y) < 32) { hurt(e, 2, "scopa"); any = 1; } }); if (any) S.rings.push({ x: a.x, y: a.y, r: 4, R: 32, a: 1, c: "#d6d3d1" }); a.cd = any ? 2 : 0.3; }
      else if (a.pow === "benedizione") { S.rings.push({ x: a.x, y: a.y, r: 6, R: 80, a: 1, c: "#93c5fd" }); S.foes.forEach((e) => { if (hyp(e.x - a.x, e.y - a.y) < 80) e.slow = 2.5; }); a.cd = 6; }
      else if (a.pow === "coro") { S.foes.forEach((e) => { if (hyp(e.x - a.x, e.y - a.y) < 62) e.slow = Math.max(e.slow, 0.2); }); a.cd = 0; }
      else if (a.pow === "muro") { S.foes.forEach((e) => { const d = hyp(e.x - a.x, e.y - a.y); if (d < e.F.r + 8) { hurt(e, 1, "muro"); } }); a.cd = 1; }
    });
    // tifosi
    const coroR = S.pk.coro ? 50 + 12 * S.pk.coro : 0;
    S.foes.forEach((e) => {
      if (e.hp <= 0) return; e.hit = Math.max(0, e.hit - 1); e.stun = Math.max(0, e.stun - dt); e.slow = Math.max(0, e.slow - dt); e.cd -= dt; e.note -= 1;
      if (e.stun > 0) return;
      let sp = e.sp * dt * (e.slow > 0 ? 0.5 : 1); const dx = h.x - e.x, dy = h.y - e.y, d = hyp(dx, dy) || 1;
      if (coroR && d < coroR) sp *= 1 - 0.18 * S.pk.coro;
      if (S.foes.some((o) => o !== e && o.F.aura && o.hp > 0 && hyp(o.x - e.x, o.y - e.y) < 60)) sp *= 1.3;
      const B = e.F.boss;
      if (B === "ringhio" && e.st > 0) { e.st -= dt; moveBody(e, e.sx * dt, e.sy * dt, e.F.r); if (hyp(h.x - e.x, h.y - e.y) < e.F.r + 6) hitHero(e.F.dmg); return; }
      if (B === "mascotte" && e.st > 0) { e.st -= dt; if (e.st <= 0) { e.x = e.sx; e.y = e.sy; S.rings.push({ x: e.x, y: e.y, r: 8, R: 54, a: 1, c: "#fde047" }); S.shake = 10; if (hyp(h.x - e.x, h.y - e.y) < 54) hitHero(3); for (let i = 0; i < 3; i++) spawn("corridore", true); } return; }
      if (e.F.far && d < 95) { moveBody(e, -dx / d * sp * 0.6, -dy / d * sp * 0.6, e.F.r); }
      else moveBody(e, (dx / d) * sp, (dy / d) * sp, e.F.r);
      // tra loro non si sovrappongono troppo
      if (S.f % 3 === 0) for (const o of S.foes) { if (o === e || o.hp <= 0) continue; const ox = e.x - o.x, oy = e.y - o.y, od = hyp(ox, oy); const m = e.F.r + o.F.r - 2; if (od > 0 && od < m) { moveBody(e, (ox / od) * (m - od) * 0.4, (oy / od) * (m - od) * 0.4, e.F.r); } }
      if (d < e.F.r + 6 && e.cd <= 0) { hitHero(e.F.dmg); e.cd = 0.9; }
      if (e.F.far && e.cd <= 0 && d < 170) { S.shots.push({ x: e.x, y: e.y, vx: dx / d * 120, vy: dy / d * 120, d: 1, life: 2, foe: 1, col: "#f8fafc", hit: [] }); e.cd = 2.6; }
      if (B === "tamburo" && e.cd <= 0) { S.rings.push({ x: e.x, y: e.y, r: 10, R: 110, a: 1, c: "#c084fc", hurt: 1, done: false }); e.cd = 4.2; for (let i = 0; i < 2; i++) spawn("tifoso", true); }
      if (B === "megafono" && e.cd <= 0) { const a0 = Math.atan2(dy, dx); for (let k = -2; k <= 2; k++) { const a = a0 + k * 0.22; S.shots.push({ x: e.x, y: e.y, vx: Math.cos(a) * 140, vy: Math.sin(a) * 140, d: 1, life: 2.2, foe: 1, col: "#f472b6", wave: 1, hit: [] }); } e.cd = 3; if (rnd() < 0.5) for (let i = 0; i < 3; i++) spawn("corridore", true); }
      if (B === "ringhio" && e.cd <= 0) { e.st = 0.75; e.sx = dx / d * 170; e.sy = dy / d * 170; e.cd = 3.4; S.puddles.push({ x: e.x, y: e.y, t: 5 }); say("CARICA!", "#fca5a5"); }
      if (B === "mascotte" && e.cd <= 0) { e.st = 1.1; e.sx = clamp(h.x, 30, WW - 30); e.sy = clamp(h.y, 30, WH - 30); e.cd = 4; }
    });
    S.foes = S.foes.filter((e) => e.hp > 0);
    // fiamme di fumogeno a terra (Ringhio)
    S.puddles.forEach((p) => { p.t -= dt; if (hyp(p.x - h.x, p.y - h.y) < 14 && S.f % 20 === 0) hitHero(1); }); S.puddles = S.puddles.filter((p) => p.t > 0);
    // anelli d'urto
    S.rings.forEach((r) => { r.r += (r.R - r.r) * Math.min(1, dt * 5) + 40 * dt; r.a -= dt * 1.3; if (r.hurt && !r.done && r.r > 20) { const d = hyp(h.x - r.x, h.y - r.y); if (Math.abs(d - r.r) < 8) { hitHero(2); r.done = true; } } });
    S.rings = S.rings.filter((r) => r.a > 0);
    // gettoni
    const PR = 22 + 16 * S.pk.calamita;
    S.gems.forEach((g) => { const d = hyp(g.x - h.x, g.y - h.y); if (d < PR) { g.x += (h.x - g.x) * Math.min(1, dt * 9); g.y += (h.y - g.y) * Math.min(1, dt * 9); } if (d < 8) { g.dead = true; if (g.food) { h.hp = Math.min(h.max, h.hp + 3); say("🥪 Panino! +3", "#86efac"); } else if (g.smoke) { S.foes.forEach((e) => { if (!e.F.boss) hurt(e, 99, "dot"); }); S.flash = 14; say("FUMOGENO BLU!", "#93c5fd"); } else addXp(g.v); } });
    S.gems = S.gems.filter((g) => !g.dead); if (S.gems.length > 260) S.gems.splice(0, S.gems.length - 260);
    S.fx.forEach((p) => { p.x += p.vx; p.y += p.vy; p.a--; }); S.fx = S.fx.filter((p) => p.a > 0);
    S.txt.forEach((x) => { x.y -= 0.3; x.a--; }); S.txt = S.txt.filter((x) => x.a > 0);
    if (S.banner && --S.banner.a <= 0) S.banner = null; if (S.flash) S.flash--; if (S.shake > 0) S.shake -= 0.5;
    if (S.f % 8 === 0) hud();
  }
  function end(win) {
    if (!S || S.ended) return; S.ended = true; S.phase = "end"; S.win = S.practice ? true : !!win; S.pick = null;
    if (S.o.endless && S.o.bestKey) { try { const k = "ali-di-rondine." + S.o.bestKey, b = +localStorage.getItem(k) || 0; S.best = Math.max(b, Math.floor(S.t)); localStorage.setItem(k, String(S.best)); } catch (e) {} }
    hud(); controls(); lg();
  }
  // ------------------------------------------------------------ disegno
  function bgArena(key) {
    if (bgCache[key]) return bgCache[key];
    const c = document.createElement("canvas"); c.width = WW; c.height = WH; const g = c.getContext("2d"), A = ARENAS[key];
    const rr = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
    if (key === "campo" || key === "arena") {
      for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? (key === "arena" ? "#1f3b2a" : "#1d4a26") : (key === "arena" ? "#244532" : "#22552c"); g.fillRect(i * WW / 16, 0, WW / 16 + 1, WH); }
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rr(i) > 0.5 ? "120,200,110" : "10,40,15"},.18)`; g.fillRect(rr(i + 3) * WW, rr(i + 7) * WH, 1, 2); }
      g.strokeStyle = "rgba(240,253,244,.75)"; g.lineWidth = 2; g.strokeRect(24, 24, WW - 48, WH - 48); g.beginPath(); g.moveTo(WW / 2, 24); g.lineTo(WW / 2, WH - 24); g.stroke(); g.beginPath(); g.arc(WW / 2, WH / 2, 54, 0, 7); g.stroke();
      g.strokeRect(24, WH / 2 - 90, 90, 180); g.strokeRect(WW - 114, WH / 2 - 90, 90, 180); g.strokeRect(24, WH / 2 - 40, 34, 80); g.strokeRect(WW - 58, WH / 2 - 40, 34, 80);
      g.fillStyle = "#f0fdf4"; g.beginPath(); g.arc(WW / 2, WH / 2, 3, 0, 7); g.fill();
      if (key === "campo") { g.font = "900 46px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(255,255,255,.06)"; g.fillText("BORGO MARINO", WW / 2, WH / 2 + 130); }
      else { g.font = "900 46px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(255,255,255,.06)"; g.fillText("ARENA DEI SOGNI", WW / 2, WH / 2 + 130); }
      // sciarpe e rotoli caduti sul prato
      for (let i = 0; i < 26; i++) { const x = rr(i + 40) * WW, y = rr(i + 80) * WH; g.save(); g.translate(x, y); g.rotate(rr(i) * 6); g.fillStyle = i % 2 ? "#7c3aed" : "#facc15"; g.fillRect(-8, -1.5, 16, 3); g.fillStyle = i % 2 ? "#facc15" : "#7c3aed"; g.fillRect(-4, -1.5, 3, 3); g.fillRect(2, -1.5, 3, 3); g.restore(); }
    } else if (key === "tribuna") {
      for (let y = 0; y < WH; y += 20) { g.fillStyle = (y / 20) % 2 ? "#3f3f46" : "#52525b"; g.fillRect(0, y, WW, 20); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, y + 18, WW, 2); for (let x = 6; x < WW; x += 14) { g.fillStyle = (x + y) % 3 ? "#1d4ed8" : "#e2e8f0"; g.fillRect(x, y + 4, 9, 8); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(x, y + 10, 9, 2); } }
      g.fillStyle = "#71717a"; g.fillRect(WW / 2 - 18, 0, 36, WH); g.fillRect(0, WH / 2 - 14, WW, 28); for (let y = 0; y < WH; y += 10) { g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(WW / 2 - 18, y, 36, 1); }
      for (let i = 0; i < 40; i++) { const x = rr(i + 9) * WW, y = rr(i + 19) * WH; g.fillStyle = ["#f8fafc", "#facc15", "#7c3aed", "#ef4444"][i % 4]; g.fillRect(x, y, 3, 2); }
      g.font = "900 13px system-ui"; g.fillStyle = "#facc15"; g.textAlign = "center"; g.fillText("TRIBUNA CENTRALE · SETTORE B", WW / 2, WH / 2 + 4);
    } else if (key === "curva") {
      for (let y = 0; y < WH; y += 16) { g.fillStyle = (y / 16) % 2 ? "#292524" : "#3a3330"; g.fillRect(0, y, WW, 16); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(0, y + 14, WW, 2); }
      [["VALTORTA ALÉ", "#6d28d9", "#facc15", 60], ["NOI NON MORIAMO MAI", "#facc15", "#3b0764", 220], ["ULTRAS 1977", "#6d28d9", "#f8fafc", 360], ["FINO ALLA FINE", "#1e1b4b", "#facc15", 470]].forEach(([t, b, c, y]) => { g.fillStyle = b; g.fillRect(70, y, WW - 140, 26); g.font = "900 18px system-ui"; g.textAlign = "center"; g.fillStyle = c; g.fillText(t, WW / 2, y + 19); g.fillStyle = "rgba(0,0,0,.25)"; for (let x = 70; x < WW - 70; x += 40) g.fillRect(x, y, 2, 26); });
      for (let i = 0; i < 60; i++) { const x = rr(i + 3) * WW, y = rr(i + 13) * WH; g.fillStyle = "rgba(250,204,21,.22)"; g.fillRect(x, y, 2, 2); }
    } else {
      g.fillStyle = "#27272a"; g.fillRect(0, 0, WW, WH); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${rr(i) > 0.5 ? "90,90,100" : "10,10,15"},.35)`; g.fillRect(rr(i + 2) * WW, rr(i + 5) * WH, 1, 1); }
      g.strokeStyle = "rgba(250,250,250,.55)"; g.lineWidth = 2; for (let x = 80; x < WW; x += 70) { g.beginPath(); g.moveTo(x, 60); g.lineTo(x, 140); g.moveTo(x, 370); g.lineTo(x, 450); g.stroke(); }
      g.fillStyle = "#facc15"; for (let x = 0; x < WW; x += 30) g.fillRect(x, WH / 2 - 1, 16, 3);
      g.fillStyle = "rgba(250,204,21,.8)"; g.font = "900 22px system-ui"; g.textAlign = "center"; g.fillText("P · OSPITI", 120, 40); g.fillText("USCITA ▸", WW - 90, WH / 2 - 30);
      for (let i = 0; i < 14; i++) { g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(rr(i + 30) * WW, rr(i + 60) * WH, 10 + rr(i) * 12, 4 + rr(i + 1) * 5, 0, 0, 7); g.fill(); }
    }
    // ostacoli
    A.obs.forEach((b, i) => {
      const [x, y, w, h] = b; g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(x + 3, y + 4, w, h);
      if (key === "campo") { g.fillStyle = "#f8fafc"; g.fillRect(x, y, w, h); g.fillStyle = "rgba(148,163,184,.5)"; for (let k = 2; k < h; k += 4) g.fillRect(x + 2, y + k, w - 4, 1); for (let k = 2; k < w; k += 4) g.fillRect(x + k, y + 2, 1, h - 4); }
      else if (key === "parcheggio" && w > 100) { g.fillStyle = "#1e40af"; g.fillRect(x, y, w, h); g.fillStyle = "#93c5fd"; for (let k = 8; k < w - 10; k += 16) g.fillRect(x + k, y + 6, 11, 10); g.fillStyle = "#fde047"; g.font = "900 8px system-ui"; g.textAlign = "center"; g.fillText("BORGO MARINO CALCIO", x + w / 2, y + h - 6); g.fillStyle = "#111"; g.beginPath(); g.arc(x + 20, y + h, 6, 0, 7); g.arc(x + w - 20, y + h, 6, 0, 7); g.fill(); }
      else if (key === "parcheggio") { const col = ["#b91c1c", "#0f766e", "#a16207", "#4338ca", "#e5e7eb"][i % 5]; g.fillStyle = col; g.beginPath(); g.roundRect(x, y, w, h, 6); g.fill(); g.fillStyle = "rgba(186,230,253,.7)"; g.fillRect(x + 10, y + 4, w - 20, h - 8); g.fillStyle = col; g.fillRect(x + 18, y + 4, 6, h - 8); }
      else if (key === "curva" && h < 12) { g.fillStyle = "#71717a"; g.fillRect(x, y, w, h); g.fillStyle = "#a1a1aa"; for (let k = 0; k < w; k += 8) g.fillRect(x + k, y - 6, 2, 6 + h); }
      else if (key === "tribuna" && w > 60) { g.fillStyle = "#18181b"; g.fillRect(x, y, w, h); g.fillStyle = "#facc15"; g.font = "900 9px system-ui"; g.textAlign = "center"; g.fillText("CABINA RADIO", x + w / 2, y + h / 2 + 3); g.fillStyle = "rgba(147,197,253,.4)"; g.fillRect(x + 6, y + 4, w - 12, 8); }
      else { g.fillStyle = "#78716c"; g.fillRect(x, y, w, h); g.fillStyle = "#a8a29e"; g.fillRect(x, y, w, 3); }
    });
    return (bgCache[key] = c);
  }
  function zombie(g, e, f) {
    const s = e.F.r / 6, x = e.x, y = e.y, b = Math.sin(f / 5 + e.bob) * 1.2 * (e.stun > 0 ? 0 : 1), B = e.F.boss;
    g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(x, y + 6 * s, 6 * s, 2 * s, 0, 0, 7); g.fill();
    if (B === "mascotte") {
      g.fillStyle = e.hit ? "#fde68a" : "#78716c"; g.beginPath(); g.ellipse(x, y - 4 * s + b, 8 * s, 9 * s, 0, 0, 7); g.fill(); g.fillStyle = "#f5f5f4"; g.beginPath(); g.ellipse(x, y - 2 * s + b, 4 * s, 6 * s, 0, 0, 7); g.fill();
      g.fillStyle = "#e7e5e4"; g.fillRect(x - 2 * s, y - 14 * s + b, 4 * s, 4 * s); g.fillStyle = "#292524"; g.fillRect(x - 5 * s, y - 13 * s + b, 2.5 * s, 5 * s); g.fillRect(x + 2.5 * s, y - 13 * s + b, 2.5 * s, 5 * s);
      g.fillStyle = "#a3e635"; g.fillRect(x - 3 * s, y - 11 * s + b, 1.4 * s, 1.4 * s); g.fillRect(x + 1.6 * s, y - 11 * s + b, 1.4 * s, 1.4 * s); g.fillStyle = "#7c3aed"; g.fillRect(x - 8 * s, y - 6 * s + b, 16 * s, 2.5 * s);
      if (e.st > 0) { g.strokeStyle = "rgba(253,224,71,.8)"; g.lineWidth = 2; g.setLineDash([4, 3]); g.beginPath(); g.arc(e.sx, e.sy, 54 * (1.1 - e.st), 0, 7); g.stroke(); g.setLineDash([]); }
      return;
    }
    g.fillStyle = e.hit ? "#fef9c3" : e.F.sh; g.fillRect(x - 3 * s, y - 3 * s + b, 6 * s, 8 * s);
    g.fillStyle = e.F.sc; g.fillRect(x - 3.4 * s, y - 3.2 * s + b, 6.8 * s, 1.6 * s); g.fillRect(x + 1.5 * s, y - 2 * s + b, 1.4 * s, 4 * s);
    g.fillStyle = e.hit ? "#fef9c3" : "#86a36b"; g.beginPath(); g.arc(x, y - 6 * s + b, 2.8 * s, 0, 7); g.fill();
    g.fillStyle = "#1a2e05"; g.fillRect(x - 1.6 * s, y - 6.8 * s + b, 1 * s, 1 * s); g.fillRect(x + 0.6 * s, y - 6.8 * s + b, 1 * s, 1 * s); g.fillStyle = "#3f0a0a"; g.fillRect(x - 0.8 * s, y - 5 * s + b, 1.6 * s, 1.2 * s + Math.abs(Math.sin(f / 6 + e.bob)) * s);
    g.strokeStyle = e.hit ? "#fef9c3" : "#86a36b"; g.lineWidth = 1.2 * s; g.beginPath(); g.moveTo(x - 3 * s, y - 2 * s + b); g.lineTo(x - 5 * s, y - 5 * s + b); g.moveTo(x + 3 * s, y - 2 * s + b); g.lineTo(x + 5 * s, y - 5 * s + b); g.stroke();
    if (e.tp === "tamburino" || B === "tamburo") { g.fillStyle = "#b45309"; g.beginPath(); g.ellipse(x, y + 1 * s + b, 3.5 * s, 2 * s, 0, 0, 7); g.fill(); g.fillStyle = "#fef3c7"; g.beginPath(); g.ellipse(x, y + 0.3 * s + b, 3.5 * s, 1.2 * s, 0, 0, 7); g.fill(); }
    if (e.tp === "lanciatore") { g.fillStyle = "#f8fafc"; g.fillRect(x + 3 * s, y - 7 * s + b, 2.5 * s, 3 * s); }
    if (B === "megafono") { g.fillStyle = "#f472b6"; g.beginPath(); g.moveTo(x + 2 * s, y - 6 * s + b); g.lineTo(x + 7 * s, y - 9 * s + b); g.lineTo(x + 7 * s, y - 3 * s + b); g.fill(); }
    if (B === "ringhio") { g.fillStyle = "#111827"; g.fillRect(x - 3 * s, y - 9.5 * s + b, 6 * s, 2 * s); g.fillStyle = "#facc15"; g.fillRect(x - 3 * s, y - 8 * s + b, 6 * s, 0.8 * s); if (e.st > 0) { g.strokeStyle = "rgba(252,165,165,.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - e.sx * 0.12, y - e.sy * 0.12); g.stroke(); } }
    if (e.stun > 0) { g.fillStyle = "#fde68a"; g.font = `${6 * Math.min(2, s)}px serif`; g.textAlign = "center"; g.fillText("✦", x + Math.sin(f / 4) * 4, y - 10 * s); }
    if (e.note < 0) { e.note = 140 + rnd() * 220; S && S.fx.push({ x: x + 4, y: y - 10 * s, vx: 0.15, vy: -0.35, a: 50, c: "#e9d5ff", note: 1 }); }
    if (e.max > 3 && e.hp < e.max) { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(x - 8, y - 12 * s - 4, 16, 2); g.fillStyle = "#a3e635"; g.fillRect(x - 8, y - 12 * s - 4, 16 * (e.hp / e.max), 2); }
  }
  function heroDraw(g, st, f) {
    const h = st.hero, x = h.x, y = h.y, mv = st.stick && st.stick.on || Object.values(st.keys).some(Boolean), b = mv ? Math.abs(Math.sin(f / 3)) * -1.5 : 0;
    if (h.inv > 0 && f % 6 < 3) return;
    g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(x, y + 7, 6, 2, 0, 0, 7); g.fill();
    g.fillStyle = "#f8fafc"; g.fillRect(x - 3, y + 1 + b, 6, 3); g.fillStyle = st.shirt; g.fillRect(x - 4, y - 5 + b, 8, 7); g.fillStyle = "rgba(255,255,255,.85)"; g.font = "900 5px system-ui"; g.textAlign = "center"; g.fillText("10", x, y + b);
    g.fillStyle = "#e8c4a0"; g.beginPath(); g.arc(x, y - 8 + b, 3.3, 0, 7); g.fill(); g.fillStyle = "#2b1d14"; g.fillRect(x - 3.3, y - 11.5 + b, 6.6, 2.2);
    g.fillStyle = "#111"; g.fillRect(x - 3, y + 4, 2, 3); g.fillRect(x + 1, y + 4, 2, 3);
  }
  function scene(g, st, f) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H);
    const h = st.hero, cx = clamp(h.x - W / 2, 0, WW - W), cy = clamp(h.y - H / 2, 0, WH - H); st.cam = [cx, cy];
    const sh = st.shake > 0 ? (rnd() - 0.5) * st.shake * 0.5 : 0;
    g.save(); g.translate(-cx + sh, -cy + sh);
    g.drawImage(bgArena(st.arena), 0, 0);
    // pozze di fumogeno
    st.puddles.forEach((p) => { g.fillStyle = `rgba(239,68,68,${0.25 + 0.15 * Math.sin(f / 3 + p.x)})`; g.beginPath(); g.arc(p.x, p.y, 13, 0, 7); g.fill(); g.fillStyle = "#fb923c"; g.fillRect(p.x - 1, p.y - 4 - (f % 8) / 2, 2, 3); });
    st.gems.forEach((gm) => { if (gm.food) { g.font = "9px serif"; g.textAlign = "center"; g.fillText("🥪", gm.x, gm.y + 3); return; } if (gm.smoke) { g.fillStyle = "#3b82f6"; g.fillRect(gm.x - 2, gm.y - 5, 4, 8); g.fillStyle = "rgba(147,197,253,.5)"; g.beginPath(); g.arc(gm.x, gm.y - 7, 3 + Math.sin(f / 5), 0, 7); g.fill(); return; } g.fillStyle = gm.big ? "#fde047" : "#facc15"; g.beginPath(); g.arc(gm.x, gm.y, gm.big ? 3 : 2, 0, 7); g.fill(); g.fillStyle = "#a16207"; g.fillRect(gm.x - 0.5, gm.y - 1, 1, 2); });
    st.rings.forEach((r) => { g.strokeStyle = r.c; g.globalAlpha = clamp(r.a, 0, 1); g.lineWidth = r.hurt ? 4 : 2; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 7); g.stroke(); g.globalAlpha = 1; });
    // tutti in ordine di y
    const L = st.foes.map((e) => ({ y: e.y, d: () => zombie(g, e, f) })).concat(st.allies.map((a) => ({ y: a.y, d: () => { if (M.man && a.img) M.man(g, a.x, a.y - 2, { col: "#0f766e", ring: "#5eead4", img: a.img, s: 0.45 }); else { g.fillStyle = "#0f766e"; g.fillRect(a.x - 3, a.y - 4, 6, 7); g.fillStyle = "#e8c4a0"; g.beginPath(); g.arc(a.x, a.y - 7, 3, 0, 7); g.fill(); } g.font = "700 5px system-ui"; g.fillStyle = "#ccfbf1"; g.textAlign = "center"; g.fillText(a.n, a.x, a.y - 13); } }))).concat([{ y: h.y, d: () => heroDraw(g, st, f) }]);
    L.sort((a, b) => a.y - b.y).forEach((o) => o.d());
    if (st.pk.sciarpa) { const n = st.pk.sciarpa, R = 26 + 3 * n; for (let i = 0; i < n; i++) { const a = st.t * 3.2 + (i * 6.283) / n, sx = h.x + Math.cos(a) * R, sy = h.y + Math.sin(a) * R; g.save(); g.translate(sx, sy); g.rotate(a + 1.57); g.fillStyle = "#1f5fbf"; g.fillRect(-6, -2, 12, 4); g.fillStyle = "#f8fafc"; g.fillRect(-2, -2, 4, 4); g.restore(); } }
    st.balls.forEach((b) => { g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(b.x, b.y, 2.6, 0, 7); g.fill(); g.fillStyle = "#111"; g.fillRect(b.x - 0.8, b.y - 0.8, 1.6, 1.6); });
    st.shots.forEach((s) => { if (s.foe) { if (s.wave) { g.strokeStyle = s.col; g.lineWidth = 2; g.beginPath(); g.arc(s.x, s.y, 4, 0, 7); g.stroke(); } else { g.fillStyle = s.col; g.fillRect(s.x - 2, s.y - 2, 4, 4); g.fillStyle = "#cbd5e1"; g.fillRect(s.x - 0.5, s.y - 2, 1, 4); } return; } g.fillStyle = s.col; g.beginPath(); g.arc(s.x, s.y, s.big ? 4 : 3, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.arc(s.x - s.vx * 0.02, s.y - s.vy * 0.02, s.big ? 3 : 2, 0, 7); g.fill(); });
    st.fx.forEach((p) => { g.globalAlpha = Math.min(1, p.a / 14); if (p.note) { g.fillStyle = p.c; g.font = "8px serif"; g.textAlign = "center"; g.fillText("♪", p.x, p.y); } else if (p.plus) { g.fillStyle = p.c; g.font = "900 8px system-ui"; g.textAlign = "center"; g.fillText("+1", p.x, p.y); } else { g.fillStyle = p.c; g.fillRect(p.x, p.y, 2, 2); } g.globalAlpha = 1; });
    // fari dello stadio e nebbia verde
    g.save(); g.globalCompositeOperation = "lighter"; ARENAS[st.arena].lights.forEach(([lx, ly], i) => { const gr = g.createRadialGradient(lx, ly, 0, lx, ly, 150); gr.addColorStop(0, "rgba(255,250,220,.16)"); gr.addColorStop(1, "rgba(255,250,220,0)"); g.fillStyle = gr; g.fillRect(lx - 150, ly - 150, 300, 300); }); g.restore();
    for (let i = 0; i < 7; i++) { const fx = ((i * 137 + f * (0.25 + i * 0.04)) % (WW + 200)) - 100, fy = (i * 83) % WH + Math.sin(f / 90 + i) * 30, gr = g.createRadialGradient(fx, fy, 0, fx, fy, 90); gr.addColorStop(0, "rgba(132,204,22,.13)"); gr.addColorStop(1, "rgba(132,204,22,0)"); g.fillStyle = gr; g.fillRect(fx - 90, fy - 90, 180, 180); }
    g.restore();
    // buio intorno al Campione
    const hx = h.x - cx, hy = h.y - cy, gr = g.createRadialGradient(hx, hy, 50, hx, hy, 260); gr.addColorStop(0, "rgba(3,7,18,0)"); gr.addColorStop(1, "rgba(3,7,18,.6)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (st.flash) { g.fillStyle = `rgba(255,255,255,${st.flash / 16})`; g.fillRect(0, 0, W, H); }
    // joystick
    if (st.stick && st.stick.on) { g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.beginPath(); g.arc(st.stick.x0 - 0, st.stick.y0, 22, 0, 7); g.stroke(); const dx = clamp(st.stick.cx - st.stick.x0, -22, 22), dy = clamp(st.stick.cy - st.stick.y0, -22, 22); g.fillStyle = "rgba(255,255,255,.4)"; g.beginPath(); g.arc(st.stick.x0 + dx, st.stick.y0 + dy, 9, 0, 7); g.fill(); }
    // barre in alto: energia, esperienza, tempo
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(6, 6, 110, 7); g.fillStyle = h.hp / h.max > 0.35 ? "#22c55e" : "#ef4444"; g.fillRect(7, 7, 108 * h.hp / h.max, 5); g.font = "800 6px system-ui"; g.textAlign = "left"; g.fillStyle = "#fff"; g.fillText(`❤ ${Math.ceil(h.hp)}/${h.max}`, 9, 12);
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, H - 4, W, 4); g.fillStyle = "#facc15"; g.fillRect(0, H - 4, W * st.xp / st.need, 4);
    const left = st.o.endless ? Math.floor(st.t) : Math.max(0, Math.ceil(st.time - st.t)), mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
    g.textAlign = "right"; g.font = "900 10px system-ui"; g.fillStyle = st.bossOn ? "#fca5a5" : "#fde68a"; g.fillText(st.bossOn ? "CAPO!" : `${mm}:${ss}`, W - 8, 15); g.font = "800 7px system-ui"; g.fillStyle = "#e2e8f0"; g.fillText(`Liv. ${st.lv} · ${st.kills} respinti`, W - 8, 25);
    const bo = st.foes.find((e) => e.F.boss); if (bo) { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(90, H - 16, 200, 6); g.fillStyle = "#c084fc"; g.fillRect(91, H - 15, 198 * bo.hp / bo.max, 4); g.textAlign = "center"; g.font = "800 6px system-ui"; g.fillStyle = "#fff"; g.fillText(bo.F.n, W / 2, H - 19); }
    st.txt.forEach((x) => { g.globalAlpha = Math.min(1, x.a / 20); g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillStyle = x.c; g.strokeStyle = "#000"; g.lineWidth = 3; g.strokeText(x.t, W / 2, x.y); g.fillText(x.t, W / 2, x.y); g.globalAlpha = 1; });
    if (st.banner) { g.globalAlpha = Math.min(1, st.banner.a / 25); g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, 96, W, 30); g.font = "900 16px system-ui"; g.textAlign = "center"; g.fillStyle = "#e9d5ff"; g.fillText(st.banner.t, W / 2, 116); g.globalAlpha = 1; }
    if (st.phase === "pick") { g.fillStyle = "rgba(2,6,23,.6)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 20px system-ui"; g.fillStyle = "#fde047"; g.fillText(`LIVELLO ${st.lv}!`, W / 2, 90); g.font = "800 11px system-ui"; g.fillStyle = "#fff"; g.fillText("Scegli un potere qui sotto", W / 2, 110); }
    if (st.phase === "pause") { g.fillStyle = "rgba(2,6,23,.6)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 20px system-ui"; g.fillStyle = "#fff"; g.fillText("PAUSA", W / 2, 116); }
    if (st.phase === "end") { g.fillStyle = "rgba(2,6,23,.78)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 22px system-ui"; g.fillStyle = st.win ? "#fde047" : "#fca5a5"; g.fillText(st.practice ? "PROVA FINITA" : st.o.endless ? "FINE DELLA NOTTE" : st.win ? "RESISTITO!" : "TI HANNO MORSO…", W / 2, 84); g.font = "800 12px system-ui"; g.fillStyle = "#fff"; g.fillText(`Respinti ${st.kills} · livello ${st.lv} · ${Math.floor(st.t)} secondi`, W / 2, 110); if (st.best != null) g.fillText(`Record: ${st.best} secondi`, W / 2, 128); }
  }
  // ------------------------------------------------------------ interfaccia
  function hud() {
    if (!ui || !S) return; const own = Object.keys(S.pk).filter((k) => S.pk[k]).map((k) => `${PERKS[k].icon}${S.pk[k]}`).join(" ");
    ui.hud.innerHTML = `<b>${esc(ARENAS[S.arena].n)}</b><span>Liv. ${S.lv}</span><span>Respinti ${S.kills}</span><span style="opacity:.85">${own || "nessun potere"}</span>`;
  }
  function controls() {
    if (!ui || !S) return; const B = ui.bt;
    if (S.phase === "end") { B.innerHTML = S.practice ? `<button class="go" id="asRe">↺ Riprova</button><button class="go" id="asGo2">▶ Gioca davvero</button>` : `<button class="go" id="asGo" style="flex-basis:100%">Fine ▸</button>`; const q = (s) => B.querySelector(s); if (q("#asGo")) q("#asGo").onclick = close; if (q("#asRe")) q("#asRe").onclick = () => restart(true); if (q("#asGo2")) q("#asGo2").onclick = () => restart(false); return; }
    if (S.phase === "pick") { B.innerHTML = S.pick.map((id, i) => `<button data-p="${i}" class="pw" style="flex-basis:100%;min-height:52px;text-align:left;padding:6px 12px">${PERKS[id].icon} ${esc(PERKS[id].n)} <b style="color:#fde68a">Liv. ${S.pk[id] + 1}</b><small>${esc(PERKS[id].d)}</small></button>`).join(""); B.querySelectorAll("[data-p]").forEach((b) => (b.onclick = () => choose(+b.dataset.p))); return; }
    B.innerHTML = `<button id="asPause" style="flex:0 0 auto;min-width:96px;min-height:44px">${S.phase === "pause" ? "▶ Riprendi" : "⏸ Pausa"}</button><div style="flex:1;font-size:12px;opacity:.85;align-self:center">Trascina il dito sul campo per correre. Il Campione calcia da solo.</div>`;
    B.querySelector("#asPause").onclick = () => { if (!S) return; S.phase = S.phase === "pause" ? "play" : S.phase === "play" ? "pause" : S.phase; lastT = now(); controls(); };
  }
  function lg() {
    if (!ui || !S) return; const al = S.allies.length ? " Con te: " + S.allies.map((a) => `<b>${esc(a.n)}</b> (${esc((POW[a.pow] || {}).n || a.pow)})`).join(", ") + "." : "";
    ui.lg.innerHTML = S.phase === "end" ? (S.practice ? "Prova finita: nulla conta." : S.win ? "La notte ha ancora un'ora, ma questo pezzo di stadio è vostro." : "Ti hanno circondato. Si può riprovare, coi poteri di partenza.")
      : S.phase === "pick" ? "Il gioco è fermo: tocca il potere che vuoi. Si sommano, livello dopo livello."
      : `Raccogli i <b>gettoni</b> gialli per salire di livello. ${S.boss ? "Allo scadere del tempo arriva il <b>capo</b>." : "Resisti fino allo scadere del tempo."}${al}`;
  }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); const n = now(), dt = clamp(n - lastT, 0, 0.05); lastT = n; if (!(tutC && tutC.open)) step(dt); if (ui && S) scene(ui.g, S, S.f + (S.phase !== "play" ? 0 : 0)); }
  function restart(practice) { const o = S.o; S = mk(o, practice); lastT = now(); hud(); controls(); lg(); }
  function close() {
    cancelAnimationFrame(raf); raf = 0; const st = S, o = st.o; detach(); ui.root.remove(); ui = null; S = null;
    try { window.__sagaCore && window.__sagaCore.endMatch(); } catch (e) {}
    const pk = {}; Object.keys(st.pk).forEach((k) => { if (st.pk[k]) pk[k] = st.pk[k]; });
    o.onDone && o.onDone({ win: !!st.win, a: st.kills, b: Math.floor(st.t), quit: false, data: { kills: st.kills, t: Math.floor(st.t), lv: st.lv, perks: pk, boss: !!st.bossDead, hp: Math.ceil(st.hero.hp), best: st.best } });
  }
  // tastiera
  const KM = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d", a: "l", d: "r", w: "u", s: "d", A: "l", D: "r", W: "u", S: "d" };
  const kd = (e) => { if (!S || !KM[e.key]) return; S.keys[KM[e.key]] = true; e.preventDefault(); }, ku = (e) => { if (!S || !KM[e.key]) return; S.keys[KM[e.key]] = false; };
  function detach() { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); }
  // ------------------------------------------------------------ spiegazione
  function demo(f, k) {
    const st = mk({ arena: "campo", mix: ["tifoso"] }, false); st.hero.x = WW / 2 + Math.sin(f / 40) * 30; st.hero.y = WH / 2 + Math.cos(f / 50) * 14;
    for (let i = 0; i < 9; i++) { const a = i * 0.7 + f / 90, d = 70 + (i % 3) * 22; st.foes.push({ tp: i % 4 === 3 ? "panzone" : "tifoso", F: i % 4 === 3 ? FOES.panzone : FOES.tifoso, x: st.hero.x + Math.cos(a) * d, y: st.hero.y + Math.sin(a) * d, hp: 2, max: 2, hit: 0, stun: 0, bob: i, note: 99, st: 0 }); }
    if (k >= 1) for (let i = 0; i < 14; i++) st.gems.push({ x: st.hero.x - 60 + (i * 37) % 120, y: st.hero.y - 40 + (i * 23) % 80, v: 1 });
    if (k === 2) { st.pk.sciarpa = 2; st.t = f / 60; st.phase = f % 200 < 90 ? "pick" : "play"; st.lv = 4; }
    if (f % 24 < 12 && st.foes[0]) st.balls.push({ x: st.hero.x + 8, y: st.hero.y - 4, tg: st.foes[0], t: 0, rb: 0, hitL: [] });
    st.stick = k === 0 ? { on: true, x0: 70, y0: 170, cx: 70 + Math.sin(f / 40) * 18, cy: 170 + Math.cos(f / 50) * 10 } : null; return st;
  }
  const PAGES = [
    { t: "Corri, il calcio è automatico", p: "<b>Trascina il dito</b> sul campo (o usa frecce/WASD): il Campione corre. Calcia <b>da solo</b> il pallone al tifoso più vicino. Tu pensa solo a non farti circondare.", draw: (g, f) => scene(g, demo(f, 0), f) },
    { t: "Gettoni e livelli", p: "I tifosi respinti lasciano <b>gettoni gialli</b>. Raccoglili: la barra in basso si riempie e sali di livello.", draw: (g, f) => scene(g, demo(f, 1), f) },
    { t: "Un potere su tre", p: "A ogni livello il gioco si ferma: scegli <b>1 potere su 3</b> (tiro a effetto, sciarpa che gira, fischietto, scarpini…). Si sommano. Allo scadere del tempo arriva il <b>capo</b>.", draw: (g, f) => scene(g, demo(f, 2), f) }
  ];
  function start(o) {
    cancelAnimationFrame(raf); if (ui) { detach(); ui.root.remove(); } ui = M.shell("asOv", "🧟 " + (o.title || "L'Assedio"), "#a3e635"); ui.root.style.background = "#050a12";
    (o.allies || []).forEach((a) => { if (a && a.id && M.img && !a.img) a.img = M.img(a.id); });
    S = mk(o, false); tutC = null; lastT = now(); ui.cv.style.height = "auto"; ui.cv.style.flex = "none";
    const pos = (ev) => { const r = ui.cv.getBoundingClientRect(); return [(ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * H]; };
    ui.cv.addEventListener("pointerdown", (ev) => { ev.preventDefault(); if (!S) return; const [x, y] = pos(ev); S.stick = { on: true, x0: x, y0: y, cx: x, cy: y, id: ev.pointerId }; try { ui.cv.setPointerCapture(ev.pointerId); } catch (e) {} });
    ui.cv.addEventListener("pointermove", (ev) => { if (!S || !S.stick || !S.stick.on) return; const [x, y] = pos(ev); S.stick.cx = x; S.stick.cy = y; });
    const up = () => { if (S && S.stick) S.stick.on = false; }; ui.cv.addEventListener("pointerup", up); ui.cv.addEventListener("pointercancel", up);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const openTut = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) { tutC = M.tut({ root: ui.root, key: "assedio", pages: PAGES, onClose: (pr) => { tutC = null; restart(!!pr); } }); } };
    ui.help.onclick = openTut;
    window.__assedio.state = {
      get phase() { return S && S.phase; }, get lv() { return S ? S.lv : 0; }, get kills() { return S ? S.kills : 0; }, get t() { return S ? S.t : 0; }, get hp() { return S ? S.hero.hp : 0; },
      get foes() { return S ? S.foes.length : 0; }, get boss() { const b = S && S.foes.find((e) => e.F.boss); return b ? [b.tp, b.hp, b.max] : null; }, get pick() { return S && S.pick ? S.pick.slice() : null; }, perks: () => (S ? Object.assign({}, S.pk) : {}),
      allies: () => (S ? S.allies.map((a) => [a.id, a.pow]) : []), hero: () => (S ? [S.hero.x, S.hero.y] : null), tut: () => !!(tutC && tutC.open),
      choose, xp: (v) => S && addXp(v), move: (dx, dy, sec) => { if (!S) return; S.keys = { l: dx < 0, r: dx > 0, u: dy < 0, d: dy > 0 }; let k = Math.round((sec || 0.5) / 0.016); while (k-- > 0 && S && S.phase === "play") step(0.016); if (S) S.keys = {}; },
      tick: (sec) => { if (!S) return; let k = Math.round((sec || 0) / 0.016); while (k-- > 0 && S && !S.ended) { if (S.phase === "pick") choose(0); step(0.016); } },
      god: () => { if (S) { S.hero.max = S.hero.hp = 9999; } }, toBoss: () => { if (S && S.boss && !S.bossOn) { S.t = S.time; return boss().tp; } return null; },
      finish: (win) => { if (tutC) { tutC.close(); tutC = null; } end(!!win); }
    };
    hud(); controls(); lg(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("assedio"))) openTut();
    return true;
  }
  window.__assedio = { start, FOES, PERKS, POW, ARENAS, state: null };
})();
