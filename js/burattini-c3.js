// js/burattini-c3.js - LA GIOSTRA DEI BURATTINI · Capitolo 3 «Fili Spezzati»
// Tra gli scali di varo, gomene navali e calderoni di pece dell'Arsenale.
// Un sabotaggio notturno spezza i fili dei campioni alla vigilia della finalissima.
(function () {
  "use strict";
  function boot() {
    const D = window.__burattini;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cast("bur_pece", { acc: ["fascia", "guanti"], name: "Angelo di Pece", tag: "sabotatore", hair: "#0f172a", style: "undercut", skin: "#d97706", eye: "#e11d48", bg: ["#020617", "#e11d48"], shirt: "#1e293b" },
      "Mastro cordaio dell'Arsenale navale. Ha le mani segnate dalla pece e dalla canapa bagnata. Odia il Duca e la sua corte impipata che vuole scippare la Giostra ai lavoratori.");

    K.lore("l_refe_nautico", { t: "Il Refe a Otto Trefoli", d: "Corda speciale intrecciata dai calafati dell'Arsenale: indistruttibile all'attrito e insensibile all'umidità delle banchine." });

    const goal = (s) => ({
      0: "Parla con Taddeo sconvolto davanti alla bottega saccheggiata allo Scalo.",
      1: "Segui le macchie di pece fresca fino alla banchina del Cantiere Navale.",
      2: "Confrontati con Angelo di Pece dentro il Chiostro dell'Arsenale.",
      3: "Affronta le Maschere di Pece nella sfida sul pontile bagnato.",
      4: "Decidi se allearti con i ribelli dell'Arsenale o mediare la pace con il Duca."
    }[s] || "Capitolo 3 concluso. L'atto finale ti aspetta dal menu.");

    function giocaPece() {
      if (!window.__burattiniPartita) return done();
      window.__burattiniPartita.start({
        title: "Sfida del Pontile · contro le Maschere di Pece",
        opp: "Maschere di Pece",
        half: 45,
        onDone: (res) => {
          F.set("bur_m3_win", res.win ? 1 : 0);
          bond("arte", res.win ? 10 : 5);
          setStep(N, 4);
          K.scene([
            ["bur_pece", res.win ? "Accidenti... quel legno di pioppo danza sull'acqua come un motoscafo. Hai battuto i miei bilancini di ferro!" : "Il ferro batte sempre il legno sul bagnato! Ma hai lottato da vero figlio del porto."],
            ["bur_taddeo", "Vedi, Angelo? La Giostra unisce chi fatica, non divide chi ha mani callose!"]
          ], () => K.enterZone("bur_cantiere"), "bur_cantiere");
        }
      });
    }

    const zones = {
      bur_cantiere: {
        region: "cantiere", name: "La Giostra dei Burattini · Cantiere Navale", short: "Scalo del Cantiere", sub: "Gomene, barili di pece e chiglie d'acero", bg: "bur_palco", time: "sera", travel: [2, 12],
        w: 36, h: 24, start: [2, 12], items: [[4, 18], [28, 10], [18, 19], [32, 18]],
        areas: [[2, 3, 10, 8, "Stanza dei Progetti"], [24, 3, 33, 8, "Chiostro dell'Arsenale"], [12, 12, 24, 21, "Pontile delle Gomene"]],
        act: { w: "Esamina la gomena", p: "Guarda la chiglia", l: "Guarda il faro", q: "Entra", "<": "Torna alla Loggia" },
        flavor: {
          w: "Un cavo di canapa spessa tre dita, incatramato per resistere all'acqua salata.",
          p: "Lo scheletro d'una galea da corsa in legno di rovere centenario.",
          l: "Faro del molo d'allestimento con lente a petrolio che spazza la banchina."
        },
        intro: [
          ["voce", "Scalo dell'Arsenale. Le chiglie delle navi incombono gigantesche sopra il selciato bagnato di marea."],
          ["voce", "L'odore acre di pece bollente brucia nelle narici. Taddeo osserva disperato i bilancini con i fili tranciati di netto."]
        ],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "bur_taddeo", at: [6, 11] }] : []),
          ...(s === 1 || s === 3 ? [{ id: "bur_pece", at: [18, 15] }] : []),
          ...(s >= 4 ? [{ id: "bur_pece", at: [16, 16] }, { id: "bur_taddeo", at: [20, 16] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 23, "+");
          lay(0, 11, 35, 13, ":");
          lay(17, 0, 19, 23, ":");
          lay(12, 12, 24, 21, "_"); // pontile in legno
          lay(0, 0, 35, 1, "a"); lay(0, 22, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          put(0, 12, "<"); put(0, 13, "<");
          house(2, 3, 8, 6, {
            door: [5, 8], roof: "#334155", wall: "#475569", rr: 2, lit: true,
            enter: {
              room: "studio", id: "bur_studio", name: "Stanza dei Progetti di Taddeo", bg: "bur_bottega",
              intro: "Lo Studio di Taddeo all'Arsenale: rotoli di pergamene con i disegni del meccanismo segreto dell'Arbitro e campioni di pioppo pregiato.",
              who: []
            }
          });
          house(24, 3, 9, 6, {
            door: [28, 8], roof: "#0f172a", wall: "#1e293b", rr: 2, lit: true,
            enter: {
              room: "arsenale", id: "bur_chiostro", name: "Chiostro dell'Arsenale", bg: "bur_vicolo",
              intro: "Il Chiostro dell'Arsenale: arcate annerite dalla fuliggine dei calderoni, matasse di canapa e le marionette corazzate di Angelo.",
              who: (s) => (s === 2 ? [{ id: "bur_pece", at: [7, 5] }] : [])
            }
          });
          put(14, 18, "w"); put(22, 18, "p");
          [[11, 10], [25, 10], [11, 21], [25, 21]].forEach(([x, y]) => put(x, y, "l"));
          put(4, 14, "s");
        }
      }
    };

    const talk = {
      bur_taddeo(K) {
        const s = S();
        if (s === 0) {
          say([
            ["bur_taddeo", "[triste] Guarda qui, ragazzo... un taglio netto su tutti e quattro i bilancini principali!"],
            ["bur_taddeo", "Chi l'ha fatto ha usato una cesoia pesante da calafato, e ha lasciato macchie di pece sulle assi."],
            ["bur_taddeo", "Le tracce portano dritte al Chiostro di Angelo di Pece. Va' a parlargli prima che la rabbia accechi tutti!"]
          ], () => {
            setStep(N, 1);
            quest("bur_tracce", "La Pista di Pece", "Segui le macchie nere verso il Chiostro dell'Arsenale.");
            done();
          });
          return;
        }
        say([["bur_taddeo", "La canapa si riannoda sempre, figliolo. Ma la fiducia tradita è dura da rammendare."]], done);
      },

      bur_pece(K) {
        const s = S();
        if (s === 1 || s === 2) {
          say([
            ["bur_pece", "Sì, sono stato io a tranciare i fili. E lo rifarei cento volte!"],
            ["bur_pece", "Il Duca Ottavio vuole appropriarsi del teatrino. Vuole invitare solo conti e marchesi in velluto e bandire i marinai che si spaccano la schiena sui pontili."],
            ["bur_pece", "Se vuoi quelle corde nuove a otto trefoli, dovrai battermi sul pontile con le mie Maschere di Pece!"]
          ], () => {
            setStep(N, 3);
            questDone("bur_tracce");
            quest("bur_sfida_pece", "Sfida dell'Arsenale", "Affronta le Maschere di Pece sul pontile.");
            done();
          });
          return;
        }
        if (s === 3) {
          ask("bur_pece", "Angelo imbraccia il bilancino di ferro battuto: «Le mie maschere non perdonano sul bagnato. Pronto?»", [
            { label: "Scendi sul pontile!", sub: "Inizia il match delle gomene", cls: "hot", fn: giocaPece },
            { label: "Ascolta un attimo", sub: "Controllo i trefoli", fn: done }
          ]);
          return;
        }
        if (s === 4) {
          ask("bur_pece", "Angelo ti guarda con rispetto: «Mi hai battuto con lealtà. Ora dimmi: domani al Gran Derby difenderai il popolo dell'Arsenale o ti venderai ai velluti ducali?»", [
            {
              label: "Prometti il teatro al popolo",
              sub: "+Spirito Popolare",
              cls: "hot",
              fn: () => {
                bond("morale", 5);
                say([
                  ["bur_pece", "Allora siamo fratelli di canapa! Prendi questo rotolo di refe a otto trefoli. Domani le tue marionette voleranno come gabbiani."],
                  ["bur_pece", "Porta Taddeo in trionfo. Ci vediamo sotto il palco ducale con tutta la ciurma!"]
                ], () => {
                  K.reward("c3_done", { coins: 60, exp: 40 });
                  finishChapter(N, "popolare");
                  done();
                });
              }
            },
            {
              label: "Cerca la conciliazione con la corte",
              sub: "+Stima della Corte ed equilibrio",
              fn: () => {
                bond("morale", -3);
                bond("arte", 8);
                say([
                  ["bur_pece", "Sei un diplomatico... spero che il Duca mantenga la parola. Ecco il refe indistruttibile."],
                  ["bur_pece", "Domani sul proscenio ducale dimostra che anche un'arte nobile ha bisogno delle nostre radici di legno."]
                ], () => {
                  K.reward("c3_done", { coins: 60, exp: 40 });
                  finishChapter(N, "accademia");
                  done();
                });
              }
            }
          ]);
          return;
        }
        say([["bur_pece", "I nodi dell'Arsenale non si sciolgono con le chiacchiere dei cortigiani."]], done);
      }
    };

    return {
      n: N, title: "Fili Spezzati", sub: "L'odore di canapa e la pece ardente", goal, start: "bur_cantiere",
      introBg: "bur_palco", zones, talk,
      intro: [
        ["voce", "Atto III · Fili Spezzati."],
        ["voce", "All'Arsenale navale le gomene d'acciaio e di canapa si scontrano. Ricostruisci il bilancino del campione prima del Gran Derby."]
      ]
    };
  }

  boot();
})();
