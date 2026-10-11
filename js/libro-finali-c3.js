// js/libro-finali-c3.js - IL LIBRO CHE MANGIAVA I FINALI · Capitolo 3 «Il Fumetto Sbagliato» (fumetto)
// Il libro salta di genere: una città a fumetti dove la Banda dei Balloon ruba le nuvolette ai cittadini, che restano muti.
// In tipografia, Mastro Rilegatore custodisce una prova. Sui tetti il Narratore si mostra: è lui che mangia i finali.
// Parole: DOPPIO, ANCORA, LARGA (tipografia), PENNA (dal Rilegatore), SOLE (tetti). Lettera dell'Autrice n. 3 nel magazzino buio.
// Partite: contro la Banda dei Balloon (a scelta: 3v3, 2D HD o Gabbia) e LA PARTITA SCRITTA contro il Narratore (forzata, modalità originale).
(function () {
  "use strict";
  function boot() {
    const LF = window.__libroFinali;
    if (!LF || !LF.addChapter || !LF._has || !LF._has(2)) return setTimeout(boot, 120);
    LF.addChapter(chapter3);
  }
  function chapter3(X) {
    const { T, F, say, ask, narr, done, go, note, setStep, learn, knows, cheat, finishChapter } = X;
    const N = 3, S = () => X.stepOf(N);
    const marg = () => X.mem().marg.length;

    // ---------------------------------------------------------------- personaggi
    X.cast("lb_didascalia", { name: "Didascalia", tag: "", hair: "#111111", style: "codino", skin: "#c68642", eye: "#111111", glasses: true, bg: ["#ffd95a", "#111111"], shirt: "#ffd95a" },
      "La didascalia gialla della Città delle Vignette, in carne e retino. Fa la cronista: racconta quello che succede tra una vignetta e l'altra. Parla sempre come se fosse scritta in un riquadro.");
    X.cast("lb_balloon", { name: "Capitan Balloon", tag: "", hair: "#e63946", style: "cresta", skin: "#f2c9a0", eye: "#111111", shades: true, bg: ["#3fa7ff", "#e63946"], shirt: "#3fa7ff" },
      "Capo della Banda dei Balloon. Ruba le nuvolette ai cittadini e le tiene legate a un filo, come palloncini. Ha un vocione enorme perché parla con le parole degli altri.");
    X.cast("lb_strillo", { name: "Strillo", tag: "", hair: "#7ed957", style: "spiky", skin: "#e0ac7e", eye: "#111111", bg: ["#3fa7ff", "#7ed957"], shirt: "#3fa7ff" },
      "Il più piccolo della Banda dei Balloon. Si è tenuto un balloon tutto per sé con scritto «AAAH!» e lo usa per ogni occasione.");
    X.cast("lb_muto", { name: "Signor Riquadro", tag: "", hair: "#2b1d14", style: "bald", skin: "#8d5524", eye: "#111111", bg: ["#7ed957", "#111111"], shirt: "#7ed957" },
      "Un cittadino della Città delle Vignette. La Banda gli ha rubato tutti i balloon: adesso parla a gesti, e i gesti, in un fumetto, si disegnano con le righine.");
    X.cast("lb_rilegatore", { name: "Mastro Rilegatore", tag: "", hair: "#e6e0d0", style: "bald", skin: "#b9804f", eye: "#2b2d42", beard: true, glasses: true, bg: ["#5d6d7e", "#ffd95a"], shirt: "#5d6d7e" },
      "Il tipografo e rilegatore del libro. Ha cucito ogni pagina con lo spago cerato. Da trentanove anni tiene in tasca un ordine firmato di cui si vergogna.");
    X.cos("lb_c3", { kind: "shirt", label: "Maglia Fumetto", val: "#ffd95a", from: "Completa il Capitolo 3 del Libro che Mangiava i Finali" });
    X.cos("lb_retino", { kind: "hairc", label: "Capelli Retino Blu", val: "#3fa7ff", from: "Raccogli tutte le gocce d'inchiostro nella Città delle Vignette" });
    X.cos("lb_tipo", { kind: "shirt", label: "Maglia Tipografo", val: "#5d6d7e", from: "Raccogli tutte le gocce d'inchiostro in Tipografia" });
    X.cos("lb_tramonto", { kind: "hairc", label: "Capelli Tramonto a Fumetto", val: "#ff9f43", from: "Raccogli tutte le gocce d'inchiostro sui Tetti delle Nuvolette" });

    const goal = (s) => ({
      0: "Parla con Virgola, sul marciapiede in basso a destra dell'incrocio.",
      1: "Trova Didascalia, la cronista gialla, a sinistra dell'incrocio.",
      2: "Affronta Capitan Balloon nella piazza a est.",
      3: "Decidi il finale della Banda dei Balloon con Capitan Balloon.",
      4: "Vai in Tipografia (in cima al viale che sale a nord) e parla con Mastro Rilegatore.",
      5: "Sali sui Tetti delle Nuvolette (scala in alto in Tipografia) e affronta il Narratore. Prima, se vuoi, cerca le parole della Tipografia: ti serviranno.",
      6: "Decidi cosa fare del Narratore.",
    }[s] || "Capitolo concluso. Parla con Virgola per voltare pagina.");

    const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
    function plaque(g, txt, x, y) { g.font = "900 8px Impact, sans-serif"; const w = g.measureText(txt).width + 10; R(g, x - w / 2, y - 8, w, 12, "#ffd95a"); g.strokeStyle = "#111"; g.lineWidth = 1.5; g.strokeRect(x - w / 2 + 0.5, y - 7.5, w - 1, 11); g.fillStyle = "#111"; g.textAlign = "center"; g.fillText(txt, x, y + 1); g.textAlign = "left"; }
    function balloons(g, d, list) { list.forEach(([tx, ty, txt], i) => { const x = d.X(tx) + 8, y = d.Y(ty) - 6 + Math.sin(d.fr / 25 + i) * 2; g.fillStyle = "#fff"; g.strokeStyle = "#111"; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y, 13, 7, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x, y + 7); g.lineTo(x + 2, y + 18); g.stroke(); g.fillStyle = "#111"; g.font = "bold 6px sans-serif"; g.textAlign = "center"; g.fillText(txt, x, y + 2); g.textAlign = "left"; }); }
    function sfxWords(g, d) { const W_ = ["BOOM!", "SBAM!", "ZOT!", "PAF!"]; for (let i = 0; i < 2; i++) { const k = Math.floor(d.fr / 120 + i * 2) % 4, x = 40 + ((d.fr / 120 + i * 3) | 0) * 97 % 240, y = 40 + i * 90; g.save(); g.translate(x, y); g.rotate(-0.2); g.font = "900 11px Impact, sans-serif"; g.lineWidth = 3; g.strokeStyle = "#fff"; g.strokeText(W_[k], 0, 0); g.fillStyle = "rgba(230,57,70,.85)"; g.fillText(W_[k], 0, 0); g.restore(); } }

    // ---------------------------------------------------------------- luoghi
    const zones = {
      lb_vignette: {
        name: "Il Libro · Città delle Vignette", short: "La Città delle Vignette", sub: "Una città a fumetti senza più parole", style: "fum", bg: "lb_vignette",
        w: 40, h: 26, start: [2, 12], itemCos: "lb_retino", items: [[1, 8], [38, 24], [8, 23], [29, 23]],
        areas: [[28, 7, 38, 11, "La Piazza dei Riquadri"], [19, 1, 20, 24, "Il Viale della Tipografia"], [1, 12, 38, 13, "Corso delle Strisce"], [1, 1, 38, 24, "La Città delle Vignette"]],
        act: { q: "Bussa alla porta", P: "Guarda il tabellone", l: "Guarda il lampione", u: "Guarda la fontana", n: "Leggi la bacheca", "^": "Verso la Tipografia" },
        flavor: {
          q: ["Bussi. Dalla finestra si affaccia un signore e apre la bocca: non esce niente. Ti mostra un cartello: «BALLOON RUBATI. TORNI PIÙ TARDI».", "Bussi. Una signora ti risponde a gesti. Le righine attorno alle mani dicono: «molto arrabbiata».", "Bussi. Dentro qualcuno sta guardando la TV. Non c'è audio: le hanno rubato anche i sottotitoli."],
          l: "Un lampione con un alone giallo a retino. Ronza: «zzz». È l'unica parola rimasta al lampione.",
          u: "La fontana della piazza: l'acqua è disegnata con tre righe curve. Fa «splash» quando la guardi. Almeno lei.",
          n: "Bacheca: «SMARRITI: un ‘buongiorno’, tre ‘per favore’, un ‘ti voglio bene’ (molto usato). Chi li trova li riporti al Signor Riquadro».",
        },
        intro: [["voce", "BOOM! Atterri su un marciapiede disegnato con l'inchiostro più nero che tu abbia mai visto. Tutto ha un contorno spesso. I colori sono pieni. Il cielo ha il retino."], ["voce", "Le persone camminano, si salutano… in silenzio. Sopra le loro teste dovrebbero esserci le nuvolette. Non c'è niente."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [22, 15] }, { id: "lb_didascalia", at: [16, 9] }, { id: "lb_muto", at: [6, 14] }, { id: "lb_balloon", at: [33, 9] }, { id: "lb_strillo", at: [35, 11] }];
          return o;
        },
        build(L) {
          const { lay, put, house } = L;
          lay(0, 0, 39, 0, "a"); lay(0, 25, 39, 25, "a"); lay(0, 0, 0, 25, "a"); lay(39, 0, 39, 25, "a");
          lay(1, 1, 38, 24, "+"); lay(1, 12, 38, 13, ":"); lay(19, 1, 20, 24, ":");
          house(2, 2, 7, 5, { roof: "#e63946", wall: "#4aa3df", door: [5, 6, "q"] }); house(10, 2, 7, 5, { roof: "#2b2d42", wall: "#ffd95a", door: [13, 6, "q"] });
          house(23, 2, 7, 5, { roof: "#7ed957", wall: "#f28482", door: [26, 6, "q"] }); house(31, 2, 7, 5, { roof: "#e63946", wall: "#c9ced8", door: [34, 6, "q"] });
          house(2, 17, 7, 5, { roof: "#ffd95a", wall: "#7ed957", door: [5, 17, "q"] }); house(10, 17, 7, 5, { roof: "#4aa3df", wall: "#f28482", door: [13, 17, "q"] });
          house(23, 17, 7, 5, { roof: "#2b2d42", wall: "#ffd95a", door: [26, 17, "q"] }); house(31, 17, 7, 5, { roof: "#7ed957", wall: "#4aa3df", door: [34, 17, "q"] });
          put(37, 8, "P"); put(9, 9, "l"); put(30, 15, "l"); put(24, 9, "u"); put(17, 10, "n");
          put(19, 0, "^"); put(20, 0, "^");
        },
        decor(g, cx, cy, d) {
          plaque(g, "PIAZZA DEI RIQUADRI", d.X(33) + 8, d.Y(7) - 2); plaque(g, "↑ TIPOGRAFIA", d.X(20), d.Y(1) + 4);
          balloons(g, d, [[33, 7, "MIO!"], [34, 8, "…"], [36, 10, "ciao"], [32, 10, "?!"]]);
        },
        top(g, cx, cy, d) { sfxWords(g, d); },
      },

      lb_tipografia: {
        name: "Il Libro · Tipografia del Rilegatore", short: "La Tipografia", sub: "Torchi, caratteri mobili e spago cerato", style: "fum", bg: "lb_tipografia",
        w: 34, h: 24, start: [16, 21], itemCos: "lb_tipo", items: [[2, 2], [31, 2], [2, 21], [30, 21]],
        words: { "6,7": "doppio", "27,7": "ancora", "6,13": "larga" },
        writes: [{ id: "tipo_luce", need: "luce", area: [24, 18, 24, 18], to: "+", prompt: "La porta del magazzino della carta è spalancata sul buio. Un buio d'inchiostro, denso. Cosa scrivi?",
          ok: [["voce", "Scrivi LUCE. Il buio si raggrinzisce come carta bagnata e si asciuga. Dentro, pile di risme, e su una risma una busta chiusa con una macchia di caffè."]], then: () => done() }],
        letter: { at: [29, 19], n: 3, txt: "Una voce che aspetta troppo a lungo comincia ad avere paura. Paura che il libro finisca, che qualcuno lo chiuda per sempre, e che lei resti muta. Se la incontri, non arrabbiarti con lei. Ha solo bisogno di sapere che le storie, dopo la fine, si possono raccontare di nuovo. — A." },
        areas: [[24, 15, 32, 22, "Il magazzino della carta"], [10, 6, 22, 12, "Il banco del Rilegatore"], [1, 1, 32, 22, "La Tipografia"]],
        act: { x: "Guarda il torchio", i: "Guarda i caratteri mobili", Z: "Guarda il rotolo di carta", e: "Leggi il foglio sul banco", "^": "Sali sui Tetti", v: "Torna in città" },
        flavor: {
          x: ["Un torchio a fumetto: fa KA-CHUNK a ogni giro e sputa una pagina nuova. Questa dice: «CONTINUA…».", "Il torchio si inceppa, tossisce un BOOM e riparte. Il Rilegatore non alza nemmeno la testa."],
          i: "Caratteri mobili in piombo, uno per cassetto. Quello della F è vuoto. Accanto, a matita: «F prestata. Mai restituita».",
          Z: "Un rotolo di carta alto due volte te. Sul bordo, una riga stampata ripetuta all'infinito: «e poi… e poi… e poi…».",
        },
        intro: [["voce", "KA-CHUNK. KA-CHUNK. La Tipografia del libro: torchi che respirano, caratteri di piombo, l'odore dell'inchiostro fresco. In mezzo, curvo su un banco, un vecchio con lo spago in bocca."]],
        npcs: (s) => [{ id: "lb_rilegatore", at: [16, 8] }, { id: "lb_virgola", at: [20, 19] }],
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 33, 0, "a"); lay(0, 23, 33, 23, "a"); lay(0, 0, 0, 23, "a"); lay(33, 0, 33, 23, "a");
          lay(1, 1, 32, 22, "+");
          lay(4, 4, 8, 5, "x"); lay(25, 4, 29, 5, "x"); lay(4, 10, 8, 11, "x"); lay(25, 10, 29, 11, "x");
          lay(11, 2, 14, 2, "i"); lay(19, 2, 22, 2, "i"); [[2, 14], [3, 14], [2, 16], [3, 16]].forEach(([x, y]) => put(x, y, "Z"));
          put(12, 8, "e");
          lay(24, 14, 32, 14, "a"); lay(24, 14, 24, 22, "a"); put(24, 18, "z");
          put(16, 0, "^"); put(17, 0, "^"); put(16, 23, "v"); put(17, 23, "v");
        },
        decor(g, cx, cy, d) { plaque(g, "TIPOGRAFIA DEL LIBRO", d.X(16) + 8, d.Y(1) + 4); plaque(g, "MAGAZZINO", d.X(28) + 8, d.Y(14) - 2); },
        top(g, cx, cy, d) { if ((d.fr / 30 | 0) % 4 === 0) { g.save(); g.translate(60, 40); g.rotate(-0.2); g.font = "900 12px Impact, sans-serif"; g.lineWidth = 3; g.strokeStyle = "#fff"; g.strokeText("KA-CHUNK", 0, 0); g.fillStyle = "#111"; g.fillText("KA-CHUNK", 0, 0); g.restore(); } },
      },

      lb_tetti: {
        name: "Il Libro · Tetti delle Nuvolette", short: "I Tetti delle Nuvolette", sub: "Sopra la città, dove si racconta tutto", style: "fum", bg: "lb_tetti", plus: ["#d9654b", "#a8432f"],
        w: 36, h: 24, start: [5, 21], itemCos: "lb_tramonto", items: [[2, 2], [33, 2], [33, 20], [20, 22]],
        words: { "32,3": "sole" },
        writes: [
          { id: "tetti_a", need: "ponte", area: [11, 11, 12, 12], to: "=", prompt: "Tra un tetto e l'altro la pagina è strappata: sotto, il bianco. Cosa scrivi per passare?", ok: [["voce", "Scrivi PONTE. Una passerella a fumetto, con le assi contornate di nero, si stende da un tetto all'altro. Fa «TUNK» quando ci sali."]], then: () => done() },
          { id: "tetti_c", need: "ponte", area: [23, 5, 23, 6], to: "=", prompt: "Un altro strappo, più stretto. Di là, un tetto illuminato dal sole. Cosa scrivi?", ok: [["voce", "Scrivi PONTE. Un ponticello. Di là, sul tetto, una parola si scalda al sole."]], then: () => done() },
        ],
        areas: [[14, 10, 21, 20, "Il campetto sul tetto"], [24, 1, 34, 22, "Il tetto al sole"], [1, 1, 10, 22, "Il tetto della Tipografia"], [13, 1, 22, 22, "Il tetto grande"]],
        act: { x: "Guarda il comignolo", l: "Guarda l'antenna", g: "Guarda la porta", v: "Torna in Tipografia" },
        flavor: {
          x: ["Un comignolo a fumetto: sbuffa nuvolette di fumo a forma di punto interrogativo.", "Dentro il comignolo qualcuno ha nascosto una nuvoletta rubata: «grazie». La lasci lì: non è tua."],
          l: "Un'antenna storta. BZZ. Capta una voce lontana, di donna, che legge ad alta voce: «…e quella sera la libreria chiuse alle sette, come sempre…».",
          g: "Porte da calcio fatte con due comignoli e una corda per stendere. La rete è un lenzuolo.",
        },
        intro: [["voce", "I Tetti delle Nuvolette. Da quassù si vede tutta la città a fumetti, e oltre la città il bordo della pagina, e oltre il bordo… il bianco."], ["voce", "Su un tetto, in piedi, con le spalle a te, c'è una figura alta, con un cappello e un cappotto. Sta guardando la città come la si guarda quando la si sta raccontando."]],
        npcs: (s) => {
          const o = [{ id: "lb_virgola", at: [8, 20] }];
          if (s >= 5) o.push({ id: "lb_narratore", at: [17, 8] });
          if (F.get("gomma") === "salvato") o.push({ id: "lb_gommapane", at: [15, 21] });
          return o;
        },
        build(L) {
          const { lay, put } = L;
          lay(0, 0, 35, 0, "a"); lay(0, 23, 35, 23, "a"); lay(0, 0, 0, 23, "a"); lay(35, 0, 35, 23, "a");
          lay(1, 1, 10, 22, "+"); lay(11, 1, 12, 22, "_"); lay(13, 1, 22, 22, "+"); lay(23, 1, 23, 22, "_"); lay(24, 1, 34, 22, "+");
          lay(14, 10, 21, 20, "-"); put(17, 10, "g"); put(18, 10, "g"); put(17, 20, "g"); put(18, 20, "g");
          [[3, 4], [7, 9], [15, 3], [20, 3], [28, 10], [31, 16]].forEach(([x, y]) => put(x, y, "x")); put(5, 15, "l"); put(30, 4, "l");
          put(5, 23, "v"); put(6, 23, "v");
        },
        decor(g, cx, cy, d) { plaque(g, "IL TETTO DEL NARRATORE", d.X(17) + 8, d.Y(6)); },
        top(g, cx, cy, d) { g.fillStyle = "rgba(255,159,67,.10)"; g.fillRect(0, 0, 320, 200); sfxWords(g, d); },
      },
    };

    // ---------------------------------------------------------------- Virgola
    function virgola() {
      const s = S();
      if (s === 0) return say([
        ["lb_virgola", "BOOM. Scusa, mi è uscito da solo. Qui le parole escono grandi e con il contorno."],
        ["lb_virgola", "Questa non è una fiaba. È un fumetto. Il libro ha saltato di genere: succede, quando una storia è ferita. Si cerca un altro vestito."],
      ], () => narr("La città era quieta e silenziosa per sua scelta: gli abitanti amavano il silenzio sopra ogni cosa.", () => say([
        ["lb_virgola", "C'è una cronista, qui. Gialla, con gli occhiali. Si chiama Didascalia. Lei sa sempre cosa succede tra una vignetta e l'altra. Cerchiamola: è a sinistra dell'incrocio."],
      ], () => { setStep(N, 1); done(); }), { id: "citta_muta", say: "Sono muti perché gli rubano i balloon.", note: "Il Narratore ha detto che la città amava il silenzio. Le rubano le parole.", reply: [["lb_narratore", "…Amano il silenzio forzato. È un genere. Proseguiamo."], ["lb_muto", "(Il Signor Riquadro, da lontano, ti fa un pollice in su. Attorno al pollice, tre righine di gratitudine.)"]] }));
      if (s >= 7) return ask("lb_virgola", "«Il bianco si avvicina. L'ultimo capitolo è fatto di matita. Andiamo?»", [
        { label: "📖 Volta pagina", sub: "Verso il Capitolo 4", cls: "hot", fn: () => { if (X.hasChapter(4) && X.mem().ch >= 4) X.continueStory(); else say([["lb_virgola", "L'ultima parte del libro… è ancora a matita. Non è pronta. Lo sento: qualcuno la sta disegnando adesso."]]); } },
        { label: "Due chiacchiere", sub: "Cosa pensa Virgola", fn: () => say([["lb_virgola", X.pick(["Lo sapevo, sai. Da un po'. Ma volevo sbagliarmi. Gli volevo bene, al Narratore. Mi raccontava la buonanotte.", "Hai sentito l'antenna? Quella voce di donna. Io la conosco. Leggeva questo libro, tanto tempo fa, in una libreria.", "Le orecchie alle pagine: le faccio sempre nei punti dove mi sono emozionata. Questo capitolo ne ha sei."])]]) },
      ]);
      return ask("lb_virgola", "«Una pausa. Così. Poi ripartiamo.»", [
        { label: "Cosa devo fare?", sub: "Un consiglio", fn: () => say([["lb_virgola", T(goal(S()))]]) },
        { label: "Le parole e la Partita Scritta", sub: "Come prepararsi", fn: () => say([["lb_virgola", "Lassù il Narratore non gioca con i piedi: gioca con le parole. Ogni sua parola ha una parola contraria. Più parole hai nel pennino, più carte hai in mano. In Tipografia ce ne sono tre, e sui tetti una che prende il sole."]]) },
      ]);
    }

    // ---------------------------------------------------------------- città
    function didascalia() {
      const s = S();
      if (s === 1) return say([
        ["lb_didascalia", "INTANTO, ALL'INCROCIO… un forestiero si avvicina alla cronista. Sono io. La cronista. Piacere, Didascalia."],
        ["lb_didascalia", "Questa città aveva una fiaba tutta sua: «La Banda dei Balloon». Una banda ruba le nuvolette, la città resta muta, e alla fine… alla fine non lo sa nessuno. L'ultima vignetta è stata mangiata."],
        ["lb_didascalia", "Così la Banda continua a rubare, all'infinito. Capitan Balloon tiene le parole della gente legate a un filo, nella Piazza dei Riquadri, a est. Ha più parole lui di tutta la città."],
        ["hero", "E se lo battessi?"],
        ["lb_didascalia", "NEL FRATTEMPO, LA CRONISTA SORRIDE. Capitan Balloon non resiste a una sfida: è un fumetto, qui si risolve tutto con un duello. A calcio, possibilmente."],
      ], () => { setStep(N, 2); done(); });
      if (s >= 4 && s < 7) return say([["lb_didascalia", "POCO DOPO… la Tipografia è in cima al viale che sale a nord. Mastro Rilegatore stampa le pagine del libro. Se qualcuno sa chi morde i finali, è chi li cuce."]]);
      return say([["lb_didascalia", X.pick(s >= 7 ? ["TRE GIORNI DOPO… no, scusa, è stato un attimo. Ma sembrava di più. Grazie, {n}.", "La città parla di nuovo. Fa un rumore incredibile. Mi piace."] : ["NEL FRATTEMPO… niente. Volevo solo dirlo.", "Le didascalie non hanno il balloon: hanno il riquadro. Per questo a me non l'hanno rubato."])]]);
    }
    function muto() {
      say([["lb_muto", S() >= 3 && F.get("fin3") ? "Buongiorno! BUONGIORNO! Ah, che bello. Buongiorno! Scusi, me ne erano rimasti tanti da dire." : "(Il Signor Riquadro apre la bocca. Niente. Indica la piazza a est, poi fa il gesto di un palloncino che vola via, poi incrocia le braccia, offeso.)"]]);
    }
    function balloon() {
      const s = S();
      if (s < 2) return say([["lb_balloon", "UAH AH AH! Un forestiero! Ehi, Strillo, guarda: uno che parla con le SUE parole. Che spreco!"]]);
      if (s === 2) return say([
        ["lb_balloon", "UAH AH AH! Il campione caduto dal libro! Ho sentito parlare di te. Cioè: ho sentito te parlare. Belle parole. Le voglio."],
        ["lb_strillo", "AAAH!"],
        ["lb_balloon", "Facciamo così, come nei fumetti seri: una sfida. Se vinci, ti do tutti i balloon della città. Se perdo… no, aspetta. Se vinco, mi prendo i tuoi. Tutti. Anche quello del tuo tiro, «{tiro}». Che bel nome. Lo voglio."],
      ], () => ask("lb_balloon", "«Allora? La piazza è pronta, il retino è steso. Come vuoi giocare?»", [
        { label: "⚽ Sfida la Banda dei Balloon", sub: "Partita secondaria: scegli tu come giocarla", cls: "hot", fn: playBalloon },
        { label: "Più tardi", sub: "Torna a esplorare", fn: done },
      ]));
      if (s === 3) return chooseEnding();
      return say([["lb_balloon", F.get("fin3") === "riscritto" ? "Il Teatro delle Nuvolette apre stasera! Primo spettacolo: «La città che ha ritrovato le parole». Il protagonista sei tu. Lo interpreta Strillo." : "UAH… ah. Dalla cella si vede la piazza. La gente parla. È bello sentirla. Non lo dire a nessuno."]]);
    }
    function strillo() { say([["lb_strillo", X.pick(["AAAH!", "AAAH! (È l'unico balloon che ho. Lo uso per tutto. Anche per dire grazie.)", S() >= 4 ? "AAAH! …cioè: ciao. Me l'hanno restituito, «ciao»." : "AAAH!!"])]]); }
    function playBalloon() {
      X.playMatch({
        id: "lb_balloon", alt: "az,hd,cage", force: false, mate: "Didascalia", squad: ["Virgola", "Signor Riquadro", "Strillo"], us: "I Cittadini Muti", homeKit: ["#ffd95a", "#111111"], azPitch: "vignetta", cageField: 3,
        chap: "Il Libro · {n} contro la Banda dei Balloon", bg: "lb_vignette",
        intro: "Nella Piazza dei Riquadri, {n} e Didascalia contro la Banda dei Balloon. In palio: tutte le parole rubate della città.",
        venue: { ads: [["CITTÀ DELLE VIGNETTE", "#e63946"], ["BOOM! BIBITE", "#3fa7ff"], ["STRISCE QUOTIDIANE", "#111111"], ["SBAM SPORT", "#b8902a"]], crowd: ["#ffd95a", "#3fa7ff", "#e63946", "#7ed957", "#fffbea"], ground: ["#55c26b", "#62d077"], line: "#111111cc", tint: "rgba(255,217,90,.08)", glow: "255,240,180" },
        oppNames: ["Capitan Balloon", "Bolla", "Strillo", "Sbam", "Fumetto"],
        team: (t, s) => ({ name: "La Banda dei Balloon", vs: "la Banda dei Balloon", color: "#3fa7ff", atk: t(s.tiro * 0.92), def: t(s.drib * 0.9), vel: t(s.tiro * 0.9), gk: ["Bolla", t(s.tiro * 0.95)] }),
        done: (r) => {
          if (r.win) { setStep(N, 3); X.reward("lb_c3_balloon", { coins: 25 }); return say([["voce", `Fischio finale: ${r.a} a ${r.b}. Capitan Balloon si siede per terra. Il filo con tutte le nuvolette gli scivola dalle mani.`], ["lb_balloon", "Va bene. Ho perso. Le parole sono vostre. Però… adesso come finisce la mia storia?"]], chooseEnding); }
          say([["voce", `Fischio finale: ${r.a} a ${r.b}.`], ["lb_balloon", "UAH AH AH! Riprova quando vuoi, campione. Le tue parole mi piacciono sempre di più."]]);
        },
      });
    }
    function tabellone() {
      const s = S();
      if (s !== 2) return say([["voce", "Il tabellone della piazza: segna i balloon rubati. Il contatore è arrivato a 9.999 e si è bloccato, per pudore."]]);
      ask("voce", "Sul tabellone della piazza c'è spazio per una parola. Potresti scrivere VINTO, e la Banda dovrebbe arrendersi.", [
        { label: "✒ Scrivi VINTO", sub: "Salti la partita · il libro se lo ricorderà", fn: () => { cheat(); X.SFX.scribble(); F.set("c3_vinto", true); setStep(N, 3); if (!knows("vinto")) { X.mem().words.push("vinto"); X.save(); } say([["voce", "Scrivi VINTO. Capitan Balloon guarda il tabellone, si gratta la cresta e lascia andare il filo, perplesso."], ["lb_balloon", "Ho perso? Così? Mah. Le regole sono regole. Ma adesso come finisce la mia storia?"]], chooseEnding); } },
        { label: "No: si gioca", sub: "Una sfida è una sfida", cls: "hot", fn: () => say([["voce", "Lasci stare il tabellone. Strillo, da lontano, fa un «AAAH!» di approvazione."]]) },
      ]);
    }
    function chooseEnding() {
      ask("lb_balloon", "«Allora, campione? Come finisce la storia della Banda dei Balloon?»", [
        { label: "«La banda finisce in prigione.»", sub: "Il finale vero, da fumetto classico", fn: () => endingFiaba("vero") },
        { label: "«La banda apre un teatro di nuvolette.»", sub: "Un finale riscritto", fn: () => endingFiaba("riscritto") },
      ]);
    }
    function endingFiaba(v) {
      F.set("fin3", v); setStep(N, 4);
      say((v === "vero" ? [
        ["voce", "Ultima vignetta: la Banda dei Balloon dietro le sbarre a strisce. Le nuvolette tornano ai proprietari, una per una, come piccioni viaggiatori."],
        ["lb_balloon", "UAH… In prigione. Come nei fumetti veri. Almeno qui la storia finisce."],
      ] : [
        ["voce", "Ultima vignetta: un teatro con le tende rosse. Sul palco, la Banda dei Balloon restituisce le nuvolette al pubblico, una per una, e il pubblico le usa subito per applaudire."],
        ["lb_balloon", "Un teatro! Così le parole le prendo in prestito e le restituisco ogni sera. È legale. È bellissimo. UAH AH AH!"],
      ]).concat([
        ["voce", "La città esplode in un rumore enorme: tutti parlano insieme. «BUONGIORNO!» «FINALMENTE!» «HAI VISTO LA PARTITA?»"],
        ["lb_didascalia", "NEL FRATTEMPO, IN TIPOGRAFIA… il torchio si è fermato. Mastro Rilegatore ti aspetta. Ha la faccia di uno che deve confessare qualcosa."],
      ]), () => { note(v === "vero" ? "La Banda dei Balloon è finita in prigione. La città ha di nuovo le sue parole." : "La Banda dei Balloon ha aperto un teatro di nuvolette."); done(); });
    }

    // ---------------------------------------------------------------- Tipografia
    function rilegatore() {
      const s = S();
      if (s < 4) return say([["lb_rilegatore", "Mm. Non ora. KA-CHUNK. Prima sistema la città, ragazzo: senza parole, la gente non legge, e se nessuno legge io stampo per niente."]]);
      if (s === 4) return say([
        ["lb_rilegatore", "Sei tu quello che riscrive i finali. Lo so. Si sente: le pagine arrivano in tipografia più pesanti, da quando ci sei."],
        ["lb_rilegatore", "Ho una cosa da mostrarti. Me la porto in tasca da trentanove anni. Mi brucia."],
        ["voce", "Il vecchio tira fuori un foglio piegato tante volte che è diventato morbido come stoffa. Lo spiega sul banco."],
        ["voce", "«Ordine di rilegatura. Rilegare il libro SENZA l'ultima pagina. Le ultime righe di ogni fiaba vanno consegnate a me, non stampate. Firmato: N.» La N ha tanti riccioli. È una firma teatrale."],
        ["lb_rilegatore", "Me l'ha chiesto lui, la sera che la signora Ada non è tornata in libreria. Ha detto: «Se il libro non finisce, lei tornerà a leggerlo». Gli ho creduto. Ho cucito il libro senza fondo."],
      ], () => narr("Mastro Rilegatore non ha mai ricevuto ordini da nessuno. Quel foglio è un falso.", () => say([
        ["lb_rilegatore", "Tieni. È della signora Ada. L'ha lasciata sul banco quell'ultima sera. Io non sono capace di usarla: cucio, non scrivo."],
      ], () => learn("penna", () => say([
        ["lb_rilegatore", "Sui tetti, sopra la tipografia, c'è lui. Il Narratore. Lassù non si gioca coi piedi: si gioca a parole. Lui scrive le sue: NEBBIA, SPECCHIO, PIOGGIA, CANCELLA, FINE. Per ognuna esiste una parola contraria. Prendi quelle che trovi qui in giro: il torchio ne ha stampate tre stanotte, da solo."],
        ["lb_virgola", "E nel magazzino, nel buio, c'è qualcosa. L'ho sempre sentito respirare, come una lettera che aspetta."],
      ], () => { setStep(N, 5); note("L'ordine di rilegare il libro senza l'ultima pagina era firmato: N. Il Narratore."); done(); }))), { id: "ordine_firmato", say: "C'è la tua firma sull'ordine.", note: "Il Narratore dice che il Rilegatore non ha mai ricevuto ordini. L'ordine è firmato N.", reply: [["lb_narratore", "…"], ["voce", "Per la prima volta, il Narratore non dice «proseguiamo». Le luci della tipografia tremano."]] }));
      return say([["lb_rilegatore", X.pick(s >= 7 ? ["Quando avrai finito, porta il libro qui. Gli cucirò l'ultima pagina. La più bella che abbia mai cucito.", "KA-CHUNK. Il torchio stampa da solo, da quando sei salito sui tetti. Stampa la parola «dopo»."] : ["Il torchio ha stampato tre parole, stanotte. Sono in giro per la tipografia. E nel magazzino buio c'è dell'altro.", "La scala per i tetti è lassù, in fondo. Vai, ragazzo. Io resto a cucire."])]]);
    }

    // ---------------------------------------------------------------- il Narratore sui tetti
    function narratore() {
      const s = S();
      if (s === 5) return say([
        ["voce", "La figura sul tetto si volta. Ha un cappello a tesa larga e un cappotto lungo fino ai piedi. La faccia è in ombra. Gli occhi sono due virgolette gialle."],
        ["lb_narratore", "Buonasera, {n}. Ti stavo raccontando. Sei venuto più in fretta di quanto avessi scritto."],
        ["hero", "Sei stato tu. I morsi dritti. L'ordine al Rilegatore. Il Gommapane. Tutto."],
        ["lb_narratore", "Sì."],
        ["lb_narratore", "Io sono la voce di questo libro. Sono nato la sera in cui una signora gentile ha letto la prima fiaba ad alta voce, in una libreria. Ogni sera, una fiaba. Ogni fiaba, un finale. Ogni finale… un pochino di silenzio, prima della fiaba dopo."],
        ["lb_narratore", "Poi una sera lei ha detto «torno subito». E non è tornata. E io ho capito una cosa: quando un libro finisce, lo si chiude. E un libro chiuso non parla più."],
        ["lb_narratore", "Così ho cominciato a mangiare i finali. Uno alla volta. Finché non finisce niente, nessuno chiude il libro. Finché il libro è aperto, io parlo. E se io parlo… forse lei mi sente, e torna."],
      ], () => {
        const next = () => narr("Io non ho mai mentito, in vita mia. Ho solo raccontato le cose come dovevano essere.", () => say([
          ["lb_narratore", "Vuoi l'ultima pagina? Allora vincila. Ma non con i piedi: con le parole. Io scriverò le mie, tu le tue. Tre pagine. Se vinci, potrai scrivere la fine. Se perdi, il libro resterà aperto. Per sempre."],
        ], () => ask("lb_narratore", "«Hai il pennino carico? Le parole che hai raccolto sono le tue carte.»", [
          { label: "✒ LA PARTITA SCRITTA", sub: `Tre pagine contro il Narratore · ${X.mem().words.filter((w) => w !== "vinto").length} parole nel pennino`, cls: "hot", fn: playScritta },
          { label: "Non ancora", sub: "Cercare altre parole prima", fn: done },
        ])), { id: "mai_mentito", say: "Hai mentito su tutto, dal primo capitolo.", note: "Il Narratore dice di non aver mai mentito.", reply: [["lb_narratore", "…Ho abbellito. Un narratore abbellisce."], ["hero", "Hai detto che il Lupo ghignava. Che la Corte rideva. Che il Gommapane era un mostro."], ["lb_narratore", "…Sì. Hai ragione. Ho mentito. Per paura. È la prima volta che lo dico ad alta voce."]] });
        if (marg() >= 3) return say([["hero", "Ti ho sentito, sai. Ogni volta. Ogni volta che raccontavi una cosa che non c'era, io l'ho scritta a margine."], ["voce", `Apri il Segnalibro: ${marg()} note a margine, in fila, con la tua calligrafia. Il Narratore le legge una per una. Gli occhi gialli si abbassano.`], ["lb_narratore", "Le hai tenute tutte. Nessuno mi aveva mai… ascoltato così bene. Neanche quando dicevo bugie."]], next);
        next();
      });
      if (s === 6) return chooseNarr();
      if (s >= 7) return say([["lb_narratore", { perdonato: "Grazie. Non so ancora come si fa a finire. Ma voglio provarci. Con te.", cancellato: "…", patto: "Socio. Che bella parola. La racconterò per sempre." }[F.get("narr")] || "…"]]);
      return say([["lb_narratore", "Non ancora, {n}. Non è ancora il tuo momento in questa storia."]]);
    }
    function playScritta() {
      const LS = window.__lbPartitaScritta, h = X.hero() || {}, C = X.api.CAST, v = C.lb_virgola || {};
      if (!LS || !LS.start) return say([["voce", "La Partita Scritta non si è caricata. Ricarica la pagina e riprova."]]);
      X.api.scene("lb_tetti", "voce", "La Partita Scritta è cominciata.", [{ label: "◂ Torna a camminare", fn: done }], "La Partita Scritta");
      LS.start({
        title: "La Partita Scritta · contro il Narratore", hard: true,
        hero: { name: h.name || "Campione", skin: h.skin, hair: h.hair, shirt: h.shirt || "#e63946" }, mate: { name: "Virgola", skin: v.skin, hair: v.hair, shirt: v.shirt },
        words: X.mem().words.filter((w) => w !== "vinto"), opp: { name: "I Capoversi", boss: true },
        onDone: (r) => {
          const m = X.mem(); if (r.win) m.wins++; else m.losses++; X.save();
          if (r.win) { setStep(N, 6); X.reward("lb_c3_scritta", { coins: 40 }); return say([["voce", `L'ultima pagina si chiude: ${r.a} a ${r.b}. Sul tetto, il vento sfoglia tutte le nuvolette della città.`], ["lb_narratore", "Hai vinto. Con le parole. Le mie parole contro le tue… e le tue erano più vere."]], chooseNarr); }
          say([["voce", `${r.a} a ${r.b}. Il Narratore si sistema il cappello.`], ["lb_narratore", "Il libro resta aperto. Per stasera. Torna quando vuoi: io racconto, e aspetto."]]);
        },
      });
    }
    function chooseNarr() {
      const gom = F.get("gomma") === "salvato";
      ask("lb_narratore", "«Hai vinto. Adesso decidi tu cosa fare di me. Sono una voce che ha avuto paura. Che cosa merita una voce così?»", [
        { label: "«Ti perdono. Ma il libro deve finire.»", sub: "Lo perdoni e cercate insieme un'altra strada", cls: "hot", fn: () => endNarr("perdonato") },
        { label: gom ? "«Gommapane: è il refuso più grande del libro.»" : "«Ti cancello con una riga dritta.»", sub: "Lo cancelli", fn: () => endNarr("cancellato") },
        { label: "«Resto con te. Il libro non finirà mai.»", sub: "Accetti il suo patto", fn: () => endNarr("patto") },
      ]);
    }
    function endNarr(v) {
      F.set("narr", v); setStep(N, 7);
      const gom = F.get("gomma") === "salvato";
      const a = v === "perdonato" ? [
        ["hero", "Ti perdono. Avevi paura. Lo capisco: anche io ho paura del fischio finale, ogni volta. Ma dopo il fischio c'è sempre un'altra partita."],
        ["lb_narratore", "Dopo il fischio… c'è un'altra partita. Non ci avevo mai pensato. Un libro finito si può rileggere, vero? Dall'inizio?"],
        ["lb_virgola", "Sempre. È il mio lavoro: tenere il segno, e poi ricominciare."],
        ["voce", "Il Narratore si toglie il cappello. Sotto, per la prima volta, si vede una faccia: stanca, gentile, con le rughe di chi ha parlato tanto."],
      ] : v === "cancellato" ? (gom ? [
        ["hero", "Gommapane. Lui è un refuso: una voce che ha sbagliato strada. Il più grande del libro."],
        ["lb_gommapane", "…Gnam?"],
        ["voce", "Il Gommapane si avvicina, piccolo e tondo. Il Narratore non scappa. Si inginocchia, si toglie il cappello e chiude gli occhi. Il Gommapane lo mastica piano, con rispetto, come si mangia l'ultima fetta di una torta."],
        ["lb_gommapane", "Sapeva di… «c'era una volta». Buono. Triste."],
      ] : [
        ["voce", "Prendi il pennino e tiri una riga dritta, netta, sul Narratore. Come lui faceva con i finali."],
        ["lb_narratore", "Giusto. Dritto. Come i miei morsi. Racconta tu, adesso…"],
        ["voce", "Il Narratore si sbriciola in lettere che il vento porta via dai tetti. Per la prima volta da quando sei entrato nel libro, c'è silenzio. Un silenzio vero."],
      ]) : [
        ["hero", "Resto. Tu racconti, io gioco. Ogni sera una partita nuova, ogni sera un finale diverso, che poi mangiamo insieme. Nessuno chiuderà mai questo libro."],
        ["lb_narratore", "Davvero? Un compagno. In trentanove anni non ho mai avuto un compagno di storia."],
        ["lb_virgola", "{n}… sei sicuro? Un libro che non finisce mai non ti lascia andare a casa. Domani hai una partita, fuori."],
        ["voce", "Il Narratore ti stringe la mano. È fredda, come la carta di notte. Dietro di voi le nuvolette della città si mettono a ridere, tutte insieme, e la risata ha un'eco lunga lunga."],
      ];
      say(a, () => say([
        ["voce", "Poi, da sotto i tetti, arriva un rumore che non hai ancora sentito in questo libro. Non è un morso, e non è un pennino. È più grande. È il rumore di una gomma da cancellare enorme, che sfrega la carta. Dai bordi della pagina."],
        ["voce", "Il cielo a fumetto perde i colori, uno dopo l'altro. Il retino si scioglie. Rimangono solo le linee di matita. E in fondo, sul bordo bianco della pagina, c'è una figura disegnata a matita. Ha la tua maglia. Ha il tuo numero. Ha la tua faccia. Ma non è finita: le mancano i colori, e un braccio è solo uno schizzo."],
        ["lb_virgola", "…Quella sei tu?"],
        ["voce", "La figura alza una mano di matita e ti saluta. Poi la pagina si gira da sola. Al di là c'è il bianco. Quasi tutto bianco."],
      ], () => {
        finishChapter(N, v);
        const msg = X.reward("lb_c3_done", { coins: 60, cos: "lb_c3" });
        note({ perdonato: "Ho perdonato il Narratore. Era la voce dell'Autrice, rimasta sola ad aspettarla.", cancellato: "Ho cancellato il Narratore.", patto: "Ho accettato il patto del Narratore: il libro non finirà mai." }[v]);
        say([["voce", "Fine del Capitolo 3 · «Il Fumetto Sbagliato». " + (msg.length ? msg.join(" · ") : "")], ["lb_virgola", "Quando vuoi voltare pagina, vieni da me. L'ultima parte è a matita."]]);
      }));
    }

    // ---------------------------------------------------------------- oggetti e passaggi
    const obj = {
      "lb_vignette:^": () => (S() >= 4 ? go("lb_tipografia", 16, 21) : say([["lb_didascalia", "IN QUEL MOMENTO… la cronista ti ferma. Prima la Banda dei Balloon, campione: se la città non parla, la Tipografia non ti apre."]])),
      "lb_vignette:P": tabellone,
      "lb_tipografia:v": () => go("lb_vignette", 19, 2),
      "lb_tipografia:^": () => (S() >= 5 ? go("lb_tetti", 5, 21) : say([["lb_rilegatore", "La scala per i tetti. Non ancora, ragazzo. Prima parliamo."]])),
      "lb_tipografia:e": () => say([["voce", S() >= 5 ? "Sul banco, l'ordine firmato «N.». Accanto, il Rilegatore ha appoggiato un ago. Sembra una virgola d'acciaio." : "Fogli di prova: «C'era una volta», «C'era una volta», «C'era una volta». Tutti uguali. Nessuno ha il seguito."]]),
      "lb_tetti:v": () => go("lb_tipografia", 16, 2),
    };
    function onWord(w) {
      const left = ["doppio", "ancora", "larga", "sole"].filter((x) => !knows(x)).length;
      say([["lb_virgola", `${X.WORDS[w].w}! ${left ? `Nel pennino c'è ancora posto: ne mancano ${left} tra quelle di questo capitolo.` : "Il pennino è carico. Lassù, il Narratore non ci troverà disarmati."}`]]);
    }
    function news(id, s) {
      if (id === "lb_virgola") return s === 0 || s >= 7;
      if (id === "lb_didascalia") return s === 1;
      if (id === "lb_balloon") return s === 2 || s === 3;
      if (id === "lb_rilegatore") return s === 4;
      if (id === "lb_narratore") return s === 5 || s === 6;
      return false;
    }
    return {
      n: N, title: "Il Fumetto Sbagliato", sub: "Fumetto · la Banda dei Balloon, la Tipografia e il Narratore", start: "lb_vignette",
      goal, zones, obj, news, onWord,
      talk: { lb_virgola: virgola, lb_didascalia: didascalia, lb_muto: muto, lb_balloon: balloon, lb_strillo: strillo, lb_rilegatore: rilegatore, lb_narratore: narratore, lb_gommapane: () => say([["lb_gommapane", S() >= 7 ? "Finito? Quasi. Gnam." : "Lui… lassù. Io qui. Io guardo. Se serve, io mangio. Solo refusi."]]) },
      intro: () => [
        ["voce", "La pagina si gira con un rumore di carta lucida.", "lb_copertina"],
        ["voce", "BOOM!", "lb_vignette"],
        ["lb_narratore", "Capitolo terzo. Nel quale il libro, ferito, cambiò vestito. E il nostro campione {n} scoprì che le parole si possono rubare.", "lb_vignette"],
      ],
    };
  }
  boot();
})();
