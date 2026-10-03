// ================= DIALOGUE LOG & TEXT CONTROLS =================
// Registro cronologico dei dialoghi e battute per non perdere nessun passaggio narrativo.
// Con tasto L, pulsante topbar e velocità testo personalizzabile.
(function () {
  const K_SPEED = "ali-di-rondine.text-speed";
  const logEntries = [];
  const MAX_LOG = 60;

  function getTextSpeed() {
    try {
      return localStorage.getItem(K_SPEED) || "normale"; // normale, veloce, istantaneo
    } catch {
      return "normale";
    }
  }

  function cycleTextSpeed() {
    const speeds = ["normale", "veloce", "istantaneo"];
    const cur = getTextSpeed();
    const next = speeds[(speeds.indexOf(cur) + 1) % speeds.length];
    try {
      localStorage.setItem(K_SPEED, next);
      if (window.toast) {
        window.toast(`Velocità testo: ${next.toUpperCase()}`, "info", "⚡");
      }
    } catch {}
    return next;
  }

  function addDialogueLog(who, text) {
    if (!text) return;
    const cleanText = String(text).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!cleanText) return;
    const time = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
    logEntries.push({ who: who || "Voce", text: cleanText, time });
    if (logEntries.length > MAX_LOG) {
      logEntries.shift();
    }
  }

  let logOverlay = null;

  function ensureLogDrawer() {
    if (logOverlay && document.body.contains(logOverlay)) return logOverlay;
    logOverlay = document.createElement("div");
    logOverlay.className = "log-drawer-overlay";
    logOverlay.id = "dialogueLogDrawer";
    logOverlay.innerHTML = `
      <div class="log-drawer-panel">
        <div class="log-drawer-header">
          <h3>📜 Cronistoria Dialoghi</h3>
          <button type="button" class="mute" id="closeLogDrawer" style="padding:4px 9px;">✕</button>
        </div>
        <div class="log-list-container" id="logListContent"></div>
      </div>
    `;
    document.body.appendChild(logOverlay);

    const closeBtn = logOverlay.querySelector("#closeLogDrawer");
    if (closeBtn) closeBtn.onclick = closeDialogueLog;
    logOverlay.onclick = (e) => {
      if (e.target === logOverlay) closeDialogueLog();
    };
    return logOverlay;
  }

  function openDialogueLog() {
    const el = ensureLogDrawer();
    const list = el.querySelector("#logListContent");
    if (!list) return;

    if (logEntries.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; color:var(--dim); padding:40px 10px; font-style:italic;">
          Nessun dialogo registrato finora. Gioca un capitolo o parla con gli abitanti del Borgo!
        </div>
      `;
    } else {
      list.innerHTML = logEntries
        .slice()
        .reverse()
        .map(
          (e) => `
          <div class="log-entry">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="log-entry-who">${e.who}</span>
              <span style="font-size:10px; color:var(--dim);">${e.time}</span>
            </div>
            <div class="log-entry-text">${e.text}</div>
          </div>
        `
        )
        .join("");
    }

    el.classList.add("open");
  }

  function closeDialogueLog() {
    if (logOverlay) {
      logOverlay.classList.remove("open");
    }
  }

  window.addDialogueLog = addDialogueLog;
  window.openDialogueLog = openDialogueLog;
  window.closeDialogueLog = closeDialogueLog;
  window.getTextSpeed = getTextSpeed;
  window.cycleTextSpeed = cycleTextSpeed;

  window.addEventListener("keydown", (e) => {
    if (e.key === "l" || e.key === "L") {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea") return;
      if (logOverlay && logOverlay.classList.contains("open")) {
        closeDialogueLog();
      } else {
        openDialogueLog();
      }
    }
  });
})();
