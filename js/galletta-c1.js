// js/galletta-c1.js - S.O.S. GALLETTA · Capitolo 1 «Un Galeone, un Sacco di Farina e un Pallone»
// L'approdo al Molo della Biscottiera dopo una burrasca di melassa, l'incontro con Capitan Barbabiscotto,
// la fragranza di vaniglia della Taverna della Briciola con l'oste Cannella e il pappagallo Crusty,
// e la prima gloriosa sfida sul pontile a «Arrembaggio sul Ponte» contro i Corsari Sottaceto.
(function () {
  "use strict";
  function boot() {
    const D = window.__galletta;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("gl_barbabiscotto", { beard: "folta", acc: ["bandana"], name: "Capitan Barbabiscotto", tag: "gold", hair: "#78350f", style: "wavy", skin: "#d9a57a", eye: "#2a1a0a", bg: ["#fef3c7", "#d97706"], shirt: "#d97706" },
      "Capitano del veliero «Masticatore». Ha la barba intrecciata con spago e zollette di zucchero di canna: «Il mare appartiene a chi sa calciare a volo mentre il ponte ondeggia a quaranta nodi!».");

    K.cast("gl_cannella", { acc: ["berretto"], name: "Cannella l'Oste", tag: "", hair: "#451a03", style: "buzz", skin: "#f8d7b0", eye: "#15803d", bg: ["#fef3c7", "#b45309"], shirt: "#b45309" },
      "Mastro fornaio e proprietario della Taverna della Briciola. Impasta con le mani nude e calcola i tempi di lievitazione come un rigorista fissa l'incrocio dei pali.");

    K.cast("gl_crusty", { acc: ["occhiali"], name: "Crusty il Pappagallo", tag: "blue", hair: "#15803d", style: "slick", skin: "#fef08a", eye: "#1e293b", bg: ["#0284c7", "#15803d"], shirt: "#15803d" },
      "Pappagallo parlante della cambusa. Ha viaggiato sui sette mari e conosce a memoria le traiettorie del vento, ripetendo a raffica: «Occhio al rollio! Briciole a dritta!»");

    K.cast("gl_sottaceto", { beard: "incolta", acc: ["cappellino"], name: "Capitan Sottaceto", tag: "", hair: "#334155", style: "buzz", skin: "#cbd5e1", eye: "#0f172a", bg: ["#1e3a8a", "#0284c7"], shirt: "#1e3a8a" },
      "Corsaro delle scogliere basse. Gioca con scarpini inzuppati d'aceto e non sopporta i biscotti dolci: «Il vero marinaio mangia solo aringhe salate e spazza la palla in tribuna!».");

    K.cos("gl_c1", { kind: "shirt", label: "Casacca corsara a righe vaniglia", val: "#d97706", from: "Capitolo 1 di S.O.S. Galletta" });
    K.lore("l_arrembaggio", { t: "Arrembaggio sul Ponte", d: "Sul veliero Masticatore il campo ondeggia ritmicamente col beccheggio. Il vento e il burro mutano ogni traiettoria." });
    K.lore("l_galletta", { t: "La Galletta di Ferro", d: "La croccante pietanza bucaniera: non scade mai e se calciata al volo sfonda qualunque barriera difensiva." });

    const goal = (s) => ({
      0: "Sei approdato al Molo della Biscottiera. Parla con Capitan Barbabiscotto sulla banchina.",
      1: "Entra nella Taverna della Briciola e parla con l'oste Cannella per fare provviste.",
      2: "Ascolta i consigli balistici di Crusty il Pappagallo vicino al bancone.",
      3: "I Corsari Sottaceto hanno attraccato! Sfida la loro ciurma sul ponte a colpi di Arrembaggio!"
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      gl_porto: {
        region: "porto", name: "Molo della Biscottiera", short: "Molo Biscottiera", sub: "Banchine di quercia, forni fumanti e gabbiani in volo", bg: "gl_porto", time: "giorno", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[2, 7], [29, 7], [14, 19]],
        areas: [[10, 8, 22, 14, "Il centro della banchina di legno"], [0, 0, 31, 21, "Il Molo della Biscottiera"]],
        flavor: {
          B: "Un barile cerchiato di ferro ripieno di melassa scura profumata.",
          K: "Un cannone navale tirato a lucido, pronto a sparare bordate di farina.",
          A: "Una monumentale ancora corallina che tiene salda la banchina.",
          F: "Un forno a cupola in mattoni da cui esce fumo dolce alla cannella."
        },
        intro: [
          ["voce", "Molo della Biscottiera: il porto più profumato dei sette mari. L'aria sa di salsedine, burro fuso e zucchero caramellato che ribolle nei forni della riva."],
          ["voce", "I galeoni ormeggiati ondeggiano placidi sulle acque turchesi. Davanti a te, Capitan Barbabiscotto scruta l'orizzonte con un cannocchiale di rame."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "gl_barbabiscotto", at: [8, 18] }] : [{ id: "gl_barbabiscotto", at: [21, 14] }]),
          ...(s >= 3 ? [{ id: "gl_sottaceto", at: [15, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          // Mura esterne e mare
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Strade e passerelle del porto
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          // Taverna della Briciola
          house(11, 2, 10, 5, { door: [16, 6], roof: "#d97706", wall: "#fef3c7", rr: 2, enter: { to: "gl_taverna", at: [7, 9] } });
          // Bottega del Fornaio Reale
          house(2, 2, 7, 5, { door: [5, 6], roof: "#b45309", wall: "#fed7aa", rr: 1, enter: "Il Magazzino delle Farine: centinaia di sacchi di semola pregiata impilati fino alle travi del soffitto." });
          // Capitaneria di Porto
          house(23, 2, 7, 5, { door: [26, 6], roof: "#1e3a8a", wall: "#e2e8f0", rr: 1, enter: "L'Ufficio delle Dogane Corsare: registri delle navi e timbri a forma di teschio con le forchette incrociate." });
          // Elementi del porto
          put(16, 9, "A"); put(26, 17, "K"); put(6, 17, "F");
          [[9, 8], [21, 8], [12, 14]].forEach(([x, y]) => put(x, y, "B"));
          [[10, 15], [24, 13], [8, 13]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      gl_taverna: {
        interior: true, region: "porto", name: "Taverna della Briciola", short: "Taverna Briciola", sub: "Botti di sidro al cardamomo, frollini caldi e canti marinari", bg: "gl_porto", w: 16, h: 12, start: [7, 9], outside: ["gl_porto", 16, 7],
        act: { B: "Guarda la botte", F: "Annusa il forno", T: "Esamina il tavolo", v: "Esci" },
        flavor: {
          B: "Una botte colma di sidro dolce fermentato con scorze d'arancia e cannella.",
          F: "Il grande forno della taverna: sforna teglie di gallette croccanti a getto continuo.",
          T: "Un tavolo di rovere consumato dai boccali e inciso con i punteggi di storiche partite navali."
        },
        intro: [["voce", "La Taverna della Briciola: calore avvolgente, risate di vecchi lupi di mare e un inebriante profumo di vaniglia tostata che farebbe resuscitare un ammiraglio affondato."]],
        npcs: () => [
          { id: "gl_cannella", at: [7, 4] },
          { id: "gl_crusty", at: [12, 4] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(7, 11, "v");
          lay(2, 3, 13, 3, "B");
          put(3, 4, "F");
          put(12, 6, "B");
          put(3, 8, "T"); put(11, 8, "T");
        }
      }
    };

    const talk = {
      gl_barbabiscotto(K) {
        const s = S();
        if (s === 0) {
          say([
            ["gl_barbabiscotto", "[ti squadra dall'alto in basso e scuote la barba] Corpo di mille forchette! Guarda chi ha sputato la marea sulla mia banchina!"],
            ["hero", "Ho nuotato per tre leghe dopo che la mia scialuppa è finita contro un banco di corallo zuccherino."],
            ["gl_barbabiscotto", "E hai salvato quel pallone di cuoio sotto il braccio? Ah! Mi piaci, ragazzo! Sull'Oceano della Melassa i cannoni servono a poco se non sai tirare al volo col ponte che si inclina a picco!"],
            ["gl_barbabiscotto", "Prendi questa: è la prima pergamena del mio ricettario segreto. La Galletta di Ferro! Se impari a calciarla come si deve, la Flotta Reale tremerà!"]
          ], () => {
            K.ricetta("galletta", { gallette: 60, pirateria: 15, spezie: 10 }, () => {
              say([
                ["gl_barbabiscotto", "Ora fila alla Taverna della Briciola. Parla con mastro Cannella e fai scorta di burro e farina per l'arrembaggio!"],
                ["hero", "Ricevuto capitano! Vado a fare rifornimento."]
              ], () => {
                setStep(1);
                quest("Entra nella Taverna della Briciola e parla con l'oste Cannella.");
                done();
              });
            });
          });
        } else if (s === 1) {
          say([
            ["gl_barbabiscotto", "Mastro Cannella ti aspetta dietro al bancone della Taverna. Non fargli bruciare le gallette!"]
          ], done);
        } else if (s === 2) {
          say([
            ["gl_barbabiscotto", "Ascolta bene quel pennuto di Crusty: sembra matto ma ha visto mille battaglie navali dal pennone di trinchetto."]
          ], done);
        } else {
          say([
            ["gl_barbabiscotto", "Capitan Sottaceto e la sua ciurma di marinai imbronciati sono arrivati al molo! Fagli vedere come calcia un vero bucaniere della briciola!"]
          ], done);
        }
      },

      gl_cannella(K) {
        const s = S();
        if (s === 1) {
          say([
            ["gl_cannella", "[sbatte una pala di legno sul bancone sollevando una nuvola di farina bianca] Benvenuto alla Briciola, ragazzo! Barbabiscotto mi ha detto che sei il nostro nuovo cannoniere!"],
            ["hero", "Cerco provviste per la ciurma e qualche consiglio per giocare sul ponte bagnato."],
            ["gl_cannella", "Ah! La regola d'oro del pasticciere di bordo: mai calciare dritto quando c'è rollio! Se il ponte pende a dritta, dai alla palla un giro a uscire con la punta dello scarpino."],
            ["gl_cannella", "Tieni: due sacchi di farina d'avena speciale e cinquanta gallette dorate per scaldare i muscoli!"]
          ], () => {
            bond("gallette", 50);
            bond("spezie", 15);
            say([
              ["gl_cannella", "E fai due chiacchiere con Crusty, lassù sulla botte. Quel pappagallo conosce i segreti delle raffiche di tramontana meglio di chiunque altro."],
              ["hero", "Grazie mastro Cannella! Vado subito a sentirlo."]
            ], () => {
              setStep(2);
              quest("Parla con Crusty il Pappagallo vicino al bancone.");
              done();
            });
          });
        } else if (s >= 2) {
          say([
            ["gl_cannella", "[inforna una teglia profumata] Sentilo questo calore! Quando entri sul ponte, pensa alla crosta di un cannolo: dura fuori, morbida dentro!"]
          ], done);
        } else {
          say([
            ["gl_cannella", "Benvenuto marinaio! Parla prima con Capitan Barbabiscotto sulla banchina."]
          ], done);
        }
      },

      gl_crusty(K) {
        const s = S();
        if (s === 2) {
          say([
            ["gl_crusty", "[sbatte le ali verdi e scuote il becco dorato] KRAAA! Attento al vento! Briciole a babordo! KRAAA!"],
            ["hero", "Calmo, Crusty! Mi hanno detto che sei il maestro delle traiettorie aeree."],
            ["gl_crusty", "[inclina la testa e ammicca con l'occhialetto] Un marinaio sveglio! Ascolta il pennuto: quando il vento fischia tra le sartie, la Bordata di Cannone rasoterra non sbaglia mai!"],
            ["gl_crusty", "E se il ponte rolla forte forte... usa il Burro Scivoloso! La palla rimbalza come una foca sul ghiaccio e il portiere avversario fa un bel tuffo in mare! KRAAA!"],
            ["hero", "Sciabolata controvento, Bordata rasoterra e Burro sul rollio. Chiaro come il sole dei tropici!"],
            ["gl_crusty", "[gracchia felice] All'erta! Capitan Sottaceto ha attraccato con la sua scialuppa e insulta le nostre focacce! Corri sul molo! KRAAA!"]
          ], () => {
            setStep(3);
            quest("Torna sul Molo della Biscottiera e affronta Capitan Sottaceto!");
            done();
          });
        } else if (s > 2) {
          say([
            ["gl_crusty", "KRAAA! Spazzagli via la sciabola col pallone di cuoio! Forza Bucanieri!"]
          ], done);
        } else {
          say([
            ["gl_crusty", "Briciole! Briciole per Crusty! KRAAA!"]
          ], done);
        }
      },

      gl_sottaceto(K) {
        say([
          ["gl_sottaceto", "[sputa in mare e batte lo scarpino ferrato sulla banchina] Barbabiscotto! Tu e la tua banda di fornai della domenica avete stancato l'intero arcipelago con questo odore di vaniglia!"],
          ["gl_barbabiscotto", "Parla per te, Sottaceto! L'unica cosa che hai mai vinto è una cassa d'acciughe marce alla sagra del molo!"],
          ["gl_sottaceto", "[ti fissa con occhi torvi] E questo pivellino chi sarebbe? Il garzone del lievito? Se avete il fegato, salite sul ponte e vediamo se sapete reggervi in piedi mentre rolla l'onda!"]
        ], () => {
          ask("Sfida la ciurma dei Corsari Sottaceto all'Arrembaggio sul Ponte?", [
            ["Abborda il Galeone (Arrembaggio sul Ponte)", () => {
              K.arrembaggioMatch({
                turns: 5,
                us: "I Bucanieri",
                opp: {
                  name: "Corsari Sottaceto",
                  color: "#1e3a8a",
                  style: "pressing",
                  players: [{ name: "Sciabola Mozza" }, { name: "Aringa Salata" }],
                  keeper: { name: "Sottaceto" }
                }
              }, (res) => {
                if (res && res.win) {
                  say([
                    ["gl_sottaceto", "[ansima con gli stivali zuppi] Maledizione alle vostre gallette! Scivolano come saponette sul mogano bagnato!"],
                    ["gl_barbabiscotto", "[ti dà una pacca che ti piega in due] Magnifico tiro a giro! Abbiamo ripulito la banchina e conquistato la rotta per la Caracca Reale!"]
                  ], () => {
                    bond("pirateria", 25);
                    bond("gallette", 80);
                    questDone();
                    finishChapter(1, "Il Molo della Biscottiera è salvo! Hai dimostrato il valore della ciurma all'Arrembaggio sul Ponte e conquistato la stima di Barbabiscotto.");
                  });
                } else {
                  say([
                    ["gl_sottaceto", "[ride sguaiato] Ve l'avevo detto! I fornai non hanno gambe da marinai! Riprova se hai ancora fiato!"]
                  ], done);
                }
              });
            }],
            ["Aspetta un momento per prepararti", done]
          ]);
        });
      }
    };

    return {
      n: N,
      title: "Un Galeone, un Sacco di Farina e un Pallone",
      desc: "L'approdo al Molo della Biscottiera, la Taverna della Briciola e il primo Arrembaggio sul Ponte contro i Corsari Sottaceto.",
      goal: () => goal(S()),
      start: "gl_porto",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>S.O.S. GALLETTA</b> · Capitolo 1. L'odore di vaniglia e salsedine del Molo della Biscottiera ti accoglie dopo la burrasca. Barbabiscotto ti aspetta sulla banchina."]];
      }
    };
  }

  boot();
})();
