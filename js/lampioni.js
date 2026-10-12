// js/lampioni.js - LA NOTTE DEI LAMPIONI · configurazione della saga sul motore comune (js/saga-core.js)
// Saga SERIA, con fantasmi gentili. Ispirata al folklore delle feste di paese e delle lanterne (tutto inventato).
// Sanlume, un paese di collina. Una notte all'anno i dodici lampioni antichi si accendono da soli, e i giocatori di un tempo
// — le Ombre gentili — tornano al vecchio campo per la partita della festa. Quest'anno i lampioni restano spenti.
// Novità di questa saga (oltre a quelle del motore comune):
//  - LUCI (js/luci.js): la partita originale, con un motore suo. A turni, su un campo a caselle, AL BUIO: si vede solo
//    dove c'è luce, e le lanterne sono poche.
//  - LUCE DINAMICA (motore comune: spec.buio e spec.luci): le zone sono buie davvero. Si vede intorno all'eroe e intorno ai
//    lampioni accesi; gli oggetti e le strade nascoste compaiono solo nella luce. I lampioni si accendono uno a uno.
//  - LE OMBRE GENTILI: la sagoma «ombra» (game.js), che si vede solo vicino alla luce.
// Salvataggio proprio: ali-di-rondine.lampioni. Ricompense: monete, cosmetici, e i premi della Sala Giochi e della Cineteca.
(function () {
  "use strict";
  if (window.__lampioni || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    id: "lampioni", key: "ali-di-rondine.lampioni", title: "La Notte dei Lampioni", icon: "🏮", bg: "nl_titolo", chapters: 3,
    menuSub: "Un paese al buio, dodici lampioni da accendere e una partita con le ombre dei giocatori di un tempo",
    theme: { accent: "#ffd27a", ink: "#f4ecd8", paper: "rgba(10,10,26,.9)", font: "Georgia, serif", chipBg: "#14142aee", chipBorder: "#ffd27a" },
    stats: { luce: [0, 99, 0, "Luce del paese"], ombre: [0, 99, 0, "Fiducia delle Ombre"] },
    travel: true,
    item: ["Fiammifero antico", "Fiammiferi"],
    regions: {
      borgo: { grass: ["#3a5a3a", "#3e5e3e", "#365636"], path: ["#8a7a6a", "#827262"], stone: ["#7a7a8a", "#747484"], wall: ["#a89070", "#9c8464"], water: ["#2a3a6a", "#30407a"], tall: "#3a5a2a", tree: ["#1a3a2a", "#2a4a32", "#1f4028"], tint: "120,140,255", tintA: 0.1, fx: "fireflies", dark: 0.1 },
      bosco: { grass: ["#2a4a2a", "#2e4e2e", "#264626"], path: ["#6a5a4a", "#625244"], stone: ["#5a5a6a", "#545464"], wall: ["#4a3a2a", "#443424"], water: ["#1a2a5a", "#20306a"], tall: "#2a4a1a", tree: ["#0f2a1a", "#1a3a22", "#14301e"], tint: "150,255,150", tintA: 0.08, fx: "fireflies", dark: 0.15 },
      campo: { grass: ["#3a6a3a", "#3e6e3e", "#366636"], path: ["#8a7a6a", "#827262"], stone: ["#8a8a9a", "#848494"], wall: ["#6a6a7a", "#646474"], water: ["#2a3a6a", "#30407a"], tall: "#3a6a2a", tree: ["#1a3a2a", "#2a4a32", "#1f4028"], tint: "255,210,140", tintA: 0.08, fx: "", dark: 0.08 },
      casa: { grass: ["#7a5a3a", "#745434", "#80603e"], path: ["#a8825a", "#a07a52"], stone: ["#c8b8a0", "#c0b098"], wall: ["#4a3a2a", "#443424"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,190,110", tintA: 0.16, fx: "dust", dark: 0.12 },
    },
    floors: "", solid: "U",
    rest: { ch: "s", label: "Siediti sotto il lampione", text: "Ti siedi. Le lucciole fanno il giro del lampione, tre volte, come se contassero. (Il gioco salva da solo: qui puoi rileggere il Quaderno del Lampionaio.)" },
    texts: { chestOpen: "Apri la cassetta.", chestEmpty: "La cassetta è vuota. Odora di cera e di fiammiferi.", nothing: "Niente. Solo il buio, che però stanotte sembra in ascolto.", noHero: "Sanlume aspetta qualcuno che accenda i lampioni. Prima crea il tuo Campione.", chapters: "Tre capitoli, una notte lunghissima. Le scelte cambiano l'alba." },
    journal: { name: "Il Quaderno del Lampionaio", sub: "Lampioni, ombre, lanterne, finali" },
    endings: {
      alba: ["L'ALBA DI SANLUME", "La partita finisce, i lampioni si spengono uno a uno, e il sole sorge sulla collina. Le Ombre salutano dal margine del campo. L'anno prossimo, stessa notte, stessa ora.", "Sempre possibile, alla fine."],
      fiammetta: ["LA LAMPIONAIA", "Fiammetta diventa la lampionaia di Sanlume, come sua nonna. Ogni sera accende i dodici lampioni a mano, uno a uno, anche quando non serve. Soprattutto quando non serve.", "Serve tanta luce nel paese."],
      ombre: ["LA SQUADRA DI TUTTI I TEMPI", "Le Ombre non se ne vanno all'alba: restano, una notte al mese, a giocare con i vivi. Il capitano Leandro insegna i dribbling del 1952. I vivi insegnano a lui il selfie. Non gli riesce.", "Serve la piena fiducia delle Ombre."],
      tredicesimo: ["IL TREDICESIMO LAMPIONE", "I fiammiferi antichi che hai raccolto accendono un lampione che nessuno ricordava: il tredicesimo, sul campo, dove giocava chi non è mai tornato a casa. Lì ritorna. E la festa, per la prima volta, è al completo.", "Segreto: tutti i fiammiferi antichi e tutti i lampioni accesi."],
    },
    heroLook: (h, K) => ({ bg: ["#14142a", "#ffd27a"], shirt: K.F.is("nl_lanterna") ? "#3a3a6a" : h.shirt }),
    heroTitle: (K) => (K.F.is("nl_lanterna") ? "accenditore di lampioni" : "viandante nel buio"),
    act: { q: "Entra", U: "Guarda il lampione", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) { // i lampioni: si accendono con la lanterna
        if (ch !== "U") return false; const k = `lamp_${zid}_${tx}_${ty}`;
        if (K.F.is(k)) { K.say([["voce", "Il lampione è acceso. La fiammella dentro il vetro fa un piccolo inchino, come per salutare."]]); return true; }
        if (!K.F.is("nl_lanterna")) { K.say([["voce", "Un lampione antico, di ferro battuto, spento. Il vetro è freddo. Ci vorrebbe la fiamma giusta per accenderlo."]]); return true; }
        K.F.set(k, true); K.bond("luce", 1); K.tone(660, 0.25, "triangle", 0.06, 0, 990); K.refreshZone(); K.say([["voce", `Avvicini la lanterna. La fiammella salta dentro il vetro, e il lampione si accende con un sospiro caldo. Intorno, il buio si ritira. (Lampioni accesi: ${lampsLit(K)}.)`]]); return true;
      },
    }],
    musicMain: "lampioni",
    music: {
      // un tema notturno da festa di paese: fisarmonica (onda quadra morbida), contrabbasso, un carillon lontano
      lampioni: { bpm: 92, chords: ["Dm", "Gm", "C", "F", "Dm", "Bb", "A", "A"], lres: 2, lw: "triangle", lv: 0.045,
        lead: "A4 - D5 - F5 - E5 - | D5 - - - A4 - - - | G4 - C5 - E5 - D5 - | C5 - - - F4 - - - | A4 - D5 - F5 - A5 - | G5 - F5 - D5 - Bb4 - | A4 - C#5 - E5 - G5 - | F5 - E5 - - - - -",
        bass: "R . . 5 . . R . R . . 5 . . 8 .", bv: 0.09, arp: "1 3 5 8 1 3 5 8 1 3 5 8 1 3 5 8", aw: "sine", av: 0.016, drum: "k . . h . . s . k . . h . . s .", dv: 0.14 },
    },
    paint: {
      // il lampione antico: spento (vetro scuro) o acceso (fiammella e alone)
      U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy + 14, on = K.F.is(`lamp_${K.ZX.id}_${tx}_${ty}`); g.fillStyle = "#2a2a32"; g.fillRect(x - 1.5, y - 26, 3, 26); g.fillRect(x - 4, y - 2, 8, 3); g.fillRect(x - 5, y - 33, 10, 2); g.fillStyle = on ? "#ffd27a" : "#3a3a4a"; g.fillRect(x - 4, y - 31, 8, 7); g.fillStyle = "#2a2a32"; g.beginPath(); g.moveTo(x - 5, y - 31); g.lineTo(x, y - 36); g.lineTo(x + 5, y - 31); g.closePath(); g.fill(); if (on) { g.fillStyle = "#fff4c8"; g.fillRect(x - 1, y - 30 + Math.sin(fr / 5 + tx) * 0.5, 2, 4); K.light(x, y - 28, 22, "255,200,110", 0.5); } }); },
    },
    guest: { id: "nl_leandro", lines: [["nl_leandro", "[felice] {n}! Mi hanno dato il permesso di uscire anche di giorno, una volta. Il Borgo Marino ha un bel campo. Nel 1952 ci avrei segnato da centrocampo. Dicono tutti così, i vecchi. Io lo dico da ombra: vale doppio."]] },
    cameos: [
      { id: "sf_ada", zone: "nl_borgo", at: [5, 14], when: (K) => !!(K.otherSaga("ali-di-rondine.stagione") || {}).done?.[1], lines: [
        ["sf_ada", "[pensa] {n}! Una notte che non finisce mai? Ne so qualcosa, di giorni che non finiscono. Questa però è bella: c'è la festa, e la luce torna piano piano."]] },
      { id: "mg_tilde", zone: "nl_borgo", at: [26, 6], when: (K) => !!(K.otherSaga("ali-di-rondine.mantello") || {}).done?.[1], lines: [
        ["mg_tilde", "Ho cucito un mantello anche per un'ombra, una volta. Non lo indossava: ci si avvolgeva per dormire. Le ombre hanno freddo, sai? Accendi quei lampioni, caro."]] },
    ],
  });
  const K = E.K;
  function lampsLit(k) { const m = (k || K).mem(); return Object.keys(m.flags).filter((x) => /^lamp_/.test(x) && m.flags[x]).length; }
  // le luci di una zona: i lampioni accesi (le lettere «U» della mappa) e quelle in più che la zona dichiara
  K.lampLights = (zid, extra) => () => { const m = K.mem(), out = []; Object.keys(m.flags).forEach((k) => { const mt = k.match(/^lamp_(.+)_(\d+)_(\d+)$/); if (mt && mt[1] === zid && m.flags[k]) out.push([+mt[2], +mt[3], 3.4, "255,200,110"]); }); return out.concat(extra ? extra(K) : []); };
  K.lampsLit = () => lampsLit(K); K.lampsIn = (zid) => { const m = K.mem(); return Object.keys(m.flags).filter((k) => k.indexOf(`lamp_${zid}_`) === 0 && m.flags[k]).length; };
  window.__lampioni = E.api;
})();
