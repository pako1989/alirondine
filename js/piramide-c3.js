// js/piramide-c3.js - LA PIRAMIDE DEL SOLE · Capitolo 3 «L'Eclissi del Serpente Piumato · L'Ultimo Rito»
// Ascesa alla sommità della piramide a gradoni, il rituale solare dell'eclissi,
// l'ultima grande sfida all'Anello di Pietra e la quadrupla biforcazione verso i 4 finali.
(function () {
  "use strict";
  function boot() {
    const D = window.__piramide;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    if (!D._has || !D._has(2)) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest } = K;
    const N = 3, S = () => K.stepOf(N);
    // adattatori al kit di saga-core: le battute si accumulano e partono insieme (nome → id del personaggio)
    const WHO = { "Prof. Alvarez": "my_alvarez", "Ixchel": "my_ixchel", "Diego": "my_diego", "Capitano Vargas": "my_vargas", "Guardiano Kukulkan": "my_kukulkan" };
    let QL = [];
    const say = (who, txt) => { QL.push([WHO[who] || who, txt]); };
    const flush = () => { const l = QL; QL = []; return l; };
    const done = () => { const l = flush(); if (l.length) K.say(l, K.done); else K.done(); };
    const ask = (prompt, opts) => { const l = flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.t || o.label, big: o.big, fn: o.fn }))); if (l.length) K.say(l, go); else go(); };
    const questDone = (id) => K.questDone(id), stat = (k, v) => K.bond(k, v);
    const fin = (ending) => {
      const msg = K.reward("my_c" + N, { coins: 70 + N * 20, cos: "my_c" + N }), lines = flush();
      K.finishChapter(N, ending || "ok"); if (ending) K.end(ending);
      lines.push(["voce", `<b>${N < 3 ? "FINE DEL CAPITOLO " + N : "FINE DELLA STORIA"}.</b> ${msg.join(" · ")}${N < 3 ? "<br>Continua nel capitolo " + (N + 1) + "." : "<br>Gli altri finali ti aspettano nel Diario."}`]);
      K.scene(lines, () => K.openMain(), "my_sommita");
    };

    K.cos("my_c3", { kind: "shirt", label: "Mantello dorato dell'Atleta del Sole", val: "#fbbf24", from: "Capitolo 3 de La Piramide del Sole" });

    const goal = (s) => ({
      0: "Sei sulla Sommità della Piramide del Sole. Parla con il Professor Alvarez vicino all'altare solare.",
      1: "L'eclissi solare sta per iniziare! Parla con Ixchel per preparare il rito dell'Anello Supremo.",
      2: "Il Guardiano Kukulkan riappare nella luce dorata. Affronta l'ultima leggendaria partita di Pok-ta-pok!",
      3: "La piramide vibra e si apre il portale del destino! Scegli quale lascito donare al mondo."
    }[s] || "La saga de La Piramide del Sole è conclusa!");

    const zones = {
      my_sommita: {
        region: "rovine", name: "Sommità della Piramide del Sole", short: "Sommità", sub: "La terrazza sacra tra le nuvole che domina l'infinita foresta pluviale", bg: "my_sommita", time: "giorno",
        w: 32, h: 22, start: [6, 11], items: [[6, 6], [26, 6], [16, 17]],
        areas: [[0, 0, 31, 21, "La terrazza del tempio sommitale a cento metri sopra la volta della giungla"]],
        flavor: {
          A: "L'Altare Solare in pietra basaltica con incisioni del serpente piumato che divora la luna.",
          Q: "L'Anello Supremo del Quetzal forgiato in lega d'oro e rame, sospeso su due piloni monumentali.",
          V: "Il panorama vertiginoso: chilometri di foresta verde smeraldo punteggiata da lagune turchesi.",
          s: "La ripida scalinata che ridiscende verso il Cenote Sacro e il Cortile Cerimoniale."
        },
        intro: [
          ["voce", "Raggiunta la vetta della piramide, una brezza tiepida e purissima accoglie la spedizione. Il cielo dello Yucatán si tinge di porpora e cobalto mentre la luna comincia a lambire il disco del sole."],
          ["voce", "Al centro della sommità troneggia l'Anello Supremo del Quetzal: l'ultima meta, dove leggenda vuole che gli atleti del sole decidessero il destino delle dinastie."]
        ],
        npcs: (s) => [
          { id: "my_alvarez", at: [10, 11] },
          { id: "my_ixchel", at: [14, 11] },
          ...(s >= 2 ? [{ id: "my_kukulkan", at: [24, 11] }] : [])
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(4, 11, 27, 11, ":"); lay(16, 5, 16, 17, ":");
          lay(15, 9, 17, 13, "A"); lay(22, 6, 24, 7, "Q");
          house(0, 10, 1, 3, { door: [0, 11], enter: { to: "my_cenote", at: [28, 11] } });
        }
      },

      my_cenote: {
        region: "giungla", name: "Cenote Sacro delle Acque Chiare", short: "Cenote", sub: "Grotta carsica naturale con lago turchese sotterraneo e radici aeree", bg: "my_cenote", time: "notte",
        w: 32, h: 22, start: [4, 11], items: [[12, 6], [22, 14], [16, 18]],
        areas: [[0, 0, 31, 21, "Lo spettacolare specchio d'acqua sorgiva circondato da pareti di stalattiti calcaree"]],
        flavor: {
          W: "L'acqua turchese limpidissima che riflette i fasci di luce solare calanti dalle aperture della volta.",
          Z: "La zattera in tronchi di balsa e liane pronta per navigare i canali sotterranei verso il mare.",
          s: "La galleria che riconduce verso la Sommità della Piramide e la Camera del Tesoro."
        },
        npcs: (s) => [
          { id: "my_diego", at: [10, 11] }
        ],
        build(L) {
          const { lay, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 1, 30, 20, ".");
          lay(2, 11, 29, 11, ":"); lay(16, 6, 16, 16, ":");
          lay(14, 12, 18, 14, "Z");
          house(31, 10, 1, 3, { door: [31, 11], enter: { to: "my_sommita", at: [3, 11] } });
        }
      }
    };

    const talk = {
      my_alvarez(K) {
        const s = S();
        if (s === 0) {
          say("Prof. Alvarez", "Guarda l'orizzonte, ragazzo mio! L'eclissi totale di sole comincerà tra pochi istanti.");
          say("Prof. Alvarez", "Le cronache tolteche dicono che durante l'oscuramento della stella madre, la palla di caucciù acquista la leggerezza di una cometa.");
          say("Prof. Alvarez", "Parla con Ixchel per comprendere l'antico posizionamento rituale prima che Kukulkan scenda dall'altare!");
          setStep(N, 1);
          quest("my_q3_1", "L'Allineamento Solare", "Parla con Ixchel sulla Sommità per preparare il rito dell'Anello Supremo.");
          done();
        } else if (s === 1) {
          say("Prof. Alvarez", "L'ombra della luna sta già coprendo le foreste! Preparati alla partita della vita!");
          done();
        } else if (s >= 2 && s < 3) {
          say("Prof. Alvarez", "Kukulkan è di fronte a te! Dimostra che il calcio moderno è il degno erede del Pok-ta-pok!");
          done();
        } else {
          say("Prof. Alvarez", "Che meraviglia indescrivibile... la storia non dimenticherà mai questa giornata.");
          done();
        }
      },

      my_ixchel(K) {
        const s = S();
        if (s === 1) {
          say("Ixchel", "Il momento è giunto, fratello del pallone.");
          say("Ixchel", "Quando il sole e la luna si fonderanno in un cerchio d'ombra, la gravità del campo cambierà.");
          say("Ixchel", "Dovrai sincronizzare il colpo d'anca col battito del tuo cuore. Il Guardiano Kukulkan è pronto per la prova suprema!");
          questDone("my_q3_1");
          setStep(N, 2);
          quest("my_q3_2", "L'Ultima Sfida al Sole", "Sfida il Guardiano Kukulkan nell'Anello Supremo del Quetzal.");
          done();
        } else if (s === 0) {
          say("Ixchel", "Sento l'antico respiro del cielo. Resta concentrato.");
          done();
        } else if (s === 2) {
          say("Ixchel", "Il Guardiano ti aspetta. Io sarò la tua ala e il tuo scudo!");
          done();
        } else {
          say("Ixchel", "La profezia è compiuta. Il Serpente Piumato ha sorriso al tuo coraggio.");
          done();
        }
      },

      my_diego(K) {
        say("Diego", "I canali sotterranei del Cenote sono liberi! Se la piramide dovesse tremare, la zattera è pronta a portarci tutti in salvo fino al golfo!");
        done();
      },

      my_kukulkan(K) {
        const s = S();
        if (s === 2) {
          say("Guardiano Kukulkan", "Atleta delle genti future! Sei giunto sul tetto del mondo.");
          say("Guardiano Kukulkan", "Nel silenzio dell'eclissi, l'Anello del Quetzal si illumina di fiamme dorate. Se riuscirai a segnare contro i sacerdoti solari, la piramide ti consegnerà il suo segreto!");
          ask("Inizi la Finalissima di Pok-ta-pok sotto l'Eclissi?", [
            {
              t: "Gioca l'Ultimo Rito del Pok-ta-pok (Partita)",
              big: true,
              fn: () => {
                K.ownMatch(window.__anello.start, {
                  oppNames: ["Kukulkan Supremo", "Gran Sacerdote del Sole"],
                  mate: "Ixchel",
                  done: (res) => {
                    if (res.win) {
                      say("Guardiano Kukulkan", "INCOMMENSURABILE! La sfera di caucciù ha fenduto l'anello mentre il sole rinasceva dall'ombra!");
                      say("Guardiano Kukulkan", "I portali del destino sono ora spalancati. Quale via sceglierai per custodire questa leggenda?");
                      questDone("my_q3_2");
                      stat("sintonia", 30);
                      stat("coraggio", 25);
                      setStep(N, 3);
                      done();
                    } else {
                      say("Guardiano Kukulkan", "L'eclissi è svanita troppo in fretta! Ritrova la concentrazione solare e riprova!");
                      done();
                    }
                  }
                });
              }
            },
            {
              t: "Contempla l'allineamento con Alvarez e Ixchel",
              fn: () => {
                say("Prof. Alvarez", "Osserva: la luce rifratta crea una traiettoria a spirale. Quando carichi il tiro del Sole (C), la palla curverà direttamente dentro l'anello!");
                done();
              }
            }
          ]);
        } else if (s === 3) {
          say("Guardiano Kukulkan", "È il momento della scelta finale, Campione. Decidi il destino della Piramide del Sole:");
          ask("Come vuoi concludere la tua leggendaria spedizione?", [
            {
              t: "Consacra il Tempio nel silenzio eterno (Finale Giaguaro)",
              big: true,
              fn: () => {
                say("Guardiano Kukulkan", "Hai scelto il rispetto e l'armonia cosmica. Il tempio si sigilla tra le liane, e la tua leggenda vivrà nei canti degli dèi.");
                fin("giaguaro");
              }
            },
            {
              t: "Dona i reperti al Museo Nazionale con Alvarez (Finale Accademia)",
              big: true,
              fn: () => {
                say("Prof. Alvarez", "Un gesto di nobiltà senza pari, ragazzo mio! L'intera umanità potrà ammirare la perfezione atletica degli antichi Maya.");
                fin("accademia");
              }
            },
            {
              t: "Guida la fuga rocambolesca dal Cenote Sommerso (Finale Abisso)",
              big: true,
              fn: () => {
                say("Diego", "Tutti a bordo della zattera! Le acque sorgive ci spingono a tutta velocità tra le stalattiti verso l'oceano!");
                fin("abisso");
              }
            },
            {
              t: "Abbraccia la profezia del Serpente Piumato (Finale Segreto Kukulkan)",
              big: true,
              fn: () => {
                say("Ixchel", "Guarda! Il serpente di piume d'oro danza nei raggi solari! Il calcio moderno e l'antico rito sono ora un'unica anima eterna.");
                fin("kukulkan");
              }
            }
          ]);
        } else {
          say("Guardiano Kukulkan", "La profezia è compiuta in eterno.");
          done();
        }
      }
    };

    return {
      n: N,
      title: "L'Eclissi del Serpente Piumato · L'Ultimo Rito",
      sub: "La Sommità della Piramide, l'eclissi solare e la quadrupla scelta del destino.",
      start: "my_sommita",
      introBg: "my_sommita",
      zones,
      talk,
      goal,
      intro: () => [["voce","La vetta della piramide. Il cielo dello Yucatán si tinge di porpora: la luna comincia a lambire il sole."],["voce","Stasera si gioca l'ultimo rito all'Anello Supremo. E si sceglie il destino della piramide."]]
    };
  }

  boot();
})();
