// js/gala-c1.js - «IL RAPIMENTO DEL PALLONE D'ORO» · Capitolo 1: La Cena
// Arrivo alla Villa Delmonte sotto la tempesta, giardino grande con fontana e labirinto di siepi, salone da ballo, sala da pranzo, cucina. La cena, il blackout, il Pallone sparito.
(function () {
  "use strict";
  function boot() {
    const E = window.__galaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__galaH || !window.__pingpong) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__galaH(K), { say, done, ask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("pd_c1", { kind: "shirt", label: "Smoking da gala", val: "#1e293b", from: "Capitolo 1 di Il Rapimento del Pallone d'Oro" });
    K.lore("l_villa", { t: "Villa Delmonte", d: "Ottanta stanze, un giardino con labirinto e un unico ponte sul fiume. La squadra del Presidente ha vinto qui tre scudetti e perso due matrimoni." });
    K.lore("l_pallone", { t: "Il Pallone d'Oro", d: "Il trofeo più prezioso del campionato: oro vero, cuciture d'epoca, e un'assicurazione che costa quanto un attaccante." });
    K.lore("l_registro", { t: "Il Registro delle Presenze", d: "Una griglia di chi era dove e quando. Quello che vedi di persona, e quello che ti raccontano, finisce lì: dove non coincide, qualcuno mente." });
    const SEAT = "pd_c1_seat";
    const met = () => ["pd_livia", "pd_zeno", "pd_teresa", "pd_arturo", "pd_clio", "pd_gualtiero", "pd_ospite"].filter((i) => F.is("pd_met_" + i)).length;

    const goal = (s) => ({
      0: "Parla con il Presidente Delmonte, davanti alla villa.",
      1: "Sala da pranzo: conosci gli invitati. Parlane con almeno quattro (" + met() + ").",
      2: "Arturo ha suonato il gong: siediti al tavolo, in fondo alla sala da pranzo.",
      3: "Dopo il blackout: il Presidente ti vuole nel salone. Parla con lui.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      F.set("pd_c1_done", true);
      K.reward("pd_c1", { coins: 80, cos: "pd_c1" });
      K.finishChapter(N, "ok");
      K.clock.set(K.clock.day(), 2);
      K.scene(H.flush().concat([["voce", `<b>FINE DEL CAPITOLO 1.</b><br>🔎 Intuito ${K.stat("intuito")} · 🎩 Garbo ${K.stat("garbo")}`], ["voce", "Il Capitolo 2, «La Notte lunga», ti aspetta. L'orologio segna Mezzanotte."]]), () => K.openMain(), "pd_salone");
    }
    function dinner() {
      K.clock.set(K.clock.day(), 0);
      say("voce", "Ti siedi al posto d'onore, a metà tavola. Il Presidente fa tintinnare il bicchiere; nel silenzio che segue si sente solo Arturo che respira.");
      say("pd_delmonte", "[felice] Amici, brindo al Pallone d'Oro! Dodici anni nella mia vetrina, e nemmeno una macchia. Come me, del resto.");
      say("voce", "Tutti guardano la vetrina dietro di lui: dentro, tra i riflessi dei lampadari, il Pallone brilla come una moneta messa lì apposta per ricordarti quanto vali.");
      ask("A tavola, con chi scambi due parole mentre arrivano gli antipasti?", [
        { label: "🥂 Livia, accanto a te", sub: "+Rapporto con Livia, +Garbo", fn: () => { K.rel.add("pd_livia", 6, true); K.bond("garbo", 4); say("pd_livia", "[serio] Il Presidente adora questo pallone più di quanto adori me. Non è una lamentela: è un'osservazione contabile."); blackout(); } },
        { label: "🎤 Zeno, dall'altra parte", sub: "+Rapporto con Zeno, +Intuito", fn: () => { K.rel.add("pd_zeno", 6, true); K.bond("intuito", 3); say("pd_zeno", "[ride] Il Pallone d'Oro? L'ho vinto io, ma lo tiene lui. Capisci il paradosso: io faccio i gol e lui li incassa."); blackout(); } },
        { label: "📓 Clio, la giornalista", sub: "+Rapporto con Clio, +Intuito", fn: () => { K.rel.add("pd_clio", 6, true); K.bond("intuito", 4); say("pd_clio", "[pensa] Stasera mi hanno dato il posto accanto al camino. In cucina dicono che è dove mettono quelli che non devono sentire."); blackout(); } }
      ]);
    }
    function blackout() {
      K.clock.set(K.clock.day(), 1);
      say("voce", "Poi, senza preavviso, le luci si spengono. Tutte, insieme. Qualcuno ride, un bicchiere cade, una sedia stride, e nel buio passa un'aria che sa di cantina.");
      say("voce", "Passano pochi secondi, forse dieci. Poi la luce torna a tremare, e la vetrina dietro il Presidente è vuota. Aperta. Il Pallone d'Oro è sparito.");
      say("pd_delmonte", "[arrabbiato] Il Pallone! Il MIO Pallone! Nessuno esce da questa sala!");
      say("pd_gualtiero", "[serio] Presidente... non uscirebbe nessuno comunque. Il ponte sul fiume è crollato. Ho visto la campata cedere dal giardino, mezz'ora fa: la tempesta se l'è portato via.");
      say("voce", "Una villa isolata, otto sospettati, un trofeo sparito e un fiume che non perdona. Il giallo perfetto, se non fosse tutto vero.");
      setStep(N, 3); quest("pd_c1", "Il Rapimento del Pallone d'Oro", "Il Presidente ti vuole nel salone. Poi comincia la notte.");
      done();
    }
    function approach() {
      say("pd_delmonte", "[serio] Ospite d'onore o no, qui lei è l'unica persona che non ha niente da guadagnare dal furto. L'assicurazione mi risarcirà, certo, ma il Pallone no.");
      say("pd_delmonte", "Voglio la verità prima di avvertire la polizia, quando il ponte sarà riparato. Domande, stanze, chiavi: ha carta bianca. Mi porti il colpevole entro l'alba.");
      say("voce", "Ottieni una nuova funzione: il <b>Registro delle Presenze</b>. Ogni volta che entri in una stanza, annota chi c'è. Quando qualcuno dichiara un alibi, lo scrive. Dove non coincidono, qualcuno mente. Lo trovi nel menù, accanto al Taccuino.");
      K.learnLore("l_registro"); setStep(N, 4); fin();
    }

    const guest = {
      pd_livia: ["[serio] Livia Delmonte. Mio marito ha detto che lei è un campione. Gli campioni, a casa nostra, sono come le candele: durano quanto la cena.", "Non faccia caso alla mia malinconia. È il mio modo di partecipare."],
      pd_zeno: ["[ride] Zeno Bassi, quello del Pallone d'Oro. Sì, quello vero. Ti piace il ping-pong? In questa villa si gioca meglio che a calcio, e non si rischia il ginocchio.", "La sala giochi è al piano di sopra. Passa quando vuoi: ti batterò con eleganza."],
      pd_teresa: ["[serio] Teresa, la cuoca. Se ha fame, la cucina è di là. Se ha dubbi, la cucina è di là. Se ha un segreto, la cucina è comunque di là.", "Mangi la zuppa: il Presidente dice che fa bene al morale. Il mio, almeno."],
      pd_arturo: ["[serio] Arturo, maggiordomo di casa. Venticinque anni al servizio dei Delmonte. Mai una parola fuori posto, mai un bicchiere sbagliato.", "Se desidera qualcosa, sospiri. Il resto lo capisco io."],
      pd_clio: ["[ride] Clio, cronista sportiva. Faccio domande per mestiere e per vizio. La più bella: come fa una villa a restare in piedi con un'intera squadra dentro?", "Mi hanno invitata per un'intervista. Sospetto che l'intervista sia lei."],
      pd_gualtiero: ["[arrabbiato] Gualtiero. Socio del Presidente, prima che lui decidesse che i soci sono un lusso. Mi invita ogni anno per ricordarmi cosa ho perso.", "Non guardi la torta: l'ho scelta io. È l'ultima cosa che mi ha lasciato."],
      pd_ospite: ["[serio] Salve. Il mio nome non è importante. Sono un ospite, come lei. Mi sono permesso di entrare dal giardino.", "Il biglietto d'invito? Mi hanno detto che bastava la cortesia. Mi sono sbagliato, ma nessuno se n'è accorto."]
    };
    const talk = {};
    Object.keys(guest).forEach((id) => {
      talk[id] = () => {
        if (K.rel.scene(id)) return;
        const s = S();
        if (s < 1) { say(id, "[serio] Più tardi, ospite. Il gong è vicino."); return done(); }
        if (!F.is("pd_met_" + id)) {
          F.set("pd_met_" + id, true); K.rel.add(id, 3, true); guest[id].forEach((t) => say(id, t));
          if (S() === 1 && met() >= 4) { say("pd_arturo", "[serio] Signore e signori: la cena è servita. Prego, i signori ospiti prendano posto."); setStep(N, 2); quest("pd_c1b", "La cena", "Siediti al tavolo, in fondo alla sala da pranzo."); }
          return done();
        }
        say(id, id === "pd_arturo" ? "[serio] Il gong non aspetta, signore." : "[serio] Ne parliamo dopo: la zuppa si fredda e la gente si scalda.");
        done();
      };
    });
    talk.pd_delmonte = () => {
      if (K.rel.scene("pd_delmonte")) return;
      const s = S();
      if (s === 0) {
        say("pd_delmonte", "[felice] Ecco il nostro ospite d'onore! Benvenuto alla Villa Delmonte: ottanta stanze, un giardino senza fine e un ponte che regge, dicono, ancora per qualche ora.");
        say("pd_delmonte", "Stasera cena di gala. Alle dieci il brindisi al Pallone d'Oro, che tengo in sala da pranzo, sotto vetro, come una reliquia. Vada, vada: mi aspetti di là.");
        K.learnLore("l_villa"); K.learnLore("l_pallone"); setStep(N, 1); quest("pd_c1a", "Cena alla Villa Delmonte", "Sala da pranzo: conosci gli invitati.");
        return done();
      }
      if (s === 3) return approach();
      say("pd_delmonte", s === 1 ? "[felice] Ci vediamo a tavola, caro. Faccia amicizia, ma non troppa: i miei ospiti sono come i cani, annusano e poi mordono." : "[serio] Aspetti il gong, caro."); done();
    };

    const zones = {
      pd_giardino: {
        region: "giardino", name: "Villa Delmonte · Il Giardino", short: "Giardino", sub: "Sotto la tempesta, tra siepi, fontana e un ponte che non c'è più", bg: "pd_giardino", time: "notte", w: 36, h: 24, base: ",", start: [17, 20],
        itemCos: "pd_c1", items: [[11, 9], [32, 14], [29, 19], [4, 18]],
        areas: [[8, 0, 27, 5, "La villa"], [2, 7, 13, 20, "Il labirinto di siepi"], [26, 14, 33, 20, "Il gazebo"], [14, 10, 21, 15, "La fontana"], [0, 0, 35, 23, "Il giardino della villa"]],
        act: { F: "Guarda la fontana", O: "Guarda la statua", U: "Guarda la panca", A: "Guarda la pianta", n: "Leggi il cartello", s: "Siediti un momento" },
        flavor: { n: "Un cartello sul bordo: «PONTE FUORI USO. NON ATTRAVERSARE». Qualcuno ha aggiunto, a pennarello: «come se fosse possibile».", P: "La villa: crema e rosso, finestre accese, ombre che si muovono dietro le tende.", S: "Siepi potate con precisione maniacale: qualcuno si occupa dei dettagli, in questa casa.", O: "Una statua di marmo: un atleta con un pallone. Ha la testa leggermente inclinata, come se ascoltasse.", A: "Una pianta in vaso, completamente indifferente al dramma." },
        objects: {
          "17,12": () => { say("voce", "La fontana getta acqua in mezzo alla tempesta, come se non avesse capito. Sotto il bordo, una moneta d'oro e un biglietto bagnato: «Pensa a qualcosa di grande»."); done(); },
          "18,21": () => { say("voce", "Al limite del giardino, il fiume ruggisce. Il ponte, o quello che ne resta, è un arco spezzato nel buio: due piloni che si fissano senza parlarsi."); done(); }
        },
        doors: {
          "17,5": { to: "pd_salone", at: [12, 14] }, "18,5": { to: "pd_salone", at: [12, 14] },
          "4,5": { to: "pd_serra", at: [9, 10], locked: (K2) => (K2.mem().done || {})[1] ? false : "La serra è chiusa a chiave per la serata: «Piante sensibili». Se ne riparla dopo la cena." },
          "31,5": { to: "pd_cucina", at: [8, 10] },
          "33,10": { to: "pd_cantina", at: [10, 10], locked: (K2) => K2.inv.has("pd_chiave") ? false : "La botola della cantina è chiusa con un lucchetto di ferro. Serve una chiave." }
        },
        npcs: (s) => [].concat(s === 0 ? [{ id: "pd_delmonte", at: [17, 7], face: "down" }] : [], H.crowd("pd_giardino")),
        spots: [[16, 8], [20, 9], [28, 17], [6, 14]],
        intro: [["voce", "Villa Delmonte, fine ottobre. La carrozza ti lascia al limite del giardino: dietro di te il fiume rugge, davanti la villa brilla come una lanterna in un temporale."], ["voce", "Cena di gala, invitati selezionati, un Pallone d'Oro sotto vetro. Che cosa potrebbe mai andare storto?"]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 23, ","); lay(8, 0, 27, 5, "P"); lay(1, 1, 6, 5, "P"); lay(28, 1, 34, 5, "P"); put(17, 5, "q"); put(18, 5, "q"); put(4, 5, "q"); put(31, 5, "q");
          lay(16, 6, 19, 22, "g"); lay(2, 12, 33, 13, "g"); lay(14, 10, 21, 15, "g"); put(17, 12, "F");
          // labirinto di siepi (ovest)
          lay(2, 7, 13, 7, "S"); lay(2, 7, 2, 20, "S"); lay(2, 20, 13, 20, "S"); lay(13, 7, 13, 11, "S"); lay(13, 15, 13, 20, "S");
          lay(5, 10, 5, 17, "S"); lay(8, 8, 8, 14, "S"); lay(8, 17, 11, 17, "S"); lay(5, 10, 8, 10, "S"); lay(10, 12, 10, 15, "S"); put(11, 9, ","); put(7, 18, "O"); put(11, 14, "A");
          // gazebo (est)
          lay(26, 15, 33, 20, "t"); lay(26, 15, 33, 15, "S"); lay(26, 20, 33, 20, "S"); lay(26, 15, 26, 20, "S"); lay(33, 15, 33, 20, "S"); put(26, 17, "t"); put(26, 18, "t"); lay(28, 17, 31, 18, "t"); put(28, 17, "U"); put(31, 18, "U");
          lay(29, 19, 29, 19, "t"); put(33, 10, "q"); put(24, 8, "A"); put(21, 8, "A"); put(27, 8, "A");
          // il ponte crollato (sud)
          lay(0, 21, 35, 23, "S"); lay(15, 21, 20, 23, "g"); put(18, 21, "n"); put(2, 10, "S");
          [[22, 7], [12, 7], [30, 12], [6, 13], [24, 18]].forEach(([x, y]) => put(x, y, ","));
        },
        decor(g, cx, cy, d) { H.plaque(g, "VILLA DELMONTE", d.X(17) + 16, d.Y(5) - 8, "#facc15"); H.plaque(g, "CUCINA", d.X(31) + 8, d.Y(5) - 6, "#e5e7eb"); H.plaque(g, "SERRA", d.X(4) + 8, d.Y(5) - 6, "#86efac"); H.plaque(g, "CANTINA", d.X(33) + 8, d.Y(10) - 8, "#fb923c"); H.plaque(g, "PONTE FUORI USO", d.X(18) + 8, d.Y(21) - 6, "#f87171"); }
      },
      pd_salone: {
        interior: true, region: "salone", name: "Villa Delmonte · Il Salone da Ballo", short: "Salone", sub: "Scacchi di marmo, un pianoforte e tre lampadari di cristallo", bg: "pd_salone", w: 24, h: 16, start: [12, 14], outside: ["pd_giardino", 17, 6],
        act: { W: "Guarda il quadro", G: "Guarda il pianoforte", U: "Guarda il divano", O: "Guarda la statua", H: "Guarda il camino", A: "Guarda la pianta", D: "Guarda la credenza", s: "Siediti un momento" },
        flavor: { W: "Una finestra con la tenda tirata: fuori, il temporale sembra un pubblico spazientito.", G: "Un pianoforte a coda, nero e lucido. Lo spartito sul leggio è in bianco: qualcuno ha dimenticato di scriverlo, o di cancellarlo.", U: "Un divano di velluto rosso: i cuscini conservano la forma di chi li ha stretti.", O: "Una statua di marmo: un discobolo che non lancia più niente.", H: "Un camino con la legna spenta: il fuoco, stasera, si accende a parole.", A: "Una pianta in un angolo: ha visto tutto e non ha detto niente.", D: "Una credenza con piatti d'argento. Un cassetto è socchiuso: dentro, solo un tovagliolo e un anello senza pietra." },
        objects: {
          "12,2": () => { say("voce", "Il lampadario centrale tintinna piano nel vento. Cento gocce di cristallo e una candela vera, nascosta tra le elettriche: indovina qual è."); done(); }
        },
        doors: { "23,8": { to: "pd_pranzo", at: [1, 6] }, "0,8": { to: "pd_biblioteca", at: [16, 7] }, "8,1": { to: "pd_studio", at: [8, 9] }, "16,1": { to: "pd_boudoir", at: [7, 8] }, "0,12": { to: "pd_pingpong", at: [14, 8] } },
        npcs: (st) => (S() === 3 ? [{ id: "pd_delmonte", at: [12, 8], face: "down" }] : []).concat(H.crowd("pd_salone")),
        spots: [[6, 6], [10, 5], [14, 5], [18, 6], [6, 11], [10, 12], [14, 12], [18, 11]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 23, 15, "l"); lay(5, 4, 18, 12, "s"); lay(0, 0, 23, 1, "a"); lay(0, 0, 0, 15, "a"); lay(23, 0, 23, 15, "a"); lay(0, 15, 23, 15, "a"); put(12, 15, "v");
          [3, 6, 10, 14, 18, 21].forEach((x) => put(x, 1, "W")); put(8, 1, "q"); put(16, 1, "q"); put(0, 8, "q"); put(23, 8, "q"); put(0, 12, "q");
          put(3, 3, "G"); put(4, 3, "G"); put(3, 14, "U"); put(4, 14, "U"); put(20, 14, "U"); put(21, 14, "U"); put(20, 3, "O"); put(2, 6, "A"); put(21, 6, "A"); put(1, 3, "H"); put(22, 3, "D");
          put(11, 9, "s"); put(12, 9, "s");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALONE DA BALLO", d.X(12) + 8, d.Y(1) + 4, "#facc15"); H.plaque(g, "◂ BIBLIOTECA", d.X(0) + 24, d.Y(8) - 8, "#a78bfa"); H.plaque(g, "SALA DA PRANZO ▸", d.X(23) - 16, d.Y(8) - 8, "#f87171"); H.plaque(g, "◂ GIOCHI", d.X(0) + 16, d.Y(12) - 8, "#4ade80"); H.plaque(g, "STUDIO", d.X(8) + 8, d.Y(1) + 6, "#fbbf24"); H.plaque(g, "CAMERA", d.X(16) + 8, d.Y(1) + 6, "#f9a8d4"); }
      },
      pd_pranzo: {
        interior: true, region: "pranzo", name: "Villa Delmonte · La Sala da Pranzo", short: "Sala da pranzo", sub: "Una tavola per dodici, otto invitati e la vetrina del Pallone d'Oro", bg: "pd_pranzo", w: 22, h: 12, start: [2, 6], outside: ["pd_salone", 22, 8],
        act: { X: "Siediti al tuo posto", D: "Guarda la vetrina", H: "Guarda il camino", W: "Guarda il ritratto", O: "Guarda la statua", s: "Siediti un momento" },
        flavor: { W: "Un ritratto di presidente: sguardo fiero, baffi in ordine. Il pittore ha dimenticato di dipingere l'espressione di chi ha firmato il contratto.", O: "Una statua d'angolo: una dama di marmo con un vassoio vuoto in mano.", H: "Il camino scoppietta: brace vera, sedie finte, bugie perfette.", T: "Una tavola apparecchiata per dodici: otto piatti sporchi, quattro intonsi. Un posto vuoto conserva il tovagliolo piegato a cigno." },
        loot: { "10,1": { id: "pd_gettone", text: "Dietro la vetrina vuota, un gettone d'oro caduto dal piedistallo: l'invito a una partita nella sala giochi.", empty: "La vetrina è vuota. Sul piedistallo, un cerchio di polvere in cui stava il Pallone." } },
        objects: {
          "17,5": () => {
            if (S() === 2) return dinner();
            say("voce", S() < 2 ? "La tavola non è pronta: Arturo sta ancora girando con la caraffa." : "Il tuo posto, tiepido. L'unico che non si è mai alzato, dopo il blackout."); done();
          },
          "11,1": () => {
            say("voce", F.is("pd_vetrina") ? "La vetrina del Pallone, aperta. Nessun vetro rotto: o aveva la chiave chi l'ha presa, o qualcuno l'aveva lasciata aperta." : "La vetrina del Pallone d'Oro: vetro antiproiettile, chiusura a combinazione, e dentro un cuscino di velluto che aspetta con pazienza. Il Pallone brilla, anche da qui.");
            if (K.mem().done && (K.mem().done[1] || S() >= 3)) F.set("pd_vetrina", true); done();
          }
        },
        doors: { "0,6": { to: "pd_salone", at: [22, 8] }, "21,3": { to: "pd_cucina", at: [1, 6] } },
        npcs: () => H.crowd("pd_pranzo"),
        spots: [[5, 4], [8, 4], [11, 4], [14, 4], [5, 6], [8, 6], [11, 6], [14, 6]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 21, 11, "l"); lay(2, 3, 19, 8, "t"); lay(0, 0, 21, 1, "a"); lay(0, 0, 0, 11, "a"); lay(21, 0, 21, 11, "a"); lay(0, 11, 21, 11, "a");
          [3, 7, 14, 18].forEach((x) => put(x, 1, "W")); put(0, 6, "q"); put(21, 3, "q"); lay(4, 5, 17, 5, "T"); lay(10, 1, 12, 1, "D"); put(17, 5, "X");
          put(1, 3, "H"); put(1, 9, "O"); put(20, 9, "O"); put(2, 10, "s");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA DA PRANZO", d.X(11) + 8, d.Y(1) + 4, "#fb923c"); H.plaque(g, "IL PALLONE D'ORO", d.X(11) + 8, d.Y(1) + 22, "#facc15"); H.plaque(g, "CUCINA ▸", d.X(21) - 12, d.Y(3) - 8, "#e5e7eb"); }
      },
      pd_cucina: {
        interior: true, region: "cucina", name: "Villa Delmonte · La Cucina", short: "Cucina", sub: "Fornelli accesi, pentole che borbottano e una cuoca che sa tutto", bg: "pd_pranzo", w: 16, h: 12, start: [8, 10], outside: ["pd_giardino", 31, 6],
        act: { K: "Guarda i fornelli", D: "Guarda il banco", T: "Guarda il tavolo", R: "Guarda le botti", s: "Siediti un momento" },
        flavor: { K: "Fornelli accesi: pentole che borbottano, vapore che sa di burro e di segreti. Una pentola bolle senza coperchio, come se avesse qualcosa da dire.", D: "Un banco di lavoro in legno: coltelli allineati, una crema che attende, un tagliere con tracce di rosmarino.", T: "Un tavolino per il personale: tre sedie, un piatto vuoto, una tazza di caffè freddo.", W: "Una finestra che dà sul giardino: da qui si vede la botola della cantina, e a volte si vede chi ci scende.", R: "Botti di vino ammassate vicino alla porta della cantina." },
        doors: { "15,5": { to: "pd_pranzo", at: [20, 3] }, "14,1": { to: "pd_cantina", at: [10, 10], locked: (K2) => K2.inv.has("pd_chiave") ? false : "La porta della cantina è chiusa a chiave." } },
        npcs: () => H.crowd("pd_cucina"),
        spots: [[4, 5], [10, 6], [12, 8]],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 11, "c"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v"); put(15, 5, "q"); put(14, 1, "q");
          lay(2, 2, 6, 2, "K"); lay(9, 4, 12, 4, "D"); put(5, 8, "T"); put(6, 8, "T"); put(13, 9, "T"); put(3, 1, "W"); put(10, 1, "W"); put(1, 6, "R"); put(1, 7, "R"); put(1, 8, "R");
        },
        decor(g, cx, cy, d) { H.plaque(g, "CUCINA", d.X(8) + 8, d.Y(1) + 4, "#e5e7eb"); }
      }
    };
    return {
      n: N, title: "La Cena", sub: "Il Brindisi e il Blackout",
      goal, start: "pd_giardino", introBg: "pd_titolo", zones, talk, obj: {},
      intro: [["voce", "Fine ottobre. Sei stato invitato alla Villa Delmonte, per il gala annuale della squadra: cena di gala, brindisi al Pallone d'Oro, musica dal vivo. Il tipo di serata in cui tutto fila liscio per la prima ora."], ["voce", "Poi, come in ogni giallo che si rispetti, la luce sbaglia momento."]]
    };
  }
  boot();
})();
