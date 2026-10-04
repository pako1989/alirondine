// js/arena-2d-hd.js - Hub & Master Launcher for the 2D HD Game Suite
(function () {
  let modal = null;
  let onExitCallback = null;

  window.openArena2DHDModal = function (onExit) {
    onExitCallback = onExit;
    if (modal) {
      modal.remove();
      modal = null;
    }

    modal = document.createElement("div");
    modal.id = "arena2dModal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "rgba(4, 8, 17, 0.96)";
    modal.style.zIndex = "999999";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.backdropFilter = "blur(12px)";
    modal.style.overflowY = "auto";
    modal.style.color = "#fff";
    modal.style.fontFamily = "system-ui, -apple-system, sans-serif";

    modal.innerHTML = `
      <div style="max-width:1100px; width:100%; margin:0 auto; padding:24px 20px; box-sizing:border-box;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:16px; margin-bottom:24px;">
          <div>
            <div style="display:inline-block; background:rgba(56, 189, 248, 0.15); color:#38bdf8; font-size:12px; font-weight:bold; padding:4px 10px; border-radius:12px; margin-bottom:6px; border:1px solid rgba(56, 189, 248, 0.3);">
              ✨ NUOVA SUITE DI GIOCO 2D HD
            </div>
            <h1 style="margin:0; font-size:26px; font-weight:800; color:#fff; letter-spacing:-0.5px;">Arena 2D HD del Borgo Marino</h1>
            <p style="margin:4px 0 0; font-size:14px; color:#94a3b8;">
              Quattro esperienze di gameplay 2D HD ad alta definizione: RPG Tattico alla Fire Emblem, Calcio d'Azione a 60fps, Street Soccer con sponde e Gestionale Tattico dal vivo.
            </p>
          </div>
          <button id="arenaCloseBtn" style="background:#e63946; color:#fff; border:none; padding:10px 18px; border-radius:8px; font-weight:bold; font-size:14px; cursor:pointer; transition:transform 0.15s ease;">
            ✕ Chiudi
          </button>
        </div>

        <!-- 4 Game Cards Grid -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px; margin-bottom:30px;">
          
          <!-- Card 1: Tactical Emblem -->
          <div style="background:#0f172a; border:1px solid #334155; border-radius:12px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div>
              <div style="font-size:36px; margin-bottom:10px;">🛡️</div>
              <h2 style="margin:0 0 6px; font-size:18px; color:#38bdf8; font-weight:700;">Rondine Emblem · Torneo del Faro</h2>
              <div style="font-size:11px; color:#f59e0b; font-weight:bold; margin-bottom:12px;">TACTICAL SOCCER RPG (STILE FIRE EMBLEM)</div>
              <p style="font-size:13px; color:#cbd5e1; line-height:1.5; margin:0 0 16px;">
                Griglia tattica a turni sul campo del molo! Triangolo dello stile: <b>Tecnica > Potenza > Velocità</b>. Duelli cinematografici con calcolo di Hit%, Crit%, mosse speciali e 3 capitoli narrativi contro i rivali della costa.
              </p>
            </div>
            <button id="playEmblemBtn" style="background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:14px;">
              Gioca Rondine Emblem ⚔️
            </button>
          </div>

          <!-- Card 2: Action Soccer HD -->
          <div style="background:#0f172a; border:1px solid #334155; border-radius:12px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div>
              <div style="font-size:36px; margin-bottom:10px;">⚽</div>
              <h2 style="margin:0 0 6px; font-size:18px; color:#22c55e; font-weight:700;">Top-Down Action Soccer 2D HD</h2>
              <div style="font-size:11px; color:#4ade80; font-weight:bold; margin-bottom:12px;">CALCIO D'AZIONE 60FPS (STILE SENSIBLE SOCCER)</div>
              <p style="font-size:13px; color:#cbd5e1; line-height:1.5; margin:0 0 16px;">
                Calcio giocato puro a 60fps con controllo diretto su tastiera o touch screen. Fisica del pallone con rimbalzi, portieri reattivi, contrasti e <b>Aftertouch</b> per curvare i tiri al volo sul secondo palo!
              </p>
            </div>
            <button id="playActionBtn" style="background:linear-gradient(135deg, #16a34a, #15803d); color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:14px;">
              Gioca Action Soccer ⚽
            </button>
          </div>

          <!-- Card 3: Street Soccer Cage -->
          <div style="background:#0f172a; border:1px solid #334155; border-radius:12px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div>
              <div style="font-size:36px; margin-bottom:10px;">👟</div>
              <h2 style="margin:0 0 6px; font-size:18px; color:#f97316; font-weight:700;">Street Soccer · La Gabbia del Molo</h2>
              <div style="font-size:11px; color:#fb923c; font-weight:bold; margin-bottom:12px;">CALCIO DA STRADA 3v3 CON SPONDE</div>
              <p style="font-size:13px; color:#cbd5e1; line-height:1.5; margin:0 0 16px;">
                Campetto d'asfalto recintato sul molo dei pescherecci! Usa i muri e le ringhiere di pietra per sponde e assist a rimbalzo. Carica la barra <b>Grinta del Molo</b> e scatena il Tiro del Trabucco!
              </p>
            </div>
            <button id="playStreetBtn" style="background:linear-gradient(135deg, #ea580c, #c2410c); color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:14px;">
              Entra nella Gabbia 🔥
            </button>
          </div>

          <!-- Card 4: Matchday Director -->
          <div style="background:#0f172a; border:1px solid #334155; border-radius:12px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div>
              <div style="font-size:36px; margin-bottom:10px;">📋</div>
              <h2 style="margin:0 0 6px; font-size:18px; color:#a855f7; font-weight:700;">Matchday Director 2D HD</h2>
              <div style="font-size:11px; color:#c084fc; font-weight:bold; margin-bottom:12px;">GESTIONALE TATTICO LIVE DALLA PANCHINA</div>
              <p style="font-size:13px; color:#cbd5e1; line-height:1.5; margin:0 0 16px;">
                Siediti in panchina e dirigi la Rondine durante i 90 minuti: cambi di modulo in diretta (4-3-3, 3-5-2, 4-4-2), ordini di pressing e assedio, linee di passaggio visibili in 2D e analisi statistica xG in tempo reale.
              </p>
            </div>
            <button id="playDirectorBtn" style="background:linear-gradient(135deg, #9333ea, #7e22ce); color:#fff; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer; width:100%; font-size:14px;">
              Siediti in Panchina 📋
            </button>
          </div>

        </div>

        <!-- Footer Lore info -->
        <div style="background:rgba(30, 41, 59, 0.5); border:1px solid #334155; border-radius:10px; padding:16px 20px; font-size:13px; color:#94a3b8; display:flex; justify-content:space-between; align-items:center;">
          <span>🌊 Tutte le modalità 2D HD sono completamente indipendenti dal salvataggio principale e giocabili sia con mouse/tastiera che su smartphone e tablet.</span>
          <span style="font-size:12px; color:#38bdf8; font-weight:bold;">Borgo Marino · Stagione 2D HD</span>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("arenaCloseBtn").onclick = function () {
      modal.remove();
      modal = null;
      if (typeof onExitCallback === "function") onExitCallback();
    };

    document.getElementById("playEmblemBtn").onclick = function () {
      if (window.openTacticalEmblemMode) {
        window.openTacticalEmblemMode(() => {
          if (modal) modal.style.display = "flex";
        });
        modal.style.display = "none";
      }
    };

    document.getElementById("playActionBtn").onclick = function () {
      if (window.openActionSoccerHD) {
        window.openActionSoccerHD(() => {
          if (modal) modal.style.display = "flex";
        });
        modal.style.display = "none";
      }
    };

    document.getElementById("playStreetBtn").onclick = function () {
      if (window.openStreetCageMode) {
        window.openStreetCageMode(() => {
          if (modal) modal.style.display = "flex";
        });
        modal.style.display = "none";
      }
    };

    document.getElementById("playDirectorBtn").onclick = function () {
      if (window.openMatchDirectorHD) {
        window.openMatchDirectorHD(() => {
          if (modal) modal.style.display = "flex";
        });
        modal.style.display = "none";
      }
    };
  };
})();
