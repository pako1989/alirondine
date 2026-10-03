// ================= v16 · LA NOTTE DEL FARO E LA COPPA DELLE TRE RIVIERE =================
// Nuova saga narrativa a capitoli: bivi, dialoghi teatrali, partite sul campetto della scogliera
// e scelte tattiche con Leo, Sara, Nico, Nonna e la Panda 30.
(function () {
  const K_FARO = "ali-di-rondine.notte-faro";

  // Helpers sicuri che usano window.gameEngine o il DOM direttamente
  function setChap(t) {
    if (window.gameEngine && typeof window.gameEngine.chap === "function") {
      window.gameEngine.chap(t);
    } else {
      const el = document.getElementById("chap");
      if (el) el.textContent = t;
    }
  }

  function showText(who, html) {
    if (window.gameEngine && typeof window.gameEngine.text === "function") {
      window.gameEngine.text(who, html);
    } else {
      const el = document.getElementById("text");
      if (el) el.innerHTML = `<span class="who">${who}</span><span class="t">${html}</span>`;
    }
  }

  function showButtons(list, one) {
    if (window.gameEngine && typeof window.gameEngine.buttons === "function") {
      window.gameEngine.buttons(list, one);
    } else {
      const c = document.getElementById("choices");
      if (!c) return;
      c.innerHTML = "";
      c.className = "choices" + (one ? " one" : "");
      list.forEach((o) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = o.label;
        if (o.cls) b.className = o.cls;
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
  }

  function runScene(sceneLines, onDone) {
    if (window.gameEngine && typeof window.gameEngine.play === "function") {
      const lines = sceneLines.map(([who, text]) => {
        if (window.gameEngine.L) return window.gameEngine.L(who, text, "beach");
        return { who, text, bg: "beach" };
      });
      window.gameEngine.play(lines, onDone);
    } else {
      onDone && onDone();
    }
  }

  const FARO_EP = [
    {
      id: "ep1",
      title: "L'Ormeggio al Molo Vecchio",
      sub: "Capitolo 1 · Una sfida venuta dal mare",
      bg: "beach",
      speaker: "baciccia",
      scene: [
        ["baciccia", "C'è un gozzo lungo ormeggiato al molo vecchio che non avevo mai visto. Batte bandiera a strisce rosse e nere."],
        ["sara", "Ho controllato i registri del porto: è la ciurma di Valerio Leone, detto 'Mano di Ferro'. Negli anni '80 vinceva tutti i tornei notturni tra Genova e Tolone."],
        ["nico", "E perché è venuto proprio a Borgo Marino a quest'ora? Il Bar Moretti sta chiudendo e le trofie sono finite!"],
        ["nonna", "Niente affatto! Ho ancora sei teglie di focaccia calda nella Panda. Se quei marinai vogliono giocare a pallone, prima devono passare sul mio cofano!"],
        ["leo", "Valerio ha piantato un palo con una lanterna in mezzo al campetto della scogliera. Dice che chi vince la Coppa delle Tre Riviere si porta a casa la leggenda della costa."]
      ],
      choices: [
        {
          id: "vento",
          label: "Studia le correnti del vento con Sara e Baciccia",
          sub: "Strategia tattica · Sara mappa le folate che scendono dal monte",
          effect: "intel",
          mate: "Sara",
          line: "Sara e Baciccia segnano sul taccuino i punti del campo dove il vento di mare devia le parabole dei tiri."
        },
        {
          id: "panda",
          label: "Carica la squadra sulla Panda di Nonna per l'allenamento notturno",
          sub: "Grinta e riflessi · Nico e Tommy provano le uscite sui fari della Panda",
          effect: "grit",
          mate: "Nico",
          line: "Nonna accende gli abbaglianti gialli della Panda 30. Nico para tre tiri al buio gridando GATTO VOLANTE DELLA NOTTE!"
        }
      ],
      team: {
        id: "marinai_faro",
        name: "I Lupi del Molo Vecchio",
        vs: "i Lupi del Molo Vecchio",
        color: "#8a2a2a",
        style: "contropiede",
        power: 16,
        special: ["SCIABOLATA DEL MARE", 22]
      },
      winLine: "Valerio osserva Leo dal parapetto del molo. «Hai il tocco leggero delle rondini, ragazzo. Ma la scogliera non perdona chi ha paura del vuoto.»"
    },
    {
      id: "ep2",
      title: "La Scogliera dei Falchi",
      sub: "Capitolo 2 · Campo di pietra e sale",
      bg: "beach",
      speaker: "sara",
      scene: [
        ["sara", "Il campo di Punta Rondine è ricavato tra la roccia e il mare. Dietro la porta di Nico ci sono quindici metri di scogliera."],
        ["nico", "Ho promesso a mia mamma che stasera non mi butto di sotto... ma per fermare un tiro all'incrocio non garantisco!"],
        ["tommy", "I Falchi di Portovenere giocano con le scarpe da calcetto consumate. Non scivolano mai sulla ghiaia umida."],
        ["gigi", "Io ho portato il nastro isolante per le suole di tutti! E due acciughe salate per la grinta!"]
      ],
      choices: [
        {
          id: "fasce",
          label: "Allarga il gioco sulle fasce per aggirare la roccia",
          sub: "Gigi e Sara creano spazio con triangolazioni rapide",
          effect: "support",
          mate: "Gigi",
          line: "Gigi scatta sulla linea del fallo laterale a un soffio dalle onde, servendo palloni al bacio per l'inserimento centrale."
        },
        {
          id: "muro",
          label: "Innalza la diga difensiva con Tommy",
          sub: "Contrasti duri e recupero palla immediato",
          effect: "intel",
          mate: "Tommy",
          line: "Tommy intercetta ogni rilancio dei Falchi a centrocampo: la palla resta inchiodata nella loro metà campo."
        }
      ],
      team: {
        id: "falchi_scogliera",
        name: "I Falchi della Scogliera",
        vs: "i Falchi della Scogliera",
        color: "#b8862a",
        style: "pressing",
        power: 21,
        special: ["PICCHIATA DEL FALCO", 28]
      },
      winLine: "Il capitano dei Falchi cede il passo. Le lanterne delle barche dei pescatori cominciano ad accendersi all'orizzonte: la finale è vicina."
    },
    {
      id: "ep3",
      title: "La Lanterna Rotante",
      sub: "Capitolo 3 · Semifinale sotto il fascio di luce",
      bg: "beach",
      speaker: "ester",
      scene: [
        ["ester", "Ho acceso la lanterna del faro a piena potenza. Ogni quattordici secondi il fascio bianco illumina l'area di rigore."],
        ["papa", "Chi sa leggere il ritmo del faro sa quando calciare senza che il portiere riesca a mettere a fuoco il pallone."],
        ["bruno", "I Corsari di Nizza sono veloci e sfrontati. Non hanno paura del buio. Ma voi avete il Borgo dietro le spalle."],
        ["leo", "Basta un secondo di luce per vedere dove si muove Nico. Poi tocca al Tiro della Rondine fare il resto."]
      ],
      choices: [
        {
          id: "sincro",
          label: "Calcola il tempo del faro per il tiro a sorpresa",
          sub: "Leo sfrutta il cono d'ombra per fulminare il portiere",
          effect: "grit",
          mate: "Bruno",
          line: "Bruno suggerisce il tempo esatto: appena il fascio fende la salsedine, Leo calcia secco a mezza altezza!"
        },
        {
          id: "coro",
          label: "Coinvolgi tutta la squadra in un possesso palla ipnotico",
          sub: "Tutti toccano il pallone prima della conclusione",
          effect: "support",
          mate: "Papa",
          line: "La Rondine muove il pallone a un tocco tra gli applausi dei pescatori: i Corsari non vedono mai la palla."
        }
      ],
      team: {
        id: "corsari_nizza",
        name: "I Corsari della Costa Blu",
        vs: "i Corsari della Costa Blu",
        color: "#1d3fa3",
        style: "tecnico",
        power: 28,
        special: ["ONDA BLU DI NIZZA", 36]
      },
      winLine: "I Corsari salutano levando le borracce verso il faro. Resta solo l'ultimo atto: il vecchio Valerio Leone in persona."
    },
    {
      id: "ep4",
      title: "La Notte delle Tre Riviere",
      sub: "Capitolo 4 · La Grande Finale sul mare",
      bg: "beach",
      speaker: "papa",
      scene: [
        ["valerio", "Moretti! Tuo padre mi ha battuto quarant'anni fa con una rovesciata sotto la pioggia. Stasera tocca a te dimostrare se porti davvero le Ali di Rondine."],
        ["papa", "Valerio ha schierato i migliori undici marinai della riviera. Sarà una battaglia su ogni metro di fango e ghiaia."],
        ["sara", "Il taccuino dice che non perdono da trentaquattro partite. Ma nessuno di loro ha mai giocato con l'odore del nostro pesto nell'aria."],
        ["nonna", "Se vincete, focaccia ripiena e gelato al limone per tutti fino all'alba! Se perdete... vi riporto a casa a spinta con la Panda!"],
        ["leo", "Ragazzi, sentite il rumore della risacca? Questo è il nostro campo. Voliamo!"]
      ],
      choices: [
        {
          id: "rondine_oro",
          label: "Lancia il SUPER TIRO DELLA RONDINE DEL FARO",
          sub: "Tiro a effetto leggendario che taglia il vento marino",
          effect: "grit",
          mate: "Sara",
          line: "Leo raccoglie tutta la sua grinta: la palla disegna un arco perfetto che scavalca la barriera e si insacca nell'angolino più alto!"
        },
        {
          id: "fratellanza",
          label: "Passaggio smarcante per l'inserimento a rimorchio di Nico e Tommy",
          sub: "Il gol corale che unisce tutto il Borgo",
          effect: "support",
          mate: "Tommy",
          line: "Leo finta il tiro, attira tutta la difesa e appoggia a rimorchio: la rete trema sul boato di Borgo Marino!"
        }
      ],
      team: {
        id: "tre_riviere_final",
        name: "Selezione delle Tre Riviere",
        vs: "la Selezione di Capitan Valerio",
        color: "#c9302c",
        style: "maestoso",
        power: 35,
        special: ["TUONO DELLA LANTERNA", 46]
      },
      winLine: "Valerio solleva la Coppa d'argento delle Tre Riviere e la posa tra le mani di Leo e della squadra. «Borgo Marino ha un cuore che non affonda mai. Portate queste ali sempre con voi.»"
    }
  ];

  function getFaroData() {
    try {
      const d = JSON.parse(localStorage.getItem(K_FARO));
      if (d && typeof d === "object") return d;
    } catch (e) {}
    return { won: [], picks: {}, played: 0, done: false };
  }

  function saveFaroData(d) {
    try { localStorage.setItem(K_FARO, JSON.stringify(d)); } catch (e) {}
  }

  function openFaroStoryMenu(onBack) {
    const data = getFaroData();
    const curIdx = data.won.length < FARO_EP.length ? data.won.length : FARO_EP.length - 1;
    const ep = FARO_EP[curIdx];
    const isCompleted = data.won.length === FARO_EP.length;

    setChap("La Notte del Faro");

    const introHtml = `
      <b>La Notte del Faro & La Coppa delle Tre Riviere</b><br>
      <i>Progresso: ${data.won.length}/${FARO_EP.length} Capitoli conquistati</i><br>
      ${isCompleted 
        ? "<span style='color:var(--gold);'>🏆 Hai conquistato la Coppa delle Tre Riviere! Il trofeo brilla nella bacheca del molo.</span>" 
        : `Prossimo capitolo: <b>${ep.title}</b> (${ep.sub})`}
      <br><span style="color:var(--dim); font-size:12px;">Una storia speciale tra scogliere, onde notturne, fari e il grande calcio ligure.</span>
    `;

    showText("baciccia", introHtml);

    const btnList = [];

    if (!isCompleted) {
      btnList.push({
        label: `Gioca: ${ep.title}`,
        sub: ep.sub,
        cls: "hot",
        fn: () => playFaroChapter(curIdx, onBack)
      });
    } else {
      btnList.push({
        label: "Rivivi la Grande Finale al Faro",
        sub: "Affronta ancora Capitan Valerio Leone",
        cls: "hot",
        fn: () => playFaroChapter(3, onBack)
      });
      btnList.push({
        label: "Ricomincia la Notte del Faro",
        sub: "Rigioca tutti i 4 capitoli dall'inizio",
        fn: () => {
          saveFaroData({ won: [], picks: {}, played: data.played, done: false });
          if (window.toast) window.toast("Saga riavviata!", "info", "⛵");
          openFaroStoryMenu(onBack);
        }
      });
    }

    // Modalità 3D di supporto
    btnList.push({
      label: "⚽ Sfida dei Tiri 3D sul Campo del Faro",
      sub: "Metti alla prova il Tiro della Rondine nello Stadio 3D",
      cls: "pick",
      fn: () => {
        if (window.openStadium3D) window.openStadium3D(() => openFaroStoryMenu(onBack));
      }
    });

    btnList.push({
      label: "◂ Torna al Menu",
      fn: () => {
        if (typeof onBack === "function") onBack();
        else if (window.gameEngine && window.gameEngine.title) window.gameEngine.title();
      }
    });

    showButtons(btnList);
  }

  function playFaroChapter(idx, onBack) {
    const ep = FARO_EP[idx];
    setChap(`La Notte del Faro · ${ep.title}`);

    runScene(ep.scene, () => chooseFaroTactic(idx, onBack));
  }

  function chooseFaroTactic(idx, onBack) {
    const ep = FARO_EP[idx];
    setChap(`Scelta Tattica · ${ep.title}`);

    showText("leo", `
      <b>Preparazione al fischio d'inizio</b><br>
      La brezza dal mare soffia forte e il campo è illuminato a intermittenza.<br>
      Quale piano tattico scegli per affrontare ${ep.team.name}?
    `);

    const choiceBtns = ep.choices.map((c) => ({
      label: c.label,
      sub: c.sub,
      cls: "hot",
      fn: () => {
        const data = getFaroData();
        data.picks[idx] = c.id;
        saveFaroData(data);
        startFaroMatch(idx, c, onBack);
      }
    }));

    choiceBtns.push({
      label: "◂ Indietro",
      fn: () => openFaroStoryMenu(onBack)
    });

    showButtons(choiceBtns, true);
  }

  function startFaroMatch(idx, chosenTactic, onBack) {
    const ep = FARO_EP[idx];
    setChap(`Partita · ${ep.title}`);

    showText("voce", `
      <b>${ep.team.name.toUpperCase()} VS RONDINE FC</b><br>
      <i>${chosenTactic.line}</i><br><br>
      La partita comincia tra gli applausi dei pescatori del Molo Vecchio!
    `);

    showButtons([
      {
        label: "⚽ Gioca l'azione decisiva in 3D!",
        sub: "Tiro della Rondine nell'Arena 3D per decidere il match",
        cls: "hot",
        fn: () => {
          if (window.openStadium3D) {
            window.openStadium3D(() => concludeFaroMatch(idx, true, onBack));
          } else {
            concludeFaroMatch(idx, true, onBack);
          }
        }
      },
      {
        label: "⚡ Risolvi con tattica e grinta sul campo",
        sub: `Usa ${chosenTactic.mate} e le statistiche della squadra`,
        cls: "pick",
        fn: () => {
          const grinta = (window.S && window.S.st && window.S.st.grinta) ? window.S.st.grinta : 80;
          const success = grinta >= 20 || Math.random() > 0.3;
          concludeFaroMatch(idx, success, onBack);
        }
      }
    ]);
  }

  function concludeFaroMatch(idx, isWin, onBack) {
    const ep = FARO_EP[idx];
    const data = getFaroData();
    data.played++;

    if (isWin) {
      if (!data.won.includes(idx)) {
        data.won.push(idx);
        data.won.sort((a, b) => a - b);
      }

      // Ricompensa per Leo
      if (window.S) {
        if (!window.S.xp) window.S.xp = 0;
        window.S.xp += 25;
        if (window.S.st) {
          window.S.st.tiro = Math.min(99, (window.S.st.tiro || 16) + 1);
          window.S.st.grinta = Math.min(100, (window.S.st.grinta || 90) + 10);
        }
      }

      saveFaroData(data);
      if (window.sfx) window.sfx("goal");
      if (window.toast) window.toast(`Vittoria al Faro! +25 XP · ${ep.title}`, "success", "🏆");

      showText("leo", `
        <b style="color:var(--gold);">VITTORIA RONDINE!</b><br>
        ${ep.winLine}<br><br>
        <i>La squadra festeggia con focaccia calda offerta dalla Nonna sulla banchina!</i>
      `);

      showButtons([
        {
          label: idx < FARO_EP.length - 1 ? "Continua al prossimo capitolo ➔" : "Festeggia la conquista della Coppa!",
          cls: "hot",
          fn: () => openFaroStoryMenu(onBack)
        }
      ]);
    } else {
      showText("nico", `
        «Accidenti! Ci siamo andati vicini, ma il vento ha fatto deviare l'ultimo tiro sul palo! Ricarichiamo le batterie al Bar Moretti e riproviamoci!»
      `);
      showButtons([
        {
          label: "Riprova questo capitolo",
          cls: "hot",
          fn: () => playFaroChapter(idx, onBack)
        },
        {
          label: "Torna alla mappa della saga",
          fn: () => openFaroStoryMenu(onBack)
        }
      ]);
    }
  }

  window.openFaroStoryMenu = openFaroStoryMenu;
})();
