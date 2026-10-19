// js/figurine.js - «CACCIATORI DI FIGURINE» · configurazione della saga sul motore comune (js/saga-core.js)
// Un'Italia di provincia dove il calcio si gioca con figurine viventi: si catturano, si allenano, si schierano. Ironia di base, qualche pausa seria.
// Usa dal core: L'Album (cfg.catch, NOVITÀ: cattura, squadra di figure, evoluzioni, lotta a turni), Rapporti, Inventario, orologio, Rotta, interni automatici.
(function () {
  "use strict";
  if (window.__figurine || !window.__sagaCore) return;
  const mv = (t, sp) => [["Colpo", 6, 0], t === "cuore" ? ["Abbraccio", 0, 0, "heal"] : [sp, 8, 1]];
  const F = (n, icon, type, temper, hp, atk, def, sp, extra) => Object.assign({ n, icon, type, temper, hp, atk, def, moves: mv(type, sp) }, extra || {});
  const HINT = { timida: "Spunta da dietro un cespuglio e arrossisce.", fiera: "Batte i piedi e digrigna: vuole una sfida.", vanitosa: "Si guarda in uno specchietto e ti ignora con eleganza.", curiosa: "Ti gira intorno, curiosa di tutto, mani comprese." };
  const figs = {
    fg_zolla: F("Zolla", "🌱", "campo", "timida", 22, 7, 5, "Zolla Piena", { evo: ["fg_zollone", 3], d: "Una figura di prato, resistente e timida." }),
    fg_zollone: F("Zollone", "🪨", "campo", "timida", 30, 9, 7, "Frana", { d: "Zolla cresciuta: ora ha il peso che le mancava." }),
    fg_tonino: F("Tonino Tackle", "🦵", "campo", "fiera", 22, 8, 4, "Scivolata Epica", { d: "Entra in scivolata anche sul bagnato dei pensieri." }),
    fg_muraglia: F("Muraglia", "🧱", "campo", "curiosa", 26, 6, 7, "Sbarramento", { d: "Un difensore che ti chiede sempre come stai." }),
    fg_svolazzo: F("Svolazzo", "🪁", "aria", "curiosa", 20, 8, 3, "Folata", { evo: ["fg_cometa", 3], d: "Vola dove capita, di solito dove sei tu." }),
    fg_cometa: F("Cometa", "☄️", "aria", "curiosa", 28, 10, 4, "Coda Infuocata", { d: "Svolazzo cresciuto: lascia una scia e qualche scintilla." }),
    fg_piuma: F("Piuma", "🪶", "aria", "timida", 18, 7, 3, "Soffio", { d: "Leggera come una promessa a bassa voce." }),
    fg_raffica: F("Raffica", "🌪️", "aria", "fiera", 21, 9, 3, "Tromba d'Aria", { d: "Ha fretta anche quando sta ferma." }),
    fg_notturno: F("Notturno", "🦇", "ombra", "vanitosa", 21, 8, 4, "Velo di Notte", { evo: ["fg_eclisse", 3], d: "Esce di sera e solo se ben pettinato." }),
    fg_eclisse: F("Eclisse", "🌘", "ombra", "vanitosa", 29, 10, 6, "Oscuramento", { d: "Notturno cresciuto: quando passa, il campo si raffredda." }),
    fg_ghirigoro: F("Ghirigoro", "🌀", "ombra", "curiosa", 20, 8, 4, "Spirale", { d: "Disegna ghirigori ovunque, anche sulle tue scarpe." }),
    fg_sipario: F("Sipario", "🎭", "ombra", "vanitosa", 22, 7, 5, "Calata di Tela", { d: "Entra in scena e aspetta l'applauso. Ti conviene darlo." }),
    fg_sorriso: F("Sorriso", "😊", "cuore", "timida", 24, 6, 4, "", { evo: ["fg_tenerezza", 3], d: "Quando sorride, qualcosa nel campo si ripara." }),
    fg_tenerezza: F("Tenerezza", "💞", "cuore", "timida", 32, 7, 6, "", { d: "Sorriso cresciuto: cura anche chi non ci crede." }),
    fg_caldana: F("Caldana", "🔥", "cuore", "fiera", 22, 8, 4, "", { d: "Un cuore caldo, caldissimo, a tratti pericoloso." }),
    fg_orsa: F("Mamma Orsa", "🐻", "cuore", "vanitosa", 30, 7, 7, "", { d: "Protegge tutti e vuole che tutti lo sappiano." })
  };
  Object.keys(figs).forEach((k) => { figs[k].hint = HINT[figs[k].temper]; });
  const E = window.__sagaCore.create({
    id: "figurine", key: "ali-di-rondine.figurine", title: "Cacciatori di Figurine", icon: "🃏", bg: "fg_titolo", chapters: 4,
    menuSub: "Figure viventi da catturare, allenare e schierare. Scegli come avvicinarle, costruisci la squadra e arriva alla Lega.",
    theme: { accent: "#a855f7", ink: "#1e1b4b", paper: "rgba(250,245,255,.96)", font: "'Trebuchet MS', Georgia, serif", chipBg: "#e9d5ff", chipBorder: "#6b21a8" },
    stats: { scorte: [0, 9, 5, "Scorte"], fama: [0, 9, 2, "Fama"] },
    regions: {
      borgo: { grass: ["#7ab25e", "#6ea652", "#86bc6a"], path: ["#d8c79a", "#ccbb8c"], stone: ["#a39d90", "#968f82"], wall: ["#e2cfa8", "#d4c19a"], water: ["#3a86b8", "#337aab"], tree: "#3e7a38", tint: "255,236,190", tintA: 0.05 },
      bosco: { grass: ["#4f8a52", "#46804a", "#58945a"], path: ["#9a8560", "#8d7a56"], stone: ["#7a8077", "#6e746b"], wall: ["#6b5a40", "#5e4e36"], water: ["#2f6f96", "#29648a"], tree: "#1f5a30", tint: "170,220,200", tintA: 0.1, fx: "fog" },
      citta: { grass: ["#7a9a6a", "#6e8e5e", "#86a676"], path: ["#bdb3a0", "#b0a692"], stone: ["#8d8b94", "#7f7d86"], wall: ["#cfc3b2", "#c0b4a2"], water: ["#3a86b8", "#337aab"], tree: "#3e6a38", tint: "255,225,170", tintA: 0.06 },
      lega: { grass: ["#5c9a62", "#528e58", "#66a46c"], path: ["#e0d4a8", "#d4c89a"], stone: ["#9a98a6", "#8c8a98"], wall: ["#7c6aa8", "#6e5c9a"], water: ["#3a86b8", "#337aab"], tree: "#3a7a3e", tint: "230,200,255", tintA: 0.08 }
    },
    floors: ".",
    act: { q: "Entra", v: "Esci" },
    item: ["Figurine perdute", "Figurine perdute"],
    journal: { name: "L'Album di Viaggio", sub: "Figure, rapporti e tappe" },
    catch: { name: "L'Album", max: 3, bait: "fg_esca", beats: { aria: "campo", campo: "ombra", ombra: "aria" }, temps: { timida: "parla", fiera: "sfida", vanitosa: "esca", curiosa: "gioca" }, figs },
    route: {
      start: "fg_borgo",
      nodes: {
        fg_borgo: { t: "Pratofiore", icon: "🏡", zone: "fg_borgo" },
        fg_bosco: { t: "Bosco dei Fischi", icon: "🌲", zone: "fg_bosco" },
        fg_citta: { t: "Città delle Vetrine", icon: "🏙️", zone: "fg_citta" },
        fg_lega: { t: "Arena della Lega", icon: "🏟️", zone: "fg_lega" }
      },
      edges: [
        ["fg_borgo", "fg_bosco", { scorte: 1 }, { when: (K) => K.stepOf(2) >= 1, ev: () => [["voce", "Il sentiero entra nel bosco e il bosco sembra trattenere il respiro. Da qualche parte, una figura fischia."]] }],
        ["fg_bosco", "fg_borgo", { scorte: 1 }, { when: () => true, ev: () => [["voce", "Torni a Pratofiore con le scarpe piene di foglie e le tasche piene di piani."]] }],
        ["fg_bosco", "fg_citta", { scorte: 2 }, { when: (K) => K.stepOf(2) >= 3, ev: () => [["voce", "Oltre il bosco la strada si allarga e compaiono le vetrine: ordinate, luccicanti e in qualche modo tristi."]] }],
        ["fg_citta", "fg_bosco", { scorte: 2 }, { when: () => true }],
        ["fg_citta", "fg_lega", { scorte: 1 }, { when: (K) => K.stepOf(3) >= 4, ev: () => [["voce", "L'Arena della Lega ha le bandiere di tutti i borghi e, nei corridoi, il silenzio di chi si prepara."]] }]
      ],
      rescue: { label: "Chiedi ospitalità a una fattoria", stat: "scorte", n: 2, cost: { fama: 1 }, text: "Una famiglia di contadini vi dà pane, formaggio e un consiglio sul tempo. La fama di tutti noi scende un po': siamo troppo educati a chiedere." }
    },
    bonds: {
      per: 6, max: 4, names: ["Conoscenti", "Colleghi", "Amici", "Fidati", "Famiglia"],
      scenes: {
        fg_ginestra: [{ lv: 2, id: "gin2", lines: [["fg_ginestra", "Ho venduto figurine per quarant'anni. Una sola volta ho fatto una cosa diversa: ne ho tenuta una. Per tutta una vita."], ["fg_ginestra", "Era Sorriso. Non era mia: mi aveva scelto lei. Tu capisci la differenza, vero?"]], reward: (K) => K.bond("fama", 1) }, { lv: 3, id: "gin3", prize: "+3 Scorte e 60 monete", lines: [["fg_ginestra", "Ti ho tenuto da parte una cosa dal retro. Non è una figura: è la chiave della vetrina. Tienila, ormai ti conoscono più di me."], ["fg_ginestra", "Se un giorno apri un'edicola, mettila sotto il bancone. Le figure sanno dove abiti."]], reward: (K) => { K.bond("scorte", 3); K.reward("fg_gin3", { coins: 60 }); } }],
        fg_nives: [{ lv: 2, id: "niv2", lines: [["fg_nives", "Vincere è la mia lingua. Perdere la imparo adesso, a vent'anni, senza dizionario."], ["fg_nives", "Grazie di avermi battuta senza guardarmi dall'alto. Ci provo anch'io, a non farlo."]], reward: (K) => K.bond("scorte", 1) }, { lv: 3, id: "niv3", prize: "+2 Fama e +2 Scorte", lines: [["fg_nives", "Ho una regola nuova: dopo ogni lotta offro io. Anche se perdo, soprattutto se perdo."], ["fg_nives", "Prendi, sono le mie scorte di riserva. Le figure hanno fame, e io ho imparato che si vince anche mangiando."]], reward: (K) => { K.bond("fama", 2); K.bond("scorte", 2); } }]
      }
    },
    inv: {
      items: {
        fg_esca: { n: "Caramella da richiamo", icon: "🍬", d: "Una caramella che le figure vanitose non resistono a guardare.", gift: { fg_nives: 2, fg_ginestra: 3 }, giftAny: 1 },
        fg_album: { n: "L'Album del Figurinaio", icon: "📒", d: "Un album con le pagine bianche e una dedica a matita: «Riempilo con rispetto».", gift: { fg_ginestra: 8 }, react: { fg_ginestra: "Il mio vecchio album! Lo riconosco dalla macchia di caffè." } },
        fg_mappa: { n: "Mappa dei Borghi", icon: "🗺️", d: "Segna sentieri e stagioni. Alcuni sentieri sono solo opinioni.", gift: { fg_nives: 3 } }
      }
    },
    clock: {
      slots: ["Mattina", "Pomeriggio", "Sera", "Notte"], hud: true, tint: [null, null, "rgba(251,146,60,.14)", "rgba(15,23,60,.30)"],
      onSlot(K, giorno, fascia, nome) { return nome === "Notte" ? [["voce", "Cala la notte e le figure d'ombra escono a prendere aria."]] : null; }
    },
    endings: {
      campione: ["Campione della Lega", "Vinci la Lega con la squadra che hai cresciuto. L'Album è pieno di nomi e di storie.", "Vinci la finale tenendo le figure catturate."],
      custode: ["Custode delle Figure", "Vinci la Lega dopo aver liberato le figure delle vetrine: chi segue te lo fa per scelta.", "Vinci la finale dopo aver liberato le figure delle vetrine."],
      album: ["L'Album Completo", "Tutte e dodici le specie hanno la loro pagina. Il figurinaio chiude gli occhi e sorride.", "Segreto: completa l'Album con tutte le 12 specie (anche evolute)."]
    },
    heroLook: () => ({ bg: ["#6b21a8", "#e9d5ff"], shirt: "#7c3aed" }),
    heroTitle: () => "cacciatore di figurine",
    musicMain: "figurine",
    music: { figurine: { bpm: 120, chords: ["Am", "F", "C", "G", "Am", "F", "G", "C"], lres: 2, lw: "square", lv: 0.035,
      lead: "A5 - C6 - E6 - D6 - | C6 - A5 - G5 - - - | F5 - A5 - C6 - A5 - | G5 - B5 - D6 - - - | A5 - C6 - E6 - D6 - | E6 - G6 - E6 - C6 - | D6 - B5 - G5 - B5 - | C6 - - - - - - -",
      bass: "R . . 5 . . R . . 5 . . R . 5 .", bv: 0.09, arp: "1 5 3 5 1 5 3 5", aw: "triangle", av: 0.012, drum: "k . . h . . s . . h . . k . h .", dv: 0.1 } },
    cameos: []
  });
  // utilità condivise dai capitoli
  const SHAPE = { fg_zolla: "blob", fg_zollone: "blob", fg_tonino: "cane", fg_muraglia: "robot", fg_svolazzo: "nuvola", fg_cometa: "fiamma", fg_piuma: "nuvola", fg_raffica: "nuvola", fg_notturno: "gatto", fg_eclisse: "ombra", fg_ghirigoro: "ombra", fg_sipario: "ombra", fg_sorriso: "blob", fg_tenerezza: "blob", fg_caldana: "fiamma", fg_orsa: "cane" };
  const COL = { campo: ["#4ade80", "#14532d"], aria: ["#7dd3fc", "#0c4a6e"], ombra: ["#a78bfa", "#2e1065"], cuore: ["#f9a8d4", "#831843"] };
  window.__figurineH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      castFigs() { Object.keys(figs).forEach((id) => { const g = figs[id], c = COL[g.type]; K.cast(id, { name: g.n, sub: "Figura " + g.type, shape: SHAPE[id], skin: c[0], shirt: c[1], hair: c[1], eye: "#fde047", bg: [c[1], c[0]] }, g.d); }); },
      // gestori di incontro per figure selvatiche: ritornano un oggetto { id: handler }
      wild(ids, chk) { const o = {}; ids.forEach((id) => { o[id] = () => { if (K.catch.own(id)) { H.say(id, "[felice] Ti riconosco. Resto nell'Album, ma ogni tanto mi affaccio."); return H.done(); } K.catch.approach(id, { done: (ok) => { if (ok) { K.bond("scorte", 1); } if (chk) chk(); H.done(); } }); }; }); return o; },
      here: (ids, ats) => ids.filter((id) => !K.catch.own(id)).map((id) => ({ id, at: ats[id] }))
    };
    return H;
  };
  window.__figurine = E.api; window.__figurineCore = E;
})();
