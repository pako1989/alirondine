// js/circuiti-c2.js - «NEO-RONDINE 2099» · Capitolo 2: Il Treno Magnetico verso la Cupola
// Il viadotto con cancello laser, piastre e guardie; il convoglio; la Cupola Olografica con la pista di luce, il salotto VIP e Z-Zero.
(function () {
  "use strict";
  function boot() {
    const E = window.__circuitiCore;
    if (!E || !E.api || !E.api.addChapter || !window.__circuitiH || !window.__emp) return setTimeout(boot, 100);
    E.api.addChapter(chapter2);
  }
  function chapter2(K) {
    const { setStep, quest, F } = K, H = window.__circuitiH(K), { say, done, ask } = H;
    const N = 2, S = () => K.stepOf(N);
    H.people();
    K.cos("nr_c2", { kind: "shirt", label: "Giubbotto della Cupola", val: "#38bdf8", from: "Capitolo 2 di Neo-Rondine 2099" });
    K.lore("l_nyx", { t: "Gli Arbitri-Androidi", d: "Automi federali programmati per l'imparzialità assoluta. Ricevono «correzioni» dal Piano 40. Nyx-09 ha cominciato a rifiutarle." });
    K.lore("l_cupola", { t: "La Cupola Olografica", d: "Lo stadio ufficiale della Vektor: una pista di luce, colonne che proiettano pubblico finto e una Divisione Beta che non perde mai." });
    const gateOpen = () => F.is("nr_gate") || K.hack.on("laser_nr_monorotaia");

    const goal = (s) => ({
      0: "Sali al viadotto (cancello nord). Passa il cancello laser e parla con Nyx-09 sulla banchina est.",
      1: "Sali sul convoglio magnetico: la porta è sul fianco del treno, banchina est.",
      2: "Attraversa il convoglio fino alla porta di testa e scendi alla Cupola.",
      3: "Cupola Olografica: sfida Z-Zero oltre la pista (porta nord-est: laser).",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 2 è concluso.");

    function fin() {
      F.set("nr_c2_done", true);
      K.reward("nr_c2", { coins: 110 + (F.is("nr_ricatto") ? 50 : 0), cos: "nr_c2" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["nr_nyx", "[serio] Barriera disattivata. Annoto: l'imparzialità non prevede il tifo. Annoto anche che sto tifando."], ["voce", `<b>FINE DEL CAPITOLO 2.</b><br>⚡ Carica ${K.stat("energia")} · 💻 Hacking ${K.stat("hackeraggio")} · Fama ${K.stat("fama")}`], ["voce", "Il Capitolo 3, «La Terrazza della Vektor Corp», ti aspetta: l'ascensore panoramico è aperto."]]), () => K.openMain(), "nr_cupola");
    }
    function match() {
      say("nr_zero", "[freddo] Probabilità di successo del Campione umano calcolata: 0.04%. Inizializzazione barriera. La Divisione Beta è composta da tre unità; il portiere ne vale dodici.");
      H.play(2, "Divisione Beta", "Sfida EMP · La Cupola", (r) => {
        if (r && r.win) { setStep(N, 4); say("nr_zero", "[pensa] Errore: due traiettorie non previste. Aggiorno la stima a 0.5%. Il sistema trova la cosa sconveniente."); K.bond("fama", 10); K.bond("hackeraggio", 4); fin(); }
        else { say("nr_zero", "[freddo] Previsione confermata. Riprova pure: ogni tentativo migliora i miei dati."); done(); }
      });
    }
    function nyxChoice() {
      ask("Nyx ti mostra un'anomalia nel registro scommesse: puntate cambiate un'ora prima del fischio, sempre dalla stessa parte. Hai una copia del chip.", [
        { label: "📂 Consegna il file al dossier di Vance", sub: "+1 prova nel Dossier, +15 stima di Nyx", big: true, cls: "hot", fn: () => { K.dossier.add("vektor", "chip"); K.rel.add("nr_nyx", 15, true); F.set("nr_nyxdoss", true); setStep(N, 1); quest("nr_c2b", "Il treno verso la Cupola", "Sali sul convoglio magnetico."); say("nr_nyx", "[serio] Registrato. Mi hai dato un testimone che non scorderà niente. Ci sto prendendo gusto, e non è previsto."); done(); } },
        { label: "💾 Tieni il chip per ricattare la sicurezza", sub: "+50 monete a fine capitolo, +10 Hacking", fn: () => { F.set("nr_ricatto", true); K.bond("hackeraggio", 10); setStep(N, 1); quest("nr_c2b", "Il treno verso la Cupola", "Sali sul convoglio magnetico."); say("nr_nyx", "[freddo] Annoto: transazione in corso. Annoto anche che non sto segnalando. Il glitch sta peggiorando."); done(); } }
      ]);
    }

    const talk = {
      nr_guard() {
        if (K.rel.scene("nr_guard")) return;
        const s = S();
        if (s === 0 && !gateOpen()) {
          say("nr_guard", "[arrabbiato] Documenti biometrici o indietro al Livello 01! La monorotaia non è per i relitti di strada!");
          return ask("Il Miliziano ti sbarra il passaggio, il cancello laser dietro di lui ronza.", [
            { label: "⭐ «Sono il Campione dei Circuiti.»", sub: "Richiede Fama 20", big: true, cls: "hot", disabled: K.stat("fama") < 20, fn: () => { F.set("nr_gate", true); say("nr_guard", "[serio] ...Il Campione. Mia figlia ha il tuo poster. Il laser è spento. Non l'ho visto io."); K.bond("fama", 2); done(); } },
            { label: "Cerca un'altra via", sub: "Terminale K sulla banchina, o le piastre sui binari", fn: () => { say("voce", "A sinistra, un terminale con la K. Sopra il cancello, i binari: quattro caselle di piastre elettrificate. Costa fiato o Hacking."); done(); } },
            { label: "Lascia stare", fn: done }
          ]);
        }
        say("nr_guard", s === 0 ? "[serio] Il cancello è aperto. Io non ho visto niente. Non ho mai visto niente." : "[serio] Documenti in regola. Prego, signore."); done();
      },
      nr_nyx() {
        if (K.rel.scene("nr_nyx")) return;
        const s = S();
        if (s === 0) {
          say("nr_nyx", "[serio] Analisi parametri: battito regolare, nessun innesto proibito rilevato. Procedura autorizzata.");
          say("nr_nyx", "Sono Nyx-09, arbitro federale. Stasera dirigo la tua gara alla Cupola. Il protocollo mi vieta di avvertirti che la Divisione Beta è truccata. Il mio glitch mi permette di non esserne sicuro.");
          K.learnLore("l_nyx"); K.learnLore("l_cupola");
          return nyxChoice();
        }
        if (s === 1) { say("nr_nyx", "[serio] Il convoglio parte tra poco. La porta è sul fianco del treno: banchina est."); return done(); }
        say("nr_nyx", "[pensa] L'imparzialità, ho scoperto, è una scelta. Spero di rifarla."); done();
      },
      nr_cyborg() { say("nr_cyborg", ["[freddo] Posto riservato.", "[ride] Scherzo. Sono vent'anni che viaggio in piedi: mi sono affezionato al palo.", "[serio] Nessuno parla dell'ultima partita. È l'unico argomento di cui si parla."][Math.floor(Math.random() * 3)]); done(); },
      nr_zero() {
        if (K.rel.scene("nr_zero")) return;
        if (S() === 3) return match();
        say("nr_zero", "[freddo] Sistema in standby. Il portiere dorme in piedi. Sogna traiettorie."); done();
      },
      nr_volt() {
        if (K.rel.scene("nr_volt")) return;
        say("nr_volt", "[furbo] Nel salotto VIP le cose valgono il doppio, e io le vendo al triplo. Prezzo di cortesia.");
        ask(`Fama ${K.stat("fama")} · Carica ${K.stat("energia")}`, [
          { label: "🕶️ Visiera olografica di scarto", sub: "8 Fama", big: true, cls: "hot", disabled: K.stat("fama") < 8 || K.inv.has("nr_visiera"), fn: () => { K.bond("fama", -8); K.inv.give("nr_visiera"); say("nr_volt", "[ride] Vedrai meglio. O sembrerai migliore. Dipende dalle luci."); done(); } },
          { label: "🔋 Ricarica", sub: "+15 Carica, passa una fascia", fn: () => { K.bond("energia", 15); K.clock.advance(1, done); } },
          { label: "Niente", fn: done }
        ]);
      }
    };

    const rail = (zid) => ({
      "12,9": () => H.hackMenu("Terminale del cancello", [
        { id: "laser_" + zid, label: "Spegnere il cancello laser", sub: "I raggi si abbassano", cost: 12, run: () => { say("voce", "I raggi rossi si sbriciolano in polvere di luce. Il Miliziano guarda altrove, con la scrupolosa attenzione di chi non vuole vedere."); done(); } },
        { id: "pol_" + zid, label: "Invertire la polarità delle piastre", sub: "I binari sopra il cancello non scaricano", cost: 8, run: () => { say("voce", "Le piastre dei binari si spengono con un lamento. Adesso sono solo lamiera con la pretesa."); done(); } },
        { id: "dev_" + zid + "_0", label: "Deviare la sentinella est", sub: "Guarda un pannello pubblicitario", cost: 10, run: () => { say("voce", "La sentinella ruota di novanta gradi e comincia a fissare un cartellone di un detersivo. Per ora, è innamorata."); done(); } },
        { id: "blackout", label: "Forzare un blackout", sub: "Luci e sentinelle spente", cost: 6, alert: true, once: false, run: () => { K.clock.set(K.clock.day(), 1); say("voce", "La banchina sprofonda nel buio. La rete ti ha segnato in rosso."); done(); } },
        { id: "ric", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
      ])
    });

    const zones = {
      nr_monorotaia: {
        region: "monorotaia", name: "Neo-Rondine 2099 · Il Viadotto", short: "Viadotto", sub: "Monorotaia magnetica, cancello laser e piastre sui binari", bg: "nr_monorotaia", time: "notte", w: 32, h: 20, base: "o", start: [4, 10], sneakStart: [4, 10],
        itemCos: "nr_c2", items: [[2, 8], [7, 17], [22, 14], [29, 8]], hide: "h",
        areas: [[0, 7, 13, 15, "La banchina ovest"], [18, 7, 31, 15, "La banchina est"], [0, 16, 13, 19, "Il deposito sotto la banchina"], [0, 3, 31, 6, "I binari"], [0, 0, 31, 19, "Il Viadotto"]],
        act: { K: "Usa il terminale", V: "Guarda il distributore", E: "Guarda il traliccio", Q: "Guarda l'insegna", I: "Guarda i tubi", F: "Guarda il cancello laser", N: "Guarda la colonna olografica", x: "Fruga nel cassonetto", q: "Sali sul convoglio", n: "Leggi il tabellone", s: "Siediti un momento" },
        flavor: { n: "Un tabellone: «CUPOLA · ORE 22:40 · IN ORARIO». Sotto, a pennarello: «sempre».", V: "Un distributore di tè freddo, colori sgargianti, sapore ignoto.", F: "Un cancello laser: raggi rossi a tre altezze, per chi striscia, chi salta e chi sta in piedi.", E: "Un traliccio EMP: attorno a lui l'aria tiene i capelli dritti.", I: "Tubi di raffreddamento, vapore bianco che sale tra i binari.", R: "Il convoglio magnetico: argento, finestrini caldi, nessuno che sorride.", Q: "Un'insegna olografica: «VEKTOR · IL FUTURO È GIÀ PAGATO».", N: "Una colonna olografica: proietta sempre lo stesso tifoso, e sempre lo stesso sorriso." },
        loot: { "3,18": { id: "nr_datapad", text: "Nel cassonetto del deposito, sotto un involucro di tè: un datapad inciso, «1939».", empty: "Il cassonetto è vuoto. Solo tè freddo e fogli bagnati." } },
        objects: rail("nr_monorotaia"),
        onSeen: () => say([["voce", "Una sentinella della Vektor ti punta la luce in faccia. Ti ritrovi all'inizio della banchina, con il cuore che batte a ritmo di elettrodi."]], done),
        npcs: (s) => {
          const l = [{ id: "nr_guard", at: [13, 10] }, { id: "nr_volt", at: [8, 17] }];
          if (s <= 1) l.push({ id: "nr_nyx", at: [21, 9] });
          if (!K.hack.on("dev_nr_monorotaia_0") && K.clock.slot() !== 1) l.push({ id: "nr_guard", at: [20, 12], route: [[20, 12], [29, 12], [29, 8], [20, 8]], speed: 0.5, guard: { range: 5, cone: 0.55 } });
          else if (K.hack.on("dev_nr_monorotaia_0")) l.push({ id: "nr_guard", at: [29, 12], face: "right", guard: { range: 3, cone: 0.35 } });
          return l;
        },
        intro: [["voce", "Il viadotto è una cicatrice di cemento nel cielo. Sotto, i bassifondi; sopra, la pioggia filtrata. In mezzo, un cancello laser e una sentinella."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 31, 2, "C"); lay(0, 3, 31, 5, "r"); lay(0, 6, 31, 6, "i"); lay(0, 7, 31, 15, "o"); lay(0, 16, 13, 19, "_"); lay(14, 16, 31, 19, "C");
          lay(14, 3, 17, 6, "e"); lay(14, 7, 17, 15, "C");
          if (gateOpen()) lay(14, 10, 17, 11, "o"); else lay(14, 10, 17, 11, "F");
          lay(19, 3, 30, 5, "R"); put(25, 5, "q");
          [[5, 9], [4, 13], [9, 12], [11, 15], [21, 12], [27, 11], [28, 13], [20, 14]].forEach(([x, y]) => put(x, y, "h"));
          put(12, 9, "K"); put(3, 18, "x"); put(2, 7, "n"); [[1, 12], [30, 12]].forEach(([x, y]) => put(x, y, "V")); [[10, 7], [22, 7], [30, 8]].forEach(([x, y]) => put(x, y, "E"));
          [[9, 8], [26, 8]].forEach(([x, y]) => put(x, y, "Q")); put(2, 16, "I"); put(12, 18, "I"); put(11, 19, "I");
          [[7, 8], [8, 8], [23, 14], [24, 14]].forEach(([x, y]) => put(x, y, "N")); put(6, 17, "s");
          put(1, 19, "q");
        },
        doors: { "1,19": { to: "nr_vicoli", at: [15, 6] } },
        decor(g, cx, cy, d) { H.plaque(g, "CUPOLA ▸ BANCHINA 2", d.X(25) + 8, d.Y(5) - 6, "#22d3ee"); H.plaque(g, "ACCESSO RISERVATO", d.X(15) + 16, d.Y(10) - 14, "#fb7185"); H.plaque(g, "◂ LIVELLO 01", d.X(2) + 8, d.Y(17) + 4, "#fbbf24"); }
      },
      nr_cabina: {
        interior: true, region: "cabina", name: "Neo-Rondine 2099 · Il Convoglio", short: "Convoglio", sub: "Sedili imbottiti, finestrini sulla città e un terminale sul fondo", bg: "nr_monorotaia", w: 24, h: 9, start: [2, 7], outside: ["nr_monorotaia", 25, 6],
        act: { M: "Siediti sul sedile", W: "Guarda dal finestrino", K: "Usa il terminale", V: "Guarda il distributore", Q: "Leggi l'avviso", q: "Porta di testa" },
        flavor: { M: "Un sedile imbottito che ricorda tutte le schiene che lo hanno scelto.", W: "Fuori, la Cupola brilla come una moneta d'oro lanciata in alto. Dentro, il tuo volto sul vetro.", V: "Un distributore: caffè in lattina, cioccolato di sintesi, e una merendina che si dichiara «ispirata a fatti reali».", Q: "«Il silenzio è oro. Il rumore, multa.» — firmato Vektor." },
        objects: {
          "22,4": () => {
            if (S() < 1) { say("voce", "La porta di testa è chiusa. Prima, con Nyx, devi essere in regola."); return done(); }
            if (S() === 1) { setStep(N, 2); }
            if (S() === 2) { setStep(N, 3); quest("nr_c2c", "La Cupola Olografica", "Sfida Z-Zero al fondo della pista."); K.scene([["voce", "La monorotaia sibila nella notte. Poi le porte si aprono su un oceano di luce: la Cupola Olografica."]], () => K.go("nr_cupola", 4, 20)); return; }
            K.go("nr_cupola", 4, 20);
          },
          "21,2": () => H.hackMenu("Scatola nera del convoglio", [
            { id: "bb", label: "Leggere il registro del convoglio", sub: "+1 prova nel Dossier", cost: 8, run: () => { K.dossier.add("vektor", "scommesse"); say("voce", "Tra i tempi di percorrenza e i passeggeri, un secondo registro: puntate cambiate un'ora prima del fischio, sempre dalla stessa parte."); done(); } },
            { id: "ric4", label: "Ricarica alla presa", sub: "+15 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 15); K.clock.advance(1, done); } }
          ])
        },
        npcs: () => [{ id: "nr_cyborg", at: [8, 4] }, { id: "nr_cyborg", at: [13, 5] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 8, "+"); lay(0, 0, 23, 1, "a"); lay(0, 0, 0, 8, "a"); lay(23, 0, 23, 8, "a"); lay(0, 8, 23, 8, "a"); put(2, 8, "v");
          [3, 6, 9, 12, 15, 18].forEach((x) => put(x, 1, "W")); for (let x = 3; x <= 19; x += 4) { put(x, 3, "M"); put(x + 1, 3, "M"); put(x, 6, "M"); put(x + 1, 6, "M"); }
          put(22, 4, "q"); put(21, 2, "K"); put(1, 2, "V"); put(1, 6, "Q"); put(22, 7, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CONVOGLIO 7", d.X(11) + 8, d.Y(1) + 4, "#22d3ee"); H.plaque(g, "TESTA ▸", d.X(21) + 8, d.Y(3) + 4, "#fbbf24"); }
      },
      nr_cupola: {
        region: "cupola", name: "Neo-Rondine 2099 · La Cupola Olografica", short: "Cupola", sub: "Pista di luce, colonne olografiche e un portiere che non para: prevede", bg: "nr_cupola", time: "notte", w: 30, h: 22, base: "o", start: [4, 20], sneakStart: [4, 20],
        itemCos: "nr_c2", items: [[4, 8], [26, 16], [26, 18], [12, 20]], hide: "h",
        areas: [[7, 6, 22, 15, "La pista di luce"], [24, 7, 29, 13, "L'area di Z-Zero"], [10, 0, 19, 4, "Il salotto VIP"], [0, 17, 8, 21, "La stazione della monorotaia"], [0, 0, 29, 21, "La Cupola Olografica"]],
        act: { K: "Usa il terminale", N: "Guarda la colonna olografica", M: "Guarda le gradinate", Q: "Guarda l'insegna", F: "Guarda la barriera", V: "Guarda il distributore", q: "Entra", s: "Siediti un momento" },
        flavor: { N: "Una colonna olografica: tifosi di luce che applaudono a comando. Se la spegni, resti con il vuoto.", M: "Gradinate vuote. Il pubblico è un file audio e un'idea di pubblico.", Q: "«LA CUPOLA · DOVE IL RISULTATO È SEMPRE SICURO».", F: "Una barriera laser a tre altezze: qui il portiere non vuole visite.", R: "Il convoglio riposa, spento, con l'aria di chi ha fatto il suo.", V: "Un distributore di cocktail olografici: l'alcol è illusione, il prezzo no." },
        objects: {
          "6,10": () => H.hackMenu("Terminale della pista", [
            { id: "laser_nr_cupola", label: "Spegnere la barriera di Z-Zero", sub: "L'area del portiere si apre", cost: 14, run: () => { say("voce", "I raggi rossi si piegano e si spengono. Z-Zero alza la testa di luce: ti ha visto."); done(); } },
            { id: "dev_nr_cupola_0", label: "Deviare la Divisione Beta di pattuglia", sub: "Si fermano a guardare il cielo olografico", cost: 10, run: () => { say("voce", "I cyborg della Beta guardano in alto, incantati da un cielo che hanno pagato loro."); done(); } },
            { id: "pol_nr_cupola", label: "Invertire le piastre del corridoio", sub: "Il corridoio nord è libero", cost: 8, run: () => { say("voce", "Le piastre si spengono come una luce in cucina."); done(); } },
            { id: "ric5", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
          ]),
          "15,3": () => K.go("nr_vip", 8, 11)
        },
        onSeen: () => say([["voce", "Un cyborg della Divisione Beta ti punta la luce al volto e ti riaccompagna con garbo alla stazione. Con troppo garbo."]], done),
        npcs: (s) => {
          const l = [];
          l.push(s >= 3 ? { id: "nr_zero", at: [26, 10], face: "left" } : { id: "nr_zero", at: [26, 10] });
          if (!K.hack.on("dev_nr_cupola_0") && K.clock.slot() !== 1) l.push({ id: "nr_cyborg", at: [8, 6], route: [[8, 6], [21, 6], [21, 15], [8, 15]], speed: 0.55, guard: { range: 5, cone: 0.55 } });
          else if (K.hack.on("dev_nr_cupola_0")) l.push({ id: "nr_cyborg", at: [14, 6], face: "up", guard: { range: 3, cone: 0.3 } });
          return l;
        },
        intro: [["voce", "La Cupola Olografica: un cielo che costa più della città sotto. In mezzo, una pista di luce e, in fondo, un portiere che non para: calcola."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 29, 21, "o"); lay(0, 0, 9, 4, "C"); lay(20, 0, 29, 4, "C"); lay(10, 0, 19, 2, "C"); lay(0, 5, 0, 16, "C"); lay(29, 14, 29, 21, "C");
          lay(7, 6, 22, 15, "g"); lay(7, 5, 22, 5, "M"); lay(7, 16, 22, 16, "M"); lay(10, 5, 11, 5, "o"); lay(18, 16, 19, 16, "o");
          lay(0, 17, 8, 21, "i"); lay(1, 17, 7, 19, "R"); lay(2, 20, 7, 21, "r");
          lay(24, 7, 28, 13, "g"); lay(24, 7, 24, 7, "N"); lay(24, 13, 24, 13, "N");
          if (K.hack.on("laser_nr_cupola") || S() >= 4) lay(23, 9, 23, 11, "g"); else lay(23, 9, 23, 11, "F");
          lay(12, 3, 17, 4, "p"); put(15, 3, "q"); put(14, 2, "Q"); put(16, 2, "Q");
          [[7, 17], [22, 17], [12, 11], [17, 11]].forEach(([x, y]) => put(x, y, "N"));
          put(6, 10, "K"); put(2, 12, "V"); put(26, 20, "Q");
          [[3, 8], [4, 9], [25, 5], [26, 6], [27, 16], [10, 19], [11, 20], [20, 19], [21, 20]].forEach(([x, y]) => put(x, y, "h"));
          lay(14, 18, 17, 20, "e"); put(8, 8, "s");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CUPOLA OLOGRAFICA", d.X(15) + 8, d.Y(2) + 6, "#facc15"); H.plaque(g, "AREA GOAL · ACCESSO VIETATO", d.X(26) + 8, d.Y(7) - 6, "#fb7185"); H.plaque(g, "◂ MONOROTAIA", d.X(3) + 8, d.Y(17) - 4, "#22d3ee"); }
      },
      nr_vip: {
        interior: true, region: "vip", name: "Neo-Rondine 2099 · Il Salotto VIP", short: "Salotto VIP", sub: "Moquette viola, lampadari di luce e un caveau", bg: "nr_cupola", w: 18, h: 13, start: [8, 11], outside: ["nr_cupola", 15, 4],
        act: { D: "Guarda il bancone", T: "Guarda il tavolo", K: "Usa il terminale", N: "Guarda la colonna", J: "Guarda il jukebox", x: "Apri il cassetto", Q: "Guarda l'insegna", M: "Guarda il divano", W: "Guarda la vetrata" },
        flavor: { D: "Un bancone di vetro con ghiaccio che non si scioglie mai: troppo costoso per farlo.", T: "Un tavolo da cocktail: due calici vuoti e una prenotazione a nome di nessuno.", N: "Una colonna olografica: proietta il Barone che stringe mani. Non si vede mai in carne.", J: "Un jukebox dorato che suona solo musica che costa.", Q: "«RISERVATO AGLI AZIONISTI · I TIFOSI SONO PREGATI DI GUARDARE».", M: "Un divano in velluto sintetico. Il cuscino ha una scritta ricamata: «mai da questa parte».", W: "Una vetrata sulla pista: da qui il campo sembra un francobollo luminoso." },
        loot: { "1,2": { id: "nr_datapad", text: "Nel cassetto del caveau, accanto a un orologio rotto: un datapad inciso «1950».", empty: "Il cassetto è vuoto. Un orologio e una polvere dorata." } },
        objects: { "15,2": () => H.hackMenu("Terminale del caveau", [
          { id: "bonifico_hk", label: "Leggere i bonifici del Barone", sub: "+1 prova nel Dossier", cost: 12, alert: true, run: () => { K.dossier.add("vektor", "bonifico"); say("voce", "Pagamenti mensili da «V-Corp Holdings» a quattro arbitri-androidi. Il Barone non nasconde nulla: considera la cosa irrilevante."); done(); } },
          { id: "ric6", label: "Ricarica alla presa", sub: "+15 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 15); K.clock.advance(1, done); } }
        ]) },
        npcs: () => [{ id: "nr_volt", at: [4, 8] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 17, 12, "p"); lay(0, 0, 17, 1, "a"); lay(0, 0, 0, 12, "a"); lay(17, 0, 17, 12, "a"); lay(0, 12, 17, 12, "a"); put(8, 12, "v");
          [3, 7, 11, 14].forEach((x) => put(x, 1, "W")); lay(4, 4, 11, 4, "D"); [[3, 7], [6, 8], [11, 8], [13, 6]].forEach(([x, y]) => put(x, y, "T"));
          put(1, 2, "x"); put(15, 2, "K"); put(16, 5, "J"); put(2, 10, "M"); put(3, 10, "M"); put(14, 10, "M"); put(15, 10, "M"); put(8, 2, "Q"); put(1, 6, "N"); put(16, 9, "N");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALOTTO VIP", d.X(8) + 8, d.Y(1) + 4, "#facc15"); }
      }
    };
    return {
      n: N, title: "Il Treno Magnetico verso la Cupola", sub: "Il Giudizio Sintetico",
      goal, start: "nr_monorotaia", introBg: "nr_monorotaia", zones, talk, obj: {},
      intro: [["voce", "Il pass magnetico è pronto. Il viadotto sale sopra i bassifondi come una promessa fatta male."], ["nr_kira", "[serio] Non posso seguirti oltre la banchina. Il cancello è un guaio, ma i guai sono economici, qui. La Cupola, invece, costa tutto."]]
    };
  }
  boot();
})();
