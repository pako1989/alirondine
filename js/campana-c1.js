// js/campana-c1.js - LA NOTTE DEI CENTO RINTOCCHI · Capitolo 1 «Il Mistero del Campanile Muto»
// La sparizione della Campana d'Oro dal campanile di Rocca Campanaria, l'allarme di Don Crispino,
// i pettegolezzi e il ristoro all'Osteria del Salame e Fiasco con Rosetta,
// e la prima sfida sul sagrato a «I Cento Rintocchi» contro i Carabinieri del Maresciallo Cacace.
(function () {
  "use strict";
  function boot() {
    const D = window.__campana;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("cp_crispino", { beard: "folta", acc: ["fischietto"], name: "Don Crispino", tag: "gold", hair: "#475569", style: "buzz", skin: "#f8d7b0", eye: "#2a1a0a", bg: ["#fef08a", "#ca8a04"], shirt: "#18181b" },
      "Il parroco vulcanico di Rocca Campanaria. Veste la tonaca nera, ha una voce tonante da predicatore e tira punizioni a parabola verso il cielo ringraziando la Provvidenza: «Un sacrilegio! Chi ha osato toccare il bronzo di San Fortunato?!».");

    K.cast("cp_cacace", { beard: "baffi", acc: ["berretto", "taccuino"], name: "Maresciallo Cacace", tag: "blue", hair: "#334155", style: "slick", skin: "#cbd5e1", eye: "#0f172a", bg: ["#1e3a8a", "#ca8a04"], shirt: "#1e3a8a" },
      "Comandante della stazione dei Carabinieri di Rocca Campanaria. Non si separa mai dal taccuino d'ordinanza e ha una teoria del complotto per ogni tombino del borgo: «Qui gatta ci cova, e se non cova, la diffido formalmente!».");

    K.cast("cp_rosetta", { acc: ["grembiule", "fiore"], name: "Rosetta l'Ostessa", tag: "", hair: "#b45309", style: "curly", skin: "#fed7aa", eye: "#15803d", bg: ["#fef9c3", "#991b1b"], shirt: "#991b1b" },
      "Proprietaria dell'Osteria del Salame e Fiasco. Conosce ogni pettegolezzo delle contrade, sforna pagnotte calde a getto continuo e ricarica i calciatori con fiaschi di Barbera e zabaione.");

    K.cast("cp_tito", { acc: ["berretto", "occhiali"], name: "Tito lo Smilzo", tag: "", hair: "#1c1917", style: "coppola", skin: "#f8d7b0", eye: "#451a03", bg: ["#ca8a04", "#713f12"], shirt: "#713f12" },
      "Mente strategica (o presunta tale) dei Soliti Ignoti di Rocca Campanaria. Magro come un chiodo, coppola calata sugli occhi e progetti audaci che si concludono sempre con buchi nel muro sbagliato.");

    K.cos("cp_c1", { kind: "shirt", label: "Maglia da sagrato in panno giallo oro", val: "#ca8a04", from: "Capitolo 1 de La Notte dei Cento Rintocchi" });
    K.lore("l_campana", { t: "La Campana d'Oro", d: "Fusa nel 1492 con l'oro offerto dai mastri campanari. Il suo rintocco a mezzanotte decreta il vincitore del Torneo delle Contrade." });
    K.lore("l_rintocchi", { t: "I Cento Rintocchi", d: "Sul sagrato lastricato di ciottoli il tempismo del rintocco stordisce il portiere e maschera il rumore dei contrasti." });

    const goal = (s) => ({
      0: "Sei arrivato in Piazza Grande. Parla con Don Crispino disperato davanti al campanile.",
      1: "Entra nell'Osteria del Salame e Fiasco e chiedi informazioni a Rosetta l'Ostessa.",
      2: "Sali nell'Antico Campanile e confrontati con Tito lo Smilzo vicino agli ingranaggi.",
      3: "Il Maresciallo Cacace ha circondato la piazza! Affronta i Carabinieri a I Cento Rintocchi!"
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      cp_piazza: {
        region: "piazza", name: "Piazza Grande", short: "Piazza Grande", sub: "Ciottoli medievali, campetto parrocchiale e il grande campanile", bg: "cp_piazza", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[2, 8], [29, 8], [14, 18]],
        areas: [[10, 8, 22, 14, "Il sagrato lastricato di fronte alla chiesa"], [0, 0, 31, 21, "Piazza Grande di Rocca Campanaria"]],
        flavor: {
          B: "La cella campanaria con le funi penzolanti nel vuoto.",
          K: "Il quadrante dell'orologio pubblico illuminato dai lampioni a gas.",
          A: "La solenne statua in pietra di San Fortunato con il pallone benedetto.",
          P: "La corda del rintocco che penzola dall'arcata della navata."
        },
        intro: [
          ["voce", "Rocca Campanaria: un borgo medievale arrampicato sulla roccia dove il tempo è sempre stato scandito dal bronzo della Campana d'Oro."],
          ["voce", "Ma stanotte la torre tace. Sul sagrato di ciottoli, Don Crispino urla al cielo agitando la tonaca nera come un uccello ferito."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "cp_crispino", at: [8, 17] }] : [{ id: "cp_crispino", at: [21, 14] }]),
          ...(s >= 3 ? [{ id: "cp_cacace", at: [15, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          // Mura esterne e perimetro
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Strade e pavimentazione in ciottoli
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          // Osteria del Salame e Fiasco (sinistra)
          house(2, 2, 8, 5, { door: [6, 6], roof: "#854d0e", wall: "#fef08a", rr: 1, enter: { to: "cp_osteria", at: [7, 9] } });
          // Antico Campanile e Chiesa (centro)
          house(11, 2, 10, 5, { door: [16, 6], roof: "#713f12", wall: "#e2e8f0", rr: 2, enter: { to: "cp_campanile", at: [6, 10] } });
          // Palazzo Comunale / Stazione Carabinieri (destra)
          house(22, 2, 8, 5, { door: [25, 6], roof: "#1e3a8a", wall: "#cbd5e1", rr: 1, enter: "La Stazione dei Carabinieri: registri delle denunce, una macchina da scrivere Olivetti e il taccuino di Cacace." });
          // Elementi del sagrato
          put(16, 9, "A"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      cp_osteria: {
        interior: true, region: "cantina", name: "Osteria del Salame e Fiasco", short: "Osteria Rosetta", sub: "Pani caldi, salami appesi, fiaschi impagliati e pettegolezzi", bg: "cp_cantina", w: 16, h: 12, start: [7, 9], outside: ["cp_piazza", 6, 7],
        act: { F: "Annusa il camino", B: "Guarda la botte", T: "Esamina il tavolo", v: "Esci" },
        flavor: {
          F: "Un camino scoppiettante con una fila di salsicce e caciotte appese ad affumicare.",
          B: "Una grande botte cerchiata di rovere colma di rosso casereccio delle colline.",
          T: "Un tavolaccio di castagno inciso con i punteggi della briscola e macchie di sugo."
        },
        intro: [["voce", "L'Osteria del Salame e Fiasco: l'aria profuma di pane appena sfornato, aglio, rosmarino e vino generoso. Rosetta asciuga un boccale cantilenando uno stornello."]],
        npcs: () => [
          { id: "cp_rosetta", at: [8, 4] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "B");
          put(3, 4, "F");
          put(12, 6, "B");
          put(3, 8, "T"); put(11, 8, "T");
        }
      },
      cp_campanile: {
        interior: true, region: "campanile", name: "L'Antico Campanile", short: "Cella Campanaria", sub: "Travi secolari, ruote dentate e il vuoto dove c'era la campana", bg: "cp_campanile", w: 16, h: 12, start: [6, 10], outside: ["cp_piazza", 16, 7],
        act: { B: "Esamina la trave", K: "Ispeziona l'orologio", P: "Controlla la corda", v: "Esci" },
        flavor: {
          B: "La mastodontica trave di quercia da cui pendeva la Campana d'Oro: i ganci sono stati sfilati con precisione millimetrica.",
          K: "I giganteschi ingranaggi di bronzo dell'orologio: ticchettano inesorabili verso la mezzanotte.",
          P: "La fune di canapa tranciata di netto con un seghetto da ferro."
        },
        intro: [["voce", "L'Antico Campanile: una brezza fresca soffia attraverso le bifore romaniche. Dove doveva risplendere il bronzo dorato, c'è solo un buco scuro e tanta polvere di calce."]],
        npcs: () => [
          { id: "cp_tito", at: [8, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(6, 11, "v");
          put(8, 2, "B");
          put(4, 4, "K"); put(11, 4, "P");
          put(4, 8, "T"); put(11, 8, "T");
        }
      }
    };

    const talk = {
      cp_crispino(K) {
        const s = S();
        if (s === 0) {
          say([
            ["cp_crispino", "[agita le braccia verso l'alto e scuote la tonaca impolverata] Sacrilegio! Sciagura! Che San Fortunato mandi una grandinata di scarpini chiodati su quei felloni!"],
            ["hero", "Don Crispino, vi sentite bene? Cos'è successo alla campana?"],
            ["cp_crispino", "Hanno rubato la Campana d'Oro! Capisci, figliolo?! Cinquecento chili di bronzo e foglia d'oro calati giù come un sacco di patate nella notte!"],
            ["cp_crispino", "E domani c'è la finale del Torneo delle Contrade sul sagrato! Senza il rintocco di mezzanotte, la tradizione è morta e il Sindaco ne approfitterà per fare un parcheggio!"],
            ["cp_crispino", "Tieni: ho trovato questo spezzone di fune sul selciato. È canapa unta di grasso da officina."]
          ], () => {
            K.alibi("corda", { battacchi: 60, sospetto: 15, popolo: 10 }, () => {
              say([
                ["cp_crispino", "Fila subito all'Osteria di Rosetta. Quella donna ha occhi e orecchie dappertutto: se qualcuno ha visto una campana camminare, lo sa di certo lei!"],
                ["hero", "Vado subito a indagare, don Crispino! La campana tornerà al suo posto."]
              ], () => {
                setStep(1);
                quest("Entra nell'Osteria del Salame e Fiasco e parla con Rosetta.");
                done();
              });
            });
          });
        } else if (s === 1) {
          say([
            ["cp_crispino", "Rosetta ti aspetta all'Osteria. Non toccare troppo vino se devi giocare a pallone stasera!"]
          ], done);
        } else if (s === 2) {
          say([
            ["cp_crispino", "Ho visto Tito lo Smilzo salire verso la torre campanaria con una borsa sospetta. Va' a vedere che combina quel lazzarone!"]
          ], done);
        } else {
          say([
            ["cp_crispino", "Il Maresciallo Cacace ha sguinzagliato la forza pubblica! Dimostragli sul campo chi comanda a Rocca Campanaria!"]
          ], done);
        }
      },

      cp_rosetta(K) {
        const s = S();
        if (s === 1) {
          say([
            ["cp_rosetta", "[affetta con perizia un salame nostrano sollevando profumo di pepe e aglio] Benvenuto all'osteria, campioncino! Hai sentito che baccano fa Don Crispino lassù?"],
            ["hero", "Dice che gli hanno rubato la campana e incolpa tutta la provincia."],
            ["cp_rosetta", "E fa bene! Ma tra noi due... prima dell'alba ho visto Tito lo Smilzo e Peppe il Meccanico trascinare un carretto coperto da un lenzuolo da bucato."],
            ["cp_rosetta", "Tito giurava che fossero zucche d'orto per la fiera, ma le zucche non fanno «DONNN» quando prendono una buca sul selciato!"],
            ["cp_rosetta", "Mangia questa fetta di pane e salame e prendi questa tazza di zabaione caldo per le gambe."]
          ], () => {
            bond("battacchi", 45);
            bond("popolo", 15);
            say([
              ["cp_rosetta", "Tito è salito sul campanile dicendo che doveva 'studiare il contrappeso'. Se lo stringi all'angolo, canterà come un cardellino!"],
              ["hero", "Grazie Rosetta! Salgo subito alla cella campanaria."]
            ], () => {
              setStep(2);
              quest("Sali nell'Antico Campanile e interroga Tito lo Smilzo.");
              done();
            });
          });
        } else if (s >= 2) {
          say([
            ["cp_rosetta", "[ride asciugando un fiasco] Sentilo il silenzio! Senza rintocchi, persino le galline del borgo non sanno più quando fare l'uovo!"]
          ], done);
        } else {
          say([
            ["cp_rosetta", "Benvenuto all'Osteria! Prima fai due chiacchiere con Don Crispino sul sagrato."]
          ], done);
        }
      },

      cp_tito(K) {
        const s = S();
        if (s === 2) {
          say([
            ["cp_tito", "[fa finta di esaminare un chiodo sul muro con un metro a nastro consumato] Uh! Chi va là?! Guarda che io sono qui per un rilievo geodetico autorizzato dalla pro loco!"],
            ["hero", "Tito, hai la coppola piena di calce e sul pavimento ci sono tracce di grasso da cuscinetti."],
            ["cp_tito", "[abbassa la voce e guarda verso le scale] Shhh! Parla piano! Tu non capisci... non era un furto, era un 'prestito strategico'! Volevamo solo tenerla al sicuro fino a lunedì!"],
            ["cp_tito", "Il piano era perfetto, ideato nei minimi dettagli da me: calare la campana con le funi, nasconderla nella botte di mastro Peppe e chiedere un riscatto simbolico per rifare il manto erboso del campetto!"],
            ["cp_tito", "Ma Peppe ha calcolato male i pesi e abbiamo spaccato il muro della cantina di Don Crispino! Per rimediare abbiamo dovuto nascondere la chiave!"]
          ], () => {
            K.alibi("chiave", { battacchi: 50, sospetto: 20, popolo: 10 }, () => {
              say([
                ["cp_tito", "Sentite laggiù?! Quel fischietto assordante... è il Maresciallo Cacace con tutta la stazione dei Carabinieri! Ha blindato la piazza!"],
                ["hero", "Ci penso io a parlare col Maresciallo prima che arresti mezzo paese!"]
              ], () => {
                setStep(3);
                quest("Scendi in Piazza Grande e affronta il Maresciallo Cacace!");
                done();
              });
            });
          });
        } else if (s > 2) {
          say([
            ["cp_tito", "Fagli vedere come calci sul bagnato! Io resto qui a guardia degli ingranaggi... non sia mai che si rubino pure l'orologio!"]
          ], done);
        } else {
          say([
            ["cp_tito", "Non so niente di niente! Io a quell'ora dormivo come un ghiro!"]
          ], done);
        }
      },

      cp_cacace(K) {
        say([
          ["cp_cacace", "[ti squadra severo soffiando nel fischietto e sfoderando il taccuino] Fermi tutti! Nessuno si muova e nessuno tiri un sospiro senza previa autorizzazione scritta!"],
          ["cp_crispino", "Maresciallo, non fate ridere i polli! Il ragazzo è il campione dell'oratorio, non un ladro di campane!"],
          ["cp_cacace", "La legge non guarda in faccia a nessuno, reverendo! Qui abbiamo: violazione di cella campanaria, disturbo della quiete pubblica e sottrazione indebita di manufatto sonoro!"],
          ["cp_cacace", "Prima di rilasciare chicchessia, esigo un collaudo ginnico-sportivo formale sul sagrato contro la rappresentativa dell'Arma! Se reggete il campo a 'I Cento Rintocchi', potrete proseguire le indagini!"]
        ], () => {
          ask("Accetti la sfida ufficiale del Maresciallo Cacace sul sagrato?", [
            ["Sfida i Carabinieri (I Cento Rintocchi)", () => {
              K.rintocchiMatch({
                turns: 5,
                us: "I Soliti Ignoti",
                opp: {
                  name: "I Carabinieri di Cacace",
                  color: "#1e3a8a",
                  style: "pressing",
                  players: [{ name: "Brigadiere Russo" }, { name: "Appuntato Esposito" }],
                  keeper: { name: "Maresciallo Cacace" }
                }
              }, (res) => {
                if (res && res.win) {
                  say([
                    ["cp_cacace", "[ansima asciugandosi la fronte col fazzoletto d'ordinanza] Notevole... tiro a scasso impeccabile e tempismo del rintocco da manuale."],
                    ["cp_crispino", "[dà una pacca trionfale al Campione] Ve l'avevo detto, Maresciallo! Questo ragazzo ha il tocco benedetto!"],
                    ["cp_cacace", "Va bene! Riconosco l'alta caratura atletica del soggetto. Le indagini congiunte possono proseguire. Ma ho gli occhi puntati sulle contrade!"]
                  ], () => {
                    bond("popolo", 30);
                    bond("battacchi", 75);
                    questDone();
                    finishChapter(1, "Hai superato la prova del Maresciallo Cacace sul sagrato! Rocca Campanaria ha trovato il suo campione e le indagini sulla Campana d'Oro entrano nel vivo.");
                  });
                } else {
                  say([
                    ["cp_cacace", "[chiude il taccuino con un colpo secco] Respingimento con formula piena! Riprova con più tempismo al rintocco, giovanotto!"]
                  ], done);
                }
              });
            }],
            ["Prenditi un attimo per studiare il sagrato", done]
          ]);
        });
      }
    };

    return {
      n: N,
      title: "Il Mistero del Campanile Muto",
      desc: "La sparizione della Campana d'Oro, l'allarme di Don Crispino e la prima sfida sul sagrato contro i Carabinieri di Cacace.",
      goal: () => goal(S()),
      start: "cp_piazza",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>LA NOTTE DEI CENTO RINTOCCHI</b> · Capitolo 1. Rocca Campanaria è nel caos: la storica Campana d'Oro è svanita nel nulla alla vigilia della finale. Don Crispino ti aspetta sul sagrato."]];
      }
    };
  }

  boot();
})();
