// js/burattini-c1.js - LA GIOSTRA DEI BURATTINI · Capitolo 1 «Il Sipario Scricchiola»
// Nel Vicolo delle Pialle tra trucioli e lanterne ad olio. Maestro Taddeo cerca un apprendista
// capace di manovrare il bilancino. Prima sfida di debutto contro Gervaso lo Sghembo.
(function () {
  "use strict";
  function boot() {
    const D = window.__burattini;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("bur_taddeo", { acc: ["occhiali", "grembiule"], name: "Maestro Taddeo", tag: "master", hair: "#e2e8f0", style: "messy", skin: "#f2c9a0", eye: "#5a3818", bg: ["#2b1810", "#d97706"], shirt: "#78350f" },
      "Mastro burattinaio della Corporazione delle Pialle. Intaglia manichini in pioppo da quarant'anni. Dice che il legno parla se lo ascolti prima di piallarlo.");
    K.cast("bur_gervaso", { acc: ["berretto"], name: "Gervaso lo Sghembo", tag: "rival", hair: "#b8452a", style: "spiky", skin: "#e0ac7e", eye: "#111827", bg: ["#451a03", "#dc2626"], shirt: "#991b1b" },
      "Marionettista di strada dal bilancino d'ebano rapido come una vipera. Non rispetta le regole ducali ma riempie le osterie di risate e cori.");
    K.cast("bur_colombina", { acc: ["fiore"], name: "Colombina dei Refi", tag: "sarta", hair: "#2b1d14", style: "braids", skin: "#f5d6b8", eye: "#16a34a", bg: ["#1e1b4b", "#fde047"], shirt: "#4338ca" },
      "Sarta di scena che tesse e incera i refe per i bilancini. Conosce ogni nodo marinaro e ogni segreto degli attori dietro le quinte.");
    K.cast("bur_coriolano", { acc: ["paglia", "fischietto"], name: "Coriolano il Cantastorie", tag: "arbitro", hair: "#ca8a04", style: "buzz", skin: "#d97706", eye: "#475569", bg: ["#78350f", "#fef08a"], shirt: "#d97706" },
      "Cantastorie ambulante e custode dell'Arbitro di Paglia. Giura che il fantoccio abbia una coscienza propria e che veda i falli anche al buio.");

    K.cos("hs_burattino", { kind: "style", label: "Cuffia del Marionettista", val: "bandana", from: "Completa il Capitolo 1 della Giostra dei Burattini" });
    K.cos("sm_burattini", { kind: "shirt", label: "Casacca di Pioppo Intagliato", val: "#78350f", from: "Finisci la saga «La Giostra dei Burattini» (un finale qualsiasi)" });
    K.cos("sh_filo", { kind: "shot", label: "Tiro a Fili Incrociati", val: "muro", from: "Finisci la saga «La Giostra dei Burattini» (un finale qualsiasi)" });

    K.lore("l_bilancino", { t: "Il Bilancino di Frassino", d: "La croce di legno che governa braccia, gambe e baricentro delle marionette calcistiche. Inclinandolo si sposta il peso; strappando i fili si calcia." });
    K.lore("l_arbitro_paglia", { t: "L'Arbitro di Paglia", d: "Un manichino imbottito di spighe e paglia dorata sospeso sopra la linea mediana. Porta un campanaccio al collo e fischia senza sosta." });

    const goal = (s) => ({
      0: "Parla con Maestro Taddeo dentro la sua bottega nel Vicolo delle Pialle.",
      1: "Raggiungi Colombina alla Taverna del Fiasco Buco per ritirare il refe di canapa cerata.",
      2: "Torna da Taddeo per montare il bilancino e ricevere la prima marionetta da gara.",
      3: "Affronta Gervaso lo Sghembo al proscenio della piazzetta per il debutto.",
      4: "Commenta il debutto con Taddeo per suggellare l'inizio dell'apprendistato."
    }[s] || "Capitolo 1 concluso. Il secondo atto ti aspetta dal menu.");

    function giocaDebut() {
      if (!window.__burattiniPartita) return done();
      window.__burattiniPartita.start({
        title: "Debutto a Fili · contro Gervaso",
        opp: "Gervaso lo Sghembo",
        half: 35,
        onDone: (res) => {
          F.set("bur_m1_win", res.win ? 1 : 0);
          bond("stima", res.win ? 4 : 2);
          bond("arte", 5);
          setStep(N, 4);
          K.scene([
            ["bur_gervaso", res.win ? "Accidenti al tuo bilancino! Quel tiro d'incornata ha fatto rintoccare la campanella come a Pasqua!" : "Te l'avevo detto che i miei fili corrono più lesti! Ma per essere la prima volta non t'incastri male."],
            ["bur_taddeo", "Bravo figliolo. Hai mosso il pioppo con rispetto. Le assi hanno risposto al tuo tocco."]
          ], () => K.enterZone("bur_vicolo"), "bur_vicolo");
        }
      });
    }

    const zones = {
      bur_vicolo: {
        region: "vicolo", name: "La Giostra dei Burattini · Vicolo delle Pialle", short: "Vicolo delle Pialle", sub: "Trucioli dorati e botteghe artigiane", bg: "bur_vicolo", time: "pomeriggio", travel: [2, 12],
        w: 36, h: 24, start: [2, 12], items: [[4, 20], [28, 11], [18, 20], [32, 20]],
        areas: [[2, 3, 10, 8, "Bottega di Taddeo"], [24, 3, 33, 8, "Taverna Fiasco Buco"], [12, 14, 24, 22, "Piazzetta del Teatrino"]],
        act: { w: "Esamina il banco", p: "Osserva il manichino", l: "Guarda la lanterna", t: "Sfoglia i trucioli", q: "Entra", ">": "Vai alla Loggia" },
        flavor: {
          w: "Un banco da intaglio lasciato all'aperto. La resina profuma di bosco montano.",
          p: "Un fantoccio senza braccia con una scritta a carboncino: «Chi tocca paga».",
          l: "Una lanterna a olio d'oliva. La fiamma tremola e proietta ombre lunghe come giganti.",
          t: "Una manciata di riccioli di legno chiaro. Morbidi come seta."
        },
        intro: [
          ["voce", "Vicolo delle Pialle, cuore antico della Corporazione del Legno. L'aria odora di colla a caldo, pece e pioppo fresco."],
          ["voce", "I balconi sporgono tanto che quasi si toccano, e tra una bottega e l'altra scricchiolano i carretti dei burattinai ambulanti."]
        ],
        npcs: (s) => [
          { id: "bur_taddeo", at: s >= 4 ? [17, 16] : [6, 10] },
          { id: "bur_colombina", at: [27, 10] },
          ...(s === 3 ? [{ id: "bur_gervaso", at: [18, 17] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 23, "+");
          lay(0, 11, 35, 13, ":");
          lay(17, 0, 19, 23, ":");
          lay(12, 14, 24, 22, "_"); // pedana lignea del teatrino in piazza
          lay(0, 0, 35, 1, "a"); lay(0, 22, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          put(0, 12, ":"); put(35, 12, ":");
          house(2, 3, 8, 6, {
            door: [5, 8], roof: "#78350f", wall: "#5c2c10", rr: 2, lit: true,
            enter: {
              room: "bottega", id: "bur_bottega", name: "Bottega di Maestro Taddeo", bg: "bur_bottega",
              intro: "La Bottega di Taddeo: scaffali pieni di sgorbie, teste di manichini con espressioni teatrali e un grande banco centrale cosparso di pialle.",
              who: (s) => (s <= 3 ? [{ id: "bur_taddeo", at: [8, 5] }] : [])
            }
          });
          house(24, 3, 9, 6, {
            door: [28, 8], roof: "#881337", wall: "#6b3414", rr: 2, lit: true,
            enter: {
              room: "locanda", id: "bur_taverna", name: "Taverna del Fiasco Buco", bg: "bur_vicolo",
              intro: "La Taverna del Fiasco Buco: fumo di pipa, tavoli di noce lucidi di vino e marinai che scommettono sui derby delle marionette.",
              who: [{ id: "bur_colombina", at: [7, 5] }]
            }
          });
          // elementi decorativi
          [[11, 10], [23, 10], [11, 15], [23, 15]].forEach(([x, y]) => put(x, y, "l"));
          put(14, 18, "w"); put(22, 18, "p"); put(16, 12, "t");
          put(4, 14, "s"); // punto di riposo stufa
        }
      }
    };

    const talk = {
      bur_taddeo(K) {
        const s = S();
        if (s === 0) {
          say([
            ["bur_taddeo", "Vieni avanti, ragazzo. Non aver paura dei trucioli: sono il pane di questo vicolo."],
            ["bur_taddeo", "Il Duca Ottavio ha annunciato il Gran Derby del Solstizio. Ma i miei vecchi burattini hanno i fili logori e Gervaso fa il gradasso."],
            ["bur_taddeo", "Cerco qualcuno che abbia le dita sensibili. Un bilancino non si forza: si accarezza."],
            ["bur_taddeo", "Va' da Colombina al Fiasco Buco. Fatti dare la matassa di refe di canapa cerata numero quattro."]
          ], () => {
            setStep(N, 1);
            quest("bur_refe", "La Matassa di Refe", "Trova Colombina alla Taverna del Fiasco Buco.");
            done();
          });
          return;
        }
        if (s === 1) {
          say([["bur_taddeo", "Colombina sta al Fiasco Buco, sul lato est della strada. Senza quel refe cerato non posso montare gli snodi!"]], done);
          return;
        }
        if (s === 2) {
          say([
            ["bur_taddeo", "Eccolo! Canapa pura, flessibile e cerata a mano. Colombina non delude mai."],
            ["bur_taddeo", "Ora guarda come aggancio il bilancino al baricentro. Con la sinistra inclini l'asse, con la destra scocchi il tiro di punta col tasto A."],
            ["bur_taddeo", "Se ti serve staccare di testa o respingere a mezz'aria, usa il tasto B."],
            ["bur_taddeo", "Gervaso è fuori sulla pedana di legno che aspetta. Va' e dimostragli che il nostro pioppo non teme il suo ebano!"]
          ], () => {
            setStep(N, 3);
            questDone("bur_refe");
            quest("bur_debut", "Il Debutto sulla Pedana", "Sfida Gervaso sulla pedana della piazzetta.");
            done();
          });
          return;
        }
        if (s === 4) {
          say([
            ["bur_taddeo", "[felice] Hai sentito come vibravano i fili? Quello è il canto del legno sincero!"],
            ["bur_taddeo", "Tieni: questa cuffia da artigiano e il tuo primo bilancino personale. Da oggi sei a tutti gli effetti il mio apprendista."],
            ["bur_taddeo", "Ma tienti pronto: domani si aprono i mercati alla Loggia, e lì incontreremo l'Arbitro di Paglia..."]
          ], () => {
            questDone("bur_debut");
            K.reward("c1_done", { coins: 40, exp: 20, cos: "hs_burattino" });
            finishChapter(N, "popolare");
            done();
          });
          return;
        }
        say([["bur_taddeo", "Il legno ha una sua memoria, ragazzo. Non dimenticarlo mai."]], done);
      },

      bur_colombina(K) {
        const s = S();
        if (s === 1) {
          say([
            ["bur_colombina", "Tu devi essere il nuovo ragazzo di Taddeo! Ha buon occhio il vecchio: hai mani da sarto."],
            ["bur_colombina", "Ecco qui la matassa: l'ho immersa stamattina nella cera calda e resina di pino. Resiste all'attrito e non si sfilaccia nemmeno se i fili s'incrociano."],
            ["bur_colombina", "Un consiglio d'amica: se vedi i fili annodarsi in partita, allontanati subito. Se si bloccano, la marionetta resta a terra come un sacco vuoto!"]
          ], () => {
            F.set("bur_has_refe", true);
            setStep(N, 2);
            done();
          });
          return;
        }
        say([["bur_colombina", "I fili di seta per il Duca sono belli ma fragili. Per le botte del vicolo ci vuole canapa grezza!"]], done);
      },

      bur_gervaso(K) {
        const s = S();
        if (s === 3) {
          ask("bur_gervaso", "Gervaso incrocia le braccia ridendo: «Eccoti qua, pulcino di bottega! Pronto a farti aggrovigliare i bilancini dal sottoscritto?»", [
            { label: "Pronto a giocare!", sub: "Inizia la partita a fili", cls: "hot", fn: giocaDebut },
            { label: "Dammi un attimo", sub: "Controllo gli snodi", fn: done }
          ]);
          return;
        }
        say([["bur_gervaso", "Sul proscenio la palla di cuoio non mente mai!"]], done);
      }
    };

    return {
      n: N, title: "Il Sipario Scricchiola", sub: "L'odore di pece e pioppo", goal, start: "bur_vicolo",
      introBg: "bur_titolo", zones, talk,
      intro: [
        ["voce", "Atto I · Il Sipario Scricchiola."],
        ["voce", "Nel Vicolo delle Pialle le marionette di legno scendono sul proscenio. Impara l'arte del bilancino prima che i fili si spezzino."]
      ]
    };
  }

  boot();
})();
