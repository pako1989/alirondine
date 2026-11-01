// js/tipografia-c3.js — «LA TIPOGRAFIA DI MEZZANOTTE» · Capitolo 3: La Velina della Notte
// Galleria Umberto di Notte (32×24), Sede di «Stampa Moderna» (18×14) e Antica Legatoria del 1921 (16×13).
// Scelta a tempo davanti alla telescrivente di Sartori, il rogito perpetuo cucito nel volume del 1921,
// l'addio commosso di Mastro Goffredo al vecchio piombo e la sfida sotto i lampioni bagnati del portico.
(function () {
  "use strict";
  function boot() {
    const E = window.__tipografiaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__tipografiaH || !window.__flash68) return setTimeout(boot, 100);
    E.api.addChapter(chapter3);
  }

  function chapter3(K) {
    const { setStep, quest, F } = K;
    const H = window.__tipografiaH(K);
    const { say, done, ask, wask } = H;
    const N = 3, S = () => K.stepOf(N);

    H.people();
    K.cos("tp_c3", { kind: "coat", label: "Trench da fotoreporter di Clara", val: "#b45309", from: "Capitolo 3 de La Tipografia di Mezzanotte" });
    K.lore("l_galleria", {
      t: "La Galleria Umberto di Borgo Alta",
      d: "Costruita nel 1908 con cupola in ferro e vetro: di giorno salotto dei caffè eleganti, di notte crocevia degli strilloni che aspettano la prima tiratura."
    });
    K.lore("l_rogito21", {
      t: "Il Lascito Popolare del 1921",
      d: "Undici soci fondatori acquistarono il prato delle Acacie per sottoscrizione pubblica, stabilendo per atto notarile che non potesse mai mutare destinazione sportiva."
    });

    const goal = (s) => ({
      0: "Galleria Umberto di Notte. Entra nell'Antica Legatoria di Livia (a nord-ovest) per cercare il rogito del 1921.",
      1: "Entra nella sede vetrata di «Stampa Moderna» (a nord-est) ed esamina la telescrivente accesa (G).",
      2: "Torna in Galleria, decidi con Ada la linea sul Bancone Notturno (A) e manda in stampa il Numero 3.",
      3: "▶ PARTITA SOTTO I LAMPIONI: raggiungi il Portico Notturno (X) a sud-est della Galleria per forzare il blocco di Sartori!",
      4: "Il capitolo 3 è concluso."
    }[s] || "Il capitolo 3 è concluso.");

    function fin() {
      setStep(N, 4);
      F.set("tp_c3_done", true);
      K.reward("tp_c3", { coins: 110, cos: "tp_c3" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "I lampioni della Galleria Umberto si riflettono sul marmo bagnato mentre i fattorini di Sartori battono in ritirata."],
        ["tp_sartori", "[arrabbiato] Avete messo il naso tra le mie veline, ragazzi. Ma domani mattina in Consiglio Comunale parleranno gli avvocati, e sul prato dello Stadio delle Acacie scenderà la mia prima squadra professionistica!"],
        ["tp_ada", "[serio] E noi saremo in aula col Dossier completo e in edicola con l'Edizione Straordinaria, Commendatore."],
        ["voce", `<b>FINE DEL CAPITOLO 3.</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")} · 🔎 Dossier ${K.dossier.list("acacie").length}/4 (${K.dossier.found("acacie")}/2 nessi)`],
        ["voce", "Il Capitolo 4 ti aspetta: «Rotativa a Tutta Velocità»."]
      ]), () => K.openMain(), "tp_galleria");
    }

    function afterPorticoMatch(r) {
      K.bond("copie", 4 + (r.perfectShots ? 1 : 0));
      say("tp_clara", "[felice] Sotto la luce gialla dei lampioni le foto sono venute come quadri caravaggeschi! Nessuno potrà insabbiare il Numero 3!");
      say("tp_goffredo", "[serio] Adesso tutti in Sala Rotativa: stanotte scaldiamo la vecchia Marinoni del ventotto per l'ultima grande battaglia.");
      fin();
    }

    function playPorticoMatch() {
      H.flashMatch({
        title: "Portico Notturno · Sotto i Lampioni",
        venue: "portico",
        opp: "Vigilanza Corriere Veloce",
        oppColor: "#334155",
        oppStyle: "pressing",
        durSec: 38
      }, "tp_clara", "Guarda i tre coni caldi dei lampioni sul lastricato: se scatti il 📸 FLASH lì vicino, il lampo abbaglia un'area molto più ampia!", (r) => {
        if (r.win) return afterPorticoMatch(r);
        say("tp_clara", r.quit ? "Ripartiamo quando vuoi: il portico è nostro." : "Sfrutta i cerchi di luce dei lampioni per accecare il loro pressing con un solo Flash!");
        done();
      });
    }

    function inspectTorch1921() {
      if (S() === 0 || !F.is("tp_c3_atto")) {
        F.set("tp_c3_atto", true);
        K.inv.give("tp_atto21");
        K.learnLore("l_rogito21");
        K.dossier.add("acacie", "atto_1921");
        if (S() === 0) setStep(N, 1);
        quest("tp_q3a", "La telescrivente accesa", "Attraversa la Galleria ed entra negli uffici di Stampa Moderna (a nord-est) per esaminare la telescrivente (G).");
        // Momento toccante #2: Mastro Goffredo e la memoria del piombo davanti al volume del 1921
        return K.scene([
          ["voce", "Livia svita lentamente la ruota d'ottone del torchio da legatoria ed estrae il primo volume rilegato in tela verde de «L'Eco del Pallone», anno 1921."],
          ["tp_livia", "Mio padre lo cucì nel doppio cartone della copertina quarant'anni fa: ecco il <b>Rogito originale del Campo delle Acacie</b> col timbro a secco del notaio!"],
          ["tp_goffredo", "[commosso] Guardate le firme in fondo... c'è anche mio zio Battista, che aveva sedici anni e le mani nere d'inchiostro come le mie."],
          ["tp_goffredo", "I medici dicono che a fine stagione dovrò lasciare il crogiolo per via dei fumi del piombo, ragazzo. Ma prima di posare il compositoio voglio fondere il titolo che salva il campo di questi vecchi ragazzi."],
          ["voce", "🔎 <b>Nuova prova nel Dossier:</b> «Rogito perpetuo del 1921» (e <b>Rogito 1921</b> nello 🎒 Zaino). Ora cerca cosa nasconde Sartori a «Stampa Moderna»!"]
        ], () => done(), "tp_legatoria");
      }
      say("voce", "Il grande torchio d'ottone custodiva il rogito del 1921: ora è al sicuro nello zaino e nel Dossier.");
      done();
    }

    function inspectTeletype() {
      if (F.is("tp_c3_velina")) {
        say("voce", "La telescrivente ronza in attesa sulla linea interurbana: hai già fotografato la velina riservata di Sartori.");
        return done();
      }
      if (!F.is("tp_c3_atto")) {
        say("voce", "La telescrivente batte codici immobiliari cifrati: passa prima dall'Antica Legatoria di Livia (a nord-ovest) per capire quale vincolo stanno cercando di aggirare!");
        return done();
      }
      // Scelta a tempo vera (K.ask con parametro tm) mentre il custode notturno si avvicina nel corridoio!
      K.ask(
        "tp_clara",
        "⏱️ <b>PASSI NEL CORRIDOIO!</b> Sulla telescrivente di Sartori sta uscendo la velina riservata per il cantiere «Residenza Acacie», ma la guardia notturna sta girando la chiave nella serratura! Hai pochi secondi!",
        [
          {
            label: "📸 Scatta una macro silenziosa senza strappare la carta!",
            sub: "Lascia tutto intatto e fuggi nell'ombra con Clara",
            big: true,
            cls: "hot",
            fn: () => {
              F.set("tp_c3_velina", true);
              F.set("tp_c3_clean", true);
              K.dossier.add("acacie", "velina_telescrivente");
              K.dossier.pair("acacie", "velina_telescrivente", "atto_1921");
              K.press.unlock("photo_3");
              K.press.unlock("col_3");
              K.press.assign("photo", "photo_3");
              K.press.assign("col", "col_3");
              K.bond("verita", 1);
              if (S() < 2) setStep(N, 2);
              K.questDone && K.questDone("tp_q3a");
              quest("tp_q3b", "Il Numero 3 di mezzanotte", "Torna in Galleria da Ada e componi il Numero 3 sul Bancone Notturno (A).");
              say("tp_clara", "[felice] Clack a un trentesimo di secondo senza flash! Nemmeno un millimetro di carta fuori posto, e nel Dossier la velina inchioda Sartori contro il rogito del 1921!");
              done();
            }
          },
          {
            label: "✂️ Strappa la velina gialla e corri verso l'uscita!",
            sub: "Prendi l'originale ma fai scattare il fischietto della vigilanza",
            fn: () => {
              F.set("tp_c3_velina", true);
              K.dossier.add("acacie", "velina_telescrivente");
              K.dossier.pair("acacie", "velina_telescrivente", "atto_1921");
              K.press.unlock("photo_3");
              K.press.unlock("col_3");
              K.press.assign("photo", "photo_3");
              K.press.assign("col", "col_3");
              K.bond("tiratura", 1);
              if (S() < 2) setStep(N, 2);
              K.questDone && K.questDone("tp_q3a");
              quest("tp_q3b", "Il Numero 3 di mezzanotte", "Torna in Galleria da Ada e componi il Numero 3 sul Bancone Notturno (A).");
              say("tp_clara", "[sorpreso] Ce l'abbiamo in tasca! La guardia ha sentito lo strappo e ha chiamato rinforzi sotto il portico, ma la prova è nel Dossier!");
              done();
            }
          }
        ],
        "tp_stampamoderna",
        { secs: 9, def: 1 }
      );
    }

    function openNightPress() {
      if (S() < 2) {
        say("tp_ada", "Prima recupera il rogito in Legatoria e controlla la telescrivente negli uffici di Stampa Moderna!");
        return done();
      }
      if (!F.is("tp_c3_moral")) {
        say("tp_ada", "Parla un istante con me qui accanto al Bancone prima di scegliere il titolo di stanotte!");
        return done();
      }
      K.press.open(() => {
        if (S() === 2 && K.press.edition(3)) {
          setStep(N, 3);
          K.questDone && K.questDone("tp_q3b");
          quest("tp_q3c", "Forza il blocco in Galleria", "Raggiungi il Portico Notturno (X) a sud-est per portare fuori i pacchi del Numero 3!");
          say("tp_tino", "[felice] Il Numero 3 scotta tra le mani! Però la vigilanza del Corriere Veloce ha chiuso l'uscita del Portico Notturno (X): andiamo a passare in dribbling!");
          return done();
        }
        done();
      }, true, S() === 2 ? {
        edition: 3,
        prompt: "Componi il Numero 3 sul Bancone Notturno (Titolo, Foto della velina e Spalla), poi premi «Visto, si stampi!»."
      } : {});
    }

    function porticoGate() {
      if (S() < 3) {
        say("voce", S() < 2
          ? "Sotto le arcate bagnate del portico le camionette blu del Corriere Veloce scaricano pacchi patinati. Completa prima l'indagine notturna!"
          : "Parla con Ada e manda in stampa il Numero 3 al Bancone Notturno (A) al centro della Galleria!");
        return done();
      }
      if (S() === 3) {
        return ask(`Sotto i lampioni del Portico Notturno i terzini del Corriere Veloce bloccano i furgoncini dell'Eco.`, [
          { label: "📸 Gioca Flash & Contropiede '68", sub: "Portico Notturno · Lampioni che ampliano il raggio del Flash", big: true, cls: "hot", fn: playPorticoMatch },
          { label: "⚽ Sfida rapida sotto le arcate (a 2 gol)", sub: "Alternativa calcistica classica", fn: () => K.playMatch({
            id: "tp_m3_alt", oppTeam: "Vigilanza Veloce", cageTarget: 2,
            done: (r) => { if (r && r.win) afterPorticoMatch({ win: true, perfectShots: 0 }); else { say("tp_tino", "Riproviamo, sotto il bagnato siamo più svelti noi!"); done(); } }
          }) },
          { label: "🗂️ Controlla il Dossier delle Acacie", sub: `${K.dossier.list("acacie").length}/4 voci · ${K.dossier.found("acacie")}/2 nessi`, fn: () => K.dossier.open("acacie", () => done(), true) },
          { label: "↩ Non ancora", fn: done }
        ]);
      }
      say("voce", "Il Portico Notturno è sgombro e i furgoncini delle consegne corrono nella nebbia.");
      done();
    }

    const talk = {
      tp_livia() {
        if (K.rel.scene("tp_livia")) return;
        say("tp_livia", !F.is("tp_c3_atto")
          ? "Avvicinati al grande Torchio d'ottone (M) qui a destra: ho già allentato la vite dove riposa il volume del 1921!"
          : "[felice] Conserva con cura quel rogito: porta l'odore della colla di farina di mio padre e la firma di chi amava il pallone.");
        done();
      },
      tp_goffredo() {
        if (K.rel.scene("tp_goffredo")) return;
        say("tp_goffredo", !F.is("tp_c3_atto")
          ? "Tocca il torchio (M) accanto a Livia, ragazzo: vediamo se i vecchi del ventuno avevano pensato anche a noi."
          : "Con quel rogito e la velina di Sartori, in Consiglio Comunale faremo cantare anche le pietre!");
        done();
      },
      tp_clara() {
        if (K.rel.scene("tp_clara")) return;
        say("tp_clara", !F.is("tp_c3_velina")
          ? "Guarda là in fondo dietro il divisorio di vetro: la telescrivente (G) di Sartori sta battendo da sola nel buio! Avvicinati piano!"
          : "[felice] La foto della velina è nitidissima! Torniamo in Galleria da Ada per chiudere il Numero 3.");
        done();
      },
      tp_sartori() {
        if (K.rel.scene("tp_sartori")) return;
        say("tp_sartori", "[serio] Il piombo è preistoria, giovanotto. Fra cinque anni esisteranno solo rotative offset a quattro colori e centri residenziali col garage sotterraneo. Siete ancora in tempo a salire sul carro dei vincitori.");
        done();
      },
      tp_ada() {
        if (K.rel.scene("tp_ada")) return;
        if (S() < 2) {
          K.learnLore("l_galleria");
          say("tp_ada", S() === 0
            ? "Entra prima nell'Antica Legatoria di Livia a nord-ovest: ci aspetta col volume rilegato del 1921!"
            : "Ora entra negli uffici vetrati di Stampa Moderna a nord-est: Clara ha visto la luce della telescrivente accesa!");
          return done();
        }
        if (!F.is("tp_c3_moral")) {
          F.set("tp_c3_moral", true);
          K.press.unlock("lead_v3", true);
          K.press.unlock("lead_t3", true);
          say("tp_tino", "Direttrice! Un fattorino del bar mi ha passato anche un foglietto sui debiti privati del geometra Pavan alle corse: se lo sbattiamo in pagina facciamo il botto!");
          say("tp_ada", "[serio] Noi non colpiamo le debolezze private di un povero impiegato, Tino... oppure vogliamo usare il pugno duro dello scandalo contro tutta la cricca di Sartori?");
          return wask("Quale linea scegli per l'apertura di mezzanotte del Numero 3?", [
            {
              label: "🖋️ Cestina i pettegolezzi su Pavan: pubblica solo il Rogito del 1921 e la velina",
              w: { verita: 2 },
              fn: () => {
                F.set("tp_pavan_graziato", true);
                K.press.assign("lead", "lead_v3");
                K.rel.add("tp_ada", 2);
                say("tp_ada", "[felice] Ben detto: L'Eco del Pallone vince con i documenti, non col fango. Ora tocca il Bancone (A) qui accanto per stampare!");
                done();
              }
            },
            {
              label: "📰 Titola a tutta pagina sullo scandalo in Galleria Umberto!",
              w: { tiratura: 2 },
              fn: () => {
                K.press.assign("lead", "lead_t3");
                K.bond("copie", 3);
                say("tp_tino", "[felice] Tremate, poltroni di velluto! Tocca il Bancone (A) qui vicino e mandiamo tutto in rotativa!");
                done();
              }
            }
          ]);
        }
        say("tp_ada", S() === 2
          ? "Tocca il Bancone Notturno (A) qui al centro della Galleria per mandare in stampa il Numero 3!"
          : "Corri al Portico Notturno (X) a sud-est: i pacchi devono uscire prima dell'alba!");
        done();
      },
      tp_oreste() {
        if (K.rel.scene("tp_oreste")) return;
        say("tp_oreste", "Ho tenuto aperto anche il chiosco di Galleria fino a mezzanotte: la gente aspetta il vostro foglio sotto l'ombrello!");
        done();
      },
      tp_tino() {
        if (K.rel.scene("tp_tino")) return;
        say("tp_tino", S() < 3
          ? "Fischia appena il Numero 3 esce dal Bancone (A)!"
          : "Al Portico Notturno (X) ci aspettano sotto i lampioni: facciamogli vedere il contropiede dell'Eco!");
        done();
      }
    };

    const zones = {
      tp_galleria: {
        region: "galleria",
        name: "Galleria Umberto · Notte",
        short: "Galleria",
        sub: "Mosaici lucidi, vetrine illuminate e l'eco dei passi sotto la volta in ferro e vetro",
        bg: "tp_galleria",
        time: "notte",
        w: 32,
        h: 24,
        base: "U",
        start: [16, 20],
        itemCos: "tp_c3",
        items: [[5, 13], [27, 13], [16, 15], [9, 21]],
        areas: [
          [2, 2, 11, 9, "Antica Legatoria Livia"],
          [20, 2, 30, 9, "Palazzo Stampa Moderna"],
          [11, 9, 20, 16, "Ottagono Centrale"],
          [20, 15, 30, 22, "Portico Notturno"],
          [0, 0, 31, 23, "Galleria Umberto"]
        ],
        flavor: {
          E: "Il chiosco notturno della Galleria, con la lampada verde accesa per i nottambuli.",
          A: "Il Bancone Notturno coi flani di cartone pronti per il furgoncino della tipografia.",
          P: () => `Bacheca luminosa della Galleria: «${K.press.latestHeadline()}».`,
          F: "Vaschetta ornamentale di marmo grigio al centro dell'ottagono.",
          O: "Tavolini esterni del Gran Caffè Umberto coi vassoi d'acciaio.",
          I: "Cancellata liberty in ferro battuto e ottone.",
          n: "Targa d'ottone: «GALLERIA UMBERTO — ERETTA ANNO MCMVIII»."
        },
        npcs: () => [
          { id: "tp_ada", at: [14, 12] },
          { id: "tp_oreste", at: [7, 15] },
          { id: "tp_tino", at: [22, 18] },
          { id: "tp_sartori", at: [21, 9] }
        ],
        intro: [
          ["voce", "Mezzanotte in Galleria Umberto. La pioggia tamburella piano sui vetri della grande cupola liberty mentre i neon freddi di «Stampa Moderna» sfidano la luce ambrata dell'Antica Legatoria."],
          ["voce", "È la notte decisiva per trovare le carte che mancano al Dossier delle Acacie."]
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a");
          lay(0, 1, 31, 1, "U");
          lay(0, 2, 0, 23, "a");
          lay(31, 2, 31, 23, "a");
          lay(1, 23, 30, 23, "a");
          lay(2, 22, 13, 22, "I");
          lay(14, 23, 17, 23, "U");

          // Corsie laterali a scacchi (Y) e ottagono centrale in graniglia (U)
          lay(2, 9, 29, 11, "Y");
          lay(3, 15, 11, 21, "Y");

          // Edifici: Legatoria 1921 (NO), Caffè dell'Orologio (centro-nord), Stampa Moderna (NE)
          house(2, 2, 9, 6, { door: [6, 7], roof: "#78350f", wall: "#fde68a", enter: { to: "tp_legatoria", at: [8, 10] } });
          house(12, 2, 8, 5, { door: [16, 6], roof: "#1f6f54", wall: "#f5ebd6", enter: "Orologeria & Caffè della Volta: dietro la vetrina ticchettano dodici pendole sincronizzate col treno della notte." });
          house(21, 2, 9, 6, { door: [25, 7], roof: "#0f172a", wall: "#cbd5e1", enter: { to: "tp_stampamoderna", at: [9, 11] } });

          // Ottagono centrale: Bancone Notturno (A), vasca (F), bacheche e panchine
          put(15, 12, "A"); put(16, 12, "R");
          put(16, 14, "F"); put(13, 14, "s"); put(18, 14, "n");

          // Angolo sud-ovest: Chiosco della Galleria e tavolini del caffè
          put(5, 14, "E"); put(6, 14, "E"); put(8, 14, "P");
          put(4, 18, "O"); put(5, 18, "b"); put(9, 19, "O"); put(10, 19, "b");

          // Angolo sud-est: Portico Notturno sotto i lampioni con varco partita (X)
          lay(20, 15, 29, 21, "Q");
          lay(20, 15, 29, 15, "I"); put(23, 15, "Q"); put(24, 15, "Q");
          put(28, 17, "X"); put(28, 18, "X");
          put(21, 17, "R"); put(25, 20, "P");

          [[11, 8], [20, 8], [11, 14], [20, 14], [22, 19], [26, 16], [14, 20]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, "📚 LEGATORIA LIVIA", d.X(6) + 8, d.Y(2) - 4, s === 0 ? "#fde047" : "#fde68a");
          H.plaque(g, "🏢 STAMPA MODERNA", d.X(25) + 8, d.Y(2) - 4, s === 1 ? "#fde047" : "#bae6fd");
          H.plaque(g, s === 2 ? "▶ BANCONE NUMERO 3" : "📰 RASSEGNA", d.X(15) + 8, d.Y(12) - 7, s === 2 ? "#fde047" : "#f5ebd6");
          H.plaque(g, s === 3 ? "▶ PORTICO NOTTURNO!" : "PORTICO", d.X(28) + 8, d.Y(17) - 8, s === 3 ? "#fde047" : "#cbd5e1");
        }
      },

      tp_legatoria: {
        interior: true,
        region: "barsport",
        name: "Antica Legatoria del 1921",
        short: "Legatoria",
        sub: "Scaffali di annate cucite a mano, colla calda e il grande torchio a vite d'ottone",
        bg: "tp_legatoria",
        w: 16,
        h: 13,
        start: [8, 10],
        outside: ["tp_galleria", 6, 8],
        base: "Y",
        flavor: {
          M: "Il massiccio torchio a vite in ghisa e ottone dove riposano i volumi più preziosi.",
          L: "Annate complete de L'Eco del Pallone dal 1921 al 1967 rilegate in mezza tela verde.",
          T: "Banco da cucitura con telai, aghi curvi, spago di canapa e barattolo di colla di farina.",
          R: "Cartelle marmorizzate pronte per gli archivi comunali."
        },
        npcs: () => [
          { id: "tp_livia", at: [9, 5] },
          { id: "tp_goffredo", at: [6, 6] }
        ],
        chests: {
          "2,9": { coins: 30, text: "In una scatola marmorizzata trovi trenta monete lasciate dai vecchi abbonati sostenitori!" }
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 12, "Y");
          lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 12, "a"); lay(15, 0, 15, 12, "a"); lay(0, 12, 15, 12, "a");
          put(8, 12, "v");
          lay(4, 4, 11, 8, "U");
          lay(2, 2, 9, 2, "L");
          put(12, 3, "M"); put(13, 3, "M");
          put(2, 5, "L"); put(2, 6, "L");
          put(12, 7, "T"); put(13, 7, "b");
          put(2, 9, "x"); put(13, 9, "R");
          put(5, 1, "l"); put(11, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, !F.is("tp_c3_atto") ? "▶ TORCHIO 1921" : "TORCHIO D'OTTONE", d.X(12) + 12, d.Y(3) - 6, !F.is("tp_c3_atto") ? "#fde047" : "#fde68a");
        }
      },

      tp_stampamoderna: {
        interior: true,
        region: "moderna",
        name: "Sede di «Stampa Moderna»",
        short: "Stampa Moderna",
        sub: "Vetri fumé, il plastico del condominio e la telescrivente accesa nella notte",
        bg: "tp_stampamoderna",
        w: 18,
        h: 14,
        start: [9, 11],
        outside: ["tp_galleria", 25, 8],
        base: "U",
        flavor: {
          G: "La telescrivente automatica Olivetti del Commendator Sartori: sta battendo ordini per l'Ufficio Edilizia!",
          C: "Il plastico in scala 1:100 di «Residenza Acacie»: otto piani grigi al posto delle porte di calcio.",
          P: "Bozze patinate de «Il Corriere Veloce» con tre pagine di pubblicità immobiliare.",
          D: "Schedari metallici grigi chiusi a doppia mandata.",
          T: "Scrivania direzionale in cristallo nero."
        },
        npcs: () => [{ id: "tp_clara", at: [11, 6] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 13, "U");
          lay(0, 0, 17, 0, "a"); lay(0, 0, 0, 13, "a"); lay(17, 0, 17, 13, "a"); lay(0, 13, 17, 13, "a");
          put(9, 13, "v");
          // Plastico speculativo a sinistra, telescrivente (G) a nord-est
          put(4, 4, "C"); put(5, 4, "C");
          put(13, 3, "G"); put(14, 3, "G");
          lay(2, 2, 6, 2, "D");
          put(8, 3, "P"); put(4, 8, "T"); put(5, 8, "b");
          put(13, 8, "T"); put(14, 8, "b"); put(15, 10, "R");
          put(5, 1, "l"); put(13, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "🏗️ PLASTICO ACACIE", d.X(4) + 16, d.Y(4) - 6, "#fca5a5");
          H.plaque(g, !F.is("tp_c3_velina") ? "▶ TELESCRIVENTE!" : "📠 TELESCRIVENTE", d.X(13) + 16, d.Y(3) - 6, !F.is("tp_c3_velina") ? "#fde047" : "#bae6fd");
        }
      }
    };

    return {
      n: N,
      title: "La Velina della Notte",
      sub: "Un rogito nascosto nel 1921, nove secondi davanti alla telescrivente e lampioni nella pioggia",
      goal,
      start: "tp_galleria",
      introBg: "tp_galleria",
      zones,
      talk,
      obj: {
        "tp_legatoria:M": () => inspectTorch1921(),
        "tp_stampamoderna:G": () => inspectTeletype(),
        "tp_galleria:A": () => openNightPress(),
        "tp_galleria:X": () => porticoGate()
      },
      intro: () => [
        ["voce", "Sabato notte, Galleria Umberto. Mentre mezza Borgo Alta dorme, dietro i vetri dell'Antica Legatoria e al quarto piano di «Stampa Moderna» due luci restano accese."],
        ["voce", "Prima dell'alba dobbiamo completare il Dossier delle Acacie e mandare in edicola il Numero 3."]
      ]
    };
  }

  boot();
})();
