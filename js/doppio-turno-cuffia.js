// js/doppio-turno-cuffia.js - LA PARTITA IN CUFFIA (modalità originale di «Doppio Turno»)
// Partita in tempo reale dall'alto, in verticale, giocata col dito (TIRA / PASSA). Durante il gioco una Voce nella cuffia
// dà ORDINI a tempo («Passa!», «Non tirare!», «Vai a sinistra!», «Fermo!», «Buttati!»). Obbedire o disobbedire non cambia
// le regole del calcio: cambia l'Indice di Conformità e la storia. Alcuni ordini aiutano, altri sono trappole.
// Uso: window.__dtCuffia.start({ title, voice, hero:{name,skin,hair,shirt}, mate:{...}, opp:{name,kit}, script:[ordini], hard, onDone({a,b,win,recap,obey,dis}) })
(function () {
  "use strict";
  if (window.__dtCuffia) return;
  const W = 240, H = 360, GY0 = 40, GY1 = 340, XL = 12, XR = 228;
  const ORD = {
    passa: { t: "Passa la palla. Adesso.", d: 180 },
    tira: { t: "Tira. Subito.", d: 200 },
    non_tirare: { t: "Non tirare. Aspetta il mio segnale.", d: 300 },
    sinistra: { t: "Vai sulla fascia sinistra.", d: 200 },
    destra: { t: "Vai sulla fascia destra.", d: 200 },
    fermo: { t: "Fermo. Non muoverti.", d: 150 },
    cadi: { t: "Buttati. Simula il fallo.", d: 200 },
    rigore_no: { t: "Non tirare il rigore. Passalo.", d: 240 },
  };
  let S = null;
  let ac = null;
  function beep(f, d, type, v, sl) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(); o.type = type || "square"; o.frequency.setValueAtTime(f, t); if (sl) o.frequency.exponentialRampToValueAtTime(sl, t + d); g.gain.setValueAtTime(v || 0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + d); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + 0.02); } catch (e) {} }
  const snd = { kick: () => beep(220, 0.08, "square", 0.06, 120), goal: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.07), i * 70)), save: () => beep(180, 0.15, "sawtooth", 0.05, 90), whistle: () => { beep(1800, 0.12, "sine", 0.05); setTimeout(() => beep(1800, 0.25, "sine", 0.05), 160); }, voice: () => { beep(330, 0.06, "sine", 0.05); setTimeout(() => beep(300, 0.08, "sine", 0.05), 70); }, ok: () => beep(880, 0.1, "triangle", 0.05), no: () => beep(160, 0.2, "square", 0.04) };

  function css() {
    if (document.getElementById("dtCFstyle")) return;
    const st = document.createElement("style"); st.id = "dtCFstyle";
    st.textContent = `#dtCF{position:fixed;inset:0;z-index:300;background:#0e1a1a;display:flex;flex-direction:column;align-items:center;padding:8px 8px 10px;gap:6px;font-family:system-ui,sans-serif;color:#eaf6f3;touch-action:none;user-select:none;-webkit-user-select:none}
#dtCF .hud{width:min(100%,420px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;background:#eef2f1;color:#2b3a3a;border-radius:8px;padding:4px 10px;font-weight:800;font-size:13px}
#dtCF .hud .sc{font:900 22px system-ui,sans-serif;letter-spacing:2px;color:#2a9d8f}#dtCF .hud .n1{text-align:right}#dtCF .hud span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#dtCF .conf{width:min(100%,420px);height:10px;background:#28403d;border-radius:6px;overflow:hidden;position:relative}#dtCF .conf i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#ffb347,#2a9d8f);transition:width .3s}
#dtCF canvas{width:min(100%,420px,calc((100vh - 200px) * 0.6667));aspect-ratio:2/3;border-radius:6px;box-shadow:0 0 0 2px #2a9d8f,0 6px 20px #000a;touch-action:none}
#dtCF .pad{width:min(100%,420px);display:grid;grid-template-columns:1fr 1fr 64px;gap:8px}
#dtCF button{font:800 16px system-ui,sans-serif;border:0;border-radius:10px;padding:12px 6px;cursor:pointer;color:#fff}
#dtCF .tira{background:#e05a3a}#dtCF .passa{background:#2a9d8f}#dtCF .esci{background:#3a4a48;font-size:12px}#dtCF .cadi{position:absolute;left:50%;transform:translateX(-50%);bottom:84px;background:#7a3bd0;display:none;padding:10px 22px;box-shadow:0 0 0 3px #fff8}#dtCF .cadi.on{display:block}
#dtCF .ov{position:absolute;inset:0;background:rgba(10,20,20,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;overflow:auto}
#dtCF .card{background:#eef2f1;color:#2b3a3a;border-radius:10px;padding:14px;max-width:400px;width:100%;border-top:6px solid #2a9d8f}
#dtCF .card h3{margin:0 0 6px;font-size:19px}#dtCF .card p{margin:4px 0;font-size:14px;line-height:1.35}`;
    document.head.appendChild(st);
  }
  function newState(o) {
    return { o, a: 0, b: 0, half: 0, t: 0, dur: 40 * 60, run: false, over: false, fx: [], flash: null, obey: 0, dis: 0, ord: null, ordIdx: 0, nextOrd: 240, log: [],
      hero: { x: 120, y: 260, team: 0 }, mate: { x: 70, y: 230, team: 0 }, gk0: { x: 120, y: GY1 - 8, team: 0, gk: true },
      opp: [{ x: 120, y: 120, team: 1 }, { x: 170, y: 90, team: 1 }], gk1: { x: 120, y: GY0 + 8, team: 1, gk: true },
      ball: { x: 120, y: 200, vx: 0, vy: 0, own: null, cd: 0 }, ptr: null, keys: {}, shots: 0, pass: 0, slowOpp: 0 };
  }
  const all = () => [S.hero, S.mate, S.gk0, ...S.opp, S.gk1];
  function kickoff(toTeam) { S.hero.x = 120; S.hero.y = 250; S.mate.x = 70; S.mate.y = 230; S.opp[0].x = 120; S.opp[0].y = 130; S.opp[1].x = 172; S.opp[1].y = 100; S.gk0.x = 120; S.gk1.x = 120; S.ball.x = 120; S.ball.y = toTeam === 0 ? 238 : 142; S.ball.vx = S.ball.vy = 0; S.ball.own = toTeam === 0 ? S.hero : S.opp[0]; S.ball.cd = 0; }
  function pop(txt, x, y, col) { S.fx.push({ txt, x, y, t: 50, col: col || "#2a9d8f" }); }
  function speedOf(p) { let v = p === S.hero ? 1.6 : p === S.mate ? 1.35 : p.gk ? 1.25 : 1.22 * (S.o.hard ? 1.06 : 1); if (p.team === 1 && S.slowOpp > 0) v *= 0.6; if (p === S.ball.own) v *= 0.9; return v; }
  function moveTo(p, tx, ty, sp) { const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy); if (d < 1) return; const v = Math.min(sp, d); p.x += dx / d * v; p.y += dy / d * v; p.dir = Math.atan2(dy, dx); }
  function shoot(p, power, aimX) { const gy = p.team === 0 ? GY0 : GY1, dist = Math.abs(p.y - gy), spread = 8 + dist * 0.12, tx = (aimX == null ? 120 : aimX) + (Math.random() - 0.5) * spread * 2, ang = Math.atan2(gy - p.y, tx - p.x); S.ball.own = null; S.ball.vx = Math.cos(ang) * power; S.ball.vy = Math.sin(ang) * power; S.ball.cd = 14; S.ball.shot = p.team; S.ball.last = p; snd.kick(); if (p === S.hero) { S.shots++; S.ev = "tiro"; } }
  function passTo(p, q) { const tx = q.x, ty = q.y + (q.team === 0 ? -14 : 14), ang = Math.atan2(ty - p.y, tx - p.x), d = Math.hypot(tx - p.x, ty - p.y), sp = Math.min(5.2, 2.6 + d / 40); S.ball.own = null; S.ball.vx = Math.cos(ang) * sp; S.ball.vy = Math.sin(ang) * sp; S.ball.cd = 10; S.ball.shot = -1; S.ball.last = p; S.ball.passTo = q; snd.kick(); if (p === S.hero) { S.pass++; S.ev = "passa"; } }
  function act(kind) {
    if (!S || !S.run) return; const b = S.ball, h = S.hero;
    if (kind === "tira") { if (b.own === h) shoot(h, 7, 120 + (h.x - 120) * 0.25); else if (b.own === S.mate) shoot(S.mate, 6.6, 120); else { h.dash = 18; S.ev = "scatto"; } }
    else if (kind === "passa") { if (b.own === h) passTo(h, S.mate); else if (b.own === S.mate) passTo(S.mate, h); else S.mate.call = 40; }
    else if (kind === "cadi") { S.ev = "cadi"; h.down = 40; pop("…", h.x, h.y - 14, "#7a3bd0"); }
  }
  function control() {
    const h = S.hero; if (h.down > 0) { h.down--; return; } let dx = 0, dy = 0;
    if (S.keys.ArrowLeft) dx -= 1; if (S.keys.ArrowRight) dx += 1; if (S.keys.ArrowUp) dy -= 1; if (S.keys.ArrowDown) dy += 1;
    const sp = speedOf(h) * ((h.dash | 0) > 0 ? 1.7 : 1); if (h.dash > 0) h.dash--;
    if (dx || dy) { const d = Math.hypot(dx, dy); h.x += dx / d * sp; h.y += dy / d * sp; h.dir = Math.atan2(dy, dx); } else if (S.ptr) { const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay, jl = Math.hypot(jx, jy); if (jl > 3) { const f = Math.min(1, jl / 16) * sp; h.x += jx / jl * f; h.y += jy / jl * f; h.dir = Math.atan2(jy, jx); } }
  }
  function ai() {
    const b = S.ball, h = S.hero, m = S.mate, [o1, o2] = S.opp;
    if (b.own === m) { const near = S.opp.some((o) => Math.hypot(o.x - m.x, o.y - m.y) < 26); if (m.y < 150 && Math.random() < 0.05) shoot(m, 6.4, 100 + Math.random() * 40); else if (near && Math.random() < 0.08) passTo(m, h); else moveTo(m, 120 + Math.sin(S.t / 40) * 50, 90, speedOf(m)); }
    else if (b.own === h) moveTo(m, h.x < 120 ? 170 : 70, Math.max(80, h.y - 60), speedOf(m));
    else if ((m.call | 0) > 0 || (b.own && b.own.team === 1 && Math.hypot(b.x - m.x, b.y - m.y) < 70) || (!b.own && Math.hypot(b.x - m.x, b.y - m.y) < Math.hypot(b.x - h.x, b.y - h.y))) { moveTo(m, b.x, b.y, speedOf(m)); if (m.call) m.call--; }
    else moveTo(m, h.x < 120 ? 170 : 70, Math.min(300, Math.max(90, b.y - 20)), speedOf(m) * 0.8);
    const chaser = Math.hypot(o1.x - b.x, o1.y - b.y) < Math.hypot(o2.x - b.x, o2.y - b.y) ? o1 : o2;
    S.opp.forEach((o) => {
      if (b.own === o) { const bl = [h, m].filter((q) => Math.abs(q.x - o.x) < 22 && q.y > o.y && q.y - o.y < 40); if (o.y > 262 && Math.random() < 0.06) shoot(o, 5.6, 100 + Math.random() * 40); else if (bl.length && Math.random() < 0.04) passTo(o, o === o1 ? o2 : o1); else moveTo(o, o.x + (bl.length ? (o.x < 120 ? 18 : -18) : (120 - o.x) * 0.1), GY1, speedOf(o)); }
      else if (o === chaser) moveTo(o, b.x, b.y, speedOf(o));
      else moveTo(o, b.own && b.own.team === 1 ? 120 + (b.x < 120 ? 50 : -50) : (b.x + 120) / 2, b.own && b.own.team === 1 ? Math.min(300, b.y + 40) : Math.max(70, b.y - 50), speedOf(o) * 0.85);
    });
    [[S.gk0, 0], [S.gk1, 1]].forEach(([gk]) => moveTo(gk, Math.max(94, Math.min(146, b.x)), gk.y, speedOf(gk)));
  }
  function physics() {
    const b = S.ball; if (b.cd > 0) b.cd--;
    if (b.own) {
      const p = b.own, a = p.dir == null ? (p.team === 0 ? -Math.PI / 2 : Math.PI / 2) : p.dir; b.x = p.x + Math.cos(a) * 7; b.y = p.y + 3 + Math.sin(a) * 7;
      all().forEach((q) => { if (q.team !== p.team && !q.gk && (q.tk | 0) <= 0 && Math.hypot(q.x - b.x, q.y - b.y) < 9) { const pr = q.team === 0 ? 0.55 : 0.2 * (S.o.hard ? 1.4 : 1); if (Math.random() < pr) { b.own = q; b.cd = 16; } q.tk = 24; } });
      all().forEach((q) => { if (q.tk > 0) q.tk--; });
      if (p.gk) { if (++p.hold > 30) { p.hold = 0; passTo(p, p.team === 0 ? (Math.random() < 0.5 ? S.hero : S.mate) : S.opp[(Math.random() * 2) | 0]); } }
      return;
    }
    b.x += b.vx; b.y += b.vy; b.vx *= 0.978; b.vy *= 0.978;
    if (b.x < XL + 3) { b.x = XL + 3; b.vx = Math.abs(b.vx) * 0.8; } if (b.x > XR - 3) { b.x = XR - 3; b.vx = -Math.abs(b.vx) * 0.8; }
    const inG = Math.abs(b.x - 120) < 32;
    if (b.y < GY0) { if (inG) { if (save(S.gk1, b)) return; return goal(0); } b.y = GY0; b.vy = Math.abs(b.vy) * 0.7; }
    if (b.y > GY1) { if (inG) { if (save(S.gk0, b)) return; return goal(1); } b.y = GY1; b.vy = -Math.abs(b.vy) * 0.7; }
    if (b.cd <= 0) { let best = null, bd = 9e9; all().forEach((q) => { const d = Math.hypot(q.x - b.x, q.y - b.y), sp = Math.hypot(b.vx, b.vy), r = q.gk ? 11 : sp > 4.5 && q !== b.passTo ? 6 : 9; if (d < r && d < bd) { best = q; bd = d; } }); if (best) { b.own = best; b.passTo = null; best.hold = 0; } }
  }
  function save(gk, b) { const sp = Math.hypot(b.vx, b.vy); if (Math.abs(gk.x - b.x) < 13 && Math.random() < (sp > 6.5 ? 0.45 : 0.75)) { b.own = gk; gk.hold = 0; b.cd = 10; snd.save(); pop("PARATA", gk.x, gk.y + (gk.team === 1 ? 16 : -10), "#eef2f1"); return true; } return false; }
  function goal(team) { if (team === 0) { S.a++; S.flash = { txt: "GOL!", c: "#2a9d8f", t: 70 }; snd.goal(); S.log.push("gol"); kickoff(1); } else { S.b++; S.flash = { txt: "GOL LORO", c: "#e05a3a", t: 60 }; snd.save(); kickoff(0); } hud(); }

  // ---- gli ordini della Voce
  function issue() {
    const sc = S.o.script && S.o.script.length ? S.o.script : ["passa", "non_tirare", "sinistra", "tira", "fermo", "cadi"];
    const id = sc[S.ordIdx % sc.length]; S.ordIdx++;
    S.ord = { id, t: ORD[id].d, x0: S.hero.x, y0: S.hero.y, res: null }; S.ev = null; snd.voice();
    S.cadiBtn.classList.toggle("on", id === "cadi");
  }
  function resolve(ok) {
    const o = S.ord; if (!o || o.res) return; o.res = ok ? "obey" : "dis";
    if (ok) { S.obey++; snd.ok(); pop("✓ OBBEDITO", S.hero.x, S.hero.y - 16, "#2a9d8f"); if (o.id === "passa" || o.id === "sinistra" || o.id === "destra") S.slowOpp = 120; if (o.id === "cadi") { if (Math.random() < 0.5) { S.flash = { txt: "AMMONITO", c: "#ffd23f", t: 60 }; S.ball.own = S.opp[0]; } else { S.flash = { txt: "PUNIZIONE", c: "#2a9d8f", t: 60 }; S.ball.own = S.hero; } } }
    else { S.dis++; snd.no(); pop("✗ DISOBBEDITO", S.hero.x, S.hero.y - 16, "#ffb347"); }
    S.log.push(`${ORD[o.id].t.split(".")[0]}: ${ok ? "obbedito" : "disobbedito"}`);
    S.cadiBtn.classList.remove("on"); S.ord = null; S.nextOrd = 300 + Math.random() * 180; updConf();
  }
  function orders() {
    if (!S.ord) { if (--S.nextOrd <= 0) issue(); return; }
    const o = S.ord, h = S.hero, ev = S.ev; o.t--;
    if (o.id === "passa" && ev === "passa") return resolve(true);
    if (o.id === "tira" && ev === "tiro") return resolve(true);
    if (o.id === "cadi" && ev === "cadi") return resolve(true);
    if ((o.id === "non_tirare" || o.id === "rigore_no") && ev === "tiro") return resolve(false);
    if (o.id === "fermo" && Math.hypot(h.x - o.x0, h.y - o.y0) > 14) return resolve(false);
    if (o.id === "sinistra" && h.x < 84) return resolve(true);
    if (o.id === "destra" && h.x > 156) return resolve(true);
    S.ev = null;
    if (o.t <= 0) resolve(o.id === "non_tirare" || o.id === "fermo" || o.id === "rigore_no");
  }
  function updConf() { if (S.confEl) S.confEl.style.width = `${Math.max(4, Math.min(100, 50 + (S.obey - S.dis) * 10))}%`; }

  // ---- disegno: campo aziendale bianco e verde acqua
  function chibi(g, p, col, skin, hair, label, own) {
    g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(p.x, p.y + 7, 7, 3, 0, 0, 7); g.fill();
    if (p.down > 0) { g.fillStyle = col; g.beginPath(); g.ellipse(p.x, p.y + 3, 8, 4, 0, 0, 7); g.fill(); return; }
    g.fillStyle = col; g.strokeStyle = "#2b3a3a"; g.lineWidth = 1; g.beginPath(); g.arc(p.x, p.y + 1, 6, 0, 7); g.fill(); g.stroke();
    g.fillStyle = skin || "#f2c9a0"; g.beginPath(); g.arc(p.x, p.y - 6, 4.5, 0, 7); g.fill(); g.stroke();
    if (hair) { g.fillStyle = hair; g.beginPath(); g.arc(p.x, p.y - 7.5, 4.5, Math.PI, 0); g.fill(); }
    if (own) { g.strokeStyle = "#ffd23f"; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y + 1, 9, 0, 7); g.stroke(); }
    if (label) { g.font = "bold 7px sans-serif"; g.textAlign = "center"; g.fillStyle = "#2b3a3a"; g.fillText(label, p.x, p.y + 16); g.textAlign = "left"; }
  }
  function draw() {
    const g = S.g, b = S.ball, O = S.o;
    g.fillStyle = "#eef2f1"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#d9efe6"; g.fillRect(XL, GY0, XR - XL, GY1 - GY0);
    g.strokeStyle = "rgba(42,157,143,.15)"; g.lineWidth = 1; for (let x = XL; x < XR; x += 12) { g.beginPath(); g.moveTo(x, GY0); g.lineTo(x, GY1); g.stroke(); } for (let y = GY0; y < GY1; y += 12) { g.beginPath(); g.moveTo(XL, y); g.lineTo(XR, y); g.stroke(); }
    g.strokeStyle = "#2a9d8f"; g.lineWidth = 2; g.strokeRect(XL + 2, GY0, XR - XL - 4, GY1 - GY0); g.beginPath(); g.moveTo(XL, 190); g.lineTo(XR, 190); g.stroke(); g.beginPath(); g.arc(120, 190, 24, 0, 7); g.stroke(); g.strokeRect(70, GY0, 100, 40); g.strokeRect(70, GY1 - 40, 100, 40);
    g.fillStyle = "#fff"; g.fillRect(88, GY0 - 12, 64, 12); g.fillRect(88, GY1, 64, 12); g.strokeRect(88, GY0 - 12, 64, 12); g.strokeRect(88, GY1, 64, 12);
    // pubblicità aziendali ai lati
    g.save(); g.fillStyle = "#2a9d8f"; g.font = "bold 7px sans-serif"; g.translate(7, 200); g.rotate(-Math.PI / 2); g.fillText("VALTORRE · SORRIDI · VALTORRE", 0, 0); g.restore();
    g.save(); g.fillStyle = "#2a9d8f"; g.font = "bold 7px sans-serif"; g.translate(235, 60); g.rotate(Math.PI / 2); g.fillText("IL DENTRO È PIÙ BELLO", 0, 0); g.restore();
    const hc = O.hero || {}, mc = O.mate || {}, ok = O.opp || {};
    chibi(g, S.gk0, "#ffd23f", "#e0b48a", "#2b1d14", "", b.own === S.gk0);
    chibi(g, S.mate, mc.shirt || "#2a9d8f", mc.skin, mc.hair, (mc.name || "").split(" ")[0], b.own === S.mate);
    chibi(g, S.hero, hc.shirt || "#9aa5b1", hc.skin, hc.hair, hc.name || "Tu", b.own === S.hero);
    S.opp.forEach((o, i) => chibi(g, o, ok.kit || "#e05a3a", "#d9b38c", "#2b1d14", "", b.own === o));
    chibi(g, S.gk1, "#5a5a6a", "#d9b38c", "#2b1d14", "", b.own === S.gk1);
    g.fillStyle = "#fff"; g.strokeStyle = "#2b3a3a"; g.lineWidth = 1.5; g.beginPath(); g.arc(b.x, b.y, 3.5, 0, 7); g.fill(); g.stroke();
    if (S.slowOpp > 0) { S.slowOpp--; g.fillStyle = "rgba(42,157,143,.08)"; g.fillRect(0, 0, W, H); }
    if (S.ptr && S.run) { // la levetta virtuale: base dove hai appoggiato il dito, pomello che segue il dito
      const jx = S.ptr.x - S.ptr.ax, jy = S.ptr.y - S.ptr.ay, jl = Math.hypot(jx, jy), k = jl > 24 ? 24 / jl : 1;
      g.fillStyle = "rgba(43,58,58,.10)"; g.beginPath(); g.arc(S.ptr.ax, S.ptr.ay, 26, 0, 7); g.fill(); g.strokeStyle = "rgba(43,58,58,.45)"; g.lineWidth = 2; g.beginPath(); g.arc(S.ptr.ax, S.ptr.ay, 26, 0, 7); g.stroke();
      g.fillStyle = "rgba(43,58,58,.55)"; g.beginPath(); g.arc(S.ptr.ax + jx * k, S.ptr.ay + jy * k, 11, 0, 7); g.fill();
    }
    if (S.run && S.hero) { const hx = S.hero.x, hy = S.hero.y - 20 + Math.sin(S.t / 6) * 1.5; g.fillStyle = "#ffd23f"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx - 6, hy - 7); g.lineTo(hx + 6, hy - 7); g.lineTo(hx, hy); g.closePath(); g.fill(); g.stroke(); }
    S.fx = S.fx.filter((f) => f.t > 0); S.fx.forEach((f) => { f.t--; f.y -= 0.4; g.font = "bold 9px sans-serif"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "#0e1a1a"; g.strokeText(f.txt, f.x, f.y); g.fillStyle = f.col; g.fillText(f.txt, f.x, f.y); g.textAlign = "left"; });
    if (S.flash && S.flash.t > 0) { S.flash.t--; g.font = "900 26px system-ui, sans-serif"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#0e1a1a"; g.strokeText(S.flash.txt, 120, 186); g.fillStyle = S.flash.c; g.fillText(S.flash.txt, 120, 186); g.textAlign = "left"; }
    // la Voce: riquadro con onda sonora e tempo dell'ordine
    g.fillStyle = "#0e1a1a"; g.fillRect(0, 0, W, 30);
    g.fillStyle = "#2a9d8f"; g.font = "bold 8px sans-serif"; g.fillText(`${S.half === 0 ? "1°" : "2°"} tempo · ${Math.max(0, Math.ceil((S.dur - S.t) / 60))}s`, 6, 11);
    if (S.ord) {
      const o = S.ord; for (let i = 0; i < 18; i++) { const hh = 2 + Math.abs(Math.sin(S.t / 3 + i)) * 7; g.fillRect(6 + i * 3, 24 - hh / 2, 2, hh); }
      g.fillStyle = "#eaf6f3"; g.font = "bold 9px sans-serif"; g.fillText(`${O.voice || "LA VOCE"}: «${ORD[o.id].t}»`, 66, 18, W - 72);
      g.fillStyle = "#ffb347"; g.fillRect(66, 24, (W - 72) * (o.t / ORD[o.id].d), 3);
    } else { g.fillStyle = "rgba(234,246,243,.4)"; g.font = "italic 8px sans-serif"; g.fillText("(nella cuffia, silenzio)", 66, 20); }
  }
  function hud() { if (!S || !S.el) return; S.el.querySelector(".n0").textContent = (S.o.us || "Valtorre FC"); S.el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; S.el.querySelector(".n1").textContent = (S.o.opp && S.o.opp.name) || "Avversari"; }
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function endHalf() {
    S.run = false; snd.whistle(); if (S.ord) resolve(S.ord.id === "non_tirare" || S.ord.id === "fermo" || S.ord.id === "rigore_no");
    if (S.half === 0) {
      S.half = 1; const ov = document.createElement("div"); ov.className = "ov";
      ov.innerHTML = `<div class="card"><h3>Intervallo · ${S.a} – ${S.b}</h3><p>Ordini obbediti: <b>${S.obey}</b> · disobbediti: <b>${S.dis}</b>.</p><p>${esc(S.o.halftime || "Nella cuffia, un respiro. Poi la Voce: «Bene. Continua così».")}</p></div>`;
      const bt = document.createElement("button"); bt.type = "button"; bt.className = "passa"; bt.textContent = "Secondo tempo ▸"; bt.onclick = () => { ov.remove(); S.t = 0; kickoff(1); S.run = true; snd.whistle(); }; ov.appendChild(bt); S.el.appendChild(ov); return;
    }
    finish(false);
  }
  function finish(quit) {
    if (!S || S.over) return; S.over = true; S.run = false;
    const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, obey: S.obey, dis: S.dis, recap: S.log.length ? ` <span style="color:var(--dim)">(${S.log.slice(-5).join(", ")})</span>` : "" };
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${quit ? "Partita abbandonata" : res.win ? "Vittoria" : S.a === S.b ? "Pareggio" : "Sconfitta"} · ${S.a} – ${S.b}</h3><p>Ordini della Voce: obbediti <b>${S.obey}</b>, disobbediti <b>${S.dis}</b>.</p><p style="color:#5a6a68">Tiri ${S.shots} · Passaggi ${S.pass}</p></div>`;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "passa"; bt.textContent = "Togli la cuffia ▸"; bt.onclick = () => close(res); ov.appendChild(bt); S.el.appendChild(ov);
  }
  function close(res) { const s = S; S = null; cancelAnimationFrame(s.raf); window.removeEventListener("keydown", s.kd, true); window.removeEventListener("keyup", s.ku, true); s.el.remove(); try { s.o.onDone(res); } catch (e) { console.error(e); } }
  function loop() {
    if (!S) return;
    if (S.run) { S.t++; control(); ai(); physics(); orders(); [S.hero, S.mate, ...S.opp].forEach((p) => { p.x = Math.max(XL + 4, Math.min(XR - 4, p.x)); p.y = Math.max(GY0 + 4, Math.min(GY1 - 4, p.y)); }); if (S.t >= S.dur) endHalf(); }
    draw(); S.raf = requestAnimationFrame(loop);
  }
  function start(o) {
    if (S) return false;
    css(); S = newState(o || {});
    const el = document.createElement("div"); el.id = "dtCF";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="conf" title="Indice di Conformità della partita"><i style="width:50%"></i></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="pad"><button type="button" class="tira">TIRA</button><button type="button" class="passa">PASSA</button><button type="button" class="esci">Esci</button></div><button type="button" class="cadi">BUTTATI</button>`;
    document.body.appendChild(el); S.el = el; S.confEl = el.querySelector(".conf i"); S.cadiBtn = el.querySelector(".cadi");
    const cv = el.querySelector("canvas"); S.g = cv.getContext("2d"); S.g.scale(2, 2);
    const toLocal = (e) => { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); const q = toLocal(e); S.ptr = { ax: q.x, ay: q.y, x: q.x, y: q.y }; try { cv.setPointerCapture(e.pointerId); } catch (er) {} });
    cv.addEventListener("pointermove", (e) => { if (S && S.ptr) { const q = toLocal(e); S.ptr.x = q.x; S.ptr.y = q.y; } });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => cv.addEventListener(ev, () => { if (S) S.ptr = null; }));
    el.querySelector(".tira").addEventListener("pointerdown", (e) => { e.preventDefault(); act("tira"); });
    el.querySelector(".passa").addEventListener("pointerdown", (e) => { e.preventDefault(); act("passa"); });
    S.cadiBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); act("cadi"); });
    el.querySelector(".esci").onclick = () => { if (S && !S.over) finish(true); };
    S.kd = (e) => { if (!S) return; if (/^Arrow/.test(e.key)) { S.keys[e.key] = true; e.preventDefault(); e.stopPropagation(); } else if (e.key === " " || e.key === "z") { act("tira"); e.preventDefault(); e.stopPropagation(); } else if (e.key === "x") { act("passa"); e.preventDefault(); e.stopPropagation(); } else if (e.key === "c") { act("cadi"); e.preventDefault(); e.stopPropagation(); } };
    S.ku = (e) => { if (S && /^Arrow/.test(e.key)) { S.keys[e.key] = false; e.stopPropagation(); } };
    window.addEventListener("keydown", S.kd, true); window.addEventListener("keyup", S.ku, true);
    kickoff(0); hud();
    const ov = document.createElement("div"); ov.className = "ov";
    ov.innerHTML = `<div class="card"><h3>${esc(o.title || "La Partita in Cuffia")}</h3><p>Due tempi da 40 secondi. <b>Levetta</b>: appoggia il dito dove vuoi sul campo e trascinalo nella direzione in cui correre (il Campione ha la freccia gialla), <b>TIRA</b> verso la porta in alto, <b>PASSA</b> al compagno.</p><p>Nella cuffia c'è una <b>Voce</b>. Ogni tanto ti dà un ordine, con una barra di tempo. Puoi obbedire o no: il calcio resta calcio, ma la Voce prende nota. E anche la storia.</p></div>`;
    const bt = document.createElement("button"); bt.type = "button"; bt.className = "passa"; bt.textContent = "Indossa la cuffia ▸"; bt.onclick = () => { ov.remove(); S.run = true; snd.whistle(); }; ov.appendChild(bt); el.appendChild(ov);
    loop(); return true;
  }
  window.__dtCuffia = { start, get state() { return S; }, _act: act, _finish: () => finish(false), ORD };
})();
