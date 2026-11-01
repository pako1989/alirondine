// js/tipografia-c4.js — «LA TIPOGRAFIA DI MEZZANOTTE» · Capitolo 4: Rotativa a Tutta Velocità
// Largo del Municipio e Stadio (32×24), Sala del Consiglio Comunale (18×13) e Sala della Rotativa Marinoni (18×14).
// Verdetto pubblico col Dossier, accensione della grande rotativa del 1928 per l'Edizione Straordinaria (Numero 4),
// sfida finale contro la Real Stampa Moderna (con gli ombrelli neri anti-flash!) e risoluzione di tutti e 4 i finali.
(function () {
  "use strict";
  function boot() {
    const E = window.__tipografiaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__tipografiaH || !window.__flash68) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }

  function chapter4(K) {
    const { setStep, quest, F } = K;
    const H = window.__tipografiaH(K);
    const { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);

    H.people();
    K.cos("tp_c4", { kind: "glasses", label: "Occhiali da tipografo in tartaruga", val: "#78350f", from: "Capitolo 4 de La Tipografia di Mezzanotte" });
    K.lore("l_marinoni", {
      t: "La Rotativa Marinoni del 1928",
      d: "Tre cilindri di ghisa arrivati in treno da Parigi: quando prende il giro massimo fa vibrare i cucchiaini nei bar di tutta la piazza e sforna dodicimila copie l'ora."
    });

    const goal = (s) => ({
      0: "Largo del Municipio. Entra nella Sala del Consiglio Comunale (al centro-nord) e presenta il Verdetto del Dossier davanti ai consiglieri.",
      1: "Entra nella Sala della Rotativa Marinoni (a nord-ovest), riaccendi i rulli con Mastro Goffredo e stampa l'Edizione Straordinaria al Bancone (A).",
      2: "▶ FINALE ALLO STADIO: varca il cancello dello Stadio delle Acacie (X) a nord-est e batti la Real Stampa Moderna!",
      3: "La storia de L'Eco del Pallone ha trovato il suo finale."
    }[s] || "La saga è conclusa.");

    function canSecretEnding() {
      return !!(
        F.is("tp_nando_roll") &&
        K.press.publishedCount() >= 4 &&
        F.is("tp_verdetto_ok") &&
        K.rel.lv("tp_clara") >= 2 &&
        K.rel.lv("tp_goffredo") >= 2 &&
        F.is("tp_final_flash")
      );
    }

    function concludeEnding(endId) {
      setStep(N, 3);
      F.set("tp_c4_done", true);
      K.end(endId);
      K.reward("tp_c4", { coins: 150, cos: "tp_c4" });
      if (K.api && K.api.bCos) K.safe(() => K.api.bCos("sm_tipografia"));
      K.finishChapter(N, endId);

      const scenesByEnd = {
        cooperativa: [
          ["voce", "All'alba di lunedì davanti al chiosco verde di Oreste c'è una coda che gira l'angolo: operai, insegnanti, tranvieri e ragazzi in maglia verde stringono ciascuno una quota da mille lire."],
          ["tp_ada", "[commosso] «L'Eco del Pallone — Società Cooperativa di Lettori e Tipografi». Né padroni né palazzinari: solo il quartiere e il suo campo salvo per sempre."],
          ["tp_goffredo", "[felice] Ho insegnato ai due apprendisti come regolare il calamaio della Marinoni. Adesso posso anche sedermi in tribunetta a guardare il secondo tempo!"],
          ["voce", `<b>FINALE · LA COOPERATIVA DEI LETTORI</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")}`]
        ],
        settantamila: [
          ["voce", "Il rombo della Marinoni non si ferma nemmeno a mezzogiorno: tre furgoncini partono da Piazza delle Edicole verso tutte le vallate e la riviera."],
          ["tp_tino", "[felice] Settantamila copie vendute! Il Corriere Veloce di Sartori è rimasto a pile alte mezzo metro sui banchi, mentre l'Eco non basta più!"],
          ["tp_ada", "[felice] Con gli incassi delle vendite abbiamo riscattato la carta, rinnovato gli spogliatoi delle Acacie e assunto due giovani cronisti a tempo pieno!"],
          ["voce", `<b>FINALE · SETTANTAMILA COPIE</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")}`]
        ],
        riunita: [
          ["voce", "In Municipio viene firmato il lodo civico: il Campo delle Acacie resta intoccabile e verde, mentre «L'Eco del Pallone» si trasforma nel grande Settimanale del Lunedì per contenere i costi."],
          ["tp_beppe", "[felice] Meno nottatacce al piombo, ma ogni lunedì mattina al Bar Sport non c'è una sedia libera per leggere le pagelle!"],
          ["tp_ada", "Nessuno ha perso il posto e le porte di legno sono ancora lì sotto le acacie. A volte saper tenere unita la squadra vale quanto una goleada."],
          ["voce", `<b>FINALE · LA REDAZIONE RIUNITA</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")}`]
        ],
        nando: [
          ["voce", "Mentre la folla porta in trionfo la squadra dallo Stadio delle Acacie fino alle edicole, Oreste sventola una busta gialla delle Poste appena recapitata al chiosco."],
          ["tp_clara", "[sorpreso] È un fonogramma urgente da Parigi! Leggi forte, Ada!"],
          ["tp_ada", "[commosso] «HO VISTO LE FOTO DI CLARA E IL TITOLO DEL ROGITO 1921 SUI GIORNALI EUROPEI. ARRIVO COL TRENO DELLE SETTE: TENETEMI CALDA LA LINOTYPE E LA MAGLIA NUMERO OTTO. — NANDO»."],
          ["tp_goffredo", "[commosso] Ragazzo mio... stasera fondiamo due righe col vostro cognome affiancato in prima pagina, come avevo sempre sognato."],
          ["tp_clara", "[felice] Mettetevi vicini davanti alla rotativa: questa foto non va in archivio, va nella storia di Borgo Alta!"],
          ["voce", `<b>🌟 FINALE SEGRETO · L'EDIZIONE STRAORDINARIA DI NANDO</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")} · Tutte le 4 edizioni in archivio!`]
        ]
      };

      K.scene(H.flush().concat(scenesByEnd[endId] || scenesByEnd.riunita), () => K.openMain(), "tp_finale");
    }

    function afterFinalMatch(r) {
      if ((r.perfectShots | 0) >= 1) F.set("tp_final_flash", true);
      K.bond("copie", 6 + (r.perfectShots | 0));
      say("voce", "Triplice fischio allo Stadio delle Acacie! Gli ombrelli neri di Stampa Moderna giacciono chiusi a bordo campo mentre tutta la gradinata verde sventola l'Edizione Straordinaria!");
      say("tp_sartori", F.is("tp_verdetto_ok")
        ? "[arrabbiato] Avete vinto sia in aula sia sull'erba... Ritiro la variante edilizia. Tenetevi il vostro prato e il vostro odore di piombo!"
        : "[serio] Sul prato ci avete dato una lezione. Ritiro le ruspe dalle Acacie, ma per tenere in piedi il giornale dovrete scegliere bene la vostra strada.");

      const secretOk = canSecretEnding();
      const veritaHigh = K.stat("verita") >= K.stat("tiratura") && F.is("tp_verdetto_ok");
      const tiraturaHigh = K.stat("tiratura") > K.stat("verita") || K.stat("copie") >= 16;

      const opts = [];
      if (secretOk) {
        opts.push({
          label: "🌟 Apri il telegramma dell'alba e firma con Nando il nuovo Numero Uno!",
          sub: "Finale Segreto sbloccato: Rullino di Nando + 4 Edizioni + Dossier perfetto + Legami + Scatto in finale!",
          big: true,
          cls: "hot",
          fn: () => concludeEnding("nando")
        });
      }
      opts.push({
        label: "🖋️ Fonda la Cooperativa Popolare dei Lettori e dei Tipografi",
        sub: F.is("tp_verdetto_ok") ? "Azionariato diffuso di quartiere per un giornale libero" : "Richiede aver vinto il Verdetto del Dossier contro Sartori",
        big: veritaHigh && !secretOk,
        cls: veritaHigh && !secretOk ? "hot" : "",
        disabled: !F.is("tp_verdetto_ok"),
        fn: () => concludeEnding("cooperativa")
      });
      opts.push({
        label: "📰 Rilancia la rotativa Marinoni in tutta la provincia (Settantamila Copie!)",
        sub: tiraturaHigh ? "Sfida commerciale aperta alle grandi testate regionali" : "Espandi la diffusione grazie all'entusiasmo delle edicole",
        big: tiraturaHigh && !secretOk,
        cls: tiraturaHigh && !secretOk ? "hot" : "",
        fn: () => concludeEnding("settantamila")
      });
      opts.push({
        label: "🤝 Firma il Patto Civico del Lunedì (La Redazione Riunita)",
        sub: "Salva il Campo delle Acacie e trasforma l'Eco nello storico settimanale sportivo del Borgo",
        big: !F.is("tp_verdetto_ok") && !secretOk,
        fn: () => concludeEnding("riunita")
      });

      return ask("Attorno al Bancone di Piombo tutta la redazione aspetta la tua decisione sul futuro de «L'Eco del Pallone».", opts);
    }

    function playFinalBoss() {
      H.flashMatch({
        title: "GRAN FINALE · U.S. Acacie '68 vs Real Stampa Moderna",
        venue: "stadio",
        boss: true,
        umbrellas: true,
        opp: "Real Stampa Moderna",
        oppColor: "#c83228",
        oppStyle: "pressing",
        durSec: 42
      }, "tp_clara", "Sartori ha dato gli ombrelli neri anti-flash ai suoi difensori! Premi prima ⚽ PASSA per far girare palla di lato: così aprano la guardia e il mio 📸 FLASH li abbaglierà in pieno!", (r) => {
        if (r.win) return afterFinalMatch(r);
        say("tp_ada", r.quit
          ? "Prendi fiato: lo Stadio delle Acacie ti aspetta quando sei pronto."
          : "Ricorda il trucco contro gli ombrelli neri: smista prima palla col tasto ⚽ PASSA e subito dopo scatta col 📸 FLASH di Clara!");
        done();
      });
    }

    function councilSession() {
      if (S() > 0) {
        say("voce", F.is("tp_verdetto_ok")
          ? "Il Consiglio Comunale ha già annullato la perizia d'inagibilità tra gli applausi del pubblico!"
          : "La seduta del Consiglio si è aggiornata al termine dell'incontro allo Stadio delle Acacie.");
        return done();
      }
      // Assicuriamoci che eventuali indizi mancanti siano consultabili ma premiamo chi ha collegato le contraddizioni
      return ask(`Nella Sala del Consiglio il Sindaco batte il martelletto. Nel Dossier hai ${K.dossier.list("acacie").length}/4 voci e ${K.dossier.found("acacie")}/2 collegamenti dimostrati.`, [
        {
          label: "🗂️ Esamina e collega prima le voci nel Dossier",
          sub: "Confronta a coppie trave segata + negativo e velina + rogito 1921",
          fn: () => K.dossier.open("acacie", () => councilSession(), true)
        },
        {
          label: "⚖️ Pronuncia il Verdetto pubblico davanti al Consiglio!",
          sub: "Presenta la tua conclusione ufficiale sul caso delle Acacie",
          big: true,
          cls: "hot",
          fn: () => K.dossier.verdict("acacie", () => councilSession(), true, (vid, solid) => {
            if (vid === "sartori" && (solid >= 0.5 || K.dossier.list("acacie").length >= 3)) {
              F.set("tp_verdetto_ok", true);
              K.bond("verita", 2);
              K.bond("copie", 3);
              setStep(N, 1);
              quest("tp_q4a", "L'Edizione Straordinaria", "Vai nella Sala della Rotativa Marinoni (a nord-ovest) e stampa il Numero 4 al Bancone (A)!");
              say("tp_pavan", F.is("tp_pavan_graziato")
                ? "[commosso] Non avete messo il mio nome nei pettegolezzi... e io dirò tutta la verità al Sindaco: la perizia me l'ha dettata l'ufficio legale del Commendator Sartori!"
                : "[sorpreso] Quel rogito del 1921 e la foto notturna sono autentici, signor Sindaco... ritiro immediatamente la firma dalla perizia!");
              say("tp_sartori", "[arrabbiato] Le carte non bastano a riempire uno stadio! Vediamo se la vostra squadretta di quartiere regge novanta minuti contro la mia Real Stampa Moderna!");
              return done();
            }
            F.set("tp_verdetto_ok", false);
            setStep(N, 1);
            quest("tp_q4a", "L'Edizione Straordinaria", "Vai nella Sala della Rotativa Marinoni (a nord-ovest) e stampa il Numero 4 al Bancone (A)!");
            say("voce", "Il Consiglio sospende la delibera chiedendo una prova sul campo: tutto si deciderà tra la Rotativa e lo Stadio delle Acacie!");
            done();
          })
        },
        { label: "↩ Raccogli le idee", fn: done }
      ]);
    }

    function openFinalPress() {
      if (S() < 1) {
        say("tp_goffredo", "Prima passa in Sala del Consiglio Comunale qui fuori in piazza per il verdetto sulle carte!");
        return done();
      }
      if (!F.is("tp_marinoni_on")) {
        F.set("tp_marinoni_on", true);
        K.learnLore("l_marinoni");
        K.press.unlock("lead_v4", true);
        K.press.unlock("lead_t4", true);
        K.press.unlock("photo_4", true);
        K.press.unlock("col_4", true);
        K.press.assign("lead", K.stat("verita") >= K.stat("tiratura") ? "lead_v4" : "lead_t4");
        K.press.assign("photo", "photo_4");
        K.press.assign("col", "col_4");
      }
      K.press.open(() => {
        if (S() === 1 && K.press.edition(4)) {
          setStep(N, 2);
          K.questDone && K.questDone("tp_q4a");
          quest("tp_q4b", "Tutti allo Stadio delle Acacie!", "Esci sul Largo e varca l'ingresso dello Stadio (X) a nord-est per la sfida finale!");
          say("tp_goffredo", "[commosso] Sentila ruggire, la vecchia Marinoni! «" + K.press.latestHeadline() + "» corre sui rulli! Adesso va' allo Stadio (X) e firma l'ultimo gol!");
          return done();
        }
        done();
      }, true, S() === 1 ? {
        edition: 4,
        confirmLabel: "🖨️ Avvia la Marinoni · Edizione Straordinaria!",
        prompt: "Componi il Numero 4 · Edizione Straordinaria (Titolo finale, Foto della folla e Spalla anti-ombrelli)!"
      } : {});
    }

    function stadiumGate() {
      if (S() < 2) {
        say("voce", S() === 0
          ? "Le tribune si stanno riempiendo: prima presenta il Dossier in Sala del Consiglio Comunale!"
          : "Prima accendi la Rotativa Marinoni e manda in stampa il Numero 4 · Edizione Straordinaria!");
        return done();
      }
      if (S() === 2) {
        return ask(`Lo Stadio delle Acacie ribolle di sciarpe verdi e copie fresche di «${K.press.latestHeadline()}». In campo ti attende la Real Stampa Moderna!`, [
          { label: "👑 Gioca la Finale · Flash & Contropiede '68", sub: "Capo finale · Real Stampa Moderna con ombrelli anti-flash", big: true, cls: "hot", fn: playFinalBoss },
          { label: "📰 Rivedi l'archivio al Bancone di Piombo", sub: K.press.statusTxt(), fn: openFinalPress },
          { label: "↩ Non ancora", fn: done }
        ]);
      }
      say("voce", "Lo Stadio delle Acacie canta ancora per la vostra vittoria.");
      done();
    }

    const talk = {
      tp_ada() {
        if (K.rel.scene("tp_ada")) return;
        if (S() === 0) return councilSession();
        say("tp_ada", S() === 1
          ? "Vai nella Sala della Rotativa Marinoni a nord-ovest: Mastro Goffredo ha già montato la grande bobina per il Numero 4!"
          : "Tutta Borgo Alta è sugli spalti dello Stadio (X) a nord-est: vai a prenderti il futuro dell'Eco!");
        done();
      },
      tp_pavan() {
        if (K.rel.scene("tp_pavan")) return;
        if (S() === 0) return councilSession();
        say("tp_pavan", F.is("tp_verdetto_ok")
          ? "[felice] Mi sono tolto un macigno dallo stomaco! Oggi tifo anch'io per l'U.S. Acacie, cascasse il mondo!"
          : "Speriamo che sul prato vinciate voi, così in Comune nessuno oserà più riparlare di ruspe...");
        done();
      },
      tp_sartori() {
        if (K.rel.scene("tp_sartori")) return;
        if (S() === 0) return councilSession();
        say("tp_sartori", "[serio] Ho ingaggiato tre terzini di categoria superiore e li ho dotati di ombrelli neri contro quella vostra fotografa impicciona. Vi aspetto allo Stadio (X)!");
        done();
      },
      tp_goffredo() {
        if (K.rel.scene("tp_goffredo")) return;
        if (S() === 1 && !F.is("tp_marinoni_on")) return openFinalPress();
        say("tp_goffredo", S() < 1
          ? "Passa prima in Municipio da Ada per far valere il nostro Dossier!"
          : S() === 1
            ? "Tocca il Bancone (A) qui accanto ai cilindri della Marinoni e lancia l'Edizione Straordinaria!"
            : "[commosso] Tre cilindri che girano senza un tremito... vai allo Stadio (X), ragazzo!");
        done();
      },
      tp_clara() {
        if (K.rel.scene("tp_clara")) return;
        say("tp_clara", S() < 2
          ? "Ho caricato una pellicola speciale ad alta sensibilità per la finale: appena stampi il Numero 4 ci vediamo a bordo campo!"
          : "[felice] Ricordati: se cerchi il Finale Segreto, segna almeno uno Scatto Perfetto col mio 📸 FLASH durante la finale!");
        done();
      },
      tp_oreste() {
        if (K.rel.scene("tp_oreste")) return;
        say("tp_oreste", `[felice] Guarda che festa sul Largo! Sulle civette brilla «${K.press.latestHeadline()}» e ho già prenotato altre tremila copie!`);
        done();
      },
      tp_tino() {
        if (K.rel.scene("tp_tino")) return;
        say("tp_tino", S() < 2
          ? "Il furgoncino ha il motore acceso: appena esce l'Edizione Straordinaria tappezziamo pure le bandierine del calcio d'angolo!"
          : "[felice] Il cancello dello Stadio (X) è qui sopra! Facciamoli girare a vuoto coi loro ombrelloni!");
        done();
      },
      tp_beppe() {
        if (K.rel.scene("tp_beppe")) return;
        say("tp_beppe", "[felice] Ho chiuso il Bar Sport col cartello: «TUTTI ALLE ACACIE — OFFRE BEPPE SE SI VINCE!»");
        done();
      },
      tp_livia() {
        if (K.rel.scene("tp_livia")) return;
        say("tp_livia", "[commosso] Vedere quel rogito del 1921 aperto sul banco del Consiglio Comunale avrebbe reso fiero mio padre.");
        done();
      }
    };

    const zones = {
      tp_largo: {
        region: "largo",
        name: "Largo del Municipio & Stadio",
        short: "Municipio",
        sub: "Il Palazzo Civico in festa, la Sala della Rotativa e i cancelli gremiti delle Acacie",
        bg: "tp_largo",
        time: "tramonto",
        w: 32,
        h: 24,
        base: "Q",
        start: [16, 20],
        itemCos: "tp_c4",
        items: [[4, 13], [27, 15], [15, 16], [10, 21]],
        areas: [
          [2, 2, 11, 9, "Sala Rotativa Marinoni"],
          [12, 2, 20, 9, "Palazzo del Municipio"],
          [21, 2, 30, 10, "Ingresso Stadio Acacie"],
          [3, 14, 13, 21, "Piazzetta delle Edicole"],
          [0, 0, 31, 23, "Largo del Municipio"]
        ],
        flavor: {
          E: "L'edicola festiva del Largo, addobbata con coccarde verdi e avorio.",
          P: () => `Grande civetta d'onore davanti al Municipio: «${K.press.latestHeadline()}».`,
          F: "La fontana monumentale del Municipio circondata dai tifosi.",
          K: "Spalti esterni dello Stadio delle Acacie già gremiti fino all'ultimo posto.",
          R: " pile freschissime dell'Edizione Straordinaria pronte per la distribuzione.",
          V: "Il caldarrostaio distribuisce cartocci caldi ai bambini in attesa del fischio d'inizio.",
          n: "Ordine del giorno affisso all'albo pretorio: «DELIBERA STRAORDINARIA SUL CAMPO DELLE ACACIE»."
        },
        npcs: () => [
          { id: "tp_oreste", at: [8, 16] },
          { id: "tp_beppe", at: [13, 15] },
          { id: "tp_livia", at: [18, 14] },
          { id: "tp_tino", at: [23, 11] },
          { id: "tp_clara", at: [26, 11] }
        ],
        intro: [
          ["voce", "Domenica pomeriggio in Largo del Municipio. Tutta Borgo Alta si è riversata tra il Palazzo Civico, i finestroni vibranti della Rotativa Marinoni e i cancelli dello Stadio delle Acacie."],
          ["voce", "È l'ora dell'Ultima Edizione — o della prima di una storia tutta nuova."]
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "t");
          lay(0, 1, 31, 1, "Q");
          lay(0, 2, 0, 23, "t");
          lay(31, 2, 31, 23, "t");
          lay(1, 23, 30, 23, "t");
          lay(2, 22, 13, 22, "I");
          lay(18, 22, 29, 22, "I");
          lay(14, 23, 17, 23, "Q");

          // Tappeto cerimoniale verso il Municipio e prato verso lo Stadio
          lay(14, 8, 17, 22, "U");
          lay(2, 10, 29, 12, "Y");
          lay(21, 13, 29, 21, "Z");

          // Edifici: Sala Rotativa Marinoni (NO) e Palazzo del Municipio (Centro-Nord)
          house(2, 2, 9, 6, { door: [6, 7], roof: "#991b1b", wall: "#f5ebd6", enter: { to: "tp_rotativa", at: [9, 11] } });
          house(12, 2, 8, 6, { door: [16, 7], roof: "#9a3412", wall: "#fde68a", enter: { to: "tp_consiglio", at: [9, 10] } });

          // Nord-Est: Cancello monumentale dello Stadio delle Acacie (X) e gradinate (K)
          lay(22, 3, 29, 4, "K");
          lay(22, 5, 29, 8, "Z");
          put(25, 6, "X"); put(26, 6, "X");
          put(22, 8, "P"); put(29, 8, "R");

          // Centro e Sud-Ovest: Fontana, edicola, caldarroste, panchine, alberi d'acacia
          put(15, 14, "F"); put(16, 14, "F");
          put(19, 13, "n"); put(12, 14, "s");
          put(5, 15, "E"); put(6, 15, "E"); put(8, 15, "P");
          put(10, 18, "V"); put(4, 18, "R");
          put(23, 16, "t"); put(28, 18, "t"); put(25, 19, "f"); put(6, 20, "f");

          [[11, 8], [20, 8], [11, 13], [20, 13], [23, 9], [28, 9], [14, 20]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, s === 1 ? "▶ ROTATIVA MARINONI" : "⚙️ SALA ROTATIVA", d.X(6) + 8, d.Y(2) - 4, s === 1 ? "#fde047" : "#fecaca");
          H.plaque(g, s === 0 ? "▶ CONSIGLIO COMUNALE" : "🏛️ MUNICIPIO", d.X(16) + 8, d.Y(2) - 4, s === 0 ? "#fde047" : "#fde68a");
          H.plaque(g, s === 2 ? "▶ FINALE STADIO!" : "🏟️ STADIO ACACIE", d.X(25) + 16, d.Y(6) - 8, s === 2 ? "#fde047" : "#bbf7d0");
        }
      },

      tp_consiglio: {
        interior: true,
        region: "barsport",
        name: "Sala del Consiglio Comunale",
        short: "Consiglio",
        sub: "Scanni di noce, gonfalone verde-oro e il banco delle prove pubbliche",
        bg: "tp_consiglio",
        w: 18,
        h: 13,
        start: [9, 10],
        outside: ["tp_largo", 16, 8],
        base: "U",
        flavor: {
          T: "Il grande banco consiliare su cui sono aperti il Dossier delle Acacie e la mappa catastale.",
          P: "Lo stemma storico del Comune di Borgo Alta scolpito nel noce.",
          K: "La tribuna del pubblico gremita di lettori dell'Eco.",
          L: "Raccolta delle delibere comunali dal 1920 a oggi."
        },
        npcs: () => [
          { id: "tp_ada", at: [7, 5] },
          { id: "tp_pavan", at: [9, 4] },
          { id: "tp_sartori", at: [11, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 12, "U");
          lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 12, "a"); lay(17, 0, 17, 12, "a"); lay(0, 12, 17, 12, "a");
          put(9, 12, "v");
          lay(5, 3, 12, 7, "Y");
          lay(6, 2, 11, 2, "T");
          put(4, 2, "P");
          lay(2, 4, 3, 8, "K"); lay(14, 4, 15, 8, "K");
          put(2, 2, "L"); put(15, 2, "L");
          put(5, 1, "l"); put(12, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, S() === 0 ? "⚖️ PRESENTA VERDETTO" : "AULA CONSILIARE", d.X(9) + 4, d.Y(2) - 6, S() === 0 ? "#fde047" : "#fde68a");
        }
      },

      tp_rotativa: {
        interior: true,
        region: "linotype",
        name: "Sala della Rotativa Marinoni",
        short: "Rotativa",
        sub: "Tre cilindri di ghisa del 1928, la bobina gigante e il profumo caldo dell'Edizione Straordinaria",
        bg: "tp_rotativa",
        w: 18,
        h: 14,
        start: [9, 11],
        outside: ["tp_largo", 6, 8],
        base: "U",
        flavor: {
          J: "I tre cilindri della Rotativa Marinoni 1928: acciaio lucido, ottone e inchiostro nero profumato.",
          A: "Il Bancone Maestro collegato direttamente alla lastra curva della rotativa.",
          R: "Bobine giganti di carta da giornale pronte per l'Edizione Straordinaria.",
          P: () => `Prima copia appena sfornata dai rulli: «${K.press.latestHeadline()}».`
        },
        npcs: () => [{ id: "tp_goffredo", at: [10, 6] }],
        chests: {
          "2,10": { coins: 35, text: "Nel cassetto degli attrezzi della Marinoni trovi trentacinque monete della cassa straordinaria!" }
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "U");
          lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(9, 13, "v");
          lay(4, 4, 13, 9, "Q");
          // Grande corpo centrale della Rotativa Marinoni (J) + Bancone Maestro (A)
          lay(7, 3, 11, 4, "J");
          put(5, 6, "A"); put(6, 6, "A");
          put(2, 3, "R"); put(3, 3, "R"); put(14, 3, "R"); put(15, 3, "R");
          put(14, 8, "P"); put(15, 8, "R");
          put(2, 10, "x");
          put(4, 1, "l"); put(13, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "⚙️ MARINONI 1928", d.X(9) + 8, d.Y(3) - 6, "#cbd5e1");
          H.plaque(g, S() === 1 ? "▶ STAMPA NUMERO 4!" : "📰 BANCONE MAESTRO", d.X(5) + 16, d.Y(6) - 7, S() === 1 ? "#fde047" : "#f5ebd6");
        }
      }
    };

    return {
      n: N,
      title: "Rotativa a Tutta Velocità",
      sub: "Il verdetto in Municipio, l'Edizione Straordinaria e l'ultima sfida allo Stadio delle Acacie",
      goal,
      start: "tp_largo",
      introBg: "tp_largo",
      zones,
      talk,
      obj: {
        "tp_consiglio:T": () => councilSession(),
        "tp_rotativa:A": () => openFinalPress(),
        "tp_largo:X": () => stadiumGate()
      },
      intro: () => [
        ["voce", "Domenica, l'ora della verità. Le campane del Municipio di Borgo Alta suonano per la seduta straordinaria sul destino del Campo delle Acacie."],
        ["voce", "Porta il Dossier in aula, accendi la grande rotativa Marinoni per il Numero 4 e scendi in campo davanti a tutto il quartiere!"]
      ]
    };
  }

  boot();
})();
