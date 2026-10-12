// js/torneo.js - IL TORNEO DELLE CENTO SCUOLE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga seria, con lampi comici. Ispirata agli anime e manga sportivi di torneo (tutto inventato).
// Portolungo, città di mare, estate: arriva il Torneo delle Cento Scuole, quello delle scuole calcio di tutta la Riviera.
// Il Campione si iscrive con una squadra che una scuola calcio non ce l'ha: il panettiere, la postina, i gemelli bagnini.
// Ad allenarli, una vecchia maestra che non allena da trent'anni. Il favorito è l'Accademia del Faro, del capitano Ettore Vela.
// Novità di questa saga (oltre a quelle del motore comune):
//  - VIGNETTE (js/vignette.js): la partita originale, con un motore suo. Vista di lato, ad azioni, tecniche di squadra.
//  - PERSONAGGI CHE CAMMINANO (motore comune: route dei PNG): la città è viva, la gente gira per le strade.
//  - IL TABELLONE: in piazza c'è il tabellone del torneo, che si aggiorna con i risultati (anche delle altre partite,
//    che dipendono dalle tue scelte). Si consulta anche dal menu, in qualunque momento.
// Salvataggio proprio: ali-di-rondine.torneo. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__torneo || !window.__sagaCore) return;
  const TS = 16;
  // le otto squadre del tabellone (quarti di finale): accanto, chi incontra chi
  const TEAMS = ["La Via Lunga", "I Gabbiani del Porto", "Ragazzi del Mercato", "Le Lanterne", "Collegio San Biagio", "Scuola dei Pescatori", "Real Ciabatta", "Accademia del Faro"];
  function bracket(K) {
    // i risultati si leggono dai flag della saga: chi è passato a ogni turno
    const F = K.F, q = [F.get("tb_q0", ""), F.get("tb_q1", ""), F.get("tb_q2", ""), F.get("tb_q3", "")], s = [F.get("tb_s0", ""), F.get("tb_s1", "")], f = F.get("tb_f", "");
    return { quarti: [[TEAMS[0], TEAMS[1], q[0]], [TEAMS[2], TEAMS[3], q[1]], [TEAMS[4], TEAMS[5], q[2]], [TEAMS[6], TEAMS[7], q[3]]], semi: [[q[0], q[1], s[0]], [q[2], q[3], s[1]]], finale: [s[0], s[1], f] };
  }
  function bracketHtml(K) {
    const b = bracket(K), row = (a, c, w) => `<div style="display:flex;justify-content:space-between;gap:6px;padding:3px 6px;border-bottom:1px dashed #ffffff33"><span style="${w && w === a ? "color:#ffd23f;font-weight:800" : w ? "opacity:.5;text-decoration:line-through" : ""}">${a || "?"}</span><span style="opacity:.6">vs</span><span style="${w && w === c ? "color:#ffd23f;font-weight:800" : w ? "opacity:.5;text-decoration:line-through" : ""}">${c || "?"}</span></div>`;
    return `<b>🏆 Il Tabellone delle Cento Scuole</b><br><span style="color:var(--dim)">Quarti di finale</span>${b.quarti.map((m) => row(...m)).join("")}<br><span style="color:var(--dim)">Semifinali</span>${b.semi.map((m) => row(...m)).join("")}<br><span style="color:var(--dim)">Finale</span>${row(...b.finale)}${b.finale[2] ? `<br><b style="color:#ffd23f">Campioni: ${b.finale[2]}</b>` : ""}`;
  }
  const E = window.__sagaCore.create({
    stadium: { azPitch: "campo", cageField: 0, cageMut: "narrow", venue: { ads: [["TORNEO DELLE CENTO SCUOLE", "#c83a3a"], ["CLUB DI CALCIO", "#2a4a8a"], ["MENSA DELLA SCUOLA", "#e8c84a"], ["SPIRITO DI SQUADRA", "#3a8a5a"]], crowd: ["#c83a3a", "#2a4a8a", "#e8c84a", "#ffffff", "#3a8a5a"], ground: ["#3fa05a", "#38984f"], line: "#ffffffcc", grid: "rgba(255,255,255,.05)", tint: "rgba(255,210,180,.06)", glow: "255,220,190", sky: ["#5a8ad8", "#c8e0f8"], fx: { spd: 1.03 } } }, // lo stadio della saga: campo, cartelloni, meteo e regole per tutte le partite a scelta
    id: "torneo", key: "ali-di-rondine.torneo", title: "Il Torneo delle Cento Scuole", icon: "🏆", bg: "ts_porto", chapters: 3,
    menuSub: "Il panettiere, la postina, i gemelli bagnini e una partita a fumetti",
    theme: { accent: "#e83a3a", ink: "#fbf6ea", paper: "rgba(24,20,18,.88)", font: "'Trebuchet MS', sans-serif", chipBg: "#2a1a18ee", chipBorder: "#e83a3a" },
    stats: { squadra: [0, 99, 0, "Spirito della Via Lunga"], rivale: [-9, 9, 0, "Rispetto di Ettore Vela"] },
    travel: true,
    item: ["Fischietto di latta", "Fischietti"],
    regions: {
      citta: { grass: ["#7aa860", "#80ae66", "#74a25a"], path: ["#d8c8a8", "#d0c0a0"], stone: ["#c8b8a0", "#c0b098"], wall: ["#e8a87a", "#dc9c6e"], water: ["#3a8ac8", "#4494d2"], tall: "#5a8a3a", tree: ["#3a7a3a", "#4a8a42", "#5a9a4a"], tint: "255,220,170", tintA: 0.08, fx: "", dark: 0.04 },
      spiaggia: { grass: ["#e8d8a8", "#eadcac", "#e4d4a4"], path: ["#d8c898", "#d0c090"], stone: ["#c8c0b0", "#c0b8a8"], wall: ["#e8e0d0", "#dcd4c4"], water: ["#2a9ad8", "#34a4e2"], tall: "#8aaa52", tree: ["#2f6a3a", "#3f8448", "#5aa04e"], tint: "255,210,140", tintA: 0.1, fx: "", dark: 0.03 },
      campo: { grass: ["#4f9a3e", "#57a446", "#4a943a"], path: ["#c8b898", "#c0b090"], stone: ["#a8a8a8", "#a0a0a0"], wall: ["#3a5a8a", "#345484"], water: ["#3a8ac8", "#4494d2"], tall: "#3a7a2a", tree: ["#2a6a3a", "#3a7a42", "#4a8a4a"], tint: "220,240,255", tintA: 0.06, fx: "", dark: 0.05 },
      casa: { grass: ["#a8784a", "#a07244", "#b07e4e"], path: ["#c89a6a", "#c09262"], stone: ["#d8c8a8", "#d0c0a0"], wall: ["#f0d8b0", "#e8d0a8"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,200,140", tintA: 0.14, fx: "dust", dark: 0.14 },
    },
    floors: "", solid: "PFCYJK",
    rest: { ch: "s", label: "Siediti sulla panchina", text: "Ti siedi sulla panchina. Da qui si sente il mare, il forno di Tito e, in lontananza, qualcuno che si allena. (Il gioco salva da solo: qui puoi rileggere il Quaderno del Torneo.)" },
    texts: { chestOpen: "Apri la borsa.", chestEmpty: "La borsa è vuota. Odora di crema solare e di pane.", nothing: "Niente. Solo il rumore del mare.", noHero: "Il Torneo delle Cento Scuole cerca squadre. Prima crea il tuo Campione.", chapters: "Tre turni di torneo. Le scelte cambiano il tabellone e il finale." },
    journal: { name: "Il Quaderno del Torneo", sub: "Squadra, tecniche, tabellone, finali" },
    endings: {
      festa: ["LA FESTA DELLA VIA LUNGA", "Comunque sia andata, la Via Lunga fa festa in piazza fino all'alba. Tito sforna pane a forma di pallone. L'anno prossimo si torna.", "Sempre possibile, alla fine."],
      amicizia: ["IL CAPITANO DEL FARO", "Ettore Vela lascia l'Accademia e chiede di giocare con la Via Lunga. «Voglio imparare a perdere senza vergogna. E a vincere ridendo.»", "Serve il pieno rispetto di Ettore Vela."],
      maestra: ["LA MAESTRA TORNA", "La maestra Iole riapre la sua vecchia scuola calcio, sotto i portici, gratis per tutti. Il primo iscritto è un bambino col grembiule da panettiere.", "Serve uno spirito di squadra fortissimo."],
      tutte: ["IL TORNEO DI TUTTE LE STRADE", "L'anno dopo il torneo cambia nome: non più Cento Scuole, ma Tutte le Strade. Possono iscriversi tutti, anche chi una scuola calcio non ce l'ha.", "Segreto: tutte le tecniche usate in finale e tutte le lettere di Alba consegnate."],
    },
    heroLook: (h, K) => ({ bg: ["#2a1a18", "#e83a3a"], shirt: K.F.is("ts_maglia") ? "#e83a3a" : h.shirt }),
    heroTitle: (K) => (K.F.is("ts_maglia") ? "capitano della Via Lunga" : "aspirante iscritto"),
    act: { q: "Entra", P: "Guarda il tabellone", F: "Guarda il forno", C: "Guarda la cassetta", Y: "Guarda l'ombrellone", J: "Guarda la torretta", K: "Guarda la bancarella", "<": "Cambia zona", ">": "Cambia zona", "^": "Cambia zona", v: "Cambia zona" },
    zoneMenuExtra: (K) => [{ label: "🏆 Il Tabellone", sub: "Chi ha passato il turno", fn: () => K.say([["voce", bracketHtml(K)]]) }],
    mainExtra: (K) => [{ label: "🏆 Il Tabellone", sub: "Chi ha passato il turno", fn: () => K.api.scene("ts_piazza", "voce", bracketHtml(K), [{ label: "◂ Indietro", fn: () => K.openMain() }], "Il Torneo delle Cento Scuole") }],
    musicMain: "torneo",
    music: {
      // un tema da sigla di anime sportivo: chitarre (onda quadra), batteria piena, ritornello che sale
      torneo: { bpm: 142, chords: ["D", "A", "Bm", "G", "D", "A", "G", "A"], lres: 2, lw: "square", lv: 0.04,
        lead: "F#5 . A5 . D6 - C#6 . | A5 . F#5 . E5 - - . | F#5 . B5 . D6 - C#6 . | B5 - A5 - G5 - - . | F#5 . A5 . D6 - E6 . | F#6 - E6 - D6 - C#6 . | B5 . D6 . G6 - F#6 . | E6 - - - - - - .",
        bass: "R . R 5 R . R 5 R . R 5 R 8 5 .", bv: 0.1, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "triangle", av: 0.02, drum: "k . h . s . h k k . h . s . h h", dv: 0.34 },
    },
    paint: {
      // IL TABELLONE: una grande lavagna con le otto squadre e le linee del tabellone, che si riempiono
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); if (K.at(tx - 1, ty) === "P") return; // si disegna dalla prima tessera a sinistra
        K.later((g, cx, cy) => {
          const x = tx * TS - cx, y = ty * TS - cy - 30, b = bracket(K);
          g.fillStyle = "#5a3a22"; g.fillRect(x + 4, y + 40, 4, 22); g.fillRect(x + 84, y + 40, 4, 22);
          g.fillStyle = "#1e3a2a"; g.fillRect(x, y, 92, 46); g.strokeStyle = "#c8a060"; g.lineWidth = 3; g.strokeRect(x, y, 92, 46);
          g.font = "bold 5px sans-serif"; g.fillStyle = "#f4ecdc";
          b.quarti.forEach((m, i) => { const yy = y + 7 + i * 10; [m[0], m[1]].forEach((n, j) => { g.fillStyle = m[2] && m[2] === n ? "#ffd23f" : m[2] ? "rgba(244,236,220,.4)" : "#f4ecdc"; g.fillText(n.split(" ").pop().slice(0, 8), x + 3, yy + j * 4.5); }); g.strokeStyle = "rgba(244,236,220,.5)"; g.lineWidth = 0.6; g.beginPath(); g.moveTo(x + 32, yy - 1); g.lineTo(x + 38, yy + 1); g.lineTo(x + 32, yy + 4); g.stroke(); });
          b.semi.forEach((m, i) => { g.fillStyle = m[2] ? "#ffd23f" : "rgba(244,236,220,.7)"; g.fillText((m[2] || "?").split(" ").pop().slice(0, 8), x + 40, y + 14 + i * 20); });
          g.fillStyle = b.finale[2] ? "#ffd23f" : "rgba(244,236,220,.7)"; g.fillText("FINALE", x + 70, y + 20); g.fillText((b.finale[2] || "?").split(" ").pop().slice(0, 8), x + 66, y + 28);
          g.fillStyle = "#e83a3a"; g.fillRect(x + 22, y - 8, 48, 9); g.fillStyle = "#fff"; g.font = "bold 5px sans-serif"; g.fillText("CENTO SCUOLE", x + 28, y - 2);
          if (Math.floor(fr / 30) % 2) K.light(x + 46, y + 22, 40, "255,230,150", 0.12);
        });
      },
      // il forno a legna della panetteria (rosso quando è acceso)
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; K.P(sx + 1, sy + 2, 14, 13, "#b8865a"); g.fillStyle = "#8a5a3a"; g.beginPath(); g.arc(sx + 8, sy + 8, 5, Math.PI, 0); g.fill(); K.P(sx + 3, sy + 8, 10, 5, "#2a1a10"); K.P(sx + 4, sy + 10, 8, 2, Math.floor(fr / 8 + tx) % 2 ? "#ff8a3a" : "#e85a2a"); K.light(sx + 8, sy + 10, 16, "255,140,60", 0.45); },
      // la cassetta delle lettere, rossa
      C(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx + 6, sy + 8, 4, 8, "#3a3a3a"); K.P(sx + 3, sy + 1, 10, 9, "#c8302a"); K.P(sx + 4, sy + 4, 8, 1.5, "#1a1a1a"); K.P(sx + 3, sy + 1, 10, 1.5, "#e85a4a"); },
      // un ombrellone a strisce
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy + 14, sw = Math.sin(fr / 60 + tx) * 0.05; g.fillStyle = "#6a5a4a"; g.fillRect(x - 0.8, y - 22, 1.6, 22); g.save(); g.translate(x, y - 22); g.rotate(sw); ["#e83a3a", "#f4ecdc", "#e83a3a", "#f4ecdc", "#e83a3a"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.moveTo(0, -3); g.arc(0, -3, 14, Math.PI + i * Math.PI / 5, Math.PI + (i + 1) * Math.PI / 5); g.closePath(); g.fill(); }); g.restore(); }); },
      // la torretta dei bagnini
      J(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx, y = ty * TS - cy; g.fillStyle = "#f4ecdc"; g.fillRect(x + 2, y - 14, 3, 30); g.fillRect(x + 11, y - 14, 3, 30); g.fillRect(x + 2, y - 2, 12, 2); g.fillStyle = "#e83a3a"; g.fillRect(x, y - 20, 16, 8); g.fillStyle = "#fff"; g.font = "bold 4px sans-serif"; g.fillText("BAGNINI", x + 0.5, y - 14.5); }); },
      // una bancarella del mercato (pane, frutta, sciarpe della squadra)
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx + 1, sy + 6, 14, 9, "#a8784a"); K.P(sx, sy + 1, 16, 5, tx % 2 ? "#e83a3a" : "#3a8ac8"); for (let i = 0; i < 3; i++) K.P(sx + 3 + i * 4, sy + 7, 3, 3, ["#e8c84a", "#e85a3a", "#7ac84a"][(i + tx) % 3]); },
    },
    guest: { id: "ts_iole", lines: [["ts_iole", "{n}! Ho preso il pullman per il Borgo Marino. Il pullman giusto, stavolta. Che bel campetto avete: mi viene voglia di fischiare."], ["ts_iole", "Se la Via Lunga ti manca, ricordati: tre passaggi senza guardare, e il terzo tira. Vale anche qui."]] },
    cameos: [
      { id: "so_blop", zone: "ts_piazza", at: [20, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.spazio") || {}).done?.[1], lines: [
        ["so_blop", "Blop! {n}! Sono sceso con la navetta della domenica per il torneo! Ho portato la zuppa. È scappata in piazza. Se la vedi, è arancione e molto veloce."],
        ["so_blop", "Qui il pallone cade sempre per terra. È stranissimo. Ogni volta che cade, applaudo."]] },
      { id: "dc_nina", zone: "ts_spiaggia", at: [8, 6], when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1], lines: [
        ["dc_nina", "{n}! Sono qui per il giornale: il Torneo delle Cento Scuole fa notizia in tutta la Riviera. La squadra senza scuola contro l'Accademia. Che titolo, eh?"],
        ["dc_nina", "Un consiglio da cronista: non guardare i favoriti. Guarda chi si diverte. Di solito vince chi si diverte. O almeno, è più bello da raccontare."]] },
    ],
  });
  const K = E.K;
  K.bracket = () => bracket(K); K.bracketHtml = () => bracketHtml(K); K.TEAMS = TEAMS;
  // le tecniche imparate (servono alla partita Vignette)
  K.techs = () => ["tiro3", "muro", "ombra"].filter((k) => K.F.is("ts_tec_" + k));
  window.__torneo = E.api;
})();
