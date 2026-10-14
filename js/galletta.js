// js/galletta.js - «S.O.S. GALLETTA: I BUCANIERI DEL BISCOTTO» · configurazione della saga su js/saga-core.js
// Commedia cartoon piratesca e gastronomica tra onde spumeggianti, pontili basculanti e barili di melassa.
// Sulle rotte sconosciute dell'Oceano della Melassa, le ciurme corsare non cercano forzieri di rubini,
// ma l'ingrediente leggendario: la Farina Primordiale e il Forno Sottomarino del Kraken Croccante.
// Novità di questa saga:
//  - ARREMBAGGIO SUL PONTE (js/arrembaggio.js): motore originale sul ponte beccheggiante del galeone «Masticatore»,
//    con rollio dinamico, raffiche di vento marino e rimbalzi su barili e casse.
//  - IL RICETTARIO CORSARO (K.ricetta): pergamene ingiallite con ricette di pasticceria corsara e bonus ciurma.
//  - ESTETICA CARTOON PIRATESCA: moli di quercia, forni a cupola, cannoni a farina, ancore arrugginite e stendardi col biscotto morsicato.
(function () {
  "use strict";
  if (window.__galletta || !window.__sagaCore) return;

  const RICETTE = {
    galletta: [
      "RICETTA CORSARA N° 1 · LA GALLETTA DI FERRO",
      "INGREDIENTI: Farina di Molo, Acqua di Mare filtrata, Chiodi di Garofano",
      "«LA GALLETTA DA DUELLO»",
      "Dura a tal punto da poter essere calciata a tutto braccio contro le murate nemiche. Se inzuppata nel tè freddo al cardamomo, dona grinta immediata a tutto l'attacco bucaniere."
    ],
    melassa: [
      "RICETTA CORSARA N° 2 · LA MELASSA IMPERIALE",
      "INGREDIENTI: Zucchero Muscovado, Vaniglia dell'Atollo, Scorza d'Arancia Amara",
      "«COLLANTE PER PORTIERI»",
      "Uno sciroppo denso e aromatico che rende il pallone e i guanti del portiere incredibilmente appiccicosi. Nessun tiro a effetto può sfuggire a una presa bagnata di melassa."
    ],
    burro: [
      "RICETTA CORSARA N° 3 · IL BURRO SCIABOLATO",
      "INGREDIENTI: Panna d'Alpeggio Reale rubata al convoglio, Sale Marino, Timo Selvatico",
      "«L'OLIO PER SCIVOLATE DI BORDO»",
      "Spalmato sul ponte del galeone o sugli scarpini, permette scivolate lunghe dieci metri che mandano a vuoto i contrasti della ciurma della Caracca Reale."
    ],
    kraken: [
      "RICETTA CORSARA N° 4 · IL BISCOTTO DEL KRAKEN",
      "INGREDIENTI: Lievito Vulcanico dell'Atollo Spezzato, Cioccolato Nero, Cannella Primordiale",
      "«IL FORNO DEI SETTE MARI»",
      "L'antica pietanza cerimoniale capace di ammansire il leggendario Kraken Croccante. Chi ne possiede il profumo domina le correnti e alza la Coppa del Grande Forno."
    ]
  };

  const E = window.__sagaCore.create({
    id: "galletta",
    key: "ali-di-rondine.galletta",
    title: "S.O.S. Galletta: I Bucanieri del Biscotto",
    icon: "🏴‍☠️",
    bg: "gl_titolo",
    chapters: 3,
    menuSub: "Arrembaggi sul ponte, pontili basculanti e la leggenda del Grande Forno tra i flutti",
    theme: {
      accent: "#d97706",
      ink: "#451a03",
      paper: "rgba(254,243,199,.96)",
      font: "'Trebuchet MS', serif, system-ui",
      chipBg: "#fef3c7",
      chipBorder: "#78350f"
    },
    stats: {
      gallette: [0, 999, 100, "Gallette d'Oro (🍪)"],
      pirateria: [0, 99, 15, "Reputazione Corsara"],
      spezie: [0, 99, 20, "Fiuto delle Spezie"]
    },
    travel: true,
    item: ["Biscotto d'Oro", "Biscotti d'Oro"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      // Biscotto rotondo dorato
      g.fillStyle = "#d97706";
      g.beginPath();
      g.arc(0, 0, 5.5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = "#78350f";
      g.lineWidth = 1;
      g.stroke();
      // Gocce di cioccolato fondente
      g.fillStyle = "#451a03";
      g.fillRect(-2, -2, 1.5, 1.5);
      g.fillRect(1, -1, 1.5, 1.5);
      g.fillRect(-1, 2, 1.5, 1.5);
      // Morso laterale con stelline
      g.fillStyle = "#fef3c7";
      g.beginPath();
      g.arc(3.5, -2, 2.5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "lizza",
      cageField: 3,
      cageMut: "wet",
      weather: "rain",
      venue: {
        ads: [["TAVERNA DELLA BRICIOLA", "#b45309"], ["FORNI REALI DI MELASSA", "#c2410c"], ["CAPITAN BARBABISCOTTO", "#1e3a8a"], ["DROGHERIA CANNELLA", "#15803d"]],
        crowd: ["#1e3a8a", "#d97706", "#78350f", "#b45309", "#0284c7"],
        ground: ["#78350f", "#451a03"],
        line: "rgba(254,243,199,.6)",
        grid: "rgba(120,53,15,.2)",
        sky: ["#0284c7", "#38bdf8"],
        wall: ["#78350f", "#451a03"],
        fx: { fr: 0.94, spd: 0.96, wind: 1.4 }
      }
    },
    regions: {
      porto: { grass: ["#0284c7", "#0369a1", "#075985"], path: ["#d97706", "#b45309"], stone: ["#78350f", "#451a03"], wall: ["#451a03", "#270f03"], water: ["#0284c7", "#0369a1"], tall: "#b45309", tree: ["#15803d", "#166534"], tint: "254,243,199", tintA: 0.05, fx: "rain", dark: 0 },
      galeone: { grass: ["#78350f", "#572b0b", "#451a03"], path: ["#92400e", "#78350f"], stone: ["#451a03", "#29140c"], wall: ["#29140c", "#1c0d06"], water: ["#0369a1", "#075985"], tall: "#78350f", tree: ["#166534", "#14532d"], tint: "254,215,170", tintA: 0.06, fx: "", dark: 0.01 },
      isola: { grass: ["#d97706", "#b45309", "#92400e"], path: ["#fde047", "#facc15"], stone: ["#78350f", "#451a03"], wall: ["#451a03", "#270f03"], water: ["#0284c7", "#0369a1"], tall: "#b45309", tree: ["#15803d", "#14532d"], tint: "253,224,71", tintA: 0.08, fx: "dust", dark: 0 }
    },
    floors: "",
    solid: "SPFTBA#wWCcKk",
    rest: {
      ch: "s",
      label: "Riposa alla Taverna della Briciola",
      text: "Ti siedi su un barile di quercia nella Taverna della Briciola. L'oste Cannella versa una tazza di sidro speziato al cardamomo mentre il vecchio pappagallo ripete le formule del Gran Forno. (Il gioco salva da solo: qui puoi consultare il Diario delle Ricette Corsare.)"
    },
    texts: {
      chestOpen: "Apri il baule cerchiato d'ottone.",
      chestEmpty: "Solo gusci di noce moscata e qualche briciola di galletta rafferma.",
      nothing: "Solo spruzzi d'onda e qualche gabbiano che volteggia.",
      noHero: "L'equipaggio della Biscottiera cerca il suo nuovo capitano del pallone. Crea prima il tuo Campione."
    },
    journal: {
      name: "Il Ricettario Corsaro",
      sub: "I segreti culinari e le ricette dell'Arcipelago delle Briciole",
      html: (K) => {
        const ks = Object.keys(RICETTE).filter((id) => K.F.is("gl_r_" + id));
        return ks.length
          ? ks.map((id) => `<p style="margin:8px 0;border-bottom:1px dashed #b45309;padding-bottom:6px"><small style="color:#b45309;font-weight:900">${RICETTE[id][0]}</small><br><b style="color:#7c2d12;font-size:14px">${RICETTE[id][2]}</b><br><span style="color:#b45309;font-weight:700">${RICETTE[id][1]}</span><br><span style="opacity:.85;font-size:12px">${RICETTE[id][3]}</span></p>`).join("")
          : "<p>Nessuna ricetta corsara ancora appuntata sul diario di bordo.</p>";
      }
    },
    endings: {
      reale: ["L'ORDINE DEL FORNO REALE", "Accetti l'amnistia della Corona e diventi il Gran Pasticciere di Corte. Il tuo galeone naviga con stendardo dorato, fornendo gallette imperiali a tutta la flotta.", "Serve aver scelto la via diplomatica con il Commodoro nel Capitolo 2 e vinto la finale."],
      bucaniere: ["IL RE DEI BUCANIERI CROCCANTI", "Alzi la bandiera del Biscotto Morsicato su tutti i sette mari. I convogli reali pagano tributi in burro e vaniglia e il tuo nome fa tremare ogni fornaio dell'oceano.", "Serve alta Reputazione Corsara (>60) e l'alleanza con Barbabiscotto."],
      cuoco: ["LA LOCANDA TRA I FLUTTI", "Rifiuti sia il re che i cannoni. Apri una trattoria galleggiante sull'Atollo del Cardamomo: calciatori e pirati fanno la fila per una galletta fumante dopo la partita.", "Sempre possibile vincendo la finale senza giurare fedeltà a fazioni."],
      segreto: ["IL LEVIATANO DI MARZAPANE", "Risvegli l'antico Kraken del Biscotto con la Ricetta Primordiale: l'enorme creatura ti incorona Custode Eterno dei Mari della Melassa.", "Segreto: tutti i biscotti d'oro raccolti, fiuto delle spezie al massimo e 5 vittorie negli arrembaggi."]
    },
    heroLook: () => ({ bg: ["#fef3c7", "#d97706"], shirt: "#d97706" }),
    heroTitle: (K) => (K.stat("pirateria") > 50 ? "il corsaro più temuto dell'Oceano della Melassa" : "il mastro pasticciere del pallone marinaro"),
    act: {
      q: "Entra",
      n: "Leggi la pergamena",
      B: "Guarda il barile",
      K: "Ispeziona il cannone",
      P: "Aziona la passerella",
      F: "Osserva il forno",
      A: "Ammira l'ancora",
      "^": "Cambia zona",
      v: "Cambia zona",
      "<": "Cambia zona",
      ">": "Cambia zona"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          B: "Un barile cerchiato di bronzo con cera rossa: «Melassa Nera del Capitano - non agitare prima dell'arrembaggio».",
          K: "Un cannone in lega di rame e ottone. La bocca da fuoco è caricata a polvere di cannella e sacchetti di farina fine.",
          P: "Una solida passerella basculante in rovere stagionato, bilanciata con contrappesi di piombo per collegare i vascelli.",
          F: "Un grande forno di mattoni refrattari a cupola: dalle aperture esce un invitante profumo di crosta dorata e vaniglia.",
          A: "Una gigantesca ancora di ferro a quattro marre, incrostata di sale e conchiglie coralline.",
          T: "Un tavolo di legno d'acero con mappe nautiche unte di burro e compassi d'ottone."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      }
    }],
    musicMain: "galletta",
    music: {
      galletta: {
        bpm: 122,
        chords: ["Dm", "Gm", "A7", "Dm", "Bb", "F", "Gm", "A7"],
        lres: 2,
        lw: "sawtooth",
        lv: 0.05,
        lead: "D4 - F4 - A4 - D5 | C5 - Bb4 - A4 - G4 | A4 - - - F4 - D4 - | E4 - - - - - - - | F4 - A4 - D5 - - | C5 - A4 - F4 - - | G4 - Bb4 - A4 - E4 - | D4 - - - - - - -",
        bass: "D2 . . A2 . G2 . A2",
        bv: 0.14,
        arp: "",
        av: 0,
        drum: "k . h s . k h s k . h s . k h h",
        dv: 0.13
      }
    },
    paint: {
      // Barile di melassa o burro
      B(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 3, sy + 2, 10, 12);
        g.fillStyle = "#b45309";
        g.fillRect(sx + 4, sy + 4, 8, 8);
        g.fillStyle = "#f59e0b";
        g.fillRect(sx + 3, sy + 4, 10, 1.5);
        g.fillRect(sx + 3, sy + 10, 10, 1.5);
      },
      // Cannone navale a farina
      K(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        // Affusto di legno
        g.fillStyle = "#78350f";
        g.fillRect(sx + 3, sy + 9, 10, 5);
        // Ruote dell'affusto
        g.fillStyle = "#1c1917";
        g.fillRect(sx + 2, sy + 11, 3, 3);
        g.fillRect(sx + 11, sy + 11, 3, 3);
        // Canna di bronzo
        g.fillStyle = "#b45309";
        g.fillRect(sx + 4, sy + 5, 8, 4);
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 12, sy + 6, 2, 2);
      },
      // Passerella basculante / leva
      P(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#92400e";
        g.fillRect(sx + 1, sy + 3, 14, 10);
        g.fillStyle = "#451a03";
        g.fillRect(sx + 3, sy + 3, 2, 10);
        g.fillRect(sx + 11, sy + 3, 2, 10);
        g.fillStyle = "#cbd5e1"; // catena d'ormeggio
        g.fillRect(sx + 7, sy + 1, 2, 14);
      },
      // Forno a cupola
      F(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        // Cupola in pietra
        g.fillStyle = "#78350f";
        g.beginPath();
        g.arc(sx + 8, sy + 9, 6, Math.PI, 0);
        g.lineTo(sx + 14, sy + 15);
        g.lineTo(sx + 2, sy + 15);
        g.closePath();
        g.fill();
        // Bocca del forno ardente
        g.fillStyle = "#ea580c";
        g.fillRect(sx + 6, sy + 10, 4, 4);
        g.fillStyle = "#fef08a";
        g.fillRect(sx + 7, sy + 11, 2, 2);
      },
      // Ancora di ferro
      A(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#334155";
        // Fuso centrale
        g.fillRect(sx + 7, sy + 3, 2, 10);
        // Occhio superiore
        g.strokeStyle = "#475569";
        g.lineWidth = 1.5;
        g.strokeRect(sx + 6, sy + 1, 4, 3);
        // Marre inferiori arcuate
        g.beginPath();
        g.arc(sx + 8, sy + 11, 5, 0.2, Math.PI - 0.2);
        g.strokeStyle = "#334155";
        g.lineWidth = 2;
        g.stroke();
      }
    },
    guest: {
      id: "gl_barbabiscotto",
      lines: [["gl_barbabiscotto", "[aggiusta il tricorno e mastica una crostina] Per tutti i denti del Kraken, {n}! Qui a Borgo Marino avete un porto pulito e gabbiani educati. Ma dimmi: com'è che quando fate gol non sparate a salve tre sacchi di zucchero sopra la curva? Quello sì che scalda gli animi!"]]
    },
    cameos: [
      {
        id: "pi_kidd",
        zone: "gl_taverna",
        at: [12, 7],
        when: (K) => !!(K.otherSaga("ali-di-rondine.pirati-story") || {}).done?.[1],
        lines: [["pi_kidd", "[ride con una pinta di sidro] Saluti dal cielo, bucanieri! Noi voliamo tra le nubi temporalesche, ma l'odore delle vostre gallette al forno si sente fin sopra lo strato della mesosfera. Datemene due sacchi per la cambusa volante!"]]
      },
      {
        id: "pr_carmela",
        zone: "gl_porto",
        at: [6, 12],
        when: (K) => !!(K.otherSaga("ali-di-rondine.pugno") || {}).done?.[1],
        lines: [["pr_carmela", "[guarda il mare con le braccia conserte] Troppa acqua per i miei gusti! A El Paso abbiamo solo polvere e cactus, ma ammetto che la vostra melassa sta benissimo con i miei fagioli messicani. Facciamo affari, capitano?"]]
      }
    ]
  });

  const K = E.K;
  K.RICETTE = RICETTE;

  // ------------------------------------------------------------ IL RICETTARIO CORSARO
  K.ricetta = (id, d, then) => {
    const M = RICETTE[id];
    if (!M) return (then || K.done)();
    K.F.set("gl_r_" + id, true);
    if (d && d.gallette) K.bond("gallette", d.gallette);
    if (d && d.pirateria) K.bond("pirateria", d.pirateria);
    if (d && d.spezie) K.bond("spezie", d.spezie);

    if (!document.getElementById("glCss")) {
      const st = document.createElement("style");
      st.id = "glCss";
      st.textContent = `
.glScroll { position:fixed; inset:0; z-index:270; background:rgba(12,25,44,.8); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Trebuchet MS',serif,sans-serif; }
.glScroll .sheet { width:min(100%,390px); background:#fef3c7; color:#451a03; border:4px double #78350f; box-shadow:10px 10px 0 rgba(0,0,0,.6); padding:16px; border-radius:4px; animation:glPop .35s ease both; position:relative; }
@keyframes glPop { 0%{transform:scale(.7) rotate(-2deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
.glScroll .head { text-align:center; font:900 12.5px sans-serif; text-transform:uppercase; color:#b45309; letter-spacing:1.5px; border-bottom:2px solid #78350f; padding-bottom:4px; }
.glScroll h3 { margin:10px 0 4px; font:900 19px serif; text-align:center; color:#7c2d12; line-height:1.2; text-transform:uppercase; letter-spacing:1px; }
.glScroll .bounty { display:inline-block; border:2px solid #d97706; color:#92400e; font-weight:900; font-size:13.5px; padding:3px 10px; border-radius:4px; margin:6px 0; background:rgba(217,119,6,.1); }
.glScroll p { font-size:13.5px; line-height:1.45; margin:8px 0; color:#573318; }
.glScroll button { width:100%; margin-top:12px; min-height:44px; border:2px solid #78350f; background:#d97706; font:900 14px sans-serif; border-radius:6px; cursor:pointer; color:#fef3c7; text-transform:uppercase; letter-spacing:1px; box-shadow:0 3px 0 #78350f; }
.glScroll button:active { transform:translateY(2px); box-shadow:none; }
`;
      document.head.appendChild(st);
    }

    const ov = document.createElement("div");
    ov.className = "glScroll";
    ov.innerHTML = `
      <div class="sheet">
        <div class="head">${K.esc(M[0])}</div>
        <div style="text-align:center"><span class="bounty">${K.esc(M[1])}</span></div>
        <h3>${K.esc(M[2])}</h3>
        <p>${K.esc(M[3])}</p>
        <button type="button">Arrotola la Pergamena ▸</button>
      </div>
    `;
    document.body.appendChild(ov);
    K.tone(440, 0.4, "triangle", 0.06, 0, 660);
    ov.querySelector("button").onclick = () => {
      ov.remove();
      (then || K.done)();
    };
  };

  // ------------------------------------------------------------ Partita originale Arrembaggio
  K.arrembaggioMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__arrembaggio.start, Object.assign({
      usColor: "#d97706",
      us: "I Bucanieri",
      hero: { name: h.name || "Tu" },
      opp: { name: "Corsari Sottaceto", color: "#1e3a8a", style: "pressing" }
    }, o, {
      done: (r) => {
        if (r && r.quit) K.F.set("gl_lasciato", true);
        if (typeof done === "function") done(r);
      }
    }));
  };

  window.__galletta = E.api;
})();
