// js/moviola-c4.js - «L'Ombra della Moviola · Tele-Rondine '84»
// Capitolo 4: «Fermo Immagine sul Fato: La notte della verità al Teatro Comunale»
(function () {
  "use strict";

  function boot() {
    const E = window.__moviolaCore;
    if (!E || !E.api || !E.api.addChapter) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }

  function chapter4(K) {
    const H = window.__moviolaH, { setStep, quest, F } = K;
    const N = 4, S = () => K.stepOf(N);
    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    H.cast(K);
    K.cos("mov_c4", { kind: "shirt", label: "Smoking da Gran Galà del Cinema", val: "#0f172a", from: "Capitolo 4 di L'Ombra della Moviola" });

    const goal = (s) => ({
      0: "Parla con Carmela De Rosa davanti al Teatro Comunale.",
      1: "Accedi alla Cabina di Proiezione attraverso la botola dei carboni.",
      2: "Sincronizza le ottiche con Walter Zoom prima dell'inizio del discorso.",
      3: "Prepara la proiezione sullo schermo gigante della sala.",
      4: "Scegli il destino dell'inchiesta e visualizza l'epilogo finale."
    }[s] || "L'inchiesta è conclusa. La verità è stata proiettata.");

    function fin(endingKey) {
      F.set("mov_c4_done", true);
      K.reward("mov_c4", { coins: 120, cos: "mov_c4" });
      K.finishChapter(N, endingKey);
      
      const epiloghi = {
        scoop: [
          ["voce", "<b>FINALE 1: LO SCOOP DA CENTO MILIONI</b>"],
          ["voce", "Il nastro del 94° minuto viene trasmesso dal network nazionale a reti unificate."],
          ["mov_daria", "[trionfante] Share al 78%! Abbiamo battuto tutti i record storici della televisione italiana!"],
          ["mov_walter", "[pensa] Il rigore è stato cancellato, ma il calcio da salotto ha inghiottito tutto. Siamo famosi, ma a quale prezzo?"]
        ],
        patto: [
          ["voce", "<b>FINALE 2: IL PATTO DI MEZZANOTTE</b>"],
          ["voce", "Tele-Rondine evita il fallimento e Maspero salda le cambiali arretrate."],
          ["mov_valeri", "[sorridente] Gli affari sono affari. Il calcio cittadino continua a vivere sotto il mio cappello."],
          ["mov_walter", "[triste] La bobina master dorme in cassaforte. Nessuno saprà mai cosa accadde davvero su quel dischetto."]
        ],
        giustizia: [
          ["voce", "<b>FINALE 3: IL PROCESSO DEL LUNEDÌ</b>"],
          ["voce", "Il fermo immagine proiettato sul grande schermo del teatro gela la platea. La polizia arresta Valeri tra gli applausi dei tifosi."],
          ["mov_daria", "[commossa] La giustizia sportiva ha fatto il suo corso. La famiglia di Banti è al sicuro in Svizzera."],
          ["mov_walter", "[fiero] Quarant'anni dietro a una Zeiss per questo momento. Il calcio torna alla sua gente, pulito e libero."]
        ],
        segreto: [
          ["voce", "<b>FINALE SEGRETO: NASTRO ZERO (1964)</b>"],
          ["voce", "Sullo schermo scorre anche la bobina del 1964: la verità storica scuote la città dalle fondamenta."],
          ["mov_walter", "[con gli occhi lucidi] Anche i nostri padri avevano sbagliato... ma oggi, finalmente, abbiamo avuto il coraggio di perdonarci."],
          ["voce", "La catarsi è completa. Dalle ceneri della moviola nasce una nuova era per Rondine."]
        ]
      };

      const scena = epiloghi[endingKey] || epiloghi.giustizia;
      K.scene(scena, () => K.openMain(), "mov_titolo");
    }

    const talk = {
      mov_carmela() {
        if (K.rel.scene("mov_carmela")) return;
        const s = S();
        if (s === 0) {
          say("mov_carmela", "[fiera] Ho staccato le spine del centralino dei vigili per dieci minuti. Avete la strada libera fino alla botola dei carboni.");
          say("mov_carmela", "Walter è già salito nella Cabina di Proiezione 35mm con la bobina sotto il cappotto. Salite da quella porta sul retro, presto!");
          setStep(N, 1);
          quest("mov_c4_cabina", "La Cabina di Proiezione", "Entra nella cabina di proiezione e raggiungi Walter Zoom.");
          return done();
        }
        say("mov_carmela", "Fate valere il nome di Tele-Rondine! Tutta la città vi guarda!");
        done();
      },

      mov_walter() {
        if (K.rel.scene("mov_walter")) return;
        const s = S();
        if (s === 1 || s === 2) {
          say("mov_walter", "[commosso] Quarant'anni dietro a queste lenti per arrivare a questo momento.");
          say("mov_walter", "La lampada a carboni del Victoria 5 è accesa. Ho giuntato il master Cam 2 al posto del filmato promozionale dello sponsor.");
          say("mov_walter", "E guarda cosa ho trovato nel cassetto blindato della cabina: il leggendario «Nastro Zero del 1964»! La prima combine orchestrata dai fondatori vent'anni fa!");
          K.dossier.add("tele_rondine", "nastro_zero_1964");
          K.bond("chiarezza", 20);
          setStep(N, 3);
          quest("mov_c4_proiezione", "L'Ora della Verità", "Guarda nella feritoia della sala: il commendator Valeri sta prendendo la parola.");
          return ask("Sei pronto a dare luce ai carboni durante il discorso di Valeri?", [
            {
              label: "Accendi la lampada del proiettore",
              sub: "Proietta l'inchiesta sullo schermo gigante",
              big: true, cls: "hot",
              fn: () => {
                setStep(N, 4);
                quest("mov_c4_epilogo", "Il Giudizio", "Decidi quale verità proiettare per la conclusione.");
                say("voce", "Il fascio di luce squarcia l'oscurità del teatro! Sullo schermo gigante appare l'arbitro Banti e la busta di Valeri al 100% di risoluzione!");
                say("mov_valeri", "[dalla platea] SPEGNETE QUELL'APPARECCHIO! SPEGNETELO SUBITO!");
                done();
              }
            }
          ]);
        }
        if (s === 4) {
          say("mov_walter", "Mancano 30 secondi di pellicola. La scelta finale spetta a te.");
          return ask("Quale finale proiettare sul grande schermo del Teatro?", [
            {
              label: "Opzione A: Condanna Totale (Finale Giustizia)",
              sub: "Mostra solo i colpevoli attuali salvando la storia del club",
              big: true, cls: "hot",
              fn: () => fin("giustizia")
            },
            {
              label: "Opzione B: Nastro Zero 1964 (Finale Segreto)",
              sub: "Mostra anche la combine storica del 1964 per una purificazione assoluta",
              big: true, cls: "hot",
              fn: () => fin("segreto")
            },
            {
              label: "Opzione C: Lo Scoop Commerciale (Finale 1)",
              sub: "Cedi i diritti d'esclusiva al network nazionale per il record di share",
              fn: () => fin("scoop")
            },
            {
              label: "Opzione D: Il Patto Economico (Finale 2)",
              sub: "Chiudi la proiezione e accetta il finanziamento di Valeri",
              fn: () => fin("patto")
            }
          ]);
        }
        say("mov_walter", "La pellicola gira! La verità non si ferma più!");
        done();
      }
    };

    const zones = {
      mov_foyer: {
        region: "teatro",
        name: "Corso Vittorio e Foyer Teatro Comunale",
        short: "Foyer",
        sub: "Colonne neoclassiche, tappeto rosso bagnato e auto blu ministeriali",
        bg: "mov_foyer",
        time: "notte",
        w: 32, h: 22, base: "+", start: [4, 15],
        itemCos: "mov_c4",
        items: [[3, 6], [28, 16], [15, 18]],
        areas: [[0, 0, 31, 21, "La facciata monumentale del Teatro Comunale gremita di folla"]],
        npcs: () => [
          { id: "mov_carmela", at: [8, 14] }
        ],
        doors: {
          "16,6": { to: "mov_proiezione", at: [4, 12] },
          "26,14": { to: "mov_camerino", at: [4, 12] }
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 6, "a");
          lay(0, 7, 31, 21, "+");
          // Portone cabina proiezione (botola)
          put(16, 6, "q");
          // Ingresso camerini
          lay(24, 12, 28, 15, "y");
          put(26, 14, "q");
        },
        intro: [
          ["voce", "Fari cinematografici illuminano la facciata del Teatro Comunale. È la sera del Gran Galà dello Sport."]
        ]
      },

      mov_proiezione: {
        region: "teatro",
        interior: true,
        name: "Cabina di Proiezione 35mm",
        short: "Proiezione",
        sub: "Due monumentali proiettori Victoria 5, bobine metalliche e lampade a carboni",
        bg: "mov_proiezione",
        time: "notte",
        w: 24, h: 18, base: "=", start: [4, 12],
        npcs: () => [
          { id: "mov_walter", at: [12, 8] }
        ],
        exits: { "4,14": { to: "mov_foyer", at: [16, 8] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 1, "a");
          lay(0, 0, 0, 17, "a");
          lay(23, 0, 23, 17, "a");
          lay(0, 17, 23, 17, "a");
          lay(1, 2, 22, 16, "=");
          put(4, 15, "v");
          // Proiettori Victoria 5
          lay(10, 6, 14, 9, "r");
          put(12, 7, "Z");
        }
      },

      mov_camerino: {
        region: "teatro",
        interior: true,
        name: "Camerino VIP nel Sottopalco",
        short: "Camerino",
        sub: "Specchio con lampadine tonde, velluto bordeaux e il fischietto d'oro",
        bg: "mov_camerino",
        time: "notte",
        w: 20, h: 16, base: "=", start: [4, 12],
        npcs: [],
        exits: { "4,13": { to: "mov_foyer", at: [26, 15] } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a");
          lay(0, 0, 0, 15, "a");
          lay(19, 0, 19, 15, "a");
          lay(0, 15, 19, 15, "a");
          lay(1, 2, 18, 14, "=");
          put(4, 14, "v");
          // Tavolo da trucco e specchio
          lay(8, 6, 14, 7, "T");
          put(11, 5, "Z");
        }
      }
    };

    return {
      n: N,
      title: "Fermo Immagine sul Fato",
      sub: "La notte della verità al Teatro Comunale",
      goal,
      intro: () => [
        ["voce", "Il Gran Galà del Teatro Comunale: l'inchiesta di Tele-Rondine arriva al suo verdetto finale."]
      ],
      start: "mov_foyer",
      zones,
      talk
    };
  }

  boot();
})();
