// js/note-c3.js - TACTICS NOTE · Capitolo 3 «Il Fischio del Giudizio»
// La finalissima allo Stadio Daikoku sotto i riflettori notturni,
// la resa dei conti tra Raito ed Elle e i 4 finali per il destino del calcio.
(function () {
  "use strict";
  function boot() {
    const D = window.__note;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cast("qd_raito", { acc: ["taccuino"], name: "Raito Yagami", tag: "red", hair: "#b45309", style: "slick", skin: "#fed7aa", eye: "#78350f", bg: ["#1e293b", "#ef4444"], shirt: "#1e293b" },
      "Capitano e regista del Liceo Daikoku. Pronto a inaugurare il suo Nuovo Mondo sportivo.");

    K.cast("qd_elle", { acc: ["occhiali"], name: "Elle Lawliet", tag: "blue", hair: "#0f172a", style: "messy", skin: "#f8fafc", eye: "#0f172a", bg: ["#0f172a", "#38bdf8"], shirt: "#f1f5f9" },
      "Analista capo della federazione. Determinato a smascherare l'uso del quaderno al costo della propria carriera.");

    K.cast("qd_ryu", { shape: "ombra", name: "Ryu il Demone", tag: "dark", hair: "#0f172a", style: "spiky", skin: "#cbd5e1", eye: "#ef4444", bg: ["#020617", "#ef4444"], shirt: "#000000" },
      "Spirito del cuoio in attesa della resa dei conti finale e del suo banchetto di mele.");

    K.cast("qd_soichiro", { beard: "baffi", acc: ["fischietto"], name: "Sovrintendente Yagami", tag: "blue", hair: "#64748b", style: "buzz", skin: "#cbd5e1", eye: "#1e293b", bg: ["#0f172a", "#38bdf8"], shirt: "#334155" },
      "Presidente del comitato etico sportivo, custode dell'integrità del torneo.");

    K.cos("qd_c3", { kind: "shirt", label: "Giacca da Campione con colletto rosso gotico", val: "#ef4444", from: "Capitolo 3 di Tactics Note" });
    K.lore("l_giudizio_finale", { t: "Il Fischio del Giudizio", d: "La finale del torneo studentesco: novanta minuti in cui il confine tra giustizia e ambizione si cancella per sempre." });

    const goal = (s) => ({
      0: "Parla con il Sovrintendente Yagami a bordo campo prima dell'ingresso degli atleti.",
      1: "Raggiungi la Tribuna d'Onore per l'ultimo confronto tra Raito ed Elle.",
      2: "Trionfa nella finalissima al Tactics Note contro l'Undici del Nuovo Mondo!",
      3: "Compi la tua scelta definitiva per decidere il finale del Tactics Note!"
    }[s] || "La saga di Tactics Note è completata. Rigioca per scoprire gli altri finali!");

    const zones = {
      qd_stadio: {
        region: "daikoku", name: "Stadio Daikoku nella Notte", short: "Stadio Daikoku", sub: "Riflettori accesi a giorno, tabellone luminoso e spalti gremiti", bg: "qd_stadio", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[4, 8], [27, 8], [16, 18]],
        areas: [[10, 8, 22, 14, "Il cerchio di centrocampo illuminato a giorno"], [0, 0, 31, 21, "Il tunnel degli spogliatoi e il parterre dello stadio"]],
        act: { q: "Entra nella Tribuna d'Onore" },
        flavor: {
          B: "La panchina con i teli e le bottiglie termiche della squadra.",
          P: "Una torre faro imponente che scioglie le ombre sul manto erboso.",
          T: "Il tavolo del quarto uomo con il tabellone luminoso per le sostituzioni.",
          K: "Una cesta di mele rosse posata su una cassa di riscaldamento."
        },
        intro: [
          ["voce", "Stadio Daikoku, la notte della finalissima. Trentamila studenti cantano sugli spalti mentre quattro torri faro squarciano il buio di Tokyo."],
          ["voce", "Al centro del campo, il cerchio di centrocampo sembra un'arena di duello. Il Sovrintendente Yagami ti attende vicino al tunnel d'ingresso."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "qd_soichiro", at: [8, 17] }] : [{ id: "qd_soichiro", at: [21, 14] }]),
          ...(s >= 2 ? [{ id: "qd_ryu", at: [14, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          house(11, 2, 10, 5, { door: [16, 6], roof: "#0f172a", wall: "#334155", rr: 2, enter: { to: "qd_tribuna", at: [7, 9] } });
          house(22, 2, 8, 5, { door: [25, 6], roof: "#1e293b", wall: "#475569", rr: 1, enter: "La Cabina Stampa: telescriventi e radiocronisti pronti per la diretta nazionale." });
          put(16, 9, "T"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      qd_tribuna: {
        interior: true, region: "interno", name: "Tribuna d'Onore & Cabina Tattica", short: "Tribuna d'Onore", sub: "Vetri panoramici sul campo, monitor di gala e tensione palpabile", bg: "qd_aula", w: 16, h: 12, start: [7, 9], outside: ["qd_stadio", 16, 7],
        act: { T: "Esamina il registro ufficiale", L: "Guarda la lavagna della finale", B: "Siediti sulla poltroncina d'onore", v: "Scendi in campo" },
        flavor: {
          T: "Il registro ufficiale con le formazioni consegnate alla terna arbitrale.",
          L: "La lavagna trasparente su cui sono tracciate le traiettorie dell'ultimo scontro.",
          B: "Una comoda poltroncina con vista a volo d'uccello sul cerchio di centrocampo."
        },
        intro: [["voce", "La Tribuna d'Onore: dai grandi vetri si domina l'intero stadio. Raito ed Elle si fronteggiano a pochi passi di distanza in un silenzio tombale."]],
        npcs: () => [
          { id: "qd_raito", at: [5, 4] },
          { id: "qd_elle", at: [11, 4] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "L");
          put(3, 4, "T"); put(12, 4, "T");
          put(4, 7, "B"); put(11, 7, "B");
        }
      }
    };

    const talk = {
      qd_soichiro(K) {
        const s = S();
        if (s === 0) {
          say([
            ["qd_soichiro", "[stringe il fischietto nella mano callosa] Campione. Questa sera non si gioca solo per una coppa studentesca."],
            ["qd_soichiro", "Mio figlio Raito ha sempre avuto un'intelligenza fuori dal comune. Ma vedo un'ombra nei suoi occhi... come se considerasse gli altri atleti semplici pedine."],
            ["qd_soichiro", "Ed Elle non si fermerà davanti a nulla pur di dimostrare le sue tesi. Ti prego: fai sì che a parlare sia solo il pallone sul campo."],
            ["hero", "Faremo valere la verità e la passione sportiva, Sovrintendente."],
            ["qd_soichiro", "Raggiungili in tribuna d'onore. Hanno chiesto di parlare con te prima del riscaldamento."]
          ], () => {
            bond("intuito", 10);
            bond("giustizia", 10);
            setStep(N, 1);
            quest("qd3_tribuna", "La Resa dei Conti", "Sali nella Tribuna d'Onore per il confronto decisivo con Raito ed Elle.");
            done();
          });
        } else {
          say([
            ["qd_soichiro", "Che il campo giudichi con onestà. Qualunque sia il verdetto, sarò pronto ad accettarlo."]
          ], done);
        }
      },

      qd_raito(K) {
        const s = S();
        if (s === 1) {
          say([
            ["qd_raito", "[guarda il campo sottostante con espressione maestosa] Tutto è pronto. Con la nostra intesa, la finale sarà un'opera d'arte matematica."],
            ["qd_elle", "[interrompe masticando un dolcetto] O forse un crimine sportivo senza precedenti."],
            ["qd_raito", "[volge lo sguardo glaciale su Elle] Chiami crimine il desiderio di eliminare l'arbitrarietà e il disordine? Il calcio merita un Dio che guidi ogni giocata."],
            ["qd_elle", "Il calcio è imprevedibilità, errore umano e bellezza del limite. Chiunque tenti di controllarlo come un dittatore è solo un megalomane."],
            ["hero", "La risposta la darà la partita sul campo."]
          ], () => {
            setStep(N, 2);
            questDone("qd3_tribuna");
            quest("qd3_finale", "La Sfida del Giudizio", "Vinci la finalissima al Tactics Note contro l'Undici del Nuovo Mondo!");
            done();
          });
        } else if (s === 2) {
          ask("qd_raito", "I riflettori sono al massimo e le formazioni scendono in campo. Sei pronto a scrivere il destino della finale sul Tactics Note?", [
            {
              label: "Gioca la Finalissima a Tactics Note ▸",
              sub: "Scontro decisivo a mente aperta per il trofeo nazionale",
              big: true,
              fn: () => {
                if (window.__quaderno && window.__quaderno.start) {
                  window.__quaderno.start({
                    opp: "Undici del Nuovo Mondo",
                    onDone: (res) => {
                      if (res.win) {
                        setStep(N, 3);
                        questDone("qd3_finale");
                        bond("intuito", 30);
                        K.reward("qd_c3", 50);
                        say([
                          ["voce", "TRIPLICE FISCHIO! Tra gli spalti in delirio e la pioggia di coriandoli argentati, il match è concluso!"],
                          ["qd_ryu", "[appare alle tue spalle ghignando rumorosamente] Eh eh eh! Che finale memorabile! E ora, custode del quaderno... quale verdetto scriverai per il futuro?"]
                        ], done);
                      } else {
                        say([
                          ["qd_raito", "Abbiamo subito un calo di concentrazione nel finale. Una sconfitta simile non è contemplata nel mio schema. Riprova!"]
                        ], done);
                      }
                    }
                  });
                } else {
                  setStep(N, 3);
                  done();
                }
              }
            },
            {
              label: "Un momento di concentrazione",
              sub: "Ripassa mentalmente le contromosse",
              fn: done
            }
          ]);
        } else if (s === 3) {
          ask("qd_raito", "IL VERDETTO FINALE: Raito, Elle e Ryu attendono la tua decisione sul Tactics Note. Quale destino scegli?", [
            {
              label: "La Giustizia della Lavagna (Con Elle)",
              sub: "Collabora con Elle: il calcio trionfa per logica pura e studio leale",
              big: true,
              fn: () => {
                finishChapter(3, "giustizia_pura");
              }
            },
            {
              label: "Il Dio del Nuovo Campionato (Con Raito)",
              sub: "Alleati con Raito: riscrivi le regole e inaugura un'era di vittorie implacabili",
              big: true,
              fn: () => {
                finishChapter(3, "nuovo_mondo");
              }
            },
            {
              label: "Il Patto del Demone (Con Ryu)",
              sub: "Offri il cesto di mele a Ryu per ottenere favori occulti e divertimento eterno",
              big: true,
              fn: () => {
                finishChapter(3, "patto_demone");
              }
            },
            {
              label: "Senza Nomi né Quaderni (Finale Segreto)",
              sub: "Brucia il Tactics Note: costringi Raito ed Elle a una sfida a piedi nudi!",
              big: true,
              fn: () => {
                finishChapter(3, "calcio_puro");
              }
            }
          ]);
        }
      },

      qd_elle(K) {
        say([
          ["qd_elle", "La deduzione finale è nelle tue mani. Ricorda solo che una vittoria senza onore è la sconfitta più amara che un atleta possa subire."]
        ], done);
      },

      qd_ryu(K) {
        say([
          ["qd_ryu", "[addenta una mela con un 'CRUNCH' sonoro] Che spettacolo magnifico! Gli umani non mi deludono mai. E adesso vediamo che finale scegli!"]
        ], done);
      }
    };

    return {
      n: N,
      title: "Il Fischio del Giudizio",
      sub: "La resa dei conti allo Stadio Daikoku e la scelta definitiva",
      goal,
      start: "qd_stadio",
      introBg: "qd_titolo",
      zones,
      talk
    };
  }

  boot();
})();
