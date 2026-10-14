// js/campana-c3.js - LA NOTTE DEI CENTO RINTOCCHI · Capitolo 3 «La Notte dei Cento Rintocchi & Il Trionfo a Mezzanotte»
// Il raduno prima della mezzanotte, lo Spartito dei Cento Rintocchi,
// l'ardito piano per rimettere la campana al suo posto tra argani e canti,
// la finalissima contro i Campanari di San Pancrazio e la risoluzione dei 4 finali esclusivi.
(function () {
  "use strict";
  function boot() {
    const D = window.__campana;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter3);
  }

  function chapter3(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 3, S = () => K.stepOf(N);

    K.cast("cp_mastro", { acc: ["medaglia", "fascia"], name: "Gran Mastro Campanaro", tag: "gold", hair: "#64748b", style: "wavy", skin: "#fed7aa", eye: "#1e293b", beard: true, bg: ["#ca8a04", "#713f12"], shirt: "#ca8a04" },
      "Decano dei mastri campanari dell'Appennino e capitano dei Campanari di San Pancrazio. Sente il tempo nel sangue e quando calcia di collo pieno sembra che risuoni un concerto a cinque campane: «A mezzanotte si saprà chi ha la fede e chi ha solo fiato nei polmoni!».");

    K.cos("cp_c3", { kind: "shirt", label: "Tonaca scanzonata da rigorista notturno", val: "#18181b", from: "Capitolo 3 de La Notte dei Cento Rintocchi" });
    K.lore("l_sanpancrazio", { t: "I Campanari di San Pancrazio", d: "La squadra leggendaria del colle: tirano al millisecondo esatto sul battere della campana, non sbagliano un rimbalzo." });

    const goal = (s) => ({
      0: "Parla con Don Crispino e la banda radunati sui Tetti del Campanile.",
      1: "Tutto è pronto per la finale di mezzanotte: sfida i Campanari di San Pancrazio!",
      2: "Il Torneo è concluso: assisti al verdetto della Campana d'Oro sul sagrato!"
    }[s] || "La saga è conclusa. Consulta la Cineteca per rivedere tutti i finali.");

    const zones = {
      cp_tetti: {
        region: "campanile", name: "Merlature del Campanile", short: "Tetti Campanile", sub: "Bifore di pietra, cielo stellato, funi tese e l'argano monumentale", bg: "cp_campanile", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[4, 6], [28, 6], [16, 17]],
        areas: [[10, 6, 22, 14, "La piattaforma panoramica della campana"], [0, 0, 31, 21, "Le merlature dell'Antico Campanile"]],
        flavor: {
          B: "La cavità vuota della cella campanaria con le corde pronte a issare la campana d'oro.",
          K: "Il quadrante luminoso dell'orologio che segna le 23:55: mancano cinque minuti a mezzanotte!",
          A: "La banderuola segnavento in ferro battuto a forma di galletto campanaro.",
          P: "La fune d'acciaio dell'argano di Peppe collegata alla carrucola maestra."
        },
        intro: [
          ["voce", "Le Merlature del Campanile: quassù il vento notturno porta i profumi di bosco e le voci della folla radunata in piazza per la finale."],
          ["voce", "Tito fuma nervosamente una pagliuzza, Peppe controlla i bulloni dell'argano e Don Crispino recita un'orazione mista a schemi tattici su palla inattiva."]
        ],
        npcs: (s) => [
          { id: "cp_crispino", at: [8, 16] },
          { id: "cp_peppe", at: [14, 16] },
          { id: "cp_tito", at: [20, 16] },
          ...(s >= 1 ? [{ id: "cp_mastro", at: [16, 9] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 15, 30, 18, ":"); lay(15, 6, 15, 15, ":"); lay(4, 6, 27, 6, ":");
          house(2, 2, 8, 4, { door: [6, 5], roof: "#854d0e", wall: "#fef08a", rr: 1, enter: "Il Belvedere di Levante: vista sui vigneti e sulle colline punteggiate di fiaccole." });
          house(11, 2, 10, 4, { door: [16, 5], roof: "#713f12", wall: "#cbd5e1", rr: 2, enter: "La Piccionaia Seicentesca: nidi d'argilla e colombi che tubano nel sonno." });
          house(22, 2, 8, 4, { door: [25, 5], roof: "#1e1b4b", wall: "#94a3b8", rr: 1, enter: "L'Argano Maestro: tamburo d'acciaio con freno a manovella per carichi pesanti." });
          put(16, 8, "A"); put(26, 16, "K"); put(6, 16, "B");
          [[9, 6], [21, 6], [12, 13]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      }
    };

    const talk = {
      cp_crispino(K) {
        const s = S();
        if (s === 0) {
          say([
            ["cp_crispino", "[guarda l'orologio della torre che segna le 23:55] Figlioli, è l'ora della verità! Tra cinque minuti scatta la mezzanotte di San Fortunato!"],
            ["cp_peppe", "L'argano è pronto, reverendo! Abbiamo tirato la fune d'acciaio dalla cantina fino a questo spuntone: appena il campione fa gol, io giro la manovella e la campana torna su come una piuma!"],
            ["cp_tito", "E io ho trovato l'antico spartito dei Cento Rintocchi! Se seguiamo il tempo esatto, la campana suonerà da sola per risonanza armonica!"]
          ], () => {
            K.alibi("spartito", { battacchi: 100, popolo: 35 }, () => {
              say([
                ["cp_crispino", "I Campanari di San Pancrazio sono già schierati sul sagrato. Hanno vinto dieci tornei di fila... ma stanotte la Provvidenza e i Soliti Ignoti sono dalla nostra parte!"],
                ["hero", "Scendiamo sul sagrato! Rocca Campanaria avrà la sua festa!"]
              ], () => {
                setStep(1);
                quest("Sfida il Gran Mastro Campanaro e i suoi campioni nella Finalissima!");
                done();
              });
            });
          });
        } else if (s === 1) {
          say([
            ["cp_crispino", "Tira a campanile ogni volta che suona il rintocco! Il portiere avversario resterà di stucco!"]
          ], done);
        } else {
          say([
            ["cp_crispino", "Senti quel bronzo dorato che canta nell'aria di notte? Che miracolo, figliolo! Che miracolo!"]
          ], done);
        }
      },

      cp_peppe(K) {
        say([
          ["cp_peppe", "[stringe la manovella dell'argano coi bicipiti gonfi] Tu pensa a fare gol, capitano! Al peso della campana ci penso io!"]
        ], done);
      },

      cp_tito(K) {
        say([
          ["cp_tito", "[aggiusta la coppola con fare sornione] Un piano senza sbavature... i Soliti Ignoti non tradiscono mai!"]
        ], done);
      },

      cp_mastro(K) {
        say([
          ["cp_mastro", "[batte lo scarpino dorato sul sagrato sollevando scintille dai ciottoli] Finalmente ci incontriamo, giovane campione del sagrato!"],
          ["cp_mastro", "I Campanari di San Pancrazio hanno difeso il trofeo per vent'anni. Noi conosciamo ogni eco di questa piazza: se vuoi la vittoria, dovrai colpire all'ultimo centesimo di secondo prima del dodicesimo rintocco!"]
        ], () => {
          ask("Disputi la Finalissima del Torneo delle Contrade a I Cento Rintocchi?", [
            ["Gioca la Finalissima (I Cento Rintocchi)", () => {
              K.rintocchiMatch({
                turns: 7,
                us: "I Soliti Ignoti",
                opp: {
                  name: "Campanari di San Pancrazio",
                  color: "#ca8a04",
                  style: "pressing",
                  players: [{ name: "Battaglio Rosso" }, { name: "Rintocco Vivo" }],
                  keeper: { name: "Gran Mastro" }
                }
              }, (res) => {
                if (res && res.win) {
                  say([
                    ["cp_mastro", "[si toglie la fascia e applaude con solennità] Un tiro divino... sul rintocco perfetto di mezzanotte! Il trofeo e la leggenda di Rocca Campanaria vi appartengono!"],
                    ["cp_peppe", "[gira l'argano a tutta forza] OOO-ISSA! LA CAMPANA SALE!"],
                    ["voce", "Con un fragoroso «DINNN-DONNN» che fa tremare le tegole e volare stormi di colombi, la Campana d'Oro si rialloggia nella sua culla di quercia secolare!"],
                    ["cp_rosetta", "[stappa dieci fiaschi di Barbera contemporaneamente] VITTORIA! Pane, salame e ciambelle per tutto il borgo fino all'alba!"]
                  ], () => {
                    bond("popolo", 50);
                    bond("battacchi", 150);
                    questDone();

                    // Determinazione finale in base alle scelte e statistiche
                    const totalBattacchi = K.stat("battacchi");
                    const isSecret = totalBattacchi >= 280;
                    const isBanda = K.F.is("cp_scelta_banda");
                    const isLegge = K.F.is("cp_scelta_legge");

                    let endKey = "doncamillo";
                    if (isSecret) endKey = "cento";
                    else if (isBanda) endKey = "banda";
                    else if (isLegge) endKey = "legge";

                    finishChapter(3, "Trionfo a mezzanotte! La Campana d'Oro è tornata al suo posto, il campetto è salvo e Rocca Campanaria risuona di cento rintocchi festosi.", endKey);
                  });
                } else {
                  say([
                    ["cp_mastro", "[scuote il capo con nobile fermezza] Vi è mancato il tempismo del rintocco decisivo! Riprova la finalissima quando il pendolo sarà di nuovo allineato!"]
                  ], done);
                }
              });
            }],
            ["Prenditi ancora un minuto per concentrarti", done]
          ]);
        });
      }
    };

    return {
      n: N,
      title: "La Notte dei Cento Rintocchi & Il Trionfo a Mezzanotte",
      desc: "L'argano sui tetti del campanile, lo spartito delle campane e la leggendaria finalissima contro i Campanari di San Pancrazio.",
      goal: () => goal(S()),
      start: "cp_tetti",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>LA NOTTE DEI CENTO RINTOCCHI</b> · Capitolo 3. Mancano cinque minuti alla mezzanotte. Sui tetti del campanile la banda prepara l'argano per la mossa finale."]];
      }
    };
  }

  boot();
})();
