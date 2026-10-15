// js/giroegol.js - «GIRO E GOL» · la partita originale di «Gran Premio del Pallone» (motore proprio, NON il kit di partita)
// Si corre su una strada in pseudo-3D (strisce di asfalto che scorrono verso di te, curve, cartelloni, scia di velocità). Il gas è
// automatico: con il dito (o ◀ ▶ / frecce) sterzi, con TURBO ⚡ scatti. In pista raccogli ⚡ (turbo) e 🎯 (mira più ferma), eviti
// i coni (rallentano) e le macchie d'olio (testacoda). Il rivale corre davanti a te: se lo superi prima del traguardo il suo contropiede
// è debole. All'ingresso dell'AREA c'è una curva-cancello: la VELOCITÀ con cui ci passi è la POTENZA del tiro. Poi tiri col mirino
// che oscilla: più potenza = portiere più lento. Ogni giro = un tiro tuo e un contropiede loro. Dopo i giri si somma: pareggio = spareggio.
// Uso: window.__giroegol.start({ title, us, usColor, hero:{ name, skin, hair }, mate:{ name }, opp:{ name, color, players:[{ name }], keeper:{ name } },
//   laps, oppStyle, tires:"grip"|"speed"|"mix", bonus:{ te }, turbi, mira, intro, winTitle, onDone })   → r.data = { giri, turbi, sorpassi, gol, parate, fuori }
(function () {
  "use strict";
  if (window.__giroegol) return;
  const W = 320, H = 200, HZ = 74, LAP = 520, ZS = 9;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const R = Math.random, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ADS = [["GOMMALUX", "#ffd23f", "#1a1a1a"], ["OLIO BULLONE", "#2a6adf", "#fff"], ["PIZZA GIRO", "#e8402a", "#fff"], ["TURBO-LATTE", "#ffffff", "#c82a6a"], ["PALLONE&CO", "#1a8a4a", "#fff"], ["VROOM BANK", "#8a3ad8", "#fff"]];
  let STATE = null;
  function start(o) {
    if (document.querySelector(".gpOv")) return false;
    o = o || {};
    const C = window.__sagaCore, cur = (C && C.cur) || { opts: { opp: 1 }, style: "" }, DF = cur.opts || { opp: 1 }, style = o.oppStyle || cur.style || "equilibrata";
    const oppK = (DF.opp > 1.05 ? 1.15 : DF.opp < 0.95 ? 0.85 : 1) * (style === "pressing" ? 1.08 : style === "difensiva" ? 0.92 : style === "contropiede" ? 1.04 : 1);
    const gk = DF.gk1 > 1.05 ? 1.2 : DF.gk1 && DF.gk1 < 0.95 ? 0.85 : 1;
    const TI = { grip: { gr: 1.35, top: 0.96, off: 0.6 }, speed: { gr: 0.9, top: 1.07, off: 1.15 }, mix: { gr: 1.1, top: 1, off: 0.9 } }[o.tires] || { gr: 1.1, top: 1, off: 0.9 };
    const usCol = o.usColor || "#2a6adf", opp = Object.assign({ name: "Avversari", color: "#d8302a", players: [], keeper: { name: "Il portiere" } }, o.opp || {});
    const hero = Object.assign({ name: "Tu", skin: "#e0ac7e", hair: "#2b1d14" }, o.hero || o.heroLook || {});
    const rivalName = (opp.players[0] && opp.players[0].name) || "Il rivale";
    const S = { o, a: 0, b: 0, lap: 0, laps: o.laps || 3, phase: "intro", over: false, fast: 1, t: 0, keys: {}, drag: null, auto: false, fx: null, shake: 0, flash: 0,
      pos: 0, x: 0, speed: 20, tur: 2 + (o.turbi | 0) + ((o.bonus || {}).te | 0 ? 1 : 0), turT: 0, spin: 0, mira: (o.mira | 0), miraL: 0, objs: [], ph: [0, 0], rv: { z: 45, x: 0, v: 31, ph: 0 }, entry: -1, passed: false, rvAhead: true,
      sh: null, trail: [], extra: 0, data: { giri: 0, turbi: 0, sorpassi: 0, gol: 0, parate: 0, fuori: 0 } };
    STATE = S; css();
    const el = document.createElement("div"); el.className = "gpOv";
    el.innerHTML = `<div class="hud"><span class="n0"></span><span class="sc"></span><span class="n1"></span></div><div class="bar"><i class="lp"></i><span class="tip"></span></div><canvas width="${W * 2}" height="${H * 2}"></canvas><div class="pad"><button type="button" class="bl">◀</button><button type="button" class="br">▶</button><button type="button" class="act">⚡ TURBO</button></div><div class="help">Trascina il dito a destra e sinistra per sterzare (o ◀ ▶). TURBO per scattare. All'ingresso dell'area, la velocità decide la potenza del tiro.</div>`;
    document.body.appendChild(el); S.el = el;
    el.querySelector(".n0").textContent = o.us || "Noi"; el.querySelector(".n1").textContent = opp.name;
    el.style.setProperty("--us", usCol); el.style.setProperty("--opp", opp.color);
    const cv = el.querySelector("canvas"), g = cv.getContext("2d"), act = el.querySelector(".act");
    function tone(f, d, type, v, slide) { try { const A = (window.__gpAC = window.__gpAC || new (window.AudioContext || window.webkitAudioContext)()), os = A.createOscillator(), gn = A.createGain(); os.type = type || "triangle"; os.frequency.value = f; if (slide) os.frequency.exponentialRampToValueAtTime(slide, A.currentTime + d); gn.gain.value = v || 0.05; gn.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + d); os.connect(gn); gn.connect(A.destination); os.start(); os.stop(A.currentTime + d); } catch (e) {} }
    const tip = (t) => { el.querySelector(".tip").innerHTML = t; };
    const fx = (text, col) => { S.fx = { text, col: col || "#ffd23f", t: 0 }; };
    // ------------------------------------------------------------ la strada
    const curveAt = (z) => { const k = S.ph, base = 1.25 * Math.sin(z / 62 + k[0]) + 0.55 * Math.sin(z / 23 + k[1]); const fin = z > LAP - 120 && z < LAP - 40 ? 1.5 * S.dirFin : 0; return clamp(base * (z > LAP - 120 ? 0.3 : 1) + fin, -1.9, 1.9); };
    function newLap() {
      S.ph = [R() * 6, R() * 6]; S.dirFin = R() < 0.5 ? -1 : 1; S.pos = 0; S.x = 0; S.speed = 22; S.spin = 0; S.entry = -1; S.entrySeen = false; S.passed = false; S.turT = 0;
      S.rv = { z: 45, x: 0, v: 31 * oppK, ph: R() * 6 }; S.rvAhead = true;
      const ob = []; for (let z = 40; z < LAP - 80; z += 26 + R() * 18) { const r = R(), lane = (R() * 1.7 - 0.85); ob.push({ z, lane, type: r < 0.3 ? "cone" : r < 0.5 ? "oil" : r < 0.82 ? "tur" : "mira" }); }
      for (let z = 20; z < LAP + 80; z += 48) ob.push({ z, lane: z % 96 < 48 ? -1.55 : 1.55, type: "ad", ad: ADS[Math.floor(z / 48 + S.lap) % ADS.length] });
      for (let z = 30; z < LAP + 80; z += 29) ob.push({ z, lane: (z % 58 < 29 ? -1 : 1) * (2.1 + (z % 7) * 0.12), type: "tree" });
      ob.push({ z: LAP - 60, lane: 0, type: "gate" }); S.objs = ob.sort((a, b) => b.z - a.z);
    }
    const objProj = (z) => { const dz = z - S.pos; if (dz < -1 || dz > 150) return null; const p = 1 / (1 + Math.max(0, dz) / ZS); if (p < 0.045) return null; return p; };
    // tabella delle linee: centro della strada e larghezza per ogni riga dello schermo
    const CX = new Float32Array(H + 2), HW = new Float32Array(H + 2), ZL = new Float32Array(H + 2);
    function road() {
      let dd = 0, acc = 0, prevDz = 0;
      for (let y = H - 1; y > HZ; y--) {
        const p = (y - HZ) / (H - HZ), dz = ZS * (1 / p - 1), step = dz - prevDz; prevDz = dz;
        dd += curveAt(S.pos + dz) * step * 0.0075; acc += dd * step * 0.05; ZL[y] = S.pos + dz;
        HW[y] = 4 + p * 118; CX[y] = W / 2 + clamp(acc, -190, 190) - S.x * HW[y] * 0.95;
      }
    }
    // ------------------------------------------------------------ disegno
    function carBack(x, y, s, col, head, ang) { // una macchinina vista da dietro; head = { skin, hair } o null (rivale)
      g.save(); g.translate(x, y); g.scale(s, s); if (ang) g.rotate(ang);
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(0, 3, 17, 4, 0, 0, 7); g.fill();
      g.fillStyle = "#151515"; g.fillRect(-17, -9, 7, 11); g.fillRect(10, -9, 7, 11);
      g.fillStyle = col; g.beginPath(); g.moveTo(-14, 1); g.lineTo(-11, -13); g.lineTo(11, -13); g.lineTo(14, 1); g.closePath(); g.fill();
      g.fillStyle = "rgba(255,255,255,.55)"; g.fillRect(-4, -13, 8, 14); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(-11, -4, 22, 3);
      if (head) { g.fillStyle = head.hair; g.beginPath(); g.arc(0, -16, 6, Math.PI, 0); g.fill(); g.fillStyle = head.skin; g.beginPath(); g.arc(0, -14, 5, 0, 7); g.fill(); g.fillStyle = head.hair; g.beginPath(); g.arc(0, -17, 5.2, Math.PI, 0); g.fill(); }
      else { g.fillStyle = "#222"; g.beginPath(); g.arc(0, -15, 5, 0, 7); g.fill(); g.fillStyle = "#ddd"; g.fillRect(-4, -16, 8, 2); }
      g.fillStyle = col; g.fillRect(-16, -17, 32, 3); g.fillStyle = "#222"; g.fillRect(-3, -17, 6, 8);
      const fl = (S.t >> 2) & 1; if (S.turT > 0) { g.fillStyle = fl ? "#ffd23f" : "#ff7a1a"; g.beginPath(); g.moveTo(-8, 1); g.lineTo(-5, 12 + fl * 4); g.lineTo(-2, 1); g.moveTo(2, 1); g.lineTo(5, 12 + fl * 4); g.lineTo(8, 1); g.fill(); }
      g.restore();
    }
    function sprite(ob) {
      const p = objProj(ob.z); if (!p) return; const y = HZ + p * (H - HZ), x = CX[Math.min(H - 1, Math.max(HZ + 1, Math.round(y)))] + ob.lane * HW[Math.min(H - 1, Math.max(HZ + 1, Math.round(y)))], s = p;
      if (ob.type === "cone") { g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(x - 7 * s, y - 1, 14 * s, 2); g.fillStyle = "#ff7a1a"; g.beginPath(); g.moveTo(x - 6 * s, y); g.lineTo(x, y - 17 * s); g.lineTo(x + 6 * s, y); g.fill(); g.fillStyle = "#fff"; g.fillRect(x - 3.5 * s, y - 9 * s, 7 * s, 3 * s); }
      else if (ob.type === "oil") { g.fillStyle = "#12121a"; g.beginPath(); g.ellipse(x, y - 1, 15 * s, 4.5 * s, 0, 0, 7); g.fill(); g.fillStyle = "rgba(120,80,255,.35)"; g.beginPath(); g.ellipse(x - 3 * s, y - 2 * s, 6 * s, 1.6 * s, 0, 0, 7); g.fill(); }
      else if (ob.type === "tur" || ob.type === "mira") { const hv = Math.sin(S.t / 8 + ob.z) * 2 * s; g.fillStyle = ob.type === "tur" ? "rgba(255,210,63,.3)" : "rgba(90,200,255,.3)"; g.beginPath(); g.arc(x, y - 11 * s + hv, 12 * s, 0, 7); g.fill(); g.fillStyle = ob.type === "tur" ? "#ffd23f" : "#5ac8ff"; g.beginPath(); g.arc(x, y - 11 * s + hv, 8 * s, 0, 7); g.fill(); g.fillStyle = "#1a1a1a"; g.font = `900 ${Math.max(5, 11 * s)}px sans-serif`; g.textAlign = "center"; g.fillText(ob.type === "tur" ? "⚡" : "◎", x, y - 7.5 * s + hv); g.textAlign = "left"; }
      else if (ob.type === "ad") { const w = 30 * s, h = 14 * s; g.fillStyle = "#2a2a33"; g.fillRect(x - 1 * s, y - h - 5 * s, 2 * s, h + 5 * s); g.fillStyle = ob.ad[1]; g.fillRect(x - w / 2, y - h - 11 * s, w, h); g.fillStyle = ob.ad[2]; g.font = `900 ${Math.max(3, 5.6 * s)}px sans-serif`; g.textAlign = "center"; g.fillText(ob.ad[0], x, y - 6.5 * s - 11 * s + h * 0.55); g.textAlign = "left"; }
      else if (ob.type === "tree") { g.fillStyle = "#4a3220"; g.fillRect(x - 1.5 * s, y - 14 * s, 3 * s, 14 * s); g.fillStyle = "#2a7a3a"; g.beginPath(); g.arc(x, y - 21 * s, 11 * s, 0, 7); g.fill(); g.fillStyle = "#3a9a4a"; g.beginPath(); g.arc(x - 3 * s, y - 24 * s, 6 * s, 0, 7); g.fill(); }
      else if (ob.type === "gate") { const hw = HW[Math.round(y)] || 40; g.fillStyle = "#2a2a33"; g.fillRect(x - hw * 1.12, y - 44 * s, 4 * s, 44 * s); g.fillRect(x + hw * 1.12 - 4 * s, y - 44 * s, 4 * s, 44 * s); g.fillStyle = "#fff"; g.fillRect(x - hw * 1.12, y - 48 * s, hw * 2.24, 11 * s); for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? "#111" : "#fff"; g.fillRect(x - hw * 1.12 + (hw * 2.24 / 12) * i, y - 48 * s + (i % 2 ? 0 : 5.5 * s), hw * 2.24 / 12, 5.5 * s); } g.fillStyle = "#d82a2a"; g.font = `900 ${Math.max(5, 9 * s)}px sans-serif`; g.textAlign = "center"; g.fillText("AREA ▸", x, y - 39 * s); g.textAlign = "left"; }
    }
    function drawRace() {
      const t = S.t; const sk = g.createLinearGradient(0, 0, 0, HZ + 6); sk.addColorStop(0, "#3a7ad8"); sk.addColorStop(1, "#bfe6ff"); g.fillStyle = sk; g.fillRect(0, 0, W, HZ + 6);
      const sh = CX[HZ + 4] - W / 2; // lo sfondo scorre con la curva lontana
      g.fillStyle = "#7a8fb0"; for (let i = 0; i < 6; i++) { const bx = ((i * 70 - sh * 0.5 + 1200) % 420) - 50; g.beginPath(); g.moveTo(bx, HZ + 2); g.lineTo(bx + 40, HZ - 22 - (i % 3) * 8); g.lineTo(bx + 80, HZ + 2); g.fill(); }
      g.fillStyle = "#4a5668"; const sx = ((-sh * 0.8 + 3000) % 460) - 40; g.fillRect(sx, HZ - 15, 90, 17); g.fillStyle = "#c8d0e0"; for (let i = 0; i < 20; i++) g.fillRect(sx + 3 + i * 4.4, HZ - 12 + (i % 3) * 4, 2, 2); g.fillStyle = usCol; g.fillRect(sx, HZ - 17, 90, 2);
      for (let y = H - 1; y > HZ; y--) {
        const z = ZL[y], band = Math.floor(z / 7) & 1, cx = CX[y], hw = HW[y];
        g.fillStyle = band ? "#2f9a3e" : "#37a846"; g.fillRect(0, y, W, 1);
        g.fillStyle = band ? "#e8e8ee" : "#c82a2a"; g.fillRect(cx - hw * 1.12, y, hw * 2.24, 1);
        g.fillStyle = band ? "#6a6a74" : "#62626c"; g.fillRect(cx - hw, y, hw * 2, 1);
        if ((Math.floor(z / 7) & 3) === 0) { g.fillStyle = "#f0f0e0"; g.fillRect(cx - hw * 0.02 - 0.4, y, hw * 0.04 + 0.8, 1); }
      }
      // sprite dal più lontano al più vicino, con il rivale al suo posto
      const list = S.objs.concat([{ z: S.rv.z, type: "rival" }]).filter((ob) => ob.z - S.pos > -2).sort((a, b) => b.z - a.z);
      list.forEach((ob) => { if (ob.type === "rival") { const p = objProj(ob.z); if (!p) return; const y = HZ + p * (H - HZ), yy = Math.round(y), x = CX[yy] + S.rv.x * HW[yy]; carBack(x, y, p * 0.9, opp.color, null); } else sprite(ob); });
      // scia di velocità
      const v = (S.speed - 30) / 30; if (v > 0.1) { g.strokeStyle = `rgba(255,255,255,${clamp(v * 0.5, 0, 0.5)})`; g.lineWidth = 1; for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.283 + t * 0.01, r0 = 60 + ((t * 5 + i * 37) % 120), r1 = r0 + 14 + v * 22; g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * r0 * 1.4, HZ + 40 + Math.sin(a) * r0 * 0.7); g.lineTo(W / 2 + Math.cos(a) * r1 * 1.4, HZ + 40 + Math.sin(a) * r1 * 0.7); g.stroke(); } }
      // la tua macchina, con la scia
      const ang = S.spin > 0 ? Math.sin(S.spin * 18) * 0.5 : clamp(((S.keys.right ? 1 : 0) - (S.keys.left ? 1 : 0) + (S.drag || 0)) * 0.1, -0.12, 0.12);
      if (S.turT > 0 || S.speed > 44) { g.fillStyle = "rgba(255,200,80,.35)"; for (let i = 0; i < 5; i++) g.fillRect(W / 2 - 16 + (i * 7), 186 + ((t * 3 + i * 9) % 14), 3, 10); }
      carBack(W / 2, 184 + Math.sin(t / 3) * (S.speed > 40 ? 0.8 : 0), 1.05, usCol, hero, ang);
      if (S.flash > 0) { g.fillStyle = `rgba(255,60,60,${S.flash / 20})`; g.fillRect(0, 0, W, H); }
      // contachilometri e potenza
      g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(6, 6, 76, 22); g.fillStyle = "#fff"; g.font = "800 9px sans-serif"; g.fillText(`${Math.round(S.speed * 4)} km/h`, 10, 16); g.fillStyle = "#333"; g.fillRect(10, 20, 68, 4); g.fillStyle = S.turT > 0 ? "#ffd23f" : "#5ac8ff"; g.fillRect(10, 20, 68 * clamp(S.speed / 62, 0, 1), 4);
      g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(W - 82, 6, 76, 22); g.fillStyle = "#fff"; g.fillText(`Giro ${S.lap + 1}/${S.laps}`, W - 78, 16); g.fillStyle = "#333"; g.fillRect(W - 78, 20, 68, 4); g.fillStyle = "#ff8a3a"; g.fillRect(W - 78, 20, 68 * clamp(S.pos / LAP, 0, 1), 4);
      const dr = S.rv.z - S.pos; g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(W / 2 - 52, 6, 104, 14); g.fillStyle = dr > 0 ? "#ffd23f" : "#8aff8a"; g.textAlign = "center"; g.fillText(dr > 0 ? `${rivalName}: ${Math.round(dr)} m avanti` : `Sei davanti di ${Math.round(-dr)} m`, W / 2, 16); g.textAlign = "left";
      if (S.mira) { g.fillStyle = "#5ac8ff"; g.fillText("◎".repeat(Math.min(S.mira, 5)), 10, 38); }
    }
    function drawShoot() {
      const sh = S.sh, t = S.t; const bgc = g.createLinearGradient(0, 0, 0, H); bgc.addColorStop(0, "#3a7ad8"); bgc.addColorStop(0.35, "#bfe6ff"); bgc.addColorStop(0.36, "#2f9a3e"); bgc.addColorStop(1, "#1f7a30"); g.fillStyle = bgc; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#2f9a3e" : "#37a846"; g.fillRect(0, 72 + i * 16 + i * i, W, 10 + i * 2); }
      g.fillStyle = "#4a5668"; g.fillRect(0, 42, W, 28); for (let i = 0; i < 70; i++) { g.fillStyle = ["#e8402a", "#ffd23f", "#fff", usCol, "#6ac8ff"][i % 5]; g.fillRect((i * 17) % 320, 46 + ((i * 7) % 20), 3, 3); } ADS.forEach((a, i) => { g.fillStyle = a[1]; g.fillRect(i * 54 + 2, 66, 50, 6); g.fillStyle = a[2]; g.font = "800 5px sans-serif"; g.fillText(a[0], i * 54 + 6, 71); });
      const gx = 160, gy = 84, gw = 104, gh = 52; // la porta
      g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(gx - gw / 2, gy, gw, gh); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 0.6; for (let i = 0; i <= 13; i++) { g.beginPath(); g.moveTo(gx - gw / 2 + i * gw / 13, gy); g.lineTo(gx - gw / 2 + i * gw / 13, gy + gh); g.stroke(); } for (let i = 0; i <= 7; i++) { g.beginPath(); g.moveTo(gx - gw / 2, gy + i * gh / 7); g.lineTo(gx + gw / 2, gy + i * gh / 7); g.stroke(); }
      g.fillStyle = "#f4f4f4"; g.fillRect(gx - gw / 2 - 3, gy - 3, gw + 6, 4); g.fillRect(gx - gw / 2 - 3, gy - 3, 4, gh + 3); g.fillRect(gx + gw / 2 - 1, gy - 3, 4, gh + 3);
      const kx = gx + sh.kx * gw / 2, ky = gy + gh - 16 + (sh.dive ? -sh.dive * 6 : 0); g.save(); g.translate(kx, ky); if (sh.dive) g.rotate(sh.kx > sh.kx0 ? 0.9 : -0.9); g.fillStyle = sh.opp ? usCol : opp.color; g.fillRect(-6, -6, 12, 16); g.fillStyle = "#e0b890"; g.beginPath(); g.arc(0, -10, 5, 0, 7); g.fill(); g.fillStyle = "#fff"; g.fillRect(-11, -4, 5, 4); g.fillRect(6, -4, 5, 4); g.restore();
      g.fillStyle = "#fff"; g.font = "700 7px sans-serif"; g.textAlign = "center"; g.fillText(sh.opp ? ((o.mate && o.mate.name) || "Il nostro portiere") : (opp.keeper.name || "Il portiere"), kx, ky + 19); g.textAlign = "left";
      if (sh.state === "aim") { const mx = gx + sh.mx * gw / 2, my = gy + gh * (0.5 + sh.my * 0.5); g.strokeStyle = "#ff3a3a"; g.lineWidth = 1.6; g.beginPath(); g.arc(mx, my, 8, 0, 7); g.moveTo(mx - 12, my); g.lineTo(mx + 12, my); g.moveTo(mx, my - 12); g.lineTo(mx, my + 12); g.stroke(); }
      const bt = sh.state === "fly" ? sh.t / 24 : 0, bx = sh.state === "aim" || sh.state === "pre" ? 160 : 160 + (gx + sh.tx * gw / 2 - 160) * bt, by = 176 + ((gy + gh * (0.5 + sh.ty * 0.5)) - 176) * bt - Math.sin(bt * Math.PI) * 14, br = 7 - 4.2 * bt;
      g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, br, 0, 7); g.fill(); g.strokeStyle = "#222"; g.lineWidth = 0.8; g.beginPath(); g.arc(bx, by, br, 0, 7); g.stroke();
      carBack(W / 2 - 54, 196, 0.7, usCol, hero, 0);
      g.fillStyle = "rgba(0,0,0,.5)"; g.fillRect(8, 8, 104, 36); g.fillStyle = "#fff"; g.font = "800 8px sans-serif"; g.fillText("POTENZA", 13, 19); g.fillStyle = "#333"; g.fillRect(13, 24, 94, 8); g.fillStyle = sh.pw > 0.7 ? "#ff5a2a" : sh.pw > 0.4 ? "#ffd23f" : "#8ac8ff"; g.fillRect(13, 24, 94 * sh.pw, 8); g.fillStyle = "#fff"; g.font = "700 7px sans-serif"; g.fillText(`${sh.opp ? "contropiede di " + rivalName : "ingresso a " + Math.round(Math.max(0, S.entrySp) * 4) + " km/h"}`, 13, 40);
    }
    function draw() {
      g.save(); g.scale(2, 2); if (S.shake > 0) g.translate((R() - 0.5) * S.shake, (R() - 0.5) * S.shake);
      if (S.phase === "shoot" || S.phase === "opp") drawShoot(); else { road(); drawRace(); }
      if (S.fx) { const f = S.fx, k = Math.min(1, f.t / 8), a = 1 - Math.max(0, f.t - 50) / 20; g.save(); g.globalAlpha = a; g.translate(W / 2, 100); g.scale(0.6 + k * 0.5, 0.6 + k * 0.5); g.rotate(-0.06); g.font = "900 34px Impact, 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 6; g.strokeStyle = "#111"; g.strokeText(f.text, 0, 0); g.fillStyle = f.col; g.fillText(f.text, 0, 0); g.restore(); }
      g.restore();
    }
    // ------------------------------------------------------------ fisica della corsa
    function autoSteer() { // pilota automatico per i test: tiene la corsia e cerca ⚡ ed evita coni e olio
      let want = -S.x * 0.9; const near = S.objs.filter((ob) => ob.z > S.pos + 2 && ob.z < S.pos + 28 && /cone|oil|tur|mira/.test(ob.type)).sort((a, b) => a.z - b.z)[0];
      if (near) { if (near.type === "tur" || near.type === "mira") want = (near.lane - S.x) * 1.6; else if (Math.abs(near.lane - S.x) < 0.45) want = (S.x >= near.lane ? 1 : -1) * 1.4; }
      want -= curveAt(S.pos + 18) * 0.9; return clamp(want, -1, 1);
    }
    function useTurbo() { if (S.phase !== "race" || S.tur <= 0 || S.turT > 0 || S.spin > 0) return false; S.tur--; S.turT = 1.7; S.data.turbi++; tone(300, 0.5, "sawtooth", 0.06, 1100); fx("TURBO!", "#ffd23f"); return true; }
    function stepRace(dt) {
      let st = (S.keys.right ? 1 : 0) - (S.keys.left ? 1 : 0); if (S.drag != null) st = S.drag; if (S.auto) st = autoSteer(); if (S.auto && S.tur > 0 && S.turT <= 0 && S.pos > 60 && S.pos < LAP - 150 && Math.abs(S.x) < 0.4 && Math.abs(curveAt(S.pos + 15)) < 0.8) useTurbo(); if (S.auto && S.pos > LAP - 190 && S.tur > 0 && S.turT <= 0 && S.rvAhead) useTurbo();
      if (S.spin > 0) { S.spin -= dt; st = 0; S.speed = Math.max(14, S.speed - 24 * dt); }
      const norm = S.speed / 50;
      S.x += st * dt * 2.25 * TI.gr * (0.55 + norm * 0.45); S.x -= curveAt(S.pos) * norm * dt * 1.05;
      const off = Math.abs(S.x) > 1.06; const maxV = (36 * TI.top) + (S.turT > 0 ? 20 : 0);
      if (S.turT > 0) S.turT -= dt;
      if (off) { S.speed -= 34 * TI.off * dt; S.speed = Math.max(15, S.speed); if (!S.offT) S.offT = 0; S.offT += dt; } else { S.speed += (maxV - S.speed) * Math.min(1, dt * (S.turT > 0 ? 3 : 1.4)); }
      if (Math.abs(S.x) > 1.65) { S.x = Math.sign(S.x) * 1.65; S.speed *= 0.93; S.shake = 4; S.flash = 6; }
      S.pos += S.speed * dt;
      S.objs.forEach((ob) => { if (ob.done || !/cone|oil|tur|mira/.test(ob.type) || Math.abs(ob.z - S.pos) > 1.6 || Math.abs(ob.lane - S.x) > 0.34) return; ob.done = true;
        if (ob.type === "cone") { S.speed *= 0.55; S.shake = 6; S.flash = 10; tone(110, 0.2, "square", 0.07); } else if (ob.type === "oil") { S.spin = 0.9; tone(500, 0.5, "sawtooth", 0.04, 120); fx("SBANDA!", "#9a8aff"); }
        else if (ob.type === "tur") { S.tur = Math.min(4, S.tur + 1); tone(880, 0.15, "triangle", 0.06); } else { S.mira = Math.min(5, S.mira + 1); tone(1200, 0.12, "triangle", 0.05); } });
      S.objs = S.objs.filter((ob) => !ob.done);
      // il rivale
      const rv = S.rv; rv.x = Math.sin(S.t / 55 + rv.ph) * 0.55; const gap = rv.z - S.pos; rv.v = 31 * oppK * (gap > 60 ? 0.9 : gap < -10 ? 1.1 : 1) * (S.pos > LAP * 0.7 ? 1.03 : 1); rv.z += rv.v * dt;
      if (S.rvAhead && gap < -2) { S.rvAhead = false; S.data.sorpassi++; fx("SORPASSO!", "#8aff8a"); tone(660, 0.2, "square", 0.05, 990); }
      if (!S.rvAhead && gap > 6) S.rvAhead = true;
      if (!S.entrySeen && S.pos >= LAP - 60) { S.entrySeen = true; S.entrySp = S.speed; const cen = Math.abs(S.x) < 1.05 ? 0 : 0.15; S.entry = clamp((S.speed - 22) / 34 - cen, 0.05, 1); fx(`${Math.round(S.speed * 4)} km/h`, S.entry > 0.7 ? "#ff6a2a" : "#ffd23f"); }
      if (S.pos >= LAP) { S.passed = S.rv.z < LAP; toShoot(false); }
      if (S.spin > 0 || S.flash > 0) S.flash = Math.max(0, S.flash - 1);
    }
    // ------------------------------------------------------------ il tiro (e il contropiede)
    function toShoot(isOpp, pw) {
      S.phase = isOpp ? "opp" : "shoot"; S.t = 0;
      const power = isOpp ? pw : clamp(S.entry < 0 ? 0.3 : S.entry, 0.05, 1);
      S.sh = { state: isOpp ? "pre" : "aim", pw: power, mx: 0, my: 0, kx: 0, kx0: 0, tx: 0, ty: 0, t: 0, dive: 0, opp: isOpp, res: "", wait: 0 };
      S.miraL = S.mira ? 1 : 0; if (S.mira && !isOpp) S.mira--;
      if (isOpp) { const base = (S.passed ? 0.2 : 0.48) * oppK / gk; S.sh.wait = 70; S.sh.gp = clamp(base, 0.1, 0.8); tip(`Contropiede di <b>${esc(rivalName)}</b>…`); }
      else tip(`Tocca <b>TIRA</b> quando il mirino è in porta, lontano dal portiere. ${S.passed ? "Hai superato il rivale!" : "Il rivale ti ha tenuto dietro."}`);
      act.textContent = isOpp ? "…" : "⚽ TIRA"; act.disabled = !!isOpp;
    }
    function stepShoot() {
      const sh = S.sh, t = S.t;
      if (sh.state === "aim") { const sp = S.miraL ? 0.045 : 0.075; sh.mx = Math.sin(t * sp * 1.7) * 1.28; sh.my = Math.sin(t * sp * 2.3 + 1) * 0.8; sh.kx = Math.sin(t * 0.02) * 0.35;
        if (S.auto && t > 24 && Math.abs(sh.mx) > 0.55 && Math.abs(sh.mx) < 0.9 && Math.abs(sh.my) < 0.85) fire(); if (t > 520) fire(); }
      else if (sh.state === "fly") { sh.t++; sh.dive = Math.min(1, sh.t / 10); sh.kx += (sh.kdest - sh.kx) * 0.22; if (sh.t >= 24) resolve(); }
      else if (sh.state === "pre") { if (--sh.wait <= 0) { sh.state = "fly"; sh.t = 0; sh.tx = (R() - 0.5) * 1.6; sh.ty = (R() - 0.5) * 1.2; sh.kdest = sh.tx + (R() - 0.5) * 0.6; sh.kx0 = sh.kx; sh.goal = R() < sh.gp; if (sh.goal) sh.kdest = sh.tx + Math.sign(R() - 0.5) * 1.2; else sh.kdest = sh.tx; tone(240, 0.3, "triangle", 0.06, 90); } }
      else if (sh.state === "show") { if (--sh.wait <= 0) afterShot(); }
    }
    function fire() {
      const sh = S.sh; if (!sh || sh.state !== "aim") return; sh.state = "fly"; sh.t = 0; sh.tx = sh.mx; sh.ty = sh.my; sh.kx0 = sh.kx; act.disabled = true;
      const inGoal = Math.abs(sh.tx) <= 1 && Math.abs(sh.ty) <= 1, pw = sh.pw;
      const err = (1.0 - 0.28 * gk) * (1 - pw * 0.62) + (S.miraL ? 0 : 0.04);   // quanto sbaglia il portiere a leggere il tiro
      const guess = sh.tx + (R() - 0.5) * 2 * err * 1.35, reach = 0.42 * (1 - pw * 0.5) * gk * (Math.abs(sh.tx) > 0.7 ? 0.6 : 1);
      sh.saved = inGoal && Math.abs(guess - sh.tx) < reach; sh.goal = inGoal && !sh.saved; sh.out = !inGoal; sh.kdest = clamp(guess, -0.9, 0.9); tone(200, 0.25, "square", 0.06, 80);
    }
    function resolve() {
      const sh = S.sh; sh.state = "show"; sh.wait = 70; S.shake = 5;
      if (sh.opp) { if (sh.goal) { S.b++; fx("GOL LORO!", "#ff6a6a"); tone(180, 0.6, "sawtooth", 0.06, 70); } else { S.data.parate++; fx("PARATA!", "#8aff8a"); tone(700, 0.2, "triangle", 0.07, 1200); } }
      else if (sh.goal) { S.a++; S.data.gol++; fx("GOL!", "#8aff8a"); tone(520, 0.12, "square", 0.06); tone(784, 0.3, "square", 0.06); tone(1046, 0.4, "triangle", 0.06); }
      else if (sh.saved) { fx("PARATA!", "#ffb06a"); tone(150, 0.25, "square", 0.06); } else { S.data.fuori++; fx("FUORI!", "#ffb06a"); tone(130, 0.3, "sawtooth", 0.05); }
      hud();
    }
    function afterShot() {
      if (!S.sh.opp) { const pw = clamp((S.passed ? 0.3 : 0.65) + (oppK - 1) * 0.5, 0.2, 0.9); return toShoot(true, pw); }
      S.data.giri++; S.lap++;
      if (S.lap < S.laps) { S.phase = "race"; newLap(); act.disabled = false; act.textContent = "⚡ TURBO"; tip(`Giro <b>${S.lap + 1}</b> di ${S.laps}: via!`); hud(); return; }
      if (S.a === S.b && S.extra < 3) { S.extra++; S.phase = "race"; newLap(); S.laps = S.lap + 1; act.disabled = false; act.textContent = "⚡ TURBO"; tip("<b>Spareggio!</b> Un giro solo: chi segna di più, vince."); hud(); return; }
      finish();
    }
    function hud() { el.querySelector(".sc").textContent = `${S.a} – ${S.b}`; el.querySelector(".lp").textContent = S.phase === "race" || S.phase === "intro" ? `Giro ${Math.min(S.lap + 1, S.laps)}/${S.laps}` : `Giro ${Math.min(S.lap + 1, S.laps)}/${S.laps}`; el.querySelector(".tip").style.opacity = 1; act.querySelector && 0; if (S.phase === "race") act.textContent = `⚡ TURBO ×${S.tur}`; }
    function step() {
      S.t++; if (S.fx) { S.fx.t++; if (S.fx.t > 70) S.fx = null; } if (S.shake > 0) S.shake -= 0.5;
      if (S.phase === "race") { stepRace(1 / 60); if (S.t % 10 === 0) hud(); } else if (S.phase === "shoot" || S.phase === "opp") stepShoot();
    }
    function loop() { if (!el.isConnected) return; for (let i = 0; i < S.fast; i++) step(); draw(); S.raf = requestAnimationFrame(loop); }
    // ------------------------------------------------------------ comandi: trascinamento, bottoni, tastiera
    const frac = (e) => { const r = cv.getBoundingClientRect(); return (e.clientX - r.left) / r.width; };
    let down = false;
    cv.addEventListener("pointerdown", (e) => { e.preventDefault(); down = true; if (S.phase === "shoot") return fire(); S.drag = clamp((frac(e) - 0.5) * 3.2, -1, 1); S.dragX0 = frac(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
    cv.addEventListener("pointermove", (e) => { if (down && S.phase === "race") S.drag = clamp((frac(e) - 0.5) * 3.2, -1, 1); });
    const rel = () => { down = false; S.drag = null; }; cv.addEventListener("pointerup", rel); cv.addEventListener("pointercancel", rel);
    const hold = (b, k) => { b.addEventListener("pointerdown", (e) => { e.preventDefault(); S.keys[k] = true; }); const u = () => { S.keys[k] = false; }; b.addEventListener("pointerup", u); b.addEventListener("pointerleave", u); b.addEventListener("pointercancel", u); };
    hold(el.querySelector(".bl"), "left"); hold(el.querySelector(".br"), "right");
    act.addEventListener("pointerdown", (e) => { e.preventDefault(); if (S.phase === "shoot") fire(); else useTurbo(); });
    const KM = { ArrowLeft: "left", ArrowRight: "right", a: "left", d: "right" };
    const kd = (e) => { if (!el.isConnected) return; if (KM[e.key]) { S.keys[KM[e.key]] = true; e.preventDefault(); } else if (e.key === " " || e.key === "ArrowUp" || e.key === "Enter") { if (S.phase === "shoot") fire(); else useTurbo(); e.preventDefault(); } };
    const ku = (e) => { if (KM[e.key]) S.keys[KM[e.key]] = false; };
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    // ------------------------------------------------------------ inizio e fine
    function card(title, html, btn, fn) { const ov = document.createElement("div"); ov.className = "ov"; ov.innerHTML = `<div class="card"><h3>${esc(title)}</h3>${html}</div>`; const b = document.createElement("button"); b.type = "button"; b.className = "goB"; b.textContent = btn; b.onclick = () => { ov.remove(); fn(); }; ov.querySelector(".card").appendChild(b); el.appendChild(ov); }
    function finish(quit) {
      if (S.over) return; S.over = true; S.phase = "over";
      const res = { a: quit ? 0 : S.a, b: quit ? Math.max(1, S.b) : S.b, win: !quit && S.a > S.b, quit: !!quit, data: Object.assign({}, S.data) };
      card(quit ? "Gara abbandonata" : res.win ? o.winTitle || "BANDIERA A SCACCHI!" : S.a === S.b ? "Pareggio" : "Sconfitta al traguardo", `<p class="big">${S.a} – ${S.b}</p><p>Giri ${S.data.giri} · gol ${S.data.gol} · parate ${S.data.parate} · sorpassi ${S.data.sorpassi} · turbo ${S.data.turbi}</p>`, "Fine partita ▸", () => { cancelAnimationFrame(S.raf); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); el.remove(); STATE = null; if (C && C.endMatch) C.endMatch(); if (o.onDone) o.onDone(res); });
    }
    S.finish = finish; S.steer = (v) => { S.drag = clamp(v, -1, 1); return true; }; S.turbo = useTurbo; S.fire = fire; S.newLap = newLap;
    S.skip = () => { if (S.phase === "race") { S.entry = 0.8; S.entrySp = 40; S.passed = true; S.pos = LAP; toShoot(false); } };
    const q = document.createElement("button"); q.type = "button"; q.className = "quit"; q.textContent = "Esci"; q.onclick = () => finish(true); el.appendChild(q);
    newLap();
    card(o.title || "Giro e Gol", `${o.intro || ""}<p>Il gas è automatico: tu <b>sterzi</b> (trascina il dito o ◀ ▶) e scatti col <b>TURBO ⚡</b>. Raccogli ⚡ e ◎, evita coni e olio, e supera il rivale.</p><p>All'<b>AREA</b> la velocità è la <b>potenza</b> del tiro: più forte, più il portiere è in ritardo. Poi tocca <b>TIRA</b> col mirino in porta. Ogni giro: un tuo tiro e un loro contropiede.</p>`, "Via! ▸", () => { S.phase = "race"; S.t = 0; tip(`Giro <b>1</b> di ${S.laps}: tieni la strada e vai!`); hud(); });
    hud(); draw(); loop();
    return true;
  }
  function css() {
    if (document.getElementById("gpCss")) return; const st = document.createElement("style"); st.id = "gpCss";
    st.textContent = `.gpOv{position:fixed;inset:0;z-index:300;background:#10121e;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 8px 12px;font-family:system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;color:#fff;overflow:auto}
.gpOv .hud{width:min(100%,460px);display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;border:2px solid #ffd23f;border-radius:12px;background:linear-gradient(#262a44,#161828);padding:4px 12px;font:800 12px system-ui;box-shadow:0 0 12px rgba(255,210,63,.3)}
.gpOv .hud .n0{color:var(--us)}.gpOv .hud .n1{text-align:right;color:var(--opp)}.gpOv .hud .sc{font:900 22px 'Courier New',monospace;color:#ffd23f}
.gpOv .bar{width:min(100%,460px);display:flex;gap:8px;align-items:center;font:600 12px system-ui}.gpOv .bar i{font-style:normal;color:#ffd23f;font-family:'Courier New',monospace;font-weight:900}.gpOv .tip{flex:1;opacity:.9}.gpOv .tip b{color:#ffd23f}
.gpOv canvas{width:min(100%,460px);height:auto;flex:none;aspect-ratio:320/200;border:2px solid #ffd23f;border-radius:14px;touch-action:none}
.gpOv .pad{width:min(100%,460px);display:grid;grid-template-columns:1fr 1fr 2.2fr;gap:8px}
.gpOv .pad button{min-height:58px;border-radius:14px;border:2px solid #ffd23f;background:#262a44;color:#fff;font:900 20px system-ui;cursor:pointer;touch-action:none}.gpOv .pad .act{font-size:15px;background:linear-gradient(#ffb02a,#e0601a)}.gpOv button:disabled{opacity:.4}
.gpOv .help{width:min(100%,460px);font-size:11px;opacity:.65}
.gpOv .quit{position:absolute;right:8px;bottom:8px;min-height:32px;font-size:11px;padding:4px 10px;border-radius:8px;border:1px solid #556;background:#161828;color:#bbb;opacity:.7}
.gpOv .ov{position:absolute;inset:0;background:rgba(10,10,24,.94);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;z-index:2}
.gpOv .card{max-width:440px;width:100%;border:3px solid #ffd23f;border-radius:16px;background:linear-gradient(#262a44,#121424);color:#fff;padding:14px;box-shadow:0 0 30px rgba(255,210,63,.25)}.gpOv .card h3{margin:0 0 8px;font:900 22px 'Courier New',monospace;color:#ffb02a}.gpOv .card p{margin:6px 0;font-size:13.5px;line-height:1.45}.gpOv .card b{color:#ffd23f}.gpOv .card .big{font:900 34px 'Courier New',monospace;color:#ffd23f}
.gpOv .card .goB{width:100%;margin-top:10px;background:linear-gradient(#ffb02a,#e0601a);color:#fff;font:900 15px system-ui;min-height:50px;border:2px solid #ffd23f;border-radius:12px}`;
    document.head.appendChild(st);
  }
  window.__giroegol = { start, LAP, get state() { return STATE; } };
})();
