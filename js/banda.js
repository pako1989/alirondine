// js/banda.js - «BANDA DI PIAZZA» · configurazione della saga sul motore comune (js/saga-core.js). Ispirata a Whiplash, Coco, School of Rock e Rhythm Heaven.
// La banda che suona allo stadio di Borgo Marino sta per essere sciolta e sostituita da un altoparlante. Il Campione, infortunato al ginocchio, finisce alla grancassa.
// Un maestro geniale e crudele, un trombettista che non suona più dal funerale del figlio, un concorso nazionale a Venezia e una vecchia marcia che nessuno sa finire.
// Tono: ironico di base (prove disastrose, ottoni stonati, sfilate sotto la pioggia), con episodi seri (il lutto di Zio Ciro, il prezzo di un maestro che spinge troppo).
// Dal core: Peso morale (cfg.weight: Disciplina e Cuore), Rapporti (cfg.bonds), Inventario (cfg.inv, gli oggetti con bonus «te» allargano le finestre di tempo),
// Orologio (cfg.clock), gruppo che segue (party: la banda cammina dietro di te), interni a mano. Novità del core portata da questa saga: IL REPERTORIO (cfg.rhythm).
// Minigioco proprio: «Ritmo» (js/ritmo.js): concerto, sfilata col passo, duello contro l'altoparlante.
// Tessere proprie: M leggio · E tamburi · P cassa armonica · F fontana · K bancone · A altoparlante · X lapide · I cipresso · G gondola · V palo da gondola · O tavolino da caffè
//   pavimenti Q selciato · Y parquet · Z pietra d'Istria · U prato del colle
(function () {
  "use strict";
  if (window.__banda || !window.__sagaCore || !window.__hd) return;
  const HD = window.__hd, FX = HD.F;
  const E = window.__sagaCore.create({
    id: "banda", key: "ali-di-rondine.banda", title: "Banda di Piazza", icon: "🥁", bg: "bp_titolo", chapters: 5, travel: true,
    menuSub: "La banda dello stadio sta per essere sostituita da un altoparlante. Tu, col ginocchio fasciato, finisci alla grancassa. Un maestro crudele, una tromba muta, Venezia e una marcia senza finale.",
    theme: { accent: "#facc15", ink: "#1c1208", paper: "rgba(255,249,235,.97)", font: "'Trebuchet MS', Georgia, serif", chipBg: "#fde68a", chipBorder: "#b45309" },
    stats: { rigore: [0, 12, 0, "Disciplina"], cuore: [0, 12, 0, "Cuore"], fogli: [0, 4, 0, "Fogli della Marcia"] },
    weight: { name: "La bacchetta", axes: { rigore: ["Disciplina", "🎼"], cuore: ["Cuore", "❤️"] } },
    item: ["Nota d'oro", "Note d'oro"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 11 + i) * 1.5); g.fillStyle = "#facc15"; g.beginPath(); g.ellipse(-1.5, 2, 3, 2.2, -0.4, 0, 7); g.fill();
      g.fillRect(1, -6, 1.4, 8); g.beginPath(); g.moveTo(2.4, -6); g.quadraticCurveTo(6, -4, 4.5, -1); g.lineTo(2.4, -3); g.fill();
      g.globalAlpha = 0.35 + 0.25 * Math.sin(f / 8 + i); g.fillStyle = "#fef08a"; g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill(); g.restore();
    },
    regions: {
      piazza: { grass: ["#5f8a4a", "#58824a", "#679350"], path: ["#c9b48a", "#bfa97e"], stone: ["#a8a29e", "#9c968f"], wall: ["#d6c3a0", "#cbb894"], water: ["#2f7fb5", "#2b75a8"], tall: "#55803f", tree: ["#2f5a2a", "#3a6a34", "#46783e"], tint: "255,190,110", tintA: 0.1, fx: "", dark: 0.06 },
      sala: { grass: ["#6b4423", "#633f20", "#734a27"], path: ["#8a5a30", "#80532c"], stone: ["#78716c", "#6f6863"], wall: ["#5b3a22", "#4e321d"], water: ["#1e3a5f", "#1b3456"], tall: "#633f20", tint: "255,200,120", tintA: 0.12, fx: "dust", dark: 0.14 },
      trattoria: { grass: ["#7c4a2a", "#734426", "#86502e"], path: ["#a16b3d", "#966337"], stone: ["#9a8a7a", "#8e7e6e"], wall: ["#e8d5b0", "#dcc9a4"], water: ["#1e3a5f", "#1b3456"], tall: "#734426", tint: "255,170,90", tintA: 0.14, fx: "", dark: 0.1 },
      corso: { grass: ["#3f5a3a", "#3a5335", "#466340"], path: ["#57534e", "#4f4b46"], stone: ["#6b7280", "#626875"], wall: ["#9ca3af", "#8f96a2"], water: ["#1e40af", "#1d3c9f"], tall: "#3a5335", tree: ["#1f3a24", "#284a2e", "#305536"], tint: "150,180,230", tintA: 0.12, fx: "rain", dark: 0.18 },
      casa: { grass: ["#6b5a48", "#635342", "#73614e"], path: ["#8a7458", "#806b51"], stone: ["#78716c", "#6f6863"], wall: ["#c8b89a", "#bcac8e"], water: ["#1e3a5f", "#1b3456"], tall: "#635342", tint: "255,190,120", tintA: 0.1, fx: "dust", dark: 0.18 },
      stadio: { grass: ["#2f7a3a", "#2a7035", "#348541"], path: ["#9ca3af", "#8f96a2"], stone: ["#64748b", "#5a687d"], wall: ["#334155", "#2c384a"], water: ["#1e40af", "#1d3c9f"], tall: "#2a7035", tree: ["#1f4a2a", "#285a32", "#30683a"], tint: "200,220,255", tintA: 0.08, fx: "", dark: 0.14 },
      colle: { grass: ["#7a8a4a", "#728245", "#829350"], path: ["#b5a07a", "#ab9670"], stone: ["#a8a29e", "#9c968f"], wall: ["#cbbf9f", "#bfb393"], water: ["#3b82c4", "#3579ba"], tall: "#6a7a3a", tree: ["#1f3a24", "#284a2e", "#305536"], tint: "255,150,80", tintA: 0.14, fx: "leaves", dark: 0.08 },
      archivio: { grass: ["#4a3a2a", "#433426", "#52402e"], path: ["#6b5638", "#634f33"], stone: ["#57534e", "#4f4b46"], wall: ["#3b2f22", "#33291d"], water: ["#1e3a5f", "#1b3456"], tall: "#433426", tint: "255,210,140", tintA: 0.14, fx: "dust", dark: 0.24 },
      venezia: { grass: ["#7a8a6a", "#728262", "#829272"], path: ["#d8cbb0", "#cfc1a5"], stone: ["#e7e2d8", "#dcd6ca"], wall: ["#c2693b", "#b56035"], water: ["#2f7f8f", "#2b7584"], tall: "#6a7a5a", tree: ["#2f5a3a", "#3a6a44", "#46784e"], tint: "255,200,150", tintA: 0.1, fx: "", dark: 0.04 },
      teatro: { grass: ["#7f1d1d", "#761b1b", "#882020"], path: ["#991b1b", "#8c1919"], stone: ["#a16207", "#955a06"], wall: ["#4c1d1d", "#431a1a"], water: ["#1e3a5f", "#1b3456"], tall: "#761b1b", tint: "255,200,120", tintA: 0.16, fx: "", dark: 0.2 }
    },
    floors: "QYZU", solid: "MEPFKAXIGVOC",
    floorPaint(K, f, sx, sy, tx, ty, fr) {
      const g = K.g;
      if (f === "Q") { FX.cobble(g, sx, sy, tx, ty, fr, K, ["#b8aa94", "#a89a84"]); if ((tx * 7 + ty * 3) % 11 === 0) { g.fillStyle = "rgba(120,90,60,.18)"; g.fillRect(sx + 3, sy + 9, 5, 2); } return true; }
      if (f === "Y") { FX.planks(g, sx, sy, tx, ty, fr, K, ["#8a5a30", "#7c5029"]); return true; }
      if (f === "Z") { FX.marble(g, sx, sy, tx, ty, fr, K, ["#ece7dc", "#ddd6c8", "#c2693b"]); return true; }
      if (f === "U") { FX.grass(g, sx, sy, tx, ty, fr, K, ["#7a8a4a", "#86964f"]); if ((tx + ty * 5) % 9 === 0) { g.fillStyle = "#fde68a"; g.fillRect(sx + 6, sy + 6, 2, 2); g.fillStyle = "#f472b6"; g.fillRect(sx + 11, sy + 3, 2, 2); } return true; }
      return false;
    },
    paint: {
      // leggio con lo spartito aperto
      M(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 5, 1.6, 0, 0, 7); g.fill();
        g.fillStyle = "#1f2937"; g.fillRect(sx + 7, sy + 7, 2, 7); g.fillRect(sx + 4, sy + 13, 8, 1);
        g.fillStyle = "#111827"; g.beginPath(); g.moveTo(sx + 2, sy + 2); g.lineTo(sx + 14, sy + 2); g.lineTo(sx + 13, sy + 8); g.lineTo(sx + 3, sy + 8); g.fill();
        g.fillStyle = "#f8fafc"; g.fillRect(sx + 3, sy + 3, 10, 4); g.fillStyle = "#475569"; for (let i = 0; i < 3; i++) g.fillRect(sx + 4, sy + 4 + i, 8, 0.5);
        g.fillStyle = "#0f172a"; g.fillRect(sx + 5 + ((tx * 3) % 5), sy + 3.6, 1, 1); g.fillRect(sx + 9, sy + 4.6, 1, 1);
      },
      // tamburi: grancassa con lo stemma della rondine e un rullante sopra
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 7, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#b91c1c"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7, 5.5, 0, 0, 7); g.fill(); g.fillStyle = "#f1f5f9"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 5, 4, 0, 0, 7); g.fill();
        g.fillStyle = "#1e3a8a"; g.beginPath(); g.moveTo(sx + 5, sy + 9); g.lineTo(sx + 8, sy + 7); g.lineTo(sx + 11, sy + 9); g.lineTo(sx + 8, sy + 10); g.fill();
        g.strokeStyle = "#facc15"; g.lineWidth = 0.8; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7, 5.5, 0, 0, 7); g.stroke();
        g.fillStyle = "#94a3b8"; g.fillRect(sx + 4, sy + 1, 8, 3); g.fillStyle = "#e2e8f0"; g.fillRect(sx + 4, sy + 1, 8, 1);
      },
      // cassa armonica: pedana di legno con ringhiera in ferro battuto (il tetto si disegna sopra, nel decor della zona)
      P(K, sx, sy, tx, ty, fr) {
        const g = K.g; FX.planks(g, sx, sy, tx, ty, fr, K, ["#9a6b3d", "#8d6236"]);
        g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(sx, sy + 13, 16, 3);
        g.fillStyle = "#1f2937"; g.fillRect(sx, sy + 4, 16, 1); for (let i = 1; i < 16; i += 3) g.fillRect(sx + i, sy + 4, 1, 6); g.fillRect(sx, sy + 9, 16, 1);
        g.strokeStyle = "rgba(31,41,55,.8)"; g.lineWidth = 0.6; g.beginPath(); for (let i = 0; i < 16; i += 6) { g.arc(sx + i + 3, sy + 7, 1.6, 0, 7); } g.stroke();
      },
      // fontana: vasca in pietra con l'acqua che si muove
      F(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#a8a29e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#78716c"; g.fillRect(sx, sy + 14, 16, 2);
        g.fillStyle = "#2f7fb5"; g.fillRect(sx + 2, sy + 2, 12, 11); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + 2 + ((fr / 4 + tx * 5) % 10), sy + 4 + (ty % 2) * 4, 3, 1); g.fillRect(sx + 4 + ((fr / 6 + 3) % 8), sy + 9, 4, 1);
        g.fillStyle = "rgba(255,255,255,.2)"; g.fillRect(sx, sy, 16, 1);
      },
      // bancone della trattoria con la pentola del ragù
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5b3a22"; g.fillRect(sx, sy + 5, 16, 11); g.fillStyle = "#7c4a2a"; g.fillRect(sx, sy + 4, 16, 3); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx, sy + 4, 16, 1);
        if (tx % 2) { g.fillStyle = "#334155"; g.fillRect(sx + 4, sy, 8, 5); g.fillStyle = "#64748b"; g.fillRect(sx + 3, sy, 10, 1); for (let i = 0; i < 2; i++) { g.fillStyle = `rgba(241,245,249,${0.3 - i * 0.1})`; g.fillRect(sx + 6 + Math.sin(fr / 12 + i) * 2, sy - 4 - i * 3 - ((fr / 5) % 3), 2, 2); } }
        else { g.fillStyle = "#e2e8f0"; g.fillRect(sx + 3, sy + 1, 3, 3); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 9, sy, 3, 4); }
      },
      // altoparlante SuonoSmart: torre di casse nere con il led blu
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 15, 3);
        g.fillStyle = "#0f172a"; g.fillRect(sx + 2, sy, 12, 15); g.fillStyle = "#1e293b"; g.beginPath(); g.arc(sx + 8, sy + 10, 4, 0, 7); g.fill(); g.beginPath(); g.arc(sx + 8, sy + 3.5, 2.4, 0, 7); g.fill();
        const p = 0.5 + 0.5 * Math.sin(fr / 6 + tx); g.fillStyle = `rgba(56,189,248,${0.5 + 0.4 * p})`; g.fillRect(sx + 3, sy + 1, 2, 1); g.fillStyle = "#334155"; g.beginPath(); g.arc(sx + 8, sy + 10, 1.4 + p, 0, 7); g.fill();
        K.light(sx + 8, sy + 4, 18, "56,189,248", 0.18);
      },
      // lapide con il nome e un vaso di fiori
      X(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 3, sy + 13, 11, 3);
        g.fillStyle = "#d6d3d1"; g.beginPath(); g.moveTo(sx + 4, sy + 14); g.lineTo(sx + 4, sy + 5); g.quadraticCurveTo(sx + 8, sy + 1, sx + 12, sy + 5); g.lineTo(sx + 12, sy + 14); g.fill();
        g.fillStyle = "#a8a29e"; g.fillRect(sx + 6, sy + 7, 4, 1); g.fillRect(sx + 6, sy + 9, 4, 1); g.fillStyle = ["#f43f5e", "#facc15", "#a78bfa"][(tx + ty) % 3]; g.fillRect(sx + 1, sy + 11, 2, 2); g.fillRect(sx + 13, sy + 11, 2, 2);
      },
      // cipresso alto
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 4, 1.5, 0, 0, 7); g.fill();
        g.fillStyle = "#14532d"; g.beginPath(); g.moveTo(sx + 8, sy - 10 + Math.sin(fr / 40 + tx) * 0.6); g.quadraticCurveTo(sx + 14, sy + 4, sx + 9, sy + 14); g.lineTo(sx + 7, sy + 14); g.quadraticCurveTo(sx + 2, sy + 4, sx + 8, sy - 10); g.fill();
        g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(sx + 6, sy - 4, 1, 14);
      },
      // gondola ormeggiata (sull'acqua)
      G(K, sx, sy, tx, ty, fr) {
        const g = K.g, R = K.ZX.rg; g.fillStyle = (R.water || ["#2f7f8f"])[0]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(sx + ((fr / 5 + tx * 4) % 14), sy + 12, 3, 1);
        const b = Math.sin(fr / 20 + tx) * 0.8; g.fillStyle = "#0f0f10"; g.beginPath(); g.moveTo(sx - 1, sy + 7 + b); g.quadraticCurveTo(sx + 8, sy + 12 + b, sx + 17, sy + 6 + b); g.lineTo(sx + 16, sy + 9 + b); g.quadraticCurveTo(sx + 8, sy + 14 + b, sx, sy + 9 + b); g.fill();
        if (tx % 2) { g.fillStyle = "#e5e7eb"; g.fillRect(sx + 13, sy + 2 + b, 2, 5); } else { g.fillStyle = "#7f1d1d"; g.fillRect(sx + 6, sy + 7 + b, 4, 3); }
      },
      // palo da gondola a righe
      V(K, sx, sy, tx, ty, fr) {
        const g = K.g, R = K.ZX.rg; g.fillStyle = (R.water || ["#2f7f8f"])[1]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.22)"; g.fillRect(sx + ((fr / 6 + tx * 3) % 12), sy + 13, 4, 1);
        for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? "#f8fafc" : "#1d4ed8"; g.fillRect(sx + 7, sy - 6 + i * 3.5, 3, 3.5); } g.fillStyle = "#facc15"; g.beginPath(); g.arc(sx + 8.5, sy - 7, 2, 0, 7); g.fill();
      },
      // custodia aperta della tromba, con l'ottone lucido dentro
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 1, sy + 12, 15, 3);
        g.fillStyle = "#1f2937"; g.fillRect(sx + 1, sy + 6, 14, 7); g.fillStyle = "#7f1d1d"; g.fillRect(sx + 2, sy + 7, 12, 5); g.fillStyle = "#111827"; g.fillRect(sx + 1, sy + 1, 14, 5);
        g.fillStyle = "#facc15"; g.fillRect(sx + 3, sy + 9, 8, 1.4); g.beginPath(); g.moveTo(sx + 11, sy + 7.5); g.lineTo(sx + 14, sy + 6.5); g.lineTo(sx + 14, sy + 12.5); g.lineTo(sx + 11, sy + 11); g.fill(); g.fillRect(sx + 6, sy + 8, 1, 3); g.fillRect(sx + 8, sy + 8, 1, 3);
        g.globalAlpha = 0.35 + 0.25 * Math.sin(fr / 14); g.fillStyle = "#fef9c3"; g.fillRect(sx + 4, sy + 9, 3, 1); g.globalAlpha = 1;
      },
      // tavolino da caffè con ombrellone
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.22)"; g.beginPath(); g.ellipse(sx + 8, sy + 13, 6, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#e5e7eb"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 5, 2, 0, 0, 7); g.fill(); g.fillStyle = "#64748b"; g.fillRect(sx + 7.5, sy + 9, 1, 4);
        g.fillStyle = (tx + ty) % 2 ? "#be123c" : "#0f766e"; g.beginPath(); g.moveTo(sx, sy + 2); g.quadraticCurveTo(sx + 8, sy - 5, sx + 16, sy + 2); g.fill(); g.fillStyle = "#f8fafc"; g.fillRect(sx + 7.5, sy - 2, 1, 11);
      }
    },
    act: { M: "Guarda il leggio", E: "Guarda i tamburi", P: "Guarda la cassa armonica", F: "Guarda la fontana", K: "Guarda il bancone", A: "Guarda l'altoparlante", X: "Leggi la lapide", I: "Guarda il cipresso", G: "Guarda la gondola", V: "Guarda il palo", O: "Guarda il tavolino", C: "Guarda la tromba", n: "Leggi la bacheca", x: "Apri la cassa", s: "Siediti un momento", q: "Entra" },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi e appoggi il ginocchio. Da qualche parte un clarinetto prova la stessa scala per la decima volta. Il gioco salva da solo; dal menu puoi rileggere il Quaderno della Banda." },
    texts: { nothing: "Niente di speciale. Solo il rumore del mare e qualcuno che fischietta stonato.", noHero: "Il maestro vuole un nome sul registro delle presenze. Crea prima il tuo Campione.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Restano solo due bacchette spaiate." },
    journal: { name: "Il Quaderno della Banda", sub: "Repertorio, rapporti, fogli della marcia e finali" },
    // IL REPERTORIO (novità del core, opt-in): i brani suonati restano qui, con stelle e precisione, e si rigiocano
    rhythm: {
      eng: "__ritmo", name: "Il Repertorio della Banda",
      songs: {
        ingresso: { n: "Marcia d'ingresso", icon: "🎺", d: "Il primo brano con il Maestro Ferrante, in sala prove", need: 0.55 },
        pioggia: { n: "San Rocco sotto la pioggia", icon: "☔", d: "Sfilata della processione: si suona e si marcia", mode: "sfilata", need: 0.58 },
        derby: { n: "Inno del Derby", icon: "📢", d: "Duello contro l'altoparlante allo stadio", mode: "duello", need: 0.6 },
        ciro: { n: "Il Silenzio di Ciro", icon: "🕯️", d: "Sul colle, al tramonto", need: 0.5 },
        venezia: { n: "Gran Concerto di Venezia", icon: "🎭", d: "Il concorso nazionale", need: 0.68 },
        rondine: { n: "La Marcia della Rondine", icon: "🐦", d: "La marcia intera, con il finale ritrovato", need: 0.7 }
      },
      mates: (K) => ["bp_rocco", "bp_lilli", "bp_abele", "bp_ciro"].filter((id) => K.F.is("bp_m_" + id)).map((id) => ({ id, n: { bp_rocco: "Rocco", bp_lilli: "Lilli", bp_abele: "Don Abele", bp_ciro: "Zio Ciro" }[id] }))
    },
    bonds: {
      per: 4, talk: 2, max: 5, names: ["Estranei", "Conoscenti", "Compagni di leggio", "Fiati amici", "Banda", "Famiglia"],
      scenes: {
        bp_ferrante: [
          { lv: 2, id: "fer2", prize: "+1 Disciplina", lines: [["bp_ferrante", "[pensa] Sai perché arrivo sempre alle sette meno cinque? Perché alle sette esatte mio padre chiudeva la porta della sala. Avevo nove anni. Una volta ho suonato sul pianerottolo, per due ore."], ["bp_ferrante", "Non mi ha mai fatto entrare. Io sono diventato maestro. Lui è rimasto falegname. Non so ancora chi dei due abbia vinto."]], reward: (K) => K.bond("rigore", 1) },
          { lv: 4, id: "fer4", prize: "+1 Cuore", lines: [["bp_ferrante", "[triste] Al conservatorio mi chiamavano «il metronomo». Non era un complimento. Ho perso tre allievi perché li spingevo. Uno mi ha scritto, l'anno scorso. Insegna. Dice che lo fa piano."], ["bp_ferrante", "Io non so fare piano. Ma posso provare a fare un po' meno forte. Non dirlo a nessuno. Soprattutto a Lilli."]], reward: (K) => K.bond("cuore", 1) }
        ],
        bp_ciro: [
          { lv: 2, id: "cir2", prize: "+1 Cuore", lines: [["bp_ciro", "Tonino aveva la mano sinistra storta, dalla nascita. Gli dicevano che la tromba non faceva per lui. Lui la teneva al contrario. Suonava meglio di me."], ["bp_ciro", "[triste] Il giorno del funerale la banda ha suonato e io no. Avevo la tromba in mano. Non è uscito niente. Da allora non ci provo più."]], reward: (K) => K.bond("cuore", 1) },
          { lv: 4, id: "cir4", prize: "+1 Disciplina", lines: [["bp_ciro", "Ieri sera ho aperto la custodia. Non l'ho toccata, l'ho solo guardata. Poi l'ho lucidata. Tre volte. Come prima delle processioni."], ["bp_ciro", "[felice] Se un giorno suono, non applaudite. Fate finta di niente. Tonino odiava gli applausi: diceva che coprono le ultime note."]], reward: (K) => K.bond("rigore", 1) }
        ],
        bp_lilli: [
          { lv: 2, id: "lil2", prize: "+1 Cuore", lines: [["bp_lilli", "Ho cominciato col clarinetto a sei anni perché era l'unico strumento gratis della banda. Poi a quindici ho scoperto il punk e ho capito che si può suonare forte anche con un tubo di legno."], ["bp_lilli", "[ride] Il Maestro dice che il punk è rumore. Gli ho risposto che anche le sue marce lo sono, solo in divisa. Mi ha guardato tre secondi. Credo fosse un sorriso."]], reward: (K) => K.bond("cuore", 1) },
          { lv: 4, id: "lil4", prize: "+1 Disciplina", lines: [["bp_lilli", "[pensa] Ho fatto domanda al conservatorio. Di nascosto. Se mi prendono, devo lasciare la banda e andare a Milano."], ["bp_lilli", "Non dirlo a nessuno. Però, se mi prendono, sarà anche colpa di quell'idiota col bastoncino. Mi ha fatto suonare la stessa scala trecento volte. Adesso la so."]], reward: (K) => K.bond("rigore", 1) }
        ],
        bp_nana: [
          { lv: 2, id: "nan2", prize: "Un vasetto di ragù", lines: [["bp_nana", "Mio marito suonava il bombardino. Male. Ma con un entusiasmo che faceva paura. Il sabato, dopo le prove, mangiavano tutti qui. Trenta piatti."], ["bp_nana", "[felice] Tieni. Ragù della domenica. Se lo porti alle prove, nessuno stona per almeno mezz'ora."]], reward: (K) => K.inv.give("bp_ragu") },
          { lv: 4, id: "nan4", prize: "+1 Cuore", lines: [["bp_nana", "Il giorno che la banda smette di suonare allo stadio, io chiudo la trattoria la domenica. Non per protesta. Perché non saprei cosa cucinare."], ["bp_nana", "Una piazza senza banda è una cucina senza sale. Si mangia lo stesso. Ma perché?"]], reward: (K) => K.bond("cuore", 1) }
        ],
        bp_rocco: [
          { lv: 2, id: "roc2", prize: "+1 Cuore", lines: [["bp_rocco", "Quarantadue anni di bombardino. Ho suonato a matrimoni, funerali, inaugurazioni di rotonde. Una volta all'inaugurazione di un'altra rotonda, uguale, a cento metri dalla prima."], ["bp_rocco", "[ride] La gente pensa che la banda sia vecchia. È vero. Ma è l'unica cosa del paese che arriva sempre in orario."]], reward: (K) => K.bond("cuore", 1) },
          { lv: 4, id: "roc4", prize: "Bacchette di Rocco", lines: [["bp_rocco", "Queste erano le bacchette di mio padre. Suonava la grancassa, come te. Diceva che la grancassa non si suona: si mantiene la promessa del tempo."], ["bp_rocco", "Tienile. A me servono le mani per il bombardino, e la promessa ormai la mantieni tu."]], reward: (K) => K.inv.give("bp_bacchette") }
        ],
        bp_abele: [
          { lv: 2, id: "abe2", prize: "+1 Disciplina", lines: [["bp_abele", "In seminario volevano che suonassi l'organo. Io ho scelto i piatti. Il vescovo ha detto che era un segno di superbia. Io dico che è un segno di buon senso: i piatti si sentono dal fondo della chiesa."], ["bp_abele", "[ride] E poi, quando sbagli coi piatti, sembra apposta."]], reward: (K) => K.bond("rigore", 1) }
        ]
      }
    },
    inv: {
      items: {
        bp_bacchette: { n: "Bacchette di Rocco", icon: "🥢", d: "Bacchette di faggio consumate da due generazioni di grancassa. Nello zaino, il tempo sembra più largo: finestre di tempo un po' più ampie nei brani.", match: { te: 1 }, gift: { bp_rocco: 3 }, giftAny: 1, refuse: { bp_rocco: "No, no. Te le ho date io. Le bacchette non tornano indietro, come i gol." } },
        bp_metronomo: { n: "Metronomo a piramide", icon: "⏱️", d: "Un vecchio metronomo di legno con la targhetta «A. Rondi, 1950». Nello zaino ticchetta piano: finestre di tempo più ampie nei brani.", match: { te: 1 }, gift: { bp_ferrante: 8 }, giftAny: 1, react: { bp_ferrante: "[sorpreso] Il metronomo del Maestro Rondi. Lo usava anche con me, quando avevo dodici anni. Credevo fosse andato perso col resto." } },
        bp_ancia: { n: "Ancia nuova", icon: "🎋", d: "Un'ancia di canna per clarinetto, ancora nella bustina. Costa poco e vale molto, per chi ne ha rotta una.", gift: { bp_lilli: 8 }, giftAny: 1, react: { bp_lilli: "[felice] Forza tre e mezzo! Mi conosci meglio di quanto pensassi. Questa me la tengo per Venezia." } },
        bp_ragu: { n: "Vasetto di ragù di Nanà", icon: "🍲", d: "Ragù della domenica, cotto sei ore. Dicono che faccia smettere di stonare. Dicono.", gift: { bp_rocco: 5, bp_abele: 5, bp_ciro: 4 }, giftAny: 2, react: { bp_rocco: "Il ragù di Nanà! Stasera il bombardino suona in fa maggiore per gratitudine.", bp_abele: "Benedetto sia. Il ragù, intendo. Anche Nanà, ovviamente." } },
        bp_bocchino: { n: "Bocchino d'argento", icon: "🎺", d: "Il bocchino della tromba di Tonino, il figlio di Ciro. Inciso dentro: «T. — per le ultime note».", gift: { bp_ciro: 10 }, giftAny: 0, react: { bp_ciro: "[triste] Questo è di Tonino. L'avevo dato al Maestro per venderlo, dopo. Non ce l'ho fatta a venderlo e neanche a tenerlo. Grazie di averlo riportato." } },
        bp_cartolina: { n: "Cartolina da Venezia, 1972", icon: "🖼️", d: "Una cartolina di piazza San Marco. Dietro: «Primo premio! La Rondine vola. — A. R.»", gift: { bp_ferrante: 4, bp_nana: 6 }, giftAny: 1, react: { bp_nana: "Il 1972! C'era anche mio marito, in fondo a destra. Quello che stona anche in fotografia." } }
      }
    },
    clock: { slots: ["Mattina", "Pomeriggio", "Sera"], hud: true, tint: [null, "rgba(255,170,90,.07)", "rgba(30,40,110,.2)"], onSlot(K, giorno, fascia, nome) { return nome === "Sera" ? [["voce", "Sera. Dalla sala sotto la parrocchia esce una scala di clarinetto. Stonata, poi giusta."]] : null; } },
    endings: {
      trofeo: ["Il Trofeo del Maestro", "La banda di Borgo Marino vince il concorso di Venezia, esecuzione perfetta. Il Maestro Ferrante riceve un'offerta dal conservatorio e la accetta. La banda resta, la piazza è salva. Qualcuno, però, non torna alle prove.", "Vinci a Venezia con più Disciplina che Cuore."],
      borgo: ["La Banda del Borgo", "A Venezia la banda non è la più precisa, ma è l'unica che fa alzare il pubblico in piedi. Il premio della giuria popolare basta a convincere l'assessore. La domenica dopo, allo stadio, l'altoparlante resta spento.", "Vinci a Venezia con almeno tanto Cuore quanta Disciplina."],
      cassa: ["L'Altoparlante", "A Venezia qualcosa non va. Allo stadio arriva la cassa nuova, lucida, perfetta. Ma ogni domenica mattina, in piazza, alle sette meno cinque, la banda di Borgo Marino suona lo stesso. Senza permesso. Senza leggii.", "Perdi il concorso di Venezia e accetti com'è andata."],
      rondine: ["La Marcia della Rondine", "Segreto: a Venezia la banda suona la marcia del 1950 per intero, con il finale ritrovato. A metà, una tromba entra da sola, al contrario, dal fondo della sala. Nessuno applaude subito. Poi tutti insieme.", "Segreto: ritrova i quattro fogli della marcia, fai pace con Zio Ciro e con il Maestro, e suona la marcia intera a Venezia."]
    },
    heroLook: () => ({ bg: ["#7f1d1d", "#facc15"], shirt: "#7f1d1d" }),
    heroTitle: () => "grancassa della banda di Borgo Marino",
    musicMain: "banda",
    music: { banda: { bpm: 104, chords: ["C", "F", "G", "C", "Am", "F", "G", "C"], lres: 2, lw: "square", lv: 0.028,
      lead: "C5 - E5 - G5 - E5 - | F5 - A5 - G5 - - - | E5 - G5 - C6 - B5 - | A5 - G5 - - - - - | C5 - E5 - G5 - A5 - | G5 - F5 - E5 - D5 - | E5 - F5 - G5 - D5 - | C5 - - - - - - -",
      bass: "R . 5 . R . 5 . R . 5 . R . 5 .", bv: 0.11, arp: "1 3 5 3 1 3 5 3", aw: "triangle", av: 0.012, drum: "k . s . k . s . k . s . k k s .", dv: 0.1 } },
    party: (K) => ["bp_rocco", "bp_lilli", "bp_abele", "bp_ciro"].filter((id) => K.F.is("bp_m_" + id)).slice(0, 3),
    guide: () => [["🥁 Ritmo", "Nei brani tocchi lo strumento quando la nota arriva sul cerchio: grancassa, rullante, piatti e ottoni. Nelle sfilate le barre gialle sono il passo (👣). Contro l'altoparlante il pubblico va da chi suona meglio. Gli oggetti dello zaino con «tempo» allargano un po' le finestre."], ["🎼❤️ Disciplina e Cuore", "Il Maestro Ferrante chiede disciplina; la banda chiede cuore. Le scelte accumulano uno o l'altro, e il concorso finisce in modo diverso a seconda di quale pesa di più."], ["📜 I fogli della Marcia", "La Marcia della Rondine del 1950 è incompleta: mancano quattro fogli. Qualcuno li ha nascosti, qualcuno li ha dimenticati. Si cercano nel capitolo 4."]],
    cameos: [],
    guest: { id: "bp_rocco", lines: ["Rocco, bombardino della banda. Ho portato lo strumento anche qui: non si sa mai, magari c'è una rotonda da inaugurare.", "La banda suona ancora, la domenica. Se senti un fa basso dal molo, sono io. Se senti un fa stonato, sono sempre io."] },
    onReady(K) { window.__bandaH(K).people(); }
  });
  window.__bandaH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      // scelta con Peso morale: w {rigore|cuore: n}, need {asse: n}
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#3a2a1a", skin: "#e8c4a0" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(40,22,8,.88)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#facc15"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#fde68a"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); },
      // un brano del Repertorio: o.bonus dagli oggetti dello zaino (tetto 3)
      play(id, o, cb) { K.say(H.flush().concat([["voce", "Il Maestro alza la bacchetta. Quattro colpi di conteggio, poi si parte."]]), () => K.rhythm.play(id, Object.assign({ bonus: Math.min(3, K.inv.bonus("te")) }, o || {}), (r) => cb(r || {}))); },
      join: (id, txt) => { if (K.F.is("bp_m_" + id)) return; K.F.set("bp_m_" + id, true); H.say("voce", txt || "Si unisce alla banda e cammina dietro di te."); },
      stato: () => `🎼 Disciplina ${K.stat("rigore")} · ❤️ Cuore ${K.stat("cuore")} · 📜 Fogli ${K.stat("fogli")}/4`,
      // tetto ottagonale della cassa armonica sopra le tessere P (x0, y0 = angolo in alto a sinistra, n tessere per lato)
      kiosk(g, d, x0, y0, n, f) {
        const X = d.X(x0), Y = d.Y(y0), w = n * 16, cx = X + w / 2;
        g.save(); g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(X - 2, Y + 2, w + 4, 6);
        for (let i = 0; i <= n; i++) { g.fillStyle = "#e5e7eb"; g.fillRect(X + i * (w / n) - 1, Y - 18, 2, 22); }
        g.fillStyle = "#14532d"; g.beginPath(); g.moveTo(X - 6, Y - 16); g.lineTo(cx, Y - 34); g.lineTo(X + w + 6, Y - 16); g.closePath(); g.fill();
        g.fillStyle = "#166534"; g.beginPath(); g.moveTo(X - 6, Y - 16); g.lineTo(X + w + 6, Y - 16); g.lineTo(X + w + 3, Y - 12); g.lineTo(X - 3, Y - 12); g.fill();
        for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(250,204,21,${0.55 + 0.35 * Math.sin(f / 9 + i)})`; g.beginPath(); g.arc(X - 4 + i * ((w + 8) / 8), Y - 12, 1.2, 0, 7); g.fill(); }
        g.fillStyle = "#facc15"; g.beginPath(); g.arc(cx, Y - 35, 2, 0, 7); g.fill(); g.restore();
      },
      fountain(g, d, x0, y0, f) { const cx = d.X(x0) + 16, cy = d.Y(y0) + 12; g.save(); g.fillStyle = "#cbd5e1"; g.fillRect(cx - 2, cy - 14, 4, 12); for (let i = 0; i < 6; i++) { const a = (f / 6 + i * 1.1) % 6; g.fillStyle = `rgba(186,230,253,${0.7 - a * 0.1})`; g.fillRect(cx - 4 + i * 1.5, cy - 16 + a * 2, 1.2, 2); } g.fillStyle = "rgba(186,230,253,.8)"; g.beginPath(); g.arc(cx, cy - 16, 2.2, 0, 7); g.fill(); g.restore(); },
      people() {
        H.cast("bp_ferrante", "Maestro Ferrante", "Direttore della banda", { style: "slick", hair: "#e5e7eb", shirt: "#111827", skin: "#e0c0a0", eye: "#1f2937", acc: ["occhiali"], bg: ["#111827", "#facc15"] }, "Ex direttore d'orchestra al conservatorio, arrivato a Borgo Marino senza dire perché. Geniale, puntuale, spietato. Batte il tempo anche quando beve il caffè.");
        H.cast("bp_ciro", "Zio Ciro", "Prima tromba (a riposo)", { style: "bald", hair: "#9ca3af", shirt: "#7f1d1d", skin: "#c8956a", beard: "baffi", acc: ["berretto"], bg: ["#450a0a", "#fca5a5"] }, "Pescatore in pensione e prima tromba della banda per trent'anni. Non suona più da quando il mare si è preso suo figlio Tonino, tre anni fa.");
        H.cast("bp_lilli", "Lilli", "Clarinetto", { style: "cresta", hair: "#db2777", streak: "#22d3ee", shirt: "#18181b", skin: "#efcfb0", eye: "#0e7490", acc: ["fascia"], bg: ["#18181b", "#f472b6"] }, "Ventiquattro anni, clarinetto della banda da quando ne aveva sei, cresta fucsia da quando ne aveva quindici. Suona forte, risponde più forte.");
        H.cast("bp_abele", "Don Abele", "Piatti", { style: "ordinato", hair: "#6b7280", shirt: "#0f172a", skin: "#e8c4a0", eye: "#334155", bg: ["#0f172a", "#e2e8f0"] }, "Parroco di San Rocco e piatti della banda. Presta la sala sotto la parrocchia per le prove in cambio di una marcia lenta a Pasqua.");
        H.cast("bp_nana", "Sora Nanà", "Trattoria della piazza", { style: "bun", hair: "#d6d3d1", shirt: "#b45309", skin: "#e8b892", eye: "#3f2a1d", acc: ["grembiule"], bg: ["#7c2d12", "#fde68a"] }, "Cuoca della trattoria in piazza e tifosa più rumorosa della banda. Vedova di un bombardino. Dà da mangiare a chiunque suoni, anche male.");
        H.cast("bp_rocco", "Rocco «Bombardino»", "Bombardino", { style: "curly", hair: "#57534e", shirt: "#7f1d1d", skin: "#d9a679", beard: "folta", bg: ["#7f1d1d", "#fde68a"] }, "Quarantadue anni di bombardino, matrimoni e inaugurazioni. Il più vecchio della banda, il più puntuale e il più stonato. Lo sa, e ne va fiero.");
        H.cast("bp_bracco", "Assessore Bracco", "Assessore allo Sport", { style: "pompadour", hair: "#1c1917", shirt: "#1e40af", skin: "#eab68c", eye: "#1e3a8a", bg: ["#1e3a8a", "#93c5fd"] }, "Assessore allo Sport e agli Eventi. Vuole uno stadio moderno, un parcheggio moderno e una cassa audio moderna. Parla come un depliant.");
        H.cast("bp_gigi", "Gigi SuonoSmart", "Tecnico audio", { style: "messy", hair: "#a16207", shirt: "#0ea5e9", skin: "#f1d1b0", acc: ["cuffie"], bg: ["#0c4a6e", "#7dd3fc"] }, "Tecnico della ditta SuonoSmart. Installa altoparlanti e crede nel progresso. In segreto, da ragazzo, suonava il triangolo.");
        H.cast("bp_doge", "Maestro Leandro Doge", "Filarmonica Serenissima", { style: "long", hair: "#78350f", shirt: "#581c87", skin: "#e8c4a0", eye: "#1f2937", acc: ["sciarpa"], bg: ["#3b0764", "#facc15"] }, "Direttore della Filarmonica Serenissima, campione in carica. Ex compagno di corso del Maestro Ferrante. Elegante, velenoso, sempre abbronzato.");
      }
    };
    return H;
  };
  window.__banda = E.api; window.__bandaCore = E;
})();
