// js/fiume-c1.js - LA CAROVANA DEL FIUME D'ARGENTO · Capitolo 1 «L'Ormeggio al Molo dei Mulini»
// L'arrivo al porto fluviale di Roccabruna, l'ingaggio a bordo del Nautilus di Latta con Capitan Roderico,
// lo studio delle correnti con Mirella e la prima amichevole tra le chiatte per collaudare l'equipaggio.
(function () {
  "use strict";
  function boot() {
    const D = window.__fiume;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest } = K;
    const N = 1, S = () => K.stepOf(N);
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
      const msg = K.reward("fa_c" + N, { coins: 80, cos: "fa_c1" }), lines = flush();
      K.finishChapter(N, ending || "ok");
      if (ending) K.end(ending);
      lines.push(["voce", `<b>FINE DEL CAPITOLO 1.</b> ${msg.join(" · ")}<br>Continua nel Capitolo 2 verso le Grandi Chiuse.`]);
      K.scene(lines, () => K.openMain(), "fa_chiuse");
    };

    K.cos("fa_c1", { kind: "shirt", label: "Camicia di cotone grezzo da timoniere fluviale", val: "#0284c7", from: "Capitolo 1 de La Carovana del Fiume d'Argento" });
    K.lore("l_fiume", { t: "Il Grande Fiume Argenteo", d: "Arteria commerciale navigabile che unisce i feudi dell'interno al Delta dell'Oceano." });
    K.lore("l_corrente", { t: "La Corrente dei Mulini", d: "Flusso d'acqua impetuoso che spinge i natanti verso valle e fa deviare i palloni sui pontili." });

    const goal = (s) => ({
      0: "Sei approdato al Molo dei Mulini. Parla con Capitan Roderico davanti alla passerella del Nautilus.",
      1: "Le correnti verso monte sono insidiose. Consulta Mirella la Cartografa alla tavola nautica.",
      2: "Raggiungi Burlone Vanni sulla Chiatta d'Ormeggio per organizzare la sfida di collaudo.",
      3: "Affronta la partita sulla Chiatta per testare l'intesa prima di salpare verso le Chiuse!"
    }[s] || "Il primo capitolo è completato. Continua con il Capitolo 2.");

    const zones = {
      fa_molo: {
        region: "porto", name: "Molo dei Mulini di Roccabruna", short: "Molo Mulini", sub: "Gomene d'ormeggio, casse di spezie e la sagoma del Nautilus", bg: "fa_molo", time: "giorno",
        w: 32, h: 22, start: [6, 11], items: [[9, 6], [21, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "La banchina in pietra e quercia dove attraccano i battelli a vapore"]],
        flavor: {
          B: "Bitte di bronzo e canapa impregnate di salmastro e pece.",
          C: "Casse di noce moscata e barili di resina pronti per essere stivati sul battello.",
          M: "Le maestose pale idrauliche che macinano il grano sfruttando la corrente del fiume.",
          W: "Le acque argentee del fiume che scorrono rapide verso le grandi anse a valle."
        },
        intro: [
          ["voce", "Molo di Roccabruna, all'alba. Il Grande Fiume Argenteo si estende a perdita d'occhio come un nastro lucido tra colline boscose e chiuse di pietra."],
          ["voce", "Ingaggiato come capitano sportivo della Carovana Fluviale, sali a bordo per condurre l'equipaggio del vecchio 'Nautilus di Latta' attraverso i feudi del dazio."]
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
          // Pontile battuto
          lay(3, 11, 30, 11, ":"); lay(10, 8, 10, 16, ":"); lay(20, 9, 20, 14, ":");
          // Bitte e casse
          lay(4, 4, 8, 6, "B"); lay(14, 4, 18, 5, "C"); lay(22, 4, 26, 6, "B");
          lay(4, 15, 8, 18, "C"); lay(22, 15, 26, 18, "M");
          // Uscita verso la Chiatta d'Ormeggio
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "fa_chiatta", at: [3, 11] } });
        }
      },

      fa_chiatta: {
        region: "porto", name: "La Chiatta Galleggiante", short: "Chiatta", sub: "Assi oscillanti a pelo d'acqua, bitte di sponda e il campo di prova", bg: "fa_chiatta", time: "giorno",
        w: 32, h: 22, start: [3, 11], items: [[10, 5], [20, 16], [23, 7]],
        areas: [[0, 0, 31, 21, "La grande piattaforma galleggiante dove i battellieri disputano le sfide d'argine"]],
        flavor: {
          B: "Bitte d'acciaio che tengono la chiatta ancorata ai piloni del ponte.",
          W: "Il mulinello di risacca che spinge il natante a beccheggiare dolcemente.",
          S: "Gomene elastiche tese tra i parapetti per evitare che il pallone finisca nel gorgo.",
          M: "La ruota del mulino di sponda che alza spruzzi d'acqua fresca sull'area di rigore."
        },
        npcs: (s) => [
          { id: "fa_vanni", at: [16, 11] },
          ...(s >= 3 ? [{ id: "fa_roderico", at: [26, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          // Campo sulla chiatta
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(5, 5, 8, 7, "S"); lay(24, 5, 27, 7, "S"); lay(5, 15, 8, 17, "B"); lay(24, 15, 27, 17, "B");
          // Uscita verso il molo
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "fa_molo", at: [29, 11] } });
        }
      }
    };

    const talk = {
      fa_roderico: (K) => {
        const s = S();
        if (s === 0) {
          say("Capitan Roderico", "Benvenuto a bordo del Nautilus di Latta, ragazzo!");
          say("Capitan Roderico", "Il Grande Fiume Argenteo non è un campo di terraferma: qui l'acqua comanda e la corrente non perdona chi calcia senza fiuto.");
          say("Capitan Roderico", "Dobbiamo risalire fino alle Grandi Chiuse, ma prima dobbiamo verificare che la ciurma sappia passarsi la palla senza scivolare nelle golene.");
          say("Capitan Roderico", "Parla subito con Mirella la Cartografa al banco nautico: ti consegnerà i diagrammi delle correnti e la rotta del convoglio.");
          K.bond("intesa", 5);
          setStep(N, 1);
          done();
        } else if (s === 3) {
          say("Capitan Roderico", "Tutti ai posti di manovra! Vanni e gli scaricatori hanno allestito le sponde sulla chiatta.");
          say("Capitan Roderico", "Mostra a tutti di che pasta è fatto il nostro Campione!");
          ask("Inizia la partita di collaudo sulla Chiatta?", [
            {
              t: "Sfida i Portuali di Roccabruna!",
              fn: () => {
                K.ownMatch(window.__corrente.start, {
                  opp: "Portuali di Roccabruna",
                  done: (res) => {
                    if (res.win) {
                      say("Capitan Roderico", "STRAORDINARIO! Il tuo rinvio ha sfruttato la corrente d'argine come solo i vecchi maestri sanno fare!");
                      say("Mirella la Cartografa", "I rilevamenti sono perfetti: l'intesa è al culmine e i motori a vapore sono a piena pressione.");
                      say("Burlone Vanni", "(ride) Che carambola sulle gomene! Ho quasi perso la fascia in acqua dalla gioia!");
                      fin("ok");
                    } else {
                      say("Capitan Roderico", "Non abbatterti! La corrente oggi tirava forte verso valle. Riprova subito la manovra!");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Un attimo per riordinare la tattica.",
              fn: () => {
                say("Capitan Roderico", "Fai con calma, ragazzo. Il fiume scorre, ma il timone aspetta te.");
                done();
              }
            }
          ]);
        } else {
          say("Capitan Roderico", "Segui le indicazioni della mappa: Mirella e Vanni ti stanno aspettando per completare i preparativi.");
          done();
        }
      },

      fa_mirella: (K) => {
        const s = S();
        if (s === 1) {
          say("Mirella la Cartografa", "Eccoti! Stavo giusto calcolando i vettori d'attrito del pallone sul legno umido.");
          say("Mirella la Cartografa", "Prendi questa Bussola d'Argento: ti indicherà le variazioni di marea tra una sponda e l'altra.");
          quest("bussola", "La Bussola d'Argento", "Ricevuta la bussola idrologica per orientarsi nelle rapide.");
          K.bond("idrologia", 10);
          say("Mirella la Cartografa", "Ora raggiungi Vanni sulla Chiatta d'Ormeggio a est. È un gigante buono, ma quando calcia fa tremare l'intero pontile!");
          setStep(N, 2);
          done();
        } else {
          say("Mirella la Cartografa", "I miei grafici parlano chiaro: più il gioco è veloce, più l'onda di risacca aiuterà le nostre ali a tagliare verso la porta!");
          done();
        }
      },

      fa_vanni: (K) => {
        const s = S();
        if (s === 2) {
          say("Burlone Vanni", "[ride] Ehi là! Finalmente il nostro capitano in seconda!");
          say("Burlone Vanni", "Ho rinforzato le bitte della chiatta con gomene nuove. Quando colpisci rasoterra la palla schizza via che è una bellezza!");
          K.bond("intesa", 10);
          say("Burlone Vanni", "Torna da Capitan Roderico per dare il fischio d'inizio della nostra prima partita!");
          setStep(N, 3);
          done();
        } else if (s === 3) {
          say("Burlone Vanni", "Io sono schierato in difesa: tu pensa solo a mirare ai legni della porta galleggiante!");
          done();
        } else {
          say("Burlone Vanni", "Che giornata magnifica per sfidare le onde del fiume!");
          done();
        }
      }
    };

    return {
      n: N,
      title: "L'Ormeggio al Molo dei Mulini",
      sub: "L'ingaggio della Carovana Fluviale a Roccabruna",
      goal,
      start: "fa_molo",
      introBg: "fa_titolo",
      zones,
      talk
    };
  }

  boot();
})();
