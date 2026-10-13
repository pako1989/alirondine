// js/razzo.js - RAZZOPACCO · CONSEGNE DAL FUTURO · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA, nello spirito delle serie animate di fantascienza per adulti (tutto inventato). Il Campione si addormenta in
// una cella frigorifera nel 2025 e si risveglia nel 3011, a Nova Frattaglia. L'unico lavoro per cui ha «esperienza» è quello
// di corriere: alla Razzopacco, una ditta di consegne spaziali sgangherata che sta per essere comprata dalla OmniPacco.
// Novità di questa saga (oltre a quelle del motore comune):
//  - CONSEGNA A RETE (js/consegna.js): la partita originale, con un motore suo. Si guida un razzetto col dito, il pallone è un
//    pacco, i pianeti in campo curvano i lanci, i tubi pneumatici ti portano dall'altra parte, gli asteroidi ammaccano il pacco.
//  - TUBI PNEUMATICI (nel motore comune, spec.tubes): si viaggia dentro una capsula di vetro sopra la città, i canali, le case.
//  - LE CONSEGNE A TEMPO (K.pacco / K.consegnato): un pacco sopra la testa, un orologio in alto; se arrivi in tempo, mancia.
//  - LA ROTTA (K.rotta): la mappa stellare animata del razzo, per volare da un pianeta all'altro.
// Salvataggio proprio: ali-di-rondine.razzo. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__razzo || !window.__sagaCore) return;
  const DEST = {
    rz_citta: { n: "Nova Frattaglia", d: "La Terra del 3011: la città dei tubi pneumatici", at: [26, 19], col: ["#7ad8ff", "#3a5aa8"], x: 70, y: 120, r: 16 },
    rz_brodo: { n: "Pianeta Brodo", d: "Oceani di minestra, isole di cracker", at: [4, 17], col: ["#ffc86a", "#c8782a"], x: 170, y: 60, r: 13, ch: 2 },
    rz_luna: { n: "Luna Modulo 7", d: "Una luna intera di uffici e timbri", at: [3, 16], col: ["#d8d8e0", "#7a7a8a"], x: 250, y: 140, r: 10, ch: 2 },
    rz_arena: { n: "Asteroide Arena", d: "Lo stadio della Coppa dei Corrieri", at: [15, 20], col: ["#ff8a5a", "#8a3a5a"], x: 262, y: 48, r: 9, ch: 3 },
  };
  const E = window.__sagaCore.create({
    id: "razzo", key: "ali-di-rondine.razzo", title: "Razzopacco · Consegne dal Futuro", icon: "🚀", bg: "rz_titolo", chapters: 3,
    menuSub: "Ti risvegli nel 3011 e fai il corriere spaziale: tubi pneumatici, pacchi a tempo, pianeti di minestra e la Coppa dei Corrieri",
    theme: { accent: "#ff8a3a", ink: "#ffffff", paper: "rgba(26,16,48,.94)", font: "system-ui, sans-serif", chipBg: "#1a1030ee", chipBorder: "#c8a040" },
    stats: { ditta: [0, 99, 0, "La Razzopacco con te"], mance: [0, 99, 0, "Mance raccolte"] },
    travel: true,
    item: ["Francobollo spaziale", "Francobolli spaziali"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 10 + i) * 1.5); g.rotate(Math.sin(f / 30 + i) * 0.2); g.fillStyle = "#fff"; g.fillRect(-5, -6, 10, 12); g.fillStyle = ["#ff8a3a", "#7ad8ff", "#9af0c8"][i % 3]; g.fillRect(-3.5, -4.5, 7, 7); g.fillStyle = "#1a1030"; g.fillRect(-2, -1, 4, 1); g.fillRect(-3, 4, 6, 1); g.strokeStyle = "rgba(0,0,0,.3)"; g.setLineDash([1, 1]); g.strokeRect(-5, -6, 10, 12); g.setLineDash([]); g.restore(); },
    stadium: { azPitch: "neon", cageField: 0, cageMut: "turbo", venue: { ads: [["RAZZOPACCO", "#ff8a3a"], ["OMNIPACCO", "#5a6ad8"], ["SPREMUTA DI COMETA", "#9af0c8"], ["TUBI PNEUMATICI F.LLI SFIATO", "#c8a040"]], crowd: ["#ff8a3a", "#7ad8ff", "#9af0c8", "#c8a8ff", "#ffd23f"], ground: ["#3a2a6a", "#34266a"], line: "#7ad8ffcc", grid: "rgba(122,216,255,.08)", tint: "rgba(120,80,200,.08)", glow: "122,216,255", sky: ["#0a0a2a", "#2a1446"], wall: ["#2a1a4a", "#1a1030"], fx: { spd: 1.05, fr: 0.992 } } },
    regions: {
      citta: { grass: ["#4a3a7a", "#463676", "#4e3e80"], path: ["#8a8aa8", "#8484a0"], stone: ["#6a6a8a", "#646484"], wall: ["#2a2a4a", "#26264a"], water: ["#3ae8c8", "#30d8b8"], tall: "#5a4a8a", tree: ["#3ac8a8", "#36c0a0", "#3ed0b0"], tint: "200,180,255", tintA: 0.06, fx: "", dark: 0.04 },
      brodo: { grass: ["#d8a85a", "#d0a054", "#dcae62"], path: ["#e8c88a", "#e0c082"], stone: ["#c89a5a", "#c09254"], wall: ["#a8784a", "#a07244"], water: ["#e8962a", "#f0a038"], tall: "#8ab84a", tree: ["#6aa83a", "#64a036", "#70b040"], tint: "255,210,150", tintA: 0.1, fx: "", dark: 0.02 },
      luna: { grass: ["#a8a8b0", "#a2a2aa", "#aeaeb6"], path: ["#c8c8d0", "#c0c0c8"], stone: ["#8a8a92", "#84848c"], wall: ["#5a5a6a", "#545464"], water: ["#3a3a5a", "#34345a"], tall: "#8a8a92", tint: "200,210,255", tintA: 0.08, fx: "", dark: 0.06 },
      arena: { grass: ["#5a3a6a", "#563666", "#5e3e6e"], path: ["#8a6a7a", "#846474"], stone: ["#7a5a6a", "#745464"], wall: ["#3a2a4a", "#342444"], water: ["#1a1030", "#20143a"], tall: "#6a4a7a", tint: "255,180,200", tintA: 0.08, fx: "sparks", dark: 0.08 },
      interno: { grass: ["#5a5a7a", "#565676", "#5e5e7e"], path: ["#9a8a7a", "#948474"], stone: ["#7a7a8a", "#747484"], wall: ["#3a3a5a", "#343454"], water: ["#3ae8c8", "#30d8b8"], tall: "#6a6a8a", tint: "255,220,180", tintA: 0.08, fx: "dust", dark: 0.05 },
    },
    floors: "", solid: "OAKCYMUP",
    rest: { ch: "s", label: "Siediti sulla panchina a levitazione", text: "La panchina galleggia a dieci centimetri da terra e ronza piano. (Il gioco salva da solo: qui puoi rileggere il Registro di Bordo.)" },
    texts: { chestOpen: "Apri il pacco abbandonato.", chestEmpty: "Il pacco è vuoto: solo polistirolo del 2900 e un biglietto «Ci scusiamo per il ritardo».", nothing: "Niente. Solo un tubo pneumatico che fa «fssst» sopra la tua testa.", noHero: "Nova Frattaglia aspetta il suo corriere. Crea prima il tuo Campione.", seen: "«Ehi! Lei! Il modulo!» Un ispettore ti rimanda all'ingresso. Riprova, nell'ombra degli schedari." },
    journal: { name: "Il Registro di Bordo", sub: "Consegne, rotte, finali" },
    endings: {
      libera: ["RAZZOPACCO RESTA LIBERA", "La Coppa dei Corrieri è vostra. La OmniPacco ritira l'offerta. La Razzopacco resta sgangherata, piccola, in ritardo e libera: «Consegniamo tutto, prima o poi».", "Serve aver vinto la Coppa."],
      fusione: ["OMNIRAZZO: CONSEGNE PER TUTTI", "Orsola Monòpoli stringe la mano alla Professoressa. Le due ditte diventano una: i razzi della OmniPacco, il cuore della Razzopacco. E una regola nuova: nessun pacco resta indietro.", "Serve aver ascoltato la storia di Orsola."],
      ritorno: ["IL BIGLIETTO PER IL 2025", "Il pacco sigillato conteneva un biglietto di ritorno: una cella frigorifera che va all'indietro. Ti risvegli nel 2025, al campetto, con una cartolina del 3011 in tasca e un'abbronzatura spaziale.", "Serve aver tenuto il pacco misterioso sigillato."],
      pacco: ["IL PACCO NUMERO UNO", "Il primo pacco della Razzopacco, mai consegnato, fermo in magazzino dal 2025. Destinatario: il campetto di Borgo Marino. Lo consegni tu, con novecentottantasei anni di ritardo. Dentro c'è un pallone. Il tuo.", "Segreto: tutti i francobolli, tutte le consegne in orario, nessuna partita lasciata a metà."],
    },
    heroLook: () => ({ bg: ["#1a1030", "#ff8a3a"], shirt: "#ff8a3a" }),
    heroTitle: (K) => (K.F.get("rz_pk") ? `corriere in consegna (${K.F.get("rz_pk_n", "un pacco")})` : "corriere della Razzopacco"),
    act: { q: "Entra", O: "Entra nel tubo", n: "Leggi il cartello", K: "Guarda i pacchi", A: "Guarda l'insegna", Y: "Guarda l'ologramma", C: "Guarda il cratere", M: "Guarda lo schedario", U: "Guarda la piazzola", P: "Guarda la cella", R: "Apri la rotta", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        if (ch === "R") { K.rotta(); return true; }
        const t = { K: "Pacchi impilati fino al soffitto. Su uno c'è scritto «FRAGILE», su un altro «FRAGILISSIMO», su un altro ancora «NON CHIEDERE».", A: "Un'insegna al neon: «SPREMUTA DI COMETA · ORA CON IL 40% DI COMETA IN PIÙ».", Y: "Un ologramma pubblicitario: «OMNIPACCO. CONSEGNIAMO IL TUO PACCO PRIMA CHE TU LO ORDINI.» Sotto, piccolissimo: «Lo addebitiamo comunque».", C: "Un cratere. Dentro, un cartello: «PROPRIETÀ DELLA LUNA MODULO 7. VIETATO CADERE SENZA MODULO».", M: "Schedari fino all'orizzonte. Il cassetto più vicino dice: «MODULI PER RICHIEDERE MODULI».", U: "La piazzola di atterraggio: un cerchio di lucine che lampeggiano anche quando non c'è niente da far atterrare." }[ch];
        if (!t) return false; K.say([["voce", t]]); return true;
      },
      // il pacco sopra la testa e l'orologio della consegna
      top(g, zid, spec, cx, cy, d, K) {
        const pk = K.F.get("rz_pk"); if (!pk) return; const p = K.api.trPos && K.api.trPos(); if (!p) return; const x = p[0] - cx, y = p[1] - cy - 34 + Math.sin(d.fr / 8) * 1.2;
        g.fillStyle = "#c89a5a"; g.strokeStyle = "#5a3a1a"; g.lineWidth = 1; g.fillRect(x - 5, y - 5, 10, 9); g.strokeRect(x - 5, y - 5, 10, 9); g.fillStyle = "#e8d8a0"; g.fillRect(x - 1, y - 5, 2, 9);
      },
      hud(g, zid, spec, K) {
        const pk = K.F.get("rz_pk"); if (!pk) return; const left = K.paccoLeft(), late = left <= 0, t = late ? "in ritardo!" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
        g.save(); g.font = "800 9px system-ui"; g.textAlign = "right"; const s = `📦 ${K.F.get("rz_pk_n", "")} · ${t}`, w = g.measureText(s).width + 10; g.fillStyle = "rgba(26,16,48,.85)"; g.fillRect(316 - w, 26, w, 13); g.fillStyle = late ? "#ff8a7a" : left < 20 ? "#ffd23f" : "#9af0c8"; g.fillText(s, 311, 36); g.restore();
      },
    }],
    musicMain: "razzo",
    music: {
      // retrofuturo: organo elettrico, basso che rimbalza, un theremin che fischia sopra
      razzo: { bpm: 132, chords: ["Am", "Am", "F", "G", "Am", "C", "Dm", "E"], lres: 2, lw: "sine", lv: 0.045,
        lead: "A5 - C6 E6 - D6 C6 - | B5 - G5 - E5 - - - | F5 - A5 C6 - A5 F5 - | G5 - B5 D6 - B5 G5 - | A5 - E6 - A6 - E6 - | C6 - E6 G6 - E6 C6 - | D6 - F6 - A6 - F6 D6 | E6 - - - G#5 - B5 -",
        bass: "R . R 5 . R 8 .", bv: 0.1, arp: "R 3 5 8", av: 0.02, drum: "k . h . s . h h k k h . s . h .", dv: 0.14 },
    },
    paint: {
      // la stazione del tubo pneumatico: cabina d'ottone con la cupola di vetro
      O(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx + 2, sy + 13, 12, 3); g.fillStyle = "#c8a040"; g.fillRect(sx + 2, sy + 9, 12, 5); g.fillStyle = "#8a6a20"; g.fillRect(sx + 2, sy + 13, 12, 1); g.fillStyle = "rgba(170,230,255,.6)"; g.beginPath(); g.ellipse(sx + 8, sy + 7, 6, 7, 0, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 1; g.stroke(); g.fillStyle = "rgba(255,255,255,.8)"; g.fillRect(sx + 5, sy + 2, 2, 4); const a = (fr / 6) % 6.28; g.fillStyle = "#ffd23f"; g.fillRect(sx + 8 + Math.cos(a) * 3, sy + 7 + Math.sin(a) * 3, 2, 2); },
      // insegna al neon su palo
      A(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#3a3a5a"; g.fillRect(sx + 7, sy + 4, 2, 12); const on = (fr + tx * 13) % 90 > 6; g.fillStyle = "#1a1030"; g.fillRect(sx + 1, sy - 4, 14, 9); g.strokeStyle = on ? "#ff5aa8" : "#5a2a4a"; g.lineWidth = 1.2; g.strokeRect(sx + 1.5, sy - 3.5, 13, 8); if (on) { g.fillStyle = "#9af0c8"; g.fillRect(sx + 4, sy - 1, 8, 1.5); g.fillRect(sx + 4, sy + 2, 5, 1); } },
      // pacchi impilati
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; [[1, 8, 8, 7], [8, 9, 7, 6], [3, 2, 8, 6]].forEach(([x, y, w, h], i) => { g.fillStyle = ["#c89a5a", "#b88a4a", "#d8aa6a"][i]; g.fillRect(sx + x, sy + y, w, h); g.strokeStyle = "#5a3a1a"; g.lineWidth = 0.8; g.strokeRect(sx + x + 0.5, sy + y + 0.5, w - 1, h - 1); g.fillStyle = "#e8d8a0"; g.fillRect(sx + x + w / 2 - 0.5, sy + y, 1, h); }); },
      // cratere lunare
      C(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#6a6a72"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7, 5, 0, 0, 7); g.fill(); g.fillStyle = "#4a4a52"; g.beginPath(); g.ellipse(sx + 8, sy + 10, 5, 3, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(sx + 3, sy + 5, 5, 1); },
      // ologramma pubblicitario (trema)
      Y(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2a2a4a"; g.fillRect(sx + 4, sy + 12, 8, 3); const j = fr % 50 < 3 ? 2 : 0; g.fillStyle = "rgba(122,216,255,.35)"; g.beginPath(); g.moveTo(sx + 5, sy + 12); g.lineTo(sx + 1 + j, sy - 6); g.lineTo(sx + 15 + j, sy - 6); g.lineTo(sx + 11, sy + 12); g.fill(); g.fillStyle = "rgba(200,240,255,.8)"; for (let i = 0; i < 4; i++) g.fillRect(sx + 3 + j, sy - 4 + i * 3, 10, 1); },
      // schedario degli uffici lunari
      M(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#7a7a8a"; g.fillRect(sx + 1, sy - 2, 14, 17); g.fillStyle = "#5a5a6a"; for (let i = 0; i < 4; i++) { g.fillRect(sx + 2, sy - 1 + i * 4, 12, 3); g.fillStyle = "#c8c8d0"; g.fillRect(sx + 7, sy + i * 4, 2, 1); g.fillStyle = "#5a5a6a"; } },
      // piazzola d'atterraggio con le lucine
      U(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#3a3a4a"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#ffd23f"; g.fillRect(sx, sy + 7, 16, 2); const on = Math.floor(fr / 10 + tx + ty) % 3 === 0; g.fillStyle = on ? "#ff5a5a" : "#5a2a2a"; g.fillRect(sx + 2, sy + 2, 2, 2); g.fillRect(sx + 12, sy + 12, 2, 2); },
      // passerella di metallo (si cammina)
      _(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = (tx + ty) % 2 ? "#7a7a9a" : "#727292"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "rgba(0,0,0,.25)"; for (let i = 3; i < 16; i += 5) g.fillRect(sx + i, sy + 3, 1, 10); },
      // cella criogenica: cilindro di vetro con la brina
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#5a5a7a"; g.fillRect(sx + 2, sy + 12, 12, 4); g.fillStyle = "rgba(190,230,255,.75)"; g.fillRect(sx + 3, sy - 6, 10, 18); g.strokeStyle = "#e8f6ff"; g.lineWidth = 1; g.strokeRect(sx + 3.5, sy - 5.5, 9, 17); g.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 5; i++) g.fillRect(sx + 4 + ((tx * 3 + i * 5) % 8), sy - 4 + ((ty + i * 7) % 15), 1, 1); g.fillStyle = (fr >> 5) % 2 ? "#7ad8ff" : "#3a8ac8"; g.fillRect(sx + 7, sy + 13, 2, 2); },
      // l'ombra degli schedari (si cammina, e nasconde dagli ispettori)
      h(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = (tx + ty) % 2 ? "#4a4a5a" : "#464656"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy, 5, 16); g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(sx + 9, sy + 4, 4, 1); },
      // la console della rotta, nel razzo
      R(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#2a2a4a"; g.fillRect(sx + 1, sy + 4, 14, 11); g.fillStyle = "#0a0a2a"; g.fillRect(sx + 2, sy + 5, 12, 7); for (let i = 0; i < 4; i++) { g.fillStyle = ["#7ad8ff", "#ffc86a", "#d8d8e0", "#ff8a5a"][i]; g.fillRect(sx + 3 + i * 3, sy + 7 + Math.sin(fr / 20 + i) * 2, 2, 2); } g.fillStyle = (fr >> 4) % 2 ? "#ff5a5a" : "#5aff8a"; g.fillRect(sx + 13, sy + 13, 1, 1); },
    },
    guest: { id: "rz_ferruccio", lines: [["rz_ferruccio", "[felice] BIP. Consegna per {n}, Borgo Marino, anno 2025. Mittente: tu, dal futuro. (Ti dà una cartolina.) Ritardo: novecentottantasei anni. È un record della ditta. La Professoressa è molto fiera."]] },
    cameos: [
      { id: "so_blop", zone: "rz_citta", at: [27, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.spazio") || {}).done?.[1], lines: [["so_blop", "[felice] Blop, dalla Stazione Orbitale 7! Anche voi avete un tubo che fa «fssst»? Noi abbiamo un corridoio che fa «flop». Siamo quasi parenti."]] },
      { id: "sq_soffio", zone: "rz_arena", at: [8, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.quartiere") || {}).done?.[1], lines: [["sq_soffio", "[ride] Soffio, da Ponterotto. Mi hanno detto che qui il pacco curva attorno ai pianeti. Pfff: con un soffio lo curvavo anch'io. Ma nel 2025."]] },
    ],
  });
  const K = E.K;
  K.DEST = DEST;
  // ------------------------------------------------------------ LE CONSEGNE A TEMPO
  // K.pacco(id, { n: nome breve, to: id del destinatario, secs }) carica un pacco sopra la testa del Campione e fa partire l'orologio.
  // K.consegnato(id) lo consegna: true se in orario (flag rz_orario_<id>, una mancia), false se in ritardo. Solo un pacco alla volta.
  const now = () => Math.floor(Date.now() / 1000);
  K.pacco = (id, o) => { K.F.set("rz_pk", id); K.F.set("rz_pk_n", o.n || "Pacco"); K.F.set("rz_pk_t", now() + (o.secs || 90)); K.tone(660, 0.12, "triangle", 0.05); K.tone(880, 0.15, "triangle", 0.05, 0.1); };
  K.paccoLeft = () => Math.max(-1, (K.F.get("rz_pk_t", 0) | 0) - now());
  K.consegnato = (id) => { if (K.F.get("rz_pk") !== id) return false; const ok = K.paccoLeft() >= 0; K.F.set("rz_pk", ""); K.F.set("rz_pk_n", ""); if (ok) { K.F.set("rz_orario_" + id, true); K.bond("mance", 1); } K.F.set("rz_fatto_" + id, true); K.tone(ok ? 880 : 330, 0.3, "triangle", 0.05); return ok; };
  // ------------------------------------------------------------ LA ROTTA: la mappa stellare del razzo
  K.rotta = (then) => {
    if (document.querySelector(".rzMap")) return;
    const ch = K.mem().ch || 1, here = K.api.trZone(), dests = Object.keys(DEST).filter((z) => (DEST[z].ch || 1) <= ch && (z !== "rz_arena" || K.F.is("rz_arena_ok")));
    const ov = document.createElement("div"); ov.className = "rzMap";
    ov.innerHTML = `<div class="box"><h3>🚀 La rotta</h3><canvas width="640" height="400"></canvas><div class="list"></div><button type="button" class="no">Resta qui</button></div>`;
    if (!document.getElementById("rzCss")) { const st = document.createElement("style"); st.id = "rzCss"; st.textContent = `.rzMap{position:fixed;inset:0;z-index:250;background:rgba(10,8,30,.92);display:flex;align-items:center;justify-content:center;padding:12px;font-family:system-ui,sans-serif;color:#fff}.rzMap .box{width:min(100%,460px);border:3px solid #c8a040;border-radius:16px;background:linear-gradient(#2a1a4a,#140c28);padding:12px}.rzMap h3{margin:0 0 8px;font:900 20px 'Courier New',monospace;color:#ff8a3a}.rzMap canvas{width:100%;height:auto;aspect-ratio:320/200;border-radius:10px;border:1px solid #c8a040;display:block}.rzMap .list{display:grid;gap:6px;margin-top:8px}.rzMap button{min-height:46px;border-radius:12px;border:2px solid #c8a040;background:#2a1a4a;color:#fff;font:800 14px system-ui;text-align:left;padding:6px 12px}.rzMap button small{display:block;font-weight:500;opacity:.75;font-size:11px}.rzMap button.here{opacity:.5}.rzMap .no{width:100%;margin-top:8px;text-align:center;background:#1a1030}`; document.head.appendChild(st); }
    document.body.appendChild(ov);
    const cv = ov.querySelector("canvas"), g = cv.getContext("2d"); let fly = null, raf = 0, t = 0;
    const stars = Array.from({ length: 80 }, (_, i) => [(i * 97) % 320, (i * 53) % 200, i % 3]);
    function draw() {
      t++; g.setTransform(2, 0, 0, 2, 0, 0); const bg = g.createLinearGradient(0, 0, 320, 200); bg.addColorStop(0, "#0a0a2a"); bg.addColorStop(1, "#2a1036"); g.fillStyle = bg; g.fillRect(0, 0, 320, 200);
      stars.forEach(([x, y, z]) => { g.fillStyle = z ? "#c8d8ff" : "#fff"; g.fillRect((x - t * 0.05 * (z + 1) + 640) % 320, y, 1, 1); });
      g.strokeStyle = "rgba(200,160,64,.4)"; g.setLineDash([3, 4]); g.beginPath(); dests.forEach((z, i) => { const D = DEST[z]; i ? g.lineTo(D.x, D.y) : g.moveTo(D.x, D.y); }); g.stroke(); g.setLineDash([]);
      dests.forEach((z) => { const D = DEST[z], gr = g.createRadialGradient(D.x - D.r * 0.4, D.y - D.r * 0.4, 1, D.x, D.y, D.r); gr.addColorStop(0, D.col[0]); gr.addColorStop(1, D.col[1]); g.fillStyle = gr; g.beginPath(); g.arc(D.x, D.y, D.r, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = "700 8px system-ui"; g.textAlign = "center"; g.fillText(D.n, D.x, D.y + D.r + 10); if (z === here) { g.strokeStyle = "#ffd23f"; g.lineWidth = 1.5; g.beginPath(); g.arc(D.x, D.y, D.r + 4 + Math.sin(t / 8), 0, 7); g.stroke(); } });
      const from = DEST[here] || DEST.rz_citta; let sx = from.x, sy = from.y - from.r - 6, ang = -Math.PI / 2;
      if (fly) { fly.k = Math.min(1, fly.k + 0.02); const e = fly.k * fly.k * (3 - 2 * fly.k), to = DEST[fly.z]; const mx = (from.x + to.x) / 2, my = Math.min(from.y, to.y) - 50; sx = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * mx + e * e * to.x; sy = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * my + e * e * to.y; ang = Math.atan2(2 * (1 - e) * (my - from.y) + 2 * e * (to.y - my), 2 * (1 - e) * (mx - from.x) + 2 * e * (to.x - mx)); }
      g.save(); g.translate(sx, sy); g.rotate(ang); g.fillStyle = t % 4 < 2 ? "#ffd23f" : "#ff8a3a"; g.beginPath(); g.moveTo(-6, -2); g.lineTo(-11, 0); g.lineTo(-6, 2); g.fill(); g.fillStyle = "#ff8a3a"; g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.moveTo(7, 0); g.quadraticCurveTo(1, -5, -6, -3.5); g.lineTo(-6, 3.5); g.quadraticCurveTo(1, 5, 7, 0); g.fill(); g.stroke(); g.restore();
      if (fly && fly.k >= 1) { cancelAnimationFrame(raf); ov.remove(); const D = DEST[fly.z]; K.go(fly.z, D.at[0], D.at[1]); return; }
      raf = requestAnimationFrame(draw);
    }
    const go = (z) => { if (fly) return; fly = { z, k: 0 }; K.tone(220, 0.8, "sawtooth", 0.04, 0, 660); ov.querySelectorAll("button").forEach((b) => (b.disabled = true)); };
    const list = ov.querySelector(".list");
    dests.forEach((z) => { const b = document.createElement("button"); b.type = "button"; b.className = z === here ? "here" : ""; b.innerHTML = `${DEST[z].n}<small>${z === here ? "Sei qui" : DEST[z].d}</small>`; b.disabled = z === here; b.onclick = () => go(z); list.appendChild(b); });
    ov.querySelector(".no").onclick = () => { cancelAnimationFrame(raf); ov.remove(); (then || K.done)(); };
    K.rottaGo = go; draw();
  };
  // ------------------------------------------------------------ la partita originale: Consegna a Rete
  K.consegnaMatch = (o, done) => { const h = (K.hero && K.hero()) || {}; return K.ownMatch(window.__consegna.start, Object.assign({ usColor: "#ff8a3a", us: "Razzopacco", hero: { name: h.name || "Tu" }, mate: { name: "Capitana Borea" } }, o, { done: (r) => { if (r.quit) K.F.set("rz_lasciato", true); if (r.data && r.data.perfette) K.F.set("rz_perfette", (K.F.get("rz_perfette", 0) | 0) + r.data.perfette); done(r); } })); };
  window.__razzo = E.api;
})();
