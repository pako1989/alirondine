// ================= SAGA 4: RICK & MORTY · LA CITTADELLA DEI LEO MORETTI =================
// Tributo ufficiale a The Ricklantis Mixup, Evil Morty, la Cittadella e la Portal Gun.
// Con vero gameplay profondo:
// 1. Reclutamento Squadra Multiversale (5 Varianti uniche di Leo)
// 2. Gameplay balistico con la PORTAL GUN tattica (spara varchi verdi sul campo)
// 3. Boss fight a 3 fasi contro Evil Leo (Benda sull'occhio e armi quantiche)
// 4. Dialoghi demenziali, sblocco Carta Multiverso ed easter egg cosmici
(function () {
  const K_CIT = "ali-di-rondine.citadel-progress";

  function getProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_CIT));
      if (d && typeof d === "object") {
        return {
          recruited: Array.isArray(d.recruited) ? d.recruited : ["cyborg", "samurai"],
          squad: Array.isArray(d.squad) ? d.squad : ["cyborg", "samurai"],
          portalFluid: typeof d.portalFluid === "number" ? d.portalFluid : 100,
          evilLeoDefeated: !!d.evilLeoDefeated
        };
      }
    } catch (e) {}
    return {
      recruited: ["cyborg", "samurai"],
      squad: ["cyborg", "samurai"],
      portalFluid: 100,
      evilLeoDefeated: false
    };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_CIT, JSON.stringify(p));
    } catch (e) {}
  }

  const VARIANTS = [
    {
      id: "cyborg",
      name: "Leo Cyborg C-800",
      role: "Ariete da Sfondamento",
      ability: "Laser Shot (+30% velocità tiro)",
      color: "#00e5ff"
    },
    {
      id: "samurai",
      name: "Leo Ronin del Giappone Feudale",
      role: "Fantasista di Taglio",
      ability: "Fendente della Katana (Tiro ad effetto ad angolo retto)",
      color: "#ff0054"
    },
    {
      id: "wizard",
      name: "Leo Arcimago della Focaccia",
      role: "Regista Arcano",
      ability: "Teletrasporto Istantaneo della palla",
      color: "#9d4edd"
    },
    {
      id: "vampire",
      name: "Lord Leo Vampiro della Notte",
      role: "Centrocampista Ruba-Palloni",
      ability: "Assorbe il fiato del portiere avversario",
      color: "#7209b7"
    },
    {
      id: "retro70",
      name: "Leo Anziano degli Anni '70",
      role: "Libero d'Altri Tempi",
      ability: "Fumata di Pipa (Nube di fumo che acceca la difesa)",
      color: "#ffb703"
    }
  ];

  let onExitCallback = null;
  let activeAnimId = null;

  function getStageAlt() {
    return document.getElementById("stageAlt");
  }

  function setChap(t) {
    const el = document.getElementById("chap");
    if (el) el.textContent = t;
  }

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#76ff03; color:#0d1b2a; font-weight:900;">${who}</span><span class="t">${html}</span>`;
    }
    if (window.addDialogueLog) {
      window.addDialogueLog(who, html);
    }
  }

  function showButtons(list, one) {
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
      if (o.sub) {
        const s = document.createElement("small");
        s.textContent = o.sub;
        b.appendChild(s);
      }
      b.onclick = () => {
        if (window.haptic) window.haptic(15);
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  function playSynth(freq, type = "sine", dur = 0.12, vol = 0.15) {
    try {
      const actx = window.audioCtx || (window.AudioContext && new window.AudioContext());
      if (!actx) return;
      if (actx.state === "suspended") actx.resume();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(vol, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + dur);
    } catch (e) {}
  }

  function clearLoops() {
    if (activeAnimId) {
      cancelAnimationFrame(activeAnimId);
      activeAnimId = null;
    }
  }

  function activateCitadelView() {
    clearLoops();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "citadel" });
    }
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = true;
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "block";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.style.zIndex = "10";
    }
    return alt;
  }

  function closeCitadelStage() {
    clearLoops();
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = true;
      alt.style.display = "none";
      alt.innerHTML = "";
    }
    const cv = document.getElementById("cv");
    if (cv) cv.hidden = false;
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "scene", bg: "title" });
    }
  }

  // ================= 1. HUB DELLA CITTADELLA =================
  function openCitadelMenu(onBack) {
    onExitCallback = onBack;
    showHub();
  }

  function showHub() {
    setChap("Rick & Morty · La Cittadella dei Leo");
    const prog = getProgress();
    const alt = activateCitadelView();

    if (alt) {
      alt.innerHTML = `
        <div style="position:absolute; inset:0; background:linear-gradient(135deg, #10002b 0%, #240046 50%, #76ff03 100%);"></div>
        
        <!-- Portale verde acido rotante -->
        <div style="position:absolute; top:25px; left:50%; transform:translateX(-50%); width:120px; height:120px; border-radius:50%; background:radial-gradient(circle, #76ff03 20%, #38b000 60%, transparent 80%); box-shadow:0 0 25px #76ff03; opacity:0.85;"></div>

        <div style="position:relative; z-index:2; height:100%; padding:12px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <div style="font-family:var(--display); font-size:16px; color:#76ff03; text-shadow:2px 2px 0 #000, 0 0 10px #76ff03;">
                🧪 LA CITTADELLA DEI LEO
              </div>
              <div style="font-size:11px; color:#fff;">
                Consiglio Multiversale dei Bomber · Dimensione C-137
              </div>
            </div>
            <div style="background:rgba(0,0,0,0.6); border:1.5px solid #76ff03; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff; text-align:right;">
              <div>Fluido Portale: <b>${prog.portalFluid}%</b></div>
              <div style="color:var(--gold); font-size:10px;">Varianti: <b>${prog.recruited.length}/5</b></div>
            </div>
          </div>

          <div style="background:rgba(10,5,30,0.85); border:1px solid #76ff03; border-radius:8px; padding:6px 10px; font-size:11px; color:#fff;">
            Squadra schierata: <b>${prog.squad.map(id => VARIANTS.find(v => v.id === id)?.name.split(" ")[1]).join(" + ")}</b>
          </div>
        </div>
      `;
    }

    if (prog.evilLeoDefeated) {
      showText(
        "Leo Moretti Originale",
        `«Evil Leo è stato sconfitto e rinchiuso nella dimensione dei criceti giganti! La Cittadella dei Leo è finalmente libera e i varchi sono aperti per ogni amichevole cosmica!»`
      );
    } else {
      showText(
        "Rick-Nonna C-137",
        `«*Burp* Leo, ascoltami! <b>Evil Leo</b> (la tua versione con la benda sull'occhio e il gel quantico nei capelli) ha preso il comando della Cittadella!<br>
        Costringe tutte le tue varianti a giocare in gabbie spaziali senza sosta. Prendi questa <b>Portal Gun</b> modificata a pesto, recluta altre varianti e vai a fargli il gol della vita prima che faccia esplodere la linea temporale!»`
      );
    }

    const b = [
      {
        label: "⚽ 1. Sfida l'Armata di Evil Leo in Gabbia Quantica",
        sub: "Usa la Portal Gun per segnare e liberare le varianti prigioniere",
        cls: "hot",
        fn: startPortalMatch
      },
      {
        label: "👥 2. Squad Builder Multiversale",
        sub: "Scegli quali 2 varianti di Leo schierare al tuo fianco",
        fn: showSquadBuilder
      },
      {
        label: "🧪 3. Recluta Nuove Varianti nei Varchi Dimensionali",
        sub: "Spendi 30% di Fluido Portale per trovare altre versioni di te stesso",
        disabled: prog.recruited.length >= 5 || prog.portalFluid < 30,
        fn: recruitVariant
      },
      {
        label: "◂ Torna al Menu Principale",
        cls: "pick",
        fn: () => {
          closeCitadelStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ];

    showButtons(b, true);
  }

  // ================= 2. SQUAD BUILDER MULTIVERSALE =================
  function showSquadBuilder() {
    const prog = getProgress();
    showText(
      "Banco Tattico Multiverso",
      `«Scegli quali varianti di Leo compongono il tuo tandem d'attacco per combinare abilità bioniche, magiche e samurai!»`
    );

    const b = prog.recruited.map(id => {
      const v = VARIANTS.find(x => x.id === id);
      const isSelected = prog.squad.includes(id);
      return {
        label: `${isSelected ? "★ IN CAMPO: " : ""}${v.name}`,
        sub: `${v.role} · ${v.ability}`,
        cls: isSelected ? "hot" : "",
        fn: () => {
          if (isSelected && prog.squad.length > 1) {
            prog.squad = prog.squad.filter(x => x !== id);
          } else if (!isSelected) {
            if (prog.squad.length >= 2) prog.squad.shift();
            prog.squad.push(id);
          }
          saveProgress(prog);
          playSynth(600, "triangle", 0.15, 0.2);
          showSquadBuilder();
        }
      };
    });

    b.push({ label: "✓ Conferma Formazione e Torna all'Hub", cls: "hot", fn: showHub });
    showButtons(b, true);
  }

  function recruitVariant() {
    const prog = getProgress();
    const missing = VARIANTS.filter(v => !prog.recruited.includes(v.id));
    if (missing.length === 0) return;

    prog.portalFluid -= 30;
    const newV = missing[0];
    prog.recruited.push(newV.id);
    saveProgress(prog);

    playSynth(880, "sine", 0.3, 0.3);
    if (window.toast) window.toast(`🌀 Trovato: ${newV.name}!`, "success", "✨");

    showText(
      newV.name,
      `«*Zzzzt* Eccomi qua, compare! Evil Leo mi teneva congelato in un blocco di carbonite. Al tuo comando, il mio <b>${newV.ability}</b> è pronto a bucare le reti!»`
    );
    showButtons([{ label: "Aggiungi alla rosa ▸", cls: "hot", fn: showHub }]);
  }

  // ================= 3. PARTITA PORTAL GUN =================
  function startPortalMatch() {
    const prog = getProgress();
    setChap("La Gabbia di Evil Leo · Scontro Quantico");
    const alt = activateCitadelView();
    if (!alt) return;

    alt.innerHTML = `
      <canvas id="citMatchCv" width="320" height="200" style="display:block; width:100%; height:100%; background:#10002b;"></canvas>
      <div style="position:absolute; top:4px; left:6px; right:6px; display:flex; justify-content:space-between; align-items:center; background:rgba(20,0,40,0.9); border:1px solid #76ff03; border-radius:6px; padding:3px 8px; font-size:11px; color:#fff; z-index:10;">
        <span style="color:#76ff03; font-weight:bold;">VS EVIL LEO</span>
        <span id="citScoreEl" style="color:var(--gold); font-size:13px; font-weight:bold;">0 – 0</span>
        <span id="citTurnsEl" style="color:#00e5ff;">Turno: <b>1 / 4</b></span>
      </div>
    `;

    const canvas = document.getElementById("citMatchCv");
    const ctx = canvas.getContext("2d");

    let myGoals = 0;
    let evilGoals = 0;
    let turn = 1;
    let portalGunAngle = -0.3;
    let ball = { x: 50, y: 145, vx: 0, vy: 0, flying: false };
    let evilGk = { y: 80, vy: 2.2, h: 36 };

    function shootPortalGun(tactic) {
      if (ball.flying) return;
      ball.flying = true;

      if (tactic === "portal_teleport") {
        ball.vx = 9.0;
        ball.vy = -1.8;
        playSynth(920, "sine", 0.25, 0.3);
        if (window.toast) window.toast("🌀 PORTAL GUN SPARATA! LA PALLA SCOMPARE E RIAPPARE SOTTO L'INCROCIO!", "success", "⚡");
      } else if (tactic === "laser_curva") {
        ball.vx = 8.0;
        ball.vy = -0.5;
        playSynth(700, "sawtooth", 0.2, 0.25);
      }

      setTimeout(() => {
        ball.flying = false;
        ball.x = 50; ball.y = 145;

        // Gol
        const isGoal = tactic === "portal_teleport" || Math.random() < 0.65;
        if (isGoal) {
          myGoals++;
          playSynth(980, "sine", 0.35, 0.35);
          if (window.toast) window.toast("⚽ GOOOL QUANTICO CONTRO EVIL LEO!", "success", "🌟");
        } else {
          playSynth(180, "sawtooth", 0.2, 0.25);
          if (window.toast) window.toast("Evil Leo devia il tiro con lo scudo!", "error", "🛡️");
        }

        if (Math.random() < 0.35) {
          evilGoals++;
          if (window.toast) window.toast("Evil Leo segna con il raggio mortale!", "error", "💥");
        }

        turn++;
        const sc = document.getElementById("citScoreEl");
        const tu = document.getElementById("citTurnsEl");
        if (sc) sc.innerHTML = `${myGoals} – ${evilGoals}`;
        if (tu) tu.innerHTML = `Turno: <b>${Math.min(4, turn)} / 4</b>`;

        if (turn > 4) {
          endCitadelMatch();
        } else {
          updateCitUi();
        }
      }, 1200);
    }

    function updateCitUi() {
      showText(
        "Evil Leo (Benda sull'Occhio)",
        `«Sei patetico, Leo C-137! Pensi che la tua focaccia possa competere con l'intelletto supremo della Cittadella? Questo stadio è la tua tomba temporale!»`
      );
      showButtons([
        {
          label: "🧪 1. Spara la Portal Gun (Teletrasporto nel Varco Verde)",
          sub: "La palla attraversa la realtà e spunta alle spalle del portiere",
          cls: "hot",
          fn: () => shootPortalGun("portal_teleport")
        },
        {
          label: "⚡ 2. Tiro al Laser della Variante Cyborg",
          sub: "Traiettoria fulminea a sfondare il telaio",
          cls: "hot",
          fn: () => shootPortalGun("laser_curva")
        },
        {
          label: "◂ Ritirati dal Duello Quantico",
          fn: () => { clearLoops(); showHub(); }
        }
      ]);
    }
    updateCitUi();

    function citLoop() {
      evilGk.y += evilGk.vy;
      if (evilGk.y < 35 || evilGk.y > 140) evilGk.vy = -evilGk.vy;

      if (ball.flying) {
        ball.x += ball.vx;
        ball.y += ball.vy;
      }

      ctx.fillStyle = "#10002b";
      ctx.fillRect(0, 0, 320, 200);

      // Portale verde a mezz'aria
      ctx.beginPath();
      ctx.ellipse(180, 80, 16, 32, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(118, 255, 3, 0.4)";
      ctx.fill();
      ctx.strokeStyle = "#76ff03";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Porta nemica
      ctx.strokeStyle = "#ff0054";
      ctx.lineWidth = 3;
      ctx.strokeRect(280, 40, 30, 120);

      // Evil Leo in porta
      ctx.fillStyle = "#ff0054";
      ctx.fillRect(278, evilGk.y, 14, evilGk.h);
      ctx.fillStyle = "#000";
      ctx.fillRect(276, evilGk.y + 6, 6, 4); // Benda nera sull'occhio

      // Leo
      ctx.fillStyle = "#3fa7ff";
      ctx.fillRect(45, 130, 16, 32);

      // Palla
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      activeAnimId = requestAnimationFrame(citLoop);
    }

    function endCitadelMatch() {
      clearLoops();
      const won = myGoals > evilGoals;
      if (won) {
        prog.evilLeoDefeated = true;
        prog.portalFluid = 100;
        saveProgress(prog);
        if (window.addCoins) window.addCoins(40);

        showText(
          "Evil Leo",
          `«NOOO! Com'è possibile?! La mia equazione calcistica era perfetta! Maledetto tu e il tuo pesto tachionico!»`
        );
        showButtons([
          {
            label: "🏆 Libera la Cittadella e Ritorna da Eroe del Multiverso!",
            cls: "hot",
            fn: () => {
              if (window.toast) window.toast("👑 CITTADELLA DEI LEO LIBERATA!", "success", "🏆");
              showHub();
            }
          }
        ], true);
      } else {
        showText(
          "Evil Leo",
          `«Vittoria per me! Ricarica il tuo fluido portale e riprovaci, dilettante!»`
        );
        showButtons([
          { label: "Riprova lo Scontro ▸", cls: "hot", fn: startPortalMatch },
          { label: "◂ Torna all'Hub", fn: showHub }
        ], true);
      }
    }

    activeAnimId = requestAnimationFrame(citLoop);
  }

  window.openCitadelStoryMenu = openCitadelMenu;
})();
