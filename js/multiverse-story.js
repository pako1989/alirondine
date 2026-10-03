// ================= v22 · LA FENDITURA QUANTISTICA DELLA PANDA 30 =================
// Saga demenziale e multiversale (Stile Rick & Morty, Futurama e Game of Thrones parody).
// Grafica visuale su Stage (Asset tunnel spaziotemporale, cruscotto interattivo, minigioco tachionico e 3 dimensioni).
(function () {
  const K_MULTI = "ali-di-rondine.multiverse-progress";

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(K_MULTI)) || { portals: [], won: 0 };
    } catch {
      return { portals: [], won: 0 };
    }
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_MULTI, JSON.stringify(p));
    } catch {}
  }

  let onExitCallback = null;
  let tachyonEnergy = 0; // 0..3
  let pandaPosX = 50; // %
  let animTimer = null;

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
      el.innerHTML = `<span class="who" style="background:#ba68c8; color:#fff; font-weight:bold;">${who}</span><span class="t">${html}</span>`;
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

  function closeMultiStage() {
    if (animTimer) {
      clearInterval(animTimer);
      animTimer = null;
    }
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = true;
      alt.style.display = "none";
      alt.innerHTML = "";
    }
  }

  function openMultiverseMenu(onBack) {
    onExitCallback = onBack;
    tachyonEnergy = 0;
    pandaPosX = 50;
    showHub();
  }

  function showHub() {
    closeMultiStage();
    setChap("Multiverso · La Panda Quantistica");
    const prog = getProgress();

    // Render cosmic wormhole visual in stageAlt
    const alt = getStageAlt();
    if (alt) {
      alt.hidden = false;
      alt.style.display = "flex";
      alt.style.flexDirection = "column";
      alt.style.justifyContent = "flex-end";
      alt.style.position = "relative";
      alt.style.overflow = "hidden";
      alt.innerHTML = `
        <img src="img/multiverse_panda.jpg" alt="Panda Quantistica" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:contrast(1.2) brightness(0.95);">
        <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(14,6,32,0.2) 0%, rgba(14,6,32,0.85) 90%);"></div>
        <div style="position:relative; z-index:2; padding:12px; display:flex; justify-content:space-between; align-items:flex-end;">
          <div>
            <div style="font-family:var(--display); font-size:16px; color:#e1bee7; text-shadow:0 0 10px rgba(225,190,231,0.8);">LA PANDA 30 QUANTISTICA</div>
            <div style="font-size:12px; color:#f3e5f5;">Warp Spaziotemporale · Alimentata a Olio di Fritto</div>
          </div>
          <div style="background:rgba(225,190,231,0.15); border:1px solid #ba68c8; border-radius:6px; padding:4px 8px; font-size:11px; color:#fff;">
            Mondi esplorati: <b>${prog.portals.length}/3</b>
          </div>
        </div>
      `;
    }

    showText(
      "Nonna Ferri",
      `«Leo, muoviti a salire! Ho fritto quaranta chili di panissa con l'olio della trattoria e quando ho pigiato il pedale della terza la Panda ha cominciato a vibrare e ha aperto un buco nel tessuto dello spaziotempo!<br>
      Adesso il tachimetro segna 88.000 miglia all'ora e davanti al parabrezza vedo cavalieri medievali, robot che mangiano focaccia al silicio e un gatto grande come un pianeta! Se non acceleriamo restiamo bloccati nel vuoto cosmico!»`
    );

    showButtons([
      {
        label: "🚀 Sali sulla Panda e accendi il Motore Tachionico",
        sub: "Pilota la Panda 30 attraverso la fenditura quantistica!",
        cls: "hot",
        fn: () => startCockpitFlight()
      },
      {
        label: "📖 Teoria del Fritto Quantico di Nonna",
        sub: "Perché l'olio delle acciughe piega la relatività",
        fn: () => showTheory()
      },
      {
        label: "◂ Torna al Menu",
        fn: () => {
          closeMultiStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  function showTheory() {
    showText(
      "Nonna Ferri",
      `«Einstein non ha mai assaggiato la frittura mista di Don Aurelio al sabato sera! Quando l'olio raggiunge i 190 gradi e ci butti dentro le acciughe appena pescate, la densità molecolare genera particelle di frittoni subatomici che annullano la gravità terrestre.<br>
      Basta innestare la retro e premere il pomello del cambio!»`
    );

    showButtons([
      {
        label: "Allacciati le cinture e andiamo! ▸",
        cls: "hot",
        fn: () => startCockpitFlight()
      }
    ], true);
  }

  function startCockpitFlight() {
    setChap("Cockpit · Tunnel Spaziotemporale");
    const alt = getStageAlt();
    if (!alt) return;

    alt.hidden = false;
    alt.style.display = "block";
    alt.style.position = "relative";
    alt.style.overflow = "hidden";

    renderCockpitStage();
  }

  function renderCockpitStage() {
    const alt = getStageAlt();
    if (!alt) return;

    alt.innerHTML = `
      <div style="position:absolute; inset:0; overflow:hidden;">
        <img src="img/multiverse_panda.jpg" style="width:100%; height:100%; object-fit:cover; filter:contrast(1.25) brightness(0.9);">
        <div style="position:absolute; inset:0; background:radial-gradient(circle at center, transparent 30%, rgba(14,6,32,0.6) 80%);"></div>
      </div>

      <!-- Top Warp Dashboard -->
      <div style="position:absolute; top:6px; left:8px; right:8px; z-index:10; display:flex; justify-content:space-between; align-items:center; background:rgba(18,8,38,0.85); border:1px solid #ba68c8; border-radius:8px; padding:4px 10px; font-size:11px;">
        <span style="color:#e1bee7; font-weight:bold;">🛸 CRUSCOTTO PANDA 30 TACHIONICA</span>
        <span style="color:var(--gold);">Carica Olio: <b>${tachyonEnergy}/3 Focacce</b></span>
      </div>

      <!-- Interactive Ship Cursor -->
      <div id="pandaCursor" style="position:absolute; bottom:28px; left:${pandaPosX}%; transform:translateX(-50%); z-index:15; transition:left 0.2s ease; text-align:center;">
        <div style="font-size:28px; filter:drop-shadow(0 0 10px #ff4d5a);">🚗</div>
        <div style="font-size:9px; background:#ff4d5a; color:#fff; border-radius:4px; padding:1px 4px; font-weight:bold;">PANDA 30</div>
      </div>

      <!-- Dimensional Portals Floating -->
      <div style="position:absolute; top:36px; left:12px; right:12px; display:flex; justify-content:space-between; z-index:12;">
        <button type="button" onclick="window.__warpTo('cyberpunk')" style="background:rgba(0,229,255,0.2); border:1.5px solid #00e5ff; color:#fff; border-radius:8px; padding:6px 10px; font-size:11px; cursor:pointer; text-align:center;">
          <div style="font-size:18px;">🏙️</div>
          <b>Cyberpunk 2099</b>
        </button>
        <button type="button" onclick="window.__warpTo('thrones')" style="background:rgba(255,210,63,0.2); border:1.5px solid #ffd23f; color:#fff; border-radius:8px; padding:6px 10px; font-size:11px; cursor:pointer; text-align:center;">
          <div style="font-size:18px;">⚔️</div>
          <b>Trono Tre Riviere</b>
        </button>
        <button type="button" onclick="window.__warpTo('spacecat')" style="background:rgba(225,190,231,0.2); border:1.5px solid #e1bee7; color:#fff; border-radius:8px; padding:6px 10px; font-size:11px; cursor:pointer; text-align:center;">
          <div style="font-size:18px;">🐱</div>
          <b>Gatto Supremo 42</b>
        </button>
      </div>

      <!-- Controls Overlay -->
      <div style="position:absolute; bottom:6px; left:8px; right:8px; z-index:15; display:flex; justify-content:space-between; align-items:center; background:rgba(10,5,22,0.85); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:4px 8px;">
        <button type="button" onclick="window.__pandaSteer(-20)" class="choice-btn" style="padding:4px 14px; font-weight:bold;">◂ Sterza SX</button>
        <span style="font-size:11px; color:#e1bee7;">Scegli il portale o raccogli focaccia</span>
        <button type="button" onclick="window.__pandaSteer(20)" class="choice-btn" style="padding:4px 14px; font-weight:bold;">Sterza DX ▸</button>
      </div>
    `;

    window.__pandaSteer = function (delta) {
      pandaPosX = Math.max(15, Math.min(85, pandaPosX + delta));
      const el = document.getElementById("pandaCursor");
      if (el) el.style.left = pandaPosX + "%";
      tachyonEnergy = Math.min(3, tachyonEnergy + 1);
      if (window.toast) window.toast(`+1 Focaccia Tachionica raccolta! (${tachyonEnergy}/3)`, "info", "⚡");
      renderCockpitStage();
    };

    window.__warpTo = function (dim) {
      if (window.triggerAnimeCutin) {
        window.triggerAnimeCutin({
          who: "Nonna Ferri",
          shotName: "SALTO DIMENSIONALE TACHIONICO!",
          isEgo: false,
          sfxWord: "KAAA-BOOM!"
        });
      }
      resolveDimension(dim);
    };

    showText(
      "Nonna",
      `«Tocca uno dei tre squarci dimensionali in cima allo schermo oppure usa i pulsanti dello sterzo per allineare la Panda con la realtà che preferisci!»`
    );

    showButtons([
      {
        label: "🏙️ Tuffati nel Borgo Cyberpunk 2099",
        sub: "Mega-corporazioni, droni gabbiano e cyber-calcio",
        cls: "hot",
        fn: () => window.__warpTo("cyberpunk")
      },
      {
        label: "⚔️ Schiantati sul Trono delle Tre Riviere",
        sub: "Game of Thrones parody: re Enzo e calcio in armatura",
        cls: "hot",
        fn: () => window.__warpTo("thrones")
      },
      {
        label: "🐱 Atterra sull'Impero del Gatto Supremo",
        sub: "Universo 42: Nico Ferri imperatore galattico",
        cls: "hot",
        fn: () => window.__warpTo("spacecat")
      }
    ]);
  }

  function resolveDimension(dim) {
    const prog = getProgress();
    if (!prog.portals.includes(dim)) {
      prog.portals.push(dim);
      saveProgress(prog);
    }

    if (dim === "cyberpunk") {
      setChap("Dimensione 2099 · Borgo Cyberpunk");
      showText(
        "Cyber-Nico",
        `<b>BENVENUTO A NEO-BORGO MARINO 2099</b><br>
        Grattacieli di cromo si affacciano su un mare di fibra ottica. Nico indossa un visore neurale e un braccio bionico idraulico:<br>
        «Leo! Sei in ritardo per la finale della Lega Olografica contro il Real Corporation! Il pallone viaggia a energia fotonica a 300 chilometri orari: se sbagli il cross ti brucia le scarpette!»`
      );

      showButtons([
        {
          label: "⚡ Calcia il Pallone Fotonico con Sovraccarico Neurale",
          sub: "Canalizza la cyber-focaccia nel tiro!",
          cls: "hot",
          fn: () => finishDimension("cyberpunk")
        },
        {
          label: "🛡️ Attiva lo Scudo Deflettore della Panda 30",
          sub: "Respingi l'assalto dei robot nemici",
          fn: () => finishDimension("cyberpunk")
        }
      ], true);

    } else if (dim === "thrones") {
      setChap("Dimensione Medievale · Il Trono");
      showText(
        "Re Enzo Moretti",
        `<b>ROCCAFORTE DELLE TRE RIVIERE · ANNO DOMINI 1240</b><br>
        Enzo Moretti siede su un trono fatto di vecchie reti da pesca e remi d'oro forgiati nel fuoco di mille tempeste:<br>
        «Mio prode cavaliere Leo! Ser Franco Ruggeri dei Trabucchi ha osato sfidare la nostra casata a Calcio-Giostra! Indossa la corazza di latta e calcia il pallone di cuoio rovente dritto nel loro castello!»`
      );

      showButtons([
        {
          label: "⚔️ Scaglia il Tiro della Rondine Infuocato!",
          sub: "Brucia le difese di Ser Franco e conquista la Lanterna",
          cls: "hot",
          fn: () => finishDimension("thrones")
        },
        {
          label: "🛡️ Difendi il Ponte Levatoio con la Panda Corazzata",
          sub: "Nonna carica i cavalieri nemici!",
          fn: () => finishDimension("thrones")
        }
      ], true);

    } else {
      setChap("Dimensione 42 · Gatto Supremo");
      showText(
        "Imperatore Nico",
        `<b>NEBULOSA DEL FELINO · UNIVERSO 42</b><br>
        Un gatto tigrato gigante con una sciarpa del Rondine FC fa le fusa nello spazio profondo, facendo vibrare le galassie. Nico indossa un mantello di velluto rosso:<br>
        «Leo, finalmente! In questa dimensione il calcio si gioca in assenza di gravità saltando da un asteroide all'altro. Il Gatto Supremo è il portiere della galassia: battilo o giocherà con la tua astronave come un gomitolo!»`
      );

      showButtons([
        {
          label: "🧶 Tira la Sfera Gravitazionale col Giro a Spirale",
          sub: "Inganna i riflessi cosmici del Gatto Supremo!",
          cls: "hot",
          fn: () => finishDimension("spacecat")
        },
        {
          label: "🐟 Distrai il Gatto con una Cassa di Acciughe Spaziali",
          sub: "Strategia d'astuzia felina!",
          fn: () => finishDimension("spacecat")
        }
      ], true);
    }
  }

  function finishDimension(dim) {
    const prog = getProgress();
    prog.won++;
    saveProgress(prog);

    if (window.toast) window.toast("✨ DIMENSIONE CONQUISTATA!", "goal", "🌌");

    showText(
      "Nonna Ferri",
      `<b style="color:var(--gold); font-size:16px;">VITTORIA MULTIVERSALE! LA PANDA RIENTRA A CASA!</b><br>
      «Hai visto, Leo? Abbiamo rimesso a posto le galassie e siamo atterrati giusti giusti davanti al bar prima che si raffreddassero i frollini! La Panda 30 non tradisce mai.»`
    );

    showButtons([
      {
        label: "Torna a Borgo Marino (Menu Principale) 🏠",
        cls: "hot",
        fn: () => {
          closeMultiStage();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  window.openMultiverseMenu = openMultiverseMenu;
})();
