// js/burattini-c4.js - LA GIOSTRA DEI BURATTINI · Capitolo 4 «L'Ultima Recita»
// La gran piazza del Teatro Ducale: velluti cremisi, ribalta a candelabri e la folla in delirio.
// Il Gran Derby di Cartapesta e i quattro finali della saga.
(function () {
  "use strict";
  function boot() {
    const D = window.__burattini;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter4);
  }

  function chapter4(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone, end } = K;
    const N = 4, S = () => K.stepOf(N);

    const goal = (s) => ({
      0: "Parla con Maestro Taddeo nel Foyer Ducale prima dell'apertura del sipario.",
      1: "Sali alle Capriate sopra il proscenio per registrare la tensione dei bilancini.",
      2: "Scendi sulla ribalta e sfida i Burattini Ducali nel Gran Derby del Solstizio.",
      3: "Affronta il Duca Ottavio sul proscenio e decidi il destino eterno della Giostra."
    }[s] || "Saga conclusa! I tuoi finali sono custoditi nella Cineteca e nel Canovaccio.");

    function giocaDerby() {
      if (!window.__burattiniPartita) return done();
      window.__burattiniPartita.start({
        title: "Il Gran Derby Ducale · Finale del Solstizio",
        opp: "I Burattini Ducali",
        half: 50,
        boss: true,
        onDone: (res) => {
          F.set("bur_m4_win", res.win ? 1 : 0);
          bond("arte", res.win ? 15 : 6);
          setStep(N, 3);
          K.scene([
            ["bur_duca", res.win ? "Incredibile! Un pioppo grezzo intagliato nei vicoli che trafigge la nostra difesa d'ebano ducale!" : "Una recita d'altissimo profilo! L'applauso della corte scende scrosciante."],
            ["bur_taddeo", "[felice] Abbiamo suonato la campanella d'oro, ragazzo! La ribalta è tutta nostra!"]
          ], () => K.enterZone("bur_piazza"), "bur_piazza");
        }
      });
    }

    const zones = {
      bur_piazza: {
        region: "palco", name: "La Giostra dei Burattini · Piazza del Gran Teatro", short: "Piazza del Gran Teatro", sub: "Velluti, candelabri e la campana d'oro", bg: "bur_palco", time: "notte", travel: [2, 12],
        w: 36, h: 24, start: [2, 12], items: [[4, 18], [28, 10], [18, 19], [32, 18]],
        areas: [[2, 3, 10, 8, "Il Foyer Ducale"], [24, 3, 33, 8, "Passerella delle Capriate"], [12, 12, 24, 21, "Il Gran Proscenio"]],
        act: { w: "Ammira il drappo", p: "Osserva la campanella", l: "Guarda il candelabro", q: "Entra", "<": "Torna allo Scalo" },
        flavor: {
          w: "Puro velluto veneziano con stemmi dorati raffiguranti un bilancino e un leone rampante.",
          p: "La campanella d'oro dell'incrocio dei pali: squilla con suono argentino a ogni gol.",
          l: "Candelabri a sette bracci in bronzo dorato con cere profumate al miele."
        },
        intro: [
          ["voce", "La notte del Solstizio. Piazza del Gran Teatro è un mare di lanterne colorate, maschere e cori da stadio."],
          ["voce", "Taddeo fissa commosso il proscenio: dopo quarant'anni di bottega, i suoi burattini calcano la ribalta più ambita del mondo."]
        ],
        npcs: (s) => [
          ...(s <= 1 ? [{ id: "bur_taddeo", at: [6, 11] }] : []),
          ...(s >= 2 && s < 3 ? [{ id: "bur_duca", at: [18, 14] }] : []),
          ...(s >= 3 ? [{ id: "bur_duca", at: [16, 16] }, { id: "bur_taddeo", at: [20, 16] }, { id: "bur_gervaso", at: [14, 18] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 23, "+");
          lay(0, 11, 35, 13, ":");
          lay(17, 0, 19, 23, ":");
          lay(12, 12, 24, 21, "_"); // il proscenio di gala
          lay(0, 0, 35, 1, "a"); lay(0, 22, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          put(0, 12, "<"); put(0, 13, "<");
          house(2, 3, 8, 6, {
            door: [5, 8], roof: "#881337", wall: "#4c0519", rr: 2, lit: true,
            enter: {
              room: "foyer", id: "bur_foyer", name: "Foyer del Gran Teatro Ducale", bg: "bur_palco",
              intro: "Il Foyer Ducale: specchi dorati, stucchi barocchi e i gentiluomini in maschera che sorseggiano vino speziato.",
              who: (s) => (s === 0 ? [{ id: "bur_taddeo", at: [6, 5] }] : [])
            }
          });
          house(24, 3, 9, 6, {
            door: [28, 8], roof: "#78350f", wall: "#b45309", rr: 2, lit: true,
            enter: {
              room: "capriate", id: "bur_capriate", name: "Passerella delle Capriate", bg: "bur_bottega",
              intro: "Le Capriate del Teatro: passerelle a picco sul vuoto dove i macchinisti regolano contrappesi e trefoli.",
              who: [{ id: "bur_colombina", at: [7, 4] }]
            }
          });
          put(13, 13, "w"); put(23, 13, "p");
          [[11, 11], [25, 11], [11, 21], [25, 21]].forEach(([x, y]) => put(x, y, "l"));
          put(4, 15, "s");
        }
      }
    };

    const talk = {
      bur_taddeo(K) {
        const s = S();
        if (s === 0) {
          say([
            ["bur_taddeo", "[felice] Respira quest'aria, ragazzo! Quarant'anni fa ho intagliato la prima gamba di legno nel mio vicolo."],
            ["bur_taddeo", "Oggi siamo qui, al Gran Teatro. Prima della recita, sali sulle capriate con Colombina: controllate i contrappesi d'ottone."],
            ["bur_taddeo", "Quando il sipario si alzerà, il mondo intero vedrà di cosa è capace il nostro bilancino!"]
          ], () => {
            setStep(N, 1);
            quest("bur_capriate_q", "L'Ultima Tensione", "Parla con Colombina sulle Capriate sopra il palco.");
            done();
          });
          return;
        }
        say([["bur_taddeo", "Che la grazia del pioppo guidi le tue mani, ragazzo!"]], done);
      },

      bur_colombina(K) {
        const s = S();
        if (s === 1) {
          say([
            ["bur_colombina", "Tutto pronto, campione! I refe a otto trefoli dell'Arsenale sono tesi al millimetro."],
            ["bur_colombina", "L'Arbitro di Paglia è stato sospeso sopra il cerchio di centrocampo. Nessuno potrà imbrogliare stasera."],
            ["bur_colombina", "Scendi giù sul proscenio. Il Duca Ottavio ha appena battuto tre colpi di bastone: il Derby ha inizio!"]
          ], () => {
            setStep(N, 2);
            questDone("bur_capriate_q");
            quest("bur_derby_q", "Il Gran Derby Ducale", "Scendi sul proscenio e affronta i Burattini Ducali.");
            done();
          });
          return;
        }
        say([["bur_colombina", "I fili sono pronti a cantare la gloria!"]], done);
      },

      bur_duca(K) {
        const s = S();
        if (s === 2) {
          ask("bur_duca", "Il Duca Ottavio ti osserva con lorgnette d'oro: «Dunque è questo il famoso apprendista di Taddeo. Sei pronto a recitare sul palcoscenico più nobile d'Europa?»", [
            { label: "Si alzi il sipario!", sub: "Inizia il Gran Derby del Solstizio", cls: "hot", fn: giocaDerby },
            { label: "Un attimo di raccoglimento", sub: "Controllo i contrappesi", fn: done }
          ]);
          return;
        }
        if (s === 3) {
          const morale = K.stat("morale") || 0;
          const arte = K.stat("arte") || 0;
          const items = (function () {
            try { return (JSON.parse(localStorage.getItem("ali-di-rondine.burattini") || "{}").items || []); } catch { return []; }
          })().length;

          ask("bur_duca", "Il Duca Ottavio allarga le braccia davanti alla platea plaudente: «Una recita memorabile! Ora tocca a te decidere come si chiude questa storia.»", [
            {
              label: "Consacra il teatro al Popolo",
              sub: "Finale «Teatro del Popolo» · Piazza e libertà",
              cls: "hot",
              fn: () => {
                F.set("bur_finale", "popolare");
                say([
                  ["bur_duca", "Rifiuti i miei privilegi per tornare nel vicolo? Sei davvero fatto della stessa pasta di Taddeo."],
                  ["bur_taddeo", "[felice] Il calcio a fili nasce tra la gente e alla gente ritorna! Grazie, ragazzo mio!"]
                ], () => {
                  K.reward("c4_done", { coins: 100, exp: 60, cos: "sm_burattini" });
                  end("popolare");
                  finishChapter(N, "popolare");
                  setStep(N, 4);
                  done();
                });
              }
            },
            {
              label: "Firma il patto dell'Accademia Ducale",
              sub: "Finale «Il Teatro Ducale» · Gloria di corte",
              fn: () => {
                F.set("bur_finale", "accademia");
                say([
                  ["bur_duca", "Una scelta saggia. Avrai la migliore bottega di corte, ebano purissimo e allievi da ogni regno."],
                  ["bur_taddeo", "La tua arte merita la ribalta più alta, figliolo. Va' e illumina la corte."]
                ], () => {
                  K.reward("c4_done", { coins: 100, exp: 60, cos: "sm_burattini" });
                  end("accademia");
                  finishChapter(N, "accademia");
                  setStep(N, 4);
                  done();
                });
              }
            },
            {
              label: "Parti con la Carovana di Gervaso",
              sub: "Finale «La Carovana Nomade» · Libertà errante",
              fn: () => {
                F.set("bur_finale", "carovana");
                say([
                  ["bur_gervaso", "[ride] Questa sì che è vita! Caricheremo il teatrino sul carrozzone e porteremo i gol a fili di fiera in fiera!"],
                  ["bur_taddeo", "L'avventura vi chiama. Ricordatevi di oliare i bilancini ogni lunedì!"]
                ], () => {
                  K.reward("c4_done", { coins: 100, exp: 60, cos: "sm_burattini" });
                  end("carovana");
                  finishChapter(N, "carovana");
                  setStep(N, 4);
                  done();
                });
              }
            },
            ...(arte >= 25 ? [{
              label: "Libera l'Anima di Pioppo (Segreto)",
              sub: "Finale Segreto «L'Anima di Pioppo»",
              cls: "hot",
              fn: () => {
                F.set("bur_finale", "segreto");
                say([
                  ["bur_coriolano", "[sorpreso] Guardate! L'Arbitro di Paglia scioglie i suoi fili da solo... e le marionette danzano senza bilancino!"],
                  ["bur_taddeo", "[felice] Non è magia... è il cuore puro di chi le ha intagliate e giocate con vero amore!"],
                  ["bur_duca", "Un prodigio senza pari nella storia della nostra città. Niente divisioni: questo teatro sarà per sempre aperto a tutti!"]
                ], () => {
                  K.reward("c4_done", { coins: 150, exp: 100, cos: "sh_filo" });
                  end("segreto");
                  finishChapter(N, "segreto");
                  setStep(N, 4);
                  done();
                });
              }
            }] : [])
          ]);
          return;
        }
        say([["bur_duca", "Sul palco ducale la recita non finisce mai."]], done);
      }
    };

    return {
      n: N, title: "L'Ultima Recita", sub: "Il Gran Derby di Cartapesta", goal, start: "bur_piazza",
      introBg: "bur_palco", zones, talk,
      intro: [
        ["voce", "Atto IV · L'Ultima Recita."],
        ["voce", "La notte del Solstizio al Gran Teatro Ducale. Scuoti il bilancino e scrivi l'ultimo capitolo della Giostra dei Burattini."]
      ]
    };
  }

  boot();
})();
