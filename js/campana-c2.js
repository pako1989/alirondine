// js/campana-c2.js - LA NOTTE DEI CENTO RINTOCCHI · Capitolo 2 «L'Officina del Colpo & La Semifinale delle Contrade»
// Le minacce del Sindaco Bellavista, l'incursione nell'Officina di Peppe tra chiavi inglesi e la botte della refurtiva,
// la scelta cruciale tra la banda e il verbale del maresciallo,
// e la combattuta semifinale a «I Cento Rintocchi» contro i campioni della Contrada del Gufo.
(function () {
  "use strict";
  function boot() {
    const D = window.__campana;
    if (!D || !D.addChapter) return setTimeout(boot, 120);
    D.addChapter(chapter2);
  }

  function chapter2(K) {
    const { say, ask, done, setStep, bond, finishChapter, quest, questDone } = K;
    const N = 2, S = () => K.stepOf(N);

    K.cast("cp_peppe", { acc: ["chiave", "grembiule"], name: "Peppe il Meccanico", tag: "gold", hair: "#1c1917", style: "buzz", skin: "#d9a57a", eye: "#2a1a0a", beard: true, bg: ["#ca8a04", "#1e3a8a"], shirt: "#1e3a8a" },
      "Il forzuto meccanico di Rocca Campanaria. Sposta i motori a braccia e calcia punizioni che piegano le traverse: «Il piano era perfetto! Solo che la botte era troppo stretta e la campana continuava a fare ding-dong a ogni buca!».");

    K.cast("cp_sindaco", { acc: ["medaglia"], name: "Sindaco Bellavista", tag: "blue", hair: "#94a3b8", style: "ordinato", skin: "#fed7aa", eye: "#334155", beard: false, bg: ["#1e3a8a", "#ca8a04"], shirt: "#0284c7" },
      "Primo cittadino di Rocca Campanaria. Sempre impettito nella fascia tricolore, non vede l'ora di demolire il vecchio campetto parrocchiale per fare un moderno garage a pagamento per le carrozze dei turisti.");

    K.cast("cp_gufo", { acc: ["maschera", "cappellino"], name: "Capitano del Gufo", tag: "", hair: "#334155", style: "slick", skin: "#f8d7b0", eye: "#0f172a", bg: ["#1e1b4b", "#ca8a04"], shirt: "#1e1b4b" },
      "Centravanti della Contrada del Gufo. Gioca con scarpini lucidati e pressing asfissiante: «Stanotte il sagrato appartiene ai Gufi! Domani mattina festeggeremo sopra le macerie del vostro campetto!».");

    K.cos("cp_c2", { kind: "shirt", label: "Gilet da meccanico a righe ottone", val: "#ca8a04", from: "Capitolo 2 de La Notte dei Cento Rintocchi" });
    K.lore("l_gufo", { t: "La Contrada del Gufo", d: "La fazione più antica e spietata delle colline: giocano di notte al buio e non perdonano un millimetro di distrazione." });

    const goal = (s) => ({
      0: "Parla con il Sindaco Bellavista infuriato sul sagrato di Piazza Grande.",
      1: "Raggiungi il Vicolo dei Fabbri ed entra nell'Officina di Peppe il Meccanico.",
      2: "Ascolta la confessione di Peppe e Tito davanti alla botte cerchiata.",
      3: "Affronta la Contrada del Gufo nella Semifinale a I Cento Rintocchi!"
    }[s] || "Il secondo capitolo è concluso. Continua con il Capitolo 3.");

    const zones = {
      cp_vicolo: {
        region: "cantina", name: "Vicolo dei Fabbri", short: "Vicolo Fabbri", sub: "Archi medievali, odore di ferro battuto, torce e l'officina di Peppe", bg: "cp_cantina", time: "notte", travel: [5, 18],
        w: 32, h: 22, start: [5, 18], items: [[3, 7], [27, 7], [15, 18]],
        areas: [[10, 8, 22, 14, "Il piazzale dei carretti e delle incudini"], [0, 0, 31, 21, "Il Vicolo dei Fabbri di Rocca Campanaria"]],
        flavor: {
          B: "Una serie di barili cerchiati d'acciaio e taniche di lubrificante per ingranaggi.",
          K: "Un argano a catena con gancio da tonnellate per sollevare i telai dei carri.",
          P: "Una fune metallica di sicurezza ancorata all'arcata in pietra.",
          F: "La forgia dell'officina: braci ardenti che illuminano le pareti di tufo."
        },
        intro: [
          ["voce", "Il Vicolo dei Fabbri: una gola stretta tra case a torre dove il rimbombo dei passi sui ciottoli è amplificato dieci volte."],
          ["voce", "Dall'officina di Peppe esce un profumo pungente di ferro battuto, nafta e... un inconfondibile odore di cera e salame."]
        ],
        npcs: (s) => [
          ...(s === 1 ? [{ id: "cp_peppe", at: [16, 12] }] : []),
          ...(s >= 3 ? [{ id: "cp_gufo", at: [18, 10] }] : [])
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 0, 0, 21, "a"); lay(31, 0, 31, 21, "a"); lay(0, 21, 31, 21, "a");
          lay(1, 16, 30, 19, ":"); lay(15, 7, 15, 16, ":"); lay(4, 7, 27, 7, ":");
          house(2, 2, 9, 5, { door: [6, 6], roof: "#475569", wall: "#94a3b8", rr: 1, enter: "La Ferramenta del Borgo: bulloni, serrature antiche e mille lucchetti arrugginiti." });
          house(12, 2, 9, 5, { door: [16, 6], roof: "#713f12", wall: "#fed7aa", rr: 1, enter: { to: "cp_officina", at: [3, 8] } });
          house(22, 2, 8, 5, { door: [25, 6], roof: "#1e293b", wall: "#64748b", rr: 1, enter: "Il Deposito Carrozze: vecchi calessi impolverati e balle di fieno profumato." });
          put(16, 9, "A"); put(26, 17, "K"); put(6, 17, "B");
          [[9, 7], [21, 7], [12, 14]].forEach(([x, y]) => put(x, y, "P"));
          put(5, 17, "s");
        }
      },
      cp_officina: {
        interior: true, region: "cantina", name: "Officina di Peppe & Tito", short: "Officina Peppe", sub: "Cric idraulici, chiavi inglesi, taniche e la botte segreta", bg: "cp_cantina", w: 18, h: 14, start: [3, 8], outside: ["cp_vicolo", 16, 7],
        act: { B: "Ispeziona la botte", K: "Guarda il cric", F: "Controlla la forgia", v: "Esci" },
        flavor: {
          B: "La mastodontica botte da vino cerchiata d'ottone: dentro è imbottita di coperte e nasconde la Campana d'Oro!",
          K: "Un cric a cremagliera da cantiere, perfettamente dimensionato per calare carichi da mezza tonnellata.",
          F: "La forgia a carbone spenta: sul banco ci sono pinze giganti e limette d'acciaio."
        },
        intro: [["voce", "L'Officina di Peppe: tra motori smontati e chiavi inglesi lunghe mezzo metro, una grande botte da vino è coperta frettolosamente da un telo cerato."]],
        npcs: () => [
          { id: "cp_peppe", at: [9, 5] },
          { id: "cp_tito", at: [13, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "+"); lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(3, 13, "v");
          put(9, 3, "B");
          put(5, 4, "K"); put(13, 4, "F");
          put(4, 9, "T"); put(12, 9, "T");
        }
      }
    };

    const talk = {
      cp_sindaco(K) {
        say([
          ["cp_sindaco", "[agita la fascia tricolore e guarda con sdegno la facciata della chiesa] Uno scandalo inammissibile! Rocca Campanaria ridicolizzata davanti all'intera prefettura!"],
          ["hero", "Signor Sindaco, stiamo indagando per recuperare la campana prima della finale."],
          ["cp_sindaco", "Le indagini non mi bastano! Se entro stasera la campana non rintocca dal campanile, firmerò l'ordinanza esecutiva: il campetto dell'oratorio verrà raso al suolo e ci faremo un bel multipiano in cemento armato!"],
          ["cp_crispino", "[arriva col crocifisso in mano] Sul mio cadavere, Bellavista! San Fortunato ti manderà la diarrea prima che tu posi un solo mattone sul nostro campo!"],
          ["cp_sindaco", "Vedremo sul sagrato! I campioni della Contrada del Gufo vi impartiranno una severa lezione nella semifinale di stasera!"]
        ], () => {
          setStep(1);
          quest("Raggiungi il Vicolo dei Fabbri ed entra nell'Officina di Peppe.");
          done();
        });
      },

      cp_peppe(K) {
        const s = S();
        if (s <= 1) {
          say([
            ["cp_peppe", "[si pulisce le mani con uno straccio bisunto e balbetta] C-ciao capitano! Che ci fai qui nel vicolo? Qui facciamo solo rettifica di cilindri e sostituzione ganasce!"],
            ["hero", "Peppe, ogni volta che sposti un barile quella botte laggiù fa «GONG» con eco di cattedrale."],
            ["cp_peppe", "[si prende la testa tra le mani da orso] Lo sapevo! Gliel'avevo detto a Tito che le botti di rovere rimbombano! È tutta colpa sua e delle sue idee da cinema!"],
            ["cp_tito", "[spunta da dietro il banco] Ma quale colpa! Io sono la mente, tu sei il braccio! Chi è che ha scambiato la corda della campana col cavo del paranco?!"],
            ["cp_peppe", "Volevamo solo dare una lezione a Bellavista! Quel pallone gonfiato del Sindaco voleva sfrattare l'officina e il campetto per venderli ai suoi compari di città!"]
          ], () => {
            K.alibi("fiasco", { battacchi: 65, sospetto: 20, popolo: 25 }, () => {
              ask("Come decidi di gestire la refurtiva dei Soliti Ignoti?", [
                ["Proteggi la banda: 'Rimetteremo la campana al suo posto dopo la finale!'", () => {
                  K.F.set("cp_scelta_banda", true);
                  bond("popolo", 30);
                  say([
                    ["cp_peppe", "[ti abbraccia quasi stritolandoti le costole] Grazie campione! Sei un vero amico del popolo! Stanotte ti proteggiamo noi le spalle sul sagrato!"],
                    ["cp_tito", "E io ho preparato una tattica a scasso segreta per battere la Contrada del Gufo! Andiamo a fargli vedere chi siamo!"]
                  ], () => {
                    setStep(3);
                    quest("Torna nel Vicolo ed elimina la Contrada del Gufo nella Semifinale!");
                    done();
                  });
                }],
                ["Collabora col Maresciallo: 'Informiamo Cacace per via diplomatica'", () => {
                  K.F.set("cp_scelta_legge", true);
                  bond("sospetto", -20);
                  bond("popolo", 20);
                  say([
                    ["cp_peppe", "Se lo dici tu... almeno evitiamo la galera a vita! Ma prima dobbiamo vincere la semifinale o Bellavista si prende il campo!"],
                    ["cp_tito", "Tutti in campo! Forza Soliti Ignoti!"]
                  ], () => {
                    setStep(3);
                    quest("Affronta la Contrada del Gufo nella Semifinale sul sagrato!");
                    done();
                  });
                }]
              ]);
            });
          });
        } else {
          say([
            ["cp_peppe", "La botte è sigillata con sei giri di spago e pece greca. Ora pensiamo a vincere la semifinale contro i Gufi!"]
          ], done);
        }
      },

      cp_gufo(K) {
        say([
          ["cp_gufo", "[sbatte i tacchetti ferrati sui ciottoli con ghigno beffardo] Guarda guarda chi c'è: i ladruncoli dell'oratorio e il loro campione della domenica!"],
          ["hero", "Risparmia il fiato per la partita, capitano del Gufo. Il sagrato di Rocca Campanaria ha visto campioni ben più furbi di voi."],
          ["cp_gufo", "Noi giochiamo col favore delle tenebre e il pressing del falco! Se provate a tirare a campana, i miei mediani vi masticheranno gli scarpini!"]
        ], () => {
          ask("Disputa la Semifinale contro la Contrada del Gufo a I Cento Rintocchi?", [
            ["Gioca la Semifinale (I Cento Rintocchi)", () => {
              K.rintocchiMatch({
                turns: 6,
                us: "I Soliti Ignoti",
                opp: {
                  name: "Contrada del Gufo",
                  color: "#1e1b4b",
                  style: "pressing",
                  players: [{ name: "Gufo Grigio" }, { name: "Becco Storto" }],
                  keeper: { name: "Portiere Notturno" }
                }
              }, (res) => {
                if (res && res.win) {
                  say([
                    ["cp_gufo", "[a terra col fiatone e la maglia infangata] Impossibile... quel pallonetto a foglia morta ha scavalcato la nostra barriera come una saetta benedetta!"],
                    ["cp_peppe", "[solleva il Campione sopra le spalle in trionfo] RETE! SIAMO IN FINALE! Don Crispino sta già suonando le campanelle della sacrestia!"],
                    ["cp_tito", "E ora manca solo l'ultimo atto: la finale di mezzanotte contro i Campanari di San Pancrazio per salvare il borgo!"]
                  ], () => {
                    bond("popolo", 40);
                    bond("battacchi", 85);
                    questDone();
                    finishChapter(2, "Vittoria epica nella semifinale contro la Contrada del Gufo! Il borgo è con te: ora resta solo la finalissima sotto i cento rintocchi di mezzanotte.");
                  });
                } else {
                  say([
                    ["cp_gufo", "[ride con arroganza] Ve l'avevo detto! Le tenebre del Gufo inghiottono ogni finta! Ritenta se ne hai il coraggio!"]
                  ], done);
                }
              });
            }],
            ["Ripassa lo schema con Peppe e Tito", done]
          ]);
        });
      }
    };

    return {
      n: N,
      title: "L'Officina del Colpo & La Semifinale delle Contrade",
      desc: "L'incursione nell'Officina di Peppe, la refurtiva nella botte e la trionfale semifinale contro la Contrada del Gufo.",
      goal: () => goal(S()),
      start: "cp_vicolo",
      zones,
      talk,
      intro: () => {
        setStep(0);
        return [["voce", "<b>LA NOTTE DEI CENTO RINTOCCHI</b> · Capitolo 2. Il Sindaco minaccia di demolire il campetto se la campana non riappare. La pista porta dritta all'officina di Peppe nel Vicolo dei Fabbri."]];
      }
    };
  }

  boot();
})();
