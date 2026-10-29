// js/onde-urto.js — ONDE D'URTO · CALCIO SU FREQUENZA (1977)
// Motore calcistico 2D in tempo reale basato su sintonia radiofonica (3 bande MHz) e battito del vinile a 45 giri.
// Espone window.__urto = { start(opts), state, finishTest(a, b, extra) }.
(function () {
  "use strict";
  if (window.__urto) return;

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hypot = Math.hypot;

  const BANDS = [
    { id: "88.4", mhz: "88.4 MHz", short: "88.4 Bassi", icon: "🔊", col: "#f59e0b", desc: "Tiri rasoterra pesanti e spallate che spezzano i blocchi" },
    { id: "99.9", mhz: "99.9 MHz", short: "99.9 Pirata", icon: "📻", col: "#34d399", desc: "Uno-due rapidi che bucano il fruscio statico senza rallentare" },
    { id: "104.2", mhz: "104.2 MHz", short: "104.2 Acuto", icon: "⚡", col: "#38bdf8", desc: "Effetto Magnus estremo: curva attorno a disturbi e portiere" }
  ];

  const TRACKS = {
    rock: { id: "rock", name: "Lato A · Rondine Rock '77", bpm: 124, notes: [196, 220, 261.6, 293.7, 329.6, 293.7, 261.6, 220], tolBonus: 0, atkMul: 1.15 },
    blues: { id: "blues", name: "Lato B · Blues delle Dodici Miglia", bpm: 94, notes: [146.8, 174.6, 196, 207.7, 196, 174.6, 146.8, 130.8], tolBonus: 0.055, atkMul: 0.98 },
    finale: { id: "finale", name: "Edizione Pirata · Frequenza Libera", bpm: 128, notes: [220, 261.6, 329.6, 392, 440, 392, 329.6, 293.7], tolBonus: 0.015, atkMul: 1.18 }
  };

  const VENUES = {
    carbone: { bg1: "#1c222b", bg2: "#12161d", line: "rgba(241,245,249,0.52)", lamp: "245,158,11", border: "#334155", label: "Piazzale del Carbone" },
    cortile: { bg1: "#334155", bg2: "#1e293b", line: "rgba(254,243,199,0.55)", lamp: "251,191,36", border: "#7c2d12", label: "Cortile delle Antenne" },
    ponte: { bg1: "#1e3a5f", bg2: "#0f172a", line: "rgba(226,232,240,0.6)", lamp: "234,179,8", border: "#991b1b", label: "Ponte della Rondine Rossa" },
    stadio: { bg1: "#166534", bg2: "#14532d", line: "rgba(255,255,255,0.75)", lamp: "253,224,71", border: "#0c4a6e", label: "Stadio del Molo Vecchio" }
  };

  function hexToRgb(hex) {
    const s = String(hex || "").replace("#", "").trim();
    if (s.length === 3) return [parseInt(s[0] + s[0], 16) || 0, parseInt(s[1] + s[1], 16) || 0, parseInt(s[2] + s[2], 16) || 0];
    if (s.length >= 6) return [parseInt(s.slice(0, 2), 16) || 0, parseInt(s.slice(2, 4), 16) || 0, parseInt(s.slice(4, 6), 16) || 0];
    return [30, 64, 175];
  }

  function ensureContrast(homeHex, awayHex) {
    const a = hexToRgb(homeHex), b = hexToRgb(awayHex);
    const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    if (dist >= 105) return awayHex;
    const alt = ["#e11d48", "#facc15", "#06b6d4", "#f8fafc", "#a855f7"];
    for (let i = 0; i < alt.length; i++) {
      const c = hexToRgb(alt[i]);
      if (Math.hypot(a[0] - c[0], a[1] - c[1], a[2] - c[2]) >= 120) return alt[i];
    }
    return "#f8fafc";
  }

  function injectCss() {
    if (document.getElementById("urtoCss")) return;
    const st = document.createElement("style");
    st.id = "urtoCss";
    st.textContent = `
      .urtoRoot{position:fixed;inset:0;z-index:9600;background:radial-gradient(ellipse at 50% 18%,#1e293b 0%,#090d16 78%);color:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px 8px 8px;box-sizing:border-box;font-family:'M PLUS Rounded 1c','Trebuchet MS',system-ui,sans-serif;user-select:none;touch-action:none;overflow:hidden}
      .urtoTop{width:min(100%,680px);display:flex;align-items:center;justify-content:space-between;gap:6px;background:rgba(15,23,42,0.92);border:1.5px solid rgba(245,158,11,0.55);border-radius:12px;padding:4px 8px;box-sizing:border-box;box-shadow:0 4px 14px rgba(0,0,0,0.5)}
      .urtoScore{display:flex;align-items:center;gap:6px;font-weight:900;font-size:13px;white-space:nowrap}
      .urtoScore .tm{padding:2px 6px;border-radius:6px;font-size:11px;max-width:86px;overflow:hidden;text-overflow:ellipsis}
      .urtoScore .sc{font-size:16px;color:#fde68a;letter-spacing:1px}
      .urtoClock{font-size:11.5px;font-weight:800;color:#cbd5e1;text-align:center;line-height:1.15}
      .urtoClock b{color:#34d399;display:block;font-size:11px}
      .urtoScope{width:76px;height:28px;flex:none;border-radius:6px;background:#04130d;border:1px solid #10b98188;display:block}
      .urtoStage{position:relative;width:min(100%,680px);flex:1;min-height:0;display:flex;align-items:center;justify-content:center;margin:4px 0}
      .urtoStage canvas.urtoPitch{width:100%;max-height:100%;aspect-ratio:18/11;height:auto;flex:none;border-radius:12px;border:2px solid rgba(245,158,11,0.55);box-shadow:0 8px 26px rgba(0,0,0,0.65);background:#0f172a;display:block}
      .urtoBands{width:min(100%,680px);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;margin-bottom:4px}
      .urtoBand{min-width:0;overflow:hidden;border:1.5px solid rgba(255,255,255,0.2);background:rgba(15,23,42,0.88);color:#cbd5e1;border-radius:9px;padding:4px 4px;font:800 11px/1.15 inherit;cursor:pointer;text-align:center;transition:transform .1s,border-color .15s}
      .urtoBand small{display:block;font-weight:600;font-size:9.5px;opacity:0.78;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .urtoBand.on{background:rgba(30,41,59,0.98);color:#fff;box-shadow:0 0 10px var(--bc)}
      .urtoPad{width:min(100%,680px);display:flex;align-items:center;justify-content:space-between;gap:8px}
      .urtoJoy{position:relative;width:92px;height:92px;border-radius:50%;background:radial-gradient(circle,rgba(30,41,59,0.9),rgba(9,13,22,0.95));border:2px solid rgba(148,163,184,0.4);flex:none;touch-action:none}
      .urtoStick{position:absolute;left:50%;top:50%;width:36px;height:36px;margin:-18px 0 0 -18px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fde68a,#d97706);border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.6);pointer-events:none}
      .urtoHintMid{flex:1;min-width:0;text-align:center;font-size:10.5px;color:#cbd5e1;line-height:1.25;padding:0 2px}
      .urtoHintMid b{color:#fde68a;display:block;font-size:11.5px;margin-bottom:2px}
      .urtoActs{display:flex;gap:7px;flex:none}
      .urtoBtn{min-width:68px;height:68px;border-radius:16px;border:2px solid rgba(255,255,255,0.45);font:900 12px/1.1 inherit;color:#090d16;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 4px 12px rgba(0,0,0,0.5);touch-action:manipulation}
      .urtoBtn:active{transform:scale(0.94)}
      .urtoBtn.pass{background:linear-gradient(145deg,#34d399,#059669);color:#042f2e}
      .urtoBtn.shoot{background:linear-gradient(145deg,#fbbf24,#d97706);color:#1c1917}
      .urtoBtn span{font-size:18px}
      .urtoModal{position:absolute;inset:0;z-index:5;background:rgba(6,10,20,0.88);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;text-align:center;border-radius:12px}
      .urtoModal h3{margin:0 0 6px;color:#fde68a;font-size:18px}
      .urtoModal p{margin:0 0 10px;font-size:12.5px;color:#e2e8f0;max-width:420px;line-height:1.35}
      .urtoModal .choicesRow{display:flex;flex-direction:column;gap:8px;width:min(100%,340px)}
      .urtoModal button{padding:10px 14px;border-radius:11px;border:1.5px solid #fbbf24;background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;font:800 13px/1.2 inherit;cursor:pointer;text-align:left}
      .urtoModal button small{display:block;font-weight:600;font-size:11px;color:#94a3b8;margin-top:3px}
      @media (max-width:360px){
        .urtoJoy{width:78px;height:78px}
        .urtoBtn{min-width:60px;height:60px;font-size:11px}
        .urtoScope{width:58px}
      }
    `;
    document.head.appendChild(st);
  }

  let curState = null;

  function playBeatTone(ac, freq, accent) {
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = accent ? "triangle" : "sine";
      o.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(accent ? 0.055 : 0.028, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (accent ? 0.16 : 0.1));
      o.connect(g); g.connect(ac.destination);
      o.start(now); o.stop(now + 0.18);
    } catch (e) {}
  }

  function playShockSfx(ac, kind) {
    if (!ac) return;
    try {
      const now = ac.currentTime;
      const o = ac.createOscillator(), g = ac.createGain();
      if (kind === "shock") {
        o.type = "sawtooth";
        o.frequency.setValueAtTime(330, now);
        o.frequency.exponentialRampToValueAtTime(660, now + 0.14);
        g.gain.setValueAtTime(0.07, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      } else if (kind === "harm") {
        o.type = "sine";
        o.frequency.setValueAtTime(440, now);
        o.frequency.exponentialRampToValueAtTime(587, now + 0.16);
        g.gain.setValueAtTime(0.05, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      } else {
        o.type = "square";
        o.frequency.setValueAtTime(135, now);
        o.frequency.linearRampToValueAtTime(92, now + 0.14);
        g.gain.setValueAtTime(0.04, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      }
      o.connect(g); g.connect(ac.destination);
      o.start(now); o.stop(now + 0.22);
    } catch (e) {}
  }

  function start(opts) {
    opts = opts || {};
    injectCss();
    document.querySelectorAll(".urtoRoot").forEach((el) => el.remove());

    const cb = opts.onDone || opts.done || function () {};
    const C = window.__sagaCore;
    const dm = C && C.diffMul ? C.diffMul() : 1;
    const hero = opts.heroLook || (window.heroLoad && window.heroLoad()) || { name: "Campione", shirt: "#b91c1c", hair: "#2b1d14", skin: "#e8b88c" };
    const usName = opts.us || "Radio 99.9";
    const oppName = opts.opp || opts.oppName || "Cantiere Specchio";
    const homeCol = hero.shirt || "#b91c1c";
    const awayCol = ensureContrast(homeCol, opts.oppColor || "#475569");
    const venue = VENUES[opts.venue] || VENUES.carbone;
    const halfSec = clamp(Number(opts.halfSec) || 28, 16, 45);
    const staticCount = clamp(Number(opts.staticCount) || 2, 1, 4);
    const invBonus = opts.bonus || {};
    const mates = Array.isArray(opts.mates) && opts.mates.length >= 3 ? opts.mates : ["Lupo", "Tullio", "Nilde"];
    const oppPlayers = Array.isArray(opts.oppPlayers) && opts.oppPlayers.length >= 4 ? opts.oppPlayers : ["Portiere", "Stopper", "Mediano", "Punta"];

    const root = document.createElement("div");
    root.id = "urtoOv";
    root.className = "scPitch urtoRoot";
    root.innerHTML = `
      <div class="urtoTop">
        <div class="urtoScore">
          <span class="tm" style="background:${esc(homeCol)};color:#fff">${esc(usName)}</span>
          <span class="sc" id="urtoSc">0 - 0</span>
          <span class="tm" style="background:${esc(awayCol)};color:#0f172a">${esc(oppName)}</span>
        </div>
        <div class="urtoClock" id="urtoClk">1°T · ${halfSec}"<b>Sintonia 100%</b></div>
        <canvas class="urtoScope" id="urtoScope" width="76" height="28"></canvas>
      </div>
      <div class="urtoStage" id="urtoStage">
        <canvas class="urtoPitch" id="urtoCv" width="360" height="220"></canvas>
      </div>
      <div class="urtoBands" id="urtoBands">
        ${BANDS.map((b, i) => `<button type="button" class="urtoBand${i === 1 ? " on" : ""}" data-band="${i}" style="--bc:${b.col};border-color:${i === 1 ? b.col : "rgba(255,255,255,0.2)"}">${b.icon} ${esc(b.short)}<small>${esc(b.desc)}</small></button>`).join("")}
      </div>
      <div class="urtoPad">
        <div class="urtoJoy" id="urtoJoy"><div class="urtoStick" id="urtoStick"></div></div>
        <div class="urtoHintMid" id="urtoMsg"><b>📻 ${esc(venue.label)}</b>Tocca Passa o Tira sul battito d'oro del 45 giri!</div>
        <div class="urtoActs">
          <button type="button" class="urtoBtn pass" id="urtoPass"><span>👟</span>PASSA</button>
          <button type="button" class="urtoBtn shoot" id="urtoShoot"><span>⚡</span>TIRA</button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const cv = root.querySelector("#urtoCv"), g = cv.getContext("2d");
    const scCv = root.querySelector("#urtoScope"), sg = scCv.getContext("2d");
    const scEl = root.querySelector("#urtoSc"), clkEl = root.querySelector("#urtoClk"), msgEl = root.querySelector("#urtoMsg");
    const stageEl = root.querySelector("#urtoStage");

    const W = 360, H = 220;
    const FL = 18, FR = W - 18, FT = 16, FB = H - 16, FW = FR - FL, FH = FB - FT;
    const GY1 = H / 2 - 28, GY2 = H / 2 + 28;

    let ac = null;
    const ensureAudio = () => {
      if (ac) return ac;
      try {
        const s = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni") || "{}");
        if (s.mute) return null;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) ac = new Ctx();
      } catch (e) {}
      return ac;
    };

    let track = TRACKS[opts.track] || TRACKS.rock;
    let bandIdx = 1; // 99.9 MHz default
    let scoreA = 0, scoreB = 0;
    let half = 1, timeLeft = halfSec, overtime = false;
    let paused = false, finished = false, raf = 0;
    let beatAccum = 0, beatIdx = 0, beatPhase = 0;
    let syncHits = 0, syncTries = 0, shockwavesCount = 0;
    let offBeatLastLap = false;
    let callout = { txt: "", col: "#fde68a", t: 0 };
    let waves = []; // { x, y, r, maxR, col, a }
    let flashLightning = 0;

    const mkPlayer = (team, role, name, hx, hy, spd) => ({
      team, role, name, x: hx, y: hy, hx, hy, vx: 0, vy: 0, spd, stun: 0, face: team === 0 ? 1 : -1
    });

    const home = [
      mkPlayer(0, "gk", mates[0], FL + 14, H / 2, 1.55),
      mkPlayer(0, "def", mates[1], FL + 82, H / 2 - 42, 1.85),
      mkPlayer(0, "mid", mates[2], FL + 122, H / 2 + 40, 1.98),
      mkPlayer(0, "atk", (hero.name || "Campione").split(" ")[0], FL + 152, H / 2, 2.12)
    ];
    const away = [
      mkPlayer(1, "gk", oppPlayers[0], FR - 14, H / 2, 1.5 * clamp(dm, 0.8, 1.25)),
      mkPlayer(1, "def", oppPlayers[1], FR - 84, H / 2 - 38, 1.72 * clamp(dm, 0.82, 1.22)),
      mkPlayer(1, "mid", oppPlayers[2], FR - 122, H / 2 + 38, 1.82 * clamp(dm, 0.82, 1.22)),
      mkPlayer(1, "atk", oppPlayers[3], FR - 156, H / 2, 1.9 * clamp(dm, 0.82, 1.22))
    ];
    const allP = home.concat(away);
    let ctrl = home[3];

    const ball = { x: W / 2, y: H / 2, z: 0, vz: 0, vx: 0, vy: 0, spin: 0, owner: home[3], lastTeam: 0, boost: 0, grabCd: 0 };

    const staticCones = Array.from({ length: staticCount }, (_, i) => ({
      x: W * 0.44 + (i % 2) * 58,
      y: FT + 38 + ((i * 67) % (FH - 76)),
      vx: (i % 2 ? -0.45 : 0.45) * clamp(dm, 0.85, 1.2),
      vy: (i % 2 ? 0.36 : -0.36) * clamp(dm, 0.85, 1.2),
      r: 26 + (i === 0 ? 4 : 0),
      mute: 0
    }));

    function resetPositions(kickTeam) {
      home[0].x = FL + 14; home[0].y = H / 2;
      home[1].x = FL + 80; home[1].y = H / 2 - 42;
      home[2].x = FL + 116; home[2].y = H / 2 + 40;
      home[3].x = kickTeam === 0 ? W / 2 - 14 : FL + 138; home[3].y = H / 2;

      away[0].x = FR - 14; away[0].y = H / 2;
      away[1].x = FR - 80; away[1].y = H / 2 - 38;
      away[2].x = FR - 116; away[2].y = H / 2 + 38;
      away[3].x = kickTeam === 1 ? W / 2 + 14 : FR - 138; away[3].y = H / 2;

      allP.forEach((p) => { p.vx = 0; p.vy = 0; p.stun = 0; });
      ball.x = W / 2; ball.y = H / 2; ball.z = 0; ball.vz = 0; ball.vx = 0; ball.vy = 0; ball.spin = 0; ball.boost = 0;
      ball.owner = kickTeam === 0 ? home[3] : away[3];
      ball.grabCd = 15;
      ctrl = home[3];
    }

    function setBanner(txt, col, sub) {
      callout = { txt, col: col || "#fde68a", t: 52 };
      if (sub && msgEl) msgEl.innerHTML = `<b>${esc(txt)}</b>${esc(sub)}`;
    }

    // Input: Keyboard + Virtual Joystick
    const keys = {};
    let joyVec = { x: 0, y: 0, id: null };
    const joyEl = root.querySelector("#urtoJoy"), stickEl = root.querySelector("#urtoStick");

    const updateStick = (clientX, clientY) => {
      const r = joyEl.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const maxD = r.width * 0.36;
      let dx = clientX - cx, dy = clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > maxD) { dx = (dx / d) * maxD; dy = (dy / d) * maxD; }
      stickEl.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      joyVec.x = d > 5 ? dx / maxD : 0;
      joyVec.y = d > 5 ? dy / maxD : 0;
    };
    const resetStick = () => {
      joyVec.x = 0; joyVec.y = 0; joyVec.id = null;
      stickEl.style.transform = "translate(0px, 0px)";
    };

    joyEl.addEventListener("pointerdown", (e) => {
      e.preventDefault(); ensureAudio();
      joyVec.id = e.pointerId;
      try { joyEl.setPointerCapture(e.pointerId); } catch (err) {}
      updateStick(e.clientX, e.clientY);
    });
    joyEl.addEventListener("pointermove", (e) => {
      if (joyVec.id === e.pointerId) updateStick(e.clientX, e.clientY);
    });
    joyEl.addEventListener("pointerup", (e) => { if (joyVec.id === e.pointerId) resetStick(); });
    joyEl.addEventListener("pointercancel", resetStick);

    const selectBand = (idx) => {
      bandIdx = clamp(idx, 0, 2);
      root.querySelectorAll(".urtoBand").forEach((b, i) => {
        const on = i === bandIdx;
        b.classList.toggle("on", on);
        b.style.borderColor = on ? BANDS[i].col : "rgba(255,255,255,0.2)";
      });
      setBanner(`📻 ${BANDS[bandIdx].mhz}`, BANDS[bandIdx].col, BANDS[bandIdx].desc);
    };
    root.querySelectorAll(".urtoBand").forEach((b) => {
      b.onclick = () => { ensureAudio(); selectBand(Number(b.dataset.band)); };
    });

    function judgeBeat() {
      const distBeat = Math.min(beatPhase, 1 - beatPhase);
      const distOff = Math.abs(beatPhase - 0.5);
      const baseTol = 0.21 + (track.tolBonus || 0) + (invBonus.beatTol || 0);
      syncTries++;
      if (distBeat <= baseTol) {
        syncHits++;
        shockwavesCount++;
        return "perfect";
      }
      if (distOff <= 0.14 + (invBonus.beatTol || 0) * 0.5) {
        syncHits += 0.75;
        return "harmonic";
      }
      if (half >= 2 && timeLeft <= 12) offBeatLastLap = true;
      return "fumble";
    }

    function triggerShockwave(x, y, col, radius) {
      waves.push({ x, y, r: 6, maxR: radius || 58, col: col || "#fde68a", a: 0.95 });
      away.forEach((op) => {
        const d = hypot(op.x - x, op.y - y);
        if (d < (radius || 58) && op.role !== "gk") {
          const ang = Math.atan2(op.y - y, op.x - x);
          op.vx += Math.cos(ang) * 3.4;
          op.vy += Math.sin(ang) * 3.4;
          op.stun = 24;
        }
      });
      staticCones.forEach((sc) => {
        if (hypot(sc.x - x, sc.y - y) < (radius || 58) + sc.r) sc.mute = 150;
      });
    }

    function inStatic(p) {
      if (invBonus.staticResist && bandIdx === 1) return false;
      for (let i = 0; i < staticCones.length; i++) {
        const sc = staticCones[i];
        if (sc.mute <= 0 && hypot(p.x - sc.x, p.y - sc.y) < sc.r) return true;
      }
      return false;
    }

    function doPass() {
      if (paused || finished) return;
      ensureAudio();
      if (!ball.owner || ball.owner.team !== 0) {
        // Cambio cursore al compagno più vicino alla palla
        let best = home[3], bd = 9999;
        home.slice(1).forEach((m) => { const d = hypot(m.x - ball.x, m.y - ball.y); if (d < bd) { bd = d; best = m; } });
        ctrl = best;
        setBanner("🔄 CAMBIO UOMO", "#38bdf8", `Controlli ${ctrl.name}`);
        return;
      }
      const p = ball.owner;
      const timing = judgeBeat();
      const matesList = home.filter((m) => m !== p && m.role !== "gk");
      let target = matesList[0];
      let bestScore = -9999;
      matesList.forEach((m) => {
        const forward = m.x * 1.15 - hypot(m.x - p.x, m.y - p.y) * (bandIdx === 1 ? 0.25 : 0.55);
        if (forward > bestScore) { bestScore = forward; target = m; }
      });
      if (!target) target = home[3];
      const ang = Math.atan2(target.y - p.y, target.x - p.x);
      let spd = bandIdx === 1 ? 5.6 : 4.6;
      ball.spin = bandIdx === 2 ? (target.y < p.y ? 0.08 : -0.08) : 0;

      if (timing === "perfect") {
        spd *= 1.32;
        ball.boost = 35;
        triggerShockwave(p.x, p.y, "#34d399", bandIdx === 1 ? 72 : 54);
        playShockSfx(ac, "shock");
        setBanner("🎵 UNO-DUE IN BATTERE!", "#34d399", "Onda pirata: passaggio fulmineo che spazza il pressing!");
      } else if (timing === "harmonic") {
        ball.vz = 2.7;
        playShockSfx(ac, "harm");
        setBanner("🎶 PARABOLA IN LEVARE!", "#38bdf8", "Pallonetto morbido sopra le marcature!");
      } else {
        spd *= 0.72;
        p.stun = 10;
        playShockSfx(ac, "miss");
        setBanner("📻 FRUSCIO FUORI TEMPO", "#f87171", "Passaggio debole: segui il cerchio d'oro sul vinile!");
      }

      ball.owner = null;
      ball.grabCd = 10;
      ball.vx = Math.cos(ang) * spd;
      ball.vy = Math.sin(ang) * spd;
      ctrl = target;
    }

    function doShootOrTackle() {
      if (paused || finished) return;
      ensureAudio();
      if (ball.owner && ball.owner.team === 0) {
        const p = ball.owner;
        const timing = judgeBeat();
        const aimY = clamp(H / 2 + (joyVec.y || (keys.ArrowDown || keys.KeyS ? 1 : keys.ArrowUp || keys.KeyW ? -1 : (p.y < H / 2 ? 0.55 : -0.55))) * 22, GY1 + 5, GY2 - 5);
        const ang = Math.atan2(aimY - p.y, FR + 6 - p.x);
        let spd = (bandIdx === 0 ? 6.5 : bandIdx === 2 ? 5.6 : 5.9) * (track.atkMul || 1);
        ball.spin = bandIdx === 2 ? (p.y < H / 2 ? 0.13 : -0.13) : 0;

        if (timing === "perfect") {
          spd *= 1.35;
          ball.boost = 48;
          triggerShockwave(p.x, p.y, "#fde68a", 66);
          playShockSfx(ac, "shock");
          setBanner("💥 ONDA D'URTO!", "#fde68a", `${BANDS[bandIdx].mhz}: bolide sincronizzato sul vinile!`);
        } else if (timing === "harmonic") {
          ball.vz = 2.5;
          spd *= 1.08;
          playShockSfx(ac, "harm");
          setBanner("🎶 TIRO ARMONICO!", "#38bdf8", "Conclusione a scendere sotto l'incrocio!");
        } else {
          spd *= 0.68;
          p.stun = 14;
          playShockSfx(ac, "miss");
          setBanner("📻 FISCHIO STONATO!", "#f87171", "Tiro masticato fuori tempo!");
        }

        ball.owner = null;
        ball.grabCd = 12;
        ball.vx = Math.cos(ang) * spd;
        ball.vy = Math.sin(ang) * spd;
      } else {
        // Contrasto / scatto di spalla
        const p = ctrl;
        const timing = judgeBeat();
        const lunge = bandIdx === 0 ? 3.8 : 2.8;
        const ang = Math.atan2(ball.y - p.y, ball.x - p.x);
        p.vx = Math.cos(ang) * lunge;
        p.vy = Math.sin(ang) * lunge;
        const reach = (bandIdx === 0 ? 24 : 18) + (timing === "perfect" ? 8 : 0);
        if (hypot(ball.x - p.x, ball.y - p.y) <= reach) {
          if (ball.owner && ball.owner.team === 1) ball.owner.stun = timing === "perfect" ? 28 : 18;
          ball.owner = p;
          ball.lastTeam = 0;
          ball.grabCd = 12;
          if (timing === "perfect") {
            triggerShockwave(p.x, p.y, "#f59e0b", 52);
            playShockSfx(ac, "shock");
            setBanner("🔊 SPALLATA SUI BASSI!", "#f59e0b", "Recupero palla in perfetto battere!");
          } else {
            setBanner("⚡ PALLA RECUPERATA!", "#34d399", "Ora scarica o punta la porta!");
          }
        }
      }
    }

    root.querySelector("#urtoPass").onclick = doPass;
    root.querySelector("#urtoShoot").onclick = doShootOrTackle;

    const onKeyDown = (e) => {
      if (!root.isConnected) return;
      keys[e.code] = true;
      if (e.code === "Digit1") selectBand(0);
      else if (e.code === "Digit2") selectBand(1);
      else if (e.code === "Digit3") selectBand(2);
      else if (e.code === "KeyZ" || e.code === "Space") { e.preventDefault(); doPass(); }
      else if (e.code === "KeyX" || e.code === "Enter") { e.preventDefault(); doShootOrTackle(); }
    };
    const onKeyUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function showHalftimeModal() {
      paused = true;
      const m = document.createElement("div");
      m.className = "urtoModal";
      m.innerHTML = `
        <h3>💿 Intervallo · Gira il 45 Giri!</h3>
        <p>Fine primo tempo (${scoreA} - ${scoreB}). Scegli quale lato del vinile mettere sul piatto della <i>Rondine Rossa</i> per la ripresa:</p>
        <div class="choicesRow">
          <button type="button" data-side="rock">🔥 Lato A · Rondine Rock (124 BPM)<small>Ritmo incalzante: +15% potenza offensiva e contropiede rapido</small></button>
          <button type="button" data-side="blues">🌙 Lato B · Blues delle Dodici Miglia (94 BPM)<small>Finestra ritmica più ampia (+30% tolleranza) e difesa compatta</small></button>
        </div>
      `;
      stageEl.appendChild(m);
      m.querySelectorAll("[data-side]").forEach((btn) => {
        btn.onclick = () => {
          ensureAudio();
          track = TRACKS[btn.dataset.side] || TRACKS.rock;
          half = 2;
          timeLeft = halfSec;
          m.remove();
          resetPositions(1);
          paused = false;
          setBanner(`💿 ${track.name}`, "#fde68a", "Secondo tempo in onda!");
        };
      });
    }

    function concludeMatch(forceA, forceB, extra) {
      if (finished) return;
      finished = true;
      paused = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);

      if (typeof forceA === "number") scoreA = forceA;
      if (typeof forceB === "number") scoreB = forceB;
      if (extra && typeof extra.cleanVinylLap === "boolean") offBeatLastLap = !extra.cleanVinylLap;

      const win = scoreA > scoreB;
      const syncPct = syncTries > 0 ? Math.round(clamp((syncHits / syncTries) * 100, 0, 100)) : 85;
      const res = {
        a: scoreA,
        b: scoreB,
        gUs: scoreA,
        gOpp: scoreB,
        win,
        syncPct,
        cleanVinylLap: !offBeatLastLap,
        waves: shockwavesCount
      };

      if (extra && extra.instant) {
        root.remove();
        curState = null;
        if (C && C.endMatch) C.endMatch();
        cb(res);
        return;
      }

      const m = document.createElement("div");
      m.className = "urtoModal";
      m.innerHTML = `
        <h3>${win ? esc(opts.winTitle || "📻 SEGNALE LIBERO · VITTORIA!") : "📻 FINE TRASMISSIONE"}</h3>
        <p><b>${esc(usName)} ${scoreA} – ${scoreB} ${esc(oppName)}</b><br>Sintonia col vinile: <b>${syncPct}%</b> · Onde d'Urto: <b>${shockwavesCount}</b>${!offBeatLastLap ? " · ✨ Ultimo giro pulito!" : ""}</p>
        <div class="choicesRow">
          <button type="button" id="urtoEndBtn" style="text-align:center">Continua ▸</button>
        </div>
      `;
      stageEl.appendChild(m);
      m.querySelector("#urtoEndBtn").onclick = () => {
        root.remove();
        curState = null;
        if (C && C.endMatch) C.endMatch();
        cb(res);
      };
    }

    function scoreGoal(team) {
      if (team === 0) {
        scoreA++;
        setBanner("⚽ GOOOL SUI 99.9 MHz!", "#fde68a", `${usName} fa tremare le radioline del Borgo!`);
        try { if (window.sfx) window.sfx("goal"); } catch (e) {}
      } else {
        scoreB++;
        setBanner("📡 GOL AVVERSARIO", "#f87171", `${oppName} approfitta del fruscio!`);
      }
      scEl.textContent = `${scoreA} - ${scoreB}`;
      if (overtime) {
        setTimeout(() => concludeMatch(), 550);
        return;
      }
      resetPositions(team === 0 ? 1 : 0);
    }

    let lastTs = performance.now();
    function step(dt) {
      if (paused || finished) return;

      // Avanzamento tempo e battito del vinile
      timeLeft -= dt;
      const beatDur = 60 / track.bpm;
      beatAccum += dt;
      if (beatAccum >= beatDur) {
        beatAccum -= beatDur;
        beatIdx++;
        const note = track.notes[beatIdx % track.notes.length];
        playBeatTone(ac, note, beatIdx % 4 === 0);
      }
      beatPhase = clamp(beatAccum / beatDur, 0, 1);

      if (opts.venue === "ponte" && Math.random() < dt * 0.18) flashLightning = 7;
      if (flashLightning > 0) flashLightning--;
      if (callout.t > 0) callout.t--;

      const syncPct = syncTries > 0 ? Math.round(clamp((syncHits / syncTries) * 100, 0, 100)) : 100;
      clkEl.innerHTML = `${overtime ? "SUPPL." : half + "°T"} · ${Math.max(0, Math.ceil(timeLeft))}"<b>Sintonia ${syncPct}%</b>`;

      if (timeLeft <= 0) {
        if (half === 1) {
          showHalftimeModal();
          return;
        }
        if (!overtime && scoreA === scoreB) {
          overtime = true;
          timeLeft = 16;
          resetPositions(0);
          setBanner("⚡ ULTIMO SUPPLEMENTARE!", "#fde68a", "Golden Goal sui 99.9 MHz: chi segna vince!");
          return;
        }
        if (scoreA === scoreB) scoreA++; // Spinta della piazza all'ultimo respiro se hanno resistito tutto il supplementare
        concludeMatch();
        return;
      }

      // Aggiornamento coni di disturbo statico
      staticCones.forEach((sc) => {
        if (sc.mute > 0) { sc.mute--; return; }
        sc.x += sc.vx; sc.y += sc.vy;
        if (sc.x < FL + 48 || sc.x > FR - 48) sc.vx *= -1;
        if (sc.y < FT + 28 || sc.y > FB - 28) sc.vy *= -1;
      });

      // Movimento giocatore controllato
      if (ball.owner && ball.owner.team === 0) ctrl = ball.owner;
      let ix = joyVec.x, iy = joyVec.y;
      if (keys.ArrowLeft || keys.KeyA) ix -= 1;
      if (keys.ArrowRight || keys.KeyD) ix += 1;
      if (keys.ArrowUp || keys.KeyW) iy -= 1;
      if (keys.ArrowDown || keys.KeyS) iy += 1;
      const il = Math.hypot(ix, iy);
      if (il > 1) { ix /= il; iy /= il; }

      allP.forEach((p) => {
        if (p.stun > 0) {
          p.stun--;
          p.x = clamp(p.x + p.vx, FL + 6, FR - 6);
          p.y = clamp(p.y + p.vy, FT + 6, FB - 6);
          p.vx *= 0.84; p.vy *= 0.84;
          return;
        }
        const slow = p.team === 0 && inStatic(p) && bandIdx !== 1 ? 0.62 : 1;
        if (p === ctrl) {
          p.vx = ix * p.spd * slow;
          p.vy = iy * p.spd * slow;
          if (Math.abs(ix) > 0.1) p.face = ix > 0 ? 1 : -1;
        } else if (p.role === "gk") {
          const ty = clamp(ball.y, GY1 + 6, GY2 - 6);
          p.vy = clamp((ty - p.y) * 0.14, -p.spd, p.spd);
          p.vx = clamp((p.hx - p.x) * 0.15, -p.spd, p.spd);
          if (ball.owner === p) {
            const mate = p.team === 0 ? home[2] : away[2];
            const a = Math.atan2(mate.y - p.y, mate.x - p.x);
            ball.owner = null; ball.grabCd = 12;
            ball.vx = Math.cos(a) * 4.5; ball.vy = Math.sin(a) * 4.5;
          }
        } else if (p.team === 0) {
          // IA compagni
          const att = ball.owner && ball.owner.team === 0;
          const tx = att ? clamp(p.hx + 55, FL + 40, FR - 34) : clamp((p.hx + ball.x) * 0.5, FL + 30, FR - 60);
          const ty = clamp(p.hy + Math.sin(performance.now() / 700 + p.hx) * 18, FT + 18, FB - 18);
          const a = Math.atan2(ty - p.y, tx - p.x), d = hypot(tx - p.x, ty - p.y);
          p.vx = d > 6 ? Math.cos(a) * p.spd * 0.82 * slow : 0;
          p.vy = d > 6 ? Math.sin(a) * p.spd * 0.82 * slow : 0;
        } else {
          // IA avversari
          if (ball.owner === p) {
            const distGoal = hypot(FL - p.x, H / 2 - p.y);
            if (distGoal < 105 && Math.random() < 0.045 * clamp(dm, 0.75, 1.3)) {
              const ay = clamp(H / 2 + (Math.random() - 0.5) * 38, GY1 + 6, GY2 - 6);
              const a = Math.atan2(ay - p.y, FL - p.x);
              ball.owner = null; ball.grabCd = 14;
              ball.vx = Math.cos(a) * 5.1; ball.vy = Math.sin(a) * 5.1;
            } else {
              const a = Math.atan2(H / 2 - p.y, FL + 20 - p.x);
              p.vx = Math.cos(a) * p.spd * 0.86;
              p.vy = Math.sin(a) * p.spd * 0.86;
            }
          } else {
            const chase = (!ball.owner || ball.owner.team === 0) && (p.role === "atk" || hypot(ball.x - p.x, ball.y - p.y) < 92);
            const tx = chase ? ball.x : (p.hx + ball.x * 0.35) / 1.35;
            const ty = chase ? ball.y : (p.hy + ball.y * 0.35) / 1.35;
            const a = Math.atan2(ty - p.y, tx - p.x), d = hypot(tx - p.x, ty - p.y);
            p.vx = d > 5 ? Math.cos(a) * p.spd * 0.82 : 0;
            p.vy = d > 5 ? Math.sin(a) * p.spd * 0.82 : 0;
            if (ball.owner && ball.owner.team === 0 && hypot(ball.owner.x - p.x, ball.owner.y - p.y) < 12 && ball.grabCd <= 0 && Math.random() < 0.055 * clamp(dm, 0.7, 1.25)) {
              ball.owner.stun = 14;
              ball.owner = p;
              ball.lastTeam = 1;
              ball.grabCd = 16;
            }
          }
        }
        p.x = clamp(p.x + p.vx, FL + 6, FR - 6);
        p.y = clamp(p.y + p.vy, FT + 6, FB - 6);
      });

      // Fisica palla
      if (ball.grabCd > 0) ball.grabCd--;
      if (ball.boost > 0) ball.boost--;
      if (ball.owner) {
        ball.x = ball.owner.x + ball.owner.face * 7;
        ball.y = ball.owner.y + 2;
        ball.vx = 0; ball.vy = 0; ball.z = 0; ball.vz = 0;
      } else {
        // Effetto Magnus su banda 104.2
        if (Math.abs(ball.spin) > 0.001) {
          const nx = -ball.vy, ny = ball.vx;
          ball.vx += nx * ball.spin * 0.22;
          ball.vy += ny * ball.spin * 0.22;
          ball.spin *= 0.985;
        }
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vx *= 0.972;
        ball.vy *= 0.972;
        if (ball.z > 0 || ball.vz > 0) {
          ball.z = Math.max(0, ball.z + ball.vz);
          ball.vz -= 0.18;
          if (ball.z <= 0) { ball.z = 0; ball.vz = 0; }
        }

        // Controllo gol o rimbalzo
        if (ball.x <= FL) {
          if (ball.y > GY1 && ball.y < GY2 && ball.z < 12) { scoreGoal(1); return; }
          ball.x = FL + 2; ball.vx = Math.abs(ball.vx) * 0.7;
        } else if (ball.x >= FR) {
          if (ball.y > GY1 && ball.y < GY2 && ball.z < 12) { scoreGoal(0); return; }
          ball.x = FR - 2; ball.vx = -Math.abs(ball.vx) * 0.7;
        }
        if (ball.y <= FT) { ball.y = FT + 2; ball.vy = Math.abs(ball.vy) * 0.75; }
        if (ball.y >= FB) { ball.y = FB - 2; ball.vy = -Math.abs(ball.vy) * 0.75; }

        // Raccolta palla o parata portiere
        if (ball.grabCd <= 0 && ball.z < 9) {
          for (let i = 0; i < allP.length; i++) {
            const p = allP[i];
            if (p.stun > 0) continue;
            const r = p.role === "gk" ? 13 : 10;
            if (hypot(p.x - ball.x, p.y - ball.y) <= r) {
              if (p.role === "gk" && ball.boost > 18 && p.team === 1 && Math.random() < 0.68) continue; // Onda d'Urto piega le mani!
              ball.owner = p;
              ball.lastTeam = p.team;
              ball.grabCd = 10;
              ball.boost = 0;
              ball.spin = 0;
              break;
            }
          }
        }
      }

      // Onde acustiche
      waves.forEach((w) => { w.r += 2.6; w.a -= 0.032; });
      waves = waves.filter((w) => w.a > 0 && w.r < w.maxR);
    }

    function drawScope(ts) {
      sg.fillStyle = "#03120c";
      sg.fillRect(0, 0, 76, 28);
      sg.strokeStyle = "rgba(16,185,129,0.2)";
      sg.lineWidth = 1;
      sg.beginPath(); sg.moveTo(0, 14); sg.lineTo(76, 14); sg.stroke();

      const col = BANDS[bandIdx].col;
      sg.strokeStyle = col;
      sg.lineWidth = 1.6;
      sg.beginPath();
      const freqMul = bandIdx === 0 ? 0.12 : bandIdx === 1 ? 0.24 : 0.42;
      const amp = 5 + (1 - Math.min(beatPhase, 1 - beatPhase) * 2) * 5;
      for (let x = 0; x < 76; x += 2) {
        const y = 14 + Math.sin(x * freqMul + ts * 0.014) * amp;
        if (x === 0) sg.moveTo(x, y); else sg.lineTo(x, y);
      }
      sg.stroke();
    }

    function draw(ts) {
      // Sfondo campo
      g.fillStyle = venue.border;
      g.fillRect(0, 0, W, H);
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 === 0 ? venue.bg1 : venue.bg2;
        g.fillRect(FL + (FW / 8) * i, FT, FW / 8 + 0.5, FH);
      }

      // Riflettori ambrati anni '70
      [[FL, FT], [FR, FT], [FL, FB], [FR, FB]].forEach(([lx, ly]) => {
        const rg = g.createRadialGradient(lx, ly, 4, lx, ly, 110);
        rg.addColorStop(0, `rgba(${venue.lamp},0.22)`);
        rg.addColorStop(1, `rgba(${venue.lamp},0)`);
        g.fillStyle = rg;
        g.fillRect(FL, FT, FW, FH);
      });

      if (flashLightning > 0) {
        g.fillStyle = `rgba(226,232,240,${flashLightning * 0.04})`;
        g.fillRect(0, 0, W, H);
      }

      // Linee campo e porte
      g.strokeStyle = venue.line;
      g.lineWidth = 1.5;
      g.strokeRect(FL, FT, FW, FH);
      g.beginPath();
      g.moveTo(W / 2, FT); g.lineTo(W / 2, FB);
      g.stroke();
      g.beginPath(); g.arc(W / 2, H / 2, 26, 0, Math.PI * 2); g.stroke();
      g.strokeRect(FL, H / 2 - 44, 38, 88);
      g.strokeRect(FR - 38, H / 2 - 44, 38, 88);

      // Porte con rete
      g.fillStyle = "rgba(255,255,255,0.16)";
      g.fillRect(FL - 10, GY1, 10, GY2 - GY1);
      g.fillRect(FR, GY1, 10, GY2 - GY1);
      g.strokeStyle = "#f8fafc";
      g.lineWidth = 2;
      g.strokeRect(FL - 10, GY1, 10, GY2 - GY1);
      g.strokeRect(FR, GY1, 10, GY2 - GY1);

      // Coni di Disturbo Statico
      staticCones.forEach((sc) => {
        if (sc.mute > 0) {
          g.strokeStyle = "rgba(52,211,153,0.22)";
          g.setLineDash([3, 3]);
          g.beginPath(); g.arc(sc.x, sc.y, sc.r, 0, Math.PI * 2); g.stroke();
          g.setLineDash([]);
          return;
        }
        g.fillStyle = "rgba(148,163,184,0.19)";
        g.beginPath(); g.arc(sc.x, sc.y, sc.r, 0, Math.PI * 2); g.fill();
        g.strokeStyle = "rgba(203,213,225,0.55)";
        g.lineWidth = 1.2;
        g.beginPath(); g.arc(sc.x, sc.y, sc.r, 0, Math.PI * 2); g.stroke();
        // Puntini di fruscio TV
        g.fillStyle = "rgba(248,250,252,0.55)";
        for (let k = 0; k < 9; k++) {
          const a = (k * 2.1 + ts * 0.01) % 6.28;
          const rr = ((k * 7 + ts * 0.05) % (sc.r - 4));
          g.fillRect(sc.x + Math.cos(a) * rr, sc.y + Math.sin(a) * rr, 2, 1.5);
        }
      });

      // Anello ritmico attorno al giocatore attivo / portatore
      const ringTarget = (ball.owner && ball.owner.team === 0) ? ball.owner : ctrl;
      if (ringTarget) {
        const shrinkR = 28 - beatPhase * 17;
        const onBeat = Math.min(beatPhase, 1 - beatPhase) <= 0.21 + (track.tolBonus || 0);
        g.strokeStyle = "rgba(253,230,138,0.45)";
        g.lineWidth = 1.5;
        g.beginPath(); g.arc(ringTarget.x, ringTarget.y, 11, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = onBeat ? "#fde68a" : BANDS[bandIdx].col;
        g.lineWidth = onBeat ? 2.6 : 1.6;
        g.beginPath(); g.arc(ringTarget.x, ringTarget.y, Math.max(10, shrinkR), 0, Math.PI * 2); g.stroke();
      }

      // Onde d'urto espanse
      waves.forEach((w) => {
        g.strokeStyle = w.col;
        g.globalAlpha = clamp(w.a, 0, 1);
        g.lineWidth = 3;
        g.beginPath(); g.arc(w.x, w.y, w.r, 0, Math.PI * 2); g.stroke();
        g.globalAlpha = 1;
      });

      // Giocatori (ordinati per Y, etichette SOTTO i piedi per non coprire mai la testa)
      allP.slice().sort((a, b) => a.y - b.y).forEach((p) => {
        const col = p.team === 0 ? homeCol : awayCol;
        // Ombra a terra
        g.fillStyle = "rgba(0,0,0,0.38)";
        g.beginPath(); g.ellipse(p.x, p.y + 6, 6, 3, 0, 0, Math.PI * 2); g.fill();
        // Maglia
        g.fillStyle = p.stun > 0 && Math.floor(ts / 60) % 2 === 0 ? "#94a3b8" : col;
        g.beginPath(); g.arc(p.x, p.y, 6.2, 0, Math.PI * 2); g.fill();
        g.strokeStyle = p === ctrl ? "#fde68a" : "#0f172a";
        g.lineWidth = p === ctrl ? 2 : 1.2;
        g.stroke();
        // Testa
        g.fillStyle = p.team === 0 ? "#f1c27d" : "#e2b887";
        g.beginPath(); g.arc(p.x, p.y - 5.5, 4.2, 0, Math.PI * 2); g.fill();
        // Etichetta sotto i piedi per il controllato e il portatore
        if (p === ctrl || p === ball.owner) {
          g.font = "bold 7.5px sans-serif";
          g.textAlign = "center";
          const tw = g.measureText(p.name).width + 6;
          g.fillStyle = "rgba(9,13,22,0.78)";
          g.fillRect(p.x - tw / 2, p.y + 9, tw, 9);
          g.fillStyle = p.team === 0 ? "#fde68a" : "#e2e8f0";
          g.fillText(p.name, p.x, p.y + 16);
        }
      });

      // Pallone
      g.fillStyle = "rgba(0,0,0,0.4)";
      g.beginPath(); g.ellipse(ball.x, ball.y + 3, 4, 2, 0, 0, Math.PI * 2); g.fill();
      if (ball.boost > 0) {
        g.fillStyle = "rgba(253,230,138,0.45)";
        g.beginPath(); g.arc(ball.x, ball.y - ball.z, 7, 0, Math.PI * 2); g.fill();
      }
      g.fillStyle = "#ffffff";
      g.beginPath(); g.arc(ball.x, ball.y - ball.z, 4.2, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#1e293b";
      g.lineWidth = 1;
      g.stroke();

      // Vinile 45 giri animato in alto a destra sul campo
      const vx = W - 26, vy = 26;
      g.save();
      g.translate(vx, vy);
      g.rotate((ts * 0.0045) % (Math.PI * 2));
      g.fillStyle = "#090d16";
      g.beginPath(); g.arc(0, 0, 15, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#334155";
      g.lineWidth = 1;
      g.beginPath(); g.arc(0, 0, 11, 0, Math.PI * 2); g.stroke();
      g.fillStyle = track.id === "blues" ? "#2563eb" : "#dc2626";
      g.beginPath(); g.arc(0, 0, 6, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#fde68a";
      g.fillRect(-1.5, -6, 3, 3);
      g.fillStyle = "#090d16";
      g.beginPath(); g.arc(0, 0, 1.8, 0, Math.PI * 2); g.fill();
      g.restore();
      // Puntina e flash del battito sul vinile
      const pulseOn = Math.min(beatPhase, 1 - beatPhase) < 0.18;
      g.strokeStyle = pulseOn ? "#fde68a" : "#cbd5e1";
      g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(W - 8, 12); g.lineTo(vx + 5, vy - 2); g.stroke();
      if (pulseOn) {
        g.strokeStyle = "rgba(253,230,138,0.85)";
        g.lineWidth = 2;
        g.beginPath(); g.arc(vx, vy, 17, 0, Math.PI * 2); g.stroke();
      }

      // Callout in sovraimpressione sul campo
      if (callout.t > 0) {
        g.font = "900 11px sans-serif";
        g.textAlign = "center";
        const w = g.measureText(callout.txt).width + 16;
        g.fillStyle = "rgba(9,13,22,0.84)";
        g.fillRect(W / 2 - w / 2, FT + 4, w, 18);
        g.strokeStyle = callout.col;
        g.lineWidth = 1.2;
        g.strokeRect(W / 2 - w / 2, FT + 4, w, 18);
        g.fillStyle = callout.col;
        g.fillText(callout.txt, W / 2, FT + 16.5);
      }
      g.textAlign = "left";
      drawScope(ts);
    }

    function loop(ts) {
      if (finished || !root.isConnected) return;
      const dt = clamp((ts - lastTs) / 1000, 0.005, 0.05);
      lastTs = ts;
      step(dt);
      draw(ts);
      raf = requestAnimationFrame(loop);
    }

    curState = {
      get active() { return !finished && root.isConnected; },
      get score() { return [scoreA, scoreB]; },
      get band() { return BANDS[bandIdx].id; },
      get half() { return half; },
      selectBand,
      pass: doPass,
      shoot: doShootOrTackle,
      finish: (a, b, extra) => concludeMatch(a, b, Object.assign({ instant: true }, extra || {}))
    };

    resetPositions(0);
    raf = requestAnimationFrame(loop);
    return true;
  }

  window.__urto = {
    start,
    get state() { return curState; },
    finishTest(a, b, extra) {
      if (curState && curState.finish) {
        const ex = typeof extra === "boolean" ? { cleanVinylLap: extra } : (extra || {});
        curState.finish(typeof a === "number" ? a : 3, typeof b === "number" ? b : 1, ex);
        return true;
      }
      return false;
    }
  };
})();
