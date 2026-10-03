// ================= v22 · LA FENDITURA QUANTISTICA DELLA PANDA 30 =================
// Saga demenziale e multiversale (Stile Rick & Morty, Futurama e Game of Thrones parody).
// La Panda 30 di Nonna Ferri alimentata a olio di frittura tachionico spalanca
// tre portali dimensionali sopra la scogliera di Borgo Marino!
(function () {
  const K_MULTI = "ali-di-rondine.saga-multiverso";

  function getMultiData() {
    try {
      return JSON.parse(localStorage.getItem(K_MULTI)) || { unlocked: [0], done: [] };
    } catch {
      return { unlocked: [0], done: [] };
    }
  }

  function saveMultiData(d) {
    try {
      localStorage.setItem(K_MULTI, JSON.stringify(d));
    } catch {}
  }

  function setChap(t) {
    const el = document.getElementById("chap");
    if (el) el.textContent = t;
  }

  function showText(who, html) {
    const el = document.getElementById("text");
    if (el) {
      el.innerHTML = `<span class="who" style="background:#57d68d; color:#0e1424;">${who}</span><span class="t">${html}</span>`;
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

  let onBackCb = null;

  function openMultiverseMenu(onBack) {
    onBackCb = onBack;
    const data = getMultiData();
    setChap("Multiverso · La Panda Quantistica");

    showText(
      "nonna",
      `
      «Nicola! Leo! Salite subito sulla Panda! L'altro ieri ho messo nel serbatoio l'olio della frittura di calamari mischiato con l'acqua santa di Don Aurelio e i pezzi di un vecchio transistor di Baciccia.<br>
      Ai cento all'ora sui tornanti del faro... si è aperto uno squarcio verde fluorescente nel cielo sopra le onde!<br>
      Dobbiamo andare a salvare il multiverso prima che si freddi la focaccia!»
    `
    );

    showButtons([
      {
        label: "🌐 Dimensione 1: Borgo Cyberpunk 2099",
        sub: "Cyber-Gabbiani, droni al neon e palloni al plasma",
        cls: "hot",
        fn: () => playCyberpunk()
      },
      {
        label: "⚔️ Dimensione 2: Il Trono delle Tre Riviere",
        sub: data.unlocked.includes(1) ? "Parodia Game of Thrones: cavalieri, trofie e casate" : "Sblocca completando Borgo 2099",
        disabled: !data.unlocked.includes(1),
        cls: data.unlocked.includes(1) ? "hot" : "",
        fn: () => playMedieval()
      },
      {
        label: "🐱 Dimensione 3: L'Impero Galattico del Gatto Supremo",
        sub: data.unlocked.includes(2) ? "Nico è l'Imperatore di un pianeta di gelato" : "Sblocca completando il Trono",
        disabled: !data.unlocked.includes(2),
        cls: data.unlocked.includes(2) ? "hot" : "",
        fn: () => playGalactic()
      },
      {
        label: "◂ Torna al Mondo Reale",
        fn: () => {
          if (onBackCb) onBackCb();
        }
      }
    ], true);
  }

  function playCyberpunk() {
    setChap("Multiverso · Borgo 2099");
    showText(
      "voce",
      `
      <b>BZZZZT!</b> La Panda 30 attraversa il vortice ed esce tra grattacieli olografici sopra il mare di Borgo Marino.<br>
      I gabbiani hanno visori a infrarossi e beccucci al titanio. Don Aurelio è un'IA a 64-bit che dispensa assoluzioni digitali.<br>
      Al posto del campetto della scogliera c'è un'arena antigravitazionale. I <i>Cyber-Gabbiani MK-4</i> vi sfidano: se vincete, vi ridanno la batteria al litio della Panda!
    `
    );

    showButtons([
      {
        label: "Calcia il pallone al plasma antigravitazionale!",
        sub: "Curva la traiettoria superando i sensori dei droni",
        cls: "hot",
        fn: () => {
          if (window.triggerAnimeCutin) {
            window.triggerAnimeCutin(
              {
                who: "CYBER-LEO",
                shotName: "RONDINE AL PLASMA 2099",
                isEgo: true,
                sfxWord: "SYSTEM ERROR!"
              },
              () => finishCyberpunk()
            );
          } else {
            finishCyberpunk();
          }
        }
      }
    ], true);
  }

  function finishCyberpunk() {
    const d = getMultiData();
    if (!d.unlocked.includes(1)) d.unlocked.push(1);
    if (!d.done.includes(0)) d.done.push(0);
    saveMultiData(d);

    if (window.sfx) window.sfx("goal");
    showText(
      "nico",
      `
      «GOOOL NEL FUTURO! Il loro portiere-robot ha fatto fumo da tutte le ventole ed è andato in cortocircuito!<br>
      Nonna ha caricato la batteria della Panda con la spina di un distributore di bibite quantiche. Il portale medievale si sta aprendo!»
    `
    );

    showButtons([
      {
        label: "Attraversa il prossimo portale ▸",
        cls: "hot",
        fn: () => playMedieval()
      },
      {
        label: "Torna alla cabina di pilotaggio",
        fn: () => openMultiverseMenu(onBackCb)
      }
    ], true);
  }

  function playMedieval() {
    setChap("Multiverso · Il Trono delle Riviere");
    showText(
      "voce",
      `
      <b>WOSH!</b> La Panda atterra nel fango davanti alle mura merlate di Castel Moretti.<br>
      Tuo padre indossa una corona di alloro e una corazza d'ottone: <i>Re Enzo il Cuoco di Pietra, Signore delle Sette Padelle</i>.<br>
      «Figlio mio! I Corvi d'Inverno guidati dalla Contessa Ines e da Ser Franco Ruggeri assediano il molo per impadronirsi del segreto del basilico sacro!<br>
      La guerra si deciderà sul campo d'onore in una giostra calcistica!»
    `
    );

    showButtons([
      {
        label: "Sfida Ser Ruggeri alla giostra dei rigori!",
        sub: "Tiro della Rondine con armatura medievale completa",
        cls: "hot",
        fn: () => {
          if (window.triggerAnimeCutin) {
            window.triggerAnimeCutin(
              {
                who: "SER LEO",
                shotName: "LANCIA DELLA RONDINE",
                isEgo: false,
                sfxWord: "PER IL RE!"
              },
              () => finishMedieval()
            );
          } else {
            finishMedieval();
          }
        }
      }
    ], true);
  }

  function finishMedieval() {
    const d = getMultiData();
    if (!d.unlocked.includes(2)) d.unlocked.push(2);
    if (!d.done.includes(1)) d.done.push(1);
    saveMultiData(d);

    if (window.sfx) window.sfx("goal");
    showText(
      "papa",
      `
      «GOL! Il tiro di Ser Leo spezza lo scudo avversario e gonfia la rete di corda d'ormeggio!<br>
      I Corvi d'Inverno si ritirano oltre le montagne! Il regno della trattoria è salvo per altri mille anni!»<br>
      Nonna dà una sgasata: «Salgono tutti! La lancetta dell'olio sta per esplodere verso l'Universo 42!»
    `
    );

    showButtons([
      {
        label: "Verso la Galassia del Gatto Supremo ▸",
        cls: "hot",
        fn: () => playGalactic()
      },
      {
        label: "Torna alla mappa del Multiverso",
        fn: () => openMultiverseMenu(onBackCb)
      }
    ], true);
  }

  function playGalactic() {
    setChap("Multiverso · Il Gatto Supremo");
    showText(
      "voce",
      `
      Lo spazio profondo. Nebulose viola, stelle scintillanti e... un pianeta sferico ricoperto interamente di panna e gelato al fiordilatte.<br>
      Sul trono dell'asteroide siede l'<b>IMPERATORE NICO I</b>, con un mantello galattico e due comete al posto dei guantoni:<br>
      «Benvenuti nella mia dimensione! Qui nessuno paga il gelato, Sara ha acconsentito al matrimonio cosmico e il Gatto Volante è la legge dell'universo! Volete sfidarmi o preferite diventare miei ministri delle acciughe?»
    `
    );

    showButtons([
      {
        label: "Tira con tutta la forza per risvegliare Nico dal sogno cosmico!",
        sub: "Il tiro più potente di tutte le dimensioni",
        cls: "hot",
        fn: () => {
          if (window.triggerAnimeCutin) {
            window.triggerAnimeCutin(
              {
                who: "LEO MORETTI",
                shotName: "RONDINE IPERSPAZIALE",
                isEgo: false,
                sfxWord: "SVEGLIATI, NICO!"
              },
              () => finishGalactic()
            );
          } else {
            finishGalactic();
          }
        }
      }
    ], true);
  }

  function finishGalactic() {
    const d = getMultiData();
    if (!d.done.includes(2)) d.done.push(2);
    saveMultiData(d);

    if (window.sfx) window.sfx("goal");
    setChap("Multiverso · Ritorno al Porto");

    showText(
      "nico",
      `
      <b style="color:var(--gold); font-size:16px;">CRASH DIMENSIONALE!</b><br>
      Il pallone buca l'asteroide di gelato e la Panda 30 riatterra con un sonoro tonfo sulla banchina di Borgo Marino, sollevando uno spruzzo d'acqua di mare.<br><br>
      Nico si strofina gli occhi sul muretto: «Leo? Sara? Ma... non ero l'Imperatore di Andromeda? E le comete di gelato dove sono finite?»<br>
      Nonna Ferri spegne il motore che scoppietta: «Sono finite nel congelatore di Tonino, scemo! E ora andiamo a mangiare le trofie prima che si raffreddino!»<br>
      <i>🏆 Completata la Saga del Multiverso!</i>
    `
    );

    showButtons([
      {
        label: "Rientra alla Trattoria di Casa ▸",
        cls: "hot",
        fn: () => {
          if (onBackCb) onBackCb();
        }
      }
    ], true);
  }

  window.openMultiverseMenu = openMultiverseMenu;
})();
