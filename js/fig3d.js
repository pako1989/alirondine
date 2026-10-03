// ================= v17 · ISPEZIONE 3D FIGURINE: CAMPIONI DELLA COSTA =================
// Visualizzatore tridimensionale interattivo per le figurine dell'album di Pina:
// - Inclinazione 3D reattiva al cursore / touch (effetto olografico shimmer)
// - Rotazione a 180° (Flip 3D) per svelare il retro d'epoca: statistiche, retroscena e firma
// - Bordo laminato in oro per le figurine leggendarie, lucido prismatico per le rare
(function () {
  let modalEl = null;
  let isFlipped = false;
  let currentCardId = null;
  let onDoneCb = null;

  function create3DViewerModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "fig3dModal";
    modalEl.style.cssText = `
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(5, 10, 20, 0.88); backdrop-filter: blur(8px);
      display: none; flex-direction: column; align-items: center; justify-content: center;
      padding: 16px; user-select: none; -webkit-user-select: none;
    `;

    modalEl.innerHTML = `
      <div style="position: absolute; top: 14px; right: 16px; z-index: 20;">
        <button type="button" id="fig3dCloseBtn" style="background:#b3202c; color:#fff; border:1.5px solid #ff4d5a; border-radius:8px; padding:6px 14px; font-weight:bold; cursor:pointer; font-size:13px;">✕ Chiudi</button>
      </div>

      <div style="color:var(--gold, #ffd23f); font-family:var(--display, sans-serif); font-size:16px; margin-bottom:12px; text-shadow:0 2px 4px #000; text-align:center;">
        ✨ ISPEZIONE 3D · CAMPIONI DELLA COSTA
      </div>
      <div style="color:#cfe0ff; font-size:12px; margin-bottom:18px; text-align:center;">
        Muovi il mouse o inclina per i riflessi olografici · Tocca la carta per girarla
      </div>

      <!-- Scena 3D della carta -->
      <div id="fig3dScene" style="perspective: 1000px; width: 260px; height: 360px; cursor: pointer; position: relative;">
        <div id="fig3dCard" style="width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.2s ease;">
          
          <!-- FRONTE CARTA -->
          <div id="fig3dFront" style="position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 14px; overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.7); display:flex; flex-direction:column; border: 4px solid #f7f2e4;">
            <div id="fig3dFoil" style="position: absolute; inset: 0; pointer-events: none; z-index: 5; mix-blend-mode: color-dodge; opacity: 0; transition: opacity 0.2s ease;"></div>
            
            <div id="fig3dHeader" style="background:#b3202c; color:#fff; padding:6px 10px; display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:bold;">
              <span id="fig3dNum">N. 1</span>
              <span id="fig3dSeries">RONDINE FC</span>
              <span id="fig3dRarity">★</span>
            </div>

            <div id="fig3dArtwork" style="flex:1; background:#1b2438; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden;">
              <div id="fig3dBadge" style="font-size:72px; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6));">⚽</div>
              <div id="fig3dTeam" style="position:absolute; bottom:8px; font-size:11px; color:#ffd23f; font-weight:bold; text-shadow:0 1px 3px #000;"></div>
            </div>

            <div id="fig3dFooter" style="background:#f7f2e4; color:#1b1b1b; padding:8px 10px; text-align:center;">
              <div id="fig3dName" style="font-weight:bold; font-size:14px; font-family:var(--display, sans-serif); color:#b3202c;">LEO MORETTI</div>
              <div id="fig3dRole" style="font-size:10px; color:#555;">Attaccante · N. 10</div>
            </div>
          </div>

          <!-- RETRO CARTA (STILE PANINI ANNI '90) -->
          <div id="fig3dBack" style="position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg); border-radius: 14px; overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.7); background: #fdfaf2; color: #1c2536; padding: 14px; border: 4px solid #d2c3a0; display:flex; flex-direction:column; justify-content:space-between; font-family: sans-serif;">
            <div>
              <div style="display:flex; justify-content:space-between; border-bottom:1.5px solid #a89472; padding-bottom:4px; margin-bottom:8px;">
                <span style="font-weight:bold; font-size:11px; color:#a89472;">COLLEZIONE UFFICIALE</span>
                <span id="fig3dBackNum" style="font-weight:bold; font-size:11px; color:#b3202c;">N. 1</span>
              </div>
              <div id="fig3dBackName" style="font-size:15px; font-weight:bold; color:#1c2536; font-family:var(--display, sans-serif); margin-bottom:4px;">LEO MORETTI</div>
              <div id="fig3dBackTeam" style="font-size:11px; color:#555; margin-bottom:8px;">Rondine FC · Borgo Marino</div>
              <div id="fig3dBackStory" style="font-size:11px; line-height:1.45; color:#333; background:rgba(210,195,160,0.18); padding:8px; border-radius:6px; border-left:3px solid #b3202c;">
                Il centravanti cresciuto sulla banchina del molo. Tiro della Rondine a scendere.
              </div>
            </div>

            <div>
              <div style="font-size:9.5px; color:#777; border-top:1px dashed #c0b090; padding-top:6px; text-align:center;">
                Stampato con orgoglio dalla <b>Tipografia Parodi</b> (Chiavari) per il Centenario della Coppa.
              </div>
              <div style="text-align:right; font-family:cursive; font-size:12px; color:#b3202c; margin-top:4px;">
                Autentica da Pina ✓
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Azioni sotto la carta -->
      <div style="display:flex; gap:10px; margin-top:22px;">
        <button type="button" id="fig3dFlipBtn" style="background:#1b2e4b; color:#fff; border:1.5px solid #3fa7ff; border-radius:8px; padding:8px 16px; font-weight:bold; font-size:12.5px; cursor:pointer;">
          🔄 Gira Figurina
        </button>
      </div>
    `;

    document.body.appendChild(modalEl);

    // Eventi di rotazione e inclinazione 3D
    const scene = modalEl.querySelector("#fig3dScene");
    const card = modalEl.querySelector("#fig3dCard");
    const foil = modalEl.querySelector("#fig3dFoil");

    function handleMove(cx, cy) {
      if (!scene || !card) return;
      const rect = scene.getBoundingClientRect();
      const x = cx - (rect.left + rect.width / 2);
      const y = cy - (rect.top + rect.height / 2);

      const rotX = -(y / (rect.height / 2)) * 18;
      const rotY = (x / (rect.width / 2)) * 22;

      const baseFlip = isFlipped ? 180 : 0;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${baseFlip + rotY}deg)`;

      // Effetto olografico reattivo
      if (foil) {
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
        foil.style.background = `linear-gradient(${angle}deg, rgba(255,0,128,0.35) 0%, rgba(255,215,0,0.45) 35%, rgba(0,255,255,0.35) 70%, rgba(255,0,255,0.45) 100%)`;
        foil.style.opacity = "0.75";
      }
    }

    function handleLeave() {
      if (!card) return;
      const baseFlip = isFlipped ? 180 : 0;
      card.style.transform = `rotateX(0deg) rotateY(${baseFlip}deg)`;
      if (foil) foil.style.opacity = "0";
    }

    scene.onmousemove = (e) => handleMove(e.clientX, e.clientY);
    scene.onmouseleave = handleLeave;

    scene.ontouchmove = (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    scene.ontouchend = handleLeave;

    // Flip al click sulla carta
    scene.onclick = toggleFlip;
    modalEl.querySelector("#fig3dFlipBtn").onclick = toggleFlip;
    modalEl.querySelector("#fig3dCloseBtn").onclick = close3DCardViewer;

    return modalEl;
  }

  function toggleFlip() {
    isFlipped = !isFlipped;
    const card = document.getElementById("fig3dCard");
    if (card) {
      card.style.transition = "transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2)";
      card.style.transform = `rotateX(0deg) rotateY(${isFlipped ? 180 : 0}deg)`;
      setTimeout(() => {
        if (card) card.style.transition = "transform 0.15s ease-out";
      }, 460);
    }
    if (window.sfx) window.sfx("kick");
  }

  function open3DCardViewer(id, onDone) {
    onDoneCb = onDone;
    currentCardId = id;
    isFlipped = false;

    const modal = create3DViewerModal();
    const card = modal.querySelector("#fig3dCard");
    if (card) card.style.transform = "rotateX(0deg) rotateY(0deg)";

    // Dati della figurina da Ali di Rondine
    const isSpecial = window.FIG_SP && window.FIG_SP[id];
    const name = window.figName ? window.figName(id) : id.toUpperCase();
    const num = window.figNum ? window.figNum(id) : 1;
    const rar = window.figRar ? window.figRar(id) : 0; // 0: normale, 1: lucida, 2: leggendaria
    const page = window.FIG_PAGES ? window.FIG_PAGES.find(p => p.ids.includes(id)) : null;
    const series = page ? page.t : "Campioni della Costa";
    const story = (isSpecial && window.FIG_SP_INFO && window.FIG_SP_INFO[id]) ? window.FIG_SP_INFO[id] : (window.BIO && window.BIO[id] ? window.BIO[id] : "Campione leggendario della riviera ligure.");

    // Aggiorna elementi visivi Fronte
    const numEl = modal.querySelector("#fig3dNum");
    const seriesEl = modal.querySelector("#fig3dSeries");
    const rarEl = modal.querySelector("#fig3dRarity");
    const nameEl = modal.querySelector("#fig3dName");
    const roleEl = modal.querySelector("#fig3dRole");
    const badgeEl = modal.querySelector("#fig3dBadge");
    const teamEl = modal.querySelector("#fig3dTeam");
    const frontEl = modal.querySelector("#fig3dFront");
    const headerEl = modal.querySelector("#fig3dHeader");

    if (numEl) numEl.textContent = `N. ${num}`;
    if (seriesEl) seriesEl.textContent = series.toUpperCase();
    if (rarEl) rarEl.textContent = rar === 2 ? "★★★ LEGGENDARIA" : rar === 1 ? "★★ LUCIDA" : "★ NORMALE";
    if (nameEl) nameEl.textContent = name.toUpperCase();
    if (roleEl) roleEl.textContent = isSpecial ? "Edizione Speciale · Oggetto" : "Giocatore · Borgo Marino";
    if (teamEl) teamEl.textContent = series;

    // Icona o badge
    const ICONS = {
      stemma: "🦅", gatto: "🧤", muro: "🧱", coppa: "🏆", azzurra: "👕",
      orecchie: "⭐", centenario: "👑", faro: "🗼", leg68: "📜",
      leo: "⚽", nico: "🧤", tommy: "⚡", gigi: "☕", sara: "📊",
      dario: "🔥", kenji: "🌊", nonna: "🚗", baciccia: "⛵", papa: "🍲"
    };
    if (badgeEl) badgeEl.textContent = ICONS[id] || "⚽";

    // Cornice dorata / argentata / standard
    if (frontEl) {
      if (rar === 2) {
        frontEl.style.borderColor = "#ffd23f";
        frontEl.style.boxShadow = "0 0 25px rgba(255, 210, 63, 0.6), 0 16px 36px rgba(0,0,0,0.8)";
      } else if (rar === 1) {
        frontEl.style.borderColor = "#cfe0ff";
        frontEl.style.boxShadow = "0 0 18px rgba(185, 215, 255, 0.5), 0 16px 36px rgba(0,0,0,0.8)";
      } else {
        frontEl.style.borderColor = "#f7f2e4";
        frontEl.style.boxShadow = "0 16px 36px rgba(0,0,0,0.7)";
      }
    }
    if (headerEl) {
      headerEl.style.background = page ? page.c : "#b3202c";
    }

    // Aggiorna elementi visivi Retro
    const backNumEl = modal.querySelector("#fig3dBackNum");
    const backNameEl = modal.querySelector("#fig3dBackName");
    const backTeamEl = modal.querySelector("#fig3dBackTeam");
    const backStoryEl = modal.querySelector("#fig3dBackStory");

    if (backNumEl) backNumEl.textContent = `N. ${num}`;
    if (backNameEl) backNameEl.textContent = name;
    if (backTeamEl) backTeamEl.textContent = `${series} · ${rar === 2 ? 'Stampa Olografica Dorata' : rar === 1 ? 'Stampa Lucida' : 'Stampa Standard'}`;
    if (backStoryEl) backStoryEl.textContent = story;

    modal.style.display = "flex";
    if (window.sfx) window.sfx(rar === 2 ? "goal" : "kick");
  }

  function close3DCardViewer() {
    if (modalEl) modalEl.style.display = "none";
    if (onDoneCb && typeof onDoneCb === "function") {
      onDoneCb();
    }
  }

  window.open3DCardViewer = open3DCardViewer;
  window.close3DCardViewer = close3DCardViewer;
})();
