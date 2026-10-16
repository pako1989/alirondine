// js/fiume-c2.js - LA CAROVANA DEL FIUME D'ARGENTO · Capitolo 2 «La Stretta delle Grandi Chiuse»
// Risalita verso la gola di pietra delle Grandi Chiuse, l'incontro con l'inflessibile Doganiere Malacarne,
// l'alleanza con l'ingegnera idraulica Silvia dei Mulini e la sfida del dazio sulle acque impetuose.
(function () {
  "use strict";
  function boot() {
    const D = window.__fiume;
    if (!D || !D.addChapter || !D._has(1)) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest } = K;
    const N = 2, S = () => K.stepOf(N);
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
      const msg = K.reward("fa_c" + N, { coins: 100, cos: "fa_c2" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DEL CAPITOLO 2.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 3 verso il Delta d'Argento.`]);
      K.scene(lines, () => K.openMain(), "fa_delta");
    };

    K.cos("fa_c2", { kind: "shirt", label: "Gilet cerato da idrologo delle chiuse reali", val: "#0284c7", from: "Capitolo 2 de La Carovana del Fiume d'Argento" });
    K.lore("l_chiuse", { t: "La Fortezza delle Chiuse", d: "Complesso idraulico monumentale che regola il livello delle acque tra i ducati dell'alto corso e il delta." });

    const goal = (s) => ({
      0: "Le paratie delle Chiuse sono sbarrate. Parla con il Doganiere Malacarne davanti al ponte levatoio.",
      1: "Raggiungi Silvia dei Mulini all'interno della Sala Macchine per verificare la pressione delle turbine.",
      2: "Consulta Mirella la Cartografa per calcolare il rimbalzo sulle arcate bagnate delle chiuse.",
      3: "Sfida la Guardia Doganale a Corrente & Rinvio per spalancare le porte del Fiume!"
    }[s] || "Il secondo capitolo è completato. Continua con il Capitolo 3.");

    const zones = {
      fa_chiuse: {
        region: "chiuse", name: "La Fortezza delle Grandi Chiuse", short: "Grandi Chiuse", sub: "Arcate di basalto, paratie d'acciaio e scrosci d'acqua fragorosi", bg: "fa_chiuse", time: "giorno",
        w: 32, h: 22, start: [6, 11], items: [[9, 6], [22, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "Il vasto sagrato lastricato a strapiombo sulle cascate artificiali delle chiuse"]],
        flavor: {
          B: "Le bitte monumentali con lo stemma imperiale del dazio fluviale.",
          M: "Le valvole delle paratie da cui zampillano colonne di vapore bianco.",
          S: "Le staccionate di ferro battuto che delimitano il canale di scolo a valle.",
          W: "L'acqua trattenuta dalla diga che ribolle in gorghi e schiuma densa."
        },
        intro: [
          ["voce", "La gola di pietra delle Grandi Chiuse si staglia imponente contro il cielo plumbeo."],
          ["voce", "Le paratie d'acciaio sono serrate a doppia mandata: il Doganiere Malacarne, con la sciabola d'ordinanza e il registro dei tributi, controlla ogni natante che osa risalire la corrente."]
        ],
        npcs: (s) => [
          { id: "fa_malacarne", at: s === 0 ? [10, 11] : [8, 8] },
          { id: "fa_roderico", at: [6, 14] },
          ...(s >= 2 ? [{ id: "fa_mirella", at: [22, 11] }] : [{ id: "fa_mirella", at: [18, 16] }])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          // Sentiero delle arcate
          lay(3, 11, 30, 11, ":"); lay(10, 6, 10, 16, ":"); lay(22, 6, 22, 16, ":");
          // Paratie e bitte
          lay(4, 4, 8, 6, "B"); lay(14, 4, 18, 5, "M"); lay(24, 4, 28, 6, "B");
          lay(4, 15, 8, 18, "S"); lay(24, 15, 28, 18, "S");
          // Ingresso alla Sala Macchine
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "fa_sala_macchine", at: [3, 11] } });
        }
      },

      fa_sala_macchine: {
        region: "chiuse", name: "Sala delle Turbine Idrauliche", short: "Sala Macchine", sub: "Pistoni titanici, ingranaggi di bronzo e odore di lubrificante", bg: "fa_chiuse", time: "giorno",
        w: 32, h: 22, start: [3, 11], items: [[12, 5], [20, 16], [27, 8]],
        areas: [[0, 0, 31, 21, "La sala macchine scavata nella roccia viva dove batte il cuore delle chiuse"]],
        flavor: {
          M: "I grandi manometri a mercurio che pulsano al ritmo dell'acqua in pressione.",
          C: "Cilindri di ricambio e ingranaggi per le chiuse a cremagliera.",
          S: "Ringhiere di sicurezza sospese sui condotti sotterranei delle turbine."
        },
        npcs: (s) => [
          { id: "fa_silvia", at: [16, 11] },
          ...(s >= 2 ? [{ id: "fa_vanni", at: [22, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(6, 5, 9, 7, "M"); lay(22, 5, 25, 7, "C"); lay(6, 15, 9, 17, "S"); lay(22, 15, 25, 17, "M");
          // Uscita verso l'esterno delle chiuse
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "fa_chiuse", at: [29, 11] } });
        }
      }
    };

    const talk = {
      fa_malacarne: (K) => {
        const s = S();
        if (s === 0) {
          say("Doganiere Malacarne", "ALT! Nessun battello supera le Grandi Chiuse senza vidimazione della Cancelleria Daziaria!");
          say("Doganiere Malacarne", "Conosco quel vecchio rottame del Nautilus di Latta. Roderico pensa di passare impunito come trent'anni fa?");
          say("Capitan Roderico", "Malacarne! Sei sempre il solito burocrate dal cuore di selce. Questo ragazzo è un maestro del rinvio, non un contrabbandiere!");
          say("Doganiere Malacarne", "Se vuoi che prenda in considerazione una deroga e la sfida sportiva, l'ingegnera Silvia deve sistemare il flusso delle turbine.");
          K.bond("reputazione", 5);
          setStep(N, 1);
          done();
        } else if (s === 3) {
          say("Doganiere Malacarne", "Molto bene. La pressione è ristabilita e il campo d'argine è allestito sulle paratie.");
          say("Doganiere Malacarne", "Se batti la Guardia Doganale, le chiuse si apriranno all'istante con tutti gli onori di legge!");
          ask("Inizia la sfida alle Grandi Chiuse?", [
            {
              t: "Sfida la Guardia Doganale!",
              fn: () => {
                K.ownMatch(window.__corrente.start, {
                  opp: "Guardia del Dazio Fluviale",
                  done: (res) => {
                    if (res.win) {
                      say("Doganiere Malacarne", "PER MILLE PARATIE! Che traiettoria a vortice! Il pallone ha piegato la corrente sfiorando le briglie d'acciaio!");
                      say("Doganiere Malacarne", "Un ufficiale d'onore mantiene la parola: guardie, alzate le paratie! Il Nautilus ha diritto di passo verso il Delta!");
                      say("Silvia dei Mulini", "I pistoni rispondono! Il canale è libero e l'acqua argentea scorre magnifica verso valle!");
                      fin("ok");
                    } else {
                      say("Doganiere Malacarne", "Le briglie delle chiuse non cedono a tiri sbilanciati! Riorganizza la Carovana e riprova!");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Un istante di concentrazione.",
              fn: () => {
                say("Doganiere Malacarne", "Non abbiamo tutto il giorno: la marea non aspetta i titubanti.");
                done();
              }
            }
          ]);
        } else {
          say("Doganiere Malacarne", "Le paratie restano chiuse finché non avrai consultato Silvia e Mirella per i rilievi tecnici.");
          done();
        }
      },

      fa_silvia: (K) => {
        const s = S();
        if (s === 1) {
          say("Silvia dei Mulini", "Meno male che siete arrivati! I condotti della terza turbina erano intasati da detriti e tronchi d'argine.");
          say("Silvia dei Mulini", "Prendi questa Chiave Idraulica delle Paratie: l'ho forgiata con il bronzo delle vecchie pale del mulino.");
          K.evidence("chiave_paratie", { t: "Chiave delle Paratie", d: "Chiave in bronzo idraulico per azionare i contrappesi delle chiuse.", icon: "🗝️" });
          K.giveClue("chiave_paratie");
          K.bond("idrologia", 10);
          say("Silvia dei Mulini", "Ora parla con Mirella all'esterno: conosce la pendenza esatta del dislivello d'acqua.");
          setStep(N, 2);
          done();
        } else {
          say("Silvia dei Mulini", "I pistoni a vapore sono caldi. Se colpisci di controbalzo sulle paratie, la sfera acquista un effetto micidiale!");
          done();
        }
      },

      fa_mirella: (K) => {
        const s = S();
        if (s === 2) {
          say("Mirella la Cartografa", "Ho studiato il moto del dislivello! Alle chiuse la risacca raddoppia la velocità del tiro rasoterra.");
          say("Mirella la Cartografa", "Se usi il tocco d'argine (Z) farai rimbalzare la sfera sulle paratie spiazzando il portiere doganale.");
          K.bond("intesa", 10);
          say("Mirella la Cartografa", "Raggiungi il Doganiere Malacarne: la Carovana è pronta a prendersi il passo del fiume!");
          setStep(N, 3);
          done();
        } else {
          say("Mirella la Cartografa", "Tutto è calcolato: il vento contrario compenserà la spinta dell'acqua.");
          done();
        }
      },

      fa_roderico: (K) => {
        say("Capitan Roderico", "Queste chiuse furono progettate dal mio vecchio maestro d'armi. Superarle significa entrare nella leggenda dei marinai d'acqua dolce!");
        done();
      }
    };

    return {
      n: N,
      title: "La Stretta delle Grandi Chiuse",
      sub: "Il confronto con la Guardia Doganale",
      goal,
      start: "fa_chiuse",
      introBg: "fa_chiuse",
      zones,
      talk
    };
  }

  boot();
})();
