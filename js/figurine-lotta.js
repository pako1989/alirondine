// js/figurine-lotta.js - «LOTTA DI FIGURE» · motore a turni 3 contro 3 per «Cacciatori di Figurine» (e per il cabinato in Sala Giochi)
// Ogni figura ha un tipo (campo, aria, ombra, cuore). Triangolo: aria batte campo, campo batte ombra, ombra batte aria (×1.5; al contrario ×0.67). Il cuore è neutro e cura.
// Ogni turno: una mossa (Colpo normale illimitato, Speciale del proprio tipo con 3 usi) oppure un cambio. Vince chi mette KO tutte le figure avversarie.
// Arena a schermo: figure-figurina con ritratto, mosse animate per tipo (foglie, vento, ombre, cuori), barre vita, scritte «SUPEREFFICACE!». I pulsanti mostrano ▲/▼ contro il nemico in campo.
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (1 contro 1 di 4 turni, senza conseguenze); il «?» la riapre. Richiede js/mini.js.
// Opzioni: team [{id,n,icon,type,hp,atk,def,lv,moves:[[nome,potenza,tipizzata]]}], foe [...], beats {tipo: tipoBattuto}, title, tutorial (false = niente spiegazione), onDone({win, ko}).
// Test: window.__lotta.state.finish(true|false) · pulsante #fgGo.
(function () {
  "use strict";
  if (window.__lotta) return;
  const M = window.__mini, W = M.W, H = M.H, esc = M.esc;
  const BEATS = { aria: "campo", campo: "ombra", ombra: "aria" };
  const TI = { campo: "🌿", aria: "🌬️", ombra: "🌑", cuore: "💗" };
  const TC = { campo: ["#16a34a", "#bbf7d0"], aria: ["#0ea5e9", "#e0f2fe"], ombra: ["#7c3aed", "#ddd6fe"], cuore: ["#ec4899", "#fbcfe8"] };
  const POS = { p: { x: 100, y: 150 }, f: { x: 280, y: 84 } };
  let S = null, ui = null, raf = 0, tutC = null, fxo = null;

  const mk = (u) => ({ id: u.id, n: u.n, icon: u.icon || "🃏", type: u.type || "campo", max: Math.max(8, u.hp | 0 || 22), hp: Math.max(8, u.hp | 0 || 22), sh: Math.max(8, u.hp | 0 || 22), atk: u.atk | 0 || 7, def: u.def | 0 || 4, lv: u.lv || 1, moves: (u.moves && u.moves.length ? u.moves : [["Colpo", 6, 0], ["Speciale", 8, 1]]).map((m) => ({ n: m[0], pow: m[1], typed: !!m[2], heal: m[3] === "heal", pp: m[2] || m[3] ? 3 : 99 })) });
  const alive = (a) => a.filter((u) => u.hp > 0);
  function mult(att, def) { const b = S.beats; if (b[att] === def) return 1.5; if (b[def] === att) return 0.67; return 1; }
  function hit(a, d, m) {
    if (m.heal) { const h = Math.round(a.max * 0.4), before = a.hp; a.hp = Math.min(a.max, a.hp + h); return { heal: true, dm: a.hp - before, k: 1, msg: `${a.n} si cura (+${a.hp - before}).` }; }
    const k = m.typed ? mult(a.type, d.type) : 1, dm = Math.max(2, Math.round(((a.atk + (a.lv - 1)) * m.pow / 6 - d.def / 3) * k));
    d.hp = Math.max(0, d.hp - dm);
    return { heal: false, dm, k, msg: `${a.n} usa ${m.n}: ${dm} danni${k > 1 ? " (superefficace!)" : k < 1 ? " (poco efficace)" : ""}${d.hp ? "" : `. ${d.n} è KO!`}` };
  }
  function foeMove(f, d) {
    const ms = f.moves.filter((m) => m.pp > 0); if (f.hp < f.max * 0.3) { const h = ms.find((m) => m.heal); if (h && Math.random() < 0.6) return h; }
    const best = ms.filter((m) => !m.heal).sort((x, y) => (y.typed ? mult(f.type, d.type) : 1) * y.pow - (x.typed ? mult(f.type, d.type) : 1) * x.pow)[0];
    return Math.random() < 0.75 ? best || ms[0] : ms[Math.floor(Math.random() * ms.length)];
  }
  const beater = (type) => Object.keys(S.beats).find((k) => S.beats[k] === type);

  // ------------------------------------------------------------ grafica
  function bg(g, f) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#241447"); gr.addColorStop(0.55, "#3a1f63"); gr.addColorStop(1, "#1a1030"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) { const x = (i * 97 + 20) % W, y = (i * 53) % 120, a = 0.25 + 0.25 * Math.sin(f * 0.04 + i); g.fillStyle = "rgba(255,255,255," + a + ")"; g.fillRect(x, y, 1.6, 1.6); }
    [["f", "#4c2d83"], ["p", "#5b3597"]].forEach(([s, c]) => { const p = POS[s]; g.fillStyle = c; g.beginPath(); g.ellipse(p.x, p.y + 38, 62, 13, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 1.5; g.stroke(); });
  }
  // figura-figurina. o: {dx, dy, alpha, rot, flash, s, side}
  function figure(g, u, x, y, o) {
    o = o || {}; const col = TC[u.type] || TC.campo, s = o.s == null ? 1 : o.s; if (s <= 0.02) return;
    g.save(); g.translate(x + (o.dx || 0), y + (o.dy || 0)); g.rotate(o.rot || 0); g.scale(s, s); g.globalAlpha = o.alpha == null ? 1 : o.alpha;
    g.fillStyle = "#fef3c7"; g.strokeStyle = col[0]; g.lineWidth = 3.5; g.beginPath(); g.roundRect(-27, -35, 54, 70, 7); g.fill(); g.stroke();
    g.fillStyle = col[1]; g.fillRect(-23, -31, 46, 46);
    g.save(); g.beginPath(); g.rect(-23, -31, 46, 46); g.clip(); const im = M.img(u.id);
    if (im && im.complete && im.naturalWidth) g.drawImage(im, -23, -31, 46, 46); else { g.fillStyle = col[0]; g.globalAlpha *= 0.18; g.fillRect(-23, -31, 46, 46); g.globalAlpha = o.alpha == null ? 1 : o.alpha; g.font = "30px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(u.icon, 0, -8); g.textBaseline = "alphabetic"; }
    g.restore();
    g.fillStyle = col[0]; g.beginPath(); g.arc(-17, -25, 8, 0, 7); g.fill(); g.font = "11px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText(TI[u.type] || "", -17, -25); g.textBaseline = "alphabetic";
    g.fillStyle = "#1f2937"; g.font = "800 9px system-ui"; g.textAlign = "center"; g.fillText(u.n.length > 11 ? u.n.slice(0, 10) + "…" : u.n, 0, 26); g.font = "700 7px system-ui"; g.fillStyle = col[0]; g.fillText("Liv. " + u.lv, 0, 32);
    if (o.flash) { g.globalAlpha = o.flash; g.fillStyle = "#fff"; g.beginPath(); g.roundRect(-27, -35, 54, 70, 7); g.fill(); }
    g.restore();
  }
  function bar(g, x, y, w, v, max) { const p = Math.max(0, Math.min(1, v / max)); g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(x, y, w, 7); g.fillStyle = p > 0.5 ? "#4ade80" : p > 0.25 ? "#facc15" : "#ef4444"; g.fillRect(x, y, w * p, 7); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.strokeRect(x, y, w, 7); }
  function panel(g, u, arr, x, y, mine) {
    g.fillStyle = "rgba(15,8,35,.78)"; g.strokeStyle = mine ? "#fbbf24" : "#a78bfa"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x, y, 150, 40, 8); g.fill(); g.stroke();
    g.fillStyle = "#fff"; g.font = "800 11px system-ui"; g.textAlign = "left"; g.fillText((TI[u.type] || "") + " " + u.n, x + 7, y + 14); g.fillStyle = "#c4b5fd"; g.font = "700 9px system-ui"; g.textAlign = "right"; g.fillText("Liv. " + u.lv, x + 143, y + 14);
    bar(g, x + 7, y + 19, 136, u.sh, u.max); g.fillStyle = "#e9d5ff"; g.font = "700 9px system-ui"; g.textAlign = "left"; g.fillText(Math.max(0, Math.round(u.sh)) + "/" + u.max, x + 7, y + 36);
    arr.forEach((q, i) => { g.globalAlpha = q.hp > 0 ? 1 : 0.25; g.font = "11px serif"; g.textAlign = "center"; g.fillText(q.icon, x + 112 + i * 14, y + 36); g.globalAlpha = 1; });
  }
  function shot(g, type, kind, a, b, p) { // proiettile da a a b, p 0..1
    const x = a.x + (b.x - a.x) * p, y = a.y + (b.y - a.y) * p - Math.sin(p * Math.PI) * 14, c = TC[type] || TC.campo, big = kind === "t";
    g.save(); g.translate(x, y);
    if (kind !== "t") { g.rotate(p * 8); g.fillStyle = "#fff"; g.strokeStyle = "#f59e0b"; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 5 : 11, an = (i / 8) * 6.28; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); } g.closePath(); g.fill(); g.stroke(); }
    else if (type === "campo") { for (let i = 0; i < 4; i++) { g.save(); g.rotate(p * 9 + i * 1.57); g.translate(9, 0); g.fillStyle = i % 2 ? c[0] : c[1]; g.beginPath(); g.ellipse(0, 0, 8, 3.5, 0.5, 0, 7); g.fill(); g.restore(); } }
    else if (type === "aria") { g.strokeStyle = c[1]; g.lineWidth = 3; g.lineCap = "round"; for (let i = 0; i < 3; i++) { g.globalAlpha = 1 - i * 0.28; g.beginPath(); g.arc(-i * 8, 0, 9 + i * 3, -1.2, 1.2); g.stroke(); } g.globalAlpha = 1; }
    else if (type === "ombra") { for (let i = 3; i >= 0; i--) { g.globalAlpha = 0.22 + (3 - i) * 0.2; g.fillStyle = i % 2 ? c[0] : "#1e1b4b"; g.beginPath(); g.arc(-i * 6, 0, 10 - i, 0, 7); g.fill(); } g.globalAlpha = 1; g.fillStyle = c[1]; g.beginPath(); g.arc(2, -2, 3, 0, 7); g.fill(); }
    else { g.fillStyle = c[0]; g.font = "22px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("💗", 0, 0); g.textBaseline = "alphabetic"; }
    g.restore(); return big;
  }

  // ------------------------------------------------------------ coda animazioni
  // evento: {k:"atk"|"heal"|"in"|"ko", side, ui (indice figura), msg, ...} · le cifre in S sono già aggiornate: a video le barre (sh) seguono l'evento.
  function dur(e) { return e.k === "atk" ? 62 : e.k === "heal" ? 46 : 32; }
  function startEv(e) {
    e.t = 0; S.log = e.msg || S.log; if (e.k === "in") { if (e.side === "p") S.vp = e.ui; else S.vf = e.ui; }
    if (e.k === "in") fxo.burst(POS[e.side].x, POS[e.side].y, 14, ["#fff", "#fde68a", "#c4b5fd"]);
    hud();
  }
  function stepEv(e) {
    e.t++; const pa = POS[e.side], pd = POS[e.side === "p" ? "f" : "p"];
    if (e.k === "atk" && e.t === 34) { const d = e.def; d.sh = e.hpAfter; const c = TC[e.type] || TC.campo; fxo.burst(pd.x, pd.y, e.kind === "t" ? 24 : 12, e.kind === "t" ? [c[0], c[1], "#fff"] : ["#fff", "#fde68a"]); fxo.text("-" + e.dm, pd.x, pd.y - 30, e.k2 > 1 ? "#fde047" : "#fff"); fxo.shake(e.k2 > 1 ? 7 : 4); if (e.k2 > 1) fxo.banner("SUPEREFFICACE!", "#fde047"); else if (e.k2 < 1) fxo.text("poco efficace", pd.x, pd.y - 48, "#c4b5fd"); }
    if (e.k === "heal" && e.t === 20) { e.att.sh = e.hpAfter; fxo.burst(pa.x, pa.y, 18, ["#4ade80", "#bbf7d0", "#fff"]); fxo.text("+" + e.dm, pa.x, pa.y - 30, "#86efac"); }
    if (e.k === "ko" && e.t === 1) { fxo.burst(pa.x, pa.y, 22, ["#94a3b8", "#fff"]); fxo.text("KO!", pa.x, pa.y - 34, "#fca5a5"); }
    return e.t >= dur(e);
  }
  function pump() {
    if (!S) return; if (S.cur && S.cur.t >= dur(S.cur)) S.cur = null;
    if (!S.cur && S.q.length) { S.cur = S.q.shift(); startEv(S.cur); }
    if (S.cur) { if (stepEv(S.cur)) { S.cur = null; } }
    if (!S.cur && !S.q.length && S.busy) { S.busy = false; if (S.endPending) { S.endPending(); S.endPending = null; } hud(); controls(); }
  }
  function drawFig(g, side, ev) {
    const idx = side === "p" ? S.vp : S.vf, arr = side === "p" ? S.team : S.foe, u = arr[idx], p = POS[side], f = S.f; if (!u) return;
    const o = { dy: Math.sin(f * 0.06 + (side === "p" ? 0 : 2)) * 2, s: 1, alpha: 1 }, dir = side === "p" ? 1 : -1;
    if (u.sh <= 0 && u.hp <= 0 && !(ev && ev.k === "ko" && ev.side === side && ev.t < 30)) { o.alpha = 0; }
    if (ev && ev.side === side) {
      if (ev.k === "atk") { const t = ev.t; if (t < 14) o.dx = -dir * 6 * (t / 14); else if (t < 28) o.dx = dir * 34 * ((t - 14) / 14) - dir * 6 * (1 - (t - 14) / 14); else o.dx = dir * 34 * Math.max(0, 1 - (t - 28) / 18); }
      if (ev.k === "in") { o.s = Math.min(1, ev.t / 14); }
      if (ev.k === "ko") { const t = ev.t / 32; o.alpha = 1 - t; o.rot = dir * -0.5 * t; o.dy += 24 * t; }
      if (ev.k === "heal") o.flash = 0;
    }
    if (ev && ev.k === "atk" && ev.side !== side && ev.t >= 34 && ev.t < 52) { const t = ev.t - 34; o.dx = (o.dx || 0) + Math.sin(t * 1.8) * 3; o.flash = t < 5 ? 0.7 - t * 0.1 : 0; }
    if (o.alpha > 0) figure(g, u, p.x, p.y, o);
  }
  function scene(g, f, ev) {
    bg(g, f); drawFig(g, "f", ev); drawFig(g, "p", ev);
    if (ev && ev.k === "atk" && ev.t >= 14 && ev.t < 34) shot(g, ev.type, ev.kind, POS[ev.side], POS[ev.side === "p" ? "f" : "p"], (ev.t - 14) / 20);
    if (ev && ev.k === "atk" && ev.t >= 8 && ev.t < 16) { const c = TC[ev.type]; g.strokeStyle = ev.kind === "t" ? c[0] : "#fff"; g.lineWidth = 2; g.beginPath(); g.arc(POS[ev.side].x, POS[ev.side].y, 30 + (ev.t - 8) * 3, 0, 7); g.stroke(); }
  }

  // ------------------------------------------------------------ spiegazione
  const SAMPLE = (id, n, icon, type) => ({ id, n, icon, type, max: 20, hp: 20, sh: 20, lv: 3 });
  const PAGES = [
    { t: "Il triangolo dei tipi", p: "Ogni figura ha un <b>tipo</b>. <b>🌬️ Aria</b> batte <b>🌿 Campo</b>, che batte <b>🌑 Ombra</b>, che batte <b>🌬️ Aria</b>: danni ×1,5. Al contrario ×0,67. Il <b>💗 Cuore</b> è neutro e può curare.", draw(g, f) {
      bg(g, f); const N = { aria: [190, 40], campo: [90, 160], ombra: [290, 160] }; const arrow = (a, b, k) => { const A = N[a], B = N[b], dx = B[0] - A[0], dy = B[1] - A[1], d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d, x1 = A[0] + ux * 30, y1 = A[1] + uy * 30, x2 = B[0] - ux * 30, y2 = B[1] - uy * 30; g.strokeStyle = k ? "#fde047" : "rgba(255,255,255,.3)"; g.lineWidth = k ? 4 : 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.fillStyle = g.strokeStyle; g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2 - ux * 9 - uy * 5, y2 - uy * 9 + ux * 5); g.lineTo(x2 - ux * 9 + uy * 5, y2 - uy * 9 - ux * 5); g.closePath(); g.fill(); };
      const hot = Math.floor(f / 60) % 3, pairs = [["aria", "campo"], ["campo", "ombra"], ["ombra", "aria"]]; pairs.forEach((q, i) => arrow(q[0], q[1], i === hot));
      Object.keys(N).forEach((k) => { g.fillStyle = TC[k][0]; g.beginPath(); g.arc(N[k][0], N[k][1], 26, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 2; g.stroke(); g.font = "26px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText(TI[k], N[k][0], N[k][1] + 1); g.textBaseline = "alphabetic"; });
      g.fillStyle = "#fde047"; g.font = "800 13px system-ui"; g.textAlign = "center"; g.fillText(pairs[hot][0] + " batte " + pairs[hot][1] + "  ×1,5", 190, 222); g.fillStyle = TC.cuore[0]; g.font = "700 10px system-ui"; g.textAlign = "left"; g.fillText("💗 cuore: neutro, cura", 8, 18);
    } },
    { t: "Una mossa a turno", p: "Ogni turno scegli: <b>Colpo</b> (illimitato, nessun bonus) o <b>Speciale</b> del tuo tipo (<b>3 usi</b>, forte col triangolo giusto). Sui pulsanti ▲ = superefficace, ▼ = poco efficace contro il nemico in campo.", draw(g, f) {
      const t = f % 110, T = SAMPLE("a", "Foglia", "🌿", "campo"), B = SAMPLE("b", "Brezza", "🌬️", "aria"), ev = { k: "atk", side: "p", t, type: "aria", kind: "t" }; T.sh = t >= 34 ? 8 : 20; const hold = S; S = { vp: 0, vf: 0, team: [B], foe: [T], f }; scene(g, f, ev); panel(g, T, [T], 8, 8, false); panel(g, B, [B], 222, 186, true); S = hold; g.fillStyle = "#fde047"; g.font = "800 12px system-ui"; g.textAlign = "center"; g.fillText(t > 34 && t < 80 ? "SUPEREFFICACE!" : "🌬️ Speciale su 🌿 Campo", 190, 130);
    } },
    { t: "Tre contro tre", p: "Giocate in tre. Quando la tua figura va <b>KO</b> entra la successiva. Puoi anche <b>Cambiare</b> (costa il turno) per mettere in campo il tipo giusto. Vince chi mette KO tutte e tre le avversarie.", draw(g, f) {
      bg(g, f); const c = Math.floor(f / 80) % 3; [["campo", "🌿", "Foglia"], ["aria", "🌬️", "Brezza"], ["ombra", "🌑", "Notte"]].forEach((q, i) => { const u = SAMPLE("x" + i, q[2], q[1], q[0]); figure(g, u, 70 + i * 120, 108, { s: 0.9, alpha: i === 1 && c === 2 ? 0.25 : 1, dy: Math.sin(f * 0.06 + i) * 2 }); if (i === 1 && c === 2) { g.fillStyle = "#fca5a5"; g.font = "900 20px system-ui"; g.textAlign = "center"; g.fillText("KO", 190, 112); } });
      g.fillStyle = "#fde047"; g.font = "800 12px system-ui"; g.textAlign = "center"; g.fillText(c === 0 ? "La squadra: tre figure" : c === 1 ? "🔄 Cambia: un turno per l'avversario" : "KO: entra la prossima", 190, 200);
    } }
  ];

  // ------------------------------------------------------------ stato e UI
  function build(o, practice) {
    let team = (o.team || []).slice(0, 3).map(mk), foe = (o.foe || []).slice(0, 3).map(mk);
    if (practice) { team = team.slice(0, 1); foe = foe.slice(0, 1); foe[0].atk = Math.max(3, Math.round(foe[0].atk * 0.6)); foe[0].moves.forEach((m) => { m.heal = false; }); }
    return { o, team, foe, beats: o.beats || BEATS, pa: 0, fa: 0, vp: 0, vf: 0, turn: 1, phase: "play", log: "", pick: "", title: o.title || "Lotta di figure", practice: !!practice, q: [], cur: null, busy: false, endPending: null, f: 0, win: false };
  }
  function hint() { const fo = S.foe[S.fa], b = beater(fo.type); return `${fo.n} è ${TI[fo.type] || ""} ${fo.type}.` + (b ? ` Contro di lui è forte ${TI[b]} ${b}.` : " Il cuore è neutro."); }
  function hud() {
    if (!ui || !S) return; ui.hud.innerHTML = S.practice ? `<b>Prova libera</b><span>turno ${Math.min(S.turn, 4)}/4</span>` : `<b>${esc(S.title)}</b><span>Turno ${S.turn}</span><span>${alive(S.team).length} contro ${alive(S.foe).length}</span>`;
    ui.lg.innerHTML = esc(S.log || hint());
  }
  function controls() {
    if (!ui || !S) return; const bt = ui.bt;
    if (S.phase === "end") {
      if (S.practice) { bt.innerHTML = `<button class="go" id="fgRe">↺ Riprova</button><button class="go" id="fgGo2">▶ Gioca davvero</button>`; bt.querySelector("#fgRe").onclick = () => restart(true); bt.querySelector("#fgGo2").onclick = () => restart(false); }
      else { bt.innerHTML = `<button class="go" id="fgGo">Fine ▸</button>`; bt.querySelector("#fgGo").onclick = () => close(); }
      return;
    }
    const me = S.team[S.pa], fo = S.foe[S.fa], off = S.busy;
    if (S.pick === "sw") { bt.innerHTML = S.team.map((u, i) => `<button data-sw="${i}" ${off || u.hp <= 0 || i === S.pa ? "disabled" : ""}>${esc(u.icon)} ${esc(u.n)}<small>${TI[u.type]} ${u.type} · ${u.hp}/${u.max}</small></button>`).join("") + `<button data-bk="1">◂ Indietro</button>`; }
    else {
      bt.innerHTML = me.moves.map((m, i) => { const k = m.typed && !m.heal ? mult(me.type, fo.type) : 1, tag = k > 1 ? " · ▲ ×1,5" : k < 1 ? " · ▼ ×0,67" : ""; return `<button data-mv="${i}" ${off || m.pp <= 0 ? "disabled" : ""}${k > 1 ? ' class="pw"' : ""}>${m.heal ? "💗" : m.typed ? TI[me.type] : "👊"} ${esc(m.n)}<small>Pot. ${m.pow}${m.pp < 99 ? " · usi " + m.pp : ""}${tag}</small></button>`; }).join("") + (alive(S.team).length > 1 ? `<button data-sw="x" ${off ? "disabled" : ""}>🔄 Cambia<small>costa il turno</small></button>` : "");
    }
    bt.querySelectorAll("[data-mv]").forEach((b) => (b.onclick = () => { if (!S.busy && !(tutC && tutC.open)) turn({ mv: +b.dataset.mv }); }));
    bt.querySelectorAll("[data-sw]").forEach((b) => (b.onclick = () => { if (S.busy || (tutC && tutC.open)) return; if (b.dataset.sw === "x") { S.pick = "sw"; controls(); } else turn({ sw: +b.dataset.sw }); }));
    bt.querySelectorAll("[data-bk]").forEach((b) => (b.onclick = () => { S.pick = ""; controls(); }));
  }
  function evAtk(side, a, d, m, r) { return { k: "atk", side, ui: 0, att: a, def: d, type: m.typed ? a.type : "campo", kind: m.typed ? "t" : "n", k2: r.k, dm: r.dm, hpAfter: d.hp, msg: r.msg }; }
  function turn(c) {
    if (S.phase === "end" || S.busy) return;
    const me = S.team[S.pa], fo = S.foe[S.fa], Q = []; S.pick = ""; S.turn++;
    const fin = (win) => { S.q = Q; S.busy = true; S.endPending = () => endMatch(win, []); };
    if (c.sw != null) { S.pa = c.sw; Q.push({ k: "in", side: "p", ui: S.pa, msg: `${S.team[S.pa].n} entra in campo.` }); }
    else { const m = me.moves[c.mv]; if (m.pp < 99) m.pp--; const r = hit(me, fo, m); Q.push(r.heal ? { k: "heal", side: "p", att: me, dm: r.dm, hpAfter: me.hp, msg: r.msg } : evAtk("p", me, fo, m, r)); }
    if (S.foe[S.fa].hp <= 0) { Q.push({ k: "ko", side: "f", ui: S.fa, msg: `${S.foe[S.fa].n} è KO!` }); if (!nextU("f")) { S.q = Q; S.busy = true; S.endPending = () => endMatch(true, []); return ctl(); } Q.push({ k: "in", side: "f", ui: S.fa, msg: `${S.foe[S.fa].n} scende in campo.` }); }
    else {
      const f2 = S.foe[S.fa], t = S.team[S.pa], m = foeMove(f2, t); if (m.pp < 99) m.pp--; const r = hit(f2, t, m); Q.push(r.heal ? { k: "heal", side: "f", att: f2, dm: r.dm, hpAfter: f2.hp, msg: r.msg } : evAtk("f", f2, t, m, r));
      if (t.hp <= 0) { Q.push({ k: "ko", side: "p", ui: S.pa, msg: `${t.n} è KO!` }); if (!nextU("p")) { S.q = Q; S.busy = true; S.endPending = () => endMatch(false, []); return ctl(); } Q.push({ k: "in", side: "p", ui: S.pa, msg: `Tocca a ${S.team[S.pa].n}.` }); }
    }
    if (S.practice && (S.turn > 4 || !alive(S.team).length || !alive(S.foe).length)) { S.q = Q; S.busy = true; S.endPending = () => { S.phase = "end"; S.log = "Prova finita: riprova o gioca davvero."; hud(); controls(); }; return ctl(); }
    S.q = Q; S.busy = true; ctl();
  }
  function ctl() { hud(); controls(); }
  function nextU(side) { const a = side === "p" ? S.team : S.foe, i = a.findIndex((u) => u.hp > 0); if (i >= 0) { if (side === "p") S.pa = i; else S.fa = i; } return i >= 0; }
  function endMatch(win) {
    if (!S || S.phase === "end") return; if (tutC) tutC.close(); tutC = null; S.q = []; S.cur = null; S.busy = false; S.endPending = null; S.phase = "end"; S.win = !!win;
    S.team.concat(S.foe).forEach((u) => { u.sh = u.hp; });
    S.log = win ? "Vittoria! Le figure si inchinano." : "Sconfitta. Le tue figure si ritirano a leccarsi le ferite."; fxo.banner(win ? "VITTORIA!" : "SCONFITTA", win ? "#86efac" : "#fca5a5"); if (win) fxo.burst(POS.p.x, POS.p.y - 20, 30, ["#facc15", "#fff", "#4ade80"]);
    hud(); controls();
  }
  function restart(practice) { const o = S.o; S = build(o, practice); S.log = practice ? "Prova libera: una figura contro una, quattro turni. Non conta." : ""; fxo = M.fx(); hud(); controls(); }
  function close() { cancelAnimationFrame(raf); const o = S.o, r = { win: !!S.win, ko: S.team.filter((u) => u.hp <= 0).length, a: S.win ? 1 : 0, b: S.win ? 0 : 1, recap: "" }; if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__lotta.state = null; o.onDone && o.onDone(r); }
  function loop() {
    if (!ui || !S) return; const g = ui.g; S.f++; g.setTransform(M.SS, 0, 0, M.SS, 0, 0); pump();
    const sh = fxo.sh > 0 ? (Math.random() - 0.5) * fxo.sh : 0; g.save(); g.translate(sh, 0); scene(g, S.f, S.cur);
    const me = S.team[S.vp], fo = S.foe[S.vf]; if (me && fo) { panel(g, fo, S.foe, 8, 8, false); panel(g, me, S.team, 222, 186, true); }
    g.restore(); fxo.tick(); fxo.draw(g); raf = requestAnimationFrame(loop);
  }
  function start(o) {
    if (!(o.team || []).length || !(o.foe || []).length) return false;
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("fgOv", "🃏 " + (o.title || "Lotta di figure"), "#fde68a"); ui.root.style.background = "linear-gradient(#1b1038,#2c1a4a)";
    fxo = M.fx(); S = build(o, false); tutC = null;
    ui.help.onclick = () => { if (S && S.phase !== "end" && !S.busy && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "lotta", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } }); };
    window.__lotta.state = { finish: (win) => { if (S) endMatch(!!win); }, tut: () => !!(tutC && tutC.open), get team() { return S.team; }, get foe() { return S.foe; }, get phase() { return S.phase; }, get practice() { return S.practice; }, get busy() { return S.busy; } };
    hud(); controls(); loop();
    if (o.tutorial !== false && !M.seen("lotta")) tutC = M.tut({ root: ui.root, key: "lotta", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } });
    return true;
  }
  window.__lotta = { start, state: null, BEATS };
})();
