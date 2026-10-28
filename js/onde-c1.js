// js/onde-c1.js — CAPITOLO 1 · «99.9 Megahertz di Ruggine»
// Zone: Pontile delle Nebbie (34x24), Bottega Dischi & Valvole Zappa (20x13), Cabina di Regia della Rondine Rossa (20x13).
(function () {
  "use strict";
  function boot() {
    const E = window.__ondeCore;
    if (!E || !E.api || !E.api.addChapter || !window.__ondeH) return setTimeout(boot, 80);
    E.api.addChapter((K) => {
    const N = 1, F = K.F, S = () => K.stepOf(N), { setStep, quest, questDone } = K;
    const H = window.__ondeH(K), { say, done, ask, wask } = H;

    const goal = (s) => ({
      0: "Leggi l'ordinanza affissa al Pontile e parla con Lupo Zappa nella Bottega Dischi & Valvole.",
      1: "Usa il Sintonizzatore AM/FM (📻) sui 91.2 MHz vicino al molo est per trovare un varco verso il gozzo.",
      2: "Sali sul gozzo alla bitta d'ormeggio a sud-est per raggiungere la Cabina di Regia della Rondine Rossa.",
      3: "Torna sul Pontile delle Nebbie e affronta i Guardiani del Cantiere Specchio sul campo del carbone.",
      4: "Capitolo 1 concluso."
    }[s] || "Capitolo 1 concluso.");

    function fin() {
      F.set("rf_c1_done", true);
      const msg = K.reward("onde_c1", { coins: 75, cos: "rf_giubbotto" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["rf_nilde", "Tre fischi sul carbone bagnato e i guardiani di Specchio battono in ritirata! Nei balconi del porto si sono accese trenta radioline tutte insieme."],
        ["rf_lupo", "Avete sentito che giro di basso, ragazzi? Stasera i 99.9 MHz arrivano dritti fino a Punta Scura!"],
        ["rf_valli", "Non cantate vittoria troppo presto, signorina Marini. Domani mattina arriveranno i furgoni goniometrici del Ministero."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «99.9 Megahertz di Ruggine»</b>${msg.length ? "<br>🎁 " + msg.join(" · ") : ""}<br>📡 Segnale Libero ${K.stat("libero")} · 🔇 Prudenza ${K.stat("prudenza")} · 🎙️ Verità ${K.stat("verita")} · Cartoline QSL ${K.radio.tagCount("qsl")}/6`]
      ]), () => K.openMain(), "rf_cabina");
    }

    function playC1() {
      H.playUrto({
        title: "Cap. 1 · Banchina del Carbone",
        us: "Radio 99.9",
        opp: "Guardiani Cantiere",
        oppColor: "#475569",
        oppStyle: "difensiva",
        venue: "carbone",
        track: "rock",
        mateName: "Nilde",
        staticCount: 2,
        halfSec: 22
      }, (r) => {
        if (r && r.win) {
          setStep(N, 4);
          K.bond("libero", 1);
          fin();
        } else {
          say("rf_nilde", "Il carbone bagnato frena il rimbalzo: cambia banda quando vedi i coni di fruscio e calcia sul battito del 45 giri! Riproviamo appena sei pronto.");
          done();
        }
      });
    }

    const talk = {
      rf_lupo() {
        const s = S();
        if (s === 0) {
          say("rf_lupo", "Ehi {n}! Entra pure, chiudi la porta che la salsedine mi scorda le chitarre. Hai visto il fogliaccio inchiodato sul molo dal Commendator Specchio?");
          say("rf_lupo", "Vuole buttare giù lo Stadio del Molo Vecchio lunedì all'alba con la scusa dei piloni marci, per farci un parcheggio di motoscafi d'altura!");
          say("rf_lupo", "Nilde ti aspetta a bordo della «Rondine Rossa», ancorata fuori dalle dodici miglia. Tieni: ho tarato il tuo Sintonizzatore portatile. Aprilo dal menu o dalla barra in alto (📻) sui 91.2 MHz vicino alla banchina est per intercettare il cambio ronda delle guardie!");
          K.dossier.add("appalto", "perizia_falsa");
          setStep(N, 1);
          quest("c1_varco", "Frequenza di Banchina", "Avvicinati al molo est del Pontile e sintonizza 91.2 MHz col Sintonizzatore AM/FM.");
          return done();
        }
        say("rf_lupo", s === 1 ? "Apri il Sintonizzatore AM/FM (📻) mentre sei sul molo est e porta la ghiera su 91.2 MHz: quando hai almeno 3 tacche verdi, ascolta la portante!" : s === 2 ? "Il varco al molo sud-est è libero! Tocca la bitta d'ormeggio in fondo al pontile di legno per salire sulla Rondine Rossa." : "Fai vedere a quei guardiani come si gioca a tempo di rock! E se frughi tra i miei scaffali o sintonizzi i 105.4 MHz qui in bottega potresti trovare una sorpresa.");
        done();
      },
      rf_valvola() {
        const s = S();
        if (s <= 1) {
          say("rf_valvola", "Senti questo ronzio in Mi bemolle, {n}? Sono le radioline walkie-talkie della vigilanza privata sui 91.2 MHz.");
          say("rf_valvola", "Cammina verso il pontile di legno a est, apri il Sintonizzatore AM/FM (📻) e sintonizza 91.2 MHz. E se passi vicino agli scogli a sud-ovest prova anche gli 88.6 MHz: c'è un peschereccio che ci manda una Cartolina QSL!");
          return done();
        }
        say("rf_valvola", "Ho l'orecchio incollato all'etere: sul campo del carbone usa la banda 88.4 per i filtranti pesanti o la 99.9 Onda Pirata quando il disco batte il quarto!");
        done();
      },
      rf_valli() {
        say("rf_valli", "Ispettore Aristide Valli, Ministero delle Poste e Telecomunicazioni. Immagino che anche lei «non sappia nulla» di quella bagnarola rossa che irradia rock sui 99.9 megahertz.");
        say("rf_valli", "Riferisca a Nilde Marini che la legge sull'etere non è un fallo laterale. Ma finché restate oltre le dodici miglia e non intralciate i soccorsi marittimi… io mi limito a prendere appunti.");
        done();
      },
      rf_tullio() {
        say("rf_tullio", "Piano coi piedi sui cavi schermati, {n}! Questo generatore marino ha fatto la rotta di Gibilterra nel '52 e alimenta mezzo kilowatt di valvole col gasolio contato col contagocce.");
        say("rf_tullio", "Nilde è lì al banco mixer: ha il diavolo per capello per via dello stadio.");
        done();
      },
      rf_nilde() {
        const s = S();
        if (s === 2 && K.inZone("rf_cabina")) {
          say("rf_nilde", "Eccoti finalmente a bordo della Rondine Rossa, {n}! Tre dita dal microfono e respira col diaframma: tra dieci secondi squilla il telefono rosso di linea esterna.");
          say("voce", "DRIIIN! Nilde alza la cornetta di bachelite e abbassa il cursore del disco rock.");
          say("rf_nilde", "È il vecchio gruista del Molo Vecchio! Dice che il 14 ottobre i cancelli dello stadio erano chiusi col lucchetto tutto il giorno: nessun ingegnere ha mai controllato i piloni, e Specchio l'ha licenziato in tronco perché aveva chiesto il verbale!");
          K.dossier.add("appalto", "nota_gruista");
          K.clock.advance(1);
          wask("rf_nilde", "La spia rossa «ON AIR» lampeggia sui 99.9 MHz: mezzo Borgo è in ascolto. Cosa mandi in onda?", [
            {
              label: "📡 Manda la denuncia del gruista in diretta integrale",
              sub: "Tutto il porto saprà del sopralluogo fantasma",
              big: true,
              cls: "hot",
              w: { libero: 2, verita: 2 },
              fn: () => {
                F.set("rf_c1_diretta", true);
                K.rel.add("rf_nilde", 2);
                setStep(N, 3);
                quest("c1_match", "Partita sulla Banchina", "Torna al Pontile delle Nebbie e parla con Nilde per sfidare i Guardiani del Cantiere.");
                say("rf_nilde", "Così mi piaci! La voce del gruista rimbomba in tutti i bar del porto… e guarda dall'oblò: i guardiani di Specchio stanno piazzando le transenne al campetto del carbone! Scendiamo a terra a dargli una lezione!");
                done();
              }
            },
            {
              label: "🔇 Sfuma sul disco rock e registra la prova in segreto",
              sub: "Evita querele immediate e conserva il nastro per il Dossier",
              big: true,
              w: { prudenza: 2, mito: 1 },
              fn: () => {
                F.set("rf_c1_diretta", false);
                K.rel.add("rf_tullio", 2);
                setStep(N, 3);
                quest("c1_match", "Partita sulla Banchina", "Torna al Pontile delle Nebbie e parla con Nilde per sfidare i Guardiani del Cantiere.");
                say("rf_nilde", "Forse hai ragione: teniamo la registrazione al sicuro nel Dossier prima che gli avvocati di Specchio si muovano. Ma giù sulla banchina stanno chiudendo il campetto del carbone: andiamo a riprendercelo col pallone!");
                done();
              }
            }
          ], "rf_cabina");
          return;
        }
        if (s === 3 && K.inZone("rf_pontile")) {
          say("rf_nilde", "I Guardiani del Cantiere hanno messo due bidoni come pali sulla polvere di carbone e ridono sotto i riflettori. Facciamogli sentire come gira il pallone sui 99.9 MHz!");
          return ask("Sfida sul campetto della Banchina del Carbone:", [
            { label: "💿 Scendi in campo (Onde d'Urto)", sub: "Radio 99.9 vs Guardiani Cantiere", big: true, cls: "hot", fn: playC1 },
            { label: "🗂️ Controlla il Dossier", sub: "Incrocia l'Ordinanza e la Testimonianza del Gruista", fn: () => K.dossier.open("appalto", () => talk.rf_nilde(), true) },
            { label: "◂ Un attimo ancora", fn: done }
          ], "rf_pontile");
        }
        say("rf_nilde", "Tieni d'occhio le frequenze con il Sintonizzatore: ogni angolo del golfo nasconde una voce.");
        done();
      }
    };

    const zones = {
      rf_pontile: {
        region: "porto",
        name: "Pontile delle Nebbie",
        short: "Pontile delle Nebbie",
        sub: "Banchina del carbone, cabina SIP a gettoni e il gozzo per le dodici miglia",
        bg: "rf_pontile",
        w: 34,
        h: 24,
        base: ",",
        start: [6, 13],
        travel: [6, 13],
        items: [[8, 15], [19, 11], [25, 8]],
        areas: [
          [2, 2, 11, 9, "Bottega Dischi & Valvole"],
          [19, 13, 28, 19, "Molo Est del Gozzo"],
          [0, 0, 33, 23, "Porto Vecchio · 1977"]
        ],
        chests: { "28,5": { coins: 25, text: "Una cassetta da marinaio con monete spicciole e valvole usate." } },
        loot: {
          "17,8": {
            id: "rf_gettone",
            text: "Premi lo sportellino metallico della cabina SIP: scivola fuori un vecchio gettone del '58 col numero otto inciso!",
            empty: "Lo sportellino del resto della cabina telefonica è vuoto."
          }
        },
        signals: [
          {
            id: "varco_molo",
            freq: 91.2,
            at: [24, 16],
            radius: 14,
            tol: 1.2,
            flag: "rf_varco_912",
            title: "91.2 MHz · Ronda di Banchina",
            lines: [
              ["voce", "Sul canale 91.2 MHz gracchia la ricetrasmittente delle guardie del Consorzio: «Ronda due rientra al capannone per il caffè, il pontile del gozzo resta scoperto!»"],
              ["rf_valvola", "Bingo! Adesso puoi scendere fino alla bitta d'ormeggio in fondo al pontile est e salire sulla Rondine Rossa!"]
            ],
            onTune(K2, first) {
              if (first) K2.bond("sintonia", 1);
              if (K2.stepOf(1) < 2) { K2.setStep(1, 2); K2.questDone("c1_varco"); }
              K2.done();
            }
          },
          {
            id: "qsl_1",
            freq: 88.6,
            at: [5, 18],
            radius: 14,
            tol: 1.2,
            tag: "qsl",
            lore: "qsl_1",
            title: "88.6 MHz · Cartolina QSL #1 (Peschereccio Albatros)",
            lines: [
              ["voce", "Tra i colpi di mare spunta una portante caldissima sugli 88.6 MHz: «Qui Peschereccio Albatros al largo di Punta Scura! Forza ragazzi dei 99.9, il golfo è con voi!»"]
            ],
            onTune(K2, first) { if (first) K2.bond("sintonia", 1); K2.done(); }
          }
        ],
        objects: {
          "13,8"() {
            K.dossier.add("appalto", "perizia_falsa");
            K.say([
              ["voce", "<b>ORDINANZA CONSORZIO COSTA NUOVA</b>: «Si dispone lo sgombero e la demolizione dello Stadio del Molo Vecchio per cedimento dei piloni verificato il 14 ottobre alle ore 15:00. Firmato: Comm. Glauco Specchio»."],
              ["voce", "Annoti i dettagli dell'Ordinanza nel <b>Dossier</b>."]
            ], K.done);
          },
          "26,19"() {
            if (S() < 2 && !K.radio.tuned("varco_molo")) {
              return K.say([["voce", "Una ronda privata sorveglia ancora la scaletta del gozzo. Usa il <b>Sintonizzatore AM/FM (📻)</b> sui <b>91.2 MHz</b> qui sul molo per capire quando il passaggio si libera!"]], K.done);
            }
            K.SFX.step();
            K.go("rf_cabina", 10, 10);
          }
        },
        flavor: {
          A: "Un'antenna dipolo artigianale legata al tetto di ardesia con filo da pesca.",
          P: "Il lampione al sodio frigge nella nebbia salmastra tingendo d'arancio le pozzanghere.",
          s: "Una panca di legno lucidata dalle cerate dei pescatori."
        },
        npcs(s) {
          const list = [{ id: "rf_valvola", at: [14, 12] }];
          if (s < 3) list.push({ id: "rf_valli", at: [21, 9] });
          if (s >= 3) list.push({ id: "rf_nilde", at: [19, 15] });
          return list;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 33, 0, "f"); lay(0, 0, 0, 19, "f"); lay(33, 0, 33, 11, "f");
          lay(0, 20, 33, 23, "w"); lay(29, 12, 33, 23, "w");
          lay(20, 14, 28, 19, ":");
          lay(4, 11, 22, 13, "+");
          house(3, 3, 7, 5, { door: [6, 7], roof: "#9a3412", wall: "#fde68a", enter: { to: "rf_bottega", at: [10, 10] } });
          put(2, 8, "A");
          put(13, 8, "n");
          put(17, 8, "K");
          put(11, 12, "P");
          put(22, 13, "P");
          put(4, 16, "s");
          put(28, 5, "x");
          put(26, 19, "S");
          [[24, 3], [25, 3], [2, 18]].forEach(([x, y]) => put(x, y, "z"));
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "DISCHI & VALVOLE ZAPPA", d.X(6) + 8, d.Y(3) - 6, "#fbbf24");
          H.plaque(g, "ORDINANZA STADIO", d.X(13) + 8, d.Y(8) - 6, "#f87171");
          H.plaque(g, "GOZZO ▸ RONDINE ROSSA", d.X(25) + 8, d.Y(19) - 8, "#38bdf8");
        }
      },

      rf_bottega: {
        interior: true,
        region: "bottega",
        name: "Bottega «Dischi & Valvole» di Lupo Zappa",
        short: "Bottega di Lupo",
        sub: "45 giri d'importazione, saldatori caldi e poster rock alle pareti",
        bg: "rf_bottega",
        w: 20,
        h: 13,
        base: "=",
        start: [10, 10],
        outside: ["rf_pontile", 6, 8],
        items: [[4, 8], [15, 8]],
        chests: { "17,10": { coins: 20, text: "Una scatola di puntine di ricambio e qualche moneta d'argento." } },
        loot: {
          "3,3": {
            id: "rf_vinile",
            text: "Dietro una pila di singoli inglesi spunta il 45 giri rosso trasparente «Rondine Rock»!",
            empty: "Restano solo copertine di rock progressivo e blues elettrico."
          }
        },
        signals: [
          {
            id: "qsl_2",
            freq: 105.4,
            at: [9, 4],
            radius: 14,
            tol: 1.2,
            tag: "qsl",
            lore: "qsl_2",
            title: "105.4 MHz · Cartolina QSL #2 (Faro Est)",
            lines: [
              ["voce", "L'amplificatore a valvole sul banco aggancia i 105.4 MHz del Guardiano del Faro Est: «Un saluto a Lupo e ai ragazzi del Molo Vecchio, la lanterna batte il tempo con voi!»"]
            ],
            onTune(K2, first) { if (first) K2.bond("sintonia", 1); K2.done(); }
          }
        ],
        flavor: {
          V: "Centinaia di 45 giri divisi non per alfabeto ma per «minuto della partita in cui suonarli».",
          R: "Un ricevitore Supereterodina del '68 col quadrante illuminato d'ambra.",
          T: "Sul bancone di legno: stagno per saldature, scalette radiofoniche e tre tazzine di caffè.",
          W: "Oltre la vetrina appannata dondolano i fanali delle barche ormeggiate."
        },
        npcs: () => [{ id: "rf_lupo", at: [10, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          put(5, 1, "W"); put(14, 1, "W");
          lay(7, 7, 12, 9, '"');
          [[3, 3], [6, 3], [13, 3], [16, 3]].forEach(([x, y]) => put(x, y, "V"));
          put(9, 3, "R");
          [[7, 6], [8, 6], [12, 6]].forEach(([x, y]) => put(x, y, "T"));
          put(17, 10, "x");
        }
      },

      rf_cabina: {
        interior: true,
        region: "studio",
        name: "Cabina di Regia · Rimorchiatore «Rondine Rossa»",
        short: "Cabina 99.9 MHz",
        sub: "A dodici miglia e mezzo dalla costa · trasmettitore valvolare acceso",
        bg: "rf_cabina",
        w: 20,
        h: 13,
        base: ":",
        start: [10, 10],
        outside: ["rf_pontile", 26, 18],
        items: [[6, 8], [13, 8]],
        flavor: {
          M: "Il banco mixer a otto piste di Radio Fuorigioco: i VU-meter saltano sul rosso ad ogni accordo di chitarra.",
          R: "L'oscilloscopio disegna un'onda sinusoidale verde purissima sui 99.9 MHz.",
          K: "Il telefono rosso collegato al ponte radio di Wanda: la linea che unisce il mare aperto al quartiere.",
          V: "Scaffale con le cartucce dei jingle e i dischi della fascia serale.",
          G: "Manometro di paratia collegato al diesel marino di Tullio.",
          W: "Dall'oblò rotondo si vedono le luci lontane del Borgo tremare sull'acqua nera."
        },
        npcs(s) {
          return s < 3 ? [{ id: "rf_nilde", at: [9, 6] }, { id: "rf_tullio", at: [5, 9] }] : [{ id: "rf_tullio", at: [5, 9] }];
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 1, "a"); lay(0, 12, 19, 12, "a"); lay(0, 0, 0, 12, "a"); lay(19, 0, 19, 12, "a");
          put(10, 12, "v");
          put(5, 1, "W"); put(14, 1, "W");
          put(9, 4, "M"); put(10, 4, "M");
          put(6, 4, "R"); put(13, 4, "K");
          put(3, 4, "V"); put(16, 4, "V");
          put(3, 9, "G"); put(17, 6, "s");
        },
        decor(g, cx, cy, d) {
          H.plaque(g, "ON AIR · 99.9 MHz", d.X(9) + 16, d.Y(3) - 2, "#ef4444");
        }
      }
    };

    return {
      n: N,
      title: "99.9 Megahertz di Ruggine",
      sub: "Il rimorchiatore oltre le dodici miglia e la soffiata del gruista",
      start: "rf_pontile",
      introBg: "rf_titolo",
      goal,
      intro: () => [
        ["voce", "<b>OTTOBRE 1977 · GOLFO DEL BORGO MARINO</b><br>Tra la nebbia salmastra del porto vecchio e i cantieri in sciopero, una spia rossa pulsa sull'acqua scura a dodici miglia e mezzo dalla riva."],
        ["rf_nilde", "«Siete sintonizzati sui 99.9 megahertz di Radio Fuorigioco, in diretta dal rimorchiatore Rondine Rossa! Chi vi parla è Nilde, e lunedì vogliono portarci via lo Stadio del Molo Vecchio…»"],
        ["voce", "Sulla banchina il Commendator Specchio ha già affisso l'ordinanza di demolizione. Raggiungi la bottega di <b>Lupo Zappa</b> per unirti all'equipaggio."]
      ],
      zones,
      talk,
      news: (id, s) => (s === 0 && id === "rf_lupo") || (s === 1 && id === "rf_valvola") || (s === 2 && id === "rf_nilde") || (s === 3 && id === "rf_nilde")
    };
    });
  }
  boot();
})();
