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
  const PW = 22, PD = 14, HX = PW / 2, HZ = PD / 2;
  const GW = 4.6, GH = 2.35, GD = 1.65;

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
.g3dPad{display:grid;grid-template-columns:108px 1fr;gap:10px;align-items:center;margin-top:10px;padding:6px 4px;user-select:none;-webkit-user-select:none}
.g3dStick{position:relative;width:104px;height:104px;border-radius:50%;background:#131d33;border:2px solid #3b4f6b;touch-action:none;margin:0 auto}
.g3dStickKnob{position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px 0 0 -21px;border-radius:50%;background:#38bdf8;border:2px solid #e0f2fe;box-shadow:0 2px 8px rgba(0,0,0,.5);pointer-events:none}
.g3dBtns{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.g3dAct{min-height:48px;border-radius:10px;border:1.5px solid #475569;background:#192742;color:#f8fafc;font:800 12.5px/1.15 system-ui;padding:6px 8px;cursor:pointer;touch-action:manipulation;text-align:center}
.g3dAct small{display:block;font:600 9.5px system-ui;color:#94a3b8;margin-top:2px}
.g3dAct.pass{border-color:#38bdf8;background:#122a44}
.g3dAct.shoot{border-color:#fb7185;background:#3b1629}
.g3dAct.super{grid-column:1/-1;min-height:46px;border-color:#475569;background:#1a2236;color:#94a3b8}
.g3dAct.super.ready{border-color:#ffd23f;background:linear-gradient(135deg,#6d28d9,#b45309);color:#fff;box-shadow:0 0 12px rgba(255,210,63,.35)}
.g3dAct.super.ready small{color:#fef08a}
.g3dKeyHint{font-size:10.5px;color:#64748b;text-align:center;margin-top:6px}
@media (max-width:350px){
  .g3dPad{grid-template-columns:92px 1fr;gap:7px}
  .g3dStick{width:88px;height:88px}
  .g3dAct{padding:5px 6px;font-size:11.5px}
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
            if (m.dispose) m.dispose();
          });
        }
      });
    }
    if (G.textures) {
      G.textures.forEach((t) => { if (t && t.dispose) t.dispose(); });
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

  function getMySquad3() {
    const s = S();
    if (!s) {
      const fb = [
        { id: "nico", role: "P", at: 45, df: 80, te: 64, saga: "borgo" },
        { id: "leo", role: "A", at: 84, df: 56, te: 80, saga: "borgo" },
        { id: "tommy", role: "C", at: 68, df: 66, te: 82, saga: "borgo" },
      ];
      return { keeper: fb[0], field: [fb[1], fb[2]], all: [fb[1], fb[2], fb[0]], loan: true, intesa: 4, combo: null };
    }
    s.sync && s.sync();
    const r = s._load();
    const sq = s.squad(3, r.team);
    const allIds = sq.all.map((c) => c.id);
    const loan = r.own.length < 3 || sq.all.some((c) => !r.own.includes(c.id));
    const I = s.intesa ? s.intesa(r.team.length ? r.team : allIds, r.modulo).n : 0;
    const combo = s.combo ? s.combo(allIds) : null;
    return { keeper: sq.keeper, field: sq.field.slice(0, 2), all: sq.all, loan, intesa: I, combo, r };
  }

  function open(back) {
    if (typeof back === "function") BACK = back;
    const body = shell("🏟️ Gabbia 3D · 3 contro 3", false);
    const rec = load();
    const sq = getMySquad3();
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

    let h = `<p class="sum">Calcio veloce <b>3 contro 3</b> in Three.js dentro la gabbia luminosa: nessun fallo laterale, le <b>sponde</b> tengono viva l'azione e un <b>uno-due di sponda</b> carica del +24% il Super-Tiro della tua saga.${sq.loan ? ` <span>(Carte in prestito attive finché non ne sblocchi 3)</span>` : ""}</p>`;

    if (s && s.presetsBarHtml) {
      h += `<div class="g3dPresetsHost">${s.presetsBarHtml(sq.r, { compact: true })}</div>`;
    }

    h += `<div class="sec"><span>Il tuo Trio in Gabbia · Intesa +${sq.intesa}</span>${s ? `<button type="button" class="sgPresetActBtn" data-edit-team="1">🃏 Squadra</button>` : ""}</div>`;
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
    h += `<div class="sec"><span>Modalità · 90s o 3 Gol (Golden Goal)</span></div>`;
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

  // Texture procedurali in SRGBColorSpace (zero file esterni)
  function makePitchTexture(THREE, ar) {
    const cv = document.createElement("canvas");
    cv.width = 512;
    cv.height = 320;
    const c = cv.getContext("2d");
    const stripes = 8;
    for (let i = 0; i < stripes; i++) {
      c.fillStyle = i % 2 === 0 ? ar.floorA : ar.floorB;
      c.fillRect((i * cv.width) / stripes, 0, cv.width / stripes + 1, cv.height);
    }
    if (ar.id === "cupola") {
      c.strokeStyle = "rgba(34,211,238,0.12)";
      c.lineWidth = 1;
      for (let x = 0; x < cv.width; x += 32) {
        c.beginPath(); c.moveTo(x, 0); c.lineTo(x, cv.height); c.stroke();
      }
      for (let y = 0; y < cv.height; y += 32) {
        c.beginPath(); c.moveTo(0, y); c.lineTo(cv.width, y); c.stroke();
      }
    } else if (ar.id === "periferia") {
      for (let i = 0; i < 420; i++) {
        c.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.08)";
        c.fillRect((i * 73) % cv.width, (i * 47) % cv.height, 2, 2);
      }
    }
    // Righe regolamentari Gabbia
    c.strokeStyle = ar.line;
    c.lineWidth = 4;
    c.strokeRect(10, 10, cv.width - 20, cv.height - 20);
    c.beginPath();
    c.moveTo(cv.width / 2, 10);
    c.lineTo(cv.width / 2, cv.height - 10);
    c.stroke();
    c.beginPath();
    c.arc(cv.width / 2, cv.height / 2, 46, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(10, cv.height / 2, 68, -Math.PI / 2, Math.PI / 2);
    c.stroke();
    c.beginPath();
    c.arc(cv.width - 10, cv.height / 2, 68, Math.PI / 2, Math.PI * 1.5);
    c.stroke();

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function makeBallTexture(THREE) {
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 128;
    const c = cv.getContext("2d");
    c.fillStyle = "#f8fafc";
    c.fillRect(0, 0, 256, 128);
    c.fillStyle = "#0f172a";
    const spots = [[32, 32], [96, 28], [160, 32], [224, 28], [64, 92], [128, 96], [192, 92]];
    spots.forEach(([x, y]) => {
      c.beginPath();
      for (let k = 0; k < 5; k++) {
        const a = (k * Math.PI * 2) / 5 - Math.PI / 2;
        const px = x + Math.cos(a) * 16, py = y + Math.sin(a) * 15;
        if (k === 0) c.moveTo(px, py); else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
    });
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  function makeShadowTexture(THREE) {
    const cv = document.createElement("canvas");
    cv.width = 64;
    cv.height = 64;
    const c = cv.getContext("2d");
    const g = c.createRadialGradient(32, 32, 4, 32, 32, 30);
    g.addColorStop(0, "rgba(0,0,0,0.62)");
    g.addColorStop(0.65, "rgba(0,0,0,0.24)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }

  // Modello procedurale composito a 9 parti (THREE.Group, pivot y=0 a terra)
  function buildAthleteMesh(THREE, shadowTex, cfg) {
    const grp = new THREE.Group();

    const matSkin = new THREE.MeshStandardMaterial({ color: cfg.skin, roughness: 0.65, metalness: 0.04 });
    const matHair = new THREE.MeshStandardMaterial({ color: cfg.hair, roughness: 0.78, metalness: 0.05 });
    const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.68, metalness: 0.08 });
    const matShorts = new THREE.MeshStandardMaterial({ color: cfg.shorts, roughness: 0.85, metalness: 0.04 });
    const matBoots = new THREE.MeshStandardMaterial({ color: cfg.boots, roughness: 0.35, metalness: 0.22 });
    const matGlove = new THREE.MeshStandardMaterial({ color: cfg.isGk ? 0xffd23f : cfg.skin, roughness: cfg.isGk ? 0.4 : 0.65, metalness: 0.1 });

    // 1. Ombra di contatto radiale a terra
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 1.15),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.015;
    grp.add(sh);

    // 2. Anello indicatore ruolo / giocatore controllato
    const ringMat = new THREE.MeshBasicMaterial({
      color: cfg.ringColor,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.46, 0.62, 24), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.022;
    grp.add(ring);

    const bodyRoot = new THREE.Group();
    grp.add(bodyRoot);

    // 3 & 4. Gambe articolate + scarpini
    function mkLeg(xOff) {
      const piv = new THREE.Group();
      piv.position.set(xOff, 0.56, 0);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.44, 10), matSkin);
      shin.position.y = -0.22;
      piv.add(shin);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.13, 0.3), matBoots);
      boot.position.set(0, -0.46, 0.05);
      piv.add(boot);
      return piv;
    }
    const legL = mkLeg(-0.14);
    const legR = mkLeg(0.14);
    bodyRoot.add(legL, legR);

    // 5. Pantaloncini
    const shorts = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.24, 12), matShorts);
    shorts.position.y = 0.64;
    bodyRoot.add(shorts);

    // 6. Busto maglia + colletto
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.52, 12), matShirt);
    torso.position.y = 0.98;
    if (!IS_SW_GL) torso.castShadow = true;
    bodyRoot.add(torso);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 16), matShorts);
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.23;
    bodyRoot.add(collar);

    // 7 & 8. Braccia + mani / guantoni da portiere
    function mkArm(xOff) {
      const piv = new THREE.Group();
      piv.position.set(xOff, 1.16, 0);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.38, 9), matShirt);
      upper.position.y = -0.17;
      piv.add(upper);
      const handGeo = cfg.isGk ? new THREE.BoxGeometry(0.19, 0.19, 0.14) : new THREE.SphereGeometry(0.085, 9, 9);
      const hand = new THREE.Mesh(handGeo, matGlove);
      hand.position.y = -0.39;
      piv.add(hand);
      return piv;
    }
    const armL = mkArm(-0.34);
    const armR = mkArm(0.34);
    bodyRoot.add(armL, armR);

    // 9. Testa + capigliatura distintiva
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 12), matSkin);
    head.position.y = 1.46;
    if (!IS_SW_GL) head.castShadow = true;
    bodyRoot.add(head);

    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.252, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), matHair);
    hairCap.position.y = 1.48;
    hairCap.rotation.x = -0.18;
    bodyRoot.add(hairCap);

    const crest = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.22, 7), matHair);
    crest.position.set(0, 1.72, 0.06);
    crest.rotation.x = 0.35;
    bodyRoot.add(crest);

    return { grp, bodyRoot, legL, legR, armL, armR, ring, ringMat };
  }

  function buildArenaProps(THREE, scene, ar) {
    // Ampio piazzale esterno oltre la gabbia così non fluttua nel vuoto
    const apron = new THREE.Mesh(
      new THREE.PlaneGeometry(76, 56),
      new THREE.MeshStandardMaterial({ color: ar.apron, roughness: 0.92, metalness: 0.05 })
    );
    apron.rotation.x = -Math.PI / 2;
    apron.position.y = -0.03;
    scene.add(apron);

    const propMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75, metalness: 0.25 });
    const glowMat = new THREE.MeshStandardMaterial({ color: ar.rail, emissive: ar.rail, emissiveIntensity: 0.85, roughness: 0.3 });

    // 4 torri faro / colonne angolari esterne
    const corners = [[-13.2, -8.8], [13.2, -8.8], [-13.2, 8.8], [13.2, 8.8]];
    corners.forEach(([cx, cz]) => {
      const poleH = ar.id === "colosseo" ? 5.2 : 6.4;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, poleH, 10), propMat);
      pole.position.set(cx, poleH / 2, cz);
      scene.add(pole);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, 0.55), glowMat);
      lamp.position.set(cx, poleH + 0.15, cz);
      lamp.lookAt(0, 0, 0);
      scene.add(lamp);
    });

    // Sagome architettoniche di sfondo coerenti col tema
    const bgMat = new THREE.MeshStandardMaterial({ color: ar.id === "colosseo" ? 0x452719 : 0x131e33, roughness: 0.88, metalness: 0.12 });
    for (let i = -3; i <= 3; i++) {
      const h = 2.6 + ((Math.abs(i * 7 + 3) % 4) * 1.1);
      const blk = new THREE.Mesh(new THREE.BoxGeometry(3.6, h, 2.2), bgMat);
      blk.position.set(i * 5.2, h / 2, -13.5);
      scene.add(blk);
    }
  }

  // Vettori pre-allocati per zero GC nel game loop
  let _vTarget = null, _vLook = null;

  function makeActor(c, side, slotIdx, isGk, shadowTex, THREE) {
    const s = S();
    const cast = CAST()[c.id] || {};
    const eff = s && s.eff && side === "m" ? s.eff(c) : { at: c.at || 65, df: c.df || 65, te: c.te || 65 };
    const sagaCol = side === "m" ? (s && s.SAGHE && s.SAGHE[c.saga] ? s.SAGHE[c.saga][2] : "#2563eb") : c.shirtHex || "#e11d48";
    const shirtHex = typeof sagaCol === "number" ? sagaCol : parseInt(String(sagaCol).replace("#", ""), 16) || 0x2563eb;
    const skinHex = cast.skin ? parseInt(String(cast.skin).replace("#", ""), 16) || 0xf1c27d : (slotIdx % 2 ? 0xe0ac69 : 0xf1c27d);
    const hairHex = cast.hair ? parseInt(String(cast.hair).replace("#", ""), 16) || 0x2b1d0e : (slotIdx === 1 ? 0x1e293b : 0x451a03);
    const dir = side === "m" ? 1 : -1;
    const homeX = isGk ? -dir * (HX - 0.85) : -dir * (slotIdx === 1 ? 3.2 : 5.8);
    const homeZ = isGk ? 0 : (slotIdx === 1 ? -2.6 : 2.6);

    const mesh = buildAthleteMesh(THREE, shadowTex, {
      skin: skinHex,
      hair: hairHex,
      shirt: isGk ? (side === "m" ? 0x16a34a : 0xd97706) : shirtHex,
      shorts: side === "m" ? 0x0f172a : 0x1e1b4b,
      boots: side === "m" ? 0xfbbf24 : 0xf43f5e,
      isGk,
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
      speed: (isGk ? 5.6 : 6.5 + (eff.te - 55) * 0.032),
      reach: (isGk ? 1.25 + (eff.df - 50) * 0.008 : 0.82 + (eff.df - 50) * 0.004) * pBonus,
      shotPow: 15.2 + (eff.at - 50) * 0.095,
      tackleCd: 0,
      tackleT: 0,
      kickT: 0,
      diveT: 0,
      diveZ: 0,
      slowT: 0,
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
    const sq = getMySquad3();
    const title = opts.mode === "cup" ? `🏆 ${opp.label} · vs ${opp.name}` : `🏟️ Gabbia 3D · vs ${opp.name}`;
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
          <button type="button" class="g3dAct pass" data-btn="pass">🎯 Passa / Cambia<small>Uno-due di sponda</small></button>
          <button type="button" class="g3dAct shoot" data-btn="shoot">⚽ Tira / Scivolata<small>Tiro o contrasto</small></button>
          <button type="button" class="g3dAct super" id="g3dSuperBtn" data-btn="super">⚡ Super dei Sogni<small id="g3dSuperSub">Carica con passaggi e sponde</small></button>
        </div>
      </div>
      <div class="g3dKeyHint">Tastiera: WASD / Frecce · J/Z Passa-Cambia · K/X Tira-Scivolata · Spazio/L Super</div>
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
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(IS_SW_GL ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !IS_SW_GL;
    if (!IS_SW_GL) renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(ar.sky);
    scene.fog = new THREE.FogExp2(ar.fog, ar.fogD);

    const camera = new THREE.PerspectiveCamera(48, 16 / 10, 0.2, 110);
    _vTarget = new THREE.Vector3();
    _vLook = new THREE.Vector3();

    const hemi = new THREE.HemisphereLight(ar.hemiSky, ar.hemiGnd, 0.72);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(ar.sun, 1.35);
    dirLight.position.set(9, 17, 11);
    if (!IS_SW_GL) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(1024, 1024);
      dirLight.shadow.camera.near = 2;
      dirLight.shadow.camera.far = 42;
      dirLight.shadow.camera.left = -15;
      dirLight.shadow.camera.right = 15;
      dirLight.shadow.camera.top = 12;
      dirLight.shadow.camera.bottom = -12;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(ar.wall, 0.42);
    rimLight.position.set(-10, 9, -9);
    scene.add(rimLight);

    const pitchTex = makePitchTexture(THREE, ar);
    const ballTex = makeBallTexture(THREE);
    const shadowTex = makeShadowTexture(THREE);

    buildArenaProps(THREE, scene, ar);

    const pitchMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(PW, PD),
      new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.78, metalness: 0.06 })
    );
    pitchMesh.rotation.x = -Math.PI / 2;
    if (!IS_SW_GL) pitchMesh.receiveShadow = true;
    scene.add(pitchMesh);

    // Sponde luminose della Gabbia (lati nord/sud + angoli di fondo attorno alle porte)
    const railMat = new THREE.MeshStandardMaterial({
      color: ar.rail,
      emissive: ar.rail,
      emissiveIntensity: 0.75,
      roughness: 0.28,
      metalness: 0.4,
    });
    const glassMat = new THREE.MeshStandardMaterial({
      color: ar.wall,
      emissive: ar.wall,
      emissiveIntensity: 0.22,
      transparent: true,
      opacity: 0.24,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });

    function addCageWall(w, x, z, rotY) {
      const wg = new THREE.Group();
      wg.position.set(x, 0, z);
      wg.rotation.y = rotY;
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.35), glassMat);
      pane.position.y = 0.68;
      wg.add(pane);
      const topR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.11, 0.14), railMat);
      topR.position.y = 1.38;
      wg.add(topR);
      const botR = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, 0.14), railMat);
      botR.position.y = 0.06;
      wg.add(botR);
      scene.add(wg);
    }
    addCageWall(PW, 0, -HZ, 0);
    addCageWall(PW, 0, HZ, 0);
    const sideSpan = (PD - GW) / 2;
    [-HX, HX].forEach((gx) => {
      addCageWall(sideSpan, gx, -HZ + sideSpan / 2, Math.PI / 2);
      addCageWall(sideSpan, gx, HZ - sideSpan / 2, Math.PI / 2);
    });

    // Porte 3D a sinistra (-HX) e destra (+HX)
    function addGoal(sign) {
      const gg = new THREE.Group();
      gg.position.set(sign * HX, 0, 0);
      const postMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.65 });
      const netMat = new THREE.MeshBasicMaterial({ color: sign < 0 ? 0x38bdf8 : 0xfb7185, wireframe: true, transparent: true, opacity: 0.35 });
      const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, GH, 10), postMat);
      pL.position.set(0, GH / 2, -GW / 2);
      const pR = pL.clone();
      pR.position.set(0, GH / 2, GW / 2);
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, GW + 0.16, 10), postMat);
      bar.rotation.x = Math.PI / 2;
      bar.position.set(0, GH, 0);
      const netBox = new THREE.Mesh(new THREE.BoxGeometry(GD, GH, GW), netMat);
      netBox.position.set(sign * (GD / 2), GH / 2, 0);
      gg.add(pL, pR, bar, netBox);
      scene.add(gg);
    }
    addGoal(-1);
    addGoal(1);

    // Pallone + ombra + anello aura Super
    const ballRadius = 0.31;
    const ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 18, 14),
      new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.42, metalness: 0.08 })
    );
    ballMesh.position.set(0, ballRadius, 0);
    if (!IS_SW_GL) ballMesh.castShadow = true;
    scene.add(ballMesh);

    const ballShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.y = 0.016;
    scene.add(ballShadow);

    const superAuraMat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const superAura = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.68, 20), superAuraMat);
    scene.add(superAura);

    // Particelle scintille sponda / Super (pool pre-allocato zero GC)
    const sparkPool = [];
    const sparkGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const sparkMat = new THREE.MeshBasicMaterial({ color: ar.rail });
    for (let i = 0; i < 18; i++) {
      const m = new THREE.Mesh(sparkGeo, sparkMat);
      m.visible = false;
      scene.add(m);
      sparkPool.push({ m, vx: 0, vy: 0, vz: 0, life: 0 });
    }

    // Creazione 3vs3 giocatori
    const intesaMult = 1 + sq.intesa * 0.006;
    const myTeam = [
      makeActor(sq.keeper, "m", 0, true, shadowTex, THREE),
      makeActor(sq.field[0] || sq.keeper, "m", 1, false, shadowTex, THREE),
      makeActor(sq.field[1] || sq.field[0] || sq.keeper, "m", 2, false, shadowTex, THREE),
    ];
    myTeam.forEach((p) => {
      p.speed *= intesaMult;
      p.shotPow *= intesaMult;
      scene.add(p.mesh.grp);
    });

    const oppCards = [
      { id: "opp_gk", name: opp.pl[2] || "Portiere", role: "P", at: opp.ovr - 12, df: opp.ovr + 4, te: opp.ovr - 4, shirtHex: opp.shirt },
      { id: "opp_1", name: opp.pl[0] || "Capitano", role: "A", at: opp.ovr + 3, df: opp.ovr - 4, te: opp.ovr + 2, shirtHex: opp.shirt },
      { id: "opp_2", name: opp.pl[1] || "Ala", role: "C", at: opp.ovr - 1, df: opp.ovr, te: opp.ovr + 1, shirtHex: opp.shirt },
    ];
    const oppTeam = [
      makeActor(oppCards[0], "o", 0, true, shadowTex, THREE),
      makeActor(oppCards[1], "o", 1, false, shadowTex, THREE),
      makeActor(oppCards[2], "o", 2, false, shadowTex, THREE),
    ];
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
      clock,
      textures: [pitchTex, ballTex, shadowTex],
      railMat,
      ballMesh,
      ballShadow,
      superAura,
      superAuraMat,
      sparkPool,
      myTeam,
      oppTeam,
      all: myTeam.concat(oppTeam),
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
        wallBounced: false,
        superFx: null,
        superCol: 0xffd23f,
        superAge: 0,
        pickupLock: 0,
      },
      score: [0, 0],
      timeLeft: 90,
      goldenGoal: false,
      superPct: 25,
      wallFlash: 0,
      goalFreeze: 0,
      paused: false,
      over: false,
      dead: false,
      raf: 0,
      swTimer: 0,
      bannerTimer: 0,
    };

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
      camBtn.onclick = () => {
        if (!G) return;
        G.camMode = G.camMode === "tribuna" ? "terza" : "tribuna";
        const r2 = load();
        r2.cam = G.camMode;
        save(r2);
        showBanner("🎥 Telecamera", G.camMode === "tribuna" ? "Tribuna Dinamica" : "Terza Persona", null, 1.2);
      };
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
            G.swTimer = setTimeout(() => { if (G && !G.dead) G.raf = requestAnimationFrame(cb); }, 80);
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
      sp.vx = Math.cos(a) * (2.2 + (i % 3));
      sp.vy = 1.6 + (i % 4) * 0.8;
      sp.vz = Math.sin(a) * (2.2 + (i % 3));
      sp.life = 0.42;
      sp.m.visible = true;
    });
  }

  function bindMatchInputs(body) {
    const stick = body.querySelector("#g3dStick");
    const knob = body.querySelector("#g3dKnob");
    let ptrId = null;

    const moveStick = (clientX, clientY) => {
      if (!G || !stick) return;
      const rect = stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const maxR = rect.width * 0.36;
      let dx = clientX - cx, dy = clientY - cy;
      const d = hypot(dx, dy);
      if (d > maxR) { dx = (dx / d) * maxR; dy = (dy / d) * maxR; }
      if (knob) knob.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      G.stk.set(d < 6 ? 0 : dx / maxR, d < 6 ? 0 : dy / maxR);
    };
    const resetStick = () => {
      ptrId = null;
      if (knob) knob.style.transform = "translate(0px, 0px)";
      if (G) G.stk.set(0, 0);
    };
    if (stick) {
      stick.addEventListener("pointerdown", (e) => {
        ptrId = e.pointerId;
        safe(() => stick.setPointerCapture(e.pointerId), 0);
        moveStick(e.clientX, e.clientY);
      });
      stick.addEventListener("pointermove", (e) => {
        if (ptrId === e.pointerId) moveStick(e.clientX, e.clientY);
      });
      stick.addEventListener("pointerup", resetStick);
      stick.addEventListener("pointercancel", resetStick);
    }

    const actPass = () => { if (G && !G.over && !G.paused) doPassOrSwitch(); };
    const actShoot = () => { if (G && !G.over && !G.paused) doShootOrTackle(); };
    const actSuper = () => { if (G && !G.over && !G.paused) doSuperShot(); };

    const bPass = body.querySelector('[data-btn="pass"]');
    const bShoot = body.querySelector('[data-btn="shoot"]');
    const bSuper = body.querySelector('[data-btn="super"]');
    if (bPass) bPass.onclick = actPass;
    if (bShoot) bShoot.onclick = actShoot;
    if (bSuper) bSuper.onclick = actSuper;

    const onKeyDown = (e) => {
      if (!G || G.over) return;
      const k = e.key.toLowerCase();
      G.keys[k] = true;
      if (k === "j" || k === "z") { e.preventDefault(); actPass(); }
      else if (k === "k" || k === "x") { e.preventDefault(); actShoot(); }
      else if (k === "l" || k === " ") { e.preventDefault(); actSuper(); }
    };
    const onKeyUp = (e) => {
      if (!G) return;
      G.keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    keyCleanup = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
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

  function releaseBall(actor, vx, vy, vz, superFx, superCol) {
    const b = G.ball;
    b.owner = null;
    b.lastSide = actor.side;
    b.wallBounced = false;
    b.pickupLock = 0.22;
    b.x = actor.x + Math.cos(actor.facing) * 0.55;
    b.z = actor.z + Math.sin(actor.facing) * 0.55;
    b.y = Math.max(b.r, 0.36);
    b.vx = vx;
    b.vy = vy;
    b.vz = vz;
    b.superFx = superFx || null;
    b.superCol = superCol || 0xffd23f;
    b.superAge = 0;
    actor.kickT = 0.28;
  }

  function doPassOrSwitch() {
    const me = G.myTeam[G.ctrlIdx];
    const b = G.ball;
    if (b.owner && b.owner.side === "m") {
      const carrier = b.owner;
      const inp = activeInputVec();
      const mates = G.myTeam.filter((p) => p !== carrier);
      // Se il giocatore inclina decisamente verso la sponda laterale, esegue un passaggio di sponda!
      if (Math.abs(inp.z) > 0.68) {
        const targetMate = mates.find((p) => !p.isGk) || mates[0];
        const wallZ = inp.z > 0 ? HZ - b.r : -HZ + b.r;
        const midX = (carrier.x + Math.max(carrier.x + 3.5, targetMate.x + 2)) * 0.5;
        const dx = midX - carrier.x, dz = wallZ - carrier.z;
        const d = hypot(dx, dz) || 1;
        const spd = 14.5;
        carrier.facing = Math.atan2(dz, dx);
        releaseBall(carrier, (dx / d) * spd, 0.8, (dz / d) * spd, null, 0);
        G.superPct = Math.min(100, G.superPct + 8);
        sfx("pass");
        return;
      }
      // Passaggio diretto al compagno meglio piazzato in avanti
      const target = mates.sort((p1, p2) => (p2.isGk ? -99 : p2.x) - (p1.isGk ? -99 : p1.x))[0];
      const leadX = clamp(target.x + (target.isGk ? 0 : 1.4), -HX + 1, HX - 1);
      const dx = leadX - carrier.x, dz = target.z - carrier.z;
      const d = hypot(dx, dz) || 1;
      const spd = 13.8;
      carrier.facing = Math.atan2(dz, dx);
      releaseBall(carrier, (dx / d) * spd, 0.7, (dz / d) * spd, null, 0);
      if (!target.isGk) G.ctrlIdx = G.myTeam.indexOf(target);
      G.superPct = Math.min(100, G.superPct + 8);
      sfx("pass");
    } else {
      // Cambia controllo al giocatore di movimento più vicino alla palla
      const cands = [1, 2];
      const other = cands.find((i) => i !== G.ctrlIdx) || 1;
      const dCur = hypot(me.x - b.x, me.z - b.z);
      const dOth = hypot(G.myTeam[other].x - b.x, G.myTeam[other].z - b.z);
      G.ctrlIdx = dOth <= dCur + 1.5 ? other : (G.ctrlIdx === 1 ? 2 : 1);
      sfx("pass");
    }
  }

  function doShootOrTackle() {
    const b = G.ball;
    if (b.owner && b.owner.side === "m") {
      const shooter = b.owner;
      const inp = activeInputVec();
      const aimZ = clamp(inp.z * (GW * 0.42), -GW * 0.42, GW * 0.42);
      const dx = HX - shooter.x;
      const dz = aimZ - shooter.z;
      const d = hypot(dx, dz) || 1;
      const spd = shooter.shotPow;
      shooter.facing = Math.atan2(dz, dx);
      releaseBall(shooter, (dx / d) * spd, 2.2 + Math.random() * 1.1, (dz / d) * spd, null, 0);
      G.superPct = Math.min(100, G.superPct + 12);
      sfx("kick");
    } else {
      // Scivolata / contrasto sul portatore o verso la palla
      const me = G.myTeam[G.ctrlIdx];
      if (me.tackleCd > 0) return;
      const inp = activeInputVec();
      const ang = (inp.x || inp.z) ? Math.atan2(inp.z, inp.x) : Math.atan2(b.z - me.z, b.x - me.x);
      me.facing = ang;
      me.vx = Math.cos(ang) * (me.speed * 1.65);
      me.vz = Math.sin(ang) * (me.speed * 1.65);
      me.tackleT = 0.26;
      me.tackleCd = 0.75;
      sfx("kick");
    }
  }

  function doSuperShot() {
    if (!G || G.superPct < 100) return;
    const b = G.ball;
    let shooter = b.owner && b.owner.side === "m" ? b.owner : null;
    if (!shooter) {
      const me = G.myTeam[G.ctrlIdx];
      if (!b.owner && hypot(me.x - b.x, me.z - b.z) < 1.8) shooter = me;
    }
    if (!shooter) {
      showBanner("⚡ Super Pronta!", "Conquista palla per scatenare il Super-Tiro!", null, 1.2);
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
    releaseBall(shooter, (dx / d) * spd, 2.7, (dz / d) * spd, sup.fx, colHex);
    spawnSparks(shooter.x, 0.7, shooter.z, colHex);
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
      p.diveT = 0;
      p.slowT = 0;
    });
    const starter = concededSide === "o" ? G.oppTeam[1] : G.myTeam[1];
    starter.x = concededSide === "o" ? 0.8 : -0.8;
    starter.z = 0;
    b.x = starter.x;
    b.y = b.r;
    b.z = 0;
    b.vx = 0;
    b.vy = 0;
    b.vz = 0;
    b.owner = starter;
    b.superFx = null;
    b.wallBounced = false;
    b.pickupLock = 0.25;
    G.ctrlIdx = 1;
  }

  function onGoalScored(scoringSide) {
    if (!G || G.over) return;
    const b = G.ball;
    if (scoringSide === "m") {
      G.score[0]++;
      G.superPct = Math.min(100, G.superPct + 15);
      sfx("goal");
      spawnSparks(HX - 0.3, 1.2, b.z, 0xffd23f);
      showBanner("⚽ GOOOL DEI SOGNI!", `${G.score[0]} – ${G.score[1]} · Gabbia in delirio!`, G.myTeam[G.ctrlIdx].id, 1.8);
    } else {
      G.score[1]++;
      G.superPct = Math.min(100, G.superPct + 25);
      sfx("kick");
      spawnSparks(-HX + 0.3, 1.2, b.z, 0xfb7185);
      showBanner(`⚽ Gol di ${G.opp.name}`, `${G.score[0]} – ${G.score[1]} · Riparti subito!`, null, 1.6);
    }
    updateHud();

    if (G.goldenGoal || G.score[0] >= 3 || G.score[1] >= 3) {
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
      if (b.owner && b.owner.side === "m" && d < 1.35 && p.tackleCd <= 0 && Math.random() < dt * 3.2) {
        p.tackleT = 0.22;
        p.tackleCd = 1.15;
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

    if (G.bannerTimer > 0) {
      G.bannerTimer -= dt;
      if (G.bannerTimer <= 0 && OV) {
        const bEl = OV.querySelector("#g3dBanner");
        if (bEl) bEl.hidden = true;
      }
    }
    if (G.wallFlash > 0) {
      G.wallFlash = Math.max(0, G.wallFlash - dt * 3);
      G.railMat.emissiveIntensity = 0.75 + G.wallFlash * 1.1;
    }
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

    const me = G.myTeam[G.ctrlIdx];
    const inp = activeInputVec();

    G.all.forEach((p) => {
      if (p.tackleCd > 0) p.tackleCd = Math.max(0, p.tackleCd - dt);
      if (p.tackleT > 0) p.tackleT = Math.max(0, p.tackleT - dt);
      if (p.kickT > 0) p.kickT = Math.max(0, p.kickT - dt);
      if (p.diveT > 0) p.diveT = Math.max(0, p.diveT - dt);
      if (p.slowT > 0) p.slowT = Math.max(0, p.slowT - dt);

      const slowMul = p.slowT > 0 ? 0.52 : 1.0;

      if (p === me) {
        if (p.tackleT <= 0) {
          if (inp.x || inp.z) {
            const carryMul = G.ball.owner === p ? 0.93 : 1.0;
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
        if (other.side === o.side || b.pickupLock > 0) return;
        const dist = hypot(other.x - o.x, other.z - o.z);
        const stealR = other.tackleT > 0 ? other.reach * 1.38 : other.reach * 0.76;
        if (dist < stealR) {
          b.owner = other;
          b.pickupLock = 0.32;
          b.wallBounced = false;
          if (other.side === "m") {
            G.superPct = Math.min(100, G.superPct + 12);
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

      // Rimbalzo sulle sponde laterali (Nord/Sud)
      if (b.z < -HZ + b.r) {
        b.z = -HZ + b.r;
        b.vz = Math.abs(b.vz) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        spawnSparks(b.x, b.y, -HZ + 0.1, G.ar.rail);
        sfx("wall");
      } else if (b.z > HZ - b.r) {
        b.z = HZ - b.r;
        b.vz = -Math.abs(b.vz) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        spawnSparks(b.x, b.y, HZ - 0.1, G.ar.rail);
        sfx("wall");
      }

      // Controllo Gol o rimbalzo sulle sponde di fondo
      const inGoalMouth = Math.abs(b.z) < GW / 2 - b.r * 0.4 && b.y < GH;
      if (b.x > HX - b.r) {
        if (inGoalMouth) {
          onGoalScored("m");
          return;
        }
        b.x = HX - b.r;
        b.vx = -Math.abs(b.vx) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        spawnSparks(HX - 0.1, b.y, b.z, G.ar.rail);
        sfx("wall");
      } else if (b.x < -HX + b.r) {
        if (inGoalMouth) {
          onGoalScored("o");
          return;
        }
        b.x = -HX + b.r;
        b.vx = Math.abs(b.vx) * G.ar.bounce;
        b.wallBounced = true;
        G.wallFlash = 1;
        spawnSparks(-HX + 0.1, b.y, b.z, G.ar.rail);
        sfx("wall");
      }

      // Intercetto / Parata / Raccolta pallone libero
      if (b.pickupLock <= 0) {
        for (let i = 0; i < G.all.length; i++) {
          const p = G.all[i];
          const d = hypot(p.x - b.x, p.z - b.z);
          if (d < p.reach && b.y < (p.isGk ? 2.15 : 1.55)) {
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
            b.superFx = null;
            b.wallBounced = false;
            b.pickupLock = 0.2;
            if (p.isGk) p.diveT = 0.3;
            if (p.side === "m" && !p.isGk) G.ctrlIdx = G.myTeam.indexOf(p);
            break;
          }
        }
      }
    }

    updateHud();
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

    if (sc) sc.textContent = `${G.score[0]} – ${G.score[1]}`;
    if (cl) {
      if (G.goldenGoal) {
        cl.textContent = "⚡ GOLDEN GOAL";
        cl.className = "gg";
      } else {
        const sec = Math.ceil(G.timeLeft);
        const m = Math.floor(sec / 60);
        const s = String(sec % 60).padStart(2, "0");
        cl.textContent = `${m}:${s}`;
        cl.className = "";
      }
    }
    const cur = G.myTeam[G.ctrlIdx];
    if (nm && cur) nm.textContent = `· ${String(cur.name).split(/[ ,]/)[0]}`;
    const pct = Math.round(G.superPct);
    if (sf) {
      sf.style.width = `${pct}%`;
      sf.classList.toggle("ready", pct >= 100);
    }
    if (sp) sp.textContent = `${pct}%`;
    if (sb) sb.classList.toggle("ready", pct >= 100);
    if (ss && cur) {
      const sup = SUP() ? SUP().of(cur.id) : { name: "Super Tiro" };
      ss.textContent = pct >= 100 ? `PRONTA! Scatena «${sup.name}»` : "Carica con passaggi e sponde (+24%)";
    }
  }

  function render3D() {
    if (!G || G.dead) return;
    const b = G.ball;

    // Aggiorna pose 3D di tutti gli atleti
    G.all.forEach((p, idx) => {
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
      m.bodyRoot.rotation.x = p.tackleT > 0 ? 0.52 : 0;
      m.bodyRoot.rotation.z = p.diveT > 0 ? 0.65 : 0;

      const isCtrl = p.side === "m" && G.myTeam[G.ctrlIdx] === p;
      m.ringMat.color.setHex(isCtrl ? 0xffd23f : p.side === "m" ? 0x38bdf8 : 0xfb7185);
      m.ring.scale.setScalar(isCtrl ? 1.16 : 0.92);
    });

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
      G.superAuraMat.opacity = 0.85;
    } else {
      G.superAuraMat.opacity = 0;
    }

    // Telecamera dinamica: Tribuna ampia o Terza Persona
    const me = G.myTeam[G.ctrlIdx];
    if (G.camMode === "terza" && me) {
      _vTarget.set(clamp(me.x - 6.2, -16.5, 6), 4.6, clamp(me.z * 0.85, -8.5, 8.5));
      _vLook.set(clamp((me.x + b.x) * 0.5 + 3.2, -6, HX), 0.9, (me.z + b.z) * 0.45);
    } else {
      _vTarget.set(clamp(b.x * 0.38, -5.5, 5.5), 11.4, 14.8 + clamp(b.z * 0.22, -2, 2));
      _vLook.set(b.x * 0.52, 0.45, b.z * 0.35);
    }
    G.camera.position.lerp(_vTarget, 0.14);
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
    pause,
    doPassOrSwitch,
    doShootOrTackle,
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
