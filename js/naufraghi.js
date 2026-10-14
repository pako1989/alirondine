// js/naufraghi.js - NAUFRAGHI DEL PALLONE · configurazione della saga sul motore comune (js/saga-core.js)
// Mistero con ironia (e qualche momento serio), nello spirito delle serie TV sulle isole che nascondono qualcosa e delle
// avventure di mare a colori d'acquerello. L'aereo della squadra dei Rondine fa un atterraggio d'emergenza su un'isola che non
// è sulle carte. Un'isola tropicale, un faro acceso da qualcuno, una voce nella radio che chiede di giocare. Tutto inventato.
// Novità di questa saga (oltre a quelle del motore comune):
//  - MAREA (js/marea.js): la partita originale, con un motore suo. Il campo è fatto di celle che si allagano mentre si gioca:
//    si tocca per passare, si trascina per tirare, si tocca una cella per alzare una pedana. Segna prima che sparisca la tua metà.
//  - GIORNO, NOTTE E MAREA (K.fase, K.marea): un orologio dell'isola che cambia la mappa. Con la bassa marea compaiono le secche,
//    di notte si accendono le pietre di plancton luminoso. Le zone si aprono e si chiudono mentre ci cammini (spec.mare).
//    Dal menu della zona si può passare il tempo (K.aspetta).
//  - IL GIORNALE DI BORDO (K.pagina): le pagine ritrovate, che finiscono nel diario.
// Salvataggio proprio: ali-di-rondine.naufraghi. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__naufraghi || !window.__sagaCore) return;

  // le pagine del Giornale di Bordo: id → [titolo, testo]
  const PAGINE = {
    volo: ["Volo Rondine 7", "Partenza alle 02:10, rotta di casa dopo il torneo. Cielo sereno, panini al prosciutto, nessun problema segnalato. Ultima riga, a penna: «Il pilota automatico ha una opinione sua.»"],
    inventario: ["L'inventario di Gaspare", "212 noccioline. 40 bottigliette d'acqua. 18 maglie di riserva. 3 palloni (uno è un cocco, ma non sa di esserlo). 1 radio di bordo: da ritrovare."],
    impronte: ["Impronte sulla sabbia", "Scarpe da ginnastica, taglia 43, dirette verso la giungla. Ogni tanto si fermano e fanno mezzo giro: come qualcuno che si filma."],
    radio: ["La frequenza 91,4", "Di giorno solo fruscio. Di notte, una voce. Chiede sempre la stessa cosa."],
    marea: ["La marea dell'isola", "Qui la marea non segue la luna. Sale e scende con un ritmo tutto suo, come un respiro lento. Le secche si aprono di giorno, le pietre luminose di notte."],
    video: ["I video di Tobia", "Quattordici notti di riprese. In ogni inquadratura l'acqua fa la stessa cosa alla stessa ora. Sul bordo di un fotogramma, una scritta fatta con le pietre: «GIOCA».", ],
    faro: ["Il faro", "La luce gira da sola. Qualcuno ci tiene l'olio, i vetri puliti, la radio accesa. Nessuno vuole dire chi."],
    gabbiani: ["Il campo dei Gabbiani", "Tende ordinate, fuochi spenti con cura, una lavagna con un calendario fermo. L'ultima data scritta è di tanto tempo fa."],
    maglia: ["La maglia sbiadita", "Una maglia dei Rondine, vecchia di una generazione, appesa al sole ad asciugare. Il numero è lo stesso del tuo."],
    cocco: ["Il pallone di cocco", "Un cocco levigato per anni, cucito con la fibra delle palme. Rotola meglio di quelli veri."],
  };

  // l'orologio dell'isola: un ciclo di 150 secondi. alba · giorno · tramonto · notte; la marea è bassa di giorno e alta di sera
  const CICLO = 150000, T_ALBA = 0, T_GIORNO = 0.12, T_TRAM = 0.52, T_NOTTE = 0.66;
  let T0 = performance.now() - 0.25 * CICLO, CONGELATO = null, BANNER = null;
  const tFase = () => (CONGELATO != null ? CONGELATO : (((performance.now() - T0) % CICLO) + CICLO) % CICLO / CICLO);
  const nomeFase = (t) => (t < T_GIORNO ? "alba" : t < T_TRAM ? "giorno" : t < T_NOTTE ? "tramonto" : "notte");
  const inizioFase = { alba: T_ALBA, giorno: T_GIORNO, tramonto: T_TRAM, notte: T_NOTTE };

  // l'acqua (usata anche dalle pietre di plancton)
  function acqua(K, sx, sy, tx, ty, fr, noFoam) {
    const g = K.g, P = K.P, R = K.ZX.rg, night = K.fase() === "notte", tram = K.fase() === "tramonto";
    P(sx, sy, 16, 16, night ? ["#0a2a4c", "#0c3358"][(tx + ty) % 2] : R.water[(tx + ty) % 2]);
    const o = (fr / 3 + tx * 5 + ty * 3) % 16;
    if (!night) { P(sx + o - 4, sy + 4 + (ty % 2) * 6, 6, 1, tram ? "rgba(255,220,180,.4)" : "rgba(255,255,255,.35)"); P(sx + ((o + 8) % 16) - 3, sy + 11, 4, 1, "rgba(255,255,255,.22)"); }
    if (!noFoam) {
      const A = (dx, dy) => K.at(tx + dx, ty + dy), land = (c) => c !== undefined && c !== "w" && c !== "h";
      const f = night ? "rgba(150,255,235,.45)" : "rgba(255,255,255,.55)";
      if (land(A(0, -1))) P(sx, sy, 16, 2, f); if (land(A(0, 1))) P(sx, sy + 14, 16, 2, f); if (land(A(-1, 0))) P(sx, sy, 2, 16, f); if (land(A(1, 0))) P(sx + 14, sy, 2, 16, f);
    }
    if (night) {
      const h = K.hash(tx * 31 + ty * 17);
      for (let i = 0; i < 3; i++) { const a = 0.25 + 0.6 * Math.max(0, Math.sin(fr / 38 + h * 0.013 + i * 2.1)); P(sx + ((h >> (i * 3)) % 14), sy + ((h >> (i * 2 + 1)) % 14), 1, 1, `rgba(120,255,230,${a})`); }
      if (h % 6 === 0) K.light(sx + 8, sy + 8, 14, "60,255,210", 0.22 + 0.16 * Math.sin(fr / 30 + h));
    }
  }

  const E = window.__sagaCore.create({
    id: "naufraghi", key: "ali-di-rondine.naufraghi", title: "Naufraghi del Pallone", icon: "🏝️", bg: "nf_titolo", chapters: 3,
    menuSub: "L'aereo dei Rondine cade su un'isola che non è sulle carte. Una voce alla radio, un faro acceso, un campo che sparisce con la marea",
    theme: { accent: "#2dd4bf", ink: "#0b3b45", paper: "rgba(236,253,245,.96)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#ecfdf5ee", chipBorder: "#0f766e" },
    stats: { fiducia: [0, 99, 20, "Fiducia del gruppo"], rispetto: [0, 99, 0, "Rispetto dei Gabbiani"], voce: [0, 99, 0, "Sintonia con la Voce"] },
    travel: true,
    item: ["Conchiglia dell'isola", "Conchiglie dell'isola"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 10 + i) * 1.4);
      g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(0, 0, 1, 0, 0, 9); gr.addColorStop(0, "rgba(150,255,235,.45)"); gr.addColorStop(1, "rgba(150,255,235,0)"); g.fillStyle = gr; g.fillRect(-9, -9, 18, 18); g.globalCompositeOperation = "source-over";
      g.fillStyle = ["#fda4af", "#fcd34d", "#a5f3fc"][i % 3]; g.beginPath(); g.moveTo(-6, 3); g.quadraticCurveTo(-7, -6, 0, -7); g.quadraticCurveTo(7, -6, 6, 3); g.closePath(); g.fill();
      g.strokeStyle = "rgba(0,0,0,.28)"; g.lineWidth = 0.8; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(0, 3); g.lineTo(k * 2.4, -6); g.stroke(); }
      g.fillStyle = "#fff7ed"; g.fillRect(-3, 3, 6, 2); g.restore();
    },
    stadium: {
      azPitch: "spiaggia", cageField: 2, cageMut: "wet", weather: "clear",
      venue: {
        ads: [["RONDINE AIRLINES · VOLI DI RITORNO", "#0ea5e9"], ["BAR DEL COCCO · ISOLA NESSUNA", "#16a34a"], ["FARO DI PUNTA CIECA", "#f59e0b"], ["COPPA MAREA", "#14b8a6"]],
        crowd: ["#fde68a", "#fb923c", "#34d399", "#38bdf8", "#f9a8d4"],
        ground: ["#e7d3a0", "#dcc78f"], line: "rgba(255,255,255,.85)", grid: "rgba(20,184,166,.14)", tint: "255,236,190", glow: "255,222,160",
        sky: ["#7dd3fc", "#fde68a"], wall: ["#a16207", "#854d0e"], fx: { fr: 0.95, spd: 0.95, wind: 0.4 }
      }
    },
    regions: {
      isola: { grass: ["#e8d9a6", "#e3d29c", "#ecdcae"], path: ["#c9b383", "#bfa877"], stone: ["#9aa5a8", "#8f9a9e"], wall: ["#6f6e66", "#63625a"], water: ["#35b8c8", "#46c4d2"], tall: "#6fae52", tree: ["#2f7a3a", "#3f9a48", "#6cc35a"], tint: "255,236,190", tintA: 0.06, fx: "", dark: 0 },
      giungla: { grass: ["#5c8f3a", "#548736", "#639a40"], path: ["#a98f5a", "#9d834f"], stone: ["#7a8a72", "#70806a"], wall: ["#4a5a3a", "#3f4f31"], water: ["#2f9aa8", "#3aa6b2"], tall: "#78b84a", tree: ["#1f5a2e", "#2c7a3a", "#4aa04a"], tint: "190,255,170", tintA: 0.09, fx: "fireflies", dark: 0.1 },
      faro: { grass: ["#d3c08f", "#cdb985", "#d9c697"], path: ["#b8a577", "#ae9b6d"], stone: ["#a9a49a", "#9f9a90"], wall: ["#7a746a", "#6e685e"], water: ["#2fa6c4", "#3db2cc"], tall: "#7fae5a", tree: ["#2f7a3a", "#3f9a48", "#6cc35a"], tint: "255,226,180", tintA: 0.07, fx: "", dark: 0.02 },
      interno: { grass: ["#cdb58a", "#c6ae82", "#d3bc92"], path: ["#b49c70", "#ab9368"], stone: ["#a8a094", "#9e968a"], wall: ["#6b5a46", "#5f4f3d"], water: ["#2fa6c4", "#3db2cc"], tall: "#8a8a6a", tint: "255,214,160", tintA: 0.08, fx: "dust", dark: 0.04 },
      stadio: { grass: ["#e1d0a2", "#dbc99a", "#e7d6a9"], path: ["#bfae84", "#b5a47a"], stone: ["#c8b98f", "#bfb085"], wall: ["#8d7b5a", "#816f50"], water: ["#35b8c8", "#46c4d2"], tall: "#6fae52", tree: ["#2f7a3a", "#3f9a48", "#6cc35a"], tint: "255,232,180", tintA: 0.07, fx: "", dark: 0.02 },
    },
    floors: "kmh", solid: "AEJRFCS",
    // il campo di pietra del Stadio della Marea: cella dopo cella, con le righe scavate
    floorPaint(K, f, sx, sy, tx, ty) {
      if (f !== "-") return false;
      const P = K.P, r = K.rnd(tx, ty, 4);
      P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e0cfa0" : "#dac898");
      if (tx % 3 === 0) P(sx, sy, 1, 16, "rgba(90,70,40,.35)"); if (ty % 3 === 0) P(sx, sy, 16, 1, "rgba(90,70,40,.35)");
      if (r < 0.2) P(sx + 4, sy + 7, 6, 1, "rgba(90,70,40,.18)"); if (r > 0.86) { P(sx + 6, sy + 6, 2, 2, "rgba(255,255,255,.35)"); }
      return true;
    },
    rest: {
      ch: "s", label: "Siediti accanto al fuoco",
      text: "Ti siedi accanto al fuoco. Qualcuno ha messo sulla brace tre noci di cocco, per vedere cosa succede. (Il gioco salva da solo: qui puoi rileggere il Giornale di Bordo.)"
    },
    texts: { chestOpen: "Apri la cassa di bordo, bagnata ma tenace.", chestEmpty: "Dentro ci sono solo sabbia, un calzino e un biglietto: «Non è mio».", nothing: "Niente di speciale. Solo il mare, che continua.", noHero: "I Rondine hanno bisogno del loro Campione. Crea prima il tuo Campione." },
    zoneMenuExtra: (K) => [{ label: "🌙 Passa il tempo", sub: `Ora: ${K.fase()} · marea ${K.marea()}`, fn: () => K.aspetta() }],
    journal: {
      name: "Il Giornale di Bordo", sub: "Le pagine ritrovate, l'ora dell'isola, i finali",
      html: (K) => {
        const ks = Object.keys(PAGINE).filter((id) => K.F.is("nf_g_" + id));
        const ora = { alba: "alba", giorno: "giorno", tramonto: "tramonto", notte: "notte" }[K.fase()], mar = K.marea();
        return `<p><b>Ora dell'isola:</b> ${ora}, marea ${mar}.</p>` + (ks.length
          ? ks.map((id) => `<p style="margin:8px 0;border-bottom:1px dashed #0f766e;padding-bottom:6px"><b style="color:#0f766e">${K.esc(PAGINE[id][0])}</b><br><span style="opacity:.9;font-size:12.5px">${K.esc(PAGINE[id][1])}</span></p>`).join("")
          : "<p>Il giornale è ancora vuoto. Le pagine si trovano in giro per l'isola.</p>");
      }
    },
    endings: {
      rotta: ["LA ROTTA DI CASA", "Si torna a casa, tutti insieme, con le maglie sporche di sale e una storia che nessuno crederà. Vale la pena raccontarla lo stesso.", "Serve aver vinto la finale."],
      custodi: ["I CUSTODI DEL FARO", "C'è una luce da tenere accesa, e qualcuno che ha deciso di farlo. Non è una resa: è un posto di lavoro, con una vista incredibile.", "Serve aver vinto la finale ed essere in sintonia con la Voce."],
      squadra: ["TUTTI IN SQUADRA", "Nessuno resta indietro, nessuno resta solo. Alla fine la squadra è una, e si vede dall'abitudine di perdere i palloni in mare tutti insieme.", "Serve aver vinto la finale con il rispetto di tutti."],
      zattera: ["LA ZATTERA DI GASPARE", "Non tutti gli eroi hanno un piano. Alcuni hanno un inventario, tre barili e una zattera. Funziona. Più o meno.", "Serve avere la fiducia di Gaspare e non giocare la finale."],
      lunga: ["LA ROTTA PIÙ LUNGA", "A volte la strada più lunga è l'unica che vale la pena fare. Segreto: tutte le conchiglie dell'isola.", "Segreto: tutte le conchiglie raccolte e una grande sintonia con la Voce."]
    },
    heroLook: () => ({ bg: ["#ccfbf1", "#14b8a6"] }),
    heroTitle: (K) => (K.stat("fiducia") > 50 ? "il naufrago su cui tutti contano" : "il naufrago più curioso dell'isola"),
    act: {
      q: "Entra", n: "Leggi il cartello", A: "Guarda il relitto", R: "Ascolta la radio", F: "Guarda il faro", J: "Vai", C: "Guarda", S: "Guarda la statua", E: "Guarda",
      t: "Guarda la palma", z: "Guarda le casse", g: "Guarda la porta di legno", l: "Guarda la torcia", f: "Guarda la staccionata", b: "Siediti sul tronco", "^": "Cambia zona", v: "Esci", "<": "Cambia zona", ">": "Cambia zona"
    },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          A: "Un pezzo di fusoliera con la scritta «RONDINE AIRLINES». Sta in piedi per testardaggine. Dentro ci sono quattro sedili, un vassoio con un panino ancora impacchettato e una mascherina d'ossigeno che pende come una liana.",
          z: "Casse di bordo: «PALLONI», «MAGLIE», «NON APRIRE PRIMA DELL'ARRIVO». L'ultima è già aperta. Dentro c'è un pallone e un biglietto: «Arrivo anticipato».",
          t: "Una palma di cocco. Una noce pende da un ramo con l'aria di chi sta per decidere qualcosa.",
          g: "Una porta fatta di tronchi trascinati dal mare, legati con la fibra delle palme. Qualcuno ha pure dipinto le righe.",
          l: "Una torcia di bambù, accesa. Brucia olio di cocco e profuma di vacanza e di qualcosa di più antico.",
          f: "Una staccionata di bambù, legata con cura. Qualcuno ha delimitato il suo pezzo di mondo con molta educazione.",
          b: "Un tronco di palma, levigato dal sedersi. Ti siedi un attimo. Il mare ti guarda sedersi.",
          S: "Una statua di pietra consumata: un giocatore con un pallone sotto il braccio, lo sguardo verso il mare. Ai piedi, una targa che il sale ha quasi cancellato.",
          F: "Il faro: una torre a strisce rosse e bianche, alta sopra gli scogli. In cima la luce gira piano, come se contasse.",
          E: "Un treppiede di bambù con sopra una fotocamera impermeabile. La lucina rossa è accesa: sta registrando.",
          C: "Una cosa lasciata lì da qualcuno. Sembra aspettare di essere raccolta."
        }[ch];
        if (!t) return false;
        K.say([["voce", t]]);
        return true;
      },
      // l'orologio dell'isola in alto a destra: sole o luna, marea, e un avviso quando cambia
      top(g, zid, spec, cx, cy, d, K) {
        if (spec.interior) return;
        const f = K.fase(), mar = K.marea(), x = 262, y = 24, w = 54, h = 15;
        g.save(); g.globalAlpha = 0.9; g.fillStyle = "rgba(6,40,52,.72)"; g.fillRect(x, y, w, h); g.fillStyle = "#2dd4bf"; g.fillRect(x, y, 2, h);
        const ic = f === "notte" ? "#e0f2fe" : f === "tramonto" ? "#fb923c" : "#fde047";
        g.fillStyle = ic; g.beginPath(); g.arc(x + 10, y + 7.5, 4, 0, 7); g.fill();
        if (f === "notte") { g.fillStyle = "rgba(6,40,52,1)"; g.beginPath(); g.arc(x + 12, y + 6.5, 3.6, 0, 7); g.fill(); }
        g.strokeStyle = "#7dd3fc"; g.lineWidth = 1.2; g.beginPath(); const lv = mar === "alta" ? 3 : 8; for (let i = 0; i <= 14; i++) { const px = x + 22 + i * 2, py = y + lv + Math.sin(d.fr / 12 + i * 0.7) * 1.4; if (i) g.lineTo(px, py); else g.moveTo(px, py); } g.stroke();
        g.fillStyle = "#ecfeff"; g.font = "bold 5px sans-serif"; g.fillText(mar === "alta" ? "ALTA" : "BASSA", x + 24, y + 13);
        g.restore();
        if (BANNER && performance.now() - BANNER.t < 3600) {
          const a = Math.min(1, (3600 - (performance.now() - BANNER.t)) / 500); g.save(); g.globalAlpha = a; g.font = "bold 8px 'Trebuchet MS', sans-serif"; const tw = g.measureText(BANNER.txt).width + 16;
          g.fillStyle = "rgba(6,40,52,.82)"; g.fillRect(160 - tw / 2, 150, tw, 14); g.fillStyle = "#2dd4bf"; g.fillRect(160 - tw / 2, 150, 2, 14); g.fillStyle = "#ecfeff"; g.textAlign = "center"; g.fillText(BANNER.txt, 160, 160); g.restore();
        }
      },
      // la mappa cambia con l'ora: secche e pietre luminose si aprono e si chiudono
      tick(zid, spec, px, py, dt, K) {
        if (!spec.mare) return null;
        if (!K.__mt) K.__mt = { acc: 0, key: "" };
        K.__mt.acc += dt || 0.016; if (K.__mt.acc < 0.35) return null; K.__mt.acc = 0;
        K.mareApply(zid, spec, px, py, true);
        return null;
      }
    }],
    // niente è meglio di un po' di plancton che sale dal mare, di notte, su tutto lo schermo
    mood(g, fr, K) {
      if (K.fase() !== "notte" || (K.ZX.spec && K.ZX.spec.interior)) return;
      g.save(); g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 22; i++) { const x = (i * 83 + Math.sin(fr / 70 + i) * 14 + fr * 0.05) % 330, y = 200 - ((i * 47 + fr * (0.12 + (i % 4) * 0.05)) % 215), a = 0.25 + 0.5 * Math.abs(Math.sin(fr / 25 + i * 1.3)); g.fillStyle = `rgba(110,255,225,${a})`; g.fillRect(x, y, 1.4, 1.4); }
      g.restore();
    },
    musicMain: "naufraghi",
    music: {
      naufraghi: {
        bpm: 96, chords: ["C", "Am", "F", "G", "C", "Em", "F", "G"], lres: 2, lw: "triangle", lv: 0.05,
        lead: "E5 - G5 A5 - G5 E5 - | D5 - - C5 - D5 - - | E5 - G5 A5 - C6 A5 - | G5 - - - E5 - - - | E5 - G5 A5 - G5 E5 - | D5 - B4 - C5 - - - | A4 - C5 E5 - D5 C5 - | B4 - D5 - G4 - - -",
        bass: "R . 5 R . R 8 5", bv: 0.12, arp: "", av: 0, drum: "k . h . s . h . k . h . s . h h", dv: 0.1
      }
    },
    paint: {
      // palma da cocco, con le noci e il tronco inclinato dal vento
      t(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 8); const g = K.g, P = K.P, sw = Math.sin(fr / 55 + tx * 0.9) * 1.3 + (K.ZX.wind || 0) * 0.4;
        g.strokeStyle = "#8a6a3a"; g.lineWidth = 3.2; g.lineCap = "round"; g.beginPath(); g.moveTo(sx + 7, sy + 15); g.quadraticCurveTo(sx + 9 + sw * 0.4, sy + 6, sx + 8 + sw, sy - 3); g.stroke();
        g.strokeStyle = "#6a4e28"; g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx + 5.5 + sw * (i / 8), sy + 13 - i * 3.4); g.lineTo(sx + 9.5 + sw * (i / 8), sy + 12.4 - i * 3.4); g.stroke(); } g.lineCap = "butt";
        const lx = sx + 8 + sw, ly = sy - 3;
        for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.62 + Math.sin(fr / 40 + k) * 0.05; g.fillStyle = k % 2 ? "#2f8a3e" : "#3fa24a"; g.beginPath(); g.moveTo(lx, ly); g.quadraticCurveTo(lx + Math.cos(a) * 8, ly + Math.sin(a) * 6 - 3, lx + Math.cos(a) * 12, ly + Math.sin(a) * 9 + 3); g.quadraticCurveTo(lx + Math.cos(a) * 7, ly + Math.sin(a) * 4 + 2, lx, ly); g.fill(); }
        g.fillStyle = "#6a4a22"; g.beginPath(); g.arc(lx - 1.5, ly + 2.5, 1.7, 0, 7); g.arc(lx + 1.8, ly + 3, 1.7, 0, 7); g.fill();
      },
      // acqua: turchese di giorno, blu profondo con plancton luminoso di notte
      w(K, sx, sy, tx, ty, fr) { acqua(K, sx, sy, tx, ty, fr); },
      // la secca: sabbia bagnata che affiora con la bassa marea
      k(K, sx, sy, tx, ty, fr) {
        const P = K.P, night = K.fase() === "notte"; P(sx, sy, 16, 16, night ? "#6b7a78" : (tx + ty) % 2 ? "#d8c590" : "#d2bf88");
        P(sx, sy, 16, 2, "rgba(255,255,255,.4)"); P(sx, sy + 14, 16, 2, "rgba(255,255,255,.4)"); const o = (fr / 6 + tx * 3) % 16; P(sx + o - 3, sy + 7, 5, 1, "rgba(255,255,255,.35)"); P(sx + ((tx * 7) % 12) + 2, sy + 11, 2, 1, "rgba(60,40,10,.25)");
        if (night) K.light(sx + 8, sy + 8, 10, "100,240,230", 0.15);
      },
      // sabbia bagnata sul bagnasciuga
      m(K, sx, sy, tx, ty, fr) { const P = K.P; P(sx, sy, 16, 16, (tx + ty) % 2 ? "#cdb987" : "#c6b27f"); const o = (fr / 8 + ty * 5) % 18; P(sx + o - 3, sy + 3, 6, 1, "rgba(255,255,255,.3)"); P(sx + ((tx * 5) % 12) + 1, sy + 10, 3, 1, "rgba(60,40,10,.2)"); if (K.at(tx, ty - 1) === "w") P(sx, sy, 16, 3, "rgba(255,255,255,.45)"); },
      // pietre di plancton: di notte si accendono e si può camminarci sopra
      h(K, sx, sy, tx, ty, fr) {
        acqua(K, sx, sy, tx, ty, fr, true); const g = K.g, night = K.fase() === "notte", pu = 0.6 + 0.4 * Math.sin(fr / 20 + tx + ty);
        g.fillStyle = night ? "#164e63" : "#7c8c8a"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 6.5, 5, 0, 0, 7); g.fill();
        g.fillStyle = night ? `rgba(110,255,230,${0.5 + 0.35 * pu})` : "rgba(255,255,255,.22)"; g.beginPath(); g.ellipse(sx + 8, sy + 8, 5, 3.6, 0, 0, 7); g.fill();
        if (night) { K.light(sx + 8, sy + 8, 22, "80,255,215", 0.5 * pu + 0.15); g.fillStyle = "rgba(220,255,250,.9)"; g.fillRect(sx + 6, sy + 7, 2, 1); }
      },
      // fusoliera dell'aereo: bianca con la riga blu, finestrini, un pezzo mancante
      A(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const P = K.P, g = K.g, top = K.at(tx, ty - 1) !== "A", bot = K.at(tx, ty + 1) !== "A";
        K.shadow(sx, sy + (bot ? 0 : 6), 8);
        P(sx, sy, 16, 16, "#e9eef2"); if (top) { P(sx, sy, 16, 3, "#c9d3da"); P(sx, sy + 3, 16, 1, "#9fb0bb"); }
        if (bot) { P(sx, sy + 12, 16, 4, "#b7c4cc"); P(sx, sy + 12, 16, 1, "#8a9aa5"); } else { P(sx, sy + 5, 16, 3, "#2563eb"); }
        if (top) { const hole = (tx * 5 + ty) % 7 === 0; if (hole) { P(sx + 3, sy + 4, 10, 10, "#1f2933"); P(sx + 4, sy + 5, 8, 4, "#334155"); P(sx + 2, sy + 4, 1, 3, "#e9eef2"); P(sx + 13, sy + 6, 1, 3, "#e9eef2"); } else { P(sx + 3, sy + 5, 10, 6, "#27455c"); P(sx + 4, sy + 6, 8, 4, "#7fb4d6"); P(sx + 4, sy + 6, 3, 1, "rgba(255,255,255,.7)"); } }
        else if ((tx + ty) % 4 === 0) { g.fillStyle = "#2563eb"; g.beginPath(); g.moveTo(sx + 4, sy + 10); g.lineTo(sx + 8, sy + 7); g.lineTo(sx + 12, sy + 10); g.lineTo(sx + 8, sy + 9); g.closePath(); g.fill(); }
        P(sx, sy + 15, 16, 1, "rgba(0,0,0,.25)"); if ((tx * 3 + ty) % 5 === 0) P(sx + 5, sy + 9, 4, 3, "rgba(40,30,20,.35)");
      },
      // ala o carrello: lamiera piegata
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); const g = K.g, P = K.P;
        P(sx + 7, sy + 4, 2, 11, "#6b4a2a"); P(sx + 3, sy + 2, 3, 12, "#5b3b1b"); P(sx + 10, sy + 2, 3, 12, "#5b3b1b"); P(sx + 2, sy, 12, 3, "#1f2933"); P(sx + 3, sy + 1, 10, 1, "#3b4a58");
        const rec = Math.floor(fr / 30) % 2 === 0; P(sx + 11, sy + 1, 2, 1, rec ? "#ef4444" : "#7f1d1d"); g.strokeStyle = "#e5e7eb"; g.lineWidth = 0.8; g.beginPath(); g.arc(sx + 5, sy + 2, 1, 0, 7); g.stroke();
      },
      // cassa di bordo con la rondine
      z(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); const P = K.P, g = K.g, v = (tx + ty) % 2;
        P(sx + 2, sy + 3, 12, 11, v ? "#9a7440" : "#8a6636"); P(sx + 2, sy + 3, 12, 1, "#b88f56"); P(sx + 2, sy + 7, 12, 1, "rgba(0,0,0,.28)"); P(sx + 2, sy + 11, 12, 1, "rgba(0,0,0,.28)"); P(sx + 7, sy + 3, 1, 11, "rgba(0,0,0,.22)");
        g.fillStyle = "#f8fafc"; g.beginPath(); g.moveTo(sx + 9, sy + 9); g.lineTo(sx + 12, sy + 6); g.lineTo(sx + 11.5, sy + 9.5); g.closePath(); g.fill();
      },
      // la radio di bordo, su una cassa
      R(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); const P = K.P, g = K.g, night = K.fase() === "notte";
        P(sx + 1, sy + 9, 14, 6, "#8a6636"); P(sx + 1, sy + 9, 14, 1, "#b88f56");
        P(sx + 2, sy + 3, 12, 7, "#1f3a44"); P(sx + 3, sy + 4, 10, 5, "#2d5a68"); P(sx + 4, sy + 5, 4, 3, night ? "#5eead4" : "#94a3a8"); g.fillStyle = "#e2e8f0"; g.beginPath(); g.arc(sx + 11, sy + 6.5, 1.6, 0, 7); g.fill();
        g.strokeStyle = "#cbd5e1"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(sx + 4, sy + 3); g.lineTo(sx + 1, sy - 4); g.stroke();
        if (night) { const a = 0.4 + 0.4 * Math.sin(fr / 10); K.light(sx + 6, sy + 6, 18, "94,234,212", 0.35 + a * 0.2); P(sx + 12, sy + 3, 2, 1, `rgba(255,120,120,${0.4 + a})`); }
      },
      // il faro: torre a strisce, lanterna in cima che gira
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const P = K.P, g = K.g, L = K.at(tx - 1, ty) === "F", Rr = K.at(tx + 1, ty) === "F", top = K.at(tx, ty - 1) !== "F", night = K.fase() === "notte" || K.fase() === "tramonto";
        const band = ty % 2 ? "#f8fafc" : "#dc2626"; P(sx, sy, 16, 16, band); if (!L) P(sx, sy, 2, 16, "rgba(255,255,255,.25)"); if (!Rr) P(sx + 13, sy, 3, 16, "rgba(0,0,0,.28)");
        if ((tx + ty) % 3 === 0) { P(sx + 6, sy + 5, 4, 6, "#1e293b"); P(sx + 7, sy + 6, 2, 4, night ? "#fde68a" : "#7fb4d6"); }
        if (top) { P(sx, sy + 12, 16, 4, "#334155"); P(sx, sy, 16, 3, "#475569"); if (night) { const a = 0.45 + 0.4 * Math.sin(fr / 14); K.light(sx + 8, sy + 4, 46, "255,236,160", a); K.light(sx + 8, sy + 4, 18, "255,248,210", 0.7); } P(sx + 3, sy + 4, 10, 6, night ? "#fde68a" : "#bfe6f0"); P(sx + 3, sy + 4, 10, 1, "#334155"); P(sx + 3, sy + 9, 10, 1, "#334155"); }
      },
      // varco: due pali con la corda e una freccia che pulsa
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); const P = K.P, g = K.g, b = Math.sin(fr / 8) * 1.2;
        P(sx + 1, sy + 1, 3, 15, "#7a5a30"); P(sx + 12, sy + 1, 3, 15, "#7a5a30"); P(sx, sy + 1, 16, 3, "#8a6a3a"); P(sx + 4, sy + 4, 8, 12, "rgba(20,40,20,.35)");
        g.fillStyle = K.TH.accent; g.strokeStyle = "rgba(0,0,0,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx + 4, sy + 8 + b); g.lineTo(sx + 8, sy + 12 + b); g.lineTo(sx + 12, sy + 8 + b); g.closePath(); g.fill(); g.stroke();
        P(sx + 2, sy + 4, 1, 4, "#a3e635"); P(sx + 13, sy + 4, 1, 5, "#a3e635");
      },
      // cappello, zaino e altre cose lasciate lì
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 5); const g = K.g; g.save(); g.translate(sx + 8, sy + 10);
        g.fillStyle = "#f59e0b"; g.beginPath(); g.ellipse(0, 0, 6, 4, 0, Math.PI, 0); g.fill(); g.fillStyle = "#b45309"; g.fillRect(-7, 0, 14, 2); g.fillStyle = "#fff"; g.fillRect(-1, -3, 3, 1);
        g.globalCompositeOperation = "lighter"; const a = 0.25 + 0.2 * Math.sin(fr / 12); const gr = g.createRadialGradient(0, -1, 1, 0, -1, 10); gr.addColorStop(0, `rgba(255,240,180,${a})`); gr.addColorStop(1, "rgba(255,240,180,0)"); g.fillStyle = gr; g.fillRect(-10, -11, 20, 20); g.restore();
      },
      // statua consumata dal sale
      S(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); const P = K.P, g = K.g;
        P(sx + 3, sy + 11, 10, 4, "#9a9486"); P(sx + 2, sy + 14, 12, 2, "#7d776a"); P(sx + 5, sy + 3, 6, 8, "#b8b2a2"); g.fillStyle = "#b8b2a2"; g.beginPath(); g.arc(sx + 8, sy + 2, 3, 0, 7); g.fill(); g.fillStyle = "#cfc9b8"; g.beginPath(); g.arc(sx + 11, sy + 8, 2.4, 0, 7); g.fill(); P(sx + 5, sy + 4, 1, 6, "rgba(255,255,255,.3)"); P(sx + 6, sy + 12, 4, 1, "rgba(60,90,50,.5)");
      },
      // la porta: due pali di legno di mare, la rete a maglie
      g(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const P = K.P; P(sx + 1, sy + 1, 14, 14, "rgba(255,255,255,.14)"); for (let i = 3; i < 14; i += 3) { P(sx + i, sy + 2, 1, 12, "rgba(255,255,255,.4)"); P(sx + 2, sy + i, 12, 1, "rgba(255,255,255,.4)"); }
        P(sx + 1, sy, 3, 16, "#9a7a4a"); P(sx, sy, 16, 3, "#a98858"); P(sx + 12, sy, 3, 16, "#8a6a3a"); P(sx + 1, sy, 1, 16, "#c0a070");
      },
      // staccionata di bambù
      f(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const P = K.P; P(sx, sy + 5, 16, 2, "#b59a4a"); P(sx, sy + 10, 16, 2, "#b59a4a"); for (let i = 0; i < 4; i++) { P(sx + 1 + i * 4, sy + 2, 2, 13, i % 2 ? "#cdb35a" : "#c2a74e"); P(sx + 1 + i * 4, sy + 2, 2, 1, "#8a7a30"); P(sx + 1 + i * 4, sy + 8, 2, 1, "#8a7a30"); }
      },
      // torcia tiki
      l(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 3); const P = K.P, g = K.g, fl = Math.sin(fr / 5 + tx) * 1.2;
        P(sx + 7, sy + 5, 2, 10, "#7a5a30"); P(sx + 5, sy + 2, 6, 4, "#5b3b1b"); g.fillStyle = "#fb923c"; g.beginPath(); g.ellipse(sx + 8, sy - 1 + fl * 0.3, 2.6, 4.2, 0, 0, 7); g.fill(); g.fillStyle = "#fde047"; g.beginPath(); g.ellipse(sx + 8, sy, 1.3, 2.4, 0, 0, 7); g.fill();
        K.light(sx + 8, sy, 26 + fl, "255,190,100", 0.5);
      },
      // tronco usato come panca
      b(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 7); const g = K.g, P = K.P;
        P(sx + 1, sy + 7, 14, 6, "#8a6a3a"); P(sx + 1, sy + 7, 14, 1, "#a98858"); P(sx + 1, sy + 12, 14, 1, "rgba(0,0,0,.28)"); g.fillStyle = "#c2a06a"; g.beginPath(); g.ellipse(sx + 2, sy + 10, 1.5, 3, 0, 0, 7); g.fill(); g.strokeStyle = "#6a4e28"; g.lineWidth = 0.6; g.beginPath(); g.ellipse(sx + 2, sy + 10, 0.8, 1.6, 0, 0, 7); g.stroke();
      }
    },
    guest: {
      id: "nf_tobia",
      lines: [["nf_tobia", "[felice] {n}! Sono qui al Borgo per un documentario. «Il Borgo visto da uno che torna da un'isola». Titolo provvisorio: «Che fresco». (Alza la camera.) Dì qualcosa, sei in diretta con otto persone."]]
    },
    cameos: [
      {
        id: "rz_ferruccio", zone: "nf_spiaggia", at: [30, 15],
        when: (K) => !!(K.otherSaga("ali-di-rondine.razzo") || {}).done?.[1],
        lines: [["rz_ferruccio", "BIP. Ferruccio, dal 3011. Consegna per «Naufragi, vari». Non so a chi sia: l'ho trovato scritto sul pacco. È una busta con dentro un'altra busta. Dentro la seconda busta c'è una busta. Ho smesso di aprirle."]]
      },
      {
        id: "cs_ugo", zone: "nf_laguna", at: [6, 15],
        when: (K) => !!(K.otherSaga("ali-di-rondine.cavallo") || {}).done?.[1],
        lines: [["cs_ugo", "[ride] Ugo Divano! Vengo da Lustrino. Ho preso il volo sbagliato: dovevo andare a una festa. Sono qui da tre giorni. Ho già un'idea: la prima isola con il servizio in camera. Esiste già? Allora «il servizio in cocco»."]]
      }
    ]
  });

  const K = E.K;
  K.PAGINE = PAGINE;

  // ------------------------------------------------------------ L'OROLOGIO DELL'ISOLA: giorno, notte, marea
  K.fase = () => nomeFase(tFase());
  K.marea = () => { const f = nomeFase(tFase()); return f === "alba" || f === "giorno" ? "bassa" : "alta"; };
  // test e scene: ferma l'orologio a una fase (alba · giorno · tramonto · notte), o lo fa ripartire (null)
  K.congela = (nome) => { CONGELATO = nome == null ? null : (inizioFase[nome] != null ? inizioFase[nome] + 0.04 : null); if (nome == null) T0 = performance.now() - tFase() * CICLO; };
  K.setFase = (nome) => { if (inizioFase[nome] == null) return; if (CONGELATO != null) CONGELATO = inizioFase[nome] + 0.04; else T0 = performance.now() - (inizioFase[nome] + 0.01) * CICLO; };
  // le tessere di una zona secondo l'ora: spec.mare = [[x0, y0, x1, y1, "k"|"h", "bassa"|"notte"], …]. Aperto = camminabile.
  const aperto = (when) => (when === "notte" ? K.fase() === "notte" : K.marea() === "bassa");
  K.mareLay = (L, spec) => { (spec.mare || []).forEach(([x0, y0, x1, y1, ch, when]) => L.lay(x0, y0, x1, y1, aperto(when) ? ch : "w")); };
  // aggiorna la mappa viva: le tessere che si chiudono aspettano se ci sei sopra (o vicino)
  K.mareApply = (zid, spec, px, py, banner) => {
    if (!spec.mare || !K.ZX || K.ZX.id !== zid || !K.ZX.map) return false;
    const hx = Math.floor(px / 16), hy = Math.floor((py - 4) / 16); let changed = false;
    spec.mare.forEach(([x0, y0, x1, y1, ch, when]) => {
      const want = aperto(when) ? ch : "w", cur = K.ZX.map[y0] && K.ZX.map[y0][x0];
      if (cur === want || cur === undefined) return;
      if (want === "w" && hx >= x0 - 1 && hx <= x1 + 1 && hy >= y0 - 1 && hy <= y1 + 1) return; // ci sei sopra: aspetta
      K.setTiles(x0, y0, x1, y1, want); changed = true;
      if (banner) BANNER = { t: performance.now(), txt: want === "w" ? (when === "notte" ? "ALBA: LE PIETRE SI SPENGONO" : "MAREA ALTA: LE SECCHE SI CHIUDONO") : (when === "notte" ? "NOTTE: LE PIETRE LUMINOSE" : "MAREA BASSA: AFFIORANO LE SECCHE") };
    });
    return changed;
  };
  // passare il tempo dal menu della zona (o da un dialogo): scegli quando
  K.aspetta = (then) => {
    const here = K.api.trZone();
    const go = (f, txt) => () => { K.setFase(f); K.mareApply(here, (K.zone(here) || {}).spec || {}, ...(K.api.trPos() || [0, 0]), true); K.say([["voce", txt]], then || K.done); };
    K.ask("voce", `Passi il tempo seduto a guardare il mare. Ora: ${K.fase()}, marea ${K.marea()}. Quando riparti?`, [
      { label: "Fino al mattino", sub: "Giorno · marea bassa, le secche affiorano", fn: go("giorno", "Aspetti. Il cielo diventa chiaro e la marea si ritira, mostrando le secche.") },
      { label: "Fino al tramonto", sub: "Marea alta, il mare si riprende le secche", fn: go("tramonto", "Aspetti fino a sera. L'acqua sale piano, senza fretta.") },
      { label: "Fino a notte", sub: "Si accendono le pietre di plancton", fn: go("notte", "Aspetti che faccia buio. Poi, una per una, le pietre dell'acqua si accendono.") },
      { label: "◂ Non aspetto", fn: then || K.done },
    ], K.zone(here) ? K.zone(here).spec.bg : "nf_titolo");
  };

  // ------------------------------------------------------------ IL GIORNALE DI BORDO: una pagina ritrovata
  K.pagina = (id, then) => {
    const M = PAGINE[id]; if (!M) return (then || K.done)();
    const nuova = !K.F.is("nf_g_" + id); K.F.set("nf_g_" + id, true);
    if (!document.getElementById("nfCss")) {
      const st = document.createElement("style"); st.id = "nfCss";
      st.textContent = `.nfPag{position:fixed;inset:0;z-index:270;background:rgba(6,40,52,.7);display:flex;align-items:center;justify-content:center;padding:16px;font-family:'Trebuchet MS',system-ui,sans-serif}
.nfPag .sh{width:min(100%,380px);background:#fef9ec;color:#0b3b45;border:2px solid #0f766e;box-shadow:8px 8px 0 rgba(0,0,0,.35);padding:16px;border-radius:3px;animation:nfPop .4s ease both;background-image:repeating-linear-gradient(0deg,transparent 0 21px,rgba(15,118,110,.14) 21px 22px)}
@keyframes nfPop{0%{transform:translateY(14px) rotate(-1.5deg);opacity:0}100%{transform:none;opacity:1}}
.nfPag .hd{font:900 11px sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#0f766e;border-bottom:2px solid #0f766e;padding-bottom:4px}
.nfPag h3{margin:10px 0 6px;font:900 18px Georgia,serif;color:#134e4a}
.nfPag p{font:14px/1.5 Georgia,serif;margin:6px 0}
.nfPag button{width:100%;margin-top:12px;min-height:44px;border:2px solid #0f766e;background:#14b8a6;color:#fff;font:900 14px sans-serif;border-radius:6px;cursor:pointer;text-transform:uppercase;letter-spacing:1px;box-shadow:0 3px 0 #0f766e}
.nfPag button:active{transform:translateY(2px);box-shadow:none}`;
      document.head.appendChild(st);
    }
    const ov = document.createElement("div"); ov.className = "nfPag";
    ov.innerHTML = `<div class="sh"><div class="hd">Giornale di bordo${nuova ? " · nuova pagina" : ""}</div><h3>${K.esc(M[0])}</h3><p>${K.esc(M[1])}</p><button type="button">Metti via ▸</button></div>`;
    document.body.appendChild(ov); K.tone(523.25, 0.3, "triangle", 0.06, 0, 698.46);
    ov.querySelector("button").onclick = () => { ov.remove(); (then || K.done)(); };
  };

  // quante conchiglie dell'isola hai raccolto (e quante ce ne sono in tutto)
  K.conchiglie = () => {
    try {
      const r = K.api.trRec(), Z = K.api.TRZ; let n = 0, tot = 0;
      Object.keys(Z).forEach((z) => { if (!/^nf_/.test(z)) return; const it = Z[z].items || []; tot += it.length; n += ((r.got && r.got[z]) || []).length; });
      return [n, tot];
    } catch (e) { return [0, 0]; }
  };

  // ------------------------------------------------------------ la partita originale: Marea
  K.mareaMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {};
    return K.ownMatch(window.__marea.start, Object.assign({
      usColor: "#1d4ed8", us: "I Rondine", hero: { name: h.name || "Tu" },
      mates: [{ name: "Bora" }, { name: "Gaspare" }],
      opp: { name: "I Gabbiani", color: "#e11d48", style: "equilibrata" }
    }, o, { done: (r) => { if (r && r.quit) K.F.set("nf_lasciato", true); if (typeof done === "function") done(r); } }));
  };

  window.__naufraghi = E.api;
  window.__naufraghi.clock = { fase: K.fase, marea: K.marea, congela: K.congela, setFase: K.setFase };
})();
