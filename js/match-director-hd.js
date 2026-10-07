// js/match-director-hd.js - Matchday Director 2D HD: il gestionale live del Mister del Rondine FC
// Entry: window.openMatchDirectorHD(onExit)
(function () {
  "use strict";

  const SAVE_KEY = "ali-di-rondine.director-hd-v1";
  const STYLE_ID = "mdx-style";
  const W = 400, H = 380; // coordinate logiche del campo (verticale, noi attacchiamo verso l'alto)
  const STEP_MS = { 1: 1400, 2: 700, 4: 330 };

  // ---------------------------------------------------------------- util
  const rnd = Math.random;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const snd = (n, a) => { try { if (window.HD2DAudio && window.HD2DAudio[n]) window.HD2DAudio[n](a); } catch (e) { /* audio opzionale */ } };

  // ---------------------------------------------------------------- dati
  const FORMS = {
    "4-3-3": { n: { DIF: 4, CEN: 3, ATT: 3 }, prof: { atk: 1.05, mid: 1.0, def: 0.97 }, info: "Tre punte: più occasioni, meno filtro." },
    "4-4-2": { n: { DIF: 4, CEN: 4, ATT: 2 }, prof: { atk: 0.98, mid: 1.05, def: 1.0 }, info: "Equilibrato e ordinato, nessun colpo di genio." },
    "3-5-2": { n: { DIF: 3, CEN: 5, ATT: 2 }, prof: { atk: 0.98, mid: 1.13, def: 0.92 }, info: "Domini il centrocampo, ma dietro ballano in tre.", unlock: { wins: 1, label: "1 vittoria" } },
    "5-4-1": { n: { DIF: 5, CEN: 4, ATT: 1 }, prof: { atk: 0.84, mid: 0.98, def: 1.13 }, info: "Pullman davanti alla porta. Brutto ma efficace.", unlock: { wins: 3, label: "3 vittorie" } },
    "4-5-1": { n: { DIF: 4, CEN: 5, ATT: 1 }, prof: { atk: 0.9, mid: 1.12, def: 1.04 }, info: "Centrocampo foltissimo, una punta sola e tanta pazienza.", unlock: { wins: 7, label: "7 vittorie" } },
    "3-4-3": { n: { DIF: 3, CEN: 4, ATT: 3 }, prof: { atk: 1.1, mid: 1.0, def: 0.88 }, info: "Tutti all'assalto: spettacolo garantito, difesa su appuntamento.", unlock: { wins: 12, label: "12 vittorie" } }
  };
  const MENT = {
    prudente: { ico: "🛡️", t: "Cauta", atk: 0.92, def: 1.08, ctr: 0.8, st: 0.9, info: "Meno rischi: pochi contropiedi subiti, meno occasioni." },
    equil: { ico: "⚖️", t: "Equil.", atk: 1, def: 1, ctr: 1, st: 1, info: "Nessun rischio particolare. Nessuna gloria particolare." },
    offensiva: { ico: "🔥", t: "Attacco", atk: 1.08, def: 0.94, ctr: 1.25, st: 1.08, info: "Più occasioni, ma sei esposto al contropiede." },
    allin: { ico: "🎲", t: "All-in", atk: 1.2, def: 0.82, ctr: 1.6, st: 1.2, info: "Tutti avanti! Se perdi palla, preghi." }
  };
  const PRESS = {
    basso: { ico: "🧱", t: "Basso", mid: 0.96, st: 0.72, info: "Risparmi fiato, regali metri di campo." },
    medio: { ico: "↔️", t: "Medio", mid: 1, st: 1, info: "Pressione normale." },
    alto: { ico: "⚡", t: "Alto", mid: 1.06, st: 1.45, info: "Recuperi palla alta e soffoca i palleggiatori, ma ti svuota." }
  };

  const OPPS = [
    {
      id: "gabbiani", name: "Gabbiani del Porto", short: "Gabbiani", ico: "🕊️", col: "#e2e8f0", col2: "#64748b", lvl: 0.97, form: "4-3-3", style: "Palleggio",
      blurb: "Belli da vedere, un po' svenevoli. Tengono palla come se pagasse la società.",
      hint: "Soffrono il pressing alto: costringili a sbagliare.",
      goal: "Recupera palla alta almeno 2 volte (pressing alto)",
      mod: { atk: 0.95, mid: 1.08, def: 0.92, pressWeak: 0.86, foul: 0.02, ctr: 0.9, wall: 1, tire: 1 },
      names: ["Pippo Sala", "Remo Vento", "Orso Bini", "Gigi Ancora", "Tullio Nasse", "Biagio Salsa", "Cesco Lima", "Nino Rete", "Ettore Faro", "Zeno Pinna", "Lollo Bruma"],
      twist: (S) => {
        if (S.min === 60 && S.scoreB >= S.scoreA) { S.oppBuff.mid = 1.12; S.oppBuff.atk = 0.92; addLog("🕊️ I Gabbiani fanno melina: palleggio a oltranza, il pubblico sbadiglia.", "opp"); }
      }
    },
    {
      id: "corsari", name: "Corsari di Scoglio Nero", short: "Corsari", ico: "🏴‍☠️", col: "#fca5a5", col2: "#7f1d1d", lvl: 0.96, form: "4-4-2", style: "Fisici e rissosi",
      blurb: "Gomiti larghi, barbe larghe, sorrisi stretti. Il pallone è un dettaglio.",
      hint: "Letali in contropiede: se ti sbilanci, ti puniscono.",
      goal: "Vinci senza prendere nemmeno un cartellino rosso e al massimo 1 giallo",
      mod: { atk: 1.0, mid: 0.97, def: 1.0, pressWeak: 1, foul: 0.07, ctr: 1.25, wall: 1, tire: 1 },
      names: ["Capitan Uncino", "Brando Ruggine", "Tizzo Ancora", "Moro Catena", "Bruno Randa", "Siro Fune", "Tonno Duro", "Nerio Sale", "Ciro Gancio", "Pelo Rosso", "Dante Nodo"],
      twist: (S) => {
        if (S.min === 55) { S.oppBuff.atk = 1.08; S.oppBuff.foul = 0.12; addLog("🏴‍☠️ I Corsari alzano la voce (e i gomiti). Si fa dura.", "opp"); }
      }
    },
    {
      id: "dragoni", name: "Dragoni della Diga", short: "Dragoni", ico: "🐉", col: "#86efac", col2: "#14532d", lvl: 0.97, form: "5-4-1", style: "Muro di cemento",
      blurb: "Cinque dietro, quattro davanti ai cinque, uno che prega in avanti. Il cemento non fa gol, ma nemmeno ne prende.",
      hint: "Si sfonda con pazienza, mentalità d'attacco e gambe fresche nel finale.",
      goal: "Segna almeno 2 gol dopo il 60'",
      mod: { atk: 0.86, mid: 0.98, def: 1.14, pressWeak: 1, foul: 0.03, ctr: 1, wall: 0.82, tire: 1.25 },
      names: ["Gorgo Muro", "Piero Diga", "Ugo Molo", "Sasso Bianco", "Tano Cemento", "Rocco Pila", "Fabio Argine", "Nanni Chiusa", "Dino Sbarra", "Cosimo Lastra", "Giotto Fondo"],
      twist: (S) => {
        if (S.min === 70) {
          if (S.scoreB < S.scoreA) { S.oppBuff.def = 0.86; S.oppBuff.atk = 1.2; addLog("🐉 I Dragoni sono costretti a scoprirsi: la diga ha una crepa.", "opp"); }
          else { S.oppBuff.def = 1.08; addLog("🐉 I Dragoni si chiudono ancora di più. Sembra un muro del pianto.", "opp"); }
        }
      }
    },
    {
      id: "fanfara", name: "Fanfara del Mercato", short: "Fanfara", ico: "🎺", col: "#fcd34d", col2: "#92400e", lvl: 1.0, form: "3-5-2", style: "Imprevedibili",
      blurb: "Squadra di fruttivendoli, cugini e un trombettista in panchina. Non sai mai cosa suonano.",
      hint: "Cambiano spartito ogni tanto: segnano e subiscono tanto. Tieni i nervi saldi.",
      goal: "Vinci subendo al massimo 1 gol",
      mod: { atk: 1.06, mid: 1.0, def: 0.9, pressWeak: 1, foul: 0.03, ctr: 1.1, wall: 1, tire: 1 },
      names: ["Gaspare Cassetta", "Totò Banco", "Rino Arancia", "Mimmo Bilancia", "Lucio Sedano", "Pino Trombone", "Carmine Nasello", "Ninni Pesca", "Vito Zucca", "Peppe Ciliegia", "Alfio Tamburo"],
      twist: (S) => {
        if (S.min === 30 || S.min === 62) {
          if (rnd() < 0.5) { S.oppBuff.atk = 1.2; S.oppBuff.def = 0.82; addLog("🎺 La Fanfara cambia spartito: tutti all'attacco, trombone compreso!", "opp"); }
          else { S.oppBuff.atk = 0.9; S.oppBuff.def = 1.12; addLog("🎺 La Fanfara cambia spartito: marcia funebre difensiva.", "opp"); }
        }
      }
    },
    {
      id: "mareggiata", name: "Real Mareggiata", short: "Mareggiata", ico: "🌊", col: "#7dd3fc", col2: "#1e3a8a", lvl: 1.04, form: "4-3-3", style: "Gli squadroni",
      blurb: "Maglie di seta, sponsor sul petto, un allenatore che sembra uscito da una rivista. La sfida finale del Borgo.",
      hint: "Nessun punto debole, ma leggono i tuoi ordini: variali al momento giusto.",
      goal: "Vinci usando al massimo 2 cambi",
      mod: { atk: 1.04, mid: 1.04, def: 1.04, pressWeak: 0.97, foul: 0.03, ctr: 1.1, wall: 0.95, tire: 0.9 },
      names: ["Fausto Marea", "Ruggero Onda", "Leandro Corrente", "Tancredi Risacca", "Ettore Spuma", "Orlando Baia", "Ludo Scirocco", "Silvano Bonaccia", "Gualtiero Maestrale", "Ivo Libeccio", "Cesare Tramonto"],
      twist: (S) => {
        if (S.min === 50) {
          if (S.ment === "offensiva" || S.ment === "allin") { S.oppBuff.ctr = 1.2; addLog("🌊 Il Mareggiata ha letto il tuo assalto: preparano il contropiede.", "opp"); }
          else { S.oppBuff.mid = 1.06; addLog("🌊 Il Mareggiata studia il tuo ordine e prende il centrocampo.", "opp"); }
        }
      }
    }
  ];


  // ---------------------------------------------------------------- Stagioni, personaggi, episodi nuovi
  const CHAR = {
    Spigola: "Presidente Spigola", Dina: "Dina Cartella", Sara: "Sara", Arturo: "Arturo · Radio Molo", Ferri: "Nonna Ferri",
    Settimio: "Settimio", Rocco: "Rocco Scafati", Brina: "Mister Brina", Bonaccia: "Cavalier Bonaccia", Ester: "Ester", Anselmo: "Anselmo",
    Aurelio: "Don Aurelio", Leo: "Leo", Rob: "Rob"
  };
  const SEASONS = [
    { id: 0, t: "Stagione 1 · Il Torneo del Molo", ico: "🏆", trophy: "Targa del Molo", fin: "mareggiata",
      intro: ["Spigola", "«Mister, la società ha tre soldi, cinque partite e un'idea: vincere il Torneo del Molo. Due di queste cose sono vere. Dina, segni.»"],
      outro: ["Spigola", "«Il Torneo del Molo è NOSTRO! Dina, il barattolo delle acciughe ha un fondo nuovo. E il Mister, un contratto nuovo.»"] },
    { id: 1, t: "Stagione 2 · La Coppa delle Due Baie", ico: "⚓", trophy: "Coppa delle Due Baie", fin: "bellavista",
      intro: ["Dina", "«Buone e cattive notizie, Mister. Le buone: la Coppa delle Due Baie ci ha invitati. Le cattive: si gioca fuori casa, di sera, e il pullman è quello di Baciccia. Dice che 'tiene'.»"],
      outro: ["Spigola", "«Il Cavalier Bonaccia ha ritirato l'offerta sul campo. Ha detto 'a mai più', che da lui è un complimento. Mister, il campo di Settimio resta del Borgo!»"] },
    { id: 2, t: "Stagione 3 · Il Campionato del Golfo", ico: "🌊", trophy: "Coppa del Golfo", fin: "libeccio",
      intro: ["Arturo", "«Qui Radio Molo, buonasera. Parte il Campionato del Golfo: sei giornate, un golfo, e il Rondine in testa alla classifica per distrazione altrui. Il vento è favorevole a chi ha il vento favorevole.»"],
      outro: ["Dina", "«Primi nel Golfo. Ho dovuto stampare una classifica nuova: la vecchia aveva il Rondine solo in nota a piè di pagina.»"] },
    { id: 3, t: "Stagione 4 · La Coppa del Faro", ico: "🔦", trophy: "Coppa del Faro", fin: "mareggiata2",
      intro: ["Ester", "«Dal faro si vede tutta la costa, Mister. Stasera si vede anche la Coppa: per averla si sale, si scende e si risale. Come i miei centotredici gradini.»"],
      outro: ["Spigola", "«Mister... il Borgo è in piazza e nessuno vuole tornare a casa. Settimio ha tagliato l'erba della piazza, per festeggiare. Non l'avevamo chiesto.»"] }
  ];
  // storie degli episodi originali (aggiunte, il resto è invariato)
  const SEASON_DRAW = [
    ["Sara", "«Un pareggio è un pezzo di vittoria che deve ancora crescere, Mister. Dati alla mano: poco, ma cresce.»"],
    ["Dina", "«Un punto. Lo segno col lapis, nel caso volessimo cambiarlo in un due.»"],
    ["Arturo", "«Finisce pari. Il pubblico applaude a metà, l'altra metà sta ancora digerendo.»"],
    ["Ester", "«Un pareggio è un faro acceso a metà. Domani lo si accende del tutto.»"]
  ];
  const STORY0 = {
    gabbiani: { s: 0, ep: 1, pre: ["Spigola", "«Primo turno del Torneo del Molo. Contro i Gabbiani non perde nessuno, Mister: al massimo ci si annoia. Dina ha portato i panini, e li tiene stretti.»"], win: ["Dina", "«Tre punti e una focaccia. Li segno entrambi, in ordine di importanza decrescente.»"], lose: ["Arturo", "«Ko col Gabbiani. Il pubblico, nove persone e un cane, applaude comunque il cane.»"] },
    corsari: { s: 0, ep: 2, pre: ["Sara", "«Dati alla mano: i Corsari fanno più falli che passaggi. Non è un'opinione, è una colonna Excel.»"], win: ["Spigola", "«Vincere coi Corsari senza ambulanza è il mio sogno proibito. Mister, lei è un fenomeno.»"], lose: ["Dina", "«Ho già chiamato l'ambulanza. Per l'orgoglio. Quella per il resto, la paga il Presidente.»"] },
    dragoni: { s: 0, ep: 3, pre: ["Rob", "«Mister, i Dragoni sono cinque dietro, quattro davanti ai cinque, e uno che prega. Occhio alla pazienza.»"], win: ["Settimio", "«Una diga si buca una goccia alla volta, Mister. L'ho sempre detto al muro del campo. Mi dà sempre ragione.»"], lose: ["Sara", "«Statistica: dodici tiri, zero gol. Il cemento, in compenso, ha tirato benissimo.»"] },
    fanfara: { s: 0, ep: 4, pre: ["Arturo", "«La Fanfara entra in campo suonando. Il trombettista sta in panchina: mai sentito un 4-4-2 che suona così male.»"], win: ["Dina", "«Hanno suonato il bis, ma noi avevamo già segnato. Applausi, Mister.»"], lose: ["Spigola", "«Abbiamo preso l'applauso per sbaglio. Ho la sensazione che fosse per loro.»"] },
    mareggiata: { s: 0, ep: 5, pre: ["Brina", "«Mister Brina, Real Mareggiata. Auguro a lei e alla sua squadra una bella gita: la finale, per noi, è un'abitudine.»"], win: ["Brina", "«Un incidente, Mister. Un incidente molto ben organizzato. Ci rivedremo.»"], lose: ["Spigola", "«Il Real Mareggiata ha vinto. Ma noi abbiamo il fritto migliore. Non me lo dica nessuno, che non lo voglio sapere.»"] }
  };
  Object.keys(STORY0).forEach((k) => { const o = OPPS.find((x) => x.id === k); const s = STORY0[k]; o.season = s.s; o.ep = s.ep; o.story = { pre: s.pre, win: s.win, lose: s.lose }; o.coin = 3; });
  OPPS.find((x) => x.id === "mareggiata").needStars = 0;

  const FIRSTN = ["Remo", "Gino", "Nando", "Ciro", "Pino", "Toto", "Sergio", "Baldo", "Lino", "Mario", "Elio", "Rino", "Saro", "Ivo", "Berto", "Oreste", "Tullio", "Dino", "Memo", "Aldo", "Nilo", "Santo", "Tito", "Bepi"];
  function mkNames(seed, nk) { return Array.from({ length: 11 }, (_, i) => FIRSTN[(seed * 5 + i * 7) % FIRSTN.length] + " " + nk[i % nk.length]); }
  const T = (S, t, c) => addLog(t, c || "opp");

  const NEW_OPPS = [
    // ------------------------------------------------ STAGIONE 2
    {
      id: "lanterne", name: "Lanterne di Cala Fosca", short: "Lanterne", ico: "🏮", col: "#fde68a", col2: "#78350f", lvl: 1.0, form: "4-4-2", style: "Notturni",
      season: 1, ep: 6, coin: 4, mod: { atk: 1.0, mid: 0.98, def: 1.0, pressWeak: 1, foul: 0.03, ctr: 1.1, wall: 1, tire: 1 },
      blurb: "Si gioca di sera: il comune ha finito il budget delle luci. Anselmo ha portato le lampare, i pesci fanno il tifo dal molo.",
      hint: "Poca luce: i tiri entrano meno, per tutti. Parti forte, prima che cali il buio vero.",
      goal: "Segna almeno un gol nei primi 20 minuti", check: (S) => S.stats.earlyGoals >= 1,
      rules: { qf: 0.94, morale: 60 }, evForce: [{ min: 34, id: "lampare" }],
      story: { pre: ["Spigola", "«Il Comune ha finito il budget delle luci, Mister. Ma Anselmo ha portato le lampare: sono sette, e almeno quattro funzionano.»"], win: ["Anselmo", "«Ai pesci è piaciuto. Hanno applaudito con le pinne, e non è un modo di dire.»"], lose: ["Dina", "«Abbiamo perso nel buio. Il verbale dice 'per cause di forza maggiore e di fritto sbagliato'.»"] },
      beats: [{ min: 1, who: "Arturo", t: "Il campo è una distesa d'ombra con sette stelle di lampara. Il pallone, a occhio, è quello bianco." }],
      names: mkNames(1, ["Lampara", "Seppia", "Totano", "Fanale", "Cala", "Remo Lume"]),
      twist: (S) => { if (S.min === 62) { S.oppBuff.atk = 1.06; T(S, "🏮 Le Lanterne giocano 'a memoria': in questo buio conoscono ogni zolla."); } }
    },
    {
      id: "tonnara", name: "Tonnara United", short: "Tonnara", ico: "🐟", col: "#93c5fd", col2: "#1e3a8a", lvl: 1.02, form: "4-3-3", style: "Pressing totale",
      season: 1, ep: 7, coin: 4, mod: { atk: 1.03, mid: 1.06, def: 0.98, pressWeak: 1, foul: 0.03, ctr: 1.0, wall: 1, tire: 0.95 },
      blurb: "Pescatori di tonni, abituati a chiudere la rete a tutto campo. Con loro si gioca dentro una tonnara: poco spazio e molto sudore.",
      hint: "Il loro pressing ti consuma: scegli un modulo solido e tienilo.",
      goal: "Vinci senza mai cambiare modulo", check: (S) => S.stats.formChanges === 0,
      rules: { drain: 1.12 }, evForce: [],
      story: { pre: ["Sara", "«La Tonnara pressa per novanta minuti. Se cambiate modulo ogni dieci, vi perdete: quindi, Mister, cambi pochi e testa lucida.»"], win: ["Dina", "«Siamo usciti dalla rete. Qualche pesce in meno, ma c'è chi ne ha persi di più.»"], lose: ["Spigola", "«Preso nella rete, Mister. Capita ai migliori. Capita anche ai tonni, che sono bravi.»"] },
      beats: [{ min: 40, who: "Arturo", t: "La Tonnara chiude gli spazi. Non c'è un metro libero, nemmeno per un'idea." }],
      names: mkNames(2, ["Tonno", "Rete", "Amo", "Boa", "Sciabica", "Mattanza"]),
      twist: (S) => { if (S.min === 25 || S.min === 60) { S.oppBuff.mid = 1.08; T(S, "🐟 La Tonnara stringe la rete: pressing a tutto campo!"); S.xi.forEach((p) => { p.st = Math.max(8, p.st - 2); }); } if (S.min === 36 || S.min === 72) S.oppBuff.mid = 1; }
    },
    {
      id: "cantiere", name: "Cantiere Navale 1904", short: "Cantiere", ico: "⚓", col: "#fdba74", col2: "#7c2d12", lvl: 1.03, form: "4-4-2", style: "Instancabili",
      season: 1, ep: 8, coin: 4, mod: { atk: 0.99, mid: 1.02, def: 1.04, pressWeak: 1, foul: 0.04, ctr: 1.0, wall: 1, tire: 0.7 },
      blurb: "Squadra di operai: smontano una nave e una difesa con lo stesso sguardo. A fine turno, sono più freschi di quando iniziano.",
      hint: "Non si stancano mai: segna presto o dai spazio alle gambe fresche della panchina.",
      goal: "Vinci con almeno 3 marcatori diversi", check: (S) => Object.keys(S.stats.scorers).length >= 3,
      rules: {}, evForce: [],
      story: { pre: ["Dina", "«Il Cantiere ha il turno di notte, Mister: non è che si stanchino, è che il turno non finisce mai.»"], win: ["Rob", "«Mai visto tanti marcatori in una partita. Anche il panchinaro ha fatto un tentativo, Mister.»"], lose: ["Sara", "«Statistica: il Cantiere ha corso il doppio di noi nell'ultimo quarto. Non è una scusa, è un cantiere.»"] },
      beats: [],
      names: mkNames(3, ["Chiodo", "Scalo", "Martello", "Bitta", "Carena", "Scafo"]),
      twist: (S) => { if (S.min === 60) { S.oppStam = Math.min(100, S.oppStam + 9); T(S, "⚓ Cambio turno al Cantiere: gli operai freschi entrano in campo, con la sirena."); } }
    },
    {
      id: "scogli", name: "Scogli Rossi di Capo Vela", short: "Scogli Rossi", ico: "🦀", col: "#fca5a5", col2: "#991b1b", lvl: 1.04, form: "5-4-1", style: "Contropiedisti",
      season: 1, ep: 9, coin: 4, mod: { atk: 0.9, mid: 0.96, def: 1.08, pressWeak: 1, foul: 0.04, ctr: 1.45, wall: 0.9, tire: 1 },
      blurb: "Granchi in maglia rossa: camminano di lato, ripartono di scatto. Se perdi palla, il granchio ti ha già pizzicato.",
      hint: "Letali in ripartenza: mentalità prudente e centrocampo ordinato.",
      goal: "Concedi al massimo 4 tiri", check: (S) => S.shotsB <= 4,
      rules: {}, evForce: [],
      story: { pre: ["Rob", "«Mister, i Granchi non attaccano. Aspettano. Come Baciccia con la lenza, ma più cattivi.»"], win: ["Arturo", "«Il Granchio resta in secca. Il Borgo applaude con due mani, che è tutto quel che serve.»"], lose: ["Sara", "«Tre contropiedi, tre gol. Ho il grafico. Non lo mostro per rispetto.»"] },
      beats: [{ min: 20, who: "Rob", t: "«Mister, non lasciate tutti avanti. Il Granchio ha un solo passo, ma lo fa di corsa.»" }],
      names: mkNames(4, ["Granchio", "Chela", "Capo", "Vela", "Rosso", "Scoglio"]),
      twist: (S) => { if (S.min === 50 && S.scoreA >= S.scoreB) { S.oppBuff.ctr = 1.3; T(S, "🦀 Gli Scogli Rossi arretrano e aspettano l'errore: ogni nostra palla persa è un rischio."); } }
    },
    {
      id: "settimio", name: "Vecchie Glorie del Molo", short: "Vecchie Glorie", ico: "👴", col: "#e7e5e4", col2: "#57534e", lvl: 0.99, form: "3-5-2", style: "Gambe vecchie, testa fina",
      season: 1, ep: 10, coin: 4, mod: { atk: 1.02, mid: 1.1, def: 0.94, pressWeak: 1, foul: 0.01, ctr: 0.9, wall: 1, tire: 1.7 },
      blurb: "Il Trofeo Settimio: gli ex del Borgo sfidano la squadra attuale per i sessant'anni di Settimio, custode del vecchio stadio dal '62. Si gioca per ridere. Si ride, ma si gioca.",
      hint: "Corrono poco e male, ma ragionano benissimo. Si rispetta chi ha più anni: niente pressing.",
      goal: "Vinci senza mai usare il pressing alto", check: (S) => S.stats.altoMin === 0,
      rules: { morale: 66 }, evForce: [{ min: 30, id: "settimio" }],
      story: { pre: ["Settimio", "«Sessant'anni di forbici, Mister. Il campo l'ho tagliato a mano, a ogni stagione. Stasera mi basta una cosa: che sia bella.»"], win: ["Settimio", "«Mi avete regalato un pomeriggio. L'erba, domani, la taglio con più piacere.»"], lose: ["Dina", "«Abbiamo perso con le Vecchie Glorie. Da regolamento: nessuna conseguenza, tanta commozione.»"] },
      beats: [{ min: 1, who: "Arturo", t: "Settimio entra con le forbici in mano e un cappello da gala. Il pubblico, in piedi, canta a squarciagola, e a squarciagola è un'espressione prudente." }],
      names: mkNames(5, ["Senior", "Ricordo", "Baffo", "Fiocco", "Molo", "Cappello"]),
      twist: (S) => { if (S.min === 55) { S.oppBuff.mid = 1.05; T(S, "👴 Le Vecchie Glorie ricordano come si fa: due tocchi, e il pallone è già lontano."); } }
    },
    {
      id: "bellavista", name: "Bellavista Resort FC", short: "Bellavista", ico: "🏨", col: "#f9a8d4", col2: "#831843", lvl: 1.06, form: "4-3-3", style: "Professionisti in vacanza",
      season: 1, ep: 11, coin: 10, needStars: 8, mod: { atk: 1.05, mid: 1.05, def: 1.04, pressWeak: 0.95, foul: 0.03, ctr: 1.05, wall: 0.95, tire: 0.9 },
      blurb: "La squadra dell'hotel del Cavalier Bonaccia: ex professionisti col braccialetto dell'all-inclusive. Finale della Coppa delle Due Baie, e il campo di Settimio in palio.",
      hint: "Cambiano uomini ogni quarto d'ora: nel finale sono sempre freschi. Chiudila prima.",
      goal: "Vinci senza mai andare sotto", check: (S) => !S.stats.trailed,
      rules: { morale: 55 }, evForce: [{ min: 58, id: "bonaccia" }],
      story: { pre: ["Bonaccia", "«Mister, buonasera. Il campo del vecchio stadio ha un valore, il Borgo un debito. Vinca la Coppa e ne riparliamo. Perda, e il debito lo salda il Resort.»"], win: ["Dina", "«Il Cavaliere è uscito dal campo in silenzio. Ha dimenticato il cappello: lo teniamo in sede, come reperto.»"], lose: ["Spigola", "«Il Cavaliere sorride, Mister. È una vista che non si dimentica, purtroppo. Ma c'è sempre una rivincita.»"] },
      beats: [{ min: 1, who: "Bonaccia", t: "«Buonasera a tutti. Per gli ospiti del Resort: il Borgo è là, dietro il molo. Si vede se si guarda dall'alto.»" }],
      names: mkNames(6, ["Resort", "Suite", "Palma", "Bagno", "Aperitivo", "Lido"]),
      twist: (S) => { if (S.min === 30 || S.min === 60 || S.min === 75) { S.oppStam = Math.min(100, S.oppStam + 9); T(S, "🏨 Il Resort cambia mezza squadra: gambe fresche, abbronzatura intatta."); } if (S.min === 45 && S.scoreB >= S.scoreA) { S.oppBuff.mid = 1.07; } }
    },
    // ------------------------------------------------ STAGIONE 3
    {
      id: "mastri", name: "Mastri d'Ascia di Porto Sole", short: "Mastri d'Ascia", ico: "🔨", col: "#d6b98c", col2: "#44301a", lvl: 1.08, form: "4-4-2", style: "Ordine e legno",
      season: 2, ep: 12, coin: 5, mod: { atk: 1.0, mid: 1.0, def: 1.08, pressWeak: 1, foul: 0.05, ctr: 1.0, wall: 0.88, tire: 1 },
      blurb: "Carpentieri navali: pochi fronzoli, molta tenuta. Quando si dice «un muro di legno», loro non scherzano.",
      hint: "Tengono l'ordine e ti obbligano a tirare da lontano: tira tanto, e spesso.",
      goal: "Tira almeno 12 volte", check: (S) => S.shotsA >= 12,
      rules: {}, evForce: [],
      story: { pre: ["Arturo", "«Prima giornata del Campionato del Golfo. I Mastri d'Ascia si presentano con la cassetta degli attrezzi. A scopo tattico, assicurano.»"], win: ["Dina", "«Prima giornata e primi tre punti: Radio Molo ha detto 'classifica provvisoria', io l'ho incorniciata.»"], lose: ["Sara", "«Partenza storta. Conta poco: ho calcolato sei giornate e una pazienza.»"] },
      beats: [],
      names: mkNames(7, ["Ascia", "Chiglia", "Pialla", "Sega", "Cavo", "Quercia"]),
      twist: (S) => { if (S.min === 58 && S.scoreB >= S.scoreA) { S.oppBuff.def = 1.1; T(S, "🔨 I Mastri d'Ascia piantano il lucchetto: dietro si passa solo a giorni alterni."); } }
    },
    {
      id: "squali", name: "Squali di Punta Nera", short: "Squali", ico: "🦈", col: "#94a3b8", col2: "#0f172a", lvl: 1.1, form: "4-3-3", style: "Il derby della curva",
      season: 2, ep: 13, coin: 5, mod: { atk: 1.06, mid: 1.04, def: 1.0, pressWeak: 1, foul: 0.06, ctr: 1.15, wall: 1, tire: 1 },
      blurb: "Rocco Scafati e i suoi Squali, dietro la curva. Stesso mare, stesse case, colori più scuri. E una voglia matta di rovinare la serata al Borgo.",
      hint: "In trasferta il clima è ostile: tieni alto il morale e la testa fredda.",
      goal: "Chiudi la partita con il morale almeno a 70", check: (S) => S.morale >= 70,
      rules: { morale: 45 }, evForce: [{ min: 38, id: "rocco" }],
      story: { pre: ["Rocco", "«Moretti. In casa nostra. Il Catino ha già fatto a pezzi squadre migliori. Poi ti offro uno Squalo alla menta, e ti spiego come non farti mangiare.»"], win: ["Rocco", "«Ben giocato, Borgo. Lo Squalo alla menta, te lo prometto, ti sa di sconfitta. Ma è buono. Almeno quello.»"], lose: ["Rocco", "«Ci vediamo in vetrina, Mister. Il gusto è per me, la sconfitta è tua.»"] },
      beats: [{ min: 1, who: "Arturo", t: "Nel Catino piove, o forse è il mare. Lo Squalo dipinto sul muro ha lo stesso sorriso di Rocco." }],
      names: mkNames(8, ["Dente", "Pinna", "Nero", "Squalo", "Menta", "Catino"]),
      twist: (S) => { if (S.min === 40 && S.scoreA >= S.scoreB) { S.oppBuff.atk = 1.12; S.oppBuff.foul = 0.1; T(S, "🦈 Gli Squali sentono sangue: pressione, gomiti e il Catino che ruggisce."); } if (S.min === 70 && rnd() < 0.4 && !S.oppRed) { S.oppRed = true; S.oppXI.pop(); T(S, "🟥 Rosso diretto per un Squalo: l'arbitro non ha avuto dubbi. Punta Nera in dieci!"); } }
    },
    {
      id: "nebbia", name: "Fantasmi della Nebbia di Ponente", short: "Fantasmi", ico: "🌫️", col: "#cbd5e1", col2: "#334155", lvl: 1.06, form: "5-4-1", style: "Nebbia e ripartenze",
      season: 2, ep: 14, coin: 5, mod: { atk: 0.92, mid: 1.0, def: 1.1, pressWeak: 1, foul: 0.03, ctr: 1.2, wall: 0.9, tire: 1 },
      blurb: "Sono usciti dalla nebbia del Ponente e giocano come se non esistessero: compaiono, tirano, scompaiono. L'arbitro ha chiesto il conto dell'occhio.",
      hint: "Quasi non si vede nulla: i tiri sono più difficili. Più importante: non farti infilare.",
      goal: "Vinci senza subire gol", check: (S) => S.scoreB === 0,
      rules: { qf: 0.9 }, evForce: [{ min: 22, id: "nebbia" }],
      story: { pre: ["Arturo", "«Qui Radio Molo, ma non vedo il campo. Posso dirvi che c'è una nebbia così fitta che si taglia con un cartellino giallo.»"], win: ["Sara", "«Zero gol subiti nella nebbia: statisticamente, un miracolo. Lo scrivo a matita, per cautela.»"], lose: ["Dina", "«Abbiamo perso nella nebbia. Il verbale dice: partita giocata con fantasia.»"] },
      beats: [{ min: 50, who: "Arturo", t: "«Non vedo il pallone, ma lo sento. Fa un rumore bassissimo e un po' sleale.»" }],
      names: mkNames(9, ["Nebbia", "Ombra", "Brina", "Velo", "Foschia", "Spettro"]),
      twist: (S) => { if (S.min === 48) { S.oppBuff.ctr = 1.35; T(S, "🌫️ I Fantasmi spariscono e riappaiono dietro la difesa: occhio alle ripartenze."); } if (S.min === 70) S.oppBuff.ctr = 1.15; }
    },
    {
      id: "vignaioli", name: "Vignaioli di Costa Alta", short: "Vignaioli", ico: "🍇", col: "#c4b5fd", col2: "#4c1d95", lvl: 1.1, form: "3-5-2", style: "Maturi col tempo",
      season: 2, ep: 15, coin: 5, mod: { atk: 1.0, mid: 1.06, def: 0.97, pressWeak: 1, foul: 0.03, ctr: 1.0, wall: 1, tire: 0.85 },
      blurb: "Come il vino buono, migliorano invecchiando: più passa la partita, più sono pericolosi. All'inizio, sono ancora in cantina.",
      hint: "Colpiscili presto: nel finale sono molto più forti.",
      goal: "Segna almeno 2 gol nel primo tempo", check: (S) => S.stats.h1 >= 2,
      rules: {}, evForce: [],
      story: { pre: ["Rob", "«Mister, i Vignaioli sono come il vino: cattivi all'inizio, buoni dopo, e a me il vino fa male.»"], win: ["Dina", "«Hanno stappato troppo tardi. Noi li avevamo già serviti da un po'.»"], lose: ["Sara", "«Nel secondo tempo erano un'altra squadra. Il programma dice 'invecchiamento'. Ho scritto 'fine di stagione'.»"] },
      beats: [],
      names: mkNames(10, ["Vigna", "Tralcio", "Botte", "Mosto", "Grappolo", "Cantina"]),
      twist: (S) => { if (S.min === 30) { S.oppBuff.mid = 1.05; } if (S.min === 55) { S.oppBuff.mid = 1.1; S.oppBuff.atk = 1.1; T(S, "🍇 Il vino sale: i Vignaioli diventano un'altra squadra. Più maturi, più decisi."); } }
    },
    {
      id: "gozzi", name: "Gozzi di Baia Lunga", short: "Gozzi", ico: "⛵", col: "#7dd3fc", col2: "#0c4a6e", lvl: 1.07, form: "4-3-3", style: "Mare grosso",
      season: 2, ep: 16, coin: 5, mod: { atk: 1.04, mid: 1.04, def: 1.0, pressWeak: 0.82, foul: 0.03, ctr: 1.05, wall: 1, tire: 1 },
      blurb: "Trasferta lunga: il pullman di Baciccia si è fermato due volte e una l'ha fatta di sua iniziativa. Arrivate stanchi, con la maglia ancora sul sedile.",
      hint: "Parti già stanco: i tre cambi sono la tua benzina. Il pressing consuma tanto, ma loro lo soffrono.",
      goal: "Vinci usando tutti e 3 i cambi", check: (S) => S.subsUsed >= 3,
      rules: { stam: 84 }, evForce: [{ min: 18, id: "pullman" }],
      story: { pre: ["Dina", "«Il pullman di Baciccia è arrivato. Cioè: è arrivato Baciccia. Il pullman, secondo lui, è 'in transito'.»"], win: ["Spigola", "«Vittoria dopo tre ore di pullman. Mister, se questo è il sacrificio, voglio la tessera ad honorem.»"], lose: ["Arturo", "«Il pullman ha vinto la partita: ci ha fatto arrivare già stanchi. Non è una scusa, è la verità, e fa meno male.»"] },
      beats: [],
      names: mkNames(11, ["Gozzo", "Remo", "Vela", "Prua", "Poppa", "Ormeggio"]),
      twist: (S) => { if (S.min === 66) { S.oppBuff.atk = 1.08; T(S, "⛵ I Gozzi prendono il vento in poppa: onde di attacchi!"); } }
    },
    {
      id: "libeccio", name: "Libeccio Calcio", short: "Libeccio", ico: "🌬️", col: "#86efac", col2: "#166534", lvl: 1.12, form: "4-4-2", style: "Leggono il gioco",
      season: 2, ep: 17, coin: 12, needStars: 8, mod: { atk: 1.05, mid: 1.06, def: 1.05, pressWeak: 0.95, foul: 0.03, ctr: 1.08, wall: 0.95, tire: 0.95 },
      blurb: "Spareggio per il Campionato del Golfo. Il Libeccio è un vento che gira: così anche i suoi ordini cambiano a ogni ordine tuo.",
      hint: "Rispondono alle tue mosse: cambia tattica al momento giusto, non troppo spesso.",
      goal: "Vinci dopo essere andato in svantaggio (rimonta)", check: (S) => S.stats.trailed,
      rules: { morale: 55 }, evForce: [],
      story: { pre: ["Arturo", "«Qui Radio Molo, ultima giornata. Si decide tutto: se il Rondine vince, vince. Se perde, resta il fritto. E ne abbiamo tanto.»"], win: ["Spigola", "«CAMPIONI DEL GOLFO! Dina, fermi le macchine! Non c'è nessuna macchina? Ferme comunque!»"], lose: ["Sara", "«Per un punto: un solo punto, Mister. Non il solito, con l'asterisco: uno vero.»"] },
      beats: [{ min: 40, who: "Sara", t: "«Mister, il Libeccio sta leggendo le tue mosse. Se cambi qualcosa ora, magari non se lo aspetta.»" }],
      names: mkNames(12, ["Libeccio", "Vento", "Girasole", "Bussola", "Raffica", "Scirocco"]),
      twist: (S) => { if (S.min === 35 || S.min === 65) { if (S.ment === "offensiva" || S.ment === "allin") { S.oppBuff.ctr = 1.25; T(S, "🌬️ Il Libeccio gira: e va dritto sul tuo attacco, in contropiede."); } else { S.oppBuff.mid = 1.07; S.oppBuff.ctr = 1.1; T(S, "🌬️ Il Libeccio gira: prende il centrocampo mentre aspetti."); } } }
    },
    // ------------------------------------------------ STAGIONE 4
    {
      id: "cormorani", name: "Cormorani di Isola Piccola", short: "Cormorani", ico: "🐦", col: "#a5b4fc", col2: "#1e1b4b", lvl: 1.1, form: "4-3-3", style: "Tuffatori",
      season: 3, ep: 18, coin: 6, mod: { atk: 1.04, mid: 1.02, def: 0.98, pressWeak: 1, foul: 0.02, ctr: 1.12, wall: 1, tire: 1 },
      blurb: "Si buttano su ogni palla come sui pesci: elegantissimi, bagnati, impietosi. Ottavi di finale della Coppa del Faro.",
      hint: "Tuffi e ripartenze: non regalare palloni facili. Mai scoprirti del tutto.",
      goal: "Vinci senza mai usare l'All-in", check: (S) => !S.stats.allin,
      rules: {}, evForce: [],
      story: { pre: ["Ester", "«Dal faro li ho visti arrivare. Hanno l'aria di chi cade in acqua con una certa classe. Mister, occhio ai contropiedi.»"], win: ["Dina", "«Ottavi superati. Il Presidente dice che i quarti sono già nel bilancio: io non l'ho detto a nessuno.»"], lose: ["Spigola", "«I Cormorani vincono e vanno avanti. Mister, io li avrei cotti: sono grassi.»"] },
      beats: [],
      names: mkNames(13, ["Cormorano", "Tuffo", "Ala", "Penna", "Scoglio", "Becco"]),
      twist: (S) => { if (S.min === 57 && S.scoreB >= S.scoreA) { S.oppBuff.atk = 1.08; T(S, "🐦 I Cormorani picchiano in tuffo: tre cross in cinque minuti."); } }
    },
    {
      id: "faro_est", name: "Guardiani del Faro Est", short: "Guardiani", ico: "🔦", col: "#fef08a", col2: "#713f12", lvl: 1.11, form: "4-4-2", style: "Tiratori da lontano",
      season: 3, ep: 19, coin: 6, mod: { atk: 1.08, mid: 1.0, def: 1.04, pressWeak: 1, foul: 0.03, ctr: 1.0, wall: 1.08, tire: 1 },
      blurb: "I custodi dell'altro faro: abituati a mirare da lontano, tirano da tre quarti di campo. Il pallone fa luce sul suo cammino.",
      hint: "I loro tiri da fuori sono pericolosi: stringi le linee e non lasciare spazio.",
      goal: "Concedi al massimo 1 gol", check: (S) => S.scoreB <= 1,
      rules: {}, evForce: [{ min: 14, id: "faro_acceso" }],
      story: { pre: ["Ester", "«Sono i custodi dell'altra costa. Si salutano con la luce, tirano con la luce, giocano di notte. Io, dall'altro faro, faccio il tifo per te.»"], win: ["Ester", "«Ho acceso il faro due volte per voi, Mister. La seconda, perché mi andava.»"], lose: ["Sara", "«Troppe conclusioni da fuori. Il portiere ha fatto miracoli, ma i miracoli si stancano.»"] },
      beats: [],
      names: mkNames(14, ["Faro", "Lanterna", "Raggio", "Luce", "Fanale", "Scoglio Est"]),
      twist: (S) => { if (S.min === 48) { S.oppBuff.atk = 1.07; T(S, "🔦 I Guardiani cercano la botta da fuori: il Faro Est spara luce."); } }
    },
    {
      id: "ormeggiatori", name: "Ormeggiatori del Porto Vecchio", short: "Ormeggiatori", ico: "🪢", col: "#fdba74", col2: "#9a3412", lvl: 1.12, form: "5-4-1", style: "Corda e pazienza",
      season: 3, ep: 20, coin: 6, mod: { atk: 0.96, mid: 1.0, def: 1.1, pressWeak: 1, foul: 0.04, ctr: 1.1, wall: 0.88, tire: 1 },
      blurb: "Squadra da quarti di finale. In tribuna, per protesta contro il prezzo dei biglietti, la curva del Rondine resta in silenzio: nessun coro, nessun tamburo, nessuna cassa.",
      hint: "Si parte con il morale a terra: serve un'idea per riaccenderla.",
      goal: "Chiudi la partita con il morale almeno a 80", check: (S) => S.morale >= 80,
      rules: { morale: 36 }, evForce: [{ min: 31, id: "curva" }],
      story: { pre: ["Dina", "«La Curva è in sciopero, Mister. Il biglietto costa tre euro, e hanno detto 'è un affronto'. Il silenzio, intanto, pesa.»"], win: ["Ferri", "«Ho fatto cantare io. Il coro non si compra, Mister: si prende, un po' alla volta. A noi vecchi basta un attimo.»"], lose: ["Arturo", "«In silenzio non si vince. Lo dico io, che di silenzio vivo una volta a settimana.»"] },
      beats: [{ min: 1, who: "Arturo", t: "«Si sente solo il mare e il fischietto. È il silenzio più rumoroso del Borgo.»" }],
      names: mkNames(15, ["Cima", "Gomena", "Nodo", "Bitta", "Cavo", "Ormeggio"]),
      twist: (S) => { if (S.min === 60 && S.scoreB >= S.scoreA) { S.oppBuff.def = 1.08; T(S, "🪢 Gli Ormeggiatori stringono i nodi: dietro non passa nemmeno uno spiffero."); } }
    },
    {
      id: "lupi_mare", name: "Lupi di Mare della Costa", short: "Lupi di Mare", ico: "🐺", col: "#a8a29e", col2: "#292524", lvl: 1.13, form: "3-5-2", style: "Capitani di lungo corso",
      season: 3, ep: 21, coin: 6, mod: { atk: 1.04, mid: 1.1, def: 1.02, pressWeak: 0.94, foul: 0.03, ctr: 1.05, wall: 0.95, tire: 1 },
      blurb: "Undici capitani in pensione: ognuno comanda, nessuno ascolta. Ma il centrocampo, in mano a loro, è un mare con le sue maree.",
      hint: "Il centrocampo decide: pressing alto e almeno cinque a metà campo.",
      goal: "Vinci con almeno il 50% di possesso palla", check: (S) => S.posTotal > 0 && S.posA / S.posTotal >= 0.5,
      rules: {}, evForce: [],
      story: { pre: ["Sara", "«I Lupi di Mare vincono a centrocampo. Se non lo vinciamo noi, vinciamo dopo. Dopo, però, ho paura.»"], win: ["Dina", "«Semifinale! Il Presidente ha pianto sul bilancio. Con una lacrima per voce.»"], lose: ["Spigola", "«Non perdiamo una partita: perdiamo una traversata. Avremo un'altra occasione.»"] },
      beats: [],
      names: mkNames(16, ["Capitano", "Timone", "Bussola", "Lungo Corso", "Salmastro", "Albatro"]),
      twist: (S) => { if (S.min === 45) { S.oppBuff.mid = 1.06; } if (S.min === 70 && S.scoreA > S.scoreB) { S.oppBuff.atk = 1.16; S.oppBuff.def = 0.9; T(S, "🐺 I Lupi di Mare cambiano rotta: tutti avanti, bussola alla mano."); } }
    },
    {
      id: "sirene", name: "Sirene di Cala Salata", short: "Sirene", ico: "🧜", col: "#5eead4", col2: "#115e59", lvl: 1.07, form: "4-3-3", style: "Palleggio e velocità",
      season: 3, ep: 22, coin: 6, mod: { atk: 1.06, mid: 1.08, def: 1.0, pressWeak: 0.9, foul: 0.02, ctr: 1.05, wall: 1, tire: 1.05 },
      blurb: "Semifinale. Le Sirene toccano il pallone sei volte e segnano alla settima: prima ancora che tu abbia finito di salutare, sono già in vantaggio. Si parte da 0-1.",
      hint: "Sotto fin dal primo minuto: serve calma, e il pressing alto contro i loro palleggi.",
      goal: "Pareggia entro il 30'", check: (S) => S.stats.eqMin > 0 && S.stats.eqMin <= 30,
      rules: { startScore: [0, 1] }, evForce: [],
      story: { pre: ["Rob", "«Mister, abbiamo preso gol al primo minuto. Anzi, prima: l'arbitro ha detto 'inizio' e noi eravamo già sotto.»"], win: ["Spigola", "«In FINALE! Da sotto, con la sciarpa al collo e la cravatta di lato. Mister, la cravatta è un po' mia: la scambio per un pallone.»"], lose: ["Ferri", "«Si cade, Mister. Poi si ricomincia. A me l'hanno insegnato nel '68, sulla sabbia.»"] },
      beats: [{ min: 1, who: "Arturo", t: "«GOL! Cioè no: scusate, era partita già tutta. Le Sirene sono avanti, ma il gol vero ancora non l'ho ancora visto.»" }],
      names: mkNames(17, ["Sirena", "Onda", "Cala", "Sale", "Schiuma", "Perla"]),
      twist: (S) => { if (S.min === 38) { S.oppBuff.mid = 1.07; T(S, "🧜 Le Sirene incantano il centrocampo: il palleggio non si ferma più."); } if (S.min === 68 && S.scoreB > S.scoreA) { S.oppBuff.def = 1.1; T(S, "🧜 Vantaggio sicuro: le Sirene si abbassano e cantano il ritornello."); } }
    },
    {
      id: "mareggiata2", name: "Real Mareggiata · La Rivincita", short: "Mareggiata", ico: "👑", col: "#7dd3fc", col2: "#1e3a8a", lvl: 1.15, form: "4-3-3", style: "La finale del Faro",
      season: 3, ep: 23, coin: 20, needStars: 9, mod: { atk: 1.07, mid: 1.07, def: 1.06, pressWeak: 0.95, foul: 0.03, ctr: 1.15, wall: 0.93, tire: 0.85 },
      blurb: "Mister Brina è tornato, con un attacco nuovo e un sorriso tirato. Finale della Coppa del Faro: tutto il Borgo in piazza, davanti allo schermo che Settimio ha montato da solo.",
      hint: "Leggono i tuoi ordini e li smontano: cambia al momento giusto, e chiudi bene il secondo tempo.",
      goal: "Vinci senza subire gol nel secondo tempo", check: (S) => S.stats.concH2 === 0,
      rules: { morale: 62 }, evForce: [{ min: 66, id: "brina" }],
      story: { pre: ["Brina", "«Mister, la volta scorsa ho avuto una giornata storta. Quest'anno non farò la stessa gentilezza. Lo dico con affetto, e con la cravatta nuova.»"], win: ["Brina", "«...Si chiama davvero Rondine, questa squadra? Complimenti. Ho guardato il tabellone e c'è scritto il vostro nome, grande. Strano: mi piace.»"], lose: ["Ferri", "«Non importa, ragazzi. La sciarpa del '68 aveva perso finali peggiori. E ha scaldato lo stesso.»"] },
      beats: [{ min: 1, who: "Arturo", t: "«Qui Radio Molo, la finale. In piazza il Borgo è tutto presente. Anche Baciccia, anche Don Aurelio, anche un gabbiano che non c'entra niente.»" }],
      names: mkNames(18, ["Marea", "Corrente", "Risacca", "Maestrale", "Bonaccia Jr", "Tramonto"]),
      twist: (S) => { if (S.min === 30 || S.min === 62) { if (S.ment === "offensiva" || S.ment === "allin") { S.oppBuff.ctr = 1.25; T(S, "🌊 Il Mareggiata legge il tuo assalto: contropiede preparato."); } else { S.oppBuff.mid = 1.07; T(S, "🌊 Il Mareggiata studia il tuo ordine e prende il centrocampo."); } } if (S.min === 80 && S.scoreB >= S.scoreA) { S.oppBuff.atk = 1.15; T(S, "🌊 Ultimi dieci: il Mareggiata butta tutto in avanti."); } }
    }
  ];
  NEW_OPPS.forEach((o) => { o.names = o.names || mkNames(1, ["Rete"]); OPPS.push(o); });

  // obiettivi (terza stella) valutati a fine partita
  const GOAL_CHECK = {
    gabbiani: (S) => S.stats.recups >= 2,
    corsari: (S) => S.stats.reds === 0 && S.stats.cards <= 1,
    dragoni: (S) => S.stats.lateGoals >= 2,
    fanfara: (S) => S.scoreB <= 1,
    mareggiata: (S) => S.subsUsed <= 2
  };

  const RANKS = [
    { pts: 0, t: "Allenatore da Oratorio" },
    { pts: 6, t: "Mister del Molo" },
    { pts: 14, t: "Stratega di Borgo" },
    { pts: 26, t: "Volpe della Panchina" },
    { pts: 40, t: "Leggenda del Faro" },
    { pts: 62, t: "Maestro della Riviera" },
    { pts: 88, t: "Professore del Golfo" },
    { pts: 116, t: "Mister del Borgo Intero" }
  ];

  // Rosa allineata ai personaggi del Borgo (stessi nomi/tratti di Coppa del Molo, Gabbia e Diario)
  const SQUAD = [
    { name: "Sandro", num: 1, grp: "POR", r: 74 }, // il portiere di sempre
    { name: "Il Bue", num: 2, grp: "DIF", r: 70 }, // lento, saldo, inamovibile
    { name: "Mino", num: 3, grp: "DIF", r: 69 },
    { name: "Chicco", num: 4, grp: "DIF", r: 73 }, // sempre affamato, sempre al suo posto
    { name: "Baciccia Jr", num: 5, grp: "DIF", r: 71 }, // il nipote del Baciccia
    { name: "Lele", num: 6, grp: "CEN", r: 72 }, // nipote di Don Aurelio, chierichetto cresciuto
    { name: "Nico", num: 7, grp: "ATT", r: 71 }, // veloce di piedi e di bocca
    { name: "Tommy", num: 8, grp: "CEN", r: 73 }, // passa la palla come un regalo
    { name: "Dario", num: 9, grp: "ATT", r: 77 }, // il fratello di Leo, sinistro d'autore
    { name: "Leo (C)", num: 10, grp: "CEN", r: 76 }, // il capitano per ostinazione
    { name: "Ricky", num: 11, grp: "ATT", r: 70 },
    { name: "Morena", num: 13, grp: "DIF", r: 68, bench: true }, // passo da pescatore all'alba
    { name: "Ugo", num: 14, grp: "CEN", r: 69, bench: true },
    { name: "Fabio", num: 15, grp: "ATT", r: 72, bench: true },
    { name: "Gigi", num: 16, grp: "ATT", r: 70, bench: true }, // 14 anni, riserva chiacchierona
    { name: "Pia", num: 17, grp: "CEN", r: 69, bench: true }
  ];
  // nuovi arrivi in rosa: si sbloccano con la prima vittoria sull'episodio indicato
  const ARRIVALS = [
    { id: "mattia", name: "Mattia la Saracinesca", num: 18, grp: "DIF", r: 72, ep: "corsari", bio: "Si abbassa come una serranda e nessuno passa." },
    { id: "kevin", name: "Kevin del Pedalò", num: 19, grp: "ATT", r: 73, ep: "dragoni", bio: "Gambe da pedalò estivo: arriva sempre, anche dove non c'è niente." },
    { id: "brando", name: "Brando", num: 20, grp: "ATT", r: 75, ep: "lanterne", bio: "Fornaio: alle tre impasta, alle sei tira. Le mani sono ancora in forno." },
    { id: "osvaldo", name: "Osvaldo", num: 21, grp: "DIF", r: 74, ep: "cantiere", bio: "Scarica le casse al molo. Se c'è da fare muro, lo fa lui." },
    { id: "mimi", name: "Mimì", num: 22, grp: "CEN", r: 75, ep: "settimio", bio: "La postina del molo: conosce ogni indirizzo, quindi ogni compagno." },
    { id: "ondina", name: "Ondina", num: 12, grp: "POR", r: 77, ep: "bellavista", bio: "Portiera di Punta Nera. Arriva prima della palla, poi dice di avere ragione.", gk: true },
    { id: "zoe", name: "Zoe", num: 23, grp: "ATT", r: 76, ep: "squali", bio: "Consegna i gelati in bici, in salita, controvento." },
    { id: "nina", name: "Nina", num: 24, grp: "CEN", r: 76, ep: "vignaioli", bio: "Ripara biciclette: conosce l'angolo di ogni raggio, quindi di ogni passaggio." },
    { id: "ester", name: "Ester", num: 25, grp: "DIF", r: 77, ep: "faro_est", bio: "La guardiana del faro: centotredici gradini due volte al giorno, polmoni d'acciaio." }
  ];
  const KITS = [
    { id: "blu", name: "Blu Rondine", k: "#1d4ed8", k2: "#bae6fd", need: () => true, hint: "" },
    { id: "giallo", name: "Giallo Faro", k: "#f59e0b", k2: "#1e3a8a", need: (p) => seasonDone(p, 0), hint: "Completa la Stagione 1" },
    { id: "bianco", name: "Bianco Gabbiano", k: "#e2e8f0", k2: "#1d4ed8", need: (p) => totalStars(p) >= 12, hint: "Raccogli 12 stelle" },
    { id: "lampare", name: "Notte di Lampare", k: "#0f172a", k2: "#fde047", need: (p) => ((p.opp.lanterne || {}).stars || 0) >= 3, hint: "Un obiettivo speciale della Stagione 2" },
    { id: "corallo", name: "Corallo di Scogliera", k: "#e11d48", k2: "#fde68a", need: (p) => seasonDone(p, 1), hint: "Completa la Stagione 2" },
    { id: "ponente", name: "Verde Ponente", k: "#15803d", k2: "#bbf7d0", need: (p) => seasonDone(p, 2), hint: "Completa la Stagione 3" },
    { id: "oro", name: "Oro del Faro", k: "#facc15", k2: "#0f172a", need: (p) => seasonDone(p, 3), hint: "Completa la Stagione 4" }
  ];

  // ---------------------------------------------------------------- progressi
  // Salvataggio retrocompatibile: i campi nuovi (kit, gk, intro) sono additivi; chi aveva finito le 5 partite vede i nuovi capitoli sbloccati.
  function defaultProg() {
    return { v: 1, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0, opp: {}, coins: {}, lastForm: "4-3-3", lastMent: "equil", lastPress: "medio", kit: "blu", gk: "sandro", intro: {} };
  }
  function loadProg() {
    const d = defaultProg();
    try {
      const r = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (r && typeof r === "object") {
        ["played", "wins", "draws", "losses", "gf", "ga", "pts"].forEach((k) => { d[k] = Math.max(0, Number(r[k]) || 0); });
        if (r.opp && typeof r.opp === "object") {
          OPPS.forEach((o) => {
            const e = r.opp[o.id];
            if (e && typeof e === "object") d.opp[o.id] = { stars: clamp(Number(e.stars) || 0, 0, 3), wins: Math.max(0, Number(e.wins) || 0), played: Math.max(0, Number(e.played) || 0), best: typeof e.best === "string" ? e.best.slice(0, 8) : "" };
          });
        }
        if (r.coins && typeof r.coins === "object") OPPS.forEach((o) => { if (r.coins[o.id]) d.coins[o.id] = true; });
        if (FORMS[r.lastForm]) d.lastForm = r.lastForm;
        if (MENT[r.lastMent]) d.lastMent = r.lastMent;
        if (PRESS[r.lastPress]) d.lastPress = r.lastPress;
        if (typeof r.kit === "string" && KITS.some((k) => k.id === r.kit)) d.kit = r.kit;
        if (r.gk === "ondina") d.gk = "ondina";
        if (r.intro && typeof r.intro === "object") SEASONS.forEach((se) => { if (r.intro[se.id]) d.intro[se.id] = true; });
      }
    } catch (e) { /* default sicuro */ }
    if (d.played > 0 && !d.intro[0]) d.intro[0] = true; // chi ha già giocato non rivede il prologo
    if (!KITS.find((k) => k.id === d.kit).need(d)) d.kit = "blu";
    if (d.gk === "ondina" && !arrivalHas(d, "ondina")) d.gk = "sandro";
    return d;
  }
  function saveProg(p) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(p)); } catch (e) { /* ignora */ } }
  function rankOf(pts) { let r = 0; RANKS.forEach((x, i) => { if (pts >= x.pts) r = i; }); return r; }
  function totalStars(p) { return OPPS.reduce((n, o) => n + ((p.opp[o.id] || {}).stars || 0), 0); }
  function oppWon(p, id) { return ((p.opp[id] || {}).wins || 0) > 0; }
  function seasonDone(p, si) { return oppWon(p, SEASONS[si].fin); }
  function seasonsDone(p) { return SEASONS.filter((_, i) => seasonDone(p, i)).length; }
  function seasonOpps(si) { return OPPS.filter((o) => o.season === si); }
  // stelle raccolte nella stagione senza contare la finale
  function seasonStars(p, si) { return seasonOpps(si).filter((o) => o.id !== SEASONS[si].fin).reduce((n, o) => n + ((p.opp[o.id] || {}).stars || 0), 0); }
  function arrivalHas(p, id) { const a = ARRIVALS.find((x) => x.id === id); return !!a && oppWon(p, a.ep); }
  // sblocco: serve una vittoria nell'episodio precedente (e, per le finali di stagione, abbastanza stelle)
  function oppState(p, i) {
    if (i === 0) return { open: true };
    const prev = OPPS[i - 1], o = OPPS[i];
    if (((p.opp[prev.id] || {}).stars || 0) < 1) return { open: false, why: "Vinci l'episodio precedente" };
    if (o.needStars && seasonStars(p, o.season) < o.needStars) return { open: false, why: `Servono ${o.needStars} stelle in questa stagione (ne hai ${seasonStars(p, o.season)})`, near: true };
    return { open: true };
  }
  function oppUnlocked(p, i) { return oppState(p, i).open; }
  function formUnlocked(p, f) { const u = FORMS[f].unlock; return !u || p.wins >= u.wins; }

  // ---------------------------------------------------------------- stato modulo
  let root = null, style = null, canvas = null, ctx = null, rafId = 0, onExitCb = null, openOpts = null;
  let prog = defaultProg();
  let S = null; // partita
  let tab = "ordini";
  let lastT = 0, cw = 0;
  let sheetEl = null;
  const listeners = [];

  function listen(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); listeners.push([t, ev, fn, opt]); }

  // ---------------------------------------------------------------- CSS
  const CSS = `
  .mdx-root{position:fixed;inset:0;z-index:999999;background:#060d1a;color:#e5edf8;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden;font-size:14px;-webkit-tap-highlight-color:transparent}
  .mdx-root *{box-sizing:border-box}.mdx-root h1,.mdx-root h2{text-shadow:none;margin-top:0}
  .mdx-scr{flex:1;min-height:0;display:flex;flex-direction:column;position:relative}
  .mdx-btn{min-height:44px;border:1px solid #2a3b57;background:#14233b;color:#e5edf8;border-radius:10px;font:700 13px system-ui,sans-serif;padding:6px 8px;cursor:pointer;touch-action:manipulation;line-height:1.15}
  .mdx-btn:active{transform:scale(.97)}
  .mdx-btn.on{background:#1d4ed8;border-color:#7dd3fc;color:#fff;box-shadow:0 0 0 1px #7dd3fc inset}
  .mdx-btn.gold{background:linear-gradient(135deg,#f59e0b,#d97706);border-color:#fcd34d;color:#1b1203}
  .mdx-btn.red{background:#7f1d1d;border-color:#ef4444}
  .mdx-btn[disabled]{opacity:.4;cursor:default}
  .mdx-menu{overflow-y:auto;padding:12px 14px 24px}
  .mdx-h1{margin:0;font-size:21px;font-weight:800;color:#fff;letter-spacing:-.3px}
  .mdx-sub{margin:3px 0 0;color:#93a4bd;font-size:12.5px;line-height:1.4}
  .mdx-card{background:#0d1a2e;border:1px solid #223653;border-radius:12px;padding:11px 12px;margin-top:10px}
  .mdx-rank{display:flex;gap:10px;align-items:center}
  .mdx-bar{height:7px;border-radius:5px;background:#1c2b44;overflow:hidden}
  .mdx-bar>i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8)}
  .mdx-opp{display:flex;gap:10px;align-items:center;text-align:left;width:100%;min-height:76px;height:auto;flex:none;padding:10px 12px;border-radius:12px;border:1px solid #223653;background:#0d1a2e;color:#e5edf8;margin-top:8px;cursor:pointer;font-family:inherit}
  .mdx-opp.lock{opacity:.45;cursor:default}
  .mdx-opp .ic{font-size:30px;width:44px;text-align:center;flex:none}
  .mdx-opp b{display:block;font-size:15px}
  .mdx-opp small{display:block;color:#93a4bd;font-size:11.5px;line-height:1.35;margin-top:2px}
  .mdx-stars{color:#fbbf24;letter-spacing:1px;font-size:13px}
  .mdx-stars span{color:#334155}
  .mdx-top{display:flex;gap:6px;align-items:center;padding:6px 8px;background:#0a1424;border-bottom:1px solid #1b2a43;flex:none}
  .mdx-top .mdx-btn{min-width:44px;padding:4px 6px}
  .mdx-sb{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;padding:6px 10px 4px;background:#0a1424;flex:none}
  .mdx-sb .tn{font-weight:800;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mdx-sb .tn.r{text-align:right}
  .mdx-sb .sc{font:800 24px ui-monospace,Menlo,monospace;color:#fff;text-align:center;min-width:92px}
  .mdx-sb .sc small{display:block;font:700 11px system-ui;color:#facc15;margin-top:-2px}
  .mdx-prog{height:3px;background:#1c2b44;flex:none}.mdx-prog>i{display:block;height:100%;background:#facc15;width:0}
  .mdx-cv{display:block;margin:0 auto;height:min(94vw,37vh);width:auto;aspect-ratio:${W}/${H};max-width:100%;flex:none;background:#14301f}
  .mdx-strip{display:grid;grid-template-columns:1.3fr 1fr 1.1fr 1fr;gap:4px;padding:4px 8px;background:#0a1424;font-size:11px;color:#b6c4da;flex:none;align-items:center;text-align:center}
  .mdx-strip .pb{height:6px;border-radius:4px;background:#b91c1c;overflow:hidden;margin-top:2px}.mdx-strip .pb>i{display:block;height:100%;background:#2563eb}
  .mdx-tick{padding:5px 10px;background:#08111f;color:#cbd8ec;font-size:12px;line-height:1.35;min-height:38px;flex:none;border-top:1px solid #15233a}
  .mdx-tick div:first-child{color:#fff}.mdx-tick div+div{color:#7d8da6}
  .mdx-tabs{display:grid;grid-template-columns:repeat(3,1fr);flex:none;background:#0a1424;border-top:1px solid #1b2a43}
  .mdx-tabs button{min-height:42px;background:none;border:0;border-bottom:3px solid transparent;color:#93a4bd;font:700 13px system-ui;cursor:pointer}
  .mdx-tabs button.on{color:#fff;border-bottom-color:#38bdf8}
  .mdx-pan{flex:1;min-height:0;overflow-y:auto;padding:6px 10px 12px;background:#08111f}
  .mdx-lbl{font-size:11px;color:#93a4bd;font-weight:700;margin:8px 0 3px;display:flex;justify-content:space-between;gap:6px}
  .mdx-lbl em{font-style:normal;color:#64748b;font-weight:500;text-align:right}
  .mdx-g4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
  .mdx-g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}
  .mdx-g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px}
  .mdx-fx{font-size:11.5px;color:#a8b8d0;margin-top:3px;line-height:1.35}
  .mdx-row{display:flex;flex-direction:column;align-items:stretch;gap:4px;min-height:48px;padding:5px 8px;border-radius:9px;border:1px solid #223653;background:#0d1a2e;color:#e5edf8;font:600 12.5px system-ui;text-align:left;cursor:pointer;width:100%}
  .mdx-row.sel{border-color:#facc15;background:#2a2308}
  .mdx-row .top,.mdx-row .bot{display:flex;align-items:center;gap:5px;min-width:0}.mdx-row .n{width:22px;color:#7d8da6;font-size:11px;flex:none}
  .mdx-row .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .mdx-row .sb{flex:1;height:6px;border-radius:4px;background:#1c2b44;overflow:hidden;flex:none}.mdx-row .sb>i{display:block;height:100%}
  .mdx-row .pc{width:30px;text-align:right;font-size:11px;color:#93a4bd;flex:none}
  .mdx-row .ov{font-size:11px;font-weight:800;padding:1px 5px;border-radius:5px;background:#12341f;color:#86efac;flex:none}
  .mdx-row .gp{font-size:10px;padding:1px 4px;border-radius:5px;background:#1c2b44;color:#93a4bd;flex:none}
  .mdx-log div{padding:5px 2px;border-bottom:1px solid #13213a;font-size:12.5px;line-height:1.4}
  .mdx-log .goal{color:#fde68a;font-weight:700}.mdx-log .opp{color:#fda4af}.mdx-log .tip{color:#7dd3fc}.mdx-log .ev{color:#c4b5fd}
  .mdx-log b{color:#7d8da6;font-weight:600;margin-right:4px}
  .mdx-sheet{position:absolute;inset:0;z-index:5;background:rgba(3,8,16,.78);display:flex;align-items:flex-end;justify-content:center}
  .mdx-sheet.full{align-items:stretch}
  .mdx-sh{width:100%;max-width:560px;max-height:100%;overflow-y:auto;background:#0e1b31;border-top:2px solid #38bdf8;border-radius:16px 16px 0 0;padding:14px 14px 18px;animation:mdxup .22s ease-out}
  .mdx-sheet.full .mdx-sh{border-radius:0;border-top:0;max-width:640px;margin:0 auto}
  @keyframes mdxup{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
  .mdx-sh h2{margin:0 0 4px;font-size:18px;color:#fff}
  .mdx-sh p{margin:4px 0 8px;font-size:13.5px;line-height:1.5;color:#cfdbee}
  .mdx-ch{display:block;width:100%;text-align:left;margin-top:7px;min-height:50px}
  .mdx-ch small{display:block;font-weight:500;color:#9db0cc;margin-top:2px;font-size:11.5px}
  .mdx-res{background:#13243f;border-radius:10px;padding:9px 11px;margin:8px 0;font-size:13.5px;line-height:1.5;color:#e8f0fc}
  .mdx-pg{display:grid;grid-template-columns:28px 1fr auto;gap:6px;align-items:center;padding:4px 0;border-bottom:1px solid #162540;font-size:12.5px}
  .mdx-pg i{font-style:normal;font-weight:800;color:#fff;background:#1d4ed8;border-radius:6px;padding:1px 6px;font-size:12px}
  .mdx-pg i.hi{background:#16a34a}.mdx-pg i.lo{background:#b91c1c}.mdx-pg i.mvp{background:#d97706}
  .mdx-pg small{color:#8ea0bc}
  .mdx-big{font:800 38px ui-monospace,Menlo,monospace;text-align:center;color:#fff;margin:2px 0}
  .mdx-chip{display:inline-block;padding:2px 8px;border-radius:12px;background:#1c2b44;color:#bcd0ec;font-size:11px;font-weight:700;margin:2px 3px 2px 0}
  .mdx-chip.g{background:#14532d;color:#bbf7d0}.mdx-chip.y{background:#713f12;color:#fde68a}
  .mdx-sea{display:flex;align-items:center;gap:8px;margin:16px 0 2px;font-weight:800;font-size:13px;color:#cfdbee}
  .mdx-sea small{margin-left:auto;font-weight:600;color:#7d8da6;font-size:11px;white-space:nowrap}
  .mdx-sea.lock{color:#64748b}
  .mdx-opp .ep{display:block;font-size:10.5px;color:#7d8da6;font-weight:700;letter-spacing:.4px}
  .mdx-new{display:inline-block;background:#f59e0b;color:#1b1203;border-radius:6px;padding:0 5px;font-size:10px;font-weight:800;margin-left:4px;vertical-align:1px}
  .mdx-story{background:#10203a;border-left:3px solid #38bdf8;border-radius:8px;padding:8px 10px;margin:8px 0;font-size:13px;line-height:1.5;color:#dbe6f6}
  .mdx-story b{display:block;font-size:11.5px;color:#7dd3fc;letter-spacing:.3px;margin-bottom:2px}
  .mdx-story.win{border-left-color:#4ade80}.mdx-story.win b{color:#86efac}
  .mdx-story.lose{border-left-color:#fb7185}.mdx-story.lose b{color:#fda4af}
  .mdx-kits{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
  .mdx-kit{display:flex;align-items:center;gap:8px;min-height:48px;padding:6px 8px;border-radius:10px;border:1px solid #223653;background:#0d1a2e;color:#e5edf8;font:600 12px system-ui;text-align:left;cursor:pointer}
  .mdx-kit.sel{border-color:#facc15;background:#2a2308}.mdx-kit[disabled]{opacity:.5;cursor:default}
  .mdx-kit i{width:26px;height:26px;border-radius:50%;flex:none;border:3px solid;display:block}
  .mdx-kit small{display:block;color:#8ea0bc;font-weight:500;font-size:10.5px;line-height:1.25}
  .mdx-pl{display:grid;grid-template-columns:30px 1fr auto;gap:6px;align-items:center;padding:5px 0;border-bottom:1px solid #162540;font-size:12.5px}
  .mdx-pl em{font-style:normal;color:#7d8da6;font-size:11px}.mdx-pl small{color:#8ea0bc;display:block;font-size:11px}
  .mdx-pl.lock{opacity:.5}.mdx-pl .n{background:#1d4ed8;color:#fff;border-radius:6px;padding:1px 6px;font-weight:800;font-size:12px;text-align:center}.mdx-pl .n.hi{background:#16a34a}
  `;

  // ---------------------------------------------------------------- creazione partita
  function makeSquad() {
    const grow = seasonsDone(prog) * 2; // la rosa cresce a fine stagione
    const list = SQUAD.map((s) => Object.assign({}, s, { r: s.r + grow }));
    if (prog.gk === "ondina") { const a = ARRIVALS.find((x) => x.id === "ondina"); list[0] = { name: a.name, num: a.num, grp: "POR", r: a.r + Math.floor(grow / 2) }; }
    ARRIVALS.forEach((a) => { if (!a.gk && arrivalHas(prog, a.id)) list.push({ name: a.name, num: a.num, grp: a.grp, r: a.r + Math.floor(grow / 2), bench: true }); });
    return list.map((s, i) => ({ id: i, name: s.name, num: s.num, grp: s.grp, r: s.r, st: 100, slotGrp: s.grp, x: W / 2, y: H - 20, tx: 0, ty: 0, goals: 0, assists: 0, saves: 0, bonus: 0, mins: 0, eco: false, bench: !!s.bench, off: false, side: 0 }));
  }

  function slotCounts(form) { return FORMS[form].n; }

  // assegna i giocatori in campo (esclusi portiere) agli slot della formazione
  function reassign(form) {
    const field = S.xi.filter((p) => p.grp !== "POR" || p.slotGrp !== "POR");
    const gk = S.xi.filter((p) => p.slotGrp === "POR");
    const n = Object.assign({}, slotCounts(form));
    let total = n.DIF + n.CEN + n.ATT;
    while (total > field.length) {
      if (n.ATT > 1) n.ATT--; else if (n.CEN > 1) n.CEN--; else n.DIF--;
      total--;
    }
    const left = field.slice();
    const out = [];
    ["DIF", "ATT", "CEN"].forEach((g) => {
      const mine = left.filter((p) => p.grp === g).sort((a, b) => b.r - a.r).slice(0, n[g]);
      mine.forEach((p) => { p.slotGrp = g; out.push(p); left.splice(left.indexOf(p), 1); n[g]--; });
    });
    ["CEN", "DIF", "ATT"].forEach((g) => {
      while (n[g] > 0 && left.length) {
        left.sort((a, b) => pen(b.grp, g) * b.r - pen(a.grp, g) * a.r);
        const p = left.shift(); p.slotGrp = g; out.push(p); n[g]--;
      }
    });
    S.xi = gk.concat(out).sort((a, b) => a.id - b.id);
  }

  function pen(nat, slot) {
    if (nat === slot) return 1;
    if (nat === "POR" || slot === "POR") return 0.6;
    if (nat === "CEN" || slot === "CEN") return 0.95;
    return 0.84;
  }

  function makeOppXI(o) {
    const n = FORMS[o.form].n;
    const list = [];
    let k = 0;
    list.push({ name: o.names[k], num: 1, grp: "POR", slotGrp: "POR" }); k++;
    ["DIF", "CEN", "ATT"].forEach((g) => { for (let i = 0; i < n[g]; i++) { list.push({ name: o.names[k % o.names.length], num: 2 + k - 1 + (k > 8 ? 1 : 0), grp: g, slotGrp: g }); k++; } });
    list.forEach((p) => { p.x = W / 2; p.y = 40; p.st = 100; });
    return list;
  }

  function newMatch(opp, form, ment, press) {
    S = {
      opp, min: 0, scoreA: 0, scoreB: 0, shotsA: 0, shotsB: 0, sotA: 0, sotB: 0, xgA: 0, xgB: 0, posA: 0, posTotal: 0, poss: "A",
      form, ment, press, morale: 55, oppStam: 100, rules: opp.rules || {}, maxSubs: 3, qf: 1, drain: 1, oppRed: false, confuse: 0, buff: { atk: 1, mid: 1, def: 1, until: 0 },
      oppBuff: { atk: 1, mid: 1, def: 1, ctr: 1, foul: 0 },
      log: [], run: false, speed: 1, acc: 0, frac: 0, needStep: true, started: false, over: false, ended: false,
      pend: [], path: null, rest: { x: W / 2, y: H / 2 }, ball: { x: W / 2, y: H / 2 }, carrier: null,
      banner: null, parts: [], shake: 0, passTrail: [], dive: null,
      subsUsed: 0, timeouts: 2, htDone: false, oppSubDone: false, selOut: null, evIdx: 0, lastTip: 0,
      stats: { recups: 0, lateGoals: 0, cards: 0, reds: 0, earlyGoals: 0, h1: 0, concH2: 0, altoMin: 0, allin: false, formChanges: 0, scorers: {}, trailed: false, first: "", eqMin: 0 }, gkSaves: 0, lineFx: 0, radioMin: 0, promise: false, evPool: []
    };
    const R = S.rules;
    if (R.maxSubs) S.maxSubs = R.maxSubs;
    if (R.qf) S.qf = R.qf;
    if (R.drain) S.drain = R.drain;
    if (typeof R.morale === "number") S.morale = R.morale;
    if (R.startScore) { S.scoreA = R.startScore[0]; S.scoreB = R.startScore[1]; if (S.scoreB > S.scoreA) S.stats.trailed = true; S.shotsB = S.scoreB; S.sotB = S.scoreB; }
    const squad = makeSquad();
    S.squad = squad;
    S.bench = squad.filter((p) => p.bench);
    S.xi = squad.filter((p) => !p.bench);
    reassign(form);
    if (R.stam) S.xi.forEach((p) => { if (p.slotGrp !== "POR") p.st = R.stam; });
    S.oppXI = makeOppXI(opp);
    S.events = scheduleEvents();
    // posizioni iniziali immediate
    layout(); S.xi.concat(S.oppXI).forEach((p) => { p.x = p.tx; p.y = p.ty; });
    S.log.unshift({ m: 0, t: `Il Rondine FC riceve i ${opp.name}. ${opp.blurb}`, c: "" });
    if (R.startScore) S.log.unshift({ m: 0, t: `Si parte da ${R.startScore[0]}-${R.startScore[1]}: ${opp.short} è già avanti.`, c: "opp" });
  }

  // ---------------------------------------------------------------- potenza squadre
  function moraleF() { return 0.94 + S.morale * 0.0012; }
  function effA(p) { return (p.r / 72) * (0.55 + 0.45 * p.st / 100) * pen(p.grp, p.slotGrp) * moraleF(); }
  function avg(a, d) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : d; }
  function powerA() {
    const g = { DIF: [], CEN: [], ATT: [], POR: [] };
    S.xi.forEach((p) => g[p.slotGrp].push(effA(p)));
    const d = avg(g.DIF, 0.6), c = avg(g.CEN, 0.6), a = avg(g.ATT, 0.6), k = avg(g.POR, 0.8);
    const f = FORMS[S.form].prof, M = MENT[S.ment], P = PRESS[S.press];
    const conf = S.confuse > 0 ? 0.92 : 1;
    const b = S.buff.until > S.min ? S.buff : { atk: 1, mid: 1, def: 1 };
    return {
      atk: (0.65 * a + 0.35 * c) * f.atk * M.atk * conf * b.atk,
      mid: (0.7 * c + 0.15 * a + 0.15 * d) * f.mid * P.mid * conf * b.mid,
      def: (0.6 * d + 0.2 * c + 0.2 * k) * f.def * M.def * b.def,
      gk: k
    };
  }
  function powerB() {
    const o = S.opp, m = o.mod, f = FORMS[o.form].prof, b = S.oppBuff;
    const st = (0.55 + 0.45 * S.oppStam / 100) * (S.oppRed ? 0.93 : 1);
    return {
      atk: o.lvl * m.atk * f.atk * st * b.atk,
      mid: o.lvl * m.mid * f.mid * st * b.mid * (S.press === "alto" ? m.pressWeak : 1),
      def: o.lvl * m.def * f.def * st * b.def,
      gk: o.lvl
    };
  }

  // ---------------------------------------------------------------- log / ticker
  function addLog(t, c) {
    if (!S) return;
    S.log.unshift({ m: S.min, t, c: c || "" });
    if (S.log.length > 90) S.log.pop();
    updateTicker();
    if (tab === "log") renderPanel();
  }

  // ---------------------------------------------------------------- tiri
  function weightedPlayer(list, wf) {
    let tot = 0; const w = list.map((p) => { const v = Math.max(0.01, wf(p)); tot += v; return v; });
    let r = rnd() * tot;
    for (let i = 0; i < list.length; i++) { r -= w[i]; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }
  function pickShooterA() {
    const f = S.xi.filter((p) => p.slotGrp !== "POR");
    return weightedPlayer(f, (p) => ({ ATT: 5, CEN: 2.2, DIF: 0.5 }[p.slotGrp]) * (p.r / 72));
  }
  function pickAssistA(ex) {
    const f = S.xi.filter((p) => p.slotGrp !== "POR" && p !== ex);
    return weightedPlayer(f, (p) => ({ ATT: 2, CEN: 3, DIF: 1 }[p.slotGrp]));
  }
  function ourGK() { return S.xi.find((p) => p.slotGrp === "POR"); }

  function rollShot(team, q, bonus) {
    q = q * (S.qf || 1);
    const A = powerA(), B = powerB();
    const gkf = team === "A" ? clamp(B.gk, 0.85, 1.2) : clamp(A.gk, 0.85, 1.2);
    const pGoal = clamp(q * (1 + (bonus || 0)) / gkf, 0.02, 0.9);
    const r = rnd();
    let kind;
    if (r < pGoal) kind = "goal";
    else {
      const x = rnd();
      kind = x < 0.5 ? "save" : x < 0.75 ? "miss" : x < 0.85 ? "post" : "block";
    }
    let shooter, assist = null;
    if (team === "A") { shooter = pickShooterA(); if (kind === "goal" && rnd() < 0.7) assist = pickAssistA(shooter); }
    else { shooter = pick(S.oppXI.filter((p) => p.slotGrp !== "POR")); }
    return { team, kind, q, shooter, assist };
  }

  const TXT = {
    goalA: [(s, a) => `⚽ GOOOL! ${s} la mette dentro${a ? ` su assist di ${a}` : ""}. Il molo esplode!`, (s, a) => `⚽ ${s} non perdona${a ? `: assist di ${a}` : ""}. 1 a zero per la poesia.`, (s) => `⚽ Rete di ${s}! Il vice abbraccia il fisioterapista, che non c'entrava niente.`, (s, a) => `⚽ Azione da manuale${a ? `, ${a} apre` : ""}, ${s} chiude. Applausi a scena aperta!`],
    goalB: [(s) => `💥 Gol subito: ${s} ci punisce. Silenzio in panchina.`, (s) => `💥 ${s} trova l'angolo. Sandro guarda il cielo cercando spiegazioni.`, (s) => `💥 Rete avversaria di ${s}. Il Mister si morde la penna.`],
    save: [(s) => `🧤 Occasione Rondine: ${s} calcia, il portiere si allunga!`, (s) => `🧤 ${s} ci prova da posizione invitante: parata strepitosa.`],
    miss: [(s) => `😬 ${s} spara alto. La Madonna del Faro ringrazia.`, (s) => `😬 Tiro di ${s}: fuori di un soffio.`],
    post: [(s) => `🥁 PALO di ${s}! Il rumore si sente fino alla darsena.`],
    block: [(s) => `🧱 ${s} calcia, un difensore si immola sul tiro.`],
    saveB: [(s) => `🧤 Sandro vola e salva sul tiro di ${s}!`, (s) => `🧤 ${s} calcia: Sandro respinge di pugno. Sarà il pesce di ieri.`],
    missB: [(s) => `😮‍💨 ${s} tira alto. Respiriamo.`, (s) => `😮‍💨 ${s} fuori di un soffio. Ancora tutti vivi.`],
    postB: [(s) => `🥁 Palo avversario con ${s}! Ci è andata di lusso.`],
    blockB: [(s) => `🛡️ Chicco mura il tiro di ${s} sulla linea!`]
  };

  function applyShot(res) {
    const t = res.team, s = res.shooter.name.replace(" (C)", "");
    const k = res.kind;
    if (t === "A") { S.shotsA++; S.xgA += res.q * 0.8; if (k === "goal" || k === "save") S.sotA++; }
    else { S.shotsB++; S.xgB += res.q * 0.8; if (k === "goal" || k === "save") S.sotB++; }
    if (k === "goal") {
      if (t === "A") {
        S.scoreA++; res.shooter.goals++; if (res.assist) res.assist.assists++;
        if (S.min > 60) S.stats.lateGoals++;
        if (S.min <= 20) S.stats.earlyGoals++;
        if (S.min <= 45) S.stats.h1++;
        if (!S.stats.first) S.stats.first = "A";
        S.stats.scorers[s] = (S.stats.scorers[s] || 0) + 1;
        if (S.scoreA === S.scoreB && !S.stats.eqMin) S.stats.eqMin = Math.max(1, S.min);
        S.morale = clamp(S.morale + 7, 0, 100);
        addLog(`${pick(TXT.goalA)(s, res.assist ? res.assist.name.replace(" (C)", "") : "")}`, "goal");
        S.banner = { t: "GOOOL!", sub: s, col: "#fde047", life: 2.2 };
        confetti();
        S.shake = 10;
      } else {
        S.scoreB++; S.morale = clamp(S.morale - 7, 0, 100);
        if (!S.stats.first) S.stats.first = "B";
        if (S.min > 45) S.stats.concH2++;
        if (S.scoreB > S.scoreA) S.stats.trailed = true;
        addLog(pick(TXT.goalB)(s), "opp");
        S.banner = { t: "GOL SUBITO", sub: s, col: "#fb7185", life: 2 };
        S.shake = 6;
      }
      S.rest = { x: W / 2, y: H / 2 };
      snd("playGoal");
    } else {
      if (t === "B" && k === "save") { const g = ourGK(); if (g) g.saves++; S.gkSaves++; }
      const key = t === "A" ? k : k + "B";
      addLog(pick(TXT[key])(s), "");
      snd(k === "post" ? "playPost" : k === "block" ? "playTackle" : "playBounce");
    }
    updateScoreboard();
  }

  function confetti() {
    for (let i = 0; i < 40; i++) S.parts.push({ x: W / 2 + (rnd() - 0.5) * 60, y: 30, vx: (rnd() - 0.5) * 220, vy: rnd() * 120 + 30, life: 1.4 + rnd(), c: pick(["#fde047", "#38bdf8", "#f472b6", "#fff", "#4ade80"]) });
  }

  // ---------------------------------------------------------------- simulazione di un minuto
  function stepMinute() {
    S.min++;
    S.xi.forEach((p) => { p.mins++; });
    if (S.confuse > 0) S.confuse--;
    if (S.press === "alto") S.stats.altoMin++;
    if (S.ment === "allin") S.stats.allin = true;
    (S.opp.beats || []).forEach((b) => { if (b.min === S.min) addLog(`${CHAR[b.who] ? CHAR[b.who].split(" ·")[0] : b.who}: ${b.t}`, "tip"); });
    // stanchezza
    const M = MENT[S.ment], P = PRESS[S.press];
    S.xi.forEach((p) => {
      if (p.slotGrp === "POR") { p.st = Math.max(25, p.st - 0.08); return; }
      const g = p.slotGrp === "CEN" ? 1.12 : p.slotGrp === "DIF" ? 0.92 : 1;
      p.st = Math.max(8, p.st - 0.52 * M.st * P.st * g * (S.drain || 1) * (p.eco ? 0.5 : 1));
    });
    S.oppStam = Math.max(15, S.oppStam - 0.48 * S.opp.mod.tire * (S.press === "alto" ? 1.35 : 1) * (S.oppBuff.atk > 1.1 ? 1.1 : 1));
    S.oppXI.forEach((p) => { p.st = S.oppStam; });

    // sostituzioni avversarie e twist
    if (S.min === 60 && !S.oppSubDone) { S.oppSubDone = true; S.oppStam = Math.min(100, S.oppStam + (S.opp.id === "dragoni" ? 8 : 22)); addLog(`🔁 ${S.opp.short} inserisce forze fresche.`, "opp"); }
    S.opp.twist(S);
    if (S.min === 75 && S.scoreB < S.scoreA && S.opp.id !== "dragoni" && S.opp.id !== "fanfara") { S.oppBuff.atk = Math.max(S.oppBuff.atk, 1.14); S.oppBuff.def = Math.min(S.oppBuff.def, 0.9); addLog(`📣 ${S.opp.short} si butta in avanti negli ultimi minuti.`, "opp"); }

    const A = powerA(), B = powerB();
    const ex = 1.3;
    const pa = Math.pow(A.mid, ex) / (Math.pow(A.mid, ex) + Math.pow(B.mid, ex));
    const ours = rnd() < pa;
    S.poss = ours ? "A" : "B";
    S.posTotal++; if (ours) S.posA++;

    let shot = null;
    // recupero palla alta con pressing alto
    if (S.press === "alto" && !ours && rnd() < 0.06) {
      S.stats.recups++;
      addLog(`⚡ Pressing alto! Palla recuperata nella loro metà: il Rondine riparte subito.`, "tip");
      shot = rollShot("A", 0.16 + rnd() * 0.12, 0.1);
      S.poss = "A";
    } else if (ours) {
      const pc = 0.135 * Math.pow(clamp(A.atk / B.def, 0.5, 1.8), 1.35);
      if (rnd() < pc) shot = rollShot("A", clamp((0.07 + rnd() * 0.2 + (A.atk / B.def - 1) * 0.12) * S.opp.mod.wall, 0.04, 0.55), 0);
    } else {
      const ctr = M.ctr * S.opp.mod.ctr * S.oppBuff.ctr;
      const pc = 0.135 * Math.pow(clamp(B.atk / A.def, 0.5, 1.8), 1.35) * ctr;
      if (rnd() < pc) {
        const q = clamp(0.07 + rnd() * 0.2 + (B.atk / A.def - 1) * 0.12 + (ctr > 1.3 ? 0.05 : 0), 0.04, 0.55);
        shot = rollShot("B", q, 0);
        if (ctr > 1.3 && (S.ment === "offensiva" || S.ment === "allin")) addLog(`↩️ Contropiede! Il nostro assalto lascia spazi enormi.`, "opp");
      }
    }
    // falli
    const foulP = S.opp.mod.foul + S.oppBuff.foul;
    if (!shot && rnd() < foulP) {
      addLog(`🟨 Fallo duro dei ${S.opp.short}: punizione per noi.`, "");
      shot = rollShot("A", 0.1 + rnd() * 0.06, 0);
      S.poss = "A";
    }
    buildPath(S.poss, shot);
    // consigli del vice e radiocronaca di Radio Molo
    if (S.min % 9 === 0 && S.min - S.lastTip >= 8) viceTip();
    if (S.min >= 8 && S.min - S.radioMin >= 12 && rnd() < 0.35) radioLine();
    updateScoreboard();
    refreshLive();
  }

  // battute di Arturo (Radio Molo), a tema col momento della partita
  function radioLine() {
    S.radioMin = S.min;
    const d = S.scoreA - S.scoreB, o = S.opp.short, pa = S.posTotal ? S.posA / S.posTotal : 0.5;
    const pool = [];
    if (d > 0) pool.push(`Arturo: «Rondine avanti. Il Borgo sorride, la curva intona, Baciccia fa finta di non sapere cosa sia un pallone.»`, `Arturo: «${S.scoreA}-${S.scoreB} per il Rondine. Dalla cabina sento già l'odore del fritto di Zia Pina.»`);
    else if (d < 0) pool.push(`Arturo: «Siamo sotto, ma il vento cambia. O almeno così dicono i gabbiani, che hanno sempre una teoria.»`, `Arturo: «Rondine indietro. Il Mister fissa il vuoto: è la sua posa migliore, si dice.»`);
    else pool.push(`Arturo: «Partita equilibrata: il pallone gira, le idee un po' meno. Nel frattempo, ${o} suda con dignità.»`, `Arturo: «Il pareggio è come il caffè di Tonino: serve per stare svegli, ma non ci credi mai fino in fondo.»`);
    if (pa > 0.6) pool.push(`Arturo: «Il possesso è nostro, ma il pallone ci tiene più a ${o} che a noi. Strano, vero?»`);
    if (S.min > 70) pool.push(`Arturo: «Mancano pochi minuti. Il molo trattiene il fiato, Don Aurelio le campane.»`);
    if (S.min < 30) pool.push(`Arturo: «Siamo agli inizi, e come tutti gli inizi si gioca con il coraggio degli stupidi e la speranza dei saggi.»`);
    addLog(pick(pool), "tip");
  }

  function viceTip() {
    S.lastTip = S.min;
    const tired = S.xi.filter((p) => p.slotGrp !== "POR").sort((a, b) => a.st - b.st)[0];
    if (tired && tired.st < 42 && S.subsUsed < S.maxSubs) addLog(`🧑‍🏫 Rob (il vice): "Mister, ${tired.name.replace(" (C)", "")} è a ${Math.round(tired.st)}% di energia. Un cambio?"`, "tip");
    else if (S.min > 65 && S.scoreA < S.scoreB) addLog(`🧑‍🏫 Rob: "Siamo sotto e il tempo scappa. Forse è ora di osare."`, "tip");
    else if (S.min > 65 && S.scoreA > S.scoreB && S.ment === "allin") addLog(`🧑‍🏫 Rob: "Vinciamo, Mister, e giochiamo all-in? Respiri."`, "tip");
    else if (S.xgB > S.xgA + 0.9) addLog(`🧑‍🏫 Rob: "Ci stanno schiacciando. Più filtro a centrocampo?"`, "tip");
  }

  // costruzione del percorso del pallone nel minuto
  function buildPath(team, shot) {
    const xi = team === "A" ? S.xi : S.oppXI;
    const field = xi.filter((p) => p.slotGrp !== "POR");
    const byG = (gs) => { const l = field.filter((p) => gs.includes(p.slotGrp)); return l.length ? pick(l) : pick(field); };
    const chain = [byG(["DIF", "CEN"]), byG(["CEN"]), byG(["CEN", "ATT"]), byG(["ATT", "CEN"])];
    if (shot) chain.push(shot.shooter.slotGrp ? shot.shooter : chain[3]);
    const nodes = [];
    chain.forEach((p, i) => nodes.push({ f: 0.08 + i * (shot ? 0.15 : 0.2), p }));
    S.path = { team, nodes, start: { x: S.rest.x, y: S.rest.y }, shot: null };
    S.pend = [];
    if (shot) {
      const down = team === "B";
      const gy = down ? H - 8 : 8;
      let gx = W / 2 + (rnd() - 0.5) * 50, ey = gy;
      if (shot.kind === "miss") { gx = W / 2 + (rnd() < 0.5 ? -1 : 1) * (50 + rnd() * 30); }
      if (shot.kind === "post") gx = W / 2 + (rnd() < 0.5 ? -1 : 1) * 34;
      if (shot.kind === "block") { const defs = (team === "A" ? S.oppXI : S.xi).filter((p) => p.slotGrp === "DIF"); const d = defs.length ? pick(defs) : null; if (d) { gx = d.tx; ey = d.ty; } }
      S.path.shot = { f: 0.86, x: gx, y: ey, kind: shot.kind };
      S.dive = { team: team === "A" ? "B" : "A", x: gx, on: shot.kind === "save" || shot.kind === "goal" };
      S.pend.push({ f: 0.82, fn: () => snd("playKick", 1) });
      S.pend.push({ f: 0.9, fn: () => applyShot(shot) });
    } else { S.dive = null; }
  }

  function ballPos() {
    const P = S.path;
    if (!P) return S.rest;
    let prev = P.start, pf = 0;
    const f = S.frac;
    const nodes = P.nodes.map((n) => ({ f: n.f, x: n.p.x, y: n.p.y, p: n.p }));
    if (P.shot) nodes.push({ f: P.shot.f, x: P.shot.x, y: P.shot.y });
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (f < n.f) {
        const t = (f - pf) / Math.max(0.001, n.f - pf);
        const e = t * t * (3 - 2 * t);
        S.carrier = nodes[i].p || null;
        return { x: prev.x + (n.x - prev.x) * e, y: prev.y + (n.y - prev.y) * e };
      }
      prev = n; pf = n.f;
    }
    S.carrier = P.shot ? null : (nodes[nodes.length - 1].p || null);
    return { x: prev.x, y: prev.y };
  }

  // ---------------------------------------------------------------- layout giocatori
  const BASEY = { POR: 348, DIF: 292, CEN: 224, ATT: 160 };
  function layout() {
    ["A", "B"].forEach((team) => {
      const xi = team === "A" ? S.xi : S.oppXI;
      const groups = { POR: [], DIF: [], CEN: [], ATT: [] };
      xi.forEach((p) => groups[p.slotGrp].push(p));
      let shiftC = 0, shiftA = 0, shiftD = 0;
      if (team === "A") {
        const m = { prudente: [10, 14, 6], equil: [0, 0, 0], offensiva: [-12, -14, -8], allin: [-24, -28, -16] }[S.ment];
        shiftC = m[0]; shiftA = m[1]; shiftD = m[2];
        if (S.press === "alto") { shiftD -= 10; shiftC -= 6; } else if (S.press === "basso") { shiftD += 8; shiftC += 8; }
      } else {
        const m = S.opp.id === "dragoni" ? [14, 20, 18] : S.opp.id === "gabbiani" ? [-4, -4, -6] : [0, 0, 0];
        shiftC = m[0]; shiftA = m[1]; shiftD = m[2];
        if (S.oppBuff.atk > 1.1) { shiftC -= 10; shiftA -= 10; shiftD -= 8; } else if (S.oppBuff.def > 1.08) { shiftC += 8; shiftA += 8; shiftD += 8; }
      }
      const pf = S.poss === team ? -9 : 8; // chi ha palla avanza
      const by = S.ball ? (S.ball.y - H / 2) : 0, bx = S.ball ? (S.ball.x - W / 2) : 0;
      Object.keys(groups).forEach((g) => {
        const arr = groups[g];
        arr.forEach((p, i) => {
          const n = arr.length;
          const margin = g === "POR" ? 150 : 46;
          let x = margin + (W - 2 * margin) * (i + 1) / (n + 1);
          let y = BASEY[g] + (g === "POR" ? 0 : (g === "DIF" ? shiftD : g === "CEN" ? shiftC : shiftA) + pf * (g === "DIF" ? 0.5 : 1));
          if (g !== "POR") { x += bx * 0.1; y += by * 0.1; }
          else x += bx * 0.12;
          const wob = Math.sin(performance.now() / 700 + p.num * 1.7) * 3;
          x += wob; y += Math.cos(performance.now() / 900 + p.num) * 2;
          if (team === "B") { y = H - y; x = W - x; }
          p.tx = x; p.ty = clamp(y, 18, H - 18);
        });
      });
    });
    // portiere in tuffo
    if (S.dive && S.dive.on && S.frac > 0.78) {
      const gk = (S.dive.team === "A" ? S.xi : S.oppXI).find((p) => p.slotGrp === "POR");
      if (gk) gk.tx = clamp(S.dive.x, W / 2 - 55, W / 2 + 55);
    }
  }

  // ---------------------------------------------------------------- eventi a scelta
  function scheduleEvents() {
    const ids = GENERAL_EV.slice();
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    const mins = [9 + Math.floor(rnd() * 6), 20 + Math.floor(rnd() * 8), 33 + Math.floor(rnd() * 8), 52 + Math.floor(rnd() * 6), 65 + Math.floor(rnd() * 6), 78 + Math.floor(rnd() * 8)];
    if (S.opp.season >= 1) mins.push(28 + Math.floor(rnd() * 5)); // dalla seconda stagione un imprevisto in più
    mins.sort((a, b) => a - b);
    const slots = mins.map((m, i) => ({ min: m, id: ids[i] }));
    S.evPool = ids.slice(mins.length);
    (S.opp.evForce || []).forEach((f) => {
      let k = 0, best = 99;
      slots.forEach((e, i) => { if (!e.forced && Math.abs(e.min - f.min) < best) { best = Math.abs(e.min - f.min); k = i; } });
      slots[k] = { min: f.min, id: f.id, forced: true };
    });
    slots.sort((a, b) => a.min - b.min);
    return slots;
  }

  // sceglie l'evento giusto al momento giusto (alcuni dipendono dal punteggio)
  function routeEvent(ev) {
    if (ev.forced) return ev.id;
    const d = diff();
    if (ev.min >= 55 && d <= -2 && !S.usedRim) { S.usedRim = true; return "rimonta"; }
    if (ev.min >= 62 && d >= 1 && !S.usedVan && rnd() < 0.55) { S.usedVan = true; return "vantaggio"; }
    const def = EVENTS[ev.id];
    if (!def.when || def.when()) return ev.id;
    while (S.evPool.length) { const n = S.evPool.shift(); if (!EVENTS[n].when || EVENTS[n].when()) return n; }
    return null;
  }

  function forcedShot(team, kind, shooter, q) {
    const res = { team, kind, q, shooter: shooter || (team === "A" ? pickShooterA() : pick(S.oppXI.filter((p) => p.slotGrp !== "POR"))), assist: null };
    applyShot(res);
    return res;
  }
  function byName(n) { return S.xi.find((p) => p.name.indexOf(n) === 0); }
  function weakest() { return S.xi.filter((p) => p.slotGrp !== "POR").sort((a, b) => a.st - b.st)[0]; }
  function penalty(name, prob, extraMorale) {
    const shooter = byName(name) || pickShooterA();
    if (rnd() < prob) { forcedShot("A", "goal", shooter, 0.78); if (extraMorale) S.morale = clamp(S.morale + extraMorale, 0, 100); return `Rete! ${shooter.name.replace(" (C)", "")} spiazza il portiere.`; }
    S.morale = clamp(S.morale - 4, 0, 100);
    forcedShot("A", rnd() < 0.5 ? "save" : "post", shooter, 0.78);
    return `Sbagliato! ${shooter.name.replace(" (C)", "")} si prende il lutto sulle spalle. Morale -4.`;
  }
  function theirChance(q, bonus) { const r = rollShot("B", q, bonus || 0); applyShot(r); return r; }

  const EVENTS = {
    rigore: {
      ico: "🎯", title: "RIGORE PER IL RONDINE!", text: () => "Fallo in area, l'arbitro indica il dischetto. Il pallone pesa come un'ancora. Chi lo calcia?",
      ch: [
        { t: "Dario dal dischetto", s: "Il bomber · circa 80%", go: () => penalty("Dario", 0.8, 0) },
        { t: "Leo, il capitano", s: "Se segna, la squadra decolla · circa 72%", go: () => penalty("Leo", 0.72, 5) },
        { t: "Sandro, il portiere (!)", s: "Leggenda o disastro · circa 25%", go: () => { const r = penalty("Sandro", 0.25, 0); if (r.startsWith("Rete")) { S.morale = clamp(S.morale + 12, 0, 100); return r + " La storia del Borgo è cambiata. Morale +12."; } S.morale = clamp(S.morale - 4, 0, 100); return r + " Almeno ci ha provato. Il Mister si guarda le scarpe."; } }
      ]
    },
    giallo: {
      ico: "🟨", title: "Chicco è sul filo", text: () => "Chicco ha già un giallo e continua a entrare duro. Il fischietto lo guarda con sospetto.",
      ch: [
        { t: "Richiamalo a bordo campo", s: "Più prudente: difesa leggermente meno aggressiva", go: () => { S.buff = { atk: 1, mid: 1, def: 0.97, until: S.min + 12 }; return "Chicco annuisce e smette di fare il boscaiolo. Difesa un filo più morbida per 12'."; } },
        { t: "Lascialo giocare: serve grinta", s: "Difesa più dura, ma 30% di rischio rosso", go: () => { S.buff = { atk: 1, mid: 1, def: 1.04, until: S.min + 12 }; if (rnd() < 0.3) { const c = byName("Chicco") || weakest(); S.xi = S.xi.filter((p) => p !== c); S.stats.reds++; S.stats.cards++; S.morale = clamp(S.morale - 6, 0, 100); reassign(S.form); addLog(`🟥 ESPULSO ${c.name}! Il Rondine resta in dieci.`, "opp"); S.banner = { t: "ROSSO", sub: c.name, col: "#f87171", life: 2 }; return "Il rischio non ha pagato: rosso a Chicco, si gioca in dieci. Morale -6."; } S.stats.cards++; return "Chicco gioca al limite e sopravvive. Difesa più cattiva per 12'."; } },
        { t: "Sostituiscilo ora", s: "Usa un cambio: scegli dalla scheda Squadra", dis: () => S.subsUsed >= S.maxSubs, go: () => { const c = byName("Chicco"); if (c) S.selOut = c.id; tab = "squadra"; return "Apri la scheda Squadra e scegli chi entra al suo posto."; } }
      ]
    },
    contropiede: {
      ico: "🏃", title: "Palla persa a centrocampo!", text: () => `${S.opp.short}: un rivale è lanciato a rete e davanti a lui c'è solo spazio. Cosa fai?`,
      ch: [
        { t: "Fallo tattico", s: "Giallo certo, ma il pericolo si spegne", go: () => { S.stats.cards++; S.morale = clamp(S.morale - 2, 0, 100); const r = theirChance(0.08, 0); return "Mino lo butta giù: giallo, punizione lontana." + (r.kind === "goal" ? " Ma sulla punizione ci castigano lo stesso!" : ""); } },
        { t: "Rincorri e speri", s: "40% recupero, altrimenti tiro pesante", go: () => { if (rnd() < 0.4) { addLog("🛡️ Chicco recupera in scivolata con un tackle da cinema!", ""); snd("playTackle"); S.morale = clamp(S.morale + 3, 0, 100); return "Scivolata perfetta! Pallone nostro, morale +3."; } theirChance(0.34, 0); return "Troppo tardi: l'attaccante calcia a botta sicura."; } },
        { t: "Sandro esce a valanga", s: "50% lo ferma, altrimenti porta vuota", go: () => { if (rnd() < 0.5) { const g = ourGK(); if (g) { g.saves++; g.bonus += 0.4; } S.gkSaves++; S.morale = clamp(S.morale + 5, 0, 100); addLog("🧤 Sandro esce e gli ruba il pallone dai piedi!", "goal"); return "Sandro vince il duello! Morale +5."; } theirChance(0.62, 0); return "L'attaccante lo salta e la porta è semivuota..."; } }
      ]
    },
    punizione: {
      ico: "🎯", title: "Punizione dal limite", text: () => "Fallo a 22 metri dalla porta, posizione invitante. Il muro è schierato e qualcuno ha già chiuso gli occhi.",
      ch: [
        { t: "Tiro diretto di Leo", s: "Pulito e senza fronzoli", go: () => { const r = rollShot("A", 0.15, 0); r.shooter = byName("Leo") || r.shooter; applyShot(r); return r.kind === "goal" ? "Parabola da urlo, nell'angolino!" : "Non è bastato, ma il boato era già partito."; } },
        { t: "Schema: sponda di Dario", s: "Più pericoloso, ma 40% si inceppa", go: () => { if (rnd() < 0.4) { addLog("😅 Lo schema si inceppa: Leo e Dario si scontrano.", ""); return "Il muro ha riso. Si riparte."; } const r = rollShot("A", 0.26, 0); r.shooter = byName("Dario") || r.shooter; applyShot(r); return r.kind === "goal" ? "Lo schema funziona alla perfezione!" : "Schema riuscito, finale sfortunato."; } },
        { t: "Cross per Chicco in area", s: "Colpo di testa di un difensore", go: () => { const r = rollShot("A", 0.19, 0); r.shooter = byName("Chicco") || r.shooter; applyShot(r); return r.kind === "goal" ? "Colpo di testa vincente! Chicco corre senza fermarsi." : "Svetta Chicco, ma il portiere c'è."; } }
      ]
    },
    nonna: {
      ico: "🧣", title: "In tribuna c'è Nonna Teresa", text: () => "Nonna Teresa, 84 anni, è venuta a vedere il Rondine con la sciarpa del '71 sulle ginocchia. Non ha mai mancato una partita. Il capitano ti guarda: dedicare la partita a lei?",
      ch: [
        { t: "Sì, a gran voce", s: "Morale +9", go: () => { S.morale = clamp(S.morale + 9, 0, 100); S.banner = { t: "PER TERESA", sub: "", col: "#f9a8d4", life: 2 }; return "Tutta la squadra alza la sciarpa verso la tribuna. Vecchi tifosi si asciugano gli occhi. Morale +9."; } },
        { t: "Zitto: si vince in silenzio", s: "Concentrazione: difesa +5% per 12'", go: () => { S.buff = { atk: 1, mid: 1, def: 1.05, until: S.min + 12 }; return "Un cenno col capo e basta. La squadra stringe i denti. Difesa +5% per 12'."; } },
        { t: "Fai suonare il coro del molo", s: "Morale +4, energia +4 a tutti", go: () => { S.morale = clamp(S.morale + 4, 0, 100); S.xi.forEach((p) => { p.st = Math.min(100, p.st + 4); }); return "Il coro parte dal molo e arriva fino al campo. Morale +4, energia +4."; } }
      ]
    },
    gambe: {
      ico: "🥵", title: "Gambe di piombo", text: () => { const w = weakest(); return `${w.name.replace(" (C)", "")} è al ${Math.round(w.st)}% di energia: si trascina sul campo e fa cenno alla panchina.`; },
      ch: [
        { t: "Cambialo", s: "Usa un cambio: scegli dalla scheda Squadra", dis: () => S.subsUsed >= S.maxSubs, go: () => { const w = weakest(); S.selOut = w.id; tab = "squadra"; return `Apri la scheda Squadra: ${w.name} è già selezionato. Scegli chi entra.`; } },
        { t: "Stringi i denti", s: "Resta, ma -8% energia e +2 morale", go: () => { const w = weakest(); w.st = Math.max(8, w.st - 8); S.morale = clamp(S.morale + 2, 0, 100); return `${w.name} stringe i denti. Il pubblico apprezza, le sue gambe un po' meno.`; } },
        { t: "Gioca a risparmio", s: "Consuma metà energia, ma rende il 95%", go: () => { const w = weakest(); w.eco = true; w.r = Math.round(w.r * 0.96); return `${w.name} ora cammina con intelligenza. Perderà meno fiato per il resto della partita.`; } }
      ]
    },
    pioggia: {
      ico: "🌧️", title: "Piove sul molo", text: () => "Un temporale arriva da mare: il pallone diventa un sapone e il campo una pista di pattinaggio. Come cambi il gioco?",
      ch: [
        { t: "Palla a terra, tocchi brevi", s: "Centrocampo +8% per 15'", go: () => { S.buff = { atk: 1, mid: 1.08, def: 1, until: S.min + 15 }; return "Passaggi corti e nessuna follia. Centrocampo +8% per 15'."; } },
        { t: "Lanci lunghi per gli attaccanti", s: "Attacco +10%, difesa -4% per 12'", go: () => { S.buff = { atk: 1.1, mid: 1, def: 0.96, until: S.min + 12 }; return "Palloni alti e speranza. Attacco +10%, difesa -4% per 12'."; } },
        { t: "Tutti sotto la pioggia, cantando", s: "Morale +6, energia -3", go: () => { S.morale = clamp(S.morale + 6, 0, 100); S.xi.forEach((p) => { p.st = Math.max(8, p.st - 3); }); return "Una squadra che canta sotto l'acqua è una squadra che non ha paura. Morale +6, energia -3."; } }
      ]
    },
    arbitro: {
      ico: "📣", title: "L'arbitro non convince", text: () => "Il direttore di gara, nella vita pescivendolo, ha appena fischiato un fallo che non esisteva. La panchina ribolle.",
      ch: [
        { t: "Vai a protestare", s: "45% giallo al Mister, +5 morale", go: () => { S.morale = clamp(S.morale + 5, 0, 100); if (rnd() < 0.45) { S.stats.cards++; return "Giallo per te, ma i ragazzi ti hanno visto lottare. Morale +5 (e una brutta figura)."; } return "Protesta vibrante e nessuna conseguenza. Morale +5."; } },
        { t: "Resta seduto, respira", s: "Nessun rischio, morale -2", go: () => { S.morale = clamp(S.morale - 2, 0, 100); return "Mister zen, ma i ragazzi sbuffano. Morale -2."; } },
        { t: "Ironizza: «Le compro io gli occhiali»", s: "50% ridono tutti (+5), 50% gelo (-3)", go: () => { if (rnd() < 0.5) { S.morale = clamp(S.morale + 5, 0, 100); return "L'arbitro sorride: l'ironia ha sciolto il clima. Morale +5."; } S.morale = clamp(S.morale - 3, 0, 100); return "Silenzio di tomba. L'arbitro annota qualcosa. Morale -3."; } }
      ]
    }
  };


  // ---------------------------------------------------------------- nuovi imprevisti durante la partita
  const mor = (d) => { S.morale = clamp(S.morale + d, 0, 100); };
  const eng = (d) => { S.xi.forEach((p) => { p.st = clamp(p.st + d, 8, 100); }); };
  const buf = (o, m) => { S.buff = Object.assign({ atk: 1, mid: 1, def: 1 }, o, { until: S.min + m }); };
  const shotBy = (name, q, ok, ko) => { const r = rollShot("A", q, 0); r.shooter = byName(name) || r.shooter; applyShot(r); return r.kind === "goal" ? ok : ko; };
  const diff = () => S.scoreA - S.scoreB;
  const leoP = () => byName("Leo");

  Object.assign(EVENTS, {
    radio: {
      ico: "📻", title: "Radio Molo in diretta", text: () => "Arturo, dalla cabina di Radio Molo, ti passa il microfono: «Mister, due parole per gli ascoltatori? Sono quattro, ma molto affezionati.»",
      ch: [
        { t: "Elogia la squadra in diretta", s: "Morale +5", go: () => { mor(5); return "Poche parole, tutte vere. I ragazzi sorridono. Morale +5."; } },
        { t: "Spiega la tattica (e svela tutto)", s: "Attacco +6% per 10', ma gli avversari ascoltano la radio", go: () => { buf({ atk: 1.06 }, 10); S.oppBuff.atk = Math.max(S.oppBuff.atk, 1.04); return "Hai svelato il piano: noi attacchiamo meglio, loro ti stanno ascoltando. Attacco +6%, ma ora lo sanno."; } },
        { t: "Passa la parola ad Arturo", s: "Morale +2, nessun rischio", go: () => { mor(2); return "Arturo racconta la storia di un pesce che voleva giocare a calcio. Nessuno ricorda come finisce, ma tutti ridono. Morale +2."; } }
      ]
    },
    presidente: {
      ico: "📞", title: "Il Presidente al telefono", text: () => "Squilla il telefono della panchina. È il Presidente Spigola: «Mister, il Cavaliere mi ha offerto un caffè. Un CAFFÈ, capisce? Vinca, o lo bevo.»",
      ch: [
        { t: "«La richiamo a fine partita, Presidente»", s: "Morale +2, 25% si offende (-4)", go: () => { if (rnd() < 0.25) { mor(-4); return "Click. Il Presidente ha messo giù offeso: lo senti anche dal campo. Morale -4."; } mor(2); return "Il Presidente tace, poi sospira: «Bravo. Vinca.» Morale +2."; } },
        { t: "Prometti una cena in trattoria se si vince", s: "Morale +6, la cena è sulla parola", go: () => { mor(6); S.promise = true; return "«Cena per tutti!» I ragazzi si guardano e annuiscono. Dina ha già scritto 'cena' a bilancio. Morale +6."; } },
        { t: "Passa il telefono a Sandro", s: "Imprevedibile: il portiere parla sempre poco", go: () => { const g = ourGK(); if (g) g.bonus += 0.2; if (rnd() < 0.5) { mor(4); return "Sandro dice 'sì' e 'no' in modo così convincente che il Presidente è commosso. Morale +4."; } mor(-1); return "Sandro dice 'mmh'. Il Presidente non ha capito, e neanche Sandro. Morale -1."; } }
      ]
    },
    striscione: {
      ico: "🪧", title: "Lo striscione della curva", text: () => "In curva hanno srotolato uno striscione lunghissimo: «MISTER, FACCI SOGNARE (O ALMENO DIGERIRE)». Tutta la panchina aspetta la tua risposta.",
      ch: [
        { t: "Saluta la curva col pugno chiuso", s: "Morale +4", go: () => { mor(4); return "La curva ruggisce. Qualcuno piange (di fritto). Morale +4."; } },
        { t: "Rispondi con un cenno ironico", s: "60% ride tutto il campo (+6), altrimenti +1", go: () => { if (rnd() < 0.6) { mor(6); return "Alzi due dita e fai il gesto del cuoco. Il molo ride a crepapelle. Morale +6."; } mor(1); return "Il gesto è sfuggito a tutti. Il fritto, però, è arrivato lo stesso. Morale +1."; } },
        { t: "Resta concentrato sulla partita", s: "Difesa +3% per 10'", go: () => { buf({ def: 1.03 }, 10); return "Nemmeno un sorriso: il Mister è già altrove. Difesa +3% per 10'."; } }
      ]
    },
    gabbiano: {
      ico: "🕊️", title: "Peppino in campo", text: () => "Peppino, il gabbiano della banchina, ha rubato il fischietto dell'arbitro e fa il giro del campo a piccoli salti. Il gioco è fermo e metà stadio ride.",
      ch: [
        { t: "Sorridi e lascia fare", s: "Morale +4, energia +3 a tutti", go: () => { mor(4); eng(3); return "Qualche secondo di respiro e di risate. Morale +4, energia +3."; } },
        { t: "Offri una briciola di focaccia", s: "Peppino restituisce il fischietto", go: () => { mor(2); S.oppStam = Math.min(100, S.oppStam + 3); return "Peppino scambia il fischietto con la focaccia. Applausi. Morale +2 (un po' di fiato anche per loro)."; } },
        { t: "Manda Gigi a recuperarlo", s: "Gigi imita il gabbiano: morale +5", go: () => { mor(5); return "Gigi si lancia: due minuti di duello a suon di versi. Vince il gabbiano, vince Gigi, vince il pubblico. Morale +5."; } }
      ]
    },
    capitano: {
      when: () => !!leoP() && S.min >= 18,
      ico: "🎖️", title: "Leo è altrove", text: () => "Leo ha sbagliato due passaggi facili e guarda verso gli spalti, come se cercasse qualcuno. Si avvicina alla panchina: «Mister... mi tolgo la fascia?»",
      ch: [
        { t: "«No. Tienila. Respira.»", s: "Morale +6, Leo +4 energia", go: () => { mor(6); const l = leoP(); if (l) l.st = Math.min(100, l.st + 4); return "Leo respira, annuisce e si rimette la fascia dritta. Il campo si accorge che sta meglio. Morale +6."; } },
        { t: "Parlagli un minuto a bordocampo", s: "Leo +10 energia, morale +3", go: () => { mor(3); const l = leoP(); if (l) l.st = Math.min(100, l.st + 10); return "Un minuto, senza dire niente di importante, ma dicendolo bene. Leo torna in campo con un altro passo. Morale +3."; } },
        { t: "Fascia a Dario per un po'", s: "Attacco +4% per 12', ma Leo si ferma a pensare (-3 morale)", go: () => { buf({ atk: 1.04 }, 12); mor(-3); return "Dario si mette la fascia di traverso e carica i compagni. Leo dà una mano da dietro. Attacco +4%, morale -3."; } }
      ]
    },
    vento: {
      ico: "🌬️", title: "Rinforza la tramontana", text: () => "La tramontana rinforza e sposta il pallone a modo suo. Il vento, stasera, ha deciso da che parte stare, ma non ha detto quale.",
      ch: [
        { t: "Gioca col vento a favore: attacca", s: "Attacco +8%, difesa -3% per 12'", go: () => { buf({ atk: 1.08, def: 0.97 }, 12); return "Palloni alti e speranza: attacco +8%, difesa -3% per 12'."; } },
        { t: "Palla bassa e pazienza", s: "Centrocampo +6% per 12'", go: () => { buf({ mid: 1.06 }, 12); return "Il vento passa, i tocchi corti restano. Centrocampo +6% per 12'."; } },
        { t: "Tiro da fuori di Tommy", s: "Una botta sola: il vento aiuta o tradisce", go: () => shotBy("Tommy", 0.14, "Il vento la porta in porta: gol da fuori di Tommy!", "La palla fa una curva che neanche il vento sapeva. Nessun gol.") }
      ]
    },
    corner: {
      ico: "⛳", title: "Calcio d'angolo", text: () => "Corner per il Rondine: il pallone è sul dischetto d'angolo e il Borgo trattiene il fiato. Dove lo mandiamo?",
      ch: [
        { t: "Primo palo: Chicco", s: "Colpo di testa di un difensore", go: () => shotBy("Chicco", 0.18, "Svetta Chicco: la traversa gli fa un regalo. GOL!", "Chicco ci prova, ma la porta è più alta di quel che pensava.") },
        { t: "Secondo palo: Dario", s: "Più pericoloso, 30% si inceppa", go: () => { if (rnd() < 0.3) return "Il cross è troppo lungo: palla in fallo laterale."; return shotBy("Dario", 0.24, "Dario si inserisce di sinistro: GOL!", "Dario ci arriva, ma il portiere ha fiutato la traiettoria."); } },
        { t: "Schema corto: Tommy e Leo", s: "50%: tiro da posizione migliore", go: () => { if (rnd() < 0.5) return shotBy("Leo", 0.27, "Triangolo, controllo, botta: GOL di Leo!", "Bella la combinazione, ma il portiere c'era."); return "Lo schema si pesta i piedi da solo. Si riparte."; } }
      ]
    },
    fairplay: {
      ico: "🤝", title: "Rimessa non nostra", text: () => "L'arbitro assegna a noi una rimessa che non era nostra: l'ultimo tocco era di un nostro difensore. Solo i nostri lo sanno. Il capitano ti guarda.",
      ch: [
        { t: "Restituisci il pallone", s: "Onestà: morale +8", go: () => { mor(8); S.oppStam = Math.min(100, S.oppStam + 2); return "Il pallone torna agli avversari. Applauso del pubblico, un cenno dal loro allenatore. Morale +8."; } },
        { t: "Batti subito la rimessa", s: "Occasione veloce, ma morale -3", go: () => { mor(-3); const r = rollShot("A", 0.1, 0); applyShot(r); return r.kind === "goal" ? "Rimessa veloce, tiro: gol! Ma qualcuno ha la faccia di chi ha preso un pezzo di pane che non era suo. Morale -3." : "Rimessa veloce, tiro, niente. Peccato per la coscienza. Morale -3."; } },
        { t: "Lascia decidere a Leo", s: "50% fa la cosa giusta (+9), altrimenti troppo tardi (-2)", go: () => { if (rnd() < 0.5) { mor(9); return "Leo alza la mano e restituisce il pallone, senza chiedere niente a nessuno. Morale +9."; } mor(-2); return "Leo ci pensa un attimo di troppo: il gioco è già ripartito. Morale -2."; } }
      ]
    },
    campane: {
      ico: "🔔", title: "Le campane di San Pietro", text: () => "Don Aurelio, convinto che sia l'ora dell'Angelus, fa suonare le campane in piena azione. Il rumore copre i tuoi ordini e il campo si ferma a guardare in su.",
      ch: [
        { t: "Fermi tutti: si rispetta la campana", s: "Energia +5, morale +2", go: () => { eng(5); mor(2); return "Un minuto di campane e un respiro lungo. Energia +5, morale +2."; } },
        { t: "Giocate lo stesso, urlando", s: "Attacco +4%, centrocampo -3% per 10'", go: () => { buf({ atk: 1.04, mid: 0.97 }, 10); return "Voi urlate, le campane urlano di più. Attacco +4%, centrocampo -3%."; } },
        { t: "Palleggio a tempo di campana", s: "Centrocampo +5% per 10'", go: () => { buf({ mid: 1.05 }, 10); return "Tre tocchi, un rintocco. I ragazzi trovano il ritmo, Don Aurelio lo scopre dopo. Centrocampo +5%."; } }
      ]
    },
    capra: {
      ico: "🐐", title: "La capra di Zia Ornella", text: () => "Una capra di Zia Ornella è entrata in campo da dietro la porta e bruca l'erba con aria di proprietà. Il gioco è fermo e il pubblico guarda lei, non voi.",
      ch: [
        { t: "Chicco la porta fuori in braccio", s: "Morale +4, Chicco -4 energia", go: () => { mor(4); const c = byName("Chicco"); if (c) c.st = Math.max(8, c.st - 4); return "Chicco si carica la capra come un sacco di farina. La capra non protesta. Il pubblico sì, per l'applauso. Morale +4."; } },
        { t: "Falla restare: è la dodicesima in campo", s: "Morale +5", go: () => { mor(5); return "L'arbitro, nel dubbio, la ammonisce. La capra non ci fa caso. Morale +5."; } },
        { t: "Chiama Zia Ornella dagli spalti", s: "Energia +3 a tutti", go: () => { eng(3); return "Zia Ornella scende, la capra obbedisce, e porta anche un piatto di ricotta: neanche la partita le importa. Energia +3."; } }
      ]
    },
    gigi: {
      when: () => S.bench.some((p) => p.name === "Gigi" && !p.off),
      ico: "🧒", title: "Gigi vuole entrare", text: () => "Gigi, 14 anni e un'infinita riserva di parole, ti supplica: «Mister, ho imitato il gabbiano tutta la settimana! Mi metta, glielo giuro, non parlo.»",
      ch: [
        { t: "Fallo scaldare e mettilo dentro", s: "Usa un cambio: scegli chi esce nella scheda Squadra", dis: () => S.subsUsed >= S.maxSubs, go: () => { const w = weakest(); if (w) S.selOut = w.id; tab = "squadra"; return `Apri la scheda Squadra: ${w ? w.name : "il più stanco"} è già selezionato. Tocca Gigi per farlo entrare.`; } },
        { t: "«Il tuo momento arriva»", s: "Morale +2", go: () => { mor(2); return "Gigi annuisce e resta zitto, per due minuti. Un record. Morale +2."; } },
        { t: "Fagli fare il gabbiano a bordocampo", s: "Morale +5", go: () => { mor(5); return "Gigi si esibisce: la curva ride, l'avversario si distrae. Morale +5."; } }
      ]
    },
    tifosi: {
      ico: "🗣️", title: "Insulti dagli spalti", text: () => "Dagli spalti ospiti arrivano battute pesanti. Un tifoso grida che il Rondine è 'una squadra di fritto e canzonette'. La panchina ribolle.",
      ch: [
        { t: "Zittiscili con un gol: attacca", s: "Attacco +6% per 10'", go: () => { buf({ atk: 1.06 }, 10); return "Il fritto e le canzonette, adesso, hanno fame di gol. Attacco +6% per 10'."; } },
        { t: "Fai cantare il molo", s: "Morale +5", go: () => { mor(5); return "Il coro del molo copre tutto, anche l'insulto. Morale +5."; } },
        { t: "Fingi di non sentire", s: "Morale +1", go: () => { mor(1); return "Mister zen: hai le orecchie piene d'acciughe. Morale +1."; } }
      ]
    },
    acqua: {
      when: () => S.min >= 35,
      ico: "💧", title: "Pausa per bere", text: () => "Caldo anomalo per la stagione: la panchina chiede una pausa per bere. L'arbitro lascia a te la scelta di come usarla.",
      ch: [
        { t: "Acqua per tutti", s: "Energia +5 a tutti", go: () => { eng(5); return "Bottiglie che passano di mano in mano. Energia +5."; } },
        { t: "Solo ai tre più stanchi", s: "Energia +15 a loro", go: () => { S.xi.filter((p) => p.slotGrp !== "POR").sort((a, b) => a.st - b.st).slice(0, 3).forEach((p) => { p.st = Math.min(100, p.st + 15); }); return "I tre più stanchi tornano a respirare. Energia +15 a loro."; } },
        { t: "Niente acqua: parlate", s: "Morale +5, energia +1", go: () => { mor(5); eng(1); return "Un minuto di parole e fiducia. Morale +5."; } }
      ]
    },
    rimonta: {
      when: () => diff() <= -2,
      ico: "😤", title: "Siamo sotto di due", text: () => "Sotto di due. Il pubblico guarda a terra, Sara guarda i dati, Leo guarda te. Il tempo corre.",
      ch: [
        { t: "All-in: tutti avanti", s: "Mentalità All-in, morale +6", go: () => { S.ment = "allin"; mor(6); return "Tutti avanti, difesa compresa. Morale +6: o si vince o si impara a perdere."; } },
        { t: "Un gol alla volta", s: "Mentalità equilibrata, morale +8", go: () => { S.ment = "equil"; mor(8); return "«Un gol. Poi un altro.» Il campo si calma. Morale +8."; } },
        { t: "Pressing alto", s: "Pressing alto, centrocampo +5% per 10'", go: () => { S.press = "alto"; buf({ mid: 1.05 }, 10); mor(4); return "Si riparte aggressivi: pressing alto, centrocampo +5%, morale +4."; } }
      ]
    },
    vantaggio: {
      when: () => diff() >= 1 && S.min >= 60,
      ico: "🛡️", title: "Difendere il vantaggio", text: () => "Siamo avanti. Il tempo non passa: ogni minuto pesa come un'ancora e Sandro ha già mangiato un'unghia.",
      ch: [
        { t: "Pullman davanti alla porta", s: "Mentalità prudente, difesa +6% per 12'", go: () => { S.ment = "prudente"; buf({ def: 1.06 }, 12); return "Si chiude tutto. Difesa +6% per 12'."; } },
        { t: "Continua ad attaccare", s: "Attacco +5% per 10'", go: () => { buf({ atk: 1.05 }, 10); return "Chi attacca non si fa male. Almeno così dicono i giovani. Attacco +5%."; } },
        { t: "Perdi tempo (con eleganza)", s: "Gli avversari -5% attacco per 10', morale -2", go: () => { S.oppBuff.atk = Math.min(S.oppBuff.atk, 0.95); mor(-2); return "Sandro rimette in gioco in sessanta secondi di calma olimpica. Il pubblico fischia, ma il tempo scorre. Morale -2."; } }
      ]
    },
    // ---- eventi legati agli episodi
    lampare: {
      ico: "🏮", title: "Le lampare vacillano", text: () => "Una raffica spegne tre lampare su sette. Anselmo, dal molo, grida: «Sono buone, sono buone, adesso le riaccendo!». In campo c'è una penombra da romanzo.",
      ch: [
        { t: "Chiedi ad Anselmo di accendere anche la sua barca", s: "Morale +5", go: () => { mor(5); return "Anselmo accende anche la barca: il campo è un mare di luci. Morale +5."; } },
        { t: "Gioca palla a terra, a memoria", s: "Centrocampo +6% per 12'", go: () => { buf({ mid: 1.06 }, 12); return "I ragazzi conoscono ogni zolla: palla bassa, nessun errore. Centrocampo +6%."; } },
        { t: "Tira più che puoi, nel buio", s: "Attacco +8%, difesa -4% per 12'", go: () => { buf({ atk: 1.08, def: 0.96 }, 12); return "Se non si vede, si tira. Attacco +8%, difesa -4%."; } }
      ]
    },
    settimio: {
      ico: "✂️", title: "Le forbici di Settimio", text: () => "Prima di un angolo, Settimio entra in campo con le sue forbici e taglia un ciuffo d'erba storta vicino alla bandierina. Applausi da tutto il campo. Poi ti guarda: «Qualunque cosa succeda, Mister, che sia bella.»",
      ch: [
        { t: "Dedica il prossimo gol a Settimio", s: "Morale +7, attacco +4% per 10'", go: () => { mor(7); buf({ atk: 1.04 }, 10); return "I ragazzi alzano il pugno verso il custode. Qualcuno asciuga una lacrima di fritto. Morale +7."; } },
        { t: "Fai firmare il pallone a tutti", s: "Morale +4, energia +3", go: () => { mor(4); eng(3); return "Il pallone passa di mano in mano, ognuno ci scrive un nome. Morale +4, energia +3."; } },
        { t: "Gioca come sai, senza dedica", s: "Difesa e centrocampo +3% per 10'", go: () => { buf({ def: 1.03, mid: 1.03 }, 10); return "Settimio annuisce: il modo più bello di ringraziare è giocare bene. Difesa e centrocampo +3%."; } }
      ]
    },
    bonaccia: {
      ico: "🧐", title: "Il Cavaliere si siede", text: () => "A mezz'ora dalla fine, il Cavalier Bonaccia scende dalla tribuna d'onore e si siede accanto a te: «Mister, un pareggio e ci rivediamo domani con un assegno. Una vittoria la ruba. Che ne dice?»",
      ch: [
        { t: "«Si gioca per vincere, Cavaliere»", s: "Morale +8", go: () => { mor(8); return "Il Cavaliere resta con la bocca aperta, poi si ricompone. I ragazzi hanno sentito tutto. Morale +8."; } },
        { t: "«Mi faccia l'assegno a fine partita»", s: "50% morale +5, altrimenti nulla", go: () => { if (rnd() < 0.5) { mor(5); return "Il Cavaliere sorride tirato. L'assegno, per ora, resta nella giacca. Morale +5."; } return "Il Cavaliere finge di non aver sentito e se ne va. Nulla da segnalare."; } },
        { t: "Ignoralo e parla con Leo", s: "Difesa +4% per 10', morale +2", go: () => { buf({ def: 1.04 }, 10); mor(2); return "Parli con Leo come se il Cavaliere fosse un ombrellone. Difesa +4%, morale +2."; } }
      ]
    },
    rocco: {
      ico: "🦈", title: "La mano tesa di Rocco", text: () => "Rocco Scafati, a bordo campo, ti tende la mano: «Una stretta veloce prima che ci sbraniamo, Mister. Poi si ricomincia, e senza pietà.»",
      ch: [
        { t: "Stringi la mano", s: "Morale +6, meno falli degli Squali", go: () => { mor(6); S.oppBuff.foul = 0.01; return "La stretta è forte e dura più del dovuto. Gli Squali, per un po', hanno meno voglia di menare. Morale +6."; } },
        { t: "«A fine partita, Rocco»", s: "Difesa +4% per 10'", go: () => { buf({ def: 1.04 }, 10); return "Rocco ride: «Mi piaci, Moretti... ehm, Mister.» Difesa +4%."; } },
        { t: "Offrigli uno Squalo alla menta (che non hai)", s: "Morale +3", go: () => { mor(3); return "Rocco ride, e per qualche minuto lo Squalo è un cucciolo. Morale +3."; } }
      ]
    },
    nebbia: {
      ico: "🌫️", title: "Nebbia fitta", text: () => "Dal mare sale una nebbia così fitta che l'arbitro fischia a occhio. Non vedi più la porta: l'unica luce è il lampione del molo.",
      ch: [
        { t: "Gioca con il rumore: tocchi corti", s: "Centrocampo +6% per 12'", go: () => { buf({ mid: 1.06 }, 12); return "I passaggi si fanno a orecchio. Centrocampo +6%."; } },
        { t: "Tira a occhio", s: "Una botta di Dario: fortuna cieca", go: () => shotBy("Dario", 0.12, "Dario tira nella nebbia e la palla trova la rete: GOL!", "Il tiro si perde nel bianco. Qualcuno giura di aver sentito un 'tuff'.") },
        { t: "Tutti dietro la linea", s: "Difesa +7%, attacco -5% per 12'", go: () => { buf({ def: 1.07, atk: 0.95 }, 12); return "La difesa è una parete, la nebbia una coperta. Difesa +7%, attacco -5%."; } }
      ]
    },
    pullman: {
      ico: "🚌", title: "Il pullman di Baciccia", text: () => "Arriva una telefonata sulla panchina: il pullman di Baciccia è ripartito con le borse dentro. Guanti, bottigliette e un paio di scarpe di ricambio vagano per la costa. Sandro gioca con le scarpe di Ugo.",
      ch: [
        { t: "«Siamo qui, e basta»", s: "Morale +6", go: () => { mor(6); return "Il Mister fa il discorso del 'chi ha il pallone ha tutto'. Morale +6."; } },
        { t: "Dieci secondi di riposo", s: "Energia +6, morale +2", go: () => { eng(6); mor(2); return "Un mini-respiro per tutti. Energia +6, morale +2."; } },
        { t: "Fai scaldare le riserve", s: "Morale +3, energia +3", go: () => { mor(3); eng(3); return "La panchina corre su e giù per il bordocampo. Si sentono tutti parte del gruppo. Morale +3, energia +3."; } }
      ]
    },
    faro_acceso: {
      ico: "🔦", title: "Ester accende il faro", text: () => "Dall'altra parte della costa, Ester accende il faro: un lampo lungo, tre brevi. È la sua firma. Tutta la squadra lo vede dal campo.",
      ch: [
        { t: "Alza lo sguardo e ringrazia", s: "Morale +7", go: () => { mor(7); return "Un cenno verso la luce lontana. Qualcuno, dal faro, lo vede. Morale +7."; } },
        { t: "Usalo come segnale: «Si parte!»", s: "Attacco +5%, centrocampo +3% per 10'", go: () => { buf({ atk: 1.05, mid: 1.03 }, 10); return "Un lampo e tutti scattano. Attacco +5%, centrocampo +3%."; } },
        { t: "Chiama i ragazzi a raccolta", s: "Energia +4, morale +4", go: () => { eng(4); mor(4); return "Cerchio al centro, un respiro, lo sguardo alla luce. Energia +4, morale +4."; } }
      ]
    },
    curva: {
      ico: "🔇", title: "La curva in silenzio", text: () => "Il campo è in silenzio: nessun coro, nessun tamburo. Poi dal fondo si alza una voce piccola, vecchia e testarda: Nonna Ferri intona il coro del molo. Uno alla volta, gli altri si alzano.",
      ch: [
        { t: "Alza le braccia verso la curva", s: "Morale +18", go: () => { mor(18); return "La curva ritrova la voce. Il campo trema dal molo fino al campo. Morale +18."; } },
        { t: "Chiedi a Leo di guidare il coro", s: "Morale +14", go: () => { mor(14); return "Leo si volta verso la curva e batte le mani: il Borgo risponde. Morale +14."; } },
        { t: "Gioca come se niente fosse", s: "Morale +6, difesa +3% per 10'", go: () => { mor(6); buf({ def: 1.03 }, 10); return "Un cenno, e basta. Chi canta canta, chi gioca gioca. Morale +6."; } }
      ]
    },
    brina: {
      ico: "🎩", title: "Parole tra colleghi", text: () => "A venti minuti dalla fine Mister Brina ti raggiunge a bordo campo e dice sottovoce: «Quest'anno è il mio miglior Mareggiata. Ma credo sia anche il tuo miglior Rondine.» Poi torna al suo posto.",
      ch: [
        { t: "«Lo vedremo dal tabellone»", s: "Morale +6, difesa +3% per 10'", go: () => { mor(6); buf({ def: 1.03 }, 10); return "Una risposta secca, un sorriso piccolo. Morale +6, difesa +3%."; } },
        { t: "Sorridi e non rispondere", s: "Morale +3", go: () => { mor(3); return "Brina lo prende come un rispetto. Il campo, per un attimo, profuma di stima. Morale +3."; } },
        { t: "Chiedigli un caffè (dopo)", s: "Meno falli, morale +4", go: () => { mor(4); S.oppBuff.foul = 0.01; return "«Dopo. Offro io.» Brina annuisce e il gioco si fa più pulito. Morale +4."; } }
      ]
    }
  });
  // vecchie scene allineate ai personaggi del Borgo (stessi nomi e tratti)
  EVENTS.nonna.title = "Nonna Ferri in tribuna";
  EVENTS.nonna.text = () => "In tribuna c'è Nonna Ferri: la portiera delle Rondinelle del '68, con la sciarpa di lana sulle ginocchia e la borsa piena di panini. Non ha mai mancato una partita. Il capitano ti guarda: dedicare la partita a lei?";
  EVENTS.giallo.text = () => "Chicco ha già un giallo e continua a entrare duro: pensa al fritto dell'intervallo, e si vede. Il fischietto lo guarda con sospetto.";
  const GENERAL_EV = ["rigore", "giallo", "contropiede", "punizione", "nonna", "gambe", "pioggia", "arbitro", "radio", "presidente", "striscione", "gabbiano", "capitano", "vento", "corner", "fairplay", "campane", "capra", "gigi", "tifosi", "acqua"];
  const COND_EV = ["rimonta", "vantaggio"];

  // ---------------------------------------------------------------- UI: schermate
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function stars(n) { return `<span class="mdx-stars">${"★".repeat(n)}<span>${"★".repeat(3 - n)}</span></span>`; }

  function storyBox(pair, cls) {
    if (!pair) return "";
    return `<div class="mdx-story ${cls || ""}"><b>${esc(CHAR[pair[0]] || pair[0])}</b>${esc(pair[1])}</div>`;
  }
  // primo episodio non ancora vinto (aperto oppure in attesa di stelle)
  function firstUnwon(p) { for (let i = 0; i < OPPS.length; i++) { if (!oppWon(p, OPPS[i].id)) return i; } return -1; }
  function nextEpisodeIdx(p) { const i = firstUnwon(p); return i >= 0 && oppUnlocked(p, i) ? i : -1; }
  function unreadCount(p) { let n = 0; OPPS.forEach((o, i) => { if (oppUnlocked(p, i) && !(p.opp[o.id] || {}).played) n++; }); return n; }

  function showMenu() {
    stopLoop();
    S = null;
    prog = loadProg();
    const rk = rankOf(prog.pts);
    const nxt = RANKS[rk + 1];
    const pct = nxt ? Math.round(((prog.pts - RANKS[rk].pts) / (nxt.pts - RANKS[rk].pts)) * 100) : 100;
    const ni = nextEpisodeIdx(prog);
    const oppBtn = (o, i) => {
      const e = prog.opp[o.id] || { stars: 0, played: 0, wins: 0, best: "" };
      const st = oppState(prog, i);
      if (!st.open) {
        return `<button class="mdx-opp lock" disabled>
          <div class="ic">🔒</div>
          <div style="flex:1;min-width:0"><span class="ep">EP. ${o.ep}</span><b>???</b><small>${esc(st.why)}</small></div>
          <div style="text-align:right;flex:none">${stars(0)}</div></button>`;
      }
      return `<button class="mdx-opp" data-opp="${i}">
        <div class="ic">${o.ico}</div>
        <div style="flex:1;min-width:0"><span class="ep">EP. ${o.ep}${!e.played ? '<span class="mdx-new">NUOVO</span>' : ""}</span><b>${esc(o.name)}</b>
        <small>${esc(o.style)} · ${esc(o.hint)}</small></div>
        <div style="text-align:right;flex:none">${stars(e.stars)}<small>${e.played ? "Record " + esc(e.best || "-") : "Mai giocata"}</small></div>
      </button>`;
    };
    const seasonsHtml = SEASONS.map((se) => {
      const list = seasonOpps(se.id);
      const open = list.length && oppUnlocked(prog, OPPS.indexOf(list[0]));
      if (!open) return `<div class="mdx-sea lock"><span>🔒 Stagione ${se.id + 1} · ???</span><small>${list.length} episodi</small></div>`;
      const won = list.filter((o) => oppWon(prog, o.id)).length;
      const stz = list.reduce((n, o) => n + ((prog.opp[o.id] || {}).stars || 0), 0);
      return `<div class="mdx-sea"><span>${se.ico} ${esc(se.t)}</span><small>${won}/${list.length} · ★ ${stz}/${list.length * 3}</small></div>` + list.map((o) => oppBtn(o, OPPS.indexOf(o))).join("");
    }).join("");
    const nx = ni >= 0 ? OPPS[ni] : null;
    root.innerHTML = `<div class="mdx-scr mdx-menu">
      <div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between">
        <div><h1 class="mdx-h1">📋 Matchday Director</h1>
        <p class="mdx-sub">Tu sei il Mister del Rondine FC, nel Borgo Marino. Il pallone lo calciano gli altri: tu decidi modulo, mentalità, pressing, cambi e che cosa urlare all'intervallo.</p></div>
        <button class="mdx-btn red" id="mdxExit" style="flex:none;min-width:48px" aria-label="Chiudi">✕</button>
      </div>
      <div class="mdx-card">
        <div class="mdx-rank"><div style="font-size:30px">🧢</div><div style="flex:1;min-width:0">
          <b style="font-size:15px">${esc(RANKS[rk].t)}</b>
          <div style="font-size:11.5px;color:#93a4bd;margin:1px 0 5px">${prog.wins}V · ${prog.draws}N · ${prog.losses}P &nbsp;·&nbsp; gol ${prog.gf}-${prog.ga} &nbsp;·&nbsp; ${prog.pts} punti &nbsp;·&nbsp; ★ ${totalStars(prog)}</div>
          <div class="mdx-bar"><i style="width:${pct}%"></i></div>
          <div style="font-size:11px;color:#64748b;margin-top:3px">${nxt ? `Prossimo grado: ${esc(nxt.t)} (${nxt.pts} punti)` : "Grado massimo raggiunto. Il Faro è fiero di te."}</div>
        </div></div>
        <div style="margin-top:6px">${Object.keys(FORMS).map((f) => `<span class="mdx-chip ${formUnlocked(prog, f) ? "g" : ""}">${formUnlocked(prog, f) ? "✔" : "🔒"} ${f}${formUnlocked(prog, f) ? "" : " (" + FORMS[f].unlock.label + ")"}</span>`).join("")}</div>
      </div>
      <div class="mdx-g2" style="margin-top:10px">
        <button class="mdx-btn gold" id="mdxNext" ${nx ? "" : "disabled"}>${nx ? "▶ Prossimo: ep. " + nx.ep : firstUnwon(prog) >= 0 ? "⭐ Servono stelle" : "Tutto completato"}</button>
        <button class="mdx-btn" id="mdxLocker">👕 Spogliatoio e bacheca</button>
      </div>
      <div style="margin:14px 0 2px;font-weight:800;font-size:13px;color:#93a4bd;letter-spacing:.5px">GLI EPISODI DEL RONDINE FC · prima vittoria su ognuno: monete</div>
      ${seasonsHtml}
      <p class="mdx-sub" style="margin-top:12px">Una partita dura circa 3 minuti (puoi accelerare). Stelle: ★ vittoria · ★★ con 2 gol di scarto o porta inviolata · ★★★ obiettivo speciale del match. Le finali di stagione richiedono un po' di stelle raccolte.</p>
    </div>`;
    root.querySelector("#mdxExit").onclick = exitAll;
    root.querySelector("#mdxLocker").onclick = () => { snd("playSelect"); showLocker(); };
    const nb = root.querySelector("#mdxNext"); if (nx) nb.onclick = () => { snd("playSelect"); startPrep(nx); };
    root.querySelectorAll("[data-opp]").forEach((b) => { b.onclick = () => { snd("playSelect"); startPrep(OPPS[Number(b.dataset.opp)]); }; });
  }

  // ---------------------------------------------------------------- spogliatoio: rosa, maglie, portiere, bacheca
  function showLocker() {
    stopLoop(); S = null;
    prog = loadProg();
    const grow = seasonsDone(prog) * 2;
    const rows = SQUAD.filter((x) => !(x.grp === "POR" && prog.gk === "ondina")).map((x) => `<div class="mdx-pl"><span class="n">${x.num}</span><div>${esc(x.name)}<small>${x.grp}</small></div><em>${x.r + grow}</em></div>`);
    ARRIVALS.forEach((a) => {
      const has = arrivalHas(prog, a.id), ref = OPPS.find((o) => o.id === a.ep), known = ref && oppUnlocked(prog, OPPS.indexOf(ref));
      rows.push(has ? `<div class="mdx-pl"><span class="n hi">${a.num}</span><div>${esc(a.name)} <span class="mdx-chip g" style="font-size:10px">NUOVO ARRIVO</span><small>${a.grp} · ${esc(a.bio)}</small></div><em>${a.r + Math.floor(grow / 2)}</em></div>`
        : `<div class="mdx-pl lock"><span class="n">?</span><div>???<small>${known ? "Si unisce vincendo: " + esc(ref.name) : "Si unisce più avanti"}</small></div><em>--</em></div>`);
    });
    const trophies = SEASONS.map((se) => seasonDone(prog, se.id) ? `<span class="mdx-chip y">${se.ico} ${esc(se.trophy)}</span>` : `<span class="mdx-chip">🔒 ???</span>`).join("");
    root.innerHTML = `<div class="mdx-scr mdx-menu">
      <div style="display:flex;gap:10px;align-items:flex-start;justify-content:space-between">
        <div><h1 class="mdx-h1">👕 Spogliatoio</h1><p class="mdx-sub">La rosa del Rondine FC cresce a ogni stagione vinta (+2 a tutti) e con i nuovi arrivi. Le maglie sono solo estetica.</p></div>
        <button class="mdx-btn" id="mdxBack" style="flex:none;min-width:48px" aria-label="Indietro">◂</button>
      </div>
      <div class="mdx-lbl">Bacheca</div><div>${trophies}</div>
      <div class="mdx-lbl">Maglia</div>
      <div class="mdx-kits">${KITS.map((k) => { const ok = k.need(prog); return `<button class="mdx-kit ${prog.kit === k.id ? "sel" : ""}" data-kit="${k.id}" ${ok ? "" : "disabled"}><i style="background:${ok ? k.k : "#334155"};border-color:${ok ? k.k2 : "#475569"}"></i><span>${ok ? esc(k.name) : "???"}<small>${ok ? (prog.kit === k.id ? "In uso" : "Tocca per indossare") : esc(k.hint)}</small></span></button>`; }).join("")}</div>
      ${arrivalHas(prog, "ondina") ? `<div class="mdx-lbl">Portiere titolare</div><div class="mdx-g2"><button class="mdx-btn ${prog.gk !== "ondina" ? "on" : ""}" data-gk="sandro">Sandro</button><button class="mdx-btn ${prog.gk === "ondina" ? "on" : ""}" data-gk="ondina">Ondina</button></div>` : ""}
      <div class="mdx-lbl">Rosa <em>valutazione attuale</em></div>
      <div>${rows.join("")}</div>
    </div>`;
    root.querySelector("#mdxBack").onclick = showMenu;
    root.querySelectorAll("[data-kit]").forEach((b) => { b.onclick = () => { prog.kit = b.dataset.kit; saveProg(prog); snd("playSelect"); showLocker(); }; });
    root.querySelectorAll("[data-gk]").forEach((b) => { b.onclick = () => { prog.gk = b.dataset.gk; saveProg(prog); snd("playSelect"); showLocker(); }; });
  }

  function startPrep(opp) {
    prog = loadProg();
    newMatch(opp, formUnlocked(prog, prog.lastForm) ? prog.lastForm : "4-3-3", prog.lastMent, prog.lastPress);
    tab = "ordini";
    buildMatchUI();
    openKickoff();
    startLoop();
  }

  function buildMatchUI() {
    root.innerHTML = `<div class="mdx-scr" id="mdxMatch">
      <div class="mdx-top">
        <button class="mdx-btn" id="mdxX" aria-label="Esci">✕</button>
        <button class="mdx-btn" id="mdxTO" style="min-width:64px">⏱ 2</button>
        <div style="flex:1"></div>
        <button class="mdx-btn gold" id="mdxPlay" style="min-width:52px">▶</button>
        <button class="mdx-btn" data-sp="1">1×</button><button class="mdx-btn" data-sp="2">2×</button><button class="mdx-btn" data-sp="4">4×</button>
      </div>
      <div class="mdx-sb"><div class="tn" id="mdxTA">Rondine FC</div><div class="sc"><span id="mdxSc">0 - 0</span><small id="mdxMin">0'</small></div><div class="tn r" id="mdxTB"></div></div>
      <div class="mdx-prog"><i id="mdxPr"></i></div>
      <canvas class="mdx-cv" id="mdxCv"></canvas>
      <div class="mdx-strip" id="mdxStrip"></div>
      <div class="mdx-tick" id="mdxTick"></div>
      <div class="mdx-tabs"><button data-tab="ordini">📋 Ordini</button><button data-tab="squadra">👕 Squadra</button><button data-tab="log">📜 Cronaca</button></div>
      <div class="mdx-pan" id="mdxPan"></div>
      <div class="mdx-sheet" id="mdxSheet" style="display:none"></div>
    </div>`;
    canvas = root.querySelector("#mdxCv");
    ctx = canvas.getContext("2d");
    sheetEl = root.querySelector("#mdxSheet");
    cw = 0;
    root.querySelector("#mdxTB").textContent = S.opp.name;
    root.querySelector("#mdxX").onclick = confirmExit;
    root.querySelector("#mdxPlay").onclick = toggleRun;
    root.querySelector("#mdxTO").onclick = useTimeout;
    root.querySelectorAll("[data-sp]").forEach((b) => { b.onclick = () => { S.speed = Number(b.dataset.sp); snd("playSelect"); refreshLive(); }; });
    root.querySelectorAll("[data-tab]").forEach((b) => { b.onclick = () => { tab = b.dataset.tab; renderPanel(); snd("playSelect"); }; });
    renderPanel(); refreshLive(); updateScoreboard(); updateTicker();
  }

  function toggleRun() {
    if (!S || S.over || S.ended) return;
    if (!S.started) { S.started = true; snd("playWhistle", true); addLog("🔔 Fischio d'inizio! Si comincia.", "tip"); }
    S.run = !S.run;
    refreshLive();
  }

  function useTimeout() {
    if (!S || S.ended || S.over || S.timeouts <= 0 || !S.started || S.min >= 89) return;
    S.timeouts--; S.run = false;
    S.xi.forEach((p) => { p.st = Math.min(100, p.st + 10); });
    S.morale = clamp(S.morale + 3, 0, 100);
    S.oppStam = Math.min(100, S.oppStam + 3);
    addLog("⏱ TIMEOUT! Energia +10 a tutti e morale +3. Rifiata e ragiona.", "tip");
    tab = "ordini"; renderPanel(); refreshLive(); snd("playWhistle", false);
  }

  function confirmExit() {
    if (!S) { exitAll(); return; }
    if (S.ended) { showMenu(); return; }
    const was = S.run; S.run = false; S.over = true;
    openSheet(`<h2>Lasciare la panchina?</h2><p>La partita in corso <b>non verrà registrata</b>: niente punti, niente premi.</p>
      <div class="mdx-g2"><button class="mdx-btn" id="mdxStay">Resta</button><button class="mdx-btn red" id="mdxLeave">Esci</button></div>`);
    sheetEl.querySelector("#mdxStay").onclick = () => { closeSheet(); S.over = false; S.run = was; refreshLive(); };
    sheetEl.querySelector("#mdxLeave").onclick = () => { closeSheet(); showMenu(); };
  }

  function openSheet(html, full) {
    sheetEl.className = "mdx-sheet" + (full ? " full" : "");
    sheetEl.innerHTML = `<div class="mdx-sh">${html}</div>`;
    sheetEl.style.display = "flex";
  }
  function closeSheet() { if (sheetEl) { sheetEl.style.display = "none"; sheetEl.innerHTML = ""; } }

  function openKickoff() {
    const o = S.opp, se = SEASONS[o.season];
    S.over = true;
    const showIntro = se && !prog.intro[se.id] && oppUnlocked(prog, OPPS.indexOf(o)) && seasonOpps(se.id)[0] === o;
    if (showIntro) { prog.intro[se.id] = true; saveProg(prog); }
    const R = o.rules || {};
    const chips = [];
    if (R.startScore) chips.push(`Si parte da ${R.startScore[0]}-${R.startScore[1]}`);
    if (R.qf && R.qf < 1) chips.push("Poca visibilità");
    if (typeof R.morale === "number" && R.morale !== 55) chips.push(R.morale > 55 ? "Clima favorevole" : "Clima ostile");
    if (R.stam) chips.push("Squadra stanca");
    if (R.drain) chips.push("Pressing avversario");
    openSheet(`${showIntro ? storyBox(se.intro) : ""}<h2>${o.ico} Rondine FC vs ${esc(o.name)}</h2>
      <div style="font-size:11.5px;color:#7d8da6;margin:-2px 0 4px">${se ? esc(se.t) + " · " : ""}episodio ${o.ep}</div>
      ${o.story ? storyBox(o.story.pre) : ""}
      <p>${esc(o.blurb)}</p>
      <div><span class="mdx-chip y">Stile: ${esc(o.style)}</span><span class="mdx-chip">Modulo: ${o.form}</span>${chips.map((c) => `<span class="mdx-chip">${esc(c)}</span>`).join("")}</div>
      <div class="mdx-res">💡 <b>Dritta di Sara:</b> ${esc(o.hint)}<br>🎯 <b>Obiettivo ★★★:</b> ${esc(o.goal)}</div>
      <p style="font-size:12.5px;color:#93a4bd">Scegli modulo, mentalità e pressing nella scheda Ordini. Puoi cambiarli quando vuoi (anche in pausa). Hai ${S.maxSubs} cambi e 2 timeout.</p>
      <div class="mdx-g2"><button class="mdx-btn" id="mdxSet">Imposta la squadra</button><button class="mdx-btn gold" id="mdxGo">Fischio d'inizio!</button></div>`);
    sheetEl.querySelector("#mdxSet").onclick = () => { closeSheet(); S.over = false; };
    sheetEl.querySelector("#mdxGo").onclick = () => { closeSheet(); S.over = false; toggleRun(); };
  }

  // ---------------------------------------------------------------- pannello
  function staminaCol(v) { return v > 60 ? "#4ade80" : v > 35 ? "#facc15" : "#f87171"; }

  function renderPanel() {
    const pan = root && root.querySelector("#mdxPan");
    if (!pan || !S) return;
    root.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    if (tab === "ordini") {
      pan.innerHTML = `
        <div class="mdx-lbl">Modulo <em>${esc(FORMS[S.form].info)}</em></div>
        <div class="mdx-g4">${Object.keys(FORMS).map((f) => { const ok = formUnlocked(prog, f); return `<button class="mdx-btn ${S.form === f ? "on" : ""}" data-form="${f}" ${ok ? "" : "disabled"}>${ok ? f : "🔒 " + f}</button>`; }).join("")}</div>
        <div class="mdx-lbl">Mentalità <em></em></div>
        <div class="mdx-g4">${Object.keys(MENT).map((k) => `<button class="mdx-btn ${S.ment === k ? "on" : ""}" data-ment="${k}">${MENT[k].ico}<br>${MENT[k].t}</button>`).join("")}</div>
        <div class="mdx-fx">${esc(MENT[S.ment].info)}</div>
        <div class="mdx-lbl">Pressing <em></em></div>
        <div class="mdx-g3">${Object.keys(PRESS).map((k) => `<button class="mdx-btn ${S.press === k ? "on" : ""}" data-press="${k}">${PRESS[k].ico} ${PRESS[k].t}</button>`).join("")}</div>
        <div class="mdx-fx">${esc(PRESS[S.press].info)}</div>
        <div class="mdx-fx" style="margin-top:8px;color:#64748b">⏱ Timeout: ${S.timeouts} · Cambi: ${S.maxSubs - S.subsUsed}/${S.maxSubs}${S.confuse > 0 ? " · ⚠️ squadra disorientata dal cambio modulo" : ""}</div>`;
      pan.querySelectorAll("[data-form]").forEach((b) => { b.onclick = () => setForm(b.dataset.form); });
      pan.querySelectorAll("[data-ment]").forEach((b) => { b.onclick = () => { S.ment = b.dataset.ment; snd("playSelect"); addLog(`📢 Mentalità: ${MENT[S.ment].t.toUpperCase()}.`, "tip"); renderPanel(); }; });
      pan.querySelectorAll("[data-press]").forEach((b) => { b.onclick = () => { S.press = b.dataset.press; snd("playSelect"); addLog(`📢 Pressing: ${PRESS[S.press].t.toUpperCase()}.`, "tip"); renderPanel(); }; });
    } else if (tab === "squadra") {
      const row = (p, kind) => `<button class="mdx-row ${S.selOut === p.id ? "sel" : ""}" data-${kind}="${p.id}"><span class="top"><span class="n">${p.num}</span><span class="nm">${esc(p.name)}</span><span class="ov" title="Valutazione">${Math.round(p.r)}</span><span class="gp">${p.slotGrp === p.grp ? p.grp : p.slotGrp + "*"}</span></span><span class="bot"><span class="sb"><i data-st="${p.id}" style="width:${Math.round(p.st)}%;background:${staminaCol(p.st)}"></i></span><span class="pc" data-stt="${p.id}">${Math.round(p.st)}</span></span></button>`;
      const out = S.xi.slice().sort((a, b) => ["POR", "DIF", "CEN", "ATT"].indexOf(a.slotGrp) - ["POR", "DIF", "CEN", "ATT"].indexOf(b.slotGrp));
      const bench = S.bench.filter((p) => !p.off);
      pan.innerHTML = `<div class="mdx-lbl">In campo <em>Tocca chi esce, poi chi entra · cambi ${S.maxSubs - S.subsUsed}/${S.maxSubs}</em></div>
        <div class="mdx-g2">${out.map((p) => row(p, "xi")).join("")}</div>
        <div class="mdx-lbl">In panchina <em>* = fuori ruolo (rende meno)</em></div>
        <div class="mdx-g2">${bench.length ? bench.map((p) => row(p, "bn")).join("") : '<div class="mdx-fx">Panchina vuota.</div>'}</div>`;
      pan.querySelectorAll("[data-xi]").forEach((b) => { b.onclick = () => { const p = S.xi.find((x) => x.id === Number(b.dataset.xi)); if (p.slotGrp === "POR") { toastMsg("Il portiere titolare non si cambia."); return; } S.selOut = S.selOut === p.id ? null : p.id; snd("playSelect"); renderPanel(); }; });
      pan.querySelectorAll("[data-bn]").forEach((b) => { b.onclick = () => doSub(Number(b.dataset.bn)); });
    } else {
      pan.innerHTML = `<div class="mdx-log">${S.log.map((l) => `<div class="${l.c}"><b>${l.m}'</b>${esc(l.t)}</div>`).join("")}</div>`;
    }
  }

  function toastMsg(t) { try { if (window.toast) window.toast(t, "info", "📋"); } catch (e) { /* noop */ } addLog(t, "tip"); }

  function setForm(f) {
    if (f === S.form || !formUnlocked(prog, f)) return;
    S.form = f; reassign(f);
    S.confuse = 3; S.stats.formChanges++;
    snd("playSelect");
    const adapted = S.xi.filter((p) => p.slotGrp !== p.grp && p.slotGrp !== "POR").map((p) => p.name.replace(" (C)", ""));
    addLog(`🔄 Nuovo modulo: ${f}.${adapted.length ? " Adattati fuori ruolo: " + adapted.join(", ") + "." : ""} La squadra è un po' disorientata (3').`, "tip");
    renderPanel();
  }

  function doSub(benchId) {
    if (S.selOut == null) { toastMsg("Scegli prima chi esce (tocca un giocatore in campo)."); return; }
    if (S.subsUsed >= S.maxSubs) { toastMsg("Hai finito i cambi."); return; }
    const out = S.xi.find((p) => p.id === S.selOut), inn = S.bench.find((p) => p.id === benchId);
    if (!out || !inn) return;
    inn.slotGrp = out.slotGrp; inn.x = out.x; inn.y = out.y; inn.st = Math.min(100, Math.max(inn.st, 92));
    out.off = true; S.bench.push(Object.assign(out, { off: true }));
    S.xi[S.xi.indexOf(out)] = inn;
    inn.bench = false; S.bench = S.bench.filter((p) => p !== inn);
    S.subsUsed++; S.selOut = null;
    S.morale = clamp(S.morale + 1, 0, 100);
    const oop = inn.grp !== inn.slotGrp ? " (fuori ruolo)" : "";
    addLog(`🔁 Cambio: esce ${out.name.replace(" (C)", "")}, entra ${inn.name}${oop}.`, "tip");
    snd("playSelect");
    renderPanel(); refreshLive();
  }

  // ---------------------------------------------------------------- aggiornamenti UI
  function updateScoreboard() {
    if (!root || !S) return;
    const sc = root.querySelector("#mdxSc"); if (!sc) return;
    sc.textContent = `${S.scoreA} - ${S.scoreB}`;
    root.querySelector("#mdxMin").textContent = S.ended ? "FINE" : `${S.min}'`;
    root.querySelector("#mdxPr").style.width = (S.min / 90 * 100) + "%";
  }
  function updateTicker() {
    const t = root && root.querySelector("#mdxTick"); if (!t || !S) return;
    t.innerHTML = S.log.slice(0, 2).map((l) => `<div>${l.m}' ${esc(l.t)}</div>`).join("");
  }
  function refreshLive() {
    if (!root || !S) return;
    const play = root.querySelector("#mdxPlay"); if (!play) return;
    play.textContent = S.run ? "❚❚" : "▶";
    root.querySelectorAll("[data-sp]").forEach((b) => b.classList.toggle("on", Number(b.dataset.sp) === S.speed));
    const to = root.querySelector("#mdxTO");
    to.textContent = "⏱ " + S.timeouts; to.disabled = !(S.timeouts > 0 && S.started && S.min < 89 && !S.ended);
    const pa = S.posTotal ? Math.round(S.posA / S.posTotal * 100) : 50;
    const strip = root.querySelector("#mdxStrip");
    strip.innerHTML = `<div>Possesso ${pa}%<div class="pb"><i style="width:${pa}%"></i></div></div><div>Tiri ${S.shotsA}-${S.shotsB}</div><div>xG ${S.xgA.toFixed(1)}-${S.xgB.toFixed(1)}</div><div>Morale ${Math.round(S.morale)}<div class="pb" style="background:#1c2b44"><i style="width:${S.morale}%;background:${S.morale > 60 ? "#4ade80" : S.morale > 35 ? "#facc15" : "#f87171"}"></i></div></div>`;
    if (tab === "squadra") S.xi.concat(S.bench).forEach((p) => {
      const b = root.querySelector(`[data-st="${p.id}"]`); if (b) { b.style.width = Math.round(p.st) + "%"; b.style.background = staminaCol(p.st); }
      const t = root.querySelector(`[data-stt="${p.id}"]`); if (t) t.textContent = Math.round(p.st);
    });
  }

  // ---------------------------------------------------------------- loop
  function startLoop() { stopLoop(); lastT = performance.now(); rafId = requestAnimationFrame(loop); }
  function stopLoop() { if (rafId) cancelAnimationFrame(rafId); rafId = 0; }

  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (!S || !ctx) return;
    const dt = Math.min(0.05, (t - lastT) / 1000); lastT = t;
    tick(dt);
    draw(dt);
  }

  function tick(dt) {
    if (S.run && !S.over && !S.ended) {
      const ms = STEP_MS[S.speed] || 1400;
      if (S.needStep) {
        const ev = S.events[S.evIdx];
        if (ev && ev.min <= S.min + 1) { S.evIdx++; openEvent(ev); return; }
        stepMinute(); S.needStep = false; S.acc = 0;
      }
      S.acc += dt * 1000;
      S.frac = clamp(S.acc / ms, 0, 1);
      S.pend = S.pend.filter((e) => { if (S.frac >= e.f) { e.fn(); return false; } return true; });
      if (S.frac >= 1) endMinute();
    }
    // movimento
    layout();
    const k = Math.min(1, dt * (S.run ? 3.2 : 2));
    S.xi.concat(S.oppXI).forEach((p) => { p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k; });
    S.ball = ballPos();
    // coriandoli e testi
    S.parts = S.parts.filter((p) => { p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; return p.life > 0; });
    if (S.banner) { S.banner.life -= dt; if (S.banner.life <= 0) S.banner = null; }
    if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 22);
  }

  function endMinute() {
    S.pend.forEach((e) => e.fn()); S.pend = [];
    S.rest = { x: S.ball.x, y: S.ball.y };
    S.needStep = true; S.frac = 0; S.acc = 0;
    if (S.min >= 90) { finishMatch(); return; }
    if (S.min === 45 && !S.htDone) { S.htDone = true; openHalftime(); }
  }

  // ---------------------------------------------------------------- eventi/intervallo
  function openEvent(ev) {
    const rid = routeEvent(ev);
    if (!rid) return; // nessun imprevisto adatto adesso
    const def = EVENTS[rid];
    S.over = true;
    snd("playWhistle", false);
    S.banner = { t: def.title.length < 20 ? def.title : "EPISODIO", sub: "", col: "#c4b5fd", life: 1.6 };
    addLog(`${def.ico} ${def.title}`, "ev");
    openSheet(`<h2>${def.ico} ${esc(def.title)}</h2><p>${esc(def.text())}</p>
      ${def.ch.map((c, i) => `<button class="mdx-btn mdx-ch" data-c="${i}" ${c.dis && c.dis() ? "disabled" : ""}>${esc(c.t)}<small>${esc(typeof c.s === "string" ? c.s : "")}</small></button>`).join("")}`);
    sheetEl.querySelectorAll("[data-c]").forEach((b) => {
      b.onclick = () => {
        const c = def.ch[Number(b.dataset.c)];
        snd("playSelect");
        const prevTab = tab;
        let res = "";
        try { res = c.go(); } catch (e) { res = "Il Mister ha deciso. Si riparte."; }
        if (res) addLog(res, "ev");
        updateScoreboard(); refreshLive();
        openSheet(`<h2>${def.ico} ${esc(def.title)}</h2><div class="mdx-res">${esc(res)}</div>
          <p style="color:#93a4bd;font-size:12.5px">Morale squadra: ${Math.round(S.morale)}/100</p>
          <button class="mdx-btn gold mdx-ch" id="mdxCont">Avanti</button>`);
        sheetEl.querySelector("#mdxCont").onclick = () => { closeSheet(); S.over = false; renderPanel(); };
        void prevTab;
      };
    });
  }

  function openHalftime() {
    S.over = true; S.run = true; // resta "run" per ripartire dopo la scelta
    snd("playWhistle", true);
    S.xi.forEach((p) => { p.st = Math.min(100, p.st + 8); });
    S.oppStam = Math.min(100, S.oppStam + 8);
    const lose = S.scoreA < S.scoreB, win = S.scoreA > S.scoreB;
    addLog(`🔔 Intervallo: Rondine ${S.scoreA}-${S.scoreB} ${S.opp.short}.`, "tip");
    const speeches = [
      { t: "«Calma. Rifacciamo tutto con ordine.»", s: "Sicuro: morale +4", go: () => { S.morale = clamp(S.morale + 4, 0, 100); return "Voce bassa, schemi chiari. La squadra rientra concentrata. Morale +4."; } },
      { t: "«Che vi siete mangiati, il pesce di ieri?»", s: "Funziona se sei sotto o pari (+10), se vinci li irrita (-3)", go: () => { if (win) { S.morale = clamp(S.morale - 3, 0, 100); return "Ma stiamo vincendo, Mister... I ragazzi ti guardano storto. Morale -3."; } S.morale = clamp(S.morale + 10, 0, 100); return "Il ceffone verbale funziona: occhi di brace. Morale +10."; } },
      { t: "«Ricordate perché giochiamo: Settimio e il suo campo.»", s: "Commovente: morale +6, energia +4", go: () => { S.morale = clamp(S.morale + 6, 0, 100); S.xi.forEach((p) => { p.st = Math.min(100, p.st + 4); }); return "Settimio, custode del vecchio stadio dal '62, lo ripete da una vita: «Il pallone è di tutti, anche di chi non lo prende». Qualcuno si soffia il naso. Morale +6, energia +4."; } },
      { t: "Battuta sul fischietto dell'arbitro", s: "60% scoppiano a ridere (+8), 40% gelo (-2)", go: () => { if (rnd() < 0.6) { S.morale = clamp(S.morale + 8, 0, 100); return "Risate liberatorie nello spogliatoio. Morale +8."; } S.morale = clamp(S.morale - 2, 0, 100); return "Nessuno ride. Sandro tossisce. Morale -2."; } }
    ];
    openSheet(`<h2>🔔 Intervallo · ${S.scoreA}-${S.scoreB}</h2>
      <div><span class="mdx-chip">Tiri ${S.shotsA}-${S.shotsB}</span><span class="mdx-chip">xG ${S.xgA.toFixed(1)}-${S.xgB.toFixed(1)}</span><span class="mdx-chip">Possesso ${S.posTotal ? Math.round(S.posA / S.posTotal * 100) : 50}%</span><span class="mdx-chip g">Energia +8</span></div>
      <p>${lose ? "Siamo sotto e lo spogliatoio è muto." : win ? "Si vince, ma nessuno si fida." : "Pari e patta: chi la spunta nel secondo tempo?"} Cosa dici alla squadra?</p>
      ${speeches.map((c, i) => `<button class="mdx-btn mdx-ch" data-c="${i}">${esc(c.t)}<small>${esc(c.s)}</small></button>`).join("")}
      <p style="font-size:12px;color:#93a4bd;margin-top:10px">Puoi anche modificare Ordini e Squadra dopo il discorso, prima di far ripartire.</p>`);
    sheetEl.querySelectorAll("[data-c]").forEach((b) => {
      b.onclick = () => {
        snd("playSelect");
        const res = speeches[Number(b.dataset.c)].go();
        addLog("🗣️ " + res, "ev");
        openSheet(`<h2>🗣️ Il discorso</h2><div class="mdx-res">${esc(res)}</div><p style="font-size:12.5px;color:#93a4bd">Morale: ${Math.round(S.morale)}/100. Cambi o ordini? Chiudi questa finestra, poi tocca ▶ quando sei pronto.</p>
          <div class="mdx-g2"><button class="mdx-btn" id="mdxPause2">Rivedo la squadra</button><button class="mdx-btn gold" id="mdxResume">Secondo tempo!</button></div>`);
        sheetEl.querySelector("#mdxPause2").onclick = () => { closeSheet(); S.over = false; S.run = false; tab = "squadra"; renderPanel(); refreshLive(); };
        sheetEl.querySelector("#mdxResume").onclick = () => { closeSheet(); S.over = false; S.run = true; snd("playWhistle", false); addLog("🔔 Si riparte!", "tip"); renderPanel(); refreshLive(); };
      };
    });
  }

  // ---------------------------------------------------------------- fine partita
  function finishMatch() {
    S.ended = true; S.run = false; S.over = true;
    stopLoopSoft();
    snd("playWhistle", true);
    const o = S.opp;
    const win = S.scoreA > S.scoreB, draw = S.scoreA === S.scoreB;
    const before = { rank: rankOf(prog.pts), wins: prog.wins, opps: OPPS.map((_, i) => oppUnlocked(prog, i)), kits: KITS.filter((k) => k.need(prog)).map((k) => k.id), arr: ARRIVALS.filter((a) => arrivalHas(prog, a.id)).map((a) => a.id), seasons: SEASONS.map((x) => seasonDone(prog, x.id)), pStars: OPPS.map((_, i) => 0) };
    const margin = S.scoreA - S.scoreB;
    const s2 = win && (margin >= 2 || S.scoreB === 0);
    const goalMet = !!(o.check ? o.check(S) : GOAL_CHECK[o.id](S));
    const s3 = win && goalMet;
    const nStars = (win ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0);
    const e = prog.opp[o.id] || { stars: 0, wins: 0, played: 0, best: "" };
    const oldStars = e.stars;
    e.played++; if (win) e.wins++;
    const score = `${S.scoreA}-${S.scoreB}`;
    if (win && (!e.best || (S.scoreA - S.scoreB) > bestMargin(e.best))) e.best = score; else if (!e.best) e.best = score;
    e.stars = Math.max(e.stars, nStars);
    prog.opp[o.id] = e;
    prog.played++; prog.gf += S.scoreA; prog.ga += S.scoreB;
    if (win) prog.wins++; else if (draw) prog.draws++; else prog.losses++;
    const gained = (win ? 3 : draw ? 1 : 0) + Math.max(0, nStars - oldStars);
    prog.pts += gained;
    prog.lastForm = S.form; prog.lastMent = S.ment; prog.lastPress = S.press;
    let coin = 0;
    if (win && !prog.coins[o.id] && typeof window.addCoins === "function") { try { const n = o.coin || 3; window.addCoins(n); coin = n; prog.coins[o.id] = true; } catch (er) { /* noop */ } }
    saveProg(prog);

    // pagella
    const played = S.squad.filter((p) => p.mins >= 15 || (p.grp === "POR"));
    const cleanSheet = S.scoreB === 0;
    const ratings = played.map((p) => {
      let v = 6 + p.goals * 1.1 + p.assists * 0.6 + p.saves * 0.2 + p.bonus + (win ? 0.4 : draw ? 0.1 : -0.3) + (rnd() - 0.5) * 0.7;
      if (p.slotGrp === "POR" && cleanSheet) v += 0.6;
      if (p.slotGrp === "DIF" && cleanSheet) v += 0.3;
      if (p.slotGrp === "DIF" && S.scoreB >= 3) v -= 0.5;
      if (p.mins < 40 && p.grp !== "POR") v = 5.8 + (v - 6) * 0.5;
      return { p, v: clamp(Math.round(v * 10) / 10, 4.5, 10) };
    }).sort((a, b) => b.v - a.v);
    const mvp = ratings[0];

    const afterRank = rankOf(prog.pts);
    const news = [];
    if (afterRank > before.rank) news.push(`🧢 Promozione: ora sei <b>${esc(RANKS[afterRank].t)}</b>!`);
    Object.keys(FORMS).forEach((f) => { const u = FORMS[f].unlock; if (u && before.wins < u.wins && prog.wins >= u.wins) news.push(`🔓 Nuovo modulo sbloccato: <b>${f}</b>`); });
    OPPS.forEach((op, i) => { if (!before.opps[i] && oppUnlocked(prog, i)) news.push(`🔓 Nuovo episodio: <b>${esc(op.name)}</b>`); });
    ARRIVALS.forEach((a) => { if (!before.arr.includes(a.id) && arrivalHas(prog, a.id)) news.push(`👕 Nuovo in rosa: <b>${esc(a.name)}</b> (${a.grp}, ${a.r})`); });
    KITS.forEach((k) => { if (!before.kits.includes(k.id) && k.need(prog)) news.push(`🎽 Nuova maglia: <b>${esc(k.name)}</b>`); });
    const seasonJust = SEASONS.find((x) => !before.seasons[x.id] && seasonDone(prog, x.id));
    if (seasonJust) news.push(`${seasonJust.ico} Stagione completata: <b>${esc(seasonJust.trophy)}</b>. La rosa cresce: +2 a tutti!`);
    const nIdx = OPPS.indexOf(o) + 1, nxtO = OPPS[nIdx];
    if (win && nxtO && !oppUnlocked(prog, nIdx) && nxtO.needStars) news.push(`⭐ La finale di stagione richiede ${nxtO.needStars} stelle: ne hai ${seasonStars(prog, nxtO.season)}. Rigioca gli episodi per raccoglierne altre.`);
    if (coin) news.push(`🪙 Prima vittoria su ${esc(o.short)}: <b>+${coin} monete</b>`);

    const stRes = o.story ? (win ? o.story.win : draw ? SEASON_DRAW[o.season] || SEASON_DRAW[0] : o.story.lose) : null;
    const prom = S.promise ? (win ? "La cena in trattoria promessa al Presidente? Offre Dina, stavolta." : "La cena promessa è rimandata. Dina ha già cancellato la prenotazione.") : "";
    const headline = win ? pick(["VITTORIA! Il Borgo canta.", "TRE PUNTI! Il molo applaude.", "Vittoria da Mister vero."]) : draw ? pick(["Pareggio: nessuno è contento, nessuno è triste.", "Un punto a testa e tanto fiatone."]) : pick(["Sconfitta. Domani si riparte.", "Ko. Le lacrime però sono pulite."]);
    const canNext = win && nxtO && oppUnlocked(prog, nIdx), fromBorgo = openOpts && openOpts.from === "borgo";
    openSheet(`<div style="font-size:12px;color:#93a4bd;text-align:center">${esc(o.name)} · Fischio finale</div>
      <div class="mdx-big">${S.scoreA} - ${S.scoreB}</div>
      <h2 style="text-align:center">${esc(headline)}</h2>
      <div style="text-align:center;font-size:24px;margin:2px 0">${stars(nStars)}</div>
      <div style="text-align:center">
        <span class="mdx-chip ${win ? "g" : ""}">★ Vittoria</span><span class="mdx-chip ${s2 ? "g" : ""}">★★ 2 gol di scarto o porta inviolata</span><span class="mdx-chip ${s3 ? "g" : ""}">★★★ ${esc(o.goal)}</span>
      </div>
      ${stRes ? storyBox(stRes, win ? "win" : draw ? "" : "lose") : ""}
      ${win && seasonJust ? storyBox(seasonJust.outro, "win") : ""}
      ${prom ? `<div class="mdx-res">${esc(prom)}</div>` : ""}
      ${news.length ? `<div class="mdx-res">${news.join("<br>")}</div>` : ""}
      <div class="mdx-res">+${gained} punti Mister · Tiri ${S.shotsA}-${S.shotsB} · xG ${S.xgA.toFixed(1)}-${S.xgB.toFixed(1)} · Possesso ${S.posTotal ? Math.round(S.posA / S.posTotal * 100) : 50}%</div>
      <div class="mdx-lbl">Pagella</div>
      ${ratings.map((r, i) => `<div class="mdx-pg"><i class="${i === 0 ? "mvp" : r.v >= 7 ? "hi" : r.v < 5.5 ? "lo" : ""}">${r.v.toFixed(1)}</i><span>${esc(r.p.name)}${i === 0 ? " ⭐ MVP" : ""}</span><small>${r.p.goals ? "⚽" + r.p.goals + " " : ""}${r.p.assists ? "🅰️" + r.p.assists + " " : ""}${r.p.saves && r.p.slotGrp === "POR" ? "🧤" + r.p.saves : ""}</small></div>`).join("")}
      <div class="mdx-g2" style="margin-top:12px"><button class="mdx-btn" id="mdxMenu">Menu episodi</button><button class="mdx-btn ${canNext ? "" : "gold"}" id="mdxAgain">Rivincita</button></div>
      ${canNext ? `<button class="mdx-btn gold" id="mdxNextEp" style="width:100%;margin-top:8px">▶ Prossimo episodio: ${esc(nxtO.name)}</button>` : ""}
      <button class="mdx-btn" id="mdxLeave2" style="width:100%;margin-top:8px">${fromBorgo ? "Torna al Borgo" : "Esci"}</button>`, true);
    if (canNext) sheetEl.querySelector("#mdxNextEp").onclick = () => startPrep(nxtO);
    void mvp;
    sheetEl.querySelector("#mdxMenu").onclick = showMenu;
    sheetEl.querySelector("#mdxAgain").onclick = () => startPrep(o);
    sheetEl.querySelector("#mdxLeave2").onclick = exitAll;
    updateScoreboard();
    refreshLive();
  }
  function bestMargin(s) { const m = /^(\d+)-(\d+)$/.exec(s || ""); return m ? Number(m[1]) - Number(m[2]) : -99; }
  function stopLoopSoft() { /* il loop continua per animare il campo finale */ }

  // ---------------------------------------------------------------- disegno
  function draw(dt) {
    const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
    if (!cssW) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cw !== cssW * dpr) { canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr); cw = cssW * dpr; }
    const sc = cssW / W;
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, 0, 0);
    ctx.save();
    if (S.shake > 0) ctx.translate((rnd() - 0.5) * S.shake, (rnd() - 0.5) * S.shake);
    drawPitch();
    drawZones();
    // scia passaggi
    const P = S.path;
    if (P && S.run) {
      ctx.strokeStyle = P.team === "A" ? "rgba(125,211,252,.55)" : "rgba(252,165,165,.5)";
      ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
      ctx.moveTo(P.start.x, P.start.y);
      P.nodes.forEach((n) => { if (S.frac >= n.f - 0.001) ctx.lineTo(n.p.x, n.p.y); });
      ctx.stroke(); ctx.setLineDash([]);
    }
    S.oppXI.forEach((p) => drawPlayer(p, "B"));
    S.xi.forEach((p) => drawPlayer(p, "A"));
    // palla
    const b = S.ball;
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(b.x + 1, b.y + 5, 5, 2, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, 7); ctx.fill();
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1.2; ctx.stroke();
    // coriandoli
    S.parts.forEach((p) => { ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 4, 4); });
    ctx.restore();
    // banner
    if (S.banner) {
      const bn = S.banner, a = clamp(bn.life / 0.5, 0, 1), sz = 30 + Math.max(0, bn.life - 1.6) * 20;
      ctx.globalAlpha = a; ctx.textAlign = "center";
      ctx.fillStyle = "rgba(0,0,0,.55)"; ctx.fillRect(0, H / 2 - 34, W, 68);
      ctx.fillStyle = bn.col; ctx.font = `900 ${sz}px system-ui,sans-serif`; ctx.fillText(bn.t, W / 2, H / 2 + 6);
      if (bn.sub) { ctx.fillStyle = "#fff"; ctx.font = "700 14px system-ui,sans-serif"; ctx.fillText(bn.sub, W / 2, H / 2 + 26); }
      ctx.globalAlpha = 1;
    }
    // etichetta in pausa
    if (!S.run && !S.over && !S.ended) {
      ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(W / 2 - 80, 8, 160, 22);
      ctx.fillStyle = "#facc15"; ctx.font = "800 12px system-ui,sans-serif"; ctx.textAlign = "center"; ctx.fillText(S.started ? "⏸ PAUSA · puoi dare ordini" : "▶ tocca play per iniziare", W / 2, 23);
    }
  }

  function drawPitch() {
    ctx.fillStyle = "#1c4a2c"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 9; i++) { if (i % 2) { ctx.fillStyle = "#215633"; ctx.fillRect(0, i * H / 9, W, H / 9); } }
    ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.lineWidth = 2;
    ctx.strokeRect(10, 8, W - 20, H - 16);
    ctx.beginPath(); ctx.moveTo(10, H / 2); ctx.lineTo(W - 10, H / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 38, 0, 7); ctx.stroke();
    ctx.strokeRect(W / 2 - 80, 8, 160, 52); ctx.strokeRect(W / 2 - 80, H - 60, 160, 52);
    ctx.strokeRect(W / 2 - 34, 8, 68, 20); ctx.strokeRect(W / 2 - 34, H - 28, 68, 20);
    ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.fillRect(W / 2 - 28, 2, 56, 7); ctx.fillRect(W / 2 - 28, H - 9, 56, 7);
  }

  function drawZones() {
    // pressing e mentalità visibili
    const t = performance.now() / 1000;
    if (S.press === "alto") {
      ctx.fillStyle = "rgba(56,189,248,.10)"; ctx.fillRect(10, 8, W - 20, H / 2 - 8);
      ctx.fillStyle = "rgba(125,211,252,.55)"; ctx.font = "800 15px system-ui"; ctx.textAlign = "center";
      for (let i = 0; i < 4; i++) ctx.fillText("▲", 60 + i * 93, 52 + ((t * 20 + i * 9) % 18) * -1 + 18);
    } else if (S.press === "basso") {
      ctx.fillStyle = "rgba(148,163,184,.10)"; ctx.fillRect(10, H / 2, W - 20, H / 2 - 8);
    }
    if (S.ment === "allin" || S.ment === "offensiva") {
      ctx.fillStyle = "rgba(251,146,60,.07)"; ctx.fillRect(10, 8, W - 20, H - 16);
    }
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.font = "700 9px system-ui"; ctx.textAlign = "left";
    ctx.fillText(`${S.form} · ${MENT[S.ment].t} · press ${PRESS[S.press].t}`, 14, H - 12);
    ctx.textAlign = "right"; ctx.fillText(S.opp.short + " " + S.opp.form, W - 14, 18);
  }

  function drawPlayer(p, team) {
    const o = S.opp;
    const kit = KITS.find((k) => k.id === prog.kit) || KITS[0];
    const col = team === "A" ? kit.k : o.col2, ring = team === "A" ? kit.k2 : o.col;
    const r = 10;
    const isGK = p.slotGrp === "POR";
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 8, 9, 3, 0, 0, 7); ctx.fill();
    // anello energia
    if (team === "A" && !isGK) {
      ctx.strokeStyle = staminaCol(p.st); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, r + 2.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (p.st / 100)); ctx.stroke();
    }
    ctx.fillStyle = isGK ? (team === "A" ? "#ca8a04" : "#475569") : col;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = ring; ctx.lineWidth = 1.6; ctx.stroke();
    if (S.selOut === p.id) { ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(p.x, p.y, r + 6, 0, 7); ctx.stroke(); }
    ctx.fillStyle = "#fff"; ctx.font = "800 10px system-ui,sans-serif"; ctx.textAlign = "center";
    ctx.fillText(String(p.num), p.x, p.y + 3.5);
    if (team === "A" && S.carrier === p && S.run) {
      ctx.fillStyle = "#fff"; ctx.font = "700 9px system-ui"; ctx.fillText(p.name.replace(" (C)", ""), p.x, p.y - 15);
    }
  }

  // ---------------------------------------------------------------- uscita / apertura
  function onKey(e) { if (e.key === "Escape" && root) { if (S && !S.ended) confirmExit(); else exitAll(); } }
  function onVis() { if (document.hidden && S && S.run) { S.run = false; refreshLive(); } }

  function teardown() {
    stopLoop();
    listeners.splice(0).forEach(([t, ev, fn, opt]) => { try { t.removeEventListener(ev, fn, opt); } catch (e) { /* noop */ } });
    if (root) { root.remove(); root = null; }
    const st = document.getElementById(STYLE_ID); if (st) st.remove();
    style = null; canvas = null; ctx = null; sheetEl = null; S = null;
  }

  function exitAll() {
    const cb = onExitCb; onExitCb = null;
    teardown();
    if (typeof cb === "function") { try { cb(); } catch (e) { console.error(e); } }
  }

  function open(onExit, opts) {
    if (root) teardown(); // riapertura: niente doppio callback
    onExitCb = onExit;
    openOpts = opts || null;
    injectStyle();
    prog = loadProg();
    root = document.createElement("div");
    root.id = "matchDirectorModal";
    root.className = "mdx-root";
    document.body.appendChild(root);
    listen(document, "keydown", onKey);
    listen(document, "visibilitychange", onVis);
    const o = opts && opts.opp ? OPPS.find((x) => x.id === opts.opp) : null;
    if (o && oppUnlocked(prog, OPPS.indexOf(o))) { showMenu(); startPrep(o); }
    else if (opts && opts.screen === "locker") showLocker();
    else showMenu();
  }
  window.openMatchDirectorHD = function (onExit) { open(onExit, null); };

  // ---------------------------------------------------------------- API per il Borgo camminabile e per i test
  function stateInfo() {
    const p = loadProg(), ni = nextEpisodeIdx(p), fu = firstUnwon(p);
    return {
      version: 2, played: p.played, wins: p.wins, draws: p.draws, losses: p.losses, pts: p.pts, rank: RANKS[rankOf(p.pts)].t, stars: totalStars(p),
      total: OPPS.length, won: OPPS.filter((o) => oppWon(p, o.id)).length, unlocked: OPPS.filter((_, i) => oppUnlocked(p, i)).length,
      unread: unreadCount(p), seasonsDone: seasonsDone(p), season: fu >= 0 ? OPPS[fu].season : SEASONS.length - 1, blocked: fu >= 0 && ni < 0,
      seasonTitle: fu >= 0 ? SEASONS[OPPS[fu].season].t : "Completato", next: ni >= 0 ? { id: OPPS[ni].id, ep: OPPS[ni].ep, name: OPPS[ni].name } : null,
      roster: ARRIVALS.filter((a) => arrivalHas(p, a.id)).length, rosterTotal: ARRIVALS.length, kit: p.kit
    };
  }
  window.__directorHd = {
    version: 2,
    start: function (o) { o = o || {}; open(o.onExit, { opp: o.opp, screen: o.screen, from: o.from }); },
    state: stateInfo,
    episodes: function () { const p = loadProg(); return OPPS.map((x, i) => ({ id: x.id, ep: x.ep, season: x.season, name: oppUnlocked(p, i) ? x.name : "???", open: oppUnlocked(p, i), stars: (p.opp[x.id] || {}).stars || 0 })); },
    // simulazione senza interfaccia (taratura): n partite contro l'episodio con una strategia semplice
    sim: function (id, n, strat, asIfProg) { return simulate(id, n || 1, strat || "base", asIfProg); }
  };

  if (/[?&]debug\b/.test(location.search || "")) window.__directorHd._S = function () { return S; };

  // ---------------------------------------------------------------- simulatore headless (solo test di bilanciamento)
  function simulate(id, n, strat, asIf) {
    const o = OPPS.find((x) => x.id === id); if (!o) return null;
    const saveProgBak = prog, saveS = S, tabBak = tab;
    let p = defaultProg();
    const idx = OPPS.indexOf(o);
    if (asIf !== false) OPPS.slice(0, idx).forEach((x) => { p.opp[x.id] = { stars: 1, wins: 1, played: 1, best: "1-0" }; });
    p.wins = Math.max(0, idx);
    const res = { w: 0, d: 0, l: 0, gf: 0, ga: 0, s2: 0, s3: 0 };
    for (let k = 0; k < n; k++) {
      prog = p;
      newMatch(o, strat === "attack" ? "4-3-3" : strat === "smart" ? "4-4-2" : "4-3-3", "equil", "medio");
      S.started = true;
      let evI = 0, halfDone = false;
      while (S.min < 90) {
        const ev = S.events[evI];
        if (ev && ev.min <= S.min + 1) {
          evI++;
          const rid = routeEvent(ev);
          if (rid) { const def = EVENTS[rid]; const ch = def.ch.filter((c) => !(c.dis && c.dis())); const c = ch[0] || def.ch[0]; try { c.go(); } catch (e) { /* noop */ } if (S.selOut != null) S.selOut = null; }
        }
        if (strat === "smart" && S.min === 50) { S.ment = S.scoreA < S.scoreB ? "offensiva" : S.scoreA > S.scoreB ? "prudente" : "equil"; S.press = "medio"; }
        if (strat === "smart" && S.min === 70 && S.scoreA < S.scoreB) { S.ment = "allin"; S.press = "alto"; }
        stepMinute();
        S.pend.forEach((e) => e.fn()); S.pend = [];
        if (S.min === 45 && !halfDone) { halfDone = true; S.xi.forEach((q) => { q.st = Math.min(100, q.st + 8); }); S.morale = clamp(S.morale + 4, 0, 100); }
      }
      res.gf += S.scoreA; res.ga += S.scoreB;
      const win = S.scoreA > S.scoreB;
      if (win) res.w++; else if (S.scoreA === S.scoreB) res.d++; else res.l++;
      if (win && (S.scoreA - S.scoreB >= 2 || S.scoreB === 0)) res.s2++;
      if (win && !!(o.check ? o.check(S) : GOAL_CHECK[o.id](S))) res.s3++;
    }
    prog = saveProgBak; S = saveS; tab = tabBak;
    res.winPct = Math.round(res.w / n * 100); res.avgGF = +(res.gf / n).toFixed(2); res.avgGA = +(res.ga / n).toFixed(2);
    return res;
  }
})();
