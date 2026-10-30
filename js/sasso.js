// js/sasso.js - «SETTE PER SASSO NERO» · configurazione della saga sul motore comune (js/saga-core.js). Ispirata a I sette samurai, Suikoden e ai tower defense.
// Ogni raccolto i predoni di Corvo Rosso scendono dal passo e si prendono il riso di Sasso Nero. Il Campione, ronin col pallone da kemari, deve trovare sei
// compagni da dieci candidati (ognuno ha un prezzo e un passato), preparare il villaggio e reggere l'ultima notte. Non tutti arrivano all'alba.
// Tono: ironico di base (contadini sospettosi, ronin affamati, un ragazzo che finge di essere samurai), con episodi seri (il segreto della soffitta, chi cade).
// Dal core: La Compagnia (cfg.crew: i sette), Il Piano (cfg.plan: chi difende quale porta), Peso morale (Onore e Pietà), Rapporti, Inventario, Orologio.
// Novità del core portata da questa saga: LE COSTRUZIONI (cfg.build): cantieri sulla mappa dove si costruisce con il legno, e quello che costruisci resta tra i capitoli.
// Minigioco proprio: «L'Ultima Notte» (js/notte.js): difesa del villaggio a ondate, quattro porte e il granaio.
// Tessere proprie: R risaia · P palizzata · F fossato · X trappola · V torretta · O cantiere · I torii · E lanterna di pietra · C campana · A bambù · K albero del kemari
//   M ruota del mulino · G rastrelliera · S ciliegio · pavimenti Q terra battuta · Y tatami · Z pietra del tempio
(function () {
  "use strict";
  if (window.__sasso || !window.__sagaCore || !window.__hd) return;
  const HD = window.__hd, FX = HD.F;
  const MEM = {
    sn_kanbei: { n: "Kanbei", icon: "🧠", role: "Vecchio stratega · Stratega", pow: "stratega", d: "Ronin coi capelli rasati e trenta battaglie perse con onore. Conta i nemici prima di contare i soldi.", s: { forza: 2, mira: 3, cuore: 4 } },
    sn_kiku: { n: "Kiku", icon: "🏹", role: "Arciera del bosco · Arco", pow: "arco", d: "Cacciatrice di cervi. Ha un conto aperto con Corvo Rosso, e lo tiene in una faretra.", s: { forza: 2, mira: 5, cuore: 2 } },
    sn_gonta: { n: "Gonta", icon: "🪓", role: "Ex predone · Lama", pow: "lama", d: "Ha cavalcato con Corvo Rosso per sei raccolti. Al settimo ha cambiato strada. Il villaggio non lo sa ancora.", s: { forza: 5, mira: 1, cuore: 2 } },
    sn_shino: { n: "Shino", icon: "🪷", role: "Monaca guerriera · Cura", pow: "cura", d: "Custodisce la campana del tempio sul passo. Cura le ferite e le porte, con la stessa pazienza.", s: { forza: 3, mira: 2, cuore: 5 } },
    sn_hayate: { n: "Hayate", icon: "⚡", role: "Spadaccino testa calda · Lama", pow: "lama", d: "Diciannove anni e la spada più veloce della provincia. Non ha mai perso. Non ha mai neanche combattuto davvero.", s: { forza: 4, mira: 3, cuore: 1 } },
    sn_okuma: { n: "Okuma", icon: "⚒️", role: "Fabbro gigante · Muro", pow: "muro", d: "Due metri di fabbro e una voce da usignolo. Le porte che rinforza lui non cadono: si piegano e basta.", s: { forza: 5, mira: 1, cuore: 3 } },
    sn_tetsu: { n: "Tetsu", icon: "🎣", role: "Finto samurai · Rete", pow: "rete", d: "Dice di essere un samurai. Ha una spada troppo lunga, un albero genealogico rubato e una rete da pesca vera.", s: { forza: 3, mira: 2, cuore: 4 } },
    sn_ren: { n: "Ren", icon: "🌙", role: "Ombra a pagamento · Arco", pow: "arco", d: "Lancia coltelli e sorrisi. Si fa pagare in anticipo e non dice mai per chi ha lavorato prima.", s: { forza: 2, mira: 4, cuore: 1 } },
    sn_yumi: { n: "Yumi", icon: "🌺", role: "Danzatrice e guaritrice · Cura", pow: "cura", d: "Ha ballato per tre signori e ne ha curati due. Il terzo non lo nomina mai.", s: { forza: 1, mira: 3, cuore: 4 } },
    sn_masa: { n: "Masa", icon: "🐟", role: "Vecchio pescatore · Rete", pow: "rete", d: "Settant'anni di fiume. Getta la rete a occhi chiusi e prende quello che vuole: pesci, polli, predoni.", s: { forza: 2, mira: 4, cuore: 3 } }
  };
  const FIT = { n: { sn_kiku: 2, sn_ren: 2, sn_kanbei: 1, sn_masa: 1 }, e: { sn_okuma: 2, sn_gonta: 2, sn_hayate: 1 }, s: { sn_shino: 2, sn_yumi: 2, sn_tetsu: 1, sn_kanbei: 1 }, o: { sn_hayate: 2, sn_masa: 2, sn_tetsu: 2, sn_gonta: 1 } };
  const roles = {};
  [["n", "Porta Nord", "⬆️", "Sul sentiero del passo: da qui arrivano i cavalieri. Serve qualcuno che colpisca da lontano."], ["e", "Porta Est", "➡️", "Il ponte sul fiume: stretto, si regge a forza di braccia."], ["s", "Porta Sud", "⬇️", "Davanti alle case delle famiglie: chi la tiene deve saper curare."], ["o", "Porta Ovest", "⬅️", "Le risaie allagate: i predoni arrivano lenti, e una rete li ferma."]].forEach(([k, n, icon, d]) => { roles[k] = { n, icon, d, fit: FIT[k] }; });
  const E = window.__sagaCore.create({
    id: "sasso", key: "ali-di-rondine.sasso", title: "Sette per Sasso Nero", icon: "🏯", bg: "sn_titolo", chapters: 5, travel: true,
    menuSub: "Ogni raccolto i predoni di Corvo Rosso scendono dal passo. Tu, ronin col pallone da kemari, hai tre sacchi di riso per trovare sei compagni. Poi c'è l'ultima notte.",
    theme: { accent: "#ef4444", ink: "#1c1210", paper: "rgba(250,246,236,.97)", font: "Georgia, 'Times New Roman', serif", chipBg: "#fecaca", chipBorder: "#991b1b" },
    stats: { onore: [0, 12, 0, "Onore"], pieta: [0, 12, 0, "Pietà"], riso: [0, 30, 6, "Sacchi di riso"], legno: [0, 40, 0, "Legno"] },
    weight: { name: "La lama", axes: { onore: ["Onore", "🗡️"], pieta: ["Pietà", "🌾"] } },
    item: ["Chicco d'oro", "Chicchi d'oro"],
    drawItem(g, x, y, i, f) {
      g.save(); g.translate(x, y + Math.sin(f / 11 + i) * 1.5); g.fillStyle = "#facc15"; g.beginPath(); g.ellipse(0, 0, 2.4, 4, 0.4, 0, 7); g.fill();
      g.fillStyle = "#fef08a"; g.fillRect(-0.5, -2.5, 1, 3); g.globalAlpha = 0.3 + 0.25 * Math.sin(f / 8 + i); g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill(); g.restore();
    },
    regions: {
      villaggio: { grass: ["#6b8e4a", "#638545", "#739652"], path: ["#a68a5b", "#9a7f53"], stone: ["#8a8a80", "#808076"], wall: ["#7c5a36", "#6f5030"], water: ["#4d7c99", "#47738f"], tall: "#5f7f3f", tree: ["#2f5a2a", "#3a6a34", "#46783e"], tint: "255,220,170", tintA: 0.08, fx: "petals", dark: 0.1 },
      citta: { grass: ["#7a8a4a", "#728245", "#829350"], path: ["#c2a878", "#b89e6e"], stone: ["#a8a29e", "#9c968f"], wall: ["#e5e7eb", "#d6d3d1"], water: ["#4d7c99", "#47738f"], tall: "#6a7a3a", tree: ["#2f5a2a", "#3a6a34", "#46783e"], tint: "255,210,150", tintA: 0.08, fx: "", dark: 0.08 },
      casa: { grass: ["#7c5a36", "#735433", "#866139"], path: ["#a68a5b", "#9a7f53"], stone: ["#78716c", "#6f6863"], wall: ["#3f2a1a", "#352316"], water: ["#1e3a5f", "#1b3456"], tall: "#735433", tint: "255,180,110", tintA: 0.14, fx: "dust", dark: 0.2 },
      passo: { grass: ["#7d8f6a", "#748562", "#869872"], path: ["#a8a29e", "#9c968f"], stone: ["#78716c", "#6f6863"], wall: ["#57534e", "#4f4b46"], water: ["#5b8aa6", "#55819b"], tall: "#6b7d5a", tree: ["#1f3a24", "#284a2e", "#305536"], tint: "220,230,255", tintA: 0.1, fx: "snow", dark: 0.12 },
      tempio: { grass: ["#57534e", "#4f4b46", "#5f5b55"], path: ["#78716c", "#6f6863"], stone: ["#a8a29e", "#9c968f"], wall: ["#292524", "#22201e"], water: ["#1e3a5f", "#1b3456"], tall: "#4f4b46", tint: "255,200,140", tintA: 0.14, fx: "dust", dark: 0.24 },
      bosco: { grass: ["#3f6212", "#365314", "#4d7c0f"], path: ["#6b5a3a", "#635334"], stone: ["#57534e", "#4f4b46"], wall: ["#1a2e05", "#14240a"], water: ["#2f5f6f", "#2b5866"], tall: "#365314", tree: ["#14532d", "#166534", "#15803d"], tint: "190,240,170", tintA: 0.12, fx: "leaves", dark: 0.22 },
      notte: { grass: ["#2a3a2a", "#253425", "#2f412f"], path: ["#4a3a28", "#433424"], stone: ["#44403c", "#3c3835"], wall: ["#3f2a1a", "#352316"], water: ["#1e3a5f", "#1b3456"], tall: "#253425", tree: ["#14281a", "#1a3322", "#203d28"], tint: "120,140,220", tintA: 0.2, fx: "rain", dark: 0.38 },
      campo: { grass: ["#9a9a5b", "#919153", "#a3a364"], path: ["#c2a878", "#b89e6e"], stone: ["#a8a29e", "#9c968f"], wall: ["#7c5a36", "#6f5030"], water: ["#4d7c99", "#47738f"], tall: "#8a8a4a", tree: ["#2f5a2a", "#3a6a34", "#46783e"], tint: "255,230,170", tintA: 0.08, fx: "petals", dark: 0.06 }
    },
    floors: "QYZ", solid: "RPFXVOIECAKMGSJ",
    floorPaint(K, f, sx, sy, tx, ty, fr) {
      const g = K.g;
      if (f === "Q") { FX.sand(g, sx, sy, tx, ty, fr, K, ["#9c8257", "#8f7650"]); if ((tx * 5 + ty * 3) % 13 === 0) { g.fillStyle = "rgba(60,40,20,.25)"; g.fillRect(sx + 4, sy + 10, 4, 1); } return true; }
      if (f === "Y") { g.fillStyle = (tx + ty) % 2 ? "#d6c9a8" : "#cfc19d"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#3f2a1a"; if ((tx + ty) % 2) g.fillRect(sx, sy, 16, 1); else g.fillRect(sx, sy, 1, 16); g.fillStyle = "rgba(90,70,40,.15)"; for (let i = 2; i < 16; i += 3) g.fillRect(sx + i, sy + 1, 1, 14); return true; }
      if (f === "Z") { FX.cobble(g, sx, sy, tx, ty, fr, K, ["#a8a29e", "#9c968f"]); return true; }
      return false;
    },
    paint: {
      // risaia: acqua bassa a specchio con le piantine in fila
      R(K, sx, sy, tx, ty, fr) {
        const g = K.g, R0 = K.ZX.rg; g.fillStyle = (R0.water || ["#4d7c99"])[(tx + ty) % 2]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx + ((fr / 8 + tx * 5) % 14), sy + 4 + (ty % 3) * 3, 3, 1);
        g.fillStyle = "#4d7c0f"; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const x = sx + 2 + i * 4, y = sy + 3 + j * 5, w = Math.sin(fr / 30 + i + tx) * 0.6; g.fillRect(x + w, y, 1, 3); g.fillRect(x + 1 + w, y - 1, 1, 2); }
        if (ty % 4 === 0) { g.fillStyle = "#6b5a3a"; g.fillRect(sx, sy, 16, 1.5); }
      },
      // palizzata di pali appuntiti, legati con la corda
      P(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 13, 16, 3);
        for (let i = 0; i < 4; i++) { const x = sx + 1 + i * 4; g.fillStyle = i % 2 ? "#8b5a2b" : "#7c4a22"; g.fillRect(x, sy + 2, 3, 12); g.beginPath(); g.moveTo(x, sy + 2); g.lineTo(x + 1.5, sy - 2); g.lineTo(x + 3, sy + 2); g.fill(); }
        g.fillStyle = "#d6b370"; g.fillRect(sx, sy + 5, 16, 1); g.fillRect(sx, sy + 10, 16, 1);
      },
      // fossato con l'acqua scura e i paletti
      F(K, sx, sy, tx, ty, fr) {
        const g = K.g; g.fillStyle = "#5b4636"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#1e3a5f"; g.fillRect(sx + 1, sy + 3, 14, 10); g.fillStyle = "rgba(255,255,255,.15)"; g.fillRect(sx + 2 + ((fr / 6 + tx * 3) % 10), sy + 6, 3, 1);
        g.fillStyle = "#3f2a1a"; g.fillRect(sx + 3, sy + 1, 1, 4); g.fillRect(sx + 11, sy + 1, 1, 4);
      },
      // trappola: buca coperta di frasche con le punte
      X(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3f2a1a"; g.fillRect(sx + 2, sy + 4, 12, 9); g.fillStyle = "#a16207"; for (let i = 0; i < 5; i++) g.fillRect(sx + 3 + i * 2.3, sy + 4 + (i % 2) * 2, 2, 1);
        g.fillStyle = "#e5e7eb"; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx + 3 + i * 3, sy + 13); g.lineTo(sx + 4 + i * 3, sy + 8); g.lineTo(sx + 5 + i * 3, sy + 13); g.fill(); }
      },
      // torretta di bambù con la piattaforma dell'arciere
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 2, sy + 13, 13, 3);
        g.fillStyle = "#65a30d"; g.fillRect(sx + 3, sy - 4, 2, 18); g.fillRect(sx + 11, sy - 4, 2, 18); g.fillStyle = "#4d7c0f"; g.fillRect(sx + 3, sy + 4, 10, 1); g.fillRect(sx + 3, sy + 9, 10, 1);
        g.fillStyle = "#a16207"; g.fillRect(sx + 1, sy - 6, 14, 3); g.fillStyle = "#854d0e"; g.beginPath(); g.moveTo(sx, sy - 6); g.lineTo(sx + 8, sy - 11); g.lineTo(sx + 16, sy - 6); g.fill();
      },
      // cantiere: picchetti e una corda, aspetta che ci costruisci qualcosa
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.strokeStyle = "rgba(250,204,21,.85)"; g.lineWidth = 1; g.setLineDash([2, 2]); g.strokeRect(sx + 2.5, sy + 4.5, 11, 9); g.setLineDash([]);
        g.fillStyle = "#78350f"; [[2, 4], [13, 4], [2, 13], [13, 13]].forEach(([x, y]) => g.fillRect(sx + x, sy + y - 3, 1.5, 4));
        const p = 0.4 + 0.3 * Math.sin(fr / 10 + tx); g.fillStyle = `rgba(250,204,21,${p})`; g.font = "7px serif"; g.textAlign = "center"; g.fillText("🔨", sx + 8, sy + 11);
      },
      // torii rosso
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#b91c1c"; g.fillRect(sx + 2, sy - 2, 2, 16); g.fillRect(sx + 12, sy - 2, 2, 16); g.fillRect(sx, sy - 4, 16, 3); g.fillStyle = "#1c1917"; g.fillRect(sx - 1, sy - 6, 18, 2); g.fillStyle = "#991b1b"; g.fillRect(sx + 1, sy + 1, 14, 1.5);
      },
      // lanterna di pietra tōrō
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 3, sy + 13, 10, 3); g.fillStyle = "#a8a29e"; g.fillRect(sx + 6, sy + 8, 4, 6); g.fillRect(sx + 4, sy + 13, 8, 2); g.fillRect(sx + 4, sy + 3, 8, 5);
        g.fillStyle = "#78716c"; g.beginPath(); g.moveTo(sx + 2, sy + 3); g.lineTo(sx + 8, sy - 1); g.lineTo(sx + 14, sy + 3); g.fill(); g.fillStyle = `rgba(253,186,116,${0.6 + 0.3 * Math.sin(fr / 7 + tx)})`; g.fillRect(sx + 6, sy + 4, 4, 3); K.light(sx + 8, sy + 5, 18, "253,186,116", 0.2);
      },
      // la campana del tempio sotto la tettoia
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, sw = Math.sin(fr / 40) * 0.8; g.fillStyle = "#1c1917"; g.fillRect(sx, sy - 4, 16, 2); g.fillRect(sx + 1, sy - 2, 1.5, 16); g.fillRect(sx + 13.5, sy - 2, 1.5, 16);
        g.fillStyle = "#a16207"; g.fillRect(sx + 4 + sw, sy, 8, 9); g.beginPath(); g.arc(sx + 8 + sw, sy + 9, 4, 0, Math.PI); g.fill(); g.fillStyle = "#854d0e"; g.fillRect(sx + 4 + sw, sy + 3, 8, 1);
      },
      // bambù fitto
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; for (let i = 0; i < 3; i++) { const x = sx + 2 + i * 5 + ((tx + i) % 2), w = Math.sin(fr / 40 + tx + i) * 0.8; g.fillStyle = ["#65a30d", "#4d7c0f", "#84cc16"][i]; g.fillRect(x + w, sy - 8, 2.5, 22); g.fillStyle = "#365314"; g.fillRect(x + w, sy - 2, 2.5, 1); g.fillRect(x + w, sy + 6, 2.5, 1); g.fillStyle = "#4d7c0f"; g.fillRect(x + w + 2, sy - 6 + i * 3, 4, 1.5); }
      },
      // albero del campo da kemari (pino, ciliegio, salice, acero a seconda della casella)
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, c = ["#14532d", "#f9a8d4", "#65a30d", "#dc2626"][(tx + ty * 3) % 4]; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 6, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#5b3a22"; g.fillRect(sx + 7, sy + 4, 2, 10); g.fillStyle = c; g.beginPath(); g.arc(sx + 8, sy + 1, 6, 0, 7); g.fill(); g.beginPath(); g.arc(sx + 4, sy + 4, 4, 0, 7); g.fill(); g.beginPath(); g.arc(sx + 12, sy + 4, 4, 0, 7); g.fill();
      },
      // ruota del mulino ad acqua
      M(K, sx, sy, tx, ty, fr) {
        const g = K.g, R0 = K.ZX.rg; g.fillStyle = (R0.water || ["#4d7c99"])[0]; g.fillRect(sx, sy, 16, 16); g.save(); g.translate(sx + 8, sy + 8); g.rotate(fr / 30); g.strokeStyle = "#78350f"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.stroke();
        for (let i = 0; i < 8; i++) { g.rotate(Math.PI / 4); g.fillStyle = "#a16207"; g.fillRect(5, -1, 3, 2); } g.restore();
      },
      // rastrelliera con lance e spade
      G(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5b3a22"; g.fillRect(sx + 1, sy + 4, 14, 2); g.fillRect(sx + 1, sy + 12, 14, 2);
        for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#cbd5e1" : "#78350f"; g.fillRect(sx + 2 + i * 3.5, sy - 4, 1.5, 17); } g.fillStyle = "#e5e7eb"; g.fillRect(sx + 5, sy - 6, 1.5, 3); g.fillRect(sx + 12, sy - 6, 1.5, 3);
      },
      // gogna del mercato: asse di legno sui pali, con i buchi
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 1, sy + 13, 14, 3); g.fillStyle = "#5b3a22"; g.fillRect(sx + 2, sy + 4, 2, 10); g.fillRect(sx + 12, sy + 4, 2, 10);
        g.fillStyle = "#8b5a2b"; g.fillRect(sx, sy + 3, 16, 5); g.fillStyle = "#3f2a1a"; g.beginPath(); g.arc(sx + 8, sy + 5.5, 1.8, 0, 7); g.fill(); g.beginPath(); g.arc(sx + 3.5, sy + 5.5, 1, 0, 7); g.fill(); g.beginPath(); g.arc(sx + 12.5, sy + 5.5, 1, 0, 7); g.fill();
      },
      // ciliegio in fiore
      S(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 7, 2, 0, 0, 7); g.fill(); g.fillStyle = "#5b3a22"; g.fillRect(sx + 7, sy + 3, 2.5, 11);
        g.fillStyle = "#f9a8d4"; [[8, -1, 7], [3, 3, 5], [13, 3, 5], [8, 4, 5]].forEach(([x, y, r]) => { g.beginPath(); g.arc(sx + x, sy + y, r, 0, 7); g.fill(); }); g.fillStyle = "#fbcfe8"; g.fillRect(sx + 5, sy, 2, 2); g.fillRect(sx + 10, sy + 2, 2, 2);
        g.fillStyle = "rgba(251,207,232,.8)"; g.fillRect(sx + ((fr / 3 + tx * 7) % 16), sy + 8 + ((fr / 2 + ty * 3) % 8), 1.5, 1);
      }
    },
    act: { P: "Guarda la palizzata", F: "Guarda il fossato", X: "Guarda la trappola", V: "Guarda la torretta", O: "🔨 Costruisci", I: "Guarda il torii", E: "Guarda la lanterna", C: "Guarda la campana", A: "Guarda il bambù", K: "Guarda l'albero", M: "Guarda il mulino", G: "Guarda le armi", S: "Guarda il ciliegio", J: "Guarda la gogna" },
    flavor: { R: "La risaia: acqua alla caviglia e piantine in fila come soldati. Fra un mese, il raccolto.", I: "Un torii rosso. Si passa sotto a capo chino: dall'altra parte, gli dèi fanno finta di non vederti.", E: "Una lanterna di pietra. La accendono per i morti e per chi torna tardi.", A: "Bambù fitto. Col vento fa il rumore di mille flauti stonati.", K: "Uno dei quattro alberi del campo da kemari: pino, ciliegio, salice, acero. Si gioca fra le stagioni.", M: "La ruota del mulino. Gira anche quando nessuno macina: il vecchio Manzo dice che così non si annoia.", G: "Lance di bambù fatte dai contadini. Sono più storte del manico di una zappa.", S: "Un ciliegio in fiore. I petali cadono anche quando nessuno guarda." },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi sul bordo della risaia e guardi l'acqua. Il gioco salva da solo; dal menu puoi rileggere il Rotolo dei Sette." },
    texts: { nothing: "Niente di speciale. Solo il vento sul riso e una rana che giudica.", noHero: "Il villaggio non apre la porta a uno senza nome. Crea prima il tuo Campione.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Qualcuno ci teneva del riso, una volta." },
    journal: { name: "Il Rotolo dei Sette", sub: "I compagni, le difese, le porte, chi c'è ancora" },
    // LA COMPAGNIA: dieci candidati, sei posti (più il Campione)
    crew: { name: "I Sette", field: 6, members: MEM },
    // IL PIANO: chi difende quale porta, ogni notte
    plan: { name: "Le Porte", roles, hints: true },
    // LE COSTRUZIONI (novità del core, opt-in): cantieri «O» sulle mappe, si costruisce con il legno, resta tra i capitoli
    build: {
      name: "Le Difese del villaggio", res: "legno", empty: "O",
      kinds: {
        palizzata: { n: "Palizzata", icon: "🪵", tile: "P", cost: 3, d: "Pali appuntiti: la porta vicina regge più colpi." },
        fossato: { n: "Fossato", icon: "🌊", tile: "F", cost: 2, d: "Acqua e fango: i predoni rallentano prima della porta." },
        trappola: { n: "Trappola", icon: "🪤", tile: "X", cost: 1, d: "Buca con le punte: colpisce i primi che arrivano." },
        torretta: { n: "Torretta", icon: "🗼", tile: "V", cost: 4, d: "Una piattaforma di bambù: tira frecce da sola." }
      },
      sites: {
        n1: { zone: "sn_villaggio", at: [14, 3], tag: "n", n: "Porta Nord, a sinistra" }, n2: { zone: "sn_villaggio", at: [19, 3], tag: "n", n: "Porta Nord, a destra" },
        e1: { zone: "sn_villaggio", at: [30, 9], tag: "e", n: "Porta Est, in alto" }, e2: { zone: "sn_villaggio", at: [30, 14], tag: "e", n: "Porta Est, in basso" },
        s1: { zone: "sn_villaggio", at: [14, 20], tag: "s", n: "Porta Sud, a sinistra" }, s2: { zone: "sn_villaggio", at: [19, 20], tag: "s", n: "Porta Sud, a destra" },
        o1: { zone: "sn_villaggio", at: [3, 9], tag: "o", n: "Porta Ovest, in alto" }, o2: { zone: "sn_villaggio", at: [3, 14], tag: "o", n: "Porta Ovest, in basso" }
      },
      when: (K) => K.F.is("sn_cantieri")
    },
    bonds: {
      per: 4, talk: 2, max: 5, names: ["Sconosciuti", "Ronin di passaggio", "Compagni di riso", "Fratelli d'arme", "I Sette", "Famiglia"],
      scenes: {
        sn_kanbei: [
          { lv: 2, id: "kan2", prize: "+1 Pietà", lines: [["sn_kanbei", "[pensa] Ho perso trenta battaglie. Tutte dalla parte giusta. Sai cosa ti insegna, perdere dalla parte giusta? Che la parte giusta non basta."], ["sn_kanbei", "Basta la gente che resta in piedi alla fine. Il resto è poesia, e i poeti muoiono presto."]], reward: (K) => K.bond("pieta", 1) },
          { lv: 4, id: "kan4", prize: "+1 Onore", lines: [["sn_kanbei", "[triste] Avevo un allievo. Ti somigliava: calciava le cose invece di tagliarle. È rimasto sul campo, a Nagashino. Avevo detto io: «a destra»."], ["sn_kanbei", "Quando dico «a destra», adesso, guardo bene. Ricordamelo, se mi vedi sicuro."]], reward: (K) => K.bond("onore", 1) }
        ],
        sn_kiku: [
          { lv: 2, id: "kik2", prize: "+1 Onore", lines: [["sn_kiku", "Mio fratello Jirō aveva otto anni. Corvo Rosso l'ha preso per tenere i cavalli. Non l'ho più rivisto."], ["sn_kiku", "[serio] Non chiedermi se lo cerco. Chiedimi quante frecce ho. Sono quarantadue."]], reward: (K) => K.bond("onore", 1) },
          { lv: 4, id: "kik4", prize: "Freccia di Jirō", lines: [["sn_kiku", "[pensa] Questa me l'aveva intagliata lui, col coltello da cucina. È storta. Non l'ho mai tirata."], ["sn_kiku", "Tienila tu. Se un giorno la tiro, voglio che sia perché me l'hai ridata."]], reward: (K) => K.inv.give("sn_freccia") }
        ],
        sn_gonta: [
          { lv: 2, id: "gon2", prize: "+1 Pietà", lines: [["sn_gonta", "[triste] Sei raccolti con Corvo. Sai cosa si fa, il giorno dopo? Si conta il riso. Non le persone. Il riso."], ["sn_gonta", "Al settimo ho contato le persone. Una era una bambina col mio stesso naso. Me ne sono andato a piedi, di notte."]], reward: (K) => K.bond("pieta", 1) }
        ],
        sn_tetsu: [
          { lv: 2, id: "tet2", prize: "+1 Pietà", lines: [["sn_tetsu", "[ride] Il mio albero genealogico? L'ho vinto ai dadi. C'è scritto «Kikuchi Tetsunosuke, nato nell'anno del cavallo». Io sono nato nell'anno del topo. Del topo!"], ["sn_tetsu", "[serio] Però so pescare. E so cosa vuol dire quando i predoni arrivano in un villaggio. L'ho visto da sotto un pavimento. Avevo sei anni."]], reward: (K) => K.bond("pieta", 1) }
        ]
      }
    },
    inv: {
      items: {
        sn_kemari: { n: "Palla da kemari", icon: "🏐", d: "Pelle di cervo cucita a mano, leggera come un'idea. Nello zaino: i tuoi calci arrivano un po' più lontano nell'Ultima Notte.", match: { at: 1 } },
        sn_ferro: { n: "Sabbia di ferro", icon: "⚫", d: "Sabbia nera del fiume, quella buona per le lame. Pesa come un rimorso.", gift: { sn_okuma: 8 }, giftAny: 0, react: { sn_okuma: "[felice] Sabbia del fiume Kuro! Questa è quella buona. Con questa ti faccio una porta che respira." } },
        sn_sake: { n: "Fiasca di sakè", icon: "🍶", d: "Sakè della locanda, annacquato quanto basta per essere ancora legale.", gift: { sn_kanbei: 4, sn_gonta: 5, sn_masa: 5, sn_okuma: 3 }, giftAny: 2, react: { sn_gonta: "Sakè! L'ultima volta che l'ho bevuto, ero dalla parte sbagliata. Vediamo com'è da questa." } },
        sn_onigiri: { n: "Onigiri di Shinobu", icon: "🍙", d: "Riso pressato a triangolo, con una prugna salata in mezzo. Chi lo mangia si ricorda di casa.", gift: { sn_tetsu: 6, sn_hayate: 5, sn_kiku: 4, sn_yumi: 4 }, giftAny: 2, react: { sn_tetsu: "[felice] Con la prugna! Mia madre ci metteva la prugna. Cioè... la madre di un samurai, ci metteva la prugna." } },
        sn_freccia: { n: "Freccia di Jirō", icon: "🪶", d: "Una freccia storta, intagliata con un coltello da cucina da un bambino di otto anni.", gift: { sn_kiku: 10 }, giftAny: 0 },
        sn_campanella: { n: "Campanella del tempio", icon: "🔔", d: "Una campanella di bronzo staccata dalla grande campana del passo. Suona da sola quando qualcuno ha paura.", match: { df: 1 }, gift: { sn_shino: 6 }, giftAny: 1 }
      }
    },
    clock: { slots: ["Alba", "Giorno", "Sera", "Notte"], hud: true, tint: ["rgba(255,190,140,.06)", null, "rgba(255,150,80,.08)", "rgba(20,30,90,.26)"], onSlot(K, giorno, fascia, nome) { return nome === "Notte" ? [["voce", "Notte. Sulla palizzata le fiaccole tremano. Da qualche parte, sul passo, un cavallo nitrisce."]] : nome === "Alba" ? [["voce", `Alba del giorno ${giorno}. Le donne sono già nelle risaie, piegate a cantare.`]] : null; } },
    endings: {
      raccolto: ["Il Raccolto", "L'alba trova Sasso Nero in piedi e quasi tutti i sette vivi. Il riso viene tagliato cantando. Corvo Rosso non scenderà più dal passo.", "Vinci l'ultima notte con almeno cinque compagni vivi."],
      tumuli: ["I Tumuli sulla Collina", "Il villaggio è salvo. Sulla collina, sotto il ciliegio, ci sono spade piantate nella terra. «Abbiamo perso di nuovo», dice Kanbei. «Hanno vinto i contadini.»", "Vinci l'ultima notte, ma con quattro compagni o meno."],
      resta: ["Il Ronin che Resta", "Gli altri ripartono per le strade. Tu no: posi la spada, tieni il pallone e la sera insegni il kemari ai bambini di Sasso Nero.", "Vinci, con più Pietà che Onore, e scegli di restare."],
      nessuno: ["Nessuna Tomba", "Segreto: all'alba i sette sono tutti in piedi, il villaggio ha confessato il suo segreto e qualcuno è tornato a casa dall'accampamento. Sulla collina, solo il ciliegio.", "Segreto: tutti e sei i compagni vivi, il segreto della soffitta perdonato e Jirō salvato."]
    },
    heroLook: () => ({ bg: ["#7f1d1d", "#fca5a5"], shirt: "#7f1d1d" }),
    heroTitle: () => "ronin col pallone da kemari",
    musicMain: "sasso",
    music: { sasso: { bpm: 84, chords: ["Am", "F", "G", "Am", "Dm", "Am", "E", "Am"], lres: 2, lw: "triangle", lv: 0.03,
      lead: "A4 - C5 - D5 - E5 - | E5 - - - D5 - C5 - | A4 - - - G4 - A4 - | - - - - - - - - | D5 - E5 - G5 - E5 - | D5 - C5 - A4 - - - | B4 - C5 - B4 - G4 - | A4 - - - - - - -",
      bass: "R . . . 5 . . . R . . . 5 . . .", bv: 0.1, arp: "1 5 8 5 1 5 8 5", aw: "sine", av: 0.012, drum: "k . . . . . s . k . . k . . s .", dv: 0.08 } },
    party: (K) => K.crew.field().filter((id) => !K.F.is("sn_morto_" + id)).slice(0, 3),
    guide: () => [["🏯 L'Ultima Notte", "Difendi il villaggio a ondate: tocchi la mappa per correre, il Campione calcia da solo al predone più vicino. Le porte reggono con le costruzioni e con chi le difende. Se una porta cade, i predoni vanno al granaio."], ["🔨 Le Costruzioni", "Sui cantieri (i picchetti gialli 🔨) costruisci con il legno: palizzata, fossato, trappola, torretta. Quello che costruisci resta, capitolo dopo capitolo. Si smonta e il legno torna indietro a metà."], ["⚔️ I Sette", "Dieci candidati, sei posti. Ognuno ha un prezzo (riso, una prova, un favore) e un modo di difendere una porta. Dal menu, Le Porte: chi va dove."]],
    cameos: [],
    guest: { id: "sn_kanbei", lines: ["Kanbei, ronin. Ho attraversato tre province per arrivare qui. Mi hanno detto che il vostro bar fa un riso decente.", "Se vedi qualcuno contare i nemici prima di sedersi, sono io. È un vizio. Peggio del sakè, meglio della morte."] },
    onReady(K) { window.__sassoH(K).people(); }
  });
  window.__sassoH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1c1917", skin: "#e8c4a0" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(28,18,16,.88)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#ef4444"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = "#fef3c7"; g.textAlign = "center"; g.fillText(txt, x, y + 2.5); g.restore(); },
      stato: () => `🗡️ Onore ${K.stat("onore")} · 🌾 Pietà ${K.stat("pieta")} · 🍚 Riso ${K.stat("riso")} · 🪵 Legno ${K.stat("legno")} · ⚔️ Compagni ${K.crew.count()}/6`,
      // vivi: i compagni reclutati che non sono caduti
      alive: () => K.crew.list().filter((id) => !K.F.is("sn_morto_" + id)),
      // reclutamento con il prezzo in riso (0 = gratis): torna false se il riso non basta
      hire(id, cost, txt) { if ((cost | 0) > K.stat("riso")) return false; if (cost) K.bond("riso", -cost); K.crew.recruit(id); H.say("voce", txt || `${MEM[id].n} si unisce ai Sette. ${H.count()}`); return true; },
      count: () => `<b>⚔️ Compagni: ${K.crew.count()}/6</b>`,
      // le difese di una porta dalle costruzioni: palizzate, fossato, trappole, torretta
      gate(tag) { const B = K.build, L = B ? B.list(tag) : []; const n = (k) => L.filter((x) => x.kind === k).length; return { def: n("palizzata"), ditch: n("fossato") > 0, trap: n("trappola"), tower: n("torretta") > 0 }; },
      // l'Ultima Notte: assegna le porte dal Piano e gioca; o.waves, o.rain, o.title
      night(o, cb) {
        const m = K.plan.last(), gates = {};
        ["n", "e", "s", "o"].forEach((k) => { const id = m[k], g = H.gate(k); if (id && MEM[id] && !K.F.is("sn_morto_" + id)) g.who = { id, n: MEM[id].n, pow: MEM[id].pow }; gates[k] = g; });
        K.say(H.flush(), () => K.minigame(window.__notte.start, Object.assign({ title: "L'Ultima Notte", gates }, o), (r) => cb(r, m)));
      },
      people() {
        H.cast("sn_kanbei", "Kanbei", "Vecchio stratega", { style: "bald", hair: "#57534e", shirt: "#57534e", skin: "#d9a679", beard: "corta", bg: ["#292524", "#e7e5e4"] }, MEM.sn_kanbei.d);
        H.cast("sn_kiku", "Kiku", "Arciera del bosco", { style: "ponytail", hair: "#1c1917", shirt: "#14532d", skin: "#efcfb0", eye: "#1c1917", bg: ["#052e16", "#86efac"] }, MEM.sn_kiku.d);
        H.cast("sn_gonta", "Gonta", "Ex predone", { style: "messy", hair: "#292524", shirt: "#7c2d12", skin: "#c8956a", beard: "folta", bg: ["#450a0a", "#fca5a5"] }, MEM.sn_gonta.d);
        H.cast("sn_shino", "Shino", "Monaca guerriera", { style: "bald", hair: "#e7e5e4", shirt: "#e5e7eb", skin: "#efcfb0", eye: "#44403c", acc: ["fascia"], bg: ["#44403c", "#f5f5f4"] }, MEM.sn_shino.d);
        H.cast("sn_hayate", "Hayate", "Spadaccino testa calda", { style: "spiky", hair: "#1c1917", shirt: "#1e3a8a", skin: "#f1d1b0", eye: "#1e3a8a", bg: ["#172554", "#93c5fd"] }, MEM.sn_hayate.d);
        H.cast("sn_okuma", "Okuma", "Fabbro gigante", { style: "curly", hair: "#44403c", shirt: "#78350f", skin: "#b9805a", beard: "folta", bg: ["#431407", "#fdba74"] }, MEM.sn_okuma.d);
        H.cast("sn_tetsu", "Tetsu", "Finto samurai", { style: "messy", hair: "#292524", shirt: "#a16207", skin: "#e0ac7e", eye: "#3f2a1a", acc: ["fascia"], bg: ["#713f12", "#fde68a"] }, MEM.sn_tetsu.d);
        H.cast("sn_ren", "Ren", "Ombra a pagamento", { style: "long", hair: "#0c0a09", shirt: "#1e1b4b", skin: "#f1d1b0", eye: "#4c1d95", bg: ["#1e1b4b", "#c4b5fd"] }, MEM.sn_ren.d);
        H.cast("sn_yumi", "Yumi", "Danzatrice e guaritrice", { style: "bun", hair: "#1c1917", shirt: "#be185d", skin: "#f5d5c0", eye: "#3f2a1a", acc: ["fiore"], bg: ["#831843", "#fbcfe8"] }, MEM.sn_yumi.d);
        H.cast("sn_masa", "Masa", "Vecchio pescatore", { style: "bald", hair: "#d6d3d1", shirt: "#334155", skin: "#c8956a", beard: "baffi", acc: ["cappello"], bg: ["#1e293b", "#cbd5e1"] }, MEM.sn_masa.d);
        H.cast("sn_gisaku", "Nonno Gisaku", "Anziano di Sasso Nero", { style: "bald", hair: "#e7e5e4", shirt: "#57534e", skin: "#d9a679", beard: "lunga", bg: ["#44403c", "#e7e5e4"] }, "L'anziano del villaggio. Ha visto settanta raccolti e trenta predoni. Ha un'idea: «compriamo dei samurai affamati».");
        H.cast("sn_rikichi", "Rikichi", "Contadino", { style: "messy", hair: "#292524", shirt: "#7c5a36", skin: "#c8956a", eye: "#1c1917", bg: ["#3f2a1a", "#d6b370"] }, "Giovane contadino, sempre arrabbiato. Non parla mai di sua moglie. Nessuno, nel villaggio, ne parla.");
        H.cast("sn_shinobu", "Shinobu", "Figlia del mugnaio", { style: "ponytail", hair: "#1c1917", shirt: "#0e7490", skin: "#f5d5c0", eye: "#1c1917", bg: ["#164e63", "#a5f3fc"] }, "Figlia di Manzo il mugnaio. Fa gli onigiri migliori della valle e calcia la palla da kemari meglio di tutti i ragazzi.");
        H.cast("sn_manzo", "Manzo", "Il mugnaio", { style: "bald", hair: "#78716c", shirt: "#a16207", skin: "#d9a679", beard: "baffi", bg: ["#713f12", "#fde68a"] }, "Il mugnaio di Sasso Nero. Sospettoso, avaro, ha paura di tutto, soprattutto dei samurai. Ha un motivo.");
        H.cast("sn_corvo", "Corvo Rosso", "Capo dei predoni", { style: "long", hair: "#7f1d1d", shirt: "#1c1917", skin: "#d9a679", eye: "#991b1b", beard: "corta", bg: ["#1c1917", "#ef4444"] }, "Capo dei predoni del passo. Porta un mantello rosso e non alza mai la voce. Dicono che una volta fosse un samurai.");
        H.cast("sn_oste", "Locandiera Ume", "Locanda delle Tre Lanterne", { style: "bun", hair: "#57534e", shirt: "#7f1d1d", skin: "#efcfb0", eye: "#3f2a1a", bg: ["#450a0a", "#fecaca"] }, "Tiene la locanda della città del castello. Conosce tutti i ronin della provincia, e quanto devono.");
      }
    };
    return H;
  };
  window.__sasso = E.api; window.__sassoCore = E;
})();
