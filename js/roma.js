// js/roma.js - «AVE CALCIO! · I GLADIATORI DEL PALLONE» · configurazione della saga sul motore comune (js/saga-core.js)
// Saga storica comica nell'Antica Roma: ludi circensi, sabbia dorata, senatori imbroglioni e gladiatori filosofi.
// Nel 75 d.C., le folle di Roma non acclamano solo i gladiatori armati di gladio, ma i grandi campioni del Circo del Cuoio.
// Tu sei il Legionario dal Piede Alato, scambiato per errore con uno schiavo e gettato nell'arena di sabbia.
// Novità di questa saga:
//  - CIRCO MASSIMO (js/circo.js): la partita originale gladiatoria con campo ovale a spina monumentale centrale,
//    scatti a biga, muri di scudi nei contrasti e tiri a catapulta.
//  - GLI EDITTI IMPERIALI (K.editto): decreti su pergamena romana con sigillo di cera S.P.Q.R. e corona d'alloro.
//  - ESTETICA CLASSICA: colonne scanalate, bracieri di fiamma viva, statue imperiali e mosaici.
(function () {
  "use strict";
  if (window.__roma || !window.__sagaCore) return;

  const EDITTI = {
    ingaggio: [
      "SENATUS POPULUSQUE ROMANUS · EDITTO I",
      "LUDUS SUBURRAE · SESTERZI: 50 HS",
      "«IL LEGIONARIO DAL PIEDE ALATO»",
      "Per decreto del Senatore Furbio Cacasenno, il forestiero è arruolato d'ufficio nei ludi circensi. Chiunque contrasti fallosamente subirà cinque frustate di salvia selvatica."
    ],
    terme: [
      "DECRETO DEI MAGISTRATI DELLE ACQUE",
      "BAGNI DI CARACALLA · GLORIA +20",
      "«LE TERME DEI CAMPIONI»",
      "Accesso consentito solo ai gladiatori del pallone che hanno superato il test di galleggiamento. Vietato lanciare la palla nella vasca del calidarium."
    ],
    finale: [
      "PROCLAMA SOLENNE DI CESARE",
      "LUDI MAXIMI · IL COLOSSEO ACCLAMA",
      "«LA RESA DEI CONTI SULLA SABBIA»",
      "La finale tra la Plebe di Spartaco e i Pretoriani Imperiali. Chi alza la Coppa d'Alloro riceve la cittadinanza perpetua e dieci anfore di vino pregiato."
    ]
  };

  const E = window.__sagaCore.create({
    id: "roma",
    key: "ali-di-rondine.roma",
    title: "Ave Calcio! · I Gladiatori del Pallone",
    icon: "🏛️",
    bg: "rm_titolo",
    chapters: 3,
    menuSub: "Ludi circensi, sabbia dorata e gladiatori del pallone nell'Urbe del 75 d.C.",
    theme: {
      accent: "#b91c1c",
      ink: "#451a03",
      paper: "rgba(254,243,199,.96)",
      font: "'Trebuchet MS', serif, system-ui",
      chipBg: "#fef3c7",
      chipBorder: "#b91c1c"
    },
    stats: {
      sesterzi: [0, 999, 50, "Sesterzi (HS)"],
      gloria: [0, 99, 10, "Gloria dell'Arena"],
      cesare: [0, 99, 20, "Favore di Cesare"]
    },
    travel: true,
    item: ["Foglia d'Alloro", "Foglie d'Alloro"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      g.fillStyle = "#15803d";
      g.beginPath();
      g.ellipse(0, 0, 3, 7, 0.4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#eab308";
      g.beginPath();
      g.arc(0, 0, 1.5, 0, Math.PI * 2);
      g.fill();
      g.restore();
    },
    stadium: {
      azPitch: "lizza",
      cageField: 3,
      cageMut: "heavy",
      weather: "dust",
      venue: {
        ads: [["GARUM UMBRICIO", "#b91c1c"], ["TERME DI TITO", "#0284c7"], ["VINO FALERNO", "#78350f"], ["S.P.Q.R.", "#eab308"]],
        crowd: ["#fef3c7", "#b91c1c", "#fde047", "#78350f", "#451a03"],
        ground: ["#d97706", "#b45309"],
        line: "rgba(254,243,199,.6)",
        grid: "rgba(180,83,9,.15)",
        tint: "rgba(185,28,28,.08)",
        glow: "234,179,8",
        sky: ["#f97316", "#fed7aa"],
        wall: ["#78350f", "#451a03"],
        fx: { fr: 0.88, spd: 0.90, wind: 1.1 }
      }
    },
    regions: {
      suburra: { grass: ["#b45309", "#92400e", "#78350f"], path: ["#fed7aa", "#d97706"], stone: ["#78350f", "#451a03"], wall: ["#451a03", "#270f03"], water: ["#0284c7", "#0369a1"], tall: "#b45309", tree: ["#15803d", "#166534"], tint: "254,243,199", tintA: 0.08, fx: "dust", dark: 0 },
      terme: { grass: ["#e2e8f0", "#cbd5e1", "#94a3b8"], path: ["#f8fafc", "#e2e8f0"], stone: ["#64748b", "#475569"], wall: ["#334155", "#1e293b"], water: ["#38bdf8", "#0284c7"], tall: "#cbd5e1", tree: ["#166534", "#14532d"], tint: "224,242,254", tintA: 0.06, fx: "", dark: 0.01 },
      colosseo: { grass: ["#d97706", "#b45309", "#92400e"], path: ["#fef3c7", "#fed7aa"], stone: ["#78350f", "#451a03"], wall: ["#451a03", "#29140c"], water: ["#0284c7", "#0369a1"], tall: "#d97706", tree: ["#15803d", "#166534"], tint: "254,215,170", tintA: 0.1, fx: "dust", dark: 0 }
    },
    floors: "",
    solid: "SPFTBA#wWCc",
    rest: {
      ch: "s",
      label: "Riposa all'Osteria della Suburra",
      text: "Ti siedi su una panca di pietra consumata all'Osteria del Falerno. Un oste versa una coppa di mosto fresco mentre Spartaco canticchia un poema epico. (Il gioco salva da solo: qui puoi consultare gli Editti di Cesare.)"
    },
    texts: {
      chestOpen: "Apri l'anfora cerchiata in bronzo.",
      chestEmpty: "Solo gusci di noci e un vecchio sandalo di cuoio rotto.",
      nothing: "Solo cocci di ceramica romana e foglie d'alloro secche.",
      noHero: "L'Urbe cerca il suo miglior centravanti dell'arena. Crea prima il tuo Campione."
    },
    journal: {
      name: "Gli Editti di Cesare",
      sub: "I proclami e le vittorie dell'Urbe",
      html: (K) => {
        const ks = Object.keys(EDITTI).filter((id) => K.F.is("rm_e_" + id));
        return ks.length
          ? ks.map((id) => `<p style="margin:8px 0;border-bottom:1px dashed #b91c1c;padding-bottom:6px"><small style="color:#b91c1c;font-weight:900">${EDITTI[id][0]}</small><br><b style="color:#78350f;font-size:14px">${EDITTI[id][2]}</b><br><span style="color:#b45309;font-weight:700">${EDITTI[id][1]}</span><br><span style="opacity:.85;font-size:12px">${EDITTI[id][3]}</span></p>`).join("")
          : "<p>Nessun editto affisso alle colonne del foro.</p>";
      }
    },
    endings: {
      tribuno: ["IL TRIBUNO DELLA PLEBE", "Rifiuti le cariche imperiali e usi la tua vittoria per donare il pane e lo sport a tutti i rioni della Suburra. Cesare ti nomina Tribuno Perpetuo del Pallone.", "Serve aver scelto la plebe nel Capitolo 2 e vinto la finale."],
      console: ["IL CONSOLE DELL'ARENA", "Accetti il patto del Senatore Furbio: entri in Senato con la corona d'alloro e la toga d'oro, guidando la politica romana dal cerchio di centrocampo.", "Serve allearsi con Furbio e avere almeno 300 sesterzi."],
      libero: ["IL GLADIATORE ERRANTE", "Rifiuti sia il Senato che l'oro: lasci lo scarpino chiodato sull'altare di Mercurio e parti per le Gallie alla ricerca di nuovi campetti da scoprire.", "Sempre possibile vincendo la finale senza piegarsi al potere."],
      segreto: ["L'ALLORO D'ORO DEGLI DEI", "Risolvi l'antico indovinello della Sibilla Augusta e trovi l'antico Pallone degli Dei forgiato da Vulcano sotto l'arco di trionfo.", "Segreto: tutte le foglie d'alloro raccolte e il favore massimo di Cesare."]
    },
    heroLook: () => ({ bg: ["#fef3c7", "#b91c1c"], shirt: "#b91c1c" }),
    heroTitle: (K) => (K.stat("cesare") > 60 ? "il gladiatore prediletto di Cesare" : "il centravanti trace dell'Urbe"),
    act: {
      q: "Entra",
      n: "Leggi l'editto",
      S: "Ammira la statua",
      C: "Guarda la colonna",
      B: "Scaldati al braciere",
      A: "Guarda l'anfora",
      E: "Guarda lo scudo",
      "^": "Cambia zona",
      v: "Cambia zona",
      "<": "Cambia zona",
      ">": "Cambia zona"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          S: "Una statua di marmo raffigurante Giulio Cesare mentre calcia al volo con la toga sollevata.",
          C: "Una maestosa colonna di travertino con capitello corinzio. C'è inciso: «Dribblare est humanum».",
          B: "Un braciere di bronzo con fiamme vive che diffondono profumo d'incenso e alloro bruciato.",
          A: "Un'anfora di terracotta sigillata con pece. Odora di vino Falerno d'annata e cannella.",
          E: "Uno scudo rotondo in bronzo con l'aquila romana impressa a sbalzo. È ammaccato da mille contrasti."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      }
    }],
    musicMain: "roma",
    music: {
      roma: {
        bpm: 120,
        chords: ["Dm", "Bb", "C", "Dm", "F", "Gm", "A7", "Dm"],
        lres: 2,
        lw: "sawtooth",
        lv: 0.04,
        lead: "D4 - - - F4 - A4 - | D5 - - - E5 - D5 - | C5 - - - A4 - - - | F4 - - - G4 - A4 - | D5 - - - F5 - E5 - | D5 - C5 - Bb4 - - - | A4 - - - - - - - | D4 - - - - - - -",
        bass: "D2 . . A2 . F2 . A2",
        bv: 0.12,
        arp: "",
        av: 0,
        drum: "k . h s . k h s k . h s . k h h",
        dv: 0.12
      }
    },
    paint: {
      // Colonna di marmo
      C(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#e2e8f0";
        g.fillRect(sx + 5, sy + 2, 6, 12);
        g.fillStyle = "#cbd5e1";
        g.fillRect(sx + 3, sy, 10, 3);
        g.fillRect(sx + 3, sy + 13, 10, 3);
      },
      // Braciere di fuoco
      B(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#78350f";
        g.fillRect(sx + 4, sy + 8, 8, 7);
        g.fillStyle = "#f59e0b";
        const fY = (fr % 20) / 5;
        g.beginPath(); g.arc(sx + 8, sy + 6 - fY, 3.5, 0, 7); g.fill();
        g.fillStyle = "#ef4444";
        g.beginPath(); g.arc(sx + 8, sy + 7, 2.5, 0, 7); g.fill();
      },
      // Statua imperiale
      S(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#94a3b8";
        g.fillRect(sx + 4, sy + 10, 8, 6);
        g.fillStyle = "#f8fafc";
        g.fillRect(sx + 6, sy + 4, 4, 7);
        g.beginPath(); g.arc(sx + 8, sy + 2.5, 2.5, 0, 7); g.fill();
      },
      // Anfora di vino
      A(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#b45309";
        g.beginPath(); g.arc(sx + 8, sy + 9, 4.5, 0, 7); g.fill();
        g.fillRect(sx + 6, sy + 3, 4, 4);
      },
      // Scudo
      E(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#ca8a04";
        g.beginPath(); g.arc(sx + 8, sy + 8, 6, 0, 7); g.fill();
        g.strokeStyle = "#451a03"; g.lineWidth = 1; g.stroke();
        g.fillStyle = "#b91c1c";
        g.beginPath(); g.arc(sx + 8, sy + 8, 2.5, 0, 7); g.fill();
      }
    },
    guest: {
      id: "rm_spartaco",
      lines: [["rm_spartaco", "[alza lo scudo con fierezza] {n}! Mmmh, che pace qui al Borgo Marino. Ho visto i marinai calciare una palla sul cemento senza corazze né gladii di legno. Mi sono commosso. Se serve un difensore centrale che fermi i pirati, basta un fischio!"]]
    },
    cameos: [
      {
        id: "pr_sceriffo",
        zone: "rm_suburra",
        at: [10, 14],
        when: (K) => !!(K.otherSaga("ali-di-rondine.pugno") || {}).done?.[1],
        lines: [["pr_sceriffo", "[mastica lo stecchino] Per tutti i coyote... Questi romani con le toghe e i sandali calciano come tori imbizzarriti. Ho visto uno scudo volare sopra la traversa!"]]
      },
      {
        id: "bm_boris",
        zone: "rm_terme",
        at: [6, 8],
        when: (K) => !!(K.otherSaga("ali-di-rondine.montagna") || {}).done?.[1],
        lines: [["bm_boris", "[in accappatoio e colbacco] Boris ha portato cioccolata calda nelle terme di Cesare! I senatori ci inzuppano il pane azzimo e dicono: 'Mirabile est!' Boris approva!"]]
      }
    ]
  });

  const K = E.K;
  K.EDITTI = EDITTI;

  // ------------------------------------------------------------ EDITTO IMPERIALE
  K.editto = (id, d, then) => {
    const T = EDITTI[id];
    if (!T) return (then || K.done)();
    K.F.set("rm_e_" + id, true);
    if (d && d.sesterzi) K.bond("sesterzi", d.sesterzi);
    if (d && d.gloria) K.bond("gloria", d.gloria);
    if (d && d.cesare) K.bond("cesare", d.cesare);

    if (!document.getElementById("rmCss")) {
      const st = document.createElement("style");
      st.id = "rmCss";
      st.textContent = `
.rmEditto { position:fixed; inset:0; z-index:270; background:rgba(26,14,5,.75); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Trebuchet MS',serif,sans-serif; }
.rmEditto .sheet { width:min(100%,390px); background:#fef3c7; color:#451a03; border:4px double #b91c1c; box-shadow:10px 10px 0 rgba(0,0,0,.6); padding:16px; border-radius:4px; animation:rmPop .35s ease both; position:relative; }
@keyframes rmPop { 0%{transform:scale(.7) rotate(2deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
.rmEditto .head { text-align:center; font:900 13px sans-serif; text-transform:uppercase; color:#b91c1c; letter-spacing:2px; border-bottom:2px solid #b45309; padding-bottom:4px; }
.rmEditto h3 { margin:10px 0 4px; font:900 20px serif; text-align:center; color:#78350f; line-height:1.2; text-transform:uppercase; }
.rmEditto .badge { display:inline-block; border:2px solid #b91c1c; color:#b91c1c; font-weight:900; font-size:13px; padding:3px 10px; border-radius:4px; margin:6px 0; }
.rmEditto p { font-size:13.5px; line-height:1.45; margin:8px 0; color:#573318; }
.rmEditto button { width:100%; margin-top:12px; min-height:44px; border:2px solid #78350f; background:#b91c1c; font:900 14px sans-serif; border-radius:6px; cursor:pointer; color:#fef3c7; text-transform:uppercase; letter-spacing:1px; box-shadow:0 3px 0 #78350f; }
.rmEditto button:active { transform:translateY(2px); box-shadow:none; }
`;
      document.head.appendChild(st);
    }

    const ov = document.createElement("div");
    ov.className = "rmEditto";
    ov.innerHTML = `
      <div class="sheet">
        <div class="head">${K.esc(T[0])}</div>
        <div style="text-align:center"><span class="badge">${K.esc(T[1])}</span></div>
        <h3>${K.esc(T[2])}</h3>
        <p>${K.esc(T[3])}</p>
        <button type="button">Bacia il Sigillo e Accetta ▸</button>
      </div>
    `;
    document.body.appendChild(ov);
    K.tone(550, 0.4, "sawtooth", 0.08, 0, 660);
    ov.querySelector("button").onclick = () => {
      ov.remove();
      (then || K.done)();
    };
  };

  // ------------------------------------------------------------ Partita originale Circo
  K.circoMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__circo.start, Object.assign({
      usColor: "#b91c1c",
      us: "Gladiatori S.P.Q.R.",
      hero: { name: h.name || "Tu" },
      opp: { name: "I Pretoriani", color: "#854d0e", style: "pressing" }
    }, o, {
      done: (r) => {
        if (r && r.quit) K.F.set("rm_lasciato", true);
        if (typeof done === "function") done(r);
      }
    }));
  };

  window.__roma = E.api;
})();
