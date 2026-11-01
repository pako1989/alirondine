// js/flash68.js — «FLASH & CONTROPIEDE '68» · motore arcade 2D originale per «La Tipografia di Mezzanotte»
// Partita 3v3 + portieri nel Borgo Alta del 1968 in tandem con la fotografa Clara Luce a bordo campo:
// il suo Riquadro d'Obiettivo dorato scorre sul terreno; premendo 📸 FLASH mentre palla o contrasto sono nell'inquadratura
// scatti una foto al magnesio che abbaglia i rivali, carica i 3 segmenti della ROTATIVA e sblocca il TIRO EDIZIONE STRAORDINARIA!
(function () {
  "use strict";
  if (window.__flash68) return;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hypot = Math.hypot || ((x, y) => Math.sqrt(x * x + y * y));

  function hexRgb(hex) {
    const s = String(hex || "#1f6f54").replace("#", "").trim();
    const full = s.length === 3 ? s[0] + s[0] + s[1] + s[1] + s[2] + s[2] : s.padEnd(6, "0");
    const n = parseInt(full.slice(0, 6), 16) || 0x1f6f54;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lum(rgb) {
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  }
  function colorDist(a, b) {
    const x = hexRgb(a), y = hexRgb(b);
    return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]);
  }
  function ensureContrast(usCol, oppCol) {
    const u = usCol || "#1f6f54";
    let o = oppCol || "#c83228";
    if (colorDist(u, o) < 150) {
      o = lum(hexRgb(u)) > 0.5 ? "#1e293b" : "#f59e0b";
      if (colorDist(u, o) < 150) o = "#c83228";
    }
    return [u, o];
  }

  let sharedAc = null;
  function sfx(kind) {
    try {
      const U = window.__sagaCore && window.__sagaCore.util;
      if (kind === "whistle" && U && U.tone) {
        U.tone(1480, 0.12, "sine", 0.06);
        setTimeout(() => U.tone(1680, 0.22, "sine", 0.07), 110);
        return;
      }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!sharedAc) sharedAc = new AC();
      if (sharedAc.state === "suspended") sharedAc.resume().catch(() => {});
      const now = sharedAc.currentTime;
      const osc = sharedAc.createOscillator();
      const gain = sharedAc.createGain();
      osc.connect(gain);
      gain.connect(sharedAc.destination);
      if (kind === "shutter") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1900, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.095);
        // Lampo al magnesio
        const o2 = sharedAc.createOscillator(), g2 = sharedAc.createGain();
        o2.type = "sine";
        o2.frequency.setValueAtTime(880, now + 0.03);
        o2.frequency.exponentialRampToValueAtTime(1560, now + 0.18);
        g2.gain.setValueAtTime(0.06, now + 0.03);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        o2.connect(g2); g2.connect(sharedAc.destination);
        o2.start(now + 0.03); o2.stop(now + 0.2);
      } else if (kind === "super") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.28);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.31);
      } else if (kind === "goal") {
        [523, 659, 784, 1046].forEach((f, i) => {
          const o = sharedAc.createOscillator(), g = sharedAc.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(f, now + i * 0.07);
          g.gain.setValueAtTime(0.07, now + i * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
          o.connect(g); g.connect(sharedAc.destination);
          o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.23);
        });
        osc.disconnect();
      } else if (kind === "kick") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.085);
      } else {
        osc.type = "square";
        osc.frequency.setValueAtTime(260, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now); osc.stop(now + 0.065);
      }
    } catch (e) {}
  }

  const VENUES = {
    edicole: {
      name: "Cortile delle Edicole",
      sky: "#3b526b",
      turfA: "#8c7d6b",
      turfB: "#827361",
      line: "#f5ebd6",
      bales: true,
      boardA: "L'ECO DEL PALLONE · 1921",
      boardB: "EDICOLA ORESTE · BORGO ALTA"
    },
    acacie: {
      name: "Campo delle Acacie",
      sky: "#476042",
      turfA: "#4d7c43",
      turfB: "#44703b",
      line: "#f5ebd6",
      puddles: [
        { x: 138, y: 86, rx: 24, ry: 13 },
        { x: 226, y: 152, rx: 26, ry: 14 }
      ],
      boardA: "CHINOTTO DEL BORGO",
      boardB: "U.S. ACACIE 1921"
    },
    portico: {
      name: "Portico Notturno sotto i Lampioni",
      sky: "#172033",
      turfA: "#3d4859",
      turfB: "#353f4f",
      line: "#fde68a",
      lamps: [
        { x: 108, y: 118, r: 40 },
        { x: 180, y: 92, r: 42 },
        { x: 252, y: 144, r: 40 }
      ],
      boardA: "BAR SPORT · TOTOCALCIO",
      boardB: "EDIZIONE DELLA NOTTE"
    },
    stadio: {
      name: "Stadio delle Acacie Gremito",
      sky: "#1e293b",
      turfA: "#2f7a48",
      turfB: "#286c3f",
      line: "#fffbeb",
      crowd: true,
      umbrellas: true,
      boardA: "GIÙ LE MANI DALLE ACACIE",
      boardB: "L'ECO DEL PALLONE LIBERO"
    }
  };

  function injectCss() {
    if (document.getElementById("flash68Css")) return;
    const st = document.createElement("style");
    st.id = "flash68Css";
    st.textContent = `
      .f68Root{position:fixed;inset:0;z-index:9600;background:#14110f;color:#f5ebd6;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px 8px 8px;font-family:'Trebuchet MS',system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none;overflow:hidden}
      .f68Top{width:min(100%,540px);display:grid;grid-template-columns:1fr auto 1fr auto;align-items:center;gap:6px;background:#231e1a;border:2px solid #eab308;border-radius:8px;padding:4px 8px;box-sizing:border-box}
      .f68Team{font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .f68Team.r{text-align:right}
      .f68Mid{display:flex;flex-direction:column;align-items:center;line-height:1.05}
      .f68Score{font-size:19px;font-weight:900;color:#fde047;letter-spacing:1.5px}
      .f68Clock{font-size:10.5px;color:#d6d3d1;font-weight:700}
      .f68Exit{background:#3b2f28;color:#f5ebd6;border:1.5px solid #a8a29e;border-radius:6px;width:30px;height:28px;font-weight:900;font-size:13px;cursor:pointer;margin-left:4px;display:flex;align-items:center;justify-content:center}
      .f68Sub{width:min(100%,540px);display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11px;padding:2px 4px;box-sizing:border-box}
      .f68Meter{display:flex;align-items:center;gap:4px;font-weight:800}
      .f68Seg{width:18px;height:8px;border-radius:3px;border:1px solid #eab308;background:#292524}
      .f68Seg.on{background:#eab308;box-shadow:0 0 6px rgba(234,179,8,.75)}
      .f68Seg.max{background:#ef4444;border-color:#fde047;animation:f68Pulse .45s infinite alternate}
      @keyframes f68Pulse{from{transform:scale(1)}to{transform:scale(1.14)}}
      .f68Wrap{position:relative;width:min(100%,540px,calc((100dvh - 178px) * 1.636));aspect-ratio:18/11;height:auto;flex:none;border:2px solid #d6c7a9;border-radius:8px;overflow:hidden;background:#1c1917;box-shadow:0 6px 20px rgba(0,0,0,.5)}
      .f68Wrap canvas{width:100%;height:100%;display:block;touch-action:none}
      .f68Pad{width:min(100%,540px);display:grid;grid-template-columns:92px 1fr;gap:8px;align-items:center;box-sizing:border-box}
      .f68Joy{width:84px;height:84px;border-radius:50%;background:radial-gradient(circle,#362f29 0%,#1f1a17 75%);border:2px solid #a8997c;position:relative;touch-action:none;justify-self:center}
      .f68Knob{width:32px;height:32px;border-radius:50%;background:#eab308;border:2px solid #fffbeb;position:absolute;left:26px;top:26px;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,.45)}
      .f68Btns{display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:6px}
      .f68Btn{border:2px solid #f5ebd6;border-radius:9px;padding:10px 4px;font:900 12.5px/1.1 'Trebuchet MS',system-ui,sans-serif;color:#fffbeb;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;touch-action:none}
      .f68Btn small{font-size:9.5px;font-weight:700;opacity:.9}
      .f68Btn.pass{background:#1f6f54;border-color:#a7f3d0}
      .f68Btn.shoot{background:#b91c1c;border-color:#fecaca}
      .f68Btn.flash{background:#b45309;border-color:#fde047;color:#fffbeb}
      .f68Btn.flash.ready{background:linear-gradient(180deg,#eab308,#b45309);color:#1c1917}
      .f68Ov{position:absolute;inset:0;background:rgba(16,13,11,.90);display:flex;align-items:center;justify-content:center;padding:12px;z-index:20;overflow:auto}
      .f68Card{background:#f5ebd6;color:#1c1917;border:3px solid #1f6f54;border-radius:8px;padding:12px 14px;max-width:400px;width:100%;box-shadow:0 10px 26px rgba(0,0,0,.6)}
      .f68Card h3{margin:0 0 6px;font-size:18px;color:#1f6f54;border-bottom:2px solid #1c1917;padding-bottom:4px;letter-spacing:.4px}
      .f68Card p{margin:5px 0;font-size:12.8px;line-height:1.36}
      .f68Card .cta{margin-top:9px;width:100%;padding:10px;border-radius:7px;border:2px solid #1c1917;background:#c83228;color:#fffbeb;font:900 14.5px 'Trebuchet MS',sans-serif;cursor:pointer}
      @media (max-height:520px) and (orientation:landscape){
        .f68Root{padding:3px 6px}
        .f68Wrap{width:min(100%,calc((100dvh - 118px) * 1.636))}
        .f68Joy{width:64px;height:64px}.f68Knob{width:24px;height:24px;left:20px;top:20px}
        .f68Btn{padding:6px 4px;font-size:11.5px}
      }
      @media (max-width:350px){
        .f68Pad{grid-template-columns:74px 1fr;gap:5px}
        .f68Joy{width:68px;height:68px}.f68Knob{width:26px;height:26px;left:21px;top:21px}
        .f68Btn{font-size:11px;padding:8px 2px}
      }
    `;
    document.head.appendChild(st);
  }

  let curState = null;

  function start(opts) {
    opts = opts || {};
    injectCss();
    const prev = document.getElementById("flash68Root");
    if (prev) prev.remove();

    const onDone = opts.onDone || opts.done || function () {};
    const C = window.__sagaCore;
    const cur = (C && C.cur) || { diff: "normale", style: "equilibrata", opts: { ai: 1, gk: 1 } };
    const diffKey = opts.diff || cur.diff || "normale";
    const aiMul = diffKey === "storia" ? 0.78 : diffKey === "sfida" ? 1.16 : 0.96;
    const oppStyle = opts.oppStyle || cur.style || "equilibrata";

    const buffs = Array.isArray(opts.buffs) ? opts.buffs : [];
    const hasBuff = (b) => buffs.includes(b);
    const rawBonus = opts.bonus;
    const bon = typeof rawBonus === "object" && rawBonus
      ? { at: rawBonus.at | 0, df: rawBonus.df | 0, te: rawBonus.te | 0 }
      : { at: rawBonus | 0, df: rawBonus | 0, te: rawBonus | 0 };

    const venueKey = VENUES[opts.venue] ? opts.venue : (opts.boss ? "stadio" : "edicole");
    const V = VENUES[venueKey];
    const isBoss = !!(opts.boss || venueKey === "stadio" && opts.umbrellas !== false && opts.opp && /Stampa|Sartori/i.test(opts.opp));
    const useUmbrellas = !!(opts.umbrellas != null ? opts.umbrellas : (isBoss || V.umbrellas));

    const heroLook = opts.heroLook || {};
    const [usCol, oppCol] = ensureContrast(opts.usColor || heroLook.shirt || "#1f6f54", opts.oppColor || "#c83228");
    const usName = opts.us || "U.S. Acacie '68";
    const oppName = opts.opp || (useUmbrellas ? "Real Stampa Moderna" : "Dopolavoro Sartori");

    const W = 360, H = 220;
    const FL = 22, FR = 338, FT = 30, FB = 204;
    const GY1 = 92, GY2 = 142;

    const root = document.createElement("div");
    root.id = "flash68Root";
    root.className = "f68Root";
    root.innerHTML = `
      <div class="f68Top">
        <div class="f68Team" id="f68Us"></div>
        <div class="f68Mid">
          <div class="f68Score" id="f68Score">0 - 0</div>
          <div class="f68Clock" id="f68Clock">1° TEMPO · 00:36</div>
        </div>
        <div class="f68Team r" id="f68Opp"></div>
        <button type="button" class="f68Exit" id="f68Exit" title="Esci">✕</button>
      </div>
      <div class="f68Sub">
        <div class="f68Meter">
          <span>📰 ROTATIVA:</span>
          <span class="f68Seg" id="f68Seg0"></span>
          <span class="f68Seg" id="f68Seg1"></span>
          <span class="f68Seg" id="f68Seg2"></span>
        </div>
        <div id="f68Shots" style="font-weight:800;color:#fde047">📸 Scatti: 0</div>
      </div>
      <div class="f68Wrap" id="f68Wrap">
        <canvas id="f68Cv" width="${W * 2}" height="${H * 2}"></canvas>
      </div>
      <div class="f68Pad">
        <div class="f68Joy" id="f68Joy"><div class="f68Knob" id="f68Knob"></div></div>
        <div class="f68Btns">
          <button type="button" class="f68Btn pass" id="f68Pass">⚽ PASSA<small>Smista / Cambio</small></button>
          <button type="button" class="f68Btn shoot" id="f68Shoot">🔥 TIRA<small>Contrasto</small></button>
          <button type="button" class="f68Btn flash ready" id="f68Flash">📸 FLASH<small>Scatto Clara</small></button>
        </div>
      </div>
    `;
    document.body.appendChild(root);

    const usEl = root.querySelector("#f68Us");
    const oppEl = root.querySelector("#f68Opp");
    const scoreEl = root.querySelector("#f68Score");
    const clockEl = root.querySelector("#f68Clock");
    const shotsEl = root.querySelector("#f68Shots");
    const flashBtn = root.querySelector("#f68Flash");
    const shootBtn = root.querySelector("#f68Shoot");
    const wrap = root.querySelector("#f68Wrap");
    const cv = root.querySelector("#f68Cv");
    const g = cv.getContext("2d");

    usEl.textContent = usName;
    usEl.style.color = "#86efac";
    oppEl.textContent = oppName;
    oppEl.style.color = "#fca5a5";

    const mateNames = Array.isArray(opts.mates) && opts.mates.length
      ? opts.mates.map((m) => m.name || m.n || "Tino")
      : ["Tino", "Beppe"];

    const mkPlayer = (team, role, name, x, y, col, skin, hair) => ({
      team, role, name, x, y, hx: x, hy: y, vx: 0, vy: 0,
      dirX: team === 0 ? 1 : -1, dirY: 0,
      col, skin: skin || "#ecc49c", hair: hair || "#292524",
      stun: 0, tackleCd: 0
    });

    const home = [
      mkPlayer(0, "gk", "Remo", FL + 8, (FT + FB) / 2, "#eab308", "#e8be96", "#44403c"),
      mkPlayer(0, "df", mateNames[1] || "Beppe", FL + 76, (FT + FB) / 2 + 28, usCol, "#dfb18b", "#1c1917"),
      mkPlayer(0, "fw", mateNames[0] || "Tino", FL + 114, (FT + FB) / 2 - 28, usCol, "#f1c8a6", "#78350f"),
      mkPlayer(0, "hero", heroLook.name || "Campione", FL + 132, (FT + FB) / 2, usCol, heroLook.skin || "#e8be96", heroLook.hair || "#1f2937")
    ];
    const away = [
      mkPlayer(1, "gk", "Portiere", FR - 8, (FT + FB) / 2, "#38bdf8", "#e5b890", "#1e293b"),
      mkPlayer(1, "df", useUmbrellas ? "Censore" : "Stopper", FR - 74, (FT + FB) / 2 - 26, oppCol, "#d9a679", "#111827"),
      mkPlayer(1, "df", useUmbrellas ? "Ispettore" : "Mediano", FR - 78, (FT + FB) / 2 + 26, oppCol, "#e8be96", "#374151"),
      mkPlayer(1, "fw", useUmbrellas ? "Capo Cronista" : "Ala", FR - 128, (FT + FB) / 2, oppCol, "#f1c8a6", "#451a03")
    ];

    let ctrl = home[3];
    const ball = { x: W / 2, y: (FT + FB) / 2, vx: 0, vy: 0, spin: 0, owner: null, grabCd: 0, super: false, lastTeam: 0, trail: [] };

    const clara = {
      x: W / 2,
      y: FT - 11,
      vx: 1.1,
      viewX: W / 2 + 22,
      viewY: (FT + FB) / 2,
      viewW: 64 + (hasBuff("flash_extra") ? 10 : 0) + bon.te * 3,
      viewH: 48 + (hasBuff("flash_extra") ? 6 : 0) + bon.te * 2,
      phase: 0
    };

    let phase = opts.tutorial === false ? "play" : "intro";
    let finished = false;
    let raf = 0;
    let scoreA = 0, scoreB = 0;
    const totalSec = clamp(opts.durSec || (isBoss ? 42 : 36), 18, 90);
    let timeLeft = totalSec;
    let overtime = false;
    let halfBannerShown = false;
    let rotativa = hasBuff("flash_extra") ? 1 : 0;
    let perfectShots = 0;
    let flashesUsed = 0;
    let dazzledTotal = 0;
    let superGoals = 0;
    let flashCd = 0;
    let flashBurst = 0;
    let polaroid = null; // { txt, t }
    let banner = { txt: "", col: "#fde047", t: 0 };
    let goalFreeze = 0;
    let recentPassTimer = 0;
    let animFrame = 0;

    const keys = {};
    const joy = { active: false, id: null, dx: 0, dy: 0 };
    const manualMove = { dx: 0, dy: 0, t: 0 };

    function showBanner(txt, col, frames) {
      banner = { txt, col: col || "#fde047", t: frames || 85 };
    }

    function resetKickoff(kickTeam) {
      home[0].x = FL + 9; home[0].y = (FT + FB) / 2;
      home[1].x = FL + 72; home[1].y = (FT + FB) / 2 + 28;
      home[2].x = FL + 112; home[2].y = (FT + FB) / 2 - 26;
      home[3].x = FL + 138; home[3].y = (FT + FB) / 2 + 2;

      away[0].x = FR - 9; away[0].y = (FT + FB) / 2;
      away[1].x = FR - 72; away[1].y = (FT + FB) / 2 - 26;
      away[2].x = FR - 76; away[2].y = (FT + FB) / 2 + 26;
      away[3].x = FR - 126; away[3].y = (FT + FB) / 2;

      home.concat(away).forEach((p) => { p.vx = 0; p.vy = 0; p.stun = 0; p.tackleCd = 0; });
      ctrl = home[3];
      ball.x = W / 2;
      ball.y = (FT + FB) / 2;
      ball.vx = 0;
      ball.vy = 0;
      ball.spin = 0;
      ball.super = false;
      ball.trail = [];
      ball.grabCd = 14;
      ball.owner = kickTeam === 1 ? away[3] : home[3];
      if (ball.owner) {
        ball.owner.x = W / 2 + (kickTeam === 1 ? 10 : -10);
        ball.owner.y = (FT + FB) / 2;
      }
      clara.viewX = W / 2 + 18;
      clara.viewY = (FT + FB) / 2;
    }

    function syncHud() {
      scoreEl.textContent = `${scoreA} - ${scoreB}`;
      const sec = Math.max(0, Math.ceil(timeLeft));
      const mm = String(Math.floor(sec / 60)).padStart(2, "0");
      const ss = String(sec % 60).padStart(2, "0");
      clockEl.textContent = overtime ? `SUPPLEMENTARE · ${mm}:${ss}` : `${timeLeft > totalSec / 2 ? "1°" : "2°"} TEMPO · ${mm}:${ss}`;
      shotsEl.textContent = `📸 Scatti: ${perfectShots}`;
      for (let i = 0; i < 3; i++) {
        const seg = root.querySelector("#f68Seg" + i);
        if (seg) seg.className = "f68Seg" + (rotativa > i ? (rotativa >= 3 ? " on max" : " on") : "");
      }
      if (flashCd <= 0) {
        flashBtn.classList.add("ready");
        flashBtn.innerHTML = `📸 FLASH<small>Pronto!</small>`;
      } else {
        flashBtn.classList.remove("ready");
        flashBtn.innerHTML = `📸 RULLINO<small>${(flashCd / 60).toFixed(1)}s</small>`;
      }
      if (rotativa >= 3 && ball.owner && ball.owner.team === 0) {
        shootBtn.innerHTML = `📰 EDIZIONE!<small>Super-Tiro</small>`;
      } else if (ball.owner && ball.owner.team === 0) {
        shootBtn.innerHTML = `🔥 TIRA<small>In porta</small>`;
      } else {
        shootBtn.innerHTML = `⚡ CONTRASTA<small>Ruba palla</small>`;
      }
    }

    function insideViewfinder(x, y, pad) {
      const p = pad || 0;
      return Math.abs(x - clara.viewX) <= clara.viewW / 2 + p && Math.abs(y - clara.viewY) <= clara.viewH / 2 + p;
    }

    function actFlash() {
      if (finished || phase !== "play" || goalFreeze > 0) return false;
      if (flashCd > 0) {
        showBanner("🎞️ Clara sta riavvolgendo la pellicola!", "#fca5a5", 45);
        return false;
      }
      flashesUsed++;
      const baseCd = hasBuff("flash_extra") ? 105 : 138;
      flashCd = Math.max(72, baseCd - bon.te * 8);
      flashBurst = 18;
      sfx("shutter");

      // Lampioni nel portico ampliano il raggio del lampo
      let lampBonus = 0;
      if (V.lamps) {
        V.lamps.forEach((L) => {
          if (hypot(clara.viewX - L.x, clara.viewY - L.y) < L.r + 18) lampBonus = 18;
        });
      }

      const ballIn = insideViewfinder(ball.x, ball.y, 10 + lampBonus * 0.5);
      const oppsNear = away.slice(1).filter((o) => insideViewfinder(o.x, o.y, 14 + lampBonus));
      const homeNear = home.slice(1).filter((m) => insideViewfinder(m.x, m.y, 16 + lampBonus));
      const actionInFrame = ballIn || (oppsNear.length > 0 && homeNear.length > 0);

      let stunnedNow = 0;
      let blockedByUmbrella = 0;

      oppsNear.forEach((o) => {
        // Boss: ombrello nero para il flash frontale se non hai appena smistato palla o aggirato il difensore
        const umbrellaActive = useUmbrellas && recentPassTimer <= 0 && o.x >= ball.x - 6 && Math.abs(o.vy) < 1.35;
        if (umbrellaActive) {
          blockedByUmbrella++;
          o.vx -= 0.4;
        } else {
          o.stun = Math.max(o.stun, actionInFrame ? 108 : 42);
          stunnedNow++;
          dazzledTotal++;
          if (ball.owner === o) {
            ball.owner = null;
            ball.vx = -1.2;
            ball.vy = (Math.random() - 0.5) * 1.6;
            ball.grabCd = 10;
          }
        }
      });

      if (actionInFrame && (stunnedNow > 0 || ballIn)) {
        if (blockedByUmbrella > 0 && stunnedNow === 0) {
          showBanner("☂️ OMBRELLI NERI! Passa palla di lato (⚽) prima del Flash!", "#fde047", 95);
          syncHud();
          return false;
        }
        perfectShots++;
        rotativa = Math.min(3, rotativa + 1);
        polaroid = {
          txt: rotativa >= 3 ? "EDIZIONE PRONTA!" : `SCATTO #${perfectShots}`,
          t: 95
        };
        showBanner(
          rotativa >= 3
            ? "📰 ROTATIVA CARICA! Premi TIRA per l'Edizione Straordinaria!"
            : `📸 SCATTO DA PRIMA PAGINA! (${stunnedNow ? stunnedNow + " abbagliati" : "Rotativa +1"})`,
          "#fde047",
          90
        );
        syncHud();
        return true;
      }

      if (blockedByUmbrella > 0) {
        showBanner("☂️ Ombrello anti-flash! Smista palla con PASSA per bucare la guardia!", "#fca5a5", 85);
      } else {
        showBanner("🎞️ Scatto a vuoto: aspetta palla o contrasto nel riquadro d'oro!", "#cbd5e1", 65);
      }
      syncHud();
      return false;
    }

    function actPass() {
      if (finished || phase !== "play" || goalFreeze > 0) return false;
      if (ball.owner && ball.owner.team === 0) {
        const p = ball.owner;
        const mates = home.filter((m) => m !== p && m.role !== "gk");
        let target = mates[0];
        let best = -9999;
        mates.forEach((m) => {
          const sc = m.x * 1.25 - hypot(m.x - p.x, m.y - p.y) * 0.45 + (insideViewfinder(m.x, m.y, 14) ? 35 : 0);
          if (sc > best) { best = sc; target = m; }
        });
        if (!target) return false;
        const ang = Math.atan2(target.y - p.y, target.x - p.x);
        const spd = 4.9 + bon.te * 0.25 + (hasBuff("scatto_strilloni") ? 0.45 : 0);
        ball.owner = null;
        ball.grabCd = 9;
        ball.super = false;
        ball.spin = 0;
        ball.vx = Math.cos(ang) * spd;
        ball.vy = Math.sin(ang) * spd;
        ctrl = target;
        recentPassTimer = 95;
        sfx("kick");
        showBanner("⚽ Smistamento rapido! Ora usa il Flash o tira!", "#86efac", 55);
        syncHud();
        return true;
      } else {
        // Cambio cursore al compagno più vicino alla palla
        let best = home[3], bd = 9999;
        home.slice(1).forEach((m) => {
          const d = hypot(m.x - ball.x, m.y - ball.y);
          if (d < bd) { bd = d; best = m; }
        });
        ctrl = best;
        sfx("tap");
        return true;
      }
    }

    function actShoot() {
      if (finished || phase !== "play" || goalFreeze > 0) return false;
      if (ball.owner && ball.owner.team === 0) {
        const p = ball.owner;
        const inp = getInputVec();
        const aimOffset = inp.y ? inp.y * 19 : (p.y < (FT + FB) / 2 ? 14 : -14);
        const targetY = clamp((GY1 + GY2) / 2 + aimOffset, GY1 + 5, GY2 - 5);
        const ang = Math.atan2(targetY - p.y, FR + 6 - p.x);
        const isSuper = rotativa >= 3;
        const spd = (isSuper ? 7.8 : 5.7) + bon.at * 0.28;
        ball.owner = null;
        ball.grabCd = 11;
        ball.vx = Math.cos(ang) * spd;
        ball.vy = Math.sin(ang) * spd;
        ball.spin = (hasBuff("effetto_piombo") || isSuper) ? (p.y < (FT + FB) / 2 ? 0.085 : -0.085) : 0;
        ball.super = isSuper;
        if (isSuper) {
          rotativa = 0;
          sfx("super");
          showBanner("📰 TIRO EDIZIONE STRAORDINARIA!", "#fde047", 95);
        } else {
          sfx("kick");
        }
        syncHud();
        return true;
      } else {
        // Contrasto / scatto verso il pallone
        const p = ctrl;
        if (p.tackleCd > 0 || p.stun > 0) return false;
        p.tackleCd = 22;
        const ang = Math.atan2(ball.y - p.y, ball.x - p.x);
        p.vx = Math.cos(ang) * 3.6;
        p.vy = Math.sin(ang) * 3.6;
        const reach = 21 + bon.df * 2;
        if (hypot(ball.x - p.x, ball.y - p.y) <= reach) {
          if (ball.owner && ball.owner.team === 1) ball.owner.stun = Math.max(ball.owner.stun, 28);
          ball.owner = p;
          ball.super = false;
          ball.grabCd = 12;
          sfx("kick");
          showBanner("⚡ Contrasto pulito!", "#86efac", 45);
          syncHud();
          return true;
        }
        sfx("tap");
        return false;
      }
    }

    function getInputVec() {
      let dx = 0, dy = 0;
      if (manualMove.t > 0) {
        dx = manualMove.dx;
        dy = manualMove.dy;
      } else if (joy.active) {
        dx = joy.dx;
        dy = joy.dy;
      } else {
        if (keys.ArrowLeft || keys.KeyA) dx -= 1;
        if (keys.ArrowRight || keys.KeyD) dx += 1;
        if (keys.ArrowUp || keys.KeyW) dy -= 1;
        if (keys.ArrowDown || keys.KeyS) dy += 1;
      }
      const m = hypot(dx, dy);
      return m > 1 ? { x: dx / m, y: dy / m } : { x: dx, y: dy };
    }

    function puddleSlow(x, y) {
      if (!V.puddles) return 1;
      for (let i = 0; i < V.puddles.length; i++) {
        const P = V.puddles[i];
        const nx = (x - P.x) / P.rx, ny = (y - P.y) / P.ry;
        if (nx * nx + ny * ny <= 1) return 0.62;
      }
      return 1;
    }

    function scoreGoal(team) {
      if (team === 0) {
        scoreA++;
        if (ball.super) superGoals++;
        sfx("goal");
        showBanner(ball.super ? "📰 GOL DA PRIMA PAGINA!" : "⚽ RETE DELLE ACACIE!", "#86efac", 90);
      } else {
        scoreB++;
        sfx("whistle");
        showBanner(`Gol di ${oppName}`, "#fca5a5", 80);
      }
      goalFreeze = 48;
      syncHud();
      if (overtime && scoreA !== scoreB) {
        goalFreeze = 26;
      }
    }

    function stepOneFrame() {
      if (finished || phase !== "play") return;
      animFrame++;
      if (manualMove.t > 0) manualMove.t--;
      if (flashCd > 0) flashCd--;
      if (flashBurst > 0) flashBurst--;
      if (recentPassTimer > 0) recentPassTimer--;
      if (polaroid && polaroid.t > 0) { polaroid.t--; if (polaroid.t <= 0) polaroid = null; }
      if (banner.t > 0) banner.t--;

      if (goalFreeze > 0) {
        goalFreeze--;
        if (goalFreeze === 0) {
          if (overtime && scoreA !== scoreB) {
            conclude(scoreA > scoreB, false);
            return;
          }
          resetKickoff(scoreA >= scoreB ? 1 : 0);
        }
        syncHud();
        return;
      }

      // Orologio partita
      timeLeft -= 1 / 60;
      if (!overtime && !halfBannerShown && timeLeft <= totalSec / 2) {
        halfBannerShown = true;
        showBanner("🔔 SECONDO TEMPO · La rotativa scalda i rulli!", "#fde047", 75);
      }
      if (timeLeft <= 0) {
        if (scoreA !== scoreB) {
          conclude(scoreA > scoreB, false);
          return;
        }
        if (!overtime) {
          overtime = true;
          timeLeft = 12;
          sfx("whistle");
          showBanner("⚡ SUPPLEMENTARE GOLDEN GOAL! Chi segna vince!", "#fde047", 100);
          resetKickoff(0);
          syncHud();
          return;
        } else {
          // Spareggio finale senza stalli: spinta del pubblico di casa o verdetto degli scatti
          const homeEdge = perfectShots > 0 || ball.x >= W / 2 || diffKey !== "sfida";
          if (homeEdge) scoreA++; else scoreB++;
          conclude(scoreA > scoreB, false);
          return;
        }
      }

      // Movimento Clara Luce lungo la linea laterale superiore + Riquadro d'Obiettivo
      clara.phase += 0.028;
      const targetClaraX = clamp(ball.x * 0.72 + W * 0.16, FL + 34, FR - 34);
      clara.x += clamp((targetClaraX - clara.x) * 0.06, -1.45, 1.45);
      const targetVX = clamp(ball.x + Math.sin(clara.phase * 1.3) * 26 + (ball.owner && ball.owner.team === 0 ? 18 : -8), FL + 42, FR - 42);
      const targetVY = clamp(ball.y + Math.cos(clara.phase * 0.95) * 20, FT + 28, FB - 28);
      clara.viewX += (targetVX - clara.viewX) * 0.075;
      clara.viewY += (targetVY - clara.viewY) * 0.075;

      // Input giocatore attivo
      if (!ctrl || ctrl.role === "gk") ctrl = home[3];
      if (ball.owner && ball.owner.team === 0 && ball.owner.role !== "gk") ctrl = ball.owner;

      const inp = getInputVec();
      const baseHeroSpd = (2.15 + bon.te * 0.08 + (hasBuff("scatto_strilloni") ? 0.24 : 0)) * puddleSlow(ctrl.x, ctrl.y);
      if (ctrl.stun <= 0) {
        if (Math.abs(inp.x) > 0.05 || Math.abs(inp.y) > 0.05) {
          ctrl.vx = ctrl.vx * 0.55 + inp.x * baseHeroSpd * 0.68;
          ctrl.vy = ctrl.vy * 0.55 + inp.y * baseHeroSpd * 0.68;
          ctrl.dirX = inp.x;
          ctrl.dirY = inp.y;
        } else {
          ctrl.vx *= 0.74;
          ctrl.vy *= 0.74;
        }
      }

      // IA compagni di squadra e portiere di casa
      home.forEach((p) => {
        if (p.stun > 0) { p.stun--; p.vx *= 0.7; p.vy *= 0.7; return; }
        if (p.tackleCd > 0) p.tackleCd--;
        if (p === ctrl) return;
        if (p.role === "gk") {
          const gkSpan = hasBuff("muro_calce") ? 22 : 17;
          const gy = clamp(ball.y, (GY1 + GY2) / 2 - gkSpan, (GY1 + GY2) / 2 + gkSpan);
          p.vy = clamp((gy - p.y) * 0.22, -2.0, 2.0);
          p.vx = (FL + 9 - p.x) * 0.2;
          if (ball.owner === p) {
            // Rinvia subito a un compagno libero
            const mate = home[3];
            const ang = Math.atan2(mate.y - p.y, mate.x - p.x);
            ball.owner = null; ball.grabCd = 10;
            ball.vx = Math.cos(ang) * 4.8; ball.vy = Math.sin(ang) * 4.8;
            ctrl = mate;
          }
          return;
        }
        const att = ball.owner && ball.owner.team === 0;
        const tx = att ? clamp(ball.x + (p.role === "fw" ? 46 : -26), FL + 48, FR - 34) : clamp(ball.x * 0.55 + (p.hx * 0.45), FL + 40, W - 40);
        const ty = p.hy + Math.sin(animFrame * 0.03 + p.hx) * 14;
        const ang = Math.atan2(ty - p.y, tx - p.x);
        const d = hypot(tx - p.x, ty - p.y);
        const spd = (1.75 + (hasBuff("scatto_strilloni") ? 0.2 : 0)) * puddleSlow(p.x, p.y);
        if (d > 6) {
          p.vx = Math.cos(ang) * spd;
          p.vy = Math.sin(ang) * spd;
        } else {
          p.vx *= 0.7;
          p.vy *= 0.7;
        }
      });

      // IA avversari
      let chaser = away[3], bestD = 9999;
      away.slice(1).forEach((o) => {
        if (o.stun > 0) return;
        const d = hypot(o.x - ball.x, o.y - ball.y);
        if (d < bestD) { bestD = d; chaser = o; }
      });

      away.forEach((o) => {
        if (o.stun > 0) { o.stun--; o.vx *= 0.68; o.vy *= 0.68; return; }
        if (o.tackleCd > 0) o.tackleCd--;
        if (o.role === "gk") {
          const gkReact = (ball.super ? 0.08 : 0.17) * aiMul;
          const gy = clamp(ball.y, GY1 + 5, GY2 - 5);
          o.vy = clamp((gy - o.y) * gkReact, -1.95 * aiMul, 1.95 * aiMul);
          o.vx = (FR - 9 - o.x) * 0.2;
          if (ball.owner === o) {
            ball.owner = null; ball.grabCd = 12;
            ball.vx = -4.5; ball.vy = (Math.random() - 0.5) * 2.4;
          }
          return;
        }
        if (ball.owner === o) {
          const spd = 1.72 * aiMul * puddleSlow(o.x, o.y);
          const goalY = (GY1 + GY2) / 2 + Math.sin(animFrame * 0.05 + o.hy) * 14;
          const ang = Math.atan2(goalY - o.y, FL - o.x);
          o.vx = Math.cos(ang) * spd;
          o.vy = Math.sin(ang) * spd;
          if (o.x < FL + 96 || (Math.random() < 0.018 * aiMul && o.x < W / 2)) {
            ball.owner = null;
            ball.grabCd = 12;
            const sAng = Math.atan2(clamp(goalY, GY1 + 6, GY2 - 6) - o.y, FL - 4 - o.x);
            ball.vx = Math.cos(sAng) * (4.9 * aiMul);
            ball.vy = Math.sin(sAng) * (4.9 * aiMul);
            ball.super = false;
            sfx("kick");
          }
          return;
        }
        const tx = o === chaser ? ball.x : clamp(ball.x * 0.48 + o.hx * 0.52 + (oppStyle === "difensiva" ? 24 : 0), FL + 48, FR - 28);
        const ty = o === chaser ? ball.y : clamp(o.hy + (ball.y - (FT + FB) / 2) * 0.35, FT + 16, FB - 16);
        const d = hypot(tx - o.x, ty - o.y);
        const spd = (o === chaser ? 1.88 : 1.52) * aiMul * puddleSlow(o.x, o.y);
        if (d > 5) {
          const ang = Math.atan2(ty - o.y, tx - o.x);
          o.vx = Math.cos(ang) * spd;
          o.vy = Math.sin(ang) * spd;
        } else {
          o.vx *= 0.72;
          o.vy *= 0.72;
        }
      });

      // Aggiorna posizioni giocatori
      home.concat(away).forEach((p) => {
        p.x = clamp(p.x + p.vx, FL + 6, FR - 6);
        p.y = clamp(p.y + p.vy, FT + 8, FB - 8);
      });

      // Fisica del pallone
      if (ball.grabCd > 0) ball.grabCd--;
      if (ball.owner) {
        const p = ball.owner;
        if (p.stun > 0) {
          ball.owner = null;
          ball.grabCd = 10;
        } else {
          const ox = p.team === 0 ? 7 : -7;
          ball.x = clamp(p.x + ox, FL + 3, FR - 3);
          ball.y = clamp(p.y + p.vy * 1.4, FT + 4, FB - 4);
          ball.vx = p.vx;
          ball.vy = p.vy;
          // Contrasto automatico se un difensore non stordito arriva a contatto
          if (ball.grabCd <= 0) {
            const foes = p.team === 0 ? away : home;
            for (let i = 0; i < foes.length; i++) {
              const f = foes[i];
              if (f.stun > 0) continue;
              const stealR = f.role === "gk" ? 13 : (f.team === 0 ? 12 + bon.df : 10.5 * aiMul);
              if (hypot(f.x - ball.x, f.y - ball.y) < stealR) {
                if (f.team === 1 && Math.random() > 0.38 * aiMul) continue;
                p.stun = 16;
                ball.owner = f;
                ball.super = false;
                ball.grabCd = 14;
                if (f.team === 0 && f.role !== "gk") ctrl = f;
                sfx("tap");
                break;
              }
            }
          }
        }
      } else {
        ball.vy += ball.spin;
        ball.spin *= 0.985;
        const drag = puddleSlow(ball.x, ball.y) < 1 && !ball.super ? 0.90 : 0.978;
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vx *= drag;
        ball.vy *= drag;

        if (ball.super || hypot(ball.vx, ball.vy) > 4.6) {
          ball.trail.push({ x: ball.x, y: ball.y, super: ball.super, a: 1 });
          if (ball.trail.length > 10) ball.trail.shift();
        } else if (ball.trail.length) {
          ball.trail.shift();
        }

        // Balle di giornali agli angoli nel Cortile delle Edicole
        if (V.bales) {
          [[FL + 10, FT + 10], [FR - 10, FT + 10], [FL + 10, FB - 10], [FR - 10, FB - 10]].forEach(([bx, by]) => {
            const dx = ball.x - bx, dy = ball.y - by, d = hypot(dx, dy);
            if (d < 15 && d > 0.01) {
              const nx = dx / d, ny = dy / d;
              const sp = Math.max(3.4, hypot(ball.vx, ball.vy) * 1.08);
              ball.x = bx + nx * 15.5;
              ball.y = by + ny * 15.5;
              ball.vx = nx * sp;
              ball.vy = ny * sp;
              sfx("tap");
            }
          });
        }

        // Controllo rete!
        if (ball.x <= FL + 2 && ball.y >= GY1 && ball.y <= GY2) {
          scoreGoal(1);
          return;
        }
        if (ball.x >= FR - 2 && ball.y >= GY1 && ball.y <= GY2) {
          scoreGoal(0);
          return;
        }

        // Sponde laterali e di fondo
        if (ball.y < FT + 4) { ball.y = FT + 4; ball.vy = Math.abs(ball.vy) * 0.84; }
        if (ball.y > FB - 4) { ball.y = FB - 4; ball.vy = -Math.abs(ball.vy) * 0.84; }
        if (ball.x < FL + 4) { ball.x = FL + 4; ball.vx = Math.abs(ball.vx) * 0.8; }
        if (ball.x > FR - 4) { ball.x = FR - 4; ball.vx = -Math.abs(ball.vx) * 0.8; }

        // Raccolta pallone libero
        if (ball.grabCd <= 0) {
          const all = home.concat(away);
          for (let i = 0; i < all.length; i++) {
            const p = all[i];
            if (p.stun > 0) continue;
            const r = p.role === "gk" ? 13.5 : 11.5;
            if (hypot(p.x - ball.x, p.y - ball.y) <= r) {
              // Super-Tiro Edizione Straordinaria sfonda se il portiere non è centrato al millimetro
              if (ball.super && p.team === 1 && hypot(p.x - ball.x, p.y - ball.y) > 5.5) {
                p.stun = 34;
                continue;
              }
              ball.owner = p;
              ball.super = false;
              ball.spin = 0;
              ball.grabCd = 10;
              if (p.team === 0 && p.role !== "gk") ctrl = p;
              break;
            }
          }
        }
      }

      syncHud();
    }

    function drawPitch() {
      g.save();
      g.scale(2, 2);

      // Fascia superiore tribuna / edicole / strada 1968
      g.fillStyle = V.sky;
      g.fillRect(0, 0, W, FT);
      g.fillStyle = "#26211d";
      g.fillRect(0, FB, W, H - FB);

      if (V.crowd) {
        for (let i = 0; i < 28; i++) {
          const cx = 10 + i * 12.4;
          const bob = Math.sin(animFrame * 0.12 + i) * 1.3;
          g.fillStyle = i % 3 === 0 ? "#1f6f54" : i % 3 === 1 ? "#f5ebd6" : "#c83228";
          g.fillRect(cx, 5 + bob, 8, 9);
          g.fillStyle = "#fde68a";
          g.beginPath(); g.arc(cx + 4, 4 + bob, 2.4, 0, Math.PI * 2); g.fill();
        }
      } else {
        // Chioschi verdi delle edicole e insegne dipinte a mano
        [[28, 3], [278, 3]].forEach(([kx, ky]) => {
          g.fillStyle = "#164e3b";
          g.fillRect(kx, ky, 52, 22);
          g.fillStyle = "#1f6f54";
          g.fillRect(kx - 3, ky, 58, 5);
          g.fillStyle = "#f5ebd6";
          g.fillRect(kx + 5, ky + 7, 12, 13);
          g.fillRect(kx + 21, ky + 7, 12, 13);
          g.fillStyle = "#c83228";
          g.fillRect(kx + 37, ky + 7, 10, 6);
        });
      }

      // Cartelloni pubblicitari 1968 a bordo campo
      g.fillStyle = "#f5ebd6";
      g.fillRect(88, FT - 10, 84, 9);
      g.fillStyle = "#1f6f54";
      g.font = "900 5.6px 'Trebuchet MS',sans-serif";
      g.textAlign = "center";
      g.fillText(V.boardA, 130, FT - 3.5);

      g.fillStyle = "#c83228";
      g.fillRect(190, FT - 10, 82, 9);
      g.fillStyle = "#fffbeb";
      g.fillText(V.boardB, 231, FT - 3.5);

      // Manto del campo a fasce
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 === 0 ? V.turfA : V.turfB;
        const sx = FL + (i * (FR - FL)) / 8;
        g.fillRect(sx, FT, (FR - FL) / 8 + 0.6, FB - FT);
      }

      // Pozzanghere fangose alle Acacie
      if (V.puddles) {
        V.puddles.forEach((P) => {
          g.fillStyle = "rgba(58,42,28,0.68)";
          g.beginPath(); g.ellipse(P.x, P.y, P.rx + 3, P.ry + 2, 0, 0, Math.PI * 2); g.fill();
          g.fillStyle = "rgba(96,132,162,0.52)";
          g.beginPath(); g.ellipse(P.x - 2, P.y - 1, P.rx - 3, P.ry - 3, 0, 0, Math.PI * 2); g.fill();
        });
      }

      // Balle di giornali agli angoli nel Cortile delle Edicole
      if (V.bales) {
        [[FL + 10, FT + 10], [FR - 10, FT + 10], [FL + 10, FB - 10], [FR - 10, FB - 10]].forEach(([bx, by]) => {
          g.fillStyle = "#e7dcc4";
          g.fillRect(bx - 9, by - 7, 18, 14);
          g.strokeStyle = "#78350f";
          g.lineWidth = 1.2;
          g.strokeRect(bx - 9, by - 7, 18, 14);
          g.beginPath();
          g.moveTo(bx - 9, by); g.lineTo(bx + 9, by);
          g.moveTo(bx, by - 7); g.lineTo(bx, by + 7);
          g.stroke();
        });
      }

      // Linee di gesso
      g.strokeStyle = V.line;
      g.lineWidth = 1.4;
      g.strokeRect(FL, FT, FR - FL, FB - FT);
      g.beginPath();
      g.moveTo(W / 2, FT); g.lineTo(W / 2, FB);
      g.stroke();
      g.beginPath();
      g.arc(W / 2, (FT + FB) / 2, 24, 0, Math.PI * 2);
      g.stroke();
      g.strokeRect(FL, GY1 - 14, 34, GY2 - GY1 + 28);
      g.strokeRect(FR - 34, GY1 - 14, 34, GY2 - GY1 + 28);

      // Porte in legno verniciato di bianco
      g.fillStyle = "rgba(255,251,235,0.22)";
      g.fillRect(FL - 10, GY1, 10, GY2 - GY1);
      g.fillRect(FR, GY1, 10, GY2 - GY1);
      g.strokeStyle = "#fffbeb";
      g.lineWidth = 2;
      g.strokeRect(FL - 10, GY1, 10, GY2 - GY1);
      g.strokeRect(FR, GY1, 10, GY2 - GY1);

      // Coni caldi dei lampioni nel Portico Notturno
      if (V.lamps) {
        V.lamps.forEach((L) => {
          const gr = g.createRadialGradient(L.x, L.y, 4, L.x, L.y, L.r);
          gr.addColorStop(0, "rgba(253,224,71,0.26)");
          gr.addColorStop(1, "rgba(253,224,71,0)");
          g.fillStyle = gr;
          g.beginPath(); g.arc(L.x, L.y, L.r, 0, Math.PI * 2); g.fill();
        });
      }

      // Riquadro d'Obiettivo dorato di Clara Luce
      const vx0 = clara.viewX - clara.viewW / 2;
      const vy0 = clara.viewY - clara.viewH / 2;
      const hasTarget = insideViewfinder(ball.x, ball.y, 8);
      g.fillStyle = hasTarget ? "rgba(253,224,71,0.14)" : "rgba(245,235,214,0.06)";
      g.fillRect(vx0, vy0, clara.viewW, clara.viewH);

      // Angoli del mirino fotografico Rollei
      g.strokeStyle = hasTarget ? "#fde047" : "rgba(245,235,214,0.8)";
      g.lineWidth = hasTarget ? 2 : 1.3;
      const cl = 10;
      [
        [vx0, vy0 + cl, vx0, vy0, vx0 + cl, vy0],
        [vx0 + clara.viewW - cl, vy0, vx0 + clara.viewW, vy0, vx0 + clara.viewW, vy0 + cl],
        [vx0, vy0 + clara.viewH - cl, vx0, vy0 + clara.viewH, vx0 + cl, vy0 + clara.viewH],
        [vx0 + clara.viewW - cl, vy0 + clara.viewH, vx0 + clara.viewW, vy0 + clara.viewH, vx0 + clara.viewW, vy0 + clara.viewH - cl]
      ].forEach(([x1, y1, x2, y2, x3, y3]) => {
        g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.lineTo(x3, y3); g.stroke();
      });
      // Crocino centrale
      g.beginPath();
      g.moveTo(clara.viewX - 4, clara.viewY); g.lineTo(clara.viewX + 4, clara.viewY);
      g.moveTo(clara.viewX, clara.viewY - 4); g.lineTo(clara.viewX, clara.viewY + 4);
      g.stroke();

      // Clara Luce che corre a bordo campo con la Rollei al collo
      g.save();
      g.translate(clara.x, clara.y);
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.beginPath(); g.ellipse(0, 7, 6, 2.5, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#b45309"; // trench senape
      g.fillRect(-4.5, -2, 9, 8);
      g.fillStyle = "#f1c8a6";
      g.beginPath(); g.arc(0, -5, 4, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#451a03";
      g.fillRect(-4, -9, 8, 3.5);
      g.fillStyle = "#111827"; // fotocamera biottica
      g.fillRect(-2.5, 0, 5, 4.5);
      g.fillStyle = "#fde047";
      g.beginPath(); g.arc(0, 2, 1.3, 0, Math.PI * 2); g.fill();
      g.restore();

      // Cono del lampo al magnesio quando scatta il Flash
      if (flashBurst > 0) {
        const alpha = (flashBurst / 18) * 0.58;
        g.fillStyle = `rgba(255,251,235,${alpha})`;
        g.beginPath();
        g.moveTo(clara.x, clara.y + 2);
        g.lineTo(vx0 - 8, vy0 + clara.viewH);
        g.lineTo(vx0 + clara.viewW + 8, vy0 + clara.viewH);
        g.closePath();
        g.fill();
        g.fillStyle = `rgba(253,224,71,${alpha * 0.9})`;
        g.fillRect(vx0 - 4, vy0 - 4, clara.viewW + 8, clara.viewH + 8);
      }

      // Scia di fogli di giornale per il Super-Tiro Edizione Straordinaria
      ball.trail.forEach((tr, idx) => {
        const a = (idx + 1) / (ball.trail.length + 1);
        if (tr.super) {
          g.save();
          g.translate(tr.x, tr.y);
          g.rotate(idx * 0.6 + animFrame * 0.2);
          g.fillStyle = `rgba(245,235,214,${a * 0.85})`;
          g.fillRect(-4.5, -3.5, 9, 7);
          g.fillStyle = `rgba(200,50,40,${a * 0.85})`;
          g.fillRect(-3.5, -2.5, 7, 1.8);
          g.restore();
        } else {
          g.fillStyle = `rgba(253,224,71,${a * 0.35})`;
          g.beginPath(); g.arc(tr.x, tr.y, 3, 0, Math.PI * 2); g.fill();
        }
      });

      // Giocatori ordinati per profondità Y
      const sorted = home.concat(away).slice().sort((a, b) => a.y - b.y);
      sorted.forEach((p) => {
        g.save();
        g.translate(p.x, p.y);

        // Anello giallo sotto il giocatore controllato
        if (p === ctrl) {
          g.strokeStyle = "#fde047";
          g.lineWidth = 1.6;
          g.beginPath(); g.ellipse(0, 6, 8.5, 4, 0, 0, Math.PI * 2); g.stroke();
        }

        // Ombra a terra
        g.fillStyle = "rgba(0,0,0,0.34)";
        g.beginPath(); g.ellipse(0, 6, 6, 2.5, 0, 0, Math.PI * 2); g.fill();

        // Maglia storica anni '60 con colletto
        g.fillStyle = p.col;
        g.fillRect(-5, -3, 10, 8);
        g.fillStyle = p.team === 0 ? "#f5ebd6" : "#111827";
        g.fillRect(-2.5, -3, 5, 2); // scollo
        g.fillRect(-4.5, 4.5, 9, 2.5); // pantaloncini

        // Testa e capelli
        g.fillStyle = p.skin;
        g.beginPath(); g.arc(0, -6.5, 4.1, 0, Math.PI * 2); g.fill();
        g.fillStyle = p.hair;
        g.beginPath(); g.arc(0, -7.8, 4, Math.PI, Math.PI * 2); g.fill();

        // Ombrello nero anti-flash dei difensori di Stampa Moderna
        if (useUmbrellas && p.team === 1 && p.role !== "gk" && p.stun <= 0) {
          const openFront = recentPassTimer <= 0 && Math.abs(p.vy) < 1.35;
          g.strokeStyle = "#e5e7eb";
          g.lineWidth = 1;
          g.beginPath(); g.moveTo(4, -2); g.lineTo(5, -11); g.stroke();
          g.fillStyle = openFront ? "#0f172a" : "rgba(15,23,42,0.45)";
          g.beginPath();
          g.arc(4, -11, openFront ? 6.5 : 3.5, Math.PI, Math.PI * 2);
          g.fill();
        }

        // Stelline d'abbagliamento da Flash al magnesio
        if (p.stun > 0) {
          for (let s = 0; s < 3; s++) {
            const a = animFrame * 0.22 + (s * Math.PI * 2) / 3;
            g.fillStyle = "#fde047";
            g.beginPath();
            g.arc(Math.cos(a) * 7, -12 + Math.sin(a) * 2.5, 1.7, 0, Math.PI * 2);
            g.fill();
          }
        }
        g.restore();
      });

      // Etichetta non sovrapposta solo per il giocatore controllato e il portatore avversario
      g.font = "800 6px 'Trebuchet MS',sans-serif";
      g.textAlign = "center";
      if (ctrl) {
        g.fillStyle = "rgba(20,17,15,0.78)";
        const w = g.measureText(ctrl.name).width + 6;
        g.fillRect(ctrl.x - w / 2, ctrl.y + 8.5, w, 7.5);
        g.fillStyle = "#fde047";
        g.fillText(ctrl.name, ctrl.x, ctrl.y + 14);
      }

      // Pallone di cuoio 1968 a 18 pannelli
      g.save();
      g.translate(ball.x, ball.y);
      g.fillStyle = "rgba(0,0,0,0.34)";
      g.beginPath(); g.ellipse(0, 4.2, 4.2, 1.8, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = ball.super ? "#fde047" : "#f5ebd6";
      g.beginPath(); g.arc(0, 0, 4.2, 0, Math.PI * 2); g.fill();
      g.strokeStyle = ball.super ? "#c83228" : "#451a03";
      g.lineWidth = 1;
      g.stroke();
      g.beginPath();
      g.moveTo(-2.8, -1.2); g.lineTo(2.8, -1.2);
      g.moveTo(0, -4); g.lineTo(0, 4);
      g.stroke();
      g.restore();

      // Vignetta Polaroid seppia in alto a destra dopo uno Scatto Perfetto
      if (polaroid && polaroid.t > 0) {
        g.save();
        g.translate(W - 76, FT + 6);
        g.rotate(0.05);
        g.fillStyle = "#fffbeb";
        g.fillRect(0, 0, 66, 44);
        g.fillStyle = "#78350f";
        g.fillRect(4, 4, 58, 27);
        g.fillStyle = "#fde68a";
        g.beginPath(); g.arc(24, 17, 5, 0, Math.PI * 2); g.fill();
        g.fillStyle = "#f5ebd6";
        g.fillRect(34, 12, 7, 11);
        g.fillStyle = "#1c1917";
        g.font = "900 5.6px 'Trebuchet MS',sans-serif";
        g.textAlign = "center";
        g.fillText(polaroid.txt, 33, 39);
        g.restore();
      }

      // Striscione di cronaca in alto sul campo
      if (banner.t > 0 && banner.txt) {
        g.font = "800 6.8px 'Trebuchet MS',sans-serif";
        g.textAlign = "center";
        const bw = Math.min(W - 24, g.measureText(banner.txt).width + 14);
        g.fillStyle = "rgba(20,17,15,0.86)";
        g.fillRect(W / 2 - bw / 2, FB + 2, bw, 13);
        g.strokeStyle = banner.col;
        g.lineWidth = 1;
        g.strokeRect(W / 2 - bw / 2, FB + 2, bw, 13);
        g.fillStyle = banner.col;
        g.fillText(banner.txt, W / 2, FB + 10.8);
      }

      g.restore();
    }

    function showIntroModal() {
      const old = wrap.querySelector(".f68Ov");
      if (old) old.remove();
      const ov = document.createElement("div");
      ov.className = "f68Ov";
      const subVenue = useUmbrellas
        ? "Attenzione: i difensori di <b>Real Stampa Moderna</b> alzano <b>ombrelli neri anti-flash</b>! Smista prima palla di lato con <b>⚽ PASSA</b> per aggirarli e poi scatta!"
        : V.puddles
          ? "Sul prato delle Acacie ci sono pozzanghere di fango che frenano i rasoterra: usa i passaggi tesi e il mirino di Clara!"
          : V.lamps
            ? "Sotto i coni d'oro dei lampioni del portico il lampo al magnesio di Clara abbaglia ancora più lontano!"
            : "Agli angoli ci sono le balle di giornali legate con lo spago: usale di sponda per sorprendere la difesa!";
      ov.innerHTML = `
        <div class="f68Card">
          <h3>📸 ${opts.title || ("Flash & Contropiede '68 · " + V.name)}</h3>
          <p><b>Clara Luce</b> corre a bordo campo muovendo il <b>Riquadro d'Obiettivo dorato</b>.</p>
          <p>• Premi <b>📸 FLASH</b> (o tasto <b>X</b>) mentre il pallone o un duello sono nel riquadro: il lampo al magnesio <b>abbaglia i rivali</b> e carica la <b>Rotativa</b>.<br>
             • A <b>3 segmenti di Rotativa</b>, premi <b>🔥 TIRA</b> per scagliare il <b>Tiro Edizione Straordinaria</b>!<br>
             • ${subVenue}</p>
          <button type="button" class="cta" id="f68Go">Fischio d'inizio ▸</button>
        </div>
      `;
      wrap.appendChild(ov);
      ov.querySelector("#f68Go").onclick = () => startPlay();
    }

    function startPlay() {
      const ov = wrap.querySelector(".f68Ov");
      if (ov) ov.remove();
      if (phase === "intro") {
        phase = "play";
        sfx("whistle");
        showBanner("📸 Porta l'azione nel Riquadro d'Oro e premi FLASH!", "#fde047", 95);
      }
    }

    function cleanup() {
      finished = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      if (root.isConnected) root.remove();
      if (curState === stateApi) curState = null;
      if (C && C.endMatch) C.endMatch();
    }

    function conclude(win, quit, instant) {
      if (finished) return;
      phase = "done";
      const payload = {
        a: scoreA,
        b: scoreB,
        win: !!win && !quit,
        quit: !!quit,
        shots: perfectShots,
        perfectShots,
        superGoals,
        data: { shots: flashesUsed, perfectShots, superGoals, dazzled: dazzledTotal }
      };
      if (quit || instant || opts.instantEnd) {
        cleanup();
        onDone(payload);
        return;
      }
      const ov = document.createElement("div");
      ov.className = "f68Ov";
      const head = payload.win ? (opts.winTitle || "📰 EDIZIONE VITTORIOSA!") : "FISCHIO FINALE";
      ov.innerHTML = `
        <div class="f68Card">
          <h3>${head}</h3>
          <p style="font-size:16px;font-weight:900;text-align:center;margin:6px 0">${usName} ${scoreA} - ${scoreB} ${oppName}</p>
          <p style="text-align:center">📸 Scatti da Prima Pagina: <b>${perfectShots}</b> · 💥 Super-Gol: <b>${superGoals}</b></p>
          <button type="button" class="cta" id="f68EndBtn">Continua ▸</button>
        </div>
      `;
      wrap.appendChild(ov);
      ov.querySelector("#f68EndBtn").onclick = () => {
        cleanup();
        onDone(payload);
      };
    }

    // Controlli touch / mouse sul joystick morbido
    const joyEl = root.querySelector("#f68Joy");
    const knobEl = root.querySelector("#f68Knob");
    function updateJoy(clientX, clientY) {
      const r = joyEl.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const maxR = r.width * 0.36;
      let dx = clientX - cx, dy = clientY - cy;
      const d = hypot(dx, dy);
      if (d > maxR) { dx = (dx / d) * maxR; dy = (dy / d) * maxR; }
      joy.dx = dx / Math.max(1, maxR);
      joy.dy = dy / Math.max(1, maxR);
      knobEl.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    }
    function resetJoy() {
      joy.active = false; joy.id = null; joy.dx = 0; joy.dy = 0;
      knobEl.style.transform = "translate(0px,0px)";
    }
    joyEl.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      joy.active = true; joy.id = e.pointerId;
      try { joyEl.setPointerCapture(e.pointerId); } catch (err) {}
      updateJoy(e.clientX, e.clientY);
    });
    joyEl.addEventListener("pointermove", (e) => {
      if (joy.active && e.pointerId === joy.id) updateJoy(e.clientX, e.clientY);
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => joyEl.addEventListener(ev, resetJoy));

    root.querySelector("#f68Pass").onclick = (e) => { e.preventDefault(); actPass(); };
    root.querySelector("#f68Shoot").onclick = (e) => { e.preventDefault(); actShoot(); };
    root.querySelector("#f68Flash").onclick = (e) => { e.preventDefault(); actFlash(); };
    root.querySelector("#f68Exit").onclick = (e) => { e.preventDefault(); conclude(false, true, true); };

    function onKeyDown(e) {
      if (!root.isConnected || finished) return;
      if (phase === "intro" && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault(); startPlay(); return;
      }
      if (/^Arrow|^Key[WASD]$/.test(e.code)) {
        keys[e.code] = true;
        e.preventDefault();
      } else if (e.code === "KeyZ" || e.code === "Space") {
        e.preventDefault();
        if (!e.repeat) actShoot();
      } else if (e.code === "KeyC") {
        e.preventDefault();
        if (!e.repeat) actPass();
      } else if (e.code === "KeyX" || e.code === "KeyK") {
        e.preventDefault();
        if (!e.repeat) actFlash();
      }
    }
    function onKeyUp(e) {
      if (/^Arrow|^Key[WASD]$/.test(e.code)) keys[e.code] = false;
    }
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);

    function loop() {
      if (finished || !root.isConnected) return;
      stepOneFrame();
      drawPitch();
      raf = requestAnimationFrame(loop);
    }

    const stateApi = {
      get active() { return !finished && root.isConnected; },
      get phase() { return phase; },
      get scoreA() { return scoreA; },
      get scoreB() { return scoreB; },
      get score() { return [scoreA, scoreB]; },
      get timeLeft() { return timeLeft; },
      get overtime() { return overtime; },
      get rotativa() { return rotativa; },
      get perfectShots() { return perfectShots; },
      get dazzledTotal() { return dazzledTotal; },
      get flashCd() { return flashCd; },
      get ball() { return ball; },
      get hero() { return home[3]; },
      get ctrl() { return ctrl; },
      get home() { return home; },
      get away() { return away; },
      get clara() { return clara; },
      get useUmbrellas() { return useUmbrellas; },
      startPlay,
      pressMove(dx, dy, frames) {
        manualMove.dx = clamp(dx || 0, -1, 1);
        manualMove.dy = clamp(dy || 0, -1, 1);
        manualMove.t = frames || 12;
      },
      actPass,
      actShoot,
      actFlash,
      setRotativa(n) { rotativa = clamp(n | 0, 0, 3); syncHud(); },
      tick(n) {
        const steps = clamp(n || 1, 1, 9000);
        for (let i = 0; i < steps && !finished; i++) stepOneFrame();
        if (!finished) drawPitch();
      },
      finish(a, b, extra) {
        if (typeof a === "number") scoreA = a;
        if (typeof b === "number") scoreB = b;
        if (extra && typeof extra.perfectShots === "number") perfectShots = extra.perfectShots;
        conclude(scoreA > scoreB, !!(extra && extra.quit), true);
      }
    };

    curState = stateApi;
    resetKickoff(0);
    syncHud();
    drawPitch();
    if (phase === "intro") showIntroModal();
    raf = requestAnimationFrame(loop);
    return true;
  }

  window.__flash68 = {
    start,
    get state() { return curState; },
    finishTest(a, b, extra) {
      if (curState && curState.finish) {
        curState.finish(typeof a === "number" ? a : 3, typeof b === "number" ? b : 1, extra || {});
        return true;
      }
      return false;
    }
  };
})();
