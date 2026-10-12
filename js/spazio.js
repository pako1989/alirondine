// js/spazio.js - CALCIO SPAZIALE: STAZIONE ORBITALE 7 · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA. Tutto inventato. La Stazione Orbitale 7 ha il primato galattico della noia: 412 giorni senza un evento degno
// di nota. La Comandante organizza un torneo di calcio per non impazzire, e l'unico terrestre a bordo (il Campione) viene
// scambiato per «l'esperto di calcio vero». Squadra: un cuoco gelatinoso, un portiere a quattro braccia, un robot arbitro
// che fischia fuorigioco alle porte. E il computer di bordo, NONNA, che ti chiede sempre se hai mangiato.
// Novità di questa saga (oltre a quelle del motore comune):
//  - LA GRAVITÀ (motore comune: spec.gravity delle zone): moduli a gravità zero dove si fluttua con l'inerzia e si rimbalza
//    sui muri, e settori a gravità invertita dove la visuale ruota di 180° (i comandi restano quelli dello schermo).
//  - VETRATE CON LE STELLE IN PARALLASSE: le stelle scorrono più lente delle pareti, come dietro un vetro vero.
//  - GRAVITÀ ZERO (js/spazio-partita.js): la partita originale, con il pallone che non cade mai.
// Salvataggio proprio: ali-di-rondine.spazio. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__spazio || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    id: "spazio", key: "ali-di-rondine.spazio", title: "Calcio Spaziale: Stazione Orbitale 7", icon: "🚀", bg: "so_stazione", chapters: 3,
    menuSub: "La gravità cambia in ogni modulo e il pallone non cade mai",
    theme: { accent: "#7af0c8", ink: "#e8f4ff", paper: "rgba(10,16,34,.88)", font: "'Trebuchet MS', sans-serif", chipBg: "#0a1830ee", chipBorder: "#7af0c8" },
    stats: { squadra: [0, 99, 0, "Spirito di squadra"], arbi: [-9, 9, 0, "Fiducia di ARBI-9"] },
    travel: true,
    item: ["Bullone d'oro", "Bulloni d'oro"],
    regions: {
      hangar: { grass: ["#4a5468", "#4e586c", "#465064"], path: ["#5a6478", "#545e72"], stone: ["#6a7488", "#646e82"], wall: ["#2a3448", "#26304a"], water: ["#0a1430", "#0e1834"], tall: "#3a8a6a", tree: ["#2a8a5a", "#3aa86a", "#5ac87a"], tint: "150,200,255", tintA: 0.07, fx: "float", dark: 0.12 },
      anello: { grass: ["#3e4462", "#424866", "#3a405e"], path: ["#525a7a", "#4c5474"], stone: ["#5e6688", "#586082"], wall: ["#242a44", "#20263e"], water: ["#0a1430", "#0e1834"], tall: "#5a7aa8", tint: "180,150,255", tintA: 0.1, fx: "float", dark: 0.16 },
      palestra: { grass: ["#2e4a6a", "#32506e", "#2a4664"], path: ["#3e5a7a", "#385474"], stone: ["#4a6a8a", "#446484"], wall: ["#1a2a44", "#16263e"], water: ["#0a1430", "#0e1834"], tall: "#7af0c8", tint: "122,240,200", tintA: 0.08, fx: "float", dark: 0.12 },
      serra: { grass: ["#2a5a4a", "#2e5e4e", "#265646"], path: ["#3a6a5a", "#346454"], stone: ["#4a7a6a", "#447464"], wall: ["#1a3a30", "#16342a"], water: ["#1a5a7a", "#1e6080"], tall: "#5ac87a", tree: ["#2a8a5a", "#3aa86a", "#7ae86a"], tint: "160,255,180", tintA: 0.1, fx: "float", dark: 0.12 },
      macchine: { grass: ["#4a3a3a", "#4e3e3e", "#463636"], path: ["#5a4a44", "#54443e"], stone: ["#6a5a50", "#64544a"], wall: ["#2a1e1e", "#261a1a"], water: ["#3a1a0a", "#40200e"], tall: "#e8a83a", tint: "255,160,90", tintA: 0.12, fx: "sparks", dark: 0.2 },
      cupola: { grass: ["#1a2240", "#1e2644", "#161e3a"], path: ["#2a3458", "#262e52"], stone: ["#3a4468", "#343e62"], wall: ["#10162e", "#0c1228"], water: ["#0a1430", "#0e1834"], tall: "#7af0c8", tint: "120,150,255", tintA: 0.12, fx: "float", dark: 0.22 },
      mensa: { grass: ["#5a4a3a", "#5e4e3e", "#564636"], path: ["#6a5a48", "#645442"], stone: ["#7a6a58", "#746452"], wall: ["#3a3040", "#342a3a"], water: ["#3a5a7a", "#40607e"], tall: "#7ae86a", tint: "255,210,150", tintA: 0.12, fx: "float", dark: 0.16 },
    },
    floors: "", solid: "VQJYZKIiE",
    rest: { ch: "s", label: "Agganciati alla cuccetta", text: "Ti agganci alla cuccetta con le cinghie, per non volare via. NONNA abbassa le luci: «Dormi, caro. Domani c'è il torneo». (Il gioco salva da solo: qui puoi rileggere il Diario di Bordo.)" },
    texts: { chestOpen: "Apri il contenitore.", chestEmpty: "Il contenitore è vuoto. Dentro fluttua solo una briciola di cracker del 2091.", nothing: "Niente. Solo un bullone che ti gira intorno come una piccola luna.", noHero: "La Stazione 7 aspetta un esperto di calcio dalla Terra. Prima crea il tuo Campione.", chapters: "Tre capitoli, tre gravità diverse. Le scelte restano: cambiano il finale." },
    journal: { name: "Il Diario di Bordo", sub: "Equipaggio, scoperte, partite, finali" },
    endings: {
      casa: ["RITORNO SULLA TERRA", "Il Campione torna a casa con la navetta della domenica. In valigia, un pallone che non cade più: sulla Terra, per abitudine, rimbalza un po' troppo.", "Sempre possibile, alla fine."],
      capitano: ["CAPITANO DELLE STELLE", "Il Campione resta a bordo come capitano della prima squadra orbitale della storia. La noia è finita: adesso il primato è un altro.", "Serve uno spirito di squadra fortissimo."],
      nonna: ["LA PORTIERA DI SILICIO", "NONNA, il computer di bordo, ottiene un corpo da robot portiere e gioca la sua prima partita. Para tutto, e dopo ogni parata chiede se avete mangiato.", "Serve la piena fiducia di ARBI-9."],
      fuorigioco: ["IL FUORIGIOCO PERFETTO", "Nella finale ARBI-9 fischia il primo fuorigioco giusto della sua vita. Piange olio per un'ora. È la cosa più bella che la Stazione 7 abbia mai visto.", "Segreto: tutte le cartoline dalla Terra e la fiducia piena di ARBI-9."],
    },
    heroLook: (h, K) => ({ bg: ["#0a1830", "#7af0c8"], shirt: K.F.is("so_tuta") ? "#e8e8f0" : h.shirt }),
    heroTitle: (K) => (K.F.is("so_capitano") ? "capitano orbitale" : "esperto di calcio vero (presunto)"),
    act: { V: "Guarda le stelle", Q: "Usa la console", J: "Guarda il generatore", Y: "Guarda la pianta", Z: "Afferra il pallone", K: "Guarda la cassa", E: "Guarda la cartolina", I: "Guarda la navetta", "<": "Cambia modulo", ">": "Cambia modulo" },
    musicMain: "spazio",
    music: {
      // un tema saltellante da sintetizzatore, con l'eco: suona come una pubblicità di cereali del futuro
      spazio: { bpm: 118, chords: ["Am", "F", "C", "G", "Am", "F", "E", "E"], lres: 2, lw: "square", lv: 0.04,
        lead: "A5 . C6 . E6 - D6 . | C6 . A5 . F5 - - . | G5 . C6 . E6 - G6 . | F6 - E6 - D6 - - . | A5 . C6 . E6 - D6 . | C6 . A5 . F5 - A5 . | G#5 - B5 - E6 - D6 . | B5 - - - - - - .",
        bass: "R . R 5 . R 5 . R . R 5 . R 8 .", bv: 0.09, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "triangle", av: 0.022, drum: "k . h . s . h . k . h k s . h .", dv: 0.24 },
    },
    paint: {
      // una vetrata sullo spazio: le stelle scorrono più lente delle pareti (parallasse), e ogni tanto passa una cometa
      V(K, sx, sy, tx, ty, fr) {
        const g = K.g, cx = tx * TS - sx, cy = ty * TS - sy;
        K.P(sx, sy, 16, 16, "#05060c");
        for (let j = 0; j < 40; j++) { const d = j % 3 ? 0.25 : 0.12, X = (((j * 71 + 11) % 360) - cx * d) % 360, Y = (((j * 43 + 7) % 220) - cy * d) % 220, x = X < 0 ? X + 360 : X, y = Y < 0 ? Y + 220 : Y; if (x >= sx && x < sx + 16 && y >= sy && y < sy + 16) K.P(x, y, j % 9 ? 1 : 2, j % 9 ? 1 : 2, j % 5 ? "rgba(220,235,255,.8)" : "#ffe8a0"); }
        const cmx = ((fr * 1.6) % 900) - 100 - cx * 0.2, cmy = 30 - cy * 0.2 + ((fr / 900) | 0) % 3 * 40; if (cmx >= sx - 10 && cmx < sx + 16 && cmy >= sy && cmy < sy + 16) { g.fillStyle = "rgba(200,240,255,.8)"; g.fillRect(Math.max(sx, cmx), cmy, 2, 1); g.fillStyle = "rgba(200,240,255,.3)"; g.fillRect(Math.max(sx, cmx - 8), cmy, Math.min(8, cmx - sx), 1); }
        K.P(sx, sy, 16, 1, "#8a94a8"); K.P(sx, sy + 15, 16, 1, "#8a94a8"); if (tx % 3 === 0) K.P(sx, sy, 1, 16, "#8a94a8"); K.P(sx + 2, sy + 2, 3, 1, "rgba(255,255,255,.18)");
      },
      // una console di bordo con gli schermi che lampeggiano (NONNA ci parla da qui)
      Q(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.P(sx + 1, sy + 4, 14, 11, "#3a4458"); K.P(sx + 2, sy - 2, 12, 8, "#1a2a3a"); K.P(sx + 3, sy - 1, 10, 6, (Math.floor(fr / 30 + tx) % 4) ? "#1a5a6a" : "#2a8a8a");
        for (let i = 0; i < 3; i++) K.P(sx + 4 + i * 3, sy + 1 + ((fr / 10 + i * 5 + tx) % 3), 2, 1, "#7af0c8");
        K.P(sx + 3, sy + 8, 2, 2, (fr / 20 + tx) % 2 < 1 ? "#e83a6a" : "#5a2a3a"); K.P(sx + 7, sy + 8, 2, 2, "#e8a83a"); K.P(sx + 11, sy + 8, 2, 2, "#3ae86a"); K.light(sx + 8, sy + 2, 14, "122,240,200", 0.3);
      },
      // il generatore di gravità: un anello che gira (più veloce quando funziona male)
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => {
          const x = tx * TS - cx + 8, y = ty * TS - cy + 4, broken = K.F.is("so_gen_rotto") && !K.F.is("so_gen_ok"), sp = broken ? fr / 4 : fr / 18;
          g.fillStyle = "#2a3448"; g.fillRect(x - 10, y + 6, 20, 8); g.strokeStyle = broken ? "#e83a6a" : "#7af0c8"; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y - 4, 13, 5 + Math.sin(sp) * 3, sp / 3, 0, 7); g.stroke();
          g.fillStyle = broken ? "#e83a6a" : "#7af0c8"; g.beginPath(); g.arc(x, y - 4, 4, 0, 7); g.fill(); K.light(x, y - 4, 26, broken ? "232,58,106" : "122,240,200", 0.5);
        });
      },
      // una pianta della serra idroponica, chiusa in una bolla che galleggia
      Y(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const b = Math.sin(fr / 30 + tx + ty) * 1.5, g = K.g;
        K.P(sx + 6, sy + 12, 4, 3, "#5a4a3a"); g.fillStyle = "#3aa86a"; g.beginPath(); g.ellipse(sx + 8, sy + 6 + b, 5, 6, 0, 0, 7); g.fill(); g.fillStyle = "#7ae86a"; g.beginPath(); g.ellipse(sx + 6, sy + 4 + b, 2, 3, -0.5, 0, 7); g.fill();
        g.strokeStyle = "rgba(200,240,255,.45)"; g.lineWidth = 1; g.beginPath(); g.arc(sx + 8, sy + 7 + b, 7.5, 0, 7); g.stroke();
      },
      // un pallone che galleggia a mezz'aria (in palestra)
      Z(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); if (K.F.is(`so_ball_${K.ZX.id}_${tx}_${ty}`)) return; const g = K.g, b = Math.sin(fr / 18 + tx) * 3;
        g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 4 - b * 0.3, 1.5, 0, 0, 7); g.fill();
        g.save(); g.translate(sx + 8, sy + 5 + b); g.rotate(fr / 25); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill(); g.fillStyle = "#1a1a1a"; g.fillRect(-1.5, -1.5, 3, 3); g.restore(); K.light(sx + 8, sy + 5 + b, 14, "122,240,200", 0.4);
      },
      // una cassa di bulloni, legata con le cinghie
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.P(sx + 1, sy + 3, 14, 12, "#6a5a3a"); K.P(sx + 1, sy + 3, 14, 2, "#8a7a4a"); K.P(sx + 4, sy + 3, 2, 12, "#e8a83a"); K.P(sx + 10, sy + 3, 2, 12, "#e8a83a"); K.P(sx + 6, sy + 8, 4, 3, "#2a2a2a"); },
      // una cartolina dalla Terra, incastrata in una grata
      E(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.P(sx + 1, sy + 2, 14, 12, "#5a6478"); for (let i = 0; i < 4; i++) K.P(sx + 2 + i * 4, sy + 3, 1, 10, "#3a4458"); if (!K.F.is(`so_cart_${K.ZX.id}`)) { K.P(sx + 4, sy + 5 + Math.sin(fr / 30) * 0.5, 8, 6, "#f4ecdc"); K.P(sx + 5, sy + 6, 3, 2, "#3a8ac8"); K.P(sx + 9, sy + 6, 2, 2, "#e85a3a"); } },
      // la navetta della domenica, parcheggiata nell'hangar (disegnata sopra le tessere, dalla tessera ancora)
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => {
          const x = tx * TS - cx, y = ty * TS - cy;
          g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x + 48, y + 46, 50, 8, 0, 0, 7); g.fill();
          g.fillStyle = "#d8dce8"; g.beginPath(); g.moveTo(x, y + 30); g.quadraticCurveTo(x + 10, y + 4, x + 60, y + 6); g.lineTo(x + 96, y + 20); g.lineTo(x + 96, y + 36); g.lineTo(x + 6, y + 40); g.closePath(); g.fill();
          g.fillStyle = "#e85a3a"; g.fillRect(x + 20, y + 26, 70, 4); g.fillStyle = "#1a3a5a"; g.fillRect(x + 62, y + 12, 22, 9); g.fillStyle = "rgba(122,240,200,.5)"; g.fillRect(x + 64, y + 13, 8, 3);
          g.fillStyle = "#3a4458"; g.fillRect(x + 4, y + 38, 18, 6); g.fillRect(x + 74, y + 36, 18, 6); g.fillStyle = "#2a2a2a"; g.font = "bold 6px sans-serif"; g.fillText("NAVETTA DELLA DOMENICA", x + 18, y + 24);
          if (Math.floor(fr / 25) % 2) K.light(x + 96, y + 26, 12, "232,90,58", 0.5);
        });
      },
      i(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); },
    },
    drawItem(g, x, y, i, f) { // un bullone d'oro che gira su se stesso, galleggiando
      const b = Math.sin(f / 20 + i) * 2, r = f / 25 + i; g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(x, y + 6, 3, 1, 0, 0, 7); g.fill();
      g.save(); g.translate(x, y - 2 + b); g.rotate(r); g.fillStyle = "#e8c84a"; g.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.28; g.lineTo(Math.cos(a) * 4, Math.sin(a) * 4); } g.closePath(); g.fill(); g.fillStyle = "#8a6a1a"; g.beginPath(); g.arc(0, 0, 1.6, 0, 7); g.fill(); g.restore();
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,230,120,.25)"; g.beginPath(); g.arc(x, y - 2 + b, 7, 0, 7); g.fill(); g.restore();
    },
    // pavimenti a pannelli di metallo con i rivetti, e camminamenti con le luci guida
    floorPaint(K, f, sx, sy, tx, ty) {
      const R = K.ZX.rg; if (f === ",") { K.P(sx, sy, 16, 16, R.grass[(tx + ty) % 2]); K.P(sx, sy, 16, 1, "rgba(255,255,255,.07)"); K.P(sx, sy + 15, 16, 1, "rgba(0,0,0,.25)"); K.P(sx + 15, sy, 1, 16, "rgba(0,0,0,.18)"); K.P(sx + 2, sy + 2, 1, 1, "rgba(255,255,255,.2)"); K.P(sx + 13, sy + 13, 1, 1, "rgba(255,255,255,.2)"); return true; }
      if (f === ":") { K.P(sx, sy, 16, 16, R.path[(tx + ty) % 2]); K.P(sx, sy + 7, 16, 2, "rgba(0,0,0,.2)"); if ((tx + ty) % 3 === 0) { K.P(sx + 7, sy + 7, 2, 2, (Math.floor(K.frNow() / 12) - tx) % 6 === 0 ? "#7af0c8" : "#2a5a5a"); } return true; }
      return false;
    },
    cameos: [
      { id: "dc_agata", zone: "so_mensa", at: [15, 8], when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1], lines: [
        ["dc_agata", "{n}. Non chiedermi come sono arrivata quassù. Diciamo che indago su un furto di gravità. Il sospettato numero uno è il cuoco: troppo gelatinoso per essere innocente."],
        ["dc_agata", "E poi il caffè della mensa fluttua. Non si può interrogare nessuno con un caffè che ti scappa dalla tazza. È un'indagine difficilissima."]] },
      { id: "ep_ada", zone: "so_cupola", at: [6, 9], when: (K) => !!(K.otherSaga("ali-di-rondine.dopo") || {}).done?.[1], lines: [
        ["ep_ada", "Sono in viaggio, {n}. Avevo detto «tutti i campi dove ha giocato»… e il Capitano, una volta, ha detto che il campo più bello sarebbe stato tra le stelle. Volevo controllare."],
        ["ep_ada", "Quassù il tempo passa strano per tutti, non solo per me. È riposante. Per la prima volta non sono io quella fuori posto."]] },
    ],
  });
  const K = E.K;
  // le cartoline dalla Terra: una per capitolo, nascoste nelle grate (servono per il finale segreto)
  K.cartolina = (zid, text) => {
    const k = `so_cart_${zid}`; if (K.F.is(k)) return K.say([["voce", "La grata è vuota. La cartolina è nel Diario di Bordo."]]);
    K.F.set(k, true); K.F.add("cartoline", 1); K.SFX.ding(); K.say([["voce", text], ["voce", `<span style="color:var(--dim)">Cartoline dalla Terra: ${K.F.get("cartoline", 0)} su 3.</span>`]]);
  };
  // i palloni che galleggiano in palestra: si afferrano una volta
  K.ballsTaken = (zid) => Object.keys(K.mem().flags).filter((k) => k.startsWith("so_ball_" + zid + "_")).length;
  window.__spazio = E.api;
})();
