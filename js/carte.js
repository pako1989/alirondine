// js/carte.js - «CARTE DEL DESTINO · Cronache del Molo» · modalità a mini-storie sul motore comune (js/saga-core.js)
// Un molo, un mazziere e un mazzo che cambia ogni volta. Si pescano 5 carte (Luogo, Personaggio, Evento, Prova, Twist),
// poi la storia si vive camminando nel luogo estratto: si parla con il personaggio, si sceglie come affrontare l'evento
// (le scelte cambiano Cuore, Audacia, Furbizia), si gioca una PROVA vera e il Twist ribalta (o no) la ricompensa.
// Nessuna modifica alle partite: premi solo monete e cosmetici. Si rigioca all'infinito; l'Archivio ricorda carte e storie.
(function () {
  "use strict";
  if (window.__carte || !window.__sagaCore || !window.__hd) return;
  const HD = window.__hd, FX = HD.F, safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ------------------------------------------------------------------ le carte
  const TYPES = { amb: ["Luogo", "#38bdf8"], pg: ["Personaggio", "#f472b6"], ev: ["Evento", "#fbbf24"], sf: ["Prova", "#34d399"], tw: ["Twist", "#a78bfa"] };
  const AMB = {
    bar: { n: "Il Bar del Molo", i: "🍺", zone: "cd_bar", at: [8, 5], d: "Odore di caffè e di scommesse. Il bancone ha più storie che bicchieri." },
    mercato: { n: "Il Mercato del Pesce", i: "🐟", zone: "cd_mercato", at: [12, 8], d: "Alba, ghiaccio, urla di prezzi. Tutto brilla, compresa qualche bugia." },
    cantiere: { n: "Il Cantiere Navale", i: "⚓", zone: "cd_cantiere", at: [12, 8], d: "Scafi a metà, gru che cigolano, segatura nell'aria e un pallone sempre fra i piedi." },
    faro: { n: "Il Faro", i: "🔦", zone: "cd_faro", at: [11, 8], d: "Scogli, vento e una luce che gira. Al tramonto il mare sembra ascoltare." }
  };
  // tratto: il personaggio ti dà +2 a una qualità all'inizio della storia
  const PG = {
    mimmo: { id: "cd_mimmo", n: "Mimmo il Barista", i: "☕", tr: "cuore", d: "Barista superstizioso: tocca ferro, legno e il cliente sbagliato.", greet: (a) => `Ehi, tu! In ${a} porta fortuna chi arriva da fuori. O sfortuna. Dipende dal giorno.`, win: "Visto? Te l'avevo detto. Era il ferro.", lose: "Colpa dell'ora, non tua. Anzi, di mia cognata." },
    vela: { id: "cd_vela", n: "Capitana Vela", i: "🧭", tr: "audacia", d: "Ex navigatrice, orgogliosa. Dice di aver perso l'orientamento una volta sola, nel 1999.", greet: (a) => `Hai la faccia di chi non ha paura del vento. Stai qui, ${a} è un buon posto per scoprirlo.`, win: "Bene. Si naviga così: a occhio, a cuore e a sbagliare poco.", lose: "Succede. L'importante è non dirlo in giro. Io non l'ho visto." },
    gigi: { id: "cd_gigi", n: "Gigi Due-Reti", i: "🧤", tr: "furbizia", d: "Ex portiere di terza categoria, ha parato un rigore nel 2004 e lo racconta ancora.", greet: (a) => `Giovane! Io, in ${a}, ci ho fatto una parata che... vabbè, te la racconto un'altra volta. Sì, tutte le volte.`, win: "Grande! Ai miei tempi avrei detto: parata di classe.", lose: "Capita. Anche a me. Soprattutto a me." },
    lanterna: { id: "cd_lanterna", n: "Signora Lanterna", i: "🕯️", tr: "cuore", d: "Custode del faro. Parla piano, ascolta tutto, ricorda più di quanto dica.", greet: (a) => `Hai attraversato il molo con il vento in faccia. Siediti: ${a} ha sempre una storia per chi sa aspettare.`, win: "La luce gira per chi si prende un rischio ben calcolato.", lose: "Anche il faro, ogni tanto, si spegne. Poi riparte." },
    tonno: { id: "cd_tonno", n: "Il Barone Tonno", i: "🎩", tr: "furbizia", d: "Re del pesce in scatola, convinto che il mondo sia un listino prezzi.", greet: (a) => `Ah, un giovanotto in ${a}. Io compro, vendo e a volte regalo. Quasi mai l'ultima.`, win: "Affare fatto. Mi rovinerai.", lose: "Vedi? Il listino ha sempre ragione. E ha sempre il mio nome." }
  };
  // ospiti: personaggi di altre saghe, compaiono come carta Personaggio solo se hai già giocato quella saga
  const GUEST = {
    ilse: { id: "qt_ilse", key: "ali-di-rondine.quattordici", n: "Ilse Varga", i: "🧤", tr: "audacia", d: "Dal Torneo dei Quattordici. Parate secche e silenzi lunghi.", greet: (a) => `Ho letto il programma. ${a}, quattordici regole non scritte e una mia. Non restare nelle fasce rosse.`, win: "Bene. Una cosa fatta a regola d'arte.", lose: "Succede. Alla prossima parerai tu." },
    tamburo: { id: "ce_tamburo", key: "ali-di-rondine.cenere", n: "Tamburo", i: "🔧", tr: "furbizia", d: "Da Cenere e Gloria. Aggiusta tutto con due fili e un po' di ostinazione.", greet: (a) => `Ehi, Campione. In ${a} non c'è un libretto di istruzioni, ma ho un cacciavite.`, win: "Perfetto. Funziona. Non toccare niente.", lose: "Sì, è rotto. Ma si ripara. Quasi sempre." },
    tilly: { id: "rt_tilly", key: "ali-di-rondine.tempo", n: "Tilly Verdi", i: "📟", tr: "furbizia", d: "Da Rondine 1938-2038. Parla a velocità di fibra ottica.", greet: (a) => `Ho dieci minuti prima del prossimo guasto del tabellone. ${a}? Perfetto, andiamo.`, win: "Segnato, registrato, backup fatto. Bravo.", lose: "Errore 404: vittoria non trovata. Riprova." }
  };
  const EV = {
    pallone: { n: "Il Pallone Smarrito", i: "⚽", d: "Un pallone prezioso è sparito, e tutti si accusano a vicenda.",
      setup: (p, a) => [[p, "Un pallone è sparito da {a}. Non uno qualunque: quello firmato da tutti i capitani del molo. Si sospetta l'uno dell'altro."], [p, "Io non accuso nessuno. Ma qualcuno prima o poi dovrà mettere la faccia. Tu, per esempio."]],
      ch: [
        { t: "Difendi il sospettato", k: "cuore", ask: "Chi è? Si merita una possibilità.", win: "Provi la sua innocenza con un tiro che nessuno si aspettava: il pallone torna dove doveva. Il sospettato ti dà la mano, a testa bassa.", lose: "Il tiro esce male e il sospettato resta nei guai. Ma l'hai difeso, e qualcuno lo ricorderà." },
        { t: "Cerca le prove", k: "furbizia", ask: "Guardi i dettagli: segatura, impronte, un biglietto.", win: "Le prove portano a un cesto di reti: il pallone era finito lì per un'inezia. Nessuno aveva colpa, tranne la distrazione.", lose: "Le tracce si mescolano: troppa gente ha toccato tutto. Il mistero resta, almeno per oggi." },
        { t: "Sfida tutti a una prova", k: "audacia", ask: "Chi sbaglia paga da bere, chi vince decide.", win: "Vinci davanti a tutti. Il pallone riappare, ironia della sorte, nella tua tasca: qualcuno ve l'aveva infilato per scherzo.", lose: "Perdi davanti a tutti. Paghi da bere. Il pallone riappare lo stesso, per vergogna." }
      ] },
    scommessa: { n: "La Scommessa", i: "🎲", d: "Una scommessa assurda tra il personaggio e un rivale: serve un campione.",
      setup: (p, a) => [[p, "Ho scommesso con un rivale che a {a} chi passa riesce a fare una cosa che lui giura impossibile. Non spiego cosa: sarebbe truccare."], [p, "La posta è seria: un mese di caffè gratis. Se perdo, mi tocca fare l'inchino a mezzogiorno. In piazza."]],
      ch: [
        { t: "Accetta con spavalderia", k: "audacia", ask: "«Impossibile? Mi basta una mano sola.»", win: "Fai la cosa. La piazza ammutolisce, poi applaude. Il rivale fa l'inchino lui, a mezzogiorno, con dignità sospetta.", lose: "Non ce la fai, ma lo fai con stile. Il rivale ti stringe la mano: «Una scommessa onesta, finalmente».", },
        { t: "Chiedi di leggere le regole", k: "furbizia", ask: "Le scommesse si vincono prima di giocarle.", win: "Nel regolamento c'è una clausola che il rivale ha dimenticato. La usi. Nessuno ha da ridire, tranne lui.", lose: "Rileggi tre volte e la clausola non c'è. L'unico errore è stato metterci troppo." },
        { t: "Proponi di dividere la posta", k: "cuore", ask: "Una vittoria condivisa vale più di un inchino.", win: "Il rivale ride per la prima volta in dieci anni. Si divide il caffè: metà a testa, ma il buono resta a te.", lose: "Il rivale rifiuta, offeso. Alla fine si fa lo stesso la prova, e perdi. Ma la proposta, in giro, la sapranno." }
      ] },
    bottiglia: { n: "Il Messaggio nella Bottiglia", i: "💌", d: "Una bottiglia arrivata dal mare con un messaggio per il personaggio.",
      setup: (p, a) => [["voce", "Dal mare arriva una bottiglia, ferma tra gli scogli di {a}."], [p, "Il messaggio è per me. L'ho riconosciuto dalla grafia, dalle gambette storte delle t. Sono... vent'anni che non la vedevo."], [p, "Dice solo: «Il posto è lo stesso. Il tempo no». Vorrei capire. Mi dai una mano?"]],
      ch: [
        { t: "Ascolta in silenzio", k: "cuore", ask: "A volte basta esserci.", win: "Ascolti. Poi, quando il silenzio si assesta, il personaggio ritrova il filo: «Ci vediamo domani, allora». Ti ringrazia con gli occhi lucidi.", lose: "Il silenzio dura troppo, e il personaggio si sente solo. Ma resti, e a volte basta anche questo." },
        { t: "Cerca chi l'ha scritto", k: "furbizia", ask: "Qualcuno, nel porto, riconosce quella calligrafia.", win: "Un vecchio pescatore riconosce la carta: vengono da una lettera spedita da un'isola vicina. Il personaggio sorride: «Domani prendo il primo battello».", lose: "Nessuno sa niente. Il mistero resta, ma almeno la domanda ha cambiato qualcosa." },
        { t: "Parti subito per rispondere", k: "audacia", ask: "Il mare non aspetta, tanto vale salpare.", win: "Salpate, con una barchetta e tanto coraggio. Il mare ti restituisce una risposta prima del tramonto.", lose: "Il mare è più capriccioso del previsto: si torna indietro, bagnati fino all'anima. Ma almeno si è provato." }
      ] },
    tempesta: { n: "La Tempesta in Arrivo", i: "⛈️", d: "Dieci minuti prima della tempesta: bisogna salvare ciò che conta.",
      setup: (p, a) => [["voce", "Il cielo sopra {a} diventa del colore di una lavagna. Il vento gira."], [p, "Dieci minuti. Poi qui sarà tutto sott'acqua. Si salva ciò che conta: ma io non so più cosa conta."], [p, "Decidi tu. Io mi fido, e di solito non mi fido di nessuno."]],
      ch: [
        { t: "Metti in salvo le persone", k: "cuore", ask: "Le cose si ricomprano.", win: "Porti tutti nel porto vecchio. La tempesta arriva e se ne va; sul molo restano reti e secchi, ma nessuno manca.", lose: "Qualcuno è troppo lento, ma si salva. Perdete cose che pesano, e nessuno ve lo fa notare." },
        { t: "Salva il lavoro di una vita", k: "furbizia", ask: "Il registro, il motore, la scorta.", win: "Impacchetti tutto con teli e cime: asciutto, intatto, impeccabile. Chi ti guarda pensa: ma come ha fatto?", lose: "Il telo scivola e il registro si bagna. Non è perso, ma è tutto da ricopiare. Con la tempesta fuori che ride." },
        { t: "Affronta la tempesta", k: "audacia", ask: "Ancorare le barche prima che arrivi.", win: "Le barche restano dove devono, e tu ti prendi un'acqua che ti ricorderai. Il molo applaude dalla finestra.", lose: "Una barca si stacca, un'altra si rovina. Ma ormai ci sei dentro: e il molo sa chi c'era." }
      ] },
    torneo: { n: "Il Torneo dei Tre Minuti", i: "🏆", d: "Una sfida improvvisata a squadre: tre minuti, regole inventate sul momento.",
      setup: (p, a) => [[p, "Qui a {a} ogni tanto scoppia il Torneo dei Tre Minuti: due squadre, un pallone, e le regole le decide l'ultimo che arriva."], [p, "Sei arrivato per ultimo. Ti tocca decidere, e giocare."]],
      ch: [
        { t: "Regola: vince chi ride più forte", k: "cuore", ask: "Il pallone resta a tutti.", win: "Una risata contagiosa, un pallone che rimbalza, tre minuti di gioia e nessuno che conta i gol. Si vince tutti.", lose: "La squadra avversaria si prende la regola sul serio e ride più forte. Si perde, e si ride lo stesso." },
        { t: "Regola: i gol valgono il doppio dopo un trucco", k: "furbizia", ask: "Un trucco al minuto, e il punteggio gira.", win: "Il tuo trucco è così bello che l'avversario applaude. Il punteggio gira, e vi portate a casa il torneo.", lose: "Il trucco sbaglia tempo, e il punteggio gira dall'altra parte. Ma almeno l'hai inventato." },
        { t: "Regola: tre minuti senza sbagli", k: "audacia", ask: "Chi sbaglia esce, e nessuno ha mai tre minuti perfetti.", win: "Tre minuti perfetti, e la banchina trattiene il fiato. Alla fine, silenzio. Poi un boato.", lose: "Sbagli al secondo minuto. Il boato arriva lo stesso, ma per qualcun altro." }
      ] }
  };
  const SF = {
    tempismo: { n: "Colpo preciso", i: "🎯", q: "audacia", d: "Ferma il segnatore nella zona verde. Tre colpi." },
    memoria: { n: "L'ordine dei segnali", i: "🏮", q: "furbizia", d: "Guarda la sequenza di lanterne e ripetila." },
    mira: { n: "Bersagli in volo", i: "🐦", q: "cuore", d: "Tocca i bersagli prima che volino via." },
    tazze: { n: "Occhio alla palla", i: "🥤", q: "furbizia", d: "Segui il pallone sotto le tazze." }
  };
  const TW = {
    doppio: { n: "Il vero premio", i: "💰", d: "Se vinci, la ricompensa raddoppia. Se perdi, un premio di consolazione.", win: "Dalla tasca di {p} spunta una busta: il premio era più grosso di quanto dicesse.", lose: "Dalla tasca di {p} spunta un gettone di consolazione: «Per l'impegno. Non dirlo a nessuno»." },
    alleato: { n: "Il rivale è un alleato", i: "🤝", d: "Chi sembrava un avversario ti dà una mano: cosmetico possibile.", win: "Il rivale ti stringe la mano: «Sapevo che avresti vinto. Ho scommesso su di te». E ti lascia un pensiero.", lose: "Il rivale ti sorride: «Non hai perso: mi hai insegnato qualcosa». E ti lascia un pensiero lo stesso." },
    pallone: { n: "Il pallone che scappa", i: "🎈", d: "Il pallone prende il volo: il premio rotola via, ma ne trovi un altro.", win: "Il pallone rotola giù per il molo, e ti ritrovi a inseguirlo tra la folla. Dentro, un bigliettino con un'altra ricompensa.", lose: "Il pallone rotola via. Lo ritrovi tra i secchi, mezzo sgonfio: dentro c'è, per fortuna, qualcosa." },
    prezzo: { n: "Il prezzo nascosto", i: "🪙", d: "La ricompensa costa: una parte va dove serve davvero.", win: "Una parte del premio va dove serve: la lasci senza pesarla. Ti resta il resto, e un grazie sincero.", lose: "Anche se hai perso, lasci qualcosa dove serve. Qualcuno, un giorno, lo saprà." }
  };

  // ------------------------------------------------------------------ prove giocabili (sovrapposizioni DOM a tutto schermo)
  function prova(kind, qv, done) {
    const ov = document.createElement("div"); ov.id = "cdProva";
    ov.style.cssText = "position:fixed;inset:0;z-index:99990;background:radial-gradient(ellipse at 50% 30%,#1b3550,#07101c 75%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-family:'Trebuchet MS',system-ui,sans-serif;color:#eef6ff;touch-action:none;user-select:none";
    const sf = SF[kind];
    ov.innerHTML = `<div style="font-weight:900;font-size:20px;color:#fde68a">${sf.i} ${esc(sf.n)}</div><div id="cdPd" style="font-size:13px;opacity:.85;max-width:300px;text-align:center">${esc(sf.d)}</div><canvas id="cdPc" width="320" height="200" style="width:min(94vw,520px);aspect-ratio:8/5;height:auto;flex:none;border-radius:14px;box-shadow:0 8px 28px #000a;background:#10263c"></canvas><div id="cdPs" style="font-size:13px;min-height:18px"></div><button id="cdPg" type="button" style="font-size:16px;font-weight:900;padding:12px 30px;border-radius:12px;border:0;background:linear-gradient(#fbbf24,#f59e0b);color:#2a1a00">Via!</button>`;
    document.body.appendChild(ov);
    const cv = ov.querySelector("#cdPc"), g = cv.getContext("2d"), st = ov.querySelector("#cdPs"), btn = ov.querySelector("#cdPg");
    let fin = false, raf = 0, S = null;
    const end = (score) => { if (fin) return; fin = true; cancelAnimationFrame(raf); st.textContent = score >= 0.55 ? "Ben fatto!" : "Peccato…"; btn.style.display = "none"; setTimeout(() => { ov.remove(); done(score); }, 900); };
    window.__carteProva = { state: { kind, get done() { return fin; } }, finish: (sc) => end(sc) };
    const bg = () => { const gr = g.createLinearGradient(0, 0, 0, 200); gr.addColorStop(0, "#16324d"); gr.addColorStop(1, "#0b1a2a"); g.fillStyle = gr; g.fillRect(0, 0, 320, 200); };
    const tap = (fn) => { cv.onpointerdown = (e) => { e.preventDefault(); const r = cv.getBoundingClientRect(); fn((e.clientX - r.left) / r.width * 320, (e.clientY - r.top) / r.height * 200); }; };
    const start = {
      tempismo() { // barra con zona verde che si restringe: premi ora
        let hits = 0, shots = 0, t0 = 0, x = 0, dir = 1, hold = 0, msg = "";
        const w = 30 + qv * 4, sp = 2.2 + Math.max(0, 3 - qv) * 0.2;
        let zx = 40 + Math.random() * 200;
        const draw = () => { bg(); g.fillStyle = "#274b6a"; g.fillRect(20, 120, 280, 26); g.fillStyle = "rgba(52,211,153,.85)"; g.fillRect(zx, 120, w, 26); g.fillStyle = "#fde68a"; g.fillRect(x - 3, 112, 6, 42); g.fillStyle = "#fff"; g.beginPath(); g.arc(160, 60, 22 - (hold ? 4 : 0), 0, 7); g.fill(); g.strokeStyle = "#222"; g.lineWidth = 2; g.stroke(); g.fillStyle = "#fde68a"; g.font = "900 13px sans-serif"; g.textAlign = "center"; g.fillText(`${shots}/3 · centri ${hits}`, 160, 180); g.fillStyle = "#fff"; g.fillText(msg, 160, 100); g.textAlign = "left"; };
        const loop = () => { if (fin) return; x += dir * sp * 3; if (x > 300) { x = 300; dir = -1; } if (x < 20) { x = 20; dir = 1; } if (hold) hold--; draw(); raf = requestAnimationFrame(loop); };
        tap(() => { if (hold || shots >= 3 || fin) return; shots++; const ok = x >= zx && x <= zx + w; if (ok) hits++; msg = ok ? "CENTRO!" : "fuori"; hold = 24; zx = 40 + Math.random() * 200; if (shots >= 3) setTimeout(() => end(hits / 3 + 0.01), 500); });
        loop();
      },
      memoria() { // lanterne colorate in sequenza
        const n = Math.max(3, 6 - Math.floor(qv / 3)), seq = Array.from({ length: n }, () => Math.floor(Math.random() * 4)), cols = ["#ef4444", "#fbbf24", "#22c55e", "#38bdf8"];
        let phase = "show", i = 0, got = 0, lit = -1, okc = 0;
        const draw = () => { bg(); for (let k = 0; k < 4; k++) { const x = 50 + k * 72, on = lit === k; g.fillStyle = "#33485e"; g.fillRect(x - 3, 70, 6, 36); g.fillStyle = on ? cols[k] : "#1a2a3a"; g.beginPath(); g.arc(x, 130, 24, 0, 7); g.fill(); g.strokeStyle = cols[k]; g.lineWidth = 3; g.stroke(); if (on) { const gr = g.createRadialGradient(x, 130, 4, x, 130, 50); gr.addColorStop(0, cols[k] + "cc"); gr.addColorStop(1, cols[k] + "00"); g.fillStyle = gr; g.fillRect(x - 50, 80, 100, 100); } } g.fillStyle = "#fde68a"; g.font = "900 13px sans-serif"; g.textAlign = "center"; g.fillText(phase === "show" ? "Guarda…" : `Tocca: ${got}/${n}`, 160, 40); g.textAlign = "left"; };
        const loop = () => { if (fin) return; draw(); raf = requestAnimationFrame(loop); }; loop();
        const play = (k) => { if (k >= seq.length) { phase = "go"; lit = -1; return; } lit = seq[k]; setTimeout(() => { lit = -1; setTimeout(() => { if (!fin) play(k + 1); }, 220); }, 480); };
        setTimeout(() => play(0), 500);
        tap((x, y) => { if (phase !== "go" || fin) return; const k = Math.round((x - 50) / 72); if (k < 0 || k > 3) return; lit = k; setTimeout(() => (lit = -1), 150); if (k === seq[got]) okc++; got++; if (got >= n) setTimeout(() => end(okc / n), 400); });
      },
      mira() { // uccelli che attraversano il cielo: tocca prima che spariscano
        const T = [], total = 9, need = total; let spawned = 0, hits = 0, gone = 0, last = 0;
        const sp = 0.9 + Math.max(0, 4 - qv) * 0.15;
        const draw = () => { bg(); g.fillStyle = "rgba(255,255,255,.08)"; for (let k = 0; k < 4; k++) g.fillRect((k * 90 + performance.now() / 80) % 380 - 40, 30 + k * 40, 60, 6); T.forEach((t) => { if (t.dead) { g.fillStyle = "#fde68a"; g.font = "900 14px sans-serif"; g.fillText("+", t.x, t.y); return; } g.font = "28px serif"; g.fillText("🐦", t.x - 14, t.y + 10); }); g.fillStyle = "#fde68a"; g.font = "900 13px sans-serif"; g.textAlign = "center"; g.fillText(`Colpiti ${hits} / ${total}`, 160, 190); g.textAlign = "left"; };
        const loop = (ts) => { if (fin) return; if (ts - last > 780 && spawned < total) { last = ts; spawned++; const left = Math.random() < 0.5; T.push({ x: left ? -10 : 330, y: 24 + Math.random() * 120, vx: (left ? 1 : -1) * (sp + Math.random() * 0.8), vy: (Math.random() - 0.5) * 0.6, dead: 0 }); }
          T.forEach((t) => { if (t.dead) { t.dead++; return; } t.x += t.vx * 2; t.y += t.vy; if ((t.x < -30 || t.x > 350) && !t.gone) { t.gone = 1; t.dead = 999; gone++; } });
          if (spawned >= total && T.every((t) => t.dead)) { end(hits / need); return; } draw(); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
        tap((x, y) => { T.forEach((t) => { if (!t.dead && Math.abs(t.x - x) < 24 && Math.abs(t.y - y) < 24) { t.dead = 1; hits++; } }); });
      },
      tazze() { // tre tazze, un pallone: mescola e indovina (3 round)
        let round = 0, correct = 0, ball = 0, pos = [0, 1, 2], phase = "show", swaps = 0, anim = null, pick = -1;
        const sw = Math.max(5, 9 - Math.floor(qv / 2)), dur = 340 + qv * 22;
        const draw = () => { bg(); const lift = phase === "show" ? 26 : phase === "end" ? 26 : 0; for (let c = 0; c < 3; c++) { let px = 80 + pos[c] * 80; if (anim && (c === anim.a || c === anim.b)) { const t = Math.min(1, (performance.now() - anim.t0) / dur), o = c === anim.a ? anim.b : anim.a; px = 80 + (pos[c] + (pos[o] - pos[c]) * t) * 80 - 0; } const isBall = c === ball; if (isBall && lift) { g.fillStyle = "#fff"; g.beginPath(); g.arc(px, 142, 10, 0, 7); g.fill(); } g.fillStyle = "#c2410c"; g.beginPath(); g.moveTo(px - 28, 140 - lift); g.lineTo(px + 28, 140 - lift); g.lineTo(px + 20, 94 - lift); g.lineTo(px - 20, 94 - lift); g.fill(); g.fillStyle = "#fb923c"; g.fillRect(px - 22, 98 - lift, 44, 6); } g.fillStyle = "#fde68a"; g.font = "900 13px sans-serif"; g.textAlign = "center"; g.fillText(phase === "pick" ? `Dov'è il pallone? (${round + 1}/3)` : phase === "shuf" ? "Segui…" : `Round ${round + 1}/3`, 160, 40); g.textAlign = "left"; };
        const loop = () => { if (fin) return; draw(); raf = requestAnimationFrame(loop); }; loop();
        const doSwap = () => { if (swaps >= sw) { phase = "pick"; anim = null; return; } let a = Math.floor(Math.random() * 3), b = (a + 1 + Math.floor(Math.random() * 2)) % 3; anim = { a, b, t0: performance.now() }; setTimeout(() => { const pa = pos[a]; pos[a] = pos[b]; pos[b] = pa; anim = null; swaps++; doSwap(); }, dur); };
        const newRound = () => { pos = [0, 1, 2]; ball = Math.floor(Math.random() * 3); phase = "show"; swaps = 0; setTimeout(() => { phase = "shuf"; doSwap(); }, 900); };
        newRound();
        tap((x) => { if (phase !== "pick" || fin) return; const slot = Math.round((x - 80) / 80); const c = pos.indexOf(slot); if (c < 0) return; if (c === ball) correct++; phase = "end"; setTimeout(() => { round++; if (round >= 3) end(correct / 3); else newRound(); }, 800); });
      }
    };
    btn.onclick = () => { btn.style.display = "none"; st.textContent = ""; start[kind](); };
  }

  // ------------------------------------------------------------------ pesca delle carte (sovrapposizione animata)
  const CSS = `
  .cdOv{position:fixed;inset:0;z-index:99980;background:radial-gradient(ellipse at 50% 40%,#1c6b4a,#0b2c22 70%,#04140f);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:'Trebuchet MS',system-ui,sans-serif;color:#f7f2e3;padding:12px;overflow:auto}
  .cdOv h2{margin:0;font-size:19px;color:#fde68a;text-shadow:0 2px 0 #0008}.cdOv p{margin:0;font-size:12.5px;opacity:.85;text-align:center;max-width:320px}
  .cdRow{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:380px}
  .cdC{width:106px;height:200px;perspective:700px;cursor:pointer;animation:cdDeal .5s both}
  .cdC i{display:block;position:relative;width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d}.cdC.on i{transform:rotateY(180deg)}
  .cdC b,.cdC u{position:absolute;inset:0;border-radius:10px;backface-visibility:hidden;text-decoration:none;box-shadow:0 6px 14px #0009}
  .cdC b{background:repeating-linear-gradient(45deg,#7f1d1d,#7f1d1d 6px,#991b1b 6px,#991b1b 12px);border:3px solid #fde68a;display:flex;align-items:center;justify-content:center;font-size:32px}
  .cdC u{transform:rotateY(180deg);background:linear-gradient(#fffdf5,#f1e6c8);border:3px solid var(--c);color:#2a1a10;display:flex;flex-direction:column;align-items:center;padding:6px 5px;text-align:center}
  .cdC u em{font-style:normal;font-size:9px;font-weight:900;letter-spacing:.06em;color:#fff;background:var(--c);border-radius:6px;padding:2px 7px}
  .cdC u s{text-decoration:none;font-size:38px;margin:6px 0 2px;filter:drop-shadow(0 3px 2px #0004)}.cdC u strong{font-size:11.5px;line-height:1.15}.cdC u span{font-size:9.5px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;opacity:.8;margin-top:3px;line-height:1.15}
  .cdBt{font-size:16px;font-weight:900;padding:12px 28px;border-radius:12px;border:0;background:linear-gradient(#fbbf24,#f59e0b);color:#2a1a00;cursor:pointer}.cdBt.s{background:#244d3d;color:#f7f2e3;font-size:13px;padding:9px 18px}
  @keyframes cdDeal{from{transform:translateY(-120px) rotate(-14deg);opacity:0}to{transform:none;opacity:1}}`;
  function injectCss() { if (document.getElementById("cdCss")) return; const s = document.createElement("style"); s.id = "cdCss"; s.textContent = CSS; document.head.appendChild(s); }
  function cardHtml(type, c, i) { const t = TYPES[type]; return `<div class="cdC" data-i="${i}" style="--c:${t[1]};animation-delay:${i * 0.12}s"><i><b>🎴</b><u><em>${t[0].toUpperCase()}</em><s>${c.i}</s><strong>${esc(c.n)}</strong><span>${esc(c.d || "")}</span></u></i></div>`; }
  function drawOverlay(cards, onGo) {
    injectCss(); document.querySelectorAll(".cdOv").forEach((e) => e.remove());
    const ov = document.createElement("div"); ov.className = "cdOv";
    ov.innerHTML = `<h2>🎴 Le carte del destino</h2><p>Tocca le carte per girarle. Il mazzo ha deciso.</p><div class="cdRow">${["amb", "pg", "ev", "sf", "tw"].map((t, i) => cardHtml(t, cards[t], i)).join("")}</div><button class="cdBt s" id="cdAll" type="button">Gira tutte</button><button class="cdBt" id="cdGo" type="button" style="display:none">Si parte ▸</button>`;
    document.body.appendChild(ov);
    const flip = (el) => { el.classList.add("on"); safe(() => window.__sagaCore && 0); }, check = () => { if (ov.querySelectorAll(".cdC.on").length >= 5) { ov.querySelector("#cdAll").style.display = "none"; ov.querySelector("#cdGo").style.display = ""; } };
    ov.querySelectorAll(".cdC").forEach((el) => (el.onclick = () => { flip(el); check(); }));
    ov.querySelector("#cdAll").onclick = () => { ov.querySelectorAll(".cdC").forEach((el, i) => setTimeout(() => { flip(el); if (i === 4) setTimeout(check, 650); }, i * 160)); };
    ov.querySelector("#cdGo").onclick = () => { ov.remove(); onGo(); };
    window.__carteDraw = { flipAll: () => ov.querySelectorAll(".cdC").forEach(flip) };
  }

  // ------------------------------------------------------------------ configurazione della saga
  const FLOORS = {
    ",": (g, sx, sy, tx, ty, fr, K) => FX.grass(g, sx, sy, tx, ty, fr, K, ["#3f8a52", "#459559", "#ffe9a0"]),
    ":": (g, sx, sy, tx, ty, fr, K) => FX.gravel(g, sx, sy, tx, ty, fr, K, ["#d2c49a", "#c4b588"]),
    "+": (g, sx, sy, tx, ty, fr, K) => FX.cobble(g, sx, sy, tx, ty, fr, K, ["#9a9aa0", "#8a8a92"])
  };
  const E = window.__sagaCore.create({
    id: "carte", key: "ali-di-rondine.carte", title: "Carte del Destino · Cronache del Molo", icon: "🎴", bg: "ct_titolo", chapters: 1,
    menuSub: "Un molo, un mazziere e un mazzo che cambia ogni volta: pesca 5 carte, vivi la storia che ne esce e prova a portare a casa il premio.",
    theme: { accent: "#f59e0b", ink: "#1c1208", paper: "rgba(255,247,226,.96)", font: "'Trebuchet MS', 'Segoe UI', system-ui", chipBg: "#fde68a", chipBorder: "#b45309" },
    stats: { cuore: [0, 9, 2, "Cuore"], audacia: [0, 9, 2, "Audacia"], furbizia: [0, 9, 2, "Furbizia"] },
    regions: {
      molo: { grass: ["#3f8a52", "#459559", "#378248"], path: ["#d2c49a", "#c4b588"], stone: ["#9a9aa0", "#8a8a92"], wall: ["#5a4a3a", "#4e4032"], water: ["#2f7fb0", "#2a74a3"], tree: "#2e6b3a", tint: "255,214,150", tintA: 0.06 },
      mercato: { grass: ["#7aa05a", "#6f9552", "#82a862"], path: ["#d2c49a", "#c4b588"], stone: ["#a8a8ac", "#98989e"], wall: ["#5a4a3a", "#4e4032"], water: ["#2f7fb0", "#2a74a3"], tree: "#2e6b3a", tint: "255,190,140", tintA: 0.08 },
      cantiere: { grass: ["#a8895a", "#9a7c50", "#b6966a"], path: ["#8a6a3e", "#7d5f36"], stone: ["#8a8a8e", "#7a7a80"], wall: ["#4a3a2a", "#3e3022"], water: ["#2f7fb0", "#2a74a3"], tree: "#5a6a3a", tint: "255,220,160", tintA: 0.06 },
      faro: { grass: ["#4f7a4a", "#487244", "#58844f"], path: ["#bdb08a", "#ada07a"], stone: ["#6e7078", "#60626a"], wall: ["#3a3a44", "#2e2e38"], water: ["#27608a", "#225580"], tree: "#2a5a34", tint: "255,140,90", tintA: 0.1 },
      bar: { grass: ["#6a4a2e", "#5e4126", "#745234"], path: ["#8a6a3e", "#7d5f36"], stone: ["#7a5a38", "#6b4e30"], wall: ["#2a1810", "#20120c"], water: ["#2a4a52", "#223c43"], tree: "#3a2c1e", tint: "255,190,110", tintA: 0.1 }
    },
    floors: ".",
    floorPaint(K, f, sx, sy, tx, ty) {
      const rk = K.ZX.rk, fn = FLOORS[f]; if (!fn) return false;
      if (rk === "bar") { FX.planks(K.g, sx, sy, tx, ty, 0, K, ["#6a4a2c", "#5e4126"]); return true; }
      fn(K.g, sx, sy, tx, ty, Math.floor(performance.now() / 16), K); return true;
    },
    solid: "UKHCMSOF",
    paint: {
      U(K, sx, sy, tx, ty) { // tavolo del mazziere, con le carte
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)");
        HD.R(g, sx, sy + 4, 16, 10, "#2f7a4a"); HD.R(g, sx, sy + 4, 16, 2, "#4aa066"); HD.R(g, sx, sy + 12, 16, 2, "#6a4a2c"); HD.R(g, sx + 1, sy + 13, 2, 3, "#4a3220"); HD.R(g, sx + 13, sy + 13, 2, 3, "#4a3220");
        [[3, 6, "#ef4444"], [7, 7, "#fbbf24"], [10, 6, "#38bdf8"]].forEach(([x, y, c], i) => { g.save(); g.translate(sx + x + 2, sy + y + 2); g.rotate((i - 1) * 0.3); HD.R(g, -2.5, -3.5, 5, 7, "#fff7e6"); HD.R(g, -2, -3, 4, 6, c); g.restore(); });
      },
      K(K, sx, sy, tx, ty) { // bancone del bar
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); HD.R(g, sx, sy + 5, 16, 9, "#5a3a22"); HD.R(g, sx, sy + 3, 16, 3, "#8a5a30"); HD.R(g, sx, sy + 3, 16, 1, "#c8904a"); HD.R(g, sx + 2, sy + 8, 12, 4, "rgba(0,0,0,.18)");
        if (tx % 2 === 0) { HD.R(g, sx + 4, sy, 3, 4, "#e5e7eb"); HD.R(g, sx + 5, sy + 1, 1, 2, "#fde68a"); } else { HD.R(g, sx + 9, sy + 1, 4, 3, "#92400e"); }
      },
      H(K, sx, sy, tx, ty) { // scafo di barca in costruzione
        K.ground(sx, sy, tx, ty); const g = K.g, up = (K.ZX.map[ty - 1] || [])[tx] !== "H";
        HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); HD.R(g, sx, sy + (up ? 4 : 0), 16, up ? 10 : 14, "#8a5a30");
        for (let i = 0; i < 4; i++) HD.R(g, sx, sy + (up ? 5 : 1) + i * 3.5, 16, 1, "rgba(0,0,0,.3)"); HD.R(g, sx, sy + (up ? 4 : 0), 16, 1, "#c8904a");
        HD.R(g, sx + 1, sy + 13, 2, 3, "#4a3220"); HD.R(g, sx + 13, sy + 13, 2, 3, "#4a3220");
      },
      C(K, sx, sy, tx, ty) { // gru e pali
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 3, sy + 14, 10, 2, "rgba(0,0,0,.3)"); HD.R(g, sx + 6, sy, 4, 15, "#d4a02a"); for (let i = 0; i < 5; i++) HD.R(g, sx + 6, sy + i * 3, 4, 1, "rgba(0,0,0,.3)"); HD.R(g, sx + 2, sy + 12, 12, 3, "#6b7280");
      },
      M(K, sx, sy, tx, ty, fr) { // faro (base): la torre si alza sopra con later()
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); HD.R(g, sx + 2, sy, 12, 16, "#e8e0d0"); for (let i = 0; i < 4; i++) HD.R(g, sx + 2, sy + i * 4, 12, 2, i % 2 ? "#dc2626" : "#f5f1e6"); HD.R(g, sx + 11, sy, 3, 16, "rgba(0,0,0,.15)");
        if (ty === (K.ZX.map || []).findIndex((r) => r && r.includes("M"))) { const on = Math.sin(fr / 30) > 0; HD.R(g, sx + 1, sy - 6, 14, 6, "#374151"); HD.R(g, sx + 3, sy - 5, 10, 4, on ? "#fff3a0" : "#fde68a"); K.light(sx + 8, sy - 3, 70, "255,235,150", on ? 0.6 : 0.25); }
      },
      S(K, sx, sy, tx, ty) { // bancarella con tenda a righe
        K.ground(sx, sy, tx, ty); const g = K.g, c = [["#dc2626", "#fff7e6"], ["#2563eb", "#fff7e6"], ["#16a34a", "#fff7e6"]][tx % 3];
        HD.R(g, sx, sy + 13, 16, 3, "rgba(0,0,0,.3)"); for (let i = 0; i < 16; i += 4) { HD.R(g, sx + i, sy + 1, 2, 5, c[0]); HD.R(g, sx + i + 2, sy + 1, 2, 5, c[1]); } HD.R(g, sx, sy + 6, 16, 1, "rgba(0,0,0,.3)");
        HD.R(g, sx + 1, sy + 7, 14, 7, "#7a5a3a"); HD.R(g, sx + 1, sy + 7, 14, 1, "#a8844a"); for (let i = 0; i < 4; i++) { HD.R(g, sx + 2 + i * 3.3, sy + 8, 3, 2, ["#60a5fa", "#f87171", "#fbbf24", "#a3e635"][(tx + i) % 4]); }
      },
      O(K, sx, sy, tx, ty) { // casse di pesce e ghiaccio
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 1, sy + 13, 14, 2, "rgba(0,0,0,.3)"); HD.R(g, sx + 1, sy + 6, 14, 8, "#7a5a3a"); HD.R(g, sx + 1, sy + 6, 14, 1, "#a8844a"); HD.R(g, sx + 2, sy + 3, 12, 4, "#dbeafe"); for (let i = 0; i < 3; i++) HD.R(g, sx + 3 + i * 4, sy + 4, 3, 2, ["#93c5fd", "#fca5a5", "#bfdbfe"][i]); HD.R(g, sx + 2, sy + 3, 12, 1, "#fff");
      },
      F(K, sx, sy, tx, ty, fr) { // lanterna da molo
        K.ground(sx, sy, tx, ty); const g = K.g; HD.R(g, sx + 4, sy + 14, 8, 1.5, "rgba(0,0,0,.3)"); HD.R(g, sx + 7, sy + 5, 2, 10, "#3a3a3a"); HD.R(g, sx + 4, sy + 1, 8, 5, "#fcd34d"); HD.R(g, sx + 5, sy + 2, 6, 3, "#fff7d1"); K.light(sx + 8, sy + 4, 36, "255,214,130", 0.5 + Math.sin(fr / 30 + tx) * 0.04);
      }
    },
    act: { U: "Guarda il tavolo", K: "Guarda il bancone", H: "Guarda lo scafo", C: "Guarda la gru", M: "Guarda il faro", S: "Guarda la bancarella", O: "Guarda le casse", F: "Guarda la lanterna", W: "Guarda la finestra", v: "Esci", T: "Guarda il tavolo" },
    travel: true,
    item: ["Gettone del Molo", "Gettoni del Molo"],
    journal: {
      name: "L'Archivio delle carte", sub: "Carte trovate e storie vissute",
      html(K) {
        const seen = (t, id) => K.F.is("cd_s_" + t + "_" + id), m = K.F.get("cd_runs", 0), w = K.F.get("cd_wins", 0);
        const cell = (t, id, c) => seen(t, id) ? `<span style="display:inline-block;margin:2px 4px 2px 0;padding:3px 8px;border-radius:8px;background:${TYPES[t][1]}22;border:1px solid ${TYPES[t][1]}">${c.i} ${esc(c.n)}</span>` : `<span style="display:inline-block;margin:2px 4px 2px 0;padding:3px 8px;border-radius:8px;background:#0002;opacity:.6">🎴 ???</span>`;
        const sect = (t, o) => `<b>${TYPES[t][0]}</b><br>${Object.keys(o).map((k) => cell(t, k, o[k])).join("")}<br>`;
        const log = []; for (let i = 0; i < 8; i++) { const s = K.F.get("cd_story_" + i, ""); if (s) log.push("• " + esc(s)); }
        const tot = Object.keys(AMB).length + Object.keys(PG).length + Object.keys(GUEST).length + Object.keys(EV).length + Object.keys(SF).length + Object.keys(TW).length;
        let n = 0; [["amb", AMB], ["pg", PG], ["pg", GUEST], ["ev", EV], ["sf", SF], ["tw", TW]].forEach(([t, o]) => Object.keys(o).forEach((k) => { if (seen(t, k)) n++; }));
        return `<b>Storie vissute</b>: ${m} · <b>Vinte</b>: ${w} · <b>Carte trovate</b>: ${n}/${tot}<br><br>${sect("amb", AMB)}<br>${sect("pg", Object.assign({}, PG, GUEST))}<br>${sect("ev", EV)}<br>${sect("sf", SF)}<br>${sect("tw", TW)}<br><b>Ultime storie</b><br>${log.join("<br>") || "<span style='opacity:.6'>Nessuna, per ora. Parla con Zio Ormeggio.</span>"}`;
      }
    },
    cameos: []
  });
  window.__carte = E.api; window.__carteProvaStart = prova; window.__carteEV = EV;
  window.__carteCore = E;

  // ------------------------------------------------------------------ il capitolo unico: il molo e le sue storie
  E.api.addChapter((K) => {
    const { F, say, ask, done, setStep } = K, N = 1, S = () => K.stepOf(N), rnd = (n) => Math.floor(Math.random() * n);
    const plaque = (g, t, x, y, c) => HD.D.plaque(g, t, x, y, c);

    K.cast("cd_zio", { name: "Zio Ormeggio", sub: "Mazziere del Molo", style: "messy", hair: "#c8c8c8", beard: "folta", acc: ["cappellino"], eye: "#3a3a2a", skin: "#d9a679", shirt: "#b45309", bg: ["#78350f", "#fbbf24"] }, "Mazziere del Molo da quarant'anni. Dice di aver mescolato il mazzo una volta sola, nel 1983, e di non aver più avuto bisogno di farlo.");
    K.cast("cd_mimmo", { name: "Mimmo il Barista", sub: "Il Bar del Molo", style: "slick", hair: "#2a1a10", acc: ["grembiule"], skin: "#e0b890", eye: "#3a3a2a", shirt: "#f1f5f9", bg: ["#78350f", "#fde68a"] }, PG.mimmo.d);
    K.cast("cd_vela", { name: "Capitana Vela", sub: "Ex navigatrice", style: "ponytail", hair: "#3a2a1a", acc: ["bandana"], skin: "#c68642", eye: "#2a4a6a", shirt: "#1d4ed8", bg: ["#1e3a5f", "#38bdf8"] }, PG.vela.d);
    K.cast("cd_gigi", { name: "Gigi Due-Reti", sub: "Ex portiere", style: "buzz", hair: "#6b7280", acc: ["fascia"], skin: "#d9a679", eye: "#3a3a2a", shirt: "#16a34a", bg: ["#14532d", "#bbf7d0"] }, PG.gigi.d);
    K.cast("cd_lanterna", { name: "Signora Lanterna", sub: "Custode del faro", style: "bun", hair: "#e5e7eb", acc: ["occhiali"], skin: "#e8cdb0", eye: "#4a6a8a", shirt: "#7c2d12", bg: ["#1e1b4b", "#fcd34d"] }, PG.lanterna.d);
    K.cast("cd_tonno", { name: "Il Barone Tonno", sub: "Re del pesce in scatola", style: "slick", hair: "#1a1a1a", acc: ["occhiali"], skin: "#e0b890", eye: "#3a3a2a", shirt: "#6d28d9", bg: ["#4c1d95", "#fbbf24"] }, PG.tonno.d);
    K.cos("cd_c1", { kind: "shirt", label: "Giacca da mazziere", val: "#92400e", from: "Vinci la prima storia delle Carte del Destino" });
    K.cos("cd_c2", { kind: "hairc", label: "Capelli color gettone", val: "#d4a02a", from: "Vinci 3 storie delle Carte del Destino" });
    K.cos("cd_c3", { kind: "acc", label: "Cappellino del Molo", val: "cappellino", from: "Vinci 6 storie delle Carte del Destino" });
    K.cos("cd_c4", { kind: "shirt", label: "Maglia dei Tre Minuti", val: "#0ea5e9", from: "Scopri tutti e 5 i tipi di Evento" });

    // ------- stato della storia (solo flag semplici)
    const cur = () => ({ amb: F.get("cd_amb", ""), pg: F.get("cd_pg", ""), ev: F.get("cd_ev", ""), sf: F.get("cd_sf", ""), tw: F.get("cd_tw", "") });
    const pgOf = (id) => PG[id] || GUEST[id];
    const guestsAvailable = () => Object.keys(GUEST).filter((k) => safe(() => !!K.otherSaga(GUEST[k].key), false));
    const pickFrom = (type, pool) => { const un = pool.filter((k) => !F.is("cd_s_" + type + "_" + k)), from = un.length && Math.random() < 0.75 ? un : pool; return from[rnd(from.length)]; };
    const deal = () => ({ amb: pickFrom("amb", Object.keys(AMB)), pg: pickFrom("pg", Object.keys(PG).concat(guestsAvailable())), ev: pickFrom("ev", Object.keys(EV)), sf: pickFrom("sf", Object.keys(SF)), tw: pickFrom("tw", Object.keys(TW)) });
    const startRun = () => {
      const d = deal(), cards = { amb: AMB[d.amb], pg: pgOf(d.pg), ev: EV[d.ev], sf: SF[d.sf], tw: TW[d.tw] };
      Object.keys(d).forEach((t) => F.set("cd_" + t, d[t])); ["amb", "pg", "ev", "sf", "tw"].forEach((t) => F.set("cd_s_" + t + "_" + d[t], true));
      ["cuore", "audacia", "furbizia"].forEach((k) => K.bond(k, 2 - K.stat(k)));
      const tr = pgOf(d.pg).tr; K.bond(tr, 2);
      drawOverlay(cards, () => { setStep(N, 1); const a = AMB[d.amb]; K.go(a.zone, a.at[0] - 3, a.at[1] + 2); });
    };
    const clearRun = () => { ["amb", "pg", "ev", "sf", "tw"].forEach((t) => F.set("cd_" + t, "")); setStep(N, 0); };
    const fillText = (s, p, a) => String(s).replace(/\{a\}/g, a).replace(/\{p\}/g, p);

    // ------- lo svolgimento di una storia: parla con il personaggio
    function runStory() {
      const c = cur(), p = pgOf(c.pg), ev = EV[c.ev], a = AMB[c.amb], pn = p.n.split(" ")[0] === "Il" || p.n.split(" ")[0] === "La" ? p.n : p.n.split(" ")[0];
      const lines = [[p.id, p.greet(a.n)], ...ev.setup(p.id, a.n).map(([w, t]) => [w, fillText(t, p.n, a.n)])];
      say(lines, () => {
        ask(p.id, `${ev.n}: come la affronti?`, ev.ch.map((ch, i) => ({
          label: ch.t, sub: `${ch.ask} · +Qualità: ${ch.k === "cuore" ? "Cuore" : ch.k === "audacia" ? "Audacia" : "Furbizia"}`, cls: ch.k === p.tr ? "hot" : "",
          fn: () => { K.bond(ch.k, 2); F.set("cd_ch", i); say([["hero", ch.t + "."]], () => beginProva(p, ev, i)); }
        })));
      });
    }
    function beginProva(p, ev, ci) {
      const c = cur(), sf = SF[c.sf], q = K.stat(sf.q);
      say([["voce", `Prova: ${sf.n}. Qualità ${sf.q === "cuore" ? "Cuore" : sf.q === "audacia" ? "Audacia" : "Furbizia"}: ${q}/9.`]], () => {
        done();
        prova(c.sf, q, (score) => finishStory(p, ev, ci, score));
      });
    }
    function finishStory(p, ev, ci, score) {
      const c = cur(), a = AMB[c.amb], tw = TW[c.tw], win = score >= 0.55, ch = ev.ch[ci];
      const lines = [["voce", win ? ch.win : ch.lose], [p.id, win ? p.win : p.lose]];
      lines.push(["voce", `<b>Twist · ${tw.n}.</b> ${fillText(win ? tw.win : tw.lose, p.n, a.n)}`]);
      let coins = 30 + Math.round(score * 40) + K.stat(ch.k) * 3, msg = [];
      if (c.tw === "doppio") coins = win ? coins * 2 : Math.round(coins * 0.5);
      if (c.tw === "prezzo") coins = Math.round(coins * 0.7);
      if (c.tw === "pallone") coins += rnd(25);
      if (!win) coins = Math.round(coins * 0.5);
      const g = K.coinsGive(coins); if (g) msg.push(`+${g} monete`);
      const runs = F.get("cd_runs", 0) + 1, wins = F.get("cd_wins", 0) + (win ? 1 : 0);
      F.set("cd_runs", runs); F.set("cd_wins", wins);
      const cos = [];
      if (win && wins >= 1) cos.push("cd_c1"); if (wins >= 3) cos.push("cd_c2"); if (wins >= 6) cos.push("cd_c3");
      if (c.tw === "alleato" && win) cos.push("cd_c" + (1 + rnd(3)));
      if (["pallone", "scommessa", "bottiglia", "tempesta", "torneo"].every((k) => F.is("cd_s_ev_" + k))) cos.push("cd_c4");
      cos.forEach((id) => K.reward("cd_cos_" + id, { cos: id }).forEach((m) => msg.push(m)));
      // archivio delle storie (ultime 8)
      for (let i = 7; i > 0; i--) F.set("cd_story_" + i, F.get("cd_story_" + (i - 1), ""));
      F.set("cd_story_0", `${win ? "✓" : "✗"} ${ev.n} · ${a.n}`.slice(0, 40));
      lines.push(["voce", `<b>${win ? "STORIA VINTA" : "STORIA PERSA, MA VISSUTA"}.</b> ${msg.join(" · ") || "Nessuna ricompensa, stavolta."}<br>Torni al molo: Zio Ormeggio ha già rimescolato.`]);
      clearRun();
      K.scene(lines, () => { K.go("cd_molo", 14, 12); }, "ct_molo");
    }

    // ------- zone
    const exitH = (L, x, y, w, h, door, to, at) => L.house(x, y, w, h, { door, enter: { to, at } });
    const frame = (L, w, h, ch) => { const { lay } = L; lay(0, 0, w - 1, h - 1, ch || "t"); };
    const talkPg = (K2) => { if (S() === 1 && cur().pg) { const p = pgOf(cur().pg); runStory(); } else { say([["voce", "Non ti sta aspettando nessuno, in questo momento. Parla con Zio Ormeggio, al molo, per pescare le carte."]]); done(); } };
    const pgNpc = (zid, at) => () => (S() === 1 && cur().amb && AMB[cur().amb].zone === zid ? [{ id: pgOf(cur().pg).id, at }] : []);

    const zones = {
      cd_molo: {
        region: "molo", name: "Carte del Destino · Il Molo", short: "Molo", sub: "Barche, gabbiani e un tavolo da gioco con un mazziere", bg: "ct_molo", time: "giorno",
        w: 30, h: 20, start: [14, 12], items: [[6, 12], [24, 13], [20, 16]],
        areas: [[0, 0, 29, 19, "Il Molo delle Carte: dove le storie si pescano a caso"]],
        act: { w: "Guarda il mare", l: "Guarda il lampione", b: "Siediti", n: "Leggi il cartello", t: "Guarda l'albero", u: "Guarda la bancarella" },
        flavor: { n: "«MOLO DELLE CARTE · SI PESCA DALLE DIECI. SI PERDE DA SEMPRE.»", w: "Il mare è calmo. Ogni tanto sbuffa, come uno che ha perso una scommessa.", u: "Una bancarella di limoni. Un cartello: «NON SONO CARTE».", b: "Ti siedi. Un gabbiano ti guarda, valuta, poi decide che non vali un biscotto." },
        intro: [["voce", "Il Molo delle Carte: legno, sale e un mazzo che ha più anni del faro."], ["voce", "Al tavolo, Zio Ormeggio mescola. Ogni storia, qui, comincia con una carta."]],
        npcs: () => [{ id: "cd_zio", at: [14, 13] }],
        build(L) {
          const { lay, put, house } = L;
          frame(L, 30, 20, "t"); lay(1, 1, 28, 3, "w"); lay(1, 4, 28, 18, "+"); lay(13, 1, 16, 6, "="); lay(1, 15, 8, 18, ","); lay(22, 15, 28, 18, ",");
          lay(2, 11, 27, 11, ":"); lay(14, 7, 14, 18, ":");
          house(3, 5, 7, 5, { door: [6, 9], roof: "#8a3a2a", wall: "#e8d8b0", rr: 2, lit: true, enter: { to: "cd_bar", at: [8, 9] } });
          house(21, 5, 7, 5, { door: [24, 9], roof: "#2a4a7a", wall: "#d8e0e8", rr: 2, lit: true, enter: "La rimessa delle barche. Dentro, remi, reti e una barca con scritto «NON SI TOCCA» in sette lingue." });
          put(15, 13, "U"); put(11, 10, "l"); put(18, 10, "l"); put(10, 13, "b"); put(19, 13, "b"); put(13, 8, "n"); put(6, 14, "u"); put(7, 14, "u");
          [[2, 15], [3, 16], [26, 16], [27, 15], [1, 18], [28, 18]].forEach(([x, y]) => put(x, y, "t"));
          exitH(L, 29, 10, 1, 3, [29, 11], "cd_mercato", [2, 9]); exitH(L, 0, 10, 1, 3, [0, 11], "cd_faro", [21, 9]); exitH(L, 14, 19, 3, 1, [15, 19], "cd_cantiere", [12, 2]);
        },
        decor(g, cx, cy, d) { plaque(g, "MOLO DELLE CARTE", d.X(14) + 8, d.Y(4) - 4, "#fbbf24"); plaque(g, "BAR", d.X(6) + 8, d.Y(5) - 2, "#f87171"); plaque(g, "MERCATO →", d.X(29) - 6, d.Y(10) - 4, "#38bdf8"); plaque(g, "← FARO", d.X(1) + 8, d.Y(10) - 4, "#fcd34d"); plaque(g, "CANTIERE ↓", d.X(15) + 8, d.Y(19) - 6, "#a3e635"); HD.D.beam(g, d.X(15) + 8, d.Y(0), 30, 90, "255,230,170", 0.12); }
      },
      cd_bar: {
        interior: true, region: "bar", name: "Carte del Destino · Il Bar del Molo", short: "Bar del Molo", sub: "Caffè, scommesse e una lavagna con i prezzi sbagliati", bg: "ct_bar", time: "sera", w: 16, h: 12, start: [8, 9], outside: ["cd_molo", 6, 10], items: [[13, 8]],
        act: { v: "Esci", K: "Guarda il bancone", T: "Guarda il tavolo", L: "Guarda le bottiglie", W: "Guarda la finestra" },
        flavor: { K: "Il bancone: tre macchie, un gettone, e un biglietto: «CHI LEGGE PAGA».", T: "Un tavolino con una scacchiera, mezza partita e due contendenti addormentati.", L: "Una parete di bottiglie, per metà vuote, per metà «per i clienti importanti».", W: "Dalla finestra si vede il molo e un gabbiano che sorveglia il tavolo del mazziere." },
        intro: [["voce", "Il Bar del Molo profuma di caffè e di scommesse. Alla radio, una canzone che nessuno ricorda e tutti cantano."]],
        npcs: pgNpc("cd_bar", [8, 5]),
        build(L) { const { lay, put } = L; lay(0, 0, 15, 11, "+"); lay(0, 0, 15, 1, "a"); lay(0, 0, 0, 11, "a"); lay(15, 0, 15, 11, "a"); lay(0, 11, 15, 11, "a"); put(8, 11, "v"); lay(3, 1, 12, 1, "L"); lay(3, 3, 12, 3, "K"); lay(3, 7, 4, 7, "T"); lay(11, 7, 12, 7, "T"); put(1, 1, "W"); put(14, 1, "W"); },
        decor(g, cx, cy, d) { plaque(g, "BAR DEL MOLO", d.X(8) + 8, d.Y(1) + 4, "#fbbf24"); g.save(); g.globalCompositeOperation = "lighter"; [4, 8, 12].forEach((x, i) => { const gr = g.createRadialGradient(d.X(x) + 8, d.Y(3) - 14, 1, d.X(x) + 8, d.Y(3) - 14, 40); gr.addColorStop(0, "rgba(255,200,120,.35)"); gr.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = gr; g.fillRect(d.X(x) - 32, d.Y(3) - 54, 80, 80); }); g.restore(); }
      },
      cd_mercato: {
        region: "mercato", name: "Carte del Destino · Il Mercato del Pesce", short: "Mercato", sub: "Ghiaccio, prezzi gridati e un gabbiano che conosce il listino", bg: "ct_mercato", time: "alba", w: 24, h: 16, start: [2, 9], items: [[7, 11], [18, 11]],
        act: { S: "Guarda la bancarella", O: "Guarda le casse", w: "Guarda il mare", l: "Guarda il lampione" },
        flavor: { S: "Una bancarella con il cartello «OGGI SOLO PESCE VERO».", O: "Casse di pesce nel ghiaccio. Una ha scritto «NON È QUESTA».", w: "Il mare: tutto il pesce che non è nelle casse." },
        intro: [["voce", "Il Mercato del Pesce, all'alba: ghiaccio, grida, un odore che è un biglietto da visita."]],
        npcs: pgNpc("cd_mercato", [12, 8]),
        build(L) { const { lay, put, house } = L; frame(L, 24, 16, "t"); lay(1, 1, 22, 3, "w"); lay(1, 4, 22, 14, "+"); lay(1, 9, 22, 9, ":"); lay(3, 5, 7, 5, "S"); lay(10, 5, 14, 5, "S"); lay(17, 5, 21, 5, "S"); lay(3, 6, 5, 6, "O"); lay(11, 6, 13, 6, "O"); lay(18, 6, 20, 6, "O"); put(4, 12, "l"); put(19, 12, "l"); lay(7, 13, 9, 13, "O"); exitH(L, 0, 8, 1, 3, [0, 9], "cd_molo", [27, 11]); },
        decor(g, cx, cy, d) { plaque(g, "MERCATO DEL PESCE", d.X(12) + 8, d.Y(4) - 2, "#38bdf8"); plaque(g, "← MOLO", d.X(1) + 8, d.Y(9) - 4); HD.D.motes(g, d.fr, 10, "220,240,255", 0.5); }
      },
      cd_cantiere: {
        region: "cantiere", name: "Carte del Destino · Il Cantiere Navale", short: "Cantiere", sub: "Scafi a metà, segatura e una gru che cigola a ogni vento", bg: "ct_cantiere", time: "giorno", w: 24, h: 16, start: [12, 2], items: [[5, 11], [19, 11]],
        act: { H: "Guarda lo scafo", C: "Guarda la gru", z: "Guarda le casse", f: "Guarda la staccionata" },
        flavor: { H: "Uno scafo a metà: sembra una balena che ha cambiato idea.", C: "Una gru. Cigola in tre note, a seconda del vento.", z: "Casse di chiodi, corde e, in fondo, un panino che qualcuno ha dimenticato." },
        intro: [["voce", "Il Cantiere Navale: odore di resina, rumore di martelli, un cane che dorme sotto una barca."]],
        npcs: pgNpc("cd_cantiere", [12, 8]),
        build(L) { const { lay, put } = L; frame(L, 24, 16, "t"); lay(1, 1, 22, 14, ","); lay(1, 1, 22, 4, "+"); lay(11, 1, 13, 14, ":"); lay(2, 6, 8, 8, "H"); lay(15, 6, 21, 8, "H"); put(1, 5, "C"); put(22, 5, "C"); lay(3, 12, 5, 13, "z"); lay(17, 12, 20, 13, "z"); lay(8, 11, 10, 11, "f"); lay(14, 11, 16, 11, "f"); exitH(L, 11, 0, 3, 1, [12, 0], "cd_molo", [15, 17]); },
        decor(g, cx, cy, d) { plaque(g, "CANTIERE NAVALE", d.X(12) + 8, d.Y(4) - 2, "#a3e635"); plaque(g, "↑ MOLO", d.X(12) + 8, d.Y(0) + 14); HD.D.motes(g, d.fr, 14, "240,210,150", 0.5); }
      },
      cd_faro: {
        region: "faro", name: "Carte del Destino · Il Faro", short: "Faro", sub: "Scogli, vento e una luce che gira per chi non la guarda", bg: "ct_faro", time: "tramonto", w: 24, h: 16, start: [21, 9], items: [[6, 8], [18, 8]],
        act: { M: "Guarda il faro", r: "Guarda lo scoglio", w: "Guarda il mare", t: "Guarda l'albero" },
        flavor: { M: "Il faro: bianco e rosso come un caramello alto quaranta metri. In cima, la luce, che non si ferma mai.", r: "Uno scoglio. Qualcuno ci ha scritto «ANCHE QUI» con un gesso, con speranza." },
        intro: [["voce", "Il faro, al tramonto: il cielo prende fuoco, il mare gli risponde, e la luce comincia a girare."]],
        npcs: pgNpc("cd_faro", [11, 8]),
        build(L) { const { lay, put } = L; frame(L, 24, 16, "t"); lay(1, 1, 22, 14, ","); lay(1, 11, 22, 14, "w"); lay(1, 1, 22, 2, "w"); lay(2, 9, 22, 9, ":"); lay(9, 2, 10, 7, "M"); lay(14, 5, 15, 6, "r"); lay(4, 4, 5, 5, "r"); lay(18, 10, 19, 10, "r"); [[2, 3], [3, 6], [20, 4], [21, 6]].forEach(([x, y]) => put(x, y, "t")); exitH(L, 23, 8, 1, 3, [23, 9], "cd_molo", [2, 11]); },
        decor(g, cx, cy, d) { plaque(g, "IL FARO", d.X(10) + 8, d.Y(1) + 2, "#fcd34d"); plaque(g, "MOLO →", d.X(22) - 4, d.Y(9) - 4); const a = d.fr / 60; g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createLinearGradient(d.X(10) + 8, d.Y(1), d.X(10) + 8 + Math.cos(a) * 160, d.Y(1) + Math.sin(a) * 60); gr.addColorStop(0, "rgba(255,240,160,.35)"); gr.addColorStop(1, "rgba(255,240,160,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(d.X(10) + 8, d.Y(1)); g.lineTo(d.X(10) + 8 + Math.cos(a - 0.12) * 200, d.Y(1) + Math.sin(a - 0.12) * 80); g.lineTo(d.X(10) + 8 + Math.cos(a + 0.12) * 200, d.Y(1) + Math.sin(a + 0.12) * 80); g.fill(); g.restore(); }
      }
    };

    // ------- dialoghi
    const talk = {
      cd_zio(K2) {
        const s = S();
        if (s === 1 && cur().amb) { say([["cd_zio", `Hai già le carte: ${AMB[cur().amb].n}, ${pgOf(cur().pg).n}. Che fai ancora qui? La storia non si vive da sola.`]]); done(); return; }
        say([["cd_zio", F.get("cd_runs", 0) ? "Ancora tu. Le carte non si stancano, io sì. Ma mescolo volentieri." : "Benvenuto al Molo delle Carte. Cinque carte, una storia. Non te la racconto: la peschi tu."]], () => {
          ask("cd_zio", "Che facciamo?", [
            { label: "🎴 Pesca 5 carte", sub: "Luogo, personaggio, evento, prova, twist", cls: "hot", fn: () => { done(); startRun(); } },
            { label: "❓ Come funziona", fn: () => say([["cd_zio", "Pesco cinque carte. Il Luogo è dove si va, il Personaggio chi ti aspetta, l'Evento cosa succede. Poi scegli come affrontarlo: ogni scelta ti fa crescere Cuore, Audacia o Furbizia."], ["cd_zio", "La Prova si gioca davvero: più sei forte nella qualità giusta, più è facile. Il Twist ribalta la ricompensa. Premi: monete e cosmetici."]], done) },
            { label: "Lascia stare", fn: done }
          ]);
        });
      }
    };
    Object.keys(PG).forEach((k) => (talk[PG[k].id] = talkPg)); Object.keys(GUEST).forEach((k) => (talk[GUEST[k].id] = talkPg));

    return {
      n: N, title: "Il Molo delle Carte", sub: "Pesca 5 carte, vivi la storia, prendi il premio.", start: "cd_molo", introBg: "ct_titolo", zones, talk,
      goal: (s) => (s === 1 ? "Hai pescato le carte. Vai nel luogo estratto e parla con il personaggio." : "Parla con Zio Ormeggio, al tavolo del molo, per pescare le carte."),
      intro: () => [["voce", "Un molo, un tavolo verde, un mazzo che ha visto più storie del faro."], ["voce", "Cinque carte, una storia: la peschi tu."]]
    };
  });
})();
