(function () {
  const $ = (id) => document.getElementById(id);
  const toastBox = $("toasts");
  const eventLog = $("eventLog");
  let badgeCount = 0;
  const MAX_TOASTS = 3;
  const MAX_LOG = 10;

  function showToast(msg, type = "info", icon = "") {
    if (!toastBox) return;
    while (toastBox.children.length >= MAX_TOASTS) {
      toastBox.removeChild(toastBox.firstChild);
    }
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="icon">${icon}</span><span class="msg">${msg}</span>`;
    toastBox.appendChild(t);
    setTimeout(() => {
      t.classList.add("hide");
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function addLog(msg) {
    if (!eventLog) return;
    const time = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
    const item = document.createElement("div");
    item.className = "log-item";
    item.innerHTML = `<span class="log-time">${time}</span>${msg}`;
    eventLog.insertBefore(item, eventLog.children[1] || null);
    while (eventLog.children.length > MAX_LOG + 1) {
      eventLog.removeChild(eventLog.lastChild);
    }
  }

  function showBadge() {
    const btn = $("gmenu");
    if (!btn) return;
    let badge = btn.querySelector(".badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "badge";
      btn.appendChild(badge);
    }
    badge.textContent = ++badgeCount;
  }

  function clearBadge() {
    const btn = $("gmenu");
    if (!btn) return;
    const badge = btn.querySelector(".badge");
    if (badge) badge.remove();
    badgeCount = 0;
  }

  function toggleLog() {
    if (!eventLog) return;
    eventLog.classList.toggle("show");
  }

  function checkSeasonalEvents() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    if (month === 11 && day >= 20 && day <= 31) {
      showToast("Evento di Natale attivo nel Borgo!", "success", "🎄");
      addLog("Evento di Natale attivo");
    } else if (month === 1 && day >= 1 && day <= 15) {
      showToast("Carnevale a Borgo Marino!", "info", "🎭");
      addLog("Carnevale attivo");
    } else if (month >= 5 && month <= 7) {
      showToast("Estate a Borgo Marino: beach soccer!", "info", "☀️");
      addLog("Evento estivo attivo");
    }
  }

  window.toast = showToast;
  window.addLog = addLog;
  window.showBadge = showBadge;
  window.clearBadge = clearBadge;
  window.toggleLog = toggleLog;
  window.checkSeasonalEvents = checkSeasonalEvents;

  // ================= FEEDBACK APTICO AVANZATO (HAPTIC ENGINE) =================
  const HAPTIC_STORAGE_KEY = "ali-di-rondine.haptic-mode";
  const HAPTIC_MODES = [
    { id: "full", label: "Pieno (Tutto attivo)", icon: "📳", desc: "Vibrazione completa su gol, tiri, contrasti, parate, eventi e pulsanti" },
    { id: "match", label: "Solo Partite (Gol & Azioni)", icon: "📳", desc: "Vibrazione solo per gol, tiri speciali, pali, parate e fischi" },
    { id: "off", label: "Disattivato", icon: "📴", desc: "Nessuna vibrazione" }
  ];

  let curHapticIdx = 0;
  try {
    const savedHaptic = localStorage.getItem(HAPTIC_STORAGE_KEY) || "full";
    const foundH = HAPTIC_MODES.findIndex(m => m.id === savedHaptic);
    if (foundH >= 0) curHapticIdx = foundH;
  } catch (e) {}

  const HAPTIC_PATTERNS = {
    tap: 12,
    hot: 24,
    kick: 35,
    whistle: [70, 40, 120],
    special: [35, 25, 60, 30, 140],
    goal: [90, 40, 90, 40, 190, 50, 120],
    oppGoal: [150, 70, 140],
    post: [60, 30, 80],
    save: [100, 30, 75],
    tackle: [75, 35, 85],
    heartbeat: [40, 120, 40],
    slot: [20, 30, 20]
  };

  function getHapticMode() {
    return HAPTIC_MODES[curHapticIdx].id;
  }

  function updateHapticButton() {
    const btn = $("hapticBtn");
    if (!btn) return;
    const mode = HAPTIC_MODES[curHapticIdx];
    const lbl = btn.querySelector("#hapticLbl") || btn.querySelector("span");
    const modeShort = mode.id === "off" ? "Aptico: OFF" : mode.id === "match" ? "Aptico: Match" : "Aptico: Full";
    if (lbl) {
      lbl.textContent = modeShort;
      btn.innerHTML = `${mode.icon} <span id="hapticLbl">${modeShort}</span>`;
    } else {
      btn.innerHTML = `${mode.icon} <span id="hapticLbl">${modeShort}</span>`;
    }
    btn.title = `Feedback Aptico: ${mode.label} (Clicca per cambiare)`;
    btn.style.opacity = mode.id === "off" ? "0.5" : "1";
    btn.setAttribute("aria-label", `Feedback Aptico: ${mode.label}`);
  }

  function setHapticMode(modeId, notify = false) {
    const idx = HAPTIC_MODES.findIndex(m => m.id === modeId);
    if (idx >= 0) curHapticIdx = idx;
    const mode = HAPTIC_MODES[curHapticIdx];
    try { localStorage.setItem(HAPTIC_STORAGE_KEY, mode.id); } catch (e) {}
    updateHapticButton();
    if (notify) {
      showToast(`Aptico: ${mode.label}`, "info", mode.icon);
      if (mode.id !== "off" && typeof navigator !== "undefined" && navigator.vibrate) {
        try { navigator.vibrate(mode.id === "full" ? [25, 35, 50] : 35); } catch (e) {}
      }
    }
  }

  function cycleHapticMode() {
    curHapticIdx = (curHapticIdx + 1) % HAPTIC_MODES.length;
    setHapticMode(HAPTIC_MODES[curHapticIdx].id, true);
  }

  function triggerHaptic(type = "tap") {
    const mode = getHapticMode();
    if (mode === "off") return;
    if (mode === "match" && (type === "tap" || type === "hot" || type === "slot")) return;

    const pattern = HAPTIC_PATTERNS[type] != null ? HAPTIC_PATTERNS[type] : (typeof type === "number" || Array.isArray(type) ? type : 15);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  window.haptic = function (pattern = 15) {
    const mode = getHapticMode();
    if (mode === "off") return;
    if (mode === "match" && typeof pattern === "number" && pattern < 30) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  };

  window.hapticTrigger = triggerHaptic;
  window.cycleHapticMode = cycleHapticMode;
  window.setHapticMode = setHapticMode;
  window.getHapticMode = getHapticMode;
  window.updateHapticButton = updateHapticButton;

  // Risposta aptica globale al tocco sui pulsanti
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn && !btn.disabled) {
      triggerHaptic(btn.classList.contains("hot") ? "hot" : "tap");
    }
  }, { passive: true });

  const saveIndicator = $("saveIndicator");
  let saveTimeout = null;
  window.showSaveIndicator = function () {
    if (!saveIndicator) return;
    saveIndicator.classList.add("show");
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveIndicator.classList.remove("show"), 1500);
  };

  const THEMES = [
    { id: "classic", name: "Classico Rondine", cls: "", icon: "⚽" },
    { id: "vintage", name: "Gazzetta Vintage", cls: "theme-vintage", icon: "📰" },
    { id: "neon", name: "Neon Costa", cls: "theme-neon", icon: "✨" },
    { id: "arcade", name: "Arcade Retrò", cls: "theme-arcade", icon: "🕹️" }
  ];
  let curThemeIdx = 0;
  function applyTheme(idx, notify = false) {
    curThemeIdx = (idx + THEMES.length) % THEMES.length;
    const th = THEMES[curThemeIdx];
    document.body.classList.remove("theme-vintage", "theme-neon", "theme-arcade");
    if (th.cls) document.body.classList.add(th.cls);
    try { localStorage.setItem("ali-di-rondine.theme", th.id); } catch (e) {}
    if (notify) showToast(`Tema: ${th.name}`, "info", th.icon);
  }
  function cycleTheme() {
    applyTheme(curThemeIdx + 1, true);
  }
  window.cycleTheme = cycleTheme;
  window.applyTheme = applyTheme;
  window.THEMES = THEMES;

  // ================= LA RADIOLINA DEL BORGO (PLAYER RETRO) =================
  const STATIONS = [
    { id: "molo", name: "88.5 · Radio Molo", needle: 12, quote: "«Brezza calma sul porto vecchio... oggi le acciughe saltano che è una meraviglia.»", bpm: 90, scale: [261.6, 293.7, 329.6, 392.0, 440.0, 523.3] },
    { id: "calcio", name: "94.0 · Tutto il Calcio", needle: 38, quote: "«Clamoroso al Molo: traversa di Gigi! La palla rimbalza fino alla banchina!»", bpm: 120, scale: [220, 277.2, 329.6, 440, 554.4, 659.3] },
    { id: "bar", name: "101.2 · Bar Moretti Swing", needle: 68, quote: "«Un caffè corretto e due paste al bar... Ruggeri spiega la diagonale con le tazzine!»", bpm: 110, scale: [261.6, 311.1, 349.2, 392.0, 466.2, 523.3] },
    { id: "rondine", name: "107.8 · Inno Rondine", needle: 92, quote: "«Volano le rondini sul cielo della Liguria! La finale si avvicina!»", bpm: 128, scale: [293.7, 369.9, 440.0, 587.3, 739.9, 880.0] }
  ];

  let audioCtx = null;
  let curStation = null;
  let radioTimer = null;
  let noteIdx = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
  }

  function playRadioNote(freq, type = "sine", dur = 0.22, vol = 0.12) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  function stepRadioMusic() {
    if (!curStation || !audioCtx) return;
    const notes = curStation.scale;
    const f = notes[noteIdx % notes.length];
    const type = curStation.id === "rondine" ? "sawtooth" : curStation.id === "calcio" ? "square" : "triangle";
    const vol = curStation.id === "calcio" ? 0.05 : 0.08;
    playRadioNote(f, type, (60 / curStation.bpm) * 0.8, vol);
    noteIdx = (noteIdx + Math.floor(Math.random() * 2) + 1);
  }

  function tuneStation(idx) {
    initAudio();
    if (radioTimer) { clearInterval(radioTimer); radioTimer = null; }
    if (idx === null || curStation === STATIONS[idx]) {
      curStation = null;
      updateRadioUI();
      return;
    }
    curStation = STATIONS[idx];
    updateRadioUI();
    const interval = (60 / curStation.bpm) * 1000;
    radioTimer = setInterval(stepRadioMusic, interval);
    stepRadioMusic();
  }

  let radioOverlay = null;

  function openRadioModal() {
    initAudio();
    if (!radioOverlay) {
      radioOverlay = document.createElement("div");
      radioOverlay.className = "radio-overlay";
      radioOverlay.setAttribute("role", "dialog");
      radioOverlay.setAttribute("aria-label", "La Radiolina del Borgo");
      radioOverlay.innerHTML = `
        <div class="radio-chassis">
          <div class="radio-antenna"></div>
          <div class="radio-topbar">
            <span><i class="radio-led" id="rLed"></i>BORGO MARINO TRANSISTOR · FM STEREO</span>
          </div>
          <div class="radio-scale">
            <div class="radio-needle" id="rNeedle" style="left: 10%;"></div>
            <div style="font-size: 10px; color: #88ccaa;">MHZ · MODULAZIONE DI FREQUENZA</div>
            <div class="radio-freq-labels">
              <span>88</span><span>94</span><span>101</span><span>108</span>
            </div>
          </div>
          <div class="radio-grill" id="rStations"></div>
          <div class="radio-commentary" id="rQuote">«Sintonizzati su una frequenza per ascoltare le onde di Borgo Marino...»</div>
          <div class="radio-controls">
            <button type="button" class="radio-close-btn" id="rClose">Chiudi radiolina ✕</button>
          </div>
        </div>
      `;
      document.body.appendChild(radioOverlay);

      const stBox = radioOverlay.querySelector("#rStations");
      STATIONS.forEach((st, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "radio-station-btn";
        btn.textContent = st.name.split(" · ")[1];
        btn.onclick = () => tuneStation(i);
        stBox.appendChild(btn);
      });

      radioOverlay.querySelector("#rClose").onclick = () => {
        radioOverlay.style.display = "none";
      };
      radioOverlay.onclick = (e) => {
        if (e.target === radioOverlay) radioOverlay.style.display = "none";
      };
    }
    radioOverlay.style.display = "flex";
    updateRadioUI();
  }

  function updateRadioUI() {
    if (!radioOverlay) return;
    const needle = radioOverlay.querySelector("#rNeedle");
    const led = radioOverlay.querySelector("#rLed");
    const quote = radioOverlay.querySelector("#rQuote");
    const btns = radioOverlay.querySelectorAll(".radio-station-btn");

    if (curStation) {
      needle.style.left = curStation.needle + "%";
      led.classList.add("on");
      quote.textContent = curStation.quote;
      btns.forEach((b, i) => {
        b.classList.toggle("active", STATIONS[i].id === curStation.id);
      });
    } else {
      needle.style.left = "4%";
      led.classList.remove("on");
      quote.textContent = "«Radiolina in stand-by. Scegli una stazione radiofonica del Borgo!»";
      btns.forEach(b => b.classList.remove("active"));
    }
  }

  window.openRadioModal = openRadioModal;

  document.addEventListener("DOMContentLoaded", () => {
    checkSeasonalEvents();
    const themeBtn = $("themeBtn");
    if (themeBtn) themeBtn.onclick = cycleTheme;
    const hapticBtn = $("hapticBtn");
    if (hapticBtn) hapticBtn.onclick = cycleHapticMode;
    updateHapticButton();
    const radioBtn = $("radioBtn");
    if (radioBtn) radioBtn.onclick = openRadioModal;
    const rosterBtn = $("rosterBtn");
    if (rosterBtn) rosterBtn.onclick = () => { if (window.openRosterTalentsModal) window.openRosterTalentsModal(); };
    const logBtn = $("logBtn");
    if (logBtn) logBtn.onclick = () => { if (window.openDialogueLog) window.openDialogueLog(); };
    const animeFxBtn = $("animeFxBtn");
    if (animeFxBtn) {
      const updateAnimeBtn = () => {
        const on = window.isAnimeFxEnabled ? window.isAnimeFxEnabled() : true;
        animeFxBtn.style.opacity = on ? "1" : "0.5";
        animeFxBtn.title = on ? "Anime Cut-in: ATTIVI (Clicca per disattivare)" : "Anime Cut-in: CLASSICI (Clicca per attivare)";
        const lbl = animeFxBtn.querySelector("#animeFxLbl") || animeFxBtn.querySelector("span");
        if (lbl) lbl.textContent = on ? "Anime FX: ON" : "Anime FX: OFF";
      };
      animeFxBtn.onclick = () => {
        if (window.toggleAnimeFx) window.toggleAnimeFx();
        updateAnimeBtn();
      };
      updateAnimeBtn();
    }
    let savedTh = "classic";
    try { savedTh = localStorage.getItem("ali-di-rondine.theme") || "classic"; } catch (e) {}
    const foundIdx = THEMES.findIndex(t => t.id === savedTh);
    applyTheme(foundIdx >= 0 ? foundIdx : 0, false);

    // Supporto scorciatoie da tastiera (1-9, Invio/Spazio, Esc)
    window.addEventListener("keydown", (e) => {
      // Non intercettare se l'utente sta scrivendo in un input o textarea
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "Escape") {
        if (window.closeStadium3D) window.closeStadium3D();
        if (window.closeBorgoStortoModal) window.closeBorgoStortoModal();
        if (window.closeRosterTalentsModal) window.closeRosterTalentsModal();
        if (window.closeDialogueLog) window.closeDialogueLog();
        if (radioOverlay && radioOverlay.style.display !== "none") radioOverlay.style.display = "none";
        const ovl = $("ovl");
        if (ovl && !ovl.hidden) {
          const btn = ovl.querySelector("button");
          if (btn) btn.click();
        }
        return;
      }

      // Tasti numerici 1-9 per le scelte
      if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key, 10) - 1;
        const ovl = $("ovl");
        let btns = [];
        if (ovl && !ovl.hidden) {
          btns = Array.from(document.querySelectorAll("#ovlCh button:not(:disabled)"));
        } else {
          btns = Array.from(document.querySelectorAll("#choices button:not(:disabled)"));
        }
        if (btns[idx]) {
          e.preventDefault();
          btns[idx].click();
        }
        return;
      }

      // Spazio o Invio per avanzare quando c'è una sola scelta o scelta calda
      if (e.key === "Enter" || e.key === " ") {
        const ovl = $("ovl");
        if (ovl && !ovl.hidden) {
          const btn = ovl.querySelector("#ovlCh button:not(:disabled)");
          if (btn) { e.preventDefault(); btn.click(); return; }
        }
        const choices = Array.from(document.querySelectorAll("#choices button:not(:disabled)"));
        if (choices.length === 1) {
          e.preventDefault();
          choices[0].click();
        } else if (choices.length > 1) {
          const hot = choices.find(b => b.classList.contains("hot"));
          if (hot) {
            e.preventDefault();
            hot.click();
          }
        }
      }
    });
  });
})();
