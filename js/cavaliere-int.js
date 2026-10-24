// js/cavaliere-int.js - «INTERROGATORIO» · il minigioco di «Il Cavaliere del Fischio» (e del cabinato in Sala Giochi)
// Stanza degli interrogatori a schermo: il sospettato ha una POSA (spavaldo, spaventato, sarcastico) e un piccolo DETTAGLIO che rivela l'umore vero. Scegli come parlare: Calmo, Duro o Ironico.
// Spavaldo -> Duro · Spaventato -> Calmo · Sarcastico -> Ironico. Giusto = sale la Verità; sbagliato = salgono i Nervi. A Verità 100 confessa; a Nervi 100 si chiude a riccio.
// Ai livelli alti la posa può mentire: se posa e dettaglio non coincidono, fidati del dettaglio.
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (due domande senza conseguenze); il «?» la riapre. Richiede js/mini.js.
// Opzioni: title, level (1-3), oppName, te (Verità in più per colpo), df (Nervi in meno quando sbagli), at (domande in più), tutorial (false = niente spiegazione), onDone({win, verita, nervi}).
// Test: window.__interrogatorio.state.finish(win) · .pick("calmo"|"duro"|"ironico") · pulsante #ivGo.
(function () {
  "use strict";
  if (window.__interrogatorio) return;
  const M = window.__mini || {}, W = M.W || 380, H = M.H || 230, esc = M.esc || ((s) => String(s == null ? "" : s));
  const MOODS = {
    spavaldo: { best: "duro", tic: "😏", name: "Spavaldo", lines: ["Che vuole da me? Io non ho niente da dire.", "Faccia pure. Ho avvocati che si mangiano le sentenze."] },
    spaventato: { best: "calmo", tic: "💧", name: "Spaventato", lines: ["Io... io non dovrei essere qui. Non so niente.", "Se parlo, mi... mi fanno del male."] },
    sarcastico: { best: "ironico", tic: "🙄", name: "Sarcastico", lines: ["Un interrogatorio. Che originale. Ha anche un mantello?", "Domande, domande... voglio un caffè e un po' di rispetto."] }
  };
  const KINDS = { calmo: ["🤝 Calmo", "parli piano, lo lasci respirare"], duro: ["👊 Duro", "alzi la voce e lo inchiodi"], ironico: ["🎭 Ironico", "rispondi alla battuta con la tua"] };
  const ORDER = ["calmo", "duro", "ironico"], KEYS = ["spavaldo", "spaventato", "sarcastico"];
  const LV = { 1: { feint: 0.1, wrong: 18, turns: 9 }, 2: { feint: 0.25, wrong: 22, turns: 8 }, 3: { feint: 0.4, wrong: 26, turns: 8 } };
  let S = null, ui = null, raf = 0, tutC = null, tm = 0, fxo = null;
  const lv = (o) => LV[Math.max(1, Math.min(3, o.level || 1))];
  const hash = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

  // ------------------------------------------------------------ grafica
  function roomBg(g, dim) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#121420"); gr.addColorStop(1, "#0a0b12"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = "rgba(60,70,95,.35)"; g.fillRect(14, 22, 62, 84); for (let i = 0; i < 6; i++) { g.fillStyle = "rgba(190,200,230," + (0.1 + 0.05 * (i % 2)) + ")"; g.fillRect(16, 26 + i * 13, 58, 6); }
    g.strokeStyle = "#2b3144"; g.lineWidth = 2; g.strokeRect(14, 22, 62, 84);
    g.fillStyle = "#20170f"; g.fillRect(0, 168, W, H - 168);
    g.fillStyle = "rgba(255,255,255,.04)"; for (let x = 0; x < W; x += 28) g.fillRect(x, 168, 1, H - 168);
    g.fillStyle = "#1a1c28"; g.fillRect(318, 60, 44, 108); g.fillStyle = "#0d0e16"; g.fillRect(322, 64, 36, 104); g.fillStyle = "#facc15"; g.beginPath(); g.arc(352, 120, 2, 0, 7); g.fill();
    if (dim) { g.fillStyle = "rgba(0,0,0," + dim + ")"; g.fillRect(0, 0, W, H); }
  }
  function lamp(g, f, dim) {
    const a = Math.sin(f * 0.035) * 0.07; g.save(); g.translate(190, 0); g.rotate(a);
    g.strokeStyle = "#555"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 24); g.stroke();
    g.fillStyle = "#374151"; g.beginPath(); g.moveTo(-16, 38); g.lineTo(-5, 24); g.lineTo(5, 24); g.lineTo(16, 38); g.closePath(); g.fill();
    const lg = g.createLinearGradient(0, 38, 0, 200); lg.addColorStop(0, "rgba(253,230,138," + 0.3 * (1 - (dim || 0)) + ")"); lg.addColorStop(1, "rgba(253,230,138,0)");
    g.fillStyle = lg; g.beginPath(); g.moveTo(-16, 38); g.lineTo(16, 38); g.lineTo(110, 200); g.lineTo(-110, 200); g.closePath(); g.fill();
    g.fillStyle = "#fde68a"; g.beginPath(); g.arc(0, 40, 4, 0, 7); g.fill(); g.restore();
  }
  function table(g) {
    g.fillStyle = "#3b2a1a"; g.fillRect(60, 166, 260, 10); g.fillStyle = "#2a1d12"; g.fillRect(70, 176, 240, 40);
    g.save(); g.translate(120, 169); g.rotate(-0.08); g.fillStyle = "#e7d9b6"; g.fillRect(-18, -7, 36, 11); g.fillStyle = "#b91c1c"; g.fillRect(-18, -7, 36, 3); g.restore();
    g.fillStyle = "rgba(150,200,230,.5)"; g.fillRect(262, 154, 9, 13); g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(263, 154, 2, 13);
  }
  // sospettato. pose: umore mostrato · st: {res:"ok"|"part"|"bad"|"win"|"lose", t} · col: colore giacca
  function suspect(g, f, pose, st, col) {
    const res = st && st.res, t = st ? st.t : 0, win = res === "win", lose = res === "lose";
    let hx = 190, hy = 92, tilt = 0, jit = 0, lean = 0;
    if (pose === "spavaldo") { hy = 86; lean = -4; } else if (pose === "spaventato") { hy = 100; jit = Math.sin(f * 1.7) * 1.3; } else { tilt = 0.13; hy = 92; }
    if (res === "ok") { hy += 5 + Math.sin(t * 0.3); jit = 0; tilt = 0; lean = 0; } else if (res === "bad") { jit = Math.sin(f * 2.4) * 2; } else if (win) { hy = 110; tilt = 0; jit = 0; lean = 0; } else if (lose) { lean = 0; jit = 0; }
    hx += jit; const by = 168, cl = (Math.sin(f * 0.14) + 1) / 2;
    g.fillStyle = col; g.beginPath(); g.moveTo(150 + lean, by); g.lineTo(160 + lean * 0.5, 124); g.quadraticCurveTo(190, 112 + (hy - 92) * 0.5, 220 - lean * 0.5, 124); g.lineTo(230 - lean, by); g.closePath(); g.fill();
    g.fillStyle = "#e5e7eb"; g.beginPath(); g.moveTo(180, 120); g.lineTo(190, 140); g.lineTo(200, 120); g.closePath(); g.fill(); g.fillStyle = "#991b1b"; g.fillRect(188, 130, 4, 20);
    g.strokeStyle = col; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); let hands;
    if (lose) { g.moveTo(162, 130); g.lineTo(190, 150); g.lineTo(218, 130); hands = [[190, 150]]; }
    else if (res === "part") { g.moveTo(162, 132); g.lineTo(140, 118); g.moveTo(218, 132); g.lineTo(240, 118); hands = [[140, 118], [240, 118]]; }
    else if (pose === "spavaldo" && !win) { g.moveTo(162, 130); g.lineTo(132, 150); g.lineTo(122, 166); g.moveTo(218, 130); g.lineTo(248, 150); g.lineTo(258, 166); hands = [[122, 166], [258, 166]]; }
    else if (pose === "spaventato" || win) { g.moveTo(162, 132); g.lineTo(176, 160); g.lineTo(190, 164); g.moveTo(218, 132); g.lineTo(204, 160); g.lineTo(190, 164); hands = [[190, 164]]; }
    else { g.moveTo(162, 132); g.lineTo(165, 150); g.lineTo(178 + cl * 12, 142); g.moveTo(218, 132); g.lineTo(215, 150); g.lineTo(202 - cl * 12, 142); hands = [[178 + cl * 12, 142], [202 - cl * 12, 142]]; }
    g.stroke(); g.fillStyle = "#e8c8a0"; hands.forEach((h) => { g.beginPath(); g.arc(h[0], h[1], 5, 0, 7); g.fill(); });
    g.save(); g.translate(hx, hy); g.rotate(tilt);
    g.fillStyle = "#e8c8a0"; g.beginPath(); g.arc(0, 0, 21, 0, 7); g.fill(); g.fillStyle = "#2b1d14"; g.beginPath(); g.arc(0, -6, 21, Math.PI, 0); g.fill(); g.fillRect(-21, -8, 42, 4);
    const ey = -2; g.strokeStyle = "#2b1d14"; g.lineWidth = 2;
    if (win) { g.beginPath(); g.moveTo(-11, ey + 3); g.lineTo(-4, ey + 5); g.moveTo(11, ey + 3); g.lineTo(4, ey + 5); g.stroke(); g.beginPath(); g.moveTo(-6, 12); g.quadraticCurveTo(0, 9, 6, 12); g.stroke(); }
    else if (lose) { g.fillStyle = "#111"; g.fillRect(-12, ey, 8, 2); g.fillRect(4, ey, 8, 2); g.beginPath(); g.moveTo(-6, 11); g.lineTo(6, 11); g.stroke(); }
    else if (pose === "spavaldo") { g.fillStyle = "#111"; g.fillRect(-15, ey - 3, 30, 7); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(-13, ey - 2, 8, 2); g.beginPath(); g.moveTo(-8, 11); g.quadraticCurveTo(2, 14, 10, 7); g.stroke(); }
    else if (pose === "spaventato") { const look = Math.sin(f * 0.07) > 0.2 ? 3 : -1; g.fillStyle = "#fff"; g.beginPath(); g.arc(-8, ey, 5.5, 0, 7); g.arc(8, ey, 5.5, 0, 7); g.fill(); g.fillStyle = "#111"; g.beginPath(); g.arc(-8 + look, ey, 2.3, 0, 7); g.arc(8 + look, ey, 2.3, 0, 7); g.fill(); g.lineWidth = 1.6; g.beginPath(); g.moveTo(-13, ey - 9); g.lineTo(-4, ey - 7); g.moveTo(13, ey - 9); g.lineTo(4, ey - 7); g.stroke(); g.beginPath(); g.moveTo(-6, 12); for (let i = 1; i <= 4; i++) g.lineTo(-6 + i * 3, 12 + (i % 2 ? -2 : 1)); g.stroke(); }
    else { g.fillStyle = "#fff"; g.beginPath(); g.arc(-8, ey, 4.5, 0, 7); g.arc(8, ey, 4.5, 0, 7); g.fill(); g.fillStyle = "#111"; g.beginPath(); g.arc(-8, ey - 1, 2, 0, 7); g.arc(8, ey - 1, 2, 0, 7); g.fill(); g.lineWidth = 1.8; g.beginPath(); g.moveTo(-13, ey - 6); g.lineTo(-3, ey - 7); g.moveTo(4, ey - 12); g.lineTo(13, ey - 8); g.stroke(); g.beginPath(); g.moveTo(-7, 11); g.lineTo(4, 11); g.lineTo(8, 8); g.stroke(); }
    if (res === "bad") { g.strokeStyle = "#b91c1c"; g.lineWidth = 2; g.beginPath(); g.moveTo(-10, -12); g.lineTo(-4, -9); g.moveTo(10, -12); g.lineTo(4, -9); g.stroke(); }
    g.restore();
    if (pose === "spaventato" && !res) for (let i = 0; i < 2; i++) { const p = (f * 0.7 + i * 20) % 40; g.fillStyle = "rgba(147,197,253,.85)"; g.beginPath(); g.arc(hx + 22 - i * 4, hy - 6 + p * 0.8, 2.2, 0, 7); g.fill(); }
  }
  function bubble(g, text, x, y, w) {
    g.font = "600 11px system-ui"; const ls = []; let cur = ""; text.split(" ").forEach((wd) => { const t = cur ? cur + " " + wd : wd; if (g.measureText(t).width > w - 14 && cur) { ls.push(cur); cur = wd; } else cur = t; }); ls.push(cur);
    const h = ls.length * 14 + 10; g.fillStyle = "rgba(255,255,255,.93)"; g.beginPath(); g.roundRect(x, y, w, h, 8); g.fill(); g.beginPath(); g.moveTo(x + 10, y + h); g.lineTo(x - 6, y + h + 10); g.lineTo(x + 26, y + h); g.fill();
    g.fillStyle = "#111827"; g.textAlign = "left"; ls.forEach((l, i) => g.fillText(l, x + 7, y + 16 + i * 14));
  }
  function tic(g, f, mood) {
    const a = 0.4 + 0.6 * (Math.sin(f * 0.09) + 1) / 2, x = 250, y = 112; g.globalAlpha = a; g.fillStyle = "rgba(250,204,21,.18)"; g.strokeStyle = "#facc15"; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 17, 0, 7); g.fill(); g.stroke();
    g.font = "18px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText(MOODS[mood].tic, x, y + 1); g.textBaseline = "alphabetic"; g.globalAlpha = 1; g.fillStyle = "#fde68a"; g.font = "700 9px system-ui"; g.fillText("dettaglio", x, y + 29);
  }
  function scene(g, f, pose, real, o) {
    o = o || {}; roomBg(g, o.dim || 0); lamp(g, f, o.dim || 0); table(g); suspect(g, f, pose, o.st, o.col || "#374151"); if (o.tic !== false && !o.st) tic(g, f, real);
    if (o.line) bubble(g, o.line, 226, 14, 144);
  }

  // ------------------------------------------------------------ spiegazione
  const label = (g, t, y) => { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, y - 14, W, 22); g.fillStyle = "#fde047"; g.font = "800 12px system-ui"; g.textAlign = "center"; g.fillText(t, W / 2, y + 2); };
  const PAGES = [
    { t: "Leggi l'umore", p: "Il sospettato ha un <b>umore</b>. <b>Spavaldo</b>: braccia larghe e occhiali, vuole <b>Duro</b>. <b>Spaventato</b>: tremante e sudato, vuole <b>Calmo</b>. <b>Sarcastico</b>: sopracciglio alzato, vuole <b>Ironico</b>.", draw(g, f) { const k = KEYS[Math.floor(f / 110) % 3]; scene(g, f, k, k, { tic: false, line: MOODS[k].lines[0] }); label(g, MOODS[k].name + " → " + KINDS[MOODS[k].best][0], 218); } },
    { t: "Verità e Nervi", p: "Risposta giusta: sale la <b>Verità</b> (a 100 confessa). Sbagliata: salgono i <b>Nervi</b> (a 100 si chiude a riccio). Quasi giusta: poco di entrambe. Le <b>domande</b> sono limitate.", draw(g, f) { const c = Math.floor(f / 90) % 3, p = Math.min(1, ((f % 90) / 90) * 2), v = c === 1 ? 0.1 + 0.4 * p : c === 2 ? 0.5 : 0.1, n = c === 2 ? 0.15 + 0.5 * p : 0.15; scene(g, f, "spavaldo", "spavaldo", { tic: false, st: c ? { res: c === 1 ? "ok" : "bad", t: f % 90 } : null }); const br = (y, lab, val, col) => { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(8, y, 138, 16); g.fillStyle = col; g.fillRect(8, y, 138 * val, 16); g.strokeStyle = "#fff"; g.lineWidth = 1; g.strokeRect(8, y, 138, 16); g.fillStyle = "#fff"; g.font = "800 10px system-ui"; g.textAlign = "left"; g.fillText(lab, 13, y + 12); }; br(8, "Verità", v, "#16a34a"); br(28, "Nervi", n, "#dc2626"); label(g, c === 1 ? "Duro su uno spavaldo: GIUSTO" : c === 2 ? "Calmo su uno spavaldo: SBAGLIATO" : "Tocca a te", 218); } },
    { t: "Occhio al dettaglio", p: "A volte la <b>posa mente</b>: sembra spavaldo ma <b>suda</b>. Il piccolo <b>dettaglio</b> accanto (💧 spaventato, 😏 spavaldo, 🙄 sarcastico) dice l'umore vero. Se non coincidono, fidati del dettaglio.", draw(g, f) { scene(g, f, "spavaldo", "spaventato", { line: "Io non ho paura di nessuno!" }); label(g, "posa spavaldo, dettaglio 💧 → usa Calmo", 218); } }
  ];

  // ------------------------------------------------------------ stato
  function newMood() {
    let k = KEYS[Math.floor(Math.random() * 3)]; if (k === S.mood) k = KEYS[(KEYS.indexOf(k) + 1) % 3];
    S.mood = k; S.shown = Math.random() < lv(S.o).feint ? KEYS[(KEYS.indexOf(k) + 1 + Math.floor(Math.random() * 2)) % 3] : k; S.q++;
  }
  function mk(o, practice) {
    S = { o, practice: !!practice, verita: 0, nervi: 10 + (o.level || 1) * 3, turns: practice ? 2 : lv(o).turns + (o.at | 0), mood: "", shown: "", q: 0, over: false, win: false, anim: null, f: 0, log: practice ? "Prova libera: due domande, i punti non contano." : "Leggi l'umore e scegli come parlare.", col: ["#374151", "#1e3a5f", "#4a3b2a", "#3f3f46"][hash(o.oppName || "x") % 4] };
    newMood(); return S;
  }
  const bar = (v, col) => `<span class="bar"><i style="width:${Math.min(100, v)}%;background:${col}"></i></span>`;
  function hud() {
    if (!ui || !S) return; ui.hud.innerHTML = S.practice ? `<b>Prova libera</b><span>domande ${S.turns}</span>` : `<span>🟢 Verità <b>${Math.round(S.verita)}</b></span>${bar(S.verita, "#16a34a")}<span>🔴 Nervi <b>${Math.round(S.nervi)}</b></span>${bar(S.nervi, "#dc2626")}<span>❓ ${S.turns}</span>`;
    ui.lg.innerHTML = esc(S.log);
  }
  function controls() {
    if (!ui || !S) return; const bt = ui.bt;
    if (S.over && S.practice) { bt.innerHTML = `<button class="go" id="ivRe">↺ Riprova</button><button class="go" id="ivGo2">▶ Gioca davvero</button>`; bt.querySelector("#ivRe").onclick = () => restart(true); bt.querySelector("#ivGo2").onclick = () => restart(false); return; }
    if (S.over) { bt.innerHTML = `<button class="go" id="ivGo">Continua ▸</button>`; bt.querySelector("#ivGo").onclick = () => close(S.win); return; }
    bt.innerHTML = ORDER.map((k) => `<button data-k="${k}">${KINDS[k][0]}<small>${KINDS[k][1]}</small></button>`).join("");
    bt.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => { if (S && !S.anim && !(tutC && tutC.open)) pick(b.dataset.k); }));
  }
  function pick(kind) {
    if (!S || S.over || !KINDS[kind]) return false;
    const best = MOODS[S.mood].best, ok = kind === best, part = ORDER[(ORDER.indexOf(best) + 1) % 3] === kind, wasShown = S.shown, wasReal = S.mood; let res;
    S.turns--;
    if (ok) { res = "ok"; if (!S.practice) { S.verita += 25 + 4 * (S.o.te | 0); S.nervi = Math.max(0, S.nervi - 6); } S.log = "Colpo giusto: si incrina e lascia scappare un pezzo di verità."; fxo.burst(190, 90, 18, ["#4ade80", "#bbf7d0", "#fff"]); fxo.text("VERITÀ ▲", 190, 60, "#86efac"); }
    else if (part) { res = "part"; if (!S.practice) { S.verita += 8; S.nervi += Math.max(4, lv(S.o).wrong - 10 - 3 * (S.o.df | 0)); } S.log = "Non è la corda giusta, ma qualcosa si sposta."; fxo.text("mah...", 190, 60, "#fde047"); }
    else { res = "bad"; if (!S.practice) S.nervi += Math.max(6, lv(S.o).wrong - 4 * (S.o.df | 0)); S.log = "Sbagliato: si irrigidisce. «" + MOODS[wasReal].lines[1] + "»"; fxo.burst(190, 90, 14, ["#f87171", "#fecaca"]); fxo.text("NERVI ▲", 190, 60, "#fca5a5"); fxo.shake(6); }
    if (S.practice) S.log += " (prova: non conta)";
    S.anim = { res, t: 0, shown: wasShown, real: wasReal };
    if (!S.practice && S.verita >= 100) { S.verita = 100; return finish(true); }
    if (!S.practice && S.nervi >= 100) { S.nervi = 100; return finish(false); }
    if (S.turns <= 0) { if (S.practice) { S.over = true; S.log += " Prova finita: riprova o gioca davvero."; hud(); controls(); return true; } return finish(S.verita >= 70); }
    newMood(); hud(); clearTimeout(tm); tm = setTimeout(() => { if (S) S.anim = null; }, 1100); return true;
  }
  function finish(win) {
    if (!S || S.over) return; clearTimeout(tm); if (tutC) tutC.close(); tutC = null;
    S.over = true; S.win = !!win; S.anim = { res: win ? "win" : "lose", t: 0 }; S.log = win ? "Confessa. Parla a bassa voce, senza guardarti, con la voce di chi ha tenuto un segreto troppo a lungo." : "Si chiude a riccio. «Non dirò altro.» Per stasera, la porta resta chiusa.";
    fxo.banner(win ? "CONFESSA!" : "SI CHIUDE", win ? "#86efac" : "#fca5a5"); if (win) fxo.burst(190, 95, 30, ["#facc15", "#fff", "#4ade80"]);
    hud(); controls(); if (window.__interrogatorio.state) window.__interrogatorio.state.done = !!win; return true;
  }
  function restart(practice) { clearTimeout(tm); const o = S.o; mk(o, practice); fxo = M.fx(); hud(); controls(); }
  function close(win) { clearTimeout(tm); cancelAnimationFrame(raf); const o = S.o, r = { win: !!win, verita: S.verita, nervi: S.nervi }; if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__interrogatorio.state = null; o.onDone && o.onDone(r); }
  function loop() {
    if (!ui || !S) return; const g = ui.g; S.f++; g.setTransform(M.SS, 0, 0, M.SS, 0, 0); const A = S.anim; if (A) A.t++;
    const sh = fxo.sh > 0 ? (Math.random() - 0.5) * fxo.sh : 0; g.save(); g.translate(sh, 0);
    const pose = A && A.shown ? A.shown : S.shown, real = A && A.real ? A.real : S.mood;
    const line = A && A.res === "win" ? "...va bene. Parlo. Non l'ho fatto da solo." : A && A.res === "lose" ? "Non dirò altro." : MOODS[pose].lines[S.q % 2];
    scene(g, S.f, pose, real, { st: A, col: S.col, dim: A && A.res === "lose" ? 0.5 : 0, line, tic: !A });
    if (A && A.res === "bad" && A.t < 14) { g.fillStyle = "rgba(220,38,38," + (0.28 - A.t * 0.02) + ")"; g.fillRect(0, 0, W, H); }
    g.restore(); fxo.tick(); fxo.draw(g);
    raf = requestAnimationFrame(loop);
  }
  function start(o) {
    cancelAnimationFrame(raf); clearTimeout(tm); if (ui) ui.root.remove(); ui = M.shell("ivOv", "🕵️ " + (o.title || "Interrogatorio") + (o.level ? " · Liv. " + o.level : ""), "#facc15"); ui.root.style.background = "#07070e";
    fxo = M.fx(); mk(o, false); tutC = null;
    ui.help.onclick = () => { if (S && !S.over && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "interrogatorio", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } }); };
    window.__interrogatorio.state = { finish, pick, tut: () => !!(tutC && tutC.open), get verita() { return S.verita; }, get nervi() { return S.nervi; }, get over() { return S.over; }, get mood() { return S.mood; }, get shown() { return S.shown; }, get practice() { return S.practice; } };
    hud(); controls(); loop();
    if (o.tutorial !== false && !M.seen("interrogatorio")) tutC = M.tut({ root: ui.root, key: "interrogatorio", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } });
    return true;
  }
  window.__interrogatorio = { start, state: null };
})();
