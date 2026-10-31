// js/zampano-c2.js - «IL CIRCO ZAMPANÒ» · Capitolo 2: La Corda Tagliata
// Qualcuno ha tranciato il cavo maestro del generatore dietro il serraglio: parte l'indagine nel Dossier («cavo») scandita dall'orologio di fiera,
// Golia e Pippo aggiungono due nuovi numeri al Cartellone e tra i carri nella bruma ti sbarra il passo Monsieur Frusta.
(function () {
  "use strict";
  function boot() {
    const E = window.__zampanoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__zampanoH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__zampanoH(K), { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("ci_c2", { kind: "shirt", label: "Gilet d'oro da giocoliere", val: "#d97706", from: "Capitolo 2 del Circo Zampanò" });
    K.lore("l_serraglio", { t: "Il serraglio senza gabbie", d: "Nel Circo Zampanò non ci sono tigri in catene: solo tre barboncini matematici, un mulo filosofo che tira il carro cucina e il generatore diesel battezzato «Beppino»." });
    K.lore("l_imperiale", { t: "Il Gran Circo Imperiale", d: "Fondato dal Barone Orloff rilevando dodici piccole compagnie indebitate. Tre piste sincronizzate col fischietto, divise viola e oro e nessun posto per chi improvvisa." });

    const goal = (s) => ({
      0: "Il viale della fiera è senza corrente. Parla con Maestro Zampanò al centro del viale.",
      1: "Entra nel Carro-Serraglio (a nord-ovest) ed esamina il generatore (G). Raccogli indizi in Biglietteria e parla con Golia, Pippo e Zia Wanda.",
      2: "▶ PISTA ACROBATICA: regola il Cartellone (A) e insegui il sabotatore oltre il varco dei carri (X, a nord).",
      3: "Monsieur Frusta presidia il recinto col rocchetto di rame: affrontalo dal varco dei carri (X).",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      setStep(N, 4); F.set("ci_c2_done", true);
      K.reward("ci_c2", { coins: 95, cos: "ci_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Quando Golia riallaccia il rocchetto di rame recuperato, cento lampadine dorate tornano ad accendersi tutte insieme lungo il viale della fiera."],
        ["ci_zampano", "[serio] Adesso sappiamo che non è stata la salsedine a spezzare quel cavo. Tieni da conto il Dossier, campione: prima del Gran Gala faremo i conti davanti al ragionier Bacci."],
        ["ci_wanda", "Domani tireremo le funi alte della cupola. E il Barone Orloff verrà a bussare coi guanti bianchi."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>👏 Applausi ${K.stat("applausi")} · 🗂️ Voci Dossier ${K.dossier.list("cavo").length}/4 · Contraddizioni ${K.dossier.found("cavo")}/2`],
        ["voce", "Il Capitolo 3 ti aspetta: «Sotto la Cupola»."]
      ]), () => K.openMain(), "ci_fiera");
    }

    function afterBoss() {
      K.learnLore("l_imperiale"); K.bond("applausi", 3);
      say("voce", "Monsieur Frusta atterra col cilindro di traverso in una cesta di coriandoli e batte in ritirata tra i tendaggi viola lasciando a terra il rocchetto di rame di scorta.");
      say("ci_tonio", "[felice] Hai visto che faccia quando gli hai rimandato indietro il birillo in piroetta? Valeva doppio biglietto!");
      return wask("Sul rocchetto recuperato brilla il timbro del deposito portuale. Cosa fai sapere lungo il viale della fiera?", [
        { label: "🎪 «Rassicuriamo la gente: stasera le luci brillano più di prima!»", w: { cuore: 2 }, fn: () => { K.bond("applausi", 1); say("ci_ercole", "[felice] Così si parla! Vado a scaldare le castagne per tutta la fila!"); fin(); } },
        { label: "👑 «Mostriamo a Bacci che il nostro impianto è a prova di sabotaggio.»", w: { prestigio: 2 }, fn: () => { F.set("ci_bacci_avvisato", true); say("ci_bacci", "[serio] Prendo nota a verbale: ripristino eseguito a regola d'arte."); fin(); } },
        { label: "«Teniamo le prove in tasca finché Orloff non scopre le carte.»", w: { cuore: 1, prestigio: 1 }, fn: () => { F.set("ci_prudenza_c2", true); say("ci_zampano", "[pensa] Mosse calme e funi tese: mi piace come ragioni."); fin(); } }
      ]);
    }

    function runPista2() {
      H.level("pista2", "ci_pippo", "Tra i carri nella bruma i giocolieri viola tirano birilli: ribattili in aria con 🎪 e sfrutta i nuovi numeri del Cartellone!", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          K.bond("applausi", 2);
          if (K.clock) K.clock.advance(1);
          say("ci_pippo", "[felice] Li abbiamo raggiunti fino al recinto di fondo! Guarda chi c'è accanto al nostro rocchetto di rame!");
          quest("ci_q2c", "Il recinto d'ottone", "Torna al varco dei carri (X) e affronta Monsieur Frusta.");
          return done();
        }
        say("ci_ercole", r.quit ? "Passa dal leggio (A) per abbinare Bilanciere e Birilli: ti danno un pezzo di costume in più!" : "Quei barboncini corrono svelti: saltali sui trampolini e riprova!");
        done();
      });
    }

    function runFrusta() {
      H.level("frusta", "ci_ercole", "Monsieur Frusta lancia birilli prima di balzare: respingili in piroetta e colpiscilo appena riprende fiato!", (r) => {
        if (r.win) return afterBoss();
        say("ci_tonio", "Occhio al salto lungo di Frusta: tieniti vicino ai trampolini laterali!"); done();
      });
    }

    function gate() {
      const s = S();
      if (s < 2) {
        say("voce", s === 0 ? "Il varco tra i carri porta verso il retro della fiera. Prima parla con Maestro Zampanò." : "Prima esamina il generatore spento (G) dentro il Carro-Serraglio a nord-ovest.");
        return done();
      }
      if (s === 2) return ask(`Oltre il varco si intravedono lanterne viola nella bruma. Scaletta: ${K.billboard.statusTxt()}.`, [
        { label: "🚃 Insegui tra i carri nella bruma", sub: "Livello a scorrimento · I carri nella bruma", big: true, cls: "hot", fn: runPista2 },
        { label: "📋 Cambia la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(gate, true) },
        { label: "🗂️ Apri il Dossier del cavo", sub: `${K.dossier.list("cavo").length}/4 voci raccolte`, fn: () => K.dossier.open("cavo", gate, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Nel recinto illuminato Monsieur Frusta fa schioccare il frustino da parata accanto al cavo rubato.", [
        { label: "🎩 Affronta Monsieur Frusta", sub: "Capo · Il recinto d'ottone", big: true, cls: "hot", fn: runFrusta },
        { label: "🚃 Rigioca i carri nella bruma", sub: "Per raccogliere le Coccarde d'oro", fn: runPista2 },
        { label: "📋 Cambia la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(gate, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "Il viale dei carri è tornato tranquillo e illuminato."); done();
    }

    const talk = {
      ci_zampano() {
        if (K.rel.scene("ci_zampano")) return;
        const s = S();
        if (s === 0) {
          if (K.clock) K.clock.set(1, 0);
          K.inv.give("ci_chiave_carro"); K.learnLore("l_serraglio");
          say("ci_zampano", "[arrabbiata] Guarda i festoni, campione: spenti! Ieri sera, subito dopo la prova, il generatore «Beppino» si è ammutolito di colpo.");
          say("ci_zampano", "Bacci sostiene che sia vecchiaia dei fili e minaccia di revocare il collaudo. Ma io conosco i miei rami: prendi la Chiave d'ottone del serraglio (🎒 Zaino) e controlla il generatore (G) a nord-ovest.");
          say("ci_zampano", "Già che ci sei, parla con Golia, Pippo e Zia Wanda: raccogli tutto nel Dossier e aggiungi nuovi numeri al Cartellone!");
          setStep(N, 1); quest("ci_q2", "Il cavo maestro", "Esamina il generatore (G) nel Carro-Serraglio e raccogli prove sul guasto.");
          return done();
        }
        say("ci_zampano", `Hai ${K.dossier.list("cavo").length}/4 voci nel Dossier. Confrontale dal Diario o dal varco dei carri per trovare le contraddizioni!`);
        done();
      },
      ci_ercole() {
        if (K.rel.scene("ci_ercole")) return;
        if (!K.billboard.unlocked("pesi")) {
          K.billboard.unlock("pesi");
          say("ci_ercole", "[serio] Hanno aspettato che andassi a scaldare il minestrone per toccare il generatore. Chi è stato sapeva benissimo quale cavo tagliare.");
          say("ci_ercole", "[felice] Da stasera scendo in pista anch'io: «Il Bilanciere di Golia» è nel Cartellone! Ti dà un pezzo di costume in più nei livelli, e con i birilli di Pippo fa scintille.");
          return done();
        }
        say("ci_ercole", "Controlla il generatore (G) qui nell'angolo a sinistra se non l'hai ancora fatto: il taglio sul rame parla chiaro."); done();
      },
      ci_pippo() {
        if (K.rel.scene("ci_pippo")) return;
        if (!K.dossier.has("cavo", "turno_pippo")) {
          K.dossier.add("cavo", "turno_pippo"); K.billboard.unlock("clave");
          say("ci_pippo", "[sorpreso] Ti giuro che dopo le nove non ho visto entrare anima viva! Però... quando sono tornato di Sera a spegnere l'occhio di bue, la leva del quadro era ancora tiepida.");
          say("ci_pippo", "[felice] Ho segnato la testimonianza nel Dossier! E ho aggiunto «I Lampi di Pippo» al Cartellone: attira i gettoni vicini come una calamita!");
          if (K.clock) return K.clock.advance(1, done);
          return done();
        }
        say("ci_pippo", "Se metti in Cartellone i miei birilli insieme al bilanciere di Golia o alla tromba di Tonio, sblocchiamo una sinergia speciale!"); done();
      },
      ci_wanda() {
        if (K.rel.scene("ci_wanda")) return;
        if (!K.dossier.has("cavo", "testimone_wanda")) {
          const isSera = K.clock && K.clock.is("Sera");
          K.dossier.add("cavo", "testimone_wanda");
          if (isSera) K.bond("applausi", 1);
          say("ci_wanda", "[serio] Proprio a quest'ora della Sera stavo rammendando una mantella alla finestra: ho visto un mantello viola sgattaiolare dietro il generatore!");
          say("ci_wanda", "E non poteva essere il ragionier Bacci, perché nello stesso minuto lo sentivo contare ad alta voce le marche da bollo dentro la Biglietteria. Confronta questa voce con quella di Pippo nel Dossier!");
          return done();
        }
        say("ci_wanda", "Apri il Dossier dal Taccuino: tocca due voci che non tornano tra loro per smascherare la bugia."); done();
      },
      ci_bacci() {
        if (K.rel.scene("ci_bacci")) return;
        if (!K.dossier.has("cavo", "ricevuta")) {
          say("ci_bacci", "[serio] Io ieri di Sera non mi sono mosso da questo sportello! Anzi, un fattorino distratto ha lasciato sul bancone (E) una bolla del traghetto che non è nemmeno vostra.");
          return done();
        }
        say("ci_bacci", "Una bolla intestata al Gran Circo Imperiale per cesoie al nichel? Mmm... conservila bene nel Dossier, giovanotto."); done();
      }
    };

    const zones = {
      ci_fiera: {
        region: "spiazzo", name: "Il Viale della Fiera", short: "Fiera", sub: "Chioschi illuminati a metà tra il serraglio e la biglietteria", bg: "ci_fiera", time: "sera", w: 30, h: 22, base: "Z", start: [15, 19],
        itemCos: "ci_c2", items: [[2, 11], [27, 11], [14, 16], [26, 19]],
        areas: [[2, 3, 11, 9, "Il Carro-Serraglio"], [19, 3, 27, 9, "La Biglietteria"], [12, 0, 17, 3, "Il varco dei carri"], [0, 0, 29, 21, "Il Viale della Fiera"]],
        flavor: { A: "Il leggio del Cartellone coi numeri sbloccati per la serata.", C: "Picchetto di tenuta: le corde reggono anche la nebbia salmastra.", E: "Banco di mandorle tostate e mele candite.", n: "Avviso comunale: «VERIFICA IMPIANTO ELETTRICO IN CORSO».", s: "Panca di legno asciutta vicino alle lanterne.", l: "Lanterna da campo accesa a petrolio in attesa della corrente." },
        npcs: () => [{ id: "ci_zampano", at: [15, 11] }, { id: "ci_pippo", at: [10, 14] }, { id: "ci_wanda", at: [19, 14] }],
        intro: [["voce", "Il giorno dopo, lungo il Viale della Fiera, i festoni di lampadine pendono spenti nella bruma autunnale."], ["voce", "Maestro Zampanò ti aspetta in mezzo al viale con una lanterna a olio in mano, tra il Carro-Serraglio a ovest e la Biglietteria a est."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); put(14, 1, "X"); put(15, 1, "X");
          lay(0, 2, 0, 21, "t"); lay(29, 2, 29, 21, "t"); lay(1, 21, 28, 21, "I"); put(14, 21, "Z"); put(15, 21, "Z");
          house(3, 4, 8, 5, { door: [7, 8], roof: "#b45309", wall: "#fef3c7", enter: { to: "ci_serraglio", at: [8, 9] } });
          house(20, 4, 7, 5, { door: [23, 8], roof: "#1d4ed8", wall: "#eff6ff", enter: { to: "ci_biglietteria", at: [8, 9] } });
          house(3, 15, 6, 4, { door: [5, 18], roof: "#7f1d1d", wall: "#fde68a", enter: "Il carro della banda: spartiti di marce, piatti d'ottone e una grancassa rammendata." });
          house(21, 15, 6, 4, { door: [23, 18], roof: "#6d28d9", wall: "#f3e8ff", enter: "Il deposito dei manifesti: rotoli di carta profumati di colla di farina." });
          put(12, 3, "A"); put(15, 8, "n"); put(14, 13, "E"); put(9, 19, "s");
          [[11, 3], [18, 3], [11, 12], [18, 12]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S(), on = s >= 2 && s <= 3;
          H.plaque(g, on ? "▶ VARCO DEI CARRI ▲" : "VARCO ▲", d.X(14) + 16, d.Y(2) + 2, on ? "#fde047" : "#fef3c7");
          H.plaque(g, "⚡ SERRAGLIO", d.X(7) + 8, d.Y(4) - 6, s === 1 ? "#fde047" : "#fed7aa");
          H.plaque(g, "🎟️ BIGLIETTERIA", d.X(23) + 8, d.Y(4) - 6, "#bfdbfe");
        }
      },
      ci_serraglio: {
        interior: true, region: "carro", name: "Il Carro-Serraglio", short: "Serraglio", sub: "Il generatore «Beppino», attrezzi di ghisa e fieno pulito", bg: "ci_serraglio", w: 16, h: 11, start: [8, 9], outside: ["ci_fiera", 7, 9], base: "Y",
        flavor: { G: "Il generatore diesel «Beppino» con il cavo maestro penzolante.", P: "I bilancieri di ghisa vera di Golia: cinquanta chili per parte.", b: "Sgabello da officina accanto alla cassetta delle chiavi inglesi." },
        npcs: () => [{ id: "ci_ercole", at: [7, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          put(3, 2, "G"); put(4, 2, "G"); put(12, 2, "P"); put(13, 6, "P"); put(5, 6, "b");
        },
        decor(g, cx, cy, d) { H.plaque(g, "⚡ GENERATORE", d.X(3) + 16, d.Y(2) - 8, "#38bdf8"); }
      },
      ci_biglietteria: {
        interior: true, region: "tendone", name: "La Biglietteria", short: "Biglietteria", sub: "Rotoli di biglietti rosa, timbri a tampone e bolle di carico", bg: "ci_biglietteria", w: 16, h: 11, start: [8, 9], outside: ["ci_fiera", 23, 9], base: "Y",
        flavor: { E: "Lo sportello d'ottone con i registri bollati e una ricevuta del traghetto.", V: "Vetrina con le tariffe popolari del Circo Zampanò.", T: "Tavolo dei conteggi pieno di monete da dieci lire e marche da bollo." },
        npcs: () => [{ id: "ci_bacci", at: [7, 5] }],
        loot: { "13,2": { id: "ci_zucchero", text: "Dentro la scatola di latta dietro lo sportello trovi un Cono di zucchero filato messo in serbo (🎒 Zaino).", empty: "La scatola contiene solo matrici di biglietti staccati." } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 4, 10, 7, "U");
          put(3, 2, "E"); put(4, 2, "E"); put(10, 2, "V"); put(6, 7, "T"); put(13, 2, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SPORTELLO & BOLLE", d.X(4) + 8, d.Y(2) - 8, "#fde68a"); }
      }
    };

    return {
      n: N, title: "La Corda Tagliata", sub: "Un cavo tranciato col nichel, quattro indizi nel Dossier e un inseguimento nella bruma",
      goal, start: "ci_fiera", introBg: "ci_fiera", zones, talk,
      obj: {
        "ci_fiera:X": () => gate(),
        "ci_fiera:A": () => K.billboard.open(() => K.done(), true),
        "ci_fiera:s": () => ask("Vuoi sederti sulla panca e lasciar scorrere un turno d'orologio sulla fiera?", [
          { label: "🕒 Aspetta la fascia successiva", fn: () => K.clock.advance(1, done) },
          { label: "↩ Rialzati subito", fn: done }
        ]),
        "ci_serraglio:G": () => {
          if (!K.dossier.has("cavo", "cesoia")) {
            K.dossier.add("cavo", "cesoia"); K.inv.give("ci_cesoia_prova");
            if (S() < 2) setStep(N, 2);
            K.questDone && K.questDone("ci_q2");
            quest("ci_q2b", "Sulle tracce del rame", "Raccogli le altre voci per il Dossier o attraversa il varco dei carri (X) a nord.");
            say("voce", "Esamini il cavo maestro di «Beppino»: altro che usura! Il rame è tagliato di netto e nella guaina brilla una Scaglia di nichel (🎒 Zaino).");
            say("voce", "Voce aggiunta al Dossier: «Taglio netto col nichel». Ora il varco dei carri (X) a nord della fiera è aperto!");
            return done();
          }
          say("voce", "Il taglio obliquo sul cavo maestro mostra chiaramente l'impronta di una cesoia al nichel."); done();
        },
        "ci_biglietteria:E": () => {
          if (!K.dossier.has("cavo", "ricevuta")) {
            K.dossier.add("cavo", "ricevuta");
            say("voce", "Sotto il tampone dell'inchiostro spunta una bolla portuale: due cesoie isolate al nichel consegnate ieri al «Gran Circo Imperiale · conto Orloff»!");
            say("voce", "Voce aggiunta al Dossier! Apri il Dossier dal Taccuino per confrontarla col taglio sul cavo.");
            return done();
          }
          say("voce", "Hai già copiato gli estremi della bolla portuale nel Dossier."); done();
        }
      },
      intro: [
        ["voce", "All'alba la nebbia del mare è salita fino a Pian dei Venti, e con la nebbia è arrivato il silenzio del generatore."],
        ["voce", "Senza luce elettrica la prova serale salta e l'ordinanza di sgombero torna sul tavolo: tocca capire chi ha messo mano ai cavi nella notte."]
      ]
    };
  }
  boot();
})();
