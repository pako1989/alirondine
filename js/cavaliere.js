// js/cavaliere.js - «IL CAVALIERE DEL FISCHIO» · configurazione della saga sul motore comune (js/saga-core.js)
// Noir gotico alla Batman: Borgo Gotico sotto la pioggia, un ex portiere miliardario veste di notte un mantello e dà la caccia a chi trucca le partite. Il Pierrot Bianco ruba i palloni e lascia indovinelli.
// Novità: TETTI (cfg.roof nel core): rampino, salti a rischio, cadute, guardie stordite dall'alto, lampade da spegnere. Minigioco: Interrogatorio (js/cavaliere-int.js), anche in Sala Giochi.
// Dal core: guardie con cono di vista, Dossier, Inventario (gadget), Rapporti, interni a mano.
// Tessere proprie (js/cavaliere-tiles.js): P facciata · Z vuoto · J cornicione di salto · H ancora del rampino · G gargolla · L lampione · B cassa · C comignolo · h abbaino (nascondiglio)
//   D console · Q teca · V sbarre · S poltrona · N tendaggio · U statua · X lapide · K cassaforte · M container; pavimenti r tegole · p asfalto · d banchina · y manicomio · o teatro · c marmo · n cimitero · k rifugio
(function () {
  "use strict";
  if (window.__cavaliere || !window.__sagaCore) return;
  const PEOPLE = { cf_fulgenzio: "Fulgenzio", cf_brandi: "Il Commissario", cf_pierrot: "Il Pierrot Bianco", cf_micia: "Micia Nera", cf_spillo: "Dottor Spillo", cf_lucre: "Signor Lucre", cf_zeppa: "Zeppa", cf_diva: "La Diva" };
  const CASES = {
    fischio: {
      t: "Il Cavaliere del Fischio", q: "Chi ruba i palloni, e per conto di chi? Metti in fila gli indovinelli e le prove.",
      items: {
        carta1: { t: "Indovinello del Tetto", d: "«Mi fischiano e non respiro; mi calciano e non mi lamento. Chi mi tiene in mano, decide chi vince.»", icon: "🃏", kind: "indovinello" },
        carta2: { t: "Indovinello del Vicolo", d: "«Dodici ore di ombra, tre di luce, una sola persona a cui piace il buio.»", icon: "🃏", kind: "indovinello" },
        carta3: { t: "Indovinello del Porto", d: "«Parte vuoto, torna pieno, e nessuno chiede cosa c'è nel container.»", icon: "🃏", kind: "indovinello" },
        carta4: { t: "Indovinello del Manicomio", d: "«Ho una cartella clinica e nessuna malattia: sono solo l'unico che ha detto la verità.»", icon: "🃏", kind: "indovinello" },
        carta5: { t: "Indovinello dell'Opera", d: "«Si applaude chi cade con grazia; chi cade davvero, non lo si vede.»", icon: "🃏", kind: "indovinello" },
        carta6: { t: "Indovinello del Cimitero", d: "«Ogni lapide ha un nome. Una sola ha un fischietto.»", icon: "🃏", kind: "indovinello" },
        libro: { t: "Libro Mastro truccato", d: "Il registro segreto della Banca del Pallone: partite vendute, arbitri pagati, firme.", icon: "📒", kind: "prova" },
        fischietto: { t: "Fischietto d'oro", d: "Appartenne all'arbitro Ruggero Fischi, radiato dieci anni fa per «tangenti mai provate».", icon: "📯", kind: "prova" },
        cartella: { t: "Cartella clinica di Ruggero", d: "Il Manicomio dei Rigori lo ha internato un mese dopo la radiazione. Firmata Lucre, sotto un timbro della Banca.", icon: "📋", kind: "prova" }
      },
      links: [["libro", "cartella", "La Banca ha pagato l'internamento: chi ha firmato aveva interesse a farlo tacere."], ["fischietto", "cartella", "Il fischietto d'oro e la cartella dicono lo stesso nome: Ruggero Fischi."], ["carta1", "fischietto", "Il primo indovinello descrive proprio un fischietto."], ["carta4", "cartella", "L'indovinello del Manicomio racconta la stessa storia della cartella."], ["carta6", "libro", "L'ultimo indovinello indica dove è nascosto il registro."]],
      verdicts: [{ id: "consegna", label: "Consegna tutto al Commissario", sub: "La legge, con le prove" }, { id: "diffondi", label: "Diffondi il Libro Mastro", sub: "Lo sa tutta la città" }]
    }
  };
  const E = window.__sagaCore.create({
    id: "cavaliere", key: "ali-di-rondine.cavaliere", title: "Il Cavaliere del Fischio", icon: "🦇", bg: "cf_titolo", chapters: 4,
    menuSub: "Borgo Gotico sotto la pioggia: un ex portiere miliardario in mantello, il Pierrot Bianco che ruba i palloni e lascia indovinelli. Tetti, rampino, ombre e interrogatori.",
    theme: { accent: "#facc15", ink: "#e5e7eb", paper: "rgba(10,10,20,.93)", font: "Georgia, 'Times New Roman', serif", chipBg: "#111827", chipBorder: "#facc15" },
    stats: { agilita: [0, 100, 25, "Agilità"], timore: [0, 100, 10, "Timore"], vigore: [0, 100, 100, "Vigore"] },
    item: ["Gettone nero", "Gettone nero"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 14 + i) * 1.2); g.fillStyle = "#0b0b12"; g.beginPath(); g.arc(0, 0, 4.5, 0, 7); g.fill(); g.fillStyle = "#facc15"; g.beginPath(); g.moveTo(-3, -1.5); g.lineTo(0, 1); g.lineTo(3, -1.5); g.lineTo(2, 2); g.lineTo(-2, 2); g.closePath(); g.fill(); g.restore(); },
    regions: {
      tetti: { grass: ["#1f2736", "#1c2331", "#232b3b"], path: ["#2d3646", "#283140"], stone: ["#3a3447", "#352f42"], wall: ["#16121f", "#100d18"], water: ["#0b1220", "#0e1a2e"], tall: "#1f2736", tint: "90,110,190", tintA: 0.1, fx: "rain", dark: 0.16 },
      vicolo: { grass: ["#1a1e2b", "#161a26", "#1d2230"], path: ["#1d2230", "#1a1e2b"], stone: ["#3a3447", "#352f42"], wall: ["#12101a", "#0d0b14"], water: ["#0b1220", "#0e1a2e"], tall: "#1a1e2b", tint: "70,90,170", tintA: 0.14, fx: "rain", dark: 0.3 },
      rifugio: { grass: ["#252a36", "#20242f", "#2a2f3c"], path: ["#2f3544", "#2a2f3c"], stone: ["#3b4254", "#343a4a"], wall: ["#0f121a", "#0b0d14"], water: ["#0b1220", "#0e1a2e"], tall: "#252a36", tint: "56,189,248", tintA: 0.08, fx: "dust", dark: 0.3 },
      porto: { grass: ["#43342a", "#3c2f26", "#4a3a2e"], path: ["#4a3a28", "#43342a"], stone: ["#4b5563", "#3f4957"], wall: ["#10141c", "#0b0e14"], water: ["#0b1a2e", "#0e2440"], tall: "#43342a", tint: "80,110,170", tintA: 0.16, fx: "rain", dark: 0.28 },
      manicomio: { grass: ["#b9c4bd", "#aeb9b2", "#c4cec7"], path: ["#9aa5a8", "#8e999c"], stone: ["#7b8590", "#6f7984"], wall: ["#2a2d36", "#20222a"], water: ["#0b1a2e", "#0e2440"], tall: "#b9c4bd", tint: "210,230,200", tintA: 0.1, fx: "", dark: 0.28 },
      opera: { grass: ["#601824", "#561420", "#6b1d2a"], path: ["#7a2434", "#6f1f2e"], stone: ["#d4a73a", "#b8902f"], wall: ["#240810", "#1a050b"], water: ["#0b1a2e", "#0e2440"], tall: "#601824", tint: "255,190,110", tintA: 0.12, fx: "", dark: 0.2 },
      banca: { grass: ["#c8c4b6", "#bfbbac", "#d1cdbf"], path: ["#9ca3af", "#8e95a1"], stone: ["#6b7280", "#5f6571"], wall: ["#1f2937", "#161d29"], water: ["#0b1a2e", "#0e2440"], tall: "#c8c4b6", tint: "250,230,150", tintA: 0.1, fx: "", dark: 0.18 },
      cimitero: { grass: ["#1c2a22", "#18251d", "#203026"], path: ["#3a3f4a", "#33373f"], stone: ["#6b7280", "#5f6571"], wall: ["#10141a", "#0b0e13"], water: ["#0b1220", "#0e1a2e"], tall: "#1c2a22", tint: "150,180,220", tintA: 0.14, fx: "rain", dark: 0.42 }
    },
    floors: "rpdyocnk", solid: "PZJHGLBCDQVSNUXKM",
    act: { J: "Salta sul tetto di fronte", H: "Lancia il rampino", G: "Guarda la gargolla", L: "Guarda il lampione", B: "Guarda la cassa", C: "Guarda il comignolo", D: "Usa la console", Q: "Guarda la teca", V: "Guarda le sbarre", S: "Guarda la poltrona", N: "Guarda il tendaggio", U: "Guarda la statua", X: "Leggi la lapide", K: "Guarda la cassaforte", M: "Guarda il container", s: "Siediti un momento" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi un istante. Il mantello gocciola. (Il gioco salva da solo: qui puoi rileggere il Taccuino.)" },
    texts: { nothing: "Niente di utile. Solo pioggia e silenzio.", noHero: "Il Borgo Gotico vuole un Cavaliere: crea prima il tuo personaggio.", seen: "Ti hanno visto! Ti ritiri nell'ombra e riprovi." },
    journal: { name: "Il Taccuino", sub: "Indovinelli, prove, legami e finali" },
    cases: CASES,
    roof: { name: "Tetti", stat: "vigore", agi: "agilita", hurt: 15, home: ["cf_rifugio", 8, 9], text: { fall: "Scivoli. Rotoli sulle tegole, ti rialzi con le costole che protestano e ricominci.", faint: "Cadi male. Fulgenzio ti raccoglie, ti riporta al rifugio e ti rimette in piedi con una tisana e un rimprovero." } },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Conoscenti", "Alleati", "Fidati", "Famiglia"],
      scenes: {
        cf_fulgenzio: [{ lv: 2, id: "ful2", lines: [["cf_fulgenzio", "Ho servito suo padre, poi lei. Non ho mai chiesto perché cercasse i ladri di partite sui tetti. Ho solo comprato corde più resistenti."], ["cf_fulgenzio", "Ma stasera glielo chiedo: lo fa per la città o per quel guanto che non ha mai tolto?"]], reward: (K) => K.bond("agilita", 4) },
          { lv: 3, id: "ful3", prize: "+6 Agilità e il rampino rinforzato", lines: [["cf_fulgenzio", "Il rampino nuovo. Cavo di titanio, gancio a tre punte, silenzioso come una promessa."], ["cf_fulgenzio", "Non lo rompa. O lo rompa, ma torni intero."]], reward: (K) => { K.bond("agilita", 6); K.inv.give("cf_rampino"); } }],
        cf_brandi: [{ lv: 2, id: "bra2", lines: [["cf_brandi", "Venti anni in polizia e una sola regola: non fidarsi di chi veste di nero. Sa quanto mi costa dirle che mi fido?"], ["cf_brandi", "Se cade, io non c'ero. Se vince, io c'ero sempre."]], reward: (K) => K.bond("timore", 3) },
          { lv: 3, id: "bra3", prize: "+5 Timore e il faro del Commissario", lines: [["cf_brandi", "Il faro. Lo accendo io, quando serve parlare con la città. Lo accenda anche lei, ogni tanto."], ["cf_brandi", "Non per farsi vedere. Per farsi ricordare."]], reward: (K) => K.bond("timore", 5) }],
        cf_micia: [{ lv: 2, id: "mic2", lines: [["cf_micia", "Rubo da chi ha troppo e restituisco a chi ha meno. Il Borgo mi chiama ladra, lei eroe: la differenza sta nei vestiti."], ["cf_micia", "Se ti serve una mano sui tetti, miagola. Se ti serve un cuore, scrivimi."]], reward: (K) => K.bond("agilita", 4) }]
      }
    },
    inv: {
      items: {
        cf_rampino: { n: "Rampino rinforzato", icon: "🪝", d: "Cavo di titanio, gancio a tre punte. Un salto sicuro in più.", match: { at: 0, df: 0, te: 1 }, gift: {}, giftAny: 0 },
        cf_fumogeno: { n: "Fumogeno", icon: "💨", d: "Fumo grigio. Per sparire, a volte, basta che non ti vedano arrivare.", match: { at: 0, df: 1, te: 0 }, gift: { cf_micia: 6 }, giftAny: 1 },
        cf_batarang: { n: "Boomerang d'acciaio", icon: "🪃", d: "Torna sempre. Come i ladri nei vicoli.", match: { at: 1, df: 0, te: 0 }, gift: { cf_brandi: 4 }, giftAny: 1 },
        cf_lente: { n: "Lente del detective", icon: "🔎", d: "Ingrandisce i dettagli e le bugie.", match: { at: 0, df: 0, te: 1 }, gift: { cf_fulgenzio: 6 }, giftAny: 1 },
        cf_tessera: { n: "Tessera del Manicomio", icon: "🪪", d: "Apre un cancello che non dovrebbe aprirsi.", gift: {}, giftAny: 0 },
        cf_chiave: { n: "Chiave della Banca", icon: "🗝️", d: "Chiave di ottone, una sola copia. Apre il caveau.", gift: {}, giftAny: 0 }
      }
    },
    endings: {
      giustizia: ["Il Verdetto della Legge", "Consegni il Pierrot e il Libro Mastro al Commissario. Lucre cade, la Banca trema, e il Cavaliere resta un'ombra che non ha mai cercato la gloria.", "Raccogli le prove della Banca (almeno 3) e consegna tutto al Commissario."],
      pieta: ["Il Perdono di Ruggero", "Ascolti la storia dell'arbitro e lo lasci andare. La Banca viene smascherata da una lettera anonima: la città non saprà mai chi ha firmato.", "Ascolta il Pierrot fino alla fine e lascialo andare."],
      ombra: ["L'Ombra che Cade", "Il Pierrot non risale. Il Borgo ti teme più di quanto ti ami e, da quella notte, qualcuno smette di giocare pulito per paura, non per scelta.", "Con Timore 40 o più, lascia cadere il Pierrot."],
      segreto: ["Il Fischio Finale", "Con i sei indovinelli, Lucre confessa davanti a tutta la Banca. L'arbitro viene riabilitato e il fischietto d'oro torna in campo, a un fischio dalla verità.", "Raccogli tutti e sei gli indovinelli e il Libro Mastro."]
    },
    guest: { id: "cf_fulgenzio", lines: [["cf_fulgenzio", "[furbo] {n}, buongiorno. Il padrone dorme, il mantello è in lavanderia e io ho preso il treno. Una vacanza, la chiamano."], ["cf_fulgenzio", "Il vostro molo ha un'ottima vista e nessun tetto da cui cadere. La consiglierei a chiunque abbia un rampino e troppe ossa rotte."]] },
    heroLook: () => ({ bg: ["#0b0b12", "#facc15"], shirt: "#111827" }),
    heroTitle: () => "il Cavaliere",
    musicMain: "gotico",
    music: { gotico: { bpm: 72, chords: ["Cm", "Ab", "Eb", "Bb", "Cm", "Fm", "G", "Cm"], lres: 3, lw: "triangle", lv: 0.03,
      lead: "C5 - - Eb5 - G5 - - | Ab5 - - G5 - Eb5 - - | Eb5 - - G5 - Bb5 - - | Bb5 - A5 - F5 - - - | C5 - - Eb5 - G5 - - | F5 - - Ab5 - C6 - - | B5 - - G5 - D5 - - | C5 - - - - - - -",
      bass: "R . . . 5 . . . R . . . 5 . 8 .", bv: 0.13, arp: "1 5 8 5 3 5 8 5", aw: "sine", av: 0.01, drum: "k . . . s . . . k . . k s . . .", dv: 0.07 } },
    plugins: [{
      hud(g, zid, spec, K) {
        if (!spec) return; g.save(); g.font = "700 8px Georgia, serif";
        const s = `🦇 ${K.roof ? K.roof.vigor() : 100}  🪝 ${K.stat("agilita")}  👁 ${K.stat("timore")}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(10,10,20,.82)"; g.fillRect(4, 4, w, 13); g.fillStyle = "#facc15"; g.fillText(s, 9, 13.5); g.restore();
      }
    }],
    paint: (window.__cavTiles || {}).paint || {}, floorPaint: (window.__cavTiles || {}).floorPaint,
    cameos: []
  });
  const K = E.K;
  window.__cavaliere = E.api; window.__cavCore = E; window.__cavK = K; window.__cavPeople = PEOPLE;
  window.__cavH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      // interrogatorio: il bonus Timore e gli oggetti di inventario aiutano
      play(level, opp, title, cb) {
        K.say(H.flush(), () => K.ownMatch(window.__interrogatorio.start, { level, oppName: opp, title, te: K.inv.bonus("te") + (K.stat("timore") >= 40 ? 1 : 0), df: K.inv.bonus("df"), at: K.inv.bonus("at"), done: cb }));
      },
      plaque(g, txt, x, y, col) { g.font = "bold 7px Georgia, serif"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(10,10,20,.9)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#facc15"; g.fillRect(x - w / 2, y + 2, w, 1); g.fillStyle = "#e5e7eb"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
      people() {
        H.cast("cf_fulgenzio", "Fulgenzio", "Maggiordomo e meccanico", { style: "slick", hair: "#d1d5db", beard: "baffi", shirt: "#1f2937", skin: "#e0b890", bg: ["#111827", "#9ca3af"] }, "Ha servito tre generazioni di portieri. Cuce mantelli, ripara rampini e commenta con garbo ogni caduta.");
        H.cast("cf_brandi", "Commissario Brandi", "Polizia del Borgo", { style: "short", hair: "#6b7280", beard: "baffi", acc: ["occhiali"], shirt: "#334155", skin: "#d9a679", bg: ["#1e293b", "#94a3b8"] }, "Venti anni in divisa e un faro sul tetto della questura. Non ama le ombre, ma le ascolta.");
        H.cast("cf_pierrot", "Il Pierrot Bianco", "Il ladro di palloni", { style: "messy", hair: "#f8fafc", shirt: "#f8fafc", skin: "#f1f5f9", bg: ["#450a0a", "#f8fafc"] }, "Trucco bianco, sorriso rosso, colletto a gorgiera. Ruba palloni e lascia indovinelli, e non sorride mai davvero.");
        H.cast("cf_micia", "Micia Nera", "Ladra acrobata", { style: "ponytail", hair: "#111827", shirt: "#1f2937", skin: "#e8c3a0", bg: ["#312e81", "#c7d2fe"] }, "Salta i tetti meglio di chiunque. Ruba a chi ha troppo e non spiega a chi chiede.");
        H.cast("cf_spillo", "Dottor Spillo", "Psichiatra del Manicomio", { style: "bun", hair: "#9ca3af", acc: ["occhiali"], shirt: "#e5e7eb", skin: "#e0b890", bg: ["#374151", "#e5e7eb"] }, "Direttore del Manicomio dei Rigori. Cura i portieri che non hanno retto la pressione, o così dice.");
        H.cast("cf_lucre", "Signor Lucre", "Banchiere", { style: "slick", hair: "#1f2937", beard: "pizzetto", shirt: "#0f172a", skin: "#e0b890", bg: ["#0f172a", "#fde68a"] }, "Presidente della Banca del Pallone. Ha un sorriso da cassaforte: bello e blindato.");
        H.cast("cf_zeppa", "Zeppa", "Informatore", { style: "messy", hair: "#78350f", shirt: "#44403c", skin: "#d9a679", bg: ["#292524", "#d6d3d1"] }, "Tabaccaio di giorno e informatore di notte. Dice sempre una cosa in più di quella che sa.");
        H.cast("cf_diva", "Cornelia Vox", "La Diva dell'Opera", { style: "bob", hair: "#7c2d12", shirt: "#7f1d1d", skin: "#e8c3a0", bg: ["#450a0a", "#fecaca"] }, "Soprano del Teatro dell'Opera. Canta come se il pubblico fosse l'ultimo a crederci.");
      }
    };
    return H;
  };
})();
