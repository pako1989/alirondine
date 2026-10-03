// ================= v20 · BLUE LOCK: L'ALCHIMIA DELL'EGO =================
// Modalità Torneo Sopravvivenza nella Gabbia dei Predatori di Punta Nera.
// Misuratore EGO vs ALTRUISMO, aura manga infuocata e tiro speciale delle Fiamme Nere.
(function () {
  const K_BL = "ali-di-rondine.bluelock-record";

  function getBLRecord() {
    try {
      return JSON.parse(localStorage.getItem(K_BL)) || { won: 0, highStage: 0, bestEgo: 50 };
    } catch {
      return { won: 0, highStage: 0, bestEgo: 50 };
    }
  }

  function saveBLRecord(rec) {
    try {
      localStorage.setItem(K_BL, JSON.stringify(rec));
    } catch {}
  }

  const BOSSES = [
    {
      id: "toro",
      name: "Toro Galli",
      title: "Il Demolitore del Nord",
      quote: "«Il campo è un'arena, Moretti. Chi esita finisce schiacciato contro le reti!»",
      power: 24,
      gk: 22,
      gkName: "Mura",
      special: "CARICA DEL TORO DISTRUTTIVA"
    },
    {
      id: "kenji",
      name: "Kenji Arata",
      title: "L'Imperatore Aereo",
      quote: "«Da quassù vedo tutte le tue scelte prima che tu muova il piede. Non puoi nasconderti.»",
      power: 28,
      gk: 26,
      gkName: "Wagner",
      special: "VOLO DELL'AQUILA REALE"
    },
    {
      id: "sho",
      name: "Sho Arata",
      title: "Il Cecchino Invisibile",
      quote: "«Non guardare me. Guarda la palla che sta già gonfiando l'incrocio.»",
      power: 32,
      gk: 30,
      gkName: "Ishikawa",
      special: "LAMPO FANTASMA"
    },
    {
      id: "bruno",
      name: "Bruno Sabatini",
      title: "Il Corvo d'Acciaio",
      quote: "«I sentimenti fanno perdere le finali. Il cinismo vince i campionati.»",
      power: 36,
      gk: 34,
      gkName: "Orsini",
      special: "BECCO DEL CORVO FEROCE"
    },
    {
      id: "alter",
      name: "L'Ombra di Leo (Alter Ego)",
      title: "La Rondine Oscura",
      quote: "«Sei davvero disposto a sacrificare tutto pur di diventare il numero uno al mondo?»",
      power: 40,
      gk: 38,
      gkName: "Riflesso Oscuro",
      special: "EGO VOLANTE SUPREMO"
    }
  ];

  let currentStage = 0;
  let egoMeter = 50; // 0 = Altruismo totale, 100 = Ego assoluto
  let matchGuts = 100;
  let myScore = 0;
  let oppScore = 0;
  let matchTurn = 0;
  let onExitCallback = null;

  function setChap(t) {
    const el = document.getElementById("chap");
    if (el) el.textContent = t;
  }

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#00e5ff; color:#0e1424;">${who}</span><span class="t">${html}</span>`;
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

  function renderEgoHud() {
    const stageBox = document.getElementById("matchHud");
    if (stageBox) stageBox.hidden = true;

    let egoBox = document.getElementById("egoHudPanel");
    if (!egoBox) {
      egoBox = document.createElement("div");
      egoBox.id = "egoHudPanel";
      egoBox.className = "ego-hud-panel";
      const txt = document.getElementById("text");
      if (txt && txt.parentNode) {
        txt.parentNode.insertBefore(egoBox, txt);
      }
    }
    egoBox.hidden = false;

    const boss = BOSSES[currentStage];
    const egoPercent = Math.min(100, Math.max(0, egoMeter));
    const modeName = egoPercent >= 75 ? "🔥 AURA EGOISTA (Attaccante Predatore)" : egoPercent <= 25 ? "🤝 CUORE DI SQUADRA (Sinergia Totale)" : "⚖️ EQUILIBRIO";

    egoBox.innerHTML = `
      <div class="ego-hud-top">
        <span style="color:#00e5ff;">🏆 Sfida ${currentStage + 1}/5 · vs ${boss.name}</span>
        <span style="color:var(--gold);">⚽ ${myScore} – ${oppScore}</span>
      </div>
      <div style="font-size:11px; color:var(--dim); display:flex; justify-content:space-between;">
        <span>Intesa Altruista</span>
        <span style="color:#fff; font-weight:bold;">${modeName}</span>
        <span>Ego Predatore</span>
      </div>
      <div class="ego-bar-wrap">
        <div class="ego-bar-fill" style="width:${egoPercent}%;"></div>
        <div class="ego-bar-indicator" style="left:${egoPercent}%;"></div>
      </div>
      <div style="font-size:11px; color:#9fb0c8; display:flex; justify-content:space-between;">
        <span>Grinta: <b>${Math.round(matchGuts)}</b>/100</span>
        <span>Turno: <b>${matchTurn}</b>/8</span>
      </div>
    `;
  }

  function hideEgoHud() {
    const egoBox = document.getElementById("egoHudPanel");
    if (egoBox) egoBox.hidden = true;
  }

  function openBlueLockMode(onBack) {
    onExitCallback = onBack;
    currentStage = 0;
    egoMeter = 50;
    showHub();
  }

  function showHub() {
    hideEgoHud();
    setChap("Blue Lock · La Gabbia dell'Ego");
    const rec = getBLRecord();
    const boss = BOSSES[currentStage];

    showText(
      "voce",
      `
      <b style="color:#00e5ff; font-size:16px;">LA GABBIA DEI PREDATORI · PUNTA NERA</b><br>
      Un bunker scavato nella roccia a picco sul mare. Nessun arbitro, nessuna pietà. Solo il pallone e il tuo istinto di sopravvivenza calcistica.<br><br>
      Livello attuale: <b>Sfida ${currentStage + 1} di 5</b> contro <b>${boss.name}</b> (${boss.title}).<br>
      <i>Record: Vittorie complete: ${rec.won} · Stage massimo: ${rec.highStage}/5</i>
    `
    );

    showButtons([
      {
        label: `Scendi nella Gabbia contro ${boss.name}`,
        sub: `Portiere ${boss.gkName} · Sfida a 8 turni`,
        cls: "hot",
        fn: () => startStageMatch()
      },
      {
        label: "Regolamento dell'Ego & Altruismo",
        sub: "Come funziona il misuratore interiore",
        fn: () => showRules()
      },
      {
        label: "◂ Torna al Menu",
        fn: () => {
          hideEgoHud();
          if (onExitCallback) onExitCallback();
        }
      }
    ], true);
  }

  function showRules() {
    showText(
      "Sara",
      `
      «Leo, ho studiato la gabbia: ogni tua decisione sposta l'ago della bilancia:<br>
      - <b>Azione Egoista</b>: tieni palla, sfidi tutti da solo e carichi l'<b>EGO</b>. Quando superi il 75%, sblocchi il <b>Tiro dell'Ego (Fiamme Nere)</b>, devastante contro qualunque portiere!<br>
      - <b>Azione d'Intesa</b>: cerchi la sponda di Tommy e Gigi. Carichi l'<b>ALTRUISMO</b> e recuperi Grinta preziosa per non rimanere col fiato corto.<br>
      Scegli quale filosofia ti porterà sul tetto del mondo!»
    `
    );

    showButtons([
      {
        label: "Ho capito, andiamo in campo!",
        cls: "hot",
        fn: () => showHub()
      }
    ], true);
  }

  function startStageMatch() {
    myScore = 0;
    oppScore = 0;
    matchTurn = 0;
    matchGuts = 100;
    egoMeter = 50;

    const boss = BOSSES[currentStage];
    setChap(`Gabbia · vs ${boss.name}`);
    renderEgoHud();

    showText(
      boss.id === "alter" ? "ombra" : "voce",
      `
      <b>${boss.name.toUpperCase()}</b> ti fissa da metà campo.<br>
      ${boss.quote}
    `
    );

    setTimeout(() => {
      runAttackTurn();
    }, 1200);
  }

  function runAttackTurn() {
    matchTurn++;
    renderEgoHud();

    if (matchTurn > 8) {
      endMatch();
      return;
    }

    const boss = BOSSES[currentStage];
    const hasEgoShot = egoMeter >= 70 && matchGuts >= 25;
    const hasComboShot = egoMeter <= 30 && matchGuts >= 20;

    showText(
      "leo",
      `
      <b>Turno ${matchTurn}/8</b> · Sei al limite dell'area della Gabbia. ${boss.name} ti sbarra la strada con gli occhi iniettati di sfida.<br>
      Come decidi di attaccare?
    `
    );

    const opts = [
      {
        label: "🔥 Sfonda da solo (Scatto Predatore)",
        sub: "EGO +18% · Grinta -12 · Cerchi la gloria personale",
        fn: () => {
          egoMeter = Math.min(100, egoMeter + 18);
          matchGuts = Math.max(0, matchGuts - 12);
          resolveDribble(true);
        }
      },
      {
        label: "🤝 Dialoga col compagno (Sponda Rapida)",
        sub: "ALTRUISMO +18% · Grinta +10 · Ti appoggi alla squadra",
        fn: () => {
          egoMeter = Math.max(0, egoMeter - 18);
          matchGuts = Math.min(100, matchGuts + 10);
          resolveDribble(false);
        }
      }
    ];

    if (hasEgoShot) {
      opts.unshift({
        label: "⚡ TIRO DELL'EGO (FIAMME NERE)",
        sub: "Tiro speciale anime dell'attaccante supremo · Grinta 25",
        cls: "hot",
        fn: () => executeEgoShot()
      });
    } else if (hasComboShot) {
      opts.unshift({
        label: "⚽ SINERGIA PERFETTA DEL BORGO",
        sub: "Tiro combinato d'intesa assoluta · Grinta 20",
        cls: "hot",
        fn: () => executeComboShot()
      });
    } else {
      opts.push({
        label: "Tira di precisione",
        sub: "Conclusione rapida nell'angolino · Grinta 10",
        disabled: matchGuts < 10,
        fn: () => {
          matchGuts = Math.max(0, matchGuts - 10);
          resolveNormalShot();
        }
      });
    }

    showButtons(opts);
  }

  function resolveDribble(isEgo) {
    const boss = BOSSES[currentStage];
    const success = Math.random() < 0.65;

    if (success) {
      showText(
        "voce",
        isEgo
          ? `<b>SUPERATO!</b> Fai passare la palla tra le gambe di ${boss.name} con un ghigno da predatore. Sei a tu per tu con ${boss.gkName}!`
          : `<b>SCAMBIO PERFETTO!</b> Uno-due fulmineo con Tommy che disorienta ${boss.name}. Sei libero davanti alla porta!`
      );
      showButtons([
        {
          label: "Concludi a rete! ▸",
          cls: "hot",
          fn: () => resolveNormalShot(true)
        }
      ]);
    } else {
      showText(
        "voce",
        `<b>INTERCETTATO!</b> ${boss.name} intuisce il tuo movimento e ti sradica il pallone con una spallata decisa!`
      );
      setTimeout(runDefendTurn, 1000);
    }
  }

  function executeEgoShot() {
    matchGuts = Math.max(0, matchGuts - 25);
    const boss = BOSSES[currentStage];

    if (window.triggerAnimeCutin) {
      window.triggerAnimeCutin(
        {
          who: "LEO (EGO)",
          shotName: "TIRO DELL'EGO SUPREMO",
          isEgo: true,
          sfxWord: "GOOOAL!"
        },
        () => {
          myScore++;
          if (window.sfx) window.sfx("goal");
          showText(
            "leo",
            `
            <b style="color:#00e5ff; font-size:17px;">GOL DISTRUTTIVO!</b><br>
            La palla brucia l'aria con una scia di fiamme blu e nere! Il portiere ${boss.gkName} non fa nemmeno in tempo a muovere un dito!
          `
          );
          showButtons([{ label: "Avanti ▸", fn: runDefendTurn }]);
        }
      );
    } else {
      myScore++;
      showText("leo", `<b>GOL DELL'EGO!</b> Il tiro piega le mani di ${boss.gkName}!`);
      showButtons([{ label: "Avanti ▸", fn: runDefendTurn }]);
    }
  }

  function executeComboShot() {
    matchGuts = Math.max(0, matchGuts - 20);
    const boss = BOSSES[currentStage];

    if (window.triggerAnimeCutin) {
      window.triggerAnimeCutin(
        {
          who: "RONDINE FC",
          shotName: "SINERGIA TOTALE",
          isEgo: false,
          sfxWord: "RETEEE!"
        },
        () => {
          myScore++;
          if (window.sfx) window.sfx("goal");
          showText(
            "voce",
            `
            <b style="color:var(--gold); font-size:17px;">GOL SPETTACOLARE!</b><br>
            Triangolazione perfetta a occhi chiusi! Leo appoggia in rete a porta spalancata!
          `
          );
          showButtons([{ label: "Avanti ▸", fn: runDefendTurn }]);
        }
      );
    } else {
      myScore++;
      showText("voce", `<b>GOL DI SQUADRA!</b> Rete splendida!`);
      showButtons([{ label: "Avanti ▸", fn: runDefendTurn }]);
    }
  }

  function resolveNormalShot(boosted = false) {
    const boss = BOSSES[currentStage];
    const prob = boosted ? 0.75 : 0.5;
    const goal = Math.random() < prob;

    if (goal) {
      myScore++;
      if (window.sfx) window.sfx("goal");
      showText("voce", `<b>GOL!</b> Conclusione secca all'angolino basso, ${boss.gkName} battuto!`);
    } else {
      if (window.sfx) window.sfx("crowd");
      showText("voce", `<b>PARATO!</b> ${boss.gkName} devia il pallone sopra la traversa con la punta delle dita!`);
    }
    showButtons([{ label: "Avanti ▸", fn: runDefendTurn }]);
  }

  function runDefendTurn() {
    renderEgoHud();
    const boss = BOSSES[currentStage];

    showText(
      boss.id === "alter" ? "ombra" : "voce",
      `
      <b>CONTRATTACCO!</b> ${boss.name} carica verso Nico preparando il suo colpo segreto: <b>${boss.special}</b>!
    `
    );

    showButtons([
      {
        label: "Muro Difensivo con Nico (Gatto Volante)",
        sub: "Nico si lancia a corpo morto",
        fn: () => {
          const save = Math.random() < 0.6;
          if (save) {
            if (window.sfx) window.sfx("kick");
            showText("nico", "«GATTO VOLANTE DELLA GABBIA! Non passa niente qui!» Nico blocca il tiro sulla linea!");
          } else {
            oppScore++;
            if (window.sfx) window.sfx("goal");
            showText("voce", `<b>GOL AVVERSARIO!</b> La potenza di ${boss.name} piega le difese: pareggiano i conti.`);
          }
          showButtons([{ label: "Prossimo Turno ▸", fn: runAttackTurn }]);
        }
      },
      {
        label: "Intervento in Scivolata Disperata",
        sub: "Leo si lancia per deviare la traiettoria",
        fn: () => {
          const block = Math.random() < 0.55;
          if (block) {
            showText("leo", "Ci metti la punta dello scarpino! Palla deviata in fallo laterale.");
          } else {
            oppScore++;
            showText("voce", `Troppo veloce! ${boss.name} trova il pertugio vincente.`);
          }
          showButtons([{ label: "Prossimo Turno ▸", fn: runAttackTurn }]);
        }
      }
    ]);
  }

  function endMatch() {
    hideEgoHud();
    const boss = BOSSES[currentStage];
    const isWin = myScore > oppScore;

    const rec = getBLRecord();
    rec.highStage = Math.max(rec.highStage, currentStage + (isWin ? 1 : 0));

    if (isWin) {
      if (currentStage >= BOSSES.length - 1) {
        // Vittoria totale torneo
        rec.won++;
        saveBLRecord(rec);
        setChap("Blue Lock · VITTORIA SUPREMA");
        showText(
          "voce",
          `
          <b style="color:#00e5ff; font-size:18px;">HAI DOMATO LA GABBIA DEI PREDATORI!</b><br>
          Hai superato persino la tua Ombra interiore. Adesso Leo possiede l'Alchimia perfetta: il cuore del Borgo unito all'istinto letale del fuoriclasse assoluto!<br><br>
          <i>🏆 Sbloccato il trofeo "PREDATORE SUPREMO DELLA COSTA"!</i>
        `
        );
        showButtons([
          {
            label: "Trionfo al Molo ▸",
            cls: "hot",
            fn: () => {
              if (onExitCallback) onExitCallback();
            }
          }
        ], true);
      } else {
        currentStage++;
        saveBLRecord(rec);
        setChap("Gabbia · Vittoria");
        showText(
          boss.id === "alter" ? "ombra" : "voce",
          `
          <b>VITTORIA CONTRO ${boss.name.toUpperCase()} (${myScore}–${oppScore})!</b><br>
          ${boss.name} riconosce la tua superiorità nella Gabbia.<br>
          Ti prepari per la prossima sfida: <b>${BOSSES[currentStage].name}</b> ti attende!
        `
        );
        showButtons([
          {
            label: `Affronta ${BOSSES[currentStage].name} ▸`,
            cls: "hot",
            fn: () => startStageMatch()
          },
          {
            label: "Prendi fiato al Bar Moretti",
            fn: () => showHub()
          }
        ], true);
      }
    } else {
      saveBLRecord(rec);
      setChap("Gabbia · Sconfitta");
      showText(
        "nico",
        `
        «Che batosta! I tiri nella Gabbia rimbalzano ovunque! Ricarichiamoci con due teglie di focaccia e riproviamo subito!»
      `
      );
      showButtons([
        {
          label: "Riprova questa sfida",
          cls: "hot",
          fn: () => startStageMatch()
        },
        {
          label: "Torna all'ingresso della Gabbia",
          fn: () => showHub()
        }
      ], true);
    }
  }

  window.openBlueLockMode = openBlueLockMode;
})();
