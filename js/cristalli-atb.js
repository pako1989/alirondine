// js/cristalli-atb.js - BATTAGLIA ATB (modalità originale di «Cristalli del Campo»)
// Una partita come una battaglia da JRPG classico, vista di lato. Ogni giocatore ha una barra del tempo (ATB) che si riempie:
// quando è piena il gioco si ferma (modalità «attesa») e scegli il comando. Il pallone si muove su 5 zone del campo.
// Il portiere avversario ha una barra di GUARDIA: i tiri la consumano, quando si rompe è gol. Le abilità dei MESTIERI
// (Bomber, Regista, Muro, Funambolo) costano LUCE, una barra comune che si carica col tempo e con le belle giocate.
// Uso: window.__crATB.start({ title, bg, party:[{name,job,skin,hair,shirt}x3], foes:[{name}x3], keeper:{name,guard}, foeCol, boss, target, onDone({a,b,win,recap}) })
(function () {
  "use strict";
  if (window.__crATB) return;
  const W = 320, H = 200;
  const JOBS = {
    bomber: { n: "Bomber", ab: "Tiro Meteora", d: "Un tiro enorme che consuma molta Guardia, anche da metà campo.", cost: 40, col: "#e05a3a" },
    regista: { n: "Regista", ab: "Filtrante", d: "Il pallone avanza di due zone e i compagni ricaricano la barra.", cost: 30, col: "#3fa7ff" },
    muro: { n: "Muro", ab: "Barriera", d: "Il prossimo tiro avversario si infrange contro una barriera di luce.", cost: 30, col: "#c9a227" },
    funambolo: { n: "Funambolo", ab: "Finta Lunare", d: "Azzera la barra di chi ha palla e gliela ruba quasi sempre.", cost: 35, col: "#b07ae0" },
  };
  const BGS = {
    terra: { sky: ["#2a1e14", "#4a3424", "#6a4a2a"], ground: "#5a4a32", deco: "crystal", glow: "180,140,80" },
    vento: { sky: ["#7cc4ff", "#bfe3ff", "#eaf6ff"], ground: "#9fd18a", deco: "clouds", glow: "220,240,255" },
    fuoco: { sky: ["#2a0a08", "#7a1a10", "#e05a1a"], ground: "#4a2a20", deco: "embers", glow: "255,140,60" },
    acqua: { sky: ["#062a3a", "#0e4a6a", "#3fa7c8"], ground: "#2a6a7a", deco: "bubbles", glow: "120,220,255" },
    trono: { sky: ["#0a0614", "#2a1a3a", "#5a3a6a"], ground: "#3a3040", deco: "stars", glow: "200,160,255" },
  };
  let S = null;
  let ac = null;
  function beep(f, d, type, v, sl, when) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const t = ac.currentTime + (when || 0), o = ac.createOscillator(), g = ac.createGain(); o.type = type || "square"; o.frequency.setValueAtTime(f, t); if (sl) o.frequency.exponentialRampToValueAtTime(sl, t + d); g.gain.setValueAtTime(v || 0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02); } catch (e) {} }
  const snd = { ready: () => { beep(880, 0.06, "square", 0.04); beep(1320, 0.08, "square", 0.04, 0, 0.06); }, cmd: () => beep(660, 0.05, "square", 0.04), kick: () => beep(200, 0.1, "square", 0.06, 90), hit: () => beep(120, 0.2, "sawtooth", 0.06, 60), goal: () => [523, 659, 784, 1047, 1319].forEach((f, i) => beep(f, 0.2, "triangle", 0.07, 0, i * 0.09)), miss: () => beep(300, 0.15, "sine", 0.05, 200), magic: () => [880, 1100, 1320, 1760].forEach((f, i) => beep(f, 0.12, "sine", 0.05, 0, i * 0.05)), bad: () => beep(150, 0.3, "square", 0.05, 80) };

  function css() {
    if (document.getElementById("crATBstyle")) return;
    const st = document.createElement("style"); st.id = "crATBstyle";
    st.textContent = `#crATB{position:fixed;inset:0;z-index:300;background:#0a0a1a;display:flex;flex-direction:column;align-items:center;padding:8px;gap:6px;font-family:Georgia,"Times New Roman",serif;color:#f0e6c8;touch-action:manipulation;user-select:none;-webkit-user-select:none}
#crATB .top{width:min(100%,460px);display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:14px}
#crATB .sc{font-size:22px;letter-spacing:2px;color:#ffd36b;text-shadow:0 0 8px #ffd36b88}
#crATB canvas{width:min(100%,460px);aspect-ratio:16/10;border:2px solid #c9a227;border-radius:6px;box-shadow:0 0 18px #c9a22744;image-rendering:pixelated}
#crATB .win{width:min(100%,460px);background:linear-gradient(#1a2a6a,#0a1440);border:2px solid #e8e0d0;border-radius:6px;padding:6px 8px;box-shadow:inset 0 0 0 2px #0a0a2a}
#crATB .row{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:6px;align-items:center;font-size:13px;padding:2px 0}
#crATB .row.act{color:#ffd36b}#crATB .row.act .nm::before{content:"▶ "}
#crATB .bar{height:7px;background:#2a2a4a;border-radius:4px;overflow:hidden;border:1px solid #6a6a8a}#crATB .bar i{display:block;height:100%;background:linear-gradient(90deg,#5af0c8,#ffd36b)}#crATB .bar.full i{background:#ffd36b;box-shadow:0 0 6px #ffd36b}
#crATB .luce{height:9px;background:#2a2a4a;border-radius:5px;overflow:hidden;border:1px solid #c9a227;margin-top:4px}#crATB .luce i{display:block;height:100%;background:linear-gradient(90deg,#b07ae0,#ffd36b)}
#crATB .cmds{width:min(100%,460px);display:grid;grid-template-columns:1fr 1fr;gap:6px}
#crATB button{font:700 15px Georgia,serif;color:#f0e6c8;background:linear-gradient(#1a2a6a,#0a1440);border:2px solid #e8e0d0;border-radius:6px;padding:11px 6px;cursor:pointer;text-align:left}
#crATB button:disabled{opacity:.35}#crATB button small{display:block;font-size:11px;color:#bfc8e0;font-weight:400}
#crATB button.esci{grid-column:1/-1;text-align:center;padding:6px;font-size:12px;background:#2a2a3a}
#crATB .ov{position:absolute;inset:0;background:rgba(5,5,20,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;overflow:auto}
#crATB .card{background:linear-gradient(#1a2a6a,#0a1440);border:2px solid #e8e0d0;border-radius:8px;padding:14px;max-width:420px;width:100%}#crATB .card h3{margin:0 0 6px;color:#ffd36b}#crATB .card p{margin:4px 0;font-size:14px;line-height:1.4}`;
    document.head.appendChild(st);
  }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // ---------------------------------------------------------------- stato
  function newState(o) {
    const party = (o.party || []).slice(0, 3).map((p, i) => ({ side: 0, i, name: p.name, job: JOBS[p.job] ? p.job : ["bomber", "regista", "muro"][i], skin: p.skin || "#e0b48a", hair: p.hair || "#2b1d14", shirt: p.shirt || "#3fa7ff", atb: 30 + i * 15, spd: [1.0, 0.9, 0.85][i], stun: 0 }));
    const foes = (o.foes || []).slice(0, 3).map((p, i) => ({ side: 1, i, name: p.name || "Avversario", skin: p.skin || "#9a8a7a", hair: p.hair || "#2a2a2a", shirt: o.foeCol || "#7a3b2e", atb: 10 + i * 20, spd: (o.boss ? 0.95 : 0.8) + i * 0.04, stun: 0 }));
    return { o, party, foes, a: 0, b: 0, z: 2, hold: party[0], t: 0, dur: (o.minutes || 2) * 3600, over: false, wait: null, queue: [], fx: [], msg: null, luce: 40,
      guard: [100, o.keeper && o.keeper.guard ? o.keeper.guard : 100], gmax: [100, o.keeper && o.keeper.guard ? o.keeper.guard : 100], barrier: 0, log: [], extra: false, shake: 0 };
  }
  const mine = (p) => p && p.side === 0;
  function say(t, col) { S.msg = { t, col: col || "#f0e6c8", life: 110 }; }
  function pop(txt, x, y, col) { S.fx.push({ txt, x, y, t: 50, col }); }
  function posOf(p) { // posizione in scena: il pallone è sulla zona z (0 = porta nostra a destra, 4 = porta loro a sinistra)
    const bx = 270 - S.z * 55;
    if (p.side === 0) return { x: bx + 20 + p.i * 16 - (S.hold === p ? 12 : 0), y: 118 + p.i * 18 };
    return { x: bx - 26 - p.i * 16 + (S.hold === p ? 12 : 0), y: 112 + p.i * 18 };
  }
  // ---------------------------------------------------------------- azioni
  function chance(p) { return Math.random() < p; }
  function turnover(to, why) { S.hold = to; if (why) say(why); }
  function shoot(p, power, fromAb) {
    const side = p.side, need = side === 0 ? 3 : 1, ok = side === 0 ? S.z >= (fromAb ? 2 : need) : S.z <= need;
    snd.kick(); const target = side === 0 ? 1 : 0;
    if (!ok) { say(`${p.name} tira da troppo lontano…`); snd.miss(); return lose(p); }
    if (side === 1 && S.barrier > 0) { S.barrier = 0; snd.magic(); say("La Barriera di luce respinge il tiro!", "#ffd36b"); pop("BLOCCO", 270, 90, "#ffd36b"); S.hold = S.party[2]; S.z = 1; return; }
    const dmg = Math.round(power * (0.8 + Math.random() * 0.45) * (side === 0 && S.z >= 4 ? 1.25 : 1));
    S.guard[target] -= dmg; S.shake = 10; pop(`-${dmg}`, side === 0 ? 30 : 290, 70, "#ff8a6a");
    if (S.guard[target] <= 0) return goal(side, p);
    snd.hit(); say(`${p.name} tira! Il portiere para (Guardia ${Math.max(0, Math.round(S.guard[target]))}).`);
    if (side === 0) { S.luce = Math.min(100, S.luce + 8); S.hold = S.foes[0]; S.z = 3; } else { S.hold = S.party[1]; S.z = 1; }
  }
  function goal(side, p) {
    snd.goal(); S.shake = 18;
    if (side === 0) { S.a++; say(`GOL di ${p.name}!`, "#ffd36b"); pop("GOL!", 60, 60, "#ffd36b"); S.log.push(`gol di ${p.name}`); S.guard[1] = S.gmax[1]; S.hold = S.foes[0]; S.z = 2; S.luce = Math.min(100, S.luce + 15); }
    else { S.b++; say(`Gol di ${p.name}…`, "#ff8a6a"); pop("GOL", 260, 60, "#ff8a6a"); S.guard[0] = S.gmax[0]; S.hold = S.party[0]; S.z = 2; }
    hud(); checkEnd();
  }
  function lose(p) { if (p.side === 0) { S.hold = S.foes[(Math.random() * 3) | 0]; } else { S.hold = S.party[(Math.random() * 3) | 0]; } }
  function act(p, cmd) {
    snd.cmd(); p.atb = 0;
    const hasBall = S.hold === p, team = p.side === 0 ? S.party : S.foes, opp = p.side === 0 ? S.foes : S.party, dir = p.side === 0 ? 1 : -1;
    if (cmd === "dribbla") {
      const def = opp[(Math.random() * 3) | 0], ok = chance(p.side === 0 && p.job === "funambolo" ? 0.85 : p.side === 0 ? 0.72 : (S.o.boss ? 0.68 : 0.6));
      if (ok) { S.z = Math.max(0, Math.min(4, S.z + dir)); say(`${p.name} supera ${def.name} in dribbling!`); pop("DRIBBLING", posOf(p).x, posOf(p).y - 24, "#5af0c8"); if (p.side === 0) S.luce = Math.min(100, S.luce + 5); }
      else { turnover(def, `${def.name} ruba il pallone a ${p.name}!`); pop("RUBATA", posOf(def).x, posOf(def).y - 24, "#ff8a6a"); }
    } else if (cmd === "passa") {
      const mates = team.filter((q) => q !== p), q = mates[(Math.random() * mates.length) | 0];
      if (chance(p.side === 0 && p.job === "regista" ? 0.95 : 0.85)) { S.hold = q; q.atb = Math.min(100, q.atb + 35); S.z = Math.max(0, Math.min(4, S.z + (chance(0.4) ? dir : 0))); say(`${p.name} passa a ${q.name}.`); }
      else { const d = opp[(Math.random() * 3) | 0]; turnover(d, `Passaggio intercettato da ${d.name}!`); }
    } else if (cmd === "tira") { shoot(p, p.side === 0 ? (p.job === "bomber" ? 46 : 36) : (S.o.boss ? 42 : 34), false); }
    else if (cmd === "contrasta") {
      const h = S.hold; if (!h || h.side === p.side) { say(`${p.name} si piazza.`); return; }
      if (chance(p.side === 0 ? (p.job === "muro" ? 0.7 : 0.5) : 0.42)) { turnover(p, `${p.name} contrasta e prende palla!`); pop("CONTRASTO", posOf(p).x, posOf(p).y - 24, "#5af0c8"); } else { say(`${p.name} va a vuoto.`); h.atb = Math.min(100, h.atb + 10); }
    } else if (cmd === "pressa") {
      const h = S.hold; if (h && h.side !== p.side) { h.atb = Math.max(0, h.atb - 45); say(`${p.name} pressa ${h.name}: gli toglie tempo!`); } else say(`${p.name} si piazza.`);
    } else if (cmd === "difendi") { S.guard[p.side] = Math.min(S.gmax[p.side], S.guard[p.side] + 25); say(`${p.name} aiuta il portiere: Guardia +25.`); }
    else if (cmd === "abilita") {
      const J = JOBS[p.job]; S.luce -= J.cost; snd.magic(); pop(J.ab.toUpperCase(), posOf(p).x, posOf(p).y - 30, J.col);
      if (p.job === "bomber") { say(`${p.name}: TIRO METEORA!`, "#ffd36b"); S.fx.push({ comet: true, x: posOf(p).x, y: posOf(p).y - 10, t: 30 }); if (S.hold !== p) { S.hold = p; } shoot(p, 72, true); }
      else if (p.job === "regista") { S.hold = p; S.z = Math.min(4, S.z + 2); S.party.forEach((q) => { if (q !== p) q.atb = Math.min(100, q.atb + 50); }); say(`${p.name}: FILTRANTE! Il pallone vola avanti.`, "#3fa7ff"); }
      else if (p.job === "muro") { S.barrier = 1; S.guard[0] = Math.min(S.gmax[0], S.guard[0] + 20); say(`${p.name}: BARRIERA! Il prossimo tiro avversario si infrange.`, "#c9a227"); }
      else if (p.job === "funambolo") { const h = S.hold; if (h && h.side === 1) { h.atb = 0; h.stun = 90; if (chance(0.9)) turnover(p, `${p.name}: FINTA LUNARE! ${h.name} resta incantato.`); } else { S.foes.forEach((f) => { f.atb = Math.max(0, f.atb - 40); }); say(`${p.name}: FINTA LUNARE! Gli avversari rallentano.`, "#b07ae0"); } }
    }
    hud();
  }
  function foeAI(p) {
    const has = S.hold === p, mine2 = S.hold && S.hold.side === 1;
    if (has) { if (S.z <= 1 && chance(0.75)) return act(p, "tira"); if (chance(0.25)) return act(p, "passa"); return act(p, "dribbla"); }
    if (!mine2) return act(p, chance(0.75) ? "contrasta" : "pressa");
    p.atb = 40; // senza palla e la palla è dei suoi: si smarca
  }
  // ---------------------------------------------------------------- comandi del giocatore
  function showCmds() {
    const box = S.el.querySelector(".cmds"); box.innerHTML = "";
    const p = S.wait;
    if (!p) { box.innerHTML = `<button type="button" disabled>…<small>Le barre si stanno riempiendo</small></button><button type="button" disabled>…<small>&nbsp;</small></button>`; addExit(box); return; }
    const has = S.hold === p, J = JOBS[p.job], our = S.hold && S.hold.side === 0;
    const list = has ? [["dribbla", "Dribbla", "Avanza di una zona"], ["passa", "Passa", "A un compagno, che si ricarica"], ["tira", "Tira", S.z >= 3 ? "Contro la Guardia del portiere" : "Troppo lontano dalla porta"], ["abilita", J.ab, `${J.d} (Luce ${J.cost})`]]
      : our ? [["difendi", "Difendi", "Aiuta il tuo portiere (Guardia +25)"], ["pressa", "Smarcati", "Tieni la posizione"], ["abilita", J.ab, `${J.d} (Luce ${J.cost})`], ["contrasta", "Attendi", "Passa il turno"]]
        : [["contrasta", "Contrasta", "Prova a rubare il pallone"], ["pressa", "Pressa", "Toglie tempo a chi ha palla"], ["difendi", "Difendi", "Aiuta il tuo portiere (Guardia +25)"], ["abilita", J.ab, `${J.d} (Luce ${J.cost})`]];
    list.forEach(([k, l, sub]) => { const b = document.createElement("button"); b.type = "button"; b.innerHTML = `${esc(l)}<small>${esc(sub)}</small>`; if (k === "abilita" && S.luce < J.cost) b.disabled = true; b.onclick = () => { if (!S || S.wait !== p) return; S.wait = null; S.queue.shift(); act(p, k); showCmds(); }; box.appendChild(b); });
    addExit(box);
  }
  function addExit(box) { const e = document.createElement("button"); e.type = "button"; e.className = "esci"; e.textContent = "Arrenditi ed esci"; e.onclick = () => finish(true); box.appendChild(e); }
  // ---------------------------------------------------------------- ciclo
  function tick() {
    S.t++; if (S.shake > 0) S.shake--;
    S.luce = Math.min(100, S.luce + 0.04);
    S.guard.forEach((g, i) => { S.guard[i] = Math.min(S.gmax[i], g + 0.03); });
    const all = [...S.party, ...S.foes];
    all.forEach((p) => { if (p.stun > 0) { p.stun--; return; } if (p.atb < 100) p.atb = Math.min(100, p.atb + p.spd * (S.hold === p ? 0.95 : 0.8) * (p.side === 1 ? (S.o.diff || 1) : 1)); });
    S.party.forEach((p) => { if (p.atb >= 100 && !S.queue.includes(p)) { S.queue.push(p); snd.ready(); } });
    if (!S.wait && S.queue.length) { S.wait = S.queue[0]; showCmds(); }
    S.foes.forEach((p) => { if (p.atb >= 100) foeAI(p); });
    if (S.t >= S.dur) checkEnd(true);
  }
  function checkEnd(time) {
    const tgt = S.o.target || 3;
    if (S.a >= tgt || S.b >= tgt) return finish(false);
    if (time) { if (S.a === S.b && !S.extra) { S.extra = true; S.dur += 1200; say("Pareggio! TEMPO DEL CRISTALLO: chi segna vince.", "#ffd36b"); return; } return finish(false); }
    if (S.extra && S.a !== S.b) finish(false);
  }
  function finish(quit) {
    if (!S || S.over) return; S.over = true;
    const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, recap: S.log.length ? ` <span style="color:var(--dim)">(${S.log.slice(-4).join(", ")})</span>` : "" };
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${quit ? "Ritirata" : res.win ? "Vittoria!" : "Sconfitta"} · ${S.a} – ${S.b}</h3><p>${res.win ? "La luce del Cristallo vi avvolge." : "La luce trema, ma non si spegne. Si può ritentare."}</p></div>`;
    const b = document.createElement("button"); b.type = "button"; b.style.textAlign = "center"; b.textContent = "Continua ▸"; b.onclick = () => close(res); ov.appendChild(b); S.el.appendChild(ov);
  }
  function close(res) { const s = S; S = null; cancelAnimationFrame(s.raf); s.el.remove(); try { s.o.onDone(res); } catch (e) { console.error(e); } }
  // ---------------------------------------------------------------- disegno
  function chibi(g, x, y, p, face, act) {
    g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y + 12, 8, 3, 0, 0, 7); g.fill();
    const b = act ? Math.sin(S.t / 4) * 1.5 : 0;
    g.fillStyle = p.shirt; g.fillRect(x - 6, y - 2 + b, 12, 11); g.fillStyle = "#1a1a2a"; g.fillRect(x - 5, y + 9, 4, 4); g.fillRect(x + 1, y + 9, 4, 4);
    g.fillStyle = p.skin; g.fillRect(x - 5, y - 12 + b, 10, 10); g.fillStyle = p.hair; g.fillRect(x - 6, y - 14 + b, 12, 4); g.fillRect(face < 0 ? x + 3 : x - 6, y - 12 + b, 3, 5);
    g.fillStyle = "#111"; g.fillRect(face < 0 ? x - 3 : x + 1, y - 8 + b, 2, 2);
    if (p.stun > 0) { g.fillStyle = "#ffd36b"; g.font = "8px serif"; g.fillText("✦", x - 3, y - 18); }
  }
  function draw() {
    const g = S.g, B = BGS[S.o.bg] || BGS.terra, sh = S.shake ? (Math.random() - 0.5) * S.shake * 0.4 : 0;
    g.save(); g.translate(sh, 0);
    const gr = g.createLinearGradient(0, 0, 0, 120); B.sky.forEach((c, i) => gr.addColorStop(i / (B.sky.length - 1), c)); g.fillStyle = gr; g.fillRect(-10, 0, W + 20, 120);
    // decorazioni di sfondo per tema
    for (let i = 0; i < 24; i++) {
      const x = (i * 53 + S.t * (B.deco === "clouds" ? 0.2 : 0.05)) % (W + 40) - 20, y = (i * 29) % 90;
      if (B.deco === "crystal") { g.fillStyle = `rgba(${B.glow},${0.3 + 0.2 * Math.sin(S.t / 30 + i)})`; g.beginPath(); g.moveTo(x, y + 20); g.lineTo(x + 4, y); g.lineTo(x + 8, y + 20); g.fill(); }
      else if (B.deco === "clouds") { g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.ellipse(x, y, 16, 6, 0, 0, 7); g.fill(); }
      else if (B.deco === "embers") { g.fillStyle = `rgba(255,${120 + i * 4},40,.8)`; g.fillRect(x, 120 - ((S.t * (0.5 + (i % 3) * 0.3) + i * 40) % 120), 2, 2); }
      else if (B.deco === "bubbles") { g.strokeStyle = "rgba(200,240,255,.5)"; g.beginPath(); g.arc(x, 120 - ((S.t * 0.4 + i * 37) % 120), 2 + (i % 3), 0, 7); g.stroke(); }
      else { g.fillStyle = (S.t / 20 + i) % 5 < 1 ? "#fff" : "rgba(255,255,255,.4)"; g.fillRect(x, y, 1, 1); }
    }
    // il grande cristallo sullo sfondo
    const cx = 160, cy = 46; g.save(); g.globalCompositeOperation = "lighter"; const gl = g.createRadialGradient(cx, cy, 2, cx, cy, 50); gl.addColorStop(0, `rgba(${B.glow},.5)`); gl.addColorStop(1, `rgba(${B.glow},0)`); g.fillStyle = gl; g.fillRect(cx - 50, cy - 50, 100, 100); g.restore();
    g.fillStyle = `rgba(${B.glow},.85)`; g.beginPath(); g.moveTo(cx, cy - 26 + Math.sin(S.t / 30) * 3); g.lineTo(cx + 12, cy); g.lineTo(cx, cy + 26 + Math.sin(S.t / 30) * 3); g.lineTo(cx - 12, cy); g.closePath(); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 1; g.stroke();
    // campo in prospettiva leggera con le 5 zone
    g.fillStyle = B.ground; g.fillRect(-10, 100, W + 20, 100);
    for (let k = 0; k < 5; k++) { const x = 270 - k * 55; g.fillStyle = k === S.z ? "rgba(255,211,107,.18)" : "rgba(255,255,255,.04)"; g.fillRect(x - 27, 104, 54, 70); g.strokeStyle = "rgba(255,255,255,.15)"; g.beginPath(); g.moveTo(x + 27, 104); g.lineTo(x + 27, 174); g.stroke(); }
    // porte: la nostra a destra, la loro a sinistra
    [[300, 0], [8, 1]].forEach(([x, side]) => { g.strokeStyle = "#fff"; g.lineWidth = 2; g.strokeRect(x, 112, 12, 46); g.fillStyle = "rgba(255,255,255,.15)"; g.fillRect(x, 112, 12, 46); const kx = side ? x + 16 : x - 6; g.fillStyle = side ? "#e8c46a" : "#5af0c8"; g.fillRect(kx - 4, 126, 8, 14); g.fillStyle = "#e0b48a"; g.fillRect(kx - 3, 119, 6, 6); });
    // barre di Guardia sopra le porte
    [[250, 0], [10, 1]].forEach(([x, side]) => { g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(x, 96, 60, 9); g.fillStyle = side ? "#ff8a6a" : "#5af0c8"; g.fillRect(x + 1, 97, 58 * Math.max(0, S.guard[side]) / S.gmax[side], 7); g.fillStyle = "#fff"; g.font = "bold 6px sans-serif"; g.fillText(side ? `GUARDIA ${S.o.keeper ? S.o.keeper.name : ""}` : "GUARDIA NOSTRA", x + 2, 103); if (!side && S.barrier) { g.strokeStyle = "#ffd36b"; g.lineWidth = 2; g.strokeRect(296, 108, 20, 54); } });
    // giocatori
    const all = [...S.foes, ...S.party].sort((p, q) => posOf(p).y - posOf(q).y);
    all.forEach((p) => { const ps = posOf(p); chibi(g, ps.x, ps.y, p, p.side === 0 ? -1 : 1, S.wait === p); if (S.wait === p) { g.fillStyle = "#ffd36b"; g.beginPath(); g.moveTo(ps.x - 4, ps.y - 24); g.lineTo(ps.x + 4, ps.y - 24); g.lineTo(ps.x, ps.y - 19); g.fill(); } });
    // pallone
    if (S.hold) { const ps = posOf(S.hold), bx = ps.x + (S.hold.side === 0 ? -9 : 9), by = ps.y + 10; g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, 3.5, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 1; g.stroke(); }
    // effetti
    S.fx = S.fx.filter((f) => f.t > 0);
    S.fx.forEach((f) => { f.t--; if (f.comet) { g.save(); g.globalCompositeOperation = "lighter"; const k = 1 - f.t / 30, x = f.x + (20 - f.x) * k, y = f.y - Math.sin(k * Math.PI) * 40; for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(255,${180 - i * 20},80,${0.8 - i * 0.12})`; g.beginPath(); g.arc(x + i * 6, y + i * 2, 6 - i, 0, 7); g.fill(); } g.restore(); return; } f.y -= 0.5; g.font = "bold 10px Georgia, serif"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#000"; g.strokeText(f.txt, f.x, f.y); g.fillStyle = f.col; g.fillText(f.txt, f.x, f.y); g.textAlign = "left"; });
    // messaggio della battaglia (finestra blu in alto, stile JRPG)
    if (S.msg && S.msg.life > 0) { S.msg.life--; g.fillStyle = "rgba(10,20,64,.9)"; g.fillRect(6, 4, W - 12, 18); g.strokeStyle = "#e8e0d0"; g.lineWidth = 1; g.strokeRect(6.5, 4.5, W - 13, 17); g.fillStyle = S.msg.col; g.font = "bold 9px Georgia, serif"; g.fillText(S.msg.t, 12, 16, W - 24); }
    // tempo
    g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(W - 46, 180, 42, 14); g.fillStyle = "#ffd36b"; g.font = "bold 8px monospace"; g.fillText(`${Math.max(0, Math.ceil((S.dur - S.t) / 60))}s`, W - 40, 190);
    g.restore();
  }
  function hud() {
    if (!S || !S.el) return;
    S.el.querySelector(".sc").textContent = `${S.a} – ${S.b}`;
    const box = S.el.querySelector(".party");
    box.innerHTML = S.party.map((p) => `<div class="row${S.wait === p ? " act" : ""}"><span class="nm">${esc(p.name)} <small style="color:${JOBS[p.job].col}">${JOBS[p.job].n}</small></span><div class="bar${p.atb >= 100 ? " full" : ""}"><i style="width:${Math.round(p.atb)}%"></i></div><span style="font-size:11px;color:#bfc8e0">${S.hold === p ? "⚽ palla" : p.stun ? "stordito" : ""}</span></div>`).join("") + `<div class="luce" title="Luce"><i style="width:${Math.round(S.luce)}%"></i></div>`;
  }
  function loop() { if (!S) return; if (!S.wait && !S.over && S.started) tick(); draw(); if (S.t % 6 === 0 || S.wait) hud(); S.raf = requestAnimationFrame(loop); }
  function start(o) {
    if (S) return false;
    css(); S = newState(o || {});
    const el = document.createElement("div"); el.id = "crATB";
    el.innerHTML = `<div class="top"><span>${esc(o.us || "Guerrieri della Luce")}</span><span class="sc">0 – 0</span><span>${esc(o.oppName || "Avversari")}</span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="win party"></div><div class="cmds"></div>`;
    document.body.appendChild(el); S.el = el; S.g = el.querySelector("canvas").getContext("2d"); S.g.scale(2, 2);
    hud(); showCmds();
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${esc(o.title || "Battaglia ATB")}</h3><p>Le barre del tempo dei tuoi tre giocatori si riempiono da sole. Quando una è piena, il tempo si ferma e scegli il comando.</p><p>Il pallone si muove su 5 zone: <b>Dribbla</b> per avanzare, <b>Passa</b> per ricaricare un compagno, <b>Tira</b> dalle ultime due zone per consumare la <b>Guardia</b> del portiere. Quando la Guardia si rompe, è gol.</p><p>Le abilità dei mestieri costano <b>Luce</b> (barra viola), che si carica col tempo e con le belle giocate. Vince chi arriva prima a ${o.target || 3} gol.</p></div>`;
    const b = document.createElement("button"); b.type = "button"; b.style.textAlign = "center"; b.textContent = "Che la battaglia abbia inizio ▸"; b.onclick = () => { ov.remove(); S.started = true; say(o.intro || "La partita del Cristallo comincia!", "#ffd36b"); }; ov.appendChild(b); el.appendChild(ov);
    loop(); return true;
  }
  window.__crATB = { start, JOBS, get state() { return S; }, _act: (k) => { if (S && S.wait) { const p = S.wait; S.wait = null; S.queue.shift(); act(p, k); showCmds(); } }, _finish: () => finish(false) };
})();
