// js/mondiale.js - «ALI DI RONDINE · MONDIALE GIOVANILE» · configurazione della saga sul motore comune (js/saga-core.js)
// La nazionale under-16 al Mondiale: Italia (raduno), Brasile (samba), Nord (neve e acciaio), Giappone (finale). Ogni squadra ha il suo stile; la tua risposta è la CATENA.
// Novità: CATENA (cfg.chain nel core): ruoli e sinergie tra compagni nei passaggi a catena. Minigioco: Catena d'attacco (js/mondiale-cat.js), anche in Sala Giochi.
// Dal core: La Compagnia (cfg.crew), Rapporti, Inventario, guardie con cono (cap. 3), K.playMatch (una partita a capitolo), interni a mano.
// Tessere proprie (js/mondiale-tiles.js): P Y W J case · T tribuna · G porta · B panchina · C cartellone · A pino · E palma · O ciliegio · L riflettore · M muretto · D divano · K armadietto
//   S trofeo · N borsone · V vetrata · U ombrellone · I torii · R roccia · F fuoco; pavimenti e erba · l j x righe · b sabbia · g pavé · n neve · t tatami · m parquet · w piastrelle
(function () {
  "use strict";
  if (window.__mondiale || !window.__sagaCore) return;
  const PEOPLE = { mg_gallo: "Mister Gallo", mg_mara: "Dottoressa Mara", mg_elio: "Elio Moro", mg_nina: "Nina Salvi", mg_bruno: "Bruno Costa", mg_teo: "Teo Ferri", mg_sandro: "Sandro Greco", mg_tico: "Tico Valente", mg_bia: "Dona Bia", mg_duarte: "Capitão Duarte", mg_lukas: "Lukas Brandt", mg_falk: "Herr Falk", mg_ren: "Ren Hayate", mg_yuki: "Yuki" };
  const MEMBERS = {
    mg_elio: { n: "Elio Moro", icon: "🎯", role: "Regista", rk: "regista", d: "Gioca a testa alta e passa a occhi chiusi. Dice che il calcio è geometria; gli altri, che è un modo di non parlare.", s: { visione: 3, tecnica: 2 } },
    mg_nina: { n: "Nina Salvi", icon: "💨", role: "Ala", rk: "ala", d: "La più veloce del raduno. Corre per non pensare, pensa per correre.", s: { velocità: 3 } },
    mg_bruno: { n: "Bruno Costa", icon: "🔥", role: "Punta", rk: "punta", d: "Segna con qualunque parte del corpo, compresa quella di cui non si parla.", s: { tiro: 3 } },
    mg_teo: { n: "Teo Ferri", icon: "🛡️", role: "Difensore", rk: "difensore", d: "Un muro con i calzettoni. Sa dove sarà la palla prima di chi la calcia.", s: { grinta: 3 } },
    mg_sandro: { n: "Sandro Greco", icon: "🧤", role: "Portiere", rk: "portiere", d: "Parla con i pali. I pali, a volte, rispondono.", s: { riflessi: 3 } },
    mg_tico: { n: "Tico Valente", icon: "💃", role: "Ala", rk: "ala", d: "Dribbla in quattro metri quadrati e balla in due. Ha sempre una canzone in testa e una scusa in tasca.", s: { dribbling: 3 } },
    mg_lukas: { n: "Lukas Brandt", icon: "⚙️", role: "Difensore", rk: "difensore", d: "Ripara bici di notte e anticipa attaccanti di giorno. Ride poco, ma quando ride sposta le panchine.", s: { grinta: 2, visione: 1 } }
  };
  const E = window.__sagaCore.create({
    id: "mondiale", key: "ali-di-rondine.mondiale", title: "Ali di Rondine · Mondiale Giovanile", icon: "🌍", bg: "mg_titolo", chapters: 4,
    menuSub: "La nazionale under-16 al Mondiale: raduno in Italia, samba a Rio, neve al Nord, finale a Tokyo. Recluta la squadra e costruisci la Catena.",
    theme: { accent: "#fde047", ink: "#ecfdf5", paper: "rgba(6,21,14,.94)", font: "'Trebuchet MS', sans-serif", chipBg: "#0f3d24", chipBorder: "#fde047" },
    stats: { grinta: [0, 100, 20, "Grinta"], intesa: [0, 100, 10, "Intesa"] },
    item: ["Gettone azzurro", "Gettoni azzurri"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 14 + i) * 1.2); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, 4.5, 0, 7); g.fill(); g.fillStyle = "#1d4ed8"; g.beginPath(); g.arc(0, 0, 2, 0, 7); g.fill(); g.fillStyle = "#111"; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(Math.cos(k * 1.256) * 3.4, Math.sin(k * 1.256) * 3.4, 0.9, 0, 7); g.fill(); } g.restore(); },
    regions: {
      colle: { grass: ["#5f9a47", "#58923f", "#68a44f"], path: ["#cbbd96", "#bfb18a"], stone: ["#9ca3af", "#8b929e"], wall: ["#b45309", "#92400e"], water: ["#38bdf8", "#0ea5e9"], tall: "#4a7f38", tint: "255,220,150", tintA: 0.06, fx: "", dark: 0 },
      ritiro: { grass: ["#37994a", "#2f8a3f", "#3fa352"], path: ["#cbbd96", "#bfb18a"], stone: ["#9ca3af", "#8b929e"], wall: ["#b45309", "#92400e"], water: ["#38bdf8", "#0ea5e9"], tall: "#2f8a3f", tint: "255,230,170", tintA: 0.05, fx: "", dark: 0 },
      spiaggia: { grass: ["#f1d9a0", "#ecd093", "#f5e0ae"], path: ["#e8cf9c", "#dfc48c"], stone: ["#9ca3af", "#8b929e"], wall: ["#fde047", "#facc15"], water: ["#0ea5e9", "#0284c7"], tall: "#f1d9a0", tint: "255,210,120", tintA: 0.08, fx: "", dark: 0 },
      quartiere: { grass: ["#78716c", "#6f6a65", "#827b76"], path: ["#a8a29e", "#9a948f"], stone: ["#9ca3af", "#8b929e"], wall: ["#fb7185", "#f43f5e"], water: ["#0ea5e9", "#0284c7"], tall: "#78716c", tint: "255,200,120", tintA: 0.08, fx: "", dark: 0 },
      stadio: { grass: ["#37994a", "#2f8a3f", "#3fa352"], path: ["#9ca3af", "#8b929e"], stone: ["#9ca3af", "#8b929e"], wall: ["#374151", "#1f2937"], water: ["#38bdf8", "#0ea5e9"], tall: "#2f8a3f", tint: "255,245,200", tintA: 0.06, fx: "", dark: 0.08 },
      neve: { grass: ["#e6eef5", "#dde8f1", "#eef3f8"], path: ["#9ca3af", "#8b929e"], stone: ["#94a3b8", "#7f8da3"], wall: ["#d6c7ae", "#cdbd9e"], water: ["#7aa0c0", "#6e94b4"], tall: "#e6eef5", tint: "180,200,255", tintA: 0.1, fx: "snow", dark: 0.06 },
      tokyo: { grass: ["#6b7280", "#656b78", "#757c88"], path: ["#9ca3af", "#8b929e"], stone: ["#94a3b8", "#7f8da3"], wall: ["#3a2a22", "#2a1c16"], water: ["#1e3a8a", "#172554"], tall: "#6b7280", tint: "240,150,220", tintA: 0.16, fx: "petals", dark: 0.2 },
      tempio: { grass: ["#cbd5a0", "#c1cb96", "#d3dcaa"], path: ["#cdbf8c", "#c4b680"], stone: ["#9ca3af", "#8b929e"], wall: ["#7f1d1d", "#5f1515"], water: ["#38bdf8", "#0ea5e9"], tall: "#b4c088", tint: "255,200,160", tintA: 0.1, fx: "dust", dark: 0.08 },
      interno: { grass: ["#d5dde6", "#c4cfda", "#dde4ec"], path: ["#cdbf8c", "#c4b680"], stone: ["#94a3b8", "#7f8da3"], wall: ["#334155", "#1e293b"], water: ["#38bdf8", "#0ea5e9"], tall: "#d5dde6", tint: "255,240,200", tintA: 0.06, fx: "", dark: 0.1 }
    },
    floors: "eljxbgntmw", solid: "PYWJTGBCAEOLMDKSNVUIRFZ",
    act: { P: "Guarda la casa", Y: "Guarda la casa", W: "Guarda la casa", J: "Guarda l'edificio", T: "Guarda la tribuna", G: "Guarda la porta", B: "Siediti in panchina", C: "Leggi il cartellone", A: "Guarda il pino", E: "Guarda la palma", O: "Guarda il ciliegio", L: "Guarda il riflettore", M: "Guarda il muretto", D: "Siediti sul divano", K: "Guarda l'armadietto", S: "Guarda il trofeo", N: "Guarda il borsone", V: "Guarda la vetrata", U: "Guarda l'ombrellone", I: "Guarda il torii", R: "Guarda la roccia", F: "Scaldati al fuoco", Z: "Guarda il mare", s: "Siediti un momento" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi un istante. (Il gioco salva da solo: qui puoi rileggere il Taccuino.)" },
    texts: { nothing: "Niente di utile. Solo il rumore del campo in lontananza.", noHero: "Il Mondiale vuole un Campione: crea prima il tuo personaggio.", seen: "Ti hanno visto! Torni al punto di partenza e riprovi." },
    journal: { name: "Il Taccuino del CT", sub: "Squadra, Catena, legami e finali" },
    crew: { name: "La Nazionale U16", field: 4, members: MEMBERS },
    party: (K) => (K.crew ? K.crew.field().slice(0, 3) : []),
    chain: {
      eng: "__catena", hero: "jolly",
      roles: { jolly: "⭐ Fantasista", regista: "🎯 Regista", ala: "💨 Ala", punta: "🔥 Punta", difensore: "🛡️ Difensore", portiere: "🧤 Portiere" },
      synergy: [["difensore", "regista", 1], ["regista", "ala", 2], ["ala", "punta", 2], ["regista", "punta", 1], ["portiere", "difensore", 1], ["portiere", "regista", 1], ["punta", "ala", 1], ["ala", "regista", 1]]
    },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Compagni", "Amici", "Fratelli", "Squadra"],
      scenes: {
        mg_elio: [{ lv: 2, id: "eli2", lines: [["mg_elio", "Ti spiego una cosa che non dico a nessuno: passo a occhi chiusi perché so dove sei. Non è fiducia: è una mappa."], ["mg_elio", "Ma stasera la mappa la disegno con te."]], reward: (K) => K.bond("intesa", 4) },
          { lv: 3, id: "eli3", prize: "+6 Intesa e la fascia da capitano", lines: [["mg_elio", "Tieni. È la fascia di mio padre. Era capitano di una squadra che non ha mai vinto niente. Ma ha sempre passato la palla."]], reward: (K) => { K.bond("intesa", 6); K.inv.give("mg_fascia"); } }],
        mg_nina: [{ lv: 2, id: "nin2", lines: [["mg_nina", "Corro perché da piccola non mi lasciavano giocare coi maschi. Quindi dovevo scappare prima che mi cacciassero."], ["mg_nina", "Adesso corro per arrivare dove aspettate."]], reward: (K) => K.bond("grinta", 4) },
          { lv: 3, id: "nin3", prize: "+5 Grinta e gli scarpini veloci", lines: [["mg_nina", "Questi sono i miei scarpini del primo gol. Non portano fortuna: portano fretta."]], reward: (K) => { K.bond("grinta", 5); K.inv.give("mg_scarpini"); } }],
        mg_bruno: [{ lv: 2, id: "bru2", lines: [["mg_bruno", "Se sbaglio un gol non dormo. Se lo faccio, non dormo uguale. Sai, il problema non è il gol."], ["mg_bruno", "È che dopo tutti mi guardano come se fosse facile."]], reward: (K) => K.bond("intesa", 4) }],
        mg_gallo: [{ lv: 2, id: "gal2", lines: [["mg_gallo", "Venticinque anni da CT, tre finali perse, una moglie che mi ha detto «basta calcio». Sono qui con voi perché mi ha detto «vai»."]], reward: (K) => K.bond("grinta", 4) }]
      }
    },
    inv: {
      items: {
        mg_fascia: { n: "Fascia da capitano", icon: "🎗️", d: "Era del padre di Elio. Chi la porta ha una responsabilità in più.", match: { at: 0, df: 0, te: 1 }, gift: {}, giftAny: 0 },
        mg_scarpini: { n: "Scarpini veloci", icon: "👟", d: "Quelli del primo gol di Nina: portano fretta.", match: { at: 1, df: 0, te: 0 }, gift: {}, giftAny: 0 },
        mg_borraccia: { n: "Borraccia del raduno", icon: "🥤", d: "Acqua, sale e una sana dose di dispetto.", match: { at: 0, df: 1, te: 0 }, gift: { mg_teo: 6, mg_sandro: 4 }, giftAny: 1 },
        mg_pallone: { n: "Pallone del Mondiale", icon: "⚽", d: "Il pallone ufficiale: leggero, lucido e snob.", match: { at: 0, df: 0, te: 1 }, gift: { mg_bruno: 6, mg_tico: 6 }, giftAny: 1 },
        mg_biglietto: { n: "Accredito allo stadio", icon: "🎟️", d: "Apre la porta dello spogliatoio. Per una sera sei ufficiale.", gift: {}, giftAny: 0 },
        mg_tablet: { n: "Tablet tattico", icon: "📱", d: "Le analisi video di Mara: schemi, avversari, una cartella segreta.", gift: { mg_elio: 6 }, giftAny: 1 }
      }
    },
    endings: {
      oro: ["Campioni del Mondo", "La coppa è vostra. Mister Gallo ride, per la prima volta, e nessuno sa dove metterlo.", "Vinci la finale."],
      argento: ["A Testa Alta", "Il secondo posto ha il sapore del sale: ma anche quello dell'inizio di una storia lunga.", "Perdi la finale."],
      squadra: ["Il Gol di Tutti", "Undici maglie, una sola esultanza. La coppa passa di mano in mano, nessuno la tiene per sé.", "Vinci la finale con Intesa 50 o più."],
      segreto: ["La Catena Perfetta", "Tre catene perfette in un torneo: il Mondiale ricorda ancora quel gol in cui nessuno ha toccato la palla da solo.", "Segreto: vinci la finale con Intesa 50 e almeno 3 catene perfette."]
    },
    guest: { id: "mg_bia", lines: [["mg_bia", "[felice] {n}! Ho chiuso il chiosco per una settimana e sono venuta a vedere il mare degli altri. È più freddo, ma la gente gioca a pallone uguale."], ["mg_bia", "Ho portato il cocco. Nessuno qui sa aprirlo. Ve lo insegno gratis, ma il consiglio su come tirare le punizioni costa un sorriso."]] },
    heroLook: (h) => ({ bg: ["#1e3a8a", "#fde047"], shirt: "#2563eb" }),
    heroTitle: () => "il Campione",
    musicMain: "mondiale",
    music: { mondiale: { bpm: 112, chords: ["C", "G", "Am", "F", "C", "G", "F", "G"], lres: 2, lw: "triangle", lv: 0.04,
      lead: "E5 - G5 - C6 - B5 - | A5 - G5 - E5 - - | D5 - F5 - A5 - G5 - | F5 - E5 - D5 - - - | E5 - G5 - C6 - D6 - | E6 - D6 - C6 - - | D6 - C6 - B5 - A5 - | G5 - - - - - - -",
      bass: "R . . 5 . . R . . 5 . . R . 5 .", bv: 0.1, arp: "1 3 5 3 1 3 5 3", aw: "triangle", av: 0.012, drum: "k . h . s . h . k . h k s . h .", dv: 0.11 } },
    plugins: [{
      hud(g, zid, spec, K) {
        if (!spec) return; g.save(); g.font = "700 8px 'Trebuchet MS', sans-serif";
        const s = `🔥 ${K.stat("grinta")}  🤝 ${K.stat("intesa")}  ⛓ ${K.chain ? K.chain.perfect() : 0}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(6,21,14,.82)"; g.fillRect(4, 4, w, 13); g.fillStyle = "#fde047"; g.fillText(s, 9, 13.5); g.restore();
      }
    }],
    paint: (window.__mgTiles || {}).paint || {}, floorPaint: (window.__mgTiles || {}).floorPaint,
    cameos: []
  });
  const K = E.K;
  window.__mondiale = E.api; window.__mgCore = E; window.__mgK = K; window.__mgPeople = PEOPLE;
  window.__mgH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      // Catena d'attacco: il bonus degli oggetti e l'Intesa aiutano (te = portiere meno reattivo, df = una intercettazione perdonata, at = secondi in più)
      chain(level, opp, title, cb) {
        K.say(H.flush(), () => K.chain.play({ level, oppName: opp, title, te: K.inv.bonus("te"), df: K.inv.bonus("df") + (K.stat("intesa") >= 40 ? 1 : 0), at: K.inv.bonus("at") }, cb));
      },
      // reclutamento a scelta con due vie: sfida a Catena (Intesa +3) oppure aiuto concreto (Grinta −4, Intesa +1)
      recruit(id, o) {
        if (K.crew.has(id)) { H.say(id, o.again || "Ci siamo già detti tutto. In campo!"); return H.done(); }
        H.say(id, o.intro);
        H.ask(o.q || "Come lo convinci?", [
          { label: "⛓ Sfidalo a una Catena", sub: "Se vinci, entra in squadra", big: true, cls: "hot", fn: () => H.chain(o.level || 1, o.opp, o.title || "Catena · Selezione", (r) => {
            if (r && r.win) { K.crew.recruit(id); K.bond("intesa", 3); H.say(id, o.win); H.say("voce", `<b>${K.crew.members[id].n}</b> entra nella Nazionale.`); } else H.say(id, o.lose || "Non ancora. Riprova quando vuoi.");
            H.done(); }) },
          { label: "🤝 " + o.helpLabel, sub: "Grinta −4, Intesa +1", fn: () => { if (K.stat("grinta") < 4) { H.say("voce", "Sei troppo stanco per aiutarlo: recupera Grinta con i gettoni o riposando."); return H.done(); } K.bond("grinta", -4); K.bond("intesa", 1); K.crew.recruit(id); H.say("voce", o.help); H.say(id, o.helpWin); H.say("voce", `<b>${K.crew.members[id].n}</b> entra nella Nazionale.`); H.done(); } },
          { label: "Non ora", fn: H.done }
        ]);
      },
      plaque(g, txt, x, y, col) { g.font = "bold 7px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(6,21,14,.88)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#fde047"; g.fillRect(x - w / 2, y + 2, w, 1); g.fillStyle = "#ecfdf5"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
      people() {
        H.cast("mg_gallo", "Mister Gallo", "CT della Nazionale U16", { style: "bald", hair: "#9ca3af", beard: "folta", acc: ["fischietto"], shirt: "#1d4ed8", skin: "#d9a679", bg: ["#1e3a8a", "#bfdbfe"] }, "Venticinque anni di panchina, tre finali perse e una pazienza di marmo. Non ride mai: lo dice lui, che ride dentro.");
        H.cast("mg_mara", "Dottoressa Mara", "Medico e analista", { style: "bun", hair: "#7c2d12", acc: ["occhiali"], shirt: "#f8fafc", skin: "#e8c3a0", bg: ["#134e4a", "#99f6e4"] }, "Cura i polpacci e legge le partite come se fossero radiografie. Ha un tablet pieno di verità scomode.");
        H.cast("mg_elio", "Elio Moro", "Regista", { style: "slick", hair: "#1f2937", shirt: "#2563eb", skin: "#e0b890", bg: ["#1e3a8a", "#bfdbfe"] }, "Gioca a testa alta e passa a occhi chiusi. Parla poco e sa sempre dove sei.");
        H.cast("mg_nina", "Nina Salvi", "Ala", { style: "ponytail", hair: "#92400e", shirt: "#2563eb", skin: "#e8c3a0", bg: ["#9d174d", "#fbcfe8"] }, "La più veloce del raduno. Ha le gambe lunghe e la lingua più veloce delle gambe.");
        H.cast("mg_bruno", "Bruno Costa", "Punta", { style: "spiky", hair: "#111827", shirt: "#2563eb", skin: "#d9a679", bg: ["#7f1d1d", "#fecaca"] }, "Segna con tutto. Quando sbaglia, dice che era una finta.");
        H.cast("mg_teo", "Teo Ferri", "Difensore", { style: "buzz", hair: "#3a2a1a", shirt: "#2563eb", skin: "#c68642", bg: ["#14532d", "#bbf7d0"] }, "Un muro con i calzettoni. Quando sorride sembra che qualcuno stia spostando un armadio.");
        H.cast("mg_sandro", "Sandro Greco", "Portiere", { style: "short", hair: "#111", acc: ["guanti"], shirt: "#facc15", skin: "#e0b890", bg: ["#713f12", "#fef08a"] }, "Parla con i pali, e giura che a volte rispondono.");
        H.cast("mg_tico", "Tico Valente", "Ala", { style: "afro", hair: "#1f1308", shirt: "#facc15", skin: "#a16a3c", bg: ["#14532d", "#fde68a"] }, "Dribbla in quattro metri quadrati. Ha sempre una canzone in testa e una scusa pronta.");
        H.cast("mg_bia", "Dona Bia", "Gestrice del chiosco", { style: "bun", hair: "#d4d4d8", acc: ["grembiule"], shirt: "#be123c", skin: "#a16a3c", bg: ["#831843", "#fbcfe8"] }, "Serve cocco, cachaça analcolica e consigli a chi non li chiede.");
        H.cast("mg_duarte", "Capitão Duarte", "CT del Brasile", { style: "slick", hair: "#1f2937", beard: "baffi", shirt: "#16a34a", skin: "#a16a3c", bg: ["#14532d", "#fde047"] }, "Coach del Brasile U16. Ama il bel gioco e odia chi lo ferma.");
        H.cast("mg_lukas", "Lukas Brandt", "Difensore e meccanico", { style: "short", hair: "#d6b87a", shirt: "#e5e7eb", skin: "#f1c8a0", bg: ["#1f2937", "#d1d5db"] }, "Ripara biciclette di notte e anticipa attaccanti di giorno. Parla un italiano da manuale di istruzioni.");
        H.cast("mg_falk", "Herr Falk", "Assistente tedesco", { style: "bald", hair: "#6b7280", acc: ["occhiali"], shirt: "#111827", skin: "#f1c8a0", bg: ["#111827", "#9ca3af"] }, "Cura gli «scouting» della Germania. Dice sempre «per caso» prima di quello che ha fatto apposta.");
        H.cast("mg_ren", "Ren Hayate", "Capitano del Giappone", { style: "spiky", hair: "#0b0b12", shirt: "#f8fafc", skin: "#f1d6b8", bg: ["#7f1d1d", "#fecaca"] }, "Capitano gentile e implacabile. Gioca con un sorriso che non è una tregua.");
        H.cast("mg_yuki", "Yuki", "Padrona del ryokan", { style: "bun", hair: "#111827", shirt: "#7c3aed", skin: "#f1d6b8", bg: ["#4c1d95", "#ddd6fe"] }, "Serve il tè e legge nel pensiero. Dice che si tratta solo di guardare i piedi.");
      }
    };
    
    return H;
  };
})();
