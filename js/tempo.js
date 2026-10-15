// js/tempo.js - RONDINE 1938-2038 · configurazione della saga sul motore comune (js/saga-core.js)
// Saga AVVENTUROSA con nostalgia, nello spirito di «Ritorno al Futuro» e di «Chrono Trigger» (tutto scritto da noi): viaggio nel tempo
// tra tre epoche dello Stadio delle Rondini di Rondinara. 1938 in bianco e nero, 1978 anni '70, 2038 al neon. Lo stadio compie cent'anni
// e un sistema chiamato VAR Totale sta «revisionando» la sua storia: gol annullati all'indietro, foto che sbiadiscono.
// Novità di questa saga (oltre a quelle del motore comune):
//  - PALLA DEL TEMPO (js/pallatempo.js): la partita originale. Una partita sola giocata in tre epoche (un tempo per epoca): ciò che
//    fai nel passato (i SEGNI che attivi col pallone) cambia il campo nel futuro. Comando TEMPO per fermare gli avversari.
//  - IL PULLMAN E IL QUADRANTE (K.viaggia / K.quadrante): le stesse zone in tre epoche (motore comune: spec.eras con filtri bn/anni70);
//    l'Officina del Professor Quarzo sta fuori dal tempo, e da lì si parte.
//  - GLI OGGETTI DEL TEMPO: il seme, la foto, il fischietto si portano da un'epoca all'altra e cambiano ciò che trovi (K.F rt_*).
// Salvataggio proprio: ali-di-rondine.tempo. Ricompense: monete, cosmetici, titoli, vantaggi che valgono solo nelle partite della saga.
(function () {
  "use strict";
  if (window.__tempo || !window.__sagaCore) return;
  const TS = 16;
  const EPOCHE = { 2038: "", 1978: "1978", 1938: "1938" };
  const E = window.__sagaCore.create({
    id: "tempo", key: "ali-di-rondine.tempo", title: "Rondine 1938-2038", icon: "⏳", bg: "rt_titolo", chapters: 3,
    menuSub: "Viaggia fra tre epoche dello stadio: ciò che fai nel passato cambia il campo nel futuro",
    theme: { accent: "#ffb347", ink: "#f6efe0", paper: "rgba(22,18,34,.9)", font: "Georgia, serif", chipBg: "#241c34ee", chipBorder: "#ffb347" },
    stats: { vera: [-9, 9, 0, "Comprensione di Vera"], club: [0, 99, 0, "Calore del Club"] },
    item: ["Lancetta d'ottone", "Lancette d'ottone"],
    drawItem(g, x, y, i, f) { // una lancetta d'orologio d'ottone che luccica e gira piano
      g.save(); g.translate(x, y + Math.sin(f / 14 + i) * 1.4); g.rotate(f / 60 + i); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-1, 5, 2, 1);
      g.fillStyle = "#e8b83a"; g.beginPath(); g.moveTo(0, -7); g.lineTo(2, -1); g.lineTo(0, 1); g.lineTo(-2, -1); g.closePath(); g.fill(); g.fillStyle = "#a8781a"; g.fillRect(-0.5, 0, 1, 5); g.beginPath(); g.arc(0, 4, 1.6, 0, 7); g.fill();
      g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,240,180,${0.3 + 0.2 * Math.sin(f / 9 + i)})`; g.beginPath(); g.arc(0, -2, 5, 0, 7); g.fill(); g.restore();
    },
    stadium: { azPitch: "neon", cageField: 0, cageMut: "turbo", venue: { ads: [["RONDINARA 1938", "#2a6adf"], ["VAR TOTALE", "#ff46c8"], ["BAR DA INES", "#ffb347"], ["CINEMA EDEN", "#e8e4d4"]], crowd: ["#2a6adf", "#fff", "#ffb347", "#46f0ff", "#ff46c8"], ground: ["#12183a", "#161c44"], line: "#46f0ffcc", grid: "rgba(70,240,255,.08)", tint: "rgba(120,80,200,.08)", glow: "70,240,255", sky: ["#070a1c", "#241446"], wall: ["#1a1a4a", "#10102c"], fx: { spd: 1.04, fr: 0.99 } } },
    regions: {
      // 2038: neon, notte, tutto un po' lucido
      neon: { grass: ["#12183a", "#161c44", "#10153a"], path: ["#2a2f6a", "#262b62"], stone: ["#3a3f8a", "#343980"], wall: ["#1c1a4e", "#171648"], water: ["#ff46c8", "#e83ab8"], tall: "#1a2a6a", tree: ["#0a3a2a", "#14664a", "#1a8a60"], tint: "120,200,255", tintA: 0.07, fx: "sparks", dark: 0.1 },
      // 1978: arancione e marrone, polvere nel sole
      settanta: { grass: ["#6a8a3a", "#728f40", "#668434"], path: ["#b88a52", "#ae804a"], stone: ["#b0a080", "#a49474"], wall: ["#a8522a", "#9c4a24"], water: ["#3a8aa8", "#4494b2"], tall: "#7a8a3a", tree: ["#4a7a2a", "#5a8a32", "#6a9a3a"], tint: "255,170,80", tintA: 0.13, fx: "dust", dark: 0.04 },
      // 1938: grigi e ruvidi (il filtro bianco e nero fa il resto)
      trenta: { grass: ["#7a806a", "#7e846e", "#767c66"], path: ["#a8a090", "#9e9686"], stone: ["#8a8678", "#807c6e"], wall: ["#6a6258", "#5e564c"], water: ["#5a6a78", "#64747f"], tall: "#6a7060", tree: ["#4a5648", "#566452", "#606e5a"], tint: "230,230,220", tintA: 0.05, fx: "", dark: 0.08 },
      // l'Officina del Professor Quarzo, fuori dal tempo: ottone e lucine
      officina: { grass: ["#5a4632", "#54402e", "#5e4a36"], path: ["#8a6a42", "#80623c"], stone: ["#7a6a52", "#6e5e46"], wall: ["#3a2a40", "#32243a"], water: ["#4a7aa8", "#5484b2"], tall: "#6a7a4a", tint: "255,200,120", tintA: 0.12, fx: "dust", dark: 0.14 },
      // il Fischio di Mezzo: un lampione nel buio, stelle sotto i piedi
      limbo: { grass: ["#0a0a1e", "#0c0c24", "#08081a"], path: ["#2a2a5a", "#262652"], stone: ["#3a3a7a", "#343470"], wall: ["#14143a", "#10102e"], water: ["#46f0ff", "#38d8e8"], tall: "#14143a", tree: ["#14143a", "#1a1a4a", "#20205a"], tint: "160,140,255", tintA: 0.1, fx: "sparks", dark: 0.18 },
      regia: { grass: ["#1a0a2a", "#1e0c30", "#160824"], path: ["#3a1a5a", "#341652"], stone: ["#4a2a7a", "#442472"], wall: ["#240a3a", "#1e0832"], water: ["#46f0ff", "#38d8e8"], tall: "#3a1a5a", tint: "255,70,200", tintA: 0.09, fx: "", dark: 0.14 },
    },
    floors: "", solid: "OAPYUM",
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi. Da qualche parte un orologio fa tic, e tutto sembra possibile. (Il gioco salva da solo: qui puoi rileggere il Taccuino del Tempo.)" },
    texts: { chestOpen: "Apri la cassetta.", chestEmpty: "La cassetta è vuota. Resta un odore di naftalina, di olio e di cent'anni.", nothing: "Niente. Ma qui, in un altro anno, c'era qualcosa.", noHero: "Lo stadio compie cent'anni e vuole il suo Campione. Crea prima il tuo Campione.", chapters: "Tre epoche, un solo pallone. Le tracce restano: cambiano il finale." },
    journal: { name: "Il Taccuino del Tempo", sub: "Persone, tracce lasciate, oggetti del tempo, finali" },
    endings: {
      gol: ["IL GOL RESTA", "La Revisione si ferma. Le foto tornano nitide, il gol del Forestiero torna al suo posto e il Club compie cent'anni com'è giusto: un po' sgangherato, e vivo.", "Sempre possibile, alla fine."],
      cambia: ["LA STORIA CAMBIA", "Le tracce che hai lasciato restano: la Rondinara del domani è una Rondinara diversa, con un bosco accanto al campo e una Coppa che nessuno ha rubato. Non è la storia di prima. È meglio.", "Serve aver piantato il seme e aver spento l'Occhio, nel Capitolo 2."],
      centro: ["PALLA AL CENTRO", "Vera e il Campione riscrivono il VAR Totale: non annulla più i gol, li custodisce. La Moviola dei Bei Gol diventa il museo più visitato di Rondinara.", "Serve la comprensione di Vera (fiducia 2)."],
      forestiero: ["L'ULTIMO FORESTIERO", "Il Campione resta nel 1938. Nessuno saprà mai chi era: solo che, un pomeriggio d'ottobre, un forestiero con le scarpe strane ha segnato il primo gol del Club. E che aveva ragione.", "Serve aver detto a Dorino chi sei."],
      rondine: ["LA RONDINE TORNA", "Ogni primavera una rondine torna al suo nido sotto la tribuna, da cent'anni. Quell'anno il nido ha dentro un orologio piccolissimo che funziona. Il tempo, finalmente, si ricorda di essere gentile.", "Segreto: tutte e quattro le tracce, la foto, il seme, il fischietto, la fascia e la fiducia del Club."],
    },
    heroLook: (h, K) => ({ bg: ["#241c34", "#ffb347"], shirt: K.F.is("rt_maglia") ? "#1f5fbf" : h.shirt }),
    heroTitle: (K) => (K.F.is("rt_titolo") ? "il Forestiero" : K.ep() === 1938 ? "un forestiero" : "ospite d'onore del Centenario"),
    act: { q: "Entra", O: "Sali sul Pullman", A: "Guarda la vetrina", P: "Guarda il platano", Y: "Guarda il flipper", U: "Guarda il tabellone", M: "Guarda il banco", n: "Leggi il cartello", ">": "Vai al campo", "<": "Torna alla piazza", v: "Cambia zona", "^": "Cambia zona" },
    plugins: [{
      // ogni zona con epoche si mostra nell'epoca in cui sei adesso (le zone interne restano fuori dal tempo)
      enter(zid, spec, K) { if (spec.eras) K.F.set("era_" + zid, EPOCHE[K.ep()] || ""); },
      hud(g, zid, spec, K) {
        const ep = K.ep(), inv = [K.F.is("rt_seme") ? "🌱" : "", K.F.is("rt_frutto") ? "🍃" : "", K.F.is("rt_foto") ? "📷" : "", K.F.is("rt_fischio") ? "🎺" : ""].join(" ").trim();
        g.save(); g.font = "700 8px Georgia, serif"; const s = `⏳ ${ep}${inv ? "  " + inv : ""}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(22,18,34,.82)"; g.fillRect(4, 4, w, 13); g.fillStyle = ep === 1938 ? "#d8d0bc" : ep === 1978 ? "#ffb347" : "#46f0ff"; g.fillText(s, 9, 13.5); g.restore();
      },
    }],
    musicMain: "tempo",
    music: {
      // un tema che pulsa come un orologio, con un arpeggio di sintetizzatore e un controcanto di carillon
      tempo: { bpm: 108, chords: ["Am", "F", "C", "G", "Am", "F", "G", "E"], lres: 2, lw: "triangle", lv: 0.06,
        lead: "E5 - A5 - C6 - B5 - | A5 - F5 - A5 - C6 - | G5 - E5 - G5 - C6 - | B5 - D6 - B5 - G5 - | E5 - A5 - C6 - E6 - | F5 - A5 - C6 - A5 - | G5 - B5 - D6 - G6 - | E6 - - - B5 - - -",
        bass: "R . . R . . 5 .", bv: 0.1, arp: "R 3 5 8 5 3", aw: "square", av: 0.018, drum: "k . . . h . . . k . h . h . . .", dv: 0.08 },
      tempo38: { bpm: 96, chords: ["C", "G", "Am", "F", "C", "G", "F", "C"], lres: 2, lw: "sine", lv: 0.07,
        lead: "E5 . G5 . C6 - - . | D5 . G5 . B5 - - . | C5 . E5 . A5 - - . | A5 . F5 . A5 - - . | E5 . G5 . C6 . E6 . | D6 - B5 - G5 - - . | A5 - F5 - A5 - C6 - | C6 - - - - - - .",
        bass: "R . 5 . R . 5 .", bv: 0.09, arp: "", aw: "triangle", av: 0, drum: ". . . . . . . .", dv: 0 },
      tempo78: { bpm: 118, chords: ["Am", "Dm", "G", "C", "Am", "Dm", "E", "Am"], lres: 2, lw: "sawtooth", lv: 0.035,
        lead: "A5 - C6 E6 - D6 C6 - | A5 - D6 F6 - E6 D6 - | B5 - D6 G6 - F6 D6 - | C6 - E6 G6 - E6 C6 - | A5 - C6 E6 - D6 C6 - | F5 - A5 D6 - C6 A5 - | G#5 - B5 E6 - D6 B5 - | A5 - - - - - - -",
        bass: "R . R 5 . R 8 .", bv: 0.12, arp: "R 3 5", aw: "triangle", av: 0.02, drum: "k . h . s . h h k k h . s . h .", dv: 0.14 },
    },
    musicBg: { rt_1938: "tempo38", rt_1978: "tempo78" },
    paint: {
      // il Pullman Rondine: carro (1938), pullman a cuccetta (1978), navetta a levitazione (2038). In Officina è tutto insieme: un pullman con tre targhe
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, a = 0.5 + 0.4 * Math.sin(fr / 12 + tx);
        g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 3); g.fillStyle = "#2a6adf"; g.fillRect(sx, sy + 2, 16, 11); g.fillStyle = "#f4efe0"; g.fillRect(sx, sy + 8, 16, 2);
        if ((tx + ty) % 2) { g.fillStyle = "#1a2a5a"; g.fillRect(sx + 2, sy + 4, 5, 4); g.fillRect(sx + 9, sy + 4, 5, 4); } else { g.fillStyle = "#ffd23f"; g.fillRect(sx + 3, sy + 5, 10, 3); g.fillStyle = "#1a1a1a"; g.fillRect(sx + 4, sy + 5.5, 8, 0.8); }
        g.fillStyle = "#1a1a1a"; g.fillRect(sx + 2, sy + 12, 3, 3); g.fillRect(sx + 11, sy + 12, 3, 3);
        g.save(); g.globalCompositeOperation = "lighter"; K.glow(g, sx + 8, sy + 7, 14, "255,200,90", a * 0.28); g.restore();
      },
      // la vetrina dei trofei: legno e foto (1938), vetro e coppe (1978), ologramma (2038)
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, era = K.ZX.eraName, bad = !K.F.is("rt_foto_ok");
        if (era === "1938") { g.fillStyle = "#5a4630"; g.fillRect(sx + 1, sy - 4, 14, 19); g.fillStyle = "#e8e0c8"; g.fillRect(sx + 3, sy - 1, 10, 7); g.fillStyle = "#3a3a3a"; g.fillRect(sx + 4, sy, 8, 5); }
        else if (era === "1978") { g.fillStyle = "#8a5a2a"; g.fillRect(sx + 1, sy - 4, 14, 19); g.fillStyle = "rgba(190,230,255,.7)"; g.fillRect(sx + 3, sy - 2, 10, 14); g.fillStyle = "#ffd23f"; g.fillRect(sx + 5, sy + 2, 2, 5); g.fillRect(sx + 9, sy + 4, 2, 3); }
        else { g.fillStyle = "#1a2060"; g.fillRect(sx + 1, sy - 4, 14, 19); g.strokeStyle = "#46f0ff"; g.lineWidth = 1; g.strokeRect(sx + 1.5, sy - 3.5, 13, 18); g.fillStyle = `rgba(70,240,255,${bad ? 0.2 + 0.3 * Math.abs(Math.sin(fr / 6)) : 0.6})`; g.fillRect(sx + 3, sy - 1, 10, 10); if (bad) { g.fillStyle = "#ff46c8"; for (let i = 0; i < 4; i++) g.fillRect(sx + 3 + ((fr / 3 + i * 7) % 9), sy - 1 + i * 3, 2, 1); } }
      },
      // il platano: aiuola nel 1938, giovane albero nel 1978, albero antico (sano o morente) nel 2038
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const era = K.ZX.eraName, planted = K.F.is("rt_pianta"), sw = Math.sin(fr / 70) * 1.2;
        K.later((g, cx, cy) => {
          const x = tx * TS - cx + 8, y = ty * TS - cy + 14; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(x, y, era === "1978" ? 12 : 24, 6, 0, 0, 7); g.fill();
          if (era === "1938") { g.fillStyle = "#6a5a3a"; g.fillRect(x - 11, y - 5, 22, 8); g.fillStyle = "#4a3a22"; g.fillRect(x - 9, y - 4, 18, 5); if (planted) { g.fillStyle = "#5aa83a"; g.fillRect(x - 0.5, y - 12, 1.2, 8); g.fillRect(x - 3, y - 12, 3, 2); g.fillRect(x + 1, y - 10, 3, 2); } else { g.fillStyle = "rgba(255,240,180,.8)"; g.fillRect(x - 1, y - 3, 2, 2); } return; }
          if (era === "1978") { g.fillStyle = "#5a3e26"; g.fillRect(x - 2, y - 24, 4, 24); [[0, -30, 12], [-8, -24, 8], [8, -24, 8]].forEach(([dx, dy, r], i) => { g.fillStyle = ["#4a7a2a", "#5a8a32", "#3e6a24"][i]; g.beginPath(); g.arc(x + dx + sw, y + dy, planted ? r : 0, 0, 7); g.fill(); }); if (!planted) { g.fillStyle = "#4a3a22"; g.fillRect(x - 9, y - 4, 18, 5); } return; }
          if (planted) { g.fillStyle = "#4a3a2a"; g.beginPath(); g.moveTo(x - 9, y); g.quadraticCurveTo(x - 5, y - 26, x - 3, y - 46); g.lineTo(x + 3, y - 46); g.quadraticCurveTo(x + 5, y - 26, x + 9, y); g.fill(); [[0, -62, 30], [-24, -52, 20], [24, -52, 20], [-12, -76, 16], [14, -76, 16]].forEach(([dx, dy, r], i) => { g.fillStyle = ["#0e5a3a", "#14774a", "#0a4a30"][i % 3]; g.beginPath(); g.arc(x + dx + sw, y + dy, r, 0, 7); g.fill(); g.strokeStyle = `rgba(70,255,170,${0.4 + 0.2 * Math.sin(fr / 14 + i)})`; g.lineWidth = 1.4; g.stroke(); }); for (let i = 0; i < 9; i++) { g.fillStyle = "#c8ffe0"; g.fillRect(x - 26 + ((i * 13 + fr / 4) % 52), y - 40 - ((i * 17 + fr / 3) % 44), 1.5, 1.5); } }
          else { g.fillStyle = "#3a322a"; g.beginPath(); g.moveTo(x - 9, y); g.quadraticCurveTo(x - 7, y - 24, x - 3, y - 44); g.lineTo(x + 3, y - 44); g.quadraticCurveTo(x + 7, y - 24, x + 9, y); g.fill(); g.strokeStyle = "#3a322a"; g.lineWidth = 3; [[-14, -52], [14, -54], [-4, -60]].forEach(([dx, dy]) => { g.beginPath(); g.moveTo(x, y - 40); g.lineTo(x + dx, y + dy); g.stroke(); }); [[-12, -50], [10, -52]].forEach(([dx, dy]) => { g.fillStyle = "#5a7a3a"; g.beginPath(); g.arc(x + dx, y + dy, 5, 0, 7); g.fill(); }); }
        });
      },
      // il flipper del bar: luci a lampeggio
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3a1a5a"; g.fillRect(sx + 1, sy - 4, 14, 18); g.fillStyle = "#1a0a2a"; g.fillRect(sx + 3, sy - 2, 10, 9); for (let i = 0; i < 4; i++) { g.fillStyle = ["#ff5a5a", "#ffd23f", "#5aff8a", "#5ac8ff"][(i + (fr >> 3)) % 4]; g.fillRect(sx + 4 + (i % 2) * 5, sy - 1 + ((i * 3) % 6), 2, 2); } g.fillStyle = "#c8c8d0"; g.fillRect(sx + 3, sy + 9, 4, 1); g.fillRect(sx + 9, sy + 9, 4, 1); },
      // il tabellone elettronico e la sua console
      U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1a1a3a"; g.fillRect(sx + 1, sy - 3, 14, 16); g.fillStyle = "#0a0a1a"; g.fillRect(sx + 2, sy - 2, 12, 7); g.fillStyle = (fr >> 4) % 2 ? "#46f0ff" : "#ff46c8"; g.fillRect(sx + 4, sy, 3, 3); g.fillRect(sx + 9, sy, 3, 3); g.fillStyle = "#5a5a8a"; for (let i = 0; i < 4; i++) g.fillRect(sx + 3 + i * 3, sy + 8, 2, 2); },
      // il banco da lavoro di Quarzo: ingranaggi, lenti, una teiera
      M(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6a4a2a"; g.fillRect(sx, sy + 3, 16, 9); g.fillStyle = "#4a3018"; g.fillRect(sx, sy + 11, 16, 2); g.fillStyle = "#e8b83a"; g.beginPath(); g.arc(sx + 5, sy + 6, 3, 0, 7); g.fill(); g.fillStyle = "#6a4a2a"; g.beginPath(); g.arc(sx + 5, sy + 6, 1.2, 0, 7); g.fill(); g.fillStyle = "#c8c8d0"; g.fillRect(sx + 10, sy + 4, 4, 5); g.fillStyle = "rgba(255,240,180,.7)"; g.fillRect(sx + 11, sy + 5, 1, 1.5 + Math.sin(fr / 20) * 0.5); },
    },
    guest: { id: "rt_tilly", lines: [["rt_tilly", "[felice] Dal 2038, con una cartolina! Il Professor Quarzo dice che non si deve, ma io dico che una cartolina non ha mai cambiato la storia. …Dopo averlo detto ho controllato: forse una volta. Un po'."]] },
    cameos: [
      { id: "ep_ada", zone: "rt_piazzale", at: [3, 17], when: (K) => !!((K.otherSaga("ali-di-rondine.dopo") || {}).done || {})[1] && K.eraOf("rt_piazzale") === "1938", lines: [["ep_ada", "Ci siamo già viste? No? Strano. Nel '38 mi sembra sempre di aver già visto tutti. Ho vent'anni, sai. Da un po'."]] },
      { id: "rz_ferruccio", zone: "rt_piazzale", at: [27, 18], when: (K) => !!((K.otherSaga("ali-di-rondine.razzo") || {}).done || {})[1] && !K.eraOf("rt_piazzale"), lines: [["rz_ferruccio", "[felice] BIP. Corriere dal 3011, di passaggio. Il vostro tubo dei neon è carino. Il nostro è uguale, ma in ritardo di novecento anni."]] },
    ],
  });
  const K = E.K;
  // ------------------------------------------------------------ L'EPOCA IN CUI SEI
  // K.ep() restituisce 2038, 1978 o 1938. K.viaggia(ep) cambia epoca: le zone con epoche si mostrano nell'epoca nuova quando ci entri.
  K.EPOCHE = EPOCHE;
  K.ep = () => { const e = K.F.get("rt_ep", 2038) | 0; return EPOCHE[e] !== undefined ? e : 2038; };
  K.viaggia = (ep) => { K.F.set("rt_ep", EPOCHE[ep] !== undefined ? ep : 2038); K.tone(220, 0.9, "sawtooth", 0.05, 0, 880); K.tone(660, 0.6, "triangle", 0.04, 0.3, 110); };
  // le tracce lasciate nelle partite precedenti restano: il campo di oggi se le ricorda
  K.pre = () => ({ seme: K.F.is("rt_pianta"), pietra: K.F.is("rt_seg_pietra"), cavo: K.F.is("rt_seg_cavo"), idrante: K.F.is("rt_seg_idrante") });
  K.ricorda = (r) => { ((r && r.data && r.data.segni) || []).forEach((id) => { K.F.set("rt_seg_" + id, true); if (id === "seme") K.F.set("rt_pianta", true); }); };
  // vantaggi che valgono solo nelle partite di questa saga (mai nelle partite di storia, Carriera, base)
  K.vantaggi = () => ({ tempo: 2 + (K.F.is("rt_gettone") ? 1 : 0), fischio: K.F.is("rt_fischio") ? 1 : 0, bonus: { te: K.F.is("rt_orologio") ? 3 : 0 } });
  // la partita originale, con le tracce e i vantaggi della saga: K.palla({ eras, opp, … }, fine)
  K.palla = (o, fine) => {
    const h = (K.hero && K.hero()) || {}, v = K.vantaggi();
    return K.ownMatch(window.__pallatempo.start, Object.assign({ usColor: "#2a6adf", us: "Rondinara", hero: { name: h.name || "Tu" }, mate: { name: "Dorino" }, pre: K.pre(), tempo: v.tempo, fischio: v.fischio, bonus: v.bonus }, o, { done: (r) => { if (!r.quit) K.ricorda(r); if (r.data && r.data.varchi) K.F.add("rt_varchi", r.data.varchi); (fine || o.done || (() => {}))(r); } }));
  };
  window.__tempo = E.api;
})();
