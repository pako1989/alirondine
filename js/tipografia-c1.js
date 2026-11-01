// js/tipografia-c1.js — «LA TIPOGRAFIA DI MEZZANOTTE» · Capitolo 1: Piombo Caldo
// Piazza delle Edicole (32×24), Sala Linotype (18×14) e Bar Sport & Totocalcio (16×13).
// Il Commendator Sartori taglia le forniture di carta e il geometra Pavan minaccia la chiusura del Campo delle Acacie.
// Raccogli le voci tra edicola e Bar Sport, componi il Numero 1 sul Bancone di Piombo e vinci la sfida nel Cortile delle Edicole!
(function () {
  "use strict";
  function boot() {
    const E = window.__tipografiaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__tipografiaH || !window.__flash68) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }

  function chapter1(K) {
    const { setStep, quest, F } = K;
    const H = window.__tipografiaH(K);
    const { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);

    H.people();
    K.cos("tp_c1", { kind: "hat", label: "Berretto da strillone '68", val: "#78350f", from: "Capitolo 1 de La Tipografia di Mezzanotte" });
    K.lore("l_eco21", {
      t: "L'Eco del Pallone (1921)",
      d: "Fondato nell'autunno del 1921 da undici tipografi e tranvieri di Borgo Alta: esce il giovedì e la domenica pomeriggio con l'odore inconfondibile d'inchiostro grasso e piombo caldo."
    });
    K.lore("l_linotype", {
      t: "La Linotype a 90 tasti",
      d: "Ogni riga del giornale nasce fondendo una barretta intera di lega tipografica («line of type») a duecentosettanta gradi: se sbagli una virgola, rifondi tutta la riga."
    });

    const goal = (s) => ({
      0: "Piazza delle Edicole, ottobre 1968. Entra nella Sala Linotype (a nord-ovest) e parla con la direttrice Ada Carattere.",
      1: "Raccogli i pezzi del Numero 1: parla con Clara Luce davanti all'edicola in piazza e con Beppe dentro il Bar Sport (a nord-est).",
      2: "Torna nella Sala Linotype e usa il Bancone di Piombo (A) per impaginare e mandare in stampa il Numero 1.",
      3: "▶ PARTITA: raggiungi il varco del Cortile delle Edicole (X) a sud-est della piazza e difendi i pacchi freschi col Flash di Clara!",
      4: "Il capitolo 1 è concluso."
    }[s] || "Il capitolo 1 è concluso.");

    function checkPiecesReady() {
      if (S() === 1 && F.is("tp_c1_clara") && F.is("tp_c1_beppe")) {
        setStep(N, 2);
        K.questDone && K.questDone("tp_q1a");
        quest("tp_q1b", "Visto, si stampi!", "Torna nella Sala Linotype, tocca il Bancone di Piombo (A) e manda in stampa il Numero 1.");
        say("voce", "Hai sia la foto di Clara sia il colonnino del Bar Sport! Torna al Bancone di Piombo (A) in tipografia per comporre la Prima Pagina.");
      }
    }

    function fin() {
      setStep(N, 4);
      F.set("tp_c1_done", true);
      K.reward("tp_c1", { coins: 80, cos: "tp_c1" });
      K.finishChapter(N, "ok");
      const head = K.press.latestHeadline();
      K.scene(H.flush().concat([
        ["voce", `I pacchi freschi con il titolo «${head}» volano di mano in mano sotto i portici di Piazza delle Edicole.`],
        ["tp_oreste", "[felice] Sessanta copie bruciate in dieci minuti! Nemmeno per la finale di Coppa avevo visto una fila così davanti al chiosco!"],
        ["tp_sartori", "[serio] Godetevi la serata, signorina Carattere. Domani mattina i miei periti saranno al Campo delle Acacie, e non basterà un foglio di provincia a fermare le gru."],
        ["tp_goffredo", "[serio] Ragazzo... prima di spegnere il crogiolo ho aperto il cassetto dove lavorava tuo fratello Nando prima di partire. C'è un rullino 35mm non ancora sviluppato."],
        ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")}`],
        ["voce", "Il Capitolo 2 ti aspetta: «Fango e Magnesio»."]
      ]), () => K.openMain(), "tp_edicole");
    }

    function afterMatch1(r) {
      K.bond("copie", 3 + (r.perfectShots ? 1 : 0));
      say("tp_tino", "[felice] Edizione straordinariaaa! Hai visto come sono rimasti di sale i fattorini di Sartori sul lampo al magnesio di Clara?!");
      say("tp_clara", r.perfectShots > 0
        ? `[felice] Ho contato ${r.perfectShots} scatti nitidissimi! Questa pellicola va dritta in prima pagina!`
        : "Bella vittoria! Nella prossima partita prova a premere 📸 FLASH proprio mentre il pallone passa nel mio riquadro d'oro!");
      say("tp_pavan", "[sorpreso] Io... io ero venuto soltanto a notificare il preavviso d'ispezione al Campo delle Acacie. Signorina Carattere, il Commendator Sartori offre di rilevare i vostri debiti se non uscite domenica...");
      return wask("Sotto il lampione dell'edicola il geometra Pavan porge una cartellina grigia col timbro di Stampa Moderna.", [
        {
          label: "🖋️ «Pubblicheremo ogni riga del verbale: i lettori hanno diritto ai fatti.»",
          w: { verita: 2 },
          fn: () => {
            F.set("tp_c1_linea", "verita");
            K.rel.add("tp_ada", 2);
            say("tp_ada", "[felice] Così parla un vero cronista dell'Eco. Riferisca pure al Commendatore che domenica saremo in edicola.");
            fin();
          }
        },
        {
          label: "📰 «Dica a Sartori che raddoppieremo le copie in tutta Borgo Alta!»",
          w: { tiratura: 2 },
          fn: () => {
            F.set("tp_c1_linea", "tiratura");
            K.rel.add("tp_tino", 2);
            K.bond("copie", 2);
            say("tp_tino", "[felice] Sentito, geometra?! Domenica ci vorranno due carrelli per portare i pacchi!");
            fin();
          }
        }
      ]);
    }

    function playCourtMatch() {
      H.flashMatch({
        title: "Cortile delle Edicole · L'Eco vs Fattorini Veloce",
        venue: "edicole",
        opp: "Fattorini Corriere Veloce",
        oppColor: "#c83228",
        oppStyle: "equilibrata",
        durSec: 34
      }, "tp_clara", "Corro io lungo le edicole col mirino d'oro! Porta palla nel riquadro e premi 📸 FLASH per abbagliarli e caricare la Rotativa!", (r) => {
        if (r.win) return afterMatch1(r);
        say("tp_ada", r.quit ? "Controlla pure i bonus della Prima Pagina al Bancone (A) quando vuoi." : "Non mollare: usa le balle di giornali agli angoli e il Flash di Clara per aprirci il varco!");
        done();
      });
    }

    function openBancone() {
      if (S() < 2 && !K.press.list().length) {
        say("tp_goffredo", "Il telaio di piombo è già caldo, ragazzo, ma parla prima con Ada per aprire l'impaginazione del Numero 1!");
        return done();
      }
      K.press.open(() => {
        if (S() === 2 && K.press.edition(1)) {
          setStep(N, 3);
          K.questDone && K.questDone("tp_q1b");
          quest("tp_q1c", "Difendi le edicole", "Esci in Piazza delle Edicole e vai al varco del Cortile (X) a sud-est per giocare la sfida.");
          say("tp_goffredo", "[felice] Il Numero 1 «" + K.press.latestHeadline() + "» è stampato! Ma fuori nel cortile gli uomini di Sartori stanno bloccando la distribuzione: corri al varco (X)!");
          return done();
        }
        done();
      }, true, S() === 2 ? {
        edition: 1,
        prompt: "Componi i 3 tagli del Numero 1 (Titolo, Foto di Clara e Spalla del Bar Sport), poi premi «Visto, si stampi!»."
      } : {});
    }

    function courtGate() {
      const s = S();
      if (s < 3) {
        say("voce", s < 2
          ? "Nel cortile dietro i chioschi Tino sta legando le balle di resa. Prima raccogli i pezzi e manda in stampa il Numero 1!"
          : "Manda prima in stampa il Numero 1 al Bancone di Piombo (A) nella Sala Linotype!");
        return done();
      }
      if (s === 3) {
        return ask(`Nel Cortile delle Edicole la squadra del Corriere Veloce sbarra il passo agli strilloni. In edicola: «${K.press.latestHeadline()}».`, [
          { label: "📸 Gioca Flash & Contropiede '68", sub: "Cortile delle Edicole · Sponde sulle balle di giornali", big: true, cls: "hot", fn: playCourtMatch },
          { label: "⚽ Risolvi con partita rapida sul selciato (a 2 gol)", sub: "Alternativa calcistica classica", fn: () => K.playMatch({
            id: "tp_m1_alt", oppTeam: "Fattorini Veloce", cageTarget: 2,
            done: (r) => { if (r && r.win) afterMatch1({ win: true, perfectShots: 0 }); else { say("tp_tino", "Riproviamo, non lasciamogli il cortile!"); done(); } }
          }) },
          { label: "📰 Rivedi il Bancone di Piombo", sub: K.press.statusTxt(), fn: openBancone },
          { label: "↩ Non ancora", fn: done }
        ]);
      }
      say("voce", "Il Cortile delle Edicole è libero. Dal menu puoi rigiocare un allenamento con Clara quando vuoi.");
      done();
    }

    const talk = {
      tp_ada() {
        if (K.rel.scene("tp_ada")) return;
        const s = S();
        if (s === 0) {
          say("tp_ada", "[felice] Sei arrivato! Tuo fratello Nando ci scriveva sempre che avevi il sinistro migliore della famiglia e l'occhio sveglio.");
          say("tp_ada", "[serio] Guarda qui sul bancone: stamattina il Commendator Sartori di «Stampa Moderna» ci ha tagliato il credito della carta e il geometra Pavan vuole chiudere il Campo delle Acacie per costruirci un condominio.");
          say("tp_ada", "Ho preparato due possibili titoli di testa per il Numero 1: uno d'inchiesta rigorosa e uno popolare a nove colonne. Ma ci mancano la foto centrale di Clara in piazza e il colonnino sportivo di Beppe al Bar Sport!");
          F.set("tp_divisa", true);
          K.learnLore("l_eco21");
          K.inv.give("tp_piombo_q");
          K.press.unlock("lead_v1", true);
          K.press.unlock("lead_t1", true);
          K.press.assign("lead", "lead_v1");
          setStep(N, 1);
          quest("tp_q1a", "Pezzi freschi per il Numero 1", "Parla con Clara Luce davanti all'edicola in piazza e con Beppe dentro il Bar Sport.");
          return done();
        }
        say("tp_ada", s === 1
          ? "Ci servono la foto di Clara in piazza e la spalla sportiva di Beppe al Bar Sport, poi serriamo la pagina al Bancone (A)!"
          : s === 2
            ? "Tocca il Bancone di Piombo (A) qui accanto: scegli quale titolo mandare in edicola e avvia la stampa!"
            : "Vai al Cortile delle Edicole (X) fuori in piazza: non lasceremo bloccare i nostri strilloni!");
        done();
      },
      tp_goffredo() {
        if (K.rel.scene("tp_goffredo")) return;
        K.learnLore("l_linotype");
        say("tp_goffredo", S() === 0
          ? "Parla con la direttrice Ada qui al centro, ragazzo: il piombo bolle a duecentosettanta gradi e non aspetta nessuno."
          : "Senti come canta la Linotype? Ti ho fuso una «Q» Bodoni portafortuna nello zaino: quando tutti e tre i tagli sono sul Bancone (A), tiriamo la prima copia!");
        done();
      },
      tp_clara() {
        if (K.rel.scene("tp_clara")) return;
        if (S() === 0) {
          say("tp_clara", "Entra prima in tipografia a parlare con Ada Carattere: io intanto misuro l'esposizione con la Rollei!");
          return done();
        }
        if (!F.is("tp_c1_clara")) {
          F.set("tp_c1_clara", true);
          K.press.unlock("photo_1");
          K.press.assign("photo", "photo_1");
          say("tp_clara", "[felice] Clack! Presa! Guarda i lucchetti nuovi che Pavan voleva appendere di nascosto: una composizione nitida da centro pagina.");
          say("tp_clara", "Ho mandato la lastra sul Bancone di Piombo! E ricordati: quando scenderemo in campo, tieni d'occhio il mio Riquadro d'Obiettivo dorato!");
          checkPiecesReady();
          return done();
        }
        say("tp_clara", "La mia foto «I lucchetti nuovi al cancello» è già sul Bancone: ti darà anche un rullino più rapido in partita!");
        done();
      },
      tp_beppe() {
        if (K.rel.scene("tp_beppe")) return;
        if (S() === 0) {
          say("tp_beppe", "Un caffè ristretto? Passa prima da Ada in Sala Linotype, ti sta aspettando col grembiule d'inchiostro!");
          return done();
        }
        if (!F.is("tp_c1_beppe")) {
          F.set("tp_c1_beppe", true);
          K.inv.give("tp_matita");
          K.press.unlock("col_1");
          K.press.assign("col", "col_1");
          say("tp_beppe", "[felice] Eccoti il mio colonnino tattico per la spalla destra, scritto sul retro di una schedina del Totocalcio! E tieni anche una Matita copiativa (🎒 Zaino).");
          say("tp_beppe", "Se serve uno stopper per liberare il cortile dai fattorini di Sartori, fischia pure: chiudo la macchina a leva e scendo in scarpini!");
          checkPiecesReady();
          return done();
        }
        if (!F.is("tp_c1_bar_match")) {
          return ask("Beppe lucida le tazzine: «Vuoi fare due scambi di riscaldamento qui fuori coi ragazzi del tram prima della gara vera?»", [
            {
              label: "⚽ Sgambata del Bar Sport (a 2 gol)",
              sub: "Amichevole facoltativa (+2k copie col passaparola)",
              fn: () => K.playMatch({
                id: "tp_am1", oppTeam: "Dopolavoro Tranvieri", cageTarget: 2,
                done: (r) => {
                  if (r && r.win) {
                    F.set("tp_c1_bar_match", true);
                    K.bond("copie", 2);
                    K.rel.add("tp_beppe", 2);
                    say("tp_beppe", "[felice] Che piede caldo! Mezzo Bar Sport ha già prenotato la copia di stasera!");
                  } else {
                    say("tp_beppe", "Buon allenamento lo stesso! Quando vuoi il caffè è sul fuoco.");
                  }
                  done();
                }
              })
            },
            { label: "↩ Più tardi", fn: done }
          ]);
        }
        say("tp_beppe", "[felice] Col mio colonnino in pagina i passaggi viaggiano come il direttissimo delle sette!");
        done();
      },
      tp_oreste() {
        if (K.rel.scene("tp_oreste")) return;
        say("tp_oreste", K.press.edition(1)
          ? `[felice] Guarda la mia civetta verde: «${K.press.latestHeadline()}»! Si legge fin dall'altra parte della fontana!`
          : "Da quarant'anni apro questa serranda verde alle cinque e mezza: senza L'Eco del Pallone la domenica mattina non profuma di niente.");
        done();
      },
      tp_tino() {
        if (K.rel.scene("tp_tino")) return;
        say("tp_tino", S() < 3
          ? "[felice] Appena mandi in macchina il Numero 1 al Bancone (A), vieni qui al varco del Cortile (X): facciamo correre quei figurini di Stampa Moderna!"
          : "[felice] Il varco del Cortile (X) è qui accanto! Io scatto sulla fascia e tu chiama il Flash di Clara!");
        done();
      },
      tp_pavan() {
        if (K.rel.scene("tp_pavan")) return;
        say("tp_pavan", "[serio] Ehm, io eseguo soltanto verifiche catastali di routine! Non guardatemi così, ho la pressione bassa quando sento odore d'inchiostro fresco...");
        done();
      }
    };

    const zones = {
      tp_edicole: {
        region: "edicole",
        name: "Piazza delle Edicole",
        short: "Edicole",
        sub: "Chioschi in ferro battuto verde, portici d'ocra e profumo di caldarroste",
        bg: "tp_edicole",
        time: "mattina",
        w: 32,
        h: 24,
        base: "Q",
        start: [16, 20],
        itemCos: "tp_c1",
        items: [[4, 12], [28, 11], [15, 16], [9, 21]],
        areas: [
          [2, 2, 12, 9, "Tipografia L'Eco del Pallone"],
          [20, 2, 30, 9, "Portico del Bar Sport"],
          [11, 9, 20, 16, "Fontana delle Quattro Stagioni"],
          [20, 15, 30, 22, "Cortile delle Edicole"],
          [0, 0, 31, 23, "Piazza delle Edicole"]
        ],
        loot: {
          "19,12": {
            id: "tp_castagne",
            text: "Accanto al braciere fumante il caldarrostaio ti allunga un Cartoccio di caldarroste bollenti per la redazione!",
            empty: "Il braciere scoppietta allegro nella brezza d'ottobre."
          }
        },
        flavor: {
          E: "L'edicola storica in ferro battuto verde smeraldo di Oreste, tappezzata di riviste e figurine del '68.",
          P: () => `La civetta su cavalletto strilla: «${K.press.latestHeadline()}».`,
          F: "La fontana ottagonale in ghisa di Borgo Alta: l'acqua canta fresca tra le foglie d'acacia.",
          V: "Il braciere delle caldarroste: cinque lire un cartoccio che profuma tutta la piazza.",
          R: "Balle di giornali appena legate con lo spago da pacchi.",
          I: "Ringhiera in ferro battuto verniciata di verde edicola.",
          n: "Bacheca comunale: «AVVISO DI SOPRALLUOGO AL CAMPO DELLE ACACIE — Impresa Costruzioni Sartori».",
          s: "Panchina in ghisa e listelli di rovere sotto i tigli d'autunno.",
          l: "Lampione a globo lattiginoso del 1930."
        },
        npcs: () => [
          { id: "tp_clara", at: [11, 13] },
          { id: "tp_oreste", at: [7, 14] },
          { id: "tp_tino", at: [23, 18] },
          { id: "tp_pavan", at: [17, 13] }
        ],
        intro: [
          ["voce", "Borgo Alta, ottobre 1968. In Piazza delle Edicole l'aria del mattino sa di piombo caldo, caffè tostato e caldarroste appena tolte dalla brace."],
          ["voce", "A nord-ovest batte la vetrina de «L'Eco del Pallone», a nord-est fuma l'insegna del Bar Sport, e al centro i chioschi verdi aspettano la prima edizione."]
        ],
        build(L) {
          const { lay, put, house } = L;
          // Cornice alberata e balaustra storica senza alcun rettangolo vuoto >5×5
          lay(0, 0, 31, 0, "t");
          lay(0, 1, 31, 1, "Q");
          lay(0, 2, 0, 23, "t");
          lay(31, 2, 31, 23, "t");
          lay(1, 23, 30, 23, "t");
          lay(2, 22, 13, 22, "I");
          lay(18, 22, 29, 22, "I");
          lay(14, 23, 17, 23, "Q");

          // Viali in piastrelle d'ocra e aiuole verdi con acacie
          lay(2, 10, 29, 11, "Y");
          lay(14, 3, 17, 22, "U");
          lay(2, 16, 12, 21, "Z");
          put(4, 18, "t"); put(9, 19, "t"); put(6, 17, "f"); put(11, 20, "f");

          // Edifici principali e botteghe secondarie
          house(2, 2, 10, 6, { door: [7, 7], roof: "#991b1b", wall: "#f5ebd6", enter: { to: "tp_linotype", at: [9, 11] } });
          house(21, 2, 9, 6, { door: [25, 7], roof: "#1d4ed8", wall: "#fde68a", enter: { to: "tp_barsport", at: [8, 10] } });
          house(13, 2, 7, 5, { door: [16, 6], roof: "#1f6f54", wall: "#e7dcc4", enter: "Cartoleria & Francobolli Rossi: in vetrina brillano penne stilografiche, inchiostro Pelikan e album di calciatori 1968-69." });

          // Isola centrale: Fontana in ghisa, braciere caldarroste, panchine e lampioni
          put(15, 13, "F"); put(16, 13, "F");
          put(19, 13, "V"); put(19, 12, "x");
          put(13, 14, "s"); put(18, 15, "n");

          // Zona sud-ovest: Chiosco Edicola di Oreste con civette e pacchi
          put(5, 13, "E"); put(6, 13, "E");
          put(8, 13, "P"); put(4, 14, "R");

          // Zona sud-est: Cortile delle Edicole recintato con varco partita (X)
          lay(21, 16, 29, 21, "Y");
          lay(21, 15, 29, 15, "I"); put(24, 15, "Y"); put(25, 15, "Y");
          put(28, 17, "X"); put(28, 18, "X");
          put(22, 17, "R"); put(22, 20, "R"); put(26, 20, "P");

          // Lampioni caldi lungo i portici
          [[12, 8], [20, 8], [10, 15], [21, 14], [14, 21], [27, 13]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, "📰 TIPOGRAFIA L'ECO", d.X(7) + 8, d.Y(2) - 4, (s === 0 || s === 2) && Math.floor(Date.now() / 420) % 2 ? "#fde047" : "#f5ebd6");
          H.plaque(g, "☕ BAR SPORT", d.X(25) + 8, d.Y(2) - 4, s === 1 && !F.is("tp_c1_beppe") ? "#fde047" : "#bae6fd");
          H.plaque(g, "🗞️ EDICOLA ORESTE", d.X(5) + 16, d.Y(13) - 8, "#86efac");
          H.plaque(g, s === 3 ? "▶ SFIDA CORTILE!" : "CORTILE EDICOLE", d.X(28) + 8, d.Y(17) - 8, s === 3 ? "#fde047" : "#fca5a5");
        }
      },

      tp_linotype: {
        interior: true,
        region: "linotype",
        name: "Sala Linotype · L'Eco del Pallone",
        short: "Linotype",
        sub: "Piombo fuso, matrici d'ottone e bozze fresche appese allo spago",
        bg: "tp_linotype",
        w: 18,
        h: 14,
        start: [9, 11],
        outside: ["tp_edicole", 7, 8],
        base: "U",
        flavor: {
          A: "Il Bancone di Piombo: qui si serrano nel telaio il Titolo di testa, la Foto di centro e la Spalla sportiva.",
          J: "La grande Linotype del 1936: fonde intere righe d'antimonio e piombo con un tintinnio musicale.",
          R: "Risme di carta avorio contate una per una da Ada.",
          P: () => `Bozza umida appesa al chiodo: «${K.press.latestHeadline()}».`,
          L: "Cassettiere in legno di pero piene di caratteri Bodoni, Garamond e Clarendon.",
          T: "Scrivania di redazione con tipometro, forbici lunghe e colla arabica."
        },
        npcs: () => [
          { id: "tp_ada", at: [8, 6] },
          { id: "tp_goffredo", at: [13, 5] }
        ],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "U");
          lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(9, 13, "v");
          lay(4, 4, 13, 9, "Q");
          // Macchine Linotype a destra, casse di caratteri a sinistra, Bancone di Piombo al centro-nord
          put(6, 3, "A"); put(7, 3, "A");
          put(14, 3, "J"); put(15, 3, "J"); put(15, 6, "J");
          put(2, 2, "L"); put(3, 2, "L"); put(2, 5, "L");
          put(2, 9, "R"); put(3, 9, "R"); put(15, 10, "R");
          put(10, 3, "P"); put(5, 8, "T"); put(6, 8, "b");
          put(4, 1, "l"); put(13, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, S() === 2 ? "▶ IMPAGINA NUMERO 1" : "📰 BANCONE DI PIOMBO", d.X(6) + 16, d.Y(3) - 7, S() === 2 ? "#fde047" : "#f5ebd6");
          H.plaque(g, "⌨️ LINOTYPE", d.X(14) + 16, d.Y(3) - 7, "#cbd5e1");
        }
      },

      tp_barsport: {
        interior: true,
        region: "barsport",
        name: "Bar Sport & Totocalcio",
        short: "Bar Sport",
        sub: "Macchina espresso a leva, schedine del 13 e biliardino in faggio",
        bg: "tp_barsport",
        w: 16,
        h: 13,
        start: [8, 10],
        outside: ["tp_edicole", 25, 8],
        base: "Y",
        flavor: {
          O: "La macchina espresso cromata a leva sbuffa una nuvola profumata di miscela arabica.",
          P: "La lavagna di gesso del Totocalcio: «U.S. ACACIE - REAL STAMPA MODERNA: 1 FISSO!».",
          T: "Tavolino in formica verde con portazucchero d'acciaio e tre schedine compilate.",
          R: "Giornali sportivi infilati nelle stecche di legno per la lettura al tavolo.",
          b: "Sgabello girevole in similpelle rossa."
        },
        npcs: () => [{ id: "tp_beppe", at: [6, 4] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 12, "Y");
          lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 12, "a"); lay(15, 0, 15, 12, "a"); lay(0, 12, 15, 12, "a");
          put(8, 12, "v");
          // Bancone espresso a nord-ovest, angolo Totocalcio a nord-est, tavolini ai lati
          lay(2, 2, 8, 2, "O");
          put(3, 3, "b"); put(5, 3, "b"); put(7, 3, "b");
          put(12, 2, "P"); put(13, 2, "R");
          put(3, 7, "T"); put(4, 7, "b");
          put(11, 7, "T"); put(12, 7, "b");
          put(12, 9, "T"); put(13, 9, "b");
          put(4, 1, "l"); put(11, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "☕ BANCONE ESPRESSO", d.X(5) + 8, d.Y(2) - 6, "#fde68a");
          H.plaque(g, "✏️ TOTOCALCIO", d.X(12) + 12, d.Y(2) - 6, "#86efac");
        }
      }
    };

    return {
      n: N,
      title: "Piombo Caldo",
      sub: "Due titoli sul bancone, la prima foto al magnesio e i pacchi difesi tra le edicole",
      goal,
      start: "tp_edicole",
      introBg: "tp_titolo",
      zones,
      talk,
      obj: {
        "tp_linotype:A": () => openBancone(),
        "tp_edicole:X": () => courtGate()
      },
      intro: () => [
        ["voce", "Borgo Alta, giovedì d'ottobre 1968. Da quarantasett'anni i rulli de «L'Eco del Pallone» svegliano i portici prima ancora del primo tram."],
        ["voce", "Tuo fratello maggiore Nando è partito cronista all'estero lasciandoti il suo posto in attacco nell'U.S. Acacie e una scrivania libera in redazione... proprio nel giorno in cui qualcuno vuole spegnere tutto."]
      ]
    };
  }

  boot();
})();
