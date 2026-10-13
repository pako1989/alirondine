// js/pugno-c3.js - PER UN PUGNO DI RIGORI · Capitolo 3 «Mezzogiorno di Fuoco al Fortino»
// La resa dei conti al Fortino di Rio Bravo sotto il sole accecante di mezzogiorno:
// la campana di bronzo che rintocca, gli spalti gremiti di ranger, desperados e avventori,
// la finale a «Stangata» e i 4 finali leggendari della frontiera.
(function () {
  "use strict";
  function boot() {
    const D = window.__pugno;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { F, say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cos("pr_c3", { kind: "shirt", label: "Poncho rosso di Rio Bravo", val: "#dc2626", from: "Capitolo 3 di Per un pugno di rigori" });

    const goal = (s) => ({
      0: "Mezzogiorno è vicino. Raggiungi il Fortino di Rio Bravo dove tutta la contea è radunata.",
      1: "Parla con lo Sceriffo Cooper, Ramon e Carmela prima che la campana batta i dodici rintocchi.",
      2: "Il momento supremo: scendi sul dischetto di Rio Bravo e gioca la finale a Stangata!",
      3: "La coppa è alzata! È il momento della scelta che deciderà la tua leggenda nel West."
    }[s] || "La saga di Per un pugno di rigori è conclusa.");

    const zones = {
      pr_fortino: {
        region: "fortino", name: "Fortino di Rio Bravo · Arena dei Dodici Passi", short: "Fortino Rio Bravo", sub: "Mura di adobe, campana di bronzo e dischetto della finale", bg: "pr_fortino", time: "giorno", travel: [4, 18],
        w: 32, h: 22, start: [4, 18], items: [[2, 6], [29, 6], [16, 19]],
        areas: [[10, 8, 22, 14, "Il dischetto della finale"], [0, 0, 31, 21, "Il Fortino"]],
        flavor: {
          t: "La campana di bronzo sopra l'arco: il battacchio è pronto a rintoccare mezzogiorno.",
          C: "I cactus lungo le mura, addobbati con bandiere rosse e stelle di latta.",
          B: "Botti di sarsaparilla fresca portate da Carmela per dissetare gli spettatori."
        },
        intro: [
          ["voce", "Il Fortino di Rio Bravo: il sole di mezzogiorno arde a picco sulla sabbia rossa. Centinaia di spettatori si affacciano dai merli di pietra."],
          ["voce", "Al centro dell'arena, una riga di calce bianca purissima segna la porta. La Coppa d'Oro di Rio Bravo brilla su un piedistallo di cedro."]
        ],
        npcs: (s) => [
          { id: "pr_sceriffo", at: [8, 14] },
          { id: "pr_ramon", at: [24, 14] },
          { id: "pr_carmela", at: [12, 9] },
          { id: "pr_barnaba", at: [20, 9] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 17, 30, 19, ":"); lay(15, 8, 15, 17, ":"); lay(4, 8, 27, 8, ":");
          // Dischetto finale e pali da calcio
          put(16, 15, "T");
          [[6, 8], [26, 8], [10, 16], [22, 16]].forEach(([x, y]) => put(x, y, "C"));
          [[12, 7], [20, 7]].forEach(([x, y]) => put(x, y, "B"));
          lay(6, 5, 26, 5, "S");
          put(4, 17, "s");
        }
      }
    };

    const talk = {
      pr_sceriffo(K) {
        const s = S();
        if (s <= 1) {
          say([
            ["pr_sceriffo", "[sistema con cura la stella sul petto] Ci siamo, ragazzo. La campana di mezzogiorno sta per suonare il primo tocco."],
            ["pr_sceriffo", "Tutta la contea ti guarda. Ricordati quello che ti ho insegnato: respira a fondo, non farti abbagliare dal sole e tira senza esitazione."],
            ["hero", "Sono pronto, sceriffo. Che vinca il miglior piede."]
          ]);
          setStep(2);
        } else if (s === 2) {
          say([["pr_sceriffo", "È la tua ora, ragazzo. Scendi sul dischetto e fai sentire la legge di El Paso!"]]);
        } else if (s >= 3) {
          // Scelta finale
          say([["pr_sceriffo", "Hai vinto la Coppa, ragazzo! Hai compiuto un'impresa che resterà nella storia del West!"]]);
          presentChoice(K);
        }
      },
      pr_ramon(K) {
        const s = S();
        if (s <= 1) {
          say([
            ["pr_ramon", "[fa roteare il sombrero con un sorriso sornione] Amico mio, l'arena è infuocata. I Ranger hanno schierato il loro portiere più alto del Texas: due metri di muscoli e baffi a manubrio."],
            ["pr_ramon", "Ma contro di te non basteranno nemmeno due porte affiancate. Facciamogli vedere cosa significa calciare dal dischetto nel deserto!"]
          ]);
          setStep(2);
        } else if (s === 2) {
          say([["pr_ramon", "La campana sta battendo il dodicesimo tocco! Al dischetto, Gringo!"]]);
        } else if (s >= 3) {
          presentChoice(K);
        }
      },
      pr_carmela(K) {
        say([["pr_carmela", "[sventola un fazzoletto bianco] Forza, Gringo! Tutto il Saloon fa il tifo per te! Se segni l'ultimo rigore stasera sarsaparilla gratis per l'intera contea!"]]);
      },
      pr_barnaba(K) {
        const s = S();
        if (s === 2) {
          ask("La campana rintocca: scendi al dischetto per la Finale?", [
            ["Inizia la Finale (Stangata)", () => {
              say([
                ["voce", "DONG... DONG... DONG..."],
                ["voce", "La campana di bronzo batte i dodici rintocchi solenni di mezzogiorno. Il silenzio cala sull'arena di Rio Bravo. La polvere si placa."],
                ["hero", "È il momento."]
              ]);
              K.stangataMatch({
                turns: 6,
                us: "Il Gringo",
                opp: { name: "I Ranger di Rio Bravo", color: "#1e3a8a", style: "pressing" }
              }, (res) => {
                if (res.win) {
                  say([
                    ["voce", "GOL! GOL ALL'INCROCIO DEI PALI!"],
                    ["voce", "La folla esplode in un boato assordante. Cappelli che volano in aria, spari a salve di festa e applausi scroscianti da tutti i bastioni!"],
                    ["pr_carmela", "Ha segnato! Ha spiazzato il guardiano di Rio Bravo con un tocco morbido sotto la traversa!"],
                    ["pr_ramon", "Magnifico! Semplicemente magnifico!"],
                    ["pr_sceriffo", "Un tiro da antologia. La Coppa d'Oro è tua, ragazzo!"]
                  ]);
                  bond("taglia", 400);
                  bond("freddezza", 50);
                  K.giveCos("pr_c3");
                  setStep(3);
                  presentChoice(K);
                } else {
                  say([
                    ["pr_sceriffo", "La traversa ha tremato ma la palla è rimbalzata fuori! Riprenditi un attimo: la leggenda non muore con un solo rigore sbagliato!"]
                  ]);
                }
              });
            }],
            ["Un attimo", () => say([["pr_barnaba", "Il tempo si è fermato a mezzogiorno, ma non farlo aspettare troppo!"]])]
          ]);
        } else {
          say([["pr_barnaba", "I pali della porta risuonano ancora della tua bordata finale! Una melodia celestiale!"]]);
        }
      }
    };

    function presentChoice(K) {
      const taglia = K.stat("taglia");
      const legge = K.stat("legge");
      const fred = K.stat("freddezza");
      const items = (K.items && K.items()) || 0;

      const opts = [
        ["Accetta la Stella di Latta (Sceriffo)", () => {
          say([
            ["hero", "Sceriffo Cooper, accetto il vostro invito. Questa contea ha bisogno di ordine e giustizia dal dischetto. Sarò il vostro vice."],
            ["pr_sceriffo", "[commosso, appunta una stella brillante sul tuo gilet] Giuralo sul pallone di cuoio: difenderai la porta della legge finché il sole tramonterà su Rio Bravo."],
            ["voce", "Nasce la leggenda del Vice-Sceriffo del Dischetto. I banditi sanno che finché ci sarai tu a El Paso, nessun rigore resterà impunito!"]
          ]);
          finishChapter(N, { ending: "sceriffo" });
        }],
        ["Cavalca verso il tramonto coi Desperados", () => {
          say([
            ["hero", "Ramon, la legge dei dodici passi non si chiude dietro una scrivania. Dividiamo il bottino: la frontiera è grande e ci sono mille altri tornei da vincere!"],
            ["pr_ramon", "[ride a squarciagola] Sapevo che avevi il cuore di un vero fuorilegge! Andiamo, Gringo! Il tramonto ci aspetta e la nostra taglia sarà leggenda in ogni saloon del continente!"],
            ["voce", "I manifesti Wanted col tuo volto finiscono appesi in tutte le stazioni postali del West: il temuto Bandito del Rigore Invisibile!"]
          ]);
          finishChapter(N, { ending: "desperado" });
        }],
        ["Riparti come Cavaliere Solitario", () => {
          say([
            ["hero", "Non voglio stelle di latta né sacchi d'oro. Ho calciato per la bellezza del gioco e per il fischio del vento."],
            ["hero", "[appoggi il pallone di cuoio sopra la traversa della porta, sali a dorso di mulo e volti le spalle all'arena]"],
            ["pr_carmela", "[asciugandosi una lacrima] Chi era quel tiratore, Cooper?"],
            ["pr_sceriffo", "[togliendosi il cappello] Nessuno, Carmela. O forse... il più grande campione che abbia mai calcato la terra di frontiera."],
            ["voce", "Mentre la tua sagoma scompare nell'infinito del deserto, un fischio malinconico accompagna il tuo cammino verso nuove avventure."]
          ]);
          finishChapter(N, { ending: "solitario" });
        }]
      ];

      // Finale segreto: L'Oro di San Silvestro
      if (items >= 3 || fred >= 40) {
        opts.push(["Svela il Segreto del Dischetto (Segreto)", () => {
          say([
            ["hero", "Aspettate tutti. C'è qualcosa sotto questa zolla di calce..."],
            ["hero", "[scavi con la punta dello scarpino e sollevi una vecchia pietra con incisioni spagnole]"],
            ["pr_barnaba", "Per mille lapidi! La cassa dei padri fondatori di San Silvestro!"],
            ["voce", "Dentro la cassa di cedro brilla il mitico Pallone d'Oro Massiccio fuso nel 1840. Non appartiene a nessuno e appartiene a tutti."],
            ["hero", "Questo pallone resterà a El Paso, nel Saloon di Carmela, affinché ogni viaggiatore possa ammirarlo e ricordare che la lealtà vale più di qualsiasi tesoro."],
            ["pr_sceriffo", "Una festa! Dichiaro festa solenne per tutta la vallata! Sarsaparilla e fagioli a spese della contea per un mese intero!"],
            ["voce", "Hai svelato il più grande mistero della frontiera e unito la legge e i fuorilegge sotto lo stesso glorioso stendardo sportivo!"]
          ]);
          finishChapter(N, { ending: "segreto" });
        }]);
      }

      ask("Quale destino scegli per la tua leggenda?", opts);
    }

    return {
      n: N,
      title: "Mezzogiorno di Fuoco al Fortino",
      desc: "La resa dei conti al Fortino di Rio Bravo sotto il sole accecante e la scelta che consacrerà la tua leggenda.",
      goal: () => goal(S()),
      start: "pr_fortino",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>PER UN PUGNO DI RIGORI</b> · Capitolo 3. Il fortino di Rio Bravo ti aspetta: oggi si decide la Coppa."]];
      }
    };
  }

  boot();
})();
