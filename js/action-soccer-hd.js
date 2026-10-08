// js/action-soccer-hd.js - Action Soccer 2D HD · "Coppa del Molo"
// Partita 5v5 a campo aperto, vista dall'alto con aftertouch, Tiro della Rondine e Intesa Leo-Nico.
// Entry: window.openActionSoccerHD(onExit)  ·  API estesa: window.__actionHd.start({mode, onExit})
// Modalità: torneo, partita libera, sopravvivenza, sfida a tempo, rigori, calci piazzati, allenamento,
// campionato, coppa a eliminazione, sfide giornaliere, squadra, look, tattiche, diario della Coppa.
// Chiavi proprie: ali-di-rondine.action-hd-{prefs,meta,best,season,cup,daily,team,look}; le vecchie
// (progress, settings) restano intatte. Le monete passano solo da window.addCoins, una volta per traguardo.
(function () {
  "use strict";

  // ---------------------------------------------------------------- costanti
  const KEY_PROG = "ali-di-rondine.action-hd-progress";
  const KEY_SET = "ali-di-rondine.action-hd-settings";
  const DEBUG = /[?&]debug/.test(location.search || "");

  const W = 1200, H = 750;
  const XL = 50, XR = 1150, YT = 40, YB = 710, LEN = XR - XL;
  const GM = 375, GH = 150, GT = GM - GH / 2, GB = GM + GH / 2;
  const BOX_D = 170, BOX_T = 195, BOX_B = 555;
  const STEP = 1 / 60;
  const MATCH_SECS = 100, HALF_SECS = 50, GOLDEN_SECS = 30;
  const FR = 0.982; // attrito palla a terra per frame

  // ---------------------------------------------------------------- dati
  const OPPS = [
    {
      name: "Gabbiani del Porto", tag: "GAB", kit: "#e2e8f0", kit2: "#facc15", gk: "#a3e635", spd: 0.93, tkl: 0.75, press: 190, line: 0.0, shoot: 300,
      names: ["Pinna", "Beccaccia", "Frittella", "Il Rubacuori", "Squarcio"],
      hint: "Rubano tutto ciò che è fritto e, a quanto pare, anche la palla. Fanno più rumore che gioco.",
      win: "Un gabbiano ti ruba il panino dalla borsa mentre esulti. Un pareggio morale: 1-1 e palla al centro.",
    },
    {
      name: "Corsari della Banchina", tag: "COR", kit: "#1f2937", kit2: "#f97316", gk: "#f472b6", spd: 0.98, tkl: 1.25, press: 200, line: 0.02, shoot: 320,
      names: ["Uncino", "Barbarossa", "Scialuppa", "Capitan Cima", "Moschettone"],
      hint: "Contrasti da scaricatori di porto. Il loro capitano dice di aver perso un occhio in una partita a carte. Non è vero, ha solo l'orzaiolo.",
      win: "Capitan Cima ti stringe la mano e ti lascia un pezzo di sagola: «Per le prossime scarpe». Ha il cuore grosso quanto le braccia.",
    },
    {
      name: "Murene di Scoglio Rosso", tag: "MUR", kit: "#15803d", kit2: "#e879f9", gk: "#fde047", spd: 1.0, tkl: 1.0, press: 240, line: 0.06, shoot: 330,
      names: ["Fondale", "Zanna", "Rostro", "Il Moray", "Guizzo"],
      hint: "Pressing altissimo: ti saltano addosso appena pensi di avere la palla. Si dice che in spogliatoio dormano a bocca aperta.",
      win: "Le Murene si congratulano in coro, a bocca spalancata. Non è un complimento: è solo il loro modo di respirare.",
    },
    {
      name: "Dopolavoro Ferroviario", tag: "DOP", kit: "#7f1d1d", kit2: "#fde68a", gk: "#38bdf8", spd: 1.0, tkl: 1.0, press: 150, line: -0.1, shoot: 280,
      names: ["Cassetta", "Binario", "Deviatoio", "Capostazione", "Fischietto"],
      hint: "Catenaccio puro: otto fischi di fila, cinque bandierine, zero spazi. L'ultimo treno per il Molo passa qui da quarant'anni.",
      win: "Il capostazione, che ha sempre fischiato partenze, stavolta fischia la tua. «Vai, ragazzo. Questo è l'ultimo binario libero.» Nessuno ride.",
    },
    {
      name: "Il Gran Fanale", tag: "FAN", kit: "#fbbf24", kit2: "#1e3a8a", gk: "#fb7185", spd: 1.05, tkl: 1.1, press: 250, line: 0.05, shoot: 340,
      names: ["Lucignolo", "Fiammella", "Marea", "Bussola", "Zio Ormeggio"],
      hint: "Una delle squadre più antiche del Molo. Il capitano, Zio Ormeggio, gioca scalzo dal 1987 e non sbaglia un passaggio di sguardo.",
      win: "Zio Ormeggio si siede sull'argine, si toglie il cappello e applaude da solo. Non l'aveva mai fatto con nessuno. Il Molo, per una volta, tace.",
    },
  ];
  const STAR_COINS = [2, 2, 3, 4, 5]; // 16 monete totali, solo alla prima vittoria
  const DIFFS = [
    // gr = frame di reazione del portiere al tiro, gd = velocità di tuffo, ge = errore di lettura (px), rd = probabilità di leggere il tiro, pr = lettura del rigore
    { n: "Facile", spd: 0.9, react: 22, tkl: 0.022, reach: 13, gk: 2.5, noise: 62, usr: 1.05, gr: 11, gd: 4.6, ge: 18, rd: 0.02, pr: 0.15 },
    { n: "Normale", spd: 0.97, react: 14, tkl: 0.035, reach: 18, gk: 3.2, noise: 40, usr: 1.0, gr: 8, gd: 5.8, ge: 14, rd: 0.08, pr: 0.25 },
    { n: "Duro", spd: 1.04, react: 8, tkl: 0.055, reach: 21, gk: 3.8, noise: 22, usr: 1.0, gr: 5, gd: 7.2, ge: 10, rd: 0.25, pr: 0.42 },
  ];
  const ROLES = [
    { r: "GK", u: 0.02, v: 0.5, spd: 3.1 },
    { r: "DEF", u: 0.22, v: 0.27, spd: 3.75 },
    { r: "DEF", u: 0.22, v: 0.73, spd: 3.75 },
    { r: "MID", u: 0.44, v: 0.5, spd: 4.05 },
    { r: "FWD", u: 0.66, v: 0.5, spd: 4.15 },
  ];
  const HOME_NAMES = ["Sandro", "Chicco", "Baciccia Jr", "Leo", "Nico"];

  // ---------------------------------------------------------------- dati estesi: squadre, cast, battute
  const XOPPS = [
    {
      name: "Fornai della Salita", tag: "FOR", kit: "#f5e6c8", kit2: "#92400e", gk: "#60a5fa", spd: 1.0, tkl: 1.0, press: 205, line: 0.0, shoot: 310,
      names: ["Lievito", "Mattarello", "Pagnotta", "Biga", "Infornata"],
      hint: "Si allenano alle quattro del mattino e giocano come lievita la pasta: piano, poi tutto insieme. Hanno sempre un po' di farina sulle maglie.",
      win: "I Fornai ti regalano un sacchetto di grissini ancora tiepidi. «Per le prossime partite. Il pane non si vende ai vincitori: si offre.»",
    },
    {
      name: "Lampare di Capo Ventoso", tag: "LAM", kit: "#0e7490", kit2: "#fef08a", gk: "#f97316", spd: 1.02, tkl: 1.05, press: 215, line: 0.03, shoot: 325,
      names: ["Lampara", "Calamaro", "Seppia", "Totano", "Fanalino"],
      hint: "Pescatori di notte, attaccanti di sera. Giocano con la luce negli occhi e con il mare nelle caviglie: contrasti salati.",
      win: "Una lampara ti accende il viso: «Tieni il lume, ragazzo. Di notte il campo si trova seguendo chi non ha paura del buio.»",
    },
  ];
  const ALLT = OPPS.concat(XOPPS); // tutte le squadre del Molo (7)
  const STRN = [0.85, 1.05, 1.0, 0.9, 1.3, 0.95, 1.1]; // forza per le partite simulate (stesso ordine di ALLT)
  const PRE = { // battute prima del fischio, a rotazione
    GAB: ["Ginetta: «Mettete al sicuro i panini. Tutti. Anche quelli che non avete ancora comprato.»", "Arturo: «Dalla cabina vedo i gabbiani in tribuna. Hanno già l'aria di chi ha un parere.»"],
    COR: ["Ginetta: «Contrasti puliti, per favore. Il Capitano dice che l'occhio è a posto. L'orzaiolo no.»", "Arturo: «I Corsari entrano in campo con la bandana. Scelta stilistica o semplice abitudine, mah.»"],
    MUR: ["Signora Pina: «Fate gol subito, che dopo si addormentano. A bocca aperta, poverini. Lo scrivo sul Corriere.»", "Arturo: «Le Murene sbadigliano e già fanno paura. Immaginate quando sono sveglie.»"],
    DOP: ["Il Capostazione: «Fischio di partenza. Poi li guardo passare uno a uno, come i treni.»", "Arturo: «Il Dopolavoro schiera otto giocatori in difesa. Per essere in cinque, è un traguardo.»"],
    FAN: ["Zio Ormeggio, senza scarpe: «Il campo l'ho sentito con i piedi. Stasera ha voglia di giocare.»", "Arturo: «Il Gran Fanale: l'unica squadra che segna e chiede scusa al pallone.»"],
    FOR: ["Nando: «Ho portato il fritto ai Fornai. Mi hanno portato la focaccia. Siamo pari.»", "Arturo: «I Fornai hanno la farina nei capelli. A fine partita non sapremo se siamo sporchi o benedetti.»"],
    LAM: ["Ginetta: «Le Lampare arrivano dal mare, e il mare non è mai puntuale. Fischio quando tutti sono qui.»", "Arturo: «Sulla fascia destra una lampara. Sulla sinistra, il buio. Il mare sembra d'accordo.»"],
  };
  const QUIP = {
    start: ["Radio Molo, buonasera. Il vento è a favore di chi ha il vento a favore.", "Radio Molo in diretta. L'audio arriva a tratti, la fiducia sempre.", "Qui Arturo dalla cabina: il pallone è rotondo, il Molo è storto."],
    goalFor: ["Gol! La rete ha ricevuto e la rete non si è opposta.", "Una rete così non si vedeva dai tempi delle reti vere.", "Nando alza il mestolo: approvato!", "Tecnica, coraggio e un gabbiano che non c'entra niente."],
    goalAg: ["Gol avversario. Il portiere dice che era già in volo, ma verso un'altra idea.", "Si è aperta la porta. Come sempre, dall'interno.", "Un gol subito fa bene al carattere. Il secondo fa male al fritto."],
    save: ["Che parata! Sandro ha la faccia di chi ha già visto tutto.", "Il portiere ci mette la faccia. Anche le mani, per fortuna.", "Salvataggio! Il pubblico, tre persone, esulta in due."],
    post: ["Il palo! Dura da anni, come la vernice.", "Palo pieno. Il Molo ringrazia: era la parte che reggeva."],
    half: ["Intervallo: il vento cambia lato, noi no.", "Pausa. Nando distribuisce il fritto, la Signora Pina le opinioni."],
    level: ["Arriva un'altra ondata. Il Molo è fatto per le onde.", "Si alza il livello. Si abbassa il morale. Va bene così."],
  };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const quip = (k) => "🎙 " + pick(QUIP[k]);

  // compagni di squadra: 3 slot variabili (portiere, due difensori), Leo e Nico restano fissi (Intesa)
  const MATES = [
    { id: "sandro", name: "Sandro", slot: 0, mods: {}, desc: "Il portiere di sempre. Para con la faccia di chi ha visto tre generazioni di palloni.", req: null, hint: "" },
    { id: "ondina", name: "Ondina", slot: 0, mods: { reach: 1.12 }, desc: "Portiera di Punta Nera. Arriva prima della palla e poi dice di avere avuto ragione. Parata +12%.", req: () => X.meta.seasonMd >= 3, hint: "Gioca 3 giornate di campionato" },
    { id: "chicco", name: "Chicco", slot: 1, mods: {}, desc: "Sempre affamato, sempre al suo posto. Soprattutto se il suo posto è vicino al fritto.", req: null, hint: "" },
    { id: "bj", name: "Baciccia Jr", slot: 1, mods: {}, desc: "Il nipote del Baciccia. Ha ereditato il cappello e il carattere. Il cappello gli sta meglio.", req: null, hint: "" },
    { id: "mattia", name: "Mattia la Saracinesca", slot: 1, mods: { tkl: 1.35 }, desc: "Si abbassa come una serranda e a quel punto nessuno passa. Contrasti +35%.", req: () => PROG.stars[1] > 0, hint: "Batti i Corsari della Banchina" },
    { id: "kevin", name: "Kevin del Pedalò", slot: 1, mods: { spd: 1.04 }, desc: "Ha le gambe di chi pedala tutta l'estate senza arrivare mai da nessuna parte. Qui arriva. Velocità +4%.", req: () => PROG.stars[2] > 0, hint: "Batti le Murene di Scoglio Rosso" },
    { id: "bue", name: "Il Bue", slot: 1, mods: { tkl: 1.2, spd: 0.98 }, desc: "Lento, saldo, inamovibile. Contrasti +20%, un po' meno rapido.", req: () => X.meta.cupsPlayed >= 1, hint: "Gioca una Coppa del Molo" },
    { id: "morena", name: "Morena", slot: 1, mods: { spd: 1.03, tkl: 1.1 }, desc: "Ha il passo del pescatore all'alba: silenzioso, preciso, mai fuori tempo. Velocità +3%, contrasti +10%.", req: () => X.meta.seasonsDone >= 1, hint: "Concludi una stagione di campionato" },
  ];
  // ---------------------------------------------------------------- carte dell'album (Borgo · "Carte dei personaggi")
  // Solo i personaggi con nome ricorrente. BIO/CAST si registrano appena esiste window.__borgoApi (game.js si carica dopo);
  // la carta si sblocca con seeCard() soltanto quando il personaggio viene incontrato. Senza Borgo non succede nulla.
  const HDC = {
    ac_cima: { n: "Capitan Cima", h: "#1f1a17", s: "buzz", k: "#c68642", c: "#1f2937", c2: "#f97316", x: { beard: true }, bio: "Capitano dei Corsari della Banchina: giura di aver perso un occhio in una partita a carte, ma ha solo l'orzaiolo. Ha il cuore grosso quanto le braccia e regala pezzi di sagola «per le prossime scarpe»." },
    ac_ormeggio: { n: "Zio Ormeggio", h: "#d8d4cc", s: "messy", k: "#d9a57a", c: "#fbbf24", c2: "#1e3a8a", x: { beard: true }, bio: "Capitano del Gran Fanale: gioca scalzo dal 1987 e non sbaglia un passaggio di sguardo. In campo si muove poco e illumina molto, come i fari di una volta." },
    ac_capostazione: { n: "Il Capostazione", h: "#2a2a2a", s: "slick", k: "#e0b48a", c: "#7f1d1d", c2: "#fde68a", x: { cap: "#7f1d1d" }, bio: "Guida il Dopolavoro Ferroviario con un catenaccio da otto fischi di fila e cinque bandierine. Ha fischiato partenze per quarant'anni e dice di sentire i treni anche quando non passano." },
    hd_sandro: { n: "Sandro", h: "#3a2a1a", s: "buzz", k: "#d9a57a", c: "#a3e635", c2: "#1d4ed8", bio: "Il portiere di sempre: para con la faccia di chi ha visto tre generazioni di palloni. Nessuno lo ha mai sentito commentare un gol subito, e questo lo rende l'uomo più misterioso del Molo." },
    hd_chicco: { n: "Chicco", h: "#4a3a2a", s: "messy", k: "#e8b88c", c: "#1d4ed8", c2: "#7dd3fc", bio: "Sempre affamato, sempre al suo posto, soprattutto se il posto è vicino al fritto. In difesa si muove attorno agli attaccanti come attorno a un buffet." },
    hd_bj: { n: "Baciccia Jr", h: "#8a8a8a", s: "messy", k: "#e0b48a", c: "#1d4ed8", c2: "#7dd3fc", x: { cap: "#26324a" }, bio: "Il nipote del Baciccia: ha ereditato il cappello e il carattere, e il cappello gli sta meglio. Aspetta il pallone con la stessa pazienza con cui il nonno aspetta il pesce." },
    hd_morena: { n: "Morena", h: "#2a1a10", s: "codino", k: "#d9a57a", c: "#1d4ed8", c2: "#7dd3fc", bio: "Ha il passo del pescatore all'alba: silenzioso, preciso, mai fuori tempo. Quando recupera un pallone sembra che lo stia solo ritirando da una rete." },
    hd_bue: { n: "Il Bue", h: "#1a1a1a", s: "buzz", k: "#c68642", c: "#1d4ed8", c2: "#7dd3fc", bio: "Lento, saldo, inamovibile: in difesa non lo si scarta, se ne prende atto. Ha anche un nome vero, ma nessuno lo ricorda e lui non ha mai fatto una piega." }
  };
  let hdcOk = false;
  function hdcReg() {
    if (hdcOk) return true;
    const a = window.__borgoApi;
    if (!a || !a.BIO || !a.CAST || typeof a.seeCard !== "function") return false;
    Object.keys(HDC).forEach((id) => {
      const d = HDC[id];
      if (!a.BIO[id]) a.BIO[id] = d.bio;
      if (!a.CAST[id]) a.CAST[id] = { name: d.n, tag: "", hair: d.h, style: d.s, skin: d.k, eye: "#2a2a2a", bg: [d.c, d.c2], shirt: d.c, ...(d.x || {}) };
    });
    hdcOk = true; return true;
  }
  (function hdcWait(n) { try { if (!hdcReg() && n < 120) setTimeout(() => hdcWait(n + 1), 250); } catch (e) { /* ignora */ } })(0);
  function meet(ids) { try { if (!hdcReg()) return; [].concat(ids).forEach((id) => { if (id) window.__borgoApi.seeCard(id); }); } catch (e) { /* ignora */ } }
  // squadra avversaria (tag) -> carte; compagno (id MATES) -> carta (ondina, mattia e kevin sono carte già esistenti del Borgo)
  const HDC_TEAM = { COR: ["ac_cima"], FAN: ["ac_ormeggio"], DOP: ["ac_capostazione"] };
  const HDC_MATE = { sandro: "hd_sandro", chicco: "hd_chicco", bj: "hd_bj", morena: "hd_morena", bue: "hd_bue", ondina: "ondina", mattia: "mattia", kevin: "kevin" };
  const KITS = [
    { id: "blu", name: "Blu Rondine", k: "#1d4ed8", k2: "#7dd3fc", cost: 0 },
    { id: "rosso", name: "Rosso Fanale", k: "#dc2626", k2: "#fde68a", cost: 6 },
    { id: "verde", name: "Verde Murena", k: "#15803d", k2: "#bbf7d0", cost: 8 },
    { id: "nero", name: "Nero Corsaro", k: "#1f2937", k2: "#fb923c", cost: 10 },
    { id: "bianco", name: "Bianco Gabbiano", k: "#e2e8f0", k2: "#1d4ed8", cost: 10 },
    { id: "viola", name: "Viola di Stagione", k: "#7e22ce", k2: "#f0abfc", cost: 0, req: () => X.meta.seasonTitles >= 1, hint: "Vinci il campionato" },
    { id: "oro", name: "Oro del Molo", k: "#f59e0b", k2: "#1e3a8a", cost: 0, req: () => X.meta.cupsWon >= 1, hint: "Vinci la Coppa del Molo" },
  ];
  const PATS = [{ id: "classic", name: "Classica", cost: 0 }, { id: "stripes", name: "Strisce", cost: 4 }, { id: "hoops", name: "Righe", cost: 4 }, { id: "solid", name: "Tinta unita", cost: 2 }];
  const BALLS = [
    { id: "bianco", name: "Classico", c: "#ffffff", cost: 0 },
    { id: "arancio", name: "Arancio del Molo", c: "#fdba74", cost: 5 },
    { id: "lime", name: "Lime Fosforo", c: "#d9f99d", cost: 5 },
    { id: "oro", name: "Palla d'Oro", c: "#fde047", cost: 0, req: () => X.meta.cupsWon >= 1, hint: "Vinci la Coppa del Molo" },
  ];
  const PITCHES = [{ id: "giorno", name: "Giorno", cost: 0 }, { id: "tramonto", name: "Tramonto", cost: 6 }, { id: "notte", name: "Notte con lucine", cost: 8 }];
  const FORMS = ["Equilibrato", "Offensivo", "Difensivo"];
  const PRESS = ["Basso", "Medio", "Alto"];

  // cast ricorrente (le schede si sbloccano con il filo narrativo)
  const CASTD = [
    { id: "ginetta", n: "Ginetta Bandierina", t: "Organizzatrice e arbitra della Coppa. Ex arbitra di campionato, è ancora convinta che il primo fallo del 1979 fosse rigore.", ch: "c0" },
    { id: "arturo", n: "Arturo Altoparlante", t: "La voce di Radio Molo. Commenta con un mestolo e del nastro adesivo, con la competenza di chi ha visto una partita, una volta, di spalle.", ch: "c1" },
    { id: "cima", n: "Capitan Cima", t: "Capitano dei Corsari della Banchina. Mani come argani, cuore uguale. Dice che l'occhio è perso a carte: è solo un orzaiolo.", ch: "c3" },
    { id: "capo", n: "Il Capostazione", t: "Quarant'anni di fischi per le partenze degli altri. Il Dopolavoro gioca per chiudere con un binario libero.", ch: "c5" },
    { id: "orme", n: "Zio Ormeggio", t: "Capitano del Gran Fanale. Gioca scalzo dal 1987 e non sbaglia un passaggio di sguardo.", ch: "c6" },
    { id: "pina", n: "Signora Pina", t: "L'edicolante del Borgo e direttrice del Corriere: opinioni non richieste e una notizia per ogni partita. Madrina non ufficiale di ogni squadra, quindi di nessuna.", ch: "c2" },
  ];

  // filo narrativo a tappe: i capitoli bloccati compaiono come «???»
  const CHAPS = [
    { id: "c0", t: "La Coppa di Latta", tone: "ironico", cond: () => true, hint: "", p: [
      "Ginetta Bandierina ti mostra un secchio di latta, ammaccato e lucido solo sul bordo. «Questa è la Coppa del Molo. Gaspare il lattoniere la fece nel 1962 con il fondo di un bidone di vernice e il manico di un mestolo. Se la alzi forte, suona.»",
      "Sotto, una targa di rame con una colonna di nomi punzonati a chiodo. Gli ultimi sono illeggibili: la salsedine si è mangiata gli anni. «Ogni anno un nome nuovo. Quest'anno ne manca uno. Non dico chi.»",
      "«Regole: cinque contro cinque, cento secondi, niente tacchetti di ferro. E si saluta l'arbitro. Anche se sono io. Soprattutto se sono io.»"] },
    { id: "c1", t: "Il primo fischio", tone: "ironico", cond: () => totalPlays() >= 1, hint: "Gioca la tua prima partita", p: [
      "Arturo Altoparlante prende in mano il microfono, che è un mestolo con il nastro adesivo. «Signore e signori... c'è il vento.» Pausa. Dopo mezz'ora, in diretta: «C'è ancora il vento.»",
      "Ginetta lo lascia fare. «Il pubblico non sente niente», dice, «ma si sente ascoltato.»",
      "Da oggi Radio Molo trasmette ogni partita. L'audio arriva a tratti. La fiducia, sempre."] },
    { id: "c2", t: "Il panino", tone: "ironico", cond: () => PROG.stars[0] > 0, hint: "Batti i Gabbiani del Porto", p: [
      "Dopo la partita il panino non è più nella borsa. Sul palo della porta, un gabbiano ti fissa masticando con grande dignità. Era Peppino? Nessuno lo sa: i gabbiani del porto hanno tutti la stessa faccia da avvocato.",
      "Ginetta registra un reclamo: «Furto con scasso di cerniera». Il reclamo non verrà letto. Ma sul retro, a matita, c'è scritto: «Nel 1962 il primo spettatore della Coppa fu un gabbiano. Lo hanno sempre fatto pagare in natura.»"] },
    { id: "c3", t: "La sagola di Capitan Cima", tone: "serio", cond: () => PROG.stars[1] > 0, hint: "Batti i Corsari della Banchina", p: [
      "Capitan Cima ti aspetta a fine partita con un rotolo di sagola, tenuto come si tiene una cosa di valore. «Era di mio padre. Quando il porto cambiò le regole della pesca, lui smise di uscire. Teneva le reti appese come si tengono le giacche di chi ti manca. Questo è l'ultimo pezzo che ha intrecciato.»",
      "Lo lega al manico della Coppa: tre nodi, il terzo più stretto degli altri. «Così non cade dal ripiano. E se cade, almeno è legata a qualcuno.»",
      "Per un secondo l'orzaiolo gli fa lacrimare l'occhio. Nessuno dice niente. Nemmeno Arturo, che è la cosa più rara che si sia vista sul Molo quell'anno."] },
    { id: "c4", t: "Bocca aperta", tone: "ironico", cond: () => PROG.stars[2] > 0, hint: "Batti le Murene di Scoglio Rosso", p: [
      "Il mistero delle Murene che dormono a bocca aperta è risolto: finiscono il turno al mercato del pesce alle tre e mezza di notte e si allenano all'alba. «Dormiamo quando il pallone è in volo», spiega Fondale.",
      "Nando porta un cartoccio di fritto, e una Murena si addormenta con il pezzo ancora in bocca. Arturo, in diretta: «Calcio d'azione. E di digestione.»",
      "Poi qualcuno le mette una coperta addosso. Alle Murene non era mai successo. È l'unico momento in cui la bocca si chiude."] },
    { id: "c5", t: "L'ultimo binario", tone: "serio", cond: () => PROG.stars[3] > 0, hint: "Batti il Dopolavoro Ferroviario", p: [
      "Il Capostazione slega il fischietto dal cordino e te lo mette nel palmo. «Da gennaio al banco della stazione del Molo non ci sarà più nessuno. Il treno passerà lo stesso, ma nessuno lo saluterà. Per quarant'anni ho fischiato le partenze degli altri.»",
      "Guarda i binari arrugginiti che finiscono accanto al campo. «Questo non è un addio. È un passaggio di consegne: la prossima partenza la fischi tu.»",
      "Ginetta si asciuga gli occhi con il fischietto d'argento e finge che sia stato il vento."] },
    { id: "c6", t: "Scalzo dal 1987", tone: "serio", cond: () => PROG.stars[4] > 0, hint: "Batti Il Gran Fanale", p: [
      "Zio Ormeggio gioca scalzo dal 1987. Lo raccontano come una leggenda, ma la verità è più semplice: quell'anno la mareggiata si portò via la baracca degli spogliatoi e il compagno Ottone rimase senza scarpe. Ormeggio gli prestò le sue. «A fine anno te le ridò», disse Ottone. Poi Ottone cambiò città.",
      "Ormeggio non ne comprò altre. «Se ne compro un altro paio, vuol dire che non torna.»",
      "Oggi, sul bordo del campo, c'è un signore con un sacchetto: un paio di scarpini lucidati ogni domenica per trentanove anni. «Scusa il ritardo, Orme'.» Ormeggio li guarda a lungo. Poi se ne infila uno solo. «L'altro lo tengo per la prossima volta.»",
      "Nessun applauso. Gli occhi lucidi, tutti. E la Coppa, da sola, suona un po' per il vento."] },
    { id: "c7", t: "La targhetta", tone: "serio", cond: () => X.meta.seasonsDone >= 1, hint: "Concludi una stagione di campionato", p: [
      "A fine stagione Ginetta gira la Coppa e ti mostra la targa dal retro. Ci sono nomi graffiati con un chiodo che nessun registro ricorda: pescatori, bagnini, un postino, due gemelli che si sono sempre fatti passare l'uno per l'altro.",
      "«La Coppa non è del più forte», dice. «È di chi si ricorda di tornare.»",
      "Accanto alla tua stagione scrive una riga a matita: «Completata». Per la prima volta in vent'anni, non la cancella."] },
    { id: "c8", t: "Il nome sulla latta", tone: "ironico", cond: () => X.meta.cupsWon >= 1, hint: "Vinci la Coppa del Molo", p: [
      "Il chiodo, il martello, tre colpi. Il tuo nome entra nella targa tra quello di un postino e quello di due gemelli. Non è un gran lavoro: la R sembra una P con l'ernia.",
      "Ginetta lo guarda con occhio critico. «Lasciamola così. Un nome deve dare un po' di pensiero.» Poi capovolge la Coppa e la batte con le nocche: un do, lungo, un po' stonato.",
      "Dalla cabina, Arturo annuncia: «Signore e signori, il vento si è fermato un secondo. Poi ha ripreso.»"] },
    { id: "c9", t: "Radio Molo, fuori onda", tone: "serio", cond: () => X.meta.maxStreak >= 3 || X.meta.shellsTotal >= 40, hint: "Tre giorni di fila di sfide, o 40 conchiglie in tutto", p: [
      "Arturo spegne il mestolo e, per una volta, non fa battute. «Sai perché commento ogni partita, anche quelle senza pubblico? Perché un giorno qualcuno mi ha detto: quando smetti di parlare di una cosa, quella comincia a smettere di esistere. Allora parlo. Del vento, dei gabbiani, dei portieri col fiatone.»",
      "Fa una pausa. «Se torni ogni giorno, il Molo non smette. È tutto qui il segreto.»",
      "Poi riaccende il microfono. «E ora la pubblicità: Friggitoria Nando Frittura, il fritto che ti guarda negli occhi.»"] },
    { id: "c10", t: "Il Molo non chiude", tone: "serio", cond: () => CHAPS.slice(1, 10).every((c) => c.cond()), hint: "Sblocca tutti gli altri capitoli", p: [
      "Arriva una lettera del Comune, carta intestata e timbro: il campo del Molo «non è in programma di chiusura». Ginetta la legge tre volte, poi la appende accanto al fischietto con le puntine, dentro una busta di plastica per il fritto.",
      "Non ci sono messaggi nascosti: solo una riga di burocrazia che, per una volta, dice la cosa giusta. «Domani si gioca», annuncia. Le squadre arrivano alla spicciolata: i Fornai con la farina, le Lampare con il lume, Zio Ormeggio con un solo scarpino.",
      "L'ultima riga della targa è vuota. «Quella è per l'anno prossimo», dice Ginetta. «E per quello dopo. Finché ci saranno ragazzi con le scarpe slacciate e qualcuno che li guarda dalla banchina.»"] },
  ];
  const totalPlays = () => PROG.played + (X.meta.spPlayed | 0);
  const SEA_END = [
    "Campionessa del Molo! Ginetta ti consegna il secchio, tu lo alzi, lui suona un do. Arturo: «È il rumore dell'estate».",
    "Secondo posto: argento, che a Genova dicono sia la parte che si lucida meglio. La prossima stagione è lì che aspetta.",
    "Terzo posto. Sul podio, in piedi dietro due che si abbracciano. Si vede tutto, da dietro.",
    "A metà classifica. Il Molo non ti fischia: ti offre il fritto. Il che, a ben vedere, è più grave.",
    "Penultimo, ma con stile. La Signora Pina dice che la sconfitta con garbo è la vittoria dei signori.",
    "Ultimo in classifica, primo in simpatia. Arturo ti dedica la sigla di chiusura, che dura quattro secondi.",
  ];
  const CUP_END = {
    win: "Il nome entra nella targa. Il chiodo, il martello, tre colpi. Il Molo, per una volta, tace e ascolta la latta suonare.",
    lose: "Eliminato. Ginetta ti passa un cartoccio: «Si cade dal tabellone e si atterra nel fritto. Succede ai migliori».",
  };

  // sfide giornaliere
  const DPOOL = [
    { id: "win", t: "Vinci una partita (torneo, libera, campionato o coppa)", chk: (r) => r.team && r.win },
    { id: "clean", t: "Vinci senza subire gol", chk: (r) => r.team && r.win && r.c === 0 },
    { id: "intesa", t: "Metti a segno 2 Intese Leo-Nico in una partita", chk: (r) => r.team && r.st.intesa >= 2 },
    { id: "rond", t: "Segna con il Tiro della Rondine", chk: (r) => r.team && r.st.rond >= 1 },
    { id: "curve", t: "Segna un gol con la curva (aftertouch)", chk: (r) => r.team && r.st.curve >= 1 },
    { id: "g3", t: "Segna almeno 3 gol in una partita", chk: (r) => r.team && r.a >= 3 },
    { id: "steals", t: "Recupera 6 palloni in una partita", chk: (r) => r.team && r.st.steals >= 6 },
    { id: "sp3", t: "Segna 3 calci piazzati in una sessione", chk: (r) => r.mode === "setp" && r.goals >= 3 },
    { id: "pensave", t: "Para un rigore nei Rigori", chk: (r) => r.mode === "pens" && r.saved >= 1 },
    { id: "surv3", t: "Raggiungi l'ondata 3 in Sopravvivenza", chk: (r) => r.mode === "surv" && r.level >= 3 },
    { id: "timed4", t: "Segna 4 gol nella Sfida a tempo", chk: (r) => r.mode === "timed" && r.a >= 4 },
  ];

  // ---------------------------------------------------------------- salvataggi
  function lsGet(key, def) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return def;
      const o = JSON.parse(raw);
      return o && typeof o === "object" ? o : def;
    } catch (e) { return def; }
  }
  function lsSet(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignora */ } }
  function loadProg() {
    const o = lsGet(KEY_PROG, {});
    const arr = (a) => { const r = []; for (let i = 0; i < OPPS.length; i++) r.push(Math.max(0, Math.min(3, (a && a[i]) | 0))); return r; };
    return { stars: arr(o.stars), coin: arr(o.coin), played: o.played | 0, goals: o.goals | 0, wins: o.wins | 0, tut: o.tut ? 1 : 0 };
  }
  function loadSet() {
    const o = lsGet(KEY_SET, {});
    return {
      ctrl: o.ctrl === "touch" ? "touch" : "stick",
      diff: [0, 1, 2].indexOf(o.diff) >= 0 ? o.diff : 1,
      sound: o.sound === 0 ? 0 : 1,
    };
  }
  let PROG = loadProg();
  let SET = loadSet();
  const saveProg = () => lsSet(KEY_PROG, PROG);
  const saveSet = () => lsSet(KEY_SET, SET);

  // ---- stato esteso: una chiave per area, tutte nuove (ali-di-rondine.action-hd-*)
  const K = (n) => "ali-di-rondine.action-hd-" + n;
  const XKEYS = ["prefs", "meta", "best", "season", "cup", "daily", "team", "look"];
  const defX = () => ({
    prefs: { f: 0, p: 1, free: { opp: 0, len: 1, gold: 1 }, train: 1 },
    meta: { shells: 0, shellsTotal: 0, coin: {}, seen: [], seasonsDone: 0, seasonTitles: 0, seasonMd: 0, cupsPlayed: 0, cupsWon: 0, spPlayed: 0, maxStreak: 0 },
    best: { surv: 0, timed: 0, setp: 0, pens: 0 },
    season: null, cup: null,
    daily: { day: "", ids: [], done: [], streak: 0, last: "" },
    team: { gk: "sandro", def: ["chicco", "bj"] },
    look: { kit: "blu", pat: "classic", ball: "bianco", pitch: "giorno", own: [] },
  });
  function loadX() {
    const d = defX();
    XKEYS.forEach((k) => {
      const o = lsGet(K(k), null);
      if (!o) return;
      if (d[k] && typeof d[k] === "object" && !Array.isArray(d[k])) {
        Object.keys(o).forEach((f) => { if (f in d[k] && o[f] !== null && o[f] !== undefined) d[k][f] = (typeof d[k][f] === "object" && !Array.isArray(d[k][f]) && typeof o[f] === "object") ? Object.assign(d[k][f], o[f]) : o[f]; });
      } else d[k] = o;
    });
    return d;
  }
  let X = loadX();
  const saveX = (k) => lsSet(K(k), X[k]);
  const dayKey = () => {
    if (DEBUG && window.__ahdDay) return window.__ahdDay;
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  function addShells(n) { if (n <= 0) return; X.meta.shells += n; X.meta.shellsTotal += n; saveX("meta"); }
  function moloPt(kind, id) { try { window.dispatchEvent(new CustomEvent("molo:punti", { detail: { mode: "action", kind: kind, id: String(id) } })); } catch (e) { /* ignora */ } } // Settimana del Molo
  function coinOnce(key, n) { // monete solo alla prima volta, solo tramite window.addCoins
    if (X.meta.coin[key]) return 0;
    X.meta.coin[key] = 1; saveX("meta");
    if (typeof window.addCoins === "function") { try { window.addCoins(n); } catch (e) { return 0; } return n; }
    return 0;
  }

  // ---------------------------------------------------------------- stato modulo
  let root = null, cv = null, cx = null, ui = null, stage = null;
  let raf = 0, lastTs = 0, acc = 0, paused = false, closed = true;
  let onExitCb = null;
  let M = null; // partita
  let bgCache = null, vigCache = null, vigKey = "";
  let cleanup = [];
  let timers = [];
  let uiState = "menu";
  const input = { jx: 0, jy: 0, kx: 0, ky: 0, tx: 0, ty: 0, touchOn: false, sprint: false, charging: false, chargeF: 0, passEdge: false, shootRel: false, rond: false, keyShoot: false };
  const stick = { id: -1, ox: 0, oy: 0 };

  const snd = (name, a) => { if (SET.sound && window.HD2DAudio && typeof window.HD2DAudio[name] === "function") { try { window.HD2DAudio[name](a); } catch (e) { /* ignora */ } } };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const dist = (a, b, c, d) => Math.hypot(a - c, b - d);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const dirOf = (t) => (t === 0 ? 1 : -1);
  const goalXOf = (t) => (t === 0 ? XR : XL); // porta attaccata dalla squadra t
  const ownX = (t) => (t === 0 ? XL : XR);
  const uOf = (t, x) => (t === 0 ? (x - XL) / LEN : (XR - x) / LEN);
  const xOfU = (t, u) => (t === 0 ? XL + u * LEN : XR - u * LEN);
  const yOfV = (v) => YT + v * (YB - YT);
  const later = (fn, ms) => { const id = setTimeout(() => { timers = timers.filter((x) => x !== id); fn(); }, ms); timers.push(id); return id; };

  // ---------------------------------------------------------------- CSS
  function injectCss() {
    if (document.getElementById("ahd-css")) return;
    const st = document.createElement("style");
    st.id = "ahd-css";
    st.textContent = `
.ahd-root{position:fixed;left:0;top:0;width:100vw;height:100vh;height:100dvh;z-index:999999;display:flex;flex-direction:column;background:#07101c;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden;outline:none}
.ahd-root *{box-sizing:border-box}
.ahd-top{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:4px 8px;padding-top:max(4px,env(safe-area-inset-top));background:linear-gradient(#0b1626,#0a1422);border-bottom:1px solid #1e3350;z-index:30}
.ahd-ib{width:44px;height:44px;border-radius:12px;border:1px solid #33507a;background:#13233b;color:#fff;font-size:18px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto;padding:0;touch-action:manipulation}
.ahd-ib:active{background:#1f3a60}
.ahd-sc{flex:1;min-width:0;text-align:center;line-height:1.1}
.ahd-sc b{font:800 22px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:1px;white-space:nowrap}
.ahd-sc small{display:block;font-size:11px;color:#9bb4d6;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ahd-sc .ahd-ta{color:#7dd3fc}.ahd-sc .ahd-tb{color:#fca5a5}
.ahd-bars{display:flex;gap:6px;justify-content:center;margin-top:3px}
.ahd-bar{position:relative;width:76px;height:7px;border-radius:5px;background:#12233a;overflow:hidden;border:1px solid #2b4568}
.ahd-bar i{position:absolute;left:0;top:0;bottom:0;width:0;background:#38bdf8}
.ahd-bar.g i{background:linear-gradient(90deg,#f59e0b,#fb923c)}
.ahd-bar.full{box-shadow:0 0 8px #fb923c;border-color:#fdba74}
.ahd-stage{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
.ahd-stage canvas{position:absolute;left:0;top:0;width:100%;height:100%;display:block;touch-action:none}
.ahd-pad{position:absolute;left:0;top:0;bottom:0;width:58%;z-index:5;touch-action:none}
.ahd-pad.all{width:100%}
.ahd-stk{position:absolute;width:112px;height:112px;margin:-56px 0 0 -56px;border-radius:50%;border:2px solid rgba(255,255,255,.35);background:rgba(15,30,55,.35);z-index:6;pointer-events:none;opacity:.55;display:none}
.ahd-stk.on{opacity:1;background:rgba(15,30,55,.5)}
.ahd-stk i{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7dd3fc,#2563eb);border:2px solid #e0f2fe;box-shadow:0 3px 8px rgba(0,0,0,.5)}
.ahd-btns{position:absolute;right:0;bottom:0;width:230px;height:230px;z-index:8;pointer-events:none}
.ahd-b{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.55);color:#fff;font-weight:800;font-size:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;touch-action:none;box-shadow:0 5px 14px rgba(0,0,0,.5);cursor:pointer;padding:0;line-height:1.05;text-shadow:0 1px 2px #000}
.ahd-b small{font-size:9px;font-weight:600;opacity:.85}
.ahd-b.dn{transform:scale(.93);filter:brightness(1.35)}
.ahd-b.shoot{width:92px;height:92px;right:14px;bottom:max(22px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#f87171,#b91c1c);font-size:16px}
.ahd-b.pass{width:76px;height:76px;right:114px;bottom:max(14px,env(safe-area-inset-bottom));background:radial-gradient(circle at 35% 30%,#60a5fa,#1d4ed8)}
.ahd-b.spr{width:62px;height:62px;right:30px;bottom:130px;background:radial-gradient(circle at 35% 30%,#34d399,#047857);font-size:12px}
.ahd-b.ron{width:62px;height:62px;right:108px;bottom:106px;background:radial-gradient(circle at 35% 30%,#fde047,#d97706);font-size:12px;display:none;animation:ahdPulse .7s infinite alternate}
.ahd-b.ron.on{display:flex}
@keyframes ahdPulse{from{box-shadow:0 0 6px #facc15}to{box-shadow:0 0 22px #fb923c}}
.ahd-chg{position:absolute;left:50%;bottom:132px;width:150px;height:10px;margin-left:-75px;border-radius:6px;background:rgba(0,0,0,.5);border:1px solid #fff;z-index:7;display:none;overflow:hidden;pointer-events:none}
.ahd-chg i{display:block;height:100%;width:0;background:linear-gradient(90deg,#fde047,#ef4444)}
.ahd-msg{position:absolute;left:50%;top:14%;transform:translateX(-50%);z-index:9;pointer-events:none;background:rgba(7,16,28,.86);border:1px solid #38bdf8;border-radius:12px;padding:7px 14px;font-weight:800;font-size:15px;text-align:center;max-width:92%;display:none}
.ahd-hint{position:absolute;left:50%;bottom:calc(100% - 2px);display:none}
.ahd-banner{position:absolute;left:0;right:0;top:26%;z-index:12;text-align:center;pointer-events:none;display:none}
.ahd-banner .ahd-bg{display:inline-block;padding:10px 26px 12px;background:linear-gradient(90deg,transparent,rgba(8,20,40,.92) 14%,rgba(8,20,40,.92) 86%,transparent);animation:ahdIn .35s cubic-bezier(.2,1.4,.4,1)}
.ahd-banner h1{margin:0;font:900 44px/1 system-ui,sans-serif;letter-spacing:2px;color:#fde047;text-shadow:0 3px 0 #b45309,0 0 22px rgba(251,191,36,.7)}
.ahd-banner.bad h1{color:#fca5a5;text-shadow:0 3px 0 #7f1d1d}
.ahd-banner p{margin:6px 0 0;font-size:15px;font-weight:700;color:#e2e8f0}
@keyframes ahdIn{from{transform:scale(.4);opacity:0}to{transform:scale(1);opacity:1}}
.ahd-rep{position:absolute;left:12px;top:56px;z-index:12;background:#dc2626;color:#fff;font-weight:900;font-size:12px;letter-spacing:2px;padding:4px 10px;border-radius:6px;display:none;pointer-events:none}
.ahd-ui{position:absolute;inset:0;z-index:20;display:none;overflow-y:auto;overflow-x:hidden;background:rgba(5,10,20,.9);touch-action:pan-y;-webkit-overflow-scrolling:touch}
.ahd-ui.on{display:block}
.ahd-card{max-width:440px;margin:0 auto;padding:14px 14px calc(18px + env(safe-area-inset-bottom))}
.ahd-card h2{margin:4px 0 2px;font-size:22px;color:#7dd3fc}
.ahd-card h3{margin:14px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8}
.ahd-card p{margin:6px 0;font-size:14px;line-height:1.4;color:#cbd5e1}
.ahd-sub{font-size:13px;color:#94a3b8}
.ahd-opp{display:flex;align-items:center;gap:10px;width:100%;min-height:58px;margin:6px 0;padding:8px 10px;border-radius:14px;border:1px solid #29456c;background:#0f1f36;color:#fff;text-align:left;cursor:pointer;font:inherit;touch-action:manipulation}
.ahd-opp:active{background:#17304f}
.ahd-opp[disabled]{opacity:.45;cursor:default}
.ahd-opp .ahd-crest{flex:0 0 38px;height:38px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px}
.ahd-opp b{display:block;font-size:15px}
.ahd-opp span{font-size:12px;color:#9bb4d6}
.ahd-opp em{margin-left:auto;font-style:normal;color:#fde047;font-size:15px;letter-spacing:1px;white-space:nowrap}
.ahd-seg{display:flex;gap:6px;margin:4px 0 8px}
.ahd-seg button{flex:1;min-height:44px;border-radius:10px;border:1px solid #29456c;background:#0f1f36;color:#cbd5e1;font:700 13px system-ui;cursor:pointer;padding:4px;touch-action:manipulation}
.ahd-seg button.on{background:#0369a1;border-color:#7dd3fc;color:#fff}
.ahd-btn{display:block;width:100%;min-height:50px;margin:8px 0;border-radius:14px;border:0;background:linear-gradient(#22c55e,#15803d);color:#fff;font:800 16px system-ui;cursor:pointer;touch-action:manipulation}
.ahd-btn.sec{background:#1e3350;border:1px solid #3b5b88;font-size:14px}
.ahd-btn.red{background:linear-gradient(#ef4444,#b91c1c)}
.ahd-score{font:900 48px/1 ui-monospace,Menlo,monospace;text-align:center;margin:8px 0;letter-spacing:2px}
.ahd-stars{text-align:center;font-size:30px;color:#fde047;letter-spacing:6px}
.ahd-quote{border-left:3px solid #38bdf8;padding:4px 10px;margin:10px 0;color:#e2e8f0;font-style:italic}
.ahd-stat{display:flex;justify-content:space-between;font-size:13px;color:#cbd5e1;border-bottom:1px solid #1e3350;padding:5px 0}
.ahd-dots{text-align:center;margin:10px 0;color:#475569;font-size:22px}.ahd-dots b{color:#38bdf8}
.ahd-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0}
.ahd-tile{min-height:62px;padding:8px 10px;border-radius:14px;border:1px solid #29456c;background:#0f1f36;color:#fff;text-align:left;font:inherit;cursor:pointer;touch-action:manipulation;display:flex;flex-direction:column;justify-content:center;gap:2px;min-width:0}
.ahd-tile:active{background:#17304f}
.ahd-tile b{font-size:14px;line-height:1.15}
.ahd-tile span{font-size:11px;color:#9bb4d6;line-height:1.25}
.ahd-tile.on{border-color:#7dd3fc;background:#0c3b63}
.ahd-tile.hot{border-color:#fde047}
.ahd-tile[disabled]{opacity:.45;cursor:default}
.ahd-tile .ahd-crest{width:30px;height:30px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:10px;margin-bottom:3px}
.ahd-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ahd-row2 .ahd-btn{margin:4px 0;font-size:14px;padding:0 6px}
.ahd-tbl{width:100%;border-collapse:collapse;font-size:13px;color:#cbd5e1}
.ahd-tbl th{font-size:11px;color:#94a3b8;font-weight:700}
.ahd-tbl td,.ahd-tbl th{padding:6px 3px;text-align:center;border-bottom:1px solid #1e3350}
.ahd-tbl td:nth-child(2),.ahd-tbl th:nth-child(2){text-align:left}
.ahd-tbl tr.me{background:#0c3b63;color:#fff;font-weight:800}
.ahd-brk{display:flex;gap:6px;align-items:stretch;margin:8px 0}
.ahd-brk>div{flex:1;display:flex;flex-direction:column;justify-content:space-around;gap:6px;min-width:0}
.ahd-brk h4{margin:0 0 2px;font-size:10px;letter-spacing:1px;color:#94a3b8;text-transform:uppercase;text-align:center}
.ahd-mt{border:1px solid #29456c;border-radius:10px;background:#0f1f36;font-size:12px;overflow:hidden}
.ahd-mt.me{border-color:#fde047}
.ahd-mt div{display:flex;justify-content:space-between;padding:4px 6px;gap:4px}
.ahd-mt div.w{font-weight:800;color:#fff}.ahd-mt div.l{color:#64748b}
.ahd-mt i{font-style:normal;color:#7dd3fc}
.ahd-chip{display:inline-block;padding:2px 8px;border-radius:999px;background:#13304f;border:1px solid #2b4f7a;font-size:12px;color:#bae6fd;margin:0 4px 4px 0}
.ahd-sw{display:inline-block;width:16px;height:16px;border-radius:50%;border:2px solid #fff;vertical-align:middle;margin-right:6px}
.ahd-new{border:1px solid #fde047;border-radius:12px;padding:8px 10px;margin:10px 0;background:rgba(253,224,71,.08);font-size:13px;color:#fef9c3}
.ahd-chap p{font-size:14px;line-height:1.5}
.ahd-pp{display:flex;gap:10px;align-items:flex-start;margin:10px 0}.ahd-pp p{flex:1;min-width:0;margin:0;overflow-wrap:anywhere}
.ahd-pw{flex:none;width:72px;text-align:center}.ahd-pw i{display:block;font-style:normal;font-size:10.5px;font-weight:700;color:#fde047;margin-top:2px;line-height:1.15}
.ahd-pt{display:block;width:72px;height:72px;border-radius:10px;border:2px solid #fde047;background:#0b1424}
.ahd-chap .ahd-tone{display:inline-block;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#fde047;border:1px solid #a16207;border-radius:6px;padding:1px 6px}
.ahd-lock{color:#64748b}
.ahd-done{color:#86efac;font-weight:800}
.ahd-warn{color:#fca5a5}
`;
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- sfondo (cache)
  function seeded(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  const MX = 130, MT = 190, MB = 160;
  function buildBg() {
    const bw = W + MX * 2, bh = H + MT + MB;
    const c = document.createElement("canvas");
    c.width = bw; c.height = bh;
    const g = c.getContext("2d");
    g.translate(MX, MT);
    const r = seeded(77);
    // ---- mare in alto
    let gr = g.createLinearGradient(0, -MT, 0, -40);
    gr.addColorStop(0, "#0a2c47"); gr.addColorStop(1, "#1b6d8c");
    g.fillStyle = gr; g.fillRect(-MX, -MT, bw, MT - 30);
    g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 2;
    for (let i = 0; i < 70; i++) {
      const x = -MX + r() * bw, y = -MT + 10 + r() * (MT - 70), l = 18 + r() * 40;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 4, x + l, y); g.stroke();
    }
    // barche
    const boat = (x, y, s, col, sail) => {
      g.save(); g.translate(x, y); g.scale(s, s);
      g.fillStyle = "rgba(0,0,0,.25)"; g.beginPath(); g.ellipse(0, 18, 46, 6, 0, 0, 7); g.fill();
      g.fillStyle = col; g.beginPath(); g.moveTo(-44, 0); g.lineTo(44, 0); g.lineTo(32, 16); g.lineTo(-32, 16); g.closePath(); g.fill();
      g.fillStyle = "#f8fafc"; g.fillRect(-44, 0, 88, 3);
      g.strokeStyle = "#3b2f25"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -58); g.stroke();
      g.fillStyle = sail; g.beginPath(); g.moveTo(3, -56); g.lineTo(30, -6); g.lineTo(3, -6); g.closePath(); g.fill();
      g.restore();
    };
    boat(150, -120, 1, "#b91c1c", "#fef3c7"); boat(520, -135, 0.8, "#1d4ed8", "#fde68a");
    boat(900, -118, 1.1, "#15803d", "#e0f2fe"); boat(1210, -140, 0.75, "#a16207", "#fecaca");
    // banchina in pietra
    gr = g.createLinearGradient(0, -48, 0, 2);
    gr.addColorStop(0, "#8b7355"); gr.addColorStop(1, "#5a4630");
    g.fillStyle = gr; g.fillRect(-MX, -48, bw, 52);
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 1;
    for (let x = -MX; x < bw; x += 38) { g.beginPath(); g.moveTo(x, -48); g.lineTo(x, 4); g.stroke(); }
    for (let x = 0; x < W; x += 170) { g.fillStyle = "#2b2118"; g.fillRect(x + 40, -50, 12, 14); g.fillStyle = "#facc15"; g.fillRect(x + 40, -50, 12, 4); }
    // lucine
    for (let x = -MX; x < bw - MX; x += 28) { g.fillStyle = (x / 28) % 2 ? "#fde68a" : "#fb7185"; g.beginPath(); g.arc(x, -26 + Math.sin(x * 0.05) * 4, 3, 0, 7); g.fill(); }
    // ---- tribunetta in basso
    gr = g.createLinearGradient(0, H - 6, 0, H + MB);
    gr.addColorStop(0, "#1b2433"); gr.addColorStop(1, "#0b1019");
    g.fillStyle = gr; g.fillRect(-MX, H - 6, bw, MB + 10);
    const cols = ["#f87171", "#60a5fa", "#fde047", "#a3e635", "#e879f9", "#fb923c", "#f1f5f9", "#38bdf8"];
    for (let row = 0; row < 7; row++) {
      const y0 = H + 34 + row * 17;
      g.fillStyle = row % 2 ? "#212c40" : "#273349"; g.fillRect(-MX, y0 - 4, bw, 15);
      for (let x = -MX + 6; x < bw - MX; x += 11 + r() * 5) {
        const col = cols[(r() * cols.length) | 0];
        g.fillStyle = "#e2b48c"; g.beginPath(); g.arc(x, y0 - 2, 3.4, 0, 7); g.fill();
        g.fillStyle = col; g.fillRect(x - 4, y0 + 1, 8, 7);
      }
    }
    // ---- bordi laterali (siepe + rete)
    g.fillStyle = "#10261c"; g.fillRect(-MX, -30, MX + 4, H + 60); g.fillRect(W - 4, -30, MX + 4, H + 60);
    for (let i = 0; i < 160; i++) { g.fillStyle = r() > 0.5 ? "#17402b" : "#0d2217"; g.beginPath(); g.arc(-MX + r() * (MX), -20 + r() * (H + 40), 5 + r() * 8, 0, 7); g.fill(); g.beginPath(); g.arc(W + r() * MX, -20 + r() * (H + 40), 5 + r() * 8, 0, 7); g.fill(); }
    // ---- erba
    g.fillStyle = "#1f7a38"; g.fillRect(0, 6, W, H - 12);
    for (let i = 0, x = 0; x < W; x += 75, i++) {
      g.fillStyle = i % 2 ? "rgba(255,255,255,.055)" : "rgba(0,0,0,.07)"; g.fillRect(x, 6, 75, H - 12);
    }
    for (let i = 0; i < 4200; i++) {
      g.fillStyle = r() > 0.5 ? "rgba(255,255,255,.07)" : "rgba(0,30,0,.12)";
      g.fillRect(r() * W, 6 + r() * (H - 12), 1.6, 3 + r() * 3);
    }
    // chiazze di fango davanti alle porte e al centro
    [[XL + 70, GM], [XR - 70, GM], [W / 2, H / 2]].forEach(([x, y]) => {
      const rg = g.createRadialGradient(x, y, 6, x, y, 90);
      rg.addColorStop(0, "rgba(94,70,38,.34)"); rg.addColorStop(1, "rgba(94,70,38,0)");
      g.fillStyle = rg; g.fillRect(x - 92, y - 92, 184, 184);
    });
    // cartelloni
    const ads = ["TRATTORIA DA ZIA PINA", "FRITTO MISTO DEL MOLO", "PESCHERIA GEMMA", "OFFICINA SCIROCCO", "CALZATURE TRE SALTI", "FARO CAFFÈ", "PANIFICIO ALBA"];
    const adCols = ["#b91c1c", "#1d4ed8", "#a16207", "#0f766e", "#7e22ce", "#be123c", "#15803d"];
    g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 0; i < 7; i++) {
      const x = 12 + i * 168, w = 160;
      [[8, 24], [H - 32, 24]].forEach(([y, h]) => {
        g.fillStyle = adCols[i]; g.fillRect(x, y, w, h);
        g.fillStyle = "rgba(255,255,255,.18)"; g.fillRect(x, y, w, 4);
        g.strokeStyle = "#0b1019"; g.lineWidth = 2; g.strokeRect(x, y, w, h);
        g.fillStyle = "#fff"; g.font = "bold 12px system-ui"; g.fillText(ads[(i + (y > 100 ? 3 : 0)) % ads.length], x + w / 2, y + h / 2 + 1);
      });
    }
    // ---- linee
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 3; g.lineJoin = "round";
    g.strokeRect(XL, YT, LEN, YB - YT);
    g.beginPath(); g.moveTo(W / 2, YT); g.lineTo(W / 2, YB); g.stroke();
    g.beginPath(); g.arc(W / 2, H / 2, 92, 0, 7); g.stroke();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(W / 2, H / 2, 4, 0, 7); g.fill();
    [[XL, 1], [XR, -1]].forEach(([x0, s]) => {
      g.strokeRect(s > 0 ? x0 : x0 - BOX_D, BOX_T, BOX_D, BOX_B - BOX_T);
      g.strokeRect(s > 0 ? x0 : x0 - 60, 285, 60, 180);
      g.beginPath(); g.arc(x0 + s * 120, GM, 4, 0, 7); g.fill();
      g.beginPath(); g.arc(x0 + s * BOX_D, GM, 70, s > 0 ? -1.0 : Math.PI - 1.0, s > 0 ? 1.0 : Math.PI + 1.0); g.stroke();
    });
    [[XL, YT, 0], [XR, YT, 1], [XR, YB, 2], [XL, YB, 3]].forEach(([x, y, q]) => { g.beginPath(); g.arc(x, y, 14, q * Math.PI / 2, (q + 1) * Math.PI / 2); g.stroke(); });
    // ---- porte con rete
    [[XL, -1], [XR, 1]].forEach(([x0, s]) => {
      const x1 = x0 + s * 34;
      g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(Math.min(x0, x1), GT, 34, GH);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1;
      for (let y = GT; y <= GB; y += 8) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
      for (let i = 0; i <= 34; i += 8) { g.beginPath(); g.moveTo(x0 + s * i, GT); g.lineTo(x0 + s * i, GB); g.stroke(); }
      g.strokeStyle = "#fff"; g.lineWidth = 5;
      g.beginPath(); g.moveTo(x0, GT); g.lineTo(x1, GT); g.lineTo(x1, GB); g.lineTo(x0, GB); g.stroke();
      g.fillStyle = "#fff"; g.beginPath(); g.arc(x0, GT, 5, 0, 7); g.arc(x0, GB, 5, 0, 7); g.fill();
    });
    // ---- luce del campo (personalizzazione)
    const pit = X.look.pitch;
    if (pit === "tramonto" || pit === "notte") {
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = "source-atop";
      g.fillStyle = pit === "tramonto" ? "rgba(255,120,40,.2)" : "rgba(8,18,70,.5)";
      g.fillRect(0, 0, bw, bh);
      g.restore();
      if (pit === "notte") {
        // lucine del Molo accese lungo la banchina e coni di luce sul prato
        g.save();
        for (let x = -MX; x < bw - MX; x += 28) { g.fillStyle = "rgba(253,230,138,.9)"; g.beginPath(); g.arc(x, -26 + Math.sin(x * 0.05) * 4, 3.4, 0, 7); g.fill(); }
        [[W * 0.2, 40], [W * 0.5, 40], [W * 0.8, 40], [W * 0.2, H - 40], [W * 0.5, H - 40], [W * 0.8, H - 40]].forEach(([x, y]) => {
          const rg = g.createRadialGradient(x, y, 4, x, y, 230);
          rg.addColorStop(0, "rgba(255,244,190,.22)"); rg.addColorStop(1, "rgba(255,244,190,0)");
          g.fillStyle = rg; g.fillRect(x - 230, y - 230, 460, 460);
        });
        g.restore();
      }
    }
    return c;
  }

  // ---------------------------------------------------------------- creazione partita
  const mateById = (id) => MATES.find((m) => m.id === id);
  const mateOpen = (m) => !m.req || !!m.req();
  function homeRoster() { // portiere, 2 difensori scelti tra i compagni sbloccati; Leo e Nico fissi
    const t = X.team;
    let gk = mateById(t.gk); if (!gk || gk.slot !== 0 || !mateOpen(gk)) gk = mateById("sandro");
    const df = (t.def || []).map(mateById).filter((m) => m && m.slot === 1 && mateOpen(m));
    const out = [];
    df.forEach((m) => { if (!out.includes(m) && out.length < 2) out.push(m); });
    ["chicco", "bj"].forEach((id) => { const m = mateById(id); if (out.length < 2 && !out.includes(m)) out.push(m); });
    return [gk, out[0], out[1], { name: "Leo", mods: {} }, { name: "Nico", mods: {} }];
  }
  const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const colDist = (a, b) => { const x = hexRgb(a), y = hexRgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  const kitOf = () => KITS.find((k) => k.id === X.look.kit) || KITS[0];
  function mkTeam(team, opp, ut) {
    const arr = [];
    const ros = team === 0 ? (ut ? ut.map((u) => ({ name: u.name, mods: {} })) : homeRoster()) : null, hk = kitOf();
    for (let i = 0; i < 5; i++) {
      const ro = ROLES[i];
      const md = ros ? ros[i].mods || {} : {};
      const uf = team === 0 && ut ? ut[i].f : null; // modalita' "ut": valori -1..1 delle carte, vedi utFor()
      const p = {
        team, i, role: ro.r, isGK: i === 0,
        name: team === 0 ? ros[i].name : opp.names[i],
        bu: ro.u, bv: ro.v,
        x: xOfU(team, ro.u), y: yOfV(ro.v), vx: 0, vy: 0, face: team === 0 ? 0 : Math.PI,
        spd: ro.spd * (team === 0 ? (uf ? 1 + UTK.spd * uf.spd : (i === 3 ? 1.02 : i === 4 ? 1.04 : 1) * (md.spd || 1)) : 1),
        kit: team === 0 ? hk.k : opp.kit, kit2: team === 0 ? hk.k2 : opp.kit2, pat: team === 0 ? X.look.pat : "classic",
        stun: 0, cd: 0, think: 0, lunge: 0, lungeCd: 0, ph: Math.random() * 6, hold: 0, dribT: null, err: 0, tkMul: uf ? 1 + UTK.def * uf.def : md.tkl || 1, reachMul: uf ? 1 + UTK.gk * uf.gk : md.reach || 1,
        frozen: false, userKeeper: false, dive: 0, ut: uf, rxAdj: uf && i === 0 ? -Math.round(UTK.rx * uf.gk) : 0,
      };
      if (i === 0) { p.kit = team === 0 ? "#f59e0b" : opp.gk; p.kit2 = "#111827"; }
      arr.push(p);
    }
    return arr;
  }

  function newMatch(mi, diffIdx, o) {
    o = o || {};
    let opp = o.opp || OPPS[mi < 0 ? 0 : mi];
    const hk = kitOf();
    if (colDist(hk.k, opp.kit) < 90) opp = Object.assign({}, opp, { kit: opp.kit2, kit2: opp.kit }); // niente maglie uguali
    if (o.opass) opp = Object.assign({}, opp, { shoot: 40, press: o.opass === 2 ? 0 : 70, tkl: 0.4 });
    const len = o.len === undefined ? MATCH_SECS : o.len;
    M = {
      mi, opp, D: Object.assign({}, DIFFS[diffIdx]), diffIdx, mode: o.mode || "torneo", len, halfT: o.noHalf ? 0 : len / 2, noGolden: !!o.noGolden,
      state: "kickoff", timer: 90, score: [0, 0], t: 0, golden: false, halfDone: false,
      tm: [mkTeam(0, opp, o.ut), mkTeam(1, opp)], pl: [], ut: !!o.ut,
      ball: { x: W / 2, y: GM, vx: 0, vy: 0, z: 0, vz: 0, owner: null, lastTeam: 0, lastP: null, passTo: null, at: 0, atTeam: 0, fire: 0, curl: 0, rot: 0, hot: 0, trail: [], curved: false },
      ctl: null, ctlLock: 0, kickTeam: 0, chase: [[], []],
      grinta: 0, stam: 1, stamLock: false,
      lastPass: null, intesa: 0,
      parts: [], shake: 0, flash: 0,
      shots: [0, 0], saves: [0, 0], goalsLog: [],
      st: { intesa: 0, rond: 0, curve: 0, steals: 0 },
      lives: 3, level: 1, sp: null, so: null, setp: null,
      msg: "", msgT: 0, banner: 0, hintShot: false, hintCurve: 0,
      label: "", rep: null, frames: new Float32Array(150 * 44), fi: 0, fcount: 0, goalPhase: 0, goalTimer: 0, lastScorer: null,
      camX: W / 2, camY: H / 2, ended: false, tick: 0,
    };
    M.pl = M.tm[0].concat(M.tm[1]);
    M.ctl = M.tm[0][3];
    M.tm[1].forEach((p) => { p.spd *= M.D.spd * opp.spd; p.tkMul = opp.tkl; if (o.opass === 2 && !p.isGK) p.frozen = true; if (o.opass === 1) p.spd *= 0.5; });
    M.tm[0].forEach((p) => { p.spd *= M.D.usr; });
    if (o.mode === "train") M.grinta = 100;
    setupKickoff(0);
    return M;
  }

  function setupKickoff(team) {
    const b = M.ball;
    M.pl.forEach((p) => {
      p.x = xOfU(p.team, p.bu * 0.92 + 0.03); p.y = yOfV(p.bv); p.vx = p.vy = 0; p.stun = 0; p.cd = 0; p.lunge = 0; p.think = 0; p.hold = 0;
      p.face = p.team === 0 ? 0 : Math.PI;
    });
    const k = M.tm[team][4];
    k.x = W / 2 - dirOf(team) * 18; k.y = GM;
    const k2 = M.tm[team][3];
    k2.x = W / 2 - dirOf(team) * 90; k2.y = GM + 70;
    M.tm[1 - team].forEach((p) => { if (!p.isGK && uOf(p.team, p.x) > 0.37) p.x = xOfU(p.team, 0.37); });
    b.x = W / 2; b.y = GM; b.vx = b.vy = 0; b.z = 0; b.vz = 0; b.owner = k; b.passTo = null; b.at = 0; b.fire = 0; b.lastTeam = team; b.lastP = k; b.trail.length = 0;
    M.kickTeam = team; M.state = "kickoff"; M.timer = 80; M.lastPass = null;
    if (team === 0) M.ctl = k;
    snd("playWhistle", true);
    setLabel(team === 0 ? "Calcio d'inizio: tuo!" : "Calcio d'inizio avversario");
  }

  // ---------------------------------------------------------------- utilità di gioco
  function say(txt, ms) {
    const el = stage && stage.querySelector(".ahd-msg");
    if (!el) return;
    el.textContent = txt; el.style.display = "block";
    M.msgT = Math.round((ms || 1500) / 16.67);
  }
  function setLabel(t) { M.label = t; M.labelT = 90; }
  function predictBall(n) {
    const b = M.ball;
    const k = (1 - Math.pow(FR, n)) / (1 - FR);
    return { x: clamp(b.x + b.vx * k, XL, XR), y: clamp(b.y + b.vy * k, YT, YB) };
  }
  function spark(x, y, n, col, sp) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, s = rnd(0.5, sp || 3);
      M.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.5, life: rnd(18, 36), max: 36, col, size: rnd(1.5, 3.4) });
    }
  }
  function addGrinta(n) { if (!M) return; M.grinta = clamp(M.grinta + n, 0, 100); }

  // ---------------------------------------------------------------- calci
  function kickBall(p, tx, ty, v0, vz, opts) {
    opts = opts || {};
    const b = M.ball;
    const a = Math.atan2(ty - p.y, tx - p.x);
    b.owner = null; b.x = p.x + Math.cos(a) * 13; b.y = p.y + Math.sin(a) * 13;
    b.vx = Math.cos(a) * v0; b.vy = Math.sin(a) * v0; b.vz = vz; if (vz > 0) b.z = Math.max(b.z, 0.5);
    b.lastTeam = p.team; b.lastP = p; b.passTo = opts.to || null;
    b.at = opts.at || 0; b.atTeam = p.team; b.fire = opts.fire || 0; b.curl = opts.curl || 0; b.hot = opts.hot || 0; b.curved = false;
    p.cd = 26; p.face = a;
    b.trail.length = 0;
    snd("playKick", opts.snd || 1);
  }

  function threatAt(p, x, y) { // quanti avversari sono vicini a un punto
    let m = 999;
    M.tm[1 - p.team].forEach((q) => { const d = dist(q.x, q.y, x, y); if (d < m) m = d; });
    return m;
  }
  function laneClear(p, tx, ty, r) {
    const dx = tx - p.x, dy = ty - p.y, l2 = dx * dx + dy * dy || 1;
    let m = 999;
    M.tm[1 - p.team].forEach((q) => {
      let t = ((q.x - p.x) * dx + (q.y - p.y) * dy) / l2; t = clamp(t, 0, 1);
      const d = dist(q.x, q.y, p.x + dx * t, p.y + dy * t);
      if (d < m) m = d;
    });
    return m > (r || 30);
  }
  function passSpeed(d) { return clamp(4.6 + 0.0185 * d, 7, 15.5); }

  function doPass(p, m, power) {
    const d = dist(p.x, p.y, m.x, m.y);
    const v0 = passSpeed(d) * (power || 1) * (p.ut ? 1 + UTK.pasV * p.ut.pas : 1);
    const lead = clamp(d / Math.max(v0, 1), 0, 22) * 0.55;
    const pe = p.ut ? UTK.pasE * (1 - p.ut.pas) / 2 : 0; // imprecisione del passaggio (px): 0 con passaggio al massimo
    const tx = clamp(m.x + m.vx * lead + rnd(-pe, pe), XL + 8, XR - 8), ty = clamp(m.y + m.vy * lead + rnd(-pe, pe), YT + 8, YB - 8);
    kickBall(p, tx, ty, v0, d > 360 ? 1.8 : 0.3, { to: m, snd: 0.85, at: p.team === 0 ? 26 : 0 });
    M.lastPass = { from: p, to: m, t: M.t };
    if (p.team === 0) { M.ctl = m; M.ctlLock = 20; }
  }

  function aimShot(p, charge, accNoise) {
    const gx = goalXOf(p.team);
    const gk = M.tm[1 - p.team][0];
    let ay;
    if (p.team === 0 && M.sp && M.sp.lock && SET.ctrl === "touch" && input.touchOn) {
      ay = clamp(input.ty, GT + 10, GB - 10);
    } else if (p.team === 0 && (Math.abs(input.jx) + Math.abs(input.jy) > 0.25 || Math.abs(input.kx) + Math.abs(input.ky) > 0.1)) {
      const jy = input.jy + input.ky;
      ay = GM + clamp(jy * 1.3, -1, 1) * (GH / 2 - 9);
    } else {
      const side = Math.abs(gk.y - GM) < 8 ? (Math.random() < 0.5 ? -1 : 1) : -Math.sign(gk.y - GM);
      ay = GM + side * GH * 0.3;
    }
    ay += rnd(-1, 1) * accNoise;
    return { x: gx, y: clamp(ay, GT + 7, GB - 7) };
  }

  function userShoot(p, charge, rondine) {
    const b = M.ball;
    const dg = dist(p.x, p.y, goalXOf(p.team), GM);
    let intesa = false;
    if (M.lastPass && M.lastPass.to === p && M.t - M.lastPass.t < 2.8 && ((M.lastPass.from.i === 3 && p.i === 4) || (M.lastPass.from.i === 4 && p.i === 3))) intesa = true;
    const noise = intesa ? 0 : (3 + charge * 14) * (p.ut ? 1 - UTK.acc * p.ut.acc : 1);
    const tgt = aimShot(p, charge, noise);
    let v0 = 10.5 + 9.5 * charge, lift = 0.5 + 3.4 * charge * charge + rnd(-0.2, 0.3);
    if (p.ut) v0 *= 1 + UTK.pow * p.ut.pow;
    if (M.sp && M.sp.kind === "fk") lift = 2 + 4.4 * charge; // la punizione si alza per scavalcare la barriera
    if (intesa) { v0 *= 1.1; M.intesa++; addGrinta(22); say(M.ut ? "INTESA " + p.name.toUpperCase() + "!" : "INTESA LEO-NICO!", 1700); spark(p.x, p.y, 22, "#7dd3fc", 4); M.flash = 8; snd("playEmblemCrit"); }
    if (rondine) {
      v0 = 21.5; lift = 2.2; M.grinta = 0;
      const side = p.y < GM ? 1 : -1, curl = side * 0.02;
      const nFr = dist(p.x, p.y, tgt.x, tgt.y) / 18; // frame di volo stimati: la curva rientra esattamente sull'angolo scelto
      const a0 = Math.atan2(tgt.y - p.y, tgt.x - p.x) - curl * nFr * 0.5;
      tgt.x = p.x + Math.cos(a0) * 300; tgt.y = p.y + Math.sin(a0) * 300;
      kickBall(p, tgt.x, tgt.y, v0, lift, { at: Math.ceil(nFr) + 8, fire: 1, curl, hot: 1, snd: 1.3 });
      M.shake = 10; M.flash = 10;
      banner("TIRO DELLA RONDINE!", "Le ali si aprono, il pallone ride", false, 1300);
      snd("playEmblemCrit");
    } else {
      kickBall(p, tgt.x, tgt.y, v0, lift, { at: 46, snd: 0.9 + charge * 0.4 });
      if (charge > 0.8) M.shake = 3;
    }
    M.shots[0]++;
    M.hintCurve = 80;
    void dg;
  }

  function aiShoot(p) {
    const D = M.D;
    const tgt = aimShot(p, 0.8, D.noise * (p.ut ? 1 - UTK.acc * p.ut.acc : 1));
    const dg = dist(p.x, p.y, goalXOf(p.team), GM);
    kickBall(p, tgt.x, tgt.y, clamp(9.5 + dg * 0.016, 11, 17.5) * (p.ut ? 1 + UTK.pow * p.ut.pow : 1), clamp(0.5 + dg * 0.004, 0.6, 2.4), { snd: 1.1 });
    M.shots[1]++;
  }

  // ---------------------------------------------------------------- scelta passaggio
  function mates(p) { return M.tm[p.team].filter((m) => m !== p && !m.isGK); }
  function passScore(p, m, dirHint) {
    const d = dist(p.x, p.y, m.x, m.y);
    if (d < 60 || d > 560) return -9;
    const adv = (uOf(p.team, m.x) - uOf(p.team, p.x)) * LEN;
    const open = clamp(threatAt(p, m.x, m.y), 0, 130) / 130;
    const lane = laneClear(p, m.x, m.y, 30) ? 1 : -0.7;
    let s = adv * 0.0035 + open * 0.9 + lane * 0.7 - d * 0.0005;
    if (p.team === 0 && ((p.i === 3 && m.i === 4) || (p.i === 4 && m.i === 3))) s += 0.18;
    if (dirHint) {
      const al = ((m.x - p.x) * dirHint.x + (m.y - p.y) * dirHint.y) / d;
      s = al * 2.2 + open * 0.3 + lane * 0.3 - d * 0.0006;
      if (al < 0.35) s -= 5;
    }
    return s;
  }
  function bestPass(p, dirHint) {
    let best = null, bs = -99;
    mates(p).forEach((m) => { const s = passScore(p, m, dirHint); if (s > bs) { bs = s; best = m; } });
    return best ? { m: best, score: bs } : null;
  }

  // ---------------------------------------------------------------- movimento
  function moveTo(p, tx, ty, mul, tight) {
    const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
    let sp = p.spd * (mul || 1);
    if (d < 40 && !tight) sp *= Math.max(0.15, d / 40);
    let wx = 0, wy = 0;
    if (d > 2) { wx = (dx / d) * sp; wy = (dy / d) * sp; }
    p.vx += (wx - p.vx) * 0.22; p.vy += (wy - p.vy) * 0.22;
  }
  function integrate(p) {
    if (p.stun > 0) { p.stun--; p.vx *= 0.8; p.vy *= 0.8; }
    p.x = clamp(p.x + p.vx, XL - 4, XR + 4); p.y = clamp(p.y + p.vy, YT - 6, YB + 6);
    if (p.cd > 0) p.cd--;
    if (p.lungeCd > 0) p.lungeCd--;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > 0.5) { p.face = Math.atan2(p.vy, p.vx); p.ph += sp * 0.11; }
  }

  // ---------------------------------------------------------------- IA
  function computeChasers() {
    const b = M.ball;
    const ref = b.owner ? { x: b.owner.x, y: b.owner.y } : predictBall(10);
    for (let t = 0; t < 2; t++) {
      const arr = M.tm[t].filter((p) => !p.isGK && p !== M.ctl).sort((a, c) => dist(a.x, a.y, ref.x, ref.y) - dist(c.x, c.y, ref.x, ref.y));
      M.chase[t] = arr.slice(0, 2);
    }
  }

  function formationTarget(p, hasPoss) {
    const b = M.ball, t = p.team;
    const bu = uOf(t, b.x), bv = (b.y - YT) / (YB - YT);
    const line = t === 1 ? M.opp.line : ((X.prefs.p | 0) - 1) * 0.05;
    const fs = t === 0 ? (X.prefs.f === 1 ? 0.08 : X.prefs.f === 2 ? -0.08 : 0) : 0;
    let u = fs + p.bu + (bu - 0.5) * 0.36 + (hasPoss ? 0.17 : -0.06) + line * (hasPoss ? 0 : 1);
    let v = p.bv + (bv - 0.5) * 0.4;
    if (hasPoss && p.role === "FWD") v = clamp(bv + (p.bv - 0.5) * 0.9 + Math.sin(M.tick * 0.02 + p.i) * 0.2, 0.12, 0.88);
    if (hasPoss && p.role === "MID") v = clamp(bv + (bv < 0.5 ? 0.22 : -0.22), 0.15, 0.85);
    const lim = (p.role === "DEF" ? [0.1, 0.56] : p.role === "MID" ? [0.22, 0.8] : [0.36, 0.93]).map((v) => v + fs * 0.75);
    u = clamp(u, lim[0], lim[1]);
    v = clamp(v, 0.08, 0.92);
    return { x: xOfU(t, u), y: yOfV(v) };
  }

  function updateAI(p) {
    const b = M.ball, D = M.D;
    if (p.stun > 0) { integrate(p); return; }
    if (p.isGK) { gkUpdate(p); integrate(p); return; }
    if (p.frozen) { p.vx *= 0.8; p.vy *= 0.8; integrate(p); return; }
    if (b.owner === p) { aiCarrier(p); integrate(p); return; }
    if (b.passTo === p && !b.owner) {
      const q = predictBall(Math.min(26, dist(p.x, p.y, b.x, b.y) / 6));
      moveTo(p, q.x, q.y, 1.05, true); integrate(p); return;
    }
    const ownerTeam = b.owner ? b.owner.team : -1;
    const ch = M.chase[p.team];
    const press = p.team === 1 ? M.opp.press : [150, 220, 300][X.prefs.p | 0] || 220;
    if (ownerTeam !== p.team) {
      const ref = b.owner ? b.owner : predictBall(8);
      const dRef = dist(p.x, p.y, ref.x, ref.y);
      if (p === ch[0] && (dRef < press + 160 || !b.owner)) {
        let tx = ref.x, ty = ref.y;
        if (b.owner && dRef > 60) { tx += dirOf(p.team) * -0.0 + (ownX(p.team) - ref.x) * 0.06; }
        moveTo(p, tx, ty, 1.0, true);
      } else if (p === ch[1] && p.role !== "FWD" && dRef < press) {
        const tx = ref.x + (ownX(p.team) - ref.x) * 0.3, ty = ref.y + (GM - ref.y) * 0.25;
        moveTo(p, tx, ty, 0.95);
      } else {
        const f = formationTarget(p, false); moveTo(p, f.x, f.y, 0.9);
      }
      // piccolo marcamento su avversario libero davanti alla porta
    } else {
      const f = formationTarget(p, true);
      moveTo(p, f.x, f.y, 0.95);
    }
    void D;
    integrate(p);
  }

  function aiCarrier(p) {
    const b = M.ball, D = M.D, t = p.team;
    const gx = goalXOf(t);
    if (M.state === "restart" || M.state === "kickoff") { p.vx *= 0.7; p.vy *= 0.7; return; }
    if (p.think > 0) {
      p.think--;
      const tg = p.dribT || { x: gx, y: GM };
      moveTo(p, tg.x, tg.y, 0.92, true);
      return;
    }
    p.think = D.react + Math.floor(Math.random() * 6);
    if (t === 0) p.think = 28;
    const dg = dist(p.x, p.y, gx, GM);
    const shootRange = t === 1 ? M.opp.shoot - 40 + M.diffIdx * 20 : 340;
    const near = threatAt(p, p.x, p.y);
    if (t === 1 && dg < shootRange && laneClear(p, gx, GM, 26) && Math.abs(p.y - GM) < 260 && (uOf(t, p.x) > 0.6)) { aiShoot(p); return; }
    if (t === 1 && dg < 190) { aiShoot(p); return; }
    const pass = bestPass(p);
    const gkOwn = p.isGK;
    if (pass && (gkOwn || (near < 58 && pass.score > 0.15) || (pass.score > 1.15 && Math.random() < 0.45))) {
      if (t === 0 && M.ctl === p) return;
      doPass(p, pass.m, 1); return;
    }
    // dribbling con schivata
    let tx = gx, ty = GM + (p.y < GM ? -30 : 30) * 0;
    ty = p.y + (GM - p.y) * 0.4;
    let ax = 0, ay = 0;
    M.tm[1 - t].forEach((q) => {
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
      if (d < 120 && dx * dirOf(t) > -10) { const w = (120 - d) / 120; ay -= Math.sign(dy || (Math.random() - 0.5)) * w * 190; ax -= dirOf(t) * w * 20; }
    });
    p.dribT = { x: clamp(tx + ax, XL, XR), y: clamp(ty + ay, YT + 20, YB - 20) };
    if (Math.abs(p.x - ownX(t)) < 100 && near < 70 && !gkOwn) { // sbarazzati
      p.dribT = { x: p.x + dirOf(t) * 300, y: p.y < GM ? YT + 40 : YB - 40 };
    }
  }

  // Punto della linea di porta che divide a metà l'angolo palla-pali (portiere centrato sull'angolo di tiro)
  function gkAngleY(bx, by, gxl) {
    const dx = Math.abs(bx - gxl) + 1, dT = Math.hypot(dx, by - GT), dB = Math.hypot(dx, by - GB);
    return clamp(GT + GH * dT / (dT + dB), GT + 8, GB - 8);
  }
  // dove taglia la linea di porta il pallone in volo (con attrito), per la lettura del tiro
  function gkReadShot(b, gxl) {
    let x = b.x, y = b.y, vx = b.vx, vy = b.vy;
    const f = b.z > 0.5 || b.vz > 0 ? 0.995 : FR;
    for (let n = 1; n < 90; n++) {
      x += vx; y += vy; vx *= f; vy *= f;
      if ((vx > 0 && x >= gxl) || (vx < 0 && x <= gxl)) return { y, n };
    }
    return null;
  }

  function gkUpdate(g) {
    const b = M.ball, t = g.team;
    const D = t === 1 ? M.D : DIFFS[1];
    const dIn = dirOf(t);
    const gx = ownX(t);
    const reach = D.reach * (M.sp && !M.sp.def && M.sp.kind === "pen" && g.team === 1 ? 0.62 : 1) * (b.fire ? 0.62 : 1) * (g.reachMul || 1) * (g.dive > 0 ? (g.userKeeper ? 1.4 : 1.15) : 1);
    const gks = D.gk;
    if (b.owner === g) {
      g.hold--; g.vx *= 0.8; g.vy *= 0.8;
      if (g.hold <= 0 && M.state === "play") {
        const pass = bestPass(g);
        const m = pass ? pass.m : M.tm[t][3];
        const d = dist(g.x, g.y, m.x, m.y);
        kickBall(g, m.x, m.y, clamp(passSpeed(d), 9, 15), 1.4, { to: m, snd: 0.9 });
        M.lastPass = { from: g, to: m, t: M.t };
        if (t === 0) { M.ctl = m; M.ctlLock = 20; }
      }
      return;
    }
    if (g.userKeeper) { // portiere guidato dal giocatore (rigori subiti)
      let jy = clamp(input.jy + input.ky, -1, 1);
      if (SET.ctrl === "touch" && input.touchOn) jy = clamp((input.ty - g.y) / 30, -1, 1);
      if (g.dive > 0) { g.dive--; g.vy = g.diveDir * 9.5; } else g.vy += (jy * 4.4 - g.vy) * 0.4;
      g.vx += (gx + dIn * 22 - g.x) * 0.2 - g.vx * 0.5;
      g.y = clamp(g.y, GT - 34, GB + 34);
    }
    const toward = b.vx * -dIn > 1.5;
    const spd0 = Math.hypot(b.vx, b.vy);
    const pen = !!(M.sp && !M.sp.def && t === 1 && M.sp.kind === "pen");
    // posizione base: sulla linea di porta, centrato sull'angolo palla-pali
    let ty = gkAngleY(b.x, b.y, gx), tx = gx + dIn * 14, sp = gks;
    if (pen) ty = GM;
    const incoming = !g.userKeeper && !b.owner && toward && b.lastTeam !== t && spd0 > 6.5 && Math.abs(b.x - gx) < 760;
    if (!incoming) g.sh = null;
    if (g.userKeeper) { /* movimento già gestito */ }
    else if (incoming) {
      if (!g.sh) { // nuovo tiro: lettura con ritardo di reazione e errore che dipendono dalla difficoltà
        const rd = gkReadShot(b, gx + dIn * 14);
        const sh = g.sh = { rd, fr: Math.max(1, Math.round(pen ? 2 + (D.gr - 5) * 0.4 : D.gr) + Math.floor(Math.random() * 3) + (g.rxAdj || 0)), ty: null, k: 0 };
        if (rd) {
          const yT = rd.y;
          if (pen) { // rigore: tuffo da un lato; con probabilità pr legge il lato giusto, altrimenti va a caso
            const real = Math.abs(yT - GM) < 10 ? 0 : Math.sign(yT - GM);
            const side = Math.random() < D.pr ? (real || (Math.random() < 0.5 ? -1 : 1)) : (Math.random() < 0.5 ? -1 : 1);
            sh.ty = GM + side * rnd(34, 54);
          } else {
            // legge il tiro con probabilità gr_ (più bassa se il tiro è potente o di Rondine), altrimenti si tuffa a intuito
            const pRead = D.rd * clamp(1.3 - spd0 / 32, 0.5, 1) * (b.fire ? 0.6 : 1);
            if (Math.random() < pRead) sh.ty = clamp(yT + rnd(-1, 1) * D.ge, GT - 14, GB + 14);
            else sh.ty = GM + rnd(-1, 1) * (GH / 2 - 6);
          }
          sh.inGoal = yT > GT - 22 && yT < GB + 22;
        }
      }
      const sh = g.sh;
      sh.k++;
      if (sh.ty !== null && sh.inGoal && sh.k > sh.fr) {
        ty = sh.ty; sp = D.gd; tx = gx + dIn * 14;
        if (Math.abs(ty - g.y) > 12 && g.dive <= 0) g.dive = 12; // tuffo: raggio di parata maggiore
        if (g.dive > 0) g.dive--;
      }
    } else if (!b.owner && Math.abs(b.x - gx) < 120 && Math.abs(b.y - GM) < 130 && b.z < 20 && spd0 < 5) {
      ty = b.y; tx = b.x; sp = gks * 1.2; // esce a prendere la palla
    } else if (b.owner && b.owner.team !== t && !pen && M.state === "play") {
      // 1 contro 1: esce incontro all'attaccante solo se non ha difensori vicini
      const o = b.owner, dg = Math.abs(o.x - gx);
      if (dg < 240 && Math.abs(o.y - GM) < 190 && !M.tm[t].some((q) => q !== g && dist(q.x, q.y, o.x, o.y) < 110)) {
        const out = clamp((240 - dg) * 0.3, 0, 52);
        tx = gx + dIn * (14 + out); ty = ty + (o.y - ty) * clamp(out / 52, 0, 1) * 0.35; sp = gks * 1.3;
      }
    }
    ty = clamp(ty, GT - 20, GB + 20);
    const dx = tx - g.x, dy = ty - g.y, d = Math.hypot(dx, dy);
    if (!g.userKeeper && d > 1) { const gain = incoming && g.sh && g.sh.k > g.sh.fr ? 0.6 : 0.35; g.vx += (dx / d * Math.min(sp, d * 0.4) - g.vx) * gain; g.vy += (dy / d * Math.min(sp, d * 0.4) - g.vy) * gain; }
    if (t === 0) g.x = clamp(g.x, XL - 2, XL + BOX_D - 10); else g.x = clamp(g.x, XR - BOX_D + 10, XR + 2);
    // parata
    if (!b.owner && b.z < 40 && M.state === "play") {
      const dxB = Math.abs(b.x - g.x), dyB = Math.abs(b.y - g.y);
      if (dxB < 24 + Math.min(10, Math.abs(b.vx)) && dyB < reach && (b.lastTeam !== t)) {
        const sp0 = Math.hypot(b.vx, b.vy);
        M.saves[t]++;
        if (sp0 < 11 + (t === 1 ? M.diffIdx * 2 : 2) && !b.fire && Math.random() < 0.7) {
          b.owner = g; g.hold = 55; b.vx = b.vy = 0; b.passTo = null; b.at = 0; b.lastTeam = t; b.lastP = g;
          say(t === 1 ? "Parata! Presa sicura" : (M.ut ? g.name : "Sandro") + " la blocca!", 1200);
        } else {
          b.vx = dIn * Math.max(4, sp0 * 0.45); b.vy = (b.y - g.y) * 0.35 + rnd(-2.5, 2.5); b.vz = 1.5; b.at = 0; b.fire = 0; b.passTo = null; b.lastTeam = t; b.lastP = g;
          say("Parata in angolo!", 1100); M.shake = 4;
        }
        g.cd = 20;
        snd("playBounce"); spark(b.x, b.y, 10, "#fde68a", 3);
        if (t === 0) addGrinta(6);
        if (M.sp) spEnd("save");
        else if (Math.random() < 0.5) say(quip("save"), 1700);
      }
    }
  }

  // ---------------------------------------------------------------- utente
  function userUpdate(p) {
    const b = M.ball, D = M.D;
    if (p.stun > 0) { integrate(p); return; }
    if (M.sp && M.sp.lock && b.owner === p) { // calcio piazzato: il battitore è fermo, mira con lo stick
      p.vx = p.vy = 0; p.face = Math.atan2(GM - p.y, XR - p.x); return;
    }
    let jx = input.jx + input.kx, jy = input.jy + input.ky, mag = Math.hypot(jx, jy);
    if (input.touchOn && SET.ctrl === "touch") {
      const dx = input.tx - p.x, dy = input.ty - p.y, d = Math.hypot(dx, dy);
      if (d > 10) { jx = dx / d; jy = dy / d; mag = Math.min(1, d / 40); } else { jx = jy = mag = 0; }
    }
    if (mag > 1) { jx /= mag; jy /= mag; mag = 1; }
    const wantSprint = input.sprint && mag > 0.2 && !M.stamLock && M.stam > 0;
    const sf = p.ut ? p.ut.sta : 0; // resistenza della carta: consuma meno fiato (e lo recupera prima)
    if (wantSprint) { M.stam = Math.max(0, M.stam - 0.0075 * (1 - UTK.sta * sf)); if (M.stam <= 0.01) M.stamLock = true; }
    else { M.stam = Math.min(1, M.stam + 0.004 * (1 + UTK.sta * 0.8 * sf)); if (M.stamLock && M.stam > 0.3) M.stamLock = false; }
    let sp = p.spd * (wantSprint ? 1.34 : 1) * (b.owner === p ? 0.94 : 1);
    if (p.lunge > 0) {
      p.lunge--;
      const a = p.face; p.vx = Math.cos(a) * p.spd * 2.4; p.vy = Math.sin(a) * p.spd * 2.4;
      if (p.lunge === 0) { p.stun = 16; }
    } else if (mag > 0.12) {
      const m2 = Math.min(1, mag * 1.15);
      p.vx += (jx / mag * sp * m2 - p.vx) * 0.28; p.vy += (jy / mag * sp * m2 - p.vy) * 0.28;
    } else { p.vx *= 0.7; p.vy *= 0.7; }
    if (wantSprint && Math.random() < 0.35) M.parts.push({ x: p.x - p.vx * 2, y: p.y + 8, vx: -p.vx * 0.1, vy: -0.3, life: 14, max: 14, col: "rgba(214,200,160,.7)", size: 3 });
    integrate(p);
    if (b.owner === p) { input.userMag = mag; }
  }

  function userActions() {
    const p = M.ctl, b = M.ball;
    if (M.sp && M.sp.def) { // portiere dei rigori: tuffo con PASSA o TIRO
      if ((input.passEdge || input.shootRel) && p && p.dive <= 0 && M.state === "play") {
        const jy = input.jy + input.ky;
        p.diveDir = Math.abs(jy) > 0.2 ? Math.sign(jy) : (b.y < p.y ? -1 : 1); p.dive = 11; snd("playTackle");
      }
      input.passEdge = false; input.shootRel = false; input.rond = false; input.charging = false;
      return;
    }
    if (!p || M.state !== "play") { input.passEdge = false; input.shootRel = false; input.rond = false; if (M.state !== "kickoff") { return; } }
    // calcio d'inizio: qualunque azione
    const near = dist(p.x, p.y, b.x, b.y) < 34 && b.z < 28;
    const hasBall = b.owner === p;
    const canTouch = hasBall || (near && !b.owner && p.cd <= 0);
    if (input.passEdge) {
      input.passEdge = false;
      if (canTouch) {
        let dh = null;
        const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
        if (mg > 0.3) dh = { x: jx / mg, y: jy / mg };
        const bp = bestPass(p, dh) || bestPass(p);
        if (bp) { doPass(p, bp.m, 1); addGrinta(2); }
      } else if (p.lungeCd <= 0 && p.stun <= 0 && p.lunge <= 0) {
        p.lunge = 13; p.lungeCd = 50;
        const tx = b.owner ? b.owner.x : b.x, ty = b.owner ? b.owner.y : b.y;
        if (Math.hypot(tx - p.x, ty - p.y) < 220) p.face = Math.atan2(ty - p.y, tx - p.x);
        snd("playTackle");
      }
    }
    if (input.charging) input.chargeF++;
    if (input.shootRel) {
      input.shootRel = false;
      const ch = clamp(input.chargeF / 42, 0.18, 1);
      input.chargeF = 0;
      if (canTouch) { userShoot(p, ch, false); }
    }
    if (input.rond) {
      input.rond = false;
      if (M.grinta >= 100 && canTouch) userShoot(p, 1, true);
    }
    // lunge: contatto con portatore
    if (p.lunge > 0) {
      const o = b.owner;
      if (o && o.team !== p.team && dist(p.x, p.y, o.x, o.y) < 24 && p.cd <= 0) { steal(p, o); p.lunge = 0; p.stun = 4; }
      else if (!o && dist(p.x, p.y, b.x, b.y) < 24 && b.z < 20) { b.owner = p; b.passTo = null; b.lastTeam = p.team; b.lastP = p; p.lunge = 0; }
    }
  }

  function steal(q, o) {
    const b = M.ball;
    b.owner = q; b.passTo = null; b.at = 0; b.lastTeam = q.team; b.lastP = q;
    o.stun = 18; o.cd = 40; q.cd = 14;
    snd("playTackle"); spark(o.x, o.y, 8, "#e2d5a8", 2.5);
    if (q.team === 0) { addGrinta(7); say("Palla recuperata!", 800); M.ctl = q; M.ctlLock = 10; M.st.steals++; }
    else { setLabel("Palla persa"); }
  }

  // ---------------------------------------------------------------- fisica palla e fuori
  function updateBall() {
    const b = M.ball;
    b.rot += Math.hypot(b.vx, b.vy) * 0.08;
    if (b.owner) {
      const o = b.owner;
      const wob = Math.sin(o.ph * 1.6) * 2;
      const ox = o.x + Math.cos(o.face) * (15 + wob), oy = o.y + Math.sin(o.face) * (15 + wob);
      b.x += (ox - b.x) * 0.5; b.y += (oy - b.y) * 0.5; b.vx = o.vx; b.vy = o.vy; b.z = 0; b.vz = 0; b.lastTeam = o.team; b.lastP = o;
      b.fire = 0; b.at = 0;
      // contrasti
      M.tm[1 - o.team].forEach((q) => {
        if (q.isGK || q.cd > 0 || q.stun > 0 || q === M.ctl) return;
        const d = dist(q.x, q.y, o.x, o.y);
        if (d < 20) {
          const base = q.team === 1 ? M.D.tkl * q.tkMul : 0.035 * q.tkMul;
          const sh = o === M.ctl && input.sprint && !M.stamLock ? 0.7 : 1;
          if (Math.random() < base * sh) steal(q, o); else if (Math.random() < 0.02) q.cd = 12;
        }
      });
      // portiere avversario prende palla in area se sbaglia? no
      return;
    }
    // palla libera
    const ground = b.z <= 0.01 && b.vz <= 0;
    let sp = Math.hypot(b.vx, b.vy);
    if (b.at > 0 && sp > 1) {
      b.at--;
      let ang = b.curl || 0;
      if (b.atTeam === 0) {
        const jx = input.jx + input.kx, jy = input.jy + input.ky;
        const cross = (b.vx * jy - b.vy * jx) / sp;
        const g = b.fire ? 0.034 : 0.026;
        ang += clamp(cross, -1, 1) * g;
        if (Math.abs(cross) > 0.3) { b.userCurved = 8; b.curved = true; }
      }
      if (ang) { const c = Math.cos(ang), s = Math.sin(ang); const nx = b.vx * c - b.vy * s, ny = b.vx * s + b.vy * c; b.vx = nx; b.vy = ny; }
    }
    const f = ground ? FR : 0.995;
    b.vx *= f; b.vy *= f;
    b.x += b.vx; b.y += b.vy;
    if (b.z > 0 || b.vz > 0) {
      b.vz -= 0.28; b.z += b.vz;
      if (b.z <= 0) { b.z = 0; if (b.vz < -1.4) { b.vz = -b.vz * 0.5; snd("playBounce"); } else b.vz = 0; }
    }
    if (b.fire || Math.hypot(b.vx, b.vy) > 13) { b.trail.unshift({ x: b.x, y: b.y, z: b.z }); if (b.trail.length > 10) b.trail.pop(); } else if (b.trail.length) b.trail.pop();
    if (b.fire && Math.random() < 0.6) M.parts.push({ x: b.x, y: b.y - b.z, vx: rnd(-.5, .5), vy: rnd(-.5, .5), life: 20, max: 20, col: "#fb923c", size: 3 });
    if (b.lastTeam === 0 && b.passTo && b.passTo.team === 0) { /* in volo verso compagno */ }
    checkBounds();
  }

  function checkBounds() {
    const b = M.ball;
    if (M.state !== "play") return;
    if (b.y < YT || b.y > YB) { outSide(); return; }
    if (b.x < XL || b.x > XR) {
      const left = b.x < XL;
      const defTeam = left ? 0 : 1;
      const scoreFor = 1 - defTeam;
      if (b.y > GT && b.y < GB && b.z < 46) {
        // pali
        if (Math.abs(b.y - GT) < 5 || Math.abs(b.y - GB) < 5) {
          b.x = left ? XL : XR; b.vx = -b.vx * 0.55; b.vy += (b.y < GM ? -1 : 1) * 2.2;
          snd("playPost"); M.shake = 6; say("PALO!", 900); spark(b.x, b.y, 10, "#fff", 3);
          return;
        }
        goalScored(scoreFor);
        return;
      }
      if (b.z >= 46 && b.y > GT && b.y < GB) say("Sopra la traversa!", 900);
      outEnd(defTeam);
    }
  }

  function restartAt(taker, x, y, label) {
    const b = M.ball;
    taker.x = x; taker.y = y; taker.vx = taker.vy = 0; taker.stun = 0;
    taker.face = Math.atan2(GM - y, W / 2 - x) * 0.5 + (taker.team === 0 ? 0 : Math.PI) * 0.0;
    taker.face = taker.team === 0 ? 0 : Math.PI;
    b.x = x; b.y = y; b.vx = b.vy = 0; b.z = 0; b.vz = 0; b.owner = taker; b.passTo = null; b.at = 0; b.fire = 0; b.trail.length = 0; b.lastTeam = taker.team; b.lastP = taker;
    taker.think = 12; taker.cd = 0;
    if (taker.team === 0 && !taker.isGK) { M.ctl = taker; }
    M.state = "restart"; M.timer = 44; setLabel(label);
    snd("playWhistle", false);
  }
  function nearest(team, x, y, noGK) {
    let best = null, bd = 1e9;
    M.tm[team].forEach((p) => { if (noGK && p.isGK) return; const d = dist(p.x, p.y, x, y); if (d < bd) { bd = d; best = p; } });
    return best;
  }
  function outSide() {
    const b = M.ball;
    if (M.sp) { spOut(); return; }
    const team = 1 - b.lastTeam;
    const x = clamp(b.x, XL + 30, XR - 30), y = b.y < YT ? YT + 2 : YB - 2;
    const tk = nearest(team, x, y, true);
    restartAt(tk, x, y, "Rimessa laterale");
  }
  function outEnd(defTeam) {
    const b = M.ball;
    if (M.sp) { spOut(); return; }
    if (b.lastTeam === defTeam) {
      // calcio d'angolo per l'attacco
      const att = 1 - defTeam;
      const cx = defTeam === 0 ? XL + 4 : XR - 4, cy = b.y < GM ? YT + 4 : YB - 4;
      const tk = nearest(att, cx, cy, true);
      restartAt(tk, cx, cy, "Calcio d'angolo");
    } else {
      const g = M.tm[defTeam][0];
      restartAt(g, xOfU(defTeam, 0.07), GM, "Rinvio dal fondo");
      g.hold = 50;
    }
  }

  function pickups() {
    const b = M.ball;
    if (b.owner || M.state !== "play" || b.z > 20) return;
    let best = null, bd = 1e9;
    const sp = Math.hypot(b.vx, b.vy);
    M.pl.forEach((p) => {
      if (p.stun > 0 || p.cd > 0 || p.lunge > 0) return;
      if (p.isGK) {
        const inBox = p.team === 0 ? b.x < XL + BOX_D && b.y > BOX_T && b.y < BOX_B : b.x > XR - BOX_D && b.y > BOX_T && b.y < BOX_B;
        if (!(inBox && sp < 6)) return;
      }
      let R = 15;
      if (b.passTo === p) R = 24;
      if (p === M.ctl) R = 21;
      if (sp > 14) R -= 4;
      const d = dist(p.x, p.y, b.x, b.y);
      if (d < R && d < bd) { bd = d; best = p; }
    });
    if (best && M.sp) {
      if (M.sp.def ? best.team === 0 : best.team === 1) { b.owner = best; b.vx = b.vy = 0; spEnd(best.isGK ? "save" : "block"); return; }
    }
    if (best) {
      const prev = b.lastTeam;
      b.owner = best; b.passTo = null; b.at = 0; b.fire = 0; b.lastTeam = best.team; b.lastP = best;
      if (best.team === 0 && !best.isGK) { M.ctl = best; if (M.lastPass && M.lastPass.to === best && prev === 0) { addGrinta(4); if ((M.lastPass.from.i === 3 && best.i === 4) || (M.lastPass.from.i === 4 && best.i === 3)) { addGrinta(5); say(M.ut ? "Una-due!" : "Una-due Leo-Nico!", 900); } } }
      if (best.isGK) best.hold = 40;
    }
  }

  // ---------------------------------------------------------------- gol
  function goalScored(team) {
    const b = M.ball;
    if (M.sp) { spGoal(team); return; }
    M.score[team]++;
    if (team === 0) { if (b.fire) M.st.rond++; if (b.curved) M.st.curve++; }
    M.state = "goal"; M.goalPhase = 0; M.goalTimer = 0;
    const scorer = b.lastTeam === team ? b.lastP : null;
    M.lastScorer = scorer; M.goalTeam = team;
    M.goalsLog.push({ team, t: M.t, who: scorer ? scorer.name : "?" });
    M.shake = 12; M.flash = 10;
    spark(b.x, b.y, 40, team === 0 ? "#7dd3fc" : "#fca5a5", 5);
    snd("playGoal");
    const min = clockMin();
    const nm = scorer ? scorer.name : "Autorete";
    if (team === 0) {
      banner("GOOOL!", `${nm} · ${min}'`, false, 2200);
      addGrinta(0);
    } else {
      banner("GOL " + M.opp.tag, `${nm} · ${min}'`, true, 1800);
      addGrinta(12);
    }
    if (team === 0 && !M.ut) PROG.goals++;
    let lv = false;
    if (M.mode === "surv") { if (team === 1) M.lives--; else if (M.score[0] % 2 === 0) { survLevelUp(); lv = true; } }
    if (!lv && M.mode !== "train" && Math.random() < 0.65) later(() => { if (M && !closed && uiState === "play") say(quip(team === 0 ? "goalFor" : "goalAg"), 2300); }, 700);
    b.owner = null; b.at = 0; b.fire = 0;
    b.vx *= 0.35; b.vy *= 0.2; b.passTo = null;
    // pool snapshot per replay
    M.repFrames = Math.min(M.fcount, 120);
    M.repEnd = M.fi;
  }
  function clockMin() { const L = M.len || MATCH_SECS; const f = M.golden ? 90 + Math.floor((M.t - L) / GOLDEN_SECS * 6) : Math.floor(M.t / L * 90); return Math.max(1, f); }

  function banner(h, p, bad, ms) {
    const el = stage.querySelector(".ahd-banner");
    if (!el) return;
    el.className = "ahd-banner" + (bad ? " bad" : "");
    el.innerHTML = `<div class="ahd-bg"><h1>${h}</h1><p>${p || ""}</p></div>`;
    el.style.display = "block";
    M.bannerT = Math.round(ms / 16.67);
  }

  // ---------------------------------------------------------------- frame snapshot (replay)
  function snap() {
    const b = M.ball, f = M.frames, o = M.fi * 44;
    f[o] = b.x; f[o + 1] = b.y; f[o + 2] = b.z; f[o + 3] = b.rot;
    for (let i = 0; i < 10; i++) { const p = M.pl[i]; const k = o + 4 + i * 4; f[k] = p.x; f[k + 1] = p.y; f[k + 2] = p.face; f[k + 3] = p.ph; }
    M.fi = (M.fi + 1) % 150; M.fcount = Math.min(150, M.fcount + 1);
  }

  // ---------------------------------------------------------------- step principale
  function step() {
    M.tick++;
    if (M.shake > 0) M.shake *= 0.9;
    if (M.flash > 0) M.flash--;
    if (M.msgT > 0 && --M.msgT === 0) { const el = stage.querySelector(".ahd-msg"); if (el) el.style.display = "none"; }
    if (M.bannerT > 0 && --M.bannerT === 0) { const el = stage.querySelector(".ahd-banner"); if (el) el.style.display = "none"; }
    if (M.labelT > 0) M.labelT--;
    if (M.hintCurve > 0) M.hintCurve--;
    for (let i = M.parts.length - 1; i >= 0; i--) { const q = M.parts[i]; q.x += q.vx; q.y += q.vy; q.vy += 0.04; q.life--; if (q.life <= 0) M.parts.splice(i, 1); }
    if (M.ctlLock > 0) M.ctlLock--;

    const st = M.state;
    if (st === "full" || st === "half") return;
    if (M.sp) { stepSP(); return; }

    if (st === "kickoff") {
      M.timer--;
      M.pl.forEach((p) => { integrate(p); });
      updateBall();
      const kp = M.kickTeam === 0 && M.ball.owner === M.ctl;
      if (M.timer <= 0 || (kp && (input.passEdge || input.shootRel || Math.abs(input.jx + input.kx) + Math.abs(input.jy + input.ky) > 0.3 || input.touchOn))) {
        M.state = "play"; M.timer = 0;
        const k = M.ball.owner; if (k && k.team === 1) k.think = 6;
      }
      return;
    }
    if (st === "restart") {
      M.timer--;
      updateBall();
      if (M.timer <= 0) M.state = "play";
      return;
    }
    if (st === "goal") { stepGoal(); return; }

    // ---- play
    M.t += STEP * (DEBUG && window.__ahdTS ? window.__ahdTS : 1);
    if (M.mode === "train" && M.grinta < 100) M.grinta = Math.min(100, M.grinta + 0.3);
    if (M.halfT && !M.halfDone && M.t >= M.halfT && !M.golden) {
      M.halfDone = true; M.state = "half"; banner("INTERVALLO", `${M.score[0]} - ${M.score[1]}`, false, 1800);
      snd("playWhistle", true); say(quip("half"), 1800);
      later(() => { if (closed || !M) return; setupKickoff(1); }, 1900);
      return;
    }
    if (M.len && M.t >= M.len && !M.golden) {
      if (M.score[0] === M.score[1] && !M.noGolden) { M.golden = true; banner("SUPPLEMENTARI", "Gol d'oro: il prossimo vince!", false, 1900); snd("playWhistle", true); }
      else { endMatch(); return; }
    }
    if (M.golden && M.t >= M.len + GOLDEN_SECS) { endMatch(); return; }

    chooseControl();
    computeChasers();
    M.pl.forEach((p) => { if (p === M.ctl) userUpdate(p); else updateAI(p); });
    separate();
    updateBall();
    userActions();
    pickups();
    snap();
    // hint tutorial
    if (M.mi <= 0 && !M.hintShot && M.ball.owner === M.ctl && uOf(0, M.ctl.x) > 0.62) { M.hintShot = true; say("Tieni TIRO per caricare, rilascia per calciare!", 2600); }
  }

  function chooseControl() {
    const b = M.ball, t0 = M.tm[0];
    if (b.owner && b.owner.team === 0 && !b.owner.isGK) { M.ctl = b.owner; return; }
    if (b.passTo && b.passTo.team === 0 && !b.owner) { M.ctl = b.passTo; return; }
    if (M.ctlLock > 0 && !M.ctl.isGK) return;
    const ref = b.owner ? b.owner : predictBall(8);
    let best = null, bd = 1e9;
    t0.forEach((p) => { if (p.isGK) return; const d = dist(p.x, p.y, ref.x, ref.y); if (d < bd) { bd = d; best = p; } });
    if (!best) return;
    const cd = M.ctl && !M.ctl.isGK ? dist(M.ctl.x, M.ctl.y, ref.x, ref.y) : 1e9;
    if (best !== M.ctl && (bd < cd - 34 || M.ctl.isGK)) { M.ctl = best; M.ctlLock = 14; }
  }

  function separate() {
    const pl = M.pl;
    for (let i = 0; i < pl.length; i++) for (let j = i + 1; j < pl.length; j++) {
      const a = pl[i], c = pl[j];
      if (a.isGK || c.isGK) continue;
      const dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy);
      if (d < 22 && d > 0.01) { const o = (22 - d) * 0.25; a.x -= dx / d * o; a.y -= dy / d * o; c.x += dx / d * o; c.y += dy / d * o; }
    }
  }

  function stepGoal() {
    M.goalTimer++;
    const b = M.ball;
    // la palla continua a rotolare in rete
    b.vx *= 0.9; b.vy *= 0.9; b.x += b.vx; b.y += b.vy;
    b.x = clamp(b.x, XL - 32, XR + 32); b.y = clamp(b.y, GT + 4, GB - 4);
    if (b.z > 0 || b.vz > 0) { b.vz -= 0.28; b.z = Math.max(0, b.z + b.vz); if (b.z === 0) b.vz = 0; }
    M.pl.forEach((p) => { if (M.goalTeam === 0 && p.team === 0 && !p.isGK && M.goalTimer < 80) { const tx = M.lastScorer ? M.lastScorer.x : p.x; void tx; p.vx *= 0.9; } integrate(p); });
    if (M.goalPhase === 0 && M.goalTimer > 55) {
      if (M.goalTeam === 0 && M.repFrames > 20) { M.goalPhase = 1; M.rep = { i: Math.max(0, M.repFrames - 120), n: M.repFrames, pos: 0 }; M.rep.i = 0; M.rep.start = M.repFrames > 110 ? 110 : M.repFrames; M.rep.f = 0; M.rep.total = Math.min(M.repFrames, 110); const rp = stage.querySelector(".ahd-rep"); if (rp) rp.style.display = "block"; }
      else { M.goalPhase = 2; }
    }
    if (M.goalPhase === 1) {
      M.rep.f += 0.7;
      if (M.rep.f >= M.rep.total - 1 || input.skip) { input.skip = false; endReplay(); }
    }
    if (M.goalPhase === 2) { M.goalTimer2 = (M.goalTimer2 || 0) + 1; if (M.goalTimer2 > 35) { M.goalTimer2 = 0; afterGoal(); } }
  }
  function endReplay() {
    M.rep = null; M.goalPhase = 2; M.goalTimer2 = 0;
    const rp = stage.querySelector(".ahd-rep"); if (rp) rp.style.display = "none";
  }
  function afterGoal() {
    if (M.golden) { endMatch(); return; }
    if (M.mode === "surv" && M.lives <= 0) { endMatch(); return; }
    const el = stage.querySelector(".ahd-banner"); if (el) el.style.display = "none";
    setupKickoff(1 - M.goalTeam);
  }

  // ---------------------------------------------------------------- fine partita
  function endMatch() {
    if (M.ended) return;
    M.ended = true; M.state = "full";
    snd("playWhistle", true);
    const [a, c] = M.score;
    banner("FISCHIO FINALE", `${a} - ${c}`, false, 2200);
    later(() => { if (!closed) showResult(); }, 1700);
  }

  // ---------------------------------------------------------------- sopravvivenza: ondate
  function survLevelUp() {
    M.level++;
    const o = ALLT[(M.level - 1) % ALLT.length];
    M.opp = o;
    M.D.react = Math.max(5, M.D.react - 1.5); M.D.noise = Math.max(14, M.D.noise - 4); M.D.tkl *= 1.05; M.D.gk += 0.1;
    M.tm[1].forEach((p, i) => { p.name = o.names[i]; p.kit = i === 0 ? o.gk : o.kit; p.kit2 = i === 0 ? "#111827" : o.kit2; p.spd *= 1.025; p.tkMul = o.tkl; });
    say("🎙 Ondata " + M.level + ": arrivano " + o.name + "!", 2600);
  }

  // ---------------------------------------------------------------- calci piazzati e rigori
  const SP_NAMES = { pen: "Rigore", pend: "Rigore da parare", fk: "Punizione", cor: "Calcio d'angolo" };
  const SP_LIM = { pen: 150, pend: 150, fk: 420, cor: 560 };
  const SP_HINT = {
    pen: "Rigore: stick su/giù per scegliere l'angolo, tieni TIRO e rilascia",
    pend: "Para! Stick su/giù per muoverti, PASSA o TIRO per il tuffo",
    fk: "Punizione: carica a metà per scavalcare la barriera, poi curva con lo stick",
    cor: "Angolo: PASSA a Nico per l'Intesa, oppure crossa con TIRO",
  };
  function spSetup(kind) {
    const b = M.ball, T = M.tm[0], O = M.tm[1], sp = M.sp;
    M.pl.forEach((p) => { p.vx = p.vy = 0; p.stun = 0; p.cd = 0; p.lunge = 0; p.hold = 0; p.think = 0; p.frozen = false; p.userKeeper = false; p.dive = 0; p.err = 0; p.errT = null; });
    Object.assign(sp, { kind, t: 0, rel: 0, rt: 0, done: false, res: null, def: false, lock: false, wait: 0, lim: SP_LIM[kind], taker: null, label: SP_NAMES[kind] });
    b.owner = null; b.vx = b.vy = 0; b.z = 0; b.vz = 0; b.at = 0; b.fire = 0; b.passTo = null; b.curl = 0; b.trail.length = 0; b.curved = false;
    input.charging = false; input.chargeF = 0; input.passEdge = false; input.shootRel = false; input.rond = false;
    M.parts.length = 0;
    const side = Math.random() < 0.5 ? -1 : 1;
    const leo = T[3], nico = T[4], gkU = T[0], gkO = O[0];
    T.forEach((p) => { p.face = 0; }); O.forEach((p) => { p.face = Math.PI; });
    gkU.x = XL + 22; gkU.y = GM; gkO.x = XR - 22; gkO.y = GM;
    T.forEach((p, i) => { if (!p.isGK) { p.x = xOfU(0, 0.34 + i * 0.015); p.y = yOfV(0.2 + i * 0.16); } });
    O.forEach((p, i) => { if (!p.isGK) { p.x = xOfU(0, 0.5 + i * 0.015); p.y = yOfV(0.18 + i * 0.17); } });
    const hold = (p, x, y) => { p.x = x; p.y = y; b.x = x + 15 * Math.cos(p.face); b.y = y + 15 * Math.sin(p.face); b.owner = p; b.lastP = p; b.lastTeam = p.team; };
    const freezeAll = () => M.pl.forEach((p) => { if (!p.isGK) p.frozen = true; });
    if (kind === "pend") {
      const k = O[4]; k.face = Math.PI; hold(k, XL + 135, GM);
      gkU.userKeeper = true; M.ctl = gkU; sp.def = true; sp.taker = k; sp.wait = 50 + Math.floor(Math.random() * 45);
      freezeAll();
    } else if (kind === "pen") {
      leo.face = 0; hold(leo, XR - 135, GM);
      M.ctl = leo; sp.lock = true; freezeAll();
    } else if (kind === "fk") {
      const d = rnd(250, 320), by = GM + side * rnd(70, 190), bx = XR - d;
      leo.face = Math.atan2(GM - by, XR - bx); hold(leo, bx - 15 * Math.cos(leo.face), by - 15 * Math.sin(leo.face));
      const ang = leo.face, wx = bx + Math.cos(ang) * 120, wy = by + Math.sin(ang) * 120;
      [1, 2, 3].forEach((k, j) => { const q = O[k]; q.x = wx - Math.sin(ang) * (j - 1) * 24; q.y = wy + Math.cos(ang) * (j - 1) * 24; });
      O[4].x = XR - 70; O[4].y = GM - side * 90;
      nico.x = XR - 140; nico.y = GM - side * 70;
      M.ctl = leo; sp.lock = true; freezeAll();
    } else { // cor
      const cy = side < 0 ? YT + 6 : YB - 6, cx = XR - 6;
      leo.face = Math.atan2(GM - cy, XR - 120 - cx); hold(leo, cx - 15 * Math.cos(leo.face), cy - 15 * Math.sin(leo.face));
      nico.x = XR - 105; nico.y = GM - side * 25;
      O[1].x = XR - 70; O[1].y = GM - 70; O[2].x = XR - 70; O[2].y = GM + 70; O[3].x = XR - 115; O[3].y = GM; O[4].x = XR - 215; O[4].y = GM + side * 30;
      T[1].x = XR - 260; T[1].y = GM - side * 60; T[2].x = XR - 330; T[2].y = GM + side * 80;
      M.ctl = leo; sp.lock = true;
    }
    M.state = "spready"; M.timer = 50;
    setLabel(sp.label); say(SP_HINT[kind], 2600);
    snd("playWhistle", false);
    M.camX = (b.x + 0) ; M.camY = b.y;
  }
  function stepSP() {
    const sp = M.sp, b = M.ball, st = M.state;
    if (st === "spready") {
      M.timer--; M.pl.forEach((p) => { p.vx *= 0.8; p.vy *= 0.8; integrate(p); }); updateBall();
      if (M.timer <= 0) M.state = "play";
      return;
    }
    if (st === "spwait") {
      M.timer--; updateBall();
      if (sp.res === "goal" || sp.res === "conceded") { b.x = clamp(b.x, XL - 32, XR + 32); b.y = clamp(b.y, GT + 4, GB - 4); b.vx *= 0.9; b.vy *= 0.9; }
      M.pl.forEach((p) => { p.vx *= 0.8; p.vy *= 0.8; integrate(p); });
      if (M.timer <= 0) { const nx = sp.next; sp.next = null; if (nx) nx(); }
      return;
    }
    if (st !== "play") return;
    sp.t++;
    if (sp.def && !sp.rel) { sp.wait--; if (sp.wait <= 0 && b.owner === sp.taker) aiPenaltyShot(); }
    if (!sp.rel && !b.owner) { sp.rel = 1; sp.rt = 0; }
    if (sp.rel) { sp.rt++; if (sp.rt > sp.lim) { spEnd("miss"); return; } }
    if (!sp.def) {
      if (b.owner && b.owner.team === 0 && !b.owner.isGK) M.ctl = b.owner;
      else if (b.passTo && b.passTo.team === 0 && !b.owner) M.ctl = b.passTo;
    }
    computeChasers();
    M.pl.forEach((p) => { if (p === M.ctl && !sp.def) userUpdate(p); else updateAI(p); });
    separate(); updateBall(); userActions(); pickups();
    if (M.sp && M.sp.def === false && b.owner && b.owner.team === 1 && !M.sp.done) spEnd(b.owner.isGK ? "save" : "block");
  }
  function aiPenaltyShot() {
    const k = M.sp.taker, d = M.diffIdx, side = Math.random() < 0.5 ? -1 : 1;
    const ay = GM + side * (Math.random() < 0.22 ? rnd(0, 14) : rnd(34, GH / 2 - 8));
    kickBall(k, XL, ay, [11.5, 13.2, 15][d] + rnd(-0.6, 0.8), 0.45, { snd: 1.1 });
    M.shots[1]++;
  }
  function spGoal(team) {
    const b = M.ball;
    M.shake = 10; M.flash = 8; spark(b.x, b.y, 30, team === 0 ? "#7dd3fc" : "#fca5a5", 5);
    spEnd(team === 0 ? "goal" : "conceded");
  }
  function spOut() { const sp = M.sp, b = M.ball; spEnd(b.lastTeam === (sp.def ? 0 : 1) ? "save" : "miss"); }
  function spEnd(res) {
    const sp = M.sp; if (!sp || sp.done) return;
    sp.done = true; sp.res = res; M.state = "spwait"; M.timer = 90; input.charging = false;
    const good = sp.def ? (res !== "conceded") : res === "goal";
    const head = { goal: "GOOOL!", conceded: "GOL " + M.opp.tag, save: sp.def ? "PARATO!" : "PARATA!", block: "BARRIERA!", miss: sp.def ? "FUORI!" : "FUORI!" }[res] || "";
    const sub = { goal: sp.label, conceded: sp.label, save: sp.def ? "Hai indovinato l'angolo" : "Il portiere ci arriva", block: "Troppo bassa: scavalca!", miss: sp.def ? "Ha sbagliato la mira" : "Un'altra volta" }[res] || "";
    banner(head, sub, !good, 1500);
    snd(res === "goal" || res === "conceded" ? "playGoal" : "playBounce");
    if (sp.onEnd) sp.onEnd(res);
  }
  function soKick(res) {
    const S = M.so, turn = M.sp.kind === "pen" ? 0 : 1;
    const ok = turn === 0 ? res === "goal" : res === "conceded";
    if (ok) S.sc[turn]++;
    S.n[turn]++; S.log[turn].push(ok);
    if (turn === 1 && res === "save") S.saved++;
    M.sp.next = soNext;
  }
  function soNext() {
    const S = M.so, n = S.n, sc = S.sc;
    let over;
    if (n[0] >= 5 && n[1] >= 5) over = n[0] === n[1] && sc[0] !== sc[1];
    else over = sc[0] > sc[1] + Math.max(0, 5 - n[1]) || sc[1] > sc[0] + Math.max(0, 5 - n[0]);
    if (n[0] + n[1] >= 30) over = true;
    if (over) { M.state = "full"; M.ended = true; snd("playWhistle", true); later(() => { if (!closed && M) showResult(); }, 600); return; }
    M.sp.onEnd = soKick;
    spSetup(n[0] <= n[1] ? "pen" : "pend");
  }
  function setpKick(res) {
    const S = M.setp;
    S.log.push({ kind: M.sp.kind, res }); if (res === "goal") S.goals++;
    M.sp.next = setpNext;
  }
  function setpNext() {
    const S = M.setp;
    if (S.i >= S.plan.length) { M.state = "full"; M.ended = true; snd("playWhistle", true); later(() => { if (!closed && M) showResult(); }, 500); return; }
    const kind = S.plan[S.i++];
    M.sp.onEnd = setpKick;
    spSetup(kind);
  }

  // ---------------------------------------------------------------- render
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; vigKey = ""; }
    return dpr;
  }

  function drawPlayer(g, p, isCtl, tick, x, y, face, ph) {
    const sp = Math.hypot(p.vx, p.vy);
    const moving = sp > 0.6;
    const sw = moving ? Math.sin(ph) * 4 : 0;
    g.fillStyle = "rgba(0,0,0,.33)"; g.beginPath(); g.ellipse(x, y + 11, 12, 5, 0, 0, 7); g.fill();
    if (isCtl) {
      g.strokeStyle = "#facc15"; g.lineWidth = 2.5; g.beginPath(); g.ellipse(x, y + 11, 17, 8, 0, 0, 7); g.stroke();
    }
    // gambe
    g.fillStyle = "#f1f5f9"; g.fillRect(x - 6, y + 2 + (sw > 0 ? 0 : 1), 4.5, 8 + sw * 0.4);
    g.fillRect(x + 1.5, y + 2 + (sw > 0 ? 1 : 0), 4.5, 8 - sw * 0.4);
    g.fillStyle = "#111827"; g.fillRect(x - 6, y + 9 + sw * 0.4, 5, 3); g.fillRect(x + 1.5, y + 9 - sw * 0.4, 5, 3);
    // maglia
    const lean = Math.cos(face) * 1.5;
    g.fillStyle = p.kit; g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10, 9.5, 0, 0, 7); g.fill();
    const pat = p.pat || "classic";
    if (pat === "classic") {
      g.strokeStyle = p.kit2; g.lineWidth = 2.4; g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10, 9.5, 0, 0.35, 2.8); g.stroke();
      g.fillStyle = p.kit2; g.fillRect(x - 10 + lean * 0.5, y - 6, 20, 2.6);
    } else if (pat !== "solid") {
      g.save(); g.beginPath(); g.ellipse(x + lean * 0.5, y - 5, 10, 9.5, 0, 0, 7); g.clip(); g.fillStyle = p.kit2;
      if (pat === "stripes") { for (let k = -8; k <= 8; k += 8) g.fillRect(x + lean * 0.5 + k - 2, y - 15, 4, 20); }
      else { g.fillRect(x - 11, y - 11, 22, 3.4); g.fillRect(x - 11, y - 4, 22, 3.4); }
      g.restore();
    }
    // braccia
    g.fillStyle = "#e8b88c"; g.beginPath(); g.arc(x - 10.5 + lean, y - 3 + sw * 0.3, 2.6, 0, 7); g.arc(x + 10.5 + lean, y - 3 - sw * 0.3, 2.6, 0, 7); g.fill();
    // testa
    g.fillStyle = "#e8b88c"; g.beginPath(); g.arc(x + lean, y - 16, 6.2, 0, 7); g.fill();
    g.fillStyle = p.team === 0 ? "#3b2314" : "#1f1a17"; g.beginPath(); g.arc(x + lean, y - 18, 6.4, Math.PI, 0); g.fill();
    g.fillStyle = "#111"; g.fillRect(x + lean + Math.cos(face) * 2.4 - 0.8, y - 16, 1.6, 1.8);
    if (p.stun > 0) { g.fillStyle = "#fde047"; g.font = "bold 10px sans-serif"; g.textAlign = "center"; g.fillText("✦", x + 4, y - 26 - Math.sin(tick * 0.4) * 2); }
    if (isCtl) {
      g.fillStyle = "#facc15"; const yy = y - 32 + Math.sin(tick * 0.18) * 2;
      g.beginPath(); g.moveTo(x - 6, yy - 8); g.lineTo(x + 6, yy - 8); g.lineTo(x, yy); g.closePath(); g.fill();
      g.font = "bold 11px system-ui"; g.textAlign = "center"; g.lineWidth = 3; g.strokeStyle = "rgba(0,0,0,.75)"; g.strokeText(p.name, x, yy - 12); g.fillStyle = "#fff"; g.fillText(p.name, x, yy - 12);
    }
  }

  function render() {
    const dpr = resize();
    const g = cx;
    const cw = cv.width / dpr, ch = cv.height / dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#07101c"; g.fillRect(0, 0, cw, ch);
    if (!M) return;
    if (!bgCache) bgCache = buildBg();
    const b = M.ball;

    // vista: replay o live
    let vb = { x: b.x, y: b.y, z: b.z, rot: b.rot }, vp = M.pl;
    if (M.rep) {
      const f = M.frames, n = M.repFrames, fi = Math.floor(M.rep.f);
      const idx = ((M.repEnd - Math.min(n, 110) + fi) % 150 + 150) % 150;
      const o = idx * 44;
      vb = { x: f[o], y: f[o + 1], z: f[o + 2], rot: f[o + 3] };
      if (!M._rp) M._rp = M.pl.map((p) => Object.assign({}, p));
      for (let i = 0; i < 10; i++) { const k = o + 4 + i * 4, q = M._rp[i], src = M.pl[i]; q.x = f[k]; q.y = f[k + 1]; q.face = f[k + 2]; q.ph = f[k + 3]; q.vx = src.vx * 0 + Math.cos(q.face) * 2; q.vy = Math.sin(q.face) * 2; q.stun = 0; }
      vp = M._rp;
    }

    // camera
    const s = Math.max(0.3, Math.min(cw / 520, ch / 380));
    const vw2 = cw / (2 * s), vh2 = ch / (2 * s);
    let fx = vb.x + (M.rep ? 0 : b.vx * 7), fy = vb.y + (M.rep ? 0 : b.vy * 4);
    if (!M.rep && M.ctl && M.state === "play") { fx = fx * 0.7 + M.ctl.x * 0.3; fy = fy * 0.7 + M.ctl.y * 0.3; }
    const minX = -MX + 20 + vw2, maxX = W + MX - 20 - vw2, minY = -90 + vh2, maxY = H + 70 - vh2;
    fx = minX > maxX ? W / 2 : clamp(fx, minX, maxX); fy = minY > maxY ? H / 2 : clamp(fy, minY, maxY);
    M.camX += (fx - M.camX) * (M.state === "kickoff" ? 0.2 : 0.12); M.camY += (fy - M.camY) * 0.12;
    if (M.tick < 3) { M.camX = fx; M.camY = fy; }
    let shx = 0, shy = 0;
    if (M.shake > 0.3) { shx = rnd(-1, 1) * M.shake; shy = rnd(-1, 1) * M.shake; }
    M.view = { s, cw, ch, cx: M.camX + shx / s, cy: M.camY + shy / s };

    g.save();
    g.translate(cw / 2, ch / 2); g.scale(s, s); g.translate(-M.view.cx, -M.view.cy);
    g.drawImage(bgCache, -MX, -MT);

    // etichette sul campo: marker obiettivo passaggio
    // ombra palla e traiettoria prevista del passaggio utente
    if (M.ctl && b.owner === M.ctl && M.state === "play") {
      const jx = input.jx + input.kx, jy = input.jy + input.ky, mg = Math.hypot(jx, jy);
      const bp = bestPass(M.ctl, mg > 0.3 ? { x: jx / mg, y: jy / mg } : null) || bestPass(M.ctl);
      M.passHint = bp ? bp.m : null;
      if (bp) {
        const m = bp.m;
        g.strokeStyle = "rgba(125,211,252,.85)"; g.lineWidth = 2.4; g.setLineDash([6, 6]); g.lineDashOffset = -M.tick * 0.5;
        g.beginPath(); g.ellipse(m.x, m.y + 11, 19, 9, 0, 0, 7); g.stroke(); g.setLineDash([]);
      }
      // freccia di mira
      const gx = goalXOf(0);
      if (Math.abs(M.ctl.x - gx) < 560) {
        const ay = GM + clamp(jy * 1.3, -1, 1) * (GH / 2 - 9);
        g.fillStyle = "rgba(248,113,113," + (input.charging ? 0.95 : 0.4) + ")";
        g.beginPath(); g.arc(gx, mg > 0.25 ? ay : GM, 7, 0, 7); g.fill();
      }
    } else M.passHint = null;

    // giocatori ordinati per y
    const order = vp.map((p, i) => ({ p, i, y: p.y })).sort((a, c) => a.y - c.y);
    const ballLayer = (zOrderY) => {
      // ombra
      g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.ellipse(vb.x, vb.y + 3, Math.max(3, 7 - vb.z * 0.05), Math.max(2, 3.4 - vb.z * 0.03), 0, 0, 7); g.fill();
      // scia
      if (!M.rep) b.trail.forEach((t, i) => { g.fillStyle = b.fire ? `rgba(251,146,60,${0.55 - i * 0.05})` : `rgba(255,255,255,${0.28 - i * 0.025})`; g.beginPath(); g.arc(t.x, t.y - 4 - t.z, 5.5 - i * 0.4, 0, 7); g.fill(); });
      const by = vb.y - 4 - vb.z;
      g.save(); g.translate(vb.x, by); g.rotate(vb.rot);
      g.fillStyle = b.fire && !M.rep ? "#fde68a" : (BALLS.find((q) => q.id === X.look.ball) || BALLS[0]).c; g.beginPath(); g.arc(0, 0, 6.2, 0, 7); g.fill();
      g.fillStyle = "#1f2937"; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 1.6, 0, 7); g.fill(); }
      g.beginPath(); g.arc(0, 0, 1.7, 0, 7); g.fill();
      g.restore();
      g.strokeStyle = "#111"; g.lineWidth = 1; g.beginPath(); g.arc(vb.x, by, 6.2, 0, 7); g.stroke();
      void zOrderY;
    };
    let ballDrawn = false;
    order.forEach((o) => {
      if (!ballDrawn && vb.y < o.y) { ballLayer(); ballDrawn = true; }
      drawPlayer(g, o.p, !M.rep && o.p === M.ctl && M.state !== "full", M.tick, o.p.x, o.p.y, o.p.face, o.p.ph);
    });
    if (!ballDrawn) ballLayer();

    // aftertouch hint
    if (!M.rep && M.hintCurve > 0 && b.at > 0 && !b.owner && b.atTeam === 0) {
      g.strokeStyle = "rgba(253,224,71,.9)"; g.lineWidth = 2.5; g.setLineDash([4, 5]);
      const sp = Math.hypot(b.vx, b.vy) || 1, nx = -b.vy / sp, ny = b.vx / sp;
      g.beginPath(); g.moveTo(b.x + nx * 22, b.y + ny * 22 - b.z); g.lineTo(b.x + nx * 40, b.y + ny * 40 - b.z); g.moveTo(b.x - nx * 22, b.y - ny * 22 - b.z); g.lineTo(b.x - nx * 40, b.y - ny * 40 - b.z); g.stroke(); g.setLineDash([]);
    }
    // particelle
    M.parts.forEach((q) => { g.globalAlpha = Math.max(0, q.life / q.max); g.fillStyle = q.col; g.beginPath(); g.arc(q.x, q.y, q.size, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    // barra di carica sopra il giocatore
    if (!M.rep && input.charging && M.ctl) {
      const c = clamp(input.chargeF / 42, 0, 1), px = M.ctl.x, py = M.ctl.y - 46;
      g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(px - 20, py, 40, 6);
      g.fillStyle = c > 0.85 ? "#ef4444" : "#fde047"; g.fillRect(px - 19, py + 1, 38 * c, 4);
    }
    g.restore();

    // vignette
    const key = cw + "x" + ch;
    if (vigKey !== key) {
      vigCache = g.createRadialGradient(cw / 2, ch / 2, Math.min(cw, ch) * 0.35, cw / 2, ch / 2, Math.max(cw, ch) * 0.75);
      vigCache.addColorStop(0, "rgba(0,0,0,0)"); vigCache.addColorStop(1, "rgba(0,0,0,.45)"); vigKey = key;
    }
    g.fillStyle = vigCache; g.fillRect(0, 0, cw, ch);
    if (M.flash > 0) { g.fillStyle = `rgba(255,255,255,${M.flash * 0.04})`; g.fillRect(0, 0, cw, ch); }

    if (M.rep) { g.fillStyle = "rgba(30,50,90,.22)"; g.fillRect(0, 0, cw, ch); g.fillStyle = "rgba(0,0,0,.12)"; for (let y = 0; y < ch; y += 4) g.fillRect(0, y, cw, 1); }
    drawMini(g, cw, ch, vb, vp);
    // etichetta evento
    if (M.labelT > 0 && M.label) {
      g.font = "bold 13px system-ui"; g.textAlign = "center";
      const tw = g.measureText(M.label).width + 24;
      g.fillStyle = "rgba(7,16,28,.78)"; g.fillRect(cw / 2 - tw / 2, 6, tw, 24);
      g.fillStyle = "#e2e8f0"; g.fillText(M.label, cw / 2, 23);
    }
    if (M.state === "kickoff" && M.timer > 0 && M.kickTeam === 0) {
      g.font = "bold 14px system-ui"; g.textAlign = "center"; g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(cw / 2 - 90, ch * 0.62, 180, 26);
      g.fillStyle = "#fde047"; g.fillText("Muoviti o passa per iniziare", cw / 2, ch * 0.62 + 18);
    }
  }

  function drawMini(g, cw, ch, vb, vp) {
    const mw = 92, mh = 58, mx = 6, my = ch - mh - 8 - 0;
    // posizione in basso a sinistra sopra lo stick? Mettiamo in alto a sinistra sotto etichetta.
    const x0 = mx, y0 = 8;
    void my;
    g.fillStyle = "rgba(10,60,28,.72)"; g.fillRect(x0, y0, mw, mh);
    g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 1; g.strokeRect(x0 + 0.5, y0 + 0.5, mw - 1, mh - 1);
    g.beginPath(); g.moveTo(x0 + mw / 2, y0); g.lineTo(x0 + mw / 2, y0 + mh); g.stroke();
    const mxp = (x) => x0 + (x / W) * mw, myp = (y) => y0 + (y / H) * mh;
    vp.forEach((p) => { g.fillStyle = p.team === 0 ? "#38bdf8" : "#f87171"; g.beginPath(); g.arc(mxp(p.x), myp(p.y), p === M.ctl ? 3 : 2, 0, 7); g.fill(); });
    g.fillStyle = "#fff"; g.beginPath(); g.arc(mxp(vb.x), myp(vb.y), 2, 0, 7); g.fill();
    if (M.view) { const v = M.view; g.strokeStyle = "rgba(250,204,21,.8)"; g.strokeRect(mxp(v.cx - v.cw / 2 / v.s), myp(v.cy - v.ch / 2 / v.s), (v.cw / v.s / W) * mw, (v.ch / v.s / H) * mh); }
  }

  // ---------------------------------------------------------------- HUD DOM
  const MODE_NAMES = { torneo: "Torneo", free: "Partita libera", surv: "Sopravvivenza", timed: "Sfida a tempo", pens: "Rigori", setp: "Calci piazzati", train: "Allenamento", season: "Campionato", cup: "Coppa", "cup-pens": "Coppa · rigori", ut: "Ultimate Team" };
  function hudInfo() {
    const o = M.opp, sc = M.score;
    let a = sc[0], c = sc[1], sub;
    const mn = M.state === "full" ? (M.golden ? "90+" : "90") : clockMin();
    const m = M.mode;
    if (m === "ut") sub = (M.golden ? "Supplementari " : "") + mn + "' · " + o.name + " · " + DIFFS[M.diffIdx].n;
    else if (m === "pens" || m === "cup-pens") {
      const S = M.so; a = S ? S.sc[0] : 0; c = S ? S.sc[1] : 0;
      const dots = (arr) => arr.map((r) => (r ? "●" : "✕")).join("") || "-";
      sub = (m === "cup-pens" ? "Rigori · " : "") + (S ? "Tu " + dots(S.log[0]) + " · " + o.tag + " " + dots(S.log[1]) : "");
    } else if (m === "setp") {
      const S = M.setp; a = S ? S.goals : 0; c = 0;
      sub = "Calci piazzati " + (S ? Math.min(S.i, S.plan.length) + "/" + S.plan.length : "");
    } else if (m === "surv") sub = "Sopravvivenza · ondata " + M.level + " · vite " + "♥".repeat(Math.max(0, M.lives)) + "♡".repeat(Math.max(0, 3 - M.lives)) + " · " + o.name;
    else if (m === "timed") sub = "Sfida a tempo · " + Math.max(0, Math.ceil(M.len - M.t)) + "s · " + o.name;
    else if (m === "train") sub = "Allenamento · " + o.name;
    else sub = (M.golden ? "Supplementari " : "") + mn + "' · " + o.name + " · " + DIFFS[M.diffIdx].n + (m === "season" ? " · Campionato" : m === "cup" ? " · Coppa" : "");
    const right = (m === "setp") ? "---" : o.tag;
    return { a, c, sub, right };
  }
  function hud() {
    if (!M || !root) return;
    const sc = root.querySelector(".ahd-sc");
    if (!sc) return;
    const h = hudInfo();
    sc.querySelector("b").innerHTML = `<span class="ahd-ta">RON</span> ${h.a} - ${h.c} <span class="ahd-tb">${h.right}</span>`;
    sc.querySelector("small").textContent = h.sub;
    const gb = root.querySelector(".ahd-bar.g");
    gb.firstElementChild.style.width = M.grinta + "%"; gb.classList.toggle("full", M.grinta >= 100);
    root.querySelector(".ahd-bar.s i").style.width = M.stam * 100 + "%";
    root.querySelector(".ahd-b.ron").classList.toggle("on", M.grinta >= 100 && M.state === "play" && !M.sp);
    const chg = root.querySelector(".ahd-chg");
    chg.style.display = input.charging ? "block" : "none"; chg.firstElementChild.style.width = clamp(input.chargeF / 42, 0, 1) * 100 + "%";
  }

  // ---------------------------------------------------------------- loop
  function loop(ts) {
    if (closed) return;
    raf = requestAnimationFrame(loop);
    if (!lastTs) lastTs = ts;
    let dt = (ts - lastTs) / 1000; lastTs = ts;
    if (dt > 0.1) dt = 0.1;
    if (M && uiState === "play" && !paused) {
      acc += dt;
      let n = 0;
      while (acc >= STEP && n < 5) { step(); acc -= STEP; n++; if (!M || closed) return; }
      if (n === 5) acc = 0;
      hud();
    } else acc = 0;
    render();
  }

  // ---------------------------------------------------------------- input
  function onKey(e, down) {
    if (closed) return;
    const k = e.key;
    let used = true;
    if (k === "ArrowUp" || k === "w" || k === "W") input.ky = down ? -1 : (input.ky < 0 ? 0 : input.ky);
    else if (k === "ArrowDown" || k === "s" || k === "S") input.ky = down ? 1 : (input.ky > 0 ? 0 : input.ky);
    else if (k === "ArrowLeft" || k === "a" || k === "A") input.kx = down ? -1 : (input.kx < 0 ? 0 : input.kx);
    else if (k === "ArrowRight" || k === "d" || k === "D") input.kx = down ? 1 : (input.kx > 0 ? 0 : input.kx);
    else if (k === "z" || k === "Z" || k === " ") { if (down && !e.repeat) input.passEdge = true; }
    else if (k === "x" || k === "X" || k === "Enter") {
      if (down && !e.repeat) { input.charging = true; input.chargeF = 0; input.keyShoot = true; }
      else if (!down && input.keyShoot) { input.charging = false; input.shootRel = true; input.keyShoot = false; }
    }
    else if (k === "Shift" || k === "c" || k === "C") input.sprint = down;
    else if ((k === "v" || k === "V") && down) input.rond = true;
    else if ((k === "p" || k === "P" || k === "Escape") && down) { if (uiState === "play") pauseGame(); }
    else used = false;
    if (used) e.preventDefault();
  }

  function bindPad() {
    const pad = root.querySelector(".ahd-pad"), stk = root.querySelector(".ahd-stk"), knob = stk.firstElementChild;
    const rect = () => stage.getBoundingClientRect();
    const R = 52;
    const toWorld = (cxp, cyp) => {
      const r = rect(), v = M && M.view; if (!v) return;
      input.tx = (cxp - r.left - v.cw / 2) / v.s + v.cx; input.ty = (cyp - r.top - v.ch / 2) / v.s + v.cy;
    };
    const down = (e) => {
      if (stick.id !== -1) return;
      e.preventDefault();
      stick.id = e.pointerId;
      try { pad.setPointerCapture(e.pointerId); } catch (er) { /* ignora */ }
      const r = rect();
      if (SET.ctrl === "touch") { input.touchOn = true; toWorld(e.clientX, e.clientY); return; }
      stick.ox = clamp(e.clientX - r.left, 62, r.width - 62); stick.oy = clamp(e.clientY - r.top, 62, r.height - 62);
      stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; stk.style.display = "block"; stk.classList.add("on");
      knob.style.transform = "translate(0,0)";
      stick.cx = e.clientX; stick.cy = e.clientY; stick.bx = e.clientX; stick.by = e.clientY;
      input.jx = input.jy = 0;
    };
    const move = (e) => {
      if (e.pointerId !== stick.id) return;
      e.preventDefault();
      if (SET.ctrl === "touch") { toWorld(e.clientX, e.clientY); return; }
      const dx = e.clientX - stick.bx, dy = e.clientY - stick.by, d = Math.hypot(dx, dy) || 1;
      const m = Math.min(1, d / R);
      input.jx = dx / d * m; input.jy = dy / d * m;
      // la base segue il dito se si esce dal raggio
      if (d > R) { stick.bx = e.clientX - dx / d * R; stick.by = e.clientY - dy / d * R; const r = rect(); stick.ox = clamp(stick.bx - r.left, 62, r.width - 62); stick.oy = clamp(stick.by - r.top, 62, r.height - 62); stk.style.left = stick.ox + "px"; stk.style.top = stick.oy + "px"; }
      knob.style.transform = `translate(${input.jx * R}px,${input.jy * R}px)`;
    };
    const up = (e) => {
      if (e.pointerId !== stick.id) return;
      stick.id = -1; input.jx = input.jy = 0; input.touchOn = false;
      stk.classList.remove("on"); knob.style.transform = "translate(0,0)";
      showDefaultStick();
    };
    pad.addEventListener("pointerdown", down);
    pad.addEventListener("pointermove", move);
    pad.addEventListener("pointerup", up);
    pad.addEventListener("pointercancel", up);
    pad.addEventListener("lostpointercapture", up);
  }
  function showDefaultStick() {
    const stk = root && root.querySelector(".ahd-stk");
    if (!stk) return;
    if (SET.ctrl === "stick" && uiState === "play") { stk.style.display = "block"; stk.style.left = "78px"; stk.style.top = (stage.clientHeight - 92) + "px"; }
    else stk.style.display = "none";
  }

  function bindBtn(el, onDown, onUp) {
    let id = -1;
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); id = e.pointerId; try { el.setPointerCapture(id); } catch (er) { /* ignora */ } el.classList.add("dn"); onDown && onDown(); });
    const end = (e) => { if (e.pointerId !== id) return; id = -1; el.classList.remove("dn"); onUp && onUp(); };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end); el.addEventListener("lostpointercapture", end);
  }

  // ---------------------------------------------------------------- schermate
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  function showUi(html) { ui.innerHTML = `<div class="ahd-card">${html}</div>`; ui.classList.add("on"); ui.scrollTop = 0; bindSegs(); }
  function hideUi() { ui.classList.remove("on"); ui.innerHTML = ""; }
  const stars = (n) => "★".repeat(n) + "☆".repeat(3 - n);
  let CTX = null; // configurazione dell'ultima partita lanciata (serve a «Rigioca»)

  function segHtml(k, labels, cur, vals) {
    return `<div class="ahd-seg" data-k="${k}">${labels.map((l, i) => { const v = vals ? vals[i] : i; return `<button data-v="${v}" class="${String(cur) === String(v) ? "on" : ""}">${l}</button>`; }).join("")}</div>`;
  }
  const SEGSET = {
    ctrl: (v) => { SET.ctrl = v === "touch" ? "touch" : "stick"; saveSet(); },
    diff: (v) => { SET.diff = +v; saveSet(); },
    sound: (v) => { SET.sound = +v; saveSet(); },
    tf: (v) => { X.prefs.f = +v; saveX("prefs"); },
    tp: (v) => { X.prefs.p = +v; saveX("prefs"); },
    flen: (v) => { X.prefs.free.len = +v; saveX("prefs"); },
    fgold: (v) => { X.prefs.free.gold = +v; saveX("prefs"); },
    train: (v) => { X.prefs.train = +v; saveX("prefs"); },
  };
  function bindSegs() {
    if (!ui) return;
    ui.querySelectorAll(".ahd-seg").forEach((sg) => sg.querySelectorAll("button").forEach((b) => (b.onclick = () => {
      const k = sg.dataset.k; if (SEGSET[k]) SEGSET[k](b.dataset.v);
      sg.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); snd("playSelect");
      if (k === "ctrl" && stage) stage.querySelector(".ahd-pad").classList.toggle("all", SET.ctrl === "touch");
    })));
  }
  const on = (sel, fn) => { const el = ui && ui.querySelector(sel); if (el) el.onclick = fn; };
  const tile = (go, title, sub, cls) => `<button class="ahd-tile ${cls || ""}" data-go="${go}"><b>${title}</b><span>${sub}</span></button>`;
  const tacticsHtml = () => `<h3>Tattiche</h3><div class="ahd-sub">Assetto</div>${segHtml("tf", FORMS, X.prefs.f)}<div class="ahd-sub">Pressing dei compagni</div>${segHtml("tp", PRESS, X.prefs.p)}`;
  const diffHtml = () => `<h3>Difficoltà</h3>${segHtml("diff", DIFFS.map((d) => d.n), SET.diff)}`;

  // ---- capitoli, sfide, stagione, coppa: logica di supporto
  const chapOpen = (c) => { try { return !!c.cond(); } catch (e) { return false; } };
  const chapIds = () => CHAPS.filter(chapOpen).map((c) => c.id);
  function prevDay(day) { const d = new Date(day + "T12:00:00"); d.setDate(d.getDate() - 1); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dailyEnsure() {
    const D = X.daily, today = dayKey();
    if (D.day !== today) {
      if (D.last && D.last !== prevDay(today)) D.streak = 0;
      const rg = seeded(hashStr("molo" + today)), pool = DPOOL.slice(), ids = [];
      while (ids.length < 3) ids.push(pool.splice(Math.floor(rg() * pool.length), 1)[0].id);
      D.day = today; D.ids = ids; D.done = []; saveX("daily");
    }
    return D;
  }
  function dailyEval(r) { // r: {mode, team, win, a, c, st, goals, saved, level}
    const D = dailyEnsure(), out = [];
    D.ids.forEach((id) => {
      if (D.done.includes(id)) return;
      const ch = DPOOL.find((x) => x.id === id);
      let ok = false; try { ok = ch && ch.chk(r); } catch (e) { ok = false; }
      if (ok) { D.done.push(id); out.push(ch.t); }
    });
    let sh = 0;
    if (out.length) {
      const today = dayKey();
      if (D.last !== today) { D.streak = D.last === prevDay(today) ? D.streak + 1 : 1; D.last = today; X.meta.maxStreak = Math.max(X.meta.maxStreak, D.streak); }
      sh = out.length * 2 + (D.done.length >= 3 ? 3 : 0);
      saveX("daily"); addShells(sh);
    }
    return { out, sh };
  }
  const teamName = (t) => (t === 0 ? "Rondine" : ALLT[t - 1].name);
  const teamTag = (t) => (t === 0 ? "RON" : ALLT[t - 1].tag);
  const teamStr = (t) => (t === 0 ? 1.0 : STRN[t - 1]);
  const pois = (l) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L && k < 9); return k - 1; };
  function simScore(a, b) { const sa = teamStr(a), sb = teamStr(b); return [Math.min(6, pois(1.3 * Math.sqrt(sa / sb))), Math.min(6, pois(1.3 * Math.sqrt(sb / sa)))]; }
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  // campionato: 6 squadre (Rondine + le 5 del torneo), andata e ritorno = 10 giornate
  function seasonNew() {
    const arr = [0, 1, 2, 3, 4, 5], rounds = [];
    for (let r = 0; r < 5; r++) {
      rounds.push([[arr[0], arr[5]], [arr[1], arr[4]], [arr[2], arr[3]]]);
      arr.splice(1, 0, arr.pop());
    }
    const back = rounds.map((rd) => rd.map(([a, b]) => [b, a]));
    return { n: X.meta.seasonsDone + 1, md: 0, rounds: rounds.concat(back), t: [0, 1, 2, 3, 4, 5].map(() => ({ w: 0, d: 0, l: 0, gf: 0, ga: 0 })), done: false, rank: -1 };
  }
  const seaPts = (r) => r.w * 3 + r.d;
  function seaRank(S) { return [0, 1, 2, 3, 4, 5].sort((a, b) => (seaPts(S.t[b]) - seaPts(S.t[a])) || ((S.t[b].gf - S.t[b].ga) - (S.t[a].gf - S.t[a].ga)) || (S.t[b].gf - S.t[a].gf) || a - b); }
  function seaPut(S, a, b, ga, gb) {
    const A = S.t[a], B = S.t[b];
    A.gf += ga; A.ga += gb; B.gf += gb; B.ga += ga;
    if (ga > gb) { A.w++; B.l++; } else if (ga < gb) { B.w++; A.l++; } else { A.d++; B.d++; }
  }
  const seaOpp = (S) => { const pr = S.rounds[S.md].find((p) => p[0] === 0 || p[1] === 0); return pr[0] === 0 ? pr[1] : pr[0]; };
  function seasonApply(a, c) { // dopo la partita del giocatore: applica, simula le altre, chiude la stagione se serve
    const S = X.season, out = { done: false, rank: -1, shells: 0, coins: 0 };
    S.rounds[S.md].forEach((pr) => {
      if (pr[0] === 0 || pr[1] === 0) { if (pr[0] === 0) seaPut(S, 0, pr[1], a, c); else seaPut(S, pr[0], 0, c, a); }
      else { const sc = simScore(pr[0], pr[1]); seaPut(S, pr[0], pr[1], sc[0], sc[1]); }
    });
    S.md++; X.meta.seasonMd++;
    if (S.md >= S.rounds.length) {
      S.done = true; S.rank = seaRank(S).indexOf(0);
      X.meta.seasonsDone++; out.done = true; out.rank = S.rank;
      out.shells = [12, 8, 6, 4, 3, 2][S.rank];
      if (S.rank === 0) { moloPt("title", "season"); X.meta.seasonTitles++; out.coins = coinOnce("season", 6); }
    }
    saveX("season"); saveX("meta");
    return out;
  }

  // coppa: tabellone a 8 squadre, quarti / semifinali / finale
  const CUP_R = ["Quarti di finale", "Semifinali", "Finale"];
  function cupNew() {
    const ids = shuffle([0, 1, 2, 3, 4, 5, 6, 7]), r0 = [];
    for (let i = 0; i < 8; i += 2) r0.push({ a: ids[i], b: ids[i + 1], sa: 0, sb: 0, w: -1, pen: false });
    X.meta.cupsPlayed++;
    return { r: 0, rounds: [r0, [], []], out: false, champ: -1 };
  }
  const cupMine = (C) => C.rounds[C.r].find((m) => m.a === 0 || m.b === 0);
  function cupSim(m) {
    const sc = simScore(m.a, m.b); m.sa = sc[0]; m.sb = sc[1];
    if (m.sa === m.sb) { m.pen = true; m.w = Math.random() < teamStr(m.a) / (teamStr(m.a) + teamStr(m.b)) ? m.a : m.b; }
    else m.w = m.sa > m.sb ? m.a : m.b;
  }
  function cupAdvance(C) { // chiude il turno, prepara il successivo (o simula tutto se il giocatore è fuori)
    for (;;) {
      const rd = C.rounds[C.r];
      rd.forEach((m) => { if (m.w < 0 && m.a !== 0 && m.b !== 0) cupSim(m); });
      if (rd.some((m) => m.w < 0)) return; // tocca ancora al giocatore
      if (C.r >= 2) { C.champ = rd[0].w; return; }
      const nx = C.rounds[C.r + 1];
      for (let i = 0; i < rd.length; i += 2) nx.push({ a: rd[i].w, b: rd[i + 1].w, sa: 0, sb: 0, w: -1, pen: false });
      C.r++;
      if (C.out) continue; // il giocatore è fuori: si simula fino alla finale
      if (!nx.some((m) => m.a === 0 || m.b === 0)) { C.out = true; continue; }
      return;
    }
  }
  function cupApply(win, ua, uc, pens) {
    const C = X.cup, m = cupMine(C), out = { champ: false, out: !win, shells: 0, coins: 0 };
    const mine = m.a === 0;
    m.sa = mine ? ua : uc; m.sb = mine ? uc : ua; m.pen = !!pens; m.w = win ? 0 : (mine ? m.b : m.a);
    if (!win) C.out = true;
    cupAdvance(C);
    if (win && C.champ === 0) {
      out.champ = true; moloPt("cup", "cup"); X.meta.cupsWon++; out.coins = coinOnce("cup", 8); out.shells = 14;
    } else out.shells = win ? 3 + C.r : 2 + C.r;
    if (C.champ >= 0) C.done = true;
    saveX("cup"); saveX("meta");
    return out;
  }
  const cupRound = (C) => CUP_R[Math.min(2, C.r)];

  // ---------------------------------------------------------------- menu principale
  function openGo(go) {
    ({
      menu: showMenu, torneo: showTorneo, season: showSeason, cup: showCup, free: showFree, surv: showSurv, timed: showTimed, pens: showPens, setp: showSetp, train: showTrain,
      daily: showDaily, team: showTeam, look: showLook, tac: showTac, diary: showDiary,
    }[go] || showMenu)();
  }
  function showMenu() {
    uiState = "menu"; paused = false;
    const done = PROG.stars.filter((s) => s > 0).length, D = dailyEnsure(), left = D.ids.length - D.done.length;
    const S = X.season, C = X.cup, nNew = chapIds().filter((id) => !X.meta.seen.includes(id)).length;
    let h = `<h2>Coppa del Molo</h2><p class="ahd-sub">Calcio a 5 a campo aperto, visto dall'alto. Aftertouch, Intesa Leo-Nico e il Tiro della Rondine. Una coppa di latta, otto squadre, un Molo intero che tifa a distanza di sicurezza. Conchiglie: <b>${X.meta.shells}</b></p>`;
    h += `<div class="ahd-grid">`
      + tile("torneo", "Torneo", `5 sfide · ${done}/${OPPS.length} vinte`)
      + tile("season", "Campionato", S && !S.done ? `Giornata ${S.md + 1}/${S.rounds.length}` : S ? "Stagione conclusa" : "Stagione di 10 giornate")
      + tile("cup", "Coppa del Molo", C && !C.done ? (C.out ? "Eliminato" : cupRound(C)) : "Tabellone a 8 squadre")
      + tile("free", "Partita libera", "7 squadre, durata a scelta")
      + tile("surv", "Sopravvivenza", `Tre vite · record ${X.best.surv} gol`)
      + tile("timed", "Sfida a tempo", `75 secondi · record ${X.best.timed}`)
      + tile("pens", "Rigori", `Tira e para · serie vinte ${X.best.pens}`)
      + tile("setp", "Calci piazzati", `Punizioni, angoli, rigori · ${X.best.setp}/6`)
      + tile("train", "Allenamento", "Senza classifica né fretta")
      + tile("daily", "Sfide del giorno", left ? `${left} da completare` : "Tutte fatte", left ? "hot" : "")
      + tile("team", "Squadra", "Portiere e difensori")
      + tile("look", "Look", "Maglia, pallone, campo")
      + tile("tac", "Tattiche", `${FORMS[X.prefs.f]} · pressing ${PRESS[X.prefs.p].toLowerCase()}`)
      + tile("diary", "Diario della Coppa", `${chapIds().length}/${CHAPS.length} capitoli${nNew ? " · " + nNew + " nuovi" : ""}`, nNew ? "hot" : "")
      + `</div>`;
    h += `<h3>Controlli</h3>${segHtml("ctrl", ["Joystick", "Tocca e corri"], SET.ctrl, ["stick", "touch"])}`;
    h += diffHtml();
    h += `<h3>Audio</h3>${segHtml("sound", ["Suoni attivi", "Muto"], SET.sound ? 1 : 0, [1, 0])}`;
    h += `<div class="ahd-row2"><button class="ahd-btn sec" data-a="tut">Come si gioca</button><button class="ahd-btn sec" data-a="exit">Esci</button></div>`;
    h += `<p class="ahd-sub" style="text-align:center">Partite: ${PROG.played} · Vittorie: ${PROG.wins} · Gol segnati: ${PROG.goals}</p>`;
    showUi(h);
    ui.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { snd("playSelect"); openGo(b.dataset.go); }));
    on('[data-a="tut"]', () => showTutorial(0, showMenu));
    on('[data-a="exit"]', closeAll);
    if (!PROG.tut) { PROG.tut = 1; saveProg(); showTutorial(0, showMenu); }
  }
  const backRow = (fn) => `<button class="ahd-btn sec" data-a="back">Indietro</button>`;

  function showTorneo() {
    uiState = "menu";
    const done = PROG.stars.filter((s) => s > 0).length;
    let h = `<h2>Il torneo</h2><p class="ahd-sub">Cinque squadre del Borgo, in ordine. Vinci la prima volta e incassi le monete. ${done}/${OPPS.length}</p>`;
    OPPS.forEach((o, i) => {
      const open = i === 0 || PROG.stars[i - 1] > 0;
      h += `<button class="ahd-opp" data-mi="${i}" ${open ? "" : "disabled"}><div class="ahd-crest" style="border-color:${o.kit2};background:${o.kit};color:${o.kit2}">${o.tag}</div><div><b>${o.name}</b><span>${open ? (PROG.stars[i] ? "Vinta" : "Da affrontare") : "Batti la squadra precedente"}</span></div><em>${open ? stars(PROG.stars[i]) : "🔒"}</em></button>`;
    });
    h += backRow();
    showUi(h);
    ui.querySelectorAll(".ahd-opp").forEach((b) => (b.onclick = () => showIntro(+b.dataset.mi)));
    on('[data-a="back"]', showMenu);
  }

  // schermata di preparazione generica: citazione, regole, tattiche, difficoltà, via
  function showPre(cfg) {
    uiState = "intro";
    const o = cfg.opp;
    let h = `<h2>${cfg.title}</h2><p class="ahd-sub">${cfg.sub || ""}</p>`;
    if (o) h += `<div class="ahd-quote">${esc(o.hint)}</div>`;
    if (o && PRE[o.tag]) h += `<p class="ahd-sub"><i>${esc(pick(PRE[o.tag]))}</i></p>`;
    (cfg.rules || []).forEach((r) => { h += `<div class="ahd-stat"><span>${r[0]}</span><span>${r[1]}</span></div>`; });
    if (cfg.tactics !== false) h += tacticsHtml();
    if (cfg.diff !== false) h += diffHtml();
    h += `<button class="ahd-btn" data-a="go">${cfg.go || "Calcio d'inizio"}</button><button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    on('[data-a="go"]', () => launch(cfg.launch));
    on('[data-a="back"]', cfg.back || showMenu);
  }
  function showIntro(mi) {
    const o = OPPS[mi];
    showPre({
      title: o.name, opp: o, back: showTorneo, launch: { mode: "torneo", mi, opp: o },
      sub: `Sfida ${mi + 1} di ${OPPS.length} · Premio prima vittoria: ${STAR_COINS[mi]} monete${PROG.coin[mi] ? " (già incassato)" : ""}`,
      rules: [["Obiettivo", `Vinci in ${MATCH_SECS} secondi`], ["★ ★★ ★★★", "Vittoria · 2 gol di scarto · porta inviolata"]],
    });
  }

  function showFree() {
    uiState = "intro";
    const F = X.prefs.free, o = ALLT[F.opp] || ALLT[0], lens = [60, 100, 150];
    let h = `<h2>Partita libera</h2><p class="ahd-sub">Scegli l'avversaria, la durata e le regole. Niente monete in palio (solo la prima vittoria: 2), ma conchiglie e Diario sì.</p><div class="ahd-grid">`;
    ALLT.forEach((t, i) => { h += `<button class="ahd-tile ${i === F.opp ? "on" : ""}" data-t="${i}"><div class="ahd-crest" style="border-color:${t.kit2};background:${t.kit};color:${t.kit2}">${t.tag}</div><b>${t.name}</b></button>`; });
    h += `</div><div class="ahd-quote">${esc(o.hint)}</div>`;
    h += `<h3>Durata</h3>${segHtml("flen", ["Breve 60s", "Normale 100s", "Lunga 150s"], F.len)}`;
    h += `<h3>Pareggio</h3>${segHtml("fgold", ["Supplementari", "Si pareggia"], F.gold)}`;
    h += tacticsHtml() + diffHtml();
    h += `<button class="ahd-btn" data-a="go">Calcio d'inizio</button><button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    ui.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => { X.prefs.free.opp = +b.dataset.t; saveX("prefs"); snd("playSelect"); const sc = ui.scrollTop; showFree(); ui.scrollTop = sc; }));
    on('[data-a="go"]', () => launch({ mode: "free", opp: o, len: lens[F.len] || 100, noGolden: !F.gold }));
    on('[data-a="back"]', showMenu);
  }

  function showSurv() {
    showPre({
      title: "Sopravvivenza", back: showMenu, opp: null, go: "Parti",
      sub: "Ondate di squadre sempre più dure. Tre vite: ogni gol subito ne toglie una. Ogni due gol segnati, arriva l'ondata successiva.",
      rules: [["Tuo record", X.best.surv + " gol"], ["Premio", "3 monete la prima volta che segni 5 gol"]],
      launch: { mode: "surv", opp: ALLT[0], len: 0, noHalf: true, noGolden: true },
    });
  }
  function showTimed() {
    showPre({
      title: "Sfida a tempo", back: showMenu, opp: null, go: "Parti",
      sub: "75 secondi contro i Gabbiani del Porto. Segna più gol che puoi: dopo ogni rete si riparte subito.",
      rules: [["Tuo record", X.best.timed + " gol"], ["Medaglie", "Bronzo 2 · Argento 4 · Oro 6"], ["Premio", "3 monete alla prima medaglia d'oro"]],
      launch: { mode: "timed", opp: OPPS[0], len: 75, noHalf: true, noGolden: true },
    });
  }
  function showPens() {
    showPre({
      title: "Rigori", back: showMenu, opp: OPPS[1], tactics: false, go: "Al dischetto",
      sub: "Serie da cinque, a oltranza se serve. Tu tiri: stick su/giù per l'angolo, TIRO per la forza. Loro tirano: muovi il portiere con lo stick e tuffati con PASSA o TIRO.",
      rules: [["Serie vinte", String(X.best.pens)], ["Premio", "3 monete alla prima serie vinta"]],
      launch: { mode: "pens", opp: OPPS[1] },
    });
  }
  function showSetp() {
    showPre({
      title: "Calci piazzati", back: showMenu, opp: null, tactics: false, go: "Si comincia",
      sub: "Sei calci da fermo contro il portiere: punizione dal limite con barriera (carica a metà per scavalcarla), angolo con Intesa Leo-Nico, rigore.",
      rules: [["Tuo record", X.best.setp + "/6"], ["Stelle", "★ 2 gol · ★★ 4 gol · ★★★ 5 gol"], ["Premio", "3 monete alla prima sessione con 4 gol"]],
      launch: { mode: "setp", opp: OPPS[2] },
    });
  }
  function showTrain() {
    uiState = "intro";
    const o = OPPS[0];
    let h = `<h2>Allenamento</h2><p class="ahd-sub">Nessun punteggio che conti, nessun orologio. Grinta sempre carica, per provare Rondine e aftertouch finché il pallone non ti odia. Dalla pausa puoi rimettere la palla al centro.</p>`;
    h += `<h3>Avversari</h3>${segHtml("train", ["Fermi", "Passivi", "Normali"], X.prefs.train)}`;
    h += tacticsHtml();
    h += `<button class="ahd-btn" data-a="go">Inizia</button><button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    on('[data-a="go"]', () => launch({ mode: "train", opp: o, len: 0, noHalf: true, noGolden: true, opass: [2, 1, 0][X.prefs.train | 0] }));
    on('[data-a="back"]', showMenu);
  }
  function showTac() {
    uiState = "menu";
    showUi(`<h2>Tattiche</h2><p class="ahd-sub">Valgono per i tuoi compagni controllati dal computer, in ogni modalità.</p>${tacticsHtml()}
      <p class="ahd-sub"><b>Offensivo</b>: la squadra sale, più spazio davanti e meno dietro. <b>Difensivo</b>: due linee basse, contropiede.<br><b>Pressing alto</b>: i compagni aggrediscono da lontano e tengono la linea alta; <b>basso</b>: aspettano.</p>
      <button class="ahd-btn sec" data-a="back">Indietro</button>`);
    on('[data-a="back"]', showMenu);
  }

  // ---- campionato
  function showSeason() {
    uiState = "menu";
    let S = X.season;
    if (!S) {
      showUi(`<h2>Campionato del Molo</h2><p class="ahd-sub">Sei squadre, andata e ritorno: dieci giornate. Tre punti per la vittoria, uno per il pareggio (qui si pareggia: niente supplementari). Le altre partite le gioca Arturo, con la fantasia.</p>
        <p>Titolo in palio: la targhetta, una maglia viola e Morena in difesa. ${X.meta.coin.season ? "" : "Primo titolo: 6 monete."}</p>
        <button class="ahd-btn" data-a="new">Inizia la stagione</button><button class="ahd-btn sec" data-a="back">Indietro</button>`);
      on('[data-a="new"]', () => { X.season = seasonNew(); saveX("season"); showSeason(); });
      on('[data-a="back"]', showMenu);
      return;
    }
    const rk = seaRank(S);
    let h = `<h2>Campionato · stagione ${S.n}</h2><p class="ahd-sub">${S.done ? "Stagione conclusa" : "Giornata " + (S.md + 1) + " di " + S.rounds.length}</p>`;
    h += `<table class="ahd-tbl"><tr><th>#</th><th>Squadra</th><th>G</th><th>V</th><th>N</th><th>P</th><th>DR</th><th>Pt</th></tr>`;
    rk.forEach((t, i) => { const r = S.t[t]; h += `<tr class="${t === 0 ? "me" : ""}"><td>${i + 1}</td><td>${esc(teamName(t))}</td><td>${r.w + r.d + r.l}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf - r.ga >= 0 ? "+" : ""}${r.gf - r.ga}</td><td>${seaPts(r)}</td></tr>`; });
    h += `</table>`;
    if (S.done) {
      h += `<div class="ahd-quote">${esc(SEA_END[Math.min(5, S.rank)])}</div><div class="ahd-row2"><button class="ahd-btn" data-a="new">Nuova stagione</button><button class="ahd-btn sec" data-a="back">Menu</button></div>`;
      showUi(h);
      on('[data-a="new"]', () => { X.season = seasonNew(); saveX("season"); showSeason(); });
    } else {
      const j = seaOpp(S), o = OPPS[j - 1];
      h += `<h3>Prossima partita</h3><div class="ahd-stat"><span>Giornata ${S.md + 1}</span><span>Rondine vs ${esc(o.name)}</span></div>`;
      h += `<div class="ahd-row2"><button class="ahd-btn" data-a="go">Prepara</button><button class="ahd-btn sec" data-a="back">Menu</button></div>`;
      h += `<button class="ahd-btn sec red" data-a="ab" style="min-height:40px;font-size:13px">Abbandona la stagione</button>`;
      showUi(h);
      on('[data-a="go"]', () => showPre({ title: "Giornata " + (S.md + 1), opp: o, back: showSeason, sub: `Campionato · stagione ${S.n} · ${o.name}`, rules: [["Regola", "Si pareggia: niente supplementari"], ["Ricompensa", "Conchiglie per ogni risultato"]], launch: { mode: "season", opp: o, noGolden: true } }));
      let armed = false;
      on('[data-a="ab"]', function () { if (!armed) { armed = true; this.textContent = "Sicuro? Tocca ancora per abbandonare"; return; } X.season = null; saveX("season"); showSeason(); });
    }
    on('[data-a="back"]', showMenu);
  }

  // ---- coppa
  function bracketHtml(C) {
    let h = `<div class="ahd-brk">`;
    for (let r = 0; r < 3; r++) {
      h += `<div><h4>${["Quarti", "Semi", "Finale"][r]}</h4>`;
      const n = [4, 2, 1][r];
      for (let i = 0; i < n; i++) {
        const m = C.rounds[r][i];
        if (!m) { h += `<div class="ahd-mt"><div><span>?</span><i></i></div><div><span>?</span><i></i></div></div>`; continue; }
        const cls = (m.a === 0 || m.b === 0) ? "me" : "";
        const row = (t, sc, win) => `<div class="${m.w < 0 ? "" : win ? "w" : "l"}"><span>${teamTag(t)}</span><i>${m.w < 0 ? "" : sc + (m.pen && win ? "*" : "")}</i></div>`;
        h += `<div class="ahd-mt ${cls}">${row(m.a, m.sa, m.w === m.a)}${row(m.b, m.sb, m.w === m.b)}</div>`;
      }
      h += `</div>`;
    }
    return h + `</div><p class="ahd-sub">* decisa ai rigori</p>`;
  }
  function showCup() {
    uiState = "menu";
    let C = X.cup;
    if (!C) {
      showUi(`<h2>Coppa del Molo</h2><p class="ahd-sub">Otto squadre, tabellone a eliminazione diretta: quarti, semifinali, finale. Se si pareggia dopo i supplementari, si va ai rigori (tiri e parate). La Coppa è un secchio di latta che suona quando la alzi.</p>
        <p>${X.meta.coin.cup ? "Il nome sulla targa è già inciso: si può incidere di nuovo." : "Primo trionfo: 8 monete, la Palla d'Oro e la maglia Oro del Molo."}</p>
        <button class="ahd-btn" data-a="new">Sorteggia il tabellone</button><button class="ahd-btn sec" data-a="back">Indietro</button>`);
      on('[data-a="new"]', () => { X.cup = cupNew(); saveX("cup"); saveX("meta"); showCup(); });
      on('[data-a="back"]', showMenu);
      return;
    }
    let h = `<h2>Tabellone della Coppa</h2>` + bracketHtml(C);
    if (C.done) {
      const me = C.champ === 0;
      h += `<div class="ahd-quote">${esc(me ? CUP_END.win : CUP_END.lose)}</div>`;
      if (!me && C.champ >= 0) h += `<p class="ahd-sub">Ha vinto: <b>${esc(teamName(C.champ))}</b></p>`;
      h += `<div class="ahd-row2"><button class="ahd-btn" data-a="new">Nuova coppa</button><button class="ahd-btn sec" data-a="back">Menu</button></div>`;
      showUi(h);
      on('[data-a="new"]', () => { X.cup = cupNew(); saveX("cup"); saveX("meta"); showCup(); });
    } else {
      const m = cupMine(C), j = m.a === 0 ? m.b : m.a, o = ALLT[j - 1];
      h += `<h3>${cupRound(C)}</h3><div class="ahd-stat"><span>Rondine vs</span><span>${esc(o.name)}</span></div>`;
      h += `<div class="ahd-row2"><button class="ahd-btn" data-a="go">Prepara</button><button class="ahd-btn sec" data-a="back">Menu</button></div>`;
      h += `<button class="ahd-btn sec red" data-a="ab" style="min-height:40px;font-size:13px">Ritirati dalla coppa</button>`;
      showUi(h);
      on('[data-a="go"]', () => showPre({ title: cupRound(C), opp: o, back: showCup, sub: "Coppa del Molo · eliminazione diretta", rules: [["Regola", "Pareggio: supplementari, poi rigori"]], launch: { mode: "cup", opp: o, cupJ: j } }));
      let armed = false;
      on('[data-a="ab"]', function () { if (!armed) { armed = true; this.textContent = "Sicuro? Tocca ancora per ritirarti"; return; } C.out = true; cupAdvance(C); C.done = true; saveX("cup"); showCup(); });
    }
    on('[data-a="back"]', showMenu);
  }

  // ---- sfide giornaliere
  function showDaily() {
    uiState = "menu";
    const D = dailyEnsure();
    let h = `<h2>Sfide del giorno</h2><p class="ahd-sub">Tre sfide che cambiano ogni giorno, valide in ogni modalità adatta. Premio: 2 conchiglie l'una, +3 se le completi tutte. Giorni di fila: <b>${D.streak}</b> (record ${X.meta.maxStreak}). Conchiglie: <b>${X.meta.shells}</b></p>`;
    D.ids.forEach((id) => {
      const ch = DPOOL.find((x) => x.id === id), ok = D.done.includes(id);
      h += `<div class="ahd-stat"><span>${esc(ch.t)}</span><span class="${ok ? "ahd-done" : ""}">${ok ? "✓ fatta" : "da fare"}</span></div>`;
    });
    h += `<p class="ahd-sub">Le conchiglie servono per il Look. Non hanno nessun valore fuori dalla Coppa del Molo: restano qui, nel Molo.</p><button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    on('[data-a="back"]', showMenu);
  }

  // ---- squadra
  let teamInfo = "";
  const modsTxt = (m) => { const a = []; if (m.mods.reach) a.push("Parata " + (m.mods.reach > 1 ? "+" : "") + Math.round((m.mods.reach - 1) * 100) + "%"); if (m.mods.tkl) a.push("Contrasti " + (m.mods.tkl > 1 ? "+" : "") + Math.round((m.mods.tkl - 1) * 100) + "%"); if (m.mods.spd) a.push("Velocità " + (m.mods.spd > 1 ? "+" : "") + Math.round((m.mods.spd - 1) * 100) + "%"); return a.join(" · ") || "Nessun bonus"; };
  function showTeam() {
    uiState = "menu";
    meet(MATES.filter(mateOpen).map((m) => HDC_MATE[m.id]));
    const ros = homeRoster(), cur = [ros[0].id, ros[1].id, ros[2].id];
    const card = (m) => {
      const open = mateOpen(m), sel = cur.includes(m.id);
      return open ? `<button class="ahd-tile ${sel ? "on" : ""}" data-m="${m.id}"><b>${m.name}</b><span>${modsTxt(m)}</span></button>`
        : `<button class="ahd-tile" data-m="${m.id}" disabled><b class="ahd-lock">???</b><span>${m.hint}</span></button>`;
    };
    let h = `<h2>La squadra</h2><p class="ahd-sub">Leo (centrocampo) e Nico (attacco) restano fissi: l'Intesa è la loro. Scegli il portiere e due difensori. I compagni si sbloccano con la Coppa.</p>`;
    h += `<h3>Portiere</h3><div class="ahd-grid">${MATES.filter((m) => m.slot === 0).map(card).join("")}</div>`;
    h += `<h3>Difensori (due)</h3><div class="ahd-grid">${MATES.filter((m) => m.slot === 1).map(card).join("")}</div>`;
    h += `<p class="ahd-sub">${esc(teamInfo || "Tocca un compagno per scegliere o leggere la scheda.")}</p><button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    ui.querySelectorAll("[data-m]").forEach((b) => (b.onclick = () => {
      const m = mateById(b.dataset.m); if (!m || !mateOpen(m)) return;
      if (m.slot === 0) X.team.gk = m.id;
      else {
        let d = [ros[1].id, ros[2].id];
        if (d.includes(m.id)) { if (d.length > 1) d = d.filter((x) => x !== m.id); } else { d.push(m.id); if (d.length > 2) d.shift(); }
        X.team.def = d;
      }
      saveX("team"); teamInfo = m.name + ": " + m.desc; snd("playSelect"); const sc = ui.scrollTop; showTeam(); ui.scrollTop = sc;
    }));
    on('[data-a="back"]', showMenu);
  }

  // ---- look
  let lookPend = "";
  const lookOwned = (cat, it) => (it.cost === 0 && (!it.req || !!it.req())) || X.look.own.includes(cat + ":" + it.id);
  function showLook() {
    uiState = "menu";
    const L = X.look;
    const sec = (title, cat, list, key) => {
      let h = `<h3>${title}</h3><div class="ahd-grid">`;
      list.forEach((it) => {
        const own = lookOwned(cat, it), sel = L[key] === it.id;
        let sub, nm = it.name;
        if (own) sub = sel ? "In uso" : "Posseduto";
        else if (it.cost === 0) { nm = "???"; sub = it.hint || ""; }
        else sub = lookPend === cat + ":" + it.id ? "Tocca ancora per comprare" : it.cost + " conchiglie";
        const sw = cat === "kit" ? `<i class="ahd-sw" style="background:${it.k};border-color:${it.k2}"></i>` : cat === "ball" ? `<i class="ahd-sw" style="background:${it.c};border-color:#111"></i>` : "";
        h += `<button class="ahd-tile ${sel ? "on" : ""}" data-l="${cat}:${it.id}" ${(!own && it.cost === 0) ? "disabled" : ""}><b>${sw}${esc(nm)}</b><span>${esc(sub)}</span></button>`;
      });
      return h + `</div>`;
    };
    let h = `<h2>Look</h2><p class="ahd-sub">Solo estetica: nessun vantaggio in campo. Conchiglie: <b>${X.meta.shells}</b> (si guadagnano giocando e con le sfide del giorno).</p>`;
    h += sec("Maglia", "kit", KITS, "kit") + sec("Motivo", "pat", PATS, "pat") + sec("Pallone", "ball", BALLS, "ball") + sec("Campo", "pitch", PITCHES, "pitch");
    h += `<button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    ui.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => {
      const [cat, id] = b.dataset.l.split(":");
      const list = { kit: KITS, pat: PATS, ball: BALLS, pitch: PITCHES }[cat], it = list.find((x) => x.id === id);
      if (!it) return;
      if (!lookOwned(cat, it)) {
        if (it.cost === 0) return;
        if (lookPend !== b.dataset.l) { lookPend = b.dataset.l; const sc = ui.scrollTop; showLook(); ui.scrollTop = sc; return; }
        if (X.meta.shells < it.cost) { lookPend = ""; const sc = ui.scrollTop; showLook(); ui.scrollTop = sc; say2("Servono " + it.cost + " conchiglie"); return; }
        X.meta.shells -= it.cost; X.look.own.push(b.dataset.l); saveX("meta");
      }
      lookPend = ""; L[cat] = id; saveX("look"); if (cat === "pitch") bgCache = null; snd("playSelect");
      const sc = ui.scrollTop; showLook(); ui.scrollTop = sc;
    }));
    on('[data-a="back"]', showMenu);
  }
  function say2(t) { const p = ui && ui.querySelector(".ahd-sub"); if (p) p.textContent = t; }

  // ---- diario
  function showDiary() {
    uiState = "menu";
    const open = chapIds();
    let h = `<h2>Diario della Coppa</h2><p class="ahd-sub">Il filo che lega il Molo, le squadre e il secchio di latta. Capitoli sbloccati: ${open.length}/${CHAPS.length}. Gli altri aspettano, come i treni.</p>`;
    CHAPS.forEach((c) => {
      const o = open.includes(c.id), fresh = o && !X.meta.seen.includes(c.id);
      h += o ? `<button class="ahd-opp" data-c="${c.id}"><div class="ahd-crest" style="border-color:#fde047;background:#13304f;color:#fde047">${CHAPS.indexOf(c) + 1}</div><div><b>${esc(c.t)}</b><span>${c.tone}</span></div><em>${fresh ? "nuovo" : "leggi"}</em></button>`
        : `<button class="ahd-opp" disabled><div class="ahd-crest" style="border-color:#475569;color:#64748b">?</div><div><b class="ahd-lock">???</b><span>Sblocco: ${esc(c.hint)}</span></div><em>🔒</em></button>`;
    });
    h += `<h3>Il cast</h3>`;
    CASTD.forEach((c) => {
      const ch = CHAPS.find((x) => x.id === c.ch), o = ch && open.includes(ch.id);
      h += `<div class="ahd-stat" style="display:block"><b>${o ? esc(c.n) : '<span class="ahd-lock">???</span>'}</b><br><span style="font-size:12px;color:#94a3b8">${o ? esc(c.t) : "Si sblocca con il filo narrativo"}</span></div>`;
    });
    h += `<button class="ahd-btn sec" data-a="back">Indietro</button>`;
    showUi(h);
    ui.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => showChapter(b.dataset.c, showDiary)));
    on('[data-a="back"]', showMenu);
  }
  // ritratti dalla storia principale: i capitoli sono testo libero, quindi chi "parla" è il primo personaggio nominato nel paragrafo
  const PT_WHO = [
    ["ginetta_molo", "Ginetta", /Ginetta/], ["arturo_molo", "Arturo", /Arturo/], ["ac_cima", "Capitan Cima", /Cima\b/], ["ac_capostazione", "Il Capostazione", /Capostazione/],
    ["ac_ormeggio", "Zio Ormeggio", /Ormeggio/], ["pina_edicola", "Signora Pina", /Pina\b/], ["nando_frittura", "Nando", /Nando/]
  ];
  const PT_SPEC = {
    ginetta_molo: { name: "Ginetta Bandierina", hair: "#7c2d12", style: "long", skin: "#f1c6a0", eye: "#3b2415", bg: ["#fde68a", "#f97316"], shirt: "#111827" },
    arturo_molo: { name: "Arturo Altoparlante", hair: "#6b7280", style: "messy", skin: "#e9be95", eye: "#222", bg: ["#7dd3fc", "#e0f2fe"], glasses: true, shirt: "#0e7490" },
    pina_edicola: { name: "Signora Pina", hair: "#b8b2a8", style: "bun", skin: "#e8b88c", eye: "#2a2a2a", bg: ["#a855f7", "#fae8ff"], glasses: true, shirt: "#a855f7" },
    nando_frittura: { name: "Nando Frittura", hair: "#3b2a1c", style: "messy", skin: "#d9a679", eye: "#2a2a2a", bg: ["#f59e0b", "#451a03"], beard: true, shirt: "#f59e0b" }
  };
  function portraitOf(id) {
    try { const a = window.__borgoApi; if (!id || !a || typeof a.portraitImg !== "function") return ""; hdcReg(); return a.portraitImg(id, PT_SPEC[id]) || ""; } catch (e) { return ""; }
  }
  function chapParas(c) {
    let last = null;
    return c.p.map((t) => {
      let best = null, bi = 1e9;
      PT_WHO.forEach((w) => { const m = w[2].exec(t); if (m && m.index < bi) { bi = m.index; best = w; } });
      const same = best && last === best[0]; if (best) last = best[0];
      const pi = best && !same ? portraitOf(best[0]) : "";
      return pi ? `<div class="ahd-pp"><div class="ahd-pw"><img class="ahd-pt" src="${pi}" alt="" width="72" height="72"><i>${esc(best[1])}</i></div><p>${esc(t)}</p></div>` : `<p>${esc(t)}</p>`;
    }).join("");
  }
  function showChapter(id, back) {
    const c = CHAPS.find((x) => x.id === id);
    if (!c || !chapOpen(c)) return back();
    uiState = "menu";
    if (!X.meta.seen.includes(id)) { X.meta.seen.push(id); saveX("meta"); }
    showUi(`<div class="ahd-chap"><span class="ahd-tone">${c.tone}</span><h2>${esc(c.t)}</h2>${chapParas(c)}</div><button class="ahd-btn sec" data-a="back">Indietro</button>`);
    on('[data-a="back"]', back);
  }

  function showTutorial(step, back) {
    uiState = "tut";
    const T = [
      ["Muoviti", "Tieni premuto sul lato sinistro dello schermo: compare il joystick. In alternativa, scegli «Tocca e corri» nelle impostazioni e trascina dove vuoi andare. Controlli sempre il giocatore col cerchio giallo."],
      ["Passa e contrasta", "PASSA manda la palla al compagno nella direzione dello stick (lo vedi cerchiato in azzurro). Senza palla, PASSA è la scivolata: tempismo, non disperazione. SCATTO consuma fiato."],
      ["Tira e curva", "Tieni premuto TIRO per caricare e rilascia. Stick in su o in giù: scegli l'angolo della porta. Dopo il tiro muovi lo stick di lato mentre la palla vola: curva! È l'aftertouch."],
      ["Intesa e Rondine", "Passaggio Leo-Nico (o Nico-Leo) e tiro entro 3 secondi: Intesa, tiro potenziato e preciso. Passaggi, contrasti e parate riempiono la barra GRINTA: quando è piena premi il tasto dorato per il Tiro della Rondine."],
      ["Calci piazzati", "Punizione: carica il tiro a metà per scavalcare la barriera e curva con lo stick. Angolo: PASSA a Nico e tira. Rigore: scegli l'angolo con lo stick. Rigore subito: muovi il portiere con lo stick e tuffati con PASSA o TIRO."],
    ];
    const t = T[step];
    showUi(`<h2>${t[0]}</h2><div class="ahd-dots">${T.map((_, i) => (i === step ? "<b>●</b>" : "●")).join(" ")}</div><p>${t[1]}</p>
      <button class="ahd-btn" data-a="next">${step < T.length - 1 ? "Avanti" : "Ho capito"}</button>
      ${step > 0 ? '<button class="ahd-btn sec" data-a="prev">Indietro</button>' : ""}`);
    ui.querySelector('[data-a="next"]').onclick = () => (step < T.length - 1 ? showTutorial(step + 1, back) : back());
    const pv = ui.querySelector('[data-a="prev"]'); if (pv) pv.onclick = () => showTutorial(step - 1, back);
  }

  // ---------------------------------------------------------------- modalita' "ut" (Ultimate Team del Borgo)
  // start({mode:"ut", team:[5 carte in ordine di slot: portiere, difensore, difensore, centrocampista, attaccante],
  //        opp:{name, pw?, kit?, names?[5], spd?, tkl?, press?, shoot?, line?}, diff?:0..2, onExit(res)})
  // Ogni carta: {id?, name, role, rar?, lv?, stats:{spd,pow,acc,pas,def,gk,sta}} con valori 0..100 (50 = neutro; mancante = 50).
  // Mappatura valore -> campo (f = (valore-50)/50 limitato a -1..1; i moltiplicatori stanno nei range gia' usati dai compagni/DIFFS):
  //   spd (scatto/velocita')  velocita' del giocatore        x(1 +/- 6%)
  //   pow (potenza di tiro)   velocita' del pallone al tiro  x(1 +/- 6%)  (anche i tiri dei compagni controllati dall'IA)
  //   acc (precisione tiro)   errore di mira (noise)         x(1 -/+ 30%)
  //   pas (passaggio)         velocita' del passaggio x(1 +/- 5%) e imprecisione del lancio da 0 a 9 px
  //   def (difesa/contrasto)  probabilita' di rubare palla   x(1 +/- 20%)
  //   gk  (portiere)          raggio di parata x(1 +/- 12%) e riflessi -/+ 2 frame prima del tuffo (solo la carta in porta)
  //   sta (resistenza/grinta) consumo del fiato nello scatto x(1 -/+ 18%), recupero +/- 14%  (vale per chi stai muovendo)
  // Niente salvataggi propri: il risultato esce solo da onExit(res) = {win, draw, a, c, scorers[], shots[], saves[]} (null se abbandoni).
  const UTK = { spd: 0.06, pow: 0.06, acc: 0.3, pasV: 0.05, pasE: 9, def: 0.2, gk: 0.12, rx: 2, sta: 0.18 };
  let utCfg = null;
  const utF = (v) => clamp(((v === undefined || v === null || isNaN(+v) ? 50 : +v) - 50) / 50, -1, 1);
  function utNorm(team) {
    const out = [];
    for (let i = 0; i < 5; i++) {
      const c = (Array.isArray(team) && team[i]) || {}, st = c.stats || {};
      const f = {}; ["spd", "pow", "acc", "pas", "def", "gk", "sta"].forEach((k) => { f[k] = utF(st[k]); });
      out.push({ id: c.id || "", name: String(c.name || HOME_NAMES[i]).slice(0, 24), role: c.role || "", rar: c.rar || "", lv: c.lv || 1, st, f });
    }
    return out;
  }
  function utOpp(o) {
    o = o || {}; const t = clamp(((+o.pw || 36) - 28) / 22, 0, 1), nm = String(o.name || "Avversari");
    const lum = (h) => { try { const r = hexRgb(h); return r[0] * 0.3 + r[1] * 0.59 + r[2] * 0.11; } catch (e) { return 128; } };
    const kit = /^#[0-9a-f]{6}$/i.test(o.kit || "") ? o.kit : "#c97a3a";
    const n = Array.isArray(o.names) && o.names.length >= 5 ? o.names : ["Portiere", "Difensore", "Difensore", "Centrale", "Punta"];
    return { name: nm, tag: nm.replace(/^(i|il|la|le|gli|lo|l')\s*/i, "").slice(0, 3).toUpperCase() || "AVV", kit, kit2: lum(kit) > 140 ? "#1f2937" : "#f8fafc", gk: "#a3e635",
      spd: o.spd || 0.94 + 0.1 * t, tkl: o.tkl || 0.8 + 0.45 * t, press: o.press || 190 + 60 * t, shoot: o.shoot || 300 + 40 * t, line: o.line || 0.06 * t, names: n.slice(0, 5), win: "", hint: "" };
  }
  function utBegin(opts) {
    const team = utNorm(opts.team), opp = utOpp(opts.opp), diff = opts.diff !== undefined ? clamp(opts.diff | 0, 0, 2) : ((opts.opp && opts.opp.pw) || 36) <= 31 ? 0 : (opts.opp && opts.opp.pw) >= 47 ? 2 : 1;
    utCfg = { onExit: typeof opts.onExit === "function" ? opts.onExit : null, team, opp, diff, res: null, title: opts.title || "" };
    onExitCb = null; uiState = "menu"; utLineup();
  }
  const utChip = (k, v) => `<span style="display:inline-block;margin:1px 5px 1px 0;white-space:nowrap">${k} <b style="color:#fde047">${Math.round(v)}</b></span>`;
  function utLineup() {
    const C = utCfg, RN = { p: "Portiere", d: "Difesa", c: "Centrocampo", a: "Attacco" }, RR = { c: "Comune", r: "Rara", e: "Epica", l: "Leggendaria" };
    const rows = C.team.map((c, i) => {
      const st = c.st, chips = i === 0 ? utChip("Parata", st.gk ?? 50) + utChip("Pass", st.pas ?? 50) + utChip("Fiato", st.sta ?? 50) : utChip("Vel", st.spd ?? 50) + utChip("Tiro", st.pow ?? 50) + utChip("Prec", st.acc ?? 50) + utChip("Pass", st.pas ?? 50) + utChip("Dif", st.def ?? 50) + utChip("Fiato", st.sta ?? 50);
      return `<div class="ahd-ut-row"><div class="ahd-ut-pt" data-pi="${i}">${esc(c.name.charAt(0))}</div><div style="min-width:0"><b>${esc(c.name)}</b><div class="ahd-sub" style="margin:0">${(() => { const sl = i === 0 ? "Portiere" : ["", "Difesa", "Difesa", "Centrocampo", "Attacco"][i], cr = i === 0 ? "Portiere" : RN[c.role] || ""; return sl === cr || !cr ? sl : sl + " (carta: " + cr.toLowerCase() + ")"; })()}${c.rar ? " · " + esc(RR[c.rar] || "") : ""} · Lv ${c.lv}</div><div class="ahd-ut-st">${chips}</div></div></div>`;
    }).join("");
    showUi(`<h2>${esc(C.title || "Action Soccer HD")}</h2><p class="ahd-sub">Le tue carte in campo contro <b>${esc(C.opp.name)}</b> (${DIFFS[C.diff].n}). I valori delle carte cambiano scatto, tiro, passaggio, contrasto, parate e fiato.</p>${utCss()}${rows}
      <button class="ahd-btn" data-a="utgo">Calcio d'inizio</button><button class="ahd-btn sec" data-a="utno">Indietro</button>`);
    try { const sm = root.querySelector(".ahd-sc small"); if (sm) sm.textContent = "Ultimate Team del Borgo"; } catch (e) { /* ignora */ }
    on('[data-a="utgo"]', () => launch({ mode: "ut", opp: C.opp, diff: C.diff, ut: C.team, len: 100 }));
    on('[data-a="utno"]', () => closeAll());
    // ritratti: uno per volta, solo se il Borgo li sa disegnare; altrimenti resta l'iniziale
    C.team.forEach((c, i) => later(() => { try { const el = ui && ui.querySelector(`[data-pi="${i}"]`), api = window.__borgoApi; if (!el || !api || !api.portraitImg || !c.id) return; const u = api.portraitImg(c.id); if (u) { el.textContent = ""; el.style.backgroundImage = `url(${u})`; } } catch (e) { /* resta l'iniziale */ } }, 40 + i * 60));
  }
  function utCss() {
    return document.getElementById("ahd-ut-css") ? "" : `<style id="ahd-ut-css">.ahd-ut-row{display:flex;gap:9px;align-items:center;padding:6px 8px;margin:5px 0;border:1px solid #274466;border-radius:10px;background:#0f1d33}.ahd-ut-pt{flex:0 0 46px;width:46px;height:46px;border-radius:10px;background:#1e3a5f center/cover no-repeat;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;color:#7dd3fc}.ahd-ut-st{font-size:11px;color:#b6c8e4;line-height:1.35}.ahd-ut-row b{font-size:14px;overflow-wrap:anywhere}</style>`;
  }
  function resUt() {
    const [a, c] = M.score, win = a > c, draw = a === c, C = utCfg, sc = {};
    M.goalsLog.forEach((g) => { if (g.team === 0) sc[g.who] = (sc[g.who] || 0) + 1; });
    const scorers = Object.entries(sc).map(([n, k]) => (k > 1 ? n + " x" + k : n));
    C.res = { win, draw, a, c, scorers, shots: M.shots.slice(), saves: M.saves.slice(), names: C.team.map((x) => x.name) };
    const stat = (k, v) => `<div class="ahd-stat"><span>${k}</span><span>${v}</span></div>`;
    putRes(`<h2>${win ? "Vittoria!" : draw ? "Pareggio" : "Sconfitta"}</h2><div class="ahd-score"><span style="color:#7dd3fc">${a}</span> - <span style="color:#fca5a5">${c}</span></div>
      <p class="ahd-sub" style="text-align:center">Le tue carte vs ${esc(C.opp.name)}</p>
      ${stat("Marcatori", scorers.length ? esc(scorers.join(", ")) : "nessuno")}${stat("Tiri", M.shots[0] + " - " + M.shots[1])}${stat("Parate", M.saves[0] + " - " + M.saves[1])}
      <button class="ahd-btn" data-a="utdone">Continua</button>`, () => on('[data-a="utdone"]', () => closeAll()));
  }

  // ---------------------------------------------------------------- avvio partite
  function resetInput() {
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false; input.chargeF = 0; input.passEdge = false; input.shootRel = false; input.rond = false; input.sprint = false; input.touchOn = false; input.skip = false;
  }
  function launch(cfg) {
    CTX = cfg; cfg.cb = chapIds();
    try { if (cfg.opp && cfg.opp.tag) meet(HDC_TEAM[cfg.opp.tag]); meet(homeRoster().map((m) => HDC_MATE[m.id])); } catch (e) { /* ignora */ }
    hideUi(); uiState = "play"; paused = false;
    const sp = cfg.mode === "setp" || cfg.mode === "pens" || cfg.mode === "cup-pens";
    const dIdx = cfg.diff === undefined ? SET.diff : cfg.diff;
    if (cfg.mode === "ut") { newMatch(-1, dIdx, { opp: cfg.opp, mode: "ut", len: cfg.len || 100, ut: cfg.ut }); resetInput(); stage.querySelector(".ahd-pad").classList.toggle("all", SET.ctrl === "touch"); showDefaultStick(); acc = 0; lastTs = 0; say("Le tue carte in campo!", 2200); hud(); return; }
    if (sp) newMatch(-1, dIdx, { opp: cfg.opp || OPPS[0], mode: cfg.mode, len: 0, noHalf: true, noGolden: true });
    else newMatch(cfg.mi === undefined ? -1 : cfg.mi, dIdx, cfg);
    resetInput();
    stage.querySelector(".ahd-pad").classList.toggle("all", SET.ctrl === "touch");
    showDefaultStick();
    acc = 0; lastTs = 0;
    if (sp) {
      M.sp = { onEnd: null, next: null, kind: "", done: true, res: null, def: false, lock: false, rel: 0, rt: 0, t: 0, lim: 0 };
      if (cfg.mode === "setp") { M.setp = { plan: ["fk", "cor", "pen", "fk", "cor", "pen"], i: 0, goals: 0, log: [] }; X.meta.spPlayed++; saveX("meta"); M.sp.next = setpNext; }
      else { M.so = { sc: [0, 0], n: [0, 0], log: [[], []], saved: 0 }; M.sp.next = soNext; }
      M.state = "spwait"; M.timer = 24;
    } else {
      if (cfg.mode !== "train") { PROG.played++; saveProg(); }
      say(cfg.mode === "train" ? "Allenamento: prova Rondine e aftertouch senza fretta" : quip("start"), 2400);
    }
    hud();
  }
  function startMatch(mi) { launch({ mode: "torneo", mi, opp: OPPS[mi] }); }

  // ---------------------------------------------------------------- risultati
  let lastRes = null;
  const newChapsHtml = () => CHAPS.filter((c) => chapOpen(c) && !((CTX && CTX.cb) || []).includes(c.id)).map((c) => `<div class="ahd-new">Nuovo capitolo nel Diario: <b>${esc(c.t)}</b><button class="ahd-btn sec" data-ch="${c.id}" style="min-height:40px;margin:6px 0 0">Leggi</button></div>`).join("");
  function putRes(html, bind) {
    lastRes = { html, bind }; uiState = "result";
    showUi(html);
    ui.querySelectorAll("[data-ch]").forEach((b) => (b.onclick = () => showChapter(b.dataset.ch, () => putRes(lastRes.html, lastRes.bind))));
    if (bind) bind();
  }
  function tailHtml(shells, coins, dl) {
    let h = "";
    if (coins) h += `<p style="text-align:center;color:#fde047;font-weight:800">+${coins} monete (prima volta)</p>`;
    if (shells || (dl && dl.sh)) h += `<p class="ahd-sub" style="text-align:center">+${shells + (dl ? dl.sh : 0)} conchiglie</p>`;
    if (dl) dl.out.forEach((t) => { h += `<div class="ahd-new">Sfida del giorno completata: ${esc(t)}</div>`; });
    return h + newChapsHtml();
  }
  function showResult() {
    const m = M.mode;
    if (m === "ut") return resUt();
    if (m === "surv") return resSurv();
    if (m === "timed") return resTimed();
    if (m === "setp") return resSetp();
    if (m === "pens" || m === "cup-pens") return resPens();
    return resTeam();
  }
  const SOCC_LOSE = ["Si perde, ogni tanto. Nando intanto ha acceso la friggitrice: perdere con un cartoccio in mano fa meno male.", "Una sconfitta in meno di cento secondi. Per un Borgo che ha perso il traghetto cento volte, è quasi puntualità."];
  const SOCC_TIE = "Pareggio anche ai supplementari. Nessuno ha vinto, nessuno ha perso, e il fritto è ancora caldo. Riprova: stavolta la palla non ha scuse.";

  function resTeam() {
    const [a, c] = M.score, mode = M.mode, win = a > c, draw = a === c, o = M.opp;
    if (mode === "cup" && draw) {
      uiState = "result";
      showUi(`<h2>Pareggio dopo i supplementari</h2><div class="ahd-score"><span style="color:#7dd3fc">${a}</span> - <span style="color:#fca5a5">${c}</span></div>
        <div class="ahd-quote">${esc("Ginetta alza il fischietto d'argento: «Nella Coppa non si pareggia. Si va ai rigori. Respirate, poi tirate.»")}</div>
        <button class="ahd-btn" data-a="go">Ai rigori</button>`);
      on('[data-a="go"]', () => launch({ mode: "cup-pens", opp: o, diff: M.diffIdx, reg: [a, c], cb: CTX.cb }));
      return;
    }
    M.st.intesa = M.intesa;
    let st = 0, coins = 0, shells = win ? 0 : draw ? 1 : 0, extra = "";
    if (win) { st = 1 + (a - c >= 2 ? 1 : 0) + (c === 0 ? 1 : 0); PROG.wins++; shells = 2 + st; }
    if (mode === "torneo" && win && M.mi >= 0) {
      PROG.stars[M.mi] = Math.max(PROG.stars[M.mi], st);
      if (!PROG.coin[M.mi]) { PROG.coin[M.mi] = 1; coins += STAR_COINS[M.mi]; if (typeof window.addCoins === "function") { try { window.addCoins(STAR_COINS[M.mi]); } catch (e) { /* ignora */ } } }
    }
    if (mode === "free" && win) coins += coinOnce("free", 2);
    if (win) moloPt("win", mode + ":" + (M.mi >= 0 ? M.mi : (o.tag || o.name)));
    let quote = win ? o.win : draw ? SOCC_TIE : pick(SOCC_LOSE);
    let sea = null, cup = null;
    if (mode === "season") {
      sea = seasonApply(a, c); shells += sea.shells; coins += sea.coins;
      if (sea.done) extra = `<h3>Stagione conclusa: ${sea.rank + 1}° posto</h3><div class="ahd-quote">${esc(SEA_END[Math.min(5, sea.rank)])}</div>`;
    }
    if (mode === "cup") {
      cup = cupApply(win, a, c, false); shells += cup.shells; coins += cup.coins;
      extra = `<div class="ahd-quote">${esc(cup.champ ? CUP_END.win : cup.out ? CUP_END.lose : "Passi il turno. Il tabellone, nel frattempo, si è mosso senza di te.")}</div>`;
    }
    addShells(shells); saveProg();
    const dl = dailyEval({ mode, team: true, win, a, c, st: M.st });
    const next = mode === "torneo" && M.mi >= 0 && win && M.mi < OPPS.length - 1;
    const stat = (k, v) => `<div class="ahd-stat"><span>${k}</span><span>${v}</span></div>`;
    let btns = "";
    if (next) btns += `<button class="ahd-btn" data-a="next">Prossima sfida</button>`;
    if (mode === "season") btns += `<div class="ahd-row2"><button class="ahd-btn" data-a="tbl">Classifica</button><button class="ahd-btn sec" data-a="menu">Menu</button></div>`;
    else if (mode === "cup") btns += `<div class="ahd-row2"><button class="ahd-btn" data-a="tbl">Tabellone</button><button class="ahd-btn sec" data-a="menu">Menu</button></div>`;
    else btns += `<div class="ahd-row2"><button class="ahd-btn ${next ? "sec" : ""}" data-a="again">Rigioca</button><button class="ahd-btn sec" data-a="menu">${mode === "torneo" ? "Torneo" : "Menu"}</button></div>`;
    putRes(`<h2>${win ? "Vittoria!" : draw ? "Pareggio" : "Sconfitta"}</h2><div class="ahd-score"><span style="color:#7dd3fc">${a}</span> - <span style="color:#fca5a5">${c}</span></div>
      <p class="ahd-sub" style="text-align:center">Rondine vs ${esc(o.name)} · ${MODE_NAMES[mode] || ""}</p>
      ${win ? `<div class="ahd-stars">${stars(st)}</div>` : ""}
      <div class="ahd-quote">${esc(quote)}</div>${extra}
      ${stat("Tiri", M.shots[0] + " - " + M.shots[1])}${stat("Parate", M.saves[0] + " - " + M.saves[1])}${stat("Intese Leo-Nico", M.intesa)}
      ${tailHtml(shells, coins, dl)}${btns}`, () => {
      on('[data-a="next"]', () => showIntro(M.mi + 1));
      on('[data-a="again"]', () => launch(CTX));
      on('[data-a="tbl"]', mode === "season" ? showSeason : showCup);
      on('[data-a="menu"]', mode === "torneo" ? showTorneo : showMenu);
    });
  }

  const SURV_END = [
    "Cadi alla prima ondata. Il mare insegna: non tutte le onde si prendono di petto.",
    "Hai tenuto un po', poi la marea ha fatto la marea. Il Molo non giudica: ti passa un cartoccio.",
    "Bella resistenza. Arturo parla di «lotta di scoglio»: a Genova è un complimento.",
    "Quasi un faro: hai retto ondata dopo ondata. Ginetta annota il nome a matita, per ora.",
  ];
  function resSurv() {
    const g = M.score[0], lv = M.level, rec = g > X.best.surv;
    if (rec) X.best.surv = g; saveX("best");
    const coins = g >= 5 ? coinOnce("surv", 3) : 0, shells = g + (lv - 1);
    if (g >= 5) moloPt("feat", "surv5");
    addShells(shells);
    const dl = dailyEval({ mode: "surv", level: lv, a: g, c: M.score[1], st: M.st, team: false });
    putRes(`<h2>Sopravvivenza finita</h2><div class="ahd-score"><span style="color:#7dd3fc">${g}</span></div><p class="ahd-sub" style="text-align:center">gol segnati · ondata ${lv}${rec ? " · nuovo record!" : ""}</p>
      <div class="ahd-quote">${esc(SURV_END[lv <= 1 ? 0 : lv <= 3 ? 1 : lv <= 5 ? 2 : 3])}</div>
      <div class="ahd-stat"><span>Record</span><span>${X.best.surv} gol</span></div>${tailHtml(shells, coins, dl)}
      <div class="ahd-row2"><button class="ahd-btn" data-a="again">Riprova</button><button class="ahd-btn sec" data-a="menu">Menu</button></div>`, () => {
      on('[data-a="again"]', () => launch(CTX)); on('[data-a="menu"]', showMenu);
    });
  }
  function resTimed() {
    const g = M.score[0], medal = g >= 6 ? 3 : g >= 4 ? 2 : g >= 2 ? 1 : 0, rec = g > X.best.timed;
    if (rec) X.best.timed = g; saveX("best");
    const coins = medal === 3 ? coinOnce("timed", 3) : 0, shells = g + medal;
    if (medal === 3) moloPt("feat", "timed3");
    addShells(shells);
    const dl = dailyEval({ mode: "timed", a: g, c: M.score[1], st: M.st, team: false });
    const txt = ["Zero medaglie. Il cronometro dice che hai corso bene: peccato che il pallone fosse altrove.", "Bronzo: il minimo sindacale del Molo, cioè quello che regge.", "Argento. Ginetta controlla l'orologio e non trova nulla da ridire, il che è già una medaglia.", "Oro! Arturo, in diretta: «Il tempo è finito, ma il Molo era già in ritardo»."][medal];
    putRes(`<h2>Tempo scaduto</h2><div class="ahd-score"><span style="color:#7dd3fc">${g}</span></div><p class="ahd-sub" style="text-align:center">gol in 75 secondi${rec ? " · nuovo record!" : ""}</p>
      <div class="ahd-stars">${["☆☆☆", "★☆☆", "★★☆", "★★★"][medal]}</div><div class="ahd-quote">${esc(txt)}</div>
      <div class="ahd-stat"><span>Record</span><span>${X.best.timed} gol</span></div>${tailHtml(shells, coins, dl)}
      <div class="ahd-row2"><button class="ahd-btn" data-a="again">Riprova</button><button class="ahd-btn sec" data-a="menu">Menu</button></div>`, () => {
      on('[data-a="again"]', () => launch(CTX)); on('[data-a="menu"]', showMenu);
    });
  }
  function resSetp() {
    const S = M.setp, g = S.goals, rec = g > X.best.setp, st = g >= 5 ? 3 : g >= 4 ? 2 : g >= 2 ? 1 : 0;
    if (rec) X.best.setp = g; saveX("best");
    const coins = g >= 4 ? coinOnce("setp", 3) : 0, shells = g + st;
    if (g >= 4) moloPt("feat", "setp4");
    addShells(shells);
    const dl = dailyEval({ mode: "setp", goals: g, a: g, c: 0, st: M.st, team: false });
    const nm = { fk: "Punizione", cor: "Angolo", pen: "Rigore" }, rs = { goal: "gol", save: "parato", block: "barriera", miss: "fuori", conceded: "gol subito" };
    const lines = S.log.map((l, i) => `<div class="ahd-stat"><span>${i + 1}. ${nm[l.kind]}</span><span class="${l.res === "goal" ? "ahd-done" : ""}">${rs[l.res] || l.res}</span></div>`).join("");
    const txt = ["Sei calci da fermo, zero gol: Ginetta controlla se il pallone è quadrato. Non lo è.", "Qualcosa si muove: il Molo applaude con una mano sola, l'altra tiene il cartoccio.", "Bel lavoro da fermo. Il portiere dice che era già in volo, ma verso un'altra idea.", "Da manuale. Arturo propone di dedicarti una sigla; Ginetta di dedicarti un calcio d'angolo."][st];
    putRes(`<h2>Calci piazzati</h2><div class="ahd-score"><span style="color:#7dd3fc">${g}</span> / ${S.plan.length}</div><div class="ahd-stars">${stars(st)}</div>
      <div class="ahd-quote">${esc(txt)}</div>${lines}${tailHtml(shells, coins, dl)}
      <div class="ahd-row2"><button class="ahd-btn" data-a="again">Riprova</button><button class="ahd-btn sec" data-a="menu">Menu</button></div>`, () => {
      on('[data-a="again"]', () => launch(CTX)); on('[data-a="menu"]', showMenu);
    });
  }
  function resPens() {
    const S = M.so, win = S.sc[0] > S.sc[1], cupMode = M.mode === "cup-pens";
    let coins = 0, shells = win ? 4 : 1, extra = "", cup = null;
    if (!cupMode) { if (win) { X.best.pens++; saveX("best"); coins = coinOnce("pens", 3); moloPt("feat", "pens"); } }
    else { const reg = CTX.reg || [0, 0]; cup = cupApply(win, reg[0], reg[1], true); shells += cup.shells; coins += cup.coins; extra = `<div class="ahd-quote">${esc(cup.champ ? CUP_END.win : cup.out ? CUP_END.lose : "Rigori vinti, nervi saldi: avanti nel tabellone.")}</div>`; }
    if (win) PROG.wins++; saveProg();
    addShells(shells);
    const dl = dailyEval({ mode: "pens", saved: S.saved, win, a: S.sc[0], c: S.sc[1], st: M.st, team: false });
    const dots = (arr) => arr.map((r) => (r ? "●" : "✕")).join(" ");
    const txt = win ? "Il portiere guarda la palla in rete come si guarda un treno che parte. Nessun rimpianto, solo un po' di fritto." : "Dal dischetto il pallone pesa il doppio: succede a tutti, a Genova di più.";
    putRes(`<h2>${win ? "Rigori vinti!" : "Rigori persi"}</h2><div class="ahd-score"><span style="color:#7dd3fc">${S.sc[0]}</span> - <span style="color:#fca5a5">${S.sc[1]}</span></div>
      <div class="ahd-stat"><span>Tuoi tiri</span><span>${dots(S.log[0])}</span></div><div class="ahd-stat"><span>Loro tiri</span><span>${dots(S.log[1])}</span></div>
      <div class="ahd-quote">${esc(txt)}</div>${extra}${tailHtml(shells, coins, dl)}
      <div class="ahd-row2">${cupMode ? `<button class="ahd-btn" data-a="tbl">Tabellone</button>` : `<button class="ahd-btn" data-a="again">Rigioca</button>`}<button class="ahd-btn sec" data-a="menu">Menu</button></div>`, () => {
      on('[data-a="again"]', () => launch(CTX)); on('[data-a="tbl"]', showCup); on('[data-a="menu"]', showMenu);
    });
  }

  function pauseGame() {
    if (uiState !== "play") return;
    uiState = "pause"; paused = true;
    input.charging = false; input.jx = input.jy = 0;
    const mode = M.mode, train = mode === "train";
    showUi(`<h2>In pausa</h2><p class="ahd-sub">${esc(MODE_NAMES[mode] || "")} · ${esc(M.opp.name)} · ${hudInfo().a} - ${hudInfo().c}</p>
      <button class="ahd-btn" data-a="res">Riprendi</button>
      <h3>Controlli</h3>${segHtml("ctrl", ["Joystick", "Tocca e corri"], SET.ctrl, ["stick", "touch"])}
      <div class="ahd-row2"><button class="ahd-btn sec" data-a="tut">Come si gioca</button>${train ? '<button class="ahd-btn sec" data-a="ctr">Palla al centro</button>' : '<button class="ahd-btn sec" data-a="rst">Ricomincia</button>'}</div>
      <button class="ahd-btn red" data-a="menu">Abbandona (menu)</button>`);
    on('[data-a="res"]', resumeGame);
    on('[data-a="tut"]', () => showTutorial(0, pauseGame));
    on('[data-a="rst"]', () => launch(CTX));
    on('[data-a="ctr"]', () => { setupKickoff(0); M.score = [0, 0]; resumeGame(); });
    on('[data-a="menu"]', () => (utCfg ? closeAll() : showMenu()));
  }
  function resumeGame() { hideUi(); uiState = "play"; paused = false; lastTs = 0; acc = 0; showDefaultStick(); }

  // ---------------------------------------------------------------- apertura / chiusura
  function closeAll(silent) {
    if (closed && !root) return;
    closed = true;
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout); timers = [];
    cleanup.forEach((fn) => { try { fn(); } catch (e) { /* ignora */ } }); cleanup = [];
    if (root) { root.remove(); root = null; }
    cv = cx = ui = stage = null; M = null;
    input.jx = input.jy = input.kx = input.ky = 0; input.charging = false;
    const cb = onExitCb; onExitCb = null;
    const uc = utCfg; utCfg = null;
    if (silent !== true && uc && typeof uc.onExit === "function") { try { uc.onExit(uc.res); } catch (e) { console.error(e); } return; }
    if (silent !== true && typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  function openHd(opts) {
    opts = opts || {};
    if (root) closeAll(true);
    utCfg = null;
    injectCss();
    onExitCb = typeof opts.onExit === "function" ? opts.onExit : null;
    PROG = loadProg(); SET = loadSet(); X = loadX(); bgCache = null; CTX = null; lookPend = ""; teamInfo = "";
    closed = false; paused = false; lastTs = 0; acc = 0; M = null; uiState = "menu";
    root = document.createElement("div");
    root.className = "ahd-root"; root.id = "actionSoccerModal"; root.tabIndex = 0;
    root.innerHTML = `
      <div class="ahd-top">
        <button class="ahd-ib" data-a="pause" aria-label="Pausa">⏸</button>
        <div class="ahd-sc"><b>RON 0 - 0 ---</b><small>Coppa del Molo</small>
          <div class="ahd-bars"><div class="ahd-bar g" title="Grinta"><i></i></div><div class="ahd-bar s" title="Fiato"><i></i></div></div></div>
        <button class="ahd-ib" data-a="close" aria-label="Chiudi">✕</button>
      </div>
      <div class="ahd-stage">
        <canvas></canvas>
        <div class="ahd-pad"></div><div class="ahd-stk"><i></i></div>
        <div class="ahd-msg"></div><div class="ahd-banner"></div><div class="ahd-rep">▶ REPLAY · tocca per saltare</div>
        <div class="ahd-chg"><i></i></div>
        <div class="ahd-btns">
          <button class="ahd-b shoot" aria-label="Tiro">TIRO<small>tieni e rilascia</small></button>
          <button class="ahd-b pass" aria-label="Passa">PASSA<small>scivolata</small></button>
          <button class="ahd-b spr" aria-label="Scatto">SCATTO</button>
          <button class="ahd-b ron" aria-label="Tiro della Rondine">⚡<small>RONDINE</small></button>
        </div>
        <div class="ahd-ui"></div>
      </div>`;
    document.body.appendChild(root);
    stage = root.querySelector(".ahd-stage"); cv = root.querySelector("canvas"); cx = cv.getContext("2d"); ui = root.querySelector(".ahd-ui");

    root.querySelector('[data-a="close"]').onclick = () => { if (uiState === "play") pauseGame(); else closeAll(); };
    root.querySelector('[data-a="pause"]').onclick = () => { if (uiState === "play") pauseGame(); else if (uiState === "pause") resumeGame(); };
    bindPad();
    bindBtn(root.querySelector(".ahd-b.shoot"), () => { if (uiState === "play") { input.charging = true; input.chargeF = 0; } }, () => { if (input.charging) { input.charging = false; input.shootRel = true; } });
    bindBtn(root.querySelector(".ahd-b.pass"), () => { if (uiState === "play") input.passEdge = true; });
    bindBtn(root.querySelector(".ahd-b.spr"), () => { input.sprint = true; }, () => { input.sprint = false; });
    bindBtn(root.querySelector(".ahd-b.ron"), () => { if (uiState === "play") input.rond = true; });
    // tocco per saltare il replay
    stage.addEventListener("pointerdown", () => { if (M && M.rep) input.skip = true; }, true);

    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false);
    window.addEventListener("keydown", kd, { passive: false }); window.addEventListener("keyup", ku, { passive: false });
    const vis = () => { if (document.hidden && uiState === "play") pauseGame(); };
    document.addEventListener("visibilitychange", vis);
    cleanup.push(() => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); document.removeEventListener("visibilitychange", vis); });
    if (DEBUG) {
      window.__ahd = {
        M: () => M, input, SET, PROG: () => PROG, X: () => X, CTX: () => CTX,
        start: (mi, d) => { if (d !== undefined) SET.diff = d; startMatch(mi); },
        launch: (cfg) => launch(cfg), go: (g) => openGo(g), ALLT, KITS, CHAPS, MATES,
        ts: (n) => { window.__ahdTS = n; },
        step: () => step(), kick: (...a) => kickBall(...a), gkUpdate: (g) => gkUpdate(g), spSetup: (k) => spSetup(k), K: { XL, XR, GM, GH, GT, GB, BOX_D },
      };
    }

    raf = requestAnimationFrame(loop);
    root.focus();
    const go = opts.mode || "menu";
    if (go === "ut") utBegin(opts); else if (go === "menu") showMenu(); else openGo(go);
  }
  window.openActionSoccerHD = function (onExit) { openHd({ onExit }); };

  // stato sintetico per il Borgo (NPC organizzatrice): legge solo i salvataggi, non apre nulla
  function hdState() {
    if (!root) { PROG = loadProg(); SET = loadSet(); X = loadX(); }
    const open = CHAPS.filter(chapOpen), D = dailyEnsure();
    const last = open[open.length - 1];
    return {
      version: 2, chapters: open.length, total: CHAPS.length, latest: last ? last.t : "",
      latestId: last ? last.id : "", newChapters: open.filter((c) => !X.meta.seen.includes(c.id)).length,
      seasonOn: !!(X.season && !X.season.done), md: X.season ? X.season.md : 0, cupOn: !!(X.cup && !X.cup.done), cupWon: X.meta.cupsWon, titles: X.meta.seasonTitles,
      dailyLeft: D.ids.length - D.done.length, streak: D.streak, shells: X.meta.shells, played: totalPlays(), torneo: PROG.stars.filter((q) => q > 0).length,
    };
  }
  window.__actionHd = { version: 2, ut: 1, start: openHd, state: hdState, modes: ["menu", "torneo", "season", "cup", "free", "surv", "timed", "pens", "setp", "train", "daily", "team", "look", "tac", "diary"] };
})();
