// js/milano-c1.js - OPERAZIONE FUORIGIOCO NOIR · Capitolo 1 «La Nebbia sui Bastioni»
// Arrivo a Porta Ticinese nella Milano del novembre 1954.
// La nebbia avvolge i binari del tram n° 19, i primi sospetti sulle partite truccate
// del campionato e l'incontro con il Commissario De Santis all'Osteria del Tram.
(function () {
  "use strict";
  function boot() {
    const D = window.__milano;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter1);
  }

  function chapter1(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 1, S = () => K.stepOf(N);

    K.cast("mn_desantis", { acc: ["taccuino", "berretto"], name: "Commissario De Santis", tag: "gray", hair: "#475569", style: "slick", skin: "#cbd5e1", eye: "#0f172a", bg: ["#1e293b", "#64748b"], shirt: "#334155" },
      "Funzionario della Questura di Milano. Impermeabile chiaro con il colletto alzato, sigaretta spenta tra le labbra e un fiuto infallibile per le combine: «A Milano la nebbia nasconde molte cose, figliolo, ma non il rumore di un rigore comprato».");

    K.cast("mn_oste", { acc: ["grembiule"], name: "Battista l'Oste", tag: "", hair: "#334155", style: "buzz", skin: "#f1d5b5", eye: "#1e293b", bg: ["#334155", "#cbd5e1"], shirt: "#f8fafc" },
      "Gestore dell'Osteria del Tram ai Bastioni. Serve bicchieri di rosso novello e polenta fumante, mentre la radio a valvole trasmette i resoconti delle partite del dopoguerra.");

    K.cast("mn_peppino", { acc: ["occhiali", "coppola"], name: "Peppino il Guercio", tag: "blue", hair: "#1e293b", style: "messy", skin: "#cbd5e1", eye: "#0f172a", bg: ["#0f172a", "#475569"], shirt: "#475569" },
      "Allibratore clandestino del capolinea del tram. Si vanta di conoscere in anticipo i risultati di tutte le categorie della Lombardia grazie ai suoi informatori tra i casellanti.");

    K.cos("mn_c1", { kind: "shirt", label: "Trench investigativo grigio antracite", val: "#334155", from: "Capitolo 1 di Operazione Fuorigioco Noir" });
    K.lore("l_milano54", { t: "Milano 1954", d: "La ripresa del dopoguerra, i tram a carrello arancioni e verdi, e le partite domenicali con cinquantamila persone sugli spalti infangati." });
    K.lore("l_bastioni", { t: "I Bastioni di Porta Ticinese", d: "Crocevia di rotaie, bische nei retrobottega e campetti di terra battuta illuminati da fioche lampadine." });

    const goal = (s) => ({
      0: "Sei arrivato ai Bastioni di Porta Ticinese. Parla con il Commissario De Santis sotto il lampione.",
      1: "Entra nell'Osteria del Tram e chiedi informazioni a Battista l'Oste.",
      2: "Raggiungi il Deposito del Tram ed interroga Peppino il Guercio.",
      3: "La Banda dei Bastioni vuole intimidirti! Affrontali a Pedinamento Tattico sul campo di terra!"
    }[s] || "Il primo capitolo è concluso. Continua con il Capitolo 2.");

    const zones = {
      mn_bastioni: {
        region: "bastioni", name: "I Bastioni di Porta Ticinese", short: "Bastioni Ticinese", sub: "Rotaie del tram, nebbia fitta e lampioni a gas", bg: "mn_titolo", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[3, 8], [28, 8], [15, 18]],
        areas: [[10, 8, 22, 14, "Il campo in terra battuta delimitato da fango e binari"], [0, 0, 31, 21, "Piazzale dei Bastioni nella nebbia milanese"]],
        flavor: {
          B: "Il capolinea del tram n° 19 con i cavi aerei che scintillano nella notte.",
          K: "La colonna miliare di Porta Ticinese con manifesti della Fiera Campionaria.",
          A: "La pesa pubblica in ghisa con le tracce fresche di pneumatici pesanti.",
          P: "Un lampione a gas che disegna un cerchio di luce giallastra sul ciottolato."
        },
        intro: [
          ["voce", "Milano, novembre 1954. Una nebbia spessa come panna sale dalla Darsena e inghiotte i profili dei caselli daziari."],
          ["voce", "Sotto il riverbero fioco di un lampione, un uomo in impermeabile grigio fuma una sigaretta nell'ombra. È il Commissario De Santis."]
        ],
        npcs: (s) => [
          ...(s === 0 ? [{ id: "mn_desantis", at: [8, 17] }] : [{ id: "mn_desantis", at: [20, 14] }]),
          ...(s >= 3 ? [{ id: "mn_peppino", at: [14, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          // Perimetro e recinzione
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          // Strade e selciato
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          // Osteria del Tram (sinistra)
          house(2, 2, 8, 5, { door: [6, 6], roof: "#334155", wall: "#cbd5e1", rr: 1, enter: { to: "mn_osteria", at: [7, 9] } });
          // Deposito Rotaie / Tram (centro)
          house(11, 2, 10, 5, { door: [16, 6], roof: "#1e293b", wall: "#94a3b8", rr: 2, enter: { to: "mn_deposito", at: [6, 10] } });
          // Bottega del Casellante (destra)
          house(22, 2, 8, 5, { door: [25, 6], roof: "#475569", wall: "#64748b", rr: 1, enter: "La Cabina Elettrica del Tram: ronzio di trasformatori e schede degli orari delle corse notturne." });
          // Elementi del piazzale
          put(16, 9, "A"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      mn_osteria: {
        interior: true, region: "lucciola", name: "Osteria del Tram", short: "Osteria Battista", sub: "Profumo di risotto, vino sfuso e resoconti radiofonici", bg: "mn_club", w: 16, h: 12, start: [7, 9], outside: ["mn_bastioni", 6, 7],
        act: { F: "Scaldati alla stufa", B: "Guarda il bancone", T: "Esamina il tavolo", v: "Esci sui Bastioni" },
        flavor: {
          F: "Una stufa in ghisa sferragliante che riscalda i manovratori intirizziti dalla nebbia.",
          B: "Bottiglie di grappa, bicchieri di rosso novello e una vecchia radio Phonola a valvole.",
          T: "Un tavolaccio di legno con una copia del Corriere della Sera aperta sulla pagina sportiva."
        },
        intro: [["voce", "L'Osteria del Tram: l'aria è densa di fumo di pipa e profumo di minestrone d'orzo. Dietro il bancone, Battista stappa una bottiglia guardando fuori dalla vetrata appannata."]],
        npcs: () => [
          { id: "mn_oste", at: [8, 4] }
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
      },
      mn_deposito: {
        interior: true, region: "bastioni", name: "Deposito del Tram n° 19", short: "Deposito Rotaie", sub: "Carrozze biverdi, scintille elettriche e scommesse segrete", bg: "mn_titolo", w: 16, h: 12, start: [6, 10], outside: ["mn_bastioni", 16, 7],
        act: { G: "Ispeziona i binari", K: "Esamina la cassetta", T: "Fruga tra le panche", v: "Esci sul piazzale" },
        flavor: {
          G: "Binari ingrassati e carrelli di ricambio pronti per la manutenzione notturna.",
          K: "Una cassetta in legno con biglietti punzonati scartati dal controllore.",
          T: "Vecchie panche in legno dove gli allibratori si scambiano mazzette di denaro."
        },
        intro: [["voce", "Il Deposito di Porta Ticinese: enormi carrozze del tram verde muschio sostano nell'oscurità. In fondo a un binario morto, una sagoma furtiva nasconde una cartellina marrone."]],
        npcs: () => [
          { id: "mn_peppino", at: [8, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a");
          put(6, 11, "v");
          lay(2, 3, 13, 3, "G");
          put(3, 5, "K"); put(12, 5, "T");
          put(4, 8, "G"); put(11, 8, "G");
        }
      }
    };

    const talk = {
      mn_desantis(K) {
        const s = S();
        if (s === 0) {
          say([
            ["mn_desantis", "[aspira una boccata e osserva la nebbia con occhi socchiusi] Ti aspettavo, ragazzo. Mi hanno parlato del tuo talento con il pallone."],
            ["hero", "Mi ha fatto chiamare la Questura per una partita di calcio?"],
            ["mn_desantis", "Non per una partita qualunque. Qui a Milano girano troppi soldi sporchi dietro le quinte del campionato."],
            ["mn_desantis", "Portieri che 'scivolano' sul fango al 90°, arbitri che vedono fuorigioco inesistenti e partite decise prima ancora del fischio iniziale."],
            ["mn_desantis", "Se vogliamo ripulire il campo prima del grande derby dell'Arena Civica, mi serve qualcuno con fiuto che sappia muoversi tra le ombre senza dare nell'occhio."],
            ["hero", "Da dove cominciamo, Commissario?"],
            ["mn_desantis", "Fai un salto all'Osteria del Tram. Battista sente tutte le chiacchiere dei manovratori. Scopri chi gestisce il giro di scommesse di Porta Ticinese."]
          ], () => {
            bond("biglietti", 15);
            bond("fiuto", 10);
            setStep(1);
            quest("Entra nell'Osteria del Tram e parla con Battista l'Oste.");
            done();
          });
        } else if (s === 1) {
          say([
            ["mn_desantis", "Battista è all'Osteria. Chiedigli chi frequenta il Deposito del Tram a quest'ora."]
          ], done);
        } else if (s === 2) {
          say([
            ["mn_desantis", "Peppino il Guercio è rintanato nel Deposito. Mettilo alle strette e fatti mostrare le matrici dei biglietti."]
          ], done);
        } else {
          say([
            ["mn_desantis", "La Banda dei Bastioni è sul campo! Dimostragli che a pallone si vince con la tecnica e la classe, non coi trucchi da bisca!"]
          ], done);
        }
      },

      mn_oste(K) {
        const s = S();
        if (s === 1) {
          say([
            ["mn_oste", "[pulisce un bicchiere di vetro spesso con uno strofinaccio candido] Buonasera giovanotto! Fuori c'è una nebbia che si taglia col coltello. Cosa ti porto?"],
            ["hero", "Solo un'informazione, Battista. Cerco chi manovra le quote delle scommesse attorno al capolinea."],
            ["mn_oste", "[abbassa il tono di voce e si guarda attorno] Parla piano. A fare certi nomi ci si ritrova con una bicicletta nel Naviglio."],
            ["mn_oste", "Se cerchi chi tiene il banco, cerca Peppino il Guercio. Passa le notti al Deposito Rotaie, nascosto tra i vagoni dismessi."],
            ["mn_oste", "Usa i biglietti del tram falsificati con punzonature speciali per pagare le vincite ai suoi tirapiedi."],
            ["mn_oste", "Bevi questa tazza di caffè corretto per scaldare le gambe e fai attenzione: Peppino ha il dente avvelenato."]
          ], () => {
            bond("biglietti", 30);
            bond("fiuto", 15);
            setStep(2);
            quest("Raggiungi il Deposito del Tram n° 19 e affronta Peppino il Guercio.");
            done();
          });
        } else if (s >= 2) {
          say([
            ["mn_oste", "Peppino è al Deposito Rotaie. Non farti ingannare dalle sue arie da furbastro!"]
          ], done);
        } else {
          say([
            ["mn_oste", "Benvenuto all'Osteria del Tram! Prima scambia due parole con il Commissario De Santis sul piazzale."]
          ], done);
        }
      },

      mn_peppino(K) {
        const s = S();
        if (s === 2) {
          say([
            ["mn_peppino", "[fa tintinnare monete nella tasca del gilet squadrando il Campione] E tu chi saresti? Un altro galletto che vuole puntare sulla vittoria dell'Ambrosiana?"],
            ["hero", "Sono qui per le matrici false dei biglietti, Peppino. Il Commissario De Santis ha già circondato il quadrante."],
            ["mn_peppino", "[sbianca e fa scivolare una cartellina di cartone sul banco] De Santis?! Quel mastino non molla mai l'osso!"],
            ["mn_peppino", "Ascolta ragazzo... io sono solo una pedina! Prendo gli ordini da Mara al night club La Lucciola e da Don Carmine!"],
            ["mn_peppino", "Prendi questo verbale e lasciami andare! Ci sono i codici delle scommesse del derby di domenica!"]
          ], () => {
            K.interroga("biglietto", { biglietti: 45, fiuto: 20, sospetto: 15 }, () => {
              say([
                ["mn_peppino", "I ragazzi della Banda dei Bastioni hanno visto che parli con me! Hanno occupato il campetto di terra e vogliono farti la festa a pallone!"],
                ["hero", "Perfetto. È proprio sul campo da calcio che volevo incontrarli!"]
              ], () => {
                setStep(3);
                quest("Ritorna sul piazzale e sfida la Banda dei Bastioni a Pedinamento Tattico!");
                done();
              });
            });
          });
        } else if (s === 3) {
          say([
            ["mn_peppino", "I ragazzi della Banda ti aspettano sul campo! Fai valere i colori del calcio pulito!"]
          ], () => {
            ask("Affronti la Banda dei Bastioni nella sfida decisiva?", [
              {
                label: "⚽ Sfida a Pedinamento Tattico!",
                fn: () => {
                  K.ownMatch(window.__pedinamento.start, {
                    opp: "Banda dei Bastioni '54",
                    onDone: (res) => {
                      if (res.win) {
                        say([
                          ["mn_desantis", "[applaude con calma mentre la nebbia si dirada] Splendida vittoria nel fango, figliolo! Hai anticipato ogni loro mossa come un vero investigatore di centrocampo."],
                          ["mn_desantis", "La Banda si ritira, ma il pesce grosso è ancora libero. La traccia porta dritto al night club 'La Lucciola'."],
                          ["hero", "Andiamo a trovare 'La Bionda' Mara, Commissario!"]
                        ], () => {
                          finishChapter("Capitolo 1 completato! Prosegui verso il night club La Lucciola!");
                        });
                      } else {
                        say([
                          ["mn_desantis", "Hanno vinto loro sul filo di lana sfruttando il fango. Riprova, anticipa le linee di passaggio e mantieniti nell'ombra!"]
                        ], done);
                      }
                    }
                  });
                }
              },
              { label: "Preparati ancora", fn: done }
            ]);
          });
        } else {
          say([
            ["mn_peppino", "Non ho niente da dirti, giovanotto. Circolare!"]
          ], done);
        }
      }
    };

    return {
      n: N,
      title: "La Nebbia sui Bastioni",
      sub: "Porta Ticinese, l'allibratore del tram e la prima indagine nel fango",
      goal: () => goal(S()),
      start: "mn_bastioni",
      introBg: "mn_titolo",
      zones,
      talk,
      intro: [
        ["voce", "Milano, novembre 1954. Una fitta nebbia autunnale copre i Bastioni di Porta Ticinese."],
        ["voce", "I tram cigolano sulle rotaie umide, mentre nell'ombra delle bische clandestine si decidono i destini del calcio lombardo."]
      ]
    };
  }

  boot();
})();
