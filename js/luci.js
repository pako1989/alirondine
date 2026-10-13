// js/luci.js - «LUCI» · la partita originale di «La Notte dei Lampioni» (motore proprio, NON il kit di partita)
// Si gioca di notte, su un campo a caselle (7 × 9), A TURNI e AL BUIO. Si vede solo dove c'è luce: un piccolo alone
// intorno ai tuoi giocatori e le LANTERNE che posi (poche per azione). Le OMBRE avversarie si muovono nel buio.
//  - IN ATTACCO: tocca una casella vicina per portare palla, tocca un compagno per passare (se nel buio c'è un'ombra
//    sulla traiettoria, il passaggio è intercettato), e quando sei vicino alla porta tocca la porta per tirare
//    (il portiere para se è nella colonna del tiro). Se un'ombra arriva sulla tua casella, ti ruba palla.
//  - IN DIFESA: l'attaccante ombra scende verso la tua porta, nascosto. Tocca un tuo difensore e poi una casella vicina
//    per spostarlo: se lo raggiungi (o lui finisce su di te), la palla è tua. Se arriva in fondo, è gol.
//  - 🏮 LANTERNA: tocca il pulsante e poi una casella: si illumina un quadrato 3 × 3 per tutta l'azione.
// Grafica: buio vero con gli aloni delle lanterne, le ombre che si vedono solo nella luce, lucciole e fiammelle.
// Uso: window.__luci.start({ title, us, opp:{ name, color }, mates:[{ name }], lanterns, actions, intro, onDone })
(function () {
  "use strict";
  if (window.__luci) return;
  const CW = 7, CH = 9, CS = 32, W = CW * CS, H = CH * CS, GOAL = [2, 3, 4];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const sgn = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);
  let STATE = null;
  function start(o) {
    if (document.querySelector(".luOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const usCol = o.usColor || "#ffd27a", oppCol = (o.opp && o.opp.color) || "#6a7aa8";
    const mates = (o.mates || [{ name: "Fiamma" }, { name: "Lume" }]).map((m) => m.name || m);
    const hard = DF.opp > 1.05 ? 1 : DF.opp < 0.95 ? -1 : 0, nAct = o.actions || 6, TURNS = o.turns || 8, LAN = (o.lanterns || 3) - (hard > 0 ? 1 : 0) + (hard < 0 ? 1 : 0);
    const S = { o, a: 0, b: 0, act: -1, phase: "intro", t: 0, mode: "move", sel: -1, lit: [], turns: 0, lan: LAN, us: [], them: [], gk: 3, ball: 0, msgT: "", fx: [], over: false, extra: 0, data: { lanterne: 0, rubate: 0, perse: 0, tiri: 0 } };
    STATE = S;
    // ------------------------------------------------------------ interfaccia
    css();
    const el = document.createElement("div"); el.className = "luOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="info"><span class="ph"></span><span class="tl"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas>
<div class="msg"></div><div class="pad"><button type="button" class="lan">🏮 LANTERNA</button><button type="button" class="quit">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = (o.opp && o.opp.name) || "Le Ombre";
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", oppCol);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__luAC = window.__luAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "sine"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (t) => { S.msgT = t; el.querySelector(".msg").innerHTML = t; };
    const att = () => S.act % 2 === 0;
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`;
      el.querySelector(".ph").textContent = S.act < 0 ? "" : `${att() ? "ATTACCO" : "DIFESA"} · azione ${S.act + 1}${S.act >= nAct ? " (supplementare)" : `/${nAct}`}`;
      el.querySelector(".tl").textContent = S.act < 0 ? "" : `🏮 ${S.lan} · turni ${Math.max(0, TURNS - S.turns)}`;
      const b = el.querySelector(".lan"); b.disabled = S.phase !== "play" || S.lan <= 0; b.classList.toggle("on", S.mode === "lan");
    };
    // ------------------------------------------------------------ luce
    const litAt = (c, r) => S.lit.some(([lc, lr]) => Math.abs(lc - c) <= 1 && Math.abs(lr - r) <= 1) || S.us.some((p) => Math.abs(p.c - c) <= (p.hero ? 1 : 0) && Math.abs(p.r - r) <= (p.hero ? 1 : 0));
    // ------------------------------------------------------------ azioni
    function nextAction() {
      if (S.over) return;
      if (S.act + 1 >= nAct + S.extra) { if (S.a === S.b && S.extra < 2 && o.extra !== false) S.extra += 2; else return finish(); }
      S.act++; S.turns = 0; S.lit = []; S.lan = LAN; S.mode = "move"; S.sel = -1; S.fx = [];
      const n = 3 + (hard > 0 ? 1 : 0);
      if (att()) {
        S.us = [{ c: 3, r: 7, hero: true, name: "Tu" }, { c: 1, r: 6, name: mates[0] }, { c: 5, r: 6, name: mates[1] || mates[0] }]; S.ball = 0;
        S.them = Array.from({ length: n }, (_, i) => ({ c: [1, 3, 5, 2][i] + (Math.random() < 0.5 ? 0 : 1) * (i === 3 ? 1 : 0), r: [3, 2, 3, 4][i] })); S.gk = 3;
        msg("Attacco nel buio. Tocca una casella vicina per avanzare, un compagno per passare, la porta per tirare. 🏮 per illuminare.");
      } else {
        S.us = [{ c: 2, r: 6, name: mates[0] }, { c: 4, r: 6, name: mates[1] || mates[0] }, { c: 3, r: 4, hero: true, name: "Tu" }];
        S.them = [{ c: Math.floor(Math.random() * 5) + 1, r: 0, carrier: true }]; S.ball = -1;
        msg("Difesa: l'ombra con la palla scende verso la tua porta, nascosta. Tocca un tuo giocatore, poi una casella vicina. 🏮 per vederla.");
      }
      S.phase = "play"; tone(330, 0.2, "triangle"); hud();
    }
    function endAction(text) { S.phase = "pausa"; S.t = 0; msg(text); hud(); }
    function tap(c, r) {
      if (S.phase !== "play" || S.over || c < 0 || r < 0 || c >= CW || r >= CH) return false;
      if (S.mode === "lan") { if (S.lan <= 0) return false; S.lit.push([c, r]); S.lan--; S.data.lanterne++; S.mode = "move"; tone(880, 0.12, "triangle", 0.03); S.fx.push({ c, r, t: 30 }); hud(); return true; }
      return att() ? tapAtt(c, r) : tapDef(c, r);
    }
    function tapAtt(c, r) {
      const car = S.us[S.ball];
      if (r === 0 && GOAL.includes(c) && car.r <= 3) { // tiro
        S.data.tiri++; const saved = S.gk === c || (hard > 0 && Math.abs(S.gk - c) <= 0 && Math.random() < 0.2);
        if (saved) { tone(160, 0.3, "sawtooth"); return endAction("PARATA! Il portiere era proprio lì, nel buio."); }
        S.a++; [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.16, "triangle", 0.05), i * 90)); return endAction("<b>GOL!</b> La rete si accende come un lampione.");
      }
      const mi = S.us.findIndex((p, i) => i !== S.ball && p.c === c && p.r === r);
      if (mi >= 0) { // passaggio: la traiettoria attraversa le caselle in mezzo
        const steps = Math.max(Math.abs(c - car.c), Math.abs(r - car.r)), blk = [];
        for (let k = 1; k < steps; k++) { const pc = Math.round(car.c + ((c - car.c) * k) / steps), pr = Math.round(car.r + ((r - car.r) * k) / steps); blk.push([pc, pr]); }
        const cut = S.them.find((t) => blk.some(([pc, pr]) => pc === t.c && pr === t.r));
        if (cut) { S.data.perse++; tone(140, 0.3, "sawtooth"); return endAction("Intercettato! Nel buio, sulla traiettoria, c'era un'ombra."); }
        S.ball = mi; tone(660, 0.08, "triangle"); return afterMove();
      }
      if (Math.max(Math.abs(c - car.c), Math.abs(r - car.r)) !== 1 || S.us.some((p) => p.c === c && p.r === r)) return false;
      const bump = S.them.find((t) => t.c === c && t.r === r);
      if (bump) { S.lit.push([c, r]); S.fx.push({ c, r, t: 30, bad: true }); tone(200, 0.12, "square", 0.03); msg("Bum! Nel buio c'era un'ombra: ora la vedi. Hai perso il turno, non la palla."); return afterMove(); }
      car.c = c; car.r = r; tone(440, 0.05, "triangle", 0.03); return afterMove();
    }
    function afterMove() {
      S.turns++; const car = S.us[S.ball];
      if (S.them.some((t) => t.c === car.c && t.r === car.r)) return stolen();
      // le ombre si muovono verso chi ha la palla (in pressing tutte, altrimenti le più vicine)
      S.them.forEach((t) => { const d = Math.max(Math.abs(t.c - car.c), Math.abs(t.r - car.r)), reach = style === "pressing" ? 4 : 3; if (d > reach) return; if (style === "difensiva" && t.r < 2 && car.r > 3) return;
        if (Math.random() > 0.5 + hard * 0.15 + (style === "pressing" ? 0.12 : 0)) return; // nel buio non sempre ti trovano
        t.c += sgn(car.c - t.c); t.r += sgn(car.r - t.r); });
      S.gk += sgn(Math.max(2, Math.min(4, car.c)) - S.gk) * (Math.random() < 0.7 + hard * 0.15 ? 1 : 0);
      if (S.them.some((t) => t.c === car.c && t.r === car.r)) return stolen();
      if (S.turns >= TURNS) return endAction("Il tempo dell'azione è finito. La palla torna nel buio.");
      hud(); return true;
    }
    function stolen() { S.data.perse++; tone(140, 0.3, "sawtooth"); S.fx.push({ c: S.us[S.ball].c, r: S.us[S.ball].r, t: 40, bad: true }); return endAction("Un'ombra ti ha rubato palla, uscendo dal buio."); }
    function tapDef(c, r) {
      const pi = S.us.findIndex((p) => p.c === c && p.r === r);
      if (pi >= 0) { S.sel = pi; tone(520, 0.05, "triangle", 0.03); hud(); return true; }
      if (S.sel < 0) return false; const p = S.us[S.sel]; if (Math.max(Math.abs(c - p.c), Math.abs(r - p.r)) !== 1) return false;
      p.c = c; p.r = r; S.turns++; const car = S.them[0];
      if (car.c === p.c && car.r === p.r) return won();
      // l'ombra scende verso la porta, evitando i difensori che vede (quelli nella luce o vicini)
      const opts = [[0, 1], [-1, 1], [1, 1], [-1, 0], [1, 0]].map(([dc, dr]) => [car.c + dc, car.r + dr]).filter(([nc, nr]) => nc >= 0 && nc < CW && nr < CH);
      const score = ([nc, nr]) => nr * 3 - Math.abs(nc - 3) * (nr > 5 ? 1.5 : 0.3) - S.us.reduce((s, q) => s + (Math.max(Math.abs(q.c - nc), Math.abs(q.r - nr)) <= 1 ? (Math.random() < 0.6 + hard * 0.2 ? 6 : 0) : 0), 0) + Math.random() * (1.5 - hard * 0.5);
      const best = opts.sort((a, b) => score(b) - score(a))[0]; if (best) { car.c = best[0]; car.r = best[1]; }
      if (S.us.some((q) => q.c === car.c && q.r === car.r)) return won();
      if (car.r >= CH - 1) { if (GOAL.includes(car.c)) { S.b++; tone(140, 0.4, "sawtooth", 0.05); return endAction("<b>GOL DELLE OMBRE.</b> È sbucata dal buio proprio davanti alla porta."); } car.r = CH - 2; car.c += sgn(3 - car.c); }
      if (S.turns >= TURNS) return endAction("L'ombra si perde nel buio: azione finita, nessun gol.");
      hud(); return true;
    }
    function won() { S.data.rubate++; tone(700, 0.15, "triangle"); S.fx.push({ c: S.them[0].c, r: S.them[0].r, t: 40 }); return endAction("Presa! La palla è tua: l'ombra torna nel buio, sorridendo."); }
    // ------------------------------------------------------------ ciclo e disegno
    function tick() { S.t++; if (S.phase === "pausa" && S.t > 70) nextAction(); }
    function draw() {
      g.setTransform(2, 0, 0, 2, 0, 0);
      g.fillStyle = "#1e3a22"; g.fillRect(0, 0, W, H);
      for (let r = 0; r < CH; r++) for (let c = 0; c < CW; c++) { g.fillStyle = (r + c) % 2 ? "rgba(255,255,255,.025)" : "rgba(0,0,0,.04)"; g.fillRect(c * CS, r * CS, CS, CS); }
      g.strokeStyle = "rgba(230,240,220,.35)"; g.lineWidth = 1.5; g.strokeRect(4, 4, W - 8, H - 8); g.beginPath(); g.moveTo(4, H / 2); g.lineTo(W - 4, H / 2); g.stroke();
      const top = att(); [0, CH - 1].forEach((r) => { g.fillStyle = (r === 0) === top ? "rgba(255,255,255,.75)" : "rgba(255,210,122,.75)"; g.fillRect(GOAL[0] * CS + 4, r === 0 ? 0 : H - 5, CS * 3 - 8, 5); });
      const P = (c, r) => [c * CS + CS / 2, r * CS + CS / 2];
      // i nostri
      if (S.act >= 0) {
        S.us.forEach((p, i) => { const [x, y] = P(p.c, p.r); g.fillStyle = usCol; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.strokeStyle = i === S.sel && !att() ? "#fff" : "#2a1a0a"; g.lineWidth = i === S.sel && !att() ? 3 : 1.5; g.stroke(); g.fillStyle = "#2a1a0a"; g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillText(p.hero ? "TU" : String(p.name).slice(0, 5), x, y + 18); g.textAlign = "left"; });
        if (att()) { const car = S.us[S.ball], [x, y] = P(car.c, car.r); g.fillStyle = "#fff"; g.beginPath(); g.arc(x + 7, y - 7, 4, 0, 7); g.fill(); }
        // le ombre: si vedono solo nella luce
        S.them.forEach((t) => { if (!litAt(t.c, t.r) && S.phase === "play") return; const [x, y] = P(t.c, t.r); g.fillStyle = oppCol; g.globalAlpha = 0.85; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); g.globalAlpha = 1; g.fillStyle = "#fff8c8"; g.fillRect(x - 4, y - 2, 2, 2); g.fillRect(x + 2, y - 2, 2, 2); if (t.carrier) { g.fillStyle = "#fff"; g.beginPath(); g.arc(x + 7, y + 7, 4, 0, 7); g.fill(); } });
        if (att() && (litAt(S.gk, 0) || S.phase !== "play")) { const [x, y] = P(S.gk, 0); g.fillStyle = oppCol; g.beginPath(); g.arc(x, y + 4, 9, 0, 7); g.fill(); g.fillStyle = "#fff8c8"; g.fillRect(x - 4, y + 2, 2, 2); g.fillRect(x + 2, y + 2, 2, 2); }
      }
      // il buio, con gli aloni delle lanterne e dei giocatori
      const dark = S.dark || (S.dark = Object.assign(document.createElement("canvas"), { width: W, height: H })), d = dark.getContext("2d"); d.globalCompositeOperation = "source-over"; d.clearRect(0, 0, W, H); d.fillStyle = S.phase === "play" ? "rgba(3,5,16,.93)" : "rgba(3,5,16,.35)"; d.fillRect(0, 0, W, H); d.globalCompositeOperation = "destination-out";
      const hole = (x, y, r) => { const gr = d.createRadialGradient(x, y, r * 0.3, x, y, r); gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)"); d.fillStyle = gr; d.fillRect(x - r, y - r, r * 2, r * 2); };
      S.lit.forEach(([c, r]) => { const [x, y] = P(c, r); hole(x, y, CS * 1.9 * (1 + Math.sin(S.t / 8 + c) * 0.04)); }); S.us.forEach((p) => { const [x, y] = P(p.c, p.r); hole(x, y, p.hero ? CS * 1.6 : CS * 0.75); });
      g.drawImage(dark, 0, 0, W, H);
      g.save(); g.globalCompositeOperation = "lighter"; S.lit.forEach(([c, r]) => { const [x, y] = P(c, r), gr = g.createRadialGradient(x, y, 1, x, y, CS * 1.4); gr.addColorStop(0, "rgba(255,190,90,.35)"); gr.addColorStop(1, "rgba(255,190,90,0)"); g.fillStyle = gr; g.fillRect(x - CS * 1.5, y - CS * 1.5, CS * 3, CS * 3); }); g.restore();
      S.lit.forEach(([c, r]) => { const [x, y] = P(c, r); g.fillStyle = "#5a3a1a"; g.fillRect(x - 1, y - 2, 2, 8); g.fillStyle = "#ffd27a"; g.fillRect(x - 3, y - 8, 6, 6); });
      // lucciole
      for (let i = 0; i < 10; i++) { const a = 0.3 + 0.4 * Math.sin(S.t / 12 + i * 2); g.fillStyle = `rgba(220,255,150,${a})`; g.fillRect((i * 37 + Math.sin(S.t / 30 + i) * 10 + W) % W, (i * 53 + S.t * 0.2) % H, 2, 2); }
      S.fx = S.fx.filter((f) => f.t-- > 0); S.fx.forEach((f) => { const [x, y] = P(f.c, f.r); g.strokeStyle = f.bad ? `rgba(255,90,90,${f.t / 40})` : `rgba(255,230,140,${f.t / 30})`; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 14 + (30 - f.t) * 0.6, 0, 7); g.stroke(); });
      if (S.mode === "lan" && S.phase === "play") { g.fillStyle = "#ffd27a"; g.font = "bold 9px sans-serif"; g.fillText("TOCCA DOVE POSARE LA LANTERNA", 22, H - 12); }
    }
    function loop() { if (!el.isConnected) return; if (S.phase !== "intro" && !S.over) tick(); draw(); S.raf = requestAnimationFrame(loop); }
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(); tap(Math.floor(((e.clientX - r.left) / r.width) * CW), Math.floor(((e.clientY - r.top) / r.height) * CH)); });
    el.querySelector(".lan").addEventListener("pointerdown", (e) => { e.preventDefault(); if (S.phase === "play" && S.lan > 0) { S.mode = S.mode === "lan" ? "move" : "lan"; hud(); } });
    el.querySelector(".quit").addEventListener("pointerdown", (e) => { e.preventDefault(); finish(true); });
    // ------------------------------------------------------------ fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: S.data };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Lanterne ${S.data.lanterne} · Palle rubate ${S.data.rubate} · Palle perse ${S.data.perse} · Tiri ${S.data.tiri}</p>`, "Continua ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.tap = tap; S.lanMode = () => { S.mode = "lan"; };
    card(o.title || "Luci", `${o.intro || ""}<p><b>Come si gioca</b>: è notte, si vede solo dove c'è luce. <b>In attacco</b> tocca una casella vicina per avanzare, un compagno per passare, la porta per tirare (da vicino). Le ombre nel buio rubano palle e intercettano. <b>In difesa</b> tocca un tuo giocatore, poi una casella vicina, e prendi l'ombra con la palla.</p><p><b>🏮 Lanterna</b>: illumina un quadrato 3 × 3 per tutta l'azione. Ne hai ${LAN} per azione.</p><p style="opacity:.8;font-size:12px">${nAct} azioni · 8 turni per azione · avversari: ${esc(style)}</p>`, "Accendi i lampioni ▸", () => { S.phase = "wait"; nextAction(); });
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("luCss")) return; const st = document.createElement("style"); st.id = "luCss";
    st.textContent = `.luOv{position:fixed;inset:0;z-index:300;background:radial-gradient(circle at 50% 30%,#1a1a3a,#05050e);display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:Georgia,serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#f0e8d0}
.luOv .hud{width:min(100%,380px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:1.5px solid #ffd27a55;border-radius:10px;background:#0e0e22;padding:3px 10px;font:700 13px Georgia,serif}
.luOv .hud .n0{color:var(--us)}.luOv .hud .n1{text-align:right;color:var(--opp)}.luOv .hud .sc{font:900 22px Georgia,serif;color:#ffd27a;text-shadow:0 0 8px #ffb84a}
.luOv .info{width:min(100%,380px);display:flex;justify-content:space-between;font-size:12px;color:#c8c0a8}
.luOv canvas{width:min(100%,380px,calc((100vh - 250px) * .778));height:auto;aspect-ratio:7/9;flex:none;border-radius:10px;border:1.5px solid #ffd27a44;background:#1e3a22;touch-action:none;box-shadow:0 0 30px #ffb84a22}
.luOv .msg{width:min(100%,380px);min-height:32px;font-size:12.5px;line-height:1.35;color:#e8e0c8}
.luOv .pad{width:min(100%,380px);display:grid;grid-template-columns:1fr 72px;gap:8px}
.luOv button{min-height:46px;border-radius:10px;border:1.5px solid #ffd27a66;background:#16162e;color:#ffd27a;font:800 14px Georgia,serif;cursor:pointer}.luOv button:disabled{opacity:.35}.luOv .lan.on{background:#ffd27a;color:#1a1a2a;box-shadow:0 0 14px #ffb84a}.luOv .quit{font-size:12px;color:#c8c0a8}
.luOv .ov{position:absolute;inset:0;background:rgba(5,5,14,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
.luOv .card{max-width:420px;width:100%;border:1.5px solid #ffd27a66;border-radius:12px;background:#0e0e22;padding:14px;box-shadow:0 0 30px #ffb84a22}.luOv .card h3{margin:0 0 8px;font:900 22px Georgia,serif;color:#ffd27a}.luOv .card p{margin:6px 0;font-size:14px;line-height:1.45}.luOv .card .big{font:900 32px Georgia,serif}.luOv .card button{width:100%;margin-top:10px;background:#ffd27a;color:#1a1a2a}`;
    document.head.appendChild(st);
  }
  window.__luci = { start, get state() { return STATE; } };
})();
