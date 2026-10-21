// js/vuota-inf.js - «INFILTRAZIONE» · il minigioco di Operazione Scatola Vuota (e del cabinato in Sala Giochi)
// Rompicapo furtivo a turni su griglia. Ogni tua mossa (passo, attesa, scatola, moneta) fa muovere le guardie di un passo.
// Le guardie vedono davanti a sé (3 caselle, a cono) e le telecamere in linea retta (5 caselle, ruotano). Se ti vedono: scoperto.
// 📦 Scatola: ti nascondi (non ti muovi) finché non ne esci; una guardia che ti finisce accanto e davanti sospetta. 🪙 Moneta: la lanci
// in una casella entro 5: le guardie vicine vanno a controllare, poi tornano al giro. ⏪ Riavvolgi: annulla l'ultima mossa (conta nelle stelle).
// Stelle: 1 = uscita; +1 se entro i turni «pari»; +1 senza riavvolgere. Livelli 1-8 (il racconto ne usa alcuni, il cabinato tutti).
// Opzioni: level (1-8), title, tutorial (false = niente spiegazione), onDone({win, level, turns, undo, stars}). Richiede js/mini.js.
// Test: window.__inf.eng (motore puro: mk, act, LV, solve), window.__inf.state.finish(win), pulsante #ifGo.
(function () {
  "use strict";
  if (window.__inf) return;
  const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
  // ------------------------------------------------------------ livelli
  // mappa: # muro, . pavimento, S partenza, X uscita, k tessera-chiave, D porta chiusa (si apre con la chiave)
  // g: guardie { r: [[x,y],…] giro (un solo punto = ferma), d: direzione iniziale (0 su,1 destra,2 giù,3 sinistra), dirs: [..] rotazioni se ferma, ev: ogni quanti turni }
  // c: telecamere { x, y, dirs: [..], ev }
  const LV = [
    { name: "Il molo", hint: "Raggiungi l'uscita (EXIT). La guardia fa avanti e indietro: dietro di lei sei al sicuro, davanti no.", par: 24, boxes: 0, coins: 0,
      map: ["###############", "#.........###X#", "#...........#.#", "#.............#", "#......#......#", "#......##..#..#", "#S.....#......#", "#.............#", "###############"],
      g: [{"r":[[7,3],[12,3]],"d":1}] },
    { name: "Il magazzino", hint: "Due guardie e pochi varchi. Ogni attesa fa muovere le guardie: sfrutta i loro giri.", par: 31, boxes: 0, coins: 0,
      map: ["###############", "#.....#.####..#", "#.......#.....#", "#.............#", "#...#.........#", "#...#....####.#", "#...#.###...#.#", "#S..#..###...X#", "###############"],
      g: [{"r":[[5,4],[5,7]],"d":2},{"r":[[2,3],[8,3]],"d":1}] },
    { name: "La scatola", hint: "📦 Nasconditi dove ti vedrebbero: nella scatola non ti vede nessuno (2 usi). Esci con la stessa mossa.", par: 33, boxes: 2, coins: 0,
      map: ["###############", "#..........#..#", "#..........#..#", "#S.....###.##.#", "#..###.....##.#", "#..#.#......#X#", "#....#...##...#", "#...#.........#", "###############"],
      g: [{"r":[[6,6],[6,7]],"d":2},{"r":[[6,2],[9,2]],"d":1},{"r":[[5,2]],"d":2,"dirs":[2,3,2,1],"ev":3}] },
    { name: "La moneta", hint: "🪙 Lancia una moneta in una casella entro 5: le guardie vicine vanno a controllare e tu passi (2 monete).", par: 22, boxes: 0, coins: 2,
      map: ["###############", "#..#......##..#", "#S...#..##....#", "#..#####...##.#", "#...##........#", "#......##..#..#", "#.##.....###.X#", "#..#.#........#", "###############"],
      g: [{"r":[[6,6],[6,7]],"d":2},{"r":[[9,7],[13,7]],"d":1},{"r":[[8,4],[13,4]],"d":1}] },
    { name: "La telecamera", hint: "Le telecamere 🔴 vedono in linea retta e ruotano. Contale: scatta quando guardano altrove.", par: 29, boxes: 1, coins: 1,
      map: ["###############", "#S#.......##..#", "#.#..........X#", "#.###.........#", "#..##.........#", "#.........#...#", "#...#.#.......#", "#.#...........#", "###############"],
      g: [{"r":[[8,7],[12,7]],"d":1},{"r":[[3,5]],"d":2,"dirs":[2,3,0,1],"ev":1}],
      c: [{"x":3,"y":7,"dirs":[0,0,3],"ev":2},{"x":11,"y":2,"dirs":[0,1,0],"ev":3}] },
    { name: "La tessera", hint: "Prendi la tessera 🔑 per aprire la porta D, poi raggiungi l'uscita.", par: 32, boxes: 1, coins: 1,
      map: ["###############", "#.k...###.....#", "#.....#.....#.#", "#.....#.......#", "#.#...##...#.X#", "#.#...##...#..#", "#.....#....##.#", "#S.#..D.......#", "###############"],
      g: [{"r":[[9,3],[13,3]],"d":1},{"r":[[10,3],[10,7]],"d":2}],
      c: [{"x":9,"y":4,"dirs":[2,0,3],"ev":3}] },
    { name: "Doppio turno", hint: "Tutto insieme: guardie, telecamere, porta. Prima la tessera, poi la fuga.", par: 32, boxes: 2, coins: 2,
      map: ["###############", "#.k..##.......#", "#.#####.......#", "#....##...#...#", "#.....#...#...#", "#..#..D...#...#", "#.....#...#..X#", "#S....##......#", "###############"],
      g: [{"r":[[12,2],[12,7]],"d":2},{"r":[[12,4],[12,7]],"d":2},{"r":[[11,6],[11,7]],"d":2}],
      c: [{"x":7,"y":1,"dirs":[0,3,1],"ev":3},{"x":9,"y":3,"dirs":[0,3,0],"ev":3},{"x":3,"y":3,"dirs":[1,1,2],"ev":2}] },
    { name: "Il Bastione", hint: "L'ultimo piano: pattuglie fitte, telecamere e una porta. Scatola, monete e pazienza.", par: 32, boxes: 2, coins: 2,
      map: ["###############", "#.k..##.......#", "#.#####.......#", "#....##...#...#", "#.....#...#...#", "#..#..D...#...#", "#.....#...#..X#", "#S....##......#", "###############"],
      g: [{"r":[[12,2],[12,7]],"d":2},{"r":[[12,4],[12,7]],"d":2},{"r":[[9,2],[12,2]],"d":1},{"r":[[12,4]],"d":0,"dirs":[0,1,0,3],"ev":2},{"r":[[8,5],[8,7]],"d":2},{"r":[[10,7]],"d":2,"dirs":[2,3,2,1],"ev":3}],
      c: [{"x":7,"y":1,"dirs":[0,3,1],"ev":3},{"x":3,"y":7,"dirs":[0,3,1],"ev":2}] },
  ];
  const parse = (lv) => { const w = lv.map[0].length, h = lv.map.length; let sx = 1, sy = 1, ex = 0, ey = 0, kx = -1, ky = -1; const wall = []; for (let y = 0; y < h; y++) { wall[y] = []; for (let x = 0; x < w; x++) { const c = lv.map[y][x]; wall[y][x] = c === "#" ? 1 : c === "D" ? 2 : 0; if (c === "S") { sx = x; sy = y; } if (c === "X") { ex = x; ey = y; } if (c === "k") { kx = x; ky = y; } } } return { w, h, wall, sx, sy, ex, ey, kx, ky }; };
  LV.forEach((lv) => (lv.P = parse(lv)));
  const solid = (lv, s, x, y) => { const P = lv.P; return x < 0 || y < 0 || x >= P.w || y >= P.h || P.wall[y][x] === 1 || (P.wall[y][x] === 2 && !s.key); };
  // ------------------------------------------------------------ motore puro
  function mk(lv) {
    const P = lv.P; return { px: P.sx, py: P.sy, hid: false, boxes: lv.boxes | 0, coins: lv.coins | 0, key: false, t: 0, st: "play", why: "", noise: null,
      gs: (lv.g || []).map((g) => ({ x: g.r[0][0], y: g.r[0][1], d: g.d | 0, i: 0, m: "p", tx: 0, ty: 0, w: 0 })) };
  }
  const clone = (s) => ({ px: s.px, py: s.py, hid: s.hid, boxes: s.boxes, coins: s.coins, key: s.key, t: s.t, st: s.st, why: s.why, noise: s.noise, gs: s.gs.map((g) => ({ x: g.x, y: g.y, d: g.d, i: g.i, m: g.m, tx: g.tx, ty: g.ty, w: g.w })) });
  function bfsDir(lv, s, x0, y0, tx, ty, max) {
    if (x0 === tx && y0 === ty) return { d: -1, n: 0 }; const P = lv.P, seen = new Map(), q = [[tx, ty, 0]]; seen.set(tx + "," + ty, 1);
    for (let h = 0; h < q.length; h++) {
      const [x, y, n] = q[h]; if (n >= (max || 40)) continue;
      for (let d = 0; d < 4; d++) { const nx = x + DX[d], ny = y + DY[d]; if (solid(lv, { key: false }, nx, ny) || seen.has(nx + "," + ny)) continue; if (nx === x0 && ny === y0) return { d: (d + 2) % 4, n: n + 1 }; seen.set(nx + "," + ny, 1); q.push([nx, ny, n + 1]); }
    }
    return { d: -1, n: 99 };
  }
  function camDir(c, t) { return c.dirs[Math.floor(t / (c.ev || 2)) % c.dirs.length]; }
  function visCells(lv, s, kind, x, y, d) {
    const out = [], reach = kind === "cam" ? 5 : 3;
    for (let k = 1; k <= reach; k++) {
      const cx = x + DX[d] * k, cy = y + DY[d] * k; if (solid(lv, { key: false }, cx, cy)) break; out.push([cx, cy]);
      if (kind === "g" && k >= 2) { const p = (d + 1) % 4; [1, -1].forEach((sg) => { const lx = cx + DX[p] * sg, ly = cy + DY[p] * sg; if (!solid(lv, { key: false }, lx, ly)) out.push([lx, ly]); }); }
    }
    return out;
  }
  function seenBy(lv, s) {
    for (const g of s.gs) { if (g.x === s.px && g.y === s.py) return "Una guardia ti è finita addosso."; }
    if (s.hid) { for (const g of s.gs) if (Math.abs(g.x - s.px) + Math.abs(g.y - s.py) === 1 && g.x + DX[g.d] === s.px && g.y + DY[g.d] === s.py) return "Una scatola che prima non c'era: la guardia sospetta."; return null; }
    for (const g of s.gs) if (visCells(lv, s, "g", g.x, g.y, g.d).some(([x, y]) => x === s.px && y === s.py)) return "Una guardia ti ha visto.";
    for (const c of lv.c || []) if (visCells(lv, s, "cam", c.x, c.y, camDir(c, s.t)).some(([x, y]) => x === s.px && y === s.py)) return "Una telecamera ti ha inquadrato.";
    return null;
  }
  function moveGuards(lv, s) {
    s.gs.forEach((g, gi) => {
      const def = lv.g[gi];
      if (g.m === "w") { g.w--; if (g.w <= 0) g.m = "r"; return; }
      if (g.m === "c" || g.m === "r") {
        const tx = g.m === "c" ? g.tx : def.r[g.i][0], ty = g.m === "c" ? g.ty : def.r[g.i][1], b = bfsDir(lv, s, g.x, g.y, tx, ty, 40);
        if (b.d >= 0) { g.d = b.d; g.x += DX[b.d]; g.y += DY[b.d]; }
        if (g.x === tx && g.y === ty) { if (g.m === "c") { g.m = "w"; g.w = 2; } else g.m = "p"; }
        return;
      }
      if (def.r.length === 1) { const dirs = def.dirs || [def.d], ev = def.ev || 2; g.d = dirs[Math.floor(s.t / ev) % dirs.length]; return; }
      let [tx, ty] = def.r[(g.i + 1) % def.r.length]; if (g.x === tx && g.y === ty) { g.i = (g.i + 1) % def.r.length; [tx, ty] = def.r[(g.i + 1) % def.r.length]; }
      let dd; if (g.x !== tx) dd = tx > g.x ? 1 : 3; else dd = ty > g.y ? 2 : 0; g.d = dd; g.x += DX[dd]; g.y += DY[dd]; if (g.x === tx && g.y === ty) g.i = (g.i + 1) % def.r.length;
    });
  }
  // a: {k:"move", d} | {k:"wait"} | {k:"box"} | {k:"coin", x, y}; restituisce il nuovo stato o null se la mossa non è valida
  function act(lv, s0, a) {
    if (s0.st !== "play") return null; const s = clone(s0); s.noise = null;
    if (a.k === "move") {
      if (s.hid) return null; const nx = s.px + DX[a.d], ny = s.py + DY[a.d]; if (solid(lv, s, nx, ny)) return null; s.px = nx; s.py = ny;
      if (lv.P.kx === nx && lv.P.ky === ny) s.key = true;
    } else if (a.k === "box") { if (s.hid) s.hid = false; else { if (s.boxes <= 0) return null; s.boxes--; s.hid = true; } }
    else if (a.k === "coin") {
      if (s.coins <= 0 || solid(lv, s, a.x, a.y) || Math.abs(a.x - s.px) + Math.abs(a.y - s.py) > 5) return null; s.coins--; s.noise = [a.x, a.y];
      s.gs.forEach((g) => { const b = bfsDir(lv, s, g.x, g.y, a.x, a.y, 9); if (b.n <= 8) { g.m = "c"; g.tx = a.x; g.ty = a.y; } });
    } else if (a.k !== "wait") return null;
    s.t++; moveGuards(lv, s); const why = seenBy(lv, s);
    if (why) { s.st = "caught"; s.why = why; return s; }
    if (!s.hid && s.px === lv.P.ex && s.py === lv.P.ey) s.st = "won";
    return s;
  }
  function stateKey(s) { return [s.px, s.py, s.hid ? 1 : 0, s.boxes, s.coins, s.key ? 1 : 0, s.t % 12, s.gs.map((g) => g.x + "." + g.y + "." + g.d + "." + g.i + g.m + g.w + (g.m === "c" ? g.tx + "_" + g.ty : "")).join("|")].join(","); }
  // risolutore (A*, per i test): restituisce la lista di mosse (o null). opt: { noBox, noCoin } per verificare che una meccanica serva davvero
  function solve(lv, max, opt) {
    opt = opt || {}; const s0 = mk(lv), P = lv.P, seen = new Set([stateKey(s0)]);
    if (opt.noBox) s0.boxes = 0; if (opt.noCoin) s0.coins = 0;
    const h = (s) => Math.abs(s.px - P.ex) + Math.abs(s.py - P.ey) + (P.kx >= 0 && !s.key ? Math.abs(s.px - P.kx) + Math.abs(s.py - P.ky) : 0);
    const H = []; const push = (it) => { H.push(it); let i = H.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (H[p][0] <= H[i][0]) break; [H[p], H[i]] = [H[i], H[p]]; i = p; } };
    const pop = () => { const top = H[0], last = H.pop(); if (H.length) { H[0] = last; let i = 0; for (;;) { let l = 2 * i + 1, r = l + 1, m = i; if (l < H.length && H[l][0] < H[m][0]) m = l; if (r < H.length && H[r][0] < H[m][0]) m = r; if (m === i) break; [H[m], H[i]] = [H[i], H[m]]; i = m; } } return top; };
    push([h(s0), 0, s0, null, null]); let nodes = 0; max = max || 200000;
    const cand = (s) => { const out = [], seenC = new Set(); (lv.g || []).forEach((g) => g.r.forEach(([x, y]) => { for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) { const cx = x + dx, cy = y + dy, k = cx + "," + cy; if (!seenC.has(k) && Math.abs(cx - s.px) + Math.abs(cy - s.py) <= 5 && !solid(lv, s, cx, cy)) { seenC.add(k); out.push({ k: "coin", x: cx, y: cy }); } } })); return out; };
    while (H.length && nodes++ < max) {
      const [, n, s, parent, a0] = pop();
      const acts = [{ k: "wait" }, { k: "move", d: 0 }, { k: "move", d: 1 }, { k: "move", d: 2 }, { k: "move", d: 3 }]; if (s.hid || s.boxes > 0) acts.push({ k: "box" }); if (s.coins > 0) acts.push(...cand(s));
      for (const a of acts) {
        const r = act(lv, s, a); if (!r || r.st === "caught") continue; const node = [0, n + 1, r, [s, parent, a0], a];
        if (r.st === "won") { const out = [a]; let q = [s, parent, a0]; while (q && q[2]) { out.unshift(q[2]); q = q[1]; } return out; }
        const k = stateKey(r); if (seen.has(k)) continue; seen.add(k); node[0] = h(r) * 1.4 + n + 1; push(node);
      }
    }
    return null;
  }
  const eng = { LV, mk, act, solve, visCells, camDir, solid, seenBy };
  window.__inf = { eng, state: null };
  if (!window.__mini) return;
  const M = window.__mini, W = M.W, H = 230, C = 24, OX = 10, OY = 7, esc = M.esc;
  const BKEY = "ali-di-rondine.vuota.inf";
  const best = () => { try { return JSON.parse(localStorage.getItem(BKEY) || "{}") || {}; } catch (e) { return {}; } };
  const saveBest = (n, stars) => { try { const b = best(); if (!b[n] || b[n] < stars) { b[n] = stars; localStorage.setItem(BKEY, JSON.stringify(b)); } } catch (e) {} };
  window.__inf.best = best;
  let S = null, ui = null, raf = 0, tutC = null, fxo = null, OPT = null;
  // ------------------------------------------------------------ disegno
  const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  function guardFig(g, x, y, d, alert, t) {
    const cx = x + C / 2, cy = y + C / 2; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(cx, cy + 8, 7, 3, 0, 0, 7); g.fill();
    px(g, cx - 5, cy - 2, 10, 10, "#3f4a3a"); px(g, cx - 5, cy + 2, 10, 2, "#2a3226"); g.fillStyle = "#d9a679"; g.beginPath(); g.arc(cx, cy - 5, 5, 0, 7); g.fill();
    px(g, cx - 6, cy - 10, 12, 4, "#1f2a1c"); px(g, cx - 7, cy - 7, 14, 2, "#1f2a1c");
    const ex = DX[d] * 3, ey = DY[d] * 2; px(g, cx + ex - 1, cy - 6 + ey, 2, 2, alert ? "#ff4a3a" : "#111"); px(g, cx + DX[d] * 7 - 1, cy + DY[d] * 5, 3, 3, "#111");
    if (alert) { g.font = "900 14px system-ui"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#000"; g.strokeText("!", cx, cy - 14); g.fillStyle = "#ff4a3a"; g.fillText("!", cx, cy - 14); }
  }
  function cam(g, x, y, d, on) {
    const cx = x + C / 2, cy = y + C / 2; px(g, cx - 6, cy - 6, 12, 12, "#1f2937"); px(g, cx - 4, cy - 4, 8, 8, "#374151"); g.fillStyle = on ? "#ff4a3a" : "#7f1d1d"; g.beginPath(); g.arc(cx + DX[d] * 3, cy + DY[d] * 3, 3, 0, 7); g.fill();
  }
  function hero(g, x, y, d, t, hid) {
    const cx = x + C / 2, cy = y + C / 2; g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(cx, cy + 8, 7, 3, 0, 0, 7); g.fill();
    if (hid) { px(g, cx - 9, cy - 8, 18, 17, "#a8794a"); px(g, cx - 9, cy - 8, 18, 4, "#c4935a"); px(g, cx - 1, cy - 8, 2, 17, "#8a5f38"); px(g, cx - 6, cy + 1, 12, 2, "#8a5f38"); g.fillStyle = "#111"; g.font = "700 6px system-ui"; g.textAlign = "center"; g.fillText("SCATOLA", cx, cy + 8); return; }
    px(g, cx - 5, cy - 2, 10, 10, "#1d4ed8"); px(g, cx - 5, cy + 2, 10, 2, "#1e3a8a"); g.fillStyle = "#e0ac7e"; g.beginPath(); g.arc(cx, cy - 5, 5, 0, 7); g.fill();
    px(g, cx - 5, cy - 10, 10, 3, "#2b1d14"); px(g, cx - 6, cy - 8, 2, 4, "#2b1d14"); px(g, cx + 4, cy - 8, 2, 4, "#2b1d14"); px(g, cx - 5 + DX[d] * 2, cy - 7, 10, 2, "#facc15");
  }
  function board(g, lv, s, o) {
    o = o || {}; const P = lv.P, f = o.f || 0;
    for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) {
      const sx = OX + x * C, sy = OY + y * C, w = P.wall[y][x];
      if (w === 1) { px(g, sx, sy, C, C, "#20262e"); px(g, sx, sy, C, 5, "#3a4452"); px(g, sx, sy + 5, C, 1, "#11151a"); if ((x * 3 + y) % 4 === 0) px(g, sx + 5, sy + 11, 6, 3, "#2c343e"); if ((x + y * 5) % 5 === 1) px(g, sx + 13, sy + 14, 4, 3, "#2c343e"); }
      else if (w === 2 && !s.key) { px(g, sx, sy, C, C, "#3b2f12"); px(g, sx + 2, sy + 2, C - 4, C - 4, "#7c5a14"); px(g, sx + 4, sy + 4, C - 8, C - 8, "#a47a1a"); px(g, sx + C / 2 - 2, sy + C / 2 - 3, 4, 6, "#1a1205"); }
      else { px(g, sx, sy, C, C, (x + y) % 2 ? "#2a323c" : "#262d36"); px(g, sx, sy + C - 1, C, 1, "rgba(0,0,0,.3)"); if ((x * 7 + y * 3) % 11 === 0) px(g, sx + 6, sy + 8, 8, 1, "rgba(255,255,255,.05)"); if ((x + y) % 7 === 3) { px(g, sx + 2, sy + C / 2, 4, 1, "rgba(250,204,21,.25)"); } }
    }
    const ex = OX + P.ex * C, ey = OY + P.ey * C; px(g, ex, ey, C, C, "#0f3d2a"); g.fillStyle = `rgba(110,231,183,${0.25 + 0.12 * Math.sin(f / 12)})`; g.fillRect(ex, ey, C, C); g.strokeStyle = "#6ee7b7"; g.lineWidth = 1.5; g.strokeRect(ex + 2, ey + 2, C - 4, C - 4); g.fillStyle = "#6ee7b7"; g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillText("EXIT", ex + C / 2, ey + C / 2 + 4);
    if (P.kx >= 0 && !s.key) { const kx = OX + P.kx * C + C / 2, ky = OY + P.ky * C + C / 2 + Math.sin(f / 14) * 1.5; px(g, kx - 7, ky - 4, 14, 9, "#facc15"); px(g, kx - 5, ky - 2, 5, 5, "#92400e"); px(g, kx + 1, ky - 1, 5, 1, "#92400e"); px(g, kx + 1, ky + 2, 4, 1, "#92400e"); }
    // coni di vista
    (s.gs || []).forEach((gd) => { const alert = o.alert; visCells(lv, s, "g", gd.x, gd.y, gd.d).forEach(([x, y]) => { g.fillStyle = alert ? "rgba(255,70,50,.34)" : "rgba(255,226,110,.20)"; g.fillRect(OX + x * C + 1, OY + y * C + 1, C - 2, C - 2); }); });
    (lv.c || []).forEach((c) => { visCells(lv, s, "cam", c.x, c.y, camDir(c, s.t)).forEach(([x, y]) => { g.fillStyle = "rgba(255,60,60,.24)"; g.fillRect(OX + x * C + 1, OY + y * C + 1, C - 2, C - 2); }); });
    (lv.c || []).forEach((c) => cam(g, OX + c.x * C, OY + c.y * C, camDir(c, s.t), true));
    if (o.coinRange && !s.hid) { for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) if (!solid(lv, s, x, y) && Math.abs(x - s.px) + Math.abs(y - s.py) <= 5) { g.fillStyle = "rgba(250,204,21,.16)"; g.fillRect(OX + x * C + 2, OY + y * C + 2, C - 4, C - 4); } }
    if (s.noise) { const r = (f % 30) / 30; g.strokeStyle = `rgba(250,204,21,${1 - r})`; g.lineWidth = 2; g.beginPath(); g.arc(OX + s.noise[0] * C + C / 2, OY + s.noise[1] * C + C / 2, 4 + r * 20, 0, 7); g.stroke(); }
    const lerp = (a, b, k) => a + (b - a) * k, k = o.k == null ? 1 : o.k;
    (s.gs || []).forEach((gd, i) => { const p = o.prev && o.prev.gs && o.prev.gs[i]; const gx = p ? lerp(p.x, gd.x, k) : gd.x, gy = p ? lerp(p.y, gd.y, k) : gd.y; guardFig(g, OX + gx * C, OY + gy * C, gd.d, s.st === "caught" || (o.alert), f); });
    if (!o.noHero) hero(g, OX + (o.prev ? lerp(o.prev.px, s.px, k) : s.px) * C, OY + (o.prev ? lerp(o.prev.py, s.py, k) : s.py) * C, S && S.face || 1, f, s.hid);
  }
  // ------------------------------------------------------------ spiegazione
  const DL = { a: null, b: null, c: null };
  const mini = (map, g0, c0, o) => { const lv = { map, g: g0, c: c0, boxes: 1, coins: 1, par: 9 }; lv.P = parse(lv); return { lv, s: mk(lv) }; };
  const PAGES = [
    { t: "Un passo, un turno", p: "Muoviti con i tasti ◀▲▼▶ (o scorri sul campo). <b>Ogni tua mossa fa muovere le guardie di un passo</b>: pensa, poi agisci. Il <b>cono giallo</b> è ciò che vedono: se ci entri sei scoperto. Raggiungi <b>EXIT</b>.", draw(g, f) {
      if (!DL.a) DL.a = mini(["#######", "#S....#", "#.....#", "#....X#", "#######"], [{ r: [[2, 2], [5, 2]], d: 1 }]); const d = DL.a, t = Math.floor(f / 26) % 14; let s = mk(d.lv); const path = [{ k: "move", d: 2 }, { k: "wait" }, { k: "wait" }, { k: "move", d: 1 }, { k: "move", d: 1 }, { k: "move", d: 1 }, { k: "move", d: 1 }, { k: "move", d: 1 }];
      for (let i = 0; i < Math.min(t, path.length); i++) { const r = act(d.lv, s, path[i]); if (r) s = r; } g.fillStyle = "#0b1020"; g.fillRect(0, 0, W, 230); g.save(); g.translate(60, 40); g.scale(1.1, 1.1); board(g, d.lv, s, { f, noHero: false }); g.restore();
    } },
    { t: "Scatola e moneta", p: "📦 <b>Scatola</b>: ti nascondi (non ti muovi) finché non esci: la guardia non ti vede, ma se ti finisce <b>accanto e davanti</b> sospetta. 🪙 <b>Moneta</b>: toccala, poi tocca una casella entro 5: le guardie vicine vanno a controllare.", draw(g, f) {
      if (!DL.b) DL.b = mini(["#######", "#S....#", "#.....#", "#....X#", "#######"], [{ r: [[2, 2], [5, 2]], d: 1 }]); const d = DL.b, t = Math.floor(f / 30) % 12; let s = mk(d.lv); const path = [{ k: "move", d: 2 }, { k: "box" }, { k: "wait" }, { k: "wait" }, { k: "wait" }, { k: "box" }, { k: "coin", x: 5, y: 1 }, { k: "move", d: 1 }, { k: "move", d: 1 }];
      for (let i = 0; i < Math.min(t, path.length); i++) { const r = act(d.lv, s, path[i]); if (r) s = r; } g.fillStyle = "#0b1020"; g.fillRect(0, 0, W, 230); g.save(); g.translate(60, 40); g.scale(1.1, 1.1); board(g, d.lv, s, { f }); g.restore();
    } },
    { t: "Telecamere, tessere, stelle", p: "Le <b>telecamere 🔴</b> vedono in linea retta e <b>ruotano</b>: scatta quando guardano altrove. La <b>tessera 🔑</b> apre la porta D. Stelle: ⭐ uscita, ⭐ entro i turni «pari», ⭐ senza <b>⏪ Riavvolgi</b> (annulla l'ultima mossa). Provalo con la Prova libera.", draw(g, f) {
      if (!DL.c) DL.c = mini(["#######", "#S...k#", "#.....#", "#..D.X#", "#######"], [], [{ x: 3, y: 1, dirs: [2, 1, 2, 3], ev: 2 }]); const d = DL.c, t = Math.floor(f / 24) % 10; let s = mk(d.lv); s.t = t * 2; g.fillStyle = "#0b1020"; g.fillRect(0, 0, W, 230); g.save(); g.translate(60, 40); g.scale(1.1, 1.1); board(g, d.lv, s, { f }); g.restore();
    } },
  ];
  // ------------------------------------------------------------ partita
  const LVL = () => LV[Math.max(0, Math.min(LV.length - 1, (S.level | 0) - 1))];
  function setLog(t) { if (ui) ui.lg.innerHTML = t; }
  function hud() {
    if (!ui || !S) return; const lv = LVL(); ui.hud.innerHTML = `<b>${S.practice ? "Prova libera" : "Liv. " + S.level + " · " + esc(lv.name)}</b><span>Turni ${S.s.t}${S.practice ? "" : "/" + lv.par}</span><span>📦 ${S.s.boxes}</span><span>🪙 ${S.s.coins}</span><span>${S.s.key ? "🔑" : lv.P.kx >= 0 ? "🔑 ?" : ""}</span><span>⏪ ${S.undo}</span>`;
  }
  function begin(level, practice) {
    S = { level, practice: !!practice, s: null, hist: [], undo: 0, over: false, win: false, targeting: false, prev: null, anim: 99, face: 1, stars: 0 };
    S.s = mk(LVL()); S.hist = []; S.prev = null; setLog(practice ? "Prova libera: nessuna conseguenza. Esci con il tasto ✕." : esc(LVL().hint)); hud(); controls();
  }
  function controls() {
    if (!ui || !S) return; const bt = ui.bt;
    if (S.over) { bt.innerHTML = `<button class="go" id="ifGo">${S.win ? "Continua ▸" : "Chiudi"}</button>`; bt.querySelector("#ifGo").onclick = () => close(S.win); return; }
    bt.innerHTML = `<button data-m="3" aria-label="Sinistra">◀</button><button data-m="0" aria-label="Su">▲</button><button data-m="2" aria-label="Giù">▼</button><button data-m="1" aria-label="Destra">▶</button><button id="ifW">⏳ Attendi</button><button id="ifB">📦 Scatola</button><button id="ifC">🪙 Moneta</button><button id="ifU">⏪ Riavvolgi</button>`;
    bt.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => doAct({ k: "move", d: +b.dataset.m })));
    bt.querySelector("#ifW").onclick = () => doAct({ k: "wait" }); bt.querySelector("#ifB").onclick = () => doAct({ k: "box" });
    bt.querySelector("#ifC").onclick = () => { if (!S || S.over || S.s.st !== "play") return; if (S.s.coins <= 0) return setLog("Niente monete."); S.targeting = !S.targeting; setLog(S.targeting ? "Tocca la casella dove lanciare la moneta (entro 5)." : esc(LVL().hint)); };
    bt.querySelector("#ifU").onclick = undo; refreshBtn();
  }
  function refreshBtn() { if (!ui || !S || S.over) return; const b = ui.bt; const q = (s) => b.querySelector(s); if (!q("#ifB")) return; q("#ifB").disabled = !(S.s.hid || S.s.boxes > 0); q("#ifC").disabled = S.s.coins <= 0 || S.s.hid; q("#ifU").disabled = !S.hist.length; q("#ifB").textContent = S.s.hid ? "📦 Esci" : "📦 Scatola"; b.querySelectorAll("[data-m]").forEach((x) => (x.disabled = S.s.hid)); }
  function doAct(a) {
    if (!S || S.over || (tutC && tutC.open)) return false; if (S.s.st === "caught") return false; const lv = LVL(); if (a.k === "move") S.face = a.d;
    const r = act(lv, S.s, a); if (!r) { setLog(a.k === "move" ? "Di là non si passa." : a.k === "box" ? "Niente scatole." : "Non si può."); return false; }
    S.hist.push(S.s); S.prev = S.s; S.anim = 0; S.s = r; S.targeting = false;
    if (a.k === "box") fxo.text(r.hid ? "📦" : "📦?", OX + r.px * C + 12, OY + r.py * C - 4, "#fbbf24");
    if (r.st === "caught") { setLog(`<b>Scoperto.</b> ${esc(r.why)} Riavvolgi l'ultima mossa o ricomincia.`); if (!S.practice) fxo.banner("SCOPERTO!", "#fca5a5"); fxo.shake(6); caughtBtns(); }
    else if (r.st === "won") win(); else setLog(esc(lv.hint));
    hud(); refreshBtn(); return true;
  }
  function caughtBtns() { if (!ui) return; ui.bt.innerHTML = `<button class="go" id="ifU2">⏪ Riavvolgi</button><button class="go" id="ifR">↺ Ricomincia</button><button id="ifQ">✕ Esci</button>`; ui.bt.querySelector("#ifU2").onclick = undo; ui.bt.querySelector("#ifR").onclick = () => { const n = S.level, p = S.practice, u = S.undo; begin(n, p); S.undo = u; hud(); }; ui.bt.querySelector("#ifQ").onclick = () => close(false); }
  function undo() { if (!S || S.over || !S.hist.length) return; S.s = S.hist.pop(); S.prev = null; S.undo++; S.targeting = false; setLog("Riavvolto di un turno."); controls(); hud(); }
  function win() {
    const lv = LVL(); S.over = true; S.win = true; const turns = S.s.t; S.stars = 1 + (turns <= lv.par ? 1 : 0) + (S.undo === 0 ? 1 : 0);
    if (!S.practice) saveBest(S.level, S.stars); fxo.banner(S.practice ? "PROVA OK" : "FUORI!", "#6ee7b7"); fxo.burst(OX + lv.P.ex * C + 12, OY + lv.P.ey * C + 12, 22, ["#6ee7b7", "#facc15", "#e0f2fe"]);
    setLog(S.practice ? "Prova riuscita. Esci quando vuoi." : `<b>Uscita raggiunta</b> in ${turns} turni (pari ${lv.par}). ${"⭐".repeat(S.stars)}${"☆".repeat(3 - S.stars)}`); hud(); controls();
    if (window.__inf.state) window.__inf.state.done = true;
  }
  function finish(w) { if (!S || S.over) return; if (tutC) tutC.close && tutC.close(); tutC = null; S.over = true; S.win = !!w; if (w) S.stars = Math.max(1, S.stars); hud(); controls(); }
  function close(w) {
    cancelAnimationFrame(raf); const o = OPT, r = { win: !!w && !(S && S.practice), level: S ? S.level : 0, turns: S ? S.s.t : 0, undo: S ? S.undo : 0, stars: S ? S.stars : 0 }; if (ui) ui.root.remove(); ui = null; const wasP = S && S.practice; S = null; tutC = null; window.__inf.state = null; if (!wasP && o && o.onDone) o.onDone(r); else if (wasP && o && o.onDone) o.onDone({ win: false, level: 0, turns: 0, undo: 0, stars: 0, practice: true });
  }
  function cellAt(ev) { const r = ui.cv.getBoundingClientRect(), x = Math.floor(((ev.clientX - r.left) * (W / r.width) - OX) / C), y = Math.floor(((ev.clientY - r.top) * (H / r.height) - OY) / C); return [x, y]; }
  function loop() {
    if (!ui || !S) return; const g = ui.g; g.setTransform(M.SS, 0, 0, M.SS, 0, 0); g.fillStyle = "#070b14"; g.fillRect(0, 0, W, H); const lv = LVL();
    S.anim = Math.min(1, S.anim + 0.14); const sh = fxo.sh > 0 ? (Math.random() - 0.5) * fxo.sh : 0; g.save(); g.translate(sh, 0);
    board(g, lv, S.s, { f: performance.now() / 16, prev: S.prev, k: S.prev ? S.anim : 1, alert: S.s.st === "caught", coinRange: S.targeting }); g.restore(); fxo.tick(); fxo.draw(g); raf = requestAnimationFrame(loop);
  }
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); OPT = o || {}; const lvn = Math.max(1, Math.min(LV.length, OPT.level | 0 || 1));
    ui = M.shell("ifOv", "🕵️ " + (OPT.title || "Infiltrazione"), "#fbbf24"); ui.root.style.background = "#070b14"; ui.cv.setAttribute("height", String(H * M.SS)); fxo = M.fx(); tutC = null;
    ui.cv.addEventListener("pointerdown", (e) => {
      if (!S || S.over || (tutC && tutC.open)) return; const [x, y] = cellAt(e);
      if (S.targeting) { doAct({ k: "coin", x, y }); return; }
      const s = S.s; if (s.hid) { doAct({ k: "box" }); return; } const dx = x - s.px, dy = y - s.py; if (Math.abs(dx) + Math.abs(dy) === 1) doAct({ k: "move", d: dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0 }); else if (!dx && !dy) doAct({ k: "wait" });
    });
    const key = (e) => { if (!S || !ui) return; const m = { ArrowUp: 0, w: 0, ArrowRight: 1, d: 1, ArrowDown: 2, s: 2, ArrowLeft: 3, a: 3 }[e.key]; if (m != null) { doAct({ k: "move", d: m }); e.preventDefault(); } else if (e.key === " ") { doAct({ k: "wait" }); e.preventDefault(); } else if (e.key === "b") doAct({ k: "box" }); else if (e.key === "z") undo(); };
    document.addEventListener("keydown", key); const rm = new MutationObserver(() => { if (!document.body.contains(ui && ui.root)) { document.removeEventListener("keydown", key); rm.disconnect(); } }); rm.observe(document.body, { childList: true });
    const quit = document.createElement("button"); quit.textContent = "✕"; quit.setAttribute("aria-label", "Esci"); quit.className = "hp"; quit.style.cssText = "margin-left:6px"; quit.onclick = () => close(false); ui.root.querySelector(".top").appendChild(quit);
    ui.help.onclick = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "inf", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) begin(1, true); } }); };
    window.__inf.state = { finish, act: doAct, undo, get s() { return S && S.s; }, get level() { return S && S.level; }, get over() { return S && S.over; }, get practice() { return S && S.practice; }, tut: () => !!(tutC && tutC.open) };
    begin(lvn, false); loop();
    if (OPT.tutorial !== false && !M.seen("inf")) tutC = M.tut({ root: ui.root, key: "inf", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) begin(1, true); } });
    return true;
  }
  window.__inf.start = start; window.__inf.count = LV.length;
})();
