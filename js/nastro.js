// js/nastro.js - «IL NASTRO» · la partita originale di «Stagione Infinita» (motore proprio, NON il kit di partita)
// La finale è una videocassetta. Ogni azione scorre da sola, in VHS, e si ferma (❚❚ PAUSA) ai BIVI: lì scegli tu.
//  - IN ATTACCO: due bivi di corsia (sinistra, centro, destra: dove porti o passi la palla) e il TIRO (dove mirare).
//    Se la corsia che scegli è coperta da un difensore, perdi palla; se tiri dove si tuffa il portiere, para.
//  - IN DIFESA: scegli la corsia da chiudere; se l'attaccante passa, ti tuffi (sinistra, centro, destra).
//  - GLI AVVERSARI GIOCANO SEMPRE LA STESSA PARTITA: il loro piano dipende solo dal «seme» della partita (o.seed).
//    Ogni bivio giocato lascia un FANTASMA: la prossima volta che ci arrivi (con un riavvolgimento, o in un altro giro
//    della storia) vedi in trasparenza dove sono andati l'ultima volta. La memoria (o.memory) torna indietro a fine partita
//    in res.data.mem, così la saga la conserva da una domenica all'altra.
//  - RIAVVOLGI ◀◀: dopo un errore puoi riavvolgere il nastro fino al bivio, con il fantasma ormai visibile (o.rewinds volte).
// Grafica: righe di scansione, colori che sbavano, codice temporale, PLAY/PAUSA, e lo strappo del nastro quando riavvolgi.
// Uso: window.__nastro.start({ title, us, opp:{ name, color }, mates:[{ name }], seed, memory, rewinds, actions, intro, onDone })
(function () {
  "use strict";
  if (window.__nastro) return;
  const W = 240, H = 300, LX = [62, 120, 178], SIDE = ["SINISTRA", "CENTRO", "DESTRA"];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; return h >>> 0; };
  let STATE = null;
  function start(o) {
    if (document.querySelector(".naOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const usCol = o.usColor || "#e8c84a", oppCol = (o.opp && o.opp.color) || "#5a8ad8", seed = o.seed || "finale";
    const mates = (o.mates || [{ name: "Compagno" }, { name: "Compagna" }]).map((m) => m.name || m);
    const mem = JSON.parse(JSON.stringify(o.memory || {})); // { "a:b": piano già visto }
    const nAct = o.actions || 6;
    const S = { o, a: 0, b: 0, act: -1, bv: 0, phase: "intro", t: 0, anim: null, res: null, rewinds: o.rewinds == null ? 2 : o.rewinds, data: { riavvolgimenti: 0, fantasmi: 0, bivi: 0 }, over: false, extra: 0, tear: 0, log: [] };
    STATE = S;
    // ------------------------------------------------------------ il piano (sempre lo stesso, per ogni seme)
    // attacco: quante corsie coprono i difensori ai due bivi di corsia, e dove si tuffa il portiere
    const hard = DF.opp > 1.05 ? 1 : DF.opp < 0.95 ? -1 : 0;
    function plan(a, b, att) {
      const h = hash(seed + ":" + a + ":" + b), first = h % 3;
      if (att && b < 2) { const two = hard > 0 || (hard === 0 && (b === 1 ? style === "pressing" || h % 5 === 0 : style === "difensiva" && h % 3 === 0)); return two ? [first, (first + 1 + ((h >> 4) % 2)) % 3] : [first]; }
      return [first]; // tiro: dove si tuffa il portiere · difesa: la corsia dell'attaccante, poi dove tira
    }
    const isAtt = (a) => a % 2 === 0;
    const key = (a, b) => `${a}:${b}`;
    // ------------------------------------------------------------ interfaccia
    css();
    const el = document.createElement("div"); el.className = "naOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas>
<div class="msg"></div>
<div class="pad"><button type="button" data-k="0">◀ SINISTRA</button><button type="button" data-k="1">▲ CENTRO</button><button type="button" data-k="2">DESTRA ▶</button></div>
<div class="pad2"><button type="button" data-k="rew" class="rew">◀◀ RIAVVOLGI</button><button type="button" data-k="go" class="go">CONTINUA ▶</button><button type="button" data-k="quit" class="quit">Esci</button></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = (o.opp && o.opp.name) || "Avversari";
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", oppCol);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__naAC = window.__naAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "sine"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (t) => { el.querySelector(".msg").innerHTML = t; };
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`;
      const choose = S.phase === "bivio", fail = S.phase === "fail";
      el.querySelectorAll(".pad button").forEach((b) => (b.disabled = !choose));
      const rw = el.querySelector(".rew"); rw.disabled = !(fail && S.rewinds > 0); rw.textContent = `◀◀ RIAVVOLGI (${S.rewinds})`;
      el.querySelector(".go").disabled = !fail;
      const att = isAtt(S.act), lbl = att ? (S.bv === 2 ? ["◀ TIRA A SINISTRA", "▲ TIRA CENTRALE", "TIRA A DESTRA ▶"] : ["◀ SINISTRA", "▲ CENTRO", "DESTRA ▶"]) : S.bv === 0 ? ["◀ CHIUDI SINISTRA", "▲ CHIUDI CENTRO", "CHIUDI DESTRA ▶"] : ["◀ TUFFO SINISTRA", "▲ RESTA CENTRALE", "TUFFO DESTRA ▶"];
      el.querySelectorAll(".pad button").forEach((b, i) => (b.textContent = lbl[i]));
    };
    // ------------------------------------------------------------ flusso
    function nextAction() {
      if (S.over) return;
      if (S.act + 1 >= nAct + S.extra) { if (S.a === S.b && S.extra < 2 && o.extra !== false) { S.extra += 2; } else return finish(); }
      S.act++; S.bv = 0; S.tl = 0; startSeg();
    }
    function startSeg() { // il nastro scorre fino al prossimo bivio
      S.phase = "play"; S.t = 0; const att = isAtt(S.act);
      S.anim = { from: posFor(S.act, S.bv - 1), to: posFor(S.act, S.bv), n: 50 };
      msg(`${att ? "ATTACCO" : "DIFESA"} · azione ${S.act + 1}${S.act >= nAct ? " (supplementare)" : `/${nAct}`} — il nastro scorre…`); hud();
    }
    function posFor(a, b) { const att = isAtt(a); return att ? { y: [262, 200, 130, 70][b + 1] } : { y: [24, 90, 170, 250][b + 1] }; }
    function atBivio() {
      S.phase = "bivio"; S.data.bivi++; const k = key(S.act, S.bv), seen = mem[k];
      if (seen) S.data.fantasmi++;
      const att = isAtt(S.act);
      const q = att ? (S.bv < 2 ? "Dove porti la palla?" : "Dove tiri?") : S.bv === 0 ? "Quale corsia chiudi?" : "Ti ha superato: dove ti tuffi?";
      msg(`❚❚ PAUSA · ${q}${seen ? ` <b class="gh">I fantasmi del giro precedente ti mostrano cosa hanno fatto.</b>` : ""}`); tone(220, 0.15, "square", 0.03); hud();
    }
    function choose(l) {
      if (S.phase !== "bivio" || S.over) return false;
      const a = S.act, b = S.bv, att = isAtt(a), p = plan(a, b, att), k = key(a, b);
      mem[k] = p; S.choice = l; S.log.push([a, b, l]);
      let ok;
      if (att) ok = !p.includes(l); else ok = b === 0 ? p.includes(l) : p.includes(l);
      // in difesa: al primo bivio «ok» = hai chiuso la corsia giusta (palla recuperata); al secondo = parata
      S.res = { ok, att, b, l, p, t: 60 }; S.phase = "res"; S.t = 0;
      if (att) { if (!ok) { msg(b === 2 ? "PARATA! Il portiere era lì." : "PALLA PERSA. La corsia era chiusa."); tone(150, 0.3, "sawtooth", 0.04); } else if (b === 2) { msg("<b>GOOOL!</b>"); [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.15, "triangle", 0.05), i * 90)); } else { msg("Passa! La corsia era libera."); tone(660, 0.08, "triangle"); } }
      else if (b === 0) { if (ok) { msg("RECUPERATA! Avevi chiuso la corsia giusta."); tone(660, 0.1, "triangle"); } else { msg("Ti ha superato…"); tone(200, 0.15, "sawtooth", 0.03); } }
      else { if (ok) { msg("PARATA!"); tone(700, 0.15, "triangle"); } else { msg("<b>GOL LORO.</b>"); tone(140, 0.4, "sawtooth", 0.05); } }
      hud(); return true;
    }
    function resolve() { // dopo l'animazione dell'esito
      const r = S.res, att = r.att;
      if (att) {
        if (!r.ok) return failState();
        if (r.b === 2) { S.a++; return endAction(); }
        S.bv++; return startSeg();
      }
      if (r.b === 0) { if (r.ok) return endAction(); S.bv = 1; return startSeg(); }
      if (r.ok) return endAction();
      S.b++; return failState();
    }
    function failState() { S.phase = "fail"; msg(`${S.res.att ? "Azione sfumata." : "Gol subito."} ${S.rewinds > 0 ? "<b>◀◀ Riavvolgi</b> il nastro fino al bivio, con il fantasma ormai visibile, oppure <b>Continua</b>." : "Il nastro è finito: <b>Continua</b>."}`); hud(); }
    function rewind() {
      if (S.phase !== "fail" || S.rewinds <= 0) return;
      S.rewinds--; S.data.riavvolgimenti++; if (!S.res.att && S.res.b === 1) S.b--; // il gol subito non è mai successo
      S.phase = "rew"; S.t = 0; S.tear = 40; tone(900, 0.6, "sawtooth", 0.03, 120); msg("◀◀ RIAVVOLGIMENTO…"); hud();
    }
    function endAction() { S.phase = "pausa"; S.t = 0; hud(); }
    // ------------------------------------------------------------ ciclo
    function tick() {
      S.t++; if (S.tear > 0) S.tear--;
      if (S.phase === "play") { if (S.t >= S.anim.n) atBivio(); }
      else if (S.phase === "res") { if (S.t >= 50) resolve(); }
      else if (S.phase === "rew") { if (S.t >= 45) { S.phase = "bivio"; atBivio(); } }
      else if (S.phase === "pausa") { if (S.t >= 40) nextAction(); }
    }
    // ------------------------------------------------------------ disegno (VHS)
    function token(x, y, col, ghost, lbl) {
      g.save(); if (ghost) { g.globalAlpha = 0.45 + 0.15 * Math.sin(S.t / 5); g.translate((Math.random() - 0.5) * 1.5, 0); }
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(x + 1, y + 6, 7, 3, 0, 0, 7); g.fill();
      g.fillStyle = ghost ? "#7af0ff" : col; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); g.strokeStyle = ghost ? "#c8ffff" : "#111"; g.lineWidth = 1.5; g.stroke();
      if (lbl) { g.font = "bold 6px monospace"; g.textAlign = "center"; g.fillStyle = ghost ? "#c8ffff" : "#fff"; g.fillText(lbl, x, y + 16); g.textAlign = "left"; }
      g.restore();
    }
    function draw() {
      g.setTransform(2, 0, 0, 2, 0, 0);
      const att = isAtt(Math.max(0, S.act)), k = key(S.act, S.bv), seen = S.phase === "bivio" ? mem[k] : null;
      // il campo, sbiadito come una vecchia cassetta
      g.fillStyle = "#24502e"; g.fillRect(0, 0, W, H); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.05)"; g.fillRect(0, i * (H / 8), W, H / 8); }
      g.strokeStyle = "rgba(230,240,230,.55)"; g.lineWidth = 1.5; g.strokeRect(10, 10, W - 20, H - 20); g.beginPath(); g.moveTo(10, H / 2); g.lineTo(W - 10, H / 2); g.stroke(); g.beginPath(); g.arc(W / 2, H / 2, 26, 0, 7); g.stroke();
      const gy = att ? 10 : H - 10, dir = att ? 1 : -1; g.strokeRect(W / 2 - 50, att ? 10 : H - 50, 100, 40); g.fillStyle = "rgba(255,255,255,.75)"; g.fillRect(W / 2 - 26, gy - (att ? 6 : 0), 52, 6);
      LX.forEach((x) => { g.strokeStyle = "rgba(255,255,255,.08)"; g.setLineDash([3, 5]); g.beginPath(); g.moveTo(x, 20); g.lineTo(x, H - 20); g.stroke(); g.setLineDash([]); });
      if (S.act >= 0) {
        const an = S.anim || { from: posFor(S.act, -1), to: posFor(S.act, 0), n: 1 }, kk = S.phase === "play" ? Math.min(1, S.t / an.n) : 1, cy = an.from.y + (an.to.y - an.from.y) * kk;
        const lane = S.log.length && S.log[S.log.length - 1][0] === S.act ? S.log[S.log.length - 1][2] : 1, cx = S.phase === "play" && S.bv > 0 ? LX[1] + (LX[lane] - LX[1]) * (1 - kk) * 0 + (LX[lane] - LX[1]) : LX[S.bv > 0 ? lane : 1];
        // portieri
        token(W / 2 + (S.res && S.res.att && S.res.b === 2 && S.phase === "res" ? (S.res.p[0] - 1) * 40 * Math.min(1, S.t / 15) : 0), att ? 24 : H - 24, att ? oppCol : usCol, false, att ? "P" : "TU");
        // i difensori / gli attaccanti avversari, e i FANTASMI del giro precedente
        if (att) {
          if (S.bv < 2) { const ny = posFor(S.act, S.bv).y - 34; [0, 1, 2].forEach((l) => token(LX[l], ny + (l % 2) * 6, oppCol, false, "")); if (seen) seen.forEach((l) => token(LX[l], ny + 20, oppCol, true, "IERI")); if (S.res && S.phase === "res") S.res.p.forEach((l) => { g.strokeStyle = "#ff5a5a"; g.lineWidth = 2; g.beginPath(); g.arc(LX[l], ny + 20, 11, 0, 7); g.stroke(); }); }
          else if (seen) token(W / 2 + (seen[0] - 1) * 40, 40, oppCol, true, "IERI");
          token(cx, cy, usCol, false, "TU"); token(LX[(lane + 2) % 3], cy + 26, usCol, false, mates[0].split(" ")[0]); token(LX[(lane + 1) % 3], cy + 30, usCol, false, (mates[1] || mates[0]).split(" ")[0]);
        } else {
          const ac = S.bv === 0 ? LX[1] : LX[plan(S.act, 0, false)[0]]; token(ac, cy, oppCol, false, "");
          if (seen) { if (S.bv === 0) token(LX[seen[0]], cy + 26, oppCol, true, "IERI"); else token(W / 2 + (seen[0] - 1) * 40, H - 46, oppCol, true, "IERI"); }
          if (S.bv === 0) { const my = S.log.length && S.log[S.log.length - 1][0] === S.act ? S.log[S.log.length - 1][2] : 1; token(LX[my], cy + 40, usCol, false, "TU"); }
        }
        // il pallone
        const bx = att ? cx + 6 : (S.bv === 0 ? LX[1] : LX[plan(S.act, 0, false)[0]]) + 6, by = att ? cy - 6 : cy + 6; g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, 3, 0, 7); g.fill();
      }
      // VHS: righe, sbavature di colore, codice temporale, PLAY/PAUSA
      g.fillStyle = "rgba(0,0,0,.16)"; for (let y = 0; y < H; y += 2) g.fillRect(0, y, W, 1);
      g.fillStyle = "rgba(255,0,80,.05)"; g.fillRect(1, 0, W, H); g.fillStyle = "rgba(0,200,255,.04)"; g.fillRect(-1, 0, W, H);
      const tr = S.tear || (S.phase === "rew" ? 30 : 0); if (tr) for (let i = 0; i < 6; i++) { const y = Math.random() * H, hh = 2 + Math.random() * 8; g.drawImage(cv, 0, y * 2, W * 2, hh * 2, (Math.random() - 0.5) * 24, y, W, hh); g.fillStyle = `rgba(255,255,255,${Math.random() * 0.25})`; g.fillRect(0, y, W, 1); }
      const sec = Math.floor((S.act + 1) * 517 + S.t / 2), tc = `${String(Math.floor(sec / 3600) % 24).padStart(2, "0")}:${String(Math.floor(sec / 60) % 60).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
      g.font = "bold 10px monospace"; g.fillStyle = "#fff"; g.shadowColor = "#000"; g.shadowBlur = 3;
      g.fillText(S.phase === "bivio" || S.phase === "fail" ? "❚❚ PAUSA" : S.phase === "rew" ? "◀◀ REW" : "▶ PLAY", 14, H - 16); g.fillText(tc, W - 72, H - 16);
      if (S.phase === "bivio" && Math.floor(S.t / 20) % 2 === 0) { g.fillStyle = "#7af0ff"; g.fillText(seen ? "FANTASMI: GIRO PRECEDENTE" : "BIVIO", 14, 24); }
      g.shadowBlur = 0;
      if (S.phase === "rew") { g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(0, 0, W, H); g.font = "900 26px monospace"; g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText("◀◀", W / 2, H / 2 + 8); g.textAlign = "left"; }
    }
    function loop() { if (!el.isConnected) return; if (S.phase !== "intro" && !S.over) tick(); draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ comandi
    el.querySelectorAll(".pad button").forEach((b) => b.addEventListener("pointerdown", (e) => { e.preventDefault(); choose(+b.dataset.k); }));
    el.querySelector(".rew").addEventListener("pointerdown", (e) => { e.preventDefault(); rewind(); });
    el.querySelector(".go").addEventListener("pointerdown", (e) => { e.preventDefault(); if (S.phase === "fail") endAction(); });
    el.querySelector(".quit").addEventListener("pointerdown", (e) => { e.preventDefault(); finish(true); });
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); if (S.phase !== "bivio") return; const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width; choose(x < 0.36 ? 0 : x > 0.64 ? 2 : 1); });
    const kd = (e) => { const m = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2 }[e.key]; if (m !== undefined) { choose(m); e.preventDefault(); e.stopPropagation(); } else if (e.key === "r") rewind(); else if (e.key === "Enter" && S.phase === "fail") endAction(); };
    window.addEventListener("keydown", kd, true);
    // ------------------------------------------------------------ fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data, { mem }) };
      card(quit ? "Nastro espulso" : res.win ? o.winTitle || "VITTORIA" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Bivi ${S.data.bivi} · Fantasmi visti ${S.data.fantasmi} · Riavvolgimenti ${S.data.riavvolgimenti}</p>`, "STOP ■", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd, true); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.choose = choose; S.rewind = rewind; S.mem = mem; S.plan = plan;
    const known = Object.keys(mem).length;
    card(o.title || "Il Nastro", `${o.intro || ""}<p><b>Come si gioca</b>: la partita scorre da sola, come una videocassetta. Ai <b>bivi</b> va in pausa: scegli la corsia (◀ ▲ ▶). In attacco evita le corsie chiuse e tira lontano dal portiere; in difesa chiudi la corsia giusta, poi tuffati.</p><p>Gli avversari giocano <b>sempre la stessa partita</b>. Dove sei già passato vedi i loro <b>fantasmi</b>. Dopo un errore puoi <b>◀◀ riavvolgere</b> (${S.rewinds} volte).</p><p style="opacity:.8;font-size:12px">${nAct} azioni · avversari: ${esc(style)}${known ? ` · bivi già ricordati: ${known}` : ""}</p>`, "▶ PLAY", () => { S.phase = "wait"; nextAction(); });
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("naCss")) return; const st = document.createElement("style"); st.id = "naCss";
    st.textContent = `.naOv{position:fixed;inset:0;z-index:300;background:#0c0c10;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:'Courier New',monospace;touch-action:none;user-select:none;-webkit-user-select:none;color:#e8e8e8}
.naOv .hud{width:min(100%,400px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #3a3a48;background:#16161e;padding:3px 10px;font:700 13px 'Courier New',monospace}
.naOv .hud .n0{color:var(--us)}.naOv .hud .n1{text-align:right;color:var(--opp)}.naOv .hud .sc{font:900 22px 'Courier New',monospace;letter-spacing:2px;color:#fff;text-shadow:2px 0 #ff2a6a,-2px 0 #2ad8ff}
.naOv canvas{width:min(100%,400px,calc((100vh - 260px) * .8));height:auto;aspect-ratio:4/5;flex:none;border:2px solid #3a3a48;border-radius:10px;background:#24502e;touch-action:none}
.naOv .msg{width:min(100%,400px);min-height:34px;font-size:12px;line-height:1.35;color:#c8c8d8}.naOv .msg .gh{color:#7af0ff}
.naOv .pad{width:min(100%,400px);display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.naOv .pad2{width:min(100%,400px);display:grid;grid-template-columns:1fr 1fr 64px;gap:6px}
.naOv button{min-height:46px;border:2px solid #3a3a48;border-radius:8px;background:#1e1e28;color:#e8e8e8;font:700 12px 'Courier New',monospace;cursor:pointer}.naOv button:disabled{opacity:.35}
.naOv .pad button:not(:disabled){border-color:#7af0ff;color:#fff}.naOv .rew:not(:disabled){background:#2a1a3a;border-color:#ff2a6a;color:#ffb8d0}.naOv .go:not(:disabled){border-color:#e8c84a}
.naOv .ov{position:absolute;inset:0;background:rgba(8,8,12,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
.naOv .card{max-width:420px;width:100%;border:2px solid #3a3a48;border-radius:10px;background:#16161e;padding:14px}.naOv .card h3{margin:0 0 8px;font:900 22px 'Courier New',monospace;color:#fff;text-shadow:2px 0 #ff2a6a,-2px 0 #2ad8ff}.naOv .card p{margin:6px 0;font-size:13px;line-height:1.4}.naOv .card .big{font:900 32px 'Courier New',monospace}.naOv .card button{width:100%;margin-top:10px;background:#e8c84a;color:#111;border-color:#e8c84a}`;
    document.head.appendChild(st);
  }
  window.__nastro = { start, get state() { return STATE; } };
})();
