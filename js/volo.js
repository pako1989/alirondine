// js/volo.js - «VOLO A TUTTO CAMPO» · la partita originale di «Il Figlio del Titano» (motore proprio, NON il kit di partita)
// Si gioca in cielo, sopra le nuvole. Il tempo è FERMO mentre pianifichi: col dito DISEGNI la traiettoria del tuo volo
// (più è lunga, più ENERGIA costa). Quando lasci, il Campione la percorre a velocità supersonica e gli avversari si muovono
// per tagliarti la strada: le loro linee rosse ti dicono dove proveranno a intercettarti, e cambiano mentre disegni.
// Se la traiettoria finisce dentro la porta, è un tiro; se è lunghissima diventa SUPERSONICA e sfonda un contrasto.
// Quando la palla ce l'hanno loro, vedi la loro traiettoria con i tempi (un segno ogni attimo): disegna la tua per incrociarla
// nel punto giusto, nel momento giusto.
// Grafica: cielo stratificato con nuvole in parallasse, scie di velocità, «impact frame» stile animazione americana
// (un fotogramma in negativo con i contorni neri) nei gol e nei contrasti.
// Uso: window.__volo.start({ title, us, usColor, hero:{ name, skin, hair }, mates:[{ name }], opp:{ name, color, players:[{ name }], keeper:{ name } },
//   energy, minutes, oppStyle, intro, winTitle, onDone })
(function () {
  "use strict";
  if (window.__volo) return;
  const W = 320, H = 220, X0 = 12, X1 = 308, Y0 = 22, Y1 = 212, GY0 = 92, GY1 = 148, N = 60;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const plen = (p) => p.reduce((s, q, i) => (i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
  // la posizione lungo una traiettoria, a t fra 0 e 1 (velocità costante)
  function along(p, t) { const L = plen(p); if (!L) return { x: p[0][0], y: p[0][1] }; let d = L * Math.max(0, Math.min(1, t)); for (let i = 1; i < p.length; i++) { const s = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (d <= s) { const k = s ? d / s : 0; return { x: p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, y: p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k }; } d -= s; } const q = p[p.length - 1]; return { x: q[0], y: q[1] }; }
  let STATE = null;
  function start(o) {
    if (document.querySelector(".voOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.82 : 1;
    const hero = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14" }, o.hero || o.heroLook || {}), usCol = o.usColor || "#c83a2a";
    const opp = Object.assign({ name: "Avversari", color: "#3a4ab8", players: [], keeper: { name: "Il portiere" } }, o.opp || {});
    while (opp.players.length < 2) opp.players.push({ name: ["Il primo", "Il secondo"][opp.players.length] });
    const mate = (o.mates && o.mates[0]) || { name: "Il compagno" };
    const EMAX = o.energy || 100;
    const S = { o, a: 0, b: 0, min: 0, nMin: o.minutes || 90, phase: "intro", over: false, t: 0, en: EMAX, own: true, path: null, them: null, fly: null, fx: null, shield: false,
      hero: { x: 150, y: 117, p: hero }, mate: { x: 110, y: 70, p: mate }, ops: opp.players.slice(0, 2).map((p, i) => ({ x: 200 + i * 40, y: 80 + i * 70, p })), ourK: { x: X0 + 6, y: 120 }, theirK: { x: X1 - 6, y: 120 }, carrier: null,
      data: { voli: 0, supersonici: 0, intercetti: 0, tiri: 0, parate: 0 } };
    S.carrier = S.hero;
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "voOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="clock"></i><span class="en"><b></b></span><i class="el"></i></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || hero.name; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__voAC = window.__voAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.innerHTML = b.l; if (b.cls) x.className = b.cls; x.disabled = !!b.dis; x.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!x.disabled && !S.over) b.fn(); }); p.appendChild(x); }); };
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".clock").textContent = `${Math.min(S.nMin, Math.round(S.min))}'`; const c = cost(); el.querySelector(".en b").style.width = `${(S.en / EMAX) * 100}%`; el.querySelector(".en").style.setProperty("--c", `${Math.min(100, (c / EMAX) * 100)}%`); el.querySelector(".el").textContent = `ENERGIA ${Math.round(S.en)}${c ? " · volo " + Math.round(c) : ""}`; };
    const impact = (text, col) => { S.fx = { text, col: col || "#ffd23f", t: 0 }; };
    const supersonic = () => S.path && plen(S.path) > 210;
    const cost = () => (S.path ? (plen(S.path) / 3) * (supersonic() ? 1.4 : 1) : 0);
    const goalIn = (q, right) => (right ? q.x >= X1 - 14 : q.x <= X0 + 14) && q.y >= GY0 && q.y <= GY1;
    // ------------------------------------------------------------ le mosse dell'avversario
    function reactions() { // dove gli avversari proveranno a tagliarti la strada (cambia mentre disegni)
      const p = S.path; if (!p || p.length < 2) return S.ops.map((u) => ({ u, to: { x: u.x, y: u.y } }));
      return S.ops.map((u, i) => { let best = null; for (let k = 2; k <= N; k += 2) { const q = along(p, k / N), reach = (1.15 + (style === "pressing" ? 0.25 : 0)) * oppK * k * (i ? 0.9 : 1); if (Math.hypot(q.x - u.x, q.y - u.y) <= reach) { best = q; break; } } if (!best) { const q = along(p, 1); const d = Math.hypot(q.x - u.x, q.y - u.y), m = 1.15 * oppK * N; best = { x: u.x + (q.x - u.x) * Math.min(1, m / d), y: u.y + (q.y - u.y) * Math.min(1, m / d) }; } return { u, to: best }; });
    }
    function theirPlan() { // la traiettoria di chi ha palla per loro: verso la vostra porta, schivando il Campione
      const c = S.carrier, gy = 100 + R() * 40, mx = (c.x + X0) / 2, my = (c.y + gy) / 2, h = S.hero, dodge = Math.sign(my - h.y) || 1;
      const way = [mx, Math.max(Y0 + 10, Math.min(Y1 - 10, my + dodge * (30 + R() * 30) * (style === "contropiede" ? 1.3 : 1)))];
      const p = [[c.x, c.y]]; for (let i = 1; i <= 8; i++) { const t = i / 8, a = 1 - t; p.push([a * a * c.x + 2 * a * t * way[0] + t * t * (X0 + 4), a * a * c.y + 2 * a * t * way[1] + t * t * gy]); }
      return p;
    }
    // ------------------------------------------------------------ fasi
    function kickoff(weOwn) {
      S.hero.x = 140; S.hero.y = 117; S.mate.x = 100; S.mate.y = 72; S.ops[0].x = 200; S.ops[0].y = 90; S.ops[1].x = 230; S.ops[1].y = 150; S.ourK.y = 120; S.theirK.y = 120;
      S.own = weOwn; S.carrier = weOwn ? S.hero : S.ops[0]; if (!weOwn) { S.ops[0].x = 180; S.ops[0].y = 117; }
      plan();
    }
    function plan() {
      if (S.over) return; if (S.min >= S.nMin) return finish();
      S.phase = "plan"; S.path = null; S.them = S.own ? null : theirPlan(); hud();
      msg(S.own ? `${Math.round(S.min)}' · <b>Palla a te.</b> Disegna col dito la traiettoria partendo dal Campione. Le linee <b>rosse</b> sono dove ti taglieranno la strada. Finisci dentro la porta per tirare.` : `${Math.round(S.min)}' · Palla a <b>${esc(S.carrier.p.name)}</b>. La sua traiettoria ha un segno a ogni attimo: disegna la tua per <b>incrociarla nello stesso momento</b>.`);
      ui();
    }
    function ui() {
      const p = S.path, ok = p && p.length > 1 && cost() <= S.en;
      pad([
        { l: `🚀 Vola!<small>${p ? (supersonic() ? "SUPERSONICO · sfonda un contrasto" : "energia " + Math.round(cost())) : "disegna prima la traiettoria"}</small>`, cls: "go", dis: !ok, fn: go },
        { l: "✕ Cancella", dis: !p, fn: () => { S.path = null; hud(); ui(); } },
        { l: `⏸ Resta in quota<small>+energia</small>`, fn: () => { S.path = [[S.hero.x, S.hero.y], [S.hero.x + 1, S.hero.y]]; go(); } },
      ]);
    }
    function go() {
      if (S.phase !== "plan" || !S.path || cost() > S.en) return false;
      S.en = Math.max(0, S.en - cost()); S.data.voli++; const sup = supersonic(); if (sup) { S.data.supersonici++; S.shield = true; tone(220, 0.5, "sawtooth", 0.05, 880); } else tone(500, 0.2, "triangle", 0.04, 760);
      S.phase = "fly"; S.fly = { k: 0, re: S.own ? reactions() : null, from: S.ops.map((u) => ({ x: u.x, y: u.y })), h0: { x: S.hero.x, y: S.hero.y }, c0: S.carrier && !S.own ? { x: S.carrier.x, y: S.carrier.y } : null, sup };
      pad([]); if (S.fast) { while (S.phase === "fly") step(); }
      return true;
    }
    // un fotogramma del volo (i calcoli sono gli stessi a schermo e nei test)
    function step() {
      const F = S.fly; if (!F || S.phase !== "fly") return; F.k++; const t = F.k / N;
      const hp = along(S.path, t); S.hero.x = hp.x; S.hero.y = hp.y;
      if (S.own) {
        F.re.forEach(({ u, to }, i) => { const fr = F.from[i], d = Math.hypot(to.x - fr.x, to.y - fr.y), sp = 1.15 * oppK * (style === "pressing" ? 1.2 : 1) * (i ? 0.9 : 1), m = Math.min(1, (sp * F.k) / (d || 1)); u.x = fr.x + (to.x - fr.x) * m; u.y = fr.y + (to.y - fr.y) * m; });
        S.mate.x += (Math.min(X1 - 30, S.hero.x + 40) - S.mate.x) * 0.05; S.mate.y += (S.hero.y - 40 - S.mate.y) * 0.04;
        if (F.k > N - 22) { const ty = Math.max(GY0 + 6, Math.min(GY1 - 6, along(S.path, 1).y)); S.theirK.y += Math.sign(ty - S.theirK.y) * Math.min(1.3 * oppK, Math.abs(ty - S.theirK.y)); } // il portiere legge il tiro solo all'ultimo
        const hit = S.ops.find((u) => dist(u, S.hero) < 11);
        if (hit) { if (S.shield) { S.shield = false; impact("SUPERSONICO!", "#ffd23f"); tone(880, 0.25, "square", 0.05); hit.x += 18; } else { S.own = false; S.carrier = hit; S.data.intercetti += 0; impact("INTERCETTATO!", "#ff6a5a"); tone(160, 0.35, "sawtooth", 0.05); return endFly(`<b>Intercettato!</b> ${esc(hit.p.name)} ti taglia la strada.`); } }
        if (F.k >= N) { if (goalIn(hp, true)) return shoot(); return endFly("Atterri in quota. Pianifica il prossimo volo."); }
      } else {
        const cp = along(S.them, t); S.carrier.x = cp.x; S.carrier.y = cp.y;
        S.ops.forEach((u) => { if (u !== S.carrier) { u.x += (S.carrier.x + 30 - u.x) * 0.04; u.y += (S.carrier.y - 40 - u.y) * 0.04; } });
        if (F.k > N - 22) { const ty = Math.max(GY0 + 6, Math.min(GY1 - 6, along(S.them, 1).y)); S.ourK.y += Math.sign(ty - S.ourK.y) * Math.min(1.2, Math.abs(ty - S.ourK.y)); }
        if (dist(S.hero, S.carrier) < 12) { S.data.intercetti++; S.own = true; S.carrier = S.hero; impact("RUBATA!", "#7ad87a"); tone(700, 0.25, "triangle", 0.05); return endFly("<b>Palla rubata in volo!</b> Hai incrociato la sua traiettoria al momento giusto."); }
        if (dist(S.mate, S.carrier) < 12 && R() < 0.35) { S.own = true; S.carrier = S.hero; S.hero.x = S.mate.x + 8; S.hero.y = S.mate.y; impact("MURO!", "#7ad87a"); return endFly(`<b>${esc(S.mate.p.name)} la ferma</b> e te la passa.`); }
        if (F.k >= N) { const goal = R() < (Math.abs(S.ourK.y - S.carrier.y) > 10 ? 0.65 : 0.15) * oppK * (DF.shot || 1); S.data.tiri += 0; if (goal) { S.b++; impact("GOL…", "#ff6a5a"); tone(140, 0.5, "sawtooth", 0.05); S.phase = "wait"; hud(); msg(`<b>Gol di ${esc(S.carrier.p.name)}.</b> Troppo veloce, troppo in alto.`); return pad([{ l: "Ripartiamo ▸", cls: "go", fn: () => kickoff(true) }]); } impact("PARATA!", "#7ad87a"); S.own = true; S.carrier = S.hero; return endFly(`Tiro di ${esc(S.carrier.p.name)}… <b>parato!</b> Rilancio verso di te.`); }
      }
    }
    function shoot() {
      S.data.tiri++; const hp = { x: S.hero.x, y: S.hero.y }, miss = Math.abs(S.theirK.y - hp.y) <= 12 && R() < 0.85, goal = !miss && R() < 0.92;
      S.phase = "wait"; hud();
      if (goal) { S.a++; impact("GOOOL!", "#ffd23f"); tone(660, 0.5, "triangle", 0.06, 1320); msg(`<b>GOL!</b> Entri in porta a velocità ${S.fly.sup ? "supersonica" : "folle"}: ${esc(opp.keeper.name)} vede solo la scia.`); return pad([{ l: "Ripartono loro ▸", cls: "go", fn: () => kickoff(false) }]); }
      S.data.parate++; impact("PARATA!", "#ff6a5a"); tone(200, 0.4, "square", 0.05); S.own = false; S.carrier = S.ops[0]; S.ops[0].x = X1 - 40; S.ops[0].y = 120;
      msg(`<b>Parata!</b> ${esc(opp.keeper.name)} era proprio lì. La prossima volta finisci il volo dall'altra parte della porta.`); pad([{ l: "Difendi ▸", cls: "go", fn: plan }]);
    }
    function endFly(t) { S.phase = "wait"; S.min += 3; S.en = Math.min(EMAX, S.en + 30); S.shield = false; hud(); msg(t); pad([{ l: "Avanti ▸", cls: "go", fn: plan }]); }
    // ------------------------------------------------------------ disegno della traiettoria col dito
    const pt = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H]; };
    let drawing = false;
    cv.addEventListener("pointerdown", (e) => { if (S.phase !== "plan") return; const [x, y] = pt(e); if (Math.hypot(x - S.hero.x, y - S.hero.y) > 28) return; drawing = true; S.path = [[S.hero.x, S.hero.y]]; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (!drawing) return; const [x, y] = pt(e), l = S.path[S.path.length - 1]; if (Math.hypot(x - l[0], y - l[1]) < 5) return; const nx = Math.max(X0, Math.min(X1, x)), ny = Math.max(Y0, Math.min(Y1, y)); S.path.push([nx, ny]); if (cost() > S.en) S.path.pop(); hud(); });
    const up = () => { if (!drawing) return; drawing = false; if (S.path && S.path.length < 2) S.path = null; hud(); ui(); };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    // ------------------------------------------------------------ disegno
    function fig(u, col, isHero, carry) {
      const x = u.x, y = u.y; g.fillStyle = "rgba(0,0,30,.18)"; g.beginPath(); g.ellipse(x, y + 12, 6, 2, 0, 0, 7); g.fill();
      g.lineWidth = 2; g.strokeStyle = "#111"; g.fillStyle = col; g.beginPath(); g.ellipse(x, y, 5, 7, 0, 0, 7); g.fill(); g.stroke();
      if (isHero) { g.fillStyle = "#ffd23f"; g.beginPath(); g.moveTo(x - 4, y - 4); g.lineTo(x - 12 - Math.sin(S.t / 6) * 2, y + 6); g.lineTo(x - 3, y + 4); g.fill(); g.stroke(); }
      g.fillStyle = (u.p && u.p.skin) || "#e0b890"; g.beginPath(); g.arc(x, y - 10, 4.5, 0, 7); g.fill(); g.stroke(); g.fillStyle = (u.p && u.p.hair) || "#2a2a2a"; g.beginPath(); g.arc(x, y - 12, 4.5, Math.PI, 0); g.fill();
      if (carry) { g.fillStyle = "#fff"; g.beginPath(); g.arc(x + 7, y + 4, 3, 0, 7); g.fill(); g.stroke(); }
    }
    function dots(p, col, ticks) { if (!p || p.length < 2) return; g.strokeStyle = col; g.lineWidth = 2; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(p[0][0], p[0][1]); p.forEach((q) => g.lineTo(q[0], q[1])); g.stroke(); g.setLineDash([]); if (ticks) for (let k = 10; k <= N; k += 10) { const q = along(p, k / N); g.fillStyle = col; g.beginPath(); g.arc(q.x, q.y, 2.5, 0, 7); g.fill(); g.font = "700 6px system-ui"; g.fillText(k / 10, q.x + 4, q.y - 3); } }
    function draw() {
      S.t++; if (S.phase === "fly" && !S.fast) step();
      g.setTransform(2, 0, 0, 2, 0, 0);
      const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, "#2a5ac8"); sk.addColorStop(0.6, "#7ab8f0"); sk.addColorStop(1, "#e8f4ff"); g.fillStyle = sk; g.fillRect(0, 0, W, H);
      [[0.15, 0.5, "rgba(255,255,255,.35)"], [0.4, 1, "rgba(255,255,255,.6)"]].forEach(([sp, sz, col], L) => { for (let i = 0; i < 6; i++) { const x = ((i * 73 + S.t * sp * (S.phase === "fly" ? 4 : 1)) % (W + 80)) - 40, y = 30 + ((i * 47 + L * 30) % 170); g.fillStyle = col; g.beginPath(); g.ellipse(x, y, 26 * sz, 8 * sz, 0, 0, 7); g.ellipse(x + 14 * sz, y - 4 * sz, 14 * sz, 7 * sz, 0, 0, 7); g.fill(); } });
      g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.5; g.strokeRect(X0, Y0, X1 - X0, Y1 - Y0); g.beginPath(); g.moveTo(160, Y0); g.lineTo(160, Y1); g.stroke(); g.beginPath(); g.arc(160, 117, 20, 0, 7); g.stroke();
      [[X0, usCol], [X1, opp.color]].forEach(([x, c]) => { g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.ellipse(x, (GY0 + GY1) / 2, 6, (GY1 - GY0) / 2, 0, 0, 7); g.stroke(); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.stroke(); });
      if (S.phase === "plan") { if (S.own) { dots(S.path, "#ffd23f", true); reactions().forEach(({ u, to }) => { g.strokeStyle = "rgba(232,60,50,.85)"; g.lineWidth = 2; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(u.x, u.y); g.lineTo(to.x, to.y); g.stroke(); g.setLineDash([]); g.strokeStyle = "#e83c32"; g.beginPath(); g.arc(to.x, to.y, 5, 0, 7); g.stroke(); }); } else { dots(S.them, "#e83c32", true); dots(S.path, "#ffd23f", true); }
        if (!S.path) { g.strokeStyle = `rgba(255,210,63,${0.5 + 0.4 * Math.sin(S.t / 6)})`; g.lineWidth = 2; g.beginPath(); g.arc(S.hero.x, S.hero.y, 16, 0, 7); g.stroke(); } }
      if (S.phase === "fly" && S.fly) { for (let k = 1; k < 6; k++) { const q = along(S.path, Math.max(0, (S.fly.k - k * 2) / N)); g.fillStyle = `rgba(${S.fly.sup ? "255,210,63" : "255,255,255"},${0.5 - k * 0.08})`; g.beginPath(); g.arc(q.x, q.y, 5 - k * 0.6, 0, 7); g.fill(); } }
      fig(S.ourK, "#3a3a3a", false, false); fig(S.theirK, "#3a3a3a", false, false);
      fig(S.mate, usCol, false, S.carrier === S.mate); S.ops.forEach((u) => fig(u, opp.color, false, S.carrier === u)); fig(S.hero, usCol, true, S.carrier === S.hero);
      g.font = "700 6.5px system-ui"; g.textAlign = "center"; g.fillStyle = "#14204a"; g.fillText(hero.name.split(" ")[0], S.hero.x, S.hero.y + 20);
      if (S.fx) { const F = S.fx; F.t++; if (F.t < 4) { g.globalCompositeOperation = "difference"; g.fillStyle = "#fff"; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "source-over"; } const a = Math.max(0, 1 - F.t / 50); g.font = "900 26px Impact, 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = `rgba(10,10,20,${a})`; g.strokeText(F.text, W / 2, 50); g.globalAlpha = a; g.fillStyle = F.col; g.fillText(F.text, W / 2, 50); g.globalAlpha = 1; if (F.t > 50) S.fx = null; }
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ inizio e fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA IN CIELO!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Voli ${S.data.voli} (supersonici ${S.data.supersonici}) · palle rubate ${S.data.intercetti} · tiri ${S.data.tiri}</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.go = go; S.plan = (pts) => { if (S.phase !== "plan") return false; S.path = [[S.hero.x, S.hero.y]].concat(pts); if (cost() > S.en) { S.path = null; return false; } hud(); ui(); return true; }; S.cost = cost;
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Volo a Tutto Campo", `${o.intro || ""}<p>Si gioca in cielo. Il tempo è <b>fermo</b> mentre pianifichi: <b>disegna col dito</b> la traiettoria partendo dal Campione, poi premi <b>Vola</b>. Più è lunga, più energia costa; oltre una certa lunghezza diventa <b>supersonica</b> e sfonda un contrasto.</p><p>Le linee rosse dicono dove ti taglieranno la strada. Quando la palla ce l'hanno loro, incrocia la loro traiettoria <b>nello stesso attimo</b> (i numeri sulla linea).</p>`, "Decolla ▸", () => kickoff(true));
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("voCss")) return; const st = document.createElement("style"); st.id = "voCss";
    st.textContent = `.voOv{position:fixed;inset:0;z-index:300;background:#0e1a3a;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#f4f6ff;overflow:auto}
.voOv .hud{width:min(100%,440px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:3px solid #111;border-radius:6px;background:#fff;color:#111;padding:4px 10px;font:900 12px system-ui;box-shadow:4px 4px 0 #ffd23f}
.voOv .hud .n0{color:var(--us)}.voOv .hud .n1{text-align:right;color:var(--opp)}.voOv .hud .sc{font:900 22px Impact,'Arial Black',sans-serif}
.voOv .bar{width:min(100%,440px);display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;font:800 11px system-ui}.voOv .bar i{font-style:normal}.voOv .en{position:relative;height:10px;border:2px solid #111;border-radius:5px;overflow:hidden;background:#334}.voOv .en b{display:block;height:100%;background:linear-gradient(90deg,#ffd23f,#ff7a3a);transition:width .3s}.voOv .en::after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--c,0%);background:rgba(255,255,255,.45)}
.voOv canvas{width:min(100%,440px,calc((100vh - 330px) * 1.45));height:auto;aspect-ratio:320/220;flex:none;border:3px solid #111;border-radius:6px;touch-action:none}
.voOv .msg{width:min(100%,440px);min-height:36px;font-size:13px;line-height:1.4}.voOv .msg b{color:#ffd23f}
.voOv .pad{width:min(100%,440px);display:grid;grid-template-columns:2fr 1fr 1fr;gap:6px}
.voOv button{min-height:46px;border-radius:6px;border:3px solid #111;background:#fff;color:#111;font:900 13px system-ui;cursor:pointer;padding:5px;box-shadow:3px 3px 0 #111}.voOv button small{display:block;font:600 10px system-ui;opacity:.75;margin-top:2px}.voOv button:disabled{opacity:.4}.voOv button.go{background:#ffd23f}
.voOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px}
.voOv .ov{position:absolute;inset:0;background:rgba(14,26,58,.95);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.voOv .card{max-width:440px;width:100%;border:4px solid #111;border-radius:6px;background:#fff;color:#111;padding:14px;box-shadow:8px 8px 0 #ffd23f}.voOv .card h3{margin:0 0 8px;font:900 24px Impact,'Arial Black',sans-serif;color:#c83a2a}.voOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.voOv .card .big{font:900 34px Impact,'Arial Black',sans-serif}
.voOv .card .goB{width:100%;margin-top:10px;background:#ffd23f;font-size:15px;min-height:50px}`;
    document.head.appendChild(st);
  }
  window.__volo = { start, get state() { return STATE; } };
})();
