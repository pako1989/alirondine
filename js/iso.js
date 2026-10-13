// js/iso.js - «CALCIO TATTICO ISOMETRICO» · la partita originale di «La Guerra dei Tre Ducati» (motore proprio, NON il kit di partita)
// Ispirata agli strategici a turni con il campo a rombi: il campo è una griglia isometrica (9 × 7) con i DISLIVELLI
// (terrazze, collinette, saline). Ogni giocatore ha la sua INIZIATIVA: la barra in alto dice chi muove adesso e chi dopo.
// Al tuo turno sposti il giocatore (salire costa di più, non si scavalcano due gradini) e poi scegli: passa, tira, contrasta
// o attendi (chi aspetta torna prima). L'ALTEZZA conta: dall'alto si tira e si passa meglio, il contrasto in discesa riesce di più.
// Le SPALLE contano: un contrasto alle spalle di chi ha palla riesce molto più spesso, di lato un po' di più.
// Grafica: diorama isometrico con fianchi delle terrazze, ombre morbide, luce calda e figurine con il numero.
// Uso: window.__iso.start({ title, us, usColor, hero:{ name, skin, hair }, mates:[{ name, skin, hair }], opp:{ name, color, players:[{ name, skin, hair }], keeper:{ name } },
//   terrain: "saline" | "vetro" | "ruggine", minutes, oppStyle, intro, winTitle, onDone })
(function () {
  "use strict";
  if (window.__iso) return;
  const W = 320, H = 220, GW = 9, GH = 7, TW = 34, TH = 17, HH = 8, OX = 143, OY = 50;
  const TERR = {
    saline: { top: ["#e8e4d8", "#dcd8cc"], top2: ["#f4f2ea", "#ecead8"], side: "#a8a090", sky: ["#bcd8f0", "#f0e8d8"], line: "rgba(120,110,90,.35)", map: ["000000000", "000110000", "001111000", "001121100", "000111000", "000010000", "000000000"] },
    vetro: { top: ["#4a9a6a", "#428e60"], top2: ["#6abaa0", "#5aae92"], side: "#2a6a6a", sky: ["#8ad0d8", "#e0f4f0"], line: "rgba(255,255,255,.25)", map: ["001100000", "001100110", "000000110", "011000000", "011000221", "000000221", "000000000"] },
    ruggine: { top: ["#8a7a4a", "#827244"], top2: ["#a86a4a", "#9a6040"], side: "#5a3a2a", sky: ["#d8a080", "#f0d0a0"], line: "rgba(255,230,200,.25)", map: ["000011000", "000122100", "100011000", "110000001", "100002011", "000001100", "000000000"] },
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  let STATE = null;
  function start(o) {
    if (document.querySelector(".isOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.82 : 1;
    const T = TERR[o.terrain] || TERR.saline, HM = T.map.map((r) => r.split("").map(Number));
    const hAt = (x, y) => (x >= 0 && x < GW && y >= 0 && y < GH ? HM[y][x] : 0);
    const hero = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14" }, o.hero || o.heroLook || {}), usCol = o.usColor || "#2a6ab8";
    const opp = Object.assign({ name: "Avversari", color: "#a83a2a", players: [], keeper: { name: "Il portiere" } }, o.opp || {});
    while (opp.players.length < 3) opp.players.push({ name: ["Il mediano", "Il terzino", "La punta"][opp.players.length] });
    const mates = (o.mates && o.mates.length ? o.mates : [{ name: "Il compagno" }, { name: "La compagna" }]).slice(0, 2); while (mates.length < 2) mates.push({ name: "Il compagno" });
    const k = (v) => Math.round(v * oppK);
    const mk = (side, p, i, st) => Object.assign({ side, p, n: side ? i + 7 : i === 0 ? 10 : i + 4, x: 0, y: 0, fx: side ? -1 : 1, fy: 0, ct: 0, dx: 0, dy: 0 }, st);
    const units = [
      mk(0, hero, 0, { mov: 4, sht: 9, pas: 8, tkl: 6, spd: 10 }), mk(0, mates[0], 1, { mov: 3, sht: 6, pas: 8, tkl: 7, spd: 9 }), mk(0, mates[1], 2, { mov: 4, sht: 7, pas: 6, tkl: 8, spd: 8 }),
      mk(1, opp.players[0], 0, { mov: 4, sht: k(8), pas: k(7), tkl: k(style === "difensiva" ? 8 : 6), spd: k(10) }), mk(1, opp.players[1], 1, { mov: 3, sht: k(6), pas: k(7), tkl: k(7), spd: k(9) }), mk(1, opp.players[2], 2, { mov: style === "pressing" ? 4 : 3, sht: k(6), pas: k(6), tkl: k(8), spd: k(8) }),
    ];
    const S = { o, a: 0, b: 0, min: 0, nMin: o.minutes || 90, per: (o.minutes || 90) / 40, phase: "intro", over: false, t: 0, units, ball: null, act: null, moved: false, reach: null, fx: null, fast: false,
      data: { turni: 0, passaggi: 0, contrasti: 0, alle_spalle: 0, tiri: 0, dall_alto: 0 } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "isOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="clock"></i><span class="q"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || hero.name; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__isAC = window.__isAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.innerHTML = b.l; if (b.cls) x.className = b.cls; x.disabled = !!b.dis; x.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!x.disabled && !S.over) b.fn(); }); p.appendChild(x); }); };
    const fx = (text, col) => { S.fx = { text, col: col || "#ffd23f", t: 0 }; };
    const holder = () => S.units.find((u) => u === S.ball);
    const at = (x, y) => S.units.find((u) => u.x === x && u.y === y);
    // ------------------------------------------------------------ posizioni, iniziativa
    function kickoff(side) {
      const L = [[1, 3], [2, 1], [2, 5]], Rr = [[7, 3], [6, 1], [6, 5]];
      S.units.forEach((u) => { const i = S.units.filter((v) => v.side === u.side).indexOf(u), p = (u.side ? Rr : L)[i]; u.x = p[0]; u.y = p[1]; u.fx = u.side ? -1 : 1; u.fy = 0; u.dx = u.x; u.dy = u.y; });
      const kick = S.units.filter((u) => u.side === side)[0]; kick.x = side ? 5 : 3; kick.y = 3; kick.dx = kick.x; kick.dy = kick.y; S.ball = kick;
    }
    function queue(n) { // chi muove dopo: simulazione dell'iniziativa
      const ct = S.units.map((u) => u.ct), out = []; let guard = 0;
      while (out.length < n && guard++ < 400) { const i = ct.findIndex((c) => c >= 100); if (i >= 0) { out.push(S.units[i]); ct[i] -= 100; continue; } S.units.forEach((u, j) => (ct[j] += u.spd)); }
      return out;
    }
    function next() {
      if (S.over) return; if (S.min >= S.nMin) return finish();
      let guard = 0; while (!S.units.some((u) => u.ct >= 100) && guard++ < 50) S.units.forEach((u) => (u.ct += u.spd));
      const u = S.units.filter((v) => v.ct >= 100).sort((a, b) => b.ct - a.ct || b.spd - a.spd)[0];
      S.act = u; S.moved = false; S.data.turni++; S.min += S.per; hudQ();
      if (u.side === 0) { S.phase = "move"; S.reach = reachable(u); ui(); }
      else { S.phase = "ai"; S.reach = null; msg(`${Math.round(S.min)}' · Tocca a <b>${esc(u.p.name)}</b> (${esc(opp.name)})…`); pad([]); setTimeout(() => ai(u), S.fast ? 0 : 520); }
    }
    function endTurn(waited) { const u = S.act; if (!u) return; u.ct -= waited && !S.moved ? 60 : 100; S.act = null; S.reach = null; setTimeout(next, S.fast ? 0 : 160); }
    // le caselle raggiungibili: salire costa 2, non si sale di due gradini, i giocatori bloccano
    function reachable(u) {
      const dist = { [u.x + "," + u.y]: 0 }, q = [[u.x, u.y]];
      while (q.length) { const [x, y] = q.shift(), d = dist[x + "," + y];
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ax, ay]) => { const nx = x + ax, ny = y + ay; if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) return; const dh = hAt(nx, ny) - hAt(x, y); if (Math.abs(dh) > 1) return; if (at(nx, ny)) return; const nd = d + (dh > 0 ? 2 : 1); if (nd > u.mov) return; const kk = nx + "," + ny; if (dist[kk] == null || dist[kk] > nd) { dist[kk] = nd; q.push([nx, ny]); } }); }
      return dist;
    }
    function moveTo(u, x, y) { const ddx = Math.sign(x - u.x), ddy = Math.sign(y - u.y); if (ddx || ddy) { u.fx = ddx; u.fy = ddx ? 0 : ddy; } u.x = x; u.y = y; S.moved = true; }
    // ------------------------------------------------------------ azioni
    const goalX = (u) => (u.side ? -1 : GW);
    const goalDist = (u) => Math.abs(goalX(u) - u.x) + Math.abs(u.y - 3) * 0.5;
    const canShoot = (u) => S.ball === u && goalDist(u) <= 4.5;
    const passRange = (u) => 4 + hAt(u.x, u.y);
    function blocker(a, b) { const n = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); for (let i = 1; i < n; i++) { const x = Math.round(a.x + ((b.x - a.x) * i) / n), y = Math.round(a.y + ((b.y - a.y) * i) / n), u = at(x, y); if (u && u.side !== a.side) return u; } return null; }
    function side(att, tgt) { const dx = att.x - tgt.x, dy = att.y - tgt.y, dot = dx * tgt.fx + dy * tgt.fy; return dot < 0 ? "spalle" : dot === 0 ? "fianco" : "fronte"; }
    function shoot(u) {
      if (!canShoot(u)) return; S.data.tiri++; const hh = hAt(u.x, u.y); if (hh > 0 && !u.side) S.data.dall_alto++;
      const p = Math.max(0.06, Math.min(0.88, 0.28 + u.sht * 0.04 - goalDist(u) * 0.09 + hh * 0.12)) * (u.side ? 1 : 1 / oppK), goal = R() < p;
      tone(goal ? 660 : 200, 0.4, goal ? "triangle" : "square", 0.06, goal ? 1320 : 120);
      S.shotAnim = { from: u, t: 0, goal };
      if (goal) { if (u.side) S.b++; else S.a++; fx(u.side ? "GOL…" : "GOOOL!", u.side ? "#ff6a5a" : "#ffd23f"); msg(`<b>${u.side ? "Gol di " + esc(u.p.name) : "GOL!"}</b> ${hh ? "Tiro dall'alto, dalla terrazza: imprendibile." : "Il portiere si tuffa tardi."}`); hudQ(); kickoff(u.side ? 0 : 1); }
      else { const kp = u.side ? "il vostro portiere" : opp.keeper.name; fx("PARATA!", u.side ? "#7ad87a" : "#ff8a7a"); msg(`<b>Parata!</b> ${esc(kp)} blocca e rilancia.`); const mates = S.units.filter((v) => v.side !== u.side).sort((a, b) => Math.abs(goalX(u) - a.x) - Math.abs(goalX(u) - b.x)); S.ball = mates[0]; }
      return true;
    }
    function pass(u, m) {
      if (S.ball !== u || cheb(u, m) > passRange(u) || m.side !== u.side) return false; S.data.passaggi += u.side ? 0 : 1;
      const b = blocker(u, m);
      if (b && R() < 0.62 - u.pas * 0.03 + 0.08) { S.ball = b; fx("INTERCETTATO!", "#ff8a7a"); tone(160, 0.3, "square", 0.04); msg(`<b>Intercettato!</b> ${esc(b.p.name)} si mette in mezzo.`); return true; }
      S.ball = m; tone(520, 0.12, "triangle", 0.04); msg(`Passaggio a <b>${esc(m.p.name)}</b>.`); return true;
    }
    function tackle(u, tgt) {
      if (S.ball !== tgt || cheb(u, tgt) > 1 || tgt.side === u.side) return false; if (!u.side) S.data.contrasti++;
      const sd = side(u, tgt), dh = hAt(u.x, u.y) - hAt(tgt.x, tgt.y), p = Math.max(0.1, Math.min(0.95, 0.38 + (u.tkl - tgt.pas) * 0.04 + (sd === "spalle" ? 0.32 : sd === "fianco" ? 0.15 : 0) + dh * 0.1));
      if (sd === "spalle" && !u.side) S.data.alle_spalle++;
      if (R() < p) { S.ball = u; fx(sd === "spalle" ? "ALLE SPALLE!" : "CONTRASTO!", u.side ? "#ff8a7a" : "#7ad87a"); tone(600, 0.2, "triangle", 0.05); msg(`<b>Palla rubata</b> ${sd === "spalle" ? "alle spalle" : sd === "fianco" ? "di fianco" : "di fronte"} a ${esc(tgt.p.name)}.`); }
      else { fx("SALTATO!", u.side ? "#7ad87a" : "#ff8a7a"); tone(200, 0.2, "square", 0.04); msg(`${esc(tgt.p.name)} protegge la palla: contrasto a vuoto${sd === "fronte" ? " (di fronte è difficile: prova alle spalle)" : ""}.`); }
      return true;
    }
    // ------------------------------------------------------------ comandi del tuo turno
    function ui() {
      const u = S.act; if (!u || u.side) return;
      const has = S.ball === u, hb = holder(), adj = hb && hb.side === 1 && cheb(u, hb) <= 1 ? hb : null;
      if (S.phase === "move") {
        msg(`${Math.round(S.min)}' · Tocca a <b>${esc(u.p.name)}</b>${has ? " (ha la palla)" : ""}. Tocca una casella <b>azzurra</b> per muoverti${hAt(u.x, u.y) ? ", sei in alto" : ""}. Le terrazze: salire costa due passi.`);
        const b = [{ l: "● Resta qui", fn: () => { S.phase = "act"; ui(); } }];
        if (has && canShoot(u)) b.push({ l: `🎯 Tira da qui<small>${hAt(u.x, u.y) ? "dall'alto: bonus" : "distanza " + goalDist(u).toFixed(1)}</small>`, cls: "hot", fn: () => doAct("shoot") });
        pad(b); return;
      }
      S.reach = null;
      msg(`<b>${esc(u.p.name)}</b>: ${has ? "passa, tira o attendi." : adj ? `<b>${esc(adj.p.name)}</b> è vicino con la palla: contrasto ${side(u, adj) === "spalle" ? "<b>alle spalle</b>" : side(u, adj) === "fianco" ? "di fianco" : "di fronte"}!` : "attendi (chi aspetta senza muoversi torna prima)."}`);
      const b = [];
      if (has) { S.units.filter((m) => m.side === 0 && m !== u).forEach((m) => b.push({ l: `➜ Passa a ${esc(m.p.name.split(" ")[0])}<small>${cheb(u, m) > passRange(u) ? "troppo lontano" : blocker(u, m) ? "c'è qualcuno in mezzo" : "linea libera"}</small>`, dis: cheb(u, m) > passRange(u), fn: () => doAct("pass", S.units.indexOf(m)) })); if (canShoot(u)) b.push({ l: `🎯 Tira<small>${hAt(u.x, u.y) ? "dall'alto: bonus" : "distanza " + goalDist(u).toFixed(1)}</small>`, cls: "hot", fn: () => doAct("shoot") }); }
      if (adj) b.push({ l: `⚔️ Contrasta<small>${side(u, adj)}</small>`, cls: "hot", fn: () => doAct("tackle") });
      b.push({ l: "⏳ Attendi", fn: () => doAct("wait") });
      pad(b);
    }
    function doMove(x, y) { const u = S.act; if (!u || u.side || S.phase !== "move" || !S.reach || S.reach[x + "," + y] == null) return false; moveTo(u, x, y); tone(400 + hAt(x, y) * 120, 0.08, "triangle", 0.03); S.phase = "act"; ui(); return true; }
    function doAct(kind, arg) {
      const u = S.act; if (!u || u.side || S.over) return false;
      let ok = true;
      if (kind === "shoot") ok = shoot(u); else if (kind === "pass") ok = pass(u, S.units[arg]); else if (kind === "tackle") { const hb = holder(); ok = hb ? tackle(u, hb) : false; }
      if (!ok) return false; pad([]); endTurn(kind === "wait"); return true;
    }
    // ------------------------------------------------------------ l'avversario
    function ai(u) {
      if (S.over || S.act !== u) return;
      const hb = holder(), reach = reachable(u), tiles = Object.keys(reach).map((s) => s.split(",").map(Number));
      const near = (x, y) => S.units.filter((v) => v.side !== u.side && Math.max(Math.abs(v.x - x), Math.abs(v.y - y)) <= 1).length;
      if (hb === u) {
        if (canShoot(u) && goalDist(u) <= 3.5) { shoot(u); return endTurn(); }
        const ahead = S.units.filter((m) => m.side === u.side && m !== u && m.x < u.x - 1 && cheb(u, m) <= passRange(u) && !blocker(u, m));
        if (ahead.length && R() < 0.45) { pass(u, ahead[0]); return endTurn(); }
        const best = tiles.map(([x, y]) => ({ x, y, s: x + Math.abs(y - 3) * 0.4 + near(x, y) * 1.6 - hAt(x, y) * 0.4 })).sort((a, b) => a.s - b.s)[0];
        if (best) moveTo(u, best.x, best.y);
        if (canShoot(u) && goalDist(u) <= 3) shoot(u); else msg(`${esc(u.p.name)} avanza con la palla.`);
        return endTurn();
      }
      if (hb && hb.side !== u.side) {
        // si avvicina a chi ha palla, preferendo le spalle (dietro = dalla parte opposta a dove guarda)
        const bx = hb.x - hb.fx, by = hb.y - hb.fy;
        const best = tiles.map(([x, y]) => ({ x, y, s: Math.max(Math.abs(x - hb.x), Math.abs(y - hb.y)) * 2 + Math.abs(x - bx) * 0.3 + Math.abs(y - by) * 0.3 - (style === "pressing" ? 0.3 : 0) })).filter((t) => !(t.x === hb.x && t.y === hb.y)).sort((a, b) => a.s - b.s)[0];
        if (best && !(style === "difensiva" && best.x < 3 && u !== S.units[5])) moveTo(u, best.x, best.y);
        if (cheb(u, hb) <= 1) { tackle(u, hb); return endTurn(); }
        msg(`${esc(u.p.name)} si avvicina a ${esc(hb.p.name)}.`); return endTurn();
      }
      // la palla ce l'ha un compagno: si smarca verso la vostra porta
      const best = tiles.map(([x, y]) => ({ x, y, s: x * 0.7 + near(x, y) * 1.2 + Math.abs(y - (u.n % 2 ? 1 : 5)) * 0.3 })).sort((a, b) => a.s - b.s)[0];
      if (best) moveTo(u, best.x, best.y); msg(`${esc(u.p.name)} si smarca.`); return endTurn(true);
    }
    // ------------------------------------------------------------ disegno: diorama isometrico
    const sx = (x, y) => OX + (x - y) * (TW / 2), sy = (x, y, h) => OY + (x + y) * (TH / 2) - h * HH;
    function diamond(x, y, h, fill, stroke) { const X = sx(x, y), Y = sy(x, y, h); g.beginPath(); g.moveTo(X, Y); g.lineTo(X + TW / 2, Y + TH / 2); g.lineTo(X, Y + TH); g.lineTo(X - TW / 2, Y + TH / 2); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1; g.stroke(); } }
    function tile(x, y) {
      const h = hAt(x, y), X = sx(x, y), Y = sy(x, y, h);
      if (h > 0) { g.fillStyle = T.side; g.beginPath(); g.moveTo(X - TW / 2, Y + TH / 2); g.lineTo(X, Y + TH); g.lineTo(X, Y + TH + h * HH); g.lineTo(X - TW / 2, Y + TH / 2 + h * HH); g.fill(); g.fillStyle = "rgba(0,0,0,.22)"; g.beginPath(); g.moveTo(X + TW / 2, Y + TH / 2); g.lineTo(X, Y + TH); g.lineTo(X, Y + TH + h * HH); g.lineTo(X + TW / 2, Y + TH / 2 + h * HH); g.fill(); g.fillStyle = T.side; g.globalAlpha = 0.8; g.fill(); g.globalAlpha = 1; }
      const top = h ? T.top2 : T.top; diamond(x, y, h, top[(x + y) % 2], T.line);
      if (S.reach && S.reach[x + "," + y] != null && S.phase === "move") diamond(x, y, h, `rgba(90,170,255,${0.32 + 0.12 * Math.sin(S.t / 8)})`, "#9ad0ff");
      if (o.terrain === "saline" && (x * 7 + y * 3) % 5 === 0) { g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(X - 3, Y + 6, 2, 1); g.fillRect(X + 2, Y + 9, 1, 1); }
      if (o.terrain === "vetro" && h > 0) { g.fillStyle = `rgba(255,255,255,${0.15 + 0.1 * Math.sin(S.t / 20 + x)})`; g.fillRect(X - 6, Y + 5, 6, 1); }
    }
    function goal(xg) { const top = [sx(xg, 2), sy(xg, 2, 0)], bot = [sx(xg, 5), sy(xg, 5, 0)]; g.strokeStyle = "#fff"; g.lineWidth = 2; g.beginPath(); g.moveTo(top[0], top[1] + TH / 2); g.lineTo(top[0], top[1] + TH / 2 - 16); g.lineTo(bot[0], bot[1] - 16 + TH / 2); g.lineTo(bot[0], bot[1] + TH / 2); g.stroke(); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; for (let i = 1; i < 6; i++) { const p = i / 6; g.beginPath(); g.moveTo(top[0] + (bot[0] - top[0]) * p, top[1] + (bot[1] - top[1]) * p + TH / 2 - 16); g.lineTo(top[0] + (bot[0] - top[0]) * p, top[1] + (bot[1] - top[1]) * p + TH / 2); g.stroke(); } }
    function fig(u) {
      u.dx += (u.x - u.dx) * 0.25; u.dy += (u.y - u.dy) * 0.25;
      const hh = hAt(Math.round(u.dx), Math.round(u.dy)), X = sx(u.dx, u.dy), Y = sy(u.dx, u.dy, hh) + TH / 2, col = u.side ? opp.color : usCol, act = S.act === u, bob = act ? Math.sin(S.t / 6) * 1.5 : 0;
      g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(X, Y + 2, 7, 3, 0, 0, 7); g.fill();
      g.fillStyle = col; g.fillRect(X - 4, Y - 14 + bob, 8, 10); g.fillStyle = "#2a2a2a"; g.fillRect(X - 4, Y - 4 + bob, 3, 5); g.fillRect(X + 1, Y - 4 + bob, 3, 5);
      g.fillStyle = u.p.skin || "#e0b890"; g.beginPath(); g.arc(X, Y - 18 + bob, 4.5, 0, 7); g.fill(); g.fillStyle = u.p.hair || "#2a2a2a"; g.beginPath(); g.arc(X, Y - 20 + bob, 4.5, Math.PI, 0); g.fill();
      g.fillStyle = "#fff"; g.font = "800 6px system-ui"; g.textAlign = "center"; g.fillText(u.n, X, Y - 7 + bob);
      g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.moveTo(X + u.fx * 8 - u.fy * 0, Y - 2 + u.fy * 3); g.lineTo(X + u.fx * 5 - u.fy * 2, Y - 3 + u.fy * 1); g.lineTo(X + u.fx * 5 + u.fy * 2, Y - 1 + u.fy * 1); g.fill();
      if (act) { g.fillStyle = "#ffd23f"; g.beginPath(); g.moveTo(X - 4, Y - 32 + bob); g.lineTo(X + 4, Y - 32 + bob); g.lineTo(X, Y - 27 + bob); g.fill(); }
      if (S.ball === u) { g.fillStyle = "#fff"; g.beginPath(); g.arc(X + 5, Y, 2.6, 0, 7); g.fill(); g.fillStyle = "#222"; g.fillRect(X + 4, Y - 1, 2, 2); }
    }
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0);
      const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, T.sky[0]); sk.addColorStop(1, T.sky[1]); g.fillStyle = sk; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 5; i++) { const x = ((i * 83 + S.t * 0.15) % (W + 80)) - 40; g.fillStyle = "rgba(255,255,255,.5)"; g.beginPath(); g.ellipse(x, 16 + i * 6, 22, 5, 0, 0, 7); g.fill(); }
      goal(-1);
      const order = []; for (let s = 0; s < GW + GH; s++) for (let y = 0; y < GH; y++) { const x = s - y; if (x >= 0 && x < GW) order.push([x, y]); }
      order.forEach(([x, y]) => { tile(x, y); S.units.filter((u) => Math.round(u.dx) === x && Math.round(u.dy) === y).forEach(fig); });
      goal(GW);
      if (S.shotAnim) { const A = S.shotAnim; A.t++; const p = Math.min(1, A.t / 26), f = A.from, x0 = sx(f.x, f.y), y0 = sy(f.x, f.y, hAt(f.x, f.y)), gx = f.side ? sx(-1, 3.5) : sx(GW, 3.5), gy = sy(f.side ? -1 : GW, 3.5, 0) - 4; g.fillStyle = "#fff"; g.beginPath(); g.arc(x0 + (gx - x0) * p, y0 + (gy - y0) * p - Math.sin(p * Math.PI) * 20, 3, 0, 7); g.fill(); if (A.t > 30) S.shotAnim = null; }
      // luce calda del diorama: vignetta e bagliore
      const vg = g.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 220); vg.addColorStop(0, "rgba(255,230,180,0)"); vg.addColorStop(1, "rgba(30,20,10,.35)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      if (S.fx) { const F = S.fx; F.t++; const a = Math.max(0, 1 - F.t / 50); g.font = "900 24px Georgia, serif"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = `rgba(20,14,8,${a})`; g.strokeText(F.text, W / 2, 40); g.globalAlpha = a; g.fillStyle = F.col; g.fillText(F.text, W / 2, 40); g.globalAlpha = 1; if (F.t > 50) S.fx = null; }
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    function hudQ() { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".clock").textContent = `${Math.min(S.nMin, Math.round(S.min))}'`; el.querySelector(".q").innerHTML = queue(6).map((u, i) => `<b class="${u.side ? "o" : "u"}${i === 0 && S.act ? " now" : ""}">${esc(u.p.name.split(" ")[0])}</b>`).join(""); }
    // tocco sul campo: la casella sotto il dito (dall'alto in basso, la prima che contiene il punto)
    cv.addEventListener("pointerdown", (e) => {
      if (S.phase !== "move") return; const r = cv.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
      for (let s = GW + GH - 2; s >= 0; s--) for (let y = GH - 1; y >= 0; y--) { const x = s - y; if (x < 0 || x >= GW) continue; const h = hAt(x, y), X = sx(x, y), Y = sy(x, y, h) + TH / 2; if (Math.abs(px - X) / (TW / 2) + Math.abs(py - Y) / (TH / 2) <= 1) { doMove(x, y); return; } }
    });
    // ------------------------------------------------------------ inizio e fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA SUL CAMPO!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Contrasti ${S.data.contrasti} (alle spalle ${S.data.alle_spalle}) · passaggi ${S.data.passaggi} · tiri ${S.data.tiri} (dall'alto ${S.data.dall_alto})</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.move = doMove; S.doAct = doAct; S.stay = () => { if (S.phase === "move" && S.act && !S.act.side) { S.phase = "act"; ui(); } }; S.reachOf = () => S.reach; S.hAt = hAt;
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    kickoff(0); hudQ();
    card(o.title || "Calcio Tattico", `${o.intro || ""}<p>Il campo è a rombi, con terrazze e collinette. Muove chi ha più <b>iniziativa</b> (la fila in alto). Al tuo turno: tocca una casella <b>azzurra</b> per muoverti, poi passa, tira o contrasta.</p><p>L'<b>altezza</b> aiuta tiri e passaggi; il contrasto <b>alle spalle</b> di chi ha palla riesce quasi sempre. Chi <b>attende</b> senza muoversi torna prima.</p>`, "Schierati ▸", () => next());
    loop();
    return true;
  }
  function css() {
    if (document.getElementById("isCss")) return; const st = document.createElement("style"); st.id = "isCss";
    st.textContent = `.isOv{position:fixed;inset:0;z-index:300;background:#1a140e;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:Georgia,serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#f4ead8;overflow:auto}
.isOv .hud{width:min(100%,440px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #c8a060;border-radius:4px;background:#2a1e14;padding:4px 10px;font:700 12px Georgia,serif}
.isOv .hud .n0{color:var(--us);filter:brightness(1.6)}.isOv .hud .n1{text-align:right;color:var(--opp);filter:brightness(1.6)}.isOv .hud .sc{font:900 22px Georgia,serif;color:#ffd27a}
.isOv .bar{width:min(100%,440px);display:flex;gap:6px;align-items:center;font:700 11px system-ui}.isOv .bar i{font-style:normal;color:#ffd27a}.isOv .q{display:flex;gap:3px;flex-wrap:wrap}.isOv .q b{padding:2px 5px;border-radius:3px;font-size:10px;background:#3a2c1e}.isOv .q b.u{border-left:3px solid var(--us)}.isOv .q b.o{border-left:3px solid var(--opp)}.isOv .q b.now{background:#c8a060;color:#1a140e}
.isOv canvas{width:min(100%,440px,calc((100vh - 340px) * 1.45));height:auto;aspect-ratio:320/220;flex:none;border-radius:4px;border:2px solid #c8a060}
.isOv .msg{width:min(100%,440px);min-height:36px;font-size:13px;line-height:1.4}.isOv .msg b{color:#ffd27a}
.isOv .pad{width:min(100%,440px);display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:6px}
.isOv button{min-height:44px;border-radius:4px;border:1px solid #c8a060;background:#3a2c1e;color:#f4ead8;font:700 13px Georgia,serif;cursor:pointer;padding:5px}.isOv button small{display:block;font:500 10px system-ui;opacity:.8;margin-top:2px}.isOv button:disabled{opacity:.35}.isOv button.hot{background:#8a3a1e}
.isOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px}
.isOv .ov{position:absolute;inset:0;background:rgba(20,14,8,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.isOv .card{max-width:440px;width:100%;border:2px solid #c8a060;border-radius:6px;background:#f4ead8;color:#2a1e14;padding:14px;box-shadow:0 0 0 4px #2a1e14,0 0 0 6px #c8a060}.isOv .card h3{margin:0 0 8px;font:900 22px Georgia,serif;color:#8a3a1e}.isOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.isOv .card .big{font:900 34px Georgia,serif}
.isOv .card .goB{width:100%;margin-top:10px;background:#8a3a1e;color:#f4ead8;border-color:#8a3a1e;font-size:15px;min-height:50px}`;
    document.head.appendChild(st);
  }
  window.__iso = { start, TERR, get state() { return STATE; } };
})();
