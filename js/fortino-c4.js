// js/fortino-c4.js - «COLPO AL FORTINO» · Capitolo 4 (Dossier Incompiuto)
// Prospettiva ribaltata: nei panni del Colonnello Vane.
// Mentre la squadra del Campione si infiltrava dai condotti nel Capitolo 1-3,
// nella Sala Operativa Blindata il Colonnello scopre il piano omicida del Presidente Valori.
(function () {
  "use strict";
  function boot() {
    const D = window.__fortino;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter4);
  }

  function chapter4(K) {
    const N = 4, S = () => K.stepOf(N);
    const { setStep, quest } = K;

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    K.lore("l_vane_giuramento", {
      t: "Il Giuramento del Colonnello Vane",
      d: "Per trent'anni Vane ha difeso lo Stadio Metropolitano convinto che la legge fosse al servizio del gioco. Davanti ai monitor di sicurezza scopre che il Presidente Valori vuole allagare i condotti con il gas refrigerante per eliminare i ladri gentiluomini e intascare l'assicurazione."
    });

    const goal = (s) => ({
      0: "Ispeziona il banco di controllo principale e parla con Tobia lo Staffiere.",
      1: "Raggiungi la centrale dei generatori (a ovest) e confrontati con l'Ingegnere Serra.",
      2: "Intercetta la frequenza privata del Presidente Valori alla trasmittente centrale.",
      3: "Prendi posizione: rompi il giuramento formale e prepara la resistenza."
    }[s] || "Dossier avviato. Procedi verso il Capitolo 5!");

    const zones = {
      fo_centrale: {
        region: "condotti",
        name: "Sala Operativa Blindata · Livello -1",
        short: "Centrale",
        sub: "Banchi sinottici luminosi, monitor CRT e relè ad alta tensione",
        bg: "fo_caveau",
        time: "notte",
        w: 30, h: 20, start: [5, 10], items: [[14, 4], [24, 15]],
        areas: [[0, 0, 29, 19, "Il cuore della sorveglianza dello Stadio Metropolitano"]],
        flavor: {
          a: "Pannelli d'acciaio spazzolato con spie verdi e rosse.",
          T: "Terminale crittografato della presidenza.",
          L: "Sensore di pressione delle paratie stagne.",
          C: "Interruttore generale delle valvole di ventilazione.",
          P: "Console di monitoraggio del campo e delle tribune."
        },
        intro: [
          ["fo_vane", "Tobia! Chiudi immediatamente quel canale. Perché sul settore C14 abbiamo un calo di tensione del 40%?"],
          ["fo_tobia", "Colonnello... non è un guasto. Qualcuno ha deviato la corrente verso le gabbie dei condotti. E non siamo stati noi!"]
        ],
        npcs: (s) => [
          { id: "fo_tobia", at: [8, 10] },
          { id: "fo_scorta", at: [18, 10] },
          { id: "fo_tecnico", at: [12, 5] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 29, 0, "a"); lay(0, 0, 0, 19, "a"); lay(29, 0, 29, 19, "a"); lay(0, 19, 29, 19, "a");
          lay(1, 1, 28, 18, ".");
          lay(4, 8, 12, 12, ":"); lay(16, 8, 24, 12, ":");
          lay(6, 4, 10, 5, "T"); lay(18, 4, 22, 5, "C");
          lay(6, 15, 10, 16, "P"); lay(18, 15, 22, 16, "L");
          house(29, 9, 1, 3, { door: [29, 10], enter: { to: "fo_turbina", at: [3, 10] } });
        }
      },

      fo_turbina: {
        region: "caveau",
        name: "Sotterranei della Turbina · Livello -3",
        short: "Turbina",
        sub: "Cilindri titanici a vapore e condotte di refrigerazione forzata",
        bg: "fo_tetti",
        time: "notte",
        w: 28, h: 20, start: [3, 10], items: [[20, 8]],
        areas: [[0, 0, 27, 19, "I motori ausiliari che alimentano le difese dello stadio"]],
        flavor: {
          a: "Condutture di ghisa incandescenti.",
          T: "Quadro comandi delle valvole d'azoto liquido.",
          C: "Generatore diesel di emergenza."
        },
        intro: [
          ["fo_vane", "L'aria qui sotto odora di combustibile e ozono."],
          ["fo_vane", "Valori ha ordinato la pressurizzazione dei condotti. Se apro quelle valvole, chiunque sia nei tubi non avrà scampo."]
        ],
        npcs: (s) => [
          { id: "fo_tecnico", at: [14, 10] },
          { id: "fo_scorta", at: [22, 10] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 27, 0, "a"); lay(0, 0, 0, 19, "a"); lay(27, 0, 27, 19, "a"); lay(0, 19, 27, 19, "a");
          lay(1, 1, 26, 18, ".");
          lay(3, 10, 25, 10, ":");
          lay(8, 5, 12, 7, "C"); lay(16, 13, 20, 15, "T");
          house(1, 9, 1, 3, { door: [1, 10], enter: { to: "fo_centrale", at: [27, 10] } });
        }
      }
    };

    const talk = {
      fo_tobia(K) {
        if (S() === 0) {
          say("fo_tobia", "Colonnello Vane! Ho agganciato la linea del Presidente. Diceva: «Non importa se sono ragazzini o ladri, saturate le condotte e sigillate le botole».");
          say("fo_vane", "Valori ha oltrepassato ogni limite. Noi siamo guardiani dello stadio, non boia di un consiglio d'amministrazione.");
          say("fo_tobia", "Cosa facciamo signore? Se stacco i fusibili, la presidenza ci dichiarerà ammutinati!");
          ask("La risposta del Colonnello:", [
            {
              t: "«Stacca i fusibili. Mi assumo io ogni responsabilità penale e morale.»",
              big: true,
              fn: () => {
                K.bond("furtivita", 15);
                setStep(N, 1);
                say("fo_tobia", "Subito Comandante! Linea secondaria deviata. Ora andate dall'Ingegnere Serra nei sotterranei della turbina!");
                done();
              }
            },
            {
              t: "«Calma Tobia. Raccogliamo prima le prove digitali dai registri di Serra.»",
              big: false,
              fn: () => {
                K.bond("grimaldelli", 10);
                setStep(N, 1);
                say("fo_tobia", "Saggio piano. Serra è giù alla turbina: vi darà il nastro magnetico dei log!");
                done();
              }
            }
          ]);
          return;
        }
        say("fo_tobia", "I monitor segnano ancora la finale: 1-1 al 90° minuto. Dobbiamo sbrigarci prima che scada il recupero!");
        done();
      },

      fo_scorta(K) {
        if (S() < 2) {
          say("fo_scorta", "Colonnello, sono trent'anni che pattugliamo questi corridoi insieme. Se lei dice che Valori è un delinquente, i miei uomini non muoveranno un dito contro i ragazzi nei condotti.");
          done();
          return;
        }
        say("fo_scorta", "Ho disposto tre sentinelle fidate all'uscita delle gradinate. Qualunque cosa accada, nessuno toccherà i tifosi.");
        done();
      },

      fo_tecnico(K) {
        if (S() === 1) {
          say("fo_tecnico", "Colonnello Vane! Guardi questo schema: Valori ha installato un telecomando remoto sulla pompa di scarico. Voleva simulare un incendio per svuotare il caveau.");
          say("fo_vane", "Dammi la chiave d'arresto manuale, Serra. Da questo momento il comando dello stadio torna nelle mani di chi ha sudato per costruirlo.");
          say("fo_tecnico", "Ecco la chiave maestra! Ora andate alla trasmittente centrale: c'è un messaggio cifrato in arrivo da Valori.");
          setStep(N, 2);
          done();
          return;
        }
        if (S() === 2) {
          say("fo_tecnico", "La trasmittente alla console centrale sta lampeggiando: ascoltate cosa ha il coraggio di dire.");
          done();
          return;
        }
        say("fo_tecnico", "Generatore bloccato a regime minimo. La trappola di Valori è disinnescata!");
        done();
      }
    };

    const patch = {
      fo_centrale: {
        act: {
          T: "Ascolta la frequenza radio presidenziale"
        }
      }
    };

    const chapterDef = {
      n: N,
      title: "Il Giuramento Spezzato",
      sub: "Dossier Incompiuto: il Colonnello Vane scopre il sabotaggio di Valori",
      avatar: {
        name: "Colonnello Vane",
        num: 4,
        cast: {
          name: "Colonnello Vane",
          sub: "Comandante della Sicurezza",
          style: "buzz",
          hair: "#94a3b8",
          eye: "#0284c7",
          skin: "#e0ac7e",
          shirt: "#0f172a",
          beard: "baffi",
          acc: ["berretto"]
        }
      },
      start: "fo_centrale",
      zones,
      talk,
      patch,
      goal,
      introBg: "fo_caveau",
      intro: () => [
        ["fo_vane", "35 anni con questa divisa addosso. Ho visto campioni alzare coppe e operai piangere sugli spalti."],
        ["fo_vane", "Oggi scopro che il mio datore di lavoro è pronto a soffocare lo stadio intero per un assegno milionario."],
        ["fo_vane", "Un soldato obbedisce agli ordini. Un uomo d'onore difende ciò che è giusto. È ora di scegliere."]
      ]
    };

    // Interazione con la console radio (step 2 -> step 3)
    const prevHook = window.trTalkHook;
    window.trTalkHook = function (id) {
      if (id === "T" && K.inZone("fo_centrale") && S() === 2) {
        say("voce", "La radiolina gracchiante emette la voce concitata di Valori:");
        say("fo_boss", "«Vane! Rispondi idiota! Perché i condotti sono ancora aperti?! Elimina quegli intrusi e raggiungimi sul tetto con i registri contabili!»");
        say("fo_vane", "«Signor Presidente... i registri resteranno qui. E i ragazzi nei condotti usciranno a testa alta. Consideri il mio servizio concluso.»");
        ask("Il bivio finale del Colonnello:", [
          {
            t: "«Serrate le paratie blindate! Difendiamo lo stadio e la finale fino all'ultimo respiro!»",
            big: true,
            fn: () => {
              setStep(N, 3);
              K.bond("furtivita", 20);
              say("fo_vane", "«Tobia, Rinaldi: preparate i blocchi di sicurezza. Si sale ai bastioni per la resa dei conti!»");
              K.finishChapter(N, "dossier_c4_onore");
              K.reward("fo_c4_dossier", { coins: 180 });
              K.scene(flush(), () => {
                K.openMain();
              }, "fo_caveau");
            }
          },
          {
            t: "«Scortiamo prima gli staffieri fuori dai condotti verso la Curva Sud!»",
            big: true,
            fn: () => {
              setStep(N, 3);
              K.bond("grimaldelli", 20);
              say("fo_vane", "«Nessun ragazzo rischierà la vita stanotte. Prima portiamo in salvo i giovani, poi affronteremo Valori.»");
              K.finishChapter(N, "dossier_c4_redenzione");
              K.reward("fo_c4_dossier", { coins: 180 });
              K.scene(flush(), () => {
                K.openMain();
              }, "fo_caveau");
            }
          }
        ]);
        return true;
      }
      return typeof prevHook === "function" ? prevHook(id) : null;
    };

    return chapterDef;
  }

  boot();
})();
