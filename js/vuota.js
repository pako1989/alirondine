// js/vuota.js - «OPERAZIONE SCATOLA VUOTA» · configurazione della saga sul motore comune (js/saga-core.js)
// Isola di Capo Silenzio, Bastione Nove, una finale truccata dodici anni fa e una squadra di recupero con una scatola di cartone.
// Tono: ironia di base (la scatola, la radio, i guardiani distratti) con momenti seri (i quattro ex compagni, il Rapporto Zero).
// Usa dal core: furtivo (guardie con cono, tessere nascoste, buio e luci), orologio a fasce, Rapporti, Inventario, interni a mano, K.ownMatch, K.playMatch.
// NOVITÀ: Allerta (cfg.alert, opt-in nel core: livello globale che sale a ogni avvistamento e allarga i coni) + cfg.hiding (nascondersi per codice: la scatola in esplorazione)
// + minigioco «Infiltrazione» (js/vuota-inf.js, rompicapo furtivo a turni, anche in Sala Giochi). Diversa da: Doppio Zero (spia a tempo), Neo-Rondine (droni + hacking), Pedinamento.
(function () {
  "use strict";
  if (window.__vuota || !window.__sagaCore) return;
  const rn = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + (s || 0) * 74.7) * 43758.5453; return v - Math.floor(v); };
  const box = (K) => (K.F.get("vs_bx", 0) | 0) > Date.now();
  // ------------------------------------------------------------ aiuti per le zone (condivisi dai capitoli)
  const H = {
    rn,
    plaque(g, txt, x, y, col) { g.font = "bold 7px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(14,16,20,.9)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#facc15"; g.fillRect(x - w / 2, y + 2, w, 1); g.fillStyle = "#f1f5f9"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
    border(L, w, h, ch) { L.lay(0, 0, w - 1, 0, ch); L.lay(0, h - 1, w - 1, h - 1, ch); L.lay(0, 0, 0, h - 1, ch); L.lay(w - 1, 0, w - 1, h - 1, ch); },
    scatter(L, seed, x0, y0, x1, y1, ch, n, avoid) { let c = 0; for (let i = 0; i < n * 6 && c < n; i++) { const x = x0 + Math.floor(rn(i, seed, 1) * (x1 - x0 + 1)), y = y0 + Math.floor(rn(i, seed, 2) * (y1 - y0 + 1)); if (avoid && avoid(x, y)) continue; L.put(x, y, ch); c++; } },
    guard(route, o) { o = o || {}; return Object.assign({ id: "vs_guardia", at: route[0], route, speed: o.speed || 0.5, guard: { range: o.range || 4, cone: o.cone || 0.55 } }, o.extra || {}); },
    post(at, face, o) { o = o || {}; return { id: "vs_guardia", at, face, guard: { range: o.range || 4, cone: o.cone || 0.55, turn: o.turn || 0 } }; },
    // i personaggi: un solo posto per le comparse ricorrenti
    cast(K) {
      const C = (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio);
      C("vs_ottone", "Ottone", "Maestro del travestimento", { style: "bald", hair: "#bbb", beard: "baffi", acc: ["cappellino"], shirt: "#92400e", skin: "#d9a679", bg: ["#78350f", "#fde68a"] }, "Predica la scatola di cartone come altri predicano un santo. Ha un segreto più grande della scatola.");
      C("vs_vulpe", "Vulpe", "Operatrice radio", { style: "bob", hair: "#c2410c", acc: ["cuffie"], shirt: "#0f766e", skin: "#e8c4a0", bg: ["#134e4a", "#99f6e4"] }, "La voce nella cuffia: ironica, precisa e sempre un passo avanti. Non ha mai messo piede sull'isola. Finora.");
      C("vs_mira", "Mira Quarantadue", "Tecnica e ex portiere", { style: "ponytail", hair: "#1f2937", acc: ["guanti", "visiera"], shirt: "#4d7c0f", skin: "#c68642", bg: ["#365314", "#d9f99d"] }, "Ex portiere, oggi aggiusta tutto ciò che ha una vite. Il numero Quarantadue è una storia che non racconta.");
      C("vs_ghiro", "Ghiro", "Pescatore e informatore", { style: "messy", hair: "#6b7280", beard: "folta", acc: ["paglia"], shirt: "#1e40af", skin: "#c99a6a", bg: ["#1e3a8a", "#bfdbfe"] }, "Dorme in piedi, sente tutto. Conosce ogni turno di guardia dell'isola, più per noia che per spirito di servizio.");
      C("vs_nena", "Nena", "Barista del molo", { style: "bun", hair: "#7a3a1a", acc: ["grembiule"], shirt: "#be185d", skin: "#e0b48a", bg: ["#831843", "#fbcfe8"] }, "Serve caffè a tutti e domande a pochi.");
      C("vs_guardia", "Guardia della Fondazione", "Sorveglianza", { style: "buzz", hair: "#111", acc: ["casco"], shirt: "#3f4a3a", skin: "#d9a679", bg: ["#1f2a1c", "#a3b18a"] }, "Pattuglia con un'attenzione che dura quanto il turno.");
      C("vs_corvo", "Corvo", "Capo della Sorveglianza · ex difensore", { style: "slick", hair: "#0f172a", beard: "pizzetto", scar: true, shirt: "#111827", skin: "#cfa07a", bg: ["#0f172a", "#94a3b8"] }, "Ex difensore degli Aironi. Sente ogni passo, e anche quelli che non hai ancora fatto.");
      C("vs_brace", "Brace", "Capo delle Luci · ex ala", { style: "spiky", hair: "#b45309", streak: "#fbbf24", shirt: "#7c2d12", skin: "#e0ac7e", bg: ["#7c2d12", "#fed7aa"] }, "Ex ala degli Aironi. Ha cambiato i riflettori con quelli di un faro. La luce, dice, non perdona e non dimentica.");
      C("vs_pio", "Pio", "Magazziniere · sempre assonnato", { style: "messy", hair: "#78716c", shirt: "#65a30d", skin: "#e8b88a", bg: ["#365314", "#d9f99d"] }, "Custode delle chiavi delle officine. Dorme più di un gatto e sa più di un archivista: basta non svegliarlo.");
      C("vs_lastra", "Lastra", "Custode dell'Archivio · ex portiere", { style: "bun", hair: "#cbd5e1", acc: ["occhiali"], shirt: "#334155", skin: "#e8d0b8", bg: ["#1e293b", "#cbd5e1"] }, "Ex portiere degli Aironi. Oggi conserva tutto al freddo, ricordi compresi.");
      C("vs_eco", "Eco", "Direttore del Campo Zero · ex regista", { style: "side", hair: "#78716c", acc: ["medaglia"], shirt: "#44403c", skin: "#d9a679", bg: ["#292524", "#d6d3d1"] }, "Ex regista degli Aironi. Passava sempre la palla alla persona giusta. Poi ha passato la cosa sbagliata.");
      C("vs_camera", "Telecamera", "Sorveglianza fissa", { shape: "robot", shirt: "#374151", skin: "#6b7280", eye: "#ef4444", bg: ["#111827", "#94a3b8"] }, "Un occhio di vetro su un collo di acciaio. Non dorme, non sbatte le palpebre e non ha mai capito cos'è un pallone.");
      C("vs_sipario", "Aurelia Sipario", "Presidente della Fondazione", { style: "bun", hair: "#e5e7eb", acc: ["occhiali"], shirt: "#581c87", skin: "#efd2bb", bg: ["#3b0764", "#e9d5ff"] }, "Dice sempre «per il bene del gioco». Non ha mai dichiarato di quale gioco parla.");
    },
  };
  window.__vuotaH = H;
  const E = window.__sagaCore.create({
    id: "vuota", key: "ali-di-rondine.vuota", title: "Operazione Scatola Vuota", icon: "📦", bg: "vs_titolo", chapters: 4,
    menuSub: "Un'isola, una base, una scatola di cartone e una finale truccata. Entra nel Bastione senza farti vedere.",
    theme: { accent: "#facc15", ink: "#f1f5f9", paper: "rgba(15,20,26,.9)", font: "'Trebuchet MS', 'Courier New', monospace", chipBg: "#1f2937", chipBorder: "#facc15" },
    stats: { silenzio: [0, 9, 5, "Silenzio"], fiducia: [0, 9, 5, "Fiducia"], scatole: [0, 6, 3, "Scatole"] },
    regions: {
      costa: { grass: ["#8a9a5a", "#7f9050", "#95a463"], path: ["#c9b98a", "#bda97a"], stone: ["#8a8a80", "#7e7e74"], wall: ["#d9c8a8", "#cbb999"], water: ["#2f7aa8", "#296f9c"], tree: "#3a6a3a", tint: "255,175,110", tintA: 0.12, fx: "" },
      bastione: { grass: ["#3a4a3a", "#344434", "#405040"], path: ["#6a6a6a", "#606060"], stone: ["#4a4e56", "#40444c"], wall: ["#3a4048", "#30363e"], water: ["#1a3a5a", "#163450"], tree: "#243a2a", tint: "30,50,100", tintA: 0.16, fx: "", dark: 0.2 },
      archivio: { grass: ["#9fb4c4", "#94aabb", "#a8bccb"], path: ["#cbd5e1", "#c0cad6"], stone: ["#94a3b8", "#8896ac"], wall: ["#64748b", "#586579"], water: ["#38bdf8", "#2eb0ec"], tree: "#475569", tint: "180,220,255", tintA: 0.12, fx: "", dark: 0.1 },
      torre: { grass: ["#1f2937", "#1b2432", "#243041"], path: ["#374151", "#313c4b"], stone: ["#2b3544", "#252e3d"], wall: ["#111827", "#0d1320"], water: ["#1e3a5f", "#1a3454"], tree: "#14202e", tint: "148,163,184", tintA: 0.12, fx: ["rain", "rain"], dark: 0.22 },
      capanna: { grass: ["#7c5a3a", "#74533a", "#85633f"], path: ["#a47a4a", "#9a7144"], stone: ["#6b5b4b", "#5f5042"], wall: ["#5a3f28", "#4d3622"], water: ["#2f7aa8", "#296f9c"], tree: "#3a6a3a", tint: "255,200,120", tintA: 0.12, fx: "" },
      officina: { grass: ["#4b5563", "#454e5b", "#525c69"], path: ["#6b7280", "#626976"], stone: ["#4a4e56", "#40444c"], wall: ["#374151", "#2e3846"], water: ["#1a3a5a", "#163450"], tree: "#243a2a", tint: "250,204,21", tintA: 0.06, fx: "" },
      campo: { grass: ["#2f7d3e", "#2a7438", "#378748"], path: ["#bda97a", "#b19d6e"], stone: ["#4b5563", "#434c59"], wall: ["#1f2937", "#18202d"], water: ["#1a3a5a", "#163450"], tree: "#14202e", tint: "255,240,200", tintA: 0.06, fx: "", dark: 0.1 }
    },
    floors: "ekcdhmoiruxs", solid: "KFAQVJEZYP",
    act: { q: "Entra", v: "Esci", K: "Guarda le casse", F: "Guarda la recinzione", Q: "Guarda il faro", V: "Guarda il distributore", J: "Usa la radio", E: "Guarda il container", Z: "Guarda i server", Y: "Guarda gli scaffali", P: "Leggi il cartello", x: "Guarda la scatola" },
    flavor: {
      K: "Casse di legno impilate. Sul fianco: «MATERIALE SPORTIVO». Dentro, a giudicare dal peso, non ci sono palloni.",
      F: "Rete metallica, tre metri di altezza, filo spinato in cima. Qualcuno ha attaccato un cartello: «PROPRIETÀ PRIVATA. ANCHE I GABBIANI».",
      Q: "Un faro di sorveglianza: lampada grande come un tombino e una pazienza ancora più grande.",
      V: "Un distributore: «Caffè», «Caffè lungo», «Caffè con rimpianto». L'ultimo è esaurito.",
      E: "Un container color ruggine. La serratura è nuova, tutto il resto è antico.",
      Z: "Armadi di server con le lucine che lampeggiano come se ridessero di te.",
      Y: "Scaffali alti fino al soffitto, cartelle numerate. Il polline, in questo posto, non è mai arrivato.",
      P: "Un cartello: «SILENZIO». Qualcuno, sotto, ha scritto «grazie» con una vernice che sembra ironica.",
      x: "Una scatola di cartone, vuota. Poco più grande di una persona. Lo sguardo di Ottone è già lì dentro."
    },
    journal: { name: "Il Dossier di Squadra Nove", sub: "Allerta, legami, scatole e finali" },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi. Il mare, lontano, borbotta come un coro stanco. (Il gioco salva da solo.)" },
    texts: { seen: "«Ehi!» Una torcia ti prende in pieno. Un attimo dopo sei di nuovo dove eri, con il cuore a duecento battiti.", nothing: "Niente di utile qui. Solo vento e sale.", noHero: "Serve un Campione per l'operazione. Crea prima il tuo." },
    alert: { max: 3, names: ["Calma", "Sospetto", "Allarme", "Caccia"], rangeMul: 0.22, decay: true, hud: true },
    hiding: (K) => box(K),
    heroFx: (K) => (box(K) ? { s: 0.02 } : null),
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Colleghi", "Fidati", "Famiglia di squadra"],
      scenes: {
        vs_ottone: [{ lv: 2, id: "ott2", lines: [["vs_ottone", "La scatola non nasconde: aspetta. Il trucco è non avere fretta di essere altrove."], ["vs_ottone", "Io ho passato dodici anni a nascondermi, e non da una guardia."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "ott3", prize: "+2 Scatole", lines: [["vs_ottone", "Questa è la mia scatola. Quella buona. L'ho piegata per la prima volta in un spogliatoio, nel giorno più lungo della mia vita."], ["vs_ottone", "Tienila. Falla lavorare. E non chiedermi quale giorno."]], reward: (K) => { K.bond("scatole", 2); K.inv.give("vs_scatola"); } }],
        vs_vulpe: [{ lv: 2, id: "vul2", lines: [["vs_vulpe", "Sto in un furgone, al buio, con le cuffie. L'isola per me è un bip. Tu sei il bip che si muove."], ["vs_vulpe", "Non farmi preoccupare. Sono pessima a preoccuparmi in silenzio."]], reward: (K) => K.bond("silenzio", 1) },
          { lv: 3, id: "vul3", prize: "+1 Fiducia e la radiolina di Vulpe", lines: [["vs_vulpe", "Ti lascio la mia radiolina. Se ti perdi, chiama. Se ti trovi, chiama lo stesso."], ["vs_vulpe", "Non sono sentimentale. Sono pratica con un cuore."]], reward: (K) => { K.bond("fiducia", 1); K.inv.give("vs_radiolina"); } }],
        vs_mira: [{ lv: 2, id: "mir2", lines: [["vs_mira", "Il quarantadue è il numero dei gol che mi hanno segnato in una sola partita. L'ho tenuto per ricordarmelo."], ["vs_mira", "Quando metti un numero così addosso, o ci ridi o ci vivi. Io ci ripara."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "mir3", prize: "+1 Scatola", lines: [["vs_mira", "Ho montato un fondo doppio nella tua scatola. Non si vede, non fa rumore, non fa domande."], ["vs_mira", "Funziona. A volte funziona anche meglio di me."]], reward: (K) => K.bond("scatole", 1) }],
        vs_ghiro: [{ lv: 2, id: "ghi2", lines: [["vs_ghiro", "Mi hanno chiesto di dormire di meno. Ho risposto che la sveglia è il mio unico nemico."], ["vs_ghiro", "Qui nessuno chiede niente. È per questo che si sente tutto."]], reward: (K) => K.bond("silenzio", 1) },
          { lv: 3, id: "ghi3", prize: "+1 Silenzio e +1 Scatola", lines: [["vs_ghiro", "Una cosa che so e non ho detto a nessuno: il giro del faro ha un buco di tre minuti. Quando bevono il caffè."], ["vs_ghiro", "Non ti dico quando. Ti dico di ascoltare le tazze."]], reward: (K) => { K.bond("silenzio", 1); K.bond("scatole", 1); } }]
      }
    },
    inv: {
      items: {
        vs_scatola: { n: "Scatola di Ottone", icon: "📦", d: "Cartone consumato, fondo doppio. Ha visto più imboscate di un generale.", gift: { vs_ottone: 8 }, react: { vs_ottone: "La mia scatola! Me l'avevano tolta. Come hai fatto? No, non dirmelo: è più bello così." } },
        vs_radiolina: { n: "Radiolina di Vulpe", icon: "📻", d: "Piccola, grigia, con un adesivo di una volpe. Funziona a batterie e a testardaggine.", gift: { vs_vulpe: 8 }, react: { vs_vulpe: "La mia radiolina! La riconosco dall'adesivo. Mi mancava più di quanto ammetterò." } },
        vs_razione: { n: "Razione di campo", icon: "🥫", d: "Fagioli e un cucchiaio ripiegato. Per chi ha fame e poche pretese.", gift: { vs_ghiro: 6, vs_mira: 4 }, giftAny: 2 },
        vs_foto: { n: "Foto degli Aironi", icon: "🖼️", d: "Undici ragazzi in posa, una coppa al centro. In fondo, qualcuno ha tagliato un angolo.", gift: { vs_lastra: 8, vs_corvo: 8, vs_brace: 8, vs_eco: 8 }, react: { vs_corvo: "Questa foto... Dove l'hai trovata? Io non l'ho più toccata da quel giorno.", vs_lastra: "L'abbiamo fatta il giorno prima. Eravamo felici, e non lo sapevamo." } },
        vs_pallone: { n: "Pallone scucito", icon: "⚽", d: "Un pallone di cuoio, scucito sul fianco. Dentro, qualcosa fa «tic».", gift: { vs_corvo: 6, vs_brace: 6 }, giftAny: 2 }
      }
    },
    clock: { slots: ["Alba", "Giorno", "Tramonto", "Notte"], hud: true, tint: ["rgba(255,170,120,.10)", null, "rgba(251,113,60,.14)", "rgba(10,18,50,.30)"] },
    endings: {
      pubblico: ["Il Rapporto Pubblico", "Il Rapporto Zero esce dall'isola e arriva a tutti. Dodici anni di silenzio finiscono in una mattina.", "Scegli di diffondere il Rapporto con Fiducia 5 o più."],
      fuoco: ["Il Rapporto Bruciato", "Il Rapporto Zero brucia. Nessuno sa più chi ha detto cosa. Ottone resta in piedi, con le mani vuote e il cuore sporco.", "Scegli di bruciare il Rapporto."],
      scatola: ["La Scatola Vuota", "Non porti via niente. Lasci sul tavolo il Rapporto e la scatola. Il gioco, per la prima volta, riparte pulito.", "Fiducia 7, Silenzio 6, e la Foto degli Aironi in tasca."],
      silenzio: ["Il Silenzio", "Le luci si accendono, i cani abbaiano e la porta si chiude. L'isola ricomincia come prima. Ma la scatola, in un angolo, è ancora lì.", "Fallisci l'ultima infiltrazione."]
    },
    heroLook: () => ({ bg: ["#1f2937", "#facc15"], shirt: "#1d4ed8" }),
    heroTitle: () => "agente di Squadra Nove",
    musicMain: "vuota",
    music: { vuota: { bpm: 96, chords: ["Am", "F", "C", "G", "Am", "F", "Dm", "E"], lres: 2, lw: "triangle", lv: 0.04,
      lead: "A4 - - C5 - E5 - - | D5 - - F5 - A4 - - | E5 - - G5 - C5 - - | D5 - - B4 - G4 - - | A4 - - C5 - E5 - - | F5 - - A5 - F5 - - | D5 - - F5 - D5 - - | E5 - - - - - - -",
      bass: "R . . . R . . 5 . . . . R . 5 .", bv: 0.1, arp: "1 5 3 5 1 5 3 5", aw: "triangle", av: 0.012, drum: "k . . . h . . . s . . . h . k .", dv: 0.1 } },
    cameos: [],
    guest: { id: "vs_vulpe", lines: ["Sono io, la voce. Per una volta ti parlo di persona. Il furgone aveva finito il caffè.", "Se ti serve una scatola, una radio o una scusa credibile, sai a chi chiedere."] },
    stadium: { azPitch: "campo", cageField: 2, cageMut: "narrow", venue: { ads: [["SIPARIO", "#581c87"], ["BASTIONE 9", "#374151"], ["SILENZIO", "#111827"], ["AIRONI", "#15803d"]], crowd: ["#374151", "#581c87", "#f1f5f9"], ground: ["#2f7d3e", "#2a7438"], line: "#f1f5f9", sky: ["#0f172a", "#334155"], wall: ["#1f2937", "#18202d"], glow: "250,204,21" } },
    // ------------------------------------------------------------ tessere
    floorPaint(K, f, sx, sy, tx, ty) {
      const P = K.P, g = K.g, fr = Math.floor(performance.now() / 16), r = (s) => rn(tx, ty, s);
      if (f === "e") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#d8c48a" : "#d1bd82"); for (let i = 0; i < 4; i++) if (r(i) < 0.5) P(sx + Math.floor(r(i + 9) * 14), sy + Math.floor(r(i + 5) * 14), 1, 1, "#b8a468"); if (r(20) < 0.07) { P(sx + 5, sy + 8, 4, 2, "#f1e6c8"); P(sx + 6, sy + 7, 2, 1, "#e0c9a0"); } if (r(21) < 0.05) P(sx + 3, sy + 4, 3, 2, "#8a7a5a"); return true; }
      if (f === "k") { P(sx, sy, 16, 16, "#a39c8c"); [[0, 0], [8, 0], [4, 5], [12, 5], [0, 10], [8, 10]].forEach(([a, b], i) => { P(sx + a + (i % 2), sy + b, 7, 4, (tx + ty + i) % 3 ? "#b6af9e" : "#aaa392"); P(sx + a + (i % 2), sy + b + 4, 7, 1, "rgba(0,0,0,.22)"); }); return true; }
      if (f === "c") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#585d66" : "#53585f"); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.3)"); P(sx + 15, sy, 1, 16, "rgba(0,0,0,.18)"); if (r(1) < 0.12) P(sx + 3, sy + 6, 9, 2, "rgba(255,255,255,.05)"); if (r(2) < 0.08) { g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 5, 3, 0, 0, 7); g.fill(); } if (ty % 6 === 0 && tx % 2 === 0) P(sx + 2, sy + 7, 12, 2, "#facc15"); return true; }
      if (f === "h") { P(sx, sy, 16, 16, "#1c1c1f"); g.fillStyle = "#facc15"; for (let i = -2; i < 5; i++) { g.beginPath(); g.moveTo(sx + i * 6, sy + 16); g.lineTo(sx + i * 6 + 3, sy + 16); g.lineTo(sx + i * 6 + 11, sy); g.lineTo(sx + i * 6 + 8, sy); g.closePath(); g.fill(); } P(sx, sy, 16, 16, "rgba(0,0,0,.28)"); return true; }
      if (f === "m") { P(sx, sy, 16, 16, "#1d232b"); g.strokeStyle = "#475569"; g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx, sy + i * 4 + 2); g.lineTo(sx + 16, sy + i * 4 + 2); g.stroke(); g.beginPath(); g.moveTo(sx + i * 4 + 2, sy); g.lineTo(sx + i * 4 + 2, sy + 16); g.stroke(); } P(sx, sy, 16, 1, "rgba(255,255,255,.08)"); return true; }
      if (f === "o") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#e2e8f0" : "#dbe3ee"); P(sx, sy + 15, 16, 1, "#94a3b8"); P(sx + 15, sy, 1, 16, "#94a3b8"); if (r(3) < 0.06) P(sx + 4, sy + 5, 8, 1, "rgba(100,116,139,.25)"); return true; }
      if (f === "i") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#bfdbfe" : "#b4d2f5"); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1; if (r(4) < 0.4) { g.beginPath(); g.moveTo(sx + 2, sy + 13); g.lineTo(sx + 7, sy + 8); g.lineTo(sx + 11, sy + 10); g.lineTo(sx + 14, sy + 3); g.stroke(); } const sp = (fr / 6 + tx * 3 + ty * 7) % 40; if (sp < 3) P(sx + Math.floor(r(5) * 13), sy + Math.floor(r(6) * 13), 2, 2, "#fff"); return true; }
      if (f === "d") { P(sx, sy, 16, 16, "#4a1d2c"); P(sx, sy, 16, 1, "rgba(255,255,255,.05)"); if ((tx + ty) % 2 === 0) { P(sx + 6, sy + 6, 4, 4, "#6b2a3e"); } return true; }
      if (f === "r") { P(sx, sy, 16, 16, "#8a6a42"); for (let i = 0; i < 4; i++) { P(sx, sy + i * 4, 16, 1, "rgba(0,0,0,.28)"); if (r(i + 11) < 0.4) P(sx + Math.floor(r(i) * 14), sy + i * 4 + 2, 1, 1, "#5a4228"); } P(sx + ((tx * 5) % 12), sy, 1, 16, "rgba(0,0,0,.12)"); return true; }
      if (f === "u") { P(sx, sy, 16, 16, "#8a8f94"); for (let i = 0; i < 6; i++) P(sx + Math.floor(r(i) * 14), sy + Math.floor(r(i + 7) * 14), 2, 2, i % 2 ? "#a5aaaf" : "#707479"); return true; }
      if (f === "x") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#585d66" : "#53585f"); P(sx + 2, sy + 4, 12, 10, "#a8794a"); P(sx + 2, sy + 4, 12, 3, "#c4935a"); P(sx + 7, sy + 4, 2, 10, "#8a5f38"); P(sx + 3, sy + 10, 10, 1, "#8a5f38"); P(sx + 4, sy + 11, 3, 1, "#2a1a0a"); K.glow && K.glow(g, sx + 8, sy + 9, 12, "250,204,21", 0.08 + 0.04 * Math.sin(fr / 20)); return true; }
      if (f === "s") { P(sx, sy, 16, 16, "#9a7a52"); P(sx + 2, sy + 5, 12, 3, "#5a4228"); P(sx + 2, sy + 8, 2, 5, "#3a2a18"); P(sx + 12, sy + 8, 2, 5, "#3a2a18"); P(sx + 2, sy + 2, 12, 3, "#7a5a38"); return true; }
      return false;
    },
    paint: {
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 15, 3); g.fillStyle = (tx + ty) % 2 ? "#8a6a3a" : "#7d5f33"; g.fillRect(sx + 1, sy + 3, 14, 11); g.fillStyle = "#a47c44"; g.fillRect(sx + 1, sy + 3, 14, 2); g.fillStyle = "#4a3318"; g.fillRect(sx + 1, sy + 8, 14, 1); g.fillRect(sx + 7, sy + 3, 1, 11); g.fillStyle = "#e5e7eb"; g.fillRect(sx + 3, sy + 10, 4, 2); },
      F(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 14, 16, 2); g.strokeStyle = "#9ca3af"; g.lineWidth = 0.7; for (let i = -4; i < 20; i += 3) { g.beginPath(); g.moveTo(sx + i, sy + 14); g.lineTo(sx + i + 8, sy + 2); g.stroke(); g.beginPath(); g.moveTo(sx + i + 8, sy + 14); g.lineTo(sx + i, sy + 2); g.stroke(); } g.fillStyle = "#4b5563"; g.fillRect(sx + (tx % 2 ? 0 : 14), sy, 2, 16); g.fillStyle = "#6b7280"; g.fillRect(sx, sy, 16, 2); g.strokeStyle = "#374151"; g.beginPath(); for (let i = 0; i < 16; i += 2) { g.moveTo(sx + i, sy); g.lineTo(sx + i + 1, sy - 2); } g.stroke(); },
      A(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g, c = ["#4b5058", "#434850", "#52575f"]; g.fillStyle = c[(tx * 3 + ty) % 3]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(sx, sy, 16, 2); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(sx + 3 + (tx % 3) * 3, sy + 6, 7, 1); g.fillRect(sx + 1 + (ty % 3) * 3, sy + 11, 9, 1); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx + 12, sy, 4, 16); if (rn(tx, ty, 8) < 0.2) { g.fillStyle = "#3d6a3a"; g.fillRect(sx + 4, sy + 2, 4, 2); } },
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 14, 12, 2); g.fillStyle = "#374151"; g.fillRect(sx + 6, sy + 6, 4, 9); g.fillStyle = "#1f2937"; g.fillRect(sx + 2, sy + 1, 12, 7); const a = 0.5 + 0.3 * Math.sin(fr / 14 + tx); g.fillStyle = `rgba(254,240,138,${a})`; g.fillRect(sx + 4, sy + 2, 8, 5); K.light(sx + 8, sy + 6, 52, "254,240,160", 0.3); K.glow(g, sx + 8, sy + 5, 18, "254,240,160", 0.2); },
      V(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 2, sy + 1, 12, 14); g.fillStyle = "#0f172a"; g.fillRect(sx + 4, sy + 3, 8, 6); for (let i = 0; i < 3; i++) { g.fillStyle = (Math.floor(fr / 20) + i) % 3 ? "#f59e0b" : "#fde68a"; g.fillRect(sx + 5 + i * 2.5, sy + 4, 1.6, 4); } g.fillStyle = "#111827"; g.fillRect(sx + 5, sy + 11, 6, 2); K.light(sx + 8, sy + 6, 30, "255,200,120", 0.12); },
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#374151"; g.fillRect(sx + 1, sy + 3, 14, 11); g.fillStyle = "#111827"; g.fillRect(sx + 2, sy + 4, 12, 4); g.fillStyle = `rgba(74,222,128,${0.6 + 0.3 * Math.sin(fr / 9)})`; g.fillRect(sx + 3, sy + 5, 6, 2); g.fillStyle = "#9ca3af"; g.beginPath(); g.arc(sx + 5, sy + 11, 2, 0, 7); g.arc(sx + 11, sy + 11, 2, 0, 7); g.fill(); g.fillStyle = "#facc15"; g.fillRect(sx + 12, sy - 3, 1, 6); K.glow(g, sx + 8, sy + 6, 16, "74,222,128", 0.1); },
      E(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g, c = ["#9a3412", "#1d4ed8", "#166534"][(Math.floor(tx / 2) + ty) % 3]; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = c; g.fillRect(sx, sy + 1, 16, 14); g.fillStyle = "rgba(0,0,0,.25)"; for (let i = 0; i < 16; i += 3) g.fillRect(sx + i, sy + 2, 1, 12); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx, sy + 1, 16, 2); g.fillStyle = "#e5e7eb"; if (tx % 2 === 0) g.fillRect(sx + 3, sy + 8, 6, 1); },
      Z(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#1f2937"; g.fillRect(sx + 1, sy + 1, 14, 14); g.fillStyle = "#0b1220"; g.fillRect(sx + 2, sy + 2, 12, 12); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const on = (Math.floor(fr / 12) + i * 3 + j + tx) % 5; g.fillStyle = on === 0 ? "#fb7185" : on < 3 ? "#4ade80" : "#164e63"; g.fillRect(sx + 3 + j * 4, sy + 3 + i * 3, 2, 1.5); } },
      Y(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 14, 16, 2); g.fillStyle = "#475569"; g.fillRect(sx, sy, 16, 15); g.fillStyle = "#334155"; for (let i = 0; i < 3; i++) g.fillRect(sx, sy + 4 + i * 4, 16, 1); const cols = ["#f87171", "#fbbf24", "#60a5fa", "#a3e635", "#e2e8f0"]; for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) { g.fillStyle = cols[Math.floor(rn(tx + j, ty + i, 12) * 5)]; g.fillRect(sx + 1 + j * 3, sy + 1 + i * 4, 2, 3); } },
      P(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3a2a18"; g.fillRect(sx + 7, sy + 8, 2, 8); g.fillStyle = "#e5e7eb"; g.fillRect(sx + 2, sy + 1, 12, 8); g.fillStyle = "#111827"; g.fillRect(sx + 3, sy + 2, 10, 1); g.fillRect(sx + 4, sy + 4, 8, 1); g.fillRect(sx + 5, sy + 6, 6, 1); }
    },
    mood(g, fr, K) { const c = g.canvas, a = 0.04 + 0.02 * Math.sin(fr / 60); g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, c.width, c.height); },
    plugins: [{
      top(g, zid, spec, cx, cy, d, K) { // la scatola sul Campione quando ti nascondi
        if (!box(K)) return; const p = K.api.trPos && K.api.trPos(); if (!p) return; const x = p[0] - cx, y = p[1] - cy, left = Math.max(0, ((K.F.get("vs_bx", 0) | 0) - Date.now()) / 8000);
        g.save(); g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y + 1, 9, 3, 0, 0, 7); g.fill(); g.fillStyle = "#a8794a"; g.fillRect(x - 8, y - 14, 16, 14); g.fillStyle = "#c4935a"; g.fillRect(x - 8, y - 14, 16, 4); g.fillStyle = "#8a5f38"; g.fillRect(x - 1, y - 14, 2, 14); g.fillStyle = "#111"; g.font = "bold 5px sans-serif"; g.textAlign = "center"; g.fillText("QUESTA WAY UP", x, y - 3); g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(x - 9, y - 19, 18, 3); g.fillStyle = "#facc15"; g.fillRect(x - 8, y - 18, 16 * left, 1.5); g.restore();
      },
      hud(g, zid, spec, K) {
        if (!spec || (spec.interior && !spec.hud)) return; g.save(); g.font = "700 8px 'Trebuchet MS', sans-serif";
        const s = `📦 ${K.stat("scatole")}  🤫 ${K.stat("silenzio")}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(10,12,16,.8)"; g.fillRect(4, 4, w, 13); g.fillStyle = "#facc15"; g.fillText(s, 9, 13.5); g.restore();
      }
    }],
    zoneMenuExtra(K) {
      const n = K.stat("scatole"), on = box(K);
      return [{ label: on ? "📦 Sei già nella scatola" : "📦 Infilati nella scatola", sub: on ? "Dura pochi secondi: le guardie non ti vedono" : n > 0 ? `Nascosto 8 secondi · ${n} scatol${n === 1 ? "a" : "e"} rimast${n === 1 ? "a" : "e"}` : "Non hai più scatole: cerca quelle sul pavimento (x)", cls: "hot", fn: () => { if (on) return K.done(); if (n <= 0) return K.say([["voce", "Niente scatole. Cerca i cartoni sparsi (tessera x) o chiedi a Mira."]], K.done); K.bond("scatole", -1); K.F.set("vs_bx", Date.now() + 8000); K.say([["voce", "Ti infili nella scatola. Dentro, odore di cartone e di decisioni. Otto secondi."]], K.done); } }];
    }
  });
  const K0 = E.K;
  // minigioco Infiltrazione dentro la storia: una sequenza di livelli; cb({win}) alla fine
  K0.infiltra = (lvs, cb) => {
    const arr = [].concat(lvs); let i = 0;
    const next = () => {
      if (i >= arr.length) return cb && cb({ win: true });
      K0.ownMatch(window.__inf.start, { level: arr[i], title: "Infiltrazione", done: (r) => { if (!r || !r.win) { K0.bond("silenzio", -1); return cb && cb({ win: false, r }); } i++; next(); } });
    };
    next();
  };
  window.__vuota = E.api; window.__vuotaCore = E;
})();
