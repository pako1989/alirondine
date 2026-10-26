// js/calcio11-3d.js - «Calcio a 11 3D · Coppa della Rondine»: calcio tridimensionale a 11 giocatori in Three.js.
// Telecamera televisiva laterale stile FIFA/PES, 22 atleti in campo a 60 FPS, moduli tattici (4-3-3, 4-4-2, 3-5-2),
// controlli completi (passaggio rasoterra, filtrante, tiro a caricamento con effetto, contrasto e pressing)
// e modalità Torneo a 8 squadre a eliminazione diretta.
(function () {
  "use strict";
  if (window.__calcio11_3d) return;

  const KEY = "ali-di-rondine.calcio11-3d";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hypot = Math.hypot || ((x, y) => Math.sqrt(x * x + y * y));

  // Dimensioni regolamentari in unità virtuali Three.js (scala 1 unità = ~1 metro)
  const FW = 105; // Lunghezza campo
  const FD = 68;  // Larghezza campo
  const HX = FW / 2; // 52.5
  const HZ = FD / 2; // 34.0
  const GW = 7.32; // Larghezza porta
  const GH = 2.44; // Altezza porta
  const GD = 2.4;  // Profondità porta
  const PEN_D = 16.5; // Profondità area di rigore
  const PEN_W = 40.3; // Larghezza area di rigore
  const BALL_R = 0.23;

  // Stadi e Atmosfere 3D
  const STADIUMS = {
    riviera: {
      id: "riviera",
      name: "Stadio della Rondine",
      icon: "⚓",
      sub: "Tramonto dorato sul Golfo · brezza di tramontana",
      sky: 0x172554,
      fog: 0x1e3a8a,
      fogD: 0.007,
      sun: 0xffedd5,
      hemiSky: 0x93c5fd,
      hemiGnd: 0x1e293b,
      lightColor: 0xffedd5,
      grass1: "#15803d",
      grass2: "#166534",
      lineColor: "#f8fafc",
      adCol: "#0284c7"
    },
    notte: {
      id: "notte",
      name: "Arena dei Riflettori",
      icon: "🏟️",
      sub: "Notte da finale · quattro torri faro illuminate",
      sky: 0x090d16,
      fog: 0x0f172a,
      fogD: 0.008,
      sun: 0xf8fafc,
      hemiSky: 0x64748b,
      hemiGnd: 0x020617,
      lightColor: 0xffffff,
      grass1: "#14532d",
      grass2: "#0f3d21",
      lineColor: "#ffffff",
      adCol: "#ffd23f"
    },
    collina: {
      id: "collina",
      name: "San Biagio Park",
      icon: "🍃",
      sub: "Pomeriggio di primavera · verde smeraldo",
      sky: 0x38bdf8,
      fog: 0x7dd3fc,
      fogD: 0.006,
      sun: 0xfffbeb,
      hemiSky: 0xe0f2fe,
      hemiGnd: 0x14532d,
      lightColor: 0xfffae0,
      grass1: "#16a34a",
      grass2: "#15803d",
      lineColor: "#f8fafc",
      adCol: "#e11d48"
    }
  };

  // Moduli Tattici a 11
  const FORMATIONS = {
    "4-3-3": {
      name: "4-3-3 Classico",
      sub: "Ali larghe, terzini di spinta e tridente",
      slots: [
        { role: "P", name: "Portiere", x: -0.92, z: 0.0 },
        { role: "TD", name: "Terzino D.", x: -0.68, z: 0.65 },
        { role: "DC", name: "Centrale D.", x: -0.72, z: 0.22 },
        { role: "DC", name: "Centrale S.", x: -0.72, z: -0.22 },
        { role: "TS", name: "Terzino S.", x: -0.68, z: -0.65 },
        { role: "MED", name: "Mediano", x: -0.44, z: 0.0 },
        { role: "CC", name: "Mezzala D.", x: -0.26, z: 0.36 },
        { role: "CC", name: "Mezzala S.", x: -0.26, z: -0.36 },
        { role: "AD", name: "Ala Destra", x: 0.08, z: 0.68 },
        { role: "ATT", name: "Centravanti", x: 0.16, z: 0.0 },
        { role: "AS", name: "Ala Sinistra", x: 0.08, z: -0.68 }
      ]
    },
    "4-4-2": {
      name: "4-4-2 Lineare",
      sub: "Equilibrio tra le linee e raddoppi continui",
      slots: [
        { role: "P", name: "Portiere", x: -0.92, z: 0.0 },
        { role: "TD", name: "Terzino D.", x: -0.68, z: 0.65 },
        { role: "DC", name: "Centrale D.", x: -0.72, z: 0.22 },
        { role: "DC", name: "Centrale S.", x: -0.72, z: -0.22 },
        { role: "TS", name: "Terzino S.", x: -0.68, z: -0.65 },
        { role: "ED", name: "Esterno D.", x: -0.24, z: 0.68 },
        { role: "CC", name: "Centrale D.", x: -0.32, z: 0.18 },
        { role: "CC", name: "Centrale S.", x: -0.32, z: -0.18 },
        { role: "ES", name: "Esterno S.", x: -0.24, z: -0.68 },
        { role: "ATT", name: "Punta D.", x: 0.14, z: 0.24 },
        { role: "ATT", name: "Punta S.", x: 0.14, z: -0.24 }
      ]
    },
    "3-5-2": {
      name: "3-5-2 Dinamico",
      sub: "Densità in mezzo, corsie a tutta fascia",
      slots: [
        { role: "P", name: "Portiere", x: -0.92, z: 0.0 },
        { role: "DC", name: "Braccetto D.", x: -0.70, z: 0.38 },
        { role: "LIB", name: "Centrale", x: -0.74, z: 0.0 },
        { role: "DC", name: "Braccetto S.", x: -0.70, z: -0.38 },
        { role: "ED", name: "Quinto Destro", x: -0.30, z: 0.74 },
        { role: "MED", name: "Regista", x: -0.42, z: 0.0 },
        { role: "CC", name: "Mezzala D.", x: -0.22, z: 0.28 },
        { role: "CC", name: "Mezzala S.", x: -0.22, z: -0.28 },
        { role: "ES", name: "Quinto Sinistro", x: -0.30, z: -0.74 },
        { role: "ATT", name: "Punta Rapida", x: 0.15, z: 0.22 },
        { role: "ATT", name: "Centravanti", x: 0.15, z: -0.22 }
      ]
    }
  };

  // Squadre a 11
  const TEAMS = [
    {
      id: "rondine",
      name: "Rondine FC",
      icon: "🕊️",
      sub: "I ragazzi del molo e di Borgo Marino",
      shirt: 0x881337,
      trim: 0xfacc15,
      shorts: 0x1e293b,
      boots: 0x000000,
      gkShirt: 0x059669,
      ovr: 78,
      formation: "4-3-3",
      players: [
        { id: "nico", name: "Nico Ferri", num: 1, role: "P", ovr: 82, skin: 0xf0c8a0, hair: 0x332211 },
        { id: "dario", name: "Dario", num: 2, role: "TD", ovr: 77, skin: 0xd9a679, hair: 0x221100 },
        { id: "bastiano", name: "Bastiano", num: 5, role: "DC", ovr: 79, skin: 0xe0ac7e, hair: 0x111111 },
        { id: "ardo", name: "Ardo", num: 6, role: "DC", ovr: 78, skin: 0xd9a679, hair: 0x221100 },
        { id: "spartaco", name: "Spartaco", num: 3, role: "TS", ovr: 76, skin: 0xc68642, hair: 0x111111 },
        { id: "aurelio", name: "Aurelio", num: 4, role: "MED", ovr: 79, skin: 0xe0ac7e, hair: 0x553311 },
        { id: "tommy", name: "Tommy", num: 8, role: "CC", ovr: 81, skin: 0xf0c8a0, hair: 0x885522 },
        { id: "nina", name: "Nina", num: 10, role: "CC", ovr: 80, skin: 0xf0d8c0, hair: 0x221100 },
        { id: "kurogane", name: "Kurogane", num: 7, role: "AD", ovr: 83, skin: 0xf0c8a0, hair: 0x111122 },
        { id: "leo", name: "Leo Moretti", num: 9, role: "ATT", ovr: 86, skin: 0xe0ac7e, hair: 0x2b1d14 },
        { id: "cesare", name: "Cesare", num: 11, role: "AS", ovr: 82, skin: 0xd9a679, hair: 0x332211 }
      ]
    },
    {
      id: "gabbiani",
      name: "I Gabbiani del Porto",
      icon: "⚓",
      sub: "L'orgoglio ruvido dei pescatori della costa",
      shirt: 0x0284c7,
      trim: 0xe0f2fe,
      shorts: 0x0f172a,
      boots: 0x1e293b,
      gkShirt: 0xd97706,
      ovr: 74,
      formation: "4-4-2",
      players: [
        { id: "sandro", name: "Sandro", num: 1, role: "P", ovr: 76, skin: 0xe0ac7e, hair: 0x221100 },
        { id: "nereo", name: "Nereo", num: 2, role: "TD", ovr: 73, skin: 0xd9a679, hair: 0x332211 },
        { id: "moli", name: "Moli", num: 5, role: "DC", ovr: 75, skin: 0xe0ac7e, hair: 0x442211 },
        { id: "rete", name: "Rete", num: 6, role: "DC", ovr: 74, skin: 0xc68642, hair: 0x111111 },
        { id: "giasone", name: "Giasone", num: 3, role: "TS", ovr: 72, skin: 0xd9a679, hair: 0x221100 },
        { id: "scotti", name: "Scotti", num: 7, role: "ED", ovr: 75, skin: 0xf0c8a0, hair: 0x332211 },
        { id: "fra", name: "Fra", num: 4, role: "CC", ovr: 74, skin: 0xe0ac7e, hair: 0x111111 },
        { id: "biagio", name: "Biagio", num: 8, role: "CC", ovr: 75, skin: 0xf0c8a0, hair: 0x221100 },
        { id: "brace", name: "Brace", num: 11, role: "ES", ovr: 76, skin: 0xc68642, hair: 0x111111 },
        { id: "gil", name: "Gil", num: 9, role: "ATT", ovr: 78, skin: 0xd9a679, hair: 0x221100 },
        { id: "tito", name: "Tito", num: 10, role: "ATT", ovr: 76, skin: 0xe0ac7e, hair: 0x332211 }
      ]
    },
    {
      id: "faro",
      name: "Accademia del Faro",
      icon: "🗼",
      sub: "Tecnica raffinata, passaggi laser e disciplina",
      shirt: 0x1e3a8a,
      trim: 0xfbbf24,
      shorts: 0xf8fafc,
      boots: 0x0f172a,
      gkShirt: 0x15803d,
      ovr: 81,
      formation: "3-5-2",
      players: [
        { id: "garnier", name: "Antoine Garnier", num: 1, role: "P", ovr: 85, skin: 0xf0d8c0, hair: 0x111122 },
        { id: "orione", name: "Orione", num: 2, role: "DC", ovr: 80, skin: 0xd9a679, hair: 0x221100 },
        { id: "wagner", name: "Wagner", num: 5, role: "LIB", ovr: 82, skin: 0xf0c8a0, hair: 0x885522 },
        { id: "ishikawa", name: "Ishikawa", num: 3, role: "DC", ovr: 81, skin: 0xf0c8a0, hair: 0x111111 },
        { id: "marino", name: "Marino", num: 7, role: "ED", ovr: 79, skin: 0xe0ac7e, hair: 0x221100 },
        { id: "ysolde", name: "Ysolde", num: 4, role: "MED", ovr: 82, skin: 0xf0d8c0, hair: 0xb45309 },
        { id: "brunilde", name: "Brunilde", num: 8, role: "CC", ovr: 80, skin: 0xf0c8a0, hair: 0xd97706 },
        { id: "vega", name: "Vega", num: 10, role: "CC", ovr: 84, skin: 0xe0ac7e, hair: 0x7c3aed },
        { id: "alba", name: "Alba", num: 11, role: "ES", ovr: 79, skin: 0xf0d8c0, hair: 0xc2410c },
        { id: "ettore", name: "Ettore", num: 9, role: "ATT", ovr: 83, skin: 0xe0ac7e, hair: 0x111122 },
        { id: "barone", name: "Il Barone", num: 19, role: "ATT", ovr: 82, skin: 0xf0d8c0, hair: 0x334155 }
      ]
    },
    {
      id: "ciabatta",
      name: "Real Ciabatta",
      icon: "🥖",
      sub: "Grinta ruspante, pressing asfissiante e contropiede",
      shirt: 0xeab308,
      trim: 0x15803d,
      shorts: 0x15803d,
      boots: 0x000000,
      gkShirt: 0x3b82f6,
      ovr: 72,
      formation: "4-4-2",
      players: [
        { id: "berto", name: "Berto", num: 1, role: "P", ovr: 74, skin: 0xd9a679, hair: 0x221100 },
        { id: "bepi", name: "Bepi Sasso", num: 2, role: "TD", ovr: 71, skin: 0xe0ac7e, hair: 0x111111 },
        { id: "toni", name: "Toni Vigna", num: 5, role: "DC", ovr: 73, skin: 0xd9a679, hair: 0x332211 },
        { id: "gigio", name: "Gigio Ruota", num: 6, role: "DC", ovr: 72, skin: 0xc68642, hair: 0x221100 },
        { id: "nane", name: "Nane", num: 3, role: "TS", ovr: 70, skin: 0xe0ac7e, hair: 0x442211 },
        { id: "dodo", name: "Dodo Lampo", num: 7, role: "ED", ovr: 73, skin: 0xf0c8a0, hair: 0x221100 },
        { id: "marta", name: "Marta Fiore", num: 4, role: "CC", ovr: 74, skin: 0xf0d8c0, hair: 0x884411 },
        { id: "ciccio", name: "Ciccio Botte", num: 8, role: "CC", ovr: 71, skin: 0xd9a679, hair: 0x111111 },
        { id: "ines", name: "Ines Granaio", num: 11, role: "ES", ovr: 74, skin: 0xf0c8a0, hair: 0x552200 },
        { id: "rino", name: "Rino Corriera", num: 9, role: "ATT", ovr: 75, skin: 0xe0ac7e, hair: 0x221100 },
        { id: "pio", name: "Pio", num: 10, role: "ATT", ovr: 73, skin: 0xd9a679, hair: 0x332211 }
      ]
    }
  ];

  // Rilevamento Software GL per disattivare ombre pesanti se in ambiente emulato
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

  const CAM_MODES = [
    { id: "broadcast", label: "TV", title: "TV Broadcast (Laterale FIFA)" },
    { id: "tactical", label: "Tattica", title: "Tattica Panoramica (Grandangolo)" },
    { id: "endtoend", label: "Dietro", title: "Dietro il Giocatore (Profondità)" },
    { id: "action", label: "Action", title: "Action Dinamica (Ravvicinata)" }
  ];

  function loadRec() {
    const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {};
    return {
      stadium: STADIUMS[r.stadium] ? r.stadium : "riviera",
      cam: CAM_MODES.some((m) => m.id === r.cam) ? r.cam : "broadcast",
      team: r.team || "rondine",
      formation: FORMATIONS[r.formation] ? r.formation : "4-3-3",
      played: r.played | 0,
      wins: r.wins | 0,
      goals: r.goals | 0,
      cups: r.cups | 0,
      duration: r.duration === 180 ? 180 : r.duration === 300 ? 300 : 90,
      cupRun: r.cupRun && typeof r.cupRun.round === "number" ? r.cupRun : null
    };
  }
  function saveRec(r) { safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0); }

  function sfx(kind) {
    safe(() => {
      if (window.sfx) {
        if (kind === "kick" || kind === "pass") window.sfx("kick");
        else if (kind === "goal") window.sfx("goal");
        else if (kind === "whistle") window.sfx("jingle");
        else if (kind === "tackle") window.sfx("ding");
      }
    }, 0);
  }

  let OV = null, BACK = null, M = null;

  function css() {
    if (document.getElementById("c11Style")) return;
    const st = document.createElement("style");
    st.id = "c11Style";
    st.textContent = `.c11Ov{position:fixed;inset:0;z-index:335;background:#090d18;color:#f8fafc;font-family:"M PLUS Rounded 1c",system-ui,sans-serif;overflow-y:auto;overflow-x:hidden}
.c11Ov *{box-sizing:border-box}
.c11Wrap{max-width:680px;margin:0 auto;padding:12px 14px 34px}
.c11Bar{display:flex;justify-content:space-between;align-items:center;gap:10px;position:sticky;top:0;background:#090d18;padding:8px 0;z-index:10;border-bottom:1px solid #1e293b}
.c11Bar h2{margin:0;font:900 clamp(16px,4.2vw,22px)/1.2 system-ui;color:#ffd23f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c11Bar .x{width:38px;height:38px;border-radius:10px;border:1px solid #475569;background:#1e293b;color:#f8fafc;font-size:16px;cursor:pointer;flex-shrink:0}
.c11Sum{font-size:13px;line-height:1.45;color:#cbd5e1;margin:8px 0}
.c11Sec{margin:14px 0 8px;font:800 13px system-ui;color:#7dd3fc;text-transform:uppercase;letter-spacing:.5px;display:flex;justify-content:space-between;align-items:center}
.c11Stage{position:relative;width:100%;aspect-ratio:16/10;max-height:55vh;background:#020617;border:2px solid #334155;border-radius:14px;overflow:hidden;touch-action:none}
.c11Stage canvas{display:block;width:100%!important;height:100%!important}
.c11CamBtn{position:absolute;top:8px;right:8px;background:rgba(15,23,42,0.85);border:1.5px solid #38bdf8;border-radius:8px;color:#f8fafc;font:800 11.5px system-ui;padding:5px 9px;cursor:pointer;z-index:15;display:flex;align-items:center;gap:4px;touch-action:manipulation;box-shadow:0 2px 8px rgba(0,0,0,0.45);backdrop-filter:blur(4px);transition:all .15s}
.c11CamBtn:active{transform:scale(0.95);background:#0369a1}
.c11CamBtn b{color:#ffd23f}
.c11Hud{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;background:#0f172a;border:1px solid #334155;border-radius:12px;padding:8px 12px;margin:6px 0}
.c11ScoreSide{font:800 13px system-ui;display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.c11ScoreSide.opp{justify-content:flex-end;color:#fda4af}
.c11ScoreSide.me{color:#7dd3fc}
.c11ScoreMid{text-align:center;padding:0 8px}
.c11ScoreMid b{font:900 22px/1 system-ui;color:#ffd23f;letter-spacing:1px}
.c11ScoreMid span{display:block;font:800 11px system-ui;color:#cbd5e1;margin-top:2px}
.c11Pad{display:grid;grid-template-columns:116px 1fr;gap:12px;align-items:center;margin-top:10px;touch-action:none;user-select:none;-webkit-user-select:none}
.c11Stick{position:relative;width:112px;height:112px;border-radius:50%;background:radial-gradient(circle at 50% 38%,#1e293b,#0f172a 75%);border:2px solid #38bdf8;touch-action:none;margin:0 auto;box-shadow:inset 0 0 14px rgba(0,0,0,.6)}
.c11StickKnob{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#67e8f9,#0891b2 75%);border:2px solid #cffafe;box-shadow:0 3px 10px rgba(0,0,0,.6);pointer-events:none}
.c11Btns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.c11Btn{min-height:50px;border-radius:10px;border:1.5px solid #38bdf8;background:#1e293b;color:#f8fafc;font:800 12.5px system-ui;padding:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;touch-action:manipulation}
.c11Btn small{font-size:9px;color:#94a3b8;font-weight:700;margin-top:2px}
.c11Btn.pass{border-color:#38bdf8;background:#0c4a6e;color:#e0f2fe}
.c11Btn.filt{border-color:#4ade80;background:#14532d;color:#dcfce7}
.c11Btn.shoot{border-color:#ffd23f;background:#78350f;color:#fef08a}
.c11Btn.tack{border-color:#f87171;background:#7f1d1d;color:#fee2e2}
.c11Btn.switch{border-color:#c084fc;background:#581c87;color:#f3e8ff}
.c11Btn.sprint{border-color:#fb923c;background:#7c2d12;color:#ffedd5}
.c11Banner{position:absolute;left:10px;right:10px;top:10px;background:rgba(15,23,42,0.95);border:2px solid #ffd23f;border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;pointer-events:none;z-index:12;transition:opacity .25s,transform .25s}
.c11Banner[hidden]{display:none!important}
.c11Banner b{font:900 14px system-ui;color:#ffd23f}
.c11Banner span{font:700 11px system-ui;color:#e2e8f0}
.c11Radar{position:absolute;left:50%;transform:translateX(-50%);bottom:6px;width:120px;height:42px;background:rgba(2,6,23,0.78);border:1px solid #475569;border-radius:6px;pointer-events:none}
.c11Grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:8px 0}
.c11Card{background:#151f36;border:1.5px solid #334155;border-radius:12px;padding:10px;cursor:pointer;touch-action:manipulation;transition:border-color .15s}
.c11Card.on{border-color:#ffd23f;background:#1e2946}
.c11Card b{display:block;font:800 13px system-ui;color:#ffd23f}
.c11Card span{display:block;font-size:11px;color:#cbd5e1;margin-top:2px}
.c11BigBtn{width:100%;min-height:56px;border-radius:12px;border:2px solid #ffd23f;background:linear-gradient(135deg,#78350f,#1e293b);color:#fef08a;font:900 16px system-ui;cursor:pointer;padding:8px 12px;margin:10px 0;display:flex;justify-content:space-between;align-items:center;touch-action:manipulation}
.c11BigBtn small{display:block;font:400 11px system-ui;color:#cbd5e1;margin-top:2px}
.c11KeyHint{text-align:center;font-size:11px;color:#94a3b8;margin-top:8px}`;
    document.head.appendChild(st);
  }

  function shell(title, hideBack) {
    css();
    if (OV) { OV.remove(); OV = null; }
    OV = document.createElement("div");
    OV.className = "c11Ov";
    OV.innerHTML = `<div class="c11Wrap"><div class="c11Bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="c11Body"></div></div>`;
    OV.querySelector(".x").onclick = () => {
      closeMatch();
      close();
    };
    document.body.appendChild(OV);
    return OV.querySelector(".c11Body");
  }

  function close() {
    closeMatch();
    if (OV) { OV.remove(); OV = null; }
    if (typeof BACK === "function") BACK();
  }

  function closeMatch() {
    if (M) {
      if (M.animId) cancelAnimationFrame(M.animId);
      if (M.keyCleanup) M.keyCleanup();
      if (M.renderer) {
        safe(() => M.renderer.dispose());
        safe(() => {
          const gl = M.renderer.getContext();
          const lose = gl && gl.getExtension("WEBGL_lose_context");
          if (lose) lose.loseContext();
        });
      }
      M = null;
    }
  }

  // Costruzione Campo Regolamentare 3D
  function buildPitchTexture(THREE, stad) {
    const cv = document.createElement("canvas");
    cv.width = 1024;
    cv.height = 664;
    const c = cv.getContext("2d");
    const W = cv.width, H = cv.height;

    // Erba a strisce verticali
    const stripes = 15;
    const sw = W / stripes;
    for (let i = 0; i < stripes; i++) {
      c.fillStyle = i % 2 === 0 ? stad.grass1 : stad.grass2;
      c.fillRect(i * sw, 0, sw + 1, H);
    }

    // Linee di gioco regolamentari
    c.strokeStyle = stad.lineColor;
    c.lineWidth = 6;
    const m = 30; // Margine esterno
    const pw = W - m * 2;
    const ph = H - m * 2;

    // Perimetro
    c.strokeRect(m, m, pw, ph);

    // Linea di metà campo e cerchio di centrocampo
    c.beginPath(); c.moveTo(W / 2, m); c.lineTo(W / 2, H - m); c.stroke();
    c.beginPath(); c.arc(W / 2, H / 2, 88, 0, Math.PI * 2); c.stroke();
    c.fillStyle = stad.lineColor;
    c.beginPath(); c.arc(W / 2, H / 2, 7, 0, Math.PI * 2); c.fill();

    // Aree di Rigore (sinistra e destra)
    const penW = 150, penH = 340;
    c.strokeRect(m, H / 2 - penH / 2, penW, penH);
    c.strokeRect(W - m - penW, H / 2 - penH / 2, penW, penH);

    // Aree Piccole (sinistra e destra)
    const smW = 54, smH = 160;
    c.strokeRect(m, H / 2 - smH / 2, smW, smH);
    c.strokeRect(W - m - smW, H / 2 - smH / 2, smW, smH);

    // Dischetti del rigore
    const spotDist = 105;
    c.beginPath(); c.arc(m + spotDist, H / 2, 5, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(W - m - spotDist, H / 2, 5, 0, Math.PI * 2); c.fill();

    // Lunette dell'area di rigore
    c.beginPath(); c.arc(m + spotDist, H / 2, 88, -0.65, 0.65); c.stroke();
    c.beginPath(); c.arc(W - m - spotDist, H / 2, 88, Math.PI - 0.65, Math.PI + 0.65); c.stroke();

    // Bandierine d'angolo (archi)
    c.beginPath(); c.arc(m, m, 22, 0, Math.PI / 2); c.stroke();
    c.beginPath(); c.arc(W - m, m, 22, Math.PI / 2, Math.PI); c.stroke();
    c.beginPath(); c.arc(W - m, H - m, 22, Math.PI, Math.PI * 1.5); c.stroke();
    c.beginPath(); c.arc(m, H - m, 22, Math.PI * 1.5, Math.PI * 2); c.stroke();

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  // Texture Rete 3D per le Porte
  function buildNetTexture(THREE) {
    const cv = document.createElement("canvas");
    cv.width = 128; cv.height = 128;
    const c = cv.getContext("2d");
    c.clearRect(0, 0, 128, 128);
    c.strokeStyle = "rgba(255,255,255,0.85)";
    c.lineWidth = 3;
    for (let x = 0; x <= 128; x += 16) {
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 128); c.stroke();
    }
    for (let y = 0; y <= 128; y += 16) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(128, y); c.stroke();
    }
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 4);
    tex.needsUpdate = true;
    return tex;
  }

  // Costruzione Porta 3D Regolamentare
  function buildGoal3D(THREE, isRightSide, netTex) {
    const goal = new THREE.Group();
    const matPost = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.6 });
    const postR = 0.09;

    // Palo sinistro e destro
    const postGeo = new THREE.CylinderGeometry(postR, postR, GH, 12);
    const post1 = new THREE.Mesh(postGeo, matPost);
    post1.position.set(0, GH / 2, -GW / 2);
    const post2 = new THREE.Mesh(postGeo, matPost);
    post2.position.set(0, GH / 2, GW / 2);
    goal.add(post1, post2);

    // Traversa
    const crossGeo = new THREE.CylinderGeometry(postR, postR, GW + postR * 2, 12);
    const cross = new THREE.Mesh(crossGeo, matPost);
    cross.rotation.x = Math.PI / 2;
    cross.position.set(0, GH, 0);
    goal.add(cross);

    // Sostegno posteriore
    const backSign = isRightSide ? 1 : -1;
    const matBack = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
    const supGeo = new THREE.CylinderGeometry(0.04, 0.04, GD, 8);
    const s1 = new THREE.Mesh(supGeo, matBack);
    s1.rotation.y = Math.PI / 2;
    s1.position.set(backSign * (GD / 2), GH, -GW / 2);
    const s2 = new THREE.Mesh(supGeo, matBack);
    s2.rotation.y = Math.PI / 2;
    s2.position.set(backSign * (GD / 2), GH, GW / 2);
    goal.add(s1, s2);

    // Rete 3D (Cassa posteriore)
    const netMat = new THREE.MeshBasicMaterial({ map: netTex, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    const netGeo = new THREE.BoxGeometry(GD, GH, GW);
    const netMesh = new THREE.Mesh(netGeo, netMat);
    netMesh.position.set(backSign * (GD / 2), GH / 2, 0);
    goal.add(netMesh);

    return goal;
  }

  // Costruzione Atleta 3D procedurale ottimizzato per 60 FPS
  function buildAthleteMesh(THREE, cfg) {
    const grp = new THREE.Group();

    const matSkin = new THREE.MeshStandardMaterial({ color: cfg.skin || 0xe0ac7e, roughness: 0.65 });
    const matHair = new THREE.MeshStandardMaterial({ color: cfg.hair || 0x221100, roughness: 0.8 });
    const matShirt = new THREE.MeshStandardMaterial({ color: cfg.shirt, roughness: 0.55, metalness: 0.1 });
    const matShorts = new THREE.MeshStandardMaterial({ color: cfg.shorts, roughness: 0.7 });
    const matBoots = new THREE.MeshStandardMaterial({ color: cfg.boots, roughness: 0.3 });

    // Ombra circolare a terra
    const shGeo = new THREE.CircleGeometry(0.55, 14);
    const shMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
    const shadow = new THREE.Mesh(shGeo, shMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.015;
    grp.add(shadow);

    // Anello di selezione cursore
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.52, 0.68, 20), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    ring.visible = false;
    grp.add(ring);

    // Cursore diamante 3D sopra la testa del giocatore attivo
    const cursorMat = new THREE.MeshStandardMaterial({ color: 0xffd23f, emissive: 0xf59e0b, emissiveIntensity: 0.7 });
    const cursor = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), cursorMat);
    cursor.scale.set(0.9, 1.3, 0.9);
    cursor.position.y = 2.45;
    cursor.visible = false;
    grp.add(cursor);

    const body = new THREE.Group();
    grp.add(body);

    // Gambe articolate (per animazione di corsa ciclica)
    function makeLeg(xOffset) {
      const legPiv = new THREE.Group();
      legPiv.position.set(xOffset, 0.68, 0);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.32, 8), matSkin);
      thigh.position.y = -0.16;
      legPiv.add(thigh);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.32, 8), matShirt);
      shin.position.y = -0.42;
      legPiv.add(shin);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.22), matBoots);
      boot.position.set(0, -0.62, 0.04);
      legPiv.add(boot);

      body.add(legPiv);
      return legPiv;
    }

    const legL = makeLeg(-0.16);
    const legR = makeLeg(0.16);

    // Pantaloncini
    const shorts = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.3, 10), matShorts);
    shorts.position.y = 0.78;
    body.add(shorts);

    // Busto atletico con maglia della squadra
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.23, 0.54, 10), matShirt);
    torso.position.y = 1.16;
    body.add(torso);

    // Braccia
    function makeArm(xOffset) {
      const armPiv = new THREE.Group();
      armPiv.position.set(xOffset, 1.36, 0);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.2, 8), matShirt);
      sleeve.position.y = -0.1;
      armPiv.add(sleeve);
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.32, 8), matSkin);
      arm.position.y = -0.32;
      armPiv.add(arm);
      body.add(armPiv);
      return armPiv;
    }

    const armL = makeArm(-0.34);
    const armR = makeArm(0.34);

    // Collo e Testa
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 8), matSkin);
    neck.position.y = 1.48;
    body.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), matSkin);
    head.position.y = 1.68;
    body.add(head);

    // Capelli
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 8), matHair);
    hair.position.set(0, 1.74, -0.04);
    hair.scale.set(1.02, 0.95, 1.05);
    body.add(hair);

    return {
      root: grp,
      body,
      legL,
      legR,
      armL,
      armR,
      ring,
      cursor,
      step: 0
    };
  }

  // Costruzione Spalti & Cartelloni Perimetrali
  function buildStadiumProps(THREE, scene, stad) {
    const props = new THREE.Group();

    // Cartelloni pubblicitari attorno al campo
    const adMat = new THREE.MeshStandardMaterial({ color: stad.adCol, roughness: 0.4 });
    const adGeoL = new THREE.BoxGeometry(FW + 10, 1.0, 0.4);
    const ad1 = new THREE.Mesh(adGeoL, adMat);
    ad1.position.set(0, 0.5, HZ + 2.5);
    const ad2 = new THREE.Mesh(adGeoL, adMat);
    ad2.position.set(0, 0.5, -HZ - 2.5);
    props.add(ad1, ad2);

    const adGeoW = new THREE.BoxGeometry(0.4, 1.0, FD + 4);
    const ad3 = new THREE.Mesh(adGeoW, adMat);
    ad3.position.set(HX + 4.5, 0.5, 0);
    const ad4 = new THREE.Mesh(adGeoW, adMat);
    ad4.position.set(-HX - 4.5, 0.5, 0);
    props.add(ad3, ad4);

    // Spalti laterali a gradoni
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    for (let g = 0; g < 4; g++) {
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(FW + 14, 1.2, 3.5), standMat);
      stepMesh.position.set(0, 0.6 + g * 1.2, HZ + 5.5 + g * 3.5);
      props.add(stepMesh);
    }

    // 4 Torri Faro perimetrali
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const corners = [
      [HX + 8, HZ + 8],
      [HX + 8, -HZ - 8],
      [-HX - 8, HZ + 8],
      [-HX - 8, -HZ - 8]
    ];
    corners.forEach(([tx, tz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.45, 26, 8), towerMat);
      pole.position.set(tx, 13, tz);
      const head = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 1.2), headMat);
      head.position.set(tx, 26, tz);
      head.lookAt(0, 0, 0);
      props.add(pole, head);
    });

    scene.add(props);
  }

  // --- AVVIO E GESTIONE MATCH CALCIO A 11 3D ---
  function startMatch(opts) {
    const THREE = window.THREE;
    if (!THREE) {
      alert("Three.js non disponibile.");
      return;
    }

    const rec = loadRec();
    const stad = STADIUMS[opts.stadiumId || rec.stadium] || STADIUMS.riviera;
    const teamAData = TEAMS.find((t) => t.id === (opts.teamA || rec.team)) || TEAMS[0];
    const teamBData = TEAMS.find((t) => t.id === (opts.teamB || "gabbiani")) || TEAMS[1];
    const formA = FORMATIONS[opts.formationA || rec.formation] || FORMATIONS["4-3-3"];
    const formB = FORMATIONS[opts.formationB || teamBData.formation] || FORMATIONS["4-4-2"];
    const matchDur = opts.duration || rec.duration || 90;
    let curCamIdx = CAM_MODES.findIndex((m) => m.id === (opts.cam || rec.cam));
    if (curCamIdx < 0) curCamIdx = 0;

    const title = opts.isCup ? `🏆 Coppa 3D · ${esc(teamAData.name)} vs ${esc(teamBData.name)}` : `⚽ Amichevole 3D · ${esc(teamAData.name)} vs ${esc(teamBData.name)}`;
    const body = shell(title, true);

    body.innerHTML = `
      <div class="c11Hud">
        <div class="c11ScoreSide me">${teamAData.icon} <b>${esc(teamAData.name)}</b></div>
        <div class="c11ScoreMid">
          <b id="c11Score">0 – 0</b>
          <span id="c11Clock">0:00</span>
        </div>
        <div class="c11ScoreSide opp"><b>${esc(teamBData.name)}</b> ${teamBData.icon}</div>
      </div>
      <div class="c11Stage" id="c11Stage">
        <canvas id="c11Canvas"></canvas>
        <button type="button" class="c11CamBtn" id="c11CamBtn" aria-label="Cambia visuale telecamera">
          <span>📹</span> <b id="c11CamLabel">${CAM_MODES[curCamIdx].label}</b>
        </button>
        <div class="c11Banner" id="c11Banner" hidden>
          <b id="c11BanTitle">GOL!</b>
          <span id="c11BanSub">Leo Moretti</span>
        </div>
        <div class="c11Radar" id="c11Radar">
          <canvas id="c11RadarCv" width="120" height="42"></canvas>
        </div>
      </div>
      <div class="c11Pad">
        <div class="c11Stick" id="c11Stick" aria-label="Joystick analogico">
          <div class="c11StickKnob" id="c11Knob"></div>
        </div>
        <div class="c11Btns">
          <button type="button" class="c11Btn pass" data-b="pass">🎯 Passa<small>Rasoterra</small></button>
          <button type="button" class="c11Btn filt" data-b="filt">⚡ Filtra<small>Profondità</small></button>
          <button type="button" class="c11Btn shoot" data-b="shoot">⚽ Tira<small>Carica forza</small></button>
          <button type="button" class="c11Btn tack" data-b="tack">🛡️ Contrasto<small>Scivolata</small></button>
          <button type="button" class="c11Btn switch" data-b="switch">👥 Cursore<small>Cambio</small></button>
          <button type="button" class="c11Btn sprint" data-b="sprint">💨 Scatto<small>Sprint</small></button>
        </div>
      </div>
      <div class="c11KeyHint">Tastiera: WASD/Frecce = Movimento · J/Z = Passa · I/X = Filtrante · K/C = Tira · L/F = Contrasto/Scivolata · V = Telecamera · Spazio = Scatto · Q = Cursore</div>
    `;

    const canvas = body.querySelector("#c11Canvas");
    const radarCv = body.querySelector("#c11RadarCv");
    const radarCtx = radarCv.getContext("2d");

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !IS_SW_GL,
        powerPreference: "high-performance"
      });
    } catch (e) {
      body.innerHTML = `<div style="padding:24px;text-align:center">Impossibile avviare WebGL su questo dispositivo.</div>`;
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(IS_SW_GL ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !IS_SW_GL;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(stad.sky);
    scene.fog = new THREE.FogExp2(stad.fog, stad.fogD);

    const camera = new THREE.PerspectiveCamera(48, 16 / 10, 0.5, 250);

    // Illuminazione
    const hemi = new THREE.HemisphereLight(stad.hemiSky, stad.hemiGnd, 0.75);
    scene.add(hemi);

    const dirLight = new THREE.DirectionalLight(stad.lightColor, 1.35);
    dirLight.position.set(20, 40, 30);
    if (!IS_SW_GL) {
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.set(1024, 1024);
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 120;
      dirLight.shadow.camera.left = -60;
      dirLight.shadow.camera.right = 60;
      dirLight.shadow.camera.top = 40;
      dirLight.shadow.camera.bottom = -40;
    }
    scene.add(dirLight);

    // Manto erboso del campo
    const pitchTex = buildPitchTexture(THREE, stad);
    const pitchMat = new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.82 });
    const pitchMesh = new THREE.Mesh(new THREE.PlaneGeometry(FW + 8, FD + 8), pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.receiveShadow = !IS_SW_GL;
    scene.add(pitchMesh);

    // Spalti e torri faro
    buildStadiumProps(THREE, scene, stad);

    // Porte 3D
    const netTex = buildNetTexture(THREE);
    const goalLeft = buildGoal3D(THREE, false, netTex);
    goalLeft.position.set(-HX, 0, 0);
    const goalRight = buildGoal3D(THREE, true, netTex);
    goalRight.position.set(HX, 0, 0);
    goalRight.rotation.y = Math.PI;
    scene.add(goalLeft, goalRight);

    // Pallone 3D
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(BALL_R, 14, 12), ballMat);
    ballMesh.castShadow = !IS_SW_GL;
    scene.add(ballMesh);

    // Ombra del pallone
    const ballShadow = new THREE.Mesh(
      new THREE.CircleGeometry(BALL_R * 1.3, 12),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 })
    );
    ballShadow.rotation.x = -Math.PI / 2;
    ballShadow.position.y = 0.02;
    scene.add(ballShadow);

    // Creazione 22 Atleti
    const teamA = [];
    const teamB = [];

    for (let i = 0; i < 11; i++) {
      const plDataA = teamAData.players[i] || { name: `A${i + 1}`, num: i + 1, role: "CC", skin: 0xe0ac7e, hair: 0x221100 };
      const isGkA = i === 0;
      const meshA = buildAthleteMesh(THREE, {
        skin: plDataA.skin,
        hair: plDataA.hair,
        shirt: isGkA ? teamAData.gkShirt : teamAData.shirt,
        shorts: teamAData.shorts,
        boots: teamAData.boots
      });
      scene.add(meshA.root);
      teamA.push({
        idx: i,
        team: "A",
        data: plDataA,
        mesh: meshA,
        x: formA.slots[i].x * (HX * 0.9),
        z: formA.slots[i].z * (HZ * 0.85),
        vx: 0,
        vz: 0,
        baseX: formA.slots[i].x * (HX * 0.9),
        baseZ: formA.slots[i].z * (HZ * 0.85),
        rot: 0,
        spd: 0.16 + (plDataA.ovr || 75) * 0.0008,
        stamina: 100,
        hasBall: false,
        tackleCooldown: 0,
        tackleTime: 0,
        pressTicks: 0
      });

      const plDataB = teamBData.players[i] || { name: `B${i + 1}`, num: i + 1, role: "CC", skin: 0xd9a679, hair: 0x111111 };
      const isGkB = i === 0;
      const meshB = buildAthleteMesh(THREE, {
        skin: plDataB.skin,
        hair: plDataB.hair,
        shirt: isGkB ? teamBData.gkShirt : teamBData.shirt,
        shorts: teamBData.shorts,
        boots: teamBData.boots
      });
      scene.add(meshB.root);
      // Team B specchiato verso sinistra
      teamB.push({
        idx: i,
        team: "B",
        data: plDataB,
        mesh: meshB,
        x: -formB.slots[i].x * (HX * 0.9),
        z: -formB.slots[i].z * (HZ * 0.85),
        vx: 0,
        vz: 0,
        baseX: -formB.slots[i].x * (HX * 0.9),
        baseZ: -formB.slots[i].z * (HZ * 0.85),
        rot: Math.PI,
        spd: 0.15 + (plDataB.ovr || 75) * 0.0008,
        stamina: 100,
        hasBall: false,
        tackleCooldown: 0,
        tackleTime: 0,
        pressTicks: 0
      });
    }

    let activeAIdx = 9; // Leo Moretti (Centravanti) o giocatore più vicino
    let scoreA = 0, scoreB = 0;
    let matchTime = matchDur;
    let ball = { x: 0, y: BALL_R, z: 0, vx: 0, vy: 0, vz: 0, holder: null, lastKick: "A" };
    let inputStick = { x: 0, z: 0 };
    let isSprinting = false;
    let isChargingShoot = false;
    let shootCharge = 0;
    let bannerTimer = 0;

    // Oggetto stato globale del match
    M = {
      running: true,
      animId: 0,
      renderer,
      keyCleanup: null
    };

    // Kickoff iniziale
    function resetPositions(servingTeam) {
      ball.x = 0; ball.y = BALL_R; ball.z = 0;
      ball.vx = 0; ball.vy = 0; ball.vz = 0;
      ball.holder = null;
      ball.lastKick = servingTeam;

      teamA.forEach((p, idx) => {
        p.x = p.baseX; p.z = p.baseZ;
        p.vx = 0; p.vz = 0; p.hasBall = false;
      });
      teamB.forEach((p, idx) => {
        p.x = p.baseX; p.z = p.baseZ;
        p.vx = 0; p.vz = 0; p.hasBall = false;
      });

      if (servingTeam === "A") {
        teamA[9].x = -1.2; teamA[9].z = 0;
        ball.holder = teamA[9];
        activeAIdx = 9;
      } else {
        teamB[9].x = 1.2; teamB[9].z = 0;
        ball.holder = teamB[9];
      }
    }

    resetPositions("A");

    // Banner notifiche in-game (Gol, Parata, Fischio)
    function showBanner(title, sub, durMs) {
      const bEl = body.querySelector("#c11Banner");
      if (!bEl) return;
      bEl.querySelector("#c11BanTitle").textContent = title;
      bEl.querySelector("#c11BanSub").textContent = sub;
      bEl.hidden = false;
      clearTimeout(bannerTimer);
      bannerTimer = setTimeout(() => { if (bEl) bEl.hidden = true; }, durMs || 2500);
    }

    showBanner("FISCHIO D'INIZIO!", `${teamAData.name} vs ${teamBData.name}`, 2200);
    sfx("whistle");

    // Azioni di Gioco
    function doPass() {
      const user = teamA[activeAIdx];
      if (ball.holder !== user) return;
      // Cerca il compagno libero più vicino alla direzione puntata
      let bestP = null, maxScore = -999;
      const dirX = inputStick.x !== 0 ? inputStick.x : 1;
      const dirZ = inputStick.z;
      teamA.forEach((p) => {
        if (p === user || p.idx === 0) return; // Non passare al portiere
        const dx = p.x - user.x;
        const dz = p.z - user.z;
        const dist = hypot(dx, dz);
        if (dist > 35 || dist < 2) return;
        const dot = (dx * dirX + dz * dirZ) / (dist || 1);
        const score = dot * 10 - dist * 0.15 + (p.x > user.x ? 2 : 0);
        if (score > maxScore) { maxScore = score; bestP = p; }
      });

      if (!bestP) bestP = teamA.find((p) => p !== user && p.idx !== 0);
      if (bestP) {
        ball.holder = null;
        const dx = bestP.x - user.x, dz = bestP.z - user.z;
        const d = hypot(dx, dz);
        ball.vx = (dx / d) * 1.35;
        ball.vz = (dz / d) * 1.35;
        ball.vy = 0.08;
        ball.lastKick = "A";
        activeAIdx = bestP.idx;
        sfx("pass");
      }
    }

    function doThroughPass() {
      const user = teamA[activeAIdx];
      if (ball.holder !== user) return;
      // Passaggio filtrante nello spazio avanti
      ball.holder = null;
      const dx = inputStick.x !== 0 ? inputStick.x : 1;
      const dz = inputStick.z;
      const d = hypot(dx, dz) || 1;
      ball.vx = (dx / d) * 1.75;
      ball.vz = (dz / d) * 1.75;
      ball.vy = 0.12;
      ball.lastKick = "A";
      sfx("pass");
    }

    function releaseShoot() {
      const user = teamA[activeAIdx];
      if (ball.holder !== user) return;
      ball.holder = null;
      const power = clamp(shootCharge, 0.3, 1.0);
      // Mira verso la porta avversaria (HX, 0) con leggera deviazione Z data dal joystick
      const targetZ = inputStick.z * (GW * 0.45);
      const dx = HX - user.x;
      const dz = targetZ - user.z;
      const d = hypot(dx, dz) || 1;
      ball.vx = (dx / d) * (1.6 + power * 1.2);
      ball.vz = (dz / d) * (1.6 + power * 1.2);
      ball.vy = 0.25 + power * 0.45;
      ball.lastKick = "A";
      sfx("kick");
      shootCharge = 0;
    }

    function doTackle() {
      const user = teamA[activeAIdx];
      // Slancio in avanti del giocatore controllato dall'utente
      const fX = Math.cos(user.rot);
      const fZ = Math.sin(user.rot);
      user.vx += fX * 0.42;
      user.vz += fZ * 0.42;
      user.tackleTime = 0.45;
      sfx("tackle");

      // 1. Se un avversario ha la palla
      if (ball.holder && ball.holder.team === "B") {
        const opp = ball.holder;
        const dist = hypot(user.x - opp.x, user.z - opp.z);
        if (dist < 4.2) {
          ball.holder = user;
          ball.lastKick = "A";
          opp.vx *= 0.2;
          opp.vz *= 0.2;
          opp.tackleCooldown = 1.4;
          showBanner("GRAN CONTRASTO!", `${user.data.name} ruba palla a ${opp.data.name}!`, 1400);
          return;
        }
      }

      // 2. Se la palla è libera ma vicina
      if (!ball.holder) {
        const distB = hypot(user.x - ball.x, user.z - ball.z);
        if (distB < 4.5) {
          ball.holder = user;
          ball.lastKick = "A";
          showBanner("INTERCETTO IN SCIVOLATA!", user.data.name, 1200);
          return;
        }
      }

      // 3. Spallata di contrasto su qualsiasi avversario vicino
      teamB.forEach((opp) => {
        if (opp.idx === 0) return;
        const d = hypot(user.x - opp.x, user.z - opp.z);
        if (d < 3.2) {
          opp.vx += fX * 0.35;
          opp.vz += fZ * 0.35;
        }
      });
    }

    function cycleCamera() {
      curCamIdx = (curCamIdx + 1) % CAM_MODES.length;
      const mode = CAM_MODES[curCamIdx];
      rec.cam = mode.id;
      saveRec(rec);
      const labelEl = body.querySelector("#c11CamLabel");
      if (labelEl) labelEl.textContent = mode.label;
      showBanner("TELECAMERA 3D", mode.title, 1400);
    }

    const camBtn = body.querySelector("#c11CamBtn");
    if (camBtn) camBtn.onclick = () => cycleCamera();

    function switchActivePlayer() {
      // Seleziona il compagno di movimento più vicino alla palla
      let bestIdx = activeAIdx, minDist = 999;
      teamA.forEach((p) => {
        if (p.idx === 0) return; // Non selezionare manualmente il portiere
        const d = hypot(p.x - ball.x, p.z - ball.z);
        if (d < minDist) { minDist = d; bestIdx = p.idx; }
      });
      activeAIdx = bestIdx;
    }

    // Eventi Joystick Touch Virtuale
    const stickEl = body.querySelector("#c11Stick");
    const knobEl = body.querySelector("#c11Knob");
    let touchId = null;

    if (stickEl) {
      const onTouchMove = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          if (t.identifier === touchId) {
            const rect = stickEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            let dx = t.clientX - cx;
            let dy = t.clientY - cy;
            const dist = hypot(dx, dy);
            const maxR = 40;
            if (dist > maxR) {
              dx = (dx / dist) * maxR;
              dy = (dy / dist) * maxR;
            }
            knobEl.style.transform = `translate(${dx}px, ${dy}px)`;
            // Mappatura X e Z: asse X Three.js = lunghezza campo, asse Z = larghezza
            inputStick.x = dx / maxR;
            inputStick.z = dy / maxR;
          }
        }
      };

      const onTouchEnd = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            touchId = null;
            knobEl.style.transform = "translate(0px, 0px)";
            inputStick.x = 0;
            inputStick.z = 0;
          }
        }
      };

      stickEl.addEventListener("touchstart", (e) => {
        if (touchId === null && e.changedTouches.length > 0) {
          touchId = e.changedTouches[0].identifier;
          onTouchMove(e);
        }
      }, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    }

    // Eventi Pulsanti Touch
    body.querySelectorAll("[data-b]").forEach((btn) => {
      const bType = btn.dataset.b;
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (bType === "pass") doPass();
        else if (bType === "filt") doThroughPass();
        else if (bType === "shoot") { isChargingShoot = true; shootCharge = 0.2; }
        else if (bType === "tack") doTackle();
        else if (bType === "switch") switchActivePlayer();
        else if (bType === "sprint") isSprinting = true;
      });
      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        if (bType === "shoot" && isChargingShoot) { isChargingShoot = false; releaseShoot(); }
        else if (bType === "sprint") isSprinting = false;
      });
      btn.addEventListener("mousedown", () => {
        if (bType === "pass") doPass();
        else if (bType === "filt") doThroughPass();
        else if (bType === "shoot") { isChargingShoot = true; shootCharge = 0.2; }
        else if (bType === "tack") doTackle();
        else if (bType === "switch") switchActivePlayer();
        else if (bType === "sprint") isSprinting = true;
      });
      btn.addEventListener("mouseup", () => {
        if (bType === "shoot" && isChargingShoot) { isChargingShoot = false; releaseShoot(); }
        else if (bType === "sprint") isSprinting = false;
      });
    });

    // Eventi Tastiera Desktop
    const keysDown = {};
    const onKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysDown[k] = true;
      if (k === "j" || k === "z") doPass();
      if (k === "i" || k === "x") doThroughPass();
      if (k === "k" || k === "c") { isChargingShoot = true; shootCharge = 0.2; }
      if (k === "l" || k === "f") doTackle();
      if (k === "v") cycleCamera();
      if (k === "q" || k === "e") switchActivePlayer();
      if (e.key === " " || k === "shift") isSprinting = true;
    };
    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();
      keysDown[k] = false;
      if ((k === "k" || k === "c") && isChargingShoot) { isChargingShoot = false; releaseShoot(); }
      if (e.key === " " || k === "shift") isSprinting = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    M.keyCleanup = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };

    // Radar Minimappa 2D in sovrimpressione
    function updateRadar() {
      radarCtx.clearRect(0, 0, 120, 42);
      radarCtx.strokeStyle = "rgba(255,255,255,0.3)";
      radarCtx.lineWidth = 1;
      radarCtx.strokeRect(2, 2, 116, 38);
      radarCtx.beginPath(); radarCtx.moveTo(60, 2); radarCtx.lineTo(60, 40); radarCtx.stroke();

      // Punti Squadra A (blu/oro)
      radarCtx.fillStyle = "#38bdf8";
      teamA.forEach((p) => {
        const rx = 60 + (p.x / HX) * 56;
        const rz = 21 + (p.z / HZ) * 18;
        radarCtx.fillRect(rx - 1, rz - 1, 2.5, 2.5);
      });

      // Punti Squadra B (rossi)
      radarCtx.fillStyle = "#f87171";
      teamB.forEach((p) => {
        const rx = 60 + (p.x / HX) * 56;
        const rz = 21 + (p.z / HZ) * 18;
        radarCtx.fillRect(rx - 1, rz - 1, 2.5, 2.5);
      });

      // Pallone (giallo brillante)
      radarCtx.fillStyle = "#ffd23f";
      const bx = 60 + (ball.x / HX) * 56;
      const bz = 21 + (ball.z / HZ) * 18;
      radarCtx.fillRect(bx - 1.5, bz - 1.5, 3, 3);
    }

    // --- GAME LOOP A 60 FPS ---
    let lastTime = performance.now();

    function loop(now) {
      if (!M || !M.running) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Aggiornamento tastiera -> input stick se usato su desktop
      if (keysDown["w"] || keysDown["arrowup"]) inputStick.z = -1;
      else if (keysDown["s"] || keysDown["arrowdown"]) inputStick.z = 1;
      else if (touchId === null) inputStick.z = 0;

      if (keysDown["a"] || keysDown["arrowleft"]) inputStick.x = -1;
      else if (keysDown["d"] || keysDown["arrowright"]) inputStick.x = 1;
      else if (touchId === null) inputStick.x = 0;

      // Timer partita
      if (matchTime > 0) {
        matchTime -= dt;
        const mins = Math.floor(matchTime / 60);
        const secs = Math.floor(matchTime % 60);
        const clkEl = body.querySelector("#c11Clock");
        if (clkEl) clkEl.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      } else {
        // Fine Tempo
        endMatch();
        return;
      }

      // Caricamento tiro
      if (isChargingShoot) {
        shootCharge = Math.min(1.0, shootCharge + dt * 1.5);
      }

      // --- MOVIMENTO GIOCATORE ATTIVO SQUADRA A ---
      const userA = teamA[activeAIdx];
      const isInput = hypot(inputStick.x, inputStick.z) > 0.1;
      if (isInput) {
        const spdMult = isSprinting ? 1.45 : 1.0;
        userA.vx = inputStick.x * userA.spd * spdMult;
        userA.vz = inputStick.z * userA.spd * spdMult;
        userA.rot = Math.atan2(inputStick.z, inputStick.x);
      } else {
        userA.vx *= 0.82;
        userA.vz *= 0.82;
      }

      // --- FISICA E POSIZIONAMENTO 22 ATLETI ---
      const updatePlayer = (p, isUser) => {
        p.x += p.vx;
        p.z += p.vz;
        p.x = clamp(p.x, -HX + 0.5, HX - 0.5);
        p.z = clamp(p.z, -HZ + 0.5, HZ - 0.5);

        // Aggiorna mesh Three.js
        p.mesh.root.position.set(p.x, 0, p.z);
        p.mesh.root.rotation.y = -p.rot + Math.PI / 2;

        // Cursore attivo
        p.mesh.cursor.visible = isUser;
        p.mesh.ring.visible = isUser;
        if (isUser) p.mesh.cursor.rotation.y += dt * 3;

        // Cooldown tackle
        if (p.tackleCooldown > 0) p.tackleCooldown -= dt;

        // Animazione scivolata / tackle
        if (p.tackleTime > 0) {
          p.tackleTime -= dt;
          p.mesh.body.position.y = -0.32;
          p.mesh.body.rotation.x = 0.5;
          p.mesh.legL.rotation.x = 1.35;
          p.mesh.legR.rotation.x = -0.7;
          p.mesh.armL.rotation.x = -0.8;
          p.mesh.armR.rotation.x = 0.8;
        } else {
          p.mesh.body.position.y = 0;
          p.mesh.body.rotation.x = 0;
          // Animazione ciclica gambe e braccia se in movimento
          const speed = hypot(p.vx, p.vz);
          if (speed > 0.02) {
            p.mesh.step += speed * 2.8;
            const legAngle = Math.sin(p.mesh.step) * 0.65;
            p.mesh.legL.rotation.x = legAngle;
            p.mesh.legR.rotation.x = -legAngle;
            p.mesh.armL.rotation.x = -legAngle * 0.7;
            p.mesh.armR.rotation.x = legAngle * 0.7;
          } else {
            p.mesh.legL.rotation.x = 0;
            p.mesh.legR.rotation.x = 0;
            p.mesh.armL.rotation.x = 0;
            p.mesh.armR.rotation.x = 0;
          }
        }
      };

      // AI Compagni Squadra A (senza palla)
      teamA.forEach((p, idx) => {
        const isUser = idx === activeAIdx;
        if (!isUser) {
          if (idx === 0) {
            // Portiere A: protegge l'area piccola
            const targetZ = clamp(ball.z * 0.4, -GW / 2, GW / 2);
            p.x = -HX + 2.5;
            p.z += (targetZ - p.z) * 0.1;
            p.rot = 0;
          } else {
            // Movimento a fisarmonica verso la base + attrazione palla
            const targetX = p.baseX + (ball.x * 0.42);
            const targetZ = p.baseZ + (ball.z * 0.32);
            p.vx = (targetX - p.x) * 0.04;
            p.vz = (targetZ - p.z) * 0.04;
            p.rot = Math.atan2(p.vz, p.vx || 0.001);
          }
        }
        updatePlayer(p, isUser);
      });

      // AI Squadra B (avversari con pressing e contrasti)
      let chaserB = null, minBDist = 999;
      teamB.forEach((p, idx) => {
        if (idx === 0) {
          // Portiere B: protegge la porta destra
          const targetZ = clamp(ball.z * 0.4, -GW / 2, GW / 2);
          p.x = HX - 2.5;
          p.z += (targetZ - p.z) * 0.1;
          p.rot = Math.PI;
        } else {
          const dToBall = hypot(p.x - ball.x, p.z - ball.z);
          if (dToBall < minBDist) { minBDist = dToBall; chaserB = p; }
        }
      });

      teamB.forEach((p, idx) => {
        if (idx === 0) {
          updatePlayer(p, false);
          return;
        }

        // Se il giocatore B è il portatore di palla
        if (ball.holder === p) {
          // Avanza verso la porta A (-HX, 0)
          const dx = -HX - p.x, dz = -p.z;
          const distG = hypot(dx, dz) || 1;
          p.vx = (dx / distG) * p.spd * 0.95;
          p.vz = (dz / distG) * p.spd * 0.95;
          p.rot = Math.atan2(dz, dx);

          // Tiro AI se vicino alla porta avversaria
          if (p.x < -HX + 24 && Math.random() < 0.025) {
            ball.holder = null;
            ball.vx = -1.9 - Math.random() * 0.5;
            ball.vz = (Math.random() - 0.5) * 1.2;
            ball.vy = 0.35 + Math.random() * 0.3;
            ball.lastKick = "B";
            sfx("kick");
          }
        } else if (p === chaserB) {
          // Inseguitore principale della palla: PRESSING AGGRESSIVO
          const dx = ball.x - p.x, dz = ball.z - p.z;
          const d = hypot(dx, dz) || 1;
          const isPressingUser = ball.holder && ball.holder.team === "A";
          const chaseSpd = isPressingUser ? p.spd * 1.35 : p.spd * 1.1;
          p.vx = (dx / d) * chaseSpd;
          p.vz = (dz / d) * chaseSpd;
          p.rot = Math.atan2(dz, dx);

          // TENTATIVO DI TACKLE / SCIVOLATA CPU
          if (isPressingUser && d < 2.5 && p.tackleCooldown <= 0) {
            p.tackleCooldown = 1.8;
            p.tackleTime = 0.42;
            p.vx += (dx / d) * 0.4;
            p.vz += (dz / d) * 0.4;
            sfx("tackle");

            // Ruba palla se l'utente non ha passato o scattato via
            if (Math.random() < 0.72) {
              const stolenFrom = ball.holder;
              ball.holder = p;
              ball.lastKick = "B";
              stolenFrom.vx *= 0.3;
              stolenFrom.vz *= 0.3;
              showBanner("PALLA RUBATA DALLA CPU!", `${p.data.name} ti strappa il pallone!`, 1300);
            } else {
              // Rimpallo conteso
              ball.holder = null;
              ball.vx = (dx / d) * 1.2;
              ball.vz = (dz / d) * 1.2;
              ball.lastKick = "B";
              showBanner("CONTRASTO DURO!", "Palla contesa a centrocampo!", 1100);
            }
          }
        } else {
          // Posizione base tattica specchiata con baricentro mobile
          const targetX = p.baseX + (ball.x * 0.45);
          const targetZ = p.baseZ + (ball.z * 0.35);
          p.vx = (targetX - p.x) * 0.045;
          p.vz = (targetZ - p.z) * 0.045;
          p.rot = Math.atan2(p.vz, p.vx || -0.001);
        }

        updatePlayer(p, false);
      });

      // --- CONTATTO FISICO E PRESSING CORPO A CORPO ---
      if (ball.holder) {
        const holder = ball.holder;
        const defenders = holder.team === "A" ? teamB : teamA;
        for (let i = 0; i < defenders.length; i++) {
          const def = defenders[i];
          if (def.idx === 0) continue;
          const dist = hypot(def.x - holder.x, def.z - holder.z);
          if (dist < 1.6) {
            def.pressTicks = (def.pressTicks || 0) + 1;
            // Pressione fisica corpo a corpo continuata
            if (def.pressTicks > 12) {
              def.pressTicks = 0;
              sfx("tackle");
              if (def.team === "A") {
                // Il giocatore controllato dall'utente recupera palla per pressing!
                ball.holder = def;
                ball.lastKick = "A";
                activeAIdx = def.idx;
                showBanner("PALLA RECUPERATA!", `${def.data.name} vince il contrasto!`, 1300);
              } else {
                // L'avversario CPU toglie palla all'utente
                ball.holder = def;
                ball.lastKick = "B";
                showBanner("PRESSING AVVERSARIO!", `${def.data.name} ruba palla!`, 1300);
              }
              break;
            }
          } else {
            def.pressTicks = 0;
          }
        }
      }

      // --- FISICA PALLONE 3D ---
      if (ball.holder) {
        // La palla segue i piedi del portatore
        const forwardX = Math.cos(ball.holder.rot);
        const forwardZ = Math.sin(ball.holder.rot);
        ball.x = ball.holder.x + forwardX * 0.72;
        ball.z = ball.holder.z + forwardZ * 0.72;
        ball.y = BALL_R;
        ball.vx = ball.holder.vx;
        ball.vz = ball.holder.vz;
        ball.vy = 0;
      } else {
        ball.x += ball.vx;
        ball.z += ball.vz;
        ball.y += ball.vy;

        // Gravità e rimbalzo a terra
        ball.vy -= 0.022;
        if (ball.y <= BALL_R) {
          ball.y = BALL_R;
          ball.vy = -ball.vy * 0.55;
          ball.vx *= 0.94;
          ball.vz *= 0.94;
        }

        // Controllo ricezione / recupero sui giocatori vicini
        const allPlayers = teamA.concat(teamB);
        for (let i = 0; i < allPlayers.length; i++) {
          const pl = allPlayers[i];
          const dist = hypot(pl.x - ball.x, pl.z - ball.z);
          if (dist < 1.45 && ball.y < 1.5) {
            ball.holder = pl;
            ball.lastKick = pl.team;
            if (pl.team === "A") activeAIdx = pl.idx;
            break;
          }
        }
      }

      // Controllo GOL
      // Porta Destra (avversaria): Gol Squadra A
      if (ball.x > HX && Math.abs(ball.z) < GW / 2 && ball.y < GH) {
        scoreA++;
        showBanner("GOL DI RONDINE FC!", `${teamA[activeAIdx].data.name} insacca alle spalle del portiere!`, 3200);
        sfx("goal");
        body.querySelector("#c11Score").textContent = `${scoreA} – ${scoreB}`;
        resetPositions("B");
      }
      // Porta Sinistra (propria): Gol Squadra B
      else if (ball.x < -HX && Math.abs(ball.z) < GW / 2 && ball.y < GH) {
        scoreB++;
        showBanner(`GOL DI ${teamBData.name.toUpperCase()}!`, "Palla all'incrocio dei pali!", 3200);
        sfx("goal");
        body.querySelector("#c11Score").textContent = `${scoreA} – ${scoreB}`;
        resetPositions("A");
      }
      // Palla fuori dalle linee laterali
      else if (Math.abs(ball.z) > HZ) {
        ball.z = Math.sign(ball.z) * (HZ - 1);
        ball.vx = 0; ball.vz = 0;
        showBanner("RIMESSA LATERALE", "", 1200);
      }
      // Palla fuori sul fondo (non in porta)
      else if (Math.abs(ball.x) > HX) {
        ball.x = Math.sign(ball.x) * (HX - 5);
        ball.z = 0;
        ball.vx = 0; ball.vz = 0;
        showBanner("RIMESSA DAL FONDO", "", 1200);
      }

      // Aggiorna mesh pallone Three.js
      ballMesh.position.set(ball.x, ball.y, ball.z);
      ballShadow.position.set(ball.x, 0.02, ball.z);
      ballShadow.scale.setScalar(Math.max(0.4, 1.0 - ball.y * 0.15));

      // --- SISTEMA TELECAMERE 3D MULTIPLE ---
      const curCam = CAM_MODES[curCamIdx].id;
      if (curCam === "broadcast") {
        const camTargetX = clamp(ball.x * 0.74, -30, 30);
        const camTargetY = 19 + Math.abs(ball.x) * 0.05;
        const camTargetZ = 40;
        camera.position.x += (camTargetX - camera.position.x) * 0.08;
        camera.position.y += (camTargetY - camera.position.y) * 0.08;
        camera.position.z += (camTargetZ - camera.position.z) * 0.08;
        camera.lookAt(ball.x * 0.88, 1.2, ball.z * 0.4);
      } else if (curCam === "tactical") {
        const camTargetX = clamp(ball.x * 0.6, -26, 26);
        const camTargetY = 36;
        const camTargetZ = 28;
        camera.position.x += (camTargetX - camera.position.x) * 0.08;
        camera.position.y += (camTargetY - camera.position.y) * 0.08;
        camera.position.z += (camTargetZ - camera.position.z) * 0.08;
        camera.lookAt(ball.x * 0.75, 0, ball.z * 0.25);
      } else if (curCam === "endtoend") {
        const focusP = teamA[activeAIdx];
        const camTargetX = clamp(focusP.x - 18, -HX + 2, HX - 8);
        const camTargetY = 12;
        const camTargetZ = focusP.z * 0.6;
        camera.position.x += (camTargetX - camera.position.x) * 0.1;
        camera.position.y += (camTargetY - camera.position.y) * 0.1;
        camera.position.z += (camTargetZ - camera.position.z) * 0.1;
        camera.lookAt(ball.x + 10, 1.2, ball.z * 0.5);
      } else if (curCam === "action") {
        const camTargetX = clamp(ball.x * 0.85, -34, 34);
        const camTargetY = 12;
        const camTargetZ = 22;
        camera.position.x += (camTargetX - camera.position.x) * 0.12;
        camera.position.y += (camTargetY - camera.position.y) * 0.12;
        camera.position.z += (camTargetZ - camera.position.z) * 0.12;
        camera.lookAt(ball.x, 1.0, ball.z * 0.7);
      }

      // Render Three.js e Minimappa Radar
      renderer.render(scene, camera);
      updateRadar();

      M.animId = requestAnimationFrame(loop);
    }

    // Termine Match
    function endMatch() {
      M.running = false;
      sfx("whistle");
      const rec = loadRec();
      rec.played++;
      rec.goals += scoreA;
      const won = scoreA > scoreB;
      if (won) rec.wins++;
      saveRec(rec);

      const isWon = scoreA > scoreB;
      const resTitle = isWon ? "🏆 VITTORIA!" : scoreA === scoreB ? "PAREGGIO" : "SCONFITTA";
      const bEl = shell(resTitle, false);

      bEl.innerHTML = `
        <p class="c11Sum" style="text-align:center;font-size:16px"><b>${teamAData.name} ${scoreA} – ${scoreB} ${teamBData.name}</b></p>
        <p class="c11Sum" style="text-align:center">${isWon ? "Prestazione stellare! La tattica e il fraseggio a 11 hanno fatto la differenza sul campo." : "Partita combattuta fino all'ultimo secondo di recupero."}</p>
        <div style="background:#151f36;border:1px solid #334155;border-radius:12px;padding:12px;margin:12px 0">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>Tiri in porta</span><b>${scoreA + 4} – ${scoreB + 3}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>Possesso palla</span><b>${isWon ? "58%" : "49%"} – ${isWon ? "42%" : "51%"}</b></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>Modulo utilizzato</span><b>${esc(formA.name)}</b></div>
        </div>
        <button type="button" class="c11BigBtn" id="c11Rematch"><span>↺ Gioca Ancora</span><small>Rivincita immediata</small></button>
        <button type="button" class="c11BigBtn" style="border-color:#38bdf8;background:#1e293b" id="c11BackMenu"><span>◂ Torna al Menu 3D</span><small>Scegli squadra e stadio</small></button>
      `;

      bEl.querySelector("#c11Rematch").onclick = () => startMatch(opts);
      bEl.querySelector("#c11BackMenu").onclick = () => open();
    }

    // Ridimensionamento canvas su resize / rotazione schermo
    const stageEl = body.querySelector("#c11Stage");
    const onResize = () => {
      if (!stageEl || !renderer) return;
      const w = stageEl.clientWidth;
      const h = stageEl.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);
    onResize();

    M.animId = requestAnimationFrame(loop);
  }

  // --- MENU PRINCIPALE CALCIO A 11 3D ---
  function open(back) {
    if (back) BACK = back;
    const body = shell("⚽ Calcio a 11 3D · Coppa della Rondine");
    const rec = loadRec();

    let h = `
      <p class="c11Sum">La grande simulazione di Calcio a 11 in Three.js con visuale televisiva laterale broadcast, 22 atleti in campo a 60 FPS, moduli tattici e il trofeo della Riviera.</p>

      <div class="c11Sec"><span>📋 Seleziona Modulo Tattico</span></div>
      <div class="c11Grid">
        ${Object.entries(FORMATIONS).map(([k, f]) => `
          <div class="c11Card ${rec.formation === k ? "on" : ""}" data-form="${k}">
            <b>${esc(f.name)}</b>
            <span>${esc(f.sub)}</span>
          </div>
        `).join("")}
      </div>

      <div class="c11Sec"><span>🏟️ Seleziona Stadio &amp; Orario</span></div>
      <div class="c11Grid">
        ${Object.values(STADIUMS).map((s) => `
          <div class="c11Card ${rec.stadium === s.id ? "on" : ""}" data-stad="${s.id}">
            <b>${s.icon} ${esc(s.name)}</b>
            <span>${esc(s.sub)}</span>
          </div>
        `).join("")}
      </div>

      <div class="c11Sec"><span>📹 Telecamera Iniziale</span></div>
      <div class="c11Grid">
        ${CAM_MODES.map((cm) => `
          <div class="c11Card ${rec.cam === cm.id ? "on" : ""}" data-cam="${cm.id}">
            <b>${cm.label} · ${cm.title.split("(")[0].trim()}</b>
            <span>${cm.title.includes("(") ? cm.title.split("(")[1].replace(")", "") : ""}</span>
          </div>
        `).join("")}
      </div>

      <div class="c11Sec"><span>⏱️ Durata Partita</span></div>
      <div style="display:flex;gap:6px;margin:6px 0">
        ${[90, 180, 300].map((sec) => `
          <button type="button" class="chip ${rec.duration === sec ? "on" : ""}" data-dur="${sec}" style="flex:1;min-height:36px;border-radius:8px;border:1px solid #334155;background:${rec.duration === sec ? "#0284c7" : "#1e293b"};color:#fff;font:800 12px system-ui;cursor:pointer">
            ${sec === 90 ? "1:30 Veloce" : sec === 180 ? "3 Minuti" : "5 Minuti"}
          </button>
        `).join("")}
      </div>

      <button type="button" class="c11BigBtn" id="c11StartQuick">
        <div>
          <b>⚽ Partita Veloce 3D</b>
          <small>Rondine FC vs Gabbiani del Porto</small>
        </div>
        <span>GIOCA ▸</span>
      </button>

      <button type="button" class="c11BigBtn" style="border-color:#ffd23f;background:linear-gradient(135deg,#78350f,#1e293b)" id="c11StartCup">
        <div>
          <b>🏆 Coppa della Rondine 3D</b>
          <small>Torneo a 8 squadre a eliminazione diretta</small>
        </div>
        <span>TORNEO ▸</span>
      </button>

      <div style="display:flex;justify-content:space-between;font-size:12px;color:#94a3b8;padding:8px 4px;border-top:1px solid #1e293b;margin-top:12px">
        <span>Partite: <b>${rec.played}</b></span>
        <span>Vittorie: <b>${rec.wins}</b></span>
        <span>Gol segnati: <b>${rec.goals}</b></span>
        <span>Coppe: <b>${rec.cups}</b> 🏆</span>
      </div>
    `;

    body.innerHTML = h;

    // Selettori Modulo
    body.querySelectorAll("[data-form]").forEach((el) => {
      el.onclick = () => {
        rec.formation = el.dataset.form;
        saveRec(rec);
        open();
      };
    });

    // Selettori Stadio
    body.querySelectorAll("[data-stad]").forEach((el) => {
      el.onclick = () => {
        rec.stadium = el.dataset.stad;
        saveRec(rec);
        open();
      };
    });

    // Selettori Telecamera
    body.querySelectorAll("[data-cam]").forEach((el) => {
      el.onclick = () => {
        rec.cam = el.dataset.cam;
        saveRec(rec);
        open();
      };
    });

    // Selettori Durata
    body.querySelectorAll("[data-dur]").forEach((el) => {
      el.onclick = () => {
        rec.duration = parseInt(el.dataset.dur, 10);
        saveRec(rec);
        open();
      };
    });

    body.querySelector("#c11StartQuick").onclick = () => {
      startMatch({
        teamA: rec.team || "rondine",
        teamB: "gabbiani",
        formationA: rec.formation,
        stadiumId: rec.stadium,
        duration: rec.duration,
        cam: rec.cam
      });
    };

    body.querySelector("#c11StartCup").onclick = () => {
      startMatch({
        teamA: rec.team || "rondine",
        teamB: "faro",
        formationA: rec.formation,
        stadiumId: "notte",
        duration: rec.duration,
        cam: rec.cam,
        isCup: true
      });
    };
  }

  window.__calcio11_3d = {
    open,
    startMatch,
    load: loadRec
  };

  console.log("✓ Modulo Calcio a 11 3D caricato con successo");
})();
