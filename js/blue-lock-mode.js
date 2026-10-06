// ================= v21 · BLUE LOCK: LA GABBIA DELL'EGO =================
// Torneo Sopravvivenza nella Gabbia dei Predatori di Punta Nera (parodia, nomi inventati).
// Ogni round = 6 turni (+ gol d'oro): ATTACCO con mira e barra del tempismo contro un portiere che ha
// una tendenza leggibile, DIFESA con "lettura" del tiro avversario (finte incluse), Ego vs Intesa,
// allenamento con Punti Fame, scelte di mentalità che portano a finali diversi.
(function () {
  const K_BL = "ali-di-rondine.bluelock-record"; // vecchio record: invariato (won, highStage, bestEgo)
  const K_BL2 = "ali-di-rondine.bluelock-v2"; // progressione nuova (valori di default sicuri)

  function getBLRecord() {
    try {
      const d = JSON.parse(localStorage.getItem(K_BL));
      if (d && typeof d === "object") return { won: d.won | 0, highStage: d.highStage | 0, bestEgo: d.bestEgo | 0 || 50 };
    } catch (e) {}
    return { won: 0, highStage: 0, bestEgo: 50 };
  }
  function saveBLRecord(rec) {
    try { localStorage.setItem(K_BL, JSON.stringify(rec)); } catch (e) {}
  }
  function getProg() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(K_BL2)); } catch (e) {}
    d = d && typeof d === "object" ? d : {};
    const up = d.up && typeof d.up === "object" ? d.up : {};
    const run = d.run && typeof d.run === "object" ? d.run : {};
    const num = (v, mx) => Math.max(0, Math.min(mx, v | 0));
    const rec = getBLRecord();
    return {
      pts: num(d.pts, 999),
      up: { prec: num(up.prec, 4), pot: num(up.pot, 4), rif: num(up.rif, 4) },
      stage: num(d.stage != null ? d.stage : rec.highStage, 5), // round raggiunto (5 = scalata completata)
      paid: Array.isArray(d.paid) ? d.paid.filter((x) => typeof x === "string") : [],
      endings: d.endings && typeof d.endings === "object" ? d.endings : {},
      run: { ego: num(run.ego, 99), team: num(run.team, 99) }
    };
  }
  function saveProg(p) {
    try { localStorage.setItem(K_BL2, JSON.stringify(p)); } catch (e) {}
  }
  function reward(n) {
    if (n > 0 && typeof window.addCoins === "function") { try { window.addCoins(n); } catch (e) {} }
  }

  // ---- stile (prefisso blk-) ----
  function injectStyle() {
    if (document.getElementById("blkStyle")) return;
    const st = document.createElement("style");
    st.id = "blkStyle";
    st.textContent = `
      .blk-hud{position:absolute;top:5px;left:6px;right:6px;z-index:10;display:flex;justify-content:space-between;align-items:center;gap:6px;background:rgba(10,16,32,.88);border:1px solid rgba(0,229,255,.4);border-radius:8px;padding:3px 8px;font-size:11px;color:#fff}
      .blk-hud b{font-family:var(--display)}
      .blk-bars{position:absolute;bottom:5px;left:8px;right:8px;z-index:10;background:rgba(6,11,24,.85);border:1px solid #1a2744;border-radius:6px;padding:3px 7px;display:flex;flex-direction:column;gap:3px}
      .blk-row{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:700}
      .blk-bar{flex:1;height:7px;background:#0e1424;border-radius:4px;overflow:hidden;border:1px solid rgba(0,229,255,.3)}
      .blk-bar i{display:block;height:100%;transition:width .3s ease}
      .blk-glow{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 40px #00e5ff;mix-blend-mode:screen;animation:blkPulse 1.5s infinite alternate}
      @keyframes blkPulse{from{opacity:.35}to{opacity:1}}
    `;
    document.head.appendChild(st);
  }

  // ---- avversari ----
  // fav = zona preferita dal portiere (tendenza leggibile col dossier di Sara), favP = quanto spesso ci va,
  // read = quanto spesso "legge" la mira, bluff = quanto spesso la finta di tiro mente in difesa.
  const BOSSES = [
    {
      id: "toro", name: "Toro Galli", title: "Il Demolitore del Nord", color: "#ff4d5a",
      quote: "«Il campo è un'arena, Moretti. Chi esita finisce schiacciato contro le reti metalliche!»",
      gkName: "Mura d'Acciaio", gkSpeed: 2.2, special: "CARICA DEL TORO DISTRUTTIVA",
      fav: { x: 160, y: 132, n: "in basso al centro" }, favP: 0.5, read: 0, bluff: 0.1, atk: "centro",
      scout: "Mura d'Acciaio si butta quasi sempre sul rasoterra centrale. Toro tira di potenza, dritto per dritto: si legge dal piede.",
      after: "Toro si siede contro la rete, ansimando. «Giocavo per pagare il mutuo di mia madre, sai? Poi ho scoperto che mi piaceva vincere più che pagarlo. Non dirglielo.»"
    },
    {
      id: "kenji", name: "Kenji Arata", title: "L'Imperatore Aereo", color: "#00e5ff",
      quote: "«Dall'alto vedo tutte le tue scelte prima che tu muova il piede. Non puoi nasconderti.»",
      gkName: "Wagner il Falco", gkSpeed: 2.8, special: "VOLO DELL'AQUILA REALE",
      fav: { x: 160, y: 68, n: "in alto al centro" }, favP: 0.5, read: 0.1, bluff: 0.25, atk: "lati",
      scout: "Wagner il Falco vola sull'incrocio alto. Kenji tira sui lati e ogni tanto bluffa con lo sguardo.",
      after: "Kenji ride, per la prima volta. «Guardavo tutti dall'alto per non dover guardare in faccia nessuno. Dal basso la vista è peggiore, ma almeno c'è compagnia.»"
    },
    {
      id: "sho", name: "Sho Arata", title: "Il Cecchino Invisibile", color: "#b9a6ff",
      quote: "«Non guardare me. Guarda la palla che sta già gonfiando l'incrocio dei pali.»",
      gkName: "Ishikawa Riflesso", gkSpeed: 3.4, special: "LAMPO FANTASMA",
      fav: { x: 228, y: 105, n: "sul palo destro" }, favP: 0.45, read: 0.2, bluff: 0.4, atk: "angoli",
      scout: "Ishikawa Riflesso copre il palo destro e ha riflessi da gatto. Sho tira negli angoli e sa bluffare: non fidarti troppo del suo sguardo.",
      after: "Sho si toglie il cappuccio. «Mio fratello dice che parlo poco. Ho risposto 'ok'. Credo sia il record di conversazione della settimana.»"
    },
    {
      id: "bruno", name: "Bruno Sabatini", title: "Il Corvo d'Acciaio", color: "#ffd23f",
      quote: "«I sentimenti fanno perdere le finali. Il cinismo vince i campionati.»",
      gkName: "Orsini la Roccia", gkSpeed: 3.8, special: "BECCO DEL CORVO FEROCE",
      fav: { x: 92, y: 105, n: "sul palo sinistro" }, favP: 0.45, read: 0.3, bluff: 0.45, atk: "alterna",
      scout: "Orsini la Roccia presidia il palo sinistro. Bruno alterna sempre i lati: dopo un tiro a destra viene a sinistra, e viceversa. Quando se ne ricorda.",
      after: "Bruno stringe la fascia da capitano che non porta più. «Ho lasciato un compagno indietro, una volta, per vincere. Ho vinto. Non so più dove sia lui.» Ti restituisce il pallone. «Fai meglio di me.»"
    },
    {
      id: "alter", name: "L'Ombra di Leo (Alter Ego)", title: "La Rondine Oscura", color: "#00f0ff",
      quote: "«Sei davvero disposto a divorare tutto pur di diventare il numero uno al mondo?»",
      gkName: "Riflesso Oscuro", gkSpeed: 4.4, special: "EGO VOLANTE SUPREMO",
      fav: { x: 160, y: 105, n: "al centro" }, favP: 0.35, read: 0.35, bluff: 0.5, atk: "specchio",
      scout: "Il Riflesso Oscuro legge la mira più spesso degli altri. L'Ombra tira dove hai tirato tu l'ultima volta: sei il tuo peggior nemico.",
      after: ""
    }
  ];

  const AIMS = [
    { n: "Incrocio alto sx", x: 85, y: 62 },
    { n: "Incrocio alto dx", x: 235, y: 62 },
    { n: "Rasoterra sx", x: 85, y: 138 },
    { n: "Rasoterra dx", x: 235, y: 138 },
    { n: "Centro", x: 160, y: 100 }
  ];
  const UPS = [
    { id: "prec", name: "Precisione", desc: "Zona verde del tempismo più larga", cost: [2, 3, 4, 5] },
    { id: "pot", name: "Potenza", desc: "Il portiere para su un raggio più piccolo", cost: [2, 3, 4, 5] },
    { id: "rif", name: "Riflessi di Nico", desc: "Più parate anche se indovini la zona vicina", cost: [2, 3, 4, 5] }
  ];

  // ---- stato ----
  let currentStage = 0;
  let onExitCallback = null;
  let animId = null;
  let S = null; // stato partita

  const $ = (id) => document.getElementById(id);
  const getStageAlt = () => $("stageAlt");
  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

  function setChap(t) {
    if (window.setChapter) { try { window.setChapter(t); return; } catch (e) {} }
    const el = $("chap");
    if (el) el.textContent = t;
  }
  function showText(who, html) {
    const el = $("text");
    if (el) el.innerHTML = `<span class="who" style="background:#00e5ff; color:#0e1424; font-weight:800;">${who}</span><span class="t">${html}</span>`;
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
      if (o.sub) {
        const s = document.createElement("small");
        s.textContent = o.sub;
        b.appendChild(s);
      }
      b.onclick = () => { if (o.fn) o.fn(); };
      c.appendChild(b);
    });
  }
  function setBlView() {
    if (window.setView) { try { window.setView({ kind: "bluelock" }); return; } catch (e) {} }
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "bluelock" });
  }

  function stopLoop() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }
  function closeArenaStage() {
    stopLoop();
    S = null;
    const alt = getStageAlt();
    if (alt) { alt.hidden = true; alt.style.display = "none"; alt.innerHTML = ""; }
    const cv = $("cv");
    if (cv) cv.hidden = false;
    if (window.gameEngine && window.gameEngine.setView) window.gameEngine.setView({ kind: "scene", bg: "title" });
    const egoBox = $("egoHudPanel");
    if (egoBox) egoBox.remove();
  }
  function leave() {
    closeArenaStage();
    if (onExitCallback) onExitCallback();
    else if (window.title) window.title();
  }

  function openBlueLockMode(onBack) {
    onExitCallback = onBack;
    injectStyle();
    const p = getProg();
    currentStage = Math.min(BOSSES.length - 1, p.stage);
    showHub();
  }

  // ================= HUB =================
  function showHub() {
    stopLoop();
    S = null;
    setBlView();
    const cv = $("cv");
    if (cv) cv.hidden = true;
    setChap("Blue Lock · La Gabbia dell'Ego");
    renderHubBanner();
    const rec = getBLRecord();
    const p = getProg();
    const done = p.stage >= BOSSES.length;
    const boss = BOSSES[currentStage];

    showText(
      "voce",
      `<b>LA GABBIA DEI PREDATORI</b><br>Un'arena d'asfalto e catene scavata nella scogliera: qui conta chi ha fame di porta.<br>
      <i>Trofeo: ${rec.won > 0 ? "vinto " + rec.won + " volte" : "non ancora conquistato"} · Round più alto: ${Math.min(BOSSES.length, rec.highStage + 1)}/${BOSSES.length}</i>`
    );

    const list = [];
    list.push({
      label: done ? `⚽ Rigioca: ${boss.name}` : `⚽ Round ${currentStage + 1}: ${boss.name}`,
      sub: `${boss.title} · portiere ${boss.gkName}`,
      cls: "hot",
      fn: () => briefing()
    });
    list.push({ label: "🏋️ Allenamento", sub: `${p.pts} Punti Fame da spendere`, fn: showTraining });
    list.push({ label: "📜 Come si gioca", sub: "Ego, Intesa, tempismo e lettura", fn: showPhilosophy });
    if (p.stage > 0) {
      list.push({ label: "◂ Round prec.", disabled: currentStage <= 0, fn: () => { currentStage--; showHub(); } });
      list.push({ label: "Round succ. ▸", disabled: currentStage >= Math.min(BOSSES.length - 1, p.stage), fn: () => { currentStage++; showHub(); } });
    }
    if (done) list.push({ label: "🔄 Nuova scalata", sub: "Ricomincia dal Round 1 (record e ricompense restano)", fn: () => { const q = getProg(); q.stage = 0; q.run = { ego: 0, team: 0 }; saveProg(q); currentStage = 0; showHub(); } });
    list.push({ label: "◂ Torna al Menu", cls: "pick", fn: leave });
    showButtons(list);
  }

  function renderHubBanner() {
    const rec = getBLRecord();
    const p = getProg();
    const done = p.stage >= BOSSES.length;
    currentStage = clamp(currentStage, 0, Math.min(BOSSES.length - 1, p.stage));
    const boss = BOSSES[currentStage];
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
      alt.innerHTML = `
        <img src="img/blue_lock_cage.jpg" alt="La Gabbia" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.15) brightness(0.9);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(6,11,24,0.3) 0%, rgba(6,11,24,0.85) 90%);"></div>
        <div style="position:relative; z-index:2; padding:12px; display:flex; justify-content:space-between; align-items:flex-end; gap:8px;">
          <div>
            <div style="font-family:var(--display); font-size:16px; color:#00e5ff; text-shadow:0 0 10px rgba(0,229,255,0.8);">LA GABBIA DI PUNTA NERA</div>
            <div style="font-size:12px; color:#ced9eb;">Round ${currentStage + 1}/${BOSSES.length}${done ? " · scalata completata" : ""} · Punti Fame ${p.pts}</div>
          </div>
          <div style="background:rgba(0,229,255,0.15); border:1px solid #00e5ff; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; text-align:right;">
            Avversario: <b style="color:${boss.color};">${boss.name}</b>
          </div>
        </div>`;
    }

  }

  function showPhilosophy() {
    renderHubBanner();
    showText(
      "Sara",
      `«Leo, ogni round sono 6 turni: <b>attacco</b> e poi <b>difesa</b>.<br>
      <b>Attacco</b>: tocca la porta per mirare, scegli <b>Tiro Personale</b> (fermi la barra nella zona verde: sposta la palla in base al tempismo) o <b>Sponda d'Intesa</b> (più sicura, ricarica Grinta). Il portiere ha una zona preferita: il mio dossier te la dice, evitala!<br>
      <b>Ego</b> sopra il 75%: <b>Fiamme Nere</b>, il portiere arriva molto meno. Ma si consuma, e ricarica solo coi tiri egoisti.<br>
      <b>Difesa</b>: leggi come carica l'avversario e tuffati. Attenzione: qualcuno bluffa. <b>Leggi il gioco</b> costa Grinta ma non mente.<br>
      Vinci con i Punti Fame: allenati tra un round e l'altro.»`
    );
    showButtons([{ label: "Ho capito, andiamo!", cls: "hot", fn: showHub }], true);
  }

  function showTraining() {
    renderHubBanner();
    const p = getProg();
    showText("Tommy", `«Allenamento! Hai <b>${p.pts} Punti Fame</b>. I punti si guadagnano coi gol e con le vittorie. Dai, spendili prima che ci pensi Nico a spenderli in focaccia.»`);
    const list = UPS.map((u) => {
      const lv = p.up[u.id];
      const maxed = lv >= 4;
      const cost = u.cost[lv];
      return {
        label: `${u.name} · Liv. ${lv}/4`,
        sub: maxed ? `${u.desc} · MAX` : `${u.desc} · costo ${cost}`,
        cls: !maxed && p.pts >= cost ? "hot" : "",
        disabled: maxed || p.pts < cost,
        fn: () => {
          const q = getProg();
          const c = u.cost[q.up[u.id]];
          if (q.up[u.id] >= 4 || q.pts < c) return;
          q.pts -= c;
          q.up[u.id]++;
          saveProg(q);
          if (window.toast) window.toast(`${u.name} al livello ${q.up[u.id]}!`, "success", "🏋️");
          showTraining();
        }
      };
    });
    list.push({ label: "◂ Torna alla Gabbia", cls: "pick", fn: showHub });
    showButtons(list);
  }

  // ================= BRIEFING + SCELTA DI MENTALITA' =================
  function briefing() {
    const boss = BOSSES[currentStage];
    setChap(`Gabbia · ${boss.name}`);
    showText(boss.name, `<i>${boss.quote}</i><br><br><b>Dossier di Sara:</b> ${boss.scout}<br><br>Con che testa entri nella Gabbia?`);
    showButtons([
      { label: "🔥 Divora tutto", sub: "Ego iniziale 70, Grinta 85", cls: "hot", fn: () => beginMatch("ego") },
      { label: "🤝 Gioca per la squadra", sub: "Ego 35, Sponde più riuscite", fn: () => beginMatch("team") },
      { label: "🧘 Mantieni la calma", sub: "Ego 50, Grinta 100", fn: () => beginMatch("calm") },
      { label: "◂ Indietro", cls: "pick", fn: showHub }
    ]);
  }

  // ================= PARTITA =================
  function beginMatch(lean) {
    const p = getProg();
    const boss = BOSSES[currentStage];
    if (lean === "ego") p.run.ego++;
    else if (lean === "team") p.run.team++;
    saveProg(p);
    S = {
      alive: true,
      boss,
      up: p.up,
      lean,
      my: 0,
      opp: 0,
      turn: 1,
      extra: 0,
      ego: lean === "ego" ? 70 : lean === "team" ? 35 : 50,
      guts: lean === "ego" ? 85 : 100,
      aimIdx: 4,
      aim: { x: 160, y: 100 },
      phase: "idle",
      keeperX: 160,
      keeperY: 105,
      keeperDir: 1,
      ball: null,
      anim: null,
      cursor: 0.5,
      lastAimSide: 1,
      lastBossSide: 1,
      shots: { solo: 0, team: 0, ego: 0 },
      msg: null,
      defHint: null,
      defReal: 1,
      readUsed: false,
      statGoals: 0
    };
    renderArena();
    startTurn();
  }

  function renderArena() {
    const alt = getStageAlt();
    if (!alt) return;
    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.overflow = "hidden";
    const boss = S.boss;
    alt.innerHTML = `
      <div style="position:absolute; inset:0; pointer-events:none;">
        <img src="img/blue_lock_cage.jpg" alt="" style="width:100%; height:100%; object-fit:cover; filter:contrast(1.2) brightness(0.8);">
        <div style="position:absolute; inset:0; background:radial-gradient(circle at center, transparent 40%, rgba(6,11,24,0.7) 90%);"></div>
        <div id="blkGlow" class="blk-glow" style="display:none;"></div>
      </div>
      <div class="blk-hud">
        <span style="color:${boss.color}; font-weight:800;">VS ${boss.name.split(" ")[0].toUpperCase()}</span>
        <span id="blkTurn" style="color:var(--dim);"></span>
        <b id="blkScore" style="font-size:14px; color:var(--gold);"></b>
      </div>
      <div style="position:absolute; inset:0; padding-top:28px; padding-bottom:36px; box-sizing:border-box;">
        <canvas id="cageCv" width="320" height="200" style="width:100%; height:100%; touch-action:manipulation;"></canvas>
      </div>
      <div class="blk-bars">
        <div class="blk-row"><span style="color:#81d4fa; width:46px;">INTESA</span><div class="blk-bar"><i id="blkEgo" style="background:linear-gradient(90deg,#ffd23f 0%,#00e5ff 70%,#ff4d5a 100%);"></i></div><span style="color:#ff4d5a; width:26px; text-align:right;">EGO</span></div>
      </div>`;
    setupCanvas();
    updateHud();
  }

  function updateHud() {
    if (!S) return;
    const t = $("blkTurn"), sc = $("blkScore"), eg = $("blkEgo"), gl = $("blkGlow");
    const total = 6 + S.extra;
    if (t) t.textContent = (S.extra ? "GOL D'ORO " + S.extra + "/3" : "Turno " + Math.min(S.turn, 6) + "/6") + " · ⚡" + Math.round(S.guts);
    if (sc) sc.textContent = `LEO ${S.my} – ${S.opp}`;
    if (eg) eg.style.width = clamp(S.ego, 0, 100) + "%";
    if (gl) gl.style.display = S.ego >= 75 ? "block" : "none";
    void total;
  }

  function setupCanvas() {
    const cv = $("cageCv");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    cv.onclick = (e) => {
      if (!S) return;
      const rect = cv.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 320;
      const y = ((e.clientY - rect.top) / rect.height) * 200;
      if (S.phase === "aim") {
        S.aim.x = clamp(x, 70, 250);
        S.aim.y = clamp(y, 55, 145);
        S.aimIdx = -1;
        startTurnButtons();
      } else if (S.phase === "timing") {
        fireShot();
      }
    };
    stopLoop();
    animId = requestAnimationFrame(function loop(now) {
      if (!S || !$("cageCv")) { animId = null; return; }
      draw(ctx, now);
      animId = requestAnimationFrame(loop);
    });
  }

  function timingRange() { return 0.1 + 0.045 * S.up.prec; }

  function draw(ctx, now) {
    const boss = S.boss;
    ctx.clearRect(0, 0, 320, 200);
    // porta
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 50, 200, 100);
    ctx.strokeStyle = "rgba(0,229,255,0.15)";
    ctx.lineWidth = 1;
    for (let x = 60; x <= 260; x += 15) { ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x, 150); ctx.stroke(); }
    for (let y = 50; y <= 150; y += 15) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(260, y); ctx.stroke(); }

    const defending = S.phase === "def" || S.phase === "defshot";
    // portiere (in attacco: avversario che pattuglia; in difesa: Nico)
    if (S.phase === "aim" || S.phase === "timing") {
      S.keeperX += boss.gkSpeed * 0.7 * S.keeperDir;
      if (S.keeperX > 225) S.keeperDir = -1;
      if (S.keeperX < 95) S.keeperDir = 1;
      S.keeperY = 105;
    }
    if (S.anim) {
      const a = S.anim;
      const p = Math.min(1, (now - a.t0) / a.dur);
      const e = 1 - Math.pow(1 - p, 2);
      S.ball = { x: a.bx0 + (a.bx1 - a.bx0) * p, y: a.by0 + (a.by1 - a.by0) * p, r: Math.max(6, 12 - 6 * p), flame: a.flame };
      S.keeperX = a.kx0 + (a.kx1 - a.kx0) * e;
      S.keeperY = a.ky0 + (a.ky1 - a.ky0) * e;
      if (p >= 1) { const cb = a.done; S.anim = null; if (cb) cb(); }
    }
    const kcol = defending ? "#4cc9f0" : boss.color;
    const klab = defending ? "Nico" : boss.gkName;
    const kx = S.keeperX, ky = S.keeperY;
    ctx.fillStyle = kcol;
    ctx.beginPath(); ctx.arc(kx, ky - 4, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(kx - 11, ky + 8, 22, 26);
    ctx.fillStyle = "#fff";
    ctx.fillRect(kx - 6, ky - 8, 4, 4);
    ctx.fillRect(kx + 2, ky - 8, 4, 4);
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(klab, kx, ky - 22);

    // mirino
    if (S.phase === "aim" || S.phase === "timing") {
      ctx.strokeStyle = S.ego >= 75 ? "#00e5ff" : "#ffd23f";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(S.aim.x, S.aim.y, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(S.aim.x - 14, S.aim.y); ctx.lineTo(S.aim.x + 14, S.aim.y);
      ctx.moveTo(S.aim.x, S.aim.y - 14); ctx.lineTo(S.aim.x, S.aim.y + 14);
      ctx.stroke();
    }
    // barra del tempismo
    if (S.phase === "timing") {
      const om = 0.0042 + 0.0006 * currentStage;
      S.cursor = 0.5 + 0.5 * Math.sin((now - S.timingT0) * om * 1.6);
      ctx.fillStyle = "rgba(6,11,24,0.85)"; ctx.fillRect(60, 166, 200, 14);
      const w = timingRange();
      ctx.fillStyle = "rgba(255,210,63,0.55)"; ctx.fillRect(60 + 200 * (0.5 - (w + 0.25) / 2), 166, 200 * (w + 0.25), 14);
      ctx.fillStyle = "#3ddc84"; ctx.fillRect(60 + 200 * (0.5 - w / 2), 166, 200 * w, 14);
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.strokeRect(60, 166, 200, 14);
      ctx.fillStyle = "#fff"; ctx.fillRect(60 + 200 * S.cursor - 2, 162, 4, 22);
      if (now - S.timingT0 > 3200) fireShot();
    }
    // suggerimento di difesa
    if (S.phase === "def" && S.defHint != null) {
      ctx.fillStyle = boss.color; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
      const arrows = ["◀◀ carica verso SINISTRA", "▲ carica al CENTRO", "carica verso DESTRA ▶▶"];
      ctx.fillText(S.readUsed ? "LETTURA: " + arrows[S.defReal] : arrows[S.defHint], 160, 168);
    }
    // palla
    if (S.ball && S.anim) {
      ctx.fillStyle = S.ball.flame ? "#00e5ff" : "#fff";
      ctx.beginPath(); ctx.arc(S.ball.x, S.ball.y, S.ball.r, 0, Math.PI * 2); ctx.fill();
      if (S.ball.flame) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(S.ball.x, S.ball.y, S.ball.r + 4, 0, Math.PI * 2); ctx.stroke(); }
    }
    if (S.msg && now < S.msg.until) {
      ctx.font = "bold 22px sans-serif"; ctx.textAlign = "center";
      ctx.lineWidth = 4; ctx.strokeStyle = "#000"; ctx.strokeText(S.msg.t, 160, 36);
      ctx.fillStyle = S.msg.c; ctx.fillText(S.msg.t, 160, 36);
    }
  }

  // la partita e' ancora a schermo? (se l'utente e' uscito col menu in alto, i timer non devono toccare altre schermate)
  function live(tk) {
    if (S === tk && $("cageCv")) return true;
    if (S === tk) { S = null; stopLoop(); }
    return false;
  }

  function flash(t, c) { if (S) S.msg = { t, c, until: performance.now() + 1500 }; }

  // ---------- ATTACCO ----------
  function startTurn() {
    if (!S) return;
    S.phase = "aim";
    S.anim = null; S.ball = null;
    S.keeperY = 105;
    updateHud();
    startTurnButtons();
  }

  function startTurnButtons() {
    if (!S) return;
    const egoOn = S.ego >= 75;
    const aimName = S.aimIdx >= 0 ? AIMS[S.aimIdx].n : "libera";
    showText(
      "Leo",
      `<b>${S.extra ? "GOL D'ORO " + S.extra + "/3" : "TURNO " + S.turn + "/6"} · ATTACCO</b> · Tocca la porta per mirare, poi scegli.<br>
      ${egoOn ? '<span style="color:#00e5ff; font-weight:bold;">Ego al massimo: Fiamme Nere disponibili!</span>' : "Ricorda: " + S.boss.gkName + " ama stare " + S.boss.fav.n + "."}`
    );
    showButtons([
      { label: "⚡ Tiro Personale", sub: "Barra del tempismo · +20 Ego, -15 Grinta", cls: "hot", fn: () => beginTiming("solo") },
      { label: "🤝 Sponda d'Intesa", sub: "Più sicura · -15 Ego, +20 Grinta", fn: () => doTeam() },
      { label: egoOn ? "🔥 FIAMME NERE" : "🔒 Fiamme Nere", sub: egoOn ? "Portiere quasi battuto · -35 Ego" : "Serve Ego 75%+", cls: egoOn ? "hot" : "", disabled: !egoOn, fn: () => beginTiming("ego") },
      {
        label: "🎯 Mira: " + aimName,
        sub: "Cambia bersaglio",
        fn: () => {
          S.aimIdx = (S.aimIdx + 1) % AIMS.length;
          S.aim = { x: AIMS[S.aimIdx].x, y: AIMS[S.aimIdx].y };
          startTurnButtons();
        }
      }
    ]);
  }

  function beginTiming(type) {
    if (!S || S.phase !== "aim") return;
    S.phase = "timing";
    S.pending = type;
    S.timingT0 = performance.now();
    showText("Leo", "<b>TEMPISMO!</b> Ferma la barra nella zona <span style='color:#3ddc84;font-weight:bold'>verde</span> (tocca la porta o il pulsante).");
    showButtons([{ label: "👟 TIRA ORA!", cls: "hot", fn: fireShot }], true);
  }

  function fireShot() {
    if (!S || S.phase !== "timing") return;
    const w = timingRange();
    const d = Math.abs(S.cursor - 0.5) * 2; // 0 = centro perfetto
    const q = d < w ? 1 : Math.max(0, 1 - (d - w) / 0.7);
    S.phase = "shot";
    showButtons([], true);
    attackResolve(S.pending, q);
  }

  function doTeam() {
    if (!S || S.phase !== "aim") return;
    S.phase = "shot";
    showButtons([], true);
    attackResolve("team", 1);
  }

  function attackResolve(type, q) {
    const boss = S.boss;
    S.shots[type]++;
    // il portiere sceglie dove tuffarsi
    const r = Math.random();
    let dive;
    if (r < boss.read) dive = { x: S.aim.x + rnd(-16, 16), y: S.aim.y + rnd(-10, 10) };
    else if (r < boss.read + boss.favP) dive = { x: boss.fav.x, y: boss.fav.y };
    else dive = { x: S.keeperX, y: 105 };
    let R = 28 + boss.gkSpeed * 4 - S.up.pot * 3;
    let target;
    let flame = false;
    let teamCut = false;
    if (type === "team") {
      const teamBonus = S.lean === "team" ? 0.7 : 1; // mentalità di squadra: la sponda trova spazi migliori
      let best = null;
      for (let i = 0; i < 3; i++) {
        const c = { x: rnd(80, 240), y: rnd(65, 140) };
        const dd = dist(c.x, c.y, dive.x, dive.y);
        if (!best || dd > best.d) best = { c, d: dd };
      }
      target = { x: best.c.x + rnd(-8, 8) * teamBonus, y: best.c.y + rnd(-8, 8) * teamBonus };
      teamCut = Math.random() < (S.lean === "team" ? 0.12 : 0.22); // il difensore taglia la linea di passaggio
      S.ego = Math.max(0, S.ego - 15);
      S.guts = Math.min(100, S.guts + 20);
    } else {
      let noise = (1 - q) * 58 + (S.guts < 25 ? 18 : 0);
      if (type === "ego") {
        flame = true;
        noise *= 0.3;
        R *= boss.id === "alter" ? 0.7 : 0.4;
        S.ego = Math.max(0, S.ego - 35);
        if (window.triggerAnimeCutin) { try { window.triggerAnimeCutin({ who: "Leo Moretti", shotName: "TIRO DELL'EGO · FIAMME NERE", isEgo: true, sfxWord: "DOOOM!" }); } catch (e) {} }
      } else {
        S.ego = Math.min(100, S.ego + 20);
        S.guts = Math.max(0, S.guts - 15);
      }
      const ang = Math.random() * Math.PI * 2, rad = Math.random() * noise;
      target = { x: S.aim.x + Math.cos(ang) * rad, y: S.aim.y + Math.sin(ang) * rad };
    }
    S.lastAimSide = S.aim.x < 130 ? 0 : S.aim.x > 190 ? 2 : 1;
    const inFrame = target.x > 60 && target.x < 260 && target.y > 50 && target.y < 150;
    let outcome;
    if (!inFrame) outcome = target.x > 52 && target.x < 268 && target.y > 42 && target.y < 158 ? "palo" : "fuori";
    else outcome = dist(dive.x, dive.y, target.x, target.y) < R ? "parata" : "gol";
    if (teamCut) outcome = "intercetto";
    if (type === "ego" && outcome === "parata" && Math.random() < 0.5) outcome = "gol"; // le Fiamme Nere scavalcano anche le mani
    const dur = flame ? 520 : 650;
    S.anim = {
      t0: performance.now(), dur,
      bx0: 160, by0: 190, bx1: clamp(target.x, 30, 290), by1: clamp(target.y, 30, 170), flame,
      kx0: S.keeperX, ky0: S.keeperY, kx1: dive.x, ky1: dive.y,
      done: () => attackResult(type, outcome, q)
    };
    updateHud();
  }

  function attackResult(type, outcome, q) {
    if (!S) return;
    const boss = S.boss;
    if (outcome === "gol") {
      S.my++;
      S.statGoals++;
      flash("GOOOL!", "#00e5ff");
      if (window.toast) window.toast("GOOOL NELLA GABBIA!", "goal", "🔥");
      showText("arbitro", `<b style="color:#00e5ff; font-size:16px;">GOOOL!</b> ${type === "ego" ? "Le Fiamme Nere divorano la rete!" : type === "team" ? "La sponda apre il varco, Leo la mette dentro!" : q >= 1 ? "Tempismo perfetto, un tiro da manuale!" : "Non pulito, ma entra!"}`);
    } else if (outcome === "parata") {
      flash("PARATA!", "#ffd23f");
      showText("arbitro", `<b>PARATO!</b> ${boss.gkName} ci arriva con un balzo e toglie il pallone dall'angolo.`);
    } else if (outcome === "intercetto") {
      flash("INTERCETTATA!", "#ff9f43");
      showText("arbitro", `<b>INTERCETTATA!</b> Il difensore taglia la linea di passaggio: la sponda non arriva. Con l'Intesa alta succede meno.`);
    } else if (outcome === "palo") {
      flash("PALO!", "#ff9f43");
      showText("arbitro", `<b>PALO!</b> Il pallone bacia il ferro e torna in campo. Tempismo da affinare.`);
    } else {
      flash("FUORI!", "#ff4d5a");
      showText("arbitro", `<b>FUORI!</b> Il tiro sfila alto sulla rete metallica. ${q < 0.4 ? "Hai fermato la barra fuori tempo." : ""}`);
    }
    updateHud();
    S.phase = "idle";
    const tk = S;
    setTimeout(() => { if (live(tk)) startDefense(); }, 1500);
  }

  // ---------- DIFESA ----------
  function bossDir() {
    const b = S.boss;
    const pick = (w) => { const r = Math.random() * (w[0] + w[1] + w[2]); return r < w[0] ? 0 : r < w[0] + w[1] ? 1 : 2; };
    if (b.atk === "centro") return pick([0.2, 0.6, 0.2]);
    if (b.atk === "lati") return pick([0.45, 0.1, 0.45]);
    if (b.atk === "angoli") return pick([0.4, 0.2, 0.4]);
    if (b.atk === "alterna") return S.lastBossSide === 0 ? 2 : S.lastBossSide === 2 ? 0 : (Math.random() < 0.5 ? 0 : 2);
    if (b.atk === "specchio") return Math.random() < 0.8 ? S.lastAimSide : pick([0.34, 0.32, 0.34]);
    return 1;
  }

  function startDefense() {
    if (!S) return;
    const boss = S.boss;
    S.phase = "def";
    S.keeperX = 160; S.keeperY = 105;
    S.defReal = bossDir();
    S.defHint = Math.random() < boss.bluff ? ([0, 1, 2].filter((x) => x !== S.defReal)[Math.floor(Math.random() * 2)]) : S.defReal;
    S.readUsed = false;
    updateHud();
    defButtons();
  }

  function defButtons() {
    if (!S) return;
    const boss = S.boss;
    const txt = ["verso la tua SINISTRA", "dritto per dritto, al CENTRO", "verso la tua DESTRA"];
    showText(
      boss.name,
      `<b>DIFESA</b> · «${boss.special}!»<br>${S.readUsed ? "Hai letto il gioco: <b>caricherà " + txt[S.defReal] + "</b>." : "Sembra caricare " + txt[S.defHint] + (boss.bluff >= 0.4 ? "... ma è un bluff?" : ".")}`
    );
    const list = [
      { label: "◀ Tuffo a sinistra", fn: () => defend(0) },
      { label: "▲ Resta al centro", fn: () => defend(1) },
      { label: "Tuffo a destra ▶", fn: () => defend(2) }
    ];
    if (!S.readUsed) {
      list.push({ label: "🧠 Leggi il gioco", sub: "-20 Grinta · direzione sicura", disabled: S.guts < 20, fn: () => { S.guts -= 20; S.readUsed = true; updateHud(); defButtons(); } });
    } else {
      list.push({ label: "🧠 Letto", disabled: true });
    }
    showButtons(list);
  }

  function defend(choice) {
    if (!S || S.phase !== "def") return;
    S.phase = "defshot";
    showButtons([], true);
    const real = S.defReal;
    const zoneX = [95, 160, 225];
    const diff = Math.abs(choice - real);
    let saved = diff === 0 ? true : diff === 1 ? Math.random() < 0.28 + 0.12 * S.up.rif : false;
    if (S.boss.id === "alter" && diff === 0 && Math.random() < 0.12) saved = false; // l'Ombra, ogni tanto, ti sorprende
    S.lastBossSide = real;
    S.anim = {
      t0: performance.now(), dur: 650,
      bx0: 160, by0: 190, bx1: zoneX[real] + (saved ? 0 : rnd(-6, 6)), by1: 100 + rnd(-15, 20), flame: false,
      kx0: 160, ky0: 105, kx1: saved ? zoneX[real] : zoneX[choice], ky1: 105,
      done: () => defResult(saved)
    };
  }

  function defResult(saved) {
    if (!S) return;
    const boss = S.boss;
    S.guts = Math.min(100, S.guts + 3);
    if (saved) {
      flash("PARATA DI NICO!", "#4cc9f0");
      showText("Nico", `«Col cavolo che passa! Questa gabbia è mia!»<br>Nico respinge ${boss.name.split(" ")[0]} a pugni chiusi.`);
    } else {
      S.opp++;
      flash("GOL LORO", "#ff4d5a");
      if (window.toast) window.toast(`GOL DI ${boss.name.toUpperCase()}!`, "warn", "⚡");
      showText(boss.name, `«${boss.special}!»<br>Il tiro schianta contro la rete: Nico si era tuffato dalla parte sbagliata.`);
    }
    updateHud();
    S.phase = "idle";
    const tk = S;
    setTimeout(() => { if (live(tk)) nextTurn(); }, 1600);
  }

  function nextTurn() {
    if (!S) return;
    if (S.extra === 0) {
      S.turn++;
      if (S.turn > 6) {
        if (S.my !== S.opp) return endMatch();
        S.extra = 1;
        showText("arbitro", "<b>PAREGGIO!</b> La Gabbia non ammette pareggi: <b>gol d'oro</b>. Chi segna per primo vince.");
        const tk = S;
        setTimeout(() => { if (live(tk)) startTurn(); }, 1400);
        return;
      }
      return startTurn();
    }
    // gol d'oro: ogni turno extra e' un'azione completa; decide chi e' in vantaggio
    if (S.my !== S.opp || S.extra >= 3) return endMatch();
    S.extra++;
    startTurn();
  }

  // ---------- FINE ----------
  function endMatch() {
    if (!S) return;
    stopLoop();
    const boss = S.boss;
    const won = S.my > S.opp;
    const my = S.my, opp = S.opp, goals = S.statGoals;
    const shots = S.shots;
    const p = getProg();
    p.pts = Math.min(999, p.pts + goals + (won ? 2 : 0));
    const rec = getBLRecord();
    rec.bestEgo = Math.max(rec.bestEgo, Math.round(S.ego));
    S = null;
    renderHubBanner();

    if (!won) {
      saveBLRecord(rec);
      saveProg(p);
      showText(boss.name, `«Questa gabbia non perdona chi esita. Torna ad allenarti coi gabbiani, Moretti!»<br><b>SCONFITTA ${my} – ${opp}.</b> Hai guadagnato ${goals} Punti Fame: spendili in allenamento e riprova.`);
      showButtons([
        { label: "🔄 Riprova", cls: "hot", fn: briefing },
        { label: "🏋️ Allenamento", sub: p.pts + " Punti Fame", fn: showTraining },
        { label: "◂ Torna alla Gabbia", cls: "pick", fn: showHub }
      ]);
      return;
    }

    const id = "r" + currentStage;
    let coins = 1;
    if (!p.paid.includes(id)) { p.paid.push(id); coins = 2; }
    p.stage = Math.max(p.stage, currentStage + 1);
    rec.highStage = Math.max(rec.highStage, currentStage + 1);

    if (currentStage >= BOSSES.length - 1) {
      // finale: dipende da come hai giocato la scalata
      rec.won++;
      const egoish = p.run.ego * 2 + shots.ego * 2 + shots.solo;
      const teamish = p.run.team * 2 + shots.team * 2;
      let ending, title, body;
      if (egoish > teamish * 1.6) {
        ending = "ego";
        title = "👑 IL PREDATORE SENZA PADRONE";
        body = "Hai divorato ogni porta. L'Ombra si dissolve ringhiando: «Hai vinto da solo.» Ed è vero: gli spalti sono vuoti, il pallone è tuo, il silenzio pure. Il mondo ti guarda con paura e un pizzico di invidia. Nico ti passa una focaccia in silenzio. Forse è il tuo unico amico rimasto.";
      } else if (teamish > egoish * 1.6) {
        ending = "team";
        title = "🤝 LA RONDINE CHE PASSA";
        body = "Hai battuto il tuo Ego con le sponde di chi ti sta accanto. L'Ombra, spiazzata, ti chiede: «Perché non hai tirato tu?» Tommy risponde per te: «Perché è più bello in tre.» Fuori dalla Gabbia ti aspettano tutti, e hanno portato la focaccia.";
      } else {
        ending = "balance";
        title = "⚖️ LA RONDINE IN EQUILIBRIO";
        body = "Egoista quando serviva, compagno quando contava: l'Ombra non sa più cosa copiare. «Non puoi essere entrambi», sibila. «Guardami», risponde Leo. Il mondo del calcio ha un nuovo tipo di predatore, che sa anche aspettare il passaggio.";
      }
      p.endings[ending] = (p.endings[ending] || 0) + 1;
      const first = !p.paid.includes("final");
      if (first) { p.paid.push("final"); coins = 12; } else coins = 3;
      saveBLRecord(rec);
      saveProg(p);
      reward(coins);
      showText("voce", `<b style="color:var(--gold); font-size:17px;">${title}</b><br>${body}<br><i>Finale ${Object.keys(p.endings).length}/3 scoperto${first ? " · ricompensa: +" + coins + " monete" : ""}.</i>`);
      showButtons([
        { label: "🔄 Nuova scalata", sub: "Prova un altro finale", cls: "hot", fn: () => { const q = getProg(); q.stage = 0; q.run = { ego: 0, team: 0 }; saveProg(q); currentStage = 0; showHub(); } },
        { label: "Trionfo & Menu", fn: leave }
      ]);
      return;
    }

    saveBLRecord(rec);
    saveProg(p);
    reward(coins);
    showText(
      boss.name,
      `<b>VITTORIA ${my} – ${opp}!</b> +${goals + 2} Punti Fame · +${coins} monete<br>«Sei forte, Moretti...»<br><i>${boss.after}</i>`
    );
    showButtons([
      { label: `Round ${currentStage + 2} ▸`, cls: "hot", fn: () => { currentStage++; showHub(); } },
      { label: "🏋️ Allenamento", sub: p.pts + " Punti Fame", fn: showTraining },
      { label: "◂ Torna alla Gabbia", cls: "pick", fn: showHub }
    ]);
  }

  window.openBlueLockMode = openBlueLockMode;
})();
