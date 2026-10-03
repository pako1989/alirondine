// ================= v17 · LA TRAVERSATA D'ORO: IL TORNEO DEI TRABUCCHI =================
// Nuova saga narrativa speciale: dialoghi drammatici, bivi tattici sul bancone del bar,
// sfide tra le onde e partite sul campetto della scogliera con la ciurma dei Corsari del Tigullio.
(function () {
  const K_TRAV = "ali-di-rondine.traversata-oro";

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

  const TRAV_EP = [
    {
      id: "ep1",
      title: "Il Veliero di Ponente",
      sub: "Capitolo 1 · Una vecchia scommessa sul molo",
      bg: "beach",
      speaker: "baciccia",
      scene: [
        ["baciccia", "Guarda là, Leo. Quel gozzo a vela latina ormeggiato sotto il faro non si vedeva dal 1982."],
        ["leo", "Chi c'è al timone, Baciccia? Sembrano pescatori di Camogli."],
        ["baciccia", "Peggio: è Renzo Solari, detto 'Il Falco'. Ai tempi della C2 giocavamo insieme. Dice che il nostro molo non reggerebbe dieci minuti contro i suoi trabucchi."],
        ["sara", "Ho i dati delle loro ultime partite: giocano con un 3-5-2 asimmetrico, sfruttano il vento di mare per tiri a scendere sul secondo palo."],
        ["nonna", "Che tirino dove vogliono! Ho appena sfornato una teglia con cipolle di Certaldo. Se Renzo vuole fare il gradasso, gli tiro la teglia sul gozzo!"]
      ],
      choices: [
        {
          id: "schema_gigi",
          label: "Disegna lo schema delle tazzine con Gigi al Bar",
          sub: "Tattica di contropiede · Blocco centrale e verticalizzazione veloce",
          effect: "tattica",
          mate: "Gigi",
          line: "Gigi dispone tre tazzine sul bancone e spiega come aggirare la marcatura a uomo dei Corsari."
        },
        {
          id: "grinta_nico",
          label: "Allena le uscite basse sul cemento con Nico",
          sub: "Grinta e coraggio · Nico si lancia sui palloni bagnati dalla risacca",
          effect: "grinta",
          mate: "Nico",
          line: "Nico para quattro tiri consecutivi gridando: «Nessun falco entra nel nido della Rondine!»"
        }
      ],
      team: {
        name: "I Corsari del Tigullio",
        vs: "i Corsari del Tigullio",
        gk: "Solari",
        color: "#1d3fa3"
      },
      winLine: "«Un gol da cineteca di Leo spegne le arie del Falco! Borgo Marino conquista il primo round della Traversata!»"
    },
    {
      id: "ep2",
      title: "La Trappola dei Caruggi",
      sub: "Capitolo 2 · L'allenamento segreto della focaccia",
      bg: "borgo",
      speaker: "nonna",
      scene: [
        ["nonna", "Ieri sera ho visto due spie dei Corsari che sbirciavano dal vicolo delle Sirene. Pensano che ci alleniamo sul campo grande."],
        ["leo", "E invece dove andiamo, Nonna?"],
        ["nonna", "Tutti dentro la Panda 30! Vi porto su al santuario di Monte Nero. Là c'è una piazzola di pietre dove la palla rimbalza come una lepre!"],
        ["tommy", "Sul selciato bagnato? Ma è scivolosissimo!"],
        ["gigi", "È proprio lì il segreto, Tommy: chi impara a controllare la palla sulle pietre umide, sull'erba vola come un gabbiano!"]
      ],
      choices: [
        {
          id: "dribbling",
          label: "Perfeziona il dribbling nello spazio stretto dei caruggi",
          sub: "Tecnica sopraffina · Leo salta le fioriere con tocchi d'esterno",
          effect: "tecnica",
          mate: "Tommy",
          line: "Leo danza sul selciato scambiando palla di prima con Tommy tra le porte delle case."
        },
        {
          id: "tiro_faro",
          label: "Prova le conclusioni a giro con vento contrario",
          sub: "Potenza balistica · Tiro a scendere sul palo lontano",
          effect: "tiro",
          mate: "Sara",
          line: "Sara calcola le folate del vento: Leo scaglia tre tiri a parabola perfetta che gonfiano la rete improvvisata."
        }
      ],
      team: {
        name: "Gabbiani di Camogli",
        vs: "i Gabbiani di Camogli",
        gk: "Vincenzo",
        color: "#ff7b00"
      },
      winLine: "«La coordinazione stretta imparata nei caruggi beffa la difesa avversaria! La Rondine vola in semifinale!»"
    },
    {
      id: "ep3",
      title: "La Battaglia della Scogliera",
      sub: "Capitolo 3 · Scirocco e mareggiate",
      bg: "beach",
      speaker: "ester",
      scene: [
        ["ester", "Attenzione ragazzi: la lanterna del faro segnala mare forza quattro in arrivo dal largo."],
        ["sara", "Il campo del molo sarà spazzato da spruzzi di salsedine. I palloni diventeranno pesanti e imprevedibili."],
        ["nico", "Meglio così! Il cemento bagnato è il mio habitat naturale. Se Renzo crede di spaventarci con due onde, non conosce i liguri!"],
        ["papa", "Ho portato tre ceste di focaccia appena sfornata sulla banchina: energia pura prima del fischio d'inizio!"]
      ],
      choices: [
        {
          id: "muro_costa",
          label: "Forma il Muro della Scogliera davanti a Nico",
          sub: "Difesa ferrea · Blocca tutti i tiri dalla distanza",
          effect: "difesa",
          mate: "Ruggeri",
          line: "Ruggeri guida la linea difensiva: nessun pallone passa e la squadra regge l'urto delle folate di vento."
        },
        {
          id: "contropiede",
          label: "Innesca il contropiede lampo sul filo della banchina",
          sub: "Velocità micidiale · Leo lancia Tommy nello spazio vuoto",
          effect: "velocita",
          mate: "Leo",
          line: "Leo controlla di tacco sulla linea dell'out e pennella un traversone d'oro per il gol decisivo!"
        }
      ],
      team: {
        name: "Fortezza di Portovenere",
        vs: "la Fortezza di Portovenere",
        gk: "Balbi",
        color: "#2a9d8f"
      },
      winLine: "«Sotto gli spruzzi della risacca, una bordata terrificante di Leo all'incrocio piega la Fortezza! SIAMO IN FINALE!»"
    },
    {
      id: "ep4",
      title: "La Notte della Lanterna d'Oro",
      sub: "Capitolo 4 · La Grande Finale sotto le stelle",
      bg: "stadium",
      speaker: "leo",
      scene: [
        ["leo", "Tutto il Borgo è sceso al molo: ci sono le lampare accese, i tavolini della trattoria affollati e la Panda di Nonna coi fari puntati sul campo."],
        ["solari", "Riconosco il vostro valore, Moretti. Ma la Lanterna d'Oro appartiene a chi ha navigato più mari. Stasera non ci saranno sconti."],
        ["baciccia", "Fagli vedere di che pasta siamo fatti, Leo! Il Tiro della Rondine ha il cuore di questo golfo!"],
        ["nonna", "Se vincete, focaccia gratis per tutto il paese fino all'alba! AVANTI RONDINE!"]
      ],
      choices: [
        {
          id: "tiro_rondine_finale",
          label: "Scatena il Tiro della Rondine Dorata al 90°",
          sub: "Super mossa finale · La parabola impossibile a picco sul mare",
          effect: "super",
          mate: "Leo",
          line: "Leo carica tutta la grinta della squadra: la palla si alza verso le stelle e scende a foglia morta nell'angolino!"
        },
        {
          id: "gioco_corale",
          label: "Azione corale con tutta la squadra di Borgo Marino",
          sub: "Il calcio del popolo · Scambi di prima tra Nico, Tommy e Leo",
          effect: "cuore",
          mate: "Squadra",
          line: "Sette passaggi di prima al volo fanno impazzire i Corsari: tap-in vincente a porta vuota!"
        }
      ],
      team: {
        name: "I Corsari di Renzo Solari",
        vs: "i Corsari di Renzo Solari",
        gk: "Renzo Solari",
        color: "#c9a24a"
      },
      winLine: "«TRIONFO ASSOLUTO! La Lanterna d'Oro è di Borgo Marino! La festa esplode tra fuochi d'artificio e clacson della Panda 30!»"
    }
  ];

  function getTravData() {
    try {
      const d = JSON.parse(localStorage.getItem(K_TRAV));
      if (d && typeof d === "object") return d;
    } catch (e) {}
    return { won: [], picks: {}, played: 0, done: false };
  }

  function saveTravData(d) {
    try { localStorage.setItem(K_TRAV, JSON.stringify(d)); } catch (e) {}
  }

  function openTraversataMenu(onBack) {
    if (window.closeAltStage) window.closeAltStage();
    if (window.gameEngine && window.gameEngine.setView) {
      window.gameEngine.setView({ kind: "scene", bg: "beach" });
    }

    const data = getTravData();
    const curIdx = data.won.length < TRAV_EP.length ? data.won.length : TRAV_EP.length - 1;
    const ep = TRAV_EP[curIdx];
    const isCompleted = data.won.length === TRAV_EP.length;

    setChap("La Traversata d'Oro");

    const introHtml = `
      <b>La Traversata d'Oro & Il Torneo dei Trabucchi</b><br>
      <i>Progresso: ${data.won.length}/${TRAV_EP.length} Sfide vinte</i><br>
      ${isCompleted 
        ? "<span style='color:var(--gold);'>👑 HAI CONQUISTATO LA LANTERNA D'ORO! Il trofeo più antico del Golfo risplende al Bar Moretti.</span>" 
        : `Prossima sfida: <b>${ep.title}</b> (${ep.sub})`}
      <br><span style="color:var(--dim); font-size:12px;">Una saga marinaresca tra caruggi, gozzi a vela latina e grandi battute di Nonna e Baciccia.</span>
    `;

    showText("baciccia", introHtml);

    const btnList = [];

    if (!isCompleted) {
      btnList.push({
        label: `Gioca: ${ep.title}`,
        sub: ep.sub,
        cls: "hot",
        fn: () => playTravChapter(curIdx, onBack)
      });
    } else {
      btnList.push({
        label: "Rivivi la Finalissima della Lanterna d'Oro",
        sub: "Affronta ancora Renzo Solari e i suoi Corsari",
        cls: "hot",
        fn: () => playTravChapter(3, onBack)
      });
      btnList.push({
        label: "Ricomincia la Traversata d'Oro",
        sub: "Azzera le sfide e rigioca i 4 capitoli",
        fn: () => {
          saveTravData({ won: [], picks: {}, played: data.played, done: false });
          if (window.toast) window.toast("Torneo riavviato!", "info", "⛵");
          openTraversataMenu(onBack);
        }
      });
    }

    // Gara dei tiri 3D sul campetto della scogliera
    btnList.push({
      label: "⚽ Sfida dei Tiri 3D sul Molo",
      sub: "Prova le parabole ad effetto nello Stadio 3D",
      cls: "pick",
      fn: () => {
        if (window.openStadium3D) window.openStadium3D(() => openTraversataMenu(onBack));
      }
    });

    // Corsa della Panda 30 in 3D
    btnList.push({
      label: "🚗 La Corsa della Panda 30 in 3D",
      sub: "Consegna le teglie di focaccia calda per la partita!",
      cls: "pick",
      fn: () => {
        if (window.openPanda3D) window.openPanda3D(() => openTraversataMenu(onBack));
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

  function playTravChapter(idx, onBack) {
    const ep = TRAV_EP[idx];
    setChap(`Traversata d'Oro · ${ep.title}`);
    runScene(ep.scene, () => chooseTravTactic(idx, onBack));
  }

  function chooseTravTactic(idx, onBack) {
    const ep = TRAV_EP[idx];
    setChap(`Scelta Tattica · ${ep.title}`);

    showText("leo", `
      <b>Piano tattico per la sfida contro ${ep.team.name}</b><br>
      Il vento di mare impetuoso devia i palloni e il tifo della banchina è caldissimo.<br>
      Come decidi di impostare la partita?
    `);

    const choiceBtns = ep.choices.map((c) => ({
      label: c.label,
      sub: c.sub,
      cls: "hot",
      fn: () => {
        const data = getTravData();
        data.picks[idx] = c.id;
        saveTravData(data);
        startTravMatch(idx, c, onBack);
      }
    }));

    choiceBtns.push({
      label: "◂ Indietro",
      fn: () => openTraversataMenu(onBack)
    });

    showButtons(choiceBtns, true);
  }

  function startTravMatch(idx, chosenTactic, onBack) {
    const ep = TRAV_EP[idx];
    setChap(`Partita · ${ep.title}`);

    showText("voce", `
      <b>${ep.team.name.toUpperCase()} VS RONDINE FC</b><br>
      <i>${chosenTactic.line}</i><br><br>
      Il fischio d'inizio echeggia tra i moli e le reti dei gozzi!
    `);

    showButtons([
      {
        label: "⚽ Risolvi l'azione decisiva nello Stadio 3D!",
        sub: "Calcia la punizione decisiva contro il portiere avversario",
        cls: "hot",
        fn: () => {
          if (window.openStadium3D) {
            window.openStadium3D(() => concludeTravMatch(idx, true, onBack));
          } else {
            concludeTravMatch(idx, true, onBack);
          }
        }
      },
      {
        label: "⚡ Risolvi con tattica e grinta sul campo",
        sub: `Usa ${chosenTactic.mate} e la concentrazione della squadra`,
        cls: "pick",
        fn: () => {
          const grinta = (window.S && window.S.st && window.S.st.grinta) ? window.S.st.grinta : 85;
          const success = grinta >= 20 || Math.random() > 0.25;
          concludeTravMatch(idx, success, onBack);
        }
      }
    ]);
  }

  function concludeTravMatch(idx, isWin, onBack) {
    const ep = TRAV_EP[idx];
    const data = getTravData();
    data.played++;

    if (isWin) {
      if (!data.won.includes(idx)) {
        data.won.push(idx);
        data.won.sort((a, b) => a - b);
      }

      // Ricompensa per Leo
      if (window.S) {
        if (!window.S.xp) window.S.xp = 0;
        window.S.xp += 30;
        if (window.S.st) {
          window.S.st.tiro = Math.min(99, (window.S.st.tiro || 16) + 1);
          window.S.st.grinta = Math.min(100, (window.S.st.grinta || 90) + 10);
        }
      }

      saveTravData(data);
      if (window.sfx) window.sfx("goal");
      if (window.toast) window.toast(`Vittoria! +30 XP · ${ep.title}`, "success", "🏆");

      showText("leo", `
        <b style="color:var(--gold);">VITTORIA RONDINE FC!</b><br>
        ${ep.winLine}<br><br>
        <i>Baciccia stappa una bottiglia di vino bianco e Nonna distribuisce focaccia calda alla ciurma avversaria!</i>
      `);

      showButtons([
        {
          label: idx < TRAV_EP.length - 1 ? "Continua al prossimo capitolo ➔" : "Festeggia la conquista della Lanterna d'Oro!",
          cls: "hot",
          fn: () => openTraversataMenu(onBack)
        }
      ]);
    } else {
      showText("nico", `
        «Accidenti! Ci siamo andati vicinissimi, ma la risacca ha fatto rimbalzare l'ultimo tiro sulla traversa! Una fetta di focaccia e ci riproviamo con più rabbia!»
      `);
      showButtons([
        {
          label: "Riprova questa sfida",
          cls: "hot",
          fn: () => playTravChapter(idx, onBack)
        },
        {
          label: "Torna alla mappa del torneo",
          fn: () => openTraversataMenu(onBack)
        }
      ]);
    }
  }

  window.openTraversataMenu = openTraversataMenu;
})();
