// js/circuiti-c1.js - «NEO-RONDINE 2099» · Capitolo 1: I Bassifondi del Livello 01
// Vicoli sotto la pioggia, un drone che blocca la strada, il Cyber-Bar di Bullone-7 e l'Officina Clandestina di Rusty Jax. Primi terminali, prima sfida EMP.
(function () {
  "use strict";
  function boot() {
    const E = window.__circuitiCore;
    if (!E || !E.api || !E.api.addChapter || !window.__circuitiH || !window.__emp) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__circuitiH(K), { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("nr_c1", { kind: "shirt", label: "Guscio in nanotubi", val: "#06b6d4", from: "Capitolo 1 di Neo-Rondine 2099" });
    K.lore("l_vektor", { t: "La Vektor Corp", d: "Controlla ogni luce, ogni treno e i brevetti neurali dei calciatori. Il campionato ufficiale lo giocano automi imbattibili, per gli azionisti." });
    K.lore("l_circuiti", { t: "I Circuiti d'Oro", d: "La lega clandestina dei sotterranei: una sfera conduttrice, nodi che caricano, cyborg sulla rotaia. Vince chi segna senza farsi scaricare." });
    K.lore("l_terminali", { t: "I Terminali", d: "Consolle sulla mappa. Con l'Hacking Neurale si deviano i droni, si invertono le piastre elettrificate e si aprono le serrande. Chi forza la rete alza l'Allarme." });

    const goal = (s) => ({
      0: "Parla con K1-RA, nel cortile del tombino.",
      1: "Al Cyber-Bar: Bullone-7 ha la batteria per l'officina.",
      2: "Porta la batteria a Rusty Jax, all'Officina (est). Attento al drone.",
      3: "Rusty Jax: calibra la sfera e supera la sfida EMP contro i Cyborg Clandestini.",
      4: "Il capitolo si chiude con K1-RA e il pass magnetico."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      F.set("nr_c1_done", true);
      K.reward("nr_c1", { coins: 90, cos: "nr_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([["nr_kira", "[felice] Frequenza decifrata. Il pass magnetico per la monorotaia parte stanotte. Ti avverto: lassù le guardie hanno cinque sensi e nessun senso dell'umorismo."], ["voce", `<b>FINE DEL CAPITOLO 1.</b><br>⚡ Carica ${K.stat("energia")} · 💻 Hacking ${K.stat("hackeraggio")} · Fama ${K.stat("fama")}`], ["voce", "Il Capitolo 2, «Il Treno Magnetico verso la Cupola», ti aspetta."]]), () => K.openMain(), "nr_titolo");
    }
    function match() {
      say("nr_jax", "[felice] Quella gamba non tradisce mai, ma contro i loro schermaggi serve un impulso EMP calibrato a dovere. Ecco i Cyborg Clandestini: uno solo, lento, tanto per scaldarsi.");
      H.play(1, "Cyborg Clandestini", "Sfida EMP · Livello 01", (r) => {
        if (r && r.win) { setStep(N, 4); say("nr_jax", "[felice] Due gol e la sfera ancora intera! Non vedevo un tiro così dal '70."); K.bond("fama", 8); K.bond("hackeraggio", 3); fin(); }
        else { say("nr_jax", "[pensa] Riprova. Il segreto è far rimbalzare la sfera sui nodi: ogni tocco la carica, e a 60 puoi scaricare l'EMP."); done(); }
      });
    }
    const drone = () => ask("Il drone di blocco incrocia il tuo percorso. Hai pochi secondi.", [
      { label: "💻 Hackeraggio neurale del sensore", sub: "+10 Hacking, −5 Carica", big: true, cls: "hot", fn: () => { K.bond("hackeraggio", 10); K.bond("energia", -5); K.hack.set("dev_nr_vicoli_0"); F.set("nr_dron_choice", true); say("voce", "Le dita corrono sul polso: il sensore si inchina e il drone ruota verso un muro. Hai guadagnato qualcosa, e perso un po' di fiato."); done(); } },
      { label: "🏃 Scatto atletico sotto la pioggia", sub: "+10 Carica, +5 Fama", fn: () => { K.bond("energia", 10); K.bond("fama", 5); K.hack.set("dev_nr_vicoli_0"); F.set("nr_dron_choice", true); say("voce", "Scivoli sull'asfalto bagnato, rimbalzi su un cassonetto e passi sotto il cono. Qualcuno, da un balcone, applaude. Il drone si riavvia confuso."); done(); } }
    ]);

    const talk = {
      nr_kira() {
        if (K.rel.scene("nr_kira")) return;
        const s = S();
        if (s === 0) {
          say("nr_kira", "[serio] Benvenuto nel fango, Campione. Se vuoi sfidare Vektor devi prima imparare a non farti friggere dai droni.");
          say("nr_kira", "Tre regole. Uno: i droni vedono davanti a sé, non dietro; le grate d'ombra ti nascondono. Due: i terminali con la K costano Hacking, ma deviano un drone o aprono una serranda. Tre: se ti beccano, scegli la figura che ti riesce meglio.");
          say("nr_kira", "Bullone-7, al Cyber-Bar, ha la batteria che serve a Rusty. Poi l'Officina, a est. Non ti dico di sbrigarti: la pioggia lo fa per me.");
          K.learnLore("l_vektor"); K.learnLore("l_circuiti"); K.learnLore("l_terminali"); setStep(N, 1);
          quest("nr_c1", "La Frequenza Proibita", "Al Cyber-Bar: Bullone-7 ha la batteria."); return done();
        }
        if (s === 2) {
          return ask("Kira ti guarda dal tombino.", [
            { label: "Nessun consiglio, grazie", fn: () => { say("nr_kira", "Come vuoi. Non scordare le grate d'ombra."); done(); } },
            { label: "🌑 Aspetta il Blackout", sub: "I droni si spengono; passa il tempo", fn: () => { K.clock.set(K.clock.day(), 1); say("nr_kira", "[furbo] Tutto spento. Hai un'ora, forse. Muoviti."); done(); } }
          ]);
        }
        say("nr_kira", s === 1 ? "Il Cyber-Bar è lì, a sinistra. Bullone-7 al banco." : s === 3 ? "Rusty ti aspetta nell'officina." : "Bravo. Domani, la monorotaia."); done();
      },
      nr_bolt() {
        if (K.rel.scene("nr_bolt")) return;
        const s = S();
        if (s === 1) {
          say("nr_bolt", "[serio] Bzzz. Bullone-sette. Batteria... trovata. Cella al litio, sovraccaricata. Ti serve per la gamba di Rusty.");
          say("nr_bolt", "Un consiglio non richiesto: a est c'è un drone di blocco. Si può aggirare con un hack, o di corsa. Io, di corsa, mi arrugginisco.");
          K.inv.give("nr_cella"); setStep(N, 2); quest("nr_c1b", "La batteria per Rusty", "Portala all'Officina, a est. Il drone di blocco ti aspetta.");
          return done();
        }
        say("nr_bolt", s < 1 ? "Bzzz. Prima parla con Kira, nei cortili." : "Bzzz. Il banco è aperto. Il cuore, meno."); done();
      },
      nr_jax() {
        if (K.rel.scene("nr_jax")) return;
        const s = S();
        if (s === 2) {
          say("nr_jax", "[felice] Una Cella al Litio! Dalle mani di Bullone, quindi senza sconti. Mettila qui: vediamo se la gamba risponde.");
          say("nr_jax", "Ora l'EMP: una sfera conduttrice, nodi da far rimbalzare e un cyborg che ti sta in mezzo. Non è calcio. È calcio con la corrente.");
          setStep(N, 3); quest("nr_c1c", "La sfera calibrata", "Parla con Rusty Jax per la sfida EMP."); return done();
        }
        if (s === 3) return match();
        say("nr_jax", s < 2 ? "Chi sei? Le porte, qui, si bussano." : "Gamba a posto, tiro pure. Che serata."); done();
      },
      nr_volt() {
        if (K.rel.scene("nr_volt")) return;
        say("nr_volt", "[furbo] Batterie, bypass, celle ad alto voltaggio. Il banco non esiste, ma i prezzi sì. Con la tua fama, ti faccio lo sconto da amico.");
        const cheap = K.stat("fama") >= 30;
        ask(`Fama ${K.stat("fama")} · Carica ${K.stat("energia")}`, [
          { label: "🧪 Pillola refrigerante", sub: cheap ? "2 Fama (sconto)" : "5 Fama", big: true, cls: "hot", disabled: K.stat("fama") < (cheap ? 2 : 5) || K.inv.has("nr_pillola"), fn: () => { K.bond("fama", -(cheap ? 2 : 5)); K.inv.give("nr_pillola"); say("nr_volt", "[ride] Fresca come un ricatto. Niente garanzie."); done(); } },
          { label: "🔋 Ricarica della gamba", sub: "+15 Carica, passa una fascia", fn: () => { K.bond("energia", 15); K.clock.advance(1, done); } },
          { label: "Niente", fn: done }
        ]);
      },
      nr_drone() { say("nr_drone", "[freddo] Soggetto non autorizzato. Segnalazione in corso."); done(); }
    };
    const zones = {
      nr_vicoli: {
        region: "vicoli", name: "Neo-Rondine 2099 · I Bassifondi", short: "Bassifondi", sub: "Livello 01, sotto la pioggia acida", bg: "nr_vicoli", time: "notte", w: 32, h: 22, base: "_", start: [4, 10], sneakStart: [4, 10],
        itemCos: "nr_c1", items: [[2, 12], [28, 9], [16, 20], [28, 13]], hide: "h",
        areas: [[0, 7, 31, 13, "La strada dei Bassifondi"], [13, 14, 19, 21, "Il cortile del tombino"], [14, 0, 17, 6, "Il vicolo nord"], [0, 0, 31, 21, "Livello 01"]],
        act: { n: "Leggi l'insegna", Q: "Guarda l'insegna olografica", x: "Fruga nel cassonetto" },
        flavor: { n: "Un'insegna: «CYBER-BAR · ORE 20-04 · NIENTE CHIP, NIENTE DOMANDE». Qualcuno ha aggiunto: «niente ricevute».", Q: "Un'insegna olografica che balbetta: si accende, si spegne, e promette qualcosa di diverso ogni volta.", V: "Un distributore: «Birra sintetica», «Acqua riciclata», «Anima in scatola (esaurita)».", E: "Un traliccio EMP: l'aria, intorno, sa di ferro e di temporale chiuso in una scatola.", I: "Tubi e sfiati: dal Livello 02 scende vapore tiepido, che qui chiamano «il sole».", C: "Un palazzo di cento finestre: novantanove illuminate, una con la tenda tirata." },
        loot: { "13,17": { id: "nr_datapad", text: "Sotto una pila di schede scartate, una memoria ottica con una scritta a mano: «1900».", empty: "Il cassonetto è vuoto. Rimangono schede bruciate e un odore di batteria." } },
        doors: {
          "6,6": { to: "nr_bar", at: [8, 10] },
          "15,0": { to: "nr_monorotaia", at: [4, 10], locked: (K2) => (K2.mem().done || {})[1] ? false : "Il pass magnetico non è ancora pronto. Prima il capitolo dell'officina." },
          "16,0": { to: "nr_monorotaia", at: [4, 10], locked: (K2) => (K2.mem().done || {})[1] ? false : "Il pass magnetico non è ancora pronto. Prima il capitolo dell'officina." },
          "24,6": { text: "La bottega CHIPS. La serranda è abbassata: «Chiuso per inventario di Stato». L'inventario dura da tre anni." }
        },
        objects: {
          "13,9": () => H.hackMenu("Terminale di strada", [
            { id: "dev_nr_vicoli_0", label: "Deviare il drone est", sub: "Il cono guarda un muro", cost: 10, run: () => { say("voce", "Il cono del drone ruota lentamente verso un muro cieco. Per un po' ti ignorerà."); done(); } },
            { id: "pol_nr_vicoli", label: "Invertire la polarità delle piastre", sub: "Il vicolo nord diventa calpestabile", cost: 8, run: () => { say("voce", "Le piastre del vicolo nord si spengono con un sospiro. Adesso sono solo lamiera."); done(); } },
            { id: "blackout", label: "Forzare un blackout", sub: "I droni si spengono", cost: 6, alert: true, once: false, run: () => { K.clock.set(K.clock.day(), 1); say("voce", "Le luci muoiono a ventaglio. La rete ti ha visto e non è contenta."); done(); } },
            { id: "ric", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
          ]),
          "24,12": () => H.hackMenu("Terminale della serranda", [
            { id: "serranda", label: "Aprire la serranda stagna dell'Officina", sub: "Senza forzarla", cost: 12, run: () => { say("voce", "Il motore della serranda geme e sale. Dietro, un pannello di luce verde."); done(); } },
            { id: "ric2", label: "Ricarica alla presa", sub: "+20 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 20); K.clock.advance(1, done); } }
          ]),
          "25,14": () => {
            if (K.hack.on("serranda") || F.is("nr_forzata")) return K.go("nr_officina", 10, 14);
            ask("La serranda stagna dell'Officina è abbassata.", [
              { label: "💪 Forza la serranda a mano", sub: "−15 Carica", big: true, cls: "hot", disabled: K.stat("energia") < 15, fn: () => { K.bond("energia", -15); F.set("nr_forzata", true); say("voce", "Ti pieghi, afferri il bordo e spingi. Il metallo grida, poi cede di dieci centimetri e quindici anni di ruggine."); done(); } },
              { label: "Il terminale lì vicino", sub: "Costa Hacking, non fatica", fn: () => { say("voce", "A sinistra, un terminale con una K lampeggiante. Fa tutto da solo, se ha di che pagare."); done(); } },
              { label: "Lascia stare", fn: done }
            ]);
          }
        },
        onSeen: () => (F.is("nr_dron_choice") ? say([["voce", "Il drone ti inquadra e ti marca. La rete ti riporta indietro, nell'ombra: riprova."]], done) : drone()),
        npcs: (s) => [{ id: "nr_kira", at: [16, 17] }, { id: "nr_volt", at: [18, 19] }].concat(H.drones("nr_vicoli", [Object.assign([[20, 10], [30, 10], [30, 12], [20, 12]], { rest: [24, 10], facing: "up" }), Object.assign([[14, 8], [17, 8], [17, 12], [14, 12]], { rest: [15, 9], facing: "up", speed: 0.6 })], K)),
        intro: [["voce", "Livello 01. Pioggia acida, insegne al neon e un cielo di lamiera che non si è mai visto in faccia."], ["voce", "Sopra, il Livello 02 sembra un'altra città. Sotto, c'è questa."]],
        build(L) {
          const { lay, put } = L;
          lay(0, 7, 31, 13, "_"); lay(20, 13, 31, 13, "i"); lay(13, 14, 19, 21, "_"); lay(14, 0, 17, 6, "_");
          lay(0, 0, 13, 6, "C"); lay(18, 0, 31, 6, "C"); lay(0, 14, 12, 21, "C"); lay(20, 14, 31, 21, "C");
          put(6, 6, "q"); put(24, 6, "q"); put(15, 0, "q"); put(16, 0, "q"); put(25, 14, "q");
          lay(14, 2, 17, 4, "e"); [[22, 13], [21, 13], [27, 13], [28, 13], [3, 8], [30, 8], [14, 20], [18, 16]].forEach(([x, y]) => put(x, y, "h"));
          [[12, 8], [19, 12], [29, 9]].forEach(([x, y]) => put(x, y, "E")); [[3, 12], [30, 12], [15, 15]].forEach(([x, y]) => put(x, y, "V")); [[8, 13], [26, 8]].forEach(([x, y]) => put(x, y, "Q")); [[19, 7], [28, 7], [18, 20]].forEach(([x, y]) => put(x, y, "I"));
          put(13, 9, "K"); put(24, 12, "K"); put(13, 17, "x"); put(2, 7, "n"); put(10, 12, "s");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CYBER-BAR", d.X(6) + 8, d.Y(6) - 6, "#f0abfc"); H.plaque(g, "CHIPS", d.X(24) + 8, d.Y(6) - 6, "#fb7185"); H.plaque(g, "OFFICINA ◂ SERRANDA 4", d.X(25) + 8, d.Y(14) - 6, "#a3e635"); H.plaque(g, "LIVELLO 02 ▲", d.X(15) + 16, d.Y(0) + 24, "#fbbf24"); H.plaque(g, "TOMBINO 9", d.X(16) + 8, d.Y(19) + 4, "#22d3ee"); }
      },
      nr_bar: {
        interior: true, region: "bar", name: "Neo-Rondine 2099 · Il Cyber-Bar", short: "Cyber-Bar", sub: "Neon viola, jukebox e un droide al banco", bg: "nr_vicoli", w: 16, h: 12, start: [8, 10], outside: ["nr_vicoli", 6, 7],
        act: { J: "Guarda il jukebox", D: "Guarda il bancone", T: "Guarda il tavolo", W: "Guarda la finestra", K: "Usa il terminale", Q: "Guarda l'insegna" },
        flavor: { J: "Un jukebox. Sceglie lui la canzone, e sceglie sempre la peggiore. I clienti dicono che è un artista.", D: "Un bancone di ferro e luce. Dietro, bottiglie che non sono mai state bottiglie.", T: "Un tavolo con un bicchiere dimenticato. Dentro, un liquido azzurro e una promessa.", W: "Una finestra: fuori piove, dentro piove meno. Il neon fa da sole.", Q: "Un'insegna: «NIENTE DOMANDE». In piccolo: «solo risposte a pagamento»." },
        loot: { "13,9": { id: "nr_datapad", text: "Sotto uno sgabello, avvolto in un tovagliolo: un datapad con un'incisione, «1912».", empty: "Sotto lo sgabello c'è solo polvere di neon." } },
        objects: { "14,8": () => H.hackMenu("Terminale del bar", [{ id: "ric3", label: "Ricarica alla presa", sub: "+15 Carica, passa una fascia", once: false, run: () => { K.bond("energia", 15); K.clock.advance(1, done); } }, { id: "gossip", label: "Leggere il canale dei clienti", sub: "+5 Fama", once: true, run: () => { K.bond("fama", 5); say("voce", "Il canale dei clienti parla di una lega clandestina nei sotterranei e di un Campione nuovo. Non ti nomina, ma ci va vicino."); done(); } }]) },
        npcs: () => [{ id: "nr_bolt", at: [6, 3] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v");
          [3, 7, 11].forEach((x) => put(x, 1, "W")); lay(3, 4, 9, 4, "D"); [[3, 7], [8, 7], [12, 6], [5, 9]].forEach(([x, y]) => put(x, y, "T")); put(13, 3, "J"); put(14, 3, "J"); put(1, 3, "Q"); put(14, 8, "K"); put(13, 9, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CYBER-BAR", d.X(8) + 8, d.Y(1) + 4, "#f0abfc"); }
      },
      nr_officina: {
        interior: true, region: "officina", name: "Neo-Rondine 2099 · L'Officina Clandestina", short: "Officina", sub: "Schermi verdi, un torchio e una gamba meccanica", bg: "nr_officina", w: 20, h: 16, start: [10, 14], outside: ["nr_vicoli", 25, 15],
        act: { M: "Guarda il banco", I: "Guarda il torchio", L: "Guarda i monitor", K: "Usa il terminale", B: "Guarda la brandina", x: "Apri la cassetta", Q: "Guarda l'insegna" },
        flavor: { M: "Un banco da saldatura: chiavi, pinze e un fondoschiena di gamba robotica in attesa di un'idea.", I: "Un torchio idraulico, rinforzato per calibrare sfere metalliche. Un cartello: «Dita non incluse».", L: "Monitor a fosfori verdi: telemetria, impulsi di tiro, e una linea che sale e scende come un cuore ben allenato.", B: "Una brandina: due coperte, un cuscino e un biglietto «Non svegliare Rusty. Né il torchio».", Q: "Un'insegna olografica: «RICAMBI · RIPARAZIONI · RIMPIANTI»." },
        loot: { "2,9": { id: "nr_datapad", text: "Nella cassetta, tra viti e cavi, un datapad con una scritta: «1926».", empty: "La cassetta è vuota. Viti, cavi e ricordi." } },
        objects: { "17,5": () => H.hackMenu("Terminale di calibrazione", [{ id: "cal", label: "Leggere la telemetria di Rusty", sub: "+5 Hacking", once: true, run: () => { K.bond("hackeraggio", 5); say("voce", "Una curva di impulsi: i tiri di Rusty, trent'anni di fisica applicata alla speranza. Ne ricavi qualcosa."); done(); } }]) },
        npcs: () => [{ id: "nr_jax", at: [8, 7] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 19, 15, "i"); lay(0, 0, 19, 1, "a"); lay(0, 0, 0, 15, "a"); lay(19, 0, 19, 15, "a"); lay(0, 15, 19, 15, "a"); put(10, 15, "v");
          lay(2, 1, 5, 1, "L"); lay(12, 1, 17, 1, "L"); lay(3, 4, 6, 4, "M"); lay(13, 4, 15, 4, "M"); put(14, 7, "I"); put(14, 8, "I"); put(15, 7, "I"); put(15, 8, "I"); put(17, 5, "K");
          put(2, 9, "x"); put(2, 12, "B"); put(3, 12, "B"); put(17, 12, "B"); put(18, 12, "Q"); put(16, 10, "V");
        },
        decor(g, cx, cy, d) { H.plaque(g, "OFFICINA DI RUSTY", d.X(10) + 8, d.Y(1) + 4, "#a3e635"); }
      }
    };
    return {
      n: N, title: "I Bassifondi del Livello 01", sub: "La Frequenza Proibita",
      goal, start: "nr_vicoli", introBg: "nr_titolo", zones, talk, obj: {},
      intro: [["voce", "Neo-Rondine, anno 2099. Sotto la pioggia acida, la Vektor Corporation possiede ogni luce, ogni treno e i brevetti neurali dei calciatori."], ["voce", "Il campionato ufficiale è una messinscena per gli azionisti, giocata da automi imbattibili. Ma nei vicoli del Livello 01 resiste un'altra lega: quella dei Circuiti d'Oro."]]
    };
  }
  boot();
})();
