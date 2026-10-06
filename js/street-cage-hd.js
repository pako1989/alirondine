// js/street-cage-hd.js - Street Football 2D HD · "La Gabbia del Molo"
// 3v3 da strada in una gabbia verticale: muri che rimbalzano, sponde che valgono doppio, Grinta e Trabucco.
// Entry: window.openStreetCageMode(onExit)
(function () {
  "use strict";

  // ---------------------------------------------------------------- costanti
  const KEY_PROG = "ali-di-rondine.cage-hd-progress";
  const KEY_SET = "ali-di-rondine.cage-hd-settings";
  const DEBUG = /[?&]debug/.test(location.search || "");

  const CW = 540, CH = 860;
  const L = 22, R = CW - 22, T = 22, B = CH - 22, LENY = B - T;
  const BR = 8;          // raggio palla
  const PR = 14;         // raggio giocatore
  const STEP = 1 / 60;
  const MATCH_SECS = 150;
  const MX = 70, MY = 90;

  const LEVELS = [
    {
      name: "Scaricatori del Mercato", tag: "MER", kit: "#f97316", kit2: "#fde68a", skin: ["#d9a679", "#c68642", "#e8b88c"], names: ["Gino", "Ciccio Gru", "Bepi Stiva"],
      spd: 0.9, react: 20, dash: 0.004, noise: 34, bank: 0.1, target: 7, read: 0.1, mut: "Nessuna regola strana", mutKey: "",
      hint: "Escono dal turno all'alba e giocano con la stessa grazia con cui spostano le cassette di pesce. Il capo, Gino, ha il fiato di un mantice rotto.",
      win: "Gino perde e offre il caffè a tutti. Poi si accorge che il bar è chiuso dal 2011. Passa un gatto. Per qualche secondo nessuno dice niente, e va benissimo così.",
    },
    {
      name: "Le Gemelle Schiuma", tag: "SCH", kit: "#d946ef", kit2: "#0f172a", skin: ["#e8b88c", "#e8b88c", "#c68642"], names: ["Rina", "Rita", "Cugino Gigi"],
      spd: 0.97, react: 14, dash: 0.007, noise: 24, bank: 0.25, target: 8, read: 0.5, mut: "Cemento bagnato: la palla scivola di più", mutKey: "wet",
      hint: "Rina e Rita finiscono le frasi l'una dell'altra, e anche i passaggi. Il cugino Gigi è lì «per fare numero». Fa spesso il numero sbagliato.",
      win: "Rina e Rita ti salutano all'unisono, finendo la stessa frase a metà. Nessuna delle due ha capito chi ha vinto, ma entrambe giurano di averlo previsto.",
    },
    {
      name: "La Vecchia Guardia del Molo", tag: "VEC", kit: "#a8a29e", kit2: "#78350f", skin: ["#d9a679", "#c68642", "#d9a679"], names: ["Don Tullio", "Mastro Remo", "Ciro Mezzaluna"],
      spd: 0.98, react: 12, dash: 0.008, noise: 18, bank: 0.35, target: 8, read: 0.75, mut: "Pareti di gomma: i muri non frenano la palla", mutKey: "rubber",
      hint: "Hanno costruito questa gabbia con le proprie mani, quarant'anni fa. Giocano piano e non sbagliano mai l'angolo: lo conoscono a memoria.",
      win: "Don Tullio ti porge il lucchetto della Gabbia, arrugginito dal sale. «L'abbiamo chiusa ogni sera per cinquant'anni, aspettando qualcuno che la riaprisse.» Mastro Remo si soffia il naso con un fazzoletto grande come una vela.",
    },
    {
      name: "Mastro Cavalletto & Co.", tag: "CAV", kit: "#18181b", kit2: "#facc15", skin: ["#c68642", "#8d5524", "#e8b88c"], names: ["Mastro Cavalletto", "Sgrinfia", "Palanca"],
      spd: 1.04, react: 8, dash: 0.011, noise: 10, bank: 0.4, target: 9, read: 0.95, mut: "Porte strette: gli spazi si riducono", mutKey: "narrow",
      hint: "Il Re della Gabbia: non perde da prima che esistesse il telefono col filo. Ha un casco da cantiere, tre dita per mano e nessuna pietà.",
      win: "Mastro Cavalletto si toglie il casco da cantiere e ti stringe la mano con tre dita. «Il re è chi lascia la porta aperta.» Poi, più piano: «E il fritto, adesso, lo offri tu.»",
    },
  ];
  const COINS = [3, 4, 4, 5]; // 16 monete totali, solo alla prima vittoria
  const DIFFS = [
    { n: "Facile", spd: 0.92, react: 8, noise: 14, usr: 1.05 },
    { n: "Normale", spd: 1.0, react: 0, noise: 0, usr: 1.0 },
    { n: "Duro", spd: 1.06, react: -3, noise: -6, usr: 1.0 },
  ];
  const HOME = [
    { name: "Leo", spd: 4.8, kit: "#2563eb", kit2: "#bae6fd", skin: "#e8b88c", hair: "#3b2314" },
    { name: "Nico", spd: 5.1, kit: "#0ea5e9", kit2: "#ffffff", skin: "#c68642", hair: "#111827" },
    { name: "Dario", spd: 4.5, kit: "#1e3a8a", kit2: "#facc15", skin: "#d9a679", hair: "#6b7280" },
  ];
  // posizioni base nel sistema della squadra: u = avanzamento (0 propria porta, 1 porta avversaria), v = larghezza
  const SLOT = [{ u: 0.5, v: 0.32, role: "Fronte" }, { u: 0.42, v: 0.68, role: "Jolly" }, { u: 0.2, v: 0.5, role: "Muro" }];

  // ---------------------------------------------------------------- salvataggi
  function lsGet(key, def) {
    try { const raw = localStorage.getItem(key); if (!raw) return def; const o = JSON.parse(raw); return o && typeof o === "object" ? o : def; } catch (e) { return def; }
  }
  function lsSet(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  function loadProg() {
    const o = lsGet(KEY_PROG, {});
    const arr = (a) => LEVELS.map((_, i) => Math.max(0, Math.min(3, (a && a[i]) | 0)));
    return { stars: arr(o.stars), coin: arr(o.coin), played: o.played | 0, wins: o.wins | 0, pts: o.pts | 0, bestCombo: o.bestCombo | 0, tut: o.tut ? 1 : 0 };
  }
  function loadSet() {
    const o = lsGet(KEY_SET, {});
    return { ctrl: o.ctrl === "touch" ? "touch" : "stick", diff: [0, 1, 2].indexOf(o.diff) >= 0 ? o.diff : 1, sound: o.sound === 0 ? 0 : 1 };
  }
  let PROG = loadProg(), SET = loadSet();
  const saveProg = () => lsSet(KEY_PROG, PROG);
  const saveSet = () => lsSet(KEY_SET, SET);

  // ---------------------------------------------------------------- stato modulo
  let root = null, cv = null, cx = null, ui = null, stage = null;
  let raf = 0, lastTs = 0, acc = 0, paused = false, closed = true, onExitCb = null;
  let G = null, bgCache = null, vigCache = null, vigKey = "";
  let cleanup = [], timers = [], uiState = "menu";
  const input = { jx: 0, jy: 0, kx: 0, ky: 0, tx: 0, ty: 0, touchOn: false, sprint: false, charging: false, chargeF: 0, passEdge: false, bankEdge: false, shootRel: false, trab: false, keyShoot: false };
  const stick = { id: -1, ox: 0, oy: 0, bx: 0, by: 0 };

  const snd = (name, a) => { if (SET.sound && window.HD2DAudio && typeof window.HD2DAudio[name] === "function") { try { window.HD2DAudio[name](a); } catch (e) { /* ignora */ } } };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const later = (fn, ms) => { const id = setTimeout(() => { timers = timers.filter((x) => x !== id); fn(); }, ms); timers.push(id); return id; };
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  // geometria dipendente dal livello
  function ghw() { return G && G.lv.mutKey === "narrow" ? 42 : 56; }
  function mouth() { const h = ghw(); return [CW / 2 - h, CW / 2 + h]; }
  const goalY = (attTeam) => (attTeam === 0 ? T : B); // porta attaccata da attTeam
  const ownY = (t) => (t === 0 ? B : T);
  const dirY = (t) => (t === 0 ? -1 : 1);
  const uOf = (t, y) => (t === 0 ? (B - y) / LENY : (y - T) / LENY);
  const yOfU = (t, u) => (t === 0 ? B - u * LENY : T + u * LENY);
  const xOfV = (v) => L + v * (R - L);

  // ---------------------------------------------------------------- CSS
  function injectCss() {
    if (document.getElementById("cgd-css")) return;
    const st = document.createElement("style");
    st.id = "cgd-css";
    st.textContent = `
.cgd-root{position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;z-index:999999;display:flex;flex-direction:column;background:#0a0e17;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden;outline:none}
.cgd-root *{box-sizing:border-box}
.cgd-top{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:4px 8px;padding-top:max(4px,env(safe-area-inset-top));background:linear-gradient(#1a1410,#120e0b);border-bottom:1px solid #4a3a28;z-index:30}
.cgd-ib{width:44px;height:44px;border-radius:12px;border:1px solid #6b5338;background:#2a1f15;color:#fff;font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto;padding:0;touch-action:manipulation}
.cgd-ib:active{background:#43301f}
.cgd-sc{flex:1;min-width:0;text-align:center;line-height:1.1}
.cgd-sc b{font:800 22px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;white-space:nowrap}
.cgd-sc small{display:block;font-size:11px;color:#c9b79a;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cgd-ta{color:#7dd3fc}.cgd-tb{color:#fdba74}
.cgd-bars{display:flex;gap:6px;justify-content:center;align-items:center;margin-top:3px}
.cgd-bar{position:relative;width:110px;height:8px;border-radius:5px;background:#2a1f15;overflow:hidden;border:1px solid #6b5338}
.cgd-bar i{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#f59e0b,#fb923c)}
.cgd-bar.full{box-shadow:0 0 8px #fb923c;border-color:#fdba74}
.cgd-cmb{font:800 11px system-ui;color:#fde047;min-width:44px;text-align:left}
.cgd-stage{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
.cgd-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}
.cgd-pad{position:absolute;left:0;top:0;bottom:0;width:56%;z-index:5;touch-action:none}
.cgd-pad.all{width:100%}
.cgd-stk{position:absolute;width:112px;height:112px;margin:-56px 0 0 -56px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(40,25,10,.35);z-index:6;pointer-events:none;opacity:.55;display:none}
.cgd-stk.on{opacity:1;background:rgba(40,25,10,.5)}
.cgd-stk i{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fdba74,#c2410c);border:2px solid #ffedd5;box-shadow:0 3px 8px rgba(0,0,0,.5)}
.cgd-btns{position:absolute;right:0;bottom:0;width:236px;height:240px;z-index:8;pointer-events:none}
.cgd-b{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.55);color:#fff;font-weight:800;font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;box-shadow:0 5px 14px rgba(0,0,0,.55);cursor:pointer;padding:0;line-height:1.05;text-shadow:0 1px 2px #000}
.cgd-b small{font-size:9px;font-weight:600;opacity:.85}
.cgd-b.dn{transform:scale(.93);filter:brightness(1.35)}
.cgd-b.shoot{width:90px;height:90px;right:14px;bottom:max(20px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#fb923c,#c2410c);font-size:16px}
.cgd-b.bank{width:78px;height:78px;right:114px;bottom:max(14px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#38bdf8,#0369a1)}
.cgd-b.pass{width:66px;height:66px;right:20px;bottom:128px;background:radial-gradient(circle at 35% 30%,#a3e635,#4d7c0f);font-size:12px}
.cgd-b.trab{width:66px;height:66px;right:104px;bottom:106px;background:radial-gradient(circle at 35% 30%,#fde047,#dc2626);font-size:12px;display:none;animation:cgdP .6s infinite alternate}
.cgd-b.trab.on{display:flex}
@keyframes cgdP{from{box-shadow:0 0 6px #facc15}to{box-shadow:0 0 24px #f97316}}
.cgd-chg{position:absolute;left:50%;bottom:136px;width:150px;height:10px;margin-left:-75px;border-radius:6px;background:rgba(0,0,0,.55);border:1px solid #fff;z-index:7;display:none;overflow:hidden;pointer-events:none}
.cgd-chg i{display:block;height:100%;width:0;background:linear-gradient(90deg,#fde047,#ef4444)}
.cgd-msg{position:absolute;left:50%;top:12%;transform:translateX(-50%);z-index:9;pointer-events:none;background:rgba(10,14,23,.88);border:1px solid #fb923c;border-radius:12px;padding:7px 14px;font-weight:800;font-size:15px;text-align:center;max-width:92%;display:none}
.cgd-banner{position:absolute;left:0;right:0;top:30%;z-index:12;text-align:center;pointer-events:none;display:none}
.cgd-banner .cgd-bg{display:inline-block;padding:10px 26px 12px;background:linear-gradient(90deg,transparent,rgba(20,12,6,.94) 14%,rgba(20,12,6,.94) 86%,transparent);animation:cgdIn .3s cubic-bezier(.2,1.4,.4,1)}
.cgd-banner h1{margin:0;font:900 40px/1 system-ui,sans-serif;letter-spacing:2px;color:#fde047;text-shadow:0 3px 0 #b45309,0 0 22px rgba(251,146,60,.8)}
.cgd-banner.bad h1{color:#fdba74;text-shadow:0 3px 0 #7c2d12}
.cgd-banner p{margin:6px 0 0;font-size:15px;font-weight:700;color:#f1e6d4}
@keyframes cgdIn{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
.cgd-ui{position:absolute;inset:0;z-index:20;display:none;overflow-y:auto;overflow-x:hidden;background:rgba(12,8,4,.92);touch-action:pan-y;-webkit-overflow-scrolling:touch}
.cgd-ui.on{display:block}
.cgd-card{max-width:440px;margin:0 auto;padding:14px 14px calc(18px + env(safe-area-inset-bottom))}
.cgd-card h2{margin:4px 0 2px;font-size:22px;color:#fdba74}
.cgd-card h3{margin:14px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#a8957a}
.cgd-card p{margin:6px 0;font-size:14px;line-height:1.4;color:#e5d9c6}
.cgd-sub{font-size:13px;color:#a8957a}
.cgd-opp{display:flex;align-items:center;gap:10px;width:100%;min-height:58px;margin:6px 0;padding:8px 10px;border-radius:14px;border:1px solid #6b5338;background:#241a10;color:#fff;text-align:left;cursor:pointer;font:inherit;touch-action:manipulation}
.cgd-opp:active{background:#37271a}
.cgd-opp[disabled]{opacity:.45;cursor:default}
.cgd-crest{flex:0 0 38px;height:38px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px}
.cgd-opp b{display:block;font-size:15px}
.cgd-opp span{font-size:12px;color:#c9b79a}
.cgd-opp em{margin-left:auto;font-style:normal;color:#fde047;font-size:15px;letter-spacing:1px;white-space:nowrap}
.cgd-seg{display:flex;gap:6px;margin:4px 0 8px}
.cgd-seg button{flex:1;min-height:44px;border-radius:10px;border:1px solid #6b5338;background:#241a10;color:#e5d9c6;font:700 13px system-ui;cursor:pointer;padding:4px;touch-action:manipulation}
.cgd-seg button.on{background:#c2410c;border-color:#fdba74;color:#fff}
.cgd-btn{display:block;width:100%;min-height:50px;margin:8px 0;border-radius:14px;border:0;background:linear-gradient(#fb923c,#c2410c);color:#fff;font:800 16px system-ui;cursor:pointer;touch-action:manipulation}
.cgd-btn.sec{background:#3a2a1a;border:1px solid #6b5338;font-size:14px}
.cgd-btn.red{background:linear-gradient(#ef4444,#b91c1c)}
.cgd-score{font:900 48px/1 ui-monospace,Menlo,monospace;text-align:center;margin:8px 0;letter-spacing:2px}
.cgd-stars{text-align:center;font-size:30px;color:#fde047;letter-spacing:6px}
.cgd-quote{border-left:3px solid #fb923c;padding:4px 10px;margin:10px 0;color:#f1e6d4;font-style:italic}
.cgd-stat{display:flex;justify-content:space-between;font-size:13px;color:#e5d9c6;border-bottom:1px solid #4a3a28;padding:5px 0}
.cgd-dots{text-align:center;margin:10px 0;color:#5b4a35;font-size:22px}.cgd-dots b{color:#fb923c}
.cgd-rule{background:#2a1f15;border:1px solid #6b5338;border-radius:10px;padding:6px 10px;margin:8px 0;font-size:13px;color:#fdba74}
`;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- sfondo (cache)
  function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function buildBg(narrow) {
    const bw = CW + MX * 2, bh = CH + MY * 2;
    const c = document.createElement("canvas"); c.width = bw; c.height = bh;
    const g = c.getContext("2d");
    g.translate(MX, MY);
    const r = seeded(31);
    // esterno: sera sul porto
    let gr = g.createLinearGradient(0, -MY, 0, CH + MY);
    gr.addColorStop(0, "#0f1830"); gr.addColorStop(0.5, "#1c1a2a"); gr.addColorStop(1, "#0f1220");
    g.fillStyle = gr; g.fillRect(-MX, -MY, bw, bh);
    // container in alto
    const cc = ["#7f1d1d", "#1e3a8a", "#14532d", "#78350f", "#4c1d95", "#0f766e"];
    for (let i = 0; i < 6; i++) {
      const x = -MX + i * 108, h = 34 + (i % 3) * 8;
      g.fillStyle = cc[i]; g.fillRect(x, -60 - h * 0.2, 100, h);
      g.fillStyle = "rgba(0,0,0,.25)"; for (let k = 6; k < 100; k += 9) g.fillRect(x + k, -60 - h * 0.2, 2, h);
      g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(x, -60 - h * 0.2, 100, 4);
    }
    g.strokeStyle = "#34415c"; g.lineWidth = 5; g.beginPath(); g.moveTo(430, -86); g.lineTo(430, -30); g.moveTo(380, -86); g.lineTo(520, -86); g.stroke();
    // case in basso con finestre accese
    for (let i = 0; i < 6; i++) {
      const x = -MX + i * 108, h = 44 + (i * 17) % 28;
      g.fillStyle = ["#3b2f40", "#2f3a4a", "#463a34", "#2d3e3a"][i % 4]; g.fillRect(x, CH + 28, 104, h);
      for (let wx = 10; wx < 90; wx += 24) for (let wy = 8; wy < h - 6; wy += 20) { g.fillStyle = r() > 0.4 ? "#fde68a" : "#1b2231"; g.fillRect(x + wx, CH + 28 + wy, 11, 12); }
    }
    // lampioni laterali
    [[-34, 120], [-34, 440], [-34, 760], [CW + 34, 120], [CW + 34, 440], [CW + 34, 760]].forEach(([x, y]) => {
      const rg = g.createRadialGradient(x, y, 2, x, y, 70);
      rg.addColorStop(0, "rgba(253,224,71,.5)"); rg.addColorStop(1, "rgba(253,224,71,0)");
      g.fillStyle = rg; g.fillRect(x - 70, y - 70, 140, 140);
      g.fillStyle = "#fef3c7"; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
    });
    // pavimento
    const tile = 54;
    for (let ty = 0; ty < Math.ceil(CH / tile); ty++) for (let tx = 0; tx < Math.ceil(CW / tile); tx++) {
      const v = (tx + ty) % 2; const sh = 36 + v * 5 + Math.floor(r() * 5);
      g.fillStyle = `rgb(${sh + 4},${sh + 8},${sh + 20})`; g.fillRect(tx * tile, ty * tile, tile, tile);
    }
    g.strokeStyle = "rgba(0,0,0,.28)"; g.lineWidth = 1.5;
    for (let x = 0; x <= CW; x += tile) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, CH); g.stroke(); }
    for (let y = 0; y <= CH; y += tile) { g.beginPath(); g.moveTo(0, y); g.lineTo(CW, y); g.stroke(); }
    // crepe
    g.strokeStyle = "rgba(0,0,0,.4)"; g.lineWidth = 1.4;
    for (let i = 0; i < 9; i++) { let x = r() * CW, y = r() * CH; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += rnd2(r, -26, 26); y += rnd2(r, 6, 26); g.lineTo(x, y); } g.stroke(); }
    // macchie d'olio e pozzanghere
    for (let i = 0; i < 5; i++) { const x = 60 + r() * (CW - 120), y = 120 + r() * (CH - 240); g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y, 20 + r() * 20, 12 + r() * 12, r() * 3, 0, 7); g.fill(); }
    [[130, 250, 52, 20], [410, 610, 60, 22], [300, 450, 34, 14]].forEach(([x, y, rx, ry]) => {
      const pg = g.createLinearGradient(x - rx, y, x + rx, y);
      pg.addColorStop(0, "rgba(120,170,230,.28)"); pg.addColorStop(1, "rgba(250,220,150,.28)");
      g.fillStyle = pg; g.beginPath(); g.ellipse(x, y, rx, ry, 0.2, 0, 7); g.fill();
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1.5; g.stroke();
    });
    // segni di campo
    g.strokeStyle = "rgba(125,211,252,.75)"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(L, CH / 2); g.lineTo(R, CH / 2); g.stroke();
    g.beginPath(); g.arc(CW / 2, CH / 2, 70, 0, 7); g.stroke();
    g.fillStyle = "rgba(125,211,252,.8)"; g.beginPath(); g.arc(CW / 2, CH / 2, 5, 0, 7); g.fill();
    const mh = narrow ? 42 : 56;
    g.strokeStyle = "rgba(251,146,60,.8)"; g.lineWidth = 4;
    g.beginPath(); g.arc(CW / 2, T, 110, 0, Math.PI); g.stroke();
    g.beginPath(); g.arc(CW / 2, B, 110, Math.PI, Math.PI * 2); g.stroke();
    g.save(); g.translate(CW / 2, CH / 2); g.rotate(-Math.PI / 2); g.fillStyle = "rgba(255,255,255,.1)"; g.font = "900 46px system-ui"; g.textAlign = "center"; g.fillText("GABBIA DEL MOLO", 0, -90); g.restore();
    // muri (fascia perimetrale) con mattoni e graffiti
    g.fillStyle = "#3c3f4d";
    const wall = (x, y, w, h) => { g.fillRect(x, y, w, h); };
    wall(-14, -14, CW + 28, T + 14); wall(-14, B, CW + 28, CH - B + 14); wall(-14, -14, L + 14, CH + 28); wall(R, -14, CW - R + 14, CH + 28);
    g.strokeStyle = "rgba(0,0,0,.35)"; g.lineWidth = 1;
    for (let y = -14; y < CH + 14; y += 11) { g.beginPath(); g.moveTo(-14, y); g.lineTo(L, y); g.moveTo(R, y); g.lineTo(CW + 14, y); g.stroke(); }
    for (let x = -14; x < CW + 14; x += 18) { g.beginPath(); g.moveTo(x, -14); g.lineTo(x, T); g.moveTo(x, B); g.lineTo(x, CH + 14); g.stroke(); }
    // bordo superiore chiaro dei muri (cordolo)
    g.strokeStyle = "#7c8196"; g.lineWidth = 3; g.strokeRect(L, T, R - L, B - T);
    g.strokeStyle = "rgba(0,0,0,.45)"; g.lineWidth = 2; g.strokeRect(L - 2, T - 2, R - L + 4, B - T + 4);
    // graffiti
    const tag = (txt, x, y, rot, col, size) => { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.font = `900 ${size}px system-ui`; g.textAlign = "center"; g.fillText(txt, 0, 0); g.restore(); };
    tag("FORZA MOLO", 11, 200, -Math.PI / 2, "#f472b6", 14); tag("DA BEPPE ♥", 11, 480, -Math.PI / 2, "#fde047", 13); tag("RONDINE", 11, 700, -Math.PI / 2, "#38bdf8", 14);
    tag("CIAO MAMMA", CW - 11, 230, Math.PI / 2, "#a3e635", 13); tag("1987", CW - 11, 450, Math.PI / 2, "#fb923c", 14); tag("NO PARCHEGGIO", CW - 11, 690, Math.PI / 2, "#f87171", 12);
    // porte: bocche nei muri con rete
    [[0, T], [1, B]].forEach(([bottom, y]) => {
      const x0 = CW / 2 - mh, x1 = CW / 2 + mh, s = bottom ? 1 : -1;
      g.fillStyle = "#06080e"; g.fillRect(x0, Math.min(y, y + s * 34), x1 - x0, 34 + (bottom ? 14 : 0));
      g.fillStyle = bottom ? "rgba(56,189,248,.18)" : "rgba(251,146,60,.18)"; g.fillRect(x0, Math.min(y, y + s * 34), x1 - x0, 34);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
      for (let i = x0; i <= x1; i += 8) { g.beginPath(); g.moveTo(i, y); g.lineTo(i, y + s * 34); g.stroke(); }
      for (let k = 0; k <= 34; k += 8) { g.beginPath(); g.moveTo(x0, y + s * k); g.lineTo(x1, y + s * k); g.stroke(); }
      g.lineWidth = 6; g.strokeStyle = bottom ? "#38bdf8" : "#fb923c"; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0, y + s * 34); g.lineTo(x1, y + s * 34); g.lineTo(x1, y); g.stroke();
      g.fillStyle = "#facc15"; g.beginPath(); g.arc(x0, y, 6, 0, 7); g.arc(x1, y, 6, 0, 7); g.fill();
    });
    // rete metallica (sovrapposta ai muri e oltre)
    g.save();
    g.beginPath(); g.rect(-MX, -MY, bw, bh); g.rect(L, T, R - L, B - T); g.clip("evenodd");
    g.strokeStyle = "rgba(180,190,210,.24)"; g.lineWidth = 1;
    for (let k = -bh; k < bw + bh; k += 12) { g.beginPath(); g.moveTo(-MX + k, -MY); g.lineTo(-MX + k + bh, -MY + bh); g.stroke(); g.beginPath(); g.moveTo(-MX + k, -MY + bh); g.lineTo(-MX + k + bh, -MY); g.stroke(); }
    g.restore();
    g.strokeStyle = "#5b6377"; g.lineWidth = 5;
    for (let y = 0; y <= CH; y += 215) { g.beginPath(); g.moveTo(L - 12, y); g.lineTo(L - 12, y + 3); g.moveTo(R + 12, y); g.lineTo(R + 12, y + 3); g.stroke(); }
    // luce dei riflettori
    [[60, 60], [CW - 60, 60], [60, CH - 60], [CW - 60, CH - 60]].forEach(([x, y]) => {
      const rg = g.createRadialGradient(x, y, 10, x, y, 300);
      rg.addColorStop(0, "rgba(255,240,200,.16)"); rg.addColorStop(1, "rgba(255,240,200,0)");
      g.fillStyle = rg; g.fillRect(x - 300, y - 300, 600, 600);
    });
    return c;
  }
  function rnd2(r, a, b) { return a + r() * (b - a); }

  // ---------------------------------------------------------------- partita
  function mkTeam(team, lv) {
    return SLOT.map((s, i) => {
      const h = team === 0 ? HOME[i] : null;
      return {
        team, i, name: team === 0 ? h.name : lv.names[i], role: s.role, bu: s.u, bv: s.v,
        x: xOfV(s.v), y: yOfU(team, s.u), vx: 0, vy: 0, face: team === 0 ? -Math.PI / 2 : Math.PI / 2,
        spd: team === 0 ? h.spd : [4.8, 4.6, 4.4][i], kit: team === 0 ? h.kit : lv.kit, kit2: team === 0 ? h.kit2 : lv.kit2,
        skin: team === 0 ? h.skin : lv.skin[i], hair: team === 0 ? h.hair : ["#1f1a17", "#4a2c12", "#9ca3af"][i],
        stun: 0, cd: 0, dash: 0, dashCd: 0, think: 0, wind: 0, windKind: "", ph: Math.random() * 6, dribT: null,
      };
    });
  }

  function newMatch(li, di) {
    const lv = LEVELS[li < 0 ? 0 : li];
    G = {
      li, lv, D: DIFFS[di], di,
      state: "kickoff", timer: 70, score: [0, 0], t: 0, golden: false,
      tm: [mkTeam(0, lv), mkTeam(1, lv)], pl: [],
      ball: { x: CW / 2, y: CH / 2, vx: 0, vy: 0, owner: null, lastTeam: 0, lastP: null, passTo: null, bounces: 0, fire: 0, rot: 0, trail: [], bankPass: false },
      ctl: null, ctlLock: 0, chase: [null, null],
      grinta: 30, combo: 0, comboT: 0, intesaT: 0, lastPass: null,
      parts: [], flashes: [], shake: 0, flash: 0, zoom: 1, zx: CW / 2, zy: CH / 2,
      stats: { shots: [0, 0], banks: 0, spallate: 0, bestCombo: 0, intese: 0, spGoals: 0 },
      goalTeam: 0, goalT: 0, ended: false, tick: 0, label: "", labelT: 0, hintBank: false, hintTimer: 0,
      FRC: lv.mutKey === "wet" ? 0.9935 : 0.988, E: lv.mutKey === "rubber" ? 1.0 : 0.9,
    };
    G.pl = G.tm[0].concat(G.tm[1]);
    G.ctl = G.tm[0][0];
    G.tm[1].forEach((p) => { p.spd *= lv.spd * G.D.spd; });
    G.tm[0].forEach((p) => { p.spd *= G.D.usr; });
    setupKickoff(0);
    return G;
  }

  function setupKickoff(team) {
    const b = G.ball;
    G.pl.forEach((p) => { p.x = xOfV(p.bv); p.y = yOfU(p.team, p.bu * 0.8); p.vx = p.vy = 0; p.stun = 0; p.cd = 0; p.dash = 0; p.think = 0; p.wind = 0; p.face = p.team === 0 ? -Math.PI / 2 : Math.PI / 2; });
    const k = G.tm[team][0];
    k.x = CW / 2; k.y = CH / 2 - dirY(team) * -30 + dirY(team) * 0; k.y = CH / 2 + (team === 0 ? 32 : -32);
    b.x = CW / 2; b.y = CH / 2; b.vx = b.vy = 0; b.owner = k; b.passTo = null; b.fire = 0; b.bounces = 0; b.lastTeam = team; b.lastP = k; b.trail.length = 0; b.bankPass = false;
    G.state = "kickoff"; G.timer = 70; G.zoom = 1;
    if (team === 0) G.ctl = k;
    G.combo = 0; G.lastPass = null;
    snd("playWhistle", true);
  }

  function say(txt, ms) {
    const el = stage && stage.querySelector(".cgd-msg"); if (!el) return;
    el.textContent = txt; el.style.display = "block"; G.msgT = Math.round((ms || 1400) / 16.67);
  }
  function banner(h, p, bad, ms) {
    const el = stage && stage.querySelector(".cgd-banner"); if (!el) return;
    el.className = "cgd-banner" + (bad ? " bad" : ""); el.innerHTML = `<div class="cgd-bg"><h1>${h}</h1><p>${p || ""}</p></div>`; el.style.display = "block"; G.bannerT = Math.round(ms / 16.67);
  }
  function addGrinta(n) { if (G) G.grinta = clamp(G.grinta + n, 0, 100); }
  function spark(x, y, n, col, sp) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, s = rnd(0.5, sp || 3); G.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(14, 30), max: 30, col, size: rnd(1.4, 3.2) }); } }

  // ---------------------------------------------------------------- calci e passaggi
  function kickBall(p, tx, ty, v0, opts) {
    opts = opts || {};
    const b = G.ball;
    const a = Math.atan2(ty - p.y, tx - p.x);
    b.owner = null; b.x = p.x + Math.cos(a) * (PR + 2); b.y = p.y + Math.sin(a) * (PR + 2);
    b.vx = Math.cos(a) * v0; b.vy = Math.sin(a) * v0; b.lastTeam = p.team; b.lastP = p; b.passTo = opts.to || null; b.fire = opts.fire || 0; b.bounces = 0; b.bankPass = !!opts.bank;
    p.cd = 22; p.face = a; b.trail.length = 0;
    snd("playKick", opts.snd || 1);
  }
  function threatAt(p, x, y) { let m = 999; G.tm[1 - p.team].forEach((q) => { const d = dist(q.x, q.y, x, y); if (d < m) m = d; }); return m; }
  function laneClear(p, tx, ty, r) {
    const dx = tx - p.x, dy = ty - p.y, l2 = dx * dx + dy * dy || 1; let m = 999;
    G.tm[1 - p.team].forEach((q) => { let t = ((q.x - p.x) * dx + (q.y - p.y) * dy) / l2; t = clamp(t, 0, 1); const d = dist(q.x, q.y, p.x + dx * t, p.y + dy * t); if (d < m) m = d; });
    return m > (r || 26);
  }
  const passSpeed = (d) => clamp(7.5 + d * 0.014, 9.5, 16);

  function doPass(p, m) {
    const d = dist(p.x, p.y, m.x, m.y), v0 = passSpeed(d);
    const lead = clamp(d / v0, 0, 20) * 0.5;
    kickBall(p, clamp(m.x + m.vx * lead, L + 10, R - 10), clamp(m.y + m.vy * lead, T + 10, B - 10), v0, { to: m, snd: 0.85 });
    G.lastPass = { from: p, to: m, t: G.t };
    if (p.team === 0) { G.ctl = m; G.ctlLock = 18; }
  }

  // sponda: specchia il bersaglio rispetto al muro laterale; ritorna null se impossibile
  function bankPoint(p, tx, ty, side) {
    const wx = side < 0 ? L + BR : R - BR;
    const mx = wx + (wx - tx) / G.E; // il muro smorza la componente orizzontale: specchio "allungato"
    // il punto di impatto sul muro deve stare dentro al campo
    const t = (wx - p.x) / (mx - p.x);
    if (!(t > 0.03 && t < 0.97)) return null;
    const my = ty, yy = p.y + (my - p.y) * t; // y d'impatto sul muro
    if (yy < T + 30 || yy > B - 30) return null;
    return { x: mx, y: my, ix: wx, iy: yy, len: dist(p.x, p.y, wx, yy) + dist(wx, yy, tx, ty) };
  }
  function bestBank(p, tx, ty, prefer) {
    let best = null;
    [-1, 1].forEach((s) => {
      const bp = bankPoint(p, tx, ty, s);
      if (!bp) return;
      let score = -bp.len;
      if (prefer && prefer !== 0 && Math.sign(prefer) === s) score += 220;
      if (!laneClear(p, bp.ix, bp.iy, 22)) score -= 160;
      if (!best || score > best.score) best = Object.assign({ score, side: s }, bp);
    });
    return best;
  }

  function aimGoal(p, noise, jx) {
    const [x0, x1] = mouth();
    let ax = CW / 2;
    if (jx !== undefined && Math.abs(jx) > 0.25) ax = CW / 2 + clamp(jx, -1, 1) * ((x1 - x0) / 2 - 12);
    else {
      // lato più lontano dal difensore
      const q = G.tm[1 - p.team].reduce((m, c) => (Math.abs(c.x - CW / 2) < Math.abs(m.x - CW / 2) ? c : m), G.tm[1 - p.team][0]);
      ax = CW / 2 + (q.x > CW / 2 ? -1 : 1) * ((x1 - x0) * 0.28);
    }
    ax += rnd(-1, 1) * noise;
    return { x: clamp(ax, x0 + 8, x1 - 8), y: goalY(p.team) };
  }

  function userShoot(p, ch, trab) {
    const jx = input.jx + input.kx;
    let intesa = false;
    if (G.lastPass && G.lastPass.to === p && G.t - G.lastPass.t < 3 && G.lastPass.from.i !== p.i && G.lastPass.from.i < 2 && p.i < 2) intesa = true;
    const tgt = aimGoal(p, intesa ? 0 : 3 + ch * 9, jx);
    let v0 = 11 + 8 * ch;
    if (intesa) { v0 *= 1.12; G.stats.intese++; addGrinta(14); say("DOPPIETTA LEO-NICO!", 1500); spark(p.x, p.y, 20, "#7dd3fc", 4); G.flash = 6; snd("playEmblemCrit"); }
    if (trab) {
      G.grinta = 0;
      kickBall(p, CW / 2, goalY(p.team), 22, { fire: 1, snd: 1.4 });
      G.shake = 10; G.flash = 8; banner("TRABUCCO!", "Niente lo ferma. Nemmeno il buon senso.", false, 1200); snd("playEmblemCrit");
    } else kickBall(p, tgt.x, tgt.y, v0, { snd: 0.9 + ch * 0.4 });
    G.stats.shots[0]++;
  }
  function aiShoot(p) {
    const tgt = aimGoal(p, G.lv.noise + G.D.noise, undefined);
    kickBall(p, tgt.x, tgt.y, rnd(11, 14.5), { snd: 1 });
    G.stats.shots[1]++;
  }

  function mates(p) { return G.tm[p.team].filter((m) => m !== p); }
  function passScore(p, m, hint) {
    const d = dist(p.x, p.y, m.x, m.y);
    if (d < 50 || d > 640) return -9;
    const adv = (uOf(p.team, m.y) - uOf(p.team, p.y)) * LENY;
    const open = clamp(threatAt(p, m.x, m.y), 0, 120) / 120;
    const lane = laneClear(p, m.x, m.y, 26) ? 1 : -0.7;
    let s = adv * 0.003 + open * 0.9 + lane * 0.7 - d * 0.0004;
    if (hint) { const al = ((m.x - p.x) * hint.x + (m.y - p.y) * hint.y) / d; s = al * 2.2 + open * 0.3 + lane * 0.3; if (al < 0.3) s -= 5; }
    return s;
  }
  function bestPass(p, hint) {
    let best = null, bs = -99;
    mates(p).forEach((m) => { const s = passScore(p, m, hint); if (s > bs) { bs = s; best = m; } });
    return best ? { m: best, score: bs } : null;
  }

  // ---------------------------------------------------------------- movimento
  function moveTo(p, tx, ty, mul, tight) {
    const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
    let sp = p.spd * (mul || 1);
    if (d < 36 && !tight) sp *= Math.max(0.15, d / 36);
    const wx = d > 2 ? (dx / d) * sp : 0, wy = d > 2 ? (dy / d) * sp : 0;
    p.vx += (wx - p.vx) * 0.24; p.vy += (wy - p.vy) * 0.24;
  }
  function integrate(p) {
    if (p.stun > 0) { p.stun--; p.vx *= 0.82; p.vy *= 0.82; }
    p.x = clamp(p.x + p.vx, L + PR, R - PR); p.y = clamp(p.y + p.vy, T + PR, B - PR);
    if (p.cd > 0) p.cd--; if (p.dashCd > 0) p.dashCd--;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > 0.5) { p.face = Math.atan2(p.vy, p.vx); p.ph += sp * 0.12; }
  }
  function startDash(p, tx, ty) {
    if (p.dashCd > 0 || p.stun > 0 || p.dash > 0) return false;
    p.dash = 12; p.dashCd = 56; p.face = Math.atan2(ty - p.y, tx - p.x);
    snd("playTackle"); return true;
  }
  function dashStep(p) {
    p.dash--;
    p.vx = Math.cos(p.face) * p.spd * 2.5; p.vy = Math.sin(p.face) * p.spd * 2.5;
    if (p.dash === 0) p.stun = 9;
    // contatto
    G.tm[1 - p.team].forEach((q) => {
      if (q.stun > 18) return;
      if (dist(p.x, p.y, q.x, q.y) < PR * 2 + 4) {
        q.stun = 38; q.vx = Math.cos(p.face) * 5; q.vy = Math.sin(p.face) * 5; G.shake = Math.max(G.shake, 4);
        G.stats.spallate += p.team === 0 ? 1 : 0;
        spark(q.x, q.y, 10, "#fde68a", 3); snd("playTackle");
        if (G.ball.owner === q) { if (Math.random() < 0.88) { G.ball.owner = p; G.ball.lastTeam = p.team; G.ball.lastP = p; G.ball.passTo = null; q.cd = 50; if (p.team === 0) { addGrinta(9); say("Spallata! Palla tua", 800); G.ctl = p; G.ctlLock = 12; } } }
        p.dash = 0; p.stun = 4;
      }
    });
  }

  // ---------------------------------------------------------------- IA
  function computeChasers() {
    const b = G.ball, ref = b.owner ? b.owner : { x: b.x + b.vx * 6, y: b.y + b.vy * 6 };
    for (let t = 0; t < 2; t++) {
      let best = null, bd = 1e9;
      G.tm[t].forEach((p) => { if (p === G.ctl) return; const d = dist(p.x, p.y, ref.x, ref.y); if (d < bd) { bd = d; best = p; } });
      G.chase[t] = best;
    }
  }
  function formTarget(p, hasPoss) {
    const b = G.ball, t = p.team, bu = uOf(t, b.y), bv = (b.x - L) / (R - L);
    let u = p.bu + (bu - 0.5) * 0.34 + (hasPoss ? 0.17 : -0.05), v = p.bv + (bv - 0.5) * 0.4;
    if (hasPoss && p.role !== "Muro") v = p.role === "Fronte" ? (bv < 0.5 ? 0.74 : 0.26) : (bv < 0.5 ? 0.3 : 0.7);
    u = p.role === "Muro" ? clamp(u, 0.1, 0.42) : clamp(u, 0.25, 0.9);
    return { x: xOfV(clamp(v, 0.12, 0.88)), y: yOfU(t, u) };
  }

  function updateAI(p) {
    const b = G.ball;
    if (p.stun > 0) { integrate(p); return; }
    if (p.dash > 0) { dashStep(p); integrate(p); return; }
    if (b.owner === p) { aiCarrier(p); integrate(p); return; }
    if (b.passTo === p && !b.owner) { moveTo(p, b.x + b.vx * 6, b.y + b.vy * 6, 1.05, true); integrate(p); return; }
    if (p.role === "Muro" && !b.owner && (p.team === 0 ? b.vy > 2 : b.vy < -2)) { // legge la traiettoria (anche dopo la sponda) e chiude la porta
      const yl = yOfU(p.team, 0.12), dt = (yl - b.y) / b.vy;
      if (dt > 0 && dt < 75) {
        const read = clamp(G.lv.read + (p.team === 1 ? [-0.25, 0, 0.1][G.di] : 0.3), 0, 1);
        if (p.errFor !== b.lastP || p.errBall !== b.bounces) { p.errFor = b.lastP; p.errBall = b.bounces; p.readErr = rnd(-1, 1) * (1 - read) * 100; }
        let xp = b.x + b.vx * dt; const lo = L + BR, hi = R - BR;
        for (let k = 0; k < 3; k++) { if (xp < lo) xp = 2 * lo - xp; else if (xp > hi) xp = 2 * hi - xp; }
        moveTo(p, clamp(xp + p.readErr, CW / 2 - 80, CW / 2 + 80), yl, 1.05 + 0.3 * read, true); integrate(p); return;
      }
    }
    const ot = b.owner ? b.owner.team : -1;
    if (ot !== p.team) {
      const ref = b.owner || { x: b.x + b.vx * 5, y: b.y + b.vy * 5 };
      if (p === G.chase[p.team] && p.role !== "Muro" || (p === G.chase[p.team] && dist(p.x, p.y, ref.x, ref.y) < 200)) {
        moveTo(p, ref.x, ref.y, 1, true);
        if (b.owner && p.team === 1 && dist(p.x, p.y, ref.x, ref.y) < 70 && Math.random() < G.lv.dash + (G.di * 0.003)) startDash(p, ref.x, ref.y);
        if (b.owner && p.team === 0 && dist(p.x, p.y, ref.x, ref.y) < 60 && Math.random() < 0.006) startDash(p, ref.x, ref.y);
      } else {
        const f = formTarget(p, false);
        if (p.role === "Muro") { // si piazza sulla linea palla-porta, a guardia della bocca
          const gx = CW / 2, gy = ownY(p.team), bx = ref.x - gx, by = ref.y - gy, bl = Math.hypot(bx, by) || 1, off = clamp(bl * 0.22, 46, 92);
          f.x = clamp(gx + bx / bl * off, CW / 2 - 70, CW / 2 + 70); f.y = gy + dirY(p.team) * Math.max(26, Math.abs(by / bl) * off);
        }
        moveTo(p, f.x, f.y, p.role === "Muro" ? 1.12 : 0.9, p.role === "Muro");
      }
    } else { const f = formTarget(p, true); moveTo(p, f.x, f.y, 0.95); }
    integrate(p);
  }

  function aiCarrier(p) {
    const b = G.ball, t = p.team;
    if (G.state !== "play") { p.vx *= 0.7; p.vy *= 0.7; return; }
    const gy = goalY(t);
    if (p.wind > 0) { // preparazione del tiro: si ferma un attimo, si può contrastare
      p.wind--; p.vx *= 0.6; p.vy *= 0.6;
      if (p.wind === 0) {
        if (p.windKind === "bank") {
          const [x0, x1] = mouth();
          const bb = bestBank(p, CW / 2 + rnd(-1, 1) * (x1 - x0) * 0.3 + rnd(-1, 1) * (G.lv.noise + G.D.noise), gy, 0);
          if (bb && bb.len < 900) { kickBall(p, bb.x, bb.y, clamp(9.5 + bb.len * 0.011, 10.5, 15.5), { bank: true, snd: 1 }); G.stats.shots[1]++; return; }
        }
        aiShoot(p);
      }
      return;
    }
    if (p.think > 0) { p.think--; const tg = p.dribT || { x: CW / 2, y: gy }; moveTo(p, tg.x, tg.y, 0.94, true); return; }
    p.think = Math.max(5, G.lv.react + G.D.react + Math.floor(Math.random() * 5));
    const dg = dist(p.x, p.y, CW / 2, gy), near = threatAt(p, p.x, p.y);
    if (t === 1) {
      const wl = Math.max(10, 20 - G.di * 3 - (G.li >= 2 ? 3 : 0));
      if (dg < 330 && laneClear(p, CW / 2, gy, 24) && Math.abs(p.x - CW / 2) < 230) { p.wind = wl; p.windKind = "shoot"; return; }
      if (dg < 170) { p.wind = Math.round(wl * 0.6); p.windKind = "shoot"; return; }
      if (dg > 230 && uOf(1, p.y) > 0.3 && Math.random() < G.lv.bank + G.di * 0.04) { p.wind = wl; p.windKind = "bank"; return; }
    }
    const pass = bestPass(p);
    if (pass && ((near < 56 && pass.score > 0.2) || (pass.score > 1.2 && Math.random() < 0.4))) { if (t === 0 && p === G.ctl) return; doPass(p, pass.m); return; }
    let ax = 0;
    G.tm[1 - t].forEach((q) => { const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy); if (d < 110 && dy * dirY(t) > -10) { const w = (110 - d) / 110; ax -= Math.sign(dx || (Math.random() - 0.5)) * w * 170; } });
    p.dribT = { x: clamp(CW / 2 + (p.x - CW / 2) * 0.4 + ax, L + 30, R - 30), y: gy };
  }

  // ---------------------------------------------------------------- utente
  function userUpdate(p) {
    const b = G.ball;
    if (p.stun > 0) { integrate(p); return; }
    if (p.dash > 0) { dashStep(p); integrate(p); return; }
    let jx = input.jx + input.kx, jy = input.jy + input.ky, mag = Math.hypot(jx, jy);
    if (input.touchOn && SET.ctrl === "touch") {
      const dx = input.tx - p.x, dy = input.ty - p.y, d = Math.hypot(dx, dy);
      if (d > 10) { jx = dx / d; jy = dy / d; mag = Math.min(1, d / 36); } else { jx = jy = mag = 0; }
    }
    if (mag > 1) { jx /= mag; jy /= mag; mag = 1; }
    const sp = p.spd * (b.owner === p ? 0.95 : 1);
    if (mag > 0.12) { const m2 = Math.min(1, mag * 1.15); p.vx += (jx / mag * sp * m2 - p.vx) * 0.3; p.vy += (jy / mag * sp * m2 - p.vy) * 0.3; }
    else { p.vx *= 0.7; p.vy *= 0.7; }
    integrate(p);
  }

  function canTouch(p) { const b = G.ball; return b.owner === p || (!b.owner && dist(p.x, p.y, b.x, b.y) < 34 && p.cd <= 0); }

  function userActions() {
    const p = G.ctl, b = G.ball;
    if (G.state !== "play" && G.state !== "kickoff") { input.passEdge = input.bankEdge = input.shootRel = input.trab = false; return; }
    if (input.charging) input.chargeF++;
    const touch = canTouch(p);
    if (input.passEdge) {
      input.passEdge = false;
      if (touch) {
        let hint = null; const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
        if (mg > 0.3) hint = { x: jx / mg, y: jy / mg };
        const bp = bestPass(p, hint) || bestPass(p);
        if (bp) { doPass(p, bp.m); addGrinta(1.5); }
      } else {
        const o = b.owner && b.owner.team === 1 ? b.owner : null;
        const tx = o ? o.x : b.x, ty = o ? o.y : b.y;
        startDash(p, dist(p.x, p.y, tx, ty) < 240 ? tx : p.x + Math.cos(p.face) * 80, dist(p.x, p.y, tx, ty) < 240 ? ty : p.y + Math.sin(p.face) * 80);
      }
    }
    if (input.bankEdge) {
      input.bankEdge = false;
      if (touch) userBank(p);
    }
    if (input.shootRel) {
      input.shootRel = false;
      const ch = clamp(input.chargeF / 30, 0.2, 1); input.chargeF = 0;
      if (touch) userShoot(p, ch, false);
    }
    if (input.trab) { input.trab = false; if (G.grinta >= 100 && touch) userShoot(p, 1, true); }
  }

  function userBank(p) {
    const jx = input.jx + input.kx;
    const [x0, x1] = mouth();
    const inAtt = uOf(0, p.y) > 0.42;
    let tx, ty, to = null;
    if (inAtt) { tx = CW / 2 + rnd(-1, 1) * (x1 - x0) * 0.3 + rnd(-1, 1) * 9; ty = goalY(0); }
    else {
      const bp = bestPass(p, null); if (!bp) { tx = CW / 2; ty = goalY(0); } else { to = bp.m; tx = to.x; ty = to.y; }
    }
    const bb = bestBank(p, tx, ty, jx > 0.3 ? 1 : jx < -0.3 ? -1 : 0);
    if (!bb) { // nessuna sponda utile: tiro/passaggio normale
      if (to) doPass(p, to); else userShoot(p, 0.7, false);
      return;
    }
    const v0 = clamp(10.5 + bb.len * 0.0115, 11, 17.5);
    kickBall(p, bb.x, bb.y, v0, { bank: true, to, snd: 1 });
    if (to) { G.lastPass = { from: p, to, t: G.t }; G.ctl = to; G.ctlLock = 25; G.ball.bankPass = true; } else G.stats.shots[0]++;
    G.stats.banks++;
  }

  // ---------------------------------------------------------------- palla
  function wallFlash(x, y, vertical) { G.flashes.push({ x, y, v: vertical, life: 14 }); }
  function updateBall() {
    const b = G.ball;
    b.rot += Math.hypot(b.vx, b.vy) * 0.09;
    if (b.owner) {
      const o = b.owner;
      const ox = o.x + Math.cos(o.face) * (PR + 5), oy = o.y + Math.sin(o.face) * (PR + 5);
      b.x += (ox - b.x) * 0.5; b.y += (oy - b.y) * 0.5; b.vx = o.vx; b.vy = o.vy; b.lastTeam = o.team; b.lastP = o; b.fire = 0;
      b.x = clamp(b.x, L + BR, R - BR); b.y = clamp(b.y, T + BR, B - BR);
      return;
    }
    const sp0 = Math.hypot(b.vx, b.vy);
    b.vx *= G.FRC; b.vy *= G.FRC;
    b.x += b.vx; b.y += b.vy;
    if (b.fire || sp0 > 12) { b.trail.unshift({ x: b.x, y: b.y }); if (b.trail.length > 12) b.trail.pop(); } else if (b.trail.length) b.trail.pop();
    if (b.fire) {
      if (Math.random() < 0.7) G.parts.push({ x: b.x, y: b.y, vx: rnd(-.6, .6), vy: rnd(-.6, .6), life: 18, max: 18, col: "#fb923c", size: 3 });
      G.pl.forEach((q) => { if (q.team !== b.lastTeam && q.stun < 20 && dist(q.x, q.y, b.x, b.y) < PR + BR + 4) { q.stun = 46; q.vx = b.vx * 0.35; q.vy = b.vy * 0.35; spark(q.x, q.y, 10, "#fde047", 4); snd("playTackle"); } });
      if (Math.hypot(b.vx, b.vy) < 9) b.fire = 0;
    }
    // cap velocità
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > 24) { b.vx *= 24 / sp; b.vy *= 24 / sp; }
    // muri laterali
    const E = G.E;
    if (b.x < L + BR) { b.x = L + BR; b.vx = Math.abs(b.vx) * E; onBounce(b.x - BR, b.y, true); }
    else if (b.x > R - BR) { b.x = R - BR; b.vx = -Math.abs(b.vx) * E; onBounce(b.x + BR, b.y, true); }
    // porte / muri alto e basso
    const [x0, x1] = mouth();
    if (G.state === "play") {
      if (b.y < T + BR || b.y > B - BR) {
        const top = b.y < CH / 2;
        const inMouth = b.x > x0 + 6 && b.x < x1 - 6;
        if (inMouth) {
          if ((top && b.y < T - 2) || (!top && b.y > B + 2)) { goalScored(top ? 0 : 1); return; }
        } else {
          if (top) { b.y = T + BR; b.vy = Math.abs(b.vy) * E; } else { b.y = B - BR; b.vy = -Math.abs(b.vy) * E; }
          onBounce(b.x, top ? T : B, false);
        }
      }
      // pali
      [x0, x1].forEach((px) => { [T, B].forEach((py) => { const d = dist(b.x, b.y, px, py); if (d < BR + 5) { const nx = (b.x - px) / (d || 1), ny = (b.y - py) / (d || 1); const dot = b.vx * nx + b.vy * ny; if (dot < 0) { b.vx -= 1.9 * dot * nx; b.vy -= 1.9 * dot * ny; b.x = px + nx * (BR + 5); b.y = py + ny * (BR + 5); snd("playPost"); G.shake = Math.max(G.shake, 4); say("PALO!", 700); spark(px, py, 8, "#fff", 3); } } }); });
    }
  }
  function onBounce(x, y, vertical) {
    const b = G.ball;
    b.bounces++;
    snd("playWall"); wallFlash(x, y, vertical);
    spark(x, y, 5, "#fde68a", 2.2);
    if (b.lastTeam === 0) addGrinta(2.5);
  }

  function pickups() {
    const b = G.ball;
    if (b.owner || G.state !== "play") return;
    let best = null, bd = 1e9; const sp = Math.hypot(b.vx, b.vy);
    G.pl.forEach((p) => {
      if (p.stun > 0 || p.cd > 0 || p.dash > 0) return;
      if (b.fire && p.team !== b.lastTeam) return;
      let R2 = PR + BR + 3; if (b.passTo === p) R2 += 8; if (p === G.ctl) R2 += 3; if (sp > 16) R2 -= 5;
      const d = dist(p.x, p.y, b.x, b.y);
      if (d < R2 && d < bd) { bd = d; best = p; }
    });
    if (best) {
      const prev = b.lastTeam, prevPass = G.lastPass, bounced = b.bounces > 0;
      b.owner = best; b.lastTeam = best.team; b.lastP = best; b.fire = 0;
      if (best.team === 0) {
        G.ctl = best;
        if (prevPass && prevPass.to === best && prev === 0) {
          addGrinta(4);
          if (bounced && b.bankPass) { G.combo++; G.comboT = 360; addGrinta(7); say(G.combo >= 2 ? `Sponda! Combo x${G.combo}` : "Sponda!", 1000); if (G.combo > G.stats.bestCombo) G.stats.bestCombo = G.combo; }
          if (prevPass.from.i !== best.i && prevPass.from.i < 2 && best.i < 2) { G.intesaT = 150; addGrinta(4); say("Una-due Leo-Nico!", 900); }
        }
      } else if (prev === 0 && G.combo) { G.combo = 0; }
      b.passTo = null; b.bounces = 0; b.bankPass = false;
    }
  }

  // ---------------------------------------------------------------- gol
  function goalScored(scoreFor) {
    const b = G.ball, scorer = b.lastTeam === scoreFor ? b.lastP : null;
    const bounced = b.bounces > 0 && b.lastTeam === scoreFor;
    let pts = 1 + (bounced ? 1 : 0);
    if (b.fire) pts = Math.max(pts, 2);
    G.score[scoreFor] += pts; G.goalTeam = scoreFor; G.goalPts = pts;
    G.state = "goal"; G.goalT = 0; G.shake = 11; G.flash = 8;
    G.zx = b.x; G.zy = b.y < CH / 2 ? T + 95 : B - 95;
    spark(b.x, b.y, 36, scoreFor === 0 ? "#7dd3fc" : "#fdba74", 5);
    snd("playGoal");
    const nm = scorer ? scorer.name : "Autorete";
    const tag = b.fire ? "TRABUCCO " : bounced ? "SPONDA " : "";
    if (scoreFor === 0) { banner(pts > 1 ? `${tag}+${pts}!` : "GOOOL!", `${nm} · ${fmtTime()}`, false, 1900); if (bounced) G.stats.spGoals++; }
    else banner(pts > 1 ? `${tag}+${pts} ${G.lv.tag}` : "GOL " + G.lv.tag, `${nm} · ${fmtTime()}`, true, 1700);
    if (scoreFor === 1) addGrinta(12);
    b.owner = null; b.passTo = null; b.fire = 0; b.vx *= 0.3; b.vy *= 0.3;
    G.combo = 0;
  }
  function fmtTime() { const s = Math.min(MATCH_SECS, Math.floor(G.t)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }

  // ---------------------------------------------------------------- step
  function step() {
    G.tick++;
    if (G.shake > 0) G.shake *= 0.9;
    if (G.flash > 0) G.flash--;
    if (G.msgT > 0 && --G.msgT === 0) { const el = stage.querySelector(".cgd-msg"); if (el) el.style.display = "none"; }
    if (G.bannerT > 0 && --G.bannerT === 0) { const el = stage.querySelector(".cgd-banner"); if (el) el.style.display = "none"; }
    for (let i = G.parts.length - 1; i >= 0; i--) { const q = G.parts[i]; q.x += q.vx; q.y += q.vy; q.life--; if (q.life <= 0) G.parts.splice(i, 1); }
    for (let i = G.flashes.length - 1; i >= 0; i--) { if (--G.flashes[i].life <= 0) G.flashes.splice(i, 1); }
    if (G.ctlLock > 0) G.ctlLock--;
    if (G.comboT > 0 && --G.comboT === 0) G.combo = 0;
    if (G.intesaT > 0) G.intesaT--;
    const st = G.state;
    if (st === "end") return;
    if (st === "kickoff") {
      G.timer--; G.pl.forEach(integrate); updateBall();
      const moved = Math.abs(input.jx + input.kx) + Math.abs(input.jy + input.ky) > 0.3 || input.passEdge || input.shootRel || input.touchOn || input.bankEdge;
      if (G.timer <= 0 || (G.ball.owner && G.ball.owner.team === 0 && moved)) { G.state = "play"; G.timer = 0; }
      return;
    }
    if (st === "goal") {
      G.goalT++;
      const b = G.ball; b.vx *= 0.88; b.vy *= 0.88; b.x += b.vx; b.y += b.vy; b.x = clamp(b.x, CW / 2 - ghw() + 8, CW / 2 + ghw() - 8); b.y = clamp(b.y, T - 30, B + 30);
      G.pl.forEach((p) => { p.vx *= 0.9; p.vy *= 0.9; integrate(p); });
      if (G.goalT > 62) afterGoal();
      return;
    }
    // play
    G.t += STEP * (DEBUG && window.__cgdTS ? window.__cgdTS : 1);
    const target = G.lv.target;
    if (G.score[0] >= target || G.score[1] >= target) { endMatch(); return; }
    if (G.t >= MATCH_SECS && !G.golden) {
      if (G.score[0] !== G.score[1]) { endMatch(); return; }
      G.golden = true; banner("PUNTO D'ORO", "Il prossimo punto vince", false, 1600); snd("playWhistle", true);
    }
    if (G.golden && G.t >= MATCH_SECS + 30) { endMatch(); return; }
    chooseControl(); computeChasers();
    G.pl.forEach((p) => { if (p === G.ctl) userUpdate(p); else updateAI(p); });
    separate(); updateBall(); if (G.state !== "play") return;
    userActions(); pickups();
    if (G.li <= 0 && !G.hintBank && G.t > 14) { G.hintBank = true; say("Prova SPONDA: la palla rimbalza sul muro e vale doppio!", 3200); }
  }

  function chooseControl() {
    const b = G.ball;
    if (b.owner && b.owner.team === 0) { G.ctl = b.owner; return; }
    if (b.passTo && b.passTo.team === 0 && !b.owner) { G.ctl = b.passTo; return; }
    if (G.ctlLock > 0) return;
    const ref = b.owner ? b.owner : { x: b.x + b.vx * 6, y: b.y + b.vy * 6 };
    let best = null, bd = 1e9;
    G.tm[0].forEach((p) => { const d = dist(p.x, p.y, ref.x, ref.y); if (d < bd) { bd = d; best = p; } });
    const cd = dist(G.ctl.x, G.ctl.y, ref.x, ref.y);
    if (best !== G.ctl && bd < cd - 30) { G.ctl = best; G.ctlLock = 12; }
  }
  function separate() {
    const pl = G.pl;
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
      const a = pl[i], c = pl[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy);
      if (d < PR * 2 && d > 0.01) { const o = (PR * 2 - d) * 0.3; a.x -= dx / d * o; a.y -= dy / d * o; c.x += dx / d * o; c.y += dy / d * o; }
    }
  }
  function afterGoal() {
    const el = stage.querySelector(".cgd-banner"); if (el) el.style.display = "none";
    if (G.golden || G.score[0] >= G.lv.target || G.score[1] >= G.lv.target) { endMatch(); return; }
    setupKickoff(1 - G.goalTeam);
  }
  function endMatch() {
    if (G.ended) return;
    G.ended = true; G.state = "end"; snd("playWhistle", true);
    banner("FINE!", `${G.score[0]} - ${G.score[1]}`, false, 2200);
    later(() => { if (!closed) showResult(); }, 1600);
  }

  // ---------------------------------------------------------------- render
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; vigKey = ""; }
    return dpr;
  }
  function drawPlayer(g, p, isCtl, tick) {
    const x = p.x, y = p.y, sp = Math.hypot(p.vx, p.vy), sw = sp > 0.6 ? Math.sin(p.ph) * 4 : 0;
    g.fillStyle = "rgba(0,0,0,.38)"; g.beginPath(); g.ellipse(x, y + 12, 13, 5.5, 0, 0, 7); g.fill();
    if (isCtl) { g.strokeStyle = "#facc15"; g.lineWidth = 2.6; g.beginPath(); g.ellipse(x, y + 12, 18, 8.5, 0, 0, 7); g.stroke(); }
    if (p.dash > 0) { g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(p.face) * 28, y - Math.sin(p.face) * 28); g.stroke(); }
    g.fillStyle = "#e5e7eb"; g.fillRect(x - 6, y + 2 + (sw > 0 ? 0 : 1), 4.6, 9 + sw * 0.4); g.fillRect(x + 1.5, y + 2 + (sw > 0 ? 1 : 0), 4.6, 9 - sw * 0.4);
    g.fillStyle = "#111827"; g.fillRect(x - 6, y + 10 + sw * 0.4, 5.2, 3.2); g.fillRect(x + 1.5, y + 10 - sw * 0.4, 5.2, 3.2);
    const lean = Math.cos(p.face) * 1.6;
    g.fillStyle = p.kit; g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10.5, 10, 0, 0, 7); g.fill();
    g.fillStyle = p.kit2; g.fillRect(x - 10.5 + lean * 0.5, y - 6, 21, 2.8);
    g.fillStyle = p.skin; g.beginPath(); g.arc(x - 11 + lean, y - 3 + sw * 0.3, 2.8, 0, 7); g.arc(x + 11 + lean, y - 3 - sw * 0.3, 2.8, 0, 7); g.fill();
    g.beginPath(); g.arc(x + lean, y - 17, 6.4, 0, 7); g.fill();
    g.fillStyle = p.hair; g.beginPath(); g.arc(x + lean, y - 19, 6.6, Math.PI, 0); g.fill();
    if (p.name === "Dario") { g.fillStyle = "#facc15"; g.fillRect(x + lean - 6.6, y - 21, 13.2, 3); }
    if (p.name === "Mastro Cavalletto") { g.fillStyle = "#facc15"; g.beginPath(); g.arc(x + lean, y - 20, 7, Math.PI, 0); g.fill(); g.fillRect(x + lean - 8, y - 20, 16, 2); }
    g.fillStyle = "#111"; g.fillRect(x + lean + Math.cos(p.face) * 2.4 - 0.8, y - 16.5, 1.7, 1.9);
    if (p.wind > 0) { g.fillStyle = "#ef4444"; g.font = "900 18px system-ui"; g.textAlign = "center"; g.fillText("!", x, y - 30 - Math.sin(tick * 0.5) * 2); }
    if (p.stun > 8) { g.fillStyle = "#fde047"; g.font = "bold 11px sans-serif"; g.textAlign = "center"; g.fillText("✦", x + 5, y - 28 - Math.sin(tick * 0.4) * 2); }
    if (isCtl) {
      const yy = y - 34 + Math.sin(tick * 0.18) * 2;
      g.fillStyle = "#facc15"; g.beginPath(); g.moveTo(x - 6, yy - 8); g.lineTo(x + 6, yy - 8); g.lineTo(x, yy); g.closePath(); g.fill();
      g.font = "bold 11px system-ui"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,.8)"; g.strokeText(p.name, x, yy - 12); g.fillStyle = "#fff"; g.fillText(p.name, x, yy - 12);
    }
  }

  function render() {
    const dpr = resize(), g = cx, cw = cv.width / dpr, ch = cv.height / dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#0a0e17"; g.fillRect(0, 0, cw, ch);
    if (!G) return;
    const narrow = G.lv.mutKey === "narrow";
    if (!bgCache || bgCache._n !== narrow) { bgCache = buildBg(narrow); bgCache._n = narrow; }
    const b = G.ball;
    let s = Math.min(cw / (CW + 30), ch / (CH + 30));
    if (cw > ch) s = Math.max(s, Math.min(cw / (CW + 30), ch / 620)); // in orizzontale ingrandisce e segue la palla
    // zoom cinematografico sul gol
    let fx = CW / 2, fy = CH / 2;
    if (G.state === "goal") { const k = Math.min(1, G.goalT / 25); const z = 1 + 0.55 * k; s *= z; fx = CW / 2 + (G.zx - CW / 2) * k; fy = CH / 2 + (G.zy - CH / 2) * 0.85 * k; }
    // se la vista è più stretta del campo, segue la palla
    const vw2 = cw / (2 * s), vh2 = ch / (2 * s);
    if (vw2 < CW / 2 + 15) fx = clamp(b.x, vw2 - 15, CW - vw2 + 15);
    if (vh2 < CH / 2 + 15) fy = clamp(G.state === "goal" ? fy : b.y, vh2 - 15, CH - vh2 + 15);
    else if (G.state !== "goal") fy = CH / 2 + (vh2 * 2 - (CH + 30)) * 0.36; // lascia libera la porta di casa sopra i pulsanti
    let shx = 0, shy = 0; if (G.shake > 0.3) { shx = rnd(-1, 1) * G.shake; shy = rnd(-1, 1) * G.shake; }
    G.view = { s, cw, ch, cx: fx + shx / s, cy: fy + shy / s };
    g.save();
    g.translate(cw / 2, ch / 2); g.scale(s, s); g.translate(-G.view.cx, -G.view.cy);
    g.drawImage(bgCache, -MX, -MY);

    // lampi sui muri
    G.flashes.forEach((f) => { const a = f.life / 14; g.strokeStyle = `rgba(253,230,138,${a})`; g.lineWidth = 5 * a + 1; g.lineCap = "round"; g.beginPath(); if (f.v) { g.moveTo(f.x, f.y - 30); g.lineTo(f.x, f.y + 30); } else { g.moveTo(f.x - 30, f.y); g.lineTo(f.x + 30, f.y); } g.stroke(); });

    // guida alla mira / passaggio per l'utente
    if (G.state === "play" && b.owner === G.ctl) {
      const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
      const bp = bestPass(G.ctl, mg > 0.3 ? { x: jx / mg, y: jy / mg } : null) || bestPass(G.ctl);
      if (bp) { const m = bp.m; g.strokeStyle = "rgba(163,230,53,.9)"; g.lineWidth = 2.4; g.setLineDash([6, 6]); g.lineDashOffset = -G.tick * 0.5; g.beginPath(); g.ellipse(m.x, m.y + 12, 20, 9, 0, 0, 7); g.stroke(); g.setLineDash([]); }
      if (uOf(0, G.ctl.y) > 0.4) {
        const bb = bestBank(G.ctl, CW / 2, goalY(0), jx > 0.3 ? 1 : jx < -0.3 ? -1 : 0);
        if (bb) { g.strokeStyle = "rgba(56,189,248,.35)"; g.lineWidth = 2; g.setLineDash([4, 8]); g.beginPath(); g.moveTo(G.ctl.x, G.ctl.y); g.lineTo(bb.ix, bb.iy); g.lineTo(CW / 2, goalY(0)); g.stroke(); g.setLineDash([]); }
      }
    }
    // giocatori + palla ordinati per y
    const list = G.pl.map((p) => ({ y: p.y, p })); list.push({ y: b.y + 0.1, ball: true });
    list.sort((a, c) => a.y - c.y);
    list.forEach((o) => {
      if (o.ball) {
        g.fillStyle = "rgba(0,0,0,.4)"; g.beginPath(); g.ellipse(b.x, b.y + 4, 7, 3.4, 0, 0, 7); g.fill();
        const bounced = b.bounces > 0 && !b.owner;
        b.trail.forEach((t, i) => { g.fillStyle = b.fire ? `rgba(251,146,60,${0.6 - i * 0.045})` : bounced ? `rgba(125,211,252,${0.45 - i * 0.035})` : `rgba(255,255,255,${0.3 - i * 0.022})`; g.beginPath(); g.arc(t.x, t.y - 4, 6 - i * 0.4, 0, 7); g.fill(); });
        g.save(); g.translate(b.x, b.y - 4); g.rotate(b.rot);
        g.fillStyle = b.fire ? "#fde68a" : "#fff"; g.beginPath(); g.arc(0, 0, BR, 0, 7); g.fill();
        g.fillStyle = b.fire ? "#dc2626" : "#1d4ed8"; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(Math.cos(a) * 4.2, Math.sin(a) * 4.2, 1.9, 0, 7); g.fill(); }
        g.beginPath(); g.arc(0, 0, 2, 0, 7); g.fill(); g.restore();
        g.strokeStyle = "#111"; g.lineWidth = 1.1; g.beginPath(); g.arc(b.x, b.y - 4, BR, 0, 7); g.stroke();
      } else drawPlayer(g, o.p, o.p === G.ctl && G.state !== "end", G.tick);
    });
    G.parts.forEach((q) => { g.globalAlpha = Math.max(0, q.life / q.max); g.fillStyle = q.col; g.beginPath(); g.arc(q.x, q.y, q.size, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    if (input.charging && G.ctl) { const c = clamp(input.chargeF / 30, 0, 1), px = G.ctl.x, py = G.ctl.y - 48; g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(px - 20, py, 40, 6); g.fillStyle = c > 0.85 ? "#ef4444" : "#fde047"; g.fillRect(px - 19, py + 1, 38 * c, 4); }
    g.restore();

    const key = cw + "x" + ch;
    if (vigKey !== key) { vigCache = g.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.4, cw / 2, ch / 2, Math.max(cw, ch) * 0.78); vigCache.addColorStop(0, "rgba(0,0,0,0)"); vigCache.addColorStop(1, "rgba(0,0,0,.5)"); vigKey = key; }
    g.fillStyle = vigCache; g.fillRect(0, 0, cw, ch);
    if (G.flash > 0) { g.fillStyle = `rgba(255,255,255,${G.flash * 0.04})`; g.fillRect(0, 0, cw, ch); }
    if (G.state === "kickoff" && G.timer > 0) { g.font = "bold 14px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(0,0,0,.65)"; g.fillRect(cw / 2 - 100, ch * 0.5 - 12, 200, 26); g.fillStyle = "#fde047"; g.fillText("Muoviti o passa per iniziare", cw / 2, ch * 0.5 + 6); }
    if (G.intesaT > 0) { g.font = "bold 12px system-ui"; g.textAlign = "center"; g.fillStyle = "#7dd3fc"; g.fillText("INTESA PRONTA: tira!", cw / 2, ch - 10); }
  }

  function hud() {
    if (!G || !root) return;
    const sc = root.querySelector(".cgd-sc");
    const left = Math.max(0, Math.ceil(MATCH_SECS - G.t));
    sc.querySelector("b").innerHTML = `<span class="cgd-ta">RON</span> ${G.score[0]} - ${G.score[1]} <span class="cgd-tb">${G.lv.tag}</span>`;
    sc.querySelector("small").textContent = `A ${G.lv.target} punti · ${G.golden ? "PUNTO D'ORO" : Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0")} · ${DIFFS[G.di].n}`;
    const gb = root.querySelector(".cgd-bar");
    gb.firstElementChild.style.width = G.grinta + "%"; gb.classList.toggle("full", G.grinta >= 100);
    root.querySelector(".cgd-cmb").textContent = G.combo >= 2 ? "COMBO x" + G.combo : "";
    root.querySelector(".cgd-b.trab").classList.toggle("on", G.grinta >= 100 && G.state === "play");
    const chg = root.querySelector(".cgd-chg"); chg.style.display = "none"; // la barra è nel campo
  }

  function loop(ts) {
    if (closed) return;
    raf = requestAnimationFrame(loop);
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000; lastTs = ts; if (dt > 0.1) dt = 0.1;
    if (G && uiState === "play" && !paused) {
      acc += dt * (G.state === "goal" && G.goalT < 40 ? 0.4 : 1);
      let n = 0;
      while (acc >= STEP && n < 5) { step(); acc -= STEP; n++; if (!G || closed) return; }
      if (n === 5) acc = 0;
      hud();
    } else acc = 0;
    render();
  }

  // ---------------------------------------------------------------- input
  function onKey(e, down) {
    if (closed) return;
    const k = e.key; let used = true;
    if (k === "ArrowUp" || k === "w" || k === "W") input.ky = down ? -1 : (input.ky < 0 ? 0 : input.ky);
    else if (k === "ArrowDown" || k === "s" || k === "S") input.ky = down ? 1 : (input.ky > 0 ? 0 : input.ky);
    else if (k === "ArrowLeft" || k === "a" || k === "A") input.kx = down ? -1 : (input.kx < 0 ? 0 : input.kx);
    else if (k === "ArrowRight" || k === "d" || k === "D") input.kx = down ? 1 : (input.kx > 0 ? 0 : input.kx);
    else if (k === "z" || k === "Z" || k === " ") { if (down && !e.repeat) input.passEdge = true; }
    else if (k === "c" || k === "C") { if (down && !e.repeat) input.bankEdge = true; }
    else if (k === "x" || k === "X" || k === "Enter") {
      if (down && !e.repeat) { input.charging = true; input.chargeF = 0; input.keyShoot = true; }
      else if (!down && input.keyShoot) { input.charging = false; input.shootRel = true; input.keyShoot = false; }
    }
    else if ((k === "v" || k === "V") && down) input.trab = true;
    else if ((k === "p" || k === "P" || k === "Escape") && down) { if (uiState === "play") pauseGame(); }
    else used = false;
    if (used) e.preventDefault();
  }

  function bindPad() {
    const pad = root.querySelector(".cgd-pad"), stk = root.querySelector(".cgd-stk"), knob = stk.firstElementChild;
    const rect = () => stage.getBoundingClientRect(); const RAD = 52;
    const toWorld = (px, py) => { const r = rect(), v = G && G.view; if (!v) return; input.tx = (px - r.left - v.cw / 2) / v.s + v.cx; input.ty = (py - r.top - v.ch / 2) / v.s + v.cy; };
    pad.addEventListener("pointerdown", (e) => {
      if (stick.id !== -1) return; e.preventDefault(); stick.id = e.pointerId;
      try { pad.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
      const r = rect();
      if (SET.ctrl === "touch") { input.touchOn = true; toWorld(e.clientX, e.clientY); return; }
      stick.ox = clamp(e.clientX - r.left, 62, r.width - 62); stick.oy = clamp(e.clientY - r.top, 62, r.height - 62);
      stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; stk.style.display = "block"; stk.classList.add("on"); knob.style.transform = "translate(0,0)";
      stick.bx = e.clientX; stick.by = e.clientY; input.jx = input.jy = 0;
    });
    pad.addEventListener("pointermove", (e) => {
      if (e.pointerId !== stick.id) return; e.preventDefault();
      if (SET.ctrl === "touch") { toWorld(e.clientX, e.clientY); return; }
      const dx = e.clientX - stick.bx, dy = e.clientY - stick.by, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / RAD);
      input.jx = dx / d * m; input.jy = dy / d * m;
      if (d > RAD) { stick.bx = e.clientX - dx / d * RAD; stick.by = e.clientY - dy / d * RAD; const r = rect(); stick.ox = clamp(stick.bx - r.left, 62, r.width - 62); stick.oy = clamp(stick.by - r.top, 62, r.height - 62); stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; }
      knob.style.transform = `translate(${input.jx * RAD}px,${input.jy * RAD}px)`;
    });
    const up = (e) => { if (e.pointerId !== stick.id) return; stick.id = -1; input.jx = input.jy = 0; input.touchOn = false; stk.classList.remove("on"); knob.style.transform = "translate(0,0)"; showDefaultStick(); };
    pad.addEventListener("pointerup", up); pad.addEventListener("pointercancel", up); pad.addEventListener("lostpointercapture", up);
  }
  function showDefaultStick() {
    const stk = root && root.querySelector(".cgd-stk"); if (!stk) return;
    if (SET.ctrl === "stick" && uiState === "play") { stk.style.display = "block"; stk.style.left = "78px"; stk.style.top = (stage.clientHeight - 92) + "px"; } else stk.style.display = "none";
  }
  function bindBtn(el, onDown, onUp) {
    let id = -1;
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); id = e.pointerId; try { el.setPointerCapture(id); } catch (er) { /* ignora */ } el.classList.add("dn"); onDown && onDown(); });
    const end = (e) => { if (e.pointerId !== id) return; id = -1; el.classList.remove("dn"); onUp && onUp(); };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end); el.addEventListener("lostpointercapture", end);
  }

  // ---------------------------------------------------------------- schermate
  function showUi(html) { ui.innerHTML = `<div class="cgd-card">${html}</div>`; ui.classList.add("on"); ui.scrollTop = 0; }
  function hideUi() { ui.classList.remove("on"); ui.innerHTML = ""; }
  const stars = (n) => "★".repeat(n) + "☆".repeat(3 - n);

  function showMenu() {
    uiState = "menu"; paused = false;
    const done = PROG.stars.filter((s) => s > 0).length;
    let h = `<h2>La Gabbia del Molo</h2><p class="cgd-sub">3 contro 3, cemento, rete e niente arbitro. Qui la palla non esce mai: rimbalza. Fai punti con le sponde, riempi la Grinta e sgancia il Trabucco.</p>`;
    h += `<h3>Il torneo · ${done}/${LEVELS.length}</h3>`;
    LEVELS.forEach((o, i) => {
      const open = i === 0 || PROG.stars[i - 1] > 0;
      h += `<button class="cgd-opp" data-mi="${i}" ${open ? "" : "disabled"}><div class="cgd-crest" style="border-color:${o.kit2};background:${o.kit};color:${o.kit2}">${o.tag}</div><div><b>${o.name}</b><span>${open ? (PROG.stars[i] ? "Vinta" : "Da affrontare") : "Batti la squadra precedente"}</span></div><em>${open ? stars(PROG.stars[i]) : "🔒"}</em></button>`;
    });
    h += `<h3>Controlli</h3><div class="cgd-seg" data-k="ctrl"><button data-v="stick" class="${SET.ctrl === "stick" ? "on" : ""}">Joystick</button><button data-v="touch" class="${SET.ctrl === "touch" ? "on" : ""}">Tocca e corri</button></div>`;
    h += `<h3>Difficoltà</h3><div class="cgd-seg" data-k="diff">${DIFFS.map((d, i) => `<button data-v="${i}" class="${SET.diff === i ? "on" : ""}">${d.n}</button>`).join("")}</div>`;
    h += `<h3>Audio</h3><div class="cgd-seg" data-k="sound"><button data-v="1" class="${SET.sound ? "on" : ""}">Suoni attivi</button><button data-v="0" class="${SET.sound ? "" : "on"}">Muto</button></div>`;
    h += `<button class="cgd-btn sec" data-a="tut">Come si gioca</button>`;
    h += `<p class="cgd-sub" style="text-align:center">Partite: ${PROG.played} · Vittorie: ${PROG.wins} · Punti fatti: ${PROG.pts} · Miglior combo: x${PROG.bestCombo}</p>`;
    h += `<button class="cgd-btn sec" data-a="exit">Esci</button>`;
    showUi(h);
    ui.querySelectorAll(".cgd-opp").forEach((b) => (b.onclick = () => showIntro(+b.dataset.mi)));
    ui.querySelectorAll(".cgd-seg").forEach((sg) => sg.querySelectorAll("button").forEach((b) => (b.onclick = () => {
      const k = sg.dataset.k; SET[k] = k === "ctrl" ? b.dataset.v : +b.dataset.v; saveSet();
      sg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); snd("playSelect");
    })));
    ui.querySelector('[data-a="tut"]').onclick = () => showTutorial(0, showMenu);
    ui.querySelector('[data-a="exit"]').onclick = () => closeAll();
    if (!PROG.tut) { PROG.tut = 1; saveProg(); showTutorial(0, showMenu); }
  }

  function showIntro(li) {
    const o = LEVELS[li]; uiState = "intro";
    showUi(`<h2>${o.name}</h2><p class="cgd-sub">Sfida ${li + 1} di ${LEVELS.length} · ${DIFFS[SET.diff].n} · Premio prima vittoria: ${COINS[li]} monete${PROG.coin[li] ? " (già incassato)" : ""}</p>
      <div class="cgd-quote">${esc(o.hint)}</div>
      <div class="cgd-rule">Regola del giorno: ${esc(o.mut)}</div>
      <div class="cgd-stat"><span>Obiettivo</span><span>Primo a ${o.target} punti (o più punti in 2 minuti e mezzo)</span></div>
      <div class="cgd-stat"><span>Punti</span><span>Gol 1 · Gol di sponda 2 · Trabucco 2</span></div>
      <div class="cgd-stat"><span>★ ★★ ★★★</span><span>Vittoria · +3 di scarto · max 1 punto subito</span></div>
      <button class="cgd-btn" data-a="go">Entra nella Gabbia</button><button class="cgd-btn sec" data-a="back">Indietro</button>`);
    ui.querySelector('[data-a="go"]').onclick = () => startMatch(li);
    ui.querySelector('[data-a="back"]').onclick = showMenu;
  }

  function showTutorial(step, back) {
    uiState = "tut";
    const T = [
      ["Muoviti", "Tieni premuto a sinistra: compare il joystick. Oppure scegli «Tocca e corri» e trascina dove vuoi andare. Comandi il giocatore col cerchio giallo, e il campo è tutto visibile: la Gabbia è piccola, e anche per questo ci si fa male (a parole)."],
      ["Tira, passa, spallata", "TIRO: tieni premuto e rilascia, stick di lato per scegliere l'angolo. PASSA manda la palla al compagno indicato dal cerchio verde. Senza palla, PASSA è la SPALLATA: scatto e botta, il rivale vola e la palla è tua."],
      ["La sponda", "SPONDA fa rimbalzare la palla sul muro: in attacco punta alla porta, in difesa cerca un compagno. Un gol dopo almeno un rimbalzo vale 2 punti. Una sponda ricevuta da un compagno accende la COMBO."],
      ["Grinta e Trabucco", "Rimbalzi, spallate e passaggi riempiono la GRINTA. Piena, compare il tasto dorato: il Trabucco è un tiro di fuoco che butta a terra chi incontra e vale 2. Passaggio Leo-Nico e tiro subito: Doppietta, tiro potenziato e preciso."],
    ];
    const t = T[step];
    showUi(`<h2>${t[0]}</h2><div class="cgd-dots">${T.map((_, i) => (i === step ? "<b>●</b>" : "●")).join(" ")}</div><p>${t[1]}</p>
      <button class="cgd-btn" data-a="next">${step < T.length - 1 ? "Avanti" : "Ho capito"}</button>${step > 0 ? '<button class="cgd-btn sec" data-a="prev">Indietro</button>' : ""}`);
    ui.querySelector('[data-a="next"]').onclick = () => (step < T.length - 1 ? showTutorial(step + 1, back) : back());
    const pv = ui.querySelector('[data-a="prev"]'); if (pv) pv.onclick = () => showTutorial(step - 1, back);
  }

  function startMatch(li) {
    hideUi(); uiState = "play"; paused = false;
    bgCache = null;
    newMatch(li, SET.diff);
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false; input.chargeF = 0; input.passEdge = input.bankEdge = input.shootRel = input.trab = false; input.touchOn = false;
    stage.querySelector(".cgd-pad").classList.toggle("all", SET.ctrl === "touch");
    showDefaultStick(); acc = 0; lastTs = 0; PROG.played++; saveProg(); hud();
  }

  function showResult() {
    uiState = "result";
    const [a, c] = G.score, win = a > c, draw = a === c;
    let st = 0, coins = 0;
    PROG.pts += a; PROG.bestCombo = Math.max(PROG.bestCombo, G.stats.bestCombo);
    if (win) {
      st = 1 + (a - c >= 3 ? 1 : 0) + (c <= 1 ? 1 : 0); PROG.wins++;
      if (G.li >= 0) {
        PROG.stars[G.li] = Math.max(PROG.stars[G.li], st);
        if (!PROG.coin[G.li]) { PROG.coin[G.li] = 1; coins = COINS[G.li]; if (typeof window.addCoins === "function") { try { window.addCoins(coins); } catch (e) { /* ignora */ } } }
      }
    }
    saveProg();
    const lose = ["Perso. Succede, la Gabbia non fa sconti e nemmeno il caffè. Un vecchio dal balcone ti grida «Andava bene così!». Non è vero, ma è un gesto d'amore.", "Hai perso, ma almeno hai rimbalzato con stile. Di quelli che lasciano il segno sul muro: se ci guardi bene, c'è ancora."];
    const quote = win ? G.lv.win : draw ? "Pari e patta. Nessuno vince, nessuno perde, il sole cala. Il gabbiano sul tetto della rete è l'unico ad aver capito tutto." : lose[Math.floor(Math.random() * lose.length)];
    const next = G.li >= 0 && win && G.li < LEVELS.length - 1, li = G.li;
    showUi(`<h2>${win ? "Vittoria!" : draw ? "Pareggio" : "Sconfitta"}</h2><div class="cgd-score"><span style="color:#7dd3fc">${a}</span> - <span style="color:#fdba74">${c}</span></div>
      <p class="cgd-sub" style="text-align:center">Rondine vs ${G.lv.name}</p>${win ? `<div class="cgd-stars">${stars(st)}</div>` : ""}
      ${coins ? `<p style="text-align:center;color:#fde047;font-weight:800">+${coins} monete (prima vittoria)</p>` : ""}
      <div class="cgd-quote">${esc(quote)}</div>
      <div class="cgd-stat"><span>Gol di sponda</span><span>${G.stats.spGoals}</span></div>
      <div class="cgd-stat"><span>Sponde tentate</span><span>${G.stats.banks}</span></div>
      <div class="cgd-stat"><span>Spallate</span><span>${G.stats.spallate}</span></div>
      <div class="cgd-stat"><span>Miglior combo</span><span>x${G.stats.bestCombo}</span></div>
      ${next ? '<button class="cgd-btn" data-a="next">Prossima sfida</button>' : ""}<button class="cgd-btn ${next ? "sec" : ""}" data-a="again">Rigioca</button><button class="cgd-btn sec" data-a="menu">Menu del torneo</button>`);
    const nx = ui.querySelector('[data-a="next"]'); if (nx) nx.onclick = () => showIntro(li + 1);
    ui.querySelector('[data-a="again"]').onclick = () => startMatch(li);
    ui.querySelector('[data-a="menu"]').onclick = showMenu;
  }

  function pauseGame() {
    if (uiState !== "play") return;
    uiState = "pause"; paused = true; input.charging = false; input.jx = input.jy = 0;
    showUi(`<h2>In pausa</h2><p class="cgd-sub">${G.lv.name} · ${G.score[0]} - ${G.score[1]}</p><button class="cgd-btn" data-a="res">Riprendi</button>
      <h3>Controlli</h3><div class="cgd-seg"><button data-v="stick" class="${SET.ctrl === "stick" ? "on" : ""}">Joystick</button><button data-v="touch" class="${SET.ctrl === "touch" ? "on" : ""}">Tocca e corri</button></div>
      <button class="cgd-btn sec" data-a="tut">Come si gioca</button><button class="cgd-btn sec" data-a="rst">Ricomincia la partita</button><button class="cgd-btn red" data-a="menu">Abbandona (menu)</button>`);
    ui.querySelector('[data-a="res"]').onclick = resumeGame;
    ui.querySelectorAll(".cgd-seg button").forEach((b) => (b.onclick = () => { SET.ctrl = b.dataset.v; saveSet(); ui.querySelectorAll(".cgd-seg button").forEach((x) => x.classList.toggle("on", x === b)); stage.querySelector(".cgd-pad").classList.toggle("all", SET.ctrl === "touch"); }));
    ui.querySelector('[data-a="tut"]').onclick = () => showTutorial(0, pauseGame);
    ui.querySelector('[data-a="rst"]').onclick = () => startMatch(G.li);
    ui.querySelector('[data-a="menu"]').onclick = showMenu;
  }
  function resumeGame() { hideUi(); uiState = "play"; paused = false; lastTs = 0; acc = 0; showDefaultStick(); }

  // ---------------------------------------------------------------- apertura / chiusura
  function closeAll(silent) {
    if (closed && !root) return;
    closed = true; cancelAnimationFrame(raf);
    timers.forEach(clearTimeout); timers = [];
    cleanup.forEach((fn) => { try { fn(); } catch (e) { /* ignora */ } }); cleanup = [];
    if (root) { root.remove(); root = null; }
    cv = cx = ui = stage = null; G = null;
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false;
    const cb = onExitCb; onExitCb = null;
    if (silent !== true && typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  window.openStreetCageMode = function (onExit) {
    if (root) closeAll(true);
    injectCss();
    onExitCb = onExit; PROG = loadProg(); SET = loadSet();
    closed = false; paused = false; lastTs = 0; acc = 0; G = null; uiState = "menu"; bgCache = null;
    root = document.createElement("div");
    root.className = "cgd-root"; root.id = "streetCageModal"; root.tabIndex = 0;
    root.innerHTML = `
      <div class="cgd-top">
        <button class="cgd-ib" data-a="pause" aria-label="Pausa">⏸</button>
        <div class="cgd-sc"><b>RON 0 - 0 ---</b><small>La Gabbia del Molo</small>
          <div class="cgd-bars"><div class="cgd-bar" title="Grinta"><i></i></div><span class="cgd-cmb"></span></div></div>
        <button class="cgd-ib" data-a="close" aria-label="Chiudi">✕</button>
      </div>
      <div class="cgd-stage">
        <canvas></canvas>
        <div class="cgd-pad"></div><div class="cgd-stk"><i></i></div>
        <div class="cgd-msg"></div><div class="cgd-banner"></div><div class="cgd-chg"><i></i></div>
        <div class="cgd-btns">
          <button class="cgd-b shoot" aria-label="Tiro">TIRO<small>tieni e rilascia</small></button>
          <button class="cgd-b bank" aria-label="Sponda">SPONDA<small>rimbalza</small></button>
          <button class="cgd-b pass" aria-label="Passa">PASSA<small>spallata</small></button>
          <button class="cgd-b trab" aria-label="Trabucco">🔥<small>TRABUCCO</small></button>
        </div>
        <div class="cgd-ui"></div>
      </div>`;
    document.body.appendChild(root);
    stage = root.querySelector(".cgd-stage"); cv = root.querySelector("canvas"); cx = cv.getContext("2d"); ui = root.querySelector(".cgd-ui");
    root.querySelector('[data-a="close"]').onclick = () => { if (uiState === "play") pauseGame(); else closeAll(); };
    root.querySelector('[data-a="pause"]').onclick = () => { if (uiState === "play") pauseGame(); else if (uiState === "pause") resumeGame(); };
    bindPad();
    bindBtn(root.querySelector(".cgd-b.shoot"), () => { if (uiState === "play") { input.charging = true; input.chargeF = 0; } }, () => { if (input.charging) { input.charging = false; input.shootRel = true; } });
    bindBtn(root.querySelector(".cgd-b.bank"), () => { if (uiState === "play") input.bankEdge = true; });
    bindBtn(root.querySelector(".cgd-b.pass"), () => { if (uiState === "play") input.passEdge = true; });
    bindBtn(root.querySelector(".cgd-b.trab"), () => { if (uiState === "play") input.trab = true; });
    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
    window.addEventListener("keydown", kd, { passive: false }); window.addEventListener("keyup", ku, { passive: false });
    const vis = () => { if (document.hidden && uiState === "play") pauseGame(); };
    document.addEventListener("visibilitychange", vis);
    cleanup.push(() => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); document.removeEventListener("visibilitychange", vis); });
    if (DEBUG) window.__cgd = { G: () => G, input, SET, PROG: () => PROG, start: (li, d) => { if (d !== undefined) SET.diff = d; startMatch(li); }, ts: (n) => { window.__cgdTS = n; } };
    raf = requestAnimationFrame(loop);
    root.focus();
    showMenu();
  };
})();
