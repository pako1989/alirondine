// js/duello.js - «DUELLO CINEMATICO» · la partita originale di «Dal Campetto al Mondiale» (motore proprio, NON il kit di partita)
// Ispirata ai vecchi giochi di calcio-manga a comandi: la partita è una serie di DUELLI. Quando hai la palla, un avversario
// ti viene incontro e il gioco si ferma su una vignetta: scegli dribbling, passaggio, uno-due, tiro o TIRO SPECIALE.
// Ogni azione costa GRINTA (la barra del coraggio); con poca grinta tutto riesce peggio. Quando la palla ce l'hanno loro,
// scegli come fermarli: contrasto, anticipo sul passaggio, pressing. In porta, il duello con il portiere.
// Il cronometro corre a ogni duello: 90 minuti, intervallo con la grinta che si ricarica un po'.
// Grafica: vignette manga con linee cinetiche, primi piani, scritte dei colpi, tiro rallentato con la scia, tuffo del portiere.
// Uso: window.__duello.start({ title, us, usColor, hero:{ name, skin, hair }, mates:[{ name, skin, hair, special? }],
//   opp:{ name, color, players:[{ name, skin, hair, pow? }], keeper:{ name, pow }, ace?:{ name, special } },
//   guts, specials:[{ id, name, cost, pow, fx }], minutes, intro, winTitle, onDone })
(function () {
  "use strict";
  if (window.__duello) return;
  const W = 320, H = 220, ZONES = ["la vostra area", "la vostra trequarti", "il centrocampo", "la loro trequarti", "la loro area"];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random;
  let STATE = null;
  function start(o) {
    if (document.querySelector(".duOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const hero = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14" }, o.hero || o.heroLook || {}), usCol = o.usColor || "#1f5fbf";
    const opp = Object.assign({ name: "Avversari", color: "#c83a3a", players: [], keeper: { name: "Il portiere", pow: 12 } }, o.opp || {});
    if (!opp.players.length) opp.players = [{ name: "Il mediano" }, { name: "Il terzino" }, { name: "Il libero" }];
    const mates = (o.mates && o.mates.length ? o.mates : [{ name: "Il compagno" }]).slice(0, 3);
    const specials = (o.specials || [{ id: "aquila", name: "Tiro dell'Aquila", cost: 30, pow: 9, fx: "aquila" }]).slice(0, 3);
    const oppK = DF.opp > 1.05 ? 1.12 : DF.opp < 0.95 ? 0.85 : 1;
    const S = { o, a: 0, b: 0, min: 0, nMin: o.minutes || 90, half: 0, guts: o.guts || 100, gutsMax: o.guts || 100, own: true, zone: 2, def: null, last: null, anim: null, t: 0, over: false, phase: "intro", data: { duelli: 0, vinti: 0, speciali: 0, tiri: 0, parate: 0 } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "duOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="clock"></i><span class="gt"><b></b></span><i class="gl"></i></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || hero.name; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__duAC = window.__duAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.innerHTML = b.l; if (b.cls) x.className = b.cls; x.disabled = !!b.dis; x.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!x.disabled && !S.anim) b.fn(); }); p.appendChild(x); }); };
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".clock").textContent = `${Math.min(S.nMin, Math.round(S.min))}'`; el.querySelector(".gt b").style.width = `${(S.guts / S.gutsMax) * 100}%`; el.querySelector(".gl").textContent = `GRINTA ${Math.round(S.guts)}`; };
    // la grinta pesa su tutto: sotto il 30% le azioni riescono peggio
    const gutsK = () => (S.guts < S.gutsMax * 0.3 ? 0.7 : S.guts < S.gutsMax * 0.6 ? 0.9 : 1);
    const pickDef = () => { const p = opp.players[Math.floor(R() * opp.players.length)]; return Object.assign({ pow: 10 }, p); };
    const tick = (m) => { S.min += m; if (S.half === 0 && S.min >= S.nMin / 2) { S.half = 1; S.guts = Math.min(S.gutsMax, S.guts + S.gutsMax * 0.35); S.pendingHalf = true; } };
    // ------------------------------------------------------------ fasi
    function attack() {
      if (S.over) return; if (S.min >= S.nMin) return finish();
      if (S.pendingHalf) { S.pendingHalf = false; S.own = !S.firstOwn; S.zone = 2; msg(`<b>INTERVALLO.</b> Negli spogliatoi la grinta torna su (${Math.round(S.guts)}). Secondo tempo!`); return pad([{ l: "Secondo tempo ▸", cls: "go", fn: () => (S.own ? attack() : defend()) }]); }
      S.phase = "att"; S.def = pickDef(); hud();
      const z = S.zone, near = z >= 3, cost = (k) => ({ drib: 8, pass: 4, uno: 10, tiro: 12 }[k]);
      msg(`${Math.round(S.min)}' · Palla a te, ${esc(ZONES[z])}. <b>${esc(S.def.name)}</b> ti viene incontro!`);
      const btns = [
        { l: `⚡ Dribbling<small>grinta ${cost("drib")}</small>`, fn: () => duel("drib") },
        { l: `➜ Passa a ${esc(mates[0].name)}<small>grinta ${cost("pass")}</small>`, fn: () => duel("pass") },
        { l: `⇄ Uno-due<small>con ${esc((mates[1] || mates[0]).name)} · grinta ${cost("uno")}</small>`, fn: () => duel("uno") },
      ];
      if (near) btns.push({ l: `🎯 Tiro<small>grinta ${cost("tiro")}</small>`, cls: "hot", fn: () => duel("tiro") });
      specials.forEach((sp) => btns.push({ l: `🔥 ${esc(sp.name)}<small>tiro speciale · grinta ${sp.cost}${z < 2 ? " · troppo lontano" : ""}</small>`, cls: "sp", dis: S.guts < sp.cost || z < 2, fn: () => duel("sp", sp) }));
      pad(btns);
    }
    function duel(k, sp) {
      S.data.duelli++; const cost = sp ? sp.cost : { drib: 8, pass: 4, uno: 10, tiro: 12 }[k]; S.guts = Math.max(0, S.guts - cost); tick(2 + R() * 4);
      if (k === "tiro" || k === "sp") return shoot(sp);
      const base = { drib: 11, pass: 13, uno: 14 }[k], me = (base + R() * 10) * gutsK(), them = ((S.def.pow || 10) + R() * 10) * oppK + (style === "pressing" ? 1.5 : 0);
      const win = me >= them; if (win) S.data.vinti++;
      const words = { drib: win ? "DRIBBLING!" : "SCIVOLATA!", pass: win ? "PASSAGGIO!" : "INTERCETTATO!", uno: win ? "UNO-DUE!" : "CHIUSO!" }[k];
      S.anim = { kind: k, win, t: 0, dur: 70, words, who: S.def, after: () => { if (win) { S.zone = Math.min(4, S.zone + (k === "uno" ? 2 : 1)); attack(); } else { S.own = false; S.zone = Math.max(1, 4 - S.zone); defend(); } } };
      tone(win ? 520 : 200, 0.2, win ? "triangle" : "square", 0.05, win ? 780 : 120);
      msg(win ? `<b>${words}</b> Superi ${esc(S.def.name)}.` : `<b>${words}</b> ${esc(S.def.name)} ti ruba palla.`); pad([]); hud();
    }
    function shoot(sp) {
      S.data.tiri++; if (sp) S.data.speciali++;
      const dist = 4 - S.zone, me = ((sp ? 14 + sp.pow : 12) + R() * 10 - dist * 3) * gutsK(), kp = ((opp.keeper.pow || 12) + R() * 10) * oppK;
      const goal = me > kp; const words = sp ? sp.name.toUpperCase() + "!" : "TIRO!";
      S.anim = { kind: "shot", sp, win: goal, t: 0, dur: sp ? 110 : 80, words, who: opp.keeper, after: () => { if (goal) { S.a++; S.own = false; S.zone = 2; tone(880, 0.4, "triangle", 0.07); hud(); msg(`<b>GOOOL!</b> ${sp ? esc(sp.name) + ": " : ""}la palla gonfia la rete!`); pad([{ l: "Riprendono loro ▸", cls: "go", fn: defend }]); } else { S.own = false; S.zone = 1; msg(`<b>PARATA!</b> ${esc(opp.keeper.name)} ci arriva.`); pad([{ l: "Avanti ▸", cls: "go", fn: defend }]); } } };
      tone(sp ? 300 : 400, sp ? 0.8 : 0.4, "sawtooth", 0.05, sp ? 1200 : 700); msg(`<b>${esc(words)}</b>`); pad([]); hud();
    }
    function defend() {
      if (S.over) return; if (S.min >= S.nMin) return finish();
      if (S.pendingHalf) { S.pendingHalf = false; S.own = !S.firstOwn; S.zone = 2; msg(`<b>INTERVALLO.</b> Negli spogliatoi la grinta torna su (${Math.round(S.guts)}). Secondo tempo!`); return pad([{ l: "Secondo tempo ▸", cls: "go", fn: () => (S.own ? attack() : defend()) }]); }
      S.phase = "def"; S.def = pickDef(); hud();
      const z = S.zone; // qui zone è quanto sono vicini alla TUA porta (1..4)
      if (z >= 4) return oppShot();
      msg(`${Math.round(S.min)}' · Palla a loro. <b>${esc(S.def.name)}</b> avanza verso ${esc(ZONES[4 - z])}. Come lo fermi?`);
      pad([
        { l: "🦵 Contrasto<small>grinta 6 · rischioso</small>", fn: () => stop("tackle") },
        { l: "✋ Anticipo<small>sul passaggio · grinta 5</small>", fn: () => stop("block") },
        { l: "🏃 Pressing<small>grinta 3 · lo rallenti</small>", fn: () => stop("press") },
      ]);
    }
    function stop(k) {
      S.data.duelli++; S.guts = Math.max(0, S.guts - { tackle: 6, block: 5, press: 3 }[k]); tick(2 + R() * 4);
      const oppMove = R() < (style === "contropiede" ? 0.6 : 0.45) ? "pass" : "drib"; // cosa fa davvero l'avversario
      const fit = (k === "tackle" && oppMove === "drib") || (k === "block" && oppMove === "pass") ? 4 : k === "press" ? 1 : -2;
      const me = (12 + R() * 10 + fit) * gutsK(), them = ((S.def.pow || 10) + R() * 10) * oppK, win = me >= them; if (win) S.data.vinti++;
      const words = win ? { tackle: "CONTRASTO!", block: "ANTICIPO!", press: "RECUPERO!" }[k] : oppMove === "pass" ? "PASSAGGIO FILTRANTE!" : "TI SALTA!";
      S.anim = { kind: k, win, t: 0, dur: 70, words, who: S.def, def: true, after: () => { if (win) { S.own = true; S.zone = Math.max(1, 4 - S.zone); attack(); } else { S.zone = Math.min(4, S.zone + (k === "press" ? 0 : 1) + (oppMove === "pass" ? 1 : 0)); defend(); } } };
      tone(win ? 520 : 200, 0.2, win ? "triangle" : "square", 0.05); msg(win ? `<b>${words}</b> Palla tua!` : `<b>${words}</b> ${esc(S.def.name)} passa.`); pad([]); hud();
    }
    function oppShot() {
      const ace = opp.ace && R() < 0.5, kp = (13 + R() * 10 + (o.keeperPow || 0)) * gutsK(), sh = ((ace ? 17 : 12) + R() * 10) * oppK, goal = sh > kp; tick(1 + R() * 2);
      const words = ace ? (opp.ace.special || "TIRO SPECIALE").toUpperCase() + "!" : "TIRANO!"; if (!goal) S.data.parate++;
      S.anim = { kind: "oshot", win: !goal, ace, t: 0, dur: ace ? 100 : 80, words, who: ace ? opp.ace : S.def, def: true, after: () => { if (goal) { S.b++; S.own = true; S.zone = 2; tone(140, 0.5, "sawtooth", 0.05); hud(); msg(`<b>Gol di ${esc(opp.name)}.</b> Si riparte dal centro.`); pad([{ l: "Calcio d'inizio ▸", cls: "go", fn: attack }]); } else { S.own = true; S.zone = 1; msg(`<b>PARATA!</b> ${esc(o.keeperName || "Il tuo portiere")} la blocca e rilancia.`); pad([{ l: "Avanti ▸", cls: "go", fn: attack }]); } } };
      msg(`<b>${esc(words)}</b> ${ace ? esc(opp.ace.name) + " carica il suo tiro!" : ""}`); pad([]); hud();
    }
    // ------------------------------------------------------------ disegno: la mappa e le vignette
    function figure(x, y, s, col, skin, hair, pose, flip) { // un giocatore in stile vignetta: testa grande, linee decise
      g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); g.lineWidth = 2; g.strokeStyle = "#111"; g.lineJoin = "round";
      g.fillStyle = col; g.beginPath(); g.moveTo(-8, -26); g.lineTo(8, -26); g.lineTo(10, 0); g.lineTo(-10, 0); g.closePath(); g.fill(); g.stroke();
      const lg = pose === "kick" ? [[-4, 0, -8, 20], [4, 0, 18, 8]] : pose === "slide" ? [[-4, 0, -20, 10], [4, 0, 16, 14]] : pose === "dive" ? [[-4, 0, -12, 16], [4, 0, 8, 18]] : [[-4, 0, -6, 22], [4, 0, 6, 22]];
      g.strokeStyle = "#111"; g.lineWidth = 5; lg.forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); }); g.strokeStyle = skin || "#e0ac7e"; g.lineWidth = 3; lg.forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
      g.fillStyle = skin || "#e0ac7e"; g.lineWidth = 2; g.strokeStyle = "#111"; g.beginPath(); g.arc(0, -36, 11, 0, 7); g.fill(); g.stroke();
      g.fillStyle = hair || "#2b1d14"; g.beginPath(); g.moveTo(-12, -38); g.lineTo(-8, -50); g.lineTo(-2, -44); g.lineTo(3, -52); g.lineTo(7, -45); g.lineTo(13, -48); g.lineTo(11, -36); g.quadraticCurveTo(0, -44, -12, -38); g.fill(); g.stroke();
      g.fillStyle = "#111"; g.fillRect(3, -37, 3, 4); g.restore();
    }
    function speed(cx, cy, n, col, t) { g.strokeStyle = col; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + (i % 3) * 0.13, r0 = 60 + ((i * 37 + t * 6) % 40), r1 = r0 + 50 + (i % 5) * 20; g.lineWidth = 1 + (i % 3); g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke(); } }
    function word(txt, x, y, col, sz, rot) { g.save(); g.translate(x, y); g.rotate(rot || -0.08); g.font = `900 ${sz}px Impact, 'Arial Black', sans-serif`; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = "#111"; g.strokeText(txt, 0, 0); g.fillStyle = col; g.fillText(txt, 0, 0); g.restore(); }
    function map() { // la striscia del campo in alto: dove è la palla
      g.fillStyle = "#2a7a3a"; g.fillRect(10, 8, W - 20, 26); g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.strokeRect(10, 8, W - 20, 26); g.beginPath(); g.moveTo(W / 2, 8); g.lineTo(W / 2, 34); g.stroke(); g.strokeRect(10, 14, 22, 14); g.strokeRect(W - 32, 14, 22, 14);
      const z = S.own ? S.zone : 4 - S.zone, bx = 22 + (z / 4) * (W - 44); g.fillStyle = S.own ? usCol : opp.color; g.beginPath(); g.arc(bx, 21, 6, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, 21, 3, 0, 7); g.fill();
    }
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = "#f4f0e4"; g.fillRect(0, 0, W, H); map();
      const A = S.anim, top = 42, ph = H - top - 6;
      g.save(); g.beginPath(); g.rect(8, top, W - 16, ph); g.clip();
      if (!A) { // vignetta di attesa: l'avversario che arriva, inquadrato dal basso
        g.fillStyle = S.phase === "def" ? "#f0e0e0" : "#e4ecf4"; g.fillRect(8, top, W - 16, ph); speed(W / 2, top + ph / 2, 28, "rgba(0,0,0,.12)", S.t * 0.2);
        if (S.def) { figure(W * 0.68, top + ph - 18, 1.6, S.phase === "def" ? opp.color : opp.color, S.def.skin, S.def.hair, "run", true); figure(W * 0.3, top + ph - 18, 1.6, usCol, hero.skin, hero.hair, "run"); }
        g.fillStyle = "#fff"; g.beginPath(); g.arc(W * 0.42, top + ph - 14, 6, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1.5; g.stroke();
        if (S.def) word(S.def.name, W * 0.68, top + ph - 6, "#fff", 14, 0.05);
      } else {
        A.t++; const p = Math.min(1, A.t / A.dur), flash = A.t > A.dur * 0.45 && A.t < A.dur * 0.55;
        const bg = A.kind === "shot" || A.kind === "oshot" ? (A.sp ? "#1a1a3a" : "#2a2a2a") : A.win ? "#fff4c8" : "#3a1a1a";
        g.fillStyle = bg; g.fillRect(8, top, W - 16, ph); speed(W / 2, top + ph / 2, 40, A.win ? "rgba(0,0,0,.35)" : "rgba(255,255,255,.25)", A.t);
        if (A.kind === "shot" || A.kind === "oshot") {
          const mine = A.kind === "shot", sx = mine ? 40 : W - 40, ex = mine ? W - 60 : 60, bx = sx + (ex - sx) * Math.min(1, p * 1.4), by = top + ph * 0.55 - Math.sin(Math.min(1, p * 1.4) * Math.PI) * 30;
          if (A.sp && A.sp.fx === "aquila") { g.fillStyle = "rgba(255,210,80,.5)"; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx - 40, by - 30); g.lineTo(bx - 20, by); g.lineTo(bx - 40, by + 30); g.closePath(); g.fill(); }
          for (let k = 1; k < 10; k++) { g.fillStyle = `rgba(255,${A.sp ? 160 : 255},${A.sp ? 60 : 255},${0.5 - k * 0.05})`; g.beginPath(); g.arc(bx - (ex - sx) * 0.03 * k, by + k * 0.6, 7 - k * 0.5, 0, 7); g.fill(); }
          g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, 7, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 2; g.stroke();
          const kx = ex + (mine ? 20 : -20), dive = p > 0.5 ? (p - 0.5) * 2 : 0; figure(kx, top + ph - 20 - dive * 20, 1.4, mine ? opp.color : usCol, (A.who || {}).skin, (A.who || {}).hair, "dive", mine);
          if (p < 0.4) figure(sx, top + ph - 20, 1.5, mine ? usCol : opp.color, mine ? hero.skin : (A.who || {}).skin, mine ? hero.hair : (A.who || {}).hair, "kick", !mine);
          if (p > 0.7) word(A.win ? (mine ? "GOOOL!" : "PARATA!") : (mine ? "PARATA!" : "GOL..."), W / 2, top + 50, A.win ? "#ffd23f" : "#ff6a5a", 28);
        } else {
          const close = 1 + p * 0.4, mx = W * 0.36 - p * 10, ox = W * 0.64 + p * 10;
          figure(mx, top + ph - 18, 1.5 * close, usCol, hero.skin, hero.hair, A.def ? "slide" : A.kind === "drib" ? "run" : "kick");
          figure(ox, top + ph - 18, 1.5 * close, opp.color, (A.who || {}).skin, (A.who || {}).hair, A.def ? "run" : "slide", true);
          if (flash) { g.fillStyle = "rgba(255,255,255,.8)"; g.fillRect(8, top, W - 16, ph); }
        }
        word(A.words, W / 2, top + 30 + (1 - Math.min(1, p * 3)) * -20, A.win ? "#ffd23f" : "#ff8a7a", 24);
        if (A.t >= A.dur) { const f = A.after; S.anim = null; f(); }
      }
      g.restore(); g.strokeStyle = "#111"; g.lineWidth = 3; g.strokeRect(8, top, W - 16, ph);
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over"; S.anim = null;
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data, { grinta: Math.round(S.guts) }) };
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Duelli vinti ${S.data.vinti} su ${S.data.duelli} · tiri ${S.data.tiri} · speciali ${S.data.speciali} · parate ${S.data.parate}</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.act = (k) => (S.phase === "att" ? (k === "tiro" ? duel("tiro") : duel(k)) : stop(k)); S.skip = () => { if (S.anim) S.anim.t = S.anim.dur; };
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Duello Cinematico", `${o.intro || ""}<p>La partita è fatta di <b>duelli</b>: quando hai palla scegli dribbling, passaggio, uno-due o tiro; vicino alla porta, i <b>tiri speciali</b>. Ogni azione costa <b>grinta</b>: con poca grinta, tutto riesce peggio. Quando la palla ce l'hanno loro, indovina cosa faranno: il contrasto ferma chi dribbla, l'anticipo chi passa.</p>`, "Calcio d'inizio ▸", () => { S.firstOwn = true; attack(); });
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("duCss")) return; const st = document.createElement("style"); st.id = "duCss";
    st.textContent = `.duOv{position:fixed;inset:0;z-index:300;background:#14161c;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#f4f0e4}
.duOv .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #f4f0e4;border-radius:6px;background:#111;padding:4px 10px;font:800 12px system-ui,sans-serif}
.duOv .hud .n0{color:var(--us);filter:brightness(1.6)}.duOv .hud .n1{text-align:right;color:var(--opp);filter:brightness(1.6)}.duOv .hud .sc{font:900 22px Impact,'Arial Black',sans-serif;color:#ffd23f}
.duOv .bar{width:min(100%,420px);display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;font:800 11px system-ui,sans-serif}.duOv .bar i{font-style:normal}.duOv .gt{height:10px;border:2px solid #f4f0e4;border-radius:5px;overflow:hidden;background:#333}.duOv .gt b{display:block;height:100%;background:linear-gradient(90deg,#ff5a3a,#ffd23f);transition:width .3s}
.duOv canvas{width:min(100%,420px,calc((100vh - 330px) * 1.45));height:auto;aspect-ratio:320/220;flex:none;border-radius:4px}
.duOv .msg{width:min(100%,420px);min-height:34px;font-size:13px;line-height:1.4}.duOv .msg b{color:#ffd23f}
.duOv .pad{width:min(100%,420px);display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px}
.duOv button{min-height:44px;border-radius:6px;border:2px solid #f4f0e4;background:#22252e;color:#f4f0e4;font:800 13px system-ui,sans-serif;cursor:pointer;padding:6px}.duOv button small{display:block;font:500 10.5px system-ui,sans-serif;opacity:.8;margin-top:2px}.duOv button:disabled{opacity:.35}.duOv button.go{background:#ffd23f;color:#111}.duOv button.hot{background:#c83a2a}.duOv button.sp{background:#5a2a8a;border-color:#ffd23f}
.duOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px}
.duOv .ov{position:absolute;inset:0;background:rgba(10,10,14,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.duOv .card{max-width:420px;width:100%;border:3px solid #111;border-radius:6px;background:#f4f0e4;color:#111;padding:14px;box-shadow:6px 6px 0 #ffd23f}.duOv .card h3{margin:0 0 8px;font:900 24px Impact,'Arial Black',sans-serif;letter-spacing:.5px}.duOv .card p{margin:6px 0;font-size:14px;line-height:1.45}.duOv .card .big{font:900 34px Impact,'Arial Black',sans-serif}.duOv .card button{width:100%;margin-top:10px;background:#111;color:#ffd23f}`;
    document.head.appendChild(st);
  }
  window.__duello = { start, get state() { return STATE; } };
})();
