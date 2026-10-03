// ================= ANIME & MANGA CUT-IN FX (PERSONA / BLUE LOCK STYLE) =================
// Effetti cinematografici a strisce diagonali, speed-lines, lampo agli occhi e lettering manga.
// Disattivabile o attivabile a piacere dall'utente (toggleabile).
(function () {
  const K_ANIME = "ali-di-rondine.anime-fx";

  function isAnimeFxEnabled() {
    try {
      return localStorage.getItem(K_ANIME) !== "off";
    } catch {
      return true;
    }
  }

  function setAnimeFxEnabled(enabled) {
    try {
      localStorage.setItem(K_ANIME, enabled ? "on" : "off");
      if (window.toast) {
        window.toast(
          enabled ? "Anime Cut-in: ATTIVI (Stile Manga)" : "Anime Cut-in: CLASSICI",
          "info",
          "⚡"
        );
      }
    } catch {}
  }

  function toggleAnimeFx() {
    const next = !isAnimeFxEnabled();
    setAnimeFxEnabled(next);
    return next;
  }

  let layer = null;

  function ensureLayer() {
    if (layer && document.body.contains(layer)) return layer;
    const stage = document.querySelector(".stage");
    if (!stage) return null;
    layer = document.createElement("div");
    layer.className = "anime-fx-layer";
    layer.id = "animeFxLayer";
    stage.appendChild(layer);
    return layer;
  }

  function triggerAnimeCutin(opts, onDone) {
    if (!isAnimeFxEnabled()) {
      if (typeof onDone === "function") onDone();
      return;
    }

    const {
      who = "Leo",
      shotName = "TIRO DELLA RONDINE",
      isEgo = false,
      sfxWord = "KRAAA!"
    } = opts || {};

    const el = ensureLayer();
    if (!el) {
      if (typeof onDone === "function") onDone();
      return;
    }

    el.innerHTML = `
      <div class="anime-speedlines"></div>
      <div class="anime-slash-banner ${isEgo ? "ego" : ""}">
        <div class="anime-eyes-box">
          <div class="anime-char-name">${who}</div>
          <div class="anime-shot-title">${shotName}</div>
          <div class="anime-eye-flare"></div>
        </div>
      </div>
      <div class="anime-impact-text">${sfxWord}</div>
    `;

    el.classList.add("active");

    // Audio speciale e scuotimento
    if (window.sfx) {
      window.sfx("special");
    }

    const stage = document.querySelector(".stage");
    if (stage) {
      stage.classList.add("screen-flash");
      setTimeout(() => stage.classList.remove("screen-flash"), 250);
    }

    setTimeout(() => {
      el.classList.remove("active");
      el.innerHTML = "";
      if (typeof onDone === "function") onDone();
    }, 750);
  }

  window.isAnimeFxEnabled = isAnimeFxEnabled;
  window.setAnimeFxEnabled = setAnimeFxEnabled;
  window.toggleAnimeFx = toggleAnimeFx;
  window.triggerAnimeCutin = triggerAnimeCutin;
})();
