// js/onde-c2.js — CAPITOLO 2 · «Furgoni Gialli nella Nebbia»
// Zone: Cortili delle Antenne (36x24), Bar-Ricevitoria Eldorado (20x13), Interno Furgone Goniometrico Unità 04 (20x13).
(function () {
  "use strict";
  function boot() {
    const E = window.__ondeCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ondeH) return setTimeout(boot, 80);
    E.api.addChapter((K) => {
    const N = 2, F = K.F, S = () => K.stepOf(N), { setStep, quest, questDone } = K;
    const H = window.__ondeH(K), { say, done, ask, wask } = H;

    const goal = (s) => ({
      0: "Entra nel Bar Eldorado e parla con Wanda «Gettone» Bellini della caccia alle antenne.",
      1: "Usa il Sintonizzatore AM/FM (📻) sui 94.6 MHz nei Cortili delle Antenne per individuare il furgone Unità 04.",
      2: "Entra nel Furgone Goniometrico Unità 04 (a nord-est) ed esamina il tavolo cartografico.",
      3: "Parla con Tullio nei Cortili per sostituire la valvola bruciata del trasmettitore.",
      4: "Affronta il G.S. Poste & Telegrafi dell'Ispettore Valli nel cortile dei panni stesi."
    }[s] || "Capitolo 2 concluso.");

    function fin() {
      F.set("rf_c2_done", true);
      const msg = K.reward("onde_c2", { coins: 85, cos: "rf_occhiali" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["rf_valli", "Fischio finale… avete un'intesa di reparto invidiabile, lo ammetto. Ai miei tempi nel '58 giocavamo lo stesso identico dai-e-vai stretto."],
        ["rf_wanda", "E la staffetta telefonica ha tenuto! Mentre palleggiavate tra le lenzuola stese, tutti i condomini hanno girato le antenne verso il largo!"],
        ["rf_tullio", "Attenti però: il barometro scende a picco. Stanotte sul golfo entra una burrasca di libeccio forza sette, e dobbiamo tornare subito a bordo della Rondine Rossa!"],
        ["voce", `<b>FINE DEL CAPITOLO 2 · «Furgoni Gialli nella Nebbia»</b>${msg.length ? "<br>🎁 " + msg.join(" · ") : ""}<br>📡 Segnale Libero ${K.stat("libero")} · 🔇 Prudenza ${K.stat("prudenza")} · Cartoline QSL ${K.radio.tagCount("qsl")}/6`]
      ]), () => K.openMain(), "rf_cortili");
    }

    function playC2() {
      H.playUrto({
        title: "Cap. 2 · Cortile delle Antenne",
        us: "Radio 99.9",
        opp: "G.S. Poste & Telegrafi",
        oppColor: "#eab308",
        oppStyle: "equilibrata",
        venue: "cortile",
        track: "rock",
        mateName: "Wanda",
        staticCount: 3,
        halfSec: 23
      }, (r) => {
        if (r && r.win) {
          setStep(N, 5);
          K.bond("sintonia", 1);
          fin();
        } else {
          say("rf_wanda", "I geometri di Valli chiudono le linee centrali coi goniometri: cambia frequenza verso i 104.2 Acuto per tagliare fuori il disturbo e riproviamo!");
          done();
        }
      });
    }

    const talk = {
      rf_wanda() {
        const s = S();
        if (s === 0) {
          say("rf_wanda", "Benvenuto al Bar Eldorado, {n}! Ho già preparato i gettoni sul bancone: stamattina l'Ispettore Valli ha schierato i furgoni gialli radiogoniometrici nei cortili popolari per triangolare il nostro ponte radio.");
          say("rf_wanda", "Uno dei furgoni — l'Unità 04 — ha lasciato l'oscilloscopio acceso mentre i tecnici prendevano un cappuccino caldo. Esci nei Cortili e usa il Sintonizzatore AM/FM (📻) sui 94.6 MHz per localizzarlo nella nebbia!");
          setStep(N, 1);
          quest("c2_furgone", "Triangolazione al Contrario", "Sintonizza 94.6 MHz nei Cortili delle Antenne per trovare il furgone Unità 04.");
          return done();
        }
        say("rf_wanda", s === 1 ? "Fai un giro verso nord-est nei Cortili col Sintonizzatore sui 94.6 MHz. E qui dentro al bar prova anche i 107.2 MHz vicino alla radio!" : "In campo io detto il passaggio corto: ascolta il piatto della batteria e calcia sul quarto!");
        done();
      },
      rf_lupo() {
        say("rf_lupo", "Guarda Wanda al centralino: tre cornette in una mano e la tazzina nell'altra! Se sbirci nella credenza in fondo al bancone, aveva messo da parte una valvola d'ambra rarissima.");
        done();
      },
      rf_valvola() {
        const s = S();
        say("rf_valvola", s <= 1 ? "Sento tre motori diesel fermi nella nebbia, ma solo l'Unità 04 emette un'armonica sui 94.6 MHz a nord-est. Ah, e vicino al traliccio centrale del cortile c'è anche una Cartolina QSL sui 96.8 MHz!" : "Hai visto che roba dentro l'Unità 04? Specchio spinge il Ministero a sequestrarci prima di lunedì!");
        done();
      },
      rf_tullio() {
        const s = S();
        if (s < 3) {
          say("rf_tullio", "Brutta storia, {n}: l'umidità ha appena fulminato la valvola finale del ponte ripetitore. Prima però scopri cosa nascondono nel furgone Unità 04!");
          return done();
        }
        if (s === 3) {
          say("rf_tullio", "Eccoti, {n}! Proprio mentre smontavo la valvola bruciata si è presentato un emissario in doppiopetto del Consorzio Specchio.");
          say("rf_tullio", "Ci offre una valvola nuova di fabbrica e mezzo milione di lire se stasera mandiamo in onda lo spot dell'«Amaro Costa Nuova» senza più nominare lo stadio. Altrimenti possiamo prendere in prestito per stanotte la valvola secondaria del radiofaro costiero e restituirla lunedì!");
          K.clock.advance(1);
          wask("rf_tullio", "Come rimetti in onda il trasmettitore di Radio Fuorigioco?", [
            {
              label: "📡 Prendi in prestito la valvola secondaria del radiofaro",
              sub: "Nessun padrone in cabina: indipendenza intatta",
              big: true,
              cls: "hot",
              w: { libero: 2, verita: 1 },
              fn: () => {
                F.set("rf_specchio_sponsor", false);
                K.rel.add("rf_tullio", 2);
                K.rel.add("rf_nilde", 2);
                setStep(N, 4);
                quest("c2_match", "Sfida tra le Lenzuola", "Parla con l'Ispettore Valli nel campetto dei Cortili per giocare contro il G.S. Poste & Telegrafi.");
                say("rf_tullio", "Ben detto! Due giri di chiave inglese e la valvola di scorta canta come un usignolo. Ora andiamo in mezzo al cortile: Valli ci ha sfidati a una partita regolare col dopolavoro delle Poste!");
                done();
              }
            },
            {
              label: "🔇 Accetta lo spot «Amaro Costa Nuova» per comprare il ricambio",
              sub: "Cassa salva e zero rischi legali, ma l'indipendenza pesa",
              big: true,
              w: { prudenza: 3 },
              fn: () => {
                F.set("rf_specchio_sponsor", true);
                K.coinsGive(40);
                setStep(N, 4);
                quest("c2_match", "Sfida tra le Lenzuola", "Parla con l'Ispettore Valli nel campetto dei Cortili per giocare contro il G.S. Poste & Telegrafi.");
                say("rf_tullio", "Mi pizzicano i baffi a montare un pezzo pagato da Specchio, ma almeno il trasmettitore non fonde. Adesso però in cortile contro la squadra di Valli si gioca per vincere!");
                done();
              }
            }
          ], "rf_cortili");
          return;
        }
        say("rf_tullio", "La valvola nuova tiene la frequenza al decimo di hertz: fai vedere all'Ispettore come gira palla il quartiere!");
        done();
      },
      rf_valli() {
        const s = S();
        if (s < 4) {
          say("rf_valli", "Circolare, giovanotto. Stiamo effettuando rilievi radioelettrici di routine… anche se con questa nebbia e tutte queste padelle d'alluminio appese ai balconi le bussole impazziscono.");
          return done();
        }
        say("rf_valli", "Così avete spostato il ponte radio di tetto in tetto col passaparola telefonico? Ingegnoso, non c'è che dire.");
        say("rf_valli", "Facciamo un patto da gentiluomini di campo: il mio G.S. Poste & Telegrafi contro voi ragazzi della radio qui sull'asfalto del cortile. Se vincete, per oggi sospendo i rilievi nel rione!");
        return ask("Sfida nel Cortile delle Antenne:", [
          { label: "💿 Gioca contro il G.S. Poste & Telegrafi", sub: "Onde d'Urto · 3 coni di disturbo goniometrico", big: true, cls: "hot", fn: playC2 },
          { label: "🗂️ Esamina il Dossier", sub: "Confronta la Mappa dell'Unità 04 con le altre prove", fn: () => K.dossier.open("appalto", () => talk.rf_valli(), true) },
          { label: "◂ Preparati un momento", fn: done }
        ], "rf_cortili");
      }
    };

    const zones = {
      rf_cortili: {
        region: "cortili",
        name: "Cortili delle Antenne",
        short: "Cortili delle Antenne",
        sub: "Case di ringhiera, lenzuola stese nella nebbia e furgoni gialli in agguato",
        bg: "rf_cortili",
        w: 36,
        h: 24,
        base: ",",
        start: [5, 13],
        travel: [5, 13],
        items: [[7, 15], [18, 11], [31, 13]],
        areas: [
          [3, 2, 12, 9, "Piazzetta Bar Eldorado"],
          [12, 14, 23, 19, "Campetto delle Lenzuola"],
          [26, 5, 33, 10, "Postazione Furgoni Poste"],
          [0, 0, 35, 23, "Rione Popolare · Nebbia"]
        ],
        chests: { "32,18": { coins: 30, text: "Una cassetta degli attrezzi lasciata dagli antennisti del condominio." } },
        doors: {
          "29,8": {
            to: "rf_furgone",
            at: [10, 10],
            locked: () => (!K.radio.tuned("unita_04") ? "Nella nebbia non capisci quale portellone sia rimasto socchiuso: sintonizza prima i 94.6 MHz col Sintonizzatore AM/FM (📻)!" : false)
          }
        },
        signals: [
          {
            id: "unita_04",
            freq: 94.6,
            at: [28, 9],
            radius: 14,
            tol: 1.2,
            flag: "rf_u04_946",
            title: "94.6 MHz · Portante Interna Unità 04",
            lines: [
              ["voce", "Il Sintonizzatore aggancia il fischio dell'oscilloscopio lasciato acceso dentro il furgone giallo <b>Unità 04</b>: il portellone posteriore è socchiuso e incustodito!"]
            ],
            onTune(K2, first) {
              if (first) K2.bond("sintonia", 1);
              if (K2.stepOf(2) < 2) { K2.setStep(2, 2); K2.questDone("c2_furgone"); }
              K2.done();
            }
          },
          {
            id: "qsl_3",
            freq: 96.8,
            at: [16, 6],
            radius: 14,
            tol: 1.2,
            tag: "qsl",
            lore: "qsl_3",
            title: "96.8 MHz · Cartolina QSL #3 (Via del Gasometro)",
            lines: [
              ["voce", "Da una soffitta sopra i tetti scende un bisbiglio sui 96.8 MHz: «Siamo due apprendisti tipografi del turno di notte! Non mollate ragazzi dei 99.9!»"]
            ],
            onTune(K2, first) { if (first) K2.bond("sintonia", 1); K2.done(); }
          }
        ],
        flavor: {
          A: "Un ripetitore condominiale camuffato tra due stendibiancheria.",
          J: "Furgone radiogoniometrico giallo canarino con antenna ad anello girevole sul tetto.",
          K: "Telefono pubblico sotto i portici del rione: squilla a catena per avvisare i balconi.",
          P: "Lampione avvolto da un alone lattiginoso di nebbia autunnale."
        },
        npcs(s) {
          const list = [{ id: "rf_valvola", at: [19, 9] }, { id: "rf_valli", at: [24, 15] }];
          if (s >= 2) list.push({ id: "rf_tullio", at: [9, 11] });
          return list;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 35, 0, "t"); lay(0, 23, 35, 23, "t"); lay(0, 0, 0, 23, "t"); lay(35, 0, 35, 23, "t");
          lay(4, 9, 31, 11, ":");
          lay(12, 14, 23, 19, "-");
          put(12, 16, "g"); put(23, 16, "g");
          house(4, 3, 8, 5, { door: [8, 7], roof: "#881337", wall: "#fde68a", enter: { to: "rf_bar", at: [10, 10] } });
          put(28, 7, "J"); put(29, 7, "J"); put(29, 8, "q");
          put(16, 5, "A"); put(14, 8, "K");
          put(11, 10, "P"); put(25, 10, "P");
          put(5, 18, "s"); put(32, 18, "x");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "BAR ELDORADO · TELEFONO", d.X(8) + 8, d.Y(3) - 6, "#2dd4bf");
          H.plaque(g, "UNITÀ 04 · P.T.", d.X(28) + 16, d.Y(7) - 6, "#fde047");
          H.plaque(g, "CORTILE DELLE LENZUOLA", d.X(17) + 16, d.Y(14) - 6, "#e2e8f0");
        }
      },

      rf_bar: {
        interior: true,
        region: "bottega",
        name: "Bar-Ricevitoria «Eldorado»",
        short: "Bar Eldorado",
        sub: "Macchina espresso a leva, schedine Totocalcio e centralino di quartiere",
        bg: "rf_bar",
        w: 20,
        h: 13,
        base: "=",
        start: [10, 10],
        outside: ["rf_cortili", 8, 8],
        items: [[3, 8], [16, 9]],
        loot: {
          "17,4": {
            id: "rf_valvola_ambra",
            text: "Nella scatola di biscotti dietro il bancone trovi una rarissima Valvola Termoionica d'Ambra!",
            empty: "Nella scatola di latta restano solo bustine di zucchero."
          }
        },
        signals: [
          {
            id: "qsl_4",
            freq: 107.2,
            at: [3, 5],
            radius: 14,
            tol: 1.2,
            tag: "qsl",
            lore: "qsl_4",
            title: "107.2 MHz · Cartolina QSL #4 (Casello Riviera)",
            lines: [
              ["voce", "Dalla radio sopra il frigorifero entra limpida la voce del casellante sulla ferrovia costiera (107.2 MHz): «Il rapido delle ventidue ha appena fischiato due volte in onore di Radio Fuorigioco!»"]
            ],
            onTune(K2, first) { if (first) K2.bond("sintonia", 1); K2.done(); }
          }
        ],
        flavor: {
          T: "Il bancone di formica verde acqua profuma di caffè ristretto e anice.",
          K: "La batteria di tre telefoni a gettoni con cui Wanda coordina l'intero quartiere.",
          R: "Una radiolina in bachelite bianca incollata fissa sui 99.9 MHz.",
          b: "Tavolino con le schedine del Totocalcio compilate a matita copiativa."
        },
        npcs: () => [{ id: "rf_wanda", at: [10, 5] }, { id: "rf_lupo", at: [14, 8] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          put(5, 1, "W"); put(14, 1, "W");
          [[6, 4], [7, 4], [8, 4], [12, 4], [13, 4]].forEach(([x, y]) => put(x, y, "T"));
          put(15, 4, "K"); put(3, 4, "R"); put(17, 4, "D");
          put(5, 7, "b"); put(14, 7, "b");
        }
      },

      rf_furgone: {
        interior: true,
        region: "furgone",
        name: "Furgone Goniometrico · Unità 04",
        short: "Furgone Unità 04",
        sub: "Oscilloscopi ministeriali, cuffie al quarzo e mappe riservate",
        bg: "rf_furgone",
        w: 20,
        h: 13,
        base: "+",
        start: [10, 10],
        outside: ["rf_cortili", 29, 9],
        items: [[6, 9], [14, 9]],
        chests: { "16,9": { coins: 25, text: "Buoni benzina ministeriali e spiccioli per il pedaggio." } },
        loot: {
          "3,7": {
            id: "rf_tazza",
            text: "Accanto al termos d'ordinanza trovi una Tazza di Smalto al Caffè d'Orzo ancora tiepida!",
            empty: "Resta solo il termos vuoto."
          }
        },
        objects: {
          "9,6": inspectMap,
          "10,6": inspectMap
        },
        flavor: {
          R: "Oscilloscopio goniometrico a doppia traccia: gli aghi ballano impazziti grazie ai falsi echi di Wanda!",
          W: "Dal finestrino zigrinato si intravedono le ombre dei panni stesi nella nebbia."
        },
        npcs: () => [],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          put(6, 1, "W"); put(13, 1, "W");
          [[5, 4], [9, 4], [14, 4]].forEach(([x, y]) => put(x, y, "R"));
          put(9, 6, "T"); put(10, 6, "T");
          put(3, 7, "D"); put(16, 9, "x");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "MAPPA TRIANGOLAZIONE", d.X(9) + 16, d.Y(6) - 6, "#34d399");
        }
      }
    };

    function inspectMap() {
      const added = K.dossier.add("appalto", "mappa_frequenze");
      if (S() < 3) {
        setStep(N, 3);
        quest("c2_valvola", "La Valvola del Ripetitore", "Torna nei Cortili delle Antenne e parla con Tullio.");
      }
      K.say([
        ["voce", "Sul tavolo cartografico dell'Unità 04 spunta una nota protocollata dal Consorzio Costa Nuova: <b>le ruspe per demolire lo Stadio del Molo Vecchio sono state noleggiate il 2 ottobre</b>, dodici giorni prima della presunta perizia di cedimento!"],
        ["voce", added ? "Hai aggiunto la <b>Mappa del Furgone Unità 04</b> al Dossier! Ora torna fuori da Tullio." : "La prova è già al sicuro nel tuo Dossier."]
      ], K.done);
    }

    return {
      n: N,
      title: "Furgoni Gialli nella Nebbia",
      sub: "Triangolazioni nei cortili popolari e la staffetta del Bar Eldorado",
      start: "rf_cortili",
      introBg: "rf_cortili",
      goal,
      intro: () => [
        ["voce", "<b>CAPITOLO 2 · IL GIORNO DOPO, NEBBIA FITTA SUI CORTILI</b><br>Tre furgoni gialli con le antenne rotanti sul tetto hanno circondato le case di ringhiera per spegnere il ripetitore a terra di Radio Fuorigioco."],
        ["rf_wanda", "«Pronto, scala B? Appena vedete il furgone giallo all'angolo, stendete le lenzuola bagnate davanti alla ringhiera e passate la chiamata al civico dodici!»"],
        ["voce", "Entra al <b>Bar Eldorado</b> per coordinare la difesa delle frequenze con Wanda."]
      ],
      zones,
      talk,
      news: (id, s) => (s === 0 && id === "rf_wanda") || (s === 3 && id === "rf_tullio") || (s === 4 && id === "rf_valli")
    };
    });
  }
  boot();
})();
