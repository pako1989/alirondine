// js/burattini-c2.js - LA GIOSTRA DEI BURATTINI · Capitolo 2 «L'Arbitro di Paglia»
// Alla Loggia dei Mercanti tra banchi di spezie e contratti di cuoio.
// Un manichino di paglia sospeso su funi invisibili decreta i falli con un campanaccio d'ottone.
(function () {
  "use strict";
  function boot() {
    const D = window.__burattini;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("bur_bastone", { acc: ["croce", "sciarpa"], name: "Fra' Bastone", tag: "frate", hair: "#94a3b8", style: "bald", skin: "#e0ac7e", eye: "#334155", bg: ["#1c1917", "#78350f"], shirt: "#44403c" },
      "Frate intagliatore dell'antico convento di San Cipriano. Scolpisce parastinchi in legno di noce per i giovani burattinai e odia gli inganni di corte.");
    K.cast("bur_duca", { acc: ["corona", "medaglia"], name: "Duca Ottavio", tag: "signore", hair: "#1e1b4b", style: "slick", skin: "#f8fafc", eye: "#1e3a8a", bg: ["#881337", "#fef08a"], shirt: "#881337" },
      "Signore della città e mecenate del Gran Teatro Ducale. Vuole trasformare la Giostra in un'esclusiva accademia per patrizi, togliendo la ribalta al popolo.");

    K.lore("l_paglia", { t: "Il Mistero della Paglia", d: "L'Arbitro non ha giunture in ferro: è fatto di paglia di grano, spago e un campanaccio in bronzo. Chi muove i suoi fili dalle capriate della loggia?" });

    const goal = (s) => ({
      0: "Esamina la garitta dell'Arbitro di Paglia al centro della Loggia dei Mercanti.",
      1: "Interroga Fra' Bastone nella Sacrestia per capire chi tesse i fili dell'arbitro.",
      2: "Sali alla Piccionaia per ispezionare le carrucole nascoste nel tetto.",
      3: "Affronta la Squadra della Corporazione nella sfida ufficiale della Loggia.",
      4: "Confrontati con Fra' Bastone e decidi se svelare l'inganno dell'Arbitro."
    }[s] || "Capitolo 2 concluso. Il terzo atto ti aspetta dal menu.");

    function giocaLoggia() {
      if (!window.__burattiniPartita) return done();
      window.__burattiniPartita.start({
        title: "Sfida della Loggia · contro i Fantocci",
        opp: "Fantocci della Corporazione",
        half: 40,
        onDone: (res) => {
          F.set("bur_m2_win", res.win ? 1 : 0);
          bond("arte", res.win ? 8 : 4);
          setStep(N, 4);
          K.scene([
            ["bur_coriolano", res.win ? "L'Arbitro di Paglia ha fatto suonare tre rintocchi limpidi! Vittoria per l'apprendista di Taddeo!" : "Un pareggio combattuto fino all'ultimo filo! Il campanaccio ha decretato la fine del tempo."],
            ["bur_bastone", "Hai giocato con pulizia, figliolo. Nessun trucco nei tuoi nodi."]
          ], () => K.enterZone("bur_loggia"), "bur_loggia");
        }
      });
    }

    const zones = {
      bur_loggia: {
        region: "palco", name: "La Giostra dei Burattini · Loggia dei Mercanti", short: "Loggia dei Mercanti", sub: "Arcate di pietra e fili nascosti", bg: "bur_palco", time: "mezzogiorno", travel: [2, 12],
        w: 36, h: 24, start: [2, 12], items: [[4, 18], [28, 10], [18, 19], [32, 18]],
        areas: [[2, 2, 10, 8, "La Sacrestia"], [24, 2, 33, 8, "La Piccionaia"], [12, 10, 24, 22, "Campo delle Colonne"]],
        act: { w: "Esamina la balaustra", p: "Osserva l'arbitro", l: "Guarda le arcate", q: "Entra", "<": "Torna al Vicolo" },
        flavor: {
          w: "Marmo venato di rosso, levigato dai gomiti di banchieri e mercanti di refe.",
          p: "Il fantoccio di paglia penzola a due metri da terra. Gli occhi di bottone sembrano fissarti.",
          l: "Colonne toscane ornate con stendardi gialli e vermigli della Corporazione dei Burattinai."
        },
        intro: [
          ["voce", "La Loggia dei Mercanti. Sotto le immense volte a crociera risuona il vociare dei trafficanti di refe e seta."],
          ["voce", "Al centro della loggia, una gabbia lignea con due porte e l'enigmatico Arbitro di Paglia sospeso tra le travi."]
        ],
        npcs: (s) => [
          { id: "bur_coriolano", at: [18, 11] },
          ...(s === 3 ? [{ id: "bur_gervaso", at: [18, 16] }] : []),
          ...(s >= 4 ? [{ id: "bur_bastone", at: [14, 15] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 23, "+");
          lay(0, 11, 35, 13, ":");
          lay(17, 0, 19, 23, ":");
          lay(12, 12, 24, 21, "_"); // campo della Loggia
          lay(0, 0, 35, 1, "a"); lay(0, 22, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          put(0, 12, "<"); put(0, 13, "<");
          house(2, 2, 8, 6, {
            door: [5, 7], roof: "#44403c", wall: "#78716c", rr: 2, lit: true,
            enter: {
              room: "chiesa", id: "bur_sacrestia", name: "Sacrestia di San Cipriano", bg: "bur_bottega",
              intro: "La Sacrestia: odore d'incenso misto a noce stagionato. Fra' Bastone intaglia parastinchi e croci votive.",
              who: (s) => (s <= 3 ? [{ id: "bur_bastone", at: [7, 5] }] : [])
            }
          });
          house(24, 2, 9, 6, {
            door: [28, 7], roof: "#b45309", wall: "#92400e", rr: 2, lit: true,
            enter: {
              room: "soffitta", id: "bur_piccionaia", name: "La Piccionaia dei Refi", bg: "bur_palco",
              intro: "La Piccionaia: travi polverose, nidi di colombi e rocchetti di filo metallico collegati all'Arbitro sottostante.",
              who: [{ id: "bur_colombina", at: [6, 4] }]
            }
          });
          put(18, 13, "p"); // Fantoccio di paglia
          [[11, 11], [25, 11], [11, 21], [25, 21]].forEach(([x, y]) => put(x, y, "l"));
          put(6, 15, "s");
        }
      }
    };

    const talk = {
      bur_coriolano(K) {
        const s = S();
        if (s === 0) {
          say([
            ["bur_coriolano", "Osservalo bene, ragazzo! Non un grammo di carne, ma il cuore più severo di tutta la signoria."],
            ["bur_coriolano", "L'Arbitro di Paglia non si corrompe con i fiorini. Quando un piede va troppo alto, le spighe vibrano e il campanaccio canta."],
            ["bur_coriolano", "Dicono che sia un fantoccio vuoto... ma chiedi a Fra' Bastone cosa ne pensa. Lui sa cosa c'è nascosto nel convento."]
          ], () => {
            setStep(N, 1);
            quest("bur_fra", "Il Parere dell'Intagliatore", "Parla con Fra' Bastone nella Sacrestia.");
            done();
          });
          return;
        }
        say([["bur_coriolano", "Niente trucchi sotto la paglia: solo la pura legge della giostra!"]], done);
      },

      bur_bastone(K) {
        const s = S();
        if (s === 1) {
          say([
            ["bur_bastone", "Pace a te, giovane. Sei l'allievo di Taddeo, vero? Riconosco l'odore di colla animale."],
            ["bur_bastone", "Quell'arbitro non ha nulla di santo. Ho trovato un filo d'acciaio sottile come capello che parte dalla sua nuca e sale fino alla Piccionaia."],
            ["bur_bastone", "Qualcuno dall'alto muove il batacchio per favorire i burattini dei mercanti. Sali lassù e controlla con i tuoi occhi prima di scendere in campo!"]
          ], () => {
            setStep(N, 2);
            questDone("bur_fra");
            quest("bur_tetto", "I Fili dell'Inganno", "Ispeziona la Piccionaia in cima alla loggia.");
            done();
          });
          return;
        }
        if (s === 4) {
          ask("bur_bastone", "Fra' Bastone ti guarda severo ma affettuoso: «Cosa facciamo del meccanismo dell'Arbitro? Sveliamo l'inganno alla piazza o lasciamo che credano nel prodigio?»", [
            {
              label: "Svela l'inganno al popolo",
              sub: "+Spirito Popolare e verità",
              cls: "hot",
              fn: () => {
                bond("morale", 4);
                say([
                  ["bur_bastone", "La verità rende liberi, anche sul proscenio. La piazza deve sapere che i campioni vincono con le proprie mani."],
                  ["bur_bastone", "Prendi questo tassello di noce antico. Ti proteggerà dai contrasti rudi del cantiere."]
                ], () => {
                  K.reward("c2_done", { coins: 50, exp: 30 });
                  finishChapter(N, "popolare");
                  done();
                });
              }
            },
            {
              label: "Conserva il segreto teatrale",
              sub: "+Perizia dell'Arte e fascino",
              fn: () => {
                bond("arte", 6);
                say([
                  ["bur_bastone", "Forse hai ragione tu: il teatro vive d'illusione. Ma bada che la menzogna non soffochi l'onestà della sfida."],
                  ["bur_bastone", "Taddeo ti aspetta allo Scalo del Cantiere. Lì i marinai non scherzano affatto con le gomene."]
                ], () => {
                  K.reward("c2_done", { coins: 50, exp: 30 });
                  finishChapter(N, "accademia");
                  done();
                });
              }
            }
          ]);
          return;
        }
        say([["bur_bastone", "Chi semina nodi raccoglie matasse aggrovigliate."]], done);
      },

      bur_colombina(K) {
        const s = S();
        if (s === 2) {
          say([
            ["bur_colombina", "[sorpreso] Mi hai scoperta! Eh già, sono io che tiro il cordino della campana."],
            ["bur_colombina", "Ma non per imbrogliare! Se non fischiassi io quando i burattini si prendono a calci nelle tibie, a fine gara non resterebbe che legna da ardere!"],
            ["bur_colombina", "Ora scendi giù e vinci la sfida contro i Fantocci della Corporazione. Ti prometto che sarò imparziale come la campana di San Marco!"]
          ], () => {
            setStep(N, 3);
            questDone("bur_tetto");
            quest("bur_partita_loggia", "Sfida della Loggia", "Gioca il match ufficiale contro la Corporazione.");
            done();
          });
          return;
        }
        say([["bur_colombina", "Dall'alto della piccionaia si vede ogni movimento di spalla!"]], done);
      },

      bur_gervaso(K) {
        const s = S();
        if (s === 3) {
          ask("bur_gervaso", "«La Corporazione ha messo in campo i suoi mastini con zavorra di piombo! Pronto alla tenzone?»", [
            { label: "Scendi in campo!", sub: "Inizia la sfida alla Loggia", cls: "hot", fn: giocaLoggia },
            { label: "Un momento", sub: "Controllo i contrappesi", fn: done }
          ]);
          return;
        }
        say([["bur_gervaso", "Quei fantocci pesano come incudini, ma se li salti di testa non ti prendono più!"]], done);
      }
    };

    return {
      n: N, title: "L'Arbitro di Paglia", sub: "Fili invisibili e campane di bronzo", goal, start: "bur_loggia",
      introBg: "bur_palco", zones, talk,
      intro: [
        ["voce", "Atto II · L'Arbitro di Paglia."],
        ["voce", "Sotto le volte della Loggia dei Mercanti, un fantoccio giudica i contrasti. Scopri chi governa il gioco prima di toccare la palla."]
      ]
    };
  }

  boot();
})();
