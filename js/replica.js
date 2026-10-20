// js/replica.js - «EROI IN REPLICA» · configurazione della saga sul motore comune (js/saga-core.js)
// Supereroi-spettacolo, tono maturo con ironia asciutta (senza gore). Il Campione ha 19 anni, il padre è il più grande eroe della Terra.
// Usa dal core: Peso (cfg.weight, NOVITÀ: le scelte morali accumulano fiducia, colpa e rabbia), Rapporti, Inventario, Orologio, Dossier, interni automatici.
(function () {
  "use strict";
  if (window.__replica || !window.__sagaCore) return;
  const CASES = {
    verita: {
      t: "La Lega Celeste", q: "Qualcosa non torna nelle «invasioni». Metti a confronto le prove.",
      items: {
        copione: { t: "Il Copione dell'Invasione 7", d: "Un fascicolo con battute, uscite e pause per applausi: «Atterraggio alieno, ore 21:04».", icon: "📜", kind: "prova" },
        fatture: { t: "Le Fatture degli Alieni", d: "Pagamenti a una compagnia teatrale: «Costumi da invasore, trentadue».", icon: "🧾", kind: "prova" },
        registro: { t: "Il Registro dell'Allarme", d: "Gli allarmi della Lega partono sempre dopo la prima diretta televisiva.", icon: "📒", kind: "testimonianza" }
      },
      links: [["copione", "registro", "Il copione è datato dieci giorni prima del primo allarme."], ["fatture", "registro", "Gli «alieni» sono pagati dalla stessa cassa che finanzia gli allarmi."]],
      verdicts: [{ id: "tutto", label: "Dire tutto, in pubblico", sub: "La verità, anche se fa male" }, { id: "dentro", label: "Cambiare la Lega da dentro", sub: "Parlare con chi comanda" }]
    }
  };
  const E = window.__sagaCore.create({
    id: "replica", key: "ali-di-rondine.replica", title: "Eroi in Replica", icon: "🦸", bg: "rp_titolo", chapters: 4,
    menuSub: "Il padre è il più grande eroe della Terra. Quando arrivano i tuoi poteri, arriva anche una verità. Ogni scelta lascia un Peso.",
    theme: { accent: "#38bdf8", ink: "#0b1530", paper: "rgba(232,244,255,.96)", font: "'Trebuchet MS', Georgia, serif", chipBg: "#bae6fd", chipBorder: "#0369a1" },
    stats: { potere: [0, 9, 1, "Potere"], fiducia: [0, 9, 0, "Fiducia"], colpa: [0, 9, 0, "Colpa"], rabbia: [0, 9, 0, "Rabbia"] },
    weight: { name: "Peso", axes: { fiducia: ["Fiducia", "🤝"], colpa: ["Colpa", "🕯️"], rabbia: ["Rabbia", "🔥"] } },
    regions: {
      borgo: { grass: ["#5d7a52", "#52704a", "#678660"], path: ["#a89a7a", "#9a8c6c"], stone: ["#7a808a", "#6e747e"], wall: ["#7a5a4a", "#6c4e40"], water: ["#4a6a8a", "#3e5e7e"], tree: "#3e5a38", tint: "255,230,170", tintA: 0.05 },
      lega: { grass: ["#6a7e8e", "#5e7282", "#768a9a"], path: ["#b4bcc8", "#a8b0bc"], stone: ["#8a96a6", "#7e8a9a"], wall: ["#475a78", "#3b4e6c"], water: ["#4a78b0", "#3e6ca4"], tree: "#4a6a60", tint: "180,220,255", tintA: 0.1 },
      archivio: { grass: ["#4a4e5a", "#404450", "#545866"], path: ["#6a6e7a", "#5e626e"], stone: ["#4a505e", "#3e4452"], wall: ["#2e3446", "#262c3c"], water: ["#2a4060", "#20364e"], tree: "#2e4040", tint: "120,160,220", tintA: 0.14 },
      stadio: { grass: ["#5e8a6a", "#527e5e", "#6a9676"], path: ["#d4d0bc", "#c8c4b0"], stone: ["#9aa4b4", "#8e98a8"], wall: ["#475a78", "#3b4e6c"], water: ["#5a90c8", "#4e84bc"], tree: "#3e6a50", tint: "255,235,190", tintA: 0.08 }
    },
    floors: ".",
    act: { q: "Entra", v: "Esci" },
    item: ["Frammenti di mantello", "Frammenti di mantello"],
    journal: { name: "Il Quaderno del Peso", sub: "Dossier, Peso e legami" },
    cases: CASES,
    bonds: {
      per: 6, max: 4, names: ["Conoscenti", "Colleghi", "Amici", "Fidati", "Famiglia"],
      scenes: {
        rp_marta: [{ lv: 2, id: "mar2", lines: [["rp_marta", "Tuo padre ha sempre detto che i poteri sono un dono. Io ho sempre risposto che anche le bollette lo sono: arrivano e non chiedono permesso."], ["rp_marta", "Qualunque cosa succeda, a cena ci sei. Non è un'opinione, è un orario."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "mar3", prize: "+2 Potere e un gilet di nonna", lines: [["rp_marta", "Ti ho cucito io il mantello. Non è pesante, è solo scomodo come tutte le cose fatte con amore."], ["rp_marta", "Con questo addosso, se atterri male, almeno è colpa mia."]], reward: (K) => { K.bond("potere", 2); } }],
        rp_brezza: [{ lv: 2, id: "vel2", lines: [["rp_brezza", "Mi hanno dato il nome Brezza perché ero leggera. Poi ho scoperto che serviva anche a lasciarsi trascinare dal vento."], ["rp_brezza", "Non lasciarti trascinare. Nemmeno da tuo padre, nemmeno da me."]], reward: (K) => K.bond("fiducia", 1) },
          { lv: 3, id: "vel3", prize: "+2 Fiducia e un volo di scorta", lines: [["rp_brezza", "Ti insegno la virata che nessuno insegna: quella in cui ti fermi a guardare dove stai andando."], ["rp_brezza", "È la più lenta. È anche l'unica che serve."]], reward: (K) => { K.bond("fiducia", 2); } }],
        rp_basalto: [{ lv: 2, id: "bas2", lines: [["rp_basalto", "Pesavo centoventi chili di muscoli e uno di coscienza. Il muscolo, con gli anni, ha preso peso. La coscienza è rimasta a dieta."], ["rp_basalto", "Non voglio che tu faccia i miei errori. Voglio che ne faccia di nuovi."]], reward: (K) => K.bond("potere", 1) },
          { lv: 3, id: "bas3", prize: "+2 Potere e il diario di Basalto", lines: [["rp_basalto", "Il mio diario. Pieno di allenamenti, di date e di una pagina che non ho il coraggio di rileggere."], ["rp_basalto", "Leggila tu. Magari ti serve."]], reward: (K) => { K.bond("potere", 2); } }],
        rp_zenit: [{ lv: 2, id: "tit2", lines: [["rp_zenit", "Quando avevo la tua età non sapevo volare. Cadevo bene, quello sì. Ho imparato che la differenza tra un eroe e un incidente è l'altezza da cui cadi."], ["rp_zenit", "Non ho mai saputo come si fa il padre. Sto improvvisando da diciannove anni."]], reward: (K) => K.bond("fiducia", 1) }]
      }
    },
    inv: {
      items: {
        rp_medaglia: { n: "Medaglia di Zenit", icon: "🏅", d: "Un metallo caldo come una mano. Tuo padre l'ha vinta a ventitré anni. Non l'ha più indossata.", gift: { rp_marta: 8, rp_zenit: 4 }, giftAny: 1, react: { rp_marta: "La sua prima medaglia. Se l'è tolta il giorno in cui è nato qualcuno più importante." } },
        rp_visiera: { n: "Visiera di Brezza", icon: "🥽", d: "Lenti da vento. Sotto c'è scritto «volo piano, ma arrivo».", gift: { rp_brezza: 8, rp_basalto: 3 }, giftAny: 1 },
        rp_diario: { n: "Diario di Basalto", icon: "📔", d: "Allenamenti, date e una pagina cerchiata di rosso.", gift: { rp_basalto: 6, rp_nube: 3 }, giftAny: 0 }
      }
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Sera", "Notte"], hud: true, tint: [null, null, "rgba(251,146,60,.14)", "rgba(15,23,60,.30)"],
      onSlot(K, giorno, fascia, nome) { return nome === "Notte" ? [["voce", "Notte sul Borgo. Qualcuno, lassù, accende e spegne le stelle con fatica."]] : null; }
    },
    endings: {
      figlio: ["Figlio e Campione", "Vinci e ricostruisci il rapporto: il padre ammette la finzione in diretta, e la Lega ricomincia da zero.", "Vinci il duello finale con Fiducia più alta di Rabbia."],
      cielo: ["Il Cielo Diviso", "Vinci e dici tutto al mondo. Il padre resta in cielo, tu a terra: una distanza giusta, ma pesante.", "Vinci il duello finale con Rabbia più alta di Fiducia."],
      terza: ["La Terza Via", "Fondi una nuova lega con Brezza e gli «invasori» assunti dalla vecchia: nessun cielo finto, solo gente vera.", "Segreto: Fiducia e Rabbia a 3 o più, tutto il Dossier e vittoria finale."]
    },
    heroLook: () => ({ bg: ["#0c4a6e", "#7dd3fc"], shirt: "#0369a1" }),
    heroTitle: () => "figlio di Zenit",
    musicMain: "figlio",
    music: { figlio: { bpm: 96, chords: ["Am", "F", "C", "G", "Am", "F", "G", "Am"], lres: 2, lw: "triangle", lv: 0.04,
      lead: "A4 - C5 - E5 - D5 - | C5 - A4 - G4 - - - | F4 - A4 - C5 - A4 - | G4 - B4 - D5 - - - | A4 - C5 - E5 - A5 - | G5 - E5 - C5 - E5 - | D5 - B4 - G4 - B4 - | A4 - - - - - - -",
      bass: "R . . R . . 5 . R . . R . 5 . .", bv: 0.1, arp: "1 3 5 3 1 3 5 3", aw: "sine", av: 0.012, drum: "k . . . s . . . k . h . s . h .", dv: 0.1 } },
    cameos: []
  });
  window.__replicaH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      // scelta morale: applica i pesi e blocca le opzioni che richiedono un Peso non raggiunto
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      play(level, opp, title, cb, extra, charge) { K.say(H.flush(), () => K.ownMatch(window.__sparring.start, { level, oppName: opp, title, hp: Math.floor(K.stat("potere") / 3) + (extra | 0), charge: charge | 0, done: cb })); },
      // tutto il cast della saga (ogni capitolo lo rimette: i volti restano gli stessi)
      people() {
        H.cast("rp_zenit", "Zenit", "Il più grande eroe della Terra", { style: "short", hair: "#d4b483", jaw: "square", shirt: "#1d4ed8", skin: "#e0b890", bg: ["#1e3a8a", "#bae6fd"] }, "Ha salvato il mondo undici volte. A casa, non ha mai salvato una cena senza bruciarla.");
        H.cast("rp_marta", "Marta", "Tua madre", { style: "bun", hair: "#5a3a22", acc: ["grembiule"], shirt: "#be185d", skin: "#e0b890", bg: ["#831843", "#fbcfe8"] }, "Ha sposato un eroe senza mai dimenticare di essere quella che paga le bollette.");
        H.cast("rp_brezza", "Brezza", "Eroina della Lega, la tua guida", { style: "ponytail", hair: "#0f172a", acc: ["occhiali"], shirt: "#0d9488", skin: "#c68642", bg: ["#134e4a", "#99f6e4"] }, "Vola piano ma arriva sempre. Ha idee sulla verità e nessuna sul silenzio.");
        H.cast("rp_basalto", "Basalto", "Eroe in pensione", { style: "bald", hair: "#777", beard: "folta", shirt: "#44403c", skin: "#a9744a", bg: ["#292524", "#d6d3d1"] }, "Centoventi chili di muscoli, uno di coscienza. Fa il giardiniere e lo fa bene.");
        H.cast("rp_nube", "Nube", "Eroe della Lega, il tuo rivale", { style: "spiky", hair: "#e5e7eb", shirt: "#6d28d9", skin: "#e8c9a0", bg: ["#4c1d95", "#ddd6fe"] }, "Sorride ai fotografi anche quando dorme. Non sa di essere uno spettacolo. Non ancora.");
        H.cast("rp_sabbioni", "Direttore Sabbioni", "Direttore della Lega Celeste", { style: "short", hair: "#9ca3af", acc: ["occhiali"], shirt: "#0f172a", skin: "#e0b890", bg: ["#0f172a", "#cbd5e1"] }, "Parla in comunicati. Anche a colazione, anche a letto, anche quando dice «ti voglio bene».");
        H.cast("rp_ilario", "Ilario", "Suggeritore della Lega", { style: "short", hair: "#7c5a3a", acc: ["occhiali"], shirt: "#52525b", skin: "#e0b890", bg: ["#27272a", "#e4e4e7"] }, "Ha suggerito più battute di un attore. Nessuno ricorda il suo nome, e lui lo preferisce.");
        H.cast("rp_teodora", "Teodora", "Archivista", { style: "bun", hair: "#d1d5db", acc: ["occhiali"], shirt: "#3f3f46", skin: "#e0b890", bg: ["#18181b", "#d4d4d8"] }, "Sa dove sta ogni cosa e perché non andrebbe trovata.");
        H.cast("rp_ottone", "Ottone", "Cassiere della Lega", { style: "bald", hair: "#555", beard: "baffi", shirt: "#78350f", skin: "#d9a679", bg: ["#451a03", "#fcd34d"] }, "Conta tutto, anche i silenzi. Specialmente i silenzi.");
      }
    };
    return H;
  };
  window.__replica = E.api; window.__replicaCore = E;
})();
