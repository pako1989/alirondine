// js/officina.js - «L'OFFICINA DEI GIGANTI DI RUGGINE» · configurazione della saga sul motore comune (js/saga-core.js)
// Dieselpunk con ironia: una fonderia abbandonata, colossi a vapore e un torneo di calcio corazzato contro una corporazione. Tono mixto, qualche pausa seria.
// Usa dal core: Pressione e Sfiato (cfg.steam, NOVITÀ: caldaia da dosare, valvole, stallo), Rotta (i Tubi pneumatici costano pressione), Rapporti, Inventario, orologio, interni automatici.
(function () {
  "use strict";
  if (window.__officina || !window.__sagaCore) return;
  const E = window.__sagaCore.create({
    id: "officina", key: "ali-di-rondine.officina", title: "L'Officina dei Giganti di Ruggine", icon: "⚙️", bg: "of_titolo", chapters: 4,
    menuSub: "Colossi a vapore, una fonderia e un torneo di calcio corazzato. Dosa la pressione: poca ti blocca, troppa fa stallo.",
    theme: { accent: "#d97706", ink: "#1c1410", paper: "rgba(250,243,232,.96)", font: "'Trebuchet MS', Georgia, serif", chipBg: "#fed7aa", chipBorder: "#9a3412" },
    stats: { pressione: [0, 10, 3], scafo: [0, 9, 6, "Scafo"], fiducia: [0, 9, 3, "Fiducia"] },
    steam: { stat: "pressione", name: "Pressione", reset: 2, hit: { scafo: 1 }, text: [["voce", "La caldaia fischia, trema e sfiata tutto in un colpo. Stallo termico: perdi vapore e un pezzo di scafo."], ["of_rina", "[ride] Rispetta la caldaia, o la caldaia rispetta te: una cosa sola alla volta."]] },
    regions: {
      fonderia: { grass: ["#6b5a40", "#5e4e36", "#76664a"], path: ["#8a6a4a", "#7d5e40"], stone: ["#6a6a72", "#5e5e66"], wall: ["#8a4a2a", "#7a3e22"], water: ["#4a5a6a", "#3e4e5e"], tree: "#4a3a2a", tint: "255,170,100", tintA: 0.1 },
      cavi: { grass: ["#5a6a60", "#4e5e54", "#667668"], path: ["#8a8a92", "#7e7e86"], stone: ["#5a6270", "#4e5664"], wall: ["#475569", "#3b4a5e"], water: ["#3a5a7a", "#2e4e6e"], tree: "#3a4a3a", tint: "170,200,255", tintA: 0.12 },
      collaudo: { grass: ["#6a6a60", "#5e5e54", "#767668"], path: ["#a09a8a", "#948e7e"], stone: ["#70707a", "#64646e"], wall: ["#52525b", "#464650"], water: ["#3a5a7a", "#2e4e6e"], tree: "#4a4a3a", tint: "255,230,190", tintA: 0.08 },
      caldaie: { grass: ["#5a4a3a", "#4e3e30", "#665646"], path: ["#9a7a5a", "#8c6e50"], stone: ["#7a5a4a", "#6e4e3e"], wall: ["#7c2d12", "#6c240e"], water: ["#7a3a1a", "#6e3016"], tree: "#4a3020", tint: "255,120,60", tintA: 0.14 }
    },
    floors: ".",
    act: { q: "Entra", v: "Esci" },
    item: ["Bulloni del Gigante", "Bulloni del Gigante"],
    journal: { name: "Il Libretto di Officina", sub: "Pressione, compagni e pezzi di ricambio" },
    route: {
      start: "of_fonderia",
      nodes: {
        of_fonderia: { t: "La Vecchia Fonderia", icon: "🏭", zone: "of_fonderia" },
        of_cavi: { t: "I Cavi dell'Alta Tensione", icon: "⚡", zone: "of_cavi" },
        of_collaudo: { t: "Il Campo di Collaudo", icon: "🔧", zone: "of_collaudo" },
        of_caldaie: { t: "L'Arena delle Caldaie", icon: "🔥", zone: "of_caldaie" }
      },
      edges: [
        ["of_fonderia", "of_cavi", { pressione: 4 }, { when: (K) => K.stepOf(1) >= 4 || K.stepOf(2) >= 1, ev: () => [["voce", "Il Tubo Pneumatico ti risucchia su, tra pistoni e cartelli «Non mettere le dita». Per un istante il mondo è una striscia di fumo."]] }],
        ["of_cavi", "of_fonderia", { pressione: 2 }, { when: () => true }],
        ["of_cavi", "of_collaudo", { pressione: 5 }, { when: (K) => K.stepOf(2) >= 3 || K.stepOf(3) >= 1, ev: () => [["voce", "Il tubo sbuffa e ti deposita sul Campo di Collaudo, tra tubature spente e un odore di olio nuovo."]] }],
        ["of_collaudo", "of_cavi", { pressione: 2 }, { when: () => true }],
        ["of_collaudo", "of_caldaie", { pressione: 5 }, { when: (K) => K.stepOf(3) >= 3 || K.stepOf(4) >= 1, ev: () => [["voce", "L'ultimo Tubo scende sotto terra. Le Caldaie ti accolgono con un calore che ha già deciso chi è."]] }],
        ["of_caldaie", "of_collaudo", { pressione: 2 }, { when: () => true }]
      ],
      rescue: { label: "Spurgo manuale della caldaia", stat: "pressione", n: 3, cost: { fiducia: 1 }, text: "Gasparre, con una chiave inglese e una pazienza antica, ti spurga una valvola. Costa qualche borbottio, e un po' di fiducia." }
    },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Conoscenti", "Colleghi", "Amici", "Fidati", "Famiglia"],
      scenes: {
        of_rina: [{ lv: 2, id: "rin2", lines: [["of_rina", "Mio padre costruiva giganti per la corporazione. Quando ha chiesto una giornata libera, gliel'hanno data e l'hanno anche licenziato."], ["of_rina", "Ho preso la sua chiave inglese. Non la uso: la tengo. Per ricordarmi che qualcuno la usava per costruire e non per ubbidire."]], reward: (K) => K.bond("fiducia", 1) }, { lv: 3, id: "rin3", prize: "+2 Scafo e +1 Fiducia", lines: [["of_rina", "Ti do la chiave inglese. Non per usarla: per ricordarti che qualcuno l'ha usata per costruire, e non per ubbidire."], ["of_rina", "Con quella in mano, una caldaia ci pensa due volte prima di fare stallo."]], reward: (K) => { K.bond("scafo", 2); K.bond("fiducia", 1); } }],
        of_gasparre: [{ lv: 2, id: "gas2", lines: [["of_gasparre", "Ho settantadue anni e un'unica opera d'arte: Brontolo. L'ho costruito con una pila di scarti e il rimpianto di una promessa."], ["of_gasparre", "Non ti chiedo di salvarlo. Ti chiedo di non lasciarlo da solo a decidere cosa fare."]], reward: (K) => K.bond("scafo", 1) }, { lv: 3, id: "gas3", prize: "+2 Fiducia e +1 Scafo", lines: [["of_gasparre", "Ti insegno il segreto di Brontolo: non si sfiata tutto, si sfiata abbastanza. Come con le persone."], ["of_gasparre", "E tieni questo olio: l'ho tenuto per quarant'anni per un giorno buono. Questo mi sembra buono."]], reward: (K) => { K.bond("fiducia", 2); K.bond("scafo", 1); } }]
      }
    },
    inv: {
      items: {
        of_chiave: { n: "Chiave inglese di Rina", icon: "🔧", d: "Pesa più di quello che sembra. Una chiave, o una promessa.", gift: { of_rina: 6, of_gasparre: 3 }, giftAny: 1 },
        of_olio: { n: "Latta d'olio buono", icon: "🛢️", d: "L'olio che non si usa mai, tranne nei momenti importanti.", gift: { of_gasparre: 6 }, giftAny: 1 },
        of_ingranaggio: { n: "Ingranaggio d'oro", icon: "⚙️", d: "Sotto la ruggine, qualcuno ha incastonato un ingranaggio che luccica. Ce ne sono tre.", gift: { of_rina: 3 }, giftAny: 0 }
      }
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Sera", "Notte"], hud: true, tint: [null, null, "rgba(251,146,60,.14)", "rgba(15,23,60,.30)"],
      onSlot(K, giorno, fascia, nome) {
        if (K.steam.level() >= K.steam.max()) { K.bond("pressione", -(K.steam.level() - 2)); K.bond("scafo", -1); return [["voce", "Durante la pausa la caldaia, lasciata senza sfiato, perde la pazienza. Stallo: pressione a 2 e un pezzo di scafo in meno."]]; }
        K.bond("pressione", 1); return nome === "Notte" ? [["voce", "Cala la notte: dalle ciminiere esce un fumo di velluto. La pressione sale piano."]] : null;
      }
    },
    endings: {
      vapore: ["L'Età del Vapore Rigenerato", "Vinci e il distretto rinasce con le sue mani: l'Officina è di chi la fa funzionare.", "Vinci la finale dopo aver rifiutato il Patto."],
      patto: ["Il Patto dell'Acciaio", "Vinci e firmi un accordo pragmatico con la Corporazione: pane, orari e una catena più lunga.", "Vinci la finale dopo aver accettato il Patto."],
      nucleo: ["Il Nucleo Dormiente", "Tre ingranaggi d'oro, un mecha antico che si sveglia e il portiere più vecchio del mondo.", "Segreto: raccogli i 3 ingranaggi d'oro e vinci la finale."]
    },
    heroLook: () => ({ bg: ["#78350f", "#fdba74"], shirt: "#b45309" }),
    heroTitle: () => "meccanico del torneo",
    musicMain: "officina",
    music: { officina: { bpm: 104, chords: ["Dm", "Bb", "F", "C", "Dm", "Bb", "C", "Dm"], lres: 2, lw: "sawtooth", lv: 0.03,
      lead: "D5 - F5 - A5 - G5 - | F5 - D5 - C5 - - - | Bb4 - D5 - F5 - D5 - | C5 - E5 - G5 - - - | D5 - F5 - A5 - G5 - | A5 - C6 - A5 - F5 - | G5 - E5 - C5 - E5 - | D5 - - - - - - -",
      bass: "R . . R . . 5 . R . . R . 5 . .", bv: 0.1, arp: "1 5 1 5 1 3 1 3", aw: "square", av: 0.008, drum: "k . h . s . h k k . h . s . h .", dv: 0.12 } },
    cameos: []
  });
  // utilità condivise dai capitoli
  window.__officinaH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      // alimenta la caldaia: segna lo stallo (per l'ingranaggio d'oro del capitolo) e passa una fascia
      feed(n, stallFlag, then) { if (K.steam.level() + n > K.steam.max()) K.F.set(stallFlag, true); K.clock.advance(1, () => K.steam.add(n, then)); },
      play(level, opp, title, cb) {
        K.say(H.flush(), () => K.ownMatch(window.__steam.start, { level, oppName: opp, mate: "Brontolo", title, done: cb }));
      },
      // Brontolo: apre la Rotta, alimenta o sfiata la caldaia. `pre` può gestire casi del capitolo (ritorna true se ha risposto)
      brontolo(stallFlag, pre) {
        return () => {
          if (pre && pre()) return;
          H.say("of_brontolo", "[serio] Brrr. Fsss. (Traduzione: pronto, quando vuoi.)");
          H.ask(`Pressione ${K.steam.bar()} · Scafo ${K.stat("scafo")} · Fiducia ${K.stat("fiducia")}`, [
            { label: "🗺️ Guarda la Rotta", sub: "I Tubi costano pressione", cls: "hot", big: true, fn: () => K.route.open(K.done, true) },
            { label: "♨️ Alimenta la caldaia", sub: "+3 pressione, passa una fascia", fn: () => H.feed(3, stallFlag, H.done) },
            { label: "💨 Sfiata", sub: "-4 pressione", fn: () => { K.steam.vent(4); H.say("voce", `Sfiato: ${K.steam.bar()}`); H.done(); } },
            { label: "Niente", fn: K.done }
          ]);
        };
      }
    };
    return H;
  };
  window.__officina = E.api; window.__officinaCore = E;
})();
