// js/story-navigator.js
// ============================================================================
// Navigazione della Storia, Rigiocabilità & Memoria dei Bivi Narrativi
// ============================================================================
// 1. Segnaposto "Già scelto" nei dialoghi narrativi:
//    Tiene traccia delle risposte scelte nei playthrough precedenti e attuali,
//    mostrando un piccolo indicatore visivo discreto (● Già scelto) e testo attenuato,
//    mentre evidenzia le scelte inesplorate (✦ Mai provato) per facilitare
//    la caccia a tutti i trofei, bivi e finali.
//
// 2. Pulsante "Skip / Avanzamento Veloce" per scene già viste:
//    Scorre rapidamente i dialoghi già presenti nel log o già visti in precedenza,
//    fermandosi automaticamente al primo bivio nuovo, a dialoghi mai visti,
//    o a partite / allenamenti / finali.
// ============================================================================

(function () {
  "use strict";

  const K_CHOSEN_OPTIONS = "ali-di-rondine.chosen-options";
  const K_SEEN_DIALOGUES = "ali-di-rondine.seen-dialogues";
  const K_SKIP_SPEED = "ali-di-rondine.skip-speed";

  // In-memory sets for O(1) lightning-fast lookups
  const chosenOptionsSet = new Set();
  const seenDialoguesSet = new Set();

  let isSkipping = false;
  let skipTimer = null;
  let currentSkipStepFn = null;
  let saveDebounceTimer = null;

  // --------------------------------------------------------------------------
  // Persistenza & Caricamento
  // --------------------------------------------------------------------------
  function loadPersistedData() {
    try {
      const chosenRaw = localStorage.getItem(K_CHOSEN_OPTIONS);
      if (chosenRaw) {
        const arr = JSON.parse(chosenRaw);
        if (Array.isArray(arr)) {
          arr.forEach((k) => chosenOptionsSet.add(String(k)));
        }
      }
    } catch (e) {
      console.warn("[StoryNav] Errore lettura chosen-options:", e);
    }

    try {
      const seenRaw = localStorage.getItem(K_SEEN_DIALOGUES);
      if (seenRaw) {
        const arr = JSON.parse(seenRaw);
        if (Array.isArray(arr)) {
          arr.forEach((k) => seenDialoguesSet.add(String(k)));
        }
      }
    } catch (e) {
      console.warn("[StoryNav] Errore lettura seen-dialogues:", e);
    }
  }

  function savePersistedData() {
    if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
      try {
        localStorage.setItem(K_CHOSEN_OPTIONS, JSON.stringify([...chosenOptionsSet]));
        localStorage.setItem(K_SEEN_DIALOGUES, JSON.stringify([...seenDialoguesSet]));
      } catch (e) {
        console.warn("[StoryNav] Errore salvataggio persistenza:", e);
      }
    }, 400);
  }

  // --------------------------------------------------------------------------
  // Hashing & Chiavi Normalizzate per Dialoghi
  // --------------------------------------------------------------------------
  function normalizeText(text) {
    if (!text) return "";
    return String(text)
      .replace(/<[^>]*>/g, " ")
      .replace(/[«»""''.,;:!?…\-–—\s]/g, "")
      .toLowerCase()
      .trim();
  }

  function getDialogueKey(who, text) {
    if (!text) return "";
    const clean = normalizeText(text);
    const speaker = (who || "").toLowerCase();
    // Prendi i primi 70 caratteri normalizzati per una chiave compatta e univoca
    return `${speaker}:${clean.slice(0, 70)}`;
  }

  function markDialogueSeen(who, text) {
    if (!text) return;
    const key = getDialogueKey(who, text);
    if (!key) return;
    if (!seenDialoguesSet.has(key)) {
      seenDialoguesSet.add(key);
      savePersistedData();
    }
  }

  function isDialogueSeen(who, text) {
    if (!text) return false;
    const key = getDialogueKey(who, text);
    if (seenDialoguesSet.has(key)) return true;

    // Controllo anche nel log della sessione corrente di dialog-log.js
    if (typeof window.isDialogueInLog === "function") {
      try {
        if (window.isDialogueInLog(who, text)) return true;
      } catch (e) {}
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // Gestione Scelte nei Bivi Narrativi ("Già scelto")
  // --------------------------------------------------------------------------
  function getForkKey(s, stepIndex) {
    const chap = (s && s.chap) ? s.chap : `step_${stepIndex}`;
    const text = (s && s.choice && s.choice.text) ? s.choice.text.slice(0, 45) : `fork_${stepIndex}`;
    return `${chap}#${text}`;
  }

  function getChoiceOptionKey(s, stepIndex, option) {
    const fork = getForkKey(s, stepIndex);
    const label = (option && option.label) ? option.label : "";
    return `${fork}#${label}`;
  }

  function isOptionAlreadyChosen(keyOrOption, s, stepIndex) {
    if (typeof keyOrOption === "string") {
      return chosenOptionsSet.has(keyOrOption);
    }
    if (keyOrOption && s) {
      const key = getChoiceOptionKey(s, stepIndex, keyOrOption);
      return chosenOptionsSet.has(key);
    }
    return false;
  }

  function recordOptionChosen(keyOrOption, s, stepIndex) {
    let key = "";
    if (typeof keyOrOption === "string") {
      key = keyOrOption;
    } else if (keyOrOption && s) {
      key = getChoiceOptionKey(s, stepIndex, keyOrOption);
    }
    if (!key) return;
    if (!chosenOptionsSet.has(key)) {
      chosenOptionsSet.add(key);
      savePersistedData();
    }
  }

  function getForkStats(s, stepIndex) {
    if (!s || !s.choice || !Array.isArray(s.choice.options)) {
      return { total: 0, chosen: 0, isAllChosen: false, isBrandNew: true };
    }
    const fork = getForkKey(s, stepIndex);
    const opts = s.choice.options;
    let chosenCount = 0;
    opts.forEach((opt) => {
      const k = `${fork}#${opt.label}`;
      if (chosenOptionsSet.has(k)) chosenCount++;
    });
    return {
      total: opts.length,
      chosen: chosenCount,
      isAllChosen: chosenCount >= opts.length && opts.length > 0,
      isBrandNew: chosenCount === 0
    };
  }

  // Seeding automatico delle scelte da salvataggi esistenti per non perdere la cronologia
  function seedFromSaveState(S) {
    if (!S || !S.f) return;
    try {
      const flags = S.f;
      // Correlazione di flag noti delle stagioni con i bivi
      const flagMap = {
        style: {
          tiro: "Prologo · Borgo Marino#Cosa provi a fare?#Il tiro della Rondine",
          drib: "Prologo · Borgo Marino#Cosa provi a fare?#Un dribbling stretto",
          squadra: "Prologo · Borgo Marino#Cosa provi a fare?#Passaggio di prima"
        },
        deal: {
          preso: "Capitolo 1 · La trattoria#Chi ti ha detto della trattoria?#Mio padre",
          rifiutato: "Capitolo 1 · La trattoria#Chi ti ha detto della trattoria?#Il vecchio giornale"
        },
        fedechoice: {
          insieme: "Capitolo 9 · Il padre di Fede#Cosa dici a Federico?#«Lo facciamo insieme»",
          aldo: "Capitolo 9 · Il padre di Fede#Cosa dici a Federico?#Affronta Aldo Lanza di persona",
          dopo: "Capitolo 9 · Il padre di Fede#Cosa dici a Federico?#«Pensa alla finale. Poi vediamo»"
        },
        rita: {
          via: "Capitolo 4 · Il segreto di Rita#Mandala via",
          tieni: "Capitolo 4 · Il segreto di Rita#Tienila in trattoria"
        },
        tommy: {
          firma: "Capitolo 5 · Il contratto di Tommy#Fallo firmare",
          ferma: "Capitolo 5 · Il contratto di Tommy#Fermalo"
        }
      };

      Object.entries(flagMap).forEach(([flagName, mapping]) => {
        const val = flags[flagName];
        if (val && mapping[val]) {
          chosenOptionsSet.add(mapping[val]);
        }
      });
      savePersistedData();
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // Motore di Skip / Avanzamento Veloce per Scene Già Viste
  // --------------------------------------------------------------------------
  function isStorySkipActive() {
    return isSkipping;
  }

  function getSkipDelay() {
    try {
      const speed = localStorage.getItem(K_SKIP_SPEED) || "veloce";
      if (speed === "istantaneo") return 25;
      if (speed === "rapido") return 50;
      return 75; // "veloce" (standard fluido e reattivo)
    } catch {
      return 75;
    }
  }

  function startStorySkip(stepFn) {
    if (skipTimer) {
      clearTimeout(skipTimer);
      skipTimer = null;
    }
    isSkipping = true;
    currentSkipStepFn = stepFn || null;

    if (window.toast) {
      window.toast("⏩ Skip attivo: avanzo tra le scene già viste...", "info", "⏩");
    }

    showSkipFloatingBanner();

    if (typeof stepFn === "function") {
      stepFn();
    }
  }

  function stopStorySkip(reason) {
    if (skipTimer) {
      clearTimeout(skipTimer);
      skipTimer = null;
    }
    const wasSkipping = isSkipping;
    isSkipping = false;
    currentSkipStepFn = null;

    hideSkipFloatingBanner();

    if (wasSkipping && reason === "manuale" && window.toast) {
      window.toast("Avanzamento veloce interrotto.", "info", "⏹️");
    }
  }

  function scheduleNext(nextFn) {
    if (!isSkipping) return;
    if (skipTimer) clearTimeout(skipTimer);
    const delay = getSkipDelay();
    skipTimer = setTimeout(() => {
      if (isSkipping && typeof nextFn === "function") {
        nextFn();
      }
    }, delay);
  }

  // --------------------------------------------------------------------------
  // Banner e Controlli Grafici durante lo Skip
  // --------------------------------------------------------------------------
  let skipFloatingEl = null;

  function ensureSkipFloatingElement() {
    if (skipFloatingEl && document.body.contains(skipFloatingEl)) return skipFloatingEl;
    skipFloatingEl = document.createElement("div");
    skipFloatingEl.id = "storySkipFloatingBanner";
    skipFloatingEl.className = "story-skip-banner";
    skipFloatingEl.style.cssText = `
      position: fixed;
      bottom: 74px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: none;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 58, 99, 0.95));
      border: 1.5px solid #38bdf8;
      border-radius: 24px;
      padding: 6px 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.4);
      color: #e0f2fe;
      font-size: 12px;
      font-weight: 700;
      font-family: var(--body, sans-serif);
      backdrop-filter: blur(4px);
      cursor: pointer;
      user-select: none;
      animation: pulseSkipBanner 1.6s infinite alternate ease-in-out;
    `;
    skipFloatingEl.innerHTML = `
      <span style="display:flex; align-items:center; gap:6px;">
        <span style="color:#38bdf8; font-size:14px; animation:spinFast 1s linear infinite;">⏩</span>
        <span>Avanzamento Veloce scene già viste...</span>
      </span>
      <span style="background:rgba(239, 68, 68, 0.85); color:#fff; border-radius:12px; padding:2px 8px; font-size:10px; font-weight:800; border:1px solid #fca5a5;">
        ⏹️ Tocca per fermare
      </span>
    `;

    skipFloatingEl.onclick = (e) => {
      e.stopPropagation();
      stopStorySkip("manuale");
    };

    document.body.appendChild(skipFloatingEl);
    return skipFloatingEl;
  }

  function showSkipFloatingBanner() {
    const el = ensureSkipFloatingElement();
    el.style.display = "flex";
  }

  function hideSkipFloatingBanner() {
    if (skipFloatingEl) {
      skipFloatingEl.style.display = "none";
    }
  }

  // --------------------------------------------------------------------------
  // Scorciatoie da Tastiera & Interazione Tattile
  // --------------------------------------------------------------------------
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("keydown", (e) => {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;

      if (isSkipping) {
        if (e.key === "Escape" || e.key === " " || e.key === "s" || e.key === "S") {
          e.preventDefault();
          stopStorySkip("manuale");
          return;
        }
      } else {
        if (e.key === "s" || e.key === "S") {
          // Se c'è un pulsante Skip attivo in pagina, simula il click
          const skipBtn = document.querySelector(".choices button.skip-btn, #textQuickSkipBtn");
          if (skipBtn && !skipBtn.disabled) {
            e.preventDefault();
            skipBtn.click();
          }
        }
      }
    });
  }

  // Tap su canvas o area di testo ferma lo skip per sicurezza
  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("pointerdown", (e) => {
      if (!isSkipping) return;
      const banner = document.getElementById("storySkipFloatingBanner");
      if (banner && banner.contains(e.target)) return;
      const stopBtn = document.querySelector(".skip-active-btn");
      if (stopBtn && stopBtn.contains(e.target)) return;
      // Se tocca canvas o box testo durante lo skip, arrestalo
      const cv = document.getElementById("cv");
      const textBox = document.getElementById("text");
      if ((cv && cv.contains(e.target)) || (textBox && textBox.contains(e.target))) {
        stopStorySkip("tocco");
      }
    });
  }

  // --------------------------------------------------------------------------
  // Statistiche e Reset per Impostazioni
  // --------------------------------------------------------------------------
  function getStats() {
    return {
      seenDialoguesCount: seenDialoguesSet.size,
      chosenOptionsCount: chosenOptionsSet.size
    };
  }

  function resetExplorationHistory() {
    chosenOptionsSet.clear();
    seenDialoguesSet.clear();
    try {
      localStorage.removeItem(K_CHOSEN_OPTIONS);
      localStorage.removeItem(K_SEEN_DIALOGUES);
    } catch (e) {}
  }

  // Inizializzazione al caricamento
  loadPersistedData();

  // Export API pubblica
  window.__storyNav = {
    isDialogueSeen,
    markDialogueSeen,
    isOptionAlreadyChosen,
    recordOptionChosen,
    getChoiceOptionKey,
    getForkKey,
    getForkStats,
    seedFromSaveState,
    isStorySkipActive,
    startStorySkip,
    stopStorySkip,
    scheduleNext,
    getStats,
    resetExplorationHistory
  };

  // Alias comodi per integrazione immediata in game.js
  window.isDialogueSeen = isDialogueSeen;
  window.markDialogueSeen = markDialogueSeen;
  window.isOptionAlreadyChosen = isOptionAlreadyChosen;
  window.recordOptionChosen = recordOptionChosen;
  window.startStorySkip = startStorySkip;
  window.stopStorySkip = stopStorySkip;
  window.isStorySkipActive = isStorySkipActive;

})();
