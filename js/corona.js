// js/corona.js - «DUELLO DI CORONA» · la partita originale di «Cronache del Regno Ultimo» (motore proprio, NON il kit di partita)
// Una partita rituale sulla piazza d'armi di Castelalto, a TEMPI. In ogni tempo ci sono due CARICHE, una per parte:
//  - la TUA CARICA (attacco): corri verso il portone avversario su TRE CORSIE (▲ ▼ o strisciata su/giù), schivi lancieri, cavalieri
//    che ti tagliano la strada (si vede la bandierina lampeggiare prima che scatti) e muri di scudi; SALTA i fossati; arrivato
//    al portone, il mirino va su e giù: tocca TIRA al momento giusto, mentre il portiere si tuffa in uno dei tre settori.
//  - la CARICA LORO (difesa): il portatore di palla avversario corre verso il tuo portone e cambia corsia (finte comprese):
//    metti lo SCUDO nella corsia giusta; se passa, tira, e tu scegli il settore in cui tuffarti (▲ ▼) leggendo la sua posa.
//  - TRA I TEMPI c'è il CONSIGLIO DELLE CASATE: una scelta diplomatica (3 risposte) che cambia il favore dei Lupi, dei Gabbiani
//    e dei Cervi. Chi ti è favorevole (favore 1 o più) ti presta il suo POTERE, una volta per tempo:
//    🐺 Ariete (sfonda un ostacolo, in difesa lo scudo copre due corsie) · ⚓ Marea (cavalieri fermi, mirino lento, finte lente)
//    · 🦌 Occhio (vedi dove si tuffa il portiere e quali finte sono vere).
// Uso: window.__corona.start({ title, us, usColor, heroLook:{name,skin,hair,shirt}, hero:{name}, opp:{name,color,style}, tempi, favor:{lupi,gabbiani,cervi},
//   council:[{ q, opts:[{ label, sub, fav:{lupi:1}, say }] }], intro, onDone })  →  onDone({ a, b, win, quit, data:{ favor:{lupi,gabbiani,cervi} (variazioni), picks:[], poteri, cariche, ... } })
(function () {
  "use strict";
  if (window.__corona) return;
  const W = 320, H = 200, LANE = [118, 143, 168], XH = 76;
  const HOUSES = {
    lupi: { n: "Lupi", c: "#9aa6c0", e: "🐺", p: "Ariete", d: "sfonda il primo ostacolo; in difesa lo scudo copre due corsie" },
    gabbiani: { n: "Gabbiani", c: "#38a8d8", e: "⚓", p: "Marea", d: "cavalieri fermi, mirino più lento, finte più lente" },
    cervi: { n: "Cervi", c: "#5aa862", e: "🦌", p: "Occhio", d: "svela il tuffo del portiere e le finte" },
  };
  const DEFAULT_COUNCIL = [
    { q: "Fischia l'intervallo. Dalla tribuna d'onore un araldo ti porge tre pergamene: ognuna è un invito. Di chi accetti il vino?", opts: [
      { label: "Il vino dei Lupi, in coppa di ferro", sub: "Favore ai Lupi, freddezza dei Cervi", fav: { lupi: 1, cervi: -1 }, say: "Il Generale solleva la coppa: «Bevi, Campione. Il ferro non si offende mai.»" },
      { label: "Il vino dei Gabbiani, con sale di mare", sub: "Favore ai Gabbiani, freddezza dei Lupi", fav: { gabbiani: 1, lupi: -1 }, say: "La Dama del Porto sorride come chi ha già fatto il conto: «Un cliente, finalmente.»" },
      { label: "Acqua di fonte, e il vino a tutti e tre", sub: "Un po' di favore a ciascuno, ma niente di più", fav: { lupi: 0, gabbiani: 0, cervi: 1 }, say: "Il vecchio Lord dei Cervi annuisce: «Una risposta da giurista. Non vuol dire niente, ma si dice con garbo.»" },
    ] },
    { q: "Secondo intervallo. Il ciambellano ti sussurra che le tre Casate hanno lo stesso desiderio: parlare per prime con te. Ne avrai una sola, ora.", opts: [
      { label: "Ascolta i Lupi: parlano di mura e di marce", sub: "Favore ai Lupi", fav: { lupi: 1 }, say: "«Tre colpi di tamburo e il Nord è tuo», dice il Generale. Non è chiaro se sia una promessa o un avviso." },
      { label: "Ascolta i Gabbiani: parlano di porti e di prezzi", sub: "Favore ai Gabbiani", fav: { gabbiani: 1 }, say: "«Una corona costa meno di una guerra», dice la Dama. «Ma lo scopri solo dopo.»" },
      { label: "Ascolta i Cervi: parlano di leggi e di foreste", sub: "Favore ai Cervi", fav: { cervi: 1 }, say: "«Tutto è già scritto», dice Lord Cedro. «Dobbiamo solo trovare dove.»" },
    ] },
  ];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let STATE = null;
  function tone(f, d, type, v, slide) { try { const A = (window.__cnAC = window.__cnAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.setValueAtTime(f, A.currentTime); if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.setValueAtTime(v || 0.05, A.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d + 0.02); } catch (e) {} }
  const horn = () => { tone(262, 0.5, "sawtooth", 0.04); tone(392, 0.6, "sawtooth", 0.04); };

  function start(o) {
    if (document.querySelector(".cnOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: {}, style: "" }, DF = Object.assign({ opp: 1, steal: 1, shot: 1, gk0: 0, gk1: 0 }, cur.opts || {});
    const opp = Object.assign({ name: "Rivali", color: "#a83a3a", style: "equilibrata" }, o.opp || {}), style = o.oppStyle || cur.style || opp.style || "equilibrata";
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.85 : 1;
    const look = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14", shirt: o.usColor || "#2a5ac8" }, o.heroLook || {}, o.hero || {});
    const usCol = o.usColor || "#c8a040";
    const S = { o, a: 0, b: 0, tempo: 0, nT: o.tempi || 3, extra: 0, phase: "intro", over: false, t: 0, queue: [], qi: 0, cur: null, fx: null, shake: 0, flash: 0,
      fav: Object.assign({ lupi: 0, gabbiani: 0, cervi: 0 }, o.favor || {}), used: {}, picks: [], council: o.council || DEFAULT_COUNCIL, lane: 1, laneCd: 0, jump: 0, zone: 1,
      data: { cariche: 0, tiri: 0, parate: 0, perse: 0, poteri: 0, favor: { lupi: 0, gabbiani: 0, cervi: 0 }, picks: [] } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "cnOv"; S.el = el;
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="tm"></i><span class="tip"></span></div>
      <canvas width="${W * 2}" height="${H * 2}"></canvas>
      <div class="pw">${Object.keys(HOUSES).map((h) => `<button type="button" data-h="${h}"><b>${HOUSES[h].e} ${HOUSES[h].p}</b><small></small></button>`).join("")}</div>
      <div class="pad"><button type="button" class="up" aria-label="Su">▲</button><button type="button" class="act">SALTA</button><button type="button" class="dn" aria-label="Giù">▼</button></div>
      <div class="help">▲ ▼ o strisciata su/giù = corsia · Spazio = azione · 1 2 3 = poteri</div><button type="button" class="quit">✕ Esci</button><div class="ov" hidden></div>`;
    document.body.appendChild(el);
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"), ov = el.querySelector(".ov");
    const tip = (t) => { el.querySelector(".tip").innerHTML = t; };
    const fx = (text, col) => { S.fx = { text, col: col || "#ffd23f", t: 0 }; };
    // ------------------------------------------------------------ pannello a tutto schermo (regole, consiglio, fine)
    function panel(html, buttons) {
      ov.hidden = false; ov.innerHTML = `<div class="card">${html}<div class="btns"></div></div>`;
      const box = ov.querySelector(".btns"); buttons.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.className = b.cls || ""; x.innerHTML = b.html; x.onclick = () => { b.fn(); }; box.appendChild(x); });
    }
    const closePanel = () => { ov.hidden = true; ov.innerHTML = ""; };
    function hud() {
      const T = S.extra ? `Spareggio ${S.extra}` : `Tempo ${Math.min(S.tempo + 1, S.nT)}/${S.nT}`;
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".tm").textContent = T;
      el.querySelectorAll(".pw button").forEach((b) => { const h = b.dataset.h, fv = S.fav[h], ok = fv >= 1 && !S.used[h] && ["run", "shot", "march", "keeper"].includes(S.phase); b.disabled = !ok; b.classList.toggle("on", !!(S.cur && S.cur.pow && S.cur.pow[h])); b.querySelector("small").textContent = fv < 1 ? `favore ${fv}` : S.used[h] ? "usato" : "pronto"; b.style.setProperty("--hc", HOUSES[h].c); });
      const act = el.querySelector(".act"); act.textContent = S.phase === "run" ? "SALTA" : S.phase === "shot" ? "TIRA!" : "—"; act.disabled = !(S.phase === "run" || S.phase === "shot");
      const arrows = S.phase === "run" || S.phase === "march" || S.phase === "keeper"; el.querySelector(".up").disabled = el.querySelector(".dn").disabled = !arrows;
    }
    // ------------------------------------------------------------ andamento: tempi, cariche, consiglio
    function buildQueue() { const first = S.extra ? "att" : S.tempo % 2 === 0 ? "att" : "def"; S.queue = first === "att" ? ["att", "def"] : ["def", "att"]; S.qi = 0; S.used = {}; }
    function nextCharge() {
      if (S.over) return;
      if (S.qi >= S.queue.length) return endTempo();
      const kind = S.queue[S.qi++]; S.data.cariche++; S.lane = 1; S.zone = 1; S.jump = 0; S.laneCd = 0;
      const c = S.cur = { kind, t: 0, pow: {}, armor: 0, sub: "" };
      if (kind === "att") {
        const n = 6 + (S.tempo >= 2 ? 1 : 0) + (oppK > 1 ? 1 : 0) + (style === "pressing" ? 1 : 0) + (S.extra ? 1 : 0), obs = []; let x = 170;
        const wCav = style === "pressing" ? 0.42 : 0.3, wMuro = style === "difensiva" ? 0.34 : 0.2;
        for (let i = 0; i < n; i++) {
          x += 78 + R() * 46; const r = R(); let t = "lancia";
          if (i === 2 || i === 5) t = "fosso"; else if (r < wCav) t = "cav"; else if (r < wCav + wMuro) t = "muro";
          const ln = t === "muro" ? (R() < 0.5 ? 0 : 1) : (R() * 3) | 0; obs.push({ x, t, ln, tell: 0, moved: false, done: false, dead: false });
        }
        c.obs = obs; c.len = x + 120; c.x = 0; c.sub = "run"; S.phase = "run";
        tip(`<b>${esc(look.name)}</b>, a te la palla: corri verso il portone di <b>${esc(opp.name)}</b>. Cambia corsia, salta i fossati.`);
      } else {
        c.T = style === "contropiede" ? 5.6 : 6.4; c.cl = (R() * 3) | 0; c.clv = c.cl; c.sw = []; const n = R() < 0.5 ? 2 : 3; let last = c.cl;
        for (let i = 0; i < n; i++) { const final = i === n - 1; const at = final ? c.T - 0.62 : 1.5 + i * 1.5 + R() * 0.7; let to = (last + 1 + ((R() * 2) | 0)) % 3; const feint = R() < (final ? 0.3 : 0.4); c.sw.push({ at, to: feint ? last : to, from: last, feint, shown: false, fakeTo: feint ? (last + 1 + ((R() * 2) | 0)) % 3 : to }); if (!feint) last = to; }
        c.tellD = 0.55 / oppK; c.sub = "march"; c.px = 0; S.phase = "march";
        tip(`<b>${esc(opp.name)}</b> corre verso il tuo portone. Metti lo <b>scudo</b> nella sua corsia: la bandierina lampeggia prima che cambi.`);
      }
      hud();
    }
    function endCharge(txt, col, good) {
      const c = S.cur; c.from = S.phase; c.sub = "esito"; S.phase = "esito"; c.t = 0; fx(txt, col || "#ffd23f"); S.flash = 14; hud();
      if (good === true) tone(660, 0.5, "triangle", 0.06, 1320); else if (good === false) tone(150, 0.5, "sawtooth", 0.05);
      c.wait = 1.25;
    }
    function extraPanel() {
      horn(); buildQueue();
      panel(`<h3>Pareggio: spareggio del Re</h3><p>${S.a} a ${S.b}. L'araldo alza la tromba: una carica a testa${S.extra >= 3 ? ", e se ancora pari decide la Moneta del Re" : ""}.</p>`, [{ html: "Avanti ▸", cls: "go", fn: () => { closePanel(); nextCharge(); } }]);
    }
    function endTempo() {
      S.phase = "pausa"; hud();
      if (S.extra) { if (S.a !== S.b || S.extra >= 3) return finish(); S.extra++; return extraPanel(); }
      S.tempo++;
      if (S.tempo >= S.nT) { if (S.a !== S.b) return finish(); S.extra = 1; return extraPanel(); }
      const q = S.council[S.tempo - 1] || DEFAULT_COUNCIL[(S.tempo - 1) % DEFAULT_COUNCIL.length];
      if (q) return councilPanel(q);
      buildQueue(); nextCharge();
    }
    function councilPanel(q) {
      S.data.consigli = (S.data.consigli | 0) + 1; horn();
      const fv = Object.keys(HOUSES).map((h) => `<span style="color:${HOUSES[h].c}">${HOUSES[h].e} ${HOUSES[h].n} <b>${S.fav[h]}</b></span>`).join(" · ");
      panel(`<h3>⚜️ Consiglio delle Casate</h3><p class="fv">${fv}</p><p>${esc(q.q)}</p>`, q.opts.map((op, i) => ({ html: `<b>${esc(op.label)}</b>${op.sub ? `<small>${esc(op.sub)}</small>` : ""}`, cls: "opt", fn: () => pickOpt(q, op, i) })));
    }
    function pickOpt(q, op, i) {
      Object.keys(op.fav || {}).forEach((h) => { if (!HOUSES[h]) return; const before = S.fav[h]; S.fav[h] = clamp(before + op.fav[h], -3, 9); S.data.favor[h] += S.fav[h] - before; });
      S.picks.push(i); S.data.picks.push(i); tone(520, 0.25, "triangle", 0.05, 780);
      const fv = Object.keys(HOUSES).map((h) => `<span style="color:${HOUSES[h].c}">${HOUSES[h].e} ${HOUSES[h].n} <b>${S.fav[h]}</b></span>`).join(" · ");
      panel(`<h3>⚜️ Consiglio delle Casate</h3><p class="fv">${fv}</p><p class="say">${esc(op.say || "Il Consiglio prende nota.")}</p>`, [{ html: "Squilli di tromba: si riprende ▸", cls: "go", fn: () => { closePanel(); buildQueue(); nextCharge(); } }]);
    }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "fine";
      const coin = S.a === S.b && !quit, win = S.a > S.b || (coin && R() < 0.5);
      S.data.win = win;
      if (quit) return close({ a: S.a, b: S.b, win: false, quit: true });
      tone(win ? 784 : 196, 0.7, "triangle", 0.07, win ? 1175 : 130);
      panel(`<h3>${win ? (o.winTitle || "VITTORIA DEL DUELLO!") : "SCONFITTA"}</h3>${coin ? "<p>La Moneta del Re decide.</p>" : ""}<p class="big">${esc(o.us || "Noi")} ${S.a} – ${S.b} ${esc(opp.name)}</p><p>Cariche giocate: ${S.data.cariche} · Tiri: ${S.data.tiri} · Parate di scudo e di portiere: ${S.data.parate} · Poteri usati: ${S.data.poteri}.</p>`, [{ html: "Continua ▸", cls: "go", fn: () => close({ a: S.a, b: S.b, win }) }]);
    }
    function close(r) {
      cancelAnimationFrame(S.raf); document.removeEventListener("keydown", onKey); el.remove(); if (STATE === S) STATE = null; window.__corona.state = null;
      try { C && C.endMatch && C.endMatch(); } catch (e) {}
      r.data = S.data; try { o.onDone && o.onDone(r); } catch (e) { console.error(e); }
    }
    // ------------------------------------------------------------ comandi
    function setLane(d) {
      const c = S.cur; if (!c || S.over || ov.hidden === false) return;
      if (S.phase === "run" || S.phase === "march") { if (S.laneCd > 0) return; const n = clamp(S.lane + d, 0, 2); if (n !== S.lane) { S.lane = n; S.laneCd = 0.08; tone(300 + n * 60, 0.05, "square", 0.025); } }
      else if (S.phase === "keeper") { const n = clamp(S.zone + d, 0, 2); if (n !== S.zone) { S.zone = n; tone(240 + n * 50, 0.05, "square", 0.025); } }
    }
    function action() {
      const c = S.cur; if (!c || S.over || ov.hidden === false) return;
      if (S.phase === "run" && S.jump <= 0) { S.jump = 0.55; tone(440, 0.18, "triangle", 0.04, 880); }
      else if (S.phase === "shot") shoot();
    }
    function usePower(h) {
      const c = S.cur; if (!c || S.over || ov.hidden === false || S.fav[h] < 1 || S.used[h] || !["run", "shot", "march", "keeper"].includes(S.phase)) return false;
      S.used[h] = true; c.pow[h] = true; S.data.poteri++; tone(330, 0.3, "sawtooth", 0.04, 660);
      if (h === "lupi") { if (c.kind === "att") c.armor = 1; fx("ARIETE!", HOUSES.lupi.c); } else if (h === "gabbiani") fx("MAREA!", HOUSES.gabbiani.c); else fx("OCCHIO DEL BOSCO!", HOUSES.cervi.c);
      hud(); return true;
    }
    el.querySelector(".up").onclick = () => setLane(-1); el.querySelector(".dn").onclick = () => setLane(1); el.querySelector(".act").onclick = action;
    el.querySelectorAll(".pw button").forEach((b) => (b.onclick = () => usePower(b.dataset.h)));
    el.querySelector(".quit").onclick = () => finish(true);
    function onKey(e) {
      const k = e.key; if (k === "ArrowUp" || k === "w" || k === "W") { setLane(-1); e.preventDefault(); } else if (k === "ArrowDown" || k === "s" || k === "S") { setLane(1); e.preventDefault(); }
      else if (k === " " || k === "Enter") { const b = ov.hidden ? null : ov.querySelector(".go"); if (b) b.click(); else action(); e.preventDefault(); } else if (k === "1") usePower("lupi"); else if (k === "2") usePower("gabbiani"); else if (k === "3") usePower("cervi");
    }
    document.addEventListener("keydown", onKey);
    let sy = null; // strisciata su/giù sulla tela: cambia corsia
    cv.addEventListener("pointerdown", (e) => { sy = e.clientY; if (S.phase === "shot") action(); });
    cv.addEventListener("pointermove", (e) => { if (sy == null) return; const dy = e.clientY - sy; if (Math.abs(dy) > 16) { setLane(dy > 0 ? 1 : -1); sy = e.clientY; } });
    const up = () => { sy = null; }; cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    // ------------------------------------------------------------ il tiro (mirino) e la parata
    function startShot() {
      const c = S.cur; c.sub = "shot"; S.phase = "shot"; c.st = 0; c.kz = (R() * 3) | 0; c.ph = R() * 2; c.reached = true;
      tip("<b>Al portone!</b> Tocca <b>TIRA</b> quando il mirino è nel settore libero: il portiere copre uno dei tre.");
      hud();
    }
    const retY = (c) => { const sp = (c.pow.gabbiani ? 0.6 : 1) * (0.95 + (oppK - 1) * 0.6); const p = ((c.st * sp * 0.9 + c.ph) % 2 + 2) % 2; return (p < 1 ? p * 2 - 1 : 1 - (p - 1) * 2) * 1.12; };
    function shoot() {
      const c = S.cur; if (S.phase !== "shot") return; const y = retY(c); S.data.tiri++;
      const z = y < -1 / 3 ? 0 : y > 1 / 3 ? 2 : 1;
      if (Math.abs(y) > 1) { endCharge("FUORI!", "#cfd6e6", null); tone(180, 0.2, "square", 0.04); return; }
      c.sz = z; c.dive = true;
      const reach = clamp(0.16 + (DF.gk1 || 0), 0, 0.34);
      if (z === c.kz || R() < reach) { endCharge("PARATA DEL PORTIERE!", "#ff9a7a", false); return; }
      S.a++; hud(); endCharge("GOL!", "#ffd23f", true); S.shake = 10;
    }
    function resolveBlock() {
      const c = S.cur, cover = (l) => c.pow.lupi ? (S.lane === 2 ? l === 1 || l === 2 : S.lane === 0 ? l === 0 || l === 1 : l === 1 || l === 2) : l === S.lane;
      if (cover(c.cl)) { S.data.parate++; return endCharge("SCUDO! PALLA RECUPERATA", "#7ad8ff", true); }
      // il portatore tira: stadio del portiere
      c.sub = "keeper"; S.phase = "keeper"; c.kt = 0; c.real = (R() * 3) | 0; c.fake = R() < 0.3 && !c.pow.cervi ? (c.real + 1 + ((R() * 2) | 0)) % 3 : -1; c.win = (0.8 / oppK) * (c.pow.gabbiani ? 1.45 : 1);
      tip("<b>Tira!</b> Scegli il settore con ▲ ▼ leggendo la sua posa: la finta dura poco.");
      hud();
    }
    function resolveKeeper() {
      const c = S.cur, saveP = clamp(0.06 - (DF.gk0 || 0) * 0.8, 0.02, 0.3);
      if (S.zone === c.real || R() < saveP) { S.data.parate++; return endCharge("PARATA!", "#7ad8ff", true); }
      S.b++; hud(); S.shake = 10; endCharge("GOL LORO…", "#ff7a7a", false);
    }
    // ------------------------------------------------------------ aggiornamento
    function update(dt) {
      S.t += dt; if (S.laneCd > 0) S.laneCd -= dt; if (S.jump > 0) S.jump -= dt; if (S.flash > 0) S.flash--; if (S.shake > 0) S.shake--;
      if (S.fx) { S.fx.t += dt; if (S.fx.t > 1.4) S.fx = null; }
      const c = S.cur; if (!c) return; c.t += dt;
      if (S.phase === "run") {
        const v = 104 + 5 * S.tempo; c.x += v * dt;
        c.obs.forEach((ob) => {
          const d = ob.x - c.x;
          if (ob.t === "cav" && !ob.moved && !c.pow.gabbiani) {
            if (!ob.tell && d < 175 && d > 40) { ob.tell = (0.55 / oppK) * (style === "pressing" ? 0.85 : 1); ob.tl = ob.tell; }
            if (ob.tell > 0) { ob.tell -= dt; if (ob.tell <= 0) { ob.moved = true; if (ob.ln !== S.lane) ob.ln += Math.sign(S.lane - ob.ln); } }
          }
          if (!ob.done && d <= 6) {
            ob.done = true; if (ob.dead) return;
            const hit = ob.t === "fosso" ? S.jump <= 0.05 : ob.t === "muro" ? (S.lane === ob.ln || S.lane === ob.ln + 1) : S.lane === ob.ln;
            if (hit) { if (c.armor > 0 && ob.t !== "fosso") { c.armor = 0; ob.dead = true; fx("ARIETE!", HOUSES.lupi.c); S.shake = 8; tone(120, 0.2, "sawtooth", 0.06); } else { S.data.perse++; endCharge(ob.t === "fosso" ? "NEL FOSSATO!" : "PALLA PERSA!", "#ff8a6a", false); } }
          }
        });
        if (S.phase === "run" && c.x >= c.len) startShot();
      } else if (S.phase === "shot") { c.st += dt; if (c.st > 5) shoot(); }
      else if (S.phase === "march") {
        const sl = c.pow.gabbiani ? 1.4 : 1;
        c.sw.forEach((sw) => {
          const tellStart = sw.at - c.tellD * sl;
          if (c.t >= tellStart && !sw.shown) { sw.shown = true; c.tell = { to: sw.fakeTo, until: sw.at, feint: sw.feint }; }
          if (!sw.done && c.t >= sw.at) { sw.done = true; if (!sw.feint) c.cl = sw.to; c.tell = null; }
        });
        if (c.pow.cervi && c.tell && c.tell.feint) c.tell.show = "finta";
        c.clv += (c.cl - c.clv) * Math.min(1, dt * 12); c.px = clamp(c.t / c.T, 0, 1);
        if (c.t >= c.T) resolveBlock();
      } else if (S.phase === "keeper") { c.kt += dt; if (c.kt >= c.win) resolveKeeper(); }
      if (S.phase === "esito") { c.wait -= dt; if (c.wait <= 0) nextCharge(); }
    }
    // ------------------------------------------------------------ disegno
    const ph = (a, b) => Math.sin(a) * b;
    function person(x, y, col, face, step, o2) {
      o2 = o2 || {}; const s = o2.s || 1; g.save(); g.translate(x, y); g.scale(face * s, s);
      g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(0, 1, 9, 3, 0, 0, 7); g.fill();
      const a = Math.sin(step) * 3.2; g.fillStyle = "#2a2230"; g.fillRect(-4 + a * 0.3, -9, 3, 9 + (a > 0 ? 0 : -1)); g.fillRect(1 - a * 0.3, -9, 3, 9 + (a > 0 ? -1 : 0));
      g.fillStyle = o2.shirt || col; g.fillRect(-5, -20, 10, 12); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(-5, -20, 10, 2); g.fillStyle = o2.trim || "#f2c230"; g.fillRect(-5, -10, 10, 2);
      g.fillStyle = o2.skin || "#e0ac7e"; g.beginPath(); g.arc(0, -25, 5, 0, 7); g.fill();
      g.fillStyle = o2.hair || "#2b1d14"; g.beginPath(); g.arc(0, -26.5, 5.2, Math.PI, 0); g.fill(); g.fillStyle = "#1a1a1a"; g.fillRect(2, -26, 1.5, 1.5);
      if (o2.helm) { g.fillStyle = "#9aa4b8"; g.beginPath(); g.arc(0, -26, 5.6, Math.PI, 0); g.fill(); g.fillRect(-1, -31, 2, 4); }
      g.restore();
    }
    function ball(x, y, spin) { g.fillStyle = "#f6f1e0"; g.beginPath(); g.arc(x, y, 3.4, 0, 7); g.fill(); g.strokeStyle = "#3a3030"; g.lineWidth = 0.8; g.stroke(); g.fillStyle = "#3a3030"; g.beginPath(); g.arc(x + Math.cos(spin) * 1.2, y + Math.sin(spin) * 1.2, 1, 0, 7); g.fill(); }
    function banner(x, y, col, t, h) { g.fillStyle = "#4a3a2a"; g.fillRect(x, y, 2, h || 26); g.fillStyle = col; g.beginPath(); g.moveTo(x + 2, y + 1); for (let i = 0; i <= 8; i++) g.lineTo(x + 2 + i * 2, y + 1 + Math.sin(t * 5 + i * 0.7) * 1.4 + i * 0.1); for (let i = 8; i >= 0; i--) g.lineTo(x + 2 + i * 2, y + 11 + Math.sin(t * 5 + i * 0.7) * 1.4); g.closePath(); g.fill(); }
    function torch(x, y, t) { g.fillStyle = "#3a2a1a"; g.fillRect(x, y, 2, 14); g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(x + 1, y - 2, 1, x + 1, y - 2, 22); gr.addColorStop(0, "rgba(255,170,70,.55)"); gr.addColorStop(1, "rgba(255,120,30,0)"); g.fillStyle = gr; g.fillRect(x - 22, y - 24, 46, 46); g.restore(); g.fillStyle = "#ffb43a"; g.beginPath(); g.ellipse(x + 1, y - 3, 2.2, 4 + Math.sin(t * 14 + x) * 1, 0, 0, 7); g.fill(); g.fillStyle = "#fff2a0"; g.beginPath(); g.ellipse(x + 1, y - 2, 1, 2, 0, 0, 7); g.fill(); }
    function back(cam, t, kind) {
      const sky = g.createLinearGradient(0, 0, 0, 100); sky.addColorStop(0, "#241d44"); sky.addColorStop(0.7, "#8a4a58"); sky.addColorStop(1, "#d28a5a"); g.fillStyle = sky; g.fillRect(0, 0, W, 100);
      g.fillStyle = "rgba(255,240,200,.85)"; for (let i = 0; i < 14; i++) g.fillRect((i * 53 + 11) % W, (i * 17) % 30 + 3, 1, 1);
      g.fillStyle = "#3a2f4c"; for (let i = -1; i < 6; i++) { const bx = i * 70 - (cam * 0.08) % 70; g.fillRect(bx, 50, 40, 36); g.fillRect(bx + 4, 40, 8, 10); g.fillRect(bx + 28, 38, 8, 12); g.fillStyle = "#2a2238"; g.fillRect(bx + 16, 66, 8, 20); g.fillStyle = "#3a2f4c"; }
      g.fillStyle = "#5a4636"; g.fillRect(0, 74, W, 28); g.fillStyle = "#3e2e22"; g.fillRect(0, 74, W, 3); g.fillRect(0, 99, W, 3);
      const cols = [HOUSES.lupi.c, HOUSES.gabbiani.c, HOUSES.cervi.c, "#b0303a"];
      for (let i = 0; i < 46; i++) { const x = (i * 11 - (cam * 0.5)) % (W + 40); const xx = x < -10 ? x + W + 40 : x, jump = (Math.sin(t * 6 + i) > 0.9 && i % 3 === 0) ? 2 : 0; g.fillStyle = cols[i % 4]; g.fillRect(xx, 82 + (i % 2) * 8 - jump, 6, 6); g.fillStyle = "#e8c8a0"; g.fillRect(xx + 1, 79 + (i % 2) * 8 - jump, 4, 3); }
      for (let i = 0; i < 4; i++) { const bx = ((i * 100 - cam * 0.8) % 420 + 420) % 420 - 40; banner(bx, 58, cols[i % 4], t, 22); }
      for (let i = 0; i < 3; i++) { const bx = ((i * 140 + 40 - cam * 0.9) % 420 + 420) % 420 - 40; torch(bx, 88, t); }
      const gr = g.createLinearGradient(0, 102, 0, H); gr.addColorStop(0, "#b49560"); gr.addColorStop(1, "#8a6c42"); g.fillStyle = gr; g.fillRect(0, 102, W, H - 102);
      g.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < 40; i++) { const x = ((i * 37 - cam * 1.0) % (W + 20) + W + 20) % (W + 20) - 10; g.fillRect(x, 106 + (i * 23) % 90, 2, 1); }
      g.strokeStyle = "rgba(244,236,216,.35)"; g.lineWidth = 1; g.setLineDash([8, 8]); for (const y of [130, 155]) { g.beginPath(); g.lineDashOffset = (cam * 1.0) % 16; g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.setLineDash([]);
    }
    function soldier(x, y, t, tell, big) {
      g.save(); g.translate(x, y); g.scale(big ? 1.15 : 1, big ? 1.15 : 1);
      g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(0, 1, 9, 3, 0, 0, 7); g.fill();
      g.fillStyle = "#2a2230"; g.fillRect(-4, -9, 3, 9); g.fillRect(1, -9, 3, 9); g.fillStyle = opp.color; g.fillRect(-6, -21, 12, 12); g.fillStyle = "#e0b890"; g.beginPath(); g.arc(0, -26, 5, 0, 7); g.fill(); g.fillStyle = "#9aa4b8"; g.beginPath(); g.arc(0, -27, 5.6, Math.PI, 0); g.fill(); g.fillRect(-1, -33, 2, 5);
      g.fillStyle = "#b8a070"; g.fillRect(-9, -34, 2, 36); g.fillStyle = "#cfd6e6"; g.beginPath(); g.moveTo(-10, -34); g.lineTo(-8, -40); g.lineTo(-6, -34); g.fill();
      g.fillStyle = "#6a5a4a"; g.beginPath(); g.moveTo(3, -22); g.lineTo(11, -22); g.lineTo(11, -10); g.lineTo(7, -6); g.lineTo(3, -10); g.closePath(); g.fill(); g.fillStyle = opp.color; g.fillRect(5, -20, 4, 8);
      if (tell > 0) { g.fillStyle = Math.floor(t * 18) % 2 ? "#ffd23f" : "#ff5a3a"; g.fillRect(-9, -46, 9, 5); g.fillRect(-9, -46, 1, 12); }
      g.restore();
    }
    function goalGate(x, y, w, h, keeperY, kt, frameCol) {
      g.fillStyle = "rgba(0,0,0,.45)"; g.fillRect(x, y, w, h); g.fillStyle = frameCol || "#5a3a22"; g.fillRect(x - 4, y - 5, w + 8, 5); g.fillRect(x - 4, y, 4, h + 4); g.fillRect(x + w, y, 4, h + 4);
      g.strokeStyle = "#2a2230"; g.lineWidth = 1; for (let i = 6; i < w; i += 8) { g.beginPath(); g.moveTo(x + i, y); g.lineTo(x + i, y + h); g.stroke(); } for (let j = 8; j < h; j += 9) { g.beginPath(); g.moveTo(x, y + j); g.lineTo(x + w, y + j); g.stroke(); }
    }
    function draw() {
      const c = S.cur, t = S.t; g.setTransform(2, 0, 0, 2, 0, 0); g.save();
      if (S.shake > 0) g.translate((R() - 0.5) * 3, (R() - 0.5) * 3);
      const pp = S.phase === "esito" && c ? c.from : S.phase, hl = { shirt: look.shirt, skin: look.skin, hair: look.hair };
      if (pp === "run") {
        back(c.x, t);
        const gx = XH + (c.len - c.x); if (gx < W + 40) goalGate(gx, 112, 26, 66);
        c.obs.forEach((ob) => {
          const sx = XH + (ob.x - c.x); if (sx < -30 || sx > W + 30 || ob.dead) return;
          if (ob.t === "fosso") { g.fillStyle = "#2a3a5a"; g.fillRect(sx - 7, 108, 14, 66); g.fillStyle = "rgba(180,220,255,.35)"; g.fillRect(sx - 7, 108 + ((t * 20) % 64), 14, 2); g.fillStyle = "#5a4430"; g.fillRect(sx - 8, 106, 2, 70); g.fillRect(sx + 6, 106, 2, 70); }
          else if (ob.t === "muro") { soldier(sx, LANE[ob.ln] + 8, t, 0, true); soldier(sx + 2, LANE[ob.ln + 1] + 8, t, 0, true); g.fillStyle = "rgba(200,210,230,.3)"; g.fillRect(sx - 8, LANE[ob.ln] - 14, 18, 52); }
          else soldier(sx, LANE[ob.ln] + 8, t, ob.tell > 0 ? 1 : 0, ob.t === "cav");
        });
        const jy = S.jump > 0 ? Math.sin((1 - S.jump / 0.55) * Math.PI) * 22 : 0, hy = LANE[S.lane] + 8;
        if (c.armor > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(154,166,192,.5)"; g.beginPath(); g.arc(XH, hy - 14 - jy, 17, 0, 7); g.fill(); g.restore(); }
        person(XH, hy - jy, usCol, 1, c.x / 6, hl); ball(XH + 11 + Math.sin(c.x / 5) * 2, hy - 2 - jy * 0.9, c.x / 8);
        g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(8, 193, W - 16, 3); g.fillStyle = usCol; g.fillRect(8, 193, (W - 16) * clamp(c.x / c.len, 0, 1), 3);
      } else if (pp === "shot") {
        back(900 + t * 20, t); g.fillStyle = "rgba(20,12,28,.45)"; g.fillRect(0, 102, W, 98);
        const gx = 196, gy = 108, gw = 110, gh = 80, zy = (z) => gy + gh * (z * 2 + 1) / 6; goalGate(gx, gy, gw, gh);
        if (c.pow.cervi) { g.fillStyle = "rgba(90,168,98,.38)"; g.fillRect(gx + 2, gy + gh * c.kz / 3, gw - 4, gh / 3); }
        [1, 2].forEach((i) => { g.strokeStyle = "rgba(244,236,216,.25)"; g.beginPath(); g.moveTo(gx, gy + gh * i / 3); g.lineTo(gx + gw, gy + gh * i / 3); g.stroke(); });
        person(gx + gw / 2, (c.dive ? zy(c.kz) : gy + gh / 2 + Math.sin(t * 5) * 2) + 14, "#2a2a3a", -1, t * 6, { shirt: opp.color, skin: "#e0b890", hair: "#4a3a2a", helm: true });
        if (S.phase === "shot") { const ry = gy + gh / 2 + retY(c) * gh / 2; g.strokeStyle = "#ffd23f"; g.lineWidth = 2; g.strokeRect(gx - 6, ry - 6, gw + 12, 12); g.fillStyle = "rgba(255,210,63,.25)"; g.fillRect(gx - 6, ry - 6, gw + 12, 12); }
        person(70, 170, usCol, 1, t * 2, hl); ball(84, 168, t);
      } else if (pp === "march" || pp === "keeper") {
        back(500 - c.px * 300, t); goalGate(6, 112, 28, 66, 0, 0, "#3a4a6a");
        g.fillStyle = "rgba(255,255,255,.1)"; for (let l = 0; l < 3; l++) g.fillRect(44, LANE[l] - 10, 256, 2);
        const lyv = LANE[S.lane] + 8;
        if (pp === "march") {
          const cx = 300 - c.px * 200, cy = LANE[0] + 8 + c.clv * 25;
          if (c.pow.lupi) { g.fillStyle = "rgba(90,200,255,.18)"; g.fillRect(38, LANE[Math.min(S.lane, 1)] - 14, 32, 54); }
          soldier(cx, cy, t, c.tell ? 1 : 0, false); ball(cx - 12, cy - 2, t * 3);
          if (c.tell && !(c.pow.cervi && c.tell.feint)) { const ty = LANE[c.tell.to] + 8; g.strokeStyle = "#ffd23f"; g.lineWidth = 1.5; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(cx - 16, cy - 14); g.lineTo(cx - 16, ty - 14); g.stroke(); g.setLineDash([]); g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(cx - 16, ty - 14, 3, 0, 7); g.fill(); }
          else if (c.tell) { g.fillStyle = "rgba(255,255,255,.8)"; g.font = "bold 9px sans-serif"; g.fillText("finta", cx - 22, cy - 40); }
          g.fillStyle = "#6a7a9a"; g.beginPath(); g.moveTo(XH - 12, lyv - 32); g.lineTo(XH + 4, lyv - 32); g.lineTo(XH + 4, lyv - 8); g.lineTo(XH - 4, lyv - 2); g.lineTo(XH - 12, lyv - 8); g.closePath(); g.fill(); g.strokeStyle = "#cfd6e6"; g.lineWidth = 1; g.stroke(); g.fillStyle = usCol; g.fillRect(XH - 9, lyv - 28, 10, 16);
          person(XH + 12, lyv, usCol, 1, 0, hl);
        } else {
          const shown = c.fake >= 0 && c.kt < c.win * 0.55 ? c.fake : c.real, zy = (z) => 112 + 66 * (z * 2 + 1) / 6, ang = Math.atan2(zy(shown) - 160, 40 - 262);
          person(280, 172, opp.color, -1, 0, { shirt: opp.color, skin: "#e0b890", hair: "#4a3a2a", helm: true }); ball(262, 170, t);
          g.strokeStyle = "#ffd23f"; g.lineWidth = 2; g.beginPath(); g.moveTo(256, 160); g.lineTo(256 + Math.cos(ang) * 44, 160 + Math.sin(ang) * 44); g.stroke(); g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(256 + Math.cos(ang) * 46, 160 + Math.sin(ang) * 46, 3.5, 0, 7); g.fill();
          if (c.pow.cervi) { g.fillStyle = "rgba(90,168,98,.4)"; g.fillRect(6, 112 + 22 * c.real, 28, 22); }
          [0, 1, 2].forEach((z) => { g.strokeStyle = z === S.zone ? "#7ad8ff" : "rgba(244,236,216,.25)"; g.lineWidth = z === S.zone ? 2 : 1; g.strokeRect(8, 112 + 22 * z, 26, 22); });
          person(21, zy(S.zone) + 14, "#2a2a3a", 1, t * 8, hl);
        }
      } else { back(300 + t * 12, t); person(90, 162, usCol, 1, t * 2, hl); person(230, 162, opp.color, -1, t * 2, { shirt: opp.color, helm: true }); ball(160, 168, t); }
      g.restore();
      if (S.flash > 0) { g.fillStyle = `rgba(255,255,255,${S.flash / 40})`; g.fillRect(0, 0, W, H); }
      if (S.fx) { const f = S.fx, a = clamp(1.4 - f.t, 0, 1); g.save(); g.globalAlpha = a; g.textAlign = "center"; g.font = "900 22px Georgia,serif"; g.lineWidth = 4; g.strokeStyle = "#1a1020"; g.strokeText(f.text, W / 2, 62 - f.t * 8); g.fillStyle = f.col; g.fillText(f.text, W / 2, 62 - f.t * 8); g.restore(); }
    }
    // ------------------------------------------------------------ ciclo
    let last = performance.now();
    function loop(now) {
      if (S.over && !document.body.contains(el)) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (ov.hidden) update(dt); else S.t += dt;
      hud(); draw(); S.raf = requestAnimationFrame(loop);
    }
    S.finish = () => { if (S.over) return; ov.hidden = true; finish(); };
    S.update = update; S.draw = draw; S.setLane = setLane; S.action = action; S.usePower = usePower; S.councilPick = (i) => { const b = ov.querySelectorAll(".opt")[i]; if (b) b.click(); };
    window.__corona.state = S;
    // presentazione con le regole
    panel(`<h3>${esc(o.title || "Duello di Corona")}</h3><p>${o.intro ? esc(o.intro) : "Una partita rituale sulla piazza d'armi: a tempi, una carica a testa."}</p>
      <ul><li><b>Tua carica:</b> corri verso il portone su 3 corsie (▲ ▼ o striscia su/giù). Schiva lancieri, cavalieri e muri; <b>SALTA</b> i fossati. Al portone tocca <b>TIRA</b> quando il mirino è nel settore libero.</li>
      <li><b>Carica loro:</b> metti lo <b>scudo</b> nella corsia del portatore (la bandierina lampeggia prima che cambi). Se passa, scegli il settore del tuffo.</li>
      <li><b>Tra i tempi</b>: il Consiglio delle Casate. Chi ti è favorevole (favore 1+) presta il suo potere, una volta per tempo.</li></ul>`,
      [{ html: "Squilli di tromba ▸", cls: "go", fn: () => { closePanel(); horn(); buildQueue(); nextCharge(); } }]);
    S.raf = requestAnimationFrame(loop);
    return true;
  }
  function css() {
    if (document.getElementById("cnCss")) return; const st = document.createElement("style"); st.id = "cnCss";
    st.textContent = `.cnOv{position:fixed;inset:0;z-index:300;background:#150f22;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:Georgia,serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#f4ecd8;overflow:auto}
.cnOv .hud{width:min(100%,460px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #c8a040;border-radius:10px;background:linear-gradient(#3a1a2a,#22101c);padding:4px 12px;font:800 12px Georgia,serif;box-shadow:0 0 12px rgba(200,160,64,.3)}
.cnOv .hud .n0{color:var(--us)}.cnOv .hud .n1{text-align:right;color:#ffc8b8}.cnOv .hud .sc{font:900 22px 'Courier New',monospace;color:#ffd23f}
.cnOv .bar{width:min(100%,460px);display:flex;gap:8px;align-items:center;font:600 12px Georgia,serif}.cnOv .bar i{font-style:normal;color:#ffd23f;font-weight:900;white-space:nowrap}.cnOv .tip{flex:1;opacity:.92}.cnOv .tip b{color:#ffd23f}
.cnOv canvas{width:min(100%,460px);height:auto;aspect-ratio:320/200;flex:none;border:2px solid #c8a040;border-radius:12px;touch-action:none}
.cnOv .pw{width:min(100%,460px);display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.cnOv .pw button{min-height:44px;border-radius:10px;border:2px solid var(--hc,#c8a040);background:#22101c;color:#f4ecd8;font:700 12px Georgia,serif;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15}.cnOv .pw small{font-size:10px;opacity:.75}
.cnOv .pw button.on{background:var(--hc);color:#111}.cnOv .pw button:disabled{opacity:.4}
.cnOv .pad{width:min(100%,460px);display:grid;grid-template-columns:1fr 1.6fr 1fr;gap:8px}
.cnOv .pad button{min-height:56px;border-radius:14px;border:2px solid #c8a040;background:#3a1a2a;color:#fff;font:900 16px Georgia,serif;cursor:pointer}.cnOv .pad .act{background:linear-gradient(#d8a02a,#9a6a12);color:#1a1020}.cnOv .pad button:disabled{opacity:.35}
.cnOv .help{width:min(100%,460px);font-size:10.5px;opacity:.6}
.cnOv .quit{position:absolute;right:8px;bottom:8px;min-height:30px;font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid #c8a040;background:#22101c;color:#fff}
.cnOv .ov{position:absolute;inset:0;background:rgba(14,8,22,.95);display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto;z-index:2}.cnOv .ov[hidden]{display:none}
.cnOv .card{max-width:440px;width:100%;border:3px double #c8a040;border-radius:12px;background:linear-gradient(#2e1626,#180c1a);padding:14px;box-shadow:0 0 30px rgba(200,160,64,.25)}.cnOv .card h3{margin:0 0 8px;font:900 21px Georgia,serif;color:#ffd23f;letter-spacing:.5px}.cnOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}
.cnOv .card .big{font:900 20px 'Courier New',monospace;color:#ffd23f}.cnOv .card ul{margin:6px 0;padding-left:18px;font-size:12.5px;line-height:1.45}.cnOv .card .say{font-style:italic;color:#ffe6a8}.cnOv .card .fv{font-size:12px}
.cnOv .btns{display:grid;gap:8px;margin-top:10px}.cnOv .btns button{min-height:48px;border-radius:10px;border:2px solid #c8a040;background:#3a1a2a;color:#f4ecd8;font:700 14px Georgia,serif;cursor:pointer;padding:8px 10px;text-align:left}.cnOv .btns button small{display:block;font-weight:400;font-size:11px;opacity:.8;margin-top:2px}
.cnOv .btns button.go{background:linear-gradient(#d8a02a,#9a6a12);color:#1a1020;text-align:center;font-weight:900}`;
    document.head.appendChild(st);
  }
  window.__corona = { start, state: null, HOUSES };
})();
