// js/dopo.js - DOPO IL CAMPIONE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga seria e malinconica, ispirata a Frieren, Vinland Saga e Violet Evergarden. Tutto inventato.
// Bruno Arcieri, «il Capitano», la leggenda di Valdorsa, è morto a novantaquattro anni. Ada Lunetta, la sua portiera del 1928,
// non invecchia: ha ancora vent'anni, da sempre. Al funerale si accorge di non averlo mai conosciuto davvero, e decide di
// ripercorrere i luoghi delle loro vittorie, con il Campione e due ragazzi della nuova squadra di Valdorsa.
// Novità di questa saga (oltre a quelle del motore comune):
//  - CON GLI OCCHI DI ADA: in certi luoghi si passa dal presente al passato (motore comune: epoche delle zone). Stessa mappa,
//    altro tempo: le persone che non ci sono più, i campi com'erano, la grafica dell'epoca (bianco e nero, anni '70, 8 bit).
//  - GLI ECHI: punti luminosi dove un ricordo è rimasto impigliato. Toccandoli, Ada ricorda (e il Quaderno si riempie).
//  - EPOCHE (js/epoche.js): ogni partita leggendaria si rigioca con la grafica e le regole della sua epoca.
// Salvataggio proprio: ali-di-rondine.dopo. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__dopo || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    id: "dopo", key: "ali-di-rondine.dopo", title: "Dopo il Campione", icon: "🕰️", bg: "ep_valdorsa", chapters: 3,
    menuSub: "Ada, i ricordi del Capitano e le partite di tre epoche",
    theme: { accent: "#e8b86a", ink: "#f4ecdc", paper: "rgba(34,26,20,.86)", font: "Georgia, serif", chipBg: "#3a2a20ee", chipBorder: "#e8b86a" },
    stats: { ada: [-9, 9, 0, "Fiducia di Ada"], squadra: [0, 99, 0, "Legame con la nuova squadra"] },
    travel: true,
    item: ["Foglia d'oro", "Foglie"],
    regions: {
      valdorsa: { grass: ["#8a9a52", "#94a258", "#82924c"], path: ["#b89a6a", "#ae9060"], stone: ["#a89a88", "#9c8e7c"], wall: ["#b8946a", "#ac885e"], water: ["#4a7a9a", "#5484a4"], tall: "#8a8a42", tree: ["#a8521e", "#c8742a", "#e8a03a"], column: "#c8b8a0", tint: "255,200,140", tintA: 0.1, fx: "leaves", dark: 0.08 },
      campo: { grass: ["#7a8a48", "#84924e", "#728244"], path: ["#9a7a52", "#90704a"], stone: ["#8a8478", "#7e786c"], wall: ["#6a5a44", "#5e4e3a"], water: ["#4a6a7a", "#547484"], tall: "#7a8a3a", tree: ["#8a3a1a", "#b0582a", "#d88a3a"], tint: "255,190,130", tintA: 0.12, fx: "leaves", dark: 0.1 },
      terra: { grass: ["#9a8a62", "#a49468", "#90805a"], path: ["#8a7048", "#806640"], stone: ["#8a8478", "#7e786c"], wall: ["#6a5a44", "#5e4e3a"], water: ["#4a6a7a", "#547484"], tall: "#8a8a52", tree: ["#4a5a2a", "#5a6a32", "#6a7a3a"], tint: "255,240,210", tintA: 0.05, fx: "dust", dark: 0.05 },
      riva: { grass: ["#d8c088", "#e0c890", "#d0b880"], path: ["#c8b08a", "#beA682"], stone: ["#e8dcc8", "#dcd0bc"], wall: ["#e8a87a", "#dc9c6e"], water: ["#3a9ac8", "#44a4d2"], tall: "#8aaa52", tree: ["#2f6a3a", "#3f8448", "#5aa04e"], tint: "255,200,120", tintA: 0.12, fx: "", dark: 0.04 },
      sala: { grass: ["#2a2440", "#30284a", "#26203a"], path: ["#3a3458", "#342e50"], stone: ["#4a4468", "#443e60"], wall: ["#3a2a5a", "#302250"], water: ["#2a4a8a", "#305494"], tall: "#4a6a3a", tint: "180,120,255", tintA: 0.12, fx: "", dark: 0.25 },
      inverno: { grass: ["#e8ecf0", "#dfe4ea", "#f0f2f4"], path: ["#a8a098", "#9e968e"], stone: ["#b8b4ac", "#aca8a0"], wall: ["#b8946a", "#ac885e"], water: ["#6a8aa8", "#7494b2"], tall: "#8a9a7a", tree: ["#4a5a4a", "#e8ecf0", "#ffffff"], tint: "200,220,255", tintA: 0.1, fx: "snow", dark: 0.14 },
      casa: { grass: ["#8a6a4a", "#846444", "#8e6e4e"], path: ["#9a7a5a", "#927252"], stone: ["#a89a88", "#9c8e7c"], wall: ["#c8a87a", "#bc9c6e"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,210,150", tintA: 0.12, fx: "dust", dark: 0.18 },
    },
    floors: "", solid: "OA",
    rest: { ch: "s", label: "Siediti alla stufa", text: "Ti siedi vicino alla stufa. Ada si siede accanto a te, ma lascia sempre un po' di spazio: per abitudine, dice, da cento anni. (Il gioco salva da solo: qui puoi rileggere il Quaderno.)" },
    texts: { chestOpen: "Apri la scatola.", chestEmpty: "La scatola è vuota. Restano l'odore di naftalina e una foglia secca.", nothing: "Niente. Ma qui, una volta, c'era qualcosa.", noHero: "Valdorsa ha bisogno di un nuovo capitano. Prima crea il tuo Campione.", chapters: "Tre luoghi, tre epoche, un Capitano. Le scelte restano: cambiano il finale." },
    journal: { name: "Il Quaderno dei Ricordi", sub: "Persone, echi del passato, le partite del Capitano, finali" },
    endings: {
      ricordo: ["IL VIAGGIO CONTINUA", "Ada riparte, da sola, con i ricordi del Capitano in tasca. Stavolta li porta con sé, invece di lasciarli indietro.", "Sempre possibile, alla fine."],
      squadra: ["LA NUOVA SQUADRA", "Ada resta a Valdorsa ad allenare i portieri della nuova squadra. Nino e Lia la chiamano «nonna», e lei finge di arrabbiarsi.", "Serve un legame forte con Nino e Lia."],
      addio: ["IL TEMPO RIPRENDE", "Ada decide di lasciare che il tempo, finalmente, la raggiunga. Da domani invecchierà, come tutti. Sorride.", "Serve la piena fiducia di Ada e tutti i ricordi del Capitano."],
      lettera: ["L'ULTIMO PASSAGGIO", "Il messaggio del Capitano, nascosto per trent'anni: «Ti ho sempre passato la palla per prima. Anche quando non serviva.»", "Segreto: tutti gli echi di tutte le epoche e la fiducia piena di Ada."],
    },
    heroLook: (h, K) => ({ bg: ["#3a2a20", "#e8b86a"], shirt: K.F.is("ep_fascia") ? "#7a2a2a" : h.shirt }),
    heroTitle: (K) => (K.F.is("ep_fascia") ? "capitano di Valdorsa" : "compagno di viaggio"),
    act: { e: "Tocca l'eco", O: "Guarda la quercia" },
    musicMain: "dopo",
    music: {
      // un tema lento, da carillon e violoncello, che torna uguale in ogni epoca (cambia solo come suona)
      dopo: { bpm: 72, spb: 12, chords: ["C", "Am", "F", "G", "Em", "Am", "F", "G"], lres: 2, lw: "triangle", lv: 0.075,
        lead: "E5 - - G5 - - | A5 - - - C6 - | A5 - G5 - F5 - | G5 - - - - - | B4 - - E5 - - | A5 - - - G5 - | F5 - E5 - D5 - | G5 - - - - -",
        bass: "R . . . . . 5 . . . . .", bv: 0.1, arp: "1 3 5 8 5 3 1 3 5 8 5 3", aw: "sine", av: 0.026, drum: ". . . . . . . . . . . .", dv: 0 },
      dopo_1928: { bpm: 112, chords: ["C", "G", "C", "G", "F", "C", "G", "C"], lres: 2, lw: "square", lv: 0.035,
        lead: "E5 . G5 . C6 - - . | D5 . G5 . B5 - - . | E5 . G5 . C6 . E6 . | D6 - B5 - G5 - - . | A5 . A5 . F5 - A5 . | G5 . E5 . C5 - - . | D5 - G5 - B5 - D6 - | C6 - - - - - - .",
        bass: "R . 5 . R . 5 . R . 5 . R . 5 .", bv: 0.1, arp: "", aw: "triangle", av: 0, drum: ". . . . . . . . . . . . . . . .", dv: 0 },
    },
    musicBg: { ep_1928: "dopo_1928" },
    paint: {
      // un cabinato da sala giochi: spento e impolverato oggi, acceso e lampeggiante nel 1989
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const on = K.ZX.eraName === "1989", star = K.at(tx, ty) === "A" && tx === 10 && ty === 2;
        K.P(sx + 1, sy - 6, 14, 21, on ? "#2a2a5a" : "#3a3a44"); K.P(sx + 1, sy - 6, 14, 3, star ? "#e83a8a" : on ? "#3a6ae8" : "#4a4a52");
        K.P(sx + 3, sy - 2, 10, 8, on ? "#0a0a1a" : "#1a1a1e");
        if (on) { const g = K.g; for (let i = 0; i < 4; i++) K.P(sx + 4 + ((fr / 6 + i * 3 + tx) % 8), sy + ((i * 3 + tx) % 6) - 1, 1.5, 1.5, ["#7af0ff", "#e83a8a", "#ffe84a", "#3ae86a"][i]); K.light(sx + 8, sy + 2, 18, star ? "232,58,138" : "122,240,255", 0.35); }
        else K.P(sx + 4, sy - 1, 3, 1, "rgba(255,255,255,.15)");
        K.P(sx + 3, sy + 8, 10, 3, "#1a1a1a"); K.P(sx + 5, sy + 8, 2, 2, on ? "#e83a3a" : "#5a3a3a"); K.P(sx + 9, sy + 8, 2, 2, on ? "#3ae86a" : "#3a5a3a");
      },
      // un eco: un ricordo rimasto impigliato nell'aria, che luccica e respira
      e(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); if (K.F.is(`eco_${K.ZX.id}_${tx}_${ty}`)) return; const g = K.g, a = 0.5 + 0.4 * Math.sin(fr / 14 + tx);
        g.save(); g.globalCompositeOperation = "lighter"; K.glow(g, sx + 8, sy + 6, 14, "255,230,170", a * 0.6); g.restore();
        for (let i = 0; i < 5; i++) { const t = fr / 20 + i * 1.26; K.P(sx + 8 + Math.cos(t) * 5, sy + 6 + Math.sin(t) * 3 - (fr / 6 + i * 4) % 8, 1.5, 1.5, `rgba(255,240,200,${a})`); }
      },
      // la grande quercia del campo (con le foglie d'autunno, disegnata sopra le tessere)
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => {
          const x = tx * TS - cx + 8, y = ty * TS - cy + 16, sw = Math.sin(fr / 80) * 1.2, era = K.ZX.eraName, C = era === "1928" ? ["#3a4a24", "#4a5a2c", "#5a6a34"] : ["#8a3a1a", "#b0582a", "#d88a3a"];
          g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(x, y, 30, 8, 0, 0, 7); g.fill();
          g.fillStyle = "#5a3e26"; g.beginPath(); g.moveTo(x - 9, y); g.quadraticCurveTo(x - 5, y - 22, x - 3, y - 36); g.lineTo(x + 3, y - 36); g.quadraticCurveTo(x + 5, y - 22, x + 9, y); g.closePath(); g.fill();
          if (!era) { g.fillStyle = "#e8d8b0"; g.fillRect(x - 4, y - 22, 8, 5); g.fillStyle = "#5a3e26"; g.font = "bold 4px serif"; g.fillText("A.", x - 2, y - 18); } // l'incisione
          [[0, -56, 28], [-20, -46, 18], [20, -46, 18], [-10, -66, 16], [12, -66, 16]].forEach(([dx, dy, r], i) => { g.fillStyle = C[i % 3]; g.beginPath(); g.arc(x + dx + sw, y + dy, r, 0, 7); g.fill(); });
          if (!era) for (let i = 0; i < 4; i++) { const t = (fr / 3 + i * 40) % 90; g.fillStyle = C[i % 3]; g.fillRect(x - 20 + i * 12 + Math.sin(t / 10) * 6, y - 50 + t, 2.5, 1.5); }
        });
      },
    },
    drawItem(g, x, y, i, f) { // una foglia d'oro che gira su se stessa
      const s = Math.cos(f / 15 + i); g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y + 5, 3, 1, 0, 0, 7); g.fill();
      g.save(); g.translate(x, y - 2 + Math.sin(f / 20 + i) * 1.5); g.scale(s, 1); g.fillStyle = "#e8b83a"; g.beginPath(); g.ellipse(0, 0, 4, 2.4, 0.5, 0, 7); g.fill(); g.strokeStyle = "#a8781a"; g.lineWidth = 0.6; g.beginPath(); g.moveTo(-3, 2); g.lineTo(3, -2); g.stroke(); g.restore();
    },
  });
  const K = E.K;
  // gli echi: si toccano una volta, Ada ricorda, e la pagina finisce nel Quaderno
  K.echo = (o, lines, lore) => {
    const k = `eco_${o.zid}_${o.tx}_${o.ty}`;
    if (K.F.is(k)) return K.say([["voce", "Qui l'eco si è sciolto. Resta solo l'aria, un po' più calda."]]);
    K.F.set(k, true); K.F.add("echi", 1); K.SFX.ding(); if (lore) K.learnLore(lore, true);
    K.say(lines);
  };
  K.echoes = (zid) => Object.keys(K.mem().flags).filter((k) => k.startsWith("eco_" + zid + "_")).length;
  window.__dopo = E.api;
})();
