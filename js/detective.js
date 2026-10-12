// js/detective.js - DETECTIVE DI CAMPO · configurazione della saga sul motore comune (js/saga-core.js)
// Giallo a puntate ispirato a Detective Conan, Sherlock e Ace Attorney. Tutto inventato.
// Nella Lega delle Città qualcuno trucca le partite. Il Campione, fermo per un infortunio al ginocchio, diventa l'assistente
// dell'ispettrice Agata Brina: eccentrica, distratta, geniale, suona la fisarmonica quando pensa.
// Novità di questa saga (oltre a quelle del motore comune):
//  - PROVE E «PRESENTA LA PROVA»: negli interrogatori si sceglie quale indizio mostrare (motore comune: K.present).
//  - LA MOVIOLA (js/moviola.js): la partita truccata si rivede come un vecchio nastro, si cercano i dettagli strani,
//    poi si RIGIOCA L'AZIONE CHIAVE sapendo cosa cercare.
//  - LA CITTÀ DI NOTTE: pioggia, insegne al neon che si riflettono sull'asfalto bagnato, uffici e spogliatoi in cui si entra.
//  - IL FIUTO: ogni deduzione giusta lo fa salire, ogni accusa sbagliata lo fa scendere. Conta per i finali.
// Partita originale: «Moviola». Salvataggio proprio: ali-di-rondine.detective. Ricompense: solo monete e cosmetici.
(function () {
  "use strict";
  if (window.__detective || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    id: "detective", key: "ali-di-rondine.detective", title: "Detective di Campo", icon: "🕵️", bg: "dc_citta", chapters: 3,
    menuSub: "indagini, prove, la Moviola e partite truccate",
    theme: { accent: "#d8b46a", ink: "#efe6d2", paper: "rgba(24,20,18,.88)", font: "Georgia, serif", chipBg: "#2a2622ee", chipBorder: "#b89a5a" },
    stats: { fiuto: [-9, 20, 0, "Fiuto da detective"], agata: [-9, 9, 0, "Fiducia di Agata"], lega: [0, 99, 0, "Pressione della Lega"] },
    travel: true,
    item: ["Bottone d'ottone", "Bottoni"],
    // musiche: jazz notturno in minore per la città, un'ostinata tesa per moviola, pedinamenti e confronti
    musicMain: "detective",
    music: {
      detective: { bpm: 86, spb: 12, chords: ["Dm", "Dm", "Gm", "A", "Dm", "Bb", "Gm", "A"], lres: 2, lw: "sawtooth", lv: 0.028,
        lead: "A4 - . D5 - F5 | E5 - - D5 - . | G5 - . Bb5 - A5 | G5 - - E5 - . | F5 - . A5 - D6 | C6 - Bb5 - A5 - | G5 - F5 - E5 - | C#5 - - - - -",
        bass: "R . . 3 . . 5 . . 8 . .", bv: 0.12, arp: "1 . . 5 . . 1 . . 5 . .", aw: "triangle", av: 0.02, drum: ". . h . h h . . h . h h", dv: 0.22 },
      detective_tesa: { bpm: 120, chords: ["Am", "Am", "F", "E"], lres: 2, lw: "square", lv: 0.03,
        lead: ". . . . E5 . . . | . . F5 . E5 . . . | . . . . C5 . D5 . | B4 - - - G#4 - - -",
        bass: "R . R . R . R . R . R . R . R .", bv: 0.1, arp: "1 . 5 . 8 . 5 . 1 . 5 . 8 . 5 .", aw: "triangle", av: 0.024, drum: "k . . h . . h . k . . h s . h .", dv: 0.3 },
    },
    guest: { id: "dc_nina", lines: [["dc_nina", "{n}! Nina Rotativa, cronaca sportiva. Sono qui per un servizio sui campetti di paese. Il vostro è il più bello che ho visto. Non scriverlo, però: gli altri si offendono."]] },
    cameos: [
      { id: "ve_selva", zone: "dc_caffe", at: [5, 8], when: (K) => !!(K.otherSaga("ali-di-rondine.vento") || {}).done?.[1], lines: [
        ["ve_selva", "{n}! Che ci fai qui, con la stampella? Io vendo aquiloni in città. Qui il vento c'è sempre, ma arriva solo dalle strade: gira gli angoli come un gatto."],
        ["ve_selva", "Il Gabbiano l'ho parcheggiato sul tetto del Grand Hotel. Non dirlo al portiere: secondo lui gli aquiloni sono «ospiti senza prenotazione»."]] },
      { id: "cr_aira", zone: "dc_stadio", at: [12, 20], when: (K) => !!(K.otherSaga("ali-di-rondine.cristalli") || {}).done?.[1], lines: [
        ["cr_aira", "Guerriero della Luce! …Cioè, {n}. Scusa, vizio di regno. Sono venuta a vedere la finale della Lega: da noi le partite si giocano con i Cristalli, qui con la pioggia."],
        ["cr_aira", "Un consiglio da una che ha visto un impero truccare le stelle: guarda sempre chi non guarda la partita. Il colpevole è quasi sempre in tribuna."]] },
      { id: "lb_virgola", zone: "dc_questura", at: [4, 9], when: (K) => !!(K.otherSaga("ali-di-rondine.libro-finali") || {}).done?.[1], lines: [
        ["lb_virgola", "Sono una virgola. Lo so, in Questura non se ne vedono molte. Agata mi ha chiamata per un interrogatorio: dice che i colpevoli parlano senza fermarsi, e serve qualcuno che li fermi."],
        ["dc_agata", "È bravissima. Ieri ha messo una pausa nel posto giusto e il sospettato ha confessato da solo. Per riempire il silenzio."]] },
    ],
    musicBg: { dc_moviola: "detective_tesa", dc_porto: "detective_tesa", dc_hotel: "detective_tesa" },
    regions: {
      citta: { grass: ["#3a3e44", "#40444a", "#363a40"], path: ["#2e3238", "#33373d"], stone: ["#5a5a5e", "#525256"], wall: ["#5a4a44", "#4e403a"], water: ["#1e2a3a", "#243246"], tall: "#3a5a3a", tree: ["#1f3a2a", "#2a4a34", "#3a5a40"], column: "#8a8478", tint: "200,170,255", tintA: 0.1, fx: "rain", dark: 0.3 },
      stadio: { grass: ["#3e5a3a", "#44603f", "#3a5636"], path: ["#4a4a4e", "#444448"], stone: ["#6a6a6e", "#626266"], wall: ["#6a6a72", "#5e5e66"], water: ["#2a4a6a", "#305474"], tall: "#4a6a3a", tint: "220,220,255", tintA: 0.08, fx: "rain", dark: 0.25 },
      porto: { grass: ["#3a4448", "#40484c", "#364044"], path: ["#5a5048", "#524840"], stone: ["#6a6a66", "#62625e"], wall: ["#4a4038", "#40362e"], water: ["#1a2a3a", "#203244"], tall: "#3a5a3a", tint: "180,200,230", tintA: 0.12, fx: "fog", dark: 0.32 },
      casa: { grass: ["#5a4a3a", "#544434", "#5e4e3e"], path: ["#6a5a4a", "#625242"], stone: ["#7a7a76", "#72726e"], wall: ["#8a7a68", "#7e6e5c"], water: ["#2a4a6a", "#305474"], tall: "#4a6a3a", tint: "255,220,170", tintA: 0.1, fx: "dust", dark: 0.2 },
    },
    floors: "_", solid: "ck",
    rest: { ch: "s", label: "Fermati alla stufa", text: "Ti scaldi le mani alla stufetta. Il ginocchio smette di pulsare. (Il gioco salva da solo: qui puoi rileggere il Taccuino.)" },
    texts: { chestOpen: "Apri il cassetto.", chestEmpty: "Il cassetto è vuoto. Qualcuno è passato prima di te.", nothing: "Niente di utile. Un detective però guarda lo stesso.", noHero: "L'ispettrice Brina cerca un assistente con gli occhi buoni. Prima crea il tuo Campione.", chapters: "Tre casi, una Lega. Le prove restano: cambiano il finale." },
    journal: { name: "Il Taccuino dell'Ispettrice", sub: "Persone, prove, deduzioni, finali" },
    endings: {
      chiuso: ["CASO CHIUSO", "Il colpevole confessa, la Lega cambia arbitri e le partite tornano pulite. Quasi tutte.", "Sempre possibile, alla fine."],
      pulita: ["LA LEGA PULITA", "Con tutte le prove sul tavolo, cade l'intero consiglio della Lega. Agata sorride per la prima volta.", "Servono tutte le prove e la piena fiducia di Agata."],
      vendetta: ["LA VENDETTA DI AGATA", "Agata ottiene la sua vendetta. Il caso si chiude, ma qualcosa in lei resta aperto.", "Lascia che sia Agata a decidere, quando è più arrabbiata."],
      campo: ["DI NUOVO IN CAMPO", "Il ginocchio regge. Nella finale pulita, il Campione torna in campo.", "Segreto: tanto fiuto, nessuna accusa sbagliata e tutte le moviole risolte."],
    },
    heroLook: (h, K) => ({ bg: ["#2a2622", "#d8b46a"], shirt: K.F.is("dc_impermeabile") ? "#6a5a4a" : h.shirt }),
    heroTitle: (K) => (K.F.is("dc_distintivo") ? "assistente dell'ispettrice" : "infortunato"),
    act: { c: "Guarda l'auto", k: "Guarda l'edicola", _: "Attraversa" },
    paint: {
      c(K, sx, sy, tx, ty, fr) { // un'auto parcheggiata sotto la pioggia (due tessere orizzontali: disegno dalla prima)
        K.ground(sx, sy, tx, ty); if (K.at(tx - 1, ty) === "c") return;
        const col = ["#8a2a2a", "#2a4a6a", "#4a5a3a", "#6a6a72"][(tx * 7 + ty) % 4];
        K.later((g, cx, cy) => { const sx = tx * TS - cx, sy = ty * TS - cy;
        g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 12, 28, 3); g.fillStyle = col; g.fillRect(sx + 1, sy + 5, 30, 8); g.fillRect(sx + 7, sy + 1, 16, 6); g.fillStyle = "#9ab0c8"; g.fillRect(sx + 9, sy + 2, 5, 4); g.fillRect(sx + 16, sy + 2, 5, 4);
        g.fillStyle = "#1a1a1a"; g.beginPath(); g.arc(sx + 7, sy + 13, 2.6, 0, 7); g.arc(sx + 25, sy + 13, 2.6, 0, 7); g.fill(); g.fillStyle = "#ffe8a0"; g.fillRect(sx + 29, sy + 7, 2, 2); K.light(sx + 31, sy + 8, 12, "255,230,160", 0.25); });
      },
      k(K, sx, sy, tx, ty, fr) { // l'edicola con i giornali che parlano della partita truccata
        K.ground(sx, sy, tx, ty); K.shadow(sx, sy, 8); const g = K.g;
        g.fillStyle = "#2a5a3a"; g.fillRect(sx + 1, sy, 14, 15); g.fillStyle = "#1a3a2a"; g.fillRect(sx, sy - 3, 16, 4); g.fillStyle = "#f2ead8"; for (let i = 0; i < 3; i++) g.fillRect(sx + 2 + i * 4.5, sy + 4, 3.5, 5); g.fillStyle = "#c0392b"; g.fillRect(sx + 2, sy + 4, 3.5, 1.2);
        K.light(sx + 8, sy + 3, 14, "255,240,200", 0.3);
      },
    },
    floorPaint(K, f, sx, sy, tx, ty) {
      if (f === "_") { K.floorPaint(":", sx, sy, tx, ty); K.P(sx + (tx % 2 ? 0 : 0), sy + 2, 16, 3, "rgba(230,230,220,.55)"); K.P(sx, sy + 8, 16, 3, "rgba(230,230,220,.55)"); return true; }
      if (f === ":" && K.ZX.rk !== "casa") { // asfalto bagnato: pozzanghere che riflettono le luci
        K.P(sx, sy, 16, 16, K.ZX.rg.path[(tx + ty) % 2]); const r = K.rnd(tx, ty, 3);
        if (r < 0.22) { const g = K.g, fr = K.frNow(); g.fillStyle = `rgba(${r < 0.08 ? "255,120,160" : r < 0.15 ? "120,200,255" : "255,220,140"},${0.18 + 0.06 * Math.sin(fr / 20 + tx)})`; g.beginPath(); g.ellipse(sx + 8, sy + 9, 6, 2.4, 0, 0, 7); g.fill(); }
        return true;
      }
      return false;
    },
    drawItem(g, x, y, i, f) { // un bottone d'ottone (di una divisa da arbitro?) che luccica nella pioggia
      const b = Math.sin(f / 12 + i) * 1; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(x, y + 4, 3.5, 1.2, 0, 0, 7); g.fill();
      g.fillStyle = "#c9a227"; g.beginPath(); g.arc(x, y - b, 3.4, 0, 7); g.fill(); g.fillStyle = "#8a6a10"; g.fillRect(x - 1.5, y - b - 0.8, 1, 1); g.fillRect(x + 0.5, y - b - 0.8, 1, 1); g.fillRect(x - 1.5, y - b + 0.8, 1, 1); g.fillRect(x + 0.5, y - b + 0.8, 1, 1);
      g.fillStyle = `rgba(255,255,220,${0.5 + 0.5 * Math.sin(f / 7 + i)})`; g.fillRect(x - 2, y - b - 2, 1.4, 1.4);
    },
  });
  const K = E.K;
  window.__detective = E.api;
  // insegna al neon che lampeggia (per le facciate: si usa nel decor delle zone)
  K.neon = (g, txt, x, y, col, i) => { const fr = K.frNow(), on = Math.sin(fr / 30 + (i || 0) * 2) > -0.7 || (fr + (i || 0) * 13) % 97 > 6; g.save(); g.font = "bold 8px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(10,8,12,.85)"; g.fillRect(x - w / 2, y - 9, w, 12); if (on) { g.globalCompositeOperation = "lighter"; g.shadowColor = `rgb(${col})`; g.shadowBlur = 8; } g.fillStyle = on ? `rgba(${col},1)` : "rgba(90,80,90,.8)"; g.textAlign = "center"; g.fillText(txt, x, y); g.restore(); if (on) K.light(x, y + 10, 26, col, 0.25); };
})();
