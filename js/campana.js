// js/campana.js - «LA NOTTE DEI CENTO RINTOCCHI · IL FURTO DELLA CAMPANA D'ORO» · configurazione della saga su js/saga-core.js
// Giallo / Commedia di Paese scanzonata (ispirata a I Soliti Ignoti, Don Camillo, Lupin III).
// Nel borgo medievale di Rocca Campanaria, alla vigilia del Torneo delle Contrade, la secolare Campana d'Oro sparisce dal campanile!
// Tra furti maldestri, buchi nel muro sbagliato, alibi strampalati e i sospetti del Maresciallo Cacace,
// il Campione deve svelare il mistero e guidare la squadra dell'oratorio al trionfo sotto i rintocchi di mezzanotte.
// Novità di questa saga:
//  - I CENTO RINTOCCHI (js/rintocchi.js): motore originale sul sagrato in ciottoli, con tempismo del rintocco DIN-DON,
//    il Rintoccometro (Sospettometro del Maresciallo), tiri a scasso e il pallonetto Campanile d'Oro.
//  - IL TACCUINO DEGLI ALIBI (K.alibi): verbali comici d'indagine, perizie del maresciallo e fette di salame come prova schiacciante.
//  - ESTETICA MEDIEVALE DI PAESE: campanili merlati, ciottoli di piazza, lanterne a gas, botti di vino e battacchi dorati.
(function () {
  "use strict";
  if (window.__campana || !window.__sagaCore) return;

  const INDIZI = {
    corda: [
      "VERBALE N° 1 · LA CORDA SPEZZATA DEL CAMPANILE",
      "REPERTO: Canapa secolare sfilacciata e tranciata con seghetto da ferro",
      "«IL COLPO AL PRIMO RINTOCCO»",
      "La corda maestra della Campana d'Oro è stata tagliata alle 21:03. Sul posto è stato trovato un bottone d'ottone da giacca di meccanico e una traccia di grasso per ingranaggi."
    ],
    chiave: [
      "VERBALE N° 2 · LA CHIAVE DELLA SACRESTIA",
      "REPERTO: Duplicato grezzo limato a mano in officina da Peppe",
      "«IL BUCO NEL MURO SBAGLIATO»",
      "I ladri volevano entrare dal confessionale, ma hanno bucato la dispensa di Don Crispino divorando quattro barattoli di pesche sciroppate e due salami nostrani."
    ],
    fiasco: [
      "VERBALE N° 3 · IL FIASCO DI VINO DELL'OSTERIA",
      "REPERTO: Fiasco impagliato di Barbera delle Colline con dedica di Rosetta",
      "«L'ALIBI DEL TAVOLINO N° 4»",
      "Tito lo Smilzo giura che all'ora del furto stava giocando a briscola chiamata. Peccato che avesse il battacchio di ricambio nascosto dentro i pantaloni a zampa d'elefante."
    ],
    spartito: [
      "VERBALE N° 4 · LO SPARTITO DEI CENTO RINTOCCHI",
      "REPERTO: Pergamena musicale con le note del maestro campanaro",
      "«LA MELODIA DI MEZZANOTTE»",
      "Chi conosce la sequenza esatta dei rintocchi (Sol-Do-Mi-Fa-Sol) può far risuonare la campana con un tiro al volo perfetto che zittisce l'intero borgo e regala il trionfo."
    ]
  };

  const E = window.__sagaCore.create({
    id: "campana",
    key: "ali-di-rondine.campana",
    title: "La Notte dei Cento Rintocchi · Il Furto della Campana d'Oro",
    icon: "🔔",
    bg: "cp_titolo",
    chapters: 3,
    menuSub: "La sparizione della Campana d'Oro a Rocca Campanaria, i Soliti Ignoti e il rintocco di mezzanotte",
    theme: {
      accent: "#ca8a04",
      ink: "#1e1b4b",
      paper: "rgba(254,249,195,.96)",
      font: "'Trebuchet MS', serif, system-ui",
      chipBg: "#fef08a",
      chipBorder: "#854d0e"
    },
    stats: {
      battacchi: [0, 999, 12, "Battacchi d'Ottone (🔔)"],
      sospetto: [0, 99, 10, "Sospetto del Maresciallo"],
      popolo: [0, 99, 25, "Fiducia del Borgo"]
    },
    travel: true,
    item: ["Battacchio d'Oro", "Battacchi d'Oro"],
    drawItem(g, x, y, i, f) {
      g.save();
      g.translate(x, y + Math.sin(f / 10 + i) * 1.5);
      // Profilo della campana dorata
      g.fillStyle = "#ca8a04";
      g.beginPath();
      g.moveTo(0, -5);
      g.quadraticCurveTo(4, -4, 6, 2);
      g.lineTo(7, 3);
      g.lineTo(-7, 3);
      g.lineTo(-6, 2);
      g.quadraticCurveTo(-4, -4, 0, -5);
      g.closePath();
      g.fill();
      g.strokeStyle = "#713f12";
      g.lineWidth = 1;
      g.stroke();

      // Battacchio inferiore oscillante
      g.fillStyle = "#fef08a";
      const bx = Math.sin(f / 8 + i) * 2;
      g.beginPath();
      g.arc(bx, 4.5, 2, 0, Math.PI * 2);
      g.fill();
      g.stroke();

      // Occhiello superiore
      g.fillStyle = "#854d0e";
      g.fillRect(-1, -6.5, 2, 2);
      g.restore();
    },
    stadium: {
      azPitch: "lizza",
      cageField: 3,
      cageMut: "night",
      weather: "clear",
      venue: {
        ads: [["CAMPANILE DI ROCCA CAMPANARIA", "#ca8a04"], ["OSTERIA DEL SALAME E FIASCO", "#991b1b"], ["OFFICINA PEPPE & TITO", "#1e3a8a"], ["FERRAMENTA SAN FORTUNATO", "#15803d"]],
        crowd: ["#ca8a04", "#854d0e", "#1e1b4b", "#991b1b", "#eab308"],
        ground: ["#27272a", "#18181b"],
        line: "rgba(253,224,71,.65)",
        grid: "rgba(202,138,4,.18)",
        sky: ["#0f172a", "#1e1b4b"],
        wall: ["#3f3f46", "#27272a"],
        fx: { fr: 0.96, spd: 0.98, wind: 0.6 }
      }
    },
    regions: {
      piazza: { grass: ["#27272a", "#18181b", "#09090b"], path: ["#ca8a04", "#854d0e"], stone: ["#3f3f46", "#27272a"], wall: ["#18181b", "#09090b"], water: ["#1e3a8a", "#172554"], tall: "#854d0e", tree: ["#14532d", "#052e16"], tint: "254,240,138", tintA: 0.05, fx: "", dark: 0.04 },
      campanile: { grass: ["#1e1b4b", "#0f172a", "#020617"], path: ["#eab308", "#ca8a04"], stone: ["#334155", "#1e293b"], wall: ["#0f172a", "#020617"], water: ["#1e3a8a", "#0f172a"], tall: "#ca8a04", tree: ["#14532d", "#064e3b"], tint: "253,224,71", tintA: 0.08, fx: "", dark: 0.02 },
      cantina: { grass: ["#3f3f46", "#27272a", "#18181b"], path: ["#b45309", "#92400e"], stone: ["#27272a", "#18181b"], wall: ["#18181b", "#09090b"], water: ["#78350f", "#451a03"], tall: "#78350f", tree: ["#166534", "#14532d"], tint: "254,215,170", tintA: 0.06, fx: "", dark: 0.08 }
    },
    floors: "",
    solid: "SPFTBA#wWCcKk",
    rest: {
      ch: "s",
      label: "Riposa all'Osteria del Salame e Fiasco",
      text: "Ti siedi a una panca di castagno nell'Osteria di Rosetta. Tra un bicchiere di rosso casereccio e una fetta di cacciatorino, la banda dei Soliti Ignoti ripassa gli alibi della notte. (Il gioco salva da solo: consulta qui il Taccuino degli Alibi e i battacchi raccolti.)"
    },
    texts: {
      chestOpen: "Apri la madia di noce intagliata.",
      chestEmpty: "Solo gusci di noci secche e una ragnatela centenaria.",
      nothing: "Solo i ciottoli umidi del sagrato e il rintocco lontano delle ore.",
      noHero: "L'Oratorio di Rocca Campanaria cerca il suo nuovo capitano del sagrato. Crea prima il tuo Campione."
    },
    journal: {
      name: "Il Taccuino degli Alibi",
      sub: "I sospetti, le tracce e i segreti della Campana d'Oro",
      html: (K) => {
        const ks = Object.keys(INDIZI).filter((id) => K.F.is("cp_i_" + id));
        return ks.length
          ? ks.map((id) => `<p style="margin:8px 0;border-bottom:1px dashed #ca8a04;padding-bottom:6px"><small style="color:#ca8a04;font-weight:900">${INDIZI[id][0]}</small><br><b style="color:#854d0e;font-size:14px">${INDIZI[id][2]}</b><br><span style="color:#ca8a04;font-weight:700">${INDIZI[id][1]}</span><br><span style="opacity:.85;font-size:12px">${INDIZI[id][3]}</span></p>`).join("")
          : "<p>Nessun verbale d'indagine ancora annotato sul taccuino.</p>";
      }
    },
    endings: {
      banda: ["I SOLITI IGNOTI GENTILUOMINI", "Proteggi Tito, Peppe e la banda: la Campana d'Oro ricompare misteriosamente in cima al campanile assieme a un fondo segreto per rifare il campo dell'oratorio. Il paese festeggia con fiaschi di vino e ciambelle!", "Serve aver protetto i Soliti Ignoti nel Capitolo 2 e una grande popolarità nel borgo."],
      legge: ["LA RETATA DEL MARESCIALLO", "Consegni ogni indizio al Maresciallo Cacace. La campana viene recuperata in una botte e Cacace stende il verbale più lungo della storia repubblicana tra applausi e strette di mano.", "Serve aver collaborato col Maresciallo e vinto la finale."],
      doncamillo: ["PACE TRA TONACA E FASCIA", "Riconcili Don Crispino e il Sindaco Bellavista davanti a una tavolata di salame e zabaione: la campana suona a festa e il torneo diventa tradizione eterna di Rocca Campanaria.", "Sempre possibile vincendo la finale e mantenendo il bilancio tra Chiesa e Comune."],
      cento: ["IL CENTESIMO RINTOCCO PERFETTO", "Trovi tutti i 12 battacchi d'ottone e trionfi al torneo battendo le contrade al centesimo rintocco esatto di mezzanotte: sei nominato Primo Campanaro Onorario di Rocca Campanaria!", "Segreto: tutti i 12 battacchi d'ottone raccolti e rintoccometro mai scattato al massimo in finale."]
    },
    heroLook: () => ({ bg: ["#fef08a", "#ca8a04"], shirt: "#ca8a04" }),
    heroTitle: (K) => (K.stat("popolo") > 50 ? "il paladino del sagrato di Rocca Campanaria" : "l'investigatore scanzonato dei Soliti Ignoti"),
    act: {
      q: "Entra",
      n: "Leggi il verbale",
      B: "Ispeziona la campana",
      K: "Guarda l'ingranaggio",
      P: "Tira la corda dei rintocchi",
      F: "Annusa la cucina dell'osteria",
      A: "Osserva la statua di San Fortunato",
      "^": "Cambia zona",
      v: "Cambia zona",
      "<": "Cambia zona",
      ">": "Cambia zona"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          B: "La cavità vuota del campanile con la trave di quercia: la secolare Campana d'Oro è stata staccata e calata giù con le funi!",
          K: "Il monumentale ingranaggio dell'orologio pubblico: ruote dentate di bronzo e pendolo oscillante che scandisce il tempo.",
          P: "Una fune di canapa pesante legata a una campana minore: a tirarla, fa risuonare un rintocco cristallino sopra i tetti.",
          F: "La cucina dell'osteria: un camino acceso con paiolo di polenta e una fila di salami appesi ad asciugare al fumo d'alloro.",
          A: "La statua in pietra di San Fortunato: regge un pallone di cuoio benedetto e guarda severo verso il palazzo comunale.",
          T: "Un tavolo di legno d'acero con una scacchiera consumata, fiaschi impagliati e un mazzo di carte piacentine."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      }
    }],
    musicMain: "campana",
    music: {
      campana: {
        bpm: 118,
        chords: ["Am", "Dm", "E7", "Am", "F", "C", "Dm", "E7"],
        lres: 2,
        lw: "triangle",
        lv: 0.06,
        lead: "A4 - C5 - E5 - A5 | G5 - F5 - E5 - D5 | E5 - - - C5 - A4 - | B4 - - - - - - - | C5 - E5 - A5 - - | G5 - E5 - C5 - - | D5 - F5 - E5 - B4 - | A4 - - - - - - -",
        bass: "A2 . . E2 . D2 . E2",
        bv: 0.15,
        arp: "",
        av: 0,
        drum: "k . h s . k h s k . h s . k h h",
        dv: 0.12
      }
    },
    paint: {
      // B: Campana dorata/bronzea
      B(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        // Trave superiore
        g.fillStyle = "#78350f";
        g.fillRect(sx + 2, sy + 1, 12, 3);
        // Profilo campana
        g.fillStyle = "#ca8a04";
        g.beginPath();
        g.moveTo(sx + 8, sy + 4);
        g.lineTo(sx + 12, sy + 11);
        g.lineTo(sx + 13, sy + 13);
        g.lineTo(sx + 3, sy + 13);
        g.lineTo(sx + 4, sy + 11);
        g.closePath();
        g.fill();
        g.fillStyle = "#fef08a";
        g.fillRect(sx + 5, sy + 11, 6, 2);
        // Battacchio
        g.fillStyle = "#451a03";
        g.fillRect(sx + 7, sy + 13, 2, 2);
      },
      // K: Ingranaggio dell'orologio
      K(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#475569";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 6, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#ca8a04";
        g.beginPath();
        g.arc(sx + 8, sy + 8, 4, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#0f172a";
        g.fillRect(sx + 7.5, sy + 4, 1, 4);
        g.fillRect(sx + 7.5, sy + 8, 3, 1);
      },
      // P: Corda con nappa
      P(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#b45309";
        g.fillRect(sx + 7, sy, 2, 11);
        g.fillStyle = "#ca8a04";
        g.beginPath();
        g.arc(sx + 8, sy + 12, 3, 0, Math.PI * 2);
        g.fill();
      },
      // F: Caminetto osteria
      F(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        g.fillStyle = "#3f3f46";
        g.fillRect(sx + 2, sy + 2, 12, 13);
        g.fillStyle = "#18181b";
        g.fillRect(sx + 4, sy + 6, 8, 9);
        g.fillStyle = "#ea580c";
        g.fillRect(sx + 6, sy + 9, 4, 5);
        g.fillStyle = "#fef08a";
        g.fillRect(sx + 7, sy + 11, 2, 2);
      },
      // A: Statua di San Fortunato
      A(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty);
        const g = K.g;
        // Basamento in pietra
        g.fillStyle = "#52525b";
        g.fillRect(sx + 3, sy + 11, 10, 4);
        // Corpo statua
        g.fillStyle = "#a1a1aa";
        g.fillRect(sx + 5, sy + 4, 6, 7);
        // Nimbo dorato
        g.strokeStyle = "#ca8a04";
        g.lineWidth = 1;
        g.strokeRect(sx + 4, sy + 1, 8, 4);
        // Pallone in mano
        g.fillStyle = "#ffffff";
        g.beginPath();
        g.arc(sx + 10, sy + 7, 2, 0, Math.PI * 2);
        g.fill();
      }
    },
    guest: {
      id: "cp_crispino",
      lines: [["cp_crispino", "[scuote le maniche della tonaca e guarda il molo] Che la Provvidenza vi benedica, {n}! Qui a Borgo Marino avete un mare calmo e gente laboriosa. Ma vi manca un bel campanile di trenta metri: quando si fa gol, bisogna far tremare le campane fino all'orizzonte!"]]
    },
    cameos: [
      {
        id: "gl_cannella",
        zone: "cp_osteria",
        at: [12, 6],
        when: (K) => !!(K.otherSaga("ali-di-rondine.galletta") || {}).done?.[1],
        lines: [["gl_cannella", "[assaggia una fetta di salame e annuisce] Mastro fornaio a mastro oste! Questo pane cotto a legna ha una crosta formidabile. Vi lascio un barile di melassa corsara per glassare le ciambelle della festa patronale!"]]
      },
      {
        id: "pr_carmela",
        zone: "cp_piazza",
        at: [6, 14],
        when: (K) => !!(K.otherSaga("ali-di-rondine.pugno") || {}).done?.[1],
        lines: [["pr_carmela", "[fuma una pagliuzza appoggiata alla fontana] A El Paso le campane suonano solo prima dei duelli di mezzogiorno. Ma questo vostro Don Crispino che tira i rigori col fischietto in bocca mi ricorda il vecchio predicatore del Nevada. Un vero duro!"]]
      }
    ]
  });

  const K = E.K;
  K.INDIZI = INDIZI;

  // ------------------------------------------------------------ IL TACCUINO DEGLI ALIBI
  K.alibi = (id, d, then) => {
    const M = INDIZI[id];
    if (!M) return (then || K.done)();
    K.F.set("cp_i_" + id, true);
    if (d && d.battacchi) K.bond("battacchi", d.battacchi);
    if (d && d.sospetto) K.bond("sospetto", d.sospetto);
    if (d && d.popolo) K.bond("popolo", d.popolo);

    if (!document.getElementById("cpCss")) {
      const st = document.createElement("style");
      st.id = "cpCss";
      st.textContent = `
.cpScroll { position:fixed; inset:0; z-index:270; background:rgba(15,23,42,.85); display:flex; align-items:center; justify-content:center; padding:16px; font-family:'Trebuchet MS',serif,sans-serif; }
.cpScroll .sheet { width:min(100%,390px); background:#fef9c3; color:#1e1b4b; border:4px double #854d0e; box-shadow:10px 10px 0 rgba(0,0,0,.6); padding:16px; border-radius:4px; animation:cpPop .35s ease both; position:relative; }
@keyframes cpPop { 0%{transform:scale(.7) rotate(2deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
.cpScroll .head { text-align:center; font:900 12.5px sans-serif; text-transform:uppercase; color:#ca8a04; letter-spacing:1.5px; border-bottom:2px solid #854d0e; padding-bottom:4px; }
.cpScroll h3 { margin:10px 0 4px; font:900 19px serif; text-align:center; color:#713f12; line-height:1.2; text-transform:uppercase; letter-spacing:1px; }
.cpScroll .stamp { display:inline-block; border:2px solid #ca8a04; color:#854d0e; font-weight:900; font-size:13.5px; padding:3px 10px; border-radius:4px; margin:6px 0; background:rgba(202,138,4,.1); }
.cpScroll p { font-size:13.5px; line-height:1.45; margin:8px 0; color:#3f2206; }
.cpScroll button { width:100%; margin-top:12px; min-height:44px; border:2px solid #854d0e; background:#ca8a04; font:900 14px sans-serif; border-radius:6px; cursor:pointer; color:#fef9c3; text-transform:uppercase; letter-spacing:1px; box-shadow:0 3px 0 #713f12; }
.cpScroll button:active { transform:translateY(2px); box-shadow:none; }
`;
      document.head.appendChild(st);
    }

    const ov = document.createElement("div");
    ov.className = "cpScroll";
    ov.innerHTML = `
      <div class="sheet">
        <div class="head">${K.esc(M[0])}</div>
        <div style="text-align:center"><span class="stamp">${K.esc(M[1])}</span></div>
        <h3>${K.esc(M[2])}</h3>
        <p>${K.esc(M[3])}</p>
        <button type="button">Riponi nel Taccuino ▸</button>
      </div>
    `;
    document.body.appendChild(ov);
    K.tone(523.25, 0.4, "triangle", 0.08, 0, 783.99);
    ov.querySelector("button").onclick = () => {
      ov.remove();
      (then || K.done)();
    };
  };

  // ------------------------------------------------------------ Partita originale I Cento Rintocchi
  K.rintocchiMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__rintocchi.start, Object.assign({
      usColor: "#ca8a04",
      us: "I Soliti Ignoti",
      hero: { name: h.name || "Tu" },
      opp: { name: "Contrada del Gufo", color: "#1e3a8a", style: "pressing" }
    }, o, {
      done: (r) => {
        if (r && r.quit) K.F.set("cp_lasciato", true);
        if (typeof done === "function") done(r);
      }
    }));
  };

  window.__campana = E.api;
})();
