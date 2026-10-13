// js/grigio.js - IL CAVALIERE DELLA NOTTE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga NOIR e seria, nello spirito dei fumetti di vigilanti mascherati (tutto inventato: città, personaggi, simboli).
// Porto Scuro, una città di moli e gru dove piove sempre. La Lega del Porto è truccata dal Sindacato della Nebbia;
// di giorno il Campione gioca nel Porto Scuro Calcio, la squadra che perde apposta per paura. Di notte indossa il mantello
// dell'AIRONE, la vecchia leggenda della città, e scopre chi tira i fili.
// Novità di questa saga (oltre a quelle del motore comune):
//  - OMBRE E GADGET (js/gadget.js): la partita originale, con un motore suo. Partita a turni su caselle, di notte: i difensori
//    annunciano dove entreranno, tu li schivi, li salti quando sono sbilanciati e usi la CINTURA dei gadget.
//  - IL FURTIVO (motore comune, guard nei PNG): guardie con il cono di vista che si ferma sui muri; nell'ombra e dietro le casse
//    non ti vedono. Se ti vedono, si torna all'ingresso.
//  - L'OFFICINA (K.officina): una scena nuova del motore. Alfio costruisce i gadget; tu scegli quali mettere nella cintura,
//    e la cintura si porta in tutte le partite della saga.
//  - NEON NELLA PIOGGIA: pozzanghere che riflettono le insegne, tessere di insegne al neon che sfarfallano, fari e fumo.
// Salvataggio proprio: ali-di-rondine.grigio. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__grigio || !window.__sagaCore) return;
  const GADGETS = ["visore", "fumo", "rampino", "scudo", "segnale", "bolas"];
  const GSUB = {
    visore: "Il Visore notturno: tre turni in cui vedi tutto, anche dove si tuffa il portiere.",
    fumo: "Il Fumogeno: i difensori restano fermi un turno. In difesa, il loro tiro vale metà.",
    rampino: "Il Rampino: il portatore avanza di due caselle, scavalcando chi c'è.",
    scudo: "Il Mantello rinforzato: il prossimo contrasto non passa.",
    segnale: "Il Segnale: i compagni scattano di due caselle e il passaggio non si intercetta.",
    bolas: "Le Bolas di Vela: il difensore più vicino resta legato per due turni.",
  };
  const NEON = ["#ff4a8a", "#4ad8ff", "#ffd23f", "#7aff8a"];
  const E = window.__sagaCore.create({
    id: "grigio", key: "ali-di-rondine.grigio", title: "Il Cavaliere della Notte", icon: "🌃", bg: "gr_titolo", chapters: 3,
    menuSub: "Porto Scuro, la pioggia, una lega truccata e un mantello che la città credeva dimenticato",
    theme: { accent: "#ffd23f", ink: "#e8eaf0", paper: "rgba(12,16,26,.94)", font: "system-ui, sans-serif", chipBg: "#0c101aee", chipBorder: "#7ab8ff" },
    stats: { fiducia: [0, 99, 0, "Fiducia del porto"], leggenda: [0, 99, 0, "La leggenda dell'Airone"] },
    travel: true,
    item: ["Piuma d'airone", "Piume d'airone"],
    stadium: { azPitch: "neon", cageField: 2, cageMut: "wet", weather: "rain", venue: { ads: [["PORTO SCURO", "#7ab8ff"], ["LEGA DEL PORTO", "#a83a2a"], ["NEBBIA S.P.A.", "#8a8a9a"], ["L'AIRONE VEGLIA", "#ffd23f"]], crowd: ["#2a3040", "#7ab8ff", "#ffd23f", "#a83a2a", "#e8eaf0"], ground: ["#1d3a26", "#204029"], line: "#e8e8e8bb", grid: "rgba(255,255,255,.04)", tint: "rgba(40,60,130,.2)", glow: "255,225,160", sky: ["#070a12", "#1a2238"], wall: ["#2a2e3a", "#1a1e28"], fx: { fr: 0.982, spd: 0.97, wind: 0.015 } } },
    regions: {
      porto: { grass: ["#2a3a34", "#283830", "#2e3e36"], path: ["#3a3e48", "#363a44"], stone: ["#4a4e58", "#464a54"], wall: ["#2a2e3a", "#262a36"], water: ["#14243a", "#182a40"], tall: "#2a3a2a", tree: ["#1a2a22", "#1e2e26", "#1c2c24"], tint: "110,140,220", tintA: 0.14, fx: "rain", dark: 0.2 },
      tetti: { grass: ["#3a3238", "#36303a", "#3c343a"], path: ["#5a4a48", "#564644"], stone: ["#5a5a62", "#56565e"], wall: ["#3a2e2e", "#36292a"], water: ["#14243a", "#182a40"], tall: "#3a3a3a", tint: "120,140,220", tintA: 0.14, fx: "rain", dark: 0.2 },
      stadio: { grass: ["#244a2e", "#22462c", "#264c30"], path: ["#4a4e58", "#464a54"], stone: ["#5a5e68", "#565a64"], wall: ["#3a3e4a", "#363a46"], water: ["#14243a", "#182a40"], tall: "#2a4a2a", tree: ["#1a2a22", "#1e2e26", "#1c2c24"], tint: "160,180,230", tintA: 0.12, fx: "rain", dark: 0.18 },
      casa: { grass: ["#4a4038", "#463c34", "#4c423a"], path: ["#6a5a48", "#665644"], stone: ["#6a6a72", "#66666e"], wall: ["#2a2e3a", "#262a36"], water: ["#2a4a6a", "#2e4e6e"], tall: "#4a5a3a", tint: "255,210,150", tintA: 0.1, fx: "dust", dark: 0.14 },
    },
    floors: "%V", solid: "KEQAZ",
    // il vuoto fra i tetti: col Rampino lo si attraversa (ci si aggancia ai comignoli dall'altra parte)
    pass: (K) => (K.F.is("gr_g_rampino") ? "Z" : ""),
    rest: { ch: "s", label: "Siediti sotto la tettoia", text: "Ti siedi sotto una tettoia di lamiera. La pioggia suona come un tamburo stanco. (Il gioco salva da solo: qui puoi rileggere il Taccuino della Notte.)" },
    texts: { chestOpen: "Apri la cassa.", chestEmpty: "La cassa è vuota: segatura, una corda bagnata, l'odore del porto.", nothing: "Niente. Solo la pioggia, e un gabbiano che ti guarda storto.", noHero: "Porto Scuro aspetta qualcuno con un mantello. Crea prima il tuo Campione.", seen: "«Chi va là?!» Una torcia ti punta in faccia. Ti butti nell'ombra e torni indietro, prima che suonino l'allarme. Riprova: resta nel buio, dietro le casse, e guarda dove guardano." },
    journal: { name: "Il Taccuino della Notte", sub: "Prove, gadget, alleati, finali" },
    endings: {
      luce: ["IL PORTO TORNA A RESPIRARE", "La commissaria Valli arresta Ottavio Brume davanti a tutto lo stadio, con il registro in mano. Porto Scuro vince la finale e, per la prima volta da anni, nessuno ha paura di festeggiare.", "Serve aver dato il registro alla commissaria e vinto la finale."],
      ombra: ["IL CAVALIERE RESTA NELL'OMBRA", "Nessuno sa chi ha acceso il faro e mostrato le prove a tutta la città. Ma da quella notte, sui tetti di Porto Scuro, qualcuno veglia. E il Sindacato della Nebbia dorme male.", "Serve aver tenuto il registro e vinto la finale."],
      vela: ["DUE OMBRE SUI TETTI", "Vela Nera restituisce al porto tutto quello che aveva rubato al Sindacato. Poi ti aspetta sul tetto del mercato del pesce, sotto la pioggia: «Allora, Airone. Domani notte, stesso tetto?»", "Serve l'alleanza con Vela Nera e la sua fiducia."],
      airone: ["IL VERO AIRONE", "Alfio apre l'ultimo armadio dell'officina. Dentro c'è un mantello vecchio di quarant'anni, rammendato cento volte. «Il primo Airone ero io», dice. «Adesso la città ne ha uno migliore.»", "Segreto: tutte le piume d'airone, Gancio dalla tua parte e la foto dell'officina."],
    },
    heroLook: (h, K) => ({ bg: ["#0c101a", "#2a3040"], shirt: K.F.is("gr_mantello") ? "#2a3040" : h.shirt }),
    heroTitle: (K) => (K.F.is("gr_mantello") ? "l'Airone di Porto Scuro" : "il numero dieci del Porto Scuro Calcio"),
    heroFx: (K, zid) => (K.F.is("gr_mantello") && /moli|tetti|deposito|torre/.test(zid) ? { cape: "#2a3040" } : null),
    act: { q: "Entra", Q: "Guarda la porta", A: "Guarda l'insegna", Z: "Guarda giù", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = { Q: "Una porta da calcio con la rete gonfia di pioggia. Sulla traversa qualcuno ha disegnato, col gesso, un airone ad ali aperte.", K: "Casse di legno con il marchio «NEBBIA S.P.A.». Dentro: niente pesce. Bottiglie vuote, ricevute bagnate, palloni sgonfi. Strano carico, per un porto.", E: "Un container arrugginito. Qualcuno ci ha scritto sopra, con la vernice: «LA LEGA È TRUCCATA». Sotto, più piccolo: «L'Airone vede».", Z: K.F.is("gr_g_rampino") ? "Il vuoto fra due tetti. Giù, lontano, la strada lucida di pioggia. Col Rampino ci passi sopra in un attimo." : "Il vuoto fra due tetti. Giù, lontano, la strada lucida di pioggia. Senza un rampino, da qui non si passa.", A: "Un'insegna al neon che sfarfalla: metà delle lettere sono spente. Si legge solo «PO  O SC RO»." }[ch];
        if (!t) return false; K.say([["voce", t]]); return true;
      },
    }],
    musicMain: "grigio",
    music: {
      // un tema noir: basso lento, accordi minori, una melodia di sassofono (onda triangolare) e la pioggia di charleston
      grigio: { bpm: 84, chords: ["Am", "F", "Dm", "E", "Am", "F", "E", "E"], lres: 2, lw: "triangle", lv: 0.05,
        lead: "A4 - - C5 - B4 A4 - | F4 - - A4 - - - - | D5 - C5 - A4 - F4 - | E4 - - - G#4 - - - | A4 - - C5 - E5 - D5 | C5 - A4 - F4 - - - | E4 - G#4 - B4 - D5 - | C5 - B4 - - - - -",
        bass: "R . . R . 5 . . R . . R . 5 . .", bv: 0.11, arp: "", av: 0, drum: ". . h . . . h . . . h . . . h h", dv: 0.1 },
    },
    paint: {
      // ombra: un angolo buio dove le guardie non ti vedono (pavimento)
      "%"(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(4,6,14,.55)"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(4,6,14,.25)"; g.fillRect(sx - 2, sy + 2, 20, 12); },
      // pozzanghera con i riflessi dei neon (pavimento): il colore cambia con l'insegna più vicina
      V(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, c = NEON[(tx * 3 + ty) % 4], k = 0.5 + 0.3 * Math.sin(fr / 14 + tx); g.fillStyle = "rgba(20,30,50,.75)"; g.beginPath(); g.ellipse(sx + 8, sy + 9, 7, 4, 0, 0, 7); g.fill(); g.globalAlpha = k * 0.7; g.fillStyle = c; g.fillRect(sx + 4 + ((fr / 6) % 6), sy + 8, 5, 1); g.fillRect(sx + 6, sy + 10, 3, 1); g.globalAlpha = 1; const r = ((fr + tx * 13) % 60) / 60; if (r < 0.5) { g.strokeStyle = `rgba(200,220,255,${0.5 - r})`; g.beginPath(); g.ellipse(sx + 8, sy + 9, 1 + r * 10, 0.6 + r * 4, 0, 0, 7); g.stroke(); } },
      // casse di legno impilate
      K(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(sx + 1, sy + 13, 15, 3); [[1, 6, 14, 9, "#6a4e30"], [3, 0, 10, 7, "#7a5a38"]].forEach(([x, y, w, h, c]) => { g.fillStyle = c; g.fillRect(sx + x, sy + y, w, h); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx + x, sy + y + h - 1, w, 1); g.fillRect(sx + x + w / 2, sy + y, 1, h); g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx + x, sy + y, w, 1); }); },
      // container ondulato, colori diversi
      E(K, sx, sy, tx, ty) { const g = K.g, c = ["#7a2a2a", "#2a4a7a", "#3a6a3a", "#8a6a2a"][(tx * 7 + ty * 3) % 4]; g.fillStyle = c; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.25)"; for (let i = 1; i < 16; i += 3) g.fillRect(sx + i, sy, 1, 16); g.fillStyle = "rgba(255,255,255,.1)"; g.fillRect(sx, sy, 16, 1); g.fillStyle = "rgba(160,90,40,.5)"; g.fillRect(sx + ((tx * 5) % 12), sy + 10, 3, 4); },
      // insegna al neon su un muro: sfarfalla e illumina la strada
      A(K, sx, sy, tx, ty, fr) { const g = K.g, c = NEON[(tx + ty) % 4], on = ((fr + tx * 17) % 97) > 6; g.fillStyle = "#22262f"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(sx, sy + 7, 16, 1); g.strokeStyle = on ? c : "#3a3e48"; g.lineWidth = 1.5; g.strokeRect(sx + 2.5, sy + 3.5, 11, 7); if (on) { g.fillStyle = c; g.fillRect(sx + 5, sy + 6, 6, 2); K.light(sx + 8, sy + 8, 26, c === "#ff4a8a" ? "255,74,138" : c === "#4ad8ff" ? "74,216,255" : c === "#ffd23f" ? "255,210,63" : "122,255,138", 0.32); } },
      // il vuoto fra i tetti: la strada lontana, coi fari delle auto che passano
      Z(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = "#06080e"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#10141e"; g.fillRect(sx + 3, sy + 6, 10, 10); const c = (fr + tx * 31 + ty * 7) % 160; if (c < 30) { g.fillStyle = "rgba(255,230,160,.6)"; g.fillRect(sx + 4 + c / 4, sy + 11, 2, 1); } g.fillStyle = "rgba(255,255,255,.06)"; g.fillRect(sx, sy, 16, 1); },
      // la porta del campo dello Stadio della Gru
      Q(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * 16 - cx, y = ty * 16 - cy + 16; g.fillStyle = "#e8e8e8"; g.fillRect(x - 6, y - 22, 2, 22); g.fillRect(x + 20, y - 22, 2, 22); g.fillRect(x - 6, y - 23, 28, 2); g.strokeStyle = "rgba(220,230,255,.35)"; g.lineWidth = 1; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x - 4 + i * 4, y - 21); g.lineTo(x - 2 + i * 4, y); g.stroke(); } }); },
    },
    guest: { id: "gr_alfio", lines: [["gr_alfio", "[ride] {n}. Al Borgo Marino c'è il sole: ci ho messo un po' a riconoscerti, senza la pioggia addosso. (Ti passa un ombrello pieghevole.) Dentro c'è un rampino. Non si sa mai."]] },
    cameos: [
      { id: "dc_agata", zone: "gr_piazza", at: [6, 14], when: (K) => !!(K.otherSaga("ali-di-rondine.detective") || {}).done?.[1], lines: [["dc_agata", "[pensa] Ispettrice Brina, Detective di Campo. Sono qui per un convegno sulle partite truccate. (Guarda la pioggia.) Un posto così, le prove le lava via. Le prove si tengono all'asciutto: ricordatelo."]] },
      { id: "nl_leandro", zone: "gr_moli", at: [4, 4], when: (K) => !!(K.otherSaga("ali-di-rondine.lampioni") || {}).done?.[1], lines: [["nl_leandro", "[furbo] Un'ombra che si muove fra le ombre. (Ride piano.) Ti do un consiglio da collega: guarda sempre dove guarda la torcia, mai la torcia."]] },
    ],
  });
  const K = E.K;
  K.GADGETS = GADGETS;
  // i gadget che Alfio ha costruito (flag gr_g_<id>) e la cintura scelta in officina (flag gr_belt, massimo 4)
  K.gadgets = () => GADGETS.filter((k) => K.F.is("gr_g_" + k));
  K.belt = () => { const b = String(K.F.get("gr_belt") || "").split(",").filter((k) => K.gadgets().includes(k)); return b.length ? b.slice(0, 4) : K.gadgets().slice(0, 4); };
  K.newGadget = (k) => { K.F.set("gr_g_" + k, true); const b = K.belt(); if (b.length < 4 && !b.includes(k)) K.F.set("gr_belt", b.concat(k).join(",")); };
  // la partita originale della saga: Ombre e Gadget, con i gadget costruiti e la cintura dell'officina
  K.notte = (o, done) => K.ownMatch(window.__gadget.start, Object.assign({ hero: null, gadgets: K.gadgets(), belt: K.belt(), usColor: "#5a6a8a", us: "Porto Scuro Calcio" }, o, { done: (r) => { if (r.quit) K.F.set("gr_lasciato", true); done(r); } }));
  // L'OFFICINA: una scena nuova del motore. I gadget costruiti, da mettere o togliere dalla cintura (massimo quattro). K.officina(done)
  K.officina = (done) => {
    if (document.querySelector(".grOff")) return; css(); const ov = document.createElement("div"); ov.className = "grOff"; let belt = K.belt();
    const draw = () => {
      const have = K.gadgets(), G = window.__gadget ? window.__gadget.GADGETS : {};
      ov.innerHTML = `<div class="box"><h3>🔧 L'officina di Alfio</h3><p>Sotto la tribuna dello Stadio della Gru, tra trapani e bobine, Alfio costruisce gli attrezzi dell'Airone. Scegli cosa mettere nella <b>cintura</b> (massimo 4): la porti in tutte le partite di notte.</p><div class="list">${GADGETS.map((k) => { const ok = have.includes(k), on = belt.includes(k), g = G[k] || { e: "?", n: k }; return `<button type="button" data-k="${k}" class="${ok ? "" : "lock"}${on ? " on" : ""}" ${ok ? "" : "disabled"}><span class="e">${ok ? g.e : "🔒"}</span><b>${ok ? K.esc(g.n) : "Ancora da costruire"}</b><small>${ok ? K.esc(GSUB[k]) : "Alfio ci sta lavorando…"}</small></button>`; }).join("")}</div><p class="n">Cintura: <b>${belt.length}</b>/4 · gadget costruiti: <b>${have.length}</b>/6</p><button type="button" class="go">Chiudi la cintura ▸</button></div>`;
      ov.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => { const k = b.dataset.k; if (belt.includes(k)) belt = belt.filter((x) => x !== k); else if (belt.length < 4) belt.push(k); K.tone(belt.includes(k) ? 660 : 330, 0.1, "triangle", 0.04); draw(); }));
      ov.querySelector(".go").onclick = () => { K.F.set("gr_belt", belt.join(",")); ov.remove(); try { done(); } catch (e) { console.error(e); } };
    };
    document.body.appendChild(ov); draw(); K._off = { set: (b) => { belt = b.slice(0, 4); draw(); }, close: () => ov.querySelector(".go").click() };
  };
  function css() {
    if (document.getElementById("grOffCss")) return; const st = document.createElement("style"); st.id = "grOffCss";
    st.textContent = `.grOff{position:fixed;inset:0;z-index:320;background:radial-gradient(circle at 50% 20%,#1a2238,#070a12);color:#e8eaf0;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto}
.grOff .box{max-width:460px;width:100%;border:1px solid #5a6680;border-radius:10px;background:rgba(14,18,30,.95);padding:14px;box-shadow:0 0 30px rgba(122,184,255,.18)}.grOff h3{margin:0 0 6px;font:900 22px Impact,'Arial Black',sans-serif;color:#ffd23f;letter-spacing:.5px}.grOff p{margin:6px 0;font-size:13px;line-height:1.45}
.grOff .list{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}.grOff .list button{display:grid;grid-template-columns:26px 1fr;column-gap:4px;text-align:left;min-height:62px;border-radius:8px;border:1px solid #4a5670;background:#1a2030;color:#e8eaf0;padding:6px;cursor:pointer;font:700 12.5px system-ui}.grOff .list .e{grid-row:span 2;font-size:20px}.grOff .list small{font-weight:500;font-size:10px;opacity:.8}
.grOff .list button.on{background:#24406a;border-color:#7ab8ff;box-shadow:inset 0 0 0 2px #7ab8ff}.grOff .list button.lock{opacity:.45}.grOff .n{font-size:12px;opacity:.85}.grOff .go{width:100%;min-height:50px;border-radius:8px;border:0;background:#ffd23f;color:#111;font:800 15px system-ui;margin-top:6px;cursor:pointer}`;
    document.head.appendChild(st);
  }
  window.__grigio = E.api;
})();
