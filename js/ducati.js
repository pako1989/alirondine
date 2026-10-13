// js/ducati.js - LA GUERRA DEI TRE DUCATI · configurazione della saga sul motore comune (js/saga-core.js)
// Saga SERIA e politica, nello spirito degli strategici a turni con le scelte di gruppo (tutto inventato).
// Tre ducati su un altopiano di sale: Salinella (le miniere, povera e orgogliosa), Vetrara (il vetro, ricca e mercante),
// Ruggine (il ferro, forte e affamata). Ogni dieci anni la Coppa dei Tre Ducati decide a chi vanno i diritti delle saline.
// Tu sei il capitano della squadra di Salinella. Ma qui le decisioni grandi non le prendi da solo: le prende la BILANCIA.
// Novità di questa saga (oltre a quelle del motore comune):
//  - CALCIO TATTICO ISOMETRICO (js/iso.js): la partita originale, con un motore suo. Campo a rombi con dislivelli,
//    iniziativa, contrasti alle spalle, tiri dall'alto.
//  - LA BILANCIA DELLE CONVINZIONI (K.bilancia): una scena nuova del motore. Nei momenti decisivi i compagni VOTANO, ognuno
//    secondo la sua convinzione (Morale, Utile, Libertà). Prima del voto puoi CONVINCERLI con gli argomenti che hai trovato
//    esplorando: un argomento funziona solo se tocca una convinzione di chi ascolta. Poi la bilancia pesa, e decide.
//  - IL DIORAMA (motore comune, cfg.diorama): bordi sfocati come un plastico fotografato da vicino, luce calda al centro.
// Salvataggio proprio: ali-di-rondine.ducati. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__ducati || !window.__sagaCore) return;
  const CONV = { morale: ["Morale", "⚖️", "#c8a040"], utile: ["Utile", "💰", "#4a9a6a"], liberta: ["Libertà", "🕊️", "#4a7ac8"] };
  // i compagni che votano: [convinzione principale, convinzione secondaria]
  const COMP = { td_corrado: ["morale", "utile"], td_lia: ["liberta", "morale"], td_ottone: ["utile", "liberta"], td_anselmo: ["morale", "liberta"], td_isotta: ["liberta", "utile"] };
  // gli argomenti: si trovano parlando ed esplorando (flag td_arg_<id>)
  const ARGS = {
    casse: ["utile", "Le casse vuote", "Il registro del ducato: senza soldi la squadra non arriva alla finale, e la miniera chiude comunque."],
    giuramento: ["morale", "Il giuramento del sale", "«Il sale non si vende a chi lo vuole per forza»: lo giurò il primo duca, sulla prima pietra della miniera."],
    paga: ["liberta", "La paga dei minatori", "Bruna: «Il sale lo scaviamo noi. Perché devono deciderlo i duchi?»"],
    tregua: ["utile", "La tregua del vetro", "Il vetraio: una tregua con Vetrara vale dieci partite vinte."],
    parola: ["morale", "La parola data", "Il barcaiolo: «Chi bussa alla tua porta chiedendo aiuto, si aiuta. Sempre.»"],
    citta: ["liberta", "Le Città Libere", "Una mappa nell'archivio: oltre il lago ci sono città senza duchi, dove si decide in piazza."],
    ferro: ["utile", "Il ferro e il vetro", "Il fabbro: con Vetrara alleata, Ruggine non osa attaccare."],
    onore: ["morale", "Il campo dell'avversario", "Anselmo: vincere in casa loro è l'unica vittoria che nessuno può discutere."],
    popolo: ["liberta", "Il popolo delle saline", "I minatori: «Se la finale è nostra, giocatela qui, con noi a guardare.»"],
  };
  const E = window.__sagaCore.create({
    id: "ducati", key: "ali-di-rondine.ducati", title: "La Guerra dei Tre Ducati", icon: "⚖️", bg: "td_titolo", chapters: 3,
    menuSub: "Tre ducati, una coppa, le saline: e una bilancia dove i tuoi compagni decidono con te",
    theme: { accent: "#c8a040", ink: "#f4ead8", paper: "rgba(34,24,14,.94)", font: "Georgia, serif", chipBg: "#2a1e14ee", chipBorder: "#c8a040" },
    stats: { morale: [0, 99, 0, "Convinzione: Morale"], utile: [0, 99, 0, "Convinzione: Utile"], liberta: [0, 99, 0, "Convinzione: Libertà"] },
    travel: true, diorama: true,
    item: ["Sigillo di sale", "Sigilli di sale"],
    stadium: { azPitch: "cortile", cageField: 1, cageMut: "heavy", venue: { ads: [["COPPA DEI TRE DUCATI", "#c8a040"], ["SALINELLA", "#2a6ab8"], ["VETRARA", "#2a8a6a"], ["RUGGINE", "#a83a2a"]], crowd: ["#2a6ab8", "#e8e4d8", "#2a8a6a", "#a83a2a", "#c8a040"], ground: ["#cfc6a8", "#c6bd9e"], line: "#ffffffcc", grid: "rgba(120,100,60,.08)", tint: "rgba(255,230,180,.1)", glow: "255,230,170", sky: ["#8ab8e0", "#f0e0c0"], wall: ["#b8a888", "#a89878"], fx: { fr: 0.985, spd: 0.97 } } },
    regions: {
      saline: { grass: ["#dcd6c4", "#d6d0be", "#e0dac8"], path: ["#c8b898", "#c0b090"], stone: ["#b8b0a0", "#b0a898"], wall: ["#b8a888", "#ac9c7c"], water: ["#7aa8c4", "#86b2cc"], tall: "#9aa070", tree: ["#6a7a4a", "#708050", "#667648"], tint: "255,240,210", tintA: 0.1, fx: "float", dark: 0.04 },
      vetrara: { grass: ["#5a9a6a", "#549464", "#60a070"], path: ["#c8c0a8", "#c0b8a0"], stone: ["#a8b8b8", "#a0b0b0"], wall: ["#6a8a8a", "#628282"], water: ["#3a8aa0", "#4696aa"], tall: "#4a8a5a", tree: ["#3a7a4a", "#428250", "#3c7c4c"], tint: "200,255,240", tintA: 0.1, fx: "float", dark: 0.05 },
      ruggine: { grass: ["#7a6a4a", "#746444", "#806e4e"], path: ["#8a6a4a", "#826244"], stone: ["#6a5a54", "#64544e"], wall: ["#4a3a34", "#44342e"], water: ["#5a6a6a", "#647474"], tall: "#6a6a3a", tree: ["#4a4a2a", "#505030", "#46462a"], tint: "255,170,120", tintA: 0.14, fx: "sparks", dark: 0.1 },
      casa: { grass: ["#8a7a5a", "#847454", "#8e7e5e"], path: ["#a89878", "#a09070"], stone: ["#c8c0b0", "#c0b8a8"], wall: ["#6a4a2a", "#644426"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,220,170", tintA: 0.12, fx: "dust", dark: 0.06 },
    },
    floors: "&", solid: "JXFQ",
    rest: { ch: "s", label: "Siediti sulla panca di pietra", text: "Ti siedi sulla panca di pietra. Il vento porta l'odore del sale. (Il gioco salva da solo: qui puoi rileggere il Libro delle Convinzioni.)" },
    texts: { chestOpen: "Apri lo scrigno.", chestEmpty: "Lo scrigno è vuoto: un po' di sale sul fondo, e basta.", nothing: "Niente. Solo il vento dell'altopiano.", noHero: "La squadra di Salinella aspetta il suo capitano. Crea prima il tuo Campione." },
    journal: { name: "Il Libro delle Convinzioni", sub: "Voti, argomenti, compagni, finali" },
    endings: {
      corona: ["LA CORONA DI SALE", "Salinella vince la Coppa senza vendere niente e senza tradire nessuno. Il duca ti offre una corona di sale cristallizzato; tu la appendi nello spogliatoio, sopra la panca.", "Serve che nei voti abbia vinto più spesso la Morale."],
      patto: ["IL PATTO DI VETRO", "La Coppa è di Salinella, le saline restano aperte, e Vetrara paga il sale il giusto. Ruggine resta sola, e firma la pace. Non è una favola: è un buon affare per tutti.", "Serve che nei voti abbia vinto più spesso l'Utile."],
      saline: ["LE SALINE LIBERE", "Dopo la finale, i minatori votano in piazza: le saline non sono più del duca, sono di chi le scava. La Coppa sta nella sala comune, e ognuno la può toccare.", "Serve che nei voti abbia vinto più spesso la Libertà."],
      pari: ["LA BILANCIA IN PARI", "Tre voti, tre convinzioni diverse, e una squadra che non si è mai spezzata. Anselmo scrive nella cronaca: «Quell'anno la bilancia restò in pari. Nessuno sa come». Tu lo sai.", "Segreto: tre voti finiti in tre modi diversi, tutti i sigilli di sale, e almeno tre compagni convinti."],
    },
    heroLook: (h) => ({ bg: ["#2a1e14", "#c8a040"], shirt: "#2a6ab8" }),
    heroTitle: () => "capitano di Salinella",
    act: { q: "Entra", n: "Leggi la bacheca", Q: "Guarda la statua della Bilancia", J: "Guarda il cono di sale", X: "Guarda la vetrata", F: "Guarda la forgia", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = { Q: "La statua della Bilancia, al centro della piazza: tre piatti d'ottone appesi a un palo. La leggenda dice che i primi tre duchi decisero così chi doveva avere le saline. Pesarono le loro ragioni.", J: "Un cono di sale, alto più di te. Brilla al sole come zucchero. Se lo lecchi (lo lecchi) è amarissimo.", X: "Una vetrata soffiata a mano: verde, poi blu, poi verde. Dietro, le serre di Vetrara, piene di limoni.", F: "Una forgia di Ruggine: il ferro rosso, il martello, le scintille. Il fabbro non alza gli occhi." }[ch];
        if (!t) return false; K.say([["voce", t]]); return true;
      },
    }],
    musicMain: "ducati",
    music: {
      // un tema da strategico antico: archi (triangolo), arpa (arpeggio), timpani lenti
      ducati: { bpm: 96, chords: ["Dm", "Bb", "C", "A", "Dm", "F", "Gm", "A"], lres: 2, lw: "triangle", lv: 0.045,
        lead: "D5 - - E5 F5 - E5 D5 | Bb4 - - C5 D5 - - - | C5 - - D5 E5 - G5 - | A4 - - - C#5 - - - | D5 - F5 - A5 - G5 F5 | F5 - E5 - D5 - C5 - | Bb4 - D5 - G5 - F5 E5 | E5 - - - - - - -",
        bass: "R . . . 5 . . . R . . . 5 . R .", bv: 0.1, arp: "1 3 5 8 5 3 1 3 5 8 5 3 1 3 5 8", aw: "triangle", av: 0.016, drum: "k . . . . . . . k . . . s . . .", dv: 0.12 },
    },
    paint: {
      // crosta di sale (pavimento): esagoni bianchi con le crepe
      "&"(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = (tx + ty) % 2 ? "#ece8dc" : "#e4e0d2"; g.fillRect(sx, sy, 16, 16); g.strokeStyle = "rgba(160,150,130,.5)"; g.lineWidth = 1; g.beginPath(); g.moveTo(sx, sy + 5); g.lineTo(sx + 5, sy + 2); g.lineTo(sx + 10, sy + 5); g.lineTo(sx + 16, sy + 3); g.moveTo(sx + 5, sy + 2); g.lineTo(sx + 6, sy + 12); g.lineTo(sx + 12, sy + 15); g.stroke(); if (((fr / 20 + tx * 3 + ty) | 0) % 9 === 0) { g.fillStyle = "#fff"; g.fillRect(sx + (tx * 5) % 13, sy + (ty * 7) % 13, 2, 2); } },
      // cono di sale
      J(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = "rgba(0,0,0,.2)"; g.beginPath(); g.ellipse(sx + 9, sy + 15, 8, 2.5, 0, 0, 7); g.fill(); g.fillStyle = "#f4f2ea"; g.beginPath(); g.moveTo(sx + 1, sy + 15); g.lineTo(sx + 8, sy + 1); g.lineTo(sx + 15, sy + 15); g.fill(); g.fillStyle = "#d8d4c4"; g.beginPath(); g.moveTo(sx + 8, sy + 1); g.lineTo(sx + 15, sy + 15); g.lineTo(sx + 9, sy + 15); g.fill(); if ((fr + tx * 11) % 70 < 8) { g.fillStyle = "#fff"; g.fillRect(sx + 6, sy + 6, 1, 3); g.fillRect(sx + 5, sy + 7, 3, 1); } },
      // vetrata soffiata (Vetrara): riflesso che scorre
      X(K, sx, sy, tx, ty, fr) { const g = K.g; g.fillStyle = ["#3a8a7a", "#3a6a9a", "#5a9a6a"][(tx + ty) % 3]; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(sx + 1, sy + 1, 6, 14); g.strokeStyle = "#2a3a3a"; g.lineWidth = 1; g.strokeRect(sx + 0.5, sy + 0.5, 15, 15); g.beginPath(); g.moveTo(sx + 8, sy); g.lineTo(sx + 8, sy + 16); g.stroke(); const r = ((fr / 2 + tx * 9) % 60) - 20; if (r > -4 && r < 18) { g.fillStyle = "rgba(255,255,255,.4)"; g.fillRect(sx + Math.max(0, r), sy + 2, 2, 12); } },
      // forgia di Ruggine: incudine e brace che pulsa
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, b = 0.6 + 0.4 * Math.sin(fr / 9 + tx); g.fillStyle = "#3a2a24"; g.fillRect(sx + 1, sy + 6, 14, 10); g.fillStyle = `rgba(255,${120 + b * 60 | 0},40,${0.6 + b * 0.4})`; g.fillRect(sx + 3, sy + 7, 10, 4); g.fillStyle = "#5a5a62"; g.fillRect(sx + 4, sy + 1, 8, 3); g.fillRect(sx + 6, sy + 4, 4, 2); K.light(sx + 8, sy + 9, 22, "255,140,60", 0.3 * b); },
      // la statua della Bilancia: tre piatti d'ottone che oscillano piano
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * 16 - cx + 8, y = ty * 16 - cy + 16; g.fillStyle = "#8a6a2a"; g.fillRect(x - 6, y - 4, 12, 4); g.fillStyle = "#c8a040"; g.fillRect(x - 1, y - 28, 2, 24); g.fillRect(x - 12, y - 28, 24, 2); [-11, 0, 11].forEach((d, i) => { const sw = Math.sin(fr / 30 + i) * 1.5; g.strokeStyle = "#a8883a"; g.beginPath(); g.moveTo(x + d, y - 27); g.lineTo(x + d + sw, y - 18); g.stroke(); g.fillStyle = "#c8a040"; g.beginPath(); g.ellipse(x + d + sw, y - 17, 4, 1.5, 0, 0, 7); g.fill(); }); }); },
    },
    guest: { id: "td_lia", lines: [["td_lia", "[furbo] {n}! Al Borgo Marino decidete tutto in piazza? (Si guarda intorno.) Mi piace. Da noi ci hanno messo trecento anni, a capirlo."]] },
    cameos: [
      { id: "tc_ysolde", zone: "td_salinella", at: [4, 6], when: (K) => !!(K.otherSaga("ali-di-rondine.trono") || {}).done?.[1], lines: [["tc_ysolde", "[furbo] Lady Corvonero, da Valdoro. Da noi i voti si comprano con i patti. Da voi con le ragioni? (Sorride.) Che idea curiosa. Funziona?"]] },
      { id: "ml_pino", zone: "td_vetrara", at: [5, 15], when: (K) => !!(K.otherSaga("ali-di-rondine.colline") || {}).done?.[1], lines: [["ml_pino", "[ride] Il Mago Pino, dalle Colline! Una partita su un campo con le terrazze? (Fa sparire una moneta.) Il trucco è stare in alto. Come sempre."]] },
    ],
  });
  const K = E.K;
  K.CONV = CONV; K.COMP = COMP; K.ARGS = ARGS;
  K.arg = (id) => { if (!ARGS[id] || K.F.is("td_arg_" + id)) return false; K.F.set("td_arg_" + id, true); K.learnLore("l_bilancia"); K.note && K.note(`Nuovo argomento: «${ARGS[id][1]}» (${CONV[ARGS[id][0]][0]})`); return true; };
  K.args = () => Object.keys(ARGS).filter((k) => K.F.is("td_arg_" + k));
  K.lore("l_bilancia", { t: "La Bilancia delle Convinzioni", d: "A Salinella le decisioni grandi si pesano. Ogni compagno vota secondo la sua convinzione: Morale (ciò che è giusto), Utile (ciò che conviene a tutti), Libertà (ciò che la gente sceglie da sé). Prima del voto puoi convincerli con un argomento: funziona solo se tocca una delle loro due convinzioni." });
  // la partita originale della saga: il Calcio Tattico Isometrico
  K.campo = (o, done) => K.ownMatch(window.__iso.start, Object.assign({ hero: null, usColor: "#2a6ab8", us: "Salinella" }, o, { done: (r) => { if (r.quit) K.F.set("td_lasciato", true); done(r); } }));
  // LA BILANCIA: K.bilancia({ id, title, q, opts: [{ id, label, conv }], voters: [id…], done(optId) })
  K.bilancia = (o) => {
    css();
    const opts = o.opts, voters = o.voters.filter((v) => COMP[v]), lean = {}, used = new Set(), log = [];
    voters.forEach((v) => { lean[v] = (opts.find((p) => p.conv === COMP[v][0]) || opts[0]).id; });
    const ov = document.createElement("div"); ov.className = "tdBil"; document.body.appendChild(ov);
    let pick = null, weighing = null, raf = 0;
    const nm = (v) => { const C = window.__borgoApi && window.__borgoApi.CAST; return (C && C[v] && C[v].name || v).split(",")[0]; };
    function draw() {
      const avail = K.args().filter((a) => !used.has(a));
      ov.innerHTML = `<div class="box"><h3>⚖️ ${K.esc(o.title || "La Bilancia")}</h3><p class="q">${K.esc(o.q)}</p><canvas width="560" height="240"></canvas>
<div class="opts">${opts.map((p) => `<span style="--c:${CONV[p.conv][2]}">${CONV[p.conv][1]} <b>${K.esc(p.label)}</b><i>${voters.filter((v) => lean[v] === p.id).length}</i></span>`).join("")}</div>
<div class="vot">${voters.map((v) => { const p = opts.find((x) => x.id === lean[v]); return `<button type="button" data-v="${v}" class="${pick === v ? "on" : ""}"><b>${K.esc(nm(v))}</b><small>${CONV[COMP[v][0]][1]} ${CONV[COMP[v][0]][0]} · ${CONV[COMP[v][1]][1]} ${CONV[COMP[v][1]][0]}</small><em style="--c:${CONV[p.conv][2]}">→ ${K.esc(p.label)}</em></button>`; }).join("")}</div>
${pick ? `<p class="hint">Quale argomento usi con <b>${K.esc(nm(pick))}</b>?</p><div class="args">${avail.length ? avail.map((a) => `<button type="button" data-a="${a}" style="--c:${CONV[ARGS[a][0]][2]}">${CONV[ARGS[a][0]][1]} <b>${K.esc(ARGS[a][1])}</b><small>${K.esc(ARGS[a][2])}</small></button>`).join("") : "<p class=\"hint\">Non hai più argomenti da usare. Esplora e parla con la gente: gli argomenti si trovano così.</p>"}</div>` : `<p class="hint">Tocca un compagno per convincerlo (argomenti da usare: <b>${avail.length}</b>). Ogni argomento si usa una volta.</p>`}
<p class="log">${log.slice(-2).join("<br>")}</p><button type="button" class="go">Pesa la Bilancia ▸</button></div>`;
      ov.querySelectorAll("[data-v]").forEach((b) => (b.onclick = () => { pick = pick === b.dataset.v ? null : b.dataset.v; draw(); }));
      ov.querySelectorAll("[data-a]").forEach((b) => (b.onclick = () => persuade(pick, b.dataset.a)));
      ov.querySelector(".go").onclick = weigh;
      canvas();
    }
    function persuade(v, a) {
      if (!v || !ARGS[a] || used.has(a) || weighing) return false; used.add(a); const conv = ARGS[a][0], tgt = opts.find((p) => p.conv === conv);
      if (COMP[v].includes(conv) && tgt && lean[v] !== tgt.id) { lean[v] = tgt.id; K.F.set("td_pers_" + v, true); log.push(`<b>${K.esc(nm(v))}</b>: «${K.esc(ARGS[a][1])}»… Hai ragione. Cambio voto: <b>${K.esc(tgt.label)}</b>.`); K.tone(660, 0.2, "triangle", 0.05); }
      else if (COMP[v].includes(conv)) log.push(`<b>${K.esc(nm(v))}</b>: lo so già. Infatti voto così.`);
      else { log.push(`<b>${K.esc(nm(v))}</b>: non mi convince. A me importa ${CONV[COMP[v][0]][0].toLowerCase()}, o al massimo ${CONV[COMP[v][1]][0].toLowerCase()}.`); K.tone(220, 0.2, "square", 0.03); }
      pick = null; draw(); return true;
    }
    function result() {
      const cnt = opts.map((p) => ({ p, n: voters.filter((v) => lean[v] === p.id).length, s: K.stat(p.conv) })); cnt.sort((a, b) => b.n - a.n || b.s - a.s);
      return cnt[0].p;
    }
    function weigh() {
      if (weighing) return; weighing = { t: 0, win: result() }; K.tone(330, 0.3, "triangle", 0.05);
      ov.querySelectorAll("button").forEach((b) => (b.disabled = true));
      setTimeout(() => {
        const w = weighing.win; cancelAnimationFrame(raf); ov.remove();
        K.F.set("td_" + o.id, w.id); K.F.set("td_" + o.id + "_conv", w.conv); K.bond(w.conv, 2);
        try { o.done(w.id); } catch (e) { console.error(e); }
      }, K._fastBil ? 0 : 1700);
    }
    // la bilancia a tre piatti: ogni voto è un peso, il piatto più carico scende
    function canvas() {
      const cv = ov.querySelector("canvas"); if (!cv) return; const g = cv.getContext("2d"); cancelAnimationFrame(raf);
      const tick = () => {
        if (!cv.isConnected) return; g.setTransform(2, 0, 0, 2, 0, 0); g.clearRect(0, 0, 280, 120);
        const gr = g.createRadialGradient(140, 50, 10, 140, 50, 160); gr.addColorStop(0, "#3a2a18"); gr.addColorStop(1, "#1a120a"); g.fillStyle = gr; g.fillRect(0, 0, 280, 120);
        g.fillStyle = "#8a6a2a"; g.fillRect(125, 108, 30, 8); g.fillStyle = "#c8a040"; g.fillRect(138, 14, 4, 96); g.beginPath(); g.arc(140, 12, 6, 0, 7); g.fill();
        const tw = weighing ? Math.min(1, (weighing.t += 0.02)) : 1;
        opts.forEach((p, i) => {
          const n = voters.filter((v) => lean[v] === p.id).length, x = 50 + i * 90, drop = (weighing ? tw : 0.3) * n * 9 + Math.sin(Date.now() / 600 + i) * 1.5, y = 52 + drop;
          g.strokeStyle = "#a8883a"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(140, 22); g.lineTo(x, 26); g.stroke(); g.beginPath(); g.moveTo(x, 26); g.lineTo(x - 18, y); g.moveTo(x, 26); g.lineTo(x + 18, y); g.stroke();
          g.fillStyle = CONV[p.conv][2]; g.beginPath(); g.ellipse(x, y + 2, 22, 6, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.ellipse(x, y, 18, 3, 0, 0, 7); g.fill();
          for (let k = 0; k < n; k++) { const fall = weighing ? Math.max(0, 1 - tw * 2 + k * 0.15) : 0; g.fillStyle = "#e8d8a8"; g.fillRect(x - 12 + k * 6, y - 6 - fall * 50, 5, 5); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(x - 12 + k * 6, y - 2 - fall * 50, 5, 1); }
          g.font = "700 9px Georgia, serif"; g.textAlign = "center"; g.fillStyle = "#f4ead8"; g.fillText(CONV[p.conv][0], x, 112);
        });
        if (weighing && tw >= 1) { const w = weighing.win, i = opts.indexOf(w); g.font = "900 13px Georgia, serif"; g.fillStyle = "#ffd27a"; g.fillText("✦", 50 + i * 90, 8 + 6); }
        raf = requestAnimationFrame(tick);
      };
      tick();
    }
    K._bil = { persuade, weigh, lean, pick: (v) => { pick = v; draw(); } };
    draw();
  };
  function css() {
    if (document.getElementById("tdBilCss")) return; const st = document.createElement("style"); st.id = "tdBilCss";
    st.textContent = `.tdBil{position:fixed;inset:0;z-index:320;background:radial-gradient(circle at 50% 20%,#3a2a18,#120c06);color:#f4ead8;font-family:Georgia,serif;display:flex;align-items:flex-start;justify-content:center;padding:12px;overflow:auto}
.tdBil .box{max-width:480px;width:100%;border:2px solid #c8a040;border-radius:6px;background:rgba(30,20,10,.95);padding:12px;box-shadow:0 0 0 4px #1a120a,0 0 0 6px #8a6a2a}.tdBil h3{margin:0 0 4px;font:900 21px Georgia,serif;color:#ffd27a}.tdBil .q{margin:4px 0 8px;font-size:13.5px;line-height:1.45}
.tdBil canvas{width:100%;height:auto;aspect-ratio:280/120;display:block;border-radius:4px}
.tdBil .opts{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:6px 0}.tdBil .opts span{border-top:3px solid var(--c);background:#2a1e14;padding:4px;font-size:11px;text-align:center;border-radius:3px}.tdBil .opts b{display:block;font-size:11.5px}.tdBil .opts i{font-style:normal;font:900 16px Georgia;color:#ffd27a}
.tdBil .vot{display:grid;grid-template-columns:1fr 1fr;gap:5px}.tdBil .vot button,.tdBil .args button{text-align:left;min-height:52px;border-radius:4px;border:1px solid #8a6a2a;background:#2a1e14;color:#f4ead8;padding:5px 7px;cursor:pointer;font:700 12.5px Georgia,serif}.tdBil .vot button.on{border-color:#ffd27a;box-shadow:inset 0 0 0 2px #ffd27a}
.tdBil small{display:block;font:500 10px system-ui;opacity:.8;margin-top:2px}.tdBil em{display:block;font-style:normal;font-size:11px;color:var(--c);filter:brightness(1.5);margin-top:2px}
.tdBil .args{display:grid;gap:5px}.tdBil .args button{border-left:4px solid var(--c)}.tdBil .hint{font-size:12px;opacity:.85;margin:8px 0 4px}.tdBil .log{font-size:12px;min-height:16px;color:#ffe9b0}
.tdBil .go{width:100%;min-height:50px;border-radius:4px;border:0;background:#c8a040;color:#1a120a;font:900 15px Georgia,serif;margin-top:6px;cursor:pointer}.tdBil button:disabled{opacity:.6}`;
    document.head.appendChild(st);
  }
  window.__ducati = E.api;
})();
