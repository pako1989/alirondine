// js/muro.js - «TORNA DRITTO»: tiri contro il muro del porto (L'Estate del Muro). Vista di lato: Leo a sinistra, il muro a destra con la macchia rossa.
// Trascina dal Campione verso il muro (lunghezza = forza), rilascia: il pallone vola con gravità e vento. Se colpisce la macchia torna dritto sui piedi di Leo (parata = punto);
// l'onda del porto copre la sabbia a tratti e si porta via i palloni bassi. Opzioni: start({ title, rounds (default 8), need (default 4, i punti per vincere), wind (forza del vento, 1),
//   waves (onde, true), onDone({ win, a, b, data: { catches, perfect, throws, best } }) })
(function () {
  "use strict";
  if (window.__tornadritto) return;
  const M = window.__mini || {}, W = 380, H = 230, SS = 2, GY = 190, LX = 58, WX = 330, SY = 128, G = 230;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), now = () => performance.now() / 1000;
  const BK = "ali-di-rondine.tornadritto.best";
  const best = () => { try { return +localStorage.getItem(BK) || 0; } catch (e) { return 0; } };
  const saveBest = (n) => { try { if (n > best()) localStorage.setItem(BK, String(n)); } catch (e) {} };
  let S = null, ui = null, raf = 0, tutC = null, lastT = 0, drag = null;
  function diffK() { try { const c = window.__sagaCore && window.__sagaCore.cur; return (c && c.opts && c.opts.opp) || 1; } catch (e) { return 1; } }
  function mk(o, practice) {
    return { o, practice: !!practice, rounds: practice ? 99 : o.rounds || 8, need: o.need || 4, k: diffK() * (o.wind == null ? 1 : o.wind), waves: o.waves !== false, throws: 0, catches: 0, perfect: 0, ball: null, t: 0, f: 0, phase: "play", win: false, ended: false, msg: null, fx: [], waveT: 6 };
  }
  const windNow = () => (S ? Math.sin(S.t * 0.55 + 1) * 38 * S.k * (S.practice ? 0.4 : 1) : 0);
  const waveY = () => (S && S.waves ? (() => { const p = (S.t % 9) / 9; return p > 0.62 && p < 0.9 ? Math.sin((p - 0.62) / 0.28 * Math.PI) : 0; })() : 0);
  function shoot(ax, ay, pw) { // direzione (ax, ay) e forza pw (0-1)
    if (!S || S.phase !== "play" || S.ball) return false; const l = Math.hypot(ax, ay) || 1, v = 150 + clamp(pw, 0, 1) * 330;
    S.ball = { x: LX + 10, y: GY - 26, vx: (ax / l) * v, vy: (ay / l) * v, back: false, bounces: 0, trail: [] }; S.throws++; return true;
  }
  function msg(t, c) { S.msg = { t, c: c || "#fde047", a: 70 }; }
  function result(kind) { // dritto | corto | acqua | fuori
    const b = S.ball; S.ball = null;
    if (kind === "dritto") { S.catches++; const flat = Math.abs(b.y - (GY - 18)) < 9; if (flat) S.perfect++; msg(flat ? "DRITTO!" : "PARATA!", flat ? "#fde047" : "#bbf7d0"); for (let i = 0; i < 10; i++) S.fx.push({ x: LX + 12, y: GY - 16, vx: Math.random() * 2 - 0.5, vy: -Math.random() * 2, a: 24 }); }
    else msg(kind === "acqua" ? "L'ONDA SE LO PORTA VIA" : kind === "fuori" ? "TROPPO ALTO" : "TORNA STORTO", "#fca5a5");
    if (S.throws >= S.rounds && !S.practice) { S.pause = 1.2; }
  }
  function step(dt) {
    if (!S || S.ended) return; S.t += dt; S.f++; if (S.msg && --S.msg.a <= 0) S.msg = null; S.fx = S.fx.filter((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; return --p.a > 0; });
    if (S.pause > 0) { S.pause -= dt; if (S.pause <= 0) end(S.catches >= S.need); return; }
    const b = S.ball; if (!b) return;
    b.vx += windNow() * dt; b.vy += G * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.trail.push([b.x, b.y]); if (b.trail.length > 14) b.trail.shift();
    if (!b.back && b.x >= WX - 4) { // colpisce il muro: la macchia rossa (SY) lo rimanda dritto
      const off = b.y - SY; if (b.y < 30) { result("fuori"); return; }
      b.back = true; b.x = WX - 5; b.vx = -Math.abs(b.vx) * 0.78 - 20; b.vy = b.vy * 0.25 + off * 2.6; S.fx.push({ x: WX, y: b.y, vx: 1, vy: -1, a: 14 }, { x: WX, y: b.y, vx: 1.5, vy: 0, a: 14 });
    }
    if (b.y >= GY) { // a terra: rimbalza una volta, in acqua se l'onda lo copre
      const wy = waveY(); if (wy > 0.15 && b.x > 140) { result("acqua"); return; }
      if (b.bounces++ >= 1 || Math.abs(b.vy) < 40) { if (b.back && b.x < LX + 40 && b.x > LX - 10) return result("dritto"); return result("corto"); }
      b.y = GY; b.vy = -Math.abs(b.vy) * 0.45; b.vx *= 0.8;
    }
    if (b.back && b.x <= LX + 22 && b.y > GY - 52 && b.y < GY + 2) return result("dritto"); // parata di Leo
    if (b.x < LX - 20 || b.x > W + 30 || (b.back && b.vx > 0 && b.x > WX - 8)) result("corto");
  }
  function end(win) { if (!S || S.ended) return; S.ended = true; S.phase = "end"; S.win = !!win; saveBest(S.catches); controls(); lg(); }
  function scene(g, st, f) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H);
    let gr = g.createLinearGradient(0, 0, 0, 120); gr.addColorStop(0, "#38bdf8"); gr.addColorStop(1, "#bae6fd"); g.fillStyle = gr; g.fillRect(0, 0, W, 130);
    g.fillStyle = "#fef08a"; g.beginPath(); g.arc(70, 34, 16, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) { g.fillStyle = "rgba(255,255,255,.85)"; const x = (f * 0.15 + i * 140) % 440 - 30; g.beginPath(); g.arc(x, 36 + i * 8, 9, 0, 7); g.arc(x + 11, 39 + i * 8, 7, 0, 7); g.fill(); }
    g.fillStyle = "#0891b2"; g.fillRect(0, 118, W, 22); for (let x = 0; x < W; x += 20) { g.fillStyle = "rgba(255,255,255,.3)"; g.fillRect(x + (f / 3) % 20, 124 + (x % 3) * 4, 8, 1.2); }
    g.fillStyle = "#f3e2b3"; g.fillRect(0, 140, W, GY - 152); for (let x = 0; x < W; x += 14) { g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(x + (f / 4) % 14, 142 + (x % 5) * 2, 6, 1.4); }
    g.fillStyle = "#e8cf94"; g.fillRect(0, GY - 12, W, H - GY + 12); g.fillStyle = "#d6bf8c"; g.fillRect(0, GY - 12, W, 2);
    const wy = waveY(); if (wy > 0.02) { g.fillStyle = `rgba(14,165,233,${0.55 * wy})`; g.fillRect(140, GY - 12 - 30 * wy, WX - 140, 12 + 30 * wy); g.fillStyle = `rgba(255,255,255,${0.7 * wy})`; for (let x = 144; x < WX; x += 10) g.fillRect(x, GY - 12 - 30 * wy, 5, 2); }
    // il muro con la macchia rossa
    g.fillStyle = "#b9a98f"; g.fillRect(WX, 28, 44, GY - 16); g.fillStyle = "#8f8270"; for (let r = 0; r < 14; r++) { g.fillRect(WX, 40 + r * 11, 44, 1); for (let c = 0; c < 4; c++) g.fillRect(WX + ((r % 2) * 5) + c * 11, 40 + r * 11, 1, 10); }
    g.fillStyle = "#d6c9ac"; g.fillRect(WX - 2, 26, 48, 4); g.fillStyle = "rgba(190,40,40,.75)"; g.beginPath(); g.arc(WX + 2, SY, 14, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.35)"; g.beginPath(); g.arc(WX - 2, SY - 5, 4, 0, 7); g.fill();
    // Leo
    g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(LX, GY + 1, 12, 3, 0, 0, 7); g.fill(); g.fillStyle = "#ff4d5a"; g.fillRect(LX - 7, GY - 34, 14, 17); g.fillStyle = "#1e3a8a"; g.fillRect(LX - 6, GY - 17, 5, 17); g.fillRect(LX + 1, GY - 17, 5, 17); g.fillStyle = "#f2c9a0"; g.beginPath(); g.arc(LX, GY - 40, 6.5, 0, 7); g.fill(); g.fillStyle = "#2b1d14"; g.fillRect(LX - 6, GY - 47, 12, 5); g.fillRect(LX - 4, GY - 50, 3, 3); g.fillRect(LX + 1, GY - 50, 3, 3);
    // vento: bandierina
    const w = windNow(); g.fillStyle = "#475569"; g.fillRect(200, 60, 2, 34); g.fillStyle = "#fb923c"; g.beginPath(); g.moveTo(202, 62); g.lineTo(202 + clamp(w, -40, 40) * 0.8 + (w >= 0 ? 6 : -6), 66 + Math.sin(f / 6) * 2); g.lineTo(202, 72); g.fill();
    if (st.ball) { st.ball.trail.forEach(([x, y], i) => { g.fillStyle = `rgba(255,255,255,${i / 30})`; g.fillRect(x - 1, y - 1, 2, 2); }); g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(st.ball.x, st.ball.y, 4.5, 0, 7); g.fill(); g.strokeStyle = "#475569"; g.lineWidth = 0.8; g.beginPath(); g.arc(st.ball.x, st.ball.y, 4.5, 0, 7); g.stroke(); }
    else if (st.phase === "play") { g.fillStyle = "#f8fafc"; g.beginPath(); g.arc(LX + 14, GY - 4, 4.5, 0, 7); g.fill(); }
    if (drag && !st.ball) { const dx = drag.x - (LX + 10), dy = drag.y - (GY - 26), l = Math.hypot(dx, dy) || 1, v = 150 + clamp(l / 130, 0, 1) * 330; let x = LX + 10, y = GY - 26, vx = dx / l * v, vy = dy / l * v; for (let i = 0; i < 14; i++) { for (let k = 0; k < 3; k++) { x += vx * 0.02; y += vy * 0.02; vy += G * 0.02; } g.fillStyle = `rgba(255,255,255,${0.8 - i * 0.05})`; g.fillRect(x - 1, y - 1, 2.4, 2.4); } }
    st.fx.forEach((p) => { g.globalAlpha = Math.min(1, p.a / 12); g.fillStyle = "#fde68a"; g.fillRect(p.x, p.y, 2.5, 2.5); g.globalAlpha = 1; });
    if (st.msg) { g.globalAlpha = Math.min(1, st.msg.a / 20); g.font = "900 20px system-ui"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#000"; g.fillStyle = st.msg.c; g.strokeText(st.msg.t, W / 2, 84); g.fillText(st.msg.t, W / 2, 84); g.globalAlpha = 1; }
    if (st.phase === "end") { g.fillStyle = "rgba(2,6,23,.72)"; g.fillRect(0, 0, W, H); g.textAlign = "center"; g.font = "900 22px system-ui"; g.fillStyle = st.win ? "#fde047" : "#fca5a5"; g.fillText(st.practice ? "PROVA FINITA" : st.win ? "IL MURO RISPONDE" : "IL MURO TACE", W / 2, 92); g.font = "800 12px system-ui"; g.fillStyle = "#fff"; g.fillText(`Parate ${st.catches}/${st.rounds} · Dritti perfetti ${st.perfect} · Record ${best()}`, W / 2, 116); }
  }
  function hud() { if (!ui || !S) return; const w = windNow(); ui.hud.innerHTML = `<b>Tiro ${Math.min(S.throws + (S.ball ? 0 : 1), S.rounds)}/${S.practice ? "∞" : S.rounds}</b><span>Parate ${S.catches}${S.practice ? "" : "/" + S.need}</span><span>🌬️ ${w > 6 ? "→" : w < -6 ? "←" : "·"} ${Math.round(Math.abs(w))}</span><span>Record ${best()}</span>`; }
  function controls() {
    if (!ui || !S) return;
    if (S.phase === "end") { ui.bt.innerHTML = S.practice ? `<button class="go" id="tdRe">↺ Ancora</button><button class="go" id="tdGo2">▶ Gioca davvero</button>` : `<button class="go" id="tdGo" style="flex-basis:100%">Fine ▸</button>`; const q = (id) => ui.bt.querySelector(id); if (q("#tdGo")) q("#tdGo").onclick = close; if (q("#tdRe")) q("#tdRe").onclick = () => restart(true); if (q("#tdGo2")) q("#tdGo2").onclick = () => restart(false); return; }
    ui.bt.innerHTML = "";
  }
  function lg() { if (!ui || !S) return; ui.lg.innerHTML = S.phase === "end" ? (S.practice ? "Prova finita: nulla conta." : S.win ? "Il pallone è tornato dritto. Il muro, per oggi, ti vuole bene." : "Troppi tiri storti. Si può sempre riprovare.") : "Trascina da Leo verso il muro (più lungo = più forte) e rilascia. Colpisci la <b>macchia rossa</b>: il pallone torna ai tuoi piedi. Occhio al vento 🌬️ e all'onda che copre la sabbia."; }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); const n = now(), dt = clamp(n - lastT, 0, 0.05); lastT = n; if (!(tutC && tutC.open)) step(dt); if (ui) scene(ui.g, S, S.f); if (S && S.f % 8 === 0) hud(); }
  function restart(practice) { const o = S.o; S = mk(o, practice); lastT = now(); hud(); controls(); lg(); }
  function close() { cancelAnimationFrame(raf); raf = 0; const st = S, o = st.o; ui.root.remove(); ui = null; S = null; try { window.__sagaCore && window.__sagaCore.endMatch(); } catch (e) {} o.onDone && o.onDone({ win: !!st.win, a: st.catches, b: st.throws, quit: false, data: { catches: st.catches, perfect: st.perfect, throws: st.throws, best: best() } }); }
  const PAGES = [
    { t: "Trascina e rilascia", p: "Tieni premuto su Leo, <b>trascina verso il muro</b> e rilascia. Più lungo è il tratto, più forte parte il pallone. I puntini mostrano dove va, senza vento.", draw: (g, f) => scene(g, { ball: null, phase: "play", fx: [], msg: null, catches: 0, perfect: 0, throws: 0, rounds: 8, win: false, t: f / 60, waves: false, k: 1, practice: false }, f) },
    { t: "La macchia rossa", p: "Il muro rimanda dritto solo se colpisci la <b>macchia rossa</b>. Troppo alto e il pallone vola via, troppo basso e torna storto.", draw: (g, f) => scene(g, { ball: { x: 80 + (f % 90) * 2.6, y: 160 - Math.sin((f % 90) / 90 * Math.PI) * 50, trail: [] }, phase: "play", fx: [], msg: null, catches: 0, perfect: 0, throws: 0, rounds: 8, win: false, t: 0, waves: false, k: 1, practice: false }, f) },
    { t: "Vento e onda", p: "La bandierina mostra il <b>vento</b> che spinge il pallone. A tratti arriva l'<b>onda</b>: se il pallone cade in acqua, lo perdi. Servono parate per vincere.", draw: (g, f) => scene(g, { ball: null, phase: "play", fx: [], msg: null, catches: 0, perfect: 0, throws: 0, rounds: 8, win: false, t: 5.8 + (f % 200) / 60, waves: true, k: 1, practice: false }, f) }
  ];
  function pos(ev) { const r = ui.cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) / r.width * W, y: (ev.clientY - r.top) / r.height * H }; }
  function start(o) {
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("tdOv", "🧱 " + (o.title || "Torna Dritto"), "#fb923c"); ui.root.style.background = "#0b1426";
    S = mk(o, false); tutC = null; drag = null; lastT = now(); ui.cv.style.height = "auto"; ui.cv.style.flex = "none";
    ui.cv.addEventListener("pointerdown", (ev) => { ev.preventDefault(); if (S && S.phase === "play" && !S.ball) { drag = pos(ev); try { ui.cv.setPointerCapture(ev.pointerId); } catch (e) {} } });
    ui.cv.addEventListener("pointermove", (ev) => { if (drag) drag = pos(ev); });
    const rel = (ev) => { if (!drag) return; const d = drag; drag = null; const dx = d.x - (LX + 10), dy = d.y - (GY - 26), l = Math.hypot(dx, dy); if (l > 14) shoot(dx, dy, l / 130); };
    ui.cv.addEventListener("pointerup", rel); ui.cv.addEventListener("pointercancel", () => { drag = null; });
    const openTut = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "tornadritto", pages: PAGES, onClose: (pr) => { tutC = null; restart(!!pr); } }); };
    ui.help.onclick = openTut;
    window.__tornadritto.state = {
      get phase() { return S && S.phase; }, get catches() { return S ? S.catches : 0; }, get throws() { return S ? S.throws : 0; }, get perfect() { return S ? S.perfect : 0; }, get ball() { return S && S.ball; }, tut: () => !!(tutC && tutC.open),
      shoot, wind: windNow, tick: (sec) => { if (!S) return; let k = Math.round((sec || 0) / 0.016); while (k-- > 0 && S && !S.ended) step(0.016); },
      finish: (win) => { if (tutC) { tutC = null; const el = ui && ui.root.querySelector(".tut"); if (el) el.remove(); ui && ui.root.classList.remove("tutOn"); } end(!!win); }
    };
    hud(); controls(); lg(); loop();
    if (o.tutorial !== false && !(M.seen && M.seen("tornadritto"))) openTut();
    return true;
  }
  window.__tornadritto = { start, state: null };
})();
