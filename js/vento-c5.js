// js/vento-c5.js - LA VALLE DEL VENTO GENTILE · Capitolo 5 (Dossier Incompiuto)
// La grande partita notturna sul Prato dei Soffi contro la Tormenta.
// Mara, Eliseo e gli artigiani di Mulinella giocano per accordare il vento con la terra.
(function () {
  "use strict";
  function boot() {
    const V = window.__vento;
    if (!V || !V.addChapter) return setTimeout(boot, 100);
    V.addChapter(chapter5);
  }

  function chapter5(K) {
    const N = 5, S = () => K.stepOf(N);
    const { setStep } = K;

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    K.lore("l_mara_armonia", {
      t: "L'Armonia dei Mulini",
      d: "A Mulinella il calcio e il vento sono la stessa lingua: passare la palla al compagno è come cedere la corrente alla pala successiva, senza trattenerla mai per sé."
    });

    const goal = (s) => ({
      0: "Raggiungi il centro del Prato dei Soffi (a est) e parla con il Campanaro Eliseo.",
      1: "Schiera la squadra di Mulinella e affronta gli Spiriti della Tormenta.",
      2: "Raggiungi il ceppo antico e decidi l'accordo finale tra la valle e il vento."
    }[s] || "Dossier concluso! Rigioca o scopri entrambi i finali di Mara.");

    const zones = {
      ve_pratodossier: {
        region: "valle",
        name: "Il Prato dei Soffi · Notte della Tormenta",
        short: "Prato Soffi",
        sub: "Erba piegata da folate argentee e fari della valle accesi",
        bg: "ve_prato",
        time: "notte",
        w: 32, h: 22, start: [4, 11], items: [[16, 5], [26, 17]],
        areas: [[0, 0, 31, 21, "Il campo verde dove gli spiriti e gli umani giocano a calcio sotto le stelle"]],
        flavor: {
          M: "Le porte di legno grezzo sferzate dal vento.",
          O: "L'altarino dei Soffi illuminato da lucciole dorate."
        },
        intro: [
          ["ve_mara", "Mezzanotte. Il vento dal colle soffia verso il basso con una furia maestosa."],
          ["ve_eliseo", "I Soffi selvatici della tormenta hanno occupato la metà campo avversaria! Per calmarli non servono muri: dobbiamo giocare la partita della vita!"]
        ],
        npcs: (s) => [
          { id: "ve_eliseo", at: [8, 11] },
          { id: "ve_gualdo", at: [14, 11] },
          { id: "ve_soffio", at: [22, 11] }
        ],
        build(L) {
          const { lay } = L;
          lay(0, 0, 31, 0, "o"); lay(0, 0, 0, 21, "o"); lay(31, 0, 31, 21, "o"); lay(0, 21, 31, 21, "o");
          lay(1, 1, 30, 20, ".");
          lay(3, 11, 29, 11, ":");
          lay(10, 5, 14, 7, "M"); lay(18, 15, 22, 17, "O");
        }
      }
    };

    const talk = {
      ve_eliseo(K) {
        if (S() === 0) {
          say("ve_eliseo", "Mara, prendi la fascia da capitano. Tu conosci la parabola che inganna la raffica: io copro la difesa insieme a Mastro Gualdo.");
          say("ve_mara", "Guardate quegli spiriti in attacco: sono veloci come saette. Ma se facciamo girare la palla di prima intenzione, il loro impeto svanirà.");
          ask("Dai il fischio d'inizio alla sfida:", [
            {
              t: "«In campo! Giochiamo con il vento, non contro di esso!»",
              big: true,
              fn: () => {
                setStep(N, 1);
                say("ve_eliseo", "La campana suona il primo tempo! Palla a Mara!");
                done();
              }
            }
          ]);
          return;
        }
        say("ve_eliseo", "Difesa salda come le mura della torre! Palla avanti verso il ceppo antico!");
        done();
      },

      ve_gualdo(K) {
        if (S() === 1) {
          say("ve_gualdo", "Mara! Gli Spiriti della Tormenta ci pressano sulla trequarti! Lanciamo il contropiede armonico!");
          ask("Avvia la partita decisiva:", [
            {
              t: "«Partita: La Danza della Tormenta»",
              big: true,
              fn: () => {
                K.playMatch({
                  title: "La Danza della Tormenta",
                  chap: "Dossier Vento · Cap. 5",
                  intro: "Mara e gli artigiani di Mulinella sfidano le folate sul prato.",
                  alt: "ve_tormenta_spiriti",
                  oppNames: ["Raffica Bianca", "Vortice Freddo", "Tormenta", "Libeccio", "Bora"],
                  min: 30,
                  done: (r) => {
                    setStep(N, 2);
                    say("ve_mara", "«La rete si è gonfiata come una vela gonfia di gioia! La tempesta si è placata!»");
                    done();
                  }
                });
              }
            }
          ]);
          return;
        }
        say("ve_gualdo", "Che triangolazione magnifica! Neanche mio nonno con la pialla sapeva calibrare una traiettoria così liscia.");
        done();
      },

      ve_soffio(K) {
        if (S() < 2) {
          say("ve_soffio", "Fffff! (Lo spirito volteggia nell'aria aspettando il passaggio)");
          done();
          return;
        }
        say("ve_soffio", "Fff-ff-fiii! (I Soffi si posano sulle spalle di Mara in cerchio, offrendole una sciarpa dorata fatta di brezze mattutine)");
        say("ve_mara", "L'alba sta sorgendo dietro il Colle del Vento. È giunto il momento di scegliere il destino di Mulinella.");
        ask("Il bivio finale di Mara:", [
          {
            t: "Finale «Il Canto dell'Antico Mulino»: custodisci la tradizione millenaria e il patto segreto con i Soffi",
            big: true,
            fn: () => {
              K.finishChapter(N, "vento_custode");
              K.end("vento_custode");
              // Sblocco carte
              if (window.__sogni && typeof window.__sogni.unlockCard === "function") {
                window.__sogni.unlockCard("ve_mara");
                window.__sogni.unlockCard("ve_eliseo");
              }
              const msg = K.reward("ve_c5_dossier", { coins: 300 });
              say("voce", `<b>DOSSIER CONCLUSO: IL CANTO DELL'ANTICO MULINO!</b> ${msg.join(" · ")}<br>Hai sbloccato la <b>Carta Epica «Mara la Custode»</b> e la <b>Carta Rara «Campanaro Eliseo»</b> nella Squadra dei Sogni!`);
              K.scene(flush(), () => {
                K.openMain();
              }, "ve_valle");
            }
          },
          {
            t: "Finale «La Rete dell'Aurora»: sincronizza tutta la vallata e apri i mulini al commercio libero e gioioso",
            big: true,
            fn: () => {
              K.finishChapter(N, "vento_rinascita");
              K.end("vento_rinascita");
              // Sblocco carte
              if (window.__sogni && typeof window.__sogni.unlockCard === "function") {
                window.__sogni.unlockCard("ve_mara");
                window.__sogni.unlockCard("ve_eliseo");
              }
              const msg = K.reward("ve_c5_dossier", { coins: 300 });
              say("voce", `<b>DOSSIER CONCLUSO: LA RETE DELL'AURORA!</b> ${msg.join(" · ")}<br>Hai sbloccato la <b>Carta Epica «Mara la Custode»</b> e la <b>Carta Rara «Campanaro Eliseo»</b> nella Squadra dei Sogni!`);
              K.scene(flush(), () => {
                K.openMain();
              }, "ve_valle");
            }
          }
        ]);
      }
    };

    const chapterDef = {
      n: N,
      title: "Il Vento di Mezzanotte",
      sub: "Dossier Incompiuto: la partita decisiva per il destino di Mulinella",
      avatar: {
        name: "Mara",
        num: 7,
        cast: {
          name: "Mara",
          sub: "Custode dell'Antico Mulino",
          style: "ponytail",
          hair: "#78350f",
          eye: "#15803d",
          skin: "#fed7aa",
          shirt: "#166534"
        }
      },
      start: "ve_pratodossier",
      zones,
      talk,
      goal,
      introBg: "ve_prato",
      intro: () => [
        ["ve_mara", "Sotto le stelle di Mulinella, le porte di legno aspettano il calcio d'inizio."],
        ["ve_mara", "Non giochiamo per una coppa né per il denaro: giochiamo perché questa valle continui a respirare."],
        ["ve_mara", "Passaggio filtrante al centro... e che il vento faccia il resto!"]
      ]
    };

    return chapterDef;
  }

  boot();
})();
