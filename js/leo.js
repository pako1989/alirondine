// js/leo.js - «L'ESTATE DEL MURO» · configurazione della saga sul motore comune (js/saga-core.js). Prequel nel Borgo Marino, nell'estate prima che Dario parta.
// Tu sei Leo a quattordici anni. Ogni capitolo si gioca in due versioni della stessa zona: «come la racconta Leo» (esagerata, comica) e «com'è andata davvero»
// (il pulsante nel menu): nella versione vera si cercano le differenze e ognuna è una Pagina vera del Diario. Sblocco: dopo la Stagione 1. Usa solo fatti della Stagione 1.
// Dal core: Rapporti (cfg.bonds), Inventario (cfg.inv), Peso morale (Leggenda e Verità), epoche delle zone (eras), partitelle (K.playMatch), cameo.
// Novità del core portata da questa saga: IL RICORDO (cfg.recall): la zona in due versioni e le discrepanze da trovare.
// Minigioco proprio: «Torna Dritto» (js/muro.js): tiri contro il muro del porto, con vento e onde. Cabinato in Sala Giochi.
// Id dei personaggi: lm_* (versioni giovani dei volti del Borgo, per non toccare il CAST della storia principale).
// Tessere proprie: M muro del porto · O ombrellone · N barca · K cassa di pesce · C cabina · § discrepanza (versione vera) · pavimenti Q sabbia, Y assi di casa
(function () {
  "use strict";
  if (window.__leo || !window.__sagaCore || !window.__hd) return;
  const HD = window.__hd, FX = HD.F;
  const E = window.__sagaCore.create({
    id: "leo", key: "ali-di-rondine.leo", title: "L'Estate del Muro", icon: "🧱", bg: "lm_titolo", chapters: 5, travel: true,
    menuSub: "Agosto al Borgo Marino, tre anni prima. Leo ha quattordici anni, un pallone sgonfio e un fratello che sa fare tutto. Ogni ricordo si gioca due volte: come lo racconta lui e com'è andata davvero.",
    theme: { accent: "#f97316", ink: "#1f1410", paper: "rgba(255,247,232,.97)", font: "Georgia, 'Times New Roman', serif", chipBg: "#fed7aa", chipBorder: "#9a3412" },
    stats: { leggenda: [0, 12, 0, "Leggenda"], verita: [0, 12, 0, "Verità"] },
    weight: { name: "Il Diario di Leo", axes: { leggenda: ["Leggenda", "✨"], verita: ["Verità", "📓"] } },
    item: ["Conchiglia", "Conchiglie"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.2); g.fillStyle = "#fde2e4"; g.beginPath(); g.ellipse(0, 0, 4, 3, 0.3, 0, 7); g.fill(); g.fillStyle = "#f5b5bd"; for (let k = -2; k <= 2; k++) g.fillRect(k * 1.2, -2.5, 0.6, 5); g.restore(); },
    regions: {
      racconto: { grass: ["#7be05a", "#6fd44f", "#86ea66"], path: ["#ffd98a", "#ffcf75"], stone: ["#ffb4a2", "#ffa58e"], wall: ["#ff9a76", "#ff8c64"], water: ["#27c4f5", "#1fb6e8"], tall: "#5fc43f", tree: ["#2fb55a", "#3ac968", "#52dc7a"], tint: "255,200,120", tintA: 0.1, fx: "petals", dark: 0.0 },
      raccontoint: { grass: ["#7be05a", "#6fd44f", "#86ea66"], path: ["#ffd98a", "#ffcf75"], stone: ["#ffb4a2", "#ffa58e"], wall: ["#ff9a76", "#ff8c64"], water: ["#27c4f5", "#1fb6e8"], tall: "#5fc43f", tree: ["#2fb55a", "#3ac968", "#52dc7a"], tint: "255,200,120", tintA: 0.12, fx: "dust", dark: 0.0 },
      vero: { grass: ["#7d9a56", "#738f4f", "#86a35f"], path: ["#bba783", "#b09d7a"], stone: ["#9a958c", "#908b82"], wall: ["#b8825a", "#ab774f"], water: ["#4f86a3", "#487d9a"], tall: "#6a8445", tree: ["#355f33", "#3f6e3c", "#4b7d46"], tint: "255,225,180", tintA: 0.06, fx: "", dark: 0.04 },
      casa: { grass: ["#8a6a44", "#80603c", "#947250"], path: ["#b8956a", "#ac8a60"], stone: ["#85786c", "#7a6e62"], wall: ["#5a3c24", "#4e321c"], water: ["#1e3a5f", "#1b3456"], tall: "#80603c", tint: "255,190,120", tintA: 0.14, fx: "dust", dark: 0.16 }
    },
    floors: "QY", solid: "MONKC§",
    floorPaint(K, f, sx, sy, tx, ty, fr) {
      const g = K.g, tell = K.ZX && K.ZX.rk === "racconto";
      if (f === "Q") { FX.sand(g, sx, sy, tx, ty, fr, K, tell ? ["#ffe08a", "#ffd36b"] : ["#d6bf8c", "#cab27f"]); return true; }
      if (f === "Y") { g.fillStyle = (tx % 2) ? "#b8895a" : "#af8052"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(60,36,16,.35)"; g.fillRect(sx, sy + 15, 16, 1); g.fillRect(sx + 7 + (ty % 3), sy, 1, 16); g.fillStyle = "rgba(255,230,180,.08)"; g.fillRect(sx + 2, sy + 3, 5, 1); return true; }
      return false;
    },
    paint: {
      // muro del porto: mattoni scrostati, intonaco a chiazze, una macchia rossa dove battono i palloni
      M(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, tell = K.ZX && K.ZX.rk === "racconto";
        g.fillStyle = tell ? "#ffc9a3" : "#a89a84"; g.fillRect(sx, sy, 16, 16); g.fillStyle = tell ? "#ffb088" : "#8f8270";
        for (let r = 0; r < 4; r++) { g.fillRect(sx, sy + r * 4 + 3, 16, 1); for (let c = 0; c < 2; c++) g.fillRect(sx + ((r % 2) * 5) + c * 8, sy + r * 4, 1, 3); }
        if (!tell) { g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(sx + (tx * 5) % 9, sy + 1, 4, 3); }
        if ((tx + ty) % 3 === 0) { g.fillStyle = "rgba(190,40,40,.55)"; g.beginPath(); g.arc(sx + 8, sy + 8, 4, 0, 7); g.fill(); }
        g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx, sy + 14, 16, 2);
      },
      // ombrellone a spicchi
      O(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, c = [["#ef4444", "#fef3c7"], ["#2563eb", "#fef3c7"], ["#16a34a", "#fef3c7"]][(tx + ty) % 3];
        g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 8, 2.4, 0, 0, 7); g.fill(); g.fillStyle = "#5b3a22"; g.fillRect(sx + 7.3, sy + 2, 1.4, 12);
        for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? c[1] : c[0]; g.beginPath(); g.moveTo(sx + 8, sy - 4); g.lineTo(sx + i * 4, sy + 3); g.lineTo(sx + (i + 1) * 4, sy + 3); g.fill(); }
      },
      // barca tirata a secco
      N(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx + 1, sy + 13, 15, 3);
        g.fillStyle = (tx % 2) ? "#2563eb" : "#b91c1c"; g.beginPath(); g.moveTo(sx, sy + 5); g.lineTo(sx + 16, sy + 5); g.lineTo(sx + 13, sy + 13); g.lineTo(sx + 3, sy + 13); g.fill();
        g.fillStyle = "#f3e9d2"; g.fillRect(sx, sy + 5, 16, 2); g.fillStyle = "#3f2a1a"; g.fillRect(sx + 3, sy + 9, 10, 1);
      },
      // cassa di pesce col ghiaccio
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx + 2, sy + 13, 13, 3); g.fillStyle = "#a16207"; g.fillRect(sx + 2, sy + 6, 12, 8); g.fillStyle = "#e0f2fe"; g.fillRect(sx + 3, sy + 4, 10, 3);
        g.fillStyle = "#94a3b8"; g.fillRect(sx + 4, sy + 3, 5, 2); g.fillRect(sx + 8, sy + 5, 4, 1); g.fillStyle = "#78350f"; g.fillRect(sx + 2, sy + 9, 12, 1);
      },
      // cabina da spiaggia a righe
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx + 1, sy + 13, 15, 3);
        for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? "#fef3c7" : "#0ea5e9"; g.fillRect(sx + 2 + i * 3, sy - 2, 3, 15); } g.fillStyle = "#075985"; g.beginPath(); g.moveTo(sx + 1, sy - 2); g.lineTo(sx + 8, sy - 7); g.lineTo(sx + 15, sy - 2); g.fill();
      },
      // la discrepanza: un luccichio fra le cose, solo nella versione vera
      "§"(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, p = 0.45 + 0.35 * Math.sin(fr / 8 + tx);
        g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(sx + 8, sy + 8, 0, sx + 8, sy + 8, 12); gr.addColorStop(0, `rgba(253,230,138,${p})`); gr.addColorStop(1, "rgba(253,230,138,0)"); g.fillStyle = gr; g.fillRect(sx - 4, sy - 4, 24, 24); g.restore();
        g.fillStyle = "#fef3c7"; g.fillRect(sx + 7, sy + 4 + Math.round(Math.sin(fr / 10 + ty)), 2, 2); g.fillRect(sx + 5, sy + 7, 6, 1); g.fillRect(sx + 7, sy + 5, 2, 6);
      }
    },
    act: { M: "Guarda il muro", O: "Guarda l'ombrellone", N: "Guarda la barca", K: "Guarda la cassa", C: "Guarda la cabina" },
    flavor: {
      O: "Un ombrellone a spicchi. Sotto, una famiglia di Torino mangia il terzo gelato della mattina.", N: "Una barca tirata a secco. Il nome sulla fiancata è «Speranza II»: della prima non si parla.",
      K: "Una cassa di acciughe sul ghiaccio. Ti guarda con la stessa espressione di Nico quando gli chiedi la formazione.", C: "Una cabina a righe. Dentro sento una signora cantare, fuori sento una signora ascoltare."
    },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi sulla sabbia e guardi il mare. Il gioco salva da solo; dal menu puoi rileggere il Diario di Leo." },
    texts: { nothing: "Niente di speciale. Solo il mare e un gabbiano che ti giudica.", noHero: "Crea prima il tuo Campione: in questa saga presta il volto a Leo.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Odora di pesce, comunque." },
    journal: { name: "Il Diario di Leo", sub: "I ricordi, le Pagine vere, chi c'era" },
    // IL RICORDO (novità del core, opt-in): le zone hanno una versione «vera» (eras.vero); nella versione vera si trovano le discrepanze
    recall: {
      name: "Il Ricordo", icon: "🎞️", era: "vero", tile: "§", after: ":", tellLabel: "Come la racconta Leo", trueLabel: "Com'è andata davvero", pageName: "Pagina vera", look: "Guarda meglio",
      marks: {
        c1_muro: { zone: "lm_borgo", at: [26, 17], t: "Il muro era basso", d: "Nel ricordo di Leo il muro del porto è alto tre metri e brilla. In realtà ti arriva al petto. L'intonaco è scrostato e c'è una macchia rossa grande come un pallone: tre estati di tiri." },
        c1_scarpa: { zone: "lm_borgo", at: [11, 13], t: "La scarpa bucata", d: "Dario, nel racconto, ha scarpini d'oro. Questa è la scarpa vera: ha un buco sotto l'alluce e un nodo di spago. Sul tallone, a pennarello: «D.M.» e sotto, più piccolo, «L.M. quando cresce»." },
        c1_pallone: { zone: "lm_borgo", at: [9, 19], t: "Il pallone sgonfio", d: "Il pallone «magico» è un pallone di plastica rattoppato, moscio come una focaccia di ieri. Si gonfia con una pompa da bicicletta e il fiato dei più testardi." },
        c1_cartello: { zone: "lm_borgo", at: [21, 13], t: "Il premio del torneo", d: "Nel ricordo il premio è «un'astronave». In realtà il cartello dice: «1° premio: una coppa di latta e un gelato a testa. Iscrizione: sei euro a squadra».", }
        ,c2_lavagna: { zone: "lm_trattoria", at: [12, 1], t: "Il prezzo del fritto", d: "Nel racconto il fritto di acciughe è gratis «con un sorriso». Sulla lavagna vera: 9 euro, e «il resto: chiedere a Papà, che non risponde»." },
        c2_macchia: { zone: "lm_trattoria", at: [5, 8], t: "La tovaglia macchiata", d: "Il tavolo del racconto è apparecchiato come una reggia. Quello vero ha una macchia di sugo a forma di Sardegna, e nessuno ha mai capito di chi sia." },
        c2_ventilatore: { zone: "lm_trattoria", at: [14, 5], t: "Il ventilatore che fa tac", d: "Il lampadario d'oro del ricordo è un ventilatore a pale storte. Fa «tac» a ogni giro e papà giura che è il suo orologio di cucina." },
        c2_cassa: { zone: "lm_trattoria", at: [7, 8], t: "Il cartello «Non si fa credito»", d: "Sotto il bancone c'è ancora il cartello del '98. Qualcuno ci ha scritto a penna, piccolissimo: «tranne a Dario»." }
      }
    },
    bonds: {
      per: 4, talk: 2, max: 5, names: ["Conoscenti", "Vicini di sabbia", "Compagni d'estate", "Amici veri", "Come fratelli", "Famiglia"],
      scenes: {
        lm_nico: [
          { lv: 2, id: "nic2", prize: "+1 Verità", lines: [["lm_nico", "[ride] Il Gatto Volante? L'ho inventato perché ho paura dei palloni forti. Se mi butto, almeno sembra un'idea."], ["lm_nico", "[pensa] Non dirlo a nessuno. Neanche a te stesso: poi ti viene da ridere in porta."]], reward: (K) => K.bond("verita", 1) }
        ],
        lm_dario: [
          { lv: 2, id: "dar2", prize: "+1 Leggenda", lines: [["lm_dario", "Sai perché non gioco più forte? Perché poi mi guardano. E quando mi guardano devo restare."], ["lm_dario", "[pensa] Tira contro il muro, piccolo. Il muro non chiede niente a nessuno."]], reward: (K) => K.bond("leggenda", 1) }
        ]
      }
    },
    inv: {
      items: {
        lm_pompa: { n: "Pompa da bicicletta", icon: "🛠️", d: "Arrugginita e rumorosa come un'oca. Gonfia anche i palloni che non vorrebbero.", gift: { lm_ottavio: 3 }, giftAny: 0 },
        lm_gelato: { n: "Gelato al limone", icon: "🍋", d: "Sciolto per metà. Regalato, vale doppio.", gift: { lm_nico: 5, lm_dario: 3, lm_gege: 3, lm_rita: 4 }, giftAny: 2, react: { lm_nico: "[felice] Limone! Il sapore dell'estate e dei miei errori in porta." } }
      }
    },
    endings: {
      leggenda: ["La Leggenda del Muro", "Leo tiene il ricordo bello: Dario alto tre metri, il muro che brilla, il pallone magico. Non è com'è andata. È com'è giusto che sia.", "Chiudi la saga con più Leggenda che Verità."],
      vero: ["Com'è andata davvero", "Leo scrive la versione vera, con le scarpe bucate e il pallone sgonfio. Fa più male e vale di più.", "Chiudi la saga con più Verità che Leggenda."],
      biglietto: ["Il biglietto sotto la pietra", "Segreto: trovate tutte le Pagine vere e battuto il record del muro, sotto una pietra c'è qualcosa che Dario ha lasciato quella notte.", "Segreto: tutte le Pagine vere e il record di «Torna Dritto»."]
    },
    heroLook: () => ({ name: "Leo", num: "10", style: "spiky", hair: "#2b1d14", skin: "#f2c9a0", eye: "#3a2a1a", shirt: "#ff4d5a", acc: "none", cap: undefined, bg: ["#ff7a45", "#ffd23f"] }),
    heroTitle: () => "Leo, quattordici anni",
    musicMain: "leo",
    music: { leo: { bpm: 96, chords: ["C", "Am", "F", "G", "C", "Em", "F", "G"], lres: 2, lw: "triangle", lv: 0.03,
      lead: "E5 - G5 - E5 - D5 - | C5 - - - D5 - E5 - | G5 - A5 - G5 - E5 - | D5 - - - - - - - | E5 - G5 - C6 - A5 - | G5 - E5 - D5 - C5 - | D5 - E5 - D5 - B4 - | C5 - - - - - - -",
      bass: "R . . . 5 . . . R . . . 5 . . .", bv: 0.1, arp: "1 5 8 5 1 5 8 5", aw: "sine", av: 0.012, drum: "k . . . . . s . k . k . . . s .", dv: 0.07 } },
    guide: () => [["🎞️ Il Ricordo", "Ogni luogo esiste in due versioni: come lo racconta Leo (esagerata, comica) e com'è andata davvero. Dal menu, il pulsante 🎞️ le scambia. Nella versione vera cerca i luccichii: ognuno è una Pagina vera del Diario."], ["📓 Leggenda e Verità", "Alcune scelte tengono il ricordo bello, altre scrivono la verità. A fine saga vince quello che hai scritto di più."], ["🧱 Torna Dritto", "Al muro del porto tira con angolo e forza: il pallone deve tornare nei piedi. Vento e onde cambiano il rimbalzo."]],
    cameos: [],
    guest: { id: "lm_ottavio", lines: ["Ottavio, pescatore. Ho arbitrato ogni partita del porto dal '71. Non ho mai fischiato un rigore giusto, ma nessuno mi ha mai denunciato.", "Fischio io, che il mare non fischia. Ricordatelo se mai ci vediamo in campo."] },
    onReady(K) { window.__leoH(K).people(); }
  });
  window.__leoH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, disabled: o.disabled, fn: o.fn }))); if (l.length) K.say(l, go); else go(); },
      wask: (prompt, opts) => { const l = H.flush(), go = () => K.weight.ask("voce", prompt, opts); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#1f1410", skin: "#f0c8a0" }, o), bio),
      // vera/raccontata: la stessa battuta in due versioni
      v: (tell, real) => (K.recall && K.recall.isTrue() ? real : tell),
      plaque(g, txt, x, y, col) { g.save(); g.font = "700 6px Georgia, serif"; const w = g.measureText(txt).width + 8; g.fillStyle = "rgba(31,20,16,.88)"; g.fillRect(x - w / 2, y - 4, w, 9); g.strokeStyle = col || "#f97316"; g.lineWidth = 1; g.strokeRect(x - w / 2 + 0.5, y - 3.5, w - 1, 8); g.fillStyle = "#fff7e8"; g.textAlign = "center"; g.fillText(txt, x, y + 2.5); g.restore(); },
      stato: () => `✨ Leggenda ${K.stat("leggenda")} · 📓 Verità ${K.stat("verita")} · 🎞️ Pagine vere ${K.recall.count()[0]}/${K.recall.count()[1]}`,
      people() {
        H.cast("lm_dario", "Dario", "Diciannove anni", { style: "spiky", hair: "#2b1d14", shirt: "#1d4ed8", skin: "#e9bf96", eye: "#2a1a0a", bg: ["#1e3a8a", "#bfdbfe"] }, "Il fratello maggiore di Leo. Diciannove anni, scarpe bucate, il tiro più pulito del porto. Quest'estate guarda spesso il treno per Milano.");
        H.cast("lm_nico", "Nico", "Quattordici anni", { style: "messy", hair: "#e8a33d", shirt: "#0ea5e9", skin: "#f5d0ae", eye: "#2a4a6a", bg: ["#075985", "#e0f2fe"] }, "Il miglior amico di Leo. Portiere per vocazione, tuffatore per paura. Sta inventando una tecnica segreta che consiste nel volare.");
        H.cast("lm_papa", "Papà", "Trattoria Moretti", { style: "slick", hair: "#6b5b4b", shirt: "#e5e7eb", skin: "#e9be95", acc: ["grembiule"], bg: ["#44403c", "#fcd34d"] }, "Il papà di Leo e Dario. Cuoco severo, sempre in piedi, sempre con un canovaccio sulla spalla.");
        H.cast("lm_rita", "Rita", "In sala", { style: "bun", hair: "#8a8a8a", shirt: "#be123c", skin: "#eec4a0", bg: ["#881337", "#fecdd3"] }, "Lavora in sala alla trattoria da quando Leo era piccolo. Ha sempre un'opinione e un vassoio.");
        H.cast("lm_gege", "Gegè Spinola", "Capo dei Granchi", { style: "messy", hair: "#8a5a2a", shirt: "#dc2626", skin: "#e8b88a", acc: ["cappellino"], cap: "#dc2626", bg: ["#7f1d1d", "#fecaca"] }, "Quindici anni, cappellino girato, il porto come regno. I suoi Granchi non hanno mai perso il torneo estivo.");
        H.cast("lm_quaglia", "Prof. Quaglia", "Osservatore milanese", { style: "slick", hair: "#cfc6b4", shirt: "#d6c7a1", skin: "#efcfb0", acc: ["occhiali", "taccuino"], bg: ["#57534e", "#f5f5f4"] }, "Un signore in completo beige in pieno agosto. Prende appunti su tutti, sorride a tutti e non dice per chi lavora.");
        H.cast("lm_ottavio", "Ottavio", "Pescatore e arbitro", { style: "bald", hair: "#d6d3d1", shirt: "#334155", skin: "#c8956a", beard: "baffi", acc: ["paglia", "fischietto"], bg: ["#1e293b", "#cbd5e1"] }, "Pescatore del Borgo. Arbitra le partite del porto dal '71 e le cronache dicono che non abbia mai sbagliato in malafede.");
      }
    };
    return H;
  };
  window.__leo = E.api; window.__leoCore = E;
})();
