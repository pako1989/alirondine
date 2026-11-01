// js/tipografia-c2.js — «LA TIPOGRAFIA DI MEZZANOTTE» · Capitolo 2: Fango e Magnesio
// Campo delle Acacie (32×24), Spogliatoio Storico 1921 (16×13) e Camera Oscura di Clara (16×13).
// Una trave della tribunetta storica è stata segata nella notte; nello spogliatoio ritrovi il rullino dimenticato di tuo fratello Nando
// e sotto la lampada rossa di Clara affiora la prima verità fotografica.
(function () {
  "use strict";
  function boot() {
    const E = window.__tipografiaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__tipografiaH || !window.__flash68) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }

  function chapter2(K) {
    const { setStep, quest, F } = K;
    const H = window.__tipografiaH(K);
    const { say, done, ask, wask } = H;
    const N = 2, S = () => K.stepOf(N);

    H.people();
    K.cos("tp_c2", { kind: "scarf", label: "Sciarpa in lana «L'Eco 1921»", val: "#1f6f54", from: "Capitolo 2 de La Tipografia di Mezzanotte" });
    K.lore("l_acacie", {
      t: "Il Campo delle Acacie",
      d: "Inaugurato nel maggio 1921 dietro la linea tranviaria: le porte sono ancora in larice verniciato a calce e lungo la recinzione fioriscono ventidue acacie centenarie."
    });
    K.lore("l_cameraoscura", {
      t: "Sviluppo al bromuro d'argento",
      d: "Novanta secondi nel rivelatore al metolo, trenta nel bagno d'arresto e cinque minuti d'iposolfito: nella luce rossa l'immagine spunta sulla carta come un ricordo che torna a galla."
    });

    const goal = (s) => ({
      0: "Campo delle Acacie. Esamina il cartello di cantiere (C) vicino alla tribunetta a nord-ovest ed entra nello Spogliatoio Storico.",
      1: "Prendi il Rullino di Nando nello Spogliatoio e portalo a Clara Luce nella Camera Oscura (a nord-est del campo).",
      2: "Parla con Livia Carta vicino al bancone da campo, poi impagina e stampa il Numero 2 sul Bancone di Piombo portatile (A).",
      3: "▶ PARTITA NEL FANGO: varca l'ingresso del Campo delle Acacie (X) a sud-est e respingi la squadra del Cantiere Sartori!",
      4: "Il capitolo 2 è concluso."
    }[s] || "Il capitolo 2 è concluso.");

    function checkCluesStep0() {
      if (S() === 0 && F.is("tp_c2_trave") && K.inv.has("tp_rullino")) {
        setStep(N, 1);
        quest("tp_q2a", "Sotto la luce rossa", "Porta il Rullino 35mm di Nando a Clara Luce nella Camera Oscura (a nord-est).");
      }
    }

    function fin() {
      setStep(N, 4);
      F.set("tp_c2_done", true);
      K.reward("tp_c2", { coins: 95, cos: "tp_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["voce", "Sotto una pioggerella dorata di foglie d'acacia, i ragazzi del quartiere rialzano lo striscione verde sopra la tribunetta del 1921."],
        ["tp_clara", "[felice] Ho ingrandito il fotogramma 24 del rullino di Nando: la targa del furgone appartiene alla flotta notturna di «Stampa Moderna» in Galleria Umberto!"],
        ["tp_livia", "[serio] Venite stasera nella mia legatoria in Galleria, prima che chiudano i cancelli: nel dorso rilegato della prima annata del 1921 c'è qualcosa che Sartori cerca da mesi."],
        ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>🗞️ Copie ${K.stat("copie")}k · 🖋️ Verità ${K.stat("verita")} · 📰 Tiratura ${K.stat("tiratura")} · 🔎 Dossier ${K.dossier.list("acacie").length}/4`],
        ["voce", "Il Capitolo 3 ti aspetta: «La Velina della Notte»."]
      ]), () => K.openMain(), "tp_acacie");
    }

    function afterMudMatch(r) {
      K.bond("copie", 4 + (r.perfectShots ? 1 : 0));
      say("tp_beppe", "[felice] Fango fino alle ginocchia ma porta inviolata nel cuore! Questi giovanotti in tuta griffata non sanno cosa vuol dire giocare sulle pozzanghere delle Acacie!");
      say("tp_pavan", "[sorpreso] Ma... ma il sopralluogo doveva trovare il campo deserto! Come faccio adesso a firmare lo sgombero immediato?!");
      say("tp_ada", "[serio] Non lo firmi, geometra. E prepari le carte per il Consiglio Comunale.");
      fin();
    }

    function playMudMatch() {
      H.flashMatch({
        title: "Campo delle Acacie · Fango e Magnesio",
        venue: "acacie",
        opp: "Cantiere Sartori XI",
        oppColor: "#d97706",
        oppStyle: "difensiva",
        durSec: 36
      }, "tp_clara", "Attento alle due pozzanghere di fango che frenano i rasoterra! Passa veloce e premi 📸 FLASH quando entrano nel mio mirino!", (r) => {
        if (r.win) return afterMudMatch(r);
        say("tp_beppe", r.quit ? "Asciugati gli scarpini: quando sei pronto il campo è nostro." : "Evita di portare palla dentro le pozzanghere: smista con ⚽ PASSA e usa il lampo di Clara!");
        done();
      });
    }

    function inspectSawedBeam() {
      if (!F.is("tp_c2_trave")) {
        F.set("tp_c2_trave", true);
        K.dossier.add("acacie", "perizia_falsa");
        K.learnLore("l_acacie");
        say("voce", "Ti chini sotto i gradoni della tribunetta del 1921 vicino al cartello dell'Impresa Sartori: a terra brilla segatura bionda ancora asciutta.");
        say("tp_beppe", "[arrabbiato] Altro che legno marcio! Qualcuno ha inciso il montante con una sega a mano stanotte per far dichiarare inagibile il campo!");
        say("voce", "🔎 <b>Nuova prova nel Dossier:</b> «Trave segata di fresco».");
        checkCluesStep0();
        if (S() === 0) say("voce", "Ora entra nello Spogliatoio Storico qui accanto per controllare l'armadietto di Nando e parlare con Beppe.");
        return done();
      }
      say("voce", "Il taglio sulla trave è netto e recente: l'hai già annotato nel Dossier delle Acacie.");
      done();
    }

    function openFieldPress() {
      if (S() < 2) {
        say("tp_ada", "Prima sviluppa il rullino di Nando con Clara nella Camera Oscura e ascolta Livia Carta qui fuori!");
        return done();
      }
      K.press.open(() => {
        if (S() === 2 && K.press.edition(2)) {
          setStep(N, 3);
          K.questDone && K.questDone("tp_q2c");
          quest("tp_q2d", "Partita nel fango", "Raggiungi il varco del Campo delle Acacie (X) a sud-est e difendi il prato!");
          say("tp_tino", "[felice] Corro in tipografia col telaio del Numero 2: tra dieci minuti sarà in tutte le edicole! Tu intanto difendi il prato al varco (X)!");
          return done();
        }
        done();
      }, true, S() === 2 ? {
        edition: 2,
        prompt: "Componi il Numero 2 sul Bancone da Campo (Titolo, Foto del rullino di Nando e Spalla tattica), poi avvia la tiratura!"
      } : {});
    }

    function pitchGate() {
      if (S() < 3) {
        say("voce", S() < 2
          ? "Sul prato umido i geometri di Sartori stanno piantando le paline rosse. Raccogli prima le prove tra Spogliatoio e Camera Oscura!"
          : "Stampa prima il Numero 2 sul Bancone da Campo (A) accanto ad Ada!");
        return done();
      }
      if (S() === 3) {
        return ask(`Sull'erba pesante del Campo delle Acacie la squadra del Cantiere Sartori vuole cacciare i ragazzi dal prato.`, [
          { label: "📸 Gioca Flash & Contropiede '68", sub: "Campo delle Acacie · Pozzanghere di fango e contropiede", big: true, cls: "hot", fn: playMudMatch },
          { label: "⚽ Partita classica sotto le acacie (a 2 gol)", sub: "Alternativa calcistica rapida", fn: () => K.playMatch({
            id: "tp_m2_alt", oppTeam: "Cantiere Sartori XI", cageTarget: 2,
            done: (r) => { if (r && r.win) afterMudMatch({ win: true, perfectShots: 0 }); else { say("tp_beppe", "Teniamo duro sul fango, riproviamo!"); done(); } }
          }) },
          { label: "🗂️ Apri il Dossier delle Acacie", sub: `${K.dossier.found("acacie")}/2 collegamenti trovati`, fn: () => K.dossier.open("acacie", () => done(), true) },
          { label: "↩ Non ancora", fn: done }
        ]);
      }
      say("voce", "Il prato delle Acacie respira libero tra le foglie dorate.");
      done();
    }

    const talk = {
      tp_beppe() {
        if (K.rel.scene("tp_beppe")) return;
        if (!K.inv.has("tp_rullino") && !F.is("tp_nando_roll")) {
          K.inv.give("tp_rullino");
          K.press.unlock("col_2");
          K.press.assign("col", "col_2");
          say("tp_beppe", "Guarda cosa c'era nella tasca della vecchia giacca da allenamento di tuo fratello Nando, qui nello spogliatoio: un <b>Rullino 35mm</b> con un'etichetta scritta a matita, «Notte Acacie»!");
          say("tp_beppe", "Ti ho anche preparato gli appunti su «La diagonale nel fango» per la spalla sportiva del Numero 2. Se non hai ancora guardato il cartello (C) fuori sotto la tribunetta, controllalo subito!");
          checkCluesStep0();
          return done();
        }
        say("tp_beppe", F.is("tp_c2_trave")
          ? "Porta quel rullino a Clara nella Camera Oscura a nord-est: sotto i suoi acidi parlerà chiaro!"
          : "Esci e controlla il cartello di Sartori (C) accanto alla tribunetta: c'è della segatura sospetta sotto la trave!");
        done();
      },
      tp_clara() {
        if (K.rel.scene("tp_clara")) return;
        if (S() === 1 || (K.inv.has("tp_rullino") && !F.is("tp_nando_roll"))) {
          F.set("tp_nando_roll", true);
          K.learnLore("l_cameraoscura");
          K.dossier.add("acacie", "negativo_clara");
          K.dossier.pair("acacie", "perizia_falsa", "negativo_clara");
          K.press.unlock("photo_2");
          K.press.assign("photo", "photo_2");
          setStep(N, 2);
          K.questDone && K.questDone("tp_q2a");
          quest("tp_q2b", "La soffiata di Livia", "Torna fuori al Campo delle Acacie, parla con Livia Carta e componi il Numero 2 al Bancone (A).");
          // Momento toccante #1: sviluppo del rullino dimenticato di Nando nella luce rossa
          return K.scene([
            ["voce", "Clara chiude la tenda di velluto nero. Nella penombra rossa della lampada inattinica immerge la pellicola di Nando nella bacinella di sviluppo."],
            ["tp_clara", "Guarda... il primo fotogramma non è un'inchiesta. Siete tu ragazzino con gli scarpini troppo grandi, Nando e Mastro Goffredo che ridete appoggiati alla rotativa nel sessantadue."],
            ["tp_clara", "[commosso] Nando aveva scritto sul bordo della coda: «Se parto, badate voi due alle Acacie e al vecchio Goffredo»."],
            ["voce", "Poi, nel fotogramma successivo, affiora nitido un furgone scuro fermo davanti ai cancelli delle Acacie alle due di notte, con due uomini che scaricano una sega da carpentiere!"],
            ["tp_clara", "[serio] Eccola la prova! L'ho già collegata alla trave segata nel tuo <b>Dossier</b>, e la stampa è pronta per il centro pagina del Numero 2!"]
          ], () => done(), "tp_cameraoscura");
        }
        say("tp_clara", F.is("tp_nando_roll")
          ? "[felice] Il negativo di Nando è salvo ad asciugare: parla con Livia fuori sul campo e manda in stampa il Numero 2!"
          : "La bacinella di sviluppo è già alla temperatura giusta: controlla prima la tribunetta e lo Spogliatoio Storico!");
        done();
      },
      tp_livia() {
        if (K.rel.scene("tp_livia")) return;
        if (S() < 2) {
          say("tp_livia", "Ragazzo, sono venuta fin qui dalla Galleria Umberto perché ho sentito voci brutte in Comune... prima però sviluppa quel rullino con Clara!");
          return done();
        }
        if (!F.is("tp_c2_livia_choice")) {
          F.set("tp_c2_livia_choice", true);
          K.press.unlock("lead_v2", true);
          K.press.unlock("lead_t2", true);
          say("tp_livia", "[serio] Ascoltami piano: mio nipote fa il fattorino in Municipio. Il geometra Pavan aveva già pronta la dichiarazione d'inagibilità tre giorni fa, prima ancora di venire al campo!");
          say("tp_ada", "Possiamo titolare con sobrietà tecnica sui rilievi della trave per proteggere il nipote di Livia, oppure sparare lo scoop notturno sul furgone per far correre tutta Borgo Alta alle edicole.");
          return wask("Come imposti la linea del Numero 2 sul Bancone da Campo?", [
            {
              label: "🖋️ Tutela la fonte di Livia e punta sui rilievi tecnici inattaccabili",
              w: { verita: 2 },
              fn: () => {
                K.press.assign("lead", "lead_v2");
                K.rel.add("tp_livia", 2);
                K.questDone && K.questDone("tp_q2b");
                quest("tp_q2c", "Stampa il Numero 2", "Tocca il Bancone da Campo (A) accanto ad Ada per stampare il Numero 2.");
                say("tp_livia", "[felice] Grazie di cuore. Ora tocca il Bancone (A) qui accanto per chiudere il Numero 2!");
                done();
              }
            },
            {
              label: "📰 Lancia il titolo clamoroso sulle ombre notturne (senza fare nomi)",
              w: { tiratura: 2 },
              fn: () => {
                K.press.assign("lead", "lead_t2");
                K.bond("copie", 2);
                K.questDone && K.questDone("tp_q2b");
                quest("tp_q2c", "Stampa il Numero 2", "Tocca il Bancone da Campo (A) accanto ad Ada per stampare il Numero 2.");
                say("tp_tino", "[felice] Con un titolo così svuotiamo i chioschi prima di cena! Tocca il Bancone (A) per mandarlo in macchina!");
                done();
              }
            }
          ]);
        }
        say("tp_livia", "Tocca il Bancone da Campo (A) accanto ad Ada per mandare in stampa il Numero 2, e domani sera passa nella mia Legatoria!");
        done();
      },
      tp_ada() {
        if (K.rel.scene("tp_ada")) return;
        say("tp_ada", S() < 2
          ? "Ho portato qui un tavolo di bozze volante per non perdere nemmeno un minuto: prima raccogli i rilievi sulla trave (C) e sviluppa il rullino con Clara!"
          : S() === 2
            ? (F.is("tp_c2_livia_choice") ? "Tutti i tagli del Numero 2 sono pronti: tocca il Bancone (A) qui al mio fianco!" : "Ascolta prima cosa ha scoperto Livia Carta qui accanto a me!")
            : "Vai al varco del prato (X) a sud-est: difendiamo il Campo delle Acacie coi piedi e col magnesio!");
        done();
      },
      tp_tino() {
        if (K.rel.scene("tp_tino")) return;
        if (!F.is("tp_c2_torello")) {
          return ask("Tino palleggia sull'erba umida: «Facciamo due tiri tra le pozzanghere per prendere le misure al fango?»", [
            {
              label: "⚽ Torello sul prato bagnato (a 2 gol)",
              sub: "Allenamento facoltativo (+2k copie d'entusiasmo)",
              fn: () => K.playMatch({
                id: "tp_am2", oppTeam: "Allievi delle Acacie", cageTarget: 2,
                done: (r) => {
                  if (r && r.win) { F.set("tp_c2_torello", true); K.bond("copie", 2); K.rel.add("tp_tino", 2); say("tp_tino", "[felice] Neanche una schizzata sui calzettoni! Siamo prontissimi!"); }
                  else say("tp_tino", "Occhio che il pallone bagnato schizza via! Riprova quando vuoi.");
                  done();
                }
              })
            },
            { label: "↩ Dopo", fn: done }
          ]);
        }
        say("tp_tino", "[felice] Ho la bicicletta col portapacchi pronta per portare i flani in tipografia a tempo di record!");
        done();
      }
    };

    const zones = {
      tp_acacie: {
        region: "acacie",
        name: "Campo delle Acacie",
        short: "Acacie",
        sub: "Tribunetta storica in legno verde del 1921, acacie dorate e fango d'autunno",
        bg: "tp_acacie",
        time: "pomeriggio",
        w: 32,
        h: 24,
        base: "Z",
        start: [16, 20],
        itemCos: "tp_c2",
        items: [[4, 15], [27, 11], [15, 13], [10, 21]],
        areas: [
          [2, 2, 12, 9, "Spogliatoio Storico 1921"],
          [20, 2, 30, 9, "Camera Oscura da Campo"],
          [2, 9, 13, 15, "Tribunetta Verde"],
          [18, 14, 30, 22, "Terreno di Gioco"],
          [0, 0, 31, 23, "Campo delle Acacie"]
        ],
        flavor: {
          K: "La tribunetta di larice verde del 1921: profuma di resina e domeniche popolari.",
          C: "Cartello rosso e bianco: «IMPRESA COSTRUZIONI SARTORI — FUTURA RESIDENZA LE ACACIE».",
          A: "Il Bancone da Campo allestito da Ada per chiudere il Numero 2 direttamente a bordo prato.",
          P: () => `Locandina appuntata alla staccionata: «${K.press.latestHeadline()}».`,
          F: "La fontanella in ghisa degli atleti dove si lavano gli scarpini infangati.",
          R: "Pacchi di volantini e copie fresche per il quartiere.",
          n: "Targa d'ottone sul cancello: «CAMPO SPORTIVO POPOLARE DELLE ACACIE — DONATO AI RAGAZZI NEL 1921».",
          s: "Panchina storica degli allenatori sotto i rami d'acacia."
        },
        npcs: () => [
          { id: "tp_ada", at: [14, 10] },
          { id: "tp_livia", at: [17, 10] },
          { id: "tp_tino", at: [21, 16] }
        ],
        intro: [
          ["voce", "Campo delle Acacie, pomeriggio d'ottobre. Ventidue alberi d'acacia lasciano cadere foglie d'oro sopra la staccionata verde del 1921."],
          ["voce", "Vicino alla tribunetta di legno qualcuno ha piantato un cartello di cantiere nuovo fiammante dell'Impresa Sartori."]
        ],
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 1, "t");
          lay(0, 2, 0, 23, "t");
          lay(31, 2, 31, 23, "t");
          lay(1, 23, 30, 23, "t");
          lay(2, 22, 13, 22, "I");
          lay(14, 23, 17, 23, "Q");

          // Viali lastricati e piazzale d'ingresso
          lay(13, 8, 18, 22, "Q");
          lay(2, 8, 29, 9, "Q");

          // Edifici: Spogliatoio 1921, Camera Oscura di Clara e Casotto del Custode
          house(2, 2, 9, 5, { door: [6, 6], roof: "#1f6f54", wall: "#f5ebd6", enter: { to: "tp_spogliatoio", at: [8, 10] } });
          house(21, 2, 9, 5, { door: [25, 6], roof: "#7f1d1d", wall: "#e7dcc4", enter: { to: "tp_cameraoscura", at: [8, 10] } });
          house(12, 2, 8, 5, { door: [16, 6], roof: "#92400e", wall: "#fde68a", enter: "Il casotto del gesso e delle reti: sacchi di calce bianca, bandierine d'angolo cucite a mano e tre palloni di cuoio ingrassati." });

          // Zona ovest: Tribunetta del 1921 + trave segata / cartello Sartori (C)
          lay(3, 11, 10, 12, "K");
          put(11, 11, "C"); put(11, 12, "C");
          put(5, 14, "F"); put(8, 14, "s"); put(3, 17, "t"); put(9, 18, "t"); put(6, 19, "f"); put(11, 17, "P");

          // Centro: Bancone da Campo (A) di Ada
          put(15, 10, "A"); put(16, 10, "R"); put(14, 15, "n");

          // Zona sud-est: Rettangolo del terreno di gioco con ingresso partita (X)
          lay(19, 13, 29, 13, "I"); put(23, 13, "Z"); put(24, 13, "Z");
          lay(19, 14, 29, 21, "Z");
          put(28, 17, "X"); put(28, 18, "X");
          put(20, 15, "P"); put(20, 20, "R"); put(25, 20, "f");

          [[11, 8], [20, 8], [13, 14], [19, 12], [13, 20], [27, 12]].forEach(([x, y]) => put(x, y, "l"));
        },
        decor(g, cx, cy, d) {
          const s = S();
          H.plaque(g, "👕 SPOGLIATOIO 1921", d.X(6) + 8, d.Y(2) - 4, s === 0 && !K.inv.has("tp_rullino") ? "#fde047" : "#bbf7d0");
          H.plaque(g, "🔴 CAMERA OSCURA", d.X(25) + 8, d.Y(2) - 4, s === 1 ? "#fde047" : "#fecaca");
          H.plaque(g, !F.is("tp_c2_trave") ? "⚠ ESAMINA TRAVE" : "TRIBUNETTA 1921", d.X(11) + 8, d.Y(11) - 7, !F.is("tp_c2_trave") ? "#fde047" : "#f5ebd6");
          H.plaque(g, s === 2 ? "▶ BANCONE NUMERO 2" : "📰 BOZZE", d.X(15) + 8, d.Y(10) - 7, s === 2 ? "#fde047" : "#e7dcc4");
          H.plaque(g, s === 3 ? "▶ SFIDA NEL FANGO!" : "CAMPO ACACIE", d.X(28) + 8, d.Y(17) - 8, s === 3 ? "#fde047" : "#bbf7d0");
        }
      },

      tp_spogliatoio: {
        interior: true,
        region: "acacie",
        name: "Spogliatoio Storico 1921",
        short: "Spogliatoio",
        sub: "Panche di castagno, olio canforato e le maglie verdi con fascia avorio",
        bg: "tp_spogliatoio",
        w: 16,
        h: 13,
        start: [8, 10],
        outside: ["tp_acacie", 6, 7],
        base: "Y",
        flavor: {
          D: "Gli armadietti di legno verde numerati a pennello: il numero 9 porta ancora il cartellino di Nando.",
          P: "La lavagna tattica a gesso con le frecce del contropiede sul fango.",
          R: "Cesta di vimini con le casacche pulite che sanno di sapone di Marsiglia.",
          T: "Tavolo dei massaggi con barattolo di grasso di foca per gli scarpini a tacchetti di cuoio.",
          b: "Panca liscia su cui si sono allacciati le scarpe tre generazioni di ragazzi."
        },
        npcs: () => [{ id: "tp_beppe", at: [7, 5] }],
        chests: {
          "13,3": { coins: 25, text: "Nella cassetta del magazziniere trovi venticinque monete del fondo trasferte!" }
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 12, "Y");
          lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 12, "a"); lay(15, 0, 15, 12, "a"); lay(0, 12, 15, 12, "a");
          put(8, 12, "v");
          lay(4, 4, 11, 8, "U");
          lay(2, 2, 6, 2, "D"); lay(9, 2, 12, 2, "D");
          put(13, 3, "x");
          put(7, 2, "P");
          put(3, 6, "b"); put(3, 7, "b"); put(12, 6, "b"); put(12, 7, "b");
          put(2, 9, "T"); put(13, 9, "R");
          put(4, 1, "l"); put(11, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "ARMADIETTO DI NANDO", d.X(5) + 8, d.Y(2) - 6, "#fde68a");
        }
      },

      tp_cameraoscura: {
        interior: true,
        region: "cameraoscura",
        name: "Camera Oscura di Clara",
        short: "Camera Oscura",
        sub: "Luce inattinica rossa, bacinelle d'argento e pellicole appese ad asciugare",
        bg: "tp_cameraoscura",
        w: 16,
        h: 13,
        start: [8, 10],
        outside: ["tp_acacie", 25, 7],
        base: "U",
        flavor: {
          N: "Sotto la lampada rossa oscillano i negativi 35mm appena fissati nell'iposolfito.",
          F: "Le tre bacinelle smaltate di Clara: rivelatore, bagno d'arresto e fissaggio.",
          J: "L'ingranditore verticale Durst con obiettivo luminoso da 50 millimetri.",
          L: "Raccoglitori neri pieni di provini a contatto di tutte le partite dal 1964.",
          T: "Taglierina per carta baritata lucida e matita bianca da ritocco."
        },
        npcs: () => [{ id: "tp_clara", at: [8, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 12, "U");
          lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 12, "a"); lay(15, 0, 15, 12, "a"); lay(0, 12, 15, 12, "a");
          put(8, 12, "v");
          put(6, 2, "N"); put(9, 2, "N");
          put(3, 3, "F"); put(4, 3, "F"); put(5, 3, "F");
          put(12, 3, "J"); put(13, 3, "T");
          put(2, 7, "L"); put(2, 8, "L");
          put(13, 8, "R"); put(12, 9, "b");
          put(7, 1, "l");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "🔴 SVILUPPO & STAMPA", d.X(8) + 4, d.Y(2) - 6, "#fca5a5");
        }
      }
    };

    return {
      n: N,
      title: "Fango e Magnesio",
      sub: "Una trave segata nel buio, il rullino di Nando e una partita epica nelle pozzanghere",
      goal,
      start: "tp_acacie",
      introBg: "tp_acacie",
      zones,
      talk,
      obj: {
        "tp_acacie:C": () => inspectSawedBeam(),
        "tp_acacie:A": () => openFieldPress(),
        "tp_acacie:X": () => pitchGate()
      },
      intro: () => [
        ["voce", "Venerdì pomeriggio al Campo delle Acacie. Ha piovuto fino a mezzogiorno e l'odore dell'erba bagnata si mescola a quello acre della vernice fresca sui cartelli di Sartori."],
        ["voce", "Ada, Beppe e Clara ti aspettano davanti alla tribunetta storica: c'è qualcosa che non quadra nel verbale d'inagibilità."]
      ]
    };
  }

  boot();
})();
