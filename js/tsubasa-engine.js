// ================= CAPTAIN TSUBASA (NES/SNES TECMO STYLE) MATCH ENGINE =================
// Motore di partita a duelli 1v1 cinematografici ispirato ai classici Tecmo per Famicom e Super Famicom.
// Attivabile da Impostazioni (Stile Partita: Captain Tsubasa) oppure giocabile in Esibizione Rapida.
(function () {
  const K_TSUBASA = "ali-di-rondine.tsubasa-opt";

  function isTsubasaEnabled() {
    try {
      const set = JSON.parse(localStorage.getItem("ali-di-rondine.impostazioni")) || {};
      return !!set.tsubasa;
    } catch {
      return false;
    }
  }

  let activeMatch = null;
  let isExecutingAnim = false;

  function getStageAlt() {
    return document.getElementById("stageAlt");
  }

  function getCv() {
    return document.getElementById("cv");
  }

  // Costruisce la schermata duello Tecmo (split-screen con radar tattico e griglia comandi)
  function renderTsubasaTurn(opts) {
    const {
      isAttack,
      carrierName = "Leo Moretti",
      carrierNum = 10,
      oppName = "Toro Galli",
      oppNum = 9,
      zone = 3,
      guts = 80,
      maxGuts = 100,
      score = [0, 0],
      min = 25,
      oppColor = "#ff4d5a",
      usColor = "#ffd23f",
      actions = [],
      onAction = null
    } = opts;

    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.overflow = "hidden";
    alt.style.background = "#070c18";

    const gutsPercent = Math.min(100, Math.max(0, (guts / maxGuts) * 100));

    alt.innerHTML = `
      <!-- Tecmo Upper Duel Screen -->
      <div style="height:116px; position:relative; background:linear-gradient(180deg, #091326 0%, #132448 100%); border-bottom:2px solid #ffd23f; display:flex; overflow:hidden;">
        <!-- Background Speedlines -->
        <div style="position:absolute; inset:0; opacity:0.18; background:repeating-linear-gradient(90deg, #fff, #fff 2px, transparent 2px, transparent 18px); pointer-events:none;"></div>

        <!-- Left Player: Leo / Us -->
        <div style="flex:1; padding:8px; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:2; border-right:1px solid rgba(255,210,63,0.3);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span style="background:${usColor}; color:#0e1424; font-weight:900; font-size:11px; padding:1px 6px; border-radius:3px;">#${carrierNum}</span>
              <span style="color:#fff; font-weight:bold; font-size:13px; margin-left:4px; font-family:var(--display, sans-serif);">${carrierName.toUpperCase()}</span>
            </div>
          </div>
          <!-- Player Stance Sprite / Card -->
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:40px; height:40px; border-radius:6px; background:#182b4d; border:2px solid #ffd23f; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 10px rgba(255,210,63,0.3);">
              ${isAttack ? "⚽" : "🛡️"}
            </div>
            <div style="font-size:11px; color:#ced9eb;">
              <div>Grinta: <b style="color:#ffd23f;">${Math.round(guts)}</b>/${maxGuts}</div>
              <div style="width:65px; height:6px; background:#0a1020; border-radius:3px; overflow:hidden; border:1px solid #3c5480; margin-top:2px;">
                <div style="height:100%; width:${gutsPercent}%; background:linear-gradient(90deg, #ffd23f, #00e5ff);"></div>
              </div>
            </div>
          </div>
          <div style="font-size:10px; color:#8ba0c4; font-style:italic;">
            ${isAttack ? "«Adesso salto il blocco!»" : "«Copri l'interno e aspetta!»"}
          </div>
        </div>

        <!-- Middle Confrontation VS Badge -->
        <div style="width:36px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0b162c; border-left:1px solid rgba(255,255,255,0.15); border-right:1px solid rgba(255,255,255,0.15); z-index:3;">
          <div style="font-size:12px; font-weight:900; color:#ffd23f; font-family:var(--display, sans-serif); text-shadow:0 0 6px #ffd23f;">VS</div>
          <div style="font-size:9px; color:#fff; font-weight:bold; margin-top:2px;">Z${zone}</div>
        </div>

        <!-- Right Opponent Player -->
        <div style="flex:1; padding:8px; display:flex; flex-direction:column; justify-content:space-between; position:relative; z-index:2; text-align:right;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-direction:row-reverse;">
            <div>
              <span style="color:#fff; font-weight:bold; font-size:13px; margin-right:4px; font-family:var(--display, sans-serif);">${oppName.toUpperCase()}</span>
              <span style="background:${oppColor}; color:#fff; font-weight:900; font-size:11px; padding:1px 6px; border-radius:3px;">#${oppNum}</span>
            </div>
          </div>
          <!-- Opponent Stance Card -->
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:8px;">
            <div style="font-size:11px; color:#ced9eb; text-align:right;">
              <div style="color:#ff8088; font-weight:bold;">${isAttack ? "In Marcatura" : "Incursione"}</div>
              <div style="font-size:10px; color:var(--dim);">Riflessi: Elevati</div>
            </div>
            <div style="width:40px; height:40px; border-radius:6px; background:#2a1218; border:2px solid ${oppColor}; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 0 10px rgba(255,77,90,0.3);">
              ${isAttack ? "🧤" : "⚡"}
            </div>
          </div>
          <div style="font-size:10px; color:#ff8088; font-style:italic;">
            «Di qui non passa nessuno!»
          </div>
        </div>
      </div>

      <!-- Middle Radar Pitch (Authentic Tecmo Mini-Pitch) -->
      <div style="height:84px; background:#1b5e20; position:relative; border-bottom:2px solid #ffd23f; overflow:hidden;">
        <!-- Pitch Markings -->
        <div style="position:absolute; inset:6px; border:1.5px solid rgba(255,255,255,0.7); pointer-events:none;">
          <!-- Center line -->
          <div style="position:absolute; top:0; bottom:0; left:50%; width:1.5px; background:rgba(255,255,255,0.7);"></div>
          <!-- Center circle -->
          <div style="position:absolute; top:50%; left:50%; width:30px; height:30px; border:1.5px solid rgba(255,255,255,0.7); border-radius:50%; transform:translate(-50%, -50%);"></div>
          <!-- Goal boxes -->
          <div style="position:absolute; top:20%; bottom:20%; left:0; width:18px; border:1.5px solid rgba(255,255,255,0.7); border-left:none;"></div>
          <div style="position:absolute; top:20%; bottom:20%; right:0; width:18px; border:1.5px solid rgba(255,255,255,0.7); border-right:none;"></div>
        </div>

        <!-- Zone Highlight (1..5) -->
        <div style="position:absolute; top:6px; bottom:6px; left:${(zone - 1) * 20}%; width:20%; background:rgba(255,210,63,0.25); border:1px dashed #ffd23f; pointer-events:none;"></div>

        <!-- Moving Player Dots (SNES Style) -->
        <!-- Ball Carrier (Flashing) -->
        <div style="position:absolute; top:50%; left:${(zone - 1) * 20 + 10}%; transform:translate(-50%, -50%); z-index:10; animation:pulseCarrier 0.8s infinite alternate;">
          <div style="width:18px; height:18px; background:#ffd23f; color:#0e1424; border:1.5px solid #fff; border-radius:50%; font-size:10px; font-weight:900; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px #ffd23f;">
            ${carrierNum}
          </div>
        </div>

        <!-- Teammate 1 (Tommy / Wing) -->
        <div style="position:absolute; top:22%; left:${Math.min(90, (zone) * 20 + 8)}%; transform:translate(-50%, -50%);">
          <div style="width:14px; height:14px; background:#3fa7ff; color:#fff; border:1px solid #fff; border-radius:50%; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:center;">
            9
          </div>
        </div>

        <!-- Teammate 2 (Gigi / Support) -->
        <div style="position:absolute; top:78%; left:${Math.max(10, (zone - 1) * 20 - 10)}%; transform:translate(-50%, -50%);">
          <div style="width:14px; height:14px; background:#3fa7ff; color:#fff; border:1px solid #fff; border-radius:50%; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:center;">
            7
          </div>
        </div>

        <!-- Goalkeeper Nico -->
        <div style="position:absolute; top:50%; left:4%; transform:translate(-50%, -50%);">
          <div style="width:14px; height:14px; background:#4caf50; color:#fff; border:1px solid #fff; border-radius:50%; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:center;">
            1
          </div>
        </div>

        <!-- Opponent Defender Dot -->
        <div style="position:absolute; top:50%; left:${Math.min(92, (zone - 1) * 20 + 20)}%; transform:translate(-50%, -50%);">
          <div style="width:16px; height:16px; background:${oppColor}; color:#fff; border:1.5px solid #fff; border-radius:50%; font-size:9px; font-weight:bold; display:flex; align-items:center; justify-content:center; box-shadow:0 0 6px ${oppColor};">
            ${oppNum}
          </div>
        </div>

        <!-- Match Clock & Score Badge in Radar -->
        <div style="position:absolute; top:8px; right:10px; background:rgba(6,11,24,0.85); border:1px solid rgba(255,255,255,0.3); border-radius:4px; padding:2px 6px; font-size:10px; color:#fff; display:flex; gap:6px; z-index:12;">
          <span>⏱️ <b>${min}'</b></span>
          <span style="color:#ffd23f; font-weight:bold;">${score[0]} – ${score[1]}</span>
        </div>
      </div>
    `;

    // Render the Tecmo Action Menu in the #choices container
    renderTecmoCommandWindow(actions, onAction);
  }

  // Costruisce la croce/griglia dei comandi Tecmo Captain Tsubasa
  function renderTecmoCommandWindow(actions, onAction) {
    const choices = document.getElementById("choices");
    if (!choices) return;

    choices.innerHTML = "";
    choices.className = "choices";
    choices.style.display = "grid";
    choices.style.gridTemplateColumns = "repeat(2, 1fr)";
    choices.style.gap = "8px";
    choices.style.padding = "8px 0";

    actions.forEach((act) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn" + (act.cls ? " " + act.cls : "");
      btn.disabled = !!act.disabled;
      btn.style.display = "flex";
      btn.style.flexDirection = "column";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "center";
      btn.style.padding = "10px 6px";
      btn.style.minHeight = "52px";

      btn.innerHTML = `
        <div style="font-weight:900; font-size:13px; font-family:var(--display, sans-serif);">${act.icon ? act.icon + " " : ""}${act.label}</div>
        ${act.sub ? `<small style="font-size:10px; opacity:0.85; margin-top:2px;">${act.sub}</small>` : ""}
      `;

      btn.onclick = () => {
        choices.innerHTML = "";
        if (typeof onAction === "function") {
          onAction(act);
        } else if (typeof act.fn === "function") {
          act.fn();
        }
      };

      choices.appendChild(btn);
    });
  }

  // Animazione cinematografica rétro SNES quando si esegue un'azione
  function playTecmoAnimation(animType, detail, onDone) {
    isExecutingAnim = true;
    const alt = getStageAlt();
    if (!alt) {
      if (onDone) onDone();
      return;
    }

    const {
      title = "TIRO DELLA RONDINE",
      sub = "Leo Moretti calcia col collo destro!",
      color = "#ffd23f",
      soundWord = "BAAAAAM!"
    } = detail || {};

    const animOverlay = document.createElement("div");
    animOverlay.style.position = "absolute";
    animOverlay.style.inset = "0";
    animOverlay.style.zIndex = "100";
    animOverlay.style.background = "#070c1a";
    animOverlay.style.display = "flex";
    animOverlay.style.flexDirection = "column";
    animOverlay.style.alignItems = "center";
    animOverlay.style.justifyContent = "center";
    animOverlay.style.overflow = "hidden";

    // Animated diagonal cuts and speedlines
    animOverlay.innerHTML = `
      <div style="position:absolute; inset:0; background:repeating-linear-gradient(45deg, ${color}22, ${color}22 10px, transparent 10px, transparent 20px); animation:slideStripes 0.4s linear infinite;"></div>
      <div style="position:relative; z-index:2; text-align:center; padding:16px;">
        <div style="font-size:36px; animation:bounceIcon 0.5s ease;">${animType === "shot" ? "⚽💥" : animType === "drib" ? "💨🏃" : animType === "tackle" ? "🦵⚡" : "🧤🛡️"}</div>
        <div style="font-size:22px; font-weight:900; color:${color}; font-family:var(--display, sans-serif); text-shadow:0 0 15px ${color}; letter-spacing:1px; margin-top:6px;">
          ${title}
        </div>
        <div style="font-size:12px; color:#fff; font-weight:bold; margin-top:4px;">
          ${sub}
        </div>
        <div style="font-size:28px; font-weight:900; color:#fff; font-style:italic; text-shadow:2px 2px 0px #000; margin-top:8px;">
          «${soundWord}»
        </div>
      </div>
    `;

    alt.appendChild(animOverlay);

    setTimeout(() => {
      animOverlay.remove();
      isExecutingAnim = false;
      if (onDone) onDone();
    }, 1100);
  }

  // Esibizione Rapida standalone in stile Captain Tsubasa (per provarla subito!)
  function openTsubasaExhibition(onBack) {
    let tScore = [0, 0];
    let tMin = 0;
    let tZone = 3;
    let tGuts = 100;
    let tCarrier = "Leo Moretti";

    const RIVALS = [
      { name: "Toro Galli", team: "Tori di Torino", color: "#ff4d5a", gk: "Mura d'Acciaio" },
      { name: "Kenji Arata", team: "Aquile di Milano", color: "#00e5ff", gk: "Wagner" },
      { name: "Bruno Sabatini", team: "Corvi del Tigullio", color: "#ba68c8", gk: "Orsini" }
    ];
    let currentRival = RIVALS[0];

    function step() {
      if (tMin >= 90) {
        // Fine partita esibizione
        const alt = getStageAlt();
        if (alt) {
          alt.hidden = true;
          alt.style.display = "none";
          alt.innerHTML = "";
        }
        const textEl = document.getElementById("text");
        if (textEl) {
          textEl.innerHTML = `<span class="who" style="background:#ffd23f; color:#0e1424; font-weight:bold;">Triplice Fischio</span><span class="t"><b>FINALE ESIBIZIONE TECMO</b>: Rondine FC ${tScore[0]} – ${tScore[1]} ${currentRival.team}!</span>`;
        }
        const ch = document.getElementById("choices");
        if (ch) {
          ch.style.display = "flex";
          ch.style.flexDirection = "column";
          ch.innerHTML = `
            <button type="button" class="choice-btn hot" onclick="window.openTsubasaExhibition(${onBack ? 'window.__tsuBack' : ''})">Gioca un'altra esibizione 🔄</button>
            <button type="button" class="choice-btn" onclick="if(window.title) window.title();">Torna al Menu Principale 🏠</button>
          `;
        }
        window.__tsuBack = onBack;
        return;
      }

      tMin += Math.floor(Math.random() * 8) + 6;
      tGuts = Math.min(100, tGuts + 6);

      const isAttack = Math.random() < 0.6 || tZone >= 3;

      const actions = isAttack ? [
        {
          label: "TIRO RONDINE",
          icon: "🔥",
          sub: "Collo destro a giro (-35 Grinta)",
          cls: "hot",
          disabled: tGuts < 35,
          fn: () => {
            tGuts -= 35;
            playTecmoAnimation("shot", {
              title: "TIRO DELLA RONDINE!",
              sub: "Leo Moretti scarica un missile teleguidato!",
              color: "#ffd23f",
              soundWord: "BOOOOOOM!"
            }, () => {
              if (Math.random() < 0.75) {
                tScore[0]++;
                if (window.toast) window.toast("⚽ GOOOL TECMO! RETE GONFIATA!", "goal", "🔥");
              } else {
                if (window.toast) window.toast("PARATA PRODIGIOSA!", "warn", "🧤");
              }
              tZone = 2;
              step();
            });
          }
        },
        {
          label: "DRIBBLING",
          icon: "💨",
          sub: "Finta di corpo su " + currentRival.name + " (-8 Grinta)",
          disabled: tGuts < 8,
          fn: () => {
            tGuts -= 8;
            playTecmoAnimation("drib", {
              title: "DRIBBLING AGILITÀ!",
              sub: "Doppio passo veloce su " + currentRival.name,
              color: "#00e5ff",
              soundWord: "SWOOOOOSH!"
            }, () => {
              tZone = Math.min(5, tZone + 1);
              if (window.toast) window.toast("Dribbling riuscito! Avanzi in zona " + tZone, "info", "💨");
              step();
            });
          }
        },
        {
          label: "PASSA",
          icon: "👟",
          sub: "Assist a Tommy al limite (-5 Grinta)",
          disabled: tGuts < 5,
          fn: () => {
            tGuts -= 5;
            tZone = Math.min(5, tZone + 1);
            if (window.toast) window.toast("Passaggio filtrante completato!", "info", "👟");
            step();
          }
        },
        {
          label: "UNO-DUE",
          icon: "🔄",
          sub: "Triangolazione di prima (-12 Grinta)",
          disabled: tGuts < 12,
          fn: () => {
            tGuts -= 12;
            tZone = Math.min(5, tZone + 2);
            if (window.toast) window.toast("Uno-due fulmineo! Sei davanti alla porta!", "goal", "⚡");
            step();
          }
        }
      ] : [
        {
          label: "SCIVOLATA",
          icon: "🦵",
          sub: "Tackle deciso sul portatore (-10 Grinta)",
          cls: "hot",
          disabled: tGuts < 10,
          fn: () => {
            tGuts -= 10;
            playTecmoAnimation("tackle", {
              title: "TACKLE IN SCIVOLATA!",
              sub: "Intervento pulito sul pallone!",
              color: "#ff4d5a",
              soundWord: "STAAACK!"
            }, () => {
              if (Math.random() < 0.65) {
                tZone = 3;
                if (window.toast) window.toast("Palla recuperata da Leo!", "info", "🛡️");
              } else {
                tScore[1]++;
                if (window.toast) window.toast("Gol subito!", "warn", "⚽");
              }
              step();
            });
          }
        },
        {
          label: "INTERCETTA",
          icon: "✋",
          sub: "Taglia la linea di passaggio (-6 Grinta)",
          disabled: tGuts < 6,
          fn: () => {
            tGuts -= 6;
            tZone = 2;
            if (window.toast) window.toast("Passaggio avversario intercettato!", "info", "✋");
            step();
          }
        },
        {
          label: "PRESSING",
          icon: "🛡️",
          sub: "Accompagna verso la linea laterale",
          fn: () => {
            tZone = Math.max(1, tZone - 1);
            step();
          }
        },
        {
          label: "COPRI & RIFIATA",
          icon: "⏳",
          sub: "Recupera +18 Grinta",
          fn: () => {
            tGuts = Math.min(100, tGuts + 18);
            step();
          }
        }
      ];

      renderTsubasaTurn({
        isAttack,
        carrierName: tCarrier,
        carrierNum: 10,
        oppName: currentRival.name,
        oppNum: 9,
        zone: tZone,
        guts: tGuts,
        maxGuts: 100,
        score: tScore,
        min: tMin,
        oppColor: currentRival.color,
        usColor: "#ffd23f",
        actions
      });
    }

    step();
  }

  // Hook globale per integrarsi nel motore di game.js
  window.isTsubasaEnabled = isTsubasaEnabled;
  window.renderTsubasaTurn = renderTsubasaTurn;
  window.playTecmoAnimation = playTecmoAnimation;
  window.openTsubasaExhibition = openTsubasaExhibition;
})();
