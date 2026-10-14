// js/dungeon.js - «DUNGEON DI FINE STAGIONE» · configurazione della saga su js/saga-core.js
// Saga EPICO-IRONICA, un roguelike di calcio alla «Hades»: sotto lo Stadio Vecchio c'è l'Ipogeo, il dungeon-stadio dove si gioca il Torneo
// di Fine Stagione. Ogni partita è una STANZA con un avversario mitico; prima di ogni stanza scegli una porta, dopo ogni stanza scegli 1 dono
// su 3 (valgono solo per la discesa in corso). Se cadi, ricominci dall'ingresso: ma ricordi tutto. Le discese si ripetono, con piani, porte,
// scorciatoie e finali diversi. (Tutto inventato: nessuna copia di opere esistenti.)
// Novità di questa saga (oltre a quelle del motore comune):
//  - LE STANZE DELL'IPOGEO (js/dungeon-partita.js): la partita originale, un motore suo (arena dall'alto con trappole, mitici con una meccanica
//    ciascuno, cuori, scatto, doni).
//  - LA DISCESA: run ripetibili. Porte a scelta tra più stanze (con il premio in vista), un Campo Base camminabile, ingressi che cambiano,
//    scorciatoie che si sbloccano e un registro che ricorda le cadute (flag: dg_morti, dg_d1..d5).
//  - PIXEL ART SCURA CON LUCI DI TORCIA: pareti di pietra, braci che salgono, rune che pulsano, sfondi animati (js/dungeon-bg.js).
// Salvataggio proprio: ali-di-rondine.dungeon.
(function () {
  "use strict";
  if (!window.__sagaCore || (window.__dungeon && window.__dungeon.addChapter)) return;
  const pre = window.__dungeon; // se il motore di partita è già stato caricato, si ricollega dopo

  // ------------------------------------------------------------------ i piani del dungeon
  const PIANI = {
    1: { n: "Le Gallerie dei Rimpianti", zone: "dg_p1", pool: ["scheletri", "arpie", "golem"], boss: "minotauro", lvl: 1, entry: [[2, 3], [2, 9], [2, 15]], bg: "dg_p1" },
    2: { n: "Le Cisterne del Brindisi", zone: "dg_p2", pool: ["medusa", "idra", "spettri", "arpie"], boss: "cerbero", lvl: 2, entry: [[2, 3], [2, 9], [2, 15]], bg: "dg_p2" },
    3: { n: "La Tribuna d'Oro", zone: "dg_p3", pool: ["golem", "medusa", "idra", "spettri", "arpie", "scheletri"], boss: "cenere", lvl: 3, entry: [[2, 3], [2, 9], [2, 15]], bg: "dg_p3" },
  };
  const PORTE = { 0: ["Ferro", "X", "⛓️"], 1: ["Legno", "Y", "🪵"], 2: ["Brace", "Z", "🔥"] };
  const PREMI = { dono: ["un dono", "🎁"], raro: ["un dono raro", "💎"], cuore: ["tutti i cuori", "❤️"], monete: ["monete e un dono", "🪙"] };
  const STILE = { scheletri: "equilibrata", arpie: "pressing", golem: "difensiva", medusa: "difensiva", idra: "contropiede", spettri: "pressing", cerbero: "difensiva", minotauro: "pressing", cenere: "pressing" };
  const COL = { scheletri: "#cfc8b4", arpie: "#9a5ac8", golem: "#8a8478", medusa: "#4ab87a", idra: "#7ac84a", spettri: "#a8c8f0", cerbero: "#c83a2a", minotauro: "#a8503a", cenere: "#ff7a1a" };
  // una battuta prima e una dopo ogni mitico (la voce del dungeon, ironica)
  const FOES = {
    scheletri: ["Un coro di ossa applaude da solo. Gli Scheletri del Terzo Anello indossano la maglia dell'anno in cui hanno smesso di tifare.", "Si rimettono insieme pezzo per pezzo, ringraziando. Sono i tifosi più educati dell'Ipogeo."],
    arpie: ["Un frullo d'ali, un fischio acuto: le Arpie del Fischio hanno già visto il pallone. Hanno già deciso che è loro.", "Le arpie si allontanano offese, con una piuma in meno e un'opinione in più sull'arbitro."],
    golem: ["Un masso che respira. Il Golem di Pietra Pomice sta in porta dal 1974 e non ha mai chiesto il cambio.", "Il golem si ricompone con un rumore di ghiaia. «Bel tiro», dice. Nessuno sa come faccia a parlare."],
    medusa: ["Un'ombra con gli occhiali da sole, nel buio. Meda, la Medusa Mediana, ti saluta senza guardarti. È una cortesia.", "Meda si rimette gli occhiali. «Scusa per prima», dice. «Quando mi emoziono, pietrifico.»"],
    idra: ["Un lungo collo, un altro, un altro ancora. L'Idra dalle Mille Maglie ha un sacco di teste e una sola idea: la tua porta.", "Una testa ti guarda con rispetto. Le altre litigano su chi avrebbe dovuto parare."],
    spettri: ["La luce trema. Gli Spettri dell'Ultimo Minuto sono quelli che avrebbero segnato, se ci fosse stato ancora un minuto.", "Gli spettri si sciolgono in una nebbia sottile. Uno ti fa il segno dell'applauso. Passa attraverso il suo stesso braccio."],
    cerbero: ["Tre teste in porta, tre paia d'occhi, una coda che scodinzola per riflesso. Cerbero fa il portiere da prima che esistesse la porta.", "Tre teste si abbassano insieme. «Ti prego», dice quella di mezzo, «non dirlo a quelli dell'Aldilà.»"],
    minotauro: ["Il Labirinto finisce qui, in un'area di rigore. Asterio, il Terzino, scalpita: ha fatto la barba ai pilastri per trent'anni.", ""],
    cenere: ["", ""],
  };

  let PA;
  const heroName = () => { const h = (window.heroLoad && window.heroLoad()) || {}; return h.name || "Campione"; };
  const E = window.__sagaCore.create({
    id: "dungeon", key: "ali-di-rondine.dungeon", title: "Dungeon di Fine Stagione", icon: "🔥", bg: "dg_titolo", chapters: 3,
    menuSub: "Un torneo sotto lo stadio: ogni partita è una stanza, ogni sconfitta un nuovo inizio",
    theme: { accent: "#ff7a1a", ink: "#f3e6cf", paper: "rgba(22,16,13,.93)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#2a1c12ee", chipBorder: "#ff7a1a" },
    stats: { fiamma: [0, 9, 0, "Legame con Fiamma"], ruggine: [-3, 9, 0, "Fiducia di Ruggine"], pieta: [-3, 5, 0, "Pietà"] },
    travel: true, diorama: false,
    item: ["Runa di Brace", "Rune di Brace"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); const a = 0.6 + 0.3 * Math.sin(f / 9 + i); g.fillStyle = `rgba(255,122,26,${a * 0.35})`; g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill(); g.fillStyle = "#2a2018"; g.fillRect(-5, -6, 10, 12); g.fillStyle = "#ff9a3a"; g.fillRect(-1, -5, 2, 10); g.fillRect(-4, -1, 8, 2); g.fillStyle = "#ffe08a"; g.fillRect(-1, -2, 2, 4); g.restore(); },
    stadium: {
      azPitch: "ipogeo", cageField: 2, cageMut: "heavy", weather: "",
      venue: { ads: [["TORNEO DI FINE STAGIONE", "#ff7a1a"], ["PIETRA & PIETRA S.R.L.", "#8a8478"], ["BRACE DEL MISTER", "#c8501a"], ["MINOTAURO FC", "#a8503a"]], crowd: ["#2a1c14", "#4a3424", "#a8503a", "#ff7a1a", "#cfc8b4"], ground: ["#3b3430", "#2e2824"], line: "rgba(255,160,70,.6)", grid: "rgba(0,0,0,.25)", tint: "rgba(255,120,40,.1)", glow: "255,140,60", sky: ["#0b0907", "#2a1814"], wall: ["#4a403c", "#241d1c"], fx: { fr: 0.97, spd: 0.98, wind: 0 } },
    },
    regions: {
      campo: { grass: ["#38302b", "#352d28", "#3b332e"], path: ["#4a4038", "#453b34"], stone: ["#4a403a", "#443a34"], wall: ["#2a2220", "#221b19"], water: ["#1a2a3a", "#1e3040"], tall: "#4a4034", tree: ["#2a2420", "#241e1a"], tint: "255,140,60", tintA: 0.08, fx: "sparks", dark: 0.06 },
      gallerie: { grass: ["#34302e", "#322e2c", "#383432"], path: ["#463e3a", "#403834"], stone: ["#4a423e", "#443c38"], wall: ["#2a2220", "#221b19"], water: ["#1a2a3a", "#1e3040"], tall: "#4a4034", tree: ["#2a2420", "#241e1a"], tint: "255,110,60", tintA: 0.09, fx: "sparks", dark: 0.08 },
      cisterne: { grass: ["#2a3836", "#283432", "#2e3c3a"], path: ["#364846", "#324240"], stone: ["#3a4a48", "#344442"], wall: ["#1c2a2a", "#162222"], water: ["#1a5a5a", "#1e6464"], tall: "#2a4a44", tree: ["#1c3a34", "#16302a"], tint: "80,220,190", tintA: 0.09, fx: "float", dark: 0.08 },
      tribuna: { grass: ["#3e382e", "#3a342a", "#423c32"], path: ["#544a38", "#4e4434"], stone: ["#5a4e3a", "#544834"], wall: ["#2e2618", "#261f14"], water: ["#3a3220", "#40381e"], tall: "#5a4a2a", tree: ["#3a3020", "#30281a"], tint: "255,210,100", tintA: 0.1, fx: "sparks", dark: 0.06 },
    },
    floors: "", solid: "PSEUXYZOKMANJIG",
    // pavimenti a lastre di pietra, disegnati a mano (anche sotto gli oggetti: lo usa K.ground)
    floorPaint(K, f, sx, sy, tx, ty) {
      if (f !== "," && f !== ":" && f !== "+" && f !== "=") return false;
      const z = K.api.trZone() || "", pal = /p2$/.test(z) ? ["#2e3c3a", "#26322f", "#3c4e4a", "#1e2826"] : /p3$/.test(z) ? ["#4a4030", "#3c3326", "#5e523c", "#2a2418"] : /p1$/.test(z) ? ["#3a3430", "#2e2926", "#4a423c", "#201c1a"] : ["#3a322d", "#2e2824", "#4a403a", "#201a17"];
      const h = K.hash(tx * 31 + ty * 17), c = pal[0], d = pal[1], l = pal[2], k = pal[3], P = K.P;
      P(sx, sy, 16, 16, f === ":" ? d : c); P(sx, sy + 15, 16, 1, k); P(sx + 15, sy, 1, 16, k); P(sx, sy, 16, 1, l); P(sx, sy, 1, 16, l);
      if (f === ":") { P(sx + 1, sy + 1, 14, 14, h % 2 ? c : "#3e352f"); P(sx + 1, sy + 1, 14, 1, l); } // lastroni
      for (let i = 0; i < 5; i++) P(sx + ((h >> (i * 3)) % 13) + 1, sy + ((h >> (i * 2 + 1)) % 13) + 1, 1, 1, i % 2 ? k : l);
      if ((h & 7) === 0) { P(sx + 3, sy + 6, 5, 1, k); P(sx + 7, sy + 7, 3, 1, k); P(sx + 9, sy + 8, 2, 1, k); }
      if (f === "=") { const fr = K.frNow(), a = 0.55 + 0.35 * Math.sin(fr / 14 + tx + ty); P(sx + 3, sy + 3, 10, 10, "rgba(255,122,26," + (a * 0.18) + ")"); P(sx + 7, sy + 3, 2, 10, "rgba(255,150,50," + a + ")"); P(sx + 3, sy + 7, 10, 2, "rgba(255,150,50," + a + ")"); P(sx + 5, sy + 5, 6, 1, "rgba(255,210,100," + a * 0.7 + ")"); K.light(sx + 8, sy + 8, 22, "255,130,40", 0.25 * a); }
      return true;
    },
    rest: { ch: "s", label: "Siediti al falò", text: "Ti siedi al falò del Campo Base. Il fuoco non ti chiede niente: è l'unico, qui sotto. (Il gioco salva da solo: qui puoi aprire il Registro della Brace.)" },
    texts: { chestOpen: "Apri la cassa.", chestEmpty: "Dentro c'è solo polvere di pietra e un biglietto: «Anche questa l'hanno già svuotata».", nothing: "Niente. Solo l'eco, che risponde con un secondo di ritardo.", noHero: "L'Ipogeo aspetta il suo Campione. Crea prima il tuo Campione." },
    journal: {
      name: "Il Registro della Brace", sub: "Discese, cadute, mitici incontrati e doni scoperti",
      html: (K) => {
        const f = (k) => K.F.get(k, 0) | 0, kinds = Object.keys(FOES), seen = kinds.filter((k) => K.F.is("dg_dk_" + k)), gs = Object.keys(window.__dungeon && window.__dungeon.GIFTS || {}).filter((id) => K.F.is("dg_gs_" + id)), last = [1, 2, 3, 4, 5].map((i) => K.F.get("dg_d" + i, "")).filter(Boolean);
        const nm = (k) => (window.__dungeon && window.__dungeon.KINDS && window.__dungeon.KINDS[k] ? window.__dungeon.KINDS[k].name : k);
        return `<p style="margin:6px 0"><b>Discese</b>: ${f("dg_runs")} · <b>cadute</b>: ${f("dg_morti")} · <b>stanze superate</b>: ${f("dg_stanze")} · <b>piani completati</b>: ${f("dg_vinte")}</p>` +
          `<p style="margin:6px 0"><b>Mitici battuti</b> (${seen.length}/${kinds.filter((k) => k !== "cenere").length})<br>${seen.length ? seen.filter((k) => k !== "cenere").map((k) => "✓ " + esc(nm(k))).join("<br>") : "<span style='opacity:.7'>Nessuno, per ora.</span>"}</p>` +
          `<p style="margin:6px 0"><b>Doni conosciuti</b> (${gs.length}/16)<br>${gs.length ? gs.map((id) => window.__dungeon.GIFTS[id].e + " " + esc(window.__dungeon.GIFTS[id].n)).join(" · ") : "<span style='opacity:.7'>Nessuno, per ora.</span>"}</p>` +
          `<p style="margin:6px 0"><b>Ultime cadute</b><br>${last.length ? last.map((k) => "☠ " + esc(nm(k))).join("<br>") : "<span style='opacity:.7'>Nessuna. Per ora.</span>"}</p>` +
          `<p style="margin:6px 0"><b>Finali</b><br>${K.mem().ends.length ? K.mem().ends.length + " trovati su 4" : "Nessuno, per ora."}</p>`;
        function esc(s) { return K.esc(s); }
      },
    },
    endings: {
      ultimo: ["L'ULTIMO FISCHIO", "Il torneo finisce davvero. L'Ipogeo si svuota di luce e diventa una cantina qualsiasi, con i muri un po' umidi. All'alba, due vecchi escono dallo Stadio Vecchio senza voltarsi, e il Campione porta con sé una sola cosa: il ricordo di ogni stanza.", "Serve decidere di chiudere il torneo, alla fine."],
      brace: ["IL CAMPO BASE NON CHIUDE MAI", "La brace resta accesa e il Campo Base resta aperto. Per la prima volta il dungeon ha un custode che sa quanto costa scendere. Ogni fine stagione, qualcuno bussa alla porta: «È aperto?». «Sempre», dice il Campione. «Ma prima, un po' di zuppa.»", "Serve decidere di restare, alla fine."],
      minuto: ["IL NOVANTUNESIMO MINUTO", "Tre persone giocano su un campo vero, all'alba, la finale di trent'anni fa. Finisce 1 a 1. Nessuno festeggia. Tutti ridono. Il minuto che mancava, finalmente, passa.", "Serve aver costruito fiducia con chi scende da più tempo di te."],
      senzafischio: ["LA PARTITA SENZA FISCHIO", "Per una notte non c'è arbitro, non c'è dungeon, non c'è punteggio. Giocano tutti: i mitici, i caduti, un fuoco piccolo piccolo. Nessuno ricorda chi ha vinto. Tutti ricordano il pallone che passava da mano a mano.", "Segreto: tutte le rune di brace e almeno tre cadute alle spalle."],
    },
    heroLook: () => ({ bg: ["#241810", "#ff7a1a"] }),
    heroTitle: (K) => ((K.F.get("dg_morti", 0) | 0) >= 5 ? "il Campione che ricorda tutto" : "il Campione di fine stagione"),
    act: { E: "Scendi la scalinata", U: "Risali al Campo Base", S: "Leggi i nomi", K: "Prega all'altare", X: "Apri la porta di ferro", Y: "Apri la porta di legno", Z: "Apri la porta di brace", O: "Apri la Porta Grande", M: "Guarda le macerie", N: "Guarda lo stendardo", A: "Guarda il braciere", J: "Guarda gli spalti", G: "Guarda le sbarre", P: "Guarda la colonna", T: "Guarda il tavolo", I: "Guarda la torcia" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = {
          M: "Macerie: un vecchio crollo. Tra i sassi c'è un pallone sgonfio, con scritto a penna «NON QUESTO».",
          N: "Uno stendardo con lo stemma del Torneo: una brace dentro un pallone. Sotto, ricamato in piccolo: «Fine Stagione. Ricomincia».",
          A: "Un braciere di bronzo, acceso da prima che nascessi. Fa un caldo onesto.",
          J: "Gli spalti dell'Ipogeo. Sono pieni di sagome grigie che applaudono in silenzio. Quando ti giri, applaudono più piano.",
          G: "Sbarre di ferro. Dietro, una cella con un solo pallone, appoggiato con cura in un angolo.",
          P: "Una colonna di pietra, con un'incisione: «Qui un difensore ha deciso di non uscire mai».",
          T: "Un tavolo di assi, segnato da mille bicchieri. Qualcuno ci ha scritto con il coltello: «Si riparte».",
          I: "Una torcia in un anello di ferro. Non si spegne mai, dicono. Nessuno ha provato a soffiarci.",
        }[ch];
        if (t) { K.say([["voce", t]]); return true; }
        if (ch === "E") { K.discesa(); return true; }
        if (ch === "U") { K.risali(); return true; }
        if (ch === "S") { K.lapide(); return true; }
        if (ch === "K") { K.altare(); return true; }
        if (ch === "X" || ch === "Y" || ch === "Z") { K.porta(ch === "X" ? 0 : ch === "Y" ? 1 : 2); return true; }
        if (ch === "O") { K.portaGrande(); return true; }
        return false;
      },
      // i cuori e i doni della discesa in corso, in alto a sinistra
      hud(g, zid, spec, K) {
        if (!K.F.is("dg_in")) return; const hp = K.F.get("dg_hp", 4) | 0, gs = K.gifts(), mx = K.maxHearts();
        g.save(); g.font = "800 9px system-ui"; const s = "♥".repeat(hp) + "♡".repeat(Math.max(0, mx - hp)), w = Math.max(40, g.measureText(s).width + 10 + gs.length * 11);
        g.fillStyle = "rgba(14,10,8,.82)"; g.fillRect(4, 4, w, 14); g.strokeStyle = "#ff7a1a"; g.lineWidth = 1; g.strokeRect(4.5, 4.5, w - 1, 13); g.fillStyle = "#ff5a4a"; g.fillText(s, 8, 14);
        const off = g.measureText(s).width + 12; g.font = "9px system-ui"; gs.forEach((id, i) => g.fillText(window.__dungeon.GIFTS[id] ? window.__dungeon.GIFTS[id].e : "?", off + i * 11, 14)); g.restore();
      },
    }],
    party: (K) => ((K.stepOf(1) | 0) >= 1 || (K.mem().ch | 0) > 1 ? ["dg_fiamma"] : []),
    musicMain: "dungeon",
    music: {
      // una marcia lenta in minore, con la brace che crepita (i piatti) e un basso che batte come un cuore
      dungeon: { bpm: 92, chords: ["Am", "F", "G", "Em", "Am", "F", "E", "Am"], lres: 2, lw: "sawtooth", lv: 0.035,
        lead: "A4 - - C5 | E5 - D5 C5 | B4 - - D5 | G5 - E5 D5 | A4 - - C5 | F5 - E5 D5 | E5 - G#4 B4 | A4 - - -",
        bass: "A2 . . A2 . . A2 .", bv: 0.13, arp: "", av: 0, drum: "k . . . s . . . k . . k s . . h", dv: 0.12 },
    },
    paint: (PA = {
      // MURO DI PIETRA: mattoni scuri, luce dall'alto, un po' di muschio nelle cisterne
      a(K, sx, sy, tx, ty) { const z = K.api.trZone() || "", cs = /p2$/.test(z), go = /p3$/.test(z), P = K.P; P(sx, sy, 16, 16, go ? "#241c10" : cs ? "#141e1e" : "#1c1615"); for (let r = 0; r < 4; r++) { const o = (r + tx) % 2 ? 0 : 4; for (let x = -4 + o; x < 16; x += 8) { P(sx + x + 1, sy + r * 4 + 1, 7, 3, go ? (r % 2 ? "#5a4a2e" : "#64532f") : cs ? (r % 2 ? "#2e4442" : "#34504c") : r % 2 ? "#443a36" : "#4a3f3a"); P(sx + x + 1, sy + r * 4 + 1, 7, 1, go ? "#8a7040" : cs ? "#4a6a64" : "#5c4e44"); } } if (cs && (tx * 7 + ty) % 4 === 0) { P(sx + 2, sy + 6, 4, 2, "#2a6a4a"); P(sx + 9, sy + 10, 5, 2, "#2a6a4a"); } if (ty > 0 && K.at(tx, ty + 1) !== "a") P(sx, sy + 15, 16, 1, "rgba(0,0,0,.5)"); },
      // TORCIA A MURO
      I(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P, f = Math.round(Math.sin(fr / 4 + tx) * 1.5); P(sx + 7, sy + 8, 2, 7, "#3a2a1a"); P(sx + 5, sy + 6, 6, 3, "#5a4a3a"); P(sx + 6, sy + 1 - f, 4, 6 + f, "#ff7a1a"); P(sx + 7, sy + 2 - f, 2, 4 + f, "#ffd23f"); P(sx + 7, sy + 4, 1, 2, "#fff6c0"); K.light(sx + 8, sy + 8, 52, "255,140,50", 0.5 + 0.08 * Math.sin(fr / 6 + tx)); },
      // COLONNA DI PIETRA con runa
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const P = K.P; P(sx + 2, sy + 14, 12, 2, "rgba(0,0,0,.4)"); P(sx + 3, sy + 1, 10, 14, "#5a4f46"); P(sx + 3, sy + 1, 3, 14, "#7a6c60"); P(sx + 11, sy + 1, 2, 14, "#3a322d"); P(sx + 2, sy, 12, 3, "#6a5c50"); P(sx + 2, sy + 13, 12, 2, "#4a4038"); const a = 0.5 + 0.4 * Math.sin(fr / 18 + tx * 2); P(sx + 7, sy + 5, 2, 5, "rgba(255,150,50," + a + ")"); P(sx + 6, sy + 7, 4, 1, "rgba(255,150,50," + a + ")"); },
      // FALÒ
      s(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const P = K.P, g = K.g; P(sx + 1, sy + 13, 14, 3, "rgba(0,0,0,.4)"); P(sx + 2, sy + 11, 12, 3, "#3a2414"); P(sx + 4, sy + 10, 8, 2, "#5a3a1c"); for (let i = 0; i < 4; i++) { const h = 6 + Math.abs(Math.sin(fr / 5 + i * 1.7)) * 6; P(sx + 3 + i * 3, sy + 11 - h, 3, h, i % 2 ? "#ff9a2a" : "#ff6a1a"); P(sx + 4 + i * 3, sy + 11 - h * 0.6, 1, h * 0.6, "#ffe08a"); } for (let i = 0; i < 3; i++) P(sx + 4 + ((fr / 3 + i * 5) % 8), sy - ((fr / 2 + i * 7) % 12), 1, 1, "rgba(255,200,100,.9)"); K.light(sx + 8, sy + 6, 110, "255,130,40", 0.65 + 0.1 * Math.sin(fr / 5)); void g; },
      // BRACIERE decorativo
      A(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const P = K.P; P(sx + 3, sy + 7, 10, 3, "#5a4a3a"); P(sx + 5, sy + 10, 6, 5, "#4a3a2a"); P(sx + 3, sy + 14, 10, 2, "#3a2a1a"); for (let i = 0; i < 3; i++) { const h = 3 + Math.abs(Math.sin(fr / 5 + i * 2)) * 4; P(sx + 4 + i * 3, sy + 7 - h, 3, h, i === 1 ? "#ffd23f" : "#ff7a1a"); } K.light(sx + 8, sy + 5, 60, "255,140,50", 0.5); },
      // LAPIDE: i nomi dei caduti
      S(K, sx, sy, tx, ty) { K.paint("a", sx, sy, tx, ty); const P = K.P, n = (K.F.get("dg_morti", 0) | 0); P(sx + 1, sy + 1, 14, 14, "#2a2420"); P(sx + 2, sy + 2, 12, 12, "#4a4038"); for (let i = 0; i < 4; i++) { const on = tx * 4 + i < n * 1 + 3; P(sx + 3, sy + 3 + i * 3, on ? 10 - (i * 3 + tx) % 4 : 5, 1, on ? "#a89c88" : "#6a5e50"); } if (tx % 2 === 0) { P(sx + 11, sy + 10, 2, 3, "#ff7a1a"); } },
      // SCALINATA CHE SCENDE
      E(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const P = K.P; P(sx, sy, 16, 16, "#0c0908"); for (let i = 0; i < 5; i++) { P(sx + 1, sy + 1 + i * 3, 14, 2, ["#6a5c50", "#544840", "#443a34", "#342c28", "#241e1a"][i]); P(sx + 1, sy + 3 + i * 3, 14, 1, "#150f0d"); } P(sx, sy, 16, 1, "#7a6a5c"); P(sx + 7, sy + 13, 2, 2, "rgba(255,122,26," + (0.4 + 0.3 * Math.sin(fr / 12)) + ")"); K.light(sx + 8, sy + 12, 30, "255,100,30", 0.3); },
      // SCALE CHE SALGONO
      U(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P; P(sx + 1, sy + 3, 14, 12, "#0c0908"); for (let i = 0; i < 4; i++) { P(sx + 2, sy + 12 - i * 3, 12, 2, ["#6a5c50", "#7a6c60", "#8a7c70", "#9a8c80"][i]); } P(sx + 6, sy + 2, 4, 2, "rgba(255,230,160," + (0.5 + 0.3 * Math.sin(fr / 10)) + ")"); K.light(sx + 8, sy + 4, 26, "255,220,150", 0.3); },
      // ALTARE DEI DONI
      K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const P = K.P, used = K.F.is("dg_alt"), on = !used && K.F.is("dg_in"), a = 0.5 + 0.4 * Math.sin(fr / 8); P(sx + 1, sy + 13, 14, 3, "rgba(0,0,0,.4)"); P(sx + 2, sy + 8, 12, 6, "#5a4f46"); P(sx + 2, sy + 8, 12, 1, "#8a7c70"); P(sx + 4, sy + 6, 8, 3, "#6a5c50"); P(sx + 5, sy + 4, 6, 3, "#2a2018"); if (on) { P(sx + 6, sy + 1, 4, 4, "rgba(255,160,40," + a + ")"); P(sx + 7, sy - 1, 2, 3, "rgba(255,230,140," + a + ")"); K.light(sx + 8, sy + 4, 50, "255,150,40", 0.6); } else { P(sx + 7, sy + 3, 2, 2, "#3a3028"); } },
      // PORTE: ferro, legno, brace (la porta si illumina se c'è una discesa in corso)
      X(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P, on = K.F.is("dg_in"); P(sx + 1, sy + 1, 14, 15, "#16100f"); P(sx + 2, sy + 2, 12, 14, "#6a7078"); P(sx + 2, sy + 2, 12, 2, "#8a9098"); for (let i = 0; i < 3; i++) { P(sx + 3, sy + 5 + i * 4, 10, 1, "#3a4048"); } for (let i = 0; i < 4; i++) P(sx + 3 + (i % 2) * 9, sy + 3 + (i >> 1) * 8, 1, 1, "#b0b8c0"); P(sx + 11, sy + 9, 2, 2, "#c8a040"); if (on) { P(sx + 5, sy + 6, 6, 1, "rgba(255,90,60," + (0.5 + 0.4 * Math.sin(fr / 10)) + ")"); K.light(sx + 8, sy + 8, 30, "255,100,60", 0.25); } },
      Y(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P, on = K.F.is("dg_in"); P(sx + 1, sy + 1, 14, 15, "#16100f"); P(sx + 2, sy + 2, 12, 14, "#8a5a32"); for (let i = 0; i < 4; i++) P(sx + 2 + i * 3, sy + 2, 1, 14, "#5a3a1c"); P(sx + 2, sy + 4, 12, 2, "#2a2018"); P(sx + 2, sy + 11, 12, 2, "#2a2018"); P(sx + 11, sy + 8, 2, 2, "#c8a040"); if (on) { P(sx + 5, sy + 7, 6, 1, "rgba(255,200,90," + (0.5 + 0.4 * Math.sin(fr / 10 + 1)) + ")"); K.light(sx + 8, sy + 8, 30, "255,190,80", 0.25); } },
      Z(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P, on = K.F.is("dg_in"), a = 0.5 + 0.4 * Math.sin(fr / 6); P(sx + 1, sy + 1, 14, 15, "#16100f"); P(sx + 2, sy + 2, 12, 14, "#4a1a10"); P(sx + 3, sy + 3, 10, 12, "#7a2a14"); P(sx + 7, sy + 4, 2, 10, "rgba(255,150,50," + (on ? a : 0.4) + ")"); P(sx + 4, sy + 8, 8, 2, "rgba(255,150,50," + (on ? a : 0.4) + ")"); P(sx + 6, sy + 6, 4, 6, "rgba(255,230,140," + (on ? a * 0.6 : 0.2) + ")"); if (on) K.light(sx + 8, sy + 8, 40, "255,110,30", 0.5); },
      // PORTA GRANDE: si apre (si illumina) dopo tre stanze
      O(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P, open = (K.F.get("dg_rm", 0) | 0) >= 3 && K.F.is("dg_in"), a = 0.6 + 0.4 * Math.sin(fr / 7); P(sx, sy + 1, 16, 15, "#100c0a"); P(sx + 1, sy + 2, 14, 14, open ? "#6a2a14" : "#2a2420"); P(sx + 1, sy + 2, 14, 2, open ? "#ffb04a" : "#4a4038"); P(sx + 7, sy + 2, 2, 14, "#0c0806"); P(sx + 2, sy + 6, 12, 2, open ? "rgba(255,200,80," + a + ")" : "#3a322d"); P(sx + 5, sy + 9, 6, 4, open ? "rgba(255,120,30," + a + ")" : "#1a1412"); if (open) K.light(sx + 8, sy + 8, 56, "255,150,40", 0.7); },
      // MACERIE
      M(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const P = K.P; P(sx + 1, sy + 12, 14, 4, "rgba(0,0,0,.35)"); [[2, 8, 6, 6], [7, 6, 7, 8], [4, 11, 5, 4], [10, 11, 5, 4]].forEach(([x, y, w, h], i) => { P(sx + x, sy + y, w, h, i % 2 ? "#4a4038" : "#5a4e44"); P(sx + x, sy + y, w, 1, "#7a6c60"); }); },
      // STENDARDO DEL TORNEO
      N(K, sx, sy, tx, ty, fr) { K.paint("a", sx, sy, tx, ty); const P = K.P, w = Math.round(Math.sin(fr / 22 + tx)); P(sx + 3, sy + 1, 10, 1, "#c8a040"); P(sx + 4, sy + 2, 8, 11 + w, "#7a1a14"); P(sx + 4, sy + 13 + w, 3, 2, "#7a1a14"); P(sx + 9, sy + 13 + w, 3, 2, "#7a1a14"); P(sx + 6, sy + 5, 4, 4, "#ffb04a"); P(sx + 7, sy + 4, 2, 2, "#ffe08a"); P(sx + 7, sy + 6, 2, 2, "#ff6a1a"); },
      // SPALTI con sagome di spettatori
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const P = K.P; P(sx, sy + 6, 16, 10, "#5a4a2e"); P(sx, sy + 6, 16, 1, "#8a7040"); P(sx, sy + 11, 16, 1, "#3a2e1a"); for (let i = 0; i < 4; i++) { const b = Math.round(Math.sin(fr / 20 + tx + i) * 1); P(sx + 1 + i * 4, sy + 1 + b, 3, 4, "rgba(190,200,215,.6)"); P(sx + 1 + i * 4, sy + 5 + b, 3, 3, "rgba(150,160,180,.55)"); } },
      // SBARRE
      G(K, sx, sy, tx, ty) { K.paint("a", sx, sy, tx, ty); const P = K.P; P(sx + 1, sy + 2, 14, 13, "#0c0908"); for (let i = 0; i < 5; i++) P(sx + 2 + i * 3, sy + 1, 1, 15, "#6a7078"); P(sx + 1, sy + 4, 14, 1, "#6a7078"); P(sx + 1, sy + 11, 14, 1, "#6a7078"); P(sx + 6, sy + 12, 4, 3, "#e8dcc4"); },
      // TAVOLO
      T(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const P = K.P; P(sx + 1, sy + 12, 14, 3, "rgba(0,0,0,.35)"); P(sx + 1, sy + 4, 14, 8, "#7a5a36"); P(sx + 1, sy + 4, 14, 1, "#a07a4a"); P(sx + 2, sy + 12, 2, 4, "#4a3420"); P(sx + 12, sy + 12, 2, 4, "#4a3420"); if ((tx + ty) % 2) { P(sx + 4, sy + 2, 3, 4, "#c8a040"); P(sx + 9, sy + 3, 4, 2, "#e8dcc4"); } else { P(sx + 5, sy + 3, 5, 3, "#cfc8b4"); P(sx + 6, sy + 2, 1, 1, "#ff7a1a"); } },
    }),
    guest: { id: "dg_mina", lines: [["dg_mina", "[ride] {n}! Ho preso la scala sbagliata e sono uscita qui. C'è il mare! (Annusa.) Un sacco di sale, poco fuoco. La zuppa di pesce è un'idea. Ma io la farei con più brace."]] },
    cameos: [
      { id: "rz_ferruccio", zone: "dg_campo", at: [24, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.razzo") || {}).done?.[1], lines: [["rz_ferruccio", "BIP. Ferruccio, corriere. Consegna per «Fiamma, Campo Base». Mittente: sconosciuto. Contenuto: un solo fiammifero. (Pausa.) Firma qui. No, lì. No, nel 3011."]] },
      { id: "cp_rosetta", zone: "dg_campo", at: [8, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.campana") || {}).done?.[1], lines: [["cp_rosetta", "[ride] Ho sentito dire che qui sotto si mangia male. Sono venuta a controllare. (Assaggia dal paiolo di Mina.) …Però! Non è male. Chiedile la ricetta, che io non le dico la mia."]] },
    ],
  });
  const K = E.K;
  if (pre) Object.defineProperties(E.api, Object.getOwnPropertyDescriptors(pre));
  K.paint = (ch, sx, sy, tx, ty) => PA[ch](K, sx, sy, tx, ty);
  // il piano del dungeon: stessa pianta per tutti (ingresso a sinistra con tre punti d'arrivo, tre porte in alto, Porta Grande a destra), arredi diversi
  const DEC = {
    1: { P: [[6, 5], [6, 13], [20, 5], [20, 13], [10, 14], [16, 5]], M: [[8, 13], [9, 13], [22, 5]], N: [[3, 1], [23, 1]], A: [[4, 17], [22, 17]], G: [[1, 13]], J: [[12, 17], [13, 17], [14, 17]], T: [[16, 14]] },
    2: { P: [[5, 6], [5, 12], [22, 6], [22, 12], [13, 5], [13, 14]], M: [[9, 15], [10, 15], [18, 4]], N: [[4, 1], [22, 1]], A: [[3, 17], [24, 17]], G: [[1, 5], [1, 13]], J: [[11, 17], [12, 17]], T: [[19, 14]] },
    3: { P: [[6, 4], [6, 14], [21, 4], [21, 14], [11, 6], [15, 12]], M: [[24, 12]], N: [[2, 1], [5, 1], [21, 1], [25, 1]], A: [[2, 17], [25, 17], [13, 4]], G: [[1, 5]], J: [[8, 17], [9, 17], [10, 17], [16, 17], [17, 17], [18, 17]], T: [[9, 13]] },
  };
  K.pianoZone = (n, o) => {
    const pi = PIANI[n], reg = n === 2 ? "cisterne" : n === 3 ? "tribuna" : "gallerie";
    return Object.assign({
      region: reg, name: "Dungeon di Fine Stagione · " + pi.n, short: pi.n.replace(/^(Le|La|Il) /, ""), sub: "Tre porte, tre stanze, una Porta Grande", bg: pi.bg, time: "notte", w: 28, h: 19, start: pi.entry[0], travel: pi.entry[0],
      buio: n === 2 ? 0.42 : n === 3 ? 0.3 : 0.34, heroLight: 3.4,
      luci: () => { const on = F.is("dg_in"); return [[6, 1, 3, "255,150,60"], [10, 1, 3, "255,150,60"], [15, 1, 3, "255,150,60"], [20, 1, 3, "255,150,60"], [4, 17, 2.6, "255,140,50"], [22, 17, 2.6, "255,140,50"], [1, 9, 3, "255,220,150"], [27, 9, on && (F.get("dg_rm", 0) | 0) >= 3 ? 4 : 2, "255,150,40"], ...(on ? [[8, 1, 2.4, "200,210,230"], [13, 1, 2.4, "255,200,90"], [18, 1, 2.4, "255,110,40"]] : [])]; },
      flavor: { t: "Un tavolo scheggiato. Sopra, un bicchiere di terracotta e un biglietto: «Brindisi rimandato».", l: "Una torcia che sfrigola. Il fumo sale e non sa più dove andare." },
      build(L) {
        const { lay, put } = L, D = DEC[n];
        lay(0, 0, 27, 0, "a"); lay(0, 18, 27, 18, "a"); lay(0, 0, 0, 18, "a"); lay(27, 0, 27, 18, "a");
        lay(3, 9, 26, 9, ":"); lay(12, 8, 14, 10, "=");
        put(8, 1, "X"); put(13, 1, "Y"); put(18, 1, "Z"); [6, 10, 15, 20].forEach((x) => put(x, 1, "I")); put(27, 9, "O"); put(1, 9, "U"); put(24, 15, "K");
        Object.keys(D).forEach((ch) => D[ch].forEach(([x, y]) => put(x, y, ch)));
        if (n === 2) lay(15, 11, 19, 12, "w");
        if (o && o.extra) o.extra(L);
      },
    }, o && o.spec);
  };
  K.PIANI = PIANI; K.FOES = FOES; K.hooks = {};

  // ------------------------------------------------------------------ la discesa (run)
  const F = K.F, esc = K.esc, geng = () => window.__dungeon;
  K.gifts = () => { const n = F.get("dg_ng", 0) | 0, out = []; for (let i = 1; i <= Math.min(n, 8); i++) { const id = F.get("dg_g" + i, ""); if (id) out.push(id); } return out; };
  K.addGift = (id) => { const n = (F.get("dg_ng", 0) | 0) + 1; if (n <= 8) { F.set("dg_g" + n, id); F.set("dg_ng", n); } F.set("dg_gs_" + id, true); };
  K.maxHearts = () => { const m = geng() && geng().mods ? geng().mods(K.gifts(), null).maxHearts : 4; return m; };
  K.inRun = () => F.is("dg_in");
  K.runClear = () => { ["dg_in", "dg_pn", "dg_rm", "dg_hp", "dg_alt"].forEach((k) => F.set(k, 0)); for (let i = 1; i <= 8; i++) F.set("dg_g" + i, ""); F.set("dg_ng", 0); };
  K.runStart = (p, skip, then) => {
    K.runClear(); F.set("dg_in", 1); F.set("dg_pn", p); F.set("dg_rm", skip ? 1 : 0); F.set("dg_hp", 4); F.set("dg_sd", 1 + Math.floor(Math.random() * 9000)); F.add("dg_runs", 1);
    const go = () => { const sd = (F.get("dg_sd", 0) | 0) % 3, e = PIANI[p].entry[sd]; K.go(PIANI[p].zone, e[0], e[1]); if (then) then(); };
    if (p > 1) return geng().pickGift({ have: [], seed: F.get("dg_sd", 1), title: "Un dono della scorciatoia", min: "r" }, (id) => { K.addGift(id); go(); });
    go();
  };
  // porte della stanza numero rm del piano p: tre stanze diverse, con il premio in vista (stesso seme = stesse porte)
  K.doorsFor = (p, rm) => {
    const sd = F.get("dg_sd", 1) | 0, r = (() => { let s = (K.hash("dgd" + sd + "-" + p + "-" + rm) || 1) >>> 0; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; })();
    const pool = PIANI[p].pool.slice(), kinds = []; while (kinds.length < 3) { if (!pool.length) pool.push(...PIANI[p].pool); kinds.push(pool.splice(Math.floor(r() * pool.length), 1)[0]); }
    const prizes = ["dono", "raro", "cuore", "monete"], dn = Math.floor(r() * 3);
    return kinds.map((k, i) => ({ kind: k, layout: (window.__dungeon.KINDS[k].layouts || ["pilastri"])[Math.floor(r() * window.__dungeon.KINDS[k].layouts.length)], prize: i === dn ? "dono" : prizes[Math.floor(r() * 4)], piano: p, i }));
  };
  K.porta = (i) => {
    if (!F.is("dg_in")) { // senza discesa in corso: si comincia da qui
      return K.ask("voce", `Le porte sono chiuse con tre sigilli di brace. Per riaprirle serve una discesa dal Campo Base. Cominci qui una discesa nuova da ${PIANI[zonePiano()].n}?`, [{ label: "Comincia la discesa", sub: "Parti con 4 cuori e nessun dono", cls: "hot", fn: () => { K.runClear(); F.set("dg_in", 1); F.set("dg_pn", zonePiano()); F.set("dg_rm", 0); F.set("dg_hp", 4); F.set("dg_sd", 1 + Math.floor(Math.random() * 9000)); F.add("dg_runs", 1); K.done(); } }, { label: "Non ancora", fn: K.done }]);
    }
    const p = F.get("dg_pn", 1) | 0, rm = F.get("dg_rm", 0) | 0;
    if (rm >= 3) return K.say([["voce", "Le tre porte sono già aperte e vuote: hai superato le stanze di questo piano. Resta la Porta Grande."]]);
    const d = K.doorsFor(p, rm)[i], KD = geng().KINDS[d.kind];
    K.ask("voce", `<b>Porta di ${PORTE[i][0]}</b> ${PORTE[i][2]} · stanza ${rm + 1} di 3<br>Dietro: <b>${esc(KD.name)}</b> ${KD.e}<br><span style="color:var(--dim)">${esc(KD.hint)}</span><br>Premio: ${PREMI[d.prize][1]} ${PREMI[d.prize][0]}.`, [
      { label: `Entra: ${KD.name}`, sub: "Partita originale · le Stanze dell'Ipogeo", cls: "hot", fn: () => K.roomRun(d) },
      { label: "Guarda le altre porte", fn: K.done },
    ], PIANI[p].bg);
  };
  const zonePiano = () => { const z = K.api.trZone(); return z === "dg_p3" ? 3 : z === "dg_p2" ? 2 : 1; };
  K.portaGrande = () => {
    if (!F.is("dg_in")) return K.say([["voce", "La Porta Grande è chiusa. Dietro, qualcosa respira. Prima serve una discesa dal Campo Base."]]);
    const p = F.get("dg_pn", 1) | 0, rm = F.get("dg_rm", 0) | 0;
    if (rm < 3) return K.say([["voce", `La Porta Grande ha tre sigilli, e ${rm === 0 ? "nessuno è ancora sciolto" : rm === 1 ? "uno solo è sciolto" : "due sono sciolti"}. Ogni stanza superata ne scioglie uno.`]]);
    const KD = geng().KINDS[PIANI[p].boss], H = K.hooks[p] || {};
    K.ask("voce", `<b>La Porta Grande</b> · ${esc(PIANI[p].n)}<br>I sigilli sono sciolti. Dietro: <b>${esc(KD.name)}</b> ${KD.e}<br><span style="color:var(--dim)">${esc(KD.hint)}</span>`, [
      { label: "Entra nella stanza grande", sub: "Partita importante · le Stanze dell'Ipogeo", cls: "hot", fn: () => (H.pre ? H.pre(() => K.roomRun({ kind: PIANI[p].boss, boss: true, piano: p, layout: KD.layouts[0], prize: "dono" })) : K.roomRun({ kind: PIANI[p].boss, boss: true, piano: p, layout: KD.layouts[0], prize: "dono" })) },
      { label: "Non ancora", fn: K.done },
    ], PIANI[p].bg);
  };
  // gioca una stanza della discesa
  K.roomRun = (d) => {
    const h = K.hero() || {}, gifts = K.gifts(), KD = geng().KINDS[d.kind], p = d.piano, sd = F.get("dg_sd", 1) | 0, rm = F.get("dg_rm", 0) | 0;
    const intro = FOES[d.kind] && FOES[d.kind][0] ? FOES[d.kind][0] : "";
    K.ownMatch(geng().start, {
      title: KD.name, us: h.name || "Tu", usColor: "#ff7a1a", kind: d.kind, layout: d.layout, lvl: PIANI[p].lvl, seed: sd * 7 + rm * 3 + p, gifts, hearts: F.get("dg_hp", 4), intro, bg: PIANI[p].bg,
      opp: { name: KD.name, color: COL[d.kind], style: STILE[d.kind] || "equilibrata" }, hero: { name: h.name || "Tu" }, winTitle: d.boss ? "STANZA GRANDE SUPERATA!" : "STANZA SUPERATA!",
      done: (r) => {
        if (r && r.quit) { K.runClear(); return K.scene([["dg_fiamma", "[sorpreso] Hai lasciato la stanza! Va bene, va bene. Si risale. Nessuno ti segna la sconfitta, qui: la segno io, con il gesso."]], () => K.go("dg_campo", 14, 15), "dg_campo"); }
        if (r && r.win) return K.roomWon(d, r);
        K.runLost(d, r);
      },
    });
  };
  K.roomWon = (d, r) => {
    const p = d.piano, mx = (r.data && r.data.maxHearts) || 4, H = K.hooks[p] || {};
    F.add("dg_stanze", 1); F.set("dg_dk_" + d.kind, true);
    F.set("dg_hp", d.prize === "cuore" || d.boss ? mx : Math.min(mx, ((r.data && r.data.hearts) || 1) + 1));
    const line = FOES[d.kind] && FOES[d.kind][1] ? [["voce", FOES[d.kind][1]]] : [];
    if (d.boss) { F.set("dg_rm", 4); return H.won ? H.won(r, d) : K.pianoDone(p); }
    F.add("dg_rm", 1);
    let extra = "";
    if (d.prize === "monete" && (F.get("dg_mon", 0) | 0) < 20) { F.add("dg_mon", 1); extra = ` (+${K.coinsGive(8)} monete)`; }
    const after = () => { const rm = F.get("dg_rm", 0) | 0; K.scene([...line, ["dg_fiamma", rm >= 3 ? "[felice] Tre stanze! Si è sciolto l'ultimo sigillo. Senti? La Porta Grande ha cambiato voce." : ["[felice] Una stanza in meno! E noi in più. Prendiamo il fiato, poi la prossima porta.", "[ride] Ben fatto! Ho contato i tuoi cuori: sono ancora lì, più o meno.", "[furbo] Bel gioco di gambe. L'ho visto tutto, io, dalla tua spalla."][(rm + sdi()) % 3]]], () => K.enterZone(PIANI[p].zone), PIANI[p].bg); };
    if (d.prize === "cuore") return K.scene([["voce", "Dietro la porta c'era una fonte di brace: bevi, e ogni ammaccatura si chiude. I cuori sono di nuovo tutti."]], after, PIANI[p].bg);
    if ((F.get("dg_ng", 0) | 0) >= 8) return after();
    geng().pickGift({ have: K.gifts(), seed: sd2() + (F.get("dg_rm", 0) | 0), min: d.prize === "raro" ? "r" : "c", title: "Un dono dalla Brace" + extra }, (id) => { K.addGift(id); after(); });
  };
  const sd2 = () => (F.get("dg_sd", 1) | 0) * 13 + (F.get("dg_pn", 1) | 0), sdi = () => (F.get("dg_sd", 1) | 0) % 3;
  // si cade: l'ingresso, la memoria
  K.runLost = (d, r) => {
    const n = F.add("dg_morti", 1), ks = d.kind; for (let i = 5; i > 1; i--) F.set("dg_d" + i, F.get("dg_d" + (i - 1), "")); F.set("dg_d1", ks); F.set("dg_ult", ks); F.add("dg_k_" + ks, 1);
    if (n >= 3) F.set("dg_sc1", true);
    const same = (F.get("dg_k_" + ks, 0) | 0) >= 2;
    K.runClear();
    const KD = geng().KINDS[ks], H = K.hooks[d.piano] || {};
    const lines = [["voce", d.boss ? `<b>${esc(KD.name)}</b> ha vinto. Il fischio risuona lungo tutto l'Ipogeo. Il pavimento si fa liquido, e la scala si riavvolge verso l'alto.` : `<b>${esc(KD.name)}</b> ti ha battuto. Il pavimento si fa liquido: la scala si riavvolge verso l'alto e ti riporta all'ingresso.`], ["dg_fiamma", same ? "[pensa] Di nuovo loro. Ormai ti conoscono per nome. Questo, a pensarci, è quasi un onore." : n === 1 ? "[triste] Prima volta. Non ti preoccupare: all'inizio succede a tutti. Poi succede ancora, ma è diverso: sai già cosa aspettarti." : n >= 5 ? "[ride] Cinque cadute! Sei di casa. Se ci fosse una tessera fedeltà, avresti già un caffè gratis." : "[pensa] Ricomincia dall'ingresso. Ma ricordi: è l'unica cosa che qui non si perde."]];
    if (H.lost) lines.push(...H.lost(d, n));
    K.scene(lines, () => { K.go("dg_campo", 14, 15); }, "dg_campo");
  };
  K.pianoDone = (p) => { // dopo il boss del piano: se la storia è già andata avanti si può scendere ancora
    F.add("dg_vinte", 1); if (p === 1) F.set("dg_sc2", true); if (p === 2) F.set("dg_sc3", true);
    const maxP = Math.min(3, K.mem().ch | 0);
    if (p < 3 && maxP > p) return K.ask("voce", `<b>${esc(PIANI[p].n)}</b> è alle tue spalle. La scala continua verso il basso, e hai ancora i tuoi doni. Scendi?`, [
      { label: `Scendi a ${PIANI[p + 1].n}`, sub: "Tieni doni e cuori", cls: "hot", fn: () => { F.set("dg_pn", p + 1); F.set("dg_rm", 0); F.set("dg_alt", 0); const sd = (F.get("dg_sd", 0) | 0) % 3, e = PIANI[p + 1].entry[sd]; K.go(PIANI[p + 1].zone, e[0], e[1]); } },
      { label: "Risali al Campo Base", sub: "I doni restano qui", fn: () => { K.runClear(); K.go("dg_campo", 14, 15); } },
    ], PIANI[p].bg);
    K.runClear(); K.go("dg_campo", 14, 15);
  };
  K.risali = () => K.ask("voce", "Le scale tornano al Campo Base. Se risali, la discesa finisce: i doni restano qui sotto. Risali?", [{ label: "Risali", fn: () => { K.runClear(); K.go("dg_campo", 14, 15); } }, { label: "Resta", fn: K.done }], "dg_campo");
  K.discesa = () => {
    const m = K.mem(), opts = [], maxP = Math.min(3, m.ch | 0);
    if (F.is("dg_in")) { const p = F.get("dg_pn", 1) | 0; opts.push({ label: `Riprendi la discesa (${PIANI[p].n})`, sub: `${K.gifts().length} doni · ${F.get("dg_hp", 4)} cuori`, cls: "hot", fn: () => { const sd = (F.get("dg_sd", 0) | 0) % 3, e = PIANI[p].entry[sd]; K.go(PIANI[p].zone, e[0], e[1]); } }); }
    opts.push({ label: "Scendi dall'ingresso (Piano 1)", sub: "Discesa nuova: 4 cuori, nessun dono", cls: F.is("dg_in") ? "" : "hot", fn: () => K.runStart(1, false) });
    if (F.is("dg_sc1")) opts.push({ label: "Il passaggio del disperato", sub: "Piano 1 senza la prima stanza (lo conosce Fiamma)", fn: () => K.runStart(1, true) });
    if (F.is("dg_sc2") && maxP >= 2) opts.push({ label: "Scorciatoia: Piano 2", sub: "Salti il Piano 1 e parti con un dono raro", fn: () => K.runStart(2, false) });
    if (F.is("dg_sc3") && maxP >= 3) opts.push({ label: "Scorciatoia: Piano 3", sub: "Salti i primi piani e parti con un dono raro", fn: () => K.runStart(3, false) });
    opts.push({ label: "Resta al Campo Base", fn: K.done });
    K.ask("voce", `<b>La Scalinata</b><br>${(F.get("dg_runs", 0) | 0) ? `Discese: ${F.get("dg_runs", 0)} · cadute: ${F.get("dg_morti", 0)}.` : "Gradini di pietra, ripidi, che scendono nel buio. In fondo si vede un chiarore rosso."}`, opts, "dg_campo");
  };
  K.lapide = () => {
    const n = F.get("dg_morti", 0) | 0, last = [1, 2, 3, 4, 5].map((i) => F.get("dg_d" + i, "")).filter(Boolean), nm = (k) => (geng().KINDS[k] ? geng().KINDS[k].name : k);
    K.say([["voce", "Il Muro dei Caduti: nomi graffiati nella pietra, uno sopra l'altro, in mille calligrafie. Quasi tutti hanno aggiunto una battuta."], ["voce", n ? `In basso c'è un nome in più, fresco: <b>${esc(heroName())}</b>. Segnati: ${n} ${n === 1 ? "caduta" : "cadute"}.${last.length ? "<br>" + last.map((k) => "☠ " + esc(nm(k))).join("<br>") : ""}` : `C'è un posto libero in basso, con il tuo nome già inciso a metà: <b>${esc(heroName())}</b>. Qualcuno è sicuro di te. O pessimista.`]]);
  };
  // l'altare dei doni: una volta per discesa si può pregare per un dono in più
  K.altare = () => {
    if (!F.is("dg_in")) return K.say([["voce", "L'altare è spento. Si accende per chi scende con la Brace addosso."]]);
    if (F.is("dg_alt")) return K.say([["voce", "L'altare ha già dato quello che aveva, per questa discesa. La fiamma sul suo bordo si è ritirata."]]);
    if ((F.get("dg_ng", 0) | 0) >= 8) return K.say([["voce", "Le tue tasche sono piene di doni: l'altare non sa più dove metterne altri."]]);
    F.set("dg_alt", true); K.refreshZone();
    geng().pickGift({ have: K.gifts(), seed: sd2() * 3 + 77, min: "r", title: "L'altare risponde" }, (id) => { K.addGift(id); K.done(); });
  };
  // partita secondaria: si sceglie tra il motore nuovo (una stanza di allenamento) e le altre modalità
  K.dungeonMatch = (o, done) => {
    const h = K.hero() || {}, kd = (o && o.kind) || "scheletri", KD = geng().KINDS[kd];
    return K.ownMatch(geng().start, Object.assign({ title: KD.name, us: h.name || "Tu", usColor: "#ff7a1a", kind: kd, layout: KD.layouts[0], lvl: 1, gifts: [], hearts: 4, opp: { name: KD.name, color: COL[kd], style: STILE[kd] }, hero: { name: h.name || "Tu" } }, o, { done: (r) => { if (done) done(r); else K.done(); } }));
  };
  K.COL = COL; K.STILE = STILE; K.PORTE = PORTE;
  window.__dungeon = E.api;
})();
