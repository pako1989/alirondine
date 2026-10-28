// js/missione.js - «MISSIONE SENZA RITORNO» · configurazione della saga sul motore comune (js/saga-core.js). Ispirata a Mass Effect 2 (e a Quella sporca dozzina).
// Nel Mediterraneo spariscono intere squadre di paese, la notte prima delle finali. Un uomo che fuma davanti a cento schermi, il Signor Fumo di Cerbero, ti dà una nave
// nuova, la Normanna, e un elenco di nomi: recluta i migliori, conquista la loro lealtà, poi attraversa il Passo d'Omega. Da lì non è mai tornato nessuno.
// Tono: ironico di base, capitoli seri; nella notte finale chi vive e chi muore dipende dalle tue scelte (morti fuori scena, niente sangue).
// Dal core: Compagnia (cfg.crew, reclutamento e squadra di due), Rapporti (cfg.bonds), Inventario (cfg.inv), Orologio (cfg.clock), interni a mano, Peso morale (cfg.weight: Esempio e Spregiudicato).
// Minigioco proprio: «Squadra in Pausa» (js/pausa.js, tempo reale con pausa tattica e ruota dei poteri).
// Tessere proprie: M console · P tavolo-mappa · O parapetto · E container · N insegna al neon · K bitta · V bozzolo dei Raccoglitori · pavimenti Q (lamiera della nave) e Y (pista da ballo)
(function () {
  "use strict";
  if (window.__missione || !window.__sagaCore) return;
  const E = window.__sagaCore.create({
    id: "missione", key: "ali-di-rondine.missione", title: "Missione Senza Ritorno", icon: "🚀", bg: "ms_titolo", chapters: 4,
    menuSub: "Squadre che spariscono nella notte, una nave nuova e un elenco di nomi. Recluta, conquista la lealtà di ognuno, poi attraversa il Passo d'Omega: chi torna dipende da te.",
    theme: { accent: "#38bdf8", ink: "#e0f2fe", paper: "rgba(8,16,32,.93)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#0c4a6e", chipBorder: "#38bdf8" },
    stats: { esempio: [0, 12, 0, "Esempio"], spregio: [0, 12, 0, "Spregiudicato"], risorse: [0, 30, 6, "Risorse"] },
    weight: { name: "Reputazione", axes: { esempio: ["Esempio", "🔵"], spregio: ["Spregiudicato", "🔴"] } },
    item: ["Dato di Cerbero", "Dati di Cerbero"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); g.fillStyle = "#0c4a6e"; g.fillRect(-4, -3, 8, 6); g.fillStyle = "#38bdf8"; g.fillRect(-3, -2, 6, 1); g.fillRect(-3, 0, 4, 1); g.globalAlpha = 0.4 + 0.3 * Math.sin(f / 8 + i); g.fillStyle = "#7dd3fc"; g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill(); g.restore(); },
    regions: {
      nave: { grass: ["#3a4656", "#36414f", "#3f4b5c"], path: ["#5a6676", "#56616f"], stone: ["#4b5563", "#454e5b"], wall: ["#1f2937", "#1a2330"], water: ["#1e5a8a", "#1a5280"], tall: "#36414f", tree: ["#2d4a2a", "#3a5e34", "#476f3d"], tint: "120,190,255", tintA: 0.08, fx: "", dark: 0.12 },
      sala: { grass: ["#1e293b", "#1b2536", "#223047"], path: ["#334155", "#2e3a4d"], stone: ["#334155", "#2e3a4d"], wall: ["#0b1220", "#08101c"], water: ["#1e5a8a", "#1a5280"], tall: "#1e293b", tint: "80,170,255", tintA: 0.14, fx: "", dark: 0.18 },
      omega: { grass: ["#2a2633", "#27232f", "#2f2a3a"], path: ["#4a4458", "#443e51"], stone: ["#3a3646", "#353141"], wall: ["#1a1722", "#15121c"], water: ["#1a3a5a", "#173452"], tall: "#2a2633", tree: ["#1f3a2a", "#284a34", "#30553c"], tint: "255,90,190", tintA: 0.1, fx: "rain", dark: 0.22 },
      aldila: { grass: ["#2a1438", "#251232", "#30183f"], path: ["#3b1d4f", "#351a47"], stone: ["#3b1d4f", "#351a47"], wall: ["#12061c", "#0d0414"], water: ["#1a3a5a", "#173452"], tall: "#2a1438", tint: "255,80,200", tintA: 0.18, fx: "", dark: 0.24 },
      lab: { grass: ["#1f3a33", "#1c352e", "#234038"], path: ["#2e5045", "#2a4a40"], stone: ["#2e5045", "#2a4a40"], wall: ["#0d1f1a", "#0a1915"], water: ["#1a3a5a", "#173452"], tall: "#1f3a33", tint: "120,255,190", tintA: 0.12, fx: "", dark: 0.16 },
      carcere: { grass: ["#3f3f46", "#3a3a41", "#46464e"], path: ["#57534e", "#524e49"], stone: ["#52525b", "#4a4a52"], wall: ["#18181b", "#141417"], water: ["#0f2a44", "#0d263e"], tall: "#3f3f46", tint: "255,120,90", tintA: 0.08, fx: "", dark: 0.2 },
      cella: { grass: ["#27272a", "#232326", "#2e2e32"], path: ["#3f3f46", "#3a3a41"], stone: ["#3f3f46", "#3a3a41"], wall: ["#0a0a0b", "#070708"], water: ["#0f2a44", "#0d263e"], tall: "#27272a", tint: "255,90,90", tintA: 0.14, fx: "", dark: 0.28 },
      illio: { grass: ["#6d8f5a", "#668753", "#759862"], path: ["#e7d8b0", "#ddcda4"], stone: ["#d6d3d1", "#cbc8c4"], wall: ["#a8a29e", "#9c9690"], water: ["#38bdf8", "#33b0eb"], tall: "#5a7a4a", tree: ["#2f5a3a", "#3a6a44", "#46784e"], tint: "255,220,150", tintA: 0.08, fx: "", dark: 0 },
      torre: { grass: ["#44403c", "#3f3b37", "#4a4541"], path: ["#78716c", "#716a65"], stone: ["#57534e", "#524e49"], wall: ["#1c1917", "#171412"], water: ["#38bdf8", "#33b0eb"], tall: "#44403c", tint: "250,204,21", tintA: 0.1, fx: "", dark: 0.12 },
      isola: { grass: ["#e7e5e4", "#dedbd9", "#efedec"], path: ["#d6d3d1", "#cfcbc8"], stone: ["#a8a29e", "#a09a95"], wall: ["#78716c", "#716a65"], water: ["#5eead4", "#56e0ca"], tall: "#d6d3d1", tree: ["#a3a3a3", "#b5b5b5", "#9a9a9a"], tint: "255,240,200", tintA: 0.16, fx: "dust", dark: 0 },
      orizzonte: { grass: ["#6b8e4e", "#638647", "#739656"], path: ["#c8b48a", "#bfab80"], stone: ["#a8a29e", "#a09a95"], wall: ["#7c5a3a", "#715234"], water: ["#3b82c4", "#3579ba"], tall: "#5a7a3a", tree: ["#2f5a2a", "#3a6a34", "#46783e"], tint: "255,180,120", tintA: 0.12, fx: "", dark: 0.08 },
      flotta: { grass: ["#7a6a4a", "#726345", "#827150"], path: ["#a0815a", "#977a55"], stone: ["#6b6f78", "#646871"], wall: ["#3b2f22", "#33291d"], water: ["#1d6fa3", "#1a6699"], tall: "#6a5a3a", tree: ["#2f5a3a", "#3a6a44", "#46784e"], tint: "255,190,140", tintA: 0.08, fx: "", dark: 0.08 },
      pragia: { grass: ["#4d5b45", "#47543f", "#53624b"], path: ["#6b6a63", "#64635c"], stone: ["#5b5d61", "#55575b"], wall: ["#2a2c30", "#25272b"], water: ["#34506a", "#304a62"], tall: "#45523c", tree: ["#2a3a2a", "#324532", "#3a4f3a"], tint: "180,200,230", tintA: 0.12, fx: "rain", dark: 0.22 },
      relitto: { grass: ["#1f1d24", "#1b1920", "#24212a"], path: ["#3a2f1f", "#35291b"], stone: ["#2d2a33", "#28252e"], wall: ["#0b0a0e", "#08070a"], water: ["#0a0f1a", "#080c16"], tall: "#1f1d24", tint: "250,180,40", tintA: 0.12, fx: "", dark: 0.34 },
      ponte: { grass: ["#3a3646", "#353141", "#403b4d"], path: ["#5a5468", "#544e61"], stone: ["#4a4458", "#443e51"], wall: ["#1a1722", "#15121c"], water: ["#0e2338", "#0c1f33"], tall: "#3a3646", tint: "255,150,80", tintA: 0.1, fx: "rain", dark: 0.26 }
    },
    floors: "QY", solid: "MPOENKV",
    floorPaint(K, f, sx, sy, tx, ty) {
      const g = K.g;
      if (f === "Q") { // lamiera della nave: piastre con rivetti e una linea guida
        const R = K.ZX.rg, c = (R.stone || ["#4b5563", "#454e5b"])[(tx + ty) % 2]; g.fillStyle = c; g.fillRect(sx, sy, 16, 16);
        g.fillStyle = "rgba(255,255,255,.07)"; g.fillRect(sx, sy, 16, 1); g.fillRect(sx, sy, 1, 16); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(sx, sy + 15, 16, 1); g.fillRect(sx + 15, sy, 1, 16);
        g.fillStyle = "rgba(255,255,255,.22)"; [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => g.fillRect(sx + x, sy + y, 1, 1));
        if (ty % 6 === 3) { g.fillStyle = "rgba(250,204,21,.35)"; g.fillRect(sx, sy + 7, 16, 2); }
        return true;
      }
      if (f === "Y") { // pista da ballo dell'Aldilà: quadri che si accendono a tempo
        const fr = window.__sagaCore.util.frNow(), on = (Math.floor(fr / 20) + tx * 3 + ty * 5) % 4;
        g.fillStyle = ["#7e22ce", "#db2777", "#0ea5e9", "#1e1b4b"][on]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx, sy + 15, 16, 1); g.fillRect(sx + 15, sy, 1, 16);
        g.fillStyle = "rgba(255,255,255,.15)"; g.fillRect(sx + 1, sy + 1, 6, 1); return true;
      }
      return false;
    },
    paint: {
      // console con schermi luminosi e tasti
      M(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 1, sy + 13, 14, 3);
        g.fillStyle = "#1f2937"; g.fillRect(sx + 1, sy + 6, 14, 8); g.fillStyle = "#374151"; g.fillRect(sx + 1, sy + 6, 14, 1);
        g.fillStyle = "#0f172a"; g.fillRect(sx + 2, sy + 1, 12, 6); g.fillStyle = `rgba(56,189,248,${0.55 + 0.25 * Math.sin(fr / 10 + tx)})`; g.fillRect(sx + 3, sy + 2, 10, 4);
        g.fillStyle = "#e0f2fe"; for (let i = 0; i < 3; i++) g.fillRect(sx + 4 + i * 3, sy + 3 + ((fr / 8 + i + tx) % 3 | 0), 2, 1);
        ["#ef4444", "#22c55e", "#facc15"].forEach((c, i) => { g.fillStyle = c; g.fillRect(sx + 3 + i * 4, sy + 10, 2, 2); }); K.light(sx + 8, sy + 4, 22, "56,189,248", 0.25);
      },
      // tavolo-mappa: il Mediterraneo in luce, con i puntini delle squadre sparite
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 13, 8, 3, 0, 0, 7); g.fill();
        g.fillStyle = "#1e293b"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7.5, 5, 0, 0, 7); g.fill(); g.strokeStyle = "#38bdf8"; g.lineWidth = 1; g.stroke();
        g.fillStyle = `rgba(56,189,248,${0.25 + 0.15 * Math.sin(fr / 12)})`; g.beginPath(); g.ellipse(sx + 8, sy + 5, 7, 4, 0, 0, 7); g.fill();
        g.fillStyle = "rgba(186,230,253,.8)"; g.fillRect(sx + 3, sy + 4, 4, 1); g.fillRect(sx + 9, sy + 5, 3, 1); g.fillRect(sx + 6, sy + 3, 2, 1);
        if ((fr / 15 + tx) % 4 < 2) { g.fillStyle = "#f87171"; g.fillRect(sx + 5 + (tx % 3), sy + 4, 1, 1); g.fillRect(sx + 10, sy + 3 + (ty % 2), 1, 1); }
        K.light(sx + 8, sy + 6, 30, "56,189,248", 0.35);
      },
      // parapetto di bordo (sopra il mare)
      O(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#1a5280"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + ((fr / 3 + tx * 5) % 16), sy + 10 + (ty % 2) * 3, 4, 1);
        g.fillStyle = "#64748b"; g.fillRect(sx, sy + 2, 16, 2); g.fillRect(sx, sy + 7, 16, 1); g.fillStyle = "#94a3b8"; g.fillRect(sx, sy + 2, 16, 1); g.fillStyle = "#475569"; g.fillRect(sx + 2, sy + 2, 2, 8); g.fillRect(sx + 12, sy + 2, 2, 8);
      },
      // pila di container ondulati
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, c = ["#b91c1c", "#1d4ed8", "#047857", "#b45309"][(tx * 3 + ty) % 4]; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 15, 2);
        g.fillStyle = c; g.fillRect(sx, sy, 16, 14); g.fillStyle = "rgba(0,0,0,.22)"; for (let i = 1; i < 16; i += 3) g.fillRect(sx + i, sy, 1, 14); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx, sy + 7, 16, 1);
      },
      // insegna al neon su palo
      N(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, col = ["255,60,180", "56,189,248", "250,204,21"][(tx + ty) % 3], on = Math.sin(fr / 9 + tx * 2) > -0.85;
        g.fillStyle = "#1f2937"; g.fillRect(sx + 7, sy + 6, 2, 10); g.fillStyle = "#111827"; g.fillRect(sx + 1, sy - 2, 14, 8);
        g.fillStyle = on ? `rgb(${col})` : "#3f3f46"; g.fillRect(sx + 3, sy, 10, 1); g.fillRect(sx + 3, sy + 3, 7, 1); g.fillRect(sx + 2, sy, 1, 4);
        if (on) K.light(sx + 8, sy + 2, 34, col, 0.45);
      },
      // bozzolo d'oro dei Raccoglitori: guscio a scaglie che pulsa piano
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, p = 0.5 + 0.5 * Math.sin(fr / 14 + tx * 1.7 + ty); g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 6, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#3b2f12"; g.beginPath(); g.ellipse(sx + 8, sy + 7, 5.5, 8, 0, 0, 7); g.fill(); g.strokeStyle = "#a16207"; g.lineWidth = 1; g.stroke();
        g.fillStyle = `rgba(250,204,21,${0.25 + 0.35 * p})`; for (let i = 0; i < 4; i++) g.fillRect(sx + 5 + (i % 2) * 4, sy + 2 + i * 3, 3, 1); K.light(sx + 8, sy + 7, 18, "250,204,21", 0.15 + 0.2 * p);
      },
      // bitta d'ormeggio con la cima
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 13, 6, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#334155"; g.fillRect(sx + 4, sy + 6, 8, 8); g.fillStyle = "#475569"; g.beginPath(); g.ellipse(sx + 8, sy + 6, 5, 2.4, 0, 0, 7); g.fill();
        g.strokeStyle = "#d6b97a"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(sx + 4, sy + 9); g.bezierCurveTo(sx - 2, sy + 12, sx - 4, sy + 6, sx - 8, sy + 9); g.stroke();
      }
    },
    act: { V: "Guarda il bozzolo", M: "Guarda la console", P: "Guarda la mappa", O: "Guarda il mare", E: "Guarda i container", N: "Guarda l'insegna", K: "Guarda la bitta", n: "Leggi il cartello", x: "Apri la cassa", s: "Riposa un momento", q: "Entra" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi. La nave ronza, il gioco salva da solo. Dal menu puoi rileggere il Dossier della Missione." },
    texts: { nothing: "Niente di utile. Solo ruggine, cavi e promesse di Cerbero.", noHero: "Il Signor Fumo vuole un nome sul contratto. Crea prima il tuo Campione.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Qualcuno di Cerbero è passato prima di te." },
    journal: { name: "Il Dossier della Missione", sub: "Squadra, lealtà, nave e finali" },
    crew: {
      name: "La squadra della Normanna", field: 2,
      members: {
        ms_miranda: { n: "Miranda Lauro", icon: "🕸️", role: "Operativa di Cerbero", d: "Perfetta in tutto, tranne che a perdere. Ti ha rimesso in piedi, e te lo ricorda.", s: { guida: 3, tecnica: 1 }, pow: "rete" },
        ms_jacopo: { n: "Jacopo Tessa", icon: "🛡️", role: "Ex carabiniere", d: "L'unico onesto a bordo. Dice le cose in faccia e le ripete, nel caso.", s: { guida: 2, barriera: 1 }, pow: "scudo" },
        ms_mordini: { n: "Prof. Mordini", icon: "🫧", role: "Scienziato dei materiali", d: "Parla a raffica, canta operetta, ha un'opinione su tutto. Spesso giusta.", s: { tecnica: 2, barriera: 1 }, pow: "schiuma" },
        ms_garro: { n: "Garro «Arcangelo»", icon: "🎯", role: "Ex giudice di porta", d: "Ha smesso di fischiare e ha iniziato a mirare. Sta sempre calibrando qualcosa.", s: { guida: 2, tecnica: 1 }, pow: "tiro" },
        ms_zero: { n: "Zero", icon: "💥", role: "Ex ultrà, ex detenuta", d: "Tatuata fino alle orecchie, arrabbiata fino ai piedi. Spinge le cose con la sola presenza.", s: { barriera: 3 }, pow: "onda" },
        ms_tali: { n: "Tali", icon: "🛸", role: "Ingegnera della Flotta", d: "Non toglie mai il casco. Ripara un motore cantando e lo fa volare piangendo.", s: { tecnica: 3 }, pow: "drone" },
        ms_tano: { n: "Tano", icon: "🗡️", role: "Ex sicario, portiere di riserva", d: "Prega prima di ogni lavoro. Para, quando nessuno guarda, come un santo.", s: { tecnica: 1, barriera: 1 }, pow: "ombra" },
        ms_legione: { n: "Legione", icon: "📡", role: "Macchina che dice «noi»", d: "Un robot da allenamento abbandonato che parla al plurale. Non si sa quanti siano.", s: { tecnica: 3, guida: 1 }, pow: "hack" }
      }
    },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Colleghi", "Compagni", "Fidati", "Famiglia di bordo"],
      scenes: {
        ms_miranda: [{ lv: 2, id: "mir2", lines: [["ms_miranda", "Sai cosa vuol dire essere progettata per vincere? Che ogni sconfitta è un errore di fabbrica."], ["ms_miranda", "[pensa] Tu perdi e ti rialzi. Non è nel mio manuale. Lo sto leggendo da te."]], reward: (K) => K.bond("esempio", 1) },
          { lv: 3, id: "mir3", prize: "+2 Risorse dal conto di Cerbero", lines: [["ms_miranda", "Ho un conto di Cerbero che il Signor Fumo non controlla. Ce l'ha chiunque lavori per lui da abbastanza."], ["ms_miranda", "[furbo] Due casse di materiali. Non chiedere. Lui non chiede a me."]], reward: (K) => K.bond("risorse", 2) }],
        ms_zero: [{ lv: 2, id: "zer2", lines: [["ms_zero", "Sai perché mi chiamano Zero? Perché il primo processo è finito con zero testimoni a favore. Non uno."], ["ms_zero", "[pensa] Tu sei il primo che non mi chiede cosa ho fatto. Mi chiedi cosa voglio fare. È strano. Non smettere."]], reward: (K) => K.bond("spregio", 1) }],
        ms_tali: [{ lv: 2, id: "tal2", lines: [["ms_tali", "Sulla Flotta si dice: «una nave è casa finché galleggia». Mio padre la diceva sempre. Poi ha smesso di tornare a casa."], ["ms_tali", "[felice] La Normanna galleggia bene. Ho controllato. Tre volte. Non dirlo a Jolly."]], reward: (K) => K.bond("esempio", 1) }],
        ms_tano: [{ lv: 2, id: "tan2", lines: [["ms_tano", "Ho un figlio. Ha trent'anni, fa il vigile a Porto Illio. Non gli ho mai detto cosa facevo. Lui lo sa lo stesso."], ["ms_tano", "[triste] Le parate, gliele ho insegnate io. L'unica cosa pulita che gli ho dato."]], reward: (K) => K.bond("esempio", 1) }],
        ms_garro: [{ lv: 2, id: "gar2", lines: [["ms_garro", "Sai perché ho smesso di fare il giudice di porta? Ho visto un gol fantasma e l'ho convalidato. Poi ho visto chi pagava."], ["ms_garro", "[serio] Da quel giorno non convalido più niente. Miro."]], reward: (K) => K.bond("spregio", 1) },
          { lv: 3, id: "gar3", prize: "+1 Esempio e la bandierina di Garro", lines: [["ms_garro", "La mia bandierina da giudice. L'ho alzata una volta sola, quella sbagliata."], ["ms_garro", "[felice] Tienila tu. Quando la alzerai, sarà per la cosa giusta. Io intanto calibro."]], reward: (K) => K.bond("esempio", 1) }]
      }
    },
    inv: {
      items: {
        ms_taccuino: { n: "Taccuino di Mordini", icon: "📓", d: "Formule, schizzi di palloni e il testo di un'operetta. A margine: «ricordarsi di mangiare».", gift: { ms_mordini: 10 }, giftAny: 1, react: { ms_mordini: "Il mio taccuino! Pagina 40, la formula. Pagina 41, l'operetta. Entrambe incompiute. Ottimo." } },
        ms_mappa: { n: "Piantina del ponte", icon: "🗺️", d: "Il ponte dove si è barricato Arcangelo, con tre bande segnate in tre colori. E una scritta: «non pagano mai il terzo».", gift: { ms_garro: 6, ms_miranda: 3 }, giftAny: 1 },
        ms_birra: { n: "Bottiglia dell'Aldilà", icon: "🍾", d: "Liquore blu che si accende quando lo apri. Aria la offre solo a chi le deve un favore. O a chi lo riscuote.", gift: { ms_jacopo: 5, ms_garro: 6, ms_zero: 8 }, giftAny: 2, react: { ms_garro: "Blu dell'Aldilà. Ricordi, rimpianti e un retrogusto di benzina. Grazie." } },
        ms_dati: { n: "Dati di Rael", icon: "💾", d: "Le ricerche del padre di Tali sui Raccoglitori: frequenze, rotte, una parola cerchiata tre volte. Valgono una fortuna per Cerbero e un'eredità per la Flotta.", gift: { ms_tali: 0 }, giftAny: 0 },
        ms_rosario: { n: "Rosario di Tano", icon: "📿", d: "Un rosario di legno consumato. Tano lo stringe prima di ogni lavoro e dopo ogni parata. Dice che non serve a niente. Lo stringe lo stesso.", gift: { ms_tano: 10 }, giftAny: 1, react: { ms_tano: "Lo avevo lasciato sulla torre. Credevo fosse un segno. Forse lo era: sei tu che me lo riporti." } },
        ms_foto: { n: "Foto della vecchia Normanna", icon: "🖼️", d: "La squadra sul ponte della prima Normanna, due anni fa. Qualcuno ride. Qualcuno non c'è più.", gift: { ms_jacopo: 8, ms_miranda: 2 }, giftAny: 1 }
      }
    },
    clock: { slots: ["Mattina", "Pomeriggio", "Notte"], hud: true, tint: [null, "rgba(255,170,90,.06)", "rgba(20,30,90,.2)"], onSlot(K, giorno, fascia, nome) { return nome === "Notte" ? [["voce", "Notte. Da qualche parte nel Mediterraneo, uno spogliatoio resta vuoto."]] : null; } },
    endings: {
      tutti: ["Nessuno Resta Indietro", "Tutta la squadra torna dal Passo d'Omega. La Normanna rientra in porto con le luci accese e la radio a volume indecente.", "Finisci la missione senza perdere nessuno."],
      prezzo: ["Il Prezzo del Passo", "La missione riesce, ma qualcuno non torna. Alla Normanna resta una sedia vuota per ognuno, e nessuno ha il coraggio di toglierla.", "Finisci la missione perdendo almeno un compagno."],
      solo: ["L'Ultimo a Bordo", "Segreto: torni da solo. La missione è compiuta, la nave è silenziosa e il Signor Fumo ti chiama per congratularsi.", "Segreto: finisci la missione e non torna nessun compagno."],
      cerbero: ["La Tana a Cerbero", "Consegni la Tana dei Raccoglitori al Signor Fumo. Avrà il suo potere. Tu avrai la tua nave. Nessuno avrà la coscienza pulita.", "Nell'ultima scelta, dai la Tana a Cerbero."]
    },
    heroLook: () => ({ bg: ["#0c4a6e", "#7dd3fc"], shirt: "#1e3a5f" }),
    heroTitle: () => "comandante della Normanna",
    musicMain: "normanna",
    music: { normanna: { bpm: 92, chords: ["Am", "F", "C", "G", "Am", "F", "G", "E"], lres: 2, lw: "sawtooth", lv: 0.03,
      lead: "A4 - - C5 - - E5 - | D5 - - C5 - - B4 - | A4 - - C5 - - G5 - | E5 - - - - - - - | F5 - - E5 - - D5 - | C5 - - B4 - - A4 - | B4 - - C5 - - D5 - | E5 - - - B4 - - -",
      bass: "R . . . R . . 5 R . . . R . 5 .", bv: 0.1, arp: "1 5 8 5 1 5 8 5", aw: "triangle", av: 0.014, drum: "k . . h s . . h k . k h s . . h", dv: 0.09 } },
    guide: () => [["⏸ Squadra in Pausa", "Negli scontri tocchi un nemico per calciargli un pallone e tocchi il terreno per spostarti. «⏸ Ruota» ferma il tempo: scegli il potere di un compagno e tocca il bersaglio. Porti due compagni: scegli chi dal menu (⚔️ Schiera la compagnia)."], ["🔵🔴 Esempio e Spregiudicato", "Le risposte importanti alzano Esempio (fare la cosa giusta) o Spregiudicato (fare la cosa che funziona). Alcune scelte si aprono solo con abbastanza punti."]],
    party: (K) => (K.crew ? K.crew.field().slice(0, 2) : []),
    cameos: []
  });
  window.__missioneH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      // scelta con Peso morale: w {esempio|spregio: n}, need {asse: n}
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f2937", skin: "#e0b890" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(8,16,32,.9)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#38bdf8"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#bae6fd"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); },
      // squadra per il minigioco: i due compagni schierati, con il loro potere
      mates: () => K.crew.field().slice(0, 2).map((id) => { const m = K.crew.members[id]; return { id, n: m.n.replace(/ «.*»/, ""), icon: m.icon, pow: m.pow }; }),
      // scontro «Squadra in Pausa»: cb({win})
      fight(o, cb) { K.say(H.flush().concat([["voce", "Scegli bene chi porti: ognuno ha un potere diverso nella Ruota."]]), () => K.ownMatch(window.__pausa.start, Object.assign({ mates: H.mates() }, o, { bonus: Math.min(3, K.F.get("ms_upg", 0) + (o.bonus | 0)), done: (r) => cb(r || {}) }))); },
      people() {
        H.cast("ms_fumo", "Il Signor Fumo", "Direttore di Cerbero", { style: "slick", hair: "#4b5563", shirt: "#1f2937", skin: "#d9b48f", eye: "#38bdf8", acc: ["occhiali"], bg: ["#0f172a", "#f59e0b"] }, "Dirige Cerbero, un'agenzia che compra squadre, stadi e segreti. Fuma davanti a cento schermi e parla come se ognuno fosse un investimento. Ti ha dato una nave: non per bontà.");
        H.cast("ms_miranda", "Miranda Lauro", "Operativa di Cerbero", { style: "long", hair: "#1c1917", shirt: "#f8fafc", skin: "#e8c4a0", eye: "#1e40af", bg: ["#0c4a6e", "#e0f2fe"] }, "Cresciuta per essere la migliore in tutto, dal salto in alto al bilancio aziendale. Ti ha rimesso in piedi dopo il naufragio della prima Normanna, e tiene il conto di ogni punto di sutura.");
        H.cast("ms_jacopo", "Jacopo Tessa", "Ex carabiniere", { style: "buzz", hair: "#1c1917", shirt: "#1e3a5f", skin: "#8d5a3b", bg: ["#1e3a5f", "#bae6fd"] }, "Ha lasciato l'Arma per un caso che nessuno voleva chiudere. Lavora per Cerbero perché paga e perché vuole sapere dove finiscono le squadre. Onesto fino alla noia, ed è un complimento.");
        H.cast("ms_jolly", "Jolly", "Pilota della Normanna", { style: "short", hair: "#a16207", shirt: "#1e293b", skin: "#f1d1b0", acc: ["cappellino"], beard: "pizzetto", bg: ["#1e293b", "#fde68a"] }, "Il miglior pilota del Mediterraneo, a suo dire anche il più simpatico. Non scende mai dalla plancia: dice che è un fatto di fedeltà, i maligni dicono di menisco.");
        H.cast("ms_edi", "EDI", "La voce della nave", { shape: "nuvola", skin: "#38bdf8", shirt: "#0ea5e9", eye: "#e0f2fe", hair: "#7dd3fc", bg: ["#082f49", "#7dd3fc"] }, "L'intelligenza della Normanna. Parla dalle casse con voce gentile e precisione inquietante. Jolly la odia. Lei lo trova «statisticamente divertente».");
        H.cast("ms_aria", "Aria", "Regina di Porto Omega", { style: "slick", hair: "#7e22ce", shirt: "#4c1d95", skin: "#c4b5fd", eye: "#facc15", bg: ["#2e1065", "#f0abfc"] }, "Comanda Porto Omega dal balcone dell'Aldilà. Una sola regola: non fare arrabbiare Aria. Le altre regole sono note a piè di pagina.");
        H.cast("ms_mordini", "Prof. Mordini", "Scienziato dei materiali", { style: "bald", hair: "#9ca3af", shirt: "#f8fafc", skin: "#e8d0b0", eye: "#16a34a", acc: ["occhiali"], bg: ["#14532d", "#bbf7d0"] }, "Ha inventato tre palloni, due colle e un'operetta in quattro atti. Parla a raffica, senza articoli, come se il tempo stesse per finire. Forse lo sa.");
        H.cast("ms_garro", "Garro «Arcangelo»", "Ex giudice di porta", { style: "spiky", hair: "#475569", shirt: "#1e40af", skin: "#c8a07a", eye: "#93c5fd", acc: ["visiera"], scar: true, bg: ["#1e3a8a", "#bfdbfe"] }, "Ex giudice di porta della Serie Minore. Dopo un gol fantasma pagato a peso d'oro ha appeso la bandierina e preso un fucile da segnalazione. A Porto Omega lo chiamano Arcangelo. Sta sempre calibrando.");
        H.cast("ms_recluta", "Il Reclutatore", "Banco dei mercenari", { style: "short", hair: "#78350f", shirt: "#3f3f46", skin: "#d9a679", beard: "incolta", bg: ["#27272a", "#fca5a5"] }, "Arruola chiunque abbia due braccia e un debito. Paga a cottimo, mai in anticipo, e non chiede mai il nome. Lo dimenticherebbe comunque.");
        H.cast("ms_barista", "Il Barista dell'Aldilà", "Bancone principale", { style: "codino", hair: "#f472b6", shirt: "#111827", skin: "#e8c4a0", bg: ["#4a044e", "#f9a8d4"] }, "Conosce tutti i nomi e ne dice pochissimi. Il suo cocktail più famoso si chiama «Domani».");
        H.cast("ms_vecchio", "Nonno Pietro", "Pescatore del molo", { style: "bald", hair: "#e5e7eb", shirt: "#7c2d12", skin: "#c8956a", beard: "folta", acc: ["paglia"], bg: ["#431407", "#fed7aa"] }, "Pesca dal molo di Omega da prima che fosse Omega. La sua squadra, i Vecchi Gabbiani, è sparita la notte prima della finale dei veterani.");
        H.cast("ms_cinzia", "Cinzia", "Assistente di Mordini", { style: "bob", hair: "#16a34a", shirt: "#ecfdf5", skin: "#e8c4a0", acc: ["occhiali"], bg: ["#064e3b", "#a7f3d0"] }, "Assistente del laboratorio. Ha imparato a parlare veloce come il Professore per sopravvivere alle riunioni.");
      }
    };
    return H;
  };
  window.__missione = E.api; window.__missioneCore = E;
})();
