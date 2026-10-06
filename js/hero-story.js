// ================= LA LEGGENDA DEL TUO CAMPIONE: SAGA ESCLUSIVA (v2) =================
// Saga narrativa + gameplay cucita sul Campione creato dal giocatore.
// - Cap.1 Provino al Molo: minigioco di mira a due tocchi (mirino X poi Y) su bersagli
// - Cap.2 Notte alla Trattoria: gestione della serata (3 ore su 5 attività) -> statistiche e intese
// - Cap.3 Derby della Scogliera: partita a fasi con energia, probabilità, tiri giocati e rigori
// - Cap.4 Lanterna d'Oro: preparazione + punizione decisiva con barriera e portiere che finta
// - Sfida del Molo: minigioco infinito con record, rigiocabile dopo il Cap.1
// Salvataggio: "ali-di-rondine.hero-story" (campi vecchi compatibili: chap, goals, partner, role, won).
(function () {
  "use strict";

  const K_SAVE = "ali-di-rondine.hero-story";
  const K_HERO = "ali-di-rondine.campione";
  const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const sfx = (k) => { try { if (window.sfx) window.sfx(k); } catch (e) {} };

  // ---------- salvataggio ----------
  function defaults() {
    return { chap: 1, goals: 0, partner: "leo", role: "fantasista", won: false, st: { tiro: 3, tec: 3, fis: 3, cuore: 3 }, bond: { leo: 0, nico: 0, sara: 0 }, paid: {}, gave: false, best: 0, grade: "", flags: {}, losses: { c3: 0, c4: 0 } };
  }
  function loadProgress() {
    const d0 = defaults();
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d.chap === "number") {
        const o = Object.assign(d0, d);
        o.st = Object.assign(defaults().st, d.st || {});
        o.bond = Object.assign(defaults().bond, d.bond || {});
        o.losses = Object.assign(defaults().losses, d.losses || {});
        o.flags = Object.assign({}, d.flags || {});
        if (!d.paid) o.paid = { c1: d.chap > 1, c2: d.chap > 2, c3: d.chap > 3, c4: !!d.won };
        if (d.gave === undefined) o.gave = !!d.won;
        return o;
      }
    } catch (e) {}
    return d0;
  }
  function saveProgress(p) { try { localStorage.setItem(K_SAVE, JSON.stringify(p)); } catch (e) {} }
  function pay(prog, key, n) {
    if (prog.paid[key]) return 0;
    prog.paid[key] = true;
    try { if (window.addCoins && n > 0) window.addCoins(n); } catch (e) {}
    return n;
  }

  // ---------- campione ----------
  function getHeroData() {
    try {
      if (typeof window.heroLoad === "function") return window.heroLoad();
      const raw = localStorage.getItem(K_HERO);
      if (raw) { const h = JSON.parse(raw); if (h && h.v === 1 && h.name) return h; }
    } catch (e) {}
    return null;
  }
  function ensureCast(h) {
    try {
      const api = window.__borgoApi;
      if (api && api.CAST && !api.CAST.hero && h) {
        api.CAST.hero = { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: "#2a1a0a", bg: [h.shirt, "#ffd23f"], shirt: h.shirt, num: String(h.num), acc: h.acc };
      }
    } catch (e) {}
  }
  const SHOT_MOD = {
    saetta: { gk: 0.88, spd: 1.08, r: 1 }, serpentina: { gk: 1, spd: 0.95, r: 1.1 }, parabola: { gk: 1, spd: 0.86, r: 1 },
    martello: { gk: 0.9, spd: 1.05, r: 1 }, traversa: { gk: 1, spd: 1, r: 1.15 }, muro: { gk: 1, spd: 0.95, r: 1.05 }, saudade: { gk: 0.95, spd: 0.92, r: 1.08 }
  };
  const shotMod = (h) => SHOT_MOD[h && h.shot] || { gk: 1, spd: 1, r: 1 };
  const PNAME = { leo: "Leo", nico: "Nico", sara: "Sara" };

  // mini creatore di riserva (se l'editor del gioco non è esposto)
  function miniCreator(existing, back) {
    const eng = getEngine();
    eng.chap("Crea il tuo Campione");
    const h0 = existing || {};
    const box = document.getElementById("text");
    if (box) {
      box.innerHTML = `<span class="t">Scegli nome, numero e il nome del tiro speciale. (Per cambiare capelli e maglia usa l'editor completo dal menu Modalità.)</span>
        <input class="field" id="hsxName" maxlength="14" aria-label="Nome" placeholder="Nome" value="${E(h0.name || "")}">
        <div style="display:flex;gap:8px"><input class="field" id="hsxNum" type="number" min="1" max="99" inputmode="numeric" aria-label="Numero" style="width:90px;flex:none" value="${E(h0.num || 9)}"><input class="field" id="hsxShot" maxlength="24" aria-label="Nome del tiro" placeholder="Nome del tiro" value="${E(h0.shotName || "")}"></div>`;
    }
    eng.buttons([
      {
        label: "Salva il campione", cls: "hot", sub: "Poi si parte con la saga",
        fn: () => {
          const name = ((document.getElementById("hsxName") || {}).value || "").trim() || "Campione";
          const num = clamp(parseInt((document.getElementById("hsxNum") || {}).value, 10) || 9, 1, 99);
          const shotName = ((document.getElementById("hsxShot") || {}).value || "").trim().toUpperCase() || ("SAETTA DI " + name.toUpperCase());
          const h = Object.assign({ v: 1, style: "spiky", hair: "#2b1d14", skin: "#f2c9a0", shirt: "#ff4d5a", acc: "none", shot: "saetta" }, h0, { v: 1, name, num, shotName });
          try { localStorage.setItem(K_HERO, JSON.stringify(h)); } catch (e) {}
          try { const api = window.__borgoApi; if (api && api.CAST) { delete api.CAST.hero; } } catch (e) {}
          back();
        }
      },
      { label: "◂ Indietro", sub: "Senza salvare", fn: () => { if (returnCallback) returnCallback(); } }
    ], true);
  }
  function openEditor(existing, back) {
    if (typeof window.heroEditor === "function") window.heroEditor(back);
    else miniCreator(existing, back);
  }

  let returnCallback = null;

  function getEngine() {
    return window.gameEngine || {
      chap: (t) => { const el = document.getElementById("chap"); if (el) el.textContent = t; },
      text: (who, html) => { const el = document.getElementById("text"); if (el) el.innerHTML = `<span class="who">${who}</span><span class="t">${html}</span>`; },
      buttons: (list, one) => {
        const c = document.getElementById("choices");
        if (!c) return;
        c.innerHTML = "";
        c.className = "choices" + (one ? " one" : "");
        list.forEach((o) => {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = o.label;
          if (o.cls) b.className = o.cls;
          if (o.disabled) b.disabled = true;
          if (o.sub) { const s = document.createElement("small"); s.textContent = o.sub; b.appendChild(s); }
          b.onclick = () => { c.innerHTML = ""; if (o.fn) o.fn(); };
          c.appendChild(b);
        });
      },
      play: (lines, then) => { if (typeof window.play === "function") window.play(lines, then); else then && then(); },
      L: (who, text, bg) => ({ who, text, bg: bg || "beach" })
    };
  }

  // ---------- stile minigioco ----------
  function injectStyle() {
    if (document.getElementById("hsxStyle")) return;
    const s = document.createElement("style");
    s.id = "hsxStyle";
    s.textContent = `
      .hsx-st{position:absolute;inset:0;background:linear-gradient(#0f2744,#1b5a39);color:#fff;font:600 13px system-ui,sans-serif;display:flex;flex-direction:column;padding:6px 8px 8px;box-sizing:border-box;user-select:none;-webkit-user-select:none}
      .hsx-hud{display:flex;justify-content:space-between;gap:6px;font-size:12px;color:#ffe08a;padding:0 2px 4px}
      .hsx-goal{position:relative;flex:1;min-height:0;border:3px solid #fff;border-bottom:none;border-radius:4px 4px 0 0;overflow:hidden;background:repeating-linear-gradient(0deg,rgba(255,255,255,.10) 0 1px,transparent 1px 12px),repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 1px,transparent 1px 12px),rgba(0,0,0,.28)}
      .hsx-tg{position:absolute;border-radius:50%;border:3px solid #ffd23f;background:radial-gradient(circle,rgba(255,210,63,.55) 0 28%,rgba(255,84,0,.35) 29% 60%,transparent 61%);transform:translate(-50%,-50%);aspect-ratio:1/1;pointer-events:none}
      .hsx-gk{position:absolute;bottom:0;width:15%;height:58%;transform:translateX(-50%);transition:left .35s ease-out;font-size:30px;text-align:center;line-height:1;background:linear-gradient(#ff7a45,#c1440e);border-radius:12px 12px 2px 2px;border:2px solid #fff;display:flex;align-items:flex-start;justify-content:center;padding-top:2px;box-sizing:border-box}
      .hsx-wall{position:absolute;left:30%;width:24%;top:48%;bottom:0;background:repeating-linear-gradient(90deg,#3a3f6b 0 22%,#6a6fa8 22% 25%);border:2px solid #cfd3ff;border-radius:6px 6px 0 0;opacity:.88;color:#fff;font-size:10px;text-align:center;letter-spacing:1px;padding-top:2px;box-sizing:border-box}
      .hsx-vx,.hsx-vy{position:absolute;background:rgba(255,255,255,.9);box-shadow:0 0 6px #fff;pointer-events:none}
      .hsx-vx{top:0;bottom:0;width:2px;transform:translateX(-1px)}
      .hsx-vy{left:0;right:0;height:2px;transform:translateY(-1px)}
      .hsx-ball{position:absolute;font-size:22px;transform:translate(-50%,-50%);transition:left .18s,top .18s;pointer-events:none}
      .hsx-msg{min-height:20px;text-align:center;font-size:14px;padding-top:5px;color:#fff;font-weight:800}
      .hsx-ok{color:#7dffa6}.hsx-ko{color:#ff8a8a}
    `;
    document.head.appendChild(s);
  }

  function openStage() {
    injectStyle();
    try { if (window.setView) window.setView({ kind: "alt", bg: "beach" }); } catch (e) {}
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = document.getElementById("stageAlt");
    if (alt) { alt.hidden = false; alt.innerHTML = ""; }
    return alt;
  }
  function closeStage() { try { if (window.closeAltStage) window.closeAltStage(); } catch (e) {} }

  // ---------- minigioco di mira ----------
  // cfg: {title, mode:'target'|'kick', shots, targets:[{x,y,r}], speed, rMul, wall, reach, fb (finta), tellSure, endless, lives, hint}
  // done({hits, n, res:[bool], lives})
  function aimGame(cfg, done, quit) {
    const alt = openStage();
    if (!alt) { done({ hits: 0, n: 0, res: [] }); return; }
    const eng = getEngine();
    alt.innerHTML = `<div class="hsx-st"><div class="hsx-hud"><span id="hsxT"></span><span id="hsxS"></span></div>
      <div class="hsx-goal" id="hsxG"><div class="hsx-wall" id="hsxW" hidden>BARRIERA</div><div class="hsx-gk" id="hsxGk" hidden>🧤</div><div class="hsx-tg" id="hsxTg" hidden></div>
      <div class="hsx-vx" id="hsxVx"></div><div class="hsx-vy" id="hsxVy" hidden></div><div class="hsx-ball" id="hsxB" hidden>⚽</div></div>
      <div class="hsx-msg" id="hsxM"></div></div>`;
    const $ = (i) => document.getElementById(i);
    const G = $("hsxG");
    let raf = 0, phase = "x", ts = performance.now(), lx = 50, n = 0, hits = 0, lives = cfg.lives || 0, res = [], over = false, tgt = null, gkTell = 50, locked = false;
    const speed0 = cfg.speed || 85;
    if (cfg.wall) $("hsxW").hidden = false;
    $("hsxT").textContent = cfg.title || "Mira";

    function hud() {
      const tot = cfg.endless ? "" : ` / ${cfg.shots}`;
      $("hsxS").textContent = cfg.endless ? `Vite ${"♥".repeat(Math.max(0, lives))} · Centri ${hits}` : `Tiro ${Math.min(n, cfg.shots)}${tot} · Gol ${hits}`;
    }
    function pos(now, sp) { const t = ((now - ts) / 1000) * sp; let p = ((t % 200) + 200) % 200; return p > 100 ? 200 - p : p; }
    function msg(t, cls) { const m = $("hsxM"); if (m) { m.textContent = t; m.className = "hsx-msg " + (cls || ""); } }
    function setBtns() {
      eng.buttons([
        { label: phase === "x" ? "🎯 FERMA LA LINEA VERTICALE" : "🎯 FERMA LA LINEA ORIZZONTALE", sub: phase === "x" ? "Scegli da che parte tirare" : "Scegli l'altezza: tocca al momento giusto!", cls: "hot", fn: lock },
        { label: "◂ Abbandona", fn: () => { stop(); if (quit) quit(); else done({ hits, n, res, quit: true }); } }
      ], false);
    }
    function stop() { over = true; if (raf) cancelAnimationFrame(raf); raf = 0; }

    function nextShot() {
      if (over) return;
      n++; phase = "x"; locked = false; ts = performance.now() + rnd(0, 2000);
      $("hsxVx").hidden = false; $("hsxVy").hidden = true; $("hsxB").hidden = true;
      const sp = $("hsxS"); if (sp) hud();
      if (cfg.mode === "target") {
        const t0 = cfg.targets && cfg.targets[(n - 1) % cfg.targets.length];
        const r = cfg.endless ? Math.max(6.5, 15 - hits * 0.55) : (t0 && t0.r) || 12;
        tgt = { x: t0 && !cfg.endless ? t0.x : rnd(16, 84), y: t0 && !cfg.endless ? t0.y : rnd(20, 78), r: r * (cfg.rMul || 1) };
        const el = $("hsxTg"); el.hidden = false; el.style.left = tgt.x + "%"; el.style.top = tgt.y + "%"; el.style.width = tgt.r * 2 + "%";
        msg(n === 1 && cfg.hint ? cfg.hint : "Colpisci il bersaglio", "");
      } else {
        const spots = [28, 50, 72]; gkTell = spots[Math.floor(Math.random() * 3)];
        const gk = $("hsxGk"); gk.hidden = false; gk.style.left = gkTell + "%";
        msg(n === 1 && cfg.hint ? cfg.hint : "Leggi il portiere: dove si sta spostando?", "");
      }
      setBtns();
      raf = requestAnimationFrame(tick);
    }
    function tick(now) {
      if (over || !$("hsxG")) { stop(); return; }
      const sp = speed0 * (cfg.endless ? 1 + Math.min(0.9, hits * 0.04) : 1);
      if (phase === "x") { const p = pos(now, sp); $("hsxVx").style.left = p + "%"; }
      else if (phase === "y") { const p = pos(now, sp * 0.92); $("hsxVy").style.top = p + "%"; }
      raf = requestAnimationFrame(tick);
    }
    function lock() {
      if (over || locked) return;
      const now = performance.now();
      const sp = speed0 * (cfg.endless ? 1 + Math.min(0.9, hits * 0.04) : 1);
      if (phase === "x") {
        lx = pos(now, sp); phase = "y"; ts = performance.now() + rnd(0, 1500);
        $("hsxVx").style.left = lx + "%"; $("hsxVy").hidden = false; sfx("kick");
        setBtns();
        return;
      }
      locked = true;
      const ly = pos(now, sp * 0.92);
      $("hsxVy").style.top = ly + "%";
      if (raf) cancelAnimationFrame(raf); raf = 0;
      const ball = $("hsxB"); ball.hidden = false; ball.style.left = lx + "%"; ball.style.top = ly + "%";
      eng.buttons([{ label: "…", disabled: true, fn: () => {} }], true);
      resolve(lx, ly);
    }
    function resolve(x, y) {
      const W = G.clientWidth || 300, H = G.clientHeight || 140;
      let ok = false, text = "", cls = "ko";
      if (cfg.mode === "target") {
        const d = Math.hypot(((x - tgt.x) / 100) * W, ((y - tgt.y) / 100) * H), r = (tgt.r / 100) * W;
        ok = d <= r;
        text = ok ? (d <= r * 0.35 ? "CENTRO PERFETTO!" : "Colpito!") : (d <= r * 1.5 ? "Per un soffio!" : "Fuori bersaglio");
      } else {
        const gk = $("hsxGk");
        let fin = gkTell;
        const feint = cfg.fb == null ? 0.25 : cfg.fb;
        if (Math.random() < feint) { const alt2 = [28, 50, 72].filter((v) => v !== gkTell); fin = alt2[Math.floor(Math.random() * alt2.length)]; }
        gk.style.left = fin + "%";
        const reach = (cfg.reach || 17) * (y < 36 ? 0.72 : 1);
        const inW = cfg.wall && x > 30 && x < 54 && y > 48;
        if (x < 4 || x > 96 || y < 4) { text = "Fuori!"; }
        else if (inW) { text = "Sulla barriera!"; }
        else if (x < 8 || x > 92 || y < 9) { text = "PALO!"; }
        else if (Math.abs(x - fin) < reach) { text = "Parato!"; }
        else { ok = true; text = "GOOOL!"; }
      }
      cls = ok ? "hsx-ok" : "hsx-ko";
      msg(text, cls); sfx(ok ? "goal" : "kick");
      res.push(ok);
      if (ok) hits++; else if (cfg.endless) lives--;
      hud();
      setTimeout(() => {
        if (over || !$("hsxG")) return;
        const fin = cfg.endless ? lives <= 0 : n >= cfg.shots;
        if (fin) { stop(); done({ hits, n, res, lives }); }
        else nextShot();
      }, 1050);
    }
    nextShot();
  }

  // ---------- menu ----------
  window.openHeroStoryMenu = function (onBack) {
    returnCallback = onBack;
    const hero = getHeroData();
    const eng = getEngine();
    closeStage();

    if (!hero || !hero.name) {
      eng.chap("La Storia del Tuo Campione");
      eng.text("voce", `<b>Il tuo viaggio a Borgo Marino ti aspetta!</b><br>Per iniziare questa saga devi dare un'identità al tuo campione: nome, numero di maglia e nome del tiro speciale.`);
      eng.buttons([
        { label: "✨ Crea il tuo Campione ▸", sub: "Scegli nome, numero e tiro", cls: "hot", fn: () => openEditor(null, () => window.openHeroStoryMenu(onBack)) },
        { label: "◂ Indietro", fn: () => { if (onBack) onBack(); else if (eng.title) eng.title(); } }
      ], true);
      return;
    }
    ensureCast(hero);
    const prog = loadProgress();
    const s = prog.st, b = prog.bond;
    eng.chap(`La Leggenda di ${hero.name}`);
    eng.text("hero", `<b>${E(hero.name)} · N. ${E(hero.num)}</b> · tiro <em>«${E(hero.shotName || "TIRO FULMINANTE")}»</em><br>
      Tiro <b>${s.tiro}</b> · Tecnica <b>${s.tec}</b> · Fisico <b>${s.fis}</b> · Cuore <b>${s.cuore}</b><br>
      <span style="color:var(--dim)">Intesa: Leo ${b.leo} · Nico ${b.nico} · Sara ${b.sara} · Gol ${prog.goals}</span>`);

    const chapters = [
      { id: 1, title: "Cap. 1 · Il Provino al Molo", sub: "Il treno, il campetto e la mira davanti al Mister" },
      { id: 2, title: "Cap. 2 · La Notte alla Trattoria", sub: `Una serata, tre ore, e la maglia N. ${hero.num}` },
      { id: 3, title: "Cap. 3 · Il Derby della Scogliera", sub: "Partita a fasi: energia, scelte e tiri veri" },
      { id: 4, title: "Cap. 4 · La Notte della Lanterna d'Oro", sub: "La grande finale sotto le stelle del Golfo" }
    ];
    const btns = chapters.map((ch) => {
      const isDone = prog.chap > ch.id, isCurrent = prog.chap === ch.id, isLocked = prog.chap < ch.id;
      return {
        label: `${isDone ? "✓ " : isCurrent ? "▶ " : "🔒 "}${ch.title}`,
        sub: isLocked ? "Completa i capitoli precedenti" : (isDone ? "Rigiocabile (nessuna ricompensa doppia)" : ch.sub),
        cls: isCurrent ? "hot" : "",
        disabled: isLocked,
        fn: () => startChapter(ch.id, hero, prog)
      };
    });
    if (prog.chap >= 2) {
      btns.push({ label: `🎯 Sfida del Molo · Record ${prog.best}`, sub: "Bersagli sempre più piccoli, tre errori e sei fuori", fn: () => moloChallenge(hero, prog) });
    }
    if (prog.won) {
      btns.push({ label: "🏆 Epilogo & Riconoscimenti", sub: "Rileggi l'articolo de L'Eco del Tirreno", cls: "hot", fn: () => showEpilogue(hero, prog) });
    }
    btns.push({ label: "🎨 Modifica il Campione", sub: "Look, nome o tiro", fn: () => openEditor(hero, () => window.openHeroStoryMenu(onBack)) });
    btns.push({ label: "◂ Torna al Menu", fn: () => { if (onBack) onBack(); else if (eng.title) eng.title(); } });
    eng.buttons(btns, true);
  };

  function backToMenu() { window.openHeroStoryMenu(returnCallback); }

  // ---------- Sfida del Molo ----------
  function moloChallenge(hero, prog) {
    const eng = getEngine();
    eng.chap("Sfida del Molo");
    const m = shotMod(hero);
    aimGame({ title: "Sfida del Molo", mode: "target", endless: true, lives: 3, speed: 80 * m.spd * (1 - prog.st.tec * 0.015), rMul: m.r * (1 + prog.st.tiro * 0.02), hint: "Ogni centro rimpicciolisce il bersaglio" }, (r) => {
      const p = loadProgress();
      const rec = r.hits > p.best;
      if (rec) { p.best = r.hits; saveProgress(p); }
      eng.chap("Sfida del Molo");
      eng.text("nico", `${r.hits} centri! ${rec ? `<b>NUOVO RECORD!</b> Nico prende nota sul muro con il carbone.` : `Il record è ${p.best}. «Ci vuole più sale sul pesce, campione!»`}`);
      eng.buttons([
        { label: "🎯 Ancora!", cls: "hot", fn: () => moloChallenge(hero, loadProgress()) },
        { label: "◂ Torna alla saga", fn: backToMenu }
      ], false);
    }, backToMenu);
  }

  // ---------- capitoli ----------
  function startChapter(chId, hero, prog) {
    const eng = getEngine();
    closeStage();
    ensureCast(hero);
    if (chId === 1) chap1(eng, hero);
    else if (chId === 2) chap2(eng, hero);
    else if (chId === 3) chap3(eng, hero);
    else if (chId === 4) chap4(eng, hero);
  }

  function advance(prog, from, toast, icon) {
    if (prog.chap <= from) prog.chap = from + 1;
    saveProgress(prog);
    if (window.toast) window.toast(toast, "success", icon || "⭐");
  }
  function shotLabel(hero, fb) { return E(hero.shotName || fb); }

  // ----- Cap.1 -----
  function chap1(eng, hero) {
    const L = eng.L, nm = hero.name;
    eng.chap("Cap. 1 · Il Provino al Molo");
    eng.play([
      L("voce", "Il vecchio treno regionale cigola sulla ferrovia litoranea e frena a Borgo Marino. Salsedine, pini marittimi e profumo di focaccia: il tuo stomaco vota già per restare.", "borgo"),
      L("hero", `(scendendo con la sacca sulla spalla) «Borgo Marino. Dicono che qui il calcio sia più di una religione. Vediamo se sono pronti a conoscere ${nm}.»`, "borgo"),
      L("voce", "Sul campetto del molo, tra i gozzi e la scogliera, un pallone batte contro il muro di mattoni rossi.", "beach"),
      L("leo", "«Palla sul destro, stop a seguire, piatto sotto l'incrocio! Dai Nico, questa era imparabile!»", "beach"),
      L("nico", "«Imparabile un corno! Avevo un granello di sabbia nel guanto. E poi guardavo se Tonino portava i gelati al pistacchio.»", "beach"),
      L("sara", "«Smettetela. C'è uno con gli scarpini ai piedi che ci osserva da dieci minuti, vicino alla cancellata.»", "beach"),
      L("ruggeri", `(appoggiato alla ringhiera) «Tu saresti ${nm}? Un amico mi ha telefonato: dice che hai un piede che canta. A me delle canzoni importa poco. Mi importa dove finisce il pallone.»`, "beach"),
      L("voce", "Il Mister sistema quattro bersagli di cartone ai lati della porta di Nico. Il portiere, offeso, li guarda come fossero parenti scomodi.", "beach")
    ], () => {
      eng.text("ruggeri", `«Quattro tiri, ${E(nm)}. Il mirino va fermato due volte: prima la linea verticale, poi quella orizzontale. Come prepari il primo tiro?»`);
      eng.buttons([
        { label: `⚡ ${hero.shotName || "Il tuo tiro"} di potenza`, sub: "Bersagli più piccoli, premio al Tiro", cls: "hot", fn: () => ch1Game(eng, hero, "pot") },
        { label: "🎯 Parabola morbida e precisa", sub: "Bersagli più larghi, premio alla Tecnica", fn: () => ch1Game(eng, hero, "pre") }
      ], true);
    });
  }
  function ch1Game(eng, hero, style) {
    const prog = loadProgress(), L = eng.L, nm = hero.name, m = shotMod(hero);
    const pot = style === "pot";
    const r0 = pot ? 0.8 : 1.15;
    aimGame({
      title: "Provino al Molo", mode: "target", shots: 4, speed: (pot ? 92 : 78) * m.spd * (1 - prog.st.tec * 0.012), rMul: r0 * m.r * (1 + prog.st.tiro * 0.015),
      targets: [{ x: 22, y: 30, r: 12 }, { x: 78, y: 32, r: 12 }, { x: 25, y: 72, r: 12 }, { x: 74, y: 70, r: 11 }],
      hint: "Ferma prima la linea verticale, poi quella orizzontale"
    }, (r) => {
      if (r.quit) return backToMenu();
      const p = loadProgress(), first = !p.paid.c1;
      let lines, bonus = "";
      if (r.hits >= 4) {
        if (first) { if (pot) p.st.tiro++; else p.st.tec++; p.bond.sara++; }
        bonus = first ? (pot ? "Tiro +1" : "Tecnica +1") : "";
        lines = [
          L("nico", "«Quattro su quattro?! Quei bersagli erano miei amici. Ho un attimo di lutto.»", "beach"),
          L("sara", `(sul tablet) «Percentuale di precisione: cento. Non vedevo numeri così dai tempi di Fede Lanza. ${nm}, mi sa che mi piaci.»`, "beach"),
          L("ruggeri", `«Hai la testa alta e il compasso nei piedi. Il provino è superato, ${nm}. Benvenuto nella Rondine FC.»`, "beach")
        ];
      } else if (r.hits >= 2) {
        lines = [
          L("leo", `«Niente male! ${r.hits} su 4 al primo giorno, io al primo giorno ho colpito un gabbiano.»`, "beach"),
          L("ruggeri", `(un sorriso sotto i baffi) «Discreto. Il resto lo impari al molo, non in treno. Sei dentro, ${nm}.»`, "beach")
        ];
      } else {
        if (first) p.st.cuore++;
        bonus = first ? "Cuore +1" : "";
        lines = [
          L("nico", "«Tranquillo, il cartone è duro. Lo dicevano anche del mio primo portiere... che era una sedia.»", "beach"),
          L("ruggeri", `«${nm}, ascoltami. Le prime volte tremano le gambe a tutti. Quello che conta è che oggi non sei andato via. Resti. Domani si ricomincia.»`, "beach"),
          L("hero", "(a bassa voce) «Resto. Non mi sono mai sentito così a casa dopo un provino sbagliato.»", "beach")
        ];
      }
      if (first && r.hits >= 3) p.goals += 1;
      const c = pay(p, "c1", 1);
      advance(p, 1, `Cap. 1 completato${bonus ? " · " + bonus : ""}${c ? " · +1 🪙" : ""}`);
      closeStage();
      eng.play(lines, backToMenu);
    }, backToMenu);
  }

  // ----- Cap.2 -----
  const ACTS = [
    { k: "tiri", label: "🥅 Tiri sulla porta del molo col Mister", sub: "Tiro +1" },
    { k: "pall", label: "⚽ Palleggi serali con Leo", sub: "Tecnica +1 · Intesa Leo +1" },
    { k: "corsa", label: "🏃 Corsa sul lungomare con Nico", sub: "Fisico +1 · Intesa Nico +1" },
    { k: "rita", label: "🍝 Aiuta Rita in cucina", sub: "Cuore +1 · una storia da ascoltare" },
    { k: "scout", label: "📋 Studia i Corsari con Sara", sub: "Intesa Sara +1 · scopri il loro punto debole" }
  ];
  function chap2(eng, hero) {
    const L = eng.L, nm = hero.name;
    eng.chap("Cap. 2 · La Notte alla Trattoria");
    eng.play([
      L("voce", "Quella sera, alla Trattoria Moretti, i tavoli sono imbanditi: focaccia con la salvia, trofie al pesto di mortaio, una caraffa di bianco che nessun atleta dovrebbe guardare.", "trattoria"),
      L("rita", `«Mangia, mangia ${nm}! Sul molo ti ho visto correre: gambe lunghe, ma ti manca un chilo di muscoli prima del derby!»`, "trattoria"),
      L("papa", "«Rita ha ragione. Ma prima... guarda cosa c'è sul bancone.»", "trattoria"),
      L("voce", `Papà Enzo scosta una tovaglia a quadri e rivela una scatola di cartone. Dentro c'è la maglia amaranto della Rondine FC, stirata di fresco. Sul retro: il tuo numero, il ${hero.num}.`, "trattoria"),
      L("hero", `«La maglia numero ${hero.num}... La porterò in campo con orgoglio, ve lo giuro.»`, "trattoria"),
      L("papa", "«Quella maglia ha una storia: l'ha indossata chi giocava col cuore in gola e la salsedine negli occhi. Domenica c'è il derby coi Corsari di Punta Nera. Duri, spietati e con un portiere che non sorride mai.»", "trattoria"),
      L("sara", `«Hai tre ore prima che la Trattoria chiuda, ${nm}. Il tempo non basta per fare tutto: scegli dove metterlo.»`, "trattoria")
    ], () => eveningLoop(eng, hero, 3, {}));
  }
  function eveningLoop(eng, hero, hours, used) {
    const nm = hero.name;
    if (hours <= 0) return eveningEnd(eng, hero);
    const p = loadProgress(), s = p.st;
    eng.text("sara", `Ore rimaste: <b>${hours}</b> su 3. <span style="color:var(--dim)">Tiro ${s.tiro} · Tecnica ${s.tec} · Fisico ${s.fis} · Cuore ${s.cuore}</span><br>Come usi la serata, ${E(nm)}?`);
    const list = ACTS.filter((a) => !used[a.k]).map((a) => ({
      label: a.label, sub: a.sub,
      fn: () => {
        used[a.k] = true;
        const q = loadProgress(), first = !q.paid.c2, st0 = JSON.stringify([q.st, q.bond, q.flags]);
        let lines = [];
        const L = eng.L;
        if (a.k === "tiri") { q.st.tiro++; lines = [L("ruggeri", `«Piede d'appoggio più vicino al pallone, ${nm}. Non è una danza, è una sentenza.»`, "beach"), L("voce", "Alla decima botta il portone del magazzino ha un'ammaccatura a forma di destino. Tonino, il gelataio, la chiamerà 'opera'.", "beach")]; }
        else if (a.k === "pall") { q.st.tec++; q.bond.leo++; lines = [L("leo", "«Cinquanta palleggi di fila senza far cadere la palla! Va bene, trentuno. Ma contiamo come cinquanta, il pallone non ha testimoni.»", "beach"), L("hero", "«Ne scommetto altri dieci a testa. Chi perde paga la focaccia.»", "beach")]; }
        else if (a.k === "corsa") { q.st.fis++; q.bond.nico++; lines = [L("nico", "«Un portiere deve correre solo quando arriva il gelato. Ma per te faccio un'eccezione.»", "borgo"), L("voce", "Il lungomare sotto i lampioni, il mare nero e due ragazzi senza fiato che ridono. Qualcuno, da una finestra, grida di fare silenzio. Non è un'accusa: è affetto.", "borgo")]; }
        else if (a.k === "rita") {
          q.st.cuore++;
          lines = [
            L("rita", "«Impasta con le mani, non con la fretta. Vedi? Non è che fai le trofie: ascolti le trofie.»", "trattoria"),
            L("papa", "(senza guardarti, pulendo una cozza) «Io giocavo, sai. Numero nove, come te. Poi un anno mi hanno chiesto di stare zitto davanti a una cosa ingiusta, e io ho smesso di giocare per non stare zitto.»", "trattoria"),
            L("papa", "«Non ho mai rimpianto la scelta. Ho rimpianto di non averla spiegata ai ragazzi. Se un giorno ti dicono di scegliere tra il nome e la maglia... scegli il nome.»", "trattoria"),
            L("hero", "(piano) «Me lo ricorderò, Enzo.»", "trattoria")
          ];
        } else if (a.k === "scout") {
          q.bond.sara++; q.flags.scout = true;
          lines = [
            L("sara", "«Dossier Corsari. Uno: calano di ritmo dopo il sessantesimo. Due: il portiere guarda sempre dove punta il tuo piede d'appoggio. Tre: sono molto suscettibili ai complimenti ironici.»", "trattoria"),
            L("hero", "«Il tre è un'arma?»", "trattoria"),
            L("sara", "«È il mio hobby.»", "trattoria")
          ];
        }
        if (!first) { const o = JSON.parse(st0); q.st = o[0]; q.bond = o[1]; q.flags = o[2]; }
        Object.keys(q.st).forEach((k) => { q.st[k] = Math.min(10, q.st[k]); });
        saveProgress(q);
        closeStage();
        eng.play(lines, () => eveningLoop(eng, hero, hours - 1, used));
      }
    }));
    eng.buttons(list, true);
  }
  function eveningEnd(eng, hero) {
    const L = eng.L;
    eng.text("sara", `La Trattoria è quasi vuota. Mancano solo i titoli di coda: con chi affinerai gli schemi per il derby?`);
    const pick = (who) => {
      const p = loadProgress();
      p.partner = who; if (!p.paid.c2) p.bond[who]++;
      const c = pay(p, "c2", 1);
      advance(p, 2, `Intesa con ${PNAME[who]} · Cap. 3 pronto${c ? " · +1 🪙" : ""}`, who === "leo" ? "🔥" : "🧤");
      eng.play(who === "leo" ? [
        L("leo", "«Ci scambiamo posizione senza dare riferimenti alla difesa. Quando scatto, tu la butti nello spazio e preghi.»", "trattoria"),
        L("hero", "«Affare fatto, Leo.»", "trattoria")
      ] : [
        L("nico", `«Io prendo la mira con le mani e te la spedisco oltre la metà campo. Tu fai cantare quel ${hero.shotName || "tiro"}.»`, "trattoria"),
        L("hero", "«Tu chiudi la porta, Nico. Davanti ci penso io.»", "trattoria")
      ], backToMenu);
    };
    eng.buttons([
      { label: "🤝 Con Leo Moretti: asse offensivo", sub: "Triangoli veloci, bonus ai passaggi", cls: "hot", fn: () => pick("leo") },
      { label: "🧤 Con Nico Ferri: baluardo e ripartenza", sub: "Difesa più solida, bonus nei contrasti", fn: () => pick("nico") }
    ], true);
  }

  // ----- Cap.3: derby a fasi -----
  const pct = (v) => Math.round(clamp(v, 0.1, 0.92) * 100);
  function chance(prog, stat, extra) {
    const v = stat === "bond" ? prog.bond[prog.partner] * 0.6 + prog.st.tec * 0.4 : prog.st[stat];
    return clamp(0.3 + v * 0.06 + (extra || 0), 0.1, 0.92);
  }
  function enBar(en) { const n = Math.round(clamp(en, 0, 100) / 20); return "▮".repeat(n) + "▯".repeat(5 - n); }

  function chap3(eng, hero) {
    const L = eng.L, nm = hero.name;
    eng.chap("Cap. 3 · Il Derby della Scogliera");
    const prog = loadProgress();
    eng.play([
      L("voce", "Domenica pomeriggio. Il campo di Punta Rondine è strapieno: bandiere, sciarpe, una signora con la pentola di minestrone per tenere caldo il tifo. Di fronte, i Corsari di Punta Nera in maglia nera e sguardo d'acciaio.", "stadium"),
      L("ruggeri", `«Ragazzi, in campo senza paura! ${nm}, fai vedere cosa significa il numero ${hero.num}!»`, "stadium"),
      L("voce", prog.flags.scout ? "Le note di Sara sono piegate nella tua calza. Un po' pungono. Un po' aiutano." : "Fischio d'inizio! Fango, tackle duri e un arbitro con la faccia da parente scontento.", "stadium")
    ], () => {
      const S = { me: 0, opp: 0, en: 100, mom: 0, hero: 0, i: 0, rage: Math.min(0.15, prog.losses.c3 * 0.05) };
      derbyPhase(eng, hero, S);
    });
  }
  const DERBY = [
    { min: 12, t: "atk", txt: "12': pressing alto dei Corsari, ma uno spazio si apre sulla fascia. Hai palla." },
    { min: 30, t: "def", txt: "30': Punta Nera riparte in contropiede. Due maglie nere contro la tua linea." },
    { min: 55, t: "atk", txt: "55': il fango ha mangiato il campo. Cross rasoterra che ti arriva sui piedi." },
    { min: 70, t: "def", txt: "70': palla lunga dei Corsari. Il loro centravanti è lanciato verso Nico." },
    { min: 85, t: "fin", txt: "85': l'ultimo assalto. Rinvio lungo, palla sui tuoi piedi a venticinque metri. Due difensori." }
  ];
  function derbyHud(S, hero) { return `<span style="color:var(--dim)">Rondine ${S.me}–${S.opp} Corsari · Energia ${enBar(S.en)} (${Math.max(0, Math.round(S.en))})</span>`; }
  function derbyPhase(eng, hero, S) {
    const prog = loadProgress(), ph = DERBY[S.i], L = eng.L, nm = E(hero.name), pn = PNAME[prog.partner];
    if (!ph) return derbyEnd(eng, hero, S);
    let kind = ph.t;
    let phTxt = ph.txt;
    if (kind === "fin" && S.me > S.opp) { kind = "def"; phTxt = "85': i Corsari buttano tutto in avanti per pareggiare. Palla alta in area, il tuo compito è respingere."; }
    const rest = { label: "🫁 Gestisci il ritmo e respira", sub: "Recuperi 25 di energia, nessun rischio, nessun guadagno", fn: () => { S.en = Math.min(100, S.en + 25); S.mom = 0; derbyNarr(eng, hero, S, [L("voce", "Rallenti. Conti i respiri. Il pubblico borbotta, ma il fiato ringrazia.", "stadium")]); } };
    const mk = (label, sub, stat, cost, extra, ok, ko) => {
      const ch = chance(prog, stat, extra + S.mom * 0.1 + S.rage + (S.en < cost ? -0.2 : 0));
      return { label, sub: `${sub} · successo ~${pct(ch)}% · costa ${cost}⚡`, fn: () => {
        const wasLow = S.en < cost; S.en -= cost; S.mom = 0;
        const good = Math.random() < ch;
        (good ? ok : ko)(wasLow);
      } };
    };
    let list = [];
    if (kind === "atk") {
      eng.text("voce", `${E(phTxt)}<br>${derbyHud(S, hero)}`);
      list = [
        mk("💨 Dribbling sulla fascia", "Tecnica", "tec", 25, 0, () => derbyShot(eng, hero, S, {}), () => derbyNarr(eng, hero, S, [L("voce", "Il terzino ti legge e ti chiude lo spazio: palla persa. I tifosi avversari fanno un coro sul tuo cognome. È ortografico, almeno.", "stadium")])),
        mk(`🤝 Triangolo con ${pn}`, "Intesa", "bond", 15, 0.08, () => derbyShot(eng, hero, S, { reach: -2 }), () => derbyNarr(eng, hero, S, [L(prog.partner, "«Scusa, pensavo guardassi me! Io guardavo la tribuna: c'è mio zio!»", "stadium")])),
        { label: "💥 Tiro dalla distanza", sub: "Niente prove: ti giochi tutto con la mira · costa 20⚡", fn: () => { S.en -= 20; S.mom = 0; derbyShot(eng, hero, S, { reach: 4, direct: true }); } },
        rest
      ];
    } else if (kind === "def") {
      eng.text("voce", `${E(phTxt)}<br>${derbyHud(S, hero)}`);
      const failFn = (txt) => () => derbyOppShot(eng, hero, S, txt);
      list = [
        mk("🦵 Scivolata in tackle", "Fisico", "fis", 25, 0, () => derbyRecover(eng, hero, S, "Scivolata pulita: palla e fango, ma solo la palla viene via con te."), failFn("La scivolata arriva tardi. Il pallone passa dove tu non sei.")),
        mk(`🧱 Raddoppio con ${pn}`, "Intesa", "bond", 15, prog.partner === "nico" ? 0.12 : 0, () => derbyRecover(eng, hero, S, `${pn} chiude il passaggio, tu rubi il tempo. Coppia da manuale.`), failFn("Vi pestate i piedi a vicenda: il centravanti vi supera senza nemmeno guardarvi.")),
        mk("🗣️ Guida la linea con la voce", "Cuore", "cuore", 10, 0.04, () => derbyRecover(eng, hero, S, "Urli, la linea sale, l'attaccante finisce in fuorigioco. Il guardalinee ti guarda con rispetto."), failFn("La linea non ti sente: il vento si porta via la voce e la traccia di rispetto.")),
        rest
      ];
    } else {
      eng.text("hero", `${E(ph.txt)}<br>Tutto si decide qui.<br>${derbyHud(S, hero)}`);
      list = [
        { label: `💥 ${hero.shotName || "Tiro del Campione"} dai 25 metri`, sub: "Tiro vero, portiere in anticipo · costa 25⚡", cls: "hot", fn: () => { S.en -= 25; derbyShot(eng, hero, S, { reach: 3, direct: true, final: true }); } },
        mk(`👟 Assist filtrante per ${prog.partner === "leo" ? "Leo" : "Leo (che scatta)"}`, "Intesa e tecnica", "bond", 20, 0.1, () => { S.me++; S.hero += 0; sfx("goal"); derbyNarr(eng, hero, S, [L("voce", "Con la coda dell'occhio vedi lo scatto di Leo. Esterno, palla sopra la difesa, Leo al volo: non perdona. GOL!", "stadium"), L("leo", `(abbracciandoti) «Assist perfetto, ${hero.name}! Ma il pallone ce l'ho messo io, tecnicamente.»`, "stadium")]); }, () => derbyNarr(eng, hero, S, [L("voce", "Il filtrante è troppo lungo: il portiere esce, la palla lo sfiora, il guardalinee alza la bandierina.", "stadium")])),
        rest
      ];
    }
    eng.buttons(list, true);
  }
  function derbyNarr(eng, hero, S, lines) {
    S.i++;
    eng.play(lines, () => derbyPhase(eng, hero, S));
  }
  function derbyRecover(eng, hero, S, txt) {
    S.mom = 1;
    derbyNarr(eng, hero, S, [eng.L("voce", txt + " Palla recuperata: la prossima azione parte con slancio.", "stadium")]);
  }
  function derbyOppShot(eng, hero, S, txt) {
    const prog = loadProgress(), L = eng.L;
    let p = 0.6 - (prog.partner === "nico" ? 0.18 : 0) - (prog.flags.scout ? 0.08 : 0) - prog.st.fis * 0.015;
    if (Math.random() < p) {
      S.opp++;
      derbyNarr(eng, hero, S, [L("voce", `${txt} Il tiro dei Corsari buca Nico: ${S.me}–${S.opp}. Il loro tifo sembra un'orchestra di pentole.`, "stadium"), L("nico", "«Ho visto il pallone! È che il pallone non ha visto me!»", "stadium")]);
    } else {
      derbyNarr(eng, hero, S, [L("voce", `${txt} Ma Nico è lì: parata con la mano di richiamo, e l'attaccante si ritrova a baciare il palo opposto.`, "stadium"), L("nico", "«Il Gatto Volante non ha paura di nessuno!»", "stadium")]);
    }
  }
  function derbyShot(eng, hero, S, o) {
    const prog = loadProgress(), m = shotMod(hero);
    closeStage();
    aimGame({
      title: o.final ? "Derby · L'ultimo tiro" : "Derby · Tiro in porta", mode: "kick", shots: 1,
      speed: 90 * m.spd * (1 - prog.st.tec * 0.012) * (S.en < 25 ? 1.15 : 1),
      reach: Math.max(9, (18 - prog.st.tiro * 0.7 + (o.reach || 0)) * m.gk), fb: prog.flags.scout ? 0.12 : 0.25,
      hint: prog.flags.scout ? "Sara: il portiere guarda dove punti. Fidati della sua posizione." : "Il portiere si sposta: tira lontano da lui"
    }, (r) => {
      if (r.quit) return backToMenu();
      const L = eng.L, ok = r.res[0];
      closeStage();
      if (ok) {
        S.me++; S.hero++;
        S.i++;
        eng.play([L("voce", `GOOOL! ${S.me}–${S.opp}. ${o.final ? "La tribuna del Borgo esplode in un boato liberatorio!" : "Il pallone gonfia la rete e un gabbiano, per rispetto, si sposta."}`, "stadium")], () => derbyPhase(eng, hero, S));
      } else {
        S.i++;
        eng.play([L("voce", "Il portiere dei Corsari ci arriva, o la mira non ha tenuto. Applausi di cortesia: li senti benissimo, quelli di cortesia.", "stadium")], () => derbyPhase(eng, hero, S));
      }
    }, backToMenu);
  }
  function derbyEnd(eng, hero, S) {
    const L = eng.L, nm = hero.name;
    closeStage();
    if (S.me > S.opp) return derbyWin(eng, hero, S, false);
    if (S.me < S.opp) return derbyLose(eng, hero, S);
    eng.play([L("voce", `Fischio finale: ${S.me}–${S.opp}. Il derby non accetta pareggi: si va ai rigori!`, "stadium"), L("ruggeri", `«${nm}, tu tiri per primo. Se segni due su tre, il Borgo dorme tranquillo. Se ne segni uno, il Borgo dorme comunque, ma male.»`, "stadium")], () => {
      const prog = loadProgress(), m = shotMod(hero);
      aimGame({ title: "Derby · Rigori", mode: "kick", shots: 3, speed: 86 * m.spd * (1 - prog.st.tec * 0.012), reach: Math.max(9, (17 - prog.st.tiro * 0.6 - prog.st.cuore * 0.3) * m.gk), fb: 0.2, hint: "Servono due gol su tre" }, (r) => {
        if (r.quit) return backToMenu();
        closeStage();
        if (r.hits >= 2) derbyWin(eng, hero, S, true); else derbyLose(eng, hero, S, true);
      }, backToMenu);
    });
  }
  function derbyWin(eng, hero, S, pens) {
    const L = eng.L, nm = hero.name, p = loadProgress();
    p.goals += S.hero;
    const c = pay(p, "c3", 2);
    advance(p, 3, `Derby vinto! Cap. 4 sbloccato${c ? " · +2 🪙" : ""}`);
    p.losses.c3 = 0; saveProgress(p);
    sfx("goal");
    try { if (window.triggerGoalCelebration) window.triggerGoalCelebration(S.hero > 0); } catch (e) {}
    const s = pens ? "Rigori freddissimi, il Borgo canta fino a notte." : `${S.me}–${S.opp} al triplice fischio.`;
    eng.play([
      L("voce", `${s} La Rondine FC vince il derby della Scogliera! ${S.hero ? nm + " ha segnato " + S.hero + (S.hero > 1 ? " gol" : " gol") + "." : "Vittoria di squadra."}`, "stadium"),
      L("ruggeri", "«Questo è vero calcio. Ora dritti verso la finale della Lanterna d'Oro.»", "stadium")
    ], backToMenu);
  }
  function derbyLose(eng, hero, S, pens) {
    const L = eng.L, nm = hero.name, p = loadProgress();
    p.losses.c3++; saveProgress(p);
    eng.play([
      L("voce", pens ? "Il pallone decisivo si ferma sulle mani del portiere nero. Il silenzio ha un suono strano: sembra una pentola di minestrone che si raffredda." : `Fischio finale: ${S.me}–${S.opp}. I Corsari festeggiano a bordo campo.`, "stadium"),
      L("ruggeri", `«${nm}, guardami. Si perde. Poi si impara. Il derby non scappa: ci rimettiamo i parastinchi e ricominciamo.»`, "stadium")
    ], () => {
      eng.text("ruggeri", "Il Mister ti concede una rivincita lunedì. La rabbia sana, dice, vale un po' di fiato in più.");
      eng.buttons([{ label: "🔁 Rigioca il derby", sub: "Bonus rabbia: +5% a ogni sconfitta (max 15%)", cls: "hot", fn: () => chap3(eng, hero) }, { label: "◂ Torna alla saga", fn: backToMenu }], true);
    });
  }

  // ----- Cap.4: finale -----
  function chap4(eng, hero) {
    const L = eng.L, nm = hero.name, prog = loadProgress();
    eng.chap("Cap. 4 · La Notte della Lanterna d'Oro");
    const pn = PNAME[prog.partner];
    eng.play([
      L("voce", "La notte della finale. I fari illuminano il rettangolo verde che sembra brillare contro il mare scuro. In palio c'è la Lanterna d'Oro, il trofeo più antico della costa.", "night"),
      L("voce", "Contro la corazzata genovese è una battaglia: minuto 93, 2–2. Punizione dal limite per la Rondine FC. Una barriera di cinque uomini e un portiere con le mani a ventaglio.", "night"),
      L("leo", `(porgendoti il pallone con entrambe le mani) «Prendila tu, ${nm}. Ti sei guadagnato questo momento dal primo giorno al molo.»`, "night"),
      L("hero", "(sottovoce) «Grazie Leo. La mettiamo dove nessuno può prenderla.»", "night"),
      L("voce", "Hai trenta secondi prima del fischio. Cosa fai con quel poco di silenzio?", "night")
    ], () => {
      eng.text("hero", "Scegli come prepararti: ogni scelta ti dà un vantaggio diverso alla battuta.");
      const opts = [
        { label: "✉️ Rileggi la lettera di Papà Enzo", sub: "Cuore +2 solo per questa battuta · mirino più lento", fn: () => ch4Prep(eng, hero, "cuore") },
        { label: "📋 Ascolta i dati di Sara", sub: `Il portiere finta meno: leggi la sua posizione${prog.bond.sara >= 2 ? " (Sara ti ha già studiato bene)" : ""}`, fn: () => ch4Prep(eng, hero, "sara") },
        { label: `🙌 Chiedi a ${pn} di restare pronto sulla ribattuta`, sub: "Se il portiere respinge, c'è una seconda chance", fn: () => ch4Prep(eng, hero, "rib") }
      ];
      eng.buttons(opts, true);
    });
  }
  function ch4Prep(eng, hero, k) {
    const L = eng.L, nm = hero.name, prog = loadProgress(), pn = PNAME[prog.partner];
    let l = [];
    if (k === "cuore") l = [L("voce", "Nella tasca del pantaloncino c'è un foglio piegato in quattro: la grafia di Enzo, storta come il suo sorriso. «Non tirare per vincere. Tira perché hai imparato a tirare.» Respiri. Le mani smettono di tremare.", "night"), L("hero", "(piano) «Va bene, Papà. Ci siamo.»", "night")];
    else if (k === "sara") l = [L("sara", "(dalla panchina, gridando) «Si butta a sinistra se guardi destra! Trentatré per cento di finta, io ci metto la firma!»", "night"), L("hero", "«Non firmare niente, Sara, guardalo e basta.»", "night")];
    else l = [L(prog.partner, `«Io sto qui, sul dischetto dell'area piccola. Se la ribatte, ci penso io. Se non la ribatte, io ho comunque fatto la figura del poeta.»`, "night"), L("hero", `«Contiamo su di te, ${pn}.»`, "night")];
    eng.play(l, () => ch4Kick(eng, hero, k));
  }
  function ch4Kick(eng, hero, k) {
    const p = loadProgress(), m = shotMod(hero), L = eng.L, nm = hero.name;
    const cuore = p.st.cuore + (k === "cuore" ? 2 : 0);
    const assist = p.losses.c4 >= 2;
    const slow = (k === "cuore" ? 0.82 : 1) * (1 - p.losses.c4 * 0.04);
    const fb = k === "sara" ? 0.08 : (p.bond.sara >= 2 ? 0.15 : 0.25);
    aimGame({
      title: "Finale · Punizione", mode: "kick", shots: 1, wall: true,
      speed: 95 * m.spd * (1 - p.st.tec * 0.012) * slow,
      reach: Math.max(8, (19 - p.st.tiro * 0.7 - cuore * 0.25) * m.gk - (assist ? 4 : 0)), fb,
      hint: "La barriera copre la parte bassa a sinistra: scavalcala o gira alla destra"
    }, (r) => {
      if (r.quit) return backToMenu();
      closeStage();
      const ok = r.res[0];
      if (ok) return ch4Win(eng, hero, "gloria");
      const q = loadProgress();
      const chR = 0.12 + q.bond[q.partner] * 0.1 + (k === "rib" ? 0.3 : 0) + q.st.fis * 0.02;
      if (Math.random() < chR) {
        eng.play([L("voce", `Il portiere respinge! Il pallone danza sul dischetto... e ${PNAME[q.partner]}, che si era piazzato lì, la calcia in rete di punta, con un'espressione tra il sorpreso e il vincitore.`, "night")], () => ch4Win(eng, hero, "squadra"));
      } else {
        q.losses.c4++; saveProgress(q);
        eng.play([
          L("voce", "Il pallone muore sulla barriera, o sul guantone, o sul palo, comunque non in rete. Fischio finale poco dopo: ai supplementari la corazzata genovese passa. Il Borgo trattiene il fiato, poi applaude lo stesso.", "night"),
          L("ruggeri", `«${nm}. Non c'è niente da dire e tanto da fare. Ci ripresentiamo alla Lanterna l'anno prossimo, cioè domani sera, che è la finale rigiocata per i social.»`, "night")
        ], () => {
          eng.text("ruggeri", q.losses.c4 >= 2 ? "Il Mister ti prepara una versione 'tiro assistito': portiere un po' meno bravo, ma stessa notte di emozioni." : "Il Mister ti concede un'altra notte. Sarà un po' più lenta nelle mani, ma non nei sogni.");
          eng.buttons([{ label: "🔁 Rigioca la finale", sub: "Ogni sconfitta rende il mirino un po' più docile", cls: "hot", fn: () => chap4(eng, hero) }, { label: "◂ Torna alla saga", fn: backToMenu }], true);
        });
      }
    }, backToMenu);
  }
  function ch4Win(eng, hero, grade) {
    const L = eng.L, nm = hero.name, p = loadProgress();
    try {
      if (window.triggerTrophyCelebration) window.triggerTrophyCelebration();
      else if (window.triggerGoalCelebration) window.triggerGoalCelebration(true);
      sfx("goal");
    } catch (e) {}
    const first = !p.won;
    p.won = true; p.chap = Math.max(p.chap, 5); p.goals += grade === "gloria" ? 1 : 0;
    if (!p.grade || grade === "gloria") p.grade = grade;
    let coins = pay(p, "c4", 4);
    if (grade === "gloria") coins += pay(p, "c4g", 2);
    if (!p.gave) {
      p.gave = true;
      try {
        let gdata = JSON.parse(localStorage.getItem("ali-di-rondine.gacha-toys") || "null");
        if (!gdata || !gdata.owned) gdata = { owned: { ragazzino_molo: 1 }, shards: 15, pullCount: 1, pity: 1, upgraded: {}, goldenTicket: false };
        gdata.owned.hero_custom_gold = gdata.owned.hero_custom_gold || 1;
        localStorage.setItem("ali-di-rondine.gacha-toys", JSON.stringify(gdata));
      } catch (e) {}
    }
    p.losses.c4 = 0;
    saveProgress(p);
    eng.play([
      L("voce", grade === "gloria" ? "Parte la rincorsa. Un impatto purissimo: il pallone scavalca la barriera, scheggia l'interno del palo ed entra! GOOOOOOL!" : "La rete si gonfia. Non è il gol che avevi immaginato, ma è quello che la squadra meritava: GOOOOL!", "stadium"),
      L("voce", "IL FISCHIO FINALE! LA RONDINE FC È CAMPIONE DELLA LANTERNA D'ORO!", "stadium"),
      L("hero", "(le braccia al cielo mentre la squadra ti sommerge) «ABBIAMO VINTO! LA COPPA È NOSTRA!»", "stadium"),
      L("papa", "(con gli occhi lucidi e la sciarpa alzata) «Campione... il tuo nome sarà inciso per sempre sulla Lanterna.»", "stadium")
    ], () => showEpilogue(hero, loadProgress(), coins));
  }

  // ---------- epilogo ----------
  function showEpilogue(hero, prog, newCoins) {
    const eng = getEngine(), L = eng.L, nm = hero.name;
    closeStage();
    eng.chap("Epilogo · Gloria Eterna al Borgo");
    eng.play([
      L("voce", `La mattina dopo, l'Edicola della Signora Pina espone la prima pagina de L'Eco del Tirreno: «LA RONDINE VOLA IN ALTO! ${E(nm).toUpperCase()} N.${hero.num} INCANTA IL GOLFO!»`, "borgo"),
      L("pina", "«Tutti vogliono il giornale di oggi! Ne ho nascosta una copia sotto la cassa. Non dite niente a nessuno, specie al giornalista.»", "borgo"),
      L("rita", `«Da oggi nel menu ci sono le "Trofie alla ${nm}": doppio basilico e pinoli tostati, per i campioni e per chi paga il conto.»`, "trattoria"),
      L("ruggeri", `«Hai onorato quella maglia come pochi, ${nm}. E ricordati: la coppa è il premio, il Borgo è la ragione.»`, "beach")
    ], () => {
      const s = prog.st, gr = prog.grade === "gloria" ? "gol diretto dalla punizione (finale perfetta)" : "gol di squadra sulla ribattuta";
      eng.text("hero", `<b>🏆 SAGA COMPLETATA!</b><br>
        ${E(nm)} (N. ${E(hero.num)}) guida la Rondine FC alla Lanterna d'Oro: ${gr}.<br>
        Statistiche: Tiro <b>${s.tiro}</b> · Tecnica <b>${s.tec}</b> · Fisico <b>${s.fis}</b> · Cuore <b>${s.cuore}</b><br>
        Gol: <b>${prog.goals}</b> · Record Sfida del Molo: <b>${prog.best}</b><br>
        Statuina 6★ <b>«${E(nm)} d'Oro»</b> nella Vetrinetta dei Giocattoli.${newCoins ? `<br>Ricompensa: <b>🪙 +${newCoins} monete</b>` : ""}`);
      eng.buttons([
        { label: "🎯 Sfida del Molo", sub: "Batti il tuo record", cls: "hot", fn: () => moloChallenge(hero, loadProgress()) },
        { label: "🎰 Al Gashapon 3D", sub: "Spendi le monete", fn: () => { if (window.openGachaModal) window.openGachaModal(); else backToMenu(); } },
        { label: "⭐ Rivivi i capitoli", fn: backToMenu },
        { label: "◂ Torna al Menu", fn: () => { if (returnCallback) returnCallback(); else if (eng.title) eng.title(); } }
      ], false);
    });
  }

  // hook di debug
  try { if (/[?&]debug/.test(location.search)) window.__hero = { loadProgress, saveProgress, aimGame, chap1, chap2, chap3, chap4, derbyPhase, ch4Win, showEpilogue }; } catch (e) {}
})();
