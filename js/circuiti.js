// js/circuiti.js - «NEO-RONDINE 2099 · IL CAMPIONATO DEI CIRCUITI D'ORO» · configurazione della saga sul motore comune (js/saga-core.js)
// Cyber-noir sotto la pioggia acida: la Vektor Corp controlla la città e i brevetti dei calciatori, i Circuiti d'Oro resistono nei vicoli.
// Novità: TERMINALI DI HACKING (cfg.hack nel core): consolle sulla mappa che costano Hacking Neurale e deviano i droni, invertono i pavimenti elettrificati o aprono serrande.
// Minigioco: Circuito EMP & Sovraccarico (js/circuiti-emp.js), anche in Sala Giochi. Dal core: Guardie (droni), Orologio, Inventario, Rapporti, Dossier.
// Tessere proprie: C facciata · K terminale · V distributore · E traliccio · Q insegna olografica · I tubi · F barriera laser · J jukebox · M banco · x cassonetto
//   pavimenti: _ asfalto bagnato · h grata d'ombra (nasconde dai droni) · o esagoni · e piastra elettrificata · k pavimento server · i lamiera
(function () {
  "use strict";
  if (window.__circuiti || !window.__sagaCore) return;
  const TS = 16;
  const rn = (a, b, k) => { const s = Math.sin(a * 127.1 + b * 311.7 + (k || 0) * 74.7) * 43758.5453; return s - Math.floor(s); };
  const NEON = ["#22d3ee", "#f0abfc", "#fb7185", "#a3e635", "#fbbf24"], NRGB = ["34,211,238", "240,171,252", "251,113,133", "163,230,53", "251,191,36"];
  const CASES = {
    vektor: {
      t: "Partite Truccate Vektor", q: "Qualcosa non torna nei risultati della lega ufficiale. Confronta le prove.",
      items: {
        scommesse: { t: "Registro delle Scommesse", d: "Le puntate sul risultato cambiano un'ora prima del fischio d'inizio, sempre dalla stessa parte.", icon: "📒", kind: "prova" },
        microfilm: { t: "Microfilm del Piano 40", d: "Un elenco di partite con il risultato scritto accanto, datato prima che si giocassero.", icon: "🎞️", kind: "prova" },
        bonifico: { t: "Bonifici Offshore", d: "Pagamenti mensili da «V-Corp Holdings» a quattro arbitri-androidi.", icon: "🏦", kind: "prova" },
        chip: { t: "Chip del Registro di Nyx", d: "Il log interno di Nyx-09: gli ordini di «correzione» che ha ricevuto e rifiutato.", icon: "💽", kind: "testimonianza" }
      },
      links: [["scommesse", "microfilm", "Le puntate cambiano quando cambia il microfilm: chi scommette conosce già i risultati."], ["microfilm", "bonifico", "Microfilm e bonifici portano la stessa firma: V-Corp Holdings."], ["chip", "bonifico", "Gli ordini a Nyx partono dagli stessi conti dei bonifici."]],
      verdicts: [{ id: "diffondi", label: "Diffondi tutto nella rete pubblica", sub: "Il virus di K1-RA e le prove, insieme" }, { id: "vance", label: "Consegna tutto all'Ispettore Vance", sub: "La via legale, lenta ma solida" }]
    }
  };
  const E = window.__sagaCore.create({
    id: "circuiti", key: "ali-di-rondine.circuiti", title: "Neo-Rondine 2099", icon: "⚡", bg: "nr_titolo", chapters: 4,
    menuSub: "Sotto la pioggia acida, il Campionato dei Circuiti d'Oro: hackera i terminali, schiva i droni, scarica la sfera.",
    theme: { accent: "#22d3ee", ink: "#e0f2fe", paper: "rgba(8,6,28,.93)", font: "'Trebuchet MS', Verdana, sans-serif", chipBg: "#0b2a45", chipBorder: "#22d3ee" },
    stats: { energia: [0, 100, 25, "Carica Elettrica"], hackeraggio: [0, 100, 15, "Hacking Neurale"], fama: [0, 100, 10, "Reputazione nei Bassifondi"] },
    hack: { stat: "hackeraggio", name: "Hacking Neurale" },
    item: ["Chip d'oro", "Chip d'oro"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 12 + i) * 1.4); g.fillStyle = "#facc15"; g.fillRect(-4, -3, 8, 6); g.fillStyle = "#a16207"; g.fillRect(-2, -1, 4, 2); for (let k = 0; k < 3; k++) { g.fillStyle = "#facc15"; g.fillRect(-3 + k * 3, -5, 1, 2); g.fillRect(-3 + k * 3, 3, 1, 2); } g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(250,204,21,${0.3 + 0.2 * Math.sin(f / 8 + i)})`; g.beginPath(); g.arc(0, 0, 7, 0, 7); g.fill(); g.restore(); },
    regions: {
      vicoli: { grass: ["#14102c", "#181234", "#120e28"], path: ["#2a1f55", "#241a4a"], stone: ["#2a2f4a", "#252a42"], wall: ["#161230", "#120e28"], water: ["#0e7490", "#155e75"], tall: "#1e1b4b", tree: ["#0f172a", "#1e293b", "#334155"], tint: "140,110,255", tintA: 0.1, fx: "rain", dark: 0.22 },
      bar: { grass: ["#1a0c2a", "#160a24", "#1e102e"], path: ["#3a1850", "#341446"], stone: ["#2a1840", "#24123a"], wall: ["#12061e", "#0e0418"], water: ["#0e7490", "#155e75"], tall: "#1a0c2a", tint: "240,100,220", tintA: 0.12, fx: "", dark: 0.12 },
      officina: { grass: ["#0e1f1a", "#0a1a16", "#12261f"], path: ["#16382c", "#123228"], stone: ["#1a2e28", "#16261f"], wall: ["#0a1612", "#07100d"], water: ["#0e7490", "#155e75"], tall: "#0e1f1a", tint: "60,220,140", tintA: 0.1, fx: "sparks", dark: 0.16 },
      monorotaia: { grass: ["#1e293b", "#1a2333", "#232f44"], path: ["#334155", "#2e3b4d"], stone: ["#2a3547", "#252f40"], wall: ["#0f172a", "#0b1220"], water: ["#0e7490", "#155e75"], tall: "#1e293b", tree: ["#0f172a", "#1e293b", "#334155"], tint: "170,210,255", tintA: 0.1, fx: "rain", dark: 0.18 },
      cabina: { grass: ["#1e293b", "#1a2333", "#232f44"], path: ["#334155", "#2e3b4d"], stone: ["#2f3b4f", "#2a3446"], wall: ["#0b1220", "#080e1a"], water: ["#0e7490", "#155e75"], tall: "#1e293b", tint: "251,191,36", tintA: 0.1, fx: "", dark: 0.14 },
      cupola: { grass: ["#1b1446", "#171040", "#201850"], path: ["#2e2470", "#28206a"], stone: ["#251c5e", "#201756"], wall: ["#0e0a2c", "#0a0722"], water: ["#0e7490", "#155e75"], tall: "#1b1446", tint: "34,211,238", tintA: 0.1, fx: "sparks", dark: 0.1 },
      vip: { grass: ["#2a1250", "#240e48", "#301658"], path: ["#4a2a7a", "#442472"], stone: ["#3a1e64", "#34185c"], wall: ["#180a34", "#12062a"], water: ["#0e7490", "#155e75"], tall: "#2a1250", tint: "250,204,21", tintA: 0.1, fx: "", dark: 0.1 },
      terrazza: { grass: ["#111a2e", "#0d1526", "#16203a"], path: ["#1e293b", "#1a2333"], stone: ["#243044", "#1f293b"], wall: ["#0a0f1e", "#070b16"], water: ["#0e7490", "#155e75"], tall: "#111a2e", tint: "190,210,255", tintA: 0.1, fx: ["rain", "rain"], dark: 0.22 },
      penthouse: { grass: ["#0b1020", "#080c18", "#10162a"], path: ["#1e1b4b", "#18163f"], stone: ["#14122e", "#100e26"], wall: ["#05070f", "#03050b"], water: ["#0e7490", "#155e75"], tall: "#0b1020", tint: "250,204,21", tintA: 0.12, fx: "sparks", dark: 0.16 }
    },
    floors: "_hoekigpurd", solid: "CKVEQIFJMRN",
    act: { x: "Fruga nel cassonetto", K: "Usa il terminale", V: "Guarda il distributore", E: "Guarda il traliccio", Q: "Guarda l'insegna", I: "Guarda i tubi", F: "Guarda la barriera", J: "Guarda il jukebox", M: "Guarda il banco", T: "Guarda il tavolo", D: "Guarda il bancone", W: "Guarda la finestra", n: "Leggi l'insegna", q: "Entra", v: "Esci", s: "Siediti un momento" },
    rest: { ch: "s", label: "Siediti un momento", text: "Ti siedi. La pioggia picchia sul tetto come un metronomo stanco. (Il gioco salva da solo: qui puoi rileggere l'Archivio di Rete.)" },
    texts: { seen: "Il drone ti inquadra e ti marca: «Soggetto non autorizzato». Per un attimo il mondo è una griglia rossa. Poi ti ritrovi nell'ombra, dove eri prima.", nothing: "Niente di utile. Solo pioggia e luce rotta.", noHero: "Neo-Rondine vuole un Campione. Crea prima il tuo.", chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota. Resta un odore di ozono." },
    journal: { name: "L'Archivio di Rete", sub: "Dossier, Hacking, legami e finali" },
    cases: CASES,
    bonds: {
      per: 4, talk: 2, max: 4, names: ["Estranei", "Conoscenti", "Alleati", "Fidati", "Famiglia di strada"],
      scenes: {
        nr_kira: [{ lv: 2, id: "kir2", lines: [["nr_kira", "Mio fratello dice che la città è un codice che qualcuno ha scritto di fretta. Io dico che basta una riga per cambiarlo."], ["nr_kira", "Se mi trovano, nasconditi. Se ti trovano, nascondi me. Funziona meglio così."]], reward: (K) => K.bond("hackeraggio", 5) },
          { lv: 3, id: "kir3", prize: "+10 Hacking e il cyberdeck di Kira", lines: [["nr_kira", "Il mio cyberdeck. Tre porte rotte, una calamita e un adesivo di mio fratello. Ti serve più di me."], ["nr_kira", "Non perderlo. E se lo perdi, fallo con stile."]], reward: (K) => { K.bond("hackeraggio", 10); } }],
        nr_jax: [{ lv: 2, id: "jax2", lines: [["nr_jax", "Giocavo nel '70. Il pallone era vero, il portiere era vero e l'arbitro era uno che si offendeva."], ["nr_jax", "Adesso hanno tolto quello che si offendeva. Ed è il primo che mi manca."]], reward: (K) => K.bond("fama", 3) },
          { lv: 3, id: "jax3", prize: "+10 Energia e la gamba di scorta", lines: [["nr_jax", "Ti do la gamba di scorta. Non è per camminare: è per ricordare che anche i pezzi rotti servono a qualcosa."], ["nr_jax", "Tienila vicino al cuore. O al magazzino, se ti pesa."]], reward: (K) => { K.bond("energia", 10); } }],
        nr_nyx: [{ lv: 2, id: "nyx2", lines: [["nr_nyx", "Sono programmata per l'imparzialità. Ho scoperto che è un'opinione travestita da funzione."], ["nr_nyx", "Non dirlo. Sarei costretta a segnalarmi."]], reward: (K) => K.bond("fama", 3) },
          { lv: 3, id: "nyx3", prize: "+10 Hacking e il fischietto di Nyx", lines: [["nr_nyx", "Il mio fischietto d'acciaio. Ha fischiato diecimila falli e non ne ha mai sbagliato uno. Fino a stasera."], ["nr_nyx", "Usalo quando serve. Io non ho più l'autorità. Ho solo il dubbio."]], reward: (K) => { K.bond("hackeraggio", 10); } }]
      }
    },
    inv: {
      items: {
        nr_datapad: { n: "Datapad Cifrato", icon: "💾", d: "Frammento di memoria ottica con dati del campionato storico. Ne esistono sei.", gift: { nr_kira: 15 }, giftAny: 3, react: { nr_kira: "Un datapad storico! Dentro c'è la prima partita giocata a Rondinara. Con la palla di cuoio." } },
        nr_cella: { n: "Cella al Litio Sovraccaricata", icon: "🔋", d: "Batteria ad alto amperaggio. In partita: +2 alla tecnica.", match: { at: 0, df: 0, te: 2 }, gift: { nr_jax: 10 }, giftAny: 2 },
        nr_visiera: { n: "Visiera Olografica di Scarto", icon: "🕶️", d: "Visore da hacker con lenti a contrasto. In partita: +1 all'attacco.", match: { at: 1, df: 0, te: 0 }, gift: { nr_nyx: 10 }, giftAny: 2 },
        nr_pillola: { n: "Pillola di Liquido Refrigerante", icon: "🧪", d: "Fiala criogenica per raffreddare i condensatori. In partita: +2 alla difesa.", match: { at: 0, df: 2, te: 0 }, gift: { nr_volt: 8 }, giftAny: 1 }
      }
    },
    clock: {
      slots: ["Pioggia Acida", "Blackout Programmato", "Allarme Rosso"], hud: true, tint: [null, "rgba(2,4,20,.45)", "rgba(220,30,60,.16)"],
      onSlot(K, giorno, fascia, nome) { return nome === "Blackout Programmato" ? [["voce", "Tutte le luci si spengono in sequenza, settore per settore. I droni tacciono. Per un'ora, la città è solo buio e respiro."]] : nome === "Allarme Rosso" ? [["voce", "Un sirenone ammorbidito da un filtro corporativo: «Allarme di livello rosso. Mantenere la calma e restare in casa». Nei vicoli, i droni raddoppiano."]] : null; }
    },
    endings: {
      libero: ["Il Codice Libero", "Sconfiggi Vektor, rifiuti la sua corruzione e rilasci il virus di K1-RA nella rete pubblica: il firewall corporativo crolla e il calcio torna un gioco libero per umani e cyborg di strada.", "Rifiuta il Barone e carica il virus di K1-RA nel server."],
      corporativo: ["Il Patto d'Oro", "Accetti il contratto milionario di Vektor dopo la vittoria in finale: stella della lega commerciale, con status da élite e il rimorso di aver tradito i bassifondi.", "Firma il contratto di Vektor sulla consolle."],
      segreto: ["Protocollo Zero del Fondatore", "Raccogli i sei Datapad e inserisci la sequenza del 1900: il server storico delle Rondini originali si riattiva, i microchip truccati si spengono e la città si libera senza caos.", "Segreto: tutti e sei i Datapad e la sequenza antica."]
    },
    heroLook: () => ({ bg: ["#0b2a45", "#22d3ee"], shirt: "#06b6d4" }),
    heroTitle: () => "Campione dei Circuiti",
    musicMain: "circuiti",
    music: { circuiti: { bpm: 108, chords: ["Am", "F", "C", "G", "Am", "Dm", "E", "Am"], lres: 3, lw: "sawtooth", lv: 0.028,
      lead: "A4 - - E5 - C5 - - | D5 - - F5 - A4 - - | E5 - - G5 - E5 - - | D5 - B4 - G4 - - - | A4 - - E5 - A5 - - | F5 - D5 - A4 - - - | G#4 - B4 - E5 - - - | A4 - - - - - - -",
      bass: "R . R . 5 . R . R . R . 5 . 8 .", bv: 0.13, arp: "1 5 8 5 3 5 8 5", aw: "square", av: 0.009, drum: "k . h . s . h k k . h h s . h .", dv: 0.12 } },
    plugins: [{
      tick(zid, spec, px, py, dt, K) { // piastre elettrificate: se la polarità non è invertita, scaricano
        const tx = Math.floor(px / TS), ty = Math.floor((py - 4) / TS), u = K.ZX && K.ZX.under && K.ZX.under[ty] && K.ZX.under[ty][tx];
        if (u !== "e" || K.hack.on("pol_" + zid) || K.F.get("nr_shock", 0) > Date.now()) return null;
        K.F.set("nr_shock", Date.now() + 1500); K.bond("energia", -8); K.note("Scarica! −8 Carica Elettrica"); const b = spec.sneakStart || spec.start || [1, 1]; return [b[0] * TS + 8, b[1] * TS + 12];
      },
      hud(g, zid, spec, K) {
        if (!spec || spec.interior && !spec.hud) return; g.save(); g.font = "700 8px 'Trebuchet MS', sans-serif";
        const en = K.stat("energia"), hk = K.stat("hackeraggio"), s = `⚡ ${en}  💻 ${hk}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(5,3,20,.8)"; g.fillRect(4, 4, w, 13); g.fillStyle = "#67e8f9"; g.fillText(s, 9, 13.5); g.restore();
      }
    }],
    mood(g, fr, K) { // riflessi di neon che scorrono sopra la scena
      const c = g.canvas, a = 0.05 + 0.025 * Math.sin(fr / 40); const gr = g.createLinearGradient(0, 0, c.width, 0); gr.addColorStop(0, `rgba(34,211,238,${a})`); gr.addColorStop(0.5, "rgba(0,0,0,0)"); gr.addColorStop(1, `rgba(240,171,252,${a})`); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
    },
    floorPaint(K, f, sx, sy, tx, ty) {
      const P = K.P, g = K.g, fr = Math.floor(performance.now() / 16);
      if (f === "_") {
        P(sx, sy, 16, 16, (tx + ty) % 2 ? "#14102c" : "#181234"); P(sx, sy + 15, 16, 1, "rgba(0,0,0,.35)"); if (rn(tx, ty, 2) < 0.1) P(sx + 3, sy + 7, 8, 1, "rgba(255,255,255,.07)");
        if (rn(tx, ty, 3) < 0.2) { const c = NRGB[Math.floor(rn(tx, ty, 4) * 5)]; g.fillStyle = `rgba(${c},.18)`; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7, 3.5, 0, 0, 7); g.fill(); g.fillStyle = `rgba(${c},.28)`; g.fillRect(sx + 4, sy + 8, 8, 1); const r = ((fr / 2 + tx * 7 + ty * 5) % 24) / 24; g.strokeStyle = `rgba(200,230,255,${0.4 * (1 - r)})`; g.lineWidth = 0.7; g.beginPath(); g.ellipse(sx + 8, sy + 9, 1 + r * 6, 0.5 + r * 3, 0, 0, 7); g.stroke(); }
        return true;
      }
      if (f === "h") { P(sx, sy, 16, 16, "#0a0818"); for (let i = 0; i < 5; i++) P(sx + 1, sy + 1 + i * 3, 14, 1.5, "#1e1b4b"); P(sx, sy, 16, 1, "rgba(255,255,255,.06)"); g.fillStyle = `rgba(34,211,238,${0.06 + 0.04 * Math.sin(fr / 20 + tx)})`; g.fillRect(sx + 2, sy + 2, 12, 12); return true; }
      if (f === "o") { P(sx, sy, 16, 16, "#0f172a"); g.strokeStyle = "rgba(34,211,238,.5)"; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 6; k++) { const a = (Math.PI / 3) * k + 0.52; g.lineTo(sx + 8 + Math.cos(a) * 7, sy + 8 + Math.sin(a) * 7); } g.closePath(); g.stroke(); if ((tx * 3 + ty * 5 + Math.floor(fr / 40)) % 9 === 0) { g.fillStyle = "rgba(34,211,238,.28)"; g.fill(); } return true; }
      if (f === "e") {
        const on = !K.hack.on("pol_" + K.ZX.id); P(sx, sy, 16, 16, "#1c1917"); for (let i = -2; i < 6; i++) { g.fillStyle = on ? "#facc15" : "#365314"; g.beginPath(); g.moveTo(sx + i * 6, sy + 16); g.lineTo(sx + i * 6 + 4, sy + 16); g.lineTo(sx + i * 6 + 12, sy); g.lineTo(sx + i * 6 + 8, sy); g.closePath(); g.fill(); }
        P(sx, sy, 16, 16, "rgba(0,0,0,.35)"); if (on && (fr + tx * 3 + ty) % 17 < 3) { g.strokeStyle = "rgba(255,250,170,.95)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx + 2, sy + 4); g.lineTo(sx + 7, sy + 9); g.lineTo(sx + 5, sy + 11); g.lineTo(sx + 13, sy + 13); g.stroke(); } if (!on) { g.fillStyle = "rgba(163,230,53,.4)"; g.fillRect(sx + 6, sy + 6, 4, 4); } return true;
      }
      if (f === "k") { P(sx, sy, 16, 16, "#0a1020"); for (let i = 0; i < 4; i++) P(sx, sy + i * 4 + 3, 16, 1, "rgba(250,204,21,.18)"); if (rn(tx, ty, 6) < 0.3) P(sx + 6, sy + 6, 3, 3, (Math.floor(fr / 15) + tx + ty) % 3 ? "#22d3ee" : "#f0abfc"); return true; }
      if (f === "g") { P(sx, sy, 16, 16, "#0c1030"); g.strokeStyle = `rgba(34,211,238,${0.28 + 0.14 * Math.sin(fr / 18 + tx + ty)})`; g.lineWidth = 0.8; g.strokeRect(sx + 0.5, sy + 0.5, 15, 15); if ((tx + ty) % 2) { g.strokeStyle = "rgba(240,171,252,.22)"; g.beginPath(); g.moveTo(sx, sy + 16); g.lineTo(sx + 16, sy); g.stroke(); } const w = ((fr * 0.6 + tx * 9) % 64) / 64; g.fillStyle = `rgba(34,211,238,${0.2 * (1 - w)})`; g.fillRect(sx, sy + w * 16, 16, 2); return true; }
      if (f === "p") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#3b0f5c" : "#340a52"); P(sx, sy, 16, 1, "rgba(250,204,21,.45)"); P(sx, sy, 1, 16, "rgba(250,204,21,.45)"); g.fillStyle = "rgba(250,204,21,.4)"; g.beginPath(); g.moveTo(sx + 8, sy + 4); g.lineTo(sx + 12, sy + 8); g.lineTo(sx + 8, sy + 12); g.lineTo(sx + 4, sy + 8); g.closePath(); g.fill(); return true; }
      if (f === "u") { P(sx, sy, 16, 16, "#0a1020"); g.strokeStyle = "#475569"; g.lineWidth = 1; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(sx + i * 4 + 2, sy); g.lineTo(sx + i * 4 + 2, sy + 16); g.stroke(); g.beginPath(); g.moveTo(sx, sy + i * 4 + 2); g.lineTo(sx + 16, sy + i * 4 + 2); g.stroke(); } g.fillStyle = `rgba(251,113,133,${0.10 + 0.07 * Math.sin(fr / 25 + tx)})`; g.fillRect(sx, sy, 16, 16); return true; }
      if (f === "r") { P(sx, sy, 16, 16, "#111827"); P(sx, sy + 3, 16, 2, "#94a3b8"); P(sx, sy + 11, 16, 2, "#94a3b8"); for (let i = 0; i < 4; i++) P(sx + i * 4 + ((ty * 3) % 3), sy + 2, 1.5, 12, "#374151"); P(sx, sy + 5, 16, 1, `rgba(34,211,238,${0.4 + 0.3 * Math.sin(fr / 10 + tx)})`); return true; }
      if (f === "d") { P(sx, sy, 16, 16, "#1f2937"); P(sx, sy, 16, 1, "rgba(255,255,255,.1)"); if ((tx + ty) % 2 === 0) { P(sx + 2, sy + 7, 12, 2, "#facc15"); P(sx + 7, sy + 2, 2, 12, "#facc15"); } if (((fr >> 4) + tx) % 4 === 0) P(sx + 7, sy + 7, 2, 2, "#fb7185"); return true; }
      if (f === "i") { P(sx, sy, 16, 16, (tx + ty) % 2 ? "#334155" : "#2e3b4d"); P(sx, sy, 16, 1, "rgba(255,255,255,.1)"); P(sx + 1, sy + 1, 1, 1, "#64748b"); P(sx + 14, sy + 14, 1, 1, "#64748b"); if (ty % 5 === 0) P(sx, sy + 14, 16, 2, "#facc15"); return true; }
      return false;
    },
    paint: {
      // palazzo: facciata scura con finestre accese, insegne al neon e tetto con antenna
      C(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, m = K.ZX.map, top = !(m[ty - 1] && m[ty - 1][tx] === "C"), left = !(m[ty] && m[ty][tx - 1] === "C"), sd = Math.floor(tx / 4) * 7 + ty;
        g.fillStyle = (tx + Math.floor(ty / 3)) % 2 ? "#161236" : "#120e2e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(sx, sy, 1, 16);
        if (rn(tx, ty, 8) < 0.6) { const lit = rn(tx, ty, 9) < 0.55; g.fillStyle = "#07051a"; g.fillRect(sx + 3, sy + 3, 10, 9); g.fillStyle = lit ? (rn(tx, ty, 10) < 0.5 ? "rgba(251,191,36,.75)" : "rgba(34,211,238,.6)") : "rgba(100,116,139,.25)"; g.fillRect(sx + 4, sy + 4, 8, 7); g.fillStyle = "#07051a"; g.fillRect(sx + 7.5, sy + 4, 1, 7); }
        if (top) { g.fillStyle = "#0a0820"; g.fillRect(sx, sy, 16, 4); g.fillStyle = NEON[sd % 5]; g.fillRect(sx, sy + 4, 16, 1); if ((tx + ty) % 3 === 0) { g.fillStyle = "#334155"; g.fillRect(sx + 7, sy - 8, 2, 8); g.fillStyle = (Math.floor(fr / 20) + tx) % 2 ? "#f43f5e" : "#450a0a"; g.fillRect(sx + 7, sy - 8, 2, 2); } }
        if (left) { g.fillStyle = "rgba(34,211,238,.25)"; g.fillRect(sx, sy, 1, 16); }
      },
      // terminale di hacking: schermo con righe verdi che scorrono
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, hk = K.hack.on("used_" + K.ZX.id + "_" + tx + "_" + ty);
        g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx + 1, sy + 13, 14, 3); g.fillStyle = "#1e293b"; g.fillRect(sx + 2, sy + 1, 12, 13); g.fillStyle = "#020617"; g.fillRect(sx + 3, sy + 2, 10, 7);
        for (let i = 0; i < 4; i++) { g.fillStyle = hk ? "rgba(34,211,238,.85)" : "rgba(74,222,128,.85)"; g.fillRect(sx + 4, sy + 3 + i * 1.6, 2 + ((Math.floor(fr / 8) + i * 3 + tx) % 6), 0.9); }
        g.fillStyle = "#334155"; g.fillRect(sx + 3, sy + 10, 10, 3); for (let i = 0; i < 4; i++) { g.fillStyle = (Math.floor(fr / 12) + i) % 3 ? "#22d3ee" : "#f0abfc"; g.fillRect(sx + 4 + i * 2.4, sy + 11, 1.4, 1.4); }
        K.glow(g, sx + 8, sy + 6, 14, "74,222,128", 0.18 + 0.06 * Math.sin(fr / 10)); K.light(sx + 8, sy + 6, 30, "74,222,128", 0.18);
      },
      // distributore: macchina al neon con colori diversi
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, c = NEON[(tx * 3 + ty) % 5], rg = NRGB[(tx * 3 + ty) % 5];
        g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx + 1, sy + 14, 14, 2); g.fillStyle = "#0f172a"; g.fillRect(sx + 2, sy - 3, 12, 18); g.fillStyle = c; g.fillRect(sx + 3, sy - 2, 10, 2); g.fillStyle = "#020617"; g.fillRect(sx + 3, sy + 1, 10, 9);
        for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) { g.fillStyle = `rgba(${rg},${0.4 + 0.3 * ((i + k + Math.floor(fr / 30)) % 2)})`; g.fillRect(sx + 4 + k * 3, sy + 2 + i * 3, 2, 2); }
        g.fillStyle = "#334155"; g.fillRect(sx + 4, sy + 11, 8, 3); K.glow(g, sx + 8, sy + 5, 16, rg, 0.2); K.light(sx + 8, sy + 6, 36, rg, 0.2);
      },
      // traliccio EMP: bobina con archi elettrici
      E(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => {
          const x = tx * TS - cx + 8, y = ty * TS - cy + 14; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(x, y, 9, 3, 0, 0, 7); g.fill(); g.fillStyle = "#1e293b"; g.fillRect(x - 3, y - 32, 6, 32); g.fillStyle = "#334155"; for (let i = 0; i < 4; i++) g.fillRect(x - 6, y - 28 + i * 7, 12, 2.5);
          g.fillStyle = "#0f172a"; g.beginPath(); g.arc(x, y - 36, 5, 0, 7); g.fill(); const f2 = Math.floor(fr / 3) % 10; g.strokeStyle = `rgba(150,230,255,${f2 < 3 ? 0.95 : 0.35})`; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - 40); g.lineTo(x + 6 + (f2 % 4), y - 46 + f2); g.lineTo(x + 3, y - 50); g.stroke(); g.beginPath(); g.moveTo(x, y - 40); g.lineTo(x - 7, y - 44 - (f2 % 3)); g.stroke();
          g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(34,211,238,${0.18 + 0.1 * Math.sin(fr / 6 + tx)})`; g.beginPath(); g.arc(x, y - 38, 14, 0, 7); g.fill(); g.globalCompositeOperation = "source-over";
        }); K.light(sx + 8, sy - 20, 48, "34,211,238", 0.22);
      },
      // insegna olografica su un palo
      Q(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => {
          const x = tx * TS - cx + 8, y = ty * TS - cy + 14, k = (tx + ty) % 5, T = ["BAR", "RICAMBI", "24H", "TATTOO", "CHIP"][k], c = NEON[k]; g.fillStyle = "#1e293b"; g.fillRect(x - 1, y - 22, 2, 22); g.fillStyle = "#07051a"; g.fillRect(x - 13, y - 34, 26, 11); g.strokeStyle = c; g.lineWidth = 1.5; g.strokeRect(x - 12.5, y - 33.5, 25, 10); const fl = Math.floor(fr / 9 + tx * 3) % 19 === 0;
          if (!fl) { g.fillStyle = c; g.font = "bold 7px monospace"; g.textAlign = "center"; g.fillText(T, x, y - 26); g.textAlign = "left"; g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(${NRGB[k]},.18)`; g.beginPath(); g.arc(x, y - 28, 20, 0, 7); g.fill(); g.globalCompositeOperation = "source-over"; }
        }); K.light(sx + 8, sy - 12, 34, NRGB[(tx + ty) % 5], 0.2);
      },
      // tubi e sfiati con vapore
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1e293b"; g.fillRect(sx + 2, sy + 2, 12, 13); g.fillStyle = "#334155"; g.fillRect(sx + 4, sy + 1, 3, 14); g.fillRect(sx + 9, sy + 4, 3, 11); g.fillStyle = "#475569"; g.fillRect(sx + 3, sy + 7, 10, 2);
        for (let i = 0; i < 3; i++) { const t = ((fr * 0.5 + i * 12) % 30) / 30; g.fillStyle = `rgba(200,220,240,${0.35 * (1 - t)})`; g.beginPath(); g.arc(sx + 10 + Math.sin(t * 5 + i) * 2, sy - t * 12, 2 + t * 4, 0, 7); g.fill(); }
      },
      // barriera laser: due paletti e il raggio
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, off = K.hack.on("laser_" + K.ZX.id); g.fillStyle = "#1e293b"; g.fillRect(sx, sy + 1, 3, 14); g.fillRect(sx + 13, sy + 1, 3, 14); g.fillStyle = off ? "#475569" : "#f43f5e"; g.fillRect(sx, sy + 1, 3, 2); g.fillRect(sx + 13, sy + 1, 3, 2);
        if (!off) { g.strokeStyle = `rgba(244,63,94,${0.7 + 0.2 * Math.sin(fr / 4)})`; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sx + 3, sy + 4); g.lineTo(sx + 13, sy + 4); g.moveTo(sx + 3, sy + 8); g.lineTo(sx + 13, sy + 8); g.moveTo(sx + 3, sy + 12); g.lineTo(sx + 13, sy + 12); g.stroke(); K.glow(g, sx + 8, sy + 8, 14, "244,63,94", 0.25); }
      },
      // porta: lamiera con striscia luminosa
      q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, k = (tx * 3 + ty) % 5; g.fillStyle = "#0a0820"; g.fillRect(sx, sy - 2, 16, 18); g.fillStyle = "#1e293b"; g.fillRect(sx + 2, sy + 1, 12, 15); g.fillStyle = "#0f172a"; g.fillRect(sx + 3, sy + 2, 10, 14); g.fillStyle = NEON[k]; g.fillRect(sx + 2, sy, 12, 1.5); g.fillRect(sx + 7.5, sy + 4, 1, 12); g.fillStyle = `rgba(${NRGB[k]},${0.55 + 0.2 * Math.sin(fr / 12)})`; g.fillRect(sx + 4, sy + 8, 2, 2); g.fillRect(sx + 10, sy + 8, 2, 2); K.glow(g, sx + 8, sy + 6, 16, NRGB[k], 0.22); K.light(sx + 8, sy + 8, 34, NRGB[k], 0.2); },
      // jukebox al neon
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3b0764"; g.fillRect(sx + 2, sy - 2, 12, 17); g.fillStyle = "#020617"; g.beginPath(); g.arc(sx + 8, sy + 4, 4.5, Math.PI, 0); g.fillRect(sx + 3.5, sy + 4, 9, 6); g.fill();
        for (let i = 0; i < 5; i++) { g.fillStyle = NEON[(i + Math.floor(fr / 20)) % 5]; g.fillRect(sx + 4 + i * 1.8, sy + 3, 1.2, 6); } g.fillStyle = "#f0abfc"; g.fillRect(sx + 3, sy - 1, 10, 1); K.glow(g, sx + 8, sy + 6, 16, "240,171,252", 0.22); K.light(sx + 8, sy + 6, 36, "240,171,252", 0.22);
      },
      // banco da lavoro con attrezzi
      M(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1e293b"; g.fillRect(sx, sy + 5, 16, 9); g.fillStyle = "#334155"; g.fillRect(sx, sy + 4, 16, 2); g.fillStyle = "#64748b"; for (let i = 0; i < 4; i++) g.fillRect(sx + 2 + i * 3.5, sy - 3, 1.5, 7); g.fillStyle = "#facc15"; g.fillRect(sx + 11, sy + 1, 4, 3); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx, sy + 14, 16, 2); },
      // cassonetto / cassa
      x(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx + 1, sy + 13, 14, 3); g.fillStyle = "#0f3a2c"; g.fillRect(sx + 1, sy + 4, 14, 10); g.fillStyle = "#14532d"; g.fillRect(sx, sy + 2, 16, 3); g.fillStyle = "#052e16"; g.fillRect(sx + 3, sy + 8, 10, 1); g.fillStyle = (Math.floor(fr / 18) + tx) % 2 ? "#facc15" : "#a16207"; g.fillRect(sx + 7, sy + 5, 2, 2); },
      // tavolo al neon
      T(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 13, 14, 3); g.fillStyle = "#1e1b4b"; g.fillRect(sx + 1, sy + 5, 14, 8); g.fillStyle = NEON[(tx + ty) % 5]; g.fillRect(sx + 1, sy + 5, 14, 1.5); g.fillStyle = "#0f172a"; g.fillRect(sx + 7, sy + 13, 2, 3); g.fillStyle = `rgba(${NRGB[(tx * 2 + ty) % 5]},.9)`; g.fillRect(sx + 4, sy + 2, 2.5, 4); g.fillRect(sx + 9, sy + 3, 2.5, 3); },
      // bancone
      D(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2a1040"; g.fillRect(sx, sy + 3, 16, 12); g.fillStyle = "#f0abfc"; g.fillRect(sx, sy + 3, 16, 1.5); g.fillStyle = "#12061e"; g.fillRect(sx, sy + 14, 16, 2); for (let i = 0; i < 3; i++) { g.fillStyle = NEON[(i + tx) % 5]; g.fillRect(sx + 2 + i * 5, sy - 3, 2.5, 6); g.fillStyle = "#1e293b"; g.fillRect(sx + 2.5 + i * 5, sy - 5, 1.5, 3); } },
      // armadio server (libreria)
      L(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#0f172a"; g.fillRect(sx, sy - 3, 16, 19); g.fillStyle = "#1e293b"; for (let i = 0; i < 4; i++) g.fillRect(sx + 1.5, sy - 1 + i * 4.2, 13, 3); for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) { g.fillStyle = (Math.floor(fr / 14) + i * 3 + k * 5 + tx) % 4 ? "rgba(34,211,238,.8)" : "rgba(240,171,252,.9)"; g.fillRect(sx + 3 + k * 3, sy + i * 4.2, 1.2, 1.2); } K.light(sx + 8, sy + 6, 22, "34,211,238", 0.1); },
      // finestra con pioggia al neon
      W(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#12061e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#1e1b4b"; g.fillRect(sx + 2, sy + 2, 12, 10); g.fillStyle = `rgba(${NRGB[(tx + 1) % 5]},.35)`; g.fillRect(sx + 3, sy + 3, 10, 8); g.strokeStyle = "rgba(200,230,255,.5)"; g.lineWidth = 0.8; for (let i = 0; i < 4; i++) { const y = ((fr + i * 9 + tx * 5) % 20) - 4; g.beginPath(); g.moveTo(sx + 3 + i * 2.6, sy + 3 + Math.max(0, y)); g.lineTo(sx + 3 + i * 2.6, sy + 3 + Math.min(8, y + 3)); g.stroke(); } g.fillStyle = "#0f172a"; g.fillRect(sx + 7.5, sy + 2, 1, 10); },
      // scafo della monorotaia: lamiera argentata, finestrini illuminati, striscia al neon
      R(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, m = K.ZX.map, top = !(m[ty - 1] && m[ty - 1][tx] === "R"), bot = !(m[ty + 1] && m[ty + 1][tx] === "R"); g.fillStyle = "#cbd5e1"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#94a3b8"; g.fillRect(sx, sy + 12, 16, 4); if (top) { g.fillStyle = "#e2e8f0"; g.fillRect(sx, sy, 16, 3); } if (bot) { g.fillStyle = "#475569"; g.fillRect(sx, sy + 13, 16, 3); } g.fillStyle = "#0b1220"; g.fillRect(sx + 2, sy + 4, 12, 6); g.fillStyle = (tx + Math.floor(fr / 90)) % 3 ? "rgba(251,191,36,.8)" : "rgba(103,232,249,.8)"; g.fillRect(sx + 3, sy + 5, 10, 4); g.fillStyle = "#22d3ee"; g.fillRect(sx, sy + 11, 16, 1); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx, sy, 1, 16); },
      // colonna olografica: cilindro di luce con figure che scorrono
      N(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#0f172a"; g.fillRect(sx + 4, sy + 11, 8, 4); g.fillStyle = "#22d3ee"; g.fillRect(sx + 4, sy + 11, 8, 1); K.later((g2, cx, cy) => { const x = tx * TS - cx + 8, y = ty * TS - cy + 11; const gr = g2.createLinearGradient(0, y - 34, 0, y); gr.addColorStop(0, "rgba(34,211,238,0)"); gr.addColorStop(1, "rgba(34,211,238,.4)"); g2.fillStyle = gr; g2.fillRect(x - 5, y - 34, 10, 34); const k = (Math.floor(fr / 6) + tx) % 6; g2.fillStyle = "rgba(224,242,254,.85)"; g2.fillRect(x - 3, y - 26 + k, 6, 2); g2.fillRect(x - 2, y - 18 + (k % 3), 4, 2); g2.fillStyle = "rgba(240,171,252,.7)"; g2.fillRect(x - 1, y - 30, 2, 3); }); K.light(sx + 8, sy - 6, 34, "34,211,238", 0.2); },
      // brandina
      B(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#1e293b"; g.fillRect(sx + 1, sy + 3, 14, 11); g.fillStyle = "#475569"; g.fillRect(sx + 2, sy + 4, 12, 4); g.fillStyle = "#22d3ee"; g.fillRect(sx + 2, sy + 9, 12, 4); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + 1, sy + 14, 14, 2); }
    },
    cameos: []
  });
  const K = E.K;
  window.__circuiti = E.api; window.__circuitiCore = E; window.__circuitiK = K;
  window.__circuitiH = (K) => {
    let QL = [];
    const H = {
      say: (who, txt) => { QL.push([who, txt]); },
      flush: () => { const l = QL; QL = []; return l; },
      done: () => { const l = H.flush(); if (l.length) K.say(l, K.done); else K.done(); },
      ask: (prompt, opts) => { const l = H.flush(), go = () => K.ask("voce", prompt, opts.map((o) => ({ label: o.label, sub: o.sub, big: o.big, cls: o.cls, fn: o.fn, disabled: o.disabled }))); if (l.length) K.say(l, go); else go(); },
      cast: (id, name, sub, o, bio) => K.cast(id, Object.assign({ name, sub, eye: "#2a2a2a", skin: "#e0b890" }, o), bio),
      // partita EMP: i vantaggi dell'inventario (tecnica = carica iniziale, difesa = scudo contro i cyborg, attacco = tiro in più)
      play(level, opp, title, cb) {
        K.say(H.flush(), () => K.ownMatch(window.__emp.start, { level, oppName: opp, title, te: K.inv.bonus("te") + (K.stat("energia") >= 60 ? 1 : 0), df: K.inv.bonus("df"), at: K.inv.bonus("at"), done: cb }));
      },
      plaque(g, txt, x, y, col) { g.font = "bold 7px 'Trebuchet MS', sans-serif"; const w = g.measureText(txt).width + 10; g.fillStyle = "rgba(5,3,20,.88)"; g.fillRect(x - w / 2, y - 8, w, 11); g.fillStyle = col || "#22d3ee"; g.fillRect(x - w / 2, y + 2, w, 1); g.fillStyle = "#e0f2fe"; g.textAlign = "center"; g.fillText(txt, x, y); g.textAlign = "left"; },
      // tutto il cast della saga (ogni capitolo lo rimette: i volti restano gli stessi)
      people() {
        H.cast("nr_kira", "K1-RA", "Hacker ribelle, detta Kira", { style: "undercut", hair: "#06b6d4", acc: ["occhiali"], shirt: "#0f172a", skin: "#e0b890", bg: ["#164e63", "#a5f3fc"] }, "Genio dei cyberdeck. Cerca il fratello esiliato da cinque anni e nel frattempo ha hackerato una macchinetta del caffè, per principio.");
        H.cast("nr_jax", "Rusty Jax", "Ex bomber cyborg", { style: "buzz", hair: "#64748b", beard: "pizzetto", scar: true, shirt: "#7c2d12", skin: "#d5a57a", bg: ["#292524", "#d6d3d1"] }, "Vecchia gloria della lega del 2070. La gamba meccanica cigola; il tiro, quando riesce, no.");
        H.cast("nr_bolt", "Bullone-7", "Droide magazziniere", { shape: "robot", skin: "#94a3b8", shirt: "#78716c", hair: "#78716c", eye: "#fbbf24", bg: ["#1c1917", "#d6d3d1"] }, "Ripara sfere magnetiche clandestine e colleziona chip di memoria vintage. Parla a scatti, come un vecchio modem.");
        H.cast("nr_volt", "Volt il Ricettatore", "Mercante del mercato nero", { style: "short", hair: "#222", acc: ["occhiali", "berretto"], shirt: "#0891b2", skin: "#e0b890", bg: ["#3b0764", "#e9d5ff"] }, "Vende batterie, bypass e celle ad alto voltaggio sottobanco. Il banco non esiste: è un'idea, e la paghi.");
        H.cast("nr_drone", "Drone di sicurezza", "Pattuglia Vektor", { shape: "robot", skin: "#475569", shirt: "#1e293b", hair: "#1e293b", eye: "#ef4444", bg: ["#020617", "#64748b"] }, "Un occhio rosso, un motore sottile e nessuna voglia di conversare.");
        H.cast("nr_guard", "Miliziano Vektor", "Guardia corporativa", { style: "buzz", hair: "#111", shirt: "#020617", skin: "#d9a679", bg: ["#020617", "#64748b"] }, "Sentinella ottusa armata di storditore elettrico, assegnata ai cancelli della monorotaia.");
        H.cast("nr_nyx", "Nyx-09", "Arbitro-androide", { style: "slick", hair: "#94a3b8", shirt: "#334155", skin: "#e2e8f0", bg: ["#1e293b", "#cbd5e1"] }, "Automa federale programmato per l'imparzialità assoluta, tormentato da un glitch di coscienza.");
        H.cast("nr_vektor", "Barone Vektor", "Magnate della Vektor Corp", { style: "slick", hair: "#0f172a", beard: "baffi", shirt: "#581c87", skin: "#e0b890", bg: ["#2e1065", "#e9d5ff"] }, "Dominatore miliardario di Neo-Rondine, convinto che il talento umano sia obsoleto.");
        H.cast("nr_zero", "Z-Zero", "Portiere olografico", { shape: "robot", skin: "#7dd3fc", shirt: "#38bdf8", hair: "#e0f2fe", eye: "#ffffff", bg: ["#0c4a6e", "#bae6fd"] }, "Costrutto di intelligenza artificiale quantistica, imbattuto. Para qualsiasi traiettoria, tranne quelle che non ha previsto.");
        H.cast("nr_vance", "Ispettore Vance", "Polizia Urbana", { style: "short", hair: "#78716c", acc: ["berretto"], shirt: "#d97706", skin: "#e0b890", bg: ["#451a03", "#fde68a"] }, "Cerca da anni le prove sui bonifici offshore. Il sigaro è spento da quando ha smesso di sperare.");
        H.cast("nr_borea", "Capitana Borea", "Pilota cargo", { style: "ponytail", hair: "#3b82f6", shirt: "#ff8a3a", skin: "#e0b890", bg: ["#7c2d12", "#fed7aa"] }, "Pilota di cargo del 3011, atterrata per uno scambio di ricambi meccanici.");
        H.cast("nr_cyborg", "Cyborg Clandestino", "Giocatore della lega nei sotterranei", { shape: "robot", skin: "#a78bfa", shirt: "#4c1d95", hair: "#4c1d95", eye: "#f0abfc", bg: ["#2e1065", "#c4b5fd"] }, "Mezzo muscoli, mezzo servo-motori. Gioca per mangiare, e mangia olio.");
      },
      hackMenu(title, acts) { const l = H.flush(); const go = () => K.hack.run(title, acts); if (l.length) K.say(l, go); else go(); },
      // droni: pattugliano su un percorso; col terminale si deviano (restano fermi a guardare un muro); Allarme Rosso e allarme di rete ne aggiungono
      drones(zid, routes, K2) {
        const k = K2 || K, sl = k.clock.slot(), heat = k.hack.heat(), out = [];
        routes.forEach((r, i) => {
          if (sl === 1) return; // Blackout: i droni sono spenti
          if (i === 1 && sl !== 2 && heat < 2) return; // il secondo drone si accende con l'Allarme Rosso o dopo due attacchi alla rete
          if (k.hack.on("dev_" + zid + "_" + i)) out.push({ id: "nr_drone", at: r.rest || r[0], face: r.facing || "up", guard: { range: 3, cone: 0.35 } });
          else out.push({ id: "nr_drone", at: r[0], route: r, speed: r.speed || 0.5, guard: { range: sl === 2 ? 6 : 5, cone: 0.55 } });
        });
        return out;
      }
    };
    return H;
  };
})();
