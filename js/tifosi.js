// js/tifosi.js - «LA NOTTE DEI TIFOSI MORTI» · configurazione della saga sul motore comune (js/saga-core.js). Ispirata alle commedie horror (L'alba dei morti dementi)
// e ai survivors (Vampire Survivors). Ultima giornata, Borgo Marino contro Sporting Valtorta, novantesimo più tre: un fumogeno verde avvolge la curva ospite e gli ultras
// si rialzano un po' meno vivi, con la stessa voglia di cantare. Lo stadio è chiuso, la notte è lunga e l'unica cosa che li respinge è il pallone calciato forte.
// Tono: commedia di base (zombie che cantano cori sbagliati, sciarpe come armi, un presidente vigliacco), con un episodio serio (un compagno morso e il suo ultimo minuto).
// Dal core: Il Gruppo (cfg.crew: chi corre con te nell'Assedio), Peso morale (Squadra e Pelle), Rapporti, Inventario, K.minigame, ospite al Borgo.
// Novità del core portata da questa saga: IL BIVIO DEI POTERI (cfg.perks): dopo ogni notte scegli 1 potere su 3 che resta per tutta la saga (poteri di partenza dell'Assedio).
// Minigioco proprio: «L'Assedio a ondate» (js/assedio.js): arena che scorre, calcio automatico, gettoni, livelli con 1 potere su 3, capo allo scadere del tempo.
// Tessere proprie: P seggiolini · F transenna · X porta da calcio · V bossolo verde · I faro · E panchina · C auto · A armadietti · K tamburo · J cartellone · G cancello
//   M macchina del caffè · pavimenti Q prato · Y cemento · Z asfalto · U piastrelle
(function () {
  "use strict";
  if (window.__tifosi || !window.__sagaCore || !window.__hd) return;
  const HD = window.__hd, FX = HD.F;
  const MEM = {
    zt_tonino: { n: "Tonino", icon: "💥", role: "Centravanti vanitoso · Cannonata", pow: "bomber", d: "Ventisei gol in campionato e un gel che resiste a tutto, anche all'apocalisse. Tira forte, e lo sa.", s: { forza: 5, mira: 3, cuore: 2 } },
    zt_nadia: { n: "Nadia", icon: "🧃", role: "Preparatrice atletica · Cura", pow: "cura", d: "Borracce, spray del ghiaccio e nessuna pazienza. Ti rimette in piedi urlandoti contro.", s: { forza: 2, mira: 3, cuore: 5 } },
    zt_pippo: { n: "Pippo", icon: "🧱", role: "Il Muro, difensore · Muro", pow: "muro", d: "Trentotto anni, diciotto stagioni nel Borgo Marino, stasera l'ultima partita. Chi lo tocca rimbalza.", s: { forza: 5, mira: 1, cuore: 4 } },
    zt_gaspare: { n: "Gaspare", icon: "🧹", role: "Magazziniere · Scopa", pow: "scopa", d: "Sessantaquattro anni, trent'anni di magazzino, una scopa che ha visto tre promozioni e cinque retrocessioni.", s: { forza: 3, mira: 2, cuore: 4 } },
    zt_rebecca: { n: "Rebecca", icon: "📸", role: "Cronista di Telegolfo · Flash", pow: "flash", d: "Era venuta per un pezzo sul calcio di provincia. Adesso ha lo scoop del secolo e nessuno a cui mandarlo.", s: { forza: 1, mira: 4, cuore: 3 } },
    zt_ernesto: { n: "Don Ernesto", icon: "✝️", role: "Cappellano dello stadio · Acqua santa", pow: "benedizione", d: "Benedice il campo a inizio stagione e i rigori a fine partita. Non sa se l'acqua santa funziona. Neanche gli zombie.", s: { forza: 2, mira: 2, cuore: 5 } },
    zt_mimmo: { n: "Mimmo Sciarpa", icon: "🎶", role: "Capo della curva di casa · Coro", pow: "coro", d: "Quarantacinque sciarpe, una per ogni anno. Conosce tutti i cori, anche quelli degli altri.", s: { forza: 2, mira: 2, cuore: 4 } }
  };
  const PERKS = {
    potenza: { n: "Tiro potente", icon: "💥", d: "Parti con i palloni che fanno più male.", max: 2 },
    raffica: { n: "Raffica", icon: "⏩", d: "Parti calciando più spesso.", max: 2 },
    rimbalzo: { n: "Tiro a effetto", icon: "↪️", d: "Il pallone rimbalza su un altro tifoso fin dall'inizio.", max: 2 },
    sciarpa: { n: "Sciarpa rotante", icon: "🧣", d: "Una sciarpa del Borgo ti gira intorno da subito.", max: 2 },
    fischietto: { n: "Fischietto", icon: "📣", d: "Parti col fischietto dell'arbitro: stordisce chi è vicino.", max: 2 },
    scarpini: { n: "Scarpini nuovi", icon: "👟", d: "Parti più veloce.", max: 2 },
    calamita: { n: "Tasche larghe", icon: "🧲", d: "Raccogli i gettoni da più lontano.", max: 2 },
    borraccia: { n: "Borraccia", icon: "🧃", d: "Parti con più energia.", max: 2 },
    parastinchi: { n: "Parastinchi", icon: "🛡️", d: "I morsi fanno meno male.", max: 2 },
    coro: { n: "Coro di casa", icon: "🎶", d: "Canti forte: i tifosi vicini rallentano.", max: 2 }
  };
  const E = window.__sagaCore.create({
    id: "tifosi", key: "ali-di-rondine.tifosi", title: "La Notte dei Tifosi Morti", icon: "🧟", bg: "zt_titolo", chapters: 4, travel: true,
    menuSub: "Novantesimo più tre, uno a uno. Un fumogeno verde nella curva ospite e gli ultras si rialzano, un po' meno vivi. Lo stadio è chiuso: resisti fino all'alba col pallone.",
    theme: { accent: "#a3e635", ink: "#0b1120", paper: "rgba(247,254,231,.97)", font: "system-ui, sans-serif", chipBg: "#d9f99d", chipBorder: "#4d7c0f" },
    stats: { squadra: [0, 12, 0, "Squadra"], pelle: [0, 12, 0, "Pelle"] },
    weight: { name: "La paura", axes: { squadra: ["Squadra", "🤝"], pelle: ["Pelle", "🏃"] } },
    item: ["Gettone del bar", "Gettoni del bar"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 10 + i) * 1.5); g.fillStyle = "#facc15"; g.beginPath(); g.arc(0, 0, 3.6, 0, 7); g.fill(); g.fillStyle = "#a16207"; g.fillRect(-0.6, -2, 1.2, 4);
      g.globalAlpha = 0.25 + 0.2 * Math.sin(f / 8 + i); g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill(); g.restore();
    },
    regions: {
      stadio: { grass: ["#1d4a26", "#22552c", "#1f5029"], path: ["#3f3f46", "#52525b"], stone: ["#52525b", "#3f3f46"], wall: ["#1f2937", "#111827"], water: ["#1e3a5f", "#1b3456"], tall: "#1d4a26", tree: ["#14281a", "#1a3322", "#203d28"], tint: "132,204,22", tintA: 0.07, fx: "", dark: 0.16 },
      tribuna: { grass: ["#3f3f46", "#45454d", "#3a3a41"], path: ["#71717a", "#6b6b73"], stone: ["#52525b", "#4a4a52"], wall: ["#18181b", "#111113"], water: ["#1e3a5f", "#1b3456"], tall: "#3f3f46", tint: "147,197,253", tintA: 0.08, fx: "", dark: 0.36 },
      curva: { grass: ["#292524", "#2f2a28", "#262220"], path: ["#44403c", "#3c3835"], stone: ["#44403c", "#3c3835"], wall: ["#1c1917", "#0c0a09"], water: ["#1e3a5f", "#1b3456"], tall: "#292524", tint: "192,132,252", tintA: 0.14, fx: "", dark: 0.4 },
      parcheggio: { grass: ["#27272a", "#2c2c30", "#242427"], path: ["#3f3f46", "#45454d"], stone: ["#52525b", "#4a4a52"], wall: ["#1e293b", "#172033"], water: ["#1e3a5f", "#1b3456"], tall: "#27272a", tree: ["#14281a", "#1a3322", "#203d28"], tint: "253,230,138", tintA: 0.06, fx: "", dark: 0.36 },
      interno: { grass: ["#334155", "#2f3b4d", "#37455a"], path: ["#475569", "#3f4b5e"], stone: ["#475569", "#3f4b5e"], wall: ["#1e293b", "#172033"], water: ["#1e3a5f", "#1b3456"], tall: "#334155", tint: "255,250,230", tintA: 0.06, fx: "dust", dark: 0.18 },
      alba: { grass: ["#2f6b33", "#357538", "#2a6230"], path: ["#78716c", "#6f6863"], stone: ["#78716c", "#6f6863"], wall: ["#334155", "#2b3646"], water: ["#4d7c99", "#47738f"], tall: "#2f6b33", tree: ["#1f3a24", "#284a2e", "#305536"], tint: "253,186,116", tintA: 0.14, fx: "", dark: 0.06 }
    },
    floors: "QYZU", solid: "PFXVIECAKJGM",
    floorPaint(K, f, sx, sy, tx, ty, fr) {
      const g = K.g;
      if (f === "Q") { g.fillStyle = Math.floor(tx / 2) % 2 ? "#1d4a26" : "#22552c"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(120,200,110,.14)"; for (let i = 0; i < 5; i++) g.fillRect(sx + ((tx * 7 + i * 5) % 15), sy + ((ty * 3 + i * 7) % 15), 1, 2); if ((tx * 13 + ty * 7) % 29 === 0) { g.fillStyle = "#7c3aed"; g.fillRect(sx + 3, sy + 8, 8, 2); g.fillStyle = "#facc15"; g.fillRect(sx + 5, sy + 8, 2, 2); } return true; }
      if (f === "Y") { g.fillStyle = (tx + ty) % 2 ? "#4b4b53" : "#45454d"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 15, 16, 1); g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(sx, sy, 16, 1); if ((tx * 5 + ty * 11) % 23 === 0) { g.fillStyle = "#f8fafc"; g.fillRect(sx + 6, sy + 6, 4, 3); } return true; }
      if (f === "Z") { g.fillStyle = "#2a2a2e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.05)"; for (let i = 0; i < 4; i++) g.fillRect(sx + ((tx * 11 + i * 7) % 15), sy + ((ty * 5 + i * 3) % 15), 1, 1); if (ty % 6 === 0 && tx % 3 === 0) { g.fillStyle = "rgba(250,250,250,.45)"; g.fillRect(sx + 7, sy, 2, 16); } return true; }
      if (f === "U") { g.fillStyle = (tx + ty) % 2 ? "#cbd5e1" : "#b8c4d3"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(51,65,85,.35)"; g.fillRect(sx, sy, 16, 1); g.fillRect(sx, sy, 1, 16); return true; }
      return false;
    },
    paint: {
      // seggiolini della tribuna in file
      P(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#3f3f46"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx, sy + 13, 16, 3); for (let i = 0; i < 2; i++) { const c = (tx + ty + i) % 5 ? "#1d4ed8" : "#e2e8f0"; g.fillStyle = c; g.fillRect(sx + 1 + i * 8, sy + 3, 6, 7); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 1 + i * 8, sy + 8, 6, 2); } },
      // transenna di vetro e ferro
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(186,230,253,.25)"; g.fillRect(sx, sy + 2, 16, 10); g.fillStyle = "#94a3b8"; g.fillRect(sx, sy + 1, 16, 2); g.fillRect(sx, sy + 12, 16, 2); g.fillRect(sx + 1, sy + 1, 2, 13); g.fillRect(sx + 13, sy + 1, 2, 13); g.fillStyle = "rgba(255,255,255,.3)"; g.fillRect(sx + 5 + ((fr / 20 + tx) % 6), sy + 3, 1, 8); },
      // porta da calcio con la rete
      X(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 15, 3); g.fillStyle = "rgba(226,232,240,.35)"; for (let i = 2; i < 16; i += 3) { g.fillRect(sx + i, sy + 1, 1, 13); g.fillRect(sx + 1, sy + i, 14, 1); } g.fillStyle = "#f8fafc"; g.fillRect(sx, sy, 16, 2); g.fillRect(sx, sy, 2, 15); g.fillRect(sx + 14, sy, 2, 15); },
      // bossolo di fumogeno verde a terra, ancora fumante
      V(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#15803d"; g.fillRect(sx + 6, sy + 7, 4, 7); g.fillStyle = "#facc15"; g.fillRect(sx + 6, sy + 9, 4, 1); for (let i = 0; i < 3; i++) { const t = (fr / 2 + i * 12) % 36; g.fillStyle = `rgba(132,204,22,${0.45 - t / 80})`; g.beginPath(); g.arc(sx + 8 + Math.sin(t / 6 + i) * 3, sy + 6 - t * 0.4, 2 + t / 10, 0, 7); g.fill(); } K.light(sx + 8, sy + 8, 14, "132,204,22", 0.18); },
      // base della torre-faro
      I(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx + 3, sy + 12, 12, 4); g.fillStyle = "#334155"; g.fillRect(sx + 6, sy - 8, 4, 22); for (let i = 0; i < 6; i++) g.fillStyle = "#475569", g.fillRect(sx + 5, sy - 6 + i * 4, 6, 1); g.fillStyle = "#1e293b"; g.fillRect(sx + 1, sy - 13, 14, 6); g.fillStyle = `rgba(255,250,220,${0.8 + 0.15 * Math.sin(fr / 13 + tx)})`; g.fillRect(sx + 2, sy - 12, 5, 4); g.fillRect(sx + 9, sy - 12, 5, 4); K.light(sx + 8, sy - 10, 46, "255,250,220", 0.22); },
      // panchina coperta
      E(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(186,230,253,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 3, 9, 6, 0, Math.PI, 0); g.fill(); g.fillStyle = "#1d4ed8"; g.fillRect(sx + 1, sy + 7, 14, 4); g.fillStyle = "#94a3b8"; g.fillRect(sx + 1, sy + 11, 2, 4); g.fillRect(sx + 13, sy + 11, 2, 4); },
      // auto parcheggiata (colori diversi)
      C(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, c = ["#b91c1c", "#0f766e", "#a16207", "#4338ca", "#e5e7eb", "#1e293b"][(tx * 3 + ty) % 6]; g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx + 1, sy + 12, 15, 4); g.fillStyle = c; g.beginPath(); g.roundRect(sx + 1, sy + 3, 14, 11, 3); g.fill(); g.fillStyle = "rgba(186,230,253,.65)"; g.fillRect(sx + 3, sy + 5, 10, 3); g.fillStyle = "#111"; g.fillRect(sx + 2, sy + 13, 3, 2); g.fillRect(sx + 11, sy + 13, 3, 2); if ((tx + ty) % 4 === 0) { g.fillStyle = `rgba(250,204,21,${0.4 + 0.3 * Math.sin(fr / 6 + tx)})`; g.fillRect(sx + 1, sy + 9, 2, 2); g.fillRect(sx + 13, sy + 9, 2, 2); } },
      // armadietti dello spogliatoio
      A(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#475569"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#64748b"; g.fillRect(sx + 1, sy + 1, 6, 14); g.fillRect(sx + 9, sy + 1, 6, 14); g.fillStyle = "#cbd5e1"; g.fillRect(sx + 5, sy + 7, 1, 2); g.fillRect(sx + 13, sy + 7, 1, 2); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 2, 4, 1); g.fillRect(sx + 10, sy + 2, 4, 1); },
      // tamburo della curva
      K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, b = Math.abs(Math.sin(fr / 8 + tx)) * 0.8; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 7, 2, 0, 0, 7); g.fill(); g.fillStyle = "#b45309"; g.fillRect(sx + 2, sy + 5, 12, 8); g.fillStyle = "#fef3c7"; g.beginPath(); g.ellipse(sx + 8, sy + 5 - b, 6, 2.5, 0, 0, 7); g.fill(); g.strokeStyle = "#7c2d12"; g.lineWidth = 1; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(sx + 3 + i * 4, sy + 6); g.lineTo(sx + 5 + i * 4, sy + 12); g.stroke(); } },
      // cartellone pubblicitario a led
      J(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#020617"; g.fillRect(sx, sy + 3, 16, 10); const msg = ["PESCHERIA", "BAR SPORT", "FORZA", "BORGO", "VIGORVERDE"], c = ["#fbbf24", "#f472b6", "#a3e635", "#38bdf8"][(tx + Math.floor(fr / 90)) % 4]; g.fillStyle = c; g.font = "700 4px system-ui"; g.textAlign = "center"; g.fillText(msg[(tx + Math.floor(fr / 90)) % msg.length].slice(Math.max(0, (tx % 3) * 3), (tx % 3) * 3 + 4), sx + 8, sy + 10); g.fillStyle = "#111827"; g.fillRect(sx, sy + 13, 16, 2); },
      // cancello di ferro
      G(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1f2937"; g.fillRect(sx, sy + 1, 16, 2); g.fillRect(sx, sy + 13, 16, 2); for (let i = 1; i < 16; i += 3) { g.fillStyle = "#475569"; g.fillRect(sx + i, sy, 1.5, 15); g.beginPath(); g.moveTo(sx + i - 1, sy); g.lineTo(sx + i + 0.75, sy - 3); g.lineTo(sx + i + 2.5, sy); g.fill(); } },
      // macchina del caffè del bar
      M(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#78350f"; g.fillRect(sx, sy + 8, 16, 8); g.fillStyle = "#94a3b8"; g.fillRect(sx + 2, sy, 12, 10); g.fillStyle = "#1e293b"; g.fillRect(sx + 4, sy + 3, 8, 3); g.fillStyle = "#ef4444"; g.fillRect(sx + 11, sy + 1, 2, 1); for (let i = 0; i < 2; i++) { const t = (fr / 2 + i * 10) % 20; g.fillStyle = `rgba(226,232,240,${0.4 - t / 50})`; g.beginPath(); g.arc(sx + 6 + i * 4, sy - t * 0.4, 1.5 + t / 10, 0, 7); g.fill(); } }
    },
    act: { X: "Guarda la porta", V: "Raccogli il bossolo", E: "Guarda la panchina", C: "Guarda l'auto", A: "Guarda gli armadietti", K: "Guarda il tamburo", G: "Guarda il cancello", M: "Guarda la macchina del caffè" },
    flavor: { P: "Seggiolini blu e bianchi. Su uno c'è ancora un cuscino portato da casa, con le iniziali ricamate.", F: "La transenna di vetro. Dall'altra parte, qualcuno ci ha lasciato l'impronta di una mano verde.", X: "La porta. La rete ha un buco all'incrocio dei pali: Tonino dice che è suo, del '23.", I: "La torre-faro. Gaspare dice che il quadro elettrico è chiuso a chiave e la chiave è in tasca al custode. Il custode è scappato.", E: "La panchina. Sopra c'è ancora la giacca del Mister, con un taccuino pieno di frecce.", C: "Un'auto di tifosi. Sul cruscotto, una sciarpa e un santino di San Gennaro. Non è bastato.", A: "Gli armadietti. Su ognuno, un numero e una foto: mogli, figli, cani, uno ha la foto del suo motorino.", K: "Un tamburo della curva. La pelle è consumata al centro: quarant'anni di trasferte.", J: "Il cartellone a led. Scorrono le pubblicità di sempre: la pescheria, il bar Sport, e una che non avevi mai visto, «VigorVerde».", G: "Il cancello. Chiuso con una catena e un lucchetto grande come un pugno.", M: "La macchina del caffè. È ancora calda. È l'unica cosa, nello stadio, che non ha paura." },
    rest: { ch: "s", label: "Riprendi fiato", text: "Ti appoggi al muro e conti i respiri. Il gioco salva da solo; dal menu puoi rileggere il Taccuino della notte." },
    texts: { nothing: "Niente di speciale. Solo nebbia verde e, in lontananza, un coro stonato.", noHero: "Lo stadio non apre a uno senza nome. Crea prima il tuo Campione.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Qualcuno ci teneva i panini della trasferta." },
    journal: { name: "Il Taccuino della notte", sub: "Chi c'è ancora, cosa hai visto, cosa hai imparato" },
    // IL GRUPPO: chi corre con te nell'Assedio (tre alla volta)
    crew: { name: "Il Gruppo", field: 3, members: MEM },
    // IL BIVIO DEI POTERI (novità del core, opt-in): 1 potere su 3 dopo ogni notte, resta per tutta la saga
    perks: { name: "Il Bivio dei Poteri", perks: PERKS },
    bonds: {
      per: 4, talk: 2, max: 5, names: ["Sconosciuti", "Compagni di spogliatoio", "Compagni di notte", "Amici", "Fratelli di curva", "Famiglia"],
      scenes: {
        zt_gaspare: [
          { lv: 2, id: "gas2", prize: "+1 Squadra", lines: [["zt_gaspare", "[pensa] Trent'anni di magazzino. Sai quante maglie ho lavato? Io no. Ho smesso di contare alla promozione del '98."], ["zt_gaspare", "Le macchie d'erba vengono via. Le macchie di sangue vengono via. Le macchie di verde zombie, vedremo. Domani faccio una prova."]], reward: (K) => K.bond("squadra", 1) },
          { lv: 4, id: "gas4", prize: "Chiave del magazzino", lines: [["zt_gaspare", "[serio] Mia moglie diceva che amavo più lo stadio di lei. Non era vero. Ma lo stadio non si è mai ammalato."], ["zt_gaspare", "Tieni. È la chiave del magazzino. Se un giorno non ci sono, qualcuno deve sapere dove stanno i palloni buoni."]], reward: (K) => K.inv.give("zt_chiave") }
        ],
        zt_pippo: [
          { lv: 2, id: "pip2", prize: "+1 Squadra", lines: [["zt_pippo", "[ride] Diciotto stagioni. Un gol solo, di testa, nel 2011. L'ho rivisto in videocassetta duecento volte. Mia figlia sa la telecronaca a memoria."], ["zt_pippo", "Stasera era l'ultima. Avevo preparato un discorso per lo spogliatoio. Due righe. Adesso non me le ricordo più."]], reward: (K) => K.bond("squadra", 1) }
        ],
        zt_tonino: [
          { lv: 2, id: "ton2", prize: "+1 Pelle", lines: [["zt_tonino", "[furbo] Sai perché tengo così tanto ai capelli? Perché in fotografia escono solo quelli. Il resto è sudore."], ["zt_tonino", "[serio] E perché mio padre era calvo a venticinque anni. Lo prendevano in giro al bar. Io al bar ci entro pettinato."]], reward: (K) => K.bond("pelle", 1) }
        ],
        zt_rebecca: [
          { lv: 2, id: "reb2", prize: "+1 Squadra", lines: [["zt_rebecca", "Il direttore mi aveva mandato qui per punizione: «un pezzo di colore sul calcio di provincia». Volevo fare la cronaca giudiziaria."], ["zt_rebecca", "[ride] Adesso ho uno stadio di zombie, un presidente nascosto e una storia di fumogeni truccati. Altro che colore."]], reward: (K) => K.bond("squadra", 1) }
        ]
      }
    },
    inv: {
      items: {
        zt_bossolo: { n: "Bossolo verde", icon: "🧪", d: "Il bossolo di un fumogeno verde, con la sigla «B.P. · VigorVerde · lotto 7». Ne restano pochi, sparsi per lo stadio." },
        zt_caffe: { n: "Caffè del bar", icon: "☕", d: "Un caffè in bicchierino di plastica, ancora caldo. In questo stadio è una moneta.", gift: { zt_gaspare: 6, zt_pippo: 4, zt_nadia: 4, zt_ernesto: 5 }, giftAny: 2, react: { zt_gaspare: "[felice] Ristretto, zucchero di canna. L'hai chiesto a Franca? Solo Franca sa come lo prendo." } },
        zt_gel: { n: "Gel extra forte", icon: "💈", d: "Un barattolo di gel recuperato nello spogliatoio. «Tenuta 10». Resiste a pioggia, vento e apocalisse.", gift: { zt_tonino: 9 }, giftAny: 0, react: { zt_tonino: "[felice] Il mio! Il tenuta dieci! Adesso posso morire. Cioè, no. Ma se succede, succede pettinato." } },
        zt_rullino: { n: "Scheda di memoria", icon: "💾", d: "Una scheda della macchina fotografica caduta in tribuna. Dentro, le foto della curva prima del fumogeno.", gift: { zt_rebecca: 8 }, giftAny: 0, react: { zt_rebecca: "[sorpreso] Le mie foto del primo tempo! Qui si vede il furgone del fornitore… questa è una prova, Campione." } },
        zt_panino: { n: "Panino con la porchetta", icon: "🥪", d: "Il panino della trasferta, incartato nella stagnola. Profuma di casa e di colesterolo.", gift: { zt_mimmo: 6, zt_tonino: 3, zt_gaspare: 4, zt_pippo: 5 }, giftAny: 2, react: { zt_mimmo: "[felice] Porchetta di Ariccia! Altro che zombie: con questo in pancia canto fino a domenica." } },
        zt_chiave: { n: "Chiave del magazzino", icon: "🗝️", d: "La chiave del magazzino di Gaspare. Pesa più di quanto dovrebbe una chiave." },
        zt_fischietto: { n: "Fischietto dell'arbitro", icon: "📯", d: "Il fischietto dell'arbitro Cesaroni. Quando fischia, perfino gli zombie si fermano a protestare." }
      }
    },
    endings: {
      pullman: ["Tutti sul Pullman", "Il pullman del Borgo Marino esce dal parcheggio mentre sorge il sole. Sono quasi tutti a bordo, sporchi di verde, a cantare il coro della promozione stonato. Gaspare guida malissimo.", "Arriva all'alba con almeno quattro compagni e sali sul pullman."],
      magazziniere: ["Il Magazziniere Resta", "Il cancello si chiude dall'interno. Dall'altra parte, Gaspare con la scopa e la chiave del magazzino in tasca. «Qualcuno deve contare i palloni», dice. Il pullman parte.", "All'alba, lascia che Gaspare chiuda il cancello da dentro."],
      coro: ["Coro Eterno", "All'alba ventimila tifosi senza fiato si voltano verso di te, in mezzo alla curva, col megafono di Ringhio in mano. Aspettano il coro. Glielo dai. Dal paese si sente fino al porto, ogni notte.", "Impara il coro della curva e, all'alba, scegli di cantare con loro."],
      fumogeno: ["Il Fumogeno Verde", "Segreto: il fumo blu scende sulla curva e le facce tornano rosa, una a una. Nessuno ricorda niente. Pippo si rialza in mezzo al campo e chiede quanto manca. Novantesimo più tre: la partita si finisce.", "Segreto: tutti e otto i bossoli verdi, il fumo blu del furgone, la diretta di Rebecca e Pippo che aspetta l'alba."]
    },
    heroLook: () => ({ bg: ["#14532d", "#bef264"], shirt: "#1f5fbf" }),
    heroTitle: () => "l'ultimo col pallone",
    musicMain: "tifosi",
    music: { tifosi: { bpm: 112, chords: ["Em", "C", "D", "B", "Em", "C", "Am", "B"], lres: 2, lw: "square", lv: 0.025,
      lead: "E4 - G4 - B4 - E5 - | D5 - B4 - G4 - - - | E4 - G4 - B4 - C5 - | B4 - - - - - - - | E5 - D5 - B4 - G4 - | A4 - G4 - E4 - - - | F#4 - G4 - A4 - B4 - | E4 - - - - - - -",
      bass: "R . R . 5 . R . R . R . 5 . 3 .", bv: 0.1, arp: "1 3 5 8 5 3 1 3", aw: "triangle", av: 0.012, drum: "k . s . k k s . k . s . k k s s", dv: 0.09 } },
    party: (K) => K.crew.field().slice(0, 3),
    guide: () => [["🧟 L'Assedio", "Trascina il dito per correre: il Campione calcia da solo al tifoso più vicino. Raccogli i gettoni gialli, sali di livello e scegli 1 potere su 3. Allo scadere del tempo arriva il capo."], ["🔀 Il Bivio dei Poteri", "Dopo ogni notte vinta scegli un potere che resta per tutta la saga: nell'Assedio parti già con quello."], ["🧍 Il Gruppo", "Fino a tre compagni corrono con te nell'Assedio, ognuno col suo modo di aiutare (cannonata, cura, flash, scopa…). Dal Taccuino, «Schiera la compagnia»."]],
    cameos: [],
    guest: { id: "zt_gaspare", lines: ["Gaspare, magazziniere. Sì, quello della notte dei tifosi. Dormo ancora con la scopa accanto al letto. Mia nipote dice che è romantico.", "Al vostro campetto mancano due palloni e una rete. Se mi offrite un caffè, li trovo prima di domenica."] },
    onReady(K) { window.__tifosiH(K).people(); }
  });
  window.__tifosiH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1c1917", skin: "#e0b48a" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "800 6px system-ui"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(2,6,23,.88)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#a3e635"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = "#f7fee7"; g.textAlign = "center"; g.fillText(txt, x, y + 2.5); g.restore(); },
      // nebbia verde che passa sulla mappa (decor)
      fog(g, d, f, w, h) { g.save(); for (let i = 0; i < 6; i++) { const x = d.X(0) + ((i * 97 + f * (0.3 + i * 0.05)) % ((w || 34) * 16 + 120)) - 60, y = d.Y(0) + ((i * 61) % ((h || 24) * 16)) + Math.sin(f / 70 + i) * 10, gr = g.createRadialGradient(x, y, 0, x, y, 56); gr.addColorStop(0, "rgba(132,204,22,.12)"); gr.addColorStop(1, "rgba(132,204,22,0)"); g.fillStyle = gr; g.fillRect(x - 56, y - 56, 112, 112); } g.restore(); },
      stato: () => `🤝 Squadra ${K.stat("squadra")} · 🏃 Pelle ${K.stat("pelle")} · 🧍 Gruppo ${K.crew.count()} · 🧪 Bossoli ${K.inv.count("zt_bossolo")}/8`,
      count: () => `<b>🧍 Il Gruppo: ${K.crew.count()}</b>`,
      join(id, txt) { if (K.crew.has(id)) return; K.crew.recruit(id); H.say("voce", (txt || `${MEM[id].n} si unisce al Gruppo.`) + " " + H.count()); },
      // l'Assedio: compagni dal Gruppo, poteri dal Bivio; cb(r) col risultato. Se perdi, si può riprovare subito.
      run(o, cb) {
        const allies = K.crew.field().slice(0, 3).map((id) => ({ id, n: MEM[id].n, pow: MEM[id].pow }));
        const go = () => K.minigame(window.__assedio.start, Object.assign({ title: "L'Assedio", perks: K.perks.all(), allies }, o), (r) => {
          if (r && r.win) return cb(r);
          K.ask("voce", "Ti hanno circondato. Il pallone rotola via, la nebbia si chiude. Ma è un sogno brutto, e ci si può risvegliare.", [{ label: "↺ Riprova la notte", sub: "Stessi poteri di partenza", fn: go }, { label: "◂ Più tardi", sub: "Torna qui quando vuoi", fn: () => K.done() }]);
        });
        const l = H.flush(); if (l.length) K.say(l, go); else go();
      },
      // dopo una notte vinta: un potere dal Bivio
      bivio(cb) { K.perks.offer({ q: "Stanotte hai imparato qualcosa. Scegli un potere: nell'Assedio parti già con quello, per tutta la saga." }, (id) => cb && cb(id)); },
      people() {
        H.cast("zt_tonino", "Tonino Russo", "Centravanti · «Bomber»", { style: "slick", hair: "#1c1917", shirt: "#1f5fbf", skin: "#d9a679", eye: "#3f2a1a", bg: ["#1e3a8a", "#93c5fd"] }, MEM.zt_tonino.d);
        H.cast("zt_nadia", "Nadia Fontana", "Preparatrice atletica", { style: "ponytail", hair: "#7c2d12", shirt: "#0f766e", skin: "#efcfb0", eye: "#14532d", acc: ["fischietto"], bg: ["#134e4a", "#99f6e4"] }, MEM.zt_nadia.d);
        H.cast("zt_pippo", "Pippo Carrara", "«Il Muro», difensore", { style: "buzz", hair: "#57534e", shirt: "#1f5fbf", skin: "#c8956a", beard: "incolta", eye: "#1c1917", acc: ["fascia"], bg: ["#1e3a8a", "#bfdbfe"] }, MEM.zt_pippo.d);
        H.cast("zt_gaspare", "Gaspare Lo Cicero", "Magazziniere", { style: "bald", hair: "#d6d3d1", shirt: "#78716c", skin: "#d9a679", beard: "baffi", eye: "#44403c", acc: ["grembiule"], bg: ["#44403c", "#e7e5e4"] }, MEM.zt_gaspare.d);
        H.cast("zt_rebecca", "Rebecca Nardi", "Cronista di Telegolfo", { style: "bob", hair: "#1c1917", shirt: "#be123c", skin: "#f1d1b0", eye: "#1e3a8a", acc: ["occhiali"], bg: ["#881337", "#fecdd3"] }, MEM.zt_rebecca.d);
        H.cast("zt_ernesto", "Don Ernesto", "Cappellano dello stadio", { style: "side", hair: "#a8a29e", shirt: "#111827", skin: "#e0ac7e", eye: "#3f2a1a", acc: ["sciarpa"], bg: ["#111827", "#e5e7eb"] }, MEM.zt_ernesto.d);
        H.cast("zt_mimmo", "Mimmo Sciarpa", "Capo della curva di casa", { style: "curly", hair: "#292524", shirt: "#1f5fbf", skin: "#c8956a", beard: "folta", eye: "#1c1917", acc: ["sciarpa"], bg: ["#1e40af", "#f8fafc"] }, MEM.zt_mimmo.d);
        H.cast("zt_ringhio", "Ringhio", "Capo ultras del Valtorta", { style: "buzz", hair: "#111827", shirt: "#6d28d9", skin: "#86a36b", eye: "#a3e635", beard: "folta", acc: ["sciarpa"], bg: ["#3b0764", "#facc15"] }, "Quarant'anni di curva ospite, un megafono e una voce che arrivava in tribuna. Adesso arriva fino al porto, e non dice più parole.");
        H.cast("zt_bellotti", "Comm. Bellotti", "Presidente dello Sporting Valtorta", { style: "pompadour", hair: "#e7e5e4", shirt: "#4c1d95", skin: "#f1c9a5", eye: "#44403c", beard: "baffi", acc: ["occhiali"], bg: ["#4c1d95", "#e9d5ff"] }, "Presidente del Valtorta e titolare della Bellotti Pirotecnica. Ha fornito i fumogeni alla curva ospite «a prezzo di favore». Adesso è chiuso nel palco VIP.");
        H.cast("zt_cesaroni", "Arbitro Cesaroni", "Arbitro della partita", { style: "ordinato", hair: "#111827", shirt: "#111827", skin: "#e0ac7e", eye: "#1c1917", acc: ["fischietto"], bg: ["#020617", "#facc15"] }, "Arbitro della sezione di Pescara. Aveva fischiato tre rigori in novanta minuti. Adesso nessuno gli contesta più niente, e gli dispiace.");
        H.cast("zt_franca", "Franca del bar", "Barista dello stadio", { style: "messybun", hair: "#a16207", shirt: "#f8fafc", skin: "#efcfb0", eye: "#3f2a1a", acc: ["grembiule"], bg: ["#78350f", "#fde68a"] }, "Tiene il bar dello stadio dal 1994. Sa come prende il caffè ogni abbonato, anche quelli che non vengono più.");
        H.cast("zt_nello", "Nello", "Autista del pullman", { style: "bald", hair: "#78716c", shirt: "#334155", skin: "#d9a679", beard: "baffi", eye: "#1c1917", acc: ["cappellino"], bg: ["#1e293b", "#cbd5e1"] }, "Autista del pullman del Borgo Marino da trent'anni. Ha portato la squadra in quaranta trasferte e non ha mai visto una partita intera.");
        H.cast("zt_mister", "Mister Sbarra", "L'allenatore (un po' cambiato)", { style: "side", hair: "#78716c", shirt: "#1e293b", skin: "#86a36b", eye: "#a3e635", acc: ["fischietto"], bg: ["#14532d", "#bef264"] }, "L'allenatore del Borgo Marino. Era a bordo campo quando il fumo è arrivato. Continua a dare indicazioni tattiche, solo che adesso le dà agli zombie.");
      }
    };
    return H;
  };
  window.__tifosi = E.api; window.__tifosiCore = E;
})();
