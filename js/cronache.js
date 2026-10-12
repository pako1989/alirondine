// js/cronache.js - LE CRONACHE DEL PALLONE DI CRISTALLO · configurazione della saga sul motore comune (js/saga-core.js)
// Saga seria ed epica, ispirata ai JRPG classici (tutto inventato). Quattro cristalli tengono in equilibrio le stagioni,
// e ognuno riposa sotto un campo da calcio di un regno diverso. Da quando si stanno spegnendo, gli stadi tacciono e le
// stagioni si fermano. Il Campione forma un gruppo — una cavaliera, un mago miope, un ladro gentile — e parte.
// Novità di questa saga (oltre a quelle del motore comune):
//  - IL GRUPPO CHE SEGUE (motore comune: cfg.party): i compagni camminano in fila dietro al Campione, in ogni zona.
//    Ci si parla guardandoli (girati verso di loro).
//  - LA MAPPA DEL MONDO: una zona a piccola scala, con montagne, boschi, mare e i luoghi come icone. Nel Capitolo 2 arriva
//    la nave: il mare diventa navigabile (un'epoca della zona) e il Campione ci va sopra.
//  - ATB (js/atb.js): la partita originale, con un motore proprio. Battaglia da JRPG, barre del tempo attivo, magie.
// Salvataggio proprio: ali-di-rondine.cronache. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__cronache || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    id: "cronache", key: "ali-di-rondine.cronache", title: "Le Cronache del Pallone di Cristallo", icon: "💠", bg: "cc_titolo", chapters: 3,
    menuSub: "Un gruppo, quattro cristalli, partite a turni come battaglie",
    theme: { accent: "#9ad8ff", ink: "#f0f4ff", paper: "rgba(14,20,70,.9)", font: "'Courier New', monospace", chipBg: "#1a2a8aee", chipBorder: "#e8e8ff" },
    stats: { gruppo: [0, 99, 0, "Unione del gruppo"], luce: [-9, 9, 0, "Luce del cuore"] },
    travel: true,
    item: ["Scheggia di cristallo", "Schegge"],
    // il gruppo che segue il Campione: chi si è unito, in ordine
    party: (K) => ["cc_lyra", "cc_fosco", "cc_rubi"].filter((id) => K.F.is("party_" + id)),
    regions: {
      borgo: { grass: ["#6aa858", "#70ae5e", "#64a252"], path: ["#c8b088", "#c0a880"], stone: ["#b8b0a0", "#b0a898"], wall: ["#d8c8a8", "#d0c0a0"], water: ["#3a8ac8", "#4494d2"], tall: "#5a9a4a", tree: ["#2a6a3a", "#3a7a42", "#4a8a4a"], tint: "255,230,180", tintA: 0.06, fx: "petals", dark: 0.05 },
      mondo: { grass: ["#7ab860", "#80be66", "#74b25a"], path: ["#d8c8a0", "#d0c098"], stone: ["#a8a098", "#a09890"], wall: ["#8a7a6a", "#82725e"], water: ["#2a6ac8", "#3474d2"], tall: "#5a9a4a", tree: ["#2a6a3a", "#3a7a42", "#2f7038"], tint: "220,235,255", tintA: 0.05, fx: "", dark: 0.02 },
      bosco: { grass: ["#4a7a3a", "#507f40", "#447434"], path: ["#8a7a5a", "#827254"], stone: ["#7a7a6a", "#727262"], wall: ["#5a4a3a", "#524234"], water: ["#2a5a7a", "#30607e"], tall: "#3a6a2a", tree: ["#1a4a2a", "#2a5a32", "#1f5028"], tint: "180,255,180", tintA: 0.08, fx: "fireflies", dark: 0.22 },
      torre: { grass: ["#4a3a6a", "#4e3e6e", "#463664"], path: ["#6a5a8a", "#645484"], stone: ["#7a6a9a", "#746494"], wall: ["#2a1a4a", "#261844"], water: ["#3a4a9a", "#4454a4"], tall: "#6a5aaa", tint: "200,170,255", tintA: 0.12, fx: "dust", dark: 0.2 },
      mare: { grass: ["#e8d8a8", "#eadcac", "#e4d4a4"], path: ["#c8b898", "#c0b090"], stone: ["#a8b0b8", "#a0a8b0"], wall: ["#d8d0c0", "#d0c8b8"], water: ["#2a8ad8", "#3494e2"], tall: "#8aaa52", tree: ["#2f6a3a", "#3f8448", "#5aa04e"], tint: "200,240,255", tintA: 0.08, fx: "", dark: 0.03 },
      stelle: { grass: ["#2a2a5a", "#30305e", "#262654"], path: ["#4a4a8a", "#444484"], stone: ["#5a5a9a", "#545494"], wall: ["#1a1a3a", "#161634"], water: ["#1a2a6a", "#20306e"], tall: "#7a7aca", tree: ["#3a3a7a", "#4a4a8a", "#5a5a9a"], tint: "180,180,255", tintA: 0.14, fx: "fireflies", dark: 0.3 },
      fuoco: { grass: ["#5a3a2a", "#603e2c", "#563626"], path: ["#8a5a3a", "#825434"], stone: ["#6a4a3a", "#644434"], wall: ["#3a1a10", "#34160e"], water: ["#e85a1a", "#f06a2a"], tall: "#8a4a2a", tree: ["#3a2a1a", "#4a3a2a", "#2a1a10"], tint: "255,140,60", tintA: 0.14, fx: "sparks", dark: 0.18 },
      casa: { grass: ["#a8784a", "#a07244", "#b07e4e"], path: ["#c89a6a", "#c09262"], stone: ["#d8c8a8", "#d0c0a0"], wall: ["#e8d0a8", "#e0c8a0"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,200,140", tintA: 0.14, fx: "dust", dark: 0.16 },
    },
    floors: "J", solid: "RPQYKUXZFC",
    rest: { ch: "s", label: "Riposa alla locanda", text: "Il gruppo riposa. Fosco russa con gli occhiali sul naso, Lyra dorme con la spada accanto, Rubi non dorme affatto: conta le stelle. (Il gioco salva da solo: qui puoi rileggere le Cronache.)" },
    texts: { chestOpen: "Apri il forziere.", chestEmpty: "Il forziere è vuoto. Sul fondo, inciso: «chi cerca, gioca».", nothing: "Niente. Ma il vento porta l'odore di un campo lontano.", noHero: "I cristalli aspettano un campione. Prima crea il tuo Campione.", chapters: "Tre cristalli da riaccendere. Le scelte del gruppo cambiano il finale." },
    journal: { name: "Le Cronache", sub: "Il gruppo, i cristalli, le magie, i finali" },
    endings: {
      stagioni: ["LE STAGIONI RITORNANO", "I quattro cristalli brillano di nuovo. Gli stadi del mondo tornano a cantare, e le stagioni a cambiare. Il gruppo si saluta sulla collina di Prato Lungo, al primo giorno di primavera.", "Sempre possibile, alla fine."],
      cavaliera: ["LA CAVALIERA DEL PRATO", "Lyra non torna al castello: resta a Prato Lungo e apre una scuola per giovani cavalieri del pallone. Lo scudo diventa una porta, la spada un fischietto.", "Serve un gruppo unitissimo."],
      silenzio: ["LA VOCE DEL SILENZIO", "Il Re del Silenzio non viene sconfitto: viene ascoltato. Era un vecchio portiere che nessuno aveva mai sentito esultare. Adesso esulta per primo, a ogni gol.", "Serve la luce piena nel cuore."],
      quinto: ["IL QUINTO CRISTALLO", "Il quinto cristallo non sta sotto nessun campo: è il gruppo stesso. Brilla ogni volta che i quattro passano la palla senza guardare.", "Segreto: tutte le schegge del mondo e il gruppo unito fino in fondo."],
    },
    heroLook: (h, K) => ({ bg: ["#0e1446", "#9ad8ff"], shirt: K.F.is("cc_mantello") ? "#2a4ab8" : h.shirt }),
    heroTitle: (K) => (K.F.is("cc_mantello") ? "custode dei cristalli" : "viandante"),
    act: { q: "Entra", F: "Sali sulla Montagna di Fuoco", C: "Entra nello Stadio delle Stelle", Z: "Entra nel bosco", R: "Guarda le montagne", P: "Entra nel paese", Q: "Entra nella torre", Y: "Tocca il cristallo", K: "Entra nel porto", U: "Sbarca sull'isola", X: "Guarda il forziere antico", "^": "Esci", v: "Esci", "<": "Esci", ">": "Esci" },
    musicMain: "cronache",
    music: {
      // un tema da mappa del mondo: ottoni (onda quadra), archi (triangolo), passo di marcia
      cronache: { bpm: 108, chords: ["C", "G", "Am", "F", "C", "G", "F", "G"], lres: 2, lw: "square", lv: 0.035,
        lead: "E5 - - G5 C6 - - - | B5 - A5 - G5 - - - | A5 - - C6 E6 - - - | D6 - C6 - A5 - - - | E5 - - G5 C6 - - E6 | D6 - B5 - G5 - - - | A5 - C6 - F6 - E6 - | D6 - - - - - - -",
        bass: "R . 5 . R . 5 . R . 5 . R . 8 .", bv: 0.1, arp: "1 3 5 8 1 3 5 8 1 3 5 8 1 3 5 8", aw: "triangle", av: 0.022, drum: "k . . h s . . h k . . h s . h h", dv: 0.2 },
    },
    paint: {
      // la mappa del mondo, in piccolo: montagne, paesi, la torre, il tempio del cristallo, il porto, l'isola
      R(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g, h = 9 + ((tx * 7 + ty * 3) % 4); g.fillStyle = "#7a6a5a"; g.beginPath(); g.moveTo(sx + 1, sy + 15); g.lineTo(sx + 8, sy + 15 - h); g.lineTo(sx + 15, sy + 15); g.closePath(); g.fill(); g.fillStyle = "#9a8a7a"; g.beginPath(); g.moveTo(sx + 8, sy + 15 - h); g.lineTo(sx + 15, sy + 15); g.lineTo(sx + 9, sy + 15); g.closePath(); g.fill(); g.fillStyle = "#f4f4f8"; g.beginPath(); g.moveTo(sx + 8, sy + 15 - h); g.lineTo(sx + 6, sy + 18 - h); g.lineTo(sx + 10, sy + 18 - h); g.closePath(); g.fill(); },
      P(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); [[2, 6, "#c8584a"], [9, 4, "#3a6ab8"]].forEach(([x, y, c]) => { K.P(sx + x, sy + y + 4, 6, 6, "#f0e0c0"); const g = K.g; g.fillStyle = c; g.beginPath(); g.moveTo(sx + x - 1, sy + y + 4); g.lineTo(sx + x + 3, sy + y); g.lineTo(sx + x + 7, sy + y + 4); g.closePath(); g.fill(); }); },
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx, y = ty * TS - cy; g.fillStyle = "#4a3a6a"; g.fillRect(x + 4, y - 14, 8, 30); g.fillStyle = "#2a1a4a"; g.beginPath(); g.moveTo(x + 2, y - 14); g.lineTo(x + 8, y - 24); g.lineTo(x + 14, y - 14); g.closePath(); g.fill(); g.fillStyle = Math.floor(fr / 30) % 2 ? "#ffd23f" : "#c88aff"; g.fillRect(x + 7, y - 8, 2, 3); K.light(x + 8, y - 7, 14, "200,150,255", 0.4); }); },
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const lit = K.F.is("cristallo_" + K.ZX.id), g = K.g, b = Math.sin(fr / 20) * 1.5; K.P(sx + 3, sy + 11, 10, 4, "#8a8a9a"); g.fillStyle = lit ? "#7af0c8" : "#6a7a8a"; g.beginPath(); g.moveTo(sx + 8, sy - 2 + b); g.lineTo(sx + 13, sy + 5 + b); g.lineTo(sx + 8, sy + 12 + b); g.lineTo(sx + 3, sy + 5 + b); g.closePath(); g.fill(); g.fillStyle = "rgba(255,255,255,.6)"; g.fillRect(sx + 6, sy + 2 + b, 2, 4); if (lit) K.light(sx + 8, sy + 5, 34, "122,240,200", 0.6); else K.light(sx + 8, sy + 5, 12, "160,170,190", 0.15); },
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx + 1, sy + 9, 14, 6, "#8a6a4a"); K.P(sx + 7, sy, 2, 10, "#5a4a3a"); const g = K.g; g.fillStyle = "#f4ecdc"; g.beginPath(); g.moveTo(sx + 9, sy + 1); g.lineTo(sx + 15, sy + 7); g.lineTo(sx + 9, sy + 7); g.closePath(); g.fill(); },
      U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#e8d8a8"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7, 5, 0, 0, 7); g.fill(); K.P(sx + 7, sy + 1, 2, 8, "#6a4a2a"); g.fillStyle = "#3a8a3a"; g.beginPath(); g.ellipse(sx + 8, sy + 1, 6, 3, Math.sin(fr / 40) * 0.2, 0, 7); g.fill(); },
      Z(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; [[3, 9], [8, 6], [12, 10]].forEach(([x, y]) => { g.fillStyle = "#1a4a2a"; g.beginPath(); g.arc(sx + x, sy + y, 4, 0, 7); g.fill(); }); const lit = K.F.is("cristallo_cc_bosco"); g.fillStyle = lit ? "#7af0c8" : "#8a9aaa"; g.fillRect(sx + 7, sy + 11, 2, 3); if (lit) K.light(sx + 8, sy + 12, 12, "122,240,200", 0.4); },
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a2a"; g.beginPath(); g.moveTo(sx, sy + 15); g.lineTo(sx + 6, sy + 2); g.lineTo(sx + 10, sy + 2); g.lineTo(sx + 16, sy + 15); g.closePath(); g.fill(); K.P(sx + 6, sy + 1, 4, 3, K.F.is("cristallo_cc_vulcano") ? "#ff8a5a" : "#c84a1a"); K.P(sx + 7 + Math.sin(fr / 10) * 1, sy - 3 - (fr / 8) % 4, 2, 2, "rgba(120,120,120,.6)"); K.light(sx + 8, sy + 2, 14, "255,120,40", 0.5); },
      C(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx, y = ty * TS - cy + Math.sin(fr / 30) * 2; g.fillStyle = "#3a3a7a"; g.fillRect(x + 2, y - 6, 12, 12); g.fillRect(x, y - 10, 4, 8); g.fillRect(x + 12, y - 10, 4, 8); g.fillStyle = "#c8a8ff"; g.fillRect(x + 6, y - 2, 4, 6); for (let i = 0; i < 3; i++) g.fillRect(x + 2 + i * 6, y - 14 + (i % 2) * 2, 1, 1); K.light(x + 8, y, 18, "200,170,255", 0.4); }); },
      X(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx + 2, sy + 6, 12, 9, "#8a5a2a"); K.P(sx + 2, sy + 6, 12, 3, "#a87a3a"); K.P(sx + 7, sy + 8, 2, 3, "#ffd23f"); },
      // il mare navigabile (Capitolo 2, con la nave): acqua con le onde, ci si passa sopra
      J(K, sx, sy, tx, ty, fr) { const R = K.ZX.rg; K.P(sx, sy, 16, 16, R.water[(tx + ty) % 2]); const w = Math.floor(fr / 20 + tx + ty) % 4; K.P(sx + 2 + w * 3, sy + 5 + ((tx * 3) % 7), 5, 1, "rgba(255,255,255,.45)"); },
    },
    floorPaint(K, f, sx, sy, tx, ty) { if (f === "J") { K.P(sx, sy, 16, 16, K.ZX.rg.water[(tx + ty) % 2]); return true; } return false; },
    cameos: [
      { id: "ts_iole", zone: "cc_prato", at: [26, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.torneo") || {}).done?.[1], lines: [
        ["ts_iole", "{n}! Che ci fai in un mondo con le stagioni ferme? Io? Ho preso il pullman sbagliato. Succede, alla mia età. Però qui hanno un bel campo, anche se l'erba è grigia."],
        ["ts_iole", "Un consiglio da vecchia maestra: in questi tornei a turni, aspettare il momento giusto vale più che correre. Il fischietto lo suono quando serve, non prima."]] },
      { id: "so_arbi", zone: "cc_mondo", at: [24, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.spazio") || {}).done?.[1], lines: [
        ["so_arbi", "BIP. Sono atterrato con una capsula di salvataggio. Questo mondo ha le montagne in fuorigioco. Tutte. Le ho fischiate tutte. Mi sento utile."]] },
    ],
  });
  const K = E.K;
  // la nave: nella mappa del mondo, sotto il Campione, quando si va per mare (epoca «nave» della mappa)
  K.joinParty = (id) => { K.F.set("party_" + id, true); K.refreshZone(); };
  window.__cronache = E.api;
})();
