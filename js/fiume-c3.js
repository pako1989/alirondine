// js/fiume-c3.js - LA CAROVANA DEL FIUME D'ARGENTO · Capitolo 3 «Il Grande Delta d'Argento»
// L'approdo al maestoso delta dove il fiume incontra l'oceano, la finale del Torneo delle Acque Libere
// nell'Arena a palafitte e le quattro scelte che determineranno il destino eterno della Carovana Fluviale.
(function () {
  "use strict";
  function boot() {
    const D = window.__fiume;
    if (!D || !D.addChapter || !D._has(2)) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest } = K;
    const N = 3, S = () => K.stepOf(N);
    const WHO = {
      "Capitan Roderico": "fa_roderico",
      "Mirella la Cartografa": "fa_mirella",
      "Burlone Vanni": "fa_vanni",
      "Doganiere Malacarne": "fa_malacarne",
      "Silvia dei Mulini": "fa_silvia"
    };

    let QL = [];
    const say = (who, txt) => { QL.push([WHO[who] || who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    const fin = (ending) => {
      const msg = K.reward("fa_c" + N, { coins: 150, cos: "fa_c3" }), lines = flush();
      K.finishChapter(N, ending || "mercantile");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DELLA STORIA.</b> ${msg.join(" · ")}<br>Gli altri finali ti attendono nel Diario delle Saghe.`]);
      K.scene(lines, () => K.openMain(), "fa_delta");
    };

    K.cos("fa_c3", { kind: "shirt", label: "Mantello azzurro e oro del Delta d'Argento", val: "#38bdf8", from: "Capitolo 3 de La Carovana del Fiume d'Argento" });
    K.lore("l_delta", { t: "Il Delta d'Argento", d: "Vasta laguna dove i rami del fiume si aprono verso il mare aperto, culla del porto franco e delle acque libere." });

    const goal = (s) => ({
      0: "Il Nautilus è giunto al Delta d'Argento! Parla con Capitan Roderico al molo d'onore.",
      1: "Raccogli le ultime indicazioni idrologiche da Mirella la Cartografa.",
      2: "Raggiungi l'Arena a Palafitte e parla con Silvia e Malacarne prima dell'annuncio ufficiale.",
      3: "Disputa la Finalissima del Delta nell'Arena a Palafitte a Corrente & Rinvio!"
    }[s] || "La storia è compiuta! Puoi rivivere le scelte dal Diario.");

    const zones = {
      fa_delta: {
        region: "delta", name: "L'Approdo del Delta d'Argento", short: "Delta d'Argento", sub: "Isolotti di canne, lanterne d'ottone e il riflesso dell'oceano", bg: "fa_delta", time: "tramonto",
        w: 32, h: 22, start: [6, 11], items: [[8, 6], [22, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "Il lungo molo in legno di cedro che si protende sulle lagune dorate"]],
        flavor: {
          B: "Bitte dorate tempestate di madreperla fluviale.",
          F: "Il grande faro del delta che lancia fasci di luce calda sul mare aperto.",
          C: "Banchi di mercanti e scambi di perle d'acqua dolce.",
          W: "L'acqua calma e dorata del delta dove si incrociano le correnti marine."
        },
        intro: [
          ["voce", "Il rombo delle cascate si placa: davanti al Nautilus di Latta si apre l'infinita distesa del Delta d'Argento."],
          ["voce", "Al tramonto, l'acqua sembra uno specchio d'oro fuso. Tutte le genti del fiume sono radunate per assistere alla sfida che deciderà la rotta dei commerci."]
        ],
        npcs: (s) => [
          { id: "fa_roderico", at: s === 0 ? [10, 11] : [6, 8] },
          { id: "fa_mirella", at: [20, 11] },
          ...(s >= 2 ? [{ id: "fa_vanni", at: [28, 11] }] : [{ id: "fa_vanni", at: [20, 16] }])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 11, 30, 11, ":"); lay(10, 6, 10, 16, ":"); lay(20, 6, 20, 16, ":");
          lay(4, 4, 8, 6, "B"); lay(14, 4, 18, 5, "F"); lay(24, 4, 28, 6, "B");
          lay(4, 15, 8, 18, "C"); lay(24, 15, 28, 18, "C");
          // Uscita verso l'Arena a Palafitte
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "fa_arena_delta", at: [3, 11] } });
        }
      },

      fa_arena_delta: {
        region: "delta", name: "Arena Fluviale delle Acque Libere", short: "Arena Delta", sub: "Palafitte sospese sulla laguna, sponde di canapa e spalti gremiti", bg: "fa_delta", time: "tramonto",
        w: 32, h: 22, start: [3, 11], items: [[12, 5], [20, 16], [27, 8]],
        areas: [[0, 0, 31, 21, "La spettacolare arena galleggiante dove si assegna il Trofeo delle Acque Libere"]],
        flavor: {
          B: "Bitte dorate cerchiate di bronzo su cui rimbalzano i rinvii a vortice.",
          S: "Gomene intrecciate a mano dai maestri cordai del porto franco.",
          F: "Le fiaccole cerimoniali che illuminano il perimetro del campo."
        },
        npcs: (s) => [
          { id: "fa_silvia", at: [10, 11] },
          { id: "fa_malacarne", at: [18, 11] },
          ...(s >= 3 ? [{ id: "fa_roderico", at: [26, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(6, 5, 9, 7, "S"); lay(22, 5, 25, 7, "S"); lay(6, 15, 9, 17, "B"); lay(22, 15, 25, 17, "B");
          // Uscita verso il molo del delta
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "fa_delta", at: [29, 11] } });
        }
      }
    };

    const talk = {
      fa_roderico: (K) => {
        const s = S();
        if (s === 0) {
          say("Capitan Roderico", "Guarda laggiù, Campione... il grande mare si fonde con le nostre acque!");
          say("Capitan Roderico", "Tutti i feudi del fiume hanno inviato i loro migliori battellieri per la contesa finale.");
          say("Capitan Roderico", "Se trionfiamo oggi, la Carovana deciderà il futuro del porto franco per le generazioni a venire!");
          say("Capitan Roderico", "Vai subito da Mirella per gli ultimi assetti tattici prima di raggiungere l'Arena a Palafitte.");
          K.bond("intesa", 5);
          setStep(N, 1);
          done();
        } else if (s === 3) {
          say("Capitan Roderico", "Tutta la foce è in silenzio: il fischietto a vapore sta per suonare l'avvio della finalissima!");
          ask("Dai inizio alla finale delle Acque Libere?", [
            {
              t: "Gioca la Finalissima del Delta!",
              fn: () => {
                K.ownMatch(window.__corrente.start, {
                  opp: "Campioni del Delta d'Oceano",
                  done: (res) => {
                    if (res.win) {
                      say("Capitan Roderico", "CAMPIONI DEL FIUME ARGENTEO! Che partita monumentale! La risacca del delta ha accompagnato il tuo tiro fino all'incrocio!");
                      say("Doganiere Malacarne", "Non ho mai visto una tale armonia tra uomo, legno e acqua. Il destino del fiume è nelle tue mani, Campione.");
                      // Scelta dei 4 finali
                      ask("Quale destino scegli per la Carovana e il Grande Fiume?", [
                        {
                          t: "Apri la via dei commerci: La Grande Rotta Mercantile.",
                          big: true,
                          fn: () => fin("mercantile")
                        },
                        {
                          t: "Proclama il fiume libero per tutti: La Bandiera della Fratellanza.",
                          big: true,
                          fn: () => fin("franca")
                        },
                        {
                          t: "Unisciti a Malacarne per vigilare sulle chiuse: La Sentinella.",
                          big: true,
                          fn: () => fin("sentinella")
                        },
                        {
                          t: "Rivela il segreto del Delta: Il Mistero del Delta d'Oro.",
                          big: true,
                          fn: () => fin("segreto")
                        }
                      ]);
                    } else {
                      say("Capitan Roderico", "Le onde del delta sono ingannevoli al calar del sole. Riprendi fiato e riprova il rinvio!");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Un momento di riflessione prima del fischio.",
              fn: () => {
                say("Capitan Roderico", "Prenditi il tuo tempo: il fiume scorre paziente.");
                done();
              }
            }
          ]);
        } else {
          say("Capitan Roderico", "Tutti i tuoi compagni sono schierati all'Arena. Va' e guida la Carovana al trionfo!");
          done();
        }
      },

      fa_mirella: (K) => {
        const s = S();
        if (s === 1) {
          say("Mirella la Cartografa", "Guarda il diagramma della laguna: qui il flusso incontra la risacca marina, creando un doppio vortice sui pali.");
          say("Mirella la Cartografa", "Se carichi il Rinvio a Vortice (X), la traiettoria supererà la barriera dei difensori come un gabbiano sull'acqua!");
          K.bond("idrologia", 10);
          say("Mirella la Cartografa", "Silvia e Malacarne ti aspettano nell'Arena galleggiante a est per il controllo delle briglie.");
          setStep(N, 2);
          done();
        } else {
          say("Mirella la Cartografa", "Il vento gira a nostro favore. È il momento perfetto per scendere sul pontile!");
          done();
        }
      },

      fa_silvia: (K) => {
        const s = S();
        if (s === 2) {
          say("Silvia dei Mulini", "I supporti dell'Arena reggono a meraviglia! Ho lubrificato gli ammortizzatori delle chiatte con olio di lino.");
          say("Silvia dei Mulini", "Anche durante i contrasti più duri il campo resterà stabile sotto i tuoi tacchetti.");
          K.bond("intesa", 10);
          say("Silvia dei Mulini", "Parla con Malacarne: perfino lui oggi si è tolto il cappello di fronte alla Carovana!");
          done();
        } else {
          say("Silvia dei Mulini", "Le chiuse del delta sono spalancate: gioca con tutto il cuore!");
          done();
        }
      },

      fa_malacarne: (K) => {
        const s = S();
        if (s === 2) {
          say("Doganiere Malacarne", "Non avrei mai creduto che una vecchia bagnarola come il Nautilus arrivasse fino a qui.");
          say("Doganiere Malacarne", "Ma hai dimostrato lealtà, disciplina e un controllo del pallone impeccabile. Oggi la guardia è al tuo fianco.");
          K.bond("reputazione", 10);
          say("Doganiere Malacarne", "Capitan Roderico ti aspetta per il fischio d'inizio della finalissima!");
          setStep(N, 3);
          done();
        } else {
          say("Doganiere Malacarne", "Fai onore al Fiume Argenteo!");
          done();
        }
      },

      fa_vanni: (K) => {
        say("Burlone Vanni", "[ride] Tutta la gente del borgo è sugli spalti a fare il tifo! Senti che boato a ogni sciabordio?");
        done();
      }
    };

    return {
      n: N,
      title: "Il Grande Delta d'Argento",
      sub: "La Finale delle Acque Libere",
      goal,
      start: "fa_delta",
      introBg: "fa_delta",
      zones,
      talk
    };
  }

  boot();
})();
