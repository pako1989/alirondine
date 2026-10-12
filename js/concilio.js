// js/concilio.js - «IL CONCILIO» · la partita originale di «Il Trono di Cuoio» (motore proprio, NON il kit di partita)
// Due tempi, come a corte:
//  1. IL TAVOLO: prima della partita, trattative a carte con l'altra casata. Proponi fino a due PATTI (sigilli di cera):
//     «nessuno attacca al centro», «la fascia sinistra è neutrale», «tregua al terzo turno», «ostaggio d'onore»…
//     La casata accetta se la tua CREDIBILITÀ basta. Puoi mandare un CORVO per spiare l'onore dell'avversario.
//  2. IL CAMPO: otto turni su tre corsie (sinistra, centro, destra), in alternanza. In attacco scegli la corsia dove
//     attaccare, in difesa quella da chiudere. Un attacco in una corsia chiusa fallisce; in una aperta può essere gol.
//     I patti dicono dove l'altro NON andrà… finché lo rispetta. Se tradisce, compare il corvo: TRADIMENTO.
//     Anche tu puoi tradire: segni più facilmente, ma la tua credibilità crolla (e la saga se ne ricorda).
// Grafica: una tavola di pergamena, stendardi delle casate, sigilli di cera, candele e il corvo dei tradimenti.
// Uso: window.__concilio.start({ title, us, usSigil, opp:{ name, color, sigil, honor }, cred, ravens, spied, cards, turns, onDone })
(function () {
  "use strict";
  if (window.__concilio) return;
  const W = 300, H = 300, LANE = ["SINISTRA", "CENTRO", "DESTRA"];
  const CARDS = {
    centro: { t: "Il centro è neutrale", d: "Nessuno attacca al centro.", req: 3, ban: (r, who) => ({ lane: 1 }) },
    sinistra: { t: "La fascia sinistra è neutrale", d: "Nessuno attacca a sinistra.", req: 3, ban: () => ({ lane: 0 }) },
    destra: { t: "La fascia destra è neutrale", d: "Nessuno attacca a destra.", req: 3, ban: () => ({ lane: 2 }) },
    tregua: { t: "Tregua al terzo turno", d: "Al terzo e al quarto turno nessuno attacca.", req: 4, truce: [2, 3] },
    ostaggio: { t: "Ostaggio d'onore", d: "Chi tradisce un patto perde un gol.", req: 6, hostage: true },
  };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let STATE = null;
  function start(o) {
    if (document.querySelector(".coOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const usCol = o.usColor || "#8a5a2a", opp = Object.assign({ name: "La casata rivale", color: "#2a3a6a", sigil: "🦅", honor: 0.7 }, o.opp || {});
    const honor = Math.max(0.05, Math.min(0.97, opp.honor - (DF.opp > 1.05 ? 0.15 : DF.opp < 0.95 ? -0.1 : 0)));
    const hand = (o.cards || ["centro", "sinistra", "destra", "tregua", "ostaggio"]).filter((k) => CARDS[k]);
    const S = { o, a: 0, b: 0, phase: "intro", turn: 0, nT: o.turns || 8, pacts: [], cred: o.cred == null ? 5 : o.cred, ravens: o.ravens == null ? 1 : o.ravens, spied: !!o.spied, extra: 0, log: [], banner: null, t: 0, data: { patti: 0, traditi: 0, tradimenti: 0, rispettati: 0, corvi: 0 }, over: false };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "coOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = `${o.usSigil || "🦡"} ${o.us || "Noi"}`; el.querySelector(".n1").textContent = `${opp.name} ${opp.sigil}`;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__coAC = window.__coAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.innerHTML = b.l; if (b.cls) x.className = b.cls; x.disabled = !!b.dis; x.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!x.disabled) b.fn(); }); p.appendChild(x); }); };
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; };
    // ------------------------------------------------------------ 1. il tavolo
    function table() {
      S.phase = "table";
      const left = 2 - S.pacts.length;
      msg(`<b>IL TAVOLO DEL CONCILIO.</b> Proponi fino a due patti a ${esc(opp.name)}. La tua credibilità: <b>${S.cred}</b>/10. ${S.spied ? `Il corvo ha visto: l'onore di ${esc(opp.name)} è <b>${honor > 0.75 ? "saldo" : honor > 0.5 ? "incerto" : "marcio"}</b>.` : ""} ${S.pacts.length ? `Patti firmati: ${S.pacts.map((k) => "«" + CARDS[k].t + "»").join(", ")}.` : ""}`);
      const btns = hand.filter((k) => !S.pacts.includes(k)).map((k) => ({ l: `🕯 ${CARDS[k].t}<small>${CARDS[k].d} · serve credibilità ${CARDS[k].req}</small>`, dis: left <= 0, fn: () => propose(k) }));
      btns.push({ l: `🪶 Manda un corvo<small>Spia l'onore della casata · corvi: ${S.ravens}</small>`, dis: S.ravens <= 0 || S.spied, fn: () => { S.ravens--; S.spied = true; S.data.corvi++; tone(300, 0.3, "sawtooth", 0.03, 150); table(); } });
      btns.push({ l: "⚔ Al campo<small>Si gioca, con i patti firmati</small>", cls: "go", fn: () => { S.phase = "field"; nextTurn(); } });
      pad(btns);
    }
    function propose(k) {
      const c = CARDS[k], ok = S.cred >= c.req;
      if (ok) { S.pacts.push(k); S.data.patti++; tone(520, 0.2, "triangle", 0.05); S.banner = { t: 50, txt: "PATTO FIRMATO", sub: c.t, seal: true }; }
      else { tone(160, 0.25, "square", 0.03); S.banner = { t: 50, txt: "RIFIUTATO", sub: `${opp.name} non si fida: credibilità troppo bassa`, seal: false }; }
      table();
    }
    // ------------------------------------------------------------ 2. il campo
    const isAtt = () => S.turn % 2 === 0; // turni pari: attacchi tu
    const truce = () => S.pacts.includes("tregua") && CARDS.tregua.truce.includes(S.turn);
    const banned = () => S.pacts.filter((k) => CARDS[k].ban).map((k) => CARDS[k].ban().lane);
    function nextTurn() {
      if (S.over) return;
      if (S.turn >= S.nT + S.extra) { if (S.a === S.b && S.extra < 2 && o.extra !== false) S.extra += 2; else return finish(); }
      if (truce()) { S.log.push({ turn: S.turn, truce: true }); msg(`Turno ${S.turn + 1}: <b>tregua</b>. Le due casate si guardano, le spade abbassate.`); S.turn++; hud(); return setTimeout(nextTurn, 900); }
      const att = isAtt(), b = banned(); S.pending = att ? null : oppAttack(); // l'attacco della casata si decide prima: le piume di un corvo amico lo possono svelare
      const hint = !att && o.foresee && S.pending.betray ? ` <b>🪶 Le piume del corvo si muovono verso ${LANE[S.pending.lane].toLowerCase()}: lì tradiranno.</b>` : "";
      msg(`Turno ${S.turn + 1}/${S.nT + S.extra} · ${att ? "<b>ATTACCHI</b>: scegli la corsia dove attaccare." : "<b>DIFENDI</b>: scegli la corsia da chiudere."}${b.length ? ` Per i patti nessuno attacca a: ${b.map((l) => LANE[l].toLowerCase()).join(", ")}.` : ""}${hint}`);
      pad([0, 1, 2].map((l) => ({ l: `${["◀", "▲", "▶"][l]} ${LANE[l]}${att && b.includes(l) ? "<small>⚠ tradiresti un patto</small>" : ""}`, cls: att && b.includes(l) ? "warn" : "", fn: () => play(l) })));
    }
    function oppAttack() { // dove attacca la casata: rispetta i patti… di solito
      const b = banned(), free = [0, 1, 2].filter((l) => !b.includes(l)), want = Math.floor(Math.random() * 3);
      if (!b.includes(want)) return { lane: want, betray: false };
      const keep = Math.random() < honor; if (keep && free.length) return { lane: free[Math.floor(Math.random() * free.length)], betray: false };
      return { lane: want, betray: true };
    }
    function oppDefend(myLane) { // dove chiude la casata: se crede ai patti, non difende le corsie «vietate»
      const b = banned(), trust = Math.random() < 0.75, opts = trust ? [0, 1, 2].filter((l) => !b.includes(l)) : [0, 1, 2];
      return opts[Math.floor(Math.random() * opts.length)];
    }
    function play(l) {
      const att = isAtt(), b = banned(); let res;
      if (att) {
        const iBetray = b.includes(l), def = oppDefend(l), open = def !== l, goal = open && Math.random() < (iBetray ? 0.85 : 0.6) + (style === "difensiva" ? -0.1 : 0);
        if (iBetray) { S.data.tradimenti++; S.cred = Math.max(0, S.cred - 2); S.banner = { t: 70, txt: "HAI TRADITO", sub: "La tua credibilità crolla", raven: true }; tone(110, 0.5, "sawtooth", 0.05); }
        if (goal) { S.a++; tone(660, 0.2, "triangle", 0.06); } if (iBetray && S.pacts.includes("ostaggio")) { S.a = Math.max(0, S.a - 1); }
        res = { turn: S.turn, att: true, l, def, goal, betray: iBetray };
        msg(`${goal ? "<b>GOL!</b>" : open ? "Attacco a vuoto: il portiere para." : "Chiuso! La casata aveva sbarrato quella corsia."} (Loro chiudevano: ${LANE[def].toLowerCase()}.)`);
      } else {
        const oa = S.pending || oppAttack(), blocked = oa.lane === l, goal = !blocked && Math.random() < 0.55 + (oa.betray ? 0.25 : 0) + (style === "pressing" ? 0.08 : 0);
        if (oa.betray) { S.data.traditi++; S.banner = { t: 80, txt: "TRADIMENTO!", sub: `${opp.name} ha rotto un patto`, raven: true }; tone(90, 0.6, "sawtooth", 0.05, 60); if (S.pacts.includes("ostaggio")) S.b = Math.max(0, S.b - 1); }
        else if (b.length) S.data.rispettati++;
        if (goal) { S.b++; tone(160, 0.3, "sawtooth"); }
        res = { turn: S.turn, att: false, l, oa: oa.lane, goal, betray: oa.betray };
        msg(`${blocked ? "Fermati! Avevi chiuso la corsia giusta." : goal ? "<b>Gol della casata.</b>" : "Tiro fuori."} (Attaccavano: ${LANE[oa.lane].toLowerCase()}.)${oa.betray ? " <b>Contro i patti.</b>" : ""}`);
      }
      S.log.push(res); S.last = res; S.turn++; hud(); pad([{ l: "Avanti ▸", cls: "go", fn: nextTurn }]);
    }
    // ------------------------------------------------------------ disegno: pergamena, stendardi, sigilli, corsie
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0);
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#e8d8b0"); gr.addColorStop(1, "#c8b088"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(90,60,30,.08)"; for (let i = 0; i < 40; i++) g.fillRect((i * 37) % W, (i * 53) % H, 18, 1);
      g.strokeStyle = "#5a3a1a"; g.lineWidth = 3; g.strokeRect(6, 6, W - 12, H - 12);
      // stendardi
      [[30, usCol, o.usSigil || "🦡"], [W - 30, opp.color, opp.sigil]].forEach(([x, col, s]) => { g.fillStyle = col; g.beginPath(); g.moveTo(x - 16, 14); g.lineTo(x + 16, 14); g.lineTo(x + 16, 60); g.lineTo(x, 50); g.lineTo(x - 16, 60); g.closePath(); g.fill(); g.font = "18px serif"; g.textAlign = "center"; g.fillText(s, x, 42); });
      // candele
      [W / 2 - 40, W / 2 + 40].forEach((x, i) => { g.fillStyle = "#f4ecdc"; g.fillRect(x - 3, 22, 6, 18); g.fillStyle = ["#ffb84a", "#ffd27a"][(Math.floor(S.t / 8) + i) % 2]; g.beginPath(); g.ellipse(x, 18, 3, 5 + Math.sin(S.t / 6 + i), 0, 0, 7); g.fill(); });
      g.textAlign = "center"; g.fillStyle = "#3a2410"; g.font = "bold 11px Georgia, serif"; g.fillText(S.phase === "table" ? "IL TAVOLO DEL CONCILIO" : "IL CAMPO", W / 2, 56);
      // i sigilli dei patti
      S.pacts.forEach((k, i) => { const x = W / 2 + (i - (S.pacts.length - 1) / 2) * 110, y = 86; g.fillStyle = "#f4ecdc"; g.fillRect(x - 50, y - 14, 100, 30); g.strokeStyle = "#8a6a3a"; g.lineWidth = 1; g.strokeRect(x - 50, y - 14, 100, 30); g.fillStyle = "#3a2410"; g.font = "bold 7px Georgia, serif"; g.fillText(CARDS[k].t, x, y); g.fillStyle = "#a82a2a"; g.beginPath(); g.arc(x + 40, y + 10, 7, 0, 7); g.fill(); });
      // le tre corsie (arazzo)
      const y0 = 116; [0, 1, 2].forEach((l) => { const x = 30 + l * 82; g.fillStyle = l === 1 ? "#5a7a3a" : "#4a6a32"; g.fillRect(x, y0, 76, 150); g.strokeStyle = "#3a2410"; g.lineWidth = 1.5; g.strokeRect(x, y0, 76, 150); g.fillStyle = "#f4ecdc"; g.font = "bold 8px Georgia, serif"; g.fillText(LANE[l], x + 38, y0 + 12); if (banned().includes(l)) { g.fillStyle = "rgba(168,42,42,.25)"; g.fillRect(x, y0, 76, 150); g.fillStyle = "#a82a2a"; g.font = "bold 7px Georgia, serif"; g.fillText("PATTO", x + 38, y0 + 140); } });
      if (S.last && S.phase === "field") { const r = S.last, lx = (l) => 30 + l * 82 + 38; const sw = (x, y, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, 13, 0, 7); g.fill(); g.fillStyle = "#f4ecdc"; g.font = "16px serif"; g.fillText("⚔", x, y + 6); }, sh = (x, y, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x - 12, y - 12); g.lineTo(x + 12, y - 12); g.lineTo(x + 12, y + 2); g.quadraticCurveTo(x, y + 16, x - 12, y + 2); g.closePath(); g.fill(); g.strokeStyle = "#f4ecdc"; g.lineWidth = 1.5; g.stroke(); };
        if (r.att) { sw(lx(r.l), y0 + 50, usCol); sh(lx(r.def), y0 + 104, opp.color); } else { sw(lx(r.oa), y0 + 50, opp.color); sh(lx(r.l), y0 + 104, usCol); } if (r.goal) { g.fillStyle = r.att ? usCol : opp.color; g.font = "900 18px Georgia, serif"; g.fillText("GOL", lx(r.att ? r.l : r.oa), y0 + 82); } }
      // il corvo dei tradimenti / il sigillo
      if (S.banner && S.banner.t-- > 0) { const B = S.banner; g.fillStyle = "rgba(20,12,6,.75)"; g.fillRect(20, 120, W - 40, 70); g.fillStyle = B.raven ? "#ff6a5a" : B.seal ? "#ffd27a" : "#e8d8b0"; g.font = "900 20px Georgia, serif"; g.fillText(B.txt, W / 2, 150); g.fillStyle = "#e8d8b0"; g.font = "10px Georgia, serif"; g.fillText(B.sub, W / 2, 170); if (B.raven) { const rx = 40 + ((70 - B.t) * 3.5); g.fillStyle = "#121212"; g.beginPath(); g.ellipse(rx, 132, 9, 4, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(rx - 4, 132); g.lineTo(rx - 14, 124 + Math.sin(S.t / 3) * 5); g.lineTo(rx + 2, 130); g.fill(); } }
      g.textAlign = "left";
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data, { cred: S.cred }) };
      card(quit ? "Il Concilio è sciolto" : res.win ? o.winTitle || "VITTORIA" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Patti firmati ${S.data.patti} · rispettati ${S.data.rispettati} · tradimenti subiti ${S.data.traditi} · tuoi tradimenti ${S.data.tradimenti}</p><p>Credibilità alla fine: <b>${S.cred}</b>/10</p>`, "Lascia il Concilio ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.play = play; S.propose = propose; S.toField = () => { S.phase = "field"; nextTurn(); };
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Il Concilio", `${o.intro || ""}<p><b>Al tavolo</b> proponi fino a due patti (sigilli di cera): se la tua credibilità basta, la casata accetta. Un <b>corvo</b> spia il loro onore.</p><p><b>Al campo</b>, otto turni su tre corsie: in attacco scegli dove attaccare, in difesa dove chiudere. I patti dicono dove l'altro <i>non</i> andrà… finché li rispetta. Anche tu puoi tradire, ma la credibilità crolla.</p><p style="opacity:.8;font-size:12px">${esc(opp.name)} · onore dichiarato: ${opp.honor >= 0.75 ? "saldo" : opp.honor >= 0.5 ? "incerto" : "scarso"}</p>`, "Siedi al tavolo ▸", () => { table(); });
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("coCss")) return; const st = document.createElement("style"); st.id = "coCss";
    st.textContent = `.coOv{position:fixed;inset:0;z-index:300;background:radial-gradient(circle at 50% 20%,#3a2414,#120a04);display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:Georgia,serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#f0e4c8}
.coOv .hud{width:min(100%,400px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #8a6a3a;border-radius:8px;background:#2a1a0c;padding:4px 10px;font:700 12px Georgia,serif}
.coOv .hud .n0{color:#ffd27a}.coOv .hud .n1{text-align:right;color:#c8d8ff}.coOv .hud .sc{font:900 22px Georgia,serif;color:#ffd27a}
.coOv canvas{width:min(100%,400px,calc(100vh - 330px));height:auto;aspect-ratio:1;flex:none;border-radius:8px;border:2px solid #8a6a3a}
.coOv .msg{width:min(100%,400px);min-height:36px;font-size:12.5px;line-height:1.4}.coOv .msg b{color:#ffd27a}
.coOv .pad{width:min(100%,400px);display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px}
.coOv button{min-height:44px;border-radius:8px;border:1.5px solid #8a6a3a;background:#2a1a0c;color:#f0e4c8;font:700 12.5px Georgia,serif;cursor:pointer;padding:6px}.coOv button small{display:block;font:400 10.5px Georgia,serif;color:#c8b088;margin-top:2px}.coOv button:disabled{opacity:.35}.coOv button.go{background:#8a5a2a;color:#fff4dc}.coOv button.warn{border-color:#c83a3a;color:#ffb8a8}
.coOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px}
.coOv .ov{position:absolute;inset:0;background:rgba(18,10,4,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.coOv .card{max-width:420px;width:100%;border:2px solid #8a6a3a;border-radius:10px;background:#e8d8b0;color:#2a1a0c;padding:14px}.coOv .card h3{margin:0 0 8px;font:900 22px Georgia,serif;color:#5a2a10}.coOv .card p{margin:6px 0;font-size:14px;line-height:1.45}.coOv .card .big{font:900 32px Georgia,serif}.coOv .card button{width:100%;margin-top:10px;background:#5a2a10;color:#ffe8b8}`;
    document.head.appendChild(st);
  }
  window.__concilio = { start, CARDS, get state() { return STATE; } };
})();
