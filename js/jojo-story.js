// ================= JOJO: LE BIZZARRE AVVENTURE DEL BORGO =================
// Stand Soccer Battle · Campagna narrativa shonen a 5 atti con Stand, Hamon, Pose iconiche e ORA ORA rush!
(function () {
  "use strict";

  const K_JOJO = "ali-di-rondine.jojo-stand-v1";
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);

  // Inietta stili esclusivi JoJo (onomatopee manga Gogogo, menu viola/oro bizzarro, stand HUD)
  function injectJoJoStyles() {
    if (document.getElementById("jojoStyle")) return;
    const st = document.createElement("style");
    st.id = "jojoStyle";
    st.textContent = `
      .jojo-hud {
        position: absolute; top: 6px; left: 6px; right: 6px; z-index: 15;
        display: flex; justify-content: space-between; align-items: center; gap: 6px;
        background: rgba(22, 10, 36, 0.92); border: 2px solid #e040fb;
        box-shadow: 0 0 14px rgba(224, 64, 251, 0.45);
        border-radius: 8px; padding: 4px 8px; font-size: 11px; color: #fff;
      }
      .jojo-hud b { font-family: var(--display); color: #ffd23f; }
      .jojo-stand-bar {
        position: absolute; bottom: 4px; left: 8px; right: 8px; z-index: 15;
        background: rgba(14, 6, 26, 0.92); border: 1px solid #7c4dff;
        border-radius: 8px; padding: 3px 8px; display: flex; align-items: center; gap: 6px;
        font-size: 9px; font-weight: 800; color: #e1bee7; min-width: 0;
      }
      .jojo-stand-bar > span:first-child { flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
      .jojo-stand-row {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 10px; font-weight: 800; color: #e1bee7;
      }
      .jojo-meter {
        flex: 1 1 40px; height: 8px; margin: 0; background: #261138;
        border-radius: 4px; overflow: hidden; border: 1px solid #ba68c8;
      }
      .jojo-meter-fill {
        display: block; height: 100%; transition: width 0.25s ease;
      }
      .jojo-menace {
        position: absolute; font-family: 'Dela Gothic One', Impact, sans-serif;
        color: #e040fb; font-size: 24px; pointer-events: none; opacity: 0.85;
        text-shadow: 2px 2px 0 #000, 0 0 10px #7c4dff;
        animation: jojoFloat 1.2s infinite alternate ease-in-out;
      }
      @keyframes jojoFloat {
        0% { transform: translateY(0) scale(1) rotate(-5deg); }
        100% { transform: translateY(-8px) scale(1.1) rotate(5deg); }
      }
      .jojo-pose-cutin {
        position: absolute; inset: 0; z-index: 25; pointer-events: none;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: radial-gradient(circle, rgba(124, 77, 255, 0.5) 0%, rgba(22, 10, 36, 0.95) 80%);
        animation: jojoFlash 0.7s ease-out forwards;
      }
      @keyframes jojoFlash {
        0% { opacity: 0; transform: scale(0.9); }
        30% { opacity: 1; transform: scale(1.03); }
        100% { opacity: 1; transform: scale(1); }
      }
      .jojo-pose-title {
        font-family: var(--display); font-size: 26px; color: #ffd23f;
        text-shadow: 3px 3px 0 #b3202c, 0 0 15px #e040fb;
        text-align: center; letter-spacing: 2px;
      }
      body:has(#stageAlt.jojo-on:not([hidden])) #text { max-height: none; overflow: visible; }
      .jojo-quit {
        flex: none; font: 800 10px var(--display, sans-serif); color: #fff; background: #5b1030;
        border: 1px solid #ff5c8a; border-radius: 6px; padding: 5px 8px; min-height: 28px; cursor: pointer;
        white-space: nowrap;
      }
      .jojo-quit.sure { background: #d50000; border-color: #ffd23f; }
      .jojo-hud > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
      .jojo-pose-sub {
        font-size: 13px; font-weight: 800; color: #00e5ff;
        text-shadow: 1px 1px 0 #000; margin-top: 4px; text-transform: uppercase;
      }
    `;
    document.head.appendChild(st);
  }

  // Audio sintesi WebAudio: un solo AudioContext condiviso (creato al primo suono)
  let AUD = null;
  function audioCtx() {
    try {
      if (!AUD) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        AUD = new AC();
      }
      if (AUD.state === "suspended") AUD.resume();
      return AUD;
    } catch (e) { return null; }
  }

  function playJoJoSfx(type) {
    if (typeof window.hapticTrigger === "function") {
      try {
        if (type === "ora" || type === "goal") window.hapticTrigger("goal");
        else if (type === "time_stop") window.hapticTrigger("special");
        else window.hapticTrigger("kick");
      } catch (e) {}
    }
    try {
      const ctx = audioCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const tone = (wave, f0, f1, v, dur, lin) => {
        osc.type = wave;
        osc.frequency.setValueAtTime(f0, t);
        if (lin) osc.frequency.linearRampToValueAtTime(f1, t + dur * 0.8);
        else osc.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
        gain.gain.setValueAtTime(v, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + dur);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      };
      if (type === "ora") tone("sawtooth", 320, 80, 0.4, 0.08);
      else if (type === "time_stop") tone("sine", 140, 40, 0.5, 0.5);
      else if (type === "hamon") tone("triangle", 540, 880, 0.28, 0.3, true);
      else if (type === "stand_summon") tone("square", 220, 660, 0.3, 0.4);
      else if (type === "goal") tone("triangle", 400, 900, 0.3, 0.35, true);
      else tone("triangle", 220, 90, 0.3, 0.12);
    } catch (e) {}
  }

  // roundRect con fallback per browser vecchi
  function rrect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === "function") { ctx.roundRect(x, y, w, h, r); return; }
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Il protagonista: il Campione creato dall'utente, altrimenti Leo Moretti
  function heroInfo() {
    let h = null;
    try {
      const f = window.heroLoad || (window.__azHooks && window.__azHooks.heroLoad);
      if (typeof f === "function") h = f();
    } catch (e) {}
    const name = h && h.name ? String(h.name).replace(/[<>&"]/g, "").slice(0, 24) : "Leo Moretti";
    const first = name.split(/\s+/)[0] || "Leo";
    return { name, first, short: first.toUpperCase().slice(0, 8), custom: !!(h && h.name) };
  }
  const H = (str) => str.replace(/\{H\}/g, heroInfo().first).replace(/\{HF\}/g, heroInfo().name);

  // Nemici Stand User dei 5 Atti
  const STAND_BOSSES = [
    {
      act: 1,
      id: "dio_brando",
      user: "Lord Brando delle Rive",
      short: "BRANDO",
      stand: "THE WORLD DEL MOLO",
      title: "Parte 1: Il Vampiro dell'Antico Molo",
      lore: "Un sinistro nobile è approdato a Punta Rondine con una Maschera di Pietra Marina. Sostiene che il calcio del borgo sia debole e destinato a sottomettersi al suo Stand che congela il tempo!",
      preQuote: "«KONO BRANDO DA! Credi davvero che i tuoi passaggi possano superare il mio Regno Congelato, {H}?»",
      gkName: "The World (Riflesso)",
      color: "#ffd700",
      aura: "#ffe600",
      speed: 3.5,
      skill: 0.35,
      power: "TIME STOP (2s di fermo palla)",
      favZone: "centro",
      standCry: "MUDA MUDA MUDA!",
      rewardCoins: 20
    },
    {
      act: 2,
      id: "kars_pillar",
      user: "Santana & i Custodi della Scogliera",
      short: "SANTANA",
      stand: "PILLAR BLADE",
      title: "Parte 2: L'Uomo del Pilastro del Faro",
      lore: "Dalla Grotta delle Sirene si sono risvegliati gli Uomini del Pilastro. Usano l'elasticità corporea e l'assorbimento per intercettare qualsiasi traiettoria d'aria.",
      preQuote: "«I mortali di Borgo Marino giocano sull'erba... noi danziamo sulle lame della scogliera!»",
      gkName: "Santana Pillar",
      color: "#ff5722",
      aura: "#ff8a65",
      speed: 4.0,
      skill: 0.42,
      power: "FLEX BODY (Estensione mostruosa delle braccia)",
      favZone: "basso",
      standCry: "WHAAM! AWAKEN!",
      rewardCoins: 30
    },
    {
      act: 3,
      id: "kira_yoshi",
      user: "Kira del Baracchino",
      short: "KIRA",
      stand: "KILLER RONDINE",
      title: "Parte 3: La Bomba Silenziosa di Via Marina",
      lore: "Un individuo apparentemente tranquillo che vuole solo vivere in pace... trasformando ogni pallone che tocca nella prima bomba detonante a contatto!",
      preQuote: "«Voglio solo una vita tranquilla e un tiro perfetto all'incrocio. Ma chi mi ostacola fa click.»",
      gkName: "Killer Cat",
      color: "#ec407a",
      aura: "#f48fb1",
      speed: 4.3,
      skill: 0.49,
      power: "FIRST BOMB (Esplosione respingente)",
      favZone: "alto",
      standCry: "SHEER HEART ATTACK!",
      rewardCoins: 40
    },
    {
      act: 4,
      id: "diavolo_boss",
      user: "Il Boss Mascherato 'Diavolo'",
      short: "DIAVOLO",
      stand: "KING CRIMSON DEL GOLFO",
      title: "Parte 4: La Cancellazione del Tempo",
      lore: "Nessuno ha mai visto la sua faccia nella trattoria del porto. Cancella 5 secondi di traiettoria e prevede il futuro con Epitaph per far svanire i gol fatti!",
      preQuote: "«Ho già visto il punto in cui tirerai tramite Epitaph. Il tempo è stato appena cancellato!»",
      gkName: "King Crimson",
      color: "#d50000",
      aura: "#ff1744",
      speed: 4.8,
      skill: 0.56,
      power: "TIME ERASE (Cancella la traiettoria ideale)",
      favZone: "alterna",
      standCry: "EPITAPH PREDICTION!",
      rewardCoins: 50
    },
    {
      act: 5,
      id: "pucci_made",
      user: "Padre Enrico della Cappella del Molo",
      short: "DON ENRICO",
      stand: "MADE IN BORGO (ACCELERAZIONE)",
      title: "Parte 5 Finale: Il Paradiso della Rondine",
      lore: "La battaglia finale sul campo bagnato dalla burrasca. Il tempo del match accelera all'infinito: solo la determinazione di {H} e l'eredità Joestar della Rondine possono raggiungere la vittoria!",
      preQuote: "«Il destino ha già decretato chi alzerà la coppa. Credi nella gravità, {H}?»",
      gkName: "Made in Haven",
      color: "#00e5ff",
      aura: "#18ffff",
      speed: 5.3,
      skill: 0.63,
      power: "INFINITE SPEED (Traiettorie ipersoniche)",
      favZone: "specchio",
      standCry: "HALLELUJAH! ORA ORA ORA!",
      rewardCoins: 80
    }
  ];

  // Stand del Protagonista. Ogni Stand ha un perk distinto che cambia davvero il gioco:
  //   perfectWin  = ampiezza della zona "perfect" del tiro a tempo (0.22 base)
  //   perfectFree = il tiro perfect non si para mai
  //   curveSave   = moltiplicatore delle parate sui tiri a effetto
  //   parryTol    = pixel di tolleranza extra della parata difensiva
  //   parryFrom   = da che punto (0-1) del volo la parata è valida
  //   slice       = probabilità di "affettare" un gol avversario
  //   rushNeed    = pugni necessari per la Raffica
  const HERO_STANDS = [
    {
      id: "star_rondine",
      name: "STAR RONDINE",
      type: "Potenza & Precisione",
      user: "{HF}",
      cry: "ORA ORA ORA ORA ORA!",
      desc: "Raffica supersonica di colpi al pallone. Il tiro perfect non si para mai, la zona perfect è più larga e la Raffica richiede solo 7 pugni.",
      perk: "Perfect più largo e imparabile · Raffica da 7 pugni",
      color: "#7c4dff",
      perfectWin: 0.32, perfectFree: true, curveSave: 1, parryTol: 0, parryFrom: 0.55, slice: 0, rushNeed: 7
    },
    {
      id: "golden_gabbiano",
      name: "GOLDEN GABBIANO",
      type: "Vita & Curvatura",
      user: "Tommy & {H}",
      cry: "MUDA MUDA MUDA MUDA!",
      desc: "Dona vita alla traiettoria del pallone: devia a mezz'aria come uno stormo dorato. I tiri a effetto vengono parati il 70% in meno. Raffica da 9 pugni.",
      perk: "Tiri a effetto -70% parate · Raffica da 9 pugni",
      color: "#ffd700",
      perfectWin: 0.22, perfectFree: false, curveSave: 0.3, parryTol: 0, parryFrom: 0.55, slice: 0, rushNeed: 9
    },
    {
      id: "silver_trabucco",
      name: "SILVER TRABUCCO",
      type: "Spadaccino Difensivo",
      user: "Nico (Il Muro)",
      cry: "HORA HORA HORA!",
      desc: "Affetta i tiri avversari con riflessi d'acciaio: parata più larga e più anticipata, e il 30% dei gol subiti viene tagliato a metà strada. Raffica da 10 pugni.",
      perk: "Parata più larga e anticipata, 30% di tiri affettati · Raffica da 10 pugni",
      color: "#b0bec5",
      perfectWin: 0.22, perfectFree: false, curveSave: 1, parryTol: 18, parryFrom: 0.42, slice: 0.3, rushNeed: 10
    }
  ];

  // Salvataggio di avanzamento JoJo
  function loadProg() {
    try {
      const d = JSON.parse(localStorage.getItem(K_JOJO));
      if (d && typeof d === "object") {
        return {
          actCleared: Math.max(0, Math.min(5, d.actCleared || 0)),
          standLevel: Math.max(1, Math.min(5, d.standLevel || 1)),
          standExp: d.standExp || 0,
          currentStand: d.currentStand || "star_rondine",
          oraWins: d.oraWins || 0,
          posesUnlocked: Array.isArray(d.posesUnlocked) ? d.posesUnlocked : ["Giorno Pose", "Jotaro Point"],
          trophyJoJo: !!d.trophyJoJo
        };
      }
    } catch (e) {}
    return {
      actCleared: 0,
      standLevel: 1,
      standExp: 0,
      currentStand: "star_rondine",
      oraWins: 0,
      posesUnlocked: ["Giorno Pose", "Jotaro Point"],
      trophyJoJo: false
    };
  }

  function saveProg(p) {
    try {
      localStorage.setItem(K_JOJO, JSON.stringify(p));
    } catch (e) {}
  }

  // Stato Partita Stand
  let S = null;
  let onExitCb = null;
  let animFrameId = null;
  let dragging = false;
  let winListenersOn = false;
  const DEBUG = /[?&]debug/.test(location.search);

  // Esegue fn dopo ms solo se la partita è ancora la stessa (evita timer orfani dopo Abbandona)
  function later(fn, ms) {
    const mine = S;
    setTimeout(() => { if (S && S === mine) fn(); }, ms);
  }
  const addMeter = (n) => {
    if (!S) return;
    const k = n > 0 ? 1 + 0.2 * (S.lvl - 1) : 1;
    S.standMeter = clamp(S.standMeter + n * k, 0, 100);
    updateMatchHUD();
  };
  const rushNeed = () => Math.max(4, S.stand.rushNeed - Math.floor((S.lvl - 1) / 2));

  function stopMatchLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function activateJoJoStage() {
    if (window.setView) window.setView({ kind: "jojo" });
    const cv = $("cv");
    if (cv) cv.hidden = true;
    const alt = $("stageAlt");
    if (alt) {
      alt.classList.add("jojo-on");
      alt.hidden = false;
      alt.style.display = "block";
      alt.style.position = "absolute";
      alt.style.inset = "0";
      alt.style.width = "100%";
      alt.style.height = "100%";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
      alt.style.margin = "0";
      alt.style.padding = "0";
    }
    return alt;
  }

  // Avvio Hub JoJo
  function openJoJoAdventure(onBack) {
    injectJoJoStyles();
    onExitCb = onBack || null;
    showHub();
  }

  function showHub() {
    stopMatchLoop();
    S = null;
    const prog = loadProg();

    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0a2a 0%, #31114d 50%, #10061e 100%);"></div>
        <div class="jojo-menace" style="top:20px; left:25px;">ゴゴゴ</div>
        <div class="jojo-menace" style="top:45px; right:35px; font-size:32px;">ゴゴゴ</div>
        <div class="jojo-menace" style="bottom:70px; left:40px; font-size:20px;">ドドド</div>
        <div style="position:absolute; inset:0; background:radial-gradient(circle at center, rgba(224,64,251,0.2) 0%, transparent 70%); pointer-events:none;"></div>
        <div style="position:relative; z-index:2; padding:16px; text-shadow:0 2px 4px #000; box-sizing:border-box;">
          <div style="font-family:var(--display); font-size:18px; color:#ffd23f; letter-spacing:1px; text-shadow:2px 2px 0 #b3202c, 0 0 10px #e040fb;">
            ★ LE BIZZARRE AVVENTURE DI RONDINE FC ★
          </div>
          <div style="font-size:12px; font-weight:800; color:#e1bee7; margin-top:2px;">
            STAND SOCCER BATTLE · ATTO ${Math.min(5, prog.actCleared + 1)} DI 5
          </div>
          <div style="font-size:11px; color:#ba68c8; margin-top:3px;">
            Stand Attivo: <b style="color:#00e5ff;">${HERO_STANDS.find((s) => s.id === prog.currentStand)?.name || "STAR RONDINE"}</b> (Liv. ${prog.standLevel}) · Vittorie ORA: ${prog.oraWins}
          </div>
        </div>
      `;
    }

    const chap = $("chap");
    if (chap) chap.textContent = "JoJo's Bizarre Adventure · Borgo Stand";

    const textEl = $("text");
    if (textEl) {
      const curBoss = STAND_BOSSES[Math.min(4, prog.actCleared)];
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Jotaro & ${heroInfo().first}</span>
        <span class="t">
          <b>«Yare Yare Daze...»</b> Un'aura misteriosa avvolge il campo del Borgo: gli avversari hanno il potere degli <b>STAND</b>!
          Ferma la stirpe di Brando a suon di <em>ORA ORA ORA!</em><br>
          <span style="color:#ffd23f;">Prossimo: <b>${curBoss.user}</b> (${curBoss.stand})</span>
        </span>
      `;
    }

    const nextBossIdx = Math.min(4, prog.actCleared);
    const boss = STAND_BOSSES[nextBossIdx];
    const isCompleted = prog.actCleared >= 5;

    const btns = [
      {
        label: isCompleted ? `★ Rigioca Finale: ${boss.user}` : `★ ATTO ${nextBossIdx + 1}: ${boss.user}`,
        sub: `${boss.stand} · ${boss.power}`,
        cls: "hot",
        fn: () => startStoryBriefing(nextBossIdx)
      },
      {
        label: "🔮 Cambia Stand del Campione",
        sub: `Seleziona: Star Rondine / Golden Gabbiano / Silver Trabucco`,
        fn: showStandSelection
      },
      {
        label: "🥋 Pose Iconiche & Hamon",
        sub: `Migliora il livello Stand (Attuale: Liv. ${prog.standLevel})`,
        fn: showPoseTraining
      },
      {
        label: "📜 Regole & Poteri Stand",
        sub: "Come funzionano Time Stop, Fiamme Viola e Raffica ORA",
        fn: showJoJoGuide
      }
    ];

    if (prog.actCleared > 0) {
      btns.push({
        label: "🔄 Seleziona Atto Precedente",
        sub: "Rigioca una delle battaglie superate",
        fn: showStageSelect
      });
    }

    if (DEBUG) {
      btns.push({
        label: "🐞 Debug: salta Atto",
        sub: "Segna come superato l'atto corrente (senza monete)",
        fn: () => { const q = loadProg(); q.actCleared = Math.min(5, q.actCleared + 1); if (q.actCleared >= 5) q.trophyJoJo = true; saveProg(q); showHub(); }
      });
    }

    btns.push({
      label: "◂ Torna al Menu",
      cls: "pick",
      fn: () => {
        stopMatchLoop();
        const alt0 = $("stageAlt");
        if (alt0) alt0.classList.remove("jojo-on");
        if (window.setView) window.setView({ kind: "scene", bg: "title" });
        if (window.closeAltStage) window.closeAltStage();
        const alt2 = $("stageAlt");
        if (alt2) { alt2.hidden = true; alt2.style.display = "none"; alt2.innerHTML = ""; }
        const cv2 = $("cv");
        if (cv2) cv2.hidden = false;
        if (typeof onExitCb === "function") onExitCb();
        else if (window.title) window.title();
      }
    });

    renderButtons(btns);
  }

  function renderButtons(list, one) {
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

  function showStandSelection() {
    const prog = loadProg();
    const curStand = HERO_STANDS.find((s) => s.id === prog.currentStand) || HERO_STANDS[0];
    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #120822 0%, #2a0845 60%, #0d0519 100%);"></div>
        <div class="jojo-menace" style="top:15px; right:20px; font-size:28px;">ゴゴゴ</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="color:#ba68c8; font-size:11px; font-weight:800; text-transform:uppercase;">STAND ATTUALMENTE RISVEGLIATO</div>
          <div style="font-family:var(--display); font-size:22px; color:${curStand.color}; text-shadow:2px 2px 0 #000, 0 0 12px ${curStand.color};">${curStand.name}</div>
          <div style="color:#ffd23f; font-size:12px; font-weight:800; margin-top:2px;">Grido di battaglia: ${curStand.cry}</div>
          <div style="color:#e1bee7; font-size:11px; margin-top:4px;">${curStand.perk}</div>
        </div>
      `;
    }

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Freccia Stand</span>
        <span class="t">
          Scegli lo Stand da schierare. Ognuno cambia davvero il gioco.<br>
          <b>${curStand.name}</b>: ${curStand.desc}
        </span>
      `;
    }

    const btns = HERO_STANDS.map((st) => ({
      label: (st.id === prog.currentStand ? "✓ " : "") + st.name,
      sub: `${st.type} · ${st.perk}`,
      cls: st.id === prog.currentStand ? "hot" : "",
      fn: () => {
        prog.currentStand = st.id;
        saveProg(prog);
        playJoJoSfx("stand_summon");
        if (window.toast) window.toast(`Stand risvegliato: ${st.name}!`, "goal", "★");
        showStandSelection();
      }
    }));

    btns.push({ label: "◂ Torna all'Hub", cls: "pick", fn: showHub });
    renderButtons(btns);
  }

  function showPoseTraining() {
    const prog = loadProg();
    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #2b1055 0%, #4c1d95 50%, #1e0b36 100%);"></div>
        <div class="jojo-menace" style="top:20px; left:20px; font-size:32px;">ドドド</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="color:#ffd23f; font-size:12px; font-weight:800; text-transform:uppercase;">DOJO DELLE POSE & HAMON</div>
          <div style="font-family:var(--display); font-size:22px; color:#e040fb; text-shadow:2px 2px 0 #000;">ENERGIA SPIRITUALE LIV. ${prog.standLevel}</div>
          <div style="color:#00e5ff; font-size:12px; font-weight:700; margin-top:2px;">Bonus carica Stand: +${(prog.standLevel - 1) * 20}% · Monete: ${typeof window.bCoins === "function" ? window.bCoins() : 0}</div>
        </div>
      `;
    }

    const textEl = $("text");
    const cost = prog.standLevel * 25;
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#ffd23f; color:#0e1424; font-weight:800;">Pose Master Caesar</span>
        <span class="t">
          <b>IL RESPIRO DELL'HAMON E LE POSE PLASTICHE!</b><br>
          Livello Stand: <b>Liv. ${prog.standLevel}</b> · ricarica energia +${(prog.standLevel - 1) * 20}%, energia iniziale più alta e Raffica più facile (-1 pugno ogni 2 livelli).<br>
          <i>«Assumi una posa ad angolo retto con la schiena arcuata e grida la tua determinazione!»</i>
        </span>
      `;
    }

    const btns = [
      {
        label: prog.standLevel >= 5 ? "✨ Meditazione Hamon · Livello massimo" : `✨ Meditazione Hamon · Sblocca Posa (Liv. ${prog.standLevel + 1})`,
        sub: prog.standLevel >= 5 ? "Livello massimo raggiunto" : `Costo: ${cost} Monete · Più energia e Raffica più facile`,
        cls: "hot",
        disabled: prog.standLevel >= 5,
        fn: () => {
          // monete reali del Borgo (esposte da game.js)
          const coins = typeof window.bCoins === "function" ? Number(window.bCoins()) || 0 : 0;
          if (typeof window.addCoins !== "function" || coins < cost) {
            if (window.toast) window.toast(`Monete insufficienti! Ti servono ${cost} monete del Borgo (ne hai ${coins}).`, "warn", "🪙");
            return;
          }
          if (prog.standLevel >= 5) return;
          window.addCoins(-cost);

          prog.standLevel++;
          prog.posesUnlocked.push(`Posa Divina Liv.${prog.standLevel}`);
          saveProg(prog);
          playJoJoSfx("hamon");
          triggerJoJoPose("STAND POWER UP!", "AURA SPIRITUALE ELEVATA AL MASSIMO!");
          if (window.toast) window.toast(`Livello Stand potenziato a ${prog.standLevel}!`, "goal", "⚡");
          showPoseTraining();
        }
      },
      {
        label: "◂ Torna all'Hub",
        cls: "pick",
        fn: showHub
      }
    ];

    renderButtons(btns);
  }

  function showJoJoGuide() {
    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #10061e 0%, #1b0a2a 60%, #31114d 100%);"></div>
        <div class="jojo-menace" style="bottom:20px; right:20px; font-size:28px;">ゴゴゴ</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="font-family:var(--display); font-size:20px; color:#ffd23f; text-shadow:2px 2px 0 #b3202c;">REGOLE DEL COMBATTIMENTO STAND</div>
          <div style="color:#e1bee7; font-size:12px; margin-top:4px;">Punta alla porta, para i loro tiri, carica la barra e sorprendi i boss con la Raffica ORA!</div>
        </div>
      `;
    }

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#e040fb; color:#fff; font-weight:800;">Grimorio Stand</span>
        <span class="t">
          <b>GUIDA AL COMBATTIMENTO STAND</b><br>
          • <b>TURNI</b>: ogni turno tiri tu e poi para. Dopo 5 turni, se è pari, c'è un supplementare e poi i rigori.<br>
          • <b>TIRO</b>: mira, poi premi il pulsante quando il cursore è al centro (solo il pulsante, non lo schermo).<br>
          • <b>PARATA</b>: sposta lo scudo sotto il tiro avversario e premi PARATA quando il cerchio è vicino. Se non pari, è gol per loro!<br>
          • <b>BARRA STAND</b>: si riempie segnando e parando. Al 70% c'è il Time Stop, al 100% la <b>RAFFICA ORA</b>: tocca veloce lo schermo per sferrare i pugni.<br>
          • <b>ABBANDONA</b>: in partita il pulsante in alto a destra riporta all'hub (tocca due volte).<br>
          • <b>VITTORIA FINALE</b>: sconfiggi Padre Pucci all'Atto 5 per il titolo <em>Campione dei Portatori di Stand</em>. Le monete si vincono solo alla prima vittoria di ogni atto.
        </span>
      `;
    }
    renderButtons([{ label: "◂ Ho capito!", cls: "pick", fn: showHub }], true);
  }

  function showStageSelect() {
    const prog = loadProg();
    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0a2a 0%, #31114d 50%, #10061e 100%);"></div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="font-family:var(--display); font-size:20px; color:#ffd23f; text-shadow:2px 2px 0 #b3202c;">ARCHIVIO DEGLI ATTI SUPERATI</div>
          <div style="color:#e1bee7; font-size:12px; margin-top:4px;">Seleziona un boss già affrontato per rivivere la sfida con il tuo Stand potenziato.</div>
        </div>
      `;
    }

    const btns = [];
    for (let i = 0; i <= Math.min(4, prog.actCleared); i++) {
      const b = STAND_BOSSES[i];
      btns.push({
        label: `Atto ${i + 1}: ${b.user}`,
        sub: i < prog.actCleared ? `${b.stand} · già superato (niente monete)` : b.stand,
        fn: () => startStoryBriefing(i)
      });
    }
    btns.push({ label: "◂ Torna all'Hub", cls: "pick", fn: showHub });
    renderButtons(btns);
  }

  // Briefing narrativo Atto
  function startStoryBriefing(bossIndex) {
    const boss = STAND_BOSSES[bossIndex];
    const prog = loadProg();
    const stand = HERO_STANDS.find((s) => s.id === prog.currentStand) || HERO_STANDS[0];

    const alt = activateJoJoStage();
    if (alt) {
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0a2a 0%, #31114d 50%, #10061e 100%);"></div>
        <div class="jojo-menace" style="top:25px; left:20px;">ゴゴゴ</div>
        <div class="jojo-menace" style="top:30px; right:20px;">ドドド</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="color:#e040fb; font-weight:800; font-size:12px; text-transform:uppercase;">INCONTRO CON L'UTENTE STAND</div>
          <div style="font-family:var(--display); font-size:22px; color:#ffd23f; text-shadow:2px 2px 0 #b3202c;">${boss.user}</div>
          <div style="color:#00e5ff; font-weight:700; font-size:13px; margin-top:2px;">Stand: ${boss.stand} (${boss.power})</div>
        </div>
      `;
    }

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#d50000; color:#fff; font-weight:800;">${boss.user}</span>
        <span class="t">
          <b>${H(boss.preQuote)}</b><br>
          ${H(boss.lore)}
        </span>
      `;
    }

    renderButtons([
      {
        label: "★ SFIDA CON LO STAND!",
        sub: `Schiera ${stand.name} vs ${boss.stand}`,
        cls: "hot",
        fn: () => {
          playJoJoSfx("stand_summon");
          triggerJoJoPose(stand.name, "ATTIVA IL POTERE STAND!", () => {
            initMatchState(bossIndex);
          });
        }
      },
      {
        label: "◂ Torna indietro",
        cls: "pick",
        fn: showHub
      }
    ]);
  }

  // Posa anime JoJo con animazione cinematografica a schermo
  function triggerJoJoPose(title, subtitle, cb) {
    const alt = $("stageAlt");
    if (!alt) {
      if (cb) cb();
      return;
    }
    const poseBox = document.createElement("div");
    poseBox.className = "jojo-pose-cutin";
    poseBox.innerHTML = `
      <div class="jojo-menace" style="top:10px; left:15px; font-size:36px;">ゴゴゴ</div>
      <div class="jojo-menace" style="bottom:15px; right:15px; font-size:36px;">ドドド</div>
      <div class="jojo-pose-title">${title}</div>
      <div class="jojo-pose-sub">${subtitle}</div>
    `;
    alt.appendChild(poseBox);
    playJoJoSfx("ora");

    setTimeout(() => {
      try { poseBox.remove(); } catch (e) {}
      if (cb) cb();
    }, 750);
  }

  // Inizializzazione Partita Stand
  function initMatchState(bossIndex) {
    const boss = STAND_BOSSES[bossIndex];
    const prog = loadProg();
    const stand = HERO_STANDS.find((s) => s.id === prog.currentStand) || HERO_STANDS[0];

    S = {
      bossIdx: bossIndex,
      boss: boss,
      stand: stand,
      lvl: prog.standLevel,
      turn: 1,
      maxTurns: 5,
      pen: null,
      myScore: 0,
      oppScore: 0,
      standMeter: Math.min(90, 45 + (prog.standLevel - 1) * 10),
      phase: "aim", // aim, timing, ora_rush, time_stop, def_charge, def_parry, anim, pen_shoot, pen_def
      aimX: 160,
      aimY: 95,
      curveOffset: 0,
      shotType: "normal",
      keeperX: 160,
      keeperY: 100,
      keeperDir: 1,
      rushClicks: 0,
      rushTimer: 0,
      cursor: 0,
      cursorDir: 1,
      timeStopRemaining: 0,
      timeStopActive: false,
      defShieldX: 160,
      defBall: null,
      parryLock: 0,
      ball: null,
      anim: null,
      shake: 0,
      particles: [],
      fx: [],
      menaceRunes: [
        { x: 38, y: 30, text: "ゴゴゴ", rot: -0.1 },
        { x: 268, y: 38, text: "ドドド", rot: 0.15 },
        { x: 24, y: 135, text: "ゴゴ", rot: -0.05 },
        { x: 282, y: 142, text: "ズズズ", rot: 0.1 }
      ]
    };

    setupMatchDOM();
    startTurn();
  }

  // Abbandona: torna all'hub senza ricaricare la pagina
  function abandonMatch() {
    stopMatchLoop();
    dragging = false;
    S = null;
    showHub();
  }

  function setupMatchDOM() {
    const alt = activateJoJoStage();
    if (!alt) return;
    alt.style.display = "block";

    alt.innerHTML = `
      <div class="jojo-hud">
        <span>T <b id="jTurn">1/5</b></span>
        <span><b>${heroInfo().short}</b> <b id="jScore" style="color:#00e5ff;">0 – 0</b> <b style="color:#ff1744;" id="jBossName">${S.boss.short}</b></span>
        <button type="button" class="jojo-quit" id="jQuit" aria-label="Abbandona la partita">✕ Abbandona</button>
      </div>
      <canvas id="jojoCv" width="320" height="200" style="display:block; width:100%; height:100%; touch-action:none; user-select:none; -webkit-user-select:none;"></canvas>
      <div class="jojo-stand-bar">
        <span>LV.${S.lvl} ${S.stand.name}</span>
        <div class="jojo-meter">
          <i class="jojo-meter-fill" id="jMeterFill" style="width:45%; background:linear-gradient(90deg, #7c4dff, #e040fb 70%, #ffd23f 100%);"></i>
        </div>
        <span id="jMeterVal">45%</span>
      </div>
    `;

    const quit = $("jQuit");
    if (quit) {
      let armed = 0;
      quit.onclick = () => {
        const now = performance.now();
        if (armed && now - armed < 2500) { abandonMatch(); return; }
        armed = now;
        quit.classList.add("sure");
        quit.textContent = "Sicuro? Tocca ancora";
        setTimeout(() => {
          if (armed === now && quit.isConnected) { armed = 0; quit.classList.remove("sure"); quit.textContent = "✕ Abbandona"; }
        }, 2500);
      };
    }

    const cv = $("jojoCv");
    if (cv) {
      const getCvCoords = (e) => {
        const rect = cv.getBoundingClientRect();
        const t0 = e.touches && e.touches[0] ? e.touches[0] : e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : null;
        const clientX = e.clientX !== undefined ? e.clientX : (t0 ? t0.clientX : 0);
        const clientY = e.clientY !== undefined ? e.clientY : (t0 ? t0.clientY : 0);
        return {
          x: clamp(((clientX - rect.left) / rect.width) * 320, 10, 310),
          y: clamp(((clientY - rect.top) / rect.height) * 200, 10, 190)
        };
      };

      const handlePointerDown = (e) => {
        if (!S) return;
        const pt = getCvCoords(e);
        dragging = true;

        if (S.phase === "aim") {
          S.aimX = clamp(pt.x, 65, 255);
          S.aimY = clamp(pt.y, 45, 140);
          playJoJoSfx("hamon");
          spawnParticles(S.aimX, S.aimY, "#ffd23f", 6);
          updateAimButtons();
        } else if (S.phase === "time_stop") {
          S.aimX = clamp(pt.x, 65, 255);
          S.aimY = clamp(pt.y, 45, 140);
          playJoJoSfx("hamon");
          spawnParticles(S.aimX, S.aimY, "#00e5ff", 8);
        } else if (S.phase === "timing") {
          // il tiro parte solo dal pulsante: un tocco sul canvas non spara
          S.fx.push({ t: "USA IL PULSANTE!", x: 160, y: 136, c: "#ffd23f", life: 1 });
        } else if (S.phase === "ora_rush") {
          tapOraRush();
        } else if (S.phase === "def_parry") {
          S.defShieldX = clamp(pt.x, 70, 250);
          // il tocco sposta lo scudo; para solo se il tiro è ormai vicino
          if (defProgress() >= S.stand.parryFrom - 0.05) attemptParry();
        }
      };

      const handlePointerMove = (e) => {
        if (!S || !dragging) return;
        const pt = getCvCoords(e);

        if (S.phase === "aim") {
          S.aimX = clamp(pt.x, 65, 255);
          S.aimY = clamp(pt.y, 45, 140);
          S.curveOffset = clamp((pt.x - 160) * 0.35, -45, 45);
        } else if (S.phase === "time_stop") {
          S.aimX = clamp(pt.x, 65, 255);
          S.aimY = clamp(pt.y, 45, 140);
        } else if (S.phase === "def_parry") {
          S.defShieldX = clamp(pt.x, 70, 250);
        }
      };

      const handlePointerUp = () => { dragging = false; };

      cv.onmousedown = handlePointerDown;
      cv.onmousemove = handlePointerMove;
      cv.ontouchstart = (e) => { e.preventDefault(); handlePointerDown(e); };
      cv.ontouchmove = (e) => { e.preventDefault(); handlePointerMove(e); };
      cv.ontouchend = handlePointerUp;
      cv.ontouchcancel = handlePointerUp;
    }

    // un solo listener globale per tutta la vita della pagina
    if (!winListenersOn) {
      winListenersOn = true;
      window.addEventListener("mouseup", () => { dragging = false; });
    }

    startMatchLoop();
  }

  function spawnParticles(x, y, color, count) {
    if (!S || !S.particles) return;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = rnd(1, 3.5);
      S.particles.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        color: color,
        r: rnd(2, 4.5),
        life: 1.0,
        decay: rnd(0.03, 0.07)
      });
    }
  }

  function turnLabel() {
    if (!S) return "";
    if (S.pen) return "RIGORI";
    if (S.turn > S.maxTurns) return "SUPPL.";
    return `${S.turn}/${S.maxTurns}`;
  }

  function updateMatchHUD() {
    if (!S) return;
    const t = $("jTurn"), sc = $("jScore"), mv = $("jMeterVal"), mf = $("jMeterFill");
    if (t) t.textContent = turnLabel();
    if (sc) sc.textContent = `${S.myScore} – ${S.oppScore}`;
    if (mv) mv.textContent = `${Math.round(S.standMeter)}%`;
    if (mf) mf.style.width = `${clamp(S.standMeter, 0, 100)}%`;
  }

  function startTurn() {
    if (!S) return;
    S.phase = "aim";
    S.anim = null;
    S.ball = null;
    S.defBall = null;
    S.shotType = "normal";
    S.timeStopActive = false;
    S.curveOffset = 0;
    updateMatchHUD();
    updateAimButtons();
  }

  function updateAimButtons() {
    if (!S) return;
    const standReady = S.standMeter >= 100;
    const canTimeStop = S.standMeter >= 70;
    const textEl = $("text");
    const extra = S.turn > S.maxTurns;

    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">${S.stand.name}</span>
        <span class="t">
          <b>${extra ? "SUPPLEMENTARE" : `TURNO ${S.turn}/${S.maxTurns}`} · ATTACCO</b><br>
          Trascina o tocca la porta per mirare, poi scegli il tiro.<br>
          ${standReady ? '<span style="color:#ffd23f; font-weight:800;">★ ENERGIA AL 100%: RAFFICA ORA PRONTA!</span>' : canTimeStop ? '<span style="color:#00e5ff; font-weight:800;">⏳ ENERGIA SUFFICIENTE: PUOI FERMARE IL TEMPO!</span>' : `Portiere: <b>${S.boss.gkName}</b> (<em>${S.boss.power}</em>).`}
        </span>
      `;
    }

    const btns = [
      {
        label: "⚡ Tiro Tecnico Hamon",
        sub: "Tempismo concentrato (+25% Stand)",
        cls: "hot",
        fn: () => startTimingShot("normal")
      },
      {
        label: "🌀 Tiro ad Effetto Curvo",
        sub: "Gira attorno al blocco Stand del portiere",
        fn: () => startTimingShot("curve")
      },
      {
        label: canTimeStop ? "⏳ TIME STOP · Fermata del Tempo" : "🔒 Time Stop (Serve 70% Stand)",
        sub: canTimeStop ? "Ferma il portiere, ma il boss può resistere!" : "Raggiungi almeno il 70% di energia",
        cls: canTimeStop ? "hot" : "",
        disabled: !canTimeStop,
        fn: () => activateTimeStopKicking()
      },
      {
        label: standReady ? `👊 RAFFICA: ${S.stand.cry.split(" ")[0]}!` : "🔒 Raffica Stand (Serve 100%)",
        sub: standReady ? `Servono ${rushNeed()} pugni in 3 secondi!` : "Carica la barra al 100%",
        cls: standReady ? "hot" : "",
        disabled: !standReady,
        fn: () => startOraRush()
      }
    ];

    renderButtons(btns);
  }

  // --- ATTIVAZIONE TIME STOP ---
  function activateTimeStopKicking() {
    if (!S || S.phase !== "aim") return;
    S.standMeter = Math.max(0, S.standMeter - 70);
    updateMatchHUD();
    S.phase = "time_stop";
    S.timeStopActive = true;
    S.timeStopRemaining = 2.4;
    playJoJoSfx("time_stop");
    S.shake = 12;

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#00e5ff; color:#0e1424; font-weight:800;">ZA WARUDO / STAR PLATINUM</span>
        <span class="t">
          <b>«IL TEMPO SI È FERMATO!»</b> Il Borgo è immobile nel silenzio.<br>
          <b>Tocca un punto della porta</b> e scaglia prima che riprenda a scorrere. Ma ${S.boss.gkName} potrebbe resistere!
        </span>
      `;
    }

    renderButtons([{
      label: "⚡ SCAGLIA DURANTE IL FERMO TEMPO!",
      cls: "hot",
      fn: () => resolveTimeStopShot()
    }], true);

    const mine = S;
    const tsTimer = setInterval(() => {
      if (S !== mine || !S || S.phase !== "time_stop") {
        clearInterval(tsTimer);
        return;
      }
      S.timeStopRemaining -= 0.1;
      if (S.timeStopRemaining <= 0) {
        clearInterval(tsTimer);
        resolveTimeStopShot();
      }
    }, 100);
  }

  function resolveTimeStopShot() {
    if (!S || S.phase !== "time_stop") return;
    S.phase = "anim";
    S.timeStopActive = false;
    playJoJoSfx("stand_summon");
    S.shake = 16;
    renderButtons([], true);

    const targetX = S.aimX;
    const targetY = S.aimY;
    const distFromGk = Math.hypot(S.keeperX - targetX, S.keeperY - targetY);
    // il boss resiste al tempo fermo: più forte con gli atti, molto più facile se miri vicino a lui
    const resist = 0.12 + 0.06 * S.boss.act + (distFromGk < 24 ? 0.25 : 0);
    const saved = Math.random() < resist;

    S.anim = {
      t0: performance.now(),
      dur: 650,
      bx0: 160, by0: 190,
      bx1: targetX, by1: targetY,
      kx0: S.keeperX, ky0: S.keeperY,
      kx1: saved ? targetX : (targetX > 160 ? 110 : 210),
      ky1: saved ? targetY : 100,
      curve: 0,
      isTimeStop: true,
      done: () => {
        if (saved) {
          playJoJoSfx("ora");
          if (window.toast) window.toast(`${S.boss.gkName} resiste al tempo fermo!`, "warn", "🛡️");
          showShotResult(false, `<b>PARATO!</b> Con uno sforzo titanico, ${S.boss.gkName} si libera dal fermo tempo e devia la sfera.`);
        } else {
          playJoJoSfx("goal");
          S.myScore++;
          S.shake = 22;
          spawnParticles(targetX, targetY, "#00e5ff", 24);
          if (window.toast) window.toast("★ GOL NEL TEMPO FERMATO!", "goal", "⏳");
          showShotResult(true, `<b>GOOOL! «TOKI WA UGOKIDASU!»</b> Il tempo riprende a scorrere mentre la rete si squarcia!`);
        }
      }
    };
  }

  // --- TIRO TECNICO & CURVO ---
  function startTimingShot(type) {
    if (!S || S.phase !== "aim") return;
    S.phase = "timing";
    S.shotType = type;
    S.cursor = 0;
    S.cursorDir = 1;
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Tempismo & Hamon</span>
        <span class="t">
          <b>PREMI IL PULSANTE QUANDO IL CURSORE È AL CENTRO!</b><br>
          ${type === "curve" ? "Traiettoria ad effetto: gira attorno al raggio di guardia del portiere." : "Tiro diretto ad alta velocità."}
        </span>
      `;
    }
    renderButtons([{ label: "👟 SCAGLIA IL TIRO STAND!", cls: "hot", fn: fireNormalShot }], true);
  }

  function fireNormalShot() {
    if (!S || S.phase !== "timing") return;
    const diff = Math.abs(S.cursor - 0.5) * 2;
    const stand = S.stand;
    const perfect = diff < stand.perfectWin;
    const good = diff < 0.55;
    S.phase = "anim";
    renderButtons([], true);
    playJoJoSfx("kick");
    S.shake = perfect ? 18 : 8;

    const boss = S.boss;
    const isCurve = S.shotType === "curve";
    const curveOffset = isCurve ? (S.curveOffset || (S.aimX > 160 ? 35 : -35)) : 0;

    let diveX, diveY;
    if (Math.random() < boss.skill) {
      // il portiere "legge" il tiro
      diveX = S.aimX + rnd(-18, 18);
      diveY = S.aimY + rnd(-12, 12);
    } else {
      diveX = rnd(80, 240);
      diveY = rnd(60, 135);
    }

    const distFromGk = Math.hypot(diveX - S.aimX, diveY - S.aimY);
    const cs = isCurve ? stand.curveSave : 1;
    let saved = false;
    if (perfect) {
      saved = !stand.perfectFree && distFromGk < 18 && Math.random() < 0.15 * cs;
    } else if (isCurve) {
      saved = distFromGk < 22 && Math.random() < 0.35 * cs;
    } else if (good) {
      saved = distFromGk < 32;
    } else {
      saved = distFromGk < 45 || Math.random() < 0.45;
    }

    S.anim = {
      t0: performance.now(),
      dur: perfect ? 500 : 650,
      bx0: 160, by0: 190,
      bx1: S.aimX, by1: S.aimY,
      kx0: S.keeperX, ky0: S.keeperY,
      kx1: diveX, ky1: diveY,
      curve: curveOffset,
      isPerfect: perfect,
      done: () => {
        if (saved) {
          playJoJoSfx("ora");
          S.shake = 10;
          addMeter(8);
          if (window.toast) window.toast(`${boss.gkName} intercetta la sfera!`, "warn", "🛡️");
          showShotResult(false, `<b>PARATO!</b> ${boss.gkName} respinge la sfera con l'aura di ${boss.stand}.`);
        } else {
          playJoJoSfx("goal");
          S.myScore++;
          S.shake = 20;
          addMeter(perfect ? 40 : 25);
          spawnParticles(S.aimX, S.aimY, perfect ? "#ffd23f" : "#00e5ff", 20);
          if (window.toast) window.toast(perfect ? "★ TIRO HAMON CRITICO! GOOOL!" : "GOOOL STAND!", "goal", "★");
          showShotResult(true, perfect ? `<b>TIRO PERFETTO!</b> Una saetta Hamon spacca la barriera di ${boss.gkName}!` : `<b>GOOOL!</b> Traiettoria imparabile per ${boss.gkName}!`);
        }
      }
    };
  }

  // --- RAFFICA ORA ORA ORA ---
  function startOraRush() {
    if (!S || S.phase !== "aim") return;
    S.phase = "ora_rush";
    S.rushClicks = 0;
    S.rushTimer = 3.2;
    S.standMeter = 0;
    updateMatchHUD();
    playJoJoSfx("ora");
    S.shake = 15;
    const need = rushNeed();

    if (window.triggerAnimeCutin) {
      try {
        window.triggerAnimeCutin({
          who: S.stand.name,
          shotName: `RAFFICA ${S.stand.cry}`,
          isEgo: true,
          sfxWord: "ORA ORA ORA!"
        });
      } catch (e) {}
    }

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#e040fb; color:#fff; font-weight:800;">${S.stand.name}</span>
        <span class="t">
          <b>RAFFICA IN CORSO! TOCCA VELOCE LO SCHERMO!</b><br>
          Pugni: <b id="jRushCount" style="color:#ffd23f; font-size:18px;">0</b> / ${need} · Potenza: <b id="jRushPwr" style="color:#00e5ff;">100%</b>
        </span>
      `;
    }

    renderButtons([{ label: `👊 ${S.stand.cry.split(" ")[0]}! (TOCCA VELOCE)`, cls: "hot", fn: tapOraRush }], true);

    const mine = S;
    const timerInt = setInterval(() => {
      if (S !== mine || !S || S.phase !== "ora_rush") {
        clearInterval(timerInt);
        return;
      }
      S.rushTimer -= 0.1;
      if (S.rushTimer <= 0) {
        clearInterval(timerInt);
        resolveOraRush();
      }
    }, 100);
  }

  function tapOraRush() {
    if (!S || S.phase !== "ora_rush") return;
    S.rushClicks++;
    playJoJoSfx("ora");
    S.shake = 8;
    spawnParticles(160 + rnd(-40, 40), 100 + rnd(-30, 30), "#e040fb", 4);

    const cEl = $("jRushCount");
    const pEl = $("jRushPwr");
    if (cEl) cEl.textContent = S.rushClicks;
    if (pEl) pEl.textContent = `${Math.min(999, 100 + S.rushClicks * 50)}%`;
  }

  function resolveOraRush() {
    if (!S) return;
    S.phase = "anim";
    renderButtons([], true);

    const hits = S.rushClicks;
    const need = rushNeed();
    const success = hits >= need;
    S.shake = 26;

    S.anim = {
      t0: performance.now(),
      dur: 750,
      bx0: 160, by0: 190,
      bx1: S.aimX, by1: S.aimY,
      kx0: S.keeperX, ky0: S.keeperY,
      kx1: S.aimX > 160 ? 60 : 260,
      ky1: 120,
      curve: 0,
      isRush: true,
      done: () => {
        if (success) {
          playJoJoSfx("goal");
          S.myScore++;
          const prog = loadProg();
          prog.oraWins++;
          saveProg(prog);
          spawnParticles(S.aimX, S.aimY, "#ffd23f", 30);
          if (window.toast) window.toast("★ RAFFICA ORA DEVASTANTE!", "goal", "👊");
          showShotResult(true, `<b>${S.stand.cry}</b> Con <b>${hits} pugni spirituali</b> hai spazzato via ${S.boss.gkName} e la rete!`);
        } else {
          showShotResult(false, `<b>INSUFFICIENTE!</b> Solo ${hits} pugni su ${need}: la difesa avversaria ha attutito la raffica.`);
        }
      }
    };
  }

  function showShotResult(isGoal, desc) {
    updateMatchHUD();
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:${isGoal ? "#ffd23f" : "#d50000"}; color:#0e1424; font-weight:800;">${isGoal ? "GOOOL!" : "Azione Respinta"}</span>
        <span class="t">${desc}</span>
      `;
    }
    later(startDefenseTurn, 1600);
  }

  // --- FASE DIFENSIVA INTERATTIVA & PARRY ---
  function startDefenseTurn() {
    if (!S) return;
    S.phase = "def_charge";
    const boss = S.boss;
    S.defShieldX = 160;
    S.parryLock = 0;

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#d50000; color:#fff; font-weight:800;">${boss.user}</span>
        <span class="t">
          <b>CONTROFFENSIVA DI ${boss.short}!</b><br>
          «${boss.standCry}» Preparati a intercettare il tiro con il tuo Stand in porta!
        </span>
      `;
    }

    playJoJoSfx("stand_summon");
    S.shake = 10;

    renderButtons([{ label: "🛡️ PREPARATI ALLA PARATA", cls: "hot", fn: launchBossAttack }], true);
    later(() => { if (S.phase === "def_charge") launchBossAttack(); }, 1200);
  }

  function defProgress() {
    if (!S || !S.defBall) return 0;
    return (performance.now() - S.defBall.t0) / S.defBall.dur;
  }
  const parryTol = () => 38 - (S.boss.act - 1) * 2 + S.stand.parryTol;

  function launchBossAttack() {
    if (!S || S.phase !== "def_charge") return;
    S.phase = "def_parry";
    playJoJoSfx("time_stop");

    const boss = S.boss;
    const targetX = rnd(85, 235);
    const dur = Math.max(850, 1500 - boss.speed * 120);

    S.defBall = {
      t0: performance.now(),
      dur: dur,
      x0: 160, y0: 50,
      x1: targetX, y1: 158,
      x: 160, y: 50,
      targetX: targetX
    };

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#ff1744; color:#fff; font-weight:800;">TIRO AVVERSARIO IN VOLO!</span>
        <span class="t">
          <b>Sposta lo scudo sotto la palla</b> e premi <b>PARATA</b> quando il cerchio si stringe. Se non pari, è gol per loro!
        </span>
      `;
    }

    renderButtons([
      { label: "🛡️ STAND PARRY (PARATA)", cls: "hot", fn: () => attemptParry() },
      { label: "◀ Sposta Sinistra", fn: () => { if (S) S.defShieldX = Math.max(80, S.defShieldX - 45); } },
      { label: "▶ Sposta Destra", fn: () => { if (S) S.defShieldX = Math.min(240, S.defShieldX + 45); } }
    ]);

    // rete di sicurezza: se il frame loop si ferma, la fase non resta mai appesa
    later(() => { if (S.phase === "def_parry") resolveDefenseResult(false); }, dur + 900);
  }

  // controllo continuo: tiro arrivato in porta senza parata = gol subito
  function updateDefense() {
    if (!S || S.phase !== "def_parry" || !S.defBall) return;
    if (defProgress() > 1.08) resolveDefenseResult(false);
  }

  function attemptParry() {
    if (!S || S.phase !== "def_parry" || !S.defBall) return;
    const now = performance.now();
    if (now < S.parryLock) return;
    const p = defProgress();
    const distFromShield = Math.abs(S.defShieldX - S.defBall.targetX);
    const tol = parryTol();
    const from = S.stand.parryFrom;

    if (distFromShield < tol && p > from && p < 1.05) {
      playJoJoSfx("ora");
      S.shake = 18;
      addMeter(40);
      spawnParticles(S.defShieldX, 158, "#ffd23f", 20);
      resolveDefenseResult(true, true);
    } else if (distFromShield < tol + 17 && p > from - 0.05) {
      playJoJoSfx("kick");
      S.shake = 10;
      addMeter(15);
      resolveDefenseResult(true, false);
    } else {
      // parata fuori finestra: feedback e piccola penalità (energia e breve blocco)
      S.parryLock = now + 450;
      S.shake = 6;
      playJoJoSfx("kick");
      addMeter(-8);
      const why = p <= from - 0.05 ? "TROPPO PRESTO!" : distFromShield >= tol + 17 ? "SCUDO FUORI POSTO!" : "TROPPO TARDI!";
      S.fx.push({ t: why + " -8%", x: S.defShieldX, y: 138, c: "#ff5c8a", life: 1 });
      if (window.toast) window.toast(`Parata sbagliata: ${why.toLowerCase()} (-8% energia)`, "warn", "⚠️");
    }
  }

  function resolveDefenseResult(saved, isPerfect) {
    if (!S || S.phase !== "def_parry") return;
    S.phase = "anim";
    S.defBall = null;
    renderButtons([], true);
    const boss = S.boss;

    // lo Stand spadaccino può affettare un tiro che sarebbe gol
    if (!saved && Math.random() < S.stand.slice) {
      playJoJoSfx("ora");
      S.shake = 12;
      addMeter(10);
      if (window.toast) window.toast("Tiro AFFETTATO!", "goal", "🗡️");
      showDefResult(true, `<b>AFFETTATO!</b> ${S.stand.name} ha tagliato in due il tiro di ${boss.stand} un attimo prima della linea!`);
      return;
    }

    if (saved) {
      if (isPerfect) {
        if (window.toast) window.toast("★ PERFECT STAND COUNTER!", "goal", "🛡️");
        showDefResult(true, `<b>PERFECT STAND COUNTER!</b> Hai riflesso il tiro di ${boss.stand} guadagnando energia Stand!`);
      } else {
        if (window.toast) window.toast("Tiro respinto con successo!", "goal", "🧤");
        showDefResult(true, `<b>RESPINTO!</b> Il tuo Stand ha deviato la sfera oltre la traversa.`);
      }
    } else {
      playJoJoSfx("time_stop");
      S.oppScore++;
      S.shake = 18;
      if (window.toast) window.toast(`GOL DI ${boss.short}!`, "warn", "⚡");
      showDefResult(false, `<b>GOL AVVERSARIO!</b> Il potere <em>${boss.power}</em> ha superato la guardia difensiva.`);
    }
  }

  function showDefResult(saved, desc) {
    updateMatchHUD();
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:${saved ? "#7c4dff" : "#d50000"}; color:#fff; font-weight:800;">${saved ? "Parata Riuscita!" : "Gol Subito"}</span>
        <span class="t">${desc}</span>
      `;
    }
    later(nextTurn, 1600);
  }

  // dopo ogni turno: avanti, supplementare, rigori o fine
  function nextTurn() {
    if (!S) return;
    if (S.turn < S.maxTurns) {
      S.turn++;
      startTurn();
    } else if (S.myScore !== S.oppScore) {
      endMatch();
    } else if (S.turn === S.maxTurns) {
      // pareggio dopo 5 turni: un turno supplementare
      S.turn++;
      if (window.toast) window.toast("Pareggio! Si va al SUPPLEMENTARE", "warn", "⏱️");
      startTurn();
    } else {
      startPenalties();
    }
  }

  // --- RIGORI SEMPLICI (dopo supplementare ancora pari) ---
  const PEN_DIRS = [
    { d: -1, label: "◀ Angolo sinistro" },
    { d: 0, label: "● Centro" },
    { d: 1, label: "▶ Angolo destro" }
  ];

  function startPenalties() {
    if (!S) return;
    S.pen = { round: 1, my: null, opp: null };
    if (window.toast) window.toast("Ancora pari: RIGORI!", "warn", "🥅");
    penShootUI();
  }

  function penShootUI() {
    if (!S) return;
    S.phase = "pen_shoot";
    S.keeperX = 160; S.keeperY = 100; S.ball = null; S.anim = null;
    updateMatchHUD();
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">RIGORI · giro ${S.pen.round}</span>
        <span class="t"><b>Dove tiri?</b> ${S.boss.gkName} proverà a indovinare l'angolo.</span>
      `;
    }
    renderButtons(PEN_DIRS.map((o) => ({ label: o.label, cls: o.d === 0 ? "hot" : "", fn: () => penShoot(o.d) })));
  }

  function penShoot(d) {
    if (!S || S.phase !== "pen_shoot") return;
    S.phase = "anim";
    renderButtons([], true);
    playJoJoSfx("kick");
    const guess = Math.random() < S.boss.skill * 0.4 ? d : [-1, 0, 1][Math.floor(Math.random() * 3)];
    const goal = guess !== d;
    S.anim = {
      t0: performance.now(), dur: 600,
      bx0: 160, by0: 190, bx1: 160 + d * 70, by1: 80,
      kx0: S.keeperX, ky0: S.keeperY, kx1: 160 + guess * 70, ky1: 95,
      curve: 0,
      done: () => {
        S.pen.my = goal;
        if (goal) { playJoJoSfx("goal"); spawnParticles(160 + d * 70, 80, "#ffd23f", 20); } else { playJoJoSfx("ora"); }
        S.shake = 14;
        showPenText(goal ? "<b>GOL!</b> Rigore a segno." : `<b>PARATO!</b> ${S.boss.gkName} ha indovinato l'angolo.`, goal);
        later(penDefUI, 1400);
      }
    };
  }

  function showPenText(html, ok) {
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:${ok ? "#ffd23f" : "#d50000"}; color:${ok ? "#0e1424" : "#fff"}; font-weight:800;">Rigori</span>
        <span class="t">${html}</span>
      `;
    }
  }

  function penDefUI() {
    if (!S) return;
    S.phase = "pen_def";
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#d50000; color:#fff; font-weight:800;">RIGORI · tocca a ${S.boss.short}</span>
        <span class="t"><b>Dove ti tuffi?</b> Indovina l'angolo del tiro avversario.</span>
      `;
    }
    renderButtons(PEN_DIRS.map((o) => ({ label: o.label.replace("Angolo", "Tuffo"), cls: o.d === 0 ? "hot" : "", fn: () => penDive(o.d) })));
  }

  function penDive(d) {
    if (!S || S.phase !== "pen_def") return;
    S.phase = "anim";
    renderButtons([], true);
    const bossDir = [-1, 0, 1][Math.floor(Math.random() * 3)];
    const sliced = bossDir !== d && Math.random() < S.stand.slice * 0.5;
    const saved = bossDir === d || sliced;
    S.anim = {
      t0: performance.now(), dur: 600,
      bx0: 160, by0: 60, bx1: 160 + bossDir * 70, by1: 150,
      kx0: S.keeperX, ky0: S.keeperY, kx1: S.keeperX, ky1: S.keeperY,
      curve: 0,
      done: () => {
        S.pen.opp = !saved;
        S.shake = 14;
        if (saved) { playJoJoSfx("ora"); } else { playJoJoSfx("time_stop"); }
        showPenText(saved ? (sliced ? "<b>AFFETTATO!</b> Il tuo Stand taglia il tiro al volo." : "<b>PARATO!</b> Hai indovinato il tuffo.") : `<b>GOL AVVERSARIO.</b> ${S.boss.short} ha spiazzato la tua difesa.`, saved);
        later(penCompare, 1400);
      }
    };
  }

  function penCompare() {
    if (!S) return;
    const m = !!S.pen.my, o = !!S.pen.opp;
    if (m !== o || S.pen.round >= 5) {
      const iWin = m !== o ? m : Math.random() < 0.5;
      if (iWin) S.myScore++; else S.oppScore++;
      updateMatchHUD();
      endMatch();
      return;
    }
    S.pen.round++;
    penShootUI();
  }

  // --- CONCLUSIONE PARTITA ---
  function endMatch() {
    stopMatchLoop();
    const boss = S.boss;
    const win = S.myScore > S.oppScore;
    const prog = loadProg();
    S.firstClear = false;

    if (win) {
      // monete solo alla prima vittoria dell'atto
      if (S.bossIdx >= prog.actCleared) {
        S.firstClear = true;
        prog.actCleared = Math.min(5, S.bossIdx + 1);
        if (prog.actCleared >= 5) prog.trophyJoJo = true;
        if (typeof window.addCoins === "function") window.addCoins(boss.rewardCoins);
      }
      prog.standExp = (prog.standExp || 0) + 1;
      saveProg(prog);
      playJoJoSfx("goal");
      triggerJoJoPose("STAND RETIRED!", `HAI SCONFITTO ${boss.short}!`, () => {
        renderEndScreen(true);
      });
    } else {
      playJoJoSfx("time_stop");
      renderEndScreen(false);
    }
  }

  function renderEndScreen(win) {
    if (!S) return;
    const boss = S.boss;
    const coinsTxt = S.firstClear ? `+${boss.rewardCoins} Monete del Borgo` : "Atto già superato: nessuna moneta";
    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:${win ? "linear-gradient(135deg, #1b0a2a 0%, #31114d 60%, #10061e 100%)" : "linear-gradient(135deg, #2a0808 0%, #450a0a 60%, #1a0505 100%)"};"></div>
        <div class="jojo-menace" style="top:20px; left:20px; font-size:32px;">${win ? "ゴゴゴ" : "ドドド"}</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="font-family:var(--display); font-size:20px; color:${win ? "#ffd23f" : "#ff1744"}; text-shadow:2px 2px 0 #000, 0 0 14px ${win ? "#e040fb" : "#ff1744"};">
            ${win ? "★ STAND RETIRED! VITTORIA!" : "SCONFITTA SPIRITUALE"}
          </div>
          <div style="font-size:13px; font-weight:800; color:#fff; margin-top:2px;">
            ${heroInfo().name.toUpperCase()} ${S.myScore} – ${S.oppScore} ${boss.short}
          </div>
          <div style="font-size:11px; color:${win ? "#a7f3d0" : "#fca5a5"}; margin-top:4px;">
            ${win ? `Potere di ${boss.stand} infranto! ${coinsTxt}` : `Il potere ${boss.power} ha avuto la meglio. Riprova!`}
          </div>
        </div>
      `;
    }

    const textEl = $("text");
    if (textEl) {
      if (win) {
        textEl.innerHTML = `
          <span class="who" style="background:#ffd23f; color:#0e1424; font-weight:800;">Vittoria Stand!</span>
          <span class="t">
            <b>VITTORIA: ${S.myScore} – ${S.oppScore}!</b><br>
            Hai sconfitto <b>${boss.user}</b> e infranto il potere di <em>${boss.stand}</em>!<br>
            <b style="color:#ffd23f;">${coinsTxt}</b>${S.firstClear ? " accreditate al tuo club." : "."}
          </span>
        `;
      } else {
        textEl.innerHTML = `
          <span class="who" style="background:#d50000; color:#fff; font-weight:800;">Sconfitta Stand</span>
          <span class="t">
            <b>SCONFITTA: ${S.myScore} – ${S.oppScore}.</b><br>
            ${boss.short}: «Non hai ancora la stoffa per affrontare la nostra stirpe!»<br>
            Allena le pose, potenzia l'energia e riprova la scalata.
          </span>
        `;
      }
    }

    const bi = S.bossIdx;
    const btns = [
      {
        label: win ? "★ Prosegui la Saga" : "🔄 Riprova questa Battaglia",
        cls: "hot",
        fn: () => (win ? showHub() : initMatchState(bi))
      },
      {
        label: "◂ Torna all'Hub",
        cls: "pick",
        fn: showHub
      }
    ];

    renderButtons(btns);
  }

  // ================= MOTORE GRAFICO SHONEN MANGA (CANVAS) =================
  function startMatchLoop() {
    stopMatchLoop();
    function loop() {
      if (!S || !$("jojoCv")) return;
      updateDefense();
      if (!S) return;
      drawMatchCanvas();
      animFrameId = requestAnimationFrame(loop);
    }
    animFrameId = requestAnimationFrame(loop);
  }

  function drawMatchCanvas() {
    const cv = $("jojoCv");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const now = performance.now();

    let shakeX = 0, shakeY = 0;
    if (S.shake > 0) {
      shakeX = (Math.random() - 0.5) * S.shake;
      shakeY = (Math.random() - 0.5) * S.shake;
      S.shake *= 0.88;
      if (S.shake < 0.5) S.shake = 0;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    const isTs = S.timeStopActive;
    if (isTs) {
      ctx.fillStyle = "#040b17";
      ctx.fillRect(0, 0, 320, 200);
    } else {
      const bg = ctx.createLinearGradient(0, 0, 0, 130);
      bg.addColorStop(0, "#0d0417");
      bg.addColorStop(0.5, "#23073d");
      bg.addColorStop(1, "#10051e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 320, 130);

      // Luna crescente anime
      ctx.fillStyle = "#fff9c4";
      ctx.shadowColor = "#e040fb";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(260, 32, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#1b0730";
      ctx.beginPath();
      ctx.arc(254, 30, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Campo con Griglia Prospettica 3D & Linee Hamon
    const pitchGrad = ctx.createLinearGradient(0, 110, 0, 200);
    pitchGrad.addColorStop(0, isTs ? "#061325" : "#1a0b2e");
    pitchGrad.addColorStop(1, isTs ? "#020712" : "#0d0317");
    ctx.fillStyle = pitchGrad;
    ctx.fillRect(0, 110, 320, 90);

    ctx.strokeStyle = isTs ? "rgba(0,229,255,0.25)" : "rgba(224,64,251,0.28)";
    ctx.lineWidth = 1;
    for (let x = -80; x <= 400; x += 32) {
      ctx.beginPath();
      ctx.moveTo(160, 105);
      ctx.lineTo(x, 200);
      ctx.stroke();
    }
    for (let y = 115; y <= 200; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(320, y);
      ctx.stroke();
    }

    ctx.strokeStyle = isTs ? "#00e5ff" : "#ffd23f";
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 108, 210, 85);

    // 3. Porta Prospettica con Effetto Neon Manga
    ctx.strokeStyle = isTs ? "#00e5ff" : "#e040fb";
    ctx.lineWidth = 3;
    ctx.shadowColor = isTs ? "#00e5ff" : "#e040fb";
    ctx.shadowBlur = 10;
    ctx.strokeRect(60, 48, 200, 68);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isTs ? "rgba(0,229,255,0.18)" : "rgba(224,64,251,0.2)";
    ctx.lineWidth = 1;
    for (let x = 60; x <= 260; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 48);
      ctx.lineTo(x - (x - 160) * 0.12, 116);
      ctx.stroke();
    }
    for (let y = 48; y <= 116; y += 12) {
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(260, y);
      ctx.stroke();
    }

    // 4. Onomatopee Manga "GOGOGO" Fluttuanti sullo Sfondo
    ctx.font = "bold 13px 'Dela Gothic One', Impact, sans-serif";
    ctx.fillStyle = isTs ? "rgba(0,229,255,0.35)" : "rgba(224,64,251,0.45)";
    S.menaceRunes.forEach((r, idx) => {
      const bob = Math.sin(now * 0.003 + idx) * 3;
      ctx.save();
      ctx.translate(r.x, r.y + bob);
      ctx.rotate(r.rot);
      ctx.fillText(r.text, 0, 0);
      ctx.restore();
    });

    // 5. Orologio Etereo Gigante in caso di TIME STOP
    if (isTs) {
      ctx.save();
      ctx.strokeStyle = "rgba(0,229,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(160, 90, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(160, 90); ctx.lineTo(160, 45);
      ctx.moveTo(160, 90); ctx.lineTo(195, 80);
      ctx.stroke();
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#00e5ff";
      ctx.textAlign = "center";
      ctx.fillText(`TIME STOP · ${Math.max(0, S.timeStopRemaining).toFixed(1)}s`, 160, 160);
      ctx.restore();
    }

    // 6. Animazione Pattugliamento Portiere
    if (!isTs && (S.phase === "aim" || S.phase === "timing")) {
      S.keeperX += S.boss.speed * 0.42 * S.keeperDir;
      if (S.keeperX > 220) S.keeperDir = -1;
      if (S.keeperX < 100) S.keeperDir = 1;
      S.keeperY = 100;
    }

    // 7. Risoluzione Animazione Traiettoria Palla
    if (S.anim) {
      const a = S.anim;
      const p = Math.min(1, (now - a.t0) / a.dur);
      const ease = 1 - Math.pow(1 - p, 2);
      const curveY = Math.sin(p * Math.PI) * (a.curve || 0);

      S.ball = {
        x: a.bx0 + (a.bx1 - a.bx0) * p + curveY,
        y: a.by0 + (a.by1 - a.by0) * p,
        r: Math.max(5, 12 - 7 * p)
      };

      S.keeperX = a.kx0 + (a.kx1 - a.kx0) * ease;
      S.keeperY = a.ky0 + (a.ky1 - a.ky0) * ease;

      if (Math.random() < 0.6) {
        spawnParticles(S.ball.x, S.ball.y, a.isTimeStop ? "#00e5ff" : a.isPerfect ? "#ffd23f" : "#e040fb", 2);
      }

      if (p >= 1) {
        const cb = a.done;
        S.anim = null;
        if (cb) cb();
      }
    }

    // 8. DISEGNO STAND AVVERSARIO & BOSS
    drawStandBossAvatar(ctx, S.boss, S.keeperX, S.keeperY, now, isTs);

    // 9. DISEGNO FASE DIFENSIVA / PARRY
    if (S.phase === "def_parry" && S.defBall) {
      drawDefensePhase(ctx, now);
    }

    // 10. DISEGNO MIRINO & TRAIETTORIA HAMON EFFETTO (In attacco)
    if (S.phase === "aim" || S.phase === "time_stop") {
      drawAimAndCurveTrajectory(ctx, now);
    }

    // 11. BARRA TEMPISMO SHONEN
    if (S.phase === "timing") {
      drawTimingMeter(ctx);
    }

    // 12. PALLA IN VOLO CON AURA DI ROTAZIONE
    if (S.ball) {
      drawSpinningBall(ctx, S.ball.x, S.ball.y, S.ball.r, now);
    }

    // 13. DISEGNO EFFETTI PARTICELLE
    drawParticles(ctx);
    drawFx(ctx);

    // 14. FLASH PUGNI SPETTRALI DURANTE RAFFICA ORA
    if (S.phase === "ora_rush") {
      drawOraBarrageFists(ctx, now);
    }

    ctx.restore();
  }

  // --- RENDERING AVATAR STAND BOSS PERSONALIZZATO ---
  function drawStandBossAvatar(ctx, boss, x, y, now, isFrozen) {
    ctx.save();

    const auraPulse = Math.sin(now * 0.007) * 4;
    const auraGrad = ctx.createRadialGradient(x, y - 20, 10, x, y - 20, 48 + auraPulse);
    auraGrad.addColorStop(0, boss.aura);
    auraGrad.addColorStop(0.6, boss.color + "55");
    auraGrad.addColorStop(1, "transparent");
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(x, y - 20, 50 + auraPulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = boss.color;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(x - 28, y - 10);
    ctx.lineTo(x - 42, y - 28);
    ctx.lineTo(x - 18, y - 38);
    ctx.lineTo(x, y - 28);
    ctx.lineTo(x + 18, y - 38);
    ctx.lineTo(x + 42, y - 28);
    ctx.lineTo(x + 28, y - 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (boss.id === "dio_brando") {
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(x, y - 34, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#00e5ff";
      ctx.fillRect(x - 8, y - 37, 4, 4);
      ctx.fillRect(x + 4, y - 37, 4, 4);
    } else if (boss.id === "kira_yoshi") {
      ctx.fillStyle = "#ec407a";
      ctx.beginPath();
      ctx.arc(x, y - 34, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 42); ctx.lineTo(x - 6, y - 52); ctx.lineTo(x - 2, y - 44);
      ctx.moveTo(x + 2, y - 44); ctx.lineTo(x + 6, y - 52); ctx.lineTo(x + 10, y - 42);
      ctx.fill();
      ctx.stroke();
    } else if (boss.id === "diavolo_boss") {
      ctx.fillStyle = "#d50000";
      ctx.beginPath();
      ctx.arc(x, y - 34, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ff5252";
      ctx.beginPath();
      ctx.arc(x, y - 44, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = boss.color;
      ctx.beginPath();
      ctx.arc(x, y - 34, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#ffd23f";
    ctx.shadowBlur = 8;
    ctx.fillRect(x - 6, y - 37, 4, 3);
    ctx.fillRect(x + 2, y - 37, 4, 3);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#1e0b36";
    ctx.fillRect(x - 9, y + 2, 18, 22);
    ctx.fillStyle = "#ffcc80";
    ctx.beginPath();
    ctx.arc(x, y - 2, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 8px 'Dela Gothic One', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffd23f";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText(`${boss.gkName}`, x, y - 48);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // --- DISEGNO MIRINO & TRAIETTORIA CURVA AD EFFETTO HAMON ---
  function drawAimAndCurveTrajectory(ctx, now) {
    ctx.save();
    const ax = S.aimX, ay = S.aimY;
    const curveOffset = S.curveOffset || 0;

    ctx.strokeStyle = S.timeStopActive ? "#00e5ff" : "#ffd23f";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(160, 190);
    const cx = 160 + (ax - 160) * 0.5 + curveOffset;
    const cy = 190 + (ay - 190) * 0.5 - 15;
    ctx.quadraticCurveTo(cx, cy, ax, ay);
    ctx.stroke();
    ctx.setLineDash([]);

    const pT = (now * 0.002) % 1;
    const px = Math.pow(1 - pT, 2) * 160 + 2 * (1 - pT) * pT * cx + Math.pow(pT, 2) * ax;
    const py = Math.pow(1 - pT, 2) * 190 + 2 * (1 - pT) * pT * cy + Math.pow(pT, 2) * ay;
    ctx.fillStyle = S.timeStopActive ? "#00e5ff" : "#fff";
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const rot = now * 0.004;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(rot);

    ctx.strokeStyle = S.timeStopActive ? "#00e5ff" : S.standMeter >= 100 ? "#ffd23f" : "#e040fb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-20, 0); ctx.lineTo(20, 0);
    ctx.moveTo(0, -20); ctx.lineTo(0, 20);
    ctx.stroke();
    ctx.restore();

    // etichetta fissa in basso al centro (mai sopra il portiere)
    const distGk = Math.hypot(S.keeperX - ax, S.keeperY - ay);
    const isSafe = distGk > 36 || Math.abs(curveOffset) > 24;
    const lab = isSafe ? "TRAIETTORIA LIBERA" : "ATTENZIONE: PORTIERE";
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    const lw = ctx.measureText(lab).width + 12;
    ctx.fillStyle = "rgba(10,4,20,0.78)";
    ctx.beginPath();
    rrect(ctx, 160 - lw / 2, 146, lw, 13, 5);
    ctx.fill();
    ctx.fillStyle = isSafe ? "#7dffa6" : "#ff8a8a";
    ctx.fillText(lab, 160, 155.5);

    ctx.restore();
  }

  // --- BARRA TEMPISMO SHONEN ---
  function drawTimingMeter(ctx) {
    S.cursor += 0.028 * S.cursorDir;
    if (S.cursor >= 1) { S.cursor = 1; S.cursorDir = -1; }
    if (S.cursor <= 0) { S.cursor = 0; S.cursorDir = 1; }

    ctx.save();
    ctx.fillStyle = "rgba(14, 4, 26, 0.94)";
    ctx.fillRect(60, 148, 200, 18);
    ctx.strokeStyle = "#e040fb";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 148, 200, 18);

    ctx.fillStyle = "rgba(0, 229, 255, 0.45)";
    ctx.fillRect(60 + 200 * 0.38, 150, 200 * 0.24, 14);

    ctx.fillStyle = "#ffd23f";
    const pw = S.stand.perfectWin;
    ctx.fillRect(60 + 200 * (0.5 - pw / 2), 150, 200 * pw, 14);

    const cx = 60 + S.cursor * 200;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#e040fb";
    ctx.shadowBlur = 8;
    ctx.fillRect(cx - 3, 146, 6, 22);

    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("PREMI IL PULSANTE AL CENTRO (PERFECT!)", 160, 143);
    ctx.restore();
  }

  // --- DISEGNO FASE DIFENSIVA / PARRY ---
  function drawDefensePhase(ctx, now) {
    ctx.save();
    const b = S.defBall;
    const p = Math.min(1, (now - b.t0) / b.dur);
    const currX = b.x0 + (b.targetX - b.x0) * p;
    const currY = b.y0 + (b.y1 - b.y0) * p;
    b.x = currX;
    b.y = currY;

    ctx.fillStyle = "#ff1744";
    ctx.shadowColor = "#ff1744";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(currX, currY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "rgba(255, 23, 68, 0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x0, b.y0);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    const shX = S.defShieldX;
    ctx.fillStyle = "rgba(124, 77, 255, 0.7)";
    ctx.strokeStyle = "#ffd23f";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    rrect(ctx, shX - 32, 149, 64, 18, 6);
    ctx.fill();
    ctx.stroke();

    const ringRadius = Math.max(12, 60 * (1 - p));
    ctx.strokeStyle = p > 0.7 ? "#7dffa6" : "#00e5ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shX, 158, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 9px 'Dela Gothic One', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("STAND SHIELD", shX, 162);

    ctx.restore();
  }

  // --- PALLA IN ROTAZIONE CON FIAMME ---
  function drawSpinningBall(ctx, x, y, r, now) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(now * 0.015);

    ctx.fillStyle = "#ffd23f";
    ctx.shadowColor = "#e040fb";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#1e0b36";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- PUGNI SPETTRALI RAFFICA ORA ORA ORA ---
  function drawOraBarrageFists(ctx, now) {
    ctx.save();
    const count = 7;
    for (let i = 0; i < count; i++) {
      const fx = rnd(80, 240);
      const fy = rnd(60, 140);
      const fs = rnd(12, 22);

      ctx.fillStyle = i % 2 === 0 ? "rgba(124, 77, 255, 0.85)" : "rgba(224, 64, 251, 0.85)";
      ctx.strokeStyle = "#ffd23f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx, fy, fs, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 11px Impact, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText("ORA!", fx, fy + 4);
    }
    ctx.restore();
  }

  // --- TESTI FLUTTUANTI (feedback) ---
  function drawFx(ctx) {
    if (!S || !S.fx) return;
    for (let i = S.fx.length - 1; i >= 0; i--) {
      const f = S.fx[i];
      f.life -= 0.02;
      f.y -= 0.5;
      if (f.life <= 0) { S.fx.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.min(1, f.life * 1.6);
      ctx.font = "bold 11px 'Dela Gothic One', Impact, sans-serif";
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000";
      ctx.strokeText(f.t, clamp(f.x, 70, 250), f.y);
      ctx.fillStyle = f.c;
      ctx.fillText(f.t, clamp(f.x, 70, 250), f.y);
      ctx.restore();
    }
  }

  // --- PARTICELLE ---
  function drawParticles(ctx) {
    if (!S || !S.particles) return;
    for (let i = S.particles.length - 1; i >= 0; i--) {
      const p = S.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        S.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Esposizione Globale
  window.openJoJoAdventure = openJoJoAdventure;
  window.openJoJoStandMode = openJoJoAdventure;
  if (DEBUG) {
    window.__jojo = {
      get S() { return S; },
      loadProg, saveProg, STAND_BOSSES, HERO_STANDS, heroInfo,
      setScore: (a, b) => { if (S) { S.myScore = a; S.oppScore = b; updateMatchHUD(); } },
      setMeter: (v) => { if (S) { S.standMeter = v; updateMatchHUD(); if (S.phase === "aim") updateAimButtons(); } }
    };
  }
})();
