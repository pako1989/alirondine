// js/tattica.js - «CAMPO DI GUERRA» · motore tattico a griglia isometrica (Suikoden / Fire Emblem) per le carte della Squadra dei Sogni.
// Turni a fasi: muovi, agisci (attacca / abilità di ruolo / attendi), poi tocca ai rivali. Terreni: prato, bosco (costa 2, -25% danni), collina (+20% danni), acqua e muri (bloccano).
// Ruoli: A Attaccante (tiro fino a 3 caselle), C Centrocampista (Regia: cura / Passaggio: ridà il turno a un alleato), D Difensore (Contrasto: ferma il bersaglio),
// P Portiere (Baluardo: protegge sé e gli alleati vicini), B Jolly (Ombra: dopo l'azione si muove ancora). Due carte legate (LINKS) vicine: +30% danni.
// Opzioni: title, level (1-3), map (0-2), squad (carte, default Squadra dei Sogni), enemy (nome), boss (bool), tutorial (false = niente spiegazione), onDone({win, turns, lost}).
// Test: window.__tattica.state() → { units, mode, turn, ... } · .api.{select, moveTo, act, target, endTurn, finish}.
(function () {
  "use strict";
  if (window.__tattica || !window.__mini) return;
  const M = window.__mini, W = M.W, H = M.H, esc = M.esc;
  const TW = 44, TH = 22, OX = 170, OY = 38, GW = 9, GH = 7;
  const S0 = () => window.__sogni;
  const safe = M.safe;
  const MAPS = [
    { name: "Prato dei Sassi", rows: ["......f..", "..f....h.", "....w.f..", ".f..w....", "....ww.f.", "..f....h.", "........."], ps: [[1, 5], [0, 4], [1, 3], [0, 2], [2, 6]], es: [[7, 1], [8, 2], [6, 0], [8, 4], [7, 3]] },
    { name: "Guado del Mulino", rows: [".....w...", "..f..w.h.", ".....w...", "..h.....f", ".....w...", ".f...w.f.", ".....w..."], ps: [[1, 5], [0, 4], [1, 3], [0, 2], [2, 6]], es: [[7, 1], [8, 2], [6, 0], [8, 4], [7, 3]] },
    { name: "Rovine del Fortino", rows: ["...#.....", ".f.#..f#.", "...#.h...", "....##...", ".h.....f.", "..#..#...", "...#....."], ps: [[1, 5], [0, 4], [1, 3], [0, 2], [2, 6]], es: [[7, 1], [8, 2], [6, 0], [8, 4], [7, 3]] }
  ];
  const ROLE = {
    A: { n: "Attaccante", mov: 4, rng: 3, atk: 1.0, sk: "🎯 Tiro", ic: "A", sd: "Colpisce da 2-3 caselle di distanza." },
    C: { n: "Centrocampista", mov: 3, rng: 1, atk: 0.8, sk: "🧠 Regia", ic: "C", sd: "Cura un alleato entro 2 caselle (+9) oppure ridà il turno a uno che ha già agito." },
    D: { n: "Difensore", mov: 3, rng: 1, atk: 1.0, sk: "🛡️ Contrasto", ic: "D", sd: "Colpisce e ferma il bersaglio per il suo prossimo turno." },
    P: { n: "Portiere", mov: 2, rng: 1, atk: 0.8, sk: "🧤 Baluardo", ic: "P", sd: "Tu e gli alleati vicini subite metà danni fino al prossimo turno." },
    B: { n: "Jolly", mov: 5, rng: 1, atk: 1.0, sk: "🌀 Ombra", ic: "J", sd: "Colpisce e poi si muove ancora di 2 caselle." }
  };
  const TERR = {
    ".": { c: ["#6fa650", "#65994a"], cost: 1 },
    f: { c: ["#4f8a46", "#467d3f"], cost: 2, def: 0.75, tree: 1 },
    h: { c: ["#9a8a54", "#8c7d4a"], cost: 1, up: 1 },
    w: { c: ["#3a78b8", "#3470ae"], block: 1, water: 1 },
    "#": { c: ["#7a6a5a", "#6e5e50"], block: 1, wall: 1 }
  };
  let S = null, ui = null, raf = 0, fxo = null, OPT = null, tutC = null;

  const key = (c, r) => c + "," + r;
  const tAt = (c, r) => (c < 0 || r < 0 || c >= GW || r >= GH ? null : TERR[S.map.rows[r][c]] || TERR["."]);
  const unitAt = (c, r) => S.units.find((u) => u.hp > 0 && u.c === c && u.r === r) || null;
  const dist = (a, b) => Math.abs(a.c - b.c) + Math.abs(a.r - b.r);
  const alive = (side) => S.units.filter((u) => u.hp > 0 && u.side === side);
  const pos = (c, r) => ({ x: OX + (c - r) * TW / 2, y: OY + (c + r) * TH / 2 - ((tAt(c, r) || {}).up ? 7 : (tAt(c, r) || {}).wall ? 12 : 0) });

  function eff(c) { const s = S0(); return s && s.eff ? s.eff(c) : { at: c.at || 60, df: c.df || 60, te: c.te || 60 }; }
  function mkUnit(c, side, idx, mp, ovrAdj, boss) {
    const e = c.eff || eff(c), role = ROLE[c.role] ? c.role : "A", R = ROLE[role];
    return { id: c.id, name: c.name || (S0() && S0().name ? S0().name(c.id) : c.id), role, side, c: mp[0], r: mp[1], hp: 0, max: Math.round(18 + e.df * 0.24 + e.te * 0.08 + (boss ? 18 : 0)), atk: e.at, def: e.df, mov: R.mov, rng: R.rng, saga: c.saga || "", moved: false, acted: false, stun: 0, guard: false, movLeft: 0, boss: !!boss, px: 0, py: 0, img: side === "m" ? M.img(c.id) : null, col: c.col, idx };
  }
  function buildEnemies(level, mp, name, boss) {
    const ovr = 52 + level * 9, roles = ["D", "A", "C", "A", "P"], names = ["Brando", "Cesco", "Dante", "Ilario", "Osvaldo", "Piero", "Rocco", "Sandro"];
    const n = Math.min(5, 3 + level), out = [];
    for (let i = 0; i < n; i++) {
      const isBoss = boss && i === 0, o = ovr + (isBoss ? 12 : (i % 3) * 2);
      const u = mkUnit({ id: "en_" + i, name: isBoss ? name || "Il Comandante" : names[(i * 3 + level) % names.length], role: isBoss ? "D" : roles[i % roles.length], eff: { at: o, df: o, te: o - 6 }, col: "#e11d48" }, "o", i, mp[i % mp.length], 0, isBoss);
      u.hp = u.max; out.push(u);
    }
    return out;
  }
  function mk(o) {
    const lv = Math.max(1, Math.min(3, o.level || 1)), mapN = o.map != null ? o.map % MAPS.length : (lv - 1) % MAPS.length, map = MAPS[mapN];
    let cards = o.squad;
    if (!cards) { const s = S0(); cards = s && s.squad ? s.squad(5).all : []; }
    if (!cards.length) cards = [{ id: "a", name: "Leo", role: "A", at: 70, df: 60, te: 65 }, { id: "b", name: "Tommy", role: "C", at: 60, df: 62, te: 66 }, { id: "c", name: "Dario", role: "D", at: 58, df: 74, te: 60 }, { id: "d", name: "Nico", role: "P", at: 40, df: 78, te: 60 }];
    cards = cards.slice(0, 5);
    const mine = cards.map((c, i) => { const u = mkUnit(c, "m", i, map.ps[i % map.ps.length]); u.hp = u.max; u.col = "#2563eb"; return u; });
    const foes = buildEnemies(lv, map.es, o.enemy, o.boss);
    S = { map, mapN, lv, units: mine.concat(foes), mode: "idle", sel: null, turn: 1, phase: "m", moveSet: null, tgtSet: null, tgtKind: null, busy: false, over: false, win: false, log: "", t: 0, flash: 0, links: (S0() && S0().LINKS) || [] };
    S.units.forEach((u) => { const p = pos(u.c, u.r); u.px = p.x; u.py = p.y; });
    log("Il campo di guerra è tuo. Tocca un tuo giocatore per muoverlo.");
  }

  // ---- regole ----
  function reach(u) {
    const budget = u.movLeft > 0 ? u.movLeft : u.mov, best = {}, q = [[u.c, u.r, 0]]; best[key(u.c, u.r)] = 0;
    while (q.length) {
      const [c, r, d] = q.shift();
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dc, dr]) => {
        const nc = c + dc, nr = r + dr, T = tAt(nc, nr); if (!T || T.block) return; const o = unitAt(nc, nr); if (o && o !== u) return;
        const nd = d + T.cost; if (nd > budget) return; const k = key(nc, nr); if (best[k] !== undefined && best[k] <= nd) return; best[k] = nd; q.push([nc, nr, nd]);
      });
    }
    return best;
  }
  function targetsOf(u, kind) {
    const out = [];
    S.units.forEach((v) => {
      if (v.hp <= 0) return; const d = dist(u, v);
      if (kind === "atk") { if (v.side !== u.side && d === 1) out.push(v); }
      else if (kind === "sk" && u.role === "A") { if (v.side !== u.side && d >= 2 && d <= 3) out.push(v); }
      else if (kind === "sk" && (u.role === "D" || u.role === "B")) { if (v.side !== u.side && d === 1) out.push(v); }
      else if (kind === "sk" && u.role === "C") { if (v.side === u.side && v !== u && d <= (v.acted ? 3 : 2) && (v.hp < v.max || v.acted)) out.push(v); }
    });
    return out;
  }
  function dmgCalc(a, b, mult) {
    let m = a.atk * 0.32 * (mult || 1) * 100 / (100 + b.def) * 1.7;
    if (tAt(a.c, a.r).up) m *= 1.2; if (tAt(b.c, b.r).def) m *= tAt(b.c, b.r).def;
    if (S.units.some((v) => v !== a && v.hp > 0 && v.side === a.side && dist(v, a) <= 1 && S.links.some(([x, y]) => (x === v.id && y === a.id) || (y === v.id && x === a.id)))) m *= 1.3;
    if (S.units.some((v) => v.hp > 0 && v.side === b.side && v.role === "P" && v.guard && dist(v, b) <= 1)) m *= 0.5;
    return Math.max(2, Math.round(m));
  }
  function hit(a, b, mult, tag) {
    const d = dmgCalc(a, b, mult); b.hp = Math.max(0, b.hp - d); const p = pos(b.c, b.r); fxo.text("-" + d, p.x, p.y - 18, a.side === "m" ? "#fde047" : "#fca5a5"); fxo.burst(p.x, p.y - 8, 8, a.side === "m" ? ["#fde047", "#fff"] : ["#fca5a5", "#fff"]); fxo.shake(2);
    log(`${a.name} colpisce ${b.name}: -${d}${tag ? " · " + tag : ""}.`);
    if (b.hp <= 0) { fxo.banner(b.side === "o" ? "KO!" : "CADUTO", b.side === "o" ? "#6ee7b7" : "#fca5a5"); log(`${b.name} è fuori gioco.`); }
    return d;
  }
  function checkEnd() {
    if (S.over) return true;
    const me = alive("m"), op = alive("o"), bossDead = S.units.some((u) => u.boss && u.hp <= 0);
    if (!op.length || bossDead) { finish(true); return true; }
    if (!me.length) { finish(false); return true; }
    return false;
  }
  function finish(win) {
    if (S.over) return; S.over = true; S.win = !!win; S.mode = "over"; S.sel = null; S.moveSet = S.tgtSet = null;
    fxo.banner(win ? "VITTORIA!" : "SCONFITTA", win ? "#fde047" : "#fca5a5");
    log(win ? "Vittoria! Il campo è vostro." : "La Compagnia è a terra. Si può riprovare.");
    controls(); hud();
  }

  // ---- azioni giocatore ----
  function select(u) {
    if (S.busy || S.over || S.phase !== "m" || !u || u.side !== "m" || u.hp <= 0) return false;
    if (u.acted && !(u.role === "B" && u.movLeft > 0 && !u.moved)) return false;
    S.sel = u; S.moveSet = u.moved && !(u.role === "B" && u.movLeft > 0) ? null : reach(u); S.mode = S.moveSet ? "move" : "act"; S.tgtSet = null; controls(); hud(); return true;
  }
  function moveTo(c, r) {
    const u = S.sel; if (!u || S.busy || !S.moveSet || S.moveSet[key(c, r)] === undefined) return false;
    u.c = c; u.r = r; if (u.movLeft > 0) { u.movLeft = 0; u.acted = true; u.moved = true; } u.moved = true; S.moveSet = null; S.mode = u.acted ? "idle" : "act"; if (u.acted) S.sel = null;
    controls(); hud(); autoEnd(); return true;
  }
  function stay() { const u = S.sel; if (!u) return; u.moved = true; S.moveSet = null; S.mode = "act"; controls(); hud(); }
  function act(kind) {
    const u = S.sel; if (!u || S.busy) return false;
    if (kind === "wait") { u.acted = true; u.moved = true; S.sel = null; S.mode = "idle"; S.moveSet = S.tgtSet = null; controls(); hud(); autoEnd(); return true; }
    if (kind === "sk" && u.role === "P") { u.guard = true; fxo.banner("BALUARDO", "#7dd3fc"); log(`${u.name} alza il Baluardo: gli alleati vicini subiscono metà danni.`); u.acted = true; S.sel = null; S.mode = "idle"; S.moveSet = S.tgtSet = null; controls(); hud(); autoEnd(); return true; }
    const list = targetsOf(u, kind); if (!list.length) { log("Nessun bersaglio a portata."); return false; }
    S.tgtKind = kind; S.tgtSet = list; S.mode = "target"; S.moveSet = null; controls(); hud(); return true;
  }
  function target(v) {
    const u = S.sel; if (!u || S.mode !== "target" || !S.tgtSet || !S.tgtSet.includes(v)) return false;
    const kind = S.tgtKind;
    if (kind === "sk" && u.role === "C") {
      if (v.acted) { v.acted = false; v.moved = false; v.movLeft = 0; const p = pos(v.c, v.r); fxo.text("TURNO!", p.x, p.y - 20, "#7dd3fc"); log(`${u.name} serve un Passaggio: ${v.name} può agire di nuovo.`); }
      else { v.hp = Math.min(v.max, v.hp + 9); const p = pos(v.c, v.r); fxo.text("+9", p.x, p.y - 20, "#6ee7b7"); fxo.burst(p.x, p.y - 8, 8, ["#6ee7b7", "#fff"]); log(`${u.name} cura ${v.name}.`); }
    } else {
      const mult = kind === "atk" ? ROLE[u.role].atk * 0.8 : ROLE[u.role].atk * (u.role === "D" ? 1.1 : 1), d = hit(u, v, mult, kind === "sk" && u.role === "D" ? "fermo" : "");
      if (kind === "sk" && u.role === "D" && v.hp > 0) v.stun = 1;
    }
    u.acted = true; S.tgtSet = null; S.tgtKind = null; S.moveSet = null; S.mode = "idle"; S.sel = null;
    if (u.role === "B" && u.hp > 0 && !u.shadowDone && !checkEnd()) { u.shadowDone = true; u.movLeft = 2; S.sel = u; S.moveSet = reach(u); S.mode = "move"; log("Ombra: puoi muoverti ancora."); controls(); hud(); return true; }
    if (checkEnd()) return true; controls(); hud(); autoEnd(); return true;
  }
  function cancel() {
    if (S.busy || S.over) return;
    if (S.mode === "target") { S.mode = "act"; S.tgtSet = null; } else if (S.mode === "move") { S.sel = null; S.mode = "idle"; S.moveSet = null; } else if (S.mode === "act") { S.sel = null; S.mode = "idle"; }
    controls(); hud();
  }
  function autoEnd() { if (S.over || S.phase !== "m") return; if (!alive("m").some((u) => !u.acted)) setTimeout(() => { if (S && !S.over && S.phase === "m") endTurn(); }, 450); }

  // ---- turno rivale ----
  function endTurn() {
    if (!S || S.over || S.busy || S.phase !== "m") return false;
    S.sel = null; S.moveSet = S.tgtSet = null; S.mode = "idle"; S.phase = "o"; S.busy = true; alive("m").forEach((u) => { u.guard = u.guard && false; });
    controls(); hud(); const q = alive("o").slice(); let i = 0;
    const next = () => {
      if (!S || S.over) return;
      if (i >= q.length) { S.turn++; S.phase = "m"; S.busy = false; S.units.forEach((u) => { if (u.side === "m") { u.moved = false; u.acted = false; u.movLeft = 0; u.shadowDone = false; } else u.guard = false; }); log(`Turno ${S.turn}. Tocca a voi.`); controls(); hud(); return; }
      const u = q[i++]; if (u.hp <= 0) return next();
      if (u.stun > 0) { u.stun = 0; log(`${u.name} è fermo, salta il turno.`); return setTimeout(next, 350); }
      enemyAct(u); if (checkEnd()) return; setTimeout(next, 650);
    };
    setTimeout(next, 400); return true;
  }
  function enemyAct(u) {
    const foes = alive("m"); if (!foes.length) return; const rs = reach(u); let best = null;
    Object.keys(rs).forEach((k) => {
      const [c, r] = k.split(",").map(Number); if (unitAt(c, r) && unitAt(c, r) !== u) return; const save = [u.c, u.r]; u.c = c; u.r = r;
      foes.forEach((f) => {
        const d = dist(u, f); let sc = -d * 1.5 + (tAt(c, r).def ? 2 : 0) + (tAt(c, r).up ? 2 : 0);
        if (d >= 1 && d <= u.rng) { const dm = dmgCalc(u, f, ROLE[u.role].atk); sc += 30 + dm * 1.2 + (dm >= f.hp ? 40 : 0) + (u.rng > 1 && d === u.rng ? 4 : 0) - (f.role === "P" ? 2 : 0); best = !best || sc > best.sc ? { sc, c, r, f, atk: true } : best; }
        else best = !best || sc > best.sc ? { sc, c, r, f, atk: false } : best;
      });
      u.c = save[0]; u.r = save[1];
    });
    if (!best) return; u.c = best.c; u.r = best.r;
    if (best.atk) hit(u, best.f, ROLE[u.role].atk * (u.role === "D" ? 1 : 1), "");
  }

  // ---- interfaccia ----
  function log(t) { if (!S) return; S.log = t; if (ui) ui.lg.textContent = t; }
  function hud() {
    if (!ui || !S) return; const me = alive("m"), op = alive("o"), u = S.sel;
    ui.hud.innerHTML = `<b>Turno ${S.turn}</b><span>${S.phase === "m" ? "Tocca a voi" : "Tocca ai rivali…"}</span><span>🟦 ${me.length}</span><span>🟥 ${op.length}</span>${u ? `<span><b>${esc(u.name)}</b> ${ROLE[u.role].n} · ${u.hp}/${u.max}</span>` : ""}`;
  }
  function controls() {
    if (!ui || !S) return; const bt = ui.bt, u = S.sel, R = u ? ROLE[u.role] : null;
    if (S.over) { bt.innerHTML = `<button class="go" id="taRe">↺ Riprova</button><button class="go" id="taEx">✔ Esci</button>`; bt.querySelector("#taRe").onclick = () => restart(); bt.querySelector("#taEx").onclick = () => close(); return; }
    const busy = S.busy || S.phase !== "m", can = (k) => !busy && u && S.mode !== "idle" && S.mode !== "move" && !!targetsOf(u, k).length;
    bt.innerHTML = `<button id="taAtk" ${can("atk") ? "" : "disabled"}>⚔️ Attacca</button><button id="taSk" ${u && !busy && (S.mode === "act") && (u.role === "P" || can("sk")) ? "" : "disabled"}>${R ? R.sk : "✨ Abilità"}</button><button id="taWait" ${u && !busy && S.mode !== "idle" ? "" : "disabled"}>${S.mode === "move" ? "✋ Resta qui" : "✋ Attendi"}</button><button id="taCan" ${busy || S.mode === "idle" ? "disabled" : ""}>↩ Annulla</button><button id="taEnd" ${busy ? "disabled" : ""}>⏭ Fine turno</button><button id="taQuit">✖ Esci</button>`;
    bt.querySelector("#taAtk").onclick = () => act("atk"); bt.querySelector("#taSk").onclick = () => act("sk");
    bt.querySelector("#taWait").onclick = () => (S.mode === "move" ? stay() : act("wait")); bt.querySelector("#taCan").onclick = cancel; bt.querySelector("#taEnd").onclick = () => endTurn(); bt.querySelector("#taQuit").onclick = () => { if (S) { S.over = true; } close(true); };
    const sk = bt.querySelector("#taSk"); if (R) sk.title = R.sd;
  }
  function pick(x, y) {
    let best = null;
    for (let c = 0; c < GW; c++) for (let r = 0; r < GH; r++) { const p = pos(c, r), dx = Math.abs(x - p.x) / (TW / 2), dy = Math.abs(y - (p.y + TH / 2)) / (TH / 2); if (dx + dy <= 1.02 && (!best || c + r > best.c + best.r)) best = { c, r }; }
    return best;
  }
  function onTap(e) {
    if (!S || S.over || S.busy || S.phase !== "m") return; const rc = ui.cv.getBoundingClientRect(), x = (e.clientX - rc.left) / rc.width * W, y = (e.clientY - rc.top) / rc.height * H, t = pick(x, y); if (!t) return;
    const v = unitAt(t.c, t.r);
    if (S.mode === "target") { if (v && S.tgtSet && S.tgtSet.includes(v)) target(v); else cancel(); return; }
    if (S.mode === "move") { if (S.moveSet && S.moveSet[key(t.c, t.r)] !== undefined && (!v || v === S.sel)) { if (v === S.sel) stay(); else moveTo(t.c, t.r); return; } if (v && v.side === "m") { select(v); return; } cancel(); return; }
    if (v && v.side === "m") { select(v); return; }
    if (S.mode === "act") cancel();
  }

  // ---- disegno ----
  function tile(g, c, r) {
    const T = tAt(c, r), p = pos(c, r), col = T.c[(c + r) & 1], h = T.up ? 7 : T.wall ? 12 : 0, cx = p.x, cy = p.y;
    if (h) { g.fillStyle = T.wall ? "#4a3f36" : "#6a5c36"; g.beginPath(); g.moveTo(cx - TW / 2, cy + TH / 2); g.lineTo(cx, cy + TH); g.lineTo(cx, cy + TH + h); g.lineTo(cx - TW / 2, cy + TH / 2 + h); g.fill(); g.fillStyle = T.wall ? "#3a3129" : "#54482a"; g.beginPath(); g.moveTo(cx + TW / 2, cy + TH / 2); g.lineTo(cx, cy + TH); g.lineTo(cx, cy + TH + h); g.lineTo(cx + TW / 2, cy + TH / 2 + h); g.fill(); }
    g.fillStyle = col; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + TW / 2, cy + TH / 2); g.lineTo(cx, cy + TH); g.lineTo(cx - TW / 2, cy + TH / 2); g.closePath(); g.fill();
    if (T.water) { g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; const o = Math.sin(S.t * 0.06 + c + r) * 3; g.beginPath(); g.moveTo(cx - 8 + o, cy + TH / 2); g.lineTo(cx + 2 + o, cy + TH / 2); g.moveTo(cx - 2 - o, cy + TH / 2 + 5); g.lineTo(cx + 8 - o, cy + TH / 2 + 5); g.stroke(); }
    if (T.tree) { [[-8, 4], [8, 6]].forEach(([dx, dy]) => { g.fillStyle = "#5b3a24"; g.fillRect(cx + dx - 1, cy + TH / 2 + dy - 3, 2, 5); g.fillStyle = "#2f6a35"; g.beginPath(); g.moveTo(cx + dx, cy + TH / 2 + dy - 15); g.lineTo(cx + dx + 7, cy + TH / 2 + dy - 2); g.lineTo(cx + dx - 7, cy + TH / 2 + dy - 2); g.fill(); g.fillStyle = "#3d8744"; g.beginPath(); g.moveTo(cx + dx, cy + TH / 2 + dy - 20); g.lineTo(cx + dx + 5, cy + TH / 2 + dy - 9); g.lineTo(cx + dx - 5, cy + TH / 2 + dy - 9); g.fill(); }); }
    if (T.wall) { g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - 10, cy + TH / 2); g.lineTo(cx + 10, cy + TH / 2); g.moveTo(cx, cy + 4); g.lineTo(cx, cy + TH / 2); g.stroke(); }
  }
  function overlay(g, c, r, fill, line) {
    const p = pos(c, r); g.fillStyle = fill; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + TW / 2, p.y + TH / 2); g.lineTo(p.x, p.y + TH); g.lineTo(p.x - TW / 2, p.y + TH / 2); g.closePath(); g.fill(); if (line) { g.strokeStyle = line; g.lineWidth = 1.5; g.stroke(); }
  }
  function drawUnit(g, u) {
    const tgt = pos(u.c, u.r); u.px += (tgt.x - u.px) * 0.25; u.py += (tgt.y - u.py) * 0.25; const x = u.px, y = u.py + TH / 2 - 4;
    if (u.hp <= 0) return;
    g.save(); if (u.side === "m" && u.acted && S.phase === "m") g.globalAlpha = 0.6;
    M.man(g, x, y, { s: 0.95, col: u.side === "m" ? u.col || "#2563eb" : "#be123c", img: u.img, skin: "#e0b890", num: ROLE[u.role].ic, ring: S.sel === u ? "#fde047" : u.boss ? "#f59e0b" : u.side === "m" ? "#e0f2fe" : "#fecaca", rw: S.sel === u ? 2.6 : 1.8 });
    g.restore();
    const bw = 22, by = y - 34; g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(x - bw / 2, by, bw, 4); g.fillStyle = u.hp / u.max > 0.5 ? "#4ade80" : u.hp / u.max > 0.25 ? "#fbbf24" : "#f87171"; g.fillRect(x - bw / 2 + 0.5, by + 0.5, (bw - 1) * u.hp / u.max, 3);
    g.font = "700 8px system-ui"; g.textAlign = "center"; g.fillStyle = "#fff"; if (u.stun) g.fillText("💤", x + 14, by + 6); if (u.guard) g.fillText("🛡️", x + 14, by + 6); if (u.boss) g.fillText("👑", x, by - 2);
  }
  function draw() {
    const g = ui.g; g.setTransform(M.SS, 0, 0, M.SS, 0, 0); S.t++;
    const sh = fxo.sh > 0 ? (Math.random() - 0.5) * fxo.sh : 0; g.save(); g.translate(sh, sh);
    const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#7ec0ee"); sky.addColorStop(0.55, "#cfe6f2"); sky.addColorStop(1, "#e8d9b0"); g.fillStyle = sky; g.fillRect(-4, -4, W + 8, H + 8);
    g.fillStyle = "#fff4c2"; g.beginPath(); g.arc(320, 34, 16, 0, 7); g.fill();
    [[40, 28, 26], [190, 18, 20], [280, 52, 24]].forEach(([cx, cy, s], i) => { const o = (S.t * 0.07 + i * 90) % (W + 100) - 50; g.fillStyle = "rgba(255,255,255,.75)"; g.beginPath(); g.ellipse((cx + o) % (W + 60) - 20, cy, s, s * 0.35, 0, 0, 7); g.ellipse((cx + o) % (W + 60) - 6, cy - 5, s * 0.6, s * 0.3, 0, 0, 7); g.fill(); });
    g.fillStyle = "#7d9a78"; g.beginPath(); g.moveTo(0, 90); [[40, 60], [90, 82], [150, 52], [220, 80], [290, 58], [340, 76], [W, 62]].forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(W, 140); g.lineTo(0, 140); g.fill();
    g.fillStyle = "#4a7a44"; g.fillRect(0, 120, W, H);
    const order = []; for (let s = 0; s < GW + GH - 1; s++) for (let c = 0; c < GW; c++) { const r = s - c; if (r >= 0 && r < GH) order.push([c, r]); }
    order.forEach(([c, r]) => {
      tile(g, c, r);
      if (S.moveSet && S.moveSet[key(c, r)] !== undefined && (!unitAt(c, r) || unitAt(c, r) === S.sel)) overlay(g, c, r, "rgba(56,189,248,.45)", "rgba(224,242,254,.9)");
      if (S.tgtSet && S.tgtSet.some((v) => v.c === c && v.r === r)) overlay(g, c, r, S.tgtKind === "sk" && S.sel && S.sel.role === "C" ? "rgba(74,222,128,.5)" : "rgba(244,63,94,.5)", "#fff");
      if (S.sel && S.sel.c === c && S.sel.r === r) overlay(g, c, r, "rgba(253,224,71,.35)", "#fde047");
      const u = unitAt(c, r); if (u) drawUnit(g, u);
    });
    fxo.tick(); fxo.draw(g); g.restore();
  }
  function loop() { if (!ui || !S) return; draw(); raf = requestAnimationFrame(loop); }
  const PAGES = [
    { t: "Muovi e colpisci", p: "Tocca un tuo giocatore: le caselle azzurre sono dove può andare (il bosco costa il doppio, acqua e muri bloccano). Poi <b>Attacca</b>, usa l'<b>abilità di ruolo</b> o <b>Attendi</b>.", draw(g, f) { g.fillStyle = "#6fa650"; g.fillRect(0, 0, W, H); for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(56,189,248,.5)"; g.fillRect(90 + i * 46, 100, 40, 30); } M.man(g, 90 + 20, 118, { s: 1.8, col: "#2563eb", ring: "#fde047" }); M.man(g, 90 + 4 * 46 + 22, 118 + Math.sin(f * 0.1) * 3, { s: 1.8, col: "#be123c" }); } },
    { t: "I ruoli", p: "<b>A</b> tira da lontano · <b>C</b> cura o ridà il turno · <b>D</b> ferma il bersaglio · <b>P</b> protegge i vicini · <b>J</b> si muove ancora dopo l'azione. Due carte legate vicine fanno +30% di danno.", draw(g, f) { g.fillStyle = "#1f3b2a"; g.fillRect(0, 0, W, H); ["A", "C", "D", "P", "J"].forEach((l, i) => { M.man(g, 50 + i * 70, 110 + Math.sin(f * 0.08 + i) * 4, { s: 1.7, col: "#2563eb", num: l, ring: "#e0f2fe" }); }); } },
    { t: "Vincere", p: "Metti fuori gioco tutti i rivali (o il Comandante 👑) prima che cadano i tuoi. Collina = +20% danni, bosco = -25% subiti. Quando hai agito con tutti il turno passa da solo.", draw(g, f) { g.fillStyle = "#4a7a44"; g.fillRect(0, 0, W, H); g.font = "900 60px system-ui"; g.textAlign = "center"; g.fillStyle = "#fde047"; g.fillText("👑", 190, 120 + Math.sin(f * 0.1) * 6); } }
  ];
  function restart() { mk(OPT); fxo = M.fx(); controls(); hud(); }
  function close(quit) {
    cancelAnimationFrame(raf); const o = OPT, r = { win: quit ? false : !!(S && S.win), turns: S ? S.turn : 0, lost: S ? S.units.filter((u) => u.side === "m" && u.hp <= 0).length : 0 };
    if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__tattica._s = null; o && o.onDone && o.onDone(r);
  }
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); OPT = o || {};
    ui = M.shell("taOv", "⚔️ " + (OPT.title || "Campo di Guerra") + (OPT.level ? " · Liv. " + OPT.level : ""), "#fbbf24"); ui.root.style.background = "#0a1420";
    mk(OPT); fxo = M.fx();
    ui.cv.addEventListener("pointerdown", (e) => { e.preventDefault(); onTap(e); });
    ui.help.onclick = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "tattica", pages: PAGES, onClose: () => { tutC = null; } }); };
    window.__tattica._s = true; controls(); hud(); log(S.log);
    if (OPT.tutorial !== false && !M.seen("tattica")) tutC = M.tut({ root: ui.root, key: "tattica", pages: PAGES, onClose: () => { tutC = null; } });
    raf = requestAnimationFrame(loop); return true;
  }
  // menu di scelta (Arena): livelli, boss, premi e salvataggio proprio
  const KEY = "ali-di-rondine.tattica";
  const rec = () => safe(() => JSON.parse(localStorage.getItem(KEY) || "{}"), {}) || {};
  function openMenu(back) {
    const old = document.getElementById("taMenu"); if (old) old.remove(); const r = rec(), w = r.w || {};
    const ov = document.createElement("div"); ov.id = "taMenu"; ov.className = "miniOv"; ov.style.setProperty("--ac", "#fbbf24"); ov.style.background = "#0a1420"; document.body.appendChild(ov);
    const mk2 = (lv, boss) => `<button class="go" data-lv="${lv}" data-boss="${boss ? 1 : 0}" style="width:100%;margin:5px 0;text-align:left;padding:10px 12px"><b>${boss ? "👑 Il Comandante" : "⚔️ Livello " + lv}</b><br><small>${esc(MAPS[(lv - 1) % MAPS.length].name)} · ${boss ? "boss con 18 PV in più, premio doppio" : "premio " + 10 * lv + " monete"} · vittorie: ${(w[lv + (boss ? "b" : "")] | 0)}</small></button>`;
    ov.innerHTML = `<div class="wr"><div class="top"><h3>⚔️ Campo di Guerra</h3></div><div class="lg" style="min-height:0">Battaglie tattiche a griglia con le carte della tua Squadra dei Sogni: muovi, usa il ruolo di ognuno e metti fuori gioco i rivali. Due carte legate vicine fanno più danni.</div>${mk2(1)}${mk2(2)}${mk2(3)}${mk2(3, true)}<div class="bt"><button id="taBack">◂ Indietro</button></div></div>`;
    ov.querySelector("#taBack").onclick = () => { ov.remove(); back && back(); };
    ov.querySelectorAll("[data-lv]").forEach((b) => (b.onclick = () => { const lv = +b.dataset.lv, boss = b.dataset.boss === "1"; ov.remove(); start({ level: lv, boss, enemy: boss ? "Il Comandante Brando" : undefined, title: boss ? "Il Comandante" : "Campo di Guerra", onDone: (res) => {
      const r2 = rec(); r2.w = r2.w || {}; r2.p = (r2.p | 0) + 1; let coins = 0;
      if (res.win) { const k = lv + (boss ? "b" : ""); r2.w[k] = (r2.w[k] | 0) + 1; coins = 10 * lv * (boss ? 2 : 1); safe(() => window.addCoins && window.addCoins(coins), 0); }
      safe(() => localStorage.setItem(KEY, JSON.stringify(r2)), 0);
      const sg = S0(); if (sg && sg.gainXp && sg.squad) safe(() => sg.gainXp(sg.squad(5).all.map((c) => c.id), !!res.win, false), 0);
      openMenu(back);
    } }); }));
  }
  window.__tattica = {
    start, open: openMenu, _s: null, ROLE, MAPS,
    state: () => (S ? { get units() { return S.units; }, get mode() { return S.mode; }, get turn() { return S.turn; }, get phase() { return S.phase; }, get over() { return S.over; }, get win() { return S.win; }, get sel() { return S.sel; }, get busy() { return S.busy; }, get moveSet() { return S.moveSet; } } : null),
    api: { select, moveTo, stay, act, target, endTurn, cancel, finish, reach, targetsOf, dmgCalc, pick, unitAt }
  };
})();
