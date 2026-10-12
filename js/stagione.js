// js/stagione.js - STAGIONE INFINITA · configurazione della saga sul motore comune (js/saga-core.js)
// Saga SERIA, con ironia gentile. Ispirata alle storie di giorni che si ripetono (tutto inventato).
// Lago Lungo, ultima domenica di settembre: stasera la finale della Coppa del Lago, l'ultima al vecchio stadio «Il Lido»,
// che domani chiude. Al tramonto, qualunque cosa succeda, il nastro si riavvolge: ed è di nuovo domenica, alle otto.
// Novità di questa saga (oltre a quelle del motore comune):
//  - IL NASTRO (js/nastro.js): la partita originale, con un motore suo. La finale è una videocassetta che si ferma ai bivi;
//    gli avversari giocano sempre la stessa partita e i loro FANTASMI ti mostrano cosa hanno fatto nei giri precedenti.
//    La memoria della finale resta da una domenica all'altra.
//  - LA GIORNATA CHE SI RIPETE: quattro fasce (8:00, 12:00, 16:00, 19:00). I personaggi hanno i loro ORARI e stanno in posti
//    diversi a seconda dell'ora; l'orologio della piazza fa passare il tempo. Le cose del giorno (flag «d_») si cancellano
//    a ogni riavvolgimento, i RICORDI («mem_») restano. Il gatto, invece, ogni domenica è in un posto diverso.
//  - GRAFICA VHS: righe di scansione e codice temporale sulla città, e il riavvolgimento della cassetta (js/vhs.js, comune).
// Salvataggio proprio: ali-di-rondine.stagione. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__stagione || !window.__sagaCore) return;
  const TS = 16, ORE = ["08:00", "12:00", "16:00", "19:00"], FASCE = ["mattina", "mezzogiorno", "pomeriggio", "sera"], TOD = ["alba", "giorno", "tramonto", "notte"];
  const E = window.__sagaCore.create({
    id: "stagione", key: "ali-di-rondine.stagione", title: "Stagione Infinita", icon: "📼", bg: "sf_titolo", chapters: 3,
    menuSub: "La stessa domenica, ancora e ancora. Una finale su videocassetta, e i fantasmi delle partite già giocate",
    theme: { accent: "#e8c84a", ink: "#f0ece0", paper: "rgba(16,16,24,.9)", font: "'Courier New', monospace", chipBg: "#1a1a24ee", chipBorder: "#ff5a7a" },
    stats: { ada: [0, 99, 0, "Fiducia di Ada"], teo: [0, 99, 0, "Amicizia di Teo"] },
    travel: true,
    item: ["Biglietto del Lido", "Biglietti"],
    regions: {
      lago: { grass: ["#7a9a5a", "#80a060", "#749454"], path: ["#c8b898", "#c0b090"], stone: ["#b8b0a0", "#b0a898"], wall: ["#e8c8a0", "#dcbc94"], water: ["#3a7aa8", "#4484b2"], tall: "#6a8a4a", tree: ["#c8742a", "#d88a3a", "#a85a2a"], tint: "255,200,150", tintA: 0.08, fx: "leaves", dark: 0.04 },
      stadio: { grass: ["#4a8a3e", "#529446", "#46803a"], path: ["#a8a090", "#a09888"], stone: ["#9a9a98", "#949492"], wall: ["#6a6a7a", "#646474"], water: ["#3a7aa8", "#4484b2"], tall: "#3a7a2a", tree: ["#c8742a", "#d88a3a", "#a85a2a"], tint: "255,210,160", tintA: 0.08, fx: "", dark: 0.06 },
      casa: { grass: ["#8a6a4a", "#846444", "#906e4e"], path: ["#a88a6a", "#a08262"], stone: ["#c8b8a0", "#c0b098"], wall: ["#3a3a4a", "#343444"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "200,180,255", tintA: 0.12, fx: "dust", dark: 0.18 },
    },
    floors: "", solid: "QYR",
    rest: { ch: "s", label: "Siediti sulla panchina", text: "Ti siedi. Il lago fa lo stesso rumore di ieri, cioè di oggi. Una foglia cade, sempre la stessa, sempre alla stessa ora. (Il gioco salva da solo: qui puoi rileggere il Taccuino dei Giri.)" },
    texts: { chestOpen: "Apri la scatola.", chestEmpty: "La scatola è vuota. Domani sarà di nuovo piena. Cioè oggi.", nothing: "Niente. Ma hai la sensazione di averlo già visto.", noHero: "Lago Lungo aspetta la finale. Prima crea il tuo Campione.", chapters: "Tre capitoli, molte domeniche. I ricordi restano, il resto si riavvolge." },
    journal: { name: "Il Taccuino dei Giri", sub: "Ricordi, orari, fantasmi, finali" },
    endings: {
      lunedi: ["ED È LUNEDÌ", "La finale finisce, il sole tramonta, e questa volta il nastro non si riavvolge. La sveglia suona: lunedì, otto e un minuto. Il Lido chiude, la stagione pure. Ma ne comincia un'altra.", "Sempre possibile, alla fine."],
      teo: ["LA SQUADRA A DISTANZA", "Teo parte lo stesso, ma non di nascosto: la squadra lo accompagna alla stazione, cantando. Ogni domenica, da tre città diverse, giocano la stessa partita alla radio.", "Serve l'amicizia piena di Teo."],
      ada: ["IL CAMPO NEL PARCO", "Il Lido chiude, ma il campo resta: diventa un prato aperto, con due porte e una panchina con il nome di Ada. Lei la domenica ci va a fischiare i fuorigioco ai bambini dei vicini e ai cani.", "Serve la fiducia piena di Ada."],
      gatto: ["LA DOMENICA DEL GATTO", "Il gatto rosso, l'unico che ogni domenica era in un posto diverso, era quello che aspettava davvero: che qualcuno lo portasse a casa. Lo prendi in braccio. Fa le fusa. Ed è lunedì.", "Segreto: trova il gatto in tutti e quattro i suoi posti, una domenica diversa ciascuno."],
    },
    heroLook: (h, K) => ({ bg: ["#1a1a24", "#e8c84a"], shirt: K.F.is("mem_maglia") ? "#e8c84a" : h.shirt }),
    heroTitle: (K) => `giro ${giro(K)} · ${FASCE[ora(K)]}`,
    act: { q: "Entra", Q: "Guarda l'orologio della piazza", Y: "Guarda la fontana", R: "Guarda l'antenna della radio", ">": "Vai al Lido", "<": "Torna in piazza", v: "Esci" },
    zoneMenuExtra: (K) => [{ label: "🕰 Che ore sono?", sub: `${ORE[ora(K)]} · ${FASCE[ora(K)]} · giro ${giro(K)}`, fn: () => K.say([["voce", `Sono le <b>${ORE[ora(K)]}</b> (${FASCE[ora(K)]}). È la domenica numero <b>${giro(K)}</b>. ${ora(K) < 3 ? "L'orologio della piazza fa passare il tempo." : "È sera: la finale aspetta al Lido."}`]]) }],
    // righe di scansione da videocassetta su tutta Lago Lungo
    mood(g, fr) { g.fillStyle = "rgba(0,0,0,.06)"; for (let y = (fr >> 2) % 3; y < 200; y += 3) g.fillRect(0, y, 320, 1); },
    plugins: [{
      hud(g, zid, spec, K) { // il codice temporale della cassetta, in alto a destra
        const t = `DOM ${ORE[ora(K)]} · GIRO ${giro(K)}`; g.save(); g.font = "bold 8px 'Courier New', monospace"; const w = g.measureText(t).width + 18, x = 314 - w;
        g.fillStyle = "rgba(10,10,16,.7)"; g.fillRect(x, 22, w, 13); if (Math.floor(Date.now() / 700) % 2) { g.fillStyle = "#ff3a5a"; g.beginPath(); g.arc(x + 7, 28.5, 2.6, 0, 7); g.fill(); }
        [["#ff2a6a", -0.8], ["#2ad8ff", 0.8], ["#fff", 0]].forEach(([c, dx]) => { g.fillStyle = c; g.fillText(t, x + 13 + dx, 31.5); }); g.restore();
      },
      obj(ch, tx, ty, zid, spec, K) { if (ch !== "Q") return false; clockAsk(K); return true; },
    }],
    musicMain: "stagione",
    music: {
      // un tema malinconico da videocassetta: pianoforte (triangolo), basso lento, un carillon che si ripete
      stagione: { bpm: 84, chords: ["Am", "F", "C", "G", "Am", "F", "C", "E"], lres: 2, lw: "triangle", lv: 0.045,
        lead: "E5 - - C5 A4 - - - | F5 - E5 - C5 - - - | G5 - - E5 C5 - D5 - | B4 - - - - - - - | E5 - - C5 A4 - - C5 | F5 - A5 - G5 - F5 - | E5 - D5 - C5 - B4 - | E5 - - - - - - -",
        bass: "R . . . 5 . . . R . . . 5 . . .", bv: 0.09, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "sine", av: 0.018, drum: "k . . . . . h . k . . . . . h .", dv: 0.12 },
    },
    paint: {
      // l'orologio della piazza, su una colonna: le lancette seguono la fascia del giorno
      Q(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy; g.fillStyle = "#5a4a3a"; g.fillRect(x - 2, y - 6, 4, 22); g.fillStyle = "#f4ecdc"; g.beginPath(); g.arc(x, y - 12, 8, 0, 7); g.fill(); g.strokeStyle = "#2a1a10"; g.lineWidth = 1.2; g.stroke(); const h = [8, 12, 16, 19][ora(K)], a = ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2; g.beginPath(); g.moveTo(x, y - 12); g.lineTo(x + Math.cos(a) * 4.5, y - 12 + Math.sin(a) * 4.5); g.moveTo(x, y - 12); g.lineTo(x, y - 18); g.stroke(); }); },
      // la fontana della piazza
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#b8b0a0"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 8, 5, 0, 0, 7); g.fill(); g.fillStyle = "#4a8ab8"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 6, 3.5, 0, 0, 7); g.fill(); K.P(sx + 7, sy + 1, 2, 9, "#a8a090"); const s = Math.floor(fr / 6) % 3; K.P(sx + 5 - s, sy + 2 + s, 1, 1, "#c8e8ff"); K.P(sx + 10 + s, sy + 2 + s, 1, 1, "#c8e8ff"); },
      // l'antenna della radio, con la luce rossa «IN ONDA»
      R(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy + 14; g.strokeStyle = "#5a5a6a"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x, y - 30); g.lineTo(x + 5, y); g.moveTo(x - 3, y - 12); g.lineTo(x + 3, y - 12); g.moveTo(x - 2, y - 20); g.lineTo(x + 2, y - 20); g.stroke(); if (Math.floor(fr / 30) % 2) { g.fillStyle = "#ff3a3a"; g.beginPath(); g.arc(x, y - 31, 2, 0, 7); g.fill(); K.light(x, y - 31, 10, "255,60,60", 0.5); } }); },
    },
    cameos: [
      { id: "mg_tilde", zone: "sf_piazza", at: [30, 9], when: (K) => !!(K.otherSaga("ali-di-rondine.mantello") || {}).done?.[1], lines: [
        ["mg_tilde", "[pensa] {n}! Sono venuta per la finale. Mi sembra di essere già venuta. Ieri. O stamattina. Sarà l'età. (Ti guarda bene.) …O no?"],
        ["mg_tilde", "Un consiglio da sarta: se un giorno si ripete, è come un orlo scucito. Non serve rifarlo tutto: basta trovare il punto dove si è rotto il filo."]] },
      { id: "ts_iole", zone: "sf_stadio", at: [26, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.torneo") || {}).done?.[1], lines: [
        ["ts_iole", "Il Lido! Ci ho giocato una finale anch'io, quarant'anni fa. Chiude domani, dicono. Peccato. Gli stadi vecchi sanno un sacco di cose: bisogna solo starli a sentire."]] },
    ],
  });
  const K = E.K;
  function ora(k) { return Math.max(0, Math.min(3, +(k || K).F.get("ora", 0) || 0)); }
  function giro(k) { return Math.max(1, +(k || K).F.get("giro", 1) || 1); }
  function clockAsk(k) {
    const o = ora();
    if (o >= 3) return K.say([["voce", `L'orologio segna le <b>19:00</b>. È sera: la finale aspetta al Lido. (Al Lido, cerca il mister Bruno.)`]]);
    K.ask("voce", `L'orologio della piazza segna le ${ORE[o]}. Una lancetta trema un poco, come se avesse fretta di tornare indietro.`, [
      { label: `Aspetta fino alle ${ORE[o + 1]}`, sub: `Passa al ${FASCE[o + 1]}: i personaggi cambiano posto`, big: true, fn: () => { setOra(o + 1); K.done(); } },
      { label: "Resta ancora un po'", fn: () => K.done() },
    ]);
  }
  function setOra(n) { K.F.set("ora", Math.max(0, Math.min(3, n))); K.refreshZone(); }
  // il riavvolgimento: si cancella tutto ciò che è del giorno («d_»), restano i ricordi («mem_») e la memoria della finale
  function rewindDay(then) {
    const m = K.mem(); Object.keys(m.flags).forEach((k) => { if (k.indexOf("d_") === 0) K.F.set(k, false); });
    const n = giro() + 1; K.F.set("giro", n); K.F.set("ora", 0);
    const go = () => { K.go("sf_piazza", 18, 16); if (then) setTimeout(then, 60); };
    if (window.__vhs) window.__vhs.rewind({ from: "19:00", to: "08:00", label: "DOM", sub: `DOMENICA · GIRO ${n}`, line: "Di nuovo." }, go); else go();
  }
  // la memoria della finale (i piani visti dagli avversari), nei flag «nm_»
  function nastroMem() { const m = K.mem(), out = {}; Object.keys(m.flags).forEach((k) => { const mt = k.match(/^nm_(\d+)_(\d+)$/); if (mt && m.flags[k]) out[`${mt[1]}:${mt[2]}`] = String(m.flags[k]).split("").map(Number); }); return out; }
  function saveNastro(mem) { Object.keys(mem || {}).forEach((k) => { const [a, b] = k.split(":"); K.F.set(`nm_${a}_${b}`, (mem[k] || []).join("")); }); }
  // dove sta il gatto: ogni domenica in un posto diverso
  const GATTO = [["sf_piazza", [31, 16]], ["sf_videoteca", [15, 8]], ["sf_stadio", [4, 4]], ["sf_piazza", [25, 22]]];
  function gattoNpc(zid) { const [z, at] = GATTO[(giro() - 1) % 4]; return z === zid ? [{ id: "sf_gatto", at }] : []; }
  Object.assign(K, { ora: () => ora(), giro: () => giro(), setOra, rewindDay, nastroMem, saveNastro, gattoNpc, ORE, FASCE, TOD, GATTO });
  window.__stagione = E.api;
})();
