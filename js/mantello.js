// js/mantello.js - IL MANTELLO GRANATA · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA, a fumetti di supereroi (tutto inventato). Metropolenta, città di canali, tetti e auto in doppia fila.
// Nella sartoria di Nonna Tilde c'è un mantello granata cucito con la maglia di una squadra che non esiste più: chi lo
// indossa diventa il Mantello Granata. I cattivi? I Panchinari, Madame Colla e il terribile Dottor Fuorigioco.
// Novità di questa saga (oltre a quelle del motore comune):
//  - SUPER-BOTTONI (js/bottoni.js): la partita originale, con un motore suo. Calcio a bottoni dall'alto, a turni, con
//    la fisica e la fionda; un SUPERPOTERE diverso a ogni partita e i contro-poteri dei cattivi.
//  - LE FORME DELL'EROE (motore comune: cfg.pass e cfg.heroFx): in esplorazione il Campione si trasforma.
//      Volo (sospeso, passa sopra i canali) · Mini (piccolissimo, passa tra le sbarre delle inferriate)
//      Gigante (enorme, scavalca le auto in doppia fila). Si cambia forma nelle cabine telefoniche o dal menu.
//  - GRAFICA A FUMETTO: retino a punti su tutta la città, didascalie gialle del narratore all'ingresso di ogni zona
//    («INTANTO, AL PORTO…») e lo scoppio «POW!» quando l'eroe si trasforma.
// Salvataggio proprio: ali-di-rondine.mantello. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__mantello || !window.__sagaCore) return;
  const TS = 16, CAPE = "#8a1a2a";
  const FORMS = {
    "": { name: "Campione", sub: "La forma di tutti i giorni", icon: "🙂" },
    volo: { name: "Volo", sub: "Sospeso a un palmo da terra: passi sopra i canali", icon: "🦸", pass: "w", flag: "forma_volo" },
    mini: { name: "Mini", sub: "Piccolo come un bottone: passi tra le sbarre delle inferriate", icon: "🐜", pass: "I", flag: "forma_mini" },
    gigante: { name: "Gigante", sub: "Grande come un lampione: scavalchi le auto in doppia fila", icon: "🦍", pass: "K", flag: "forma_gigante" },
  };
  const FXS = { t: -999, txt: "", cap: null, capT: -999 };
  const E = window.__sagaCore.create({
    id: "mantello", key: "ali-di-rondine.mantello", title: "Il Mantello Granata", icon: "🦸", bg: "mg_titolo", chapters: 3,
    menuSub: "Un mantello, tre forme, cattivi ridicoli e partite a bottoni con i superpoteri",
    theme: { accent: "#d82a3a", ink: "#fff8e8", paper: "rgba(20,16,40,.9)", font: "'Trebuchet MS', 'Comic Sans MS', sans-serif", chipBg: "#2a1030ee", chipBorder: "#ffd23f" },
    stats: { fama: [0, 99, 0, "Fama del Mantello Granata"], segreto: [-9, 9, 0, "Identità segreta"] },
    travel: true,
    item: ["Ritaglio di stoffa granata", "Ritagli"],
    party: (K) => ["mg_bullone", "mg_gilda"].filter((id) => K.F.is("party_" + id)),
    regions: {
      citta: { grass: ["#7ab860", "#80be66", "#74b25a"], path: ["#c8c0b0", "#c0b8a8"], stone: ["#b8b0c8", "#b0a8c0"], wall: ["#e8a87a", "#dc9c6e"], water: ["#2a8ad8", "#3494e2"], tall: "#5a9a4a", tree: ["#2a7a3a", "#3a8a42", "#4a9a4a"], tint: "255,230,200", tintA: 0.05, fx: "", dark: 0.02 },
      tetti: { grass: ["#5a4a6a", "#604e70", "#564666"], path: ["#8a6a5a", "#826454"], stone: ["#7a6a8a", "#746484"], wall: ["#3a2a4a", "#342644"], water: ["#2a4a8a", "#30508e"], tall: "#6a5a8a", tree: ["#2a3a5a", "#3a4a6a", "#2a2a4a"], tint: "160,160,255", tintA: 0.12, fx: "fireflies", dark: 0.26 },
      fabbrica: { grass: ["#8a8a6a", "#908f70", "#848464"], path: ["#a8a090", "#a09888"], stone: ["#9a9aa8", "#9494a2"], wall: ["#6a6a7a", "#646474"], water: ["#c8e05a", "#d0e864"], tall: "#8aaa52", tree: ["#4a6a3a", "#5a7a42", "#3a5a32"], tint: "230,255,150", tintA: 0.1, fx: "dust", dark: 0.1 },
      torre: { grass: ["#6a6a8a", "#706e90", "#666486"], path: ["#a89a8a", "#a09282"], stone: ["#b8a8c8", "#b0a0c0"], wall: ["#4a3a5a", "#443654"], water: ["#3a5aa8", "#4464b2"], tall: "#7a7aaa", tree: ["#3a3a5a", "#4a4a6a", "#2a2a4a"], tint: "255,210,160", tintA: 0.12, fx: "", dark: 0.16 },
      casa: { grass: ["#a8784a", "#a07244", "#b07e4e"], path: ["#c89a6a", "#c09262"], stone: ["#d8c8a8", "#d0c0a0"], wall: ["#e8c8d0", "#e0c0c8"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,200,160", tintA: 0.14, fx: "dust", dark: 0.14 },
    },
    floors: "", solid: "JKIE",
    rest: { ch: "s", label: "Siediti sulla panchina", text: "Ti siedi. Da qui si vede tutta Metropolenta: i canali, i tetti, l'orologio della Torre. Bullone si siede accanto e fa «bip» piano, per non disturbare. (Il gioco salva da solo: qui puoi rileggere l'Albo del Mantello.)" },
    texts: { chestOpen: "Apri la scatola.", chestEmpty: "La scatola è vuota. Dentro, un biglietto: «Continua nel prossimo numero».", nothing: "Niente. Ma da qualche parte, in città, qualcuno sta tramando qualcosa.", noHero: "Metropolenta ha bisogno di un eroe. Prima crea il tuo Campione.", chapters: "Tre numeri dell'albo, tre cattivi. Le scelte cambiano il finale." },
    journal: { name: "L'Albo del Mantello", sub: "Forme, poteri, cattivi, finali" },
    endings: {
      eroe: ["L'EROE DI METROPOLENTA", "Il Mantello Granata resta in città. Quando un pallone finisce sul tetto, quando un tram si ferma, quando qualcuno ha bisogno di una mano: un lampo granata, e la mano c'è.", "Sempre possibile, alla fine."],
      lega: ["LA LEGA DEI MANTELLI", "Tutti sanno chi sei, e nessuno se ne fa un problema: anzi, Nonna Tilde cuce mantelli per tutta la squadra. Nasce la Lega dei Mantelli: undici eroi, nessun segreto.", "Serve aver svelato la tua identità."],
      arbitro: ["IL DOTTORE CON IL FISCHIETTO", "Il Dottor Fuorigioco non va in prigione: va a fare un corso da arbitro. Fischia ancora il fuorigioco, ma solo quando c'è. È il miglior arbitro della città. Piange quando dà un rigore.", "Serve tanta fama in città."],
      tilde: ["LA PRIMA MANTELLO GRANATA", "Il segreto più grande di Metropolenta: la prima Mantello Granata, quarant'anni fa, era Nonna Tilde. I ritagli di stoffa lo raccontano, uno dopo l'altro. Lei sorride e infila l'ago: «Ce ne voleva un'altra, era ora».", "Segreto: tutti i ritagli di stoffa della città e l'identità segreta custodita bene."],
    },
    heroLook: (h, K) => ({ bg: ["#2a1030", "#d82a3a"], shirt: K.F.is("mg_mantello") ? CAPE : h.shirt }),
    heroTitle: (K) => (K.F.is("mg_mantello") ? "il Mantello Granata" + (FORMS[form(K)].pass ? " · forma " + FORMS[form(K)].name : "") : "sarto per un giorno"),
    act: { q: "Entra", J: "Entra nella cabina telefonica", K: "Guarda l'auto in doppia fila", I: "Guarda l'inferriata", E: "Guarda l'edicola", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    // LE FORME: cosa si attraversa adesso, e come appare l'eroe (scala, volo, mantello)
    pass: (K) => FORMS[form(K)].pass || "",
    heroFx: (K) => {
      if (!K.F.is("mg_mantello")) return null; const f = form(K);
      return { cape: CAPE, s: f === "mini" ? 0.55 : f === "gigante" ? 1.6 : 1, dy: f === "volo" ? 7 : 0, aura: f === "gigante" ? "#ffd23f" : f === "mini" ? "#9ad8ff" : "" };
    },
    zoneMenuExtra: (K) => (K.F.is("mg_mantello") ? [{ label: "🦸 Cambia forma", sub: `Adesso: ${FORMS[form(K)].name}`, fn: () => formMenu(K) }] : []),
    // retino a punti da fumetto su tutta la città
    mood(g, fr) { g.fillStyle = "rgba(40,20,60,.07)"; for (let y = 0; y < 200; y += 6) for (let x = (y / 6) % 2 ? 3 : 0; x < 320; x += 6) g.fillRect(x, y, 1.4, 1.4); },
    plugins: [{
      enter(zid, spec) { FXS.cap = spec.caption || `INTANTO, ${String(spec.short || "").toUpperCase()}…`; FXS.capT = performance.now(); },
      top(g, zid, spec, cx, cy, d, K) { // lo scoppio «POW!» della trasformazione, intorno all'eroe
        const age = (performance.now() - FXS.t) / 16; if (age > 50) return; const p = K.api.trPos(); if (!p) return;
        const x = p[0] - cx, y = p[1] - cy - 14, s = Math.min(1, age / 6) * (1 - Math.max(0, age - 36) / 14);
        g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-0.15); g.fillStyle = "#ffd23f"; g.beginPath(); for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2, r = i % 2 ? 14 : 26; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.strokeStyle = "#121212"; g.lineWidth = 1.5; g.stroke();
        g.font = "900 10px Impact, sans-serif"; g.textAlign = "center"; g.fillStyle = "#d82a3a"; g.strokeStyle = "#fff"; g.lineWidth = 2.5; g.strokeText(FXS.txt, 0, 4); g.fillText(FXS.txt, 0, 4); g.textAlign = "left"; g.restore();
      },
      hud(g) { // la didascalia gialla del narratore, in alto a destra, all'ingresso di ogni zona
        const age = (performance.now() - FXS.capT) / 16; if (!FXS.cap || age > 200) return; const a = Math.min(1, age / 10, (200 - age) / 20);
        g.save(); g.globalAlpha = a; g.font = "bold 8px 'Comic Sans MS', 'Trebuchet MS', sans-serif"; const w = Math.min(300, g.measureText(FXS.cap).width + 12);
        const x = 314 - w; g.fillStyle = "#121212"; g.fillRect(x + 2, 24, w, 15); g.fillStyle = "#ffe84a"; g.fillRect(x, 22, w, 15); g.strokeStyle = "#121212"; g.lineWidth = 1.2; g.strokeRect(x, 22, w, 15); g.fillStyle = "#121212"; g.fillText(FXS.cap, x + 6, 32.5); g.restore();
      },
      obj(ch, tx, ty, zid, spec, K) { if (ch !== "J") return false; if (!K.F.is("mg_mantello")) { K.say([["voce", "Una cabina telefonica. Dentro c'è odore di monetine e di avventura. Senza mantello, però, è solo una cabina."]]); return true; } formMenu(K, true); return true; },
    }],
    musicMain: "mantello",
    music: {
      // una marcia da supereroe: ottoni (onda quadra) che salgono, rullante, e un basso che corre
      mantello: { bpm: 128, chords: ["C", "C", "F", "G", "Am", "F", "G", "G"], lres: 2, lw: "square", lv: 0.04,
        lead: "G4 . C5 . E5 - G5 - | G5 - - - E5 . G5 . | A5 - - F5 C6 - A5 . | G5 - - - - - D5 . | E5 . G5 . C6 - B5 . | A5 - F5 - A5 - C6 - | B5 - G5 - D6 - B5 . | C6 - - - G5 - - .",
        bass: "R . R . 5 . R . R . R . 5 . 8 .", bv: 0.1, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "triangle", av: 0.018, drum: "k . s s k . s . k k s . k . s s", dv: 0.3 },
    },
    paint: {
      // la cabina telefonica: dove l'eroe si trasforma
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx, y = ty * TS - cy; g.fillStyle = "#1a3a8a"; g.fillRect(x + 2, y - 12, 12, 27); g.fillStyle = "#9ad8ff"; g.fillRect(x + 4, y - 8, 8, 14); g.fillStyle = "#1a3a8a"; g.fillRect(x + 7.5, y - 8, 1, 14); g.fillRect(x + 4, y - 1, 8, 1); g.fillStyle = "#fff"; g.font = "bold 3.6px sans-serif"; g.fillText("TELEFONO", x + 2.6, y - 9); g.strokeStyle = "#121212"; g.lineWidth = 1; g.strokeRect(x + 2, y - 12, 12, 27); if (Math.floor(fr / 40) % 2) K.light(x + 8, y - 2, 16, "154,216,255", 0.35); }); },
      // un'auto in doppia fila (il Gigante la scavalca)
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const c = ["#e83a3a", "#3a8ac8", "#e8c84a", "#5aa84a"][(tx * 3 + ty) % 4]; K.P(sx + 1, sy + 6, 14, 7, c); K.P(sx + 3, sy + 2, 10, 5, c); K.P(sx + 4, sy + 3, 3, 3, "#c8e8ff"); K.P(sx + 9, sy + 3, 3, 3, "#c8e8ff"); K.P(sx + 2, sy + 12, 3, 3, "#121212"); K.P(sx + 11, sy + 12, 3, 3, "#121212"); K.P(sx + 1, sy + 6, 14, 1, "rgba(255,255,255,.35)"); },
      // un'inferriata: sbarre fitte, ci passa solo un bottone
      I(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx, sy + 2, 16, 2, "#3a3a4a"); K.P(sx, sy + 13, 16, 2, "#3a3a4a"); for (let i = 1; i < 16; i += 3) K.P(sx + i, sy + 2, 1.4, 13, "#4a4a5a"); K.P(sx + 7, sy, 2, 3, "#d8a83a"); },
      // l'edicola dei giornali (il Corriere di Metropolenta)
      E(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx + 1, sy + 4, 14, 11, "#2a6a3a"); K.P(sx, sy + 1, 16, 4, "#1a4a2a"); for (let i = 0; i < 3; i++) K.P(sx + 2 + i * 4.5, sy + 6, 3.5, 5, ["#f4ecdc", "#ffd23f", "#e8a8c8"][(i + tx) % 3]); K.P(sx + 2, sy + 7.5, 3.5, 0.8, "#121212"); },
    },
    cameos: [
      { id: "cc_fosco", zone: "mg_piazza", at: [5, 14], when: (K) => !!(K.otherSaga("ali-di-rondine.cronache") || {}).done?.[1], lines: [
        ["cc_fosco", "{n}! Sono arrivato con un incantesimo di Vento, ho sbagliato mondo. Qui la gente vola col mantello e nessuno fa una piega. Nel mio mondo almeno ci vuole un cristallo."],
        ["cc_fosco", "Un consiglio da mago: nella partita a bottoni, tira piano quando il pallone è vicino. Il troppo stroppia. Anche negli incantesimi."]] },
      { id: "ts_iole", zone: "mg_viale", at: [3, 4], when: (K) => !!(K.otherSaga("ali-di-rondine.torneo") || {}).done?.[1], lines: [
        ["ts_iole", "Un supereroe! Ai miei tempi bastava un fischietto. Comunque bel mantello. Non inciampare, quando tiri: il mantello va tenuto dietro, come i rimpianti."]] },
    ],
  });
  const K = E.K;
  function form(k) { const f = (k || K).F.get("forma", ""); return FORMS[f] ? f : ""; }
  function heroTiles() { // le tessere sotto i piedi dell'eroe (gli stessi quattro punti del controllo del passo)
    const p = K.api.trPos(); if (!p) return []; return [[-5, -4], [5, -4], [-5, 2], [5, 2]].map(([ox, oy]) => K.at(Math.floor((p[0] + ox) / TS), Math.floor((p[1] + oy - 4) / TS)));
  }
  function setForm(f, quiet) {
    const cur = form(), Z = K.api.TRZ[K.api.trZone()] || {}, solid = "~#TSGMORWLNHBDW" + (Z.solid || ""), np = FORMS[f].pass || "";
    if (f === cur) return true;
    if (heroTiles().some((c) => solid.includes(c) && !np.includes(c))) { K.say([["voce", "Non qui! Se cambi forma adesso, finisci " + (cur === "volo" ? "a mollo nel canale" : cur === "mini" ? "incastrato nell'inferriata" : "schiacciato tra le auto") + ". Spostati prima."]]); return false; }
    K.F.set("forma", f); FXS.t = performance.now(); FXS.txt = f === "volo" ? "WHOOSH!" : f === "mini" ? "ZIP!" : f === "gigante" ? "BOOM!" : "POF!";
    K.tone(f === "gigante" ? 110 : f === "mini" ? 1200 : 520, 0.25, "square", 0.06, 0, f === "gigante" ? 55 : f === "mini" ? 2400 : 1040);
    if (!quiet) K.done();
    return true;
  }
  function formMenu(k, booth) {
    const opts = Object.keys(FORMS).filter((f) => !FORMS[f].flag || K.F.is(FORMS[f].flag)).map((f) => ({ label: `${FORMS[f].icon} ${FORMS[f].name}${f === form() ? " (adesso)" : ""}`, sub: FORMS[f].sub, fn: () => setForm(f) }));
    opts.push({ label: "◂ Lascia stare", fn: () => K.done() });
    K.ask("voce", booth ? "Entri nella cabina. Il telefono squilla, rispondi: «Pronto, Mantello?». Dall'altra parte, Nonna Tilde: «Cambiati, caro, che fuori c'è bisogno». In che forma esci?" : "Ti giri su te stesso, il mantello fa un mulinello. In che forma?", opts);
  }
  K.FORMS = FORMS; K.form = () => form(); K.setForm = setForm; K.formMenu = () => formMenu(K);
  K.joinParty = (id) => { K.F.set("party_" + id, true); K.refreshZone(); };
  window.__mantello = E.api;
})();
