// js/alcatraz-c4.js - «FUGA DA ALCATRAZ FC» · Capitolo ponte: La Scatola d'Isola (con Operazione Scatola Vuota)
// Dopo la finale sul molo: Ottone approda a fari spenti con la mitica scatola di cartone e una frequenza radio di Vulpe.
// Nel Braccio Ovest è rinchiuso Dario «l'Airone», ex capitano leggendario degli Aironi.
// Infiltrazione, scasso delle celle speciali, la grande Partita dell'Evasione a Calcio a Parete per mandare in tilt i riflettori,
// e la fuga sul barchino verso Capo Silenzio. Finale bonus: «L'Airone d'Oltremare».
(function () {
  "use strict";

  function boot() {
    const D = window.__alcatraz;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter4);
  }

  function chapter4(K) {
    const { say, done, setStep, finishChapter, quest } = K;
    const ask = (prompt, opts) => K.ask("voce", prompt, opts), questDone = (id) => K.questDone(id);
    const N = 4, S = () => K.stepOf(N);

    // Cast degli ospiti e personaggi ponte
    K.cast("vs_ottone", {
      name: "Ottone",
      sub: "Maestro del travestimento",
      style: "bald",
      hair: "#bbb",
      beard: "baffi",
      acc: ["cappellino"],
      shirt: "#92400e",
      skin: "#d9a679",
      bg: ["#78350f", "#fde68a"]
    }, "Predica la scatola di cartone come altri predicano un santo. Ha attraversato la baia a fari spenti pur di ritrovare il vecchio compagno degli Aironi.");

    K.cast("vs_vulpe", {
      name: "Vulpe",
      sub: "Operatrice radio",
      style: "bob",
      hair: "#c2410c",
      acc: ["cuffie"],
      shirt: "#0f766e",
      skin: "#e8c4a0",
      bg: ["#134e4a", "#99f6e4"]
    }, "La voce nella cuffia: ironica, precisa e sempre un passo avanti. Calcola i coni d'ombra delle torrette al millesimo di secondo.");

    K.cast("alc_dario", {
      name: "Dario l'Airone",
      sub: "Ex capitano degli Aironi",
      style: "long",
      hair: "#cbd5e1",
      beard: "pizzetto",
      acc: ["bandana"],
      shirt: "#0284c7",
      skin: "#c68642",
      bg: ["#0284c7", "#0f172a"]
    }, "Capitano storico degli Aironi. Custode della verità sulla finale censurata, rinchiuso ad Alcatraz per non aver voluto cedere il Rapporto.");

    K.cos("alc_c4", {
      kind: "shirt",
      label: "Maglia Aironi d'Alcatraz",
      val: "#0284c7",
      from: "Capitolo ponte di Fuga da Alcatraz FC"
    });

    K.lore("l_airone_ponte", {
      t: "L'Airone d'Oltremare",
      d: "L'alleanza tra la Scatola di Cartone di Ottone e le sponde elastiche di Alcatraz: il calcio libero supera ogni muraglia."
    });

    const goal = (s) => ({
      0: "Un barchino misterioso è attraccato al molo nella nebbia. Parla con Ottone tra le bitte.",
      1: "Raggiungi il cortile e poi il corridoio delle celle per liberare Dario l'Airone dalla cella d'isolamento.",
      2: "Sirene attivate! Parla con il Direttore Cardenas nel cortile e vinci la Partita dell'Evasione a Calcio a Parete!",
      3: "I riflettori sono in tilt! Torna al molo nord per decidere la rotta della libertà con Ottone e Dario."
    }[s] || "Il capitolo ponte è concluso!");

    const zones = {
      alc_molo: {
        region: "carcere",
        name: "Molo d'Attracco e Scogliera Nord",
        short: "Molo d'Attracco",
        sub: "Onde schiumose, bitte d'ormeggio e il barchino di Ottone nella nebbia",
        bg: "alc_molo",
        time: "notte",
        travel: [5, 8],
        w: 28,
        h: 18,
        start: [5, 8],
        items: [[4, 6], [22, 6], [12, 11]],
        areas: [
          [2, 2, 25, 13, "La banchina d'attracco della fortezza di Alcatraz"]
        ],
        flavor: {
          F: "I riflettori che scandagliano la nebbia marina a intervalli regolari.",
          G: "Una botola metallica con il simbolo della vecchia ditta di conserve ittiche.",
          P: "La sagoma scura del peschereccio 'Il Guscio' ormeggiato a fari spenti."
        },
        intro: [
          ["voce", "La nebbia marina è così densa da tagliare il respiro. Il profilo di Alcatraz sembra un colosso addormentato."],
          ["voce", "Tra le bitte della banchina, un piccolo peschereccio a fari spenti oscilla piano sulle onde."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "vs_ottone", at: [8, 10] }, { id: "vs_vulpe", at: [12, 10] }] : []),
          ...(s === 1 || s === 2 ? [{ id: "vs_ottone", at: [8, 10] }] : []),
          ...(s >= 3 ? [{ id: "vs_ottone", at: [8, 10] }, { id: "alc_dario", at: [12, 10] }, { id: "alc_bruno", at: [16, 10] }, { id: "alc_cardenas", at: [20, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 27, 1, "W");
          lay(0, 16, 27, 17, "W");
          lay(0, 0, 1, 17, "W");
          lay(26, 0, 27, 17, "W");

          lay(2, 2, 25, 13, ".");
          lay(2, 14, 25, 15, "~");

          put(6, 13, "B");
          put(12, 13, "B");
          put(18, 13, "B");
          put(24, 3, "F");

          house(2, 2, 4, 3, {
            door: [4, 4],
            enter: { to: "alc_cortile4", at: [26, 15] }
          });
        }
      },

      alc_cortile4: {
        region: "carcere",
        name: "Cortile del Blocco Ovest",
        short: "Cortile Ovest",
        sub: "Asfalto bagnato, fari di ronda e sponde metalliche in tensione",
        bg: "alc_cortile",
        time: "notte",
        travel: [26, 15],
        w: 32,
        h: 22,
        start: [26, 15],
        items: [[5, 5], [26, 5], [5, 17]],
        areas: [
          [2, 2, 29, 19, "Il cortile centrale di massima sicurezza"]
        ],
        flavor: {
          R: "Le sponde di lamiera d'acciaio con i segni delle carambole a effetto.",
          F: "I fari della torretta ovest puntati sul cerchio di centrocampo.",
          G: "La grata d'aerazione centrale che vibra per il vapore delle caldaie."
        },
        intro: [
          ["voce", "L'aria del cortile è elettrica: le torrette hanno aumentato la frequenza delle ronde."],
          ["voce", "Sulle paratie di metallo riecheggia il rimbalzo sordo di un pallone da allenamento."]
        ],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "alc_bruno", at: [18, 12] }, { id: "alc_tonelli", at: [14, 8] }] : []),
          ...(s === 2 ? [{ id: "alc_cardenas", at: [20, 10] }, { id: "alc_dario", at: [16, 10] }, { id: "alc_bruno", at: [12, 10] }] : []),
          ...(s >= 3 ? [{ id: "alc_tonelli", at: [14, 8] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 2, "W");
          lay(0, 19, 31, 21, "W");
          lay(0, 0, 2, 21, "W");
          lay(29, 0, 31, 21, "W");

          lay(3, 3, 28, 18, ".");

          lay(7, 5, 24, 5, "R");
          lay(7, 15, 24, 15, "R");
          lay(7, 6, 7, 8, "R");
          lay(7, 12, 7, 14, "R");
          lay(24, 6, 24, 8, "R");
          lay(24, 12, 24, 14, "R");

          put(7, 9, ".");
          put(7, 10, ".");
          put(7, 11, ".");
          put(24, 9, ".");
          put(24, 10, ".");
          put(24, 11, ".");

          put(4, 3, "F");
          put(27, 3, "F");
          put(4, 18, "F");
          put(27, 18, "F");
          put(16, 10, "G");

          house(24, 16, 5, 3, {
            door: [26, 16],
            enter: { to: "alc_molo", at: [5, 8] }
          });

          house(6, 2, 4, 3, {
            door: [8, 4],
            enter: { to: "alc_celle4", at: [6, 10] }
          });
        }
      },

      alc_celle4: {
        region: "carcere",
        name: "Braccio Ovest e Celle Speciali",
        short: "Celle Speciali",
        sub: "Corridoio umido, sbarre d'acciaio e la cella segreta dell'Airone",
        bg: "alc_celle",
        time: "notte",
        travel: [6, 10],
        w: 24,
        h: 16,
        start: [6, 10],
        items: [[3, 6], [18, 6]],
        areas: [
          [2, 2, 21, 13, "Il corridoio di massima sicurezza del Braccio Ovest"]
        ],
        flavor: {
          R: "Le sbarre corazzate della cella n. 9.",
          P: "Una porta tagliafuoco rinforzata con serratura a combinazione.",
          G: "La griglia dell'aria da cui si sente il rumore del mare aperto."
        },
        intro: [
          ["voce", "Nel silenzio del braccio sotterraneo si avverte il respiro pesante dei detenuti in isolamento."],
          ["voce", "Dalla cella in fondo proviene il suono ritmico di un tacco che rimbalza una pallina di carta."]
        ],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "alc_sam", at: [12, 8] }, { id: "alc_dario", at: [18, 4] }] : []),
          ...(s >= 2 ? [{ id: "alc_sam", at: [12, 8] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 23, 1, "W");
          lay(0, 14, 23, 15, "W");
          lay(0, 0, 1, 15, "W");
          lay(22, 0, 23, 15, "W");

          lay(2, 4, 21, 12, ".");

          lay(2, 2, 21, 3, "R");
          put(6, 3, ".");
          put(12, 3, ".");
          put(18, 3, ".");

          house(2, 11, 4, 3, {
            door: [4, 11],
            enter: { to: "alc_cortile4", at: [8, 5] }
          });
        }
      }
    };

    const talk = {
      vs_ottone: (K) => {
        const s = S();
        if (s === 0) {
          say([
            ["vs_ottone", "(sussurra da sotto una scatola) Pssss! Campione della Rondine! Giù la testa, qui i fari girano ogni venti secondi!"],
            ["hero", "Ottone?! Che ci fai ad Alcatraz dentro una scatola di cartone ondulato?!"],
            ["vs_ottone", "[furbo] La Scatola d'Isola non tradisce mai! Vulpe ha intercettato un cablogramma cifrato della Fondazione."],
            ["vs_vulpe", "(dalla radio) Campione, mi ricevi? Dario 'l'Airone', il nostro storico compagno degli Aironi, non è mai scappato all'estero: è rinchiuso al Braccio Ovest di Alcatraz!"],
            ["vs_ottone", "Il Direttore Cardenas lo tiene isolato perché Dario possiede la copia originale del Rapporto sulla finale truccata."],
            ["vs_ottone", "Abbiamo venti minuti prima del cambio della guardia. Entra dal cortile, trova Dario nelle celle e portalo al molo. Ti do una scatola mimetica e due grimaldelli rinforzati!"]
          ], () => {
            K.bond("chiavi", 2);
            setStep(N, 1);
            quest("alc_q_ponte1", "Infiltrati nel Braccio Ovest", "Passa dal cortile per raggiungere le celle di sicurezza e parla con Dario l'Airone.");
            done();
          });
        } else if (s === 1 || s === 2) {
          say([
            ["vs_ottone", "Fai presto, ragazzo! Il motore del peschereccio è al minimo e le onde stanno crescendo. Porta Dario qui!"]
          ], done);
        } else if (s >= 3) {
          ask("La barca è pronta a mollare gli ormeggi nella nebbia. Cosa decidi?", [
            {
              label: "🚤 Salta sulla barca con Ottone e Dario: rotta verso Capo Silenzio!",
              big: true,
              fn: () => {
                say([
                  ["hero", "Saltiamo a bordo! La verità sugli Aironi deve tornare a respirare l'aria libera!"],
                  ["vs_ottone", "[felice] Motori a tutta forza! Addio Alcatraz, la scatola ha vinto ancora!"],
                  ["alc_dario", "[felice] Dodici anni di silenzio... e ora il mare aperto davanti a noi. Grazie di cuore, Campione!"],
                  ["voce", "Il peschereccio taglia le onde scure della baia svanendo nella nebbia marina verso Capo Silenzio. Gli Aironi sono finalmente riuniti!"]
                ], () => {
                  K.end("scatola");
                  const msg = K.reward("alc_c4_ponte", { coins: 160, cos: "alc_c4" });
                  finishChapter(N, "scatola");
                  questDone("alc_q_ponte1");
                  K.scene([["voce", `<b>CAPITOLO PONTE CONCLUSO CON SUCCESSO!</b><br>${msg.join(" · ")}<br>Hai sbloccato il finale leggendario «L'Airone d'Oltremare».`]], () => K.openMain(), "alc_molo");
                });
              }
            },
            {
              label: "📜 Firma l'armistizio con Cardenas per la grazia leale di Dario",
              big: true,
              fn: () => {
                say([
                  ["hero", "Direttore Cardenas, abbiamo vinto la partita lealmente sul campo. Pretendo che Dario torni un uomo libero secondo la legge."],
                  ["alc_cardenas", "[serio] Una parola data su un campo di calcio a parete vale più di qualsiasi scartoffia. Ecco il timbro di grazia immediata."],
                  ["alc_dario", "Uscire da quel portone a testa alta... è il giorno più bello della mia vita."],
                  ["voce", "Dario lascia l'isola con un salvacondotto ufficiale, libero e senza ombre!"]
                ], () => {
                  K.end("patto");
                  const msg = K.reward("alc_c4_patto", { coins: 120, cos: "alc_c4" });
                  finishChapter(N, "patto");
                  questDone("alc_q_ponte1");
                  K.scene([["voce", `<b>CAPITOLO PONTE CONCLUSO.</b><br>${msg.join(" · ")}<br>Hai ottenuto la grazia ufficiale per Dario.`]], () => K.openMain(), "alc_molo");
                });
              }
            },
            {
              label: "💈 Fai salpare Dario e Ottone, ma resta con Bruno ad Alcatraz",
              big: true,
              fn: () => {
                say([
                  ["hero", "Voi andate a Capo Silenzio e diffondete la verità. Io resto qui con Bruno: la bottega ha bisogno di un vero regista."],
                  ["alc_bruno", "[ride] Questa sì che è una scelta da fuoriclasse! Io preparo i rasoi e tu alleni le nuove leve del penitenziario!"],
                  ["vs_ottone", "Non ti dimenticheremo, Campione. Una scatola con la Rondine viaggerà sempre con noi."],
                  ["voce", "Il peschereccio prende il largo, mentre il Campione sorride sulle banchine della Roccia tra i suoi compagni di squadra."]
                ], () => {
                  K.end("barbiere");
                  const msg = K.reward("alc_c4_barbiere", { coins: 120, cos: "alc_c4" });
                  finishChapter(N, "barbiere");
                  questDone("alc_q_ponte1");
                  K.scene([["voce", `<b>CAPITOLO PONTE CONCLUSO.</b><br>${msg.join(" · ")}<br>Sei rimasto il maestro indiscusso del cortile di Alcatraz.`]], () => K.openMain(), "alc_molo");
                });
              }
            }
          ]);
        }
      },

      vs_vulpe: (K) => {
        say([
          ["vs_vulpe", "I riflettori della torretta hanno una rotazione di 45 gradi ogni otto secondi. Muoviti rasente alle lamiere e non farti inquadrare!"]
        ], done);
      },

      alc_bruno: (K) => {
        const s = S();
        if (s <= 1) {
          say([
            ["alc_bruno", "Campione! C'è tensione nel braccio: Tonelli ha sprangato la cella 9 in fondo al corridoio."],
            ["alc_bruno", "Ho sentito che il prigioniero dentro non parla con nessuno da dieci anni. Prendi questo grimaldello da barba che tenevo nell'intercapedine e vai a vedere prima del giro d'ispezione!"]
          ], () => {
            K.bond("chiavi", 1);
            done();
          });
        } else if (s === 2) {
          say([
            ["alc_bruno", "Il Direttore ha chiamato i migliori difensori della prigione! Dobbiamo giocare la partita della vita sulle sponde!"]
          ], done);
        } else {
          say([
            ["alc_bruno", "Che partita memorabile! Abbiamo fatto rimbalzare quel pallone come un fulmine!"]
          ], done);
        }
      },

      alc_sam: (K) => {
        say([
          ["alc_sam", "I cardini della cella 9 sono duri come macigni, ma con la leva giusta e un grimaldello scattano subito!"]
        ], done);
      },

      alc_tonelli: (K) => {
        const s = S();
        if (s <= 1) {
          say([
            ["alc_tonelli", "Circolare, detenuti! Il Direttore vuole che il campo sia sgombro per la perlustrazione straordinaria!"]
          ], done);
        } else {
          say([
            ["alc_tonelli", "Mamma mia che tiri... Ho ancora il fischietto che trema per i colpi sulle lamiere!"]
          ], done);
        }
      },

      alc_dario: (K) => {
        const s = S();
        if (s <= 1) {
          say([
            ["hero", "Dario? Sei tu Dario l'Airone?"],
            ["alc_dario", "(si volta meravigliato) Quella voce... e quel cartone da imballaggio... Non ci credo: ti manda Ottone?!"],
            ["hero", "Ottone e Vulpe sono al molo col peschereccio. È ora di evadere e far volare la verità!"],
            ["alc_dario", "[felice] Dodici anni in questa gabbia... senza mai piegarmi. Ho ancora con me gli appunti originali del Rapporto Zero!"],
            ["voce", "<i>*WHRRRRRRR!*</i> Un ululato lacerante squarcia il silenzio: le sirene d'emergenza di Alcatraz si accendono tutte insieme!"],
            ["alc_cardenas", "(dagli altoparlanti) Allarme rosso al Blocco Ovest! Tutti i cancelli marini sono sigillati!"]
          ], () => {
            K.allarme(25, "Sirene d'allarme attivate da Cardenas!");
            setStep(N, 2);
            quest("alc_q_ponte2", "La Partita dell'Evasione", "Raggiungi il cortile: Cardenas pretende una sfida a Calcio a Parete per togliere il blocco d'emergenza!");
            done();
          });
        } else if (s === 2) {
          say([
            ["alc_dario", "Campione, mettiamoci in campo! Io taglio sul primo palo e tu sfrutti i rimbalzi delle lamiere!"]
          ], done);
        } else {
          say([
            ["alc_dario", "Il profumo della salsedine... non lo sentivo da una vita intera. Grazie, Campione."]
          ], done);
        }
      },

      alc_cardenas: (K) => {
        const s = S();
        if (s === 2) {
          say([
            ["alc_cardenas", "Credevate davvero di portare via l'Airone sotto una scatola di cartone senza passare da me?"],
            ["hero", "Direttore Cardenas, Dario è innocente! È stato incastrato per coprire i veri colpevoli del campionato!"],
            ["alc_cardenas", "[serio] Qui dentro la legge sono io. Ma siamo uomini di sport: se volete che apra la paratia sottomarina del molo, dovete battere la mia Guardia d'Élite in una partita a Calcio a Parete!"],
            ["hero", "Accettiamo la sfida! Nessuna guardia può fermare la Rondine e l'Airone insieme!"]
          ], () => {
            ask("Sei pronto a giocare la Partita dell'Evasione nel cortile?", [
              {
                label: "⚽ Gioca la Partita dell'Evasione contro le Guardie!",
                big: true,
                fn: () => {
                  const M = window.__alcatrazMatch;
                  if (!M || !M.start) {
                    say([["voce", "La partita si conclude con un trionfo dei Galeotti sulle sponde!"]], () => {
                      setStep(N, 3);
                      quest("alc_q_ponte3", "Fuga verso la Scogliera", "I generatori sono spenti per venti minuti! Raggiungi il molo nord per l'evasione finale.");
                      done();
                    });
                    return;
                  }
                  M.start({
                    title: "La Partita dell'Evasione · contro Guardia d'Élite",
                    teamA: "Galeotti & Aironi",
                    opp: "Guardia d'Élite",
                    colA: "#0284c7",
                    colB: "#ef4444",
                    onDone: (res) => {
                      if (!res.win) {
                        say([
                          ["alc_cardenas", "Non siete ancora pronti per superare la mia difesa d'acciaio! Riorganizzatevi e riprovate."]
                        ], done);
                        return;
                      }
                      say([
                        ["hero", "Palla all'incrocio sul rimbalzo a 45 gradi! GOL!"],
                        ["alc_cardenas", "[sorpreso] Incredibile... una traiettoria da antologia del calcio!"],
                        ["voce", "<i>*BZZZZZT! CRASH!*</i> Il tabellone elettrico va in cortocircuito e le lampade dei riflettori esplodono in piogge di scintille!"],
                        ["alc_tonelli", "Direttore! I generatori sono andati in tilt! La banchina nord è completamente al buio per i prossimi venti minuti!"],
                        ["alc_cardenas", "[pensa] Sul campo avete vinto con pieno onore. Andate al molo... prima che i fari si riaccendano."]
                      ], () => {
                        setStep(N, 3);
                        quest("alc_q_ponte3", "Fuga verso la Scogliera", "I generatori sono spenti per venti minuti! Raggiungi il molo nord per l'evasione finale.");
                        done();
                      });
                    }
                  });
                }
              },
              {
                label: "↩️ Un momento per preparare la squadra",
                fn: () => { done(); }
              }
            ]);
          });
        } else if (s >= 3) {
          say([
            ["alc_cardenas", "La parola data su questo asfalto è legge. Salpate prima che i fari si riattivino."]
          ], done);
        } else {
          done();
        }
      }
    };

    return {
      n: N,
      title: "La Scatola d'Isola · Operazione Alcatraz",
      sub: "Capitolo ponte · con Operazione Scatola Vuota",
      goal,
      start: "alc_molo",
      introBg: "alc_molo",
      zones,
      talk,
      intro: () => [
        ["voce", "Qualche tempo dopo la leggendaria finale del torneo carcerario."],
        ["voce", "Una fitta coltre di nebbia avvolge le scogliere della fortezza di Alcatraz."],
        ["voce", "Tra le onde nere della baia, un vecchio barchino a motore spento scivola in silenzio verso la banchina nord..."]
      ]
    };
  }

  boot();
})();
