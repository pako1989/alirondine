// js/capitani.js - «CAPITANI DI VENTURA» · configurazione della saga sul motore comune (js/saga-core.js)
// 1427: il calcio si gioca con la Palla di Cuoio e le guerre si decidono con una partita (la palla decide, i morti no).
// Tu sei il capitano della Compagnia della Rondine Scalza: senza paga, con un mucchio di debiti e una tesoriera che ti guarda male.
// Tono: ironico di base, con episodi seri. Capitolo 1 «Il Ponte e il Contratto»; seguono Estate, Autunno, Inverno.
// Novità del motore (js/saga-core.js): LA COMPAGNIA (cfg.crew / K.crew): rosa di compagni da reclutare, registro nel diario,
// schieramento (chi va in campo, chi segue), potenza per ruolo. Salvataggio proprio: ali-di-rondine.capitani.
(function () {
  "use strict";
  if (window.__capitani || !window.__sagaCore || !window.__hd) return;
  const HD = window.__hd, R = (g, x, y, w, h, c) => HD.R(g, x, y, w, h, c);
  const MEMBERS = {
    cv_isotta: { n: "Isotta dei Conti", icon: "📒", role: "Tesoriera", d: "Tiene la cassa, la bilancia e il broncio. Dice che il pallone costa più dell'avena.", s: { ingegno: 3, cuore: 1 } },
    cv_ambrogio: { n: "Frate Ambrogio", icon: "🍲", role: "Cuoco e tattico", d: "Ex frate, cuoco di compagnia. Fa la zuppa e le formazioni con lo stesso mestolo.", s: { ingegno: 2, cuore: 2 } },
    cv_brenno: { n: "Brenno il Gigante", icon: "🛡️", role: "Muro", d: "Due metri di pazienza. Nessuno è mai passato; qualcuno, per educazione, si è fermato.", s: { forza: 4 } },
    cv_piccarda: { n: "Piccarda la Gazza", icon: "🪙", role: "Ala veloce", d: "Ladra di buon cuore: restituisce sempre qualcosa, di solito la metà.", s: { tiro: 2, ingegno: 2 } },
    cv_tancredi: { n: "Ser Tancredi di Mezzaluna", icon: "⚔️", role: "Cavaliere", d: "Cavaliere decaduto. Ha un nome lungo, un cavallo corto e un onore intatto.", s: { forza: 2, cuore: 2 } },
    cv_gemma: { n: "Gemma la Balestriera", icon: "🎯", role: "Tiratrice", d: "Non sbaglia mai un bersaglio. A volte sbaglia i colleghi, ma di poco.", s: { tiro: 4 } },
    cv_dario: { n: "Dario il Cantastorie", icon: "🎻", role: "Morale", d: "Canta le imprese prima che accadano, così poi bisogna farle davvero.", s: { cuore: 3, ingegno: 1 } },
    cv_cunegonda: { n: "Cunegonda la Fabbra", icon: "🔨", role: "Contrasto", d: "Batte il ferro e le avversarie. Entrambi, a lungo.", s: { forza: 3, tiro: 1 } },
    cv_letizia: { n: "Madre Letizia", icon: "🥖", role: "Portiere", d: "Cuoca del convento. Para con il mestolo e benedice con il coltello.", s: { forza: 2, cuore: 2 } },
    cv_piero: { n: "Mastro Piero", icon: "⚙️", role: "Ingegnere", d: "Costruisce macchine che funzionano quasi sempre. «Quasi» è il suo marchio di fabbrica.", s: { ingegno: 4 } },
    cv_zanna: { n: "Zanna il Carrettiere", icon: "🐂", role: "Corsa", d: "Ha la faccia di un orso e il carattere di un agnello. Il bue, invece, ha il carattere di un orso.", s: { forza: 2, tiro: 2 } },
    cv_ilaria: { n: "Ilaria la Medica", icon: "🌿", role: "Cura", d: "Medica del castello. Cuce i feriti con lo stesso filo con cui ricuce i bilanci.", s: { cuore: 3, forza: 1 } },
    cv_fulvio: { n: "Messer Fulvio", icon: "💼", role: "Mercante", d: "Vende di tutto, soprattutto promesse. Con lui ogni prezzo è una trattativa e ogni trattativa un'amicizia.", s: { ingegno: 3, tiro: 1 } },
    cv_tiburzio: { n: "Tiburzio il Tamburino", icon: "🥁", role: "Ritmo", d: "Ha sempre due bacchette in mano e mai un'idea del silenzio. Il suo tamburo muove la truppa meglio di un ordine.", s: { cuore: 2, forza: 2 } },
    cv_pellegrino: { n: "Il Pellegrino", icon: "🧳", role: "Segreto", d: "Cammina da sempre verso un posto che non ricorda. Non parla di sé; ascolta, e basta.", s: { cuore: 4, ingegno: 1 } }
  };
  const E = window.__sagaCore.create({
    id: "capitani", key: "ali-di-rondine.capitani", title: "Capitani di Ventura", icon: "🏰", bg: "cv_titolo", chapters: 4,
    menuSub: "1427. Una compagnia di ventura, una palla di cuoio e nessuna paga. Recluta i compagni, accampati, scegli i contratti.",
    theme: { accent: "#fbbf24", ink: "#201a12", paper: "rgba(250,240,214,.96)", font: "'Trebuchet MS', Georgia, serif", chipBg: "#fde68a", chipBorder: "#92400e" },
    stats: { onore: [0, 9, 1, "Onore"], fama: [0, 9, 0, "Fama"], scudi: [0, 99, 10, "Scudi"] },
    regions: {
      campo: { grass: ["#5a7a3a", "#527232", "#628442"], path: ["#a8946a", "#9a865e"], stone: ["#8a8a8a", "#7a7a7a"], wall: ["#5a4630", "#4e3c28"], water: ["#2f6aa0", "#2a6096"], tree: "#2e5a2a", tint: "255,170,90", tintA: 0.12, fx: "dust" },
      borgo: { grass: ["#6a8a4a", "#628244", "#729a52"], path: ["#b8a47a", "#aa966e"], stone: ["#9a9288", "#8a8278"], wall: ["#cdb48a", "#bda47a"], water: ["#2f7ab0", "#2a70a4"], tree: "#3a6a30", tint: "255,220,160", tintA: 0.06 },
      ponte: { grass: ["#6a9a50", "#629048", "#72a458"], path: ["#bda882", "#ad9872"], stone: ["#8a8a92", "#7a7a82"], wall: ["#6a6a72", "#5e5e66"], water: ["#2f6aa0", "#2a6096"], tree: "#2e6a30", tint: "200,220,255", tintA: 0.07 },
      neve: { grass: ["#dde7ee", "#d2dee8", "#e6eef4"], path: ["#b8c4cc", "#aab6be"], stone: ["#9aa6b0", "#8e9aa4"], wall: ["#6a7684", "#5e6a78"], water: ["#7aa0c0", "#6e94b4"], tree: "#2e4a3a", tint: "200,220,255", tintA: 0.1, fx: "snow" },
      casa: { grass: ["#6a4a2e", "#5e4126", "#745234"], path: ["#8a6a3e", "#7d5f36"], stone: ["#7a5a38", "#6b4e30"], wall: ["#2a1810", "#20120c"], water: ["#2a4a52", "#223c43"], tree: "#3a2c1e", tint: "255,190,110", tintA: 0.1 }
    },
    floors: ".",
    solid: "PFVZACEYUK",
    paint: {
      P(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g, c = [["#b91c1c", "#7f1d1d"], ["#1d4ed8", "#1e3a8a"], ["#ca8a04", "#854d0e"]][(tx + ty) % 3]; R(g, sx, sy + 14, 16, 2, "rgba(0,0,0,.3)"); g.fillStyle = c[0]; g.beginPath(); g.moveTo(sx, sy + 15); g.lineTo(sx + 8, sy + 1); g.lineTo(sx + 16, sy + 15); g.fill(); g.fillStyle = c[1]; g.beginPath(); g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 16, sy + 15); g.lineTo(sx + 11, sy + 15); g.fill(); R(g, sx + 6, sy + 9, 4, 6, "#1a1208"); R(g, sx + 7.5, sy - 3, 1, 5, "#4a3a2a"); },
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 2, sy + 13, 12, 3, "rgba(0,0,0,.3)"); R(g, sx + 3, sy + 11, 10, 3, "#4a3220"); R(g, sx + 5, sy + 10, 6, 2, "#6a4a2c"); for (let i = 0; i < 3; i++) { g.fillStyle = ["#ff7a2a", "#ffb84a", "#fff3a0"][i]; g.beginPath(); g.moveTo(sx + 4 + i * 2, sy + 11); g.lineTo(sx + 8, sy + 3 - i * 1.5 + Math.sin(fr / 4 + i) * 1.5); g.lineTo(sx + 12 - i * 2, sy + 11); g.fill(); } K.light(sx + 8, sy + 8, 70, "255,150,70", 0.55 + Math.sin(fr / 6) * 0.06); },
      V(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 7, sy - 8, 2, 24, "#5a4630"); g.fillStyle = "#dc2626"; g.beginPath(); g.moveTo(sx + 9, sy - 7); for (let i = 0; i <= 8; i++) g.lineTo(sx + 9 + i, sy - 7 + Math.sin(fr / 9 + i / 2) * 1.2); for (let i = 8; i >= 0; i--) g.lineTo(sx + 9 + i, sy + 1 + Math.sin(fr / 9 + i / 2) * 1.2); g.fill(); R(g, sx + 11, sy - 4, 3, 2, "#fff1cc"); },
      Z(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); R(g, sx, sy + 5, 16, 8, "#7a5a32"); R(g, sx, sy + 4, 16, 2, "#a8844a"); R(g, sx + 1, sy + 12, 2, 4, "#4a3220"); R(g, sx + 13, sy + 12, 2, 4, "#4a3220"); if (tx % 2) { R(g, sx + 3, sy + 2, 8, 3, "#f2e2b0"); R(g, sx + 4, sy + 3, 6, 1, "#8a6a3a"); } },
      A(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 1, sy + 14, 14, 2, "rgba(0,0,0,.3)"); R(g, sx + 2, sy + 4, 2, 11, "#5a4630"); R(g, sx + 12, sy + 4, 2, 11, "#5a4630"); R(g, sx + 2, sy + 6, 12, 2, "#7a5a3a"); [4, 7, 10].forEach((x, i) => { R(g, sx + x, sy, 1.5, 9, "#b8bcc8"); R(g, sx + x - 0.5, sy - 1, 2.5, 2, i % 2 ? "#e5e7eb" : "#9ca3af"); }); },
      C(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); R(g, sx + 1, sy + 4, 14, 8, "#8a5a30"); R(g, sx + 1, sy + 4, 14, 2, "#b0804a"); R(g, sx + 3, sy + 2, 10, 3, "#d9c49a"); g.fillStyle = "#3a2a1a"; g.beginPath(); g.arc(sx + 4, sy + 13, 3, 0, 7); g.arc(sx + 12, sy + 13, 3, 0, 7); g.fill(); },
      E(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 2, sy + 14, 12, 2, "rgba(0,0,0,.3)"); R(g, sx + 3, sy + 4, 10, 11, "#8a5a30"); [6, 10].forEach((y) => R(g, sx + 3, sy + y, 10, 1.5, "#3a2a1a")); R(g, sx + 4, sy + 3, 8, 2, "#a8744a"); },
      Y(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx + 2, sy + 14, 12, 2, "rgba(0,0,0,.3)"); R(g, sx + 3, sy + 10, 2, 6, "#5a4630"); R(g, sx + 11, sy + 10, 2, 6, "#5a4630"); R(g, sx + 1, sy + 1, 14, 10, "#8a6a3a"); R(g, sx + 2, sy + 2, 12, 8, "#f2e2b0"); [[3, 3], [8, 3], [4, 7]].forEach(([x, y], i) => R(g, sx + x, sy + y, 4, 3, ["#fff7e6", "#fde68a", "#e5e7eb"][i])); },
      U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.25)"); R(g, sx + 1, sy + 4, 14, 10, "#8a8a92"); R(g, sx + 2, sy + 5, 12, 6, "#3a8ac8"); for (let i = 0; i < 3; i++) R(g, sx + 3 + i * 4, sy + 7 + Math.sin(fr / 8 + i) * 1, 3, 1, "rgba(255,255,255,.7)"); R(g, sx + 6, sy - 1, 4, 6, "#a8a8b0"); },
      K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); R(g, sx, sy + 3, 16, 11, "#4a3a34"); R(g, sx + 3, sy + 6, 10, 6, "#150a06"); g.fillStyle = "#ff7a2a"; g.beginPath(); g.moveTo(sx + 4, sy + 12); g.lineTo(sx + 8, sy + 6 + Math.sin(fr / 4) * 1.5); g.lineTo(sx + 12, sy + 12); g.fill(); K.light(sx + 8, sy + 9, 40, "255,120,40", 0.5); }
    },
    act: { P: "Guarda la tenda", F: "Siediti al falò", V: "Guarda lo stendardo", Z: "Siediti al tavolo", A: "Guarda le armi", C: "Guarda il carro", E: "Guarda i barili", Y: "Leggi la bacheca", U: "Guarda la fontana", K: "Guarda la forgia", q: "Entra", v: "Esci" },
    travel: true,
    item: ["Scudo di Pietrabianca", "Scudi di Pietrabianca"],
    journal: { name: "Il Registro della Compagnia", sub: "Compagni, mappa dei contratti e finali" },
    endings: {
      capitano: ["Capitano del Conte", "Hai firmato per un padrone solo. La paga arriva. La libertà, un po' meno.", "Accetta l'incarico del Conte nel capitolo 4."],
      libera: ["La Rondine Scalza", "Libera e senza padroni, con i debiti di sempre e una compagnia vera.", "Rifiuta l'incarico del Conte."],
      leggenda: ["La Rondine Leggendaria", "Dodici compagni, un onore intatto e una ballata che tutti conoscono.", "Segreto: rifiuta l'incarico con Onore 5 e almeno 12 compagni."]
    },
    heroLook: (h, K) => ({ bg: ["#3a2438", "#fbbf24"], shirt: h.shirt }),
    heroTitle: () => "capitano della Rondine Scalza",
    crew: { name: "La Rondine Scalza", field: 4, members: MEMBERS },
    party: (K) => (K.crew ? K.crew.field().filter((id) => id !== "cv_isotta").slice(0, 3) : []),
    musicMain: "capitani",
    music: {
      capitani: { bpm: 104, chords: ["Dm", "Dm", "Bb", "C", "Dm", "F", "C", "Dm"], lres: 2, lw: "triangle", lv: 0.04,
        lead: "D5 - F5 - A5 - G5 - | F5 - E5 - D5 - - - | F5 - A5 - C6 - Bb5 - | A5 - - - G5 - - - | D5 - F5 - A5 - G5 - | A5 - C6 - A5 - F5 - | E5 - G5 - E5 - C5 - | D5 - - - - - - -",
        bass: "R . . 5 . . R . . 5 . . R . 5 .", bv: 0.09, arp: "1 5 1 5 1 5 1 5", aw: "triangle", av: 0.012, drum: "k . . h . . s . . h . . k . h .", dv: 0.12 }
    },
    cameos: [],
    stadium: { azPitch: "campo", cageField: 1, cageMut: "heavy", venue: { ads: [["RONDINE SCALZA", "#b91c1c"], ["PIETRABIANCA", "#c8a050"], ["CASA DEL CONTE", "#1d4ed8"], ["LOCANDA DEL CINGHIALE", "#7c2d12"]], crowd: ["#b91c1c", "#f4f0e4", "#c8a050"], ground: ["#5a7a3a", "#527232"], line: "#f4f0e4", sky: ["#7ec0ee", "#fde7b8"], wall: ["#cdb48a", "#bda47a"], glow: "255,200,120" } },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        if (ch === "F" || ch === "Z") { K.say([["voce", ch === "F" ? "Il falò crepita. Intorno, la compagnia: chi dorme, chi litiga, chi giura di non aver fame." : "Il tavolo del consiglio: una mappa, tre candele e un conto che non torna."]], () => K.ask("voce", "Cosa fai?", [{ label: "⚔️ Schiera la compagnia", sub: "Chi va in campo e chi segue", cls: "hot", fn: () => K.crew.pick(K.done, true) }, { label: "Lascia stare", fn: K.done }])); return true; }
        return false;
      }
    }]
  });
  window.__capitani = E.api; window.__capitaniCore = E;
})();
