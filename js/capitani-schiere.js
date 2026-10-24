// js/capitani-schiere.js - «SCHIERE» · motore di scontro a turni per «Capitani di Ventura»
// Non è calcio: è la battaglia della compagnia. A ogni turno il nemico annuncia 1 o 2 ASSALTI (corsia + forza), che avanzano sul campo verso il tuo muro.
// Ogni compagno schierato va a DIFENDERE un assalto (forza + metà cuore) oppure ad ATTACCARE (tiro + metà ingegno): tocca la sua scheda per cambiare compito (⚔️ → 1 → 2 → ⚔️).
// Assalto non coperto = breccia (punto al nemico). Attacco che supera la difesa nemica = punto per noi (+4 = due punti).
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (un turno senza conseguenze); il «?» la riapre.
// Opzioni: members [{id,n,icon,role,s}], enemy {name, icon, atk:[base,grow], def:[base,grow], lanes:[..]}, rounds, tutorial (false = niente spiegazione), onDone({a,b,win}).
// Test: window.__schiere.state.finish(a, b) · pulsante #scGo. Richiede js/mini.js.
(function () {
  "use strict";
  if (window.__schiere) return;
  const M = window.__mini || {}, W = M.W || 380, H = M.H || 230, esc = M.esc || ((s) => String(s == null ? "" : s));
  const LANES = ["Sinistra", "Centro", "Destra"], LX = [70, 190, 310], WALL = 150;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  let S = null, ui = null, raf = 0, tutC = null;
  function mine(m) { const s = m.s || {}; return { atk: (s.tiro | 0) + Math.ceil((s.ingegno | 0) / 2), def: (s.forza | 0) + Math.ceil((s.cuore | 0) / 2) }; }
  function newRound() {
    const e = S.enemy, r = S.round, n = r >= 2 && Math.random() < 0.55 ? 2 : 1, lanes = (e.lanes || [0, 1, 2]).slice().sort(() => Math.random() - 0.5);
    S.assaults = Array.from({ length: n }, (_, i) => ({ lane: lanes[i], force: Math.max(2, rnd(e.atk[0], e.atk[0] + 2) + Math.floor(e.atk[1] * r) - (n > 1 ? 1 : 0)) }));
    S.eDef = rnd(e.def[0], e.def[0] + 2) + Math.floor(e.def[1] * r);
    S.asg = {}; S.members.forEach((m) => { S.asg[m.id] = "A"; }); S.res = null; S.rt = 0;
  }
  function totals(st) {
    const t = { A: 0, 0: 0, 1: 0 };
    st.members.forEach((m) => { const v = mine(m), k = st.asg[m.id]; if (k === "A") t.A += v.atk; else t[k] += v.def; });
    return t;
  }
  // ------------------------------------------------------------ disegno
  function terrain(g, f) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#3d6a37"); gr.addColorStop(1, "#27502a"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) { g.fillStyle = "rgba(196,160,96,.5)"; g.beginPath(); g.moveTo(LX[i] - 26, 40); g.lineTo(LX[i] + 26, 40); g.lineTo(LX[i] + 36, WALL); g.lineTo(LX[i] - 36, WALL); g.closePath(); g.fill(); }
    for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(0,0,0,.07)"; g.fillRect(((i * 97) % W), 40 + ((i * 53) % 110), 2, 2); }
    // accampamento nemico
    g.fillStyle = "#4a2a1a"; g.fillRect(0, 0, W, 40); for (let x = 12; x < W; x += 54) { g.fillStyle = "#7f1d1d"; g.beginPath(); g.moveTo(x, 34); g.lineTo(x + 18, 8); g.lineTo(x + 36, 34); g.closePath(); g.fill(); g.fillStyle = "#fca5a5"; g.fillRect(x + 17, 4, 2, 8); g.fillStyle = "#ef4444"; g.fillRect(x + 19, 4, 8 + Math.sin(f * 0.1 + x) * 2, 5); }
    // il nostro muro con tre porte
    g.fillStyle = "#6b6358"; g.fillRect(0, WALL, W, 22); g.fillStyle = "#8a8174"; for (let x = 0; x < W; x += 20) g.fillRect(x, WALL - 5, 12, 6);
    LX.forEach((x) => { g.fillStyle = "#2a1f16"; g.fillRect(x - 24, WALL, 48, 22); g.fillStyle = "#c8a060"; g.fillRect(x - 24, WALL, 48, 3); });
    g.fillStyle = "#2a3a22"; g.fillRect(0, WALL + 22, W, H - WALL - 22);
  }
  function scene(g, st, f, demo) {
    g.setTransform(M.SS, 0, 0, M.SS, 0, 0); g.clearRect(0, 0, W, H); terrain(g, f); const t = totals(st), res = st.res, rt = st.rt || 0;
    // assalti: soldati nemici che avanzano sulla corsia, con la forza sullo scudo
    st.assaults.forEach((a, i) => {
      const x = LX[a.lane]; let p = 0.12 + 0.03 * Math.sin(f * 0.05 + i), crash = 0;
      if (res) { const k = Math.min(1, rt / 34); p = 0.15 + k * 0.78; if (rt > 34) { if (res.def[i]) p = 0.93 - Math.min(0.55, (rt - 34) * 0.03); else p = 0.93 + Math.min(0.35, (rt - 34) * 0.02); crash = 1; } }
      const y = 52 + p * (WALL - 58); for (let k = 0; k < 3; k++) M.man(g, x + (k - 1) * 17, y + (k % 2) * 6, { col: "#b91c1c", ring: "#fca5a5", arms: -2, icon: "🗡️", s: 0.8 });
      const ok = t[i] >= a.force; g.fillStyle = res ? (res.def[i] ? "#166534" : "#991b1b") : "#7f1d1d"; g.strokeStyle = "#fca5a5"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x - 36, y - 38, 72, 18, 6); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillText(`Assalto ${i + 1} · ${a.force}`, x, y - 25);
      { g.fillStyle = ok ? "#14532d" : "#78350f"; g.strokeStyle = ok ? "#86efac" : "#fbbf24"; g.beginPath(); g.roundRect(x - 26, WALL + 28, 52, 18, 6); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.fillText(`🛡️ ${t[i]} ${ok ? "✔" : "⚠"}`, x, WALL + 40); }
    });
    // compagni: difensori alla porta, attaccanti davanti all'accampamento
    const ground = {}; st.members.forEach((m) => { const k = st.asg[m.id]; (ground[k] = ground[k] || []).push(m); });
    Object.keys(ground).forEach((k) => ground[k].forEach((m, j) => {
      const n = ground[k].length; let x, y, ar;
      if (k === "A") { x = W / 2 + (j - (n - 1) / 2) * 34; y = 78 + (j % 2) * 8; if (res && rt > 8) y -= Math.min(10, (rt - 8) * 0.6) * (res.attackOk ? 1 : 0.5); ar = -8 + Math.sin(f * 0.2 + j) * 3; } else { const lane = st.assaults[+k]; x = LX[lane ? lane.lane : 1] + (j - (n - 1) / 2) * 26; y = WALL + 18 + (j % 2) * 5; ar = 0; }
      M.man(g, x, y, { col: "#1d4ed8", ring: k === "A" ? "#fbbf24" : "#86efac", rw: 2.4, img: M.img(m.id), icon: m.icon, arms: ar, s: 1 });
    }));
    // attacco contro la difesa nemica
    g.fillStyle = "rgba(0,0,0,.55)"; g.strokeStyle = "#fbbf24"; g.lineWidth = 1.5; g.beginPath(); g.roundRect(W / 2 - 78, 46, 156, 18, 6); g.fill(); g.stroke(); g.fillStyle = "#fde68a"; g.font = "900 11px system-ui"; g.textAlign = "center"; g.fillText(`⚔️ Attacco ${t.A} contro 🛡️ ${res ? st.eDef : "?"}`, W / 2, 58.5);
    g.font = "16px serif"; g.textAlign = "left"; g.fillText(st.enemy.icon || "🐺", 4, 16); g.font = "900 10px system-ui"; g.fillStyle = "#fecaca"; g.fillText(String(st.enemy.name).slice(0, 18), 24, 14); g.textAlign = "center";
    if (res && rt > 34) { const hold = res.def.every((d) => d); if (rt < 70) { g.save(); g.globalAlpha = Math.min(1, (70 - rt) / 20); g.font = "900 28px system-ui"; g.lineWidth = 5; g.strokeStyle = "#000"; g.fillStyle = hold ? "#86efac" : "#f87171"; g.strokeText(hold ? "TENIAMO!" : "BRECCIA!", W / 2, 112); g.fillText(hold ? "TENIAMO!" : "BRECCIA!", W / 2, 112); g.restore(); } }
    st.fxo && st.fxo.tick(); st.fxo && st.fxo.draw(g);
  }
  // ------------------------------------------------------------ interfaccia
  function hud() { ui.hud.innerHTML = `<b>Noi ${S.a}</b> · <b>Loro ${S.b}</b><span class="bar"><i style="width:${Math.min(100, (S.round + (S.res ? 1 : 0)) / S.rounds * 100)}%"></i></span><span>Turno ${Math.min(S.round + 1, S.rounds)}/${S.rounds}${S.extra ? " (suppl.)" : ""}</span>`; }
  function controls() {
    const done = S.phase === "end", L = { A: "⚔️ Attacca", 0: "🛡️ Assalto 1", 1: "🛡️ Assalto 2" };
    ui.bt.innerHTML = (done ? "" : S.members.map((m) => { const v = mine(m), k = S.asg[m.id]; return `<button data-m="${esc(m.id)}" class="${k === "A" ? "" : "pw"}">${esc(m.icon)} ${esc(m.n)}<small>⚔️ ${v.atk} · 🛡️ ${v.def}</small><small><b>${L[k]}</b></small></button>`; }).join("")) + (S.practice && S.res ? `<button class="go" id="scRe">↺ Riprova</button><button class="go" id="scGo2">▶ Gioca davvero</button>` : `<button class="go" id="scGo" style="flex-basis:100%">${done ? "Fine ▸" : S.res ? "Turno successivo ▸" : "Avanti ▸ risolvi il turno"}</button>`);
    ui.bt.querySelectorAll("button[data-m]").forEach((b) => (b.onclick = () => { if (S.res || done) return; const id = b.dataset.m, n = S.assaults.length, k = S.asg[id], order = ["A"].concat(S.assaults.map((_, i) => String(i))); S.asg[id] = order[(order.indexOf(k) + 1) % order.length]; controls(); }));
    { const g1 = ui.bt.querySelector("#scGo"), re = ui.bt.querySelector("#scRe"), g2 = ui.bt.querySelector("#scGo2"); if (g1) g1.onclick = go; if (re) re.onclick = () => restart(true); if (g2) g2.onclick = () => restart(false); } ui.lg.textContent = S.log || "Tocca un compagno per cambiargli compito: ⚔️ attacca, oppure difende un assalto. Il numero accanto a 🛡️ deve arrivare alla forza dell'assalto.";
  }
  function go() {
    if (S.phase === "end") return close();
    if (S.res) { S.res = null; S.round++; if (S.round >= S.rounds + (S.extra ? 1 : 0)) return endMatch(); newRound(); S.log = ""; hud(); return controls(); }
    const t = totals(S), res = { def: [], attackOk: false }, line = [];
    S.assaults.forEach((a, i) => { const ok = t[i] >= a.force; res.def.push(ok); if (!ok) { if (!S.practice) S.b++; line.push(`Breccia a ${LANES[a.lane]}.`); } else line.push(pick([`${LANES[a.lane]} tiene.`, `Assalto respinto a ${LANES[a.lane]}.`])); });
    if (t.A >= S.eDef + 4) { if (!S.practice) S.a += 2; res.attackOk = true; line.push("Colpo doppio: la linea nemica cede."); } else if (t.A >= S.eDef) { if (!S.practice) S.a++; res.attackOk = true; line.push(pick(["Il nostro attacco passa.", "Punto per la Rondine."])); } else line.push(t.A ? "L'attacco si ferma sulle lance." : "Nessuno ha attaccato.");
    S.res = res; S.rt = 0; S.log = line.join(" ") + (S.practice ? " (prova: i punti non contano)" : ""); hud(); controls();
    if (!S.practice && S.round === S.rounds - 1 && !S.extra && S.a === S.b) { S.extra = true; S.log += " Pari: turno supplementare!"; controls(); }
  }
  function endMatch() { closeTutQuiet(); S.phase = "end"; S.res = null; S.log = S.a > S.b ? "Vittoria. La compagnia tiene il campo." : S.a === S.b ? "Pari: non basta." : "Sconfitta. Si ritirano in ordine (più o meno)."; S.fxo.banner(S.a > S.b ? "VITTORIA!" : S.a === S.b ? "PARI" : "SCONFITTA", S.a > S.b ? "#fde047" : "#f87171"); if (S.a > S.b) S.fxo.burst(W / 2, 90, 50, ["#fde047", "#86efac", "#fff"]); hud(); controls(); }
  function restart(practice) { const o = S.o; S = mk(o, practice); newRound(); hud(); controls(); }
  function closeTutQuiet() { if (tutC) tutC.close(); tutC = null; }
  function close() { if (!S) return; const o = S.o, r = { a: S.a, b: S.b, win: S.a > S.b, recap: "" }; cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = null; S = null; tutC = null; window.__schiere.state = null; if (o.onDone) o.onDone(r); }
  // ------------------------------------------------------------ spiegazione
  function demoSt(kind) {
    const members = [{ id: "d1", n: "Elio", icon: "🛡️", s: { forza: 5, cuore: 2, tiro: 1, ingegno: 1 } }, { id: "d2", n: "Nina", icon: "🏹", s: { forza: 1, cuore: 1, tiro: 6, ingegno: 2 } }, { id: "d3", n: "Bruno", icon: "⚔️", s: { forza: 4, cuore: 2, tiro: 3, ingegno: 1 } }];
    const st = { members, enemy: { name: "Nemico", icon: "🐺" }, eDef: 6, assaults: [{ lane: 0, force: 5 }, { lane: 2, force: 7 }], asg: { d1: "A", d2: "A", d3: "A" }, res: null, rt: 0, fxo: M.fx() };
    return st;
  }
  const PAGES = [
    { t: "Gli assalti", p: "Ogni turno il nemico annuncia 1 o 2 <b>assalti</b>: una corsia (Sinistra, Centro, Destra) e una <b>forza</b>. I soldati avanzano verso il tuo muro: per fermarli, sulla porta di quella corsia serve una difesa <b>almeno pari</b> alla forza (🛡️ ✔ verde; ⚠ giallo = non basta).", draw: (g, f) => { const st = demoSt(); st.members.forEach((m) => { st.asg[m.id] = "A"; }); st.asg.d1 = "0"; st.asg.d3 = "1"; scene(g, st, f, "enemy"); } },
    { t: "Assegna la compagnia", p: "Ogni compagno ha ⚔️ attacco e 🛡️ difesa. <b>Tocca la sua scheda</b> per cambiargli compito: ⚔️ attacca, oppure difende l'assalto 1 o 2. Chi attacca va davanti all'accampamento, chi difende alla porta.", draw: (g, f) => { const st = demoSt(), c = Math.floor(f / 80) % 3; st.asg.d1 = ["A", "0", "0"][c]; st.asg.d3 = ["A", "A", "1"][c]; scene(g, st, f, "assign"); } },
    { t: "Breccia e punti", p: "Assalto <b>non coperto</b> = breccia: punto al nemico. Il tuo attacco <b>supera la difesa nemica</b> (all'inizio nascosta, compare a fine turno) = punto per te, con +4 sono due punti. Vince chi ha più punti dopo i turni. Se rimani in pari c'è un turno supplementare.", draw: (g, f) => { const st = demoSt(); st.asg.d1 = "0"; st.asg.d3 = "A"; st.asg.d2 = "A"; const k = f % 220; st.res = k > 30 ? { def: [true, false], attackOk: true } : null; st.rt = Math.max(0, k - 30); if (k === 30 || !st.res) st.rt = 0; scene(g, st, f, "res"); } },
  ];
  function mk(o, practice) {
    const members = (o.members || []).slice(0, 5);
    return { o, members, enemy: Object.assign({ name: "Nemico", atk: [4, 0.6], def: [4, 0.5] }, o.enemy || {}), rounds: o.rounds || 6, round: 0, a: 0, b: 0, extra: false, phase: "play", log: practice ? "Prova libera: gioca un turno, i punti non contano." : "", res: null, rt: 0, practice: !!practice, fxo: M.fx() };
  }
  function loop() { if (!S) return; raf = requestAnimationFrame(loop); S.f = (S.f || 0) + 1; if (S.res) S.rt++; scene(ui.g, S, S.f); }
  function start(o) {
    if (!(o.members || []).length) return false;
    cancelAnimationFrame(raf); if (ui) ui.root.remove(); ui = M.shell("scOv", "⚔️ " + (o.title || "Schiere di Compagnia"), "#fbbf24"); ui.root.style.background = "#1b1410";
    S = mk(o, false); S.f = 0; newRound(); tutC = null;
    ui.help.onclick = () => { if (S && S.phase !== "end" && !(tutC && tutC.open)) tutC = M.tut({ root: ui.root, key: "schiere", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } }); };
    window.__schiere.state = { get a() { return S.a; }, get b() { return S.b; }, get practice() { return S.practice; }, tut: () => !!(tutC && tutC.open), finish: (a, b) => { S.a = a; S.b = b; endMatch(); } };
    hud(); controls(); loop();
    if (o.tutorial !== false && !M.seen("schiere")) tutC = M.tut({ root: ui.root, key: "schiere", pages: PAGES, onClose: (pr) => { tutC = null; if (pr) restart(true); } });
    return true;
  }
  window.__schiere = { start, state: null };
})();
