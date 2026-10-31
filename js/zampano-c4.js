// js/zampano-c4.js - «IL CIRCO ZAMPANÒ» · Capitolo 4: Il Gran Gala delle Rondini
// La sera del tutto esaurito a Pian dei Venti: il verdetto del Dossier davanti al ragionier Bacci, la Scaletta definitiva dei 3 numeri sul Cartellone,
// la parata acrobatica del Gran Gala e lo scontro al centro dell'arena col Barone Orloff. Quattro finali: carovana, stabile, imperiale, stellare (segreto).
(function () {
  "use strict";
  function boot() {
    const E = window.__zampanoCore;
    if (!E || !E.api || !E.api.addChapter || !window.__zampanoH || !window.__scorri) return setTimeout(boot, 100);
    E.api.addChapter(chapter4);
  }
  function chapter4(K) {
    const { setStep, quest, F } = K, H = window.__zampanoH(K), { say, done, ask } = H;
    const N = 4, S = () => K.stepOf(N);
    H.people();
    K.cos("ci_c4", { kind: "shirt", label: "Frac d'oro del Gran Gala", val: "#eab308", from: "Finale del Circo Zampanò" });
    K.lore("l_rondini", { t: "Il Salto delle Rondini", d: "Il numero leggendario creato da Maestro Zampanò e sua moglie Adele nel 1948: trapezio, tromba dal vivo, specchi e pallone lanciato a sedici metri d'altezza." });

    const goal = (s) => ({
      0: "Piazzale del Gran Gala. Pronuncia il verdetto sul cavo tranciato parlando col ragionier Bacci al centro.",
      1: "Entra nell'Arena del Gala (a est) e conferma con Maestro Zampanò la Scaletta definitiva sul Cartellone.",
      2: "▶ PISTA ACROBATICA: apri il sipario d'oro (X) nell'Arena per la Parata del Gran Gala!",
      3: "Il Barone Orloff è sceso al centro della pista: affrontalo dal sipario d'oro (X) nell'Arena.",
      4: "Il Circo Zampanò ha trovato il suo destino."
    }[s] || "La storia del Circo Zampanò è conclusa.");

    const ENDS = {
      carovana: {
        coins: 150, bg: "ci_finale",
        lines: [
          ["ci_zampano", "[commosso] Straccia pure quell'assegno, Barone! Finché abbiamo sette carri dipinti e una tromba intonata a metà, la strada è casa nostra!"],
          ["ci_lila", "[felice] All'alba si smonta verso la Riviera di Ponente, campione! Ma a ottobre torniamo qui: tieni il picchetto d'ottone in borsa!"],
          ["voce", "Quando il sole spunta dietro il faro del Borgo Marino, la fila dei carri cremisi e oro scende cantando lungo i tornanti, libera come il vento."]
        ]
      },
      stabile: {
        coins: 160, bg: "ci_finale",
        lines: [
          ["ci_bacci", "[felice] Visto il verbale sul sabotaggio e il trionfo unanime delle gradinate, il Comune concede a Pian dei Venti la licenza permanente di «Teatro Tenda Civico Zampanò»!"],
          ["ci_ercole", "[felice] Niente più sgomberi! Posso piantare l'orto di basilico dietro il carro cucina!"],
          ["voce", "Ogni domenica d'autunno e d'inverno il tendone cremisi si illumina sopra il Borgo Marino, scuola aperta di trapezio, musica e pallone."]
        ]
      },
      imperiale: {
        coins: 130, bg: "ci_ingresso",
        lines: [
          ["ci_orloff", "[serio] Scelta ragionevole. Da domani nuove insegne dorate, biglietti numerati e tournée nelle capitali sotto il marchio Imperiale."],
          ["ci_zampano", "[triste] Almeno i ragazzi avranno un tetto asciutto e paghe puntuali... anche se il velluto viola non profuma come la nostra vecchia tela."],
          ["voce", "I riflettori del Gran Circo Imperiale brillano altissimi nella notte, ma in fondo al baule Tonio conserva di nascosto il vecchio picchetto d'ottone."]
        ]
      },
      stellare: {
        coins: 220, bg: "ci_finale",
        lines: [
          ["voce", "Tutti e sei gli artisti scendono in pista nello stesso istante: Tonio attacca il valzer, Golia alza le pedane, Pippo accende i birilli, Wanda e Miranda tendono un ponte di luce fino a Lila."],
          ["ci_lila", "[felice] Prendi lo slancio sul mio anello, campione! È il Salto delle Rondini d'Oro!"],
          ["voce", "Voli da un lato all'altro della cupola palleggiando con la sfera cremisi tra una pioggia di coriandoli: perfino il Barone Orloff si toglie il cilindro e applaude in piedi."],
          ["ci_zampano", "[commosso] Quarant'anni che aspettavo di rivederlo... Adele, hai visto lassù? Il Circo Zampanò non finirà mai!"]
        ]
      }
    };

    function ending(id) {
      const E2 = ENDS[id];
      setStep(N, 4); F.set("ci_c4_done", true); F.set("ci_fine_" + id, true);
      K.reward("ci_c4_" + id, { coins: E2.coins, cos: "ci_c4" });
      K.finishChapter(N, id); K.end(id);
      K.scene(H.flush().concat(E2.lines).concat([
        ["voce", `<b>FINE DEL CIRCO ZAMPANÒ.</b><br>👏 Applausi ${K.stat("applausi")} · 🎪 Cuore ${K.stat("cuore")} · 👑 Prestigio ${K.stat("prestigio")} · 🏵️ Coccarde ${K.scroll.total()[0]}/${K.scroll.total()[1]}`],
        ["voce", "Dal menu puoi rigiocare tutte le piste acrobatiche. Nella Sala Giochi del Salone ti aspetta il cabinato «La Pista Acrobatica»!"]
      ]), () => K.openMain(), E2.bg);
    }

    function finale() {
      K.learnLore("l_rondini"); K.bond("applausi", 4);
      say("voce", "L'ultimo salto fa volare il cilindro nero del Barone Orloff proprio in grembo al ragionier Bacci, mentre tremila mani battono a tempo dalle gradinate fino al prato esterno!");
      say("ci_zampano", "[commosso] Silenzio in pista, amici! Tocca al nostro acrobata chiudere la serata e decidere che strada prende il Circo Zampanò!");
      const okStabile = F.is("ci_sabotaggio_provato") || K.stat("prestigio") >= 4;
      const allActs = K.billboard.list().length >= 6;
      const synOk = K.billboard.seenSynergyCount() >= 2;
      const dosOk = F.is("ci_sabotaggio_provato") || K.dossier.solid("cavo") >= 1;
      const relOk = K.rel.lv("ci_lila") >= 2 && K.rel.lv("ci_tonio") >= 2;
      const okSecret = allActs && synOk && dosOk && relOk;
      return ask("Sotto il fascio dorato dell'occhio di bue tutta la compagnia ti stringe intorno. Quale futuro scegli per il tendone?", [
        { label: "🎪 Ripartire liberi coi sette carri dipinti", sub: "La Carovana Libera · cuore e strada aperta", big: true, fn: () => ending("carovana") },
        { label: "🏛️ Fondare il Teatro Tenda stabile del Borgo", sub: okStabile ? "Il Teatro Tenda del Borgo" : "Serve aver provato il sabotaggio o Prestigio ≥ 4", disabled: !okStabile, big: true, fn: () => ending("stabile") },
        { label: "🎩 Firmare la fusione col Gran Circo Imperiale", sub: "Sotto l'Insegna d'Oro · ricchezza senza rischi", big: true, fn: () => ending("imperiale") },
        { label: "🌟 Eseguire tutti insieme il Salto delle Rondini d'Oro", sub: okSecret ? "Segreto sbloccato: 6 numeri, sinergie, Dossier e legami!" : `Segreto: 6 numeri (${K.billboard.list().length}/6), ≥2 sinergie (${K.billboard.seenSynergyCount()}/2), Dossier e legami con Lila e Tonio`, disabled: !okSecret, cls: okSecret ? "hot" : "", big: true, fn: () => ending("stellare") }
      ]);
    }

    function runPista4() {
      H.level("pista4", "ci_zampano", "Signore e signori, ecco la Parata del Gran Gala! Vola tra coriandoli, trampolini e anelli d'oro fino al centro dell'arena!", (r) => {
        if (r.win) {
          if (S() === 2) setStep(N, 3);
          K.bond("applausi", 3);
          say("ci_tonio", "[felice] Le gradinate stanno venendo giù dagli applausi! Ma guarda chi è saltato in mezzo al cerchio di segatura!");
          say("ci_orloff", "[arrabbiata] Basta dilettanti! Vi mostro io come si domina un'arena Imperiale!");
          quest("ci_q4c", "Il duello del Barone", "Torna al sipario d'oro (X) e affronta il Barone Orloff.");
          return done();
        }
        say("ci_lila", r.quit ? "Ritocca pure la Scaletta al leggio (A) prima di rientrare!" : "Un respiro profondo e si riparte: il pubblico fa il tifo per te!");
        done();
      });
    }

    function runOrloff() {
      H.level("orloff", "ci_lila", "Orloff lancia birilli e solleva doppie onde nella segatura quando atterra: usa gli anelli e i trampolini, poi colpiscilo quando riprende fiato!", (r) => {
        if (r.win) return finale();
        return ask("Il Barone Orloff punta il bastone d'argento: «Riprovi a sfidarmi in pista o firmi subito la resa al Gran Circo Imperiale?»", [
          { label: "🤸 Torno in piedi: la pista non si vende!", cls: "hot", fn: done },
          { label: "📜 Cedi la pista e accetta l'Insegna d'Oro", fn: () => ending("imperiale") }
        ]);
      });
    }

    function galaCurtain() {
      const s = S();
      if (s === 0) { say("voce", "Prima di aprire il Gran Gala devi chiudere il verbale col ragionier Bacci fuori nel piazzale."); return done(); }
      if (s === 1) { say("voce", "Parla con Maestro Zampanò qui nell'Arena per confermare i tre numeri del Cartellone del Gala."); return done(); }
      if (s === 2) return ask(`I tamburi rullano dietro il velluto cremisi. Scaletta del Gala: ${K.billboard.statusTxt()}.`, [
        { label: "🌟 Apri il sipario · La Parata del Gran Gala", sub: "Livello a scorrimento · La parata del Gran Gala", big: true, cls: "hot", fn: runPista4 },
        { label: "📋 Ritocca la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(galaCurtain, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      if (s === 3) return ask("Al centro del cerchio illuminato il Barone Orloff si toglie i guanti bianchi per l'ultima sfida.", [
        { label: "👑 Affronta il Barone Orloff", sub: "Capo finale · Il cerchio del Barone", big: true, cls: "hot", fn: runOrloff },
        { label: "🌟 Rigioca la Parata del Gran Gala", sub: "Per raccogliere le Coccarde d'oro", fn: runPista4 },
        { label: "📋 Ritocca la Scaletta", sub: K.billboard.statusTxt(), fn: () => K.billboard.open(galaCurtain, true) },
        { label: "↩ Non ancora", fn: done }
      ]);
      say("voce", "Nella segatura brillano ancora i coriandoli d'oro del Gran Gala."); done();
    }

    const talk = {
      ci_bacci() {
        if (K.rel.scene("ci_bacci")) return;
        if (S() === 0) {
          return K.dossier.verdict("cavo", done, true, (id, solid) => {
            setStep(N, 1); K.questDone && K.questDone("ci_q4");
            quest("ci_q4b", "La Scaletta del Gala", "Entra nell'Arena (a est) e conferma il Cartellone con Maestro Zampanò.");
            if (id === "orloff" && solid >= 0.5) {
              F.set("ci_sabotaggio_provato", true); K.bond("prestigio", 2); K.bond("applausi", 2);
              say("ci_bacci", "[sorpreso] Bolla del traghetto al nichel e mantello viola visto di Sera... Non fa una piega! Annullo l'ordinanza di sgombero e metto a verbale la diffida per il signor Orloff!");
            } else if (id === "orloff") {
              K.bond("cuore", 1);
              say("ci_bacci", "[serio] L'accusa è grave ma vi mancava qualche riscontro incrociato nel Dossier. Vi lascio comunque fare lo spettacolo di stasera: decidano gli applausi!");
            } else if (id === "incidente") {
              F.set("ci_caso_chiuso", true); K.bond("cuore", 1);
              say("ci_bacci", "Apprezzo la prudenza. Impianto riparato, verbale archiviato: potete entrare nell'Arena per il Gran Gala.");
            } else {
              K.bond("prestigio", -1);
              say("ci_bacci", "[arrabbiata] Accusare me?! Con trent'anni di servizio immacolato?! Meno male che Maestro Zampanò mi ha offerto una sedia in prima fila... andate in Arena, su!");
            }
            done();
          });
        }
        say("ci_bacci", F.is("ci_sabotaggio_provato") ? "[felice] Verbale cristallino! Stasera mi godo lo spettacolo dalla tribuna d'onore." : "Lo spettacolo può cominciare: vi aspetto in prima fila!");
        done();
      },
      ci_zampano() {
        if (K.rel.scene("ci_zampano")) return;
        if (S() === 0) { say("ci_zampano", "Prima consegna il verdetto del Dossier al ragionier Bacci fuori nel piazzale d'ingresso!"); return done(); }
        if (S() === 1) {
          say("ci_zampano", "[felice] Ci siamo, campione! Riempiamo le tre cornici del Cartellone per il Gran Gala: ogni applauso e ogni sinergia contano!");
          const l = H.flush();
          return K.say(l, () => K.billboard.open(done, true, {
            min: 2, big: true, confirmLabel: "✨ Conferma la Scaletta del Gala",
            onConfirm: (res) => {
              if (!F.is("ci_gala_bonus")) { F.set("ci_gala_bonus", true); K.bond("applausi", Math.min(6, res.applause)); }
              setStep(N, 2); K.questDone && K.questDone("ci_q4b");
              quest("ci_q4p", "Sipario d'oro", "Varca il sipario (X) nell'Arena per iniziare il Gran Gala!");
              say("ci_zampano", `[felice] Scaletta approvata (+${res.applause} Applausi)! Quando sei pronto, varca il sipario d'oro (X) qui dietro!`);
              done();
            }
          }));
        }
        say("ci_zampano", "Il pubblico è tutto in piedi: apri il sipario d'oro (X)!"); done();
      },
      ci_lila() {
        if (K.rel.scene("ci_lila")) return;
        say("ci_lila", "[felice] Ho intrecciato nastri cremisi sui trapezi: stasera dall'alto vedremo brillare tutto il golfo!"); done();
      },
      ci_tonio() {
        if (K.rel.scene("ci_tonio")) return;
        if (!K.billboard.unlocked("fanfara")) K.billboard.unlock("fanfara");
        say("ci_tonio", "[felice] Ho lucidato la tromba col limone fino a specchiarmici dentro! Se non hai ancora scoperto almeno due Sinergie nel Cartellone, provale ora al leggio!");
        done();
      },
      ci_wanda() {
        if (K.rel.scene("ci_wanda")) return;
        ["trapezio", "fanfara", "pesi", "clave", "tarocchi", "filo"].forEach((id) => { if (F.is("ci_c3_done") && id === "filo") K.billboard.unlock("filo"); });
        say("ci_wanda", "Tutti i bottoni d'oro sono cuciti a filo doppio. Se ti mancavano numeri dei camerini, controlla pure il Cartellone prima di entrare in pista!");
        done();
      },
      ci_orloff() {
        if (K.rel.scene("ci_orloff")) return;
        say("ci_orloff", "[serio] Godetevi le lampadine colorate finché durano: ci rivediamo al centro dell'arena."); done();
      },
      ci_pippo() {
        if (K.rel.scene("ci_pippo")) return;
        say("ci_pippo", "[felice] Coda fino alla fontana del Borgo! Non si vedeva tanta gente a Pian dei Venti dal cinquantasei!"); done();
      }
    };

    const zones = {
      ci_ingresso: {
        region: "gala", name: "Il Piazzale del Gran Gala", short: "Ingresso Gala", sub: "Tappeto cremisi, fiaccole e tutto il Borgo Marino in fila", bg: "ci_ingresso", time: "notte", w: 30, h: 22, base: "Q", start: [15, 19],
        itemCos: "ci_c4", items: [[2, 11], [27, 11], [14, 16], [26, 19]],
        areas: [[2, 3, 11, 9, "I Camerini"], [19, 3, 27, 9, "L'Arena del Gala"], [11, 10, 19, 15, "Il tappeto rosso"], [0, 0, 29, 21, "Piazzale del Gala"]],
        flavor: { E: "Chiosco gran gala: mandorle pralinate, gazzosa e coccarde cremisi.", I: "Cordoni di velluto tirati lungo il tappeto rosso.", n: "Cartellone luminoso: «STASERA · IL GRAN GALA DELLE RONDINI · TUTTO ESAURITO».", s: "Panchina d'onore sotto i festoni accesi.", l: "Lampione a cinque globi dorati." },
        npcs: () => [{ id: "ci_bacci", at: [15, 11] }, { id: "ci_orloff", at: [10, 14] }, { id: "ci_pippo", at: [19, 14] }],
        intro: [["voce", "Domenica sera. Pian dei Venti brilla come una nave pavesata a festa sospesa tra le colline e il mare."], ["voce", "Sul tappeto cremisi il ragionier Bacci attende il tuo verdetto sul Dossier prima di lasciar suonare la prima fanfara."]],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 29, 1, "I"); lay(0, 2, 0, 21, "t"); lay(29, 2, 29, 21, "t"); lay(1, 21, 28, 21, "I"); put(14, 21, "Q"); put(15, 21, "Q");
          lay(13, 9, 16, 20, "U");
          house(3, 4, 8, 5, { door: [7, 8], roof: "#9f1239", wall: "#ffe4e6", enter: { to: "ci_camerini", at: [8, 9] } });
          house(20, 4, 7, 5, { door: [23, 8], roof: "#b91c1c", wall: "#fef08a", enter: { to: "ci_arena", at: [8, 9] } });
          house(3, 15, 6, 4, { door: [5, 18], roof: "#78350f", wall: "#fef3c7", enter: "Il guardaroba degli ospiti: cappotti della domenica e ombrelli appesi in ordine." });
          house(21, 15, 6, 4, { door: [23, 18], roof: "#1e3a8a", wall: "#dbeafe", enter: "La cassa centrale: il cartello «TUTTO ESAURITO» dondola dietro il vetro." });
          put(15, 8, "n"); put(12, 16, "E"); put(17, 16, "E"); put(9, 19, "s");
          [[11, 4], [19, 4], [12, 12], [17, 12]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, "🎭 CAMERINI", d.X(7) + 8, d.Y(4) - 6, "#fecdd3");
          H.plaque(g, "🌟 ARENA DEL GALA", d.X(23) + 8, d.Y(4) - 6, s >= 1 ? "#fde047" : "#fef08a");
        }
      },
      ci_camerini: {
        interior: true, region: "carro", name: "I Camerini degli Artisti", short: "Camerini", sub: "Specchiere accese, cipria, trombe lucidate e fiori freschi", bg: "ci_camerini", w: 16, h: 11, start: [8, 9], outside: ["ci_ingresso", 7, 9], base: "Y",
        flavor: { V: "Le lampadine attorno allo specchio scaldano i mazzi di garofani rossi.", M: "I costumi del Gran Gala scintillano a ogni passo.", P: "Birilli e trombe pronti per l'entrata trionfale." },
        npcs: () => [{ id: "ci_tonio", at: [6, 5] }, { id: "ci_wanda", at: [10, 5] }],
        chests: { "13,2": { coins: 40, text: "Nella cappelliera d'onore trovi la busta premio della vigilia!" } },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 4, 10, 7, "U");
          put(3, 2, "V"); put(5, 2, "V"); put(10, 2, "M"); put(13, 6, "P"); put(13, 2, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CAMERINI DI GALA", d.X(8) + 8, d.Y(0) + 6, "#fde68a"); }
      },
      ci_arena: {
        interior: true, region: "gala", name: "L'Arena del Gran Gala", short: "Arena", sub: "Tremila spettatori, velluto cremisi e riflettori d'oro", bg: "ci_arena", w: 16, h: 11, start: [8, 9], outside: ["ci_ingresso", 23, 9], base: "Q",
        flavor: { X: "Il grande sipario dorato dell'ultima serata.", A: "Il leggio d'onore con la Scaletta del Gran Gala.", K: "Le gradinate gremite fino all'ultimo ordine di posti." },
        npcs: () => [{ id: "ci_zampano", at: [6, 5] }, { id: "ci_lila", at: [10, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Q"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          lay(5, 3, 10, 7, "U");
          put(7, 1, "X"); put(8, 1, "X"); put(12, 2, "A");
          lay(2, 2, 4, 2, "K"); lay(2, 7, 4, 7, "K"); lay(12, 7, 13, 7, "K"); put(5, 1, "l"); put(10, 1, "l");
        },
        decor(g, cx, cy, d) {
          const s = S(), on = s >= 2 && s <= 3;
          H.plaque(g, on ? "▶ SIPARIO DEL GALA" : "ARENA", d.X(7) + 16, d.Y(1) - 6, on ? "#fde047" : "#fecdd3");
          H.plaque(g, "📋 CARTELLONE", d.X(12) + 8, d.Y(2) - 8, "#fde68a");
        }
      }
    };

    return {
      n: N, title: "Il Gran Gala delle Rondini", sub: "Il verdetto sul sabotaggio, i tre numeri della serata d'onore e il destino della pista",
      goal, start: "ci_ingresso", introBg: "ci_ingresso", zones, talk,
      obj: {
        "ci_arena:X": () => galaCurtain(),
        "ci_arena:A": () => K.billboard.open(() => K.done(), true)
      },
      intro: [
        ["voce", "È arrivata la sera del Gran Gala delle Rondini. Dal porto alle vigne, mezzo Borgo Marino è salito sotto il tendone cremisi."],
        ["voce", "Tocca chiudere i conti col sabotaggio del cavo, comporre la Scaletta perfetta e volare per l'ultima volta sotto la cupola."]
      ]
    };
  }
  boot();
})();
