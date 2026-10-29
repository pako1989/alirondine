// js/banda-c1.js - «BANDA DI PIAZZA» · Capitolo 1: La Grancassa
// La banda sta per essere sostituita da un altoparlante. Rocco ti offre la grancassa, il Maestro Ferrante ti mette alla prova in sala (primo brano a tempo),
// Sora Nanà ti sfama e l'assessore Bracco fa sentire alla piazza la sua cassa nuova. Zone: piazza (32x24), sala prove (16x11), trattoria (14x10).
// Espone window.__bandaZ: le stesse zone, riusate dai capitoli successivi con personaggi diversi.
(function () {
  "use strict";
  // ------------------------------------------------------------ zone condivise (piazza, sala prove, trattoria)
  window.__bandaZ = {
    piazza(H, npcs, o) {
      o = o || {};
      return {
        region: "piazza", name: "Piazza della Rondine", short: "Piazza", sub: "Selciato, fontana, cassa armonica e il mare in fondo", bg: "bp_piazza", time: o.time || "tramonto", w: 32, h: 24, base: "Q", start: o.start || [15, 16], travel: [15, 16],
        itemCos: o.itemCos, items: o.items || [],
        areas: [[2, 1, 9, 7, "San Rocco e la sala prove"], [12, 1, 17, 6, "Trattoria Sora Nanà"], [20, 1, 26, 6, "Il Municipio"], [22, 10, 27, 15, "La cassa armonica"], [0, 18, 31, 23, "Il lungomare"], [0, 0, 31, 23, "Piazza della Rondine"]],
        act: { P: "Guarda la cassa armonica", F: "Guarda la fontana", A: "Guarda l'altoparlante", n: "Leggi la bacheca della banda", l: "Guarda il lampione", b: "Siediti sulla panchina", u: "Guarda la bancarella", s: "Siediti un momento", x: "Apri la cassa" },
        flavor: Object.assign({
          P: "La cassa armonica: otto colonnine di ferro, un tetto verde e un pavimento che scricchiola in si bemolle. Qui la banda suona da settant'anni, ogni domenica dopo la messa delle undici.",
          F: "La fontana della piazza. Sul bordo qualcuno ha inciso: «A. R. 1950 · la banda non si ferma». Qualcun altro, sotto: «e il bar?».",
          A: "Una torre di casse nere col marchio SuonoSmart e un led blu che pulsa. Non suona niente. Sembra comunque soddisfatta di sé.",
          n: "La bacheca della banda: «PROVE: martedì e venerdì, ore 19 (meno cinque). CERCASI: grancassa, prima tromba, pazienza». Sotto, un volantino del Comune: «Stadio moderno, audio moderno, futuro moderno».",
          l: "Un lampione di ghisa. Le falene ci ballano intorno a tempo di valzer.", b: "Una panchina verde, consumata dove ci si siede ad ascoltare.", u: "La bancarella del pesce fritto. Il cartoccio costa due euro, il profumo arriva gratis fino alla cassa armonica."
        }, o.flavor || {}),
        doors: o.doors || {},
        npcs: npcs,
        intro: o.intro,
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 31, 0, "a"); lay(0, 21, 31, 23, "w"); lay(0, 19, 31, 20, ":");
          lay(0, 7, 0, 18, "t"); lay(31, 7, 31, 18, "t"); if (o.east) { put(31, 12, "q"); put(31, 13, "q"); }
          house(2, 1, 8, 6, { door: [5, 6], roof: "#7f1d1d", wall: "#e7d7b5", chimney: false, enter: { to: "bp_sala", at: [8, 9] } });
          house(12, 1, 6, 5, { door: [14, 5], roof: "#9a3412", wall: "#fde68a", chimney: true, enter: { to: "bp_trattoria", at: [7, 8] } });
          house(20, 1, 7, 5, { door: [23, 5], roof: "#334155", wall: "#cbd5e1", enter: o.municipio || "Il Municipio. All'ingresso un cartellone: «STADIO DEL FUTURO · rendering». Nel rendering la tribuna è piena di gente che sorride a una cassa audio." });
          house(28, 1, 3, 5, { door: [29, 5], roof: "#57534e", wall: "#d6c3a0", enter: o.ciro || "Una casa stretta con le persiane verdi chiuse. Sulla porta, una targhetta: «C. Esposito». Dall'interno, nessun suono." });
          lay(23, 12, 26, 13, "P");
          lay(14, 11, 15, 12, "F");
          [[6, 9], [11, 15], [19, 9], [21, 17], [8, 18], [28, 9]].forEach(([x, y]) => put(x, y, "l"));
          [[12, 16], [17, 16], [3, 13]].forEach(([x, y]) => put(x, y, "b"));
          [[1, 9], [1, 15], [30, 9], [30, 16]].forEach(([x, y]) => put(x, y, "t"));
          put(4, 17, "u"); put(5, 17, "u"); put(18, 12, "n"); put(9, 14, "s"); put(27, 18, "x");
          if (o.cassa) { put(20, 7, "A"); put(21, 7, "A"); }
          [[4, 19], [16, 19], [26, 19]].forEach(([x, y]) => put(x, y, "l"));
          (o.extra || []).forEach(([x, y, c]) => put(x, y, c));
        },
        decor(g, cx, cy, d) {
          const f = window.__sagaCore.util.frNow(); H.kiosk(g, d, 23, 12, 4, f); H.fountain(g, d, 14, 11, f);
          H.plaque(g, "SAN ROCCO · SALA PROVE", d.X(6) + 8, d.Y(1) - 6, "#fde68a"); H.plaque(g, "TRATTORIA SORA NANÀ", d.X(14) + 8, d.Y(1) - 6, "#fca5a5"); H.plaque(g, "MUNICIPIO", d.X(23) + 8, d.Y(1) - 6, "#cbd5e1"); H.plaque(g, "CASSA ARMONICA", d.X(24) + 16, d.Y(14) + 10, "#86efac");
          if (o.east) H.plaque(g, "IL CORSO ▸", d.X(30) + 8, d.Y(11) - 6, "#93c5fd");
        }
      };
    },
    sala(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "sala", name: "La sala prove", short: "Sala prove", sub: "Sotto la parrocchia di San Rocco: leggii, tamburi e un metronomo", bg: "bp_sala", w: 16, h: 11, start: [8, 9], outside: ["bp_piazza", 5, 7], base: "Y",
        act: { M: "Guarda il leggio", E: "Guarda i tamburi", L: "Guarda gli spartiti", n: "Leggi il registro", l: "Guarda la lampada", T: "Guarda il tavolo", x: "Apri l'armadio" },
        flavor: Object.assign({ M: "Un leggio con la «Marcia d'ingresso». Sul margine, a matita rossa: «TEMPO!», «TEMPO!!», «NON È IL MIO TEMPO».", E: "La grancassa della banda: pelle nuova, cerchio vecchio, una rondine dipinta a mano. Pesa come un difensore centrale.", L: "Scaffali di spartiti in cartelline: «Inni», «Processioni», «Allegre», «Tristi», «Allegre ma tristi».", n: "Il registro delle presenze. Accanto a «C. Esposito, tromba» c'è un trattino lungo tre anni.", l: "Una lampada da tavolo. Il Maestro la sposta sempre di due dita a sinistra, quando entra.", T: "Un tavolo con tazzine di caffè vuote, tutte girate col manico nello stesso verso." }, o.flavor || {}),
        loot: o.loot || {},
        npcs: npcs,
        intro: o.intro,
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 15, 10, "Y"); lay(0, 0, 15, 0, "a"); lay(0, 0, 0, 10, "a"); lay(15, 0, 15, 10, "a"); lay(0, 10, 15, 10, "a"); put(8, 10, "v");
          [[3, 3], [5, 3], [7, 3], [9, 3], [11, 3], [4, 5], [6, 5], [10, 5], [12, 5]].forEach(([x, y]) => put(x, y, "M"));
          put(13, 2, "E"); put(2, 7, "E"); lay(1, 1, 4, 1, "L"); put(14, 7, "n"); put(14, 4, "l"); put(11, 8, "T"); put(1, 4, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SALA PROVE", d.X(8) + 8, d.Y(0) + 6, "#fde68a"); }
      };
    },
    trattoria(H, npcs, o) {
      o = o || {};
      return {
        interior: true, region: "trattoria", name: "Trattoria Sora Nanà", short: "Trattoria", sub: "Ragù, tovaglie a quadretti e la foto della banda del 1972", bg: "bp_trattoria", w: 14, h: 10, start: [7, 8], outside: ["bp_piazza", 14, 6], base: "+",
        act: { K: "Guarda il bancone", T: "Guarda la tavolata", D: "Guarda la credenza", H: "Guarda il camino", W: "Guarda dalla finestra", x: "Apri la madia" },
        flavor: Object.assign({ K: "Il bancone di legno scuro. La pentola del ragù borbotta da sola, come un bombardino in pausa.", T: "La tavolata lunga della domenica: trenta coperti. Nanà apparecchia anche per chi non viene più.", D: "Una credenza con piatti spaiati e una foto: la banda a Venezia, 1972, primo premio. Un bombardino stona perfino in fotografia.", H: "Il camino acceso anche ad aprile. Nanà dice che il ragù sente il freddo.", W: "Dalla finestra si vede la cassa armonica. Le lucine sono accese." }, o.flavor || {}),
        loot: o.loot || {},
        npcs: npcs,
        intro: o.intro,
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 13, 9, "+"); lay(0, 0, 13, 0, "a"); lay(0, 0, 0, 9, "a"); lay(13, 0, 13, 9, "a"); lay(0, 9, 13, 9, "a"); put(7, 9, "v");
          lay(1, 2, 5, 2, "K"); put(11, 1, "H"); put(8, 0, "W"); put(4, 0, "W"); lay(7, 4, 11, 4, "T"); lay(7, 6, 11, 6, "T"); put(1, 6, "D"); put(12, 7, "x");
        },
        decor(g, cx, cy, d) { H.plaque(g, "SORA NANÀ", d.X(7) + 8, d.Y(0) + 6, "#fca5a5"); }
      };
    }
  };

  function boot() {
    const E = window.__bandaCore;
    if (!E || !E.api || !E.api.addChapter || !window.__bandaH || !window.__ritmo) return setTimeout(boot, 100);
    E.api.addChapter(chapter1);
  }
  function chapter1(K) {
    const { setStep, quest, F } = K, H = window.__bandaH(K), Z = window.__bandaZ, { say, done, ask, wask } = H;
    const N = 1, S = () => K.stepOf(N);
    H.people();
    K.cos("bp_c1", { kind: "shirt", label: "Giacca della Banda", val: "#7f1d1d", from: "Capitolo 1 di Banda di Piazza" });
    K.lore("l_rondi", { t: "Il Maestro Anselmo Rondi", d: "Fondò la banda di Borgo Marino nel 1950, con dodici strumenti di seconda mano e un fornaio al bombardino. Scrisse una sola marcia, «La Marcia della Rondine». Morì prima di finirla, o così dicono." });
    K.lore("l_cassa", { t: "La cassa SuonoSmart", d: "Un sistema audio per stadi: inni registrati, cori registrati, applausi registrati. «L'emozione, senza errori.» Costa meno di una banda in cinque anni, giura l'assessore." });
    K.lore("l_ferrante", { t: "Il Maestro Ferrante", d: "Ha diretto orchestre vere, a Milano e a Vienna. Poi qualcosa è andato storto e nessuno sa cosa. A Borgo Marino è arrivato in autobus, con una valigia e una bacchetta d'ebano." });

    const goal = (s) => ({
      0: "In piazza: parla con Rocco, vicino alla cassa armonica.",
      1: "Entra nella sala prove sotto San Rocco (la porta della chiesa) e presentati al Maestro.",
      2: "Vai alla Trattoria Sora Nanà: c'è la cena di benvenuto.",
      3: "Torna in piazza: l'assessore Bracco ha qualcosa da far sentire a tutti.",
      4: "Il capitolo si chiude."
    }[s] || "Il capitolo 1 è concluso.");

    function fin() {
      setStep(N, 4); F.set("bp_c1_done", true);
      const m = K.reward("bp_c1", { coins: 80, cos: "bp_c1" });
      K.finishChapter(N, "ok");
      K.scene(H.flush().concat([
        ["bp_ferrante", "[serio] Martedì, ore diciannove meno cinque. Chi arriva alle diciannove non entra. Chi arriva alle diciannove meno quattro, entra e se ne pente."],
        ["bp_rocco", "[ride] Traduco: benvenuto in banda. Il Maestro è contento. Si vede dalla vena sulla fronte: oggi pulsa in quattro quarti."],
        ["bp_lilli", "Contento lui. Io ho le dita che fumano. Ma la cassa dell'assessore l'abbiamo sentita tutti: se perdiamo, la domenica in piazza ci resta solo il led blu."],
        ["voce", `<b>FINE DEL CAPITOLO 1 · «La Grancassa»</b>${m.length ? "<br>🎁 " + m.join(" · ") : ""}<br>${H.stato()}`],
        ["voce", "Il Capitolo 2 ti aspetta: la processione di San Rocco, la pioggia, e una tromba chiusa in una custodia."]
      ]), () => K.openMain(), "bp_titolo");
    }

    function prova() {
      H.play("ingresso", { title: "Marcia d'ingresso · la prova del Maestro" }, (r) => {
        if (r.win) {
          F.set("bp_prova_ok", true); setStep(N, 2); quest("bp_c1c", "La cena di benvenuto", "Alla Trattoria Sora Nanà, in piazza.");
          say("bp_ferrante", r.a >= 85 ? "[sorpreso] ...Non male. Non è il mio tempo, ma ci passa vicino. Come un autobus che non si ferma." : "[serio] Non è il mio tempo. Ma è un tempo. Si può lavorare su un tempo.");
          say("bp_lilli", "[ride] Ha detto «si può lavorare». È il complimento più grande che abbia mai fatto. A me ha detto «si può smettere».");
          say("bp_abele", "Benvenuto, figliolo. La sala è del Signore, la grancassa è tua. Nanà ci aspetta per cena: le prove finiscono sempre lì.");
          H.join("bp_lilli", "Lilli e Don Abele entrano nella banda che ti segue."); F.set("bp_m_bp_abele", true);
          return done();
        }
        say("bp_ferrante", "[arrabbiato] No. No. NO. Il tempo non è un'opinione, è un contratto. Di nuovo. Dall'inizio.");
        say("bp_rocco", "Respira. Guarda la bacchetta, non i piedi. E non ascoltare la vena sulla sua fronte: va per conto suo."); done();
      });
    }

    const talk = {
      bp_rocco() {
        if (K.rel.scene("bp_rocco")) return;
        const s = S();
        if (s === 0) {
          say("bp_rocco", "[felice] Ehi, campione! Il ginocchio? Fasciato, eh. Due mesi fuori, ho sentito. Allora hai due mesi liberi. E due braccia.");
          say("bp_rocco", "Io sono Rocco, bombardino della banda da quarantadue anni. Ascolta: l'assessore vuole sostituirci allo stadio con una cassa. Una CASSA. Con gli applausi registrati.");
          say("bp_rocco", "Ci serve una grancassa. Quella vecchia si è trasferita a Torino per amore. Tu hai polso, hai tempo, e allo stadio ti conoscono tutti. Vieni alle prove? La sala è sotto San Rocco.");
          K.learnLore("l_cassa"); setStep(N, 1); quest("bp_c1", "La grancassa", "Entra nella sala prove sotto San Rocco e presentati al Maestro.");
          return wask("Rocco ti guarda col bombardino in braccio.", [
            { label: "❤️ «Per la piazza, ci sto.»", w: { cuore: 1 }, fn: () => { say("bp_rocco", "[ride] Lo sapevo! Ti avverto: il Maestro nuovo è... preciso. Molto preciso. Una volta ha fermato le prove perché un piccione tubava fuori tempo."); H.join("bp_rocco", "Rocco si unisce alla banda e ti cammina dietro col bombardino."); done(); } },
            { label: "🎼 «Se lo faccio, lo faccio bene.»", w: { rigore: 1 }, fn: () => { say("bp_rocco", "[sorpreso] Ecco, questa frase al Maestro piacerà. Io la ripeterei con lo stesso tono. Ma un po' più a tempo."); H.join("bp_rocco", "Rocco si unisce alla banda e ti cammina dietro col bombardino."); done(); } },
            { label: "«Una grancassa? Io gioco a calcio.»", fn: () => { say("bp_rocco", "[ride] Anche la grancassa si calcia, in un certo senso. Col braccio. Dai, vieni a vedere."); H.join("bp_rocco", "Rocco si unisce alla banda e ti cammina dietro col bombardino."); done(); } }
          ]);
        }
        say("bp_rocco", s === 1 ? "La sala prove è sotto San Rocco: la porta grande della chiesa, a sinistra. Alle sette meno cinque. Sono le sette meno sei. Corri. Cioè, zoppica veloce." : s === 2 ? "Dalla Nanà! Si mangia, si ride e si parla male del Maestro sottovoce. Molto sottovoce." : s === 3 ? "Hai sentito? Lì davanti al Municipio. Quella cosa nera che fa «tunz». Andiamo a vedere." : "Martedì alle sette meno cinque. Te lo ripeto perché il Maestro me lo ripete ogni cinque minuti.");
        done();
      },
      bp_ferrante() {
        if (K.rel.scene("bp_ferrante")) return;
        const s = S();
        if (s === 1 && !F.is("bp_fer1")) {
          F.set("bp_fer1", true); K.learnLore("l_ferrante");
          say("bp_ferrante", "[serio] Sono le diciannove meno tre. Lei è il calciatore. Quello della grancassa. Si sieda. No, non lì: lì si siede chi non suona.");
          say("bp_ferrante", "Mi chiamo Ferrante. Ho diretto a Vienna, a Milano e in un altro posto di cui non parlo. La banda ha due mesi per dimostrare all'assessore che vale più di una cassa con la presa.");
          say("bp_ferrante", "Io non chiedo talento. Il talento è un incidente. Io chiedo tempo. Il TEMPO.");
          return wask("Il Maestro ti fissa sopra gli occhiali.", [
            { label: "🎼 «Sì, Maestro.»", sub: "Senza un'altra parola", w: { rigore: 2 }, fn: () => { F.set("bp_si_maestro", true); say("bp_ferrante", "[sorpreso] Prima risposta corretta della stagione. Rocco, prenda nota."); say("bp_rocco", "Presa, Maestro. A memoria. Come tutto."); menuProva(); } },
            { label: "❤️ «Piacere. Io sono…»", sub: "Gli porgi la mano", w: { cuore: 2 }, fn: () => { say("bp_ferrante", "[arrabbiato] So chi è. È scritto sul registro. Le mani servono per le bacchette. Questa la tenga in tasca, per ora."); say("bp_lilli", "[ride] Benvenuto. Anche a me l'ha detto. Io gli ho dato la mano lo stesso. È rimasto fermo come una statua."); menuProva(); } },
            { label: "«Ho il ginocchio fasciato.»", fn: () => { say("bp_ferrante", "La grancassa si suona con le braccia. Il ginocchio lo tenga fermo: le farà da metronomo."); menuProva(); } }
          ]);
        }
        if (s === 1) return menuProva();
        say("bp_ferrante", s === 2 ? "La cena dalla signora. Mangi poco: domani le braccia devono essere leggere. Le braccia, non la testa." : s === 3 ? "[serio] Sento una cassa che pretende di suonare. Andiamo a sentire cosa ha da dire." : "Martedì. Diciannove meno cinque."); done();
        function menuProva() {
          ask("La «Marcia d'ingresso» è sul leggio. Il Maestro alza la bacchetta d'ebano.", [
            { label: "🥁 Suona la marcia", sub: "Primo brano a tempo · quota 55%", big: true, cls: "hot", fn: prova },
            { label: "🎒 Prima controlla lo zaino", sub: "Gli oggetti con «tempo» allargano un po' le finestre", fn: () => { say("voce", K.inv.bonus("te") ? "Hai qualcosa che ticchetta nello zaino. Le note ti sembrano un po' più larghe." : "Nello zaino niente che ticchetti. Per ora ci sono solo le tue braccia."); done(); } },
            { label: "◂ Un momento, Maestro", fn: () => { say("bp_ferrante", "Un momento. Uno. Lo cronometro."); done(); } }
          ]);
        }
      },
      bp_lilli() {
        if (K.rel.scene("bp_lilli")) return;
        const s = S();
        if (s <= 1) { say("bp_lilli", "[furbo] Tu sei il calciatore? Bene. Finalmente uno più nuovo di me. Lilli, clarinetto. Se il Maestro ti urla, non è personale. Urla anche al metronomo."); return done(); }
        say("bp_lilli", s === 2 ? "Dalla Nanà c'è il ragù. Il ragù è l'unica cosa che il Maestro non corregge." : s === 3 ? "[arrabbiato] Quella cassa ha un led blu. Un LED. BLU. Io ho una cresta fucsia e non me la tiro così." : "Ci vediamo martedì. Porta le orecchie, il Maestro le controlla."); done();
      },
      bp_abele() {
        if (K.rel.scene("bp_abele")) return;
        say("bp_abele", S() <= 1 ? "Benvenuto nella casa del Signore, o almeno nella sua cantina. Io sono Don Abele, piatti. Quando sbaglio coi piatti sembra apposta: è un dono." : "Il Signore ama la musica, figliolo. Sul ritmo, però, ha lasciato fare a noi."); done();
      },
      bp_nana() {
        if (K.rel.scene("bp_nana")) return;
        const s = S();
        if (s === 2 && K.inZone("bp_trattoria")) {
          say("bp_nana", "[felice] Eccolo, il nuovo! Siediti, siediti. Mangia. Sei magro per una grancassa. La grancassa vuole spalle.");
          say("bp_nana", "Lo sai che mio marito suonava il bombardino? Male, ma con tanto cuore. Il sabato qui c'erano trenta piatti. Ora ne apparecchio venti, e uno resta vuoto.");
          say("bp_nana", "[triste] Quello è di Ciro. Zio Ciro, la prima tromba. Non viene più da quando il mare si è preso Tonino, suo figlio. Tre anni. Apparecchio lo stesso: non si sa mai.");
          say("bp_rocco", "Senza Ciro la processione di San Rocco sarà una passeggiata con la grancassa. Il Maestro lo sa. Non lo dice, ma lo sa.");
          setStep(N, 3); quest("bp_c1d", "La cassa dell'assessore", "Torna in piazza: Bracco fa sentire la sua cassa davanti al Municipio.");
          return wask("Nanà ti versa il vino senza chiedere.", [
            { label: "❤️ «Il posto di Ciro lo lasciamo apparecchiato.»", w: { cuore: 1 }, fn: () => { F.set("bp_posto_ciro", true); K.rel.add("bp_nana", 2); say("bp_nana", "[felice] Bravo. Le cose apparecchiate prima o poi si usano. Come le trombe."); done(); } },
            { label: "🎼 «Ci serve una prima tromba, Ciro o un altro.»", w: { rigore: 1 }, fn: () => { say("bp_nana", "[pensa] Parli come il Maestro. Non è un insulto, eh. È una constatazione con il ragù."); done(); } }
          ]);
        }
        if (s < 2) { say("bp_nana", "Le prove prima, la cena dopo! Ho il ragù sul fuoco da stamattina e un Maestro nuovo che non ha ancora assaggiato niente. Diffido di chi non assaggia."); return done(); }
        say("bp_nana", "Una piazza senza banda è come una cucina senza sale. Si mangia lo stesso. Ma perché?"); done();
      },
      bp_bracco() {
        if (K.rel.scene("bp_bracco")) return;
        const s = S();
        if (s === 3) {
          say("bp_bracco", "Cittadini! Grazie per essere qui! Vi presento SuonoSmart: inni, cori, applausi. Tutto perfetto, tutto a norma, niente prove il martedì.");
          say("bp_gigi", "Un, due, prova. «APPLAUSI». (La cassa applaude da sola. Un bambino applaude con lei, poi si ferma, confuso.)");
          say("bp_bracco", "Con tutto il rispetto per la banda, che è un patrimonio, eh, un bellissimo patrimonio... lo stadio nuovo vuole un suono nuovo. A fine stagione si decide.");
          say("bp_ferrante", "[serio] Assessore. Una cassa non sbaglia mai. È per questo che nessuno la ricorda.");
          return wask("L'assessore si gira verso di te: «Lei è il calciatore, no? Lei cosa ne pensa?»", [
            { label: "❤️ «La banda è la piazza. Non si spegne con un tasto.»", big: true, w: { cuore: 2 }, fn: () => { F.set("bp_c1_cuore", true); say("bp_bracco", "[sorpreso] Bella frase. La metto nel comunicato. Però la decisione resta: se la banda vuole lo stadio, se lo guadagni."); say("bp_nana", "BRAVO! (Da lontano, col mestolo alzato.)"); fin(); } },
            { label: "🎼 «Ci dia una data. Suoneremo meglio della cassa.»", big: true, w: { rigore: 2 }, fn: () => { F.set("bp_c1_rigore", true); say("bp_bracco", "[furbo] Mi piace, una sfida! Il derby col Montenero, allo stadio. La banda contro SuonoSmart. Decide il pubblico."); say("bp_ferrante", "[pensa] Accettato. E adesso, tutti a casa. Domani si comincia dal tempo."); fin(); } }
          ]);
        }
        say("bp_bracco", "L'assessore è molto impegnato, ma per i cittadini c'è sempre. (Ti stringe la mano senza guardarti.)"); done();
      },
      bp_gigi() {
        if (K.rel.scene("bp_gigi")) return;
        say("bp_gigi", S() >= 3 ? "Gigi, SuonoSmart. Tranquillo, è solo lavoro. Io installo, loro decidono. Da ragazzo suonavo il triangolo, sai? Poi mi hanno detto che era uno strumento minore." : "Sto montando la cassa. Non toccare il led blu: è più delicato di quanto sembri."); done();
      }
    };

    const zones = {
      bp_piazza: Z.piazza(H, (s) => {
        const L = [{ id: "bp_rocco", at: s === 0 ? [22, 16] : [20, 13] }];
        if (s <= 2) L.push({ id: "bp_nana", at: [15, 7] });
        if (s >= 3) L.push({ id: "bp_bracco", at: [22, 8] }, { id: "bp_gigi", at: [19, 7] }, { id: "bp_ferrante", at: [17, 9] }, { id: "bp_lilli", at: [13, 9] });
        else L.push({ id: "bp_bracco", at: [24, 7], route: [[24, 7], [26, 8], [26, 9], [24, 9]], speed: 0.3, pause: 80 });
        return L;
      }, {
        itemCos: "bp_c1", items: [[3, 9], [28, 15], [10, 12], [20, 18]], cassa: true,
        intro: [["voce", "Borgo Marino, tramonto di aprile. La piazza della Rondine profuma di pesce fritto e di mare. Le lucine della cassa armonica si accendono una alla volta."], ["voce", "Il ginocchio fasciato ti costa due mesi lontano dal campo. Vicino alla cassa armonica, un signore col bombardino ti fa segno di avvicinarti."]]
      }),
      bp_sala: Z.sala(H, (s) => [{ id: "bp_ferrante", at: [8, 2] }, { id: "bp_lilli", at: [4, 7] }, { id: "bp_abele", at: [12, 7] }].concat(s >= 1 ? [{ id: "bp_rocco", at: [6, 8] }] : []), {
        loot: { "1,4": { id: "bp_metronomo", text: "Nell'armadio, dietro le cartelline delle marce tristi: un metronomo a piramide. Sulla targhetta: «A. Rondi, 1950». Ticchetta ancora.", empty: "L'armadio è in ordine, troppo in ordine. Qui è passato il Maestro." } },
        intro: [["voce", "La sala prove: leggii in fila, una grancassa con la rondine dipinta, un metronomo che batte da solo. Sotto i piedi, il parquet scricchiola in si bemolle."]]
      }),
      bp_trattoria: Z.trattoria(H, (s) => [{ id: "bp_nana", at: [3, 3] }].concat(s >= 2 ? [{ id: "bp_rocco", at: [8, 5] }, { id: "bp_abele", at: [10, 5] }, { id: "bp_lilli", at: [9, 7] }] : []), {
        loot: { "12,7": { id: "bp_cartolina", text: "Nella madia, sotto le tovaglie della domenica: una cartolina di Venezia. «Primo premio! La Rondine vola. — A. R., 1972».", empty: "Solo tovaglie a quadretti, stirate con cura." } }
      })
    };
    return {
      n: N, title: "La Grancassa", sub: "Un ginocchio fasciato, un bombardino e un Maestro che conta i secondi",
      goal, start: "bp_piazza", introBg: "bp_titolo", zones, talk, obj: {},
      intro: [["voce", "Borgo Marino. Da settant'anni, ogni domenica, la banda suona in piazza e allo stadio. Quest'anno il Comune vuole un altoparlante."], ["voce", "Tu hai un ginocchio fasciato, due mesi lontano dal campo e nessuna idea di cosa sia una grancassa. Per ora."]]
    };
  }
  boot();
})();
