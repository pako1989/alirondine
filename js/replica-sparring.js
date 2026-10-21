// js/replica-sparring.js - «DUELLO NEL CIELO» (ex Sparring Volante) · duello aereo a turni per «Eroi in Replica» (e per il cabinato in Sala Giochi)
// Il cielo ha 3 corsie (Alto, Centro, Basso). Ogni round: SCHIVATA (l'avversario carica un colpo in una corsia, che diventa ROSSA: sposta il tuo eroe in un'altra corsia prima che la barra
// si esaurisca; ogni schivata dà +1 carica ⚡) e COLPO (scegli la corsia dove colpire: più carica, più danno; l'avversario può parare una corsia: a livello 1 lo scudo si vede, a livello 2 lampeggia,
// a livello 3 è nascosto; il colpo parato vale la metà). Si perde 1 vita a ogni attacco subito. Vince chi azzera la vita dell'altro (max 8 round).
// Alla prima partita parte una spiegazione in 3 pagine con scena animata e «Prova libera» (1 round senza conseguenze); il «?» la riapre.
// Opzioni: title, level (1-3), oppName, hp (vita extra), charge (carica iniziale), tutorial (false = niente spiegazione), onDone({win, hp, foe}).
// Test: window.__sparring.state.finish(win) · .hp · .foe · .cur · .charge · .phase · pulsanti [data-d] (schiva), [data-s] (colpo), #spGo (continua).
(function () {
  "use strict";
  if (window.__sparring) return;
  const W = 380, H = 230, SS = 2, KEY = "ali-di-rondine.sparring", esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const LN = ["Alto", "Centro", "Basso"], AR = ["⬆️", "➡️", "⬇️"], LY = [62, 115, 168], PX = 92, FX = 288;
  let S = null, root = null, timer = null, cv = null, raf = 0, TUT = null, KD = null;
  const seen = () => safe(() => localStorage.getItem(KEY) === "1", false), markSeen = () => safe(() => localStorage.setItem(KEY, "1"), 0);
  function css() {
    if (document.getElementById("spCss")) return;
    const st = document.createElement("style"); st.id = "spCss";
    st.textContent = `#spOv{position:fixed;inset:0;z-index:300;background:#070d20;color:#e0efff;font-family:system-ui,sans-serif;overflow:auto;touch-action:manipulation}#spOv .wr{max-width:560px;margin:0 auto;padding:8px;display:flex;flex-direction:column;gap:7px;min-height:100%}
#spOv .top{display:flex;justify-content:space-between;align-items:center;gap:8px}#spOv h3{margin:0;font:900 17px system-ui;color:#7dd3fc}#spOv .hp{width:38px;height:38px;border-radius:50%;border:2px solid #7dd3fc;background:#12264a;color:#7dd3fc;font:900 18px system-ui;flex:none}
#spOv .hud{display:flex;align-items:center;gap:8px;background:#0c1a38;border:1px solid #2f5f9f;border-radius:10px;padding:6px 10px;font-size:12px}#spOv .hud .hr{display:flex;gap:2px;font-size:15px;flex-wrap:wrap}#spOv .hud .fb{flex:1;height:10px;border-radius:6px;background:#1a0b14;border:1px solid #7f1d1d;overflow:hidden}#spOv .hud .fb i{display:block;height:100%;background:#ef4444;transition:width .25s}#spOv .hud .ch{white-space:nowrap;font-weight:800;color:#fde047}
#spOv canvas{display:block;width:100%;height:auto;border:2px solid #2f5f9f;border-radius:12px;background:#0b1530;touch-action:none}
#spOv .bt{display:flex;gap:6px}#spOv .bt button{flex:1;min-height:58px;border-radius:12px;border:2px solid #38bdf8;background:#1e3a8a;color:#e0f2fe;font:800 14px system-ui;padding:4px}#spOv .bt button small{display:block;font-size:11px;font-weight:500;color:#bae6fd}#spOv .bt button.pw{border-color:#fbbf24;background:#7a4a10}
#spOv .lg{font-size:13px;color:#bae6fd;min-height:40px;background:#060c1c;border-radius:10px;padding:7px 10px;line-height:1.35}
#spOv .go{min-height:50px;border-radius:12px;border:2px solid #fbbf24;background:#b45309;color:#fff;font:900 16px system-ui;flex:1}
#spOv.tutOn .cv,#spOv.tutOn .bt,#spOv.tutOn .lg,#spOv.tutOn .hud{display:none}#spOv .tut{border-radius:12px;background:#0c1a38;border:1px solid #2f5f9f;display:flex;flex-direction:column;padding:12px;gap:9px}#spOv .tut h4{margin:0;font:900 16px system-ui;color:#7dd3fc}#spOv .tut p{margin:0;font-size:13px;line-height:1.4}#spOv .tut canvas{width:100%}
#spOv .tut .nv{display:flex;gap:6px;margin-top:4px}#spOv .tut .nv button{flex:1;min-height:42px;border-radius:10px;border:2px solid #38bdf8;background:#12264a;color:#fff;font:800 14px system-ui}#spOv .tut .nv .pr{background:#1e3a8a}`;
    document.head.appendChild(st);
  }
  const lv = () => Math.max(1, Math.min(3, S.o.level || 1)), foeHp = () => 9 + 4 * lv(), win = () => S.foe <= 0, lose = () => S.hp <= 0;
  const slot = () => Math.max(650, 1700 - 300 * lv());
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  // ------------------------------------------------------------ disegno
  const hash = (n) => { let h = (n * 2654435761) >>> 0; h ^= h >>> 13; return (h % 1000) / 1000; };
  function sky(g, f, demo) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0a1230"); gr.addColorStop(0.55, "#233f7a"); gr.addColorStop(0.85, "#e07a4a"); gr.addColorStop(1, "#ffb066"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * hash(i + 9)})`; g.fillRect(hash(i) * W, hash(i + 40) * 110, 1.4, 1.4); }
    g.fillStyle = "rgba(255,240,200,.9)"; g.beginPath(); g.arc(310, 40, 13, 0, 7); g.fill(); g.fillStyle = "rgba(255,240,200,.15)"; g.beginPath(); g.arc(310, 40, 26, 0, 7); g.fill();
    for (let i = 0; i < 7; i++) { const sp = 0.5 + (i % 3) * 0.45, x = (((i * 83 - f * sp) % (W + 140)) + W + 140) % (W + 140) - 70, y = 30 + (i * 37) % 150; g.fillStyle = `rgba(255,255,255,${0.1 + (i % 3) * 0.06})`; g.beginPath(); g.ellipse(x, y, 36 + (i % 3) * 12, 8 + (i % 2) * 3, 0, 0, 7); g.ellipse(x + 18, y - 4, 22, 8, 0, 0, 7); g.fill(); }
    for (let k = 0; k < 2; k++) { g.fillStyle = k ? "#1a1a38" : "#2a2748"; for (let i = 0; i < 14; i++) { const bw = 26 + hash(i + k * 20) * 24, bh = (k ? 20 : 36) + hash(i + 3 + k * 7) * 40, x = (((i * 46 - f * (0.9 + k * 1.1)) % (W + 80)) + W + 80) % (W + 80) - 40; g.fillRect(x, H - bh, bw, bh); if (!k) { g.fillStyle = "rgba(255,220,140,.55)"; for (let w = 0; w < 4; w++) g.fillRect(x + 5 + (w % 2) * 10, H - bh + 6 + Math.floor(w / 2) * 9, 4, 4); g.fillStyle = "#2a2748"; } } }
  }
  function hero(g, x, y, o) {
    const t = o.t || 0, d = o.dir || 1, bob = Math.sin(t * 0.12 + (o.ph || 0)) * 2.4; g.save(); g.translate(x, y + bob); g.scale(d * (o.s || 1), o.s || 1); if (o.hit) g.rotate(-0.3);
    const gl = g.createRadialGradient(0, 0, 3, 0, 0, 38); gl.addColorStop(0, o.glow + "88"); gl.addColorStop(1, o.glow + "00"); g.fillStyle = gl; g.beginPath(); g.arc(0, 0, 38, 0, 7); g.fill();
    g.fillStyle = o.cape; g.beginPath(); g.moveTo(-6, -7); g.quadraticCurveTo(-30 - Math.sin(t * 0.25) * 4, -8, -42, 5 + Math.sin(t * 0.3) * 4); g.quadraticCurveTo(-30, 8, -6, 8); g.closePath(); g.fill();
    g.strokeStyle = "#111"; g.lineWidth = 1.5; g.fillStyle = o.suit; g.beginPath(); g.roundRect(-14, -8, 28, 17, 8); g.fill(); g.stroke();
    g.fillStyle = o.trim; g.fillRect(-13, 1, 26, 3);
    g.strokeStyle = "#111"; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(-12, 3); g.lineTo(-26, 9 + Math.sin(t * 0.3) * 2); g.stroke(); g.strokeStyle = o.suit; g.lineWidth = 3.4; g.beginPath(); g.moveTo(-12, 3); g.lineTo(-26, 9 + Math.sin(t * 0.3) * 2); g.stroke();
    g.strokeStyle = "#111"; g.lineWidth = 5.4; g.beginPath(); g.moveTo(8, -2); g.lineTo(o.fist ? 30 : 22, o.fist ? -2 : 6); g.stroke(); g.strokeStyle = o.suit; g.lineWidth = 3.6; g.beginPath(); g.moveTo(8, -2); g.lineTo(o.fist ? 30 : 22, o.fist ? -2 : 6); g.stroke(); g.fillStyle = "#e8c8a0"; g.beginPath(); g.arc(o.fist ? 31 : 23, o.fist ? -2 : 6, 3.6, 0, 7); g.fill();
    g.save(); g.scale(d, 1); const hx = 13 * d * 0.0, hy = -17; g.beginPath(); g.arc(hx, hy, 10, 0, 7); g.clip(); if (o.img && o.img.complete && o.img.naturalWidth) g.drawImage(o.img, -10, hy - 10, 20, 20); else { g.fillStyle = "#e8c8a0"; g.fillRect(-10, hy - 10, 20, 20); g.fillStyle = o.hair || "#222"; g.fillRect(-10, hy - 10, 20, 8); g.fillStyle = "#111"; g.fillRect(2, hy - 1, 3, 3); g.fillRect(-4, hy - 1, 3, 3); } g.restore();
    g.strokeStyle = o.glow; g.lineWidth = 2.2; g.beginPath(); g.arc(0, -17, 10, 0, 7); g.stroke(); g.restore();
  }
  function scene(g, st, demo) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.clearRect(0, 0, W, H); const f = st.f; g.save(); if (st.shake > 0) g.translate((Math.random() - 0.5) * st.shake, (Math.random() - 0.5) * st.shake * 0.6);
    sky(g, f, demo);
    // corsie
    LY.forEach((y, i) => { const att = st.phase === "dodge" && st.cur === i, pulse = 0.5 + 0.5 * Math.sin(f * 0.25); g.fillStyle = att ? `rgba(239,68,68,${0.22 + 0.2 * pulse})` : (st.lane === i ? "rgba(56,189,248,.12)" : "rgba(255,255,255,.05)"); g.fillRect(0, y - 24, W, 48); g.strokeStyle = att ? "rgba(248,113,113,.8)" : "rgba(255,255,255,.14)"; g.lineWidth = 1; g.strokeRect(0.5, y - 24, W - 1, 48); g.fillStyle = att ? "#fecaca" : "rgba(255,255,255,.5)"; g.font = "800 9px system-ui"; g.textAlign = "left"; g.fillText(LN[i].toUpperCase(), 6, y - 14);
      if (att) { g.fillStyle = "rgba(252,165,165,.9)"; g.font = "900 16px system-ui"; for (let k = 0; k < 6; k++) g.fillText("◀", ((FX - 40 - k * 40 - f * 3) % 240 + 240) % 240 + 40, y + 6); } });
    // scudo dell'avversario (colpo)
    if (st.phase === "strike" && st.guard >= 0) { const vis = lv2(st) === 1 || (lv2(st) === 2 && f % 40 < 14); if (vis) { g.font = "30px serif"; g.textAlign = "center"; g.globalAlpha = 0.55 + 0.35 * Math.sin(f * 0.3); g.fillText("🛡️", FX - 36, LY[st.guard] + 11); g.globalAlpha = 1; } }
    // avversario: si piazza sulla corsia che attacca
    const fy = st.phase === "dodge" && st.cur != null ? LY[st.cur] : st.fy; st.fyc = (st.fyc == null ? fy : st.fyc) + (fy - st.fyc) * 0.18;
    let fx = FX; if (st.strikeA) { const a = st.strikeA, k = Math.min(1, a.t / 10); if (a.t > 8) fx += Math.min(14, (a.t - 8) * 3.5) * (a.t < 20 ? 1 : 0); }
    hero(g, fx, st.fyc, { dir: -1, t: f, ph: 2, suit: "#7f1d1d", cape: "#450a0a", trim: "#fca5a5", glow: "#ef4444", hair: "#111", hit: st.strikeA && st.strikeA.t > 9 && st.strikeA.t < 18, fist: st.phase === "dodge", img: st.oppImg });
    // carica del colpo avversario con anello che si chiude
    if (st.phase === "dodge" && st.cur != null && !st.over) { const k = Math.max(0, Math.min(1, 1 - (Date.now() - st.t0) / slot())), r = 8 + 14 * k; g.fillStyle = "rgba(255,90,60,.85)"; g.beginPath(); g.arc(fx - 34, st.fyc, 8 + 3 * Math.sin(f * 0.5), 0, 7); g.fill(); g.strokeStyle = k < 0.35 ? "#fff" : "#fca5a5"; g.lineWidth = 3; g.beginPath(); g.arc(fx - 34, st.fyc, 10 + 16 * k, 0, 7); g.stroke(); }
    // proiettile
    if (st.bolt) { const b = st.bolt, x = FX - 40 - b.t * 22; g.save(); const gr = g.createLinearGradient(x, 0, x + 90, 0); gr.addColorStop(0, "rgba(255,120,60,0)"); gr.addColorStop(1, "rgba(255,200,120,.95)"); g.fillStyle = gr; g.fillRect(x, LY[b.lane] - 5, 90, 10); g.fillStyle = "#fff"; g.beginPath(); g.arc(x, LY[b.lane], 8, 0, 7); g.fill(); g.restore(); }
    // eroe
    let px = PX; if (st.strikeA) { const a = st.strikeA; px = PX + (a.t < 10 ? (a.t / 10) * (FX - 70 - PX) : a.t < 18 ? FX - 70 - PX + 0 : (FX - 70 - PX) * (1 - Math.min(1, (a.t - 18) / 10))); if (a.t < 10) for (let k = 1; k < 6; k++) { g.globalAlpha = 0.5 / k; g.fillStyle = "#7dd3fc"; g.fillRect(px - k * 14, st.py - 3, 18, 6); } g.globalAlpha = 1; }
    hero(g, px, st.py, { dir: 1, t: f, ph: 0, suit: "#1e40af", cape: "#7dd3fc", trim: "#fde047", glow: "#38bdf8", hair: "#3a2a1a", hit: st.hurt > 0, fist: !!st.strikeA, img: st.heroImg, s: 1.05 });
    if (st.hurt > 0) { g.fillStyle = `rgba(255,60,60,${0.12 * st.hurt / 12})`; g.fillRect(0, 0, W, H); }
    st.parts.forEach((p) => { g.globalAlpha = Math.min(1, p.l / 12); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.s, p.s); }); g.globalAlpha = 1;
    g.font = "900 14px system-ui"; g.textAlign = "center"; st.fxs.forEach((x) => { g.globalAlpha = Math.min(1, x.l / 18); g.strokeStyle = "#000"; g.lineWidth = 3; g.fillStyle = x.c; g.strokeText(x.t, x.x, x.y - (40 - x.l) * 0.7); g.fillText(x.t, x.x, x.y - (40 - x.l) * 0.7); }); g.globalAlpha = 1;
    if (st.banner) { const k = Math.min(1, (70 - st.banner.l) / 8), a = Math.min(1, st.banner.l / 14); g.save(); g.globalAlpha = a; g.translate(W / 2, 112); g.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k); g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(-W / 2, -26, W, 52); g.font = "900 32px system-ui"; g.textAlign = "center"; g.lineWidth = 5; g.strokeStyle = "#000"; g.fillStyle = st.banner.c; g.strokeText(st.banner.t, 0, 12); g.fillText(st.banner.t, 0, 12); g.restore(); }
    g.restore();
  }
  const lv2 = (st) => Math.max(1, Math.min(3, (st.o && st.o.level) || 1));
  function burst(x, y, n, cols) { if (!S) return; for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 0.8 + Math.random() * 2.6; S.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.8, l: 22 + Math.random() * 22, c: cols[i % cols.length], s: 2 + Math.random() * 2 }); } }
  const fxAdd = (t, x, y, c) => { if (S) S.fxs.push({ t, x, y, c: c || "#fde047", l: 40 }); };
  // ------------------------------------------------------------ interfaccia
  function hud() {
    const e = root && root.querySelector(".hud"); if (!e || !S) return;
    e.innerHTML = `<span class="hr">${Array.from({ length: S.hpMax }, (_, i) => (i < S.hp ? "❤️" : "🖤")).join("")}</span><span class="fb"><i style="width:${Math.max(0, S.foe) / S.foeMax * 100}%"></i></span><span class="ch">⚡ ${S.charge} · R${Math.min(S.round, 8)}/8</span>`;
  }
  function buttons() {
    const bt = root && root.querySelector(".bt"), lg = root && root.querySelector(".lg"); if (!bt || !S) return; if (lg) lg.textContent = S.log;
    if (S.phase === "dodge") bt.innerHTML = LN.map((n, i) => `<button data-d="${i}">${AR[i]} ${n}<small>sposta qui</small></button>`).join("");
    else if (S.phase === "strike") bt.innerHTML = LN.map((n, i) => `<button data-s="${i}" class="${S.charge >= 3 ? "pw" : ""}">${AR[i]} ${n}<small>Danno ${3 * (1 + Math.min(S.charge, 3))}${S.charge >= 3 ? " ★" : ""}</small></button>`).join("");
    else if (S.phase === "wait") bt.innerHTML = "";
    else bt.innerHTML = S.practice ? `<button class="go" id="spRe">↺ Riprova</button><button class="go" id="spGo2">▶ Gioca davvero</button>` : `<button class="go" id="spGo">Continua ▸</button>`;
    bt.querySelectorAll("[data-d]").forEach((b) => (b.onclick = () => dodge(+b.dataset.d)));
    bt.querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => strike(+b.dataset.s)));
    const g = bt.querySelector("#spGo"); if (g) g.onclick = close; const re = bt.querySelector("#spRe"); if (re) re.onclick = () => restart(true); const g2 = bt.querySelector("#spGo2"); if (g2) g2.onclick = () => restart(false);
  }
  // ------------------------------------------------------------ logica (invariata nei numeri)
  function mkState(o, practice) {
    const st = { o, hp: 5 + (o.hp | 0), hpMax: 5 + (o.hp | 0), foe: 0, foeMax: 0, charge: Math.min(5, o.charge | 0), round: 1, seq: [], idx: 0, ok: 0, cur: null, phase: "dodge", log: "Il duello comincia: l'avversario carica un colpo, sposta il tuo eroe in un'altra corsia.", practice: !!practice, f: 0, lane: 1, py: LY[1], fy: LY[1], fyc: LY[1], bolt: null, fxs: [], parts: [], banner: null, shake: 0, hurt: 0, guard: -1, strikeA: null, t0: Date.now(), heroImg: o.heroId ? safe(() => { const u = window.__sogni.port(o.heroId); if (!u) return null; const i = new Image(); i.src = u; return i; }, null) : null, oppImg: o.oppId ? safe(() => { const u = window.__sogni.port(o.oppId); if (!u) return null; const i = new Image(); i.src = u; return i; }, null) : null };
    return st;
  }
  function init() { S.foe = S.foeMax = foeHp(); S.seq = Array.from({ length: 2 + lv() }, () => Math.floor(Math.random() * 3)); S.idx = 0; S.ok = 0; }
  function nextAtk() {
    if (!S) return; if (S.idx >= S.seq.length) { S.phase = "strike"; S.cur = null; S.guard = Math.random() < 0.3 + 0.1 * lv() ? Math.floor(Math.random() * 3) : -1; S.log = `Schivate: ${S.ok}/${S.seq.length}. Ora tocca a te: scegli la corsia del colpo${lv() === 1 ? " (lo scudo 🛡️ para quella corsia)" : lv() === 2 ? " (lo scudo lampeggia: attenzione)" : ""}.`; hud(); return buttons(); }
    S.cur = S.seq[S.idx]; S.phase = "dodge"; S.t0 = Date.now(); S.log = `${S.o.oppName || "Il Campione"} carica il colpo nella corsia ${LN[S.cur].toUpperCase()}: spostati altrove!`; hud(); buttons();
    stop(); timer = setTimeout(() => hit("Troppo lento: ti colpisce in pieno.", true), slot());
  }
  function hit(txt, late) {
    if (!S) return; stop(); const lane = S.lane === S.cur || late ? (late ? S.lane : S.cur) : S.cur; S.bolt = { lane: late ? S.lane : S.cur, t: 0, hit: true }; S.hp--; S.hurt = 12; S.shake = 8; burst(PX + 8, LY[S.bolt.lane], 14, ["#ff6a5a", "#ffd23f", "#fff"]); fxAdd("-1 ❤️", PX, LY[S.bolt.lane] - 22, "#f87171"); S.log = txt; S.idx++;
    if (lose()) return end(); nextAtk();
  }
  function dodge(i) {
    if (!S || S.phase !== "dodge" || S.cur == null) return; stop(); S.lane = i;
    if (i === S.cur) return hit("Sbagli corsia: ti prende al volo.");
    S.bolt = { lane: S.cur, t: 0, hit: false }; S.ok++; S.charge = Math.min(5, S.charge + 1); S.log = "Schivata! Accumuli carica ⚡."; fxAdd("SCHIVATA +⚡", PX, LY[i] - 24, "#7dd3fc"); S.idx++; nextAtk();
  }
  function strike(i) {
    if (!S || S.phase !== "strike") return; S.lane = i;
    const power = 1 + Math.min(S.charge, 3), dmg = 3 * power, guarded = S.guard === i, real = guarded ? Math.ceil(dmg / 2) : dmg;
    S.foe -= real; S.log = guarded ? `Para ${LN[i].toLowerCase()}: il colpo vale solo ${real}.` : `Colpo ${LN[i].toLowerCase()} a segno: ${real} danni.`; S.strikeA = { t: 0, lane: i }; S.charge = 0;
    const lane = i; setTimeout(() => { if (!S) return; burst(FX - 30, LY[lane], guarded ? 8 : 22, guarded ? ["#93c5fd", "#fff"] : ["#ffd23f", "#ff6a5a", "#fff"]); fxAdd(guarded ? "PARATO " + real : "-" + real, FX - 20, LY[lane] - 24, guarded ? "#93c5fd" : "#fde047"); if (S) S.shake = guarded ? 4 : 9; hud(); }, 190);
    if (win()) return end();
    S.round++; if (S.round > 8) { S.foe = Math.min(S.foe, S.hp > 2 ? 0 : S.foe); return end(); }
    if (S.practice) { S.banner = { t: "OTTIMO!", c: "#fde047", l: 70 }; S.phase = "end"; S.log = "Prova finita. Riprova quante volte vuoi, poi gioca davvero."; hud(); return buttons(); }
    S.seq = Array.from({ length: 2 + lv() }, () => Math.floor(Math.random() * 3)); S.idx = 0; S.ok = 0; S.phase = "wait"; hud(); buttons(); stop(); timer = setTimeout(() => nextAtk(), 650);
  }
  function end() {
    if (!S) return; stop(); closeTutQuiet(); const w = win(); S.phase = "end"; S.cur = null; S.banner = { t: S.practice ? (w ? "OTTIMO!" : "RIPROVA!") : w ? "VITTORIA!" : "SCONFITTA", c: w ? "#fde047" : "#f87171", l: 90 }; if (w) burst(W / 2, 80, 60, ["#fde047", "#7dd3fc", "#fff", "#f472b6"]);
    S.log = (S.log ? S.log + " " : "") + (S.practice ? "Prova finita: gioca davvero quando vuoi." : w ? "Il tuo avversario si ferma a mezz'aria e ti fa un cenno." : "Sei a terra. Il cielo, oggi, non era tuo."); hud(); buttons();
  }
  function restart(practice) { if (!S) return; stop(); const o = S.o; S = mkState(o, practice); init(); hud(); nextAtk(); }
  function close() { stop(); if (!S) return; const o = S.o, r = { win: win(), hp: S.hp, foe: Math.max(0, S.foe), a: win() ? 1 : 0, b: win() ? 0 : 1, recap: "" }; cancelAnimationFrame(raf); if (KD) { removeEventListener("keydown", KD); KD = null; } if (root) root.remove(); root = null; S = null; TUT = null; window.__sparring.state = null; if (o.onDone) o.onDone(r); }
  // ------------------------------------------------------------ spiegazione
  const PAGES = [
    { t: "1 · Schiva", demo: "dodge", p: "Il cielo ha 3 corsie. L'avversario carica un colpo in una corsia: <b style='color:#fca5a5'>la corsia diventa rossa</b> e un anello si stringe. Prima che si chiuda, tocca una corsia <b>diversa</b> per spostare il tuo eroe. Se sbagli o sei lento perdi 1 ❤️." },
    { t: "2 · Carica ⚡", demo: "charge", p: "Ogni schivata riuscita ti dà +1 ⚡ carica (fino a 5). Con più carica il tuo colpo fa più danno: da 6 a 12. A carica 3 o più il pulsante diventa dorato ★." },
    { t: "3 · Colpisci", demo: "strike", p: "Dopo gli attacchi tocca a te: scegli la corsia del colpo. L'avversario può parare una corsia con lo scudo 🛡️ (colpo dimezzato): a livello 1 lo vedi, a livello 2 lampeggia, a livello 3 è nascosto. Vince chi azzera la vita dell'altro in 8 round." },
  ];
  function demoState(kind) { const st = mkState({ level: 1 }, false); st.foeMax = st.foe = 13; st.hp = 5; if (kind === "strike") { st.phase = "strike"; st.guard = 2; } else { st.phase = "dodge"; st.cur = 1; } st.t0 = Date.now(); return st; }
  function openTut(page) {
    const wrap = root && root.querySelector(".wr"); if (!wrap) return; if (!TUT) { stop(); } root.classList.add("tutOn");
    TUT = { page: page | 0, st: null, cv: null, raf: 0 }; let el = wrap.querySelector(".tut"); if (!el) { el = document.createElement("div"); el.className = "tut"; wrap.insertBefore(el, wrap.querySelector(".cv")); }
    const pg = PAGES[TUT.page], last = TUT.page === PAGES.length - 1;
    el.innerHTML = `<h4>${pg.t}</h4><canvas width="${W * SS}" height="${H * SS}"></canvas><p>${pg.p}</p><div class="nv">${TUT.page ? `<button data-a="b">◂ Indietro</button>` : `<button data-a="x">Salta</button>`}${last ? `<button class="pr" data-a="pr">🎮 Prova libera</button><button class="pr" data-a="go">▶ Gioca</button>` : `<button class="pr" data-a="n">Avanti ▸</button>`}</div>`;
    const st = TUT.st = demoState(pg.demo), g = el.querySelector("canvas").getContext("2d"), t0 = Date.now(); TUT.cv = el.querySelector("canvas");
    const lp = () => { if (!TUT || !TUT.cv || !TUT.cv.isConnected) return; st.f++; const el2 = (Date.now() - t0) % 3600; st.t0 = Date.now() - (el2 % 1400); if (pg.demo === "dodge") { st.cur = Math.floor(el2 / 1200) % 3; st.lane = (st.cur + 1) % 3; st.py += (LY[st.lane] - st.py) * 0.15; } else if (pg.demo === "charge") { st.cur = 0; st.lane = 2; st.py += (LY[2] - st.py) * 0.15; st.charge = 1 + Math.floor(el2 / 900) % 4; } else { st.guard = 2; st.lane = 0; st.py += (LY[0] - st.py) * 0.1; } scene(g, st, pg.demo);
      if (pg.demo === "charge") { g.save(); g.setTransform(SS, 0, 0, SS, 0, 0); g.font = "900 16px system-ui"; g.textAlign = "left"; g.fillStyle = "#fde047"; g.strokeStyle = "#000"; g.lineWidth = 3; const s = "⚡".repeat(st.charge) + " carica " + st.charge + " → danno " + 3 * (1 + Math.min(st.charge, 3)); g.strokeText(s, 12, 218); g.fillText(s, 12, 218); g.restore(); }
      TUT.raf = requestAnimationFrame(lp); }; lp();
    el.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => { const a = b.dataset.a; cancelAnimationFrame(TUT.raf); if (a === "n") return openTut(TUT.page + 1); if (a === "b") return openTut(TUT.page - 1); closeTut(a === "pr"); }));
  }
  function closeTutQuiet() { const el = root && root.querySelector(".tut"); if (TUT) cancelAnimationFrame(TUT.raf); if (el) el.remove(); if (root) root.classList.remove("tutOn"); TUT = null; }
  function closeTut(practice) { closeTutQuiet(); markSeen(); if (!S || S.over) return; if (practice) restart(true); else if (S.phase === "dodge" || S.phase === "wait") { S.t0 = Date.now(); nextAtk(); } }
  // ------------------------------------------------------------ ciclo
  function loop() {
    if (!S) return; raf = requestAnimationFrame(loop); const g = cv.getContext("2d"); S.f++;
    S.parts = S.parts.filter((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; return --p.l > 0; }); S.fxs = S.fxs.filter((x) => --x.l > 0); if (S.banner && --S.banner.l <= 0) S.banner = null; if (S.shake > 0) S.shake -= 0.6; if (S.hurt > 0) S.hurt--;
    if (S.bolt && ++S.bolt.t > 18) S.bolt = null; if (S.strikeA && ++S.strikeA.t > 30) S.strikeA = null;
    S.py += (LY[S.lane] - S.py) * 0.22; S.fy = LY[1];
    scene(g, S);
  }
  function start(o) {
    css(); stop(); if (root) root.remove(); cancelAnimationFrame(raf); if (KD) removeEventListener("keydown", KD);
    root = document.createElement("div"); root.id = "spOv"; document.body.appendChild(root); S = mkState(o, false); init(); TUT = null;
    root.innerHTML = `<div class="wr"><div class="top"><h3>${esc(o.title || "Duello nel cielo")}</h3><button class="hp" aria-label="Come si gioca">?</button></div><div class="hud"></div><div class="cv"><canvas width="${W * SS}" height="${H * SS}"></canvas></div><div class="bt"></div><div class="lg"></div></div>`;
    cv = root.querySelector("canvas"); root.querySelector(".hp").onclick = () => { if (!TUT && S && S.phase !== "end") openTut(0); };
    cv.addEventListener("pointerdown", (e) => { if (!S || TUT) return; const r = cv.getBoundingClientRect(), y = (e.clientY - r.top) / r.height * H, i = y < 88 ? 0 : y < 142 ? 1 : 2; if (S.phase === "dodge") dodge(i); else if (S.phase === "strike") strike(i); });
    KD = (e) => { if (!S || TUT) return; const m = { 1: 0, 2: 1, 3: 2, ArrowUp: 0, ArrowDown: 2, ArrowRight: 1, ArrowLeft: 1 }[e.key]; if (m == null) return; if (S.phase === "dodge") dodge(m); else if (S.phase === "strike") strike(m); }; addEventListener("keydown", KD);
    window.__sparring.state = { finish: (w) => { if (!S) return; S.foe = w ? 0 : S.foe; S.hp = w ? S.hp : 0; end(); }, tut: () => !!TUT, get hp() { return S.hp; }, get foe() { return S.foe; }, get cur() { return S.cur; }, get charge() { return S.charge; }, get phase() { return S.phase; }, get practice() { return S.practice; } };
    hud(); loop(); if (o.tutorial !== false && !seen()) { openTut(0); buttons(); } else nextAtk(); return true;
  }
  window.__sparring = { start, state: null };
})();
