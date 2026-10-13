// js/cavallo.js - IL CAVALLO STAR · configurazione della saga sul motore comune (js/saga-core.js)
// Saga COMICA e un po' amara, nello spirito delle serie animate satiriche sulla fama (tutto inventato). A Lustrino, la collina
// delle star dove animali e persone lavorano insieme nella televisione, vive Baldo Criniera: un cavallo che negli anni '90 era
// il protagonista di «Zoccoli d'Oro», la sitcom sul calcio più vista del paese. Adesso vuole tornare in onda, con un reboot,
// e ha bisogno di una spalla che sappia giocare davvero: tu. Satira della fama, del pubblico e dei copioni; niente dipendenze.
// Novità di questa saga (oltre a quelle del motore comune):
//  - CIAK! SI GIOCA (js/ciak.js): la partita originale, con un motore suo. Si gioca a scene: segui il copione o improvvisa,
//    poi il ciak a tempo; il regista dà le stelle.
//  - LA RASSEGNA STAMPA (K.stampa): dopo le scelte importanti esce il giornale (gira su se stesso, come nei vecchi film) con il
//    titolo che cambia secondo quello che hai fatto. Fama e verità sono due numeri diversi: i titoli finiscono nel diario.
//  - GLI ANIMALI DI LUSTRINO: sagome nuove (cavallo, cane) a contorni piatti e colori pastello, nel ritratto e in cammino.
// Salvataggio proprio: ali-di-rondine.cavallo. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__cavallo || !window.__sagaCore) return;
  // i titoli dei giornali: id → [testata, titolo, sottotitolo]
  const TITOLI = {
    onesto: ["La Gazzetta di Lustrino", "«BALDO HA PAURA, MA È BRAVO»", "La nuova spalla di Zoccoli d'Oro dice la verità. A Lustrino nessuno sa cosa farne."],
    lodi: ["La Gazzetta di Lustrino", "«IL PIÙ GRANDE DI SEMPRE»", "La nuova spalla incorona Baldo Criniera. Baldo incornicia l'articolo."],
    beneficenza: ["Lustrino Sera", "ZOCCOLI BATTE CUCCIOLI!", "La partita di beneficenza finisce in festa. Max Allegria abbraccia tutti, anche il palo."],
    beneficenza_no: ["Lustrino Sera", "CUCCIOLI SBRANA ZOCCOLI", "Max Allegria vince la partita di beneficenza e regala la coppa a un fan. Poi a un altro fan."],
    copre: ["Il Settimanale delle Stelle", "«IL CALCIO? L'HO INVENTATO IO» ERA UNA BATTUTA", "La spalla di Baldo giura: era tutto previsto dal copione. Il copione non lo prevedeva."],
    verita: ["Il Settimanale delle Stelle", "BALDO: «HO DETTO UNA SCIOCCHEZZA»", "Per la prima volta in trent'anni, una star chiede scusa. Lustrino è sotto shock."],
    finale: ["La Gazzetta di Lustrino", "STASERA L'ULTIMA PUNTATA IN DIRETTA", "Zoccoli d'Oro contro Cuccioli in Campo. Il copione è segreto. Il finale, si dice, è triste."],
  };
  const E = window.__sagaCore.create({
    id: "cavallo", key: "ali-di-rondine.cavallo", title: "Il Cavallo Star", icon: "🐴", bg: "cs_titolo", chapters: 3,
    menuSub: "Una vecchia star equina vuole tornare in onda col reboot della sua sitcom sul calcio. Tu sei la sua spalla. Copioni, ciak e giornali",
    theme: { accent: "#ff7aa8", ink: "#3a2a3a", paper: "rgba(255,248,252,.96)", font: "'Trebuchet MS', system-ui, sans-serif", chipBg: "#fff4f8ee", chipBorder: "#3a2a3a" },
    stats: { fama: [0, 99, 0, "Fama"], verita: [0, 99, 0, "Verità"], baldo: [0, 99, 0, "Baldo con te"] },
    travel: true,
    item: ["Cassetta di «Zoccoli d'Oro»", "Cassette di «Zoccoli d'Oro»"],
    drawItem(g, x, y, i, f) { g.save(); g.translate(x, y + Math.sin(f / 10 + i) * 1.5); g.fillStyle = "#3a2a3a"; g.fillRect(-7, -4, 14, 9); g.fillStyle = "#f0b8c8"; g.fillRect(-5, -3, 10, 3); g.fillStyle = "#fff"; g.beginPath(); g.arc(-3, 2.5, 1.5, 0, 7); g.arc(3, 2.5, 1.5, 0, 7); g.fill(); g.restore(); },
    stadium: { azPitch: "cortile", cageField: 0, cageMut: "rubber", venue: { ads: [["ZOCCOLI D'ORO", "#ff7aa8"], ["CUCCIOLI IN CAMPO", "#7ab8e8"], ["LUSTRINO TV", "#f0c84a"], ["BIOGRAFIE VIOLA PENNA", "#a8d8a8"]], crowd: ["#ff9ec0", "#a8d8f0", "#ffe08a", "#c8e8b8", "#d8b8f0"], ground: ["#b8e8c0", "#b0e0b8"], line: "#ffffffdd", grid: "rgba(255,255,255,.08)", tint: "rgba(255,200,230,.08)", glow: "255,230,200", sky: ["#ffd8e8", "#fff4d8"], wall: ["#f0b8c8", "#e8a8b8"], fx: { spd: 1 } } },
    regions: {
      lustrino: { grass: ["#b8e0a0", "#b2da9a", "#bee6a6"], path: ["#f4d8d0", "#eed0c8"], stone: ["#e8d8e8", "#e2d2e2"], wall: ["#f0c8d8", "#ead0e0"], water: ["#8ad0f0", "#94d8f4"], tall: "#a8d890", tree: ["#5aa86a", "#62b070", "#58a466"], tint: "255,220,230", tintA: 0.08, fx: "", dark: 0 },
      studio: { grass: ["#d8d0e0", "#d2cada", "#dcd4e4"], path: ["#e8e0d0", "#e2dac8"], stone: ["#c8c0d0", "#c2bac8"], wall: ["#b8a8c8", "#b2a2c2"], water: ["#8ad0f0", "#94d8f4"], tall: "#c8c0d0", tree: ["#7ab88a", "#82c090", "#78b688"], tint: "255,240,220", tintA: 0.06, fx: "", dark: 0.02 },
      interno: { grass: ["#f4e0e8", "#eedae2", "#f8e6ee"], path: ["#e8d0c0", "#e2cab8"], stone: ["#f0e0d0", "#eadac8"], wall: ["#d8a8c0", "#d2a2b8"], water: ["#8ad0f0", "#94d8f4"], tall: "#c8a8b8", tint: "255,220,200", tintA: 0.08, fx: "", dark: 0.02 },
    },
    floors: "", solid: "ZFKAP",
    rest: { ch: "s", label: "Siediti sulla sdraio", text: "Ti siedi sulla sdraio a forma di stella. Qualcuno ti scatta una foto. (Il gioco salva da solo: qui puoi rileggere la Rassegna Stampa.)" },
    texts: { chestOpen: "Apri la scatola del guardaroba.", chestEmpty: "Dentro c'è solo una parrucca a forma di criniera e un biglietto: «Non dirlo a Baldo».", nothing: "Niente. Da qualche parte un fotografo sta già scattando.", noHero: "Lustrino aspetta la sua nuova star. Crea prima il tuo Campione." },
    journal: { name: "La Rassegna Stampa", sub: "I titoli, i finali", html: (K) => { const ks = Object.keys(TITOLI).filter((id) => K.F.is("cs_t_" + id)); return ks.length ? ks.map((id) => `<p style="margin:6px 0"><small style="opacity:.7">${TITOLI[id][0]}</small><br><b>${TITOLI[id][1]}</b><br><span style="opacity:.8">${TITOLI[id][2]}</span></p>`).join("") : "<p>Nessun giornale parla ancora di te.</p>"; } },
    endings: {
      diretta: ["IL GOL CHE NESSUNO AVEVA SCRITTO", "In diretta, contro il copione, Zoccoli d'Oro vince. La rete chiude la serie per «insubordinazione». Baldo, per la prima volta da trent'anni, è felice per una cosa vera.", "Serve aver vinto la finale in diretta."],
      serie: ["LA SERIE PIÙ VISTA DELL'ANNO", "Seguite il copione fino all'ultima scena: Zoccoli d'Oro perde, il pubblico piange, gli ascolti esplodono. Baldo è di nuovo una star. Il giorno dopo chiede: «E adesso?»", "Serve aver giocato la finale secondo il copione."],
      biografia: ["LA BIOGRAFIA DI VIOLA", "Viola Penna pubblica «Zoccoli e paure», la biografia vera di Baldo. Niente trofei in copertina: una foto di lui a sei anni, su un campetto di terra. Primo in classifica per sei mesi.", "Serve aver detto la verità alla stampa."],
      puntata: ["LA PUNTATA PERDUTA", "Nelle cassette ritrovate c'è l'episodio mai andato in onda nel 1996: Baldo e la sua vecchia squadra giocano in un campetto, senza copione, senza pubblico. Lo trasmettono stasera. Lo guarda tutta Lustrino, in silenzio.", "Segreto: tutte le cassette, almeno quattro stelle del regista in finale, nessuna ripresa interrotta."],
    },
    heroLook: () => ({ bg: ["#fff4f8", "#ff7aa8"], shirt: "#f0b8c8" }),
    heroTitle: (K) => (K.stat("fama") > K.stat("verita") ? "la spalla famosa di Baldo" : "la spalla sincera di Baldo"),
    act: { q: "Entra", n: "Leggi il cartello", Z: "Guarda l'insegna", F: "Guarda il riflettore", K: "Guarda la telecamera", A: "Guarda la scenografia", P: "Guarda la palma", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) {
        const t = { Z: "Le lettere giganti sulla collina: L U S T R I N O. Una è storta da quarant'anni: nessuno la raddrizza, porta fortuna.", F: "Un riflettore enorme. Se ti ci metti davanti, per un attimo, sembri famoso.", K: "Una telecamera su un treppiede. La lucina rossa è spenta. Per adesso.", A: "Una scenografia di cartone: il salotto di «Zoccoli d'Oro», 1994. Dietro, solo tubi e nastro adesivo.", P: "Una palma vera, piantata in un vaso finto, piantato in un prato vero. Lustrino in una palma." }[ch];
        if (!t) return false; K.say([["voce", t]]); return true;
      },
    }],
    musicMain: "cavallo",
    music: {
      // la sigla di una sitcom anni '90: sassofono allegro, basso slappato, applausi registrati (i piatti)
      cavallo: { bpm: 118, chords: ["C", "Am", "F", "G", "C", "E", "Am", "G"], lres: 2, lw: "sawtooth", lv: 0.03,
        lead: "E5 - G5 C6 - B5 A5 - | G5 - - E5 - C5 - - | F5 - A5 C6 - A5 F5 - | G5 - B5 D6 - - - - | E5 - G5 C6 - E6 D6 - | B5 - G#5 - E5 - - - | A5 - C6 E6 - D6 C6 - | B5 - D6 - G5 - - -",
        bass: "R . 5 R . R 8 5", bv: 0.11, arp: "", av: 0, drum: "k . h s . k h s k . h s . k h h", dv: 0.13 },
    },
    paint: {
      // le lettere giganti di LUSTRINO, una per casella
      Z(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g, L = "LUSTRINO"[(tx - 6) % 8] || "L", tilt = L === "T" ? 0.15 : 0; g.save(); g.translate(sx + 8, sy + 9); g.rotate(tilt); g.fillStyle = "#fff"; g.strokeStyle = "#3a2a3a"; g.lineWidth = 1.5; g.fillRect(-6, -10, 12, 18); g.strokeRect(-6, -10, 12, 18); g.fillStyle = "#3a2a3a"; g.font = "900 13px 'Arial Black', sans-serif"; g.textAlign = "center"; g.fillText(L, 0, 4); g.restore(); },
      // riflettore su treppiede, con il fascio
      F(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.strokeStyle = "#3a2a3a"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sx + 8, sy + 8); g.lineTo(sx + 3, sy + 15); g.moveTo(sx + 8, sy + 8); g.lineTo(sx + 13, sy + 15); g.stroke(); g.fillStyle = "#5a4a5a"; g.fillRect(sx + 3, sy + 1, 10, 8); g.strokeRect(sx + 3, sy + 1, 10, 8); g.fillStyle = (fr + tx * 9) % 120 < 60 ? "#fff4b0" : "#f0e0a0"; g.fillRect(sx + 4, sy + 2, 4, 6); },
      // telecamera su treppiede, lucina rossa
      K(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g; g.strokeStyle = "#3a2a3a"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(sx + 8, sy + 9); g.lineTo(sx + 3, sy + 15); g.moveTo(sx + 8, sy + 9); g.lineTo(sx + 13, sy + 15); g.stroke(); g.fillStyle = "#7a6a8a"; g.fillRect(sx + 2, sy + 2, 10, 7); g.strokeRect(sx + 2, sy + 2, 10, 7); g.fillStyle = "#3a2a3a"; g.fillRect(sx + 12, sy + 3, 3, 5); g.beginPath(); g.arc(sx + 5, sy + 1, 2.5, 0, 7); g.arc(sx + 9, sy + 1, 2.5, 0, 7); g.fill(); g.fillStyle = (fr >> 5) % 2 ? "#ff5a5a" : "#7a2a2a"; g.fillRect(sx + 3, sy + 3, 2, 2); },
      // pannello di scenografia
      A(K, sx, sy, tx, ty) { K.ground(sx, sy, tx, ty); const g = K.g; g.fillStyle = ["#f0b8c8", "#a8d8f0", "#ffe08a"][tx % 3]; g.fillRect(sx + 1, sy - 6, 14, 20); g.strokeStyle = "#3a2a3a"; g.lineWidth = 1.5; g.strokeRect(sx + 1.5, sy - 5.5, 13, 19); g.fillStyle = "rgba(255,255,255,.6)"; g.fillRect(sx + 4, sy - 2, 4, 5); g.fillStyle = "#8a6a4a"; g.fillRect(sx + 13, sy + 6, 2, 8); },
      // palma in vaso
      P(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); const g = K.g, sw = Math.sin(fr / 40 + tx) * 1.5; g.fillStyle = "#e8a8b8"; g.fillRect(sx + 4, sy + 10, 8, 6); g.strokeStyle = "#3a2a3a"; g.lineWidth = 1; g.strokeRect(sx + 4.5, sy + 10.5, 7, 5); g.fillStyle = "#c8a070"; g.fillRect(sx + 7, sy - 4, 2, 14); g.fillStyle = "#5aa86a"; for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.6; g.beginPath(); g.ellipse(sx + 8 + Math.cos(a) * 6 + sw, sy - 5 + Math.sin(a) * 3, 6, 2, a, 0, 7); g.fill(); } },
      // le stelle sul marciapiede (si cammina)
      "*"(K, sx, sy, tx, ty) { const g = K.g; g.fillStyle = (tx + ty) % 2 ? "#f4c8d8" : "#eec0d0"; g.fillRect(sx, sy, 16, 16); g.fillStyle = "rgba(0,0,0,.08)"; g.fillRect(sx, sy + 15, 16, 1); if ((tx + ty) % 3 === 0) { g.fillStyle = "#ffd86a"; g.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 2.5 : 6, a = -Math.PI / 2 + (k * Math.PI) / 5; g.lineTo(sx + 8 + Math.cos(a) * r, sy + 8 + Math.sin(a) * r); } g.closePath(); g.fill(); g.strokeStyle = "#c89a3a"; g.lineWidth = 0.8; g.stroke(); } },
    },
    guest: { id: "cs_baldo", lines: [["cs_baldo", "[felice] {n}! Sono in vacanza al Borgo Marino. Nessuno mi riconosce. (Pausa.) Nessuno. Neanche quello là col cappello. (Pausa più lunga.) È bellissimo, in realtà. Mi offri un gelato?"]] },
    cameos: [
      { id: "rz_ferruccio", zone: "cs_studios", at: [30, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.razzo") || {}).done?.[1], lines: [["rz_ferruccio", "[felice] BIP. Ferruccio, dal 3011. Cerco lavoro come telecronista. Ho fatto un provino: ho commentato una pianta per venti minuti. Mi hanno detto «le faremo sapere». Nel 3011 vuol dire sì."]] },
      { id: "sq_scintilla", zone: "cs_teatro", at: [4, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.quartiere") || {}).done?.[1], lines: [["sq_scintilla", "[ride] Scintilla, da Ponterotto. Faccio il catering per il set: pizze per tutti. Il cavallo vuole la margherita senza margherita. È una star, dice."]] },
    ],
  });
  const K = E.K;
  K.TITOLI = TITOLI;
  // ------------------------------------------------------------ LA RASSEGNA STAMPA: il giornale che gira
  // K.stampa(id, { fama, verita }, then): esce il giornale con il titolo TITOLI[id] (gira su se stesso e si ferma davanti a te),
  // cambia la fama e la verità, e finisce nel diario.
  K.stampa = (id, d, then) => {
    const T = TITOLI[id]; if (!T) return (then || K.done)();
    K.F.set("cs_t_" + id, true); if (d && d.fama) K.bond("fama", d.fama); if (d && d.verita) K.bond("verita", d.verita);
    if (!document.getElementById("csCss")) { const st = document.createElement("style"); st.id = "csCss"; st.textContent = `.csNews{position:fixed;inset:0;z-index:260;background:rgba(58,42,58,.6);display:flex;align-items:center;justify-content:center;padding:14px;font-family:Georgia,'Times New Roman',serif}.csNews .pg{width:min(100%,420px);background:#fbf6ea;color:#2a2a2a;border:2px solid #2a2a2a;box-shadow:8px 8px 0 rgba(0,0,0,.25);padding:12px 14px;animation:csSpin 1.1s cubic-bezier(.2,.8,.3,1) both}@keyframes csSpin{0%{transform:scale(.05) rotate(-1440deg);opacity:0}70%{opacity:1}100%{transform:scale(1) rotate(-2deg)}}.csNews .ts{text-align:center;font:900 22px 'Times New Roman',serif;border-bottom:3px double #2a2a2a;padding-bottom:4px;letter-spacing:1px}.csNews .dt{display:flex;justify-content:space-between;font:11px Georgia,serif;border-bottom:1px solid #2a2a2a;padding:2px 0;margin-bottom:8px}.csNews h4{margin:6px 0;font:900 24px 'Arial Black',Impact,sans-serif;line-height:1.1;text-align:center}.csNews .ph{height:70px;margin:8px 0;background:repeating-linear-gradient(45deg,#d8d0c0,#d8d0c0 4px,#e8e0d0 4px,#e8e0d0 8px);border:1px solid #2a2a2a;display:flex;align-items:center;justify-content:center;font-size:32px}.csNews p{font-size:13px;line-height:1.4;margin:4px 0;columns:2;column-gap:12px}.csNews button{width:100%;margin-top:10px;min-height:46px;border:2px solid #2a2a2a;background:#ffd8e8;font:800 14px system-ui;border-radius:10px}`; document.head.appendChild(st); }
    const ov = document.createElement("div"); ov.className = "csNews";
    ov.innerHTML = `<div class="pg"><div class="ts">${K.esc(T[0]).toUpperCase()}</div><div class="dt"><span>Edizione straordinaria</span><span>Lustrino · 50 centesimi</span></div><h4>${K.esc(T[1])}</h4><div class="ph">🐴📸</div><p>${K.esc(T[2])} ${d && d.fama ? "Le foto fanno il giro di Lustrino in un'ora." : ""} ${d && d.verita ? "Qualcuno, al bar, dice: «Finalmente una cosa vera»." : ""}</p><button type="button">Continua ▸</button></div>`;
    document.body.appendChild(ov); K.tone(420, 0.5, "triangle", 0.04, 0, 880);
    ov.querySelector("button").onclick = () => { ov.remove(); (then || K.done)(); };
  };
  // ------------------------------------------------------------ la partita originale: Ciak! Si Gioca
  K.ciakMatch = (o, done) => { const h = (K.hero && K.hero()) || {}; return K.ownMatch(window.__ciak.start, Object.assign({ usColor: "#f0a8c8", us: "Zoccoli d'Oro", hero: { name: h.name || "Tu" }, mates: [{ name: "Baldo" }, { name: "Ugo" }] }, o, { done: (r) => { if (r.quit) K.F.set("cs_lasciato", true); done(r); } })); };
  window.__cavallo = E.api;
})();
