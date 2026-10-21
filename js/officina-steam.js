// js/officina-steam.js - «STEAM STRIKERS» · calcio a vapore a turni per «L'Officina dei Giganti di Ruggine» (e per il cabinato in Sala Giochi)
// 3 attacchi e 3 difese alternati. In attacco la lancetta della pressione sale e scende: fermala nella zona verde (62-90) per tirare; sopra 90 la caldaia va in stallo.
// In difesa un Gigante carica un tiro: scegli tra Getto di fumo (disorienta il tiro), Salto propulso (para quasi sempre) o Sfiato (non spende nulla). Le cariche (4) sono comuni a tutto il match.
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (un attacco e una difesa senza conseguenze); il «?» la riapre.
// Opzioni: title, level (1-3), oppName, mate, tutorial (false = niente spiegazione), onDone({win, a, b}). Test: window.__steam.state.finish(a, b) · pulsante #stGo. Richiede js/mini.js.
(function () {
  "use strict";
  if (window.__steam) return;
  const M = window.__mini, W = M.W, H = M.H, esc = M.esc;
  let S = null, ui = null, raf = 0, tutC = null, tm = 0;
  const lv = () => Math.max(1, Math.min(3, S.o.level || 1)), keeper = () => 0.22 + 0.08 * lv(), foePower = () => 40 + Math.floor(Math.random() * 55);
  // ------------------------------------------------------------ disegno
  function gear(g, x, y, r, f, sp) { g.save(); g.translate(x, y); g.rotate(f * sp); g.fillStyle = "#5a4a3a"; g.strokeStyle = "#2a1a10"; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283, a2 = (i + 0.5) / 12 * 6.283; g.lineTo(Math.cos(a) * r * 1.18, Math.sin(a) * r * 1.18); g.lineTo(Math.cos(a2) * r * 1.18, Math.sin(a2) * r * 1.18); g.lineTo(Math.cos(a2) * r, Math.sin(a2) * r); g.lineTo(Math.cos((i + 1) / 12 * 6.283) * r, Math.sin((i + 1) / 12 * 6.283) * r); } g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#2a1a10"; g.beginPath(); g.arc(0, 0, r * 0.35, 0, 7); g.fill(); g.restore(); }
  function bg(g, f) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#2a1810"); gr.addColorStop(0.6, "#5a3418"); gr.addColorStop(1, "#2a1a10"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 14; c++) { g.fillStyle = (r + c) % 3 ? "rgba(120,60,30,.35)" : "rgba(90,40,20,.4)"; g.fillRect(c * 28 - (r % 2) * 14, r * 14, 26, 12); }
    const fg = g.createRadialGradient(190, 150, 10, 190, 150, 150); fg.addColorStop(0, "rgba(255,140,40,.5)"); fg.addColorStop(1, "rgba(255,140,40,0)"); g.fillStyle = fg; g.fillRect(0, 0, W, H);
    [[38, 70], [96, 120]].forEach(([y, x0]) => { g.fillStyle = "#6b5a4a"; g.fillRect(0, y, W, 9); g.fillStyle = "#8a7a6a"; g.fillRect(0, y, W, 2); for (let x = 12; x < W; x += 34) { g.fillStyle = "#3a2a1a"; g.fillRect(x, y - 2, 4, 13); } });
    gear(g, 40, 62, 26, f, 0.012); gear(g, 340, 56, 20, f, -0.016); gear(g, 190, 18, 14, f, 0.02);
    for (let i = 0; i < 9; i++) { const k = ((f * 0.6 + i * 37) % 120) / 120, x = 30 + i * 42 + Math.sin(i * 3 + f * 0.02) * 6; g.fillStyle = `rgba(230,230,230,${0.22 * (1 - k)})`; g.beginPath(); g.arc(x, 44 - k * 40, 6 + k * 12, 0, 7); g.fill(); }
    g.fillStyle = "#2a2018"; g.fillRect(0, 150, W, H - 150); g.fillStyle = "#3a3026"; for (let x = 0; x < W; x += 16) g.fillRect(x, 150, 1, H - 150); for (let y = 150; y < H; y += 12) g.fillRect(0, y, W, 1);
    g.strokeStyle = "rgba(255,255,255,.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 174); g.lineTo(W, 174); g.stroke(); g.beginPath(); g.arc(250, 174, 40, 0.9 * Math.PI, 1.9 * Math.PI); g.stroke();
  }
  function goalBox(g) { g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(300, 96, 52, 72); g.strokeStyle = "rgba(255,255,255,.3)"; g.lineWidth = 0.8; for (let x = 300; x <= 352; x += 6) { g.beginPath(); g.moveTo(x, 96); g.lineTo(x, 168); g.stroke(); } for (let y = 96; y <= 168; y += 6) { g.beginPath(); g.moveTo(300, y); g.lineTo(352, y); g.stroke(); } g.fillStyle = "#e5e7eb"; g.fillRect(298, 94, 56, 4); g.fillRect(298, 94, 4, 76); g.fillRect(350, 94, 4, 76); }
  function gauge(g, st, f) {
    const x0 = 40, w = 300, y0 = 8, h = 20, segs = [[0, 30, "#6b7280", "DEBOLE"], [30, 62, "#ca8a04", "MEDIO"], [62, 90, "#16a34a", "PERFETTO"], [90, 100, "#b91c1c", "STALLO"]];
    g.fillStyle = "#1a100a"; g.beginPath(); g.roundRect(x0 - 4, y0 - 4, w + 8, h + 20, 8); g.fill(); g.strokeStyle = "#a15a22"; g.lineWidth = 2; g.stroke();
    segs.forEach(([a, b, c, n]) => { g.fillStyle = c; g.fillRect(x0 + a / 100 * w, y0, (b - a) / 100 * w, h); g.fillStyle = "#fff"; g.font = "800 7px system-ui"; g.textAlign = "center"; g.fillText(n, x0 + (a + b) / 200 * w, y0 + h + 9); });
    const p = st.pos | 0, nx = x0 + p / 100 * w; g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(nx, y0 - 5); g.lineTo(nx - 6, y0 - 12); g.lineTo(nx + 6, y0 - 12); g.closePath(); g.fill(); g.stroke(); g.fillRect(nx - 1.5, y0, 3, h);
    g.font = "900 11px system-ui"; g.textAlign = "left"; g.fillStyle = "#fde68a"; g.fillText(p, x0 + w + 8, y0 + 14);
  }
  function scene(g, st, f, demo) {
    g.setTransform(M.SS, 0, 0, M.SS, 0, 0); g.clearRect(0, 0, W, H); bg(g, f); goalBox(g); const an = st.anim, t = an ? an.t : 0;
    // portiere (si tuffa) e squadre
    let ky = 150, kx = 326, ka = -8; if (an && an.kind === "att") { if (an.res === "goal") { kx = 326 - Math.min(14, t * 0.7); ky = 150 - Math.min(10, t * 0.5); } else if (an.res !== "stall") { kx = 322; ky = 142; ka = -16; } } if (an && an.kind === "def" && an.how === "jump" && t > 4) { ky = 150 - Math.sin(Math.min(1, t / 28) * Math.PI) * 38; ka = -18; }
    const phaseA = (st.turns[st.t] === "A") || (an && an.kind === "att");
    M.man(g, kx, ky, { col: phaseA ? "#92400e" : "#1d4ed8", ring: phaseA ? "#fdba74" : "#fbbf24", rw: 2.4, icon: phaseA ? "🤖" : "🧤", arms: ka, s: 1.15 });
    if (phaseA) M.man(g, 78, 160, { col: "#1d4ed8", ring: "#fbbf24", rw: 2.6, icon: "⚽", arms: 2, s: 1.2 }); else M.man(g, 70, 152, { col: "#7f1d1d", ring: "#fca5a5", rw: 2.6, icon: "🦾", arms: -4, s: 1.7 });
    // pressione / carica
    if (st.phase === "bar" || (an && an.kind === "att") || demo === "bar") gauge(g, st, f); if (st.phase === "def" || demo === "def") { const fp = st.fp | 0; g.fillStyle = "#1a100a"; g.strokeStyle = "#a15a22"; g.lineWidth = 2; g.beginPath(); g.roundRect(36, 8, 308, 28, 8); g.fill(); g.stroke(); g.fillStyle = fp >= 62 ? "#dc2626" : "#f59e0b"; g.fillRect(40, 12, 300 * fp / 100 * (0.8 + 0.2 * Math.sin(f * 0.3)), 20); g.fillStyle = "#fff"; g.font = "900 12px system-ui"; g.textAlign = "center"; g.fillText(`Il Gigante carica: potenza ${fp}`, 190, 27); }
    // palla
    let bx = phaseA ? 108 : 100, by = 168, sm = 0;
    if (an) { const k = Math.min(1, t / 30), tgt = an.kind === "att" ? (an.res === "goal" ? [336, 118] : an.res === "stall" ? [112, 168] : [322, 142]) : (an.how === "jet" ? [268, 150] : an.res === "goal" ? [336, 130] : an.how === "jump" ? [326, 120] : [310, 150]); bx = (phaseA ? 108 : 100) + (tgt[0] - (phaseA ? 108 : 100)) * k; by = 168 + (tgt[1] - 168) * k - Math.sin(k * Math.PI) * 26; if (an.res === "stall") { bx = 110; by = 166; } if (an.kind === "def" && an.res === "save" && an.how === "vent" && t > 30) { bx -= (t - 30) * 3; by += 0; } }
    if (an && an.res === "stall") for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(210,210,210,${0.5 - i * 0.07})`; g.beginPath(); g.arc(112 + i * 4, 160 - i * 7 - t * 0.4, 7 + i * 2, 0, 7); g.fill(); }
    if (an && an.kind === "def" && an.how === "jet") { for (let i = 0; i < 7; i++) { g.fillStyle = `rgba(220,220,220,${0.35})`; g.beginPath(); g.arc(250 + (i % 3) * 18, 130 + Math.floor(i / 3) * 14 + Math.sin(f * 0.1 + i) * 3, 14 + (i % 2) * 5, 0, 7); g.fill(); } }
    if (!(an && an.res === "stall" && false)) { g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(bx, 172, 6, 2.2, 0, 0, 7); g.fill(); for (let i = 1; i < 5; i++) { g.fillStyle = `rgba(255,255,255,${0.35 / i})`; g.beginPath(); g.arc(bx - i * 6, by + 3, 5 - i * 0.6, 0, 7); g.fill(); } g.fillStyle = "#e5e7eb"; g.strokeStyle = "#222"; g.lineWidth = 1.2; g.beginPath(); g.arc(bx, by, 6, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#b45309"; g.fillRect(bx - 2, by - 1, 4, 2); }
    st.fxo.tick(); st.fxo.draw(g);
  }
  // ------------------------------------------------------------ interfaccia
  function hud() { ui.hud.innerHTML = `<b>Noi ${S.a}</b> · <b>Loro ${S.b}</b><span class="bar"><i style="width:${Math.min(100, S.t / S.turns.length * 100)}%"></i></span><span>💨 ${S.jets}</span><span>Turno ${Math.min(S.t + 1, S.turns.length)}/${S.turns.length}${S.extra ? " (suppl.)" : ""}</span>`; }
  function controls() {
    const end = S.phase === "end", att = S.turns[S.t] === "A", mate = esc(S.o.mate || "Brontolo"), opp = esc(S.o.oppName || "i Giganti");
    let h = "";
    if (S.phase === "bar") h = `<button id="stStop" style="flex-basis:100%;min-height:64px;font-size:18px">🔥 FERMA LA PRESSIONE</button>${S.jets > 0 && !S.jet ? `<button id="stJet">💨 Getto di fumo<small>il portiere vede peggio · cariche ${S.jets}</small></button>` : ""}`;
    else if (S.phase === "def") h = `<button data-d="jet" ${S.jets <= 0 ? "disabled" : ""}>💨 Getto di fumo<small>disorienta il tiro · cariche ${S.jets}</small></button><button data-d="jump" ${S.jets <= 0 ? "disabled" : ""}>🚀 Salto propulso<small>para quasi sempre · cariche ${S.jets}</small></button><button data-d="vent">♨️ Sfiato<small>gratis, ma i tiri forti passano</small></button>`;
    else if (end) h = S.practice ? "" : `<button class="go" id="stGo">Fine ▸</button>`; else if (S.phase === "pend" && S.practice && S.done) h = `<button class="go" id="stRe">↺ Riprova</button><button class="go" id="stGo2">▶ Gioca davvero</button>`;
    ui.bt.innerHTML = h; ui.lg.textContent = S.log || (att ? `Attacco: ${S.o.mate || "Brontolo"} contro ${S.o.oppName || "i Giganti"}. Premi FERMA quando la lancetta è nella zona verde.` : `Difesa: ${S.o.oppName || "i Giganti"} attaccano.`);
    const sb = ui.bt.querySelector("#stStop"); if (sb) sb.onclick = shoot; const jb = ui.bt.querySelector("#stJet"); if (jb) jb.onclick = () => { S.jets--; S.jet = true; S.log = "Un getto di fumo avvolge la porta."; controls(); hud(); };
    ui.bt.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => defend(b.dataset.d))); const g = ui.bt.querySelector("#stGo"); if (g) g.onclick = close; const re = ui.bt.querySelector("#stRe"); if (re) re.onclick = () => restart(true); const g2 = ui.bt.querySelector("#stGo2"); if (g2) g2.onclick = () => restart(false);
  }
  // ------------------------------------------------------------ logica
  function after(ms, fn) { clearTimeout(tm); tm = setTimeout(fn, ms); }
  function score(win, line, res) { if (win && !S.practice) S.a++; S.log = line; S.anim = { kind: "att", res: win ? "goal" : res, t: 0 }; S.fxo.banner(win ? "GOL!" : res === "stall" ? "STALLO!" : "PARATA!", win ? "#fde047" : "#f87171"); if (win) S.fxo.burst(330, 120, 40, ["#fde047", "#fff", "#fb923c"]); S.phase = "anim"; hud(); controls(); after(1250, next); }
  function shoot() {
    if (S.phase !== "bar") return; const p = S.pos | 0, ks = S.jet ? 0.06 : keeper(); S.jet = false;
    if (p > 90) return score(false, `Pressione ${p}: stallo! La caldaia sbuffa e il tiro muore ai piedi.`, "stall");
    const pr = p >= 62 ? 1 - ks : p >= 30 ? 0.35 : 0, ok = Math.random() < pr;
    score(ok, ok ? `Pressione ${p}: GOL! Il pallone esce a vapore e scuote la rete.` : p < 30 ? `Pressione ${p}: tiro debole, il portiere lo ferma con un guanto.` : `Pressione ${p}: parato. Il portiere non ha ceduto.`, "save");
  }
  function defend(k) {
    if (S.phase !== "def") return; if (k !== "vent" && S.jets <= 0) return; if (k !== "vent") S.jets--;
    const pr = k === "jump" ? 0.12 : k === "jet" ? 0.2 : S.fp >= 62 ? 0.7 : 0.4, ok = Math.random() < pr;
    if (ok && !S.practice) S.b++; S.log = ok ? `Il tiro (${S.fp}) passa: gol per loro.` : k === "jump" ? "Salto propulso: parata spettacolare." : k === "jet" ? "Il getto di fumo li disorienta: il tiro si spegne." : "Sfiato giusto: il tiro rimbalza sul petto.";
    S.anim = { kind: "def", res: ok ? "goal" : "save", how: k, t: 0 }; S.fxo.banner(ok ? "GOL LORO" : "PARATO!", ok ? "#f87171" : "#86efac"); S.phase = "anim"; hud(); controls(); after(1350, next);
  }
  function next() {
    if (!S) return; S.anim = null; S.t++; S.jet = false;
    if (S.practice) { if (S.t >= S.turns.length) { S.phase = "pend"; S.done = true; S.log = (S.log ? S.log + " " : "") + "Prova finita: riprova o gioca davvero."; hud(); return controls(); } }
    else if (S.t >= S.turns.length) { if (S.a === S.b && S.extra < 3) { S.extra++; S.turns.push("A", "D"); S.log += " Pari: turno supplementare!"; } else return endMatch(); }
    S.phase = S.turns[S.t] === "A" ? "bar" : "def"; if (S.phase === "def") S.fp = foePower(); S.pos = 0; S.dir = 1; if (S.phase === "bar") S.log = ""; hud(); controls();
  }
  function endMatch() { clearTimeout(tm); closeTutQuiet(); S.phase = "end"; S.anim = null; if (S.a === S.b) S.a++; const w = S.a > S.b; S.log = (S.log ? S.log + " " : "") + (w ? "Vittoria! La fonderia vibra di vapore." : "Sconfitta. Il vapore si ritira in silenzio."); S.fxo.banner(w ? "VITTORIA!" : "SCONFITTA", w ? "#fde047" : "#f87171"); if (w) S.fxo.burst(W / 2, 90, 50, ["#fde047", "#fb923c", "#fff"]); hud(); controls(); }
  function restart(practice) { clearTimeout(tm); const o = S.o; S = mk(o, practice); hud(); controls(); }
  function closeTutQuiet() { if (tutC) tutC.close(); tutC = null; }
  function close() { clearTimeout(tm); if (!S) return; const o = S.o, r = { win: S.a > S.b, a: S.a, b: S.b, recap: "" }; cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__steam.state = null; if (o.onDone) o.onDone(r); }
  function mk(o, practice) { return { o, turns: practice ? ["A", "D"] : ["A", "D", "A", "D", "A", "D"], t: 0, a: 0, b: 0, jets: practice ? 9 : 4, jet: false, extra: 0, phase: "bar", log: practice ? "Prova libera: un attacco e una difesa, i punti non contano." : "", pos: 0, dir: 1, fp: 60, anim: null, fxo: M.fx(), practice: !!practice, done: false, acc: 0, last: performance.now() }; }
  // ------------------------------------------------------------ spiegazione
  const dm = (over) => Object.assign({ turns: ["A"], t: 0, phase: "bar", pos: 0, anim: null, fxo: M.fx(), fp: 70, o: {} }, over || {});
  const PAGES = [
    { t: "Tira: ferma la pressione", p: "In attacco la lancetta della pressione sale e scende. Premi <b>FERMA</b> quando è nella zona <b style='color:#86efac'>verde (62-90)</b>: tiro forte. Giallo: tiro debole. <b style='color:#fca5a5'>Rosso (oltre 90): stallo</b>, la caldaia si blocca e il tiro muore.", draw: (g, f) => { const st = dm(); st.pos = 50 + 48 * Math.sin(f * 0.04); scene(g, st, f, "bar"); } },
    { t: "Difendi dal Gigante", p: "Quando attaccano loro, un Gigante carica un tiro con una <b>potenza</b>. Scegli come rispondere: <b>Getto di fumo</b> (disorienta il tiro), <b>Salto propulso</b> (para quasi sempre), <b>Sfiato</b> (gratis, ma i tiri forti sopra 62 passano quasi sempre).", draw: (g, f) => { const st = dm({ phase: "def", turns: ["D"] }); st.fp = 40 + Math.floor((f / 4) % 55); scene(g, st, f, "def"); } },
    { t: "Cariche e punti", p: "Le <b>cariche 💨</b> sono solo 4 per tutta la partita: servono per Getto di fumo e Salto propulso in difesa, o per un Getto in attacco (il portiere vede peggio). Si giocano 3 attacchi e 3 difese: vince chi segna di più, se è pari c'è un turno supplementare.", draw: (g, f) => { const st = dm(); st.pos = 70; st.anim = { kind: "att", res: "goal", t: (f % 90) }; scene(g, st, f, "bar"); } },
  ];
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop); const now = performance.now(); S.f = (S.f || 0) + 1; S.acc += Math.min(100, now - S.last); S.last = now;
    if (S.phase === "bar" && !(tutC && tutC.open)) { const sp = 1.7 + 0.5 * lv(); while (S.acc >= 30) { S.acc -= 30; S.pos += S.dir * sp; if (S.pos >= 100) { S.pos = 100; S.dir = -1; } else if (S.pos <= 0) { S.pos = 0; S.dir = 1; } } } else S.acc = 0;
    if (S.anim) S.anim.t++; scene(ui.g, S, S.f);
  }
  function start(o) {
    cancelAnimationFrame(raf); clearTimeout(tm); if (ui) ui.root.remove(); ui = M.shell("stOv", "♨️ " + (o.title || "Steam Strikers"), "#fbbf24"); ui.root.style.background = "linear-gradient(#2a1a10,#4a2a14)";
    S = mk(o, false); tutC = null;
    ui.help.onclick = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "steam", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } }); };
    ui.cv.addEventListener("pointerdown", () => { if (S && S.phase === "bar" && !(tutC && tutC.open)) shoot(); });
    window.__steam.state = { finish: (a, b) => { if (!S) return; S.a = a; S.b = b; endMatch(); }, tut: () => !!(tutC && tutC.open), get a() { return S.a; }, get b() { return S.b; }, get phase() { return S.phase; }, get practice() { return S.practice; }, get pos() { return S.pos; } };
    hud(); controls(); loop();
    if (o.tutorial !== false && !M.seen("steam")) tutC = M.tut({ root: ui.root, key: "steam", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } });
    return true;
  }
  window.__steam = { start, state: null };
})();
