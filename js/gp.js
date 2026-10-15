// js/gp.js - GRAN PREMIO DEL PALLONE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA e VELOCE, nello spirito di «Mario Kart», «Rocket League» e «Cars» (tutto scritto da noi): a Palladoro il campionato
// unisce le gare e le partite. Ogni giro si chiude in area con un tiro, ogni tappa è una partita. Il Campione guida per l'Officina Bullone.
// Novità di questa saga (oltre a quelle del motore comune):
//  - GIRO E GOL (js/giroegol.js): la partita originale. Strada in pseudo-3D con curve, cartelloni e scia di velocità; la velocità
//    con cui entri in area (la curva-cancello) è la potenza del tiro. Turbo, mira, coni, olio, un rivale da superare.
//  - LA RONDINELLA, IL VEICOLO NEL MONDO CAMMINABILE (cfg.pass + cfg.heroFx + plugin top): in macchina si salta i fossati (tessera w)
//    e si lascia una scia; non si scende sopra un fossato. Raggiunge anche il Giardino dei Trofei, nascosto.
//  - IL BOX (K.gomme): la scelta delle gomme (grip / velocità / miste) cambia sterzo e velocità in Giro e Gol, e le riparazioni.
// Salvataggio proprio: ali-di-rondine.gp. Ricompense: monete, cosmetici, titoli, vantaggi che valgono solo nelle gare della saga.
(function () {
  "use strict";
  if (window.__gp || !window.__sagaCore) return;
  const TS = 16;
  const E = window.__sagaCore.create({
    id: "gp", key: "ali-di-rondine.gp", title: "Gran Premio del Pallone", icon: "🏁", bg: "gp_titolo", chapters: 3,
    menuSub: "Corse e calcio a Palladoro: ogni giro finisce in area, ogni tappa è una partita",
    theme: { accent: "#ffb02a", ink: "#fff6e0", paper: "rgba(18,20,36,.9)", font: "Trebuchet MS, sans-serif", chipBg: "#1c2040ee", chipBorder: "#ffb02a" },
    stats: { rosa: [-9, 9, 0, "Rispetto di Rosalba"], team: [0, 99, 0, "Spirito dell'Officina"] },
    item: ["Bullone d'oro", "Bulloni d'oro"],
    drawItem(g, x, y, i, f) { // un bullone d'oro che gira e luccica
      g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(-4, 5, 8, 1.5);
      g.fillStyle = "#e8b83a"; g.beginPath(); for (let k = 0; k < 6; k++) { const a = (k / 6) * 6.283 + f / 50; g.lineTo(Math.cos(a) * 5.5, Math.sin(a) * 3.6); } g.closePath(); g.fill(); g.fillStyle = "#a8781a"; g.beginPath(); g.arc(0, 0, 1.8, 0, 7); g.fill();
      g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,240,180,${0.3 + 0.2 * Math.sin(f / 8 + i)})`; g.beginPath(); g.arc(0, -1, 6, 0, 7); g.fill(); g.restore();
    },
    stadium: { azPitch: "neon", cageField: 0, cageMut: "turbo", venue: { ads: [["GOMMALUX", "#ffd23f"], ["OLIO BULLONE", "#2a6adf"], ["PIZZA GIRO", "#e8402a"], ["VROOM BANK", "#8a3ad8"]], crowd: ["#e8402a", "#ffd23f", "#fff", "#2a6adf", "#1a8a4a"], ground: ["#3a3a44", "#40404c"], line: "#ffffffcc", grid: "rgba(255,255,255,.07)", tint: "rgba(255,200,80,.06)", glow: "255,200,80", sky: ["#3a7ad8", "#bfe6ff"], wall: ["#c82a2a", "#fff"], fx: { fr: 0.985, spd: 1.08, wind: 0 } } },
    regions: {
      // il circuito: asfalto, erba da prova, cordoli, fossi d'acqua
      pista: { grass: ["#3a9a44", "#40a24a", "#348e3e"], path: ["#6a6a74", "#62626c"], stone: ["#8a8a96", "#80808c"], wall: ["#c82a2a", "#e8e8ee"], water: ["#3a7aa8", "#4484b2"], tall: "#2a7a34", tree: ["#1a6a2a", "#2a8a3a", "#3a9a4a"], tint: "255,230,170", tintA: 0.06, fx: "dust", dark: 0 },
      // il box: cemento, olio, luci al neon
      box: { grass: ["#5a5a66", "#54545e", "#60606c"], path: ["#7a7a86", "#70707c"], stone: ["#6a6a76", "#60606c"], wall: ["#2a2e4a", "#242842"], water: ["#4a7aa8", "#5484b2"], tall: "#5a5a66", tint: "255,200,120", tintA: 0.08, fx: "", dark: 0.1 },
      // la cabina di telecronaca e il salotto dello sponsor
      cabina: { grass: ["#4a2a5a", "#442454", "#502e60"], path: ["#6a4a7a", "#624272"], stone: ["#7a5a8a", "#6e4e7e"], wall: ["#2a1a3a", "#241632"], water: ["#4a7aa8", "#5484b2"], tall: "#4a2a5a", tint: "255,120,200", tintA: 0.08, fx: "", dark: 0.1 },
      salotto: { grass: ["#7a5a2a", "#745426", "#80602e"], path: ["#a8864a", "#9e7c42"], stone: ["#b8964a", "#ae8c42"], wall: ["#3a2a1a", "#32241a"], water: ["#4a7aa8", "#5484b2"], tall: "#7a5a2a", tint: "255,210,120", tintA: 0.1, fx: "sparks", dark: 0.06 },
      // il giardino dei trofei: nascosto dietro un fosso
      oasi: { grass: ["#3aa85a", "#40b062", "#34a052"], path: ["#d8c88a", "#cebe80"], stone: ["#e8d898", "#dccc8c"], wall: ["#8a6a2a", "#7a5a22"], water: ["#4ab0d8", "#54bae2"], tall: "#2a8a4a", tree: ["#1a7a3a", "#2a9a4a", "#3ab05a"], tint: "255,230,140", tintA: 0.12, fx: "sparks", dark: 0 },
    },
    floors: "", solid: "OAPYUMFK",
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi sul cordolo. Il motore si raffredda con un tic-tic che somiglia a un applauso. (Il gioco salva da solo: qui puoi rileggere il Libro di Bordo.)" },
    texts: { chestOpen: "Apri la cassetta.", chestEmpty: "La cassetta è vuota. Resta un odore di olio e di vittoria.", nothing: "Niente. Solo un po' di gomma bruciata.", noHero: "Il Gran Premio vuole un pilota. Crea prima il tuo Campione.", chapters: "Tre tappe, un solo pallone. Le scelte cambiano la bandiera." },
    journal: { name: "Il Libro di Bordo", sub: "Persone, indizi, oggetti, bandiere (i finali)" },
    endings: {
      scacchi: ["BANDIERA A SCACCHI", "Vinci il Gran Premio e alzi la Coppa Rotonda. Il pubblico canta, il telecronista si sgola, e la Coppa pesa quanto promesso: tantissimo.", "Sempre possibile: vinci la finale."],
      condivisa: ["LA COPPA DI DUE", "La Coppa Rotonda è fatta per essere divisa a metà: due scuderie, due manici, un solo brindisi. Palladoro non vedeva una cosa così da trent'anni.", "Serve il rispetto di Rosalba (almeno 2) e la scelta di dividere la Coppa."],
      voce: ["LA VOCE NUOVA", "Gridoni smette di inventare colpi di scena e comincia a raccontare quelli veri: le sue telecronache fanno ridere e commuovere. Il pubblico non sente più nessuna differenza, ma i meccanici sì.", "Serve aver trovato gli indizi e aver parlato in privato con il telecronista."],
      officina: ["L'OFFICINA RINASCE", "Senza lo sponsor, con le tue sole mani e con quelle di Tonino, l'Officina Bullone diventa la scuderia più amata di Palladoro. Ha ancora i debiti, ma adesso ha un coro.", "Serve aver rifiutato lo sponsor e aver costruito lo spirito dell'Officina (4)."],
      giro: ["IL GIRO PERFETTO", "In cima alla Coppa non c'è un trofeo: c'è un giro solo, quello vero, senza classifica. Lo fate in quattro, a fari spenti, e nessuno lo ha cronometrato. È il più veloce di tutti.", "Segreto: il Giardino dei Trofei, tutti gli indizi, niente sponsor, Rosalba e l'Officina dalla tua parte, e la Coppa divisa."],
    },
    heroLook: (h, K) => ({ bg: ["#1c2040", "#ffb02a"], shirt: K.F.is("gp_tuta") ? "#2a6adf" : h.shirt }),
    heroTitle: (K) => (K.F.is("gp_titolo") ? (K.F.is("gp_coppa") ? "Campione del Gran Premio" : "pilota dell'Officina Bullone") : "pilota in prova"),
    act: { q: "Entra", O: "Guarda le gomme", A: "Guarda il tabellone dei tempi", P: "Guarda il podio", Y: "Guarda la pompa", U: "Guarda il maxischermo", M: "Guarda il banco attrezzi", F: "Guarda la Rondinella", K: "Guarda il cartellone", n: "Leggi il cartello", ">": "Vai in pista", "<": "Torna al paddock", v: "Esci", "^": "Cambia zona" },
    // IL VEICOLO: in macchina il fosso (w) si salta; si resta in macchina finché ci si trova sopra
    pass: (K) => (K.drive() ? "w" : ""),
    heroFx: (K) => (K.drive() ? { s: 1, aura: "" } : null),
    zoneMenuExtra: (K) => (K.F.is("gp_auto") && !((K.zone(K.api.trZone()) || { spec: {} }).spec.interior) ? [{ label: K.drive() ? "🚶 Scendi dalla Rondinella" : "🏎️ Sali sulla Rondinella", sub: K.drive() ? "Torni a piedi" : "Salti i fossi e lasci la scia", fn: () => K.setDrive(!K.drive()) }] : []),
    plugins: [{
      enter(zid, spec, K) { if (spec.interior && K.drive()) K.F.set("gp_drive", false); },
      hud(g, zid, spec, K) {
        const n = ["gp_c1", "gp_c2", "gp_c3"].filter((f) => K.F.is(f)).length; g.save(); g.font = "700 8px Trebuchet MS, sans-serif";
        const s = `🏁 ${K.drive() ? "in macchina" : "a piedi"}${n ? "  🔎" + n : ""}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(18,20,36,.82)"; g.fillRect(4, 4, w, 13); g.fillStyle = K.drive() ? "#ffb02a" : "#d8e0ff"; g.fillText(s, 9, 13.5); g.restore();
      },
      top(g, zid, spec, cx, cy, d, K) { // la Rondinella sotto l'eroe, con la scia di velocità
        if (!K.drive()) { TRAIL.length = 0; return; } const p = K.api.trPos(); if (!p) return; const x = p[0] - cx, y = p[1] - cy;
        const last = TRAIL[TRAIL.length - 1]; if (!last || Math.hypot(last[0] - p[0], last[1] - p[1]) > 1.2) { TRAIL.push([p[0], p[1]]); if (TRAIL.length > 9) TRAIL.shift(); } else if (TRAIL.length && performance.now() % 3 < 1) TRAIL.shift();
        g.save(); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.2; TRAIL.forEach((t, i) => { const a = i / TRAIL.length; g.globalAlpha = a * 0.6; g.beginPath(); g.moveTo(t[0] - cx - 4, t[1] - cy - 2); g.lineTo(t[0] - cx - 4 - (1 - a) * 6, t[1] - cy - 2); g.moveTo(t[0] - cx + 4, t[1] - cy - 2); g.lineTo(t[0] - cx + 4 + (1 - a) * 6, t[1] - cy - 2); g.stroke(); }); g.restore();
        g.save(); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(x - 10, y - 1, 20, 3); g.fillStyle = "#12121a"; g.fillRect(x - 11, y - 6, 4, 6); g.fillRect(x + 7, y - 6, 4, 6); g.fillStyle = "#2a6adf"; g.fillRect(x - 9, y - 8, 18, 7); g.fillStyle = "#ffd23f"; g.fillRect(x - 9, y - 4, 18, 1.5); g.fillStyle = "#fff"; g.fillRect(x - 2, y - 8, 4, 7); g.restore();
      },
    }],
    musicMain: "gp",
    music: {
      // un tema veloce da sigla di corse: basso saltellante, lead di sintetizzatore, cassa dritta
      gp: { bpm: 152, chords: ["Am", "F", "C", "G", "Am", "F", "G", "E"], lres: 2, lw: "square", lv: 0.04,
        lead: "A5 - C6 E6 - D6 C6 - | A5 - F5 A5 - C6 A5 - | G5 - C6 E6 - G6 E6 - | D6 - B5 G5 - B5 D6 - | A5 - C6 E6 - A6 E6 - | F5 - A5 C6 - F6 C6 - | G5 - B5 D6 - G6 D6 - | E6 - - - B5 - - -",
        bass: "R . R R . R 5 .", bv: 0.12, arp: "R 3 5 8", aw: "sawtooth", av: 0.016, drum: "k . h . s . h h k . h k s . h h", dv: 0.15 },
    },
    paint: {
      // pila di gomme: tre pneumatici impilati con la scritta del marchio
      O(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; for (let i = 0; i < 3; i++) { g.fillStyle = "#14141a"; g.fillRect(sx + 1, sy + 10 - i * 5, 14, 5); g.fillStyle = "#2a2a34"; g.fillRect(sx + 2, sy + 11 - i * 5, 12, 1.5); g.fillStyle = [ "#ffd23f", "#fff", "#e8402a" ][i]; g.fillRect(sx + 6, sy + 12 - i * 5, 4, 1.5); } },
      // tabellone dei tempi con numeri che scorrono
      A(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1a1a2a"; g.fillRect(sx + 1, sy - 4, 14, 19); g.fillStyle = "#0a0a14"; g.fillRect(sx + 2, sy - 3, 12, 11); for (let i = 0; i < 3; i++) { g.fillStyle = i === 0 ? "#ffd23f" : "#8ac8ff"; g.fillRect(sx + 3, sy - 2 + i * 3.4, 3 + ((fr >> 4) + i) % 4, 1.6); g.fillRect(sx + 10, sy - 2 + i * 3.4, 2, 1.6); } g.fillStyle = "#e8402a"; g.fillRect(sx + 2, sy + 10, 12, 2); },
      // podio: tre gradini
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#c0c0c8"; g.fillRect(sx, sy + 7, 5, 8); g.fillStyle = "#e8b83a"; g.fillRect(sx + 5, sy + 3, 6, 12); g.fillStyle = "#b8763a"; g.fillRect(sx + 11, sy + 9, 5, 6); g.fillStyle = "#1a1a1a"; g.font = "bold 5px sans-serif"; g.fillText("2", sx + 1.5, sy + 13); g.fillText("1", sx + 7, sy + 11); g.fillText("3", sx + 12.5, sy + 14); },
      // pompa di carburante, fumetto rosso
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#c82a2a"; g.fillRect(sx + 3, sy - 3, 10, 17); g.fillStyle = "#fff"; g.fillRect(sx + 5, sy - 1, 6, 5); g.fillStyle = "#1a1a1a"; g.fillRect(sx + 6, sy, 4, 2.5); g.fillStyle = "#ffd23f"; g.fillRect(sx + 4, sy + 7, 8, 2); g.fillStyle = "#222"; g.fillRect(sx + 13, sy + 2, 2, 9); },
      // maxischermo
      U(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1a1a2a"; g.fillRect(sx, sy - 4, 16, 18); g.fillStyle = (fr >> 5) % 2 ? "#2a6adf" : "#d8302a"; g.fillRect(sx + 1, sy - 3, 14, 10); g.fillStyle = "#fff"; g.fillRect(sx + 3, sy - 1, 10, 1.5); g.fillRect(sx + 3, sy + 2, 6, 1.5); },
      // banco attrezzi: chiavi appese e una morsa
      M(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a4630"; g.fillRect(sx, sy + 4, 16, 9); g.fillStyle = "#3a2a18"; g.fillRect(sx, sy + 12, 16, 2); g.fillStyle = "#c8c8d0"; for (let i = 0; i < 4; i++) g.fillRect(sx + 2 + i * 3.5, sy - 3, 1.5, 7); g.fillStyle = "#c82a2a"; g.fillRect(sx + 10, sy + 1, 4, 3); },
      // la Rondinella esposta: macchinina blu con strisce gialle
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 13, 16, 2); g.fillStyle = "#12121a"; g.fillRect(sx + 1, sy + 8, 4, 6); g.fillRect(sx + 11, sy + 8, 4, 6); g.fillStyle = "#2a6adf"; g.fillRect(sx, sy + 3, 16, 9); g.fillStyle = "#ffd23f"; g.fillRect(sx + 6, sy + 3, 4, 9); g.fillStyle = "#fff"; g.fillRect(sx + 3, sy, 10, 4); g.fillStyle = "#8ac8ff"; g.fillRect(sx + 4, sy + 1, 8, 2.5); },
      // cartellone pubblicitario
      K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, ads = [["GOMMALUX", "#ffd23f", "#1a1a1a"], ["VROOM BANK", "#8a3ad8", "#fff"], ["PIZZA GIRO", "#e8402a", "#fff"], ["OLIO BULLONE", "#2a6adf", "#fff"]], a = ads[(tx + ty) % 4]; g.fillStyle = "#2a2a33"; g.fillRect(sx + 7, sy + 3, 2, 12); g.fillStyle = a[1]; g.fillRect(sx, sy - 2, 16, 9); g.fillStyle = a[2]; g.font = "bold 3.6px sans-serif"; g.fillText(a[0], sx + 1.2, sy + 3.5); },
    },
    guest: { id: "gp_bullone", lines: [["gp_bullone", "[felice] Ho chiuso l'Officina per mezz'ora, mi sono messo la camicia buona e sono venuto a trovarti. Mi raccomando: i bulloni si stringono a mano, il resto è tutto fumo. E un po' d'olio."]] },
    cameos: [
      { id: "rz_ferruccio", zone: "gp_paddock", at: [5, 14], when: (K) => !!((K.otherSaga("ali-di-rondine.razzo") || {}).done || {})[1], lines: [["rz_ferruccio", "[felice] BIP. Corriere dal 3011: gomme a idrogeno per il Gran Premio. Le vostre sono più buffe, ma ho l'impressione che frenino meglio."]] },
      { id: "mg_bullone", zone: "gp_paddock", at: [24, 14], when: (K) => !!((K.otherSaga("ali-di-rondine.mantello") || {}).done || {})[1], lines: [["mg_bullone", "Un parente di mio cugino lavora qui, credo. Sempre bulloni, sempre fretta. Nella nostra famiglia siamo fatti così."]] },
    ],
  });
  const K = E.K, TRAIL = [];
  // ------------------------------------------------------------ IL VEICOLO
  K.drive = () => !!K.F.is("gp_auto") && !!K.F.is("gp_drive");
  function heroTiles() { // le tessere sotto i quattro punti dei piedi
    const p = K.api.trPos(), m = K.ZX && K.ZX.map; if (!p || !m) return []; return [[-5, -4], [5, -4], [-5, 2], [5, 2]].map(([ox, oy]) => { const tx = Math.floor((p[0] + ox) / TS), ty = Math.floor((p[1] + oy - 4) / TS); return m[ty] && m[ty][tx]; });
  }
  K.setDrive = (on) => {
    if (!on && heroTiles().some((c) => c === "w")) { K.say([["voce", "Non qui! Se scendi adesso, finisci a mollo nel fosso. Prima raggiungi la riva."]]); return false; }
    if (on && !K.F.is("gp_auto")) return false;
    K.F.set("gp_drive", !!on); K.tone(on ? 140 : 300, 0.3, "sawtooth", 0.05, on ? 520 : 120); if (K.refreshZone) K.refreshZone(); return true;
  };
  // ------------------------------------------------------------ LE GOMME E I VANTAGGI (valgono solo nelle gare di questa saga)
  K.gomme = () => { const g = K.F.get("gp_gomme", "mix"); return g === "grip" || g === "speed" ? g : "mix"; };
  K.vantaggi = () => ({ turbi: (K.F.is("gp_turbo") ? 1 : 0) + (K.F.is("gp_coppetta") ? 1 : 0), mira: (K.F.is("gp_mirino") ? 1 : 0) + (K.stat("rosa") >= 3 ? 1 : 0), tires: K.gomme() });
  // la partita originale: K.gara({ laps, opp, … }, fine)
  K.gara = (o, fine) => {
    const h = (K.hero && K.hero()) || {}, v = K.vantaggi();
    return K.ownMatch(window.__giroegol.start, Object.assign({ usColor: "#2a6adf", us: "Officina Bullone", hero: { name: h.name || "Tu", skin: h.skin, hair: h.hair }, mate: { name: "Tonino" }, tires: v.tires, turbi: v.turbi, mira: v.mira }, o, { done: (r) => { if (!r.quit && r.data) { K.F.add("gp_sorpassi", r.data.sorpassi | 0); K.F.add("gp_gol", r.data.gol | 0); } (fine || o.done || (() => {}))(r); } }));
  };
  window.__gp = E.api;
})();
