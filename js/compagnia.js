// js/compagnia.js - «LA COMPAGNIA DEL PALLONE SPEZZATO» · configurazione della saga sul motore comune (js/saga-core.js)
// Spezzaterra, un regno diviso in Borghi: le liti tra i signori si decidono sui Campi di Guerra, dove si combatte con i ruoli del pallone. Tu sei un nuovo arruolato
// di una Compagnia di ex calciatori mercenari, squattrinata e piena di debiti. Tono: ironico di base, con capitoli seri.
// NOVITÀ NEL CORE (opt-in, cfg.tactics): battaglie a griglia isometrica con la Compagnia (js/tattica.js, anche in Arena come «Campo di Guerra»).
// Dal core: Compagnia (cfg.crew, reclutamento), Rapporti, Inventario, Orologio, interni a mano.
// Tessere proprie: A tenda · F falò · K rastrelliera · E stendardo · C botte · W ruota del mulino · H fontana
(function () {
  "use strict";
  if (window.__compagnia || !window.__sagaCore) return;
  const rn = (a, b, k) => { const s = Math.sin(a * 127.1 + b * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const E = window.__sagaCore.create({
    id: "compagnia", key: "ali-di-rondine.compagnia", title: "La Compagnia del Pallone Spezzato", icon: "⚔️", bg: "cp_titolo", chapters: 4,
    menuSub: "Un regno diviso in Borghi, guerre decise con i ruoli del pallone e una Compagnia di mercenari senza paga. Reclutamento, battaglie a griglia, scelte che pesano.",
    theme: { accent: "#f59e0b", ink: "#fff7e6", paper: "rgba(40,22,12,.92)", font: "Georgia, 'Times New Roman', serif", chipBg: "#78350f", chipBorder: "#f59e0b" },
    stats: { grinta: [0, 9, 2, "Grinta"], onore: [0, 9, 0, "Onore"], astuzia: [0, 9, 0, "Astuzia"] },
    item: ["Frammento di pallone", "Frammenti di pallone"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); g.fillStyle = "#f5e6c8"; g.beginPath(); g.arc(0, 0, 4.5, 0, 7); g.fill(); g.strokeStyle = "#5a3a20"; g.lineWidth = 1; g.stroke(); g.beginPath(); g.moveTo(-3, -1); g.lineTo(3, 1); g.moveTo(-1, -3); g.lineTo(1, 3); g.stroke(); g.restore(); },
    regions: {
      campo: { grass: ["#5f7d44", "#567238", "#69884c"], path: ["#a8905e", "#9c8454"], stone: ["#8a8274", "#7e766a"], wall: ["#5a4632", "#4e3c2a"], water: ["#3f7aa8", "#366e9c"], tall: "#4a6a34", tree: ["#2d4a2a", "#3a5e34", "#476f3d"], tint: "255,170,90", tintA: 0.1, fx: "dust", dark: 0.14 },
      mulini: { grass: ["#7a9a4e", "#6f8e46", "#86a656"], path: ["#cdb682", "#c2ab78"], stone: ["#9a9488", "#8e887c"], wall: ["#8a5a3a", "#7c4e32"], water: ["#4a8ac0", "#3f7eb4"], tall: "#5a7e3a", tree: ["#355a30", "#427038", "#4f8040"], tint: "255,236,180", tintA: 0.06, fx: "leaves", dark: 0 },
      locanda: { grass: ["#6a4a2a", "#5e4024", "#74522f"], path: ["#8a5a30", "#7e5028"], stone: ["#7a5a3a", "#6e4e32"], wall: ["#3a2414", "#2e1c10"], water: ["#3f7aa8", "#366e9c"], tall: "#5e4024", tint: "255,170,80", tintA: 0.16, fx: "dust", dark: 0.18 },
      tenda: { grass: ["#9a7a52", "#8e6e48", "#a68258"], path: ["#b8945e", "#ac8854"], stone: ["#8a6a42", "#7e5e3a"], wall: ["#7a2a1e", "#6c2218"], water: ["#3f7aa8", "#366e9c"], tall: "#8e6e48", tint: "255,190,100", tintA: 0.14, fx: "", dark: 0.16 }
    },
    floors: "", solid: "AFKECWH",
    paint: {
      // tenda da campo: tela a spioventi con cordini e lembi aperti
      A(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, m = K.ZX.map, left = !(m[ty] && m[ty][tx - 1] === "A"), right = !(m[ty] && m[ty][tx + 1] === "A"), col = ["#b4452a", "#c9a24a", "#6a7a3a", "#4a6a8a"][(Math.floor(tx / 2) + ty) % 4];
        g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(sx, sy + 13, 16, 3);
        g.fillStyle = col; g.beginPath(); g.moveTo(sx + (left ? 1 : 0), sy + 15); g.lineTo(sx + (left ? 7 : 0), sy + 2); g.lineTo(sx + 16, sy + (right ? 15 : 2)); g.lineTo(sx + 16, sy + 15); g.closePath(); g.fill();
        g.fillStyle = "rgba(255,255,255,.14)"; g.fillRect(sx + 4, sy + 6, 1, 9); g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(sx + 11, sy + 6, 1, 9);
        if (left) { g.fillStyle = "#2a1a10"; g.fillRect(sx + 6, sy + 9, 5, 6); g.fillStyle = "rgba(255,200,120,.5)"; g.fillRect(sx + 7, sy + 10, 3, 5); }
        g.strokeStyle = "#5a3a20"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx + 7, sy + 2); g.lineTo(sx + 7, sy - 3); g.stroke(); g.fillStyle = "#e2e8f0"; g.fillRect(sx + 7, sy - 4, 5 + Math.sin(fr / 14 + tx) * 1.5, 3);
      },
      // falò con ceppi e fiamma viva (luce calda)
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6b6b6b"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(sx + 8 + Math.cos(i * 1.05) * 6.5, sy + 11 + Math.sin(i * 1.05) * 3.2, 2.1, 0, 7); g.fill(); }
        g.fillStyle = "#4a2e18"; g.fillRect(sx + 3, sy + 10, 10, 2); g.fillRect(sx + 5, sy + 8, 6, 2);
        const f = Math.sin(fr / 5 + tx) * 1.5; g.fillStyle = "#ef4444"; g.beginPath(); g.moveTo(sx + 4, sy + 11); g.lineTo(sx + 8 + f, sy + 0); g.lineTo(sx + 12, sy + 11); g.fill(); g.fillStyle = "#fb923c"; g.beginPath(); g.moveTo(sx + 5.5, sy + 11); g.lineTo(sx + 8 - f * 0.6, sy + 3); g.lineTo(sx + 10.5, sy + 11); g.fill(); g.fillStyle = "#fde68a"; g.beginPath(); g.moveTo(sx + 7, sy + 11); g.lineTo(sx + 8, sy + 6); g.lineTo(sx + 9, sy + 11); g.fill();
        K.light(sx + 8, sy + 8, 46, "255,150,60", 0.4 + Math.sin(fr / 6) * 0.05);
      },
      // rastrelliera con lance e un pallone spezzato appeso
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a3a20"; g.fillRect(sx + 1, sy + 12, 14, 2); g.fillRect(sx + 2, sy + 6, 1, 8); g.fillRect(sx + 13, sy + 6, 1, 8);
        [[4, "#cbd5e1"], [7, "#cbd5e1"], [10, "#94a3b8"]].forEach(([x, c]) => { g.fillStyle = "#7a5a3a"; g.fillRect(sx + x, sy + 2, 1, 11); g.fillStyle = c; g.beginPath(); g.moveTo(sx + x - 1, sy + 3); g.lineTo(sx + x + 0.5, sy - 1); g.lineTo(sx + x + 2, sy + 3); g.fill(); });
      },
      // stendardo della Compagnia: pallone spezzato su campo rosso
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#4a3220"; g.fillRect(sx + 7, sy - 6, 2, 21); const w = Math.sin(fr / 12 + tx) * 1.6;
        g.fillStyle = "#991b1b"; g.beginPath(); g.moveTo(sx + 9, sy - 5); g.lineTo(sx + 17 + w, sy - 3); g.lineTo(sx + 17 + w, sy + 5); g.lineTo(sx + 9, sy + 6); g.fill(); g.fillStyle = "#fbbf24"; g.beginPath(); g.arc(sx + 13, sy + 0.5, 2.6, 0.4, 5.9); g.fill();
      },
      // botte con cerchi di ferro
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.22)"; g.fillRect(sx + 2, sy + 13, 12, 2); g.fillStyle = "#7a4a22"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 6.5, 6, 0, 0, 7); g.fill(); g.fillStyle = "#946030"; g.fillRect(sx + 4, sy + 5, 3, 9); g.strokeStyle = "#3a2a1a"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(sx + 2, sy + 7); g.lineTo(sx + 14, sy + 7); g.moveTo(sx + 2, sy + 11.5); g.lineTo(sx + 14, sy + 11.5); g.stroke(); g.fillStyle = "#3a2a1a"; g.fillRect(sx + 7, sy + 8, 2, 2);
      },
      // ruota del mulino: pale che girano sull'acqua
      W(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, a = fr / 40; g.fillStyle = "#3f7eb4"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#4a3220"; g.fillRect(sx + 3, sy, 3, 16);
        g.save(); g.translate(sx + 5, sy + 8); g.strokeStyle = "#5a3a20"; g.lineWidth = 1.6; for (let i = 0; i < 4; i++) { g.save(); g.rotate(a + i * Math.PI / 2); g.beginPath(); g.moveTo(-7, 0); g.lineTo(7, 0); g.stroke(); g.fillStyle = "#7a5a3a"; g.fillRect(6, -2, 3, 4); g.fillRect(-9, -2, 3, 4); g.restore(); } g.restore();
        g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(sx + 8 + (fr % 6), sy + 4 + (tx % 3) * 3, 3, 1);
      },
      // fontana della piazza
      H(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx + 1, sy + 13, 14, 2); g.fillStyle = "#a8a296"; g.beginPath(); g.ellipse(sx + 8, sy + 11, 7.5, 4, 0, 0, 7); g.fill(); g.fillStyle = "#5aa0d8"; g.beginPath(); g.ellipse(sx + 8, sy + 10.5, 6, 2.8, 0, 0, 7); g.fill();
        g.fillStyle = "#c2bcae"; g.fillRect(sx + 7, sy + 3, 2, 8); g.fillStyle = "rgba(190,230,255,.85)"; for (let i = 0; i < 3; i++) g.fillRect(sx + 6 + i * 2 + Math.sin(fr / 6 + i) * 0.6, sy + 2 + ((fr + i * 5) % 8), 1, 2);
      }
    },
    act: { A: "Guarda la tenda", F: "Scaldati al falò", K: "Guarda la rastrelliera", E: "Guarda lo stendardo", C: "Guarda la botte", W: "Guarda la ruota", H: "Guarda la fontana", n: "Leggi il cartello", x: "Apri la cassa", s: "Riposa un momento" },
    rest: { ch: "s", label: "Riposa un momento", text: "Ti siedi un attimo. Il gioco salva da solo; qui puoi rileggere il Registro della Compagnia dal menu." },
    texts: { nothing: "Niente di utile. Solo polvere, pane duro e promesse.", noHero: "La Compagnia vuole un nome sul registro. Crea prima il tuo Campione.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Anche i debiti, a volte, svuotano le casse." },
    journal: { name: "Il Registro della Compagnia", sub: "Soldati, rapporti, debiti e finali" },
    crew: {
      name: "La Compagnia del Pallone Spezzato", field: 4,
      members: {
        cp_ludovico: { n: "Frate Ludovico", icon: "📜", role: "Regista e cassiere", d: "Tiene i conti, benedice le ferite e contesta ogni spesa. Sposta le pedine con la voce.", s: { astuzia: 2, onore: 1 }, tac: { role: "C", at: 48, df: 60, te: 74, col: "#78350f" } },
        cp_fiamma: { n: "Fiamma", icon: "🏹", role: "Tiratrice", d: "La miglior mira di Spezzaterra, a pagamento anticipato. Non sbaglia, tranne quando parla.", s: { grinta: 2 }, tac: { role: "A", at: 74, df: 46, te: 70, col: "#b45309" } },
        cp_bruno: { n: "Bruno il Muro", icon: "🛡️", role: "Difensore", d: "Quindici anni da terzino. Ha detto trentadue parole, nel tempo.", s: { grinta: 2, onore: 1 }, tac: { role: "D", at: 58, df: 80, te: 52, col: "#475569" } },
        cp_sandro: { n: "Sandro Due Dita", icon: "🧤", role: "Portiere", d: "Ha perso otto dita in sei campionati. Non si fida delle mani degli altri.", s: { astuzia: 1, onore: 1 }, tac: { role: "P", at: 40, df: 78, te: 62, col: "#166534" } }
      }
    },
    tactics: { eng: "__tattica", hero: { role: "B", at: 62, df: 60, te: 64 }, bonus: (K) => Math.floor(K.stat("grinta") / 3) },
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Sconosciuti", "Commilitoni", "Compagni", "Fidati", "Famiglia di battaglia"],
      scenes: {
        cp_ludovico: [{ lv: 2, id: "lud2", lines: [["cp_ludovico", "Tengo il registro dei debiti da undici anni. Il tuo nome, se vuoi, lo scrivo nella colonna sbagliata: quella dei crediti."], ["cp_ludovico", "È un errore contabile. Ma a volte l'errore è l'unica cosa onesta del libro."]], reward: (K) => K.bond("astuzia", 1) },
          { lv: 3, id: "lud3", prize: "+1 Onore e la penna del frate", lines: [["cp_ludovico", "La mia penna. Ha scritto tre testamenti, due contratti e una lettera d'amore sbagliata di destinatario."], ["cp_ludovico", "Usala bene. O male, ma con una bella calligrafia."]], reward: (K) => K.bond("onore", 1) }],
        cp_fiamma: [{ lv: 2, id: "fia2", lines: [["cp_fiamma", "Mio padre diceva: mira dove vuoi arrivare, non dove sei. Poi è finito in una buca. Non so cosa c'entri."], ["cp_fiamma", "Però la frase è buona. La tengo."]], reward: (K) => K.bond("grinta", 1) },
          { lv: 3, id: "fia3", prize: "+1 Grinta e la freccia fortunata", lines: [["cp_fiamma", "La freccia fortunata. Non ha mai mancato un bersaglio. Non l'ho mai tirata."], ["cp_fiamma", "Tienila tu: se un giorno la tiri, voglio essere lì a vedere."]], reward: (K) => K.bond("grinta", 1) }]
      }
    },
    inv: {
      items: {
        cp_mappa: { n: "Mappa del Guado", icon: "🗺️", d: "Un foglio unto con il fiume, due ponti e una X: «bosco a sinistra, pietraia a destra, il Gabelliere in mezzo, come sempre».", gift: { cp_ludovico: 6, cp_dorotea: 4 }, giftAny: 1, react: { cp_ludovico: "Una mappa sincera. Ne ho viste poche." } },
        cp_pagnotta: { n: "Pagnotta del Mulino", icon: "🍞", d: "Pane vero, tiepido, con la farina ancora sulle dita di chi l'ha fatto.", gift: { cp_fiamma: 8, cp_sandro: 5, cp_ludovico: 3 }, giftAny: 2, react: { cp_fiamma: "Pane che non è una promessa. Ti perdono tutto, per oggi." } },
        cp_spilla: { n: "Spilla del Pallone Spezzato", icon: "📍", d: "Il simbolo della Compagnia: un pallone con una crepa dorata. «Spezzato, ma ancora rotola.»", gift: { cp_dorotea: 8 }, giftAny: 1 }
      }
    },
    clock: { slots: ["Mattina", "Pomeriggio", "Sera"], hud: true, tint: [null, null, "rgba(251,146,60,.14)"], onSlot(K, giorno, fascia, nome) { return nome === "Sera" ? [["voce", "Sera. Dai fuochi sale l'odore di zuppa che sperava di essere carne."]] : null; } },
    endings: {
      bandiera: ["Il Pallone Intero", "La Compagnia salda i debiti con onore e rimette insieme il pallone spezzato: non più mercenari, ma un esercito di Spezzaterra.", "Vinci la battaglia finale con l'Onore più alto di Astuzia."],
      ventura: ["La Compagnia di Ventura", "Prendi la strada dei mercenari che vincono: paga ricca, nessuna bandiera. Ognuno si porta via il suo pezzo.", "Vinci la battaglia finale con l'Astuzia più alta dell'Onore."],
      spezzato: ["Il Pallone Spezzato", "Segreto: la verità sul primo debito della Compagnia cambia chi sei davvero.", "Segreto: tutti i compagni reclutati, Onore e Astuzia a 3 o più."]
    },
    heroLook: () => ({ bg: ["#78350f", "#fbbf24"], shirt: "#9a3412" }),
    heroTitle: () => "recluta della Compagnia",
    musicMain: "campo",
    music: { campo: { bpm: 100, chords: ["Dm", "Bb", "F", "C", "Dm", "Bb", "C", "Dm"], lres: 2, lw: "triangle", lv: 0.045,
      lead: "D4 - F4 - A4 - G4 - | F4 - D4 - E4 - - - | D4 - F4 - A4 - C5 - | Bb4 - A4 - G4 - - - | A4 - C5 - D5 - C5 - | Bb4 - G4 - A4 - F4 - | G4 - A4 - Bb4 - A4 - | D4 - - - - - - -",
      bass: "R . . R . . 5 . R . . R . 5 . .", bv: 0.1, arp: "1 3 5 3 1 3 5 3", aw: "sine", av: 0.012, drum: "k . . . s . . . k . h . s . h .", dv: 0.1 } },
    guide: () => [["⚔️ Battaglie sul Campo di Guerra", "Quando due Borghi litigano, si va sul Campo di Guerra. Tocca un tuo compagno, scegli dove muoverlo (bosco rallenta e protegge, collina dà forza), poi attacca o usa l'abilità del suo ruolo. Chi è schierato nella Compagnia combatte con te."]],
    party: (K) => (K.crew ? K.crew.field().slice(0, 2) : []),
    cameos: []
  });
  window.__compagniaH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(40,22,12,.88)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#f59e0b"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = col || "#fde68a"; g.textAlign = "center"; g.fillText(txt, x, y + 3); g.restore(); },
      // battaglia tattica: schiera, poi combatte; cb({win})
      battle(o, cb) { K.say(H.flush(), () => K.tactics.play(o, cb)); },
      people() {
        H.cast("cp_dorotea", "Capitana Dorotea", "Comandante della Compagnia", { style: "ponytail", hair: "#7c2d12", shirt: "#7f1d1d", skin: "#d9a679", bg: ["#450a0a", "#fcd34d"] }, "Ex centrocampista del Borgo di Roccafredda, ora capo di quaranta mercenari senza paga. Dice «ci sono problemi solo per chi non ha un piano»; ha sempre un piano e raramente i soldi.");
        H.cast("cp_ludovico", "Frate Ludovico", "Cassiere e regista", { style: "bald", hair: "#9ca3af", beard: "baffi", shirt: "#78350f", skin: "#e0b890", bg: ["#451a03", "#fde68a"] }, "Frate di un convento chiuso per fallimento, tiene i conti della Compagnia. Benedice le ferite e contesta le spese con la stessa solennità.");
        H.cast("cp_fiamma", "Fiamma", "La miglior mira di Spezzaterra", { style: "ponytail", hair: "#dc2626", shirt: "#b45309", skin: "#e8c4a0", bg: ["#7c2d12", "#fdba74"] }, "Tiratrice ventenne, rossa di capelli e di umore. Lavora solo a paga anticipata, tranne quando le piace il bersaglio.");
        H.cast("cp_bruno", "Bruno il Muro", "Difensore", { style: "short", hair: "#27272a", beard: "folta", shirt: "#475569", skin: "#a9744a", bg: ["#1e293b", "#cbd5e1"] }, "Quindici anni da terzino. Parla poco e quando lo fa tutti si fermano, un po' per rispetto e un po' per la sorpresa.");
        H.cast("cp_sandro", "Sandro Due Dita", "Portiere sospettoso", { style: "short", hair: "#a16207", shirt: "#166534", skin: "#e0b890", acc: ["occhiali"], bg: ["#14532d", "#bbf7d0"] }, "Ha perso otto dita in sei campionati e non si fida delle mani altrui. Controlla due volte anche i saluti.");
        H.cast("cp_brando", "Brando il Gabelliere", "Esattore del Marchese", { style: "short", hair: "#1f2937", shirt: "#334155", skin: "#d9a679", acc: ["occhiali"], bg: ["#0f172a", "#94a3b8"] }, "Esattore del Marchese di Roccafredda. Non è cattivo: è puntuale, che nella sua categoria è peggio.");
        H.cast("cp_oste", "Oste Melchiorre", "Locanda del Gallo Zoppo", { style: "bald", hair: "#777", beard: "baffi", shirt: "#92400e", skin: "#e0b890", bg: ["#451a03", "#fcd34d"] }, "Oste di tre generazioni di debitori. Sostiene che la birra è sempre più onesta del cliente.");
        H.cast("cp_teresina", "Mugnaia Teresina", "Mulino sul Guado", { style: "bun", hair: "#d1d5db", shirt: "#be185d", skin: "#e0b890", bg: ["#831843", "#fbcfe8"] }, "Macina il grano da cinquant'anni e le notizie da quaranta. Il suo pane è l'unica cosa del Borgo a non essere tassata.");
      }
    };
    return H;
  };
  window.__compagnia = E.api; window.__compagniaCore = E;
})();
