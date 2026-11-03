// js/director-carriera-dati.js - Database per "Director · Carriera del Golfo"
// Squadre, divisioni, rosa iniziale, eventi narrativi e conferenze stampa
(function () {
  "use strict";

  const DIVISIONS = [
    {
      id: 0,
      name: "Serie C del Golfo",
      short: "Serie C",
      ico: "⚓",
      sub: "Baie e Scogli · Campi polverosi e tanta grinta",
      relegation: false,
      promotion: 2,
      teams: [
        { id: "rondine", name: "Rondine FC", short: "Rondine", ico: "🕊️", col: "#1d4ed8", col2: "#bae6fd", lvl: 0.98, atk: 1.0, def: 0.98, names: ["Leo Moretti", "Dario Moretti", "Chicco", "Mino", "Sandro"] },
        { id: "gabbiani", name: "Gabbiani del Porto", short: "Gabbiani", ico: "🕊️", col: "#e2e8f0", col2: "#64748b", lvl: 0.96, atk: 0.96, def: 0.94, names: ["Pippo Sala", "Remo Vento", "Orso Bini", "Gigi Ancora", "Tazio Nasse"] },
        { id: "corsari", name: "Corsari di Scoglio Nero", short: "Corsari", ico: "🏴‍☠️", col: "#fca5a5", col2: "#7f1d1d", lvl: 0.97, atk: 1.01, def: 0.95, names: ["Capitan Uncino", "Brando Ruggine", "Tizzo Ancora", "Moro Catena"] },
        { id: "dragoni", name: "Dragoni della Diga", short: "Dragoni", ico: "🐉", col: "#86efac", col2: "#14532d", lvl: 0.98, atk: 0.88, def: 1.10, names: ["Gorgo Muro", "Piero Diga", "Ugo Molo", "Sasso Bianco"] },
        { id: "fanfara", name: "Fanfara del Mercato", short: "Fanfara", ico: "🎺", col: "#fcd34d", col2: "#92400e", lvl: 0.97, atk: 1.05, def: 0.91, names: ["Gaspare Cassetta", "Totò Banco", "Rino Arancia", "Mimmo Bilancia"] },
        { id: "lanterne", name: "Lanterne di Cala Fosca", short: "Lanterne", ico: "🏮", col: "#fde68a", col2: "#78350f", lvl: 0.98, atk: 0.98, def: 0.99, names: ["Remo Lume", "Pino Seppia", "Totano", "Fanale"] },
        { id: "cantiere", name: "Cantiere Navale 1904", short: "Cantiere", ico: "⚓", col: "#fdba74", col2: "#7c2d12", lvl: 0.99, atk: 0.98, def: 1.02, names: ["Chiodo", "Scalo", "Martello", "Bitta", "Carena"] },
        { id: "scogli", name: "Scogli Rossi di Capo Vela", short: "Scogli Rossi", ico: "🦀", col: "#fca5a5", col2: "#991b1b", lvl: 1.00, atk: 0.92, def: 1.07, names: ["Granchio", "Chela", "Capo", "Vela", "Scoglio"] }
      ]
    },
    {
      id: 1,
      name: "Serie B del Golfo",
      short: "Serie B",
      ico: "🌊",
      sub: "La Riviera · Squadre organizzate e trasferte insidiose",
      relegation: 2,
      promotion: 2,
      teams: [
        { id: "tonnara", name: "Tonnara United", short: "Tonnara", ico: "🐟", col: "#93c5fd", col2: "#1e3a8a", lvl: 1.02, atk: 1.03, def: 1.00, names: ["Tonno", "Rete", "Amo", "Boa", "Mattanza"] },
        { id: "settimio_fc", name: "Vecchie Glorie del Molo", short: "Vecchie Glorie", ico: "👴", col: "#e7e5e4", col2: "#57534e", lvl: 1.01, atk: 1.01, def: 0.97, names: ["Senior", "Ricordo", "Baffo", "Fiocco", "Molo"] },
        { id: "mastri", name: "Mastri d'Ascia di Porto Sole", short: "Mastri d'Ascia", ico: "🔨", col: "#d6b98c", col2: "#44301a", lvl: 1.03, atk: 1.00, def: 1.06, names: ["Ascia", "Chiglia", "Pialla", "Sega", "Quercia"] },
        { id: "nebbia", name: "Fantasmi della Nebbia", short: "Fantasmi", ico: "🌫️", col: "#cbd5e1", col2: "#334155", lvl: 1.04, atk: 0.95, def: 1.10, names: ["Nebbia", "Ombra", "Brina", "Velo", "Foschia"] },
        { id: "gozzi", name: "Gozzi di Baia Lunga", short: "Gozzi", ico: "⛵", col: "#7dd3fc", col2: "#0c4a6e", lvl: 1.03, atk: 1.04, def: 1.01, names: ["Gozzo", "Remo", "Vela", "Prua", "Ormeggio"] },
        { id: "vignaioli", name: "Vignaioli di Costa Alta", short: "Vignaioli", ico: "🍇", col: "#c4b5fd", col2: "#4c1d95", lvl: 1.05, atk: 1.03, def: 1.01, names: ["Vigna", "Tralcio", "Botte", "Mosto", "Grappolo"] },
        { id: "cormorani", name: "Cormorani di Isola Piccola", short: "Cormorani", ico: "🐦", col: "#a5b4fc", col2: "#1e1b4b", lvl: 1.04, atk: 1.05, def: 0.99, names: ["Cormorano", "Tuffo", "Ala", "Penna", "Becco"] },
        { id: "ormeggiatori", name: "Ormeggiatori di Porto Vecchio", short: "Ormeggiatori", ico: "🪢", col: "#fdba74", col2: "#9a3412", lvl: 1.06, atk: 0.98, def: 1.09, names: ["Cima", "Gomena", "Nodo", "Bitta", "Cavo"] }
      ]
    },
    {
      id: 2,
      name: "Eccellenza del Golfo",
      short: "Eccellenza",
      ico: "👑",
      sub: "I Signori del Mare · Il massimo palcoscenico della costa",
      relegation: 2,
      promotion: 0,
      teams: [
        { id: "squali", name: "Squali di Punta Nera", short: "Squali", ico: "🦈", col: "#94a3b8", col2: "#0f172a", lvl: 1.09, atk: 1.08, def: 1.03, names: ["Dente", "Pinna", "Nero", "Squalo", "Catino"] },
        { id: "faro_est", name: "Guardiani del Faro Est", short: "Guardiani", ico: "🔦", col: "#fef08a", col2: "#713f12", lvl: 1.08, atk: 1.09, def: 1.04, names: ["Faro", "Lanterna", "Raggio", "Luce", "Fanale"] },
        { id: "libeccio", name: "Libeccio Calcio", short: "Libeccio", ico: "🌬️", col: "#86efac", col2: "#166534", lvl: 1.10, atk: 1.07, def: 1.06, names: ["Libeccio", "Vento", "Bussola", "Raffica", "Scirocco"] },
        { id: "lupi_mare", name: "Lupi di Mare della Costa", short: "Lupi di Mare", ico: "🐺", col: "#a8a29e", col2: "#292524", lvl: 1.11, atk: 1.07, def: 1.06, names: ["Capitano", "Timone", "Bussola", "Lungo Corso"] },
        { id: "sirene", name: "Sirene di Cala Salata", short: "Sirene", ico: "🧜", col: "#5eead4", col2: "#115e59", lvl: 1.10, atk: 1.10, def: 1.02, names: ["Sirena", "Onda", "Sale", "Schiuma", "Perla"] },
        { id: "bellavista", name: "Bellavista Resort FC", short: "Bellavista", ico: "🏨", col: "#f9a8d4", col2: "#831843", lvl: 1.12, atk: 1.09, def: 1.08, names: ["Resort", "Suite", "Palma", "Aperitivo", "Lido"] },
        { id: "mareggiata", name: "Real Mareggiata", short: "Mareggiata", ico: "👑", col: "#7dd3fc", col2: "#1e3a8a", lvl: 1.14, atk: 1.11, def: 1.09, names: ["Marea", "Corrente", "Risacca", "Maestrale", "Tramonto"] },
        { id: "levante", name: "Levante d'Oro Sporting", short: "Levante", ico: "🌅", col: "#fed7aa", col2: "#ea580c", lvl: 1.12, atk: 1.10, def: 1.07, names: ["Levante", "Oro", "Aurora", "Raggio", "Costiera"] }
      ]
    }
  ];

  // Rosa iniziale della Rondine (compatibile con i volti e l'archivio del Borgo)
  const DEFAULT_SQUAD = [
    { id: 1, name: "Sandro", num: 1, grp: "POR", sec: "POR", r: 74, age: 28, wage: 8, st: 100, mor: 75, goals: 0, assists: 0, matches: 0, cleanSheets: 0 },
    { id: 2, name: "Il Bue", num: 2, grp: "DIF", sec: "CEN", r: 70, age: 31, wage: 6, st: 100, mor: 70, goals: 0, assists: 0, matches: 0 },
    { id: 3, name: "Mino", num: 3, grp: "DIF", sec: "DIF", r: 69, age: 24, wage: 5, st: 100, mor: 72, goals: 0, assists: 0, matches: 0 },
    { id: 4, name: "Chicco", num: 4, grp: "DIF", sec: "DIF", r: 73, age: 26, wage: 7, st: 100, mor: 78, goals: 0, assists: 0, matches: 0 },
    { id: 5, name: "Baciccia Jr", num: 5, grp: "DIF", sec: "CEN", r: 71, age: 21, wage: 5, st: 100, mor: 70, goals: 0, assists: 0, matches: 0 },
    { id: 6, name: "Lele", num: 6, grp: "CEN", sec: "DIF", r: 72, age: 23, wage: 6, st: 100, mor: 74, goals: 0, assists: 0, matches: 0 },
    { id: 7, name: "Nico", num: 7, grp: "ATT", sec: "CEN", r: 71, age: 22, wage: 6, st: 100, mor: 75, goals: 0, assists: 0, matches: 0 },
    { id: 8, name: "Tommy", num: 8, grp: "CEN", sec: "CEN", r: 73, age: 25, wage: 7, st: 100, mor: 76, goals: 0, assists: 0, matches: 0 },
    { id: 9, name: "Dario", num: 9, grp: "ATT", sec: "ATT", r: 77, age: 27, wage: 9, st: 100, mor: 80, goals: 0, assists: 0, matches: 0 },
    { id: 10, name: "Leo (C)", num: 10, grp: "CEN", sec: "ATT", r: 76, age: 26, wage: 9, st: 100, mor: 82, goals: 0, assists: 0, matches: 0 },
    { id: 11, name: "Ricky", num: 11, grp: "ATT", sec: "CEN", r: 70, age: 20, wage: 5, st: 100, mor: 70, goals: 0, assists: 0, matches: 0 },
    // Panchina
    { id: 13, name: "Morena", num: 13, grp: "DIF", sec: "DIF", r: 68, age: 23, wage: 4, st: 100, mor: 68, bench: true, goals: 0, assists: 0, matches: 0 },
    { id: 14, name: "Ugo", num: 14, grp: "CEN", sec: "CEN", r: 69, age: 22, wage: 5, st: 100, mor: 70, bench: true, goals: 0, assists: 0, matches: 0 },
    { id: 15, name: "Fabio", num: 15, grp: "ATT", sec: "ATT", r: 72, age: 25, wage: 6, st: 100, mor: 70, bench: true, goals: 0, assists: 0, matches: 0 },
    { id: 16, name: "Gigi", num: 16, grp: "ATT", sec: "ATT", r: 70, age: 18, wage: 3, st: 100, mor: 72, bench: true, goals: 0, assists: 0, matches: 0 },
    { id: 17, name: "Pia", num: 17, grp: "CEN", sec: "CEN", r: 69, age: 21, wage: 4, st: 100, mor: 71, bench: true, goals: 0, assists: 0, matches: 0 }
  ];

  // Domande per le conferenze stampa (Mina Truciolo o Arturo)
  const PRESS_QUESTIONS = [
    {
      id: "derby",
      who: "Mina Truciolo",
      tag: "Corriere del Tirreno",
      q: "«Mister, il clima intorno alla squadra è teso. Gli avversari promettono una battaglia sul campo. Come risponde?»",
      opts: [
        { t: "«Noi parliamo solo sul campo col pallone.»", eff: "Concentrazione: +4 difesa, +3 fiducia Spigola", stat: { defBuff: 1.05, presTrust: 3 } },
        { t: "«Che vengano pure: il Borgo non ha paura di nessuno!»", eff: "Grinta: +6 morale squadra, +5 termometro tifosi", stat: { teamMor: 6, fans: 5 } },
        { t: "«Chiedo all'arbitro la massima tutela.»", eff: "Prudenza: -2 morale ragazzi, ma -30% rischio cartellini", stat: { teamMor: -2, cardResist: true } }
      ]
    },
    {
      id: "giovani",
      who: "Arturo",
      tag: "Radio Molo",
      q: "«Qui Radio Molo, buonasera Mister. C'è chi chiede a gran voce più spazio per i giovani del vivaio. Li farà giocare?»",
      opts: [
        { t: "«Chi merita gioca, a prescindere dalla carta d'identità.»", eff: "Giustizia: +5 morale riserve, +4 fiducia", stat: { benchMor: 5, presTrust: 4 } },
        { t: "«I giovani sono il futuro della Rondine: avranno spazio.»", eff: "Entusiasmo vivaio: +2 crescita talenti, +4 tifosi", stat: { youthBoost: true, fans: 4 } },
        { t: "«Adesso contano solo i punti, non gli esperimenti.»", eff: "Cinismo: +3 solidità titolari, -4 morale giovani", stat: { starterMor: 3, youthMor: -4 } }
      ]
    },
    {
      id: "bilancio",
      who: "Mina Truciolo",
      tag: "La Voce della Costa",
      q: "«Il Presidente Spigola è stato visto contare gli spiccioli al bar. C'è preoccupazione per le casse societarie?»",
      opts: [
        { t: "«La società è solida e il Presidente ha il nostro pieno appoggio.»", eff: "Fiducia di Spigola +8, cassa invariata", stat: { presTrust: 8 } },
        { t: "«Noi pensiamo ai 90 minuti, ai soldi ci pensa la segreteria.»", eff: "Nessun impatto, risposta neutra", stat: { presTrust: 2 } },
        { t: "«Se vinciamo domenica, i tifosi riempiranno lo stadio.»", eff: "Sfida al botteghino: +15% incassi se vinci, -4 fiducia se perdi", stat: { betGate: true } }
      ]
    }
  ];

  // Eventi narrativi casuali infrasettimanali
  const WEEK_EVENTS = [
    {
      id: "pesce_baciccia",
      title: "Il Fritto di Baciccia",
      text: "Baciccia ha portato un vassoio di frittura appena tolta dalla padella nello spogliatoio. I ragazzi guardano te, poi il vassoio con gli occhi lucidi.",
      choices: [
        { t: "«Tutti a tavola! La squadra si fa a tavola.»", s: "Morale +8 a tutti, ma energia -5%", go: (S) => { S.squad.forEach((p) => { p.mor = Math.min(100, p.mor + 8); p.st = Math.max(20, p.st - 5); }); return "La squadra ha spazzolato tutto in tre minuti. Morale alle stelle, ma gambe un po' pesanti."; } },
        { t: "«Solo per chi ha fatto gol domenica scorsa!»", s: "Competizione: bomber galvanizzati, riserve imbronciate", go: (S) => { S.squad.forEach((p) => { if (p.goals > 0) p.mor = Math.min(100, p.mor + 10); else p.mor = Math.max(30, p.mor - 3); }); return "Dario e Leo masticano soddisfatti; i difensori brontolano."; } },
        { t: "«Via il fritto prima della partita: solo mele!»", s: "Disciplina: condizione +4%, morale -3", go: (S) => { S.squad.forEach((p) => { p.st = Math.min(100, p.st + 4); p.mor = Math.max(30, p.mor - 3); }); return "Spigola si mangia il vassoio da solo nel suo ufficio ringraziando la disciplina."; } }
      ]
    },
    {
      id: "pallone_faro",
      title: "Il Pallone di Ester",
      text: "Ester ha recuperato dal faro tre vecchi palloni di cuoio cuciti a mano del '74, duri come noci di cocco. «Mister, con questi non si sbaglia mai la mira.»",
      choices: [
        { t: "Alleniamoci con questi: piedi d'acciaio", s: "Tiri +8% domenica, ma lieve rischio botte", go: (S) => { S.trainBuff = { shot: 1.08 }; return "I portieri piangono, ma i tiri da fuori ora sono bombe. Tiri potenziati!"; } },
        { t: "Mettiamoli in bacheca accanto a Spigola", s: "Fiducia Presidente +5, storia del Borgo onorata", go: (S) => { S.presTrust = Math.min(100, S.presTrust + 5); return "Spigola li lucida con la cravatta. «Mister, lei capisce il valore delle cose vere.»"; } },
        { t: "Regaliamoli ai bambini del Molo", s: "Tifosi entusiasti: Termometro Tifosi +7", go: (S) => { S.fans = Math.min(100, S.fans + 7); return "I ragazzi del molo cantano cori per il Mister fino a sera."; } }
      ]
    }
  ];

  window.__carrieraDati = {
    DIVISIONS,
    DEFAULT_SQUAD,
    PRESS_QUESTIONS,
    WEEK_EVENTS
  };
})();
