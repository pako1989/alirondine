// ================= v21 · NOIR COSTIERO: IL PESCHERECCIO FANTASMA =================
// Saga investigativa interattiva (Stile True Detective & Breaking Bad ligure).
// Grafica visuale su Stage (Asset del peschereccio nella nebbia, hotspot cliccabili, interrogatori con prove).
(function () {
  const K_NOIR = "ali-di-rondine.noir-progress";

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(K_NOIR)) || { step: 0, clues: [], won: false };
    } catch {
      return { step: 0, clues: [], won: false };
    }
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_NOIR, JSON.stringify(p));
    } catch {}
  }

  let onExitCallback = null;
  let cluesFound = [];
  let currentCaseStep = "intro";

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
      el.innerHTML = `<span class="who" style="background:#546e7a; color:#fff;">${who}</span><span class="t">${html}</span>`;
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
        c.innerHTML = "";
        if (o.fn) o.fn();
      };
      c.appendChild(b);
    });
  }

  function closeNoirStage() {
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = true;
      alt.style.display = "none";
      alt.innerHTML = "";
    }
  }

  function openNoirStoryMenu(onBack) {
    onExitCallback = onBack;
    cluesFound = [];
    currentCaseStep = "hub";
    showNoirHub();
  }

  function showNoirHub() {
    closeNoirStage();
    setChap("Noir Costiero · Caso Sale Blu");
    const prog = getProgress();

    // Render misty crime scene in stageAlt
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.innerHTML = `
        <img src="img/noir_fishing_boat.jpg" alt="Peschereccio Fantasma" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.2) brightness(0.8) saturate(0.8);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(7,13,24,0.2) 0%, rgba(7,13,24,0.85) 90%);"></div>
        <div style="position:relative; z-index:2; padding:12px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-family:var(--display); font-size:16px; color:#90caf9; text-shadow:0 0 10px rgba(144,202,249,0.8);">IL PESCHERECCIO FANTASMA</div>
            <div style="font-size:12px; color:#b0bec5;">Indagine Notturna con Lina Esposito · Molo Vecchio</div>
          </div>
          <div style="background:rgba(255,255,255,0.1); border:1px solid #78909c; border-radius:6px; padding:4px 8px; font-size:11px; color:#eceff1;">
            Fascicolo: <b>Sale Blu</b>
          </div>
        </div>
      `;
    }

    showText(
      "Maresciallo Lina",
      `«Moretti, grazie di essere venuto a quest'ora. A mezzanotte la nebbia inghiotte il porto, ma quel vecchio peschereccio da traino, il <i>San Giuda</i>, è rientrato a fari spenti.<br>
      Abbiamo trovato tracce di una sostanza cristallina bluastra: doping sintetico puro per partite clandestine con scommesse milionarie. Dobbiamo salire a bordo e raccogliere le prove prima che salpino all'alba.»`
    );

    showButtons([
      {
        label: "🕵️ Sali a bordo e ispeziona il ponte",
        sub: "Cerca tracce, registri e campioni chimici sulla nave",
        cls: "hot",
        fn: () => startCrimeSceneInspection()
      },
      {
        label: "📁 Fascicolo del 'Dottore' (Il Chimico)",
        sub: "Chi c'è dietro il laboratorio del Sale Blu",
        fn: () => showDossier()
      },
      {
        label: "◂ Torna al Menu",
        fn: () => {
          closeNoirStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  function showDossier() {
    showText(
      "Lina",
      `«Il nostro uomo si fa chiamare 'Il Dottore'. Un tempo insegnava chimica a Genova, poi è sparito nei cantieri di Savona. Produce una polvere salina che moltiplica i riflessi e l'ossigenazione dei calciatori, ma distrugge il cuore.<br>
      Ha organizzato una squadra pirata: i <i>Marinai della Notte</i>. Se smascheriamo i suoi registri contabili, cadrà l'intera rete di combine!»`
    );

    showButtons([
      {
        label: "Andiamo al Peschereccio ▸",
        cls: "hot",
        fn: () => startCrimeSceneInspection()
      }
    ], true);
  }

  function startCrimeSceneInspection() {
    setChap("Ispezione · Il San Giuda");
    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.overflow = "hidden";

    renderInspectionStage();
  }

  const CLUES_DEF = [
    {
      id: "fiala",
      title: "🧪 Fiala di Sale Blu",
      desc: "Residui di cristalli fluorescenti che brillano nella stiva. Reagiscono all'acqua marina.",
      pos: { top: "52%", left: "42%" }
    },
    {
      id: "registro",
      title: "📖 Registro di Bordo Clandestino",
      desc: "Nomi di scommettitori illustri e quote su 5 partite truccate della scorsa coppa.",
      pos: { top: "38%", left: "68%" }
    },
    {
      id: "rete",
      title: "⚓ Rete a Doppia Fodera",
      desc: "La rete da pesca non conteneva pesce, ma casse stagne zavorrate con piombo.",
      pos: { top: "68%", left: "22%" }
    }
  ];

  function renderInspectionStage() {
    const alt = getStageAlt();
    if (!alt) return;

    const remaining = CLUES_DEF.filter(c => !cluesFound.includes(c.id));

    alt.innerHTML = `
      <div style="position:absolute; inset:0;">
        <img src="img/noir_fishing_boat.jpg" style="width:100%; height:100%; object-fit:cover; filter:contrast(1.2) brightness(0.85);">
        <div style="position:absolute; inset:0; background:rgba(6,12,24,0.35);"></div>
      </div>

      <!-- Top Inspector HUD -->
      <div style="position:absolute; top:6px; left:8px; right:8px; z-index:10; display:flex; justify-content:space-between; align-items:center; background:rgba(10,16,32,0.85); border:1px solid #78909c; border-radius:8px; padding:4px 10px; font-size:11px;">
        <span style="color:#90caf9; font-weight:bold;">🔍 SCENA DEL CRIMINE: SAN GIUDA</span>
        <span style="color:var(--gold);">Indizi Trovati: <b>${cluesFound.length}/3</b></span>
      </div>

      <!-- Interactive Hotspots on the ship -->
      ${CLUES_DEF.map(clue => {
        const found = cluesFound.includes(clue.id);
        return `
          <button type="button" class="noir-hotspot" onclick="window.__noirClickClue('${clue.id}')" style="position:absolute; top:${clue.pos.top}; left:${clue.pos.left}; z-index:15; transform:translate(-50%, -50%); background:${found ? '#4caf50' : '#00e5ff'}; color:#0e1424; border:2px solid #fff; border-radius:50%; width:36px; height:36px; font-size:16px; cursor:pointer; box-shadow:0 0 15px ${found ? '#4caf50' : '#00e5ff'}; display:flex; align-items:center; justify-content:center; animation:pulsePin 1.5s infinite alternate;">
            ${found ? '✓' : '🔍'}
          </button>
        `;
      }).join("")}

      <!-- Bottom Hint Bar -->
      <div style="position:absolute; bottom:6px; left:8px; right:8px; z-index:10; background:rgba(6,11,24,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:6px 10px; font-size:11px; color:#cfd8dc; text-align:center;">
        Tocca le icone 🔍 sul ponte della nave per ispezionare gli indizi chiave!
      </div>
    `;

    window.__noirClickClue = function (id) {
      const clue = CLUES_DEF.find(c => c.id === id);
      if (!clue) return;
      if (!cluesFound.includes(id)) {
        cluesFound.push(id);
      }
      if (window.toast) window.toast(`Indizio trovato: ${clue.title}`, "info", "🔍");
      showText("Lina", `<b>${clue.title}</b><br>${clue.desc}`);
      renderInspectionStage();

      if (cluesFound.length >= 3) {
        setTimeout(() => {
          triggerInterrogation();
        }, 1200);
      }
    };

    if (cluesFound.length === 0) {
      showText("Lina", `«Tocca i punti sospetti sul peschereccio: la cabina, la prua e le casse coperte dal telo cerato. Dobbiamo trovare almeno 3 prove inconfutabili!»`);
    }

    showButtons([
      {
        label: "🔍 Esamina la prua (Rete stagna)",
        sub: "Ispeziona le maglie della rete da traino",
        fn: () => window.__noirClickClue("rete")
      },
      {
        label: "🔍 Esamina la stiva (Cristalli blu)",
        sub: "Analizza le casse di salamoia",
        fn: () => window.__noirClickClue("fiala")
      },
      {
        label: "🔍 Esamina la cabina (Registro)",
        sub: "Fruga tra le carte del timoniere",
        fn: () => window.__noirClickClue("registro")
      },
      ...(cluesFound.length >= 3 ? [{
        label: "⚖️ Interroga il Dottore (Confronta le prove)",
        sub: "Metti alle strette il chimico clandestino!",
        cls: "hot",
        fn: () => triggerInterrogation()
      }] : [])
    ]);
  }

  function triggerInterrogation() {
    setChap("Interrogatorio · Il Dottore");
    showText(
      "Il Dottore",
      `«Maresciallo... ragazzino... non avete niente in mano. Quel sale serve solo per conservare le acciughe sotto sale per i ristoranti della Costa Azzurra. Siete saliti a bordo senza mandato!»`
    );

    showButtons([
      {
        label: "💥 «E allora cosa ci fa il tuo registro coi versamenti in franchi svizzeri?»",
        sub: "Contraddici la sua bugia con il Registro Clandestino",
        cls: "hot",
        fn: () => interrogateSuccess()
      },
      {
        label: "💥 «Le acciughe non brillano di blu fluorescente nell'acqua di mare!»",
        sub: "Contraddici la sua bugia con la Fiala di Sale Blu",
        cls: "hot",
        fn: () => interrogateSuccess()
      },
      {
        label: "💥 «Le reti hanno zavorre di piombo per nascondere le casse!»",
        sub: "Contraddici la sua bugia con la Rete a Doppia Fodera",
        cls: "hot",
        fn: () => interrogateSuccess()
      }
    ], true);
  }

  function interrogateSuccess() {
    if (window.triggerAnimeCutin) {
      window.triggerAnimeCutin({
        who: "Lina & Leo",
        shotName: "OBIEZIONE DECISIVA!",
        isEgo: false,
        sfxWord: "SCACCO MATTO!"
      });
    }

    showText(
      "Il Dottore",
      `«Maledizione... va bene, avete vinto. Ma il carico non lo prenderete mai senza prima battere i miei uomini. Hanno bevuto la soluzione due ore fa: sul campetto d'asfalto del Molo Vecchio non toccherete palla!»`
    );

    showButtons([
      {
        label: "⚽ Sfida Notturna contro i Marinai della Notte!",
        sub: "Match decisivo sul molo al chiaro di luna",
        cls: "hot",
        fn: () => runNightMatch()
      }
    ], true);
  }

  function runNightMatch() {
    setChap("Partita Notturna · Molo Vecchio");
    showText(
      "Leo",
      `<b>MINUTO 88' · RISULTATO 2–2</b><br>
      I Marinai della Notte corrono al doppio della velocità, ma il Sale Blu sta finendo il suo effetto e le loro gambe iniziano a tremare. Don Aurelio e Baciccia fanno il tifo dalla banchina con le torce accese!<br>
      Hai la palla tra i piedi al limite dell'area: come chiudi l'indagine?`
    );

    showButtons([
      {
        label: "⚽ Tiro della Rondine a Giro sul Secondo Palo",
        sub: "Traiettoria arcuata che scavalca il gigante del porto",
        cls: "hot",
        fn: () => finishNoirStory(true)
      },
      {
        label: "🤝 Filtrante per Tommy che taglia alle spalle",
        sub: "Spiazza tutta la difesa con un assist al bacio",
        cls: "hot",
        fn: () => finishNoirStory(true)
      }
    ], true);
  }

  function finishNoirStory(won) {
    const prog = getProgress();
    prog.won = true;
    saveProgress(prog);

    if (window.toast) window.toast("🏆 CASO RISOLTO: IL PESCHERECCIO FANTASMA!", "goal", "🕵️");

    showText(
      "Lina",
      `<b style="color:var(--gold); font-size:16px;">VITTORIA 3–2 AL 90'! RETE SEQUESTRATA!</b><br>
      «Ottimo lavoro, Leo Moretti. I carabinieri hanno bloccato il porto e confiscato l'intero carico di Sale Blu. Il Dottore è in manette. Borgo Marino stanotte dorme sonni tranquilli grazie al Rondine FC.»`
    );

    showButtons([
      {
        label: "Festeggia con Lina e la Trattoria Moretti 🏠",
        cls: "hot",
        fn: () => {
          closeNoirStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  window.openNoirStoryMenu = openNoirStoryMenu;
})();
