// js/campetto.js - DAL CAMPETTO AL MONDIALE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga SPORTIVA e di sogni, nello spirito dei vecchi cartoni di calcio a puntate (tutto inventato).
// Riva Azzurra, un paese di mare. Un campetto di terra dietro la pescheria, un ex nazionale che ora ripara reti da pesca,
// un portiere col cappellino che non ha mai preso gol, e un sogno troppo grande per un campetto: il Mondiale.
// Novità di questa saga (oltre a quelle del motore comune):
//  - DUELLO CINEMATICO (js/duello.js): la partita originale, con un motore suo. Una partita fatta di duelli a vignette:
//    dribbling, passaggi, uno-due, tiri e TIRI SPECIALI, con la GRINTA che si consuma e il cronometro che corre.
//  - L'ALLENAMENTO (K.allena): una scena nuova del motore. Una lancetta corre su un arco; fermala nella zona giusta tre volte
//    di fila e impari un tiro speciale. Ogni tiro speciale imparato entra in tutte le partite della saga.
//  - VIGNETTE MANGA negli sfondi: linee cinetiche, retini, scritte dei colpi.
// Salvataggio proprio: ali-di-rondine.campetto. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__campetto || !window.__sagaCore) return;
  // i tiri speciali: si imparano con l'allenamento e finiscono nel Duello Cinematico
  const SPECIALS = {
    aquila: { id: "aquila", name: "Tiro dell'Aquila", cost: 30, pow: 9, fx: "aquila", who: "Bastiano", d: "Un tiro che sale, si ferma un attimo in cielo e poi piomba giù come un'aquila sul pesce." },
    catapulta: { id: "catapulta", name: "Catapulta dei Ponte", cost: 40, pow: 12, fx: "catapulta", who: "i gemelli Ponte", d: "Un gemello fa da trampolino, l'altro vola: e tu tiri dal cielo." },
    oro: { id: "oro", name: "Combinazione d'Oro", cost: 45, pow: 14, fx: "oro", who: "Dario Vento", d: "Due passaggi di prima, così veloci che il pallone sembra d'oro, e il tiro parte da solo." },
  };
  const E = window.__sagaCore.create({
    id: "campetto", key: "ali-di-rondine.campetto", title: "Dal Campetto al Mondiale", icon: "🏆", bg: "cm_titolo", chapters: 3,
    menuSub: "Un campetto di terra, un ex nazionale, un portiere imbattuto e un sogno grande come un Mondiale",
    theme: { accent: "#ffd23f", ink: "#f4f0e4", paper: "rgba(14,22,40,.92)", font: "system-ui, sans-serif", chipBg: "#0e1628ee", chipBorder: "#ffd23f" },
    stats: { amicizia: [0, 99, 0, "Amicizia della squadra"], sogno: [0, 99, 0, "Il sogno"] },
    travel: true,
    item: ["Pallone firmato", "Palloni firmati"],
    stadium: { azPitch: "campo", cageField: 1, cageMut: "narrow", venue: { ads: [["RIVA AZZURRA", "#1f5fbf"], ["PESCHERIA DA ROSA", "#e83a3a"], ["IL CAMPETTO", "#c8a040"], ["SOGNO MONDIALE", "#ffd23f"]], crowd: ["#1f5fbf", "#ffd23f", "#e83a3a", "#ffffff", "#3a8a5a"], ground: ["#3a9a4a", "#349044"], line: "#ffffffcc", grid: "rgba(255,255,255,.05)", tint: "rgba(255,230,160,.06)", glow: "255,230,160", sky: ["#2a6ac8", "#a8d8f8"], fx: { spd: 1.04 } } },
    regions: {
      riva: { grass: ["#5aa04a", "#56984a", "#5ea84e"], path: ["#c8b080", "#c0a878"], stone: ["#b8b0a0", "#b0a898"], wall: ["#e8dcc8", "#dcd0bc"], water: ["#2a7ac8", "#3a8ad8"], tall: "#4a8a3a", tree: ["#2a6a2a", "#347434", "#2e6e2e"], tint: "255,230,170", tintA: 0.06, fx: "", dark: 0.02 },
      stadio: { grass: ["#3a9a4a", "#349044", "#40a050"], path: ["#c8c0b0", "#c0b8a8"], stone: ["#a8a8b0", "#a0a0a8"], wall: ["#d8d8e0", "#ccccd4"], water: ["#2a7ac8", "#3a8ad8"], tall: "#3a8a3a", tree: ["#2a6a2a", "#347434", "#2e6e2e"], tint: "255,240,200", tintA: 0.05, fx: "", dark: 0.02 },
      casa: { grass: ["#7a6a5a", "#746454", "#806e5e"], path: ["#a89878", "#a09070"], stone: ["#c8c0b0", "#c0b8a8"], wall: ["#3a4a6a", "#344464"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,220,170", tintA: 0.12, fx: "dust", dark: 0.08 },
    },
    floors: "", solid: "Q",
    rest: { ch: "s", label: "Siediti in panchina", text: "Ti siedi in panchina. Da qui il campo sembra più grande, e il sogno anche. (Il gioco salva da solo: qui puoi rileggere il Quaderno dei Tiri.)" },
    texts: { chestOpen: "Apri il borsone.", chestEmpty: "Il borsone è vuoto: solo un calzettone spaiato e l'odore dell'erba.", nothing: "Niente. Solo il rumore di un pallone che rimbalza, lontano.", noHero: "Il campetto di Riva Azzurra aspetta un nuovo numero dieci. Prima crea il tuo Campione.", chapters: "Tre capitoli, dal campetto al Mondiale. Ogni tiro speciale che impari resta con te." },
    journal: { name: "Il Quaderno dei Tiri", sub: "Tiri speciali, compagni, rivali, finali" },
    endings: {
      mondiale: ["CAMPIONI DEL MONDO", "Alzi la coppa sotto i riflettori, e per un attimo ti sembra di sentire il rumore del campetto di Riva Azzurra: le onde, la pescheria, Bastiano che grida «Testa alta!». Il sogno era grande. È stato abbastanza.", "Sempre possibile, alla fine."],
      leone: ["IL LEONE IN SQUADRA", "Leone Ruggeri, il tuo rivale di sempre, ti passa il pallone del gol decisivo. Non vi siete mai detti «amici». Non ce n'è bisogno: un passaggio così vale più di mille parole.", "Serve aver chiamato Leone in Nazionale."],
      campetto: ["RITORNO AL CAMPETTO", "Con la coppa ancora nella borsa torni a Riva Azzurra, al campetto di terra. Ci sono undici bambini e un pallone sgonfio. Bastiano ti lancia un fischietto: «Tocca a te, adesso».", "Serve una grande amicizia con la squadra del campetto."],
      amico: ["IL PALLONE È UN AMICO", "Dopo la finale, a stadio vuoto, palleggi da solo sotto i riflettori. Il pallone non cade mai. Bastiano lo diceva sempre: «Il pallone è un amico. Se non lo tradisci, non ti tradisce». Hai imparato tutti i tiri, trovato tutti i palloni firmati, e non hai mai lasciato una partita a metà.", "Segreto: tutti i tiri speciali, tutti i palloni firmati, e nessuna partita abbandonata."],
    },
    heroLook: (h, K) => ({ bg: ["#0e1628", "#ffd23f"], shirt: K.F.is("cm_nazionale") ? "#1f5fbf" : h.shirt }),
    heroTitle: (K) => (K.F.is("cm_nazionale") ? "numero dieci della Nazionale" : "numero dieci del campetto"),
    act: { q: "Entra", Q: "Guarda la porta del campetto", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) { if (ch !== "Q") return false; K.say([["voce", "Una porta da calcio di ferro, verniciata cento volte. La rete è rammendata con lo spago da pesca di Bastiano. Sulla traversa, un'ammaccatura: dicono che sia il primo Tiro dell'Aquila della storia."]]); return true; },
    }],
    musicMain: "campetto",
    music: {
      // un tema da sigla di cartone sportivo: tromba (quadra), basso pieno, batteria in levare
      campetto: { bpm: 132, chords: ["C", "G", "Am", "F", "C", "G", "F", "G"], lres: 2, lw: "square", lv: 0.04,
        lead: "E5 - G5 - C6 - B5 - | A5 - G5 - E5 - - - | F5 - A5 - C6 - A5 - | G5 - - - D5 - - - | E5 - G5 - C6 - E6 - | D6 - B5 - G5 - - - | A5 - C6 - F5 - A5 - | G5 - - - - - - -",
        bass: "R . R . 5 . R . R . R . 5 . 8 .", bv: 0.1, arp: "1 5 8 5 1 5 8 5 1 5 8 5 1 5 8 5", aw: "triangle", av: 0.014, drum: "k . h . s . h . k . k h s . h .", dv: 0.17 },
    },
    paint: {
      // la porta del campetto: pali di ferro, rete di spago che ondeggia col vento di mare
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * 16 - cx, y = ty * 16 - cy + 16; g.fillStyle = "#f4f0e4"; g.fillRect(x - 6, y - 22, 2, 22); g.fillRect(x + 20, y - 22, 2, 22); g.fillRect(x - 6, y - 23, 28, 2); g.strokeStyle = "rgba(240,240,240,.45)"; g.lineWidth = 0.6; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(x - 4 + i * 4.6, y - 21); g.lineTo(x - 3 + i * 4.6 + Math.sin(fr / 20 + i) * 0.8, y); g.stroke(); } for (let j = 0; j < 4; j++) { g.beginPath(); g.moveTo(x - 4, y - 18 + j * 5); g.lineTo(x + 20, y - 18 + j * 5 + Math.sin(fr / 20 + j) * 0.6); g.stroke(); } }); },
    },
    guest: { id: "cm_bastiano", lines: [["cm_bastiano", "[ride] {n}! Il Borgo Marino ha un campo vero, eh? Con le righe dritte. Al mio campetto le righe le faceva la pioggia. (Ti tira un pallone.) Testa alta, sempre. E il pallone è un amico."]] },
    cameos: [
      { id: "ts_tito", zone: "cm_riva", at: [8, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.torneo") || {}).done?.[1], lines: [["ts_tito", "[felice] Anche tu sogni il Mondiale? Al Torneo delle Cento Scuole lo sognavamo tutti. Io adesso sogno di vincere il torneo del mio quartiere. Si comincia sempre da un campetto."]] },
      { id: "mg_bullone", zone: "cm_provincia", at: [5, 16], when: (K) => !!(K.otherSaga("ali-di-rondine.mantello") || {}).done?.[1], lines: [["mg_bullone", "BIP. Un tiro che sale e poi piomba giù? (Calcola.) Fisicamente improbabile. Emotivamente: bellissimo. BIP."]] },
    ],
  });
  const K = E.K;
  K.SPECIALS = SPECIALS;
  K.learned = () => Object.keys(SPECIALS).filter((k) => K.F.is("cm_sp_" + k)).map((k) => SPECIALS[k]);
  // la partita originale della saga: il Duello Cinematico, con i tiri speciali imparati e la grinta del capitolo
  K.duello = (o, done) => K.ownMatch(window.__duello.start, Object.assign({ hero: null, specials: K.learned(), usColor: "#1f5fbf" }, o, { done: (r) => { if (r.quit) K.F.set("cm_lasciato", true); done(r); } }));
  // L'ALLENAMENTO: una lancetta corre su un arco; fermala nella zona dorata tre volte di fila. K.allena({ title, sub, who, hard }, done(ok))
  K.allena = (o, done) => {
    css(); const ov = document.createElement("div"); ov.className = "cmTrain"; let hits = 0, tries = 0, t = 0, run = true, flash = 0, msg = "";
    ov.innerHTML = `<h3>${K.esc(o.title || "Allenamento")}</h3><p>${K.esc(o.sub || "Ferma la lancetta nella zona dorata tre volte di fila.")}</p><canvas width="560" height="340"></canvas><div class="row"><button class="go">⚽ CALCIA!</button><button class="no">Lascia stare</button></div>`;
    document.body.appendChild(ov); const cv = ov.querySelector("canvas"), g = cv.getContext("2d");
    const span = () => 0.34 - (o.hard ? 0.08 : 0) - hits * 0.05, mid = () => Math.PI * (1.25 + 0.5 * Math.sin(hits * 2.1 + 0.6) * 0.5); // la zona si stringe e si sposta a ogni centro
    let ang = Math.PI;
    function draw() {
      if (!ov.isConnected) return; t++; if (run) ang = Math.PI + (Math.sin(t / (o.hard ? 13 : 16)) * 0.5 + 0.5) * Math.PI;
      g.setTransform(2, 0, 0, 2, 0, 0); g.fillStyle = "#0e1628"; g.fillRect(0, 0, 280, 170);
      g.strokeStyle = "rgba(255,255,255,.08)"; for (let i = 0; i < 30; i++) { const a = (i / 30) * Math.PI * 2; g.beginPath(); g.moveTo(140 + Math.cos(a) * 40, 150 + Math.sin(a) * 40); g.lineTo(140 + Math.cos(a) * 200, 150 + Math.sin(a) * 200); g.stroke(); }
      g.lineWidth = 14; g.strokeStyle = "#2a3346"; g.beginPath(); g.arc(140, 150, 110, Math.PI, Math.PI * 2); g.stroke();
      g.strokeStyle = "#ffd23f"; g.beginPath(); g.arc(140, 150, 110, mid() - span() / 2, mid() + span() / 2); g.stroke();
      g.strokeStyle = "#fff"; g.lineWidth = 4; g.lineCap = "round"; g.beginPath(); g.moveTo(140, 150); g.lineTo(140 + Math.cos(ang) * 118, 150 + Math.sin(ang) * 118); g.stroke();
      g.fillStyle = "#fff"; g.beginPath(); g.arc(140, 150, 8, 0, 7); g.fill(); g.fillStyle = "#111"; g.beginPath(); g.arc(140, 150, 3.5, 0, 7); g.fill();
      for (let i = 0; i < 3; i++) { g.fillStyle = i < hits ? "#ffd23f" : "#2a3346"; g.beginPath(); g.arc(110 + i * 30, 22, 8, 0, 7); g.fill(); }
      if (flash > 0) { flash--; g.fillStyle = `rgba(255,255,255,${flash / 40})`; g.fillRect(0, 0, 280, 170); g.font = "900 22px Impact, 'Arial Black', sans-serif"; g.textAlign = "center"; g.lineWidth = 4; g.strokeStyle = "#111"; g.strokeText(msg, 140, 90); g.fillStyle = msg === "PERFETTO!" ? "#ffd23f" : "#ff8a7a"; g.fillText(msg, 140, 90); g.textAlign = "left"; }
      requestAnimationFrame(draw);
    }
    const end = (ok) => { ov.remove(); try { done(ok); } catch (e) { console.error(e); } };
    function kick() {
      tries++; const d = Math.abs(((ang - mid() + Math.PI * 3) % (Math.PI * 2)) - Math.PI), ok = d <= span() / 2;
      if (ok) { hits++; msg = "PERFETTO!"; K.tone(660 + hits * 110, 0.2, "triangle", 0.06); } else { hits = 0; msg = "FUORI!"; K.tone(180, 0.25, "square", 0.04); }
      flash = 40; if (hits >= 3) { run = false; setTimeout(() => end(true), 700); }
    }
    ov.querySelector(".go").addEventListener("pointerdown", (e) => { e.preventDefault(); if (hits < 3) kick(); });
    ov.querySelector(".no").onclick = () => end(false);
    K._train = { kick, win: () => { hits = 3; end(true); } }; draw();
  };
  function css() {
    if (document.getElementById("cmTrainCss")) return; const st = document.createElement("style"); st.id = "cmTrainCss";
    st.textContent = `.cmTrain{position:fixed;inset:0;z-index:320;background:#0a0f1c;color:#f4f0e4;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px}
.cmTrain h3{margin:0;font:900 24px Impact,'Arial Black',sans-serif;color:#ffd23f;text-align:center;letter-spacing:.5px}.cmTrain p{margin:0;font-size:13px;opacity:.85;text-align:center;max-width:380px}
.cmTrain canvas{width:min(100%,420px);height:auto;aspect-ratio:280/170;border:3px solid #f4f0e4;border-radius:6px}
.cmTrain .row{display:flex;gap:8px;width:min(100%,420px)}.cmTrain button{flex:1;min-height:52px;border-radius:6px;border:2px solid #f4f0e4;background:#22252e;color:#f4f0e4;font:800 15px system-ui,sans-serif;cursor:pointer}.cmTrain button.go{background:#ffd23f;color:#111;flex:2;font-size:18px}`;
    document.head.appendChild(st);
  }
  window.__campetto = E.api;
})();
