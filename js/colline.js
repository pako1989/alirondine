// js/colline.js - MASTER LEAGUE DELLE COLLINE · configurazione della saga sul motore comune (js/saga-core.js)
// Saga GESTIONALE, nello spirito delle «master league» dei giochi di calcio (tutto inventato).
// Valfiorita, colline di vigne e campanili. L'U.S. Colle Alto è ultima nella Lega delle Colline: sei squadre, un campo
// in salita, una presidentessa contessa e un bar dove si decidono le formazioni. Tu sei il nuovo allenatore.
// Novità di questa saga (oltre a quelle del motore comune):
//  - LAVAGNA TATTICA (js/lavagna.js): la partita originale, con un motore suo. Non tocchi il pallone: decidi. Modulo,
//    giocatori nelle caselle, mentalità e istruzione (che si battono come sasso-carta-forbice), cambi, stamina, pagelle.
//  - IL MERCATO (K.mercato): una scena nuova del motore. Una bacheca di sughero con le figurine dei giocatori: compri e
//    cedi con i CREDITI della società. La rosa resta tua da un capitolo all'altro, e cresce con gli allenamenti.
//  - LA CLASSIFICA (K.classifica): il tabellone della Lega delle Colline, che si aggiorna partita dopo partita.
// Salvataggio proprio: ali-di-rondine.colline. Ricompense: monete, cosmetici, Sala Giochi, Cineteca, ospite al Borgo.
(function () {
  "use strict";
  if (window.__colline || !window.__sagaCore) return;
  // la rosa: i giocatori del paese (sempre tuoi) e quelli del mercato (si comprano)
  const PLAYERS = {
    bepi: { n: "Bepi Sasso", r: "P", o: 56, from: "paese", d: "Il portiere del paese: fa il fornaio, e para con le mani infarinate." },
    toni: { n: "Toni Vigna", r: "D", o: 54, from: "paese", d: "Terzino, vendemmiatore. Corre in salita meglio che in piano." },
    gigio: { n: "Gigio Ruota", r: "D", o: 55, from: "paese", d: "Centrale, meccanico. Ripara le biciclette di tutto il paese, e i buchi in difesa." },
    nane: { n: "Nane Campanile", r: "D", o: 52, from: "paese", d: "Il sacrestano. Lento, ma sa sempre dove andrà la palla. Dice che glielo suggeriscono le campane." },
    marta: { n: "Marta Fiore", r: "C", o: 58, from: "paese", d: "La fiorista. Il centrocampo più ordinato delle colline." },
    ciccio: { n: "Ciccio Botte", r: "C", o: 53, from: "paese", d: "Il cantiniere. Tira da lontano, sempre, comunque. Ogni tanto entra." },
    rino: { n: "Rino Corriera", r: "A", o: 57, from: "paese", d: "L'autista della corriera: segna solo di testa, perché i piedi li tiene per la frizione." },
    dodo: { n: "Dodo Lampo", r: "A", o: 54, from: "paese", d: "Il ragazzo delle consegne. Velocissimo, ma prima di tirare deve finire il giro." },
    // il mercato
    ermes: { n: "Nonno Ermes", r: "P", o: 63, cost: 0, d: "Il portiere della Colle Alto del 1978. Ha settant'anni e para ancora. Svincolato: gioca per un caffè al giorno." },
    lucia: { n: "Lucia Mulino", r: "D", o: 64, cost: 120, d: "Centrale della Pietrafitta, cresciuta a Colle Alto. Vuole tornare a casa." },
    ottavio: { n: "Ottavio Torchio", r: "C", o: 66, cost: 160, d: "Regista dei vigneti di Monteroso. Dà del lei al pallone." },
    samba: { n: "Samuele «Samba» Neri", r: "A", o: 70, cost: 260, d: "Il centravanti più forte delle colline. Balla dopo ogni gol, anche in allenamento." },
    ines: { n: "Ines Granaio", r: "C", o: 62, cost: 90, d: "Mediana, agricoltrice. Recupera palloni come raccoglie le olive: tutti." },
    furio: { n: "Furio Tornado", r: "A", o: 65, cost: 180, d: "Ala dal Borgofiera. Velocissimo, nervosissimo, fortissimo. In quest'ordine." },
    gemma: { n: "Gemma Rocca", r: "D", o: 67, cost: 210, d: "Terzino della Valfonda, scontenta del suo presidente. Non ha mai perso un contrasto in vita sua." },
  };
  const TEAMS = { // la Lega delle Colline
    colle: { n: "U.S. Colle Alto", c: "#2a6a3a", o: 0 }, valfonda: { n: "Atletico Valfonda", c: "#a83a2a", o: 70, instr: "pressing" }, pietrafitta: { n: "Sporting Pietrafitta", c: "#5a5a8a", o: 58, instr: "possesso" },
    monteroso: { n: "Real Monteroso", c: "#8a2a5a", o: 62, instr: "contropiede" }, borgofiera: { n: "Amatori Borgofiera", c: "#c88a2a", o: 56, instr: "lunga" }, sangallo: { n: "Virtus San Gallo", c: "#2a5a8a", o: 64, instr: "possesso" },
  };
  const E = window.__sagaCore.create({
    id: "colline", key: "ali-di-rondine.colline", title: "Master League delle Colline", icon: "📋", bg: "ml_titolo", chapters: 3,
    menuSub: "L'U.S. Colle Alto è ultima in classifica: tu sei il nuovo allenatore. Lavagna, mercato, allenamenti e campanili",
    theme: { accent: "#ffd23f", ink: "#f4f0e4", paper: "rgba(30,58,42,.94)", font: "system-ui, sans-serif", chipBg: "#1e3a2aee", chipBorder: "#c8a050" },
    stats: { fiducia: [0, 99, 0, "Fiducia della presidente"], paese: [0, 99, 0, "Il paese con te"] },
    travel: true,
    item: ["Figurina rara", "Figurine rare"],
    stadium: { azPitch: "campo", cageField: 1, cageMut: "heavy", weather: undefined, venue: { ads: [["U.S. COLLE ALTO", "#2a6a3a"], ["CANTINA BOTTE", "#8a2a5a"], ["FORNO SASSO", "#c88a2a"], ["BAR DELLO SPORT", "#2a5a8a"]], crowd: ["#2a6a3a", "#f4f0e4", "#c88a2a", "#8a2a5a", "#e8d8b0"], ground: ["#5a9a3a", "#529236"], line: "#f4f0e4cc", grid: "rgba(255,255,255,.05)", tint: "rgba(255,230,170,.06)", glow: "255,230,170", sky: ["#5a8ab8", "#e8d8b0"], fx: { fr: 0.98, spd: 0.98 } } },
    regions: {
      colle: { grass: ["#6a9a4a", "#649444", "#70a050"], path: ["#c8b090", "#c0a888"], stone: ["#c8b898", "#c0b090"], wall: ["#e0c8a0", "#d4bc94"], water: ["#4a8ab8", "#5494c0"], tall: "#5a8a3a", tree: ["#3a6a2a", "#447434", "#3e6e2e"], tint: "255,220,160", tintA: 0.07, fx: "", dark: 0.03 },
      casa: { grass: ["#7a5a3a", "#745434", "#80603e"], path: ["#a8825a", "#a07a52"], stone: ["#c8b8a0", "#c0b098"], wall: ["#4a3a2a", "#443424"], water: ["#4a7a9a", "#5484a4"], tall: "#6a8a4a", tint: "255,200,130", tintA: 0.14, fx: "dust", dark: 0.1 },
    },
    floors: "", solid: "Q",
    rest: { ch: "s", label: "Siediti in panchina", text: "Ti siedi sulla panchina dell'allenatore. Scricchiola, come tutte le panchine delle colline. (Il gioco salva da solo: qui puoi rileggere il Taccuino del Mister.)" },
    texts: { chestOpen: "Apri l'armadietto.", chestEmpty: "L'armadietto è vuoto: un calzettone, un santino e un biglietto della corriera del 1993.", nothing: "Niente. Solo un campanile che suona l'ora, da qualche parte nelle colline.", noHero: "L'U.S. Colle Alto aspetta il suo nuovo allenatore. Prima crea il tuo Campione.", chapters: "Tre capitoli, una stagione. La rosa che costruisci resta tua fino all'ultima partita." },
    journal: { name: "Il Taccuino del Mister", sub: "Rosa, mercato, classifica, finali" },
    endings: {
      promozione: ["SERIE COLLINA", "L'U.S. Colle Alto vince lo spareggio e sale in Serie Collina. Il campanile suona per un'ora. La Contessa Bice offre da bere a tutto il paese, e per la prima volta dal 1978 paga lei.", "Sempre possibile, alla fine."],
      paese: ["LA SQUADRA DEL PAESE", "Promossi con i giocatori del paese: il fornaio, il sacrestano, la fiorista, l'autista della corriera. Nessuna figurina comprata. Il paese li porta in trionfo sulla corriera, che però guida Rino.", "Serve vincere senza comprare quasi nessuno, e con il paese dalla tua parte."],
      mago: ["IL RITORNO DEL MAGO", "Il Mago Pino torna in panchina, accanto a te: l'allenatore e il suo vecchio maestro, due lavagne e un caffè. La Lega delle Colline non è mai stata così difficile da battere.", "Serve una grande fiducia della presidente e aver ascoltato il Mago."],
      triplete: ["IL TRIPLETE DELLE COLLINE", "Campionato, coppa del vino e spareggio: tre trofei in una stagione, cosa mai vista nelle colline. Nel bar dello sport attaccano la tua foto accanto a quella del 1978. Il Mago Pino, per l'emozione, sbaglia un caffè.", "Segreto: battere tutte le squadre della Lega e trovare tutte le figurine rare."],
    },
    heroLook: (h, K) => ({ bg: ["#1e3a2a", "#c8a050"], shirt: h.shirt }),
    heroTitle: () => "allenatore dell'U.S. Colle Alto",
    act: { q: "Entra", Q: "Guarda la porta", "^": "Cambia zona", v: "Cambia zona", "<": "Cambia zona", ">": "Cambia zona" },
    plugins: [{
      obj(ch, tx, ty, zid, spec, K) { if (ch !== "Q") return false; K.say([["voce", "La porta del campo comunale: in salita, tre metri più alta da una parte che dall'altra. Gli avversari dicono che è un vantaggio. I tifosi di Colle Alto dicono che è il carattere."]]); return true; },
    }],
    musicMain: "colline",
    music: {
      // un tema da bar dello sport: fisarmonica (quadra morbida), basso a valzer, spazzole
      colline: { bpm: 112, chords: ["F", "C", "Dm", "Bb", "F", "C", "Bb", "C"], lres: 2, lw: "square", lv: 0.035,
        lead: "A4 - C5 - F5 - E5 - | D5 - C5 - A4 - - - | F4 - A4 - D5 - C5 - | Bb4 - - - D5 - - - | C5 - F5 - A5 - G5 - | F5 - E5 - C5 - - - | D5 - F5 - Bb4 - D5 - | C5 - - - - - - -",
        bass: "R . . 5 . . R . . 5 . . R . 5 .", bv: 0.09, arp: "1 3 5 3 1 3 5 3 1 3 5 3 1 3 5 3", aw: "triangle", av: 0.014, drum: "k . . h . . s . . h . . k . h .", dv: 0.12 },
    },
    paint: {
      Q(K, sx, sy, tx, ty, fr) { K.ground(sx, sy, tx, ty); K.later((g, cx, cy) => { const x = tx * 16 - cx, y = ty * 16 - cy + 16; g.fillStyle = "#f4f0e4"; g.fillRect(x - 4, y - 20, 2, 20); g.fillRect(x + 18, y - 24, 2, 24); g.beginPath(); g.moveTo(x - 4, y - 21); g.lineTo(x + 20, y - 25); g.lineTo(x + 20, y - 23); g.lineTo(x - 4, y - 19); g.fill(); g.strokeStyle = "rgba(240,240,240,.4)"; g.lineWidth = 0.6; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(x - 2 + i * 4.4, y - 19 - i * 0.8); g.lineTo(x - 1 + i * 4.4, y); g.stroke(); } }); },
    },
    guest: { id: "ml_pino", lines: [["ml_pino", "[furbo] {n}! Il Borgo Marino… che bel bar, il vostro. Il caffè però lo fate troppo lungo. (Tira fuori un gesso.) Ti disegno una tattica sul tovagliolo? Tre-due-uno, e pressing alto. Funziona anche contro i gabbiani."]] },
    cameos: [
      { id: "cm_bastiano", zone: "ml_colle", at: [5, 18], when: (K) => !!(K.otherSaga("ali-di-rondine.campetto") || {}).done?.[1], lines: [["cm_bastiano", "[ride] Allenatore, adesso? Vent'anni fa ne ho avuti sei. Uno solo mi ha insegnato qualcosa: quello che parlava meno. Testa alta, Mister."]] },
      { id: "tc_ysolde", zone: "ml_citta", at: [26, 16], when: (K) => !!(K.otherSaga("ali-di-rondine.trono") || {}).done?.[1], lines: [["tc_ysolde", "[furbo] Un mercato di giocatori? Patti, prezzi, tradimenti… mi sento a casa. Un consiglio gratuito: il presidente della Valfonda sorride troppo. Noi sappiamo."]] },
    ],
  });
  const K = E.K;
  const F = K.F;
  K.PLAYERS = PLAYERS; K.TEAMS = TEAMS;
  // ---------------------------------------------------------------- la rosa (nei flag: ml_in_<id>, ml_ovr_<id>, ml_form_<id>)
  K.inRosa = (id) => PLAYERS[id].from === "paese" ? !F.is("ml_ceduto_" + id) : F.is("ml_in_" + id);
  K.ovr = (id) => Math.round(+F.get("ml_ovr_" + id, PLAYERS[id].o));
  K.rosa = () => Object.keys(PLAYERS).filter((id) => K.inRosa(id)).map((id) => ({ id, name: PLAYERS[id].n, role: PLAYERS[id].r, ovr: K.ovr(id), form: +F.get("ml_form_" + id, 0) }));
  K.crediti = () => Math.round(+F.get("ml_crediti", 0));
  K.comprati = () => Object.keys(PLAYERS).filter((id) => !PLAYERS[id].from && F.is("ml_in_" + id)).length;
  // la partita originale: la Lavagna Tattica, con la rosa vera; i voti alti danno forma per la prossima
  K.lavagna = (o, done) => K.ownMatch(window.__lavagna.start, Object.assign({ usColor: "#2a6a3a", us: "U.S. Colle Alto", squad: K.rosa() }, o, { done: (r) => {
    if (!r.quit && r.data && r.data.voti) K.rosa().forEach((p) => { const v = r.data.voti[p.name]; if (v != null) F.set("ml_form_" + p.id, v >= 7.5 ? 2 : v >= 6.5 ? 1 : v < 5.5 ? -1 : 0); });
    if (!r.quit && o.oppId) { F.set("ml_res_" + o.oppId, r.win ? "v" : r.a === r.b ? "p" : "s"); if (r.win) F.set("ml_battuta_" + o.oppId, true); }
    done(r);
  } }));
  // ALLENAMENTO: +1 a tre giocatori a scelta della rosa (una sessione per capitolo)
  K.allenamento = (n, done) => { const ids = K.rosa().sort((a, b) => a.ovr - b.ovr).slice(0, 3).map((p) => p.id); ids.forEach((id) => F.set("ml_ovr_" + id, K.ovr(id) + (n || 1))); return ids.map((id) => PLAYERS[id].n); };
  // ---------------------------------------------------------------- IL MERCATO: bacheca di sughero con le figurine
  K.mercato = (o, done) => {
    css(); const ov = document.createElement("div"); ov.className = "mlMkt";
    const pool = (o.pool || []).filter((id) => PLAYERS[id]);
    function render() {
      const cr = K.crediti(), rosa = K.rosa();
      ov.innerHTML = `<div class="top"><h3>${K.esc(o.title || "Il Mercato")}</h3><span class="cr">💰 ${cr} crediti</span></div><p class="sub">${K.esc(o.sub || "Tocca una figurina per comprarla. Puoi anche cedere un giocatore comprato: torna metà del prezzo.")}</p>
        <div class="sec">In vendita</div><div class="grid">${pool.map((id) => { const p = PLAYERS[id], mine = F.is("ml_in_" + id), can = !mine && cr >= p.cost; return `<button type="button" class="fig ${mine ? "mine" : can ? "" : "no"}" data-id="${id}"><span class="r r${p.r}">${p.r}</span><b>${K.esc(p.n)}</b><i>${p.o}</i><small>${K.esc(p.d)}</small><em>${mine ? "IN ROSA · cedi (+" + Math.floor(p.cost / 2) + ")" : p.cost ? p.cost + " crediti" : "GRATIS"}</em></button>`; }).join("")}</div>
        <div class="sec">La tua rosa (${rosa.length})</div><div class="rosa">${rosa.map((p) => `<span><b class="r r${p.role}">${p.role}</b> ${K.esc(p.name)} <i>${p.ovr}</i></span>`).join("")}</div>
        <button type="button" class="done">Chiudi il mercato ▸</button>`;
      ov.querySelectorAll("[data-id]").forEach((b) => b.addEventListener("click", () => buy(b.dataset.id)));
      ov.querySelector(".done").onclick = () => { ov.remove(); try { done(); } catch (e) { console.error(e); } };
    }
    function buy(id) {
      const p = PLAYERS[id];
      if (F.is("ml_in_" + id)) { if (o.noSell) return; F.set("ml_in_" + id, false); F.set("ml_crediti", K.crediti() + Math.floor(p.cost / 2)); K.tone(300, 0.2, "triangle", 0.04); return render(); }
      if (K.crediti() < p.cost) { K.tone(160, 0.2, "square", 0.03); return; }
      F.set("ml_in_" + id, true); F.set("ml_crediti", K.crediti() - p.cost); K.tone(660, 0.25, "triangle", 0.05, 0, 990); render();
    }
    document.body.appendChild(ov); render(); K._mkt = { buy, close: () => ov.querySelector(".done").click() };
  };
  // ---------------------------------------------------------------- LA CLASSIFICA: punti dai risultati salvati + quelli inventati delle altre
  K.classifica = (title, done) => {
    css(); const ids = Object.keys(TEAMS), pts = {}; ids.forEach((t) => (pts[t] = 0));
    const base = { valfonda: 9, sangallo: 7, monteroso: 6, pietrafitta: 4, borgofiera: 3, colle: 1 }; ids.forEach((t) => (pts[t] = base[t] + Math.floor((K.hash ? K.hash(t + (F.get("ml_giornata", 0))) % 3 : 0))));
    ids.forEach((t) => { const r = F.get("ml_res_" + t); if (r === "v") { pts.colle += 3; } else if (r === "p") { pts.colle += 1; pts[t] += 1; } else if (r === "s") pts[t] += 3; });
    const order = ids.slice().sort((a, b) => pts[b] - pts[a]);
    const ov = document.createElement("div"); ov.className = "mlMkt mlTab";
    ov.innerHTML = `<div class="top"><h3>${K.esc(title || "La classifica")}</h3></div><table>${order.map((t, i) => `<tr class="${t === "colle" ? "me" : ""}"><td>${i + 1}</td><td><span class="dot" style="background:${TEAMS[t].c}"></span>${K.esc(TEAMS[t].n)}</td><td>${pts[t]}</td></tr>`).join("")}</table><button type="button" class="done">Chiudi ▸</button>`;
    ov.querySelector(".done").onclick = () => { ov.remove(); try { done && done(order.indexOf("colle") + 1); } catch (e) { console.error(e); } };
    document.body.appendChild(ov); return order.indexOf("colle") + 1;
  };
  function css() {
    if (document.getElementById("mlCss")) return; const st = document.createElement("style"); st.id = "mlCss";
    st.textContent = `.mlMkt{position:fixed;inset:0;z-index:320;overflow:auto;padding:12px 10px 18px;color:#2a1e14;font-family:system-ui,sans-serif;background:#b8875a radial-gradient(circle at 20% 30%,rgba(255,255,255,.08) 0 2px,transparent 3px) 0 0/14px 14px}
.mlMkt .top{display:flex;justify-content:space-between;align-items:center;max-width:460px;margin:0 auto}.mlMkt h3{margin:0;font:900 22px 'Comic Sans MS',system-ui;color:#1e3a2a}.mlMkt .cr{background:#1e3a2a;color:#ffd23f;font-weight:800;padding:4px 10px;border-radius:14px}
.mlMkt .sub{max-width:460px;margin:6px auto;font-size:12.5px}.mlMkt .sec{max-width:460px;margin:10px auto 4px;font-weight:800;font-size:13px;color:#1e3a2a}
.mlMkt .grid{max-width:460px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
.mlMkt .fig{position:relative;text-align:left;border:none;border-radius:6px;background:#f4ecd8;padding:8px 8px 22px;box-shadow:2px 3px 0 rgba(0,0,0,.25);transform:rotate(-1deg);cursor:pointer;font:inherit;color:inherit;min-height:120px}.mlMkt .fig:nth-child(2n){transform:rotate(1.2deg)}
.mlMkt .fig::before{content:"";position:absolute;top:-5px;left:50%;width:10px;height:10px;border-radius:50%;background:#c83a3a;box-shadow:0 1px 0 #7a1a1a}
.mlMkt .fig b{display:block;font-size:13px;margin:2px 0}.mlMkt .fig i{position:absolute;top:8px;right:8px;font:900 18px 'Comic Sans MS',system-ui;font-style:normal;color:#1e3a2a}.mlMkt .fig small{display:block;font-size:10.5px;line-height:1.3;opacity:.85}.mlMkt .fig em{position:absolute;left:8px;bottom:5px;font-style:normal;font-weight:800;font-size:11px;color:#2a6a3a}
.mlMkt .fig.mine{background:#d8f0c8}.mlMkt .fig.no{opacity:.55}.mlMkt .r{display:inline-block;min-width:16px;text-align:center;border-radius:3px;color:#fff;font-size:10px;font-weight:800;padding:0 3px}.mlMkt .rP{background:#c88a2a}.mlMkt .rD{background:#2a5a8a}.mlMkt .rC{background:#2a6a3a}.mlMkt .rA{background:#a83a2a}
.mlMkt .rosa{max-width:460px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:3px;font-size:12px;background:#f4ecd8;border-radius:6px;padding:8px}.mlMkt .rosa i{float:right;font-style:normal;font-weight:800}
.mlMkt .done{display:block;max-width:460px;width:100%;margin:12px auto 0;min-height:46px;border:none;border-radius:6px;background:#1e3a2a;color:#ffd23f;font:800 15px system-ui;cursor:pointer}
.mlMkt table{max-width:460px;width:100%;margin:10px auto;border-collapse:collapse;background:#1e3a2a;color:#f4f0e4;border:5px solid #8a5a2a;font:600 14px 'Comic Sans MS',system-ui}.mlMkt td{padding:7px 8px;border-bottom:1px solid rgba(240,240,230,.2)}.mlMkt td:last-child{text-align:right;font-weight:900;color:#ffd23f}.mlMkt tr.me td{background:rgba(255,210,63,.15)}.mlMkt .dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px}`;
    document.head.appendChild(st);
  }
  window.__colline = E.api;
})();
