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

  document.addEventListener("DOMContentLoaded", () => {
    checkSeasonalEvents();
    const themeBtn = $("themeBtn");
    if (themeBtn) themeBtn.onclick = cycleTheme;
    let savedTh = "classic";
    try { savedTh = localStorage.getItem("ali-di-rondine.theme") || "classic"; } catch (e) {}
    const foundIdx = THEMES.findIndex(t => t.id === savedTh);
    applyTheme(foundIdx >= 0 ? foundIdx : 0, false);
  });
})();
