// js/quartiere.js - GLI STRAORDINARI DI QUARTIERE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA, nello spirito dei fumetti corali di supereroi (tutto inventato). A Ponterotto, un quartiere di canali e
// panni stesi, vivono cinque persone con poteri piccoli e inutili: una gelataia che congela, un trombettista che fa vento,
// un idraulico elastico, una pensionata calamita e un pizzaiolo di fuoco. Il Dottor Cemento vuole fare un parcheggio sul
// campetto del quartiere. Tu hai il potere più strano di tutti: copi quello degli altri.
// Novità di questa saga (oltre a quelle del motore comune):
//  - COMBO DI SQUADRA (js/combo.js): la partita originale, con un motore suo. Ogni turno scegli uno o due eroi, i poteri
//    si combinano, le combo si scoprono giocando e restano nel Libro delle Combo; chi agisce resta stanco un turno.
//  - IL COPIONE (K.cambia): una scena nuova. Il Campione copia il potere di un amico, e ogni potere apre strade diverse
//    nel quartiere (ghiaccio sull'acqua, vento sulle foglie, elastico sui cancelli, calamita sui cassoni, fuoco sul ghiaccio).
//  - IL QUARTIERE CHE CAMBIA: l'acqua del canale gela sotto i piedi quando hai il ghiaccio, le foglie volano col vento.
// Salvataggio proprio: ali-di-rondine.quartiere. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__quartiere || !window.__sagaCore) return;
  // i poteri copiati: chi te lo presta e cosa ti fa attraversare
  const POTERI = {
    scatto: { e: "⚡", n: "Scatto", who: null, pass: "", col: "#ffd23f", d: "Il tuo: corri veloce. Tutto qui." },
    ghiaccio: { e: "❄️", n: "Ghiaccio", who: "sq_brina", pass: "w", col: "#7ad8ff", d: "L'acqua gela sotto i piedi: si cammina sul canale." },
    vento: { e: "🌀", n: "Vento", who: "sq_soffio", pass: "J", col: "#c8f0e0", d: "Un soffio e i cumuli di foglie volano via." },
    elastico: { e: "🪢", n: "Elastico", who: "sq_gommo", pass: "X", col: "#ff8ac8", d: "Ti allunghi sopra i cancelli chiusi." },
    calamita: { e: "🧲", n: "Calamita", who: "sq_ines", pass: "K", col: "#c83a3a", d: "I cassoni di ferro si spostano da soli." },
    fuoco: { e: "🔥", n: "Fuoco", who: "sq_scintilla", pass: "I", col: "#ff8a3a", d: "I blocchi di ghiaccio si sciolgono al passaggio." },
  };
  const E = window.__sagaCore.create({
    id: "quartiere", key: "ali-di-rondine.quartiere", title: "Gli Straordinari di Quartiere", icon: "🦸", bg: "sq_titolo", chapters: 3,
    menuSub: "Cinque supereroi di serie B, un garage, un campetto da salvare dal Dottor Cemento. E tu, che copi i poteri degli altri",
    theme: { accent: "#ffd23f", ink: "#ffffff", paper: "rgba(30,20,50,.94)", font: "system-ui, sans-serif", chipBg: "#1e1432ee", chipBorder: "#ff5a8a" },
    stats: { quartiere: [0, 99, 0, "Il quartiere con te"], squadra: [0, 99, 0, "L'intesa della squadra"] },
    travel: true,
    item: ["Fumetto perduto", "Fumetti perduti"],
    stadium: { azPitch: "cortile", cageField: 0, cageMut: "rubber", venue: { ads: [["PONTEROTTO", "#ff5a8a"], ["GELATI BRINA", "#7ad8ff"], ["PIZZA SCINTILLA", "#ff8a3a"], ["NO AL PARCHEGGIO!", "#ffd23f"]], crowd: ["#ff5a8a", "#ffd23f", "#7ad8ff", "#ff8a3a", "#ffffff"], ground: ["#4aa04a", "#46984a"], line: "#ffffffcc", grid: "rgba(255,255,255,.05)", tint: "rgba(255,200,230,.06)", glow: "255,220,180", sky: ["#8ac8f0", "#ffe8c8"], wall: ["#e8a87a", "#d89868"], fx: { spd: 1.04 } } },
    regions: {
      quartiere: { grass: ["#5aa84a", "#56a046", "#5eb04e"], path: ["#c8b8a8", "#c0b0a0"], stone: ["#b8b0b8", "#b0a8b0"], wall: ["#e8a87a", "#dc9c6e"], water: ["#3a8ac8", "#4696d4"], tall: "#4a9a3a", tree: ["#2a8a3a", "#329040", "#2c8c3c"], tint: "255,230,210", tintA: 0.06, fx: "", dark: 0.02 },
      cantiere: { grass: ["#9a8a6a", "#948464", "#a08e6e"], path: ["#b8b0a0", "#b0a898"], stone: ["#a0a0a8", "#9898a0"], wall: ["#7a7a82", "#74747c"], water: ["#4a7a9a", "#5484a4"], tall: "#8a8a5a", tint: "255,220,170", tintA: 0.1, fx: "dust", dark: 0.04 },
      casa: { grass: ["#8a7a5a", "#847454", "#8e7e5e"], path: ["#a89878", "#a09070"], stone: ["#c8c0b0", "#c0b8a8"], wall: ["#5a4a7a", "#544474"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,220,170", tintA: 0.1, fx: "dust", dark: 0.05 },
    },
    floors: "", solid: "JXKIQ",
    // il potere copiato decide cosa si attraversa
    pass: (K) => (POTERI[K.F.get("sq_pow", "scatto")] || POTERI.scatto).pass,
    rest: { ch: "s", label: "Siediti sulla panchina", text: "Ti siedi sulla panchina. Un piccione ti guarda come se sapesse tutto. (Il gioco salva da solo: qui puoi rileggere il Libro delle Combo.)" },
    texts: { chestOpen: "Apri la scatola.", chestEmpty: "La scatola è vuota: solo un elastico, una figurina doppia e una caramella alla menta di dieci anni fa.", nothing: "Niente. Solo panni stesi e una radio che canta, da una finestra.", noHero: "Ponterotto aspetta il suo Copione. Crea prima il tuo Campione." },
    journal: { name: "Il Libro delle Combo", sub: "Poteri, combo scoperte, eroi, finali" },
    endings: {
      quartiere: ["TUTTO IL QUARTIERE IN CAMPO", "Togliete le maschere davanti a tutti. La gelataia, il trombettista, l'idraulico, la nonna, il pizzaiolo. Ponterotto ride, applaude, e poi entra in campo: novanta persone contro la Squadra Calcestruzzo. Il parcheggio non si farà mai.", "Serve aver mostrato a tutti chi siete."],
      maschere: ["GLI STRAORDINARI RESTANO SEGRETI", "Il campetto è salvo, e nessuno sa chi l'ha salvato. Il giornale di quartiere scrive «Supereroi misteriosi». Brina vende un gelato nuovo: il Misterioso. Gusto: segreto.", "Serve aver tenuto le maschere."],
      cemento: ["IL DOTTOR CEMENTO CAMBIA IDEA", "Il Dottor Cemento si toglie il casco e lo appoggia sul dischetto del rigore. «Volevo solo un posto dove parcheggiare la macchina di mia madre», dice. Gommo gli presta un garage. Lui costruisce una tribuna.", "Serve aver ascoltato la storia del Dottor Cemento."],
      fumetto: ["L'ALBO NUMERO UNO", "Brina ha disegnato tutto, di nascosto, su un quaderno a quadretti: ogni combo, ogni corsa, ogni gol. Lo stampano in copisteria: «Gli Straordinari di Quartiere, numero 1». Tiratura: centoventi copie. Esaurito in un pomeriggio.", "Segreto: tutti i fumetti perduti, almeno dieci combo scoperte, nessuna partita lasciata a metà."],
    },
    heroLook: (h, K) => ({ bg: ["#1e1432", "#ff5a8a"], shirt: (POTERI[K.F.get("sq_pow", "scatto")] || POTERI.scatto).col }),
    heroTitle: (K) => `il Copione (potere: ${(POTERI[K.F.get("sq_pow", "scatto")] || POTERI.scatto).n.toLowerCase()})`,
    heroFx: (K) => { const p = K.F.get("sq_pow", "scatto"); return p !== "scatto" ? { aura: { ghiaccio: "122,216,255", vento: "200,240,224", elastico: "255,138,200", calamita: "200,58,58", fuoco: "255,138,58" }[p] } : null; },
    zoneMenuExtra: (K) => [{ label: "🦸 Cambia potere", sub: `Adesso: ${(POTERI[K.F.get("sq_pow", "scatto")] || POTERI.scatto).n}`, fn: () => K.cambia() }],
    act: { q: "Entra", n: "Leggi il cartello", J: "Guarda le foglie", X: "Guarda il cancello", K: "Guarda il cassone", I: "Guarda il blocco di ghiaccio", Q: "Guarda la porta", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = { J: "Un cumulo di foglie, cartacce e un ombrello rotto. Alto come te. Con un bel soffio volerebbe via.", X: "Un cancello chiuso con tre lucchetti. In alto, una scritta: «PROPRIETÀ CEMENTO». Se solo ti potessi allungare…", K: "Un cassone di ferro, pesantissimo. Ci vorrebbe una calamita grande come una nonna.", I: "Un blocco di ghiaccio: la macchina del Dottor Cemento congela le strade per chiuderle. Ci vorrebbe un fuoco da pizzeria.", Q: "La porta del campetto: pali di legno, rete fatta con le reti da pesca dei nonni." }[ch];
        if (!t) return false; K.say([["voce", t]]); return true;
      },
      // il potere copiato in alto a destra
      hud(g, zid, spec, K) { const p = POTERI[K.F.get("sq_pow", "scatto")] || POTERI.scatto; g.save(); g.font = "800 9px system-ui"; g.textAlign = "right"; const t = `${p.e} ${p.n}`; const w = g.measureText(t).width + 10; g.fillStyle = "rgba(30,20,50,.8)"; g.fillRect(316 - w, 26, w, 13); g.fillStyle = p.col; g.fillText(t, 311, 36); g.restore(); },
    }],
    musicMain: "quartiere",
    music: {
      // un tema da cartone del sabato mattina: fiati allegri, basso saltellante, battimani
      quartiere: { bpm: 144, chords: ["F", "F", "Bb", "C", "F", "Dm", "G", "C"], lres: 2, lw: "square", lv: 0.035,
        lead: "F5 - A5 C6 - A5 F5 - | F5 - A5 C6 - D6 C6 - | Bb5 - D6 - F6 - D6 - | C6 - - - E5 - G5 - | A5 - C6 F6 - C6 A5 - | D6 - - A5 - F5 - - | G5 - B5 - D6 - G5 - | C6 - - - - - - -",
        bass: "R . 5 . R . 5 . R . 5 . 8 . 5 .", bv: 0.1, arp: "", av: 0, drum: "k . h s k k h s k . h s k h s s", dv: 0.15 },
    },
    paint: {
      // il canale: se hai il ghiaccio, l'acqua vicino a te gela davvero (e si vede)
      w(K, sx, sy, tx, ty, fr) {
        const g = K.g, p = K.F.get("sq_pow", "scatto"), pos = K.api && K.api.trPos && K.api.trPos(), near = p === "ghiaccio" && pos && Math.hypot(tx * 16 + 8 - pos[0], ty * 16 + 8 - pos[1] + 4) < 40;
        if (near) { g.fillStyle = (tx + ty) % 2 ? "#d8f0ff" : "#c8e8fa"; g.fillRect(sx, sy, 16, 16); g.strokeStyle = "rgba(120,180,220,.7)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx + 2, sy + 4); g.lineTo(sx + 9, sy + 9); g.lineTo(sx + 14, sy + 6); g.moveTo(sx + 9, sy + 9); g.lineTo(sx + 7, sy + 15); g.stroke(); g.fillStyle = "rgba(255,255,255,.8)"; g.fillRect(sx + 3, sy + 2, 3, 1); return; }
        g.fillStyle = (tx + ty) % 2 ? "#3a8ac8" : "#4696d4"; g.fillRect(sx, sy, 16, 16); const o = (fr / 3 + tx * 5) % 16; g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + o * 0.8, sy + 5 + (tx % 3), 4, 1); g.fillRect(sx + ((o + 8) % 16) * 0.8, sy + 11, 3, 1);
      },
      // cumulo di foglie: col vento, le foglie girano
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, wind = K.F.get("sq_pow") === "vento"; for (let i = 0; i < 9; i++) { const a = i * 2.1 + (wind ? fr / 8 : 0), r = wind ? 3 + (i % 3) * 2 : 2 + (i % 3) * 2; g.fillStyle = ["#c87a2a", "#e8a83a", "#8a5a2a"][i % 3]; g.beginPath(); g.ellipse(sx + 8 + Math.cos(a) * r, sy + 10 + Math.sin(a) * r * 0.6 - (i % 3) * 2, 3, 1.6, a, 0, 7); g.fill(); } g.fillStyle = "#f4f0e4"; g.fillRect(sx + 3, sy + 3, 4, 3); },
      // cancello chiuso, coi lucchetti
      X(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#4a4a52"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1 + i * 4, sy, 2, 16); g.fillRect(sx, sy + 3, 16, 2); g.fillRect(sx, sy + 12, 16, 2); g.fillStyle = "#c8a040"; g.fillRect(sx + 6, sy + 7, 4, 4); },
      // cassone di ferro
      K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, mag = K.F.get("sq_pow") === "calamita", dx = mag ? Math.sin(fr / 6 + tx) * 1.2 : 0; g.fillStyle = "#6a6a72"; g.fillRect(sx + 1 + dx, sy + 3, 14, 12); g.fillStyle = "#4a4a52"; g.fillRect(sx + 1 + dx, sy + 3, 14, 2); g.fillRect(sx + 7 + dx, sy + 3, 2, 12); g.fillStyle = "#a8a8b0"; g.fillRect(sx + 2 + dx, sy + 5, 2, 2); g.fillRect(sx + 12 + dx, sy + 12, 2, 2); },
      // blocco di ghiaccio: col fuoco, gocciola
      I(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, hot = K.F.get("sq_pow") === "fuoco"; g.fillStyle = "rgba(170,220,255,.9)"; g.fillRect(sx + 1, sy + 2, 14, 13); g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(sx + 3, sy + 4, 4, 2); g.strokeStyle = "#7ab8e8"; g.strokeRect(sx + 1.5, sy + 2.5, 13, 12); if (hot) { g.fillStyle = "#7ad8ff"; g.fillRect(sx + 4 + ((fr / 4) % 8), sy + 15, 1, 1); } },
      // la porta del campetto
      Q(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * 16 - cx, y = ty * 16 - cy + 16; g.fillStyle = "#8a5a2a"; g.fillRect(x - 6, y - 22, 3, 22); g.fillRect(x + 19, y - 22, 3, 22); g.fillRect(x - 6, y - 23, 28, 3); g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 1; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x - 4 + i * 4, y - 21); g.lineTo(x - 2 + i * 4, y); g.stroke(); } }); },
    },
    guest: { id: "sq_brina", lines: [["sq_brina", "[ride] {n}! Ho portato il carretto dei gelati: gusto Borgo Marino, cioè acciughe e limone. (Te ne dà uno.) È terribile. Ma è fresco."]] },
    cameos: [
      { id: "mg_tilde", zone: "sq_quartiere", at: [8, 19], when: (K) => !!(K.otherSaga("ali-di-rondine.mantello") || {}).done?.[1], lines: [["mg_tilde", "[pensa] Nonna Tilde, sarta, da Metropolenta. Cinque eroi e nessun mantello? (Tira fuori il metro.) Vi prendo le misure. Gratis. Ma il mantello si restituisce lavato."]] },
      { id: "ml_bice", zone: "sq_campetto", at: [5, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.colline") || {}).done?.[1], lines: [["ml_bice", "[furbo] La Contessa Bice, dalle Colline. Un campetto di quartiere da salvare? Anche il mio stadio era di cemento, una volta. Adesso ci pascolano le capre. Si può fare."]] },
    ],
  });
  const K = E.K;
  K.POTERI = POTERI;
  // i poteri che puoi copiare: quelli degli amici già in squadra (flag sq_in_<potere>)
  K.poteri = () => Object.keys(POTERI).filter((k) => k === "scatto" || K.F.is("sq_in_" + k));
  K.recluta = (pw) => { K.F.set("sq_in_" + pw, true); K.bond("squadra", 1); };
  // IL COPIONE: scegli quale potere copiare. Non si cambia se sei sopra qualcosa che solo il potere di adesso ti fa attraversare.
  K.cambia = (pw, then) => {
    const cur = K.F.get("sq_pow", "scatto"), pos = K.api.trPos && K.api.trPos(), tile = pos && K.api.trTileAt ? K.api.trTileAt(Math.floor(pos[0] / 16), Math.floor((pos[1] - 4) / 16)) : null;
    const set = (p) => { if (tile && POTERI[cur].pass.includes(tile) && !POTERI[p].pass.includes(tile)) return K.say([["voce", `Non qui! Se smetti di essere ${POTERI[cur].n.toLowerCase()} adesso, ${tile === "w" ? "finisci nel canale" : "resti incastrato"}. Prima torna su un terreno normale.`]], then || K.done); K.F.set("sq_pow", p); K.tone(520 + Object.keys(POTERI).indexOf(p) * 80, 0.2, "triangle", 0.05); K.refreshZone && K.refreshZone(); K.say([["voce", `${POTERI[p].e} <b>${POTERI[p].n}</b>. ${POTERI[p].who ? "Copi il potere di " + K.esc((K.api.CAST[POTERI[p].who] || {}).name || "") + ". " : ""}${POTERI[p].d}`]], then || K.done); };
    if (pw) return set(pw);
    K.ask("voce", "Il potere del Copione: tocchi la spalla di un amico e per un po' fai quello che fa lui. Quale copi?", K.poteri().map((p) => ({ label: `${POTERI[p].e} ${POTERI[p].n}${p === cur ? " ✓" : ""}`, sub: POTERI[p].d, fn: () => set(p) })).concat([{ label: "Lascia stare", fn: then || K.done }]));
  };
  // la partita originale della saga: Combo di Squadra, con le combo già scoperte
  K.HEROES = { scatto: ["Il Copione", "#e0ac7e", "#2b1d14"], ghiaccio: ["Brina", "#f4dcc8", "#e8f4ff"], vento: ["Soffio", "#c68642", "#1a1a1a"], elastico: ["Gommo", "#e8c4a0", "#3a2a1a"], calamita: ["Ines", "#e0b890", "#c8c8c8"], fuoco: ["Scintilla", "#d9a679", "#8a2a1a"] };
  K.known = () => Object.values(window.__combo ? window.__combo.COMBO : {}).map((c) => c.id).filter((id) => K.F.is("sq_cb_" + id));
  K.squadra = (pws) => pws.map((p) => ({ id: p, name: p === "scatto" ? (K.hero && K.hero() ? K.hero().name : "Il Copione") : K.HEROES[p][0], power: p, skin: K.HEROES[p][1], hair: K.HEROES[p][2] }));
  K.combo = (o, done) => K.ownMatch(window.__combo.start, Object.assign({ usColor: "#ff5a8a", us: "Gli Straordinari", known: K.known() }, o, { done: (r) => { if (r.quit) K.F.set("sq_lasciato", true); ((r.data && r.data.nuove) || []).forEach((id) => K.F.set("sq_cb_" + id, true)); done(r); } }));
  window.__quartiere = E.api;
})();
