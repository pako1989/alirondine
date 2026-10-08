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
        position: absolute; bottom: 6px; left: 8px; right: 8px; z-index: 15;
        background: rgba(14, 6, 26, 0.92); border: 1px solid #7c4dff;
        border-radius: 8px; padding: 4px 8px; display: flex; flex-direction: column; gap: 4px;
      }
      .jojo-stand-row {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 10px; font-weight: 800; color: #e1bee7;
      }
      .jojo-meter {
        flex: 1; height: 8px; margin: 0 6px; background: #261138;
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
      .jojo-pose-sub {
        font-size: 13px; font-weight: 800; color: #00e5ff;
        text-shadow: 1px 1px 0 #000; margin-top: 4px; text-transform: uppercase;
      }
    `;
    document.head.appendChild(st);
  }

  // Audio sintesi WebAudio stile anime JoJo
  function playJoJoSfx(type) {
    if (typeof window.hapticTrigger === "function") {
      try {
        if (type === "ora" || type === "goal") window.hapticTrigger("goal");
        else if (type === "time_stop") window.hapticTrigger("special");
        else window.hapticTrigger("kick");
      } catch (e) {}
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "ora") {
        // Suono percussivo raffiche pugno Stand
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (type === "time_stop") {
        // Risonanza sorda inversione temporale ZA WARUDO
        osc.type = "sine";
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.45);
        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.start(t);
        osc.stop(t + 0.52);
      } else if (type === "hamon") {
        // Scintille Hamon solari
        osc.type = "triangle";
        osc.frequency.setValueAtTime(540, t);
        osc.frequency.linearRampToValueAtTime(880, t + 0.25);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.32);
      } else if (type === "stand_summon") {
        // Eco evocazione Stand
        osc.type = "square";
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(660, t + 0.35);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.005, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.42);
      }
    } catch (e) {}
  }

  // Nemici Stand User dei 5 Atti
  const STAND_BOSSES = [
    {
      act: 1,
      id: "dio_brando",
      user: "Lord Brando delle Rive",
      stand: "THE WORLD DEL MOLO",
      title: "Parte 1: Il Vampiro dell'Antico Molo",
      lore: "Un sinistro nobile è approdato a Punta Rondine con una Maschera di Pietra Marina. Sostiene che il calcio del borgo sia debole e destinato a sottomettersi al suo Stand che congela il tempo!",
      preQuote: "«KONO BRANDO DA! Credi davvero che i tuoi passaggi possano superare il mio Regno Congelato, Leo?»",
      gkName: "The World (Riflesso)",
      color: "#ffd700",
      aura: "#ffe600",
      speed: 3.5,
      power: "TIME STOP (2s di fermo palla)",
      favZone: "centro",
      standCry: "MUDA MUDA MUDA!",
      rewardCoins: 20
    },
    {
      act: 2,
      id: "kars_pillar",
      user: "Santana & i Custodi della Scogliera",
      stand: "PILLAR BLADE",
      title: "Parte 2: L'Uomo del Pilastro del Faro",
      lore: "Dalla Grotta delle Sirene si sono risvegliati gli Uomini del Pilastro. Usano l'elasticità corporea e l'assorbimento per intercettare qualsiasi traiettoria d'aria.",
      preQuote: "«I mortali di Borgo Marino giocano sull'erba... noi danziamo sulle lame della scogliera!»",
      gkName: "Santana Pillar",
      color: "#ff5722",
      aura: "#ff8a65",
      speed: 4.0,
      power: "FLEX BODY (Estensione mostruosa delle braccia)",
      favZone: "basso",
      standCry: "WHAAM! AWAKEN!",
      rewardCoins: 30
    },
    {
      act: 3,
      id: "kira_yoshi",
      user: "Kira del Baracchino",
      stand: "KILLER RONDINE",
      title: "Parte 3: La Bomba Silenziosa di Via Marina",
      lore: "Un individuo apparentemente tranquillo che vuole solo vivere in pace... trasformando ogni pallone che tocca nella prima bomba detonante a contatto!",
      preQuote: "«Voglio solo una vita tranquilla e un tiro perfetto all'incrocio. Ma chi mi ostacola fa click.»",
      gkName: "Killer Cat",
      color: "#ec407a",
      aura: "#f48fb1",
      speed: 4.3,
      power: "FIRST BOMB (Esplosione respingente)",
      favZone: "alto",
      standCry: "SHEER HEART ATTACK!",
      rewardCoins: 40
    },
    {
      act: 4,
      id: "diavolo_boss",
      user: "Il Boss Mascherato 'Diavolo'",
      stand: "KING CRIMSON DEL GOLFO",
      title: "Parte 4: La Cancellazione del Tempo",
      lore: "Nessuno ha mai visto la sua faccia nella trattoria del porto. Cancella 5 secondi di traiettoria e prevede il futuro con Epitaph per far svanire i gol fatti!",
      preQuote: "«Ho già visto il punto in cui tirerai tramite Epitaph. Il tempo è stato appena cancellato!»",
      gkName: "King Crimson",
      color: "#d50000",
      aura: "#ff1744",
      speed: 4.8,
      power: "TIME ERASE (Cancella la traiettoria ideale)",
      favZone: "alterna",
      standCry: "EPITAPH PREDICTION!",
      rewardCoins: 50
    },
    {
      act: 5,
      id: "pucci_made",
      user: "Padre Enrico della Cappella del Molo",
      stand: "MADE IN BORGO (ACCELERAZIONE)",
      title: "Parte 5 Finale: Il Paradiso della Rondine",
      lore: "La battaglia finale sul campo bagnato dalla burrasca. Il tempo del match accelera all'infinito: solo la determinazione di Leo e l'eredità Joestar della Rondine possono raggiungere la vittoria!",
      preQuote: "«Il destino ha già decretato chi alzerà la coppa. Credi nella gravità, Moretti?»",
      gkName: "Made in Haven",
      color: "#00e5ff",
      aura: "#18ffff",
      speed: 5.3,
      power: "INFINITE SPEED (Traiettorie ipersoniche)",
      favZone: "specchio",
      standCry: "HALLELUJAH! ORA ORA ORA!",
      rewardCoins: 80
    }
  ];

  // Stand del Protagonista Leo & Compagni
  const HERO_STANDS = [
    {
      id: "star_rondine",
      name: "STAR RONDINE",
      type: "Potenza & Precisione",
      user: "Leo Moretti",
      cry: "ORA ORA ORA ORA ORA!",
      desc: "Raffica supersonica di colpi al pallone. Distrugge ogni barriera e annulla la parata.",
      color: "#7c4dff",
      rushHits: 12
    },
    {
      id: "golden_gabbiano",
      name: "GOLDEN GABBIANO",
      type: "Vita & Curvatura",
      user: "Tommy & Leo",
      cry: "MUDA MUDA MUDA MUDA!",
      desc: "Dona vita alla traiettoria del pallone: devia a mezz'aria come uno stormo dorato.",
      color: "#ffd700",
      rushHits: 10
    },
    {
      id: "silver_trabucco",
      name: "SILVER TRABUCCO",
      type: "Spadaccino Difensivo",
      user: "Nico (Il Muro)",
      cry: "HORA HORA HORA!",
      desc: "Affetta qualsiasi tiro avversario con riflessi d'acciaio prima che superi la linea.",
      color: "#b0bec5",
      rushHits: 8
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

  function stopMatchLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
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

    const cv = $("cv");
    if (cv) cv.hidden = true;
    const alt = $("stageAlt");
    if (alt) {
      alt.hidden = false;
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0a2a 0%, #31114d 50%, #10061e 100%);"></div>
        <div class="jojo-menace" style="top:20px; left:25px;">ゴゴゴ</div>
        <div class="jojo-menace" style="top:45px; right:35px; font-size:32px;">ゴゴゴ</div>
        <div class="jojo-menace" style="bottom:70px; left:40px; font-size:20px;">ドドド</div>
        <div style="position:absolute; inset:0; background:radial-gradient(circle at center, rgba(224,64,251,0.2) 0%, transparent 70%); pointer-events:none;"></div>
        <div style="position:relative; z-index:2; padding:16px; text-shadow:0 2px 4px #000;">
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
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Jotaro & Leo</span>
        <span class="t">
          <b>«Yare Yare Daze...»</b> Un'aura misteriosa avvolge il campo del Borgo. Gli avversari possiedono il potere degli <b>STAND</b>!
          Solo risvegliando il tuo potenziale potrai fermare la stirpe di Brando e liberare la costa a suon di <em>ORA ORA ORA!</em><br>
          <span style="color:#ffd23f;">Prossimo avversario: <b>${curBoss.user}</b> (${curBoss.stand})</span>
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

    btns.push({
      label: "◂ Torna al Menu",
      cls: "pick",
      fn: () => {
        stopMatchLoop();
        const alt2 = $("stageAlt");
        if (alt2) { alt2.hidden = true; alt2.style.display = "none"; }
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
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Freccia Stand</span>
        <span class="t">
          Scegli la manifestazione spirituale da schierare in campo. Ognuna conferisce un tipo diverso di super-tiro e abilità contro i boss!
        </span>
      `;
    }

    const btns = HERO_STANDS.map((st) => ({
      label: (st.id === prog.currentStand ? "✓ " : "") + st.name,
      sub: `${st.type} · Gridata: ${st.cry}`,
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
    const textEl = $("text");
    const cost = prog.standLevel * 25;
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#ffd23f; color:#0e1424; font-weight:800;">Pose Master Caesar</span>
        <span class="t">
          <b>IL RESPIRO DELL'HAMON E LE POSE PLASTICHE!</b><br>
          Livello Stand Attuale: <b>Liv. ${prog.standLevel}</b> (Bonus barra Stand: +${(prog.standLevel - 1) * 20}% velocità di ricarica).<br>
          <i>«Assumi una posa ad angolo retto con la schiena arcuata e grida la tua determinazione!»</i>
        </span>
      `;
    }

    const btns = [
      {
        label: `✨ Meditazione Hamon · Sblocca Posa (Liv. ${prog.standLevel + 1})`,
        sub: `Costo: ${cost} Monete · Aumenta potenza Raffica ORA`,
        cls: "hot",
        disabled: prog.standLevel >= 5,
        fn: () => {
          let coins = 0;
          try {
            const raw = localStorage.getItem("ali-di-rondine.monete");
            coins = raw ? parseInt(raw, 10) || 0 : 0;
          } catch (e) {}

          if (coins < cost) {
            if (window.toast) window.toast(`Monete insufficienti! Ti servono ${cost} monete del Borgo.`, "warn", "🪙");
            return;
          }

          if (typeof window.addCoins === "function") {
            window.addCoins(-cost);
          } else {
            try {
              localStorage.setItem("ali-di-rondine.monete", Math.max(0, coins - cost));
            } catch (e) {}
          }

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
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#e040fb; color:#fff; font-weight:800;">Grimorio Stand</span>
        <span class="t">
          <b>GUIDA AL COMBATTIMENTO STAND</b><br>
          • <b>BARRA STAND</b>: si riempie segnando, parando e con la posa tattica.<br>
          • <b>RAFFICA ORA ORA ORA</b>: quando la barra Stand è al 100%, premi il super attacco e tocca ripetutamente lo schermo per scatenare fino a 15 pugni contemporanei!<br>
          • <b>TIME STOP & CONTROMOSSE</b>: quando l'avversario usa il suo potere bizzarro, mantieni la calma e respingi il pallone nell'angolo scoperto!<br>
          • <b>VITTORIA FINALE</b>: sconfiggendo Padre Pucci all'Atto 5 otterrai il titolo leggendario <em>Campione dei Portatori di Stand</em> e un tesoro di monete!
        </span>
      `;
    }
    renderButtons([{ label: "◂ Ho capito!", cls: "pick", fn: showHub }], true);
  }

  function showStageSelect() {
    const prog = loadProg();
    const btns = [];
    for (let i = 0; i <= Math.min(4, prog.actCleared); i++) {
      const b = STAND_BOSSES[i];
      btns.push({
        label: `Atto ${i + 1}: ${b.user}`,
        sub: b.stand,
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

    const alt = $("stageAlt");
    if (alt) {
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #1b0a2a 0%, #31114d 50%, #10061e 100%);"></div>
        <div class="jojo-menace" style="top:25px; left:20px;">ゴゴゴ</div>
        <div class="jojo-menace" style="top:30px; right:20px;">ドドド</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%;">
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
          <b>${boss.preQuote}</b><br>
          ${boss.lore}
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
      turn: 1,
      maxTurns: 5,
      myScore: 0,
      oppScore: 0,
      standMeter: 40 + (prog.standLevel - 1) * 15,
      phase: "aim", // aim, timing, ora_rush, def, anim
      aimX: 160,
      aimY: 100,
      keeperX: 160,
      keeperY: 105,
      keeperDir: 1,
      rushClicks: 0,
      rushTimer: 0,
      cursor: 0,
      cursorDir: 1,
      ball: null,
      anim: null
    };

    setupMatchDOM();
    startTurn();
  }

  function setupMatchDOM() {
    const alt = $("stageAlt");
    if (!alt) return;
    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.width = "320px";
    alt.style.height = "200px";
    alt.style.margin = "0 auto";
    alt.style.overflow = "hidden";

    alt.innerHTML = `
      <div class="jojo-hud">
        <span>TURNO <b id="jTurn">1/5</b></span>
        <span><b>LEO</b> <b id="jScore">0 – 0</b> <b style="color:#ff1744;" id="jBossName">${S.boss.user.split(" ")[0]}</b></span>
        <span style="color:#ffd23f;">★ STAND</span>
      </div>
      <canvas id="jojoCv" width="320" height="200" style="display:block; width:100%; height:100%;"></canvas>
      <div class="jojo-stand-bar">
        <div class="jojo-stand-row">
          <span>ENERGIA STAND (${S.stand.name})</span>
          <span id="jMeterVal">40%</span>
        </div>
        <div class="jojo-meter">
          <i class="jojo-meter-fill" id="jMeterFill" style="width:40%; background:linear-gradient(90deg, #7c4dff, #e040fb 70%, #ffd23f 100%);"></i>
        </div>
      </div>
    `;

    const cv = $("jojoCv");
    if (cv) {
      cv.onclick = (e) => {
        if (!S) return;
        const rect = cv.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 320;
        const y = ((e.clientY - rect.top) / rect.height) * 200;

        if (S.phase === "aim") {
          S.aimX = clamp(x, 70, 250);
          S.aimY = clamp(y, 55, 145);
          playJoJoSfx("hamon");
          updateAimButtons();
        } else if (S.phase === "timing") {
          fireNormalShot();
        } else if (S.phase === "ora_rush") {
          tapOraRush();
        }
      };
    }

    startMatchLoop();
  }

  function updateMatchHUD() {
    if (!S) return;
    const t = $("jTurn"), sc = $("jScore"), mv = $("jMeterVal"), mf = $("jMeterFill");
    if (t) t.textContent = `${S.turn}/${S.maxTurns}`;
    if (sc) sc.textContent = `${S.myScore} – ${S.oppScore}`;
    if (mv) mv.textContent = `${Math.round(S.standMeter)}%`;
    if (mf) mf.style.width = `${clamp(S.standMeter, 0, 100)}%`;
  }

  function startTurn() {
    if (!S) return;
    S.phase = "aim";
    S.anim = null;
    S.ball = null;
    updateMatchHUD();
    updateAimButtons();
  }

  function updateAimButtons() {
    if (!S) return;
    const standReady = S.standMeter >= 100;
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">${S.stand.name}</span>
        <span class="t">
          <b>TURNO ${S.turn}/${S.maxTurns} · FASE D'ATTACCO</b><br>
          Tocca la porta per posizionare il mirino, poi decidi come scatenare il tuo Stand!<br>
          ${standReady ? '<span style="color:#ffd23f; font-weight:800;">⚡ ENERGIA STAND AL 100%: RAFFICA ORA PRONTA!</span>' : `Attenzione al potere avversario: <em>${S.boss.power}</em>.`}
        </span>
      `;
    }

    const btns = [
      {
        label: "⚡ Tiro Tecnico Stand",
        sub: "Barra del tempismo (+25% Stand)",
        cls: "hot",
        fn: () => startTimingShot()
      },
      {
        label: "🧘 Posa Bizzarra di Concentrazione",
        sub: "+45% Carica Stand, traiettoria più precisa",
        fn: () => doConcentrationPose()
      },
      {
        label: standReady ? `🔥 RAFFICA: ${S.stand.cry.split(" ")[0]}!` : "🔒 Raffica Stand (Serve 100%)",
        sub: standReady ? "Tocca a raffica per distruggere il portiere!" : "Carica la barra al 100%",
        cls: standReady ? "hot" : "",
        disabled: !standReady,
        fn: () => startOraRush()
      }
    ];

    renderButtons(btns);
  }

  function doConcentrationPose() {
    if (!S || S.phase !== "aim") return;
    playJoJoSfx("hamon");
    S.standMeter = Math.min(100, S.standMeter + 45);
    updateMatchHUD();
    triggerJoJoPose("POSA SHONEN!", "+45% ENERGIA SPIRITUALE!", () => {
      updateAimButtons();
    });
  }

  function startTimingShot() {
    if (!S || S.phase !== "aim") return;
    S.phase = "timing";
    S.cursor = 0;
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Tempismo Stand</span>
        <span class="t">
          Ferma la barra luminosa al centro per massimizzare la velocità del tiro! (Tocca la porta o il pulsante).
        </span>
      `;
    }
    renderButtons([{ label: "👟 SCAGLIA IL PALLONE!", cls: "hot", fn: fireNormalShot }], true);
  }

  function fireNormalShot() {
    if (!S || S.phase !== "timing") return;
    const diff = Math.abs(S.cursor - 0.5) * 2;
    const perfect = diff < 0.25;
    S.phase = "anim";
    renderButtons([], true);
    playJoJoSfx("ora");

    // Risoluzione tiro
    const boss = S.boss;
    const r = Math.random();
    let diveX = S.keeperX;
    let diveY = S.keeperY;

    if (r < 0.4) {
      diveX = S.aimX + rnd(-20, 20);
      diveY = S.aimY + rnd(-15, 15);
    } else {
      diveX = rnd(80, 240);
      diveY = rnd(60, 140);
    }

    const distFromGk = Math.hypot(diveX - S.aimX, diveY - S.aimY);
    const saved = !perfect && distFromGk < 35;

    S.anim = {
      t0: performance.now(),
      dur: 600,
      bx0: 160, by0: 190,
      bx1: S.aimX, by1: S.aimY,
      kx0: S.keeperX, ky0: S.keeperY,
      kx1: diveX, ky1: diveY,
      done: () => {
        if (saved) {
          playJoJoSfx("ora");
          if (window.toast) window.toast(`${boss.gkName} para il tiro!`, "warn", "🛡️");
          showShotResult(false, `<b>PARATO!</b> ${boss.gkName} ha usato il suo Stand per intercettare la traiettoria.`);
        } else {
          playJoJoSfx("goal");
          S.myScore++;
          S.standMeter = Math.min(100, S.standMeter + 30);
          if (window.toast) window.toast("GOOOL STAND!", "goal", "★");
          showShotResult(true, `<b>GOOOL!</b> La traiettoria perfora la difesa spirituale di ${boss.gkName}!`);
        }
      }
    };
  }

  function startOraRush() {
    if (!S || S.phase !== "aim") return;
    S.phase = "ora_rush";
    S.rushClicks = 0;
    S.rushTimer = 3.0; // 3 secondi di raffica
    S.standMeter = 0;
    updateMatchHUD();
    playJoJoSfx("ora");

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
          <b>RAFFICA STAND ATTIVA!</b> TOCCA RAPIDAMENTE IL PULSANTE O LA PORTA!<br>
          Pugni sferrati: <b id="jRushCount" style="color:#ffd23f; font-size:16px;">0</b> (Supera quota 10 per un gol inarrestabile!)
        </span>
      `;
    }

    renderButtons([{ label: `👊 ${S.stand.cry.split(" ")[0]}! (TOCCA VELOCE)`, cls: "hot", fn: tapOraRush }], true);

    const timerInt = setInterval(() => {
      if (!S || S.phase !== "ora_rush") {
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
    const cEl = $("jRushCount");
    if (cEl) cEl.textContent = S.rushClicks;
  }

  function resolveOraRush() {
    if (!S) return;
    S.phase = "anim";
    renderButtons([], true);

    const hits = S.rushClicks;
    const success = hits >= 8;

    S.anim = {
      t0: performance.now(),
      dur: 700,
      bx0: 160, by0: 190,
      bx1: S.aimX, by1: S.aimY,
      kx0: S.keeperX, ky0: S.keeperY,
      kx1: S.aimX > 160 ? 80 : 240, ky1: 120, // Il portiere viene scagliato via
      done: () => {
        if (success) {
          playJoJoSfx("goal");
          S.myScore++;
          const prog = loadProg();
          prog.oraWins++;
          saveProg(prog);
          if (window.toast) window.toast("★ RAFFICA ORA DISTRUTTIVA!", "goal", "👊");
          showShotResult(true, `<b>${S.stand.cry}!</b> Con ${hits} pugni spirituali hai spazzato via ${S.boss.gkName} e strappato la rete!`);
        } else {
          showShotResult(false, `<b>INSUFFICIENTE!</b> Solo ${hits} colpi: la difesa avversaria ha assorbito la raffica.`);
        }
      }
    };
  }

  function showShotResult(isGoal, desc) {
    updateMatchHUD();
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:${isGoal ? "#ffd23f" : "#d50000"}; color:#0e1424; font-weight:800;">Risultato Azione</span>
        <span class="t">${desc}</span>
      `;
    }

    setTimeout(() => {
      if (!S) return;
      startDefenseTurn();
    }, 1500);
  }

  // Turno difensivo: parare il tiro dello Stand avversario
  function startDefenseTurn() {
    if (!S) return;
    S.phase = "def";
    const boss = S.boss;
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#d50000; color:#fff; font-weight:800;">${boss.user}</span>
        <span class="t">
          <b>CONTROFFENSIVA STAND!</b> ${boss.user} scatena <em>${boss.stand}</em>!<br>
          «${boss.standCry}» Scegli dove posizionare il tuo difensore per bloccare l'attacco.
        </span>
      `;
    }

    renderButtons([
      { label: "🛡️ Tuffo a Sinistra", fn: () => resolveDefense(0) },
      { label: "🛡️ Blocco Centrale", fn: () => resolveDefense(1) },
      { label: "🛡️ Tuffo a Destra", fn: () => resolveDefense(2) }
    ]);
  }

  function resolveDefense(choice) {
    if (!S || S.phase !== "def") return;
    S.phase = "anim";
    renderButtons([], true);

    const zonesX = [95, 160, 225];
    const realDir = Math.floor(Math.random() * 3);
    const saved = choice === realDir;
    const boss = S.boss;

    S.anim = {
      t0: performance.now(),
      dur: 600,
      bx0: 160, by0: 190,
      bx1: zonesX[realDir], by1: 100,
      kx0: 160, ky0: 105,
      kx1: zonesX[choice], ky1: 105,
      done: () => {
        if (saved) {
          playJoJoSfx("ora");
          S.standMeter = Math.min(100, S.standMeter + 20);
          if (window.toast) window.toast("PARATA STAND PERFETTA!", "goal", "🛡️");
          showDefResult(true, `<b>PARATA PROVVIDENZIALE!</b> Il tuo Stand ha respinto il tiro di ${boss.stand}!`);
        } else {
          playJoJoSfx("time_stop");
          S.oppScore++;
          if (window.toast) window.toast(`GOL DI ${boss.user.toUpperCase()}!`, "warn", "⚡");
          showDefResult(false, `<b>GOL AVVERSARIO!</b> Il potere ${boss.power} ha eluso la guardia difensiva.`);
        }
      }
    };
  }

  function showDefResult(saved, desc) {
    updateMatchHUD();
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Fase Difensiva</span>
        <span class="t">${desc}</span>
      `;
    }

    setTimeout(() => {
      if (!S) return;
      S.turn++;
      if (S.turn > S.maxTurns) {
        endMatch();
      } else {
        startTurn();
      }
    }, 1500);
  }

  // Conclusione partita
  function endMatch() {
    stopMatchLoop();
    const boss = S.boss;
    const win = S.myScore > S.oppScore;
    const prog = loadProg();

    if (win) {
      if (S.bossIdx >= prog.actCleared) {
        prog.actCleared = Math.min(5, S.bossIdx + 1);
        if (prog.actCleared >= 5) prog.trophyJoJo = true;
      }
      saveProg(prog);
      if (typeof window.addCoins === "function") {
        window.addCoins(boss.rewardCoins);
      }
      playJoJoSfx("goal");
      triggerJoJoPose("VITTORIA BIZZARRA!", `+${boss.rewardCoins} MONETE DEL BORGO!`, () => {
        renderEndScreen(true);
      });
    } else {
      renderEndScreen(false);
    }
  }

  function renderEndScreen(win) {
    const boss = S.boss;
    const textEl = $("text");
    if (textEl) {
      if (win) {
        textEl.innerHTML = `
          <span class="who" style="background:#ffd23f; color:#0e1424; font-weight:800;">Vittoria Stand!</span>
          <span class="t">
            <b>VITTORIA SCHIACCIANTE: ${S.myScore} – ${S.oppScore}!</b><br>
            Hai sconfitto <b>${boss.user}</b> e infranto il potere di <em>${boss.stand}</em>!<br>
            Ricompensa: <b style="color:#ffd23f;">+${boss.rewardCoins} Monete del Borgo</b> accreditate al tuo club.
          </span>
        `;
      } else {
        textEl.innerHTML = `
          <span class="who" style="background:#d50000; color:#fff; font-weight:800;">Sconfitta Stand</span>
          <span class="t">
            <b>SCONFITTA: ${S.myScore} – ${S.oppScore}.</b><br>
            ${boss.user}: «Non hai ancora la stoffa per affrontare la nostra stirpe!»<br>
            Allena le tue pose, potenzia l'energia Hamon e riprova la scalata.
          </span>
        `;
      }
    }

    const btns = [
      {
        label: win ? "★ Prosegui la Saga JoJo" : "🔄 Riprova questa Battaglia",
        cls: "hot",
        fn: () => (win ? showHub() : initMatchState(S.bossIdx))
      },
      {
        label: "◂ Torna all'Hub JoJo",
        cls: "pick",
        fn: showHub
      }
    ];

    renderButtons(btns);
  }

  // Disegno su Canvas
  function startMatchLoop() {
    stopMatchLoop();
    function loop() {
      if (!S || !$("jojoCv")) return;
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

    ctx.clearRect(0, 0, 320, 200);

    // Sfondo campo scuro shonen
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 200);
    bgGrad.addColorStop(0, "#120822");
    bgGrad.addColorStop(0.5, "#250c40");
    bgGrad.addColorStop(1, "#0d0519");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 320, 200);

    // Porta con aura violacea JoJo
    ctx.strokeStyle = "#e040fb";
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 50, 200, 100);

    // Rete
    ctx.strokeStyle = "rgba(224, 64, 251, 0.2)";
    ctx.lineWidth = 1;
    for (let x = 60; x <= 260; x += 15) {
      ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x, 150); ctx.stroke();
    }
    for (let y = 50; y <= 150; y += 15) {
      ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(260, y); ctx.stroke();
    }

    // Pattugliamento portiere
    if (S.phase === "aim" || S.phase === "timing") {
      S.keeperX += S.boss.speed * 0.45 * S.keeperDir;
      if (S.keeperX > 225) S.keeperDir = -1;
      if (S.keeperX < 95) S.keeperDir = 1;
      S.keeperY = 105;
    }

    // Animazione traiettoria
    if (S.anim) {
      const a = S.anim;
      const p = Math.min(1, (now - a.t0) / a.dur);
      const ease = 1 - Math.pow(1 - p, 2);
      S.ball = {
        x: a.bx0 + (a.bx1 - a.bx0) * p,
        y: a.by0 + (a.by1 - a.by0) * p,
        r: Math.max(6, 13 - 6 * p)
      };
      S.keeperX = a.kx0 + (a.kx1 - a.kx0) * ease;
      S.keeperY = a.ky0 + (a.ky1 - a.ky0) * ease;
      if (p >= 1) {
        const cb = a.done;
        S.anim = null;
        if (cb) cb();
      }
    }

    // Disegna Portiere Stand
    const kx = S.keeperX, ky = S.keeperY;
    const isDef = S.phase === "def";
    const kCol = isDef ? "#7c4dff" : S.boss.color;
    const kAura = isDef ? "#b388ff" : S.boss.aura;

    // Aura Stand dietro
    ctx.save();
    ctx.beginPath();
    ctx.arc(kx, ky, 24, 0, Math.PI * 2);
    ctx.fillStyle = kAura;
    ctx.globalAlpha = 0.35 + Math.sin(now * 0.008) * 0.15;
    ctx.fill();
    ctx.restore();

    // Sprite Portiere
    ctx.fillStyle = kCol;
    ctx.beginPath();
    ctx.arc(kx, ky - 6, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(kx - 11, ky + 6, 22, 26);

    ctx.fillStyle = "#fff";
    ctx.fillRect(kx - 6, ky - 10, 4, 4);
    ctx.fillRect(kx + 2, ky - 10, 4, 4);

    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffd23f";
    ctx.fillText(isDef ? S.stand.name : S.boss.gkName, kx, ky - 22);

    // Mirino Stand
    if (S.phase === "aim" || S.phase === "timing" || S.phase === "ora_rush") {
      ctx.strokeStyle = S.standMeter >= 100 ? "#ffd23f" : "#00e5ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(S.aimX, S.aimY, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(S.aimX - 16, S.aimY); ctx.lineTo(S.aimX + 16, S.aimY);
      ctx.moveTo(S.aimX, S.aimY - 16); ctx.lineTo(S.aimX, S.aimY + 16);
      ctx.stroke();
    }

    // Barra tempismo
    if (S.phase === "timing") {
      S.cursor += 0.024 * S.cursorDir;
      if (S.cursor >= 1) { S.cursor = 1; S.cursorDir = -1; }
      if (S.cursor <= 0) { S.cursor = 0; S.cursorDir = 1; }

      ctx.fillStyle = "rgba(18, 6, 32, 0.9)";
      ctx.fillRect(70, 168, 180, 14);
      ctx.strokeStyle = "#e040fb";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(70, 168, 180, 14);

      // Zona verde ideale
      ctx.fillStyle = "#00e5ff";
      ctx.fillRect(70 + 180 * 0.38, 169, 180 * 0.24, 12);

      // Cursore
      ctx.fillStyle = "#ffd23f";
      const cx = 70 + S.cursor * 180;
      ctx.fillRect(cx - 3, 166, 6, 18);
    }

    // Palla in volo
    if (S.ball) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(S.ball.x, S.ball.y, S.ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd23f";
      ctx.shadowColor = "#e040fb";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.restore();
    }
  }

  // Esposizione Globale
  window.openJoJoAdventure = openJoJoAdventure;
  window.openJoJoStandMode = openJoJoAdventure;
})();
