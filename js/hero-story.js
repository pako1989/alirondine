// ================= LA LEGGENDA DEL TUO CAMPIONE: SAGA ESCLUSIVA =================
// Saga narrativa e calcistica interattiva cucita su misura per il Campione creato dal giocatore:
// - Dialoghi personalizzati col nome, numero, maglia, chibi e tiro speciale del tuo campione
// - Scelte tattiche, bivi narrativi e partite decisive della Rondine FC
// - 4 Capitoli epici:
//   1. Il Treno delle Cinque Terre & Il Provino al Molo
//   2. La Notte alla Trattoria Moretti & La Maglia Ufficiale
//   3. Il Derby della Scogliera contro Punta Nera
//   4. La Notte della Lanterna d'Oro & Il Tiro della Gloria
(function () {
  "use strict";

  const K_SAVE = "ali-di-rondine.hero-story";

  function getHeroData() {
    try {
      if (typeof window.heroLoad === "function") {
        return window.heroLoad();
      }
      const raw = localStorage.getItem("ali-di-rondine.eroe");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function loadProgress() {
    try {
      const d = JSON.parse(localStorage.getItem(K_SAVE));
      if (d && typeof d.chap === "number") return d;
    } catch (e) {}
    return { chap: 1, goals: 0, partner: "leo", role: "fantasista", won: false };
  }

  function saveProgress(p) {
    try {
      localStorage.setItem(K_SAVE, JSON.stringify(p));
    } catch (e) {}
  }

  let returnCallback = null;

  function getEngine() {
    return window.gameEngine || {
      chap: (t) => { const el = document.getElementById("chap"); if (el) el.textContent = t; },
      text: (who, html) => { const el = document.getElementById("text"); if (el) el.innerHTML = `<span class="who">${who}</span><span class="t">${html}</span>`; },
      buttons: (list, one) => {
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
      },
      play: (lines, then) => {
        if (typeof window.play === "function") window.play(lines, then);
        else then && then();
      },
      L: (who, text, bg) => ({ who, text, bg: bg || "beach" })
    };
  }

  // --- MENU PRINCIPALE DELLA SAGA DEL CAMPIONE ---
  window.openHeroStoryMenu = function (onBack) {
    returnCallback = onBack;
    const hero = getHeroData();
    const eng = getEngine();

    if (!hero || !hero.name) {
      // Se non ha ancora creato il campione, mostriamo invito con creazione immediata
      eng.chap("La Storia del Tuo Campione");
      eng.text("voce", `<b>Il tuo viaggio a Borgo Marino ti aspetta!</b><br>Per iniziare questa saga speciale, devi prima dare un'identità al tuo campione: scegli il suo nome, il numero di maglia preferito, l'aspetto e il nome del suo devastante tiro speciale.`);
      eng.buttons([
        {
          label: "✨ Crea il tuo Campione ▸",
          sub: "Apri l'editor per scegliere nome, look e tiro",
          cls: "hot",
          fn: () => {
            if (typeof window.heroEditor === "function") {
              window.heroEditor(() => window.openHeroStoryMenu(onBack));
            }
          }
        },
        { label: "◂ Indietro", fn: () => { if (onBack) onBack(); else if (eng.title) eng.title(); } }
      ], true);
      return;
    }

    const prog = loadProgress();
    eng.chap(`La Leggenda di ${hero.name}`);
    eng.text("hero", `<b>La Saga del Tuo Campione: ${hero.name} (N. ${hero.num})</b><br>Tiro speciale: <em>«${hero.shotName || "TIRO FULMINANTE"}»</em>.<br><br>Borgo Marino accoglie un nuovo talento. Dalle prime palleggiate sulla battigia fino alla finale della Lanterna d'Oro con la maglia della Rondine FC.`);

    const chapters = [
      { id: 1, title: "Capitolo 1 · Il Provino al Molo", sub: "L'arrivo col treno e la sfida a Mister Ruggeri" },
      { id: 2, title: "Capitolo 2 · La Notte alla Trattoria", sub: `Rita, Papà Enzo e la consegna della maglia N. ${hero.num}` },
      { id: 3, title: "Capitolo 3 · Il Derby della Scogliera", sub: "La battaglia contro i Corsari di Punta Nera" },
      { id: 4, title: "Capitolo 4 · La Notte della Lanterna d'Oro", sub: "La grande finale sotto le stelle del Golfo" }
    ];

    const btns = chapters.map((ch) => {
      const isCurrent = prog.chap === ch.id;
      const isDone = prog.chap > ch.id;
      const isLocked = prog.chap < ch.id;

      return {
        label: `${isDone ? "✓ " : isCurrent ? "▶ " : "🔒 "}${ch.title}`,
        sub: isLocked ? "Completa i capitoli precedenti per sbloccarlo" : ch.sub,
        cls: isCurrent ? "hot" : "",
        disabled: isLocked,
        fn: () => startChapter(ch.id, hero, prog)
      };
    });

    if (prog.won) {
      btns.push({
        label: "🏆 Epilogo & Riconoscimenti del Borgo",
        sub: "Rileggi l'articolo trionfale de L'Eco del Tirreno e riscuoti il premio",
        cls: "hot",
        fn: () => showEpilogue(hero, prog)
      });
    }

    btns.push({
      label: "🎨 Modifica Look o Tiro del Campione",
      sub: "Torna all'editor per cambiare pettinatura o nome del tiro",
      fn: () => {
        if (typeof window.heroEditor === "function") {
          window.heroEditor(() => window.openHeroStoryMenu(onBack));
        }
      }
    });

    btns.push({
      label: "◂ Torna al Menu",
      fn: () => {
        if (onBack) onBack();
        else if (eng.title) eng.title();
      }
    });

    eng.buttons(btns, true);
  };

  // --- CAPITOLO 1: IL PROVINO AL MOLO ---
  function startChapter(chId, hero, prog) {
    const eng = getEngine();
    const L = eng.L;

    if (chId === 1) {
      eng.chap("Cap. 1 · Il Provino al Molo");
      eng.play([
        L("voce", "Il vecchio treno regionale cigola sulla ferrovia litoranea e frena alla stazione di Borgo Marino. Salsedine, pini marittimi e profumo di focaccia appena sfornata.", "borgo"),
        L("hero", `(scendendo dal treno con la sacca sportiva sulla spalla) «Eccomi finalmente. Borgo Marino. Dicono che qui il calcio sia più di una religione... Vediamo se sono pronti a vedere come gioca ${hero.name}.»`, "borgo"),
        L("voce", "Sul campetto del molo, tra la banchina dei gozzi e la scogliera, si sente il rumore secco di un pallone calciato contro il muro di mattoni rossi.", "beach"),
        L("leo", "«Palla sul destro, stop a seguire, piatto sotto l'incrocio! Dai Nico, questa era imparabile!»", "beach"),
        L("nico", "«Imparabile un corno! Avevo un granello di sabbia nel guanto sinistro. E poi stavo guardando se Tonino tirava fuori i gelati al pistacchio.»", "beach"),
        L("sara", `«Smettetela voi due. Piuttosto guardate verso la cancellata: c'è qualcuno con gli scarpini ai piedi che ci osserva da dieci minuti.»`, "beach"),
        L("ruggeri", `(appoggiato alla ringhiera con le braccia conserte) «Tu saresti ${hero.name}? Mi ha telefonato ieri un mio vecchio amico dalla provincia. Dice che hai un piede che canta. Ma a me delle parole non importa niente. A me importa cosa fai col pallone tra i piedi.»`, "beach"),
        L("hero", `«Mister, mettimi alla prova. Ho portato con me il mio colpo migliore: il ${hero.shotName || "Tiro Fulminante"}.»`, "beach"),
        L("nico", `«Uuuuh, un nome altisonante! Mettiti lì dai venti metri, campione. Il Gatto Volante non ha paura di nessuno!»`, "beach"),
      ], () => {
        // Scelta interattiva del tiro
        eng.text("ruggeri", `Mister Ruggeri ti getta il pallone con un colpo di suola: «Palla a terra, tre passi di rincorsa. Fai vedere a tutto il molo di che pasta sei fatto, ${hero.name}!»`);
        eng.buttons([
          {
            label: `⚡ Scatena ${hero.shotName || "il tuo Tiro Speciale"} di potenza!`,
            sub: "Miracolo balistico mirato all'incrocio dei pali",
            cls: "hot",
            fn: () => {
              try { if (window.sfx) window.sfx("shot_rondine"); } catch (e) {}
              eng.play([
                L("voce", `Prendi la rincorsa con lo sguardo fisso sul sette. L'impatto con il cuoio è un tuono secco che rimbomba su tutte le barche ormeggiate. La traiettoria brucia l'aria!`, "beach"),
                L("nico", `«Mamma mia! Ho visto una cometa passare a due dita dal palo! Ma come diavolo hai fatto a dargli quel giro?!»`, "beach"),
                L("leo", `«Che botta, ragazzi... Mister, hai visto anche tu? Questo qui ha una dinamite nel piede!»`, "beach"),
                L("ruggeri", `(un sorriso appena accennato sotto i baffi ruvidi) «Discreto. Poteva essere mezzo centimetro più all'angolo, ma la potenza c'è. Sei dentro, ${hero.name}. Vieni alla Trattoria stasera: dobbiamo parlare del tuo numero di maglia.»`, "beach")
              ], () => {
                prog.chap = 2;
                prog.goals += 1;
                saveProgress(prog);
                if (window.toast) window.toast("Capitolo 1 Completato! Sbloccato Cap. 2", "success", "⭐");
                window.openHeroStoryMenu(returnCallback);
              });
            }
          },
          {
            label: "🎯 Pennella una parabola beffarda all'incrocio",
            sub: "Precisione millimetrica e tocco morbido a scavalcare",
            fn: () => {
              try { if (window.sfx) window.sfx("kick"); } catch (e) {}
              eng.play([
                L("voce", `Accarezzi il pallone con l'interno collo. La sfera sale piano, scavalca il balzo disperato di Nico e accarezza il ferro interno prima di adagiarsi nella rete.`, "beach"),
                L("sara", `(segnando freneticamente sul tablet) «Velocità di rotazione perfetta, angolo parabolico a quaranta gradi. Non vedevo una precisione così dai tempi di Fede Lanza.»`, "beach"),
                L("ruggeri", `«Hai la testa alta e il compasso nei piedi. Mi piace. Il provino è superato. Benvenuto nella Rondine FC, ${hero.name}.»`, "beach")
              ], () => {
                prog.chap = 2;
                prog.goals += 1;
                saveProgress(prog);
                if (window.toast) window.toast("Capitolo 1 Completato! Sbloccato Cap. 2", "success", "⭐");
                window.openHeroStoryMenu(returnCallback);
              });
            }
          }
        ], true);
      });
    }

    // --- CAPITOLO 2: LA NOTTE ALLA TRATTORIA ---
    else if (chId === 2) {
      eng.chap("Cap. 2 · La Notte alla Trattoria");
      eng.play([
        L("voce", "Quella sera, alla Trattoria Moretti, i tavoli sono imbanditi con teglie di focaccia con la salvia, trofie al pesto di mortaio e caraffe di vino bianco fresco.", "trattoria"),
        L("rita", `«Mangia, mangia ${hero.name}! A mezzogiorno ti ho visto correre sul molo: hai le gambe lunghe ma devi mettere su un chilo di muscoli prima del derby di domenica!»`, "trattoria"),
        L("papa", `«Rita ha ragione. Ma soprattutto... guarda cosa c'è qui sul bancone.»`, "trattoria"),
        L("voce", `Papà Enzo scosta una tovaglia a quadri e rivela una scatola di cartone vintage. Dentro c'è la divisa ufficiale amaranto della Rondine FC, pulita e stirata di fresco. Sul retro spicca il tuo numero: il ${hero.num}.`, "trattoria"),
        L("hero", `«La maglia numero ${hero.num}... È bellissima. La porterò in campo con orgoglio, ve lo giuro.»`, "trattoria"),
        L("papa", `«Quella maglia ha una storia. L'ha indossata chi giocava col cuore in gola e la salsedine negli occhi. Domenica affrontiamo i Corsari di Punta Nera. Sono duri, spietati e non concedono un centimetro.»`, "trattoria"),
        L("sara", `«Dobbiamo decidere come schierarti in campo, ${hero.name}. Con chi vuoi fare coppia d'intesa per guidare la squadra?»`, "trattoria")
      ], () => {
        eng.text("sara", `Scegli la tua intesa tattica per la partita:<br>Con chi affinerai gli schemi prima del fischio d'inizio?`);
        eng.buttons([
          {
            label: "🤝 Con Leo Moretti: Asse Offensivo Spettacolo",
            sub: "Doppio fantasista: scambi veloci e tiri a raffica",
            cls: "hot",
            fn: () => {
              prog.partner = "leo";
              prog.chap = 3;
              saveProgress(prog);
              eng.play([
                L("leo", `«Perfetto! Ci scambieremo la posizione senza dare punti di riferimento alla loro difesa. Quando vedi che scatto, tu buttala nello spazio!»`, "trattoria"),
                L("hero", `«Affare fatto, Leo. Nessuno potrà fermarci insieme.»`, "trattoria")
              ], () => {
                if (window.toast) window.toast("Intesa con Leo sbloccata! Cap. 3 Pronto", "success", "🔥");
                window.openHeroStoryMenu(returnCallback);
              });
            }
          },
          {
            label: "🛡️ Con Nico Ferri: Baluardo e Ripartenza",
            sub: "Nico para e rilancia dritto sui tuoi scatti in contropiede",
            fn: () => {
              prog.partner = "nico";
              prog.chap = 3;
              saveProgress(prog);
              eng.play([
                L("nico", `«Grande! Io prendo la mira con le mani e te la spedisco oltre la metà campo. Tu fai cantare quel ${hero.shotName}!»`, "trattoria"),
                L("hero", `«Tu chiudi la porta, Nico. Al resto penso io davanti.»`, "trattoria")
              ], () => {
                if (window.toast) window.toast("Intesa con Nico sbloccata! Cap. 3 Pronto", "success", "🧤");
                window.openHeroStoryMenu(returnCallback);
              });
            }
          }
        ], true);
      });
    }

    // --- CAPITOLO 3: IL DERBY DELLA SCOGLIERA ---
    else if (chId === 3) {
      eng.chap("Cap. 3 · Il Derby della Scogliera");
      eng.play([
        L("voce", `Domenica pomeriggio. Il campo di Punta Rondine è strapieno. C'è tutta la gente del Borgo con bandiere e sciarpe. Gli avversari, i Corsari di Punta Nera, scendono in campo con maglie nere e sguardi d'acciaio.`, "stadium"),
        L("ruggeri", `«Ragazzi, in campo senza paura! ${hero.name}, tocca a te: fai vedere cosa significa indossare il numero ${hero.num}!»`, "stadium"),
        L("voce", `Fischio d'inizio! La partita è una battaglia di fango e tackle duri. All'85° minuto il punteggio è fermo sull'1-1. All'improvviso, un rinvio lungo arriva sui tuoi piedi all'altezza del cerchio di centrocampo!`, "stadium"),
        L("hero", `(palla incollata allo scarpino) «Mancano cinque minuti... È il momento di decidere la partita!»`, "stadium")
      ], () => {
        eng.text("hero", `Sei braccato da due difensori di Punta Nera. Hai la palla sul piede forte e la porta dista 25 metri. Cosa fai?`);
        eng.buttons([
          {
            label: `💥 Scatena il ${hero.shotName || "Tiro del Campione"} dritto nel sette!`,
            sub: "Tiro a sorpresa dalla lunghissima distanza",
            cls: "hot",
            fn: () => {
              try {
                if (window.triggerGoalCelebration) window.triggerGoalCelebration(true);
                if (window.sfx) window.sfx("goal");
              } catch (e) {}
              eng.play([
                L("voce", `Finta di corpo per mandare a vuoto il primo marcatore, carichi il destro e scagli una saetta implacabile! Il pallone piega le dita del portiere e fa esplodere la rete! GOOOOL!`, "stadium"),
                L("leo", `«GOOOL! Mamma mia, ${hero.name}! Hai tirato da casa tua! Che capolavoro!»`, "stadium"),
                L("voce", `La tribuna del Borgo esplode in un boato liberatorio! La Rondine FC vince il derby 2-1 grazie al tuo gol da antologia!`, "stadium")
              ], () => {
                prog.chap = 4;
                prog.goals += 1;
                saveProgress(prog);
                if (window.toast) window.toast("Derby Vinto! Cap. 4 Finale Sbloccato", "success", "⭐");
                window.openHeroStoryMenu(returnCallback);
              });
            }
          },
          {
            label: "👟 Assist filtrante millimetrico per Leo Moretti",
            sub: "Taglio perfetto di Leo che batte il portiere in uscita",
            fn: () => {
              try {
                if (window.triggerGoalCelebration) window.triggerGoalCelebration(false);
                if (window.sfx) window.sfx("goal");
              } catch (e) {}
              eng.play([
                L("voce", `Con la coda dell'occhio vedi lo scatto di Leo. Con un colpo d'esterno pennelli un pallone al bacio sopra la difesa. Leo al volo non perdona: 2-1 per la Rondine!`, "stadium"),
                L("leo", `(ti abbraccia sollevandoti di peso) «Assist perfetto, ${hero.name}! Sei un fenomeno!»`, "stadium"),
                L("ruggeri", `«Questo è vero calcio di squadra. Ora dritti verso la finale della Lanterna d'Oro!»`, "stadium")
              ], () => {
                prog.chap = 4;
                saveProgress(prog);
                if (window.toast) window.toast("Vittoria di Squadra! Cap. 4 Sbloccato", "success", "⭐");
                window.openHeroStoryMenu(returnCallback);
              });
            }
          }
        ], true);
      });
    }

    // --- CAPITOLO 4: LA NOTTE DELLA LANTERNA D'ORO (FINALE) ---
    else if (chId === 4) {
      eng.chap("Cap. 4 · La Notte della Lanterna d'Oro");
      eng.play([
        L("voce", `La notte della grande finale. I fari illuminano il rettangolo verde che sembra brillare contro il mare scuro. In palio c'è la Lanterna d'Oro, il trofeo più antico di tutta la costa ligure.`, "night"),
        L("voce", `La partita contro la corazzata di Genova è al cardiopalma. Minuto 93, 2-2. Calcio di punizione dal limite per la Rondine FC.`, "night"),
        L("leo", `(porgendoti il pallone con entrambe le mani) «Prendila tu, ${hero.name}. Ti sei guadagnato questo momento dal primo giorno che hai messo piede al molo. Questa coppa deve tornare a Borgo Marino.»`, "night"),
        L("hero", `«Grazie Leo. La mettiamo dove nessuno può prenderla.»`, "night"),
        L("nico", `(gridando da dentro la nostra porta) «DAI ${hero.name.toUpperCase()}! FAMMI CANTARE! FACCI CANTARE TUTTI!»`, "night")
      ], () => {
        eng.text("hero", `Il silenzio scende su tutto il campo. Solo il vento di mare e il battito del tuo cuore. Come calci la punizione decisiva?`);
        eng.buttons([
          {
            label: `⚡ Il ${hero.shotName || "Tiro Supremo"} a giro sopra la barriera!`,
            sub: "Traiettoria a elica imparabile sotto la traversa",
            cls: "hot",
            fn: () => {
              try {
                if (window.triggerTrophyCelebration) window.triggerTrophyCelebration();
                else if (window.triggerGoalCelebration) window.triggerGoalCelebration(true);
                if (window.sfx) window.sfx("goal");
              } catch (e) {}

              eng.play([
                L("voce", `Parte la rincorsa... Un impatto purissimo! Il pallone scavalca la barriera con una curva incredibile, scheggia l'interno del palo ed entra in rete! GOOOOOOOL!`, "stadium"),
                L("voce", `IL FISCHIO FINALE! LA RONDINE FC È CAMPIONE DELLA LANTERNA D'ORO!`, "stadium"),
                L("hero", `(alzando le braccia al cielo mentre tutta la squadra ti sommerge d'affetto) «ABBIAMO VINTO! LA COPPA È NOSTRA!»`, "stadium"),
                L("papa", `(con gli occhi lucidi e la sciarpa alzata) «Campione... Sei entrato nella storia di questo paese! Il tuo nome sarà inciso per sempre sulla Lanterna!»`, "stadium")
              ], () => {
                prog.won = true;
                prog.chap = 5;
                prog.goals += 1;
                saveProgress(prog);

                // Ricompense di gioco
                try {
                  if (window.addCoins) window.addCoins(50);
                  const gdata = JSON.parse(localStorage.getItem("ali-di-rondine.gacha-toys") || "{}");
                  if (!gdata.owned) gdata.owned = {};
                  gdata.owned["hero_custom_gold"] = (gdata.owned["hero_custom_gold"] || 0) + 1;
                  localStorage.setItem("ali-di-rondine.gacha-toys", JSON.stringify(gdata));
                } catch (e) {}

                showEpilogue(hero, prog);
              });
            }
          }
        ], true);
      });
    }
  }

  // --- EPILOGO & PREMIAZIONE ---
  function showEpilogue(hero, prog) {
    const eng = getEngine();
    const L = eng.L;

    eng.chap("Epilogo · Gloria Eterna al Borgo");
    eng.play([
      L("voce", `La mattina dopo, l'Edicola della Signora Pina espone la prima pagina storica de L'Eco del Tirreno: «LA RONDINE VOLA IN ALTO! ${hero.name.toUpperCase()} N.${hero.num} INCANTA IL GOLFO!»`, "borgo"),
      L("pina", `«Tutti vogliono il giornale di oggi! Ho dovuto nascondere una copia per me sotto la cassa prima che finissero tutte!»`, "borgo"),
      L("rita", `«E alla Trattoria Moretti da oggi nel menu ci sono le "Trofie alla ${hero.name}": con doppio basilico e pinoli tostati per i campioni!»`, "trattoria"),
      L("ruggeri", `«Hai onorato quella maglia come pochi altri prima di te, ${hero.name}. Il Borgo Marino non dimenticherà mai questa notte.»`, "beach")
    ], () => {
      eng.text("hero", `<b>🏆 SAGA COMPLETATA CON SUCCESSO!</b><br><br>
        Hai guidato la Rondine FC alla vittoria con <b>${hero.name}</b> (N. ${hero.num})!<br>
        • Gol segnati dal tuo campione: <b>${prog.goals}</b><br>
        • Tiro leggendario consacrato: <b>${hero.shotName || "Tiro Fulminante"}</b><br>
        • Sbloccata la statuina 3D esclusiva 6★: <b>«${hero.name} d'Oro»</b> nella Vetrinetta dei Giocattoli!<br>
        • Ricompensa riscossa: <b>🪙 +50 Monete del Borgo</b> per il Gashapon e il negozio!`);

      eng.buttons([
        {
          label: "🎰 Festeggia al Distributore Gashapon 3D",
          sub: "Usa le 50 monete vinte per pescare nuovi pupazzetti",
          cls: "hot",
          fn: () => {
            if (window.openGachaModal) window.openGachaModal();
          }
        },
        {
          label: "⭐ Rigioca o rigioca i capitoli",
          sub: "Rivivi i momenti salienti della saga del tuo campione",
          fn: () => window.openHeroStoryMenu(returnCallback)
        },
        {
          label: "◂ Torna al Menu Principale",
          fn: () => {
            if (returnCallback) returnCallback();
            else if (eng.title) eng.title();
          }
        }
      ], true);
    });
  }

  console.log("✓ Saga del Campione caricata con successo");
})();
