// js/lavagna.js - «LAVAGNA TATTICA» · la partita originale di «Master League delle Colline» (motore proprio, NON il kit di partita)
// Un gestionale alla eFootball/FC, in piccolo: sei l'allenatore. Non tocchi il pallone: decidi.
//  1. LA LAVAGNA: una lavagna verde col gesso. Scegli il MODULO (calcio a 7: 3-2-1, 2-3-1, 2-2-2), metti i giocatori nelle
//     caselle (ogni ruolo ha il suo posto giusto: fuori ruolo rendono meno), scegli la MENTALITÀ e l'ISTRUZIONE.
//  2. LA PARTITA: sei blocchi da 15 minuti, disegnati col gesso: frecce, cerchi, gol. Le istruzioni si battono come
//     sasso-carta-forbice (pressing alto > possesso > contropiede > pressing alto; palla lunga contro la difesa alta).
//     All'intervallo e al 60' puoi cambiare istruzione e fare un cambio. La STAMINA cala: chi è stanco rende meno.
//  3. LE PAGELLE: ogni giocatore prende un voto, da 4 a 10. Il migliore in campo guadagna forma per la prossima partita.
// Uso: window.__lavagna.start({ title, us, usColor, squad:[{ name, role:"P"|"D"|"C"|"A", ovr, sta, form }], opp:{ name, color, style, ovr, instr },
//      formations, intro, winTitle, onDone })   →   onDone({ a, b, win, quit, data:{ voti:{name:voto}, mvp, possesso } })
(function () {
  "use strict";
  if (window.__lavagna) return;
  const W = 300, H = 330;
  const FORM = { // posizioni sulla lavagna (x 0..1 da sinistra, y 0..1 dalla nostra porta in basso) e il ruolo giusto
    "3-2-1": [["P", 0.5, 0.94], ["D", 0.2, 0.75], ["D", 0.5, 0.78], ["D", 0.8, 0.75], ["C", 0.32, 0.52], ["C", 0.68, 0.52], ["A", 0.5, 0.26]],
    "2-3-1": [["P", 0.5, 0.94], ["D", 0.3, 0.76], ["D", 0.7, 0.76], ["C", 0.18, 0.52], ["C", 0.5, 0.55], ["C", 0.82, 0.52], ["A", 0.5, 0.26]],
    "2-2-2": [["P", 0.5, 0.94], ["D", 0.3, 0.76], ["D", 0.7, 0.76], ["C", 0.3, 0.53], ["C", 0.7, 0.53], ["A", 0.32, 0.28], ["A", 0.68, 0.28]],
  };
  const INSTR = { pressing: ["Pressing alto", "Rubate palla in avanti: forte contro chi costruisce, debole contro i lanci"], possesso: ["Possesso", "Palla a terra, pazienza: forte contro chi aspetta, debole contro il pressing"], contropiede: ["Contropiede", "Difesa bassa e ripartenze: forte contro il pressing, debole contro il possesso"], lunga: ["Palla lunga", "Lanci per la punta: forte contro il pressing alto, debole contro le difese basse"] };
  const BEATS = { pressing: "possesso", possesso: "contropiede", contropiede: "pressing", lunga: "pressing" };
  const MENT = { difensiva: [-0.12, 0.14], equilibrata: [0, 0], offensiva: [0.14, -0.12] }; // [attacco, difesa]
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  let STATE = null;
  function start(o) {
    if (document.querySelector(".lvOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 };
    const usCol = o.usColor || "#2a6a3a", opp = Object.assign({ name: "Avversari", color: "#a83a2a", style: "equilibrata", ovr: 60, instr: "possesso" }, o.opp || {});
    const oppK = DF.opp > 1.05 ? 1.08 : DF.opp < 0.95 ? 0.9 : 1;
    const squad = (o.squad || []).map((p, i) => Object.assign({ role: "C", ovr: 60, sta: 100, form: 0 }, p, { i, sta0: p.sta == null ? 100 : p.sta, voto: 6, on: false }));
    const forms = (o.formations || Object.keys(FORM)).filter((k) => FORM[k]);
    const S = { o, a: 0, b: 0, phase: "board", form: forms[0], slots: [], ment: "equilibrata", instr: "possesso", seg: 0, nSeg: 6, subs: 0, maxSubs: 2, sel: null, events: [], anim: null, t: 0, over: false, poss: [0, 0], data: {} };
    STATE = S;
    // formazione iniziale automatica: il migliore per ruolo in ogni casella
    function autoFill() { const used = new Set(); S.slots = FORM[S.form].map(([role]) => { const c = squad.filter((p) => !used.has(p.i)).sort((x, y) => (y.role === role) - (x.role === role) || y.ovr - x.ovr)[0]; if (c) used.add(c.i); return c ? c.i : null; }); }
    autoFill();
    css();
    const el = document.createElement("div"); el.className = "lvOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="pad"></div><div class="bench"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v) { try { const A = (window.__lvAC = window.__lvAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; gn.gain.value = v || 0.04; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const pad = (btns) => { const p = el.querySelector(".pad"); p.innerHTML = ""; btns.forEach((b) => { const x = document.createElement("button"); x.type = "button"; x.innerHTML = b.l; if (b.cls) x.className = b.cls; x.disabled = !!b.dis; x.addEventListener("pointerdown", (e) => { e.preventDefault(); if (!x.disabled) b.fn(); }); p.appendChild(x); }); };
    const hud = () => { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; };
    const pl = (i) => squad[i];
    const fit = (p, role) => (!p ? 0 : p.role === role ? 1 : (p.role === "C" && role !== "P") || (role === "C" && p.role !== "P") ? 0.82 : 0.6);
    const eff = (p, role) => (!p ? 25 : p.ovr * fit(p, role) * (0.55 + 0.45 * p.sta / 100) + p.form * 2);
    // forza dei reparti: difesa (P + D), centrocampo (C), attacco (A)
    function lines() {
      const L = { dif: 0, cen: 0, att: 0 }, n = { dif: 0, cen: 0, att: 0 };
      FORM[S.form].forEach(([role], k) => { const p = pl(S.slots[k]), v = eff(p, role), z = role === "P" || role === "D" ? "dif" : role === "C" ? "cen" : "att"; L[z] += v; n[z]++; });
      Object.keys(L).forEach((z) => { L[z] = n[z] ? L[z] / n[z] : 30; });
      const m = MENT[S.ment]; L.att *= 1 + m[0]; L.dif *= 1 + m[1]; return L;
    }
    // ------------------------------------------------------------ la lavagna
    function bench() {
      const b = el.querySelector(".bench"); const inSlot = new Set(S.slots);
      b.innerHTML = `<div class="bt">${S.phase === "board" ? "Tocca un giocatore, poi la casella in lavagna" : "Panchina · cambi rimasti: " + (S.maxSubs - S.subs)}</div>` + squad.map((p) => `<button type="button" data-p="${p.i}" class="${inSlot.has(p.i) ? "on" : ""}${S.sel === p.i ? " sel" : ""}"><b>${esc(p.role)}</b> ${esc(p.name)} <i>${Math.round(p.ovr)}</i><span style="--s:${Math.round(p.sta)}%"></span></button>`).join("");
      b.querySelectorAll("[data-p]").forEach((x) => x.addEventListener("pointerdown", (e) => { e.preventDefault(); const i = +x.dataset.p; S.sel = S.sel === i ? null : i; bench(); }));
    }
    function board() {
      S.phase = "board"; const L = lines();
      msg(`<b>LA LAVAGNA.</b> Modulo <b>${S.form}</b> · mentalità <b>${S.ment}</b> · istruzione <b>${INSTR[S.instr][0]}</b>.<br>Difesa ${Math.round(L.dif)} · centrocampo ${Math.round(L.cen)} · attacco ${Math.round(L.att)}. ${esc(opp.name)}: «${esc(INSTR[opp.instr] ? INSTR[opp.instr][0] : opp.instr)}»${o.scout ? "" : " (dicono)"}.`);
      pad([
        { l: `📋 Modulo<small>${S.form}</small>`, fn: () => { S.form = forms[(forms.indexOf(S.form) + 1) % forms.length]; autoFill(); board(); } },
        { l: `🧭 Mentalità<small>${S.ment}</small>`, fn: () => { const k = Object.keys(MENT); S.ment = k[(k.indexOf(S.ment) + 1) % k.length]; board(); } },
        { l: `✏️ Istruzione<small>${INSTR[S.instr][0]}</small>`, fn: () => { const k = Object.keys(INSTR); S.instr = k[(k.indexOf(S.instr) + 1) % k.length]; board(); } },
        { l: "▶ Calcio d'inizio<small>Si gioca</small>", cls: "go", fn: kickoff },
      ]);
      bench();
    }
    function slotAt(x, y) { let best = -1, bd = 1e9; FORM[S.form].forEach(([, fx, fy], k) => { const d = Math.hypot(fx * W - x, fy * H - y); if (d < bd) { bd = d; best = k; } }); return bd < 36 ? best : -1; }
    cv.addEventListener("pointerdown", (e) => {
      const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H, k = slotAt(x, y);
      if (k < 0 || S.sel == null) return; place(S.sel, k);
    });
    function place(i, k) { // mette il giocatore i nella casella k (scambio se era già in campo)
      const prev = S.slots.indexOf(i); if (S.phase === "field" && prev < 0) { if (S.subs >= S.maxSubs) return; S.subs++; const out = pl(S.slots[k]); if (out) out.subbed = true; }
      if (prev >= 0) S.slots[prev] = S.slots[k]; S.slots[k] = i; S.sel = null; tone(520, 0.1, "triangle", 0.03); if (S.phase === "board") board(); else pause(); bench();
    }
    // ------------------------------------------------------------ la partita: sei blocchi da 15 minuti
    function kickoff() { S.phase = "field"; squad.forEach((p) => { p.on = S.slots.includes(p.i); }); nextSeg(); }
    function nextSeg() {
      if (S.over) return; if (S.seg >= S.nSeg) return finish();
      S.phase = "field"; const L = lines(), oL = { dif: opp.ovr * oppK * (opp.style === "difensiva" ? 1.1 : 1), cen: opp.ovr * oppK, att: opp.ovr * oppK * (opp.style === "pressing" ? 1.08 : 1) };
      const edge = BEATS[S.instr] === opp.instr ? 0.16 : BEATS[opp.instr] === S.instr ? -0.16 : 0;
      const possUs = clamp(0.5 + (L.cen - oL.cen) / 120 + edge * 0.5 + (S.instr === "possesso" ? 0.08 : S.instr === "contropiede" ? -0.08 : 0), 0.2, 0.8);
      S.poss[0] += possUs; S.poss[1] += 1 - possUs;
      const ev = [], chances = 2 + (R() < 0.5 ? 1 : 0);
      for (let c = 0; c < chances; c++) {
        const ours = R() < possUs, atk = ours ? L.att * (1 + edge) : oL.att * (1 - edge), def = ours ? oL.dif : L.dif, p = clamp(0.13 + (atk - def) / 110, 0.04, 0.42), goal = R() < p;
        const lane = Math.floor(R() * 3); ev.push({ ours, goal, lane, min: S.seg * 15 + 2 + c * 5 + Math.floor(R() * 4) });
        if (goal) { if (ours) S.a++; else S.b++; }
      }
      // stamina e voti
      FORM[S.form].forEach(([role], k) => { const p = pl(S.slots[k]); if (!p) return; p.sta = clamp(p.sta - (S.instr === "pressing" ? 9 : 6) - (role === "P" ? -4 : 0), 0, 100); p.voto = clamp(p.voto + (R() - 0.45) * 0.6 + ev.filter((e) => e.goal && e.ours).length * (role === "A" ? 0.6 : 0.25) - ev.filter((e) => e.goal && !e.ours).length * (role === "D" || role === "P" ? 0.4 : 0.15), 4, 10); });
      S.events = ev; S.seg++; S.anim = { t: 0, dur: 50 * ev.length + 20, ev };
      ev.forEach((e, i) => setTimeout(() => { if (!S.over && e.goal) tone(e.ours ? 700 : 200, 0.3, e.ours ? "triangle" : "square", 0.05); }, i * 800));
      hud();
      msg(`<b>${S.seg * 15}'</b> · ${ev.map((e) => `${e.min}' ${e.goal ? `<b>GOL ${e.ours ? "nostro" : "loro"}!</b>` : e.ours ? "occasione nostra" : "occasione loro"}`).join(" · ")}<br>Possesso nel blocco: ${Math.round(possUs * 100)}%.${edge > 0 ? " La tua istruzione batte la loro." : edge < 0 ? " La loro istruzione batte la tua." : ""}`);
      pad([{ l: "Avanti ▸", cls: "go", fn: () => (S.seg === 3 || S.seg === 4 ? pause() : nextSeg()) }]);
      bench();
    }
    function pause() { // all'intervallo e al 60': si cambiano istruzione e giocatori
      S.phase = "pause";
      msg(`<b>${S.seg === 3 ? "INTERVALLO" : "SESSANTESIMO"}.</b> Puoi cambiare istruzione e mentalità, e fare un cambio: tocca un giocatore in panchina, poi la casella. Stamina dei tuoi: ${S.slots.map((i) => (pl(i) ? Math.round(pl(i).sta) : 0)).join(" · ")}.`);
      pad([
        { l: `🧭 Mentalità<small>${S.ment}</small>`, fn: () => { const k = Object.keys(MENT); S.ment = k[(k.indexOf(S.ment) + 1) % k.length]; pause(); } },
        { l: `✏️ Istruzione<small>${INSTR[S.instr][0]}</small>`, fn: () => { const k = Object.keys(INSTR); S.instr = k[(k.indexOf(S.instr) + 1) % k.length]; pause(); } },
        { l: "▶ Si riprende", cls: "go", fn: nextSeg },
      ]);
      bench();
    }
    // ------------------------------------------------------------ disegno: la lavagna col gesso
    function chalk(x1, y1, x2, y2, col, w) { g.strokeStyle = col; g.lineWidth = w || 2; g.lineCap = "round"; g.beginPath(); const n = 8; for (let i = 0; i <= n; i++) { const t = i / n, x = x1 + (x2 - x1) * t + Math.sin(i * 3.1 + x1) * 0.8, y = y1 + (y2 - y1) * t + Math.cos(i * 2.7 + y1) * 0.8; if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke(); }
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0);
      g.fillStyle = "#1e3a2a"; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(255,255,255,.035)"; for (let i = 0; i < 60; i++) g.fillRect((i * 53) % W, (i * 37) % H, 30, 1);
      const ch = "rgba(240,240,230,.75)"; chalk(14, 14, W - 14, 14, ch); chalk(W - 14, 14, W - 14, H - 14, ch); chalk(W - 14, H - 14, 14, H - 14, ch); chalk(14, H - 14, 14, 14, ch); chalk(14, H / 2, W - 14, H / 2, ch);
      g.strokeStyle = ch; g.lineWidth = 2; g.beginPath(); g.arc(W / 2, H / 2, 32, 0, 7); g.stroke(); g.strokeRect(W / 2 - 60, 14, 120, 44); g.strokeRect(W / 2 - 60, H - 58, 120, 44);
      // gli avversari: cerchi rossi col gesso
      const oppPos = [[0.5, 0.06], [0.3, 0.24], [0.7, 0.24], [0.3, 0.46], [0.7, 0.46], [0.5, 0.66], [0.2, 0.62]];
      oppPos.forEach(([x, y], k) => { g.strokeStyle = opp.color; g.lineWidth = 2; g.beginPath(); g.arc(x * W, y * H + Math.sin(S.t / 30 + k) * (S.phase === "field" ? 2 : 0), 8, 0, 7); g.stroke(); });
      // i nostri: dischi con numero, nome e barra della stamina
      FORM[S.form].forEach(([role, x, y], k) => {
        const p = pl(S.slots[k]), X = x * W, Y = y * H, good = p && p.role === role;
        g.fillStyle = p ? usCol : "rgba(255,255,255,.15)"; g.beginPath(); g.arc(X, Y, 11, 0, 7); g.fill(); g.strokeStyle = good ? "#f4f0e4" : "#ffb84a"; g.lineWidth = 2; g.stroke();
        g.fillStyle = "#fff"; g.font = "bold 8px system-ui"; g.textAlign = "center"; g.fillText(role, X, Y + 3); if (p) { g.font = "8px system-ui"; g.fillStyle = "#f4f0e4"; g.fillText(String(p.name).split(" ")[0].slice(0, 9), X, Y + 21); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(X - 10, Y + 24, 20, 2.5); g.fillStyle = p.sta > 50 ? "#7ad87a" : p.sta > 25 ? "#ffd23f" : "#ff6a5a"; g.fillRect(X - 10, Y + 24, 20 * p.sta / 100, 2.5); }
        if (S.sel != null && S.phase !== "field") { g.strokeStyle = "rgba(255,210,63,.5)"; g.setLineDash([3, 3]); g.beginPath(); g.arc(X, Y, 15, 0, 7); g.stroke(); g.setLineDash([]); }
      });
      g.textAlign = "left";
      // le azioni del blocco: frecce di gesso, e GOL scritto grande
      if (S.anim) {
        S.anim.t++; S.anim.ev.forEach((e, i) => {
          const t = clamp((S.anim.t - i * 50) / 40, 0, 1); if (t <= 0) return;
          const lx = [0.22, 0.5, 0.78][e.lane] * W, y0 = e.ours ? H * 0.7 : H * 0.3, y1 = e.ours ? 22 : H - 22, yy = y0 + (y1 - y0) * t;
          chalk(lx, y0, lx + (e.lane - 1) * 10 * t, yy, e.ours ? "#ffe8a0" : "#ff9a8a", 2.5);
          if (t >= 1) { g.save(); g.translate(lx, yy + (e.ours ? 14 : -10)); g.fillStyle = e.goal ? (e.ours ? "#ffd23f" : "#ff6a5a") : "rgba(240,240,230,.7)"; g.font = e.goal ? "900 16px 'Comic Sans MS', system-ui" : "bold 9px system-ui"; g.textAlign = "center"; g.fillText(e.goal ? "GOL!" : e.ours ? "fuori" : "parata", 0, 0); g.restore(); }
        });
      }
      g.fillStyle = "rgba(240,240,230,.85)"; g.font = "bold 10px 'Comic Sans MS', system-ui"; g.fillText(S.phase === "board" ? "LAVAGNA" : `${Math.min(90, S.seg * 15)}'`, 20, H - 20);
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ fine: le pagelle
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const played = squad.filter((p) => p.on || S.slots.includes(p.i)), voti = {}; played.forEach((p) => { p.voto = clamp(Math.round((p.voto + (S.a > S.b ? 0.4 : S.a < S.b ? -0.4 : 0)) * 2) / 2, 4, 10); voti[p.name] = p.voto; });
      const mvp = played.slice().sort((x, y) => y.voto - x.voto)[0], tp = S.poss[0] + S.poss[1] || 1;
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: { voti, mvp: mvp ? mvp.name : "", possesso: Math.round(S.poss[0] / tp * 100), stamina: Object.fromEntries(squad.map((p) => [p.name, Math.round(p.sta)])) } };
      card(quit ? "Partita sospesa" : res.win ? o.winTitle || "VITTORIA" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Possesso ${res.data.possesso}% · migliore in campo: <b>${esc(res.data.mvp)}</b></p><div class="votes">${played.map((p) => `<span><b>${esc(p.name)}</b> ${p.voto}</span>`).join("")}</div>`, "Spogliatoio ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); try { (o.onDone || (() => {}))(res); } catch (e) { console.error(e); } });
    }
    S.finish = finish; S.kickoff = kickoff; S.next = nextSeg; S.place = place; S.setInstr = (k) => { if (INSTR[k]) S.instr = k; }; S.setForm = (k) => { if (FORM[k]) { S.form = k; autoFill(); } }; S.lines = lines;
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Lavagna Tattica", `${o.intro || ""}<p>Sei l'<b>allenatore</b>: non tocchi il pallone, decidi. Sulla <b>lavagna</b> scegli il modulo e metti i giocatori nelle caselle (fuori ruolo rendono meno), poi mentalità e istruzione.</p><p>Le istruzioni si battono a vicenda: <b>pressing</b> batte possesso, <b>possesso</b> batte contropiede, <b>contropiede</b> batte pressing, la <b>palla lunga</b> punisce il pressing alto. All'intervallo e al 60' puoi cambiare tutto e fare un cambio. Occhio alla stamina.</p>`, "Alla lavagna ▸", board);
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("lvCss")) return; const st = document.createElement("style"); st.id = "lvCss";
    st.textContent = `.lvOv{position:fixed;inset:0;z-index:300;background:#2a1e14;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:manipulation;user-select:none;-webkit-user-select:none;color:#f4f0e4;overflow:auto}
.lvOv .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #8a6a3a;border-radius:6px;background:#1a120a;padding:4px 10px;font:800 12px system-ui}
.lvOv .hud .n0{color:var(--us);filter:brightness(1.8)}.lvOv .hud .n1{text-align:right;color:var(--opp);filter:brightness(1.6)}.lvOv .hud .sc{font:900 22px 'Comic Sans MS',system-ui;color:#ffd23f}
.lvOv canvas{width:min(100%,360px,calc((100vh - 330px) * .9));height:auto;aspect-ratio:300/330;flex:none;border:6px solid #8a5a2a;border-radius:4px;box-shadow:0 4px 0 #5a3a1a}
.lvOv .msg,.lvOv .pad,.lvOv .bench,.lvOv .hud{flex:none}.lvOv .msg{width:min(100%,420px);min-height:34px;font-size:12.5px;line-height:1.4}.lvOv .msg b{color:#ffd23f}
.lvOv .pad{width:min(100%,420px);display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:6px}
.lvOv button{min-height:44px;border-radius:6px;border:1.5px solid #8a6a3a;background:#3a2a1a;color:#f4f0e4;font:700 12.5px system-ui;cursor:pointer;padding:5px}.lvOv button small{display:block;font:400 10.5px system-ui;opacity:.8;margin-top:2px}.lvOv button.go{background:#ffd23f;color:#111}
.lvOv .bench{width:min(100%,420px);display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:4px}.lvOv .bench .bt{grid-column:1/-1;font-size:11px;opacity:.8}
.lvOv .bench button{min-height:34px;text-align:left;font-weight:500;font-size:11.5px;position:relative;padding:4px 6px 7px}.lvOv .bench button i{float:right;font-style:normal;color:#ffd23f}.lvOv .bench button.on{border-color:#7ad87a}.lvOv .bench button.sel{background:#ffd23f;color:#111}
.lvOv .bench button span{position:absolute;left:6px;right:6px;bottom:3px;height:2px;background:linear-gradient(90deg,#7ad87a var(--s),rgba(0,0,0,.4) var(--s))}
.lvOv .quit{position:fixed;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px;z-index:3}
.lvOv .ov{position:fixed;inset:0;background:rgba(20,14,8,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:4}
.lvOv .card{max-width:420px;width:100%;border:3px solid #8a5a2a;border-radius:6px;background:#1e3a2a;color:#f4f0e4;padding:14px;font-family:'Comic Sans MS',system-ui}.lvOv .card h3{margin:0 0 8px;font:900 24px 'Comic Sans MS',system-ui;color:#ffd23f}.lvOv .card p{margin:6px 0;font-size:14px;line-height:1.45}.lvOv .card .big{font:900 34px 'Comic Sans MS',system-ui}
.lvOv .votes{display:grid;grid-template-columns:1fr 1fr;gap:3px;font-size:12.5px}.lvOv .votes b{font-weight:600}.lvOv .card button{width:100%;margin-top:10px;background:#ffd23f;color:#111}`;
    document.head.appendChild(st);
  }
  window.__lavagna = { start, FORM, INSTR, get state() { return STATE; } };
})();
