// js/gabbia3d.js - «Gabbia 3D · 3 contro 3»: calcio arcade 3D in Three.js con le carte della Squadra dei Sogni.
// 1 Portiere + 2 giocatori di movimento, sponde luminose rimbalzanti (uno-due di sponda carica la Super),
// 4 arene tridimensionali, 2 telecamere, Partita Veloce (90s + Golden Goal) e Coppa della Gabbia 3D.
(function () {
  "use strict";
  if (window.__gabbia3d) return;

  const KEY = "ali-di-rondine.gabbia3d";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hypot = Math.hypot || ((x, y) => Math.sqrt(x * x + y * y));

  const ARENAS = {
    darsena: {
      id: "darsena",
      name: "Darsena di Borgo Marino",
      icon: "⚓",
      sub: "Tramonto sul molo · sponde al sodio dorato",
      sky: 0x162642,
      fog: 0x1a2c4c,
      fogD: 0.017,
      apron: 0x0e1b31,
      floorA: "#1c5f3a",
      floorB: "#174f30",
      line: "#f8fafc",
      rail: 0xffb703,
      wall: 0x38bdf8,
      sun: 0xffd6a5,
      hemiSky: 0x7dd3fc,
      hemiGnd: 0x1e293b,
      bounce: 0.88,
    },
    periferia: {
      id: "periferia",
      name: "Gabbia d'Asfalto",
      icon: "🚧",
      sub: "Notte di quartiere · rete elettroluminescente",
      sky: 0x111522,
      fog: 0x141828,
      fogD: 0.019,
      apron: 0x181b26,
      floorA: "#2b303c",
      floorB: "#232733",
      line: "#fbbf24",
      rail: 0xf97316,
      wall: 0xfacc15,
      sun: 0xfffbeb,
      hemiSky: 0x94a3b8,
      hemiGnd: 0x0f172a,
      bounce: 0.94,
    },
    cupola: {
      id: "cupola",
      name: "Cupola Neo-2099",
      icon: "⚡",
      sub: "Manto cyber esagonale · barriere al plasma",
      sky: 0x090d1f,
      fog: 0x0b1026,
      fogD: 0.018,
      apron: 0x070b18,
      floorA: "#111c38",
      floorB: "#0d152c",
      line: "#22d3ee",
      rail: 0x06b6d4,
      wall: 0xc084fc,
      sun: 0xe0f2fe,
      hemiSky: 0x38bdf8,
      hemiGnd: 0x1e1b4b,
      bounce: 0.96,
    },
    colosseo: {
      id: "colosseo",
      name: "Colosseo Dorato",
      icon: "🏛️",
      sub: "Pietra antica e bracieri · sponde runiche",
      sky: 0x261710,
      fog: 0x2b1a12,
      fogD: 0.017,
      apron: 0x1c110c,
      floorA: "#6b4f35",
      floorB: "#5c422b",
      line: "#fef3c7",
      rail: 0xfbbf24,
      wall: 0xf87171,
      sun: 0xffedd5,
      hemiSky: 0xfde68a,
      hemiGnd: 0x29170e,
      bounce: 0.9,
    },
  };

  const OPP_TIERS = [
    { tier: 1, name: "Ragazzi della Darsena", icon: "⚓", ovr: 58, prize: 15, shirt: 0x0284c7, trim: 0xe0f2fe, arena: "darsena", pl: ["Sandro", "Tito", "Rocco"] },
    { tier: 2, name: "Rapaci d'Asfalto", icon: "🚧", ovr: 68, prize: 25, shirt: 0xea580c, trim: 0xfef08a, arena: "periferia", pl: ["Vasco", "Jago", "Bruno"] },
    { tier: 3, name: "Guardiani Neo-2099", icon: "⚡", ovr: 77, prize: 35, shirt: 0x9333ea, trim: 0x22d3ee, arena: "cupola", pl: ["Kira-X", "Vektor", "Zero"] },
  ];

  const CUP_ROUNDS = [
    { round: 0, label: "Quarti di Finale", name: "Corsari del Molo", icon: "⚓", ovr: 60, prize: 20, shirt: 0x0ea5e9, trim: 0xfef08a, arena: "darsena", pl: ["Nereo", "Giasone", "Molo"] },
    { round: 1, label: "Semifinale", name: "Ombre di Periferia", icon: "🚧", ovr: 70, prize: 30, shirt: 0xe11d48, trim: 0xfecdd3, arena: "periferia", pl: ["Corvo", "Sbarra", "Ruggine"] },
    { round: 2, label: "Finalissima", name: "Campioni del Colosseo", icon: "👑", ovr: 80, prize: 60, shirt: 0xd97706, trim: 0xfef3c7, arena: "colosseo", pl: ["Aurelio", "Valerio", "Massimo"] },
  ];

  // Rilevamento Software WebGL (SwiftShader / llvmpipe) una tantum, liberando subito il contesto sonda
  const IS_SW_GL = (() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return true;
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param) || "");
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch (e) {
      return true;
    }
  })();

  function load() {
    const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {};
    return {
      arena: ARENAS[r.arena] ? r.arena : "darsena",
      cam: r.cam === "terza" ? "terza" : "tribuna",
      fmt: r.fmt === 7 ? 7 : 3,
      q: r.q === "low" ? "low" : "hi",
      played: r.played | 0,
      wins: r.wins | 0,
      goals: r.goals | 0,
      cups: r.cups | 0,
      cupRun: r.cupRun && typeof r.cupRun.round === "number" ? { round: clamp(r.cupRun.round | 0, 0, 2) } : null,
    };
  }
  function save(r) {
    safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0);
  }

  const S = () => window.__sogni;
  const SUP = () => window.__supers;
  const CAST = () => (window.__borgoApi && window.__borgoApi.CAST) || {};

  function sfx(kind) {
    safe(() => {
      if (window.sfx) {
        if (kind === "kick" || kind === "pass") window.sfx("kick");
        else if (kind === "goal") window.sfx("goal");
        else if (kind === "super") window.sfx("special");
        else if (kind === "wall") window.sfx("ding");
      }
    }, 0);
  }

  // Dimensioni campo Gabbia 3D (metri virtuali)
  let PW = 22, PD = 14, HX = PW / 2, HZ = PD / 2;
  let GW = 4.6;
  const GH = 2.55, GD = 1.85;
  let FK = 1; // fattore di scala campo (1 = 3v3, 1.5 = 7v7)
  function setField(n) {
    FK = n === 7 ? 1.5 : 1;
    PW = 22 * FK; PD = 14 * FK; HX = PW / 2; HZ = PD / 2;
    GW = n === 7 ? 5.8 : 4.6;
  }

  let OV = null, BACK = null, G = null, FAST = false;
  let keyCleanup = null, resizeCleanup = null;

  function css() {
    if (document.getElementById("g3dCss")) return;
    const st = document.createElement("style");
    st.id = "g3dCss";
    st.textContent = `.g3dOv{position:fixed;inset:0;z-index:330;background:#0d1324;color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;overflow-y:auto;overflow-x:hidden}
.g3dOv *{box-sizing:border-box}
.g3dOv .wrap{max-width:580px;margin:0 auto;padding:10px 10px 26px;width:100%}
.g3dOv .bar{display:flex;justify-content:space-between;align-items:center;gap:8px;position:sticky;top:0;background:#0d1324;padding:6px 0;z-index:8;border-bottom:1px solid #1e293b}
.g3dOv .bar h2{margin:0;font:900 clamp(16px,4.5vw,20px)/1.15 system-ui,sans-serif;color:#ffd23f;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.g3dOv .barActs{display:flex;align-items:center;gap:6px;flex-shrink:0}
.g3dOv .camBtn{min-height:40px;padding:0 10px;border-radius:8px;border:1px solid #38bdf8;background:#13233d;color:#bae6fd;font:800 12px system-ui;cursor:pointer;touch-action:manipulation}
.g3dOv .x{width:40px;height:40px;border-radius:8px;border:1px solid #475569;background:#1e293b;color:#f8fafc;font-size:16px;cursor:pointer;flex-shrink:0;touch-action:manipulation}
.g3dOv .sum{font-size:13px;line-height:1.45;color:#cbd5e1;margin:8px 0}
.g3dOv .sec{margin:12px 0 6px;font:800 12.5px system-ui;color:#7dd3fc;text-transform:uppercase;letter-spacing:.4px;display:flex;justify-content:space-between;align-items:center;gap:6px}
.g3dTrio{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:6px 0}
.g3dUnit{background:#151f36;border:1.5px solid #334155;border-radius:10px;padding:7px 6px;text-align:center;min-width:0}
.g3dUnit.gk{border-color:#22c55e}
.g3dUnit .av{width:48px;height:48px;margin:0 auto 4px;border-radius:50%;overflow:hidden;background:#090d18;border:2px solid var(--uc,#38bdf8);display:flex;align-items:center;justify-content:center}
.g3dUnit .av img{width:100%;height:100%;object-fit:cover}
.g3dUnit .nm{font:800 11.5px/1.2 system-ui;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g3dUnit .rl{font:700 10px system-ui;color:#94a3b8;margin-top:2px}
.g3dUnit .st{font:700 10px system-ui;color:#ffd23f;margin-top:3px}
.g3dUnit .sp{font:600 9.5px system-ui;color:#7dd3fc;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g3dArenas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin:6px 0}
.g3dArCard{background:#151f36;border:1.5px solid #334155;border-radius:10px;padding:8px;text-align:left;color:#f1f5f9;cursor:pointer;min-height:58px;touch-action:manipulation;transition:border-color .15s}
.g3dArCard.active{border-color:#ffd23f;background:#1e2946;box-shadow:0 0 0 1px rgba(255,210,63,.35)}
.g3dArCard b{display:block;font:800 12.5px system-ui;color:#ffd23f}
.g3dArCard small{display:block;font-size:10.5px;color:#cbd5e1;margin-top:2px;line-height:1.25}
.g3dCamRow{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0}
.g3dCamOpt{min-height:44px;border-radius:9px;border:1px solid #334155;background:#151f36;color:#cbd5e1;font:700 12px system-ui;cursor:pointer;padding:6px 8px;touch-action:manipulation}
.g3dCamOpt.active{border-color:#38bdf8;background:#122b46;color:#fff;font-weight:800}
.g3dModes{display:grid;gap:7px;margin:8px 0}
.g3dModeBtn{width:100%;min-height:54px;border-radius:11px;border:1.5px solid #3b4f6b;background:#16223b;color:#f8fafc;padding:9px 11px;text-align:left;font:800 13.5px system-ui;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:8px;touch-action:manipulation}
.g3dModeBtn.cup{border-color:#ffd23f;background:linear-gradient(135deg,#2a1f10,#182238)}
.g3dModeBtn small{display:block;font:400 11px system-ui;color:#cbd5e1;margin-top:2px}
.g3dModeBtn .goTag{font:900 12px system-ui;color:#ffd23f;flex-shrink:0}
.g3dStatsStrip{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:11.5px;color:#94a3b8;padding:6px 2px;border-top:1px solid #1e293b;margin-top:8px}
.g3dStatsStrip b{color:#f8fafc}
.g3dHud{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;background:#131c31;border:1px solid #2d3f5e;border-radius:10px;padding:6px 9px;margin:6px 0}
.g3dScoreSide{font:800 12px system-ui;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.g3dScoreSide.opp{text-align:right;color:#fda4af}
.g3dScoreSide.me{color:#7dd3fc}
.g3dScoreMid{text-align:center;padding:0 6px}
.g3dScoreMid b{font:900 19px/1 system-ui;color:#ffd23f;letter-spacing:1px}
.g3dScoreMid span{display:block;font:800 10.5px system-ui;color:#cbd5e1;margin-top:2px}
.g3dScoreMid span.gg{color:#fbbf24}
.g3dSuperBarWrap{display:flex;align-items:center;gap:8px;margin:4px 0 6px;font-size:11px;color:#cbd5e1}
.g3dSuperTrack{flex:1;height:8px;background:#162036;border:1px solid #334155;border-radius:5px;overflow:hidden}
.g3dSuperFill{height:100%;width:0%;background:linear-gradient(90deg,#06b6d4,#ffd23f);transition:width .12s}
.g3dSuperFill.ready{background:linear-gradient(90deg,#f59e0b,#fde047)}
.g3dStage{position:relative;width:100%;aspect-ratio:16/10;max-height:50vh;background:#080d1a;border:2px solid #2d3f5e;border-radius:12px;overflow:hidden;touch-action:none}
.g3dStage canvas{display:block;width:100%!important;height:100%!important}
.g3dBanner{position:absolute;left:8px;right:8px;top:8px;background:rgba(13,19,36,0.92);border:1.5px solid #ffd23f;border-radius:9px;padding:6px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px;pointer-events:none;z-index:4;transition:opacity .2s,transform .2s}
.g3dBanner[hidden]{display:none!important}
.g3dBanner .bAv{width:34px;height:34px;border-radius:50%;overflow:hidden;border:1.5px solid #ffd23f;background:#090d18;flex-shrink:0}
.g3dBanner .bAv img{width:100%;height:100%;object-fit:cover}
.g3dBanner .bTxt{flex:1;min-width:0}
.g3dBanner .bTxt b{display:block;font:900 12.5px system-ui;color:#ffd23f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g3dBanner .bTxt span{display:block;font:700 10.5px system-ui;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g3dPad{display:grid;grid-template-columns:108px 1fr;gap:10px;align-items:center;margin-top:8px;padding:6px 4px;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}
.g3dStick{position:relative;width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#1b2b4b,#0f172a 74%);border:2px solid #38bdf8;touch-action:none;margin:0 auto;box-shadow:inset 0 0 14px rgba(0,0,0,.6)}
.g3dAct.shoot{position:relative;overflow:hidden}.g3dAct.shoot::after{content:"";position:absolute;left:0;bottom:0;height:6px;width:var(--chg,0%);background:linear-gradient(90deg,#fb7185,#ffd23f);pointer-events:none}
.g3dStick.on{border-color:#ffd23f;box-shadow:0 0 12px rgba(255,210,63,.35),inset 0 0 14px rgba(0,0,0,.6)}
.g3dStickKnob{position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#bae6fd,#0284c7 75%);border:2px solid #f0f9ff;box-shadow:0 2px 8px rgba(0,0,0,.55);pointer-events:none}
.g3dStick.on .g3dStickKnob{background:radial-gradient(circle at 35% 30%,#fef08a,#f59e0b 75%);border-color:#fff}
.g3dBtns{display:grid;grid-template-columns:1fr 1fr;gap:7px;touch-action:none;user-select:none;-webkit-user-select:none}
.g3dAct{min-height:50px;border-radius:11px;border:2px solid #475569;background:#192742;color:#f8fafc;font:800 12.5px/1.15 system-ui;padding:6px 7px;cursor:pointer;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;text-align:center;transition:transform .06s,filter .08s,box-shadow .12s}
.g3dAct *{pointer-events:none}
.g3dAct small{display:block;font:600 9.5px system-ui;color:#cbd5e1;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g3dAct.isDown,.g3dAct:active{transform:scale(.93);filter:brightness(1.25)}
.g3dAct.pass{border-color:#38bdf8;background:linear-gradient(160deg,#123252,#0f2138)}
.g3dAct.shoot{border-color:#fb7185;background:linear-gradient(160deg,#4c162e,#2d1222)}
.g3dAct.tackle{border-color:#34d399;background:linear-gradient(160deg,#0f392b,#102428)}
.g3dAct.tackle.defFocus{box-shadow:0 0 11px rgba(52,211,153,.42);border-color:#6ee7b7}
.g3dAct.super{border-color:#64748b;background:#1a2236;color:#cbd5e1}
.g3dAct.super.ready{border-color:#ffd23f;background:linear-gradient(135deg,#6d28d9,#b45309);color:#fff;box-shadow:0 0 14px rgba(255,210,63,.45)}
.g3dAct.super.ready small{color:#fef08a}
.g3dAct.super.deny{border-color:#f59e0b;filter:brightness(1.18)}
.g3dKeyHint{font-size:10.5px;color:#64748b;text-align:center;margin-top:6px}
@media (max-width:350px){
  .g3dPad{grid-template-columns:90px 1fr;gap:6px}
  .g3dStick{width:86px;height:86px}
  .g3dAct{min-height:46px;padding:5px 5px;font-size:11.5px}
  .g3dAct small{font-size:8.5px}
}
@media (orientation:landscape) and (max-height:480px){
  .g3dOv .wrap{max-width:720px;padding:4px 10px 10px}
  .g3dOv .bar{padding:3px 0}
  .g3dHud{padding:4px 8px;margin:3px 0}
  .g3dSuperBarWrap{margin:2px 0 4px}
  .g3dStage{max-height:42vh}
  .g3dPad{margin-top:5px;padding:2px 2px}
  .g3dKeyHint{display:none}
}`;
    document.head.appendChild(st);
  }

  function disposeScene() {
    if (keyCleanup) { keyCleanup(); keyCleanup = null; }
    if (resizeCleanup) { resizeCleanup(); resizeCleanup = null; }
    if (!G) return;
    G.dead = true;
    if (G.raf) { cancelAnimationFrame(G.raf); G.raf = 0; }
    if (G.swTimer) { clearTimeout(G.swTimer); G.swTimer = 0; }
    if (G.scene) {
      G.scene.traverse((obj) => {
        if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (!m) return;
            if (m.map && m.map.dispose) m.map.dispose();
            if (m.alphaMap && m.alphaMap.dispose) m.alphaMap.dispose();
            if (m.emissiveMap && m.emissiveMap.dispose) m.emissiveMap.dispose();
            if (m.dispose) m.dispose();
          });
        }
      });
    }
    if (G.textures) {
      G.textures.forEach((t) => { if (t && t.dispose) t.dispose(); });
    }
    if (G.envRT && G.envRT.dispose) {
      safe(() => G.envRT.dispose(), 0);
    }
    if (G.renderer) {
      safe(() => G.renderer.dispose(), 0);
    }
    G = null;
  }

  function close() {
    disposeScene();
    if (OV) { OV.remove(); OV = null; }
  }

  function shell(title, inMatch) {
    css();
    disposeScene();
    if (OV) OV.remove();
    OV = document.createElement("div");
    OV.className = "g3dOv";
    OV.innerHTML = `<div class="wrap">
      <div class="bar">
        <h2>${title}</h2>
        <div class="barActs">
          ${inMatch ? `<button type="button" class="camBtn" data-cam-toggle="1" title="Cambia inquadratura">🎥 Visuale</button>` : ""}
          <button type="button" class="x" aria-label="Chiudi">✕</button>
        </div>
      </div>
      <div class="body"></div>
    </div>`;
    OV.querySelector(".x").onclick = () => {
      if (inMatch) {
        open();
      } else {
        const b = BACK;
        close();
        if (typeof b === "function") b();
      }
    };
    document.body.appendChild(OV);
    return OV.querySelector(".body");
  }

  function getMySquad3(n) {
    n = n === 7 ? 7 : 3;
    const s = S();
    if (!s) {
      const fb = [
        { id: "nico", role: "P", at: 45, df: 80, te: 64, saga: "borgo" },
        { id: "leo", role: "A", at: 84, df: 56, te: 80, saga: "borgo" },
        { id: "tommy", role: "C", at: 68, df: 66, te: 82, saga: "borgo" },
      ];
      const extra = [];
      for (let i = 0; i < n - 3; i++) extra.push({ id: "fb" + i, role: i % 2 ? "D" : "C", at: 60, df: 62, te: 60, saga: "borgo" });
      return { keeper: fb[0], field: [fb[1], fb[2]].concat(extra), all: [fb[1], fb[2]].concat(extra, [fb[0]]), loan: true, intesa: 4, combo: null, n };
    }
    s.sync && s.sync();
    const r = s._load();
    const sq = s.squad(n, r.team);
    const allIds = sq.all.map((c) => c.id);
    const loan = r.own.length < 3 || sq.all.some((c) => !r.own.includes(c.id));
    const I = s.intesa ? s.intesa(r.team.length ? r.team : allIds, r.modulo).n : 0;
    const combo = s.combo ? s.combo(allIds) : null;
    return { keeper: sq.keeper, field: sq.field.slice(0, n - 1), all: sq.all, n, loan, intesa: I, combo, r };
  }

  function open(back) {
    if (typeof back === "function") BACK = back;
    const rec = load();
    const NP = rec.fmt === 7 ? 7 : 3;
    const body = shell(NP === 7 ? "🏟️ Calcio 3D · 7 contro 7" : "🏟️ Gabbia 3D · 3 contro 3", false);
    const sq = getMySquad3(NP);
    const s = S();

    const unitCard = (c, isGk) => {
      const e = s && s.eff ? s.eff(c) : c;
      const im = s && s.port ? s.port(c.id) : null;
      const nm = s && s.name ? s.name(c.id) : c.id;
      const sup = SUP() ? SUP().of(c.id) : { name: "Super Tiro", col: "#38bdf8" };
      const col = isGk ? "#22c55e" : c.role === "A" ? "#ef4444" : c.role === "D" ? "#3b82f6" : "#f59e0b";
      return `<div class="g3dUnit${isGk ? " gk" : ""}" style="--uc:${col}">
        <div class="av">${im ? `<img alt="" src="${im}">` : "⚽"}</div>
        <div class="nm">${esc(nm)}</div>
        <div class="rl">${isGk ? "🧤 Portiere" : `⚽ ${c.role === "A" ? "Attacco" : c.role === "D" ? "Difesa" : c.role === "B" ? "Jolly" : "Regia"}`}</div>
        <div class="st">A ${e.at} · D ${e.df} · T ${e.te}</div>
        <div class="sp" style="color:${sup.col || "#7dd3fc"}">⚡ ${esc(sup.name)}</div>
      </div>`;
    };

    let h = `<p class="sum">${NP === 7 ? "Calcio <b>7 contro 7</b> su campo grande con sponde: ruoli in campo secondo la tua formazione, portiere e 6 di movimento. Tieni premuto <b>Tira</b> per caricare il colpo." : ""}Calcio veloce <b>${NP === 7 ? "(stesso motore)" : "3 contro 3"}</b> in Three.js dentro la gabbia luminosa: nessun fallo laterale, le <b>sponde</b> tengono viva l'azione e un <b>uno-due di sponda</b> carica del +24% il Super-Tiro della tua saga.${sq.loan ? ` <span>(Carte in prestito attive finché non ne sblocchi 3)</span>` : ""}</p>`;

    if (s && s.presetsBarHtml) {
      h += `<div class="g3dPresetsHost">${s.presetsBarHtml(sq.r, { compact: true })}</div>`;
    }

    h += `<div class="sec"><span>Formato</span><span>Qualità grafica</span></div>
    <div class="g3dCamRow">
      <button type="button" class="g3dCamOpt${NP === 3 ? " active" : ""}" data-fmt="3">⚡ 3 vs 3 Gabbia</button>
      <button type="button" class="g3dCamOpt${NP === 7 ? " active" : ""}" data-fmt="7">⚽ 7 vs 7 Campo grande</button>
    </div>
    <div class="g3dCamRow">
      <button type="button" class="g3dCamOpt${rec.q !== "low" ? " active" : ""}" data-q="hi">✨ Alta</button>
      <button type="button" class="g3dCamOpt${rec.q === "low" ? " active" : ""}" data-q="low">🔋 Leggera</button>
    </div>`;
    h += `<div class="sec"><span>${NP === 7 ? "La tua Squadra a 7" : "Il tuo Trio in Gabbia"} · Intesa +${sq.intesa}</span>${s ? `<button type="button" class="sgPresetActBtn" data-edit-team="1">🃏 Squadra</button>` : ""}</div>`;
    h += `<div class="g3dTrio">${unitCard(sq.keeper, true)}${sq.field.map((c) => unitCard(c, false)).join("")}</div>`;
    if (sq.combo) {
      h += `<p class="sum" style="margin:4px 0 8px;color:#fde047;font-size:12px">🤝 Legame attivo in gabbia: <b>«${esc(sq.combo.title)}»</b> (+potenza Super combinata)</p>`;
    }

    h += `<div class="sec"><span>Arena 3D</span><span>Rimbalzo sponde</span></div>`;
    h += `<div class="g3dArenas">${Object.values(ARENAS).map((ar) => `<button type="button" class="g3dArCard${rec.arena === ar.id ? " active" : ""}" data-ar="${ar.id}">
      <b>${ar.icon} ${esc(ar.name)}</b>
      <small>${esc(ar.sub)}</small>
    </button>`).join("")}</div>`;

    h += `<div class="sec"><span>Telecamera</span></div>`;
    h += `<div class="g3dCamRow">
      <button type="button" class="g3dCamOpt${rec.cam === "tribuna" ? " active" : ""}" data-cam="tribuna">🏟️ Tribuna Dinamica</button>
      <button type="button" class="g3dCamOpt${rec.cam === "terza" ? " active" : ""}" data-cam="terza">🏃 Terza Persona</button>
    </div>`;

    const cupRound = rec.cupRun ? CUP_ROUNDS[rec.cupRun.round] : CUP_ROUNDS[0];
    h += `<div class="sec"><span>Modalità · ${NP === 7 ? "2:30 o 5 Gol" : "90s o 3 Gol"} (Golden Goal)</span></div>`;
    h += `<div class="g3dModes">
      <button type="button" class="g3dModeBtn cup" data-mode="cup">
        <div>
          🏆 ${rec.cupRun ? `Continua Coppa · ${esc(cupRound.label)}` : "Coppa della Gabbia 3D"}
          <small>Quarti, Semifinale e Finale · prossimo: ${esc(cupRound.name)} · Coppe vinte: ${rec.cups}</small>
        </div>
        <span class="goTag">▶</span>
      </button>
      ${OPP_TIERS.map((o) => `<button type="button" class="g3dModeBtn" data-tier="${o.tier}">
        <div>
          ${o.icon} Partita Veloce ${"★".repeat(o.tier)} · ${esc(o.name)}
          <small>Forza rivale ${o.ovr} · Vittoria +${o.prize} monete + XP carte</small>
        </div>
        <span class="goTag">Gioca ▸</span>
      </button>`).join("")}
    </div>`;

    h += `<div class="g3dStatsStrip">
      <span>Partite: <b>${rec.played}</b></span>
      <span>Vittorie: <b>${rec.wins}</b></span>
      <span>Reti: <b>${rec.goals}</b></span>
      <span>Coppe 3D: <b>${rec.cups}</b></span>
    </div>`;

    body.innerHTML = h;

    const prHost = body.querySelector(".g3dPresetsHost");
    if (prHost && s && s.bindPresetsBar) {
      s.bindPresetsBar(prHost, () => open());
    }
    const edBtn = body.querySelector("[data-edit-team]");
    if (edBtn && s) {
      edBtn.onclick = () => { close(); s.open(() => open()); };
    }
    body.querySelectorAll("[data-ar]").forEach((b) => {
      b.onclick = () => {
        const r2 = load();
        r2.arena = b.dataset.ar;
        save(r2);
        open();
      };
    });
    body.querySelectorAll("[data-fmt]").forEach((b) => {
      b.onclick = () => { const r2 = load(); r2.fmt = b.dataset.fmt === "7" ? 7 : 3; save(r2); open(); };
    });
    body.querySelectorAll("[data-q]").forEach((b) => {
      b.onclick = () => { const r2 = load(); r2.q = b.dataset.q === "low" ? "low" : "hi"; save(r2); open(); };
    });
    body.querySelectorAll("[data-cam]").forEach((b) => {
      b.onclick = () => {
        const r2 = load();
        r2.cam = b.dataset.cam === "terza" ? "terza" : "tribuna";
        save(r2);
        open();
      };
    });
    body.querySelectorAll("[data-tier]").forEach((b) => {
      b.onclick = () => {
        const o = OPP_TIERS.find((x) => x.tier === +b.dataset.tier) || OPP_TIERS[0];
        startMatch({ mode: "quick", opp: o, arenaId: load().arena });
      };
    });
    const cupBtn = body.querySelector('[data-mode="cup"]');
    if (cupBtn) {
      cupBtn.onclick = () => {
        const r2 = load();
        if (!r2.cupRun) { r2.cupRun = { round: 0 }; save(r2); }
        const cr = CUP_ROUNDS[r2.cupRun.round] || CUP_ROUNDS[0];
        startMatch({ mode: "cup", round: r2.cupRun.round, opp: cr, arenaId: cr.arena });
      };
    }
  }

  function hexToCss(hex, alpha) {
    const n = typeof hex === "number" ? hex : parseInt(String(hex || "0").replace("#", ""), 16) || 0;
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return alpha === undefined ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
  }

  function addTubeBetween(THREE, parent, ax, ay, az, bx, by, bz, radTop, radBot, segs, mat) {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 0.001) return null;
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radTop, radBot, len, segs), mat);
    mesh.position.set((ax + bx) * 0.5, (ay + by) * 0.5, (az + bz) * 0.5);
    const up = new THREE.Vector3(0, 1, 0);
    const dir = new THREE.Vector3(dx / len, dy / len, dz / len);
    if (dir.y < -0.9999) mesh.rotation.x = Math.PI;
    else mesh.quaternion.setFromUnitVectors(up, dir);
    parent.add(mesh);
    return mesh;
  }

  function makeQuadGeo(THREE, p0, p1, p2, p3, uMax, vMax) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([
      p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2],
      p0[0], p0[1], p0[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2],
    ]);
    const uvs = new Float32Array([
      0, 0, uMax, 0, uMax, vMax,
      0, 0, uMax, vMax, 0, vMax,
    ]);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  }

  function buildStudioEnv(THREE, renderer, ar) {
    if (typeof THREE.PMREMGenerator !== "function") return null;
    return safe(() => {
      const pmrem = new THREE.PMREMGenerator(renderer);
      if (pmrem.compileEquirectangularShader) pmrem.compileEquirectangularShader();
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(ar.sky);

      const mkLightPanel = (w, h, col, x, y, z) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
        m.position.set(x, y, z);
        m.lookAt(0, 0, 0);
        envScene.add(m);
        return m;
      };
      const pTop = mkLightPanel(14, 14, 0xffffff, 0, 10, 0);
      const pKey = mkLightPanel(10, 6, ar.sun, 8, 5, 7);
      const pRimL = mkLightPanel(9, 5, ar.hemiSky, -9, 4, -6);
      const pRimR = mkLightPanel(9, 5, ar.rail, 9, 3, -7);
      const pGnd = mkLightPanel(18, 18, ar.apron, 0, -6, 0);

      const rt = pmrem.fromScene(envScene, 0.04);
      [pTop, pKey, pRimL, pRimR, pGnd].forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      pmrem.dispose();
      return rt;
    }, null);
  }

  // Texture procedurali ad alta nitidezza in SRGBColorSpace (zero file esterni)
  function makePitchTexture(THREE, ar, maxAniso) {
    const cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 640;
    const c = cv.getContext("2d");
    const W = cv.width, H = cv.height;

    const stripes = 10;
    for (let i = 0; i < stripes; i++) {
      c.fillStyle = i % 2 === 0 ? ar.floorA : ar.floorB;
      c.fillRect((i * W) / stripes, 0, W / stripes + 1, H);
    }

    // Dettaglio materico specifico per ognuna delle 4 Arene
    if (ar.id === "darsena") {
      // Manto marino con micro-trama erbosa e cornice in tavole di molo
      for (let i = 0; i < 900; i++) {
        c.fillStyle = i % 2 ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.045)";
        c.fillRect((i * 137) % W, (i * 89) % H, 3, 2);
      }
      c.fillStyle = "rgba(120,72,32,0.42)";
      c.fillRect(0, 0, W, 16);
      c.fillRect(0, H - 16, W, 16);
    } else if (ar.id === "periferia") {
      // Asfalto urbano granuloso con zebrature di bordo gabbia
      for (let i = 0; i < 1400; i++) {
        c.fillStyle = i % 3 === 0 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.09)";
        c.fillRect((i * 97) % W, (i * 61) % H, 3, 3);
      }
      c.fillStyle = "rgba(250,204,21,0.16)";
      for (let x = 24; x < W - 24; x += 48) {
        c.fillRect(x, 4, 22, 10);
        c.fillRect(x, H - 14, 22, 10);
      }
    } else if (ar.id === "cupola") {
      // Griglia esagonale / cyber circuito luminoso Neo-2099
      c.strokeStyle = "rgba(34,211,238,0.14)";
      c.lineWidth = 1.5;
      const stepX = 48, stepY = 42;
      for (let row = 0; row < H / stepY + 1; row++) {
        for (let col = 0; col < W / stepX + 1; col++) {
          const cx = col * stepX + (row % 2 ? stepX * 0.5 : 0);
          const cy = row * stepY;
          c.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = (k * Math.PI) / 3;
            const px = cx + Math.cos(a) * 18, py = cy + Math.sin(a) * 18;
            if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
          }
          c.closePath();
          c.stroke();
        }
      }
    } else if (ar.id === "colosseo") {
      // Lastre di travertino e sabbia dorata con greca perimetrale
      c.strokeStyle = "rgba(41,23,14,0.22)";
      c.lineWidth = 2;
      for (let x = 64; x < W; x += 64) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
      for (let y = 64; y < H; y += 64) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      for (let i = 0; i < 800; i++) {
        c.fillStyle = i % 2 ? "rgba(254,243,199,0.035)" : "rgba(0,0,0,0.05)";
        c.fillRect((i * 113) % W, (i * 71) % H, 3, 3);
      }
    }

    // Vignettatura morbida sui bordi per dare profondità sotto le sponde
    const vig = c.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.62);
    vig.addColorStop(0, "rgba(255,255,255,0.04)");
    vig.addColorStop(1, "rgba(0,0,0,0.26)");
    c.fillStyle = vig;
    c.fillRect(0, 0, W, H);

    // Aree di porta colorate semitrasparenti (sinistra blu Sogni, destra corallo rivali)
    c.save();
    c.fillStyle = "rgba(56,189,248,0.11)";
    c.beginPath(); c.arc(20, H / 2, 138, -Math.PI / 2, Math.PI / 2); c.closePath(); c.fill();
    c.fillStyle = "rgba(251,113,133,0.11)";
    c.beginPath(); c.arc(W - 20, H / 2, 138, Math.PI / 2, Math.PI * 1.5); c.closePath(); c.fill();
    c.restore();

    // Emblema centrale stilizzato della Gabbia / Rondine
    c.save();
    c.translate(W / 2, H / 2);
    c.fillStyle = "rgba(255,255,255,0.05)";
    c.beginPath(); c.arc(0, 0, 92, 0, Math.PI * 2); c.fill();
    c.strokeStyle = ar.line;
    c.globalAlpha = 0.28;
    c.lineWidth = 3;
    c.beginPath(); c.arc(0, 0, 66, 0, Math.PI * 2); c.stroke();
    // Sagoma ali stilizzate al centro
    c.beginPath();
    c.moveTo(-42, 10);
    c.quadraticCurveTo(-14, -24, 0, -4);
    c.quadraticCurveTo(14, -24, 42, 10);
    c.quadraticCurveTo(14, 2, 0, 18);
    c.quadraticCurveTo(-14, 2, -42, 10);
    c.closePath();
    c.fillStyle = ar.line;
    c.fill();
    c.restore();

    // Righe regolamentari nitide con leggero alone
    c.save();
    c.strokeStyle = ar.line;
    c.shadowColor = ar.line;
    c.shadowBlur = ar.id === "cupola" ? 10 : 4;
    c.lineWidth = 7;
    c.strokeRect(20, 20, W - 40, H - 40);

    // Linea mediana e cerchio di centrocampo
    c.beginPath(); c.moveTo(W / 2, 20); c.lineTo(W / 2, H - 20); c.stroke();
    c.beginPath(); c.arc(W / 2, H / 2, 92, 0, Math.PI * 2); c.stroke();
    c.fillStyle = ar.line;
    c.beginPath(); c.arc(W / 2, H / 2, 9, 0, Math.PI * 2); c.fill();

    // Aree di rigore a D + dischetti
    c.beginPath(); c.arc(20, H / 2, 138, -Math.PI / 2, Math.PI / 2); c.stroke();
    c.beginPath(); c.arc(W - 20, H / 2, 138, Math.PI / 2, Math.PI * 1.5); c.stroke();
    c.beginPath(); c.arc(195, H / 2, 6, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(W - 195, H / 2, 6, 0, Math.PI * 2); c.fill();

    // Lunette d'angolo
    [[20, 20, 0, Math.PI / 2], [W - 20, 20, Math.PI / 2, Math.PI], [W - 20, H - 20, Math.PI, Math.PI * 1.5], [20, H - 20, -Math.PI / 2, 0]].forEach(([cx, cy, a0, a1]) => {
      c.beginPath(); c.arc(cx, cy, 28, a0, a1); c.stroke();
    });
    c.restore();

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    if (maxAniso > 1) tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    return tex;
  }

  // Texture procedurale rete intrecciata a rombi con nodi per le Porte 3D
  function makeNetTexture(THREE, accentHex, maxAniso) {
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 256;
    const c = cv.getContext("2d");
    c.clearRect(0, 0, 256, 256);

    const cells = 4;
    const step = 256 / cells;
    const acc = hexToCss(accentHex, 0.85);

    // Ombra cordino per stacco netto su ogni sfondo
    c.strokeStyle = "rgba(8,13,26,0.75)";
    c.lineWidth = 8.2;
    for (let i = -cells; i <= cells * 2; i++) {
      c.beginPath(); c.moveTo(i * step, 0); c.lineTo(i * step + 256, 256); c.stroke();
      c.beginPath(); c.moveTo(i * step, 0); c.lineTo(i * step - 256, 256); c.stroke();
    }

    // Cordino intrecciato bianco ad alta visibilità
    c.strokeStyle = "rgba(255,255,255,0.98)";
    c.lineWidth = 4.5;
    for (let i = -cells; i <= cells * 2; i++) {
      c.beginPath(); c.moveTo(i * step, 0); c.lineTo(i * step + 256, 256); c.stroke();
      c.beginPath(); c.moveTo(i * step, 0); c.lineTo(i * step - 256, 256); c.stroke();
    }

    // Filo secondario color squadra + nodi d'incrocio
    c.strokeStyle = acc;
    c.lineWidth = 2.2;
    for (let i = -cells; i <= cells * 2; i += 2) {
      c.beginPath(); c.moveTo(i * step, 0); c.lineTo(i * step + 256, 256); c.stroke();
    }
    c.fillStyle = "#ffffff";
    for (let y = 0; y <= 256; y += step / 2) {
      const odd = Math.round(y / (step / 2)) % 2;
      for (let x = odd ? step / 2 : 0; x <= 256; x += step) {
        c.beginPath(); c.arc(x, y, 3.4, 0, Math.PI * 2); c.fill();
      }
    }

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (maxAniso > 1) tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    return tex;
  }

  // Texture barriera energetica / rete metallica per le sponde della Gabbia
  function makeCageGlassTexture(THREE, ar, maxAniso) {
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 128;
    const c = cv.getContext("2d");
    const g = c.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, hexToCss(ar.rail, 0.52));
    g.addColorStop(0.18, hexToCss(ar.wall, 0.16));
    g.addColorStop(0.82, hexToCss(ar.wall, 0.16));
    g.addColorStop(1, hexToCss(ar.rail, 0.55));
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 128);

    c.strokeStyle = hexToCss(ar.wall, 0.48);
    c.lineWidth = 2;
    const st = 32;
    for (let x = -128; x <= 384; x += st) {
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 128, 128); c.stroke();
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x - 128, 128); c.stroke();
    }
    c.fillStyle = hexToCss(ar.rail, 0.65);
    c.fillRect(0, 62, 256, 3);

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    if (maxAniso > 1) tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    return tex;
  }

  function makeWindowGridTexture(THREE, skyHex, litHex) {
    const cv = document.createElement("canvas");
    cv.width = 128;
    cv.height = 128;
    const c = cv.getContext("2d");
    c.fillStyle = hexToCss(skyHex);
    c.fillRect(0, 0, 128, 128);
    for (let r = 0; r < 6; r++) {
      for (let col = 0; col < 5; col++) {
        const on = ((r * 7 + col * 13) % 5) < 3;
        c.fillStyle = on ? hexToCss(litHex, 0.85) : "rgba(15,23,42,0.7)";
        c.fillRect(10 + col * 23, 10 + r * 19, 14, 11);
      }
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function makeBallTexture(THREE, maxAniso) {
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 256;
    const c = cv.getContext("2d");
    const baseG = c.createLinearGradient(0, 0, 0, 256);
    baseG.addColorStop(0, "#ffffff");
    baseG.addColorStop(0.5, "#f8fafc");
    baseG.addColorStop(1, "#e2e8f0");
    c.fillStyle = baseG;
    c.fillRect(0, 0, 512, 256);

    // Cuciture e fregi pro dorati/azzurri
    c.strokeStyle = "#38bdf8";
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(0, 128);
    c.bezierCurveTo(140, 68, 372, 188, 512, 128);
    c.stroke();
    c.strokeStyle = "#f59e0b";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(0, 128);
    c.bezierCurveTo(140, 188, 372, 68, 512, 128);
    c.stroke();

    const spots = [[64, 62], [192, 54], [320, 62], [448, 54], [128, 188], [256, 196], [384, 188]];
    spots.forEach(([x, y]) => {
      c.fillStyle = "#0f172a";
      c.strokeStyle = "#475569";
      c.lineWidth = 3;
      c.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = (k * Math.PI * 2) / 5 - Math.PI / 2;
        const px = x + Math.cos(a) * 31, py = y + Math.sin(a) * 29;
        if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
      c.stroke();
    });
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    if (maxAniso > 1) tex.anisotropy = maxAniso;
    tex.needsUpdate = true;
    return tex;
  }

  function makeShadowTexture(THREE) {
    const cv = document.createElement("canvas");
    cv.width = 64;
    cv.height = 64;
    const c = cv.getContext("2d");
    const g = c.createRadialGradient(32, 32, 4, 32, 32, 30);
    g.addColorStop(0, "rgba(0,0,0,0.66)");
    g.addColorStop(0.65, "rgba(0,0,0,0.26)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }

  // Porta 3D realistica da Futsal / Gabbia (pali smaltati con bande, giunti sferici, telaio D inclinato posteriore, rete a rombi su 4 teli e barra LED di gol)
  function buildGoal3D(THREE, scene, sign, netTex) {
    const gg = new THREE.Group();
    gg.position.set(sign * HX, 0, 0);

    const accentHex = sign < 0 ? 0x38bdf8 : 0xfb7185;
    const halfZ = GW / 2;
    const topD = 0.96;
    const botD = GD; // 1.85m
    const rPost = 0.132;

    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.16, metalness: 0.5 });
    const bandMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 0.45, roughness: 0.22, metalness: 0.35 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.78 });
    const stanchionMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.24, metalness: 0.82 });
    const ledMat = new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 0.85, roughness: 0.18 });
    const padMat = new THREE.MeshBasicMaterial({ color: accentHex, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false });
    const netMat = new THREE.MeshBasicMaterial({
      map: netTex,
      transparent: true,
      opacity: 0.96,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // 1. Tappetino interno di porta + linea di porta luminosa
    const mouthPad = new THREE.Mesh(new THREE.PlaneGeometry(botD, GW - 0.08), padMat);
    mouthPad.rotation.x = -Math.PI / 2;
    mouthPad.position.set(sign * (botD * 0.5), 0.012, 0);
    gg.add(mouthPad);

    const goalLine = new THREE.Mesh(new THREE.PlaneGeometry(0.16, GW - 0.1), lineMat);
    goalLine.rotation.x = -Math.PI / 2;
    goalLine.position.set(0, 0.019, 0);
    gg.add(goalLine);

    // 2. Pali anteriori + anelli grip color squadra + basi ancorate a terra + giunti superiori
    [-halfZ, halfZ].forEach((pz) => {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.24, 0.16, 14), darkMetalMat);
      base.position.set(0, 0.08, pz);
      gg.add(base);

      const post = new THREE.Mesh(new THREE.CylinderGeometry(rPost, rPost, GH, 16), postMat);
      post.position.set(0, GH * 0.5, pz);
      if (!IS_SW_GL) post.castShadow = true;
      gg.add(post);

      [0.78, 1.74].forEach((by) => {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(rPost + 0.01, rPost + 0.01, 0.24, 16), bandMat);
        band.position.set(0, by, pz);
        gg.add(band);
      });

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(rPost * 1.24, 14, 12), bandMat);
      elbow.position.set(0, GH, pz);
      gg.add(elbow);
    });

    // 3. Traversa + fasce decorative + barra LED + visiera luminosa superiore di porta
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(rPost, rPost, GW, 16), postMat);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(0, GH, 0);
    if (!IS_SW_GL) bar.castShadow = true;
    gg.add(bar);

    [-1.18, 1.18].forEach((bz) => {
      const cBand = new THREE.Mesh(new THREE.CylinderGeometry(rPost + 0.01, rPost + 0.01, 0.26, 16), bandMat);
      cBand.rotation.x = Math.PI / 2;
      cBand.position.set(0, GH, bz);
      gg.add(cBand);
    });

    const ledBar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.075, GW - 0.34), ledMat);
    ledBar.position.set(-sign * 0.08, GH - 0.06, 0);
    gg.add(ledBar);

    const topSign = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 1.9), darkMetalMat);
    topSign.position.set(sign * 0.04, GH + 0.22, 0);
    const topSignFace = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 1.68), ledMat);
    topSignFace.position.set(sign * 0.04, GH + 0.22, 0);
    gg.add(topSign, topSignFace);

    // 4. Telaio posteriore a D inclinato (montanti alti, correnti a terra, puntoni obliqui e traverse di fondo)
    const topY = GH - 0.03, botY = 0.065;
    [-halfZ, halfZ].forEach((pz) => {
      addTubeBetween(THREE, gg, 0, topY, pz, sign * topD, topY, pz, 0.052, 0.052, 10, stanchionMat);
      addTubeBetween(THREE, gg, 0, botY, pz, sign * botD, botY, pz, 0.058, 0.058, 10, darkMetalMat);
      addTubeBetween(THREE, gg, sign * topD, topY, pz, sign * botD, botY, pz, 0.052, 0.052, 10, stanchionMat);

      const jTop = new THREE.Mesh(new THREE.SphereGeometry(0.072, 10, 8), darkMetalMat);
      jTop.position.set(sign * topD, topY, pz);
      const jBot = new THREE.Mesh(new THREE.SphereGeometry(0.078, 10, 8), darkMetalMat);
      jBot.position.set(sign * botD, botY, pz);
      gg.add(jTop, jBot);
    });
    addTubeBetween(THREE, gg, sign * topD, topY, -halfZ, sign * topD, topY, halfZ, 0.05, 0.05, 10, stanchionMat);
    addTubeBetween(THREE, gg, sign * botD, botY, -halfZ, sign * botD, botY, halfZ, 0.06, 0.06, 10, darkMetalMat);

    // 5. Gruppo Rete 3D a 4 teli sagomati (retro inclinato + tetto + 2 fianchi trapezoidali) che si gonfia al Gol!
    const netRig = new THREE.Group();
    const dens = 1.45;
    const slopeLen = Math.hypot(botD - topD, topY - botY);

    // Telo posteriore inclinato
    const backNet = new THREE.Mesh(
      makeQuadGeo(
        THREE,
        [sign * botD, botY, -halfZ],
        [sign * botD, botY, halfZ],
        [sign * topD, topY, halfZ],
        [sign * topD, topY, -halfZ],
        GW * dens,
        slopeLen * dens
      ),
      netMat
    );
    // Telo superiore (tetto porta)
    const roofNet = new THREE.Mesh(
      makeQuadGeo(
        THREE,
        [0, topY, -halfZ],
        [0, topY, halfZ],
        [sign * topD, topY, halfZ],
        [sign * topD, topY, -halfZ],
        GW * dens,
        topD * dens
      ),
      netMat
    );
    // Teli laterali trapezoidali sinistro e destro
    const sideNetL = new THREE.Mesh(
      makeQuadGeo(
        THREE,
        [0, botY, -halfZ],
        [sign * botD, botY, -halfZ],
        [sign * topD, topY, -halfZ],
        [0, topY, -halfZ],
        botD * dens,
        GH * dens
      ),
      netMat
    );
    const sideNetR = new THREE.Mesh(
      makeQuadGeo(
        THREE,
        [0, botY, halfZ],
        [sign * botD, botY, halfZ],
        [sign * topD, topY, halfZ],
        [0, topY, halfZ],
        botD * dens,
        GH * dens
      ),
      netMat
    );
    netRig.add(backNet, roofNet, sideNetL, sideNetR);
    gg.add(netRig);

    scene.add(gg);
    return { grp: gg, netRig, ledMat, padMat, pulse: 0 };
  }

  // Modello procedurale composito espressivo (15 parti, pivot y=0 a terra + cursore 3D sopra l'atleta attivo)
  function buildAthleteMesh(THREE, shadowTex, cfg) {
    const grp = new THREE.Group();

    const matSkin = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.62, metalness: 0.04 });
    const matHair = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.72, metalness: 0.06 });
    const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.58, metalness: 0.1 });
    const matTrim = new THREE.MeshStandardMaterial({ color: cfg.trim || 0xfef08a, roughness: 0.45, metalness: 0.18 });
    const matShorts = new THREE.MeshStandardMaterial({ color: cfg.shorts, roughness: 0.8, metalness: 0.05 });
    const matSock = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.72, metalness: 0.05 });
    const matBoots = new THREE.MeshStandardMaterial({ color: cfg.boots, roughness: 0.28, metalness: 0.32 });
    const matGlove = new THREE.MeshStandardMaterial({ color: cfg.isGk ? 0xffd23f : cfg.skin, roughness: cfg.isGk ? 0.35 : 0.62, metalness: 0.12 });
    const matEye = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    // 1. Ombra di contatto radiale a terra
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.22, 1.22),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.015;
    grp.add(sh);

    // 2. Doppio anello indicatore ruolo / giocatore controllato
    const ringMat = new THREE.MeshBasicMaterial({
      color: cfg.ringColor,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.47, 0.65, 28), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.022;
    grp.add(ring);

    // 3. Cursore diamante 3D oro sopra il campione controllato dall'utente
    const ctrlConeMat = new THREE.MeshStandardMaterial({
      color: 0xffd23f,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.22,
      metalness: 0.45,
    });
    const ctrlCone = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), ctrlConeMat);
    ctrlCone.scale.set(0.95, 1.35, 0.95);
    ctrlCone.position.y = 2.08;
    ctrlCone.visible = false;
    grp.add(ctrlCone);

    const bodyRoot = new THREE.Group();
    grp.add(bodyRoot);

    // 4 & 5. Gambe articolate + calzettoni alti + scarpini bicolori
    function mkLeg(xOff) {
      const piv = new THREE.Group();
      piv.position.set(xOff, 0.56, 0);
      const knee = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.088, 0.21, 10), matSkin);
      knee.position.y = -0.11;
      piv.add(knee);
      const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.078, 0.25, 10), matSock);
      sock.position.y = -0.33;
      piv.add(sock);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.13, 0.31), matBoots);
      boot.position.set(0, -0.46, 0.055);
      piv.add(boot);
      return piv;
    }
    const legL = mkLeg(-0.145);
    const legR = mkLeg(0.145);
    bodyRoot.add(legL, legR);

    // 6. Pantaloncini con bordo laterale
    const shorts = new THREE.Mesh(new THREE.CylinderGeometry(0.255, 0.235, 0.25, 14), matShorts);
    shorts.position.y = 0.64;
    bodyRoot.add(shorts);

    // 7. Busto maglia + banda pettorale + colletto
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.242, 0.53, 14), matShirt);
    torso.position.y = 0.985;
    if (!IS_SW_GL) torso.castShadow = true;
    bodyRoot.add(torso);

    const chestBand = new THREE.Mesh(new THREE.CylinderGeometry(0.278, 0.268, 0.12, 14), matTrim);
    chestBand.position.y = 1.04;
    bodyRoot.add(chestBand);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.036, 8, 16), matTrim);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.24;
    bodyRoot.add(collar);

    // 8 & 9. Braccia + manica + mani / guantoni da portiere
    function mkArm(xOff) {
      const piv = new THREE.Group();
      piv.position.set(xOff, 1.17, 0);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.08, 0.19, 10), matShirt);
      sleeve.position.y = -0.09;
      piv.add(sleeve);
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.074, 0.066, 0.22, 9), matSkin);
      forearm.position.y = -0.27;
      piv.add(forearm);
      const handGeo = cfg.isGk ? new THREE.BoxGeometry(0.2, 0.2, 0.15) : new THREE.SphereGeometry(0.085, 9, 9);
      const hand = new THREE.Mesh(handGeo, matGlove);
      hand.position.y = -0.4;
      piv.add(hand);
      return piv;
    }
    const armL = mkArm(-0.345);
    const armR = mkArm(0.345);
    bodyRoot.add(armL, armR);

    // 10. Testa + occhi espressivi + capigliatura variata
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.242, 16, 13), matSkin);
    head.position.y = 1.47;
    if (!IS_SW_GL) head.castShadow = true;
    bodyRoot.add(head);

    [-0.082, 0.082].forEach((ex) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), matEye);
      eye.position.set(ex, 1.485, 0.215);
      bodyRoot.add(eye);
    });

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.254, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), matHair);
    hairCap.position.y = 1.49;
    hairCap.rotation.x = -0.18;
    bodyRoot.add(hairCap);

    const style = cfg.styleIdx % 3;
    if (style === 0) {
      const crest = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.23, 7), matHair);
      crest.position.set(0, 1.73, 0.06);
      crest.rotation.x = 0.35;
      bodyRoot.add(crest);
    } else if (style === 1) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.242, 0.028, 8, 18), matTrim);
      band.rotation.x = Math.PI / 2 - 0.08;
      band.position.y = 1.54;
      bodyRoot.add(band);
    } else {
      const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), matHair);
      tuft.position.set(0, 1.7, -0.05);
      bodyRoot.add(tuft);
    }

    return { grp, bodyRoot, legL, legR, armL, armR, ring, ringMat, ctrlCone };
  }

  function buildArenaProps(THREE, scene, ar, extraTextures) {
    const props = { crowd: [], flames: [], beacon: null };

    // Ampio piazzale esterno oltre la gabbia
    const apron = new THREE.Mesh(
      new THREE.PlaneGeometry(88, 64),
      new THREE.MeshStandardMaterial({ color: ar.apron, roughness: 0.9, metalness: 0.06 })
    );
    apron.rotation.x = -Math.PI / 2;
    apron.position.y = -0.03;
    scene.add(apron);

    // Cornice pavimentata attorno al perimetro della gabbia
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.35 });
    const curb = new THREE.Mesh(new THREE.RingGeometry(13.2, 15.8, 4), curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.rotation.z = Math.PI / 4;
    curb.scale.set(1.12, 0.74, 1);
    curb.position.y = -0.015;
    scene.add(curb);

    const trussMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.42, metalness: 0.72 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: ar.sun, emissiveIntensity: 1.35, roughness: 0.2 });
    const coneMat = new THREE.MeshBasicMaterial({ color: ar.sun, transparent: true, opacity: 0.075, side: THREE.DoubleSide, depthWrite: false });

    // 4 Torri faro da stadio con riflettori multipli e coni di luce atmosferici
    const corners = [[-13.4, -8.9], [13.4, -8.9], [-13.4, 8.9], [13.4, 8.9]];
    corners.forEach(([cx, cz]) => {
      const poleH = ar.id === "colosseo" ? 5.6 : 6.8;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.45, 10), curbMat);
      base.position.set(cx, 0.22, cz);
      scene.add(base);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, poleH, 10), trussMat);
      pole.position.set(cx, poleH / 2, cz);
      scene.add(pole);

      const headGrp = new THREE.Group();
      headGrp.position.set(cx, poleH + 0.18, cz);
      headGrp.lookAt(0, 0.6, 0);
      const hood = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.62, 0.42), curbMat);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.48), glowMat);
      face.position.z = 0.22;
      headGrp.add(hood, face);
      scene.add(headGrp);

      const beam = new THREE.Mesh(new THREE.ConeGeometry(2.8, 7.5, 14, 1, true), coneMat);
      beam.position.set(cx * 0.78, poleH * 0.56, cz * 0.78);
      beam.lookAt(cx * 0.35, 0, cz * 0.35);
      beam.rotateX(Math.PI / 2);
      scene.add(beam);
    });

    // Tribunetta Nord a gradoni con spettatori festanti animati
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.2 });
    const banMat = new THREE.MeshStandardMaterial({ color: ar.rail, emissive: ar.rail, emissiveIntensity: 0.35, roughness: 0.4 });
    for (let s = 0; s < 3; s++) {
      const tier = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.45 + s * 0.42, 0.95), stepMat);
      tier.position.set(0, (0.45 + s * 0.42) * 0.5, -9.2 - s * 0.95);
      scene.add(tier);
    }
    const hoard = new THREE.Mesh(new THREE.BoxGeometry(18.6, 0.42, 0.12), banMat);
    hoard.position.set(0, 0.24, -8.62);
    scene.add(hoard);

    const fanColors = [0x38bdf8, 0xffd23f, 0xfb7185, 0x34d399, 0xa855f7, 0xf97316];
    const fanMats = fanColors.map((hex) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.65 }));
    const fanHeadMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d, roughness: 0.65 });
    const torsoGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.38, 8);
    const headGeo = new THREE.SphereGeometry(0.13, 8, 8);
    for (let i = 0; i < 16; i++) {
      const row = i % 2;
      const fx = -7.5 + i * 1.0;
      const fy = 0.62 + row * 0.44;
      const fz = -9.2 - row * 0.95;
      const fg = new THREE.Group();
      const ft = new THREE.Mesh(torsoGeo, fanMats[i % fanMats.length]);
      const fh = new THREE.Mesh(headGeo, fanHeadMat);
      fh.position.y = 0.31;
      fg.add(ft, fh);
      fg.position.set(fx, fy, fz);
      scene.add(fg);
      props.crowd.push({ grp: fg, baseY: fy, phase: i * 0.85 });
    }

    // Scenografia tematica specifica dell'Arena
    if (ar.id === "darsena") {
      // Specchio d'acqua del porto + Faro di Borgo Marino + bitte d'ormeggio
      const sea = new THREE.Mesh(
        new THREE.PlaneGeometry(90, 26),
        new THREE.MeshStandardMaterial({ color: 0x0c4a6e, roughness: 0.18, metalness: 0.65 })
      );
      sea.rotation.x = -Math.PI / 2;
      sea.position.set(0, -0.01, -24);
      scene.add(sea);

      const lhGrp = new THREE.Group();
      lhGrp.position.set(16.5, 0, -13.8);
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.55 });
      const whtMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      for (let k = 0; k < 4; k++) {
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.85 - k * 0.1, 0.95 - k * 0.1, 1.55, 12), k % 2 ? whtMat : redMat);
        seg.position.y = 0.78 + k * 1.55;
        lhGrp.add(seg);
      }
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.75, 12), glowMat);
      lantern.position.y = 6.6;
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.68, 0.65, 12), redMat);
      roof.position.y = 7.25;
      lhGrp.add(lantern, roof);
      scene.add(lhGrp);
      props.beacon = lantern;

      [-15.5, -10.5, 10.5, 15.5].forEach((bx) => {
        const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.55, 10), curbMat);
        bollard.position.set(bx, 0.28, -11.8);
        scene.add(bollard);
      });
    } else if (ar.id === "periferia") {
      // Palazzi notturni con finestre illuminate
      const winTex = makeWindowGridTexture(THREE, 0x1e293b, 0xfef08a);
      extraTextures.push(winTex);
      const bldMat = new THREE.MeshStandardMaterial({ map: winTex, emissive: 0xfde047, emissiveMap: winTex, emissiveIntensity: 0.35, roughness: 0.85 });
      for (let i = -3; i <= 3; i++) {
        const h = 4.2 + ((Math.abs(i * 5 + 2) % 4) * 1.45);
        const blk = new THREE.Mesh(new THREE.BoxGeometry(3.9, h, 2.6), bldMat);
        blk.position.set(i * 4.8, h / 2, -14.8 - (Math.abs(i) % 2) * 1.4);
        scene.add(blk);
      }
    } else if (ar.id === "cupola") {
      // Archi olografici al plasma Neo-2099 sullo sfondo Nord + obelischi cyber (senza ostruire la visuale Tribuna sulle porte)
      const archMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.9, roughness: 0.2, metalness: 0.6 });
      const archMat2 = new THREE.MeshStandardMaterial({ color: 0xc084fc, emissive: 0x9333ea, emissiveIntensity: 0.85, roughness: 0.2, metalness: 0.6 });
      [[14.8, -12.6, archMat], [17.6, -15.4, archMat2]].forEach(([rad, az, mt]) => {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.15, 10, 48, Math.PI), mt);
        torus.position.set(0, 0, az);
        scene.add(torus);
      });
      for (let i = -3; i <= 3; i++) {
        const h = 3.2 + (Math.abs(i) % 3) * 1.4;
        const ob = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.45, h, 6), i % 2 ? archMat : archMat2);
        ob.position.set(i * 4.8, h / 2, -14.2);
        scene.add(ob);
      }
    } else if (ar.id === "colosseo") {
      // Colonnato classico imperiale + 4 bracieri ardenti animati
      const stoneMat = new THREE.MeshStandardMaterial({ color: 0xa8896c, roughness: 0.82, metalness: 0.08 });
      const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.4, metalness: 0.72 });
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      for (let i = -3; i <= 3; i++) {
        const cx = i * 4.4, cz = -13.6;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 4.8, 12), stoneMat);
        col.position.set(cx, 2.4, cz);
        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.32, 1.05), stoneMat);
        cap.position.set(cx, 4.95, cz);
        scene.add(col, cap);
      }
      const architrave = new THREE.Mesh(new THREE.BoxGeometry(28, 0.55, 1.1), stoneMat);
      architrave.position.set(0, 5.38, -13.6);
      scene.add(architrave);

      [[-12.6, -5.2], [12.6, -5.2], [-12.6, 5.2], [12.6, 5.2]].forEach(([bx, bz], idx) => {
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.26, 0.95, 10), bronzeMat);
        bowl.position.set(bx, 0.48, bz);
        const flame = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.85, 8), fireMat);
        flame.position.set(bx, 1.28, bz);
        scene.add(bowl, flame);
        props.flames.push({ m: flame, baseY: 1.28, phase: idx * 1.4 });
      });
    }

    return props;
  }

  // Vettori pre-allocati per zero GC nel game loop
  let _vTarget = null, _vLook = null;

  function makeActor(c, side, slotIdx, isGk, shadowTex, THREE, home) {
    const s = S();
    const cast = CAST()[c.id] || {};
    const eff = s && s.eff && side === "m" ? s.eff(c) : { at: c.at || 65, df: c.df || 65, te: c.te || 65 };
    const sagaCol = side === "m" ? (s && s.SAGHE && s.SAGHE[c.saga] ? s.SAGHE[c.saga][2] : "#2563eb") : c.shirtHex || "#e11d48";
    const shirtHex = typeof sagaCol === "number" ? sagaCol : parseInt(String(sagaCol).replace("#", ""), 16) || 0x2563eb;
    const skinHex = cast.skin ? parseInt(String(cast.skin).replace("#", ""), 16) || 0xf1c27d : (slotIdx % 2 ? 0xe0ac69 : 0xf1c27d);
    const hairHex = cast.hair ? parseInt(String(cast.hair).replace("#", ""), 16) || 0x2b1d0e : (slotIdx === 1 ? 0x1e293b : 0x451a03);
    const dir = side === "m" ? 1 : -1;
    const homeX = isGk ? -dir * (HX - 0.85) : home ? home.x : -dir * (slotIdx === 1 ? 3.2 : 5.8);
    const homeZ = isGk ? 0 : home ? home.z : (slotIdx === 1 ? -2.6 : 2.6);
    const idHash = String(c.id || "").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), slotIdx);

    const mesh = buildAthleteMesh(THREE, shadowTex, {
      skin: skinHex,
      hair: hairHex,
      shirt: isGk ? (side === "m" ? 0x16a34a : 0xd97706) : shirtHex,
      trim: side === "m" ? 0xfef08a : (c.trimHex || 0xfecdd3),
      shorts: side === "m" ? 0x0f172a : 0x1e1b4b,
      boots: side === "m" ? 0xfbbf24 : 0xf43f5e,
      isGk,
      styleIdx: idHash,
      ringColor: side === "m" ? 0x38bdf8 : 0xfb7185,
    });

    mesh.grp.position.set(homeX, 0, homeZ);
    mesh.grp.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;

    const pBonus = isGk && c.role === "P" ? 1.2 : 1.0;
    return {
      id: c.id,
      name: side === "m" ? (s && s.name ? s.name(c.id) : c.id) : c.name,
      role: c.role || (isGk ? "P" : "A"),
      side,
      isGk,
      at: eff.at,
      df: eff.df,
      te: eff.te,
      x: homeX,
      z: homeZ,
      vx: 0,
      vz: 0,
      homeX,
      homeZ,
      facing: dir > 0 ? 0 : Math.PI,
      speed: (isGk ? 5.6 : 6.6 + (eff.te - 55) * 0.032) * (side === "o" && !isGk ? 0.9 : 1),
      reach: (isGk ? 1.28 + (eff.df - 50) * 0.008 : 1.08 + (eff.df - 50) * 0.005) * pBonus,
      shotPow: 15.4 + (eff.at - 50) * 0.095,
      tackleCd: 0,
      stealCd: 0,
      tackleT: 0,
      kickT: 0,
      diveT: 0,
      diveZ: 0,
      slowT: 0,
      actPulse: 0,
      phase: slotIdx * 1.7,
      mesh,
    };
  }

  function startMatch(opts) {
    const THREE = window.THREE;
    if (!THREE) {
      const b = shell("🏟️ Gabbia 3D", false);
      b.innerHTML = `<p class="sum">Motore 3D non disponibile in questa sessione.</p><div class="big"><button type="button" data-b="1">◂ Indietro</button></div>`;
      b.querySelector("[data-b]").onclick = () => open();
      return;
    }

    const rec = load();
    const ar = ARENAS[opts.arenaId] || ARENAS[rec.arena] || ARENAS.darsena;
    const opp = opts.opp || OPP_TIERS[0];
    const NP = (opts.n || rec.fmt) === 7 ? 7 : 3;
    setField(NP);
    const LOWQ = rec.q === "low";
    const sq = getMySquad3(NP);
    const title = opts.mode === "cup" ? `🏆 ${opp.label} · vs ${opp.name}` : `🏟️ ${NP === 7 ? "Calcio 3D 7v7" : "Gabbia 3D"} · vs ${opp.name}`;
    const body = shell(title, true);

    body.innerHTML = `
      <div class="g3dHud">
        <div class="g3dScoreSide me">🟦 Sogni <span id="g3dActiveNm"></span></div>
        <div class="g3dScoreMid">
          <b id="g3dScore">0 – 0</b>
          <span id="g3dClock">1:30</span>
        </div>
        <div class="g3dScoreSide opp">${esc(opp.name)} 🟥</div>
      </div>
      <div class="g3dSuperBarWrap">
        <span>⚡ Super Saga</span>
        <div class="g3dSuperTrack"><div class="g3dSuperFill" id="g3dSuperFill"></div></div>
        <b id="g3dSuperPct">0%</b>
      </div>
      <div class="g3dStage" id="g3dStage">
        <canvas id="g3dCanvas"></canvas>
        <div class="g3dBanner" id="g3dBanner" hidden>
          <div class="bAv" id="g3dBanAv"></div>
          <div class="bTxt"><b id="g3dBanTitle"></b><span id="g3dBanSub"></span></div>
        </div>
      </div>
      <div class="g3dPad">
        <div class="g3dStick" id="g3dStick" aria-label="Joystick movimento">
          <div class="g3dStickKnob" id="g3dKnob"></div>
        </div>
        <div class="g3dBtns">
          <button type="button" class="g3dAct pass" data-btn="pass">🎯 Passa<small id="g3dPassSub">Uno-due / Sponda</small></button>
          <button type="button" class="g3dAct shoot" data-btn="shoot">⚽ Tira<small id="g3dShootSub">Botta in porta</small></button>
          <button type="button" class="g3dAct tackle" id="g3dTackleBtn" data-btn="tackle">🛡️ Recupera<small id="g3dTackleSub">Scivolata / Ruba</small></button>
          <button type="button" class="g3dAct super" id="g3dSuperBtn" data-btn="super">⚡ Super<small id="g3dSuperSub">Carica 25%</small></button>
        </div>
      </div>
      <div class="g3dKeyHint">Tastiera: WASD / Frecce · J/Z Passa · K/X Tira · C Recupera · Spazio/L Super</div>
    `;

    const canvas = body.querySelector("#g3dCanvas");
    const stageEl = body.querySelector("#g3dStage");

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !IS_SW_GL,
        powerPreference: "high-performance",
      });
    } catch (err) {
      stageEl.innerHTML = `<div style="padding:24px;text-align:center;color:#cbd5e1">WebGL non disponibile su questo dispositivo.</div>`;
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.setPixelRatio(IS_SW_GL || LOWQ ? 1 : Math.min(window.devicePixelRatio || 1, NP === 7 ? 1.5 : 2));
    renderer.shadowMap.enabled = !IS_SW_GL && !LOWQ;
    if (!IS_SW_GL && !LOWQ) renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const maxAniso = safe(() => Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1), 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(ar.sky);
    scene.fog = new THREE.FogExp2(ar.fog, ar.fogD * 0.92);

    const envRT = buildStudioEnv(THREE, renderer, ar);
    if (envRT && envRT.texture) scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(52, 16 / 10, 0.2, 120);
    _vTarget = new THREE.Vector3();
    _vLook = new THREE.Vector3();

    const hemi = new THREE.HemisphereLight(ar.hemiSky, ar.hemiGnd, 0.78);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(ar.sun, 1.42);
    dirLight.position.set(9, 17, 11);
    dirLight.position.set(9 * FK, 17 * FK, 11 * FK);
    if (!IS_SW_GL && !LOWQ) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(NP === 7 ? 2048 : 1024, NP === 7 ? 2048 : 1024);
      dirLight.shadow.camera.near = 2;
      dirLight.shadow.camera.far = 42 * FK;
      dirLight.shadow.camera.left = -15 * FK;
      dirLight.shadow.camera.right = 15 * FK;
      dirLight.shadow.camera.top = 12 * FK;
      dirLight.shadow.camera.bottom = -12 * FK;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(ar.wall, 0.48);
    rimLight.position.set(-10, 9, -9);
    scene.add(rimLight);

    const extraTextures = [];
    const pitchTex = makePitchTexture(THREE, ar, maxAniso);
    const ballTex = makeBallTexture(THREE, maxAniso);
    const shadowTex = makeShadowTexture(THREE);
    const netTexLeft = makeNetTexture(THREE, 0x38bdf8, maxAniso);
    const netTexRight = makeNetTexture(THREE, 0xfb7185, maxAniso);
    const cageGlassTex = makeCageGlassTexture(THREE, ar, maxAniso);

    const propsGrp = new THREE.Group();
    propsGrp.scale.setScalar(FK);
    scene.add(propsGrp);
    const arenaProps = buildArenaProps(THREE, propsGrp, ar, extraTextures);

    const pitchMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(PW, PD),
      new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.74, metalness: 0.08 })
    );
    pitchMesh.rotation.x = -Math.PI / 2;
    if (!IS_SW_GL && !LOWQ) pitchMesh.receiveShadow = true;
    scene.add(pitchMesh);

    // Sponde luminose rinforzate della Gabbia con montanti d'acciaio e piloni angolari
    const railMat = new THREE.MeshStandardMaterial({
      color: ar.rail,
      emissive: ar.rail,
      emissiveIntensity: 0.8,
      roughness: 0.24,
      metalness: 0.52,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      map: cageGlassTex,
      color: 0xffffff,
      emissive: ar.wall,
      emissiveIntensity: 0.28,
      transparent: true,
      opacity: 0.56,
      roughness: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.34, metalness: 0.76 });

    function addCageWall(w, x, z, rotY) {
      const wg = new THREE.Group();
      wg.position.set(x, 0, z);
      wg.rotation.y = rotY;

      const paneGeo = new THREE.PlaneGeometry(w, 1.32);
      const uv = paneGeo.attributes.uv;
      const rep = Math.max(1, Math.round(w / 2.6));
      for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * rep);
      const pane = new THREE.Mesh(paneGeo, glassMat);
      pane.position.y = 0.7;
      wg.add(pane);

      const topR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.11, 0.15), railMat);
      topR.position.y = 1.4;
      wg.add(topR);

      const midR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.09), pillarMat);
      midR.position.y = 0.7;
      wg.add(midR);

      const botR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.11, 0.16), railMat);
      botR.position.y = 0.06;
      wg.add(botR);

      const postsCount = Math.max(2, Math.round(w / 4.4) + 1);
      for (let k = 0; k < postsCount; k++) {
        const px = -w * 0.5 + (k / (postsCount - 1)) * w;
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.48, 0.18), pillarMat);
        st.position.set(px, 0.74, 0);
        wg.add(st);
      }

      scene.add(wg);
    }
    addCageWall(PW, 0, -HZ, 0);
    addCageWall(PW, 0, HZ, 0);
    const sideSpan = (PD - GW) / 2;
    [-HX, HX].forEach((gx) => {
      addCageWall(sideSpan, gx, -HZ + sideSpan / 2, Math.PI / 2);
      addCageWall(sideSpan, gx, HZ - sideSpan / 2, Math.PI / 2);
    });

    // 4 Piloni corazzati luminosi agli angoli della Gabbia
    [[-HX, -HZ], [HX, -HZ], [-HX, HZ], [HX, HZ]].forEach(([cx, cz]) => {
      const pyl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.62, 12), pillarMat);
      pyl.position.set(cx, 0.81, cz);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 12), railMat);
      cap.position.set(cx, 1.66, cz);
      scene.add(pyl, cap);
    });

    // Porte 3D ad alta definizione a sinistra (-HX, blu Sogni) e destra (+HX, corallo Rivali)
    const goalLeft = buildGoal3D(THREE, scene, -1, netTexLeft);
    const goalRight = buildGoal3D(THREE, scene, 1, netTexRight);

    // Pallone + ombra + anello aura Super + scia dinamica 3D + onda d'urto
    const ballRadius = 0.31;
    const ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 20, 16),
      new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.34, metalness: 0.12 })
    );
    ballMesh.position.set(0, ballRadius, 0);
    if (!IS_SW_GL && !LOWQ) ballMesh.castShadow = true;
    scene.add(ballMesh);

    const ballShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.92, 0.92),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.y = 0.016;
    scene.add(ballShadow);

    const superAuraMat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
    const superAura = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.72, 24), superAuraMat);
    scene.add(superAura);

    // Onda d'urto 3D circolare a terra (per tiri, sponde, contrasti e gol)
    const shockMat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
    const shockRing = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.68, 28), shockMat);
    shockRing.rotation.x = -Math.PI / 2;
    shockRing.position.y = 0.026;
    shockRing.visible = false;
    scene.add(shockRing);

    // Scia luminosa 3D del pallone (pool pre-allocato zero GC)
    const trailPool = [];
    const trailGeo = new THREE.SphereGeometry(0.22, 10, 8);
    for (let i = 0; i < 10; i++) {
      const tm = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0, depthWrite: false });
      const m = new THREE.Mesh(trailGeo, tm);
      m.visible = false;
      scene.add(m);
      trailPool.push({ m, mat: tm, life: 0, maxLife: 0.24 });
    }

    // Particelle scintille sponda / Super / pali (pool pre-allocato zero GC)
    const sparkPool = [];
    const sparkGeo = new THREE.OctahedronGeometry(0.11, 0);
    const sparkMat = new THREE.MeshBasicMaterial({ color: ar.rail });
    for (let i = 0; i < 22; i++) {
      const m = new THREE.Mesh(sparkGeo, sparkMat);
      m.visible = false;
      scene.add(m);
      sparkPool.push({ m, vx: 0, vy: 0, vz: 0, life: 0 });
    }

    // Creazione 3vs3 giocatori
    const intesaMult = 1 + sq.intesa * 0.006;
    let myTeam;
    if (NP === 7) {
      const ss = S();
      const lu = ss && ss.lineup ? ss.lineup(sq.field) : sq.field.map((c, i) => ({ c, fx: [0.47, 0.33, 0.33, 0.33, 0.2, 0.2][i] || 0.3, fy: [0.5, 0.2, 0.5, 0.8, 0.3, 0.7][i] || 0.5 }));
      myTeam = [makeActor(sq.keeper, "m", 0, true, shadowTex, THREE)].concat(lu.map((q, i) =>
        makeActor(q.c, "m", i + 1, false, shadowTex, THREE, { x: -HX + 1.2 + q.fx * (PW - 2.4) * 1.02, z: (q.fy - 0.5) * (PD - 4.5) })));
    } else {
      myTeam = [
        makeActor(sq.keeper, "m", 0, true, shadowTex, THREE),
        makeActor(sq.field[0] || sq.keeper, "m", 1, false, shadowTex, THREE),
        makeActor(sq.field[1] || sq.field[0] || sq.keeper, "m", 2, false, shadowTex, THREE),
      ];
    }
    myTeam.forEach((p) => {
      p.speed *= intesaMult;
      p.shotPow *= intesaMult;
      scene.add(p.mesh.grp);
    });

    const oppCards = [
      { id: "opp_gk", name: opp.pl[2] || "Portiere", role: "P", at: opp.ovr - 12, df: opp.ovr + 4, te: opp.ovr - 4, shirtHex: opp.shirt, trimHex: opp.trim },
      { id: "opp_1", name: opp.pl[0] || "Capitano", role: "A", at: opp.ovr + 3, df: opp.ovr - 4, te: opp.ovr + 2, shirtHex: opp.shirt, trimHex: opp.trim },
      { id: "opp_2", name: opp.pl[1] || "Ala", role: "C", at: opp.ovr - 1, df: opp.ovr, te: opp.ovr + 1, shirtHex: opp.shirt, trimHex: opp.trim },
    ];
    let oppTeam;
    if (NP === 7) {
      const names = (opp.pl || []).concat(["Rocco", "Bruno", "Ivo", "Sandro", "Mimmo", "Furio"]);
      const fxs = [0.47, 0.33, 0.33, 0.33, 0.2, 0.2], fys = [0.5, 0.2, 0.5, 0.8, 0.3, 0.7], rl = ["A", "C", "C", "C", "D", "D"], dv = [3, 0, 1, 0, -2, -2];
      oppTeam = [makeActor(oppCards[0], "o", 0, true, shadowTex, THREE)];
      for (let i = 0; i < 6; i++) {
        const card = { id: "opp_" + (i + 1), name: names[i] || "Rivale", role: rl[i], at: opp.ovr + dv[i], df: opp.ovr - dv[i] * 0.6, te: opp.ovr + (i % 2), shirtHex: opp.shirt, trimHex: opp.trim };
        oppTeam.push(makeActor(card, "o", i + 1, false, shadowTex, THREE, { x: HX - 1.2 - fxs[i] * (PW - 2.4) * 1.02, z: (fys[i] - 0.5) * (PD - 4.5) }));
      }
    } else {
      oppTeam = [
        makeActor(oppCards[0], "o", 0, true, shadowTex, THREE),
        makeActor(oppCards[1], "o", 1, false, shadowTex, THREE),
        makeActor(oppCards[2], "o", 2, false, shadowTex, THREE),
      ];
    }
    oppTeam.forEach((p) => scene.add(p.mesh.grp));

    const clock = new THREE.Clock();

    G = {
      mode: opts.mode || "quick",
      round: opts.round || 0,
      opp,
      ar,
      camMode: rec.cam || "tribuna",
      sq,
      scene,
      camera,
      renderer,
      envRT,
      clock,
      textures: [pitchTex, ballTex, shadowTex, netTexLeft, netTexRight, cageGlassTex].concat(extraTextures),
      railMat,
      glassMat,
      goalLeft,
      goalRight,
      arenaProps,
      ballMesh,
      ballShadow,
      superAura,
      superAuraMat,
      shockRing,
      shockMat,
      shockLife: 0,
      trailPool,
      trailCursor: 0,
      trailTick: 0,
      sparkPool,
      myTeam,
      oppTeam,
      all: myTeam.concat(oppTeam),
      n: NP,
      chg: -1,
      winGoals: NP === 7 ? 5 : 3,
      ctrlIdx: 1, // parte sul primo giocatore di movimento
      stk: {
        x: 0,
        z: 0,
        set(nx, nz) { this.x = clamp(nx, -1, 1); this.z = clamp(nz, -1, 1); },
      },
      keys: {},
      ball: {
        x: 0,
        y: ballRadius,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        r: ballRadius,
        owner: myTeam[1],
        lastSide: "m",
        lastActor: myTeam[1],
        wallBounced: false,
        superFx: null,
        superCol: 0xffd23f,
        superAge: 0,
        trailCol: 0x38bdf8,
        pickupLock: 0.25,
      },
      score: [0, 0],
      timeLeft: NP === 7 ? 150 : 90,
      goldenGoal: false,
      superPct: 25,
      wallFlash: 0,
      goalFreeze: 0,
      camShake: 0,
      camSnap: true,
      animTime: 0,
      paused: false,
      over: false,
      dead: false,
      raf: 0,
      swTimer: 0,
      bannerTimer: 0,
    };

    kickoff("m");

    const syncSize = () => {
      if (!G || !stageEl.isConnected) return;
      const w = Math.max(260, stageEl.clientWidth || 320);
      const h = Math.max(165, stageEl.clientHeight || 200);
      G.camera.aspect = w / h;
      G.camera.updateProjectionMatrix();
      G.renderer.setSize(w, h, false);
    };
    syncSize();
    window.addEventListener("resize", syncSize);
    resizeCleanup = () => window.removeEventListener("resize", syncSize);

    const camBtn = OV.querySelector("[data-cam-toggle]");
    if (camBtn) {
      camBtn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (!G) return;
        G.camMode = G.camMode === "tribuna" ? "terza" : "tribuna";
        G.camSnap = true;
        const r2 = load();
        r2.cam = G.camMode;
        save(r2);
        showBanner("🎥 Telecamera", G.camMode === "tribuna" ? "Tribuna Dinamica" : "Terza Persona", null, 1.2);
      });
    }

    bindMatchInputs(body);
    updateHud();

    // Frame pacing sicuro per hardware GPU e Software WebGL (SwiftShader)
    const gl = renderer.getContext();
    const afterDraw = (IS_SW_GL && gl && typeof gl.fenceSync === "function")
      ? (cb) => {
          const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
          gl.flush();
          const poll = () => {
            if (!G || G.dead) { safe(() => gl.deleteSync(sync), 0); return; }
            const st = gl.clientWaitSync(sync, 0, 0);
            if (st === gl.TIMEOUT_EXPIRED) { G.raf = requestAnimationFrame(poll); return; }
            gl.deleteSync(sync);
            G.swTimer = setTimeout(() => { if (G && !G.dead) G.raf = requestAnimationFrame(cb); }, 45);
          };
          G.raf = requestAnimationFrame(poll);
        }
      : (cb) => { G.raf = requestAnimationFrame(cb); };

    function frame() {
      if (!G || G.dead) return;
      const dt = Math.min(G.clock.getDelta(), 0.05);
      if (!G.paused && !G.over) stepSim(dt);
      render3D();
      if (G && !G.dead && !G.over) afterDraw(frame);
    }
    G.clock.start();
    G.raf = requestAnimationFrame(frame);
  }

  function showBanner(title, sub, portraitId, dur) {
    if (!OV || !G) return;
    const el = OV.querySelector("#g3dBanner");
    if (!el) return;
    const av = OV.querySelector("#g3dBanAv");
    const tEl = OV.querySelector("#g3dBanTitle");
    const sEl = OV.querySelector("#g3dBanSub");
    const im = portraitId && S() && S().port ? S().port(portraitId) : null;
    if (av) {
      av.style.display = im ? "" : "none";
      av.innerHTML = im ? `<img alt="" src="${im}">` : "";
    }
    if (tEl) tEl.textContent = title;
    if (sEl) sEl.textContent = sub || "";
    el.hidden = false;
    G.bannerTimer = dur || 1.6;
  }

  function spawnSparks(x, y, z, colHex) {
    if (!G) return;
    G.sparkPool.forEach((sp, i) => {
      sp.m.position.set(x, y, z);
      sp.m.material.color.setHex(colHex || G.ar.rail);
      const a = (i / G.sparkPool.length) * Math.PI * 2;
      sp.vx = Math.cos(a) * (2.4 + (i % 3));
      sp.vy = 1.7 + (i % 4) * 0.85;
      sp.vz = Math.sin(a) * (2.4 + (i % 3));
      sp.life = 0.44;
      sp.m.visible = true;
    });
  }

  function spawnShock(x, z, colHex) {
    if (!G || !G.shockRing) return;
    G.shockRing.position.set(x, 0.028, z);
    G.shockRing.scale.setScalar(0.55);
    G.shockMat.color.setHex(colHex || 0xffd23f);
    G.shockMat.opacity = 0.86;
    G.shockRing.visible = true;
    G.shockLife = 0.42;
  }

  function bindMatchInputs(body) {
    const stick = body.querySelector("#g3dStick");
    const knob = body.querySelector("#g3dKnob");
    let ptrId = null;
    let touchId = null;

    const moveStick = (clientX, clientY) => {
      if (!G || !stick) return;
      const rect = stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const maxR = Math.max(24, rect.width * 0.36);
      let dx = clientX - cx, dy = clientY - cy;
      const d = hypot(dx, dy);
      if (d > maxR) { dx = (dx / d) * maxR; dy = (dy / d) * maxR; }
      if (knob) knob.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      G.stk.set(d < 5 ? 0 : dx / maxR, d < 5 ? 0 : dy / maxR);
    };
    const resetStick = () => {
      ptrId = null;
      touchId = null;
      if (stick) stick.classList.remove("on");
      if (knob) knob.style.transform = "translate(0px, 0px)";
      if (G) G.stk.set(0, 0);
    };

    const onWinPtrMove = (e) => {
      if (ptrId !== null && e.pointerId === ptrId) moveStick(e.clientX, e.clientY);
    };
    const onWinPtrEnd = (e) => {
      if (ptrId !== null && e.pointerId === ptrId) resetStick();
    };

    if (stick) {
      stick.addEventListener("pointerdown", (e) => {
        if (ptrId !== null && ptrId !== e.pointerId) return;
        e.preventDefault();
        e.stopPropagation();
        ptrId = e.pointerId;
        stick.classList.add("on");
        safe(() => stick.setPointerCapture(e.pointerId), 0);
        moveStick(e.clientX, e.clientY);
      });
      stick.addEventListener("pointermove", (e) => {
        if (ptrId === e.pointerId) {
          e.preventDefault();
          moveStick(e.clientX, e.clientY);
        }
      });
      stick.addEventListener("pointerup", onWinPtrEnd);
      stick.addEventListener("pointercancel", onWinPtrEnd);
      stick.addEventListener("lostpointercapture", onWinPtrEnd);

      // Blocca gesture native multi-touch/scroll iOS/Android mentre il pollice muove lo stick
      stick.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (ptrId === null && touchId === null && e.changedTouches && e.changedTouches[0]) {
          const t = e.changedTouches[0];
          touchId = t.identifier;
          stick.classList.add("on");
          moveStick(t.clientX, t.clientY);
        }
      }, { passive: false });
      stick.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (touchId !== null && e.changedTouches) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === touchId) {
              moveStick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
              break;
            }
          }
        }
      }, { passive: false });
      const onTouchEnd = (e) => {
        if (touchId !== null && e.changedTouches) {
          for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === touchId) {
              resetStick();
              break;
            }
          }
        }
      };
      stick.addEventListener("touchend", onTouchEnd);
      stick.addEventListener("touchcancel", onTouchEnd);
    }

    window.addEventListener("pointermove", onWinPtrMove);
    window.addEventListener("pointerup", onWinPtrEnd);
    window.addEventListener("pointercancel", onWinPtrEnd);

    const actions = {
      pass: () => { if (G && !G.over && !G.paused) doPassOrSwitch(); },
      shoot: () => { if (G && !G.over && !G.paused) doShootOrTackle(); },
      tackle: () => { if (G && !G.over && !G.paused) doTackle(); },
      super: () => { if (G && !G.over && !G.paused) doSuperShot(); },
    };

    // Binding immediato su pointerdown + touchstart (supporto pieno multi-touch col pollice sullo stick!)
    // con fallback click dedupato per tastiera/accessibilità/automazione.
    body.querySelectorAll(".g3dAct[data-btn]").forEach((btn) => {
      const kind = btn.dataset.btn;
      const fn = actions[kind];
      if (!fn) return;
      let lastPtrTs = -999;
      let lastDirectTs = -999;

      const fire = () => {
        safe(() => window.hapticTrigger && window.hapticTrigger("tap"), 0);
        fn();
      };
      const releaseVisual = () => btn.classList.remove("isDown");

      const isShoot = kind === "shoot";
      const press = () => {
        if (isShoot && G && !G.over && !G.paused && startCharge()) { safe(() => window.hapticTrigger && window.hapticTrigger("tap"), 0); return; }
        fire();
      };
      const letGo = () => { releaseVisual(); if (isShoot) releaseCharge(); };

      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        lastPtrTs = performance.now();
        lastDirectTs = lastPtrTs;
        btn.classList.add("isDown");
        press();
      });
      btn.addEventListener("pointerup", letGo);
      btn.addEventListener("pointercancel", letGo);
      btn.addEventListener("pointerleave", letGo);

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = performance.now();
        btn.classList.add("isDown");
        if (now - lastPtrTs < 90) return; // già scattato su pointerdown
        lastDirectTs = now;
        press();
      }, { passive: false });
      btn.addEventListener("touchend", letGo);
      btn.addEventListener("touchcancel", letGo);

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (performance.now() - lastDirectTs < 340) return; // evita doppio sparo dopo pointerdown/touchstart
        fire();
      });
    });

    const onKeyDown = (e) => {
      if (!G || G.over || !OV || !OV.isConnected) return;
      const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;
      const k = e.key.toLowerCase();
      const isMove = k === "arrowleft" || k === "arrowright" || k === "arrowup" || k === "arrowdown" || k === "a" || k === "d" || k === "w" || k === "s";
      const isAct = k === "j" || k === "z" || k === "k" || k === "x" || k === "c" || k === "l" || k === " " || k === "enter";
      if (!isMove && !isAct) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (isMove) {
        G.keys[k] = true;
        return;
      }
      if (e.repeat) return;
      if (k === "j" || k === "z") actions.pass();
      else if (k === "k" || k === "x") { if (!startCharge()) actions.shoot(); }
      else if (k === "c") actions.tackle();
      else if (k === "l" || k === " " || k === "enter") actions.super();
    };
    const onKeyUp = (e) => {
      if (!G) return;
      const kk = e.key.toLowerCase();
      if (kk === "k" || kk === "x") releaseCharge();
      G.keys[kk] = false;
    };
    const onBlur = () => {
      if (G) G.keys = {};
      resetStick();
    };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onBlur);
    keyCleanup = () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pointermove", onWinPtrMove);
      window.removeEventListener("pointerup", onWinPtrEnd);
      window.removeEventListener("pointercancel", onWinPtrEnd);
    };
  }

  function activeInputVec() {
    if (!G) return { x: 0, z: 0 };
    let kx = 0, kz = 0;
    if (G.keys.arrowleft || G.keys.a) kx -= 1;
    if (G.keys.arrowright || G.keys.d) kx += 1;
    if (G.keys.arrowup || G.keys.w) kz -= 1;
    if (G.keys.arrowdown || G.keys.s) kz += 1;
    if (kx || kz) {
      const m = hypot(kx, kz) || 1;
      return { x: kx / m, z: kz / m };
    }
    return { x: G.stk.x, z: G.stk.z };
  }

  function releaseBall(actor, vx, vy, vz, superFx, superCol, trailCol) {
    const b = G.ball;
    b.owner = null;
    b.lastSide = actor.side;
    b.lastActor = actor;
    b.wallBounced = false;
    b.pickupLock = 0.22;
    b.x = clamp(actor.x + Math.cos(actor.facing) * 0.55, -HX + b.r, HX - b.r);
    b.z = clamp(actor.z + Math.sin(actor.facing) * 0.55, -HZ + b.r, HZ - b.r);
    b.y = Math.max(b.r, 0.36);
    b.vx = vx;
    b.vy = vy;
    b.vz = vz;
    b.superFx = superFx || null;
    b.superCol = superCol || 0xffd23f;
    b.trailCol = superFx ? (superCol || 0xffd23f) : (trailCol || (actor.side === "m" ? 0x38bdf8 : 0xfb7185));
    b.superAge = 0;
    actor.kickT = 0.3;
    actor.actPulse = 0.34;
  }

  // Consente passaggi e tiri di prima anche quando il pallone è libero vicino ai piedi del giocatore
  function claimBallForMyAction(maxLooseDist) {
    if (!G) return null;
    const b = G.ball;
    if (b.owner && b.owner.side === "m") {
      if (!b.owner.isGk) G.ctrlIdx = G.myTeam.indexOf(b.owner);
      return b.owner;
    }
    if (!b.owner && b.y < 1.95) {
      const me = G.myTeam[G.ctrlIdx];
      if (me && hypot(me.x - b.x, me.z - b.z) <= maxLooseDist) {
        b.owner = me;
        b.pickupLock = 0;
        return me;
      }
      for (let i = 1; i < G.myTeam.length; i++) {
        const m = G.myTeam[i];
        if (hypot(m.x - b.x, m.z - b.z) <= maxLooseDist * 0.85) {
          b.owner = m;
          b.pickupLock = 0;
          G.ctrlIdx = i;
          return m;
        }
      }
    }
    return null;
  }

  function doPassOrSwitch() {
    if (!G || G.over) return;
    const b = G.ball;
    const carrier = claimBallForMyAction(1.95);
    if (carrier) {
      const inp = activeInputVec();
      const mates = G.myTeam.filter((p) => p !== carrier);
      // Se il giocatore inclina verso la sponda laterale, esegue un passaggio di sponda!
      if (Math.abs(inp.z) > 0.58) {
        const targetMate = mates.find((p) => !p.isGk) || mates[0];
        const wallZ = inp.z > 0 ? HZ - b.r : -HZ + b.r;
        const midX = (carrier.x + Math.max(carrier.x + 3.5, targetMate.x + 2)) * 0.5;
        const dx = midX - carrier.x, dz = wallZ - carrier.z;
        const d = hypot(dx, dz) || 1;
        const spd = 14.8;
        carrier.facing = Math.atan2(dz, dx);
        releaseBall(carrier, (dx / d) * spd, 0.78, (dz / d) * spd, null, 0);
        G.superPct = Math.min(100, G.superPct + 8);
        sfx("pass");
        updateHud();
        return;
      }
      // Passaggio diretto al compagno di movimento meglio piazzato
      const target = G.n === 7
        ? mates.filter((q) => !q.isGk).map((q) => {
            const dd = hypot(q.x - carrier.x, q.z - carrier.z) || 1;
            const al = inp.x || inp.z ? ((q.x - carrier.x) * inp.x + (q.z - carrier.z) * inp.z) / dd : 0;
            return { q, sc: q.x * 0.5 - dd * 0.45 + al * 5 - (dd < 2.5 ? 6 : 0) };
          }).sort((a, c) => c.sc - a.sc)[0].q
        : mates.slice().sort((p1, p2) => (p2.isGk ? -99 : p2.x) - (p1.isGk ? -99 : p1.x))[0];
      const leadX = clamp(target.x + (target.isGk ? 0 : 1.05), -HX + 1, HX - 1);
      const dx = leadX - carrier.x, dz = target.z - carrier.z;
      const d = hypot(dx, dz) || 1;
      const spd = 14.2;
      carrier.facing = Math.atan2(dz, dx);
      releaseBall(carrier, (dx / d) * spd, 0.65, (dz / d) * spd, null, 0);
      if (!target.isGk) G.ctrlIdx = G.myTeam.indexOf(target);
      target.actPulse = 0.28;
      G.superPct = Math.min(100, G.superPct + 8);
      sfx("pass");
      updateHud();
      return;
    }

    // Senza palla: se siamo già addosso al portatore/pallone tenta subito il contrasto, altrimenti cambia al compagno e pressa
    const me = G.myTeam[G.ctrlIdx];
    const tx = b.owner ? b.owner.x : b.x;
    const tz = b.owner ? b.owner.z : b.z;
    if (me && hypot(me.x - tx, me.z - tz) < 1.85) {
      doTackle();
      return;
    }
    let nextIdx = G.ctrlIdx === 1 ? 2 : 1;
    if (G.n === 7) {
      let bd = 1e9;
      G.myTeam.forEach((q, i) => { if (i && i !== G.ctrlIdx) { const dd = hypot(q.x - tx, q.z - tz); if (dd < bd) { bd = dd; nextIdx = i; } } });
    }
    G.ctrlIdx = nextIdx;
    const switched = G.myTeam[nextIdx];
    if (switched) {
      const ang = Math.atan2(tz - switched.z, tx - switched.x);
      switched.facing = ang;
      switched.vx = Math.cos(ang) * switched.speed * 1.15;
      switched.vz = Math.sin(ang) * switched.speed * 1.15;
      switched.actPulse = 0.36;
    }
    sfx("pass");
    updateHud();
  }

  function doTackle() {
    if (!G || G.over) return;
    const b = G.ball;
    // Se abbiamo già la palla, il tasto Recupera esegue uno Scatto protetto in avanti!
    if (b.owner && b.owner.side === "m") {
      const carrier = b.owner;
      const inp = activeInputVec();
      const ang = (inp.x || inp.z) ? Math.atan2(inp.z, inp.x) : carrier.facing;
      carrier.facing = ang;
      carrier.vx = Math.cos(ang) * (carrier.speed * 1.55);
      carrier.vz = Math.sin(ang) * (carrier.speed * 1.55);
      carrier.tackleT = 0.18;
      carrier.actPulse = 0.34;
      b.pickupLock = Math.max(b.pickupLock, 0.28);
      spawnSparks(carrier.x, 0.2, carrier.z, 0x38bdf8);
      sfx("pass");
      return;
    }

    const tx = b.owner ? b.owner.x : b.x;
    const tz = b.owner ? b.owner.z : b.z;
    let me = G.myTeam[G.ctrlIdx];
    let othIdx = G.ctrlIdx === 1 ? 2 : 1;
    if (G.n === 7) {
      let bd = 1e9;
      G.myTeam.forEach((q, i) => { if (i && q !== G.myTeam[G.ctrlIdx]) { const dd = hypot(q.x - tx, q.z - tz); if (dd < bd) { bd = dd; othIdx = i; } } });
    }
    const oth = G.myTeam[othIdx];
    // Se l'altro compagno di movimento è molto più vicino alla palla, passa a lui per intervenire subito!
    if (me && oth && hypot(me.x - tx, me.z - tz) > 3.0 && hypot(oth.x - tx, oth.z - tz) + 1.0 < hypot(me.x - tx, me.z - tz)) {
      G.ctrlIdx = othIdx;
      me = oth;
    }
    if (!me) return;

    if (me.tackleCd <= 0) {
      const inp = activeInputVec();
      const distBall = hypot(tx - me.x, tz - me.z);
      const angToBall = Math.atan2(tz - me.z, tx - me.x);
      // Mira assistita verso il pallone quando si è a distanza di contrasto
      const ang = (distBall < 4.4 || (!inp.x && !inp.z)) ? angToBall : Math.atan2(inp.z, inp.x);
      me.facing = ang;
      me.vx = Math.cos(ang) * (me.speed * 1.85);
      me.vz = Math.sin(ang) * (me.speed * 1.85);
      me.tackleT = 0.32;
      me.tackleCd = 0.38;
      me.actPulse = 0.4;
      spawnSparks(me.x, 0.18, me.z, 0x34d399);
      sfx("kick");
    } else {
      me.actPulse = 0.22;
    }

    // Controllo recupero immediato sul tocco del pulsante
    if (hypot(me.x - tx, me.z - tz) <= 1.7 && b.y < 1.85) {
      if (b.owner && b.owner.side === "o") {
        // contrasto non garantito: 50%, più facile se l'avversario è rallentato o ti dà le spalle
        const back = Math.cos(b.owner.facing - Math.atan2(b.owner.z - me.z, b.owner.x - me.x)) > 0.3;
        const chance = 0.42 + (b.owner.slowT > 0 ? 0.25 : 0) + (back ? 0.15 : 0);
        if (Math.random() > chance) {
          me.slowT = Math.max(me.slowT || 0, 0.35);
          b.owner.actPulse = 0.3;
          showBanner("🧱 Contrasto fallito!", "Scegli meglio il momento", me.id, 0.8);
          sfx("kick");
          return;
        }
        b.owner.slowT = Math.max(b.owner.slowT, 0.55);
      }
      G.noShootUntil = performance.now() + 700;
      b.owner = me;
      b.lastSide = "m";
      b.lastActor = me;
      b.superFx = null;
      b.wallBounced = false;
      b.pickupLock = 0.38;
      G.superPct = Math.min(100, G.superPct + 12);
      spawnSparks(tx, 0.42, tz, 0xffd23f);
      spawnShock(tx, tz, 0x34d399);
      showBanner("🛡️ PALLA RECUPERATA!", `${me.name} vince il contrasto!`, me.id, 1.05);
      sfx("kick");
      updateHud();
    }
  }

  // Tiro caricabile: tieni premuto Tira, rilascia per sparare (0..1 = potenza e precisione)
  function chargeUi(pct) {
    const btn = OV && OV.querySelector(".g3dAct.shoot");
    if (btn) btn.style.setProperty("--chg", pct + "%");
    const sub = OV && OV.querySelector("#g3dShootSub");
    if (sub) sub.textContent = pct > 0 ? (pct >= 95 ? "PERFETTO! rilascia" : "Carico " + pct + "%") : "Botta in porta";
  }
  function startCharge() {
    if (!G || G.over || G.paused) return false;
    if (G.chg >= 0) return true;
    const o = G.ball.owner;
    if (!o || o.side !== "m" || o.isGk) return false;
    if (G.noShootUntil && performance.now() < G.noShootUntil) return false;
    G.chg = 0;
    return true;
  }
  function releaseCharge() {
    if (!G || !(G.chg >= 0)) return;
    const pw = Math.min(1, G.chg / 0.9);
    G.chg = -1;
    chargeUi(0);
    if (G.over || G.paused) return;
    doShootOrTackle(pw);
  }

  function doShootOrTackle(power) {
    if (!G || G.over) return;
    if (G.noShootUntil && performance.now() < G.noShootUntil && G.ball.owner && G.ball.owner.side === "m") return; // niente tiro a catena dopo recupero
    const shooter = claimBallForMyAction(1.5);
    if (shooter) {
      const inp = activeInputVec();
      const defaultCorner = shooter.z >= 0 ? -GW * 0.28 : GW * 0.28;
      let aimZ = inp.z ? clamp(inp.z * (GW * 0.42), -GW * 0.42, GW * 0.42) : defaultCorner;
      const charged = typeof power === "number";
      const perfect = charged && power >= 0.95;
      if (charged) aimZ += (Math.random() - 0.5) * 2 * (1 - power) * GW * 0.45;
      const dx = HX - shooter.x;
      const dz = aimZ - shooter.z;
      const d = hypot(dx, dz) || 1;
      const spd = shooter.shotPow * (charged ? 0.82 + 0.42 * power + (perfect ? 0.06 : 0) : 1);
      shooter.facing = Math.atan2(dz, dx);
      if (perfect) { showBanner("🎯 TIRO PERFETTO!", `${shooter.name} carica al punto giusto`, shooter.id, 0.9); G.camShake = Math.max(G.camShake, 0.22); }
      releaseBall(shooter, (dx / d) * spd, (charged ? 1.6 + power * 1.2 : 2.1) + Math.random() * 0.8, (dz / d) * spd, null, 0, perfect ? 0xffd23f : 0xfb7185);
      spawnSparks(shooter.x + 0.3, 0.36, shooter.z, 0xfb7185);
      spawnShock(shooter.x, shooter.z, 0xfb7185);
      G.superPct = Math.min(100, G.superPct + 12);
      sfx("kick");
      updateHud();
    } else {
      doTackle();
    }
  }

  function doSuperShot() {
    if (!G || G.over) return;
    if (G.superPct < 100) {
      const sb = OV && OV.querySelector("#g3dSuperBtn");
      if (sb) {
        sb.classList.add("deny");
        setTimeout(() => sb.classList.remove("deny"), 240);
      }
      showBanner(`⚡ Super al ${Math.round(G.superPct)}%`, "Carica al 100% con passaggi, contrasti e sponde (+24%)!", null, 1.05);
      return;
    }
    const b = G.ball;
    let shooter = claimBallForMyAction(2.35);
    if (!shooter && b.owner && b.owner.side === "o") {
      const me = G.myTeam[G.ctrlIdx];
      if (me && hypot(me.x - b.owner.x, me.z - b.owner.z) <= 2.4) {
        b.owner.slowT = 0.8;
        b.owner = me;
        shooter = me;
      }
    }
    if (!shooter) {
      doTackle();
      showBanner("⚡ Super Pronta!", "Avvicinati alla palla per scatenare il Super-Tiro!", null, 1.15);
      return;
    }
    G.superPct = 0;
    const sup = SUP() ? SUP().of(shooter.id) : { fx: "fire", name: "Tiro di Fuoco", col: "#ffd23f" };
    const colHex = parseInt(String(sup.col || "#ffd23f").replace("#", ""), 16) || 0xffd23f;
    const comboBonus = G.sq.combo ? 1.14 : 1.0;
    const inp = activeInputVec();
    const aimZ = clamp((inp.z || (shooter.z > 0 ? -0.6 : 0.6)) * (GW * 0.4), -GW * 0.41, GW * 0.41);
    const dx = HX - shooter.x;
    const dz = aimZ - shooter.z;
    const d = hypot(dx, dz) || 1;
    const spd = (shooter.shotPow + 6.5) * comboBonus;

    shooter.facing = Math.atan2(dz, dx);
    releaseBall(shooter, (dx / d) * spd, 2.7, (dz / d) * spd, sup.fx, colHex, colHex);
    spawnSparks(shooter.x, 0.7, shooter.z, colHex);
    spawnShock(shooter.x, shooter.z, colHex);
    G.camShake = 0.26;
    if (sup.fx === "ice") {
      G.oppTeam.forEach((foe) => { if (!foe.isGk) foe.slowT = 2.0; });
    }
    sfx("super");
    const subTxt = G.sq.combo ? `⚡ Super Combinata · «${G.sq.combo.title}»!` : `Super della saga · ${shooter.name}`;
    showBanner(`⚡ ${sup.name.toUpperCase()}!`, subTxt, shooter.id, 1.9);
    updateHud();
  }

  function kickoff(concededSide) {
    if (!G) return;
    const b = G.ball;
    G.all.forEach((p) => {
      p.x = p.homeX;
      p.z = p.homeZ;
      p.vx = 0;
      p.vz = 0;
      p.tackleT = 0;
      p.tackleCd = 0;
      p.diveT = 0;
      p.slowT = 0;
      p.actPulse = 0;
    });
    const fwd = (team, sgn) => team.filter((q) => !q.isGk).sort((a, c) => sgn * (c.homeX - a.homeX))[0];
    const starter = concededSide === "o" ? fwd(G.oppTeam, -1) : fwd(G.myTeam, 1);
    starter.x = concededSide === "o" ? 0.8 : -0.8;
    starter.z = 0;
    starter.facing = concededSide === "o" ? Math.PI : 0;
    b.x = starter.x + (concededSide === "o" ? -0.45 : 0.45);
    b.y = b.r;
    b.z = 0;
    b.vx = 0;
    b.vy = 0;
    b.vz = 0;
    b.owner = starter;
    b.lastSide = starter.side;
    b.lastActor = starter;
    b.superFx = null;
    b.wallBounced = false;
    b.pickupLock = 0.32;
    G.ctrlIdx = Math.max(1, G.myTeam.indexOf(fwd(G.myTeam, 1)));
  }

  function onGoalScored(scoringSide) {
    if (!G || G.over) return;
    const b = G.ball;
    if (scoringSide === "m") {
      G.score[0]++;
      G.superPct = Math.min(100, G.superPct + 15);
      if (G.goalRight) G.goalRight.pulse = 1;
      G.camShake = 0.38;
      sfx("goal");
      spawnSparks(HX - 0.3, 1.2, b.z, 0xffd23f);
      spawnShock(HX - 0.25, b.z, 0xffd23f);
      showBanner("⚽ GOOOL DEI SOGNI!", `${G.score[0]} – ${G.score[1]} · Gabbia in delirio!`, G.myTeam[G.ctrlIdx].id, 1.8);
    } else {
      G.score[1]++;
      G.superPct = Math.min(100, G.superPct + 25);
      if (G.goalLeft) G.goalLeft.pulse = 1;
      G.camShake = 0.32;
      sfx("kick");
      spawnSparks(-HX + 0.3, 1.2, b.z, 0xfb7185);
      spawnShock(-HX + 0.25, b.z, 0xfb7185);
      showBanner(`⚽ Gol di ${G.opp.name}`, `${G.score[0]} – ${G.score[1]} · Riparti subito!`, null, 1.6);
    }
    updateHud();

    if (G.goldenGoal || G.score[0] >= G.winGoals || G.score[1] >= G.winGoals) {
      finishMatch();
      return;
    }
    G.goalFreeze = FAST ? 0.05 : 1.05;
    kickoff(scoringSide === "m" ? "o" : "m");
  }

  function stepActorAI(p, dt) {
    const b = G.ball;
    const dir = p.side === "m" ? 1 : -1;
    const goalX = -dir * (HX - 0.82);

    if (p.isGk) {
      // Portiere intelligente sulla linea di porta
      const threat = (dir > 0 && b.x < 2) || (dir < 0 && b.x > -2);
      const targetZ = threat ? clamp(b.z * 0.82, -GW * 0.42, GW * 0.42) : clamp(b.z * 0.35, -1.2, 1.2);
      const dz = targetZ - p.z;
      const dx = goalX - p.x;
      const spd = p.speed * (p.diveT > 0 ? 1.5 : 1.0);
      p.vx = clamp(dx * 5, -spd, spd);
      p.vz = clamp(dz * 6.2, -spd, spd);
      p.facing = dir > 0 ? 0 : Math.PI;

      // Rinvio immediato se il portiere blocca il pallone
      if (b.owner === p) {
        const mates = (p.side === "m" ? G.myTeam : G.oppTeam).filter((m) => !m.isGk);
        const mate = mates[0];
        const tx = mate ? mate.x + dir * 1.5 : dir * 3;
        const tz = mate ? mate.z : (Math.random() - 0.5) * 4;
        const ddx = tx - p.x, ddz = tz - p.z, dd = hypot(ddx, ddz) || 1;
        releaseBall(p, (ddx / dd) * 13.5, 1.2, (ddz / dd) * 13.5, null, 0);
        if (p.side === "m" && mate) G.ctrlIdx = G.myTeam.indexOf(mate);
        sfx("pass");
      }
      return;
    }

    if (G.n === 7) {
      // 7v7: tutti tengono la posizione di ruolo; il più vicino alla palla pressa se non l'abbiamo
      const mine = p.side === "m";
      const team = (mine ? G.myTeam : G.oppTeam).filter((q) => !q.isGk && (!mine || q !== G.myTeam[G.ctrlIdx]));
      const weHave = b.owner && b.owner.side === (mine ? "m" : "o");
      let chaser = null, bd = 1e9;
      team.forEach((q) => { const dd = hypot(q.x - b.x, q.z - b.z); if (dd < bd) { bd = dd; chaser = q; } });
      if (b.owner === p) {
        const gx = mine ? HX : -HX, sd = mine ? 1 : -1;
        const distGoal = hypot(gx - p.x, p.z);
        if (!mine && distGoal < PW * 0.4 && (sd * (p.x - gx) > -PW * 0.4) && Math.random() < dt * 1.6 + (distGoal < 8 ? 0.05 : 0)) {
          const aimZ = clamp((Math.random() - 0.5) * GW * 0.78, -GW * 0.4, GW * 0.4);
          const dx = gx - p.x, dz = aimZ - p.z, d = hypot(dx, dz) || 1;
          p.facing = Math.atan2(dz, dx);
          releaseBall(p, (dx / d) * p.shotPow * 0.94, 1.9, (dz / d) * p.shotPow * 0.94, null, 0);
          sfx("kick");
          return;
        }
        // portatore IA avversario: conduce, a volte appoggia a un compagno più avanzato
        if (!mine && p.tackleCd <= 0 && Math.random() < dt * 0.55) {
          const opts2 = G.oppTeam.filter((q) => q !== p && !q.isGk && q.x < p.x - 2 && hypot(q.x - p.x, q.z - p.z) < 13);
          const t = opts2[Math.floor(Math.random() * opts2.length)];
          if (t) {
            const dx = t.x - 1 - p.x, dz = t.z - p.z, d = hypot(dx, dz) || 1;
            p.facing = Math.atan2(dz, dx);
            releaseBall(p, (dx / d) * 13.5, 0.6, (dz / d) * 13.5, null, 0);
            sfx("pass");
            return;
          }
        }
        const tz = p.z > 0 ? 2.2 : -2.2;
        const dx = (gx - sd * 2.5) - p.x, dz = tz - p.z, d = hypot(dx, dz) || 1;
        p.vx = (dx / d) * p.speed * 0.9; p.vz = (dz / d) * p.speed * 0.9; p.facing = Math.atan2(dz, dx);
        return;
      }
      let tx, tz;
      if (p === chaser && !weHave) {
        tx = b.owner ? b.owner.x : b.x; tz = b.owner ? b.owner.z : b.z;
        if (!mine && b.owner && b.owner.side === "m" && bd < 1.3 && p.tackleCd <= 0 && Math.random() < dt * 2.2) { p.tackleT = 0.2; p.tackleCd = 1.45; }
      } else {
        const push = weHave ? 3.2 : 0;
        tx = clamp(p.homeX + (b.x * 0.42) + (mine ? push : -push), -HX + 2, HX - 2);
        tz = p.homeZ * 0.8 + b.z * 0.3;
        if (weHave && p === chaser) { tx = clamp(b.x + (mine ? 3 : -3), -HX + 2, HX - 2); tz = b.z >= 0 ? -3 : 3; }
      }
      const dx = tx - p.x, dz = tz - p.z, d = hypot(dx, dz);
      if (d > 0.5) { p.vx = (dx / d) * p.speed * (p === chaser ? 0.92 : 0.78); p.vz = (dz / d) * p.speed * (p === chaser ? 0.92 : 0.78); p.facing = Math.atan2(dz, dx); }
      else { p.vx *= 0.7; p.vz *= 0.7; }
      return;
    }

    if (p.side === "m") {
      // Compagno IA non controllato: supporta l'attacco o copre dietro
      const mate = G.myTeam[G.ctrlIdx];
      const weHave = b.owner && b.owner.side === "m";
      const tx = weHave ? clamp(mate.x + 2.8, -4, HX - 2.6) : clamp(b.x * 0.55 - 2.2, -HX + 2.4, 3.5);
      const tz = mate.z >= 0 ? -3.1 : 3.1;
      const dx = tx - p.x, dz = tz - p.z, d = hypot(dx, dz);
      if (d > 0.35) {
        p.vx = (dx / d) * p.speed * 0.88;
        p.vz = (dz / d) * p.speed * 0.88;
        p.facing = Math.atan2(dz, dx);
      } else {
        p.vx *= 0.7;
        p.vz *= 0.7;
      }
      return;
    }

    // Avversario IA (side === "o", attacca verso -HX)
    const oppField = [G.oppTeam[1], G.oppTeam[2]];
    const chaser = hypot(oppField[0].x - b.x, oppField[0].z - b.z) <= hypot(oppField[1].x - b.x, oppField[1].z - b.z) ? oppField[0] : oppField[1];

    if (b.owner === p) {
      const distGoal = hypot(-HX - p.x, p.z);
      if (distGoal < 9.2 && (p.x < -1.5 || Math.random() < 0.04)) {
        const aimZ = clamp((Math.random() - 0.5) * GW * 0.78, -GW * 0.4, GW * 0.4);
        const dx = -HX - p.x, dz = aimZ - p.z, d = hypot(dx, dz) || 1;
        p.facing = Math.atan2(dz, dx);
        releaseBall(p, (dx / d) * p.shotPow * 0.94, 1.9, (dz / d) * p.shotPow * 0.94, null, 0);
        sfx("kick");
        return;
      }
      const tx = -HX + 2.5;
      const tz = p.z > 0 ? 1.8 : -1.8;
      const dx = tx - p.x, dz = tz - p.z, d = hypot(dx, dz) || 1;
      p.vx = (dx / d) * p.speed * 0.9;
      p.vz = (dz / d) * p.speed * 0.9;
      p.facing = Math.atan2(dz, dx);
    } else if (p === chaser) {
      const tx = b.owner ? b.owner.x : b.x;
      const tz = b.owner ? b.owner.z : b.z;
      const dx = tx - p.x, dz = tz - p.z, d = hypot(dx, dz) || 1;
      p.vx = (dx / d) * p.speed * 0.92;
      p.vz = (dz / d) * p.speed * 0.92;
      p.facing = Math.atan2(dz, dx);
      if (b.owner && b.owner.side === "m" && d < 1.3 && p.tackleCd <= 0 && Math.random() < dt * 2.2) {
        p.tackleT = 0.2;
        p.tackleCd = 1.45;
      }
    } else {
      const tx = b.x < 0 ? -1.5 : 3.8;
      const tz = chaser.z >= 0 ? -2.8 : 2.8;
      const dx = tx - p.x, dz = tz - p.z, d = hypot(dx, dz);
      if (d > 0.4) {
        p.vx = (dx / d) * p.speed * 0.8;
        p.vz = (dz / d) * p.speed * 0.8;
        p.facing = Math.atan2(dz, dx);
      } else {
        p.vx *= 0.75;
        p.vz *= 0.75;
      }
    }
  }

  function stepSim(dt) {
    if (!G || G.over) return;

    G.animTime += dt;
    if (G.camShake > 0) G.camShake = Math.max(0, G.camShake - dt * 1.65);

    if (G.bannerTimer > 0) {
      G.bannerTimer -= dt;
      if (G.bannerTimer <= 0 && OV) {
        const bEl = OV.querySelector("#g3dBanner");
        if (bEl) bEl.hidden = true;
      }
    }
    if (G.wallFlash > 0) {
      G.wallFlash = Math.max(0, G.wallFlash - dt * 3);
      G.railMat.emissiveIntensity = 0.8 + G.wallFlash * 1.15;
      if (G.glassMat) G.glassMat.emissiveIntensity = 0.28 + G.wallFlash * 0.65;
    }
    [G.goalLeft, G.goalRight].forEach((glObj) => {
      if (glObj && glObj.pulse > 0) {
        glObj.pulse = Math.max(0, glObj.pulse - dt * 1.12);
        const bulge = 1 + Math.sin(glObj.pulse * Math.PI * 4) * 0.26 * glObj.pulse;
        glObj.netRig.scale.set(bulge, 1 + glObj.pulse * 0.04, 1 + glObj.pulse * 0.05);
        glObj.ledMat.emissiveIntensity = 0.72 + glObj.pulse * 2.4;
        glObj.padMat.opacity = 0.16 + glObj.pulse * 0.42;
      }
    });
    if (G.shockLife > 0) {
      G.shockLife = Math.max(0, G.shockLife - dt);
      const prog = 1 - G.shockLife / 0.42;
      G.shockRing.scale.setScalar(0.55 + prog * 3.4);
      G.shockMat.opacity = (1 - prog) * 0.85;
      if (G.shockLife <= 0) G.shockRing.visible = false;
    }
    G.trailPool.forEach((tr) => {
      if (tr.life > 0) {
        tr.life -= dt;
        if (tr.life <= 0) {
          tr.m.visible = false;
        } else {
          const ratio = tr.life / tr.maxLife;
          tr.m.scale.setScalar(0.35 + ratio * 0.75);
          tr.mat.opacity = ratio * 0.56;
        }
      }
    });
    G.sparkPool.forEach((sp) => {
      if (sp.life > 0) {
        sp.life -= dt;
        sp.m.position.x += sp.vx * dt;
        sp.m.position.y = Math.max(0.05, sp.m.position.y + sp.vy * dt);
        sp.m.position.z += sp.vz * dt;
        sp.vy -= 9.8 * dt;
        if (sp.life <= 0) sp.m.visible = false;
      }
    });

    if (G.goalFreeze > 0) {
      G.goalFreeze -= dt;
      return;
    }

    // Timer partita + Golden Goal in caso di parità allo scadere
    if (!G.goldenGoal) {
      G.timeLeft = Math.max(0, G.timeLeft - dt);
      if (G.timeLeft <= 0) {
        if (G.score[0] !== G.score[1]) {
          finishMatch();
          return;
        }
        G.goldenGoal = true;
        showBanner("⚡ GOLDEN GOAL!", "Parità allo scadere: chi segna il prossimo gol vince!", null, 2.2);
      }
    }

    // Se un giocatore utente prende palla, passa automaticamente il controllo a lui (se di movimento)
    if (G.ball.owner && G.ball.owner.side === "m" && !G.ball.owner.isGk) {
      const idx = G.myTeam.indexOf(G.ball.owner);
      if (idx > 0) G.ctrlIdx = idx;
    }

    if (G.chg >= 0) {
      const ow = G.ball.owner;
      if (!ow || ow.side !== "m") { G.chg = -1; chargeUi(0); }
      else {
        G.chg += dt;
        chargeUi(Math.round(Math.min(1, G.chg / 0.9) * 100));
        if (G.chg > 1.7) releaseCharge();
      }
    }
    if (G.n === 7) {
      G.swCd = Math.max(0, (G.swCd || 0) - dt);
      const cur0 = G.myTeam[G.ctrlIdx];
      if (G.swCd <= 0 && !(G.ball.owner && G.ball.owner.side === "m") && cur0) {
        const dCur = hypot(cur0.x - G.ball.x, cur0.z - G.ball.z);
        let bi = -1, bd = dCur - 3;
        G.myTeam.forEach((q, i) => { if (i && q !== cur0) { const dd = hypot(q.x - G.ball.x, q.z - G.ball.z); if (dd < bd) { bd = dd; bi = i; } } });
        if (bi > 0) { G.ctrlIdx = bi; G.swCd = 0.7; }
      }
    }
    const me = G.myTeam[G.ctrlIdx];
    const inp = activeInputVec();

    G.all.forEach((p) => {
      if (p.tackleCd > 0) p.tackleCd = Math.max(0, p.tackleCd - dt);
      if (p.stealCd > 0) p.stealCd = Math.max(0, p.stealCd - dt);
      if (p.tackleT > 0) p.tackleT = Math.max(0, p.tackleT - dt);
      if (p.kickT > 0) p.kickT = Math.max(0, p.kickT - dt);
      if (p.diveT > 0) p.diveT = Math.max(0, p.diveT - dt);
      if (p.slowT > 0) p.slowT = Math.max(0, p.slowT - dt);
      if (p.actPulse > 0) p.actPulse = Math.max(0, p.actPulse - dt);

      const slowMul = p.slowT > 0 ? 0.52 : 1.0;

      if (p === me) {
        if (p.tackleT <= 0) {
          if (inp.x || inp.z) {
            const carryMul = G.ball.owner === p ? 0.94 : 1.0;
            p.vx = inp.x * p.speed * carryMul * slowMul;
            p.vz = inp.z * p.speed * carryMul * slowMul;
            p.facing = Math.atan2(inp.z, inp.x);
          } else {
            p.vx *= 0.65;
            p.vz *= 0.65;
          }
        }
      } else {
        if (p.tackleT <= 0) stepActorAI(p, dt);
        p.vx *= slowMul;
        p.vz *= slowMul;
      }

      p.x = clamp(p.x + p.vx * dt, p.isGk ? p.homeX - 1.1 : -HX + 0.65, p.isGk ? p.homeX + 1.1 : HX - 0.65);
      p.z = clamp(p.z + p.vz * dt, p.isGk ? -GW * 0.48 : -HZ + 0.65, p.isGk ? GW * 0.48 : HZ - 0.65);

      const vMag = hypot(p.vx, p.vz);
      if (vMag > 0.35) p.phase += vMag * dt * 2.2;
    });

    // Fisica del pallone, Super traiettorie e rimbalzi di Sponda
    const b = G.ball;
    if (b.pickupLock > 0) b.pickupLock = Math.max(0, b.pickupLock - dt);

    if (b.owner) {
      const o = b.owner;
      b.x = clamp(o.x + Math.cos(o.facing) * 0.52, -HX + b.r, HX - b.r);
      b.z = clamp(o.z + Math.sin(o.facing) * 0.52, -HZ + b.r, HZ - b.r);
      b.y = b.r + Math.abs(Math.sin(o.phase)) * 0.06;
      b.vx = o.vx;
      b.vz = o.vz;
      b.vy = 0;

      // Contrasti avversari / scivolate per rubare palla
      G.all.forEach((other) => {
        if (other.side === o.side || b.pickupLock > 0 || other.slowT > 0) return;
        const dist = hypot(other.x - o.x, other.z - o.z);
        const stealR = other.side === "m"
          ? (other.tackleT > 0 ? Math.max(1.85, other.reach * 1.65) : other.reach * 0.9)
          : (other.tackleT > 0 ? other.reach * 1.05 : 0.5);
        if (dist < stealR && other.side === "o") {
          // i rivali non rubano a ogni contatto: pausa tra i tentativi e riuscita parziale
          if (other.stealCd > 0) return;
          other.stealCd = 1.1;
          if (Math.random() > 0.42) { other.actPulse = 0.22; return; }
        }
        if (dist < stealR) {
          o.slowT = Math.max(o.slowT, 0.5);
          b.owner = other;
          b.lastSide = other.side;
          b.lastActor = other;
          b.pickupLock = 0.35;
          b.wallBounced = false;
          if (other.side === "m") {
            G.superPct = Math.min(100, G.superPct + 12);
            other.actPulse = 0.38;
            spawnSparks(o.x, 0.38, o.z, 0xffd23f);
            if (!other.isGk) G.ctrlIdx = G.myTeam.indexOf(other);
          }
          sfx("kick");
        }
      });
    } else {
      // Effetti speciali dei 9 Super tiri
      if (b.superFx) {
        b.superAge += dt;
        const dirS = b.vx >= 0 ? 1 : -1;
        if (b.superFx === "curve") b.vz += -Math.sign(b.z || 1) * 9.5 * dt;
        else if (b.superFx === "zig") b.vz = Math.cos(b.superAge * 18) * 7.2;
        else if (b.superFx === "spiral") { b.vz += Math.cos(b.superAge * 20) * 11 * dt; b.vy += Math.sin(b.superAge * 20) * 5 * dt; }
        else if (b.superFx === "change" && b.superAge > 0.18 && b.superAge < 0.38) b.vx += dirS * 18 * dt;
        else if (b.superFx === "thunder") b.vx += dirS * 6 * dt;
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;

      if (b.y > b.r) {
        b.vy -= 12.5 * dt;
      } else {
        b.y = b.r;
        if (b.vy < -1.2) b.vy = -b.vy * 0.48;
        else b.vy = 0;
        const drag = Math.pow(0.55, dt);
        b.vx *= drag;
        b.vz *= drag;
        if (hypot(b.vx, b.vz) < 2.2) b.superFx = null;
      }

      // Scia luminosa dinamica sui passaggi rapidi, tiri, sponde e Super
      const flatSpd = hypot(b.vx, b.vz);
      if (flatSpd > 8.8 || b.superFx) {
        G.trailTick -= dt;
        if (G.trailTick <= 0) {
          G.trailTick = 0.025;
          const tr = G.trailPool[G.trailCursor];
          G.trailCursor = (G.trailCursor + 1) % G.trailPool.length;
          tr.m.position.set(b.x, b.y, b.z);
          tr.mat.color.setHex(b.superFx ? b.superCol : (b.wallBounced ? 0xffd23f : (b.trailCol || 0x38bdf8)));
          tr.maxLife = b.superFx ? 0.3 : 0.2;
          tr.life = tr.maxLife;
          tr.m.scale.setScalar(b.superFx ? 1.15 : 0.9);
          tr.mat.opacity = 0.6;
          tr.m.visible = true;
        }
      }

      // Rimbalzo sulle sponde laterali (Nord/Sud)
      if (b.z < -HZ + b.r) {
        b.z = -HZ + b.r;
        b.vz = Math.abs(b.vz) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        spawnSparks(b.x, b.y, -HZ + 0.1, G.ar.rail);
        spawnShock(b.x, -HZ + 0.25, G.ar.rail);
        sfx("wall");
      } else if (b.z > HZ - b.r) {
        b.z = HZ - b.r;
        b.vz = -Math.abs(b.vz) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        spawnSparks(b.x, b.y, HZ - 0.1, G.ar.rail);
        spawnShock(b.x, HZ - 0.25, G.ar.rail);
        sfx("wall");
      }

      // Controllo Gol o rimbalzo su pali/traversa/sponde di fondo
      const inGoalMouth = Math.abs(b.z) < GW / 2 - b.r * 0.4 && b.y < GH;
      if (b.x > HX - b.r) {
        if (inGoalMouth) {
          onGoalScored("m");
          return;
        }
        const hitWoodwork = Math.abs(b.z) < GW / 2 + 0.35 && b.y < GH + 0.35;
        b.x = HX - b.r;
        b.vx = -Math.abs(b.vx) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        if (hitWoodwork) G.camShake = 0.22;
        spawnSparks(HX - 0.1, b.y, b.z, hitWoodwork ? 0xffffff : G.ar.rail);
        spawnShock(HX - 0.2, b.z, hitWoodwork ? 0xffffff : G.ar.rail);
        sfx("wall");
      } else if (b.x < -HX + b.r) {
        if (inGoalMouth) {
          onGoalScored("o");
          return;
        }
        const hitWoodwork = Math.abs(b.z) < GW / 2 + 0.35 && b.y < GH + 0.35;
        b.x = -HX + b.r;
        b.vx = Math.abs(b.vx) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        if (hitWoodwork) G.camShake = 0.22;
        spawnSparks(-HX + 0.1, b.y, b.z, hitWoodwork ? 0xffffff : G.ar.rail);
        spawnShock(-HX + 0.2, b.z, hitWoodwork ? 0xffffff : G.ar.rail);
        sfx("wall");
      }

      // Intercetto / Parata / Raccolta pallone libero (i compagni ricevono subito i passaggi ravvicinati!)
      for (let i = 0; i < G.all.length; i++) {
        const p = G.all[i];
        if (b.pickupLock > 0) {
          const earlyReceive = p.side === b.lastSide && !b.superFx && ((p !== b.lastActor && b.pickupLock < 0.19) || b.wallBounced);
          if (!earlyReceive) continue;
        }
        const d = hypot(p.x - b.x, p.z - b.z);
        if (d < p.reach && b.y < (p.isGk ? 2.15 : 1.65)) {
          const fastSuper = !!b.superFx && p.side !== b.lastSide;
          if (fastSuper && b.superFx === "drill" && !p.isGk) {
            // Trapano buca i difensori di movimento
            continue;
          }
          if (fastSuper && p.isGk && Math.random() < 0.68) {
            // I Super tiri piegano spesso le mani al portiere!
            p.diveT = 0.35;
            continue;
          }
          if (p.side === "m" && b.wallBounced && b.lastSide === "m") {
            G.superPct = Math.min(100, G.superPct + 24);
            showBanner("⚡ UNO-DUE DI SPONDA!", "+24% Energia Super · Grande intesa!", p.id, 1.35);
            sfx("wall");
          }
          b.owner = p;
          b.lastSide = p.side;
          b.lastActor = p;
          b.superFx = null;
          b.wallBounced = false;
          b.pickupLock = 0.2;
          if (p.isGk) p.diveT = 0.3;
          if (p.side === "m" && !p.isGk) G.ctrlIdx = G.myTeam.indexOf(p);
          break;
        }
      }
    }

    updateHud();
  }

  function setTxt(el, val) {
    if (el && el.textContent !== val) el.textContent = val;
  }

  function updateHud() {
    if (!OV || !G) return;
    const sc = OV.querySelector("#g3dScore");
    const cl = OV.querySelector("#g3dClock");
    const nm = OV.querySelector("#g3dActiveNm");
    const sf = OV.querySelector("#g3dSuperFill");
    const sp = OV.querySelector("#g3dSuperPct");
    const sb = OV.querySelector("#g3dSuperBtn");
    const ss = OV.querySelector("#g3dSuperSub");
    const ps = OV.querySelector("#g3dPassSub");
    const shs = OV.querySelector("#g3dShootSub");
    const tks = OV.querySelector("#g3dTackleSub");
    const tkb = OV.querySelector("#g3dTackleBtn");

    setTxt(sc, `${G.score[0]} – ${G.score[1]}`);
    if (cl) {
      if (G.goldenGoal) {
        setTxt(cl, "⚡ GOLDEN GOAL");
        if (cl.className !== "gg") cl.className = "gg";
      } else {
        const sec = Math.ceil(G.timeLeft);
        const m = Math.floor(sec / 60);
        const s = String(sec % 60).padStart(2, "0");
        setTxt(cl, `${m}:${s}`);
        if (cl.className !== "") cl.className = "";
      }
    }
    const cur = G.myTeam[G.ctrlIdx];
    if (nm && cur) setTxt(nm, `· ${String(cur.name).split(/[ ,]/)[0]}`);

    const weHave = !!(G.ball.owner && G.ball.owner.side === "m");
    setTxt(ps, weHave ? "Uno-due / Sponda" : "Cambia / Pressa");
    setTxt(shs, weHave ? "Botta in porta!" : "Tiro di prima");
    setTxt(tks, weHave ? "Scatto palla" : "Scivolata ruba!");
    if (tkb) tkb.classList.toggle("defFocus", !weHave);

    const pct = Math.round(G.superPct);
    if (sf) {
      const wStr = `${pct}%`;
      if (sf.style.width !== wStr) sf.style.width = wStr;
      sf.classList.toggle("ready", pct >= 100);
    }
    setTxt(sp, `${pct}%`);
    if (sb) sb.classList.toggle("ready", pct >= 100);
    if (ss && cur) {
      const sup = SUP() ? SUP().of(cur.id) : { name: "Super Tiro" };
      setTxt(ss, pct >= 100 ? `PRONTA · ${sup.name}` : `Carica ${pct}% · Sponde`);
    }
  }

  function render3D() {
    if (!G || G.dead) return;
    const b = G.ball;
    const tNow = G.animTime || 0;

    // Aggiorna pose 3D di tutti gli atleti + cursore oro sul campione attivo
    G.all.forEach((p) => {
      const m = p.mesh;
      m.grp.position.set(p.x, 0, p.z);
      m.grp.rotation.y = -p.facing + Math.PI / 2;

      const v = hypot(p.vx, p.vz);
      const sw = v > 0.25 ? Math.sin(p.phase) * 0.55 : 0;
      m.legL.rotation.x = sw;
      m.legR.rotation.x = -sw + (p.kickT > 0 ? -0.95 : 0);
      m.armL.rotation.x = -sw * 0.7;
      m.armR.rotation.x = sw * 0.7;
      m.bodyRoot.position.y = v > 0.25 ? Math.abs(Math.cos(p.phase)) * 0.05 : 0;
      m.bodyRoot.rotation.x = p.tackleT > 0 ? 0.56 : 0;
      m.bodyRoot.rotation.z = p.diveT > 0 ? 0.65 : 0;

      const isCtrl = p.side === "m" && G.myTeam[G.ctrlIdx] === p;
      const hasBall = b.owner === p;
      const pulse = p.actPulse > 0 ? p.actPulse * 1.45 : 0;
      m.ringMat.color.setHex(p.actPulse > 0 ? 0xffffff : hasBall && p.side === "m" ? 0x34d399 : isCtrl ? 0xffd23f : p.side === "m" ? 0x38bdf8 : 0xfb7185);
      m.ring.scale.setScalar((isCtrl ? 1.18 : 0.92) + pulse);

      if (m.ctrlCone) {
        m.ctrlCone.visible = isCtrl;
        if (isCtrl) {
          m.ctrlCone.position.y = 2.08 + Math.sin(tNow * 5.2) * 0.075;
          m.ctrlCone.rotation.y = tNow * 2.5;
        }
      }
    });

    // Animazione pubblico sugli spalti e dettagli scenografici (bracieri / faro)
    if (G.arenaProps) {
      const hype = G.goalFreeze > 0 ? 3.2 : 1.0;
      G.arenaProps.crowd.forEach((fn) => {
        fn.grp.position.y = fn.baseY + Math.abs(Math.sin(tNow * 3.4 * hype + fn.phase)) * (G.goalFreeze > 0 ? 0.16 : 0.045);
      });
      G.arenaProps.flames.forEach((fl) => {
        const s = 0.88 + Math.sin(tNow * 11 + fl.phase) * 0.16;
        fl.m.scale.set(s, 0.85 + Math.cos(tNow * 13 + fl.phase) * 0.2, s);
      });
      if (G.arenaProps.beacon) {
        G.arenaProps.beacon.rotation.y = tNow * 1.4;
      }
    }

    // Pallone (con effetto sparizione intermittente per Super "vanish")
    const vanishHide = b.superFx === "vanish" && Math.sin(b.superAge * 28) > 0.2;
    G.ballMesh.visible = !vanishHide;
    G.ballMesh.position.set(b.x, b.y, b.z);
    G.ballMesh.rotation.z -= b.vx * 0.05;
    G.ballMesh.rotation.x += b.vz * 0.05;
    G.ballShadow.position.set(b.x, 0.016, b.z);
    const shScale = clamp(1 - (b.y - b.r) * 0.18, 0.45, 1);
    G.ballShadow.scale.setScalar(shScale);

    if (b.superFx) {
      G.superAura.position.set(b.x, b.y, b.z);
      G.superAura.lookAt(G.camera.position);
      G.superAuraMat.color.setHex(b.superCol);
      G.superAuraMat.opacity = 0.88;
    } else {
      G.superAuraMat.opacity = 0;
    }

    // Telecamera dinamica (Tribuna ampia con entrambe le porte 3D ben inquadrate fin dal calcio d'inizio, o Terza Persona immersiva)
    const me = G.myTeam[G.ctrlIdx];
    if (G.camMode === "terza" && me) {
      _vTarget.set(clamp(me.x - 6.0, -HX - 5.2, HX - 4.8), 4.5 * (FK > 1 ? 1.15 : 1), clamp(me.z * 0.85, -HZ - 1.5, HZ + 1.5));
      _vLook.set(clamp((me.x + b.x) * 0.5 + 3.6, -6 * FK, HX + 1.2), 1.0, (me.z + b.z) * 0.45);
    } else {
      _vTarget.set(clamp(b.x * 0.5, -4.4 * FK, 4.4 * FK), 12.6 * (FK > 1 ? 1.6 : 1), (17.8 + clamp(b.z * 0.2, -1.8, 1.8)) * (FK > 1 ? 1.48 : 1));
      _vLook.set(b.x * (FK > 1 ? 0.55 : 0.4), 0.55, b.z * 0.3);
    }
    if (G.camShake > 0) {
      _vTarget.x += Math.sin(tNow * 47) * G.camShake * 0.45;
      _vTarget.y += Math.cos(tNow * 53) * G.camShake * 0.32;
    }
    if (G.camSnap) {
      G.camera.position.copy(_vTarget);
      G.camSnap = false;
    } else {
      G.camera.position.lerp(_vTarget, 0.16);
    }
    G.camera.lookAt(_vLook);

    G.renderer.render(G.scene, G.camera);
  }

  function finishMatch() {
    if (!G || G.over) return;
    G.over = true;
    const win = G.score[0] > G.score[1];
    const myGoals = G.score[0], oppGoals = G.score[1];
    const mode = G.mode, round = G.round, opp = G.opp, sq = G.sq;

    const rec = load();
    rec.played++;
    rec.goals += myGoals;
    if (win) rec.wins++;

    let coinsWon = 0;
    let cupMsg = "";
    if (mode === "cup") {
      if (win) {
        coinsWon = opp.prize;
        if (round >= 2) {
          rec.cups++;
          rec.cupRun = null;
          cupMsg = "🏆 HAI VINTO LA COPPA DELLA GABBIA 3D!";
        } else {
          rec.cupRun = { round: round + 1 };
          cupMsg = `✓ Superato: ${opp.label}! Prossimo turno sbloccato.`;
        }
      } else {
        coinsWon = 5;
        rec.cupRun = null;
        cupMsg = `Eliminato in ${opp.label}. Puoi riprovare la Coppa quando vuoi!`;
      }
    } else {
      coinsWon = win ? opp.prize : 5;
    }
    save(rec);
    if (coinsWon > 0) safe(() => window.addCoins && window.addCoins(coinsWon), 0);

    const s = S();
    const playedIds = sq.all.map((c) => c.id);
    const ups = s && s.gainXp ? s.gainXp(playedIds, win, false) : [];

    const renderSummary = () => {
      const body = shell(win ? "🏆 Vittoria in Gabbia 3D!" : "⚽ Fine Partita · Gabbia 3D", false);
      body.innerHTML = `
        <div style="background:#151f36;border:1.5px solid ${win ? "#ffd23f" : "#475569"};border-radius:14px;padding:16px 12px;text-align:center;margin:8px 0">
          <div style="font:900 13px system-ui;color:#7dd3fc;text-transform:uppercase">${esc(opp.name)}</div>
          <div style="font:900 36px/1.15 system-ui;color:#ffd23f;margin:6px 0">${myGoals} – ${oppGoals}</div>
          <p class="sum" style="margin:6px 0;color:#f1f5f9">${win ? "Partita dominata tra le sponde luminose!" : "Sfida combattuta fino all'ultimo rimbalzo."}</p>
          ${cupMsg ? `<p class="sum" style="color:#fde047;font-weight:800">${esc(cupMsg)}</p>` : ""}
          <p class="sum" style="color:#4ade80;font-weight:700;margin-bottom:0">🪙 +${coinsWon} monete · ⭐ Esperienza carte assegnata</p>
        </div>
        <div class="g3dModes">
          ${mode === "cup" && rec.cupRun ? `<button type="button" class="g3dModeBtn cup" data-next-cup="1"><div>🏆 Prossimo turno · ${esc(CUP_ROUNDS[rec.cupRun.round].label)}<small>Contro ${esc(CUP_ROUNDS[rec.cupRun.round].name)}</small></div><span class="goTag">Gioca ▸</span></button>` : ""}
          <button type="button" class="g3dModeBtn" data-rematch="1"><div>↻ Rigioca sfida<small>${esc(opp.name)} · ${esc(ARENAS[opp.arena || rec.arena].name)}</small></div><span class="goTag">▶</span></button>
          <button type="button" class="g3dModeBtn" data-lobby="1"><div>◂ Menu Gabbia 3D<small>Cambia arena, mazzo tattico o modalità</small></div><span class="goTag">Menu</span></button>
        </div>
      `;
      const nc = body.querySelector("[data-next-cup]");
      if (nc) {
        nc.onclick = () => {
          const r2 = load();
          const cr = CUP_ROUNDS[r2.cupRun ? r2.cupRun.round : 0];
          startMatch({ mode: "cup", round: cr.round, opp: cr, arenaId: cr.arena });
        };
      }
      body.querySelector("[data-rematch]").onclick = () => {
        if (mode === "cup") {
          const r2 = load();
          r2.cupRun = { round: 0 };
          save(r2);
          startMatch({ mode: "cup", round: 0, opp: CUP_ROUNDS[0], arenaId: CUP_ROUNDS[0].arena });
        } else {
          startMatch({ mode: "quick", opp, arenaId: load().arena });
        }
      };
      body.querySelector("[data-lobby]").onclick = () => open();
    };

    if (!FAST && ups && ups.length && s && s.levelUps) {
      close();
      s.levelUps(ups, () => {
        s.close && s.close();
        renderSummary();
      });
    } else {
      renderSummary();
    }
  }

  function tick(dtOverride) {
    if (!G) return;
    stepSim(typeof dtOverride === "number" ? dtOverride : 1 / 30);
    render3D();
  }

  function pause(p) {
    if (G) G.paused = p === undefined ? !G.paused : !!p;
  }

  window.__gabbia3d = {
    open,
    close,
    startMatch,
    tick,
    step: (dt) => stepSim(dt),
    pause,
    doPassOrSwitch,
    doShootOrTackle,
    doTackle,
    doSuperShot,
    state: () => G,
    load,
    save,
    ARENAS,
    OPP_TIERS,
    CUP_ROUNDS,
    _fast: (v) => { FAST = !!v; },
  };
})();
