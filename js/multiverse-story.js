// ================= LA FENDITURA QUANTISTICA DELLA PANDA 30 (v2) =================
// Saga demenziale e multiversale (parodia di Rick & Morty, Futurama e Game of Thrones).
// Il Tunnel Iperspaziale carica la Panda ("Panissa") e la carica aiuta nelle 3 dimensioni;
// ogni dimensione ha un gameplay diverso (mira coi portali, EMP a corsie, tiro a vento con crepa)
// e, vinte tutte e 3, si apre la Fenditura Finale con due scelte.
(function () {
  const K_MULTI = "ali-di-rondine.multiverse-progress";

  function getProgress() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K_MULTI)); } catch (e) {}
    d = d && typeof d === "object" ? d : {};
    return {
      portals: Array.isArray(d.portals) ? d.portals : [],
      won: d.won || 0,
      highScoreFlight: d.highScoreFlight || 0,
      rickScore: d.rickScore || 0,
      benderScore: d.benderScore || 0,
      gotScore: d.gotScore || 0,
      panissa: Math.max(0, Math.min(3, d.panissa || 0)),
      finale: typeof d.finale === "string" ? d.finale : "",
      finaleDone: !!d.finaleDone
    };
  }
  function saveProgress(p) {
    try { localStorage.setItem(K_MULTI, JSON.stringify(p)); } catch (e) {}
  }

  let onExitCallback = null;
  let loopToken = 0;
  let activeAnimId = null;
  let inputCleanup = [];

  const $ = (id) => document.getElementById(id);
  function getStageAlt() { return $("stageAlt"); }
  function setChap(t) { const el = $("chap"); if (el) el.textContent = t; }

  function injectStyle() {
    if ($("mvStyle")) return;
    const st = document.createElement("style");
    st.id = "mvStyle";
    st.textContent = `
      .mv-cv { display:block; width:100%; height:100%; touch-action:none; }
      .mv-hud { position:absolute; top:4px; left:6px; right:6px; z-index:10; display:flex; justify-content:space-between; align-items:center; gap:6px; background:rgba(18,6,36,.86); border:1px solid #ba68c8; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; }
      .mv-tip { position:absolute; left:6px; right:6px; bottom:4px; z-index:10; background:rgba(18,6,36,.78); border-radius:6px; padding:3px 8px; font-size:10.5px; color:#e1bee7; text-align:center; pointer-events:none; animation:mvFade 6s forwards; }
      @keyframes mvFade { 0%,70% { opacity:1; } 100% { opacity:0; visibility:hidden; } }
    `;
    document.head.appendChild(st);
  }

  function showText(who, html, log) {
    const el = $("text");
    if (el) el.innerHTML = `<span class="who" style="background:#8e24aa; color:#fff; font-weight:bold;">${who}</span><span class="t">${html}</span>`;
    if (log !== false && window.addDialogueLog) { try { window.addDialogueLog(who, html); } catch (e) {} }
  }

  function showButtons(list, one) {
    const c = $("choices");
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
      b.onclick = () => {
        if (window.haptic) { try { window.haptic(15); } catch (e) {} }
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  let ownCtx = null;
  function playSynth(freq, type, dur, vol) {
    try {
      if (!window.audioCtx && !ownCtx && (window.AudioContext || window.webkitAudioContext)) ownCtx = new (window.AudioContext || window.webkitAudioContext)();
      const actx = window.audioCtx || ownCtx;
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol || 0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.12));
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + (dur || 0.12));
    } catch (e) {}
  }

  function toast(msg, kind, ico) { if (window.toast) { try { window.toast(msg, kind || "info", ico || "✨"); } catch (e) {} } }

  function clearLoops() {
    loopToken++;
    if (activeAnimId) { cancelAnimationFrame(activeAnimId); activeAnimId = null; }
    inputCleanup.forEach((f) => { try { f(); } catch (e) {} });
    inputCleanup = [];
  }

  // Loop con dt normalizzato a 60fps (stesso gioco a 60 o 120 Hz)
  function startLoop(fn) {
    const token = ++loopToken;
    let last = performance.now();
    const f = (now) => {
      if (token !== loopToken) return;
      const dt = Math.min(3, (now - last) / 16.667);
      last = now;
      fn(dt);
      if (token === loopToken) activeAnimId = requestAnimationFrame(f);
    };
    activeAnimId = requestAnimationFrame(f);
  }

  function onKeys(handler) {
    window.addEventListener("keydown", handler);
    inputCleanup.push(() => window.removeEventListener("keydown", handler));
  }

  function canvasPoint(cv, e) {
    const r = cv.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 320, y: ((e.clientY - r.top) / r.height) * 200 };
  }

  function activateMultiView(displayMode) {
    clearLoops();
    injectStyle();
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "multiverse" });
    const cv = $("cv");
    if (cv) cv.hidden = true;
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = displayMode || "block";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
    }
    return alt;
  }

  function closeMultiStage() {
    clearLoops();
    const alt = getStageAlt();
    if (alt) { alt.hidden = true; alt.style.display = "none"; alt.innerHTML = ""; }
    const cv = $("cv");
    if (cv) cv.hidden = false;
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "scene", bg: "title" });
  }

  function exitToMenu() {
    closeMultiStage();
    if (onExitCallback) onExitCallback();
  }

  // Ricompense piccole: prima vittoria di una dimensione 5, repliche 1. Il finale 5 una volta sola. Totale saga ~20.
  function coins(n) { if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); } catch (e) {} } }
  function winDimension(key, scoreField, score) {
    const prog = getProgress();
    const first = !prog.portals.includes(key);
    if (first) prog.portals.push(key);
    prog[scoreField] = Math.max(prog[scoreField] || 0, score);
    prog.won++;
    saveProgress(prog);
    const n = first ? 5 : 1;
    coins(n);
    return { first, n, all: prog.portals.length >= 3 };
  }

  // La carica di Panissa del Tunnel si consuma entrando in una dimensione
  function takePanissa() {
    const prog = getProgress();
    const n = prog.panissa;
    if (n) { prog.panissa = 0; saveProgress(prog); }
    return n;
  }

  // ================= HUB =================
  function openMultiverseMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    setChap("Multiverso · La Panda Quantistica");
    const prog = getProgress();
    const alt = activateMultiView("flex");
    const tick = (k) => (prog.portals.includes(k) ? "✓ " : "");
    if (alt) {
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <img src="img/multiverse_panda.jpg" alt="Panda Quantistica" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.25) brightness(0.9);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,5,40,0.25) 0%, rgba(14,4,30,0.92) 85%);"></div>
        <div style="position:relative; z-index:2; padding:10px 12px; display:flex; justify-content:space-between; align-items:flex-end; gap:8px;">
          <div>
            <div style="font-family:var(--display); font-size:15px; color:#e1bee7; text-shadow:0 0 10px rgba(225,190,231,0.8);">LA PANDA 30 QUANTISTICA</div>
            <div style="font-size:11px; color:#f3e5f5;">Warp Iperspaziale · Fritto Subatomico</div>
          </div>
          <div style="background:rgba(225,190,231,0.18); border:1.5px solid #ba68c8; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; text-align:right; white-space:nowrap;">
            <div>Dimensioni: <b>${prog.portals.length}/3</b></div>
            <div style="color:var(--gold); font-size:10px;">Panissa: <b>${"🥘".repeat(prog.panissa) || "vuoto"}</b> · Record ${prog.highScoreFlight}</div>
          </div>
        </div>`;
    }

    const allDone = prog.portals.length >= 3;
    showText(
      "Nonna Ferri",
      prog.portals.length === 0
        ? `«Leo, chiudi lo sportello con decisione, che sennò prende aria! Ho fritto quaranta chili di panissa con l'olio della trattoria e la Panda ha aperto uno squarcio a 88 miglia orarie! Dal parabrezza vedo teste giganti, robot alcolizzati e una bufera su un castello di focaccia. Facciamo rifornimento nel tunnel, poi scegli dove atterrare!»`
        : allDone && !prog.finaleDone
          ? `«Leo… le tre dimensioni sono a posto. Ma la fenditura non si è chiusa, e c'è una cosa che devo dirti. Vieni, siediti. Stavolta niente panissa.»`
          : `«Bravo Leo! ${prog.portals.length}/3 dimensioni sistemate. La carica di panissa del tunnel ti aiuta dentro le dimensioni: riempi il serbatoio prima di partire!»`,
      prog.portals.length === 0
    );

    const list = [
      { label: "🚀 Tunnel Iperspaziale", sub: `Arcade · carica la Panissa (${prog.panissa}/3)`, cls: prog.panissa ? "" : "hot", fn: startHyperspaceFlight },
      { label: `${tick("rick")}🧪 C-137 · Cromulon`, sub: "Mira e usa i portali", cls: "hot", fn: startRickDimension },
      { label: `${tick("bender")}🤖 3000 · Bender`, sub: "EMP, corsie e tempismo", cls: "hot", fn: startBenderDimension },
      { label: `${tick("got")}⚔️ Westeros · Barriera`, sub: "Vento, potenza e crepa", cls: "hot", fn: startThronesDimension }
    ];
    if (allDone && !prog.finaleDone) list.push({ label: "🌀 La Fenditura", sub: "Nonna deve dirti una cosa", cls: "hot", fn: startFinale });
    list.push({ label: "📖 Teoria di Nonna", sub: "Il fritto che piega lo spazio", fn: showTheory });
    list.push({ label: "◂ Torna al Menu", cls: "pick", fn: exitToMenu });
    showButtons(list);
  }

  function showTheory() {
    showText(
      "Nonna Ferri",
      `«Einstein conosceva la fisica, ma non sapeva mantecare il pesto! Quando l'olio tocca i 192 gradi e incontra la farina di ceci, nascono i <i>Frittoni Subatomici</i> con spin invertito. La Panda 30 dell'82 non ha centralina: vibra alla frequenza dell'universo e fora il tessuto della realtà. Semplice, no?»<br><small style="opacity:.8">Trucco: ogni giro nel Tunnel riempie fino a 3 cariche di Panissa. Dentro le dimensioni danno +tiri, +tempo o +potenza.</small>`
    );
    showButtons([
      { label: "Nel Tunnel ▸", cls: "hot", fn: startHyperspaceFlight },
      { label: "◂ Cruscotto", fn: showHub }
    ]);
  }

  // ================= 1. TUNNEL IPERSPAZIALE =================
  function startHyperspaceFlight() {
    setChap("Tunnel Iperspaziale · Volo Tachionico");
    const alt = activateMultiView("block");
    if (!alt) return;
    alt.innerHTML = `
      <canvas id="warpCanvas" class="mv-cv" width="320" height="200" style="background:#0a0416;"></canvas>
      <div class="mv-hud"><span style="color:#e1bee7; font-weight:bold;">🚗 PANDA 30</span><span id="warpFuel" style="color:var(--gold);"></span><span id="warpScore" style="color:#00e5ff;"></span></div>
      <div class="mv-tip">Tocca il lato sinistro/destro dello schermo o usa i tasti. Raccogli ⚡, evita i sassi, tuffati nei 🌀.</div>`;
    const canvas = $("warpCanvas");
    const ctx = canvas.getContext("2d");

    const GOAL = 600;
    let pandaX = 160, targetX = 160;
    const pandaY = 160;
    let fuel = 100, dist = 0, bonus = 0, oils = 0, hits = 0;
    let items = [], spawn = 0, acc = 0;
    let isOver = false;
    const stars = [];
    for (let i = 0; i < 45; i++) stars.push({ x: Math.random() * 320, y: Math.random() * 200, z: Math.random() * 2 + 1, c: i % 3 === 0 ? "#ba68c8" : i % 3 === 1 ? "#00e5ff" : "#ffd23f" });

    function steer(delta) {
      if (isOver) return;
      targetX = Math.max(26, Math.min(294, targetX + delta));
      playSynth(440, "sine", 0.05, 0.08);
    }
    function turbo() {
      if (isOver || fuel <= 12) return;
      fuel -= 10;
      dist += 20;
      playSynth(680, "sawtooth", 0.2, 0.2);
      toast("⚡ Turbo Panissa! Meno olio, più strada", "info", "🚀");
    }
    onKeys((e) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") steer(-40);
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") steer(40);
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") { e.preventDefault(); turbo(); }
    });
    canvas.addEventListener("pointerdown", (e) => {
      const pt = canvasPoint(canvas, e);
      targetX = Math.max(26, Math.min(294, pt.x));
    });

    showText("Nonna", `«Arriva fino in fondo al tunnel (${GOAL} km). Il serbatoio d'olio scende da solo: raccogli le <b>⚡ fiasche</b>, evita i sassi e tuffati nei <b>🌀 varchi</b> per un salto di 100 km. Più olio avanza, più <b>Panissa</b> porti nelle dimensioni!»`, false);
    showButtons([
      { label: "◂ Sinistra", fn: () => steer(-45) },
      { label: "Destra ▸", fn: () => steer(45) },
      { label: "⚡ Turbo", sub: "−10 olio, +20 km", cls: "hot", fn: turbo },
      { label: "🛑 Rientra", fn: showHub }
    ]);

    function finish(success) {
      isOver = true;
      clearLoops();
      const prog = getProgress();
      const score = Math.round(dist + bonus + fuel);
      if (score > prog.highScoreFlight) prog.highScoreFlight = score;
      let charges = 0;
      if (success) charges = fuel >= 60 ? 3 : fuel >= 30 ? 2 : 1;
      if (charges > prog.panissa) prog.panissa = charges;
      saveProgress(prog);
      if (success) {
        toast("✨ Squarcio agganciato!", "success", "🌀");
        playSynth(523.2, "sine", 0.3, 0.25);
        showText("Nonna Ferri", `<b style="color:var(--gold);">SALTO RIUSCITO! ${score} PT</b><br>Olio rimasto ${Math.round(fuel)}% → <b>${charges}</b> ${charges === 1 ? "carica" : "cariche"} di Panissa. «Adesso scegli dove atterrare!»`);
        showButtons([
          { label: "🧪 C-137", sub: "Cromulon", cls: "hot", fn: startRickDimension },
          { label: "🤖 3000", sub: "Bender", cls: "hot", fn: startBenderDimension },
          { label: "⚔️ Westeros", sub: "Barriera", cls: "hot", fn: startThronesDimension },
          { label: "🔄 Ancora", sub: "Migliora il record", fn: startHyperspaceFlight },
          { label: "◂ Cruscotto", fn: showHub }
        ]);
      } else {
        showText("Nonna Ferri", `<b style="color:#ff4d5a;">OLIO ESAURITO a ${Math.round(dist)} km!</b><br>«Mannaggia alla frittura! Troppi sassi cosmici (${hits} impatti). Ricarico la caffettiera e riproviamo.»`);
        showButtons([
          { label: "Riprova ▸", cls: "hot", fn: startHyperspaceFlight },
          { label: "◂ Cruscotto", fn: showHub }
        ]);
      }
    }

    function step() {
      const sp = 3 + Math.min(2.2, dist / 260);
      dist += sp * 0.28;
      fuel -= 0.045;
      pandaX += (targetX - pandaX) * 0.2;
      spawn -= sp;
      if (spawn <= 0) {
        spawn = 62 - Math.min(24, dist / 30);
        const r = Math.random();
        const type = r < 0.38 ? "oil" : r < 0.88 ? "rock" : "portal";
        items.push({ x: 30 + Math.random() * 260, y: -12, type, r: type === "oil" ? 9 : type === "rock" ? 11 : 14 });
        if (type === "rock" && Math.random() < 0.35) items.push({ x: Math.min(300, Math.max(20, pandaX + (Math.random() - 0.5) * 40)), y: -40, type: "rock", r: 11 });
      }
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += sp;
        if (Math.hypot(it.x - pandaX, it.y - pandaY) < it.r + 13) {
          if (it.type === "oil") { fuel = Math.min(100, fuel + 20); bonus += 15; oils++; playSynth(880, "sine", 0.15, 0.2); }
          else if (it.type === "rock") { fuel -= 20; hits++; playSynth(150, "sawtooth", 0.25, 0.28); toast("BOOM! Meteorite (−20 olio)", "error", "💥"); }
          else { dist += 100; bonus += 40; playSynth(990, "triangle", 0.3, 0.25); toast("🌀 Varco! +100 km", "success", "🌀"); }
          items.splice(i, 1);
          continue;
        }
        if (it.y > 215) items.splice(i, 1);
      }
    }

    startLoop((dt) => {
      acc += dt;
      while (acc >= 1 && !isOver) { step(); acc -= 1; }
      if (isOver) return;
      ctx.fillStyle = "#0c051a"; ctx.fillRect(0, 0, 320, 200);
      stars.forEach((s) => { s.y += 3 * s.z * 0.9 * dt; if (s.y > 200) { s.y = 0; s.x = Math.random() * 320; } ctx.fillStyle = s.c; ctx.fillRect(s.x, s.y, s.z, s.z * 2.2); });
      items.forEach((it) => {
        ctx.beginPath(); ctx.arc(it.x, it.y, it.r, 0, 7);
        if (it.type === "oil") { ctx.fillStyle = "#ffd23f"; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = "#000"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"; ctx.fillText("⚡", it.x, it.y + 4); }
        else if (it.type === "rock") { ctx.fillStyle = "#5c4033"; ctx.fill(); ctx.strokeStyle = "#a1887f"; ctx.lineWidth = 1; ctx.stroke(); }
        else { ctx.fillStyle = "rgba(0,229,255,.35)"; ctx.fill(); ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 2.5; ctx.stroke(); ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("🌀", it.x, it.y + 4); }
      });
      ctx.save(); ctx.translate(pandaX, pandaY);
      ctx.fillStyle = "#d32f2f"; ctx.fillRect(-16, -10, 32, 20);
      ctx.fillStyle = "#1a237e"; ctx.fillRect(-12, -8, 24, 9);
      ctx.fillStyle = "#fff"; ctx.fillRect(-7, 4, 14, 5);
      ctx.fillStyle = "#ffeb3b"; ctx.fillRect(-14, 2, 5, 4); ctx.fillRect(9, 2, 5, 4);
      ctx.restore();
      // barra distanza
      ctx.fillStyle = "rgba(255,255,255,.15)"; ctx.fillRect(20, 190, 280, 4);
      ctx.fillStyle = "#76ff03"; ctx.fillRect(20, 190, 280 * Math.min(1, dist / GOAL), 4);
      const ef = $("warpFuel"), es = $("warpScore");
      if (ef) ef.innerHTML = `Olio <b style="color:${fuel < 30 ? "#ff5252" : "var(--gold)"}">${Math.max(0, Math.round(fuel))}%</b>`;
      if (es) es.innerHTML = `Km <b>${Math.min(GOAL, Math.round(dist))}/${GOAL}</b>`;
      if (fuel <= 0) return finish(false);
      if (dist >= GOAL) return finish(true);
    });
  }

  // ================= 2. C-137: CALCIO DEI PORTALI =================
  function startRickDimension() {
    setChap("Dimensione C-137 · Torneo dei Cromulon");
    const alt = activateMultiView("block");
    if (!alt) return;
    const bonusShots = takePanissa();
    const GOALS = 3;
    let shotsLeft = 6 + bonusShots;
    alt.innerHTML = `
      <canvas id="rickCanvas" class="mv-cv" width="320" height="200" style="background:#10002b;"></canvas>
      <div class="mv-hud" style="border-color:#76ff03;"><span style="color:#76ff03; font-weight:bold;">🧪 CROMULON</span><span id="rickScoreEl" style="color:var(--gold);"></span><span id="rickShotsEl" style="color:#00e5ff;"></span></div>
      <div class="mv-tip">Trascina/tocca il campo: l'angolo e la distanza dal pallone decidono mira e potenza</div>`;
    const canvas = $("rickCanvas");
    const ctx = canvas.getContext("2d");

    const START = { x: 50, y: 155 };
    let goals = 0;
    let aim = { x: 170, y: 90 };
    let ball = { x: START.x, y: START.y, vx: 0, vy: 0, flying: false };
    let gk = { y: 90, vy: 1.6, h: 34 };
    let p1, p2;
    let portalCooldown = 0, acc = 0, msg = "", msgT = 0, over = false;

    function newPortals() {
      p1 = { x: 95 + Math.random() * 70, y: 70 + Math.random() * 85, r: 16 };
      p2 = { x: 185 + Math.random() * 60, y: 45 + Math.random() * 90, r: 16 };
    }
    newPortals();

    const POWER = (a) => Math.min(9.6, Math.max(4.6, Math.hypot(a.x - START.x, a.y - START.y) / 22 + 3.4));
    function velOf(a) { const ang = Math.atan2(a.y - START.y, a.x - START.x); const p = POWER(a); return { vx: Math.cos(ang) * p, vy: Math.sin(ang) * p }; }

    function setAim(pt) { aim = { x: Math.max(START.x + 25, Math.min(300, pt.x)), y: Math.max(10, Math.min(190, pt.y)) }; }
    function nudge(dy) { setAim({ x: aim.x, y: aim.y + dy }); }
    canvas.addEventListener("pointerdown", (e) => { if (!ball.flying) setAim(canvasPoint(canvas, e)); });
    canvas.addEventListener("pointermove", (e) => { if (e.buttons && !ball.flying) setAim(canvasPoint(canvas, e)); });

    function shoot() {
      if (ball.flying || shotsLeft <= 0 || over) return;
      const v = velOf(aim);
      ball.flying = true; ball.x = START.x; ball.y = START.y; ball.vx = v.vx; ball.vy = v.vy;
      shotsLeft--;
      portalCooldown = 0;
      playSynth(520, "triangle", 0.15, 0.22);
      buttons();
    }
    onKeys((e) => {
      if (e.key === "ArrowUp") nudge(-10);
      if (e.key === "ArrowDown") nudge(10);
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); shoot(); }
    });

    function buttons() {
      showButtons([
        { label: "▲ Mira su", disabled: ball.flying, fn: () => nudge(-12) },
        { label: "▼ Mira giù", disabled: ball.flying, fn: () => nudge(12) },
        { label: "🌀 TIRA!", sub: "Il verde porta all'arancione", cls: "hot", disabled: ball.flying || shotsLeft <= 0, fn: shoot },
        { label: "◂ Cruscotto", fn: showHub }
      ]);
    }
    showText("Testa Cromulon", `«<b>MOSTRATECI COSA SAPETE FARE!</b> Segnate ${GOALS} gol a Glapflap in ${shotsLeft} tiri. I portali cambiano posto a ogni tiro: la palla che entra nel <b style="color:#76ff03">verde</b> esce dall'<b style="color:#ff9800">arancione</b> più veloce.${bonusShots ? ` (Panissa: +${bonusShots} ${bonusShots === 1 ? "tiro" : "tiri"})` : ""}»`, false);
    buttons();

    function resetBall() { ball.flying = false; ball.x = START.x; ball.y = START.y; newPortals(); }
    function resolve(kind) {
      resetBall();
      if (kind === "goal") {
        goals++; msg = "GOL!"; playSynth(880, "sine", 0.3, 0.3); toast("⚽ Gol quantico!", "success", "🌟");
        gk.vy = Math.sign(gk.vy) * (1.6 + goals * 0.55);
      } else if (kind === "save") { msg = "PARATA"; playSynth(180, "sawtooth", 0.2, 0.25); }
      else { msg = "FUORI"; }
      msgT = 55;
      if (goals >= GOALS) return win();
      if (shotsLeft <= 0) return lose();
      buttons();
    }

    function win() {
      over = true; clearLoops();
      const r = winDimension("rick", "rickScore", goals);
      if (window.triggerAnimeCutin) { try { window.triggerAnimeCutin({ who: "Leo & Nonna", shotName: "GOL QUANTICO CROMULON!", sfxWord: "I LIKE WHAT YOU GOT!" }); } catch (e) {} }
      showText("Cromulon Gigante", `«<b>MI PIACE QUELLO CHE AVETE FATTO!</b> La Terra è salva per un'altra settimana.»<br><small style="opacity:.8">+${r.n} ${r.n === 1 ? "moneta" : "monete"} cosmiche${r.all ? " · Tre dimensioni vinte!" : ""}</small>`);
      showButtons([{ label: "Altra dimensione ▸", cls: "hot", fn: showHub }, { label: "Torna al Menu 🏠", fn: exitToMenu }]);
    }
    function lose() {
      over = true; clearLoops();
      showText("Cromulon", `«<b>NON ABBASTANZA TALENTO!</b> ${goals} gol su ${GOALS}. Glapflap ha parato le vostre speranze. Ricaricate i portali!»`);
      showButtons([{ label: "Riprova ▸", cls: "hot", fn: startRickDimension }, { label: "◂ Cruscotto", fn: showHub }]);
    }

    function step() {
      gk.y += gk.vy;
      if (gk.y < 35 || gk.y > 140) gk.vy = -gk.vy;
      if (!ball.flying) return;
      ball.x += ball.vx; ball.y += ball.vy; ball.vy += 0.08;
      if (portalCooldown > 0) portalCooldown--;
      if (portalCooldown === 0 && Math.hypot(ball.x - p1.x, ball.y - p1.y) < p1.r) {
        ball.x = p2.x + 12; ball.y = p2.y;
        ball.vx = Math.abs(ball.vx) * 1.15 + 0.6; ball.vy = -0.8;
        portalCooldown = 25; playSynth(950, "sine", 0.2, 0.28);
      }
      if (ball.x >= 280 && ball.x <= 296 && ball.y >= gk.y - 8 && ball.y <= gk.y + gk.h + 4) return resolve("save");
      if (ball.x > 300 && ball.y >= 30 && ball.y <= 168) return resolve("goal");
      if (ball.x > 326 || ball.y > 205 || ball.y < -15) return resolve("miss");
    }

    startLoop((dt) => {
      acc += dt;
      while (acc >= 1 && !over) { step(); acc -= 1; }
      if (over) return;
      if (msgT > 0) msgT -= dt;
      ctx.fillStyle = "#120024"; ctx.fillRect(0, 0, 320, 200);
      ctx.fillStyle = "#76ff03"; for (let i = 0; i < 25; i++) ctx.fillRect((i * 97) % 320, (i * 53) % 190, 1.5, 1.5);
      // testa cromulon
      ctx.fillStyle = "#ffb74d"; ctx.beginPath(); ctx.ellipse(160, 28, 26, 20, 0, 0, 7); ctx.fill();
      ctx.fillStyle = "#000"; ctx.fillRect(151, 22, 5, 5); ctx.fillRect(165, 22, 5, 5); ctx.fillRect(153, 37, 14, 4);
      // porta + portiere
      ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 3; ctx.strokeRect(298, 30, 20, 138);
      ctx.fillStyle = "#e91e63"; ctx.fillRect(284, gk.y, 10, gk.h);
      ctx.fillStyle = "#fff"; ctx.fillRect(282, gk.y + 4, 3, 3); ctx.fillRect(282, gk.y + 14, 3, 3);
      // portali
      [[p1, "118,255,3"], [p2, "255,152,0"]].forEach(([p, c]) => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = `rgba(${c},.35)`; ctx.fill(); ctx.strokeStyle = `rgb(${c})`; ctx.lineWidth = 2.5; ctx.stroke();
      });
      // anteprima traiettoria (senza portali)
      if (!ball.flying) {
        const v = velOf(aim);
        let x = START.x, y = START.y, vx = v.vx, vy = v.vy;
        ctx.fillStyle = "rgba(255,255,255,.55)";
        for (let i = 0; i < 90; i++) {
          x += vx; y += vy; vy += 0.08;
          if (i % 5 === 0 && i < 40) ctx.fillRect(x - 1, y - 1, 2.5, 2.5);
          if (x > 300 || y > 200) break;
        }
        ctx.strokeStyle = "rgba(255,210,63,.9)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(aim.x, aim.y, 6, 0, 7); ctx.stroke();
      }
      // Leo
      ctx.fillStyle = "#3fa7ff"; ctx.fillRect(36, 142, 14, 24); ctx.fillStyle = "#ffd23f"; ctx.fillRect(40, 134, 8, 8);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, 5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
      if (msgT > 0) { ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = msg === "GOL!" ? "#ffd23f" : "#ff5252"; ctx.fillText(msg, 160, 110); }
      const sc = $("rickScoreEl"), sh = $("rickShotsEl");
      if (sc) sc.innerHTML = `Gol <b>${goals}/${GOALS}</b>`;
      if (sh) sh.innerHTML = `Tiri <b>${shotsLeft}</b>`;
    });
  }

  // ================= 3. 3000: IL DERBY DI BENDER =================
  function startBenderDimension() {
    setChap("Dimensione 3000 · Il Derby del Molo");
    const alt = activateMultiView("block");
    if (!alt) return;
    const bonus = takePanissa();
    let timeLeft = 35 + bonus * 5;
    alt.innerHTML = `
      <canvas id="futCanvas" class="mv-cv" width="320" height="200" style="background:#051923;"></canvas>
      <div class="mv-hud" style="border-color:#00b4d8; background:rgba(0,53,102,.88);"><span style="color:#00b4d8; font-weight:bold;">🤖 BENDER</span><span id="futTimerEl" style="color:var(--gold);"></span><span id="futScoreEl" style="color:#90e0ef;"></span></div>
      <div class="mv-tip">Spara quando lo scudo è giù E Bender non è sulla tua corsia. Tocca il campo per cambiare corsia.</div>`;
    const canvas = $("futCanvas");
    const ctx = canvas.getContext("2d");

    const GOALS = 2;
    const LANES = [55, 90, 125, 160];
    let lane = 2;
    let goals = 0, charges = 3, recharge = 0, shield = true, shieldT = 0, over = false;
    let benderY = 80, benderVy = 1.8, acc = 0, msg = "", msgT = 0;
    let ball = { x: 60, y: LANES[lane], vx: 0, flying: false };

    function setLane(i) { if (ball.flying || over) return; lane = Math.max(0, Math.min(LANES.length - 1, i)); ball.y = LANES[lane]; playSynth(400, "square", 0.04, 0.06); buttons(); }
    canvas.addEventListener("pointerdown", (e) => {
      const pt = canvasPoint(canvas, e);
      let best = 0; LANES.forEach((y, i) => { if (Math.abs(y - pt.y) < Math.abs(LANES[best] - pt.y)) best = i; });
      setLane(best);
    });
    function emp() {
      if (charges <= 0 || !shield || over) return;
      charges--; shield = false; shieldT = 150;
      playSynth(700, "square", 0.12, 0.2); toast("⚡ EMP! Lo scudo è giù per 2,5 secondi", "info", "🔧");
      buttons();
    }
    function shoot() {
      if (ball.flying || over) return;
      ball.flying = true; ball.vx = 8.5; playSynth(600, "sawtooth", 0.15, 0.22);
      buttons();
    }
    onKeys((e) => {
      if (e.key === "ArrowUp") setLane(lane - 1);
      if (e.key === "ArrowDown") setLane(lane + 1);
      if (e.key === "e" || e.key === "E") emp();
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); shoot(); }
    });

    function buttons() {
      showButtons([
        { label: "▲ Corsia su", disabled: ball.flying || lane === 0, fn: () => setLane(lane - 1) },
        { label: "▼ Corsia giù", disabled: ball.flying || lane === LANES.length - 1, fn: () => setLane(lane + 1) },
        { label: `⚡ EMP (${charges}/3)`, sub: shield ? "Abbassa lo scudo" : "Scudo giù: spara!", cls: shield && charges > 0 ? "hot" : "", disabled: !shield || charges <= 0, fn: emp },
        { label: "🎯 TIRA!", sub: shield ? "Scudo attivo: respinto" : "Via libera!", cls: !shield ? "hot" : "", disabled: ball.flying, fn: shoot },
        { label: "◂ Cruscotto", fn: showHub }
      ]);
    }
    showText("Bender", `«Ammirate il mio telaio d'acciaio! Con scudo a birra e titanio non segnerete mai alla Planet Express. Anzi, se la focaccia si raffredda me la mangio io!»<br><small style="opacity:.8">${GOALS} gol in ${Math.round(timeLeft)}s. Ricarica EMP: 1 ogni 8s.${bonus ? ` (Panissa: +${bonus * 5}s)` : ""}</small>`, false);
    buttons();

    function reset() { ball.flying = false; ball.x = 60; ball.y = LANES[lane]; buttons(); }
    function step() {
      benderY += benderVy;
      if (benderY < 38 || benderY > 130) benderVy = -benderVy;
      if (shieldT > 0) { shieldT--; if (shieldT === 0) { shield = true; buttons(); } }
      if (!ball.flying) return;
      ball.x += ball.vx;
      const inBody = ball.x >= 268 && ball.x <= 290 && ball.y >= benderY - 6 && ball.y <= benderY + 42;
      if (shield && ball.x >= 240 && ball.y >= benderY - 18 && ball.y <= benderY + 56) { msg = "RESPINTO"; msgT = 45; playSynth(150, "sawtooth", 0.25, 0.28); reset(); }
      else if (inBody) { msg = "PARATO"; msgT = 45; playSynth(170, "sawtooth", 0.25, 0.28); reset(); }
      else if (ball.x >= 300) {
        goals++; msg = "GOL!"; msgT = 55; playSynth(880, "sine", 0.35, 0.28); toast("⚽ Gol alla Planet Express!", "success", "🌟");
        benderVy = Math.sign(benderVy) * (1.8 + goals * 0.8);
        reset();
        if (goals >= GOALS) win();
      }
    }

    function win() {
      over = true; clearLoops();
      const r = winDimension("bender", "benderScore", goals);
      showText("Bender", `«Maledizione, mi avete bruciato i diodi con quella finta! Va bene, prendetevi la mancia e portate la teglia calda al Professore prima che mi metta a piangere grasso sintetico!»<br><small style="opacity:.8">+${r.n} ${r.n === 1 ? "moneta" : "monete"}${r.all ? " · Tre dimensioni vinte!" : ""}</small>`);
      showButtons([{ label: "Altra dimensione ▸", cls: "hot", fn: showHub }, { label: "Torna al Menu 🏠", fn: exitToMenu }]);
    }
    function lose() {
      over = true; clearLoops();
      showText("Nonna Ferri", `«La focaccia si è raffreddata e Bender se l'è mangiata con una birra da due litri! Ricarichiamo la Panda: ${goals}/${GOALS} gol.»`);
      showButtons([{ label: "Riprova ▸", cls: "hot", fn: startBenderDimension }, { label: "◂ Cruscotto", fn: showHub }]);
    }

    startLoop((dt) => {
      if (over) return;
      timeLeft -= dt / 60;
      recharge += dt / 60;
      if (recharge >= 8) { recharge = 0; if (charges < 3) { charges++; buttons(); } }
      acc += dt;
      while (acc >= 1 && !over) { step(); acc -= 1; }
      if (over) return;
      if (msgT > 0) msgT -= dt;
      if (timeLeft <= 0) return lose();
      ctx.fillStyle = "#031926"; ctx.fillRect(0, 0, 320, 200);
      ctx.strokeStyle = "rgba(0,180,216,.28)"; ctx.lineWidth = 1;
      LANES.forEach((y, i) => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(320, y); ctx.strokeStyle = i === lane ? "rgba(255,210,63,.45)" : "rgba(0,180,216,.2)"; ctx.stroke(); });
      ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 3; ctx.strokeRect(302, 30, 16, 140);
      // Bender
      ctx.fillStyle = "#9e9e9e"; ctx.fillRect(270, benderY, 18, 36);
      ctx.fillStyle = "#fff"; ctx.fillRect(268, benderY + 6, 8, 6); ctx.fillStyle = "#000"; ctx.fillRect(270, benderY + 8, 2, 2);
      ctx.strokeStyle = "#9e9e9e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(279, benderY); ctx.lineTo(279, benderY - 8); ctx.stroke();
      if (shield) { ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(262, benderY + 18, 32, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
      ctx.fillStyle = "#ffd23f"; ctx.fillRect(40, LANES[lane] - 12, 14, 26);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, 5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill();
      if (msgT > 0) { ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = msg === "GOL!" ? "#ffd23f" : "#ff5252"; ctx.fillText(msg, 160, 110); }
      const tm = $("futTimerEl"), sc = $("futScoreEl");
      if (tm) tm.innerHTML = `Focaccia <b style="color:${timeLeft < 8 ? "#ff5252" : "var(--gold)"}">${Math.max(0, Math.ceil(timeLeft))}s</b>`;
      if (sc) sc.innerHTML = `Gol <b>${goals}/${GOALS}</b>`;
    });
  }

  // ================= 4. WESTEROS: LA BARRIERA DI PESTO =================
  function startThronesDimension() {
    setChap("Westeros Ligure · La Barriera");
    const alt = activateMultiView("block");
    if (!alt) return;
    const bonus = takePanissa();
    let shotsLeft = 7 + bonus;
    alt.innerHTML = `
      <canvas id="gotCanvas" class="mv-cv" width="320" height="200" style="background:#0b132b;"></canvas>
      <div class="mv-hud" style="border-color:#48cae4; background:rgba(11,19,43,.9);"><span style="color:#48cae4; font-weight:bold;">⚔️ BARRIERA</span><span id="gotWindEl" style="color:var(--gold);"></span><span id="gotGkHp" style="color:#ff4d5a;"></span></div>
      <div class="mv-tip">Mira sulla crepa dorata, poi ferma la barra di potenza nella zona verde</div>`;
    const canvas = $("gotCanvas");
    const ctx = canvas.getContext("2d");

    let hp = 100, wind = 0, crack = 100, aimY = 100, phase = "aim", gauge = 0, gaugeDir = 1, power = 0;
    let ball = { x: 50, y: 160, vx: 0, vy: 0 };
    let acc = 0, msg = "", msgT = 0, over = false;
    const snow = [];
    for (let i = 0; i < 40; i++) snow.push({ x: Math.random() * 320, y: Math.random() * 200, sp: Math.random() * 1.5 + 0.8 });

    function newRound() {
      phase = "aim";
      wind = Math.round((Math.random() * 2 - 1) * 10) / 10;
      crack = 45 + Math.random() * 100;
      gauge = 0; gaugeDir = 1;
      ball.x = 50; ball.y = 160;
      buttons();
    }
    function setAim(y) { if (phase !== "aim") return; aimY = Math.max(15, Math.min(185, y)); }
    canvas.addEventListener("pointerdown", (e) => { if (phase === "aim") setAim(canvasPoint(canvas, e).y); });
    function fire() {
      if (phase !== "aim" || over || shotsLeft <= 0) return;
      power = gauge;
      phase = "fly"; shotsLeft--;
      const ang = Math.atan2(aimY - 160, 235);
      const sp = 5.5 + power * 4.5;
      ball.vx = Math.cos(ang) * sp; ball.vy = Math.sin(ang) * sp;
      playSynth(850, "sawtooth", 0.3, 0.3);
      if (window.triggerAnimeCutin && shotsLeft === (6 + bonus)) { try { window.triggerAnimeCutin({ who: "Leo Moretti", shotName: "TIRO DRACARYS DEL FUOCO VALYRIANO!", isEgo: true, sfxWord: "FUOCO E SANGUE!" }); } catch (e) {} }
      buttons();
    }
    onKeys((e) => {
      if (e.key === "ArrowUp") setAim(aimY - 10);
      if (e.key === "ArrowDown") setAim(aimY + 10);
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); fire(); }
    });
    function buttons() {
      showButtons([
        { label: "▲ Mira su", disabled: phase !== "aim", fn: () => setAim(aimY - 14) },
        { label: "▼ Mira giù", disabled: phase !== "aim", fn: () => setAim(aimY + 14) },
        { label: "🔥 DRACARYS!", sub: "Ferma la barra di potenza", cls: "hot", disabled: phase !== "aim" || shotsLeft <= 0, fn: fire },
        { label: "◂ Cruscotto", fn: showHub }
      ]);
    }
    showText("Re della Notte", `«<i>L'Inverno è arrivato sui moli di Borgo Marino.</i> La Barriera di Pesto è congelata: sciogli il ghiaccio prima che i tuoi ${shotsLeft} tiri finiscano!»<br><small style="opacity:.8">La <b>crepa</b> dorata fa il triplo del danno. Il vento (⇠⇢) sposta la palla. Potenza giusta = zona verde.${bonus ? ` (Panissa: +${bonus} ${bonus === 1 ? "tiro" : "tiri"})` : ""}</small>`, false);
    newRound();

    function impact() {
      const d = Math.abs(ball.y - crack);
      const good = power >= 0.5 && power <= 0.88;
      let dmg = 0;
      if (ball.y < 15 || ball.y > 185) { dmg = 0; msg = "FUORI"; }
      else if (d < 14) { dmg = 40; msg = "CREPA!"; }
      else if (d < 32) { dmg = 20; msg = "BEL COLPO"; }
      else { dmg = 8; msg = "SCHEGGE"; }
      if (!good && dmg) { dmg = Math.round(dmg * 0.5); msg += " (debole)"; }
      hp = Math.max(0, hp - dmg);
      msgT = 60;
      playSynth(220, "sawtooth", 0.3, 0.3);
      if (dmg) toast(`Ghiaccio −${dmg}%`, "success", "🔥");
      if (hp <= 0) return win();
      if (shotsLeft <= 0) return lose();
      newRound();
    }
    function win() {
      over = true; clearLoops();
      const r = winDimension("got", "gotScore", 100);
      showText("Re della Notte", `«<i>La Barriera è caduta… il fuoco della Rondine arde più dell'inverno.</i> Vi consegno il Trono di Focaccia delle Tre Riviere.»<br><small style="opacity:.8">+${r.n} ${r.n === 1 ? "moneta" : "monete"}${r.all ? " · Tre dimensioni vinte! Torna al cruscotto." : ""}</small>`);
      showButtons([{ label: "🏆 Torna al Cruscotto ▸", cls: "hot", fn: () => { toast("👑 Trono di Focaccia conquistato!", "success", "🏆"); showHub(); } }, { label: "Torna al Menu 🏠", fn: exitToMenu }]);
    }
    function lose() {
      over = true; clearLoops();
      showText("Nonna Ferri", `«Il ghiaccio regge ancora al ${hp}%! Il vento è traditore: guarda la freccia e cerca la crepa dorata. Riproviamo?»`);
      showButtons([{ label: "Riprova ▸", cls: "hot", fn: startThronesDimension }, { label: "◂ Cruscotto", fn: showHub }]);
    }

    function step() {
      if (phase !== "fly") return;
      ball.x += ball.vx; ball.y += ball.vy + wind * 0.45; ball.vy += 0.035;
      if (ball.x >= 284 || ball.y < -10 || ball.y > 210) impact();
    }

    startLoop((dt) => {
      if (over) return;
      snow.forEach((s) => { s.y += s.sp * dt; s.x += wind * 0.8 * dt; if (s.y > 200) { s.y = 0; s.x = Math.random() * 320; } if (s.x < 0) s.x = 320; if (s.x > 320) s.x = 0; });
      if (phase === "aim") { gauge += gaugeDir * 0.018 * dt; if (gauge >= 1) { gauge = 1; gaugeDir = -1; } if (gauge <= 0) { gauge = 0; gaugeDir = 1; } }
      acc += dt;
      while (acc >= 1 && !over) { step(); acc -= 1; }
      if (over) return;
      if (msgT > 0) msgT -= dt;
      ctx.fillStyle = "#0b132b"; ctx.fillRect(0, 0, 320, 200);
      ctx.fillStyle = "rgba(255,255,255,.8)"; snow.forEach((s) => ctx.fillRect(s.x, s.y, 2, 2));
      // barriera
      ctx.fillStyle = "#48cae4"; ctx.fillRect(285, 20, 35, 160);
      ctx.fillStyle = "#ade8f4"; ctx.fillRect(288, 25, 29, 150);
      const melt = (100 - hp) / 100;
      ctx.fillStyle = "#0b132b"; ctx.fillRect(285, 20, 35, 160 * melt * 0.5);
      // crepa
      ctx.fillStyle = "#ffd23f"; ctx.fillRect(285, crack - 4, 35, 8);
      ctx.fillStyle = "#fff"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "right"; ctx.fillText("CREPA", 282, crack + 3);
      // re della notte
      ctx.fillStyle = "#023e8a"; ctx.fillRect(272, 75, 12, 30); ctx.fillStyle = "#00f5d4"; ctx.fillRect(271, 80, 3, 3); ctx.fillRect(271, 86, 3, 3);
      // Leo
      ctx.fillStyle = "#ffd23f"; ctx.fillRect(44, 144, 14, 26); ctx.fillStyle = "#d00000"; ctx.fillRect(38, 148, 6, 18);
      // mira + barra potenza
      if (phase === "aim") {
        ctx.strokeStyle = "rgba(255,120,0,.8)"; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(60, 158); ctx.lineTo(284, aimY); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(284, aimY, 6, 0, 7); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(20, 183, 120, 9);
        ctx.fillStyle = "rgba(102,187,106,.6)"; ctx.fillRect(20 + 120 * 0.5, 183, 120 * 0.38, 9);
        ctx.fillStyle = "#ff5400"; ctx.fillRect(20 + 120 * gauge - 2, 180, 4, 15);
      }
      // freccia vento
      ctx.fillStyle = "#ffd23f"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "left";
      ctx.fillText(wind === 0 ? "vento: calmo" : (wind < 0 ? "◄" : "►").repeat(Math.max(1, Math.round(Math.abs(wind) * 1.5))) + ` vento ${wind > 0 ? "giù" : "su"}`, 10, 46);
      ctx.beginPath(); ctx.arc(ball.x, ball.y, 6, 0, 7); ctx.fillStyle = phase === "fly" ? "#ff5400" : "#fff"; ctx.fill();
      if (msgT > 0) { ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#ffd23f"; ctx.fillText(msg, 160, 110); }
      const w = $("gotWindEl"), h = $("gotGkHp");
      if (w) w.innerHTML = `Tiri <b>${shotsLeft}</b>`;
      if (h) h.innerHTML = `Ghiaccio <b>${hp}%</b>`;
    });
  }

  // ================= FINALE: LA FENDITURA =================
  function startFinale() {
    setChap("La Fenditura · Epilogo");
    const alt = activateMultiView("flex");
    if (alt) {
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `<img src="img/multiverse_panda.jpg" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.1) brightness(.7) hue-rotate(35deg);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,5,40,.1), rgba(14,4,30,.9) 88%);"></div>
        <div style="position:relative; z-index:2; padding:10px 12px; font-size:12px; color:#f3e5f5;">La fenditura brilla piano, come una lampada lasciata accesa per qualcuno.</div>`;
    }
    showText("Nonna Ferri", `«Leo, la Panda non l'ho comprata io. Era di <b>Nonno Ferri</b>: ci portava i panini al porto ogni domenica. La fenditura l'abbiamo aperta noi, ma si è fermata proprio qui perché in una di queste dimensioni c'è un Nonno che ancora guida la Panda. Posso salutarlo un minuto. Ci vieni con me?»`);
    showButtons([
      { label: "🚗 Vengo con te", sub: "Un saluto, sul sedile dietro", cls: "hot", fn: () => finaleStep2("insieme") },
      { label: "🕯️ Aspetto qui", sub: "Le lasci il suo momento", fn: () => finaleStep2("solo") }
    ]);
  }

  function finaleStep2(choice) {
    const a = choice === "insieme"
      ? `Il Nonno dell'altra dimensione non vi riconosce ma vi serve una focaccia calda lo stesso. «Fate buon viaggio,» dice. «E tenete d'occhio il freno a mano.» Nonna ride e si asciuga gli occhi col grembiule.`
      : `Dal parabrezza vedi Nonna parlare con un uomo identico alla foto sul cruscotto. Non senti le parole, ma vedi il modo in cui annuisce. Quando torna ha l'aria leggera di chi ha posato una borsa pesante.`;
    showText("Narratore", `${a}<br><br><b>Nonna:</b> «Adesso la fenditura va gestita. Chiuderla o no, Leo?»`);
    showButtons([
      { label: "🔒 Chiudila", sub: "Il multiverso torna in pace", cls: "hot", fn: () => finaleEnd(choice, "chiusa") },
      { label: "🔓 Lasciala socchiusa", sub: "Una porta per le domeniche", fn: () => finaleEnd(choice, "aperta") }
    ]);
  }

  function finaleEnd(choice, door) {
    const prog = getProgress();
    prog.finale = choice + ":" + door;
    let n = 0;
    if (!prog.finaleDone) { prog.finaleDone = true; n = 5; }
    saveProgress(prog);
    coins(n);
    toast("🌀 Fenditura sistemata!", "success", "🏆");
    const t = door === "chiusa"
      ? `La Panda sbuffa, la luce si spegne con un tintinnio. In cabina resta solo l'odore di panissa e una carta di caramella dell'altro universo.`
      : `La fenditura si riduce a una fessura dorata, grande quanto uno sportello. «Per le domeniche,» dice Nonna, e mette in moto con un gran rumore di marmitta.`;
    showText("Nonna Ferri", `<b style="color:var(--gold);">SAGA COMPLETATA!</b><br>${t}<br><small style="opacity:.8">${n ? "+" + n + " monete" : "Finale già visto"}</small>`);
    showButtons([
      { label: "Cruscotto ▸", fn: showHub },
      { label: "Torna al Menu 🏠", cls: "hot", fn: exitToMenu }
    ]);
  }

  window.openMultiverseMenu = openMultiverseMenu;
})();
