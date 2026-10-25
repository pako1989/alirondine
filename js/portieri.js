// js/portieri.js - «Sfida di Portieri»: duello arcade 1 contro 1 da porta a porta e Muro Infinito con le carte della Squadra dei Sogni (js/sogni.js).
// Tuffi plastici, prese perfette con contropiede, deviazioni di pugno, sponde nella Gabbia, rinvii a giro, speciali di ruolo e Super con cut-in (js/supers.js).
// Salvataggio indipendente: ali-di-rondine.portieri (nessun impatto su Storia, Carriera o saghe).
(function () {
  "use strict";
  if (window.__portieri) return;

  const KEY = "ali-di-rondine.portieri";
  const W = 360, H = 264, SS = 2;
  const LX = 22, RX = 338, GX0 = 104, GX1 = 256, Y_TOP = 38, Y_BOT = 226;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const S = () => window.__sogni;

  const ARENAS = {
    molo: { id: "molo", name: "Molo di Borgo Marino", icon: "⚓", sub: "Tavolato sul mare · brezza leggera", spdM: 1.0, wind: 0.012, wall: false, c1: "#1e5f46", c2: "#174e39", border: "#eab308", sky: "#0c2d48" },
    gabbia: { id: "gabbia", name: "Gabbia d'Asfalto", icon: "🚧", sub: "Sponde laterali rimbalzanti attive!", spdM: 1.04, wind: 0, wall: true, c1: "#27272a", c2: "#1f2937", border: "#f97316", sky: "#090d16" },
    neon: { id: "neon", name: "Cupola Neo-2099", icon: "⚡", sub: "Sintetico veloce (+12% velocità tiri)", spdM: 1.12, wind: 0, wall: false, c1: "#0f172a", c2: "#16203a", border: "#22d3ee", sky: "#050814" },
    tempio: { id: "tempio", name: "Tempio dei Numeri Uno", icon: "🏟️", sub: "Erba mondiale · riflettori d'oro", spdM: 1.06, wind: 0, wall: false, c1: "#14532d", c2: "#166534", border: "#fde047", sky: "#0a0f1d" },
  };

  const ROLE_SPEC = {
    P: ["Presa Magnetica", "Calamita i tiri tra i guanti / Rinvio rasoterra laser"],
    D: ["Muro di Granito", "Rigenera tenuta guanti e respinge con onda d'urto"],
    C: ["Foglia Morta", "Parabola a doppia curva che spiazza il rivale"],
    A: ["Volée di Fuoco", "Drop-kick bruciante da porta a porta"],
    B: ["Rimbalzo Jolly", "Traiettoria imprevedibile ad alta velocità"],
  };

  const CUP_ROUNDS = [
    { idx: 0, name: "Quarti di Finale", arena: "molo", lvl: 2, target: 4, coins: 20, boss: false },
    { idx: 1, name: "Semifinale", arena: "gabbia", lvl: 3, target: 4, coins: 35, boss: false },
    { idx: 2, name: "Finale di Coppa", arena: "neon", lvl: 4, target: 5, coins: 55, boss: false },
    { idx: 3, name: "Supercoppa · Il Muro Leggendario", arena: "tempio", lvl: 5, target: 5, coins: 110, boss: true },
  ];

  let OV = null, BACK = null, G = null, RAF = 0, PAUSE = false, AC = null;

  function load() {
    const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {};
    return {
      keeper: r.keeper || "",
      arena: ARENAS[r.arena] ? r.arena : "molo",
      cup: r.cup | 0,
      cupsWon: r.cupsWon | 0,
      wins: r.wins | 0,
      bestWall: r.bestWall | 0,
      savesTot: r.savesTot | 0,
    };
  }
  function save(r) { safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0); }

  function sfx(kind) {
    if (G && G.fast) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!AC) AC = new Ctx();
      if (AC.state === "suspended") AC.resume();
      const t = AC.currentTime;
      const tone = (f0, f1, dur, type, vol) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = type || "triangle";
        o.frequency.setValueAtTime(f0, t);
        if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
        g.gain.setValueAtTime(vol || 0.08, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(AC.destination);
        o.start(t); o.stop(t + dur + 0.01);
      };
      if (kind === "kick") tone(190, 58, 0.14, "triangle", 0.12);
      else if (kind === "catch") { tone(320, 520, 0.11, "sine", 0.11); tone(640, 880, 0.16, "triangle", 0.07); }
      else if (kind === "punch") tone(250, 120, 0.1, "square", 0.07);
      else if (kind === "post") tone(920, 420, 0.24, "sine", 0.12);
      else if (kind === "wall") tone(420, 260, 0.09, "triangle", 0.08);
      else if (kind === "goal") { tone(440, 660, 0.18, "sawtooth", 0.08); setTimeout(() => safe(() => tone(660, 880, 0.26, "triangle", 0.09)), 90); }
      else if (kind === "super") { tone(280, 920, 0.28, "sawtooth", 0.09); }
      else if (kind === "whistle") { tone(2650, 2780, 0.16, "sine", 0.06); }
    } catch (e) {}
  }

  const nameOf = (id) => safe(() => S().name(id), id);
  const IMG = {};
  function imgOf(id) {
    if (!id) return null;
    if (IMG[id] !== undefined) return IMG[id];
    const u = safe(() => S().port(id), null);
    if (!u) return (IMG[id] = null);
    const im = new Image();
    im.src = u;
    return (IMG[id] = im);
  }
  const sagaCol = (c) => safe(() => (S().SAGHE && S().SAGHE[c.saga] ? S().SAGHE[c.saga][2] : "#38bdf8"), "#38bdf8");
  const lvOf = (id) => safe(() => window.__arena.lvOf((window.__arena.load().xp[id]) | 0) - 1, 0);

  function availableCards() {
    if (!S()) return { list: [], loan: false };
    safe(() => S().sync && S().sync(), 0);
    const ownIds = safe(() => S()._load().own, []) || [];
    let list = ownIds.map((id) => S().BY[id]).filter(Boolean);
    let loan = false;
    if (!list.length) {
      loan = true;
      list = ["mattia", "baciccia", "nico"].map((id) => S().BY[id]).filter(Boolean);
      if (!list.length && S().CARDS && S().CARDS.length) list = S().CARDS.slice(0, 3);
    }
    list.sort((a, b) => {
      const pa = a.role === "P" ? 1 : 0, pb = b.role === "P" ? 1 : 0;
      if (pa !== pb) return pb - pa;
      const ea = safe(() => S().eff(a), a), eb = safe(() => S().eff(b), b);
      return (eb.df * 1.3 + eb.te + eb.at) - (ea.df * 1.3 + ea.te + ea.at);
    });
    return { list, loan };
  }

  function mkK(card, side, opts) {
    opts = opts || {};
    const c = card || { id: side ? "rivale" : "mattia", saga: "borgo", role: "P", at: 60, df: 80, te: 70 };
    const e = safe(() => S().eff(c), c) || c;
    const lv = opts.lv || 0;
    const mult = (1 + lv * 0.03 + (opts.m || 0));
    const isP = c.role === "P";
    const specM = isP ? 1.18 : 1.0;
    const role = ROLE_SPEC[c.role] ? c.role : "P";
    const baseCol = sagaCol(c);
    // Garantisce colori maglia ben distinti tra giocatore e rivale
    const kitCol = side === 0 ? "#10b981" : (baseCol.toLowerCase() === "#10b981" || baseCol.toLowerCase() === "#22c55e" ? "#ef4444" : "#e11d48");
    const accCol = side === 0 ? "#ffd23f" : "#fb923c";
    const sg = safe(() => window.__supers && window.__supers.of(c.id), null) || { fx: "fire", name: "Tiro Fuoco", col: "#ff8a30", saga: "" };
    return {
      id: c.id,
      n: opts.customName || nameOf(c.id),
      saga: c.saga || "borgo",
      role,
      isP,
      side,
      x: W / 2,
      y: side === 0 ? Y_BOT - 8 : Y_TOP + 8,
      vx: 0,
      at: e.at * mult,
      df: e.df * mult,
      te: e.te * mult,
      spd: clamp((2.55 + e.te * 0.022) * (opts.spdM || 1), 2.4, 5.2),
      reachStand: (18 + e.df * 0.07) * specM,
      reachDive: (30 + e.df * 0.14) * specM,
      diveSpd: (5.0 + e.df * 0.022) * (isP ? 1.1 : 1),
      pow: clamp((5.1 + e.at * 0.032) * (opts.powM || 1), 5.0, 9.2),
      spinM: 0.72 + e.te * 0.011,
      parryWin: Math.round((11 + e.te * 0.06) * (isP ? 1.2 : 1)),
      grip: 100,
      gripMax: Math.round(100 * (c.role === "D" ? 1.25 : isP ? 1.15 : 1)),
      meter: opts.startMeter || 0,
      st: "idle",
      t: 0,
      diveDir: 0,
      parry: 0,
      superGuard: 0,
      magnet: 0,
      counter: 0,
      ice: 0,
      aim: 0,
      holdT: 0,
      charge: 0,
      ai: opts.ai || 0,
      aiTargetX: W / 2,
      aiReact: 0,
      aiFeint: 0,
      kitCol,
      accCol,
      col: baseCol,
      sg,
      boss: !!opts.boss,
      saves: 0,
      perfects: 0,
    };
  }

  function css() {
    if (document.getElementById("gkCss")) return;
    const st = document.createElement("style");
    st.id = "gkCss";
    st.textContent = `
.gkOv{position:fixed;inset:0;z-index:9200;background:rgba(7,10,20,.96);color:#f4f0e4;display:flex;flex-direction:column;align-items:center;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:system-ui,-apple-system,sans-serif}
.gkOv .wrap{width:100%;max-width:480px;padding:10px 10px 20px;box-sizing:border-box}
.gkOv .bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:8px;border-bottom:1px solid #2b3554;margin-bottom:8px}
.gkOv .bar h2{margin:0;font:900 17px system-ui;color:#ffd23f;letter-spacing:.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gkOv .bar .x{min-width:34px;height:34px;border-radius:9px;border:1px solid #475569;background:#161e31;color:#cbd5e1;font:700 20px/1 system-ui;cursor:pointer;flex:none;touch-action:manipulation}
.gkOv .sum{font-size:12px;line-height:1.42;color:#cbd5e1;margin:6px 0}
.gkOv .sec{font:800 11px system-ui;text-transform:uppercase;letter-spacing:.6px;color:#7dd3fc;margin:10px 0 5px;display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap}
.gkHeroCard{display:flex;align-items:center;gap:10px;background:linear-gradient(145deg,#112236,#18132c);border:1.5px solid #38bdf8;border-radius:12px;padding:8px 10px;margin:6px 0}
.gkHeroAv{width:54px;height:54px;border-radius:12px;overflow:hidden;border:2px solid #ffd23f;background:#090d16;flex:none;display:flex;align-items:center;justify-content:center;font:900 22px system-ui}
.gkHeroAv img{width:100%;height:100%;object-fit:cover}
.gkHeroMeta{flex:1;min-width:0}
.gkHeroMeta b{display:block;font-size:14px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.gkHeroMeta .sub{font-size:11px;color:#bae6fd;margin-top:1px}
.gkHeroStats{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;font-size:10px}
.gkHeroStats span{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.14);border-radius:6px;padding:1px 5px;color:#fde047;font-weight:700}
.gkPick{display:grid;grid-template-columns:repeat(auto-fill,minmax(68px,1fr));gap:6px;max-height:168px;overflow-y:auto;padding:4px;background:#0b1120;border:1px solid #1e293b;border-radius:10px}
.gkPick .c{position:relative;background:#151d30;border:1.5px solid #334155;border-radius:9px;padding:4px 3px;text-align:center;cursor:pointer;font-size:9.5px;color:#e2e8f0;user-select:none}
.gkPick .c.sel{border-color:#ffd23f;background:#1e2946;box-shadow:0 0 10px rgba(255,210,63,.35)}
.gkPick .c img{width:40px;height:40px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 3px;background:#090d16}
.gkPick .c .ph{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 3px;background:#090d16;font-weight:900;color:#64748b}
.gkPick .c .pTag{position:absolute;top:2px;right:2px;background:#10b981;color:#042f2e;font:900 8px system-ui;padding:1px 3px;border-radius:4px}
.gkPick .c .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}
.gkArenaRow{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin:6px 0}
.gkArenaBtn{background:#131b2e;border:1.5px solid #334155;border-radius:9px;padding:6px 7px;color:#e2e8f0;text-align:left;cursor:pointer;font:700 11.5px system-ui}
.gkArenaBtn.on{border-color:#38bdf8;background:#132a42;box-shadow:0 0 10px rgba(56,189,248,.25)}
.gkArenaBtn small{display:block;font-weight:400;font-size:10px;color:#94a3b8;margin-top:2px}
.gkOv .one{width:100%;display:block;text-align:left;background:linear-gradient(145deg,#182036,#121728);border:1.5px solid #3b496e;border-radius:11px;padding:9px 11px;margin:6px 0;color:#f8fafc;font:800 13.5px system-ui;cursor:pointer;touch-action:manipulation;box-sizing:border-box}
.gkOv .one small{display:block;font-weight:400;font-size:11px;color:#94a3b8;margin-top:2px}
.gkOv .one.cupBtn{border-color:#ffd23f;background:linear-gradient(135deg,#2a2110,#1c1632)}
.gkOv .one.wallBtn{border-color:#34d399;background:linear-gradient(135deg,#0f2922,#141b30)}
.gkHud{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:4px;background:#0d1424;border:1px solid #263452;border-radius:10px;padding:5px 7px;margin-bottom:6px;font-size:11px}
.gkHudSide{min-width:0}
.gkHudSide.r{text-align:right}
.gkHudSide .nm{font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#f8fafc;font-size:11px}
.gkBars{display:flex;flex-direction:column;gap:3px;margin-top:2px}
.gkBar{height:5px;background:#060913;border-radius:3px;overflow:hidden;border:1px solid #1e293b}
.gkBar i{display:block;height:100%;transition:width .1s}
.gkBar.mp i{background:linear-gradient(90deg,#38bdf8,#ffd23f)}
.gkBar.gr i{background:linear-gradient(90deg,#10b981,#34d399)}
.gkScore{font:900 18px ui-monospace,monospace;color:#ffd23f;background:#070b14;border:1.5px solid #334155;border-radius:8px;padding:2px 8px;text-align:center;line-height:1.15}
.gkScore small{display:block;font:700 9px system-ui;color:#94a3b8;letter-spacing:.3px}
.gkStage{position:relative;width:100%;display:flex;justify-content:center}
.gkStage canvas{width:100%;max-width:440px;height:auto!important;flex:none!important;aspect-ratio:360/264;display:block;border-radius:12px;border:2px solid #2d3e5e;background:#08111e;touch-action:none;user-select:none;-webkit-user-select:none}
.gkPad{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;width:100%;box-sizing:border-box}
.gkBtns{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:6px;min-width:0}
.gkBtn{min-height:48px;border-radius:11px;border:2px solid #475569;background:#172036;color:#f8fafc;font:900 12px system-ui;padding:4px 5px;cursor:pointer;touch-action:manipulation;user-select:none;-webkit-user-select:none;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15}
.gkBtn small{font:600 9.5px system-ui;color:#cbd5e1;margin-top:2px}
.gkBtn:active,.gkBtn.act{transform:scale(.95)}
.gkBtn.bA{border-color:#34d399;background:linear-gradient(160deg,#0f382a,#10232e)}
.gkBtn.bB{border-color:#38bdf8;background:linear-gradient(160deg,#102c44,#141d34)}
.gkBtn.bS{border-color:#a855f7;background:linear-gradient(160deg,#2d1646,#18132c);opacity:.55}
.gkBtn.bS.rdy{opacity:1;box-shadow:0 0 10px rgba(168,85,247,.45)}
.gkBtn.bX{border-color:#ffd23f;background:linear-gradient(160deg,#422c0c,#23172c);opacity:.48}
.gkBtn.bX.rdy{opacity:1;box-shadow:0 0 14px rgba(255,210,63,.55)}
.gkHint{font-size:10px;color:#94a3b8;text-align:center;margin-top:6px;line-height:1.3}
.gkRes{text-align:center;background:linear-gradient(160deg,#162038,#0f1526);border:1.5px solid #38bdf8;border-radius:14px;padding:14px 10px;margin:8px 0}
.gkRes h3{margin:0 0 6px;font:900 22px system-ui;color:#ffd23f}
.gkCut{position:fixed;left:0;right:0;top:26%;z-index:9500;pointer-events:none;display:flex;justify-content:center;padding:0 12px;animation:gkCutIn .88s forwards}
.gkCutBox{display:flex;align-items:center;gap:10px;width:100%;max-width:400px;background:linear-gradient(135deg,#090d1a,#24143c);border:2.5px solid var(--cc,#ffd23f);border-radius:14px;padding:8px 12px;box-shadow:0 10px 30px rgba(0,0,0,.85),0 0 22px var(--cc,#ffd23f)}
.gkCutBox img{width:54px;height:54px;border-radius:50%;border:2px solid #fff;object-fit:cover;background:#000;flex:none}
.gkCutBox .t1{font:900 10px ui-monospace,monospace;letter-spacing:1px;color:#fde047}
.gkCutBox .t2{font:900 16px system-ui;color:#fff;margin-top:1px}
.gkCutBox .t3{font:700 11px system-ui;color:#bae6fd}
@keyframes gkCutIn{0%{opacity:0;transform:scale(.82) translateX(-24px)}16%{opacity:1;transform:none}82%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-10px)}}
@media (max-width:345px){
  .gkOv .wrap{padding:7px 6px 14px}
  .gkOv .bar h2{font-size:15px}
  .gkBtn{min-height:44px;font-size:11px;padding:3px}
  .gkBtn small{font-size:8.5px}
  .gkScore{font-size:15px;padding:2px 6px}
}
@media (prefers-reduced-motion:reduce){.gkCut{animation:none!important}}`;
    document.head.appendChild(st);
  }

  function stopLoop() {
    if (RAF) { cancelAnimationFrame(RAF); RAF = 0; }
    if (G && G.keyFn) { window.removeEventListener("keydown", G.keyFn); window.removeEventListener("keyup", G.keyFnUp); G.keyFn = null; }
  }

  function close() {
    stopLoop();
    document.querySelectorAll(".gkCut").forEach((el) => el.remove());
    G = null;
    if (OV) { OV.remove(); OV = null; }
  }

  function shell(title, onX) {
    css();
    stopLoop();
    document.querySelectorAll(".gkCut").forEach((el) => el.remove());
    if (OV) OV.remove();
    OV = document.createElement("div");
    OV.className = "gkOv";
    OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">&times;</button></div><div class="body"></div></div>`;
    OV.querySelector(".x").onclick = () => {
      if (typeof onX === "function") return onX();
      const b = BACK;
      close();
      if (typeof b === "function") b();
    };
    document.body.appendChild(OV);
    return OV.querySelector(".body");
  }

  function showCutin(k, label, sub) {
    if (!G || G.fast) return;
    document.querySelectorAll(".gkCut").forEach((el) => el.remove());
    const d = document.createElement("div");
    d.className = "gkCut";
    const u = safe(() => S().port(k.id), null);
    d.innerHTML = `<div class="gkCutBox" style="--cc:${esc(k.sg.col || "#ffd23f")}">${u ? `<img alt="" src="${u}">` : ""}<div style="min-width:0"><div class="t1">${esc(sub || "GUANTO D'ORO")}</div><div class="t2">${esc(label)}</div><div class="t3">${esc(k.n)}</div></div></div>`;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }

  function spark(x, y, col, n, big) {
    if (!G || G.fast) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = (big ? 2.8 : 1.7) * (0.4 + Math.random());
      G.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, l: 14 + ((Math.random() * 12) | 0), c: col, r: big ? 2.6 : 1.7 });
    }
  }
  function popTxt(x, y, t, c) {
    if (!G || G.fast) return;
    G.pops.push({ x: clamp(x, 44, W - 44), y: clamp(y, 24, H - 20), t, c: c || "#ffd23f", l: 38 });
  }

  function giveBall(k) {
    if (!G) return;
    G.holder = k;
    k.holdT = 0;
    k.st = "hold";
    k.vx = 0;
    k.diveDir = 0;
    G.ball.vx = 0;
    G.ball.vy = 0;
    G.ball.spin = 0;
    G.ball.fx = "";
    G.ball.super = false;
    G.ball.unblock = false;
    G.ball.gripDmg = 18;
    G.ball.stall = 0;
    G.ball.x = k.x;
    G.ball.y = k.side === 0 ? k.y - 10 : k.y + 10;
    G.ball.trail = [];
  }

  function spawnWallShot() {
    if (!G) return;
    G.holder = null;
    const wv = G.wave || 1;
    const pool = S() && S().CARDS && S().CARDS.length ? S().CARDS : [{ id: "leo", saga: "borgo", at: 85, df: 65, te: 85, role: "A" }];
    const pick = pool[(wv * 7 + G.shotsFaced * 3) % pool.length];
    G.e.id = pick.id;
    G.e.n = nameOf(pick.id);
    G.e.sg = safe(() => window.__supers.of(pick.id), G.e.sg);
    const sx = clamp(W / 2 + (Math.sin(wv * 1.9 + G.shotsFaced) * 74), GX0 - 12, GX1 + 12);
    G.e.x = sx;
    G.e.st = "idle";
    G.ball.x = sx;
    G.ball.y = Y_TOP + 16;
    const targetX = clamp(GX0 + 14 + ((wv * 37 + G.shotsFaced * 53) % (GX1 - GX0 - 28)), GX0 + 10, GX1 - 10);
    const baseSpd = clamp(4.8 + wv * 0.24, 4.8, 8.6) * G.arena.spdM;
    const dx = targetX - sx, dy = Y_BOT - G.ball.y;
    const dist = Math.hypot(dx, dy) || 1;
    G.ball.vx = (dx / dist) * baseSpd;
    G.ball.vy = (dy / dist) * baseSpd;
    G.ball.spin = wv >= 3 ? ((wv % 2 === 0 ? 1 : -1) * clamp(0.03 + wv * 0.006, 0.03, 0.11)) : 0;
    G.ball.fx = "";
    G.ball.super = false;
    G.ball.col = "#ffffff";
    G.ball.gripDmg = 18 + Math.min(35, wv * 2);
    if (wv >= 5 && wv % 3 === 0) {
      const fxs = ["curve", "fire", "zig", "spiral", "vanish", "change", "thunder"];
      G.ball.fx = fxs[(wv / 3 | 0) % fxs.length];
      G.ball.super = true;
      G.ball.col = G.e.sg.col || "#ff8a30";
      popTxt(W / 2, Y_TOP + 26, `🔥 ${G.e.sg.name}!`, G.ball.col);
      sfx("super");
    } else {
      sfx("kick");
    }
    G.ball.owner = 1;
    G.ball.baseSpd = baseSpd;
    G.ball.age = 0;
    G.ball.stall = 0;
    G.ball.trail = [];
    G.shotsFaced++;
    G.wallDelay = 0;
  }

  function shootBall(k, kind, aimOverride) {
    if (!G || G.over || G.holder !== k) return false;
    const aim = aimOverride != null ? clamp(aimOverride, -1, 1) : clamp(k.aim, -1, 1);
    let spd = k.pow * G.arena.spdM * (k.counter ? 1.22 : 1);
    let spin = 0, fx = "", isSup = false, gripDmg = 24, col = "#ffffff";

    if (kind === "super" && k.meter >= 100) {
      k.meter = 0;
      isSup = true;
      fx = k.sg.fx || "fire";
      col = k.sg.col || "#ffd23f";
      spd *= fx === "thunder" ? 1.38 : fx === "change" ? 0.92 : 1.26;
      gripDmg = fx === "drill" ? 80 : 58;
      if (fx === "curve") spin = (aim >= 0 ? -1 : 1) * 0.14;
      if (fx === "spiral") spin = (aim >= 0 ? 1 : -1) * 0.1;
      showCutin(k, k.sg.name, "SUPER RINVIO DA PORTA A PORTA");
      sfx("super");
    } else if (kind === "spec" && k.meter >= 50) {
      k.meter -= 50;
      col = "#c084fc";
      if (k.role === "P") { spd *= 1.28; fx = "laser"; gripDmg = 40; popTxt(k.x, k.y, "⚡ RINVIO LASER!", "#34d399"); }
      else if (k.role === "D") { spd *= 1.18; gripDmg = 55; k.grip = k.gripMax; popTxt(k.x, k.y, "🛡️ BORDATA GRANITO!", "#60a5fa"); }
      else if (k.role === "C") { spd *= 1.1; fx = "scurve"; spin = (aim >= 0 ? 1 : -1) * 0.12; popTxt(k.x, k.y, "🌀 FOGLIA MORTA!", "#c084fc"); }
      else { spd *= 1.3; fx = "fire"; gripDmg = 48; col = "#fb923c"; popTxt(k.x, k.y, "🔥 VOLÉE DI FUOCO!", "#fb923c"); }
      sfx("super");
    } else if (kind === "curve") {
      spd *= 0.92;
      const dir = aim === 0 ? (k.x > W / 2 ? -1 : 1) : (aim > 0 ? -1 : 1);
      spin = dir * 0.095 * k.spinM;
      col = "#7dd3fc";
      gripDmg = 20;
      sfx("kick");
    } else {
      const chg = 1 + clamp(k.charge, 0, 24) / 120;
      spd *= chg;
      gripDmg = Math.round(28 * chg);
      col = k.counter ? "#fde047" : "#ffffff";
      sfx("kick");
    }

    k.counter = 0;
    k.charge = 0;
    G.holder = null;
    k.st = "idle";
    k.t = 0;

    const targetY = k.side === 0 ? Y_TOP : Y_BOT;
    let targetX = W / 2 + aim * ((GX1 - GX0) * 0.47);
    if (G.arena.wall && kind === "curve" && Math.abs(aim) > 0.72) {
      // Mira di sponda nella Gabbia!
      targetX = aim > 0 ? RX + 42 : LX - 42;
    }
    const sx = k.x, sy = k.side === 0 ? k.y - 12 : k.y + 12;
    const dx = targetX - sx, dy = targetY - sy;
    const dist = Math.hypot(dx, dy) || 1;
    G.ball.x = sx;
    G.ball.y = sy;
    G.ball.vx = (dx / dist) * spd;
    G.ball.vy = (dy / dist) * spd;
    G.ball.baseSpd = spd;
    G.ball.spin = spin;
    G.ball.fx = fx;
    G.ball.super = isSup;
    G.ball.col = col;
    G.ball.gripDmg = gripDmg;
    G.ball.owner = k.side;
    G.ball.age = 0;
    G.ball.stall = 0;
    G.ball.trail = [];
    G.e.aiReact = Math.max(2, 16 - G.e.ai * 3);
    spark(sx, sy, col, isSup ? 14 : 6, isSup);
    return true;
  }

  function dive(k, dir, kind) {
    if (!G || G.over) return false;
    if (G.holder === k) return shootBall(k, kind || "power");
    if (kind === "super" && k.meter >= 100) {
      k.meter = 0;
      k.superGuard = 68;
      k.grip = k.gripMax;
      k.parry = 30;
      showCutin(k, "🧤 SARACINESCA D'ORO!", "SUPER PARATA TOTALE");
      sfx("super");
      spark(k.x, k.y, "#ffd23f", 16, true);
      return true;
    }
    if (kind === "spec" && k.meter >= 50) {
      k.meter -= 50;
      k.magnet = 52;
      k.parry = 24;
      k.grip = Math.min(k.gripMax, k.grip + 45);
      popTxt(k.x, k.y + (k.side === 0 ? -16 : 16), k.role === "P" ? "🧤 PRESA MAGNETICA!" : "🛡️ MURO ATTIVO!", "#c084fc");
      sfx("catch");
      return true;
    }
    if (k.st === "dive" || k.st === "stun") return false;
    if (kind === "feint") {
      k.vx = (dir || (k.x < W / 2 ? 1 : -1)) * k.spd * 1.9;
      k.st = "move";
      k.t = 8;
      if (G.holder === G.e) G.e.aiFeint = 25;
      popTxt(k.x, k.y - 14, "👟 FINTA!", "#7dd3fc");
      return true;
    }
    let d = dir;
    if (d == null) {
      if (G.ball && ((k.side === 0 && G.ball.vy > 0) || (k.side === 1 && G.ball.vy < 0))) {
        const dx = G.ball.x - k.x;
        d = Math.abs(dx) < 15 ? 0 : dx > 0 ? 1 : -1;
      } else d = 0;
    }
    k.st = "dive";
    k.t = 0;
    k.diveDir = d;
    k.parry = k.parryWin;
    k.vx = d * k.diveSpd * (k.ice > 0 ? 0.65 : 1);
    spark(k.x, k.y, "#ffffff88", 5, false);
    return true;
  }

  function press(btn, down) {
    if (!G) return;
    G.inp[btn] = down ? 1 : 0;
    if (!down) {
      if (btn === "a" && G.holder === G.p && G.p.charge > 0) shootBall(G.p, "power");
      return;
    }
    const dir = G.inp.r ? 1 : G.inp.l ? -1 : G.stk && Math.abs(G.stk.v.x) > 0.22 ? (G.stk.v.x > 0 ? 1 : -1) : null;
    if (G.holder === G.p) {
      if (btn === "b") shootBall(G.p, "curve");
      else if (btn === "s") shootBall(G.p, "spec");
      else if (btn === "x") shootBall(G.p, "super");
      // per "a": se tiene premuto carica, ma se rilascia o raggiunge carica massima tira; per risposta immediata nei tocchi singoli tiriamo dopo breve carica o al rilascio
    } else {
      if (btn === "a") dive(G.p, dir, "dive");
      else if (btn === "b") dive(G.p, dir, "feint");
      else if (btn === "s") dive(G.p, dir, "spec");
      else if (btn === "x") dive(G.p, dir, "super");
    }
  }

  function scoreGoal(scorerSide, reason) {
    if (!G || G.over) return;
    sfx("goal");
    G.shake = 10;
    G.stop = 10;
    if (G.mode === "wall") {
      G.lives--;
      G.streak = 0;
      spark(G.ball.x, Y_BOT, "#ef4444", 18, true);
      popTxt(W / 2, Y_BOT - 24, `💥 GOL SUBITO! (${G.lives} 🧤)`, "#fca5a5");
      if (G.lives <= 0) {
        finishMatch("end");
        return;
      }
      G.holder = null;
      G.ball.vx = G.ball.vy = 0;
      G.wallDelay = 42;
      return;
    }
    G.score[scorerSide]++;
    const scorer = scorerSide === 0 ? G.p : G.e;
    const conceded = scorerSide === 0 ? G.e : G.p;
    scorer.meter = Math.min(100, scorer.meter + 15);
    conceded.meter = Math.min(100, conceded.meter + 32);
    conceded.grip = conceded.gripMax;
    spark(G.ball.x, scorerSide === 0 ? Y_TOP : Y_BOT, scorerSide === 0 ? "#ffd23f" : "#ef4444", 20, true);
    popTxt(W / 2, H / 2, scorerSide === 0 ? `⚽ GOL DI ${G.p.n.toUpperCase()}!` : `💥 GOL DI ${G.e.n.toUpperCase()}!`, scorerSide === 0 ? "#ffd23f" : "#fca5a5");

    const tgt = G.target || 5;
    if (G.score[0] >= tgt || G.score[1] >= tgt) {
      finishMatch(G.score[0] > G.score[1] ? "win" : "lose");
      return;
    }
    giveBall(conceded);
  }

  function handleSave(k, b) {
    k.saves++;
    if (k.side === 0) G.savesRun++;
    // Super Parata Saracinesca: rispedisce qualsiasi tiro al mittente!
    if (k.superGuard > 0) {
      k.superGuard = 0;
      k.perfects++;
      G.stop = 8;
      G.shake = 8;
      sfx("super");
      spark(b.x, b.y, "#ffd23f", 18, true);
      popTxt(k.x, k.y + (k.side === 0 ? -18 : 18), "🧤 SARACINESCA!", "#ffd23f");
      if (G.mode === "wall") {
        onWallSave(true);
        b.vy = -Math.abs(b.vy) * 1.25;
        b.owner = 0;
        b.super = true;
        b.col = "#ffd23f";
        return;
      }
      const ty = k.side === 0 ? Y_TOP : Y_BOT;
      const tx = clamp(W - (k.side === 0 ? G.e.x : G.p.x), GX0 + 18, GX1 - 18);
      const sp = Math.max(6.8, b.baseSpd * 1.28);
      const dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy) || 1;
      b.vx = (dx / d) * sp;
      b.vy = (dy / d) * sp;
      b.owner = k.side;
      b.super = true;
      b.fx = "fire";
      b.col = "#ffd23f";
      b.gripDmg = 55;
      return;
    }

    const dist = Math.abs(b.x - k.x);
    const isPerfect = (k.parry > 0 && dist < k.reachStand * 1.15) || (k.magnet > 0);
    if (b.fx === "ice" && !isPerfect) k.ice = 75;

    if (isPerfect) {
      k.perfects++;
      k.meter = Math.min(100, k.meter + 28);
      k.grip = Math.min(k.gripMax, k.grip + 26);
      k.counter = 1;
      G.stop = 5;
      sfx("catch");
      spark(b.x, b.y, "#34d399", 12, true);
      popTxt(k.x, k.y + (k.side === 0 ? -18 : 18), "🧤 PRESA PLASTICA! ⚡", "#4ade80");
      if (G.mode === "wall") {
        onWallSave(true);
        // Rilancio automatico verso il bersaglio bonus se presente!
        if (G.bonusTarget) {
          const dx = G.bonusTarget.x - b.x, dy = G.bonusTarget.y - b.y, d = Math.hypot(dx, dy) || 1;
          b.vx = (dx / d) * 7.2;
          b.vy = (dy / d) * 7.2;
          b.owner = 0;
          b.col = "#4ade80";
        } else {
          b.vx = b.vy = 0;
          G.wallDelay = 24;
        }
        return;
      }
      giveBall(k);
      return;
    }

    // Controllo tenuta guanti sulle cannonate
    k.grip -= b.gripDmg || 22;
    if (k.grip <= 0 && (b.super || (b.gripDmg || 0) >= 42)) {
      k.grip = k.gripMax * 0.5;
      k.st = "stun";
      k.t = 18;
      popTxt(k.x, k.y, "💥 MANI PIEGATE!", "#fb923c");
      // Se il tiro era fortissimo sul filo del palo, rischia di piegare le mani in rete!
      if (b.super && dist > k.reachStand * 0.75) {
        scoreGoal(1 - k.side, "mani_piegate");
        return;
      }
    } else {
      k.grip = Math.max(10, k.grip);
    }

    // Respinta di pugno!
    k.meter = Math.min(100, k.meter + 16);
    sfx("punch");
    spark(b.x, b.y, "#93c5fd", 9, false);
    popTxt(k.x, k.y + (k.side === 0 ? -16 : 16), "👊 DI PUGNO!", "#93c5fd");
    if (G.mode === "wall") {
      onWallSave(false);
      b.vy = -Math.abs(b.vy) * 0.85;
      b.vx = clamp((b.x - k.x) * 0.22, -4.5, 4.5);
      b.owner = 0;
      b.super = false;
      return;
    }
    // Nel duello porta a porta: la respinta di pugno rimbalza viva in campo verso l'altra metà!
    const dirY = k.side === 0 ? -1 : 1;
    const rebSpd = clamp(Math.hypot(b.vx, b.vy) * 0.78, 4.4, 6.8);
    const ang = clamp((b.x - k.x) / Math.max(12, k.reachDive), -0.75, 0.75);
    b.vx = Math.sin(ang) * rebSpd;
    b.vy = dirY * Math.cos(ang) * rebSpd;
    b.spin *= -0.4;
    b.fx = "";
    b.super = false;
    b.gripDmg = 16;
    b.owner = k.side;
    b.stall = 0;
  }

  function onWallSave(perfect) {
    G.streak++;
    G.wallScore += perfect ? 200 : 100;
    if (G.streak > G.bestRunStreak) G.bestRunStreak = G.streak;
    if (G.streak % 4 === 0) G.wave++;
    if (perfect && G.p.perfects % 5 === 0 && G.lives < 3) {
      G.lives++;
      popTxt(W / 2, H / 2, "❤️ +1 GUANTO RECUPERATO!", "#fde047");
    }
  }

  function tickKeeper(k, isPlayer) {
    if (k.parry > 0) k.parry--;
    if (k.superGuard > 0) k.superGuard--;
    if (k.magnet > 0) k.magnet--;
    if (k.ice > 0) k.ice--;
    if (k.grip < k.gripMax && G.t % 12 === 0) k.grip = Math.min(k.gripMax, k.grip + 1);

    if (k.st === "stun") {
      k.t--;
      if (k.t <= 0) k.st = "idle";
      return;
    }
    if (k.st === "dive") {
      k.t++;
      if (k.t < 15) k.x += k.vx;
      else k.vx *= 0.65;
      k.x = clamp(k.x, GX0 - 12, GX1 + 12);
      if (k.t >= 25) { k.st = "idle"; k.vx = 0; k.diveDir = 0; }
      return;
    }

    if (isPlayer) {
      let mv = (G.inp.r ? 1 : 0) - (G.inp.l ? 1 : 0);
      if (G.stk && Math.abs(G.stk.v.x) > 0.15) mv = G.stk.v.x;
      if (G.touchX != null && G.holder !== k) {
        const dx = G.touchX - k.x;
        mv = Math.abs(dx) > 4 ? clamp(dx / 18, -1, 1) : 0;
      }
      const sp = k.spd * (k.ice > 0 ? 0.6 : 1);
      k.x = clamp(k.x + mv * sp, GX0 - 10, GX1 + 10);

      if (G.holder === k) {
        k.holdT++;
        if (G.touchAim != null) k.aim = clamp(G.touchAim, -1, 1);
        else if (Math.abs(mv) > 0.1) k.aim = clamp(k.aim + mv * 0.06, -1, 1);
        G.ball.x = k.x;
        G.ball.y = k.y - 11;
        if (G.inp.a) {
          k.charge = Math.min(26, k.charge + 1);
          if (k.charge >= 26) shootBall(k, "power");
        }
        if (k.holdT >= 180) shootBall(k, "power"); // Regola dei 3 secondi!
      } else {
        k.st = Math.abs(mv) > 0.1 ? "move" : "idle";
        // Se la Saracinesca o la Presa Magnetica è attiva, segue il pallone!
        if ((k.superGuard > 0 || k.magnet > 0) && G.ball.vy > 0) {
          k.x = clamp(k.x + clamp(G.ball.x - k.x, -6.5, 6.5), GX0 - 8, GX1 + 8);
        }
      }
    } else {
      // IA del Portiere Rivale (in modalità Duello / Coppa)
      if (G.mode === "wall") return;
      if (G.holder === k) {
        k.holdT++;
        if (k.holdT === 1) {
          k.aiTargetX = clamp(GX0 + 18 + Math.random() * (GX1 - GX0 - 36), GX0 + 12, GX1 - 12);
          // Mira lontano dal giocatore (a meno che il giocatore abbia appena fatto finta!)
          const pOff = G.p.x - W / 2;
          let wantAim = pOff > 8 ? -0.78 : pOff < -8 ? 0.78 : (Math.random() < 0.5 ? -0.72 : 0.72);
          if (k.aiFeint > 0) { wantAim = -wantAim * 0.5; k.aiFeint = 0; }
          k.aim = clamp(wantAim + (Math.random() - 0.5) * 0.35, -0.95, 0.95);
        }
        k.x = clamp(k.x + clamp(k.aiTargetX - k.x, -k.spd * 0.8, k.spd * 0.8), GX0 + 8, GX1 - 8);
        G.ball.x = k.x;
        G.ball.y = k.y + 11;
        const waitF = Math.max(22, 48 - k.ai * 5);
        if (k.holdT >= waitF) {
          if (k.meter >= 100 && k.ai >= 3 && Math.random() < 0.65) shootBall(k, "super", k.aim);
          else if (k.meter >= 50 && k.ai >= 2 && Math.random() < 0.45) shootBall(k, "spec", k.aim);
          else if (Math.random() < 0.42 + k.ai * 0.05) shootBall(k, "curve", k.aim);
          else shootBall(k, "power", k.aim);
        }
        return;
      }
      // IA in difesa sul tiro del giocatore
      const b = G.ball;
      if (b.vy < 0) {
        if (k.aiReact > 0) { k.aiReact--; return; }
        // Stima punto d'arrivo con un margine d'errore inversamente proporzionale a k.ai
        const framesLeft = Math.max(1, (b.y - k.y) / Math.max(0.5, -b.vy));
        const predErr = (6 - k.ai) * (b.fx ? 6.5 : 3.2) * Math.sin(G.t * 0.13);
        const predX = clamp(b.x + b.vx * Math.min(28, framesLeft) * (b.fx === "vanish" ? 0.35 : 0.82) + predErr, GX0 - 6, GX1 + 6);
        const dx = predX - k.x;
        const sp = k.spd * (0.72 + k.ai * 0.08) * (k.ice > 0 ? 0.55 : 1);
        k.x = clamp(k.x + clamp(dx, -sp, sp), GX0 - 10, GX1 + 10);
        if (k.meter >= 100 && b.super && k.ai >= 4 && framesLeft < 16 && Math.random() < 0.5) {
          dive(k, 0, "super");
        } else if (framesLeft < 11 && Math.abs(b.x - k.x) < k.reachDive * 1.05 && Math.abs(b.x - k.x) > 10) {
          if (Math.random() < 0.42 + k.ai * 0.11) dive(k, b.x > k.x ? 1 : -1, "dive");
        }
      } else {
        // Torna al centro della porta
        k.x = clamp(k.x + clamp(W / 2 - k.x, -k.spd * 0.65, k.spd * 0.65), GX0, GX1);
      }
    }
  }

  function tickBall() {
    const b = G.ball;
    if (G.holder) return;
    if (G.mode === "wall" && G.wallDelay > 0) {
      G.wallDelay--;
      if (G.wallDelay <= 0) spawnWallShot();
      return;
    }
    if (b.vx === 0 && b.vy === 0) {
      if (G.mode === "wall") spawnWallShot();
      else giveBall(G.p);
      return;
    }

    b.age++;
    // Effetti speciali firma delle saghe sulla traiettoria
    if (b.fx === "zig" && b.age % 11 === 0) b.vx = -b.vx * 0.9 + (b.vx >= 0 ? -2.2 : 2.2);
    if (b.fx === "scurve" && b.age === 18) b.spin = -b.spin * 1.35;
    if (b.fx === "change" && b.age === 18) { b.vx *= 1.85; b.vy *= 1.85; spark(b.x, b.y, "#fde047", 8, false); }
    if (b.spin) b.vx += b.spin;
    if (G.arena.wind) b.vx += G.arena.wind * Math.sin(G.t * 0.03);

    const steps = 2;
    for (let s = 0; s < steps; s++) {
      b.x += b.vx / steps;
      b.y += b.vy / steps;

      // Sponde laterali (rimbalzanti nella Gabbia, fuori negli altri stadi)
      if (b.x <= LX + 5 || b.x >= RX - 5) {
        if (G.arena.wall) {
          b.x = b.x <= LX + 5 ? LX + 6 : RX - 6;
          b.vx = -b.vx * 0.94;
          sfx("wall");
          spark(b.x, b.y, "#fb923c", 7, false);
          popTxt(b.x, b.y, "⚡ SPONDA!", "#fb923c");
        } else {
          popTxt(b.x, b.y, "FUORI LATERALE", "#94a3b8");
          if (G.mode === "wall") { b.vx = b.vy = 0; G.wallDelay = 22; }
          else giveBall(b.vy > 0 ? G.p : G.e);
          return;
        }
      }

      // Bersaglio bonus a metà campo in modalità Muro Infinito
      if (G.mode === "wall" && G.bonusTarget && b.vy < 0) {
        const bt = G.bonusTarget;
        if (Math.hypot(b.x - bt.x, b.y - bt.y) < bt.r + 7) {
          G.wallScore += 350;
          G.bonusCoins += 4;
          G.p.meter = Math.min(100, G.p.meter + 35);
          spark(bt.x, bt.y, "#ffd23f", 16, true);
          popTxt(bt.x, bt.y, "🎯 BERSAGLIO! +350", "#ffd23f");
          sfx("catch");
          G.bonusTarget = { x: 80 + ((G.t * 19) % 200), y: 112 + ((G.t * 7) % 36), r: 15, vx: (G.wave % 2 ? 1.1 : -1.1) };
          b.vx = b.vy = 0;
          G.wallDelay = 20;
          return;
        }
      }

      // Collisione coi pali delle due porte
      const posts = [
        [GX0, Y_TOP], [GX1, Y_TOP],
        [GX0, Y_BOT], [GX1, Y_BOT],
      ];
      for (let i = 0; i < posts.length; i++) {
        const px = posts[i][0], py = posts[i][1];
        const dx = b.x - px, dy = b.y - py, dist = Math.hypot(dx, dy);
        if (dist < 9.5 && dist > 0.01) {
          const nx = dx / dist, ny = dy / dist;
          const dot = b.vx * nx + b.vy * ny;
          b.vx = (b.vx - 2 * dot * nx) * 0.82;
          b.vy = (b.vy - 2 * dot * ny) * 0.82;
          b.x = px + nx * 10;
          b.y = py + ny * 10;
          G.shake = 6;
          sfx("post");
          spark(px, py, "#ffffff", 10, true);
          popTxt(px, py, "🔔 PALO!", "#fde047");
        }
      }

      // Collisione col Portiere Giocatore (porta bassa)
      if (b.vy > 0 && Math.abs(b.y - G.p.y) <= 12) {
        const reach = (G.p.st === "dive" ? G.p.reachDive : G.p.reachStand) + (G.p.magnet > 0 ? 18 : 0) + (G.p.superGuard > 0 ? 26 : 0);
        if (Math.abs(b.x - G.p.x) <= reach) {
          handleSave(G.p, b);
          return;
        }
      }

      // Collisione col Portiere Rivale (porta alta, solo in Duello / Coppa)
      if (G.mode !== "wall" && b.vy < 0 && Math.abs(b.y - G.e.y) <= 12) {
        const reach = (G.e.st === "dive" ? G.e.reachDive : G.e.reachStand) + (G.e.magnet > 0 ? 16 : 0) + (G.e.superGuard > 0 ? 22 : 0);
        if (Math.abs(b.x - G.e.x) <= reach) {
          handleSave(G.e, b);
          return;
        }
      }

      // Controllo Linea di Porta Alta (Gol del Giocatore o Fondo)
      if (b.y <= Y_TOP - 4) {
        if (G.mode === "wall") {
          b.vx = b.vy = 0;
          G.wallDelay = 20;
          return;
        }
        if (b.x > GX0 + 4 && b.x < GX1 - 4) {
          scoreGoal(0, "rete");
          return;
        }
        popTxt(clamp(b.x, 60, W - 60), Y_TOP + 12, "SUL FONDO", "#94a3b8");
        giveBall(G.e);
        return;
      }

      // Controllo Linea di Porta Bassa (Gol del Rivale o Fondo)
      if (b.y >= Y_BOT + 4) {
        if (b.x > GX0 + 4 && b.x < GX1 - 4) {
          scoreGoal(1, "rete");
          return;
        }
        popTxt(clamp(b.x, 60, W - 60), Y_BOT - 12, "FUORI!", "#94a3b8");
        if (G.mode === "wall") {
          onWallSave(false);
          b.vx = b.vy = 0;
          G.wallDelay = 22;
        } else {
          giveBall(G.p);
        }
        return;
      }
    }

    if (!G.fast && G.t % 2 === 0) {
      b.trail.push({ x: b.x, y: b.y, c: b.col || "#fff" });
      if (b.trail.length > 9) b.trail.shift();
    }

    // Anti-stallo garantito: se la palla rallenta troppo o vaga > 240 frame, l'arbitro la assegna
    if (Math.hypot(b.vx, b.vy) < 1.6 || b.age > 260) {
      b.stall = (b.stall || 0) + 1;
      if (b.stall > 25 || b.age > 260) {
        if (G.mode === "wall") { b.vx = b.vy = 0; G.wallDelay = 16; }
        else giveBall(b.y >= H / 2 ? G.p : G.e);
      }
    }
  }

  function finishMatch(res) {
    if (!G || G.over) return;
    G.over = res;
    sfx("whistle");
    const r = load();
    r.savesTot = (r.savesTot | 0) + (G.savesRun | 0);
    save(r);
    const done = G.onEnd;
    if (G.fast) {
      if (done) done(res, G);
    } else {
      setTimeout(() => { if (G && G.over && done) done(res, G); }, 420);
    }
  }

  function tick() {
    if (!G || G.over) return;
    G.t++;
    if (G.shake > 0) G.shake *= 0.8;
    if (G.stop > 0) { G.stop--; if (!G.fast) draw(); return; }

    if (G.mode === "wall" && G.bonusTarget) {
      G.bonusTarget.x += G.bonusTarget.vx;
      if (G.bonusTarget.x < GX0 + 18 || G.bonusTarget.x > GX1 - 18) G.bonusTarget.vx = -G.bonusTarget.vx;
    }

    tickKeeper(G.p, true);
    tickKeeper(G.e, false);
    tickBall();

    for (let i = G.parts.length - 1; i >= 0; i--) {
      const p = G.parts[i];
      p.x += p.vx; p.y += p.vy; p.l--;
      if (p.l <= 0) G.parts.splice(i, 1);
    }
    for (let i = G.pops.length - 1; i >= 0; i--) {
      G.pops[i].y -= 0.45;
      G.pops[i].l--;
      if (G.pops[i].l <= 0) G.pops.splice(i, 1);
    }

    if (!G.fast) {
      syncHud();
      draw();
    }
  }

  function drawKeeper(ctx, k) {
    ctx.save();
    ctx.translate(k.x, k.y);
    if (k.superGuard > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 26 + Math.sin(G.t * 0.4) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd23f";
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    if (k.magnet > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, 23, 0, Math.PI * 2);
      ctx.strokeStyle = "#c084fc";
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // Ombra a terra
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.beginPath();
    ctx.ellipse(0, 6, k.st === "dive" ? 24 : 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (k.st === "dive" && k.diveDir !== 0) {
      ctx.rotate(k.diveDir * 0.92);
    }
    // Corpo / Maglia da portiere
    ctx.fillStyle = k.ice > 0 ? "#7dd3fc" : k.kitCol;
    ctx.strokeStyle = "#090d16";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-11, -8, 22, 16, 6);
    ctx.fill();
    ctx.stroke();

    // Guantoni protesi!
    const gx = k.st === "dive" ? 19 : 15;
    const gy = k.side === 0 ? -6 : 6;
    ctx.fillStyle = k.parry > 0 ? "#fde047" : k.accCol;
    [-gx, gx].forEach((ox) => {
      ctx.beginPath();
      ctx.arc(ox, gy, 5.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Testa / Ritratto miniatura
    const im = imgOf(k.id);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -2, 9.5, 0, Math.PI * 2);
    ctx.clip();
    if (im && im.complete && im.naturalWidth > 0) {
      ctx.drawImage(im, -10, -12, 20, 20);
    } else {
      ctx.fillStyle = "#fde68a";
      ctx.fillRect(-10, -12, 20, 20);
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(0, -2, 9.5, 0, Math.PI * 2);
    ctx.strokeStyle = k.isP ? "#ffd23f" : "#ffffff";
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();

    // Arco timer 3s e freccia di mira quando ha la palla in mano
    if (G.holder === k && k.side === 0) {
      const rem = clamp(1 - k.holdT / 180, 0, 1);
      ctx.beginPath();
      ctx.arc(k.x, k.y, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rem);
      ctx.strokeStyle = rem < 0.3 ? "#f87171" : "#34d399";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Linea di mira discreta
      const ax = k.x + k.aim * 62, ay = k.y - 54;
      ctx.save();
      ctx.strokeStyle = k.charge > 0 ? "#ffd23f" : "rgba(125,211,252,0.78)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(k.x, k.y - 14);
      ctx.lineTo(ax, ay);
      ctx.stroke();
      ctx.restore();
      if (k.charge > 0) {
        ctx.fillStyle = "#090d16";
        ctx.fillRect(k.x - 18, k.y + 13, 36, 5);
        ctx.fillStyle = k.charge > 18 ? "#ffd23f" : "#34d399";
        ctx.fillRect(k.x - 17, k.y + 14, (34 * k.charge) / 26, 3);
      }
    }
  }

  function draw() {
    if (!G || !G.ctx) return;
    const ctx = G.ctx, A = G.arena;
    ctx.save();
    ctx.scale(SS, SS);
    if (G.shake > 0.4) ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake);

    // Sfondo esterno stadio
    ctx.fillStyle = A.sky;
    ctx.fillRect(0, 0, W, H);

    // Strisce del campo Porta a Porta
    for (let i = 0; i < 8; i++) {
      const sy = Y_TOP + (i * (Y_BOT - Y_TOP)) / 8;
      ctx.fillStyle = i % 2 === 0 ? A.c1 : A.c2;
      ctx.fillRect(LX, sy, RX - LX, (Y_BOT - Y_TOP) / 8 + 0.5);
    }

    // Atmosfera specifica dell'Arena
    if (A.id === "molo") {
      ctx.fillStyle = "rgba(56,189,248,0.16)";
      ctx.fillRect(0, 0, W, Y_TOP - 14);
      for (let i = 0; i < 5; i++) {
        const wx = ((G.t * 0.4 + i * 76) % (W + 30)) - 15;
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(wx, 10 + (i % 2) * 6, 18, 2);
      }
    } else if (A.id === "neon") {
      ctx.strokeStyle = "rgba(34,211,238,0.18)";
      ctx.lineWidth = 1;
      for (let x = LX + 32; x < RX; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, Y_TOP); ctx.lineTo(x, Y_BOT); ctx.stroke();
      }
    }

    // Bordo campo (Sponde d'acciaio arancioni nella Gabbia!)
    ctx.strokeStyle = A.wall ? "#f97316" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = A.wall ? 3.5 : 1.8;
    ctx.strokeRect(LX, Y_TOP, RX - LX, Y_BOT - Y_TOP);

    // Linea di metà campo e cerchio
    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(LX, H / 2); ctx.lineTo(RX, H / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 26, 0, Math.PI * 2);
    ctx.stroke();

    // Aree di rigore dei due portieri
    ctx.strokeRect(GX0 - 16, Y_TOP, (GX1 - GX0) + 32, 34);
    ctx.strokeRect(GX0 - 16, Y_BOT - 34, (GX1 - GX0) + 32, 34);

    // Reti delle due porte (alta e bassa)
    ctx.fillStyle = "rgba(255,255,255,0.11)";
    ctx.fillRect(GX0, Y_TOP - 18, GX1 - GX0, 18);
    ctx.fillRect(GX0, Y_BOT, GX1 - GX0, 18);
    ctx.strokeStyle = A.border;
    ctx.lineWidth = 3;
    // Porta alta
    ctx.beginPath();
    ctx.moveTo(GX0, Y_TOP); ctx.lineTo(GX0, Y_TOP - 18); ctx.lineTo(GX1, Y_TOP - 18); ctx.lineTo(GX1, Y_TOP);
    ctx.stroke();
    // Porta bassa
    ctx.beginPath();
    ctx.moveTo(GX0, Y_BOT); ctx.lineTo(GX0, Y_BOT + 18); ctx.lineTo(GX1, Y_BOT + 18); ctx.lineTo(GX1, Y_BOT);
    ctx.stroke();

    // Pali bianchi metallici
    ctx.fillStyle = "#f8fafc";
    [[GX0, Y_TOP], [GX1, Y_TOP], [GX0, Y_BOT], [GX1, Y_BOT]].forEach(([px, py]) => {
      ctx.beginPath(); ctx.arc(px, py, 4.8, 0, Math.PI * 2); ctx.fill();
    });

    // Bersaglio bonus in modalità Muro Infinito
    if (G.mode === "wall" && G.bonusTarget) {
      const bt = G.bonusTarget;
      ctx.save();
      ctx.beginPath();
      ctx.arc(bt.x, bt.y, bt.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250,204,21,0.22)";
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = "#ffd23f";
      ctx.stroke();
      ctx.font = "900 10px system-ui";
      ctx.fillStyle = "#fef08a";
      ctx.textAlign = "center";
      ctx.fillText("🎯 BONUS", bt.x, bt.y + 3.5);
      ctx.restore();
    }

    // Disegna i due protagonisti
    drawKeeper(ctx, G.e);
    drawKeeper(ctx, G.p);

    // Pallone e scia
    const b = G.ball;
    const vanishHide = b.fx === "vanish" && b.y > Y_TOP + 52 && b.y < Y_BOT - 58;
    if (!vanishHide) {
      for (let i = 0; i < b.trail.length; i++) {
        const tr = b.trail[i], al = (i + 1) / (b.trail.length + 2);
        ctx.fillStyle = tr.c;
        ctx.globalAlpha = al * 0.45;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y, 3 + al * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.beginPath();
      ctx.ellipse(b.x + 2, b.y + 4, 6.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = b.super ? (b.col || "#ffd23f") : "#ffffff";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Pentagono del pallone che ruota
      ctx.fillStyle = b.super ? "#ffffff" : "#1e293b";
      const rot = G.t * 0.22;
      ctx.beginPath();
      ctx.arc(b.x + Math.cos(rot) * 2.2, b.y + Math.sin(rot) * 2.2, 2.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(192,132,252,0.35)";
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Particelle e scritte d'impatto (mai sopra i bordi estremi)
    G.parts.forEach((p) => {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.textAlign = "center";
    ctx.font = "900 11px system-ui";
    G.pops.forEach((pp) => {
      ctx.fillStyle = "#000000cc";
      ctx.fillText(pp.t, pp.x + 1, pp.y + 1);
      ctx.fillStyle = pp.c;
      ctx.fillText(pp.t, pp.x, pp.y);
    });

    ctx.restore();
  }

  function syncHud() {
    if (!G || !G.dom) return;
    const d = G.dom;
    if (G.mode === "wall") {
      d.score.innerHTML = `${G.streak} 🔥<small>${"🧤".repeat(Math.max(0, G.lives))} · Ond. ${G.wave}</small>`;
      d.eNm.textContent = `Bomber: ${G.e.n}`;
      d.eMp.style.width = `${Math.min(100, G.wave * 10)}%`;
      d.eGr.style.width = "100%";
    } else {
      d.score.innerHTML = `${G.score[0]} - ${G.score[1]}<small>ai ${G.target} gol</small>`;
      d.eNm.textContent = G.e.n;
      d.eMp.style.width = `${Math.round(G.e.meter)}%`;
      d.eGr.style.width = `${Math.round((G.e.grip / G.e.gripMax) * 100)}%`;
    }
    d.pMp.style.width = `${Math.round(G.p.meter)}%`;
    d.pGr.style.width = `${Math.round((G.p.grip / G.p.gripMax) * 100)}%`;

    const hasBall = G.holder === G.p;
    if (d.bA.dataset.hb !== (hasBall ? "1" : "0")) {
      d.bA.dataset.hb = hasBall ? "1" : "0";
      d.bA.innerHTML = hasBall ? `👟 VOLÉE<small>Tiro teso</small>` : `🧤 TUFFO<small>Presa / Vola</small>`;
      d.bB.innerHTML = hasBall ? `🌀 A GIRO<small>${G.arena.wall ? "Curva / Sponda" : "Parabola curva"}</small>` : `👟 FINTA<small>Scatto rapido</small>`;
    }
    d.bS.classList.toggle("rdy", G.p.meter >= 50);
    d.bX.classList.toggle("rdy", G.p.meter >= 100);
  }

  function begin(cfg) {
    cfg = cfg || {};
    const arena = ARENAS[cfg.arena] || ARENAS.molo;
    G = {
      mode: cfg.mode || "duel",
      title: cfg.title || "🧤 Sfida di Portieri",
      arena,
      p: cfg.me,
      e: cfg.foe,
      target: cfg.target || 5,
      score: [0, 0],
      lives: 3,
      wave: 1,
      streak: 0,
      bestRunStreak: 0,
      wallScore: 0,
      shotsFaced: 0,
      bonusCoins: 0,
      savesRun: 0,
      wallDelay: 20,
      bonusTarget: cfg.mode === "wall" ? { x: W / 2, y: 124, r: 15, vx: 1.1 } : null,
      holder: null,
      ball: { x: W / 2, y: H / 2, vx: 0, vy: 0, spin: 0, fx: "", super: false, gripDmg: 20, col: "#fff", age: 0, stall: 0, trail: [] },
      inp: { l: 0, r: 0, u: 0, d: 0, a: 0, b: 0, s: 0, x: 0 },
      touchX: null,
      touchAim: null,
      parts: [],
      pops: [],
      t: 0,
      stop: 0,
      shake: 0,
      fast: false,
      over: null,
      onEnd: cfg.onEnd || null,
    };
    if (G.mode === "wall") {
      G.holder = null;
      G.wallDelay = 16;
    } else {
      giveBall(G.p);
    }
    return G;
  }

  function fightUI(cfg) {
    const body = shell(cfg.title || "🧤 Sfida di Portieri", () => menu());
    begin(cfg);
    const isSmall = window.innerWidth <= 345;
    body.innerHTML = `
      <div class="gkHud">
        <div class="gkHudSide">
          <div class="nm">🧤 ${esc(G.p.n)}${G.p.isP ? " ⭐" : ""}</div>
          <div class="gkBars">
            <div class="gkBar gr" title="Tenuta guanti"><i data-pgr style="width:100%"></i></div>
            <div class="gkBar mp" title="Barra Guanto d'Oro"><i data-pmp style="width:0%"></i></div>
          </div>
        </div>
        <div class="gkScore" data-score>0 - 0<small>ai ${G.target} gol</small></div>
        <div class="gkHudSide r">
          <div class="nm" data-enm>${esc(G.e.n)}</div>
          <div class="gkBars">
            <div class="gkBar gr"><i data-egr style="width:100%"></i></div>
            <div class="gkBar mp"><i data-emp style="width:0%"></i></div>
          </div>
        </div>
      </div>
      <div class="gkStage"><canvas width="${W * SS}" height="${H * SS}"></canvas></div>
      <div class="gkPad">
        <div class="gkStickSlot"></div>
        <div class="gkBtns">
          <button type="button" class="gkBtn bA" data-btn="a">🧤 TUFFO<small>Presa / Vola</small></button>
          <button type="button" class="gkBtn bB" data-btn="b">🌀 A GIRO<small>Curva / Finta</small></button>
          <button type="button" class="gkBtn bS" data-btn="s">⚡ SPEC.<small>50% Barra</small></button>
          <button type="button" class="gkBtn bX" data-btn="x">🔥 SUPER<small>100% Cut-in</small></button>
        </div>
      </div>
      <div class="gkHint">${esc(G.arena.icon + " " + G.arena.name)} · Trascina sul campo o usa lo stick · Tuffati all'ultimo istante per la <b>Presa Plastica</b>!</div>
    `;

    const cv = body.querySelector("canvas");
    G.cv = cv;
    G.ctx = cv.getContext("2d");
    G.dom = {
      score: body.querySelector("[data-score]"),
      eNm: body.querySelector("[data-enm]"),
      pMp: body.querySelector("[data-pmp]"),
      pGr: body.querySelector("[data-pgr]"),
      eMp: body.querySelector("[data-emp]"),
      eGr: body.querySelector("[data-egr]"),
      bA: body.querySelector('[data-btn="a"]'),
      bB: body.querySelector('[data-btn="b"]'),
      bS: body.querySelector('[data-btn="s"]'),
      bX: body.querySelector('[data-btn="x"]'),
    };

    if (window.__stick) {
      G.stk = window.__stick.make({ size: isSmall ? 92 : 108 });
      body.querySelector(".gkStickSlot").appendChild(G.stk.el);
    }

    // Tocco diretto sul campo: posiziona il portiere o mira, e con swipe rapido si tuffa o calcia!
    let pDown = null;
    const toPitch = (ev) => {
      const r = cv.getBoundingClientRect();
      return {
        x: ((ev.clientX - r.left) / Math.max(1, r.width)) * W,
        y: ((ev.clientY - r.top) / Math.max(1, r.height)) * H,
      };
    };
    cv.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
      const pt = toPitch(ev);
      pDown = { id: ev.pointerId, x0: pt.x, y0: pt.y, t0: Date.now() };
      if (G.holder === G.p) G.touchAim = clamp((pt.x - W / 2) / ((GX1 - GX0) * 0.5), -1, 1);
      else G.touchX = pt.x;
    });
    cv.addEventListener("pointermove", (ev) => {
      if (!pDown || ev.pointerId !== pDown.id || !G) return;
      const pt = toPitch(ev);
      if (G.holder === G.p) G.touchAim = clamp((pt.x - W / 2) / ((GX1 - GX0) * 0.5), -1, 1);
      else G.touchX = pt.x;
    });
    const endPtr = (ev) => {
      if (!pDown || ev.pointerId !== pDown.id || !G) return;
      const pt = toPitch(ev);
      const dx = pt.x - pDown.x0, dy = pt.y - pDown.y0, dt = Date.now() - pDown.t0;
      pDown = null;
      G.touchX = null;
      if (dt < 340) {
        if (G.holder === G.p && dy < -18) shootBall(G.p, Math.abs(dx) > 36 ? "curve" : "power", clamp((pt.x - W / 2) / 80, -1, 1));
        else if (G.holder !== G.p) dive(G.p, Math.abs(dx) > 16 ? (dx > 0 ? 1 : -1) : 0, "dive");
      }
      G.touchAim = null;
    };
    cv.addEventListener("pointerup", endPtr);
    cv.addEventListener("pointercancel", () => { pDown = null; if (G) { G.touchX = null; G.touchAim = null; } });

    body.querySelectorAll("[data-btn]").forEach((btn) => {
      const k = btn.dataset.btn;
      btn.addEventListener("pointerdown", (ev) => { ev.preventDefault(); btn.classList.add("act"); press(k, true); });
      const up = () => { btn.classList.remove("act"); press(k, false); };
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
      btn.addEventListener("pointerleave", up);
    });

    const keyMap = { ArrowLeft: "l", KeyA: "l", ArrowRight: "r", KeyD: "r", Space: "a", KeyZ: "a", KeyJ: "a", KeyX: "b", KeyK: "b", KeyC: "s", KeyL: "s", KeyV: "x", Enter: "x" };
    G.keyFn = (ev) => {
      const k = keyMap[ev.code];
      if (!k) return;
      ev.preventDefault();
      if (!ev.repeat) press(k, true);
    };
    G.keyFnUp = (ev) => {
      const k = keyMap[ev.code];
      if (!k) return;
      press(k, false);
    };
    window.addEventListener("keydown", G.keyFn);
    window.addEventListener("keyup", G.keyFnUp);

    PAUSE = false;
    syncHud();
    draw();
    const loop = () => {
      if (!G) return;
      if (!PAUSE && !G.over) tick();
      RAF = requestAnimationFrame(loop);
    };
    RAF = requestAnimationFrame(loop);
  }

  function grantArenaXp(cardId, amt) {
    if (!cardId || !safe(() => window.__arena, null)) return false;
    return safe(() => {
      const ar = window.__arena.load();
      ar.xp[cardId] = Math.min(60, (ar.xp[cardId] | 0) + (amt || 1));
      window.__arena.save(ar);
      return true;
    }, false);
  }

  function pickFoeCard(lvl, preferKeeper) {
    const cards = S() && S().CARDS && S().CARDS.length ? S().CARDS : [];
    if (!cards.length) return null;
    const myId = load().keeper;
    let pool = cards.filter((c) => c.id !== myId && (!preferKeeper || c.role === "P"));
    if (!pool.length) pool = cards.filter((c) => c.id !== myId);
    pool.sort((a, b) => (a.at + a.df + a.te) - (b.at + b.df + b.te));
    const band = clamp((lvl - 1) / 4, 0, 1);
    const idx = clamp(Math.floor(band * (pool.length - 1) + (Math.random() - 0.5) * 3), 0, pool.length - 1);
    return pool[idx];
  }

  function meCardFromSave(r) {
    const av = availableCards();
    if (!av.list.length) return null;
    let cur = av.list.find((c) => c.id === r.keeper);
    if (!cur) {
      cur = av.list[0];
      r.keeper = cur.id;
      save(r);
    }
    return cur;
  }

  function duel(lvl, arenaKey, modeTag, cupIdx) {
    const r = load();
    const meCard = meCardFromSave(r);
    const me = mkK(meCard, 0, { lv: meCard ? lvOf(meCard.id) : 0 });
    const isCup = modeTag === "cup";
    const cr = isCup ? CUP_ROUNDS[cupIdx] : null;
    const foeC = pickFoeCard(lvl, isCup && cupIdx >= 2);
    const foe = mkK(foeC, 1, { ai: lvl, m: (lvl - 2) * 0.06, boss: !!(cr && cr.boss), startMeter: cr && cr.boss ? 50 : 0 });
    const arId = arenaKey || r.arena || "molo";
    const tgt = cr ? cr.target : 5;
    fightUI({
      mode: "duel",
      arena: arId,
      target: tgt,
      me,
      foe,
      title: isCup ? `🏆 ${cr.name}` : `⚡ Porta a Porta · Liv. ${lvl}`,
      onEnd: (res, g) => {
        const win = res === "win";
        const st = load();
        const lines = [];
        if (win) {
          st.wins = (st.wins | 0) + 1;
          const coins = isCup ? cr.coins : 8 * lvl;
          safe(() => window.addCoins && window.addCoins(coins), 0);
          lines.push(`🪙 +${coins} monete guadagnate · Parate: ${g.p.saves} (${g.p.perfects} plastiche).`);
          if (isCup) {
            st.cup = Math.max(st.cup | 0, cupIdx + 1);
            if (cupIdx === CUP_ROUNDS.length - 1) {
              st.cupsWon = (st.cupsWon | 0) + 1;
              lines.push(`🏆 HAI ALZATO LA COPPA DEI NUMERI UNO! (Trofei: ${st.cupsWon})`);
            }
          }
          save(st);
          if (grantArenaXp(me.id, cr && cr.boss ? 3 : 1)) lines.push(`📈 +${cr && cr.boss ? 3 : 1} Maestria d'Arena per ${esc(me.n)}.`);
        } else {
          lines.push(`Risultato finale: ${g.score[0]} - ${g.score[1]} · Usa il tuffo sul tempo giusto per attivare la Presa Plastica e il contropiede!`);
        }
        const body = shell(win ? "🏆 Vittoria tra i Pali!" : "💫 Sconfitta", () => menu());
        const hasNext = win && isCup && cupIdx < CUP_ROUNDS.length - 1;
        body.innerHTML = `
          <div class="gkRes">
            <h3>${win ? "Vittoria!" : "Sconfitta"}</h3>
            <p class="sum"><b>${esc(me.n)}</b> ${g.score[0]} – ${g.score[1]} <b>${esc(foe.n)}</b></p>
            ${lines.map((l) => `<p class="sum">${l}</p>`).join("")}
          </div>
          ${hasNext ? `<button type="button" class="one cupBtn" data-go="next">▶ Prossimo Turno: ${esc(CUP_ROUNDS[cupIdx + 1].name)}<small>${esc(ARENAS[CUP_ROUNDS[cupIdx + 1].arena].icon + " " + ARENAS[CUP_ROUNDS[cupIdx + 1].arena].name)} · premio +${CUP_ROUNDS[cupIdx + 1].coins} monete</small></button>` : ""}
          <button type="button" class="one" data-go="again">↺ Rivincita<small>rigioca questa sfida</small></button>
          <button type="button" class="one" data-go="menu">◂ Menu Sfida di Portieri<small>cambia portiere, arena o modalità</small></button>
        `;
        const nx = body.querySelector('[data-go="next"]');
        if (nx) nx.onclick = () => cup(cupIdx + 1);
        body.querySelector('[data-go="again"]').onclick = () => (isCup ? cup(cupIdx) : duel(lvl, arId, "duel", 0));
        body.querySelector('[data-go="menu"]').onclick = () => menu();
      },
    });
  }

  function cup(idx) {
    const i = clamp(idx | 0, 0, CUP_ROUNDS.length - 1);
    const cr = CUP_ROUNDS[i];
    duel(cr.lvl, cr.arena, "cup", i);
  }

  function wall() {
    const r = load();
    const meCard = meCardFromSave(r);
    const me = mkK(meCard, 0, { lv: meCard ? lvOf(meCard.id) : 0 });
    const foe = mkK(pickFoeCard(3, false), 1, { ai: 3 });
    fightUI({
      mode: "wall",
      arena: r.arena || "tempio",
      me,
      foe,
      title: "🧱 Muro Infinito · 3 Guanti",
      onEnd: (_res, g) => {
        const st = load();
        const bestBefore = st.bestWall | 0;
        const streakBest = Math.max(g.bestRunStreak | 0, g.savesRun | 0);
        const isNew = streakBest > bestBefore;
        if (isNew) st.bestWall = streakBest;
        const coins = Math.min(120, Math.floor((g.savesRun | 0) * 2) + (g.bonusCoins | 0));
        if (coins > 0) safe(() => window.addCoins && window.addCoins(coins), 0);
        save(st);
        if (g.savesRun >= 4) grantArenaXp(me.id, 1);
        const body = shell("🧱 Fine Muro Infinito", () => menu());
        body.innerHTML = `
          <div class="gkRes">
            <h3>${isNew ? "🌟 Nuovo Record!" : "Fine Serie"}</h3>
            <p class="sum">Parate totali nella serie: <b>${g.savesRun}</b> · Serie massima consecutiva: <b>${g.bestRunStreak}</b> · Punteggio: <b>${g.wallScore}</b>.</p>
            <p class="sum">Record personale: <b>${st.bestWall}</b> parate${coins > 0 ? ` · 🪙 <b>+${coins} monete</b> guadagnate!` : "."}</p>
          </div>
          <button type="button" class="one wallBtn" data-go="again">🧱 Riprova Muro Infinito<small>batti il record di ${st.bestWall} parate</small></button>
          <button type="button" class="one" data-go="menu">◂ Menu Sfida di Portieri<small>torna alla selezione</small></button>
        `;
        body.querySelector('[data-go="again"]').onclick = () => wall();
        body.querySelector('[data-go="menu"]').onclick = () => menu();
      },
    });
  }

  function quickPick() {
    const r = load();
    const body = shell("⚡ Duello Porta a Porta", () => menu());
    body.innerHTML = `
      <p class="sum">Scegli il livello del portiere rivale nell'arena <b>${esc(ARENAS[r.arena].icon + " " + ARENAS[r.arena].name)}</b>. Vince il primo che segna <b>5 gol</b> da porta a porta!</p>
      ${[1, 2, 3, 4, 5].map((l) => `<button type="button" class="one" data-l="${l}">Livello ${l} ${"★".repeat(l)}<small>${["Esordiente dei pali", "Guardiano agile", "Numero Uno esperto", "Saracinesca di coppa", "Leggenda imbattibile"][l - 1]} · premio +${8 * l} monete</small></button>`).join("")}
      <button type="button" class="one" data-go="back">◂ Indietro</button>
    `;
    body.querySelectorAll("[data-l]").forEach((b) => { b.onclick = () => duel(+b.dataset.l, r.arena, "duel", 0); });
    body.querySelector('[data-go="back"]').onclick = () => menu();
  }

  function menu(back) {
    if (back) BACK = back;
    const body = shell("🧤 Sfida di Portieri");
    const r = load();
    const av = availableCards();
    const cur = meCardFromSave(r);
    if (!cur) {
      body.innerHTML = `<p class="sum">Caricamento rose della Squadra dei Sogni…</p>`;
      return;
    }
    const e = safe(() => S().eff(cur), cur) || cur;
    const roleLbl = { P: "Portiere Puro (+18% Tuffo)", D: "Difensore Muro (+25% Tenuta)", C: "Regista dei Pali (Curva S)", A: "Portiere Volante (Drop-Kick)", B: "Jolly Acrobatico" }[cur.role] || cur.role;
    const sp = ROLE_SPEC[cur.role] || ROLE_SPEC.P;
    const sg = safe(() => window.__supers && window.__supers.of(cur.id), { name: "Super Rinvio" });
    const u = safe(() => S().port(cur.id), null);

    let h = `<p class="sum">Duello arcade <b>Porta a Porta</b>: para coi riflessi per innescare il contropiede, calcia di volée o a giro (anche di sponda nella Gabbia!) e scatena la <b>Saracinesca</b>.${av.loan ? " <i>(Portieri del Borgo in prestito finché non sblocchi le tue carte!)</i>" : ""}</p>`;
    h += `<div class="gkHeroCard">
      <div class="gkHeroAv">${u ? `<img alt="" src="${u}">` : "🧤"}</div>
      <div class="gkHeroMeta">
        <b>${esc(nameOf(cur.id))}</b>
        <div class="sub">${esc(roleLbl)} · Speciale: «${esc(sp[0])}»</div>
        <div class="gkHeroStats">
          <span>🛡️ Tuffo ${e.df}</span>
          <span>🎯 Curva ${e.te}</span>
          <span>👟 Rinvio ${e.at}</span>
          <span>🔥 ${esc(sg.name)}</span>
        </div>
      </div>
    </div>`;

    h += `<div class="sec"><span>Scegli il tuo Numero Uno (${av.list.length})</span><span>🧤 = bonus pali</span></div>`;
    h += `<div class="gkPick">${av.list.map((c) => {
      const pu = safe(() => S().port(c.id), null);
      return `<div class="c${c.id === cur.id ? " sel" : ""}" data-c="${c.id}">${c.role === "P" ? `<span class="pTag">🧤</span>` : ""}${pu ? `<img alt="" src="${pu}">` : `<div class="ph">?</div>`}<div class="nm">${esc(nameOf(c.id))}</div></div>`;
    }).join("")}</div>`;

    h += `<div class="sec"><span>Stadio del Duello</span><span>parate tot: ${r.savesTot}</span></div>`;
    h += `<div class="gkArenaRow">${Object.values(ARENAS).map((a) => `<button type="button" class="gkArenaBtn${r.arena === a.id ? " on" : ""}" data-ar="${a.id}">${a.icon} ${esc(a.name)}<small>${esc(a.sub)}</small></button>`).join("")}</div>`;

    h += `<div class="sec"><span>Modalità</span><span>🏆 Coppe: ${r.cupsWon} · 🧱 Record: ${r.bestWall}</span></div>`;
    h += `<button type="button" class="one cupBtn" data-go="cup">🏆 Coppa dei Numeri Uno<small>4 turni (Molo → Gabbia → Cyber-Neon → Tempio Boss) · turno max ${r.cup}/4 · premi fino a 220 monete</small></button>`;
    h += `<button type="button" class="one" data-go="duel">⚡ Duello Porta a Porta<small>1 contro 1 ai 5 gol nell'arena scelta · 5 livelli di difficoltà · ${r.wins} vittorie</small></button>`;
    h += `<button type="button" class="one wallBtn" data-go="wall">🧱 Muro Infinito (Sopravvivenza)<small>3 guanti di vita contro raffiche di bomber, tiri speciali e bersagli bonus · record ${r.bestWall}</small></button>`;
    body.innerHTML = h;

    body.querySelectorAll(".gkPick [data-c]").forEach((el) => {
      el.onclick = () => { const x = load(); x.keeper = el.dataset.c; save(x); menu(); };
    });
    body.querySelectorAll("[data-ar]").forEach((el) => {
      el.onclick = () => { const x = load(); x.arena = el.dataset.ar; save(x); menu(); };
    });
    body.querySelector('[data-go="cup"]').onclick = () => cup(0);
    body.querySelector('[data-go="duel"]').onclick = () => quickPick();
    body.querySelector('[data-go="wall"]').onclick = () => wall();
  }

  window.__portieri = {
    open: menu,
    close,
    state: () => G,
    begin,
    tick,
    press,
    shootBall,
    dive,
    mkK,
    ARENAS,
    CUP_ROUNDS,
    _fast: (v) => { if (G) G.fast = !!v; },
    pause: (v) => { PAUSE = !!v; },
    load,
    save,
    duel,
    cup,
    wall,
    fightUI,
  };
})();
