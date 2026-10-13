// js/pugno.js - «PER UN PUGNO DI RIGORI» · configurazione della saga sul motore comune (js/saga-core.js)
// Saga Spaghetti Western: polvere, sole cocente, duelli dal dischetto a mezzogiorno, saloon e banditi.
// Nel villaggio sperduto di El Paso del Rigore, le dispute territoriali tra i rancheros, i banditi e la legge
// non si risolvono a revolverate ma a colpi di rigore: "Quando un uomo con gli scarpini incontra un uomo con i guanti
// di cuoio, l'uomo con gli scarpini è un uomo che calcia." Tu sei il Pistolero Forestiero giunto a dorso di mulo.
// Novità di questa saga:
//  - STANGATA (js/stangata.js): il motore di duello di rigori originale con tamburo revolver a 6 colpi,
//    barra di tensione e quick-draw al rintocco della campana di mezzogiorno.
//  - I MANIFESTI WANTED (K.manifesto): volantini d'epoca bruciacchiati con taglie in dollari ($), capi d'accusa comici
//    e reputazione che cambia tra Legge e Desperados.
//  - ESTETICA WESTERN: cactus giganti, saloon con porte a vento, botti di sarsaparilla, teschi di toro e polvere rossa.
(function () {
  "use strict";
  if (window.__pugno || !window.__sagaCore) return;

  const MANIFESTI = {
    arrivo: [
      "WANTED · RICERCATO PER SCONFINAMENTO",
      "TAGLIA: 100 $ · VIVO O CALCIATORE",
      "«IL PISTOLERO FORESTIERO»",
      "Accusato di porto abusivo di scarpini chiodati e tiro a effetto non autorizzato nella contea di El Paso del Rigore. Lo Sceriffo Cooper promette una ricompensa in fagioli e dollari."
    ],
    locanda: [
      "AVVISO PUBBLICO DEL SALOON «EL PALO»",
      "TAGLIA: 250 $ · RISARCIMENTO DANNI",
      "«IL FUORICLASSE DEL DISCHETTO»",
      "Ha sfondato con una bordata al sette una botte d'annata di Carmela. Ramon 'Sette Tiri' lo sfida a un duello dal dischetto nel Canyon Rosso."
    ],
    patto: [
      "MESSAGGIO SEGRETO DEI DESPERADOS",
      "TAGLIA: 500 $ · PERICOLO PUBBLICO",
      "«L'ALLEANZA DEL DISCHETTO»",
      "I banditi del canyon offrono la spartizione del Totem di San Silvestro. Lo Sceriffo mette in guardia: chi tradisce la legge finisce a pulire la polvere dagli spalti."
    ],
    finale: [
      "MANIFESTO DELLA SFIDA A MEZZOGIORNO",
      "TAGLIA: 1000 $ · COPPA DI RIO BRAVO",
      "«MEZZOGIORNO DI FUOCO AL FORTINO»",
      "Gli otto migliori tiratori del West si affrontano nel fortino di pietra. Chi segna l'ultimo rigore alza la Coppa d'Oro e detta legge su tutto il territorio."
    ]
  };

  const E = window.__sagaCore.create({
    id: "pugno",
    key: "ali-di-rondine.pugno",
    title: "Per un pugno di rigori",
    icon: "🤠",
    bg: "pr_titolo",
    chapters: 3,
    menuSub: "Polvere, speroni e duelli dal dischetto a mezzogiorno nel villaggio di El Paso del Rigore",
    theme: {
      accent: "#ea580c",
      ink: "#451a03",
      paper: "rgba(254,243,199,.96)",
      font: "'Trebuchet MS', serif, system-ui",
      chipBg: "#fef3c7",
      chipBorder: "#78350f"
    },
    stats: {
      taglia: [0, 999, 100, "Taglia ($)"],
      legge: [0, 99, 10, "Fiducia Legge"],
      freddezza: [0, 99, 20, "Sangue Freddo"]
    },
    travel: true,
    item: ["Ferro di Cavallo", "Ferri di Cavallo"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.strokeStyle = "#cbd5e1";
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(0, 0, 5, 0.4, Math.PI - 0.4, true);
      g.stroke();
      g.fillStyle = "#fef08a";
      g.beginPath();
      g.arc(0, -1, 1.5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "terra",
      cageField: 2,
      cageMut: "dust",
      weather: "wind",
      venue: {
        ads: [["SALOON EL PALO", "#b45309"], ["BARNABA BECCHINO", "#1c1917"], ["FAGIOLI CARMELA", "#c2410c"], ["SCERIFFO COOPER", "#eab308"]],
        crowd: ["#78350f", "#b45309", "#d97706", "#451a03", "#9a3412"],
        ground: ["#b45309", "#78350f"],
        line: "rgba(254,243,199,.5)",
        grid: "rgba(120,53,15,.15)",
        tint: "rgba(234,88,12,.08)",
        glow: "249,115,22",
        sky: ["#c2410c", "#f97316"],
        wall: ["#78350f", "#451a03"],
        fx: { fr: 0.92, spd: 0.95, wind: 1.3 }
      }
    },
    regions: {
      cittadina: { grass: ["#b45309", "#92400e", "#78350f"], path: ["#d97706", "#b45309"], stone: ["#78350f", "#451a03"], wall: ["#451a03", "#270f03"], water: ["#0284c7", "#0369a1"], tall: "#b45309", tree: ["#15803d", "#166534"], tint: "254,215,170", tintA: 0.08, fx: "dust", dark: 0 },
      saloon: { grass: ["#78350f", "#572b0b", "#451a03"], path: ["#92400e", "#78350f"], stone: ["#451a03", "#29140c"], wall: ["#29140c", "#1c0d06"], water: ["#d97706", "#b45309"], tall: "#78350f", tree: ["#166534", "#14532d"], tint: "254,243,199", tintA: 0.06, fx: "", dark: 0.02 },
      canyon: { grass: ["#9a3412", "#7c2d12", "#6c280f"], path: ["#c2410c", "#9a3412"], stone: ["#6c280f", "#451a03"], wall: ["#451a03", "#270f03"], water: ["#0284c7", "#0369a1"], tall: "#9a3412", tree: ["#15803d", "#14532d"], tint: "249,115,22", tintA: 0.1, fx: "dust", dark: 0.01 },
      fortino: { grass: ["#b45309", "#92400e", "#78350f"], path: ["#d97706", "#b45309"], stone: ["#78350f", "#451a03"], wall: ["#451a03", "#270f03"], water: ["#0284c7", "#0369a1"], tall: "#b45309", tree: ["#166534", "#14532d"], tint: "254,215,170", tintA: 0.08, fx: "dust", dark: 0 }
    },
    floors: "",
    solid: "SPFTBA#wWCc",
    rest: {
      ch: "s",
      label: "Riposa al bancone del Saloon",
      text: "Ti appoggi al bancone di legno consumato del Saloon El Palo. Carmela versa un bicchiere di sarsaparilla fresca mentre il pianoforte a rulli suona una melodia malinconica. (Il gioco salva da solo: qui puoi consultare i Manifesti Wanted della contea.)"
    },
    texts: {
      chestOpen: "Apri la bisaccia di cuoio.",
      chestEmpty: "Solo sabbia del deserto e una vecchia stella di latta spuntata.",
      nothing: "Solo cespugli di rotolacampo che volano nel vento.",
      noHero: "El Paso del Rigore cerca il suo miglior tiratore. Crea prima il tuo Campione."
    },
    journal: {
      name: "I Manifesti WANTED",
      sub: "Le taglie e le sentenze di El Paso",
      html: (K) => {
        const ks = Object.keys(MANIFESTI).filter((id) => K.F.is("pr_m_" + id));
        return ks.length
          ? ks.map((id) => `<p style="margin:8px 0;border-bottom:1px dashed #b45309;padding-bottom:6px"><small style="color:#b45309;font-weight:900">${MANIFESTI[id][0]}</small><br><b style="color:#7c2d12;font-size:14px">${MANIFESTI[id][2]}</b><br><span style="color:#b45309;font-weight:700">${MANIFESTI[id][1]}</span><br><span style="opacity:.85;font-size:12px">${MANIFESTI[id][3]}</span></p>`).join("")
          : "<p>Nessun manifesto affisso al palo della forca.</p>";
      }
    },
    endings: {
      sceriffo: ["LA STELLA DI LATTA", "Accetti la proposta di Cooper e appunti la stella di latta al petto. Diventi il nuovo custode della legge sportiva di El Paso, difendendo la contea con rigori infallibili.", "Serve aver scelto la via della legge nel Capitolo 2 e vinto il duello finale."],
      desperado: ["IL BANDITO DEL DISCHETTO", "Ti unisci alla banda di Ramon e cavalchi verso il tramonto coi sacchi di dobloni vinti sul campo. Il tuo nome finisce sui manifesti di tutti i saloon del West.", "Serve aver stretto il patto con Ramon e una taglia superiore a 300 $."],
      solitario: ["IL CAVALIERE SOLITARIO", "Rifiuti sia la stella che l'oro. Lasci il pallone di cuoio sul palo della porta e riparti verso l'orizzonte al fischio del vento, leggenda senza padrone.", "Sempre possibile vincendo la finale senza piegarsi né allo sceriffo né ai banditi."],
      segreto: ["L'ORO DI SAN SILVESTRO", "Scopri l'antico forziere sepolto sotto il dischetto del rigore: conteneva il primo pallone d'oro massiccio fuso dai padri fondatori di Rio Bravo.", "Segreto: tutti i ferri di cavallo raccolti, sangue freddo al massimo e 5 vittorie nei duelli."]
    },
    heroLook: () => ({ bg: ["#fef3c7", "#ea580c"], shirt: "#ea580c" }),
    heroTitle: (K) => (K.stat("taglia") > 300 ? "il pistolero più ricercato del West" : "il centravanti dal dischetto di El Paso"),
    act: {
      q: "Entra",
      n: "Leggi il manifesto",
      S: "Guarda lo steccato",
      C: "Ammira il cactus",
      B: "Guarda la botte",
      T: "Guarda il teschio",
      P: "Ascolta il pianoforte",
      W: "Esplora la carovana",
      "^": "Cambia zona",
      v: "Cambia zona",
      "<": "Cambia zona",
      ">": "Cambia zona"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          S: "Uno steccato in legno arso dal sole. Un cartello recita: «Legare i muli e non calciare contro le assi».",
          C: "Un gigantesco cactus saguaro con spine lunghe come chiodi. Qualcuno ha infilzato un vecchio pallone sgonfio su un ramo.",
          B: "Una botte cerchiata in ferro con la scritta: «Sarsaparilla della Carmela - garantita 100% senza veleno di serpente».",
          T: "Un teschio di toro sbiancato dalla canicola, piantato sopra un palo come monito per i tiratori imprecisi.",
          P: "Un pianoforte a muro scordato. I tasti suonano da soli una marcetta da saloon se ci soffi sopra la polvere.",
          W: "Una carovana di legno con telone bianco rattoppato. Dentro ci sono casse di calce per segnare i dischetti."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      }
    }],
    musicMain: "pugno",
    music: {
      pugno: {
        bpm: 116,
        chords: ["Am", "Dm", "E7", "Am", "F", "C", "Dm", "E7"],
        lres: 2,
        lw: "sawtooth",
        lv: 0.04,
        lead: "A4 - - - C5 - E5 - | D5 - - - F5 - D5 - | E5 - - - B4 - G#4 - | A4 - - - - - - - | F4 - - - A4 - C5 - | G4 - - - C5 - E5 - | D5 - F5 - D5 - B4 - | E5 - - - - - - -",
        bass: "A2 . . E2 . D2 . E2",
        bv: 0.12,
        arp: "",
        av: 0,
        drum: "k . h s . k h s k . h s . k h h",
        dv: 0.12
      }
    },
    paint: {
      // Steccato del ranch
      S(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 1, sy + 3, 14, 3);
        g.fillRect(sx + 1, sy + 9, 14, 3);
        g.fillStyle = "#451a03";
        g.fillRect(sx + 3, sy, 3, 16);
        g.fillRect(sx + 10, sy, 3, 16);
      },
      // Cactus Saguaro
      C(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#15803d";
        g.fillRect(sx + 6, sy + 1, 4, 15);
        g.fillRect(sx + 2, sy + 6, 4, 3);
        g.fillRect(sx + 2, sy + 3, 3, 4);
        g.fillRect(sx + 10, sy + 8, 4, 3);
        g.fillRect(sx + 11, sy + 4, 3, 5);
      },
      // Botte di sarsaparilla
      B(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 3, sy + 2, 10, 12);
        g.fillStyle = "#1c1917";
        g.fillRect(sx + 3, sy + 4, 10, 2);
        g.fillRect(sx + 3, sy + 10, 10, 2);
      },
      // Teschio di toro
      T(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 7, sy + 8, 2, 8);
        g.fillStyle = "#fef3c7";
        g.fillRect(sx + 5, sy + 4, 6, 6);
        g.fillStyle = "#e2e8f0";
        // Corna
        g.beginPath();
        g.moveTo(sx + 3, sy + 2); g.lineTo(sx + 5, sy + 5);
        g.moveTo(sx + 13, sy + 2); g.lineTo(sx + 11, sy + 5);
        g.strokeStyle = "#cbd5e1";
        g.lineWidth = 1.2;
        g.stroke();
      },
      // Carovana dei pionieri
      W(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#fef3c7";
        g.fillRect(sx + 2, sy + 2, 12, 7);
        g.fillStyle = "#78350f";
        g.fillRect(sx + 1, sy + 9, 14, 4);
        g.fillStyle = "#1c1917";
        g.beginPath(); g.arc(sx + 4, sy + 13, 2.5, 0, 7); g.fill();
        g.beginPath(); g.arc(sx + 12, sy + 13, 2.5, 0, 7); g.fill();
      },
      // Pianoforte a muro del saloon
      P(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#451a03";
        g.fillRect(sx + 2, sy + 1, 12, 14);
        g.fillStyle = "#fef3c7";
        g.fillRect(sx + 3, sy + 8, 10, 3);
        g.fillStyle = "#1c1917";
        g.fillRect(sx + 4, sy + 8, 2, 2);
        g.fillRect(sx + 7, sy + 8, 2, 2);
        g.fillRect(sx + 10, sy + 8, 2, 2);
      }
    },
    guest: {
      id: "pr_sceriffo",
      lines: [["pr_sceriffo", "[mastica lo stecchino] {n}! Mmmh... aria di mare e salsedine al posto della polvere. Ma dimmi una cosa: qui a Borgo Marino se due pescatori litigano per una sardina, com'è che non tirano cinque rigori dal molo a mezzogiorno? Gente strana questi marinai."]]
    },
    cameos: [
      {
        id: "bm_boris",
        zone: "pr_saloon",
        at: [12, 8],
        when: (K) => !!(K.otherSaga("ali-di-rondine.montagna") || {}).done?.[1],
        lines: [["bm_boris", "[felice con colbacco] Boris è sceso quaggiù con la carovana delle nove! Boris ha portato cioccolata calda alpina ma qui fa quaranta gradi. Allora Boris ci mette ghiaccio e vende 'Frappé del Deserto'! Carmela approva!"]]
      },
      {
        id: "cs_baldo",
        zone: "pr_cittadina",
        at: [6, 11],
        when: (K) => !!(K.otherSaga("ali-di-rondine.cavallo") || {}).done?.[1],
        lines: [["cs_baldo", "[ride] Ih-oh! Che ambientazione! Perfetta per il mio prossimo film: 'Un Cavallo per un Dollaro Bucato'! Mi hanno solo detto di non pascolare vicino ai cactus."]]
      }
    ]
  });

  const K = E.K;
  K.MANIFESTI = MANIFESTI;

  // ------------------------------------------------------------ IL MANIFESTO WANTED
  K.manifesto = (id, d, then) => {
    const M = MANIFESTI[id];
    if (!M) return (then || K.done)();
    K.F.set("pr_m_" + id, true);
    if (d && d.taglia) K.bond("taglia", d.taglia);
    if (d && d.legge) K.bond("legge", d.legge);
    if (d && d.freddezza) K.bond("freddezza", d.freddezza);

    if (!document.getElementById("prCss")) {
      const st = document.createElement("style");
      st.id = "prCss";
      st.textContent = `
.prWanted { position:fixed; inset:0; z-index:270; background:rgba(28,16,11,.75); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Trebuchet MS',serif,sans-serif; }
.prWanted .sheet { width:min(100%,390px); background:#fef3c7; color:#451a03; border:4px double #78350f; box-shadow:10px 10px 0 rgba(0,0,0,.5); padding:16px; border-radius:4px; animation:prPop .35s ease both; position:relative; }
@keyframes prPop { 0%{transform:scale(.7) rotate(-2deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
.prWanted .head { text-align:center; font:900 13px sans-serif; text-transform:uppercase; color:#9a3412; letter-spacing:2px; border-bottom:2px solid #78350f; padding-bottom:4px; }
.prWanted h3 { margin:10px 0 4px; font:900 20px serif; text-align:center; color:#7c2d12; line-height:1.2; text-transform:uppercase; letter-spacing:1px; }
.prWanted .bounty { display:inline-block; border:2px solid #b91c1c; color:#b91c1c; font-weight:900; font-size:14px; padding:3px 10px; border-radius:4px; transform:rotate(-2deg); margin:6px 0; }
.prWanted p { font-size:13.5px; line-height:1.45; margin:8px 0; color:#573318; }
.prWanted button { width:100%; margin-top:12px; min-height:44px; border:2px solid #78350f; background:#ea580c; font:900 14px sans-serif; border-radius:6px; cursor:pointer; color:#fef3c7; text-transform:uppercase; letter-spacing:1px; box-shadow:0 3px 0 #78350f; }
.prWanted button:active { transform:translateY(2px); box-shadow:none; }
`;
      document.head.appendChild(st);
    }

    const ov = document.createElement("div");
    ov.className = "prWanted";
    ov.innerHTML = `
      <div class="sheet">
        <div class="head">${K.esc(M[0])}</div>
        <div style="text-align:center"><span class="bounty">${K.esc(M[1])}</span></div>
        <h3>${K.esc(M[2])}</h3>
        <p>${K.esc(M[3])}</p>
        <button type="button">Strappa il Manifesto ▸</button>
      </div>
    `;
    document.body.appendChild(ov);
    K.tone(440, 0.4, "triangle", 0.06, 0, 660);
    ov.querySelector("button").onclick = () => {
      ov.remove();
      (then || K.done)();
    };
  };

  // ------------------------------------------------------------ Partita originale Stangata
  K.stangataMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__stangata.start, Object.assign({
      usColor: "#ea580c",
      us: "Il Gringo",
      hero: { name: h.name || "Tu" },
      opp: { name: "I Desperados", color: "#78350f", style: "pressing" }
    }, o, {
      done: (r) => {
        if (r && r.quit) K.F.set("pr_lasciato", true);
        if (typeof done === "function") done(r);
      }
    }));
  };

  window.__pugno = E.api;
})();
