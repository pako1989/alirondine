// js/action-soccer-hd.js - Action Soccer 2D HD · "Coppa del Molo"
// Partita 5v5 a campo aperto, vista dall'alto con aftertouch, Tiro della Rondine e Intesa Leo-Nico.
// Entry: window.openActionSoccerHD(onExit)
(function () {
  "use strict";

  // ---------------------------------------------------------------- costanti
  const KEY_PROG = "ali-di-rondine.action-hd-progress";
  const KEY_SET = "ali-di-rondine.action-hd-settings";
  const DEBUG = /[?&]debug/.test(location.search || "");

  const W = 1200, H = 750;
  const XL = 50, XR = 1150, YT = 40, YB = 710, LEN = XR - XL;
  const GM = 375, GH = 150, GT = GM - GH / 2, GB = GM + GH / 2;
  const BOX_D = 170, BOX_T = 195, BOX_B = 555;
  const STEP = 1 / 60;
  const MATCH_SECS = 100, HALF_SECS = 50, GOLDEN_SECS = 30;
  const FR = 0.982; // attrito palla a terra per frame

  // ---------------------------------------------------------------- dati
  const OPPS = [
    {
      name: "Gabbiani del Porto", tag: "GAB", kit: "#e2e8f0", kit2: "#facc15", gk: "#a3e635", spd: 0.93, tkl: 0.75, press: 190, line: 0.0, shoot: 300,
      names: ["Pinna", "Beccaccia", "Frittella", "Il Rubacuori", "Squarcio"],
      hint: "Rubano tutto ciò che è fritto e, a quanto pare, anche la palla. Fanno più rumore che gioco.",
      win: "Un gabbiano ti ruba il panino dalla borsa mentre esulti. Un pareggio morale: 1-1 e palla al centro.",
    },
    {
      name: "Corsari della Banchina", tag: "COR", kit: "#1f2937", kit2: "#f97316", gk: "#f472b6", spd: 0.98, tkl: 1.25, press: 200, line: 0.02, shoot: 320,
      names: ["Uncino", "Barbarossa", "Scialuppa", "Capitan Cima", "Moschettone"],
      hint: "Contrasti da scaricatori di porto. Il loro capitano dice di aver perso un occhio in una partita a carte. Non è vero, ha solo l'orzaiolo.",
      win: "Capitan Cima ti stringe la mano e ti lascia un pezzo di sagola: «Per le prossime scarpe». Ha il cuore grosso quanto le braccia.",
    },
    {
      name: "Murene di Scoglio Rosso", tag: "MUR", kit: "#15803d", kit2: "#e879f9", gk: "#fde047", spd: 1.0, tkl: 1.0, press: 240, line: 0.06, shoot: 330,
      names: ["Fondale", "Zanna", "Rostro", "Il Moray", "Guizzo"],
      hint: "Pressing altissimo: ti saltano addosso appena pensi di avere la palla. Si dice che in spogliatoio dormano a bocca aperta.",
      win: "Le Murene si congratulano in coro, a bocca spalancata. Non è un complimento: è solo il loro modo di respirare.",
    },
    {
      name: "Dopolavoro Ferroviario", tag: "DOP", kit: "#7f1d1d", kit2: "#fde68a", gk: "#38bdf8", spd: 1.0, tkl: 1.0, press: 150, line: -0.1, shoot: 280,
      names: ["Cassetta", "Binario", "Deviatoio", "Capostazione", "Fischietto"],
      hint: "Catenaccio puro: otto fischi di fila, cinque bandierine, zero spazi. L'ultimo treno per il Molo passa qui da quarant'anni.",
      win: "Il capostazione, che ha sempre fischiato partenze, stavolta fischia la tua. «Vai, ragazzo. Questo è l'ultimo binario libero.» Nessuno ride.",
    },
    {
      name: "Il Gran Fanale", tag: "FAN", kit: "#fbbf24", kit2: "#1e3a8a", gk: "#fb7185", spd: 1.05, tkl: 1.1, press: 250, line: 0.05, shoot: 340,
      names: ["Lanterna", "Faro", "Marea", "Bussola", "Zio Ormeggio"],
      hint: "La squadra più antica del Borgo. Il capitano, Zio Ormeggio, gioca scalzo dal 1987 e non sbaglia un passaggio di sguardo.",
      win: "Zio Ormeggio si siede sull'argine, si toglie il cappello e applaude da solo. Non l'aveva mai fatto con nessuno. Il Molo, per una volta, tace.",
    },
  ];
  const STAR_COINS = [2, 2, 3, 4, 5]; // 16 monete totali, solo alla prima vittoria
  const DIFFS = [
    { n: "Facile", spd: 0.9, react: 22, tkl: 0.022, reach: 28, gk: 2.5, noise: 62, usr: 1.05 },
    { n: "Normale", spd: 0.97, react: 14, tkl: 0.035, reach: 35, gk: 3.2, noise: 40, usr: 1.0 },
    { n: "Duro", spd: 1.04, react: 8, tkl: 0.055, reach: 41, gk: 3.8, noise: 22, usr: 1.0 },
  ];
  const ROLES = [
    { r: "GK", u: 0.02, v: 0.5, spd: 3.1 },
    { r: "DEF", u: 0.22, v: 0.27, spd: 3.75 },
    { r: "DEF", u: 0.22, v: 0.73, spd: 3.75 },
    { r: "MID", u: 0.44, v: 0.5, spd: 4.05 },
    { r: "FWD", u: 0.66, v: 0.5, spd: 4.15 },
  ];
  const HOME_NAMES = ["Sandro", "Chicco", "Baciccia Jr", "Leo", "Nico"];

  // ---------------------------------------------------------------- salvataggi
  function lsGet(key, def) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return def;
      const o = JSON.parse(raw);
      return o && typeof o === "object" ? o : def;
    } catch (e) { return def; }
  }
  function lsSet(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  function loadProg() {
    const o = lsGet(KEY_PROG, {});
    const arr = (a) => { const r = []; for (let i = 0; i < OPPS.length; i++) r.push(Math.max(0, Math.min(3, (a && a[i]) | 0))); return r; };
    return { stars: arr(o.stars), coin: arr(o.coin), played: o.played | 0, goals: o.goals | 0, wins: o.wins | 0, tut: o.tut ? 1 : 0 };
  }
  function loadSet() {
    const o = lsGet(KEY_SET, {});
    return {
      ctrl: o.ctrl === "touch" ? "touch" : "stick",
      diff: [0, 1, 2].indexOf(o.diff) >= 0 ? o.diff : 1,
      sound: o.sound === 0 ? 0 : 1,
    };
  }
  let PROG = loadProg();
  let SET = loadSet();
  const saveProg = () => lsSet(KEY_PROG, PROG);
  const saveSet = () => lsSet(KEY_SET, SET);

  // ---------------------------------------------------------------- stato modulo
  let root = null, cv = null, cx = null, ui = null, stage = null;
  let raf = 0, lastTs = 0, acc = 0, paused = false, closed = true;
  let onExitCb = null;
  let M = null; // partita
  let bgCache = null, vigCache = null, vigKey = "";
  let cleanup = [];
  let timers = [];
  let uiState = "menu";
  const input = { jx: 0, jy: 0, kx: 0, ky: 0, tx: 0, ty: 0, touchOn: false, sprint: false, charging: false, chargeF: 0, passEdge: false, shootRel: false, rond: false, keyShoot: false };
  const stick = { id: -1, ox: 0, oy: 0 };

  const snd = (name, a) => { if (SET.sound && window.HD2DAudio && typeof window.HD2DAudio[name] === "function") { try { window.HD2DAudio[name](a); } catch (e) { /* ignora */ } } };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const dirOf = (t) => (t === 0 ? 1 : -1);
  const goalXOf = (t) => (t === 0 ? XR : XL); // porta attaccata dalla squadra t
  const ownX = (t) => (t === 0 ? XL : XR);
  const uOf = (t, x) => (t === 0 ? (x - XL) / LEN : (XR - x) / LEN);
  const xOfU = (t, u) => (t === 0 ? XL + u * LEN : XR - u * LEN);
  const yOfV = (v) => YT + v * (YB - YT);
  const later = (fn, ms) => { const id = setTimeout(() => { timers = timers.filter((x) => x !== id); fn(); }, ms); timers.push(id); return id; };

  // ---------------------------------------------------------------- CSS
  function injectCss() {
    if (document.getElementById("ahd-css")) return;
    const st = document.createElement("style");
    st.id = "ahd-css";
    st.textContent = `
.ahd-root{position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;z-index:999999;display:flex;flex-direction:column;background:#07101c;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden;outline:none}
.ahd-root *{box-sizing:border-box}
.ahd-top{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:4px 8px;padding-top:max(4px,env(safe-area-inset-top));background:linear-gradient(#0b1626,#0a1422);border-bottom:1px solid #1e3350;z-index:30}
.ahd-ib{width:44px;height:44px;border-radius:12px;border:1px solid #33507a;background:#13233b;color:#fff;font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto;padding:0;touch-action:manipulation}
.ahd-ib:active{background:#1f3a60}
.ahd-sc{flex:1;min-width:0;text-align:center;line-height:1.1}
.ahd-sc b{font:800 22px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;white-space:nowrap}
.ahd-sc small{display:block;font-size:11px;color:#9bb4d6;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ahd-sc .ahd-ta{color:#7dd3fc}.ahd-sc .ahd-tb{color:#fca5a5}
.ahd-bars{display:flex;gap:6px;justify-content:center;margin-top:3px}
.ahd-bar{position:relative;width:76px;height:7px;border-radius:5px;background:#12233a;overflow:hidden;border:1px solid #2b4568}
.ahd-bar i{position:absolute;left:0;top:0;bottom:0;width:0;background:#38bdf8}
.ahd-bar.g i{background:linear-gradient(90deg,#f59e0b,#fb923c)}
.ahd-bar.full{box-shadow:0 0 8px #fb923c;border-color:#fdba74}
.ahd-stage{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
.ahd-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}
.ahd-pad{position:absolute;left:0;top:0;bottom:0;width:58%;z-index:5;touch-action:none}
.ahd-pad.all{width:100%}
.ahd-stk{position:absolute;width:112px;height:112px;margin:-56px 0 0 -56px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(15,30,55,.35);z-index:6;pointer-events:none;opacity:.55;display:none}
.ahd-stk.on{opacity:1;background:rgba(15,30,55,.5)}
.ahd-stk i{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7dd3fc,#2563eb);border:2px solid #e0f2fe;box-shadow:0 3px 8px rgba(0,0,0,.5)}
.ahd-btns{position:absolute;right:0;bottom:0;width:230px;height:230px;z-index:8;pointer-events:none}
.ahd-b{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.55);color:#fff;font-weight:800;font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;box-shadow:0 5px 14px rgba(0,0,0,.5);cursor:pointer;padding:0;line-height:1.05;text-shadow:0 1px 2px #000}
.ahd-b small{font-size:9px;font-weight:600;opacity:.85}
.ahd-b.dn{transform:scale(.93);filter:brightness(1.35)}
.ahd-b.shoot{width:92px;height:92px;right:14px;bottom:max(22px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#f87171,#b91c1c);font-size:16px}
.ahd-b.pass{width:76px;height:76px;right:114px;bottom:max(14px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#60a5fa,#1d4ed8)}
.ahd-b.spr{width:62px;height:62px;right:30px;bottom:130px;background:radial-gradient(circle at 35% 30%,#34d399,#047857);font-size:12px}
.ahd-b.ron{width:62px;height:62px;right:108px;bottom:106px;background:radial-gradient(circle at 35% 30%,#fde047,#d97706);font-size:12px;display:none;animation:ahdPulse .7s infinite alternate}
.ahd-b.ron.on{display:flex}
@keyframes ahdPulse{from{box-shadow:0 0 6px #facc15}to{box-shadow:0 0 22px #fb923c}}
.ahd-chg{position:absolute;left:50%;bottom:132px;width:150px;height:10px;margin-left:-75px;border-radius:6px;background:rgba(0,0,0,.5);border:1px solid #fff;z-index:7;display:none;overflow:hidden;pointer-events:none}
.ahd-chg i{display:block;height:100%;width:0;background:linear-gradient(90deg,#fde047,#ef4444)}
.ahd-msg{position:absolute;left:50%;top:14%;transform:translateX(-50%);z-index:9;pointer-events:none;background:rgba(7,16,28,.86);border:1px solid #38bdf8;border-radius:12px;padding:7px 14px;font-weight:800;font-size:15px;text-align:center;max-width:92%;display:none}
.ahd-hint{position:absolute;left:50%;bottom:calc(100% - 2px);display:none}
.ahd-banner{position:absolute;left:0;right:0;top:26%;z-index:12;text-align:center;pointer-events:none;display:none}
.ahd-banner .ahd-bg{display:inline-block;padding:10px 26px 12px;background:linear-gradient(90deg,transparent,rgba(8,20,40,.92) 14%,rgba(8,20,40,.92) 86%,transparent);animation:ahdIn .35s cubic-bezier(.2,1.4,.4,1)}
.ahd-banner h1{margin:0;font:900 44px/1 system-ui,sans-serif;letter-spacing:2px;color:#fde047;text-shadow:0 3px 0 #b45309,0 0 22px rgba(251,191,36,.7)}
.ahd-banner.bad h1{color:#fca5a5;text-shadow:0 3px 0 #7f1d1d}
.ahd-banner p{margin:6px 0 0;font-size:15px;font-weight:700;color:#e2e8f0}
@keyframes ahdIn{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
.ahd-rep{position:absolute;left:12px;top:56px;z-index:12;background:#dc2626;color:#fff;font-weight:900;font-size:12px;letter-spacing:2px;padding:4px 10px;border-radius:6px;display:none;pointer-events:none}
.ahd-ui{position:absolute;inset:0;z-index:20;display:none;overflow-y:auto;overflow-x:hidden;background:rgba(5,10,20,.9);touch-action:pan-y;-webkit-overflow-scrolling:touch}
.ahd-ui.on{display:block}
.ahd-card{max-width:440px;margin:0 auto;padding:14px 14px calc(18px + env(safe-area-inset-bottom))}
.ahd-card h2{margin:4px 0 2px;font-size:22px;color:#7dd3fc}
.ahd-card h3{margin:14px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8}
.ahd-card p{margin:6px 0;font-size:14px;line-height:1.4;color:#cbd5e1}
.ahd-sub{font-size:13px;color:#94a3b8}
.ahd-opp{display:flex;align-items:center;gap:10px;width:100%;min-height:58px;margin:6px 0;padding:8px 10px;border-radius:14px;border:1px solid #29456c;background:#0f1f36;color:#fff;text-align:left;cursor:pointer;font:inherit;touch-action:manipulation}
.ahd-opp:active{background:#17304f}
.ahd-opp[disabled]{opacity:.45;cursor:default}
.ahd-opp .ahd-crest{flex:0 0 38px;height:38px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px}
.ahd-opp b{display:block;font-size:15px}
.ahd-opp span{font-size:12px;color:#9bb4d6}
.ahd-opp em{margin-left:auto;font-style:normal;color:#fde047;font-size:15px;letter-spacing:1px;white-space:nowrap}
.ahd-seg{display:flex;gap:6px;margin:4px 0 8px}
.ahd-seg button{flex:1;min-height:44px;border-radius:10px;border:1px solid #29456c;background:#0f1f36;color:#cbd5e1;font:700 13px system-ui;cursor:pointer;padding:4px;touch-action:manipulation}
.ahd-seg button.on{background:#0369a1;border-color:#7dd3fc;color:#fff}
.ahd-btn{display:block;width:100%;min-height:50px;margin:8px 0;border-radius:14px;border:0;background:linear-gradient(#22c55e,#15803d);color:#fff;font:800 16px system-ui;cursor:pointer;touch-action:manipulation}
.ahd-btn.sec{background:#1e3350;border:1px solid #3b5b88;font-size:14px}
.ahd-btn.red{background:linear-gradient(#ef4444,#b91c1c)}
.ahd-score{font:900 48px/1 ui-monospace,Menlo,monospace;text-align:center;margin:8px 0;letter-spacing:2px}
.ahd-stars{text-align:center;font-size:30px;color:#fde047;letter-spacing:6px}
.ahd-quote{border-left:3px solid #38bdf8;padding:4px 10px;margin:10px 0;color:#e2e8f0;font-style:italic}
.ahd-stat{display:flex;justify-content:space-between;font-size:13px;color:#cbd5e1;border-bottom:1px solid #1e3350;padding:5px 0}
.ahd-dots{text-align:center;margin:10px 0;color:#475569;font-size:22px}.ahd-dots b{color:#38bdf8}
`;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- sfondo (cache)
  function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const MX = 130, MT = 190, MB = 160;
  function buildBg() {
    const bw = W + MX * 2, bh = H + MT + MB;
    const c = document.createElement("canvas");
    c.width = bw; c.height = bh;
    const g = c.getContext("2d");
    g.translate(MX, MT);
    const r = seeded(77);
    // ---- mare in alto
    let gr = g.createLinearGradient(0, -MT, 0, -40);
    gr.addColorStop(0, "#0a2c47"); gr.addColorStop(1, "#1b6d8c");
    g.fillStyle = gr; g.fillRect(-MX, -MT, bw, MT - 30);
    g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 2;
    for (let i = 0; i < 70; i++) {
      const x = -MX + r() * bw, y = -MT + 10 + r() * (MT - 70), l = 18 + r() * 40;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 4, x + l, y); g.stroke();
    }
    // barche
    const boat = (x, y, s, col, sail) => {
      g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(0, 18, 46, 6, 0, 0, 7); g.fill();
      g.fillStyle = col; g.beginPath(); g.moveTo(-44, 0); g.lineTo(44, 0); g.lineTo(32, 16); g.lineTo(-32, 16); g.closePath(); g.fill();
      g.fillStyle = "#f8fafc"; g.fillRect(-44, 0, 88, 3);
      g.strokeStyle = "#3b2f25"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -58); g.stroke();
      g.fillStyle = sail; g.beginPath(); g.moveTo(3, -56); g.lineTo(30, -6); g.lineTo(3, -6); g.closePath(); g.fill();
      g.restore();
    };
    boat(150, -120, 1, "#b91c1c", "#fef3c7"); boat(520, -135, 0.8, "#1d4ed8", "#fde68a");
    boat(900, -118, 1.1, "#15803d", "#e0f2fe"); boat(1210, -140, 0.75, "#a16207", "#fecaca");
    // banchina in pietra
    gr = g.createLinearGradient(0, -48, 0, 2);
    gr.addColorStop(0, "#8b7355"); gr.addColorStop(1, "#5a4630");
    g.fillStyle = gr; g.fillRect(-MX, -48, bw, 52);
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 1;
    for (let x = -MX; x < bw; x += 38) { g.beginPath(); g.moveTo(x, -48); g.lineTo(x, 4); g.stroke(); }
    for (let x = 0; x < W; x += 170) { g.fillStyle = "#2b2118"; g.fillRect(x + 40, -50, 12, 14); g.fillStyle = "#facc15"; g.fillRect(x + 40, -50, 12, 4); }
    // lucine
    for (let x = -MX; x < bw - MX; x += 28) { g.fillStyle = (x / 28) % 2 ? "#fde68a" : "#fb7185"; g.beginPath(); g.arc(x, -26 + Math.sin(x * 0.05) * 4, 3, 0, 7); g.fill(); }
    // ---- tribunetta in basso
    gr = g.createLinearGradient(0, H - 6, 0, H + MB);
    gr.addColorStop(0, "#1b2433"); gr.addColorStop(1, "#0b1019");
    g.fillStyle = gr; g.fillRect(-MX, H - 6, bw, MB + 10);
    const cols = ["#f87171", "#60a5fa", "#fde047", "#a3e635", "#e879f9", "#fb923c", "#f1f5f9", "#38bdf8"];
    for (let row = 0; row < 7; row++) {
      const y0 = H + 34 + row * 17;
      g.fillStyle = row % 2 ? "#212c40" : "#273349"; g.fillRect(-MX, y0 - 4, bw, 15);
      for (let x = -MX + 6; x < bw - MX; x += 11 + r() * 5) {
        const col = cols[(r() * cols.length) | 0];
        g.fillStyle = "#e2b48c"; g.beginPath(); g.arc(x, y0 - 2, 3.4, 0, 7); g.fill();
        g.fillStyle = col; g.fillRect(x - 4, y0 + 1, 8, 7);
      }
    }
    // ---- bordi laterali (siepe + rete)
    g.fillStyle = "#10261c"; g.fillRect(-MX, -30, MX + 4, H + 60); g.fillRect(W - 4, -30, MX + 4, H + 60);
    for (let i = 0; i < 160; i++) { g.fillStyle = r() > 0.5 ? "#17402b" : "#0d2217"; g.beginPath(); g.arc(-MX + r() * (MX), -20 + r() * (H + 40), 5 + r() * 8, 0, 7); g.fill(); g.beginPath(); g.arc(W + r() * MX, -20 + r() * (H + 40), 5 + r() * 8, 0, 7); g.fill(); }
    // ---- erba
    g.fillStyle = "#1f7a38"; g.fillRect(0, 6, W, H - 12);
    for (let i = 0, x = 0; x < W; x += 75, i++) {
      g.fillStyle = i % 2 ? "rgba(255,255,255,.055)" : "rgba(0,0,0,.07)"; g.fillRect(x, 6, 75, H - 12);
    }
    for (let i = 0; i < 4200; i++) {
      g.fillStyle = r() > 0.5 ? "rgba(255,255,255,.07)" : "rgba(0,30,0,.12)";
      g.fillRect(r() * W, 6 + r() * (H - 12), 1.6, 3 + r() * 3);
    }
    // chiazze di fango davanti alle porte e al centro
    [[XL + 70, GM], [XR - 70, GM], [W / 2, H / 2]].forEach(([x, y]) => {
      const rg = g.createRadialGradient(x, y, 6, x, y, 90);
      rg.addColorStop(0, "rgba(94,70,38,.34)"); rg.addColorStop(1, "rgba(94,70,38,0)");
      g.fillStyle = rg; g.fillRect(x - 92, y - 92, 184, 184);
    });
    // cartelloni
    const ads = ["TRATTORIA DA ZIA PINA", "FRITTO MISTO DEL MOLO", "PESCHERIA GEMMA", "OFFICINA SCIROCCO", "CALZATURE TRE SALTI", "FARO CAFFÈ", "PANIFICIO ALBA"];
    const adCols = ["#b91c1c", "#1d4ed8", "#a16207", "#0f766e", "#7e22ce", "#be123c", "#15803d"];
    g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 0; i < 7; i++) {
      const x = 12 + i * 168, w = 160;
      [[8, 24], [H - 32, 24]].forEach(([y, h]) => {
        g.fillStyle = adCols[i]; g.fillRect(x, y, w, h);
        g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x, y, w, 4);
        g.strokeStyle = "#0b1019"; g.lineWidth = 2; g.strokeRect(x, y, w, h);
        g.fillStyle = "#fff"; g.font = "bold 12px system-ui"; g.fillText(ads[(i + (y > 100 ? 3 : 0)) % ads.length], x + w / 2, y + h / 2 + 1);
      });
    }
    // ---- linee
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 3; g.lineJoin = "round";
    g.strokeRect(XL, YT, LEN, YB - YT);
    g.beginPath(); g.moveTo(W / 2, YT); g.lineTo(W / 2, YB); g.stroke();
    g.beginPath(); g.arc(W / 2, H / 2, 92, 0, 7); g.stroke();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(W / 2, H / 2, 4, 0, 7); g.fill();
    [[XL, 1], [XR, -1]].forEach(([x0, s]) => {
      g.strokeRect(s > 0 ? x0 : x0 - BOX_D, BOX_T, BOX_D, BOX_B - BOX_T);
      g.strokeRect(s > 0 ? x0 : x0 - 60, 285, 60, 180);
      g.beginPath(); g.arc(x0 + s * 120, GM, 4, 0, 7); g.fill();
      g.beginPath(); g.arc(x0 + s * BOX_D, GM, 70, s > 0 ? -1.0 : Math.PI - 1.0, s > 0 ? 1.0 : Math.PI + 1.0); g.stroke();
    });
    [[XL, YT, 0], [XR, YT, 1], [XR, YB, 2], [XL, YB, 3]].forEach(([x, y, q]) => { g.beginPath(); g.arc(x, y, 14, q * Math.PI / 2, (q + 1) * Math.PI / 2); g.stroke(); });
    // ---- porte con rete
    [[XL, -1], [XR, 1]].forEach(([x0, s]) => {
      const x1 = x0 + s * 34;
      g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(Math.min(x0, x1), GT, 34, GH);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
      for (let y = GT; y <= GB; y += 8) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
      for (let i = 0; i <= 34; i += 8) { g.beginPath(); g.moveTo(x0 + s * i, GT); g.lineTo(x0 + s * i, GB); g.stroke(); }
      g.strokeStyle = "#fff"; g.lineWidth = 5;
      g.beginPath(); g.moveTo(x0, GT); g.lineTo(x1, GT); g.lineTo(x1, GB); g.lineTo(x0, GB); g.stroke();
      g.fillStyle = "#fff"; g.beginPath(); g.arc(x0, GT, 5, 0, 7); g.arc(x0, GB, 5, 0, 7); g.fill();
    });
    return c;
  }

  // ---------------------------------------------------------------- creazione partita
  function mkTeam(team, opp) {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      const ro = ROLES[i];
      const p = {
        team, i, role: ro.r, isGK: i === 0,
        name: team === 0 ? HOME_NAMES[i] : opp.names[i],
        bu: ro.u, bv: ro.v,
        x: xOfU(team, ro.u), y: yOfV(ro.v), vx: 0, vy: 0, face: team === 0 ? 0 : Math.PI,
        spd: ro.spd * (team === 0 ? (i === 3 ? 1.02 : i === 4 ? 1.04 : 1) : 1),
        kit: team === 0 ? "#1d4ed8" : opp.kit, kit2: team === 0 ? "#7dd3fc" : opp.kit2,
        stun: 0, cd: 0, think: 0, lunge: 0, lungeCd: 0, ph: Math.random() * 6, hold: 0, dribT: null, err: 0, tkMul: 1,
      };
      if (i === 0) { p.kit = team === 0 ? "#f59e0b" : opp.gk; p.kit2 = "#111827"; }
      arr.push(p);
    }
    return arr;
  }

  function newMatch(mi, diffIdx) {
    const opp = OPPS[mi < 0 ? 0 : mi];
    M = {
      mi, opp, D: DIFFS[diffIdx], diffIdx,
      state: "kickoff", timer: 90, score: [0, 0], t: 0, golden: false, halfDone: false,
      tm: [mkTeam(0, opp), mkTeam(1, opp)], pl: [],
      ball: { x: W / 2, y: GM, vx: 0, vy: 0, z: 0, vz: 0, owner: null, lastTeam: 0, lastP: null, passTo: null, at: 0, atTeam: 0, fire: 0, curl: 0, rot: 0, hot: 0, trail: [] },
      ctl: null, ctlLock: 0, kickTeam: 0, chase: [[], []],
      grinta: 0, stam: 1, stamLock: false,
      lastPass: null, intesa: 0,
      parts: [], shake: 0, flash: 0,
      shots: [0, 0], saves: [0, 0], goalsLog: [],
      msg: "", msgT: 0, banner: 0, hintShot: false, hintCurve: 0,
      label: "", rep: null, frames: new Float32Array(150 * 44), fi: 0, fcount: 0, goalPhase: 0, goalTimer: 0, lastScorer: null,
      camX: W / 2, camY: H / 2, ended: false, tick: 0,
    };
    M.pl = M.tm[0].concat(M.tm[1]);
    M.ctl = M.tm[0][3];
    M.tm[1].forEach((p) => { p.spd *= M.D.spd * opp.spd; p.tkMul = opp.tkl; });
    M.tm[0].forEach((p) => { p.spd *= M.D.usr; });
    setupKickoff(0);
    return M;
  }

  function setupKickoff(team) {
    const b = M.ball;
    M.pl.forEach((p) => {
      p.x = xOfU(p.team, p.bu * 0.92 + 0.03); p.y = yOfV(p.bv); p.vx = p.vy = 0; p.stun = 0; p.cd = 0; p.lunge = 0; p.think = 0; p.hold = 0;
      p.face = p.team === 0 ? 0 : Math.PI;
    });
    const k = M.tm[team][4];
    k.x = W / 2 - dirOf(team) * 18; k.y = GM;
    const k2 = M.tm[team][3];
    k2.x = W / 2 - dirOf(team) * 90; k2.y = GM + 70;
    M.tm[1 - team].forEach((p) => { if (!p.isGK && uOf(p.team, p.x) > 0.37) p.x = xOfU(p.team, 0.37); });
    b.x = W / 2; b.y = GM; b.vx = b.vy = 0; b.z = 0; b.vz = 0; b.owner = k; b.passTo = null; b.at = 0; b.fire = 0; b.lastTeam = team; b.lastP = k; b.trail.length = 0;
    M.kickTeam = team; M.state = "kickoff"; M.timer = 80; M.lastPass = null;
    if (team === 0) M.ctl = k;
    snd("playWhistle", true);
    setLabel(team === 0 ? "Calcio d'inizio: tuo!" : "Calcio d'inizio avversario");
  }

  // ---------------------------------------------------------------- utilità di gioco
  function say(txt, ms) {
    const el = stage && stage.querySelector(".ahd-msg");
    if (!el) return;
    el.textContent = txt; el.style.display = "block";
    M.msgT = Math.round((ms || 1500) / 16.67);
  }
  function setLabel(t) { M.label = t; M.labelT = 90; }
  function predictBall(n) {
    const b = M.ball;
    const k = (1 - Math.pow(FR, n)) / (1 - FR);
    return { x: clamp(b.x + b.vx * k, XL, XR), y: clamp(b.y + b.vy * k, YT, YB) };
  }
  function spark(x, y, n, col, sp) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = rnd(0.5, sp || 3);
      M.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.5, life: rnd(18, 36), max: 36, col, size: rnd(1.5, 3.4) });
    }
  }
  function addGrinta(n) { if (!M) return; M.grinta = clamp(M.grinta + n, 0, 100); }

  // ---------------------------------------------------------------- calci
  function kickBall(p, tx, ty, v0, vz, opts) {
    opts = opts || {};
    const b = M.ball;
    const a = Math.atan2(ty - p.y, tx - p.x);
    b.owner = null; b.x = p.x + Math.cos(a) * 13; b.y = p.y + Math.sin(a) * 13;
    b.vx = Math.cos(a) * v0; b.vy = Math.sin(a) * v0; b.vz = vz; if (vz > 0) b.z = Math.max(b.z, 0.5);
    b.lastTeam = p.team; b.lastP = p; b.passTo = opts.to || null;
    b.at = opts.at || 0; b.atTeam = p.team; b.fire = opts.fire || 0; b.curl = opts.curl || 0; b.hot = opts.hot || 0;
    p.cd = 26; p.face = a;
    b.trail.length = 0;
    snd("playKick", opts.snd || 1);
  }

  function threatAt(p, x, y) { // quanti avversari sono vicini a un punto
    let m = 999;
    M.tm[1 - p.team].forEach((q) => { const d = dist(q.x, q.y, x, y); if (d < m) m = d; });
    return m;
  }
  function laneClear(p, tx, ty, r) {
    const dx = tx - p.x, dy = ty - p.y, l2 = dx * dx + dy * dy || 1;
    let m = 999;
    M.tm[1 - p.team].forEach((q) => {
      let t = ((q.x - p.x) * dx + (q.y - p.y) * dy) / l2; t = clamp(t, 0, 1);
      const d = dist(q.x, q.y, p.x + dx * t, p.y + dy * t);
      if (d < m) m = d;
    });
    return m > (r || 30);
  }
  function passSpeed(d) { return clamp(4.6 + 0.0185 * d, 7, 15.5); }

  function doPass(p, m, power) {
    const d = dist(p.x, p.y, m.x, m.y);
    const v0 = passSpeed(d) * (power || 1);
    const lead = clamp(d / Math.max(v0, 1), 0, 22) * 0.55;
    const tx = clamp(m.x + m.vx * lead, XL + 8, XR - 8), ty = clamp(m.y + m.vy * lead, YT + 8, YB - 8);
    kickBall(p, tx, ty, v0, d > 360 ? 1.8 : 0.3, { to: m, snd: 0.85, at: p.team === 0 ? 26 : 0 });
    M.lastPass = { from: p, to: m, t: M.t };
    if (p.team === 0) { M.ctl = m; M.ctlLock = 20; }
  }

  function aimShot(p, charge, accNoise) {
    const gx = goalXOf(p.team);
    const gk = M.tm[1 - p.team][0];
    let ay;
    if (p.team === 0 && (Math.abs(input.jx) + Math.abs(input.jy) > 0.25 || Math.abs(input.kx) + Math.abs(input.ky) > 0.1)) {
      const jy = input.jy + input.ky;
      ay = GM + clamp(jy * 1.3, -1, 1) * (GH / 2 - 9);
    } else {
      const side = Math.abs(gk.y - GM) < 8 ? (Math.random() < 0.5 ? -1 : 1) : -Math.sign(gk.y - GM);
      ay = GM + side * GH * 0.3;
    }
    ay += rnd(-1, 1) * accNoise;
    return { x: gx, y: clamp(ay, GT + 7, GB - 7) };
  }

  function userShoot(p, charge, rondine) {
    const b = M.ball;
    const dg = dist(p.x, p.y, goalXOf(p.team), GM);
    let intesa = false;
    if (M.lastPass && M.lastPass.to === p && M.t - M.lastPass.t < 2.8 && ((M.lastPass.from.i === 3 && p.i === 4) || (M.lastPass.from.i === 4 && p.i === 3))) intesa = true;
    const noise = intesa ? 0 : 3 + charge * 14;
    const tgt = aimShot(p, charge, noise);
    let v0 = 10.5 + 9.5 * charge, lift = 0.5 + 3.4 * charge * charge + rnd(-0.2, 0.3);
    if (intesa) { v0 *= 1.1; M.intesa++; addGrinta(22); say("INTESA LEO-NICO!", 1700); spark(p.x, p.y, 22, "#7dd3fc", 4); M.flash = 8; snd("playEmblemCrit"); }
    if (rondine) {
      v0 = 21.5; lift = 2.2; M.grinta = 0;
      const side = p.y < GM ? 1 : -1, curl = side * 0.02;
      const nFr = dist(p.x, p.y, tgt.x, tgt.y) / 18; // frame di volo stimati: la curva rientra esattamente sull'angolo scelto
      const a0 = Math.atan2(tgt.y - p.y, tgt.x - p.x) - curl * nFr * 0.5;
      tgt.x = p.x + Math.cos(a0) * 300; tgt.y = p.y + Math.sin(a0) * 300;
      kickBall(p, tgt.x, tgt.y, v0, lift, { at: Math.ceil(nFr) + 8, fire: 1, curl, hot: 1, snd: 1.3 });
      M.shake = 10; M.flash = 10;
      banner("TIRO DELLA RONDINE!", "Le ali si aprono, il pallone ride", false, 1300);
      snd("playEmblemCrit");
    } else {
      kickBall(p, tgt.x, tgt.y, v0, lift, { at: 46, snd: 0.9 + charge * 0.4 });
      if (charge > 0.8) M.shake = 3;
    }
    M.shots[0]++;
    M.hintCurve = 80;
    void dg;
  }

  function aiShoot(p) {
    const D = M.D;
    const tgt = aimShot(p, 0.8, D.noise);
    const dg = dist(p.x, p.y, goalXOf(p.team), GM);
    kickBall(p, tgt.x, tgt.y, clamp(9.5 + dg * 0.016, 11, 17.5), clamp(0.5 + dg * 0.004, 0.6, 2.4), { snd: 1.1 });
    M.shots[1]++;
  }

  // ---------------------------------------------------------------- scelta passaggio
  function mates(p) { return M.tm[p.team].filter((m) => m !== p && !m.isGK); }
  function passScore(p, m, dirHint) {
    const d = dist(p.x, p.y, m.x, m.y);
    if (d < 60 || d > 560) return -9;
    const adv = (uOf(p.team, m.x) - uOf(p.team, p.x)) * LEN;
    const open = clamp(threatAt(p, m.x, m.y), 0, 130) / 130;
    const lane = laneClear(p, m.x, m.y, 30) ? 1 : -0.7;
    let s = adv * 0.0035 + open * 0.9 + lane * 0.7 - d * 0.0005;
    if (p.team === 0 && ((p.i === 3 && m.i === 4) || (p.i === 4 && m.i === 3))) s += 0.18;
    if (dirHint) {
      const al = ((m.x - p.x) * dirHint.x + (m.y - p.y) * dirHint.y) / d;
      s = al * 2.2 + open * 0.3 + lane * 0.3 - d * 0.0006;
      if (al < 0.35) s -= 5;
    }
    return s;
  }
  function bestPass(p, dirHint) {
    let best = null, bs = -99;
    mates(p).forEach((m) => { const s = passScore(p, m, dirHint); if (s > bs) { bs = s; best = m; } });
    return best ? { m: best, score: bs } : null;
  }

  // ---------------------------------------------------------------- movimento
  function moveTo(p, tx, ty, mul, tight) {
    const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
    let sp = p.spd * (mul || 1);
    if (d < 40 && !tight) sp *= Math.max(0.15, d / 40);
    let wx = 0, wy = 0;
    if (d > 2) { wx = (dx / d) * sp; wy = (dy / d) * sp; }
    p.vx += (wx - p.vx) * 0.22; p.vy += (wy - p.vy) * 0.22;
  }
  function integrate(p) {
    if (p.stun > 0) { p.stun--; p.vx *= 0.8; p.vy *= 0.8; }
    p.x = clamp(p.x + p.vx, XL - 4, XR + 4); p.y = clamp(p.y + p.vy, YT - 6, YB + 6);
    if (p.cd > 0) p.cd--;
    if (p.lungeCd > 0) p.lungeCd--;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > 0.5) { p.face = Math.atan2(p.vy, p.vx); p.ph += sp * 0.11; }
  }

  // ---------------------------------------------------------------- IA
  function computeChasers() {
    const b = M.ball;
    const ref = b.owner ? { x: b.owner.x, y: b.owner.y } : predictBall(10);
    for (let t = 0; t < 2; t++) {
      const arr = M.tm[t].filter((p) => !p.isGK && p !== M.ctl).sort((a, c) => dist(a.x, a.y, ref.x, ref.y) - dist(c.x, c.y, ref.x, ref.y));
      M.chase[t] = arr.slice(0, 2);
    }
  }

  function formationTarget(p, hasPoss) {
    const b = M.ball, t = p.team;
    const bu = uOf(t, b.x), bv = (b.y - YT) / (YB - YT);
    const line = t === 1 ? M.opp.line : 0;
    let u = p.bu + (bu - 0.5) * 0.36 + (hasPoss ? 0.17 : -0.06) + line * (hasPoss ? 0 : 1);
    let v = p.bv + (bv - 0.5) * 0.4;
    if (hasPoss && p.role === "FWD") v = clamp(bv + (p.bv - 0.5) * 0.9 + Math.sin(M.tick * 0.02 + p.i) * 0.2, 0.12, 0.88);
    if (hasPoss && p.role === "MID") v = clamp(bv + (bv < 0.5 ? 0.22 : -0.22), 0.15, 0.85);
    const lim = p.role === "DEF" ? [0.1, 0.56] : p.role === "MID" ? [0.22, 0.8] : [0.36, 0.93];
    u = clamp(u, lim[0], lim[1]);
    v = clamp(v, 0.08, 0.92);
    return { x: xOfU(t, u), y: yOfV(v) };
  }

  function updateAI(p) {
    const b = M.ball, D = M.D;
    if (p.stun > 0) { integrate(p); return; }
    if (p.isGK) { gkUpdate(p); integrate(p); return; }
    if (b.owner === p) { aiCarrier(p); integrate(p); return; }
    if (b.passTo === p && !b.owner) {
      const q = predictBall(Math.min(26, dist(p.x, p.y, b.x, b.y) / 6));
      moveTo(p, q.x, q.y, 1.05, true); integrate(p); return;
    }
    const ownerTeam = b.owner ? b.owner.team : -1;
    const ch = M.chase[p.team];
    const press = p.team === 1 ? M.opp.press : 220;
    if (ownerTeam !== p.team) {
      const ref = b.owner ? b.owner : predictBall(8);
      const dRef = dist(p.x, p.y, ref.x, ref.y);
      if (p === ch[0] && (dRef < press + 160 || !b.owner)) {
        let tx = ref.x, ty = ref.y;
        if (b.owner && dRef > 60) { tx += dirOf(p.team) * -0.0 + (ownX(p.team) - ref.x) * 0.06; }
        moveTo(p, tx, ty, 1.0, true);
      } else if (p === ch[1] && p.role !== "FWD" && dRef < press) {
        const tx = ref.x + (ownX(p.team) - ref.x) * 0.3, ty = ref.y + (GM - ref.y) * 0.25;
        moveTo(p, tx, ty, 0.95);
      } else {
        const f = formationTarget(p, false); moveTo(p, f.x, f.y, 0.9);
      }
      // piccolo marcamento su avversario libero davanti alla porta
    } else {
      const f = formationTarget(p, true);
      moveTo(p, f.x, f.y, 0.95);
    }
    void D;
    integrate(p);
  }

  function aiCarrier(p) {
    const b = M.ball, D = M.D, t = p.team;
    const gx = goalXOf(t);
    if (M.state === "restart" || M.state === "kickoff") { p.vx *= 0.7; p.vy *= 0.7; return; }
    if (p.think > 0) {
      p.think--;
      const tg = p.dribT || { x: gx, y: GM };
      moveTo(p, tg.x, tg.y, 0.92, true);
      return;
    }
    p.think = D.react + Math.floor(Math.random() * 6);
    if (t === 0) p.think = 28;
    const dg = dist(p.x, p.y, gx, GM);
    const shootRange = t === 1 ? M.opp.shoot - 40 + M.diffIdx * 20 : 340;
    const near = threatAt(p, p.x, p.y);
    if (t === 1 && dg < shootRange && laneClear(p, gx, GM, 26) && Math.abs(p.y - GM) < 260 && (uOf(t, p.x) > 0.6)) { aiShoot(p); return; }
    if (t === 1 && dg < 190) { aiShoot(p); return; }
    const pass = bestPass(p);
    const gkOwn = p.isGK;
    if (pass && (gkOwn || (near < 58 && pass.score > 0.15) || (pass.score > 1.15 && Math.random() < 0.45))) {
      if (t === 0 && M.ctl === p) return;
      doPass(p, pass.m, 1); return;
    }
    // dribbling con schivata
    let tx = gx, ty = GM + (p.y < GM ? -30 : 30) * 0;
    ty = p.y + (GM - p.y) * 0.4;
    let ax = 0, ay = 0;
    M.tm[1 - t].forEach((q) => {
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
      if (d < 120 && dx * dirOf(t) > -10) { const w = (120 - d) / 120; ay -= Math.sign(dy || (Math.random() - 0.5)) * w * 190; ax -= dirOf(t) * w * 20; }
    });
    p.dribT = { x: clamp(tx + ax, XL, XR), y: clamp(ty + ay, YT + 20, YB - 20) };
    if (Math.abs(p.x - ownX(t)) < 100 && near < 70 && !gkOwn) { // sbarazzati
      p.dribT = { x: p.x + dirOf(t) * 300, y: p.y < GM ? YT + 40 : YB - 40 };
    }
  }

  function gkUpdate(g) {
    const b = M.ball, D = M.D, t = g.team;
    const dIn = dirOf(t);
    const gx = ownX(t);
    const reach = (t === 1 ? D.reach : 36) * (b.fire ? 0.62 : 1);
    const gks = t === 1 ? D.gk : 3.4;
    if (b.owner === g) {
      g.hold--; g.vx *= 0.8; g.vy *= 0.8;
      if (g.hold <= 0 && M.state === "play") {
        const pass = bestPass(g);
        const m = pass ? pass.m : M.tm[t][3];
        const d = dist(g.x, g.y, m.x, m.y);
        kickBall(g, m.x, m.y, clamp(passSpeed(d), 9, 15), 1.4, { to: m, snd: 0.9 });
        M.lastPass = { from: g, to: m, t: M.t };
        if (t === 0) { M.ctl = m; M.ctlLock = 20; }
      }
      return;
    }
    const toward = b.vx * -dIn > 1.5;
    let ty = GM + (b.y - GM) * 0.32, tx = gx + dIn * 22;
    let sp = gks;
    if (toward) {
      const distX = Math.abs(b.x - gx);
      const tt = distX / Math.max(Math.abs(b.vx), 1);
      if (distX < 640) {
        if (!g.err || g.errT !== b.lastP) { g.err = rnd(-1, 1) * (t === 1 ? (D.noise * 0.7) : 14); g.errT = b.lastP; }
        ty = clamp(b.y + b.vy * tt * 0.9 + g.err * (distX / 640), GT - 14, GB + 14);
        if (distX < 220) { sp = gks * 1.9; tx = gx + dIn * 14; }
      }
    } else if (!b.owner && Math.abs(b.x - gx) < 120 && Math.abs(b.y - GM) < 130 && b.z < 20 && Math.hypot(b.vx, b.vy) < 5) {
      ty = b.y; tx = b.x; sp = gks * 1.2; // esce a prendere la palla
    }
    ty = clamp(ty, GT - 20, GB + 20);
    const dx = tx - g.x, dy = ty - g.y, d = Math.hypot(dx, dy);
    if (d > 1) { g.vx += (dx / d * Math.min(sp, d * 0.4) - g.vx) * 0.35; g.vy += (dy / d * Math.min(sp, d * 0.4) - g.vy) * 0.35; }
    g.x = clamp(g.x, XL - 2, XL + BOX_D - 10); if (t === 1) g.x = clamp(g.x, XR - BOX_D + 10, XR + 2);
    // parata
    if (!b.owner && b.z < 40 && M.state === "play") {
      const dxB = Math.abs(b.x - g.x), dyB = Math.abs(b.y - g.y);
      if (dxB < 24 + Math.min(10, Math.abs(b.vx)) && dyB < reach && (b.lastTeam !== t)) {
        const sp0 = Math.hypot(b.vx, b.vy);
        M.saves[t]++;
        if (sp0 < 11 + (t === 1 ? M.diffIdx * 2 : 2) && !b.fire && Math.random() < 0.7) {
          b.owner = g; g.hold = 55; b.vx = b.vy = 0; b.passTo = null; b.at = 0; b.lastTeam = t; b.lastP = g;
          say(t === 1 ? "Parata! Presa sicura" : "Sandro la blocca!", 1200);
        } else {
          b.vx = dIn * Math.max(4, sp0 * 0.45); b.vy = (b.y - g.y) * 0.35 + rnd(-2.5, 2.5); b.vz = 1.5; b.at = 0; b.fire = 0; b.passTo = null; b.lastTeam = t; b.lastP = g;
          say("Parata in angolo!", 1100); M.shake = 4;
        }
        g.cd = 20;
        snd("playBounce"); spark(b.x, b.y, 10, "#fde68a", 3);
        if (t === 0) addGrinta(6);
      }
    }
  }

  // ---------------------------------------------------------------- utente
  function userUpdate(p) {
    const b = M.ball, D = M.D;
    if (p.stun > 0) { integrate(p); return; }
    let jx = input.jx + input.kx, jy = input.jy + input.ky, mag = Math.hypot(jx, jy);
    if (input.touchOn && SET.ctrl === "touch") {
      const dx = input.tx - p.x, dy = input.ty - p.y, d = Math.hypot(dx, dy);
      if (d > 10) { jx = dx / d; jy = dy / d; mag = Math.min(1, d / 40); } else { jx = jy = mag = 0; }
    }
    if (mag > 1) { jx /= mag; jy /= mag; mag = 1; }
    const wantSprint = input.sprint && mag > 0.2 && !M.stamLock && M.stam > 0;
    if (wantSprint) { M.stam = Math.max(0, M.stam - 0.0075); if (M.stam <= 0.01) M.stamLock = true; }
    else { M.stam = Math.min(1, M.stam + 0.004); if (M.stamLock && M.stam > 0.3) M.stamLock = false; }
    let sp = p.spd * (wantSprint ? 1.34 : 1) * (b.owner === p ? 0.94 : 1);
    if (p.lunge > 0) {
      p.lunge--;
      const a = p.face; p.vx = Math.cos(a) * p.spd * 2.4; p.vy = Math.sin(a) * p.spd * 2.4;
      if (p.lunge === 0) { p.stun = 16; }
    } else if (mag > 0.12) {
      const m2 = Math.min(1, mag * 1.15);
      p.vx += (jx / mag * sp * m2 - p.vx) * 0.28; p.vy += (jy / mag * sp * m2 - p.vy) * 0.28;
    } else { p.vx *= 0.7; p.vy *= 0.7; }
    if (wantSprint && Math.random() < 0.35) M.parts.push({ x: p.x - p.vx * 2, y: p.y + 8, vx: -p.vx * 0.1, vy: -0.3, life: 14, max: 14, col: "rgba(214,200,160,.7)", size: 3 });
    integrate(p);
    if (b.owner === p) { input.userMag = mag; }
  }

  function userActions() {
    const p = M.ctl, b = M.ball;
    if (!p || M.state !== "play") { input.passEdge = false; input.shootRel = false; input.rond = false; if (M.state !== "kickoff") { return; } }
    // calcio d'inizio: qualunque azione
    const near = dist(p.x, p.y, b.x, b.y) < 34 && b.z < 28;
    const hasBall = b.owner === p;
    const canTouch = hasBall || (near && !b.owner && p.cd <= 0);
    if (input.passEdge) {
      input.passEdge = false;
      if (canTouch) {
        let dh = null;
        const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
        if (mg > 0.3) dh = { x: jx / mg, y: jy / mg };
        const bp = bestPass(p, dh) || bestPass(p);
        if (bp) { doPass(p, bp.m, 1); addGrinta(2); }
      } else if (p.lungeCd <= 0 && p.stun <= 0 && p.lunge <= 0) {
        p.lunge = 13; p.lungeCd = 50;
        const tx = b.owner ? b.owner.x : b.x, ty = b.owner ? b.owner.y : b.y;
        if (Math.hypot(tx - p.x, ty - p.y) < 220) p.face = Math.atan2(ty - p.y, tx - p.x);
        snd("playTackle");
      }
    }
    if (input.charging) input.chargeF++;
    if (input.shootRel) {
      input.shootRel = false;
      const ch = clamp(input.chargeF / 42, 0.18, 1);
      input.chargeF = 0;
      if (canTouch) { userShoot(p, ch, false); }
    }
    if (input.rond) {
      input.rond = false;
      if (M.grinta >= 100 && canTouch) userShoot(p, 1, true);
    }
    // lunge: contatto con portatore
    if (p.lunge > 0) {
      const o = b.owner;
      if (o && o.team !== p.team && dist(p.x, p.y, o.x, o.y) < 24 && p.cd <= 0) { steal(p, o); p.lunge = 0; p.stun = 4; }
      else if (!o && dist(p.x, p.y, b.x, b.y) < 24 && b.z < 20) { b.owner = p; b.passTo = null; b.lastTeam = p.team; b.lastP = p; p.lunge = 0; }
    }
  }

  function steal(q, o) {
    const b = M.ball;
    b.owner = q; b.passTo = null; b.at = 0; b.lastTeam = q.team; b.lastP = q;
    o.stun = 18; o.cd = 40; q.cd = 14;
    snd("playTackle"); spark(o.x, o.y, 8, "#e2d5a8", 2.5);
    if (q.team === 0) { addGrinta(7); say("Palla recuperata!", 800); M.ctl = q; M.ctlLock = 10; }
    else { setLabel("Palla persa"); }
  }

  // ---------------------------------------------------------------- fisica palla e fuori
  function updateBall() {
    const b = M.ball;
    b.rot += Math.hypot(b.vx, b.vy) * 0.08;
    if (b.owner) {
      const o = b.owner;
      const wob = Math.sin(o.ph * 1.6) * 2;
      const ox = o.x + Math.cos(o.face) * (15 + wob), oy = o.y + Math.sin(o.face) * (15 + wob);
      b.x += (ox - b.x) * 0.5; b.y += (oy - b.y) * 0.5; b.vx = o.vx; b.vy = o.vy; b.z = 0; b.vz = 0; b.lastTeam = o.team; b.lastP = o;
      b.fire = 0; b.at = 0;
      // contrasti
      M.tm[1 - o.team].forEach((q) => {
        if (q.isGK || q.cd > 0 || q.stun > 0 || q === M.ctl) return;
        const d = dist(q.x, q.y, o.x, o.y);
        if (d < 20) {
          const base = q.team === 1 ? M.D.tkl * q.tkMul : 0.035;
          const sh = o === M.ctl && input.sprint && !M.stamLock ? 0.7 : 1;
          if (Math.random() < base * sh) steal(q, o); else if (Math.random() < 0.02) q.cd = 12;
        }
      });
      // portiere avversario prende palla in area se sbaglia? no
      return;
    }
    // palla libera
    const ground = b.z <= 0.01 && b.vz <= 0;
    let sp = Math.hypot(b.vx, b.vy);
    if (b.at > 0 && sp > 1) {
      b.at--;
      let ang = b.curl || 0;
      if (b.atTeam === 0) {
        const jx = input.jx + input.kx, jy = input.jy + input.ky;
        const cross = (b.vx * jy - b.vy * jx) / sp;
        const g = b.fire ? 0.034 : 0.026;
        ang += clamp(cross, -1, 1) * g;
        if (Math.abs(cross) > 0.3) b.userCurved = 8;
      }
      if (ang) { const c = Math.cos(ang), s = Math.sin(ang); const nx = b.vx * c - b.vy * s, ny = b.vx * s + b.vy * c; b.vx = nx; b.vy = ny; }
    }
    const f = ground ? FR : 0.995;
    b.vx *= f; b.vy *= f;
    b.x += b.vx; b.y += b.vy;
    if (b.z > 0 || b.vz > 0) {
      b.vz -= 0.28; b.z += b.vz;
      if (b.z <= 0) { b.z = 0; if (b.vz < -1.4) { b.vz = -b.vz * 0.5; snd("playBounce"); } else b.vz = 0; }
    }
    if (b.fire || Math.hypot(b.vx, b.vy) > 13) { b.trail.unshift({ x: b.x, y: b.y, z: b.z }); if (b.trail.length > 10) b.trail.pop(); } else if (b.trail.length) b.trail.pop();
    if (b.fire && Math.random() < 0.6) M.parts.push({ x: b.x, y: b.y - b.z, vx: rnd(-.5, .5), vy: rnd(-.5, .5), life: 20, max: 20, col: "#fb923c", size: 3 });
    if (b.lastTeam === 0 && b.passTo && b.passTo.team === 0) { /* in volo verso compagno */ }
    checkBounds();
  }

  function checkBounds() {
    const b = M.ball;
    if (M.state !== "play") return;
    if (b.y < YT || b.y > YB) { outSide(); return; }
    if (b.x < XL || b.x > XR) {
      const left = b.x < XL;
      const defTeam = left ? 0 : 1;
      const scoreFor = 1 - defTeam;
      if (b.y > GT && b.y < GB && b.z < 46) {
        // pali
        if (Math.abs(b.y - GT) < 5 || Math.abs(b.y - GB) < 5) {
          b.x = left ? XL : XR; b.vx = -b.vx * 0.55; b.vy += (b.y < GM ? -1 : 1) * 2.2;
          snd("playPost"); M.shake = 6; say("PALO!", 900); spark(b.x, b.y, 10, "#fff", 3);
          return;
        }
        goalScored(scoreFor);
        return;
      }
      if (b.z >= 46 && b.y > GT && b.y < GB) say("Sopra la traversa!", 900);
      outEnd(defTeam);
    }
  }

  function restartAt(taker, x, y, label) {
    const b = M.ball;
    taker.x = x; taker.y = y; taker.vx = taker.vy = 0; taker.stun = 0;
    taker.face = Math.atan2(GM - y, W / 2 - x) * 0.5 + (taker.team === 0 ? 0 : Math.PI) * 0.0;
    taker.face = taker.team === 0 ? 0 : Math.PI;
    b.x = x; b.y = y; b.vx = b.vy = 0; b.z = 0; b.vz = 0; b.owner = taker; b.passTo = null; b.at = 0; b.fire = 0; b.trail.length = 0; b.lastTeam = taker.team; b.lastP = taker;
    taker.think = 12; taker.cd = 0;
    if (taker.team === 0 && !taker.isGK) { M.ctl = taker; }
    M.state = "restart"; M.timer = 44; setLabel(label);
    snd("playWhistle", false);
  }
  function nearest(team, x, y, noGK) {
    let best = null, bd = 1e9;
    M.tm[team].forEach((p) => { if (noGK && p.isGK) return; const d = dist(p.x, p.y, x, y); if (d < bd) { bd = d; best = p; } });
    return best;
  }
  function outSide() {
    const b = M.ball;
    const team = 1 - b.lastTeam;
    const x = clamp(b.x, XL + 30, XR - 30), y = b.y < YT ? YT + 2 : YB - 2;
    const tk = nearest(team, x, y, true);
    restartAt(tk, x, y, "Rimessa laterale");
  }
  function outEnd(defTeam) {
    const b = M.ball;
    if (b.lastTeam === defTeam) {
      // calcio d'angolo per l'attacco
      const att = 1 - defTeam;
      const cx = defTeam === 0 ? XL + 4 : XR - 4, cy = b.y < GM ? YT + 4 : YB - 4;
      const tk = nearest(att, cx, cy, true);
      restartAt(tk, cx, cy, "Calcio d'angolo");
    } else {
      const g = M.tm[defTeam][0];
      restartAt(g, xOfU(defTeam, 0.07), GM, "Rinvio dal fondo");
      g.hold = 50;
    }
  }

  function pickups() {
    const b = M.ball;
    if (b.owner || M.state !== "play" || b.z > 20) return;
    let best = null, bd = 1e9;
    const sp = Math.hypot(b.vx, b.vy);
    M.pl.forEach((p) => {
      if (p.stun > 0 || p.cd > 0 || p.lunge > 0) return;
      if (p.isGK) {
        const inBox = p.team === 0 ? b.x < XL + BOX_D && b.y > BOX_T && b.y < BOX_B : b.x > XR - BOX_D && b.y > BOX_T && b.y < BOX_B;
        if (!(inBox && sp < 6)) return;
      }
      let R = 15;
      if (b.passTo === p) R = 24;
      if (p === M.ctl) R = 21;
      if (sp > 14) R -= 4;
      const d = dist(p.x, p.y, b.x, b.y);
      if (d < R && d < bd) { bd = d; best = p; }
    });
    if (best) {
      const prev = b.lastTeam;
      b.owner = best; b.passTo = null; b.at = 0; b.fire = 0; b.lastTeam = best.team; b.lastP = best;
      if (best.team === 0 && !best.isGK) { M.ctl = best; if (M.lastPass && M.lastPass.to === best && prev === 0) { addGrinta(4); if ((M.lastPass.from.i === 3 && best.i === 4) || (M.lastPass.from.i === 4 && best.i === 3)) { addGrinta(5); say("Una-due Leo-Nico!", 900); } } }
      if (best.isGK) best.hold = 40;
    }
  }

  // ---------------------------------------------------------------- gol
  function goalScored(team) {
    const b = M.ball;
    M.score[team]++;
    M.state = "goal"; M.goalPhase = 0; M.goalTimer = 0;
    const scorer = b.lastTeam === team ? b.lastP : null;
    M.lastScorer = scorer; M.goalTeam = team;
    M.goalsLog.push({ team, t: M.t, who: scorer ? scorer.name : "?" });
    M.shake = 12; M.flash = 10;
    spark(b.x, b.y, 40, team === 0 ? "#7dd3fc" : "#fca5a5", 5);
    snd("playGoal");
    const min = clockMin();
    const nm = scorer ? scorer.name : "Autorete";
    if (team === 0) {
      banner("GOOOL!", `${nm} · ${min}'`, false, 2200);
      addGrinta(0);
    } else {
      banner("GOL " + M.opp.tag, `${nm} · ${min}'`, true, 1800);
      addGrinta(12);
    }
    if (team === 0) PROG.goals++;
    b.owner = null; b.at = 0; b.fire = 0;
    b.vx *= 0.35; b.vy *= 0.2; b.passTo = null;
    // pool snapshot per replay
    M.repFrames = Math.min(M.fcount, 120);
    M.repEnd = M.fi;
  }
  function clockMin() { const f = M.golden ? 90 + Math.floor((M.t - MATCH_SECS) / GOLDEN_SECS * 6) : Math.floor(M.t / MATCH_SECS * 90); return Math.max(1, f); }

  function banner(h, p, bad, ms) {
    const el = stage.querySelector(".ahd-banner");
    if (!el) return;
    el.className = "ahd-banner" + (bad ? " bad" : "");
    el.innerHTML = `<div class="ahd-bg"><h1>${h}</h1><p>${p || ""}</p></div>`;
    el.style.display = "block";
    M.bannerT = Math.round(ms / 16.67);
  }

  // ---------------------------------------------------------------- frame snapshot (replay)
  function snap() {
    const b = M.ball, f = M.frames, o = M.fi * 44;
    f[o] = b.x; f[o + 1] = b.y; f[o + 2] = b.z; f[o + 3] = b.rot;
    for (let i = 0; i < 10; i++) { const p = M.pl[i]; const k = o + 4 + i * 4; f[k] = p.x; f[k + 1] = p.y; f[k + 2] = p.face; f[k + 3] = p.ph; }
    M.fi = (M.fi + 1) % 150; M.fcount = Math.min(150, M.fcount + 1);
  }

  // ---------------------------------------------------------------- step principale
  function step() {
    M.tick++;
    if (M.shake > 0) M.shake *= 0.9;
    if (M.flash > 0) M.flash--;
    if (M.msgT > 0 && --M.msgT === 0) { const el = stage.querySelector(".ahd-msg"); if (el) el.style.display = "none"; }
    if (M.bannerT > 0 && --M.bannerT === 0) { const el = stage.querySelector(".ahd-banner"); if (el) el.style.display = "none"; }
    if (M.labelT > 0) M.labelT--;
    if (M.hintCurve > 0) M.hintCurve--;
    for (let i = M.parts.length - 1; i >= 0; i--) { const q = M.parts[i]; q.x += q.vx; q.y += q.vy; q.vy += 0.04; q.life--; if (q.life <= 0) M.parts.splice(i, 1); }
    if (M.ctlLock > 0) M.ctlLock--;

    const st = M.state;
    if (st === "full" || st === "half") return;

    if (st === "kickoff") {
      M.timer--;
      M.pl.forEach((p) => { integrate(p); });
      updateBall();
      const kp = M.kickTeam === 0 && M.ball.owner === M.ctl;
      if (M.timer <= 0 || (kp && (input.passEdge || input.shootRel || Math.abs(input.jx + input.kx) + Math.abs(input.jy + input.ky) > 0.3 || input.touchOn))) {
        M.state = "play"; M.timer = 0;
        const k = M.ball.owner; if (k && k.team === 1) k.think = 6;
      }
      return;
    }
    if (st === "restart") {
      M.timer--;
      updateBall();
      if (M.timer <= 0) M.state = "play";
      return;
    }
    if (st === "goal") { stepGoal(); return; }

    // ---- play
    M.t += STEP * (DEBUG && window.__ahdTS ? window.__ahdTS : 1);
    if (!M.halfDone && M.t >= HALF_SECS && !M.golden) {
      M.halfDone = true; M.state = "half"; banner("INTERVALLO", `${M.score[0]} - ${M.score[1]}`, false, 1800);
      snd("playWhistle", true);
      later(() => { if (closed || !M) return; setupKickoff(1); }, 1900);
      return;
    }
    if (M.t >= MATCH_SECS && !M.golden) {
      if (M.score[0] === M.score[1]) { M.golden = true; banner("SUPPLEMENTARI", "Gol d'oro: il prossimo vince!", false, 1900); snd("playWhistle", true); }
      else { endMatch(); return; }
    }
    if (M.golden && M.t >= MATCH_SECS + GOLDEN_SECS) { endMatch(); return; }

    chooseControl();
    computeChasers();
    M.pl.forEach((p) => { if (p === M.ctl) userUpdate(p); else updateAI(p); });
    separate();
    updateBall();
    userActions();
    pickups();
    snap();
    // hint tutorial
    if (M.mi <= 0 && !M.hintShot && M.ball.owner === M.ctl && uOf(0, M.ctl.x) > 0.62) { M.hintShot = true; say("Tieni TIRO per caricare, rilascia per calciare!", 2600); }
  }

  function chooseControl() {
    const b = M.ball, t0 = M.tm[0];
    if (b.owner && b.owner.team === 0 && !b.owner.isGK) { M.ctl = b.owner; return; }
    if (b.passTo && b.passTo.team === 0 && !b.owner) { M.ctl = b.passTo; return; }
    if (M.ctlLock > 0 && !M.ctl.isGK) return;
    const ref = b.owner ? b.owner : predictBall(8);
    let best = null, bd = 1e9;
    t0.forEach((p) => { if (p.isGK) return; const d = dist(p.x, p.y, ref.x, ref.y); if (d < bd) { bd = d; best = p; } });
    if (!best) return;
    const cd = M.ctl && !M.ctl.isGK ? dist(M.ctl.x, M.ctl.y, ref.x, ref.y) : 1e9;
    if (best !== M.ctl && (bd < cd - 34 || M.ctl.isGK)) { M.ctl = best; M.ctlLock = 14; }
  }

  function separate() {
    const pl = M.pl;
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
      const a = pl[i], c = pl[j];
      if (a.isGK || c.isGK) continue;
      const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy);
      if (d < 22 && d > 0.01) { const o = (22 - d) * 0.25; a.x -= dx / d * o; a.y -= dy / d * o; c.x += dx / d * o; c.y += dy / d * o; }
    }
  }

  function stepGoal() {
    M.goalTimer++;
    const b = M.ball;
    // la palla continua a rotolare in rete
    b.vx *= 0.9; b.vy *= 0.9; b.x += b.vx; b.y += b.vy;
    b.x = clamp(b.x, XL - 32, XR + 32); b.y = clamp(b.y, GT + 4, GB - 4);
    if (b.z > 0 || b.vz > 0) { b.vz -= 0.28; b.z = Math.max(0, b.z + b.vz); if (b.z === 0) b.vz = 0; }
    M.pl.forEach((p) => { if (M.goalTeam === 0 && p.team === 0 && !p.isGK && M.goalTimer < 80) { const tx = M.lastScorer ? M.lastScorer.x : p.x; void tx; p.vx *= 0.9; } integrate(p); });
    if (M.goalPhase === 0 && M.goalTimer > 55) {
      if (M.goalTeam === 0 && M.repFrames > 20) { M.goalPhase = 1; M.rep = { i: Math.max(0, M.repFrames - 120), n: M.repFrames, pos: 0 }; M.rep.i = 0; M.rep.start = M.repFrames > 110 ? 110 : M.repFrames; M.rep.f = 0; M.rep.total = Math.min(M.repFrames, 110); const rp = stage.querySelector(".ahd-rep"); if (rp) rp.style.display = "block"; }
      else { M.goalPhase = 2; }
    }
    if (M.goalPhase === 1) {
      M.rep.f += 0.7;
      if (M.rep.f >= M.rep.total - 1 || input.skip) { input.skip = false; endReplay(); }
    }
    if (M.goalPhase === 2) { M.goalTimer2 = (M.goalTimer2 || 0) + 1; if (M.goalTimer2 > 35) { M.goalTimer2 = 0; afterGoal(); } }
  }
  function endReplay() {
    M.rep = null; M.goalPhase = 2; M.goalTimer2 = 0;
    const rp = stage.querySelector(".ahd-rep"); if (rp) rp.style.display = "none";
  }
  function afterGoal() {
    if (M.golden) { endMatch(); return; }
    const el = stage.querySelector(".ahd-banner"); if (el) el.style.display = "none";
    setupKickoff(1 - M.goalTeam);
  }

  // ---------------------------------------------------------------- fine partita
  function endMatch() {
    if (M.ended) return;
    M.ended = true; M.state = "full";
    snd("playWhistle", true);
    const [a, c] = M.score;
    banner("FISCHIO FINALE", `${a} - ${c}`, false, 2200);
    later(() => { if (!closed) showResult(); }, 1700);
  }

  // ---------------------------------------------------------------- render
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; vigKey = ""; }
    return dpr;
  }

  function drawPlayer(g, p, isCtl, tick, x, y, face, ph) {
    const sp = Math.hypot(p.vx, p.vy);
    const moving = sp > 0.6;
    const sw = moving ? Math.sin(ph) * 4 : 0;
    g.fillStyle = "rgba(0,0,0,.33)"; g.beginPath(); g.ellipse(x, y + 11, 12, 5, 0, 0, 7); g.fill();
    if (isCtl) {
      g.strokeStyle = "#facc15"; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x, y + 11, 17, 8, 0, 0, 7); g.stroke();
    }
    // gambe
    g.fillStyle = "#f1f5f9"; g.fillRect(x - 6, y + 2 + (sw > 0 ? 0 : 1), 4.5, 8 + sw * 0.4);
    g.fillRect(x + 1.5, y + 2 + (sw > 0 ? 1 : 0), 4.5, 8 - sw * 0.4);
    g.fillStyle = "#111827"; g.fillRect(x - 6, y + 9 + sw * 0.4, 5, 3); g.fillRect(x + 1.5, y + 9 - sw * 0.4, 5, 3);
    // maglia
    const lean = Math.cos(face) * 1.5;
    g.fillStyle = p.kit; g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10, 9.5, 0, 0, 7); g.fill();
    g.strokeStyle = p.kit2; g.lineWidth = 2.4; g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10, 9.5, 0, 0.35, 2.8); g.stroke();
    g.fillStyle = p.kit2; g.fillRect(x - 10 + lean * 0.5, y - 6, 20, 2.6);
    // braccia
    g.fillStyle = "#e8b88c"; g.beginPath(); g.arc(x - 10.5 + lean, y - 3 + sw * 0.3, 2.6, 0, 7); g.arc(x + 10.5 + lean, y - 3 - sw * 0.3, 2.6, 0, 7); g.fill();
    // testa
    g.fillStyle = "#e8b88c"; g.beginPath(); g.arc(x + lean, y - 16, 6.2, 0, 7); g.fill();
    g.fillStyle = p.team === 0 ? "#3b2314" : "#1f1a17"; g.beginPath(); g.arc(x + lean, y - 18, 6.4, Math.PI, 0); g.fill();
    g.fillStyle = "#111"; g.fillRect(x + lean + Math.cos(face) * 2.4 - 0.8, y - 16, 1.6, 1.8);
    if (p.stun > 0) { g.fillStyle = "#fde047"; g.font = "bold 10px sans-serif"; g.textAlign = "center"; g.fillText("✦", x + 4, y - 26 - Math.sin(tick * 0.4) * 2); }
    if (isCtl) {
      g.fillStyle = "#facc15"; const yy = y - 32 + Math.sin(tick * 0.18) * 2;
      g.beginPath(); g.moveTo(x - 6, yy - 8); g.lineTo(x + 6, yy - 8); g.lineTo(x, yy); g.closePath(); g.fill();
      g.font = "bold 11px system-ui"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(p.name, x, yy - 12); g.fillStyle = "#fff"; g.fillText(p.name, x, yy - 12);
    }
  }

  function render() {
    const dpr = resize();
    const g = cx;
    const cw = cv.width / dpr, ch = cv.height / dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#07101c"; g.fillRect(0, 0, cw, ch);
    if (!M) return;
    if (!bgCache) bgCache = buildBg();
    const b = M.ball;

    // vista: replay o live
    let vb = { x: b.x, y: b.y, z: b.z, rot: b.rot }, vp = M.pl;
    if (M.rep) {
      const f = M.frames, n = M.repFrames, fi = Math.floor(M.rep.f);
      const idx = ((M.repEnd - Math.min(n, 110) + fi) % 150 + 150) % 150;
      const o = idx * 44;
      vb = { x: f[o], y: f[o + 1], z: f[o + 2], rot: f[o + 3] };
      if (!M._rp) M._rp = M.pl.map((p) => Object.assign({}, p));
      for (let i = 0; i < 10; i++) { const k = o + 4 + i * 4, q = M._rp[i], src = M.pl[i]; q.x = f[k]; q.y = f[k + 1]; q.face = f[k + 2]; q.ph = f[k + 3]; q.vx = src.vx * 0 + Math.cos(q.face) * 2; q.vy = Math.sin(q.face) * 2; q.stun = 0; }
      vp = M._rp;
    }

    // camera
    const s = Math.max(0.3, Math.min(cw / 520, ch / 380));
    const vw2 = cw / (2 * s), vh2 = ch / (2 * s);
    let fx = vb.x + (M.rep ? 0 : b.vx * 7), fy = vb.y + (M.rep ? 0 : b.vy * 4);
    if (!M.rep && M.ctl && M.state === "play") { fx = fx * 0.7 + M.ctl.x * 0.3; fy = fy * 0.7 + M.ctl.y * 0.3; }
    const minX = -MX + 20 + vw2, maxX = W + MX - 20 - vw2, minY = -90 + vh2, maxY = H + 70 - vh2;
    fx = minX > maxX ? W / 2 : clamp(fx, minX, maxX); fy = minY > maxY ? H / 2 : clamp(fy, minY, maxY);
    M.camX += (fx - M.camX) * (M.state === "kickoff" ? 0.2 : 0.12); M.camY += (fy - M.camY) * 0.12;
    if (M.tick < 3) { M.camX = fx; M.camY = fy; }
    let shx = 0, shy = 0;
    if (M.shake > 0.3) { shx = rnd(-1, 1) * M.shake; shy = rnd(-1, 1) * M.shake; }
    M.view = { s, cw, ch, cx: M.camX + shx / s, cy: M.camY + shy / s };

    g.save();
    g.translate(cw / 2, ch / 2); g.scale(s, s); g.translate(-M.view.cx, -M.view.cy);
    g.drawImage(bgCache, -MX, -MT);

    // etichette sul campo: marker obiettivo passaggio
    // ombra palla e traiettoria prevista del passaggio utente
    if (M.ctl && b.owner === M.ctl && M.state === "play") {
      const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
      const bp = bestPass(M.ctl, mg > 0.3 ? { x: jx / mg, y: jy / mg } : null) || bestPass(M.ctl);
      M.passHint = bp ? bp.m : null;
      if (bp) {
        const m = bp.m;
        g.strokeStyle = "rgba(125,211,252,.85)"; g.lineWidth = 2.4; g.setLineDash([6, 6]); g.lineDashOffset = -M.tick * 0.5;
        g.beginPath(); g.ellipse(m.x, m.y + 11, 19, 9, 0, 0, 7); g.stroke(); g.setLineDash([]);
      }
      // freccia di mira
      const gx = goalXOf(0);
      if (Math.abs(M.ctl.x - gx) < 560) {
        const ay = GM + clamp(jy * 1.3, -1, 1) * (GH / 2 - 9);
        g.fillStyle = "rgba(248,113,113," + (input.charging ? 0.95 : 0.4) + ")";
        g.beginPath(); g.arc(gx, mg > 0.25 ? ay : GM, 7, 0, 7); g.fill();
      }
    } else M.passHint = null;

    // giocatori ordinati per y
    const order = vp.map((p, i) => ({ p, i, y: p.y })).sort((a, c) => a.y - c.y);
    const ballLayer = (zOrderY) => {
      // ombra
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(vb.x, vb.y + 3, Math.max(3, 7 - vb.z * 0.05), Math.max(2, 3.4 - vb.z * 0.03), 0, 0, 7); g.fill();
      // scia
      if (!M.rep) b.trail.forEach((t, i) => { g.fillStyle = b.fire ? `rgba(251,146,60,${0.55 - i * 0.05})` : `rgba(255,255,255,${0.28 - i * 0.025})`; g.beginPath(); g.arc(t.x, t.y - 4 - t.z, 5.5 - i * 0.4, 0, 7); g.fill(); });
      const by = vb.y - 4 - vb.z;
      g.save(); g.translate(vb.x, by); g.rotate(vb.rot);
      g.fillStyle = b.fire && !M.rep ? "#fde68a" : "#fff"; g.beginPath(); g.arc(0, 0, 6.2, 0, 7); g.fill();
      g.fillStyle = "#1f2937"; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 1.6, 0, 7); g.fill(); }
      g.beginPath(); g.arc(0, 0, 1.7, 0, 7); g.fill();
      g.restore();
      g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(vb.x, by, 6.2, 0, 7); g.stroke();
      void zOrderY;
    };
    let ballDrawn = false;
    order.forEach((o) => {
      if (!ballDrawn && vb.y < o.y) { ballLayer(); ballDrawn = true; }
      drawPlayer(g, o.p, !M.rep && o.p === M.ctl && M.state !== "full", M.tick, o.p.x, o.p.y, o.p.face, o.p.ph);
    });
    if (!ballDrawn) ballLayer();

    // aftertouch hint
    if (!M.rep && M.hintCurve > 0 && b.at > 0 && !b.owner && b.atTeam === 0) {
      g.strokeStyle = "rgba(253,224,71,.9)"; g.lineWidth = 2.5; g.setLineDash([4, 5]);
      const sp = Math.hypot(b.vx, b.vy) || 1, nx = -b.vy / sp, ny = b.vx / sp;
      g.beginPath(); g.moveTo(b.x + nx * 22, b.y + ny * 22 - b.z); g.lineTo(b.x + nx * 40, b.y + ny * 40 - b.z); g.moveTo(b.x - nx * 22, b.y - ny * 22 - b.z); g.lineTo(b.x - nx * 40, b.y - ny * 40 - b.z); g.stroke(); g.setLineDash([]);
    }
    // particelle
    M.parts.forEach((q) => { g.globalAlpha = Math.max(0, q.life / q.max); g.fillStyle = q.col; g.beginPath(); g.arc(q.x, q.y, q.size, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    // barra di carica sopra il giocatore
    if (!M.rep && input.charging && M.ctl) {
      const c = clamp(input.chargeF / 42, 0, 1), px = M.ctl.x, py = M.ctl.y - 46;
      g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(px - 20, py, 40, 6);
      g.fillStyle = c > 0.85 ? "#ef4444" : "#fde047"; g.fillRect(px - 19, py + 1, 38 * c, 4);
    }
    g.restore();

    // vignette
    const key = cw + "x" + ch;
    if (vigKey !== key) {
      vigCache = g.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.35, cw / 2, ch / 2, Math.max(cw, ch) * 0.75);
      vigCache.addColorStop(0, "rgba(0,0,0,0)"); vigCache.addColorStop(1, "rgba(0,0,0,.45)"); vigKey = key;
    }
    g.fillStyle = vigCache; g.fillRect(0, 0, cw, ch);
    if (M.flash > 0) { g.fillStyle = `rgba(255,255,255,${M.flash * 0.04})`; g.fillRect(0, 0, cw, ch); }

    if (M.rep) { g.fillStyle = "rgba(30,50,90,.22)"; g.fillRect(0, 0, cw, ch); g.fillStyle = "rgba(0,0,0,.12)"; for (let y = 0; y < ch; y += 4) g.fillRect(0, y, cw, 1); }
    drawMini(g, cw, ch, vb, vp);
    // etichetta evento
    if (M.labelT > 0 && M.label) {
      g.font = "bold 13px system-ui"; g.textAlign = "center";
      const tw = g.measureText(M.label).width + 24;
      g.fillStyle = "rgba(7,16,28,.78)"; g.fillRect(cw / 2 - tw / 2, 6, tw, 24);
      g.fillStyle = "#e2e8f0"; g.fillText(M.label, cw / 2, 23);
    }
    if (M.state === "kickoff" && M.timer > 0 && M.kickTeam === 0) {
      g.font = "bold 14px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(cw / 2 - 90, ch * 0.62, 180, 26);
      g.fillStyle = "#fde047"; g.fillText("Muoviti o passa per iniziare", cw / 2, ch * 0.62 + 18);
    }
  }

  function drawMini(g, cw, ch, vb, vp) {
    const mw = 92, mh = 58, mx = 6, my = ch - mh - 8 - 0;
    // posizione in basso a sinistra sopra lo stick? Mettiamo in alto a sinistra sotto etichetta.
    const x0 = mx, y0 = 8;
    void my;
    g.fillStyle = "rgba(10,60,28,.72)"; g.fillRect(x0, y0, mw, mh);
    g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, mw - 1, mh - 1);
    g.beginPath(); g.moveTo(x0 + mw / 2, y0); g.lineTo(x0 + mw / 2, y0 + mh); g.stroke();
    const mxp = (x) => x0 + (x / W) * mw, myp = (y) => y0 + (y / H) * mh;
    vp.forEach((p) => { g.fillStyle = p.team === 0 ? "#38bdf8" : "#f87171"; g.beginPath(); g.arc(mxp(p.x), myp(p.y), p === M.ctl ? 3 : 2, 0, 7); g.fill(); });
    g.fillStyle = "#fff"; g.beginPath(); g.arc(mxp(vb.x), myp(vb.y), 2, 0, 7); g.fill();
    if (M.view) { const v = M.view; g.strokeStyle = "rgba(250,204,21,.8)"; g.strokeRect(mxp(v.cx - v.cw / 2 / v.s), myp(v.cy - v.ch / 2 / v.s), (v.cw / v.s / W) * mw, (v.ch / v.s / H) * mh); }
  }

  // ---------------------------------------------------------------- HUD DOM
  function hud() {
    if (!M || !root) return;
    const sc = root.querySelector(".ahd-sc");
    if (!sc) return;
    const mn = M.state === "full" ? (M.golden ? "90+" : "90") : clockMin();
    sc.querySelector("b").innerHTML = `<span class="ahd-ta">RON</span> ${M.score[0]} - ${M.score[1]} <span class="ahd-tb">${M.opp.tag}</span>`;
    sc.querySelector("small").textContent = (M.golden ? "Supplementari " : "") + mn + "' · " + M.opp.name + " · " + DIFFS[M.diffIdx].n;
    const gb = root.querySelector(".ahd-bar.g");
    gb.firstElementChild.style.width = M.grinta + "%"; gb.classList.toggle("full", M.grinta >= 100);
    root.querySelector(".ahd-bar.s i").style.width = M.stam * 100 + "%";
    root.querySelector(".ahd-b.ron").classList.toggle("on", M.grinta >= 100 && M.state === "play");
    const chg = root.querySelector(".ahd-chg");
    chg.style.display = input.charging ? "block" : "none"; chg.firstElementChild.style.width = clamp(input.chargeF / 42, 0, 1) * 100 + "%";
  }

  // ---------------------------------------------------------------- loop
  function loop(ts) {
    if (closed) return;
    raf = requestAnimationFrame(loop);
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000; lastTs = ts;
    if (dt > 0.1) dt = 0.1;
    if (M && uiState === "play" && !paused) {
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < 5) { step(); acc -= STEP; n++; if (!M || closed) return; }
      if (n === 5) acc = 0;
      hud();
    } else acc = 0;
    render();
  }

  // ---------------------------------------------------------------- input
  function onKey(e, down) {
    if (closed) return;
    const k = e.key;
    let used = true;
    if (k === "ArrowUp" || k === "w" || k === "W") input.ky = down ? -1 : (input.ky < 0 ? 0 : input.ky);
    else if (k === "ArrowDown" || k === "s" || k === "S") input.ky = down ? 1 : (input.ky > 0 ? 0 : input.ky);
    else if (k === "ArrowLeft" || k === "a" || k === "A") input.kx = down ? -1 : (input.kx < 0 ? 0 : input.kx);
    else if (k === "ArrowRight" || k === "d" || k === "D") input.kx = down ? 1 : (input.kx > 0 ? 0 : input.kx);
    else if (k === "z" || k === "Z" || k === " ") { if (down && !e.repeat) input.passEdge = true; }
    else if (k === "x" || k === "X" || k === "Enter") {
      if (down && !e.repeat) { input.charging = true; input.chargeF = 0; input.keyShoot = true; }
      else if (!down && input.keyShoot) { input.charging = false; input.shootRel = true; input.keyShoot = false; }
    }
    else if (k === "Shift" || k === "c" || k === "C") input.sprint = down;
    else if ((k === "v" || k === "V") && down) input.rond = true;
    else if ((k === "p" || k === "P" || k === "Escape") && down) { if (uiState === "play") pauseGame(); }
    else used = false;
    if (used) e.preventDefault();
  }

  function bindPad() {
    const pad = root.querySelector(".ahd-pad"), stk = root.querySelector(".ahd-stk"), knob = stk.firstElementChild;
    const rect = () => stage.getBoundingClientRect();
    const R = 52;
    const toWorld = (cxp, cyp) => {
      const r = rect(), v = M && M.view; if (!v) return;
      input.tx = (cxp - r.left - v.cw / 2) / v.s + v.cx; input.ty = (cyp - r.top - v.ch / 2) / v.s + v.cy;
    };
    const down = (e) => {
      if (stick.id !== -1) return;
      e.preventDefault();
      stick.id = e.pointerId;
      try { pad.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
      const r = rect();
      if (SET.ctrl === "touch") { input.touchOn = true; toWorld(e.clientX, e.clientY); return; }
      stick.ox = clamp(e.clientX - r.left, 62, r.width - 62); stick.oy = clamp(e.clientY - r.top, 62, r.height - 62);
      stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; stk.style.display = "block"; stk.classList.add("on");
      knob.style.transform = "translate(0,0)";
      stick.cx = e.clientX; stick.cy = e.clientY; stick.bx = e.clientX; stick.by = e.clientY;
      input.jx = input.jy = 0;
    };
    const move = (e) => {
      if (e.pointerId !== stick.id) return;
      e.preventDefault();
      if (SET.ctrl === "touch") { toWorld(e.clientX, e.clientY); return; }
      const dx = e.clientX - stick.bx, dy = e.clientY - stick.by, d = Math.hypot(dx, dy) || 1;
      const m = Math.min(1, d / R);
      input.jx = dx / d * m; input.jy = dy / d * m;
      // la base segue il dito se si esce dal raggio
      if (d > R) { stick.bx = e.clientX - dx / d * R; stick.by = e.clientY - dy / d * R; const r = rect(); stick.ox = clamp(stick.bx - r.left, 62, r.width - 62); stick.oy = clamp(stick.by - r.top, 62, r.height - 62); stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; }
      knob.style.transform = `translate(${input.jx * R}px,${input.jy * R}px)`;
    };
    const up = (e) => {
      if (e.pointerId !== stick.id) return;
      stick.id = -1; input.jx = input.jy = 0; input.touchOn = false;
      stk.classList.remove("on"); knob.style.transform = "translate(0,0)";
      showDefaultStick();
    };
    pad.addEventListener("pointerdown", down);
    pad.addEventListener("pointermove", move);
    pad.addEventListener("pointerup", up);
    pad.addEventListener("pointercancel", up);
    pad.addEventListener("lostpointercapture", up);
  }
  function showDefaultStick() {
    const stk = root && root.querySelector(".ahd-stk");
    if (!stk) return;
    if (SET.ctrl === "stick" && uiState === "play") { stk.style.display = "block"; stk.style.left = "78px"; stk.style.top = (stage.clientHeight - 92) + "px"; }
    else stk.style.display = "none";
  }

  function bindBtn(el, onDown, onUp) {
    let id = -1;
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); id = e.pointerId; try { el.setPointerCapture(id); } catch (er) { /* ignora */ } el.classList.add("dn"); onDown && onDown(); });
    const end = (e) => { if (e.pointerId !== id) return; id = -1; el.classList.remove("dn"); onUp && onUp(); };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end); el.addEventListener("lostpointercapture", end);
  }

  // ---------------------------------------------------------------- schermate
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  function showUi(html) { ui.innerHTML = `<div class="ahd-card">${html}</div>`; ui.classList.add("on"); ui.scrollTop = 0; }
  function hideUi() { ui.classList.remove("on"); ui.innerHTML = ""; }
  const stars = (n) => "★".repeat(n) + "☆".repeat(3 - n);

  function showMenu() {
    uiState = "menu"; paused = false;
    const done = PROG.stars.filter((s) => s > 0).length;
    let h = `<h2>Coppa del Molo</h2><p class="ahd-sub">Calcio a 5 a campo aperto, visto dall'alto. Aftertouch, Intesa Leo-Nico e il Tiro della Rondine. Cinque squadre del Borgo, una sola coppa (di latta).</p>`;
    h += `<h3>Il torneo · ${done}/${OPPS.length}</h3>`;
    OPPS.forEach((o, i) => {
      const open = i === 0 || PROG.stars[i - 1] > 0;
      h += `<button class="ahd-opp" data-mi="${i}" ${open ? "" : "disabled"}><div class="ahd-crest" style="border-color:${o.kit2};background:${o.kit};color:${o.kit2}">${o.tag}</div><div><b>${o.name}</b><span>${open ? (PROG.stars[i] ? "Vinta" : "Da affrontare") : "Batti la squadra precedente"}</span></div><em>${open ? stars(PROG.stars[i]) : "🔒"}</em></button>`;
    });
    h += `<h3>Controlli</h3><div class="ahd-seg" data-k="ctrl"><button data-v="stick" class="${SET.ctrl === "stick" ? "on" : ""}">Joystick</button><button data-v="touch" class="${SET.ctrl === "touch" ? "on" : ""}">Tocca e corri</button></div>`;
    h += `<h3>Difficoltà</h3><div class="ahd-seg" data-k="diff">${DIFFS.map((d, i) => `<button data-v="${i}" class="${SET.diff === i ? "on" : ""}">${d.n}</button>`).join("")}</div>`;
    h += `<h3>Audio</h3><div class="ahd-seg" data-k="sound"><button data-v="1" class="${SET.sound ? "on" : ""}">Suoni attivi</button><button data-v="0" class="${SET.sound ? "" : "on"}">Muto</button></div>`;
    h += `<button class="ahd-btn sec" data-a="tut">Come si gioca</button>`;
    h += `<p class="ahd-sub" style="text-align:center">Partite: ${PROG.played} · Vittorie: ${PROG.wins} · Gol segnati: ${PROG.goals}</p>`;
    h += `<button class="ahd-btn sec" data-a="exit">Esci</button>`;
    showUi(h);
    ui.querySelectorAll(".ahd-opp").forEach((b) => (b.onclick = () => showIntro(+b.dataset.mi)));
    ui.querySelectorAll(".ahd-seg").forEach((sg) => sg.querySelectorAll("button").forEach((b) => (b.onclick = () => {
      const k = sg.dataset.k; SET[k] = k === "ctrl" ? b.dataset.v : +b.dataset.v; saveSet();
      sg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); snd("playSelect");
    })));
    ui.querySelector('[data-a="tut"]').onclick = () => showTutorial(0, showMenu);
    ui.querySelector('[data-a="exit"]').onclick = closeAll;
    if (!PROG.tut) { PROG.tut = 1; saveProg(); showTutorial(0, showMenu); }
  }

  function showIntro(mi) {
    const o = OPPS[mi];
    uiState = "intro";
    showUi(`<h2>${o.name}</h2><p class="ahd-sub">Sfida ${mi + 1} di ${OPPS.length} · ${DIFFS[SET.diff].n} · Premio prima vittoria: ${STAR_COINS[mi]} monete${PROG.coin[mi] ? " (già incassato)" : ""}</p>
      <div class="ahd-quote">${esc(o.hint)}</div>
      <div class="ahd-stat"><span>Obiettivo</span><span>Vinci in ${MATCH_SECS} secondi</span></div>
      <div class="ahd-stat"><span>★ ★★ ★★★</span><span>Vittoria · 2 gol di scarto · porta inviolata</span></div>
      <button class="ahd-btn" data-a="go">Calcio d'inizio</button>
      <button class="ahd-btn sec" data-a="back">Indietro</button>`);
    ui.querySelector('[data-a="go"]').onclick = () => startMatch(mi);
    ui.querySelector('[data-a="back"]').onclick = showMenu;
  }

  function showTutorial(step, back) {
    uiState = "tut";
    const T = [
      ["Muoviti", "Tieni premuto sul lato sinistro dello schermo: compare il joystick. In alternativa, scegli «Tocca e corri» nelle impostazioni e trascina dove vuoi andare. Controlli sempre il giocatore col cerchio giallo."],
      ["Passa e contrasta", "PASSA manda la palla al compagno nella direzione dello stick (lo vedi cerchiato in azzurro). Senza palla, PASSA è la scivolata: tempismo, non disperazione. SCATTO consuma fiato."],
      ["Tira e curva", "Tieni premuto TIRO per caricare e rilascia. Stick in su o in giù: scegli l'angolo della porta. Dopo il tiro muovi lo stick di lato mentre la palla vola: curva! È l'aftertouch."],
      ["Intesa e Rondine", "Passaggio Leo-Nico (o Nico-Leo) e tiro entro 3 secondi: Intesa, tiro potenziato e preciso. Passaggi, contrasti e parate riempiono la barra GRINTA: quando è piena premi il tasto dorato per il Tiro della Rondine."],
    ];
    const t = T[step];
    showUi(`<h2>${t[0]}</h2><div class="ahd-dots">${T.map((_, i) => (i === step ? "<b>●</b>" : "●")).join(" ")}</div><p>${t[1]}</p>
      <button class="ahd-btn" data-a="next">${step < T.length - 1 ? "Avanti" : "Ho capito"}</button>
      ${step > 0 ? '<button class="ahd-btn sec" data-a="prev">Indietro</button>' : ""}`);
    ui.querySelector('[data-a="next"]').onclick = () => (step < T.length - 1 ? showTutorial(step + 1, back) : back());
    const pv = ui.querySelector('[data-a="prev"]'); if (pv) pv.onclick = () => showTutorial(step - 1, back);
  }

  function startMatch(mi) {
    hideUi(); uiState = "play"; paused = false;
    newMatch(mi, SET.diff);
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false; input.chargeF = 0; input.passEdge = false; input.shootRel = false; input.rond = false; input.sprint = false; input.touchOn = false;
    stage.querySelector(".ahd-pad").classList.toggle("all", SET.ctrl === "touch");
    showDefaultStick();
    acc = 0; lastTs = 0;
    PROG.played++; saveProg();
    hud();
  }

  function showResult() {
    uiState = "result";
    const [a, c] = M.score;
    const win = a > c, draw = a === c;
    let st = 0, coins = 0;
    if (win) {
      st = 1 + (a - c >= 2 ? 1 : 0) + (c === 0 ? 1 : 0);
      PROG.wins++;
      if (M.mi >= 0) {
        PROG.stars[M.mi] = Math.max(PROG.stars[M.mi], st);
        if (!PROG.coin[M.mi]) { PROG.coin[M.mi] = 1; coins = STAR_COINS[M.mi]; if (typeof window.addCoins === "function") { try { window.addCoins(coins); } catch (e) { /* ignora */ } } }
      }
    }
    saveProg();
    const o = M.opp;
    const lose = ["Si perde, ogni tanto. Zia Pina intanto ha messo su il fritto: perdere con un cartoccio in mano fa meno male.", "Una sconfitta in meno di cento secondi. Per un Borgo che ha perso il traghetto cento volte, è quasi puntualità."];
    const tie = "Pareggio anche ai supplementari. Nessuno ha vinto, nessuno ha perso, e il fritto è ancora caldo. Riprova: stavolta la palla non ha scuse.";
    const quote = win ? o.win : draw ? tie : lose[Math.floor(Math.random() * lose.length)];
    const next = M.mi >= 0 && win && M.mi < OPPS.length - 1;
    showUi(`<h2>${win ? "Vittoria!" : draw ? "Pareggio" : "Sconfitta"}</h2><div class="ahd-score"><span style="color:#7dd3fc">${a}</span> - <span style="color:#fca5a5">${c}</span></div>
      <p class="ahd-sub" style="text-align:center">Rondine vs ${o.name}</p>
      ${win ? `<div class="ahd-stars">${stars(st)}</div>` : ""}
      ${coins ? `<p style="text-align:center;color:#fde047;font-weight:800">+${coins} monete (prima vittoria)</p>` : ""}
      <div class="ahd-quote">${esc(quote)}</div>
      <div class="ahd-stat"><span>Tiri</span><span>${M.shots[0]} - ${M.shots[1]}</span></div>
      <div class="ahd-stat"><span>Parate</span><span>${M.saves[0]} - ${M.saves[1]}</span></div>
      <div class="ahd-stat"><span>Intese Leo-Nico</span><span>${M.intesa}</span></div>
      ${next ? '<button class="ahd-btn" data-a="next">Prossima sfida</button>' : ""}
      <button class="ahd-btn ${next ? "sec" : ""}" data-a="again">Rigioca</button>
      <button class="ahd-btn sec" data-a="menu">Menu del torneo</button>`);
    const nx = ui.querySelector('[data-a="next"]'); if (nx) nx.onclick = () => showIntro(M.mi + 1);
    ui.querySelector('[data-a="again"]').onclick = () => startMatch(M.mi);
    ui.querySelector('[data-a="menu"]').onclick = showMenu;
  }

  function pauseGame() {
    if (uiState !== "play") return;
    uiState = "pause"; paused = true;
    input.charging = false; input.jx = input.jy = 0;
    showUi(`<h2>In pausa</h2><p class="ahd-sub">${M.opp.name} · ${M.score[0]} - ${M.score[1]}</p>
      <button class="ahd-btn" data-a="res">Riprendi</button>
      <h3>Controlli</h3><div class="ahd-seg" data-k="ctrl"><button data-v="stick" class="${SET.ctrl === "stick" ? "on" : ""}">Joystick</button><button data-v="touch" class="${SET.ctrl === "touch" ? "on" : ""}">Tocca e corri</button></div>
      <button class="ahd-btn sec" data-a="tut">Come si gioca</button>
      <button class="ahd-btn sec" data-a="rst">Ricomincia la partita</button>
      <button class="ahd-btn red" data-a="menu">Abbandona (menu)</button>`);
    ui.querySelector('[data-a="res"]').onclick = resumeGame;
    ui.querySelectorAll(".ahd-seg button").forEach((b) => (b.onclick = () => { SET.ctrl = b.dataset.v; saveSet(); ui.querySelectorAll(".ahd-seg button").forEach((x) => x.classList.toggle("on", x === b)); stage.querySelector(".ahd-pad").classList.toggle("all", SET.ctrl === "touch"); }));
    ui.querySelector('[data-a="tut"]').onclick = () => showTutorial(0, pauseGame);
    ui.querySelector('[data-a="rst"]').onclick = () => startMatch(M.mi);
    ui.querySelector('[data-a="menu"]').onclick = showMenu;
  }
  function resumeGame() { hideUi(); uiState = "play"; paused = false; lastTs = 0; acc = 0; showDefaultStick(); }

  // ---------------------------------------------------------------- apertura / chiusura
  function closeAll(silent) {
    if (closed && !root) return;
    closed = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout); timers = [];
    cleanup.forEach((fn) => { try { fn(); } catch (e) { /* ignora */ } }); cleanup = [];
    if (root) { root.remove(); root = null; }
    cv = cx = ui = stage = null; M = null;
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false;
    const cb = onExitCb; onExitCb = null;
    if (silent !== true && typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  window.openActionSoccerHD = function (onExit) {
    if (root) closeAll(true);
    injectCss();
    onExitCb = onExit;
    PROG = loadProg(); SET = loadSet();
    closed = false; paused = false; lastTs = 0; acc = 0; M = null; uiState = "menu";
    root = document.createElement("div");
    root.className = "ahd-root"; root.id = "actionSoccerModal"; root.tabIndex = 0;
    root.innerHTML = `
      <div class="ahd-top">
        <button class="ahd-ib" data-a="pause" aria-label="Pausa">⏸</button>
        <div class="ahd-sc"><b>RON 0 - 0 ---</b><small>Coppa del Molo</small>
          <div class="ahd-bars"><div class="ahd-bar g" title="Grinta"><i></i></div><div class="ahd-bar s" title="Fiato"><i></i></div></div></div>
        <button class="ahd-ib" data-a="close" aria-label="Chiudi">✕</button>
      </div>
      <div class="ahd-stage">
        <canvas></canvas>
        <div class="ahd-pad"></div><div class="ahd-stk"><i></i></div>
        <div class="ahd-msg"></div><div class="ahd-banner"></div><div class="ahd-rep">▶ REPLAY · tocca per saltare</div>
        <div class="ahd-chg"><i></i></div>
        <div class="ahd-btns">
          <button class="ahd-b shoot" aria-label="Tiro">TIRO<small>tieni e rilascia</small></button>
          <button class="ahd-b pass" aria-label="Passa">PASSA<small>scivolata</small></button>
          <button class="ahd-b spr" aria-label="Scatto">SCATTO</button>
          <button class="ahd-b ron" aria-label="Tiro della Rondine">⚡<small>RONDINE</small></button>
        </div>
        <div class="ahd-ui"></div>
      </div>`;
    document.body.appendChild(root);
    stage = root.querySelector(".ahd-stage"); cv = root.querySelector("canvas"); cx = cv.getContext("2d"); ui = root.querySelector(".ahd-ui");

    root.querySelector('[data-a="close"]').onclick = () => { if (uiState === "play") pauseGame(); else closeAll(); };
    root.querySelector('[data-a="pause"]').onclick = () => { if (uiState === "play") pauseGame(); else if (uiState === "pause") resumeGame(); };
    bindPad();
    bindBtn(root.querySelector(".ahd-b.shoot"), () => { if (uiState === "play") { input.charging = true; input.chargeF = 0; } }, () => { if (input.charging) { input.charging = false; input.shootRel = true; } });
    bindBtn(root.querySelector(".ahd-b.pass"), () => { if (uiState === "play") input.passEdge = true; });
    bindBtn(root.querySelector(".ahd-b.spr"), () => { input.sprint = true; }, () => { input.sprint = false; });
    bindBtn(root.querySelector(".ahd-b.ron"), () => { if (uiState === "play") input.rond = true; });
    // tocco per saltare il replay
    stage.addEventListener("pointerdown", () => { if (M && M.rep) input.skip = true; }, true);

    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
    window.addEventListener("keydown", kd, { passive: false }); window.addEventListener("keyup", ku, { passive: false });
    const vis = () => { if (document.hidden && uiState === "play") pauseGame(); };
    document.addEventListener("visibilitychange", vis);
    cleanup.push(() => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); document.removeEventListener("visibilitychange", vis); });
    if (DEBUG) { window.__ahd = { M: () => M, input, SET, PROG: () => PROG, start: (mi, d) => { if (d !== undefined) SET.diff = d; startMatch(mi); }, ts: (n) => { window.__ahdTS = n; } }; }

    raf = requestAnimationFrame(loop);
    root.focus();
    showMenu();
  };
})();
