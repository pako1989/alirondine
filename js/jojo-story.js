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

  function activateJoJoStage() {
    if (window.setView) window.setView({ kind: "jojo" });
    const cv = $("cv");
    if (cv) cv.hidden = true;
    const alt = $("stageAlt");
    if (alt) {
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
          <div style="color:#e1bee7; font-size:11px; margin-top:4px;">${curStand.desc}</div>
        </div>
      `;
    }

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
          <div style="color:#00e5ff; font-size:12px; font-weight:700; margin-top:2px;">Bonus Velocità Carica: +${(prog.standLevel - 1) * 20}%</div>
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
          <div style="color:#e1bee7; font-size:12px; margin-top:4px;">Punta alla porta, carica la barra con tiri o pose e distruggi i boss con la Raffica ORA!</div>
        </div>
      `;
    }

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
      standMeter: 45 + (prog.standLevel - 1) * 15,
      phase: "aim", // aim, timing, ora_rush, time_stop, def_charge, def_parry, anim
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
      defParrySuccess: false,
      ball: null,
      anim: null,
      shake: 0,
      particles: [],
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

  function setupMatchDOM() {
    const alt = activateJoJoStage();
    if (!alt) return;
    alt.style.display = "block";

    alt.innerHTML = `
      <div class="jojo-hud">
        <span>TURNO <b id="jTurn">1/5</b></span>
        <span><b>LEO</b> <b id="jScore" style="color:#00e5ff;">0 – 0</b> <b style="color:#ff1744;" id="jBossName">${S.boss.user.split(" ")[0]}</b></span>
        <span style="color:#ffd23f;">★ STAND LV.${loadProg().standLevel}</span>
      </div>
      <canvas id="jojoCv" width="320" height="200" style="display:block; width:100%; height:100%; touch-action:none; user-select:none; -webkit-user-select:none;"></canvas>
      <div class="jojo-stand-bar">
        <div class="jojo-stand-row">
          <span>ENERGIA STAND (${S.stand.name})</span>
          <span id="jMeterVal">45%</span>
        </div>
        <div class="jojo-meter">
          <i class="jojo-meter-fill" id="jMeterFill" style="width:45%; background:linear-gradient(90deg, #7c4dff, #e040fb 70%, #ffd23f 100%);"></i>
        </div>
      </div>
    `;

    const cv = $("jojoCv");
    if (cv) {
      let isDragging = false;

      const getCvCoords = (e) => {
        const rect = cv.getBoundingClientRect();
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        return {
          x: clamp(((clientX - rect.left) / rect.width) * 320, 10, 310),
          y: clamp(((clientY - rect.top) / rect.height) * 200, 10, 190)
        };
      };

      const handlePointerDown = (e) => {
        if (!S) return;
        const pt = getCvCoords(e);
        isDragging = true;

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
          fireNormalShot();
        } else if (S.phase === "ora_rush") {
          tapOraRush();
        } else if (S.phase === "def_parry") {
          S.defShieldX = clamp(pt.x, 70, 250);
          attemptParry();
        }
      };

      const handlePointerMove = (e) => {
        if (!S || !isDragging) return;
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

      const handlePointerUp = () => {
        isDragging = false;
      };

      cv.onmousedown = handlePointerDown;
      cv.onmousemove = handlePointerMove;
      window.addEventListener("mouseup", handlePointerUp);

      cv.ontouchstart = (e) => { e.preventDefault(); handlePointerDown(e); };
      cv.ontouchmove = (e) => { e.preventDefault(); handlePointerMove(e); };
      cv.ontouchend = handlePointerUp;
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

    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">${S.stand.name}</span>
        <span class="t">
          <b>TURNO ${S.turn}/${S.maxTurns} · FASE ATTACCO STAND</b><br>
          Trascina o tocca la porta per mirare e imprimere la traiettoria ad effetto Hamon!<br>
          ${standReady ? '<span style="color:#ffd23f; font-weight:800;">★ ENERGIA STAND AL 100%: RAFFICA ORA DEVASTANTE PRONTA!</span>' : canTimeStop ? '<span style="color:#00e5ff; font-weight:800;">⏳ ENERGIA STAND SUFFICIENTE: PUOI ATTIVARE IL TIME STOP!</span>' : `Portiere avversario: <b>${S.boss.gkName}</b> (Potere: <em>${S.boss.power}</em>).`}
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
        label: canTimeStop ? "⏳ ZA WARUDO · Fermata del Tempo" : "🔒 Time Stop (Serve 70% Stand)",
        sub: canTimeStop ? "Ferma il portiere per 2s e spiazza la difesa!" : "Raggiungi almeno il 70% di energia",
        cls: canTimeStop ? "hot" : "",
        disabled: !canTimeStop,
        fn: () => activateTimeStopKicking()
      },
      {
        label: standReady ? `👊 RAFFICA: ${S.stand.cry.split(" ")[0]}!` : "🔒 Raffica Stand (Serve 100%)",
        sub: standReady ? "Frenesia di pugni ad altissima frequenza!" : "Carica la barra al 100%",
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
          <b>«IL TEMPO SI È FERMATO!»</b> Il mondo è immobile nel silenzio astrale.<br>
          <b>Tocca rapidamente un punto scoperto</b> della porta prima che riprenda a scorrere!
        </span>
      `;
    }

    renderButtons([{
      label: "⚡ SCAGLIA DURANTE IL FERMO TEMPO!",
      cls: "hot",
      fn: () => resolveTimeStopShot()
    }], true);

    const tsTimer = setInterval(() => {
      if (!S || S.phase !== "time_stop") {
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
    const saved = distFromGk < 22 && Math.random() < 0.25;

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
          if (window.toast) window.toast(`${S.boss.gkName} reagisce miracolosamente!`, "warn", "🛡️");
          showShotResult(false, `<b>PARATO!</b> Con uno sforzo titanico, ${S.boss.gkName} ha deviato la sfera sul filo dei secondi.`);
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
    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#7c4dff; color:#fff; font-weight:800;">Tempismo & Hamon</span>
        <span class="t">
          <b>BLOCCA IL CURSORE NEL CENTRO PER UN TIRO PERFETTO!</b><br>
          ${type === "curve" ? "Traiettoria ad effetto: bypassa il raggio di guardia del portiere!" : "Tiro diretto ad alta velocità penetrante!"}
        </span>
      `;
    }
    renderButtons([{ label: "👟 SCAGLIA IL TIRO STAND!", cls: "hot", fn: fireNormalShot }], true);
  }

  function fireNormalShot() {
    if (!S || S.phase !== "timing") return;
    const diff = Math.abs(S.cursor - 0.5) * 2;
    const perfect = diff < 0.22;
    const good = diff < 0.55;
    S.phase = "anim";
    renderButtons([], true);
    playJoJoSfx("kick");
    S.shake = perfect ? 18 : 8;

    const boss = S.boss;
    const isCurve = S.shotType === "curve";
    const curveOffset = isCurve ? (S.curveOffset || (S.aimX > 160 ? 35 : -35)) : 0;

    let diveX = S.keeperX;
    let diveY = S.keeperY;
    const r = Math.random();

    if (r < 0.5) {
      diveX = S.aimX + rnd(-18, 18);
      diveY = S.aimY + rnd(-12, 12);
    } else {
      diveX = rnd(80, 240);
      diveY = rnd(60, 135);
    }

    const distFromGk = Math.hypot(diveX - S.aimX, diveY - S.aimY);
    let saved = false;
    if (perfect) {
      saved = distFromGk < 18 && Math.random() < 0.15;
    } else if (isCurve) {
      saved = distFromGk < 22 && Math.random() < 0.35;
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
          if (window.toast) window.toast(`${boss.gkName} intercetta la sfera!`, "warn", "🛡️");
          showShotResult(false, `<b>PARATO!</b> ${boss.gkName} respinge la sfera con l'aura di ${boss.stand}.`);
        } else {
          playJoJoSfx("goal");
          S.myScore++;
          S.shake = 20;
          S.standMeter = Math.min(100, S.standMeter + (perfect ? 40 : 25));
          spawnParticles(S.aimX, S.aimY, perfect ? "#ffd23f" : "#00e5ff", 20);
          if (window.toast) window.toast(perfect ? "★ TIRO HAMON CRITICO! GOOOL!" : "GOOOL STAND!", "goal", "★");
          showShotResult(true, perfect ? `<b>TIRO PERFETTO AL 100%!</b> Una saetta Hamon spacca la barriera di ${boss.gkName}!` : `<b>GOOOL!</b> Traiettoria imparabile per ${boss.gkName}!`);
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
          <b>RAFFICA ORA IN CORSO! TOCCA CONTINUAMENTE LO SCHERMO!</b><br>
          Pugni sferrati: <b id="jRushCount" style="color:#ffd23f; font-size:18px;">0</b> · Potenza: <b id="jRushPwr" style="color:#00e5ff;">100%</b>
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
    const success = hits >= 8;
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
          showShotResult(true, `<b>${S.stand.cry}!</b> Con <b>${hits} pugni spirituali</b> hai spazzato via ${S.boss.gkName} distruggendo la rete!`);
        } else {
          showShotResult(false, `<b>INSUFFICIENTE!</b> Solo ${hits} colpi: la difesa avversaria ha attutito la raffica.`);
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

    setTimeout(() => {
      if (!S) return;
      startDefenseTurn();
    }, 1600);
  }

  // --- FASE DIFENSIVA INTERATTIVA & PARRY ---
  function startDefenseTurn() {
    if (!S) return;
    S.phase = "def_charge";
    const boss = S.boss;
    S.defShieldX = 160;
    S.defParrySuccess = false;

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#d50000; color:#fff; font-weight:800;">${boss.user}</span>
        <span class="t">
          <b>CONTROFFENSIVA STAND DI ${boss.user.toUpperCase()}!</b><br>
          «${boss.standCry}» Preparati a intercettare il tiro con il tuo Stand in porta!
        </span>
      `;
    }

    playJoJoSfx("stand_summon");
    S.shake = 10;

    renderButtons([{ label: "🛡️ PREPARATI ALLA PARATA", cls: "hot", fn: launchBossAttack }], true);

    setTimeout(() => {
      if (S && S.phase === "def_charge") launchBossAttack();
    }, 1200);
  }

  function launchBossAttack() {
    if (!S || S.phase !== "def_charge") return;
    S.phase = "def_parry";
    playJoJoSfx("time_stop");

    const boss = S.boss;
    const targetX = rnd(85, 235);

    S.defBall = {
      t0: performance.now(),
      dur: Math.max(900, 1500 - boss.speed * 120),
      x0: 160, y0: 50,
      x1: targetX, y1: 175,
      x: 160, y: 50,
      targetX: targetX
    };

    const textEl = $("text");
    if (textEl) {
      textEl.innerHTML = `
        <span class="who" style="background:#ff1744; color:#fff; font-weight:800;">TIRO AVVERSARIO IN VOLO!</span>
        <span class="t">
          <b>TRASCINA LO SHIELD SULLA TRAIETTORIA</b> e tocca <b>STAND PARRY</b> per riflettere il tiro!
        </span>
      `;
    }

    renderButtons([
      { label: "🛡️ STAND PARRY (PARATA)", cls: "hot", fn: attemptParry },
      { label: "◀ Sposta Sinistra", fn: () => { S.defShieldX = Math.max(80, S.defShieldX - 45); } },
      { label: "▶ Sposta Destra", fn: () => { S.defShieldX = Math.min(240, S.defShieldX + 45); } }
    ]);
  }

  function attemptParry() {
    if (!S || S.phase !== "def_parry" || !S.defBall) return;
    const now = performance.now();
    const p = (now - S.defBall.t0) / S.defBall.dur;
    const distFromShield = Math.abs(S.defShieldX - S.defBall.targetX);

    if (distFromShield < 38 && p > 0.55 && p < 1.05) {
      S.defParrySuccess = true;
      playJoJoSfx("ora");
      S.shake = 18;
      S.standMeter = Math.min(100, S.standMeter + 40);
      updateMatchHUD();
      spawnParticles(S.defShieldX, 175, "#ffd23f", 20);
      resolveDefenseResult(true, true);
    } else if (distFromShield < 55 && p > 0.5) {
      playJoJoSfx("kick");
      S.shake = 10;
      S.standMeter = Math.min(100, S.standMeter + 15);
      updateMatchHUD();
      resolveDefenseResult(true, false);
    }
  }

  function resolveDefenseResult(saved, isPerfect) {
    if (!S) return;
    S.phase = "anim";
    renderButtons([], true);
    const boss = S.boss;

    if (saved) {
      if (isPerfect) {
        if (window.toast) window.toast("★ PERFECT STAND COUNTER!", "goal", "🛡️");
        showDefResult(true, `<b>PERFECT STAND COUNTER!</b> Hai riflesso il tiro di ${boss.stand} guadagnando +40% di energia Stand!`);
      } else {
        if (window.toast) window.toast("Tiro respinto con successo!", "goal", "🧤");
        showDefResult(true, `<b>RESPINTO!</b> Il tuo Stand ha deviato la sfera oltre la traversa.`);
      }
    } else {
      playJoJoSfx("time_stop");
      S.oppScore++;
      S.shake = 18;
      if (window.toast) window.toast(`GOL DI ${boss.user.toUpperCase()}!`, "warn", "⚡");
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

    setTimeout(() => {
      if (!S) return;
      S.turn++;
      if (S.turn > S.maxTurns) {
        endMatch();
      } else {
        startTurn();
      }
    }, 1600);
  }

  // --- CONCLUSIONE PARTITA ---
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
      triggerJoJoPose("STAND RETIRED!", `HAI SCONFITTO ${boss.user.toUpperCase()}!`, () => {
        renderEndScreen(true);
      });
    } else {
      playJoJoSfx("time_stop");
      renderEndScreen(false);
    }
  }

  function renderEndScreen(win) {
    const boss = S.boss;
    const alt = activateJoJoStage();
    if (alt) {
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:${win ? "linear-gradient(135deg, #1b0a2a 0%, #31114d 60%, #10061e 100%)" : "linear-gradient(135deg, #2a0808 0%, #450a0a 60%, #1a0505 100%)"};"></div>
        <div class="jojo-menace" style="top:20px; left:20px; font-size:32px;">${win ? "ゴゴゴ" : "ドドド"}</div>
        <div style="position:relative; z-index:2; padding:16px; display:flex; flex-direction:column; justify-content:flex-end; height:100%; box-sizing:border-box;">
          <div style="font-family:var(--display); font-size:22px; color:${win ? "#ffd23f" : "#ff1744"}; text-shadow:2px 2px 0 #000, 0 0 14px ${win ? "#e040fb" : "#ff1744"};">
            ${win ? "★ STAND RETIRED! VITTORIA!" : "SCONFITTA SPIRITUALE"}
          </div>
          <div style="font-size:13px; font-weight:800; color:#fff; margin-top:2px;">
            LEO MORETTI ${S.myScore} – ${S.oppScore} ${boss.user.toUpperCase()}
          </div>
          <div style="font-size:11px; color:${win ? "#a7f3d0" : "#fca5a5"}; margin-top:4px;">
            ${win ? `Potere di ${boss.stand} infranto! +${boss.rewardCoins} Monete del Borgo` : `Il potere ${boss.power} ha avuto la meglio. Riprova!`}
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

  // ================= MOTORE GRAFICO SHONEN MANGA (CANVAS) =================
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
      ctx.fillText("TIME STOP · 2.0s", 160, 160);
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

    const distGk = Math.hypot(S.keeperX - ax, S.keeperY - ay);
    const isSafe = distGk > 36 || Math.abs(curveOffset) > 24;
    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = isSafe ? "#7dffa6" : "#ff8a8a";
    ctx.fillText(isSafe ? "TRAIETTORIA LIBERA" : "ATTENZIONE STAND GUARD", ax, ay - 20);

    ctx.restore();
  }

  // --- BARRA TEMPISMO SHONEN ---
  function drawTimingMeter(ctx) {
    S.cursor += 0.028 * S.cursorDir;
    if (S.cursor >= 1) { S.cursor = 1; S.cursorDir = -1; }
    if (S.cursor <= 0) { S.cursor = 0; S.cursorDir = 1; }

    ctx.save();
    ctx.fillStyle = "rgba(14, 4, 26, 0.94)";
    ctx.fillRect(60, 166, 200, 18);
    ctx.strokeStyle = "#e040fb";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 166, 200, 18);

    ctx.fillStyle = "rgba(0, 229, 255, 0.45)";
    ctx.fillRect(60 + 200 * 0.38, 168, 200 * 0.24, 14);

    ctx.fillStyle = "#ffd23f";
    ctx.fillRect(60 + 200 * 0.46, 168, 200 * 0.08, 14);

    const cx = 60 + S.cursor * 200;
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#e040fb";
    ctx.shadowBlur = 8;
    ctx.fillRect(cx - 3, 164, 6, 22);

    ctx.font = "bold 8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("PREMI AL CENTRO (PERFECT CRITICO!)", 160, 160);
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
    ctx.roundRect(shX - 32, 168, 64, 18, 6);
    ctx.fill();
    ctx.stroke();

    const ringRadius = Math.max(12, 60 * (1 - p));
    ctx.strokeStyle = p > 0.7 ? "#7dffa6" : "#00e5ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(shX, 175, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 9px 'Dela Gothic One', sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText("STAND SHIELD", shX, 181);

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
})();
