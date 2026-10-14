// js/regno.js - CRONACHE DEL REGNO ULTIMO · configurazione della saga sul motore comune (js/saga-core.js)
// Saga SERIA ed EPICA, con l'ironia di corte (ispirata a Game of Thrones in versione leggera e a Suikoden; tutto inventato).
// Dopo la caduta dell'Impero dei Cento Troni resta un solo regno, l'ultimo: tre Casate (Lupi, Gabbiani, Cervi), un re vecchissimo
// e una regola antica: le dispute si decidono sulla piazza d'armi con la Palla del Giuramento. È il Duello di Corona.
// Tu sei il Campione senza Stendardo: per legge chi gioca per la Corona non porta i colori di nessuna Casata.
// Novità di questa saga (oltre a quelle del motore comune):
//  - DUELLO DI CORONA (js/corona.js): la partita originale, con un motore suo. Corse su tre corsie con ostacoli e fossati, mirino al portone,
//    scudo e tuffo in difesa; tra un tempo e l'altro il Consiglio delle Casate (scelte diplomatiche) cambia il favore dei Lupi,
//    dei Gabbiani e dei Cervi, e chi ti è favorevole presta il suo potere (Ariete, Marea, Occhio del Bosco).
//  - LE ALLEANZE SI VEDONO NELLE ZONE: stendardi alzati o a mezz'asta, cancelli che si aprono solo alle Casate alleate, tribune
//    colorate, e un soldato di ogni Casata amica che ti segue in fila. K.consiglio apre la sala delle Casate, K.rimappa rifà la zona.
//  - GRAFICA: stendardi che sventolano, torce con la luce che ondeggia, banchetti apparecchiati, arazzi, bracieri e fuochi d'assedio.
// Salvataggio proprio: ali-di-rondine.regno. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__regno || !window.__sagaCore) return;
  const CASATE = {
    lupi: { n: "Casata dei Lupi", c: "#8b95ab", e: "🐺", sede: "Forte dei Lupi", capo: "Generale Brando Ferrano", pot: "Ariete" },
    gabbiani: { n: "Casata dei Gabbiani", c: "#38a8d8", e: "⚓", sede: "Porto dei Gabbiani", capo: "Dama Perla Marenghi", pot: "Marea" },
    cervi: { n: "Casata dei Cervi", c: "#5aa862", e: "🦌", sede: "Bosco dei Cervi", capo: "Lord Cedro Valverde", pot: "Occhio del Bosco" },
  };
  const HOUSES = Object.keys(CASATE);
  const PAGINE = { l_patto: ["Il Patto di Cuoio", "Il primo articolo: «Nessuno possiede la Palla. Chi la porta, la porta per tutti.» Evaristo giura che non l'ha mai letto fino in fondo."],
    l_palla: ["La Ballata della Palla", "Cantata nei porti: «Un cuoco cucì la corona nel cuoio, e disse: chi la vuole la faccia rotolare.» Gli ultimi versi mancano."],
    l_cronaca: ["La Cronaca del Regno Ultimo", "Scritta a mano dal primo re, che era un cuoco. Spiega come è cominciato tutto, e perché ha avuto il buon senso di non scriverlo sul trono."] };
  const E = window.__sagaCore.create({
    id: "regno", key: "ali-di-rondine.regno", title: "Cronache del Regno Ultimo", icon: "👑", bg: "re_titolo", chapters: 3,
    menuSub: "Tre Casate, un re vecchissimo e una partita rituale per la Corona: tu sei il Campione senza Stendardo",
    theme: { accent: "#e8b84a", ink: "#f6ecd6", paper: "rgba(44,18,30,.94)", font: "Georgia, 'Times New Roman', serif", chipBg: "#3a1426ee", chipBorder: "#c8a040" },
    stats: { lupi: [-3, 9, 0, "Favore dei Lupi"], gabbiani: [-3, 9, 0, "Favore dei Gabbiani"], cervi: [-3, 9, 0, "Favore dei Cervi"], fiducia: [0, 99, 0, "Fiducia della Principessa"] },
    travel: true,
    item: ["Pagina di Cronaca", "Pagine di Cronaca"],
    drawItem(g, x, y, i, f) {
      g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createRadialGradient(x, y, 1, x, y, 11); gr.addColorStop(0, `rgba(255,214,120,${0.4 + 0.15 * Math.sin(f / 10 + i)})`); gr.addColorStop(1, "rgba(255,214,120,0)"); g.fillStyle = gr; g.fillRect(x - 11, y - 11, 22, 22); g.restore();
      g.save(); g.translate(x, y + Math.sin(f / 14 + i) * 1.2); g.rotate(-0.25); g.fillStyle = "#efe0b8"; g.fillRect(-4, -6, 8, 12); g.fillStyle = "#c8a060"; g.fillRect(-5, -6, 1.5, 12); g.fillRect(3.5, -6, 1.5, 12); g.fillStyle = "#7a1f2a"; g.fillRect(-2.5, -3.5, 5, 1); g.fillRect(-2.5, -1, 5, 1); g.fillRect(-2.5, 1.5, 3, 1); g.restore();
    },
    stadium: {
      azPitch: "lizza", cageField: 2, cageMut: "heavy", weather: undefined,
      venue: { ads: [["CASTELALTO · PIAZZA D'ARMI", "#7a1f2a"], ["CASATA DEI LUPI", "#8b95ab"], ["PORTO DEI GABBIANI", "#38a8d8"], ["BOSCO DEI CERVI", "#5aa862"]],
        crowd: ["#8b95ab", "#38a8d8", "#5aa862", "#b0303a", "#e8c860"], ground: ["#b49560", "#aa8c5a"], line: "#f4ecd8", grid: "rgba(255,240,200,.12)", tint: "#c8783a", glow: "255,170,80", sky: ["#241d44", "#d28a5a"], wall: ["#6a5040", "#5a4030"], fx: { fr: 0.985, spd: 1, wind: 0.3 } },
    },
    regions: {
      cortile: { grass: ["#5a6a3a", "#546434", "#607040"], path: ["#b09a70", "#a8926a"], stone: ["#8a8478", "#80796e"], wall: ["#5e5062", "#544858"], water: ["#2a5a8a", "#30649a"], tall: "#5a7a3a", tree: ["#2a4a2a", "#385a34", "#4a7040"], tint: "255,190,130", tintA: 0.1, fx: "sparks", dark: 0.06 },
      sala: { grass: ["#6a5a4a", "#625242", "#6e5e4e"], path: ["#8a6a4a", "#826244"], stone: ["#6c5c5a", "#645452"], wall: ["#42303c", "#3a2a36"], water: ["#2a4a6a", "#305474"], tall: "#5a6a3a", tint: "255,170,100", tintA: 0.16, fx: "dust", dark: 0.14 },
      forte: { grass: ["#8a9a9a", "#829292", "#94a4a4"], path: ["#9ca2ae", "#9298a6"], stone: ["#7a8090", "#70778a"], wall: ["#4a5266", "#434b5e"], water: ["#4a6a8a", "#52749a"], tall: "#7a8a7a", tree: ["#2a4a4a", "#1e3a3a", "#3a5a5a"], tint: "190,210,255", tintA: 0.1, fx: "snow", dark: 0.1 },
      porto: { grass: ["#7a8a5a", "#728252", "#829262"], path: ["#b8a07a", "#b09872"], stone: ["#9a9684", "#908c7c"], wall: ["#6a7a8a", "#607080"], water: ["#2a6a9a", "#3274a6"], tall: "#6a8a5a", tree: ["#2a5a3a", "#346a44", "#417a50"], tint: "255,200,150", tintA: 0.1, fx: "", dark: 0.02 },
      bosco: { grass: ["#3a6a3a", "#336233", "#3f7040"], path: ["#8a6a3a", "#7e6034"], stone: ["#6a7a5a", "#627252"], wall: ["#3a3a2a", "#2e2e20"], water: ["#2a5a6a", "#306474"], tall: "#4a8a3a", tree: ["#1e4a2a", "#2a5a30", "#336a38"], tint: "190,230,150", tintA: 0.08, fx: "fireflies", dark: 0.14 },
      piazza: { grass: ["#7a8a4a", "#728242", "#829250"], path: ["#c8aa70", "#bea066"], stone: ["#b49560", "#aa8c5a"], wall: ["#6a5040", "#5e463a"], water: ["#2a5a8a", "#30649a"], tall: "#6a8a3a", tree: ["#2a4a2a", "#385a34", "#4a7040"], tint: "255,200,120", tintA: 0.12, fx: "sparks", dark: 0.05 },
      cripta: { grass: ["#3a3a4a", "#343444", "#40404e"], path: ["#5a5a6a", "#505060"], stone: ["#4a4a5a", "#444454"], wall: ["#262636", "#20202e"], water: ["#1a2a4a", "#203054"], tall: "#3a4a4a", tint: "140,150,255", tintA: 0.14, fx: "float", dark: 0.3 },
    },
    floors: "", solid: "IFKEVZAJY",
    rest: { ch: "s", label: "Siediti al braciere", text: "Ti siedi accanto a un braciere di ferro. Il fuoco scoppietta, e da qualche parte un cane abbaia a una bandiera. (Il gioco salva da solo: qui puoi rileggere il Libro delle Casate.)" },
    texts: { chestOpen: "Apri il forziere.", chestEmpty: "Il forziere è vuoto: resta solo un sigillo di cera rotto e l'odore di un vecchio banchetto.", nothing: "Niente di speciale. Solo il rumore lontano di una corte che finge di non litigare.", noHero: "Castelalto cerca il suo Campione senza Stendardo. Prima crea il tuo Campione.", chapters: "Le alleanze restano: cambiano il finale." },
    journal: {
      name: "Il Libro delle Casate", sub: "Alleanze, pagine di cronaca, finali",
      html: (K) => {
        const m = K.mem(), rows = HOUSES.map((h) => `<span style="color:${CASATE[h].c}">${CASATE[h].e} <b>${CASATE[h].n}</b></span>: ${K.stato(h)} (${K.stat(h)}) · potere in partita: ${CASATE[h].pot}`).join("<br>");
        const pg = Object.keys(PAGINE).map((k) => (m.lore.includes(k) ? `• <b>${K.esc(PAGINE[k][0])}</b><br><span style="color:var(--dim)">${K.esc(PAGINE[k][1])}</span>` : "<span style='color:var(--dim)'>• ???</span>")).join("<br>");
        const en = Object.keys(K.ENDINGS).map((k) => (m.ends.includes(k) ? `✓ <b>${K.esc(K.ENDINGS[k][0])}</b> <span style="color:var(--dim)">${K.esc(K.ENDINGS[k][1])}</span>` : `<span style='color:var(--dim)'>• ??? ${K.ENDINGS[k][2] ? "· " + K.esc(K.ENDINGS[k][2]) : ""}</span>`)).join("<br>");
        return `<b>Le Casate</b><br>${rows}<br>Fiducia della Principessa: ${K.stat("fiducia")}<br><br><b>Pagine di cronaca</b> (${m.lore.length}/${Object.keys(PAGINE).length})<br>${pg}<br><br><b>Finali</b><br>${en}`;
      },
    },
    endings: {
      regina: ["LA REGINA DEI TRE STENDARDI", "Oriele viene incoronata sulla Piazza d'Armi, con la Palla del Giuramento in mano e le tre Casate alle spalle. Il Regno Ultimo ha una regina, un consiglio che litiga a voce bassa e un Campione che finalmente può avere uno stendardo.", "Sempre possibile, dopo aver vinto il Duello."],
      consiglio: ["IL CONSIGLIO DELLA PALLA", "Il filo di cuoio viene tagliato: la Corona torna a rotolare, e a tenerla sono insieme Lupi, Gabbiani e Cervi. Il trono resta vuoto, con un cuscino nuovo per il gatto.", "Serve aver visto la Cripta e avere un po' di favore da tutte e tre le Casate."],
      ferro: ["LA CORONA DI FERRO", "Il Generale Brando alza la Palla e accetta la Corona, con la voce più dolce che gli abbiate mai sentito. Il Regno Ultimo avrà ordine, mura alte e una burocrazia da fare invidia. Oriele, per ora, studia.", "Serve un grande favore dei Lupi, o aver giurato fedeltà al Generale."],
      perpetuo: ["IL DUELLO PERPETUO", "Nessuna corona: ogni anno, sulla Piazza d'Armi, si gioca per decidere chi guiderà il Regno per dodici mesi. Le guerre finiscono perché si può sempre rigiocare. Il vecchio re, in tribuna, ride per la prima volta in quarant'anni.", "Segreto: tre Casate alleate, tutte le pagine di cronaca, la verità sulla spia e la fiducia della Principessa."],
    },
    heroLook: (h) => ({ bg: ["#2a1426", "#c8a040"], shirt: h.shirt }),
    heroTitle: (K) => (K.stat("fiducia") >= 3 ? "Campione di Corona" : "il Campione senza Stendardo"),
    act: { q: "Entra", I: "Guarda lo stendardo", F: "Guarda la torcia", K: "Guarda il banchetto", E: "Prova il portone", V: "Guarda il trono", Z: "Consulta la mappa", A: "Guarda l'arazzo", J: "Guarda la balista", Y: "Osserva il piedistallo", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    // le alleanze nelle zone: scorta di casata che ti segue in fila (solo le Casate alleate)
    party: (K) => HOUSES.filter((h) => K.stat(h) >= 3).map((h) => "re_s_" + h),
    zoneMenuExtra: (K) => [{ label: "⚜️ Le Casate", sub: "Alleanze e poteri in partita", fn: () => K.consiglio(K.done) }],
    mainExtra: (K) => [{ label: "⚜️ Le Casate", sub: "Alleanze e poteri in partita", fn: () => K.consiglio(() => K.openMain()) }],
    mood(g, fr) { const a = 0.025 + 0.012 * Math.sin(fr / 7) + 0.008 * Math.sin(fr / 3.1); g.save(); g.globalCompositeOperation = "soft-light"; g.fillStyle = `rgba(255,150,70,${a * 3})`; g.fillRect(0, 0, 320, 200); g.restore(); },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        if (ch === "Z") { K.mappa(); return true; }
        if (ch === "E") { const gt = spec.gates && spec.gates[tx + "," + ty]; const h = gt && gt.casa; K.say([["voce", h ? `Il portone è sbarrato. Sopra l'arco c'è il sigillo dei ${CASATE[h].n.replace("Casata dei ", "")}, e una frase: «Aperto solo agli amici della Casata».` : "Il portone è chiuso."]]); return true; }
        if (ch === "I") { const h = spec.banners && spec.banners[tx + "," + ty]; if (!h || !CASATE[h]) { K.say([["voce", "Lo stendardo reale: cremisi e oro, con una corona ricamata. Nessuno l'ha più cambiato da quando è morta la regina. L'ultima regina, quella di prima."]]); return true; } const st = K.stato(h); K.say([["voce", `Lo stendardo dei ${CASATE[h].n.replace("Casata dei ", "")}: ${st === "alleata" ? "alto e fiero, con la frangia d'oro: vi considerano amici." : st === "amica" ? "alzato a metà asta, in attesa di sapere come va a finire." : st === "fredda" ? "legato con un nastro nero: vi considerano un problema." : "a mezz'asta: la Casata aspetta di capire chi sei."}`]]); return true; }
        return false;
      },
      tick(zid, spec, px, py, dt, K) {
        const ln = spec.links; if (!ln) return null; const tx = Math.floor(px / 16), ty = Math.floor((py - 4) / 16), k = tx + "," + ty;
        if (!ln[k]) { ARM[zid] = true; return null; }
        if (ARM[zid]) { ARM[zid] = false; const d = ln[k]; setTimeout(() => K.go(d[0], d[1], d[2]), 0); }
        return null;
      },
    }],
    musicMain: "regno",
    music: {
      // tema di corte: tamburo di marcia, accordi di modo minore, melodia lenta e solenne
      regno: { bpm: 92, chords: ["Am", "F", "C", "G", "Am", "Dm", "E", "Am"], lres: 2, lw: "triangle", lv: 0.05,
        lead: "E5 - - D5 | C5 - A4 - | A4 - C5 - | D5 - - - | E5 - G5 - | F5 - E5 - | D5 - C5 - | B4 - - - | A4 - C5 - | E5 - - D5 | C5 - - - | D5 - E5 - | F5 - E5 D5 | C5 - B4 - | A4 - - - | - - - -",
        bass: "R . . . 5 . . . R . . . 5 . . .", bv: 0.1, arp: "1 5 3 5 1 5 3 5 1 5 3 5 1 5 3 5", aw: "triangle", av: 0.012, drum: "k . . . s . . . k . k . s . . .", dv: 0.1 },
    },
    paint: {
      // I · stendardo di Casata (il colore e l'altezza dicono come stanno le alleanze)
      I(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, sp = K.ZX.spec, h = sp && sp.banners && sp.banners[tx + "," + ty], real = h && CASATE[h], st = real ? K.stato(h) : "alleata";
        const col = real ? CASATE[h].c : "#b0303a", hi = st === "alleata" ? 0 : st === "amica" ? 5 : 9;
        g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 6, 2.2, 0, 0, 7); g.fill();
        g.fillStyle = "#4a3a2a"; g.fillRect(sx + 7, sy - 14, 2, 29); g.fillStyle = "#e8c860"; g.beginPath(); g.arc(sx + 8, sy - 15, 2, 0, 7); g.fill();
        const w = 11, y0 = sy - 11 + hi, wv = Math.sin(fr / 9 + tx) * 1.4;
        g.fillStyle = st === "fredda" ? "#2a2a30" : col; g.beginPath(); g.moveTo(sx + 9, y0); for (let i = 0; i <= w; i += 2) g.lineTo(sx + 9 + i, y0 + Math.sin(fr / 9 + i * 0.6 + tx) * 1.2 + i * 0.1); g.lineTo(sx + 9 + w, y0 + 14 + wv); g.lineTo(sx + 9 + w / 2, y0 + 11 + wv * 0.5); g.lineTo(sx + 9, y0 + 14); g.closePath(); g.fill();
        g.fillStyle = "rgba(255,255,255,.7)"; if (h === "lupi") { g.beginPath(); g.moveTo(sx + 11, y0 + 8); g.lineTo(sx + 12, y0 + 3); g.lineTo(sx + 14, y0 + 6); g.lineTo(sx + 16, y0 + 3); g.lineTo(sx + 17, y0 + 8); g.fill(); } else if (h === "gabbiani") { g.beginPath(); g.moveTo(sx + 11, y0 + 7); g.quadraticCurveTo(sx + 14, y0 + 2, sx + 15, y0 + 6); g.quadraticCurveTo(sx + 16, y0 + 2, sx + 19, y0 + 7); g.lineTo(sx + 15, y0 + 5); g.fill(); } else if (h === "cervi") { g.fillRect(sx + 13, y0 + 3, 1, 6); g.fillRect(sx + 11, y0 + 3, 1, 3); g.fillRect(sx + 15, y0 + 3, 1, 3); g.fillRect(sx + 17, y0 + 3, 1, 3); } else { g.fillStyle = "#f2c230"; g.fillRect(sx + 11, y0 + 5, 7, 4); g.fillRect(sx + 11, y0 + 3, 1, 2); g.fillRect(sx + 14, y0 + 2, 1, 3); g.fillRect(sx + 17, y0 + 3, 1, 2); }
        if (st === "alleata") { g.fillStyle = "#e8c860"; g.fillRect(sx + 9, y0 + 14 + (wv > 0 ? 0 : 0), 12, 1); }
        if (st === "fredda") { g.fillStyle = "#111"; g.fillRect(sx + 9, y0 + 1, 12, 2); }
      },
      // F · torcia da parete o da terra, con la luce che ondeggia
      F(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 5, 2, 0, 0, 7); g.fill();
        g.fillStyle = "#3a2a1a"; g.fillRect(sx + 7, sy + 3, 2, 12); g.fillStyle = "#6a6a72"; g.fillRect(sx + 4, sy + 2, 8, 3); g.fillRect(sx + 5, sy + 5, 6, 1);
        const fl = Math.sin(fr / 5 + tx * 2) * 1.2; g.fillStyle = "#ff9a2a"; g.beginPath(); g.ellipse(sx + 8, sy - 1, 3 + fl * 0.2, 5 + fl, 0, 0, 7); g.fill(); g.fillStyle = "#ffe27a"; g.beginPath(); g.ellipse(sx + 8, sy, 1.5, 3 + fl * 0.4, 0, 0, 7); g.fill();
        K.light(sx + 8, sy - 1, 26 + fl * 2, "255,160,70", 0.55);
      },
      // K · banchetto apparecchiato
      K(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g, r = K.rnd(tx, ty, 4); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 13, 16, 3);
        g.fillStyle = "#6a4a2a"; g.fillRect(sx, sy + 4, 16, 10); g.fillStyle = "#f2ead6"; g.fillRect(sx, sy + 3, 16, 7); g.fillStyle = "#b0303a"; g.fillRect(sx, sy + 9, 16, 2); g.fillStyle = "rgba(0,0,0,.1)"; g.fillRect(sx, sy + 10, 16, 1);
        if (r < 0.34) { g.fillStyle = "#c8782a"; g.beginPath(); g.ellipse(sx + 8, sy + 6, 5, 2.6, 0, 0, 7); g.fill(); g.fillStyle = "#e8a860"; g.fillRect(sx + 5, sy + 4, 6, 1); }
        else if (r < 0.67) { g.fillStyle = "#c8a040"; g.fillRect(sx + 3, sy + 3, 3, 5); g.fillRect(sx + 10, sy + 4, 3, 4); g.fillStyle = "#7a1f2a"; g.fillRect(sx + 3, sy + 3, 3, 2); g.fillRect(sx + 10, sy + 4, 3, 2); }
        else { g.fillStyle = "#e8e0c8"; g.fillRect(sx + 6, sy + 1, 2, 7); g.fillStyle = "#ffcf5a"; g.beginPath(); g.ellipse(sx + 7, sy, 1.5, 2.2 + Math.sin(fr / 6 + tx) * 0.4, 0, 0, 7); g.fill(); K.light(sx + 7, sy, 14, "255,200,110", 0.4); }
      },
      // E · portone di Casata (chiuso)
      E(K, sx, sy, tx, ty) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "#4a3a2c"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "#6a5238"; g.fillRect(sx + 1, sy + 1, 7, 15); g.fillRect(sx + 8, sy + 1, 7, 15); g.fillStyle = "#2a2a30"; g.fillRect(sx + 1, sy + 4, 14, 1.5); g.fillRect(sx + 1, sy + 11, 14, 1.5); g.fillRect(sx + 7.5, sy, 1, 16);
        g.fillStyle = "#c8a040"; [3, 12].forEach((x) => [3, 8, 13].forEach((y) => g.fillRect(sx + x, sy + y, 1.2, 1.2))); g.fillStyle = "#c8a040"; g.fillRect(sx + 5.5, sy + 8, 1.5, 2.5); g.fillRect(sx + 9, sy + 8, 1.5, 2.5);
      },
      // V · il trono
      V(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.28)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 8, 2.4, 0, 0, 7); g.fill();
        g.fillStyle = "#e8c860"; g.fillRect(sx + 2, sy - 12, 12, 22); g.fillStyle = "#b88a2a"; g.fillRect(sx + 2, sy - 12, 2, 22); g.fillRect(sx + 12, sy - 12, 2, 22); g.fillStyle = "#7a1f2a"; g.fillRect(sx + 4, sy - 10, 8, 16); g.fillStyle = "#f2c230"; g.fillRect(sx + 6, sy - 7, 4, 1); g.fillRect(sx + 7, sy - 9, 2, 3);
        g.fillStyle = "#a82a3a"; g.fillRect(sx + 3, sy + 6, 10, 5); g.fillStyle = "#e8c860"; g.fillRect(sx + 2, sy + 10, 12, 4); g.fillStyle = "#f2c230"; [3, 7, 11].forEach((x) => g.fillRect(sx + x, sy - 15, 2, 3));
      },
      // Z · tavolo della mappa del Regno
      Z(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(sx, sy + 13, 16, 3); g.fillStyle = "#6a4a2a"; g.fillRect(sx, sy + 3, 16, 11); g.fillStyle = "#e8d8a8"; g.fillRect(sx + 1, sy + 4, 14, 8);
        g.fillStyle = "#8aa860"; g.fillRect(sx + 2, sy + 5, 5, 4); g.fillStyle = "#6a98b8"; g.fillRect(sx + 9, sy + 5, 5, 3); g.fillStyle = "#b0a090"; g.fillRect(sx + 6, sy + 8, 6, 3);
        g.fillStyle = "#b0303a"; g.fillRect(sx + 4, sy + 3, 1.6, 3); g.fillStyle = "#38a8d8"; g.fillRect(sx + 12, sy + 3, 1.6, 3); g.fillStyle = "#5aa862"; g.fillRect(sx + 8, sy + 2, 1.6, 3);
      },
      // A · arazzo alla parete
      A(K, sx, sy, tx, ty, fr) {
        const g = K.g, R = K.ZX.rg; g.fillStyle = R.wall[(tx + ty) % 2]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.2)"; g.fillRect(sx, sy + 14, 16, 2);
        const pal = [["#7a1f2a", "#e8c860"], ["#2a4a6a", "#e8e0c8"], ["#2a5a3a", "#e8c860"]][(tx >> 1) % 3];
        g.fillStyle = "#3a2a1a"; g.fillRect(sx + 1, sy, 14, 2); g.fillStyle = pal[0]; g.fillRect(sx + 2, sy + 2, 12, 13); g.fillStyle = pal[1]; g.fillRect(sx + 3, sy + 3, 10, 1); g.fillRect(sx + 3, sy + 13, 10, 1);
        g.beginPath(); g.moveTo(sx + 8, sy + 5); g.lineTo(sx + 11, sy + 8); g.lineTo(sx + 8, sy + 11); g.lineTo(sx + 5, sy + 8); g.closePath(); g.fill(); g.fillRect(sx + 2, sy + 15, 1, 1); g.fillRect(sx + 6, sy + 15, 1, 1); g.fillRect(sx + 10, sy + 15, 1, 1); g.fillRect(sx + 13, sy + 15, 1, 1);
      },
      // J · balista d'assedio
      J(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 8, 2.4, 0, 0, 7); g.fill();
        g.fillStyle = "#6a4a2a"; g.fillRect(sx + 3, sy + 10, 10, 4); g.fillRect(sx + 5, sy + 3, 6, 8); g.fillStyle = "#8a6a3a"; g.fillRect(sx + 1, sy + 4, 14, 2); g.fillStyle = "#2a2a30"; g.fillRect(sx + 7.4, sy + 1, 1.3, 9); g.fillStyle = "#cfd6e6"; g.beginPath(); g.moveTo(sx + 6.5, sy + 1); g.lineTo(sx + 8, sy - 3); g.lineTo(sx + 9.5, sy + 1); g.fill(); g.strokeStyle = "#e8d8a8"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(sx + 1, sy + 5); g.lineTo(sx + 8, sy + 9); g.lineTo(sx + 15, sy + 5); g.stroke();
      },
      // Y · piedistallo con la Palla del Giuramento
      Y(K, sx, sy, tx, ty, fr) {
        K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.ellipse(sx + 8, sy + 14, 8, 2.4, 0, 0, 7); g.fill();
        g.fillStyle = "#6a6a7a"; g.fillRect(sx + 3, sy + 8, 10, 7); g.fillStyle = "#8a8a9a"; g.fillRect(sx + 2, sy + 7, 12, 2); g.fillStyle = "#4a4a5a"; g.fillRect(sx + 3, sy + 13, 10, 2);
        K.light(sx + 8, sy + 3, 28, "255,214,120", 0.55 + 0.12 * Math.sin(fr / 11)); g.fillStyle = "#c8903a"; g.beginPath(); g.arc(sx + 8, sy + 3, 5, 0, 7); g.fill(); g.strokeStyle = "#7a5018"; g.lineWidth = 0.8; g.stroke(); g.fillStyle = "#f2c230"; g.fillRect(sx + 5, sy + 1, 6, 1.2); g.fillRect(sx + 6, sy - 1, 1.2, 2); g.fillRect(sx + 8, sy - 2, 1.2, 3); g.fillRect(sx + 10, sy - 1, 1.2, 2);
      },
    },
    guest: { id: "re_fiorino", lines: [["re_fiorino", "[felice] {n}! Il Borgo Marino… che porto allegro. Gli abitanti del mio regno hanno guerre, tasse e tre Casate: voi avete i gabbiani, che rubano il pranzo e non chiedono il voto. Ti scrivo una ballata? Rima con «Campione senza stendardo»: facile, «pallone senza sguardo». Ci lavoro."]] },
    cameos: [
      { id: "tc_ysolde", zone: "re_trono", at: [16, 11], when: (K) => !!(K.otherSaga("ali-di-rondine.trono") || {}).done?.[1], lines: [["tc_ysolde", "[furbo] Un regno con tre Casate e una partita al posto della guerra. Ci avevamo pensato anche noi, a Pietrabruna: poi è arrivato il voto. Un consiglio gratis, Campione: il favore si compra, la fiducia si guadagna. E costa di più."]] },
      { id: "td_corrado", zone: "re_porto", at: [6, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.ducati") || {}).done?.[1], lines: [["td_corrado", "[sorpreso] Un'altra guerra tra Casate evitata a pallonate? Bravi. Dalle mie parti i Duchi ci hanno messo tre libri e una barricata. (Sorride piano.) Non lasciare che il Generale ti convinca che la pace è debolezza. Neanche quando ha ragione."]] },
    ],
  });
  const K = E.K, F = K.F, ARM = {};
  K.CASATE = CASATE; K.PAGINE = PAGINE;
  // ------------------------------------------------------------ le alleanze
  K.liv = (h) => { const v = K.stat(h); return v >= 3 ? 2 : v >= 1 ? 1 : v <= -2 ? -1 : 0; };
  K.stato = (h) => ({ 2: "alleata", 1: "amica", 0: "neutrale", "-1": "fredda" }[K.liv(h)]);
  K.alleate = () => HOUSES.filter((h) => K.stat(h) >= 3);
  K.dai = (h, d) => { if (CASATE[h]) K.bond(h, d); };
  K.lorePagine = () => Object.keys(PAGINE).filter((k) => K.mem().lore.includes(k)).length;
  // rifà la zona subito (stendardi, cancelli, scorta) senza muovere l'eroe
  K.rimappa = () => { const a = K.api, z = a && a.trZone(); if (!z) return; const pos = a.trPos && a.trPos(), tr = a.trRec(); if (pos) tr.pos[z] = pos; a.trGo(z); K.refreshZone(); };
  // la sala delle Casate: tre stendardi, lo stato di ogni alleanza e il potere che prestano in partita
  K.consiglio = (back) => {
    css(); const ov = document.createElement("div"); ov.className = "reCons";
    ov.innerHTML = `<div class="w"><h3>⚜️ Le Casate del Regno Ultimo</h3><p class="s">Ogni Casata ha un stendardo, un favore e un potere da prestarti nel Duello di Corona (favore 1 o più, una volta per tempo). Da 3 in su sono alleate: aprono i loro cancelli e una guardia ti segue.</p>
      <div class="g">${HOUSES.map((h) => { const c = CASATE[h], v = K.stat(h), pct = Math.max(0, Math.min(100, (v + 3) / 12 * 100)); return `<div class="c" style="--c:${c.c}"><div class="b"><span>${c.e}</span></div><b>${K.esc(c.n.replace("Casata dei ", ""))}</b><em>${K.esc(K.stato(h))}</em><div class="m"><i style="width:${pct}%"></i><u style="left:${(3 + 3) / 12 * 100}%"></u></div><small>${K.esc(c.capo)}<br>Potere: <b>${K.esc(c.pot)}</b>${v >= 1 ? "" : " (non ancora)"}</small></div>`; }).join("")}</div>
      <p class="s">Fiducia della Principessa: <b>${K.stat("fiducia")}</b> · Pagine di cronaca: <b>${K.lorePagine()}/3</b></p><button type="button" class="x">Chiudi ▸</button></div>`;
    document.body.appendChild(ov); ov.querySelector(".x").onclick = () => { ov.remove(); try { (back || K.done)(); } catch (e) { console.error(e); } };
  };
  K.mappa = () => {
    const seen = K.api.trRec().seen || {}, dest = [["re_forte", "Forte dei Lupi", "lupi", 28, 9], ["re_porto", "Porto dei Gabbiani", "gabbiani", 1, 9], ["re_bosco", "Bosco dei Cervi", "cervi", 14, 18]];
    K.ask("voce", "<b>La Mappa del Regno Ultimo</b>\nTre strade, tre Casate. I pennini colorati dicono chi è tuo amico.", [...dest.filter((d) => K.hasChapter(2) && K.zone(d[0])).map((d) => ({ label: `${CASATE[d[2]].e} ${d[1]}`, sub: `${K.stato(d[2])} · favore ${K.stat(d[2])}`, fn: () => K.go(d[0], d[3], d[4]) })), { label: "⚜️ Le Casate", sub: "Alleanze e poteri", fn: () => K.consiglio(K.done) }, { label: "◂ Chiudi la mappa", fn: K.done }], "re_strada");
  };
  // la partita originale: il Duello di Corona, con il favore delle Casate che hai guadagnato; il Consiglio tra i tempi lo cambia
  K.coronaMatch = (o, done) => {
    const h = (K.hero && K.hero()) || {}, fav = {}; HOUSES.forEach((x) => (fav[x] = Math.max(0, K.stat(x))));
    return K.ownMatch(window.__corona.start, Object.assign({ title: "Duello di Corona", usColor: "#b0303a", us: "Il Campione di Corona", hero: { name: h.name || "Tu" }, favor: fav, tempi: 3, opp: { name: "Rivali", color: "#3a2a3a", style: "equilibrata" } }, o, {
      done: (r) => {
        if (r && r.quit) F.set("re_lasciato", true);
        else if (r && r.data && r.data.favor) HOUSES.forEach((x) => { if (r.data.favor[x]) K.bond(x, r.data.favor[x]); });
        if (typeof done === "function") done(r);
      },
    }));
  };
  function css() {
    if (document.getElementById("reCss")) return; const st = document.createElement("style"); st.id = "reCss";
    st.textContent = `.reCons{position:fixed;inset:0;z-index:330;background:radial-gradient(circle at 50% 20%,#3a1a2c,#14081a);color:#f6ecd6;font-family:Georgia,serif;overflow:auto;padding:12px}
.reCons .w{max-width:480px;margin:0 auto}.reCons h3{margin:4px 0 6px;font:900 21px Georgia,serif;color:#e8b84a;text-align:center}.reCons .s{font-size:12.5px;line-height:1.45;opacity:.9}
.reCons .g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}.reCons .c{border:2px solid var(--c);border-radius:10px;background:rgba(0,0,0,.3);padding:8px 6px;text-align:center}
.reCons .b{height:54px;display:flex;align-items:center;justify-content:center;font-size:28px;background:linear-gradient(var(--c),#0008);border-radius:4px 4px 18px 18px;margin-bottom:6px;clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%)}
.reCons .c b{display:block;font-size:13.5px;color:var(--c)}.reCons .c em{display:block;font-size:12px;font-style:normal;margin:2px 0 4px;text-transform:uppercase;letter-spacing:1px}.reCons .c small{display:block;font-size:10.5px;opacity:.85;line-height:1.35}
.reCons .m{position:relative;height:7px;border-radius:4px;background:#0008;margin:4px 2px 6px;overflow:visible}.reCons .m i{display:block;height:100%;border-radius:4px;background:var(--c)}.reCons .m u{position:absolute;top:-2px;width:2px;height:11px;background:#fff;opacity:.8}
.reCons .x{display:block;width:100%;margin-top:12px;min-height:48px;border:2px solid #c8a040;border-radius:10px;background:linear-gradient(#d8a02a,#9a6a12);color:#1a1020;font:900 15px Georgia,serif;cursor:pointer}`;
    document.head.appendChild(st);
  }
  window.__regno = E.api;
})();
