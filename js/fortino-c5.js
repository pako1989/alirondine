// js/fortino-c5.js - «COLPO AL FORTINO» · Capitolo 5 (Dossier Incompiuto)
// La resa dei conti sul Bastione Nord. Vane, Tobia e la scorta ribelle affrontano
// Valori prima del decollo, decidendo il destino della squadra e della propria vita.
(function () {
  "use strict";
  function boot() {
    const D = window.__fortino;
    if (!D || !D.addChapter) return setTimeout(boot, 100);
    D.addChapter(chapter5);
  }

  function chapter5(K) {
    const N = 5, S = () => K.stepOf(N);
    const { setStep, quest } = K;

    let QL = [];
    const say = (who, txt) => { QL.push([who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => {
      const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn })));
      if (l.length) K.say(l, go); else go();
    };

    K.lore("l_vane_leggenda", {
      t: "L'Eredità del Colonnello",
      d: "Quando il recupero è scaduto e i riflettori si sono spenti, Vane non era più il capo stipendiato di una società corrotta: era diventato il simbolo che chi difende il campo con lealtà non perde mai la propria dignità."
    });

    const goal = (s) => ({
      0: "Raggiungi la sommità del Bastione Nord (a est) e confrontati con Loris la Volpe.",
      1: "Schiera i veterani e affronta la guardia privata di Valori nel duello decisivo.",
      2: "Sali alla piazzola d'atterraggio e decidi la sorte finale del Presidente Valori."
    }[s] || "Dossier concluso! Rigioca o scopri entrambi i finali del Colonnello.");

    const zones = {
      fo_bastione: {
        region: "tetti",
        name: "Bastione Nord · Terrazza Panoramica",
        short: "Bastione Nord",
        sub: "Spalti bui a picco sul terreno di gioco e vento di tempesta",
        bg: "fo_tetti",
        time: "notte",
        w: 32, h: 22, start: [4, 10], items: [[16, 6], [26, 16]],
        areas: [[0, 0, 31, 21, "Il contrafforte più alto dello stadio: da qui si domina tutta la metropoli"]],
        flavor: {
          a: "Muri merlati in cemento armato e ringhiere arrugginite.",
          T: "Riflettore ausiliario d'atterraggio.",
          F: "Sirena d'evacuazione silenziosa.",
          L: "Cavi di discesa rapida verso il campo."
        },
        intro: [
          ["fo_vane", "Il fischietto dell'arbitro giù sul campo ha appena fischiato la fine. I cori salgono come un'onda calda."],
          ["fo_tobia", "Colonnello! Guardate lassù: l'elicottero di Valori non può decollare, Loris ha manomesso il serbatoio!"]
        ],
        npcs: (s) => [
          { id: "fo_lupin", at: [10, 10] },
          { id: "fo_tobia", at: [6, 10] },
          { id: "fo_scorta", at: [14, 10] },
          { id: "fo_boss", at: [26, 10] }
        ],
        build(L) {
          const { lay } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(3, 10, 29, 10, ":");
          lay(8, 4, 12, 6, "T"); lay(20, 4, 24, 6, "F");
          lay(8, 15, 12, 17, "L"); lay(20, 15, 24, 17, "a");
        }
      }
    };

    const talk = {
      fo_lupin(K) {
        if (S() === 0) {
          say("fo_lupin", "Colonnello Vane! Chi l'avrebbe mai detto... guardia e ladro fianco a fianco sopra la traversa dello stadio.");
          say("fo_vane", "Non farti illusioni, Volpe. Se avessi toccato il trofeo per rivenderlo ti avrei già ammanettato.");
          say("fo_lupin", "E invece siamo qui entrambi per difendere qualcosa che vale più dell'oro: la memoria di questa curva. Valori ha schierato i suoi scagnozzi privati per farsi largo.");
          ask("La strategia di Vane:", [
            {
              t: "«Rinaldi, Tobia: stringiamo la linea a catenaccio. Non lasceremo passare nessuno!»",
              big: true,
              fn: () => {
                setStep(N, 1);
                say("fo_vane", "«Formazione difensiva compatta! Affrontiamo i mercenari sul campo del bastione!»");
                done();
              }
            }
          ]);
          return;
        }
        say("fo_lupin", "La via è libera verso Valori. È il vostro momento, Colonnello: andate a chiedergli il conto.");
        done();
      },

      fo_scorta(K) {
        if (S() === 1) {
          say("fo_scorta", "Comandante! La guardia privata di Valori sta avanzando. Diamo loro una lezione di vero calcio d'altri tempi!");
          ask("Avvia lo scontro decisivo:", [
            {
              t: "«In campo! Per la Rondine e per il Fortino!»",
              big: true,
              fn: () => {
                K.playMatch({
                  title: "Resa dei Conti sul Bastione",
                  chap: "Dossier Fortino · Cap. 5",
                  intro: "Vane e la guardia ribelle affrontano i mercenari della presidenza.",
                  alt: "fo_vane_guardie",
                  oppNames: ["Mercenario 1", "Mercenario 2", "Guardia d'Assalto", "Mastino", "Sicario"],
                  min: 30,
                  done: (r) => {
                    setStep(N, 2);
                    say("fo_vane", "«Linea nemica spezzata! Ora tocca a Valori.»");
                    done();
                  }
                });
              }
            }
          ]);
          return;
        }
        say("fo_scorta", "Tutti i corridoi d'accesso sono presidiati dai nostri. Nessun mercenario lascerà lo stadio.");
        done();
      },

      fo_tobia(K) {
        say("fo_tobia", "Colonnello, la sirena della vittoria sta suonando in tutta la città! Il popolo festeggia il trofeo delle Rondini!");
        done();
      },

      fo_boss(K) {
        if (S() < 2) {
          say("fo_boss", "Vane! Sei un pazzo fallito! Riconsegna quella chiave o ti farò cancellare da tutti gli almanacchi della federazione!");
          done();
          return;
        }
        say("fo_boss", "«Vane... ascoltami. Ho due milioni di franchi svizzeri nella valigetta. Saliamo sull'elicottero. Diciamo che i ladri hanno bruciato tutto e ce ne andiamo da ricchi.»");
        say("fo_vane", "«I tuoi soldi puzzano di vergogna, Valori. Io resto dove sono sempre stato: tra questa gente.»");
        ask("Il destino finale del Colonnello Vane:", [
          {
            t: "Finale «L'Onore del Colonnello»: consegna Valori alla procura e resta comandante del bastione",
            big: true,
            fn: () => {
              K.finishChapter(N, "colonnello_onore");
              K.end("colonnello_onore");
              // Sblocco carta leggendaria Vane
              if (window.__sogni && typeof window.__sogni.unlockCard === "function") {
                window.__sogni.unlockCard("fo_vane");
              }
              const msg = K.reward("fo_c5_dossier", { coins: 300 });
              say("voce", `<b>DOSSIER CONCLUSO: L'ONORE DEL COLONNELLO!</b> ${msg.join(" · ")}<br>Hai sbloccato la <b>Carta Leggendaria «Colonnello Vane»</b> nella Squadra dei Sogni!`);
              K.scene(flush(), () => {
                K.openMain();
              }, "fo_titolo");
            }
          },
          {
            t: "Finale «L'Ultima Guardia»: scorta i ragazzi fuori, lasci la divisa e ti unisci ai tifosi",
            big: true,
            fn: () => {
              K.finishChapter(N, "colonnello_redenzione");
              K.end("colonnello_redenzione");
              // Sblocco carta leggendaria Vane
              if (window.__sogni && typeof window.__sogni.unlockCard === "function") {
                window.__sogni.unlockCard("fo_vane");
              }
              const msg = K.reward("fo_c5_dossier", { coins: 300 });
              say("voce", `<b>DOSSIER CONCLUSO: L'ULTIMA GUARDIA!</b> ${msg.join(" · ")}<br>Hai sbloccato la <b>Carta Leggendaria «Colonnello Vane»</b> nella Squadra dei Sogni!`);
              K.scene(flush(), () => {
                K.openMain();
              }, "fo_titolo");
            }
          }
        ]);
      }
    };

    const chapterDef = {
      n: N,
      title: "L'Ultima Alba delle Ombre",
      sub: "Dossier Incompiuto: la resa dei conti tra Vane e Valori",
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
      start: "fo_bastione",
      zones,
      talk,
      goal,
      introBg: "fo_tetti",
      intro: () => [
        ["fo_vane", "Bastione Nord. Vento tagliente, pioggia sottile e il boato della curva sotto di noi."],
        ["fo_vane", "Valori è spalle al muro. È il momento di scrivere la parola fine su questa notte."]
      ]
    };

    return chapterDef;
  }

  boot();
})();
