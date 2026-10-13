// js/combo.js - «COMBO DI SQUADRA» · la partita originale di «Gli Straordinari di Quartiere» (motore proprio, NON il kit di partita)
// La squadra è fatta di quattro eroi, ognuno con un potere (ghiaccio, vento, elastico, calamita, fuoco, scatto).
// A ogni turno scegli UNO o DUE eroi: da soli fanno una mossa semplice, in coppia i poteri si COMBINANO (ghiaccio + vento =
// Bufera, elastico + calamita = Fionda…). Le combo si SCOPRONO giocando: finché non le provi, sono «???».
// Chi agisce resta STANCO per il turno dopo: bisogna far girare la squadra. L'avversario mostra in anticipo la sua mossa
// (pressing, muro, trappola, avanza, sfonda, tiro) e alcune combo la battono.
// Il campo è una striscia di sette zone, dalla vostra porta alla loro: si avanza, si tira dalla quinta in poi.
// Uso: window.__combo.start({ title, us, usColor, heroes:[{ id, name, power, skin, hair }], opp:{ name, color, players:[{ name }], keeper:{ name } },
//   known:[idCombo…], minutes, oppStyle, intro, winTitle, onDone })   → r.data.nuove = combo scoperte in questa partita
(function () {
  "use strict";
  if (window.__combo) return;
  const W = 320, H = 170, Z = 7;
  const POW = { ghiaccio: ["❄️", "#7ad8ff"], vento: ["🌀", "#c8f0e0"], elastico: ["🪢", "#ff8ac8"], calamita: ["🧲", "#c83a3a"], fuoco: ["🔥", "#ff8a3a"], scatto: ["⚡", "#ffd23f"] };
  // le combo: chiave = due poteri in ordine alfabetico. a = avanzamento, sp = ignora pressing, sm = ignora muro, shot = tiro (forza, zona minima, ignora trappola),
  // steal = recupero in difesa, frz = congela l'avversario per n turni
  const COMBO = {
    "scatto+vento": { id: "raffica", n: "Raffica", a: 2, sp: 1, steal: 0.5 },
    "calamita+elastico": { id: "fionda", n: "Fionda", a: 3, sm: 1, steal: 0.4 },
    "fuoco+vento": { id: "tornado", n: "Tornado di fuoco", shot: [0.72, 3, 1], steal: 0.35 },
    "ghiaccio+vento": { id: "bufera", n: "Bufera", a: 1, frz: 2, steal: 1 },
    "fuoco+ghiaccio": { id: "vapore", n: "Vapore", a: 1, sp: 1, steal: 0.85 },
    "calamita+scatto": { id: "calamita", n: "Colpo di calamita", a: 1, steal: 0.8 },
    "elastico+scatto": { id: "molla", n: "Molla", a: 2, sp: 1, steal: 0.4 },
    "fuoco+scatto": { id: "sgasata", n: "Sgasata", a: 2, steal: 0.45 },
    "elastico+ghiaccio": { id: "scivolo", n: "Scivolo di ghiaccio", a: 2, sm: 1, steal: 0.5 },
    "calamita+fuoco": { id: "rovente", n: "Pallone rovente", shot: [0.6, 2, 0], steal: 0.4 },
    "calamita+vento": { id: "turbine", n: "Turbine magnetico", a: 1, frz: 1, steal: 0.7 },
    "calamita+ghiaccio": { id: "ferro", n: "Ferro ghiacciato", a: 1, steal: 0.75 },
    "elastico+vento": { id: "aquilone", n: "Aquilone", a: 2, sm: 1, steal: 0.45 },
    "elastico+fuoco": { id: "frusta", n: "Frusta di fuoco", shot: [0.55, 3, 1], steal: 0.4 },
    "ghiaccio+scatto": { id: "pattinata", n: "Pattinata", a: 2, steal: 0.5 },
  };
  const ATT = { pressing: ["🫸", "Pressing", "chi agisce da solo perde palla una volta su due"], muro: ["🧱", "Muro", "non si avanza di più di una zona (se la combo non lo scavalca)"], trappola: ["🪤", "Trappola", "il tiro semplice non passa; servono tiri di fuoco"] };
  const DEF = { avanza: ["➡️", "Avanza", "avanzano di una zona"], sfonda: ["💨", "Sfonda", "avanzano di due zone"], tiro: ["🎯", "Tiro", "tirano in porta"] };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, key = (a, b) => [a, b].sort().join("+");
  let STATE = null;
  function start(o) {
    if (document.querySelector(".cbOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppK = DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.82 : 1;
    const heroes = (o.heroes || []).filter((h) => POW[h.power]).slice(0, 4); while (heroes.length < 2) heroes.push({ id: "x" + heroes.length, name: "Rinforzo", power: ["scatto", "vento"][heroes.length] });
    const opp = Object.assign({ name: "Avversari", color: "#5a5a6a", players: [], keeper: { name: "Il portiere" } }, o.opp || {});
    const usCol = o.usColor || "#3a8ac8";
    const S = { o, a: 0, b: 0, min: 0, nMin: o.minutes || 90, phase: "intro", over: false, t: 0, z: 3, own: true, sel: [], tired: [], intent: null, frz: 0, known: new Set(o.known || []), nuove: [], fx: null,
      data: { turni: 0, combo: 0, recuperi: 0, tiri: 0, nuove: [] } };
    STATE = S;
    css();
    const el = document.createElement("div"); el.className = "cbOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="clock"></i><span class="intent"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="msg"></div><div class="team"></div><div class="pad"></div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d");
    function tone(f, d, type, v, slide) { try { const A = (window.__cbAC = window.__cbAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const msg = (h) => { el.querySelector(".msg").innerHTML = h; };
    const fx = (text, pw, col) => { S.fx = { text, pw: pw || [], col: col || "#ffd23f", t: 0 }; };
    const hud = () => {
      el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".clock").textContent = `${Math.min(S.nMin, Math.round(S.min))}'`;
      const I = S.intent && (S.own ? ATT : DEF)[S.intent];
      el.querySelector(".intent").innerHTML = S.frz > 0 ? `❄️ <b>${esc(opp.name)} congelati</b> (${S.frz})` : I ? `${I[0]} Loro: <b>${I[1]}</b> <small>${I[2]}</small>` : "";
    };
    // ------------------------------------------------------------ l'avversario annuncia la sua mossa
    function newIntent() {
      if (S.frz > 0) { S.intent = null; return; }
      if (S.own) { const w = style === "pressing" ? [5, 2, 2] : style === "difensiva" ? [2, 5, 3] : [3, 3, 3]; S.intent = pickW(["pressing", "muro", "trappola"], w); if (S.intent === "trappola" && S.z < 4) S.intent = "muro"; }
      else S.intent = S.z <= 2 ? "tiro" : style === "contropiede" ? (R() < 0.6 ? "sfonda" : "avanza") : R() < 0.35 * oppK ? "sfonda" : "avanza";
    }
    function pickW(arr, w) { let r = R() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; } return arr[0]; }
    function kickoff(weOwn) { S.z = 3; S.own = weOwn; S.tired = []; S.sel = []; S.frz = 0; newIntent(); turnUi(); }
    // ------------------------------------------------------------ la tua mossa
    const comboOf = (sel) => (sel.length === 2 ? COMBO[key(heroes[sel[0]].power, heroes[sel[1]].power)] : null);
    function act() {
      if (S.phase !== "turn" || !S.sel.length || S.over) return false;
      const sel = S.sel.slice(), cb = comboOf(sel), pw = sel.map((i) => heroes[i].power); S.data.turni++; S.min += 4; S.tired = sel; S.sel = [];
      if (cb) { S.data.combo++; if (!S.known.has(cb.id)) { S.known.add(cb.id); S.nuove.push(cb.id); S.data.nuove.push(cb.id); } tone(520, 0.3, "triangle", 0.06, 1040); }
      const I = S.frz > 0 ? null : S.intent; let text = "";
      if (S.own) {
        if (cb && cb.shot && S.z >= cb.shot[1]) return shoot(cb.shot[0] + (S.z - cb.shot[1]) * 0.06, cb.shot[2] || I !== "trappola", cb.n, pw);
        if (!cb && sel.length === 1 && S.z >= 4 && S.wantShot) return shoot(0.42 + (S.z - 4) * 0.08, I !== "trappola", "Tiro", pw);
        if (I === "pressing" && !(cb && cb.sp) && (sel.length === 1 ? R() < 0.5 - 0.06 * ((o.bonus || {}).te | 0) : R() < 0.2 - 0.04 * ((o.bonus || {}).te | 0))) { S.own = false; fx("PALLA PERSA", pw, "#ff8a7a"); tone(180, 0.3, "square", 0.04); return after(`<b>Pressing!</b> ${sel.length === 1 ? "Da solo" : "La combo è lenta"}: ${esc(opp.players[0] ? opp.players[0].name : "un avversario")} ti ruba palla.`); }
        let adv = cb ? cb.a || 1 : 1; if (I === "muro" && !(cb && cb.sm)) adv = Math.min(1, adv);
        S.z = Math.min(Z - 1, S.z + adv); if (cb && cb.frz) S.frz = cb.frz;
        fx(cb ? cb.n.toUpperCase() + "!" : "PASSAGGIO", pw); text = cb ? `<b>${esc(cb.n)}!</b> Avanzate di ${adv} ${adv === 1 ? "zona" : "zone"}${cb.frz ? `, e ${esc(opp.name)} restano congelati` : ""}.` : `Passaggio: avanzate di una zona.`;
      } else {
        const p = ((cb ? cb.steal * 0.72 : 0.3) + 0.04 * ((o.bonus || {}).df | 0)) / oppK;
        if (R() < p) { S.own = true; S.data.recuperi++; if (cb && cb.frz) S.frz = cb.frz; fx(cb ? cb.n.toUpperCase() + "!" : "CONTRASTO!", pw, "#7ad87a"); tone(640, 0.2, "triangle", 0.05); return after(`<b>${cb ? esc(cb.n) : "Contrasto"}!</b> Palla vostra in zona ${S.z + 1}.`); }
        fx(cb ? cb.n : "MANCATO", pw, "#ff8a7a"); text = `${cb ? `<b>${esc(cb.n)}</b>, ma` : "Contrasto a vuoto:"} non basta.`;
      }
      return opponentMove(text);
    }
    function shoot(p, ok, name, pw) {
      S.data.tiri++; const goal = ok && R() < Math.min(0.92, (p + 0.04 * ((o.bonus || {}).at | 0)) / oppK);
      if (goal) { S.a++; fx("GOOOL!", pw, "#ffd23f"); tone(660, 0.5, "triangle", 0.06, 1320); S.phase = "wait"; hud(); msg(`<b>GOL!</b> ${esc(name)} dalla zona ${S.z + 1}: ${esc(opp.keeper.name)} non ci arriva.`); return padNext(() => kickoff(false)); }
      S.own = false; S.z = Math.max(3, S.z - 1); fx(ok ? "PARATA!" : "TRAPPOLA!", pw, "#ff8a7a"); tone(200, 0.4, "square", 0.05);
      return after(ok ? `<b>Parata!</b> ${esc(opp.keeper.name)} blocca ${esc(name)}.` : `<b>Trappola!</b> Il tiro semplice finisce contro il muro di gambe. Serve un tiro di fuoco.`);
    }
    // la loro mossa, dopo la tua
    function opponentMove(prev) {
      let t = prev;
      if (S.frz > 0) { S.frz--; t += ` ${esc(opp.name)} sono ancora congelati.`; return after(t, true); }
      if (!S.own) {
        const I = S.intent;
        if (I === "tiro" || S.z <= 1) { const goal = R() < 0.45 * oppK * (DF.shot || 1) * (1 - 0.06 * ((o.bonus || {}).df | 0)); if (goal) { S.b++; fx("GOL…", [], "#ff6a5a"); tone(140, 0.5, "sawtooth", 0.05); S.phase = "wait"; hud(); msg(`${t} <b>Gol di ${esc(opp.name)}.</b>`); return padNext(() => kickoff(true)); } S.own = true; S.z = 2; t += " Tirano… <b>parata!</b> Palla vostra."; return after(t, true); }
        S.z = Math.max(0, S.z - (I === "sfonda" ? 2 : 1)); t += ` ${esc(opp.name)} ${I === "sfonda" ? "sfondano di due zone" : "avanzano"}.`;
      }
      return after(t, true);
    }
    function after(t) { S.phase = "turn"; if (S.min >= S.nMin) { msg(t); return finish(); } newIntent(); hud(); turnUi(t); return true; }
    function padNext(fn) { S.phase = "wait"; const p = el.querySelector(".pad"); p.innerHTML = ""; const b = document.createElement("button"); b.type = "button"; b.className = "go"; b.textContent = "Avanti ▸"; b.addEventListener("pointerdown", (e) => { e.preventDefault(); fn(); }); p.appendChild(b); el.querySelector(".team").querySelectorAll("button").forEach((x) => (x.disabled = true)); return true; }
    // ------------------------------------------------------------ comandi
    function turnUi(prev) {
      if (S.over) return; S.phase = "turn"; S.wantShot = false; if (heroes.every((h, i) => S.tired.includes(i))) S.tired = []; hud();
      const cb = comboOf(S.sel), canShot = S.own && S.sel.length === 1 && S.z >= 4;
      msg(`${prev ? prev + "<br>" : ""}${Math.round(S.min)}' · ${S.own ? `Palla vostra, zona <b>${S.z + 1}</b> di 7.` : `Palla a ${esc(opp.name)}, zona <b>${S.z + 1}</b>: fermateli!`} Scegli uno o due eroi.`);
      const tm = el.querySelector(".team"); tm.innerHTML = "";
      heroes.forEach((h, i) => { const b = document.createElement("button"); b.type = "button"; b.className = (S.sel.includes(i) ? "on " : "") + (S.tired.includes(i) ? "tired" : ""); b.disabled = S.tired.includes(i); b.innerHTML = `<span class="p" style="--c:${POW[h.power][1]}">${POW[h.power][0]}</span><b>${esc(h.name.split(" ")[0])}</b><small>${S.tired.includes(i) ? "stanco" : h.power}</small>`; b.addEventListener("pointerdown", (e) => { e.preventDefault(); toggle(i); }); tm.appendChild(b); });
      const p = el.querySelector(".pad"); p.innerHTML = "";
      const lbl = !S.sel.length ? "Scegli gli eroi" : cb ? (S.known.has(cb.id) ? `✨ ${cb.n}` : "✨ Combo ???") : S.sel.length === 2 ? "Insieme" : S.own ? "➜ Passaggio" : "⚔️ Contrasto";
      const go = document.createElement("button"); go.type = "button"; go.className = "go"; go.disabled = !S.sel.length; go.innerHTML = `${lbl}<small>${cb && S.known.has(cb.id) ? comboTxt(cb) : cb ? "una combinazione da scoprire" : ""}</small>`; go.addEventListener("pointerdown", (e) => { e.preventDefault(); act(); }); p.appendChild(go);
      if (canShot) { const sh = document.createElement("button"); sh.type = "button"; sh.className = "hot"; sh.innerHTML = `🎯 Tiro<small>${S.intent === "trappola" ? "c'è la trappola!" : "dalla zona " + (S.z + 1)}</small>`; sh.addEventListener("pointerdown", (e) => { e.preventDefault(); S.wantShot = true; act(); }); p.appendChild(sh); }
    }
    function comboTxt(cb) { return cb.shot ? `tiro dalla zona ${cb.shot[1] + 1}${cb.shot[2] ? ", batte la trappola" : ""}` : `avanza ${cb.a}${cb.sp ? ", batte il pressing" : ""}${cb.sm ? ", scavalca il muro" : ""}${cb.frz ? ", congela" : ""} · recupero ${Math.round(cb.steal * 72)}%`; }
    function toggle(i) { if (S.phase !== "turn" || S.tired.includes(i)) return; if (S.sel.includes(i)) S.sel = S.sel.filter((x) => x !== i); else if (S.sel.length < 2) S.sel.push(i); else S.sel = [S.sel[1], i]; turnUi(); }
    // ------------------------------------------------------------ disegno: il campetto di quartiere, gli effetti dei poteri
    function draw() {
      S.t++; g.setTransform(2, 0, 0, 2, 0, 0);
      const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, "#8ac8f0"); sk.addColorStop(0.45, "#e8f0f8"); sk.addColorStop(0.46, "#4aa04a"); sk.addColorStop(1, "#3a8a3a"); g.fillStyle = sk; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) { const h = 22 + ((i * 37) % 26); g.fillStyle = ["#e8a87a", "#d8c8a8", "#c8d8e8", "#f0d0a0"][i % 4]; g.fillRect(i * 42, 76 - h, 38, h); g.fillStyle = "#3a4a6a"; for (let k = 0; k < 2; k++) g.fillRect(i * 42 + 6 + k * 16, 80 - h, 8, 8); g.strokeStyle = "#111"; g.lineWidth = 1.5; g.strokeRect(i * 42, 76 - h, 38, h); }
      g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1.5; const zw = (W - 20) / Z; for (let k = 0; k <= Z; k++) { g.beginPath(); g.moveTo(10 + k * zw, 84); g.lineTo(10 + k * zw, 160); g.stroke(); }
      for (let k = 0; k < Z; k++) { g.fillStyle = k === S.z ? "rgba(255,210,63,.28)" : k % 2 ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)"; g.fillRect(10 + k * zw, 84, zw, 76); g.fillStyle = "rgba(255,255,255,.6)"; g.font = "700 7px system-ui"; g.textAlign = "center"; g.fillText(k + 1, 10 + k * zw + zw / 2, 156); }
      [[4, usCol], [W - 8, opp.color]].forEach(([x, c]) => { g.fillStyle = "#fff"; g.fillRect(x, 104, 4, 36); g.strokeStyle = c; g.lineWidth = 2; g.strokeRect(x, 104, 4, 36); });
      const bx = 10 + S.z * zw + zw / 2, by = 128 + Math.abs(Math.sin(S.t / 8)) * -4;
      const fig = (x, y, col, sk, hr) => { g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(x, y + 12, 6, 2, 0, 0, 7); g.fill(); g.fillStyle = col; g.fillRect(x - 5, y - 2, 10, 12); g.strokeStyle = "#111"; g.lineWidth = 1.2; g.strokeRect(x - 5, y - 2, 10, 12); g.fillStyle = sk || "#e0b890"; g.beginPath(); g.arc(x, y - 7, 5, 0, 7); g.fill(); g.stroke(); g.fillStyle = hr || "#2a2a2a"; g.beginPath(); g.arc(x, y - 9, 5, Math.PI, 0); g.fill(); };
      const sideUs = S.own ? -1 : 1;
      heroes.forEach((h, i) => fig(bx - 18 * (S.own ? 1 : -1) - (i % 2) * 10 * (S.own ? 1 : -1) + sideUs * 0, 104 + i * 9, usCol, h.skin, h.hair));
      (opp.players.length ? opp.players : [{}, {}]).slice(0, 3).forEach((p, i) => fig(bx + 22 * (S.own ? 1 : -1) + i * 9 * (S.own ? 1 : -1), 106 + i * 12, S.frz > 0 ? "#9ad8f0" : opp.color, p.skin, p.hair));
      g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, 4, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1.2; g.stroke();
      if (S.frz > 0) { g.fillStyle = "rgba(180,230,255,.25)"; g.fillRect(bx + (S.own ? 10 : -50), 92, 40, 66); }
      if (S.fx) { const F = S.fx; F.t++; const p = F.t / 50;
        F.pw.forEach((pw) => { for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28 + F.t / 10, r = 10 + p * 60, x = bx + Math.cos(a) * r, y = 120 + Math.sin(a) * r * 0.5; g.fillStyle = POW[pw] ? POW[pw][1] : "#fff"; g.globalAlpha = Math.max(0, 1 - p); g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); g.globalAlpha = 1; } });
        const a = Math.max(0, 1 - p); g.font = "900 22px Impact, 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = `rgba(10,10,20,${a})`; g.strokeText(F.text, W / 2, 40); g.globalAlpha = a; g.fillStyle = F.col; g.fillText(F.text, W / 2, 40); g.globalAlpha = 1; if (F.t > 50) S.fx = null; }
    }
    function loop() { if (!el.isConnected) return; draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ inizio e fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      const nn = S.data.nuove.map((id) => Object.values(COMBO).find((c) => c.id === id)).filter(Boolean);
      card(quit ? "Partita abbandonata" : res.win ? o.winTitle || "VITTORIA DEL QUARTIERE!" : S.a === S.b ? "Pareggio" : "Sconfitta", `<p class="big">${S.a} – ${S.b}</p><p>Combo ${S.data.combo} · recuperi ${S.data.recuperi} · tiri ${S.data.tiri}</p>${nn.length ? `<p>Combo scoperte: <b>${nn.map((c) => esc(c.n)).join(", ")}</b></p>` : ""}`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.act = act; S.pick = (arr) => { S.sel = arr.slice(0, 2).filter((i) => !S.tired.includes(i)); turnUi(); return S.sel.length; }; S.shoot = () => { S.wantShot = true; return act(); };
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    card(o.title || "Combo di Squadra", `${o.intro || ""}<p>A ogni turno scegli <b>uno o due eroi</b>. Da soli: passaggio, contrasto o tiro. In coppia i poteri si <b>combinano</b>: le combo si scoprono provandole. Chi agisce è <b>stanco</b> al turno dopo.</p><p>In alto c'è la mossa che l'avversario ha annunciato: pressing, muro, trappola, avanza, sfonda, tiro. Scegli la combo che la batte.</p>`, "Fischio d'inizio ▸", () => kickoff(true));
    hud(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("cbCss")) return; const st = document.createElement("style"); st.id = "cbCss";
    st.textContent = `.cbOv{position:fixed;inset:0;z-index:300;background:#1a1a2a;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#fff;overflow:auto}
.cbOv .hud{width:min(100%,440px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:3px solid #111;border-radius:8px;background:#ffd23f;color:#111;padding:4px 10px;font:900 12px system-ui;box-shadow:3px 3px 0 #111}
.cbOv .hud .n1{text-align:right}.cbOv .hud .sc{font:900 22px Impact,'Arial Black',sans-serif}
.cbOv .bar{width:min(100%,440px);display:flex;gap:8px;align-items:center;font:700 12px system-ui}.cbOv .bar i{font-style:normal;color:#ffd23f}.cbOv .intent{flex:1;background:#2a2a3a;border:2px solid #111;border-radius:6px;padding:3px 8px}.cbOv .intent small{opacity:.75;font-weight:500}
.cbOv canvas{width:min(100%,440px);height:auto;aspect-ratio:320/170;flex:none;border:3px solid #111;border-radius:8px}
.cbOv .msg{width:min(100%,440px);min-height:36px;font-size:13px;line-height:1.4}.cbOv .msg b{color:#ffd23f}
.cbOv .team{width:min(100%,440px);display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.cbOv .team button{min-height:66px;border-radius:8px;border:3px solid #111;background:#fff;color:#111;font:800 12px system-ui;padding:4px;box-shadow:3px 3px 0 #111;cursor:pointer}.cbOv .team button .p{display:block;font-size:20px;background:var(--c);border-radius:50%;width:30px;height:30px;line-height:30px;margin:0 auto 2px;border:2px solid #111}.cbOv .team button small{display:block;font-weight:500;font-size:10px;opacity:.75}.cbOv .team button.on{background:#ffd23f;transform:translateY(-3px)}.cbOv .team button.tired{opacity:.35}
.cbOv .pad{width:min(100%,440px);display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px}
.cbOv .pad button{min-height:48px;border-radius:8px;border:3px solid #111;background:#3a8ac8;color:#fff;font:900 14px system-ui;cursor:pointer;padding:5px;box-shadow:3px 3px 0 #111}.cbOv .pad button small{display:block;font:600 10px system-ui;opacity:.85;margin-top:2px}.cbOv .pad button.go{background:#ff5a8a}.cbOv .pad button.hot{background:#ff8a3a}.cbOv button:disabled{opacity:.4}
.cbOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px;border-radius:6px;border:2px solid #111;background:#fff;color:#111}
.cbOv .ov{position:absolute;inset:0;background:rgba(26,26,42,.95);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.cbOv .card{max-width:440px;width:100%;border:4px solid #111;border-radius:10px;background:#fff;color:#111;padding:14px;box-shadow:8px 8px 0 #ff5a8a}.cbOv .card h3{margin:0 0 8px;font:900 24px Impact,'Arial Black',sans-serif;color:#ff5a8a}.cbOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.cbOv .card .big{font:900 34px Impact,'Arial Black',sans-serif}
.cbOv .card .goB{width:100%;margin-top:10px;background:#ffd23f;font:900 15px system-ui;min-height:50px;border:3px solid #111;border-radius:8px;box-shadow:3px 3px 0 #111}`;
    document.head.appendChild(st);
  }
  window.__combo = { start, COMBO, POW, get state() { return STATE; } };
})();
