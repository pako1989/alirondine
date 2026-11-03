// js/cabina-regia.js - «La Cabina di Regia del Salone»
// Accesso rapido da 3 minuti alle partite uniche delle saghe già concluse:
//  - Rivincita Libera immediata (avversari della saga o Boss, senza rifare un'ora di dialoghi)
//  - 3 «Condizioni di Scena» opzionali per pellicola (attivabili/disattivabili in Impostazioni)
//  - Zero spoiler sulle saghe non ancora concluse · Premi solo in Monete e Cosmetici del Guardaroba (mai statistiche Storia).
(function () {
  "use strict";
  if (window.__regia) return;

  const KEY = "ali-di-rondine.cabina-regia";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const norm = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const api = () => window.__borgoApi || null;
  const sal = () => window.__salone || null;

  function load() {
    const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {};
    if (typeof r.on !== "boolean") r.on = true;
    r.done = r.done || {};
    r.free = r.free || {};
    r.fullBonus = r.fullBonus || {};
    r.bestMs = r.bestMs || {};
    return r;
  }
  function save(r) {
    safe(() => localStorage.setItem(KEY, JSON.stringify(r)), null);
  }

  function isOn() {
    return load().on !== false;
  }
  function setOn(v) {
    const r = load();
    const first = !!v && !r.cut;
    r.on = !!v;
    if (first) r.cut = true;
    save(r);
    return first;
  }

  // ---------------------------------------------------------------- COSMETICI GUARDAROBA (SOLO ESTETICI)
  const REGIA_COSM = {
    rg_maglia_ciak: {
      kind: "shirt",
      label: "Maglia Ciak d'Argento",
      val: "#1e293b",
      from: "Supera 3 Condizioni di Scena nella Cabina di Regia",
      needCond: 3,
    },
    rg_occhiali_moviola: {
      kind: "acc",
      label: "Occhiali da Cabina di Montaggio",
      val: "occhiali",
      from: "Completa tutte e 3 le Condizioni di Scena di una saga (Pellicola d'Oro)",
      needGold: 1,
    },
    rg_berretto_regista: {
      kind: "acc",
      label: "Berretto da Regista del Molo",
      val: "berretto",
      from: "Supera 6 Condizioni di Scena nella Cabina di Regia",
      needCond: 6,
    },
    rg_capelli_pellicola: {
      kind: "hairc",
      label: "Capelli Seppia Pellicola 35mm",
      val: "#c29b61",
      from: "Supera 12 Condizioni di Scena nella Cabina di Regia",
      needCond: 12,
    },
    rg_maglia_premiere: {
      kind: "shirt",
      label: "Smoking Gran Première Cremisi",
      val: "#881337",
      from: "Supera 18 Condizioni di Scena nella Cabina di Regia",
      needCond: 18,
    },
    rg_ciak_oro: {
      kind: "other",
      label: "Ciak d'Oro del Salone",
      val: "ciak_oro",
      from: "Ottieni 5 Pellicole d'Oro (3/3) nella Cabina di Regia",
      needGold: 5,
    },
  };

  function registerCosmetics() {
    const A = api();
    if (!A || !A.COSM) return;
    Object.keys(REGIA_COSM).forEach((k) => {
      if (!A.COSM[k]) {
        const c = REGIA_COSM[k];
        A.COSM[k] = { kind: c.kind, label: c.label, val: c.val, from: c.from };
      }
    });
  }

  // ---------------------------------------------------------------- MOTORI EXTRA OLTRE A MACHINES
  function heroLook() {
    const S = sal();
    if (S && S.heroLook) return S.heroLook();
    const h = safe(() => JSON.parse(localStorage.getItem("ali-di-rondine.campione") || "null"), null) || {};
    return { name: h.name || "Campione", skin: h.skin || "#e0ac7e", hair: h.hair || "#2b1d14", shirt: h.shirt || "#1f5fbf" };
  }

  const EXTRA_ENGINES = [
    {
      id: "rg_alcatraz2",
      saga: "alcatraz2",
      t: "Calcio a Parete · Cisterna",
      e: "🌊",
      eng: "__alcatraz2Match",
      d: "Partita 3 contro 3 nella Cisterna Sommersa: sponde metalliche a 45°, valvole a muro che spazzano i difensori e livello dell'acqua variabile.",
      opp: [
        { name: "Pattuglia della Diga", waterLevel: 0, style: "equilibrata", color: "#38bdf8" },
        { name: "Guardie Idrauliche", waterLevel: 1, style: "difensiva", color: "#0284c7" },
      ],
      boss: { name: "Corazzieri di Cerbero", waterLevel: 2, style: "pressing", color: "#f59e0b" },
      opts: (o, h, boss) => ({
        title: `Cisterna Sommersa · contro ${o.name}`,
        waterLevel: boss ? 2 : (typeof o.waterLevel === "number" ? o.waterLevel : 1),
        us: (h && h.name) || "Evasori FC",
      }),
    },
    {
      id: "rg_spazio",
      saga: "spazio",
      t: "Gravità Zero · Stazione 7",
      e: "🛰️",
      eng: "__gravita",
      d: "Palestra orbitale senza peso: inerzia continua, spinte di sponda sulle paratie, inversioni di gravità a 180° e ARBI-9 che fischia fuorigioco alla Terra.",
      opp: [
        { name: "Turno Manutenzione", kit: "#38bdf8", names: ["Bullone", "Valvola"], flipEvery: 26, style: "equilibrata" },
        { name: "Squadra Cupola Nord", kit: "#a855f7", names: ["Orbita", "Apogeo"], flipEvery: 20, style: "contropiede" },
      ],
      boss: { name: "Ammiragliato Orbitale", kit: "#f43f5e", names: ["Cometa", "Zenit"], flipEvery: 15, nonna: true, style: "pressing" },
      opts: (o, h, boss) => ({
        title: `Gravità Zero · contro ${o.name}`,
        us: (h && h.name) || "Stazione 7",
        opp: { name: o.name, kit: o.kit || "#38bdf8", names: o.names || ["Astro", "Cosmo"] },
        heroLook: h,
        mate: { name: "Nora", skin: "#f0d0b0", hair: "#1e293b", shirt: (h && h.shirt) || "#1f5fbf" },
        flips: true,
        flipEvery: boss ? 15 : (o.flipEvery || 22),
        nonna: !!boss,
      }),
    },
    {
      id: "rg_vento",
      saga: "vento",
      t: "Col Vento · Prato dei Soffi",
      e: "🍃",
      eng: "__ventoPartita",
      d: "Il vento gira ogni 15 secondi e piega i pallonetti alti: sfrutta le folate per segnare da metà campo insieme agli Spiriti del Prato.",
      opp: [
        { name: "Ragazzi del Mulino", kit: "#65a30d", names: ["Brezza", "Stelo"], calm: true, style: "equilibrata" },
        { name: "Custodi del Crinale", kit: "#0284c7", names: ["Raffiche", "Nube"], rising: true, style: "contropiede" },
      ],
      boss: { name: "Gli Antichi Soffi", kit: "#e2e8f0", names: ["Tramontana", "Libeccio"], spiritsOpp: true, style: "pressing" },
      opts: (o, h, boss) => ({
        title: `Prato dei Soffi · contro ${o.name}`,
        us: (h && h.name) || "Valle Gentile",
        opp: { name: o.name, kit: o.kit || "#65a30d", names: o.names || ["Soffio", "Vento"] },
        heroLook: h,
        calm: !!o.calm && !boss,
        rising: !!o.rising || !!boss,
        spiritsMate: true,
        spiritsOpp: !!boss,
      }),
    },
    {
      id: "rg_dopo",
      saga: "dopo",
      t: "Epoche · Quattro Secoli di Pallone",
      e: "🎞️",
      eng: "__epoche",
      d: "Ogni sfida cambia epoca, fisica e pellicola: film muto 1928 col cuoio pesante, afa anni '70, sala giochi 8-bit 1989 col Super Tiro e presente.",
      opp: [
        { name: "Fornaci 1928 (Film Muto)", era: "1928", kit: "#57534e", names: ["Baffo", "Gino"], style: "difensiva" },
        { name: "Sporting Estate '74", era: "1974", kit: "#ea580c", names: ["Sandro", "Nanni"], style: "equilibrata" },
      ],
      boss: { name: "Sala Giochi '89 All-Stars", era: "1989", kit: "#ec4899", names: ["Turbo", "Pixel"], style: "pressing" },
      opts: (o, h, boss) => ({
        era: boss ? "1989" : (o.era || "1928"),
        title: `Epoche · ${o.name.trim()}`,
        us: (h && h.name) || "Valdorsa",
        opp: { name: o.name.trim(), kit: o.kit || "#ea580c", names: o.names || ["Primo", "Secondo"] },
        heroLook: h,
        mate: { name: "Ada", skin: "#e8c4a0", hair: "#3a2a1a", shirt: (h && h.shirt) || "#1f5fbf" },
      }),
    },
    {
      id: "rg_muro",
      saga: "muro",
      t: "Partita sul Muro · Cintavecchia",
      e: "🧱",
      eng: "__muroPartita",
      d: "Campo stretto in cima alle mura: se la palla cade di sotto è rimessa, il vento spinge e i Colossi poggiano le mani giganti sul camminamento.",
      opp: [
        { name: "Sentinelle di Ronda", kit: "#64748b", names: ["Merlo", "Torre"], wind: false, style: "difensiva" },
        { name: "Vedette del Bastione", kit: "#b45309", names: ["Fune", "Pietra"], wind: true, style: "contropiede" },
      ],
      boss: { name: "La Guardia del Colosso", kit: "#991b1b", names: ["Vallo", "Cinta"], wind: true, night: true, style: "pressing" },
      opts: (o, h, boss) => ({
        title: `Sul Muro · contro ${o.name}`,
        us: (h && h.name) || "Cintavecchia",
        hero: h,
        mate: { name: "Daria", skin: "#e0b890", hair: "#2b1d14", shirt: (h && h.shirt) || "#1f5fbf" },
        opp: { name: o.name, kit: o.kit || "#64748b", names: o.names || ["Ronda", "Muro"] },
        hands: true,
        wind: !!o.wind || !!boss,
        night: !!boss,
        hard: !!boss,
        half: 32,
      }),
    },
    {
      id: "rg_libro",
      saga: "libro",
      t: "La Partita Scritta · Tre Pagine",
      e: "🖋️",
      eng: "__lbPartitaScritta",
      d: "Campo a fumetto in tre pagine: il Narratore scrive parole-regola contro di te (NEBBIA, SPECCHIO, CANCELLA) e tu rispondi col tuo pennino.",
      opp: [
        { name: "Le Macchie d'Inchiostro", boss: false, style: "equilibrata" },
        { name: "I Revisori Grigi", boss: false, style: "difensiva" },
      ],
      boss: { name: "Il Narratore Senza Finale", boss: true, style: "pressing" },
      opts: (o, h, boss) => ({
        title: `Partita Scritta · contro ${o.name}`,
        hero: h,
        mate: { name: "Virgola", skin: "#f0d0b0", hair: "#7c2d12", shirt: (h && h.shirt) || "#1f5fbf" },
        words: ["luce", "dritto", "sole", "penna", "ancora", "soffio", "ponte", "doppio"],
        opp: { name: o.name, boss: !!boss },
      }),
    },
    {
      id: "rg_doppio",
      saga: "doppio",
      t: "Partita in Cuffia · Doppio Turno",
      e: "🎧",
      eng: "__dtCuffia",
      d: "Partita in tempo reale mentre la Voce in cuffia ti impartisce ordini a tempo: decidi quando obbedire e quando rompere il copione per segnare.",
      opp: [
        { name: "Squadra Collaudo", kit: "#475569", script: ["passa", "destra", "tira", "non_tirare"], style: "equilibrata" },
        { name: "Reparto Sorveglianza", kit: "#0f766e", script: ["sinistra", "fermo", "passa", "cadi", "tira"], style: "difensiva" },
      ],
      boss: { name: "La Direzione Centrale", kit: "#991b1b", script: ["non_tirare", "fermo", "rigore_no", "sinistra", "passa", "cadi"], style: "pressing" },
      opts: (o, h, boss) => ({
        title: `In Cuffia · contro ${o.name}`,
        voice: "Regia Centrale",
        hero: h,
        mate: { name: "Mirko", skin: "#d9a679", hair: "#1e293b", shirt: (h && h.shirt) || "#1f5fbf" },
        opp: { name: o.name, kit: o.kit || "#475569" },
        script: o.script || ["passa", "tira", "sinistra"],
        hard: !!boss,
      }),
    },
    {
      id: "rg_cristalli",
      saga: "cristalli",
      t: "Battaglia ATB · Cristalli del Campo",
      e: "💎",
      eng: "__crATB",
      d: "Battaglia calcistica da JRPG classico: barre ATB, Luce condivisa, quattro Mestieri (Bomber, Regista, Muro, Funambolo) e Guardia del portiere da spezzare.",
      opp: [
        { name: "Cavalieri d'Ambra", bg: "terra", foeCol: "#d97706", guard: 55, foes: [{ name: "Quarzo" }, { name: "Selce" }, { name: "Pirite" }], style: "equilibrata" },
        { name: "Sentinelle Cremisi", bg: "fuoco", foeCol: "#dc2626", guard: 70, foes: [{ name: "Brace" }, { name: "Pomice" }, { name: "Magma" }], style: "contropiede" },
      ],
      boss: { name: "L'Araldo dell'Eclissi", bg: "trono", foeCol: "#7e22ce", guard: 90, foes: [{ name: "Ombra" }, { name: "Vuoto" }, { name: "Corona" }], style: "pressing" },
      opts: (o, h, boss) => ({
        title: `Cristalli ATB · contro ${o.name}`,
        bg: o.bg || (boss ? "trono" : "terra"),
        party: [
          { name: (h && h.name) || "Campione", job: "bomber", skin: h.skin, hair: h.hair, shirt: h.shirt },
          { name: "Luce", job: "regista", skin: "#f0d0b0", hair: "#eab308", shirt: "#2563eb" },
          { name: "Scudo", job: "muro", skin: "#c68642", hair: "#1e293b", shirt: "#059669" },
        ],
        foes: o.foes || [{ name: "Rivale A" }, { name: "Rivale B" }, { name: "Rivale C" }],
        keeper: { name: boss ? "Custode del Trono" : "Guardiano", guard: boss ? 90 : (o.guard || 60) },
        foeCol: o.foeCol || "#dc2626",
        boss: !!boss,
        target: boss ? 3 : 2,
      }),
    },
    {
      id: "rg_compagnia",
      saga: "compagnia",
      t: "Campo di Guerra · Scacchiera",
      e: "🚩",
      eng: "__tattica",
      d: "Battaglia tattica isometrica a fasi con i ruoli della Compagnia: sfrutta boschi, colline e legami per piegare lo schieramento rivale.",
      opp: [
        { name: "Picchetto del Guado", level: 1, map: 0, style: "equilibrata" },
        { name: "Lanceri del Mulino", level: 2, map: 1, style: "difensiva" },
      ],
      boss: { name: "Armata del Fortino Nero", level: 3, map: 2, style: "pressing" },
      opts: (o, h, boss) => ({
        title: `Campo di Guerra · contro ${o.name}`,
        level: boss ? 3 : (o.level || 1),
        map: typeof o.map === "number" ? o.map : (boss ? 2 : 0),
        enemy: o.name,
        boss: !!boss,
        tutorial: false,
      }),
    },
  ];

  // ---------------------------------------------------------------- CONDIZIONI DI SCENA & ATMOSFERA
  const ATMO_PRESETS = {
    pioggia: {
      id: "pioggia",
      badge: "🌧️ ACQUAZZONE SUL SET",
      label: "Sotto l'acquazzone",
      css: "background:repeating-linear-gradient(108deg,rgba(148,197,255,.16) 0 1px,transparent 1px 16px),radial-gradient(circle at 50% 0%,rgba(15,23,42,.18),rgba(2,6,23,.38));",
    },
    pellicola: {
      id: "pellicola",
      badge: "🎞️ PELLICOLA 35MM",
      label: "Pellicola 35mm d'archivio",
      css: "background:radial-gradient(circle at 50% 50%,rgba(251,191,36,.07) 45%,rgba(20,12,4,.48) 100%);backdrop-filter:sepia(.34) contrast(1.05);",
    },
    nebbia: {
      id: "nebbia",
      badge: "🌫️ FOSCHIA DEL MOLO",
      label: "Foschia fitta dai riflettori",
      css: "background:radial-gradient(circle at 50% 48%,transparent 34%,rgba(203,213,225,.30) 82%,rgba(148,163,184,.48) 100%);",
    },
    notturno: {
      id: "notturno",
      badge: "🌙 PROIETTORE DI MEZZANOTTE",
      label: "Occhio di bue notturno",
      css: "background:radial-gradient(circle at 50% 48%,transparent 32%,rgba(2,6,23,.54) 88%);",
    },
    boato: {
      id: "boato",
      badge: "📣 BOATO DI CURVA",
      label: "Pressione alta dagli spalti",
      css: "box-shadow:inset 0 0 48px rgba(250,204,21,.22),inset 0 0 14px rgba(239,68,68,.22);",
    },
  };

  const GENRE_ATMO = {
    storico: "pellicola",
    mistero: "nebbia",
    notte: "notturno",
    dramma: "pioggia",
    scifi: "notturno",
    fantasy: "nebbia",
    commedia: "pellicola",
    tattica: "boato",
    sport: "boato",
    avventura: "pioggia",
  };

  const REGIA_QUOTES = {
    storico: "«Niente orologi al polso nell'inquadratura, che siamo fuori epoca già col guardalinee.»",
    mistero: "«Chi ha spento mezzo stadio? Ottimo, risparmiamo sulla bolletta: gira lo stesso!»",
    dramma: "«Piove? Perfetto, le maglie fradicie fanno sempre festival del cinema.»",
    scifi: "«Se il pallone esce dall'atmosfera non andate a prenderlo, costa più del proiettore.»",
    fantasy: "«Effetti speciali artigianali: metà è magia antica, metà è fumo della griglia del Bar.»",
    commedia: "«Buona la prima, ché la troupe ha prenotato la frittura alle otto.»",
    tattica: "«Lavagna pulita, nervi saldi e vietato buttare il pallone in tribuna stampa.»",
    sport: "«Niente controfigure e niente moviola di comodo: qui si vince sul campo.»",
    avventura: "«Ciak, motore, fischio! E cercate di tornare tutti interi per i titoli di coda.»",
  };

  function buildCatalog() {
    const S = sal();
    if (!S || !S.SAGAS) return [];
    const sagasById = {};
    S.SAGAS.forEach((s) => { sagasById[s.id] = s; });

    const out = [];
    const seenSaga = new Set();

    (S.MACHINES || []).forEach((m) => {
      if (!m || !m.saga || !m.opts || !m.opp || !m.opp.length) return;
      const s = sagasById[m.saga];
      if (!s) return;
      const eng = window[m.eng];
      if (!eng || typeof eng.start !== "function") return;
      seenSaga.add(s.id);
      out.push(makeReel(m, s));
    });

    EXTRA_ENGINES.forEach((m) => {
      if (seenSaga.has(m.saga)) return;
      const s = sagasById[m.saga];
      if (!s) return;
      const eng = window[m.eng];
      if (!eng || typeof eng.start !== "function") return;
      seenSaga.add(s.id);
      out.push(makeReel(m, s));
    });

    return out;
  }

  function makeReel(m, s) {
    const g0 = (s.g && s.g[0]) || "avventura";
    const atmoKey = GENRE_ATMO[g0] || "pioggia";
    const atmo = ATMO_PRESETS[atmoKey] || ATMO_PRESETS.pioggia;
    const rival1 = m.opp[Math.min(1, m.opp.length - 1)] || m.opp[0];
    const rival2 = m.opp[0];
    const boss = m.boss || rival1;

    const conditions = [
      {
        id: "c1",
        ciak: "CIAK I",
        icon: "🎬",
        title: "Buona la Prima · Ritmo Alto",
        desc: `Batti «${rival1.name}» a difficoltà Sfida senza appello.`,
        coins: 25,
        diff: "sfida",
        atmo: null,
        opp: rival1,
        boss: false,
      },
      {
        id: "c2",
        ciak: "CIAK II",
        icon: atmo.badge.split(" ")[0],
        title: `Scena Madre · ${atmo.label}`,
        desc: `Vinci contro «${rival2.name}» con la condizione scenica «${atmo.label}» attiva.`,
        coins: 35,
        diff: "normale",
        atmo: atmo.id,
        opp: rival2,
        boss: false,
      },
      {
        id: "c3",
        ciak: "CIAK III",
        icon: "👑",
        title: "Il Taglio del Regista · Boss",
        desc: `Sconfiggi «${boss.name}» a difficoltà Sfida sotto l'occhio di bue della Première.`,
        coins: 50,
        diff: "sfida",
        atmo: "boato",
        opp: boss,
        boss: true,
      },
    ];

    return {
      id: s.id,
      machineId: m.id,
      saga: s,
      t: m.t,
      e: m.e || s.e,
      eng: m.eng,
      d: m.d,
      power: !!m.power,
      opp: m.opp,
      boss: boss,
      opts: m.opts,
      quote: REGIA_QUOTES[g0] || REGIA_QUOTES.avventura,
      conditions,
    };
  }

  function isUnlocked(sagaId) {
    const S = sal();
    if (!S) return false;
    if (typeof S.sagaCompleted === "function") return !!S.sagaCompleted(sagaId);
    const s = (S.SAGAS || []).find((x) => x.id === sagaId);
    if (!s) return false;
    if (s.key && typeof S.concluded === "function") return !!S.concluded(s.key);
    const st = typeof S.sagaStatus === "function" ? S.sagaStatus(sagaId) : null;
    return !!(st && (st.finished || st.endsFound > 0));
  }

  function reelStats(reel, r) {
    r = r || load();
    const c1 = !!r.done[`${reel.id}:c1`];
    const c2 = !!r.done[`${reel.id}:c2`];
    const c3 = !!r.done[`${reel.id}:c3`];
    const count = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0);
    return {
      c1,
      c2,
      c3,
      count,
      gold: count === 3,
      freeCount: r.free[reel.id] || 0,
      bestMs: r.bestMs[reel.id] || null,
    };
  }

  function globalTotals() {
    registerCosmetics();
    const cat = buildCatalog();
    const r = load();
    let unlockedReels = 0;
    let condDone = 0;
    let goldReels = 0;
    cat.forEach((reel) => {
      if (isUnlocked(reel.id)) unlockedReels++;
      const st = reelStats(reel, r);
      condDone += st.count;
      if (st.gold) goldReels++;
    });
    return {
      totalReels: cat.length,
      unlockedReels,
      condDone,
      condTotal: cat.length * 3,
      goldReels,
    };
  }

  function syncMilestoneCosmetics(tot) {
    registerCosmetics();
    const A = api();
    if (!A || typeof A.bCos !== "function") return [];
    const owned = new Set(safe(() => A.cosOwned(), []));
    const newly = [];
    Object.keys(REGIA_COSM).forEach((id) => {
      if (owned.has(id)) return;
      const c = REGIA_COSM[id];
      const okCond = c.needCond ? tot.condDone >= c.needCond : true;
      const okGold = c.needGold ? tot.goldReels >= c.needGold : true;
      if (okCond && okGold) {
        safe(() => A.bCos(id), null);
        newly.push({ id, label: c.label, kind: c.kind });
      }
    });
    return newly;
  }

  // ---------------------------------------------------------------- EFFETTI SCENICI DURANTE LA RIPRESA
  let activeStageEl = null;
  let activeHudEl = null;

  function applyStageFx(atmoId, labelText) {
    clearStageFx();
    if (atmoId && ATMO_PRESETS[atmoId]) {
      const p = ATMO_PRESETS[atmoId];
      const fx = document.createElement("div");
      fx.id = "rgStageFx";
      fx.style.cssText = `position:fixed;inset:0;z-index:99990;pointer-events:none;${p.css}`;
      document.body.appendChild(fx);
      activeStageEl = fx;
    }
    if (labelText) {
      const hud = document.createElement("div");
      hud.id = "rgClapHud";
      hud.style.cssText = "position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:99991;pointer-events:none;background:rgba(11,16,38,.86);border:1.5px solid #ffd23f;color:#ffd23f;padding:3px 10px;border-radius:6px;font:800 11px/1.2 'M PLUS Rounded 1c',system-ui,sans-serif;letter-spacing:.4px;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.5);";
      hud.textContent = labelText;
      document.body.appendChild(hud);
      activeHudEl = hud;
    }
  }

  function clearStageFx() {
    if (activeStageEl) { safe(() => activeStageEl.remove(), null); activeStageEl = null; }
    if (activeHudEl) { safe(() => activeHudEl.remove(), null); activeHudEl = null; }
    const stray1 = document.getElementById("rgStageFx"); if (stray1) safe(() => stray1.remove(), null);
    const stray2 = document.getElementById("rgClapHud"); if (stray2) safe(() => stray2.remove(), null);
  }

  // ---------------------------------------------------------------- LANCIO PARTITA (LIBERA O CONDIZIONE)
  function launchTake(reel, cfg, onAfter) {
    if (!reel || !isUnlocked(reel.id)) return false;
    const eng = window[reel.eng];
    if (!eng || typeof eng.start !== "function") return false;

    const S = sal();
    const C = window.__sagaCore;
    const cond = cfg && cfg.cond ? cfg.cond : null;
    if (cond && !isOn()) return false;

    const opp = (cond ? cond.opp : (cfg && cfg.opp)) || reel.opp[0];
    const isBoss = cond ? !!cond.boss : !!(cfg && cfg.boss);
    const diff = cond ? (cond.diff || "normale") : ((cfg && cfg.diff) || "normale");
    const pw = (cfg && cfg.pw) || "fulmine";
    const h = heroLook();

    closeModal();
    if (S && typeof S.close === "function") safe(() => S.close(), null);

    if (C && typeof C.setCur === "function") {
      safe(() => C.setCur(diff, opp.style || (isBoss ? "pressing" : "equilibrata")), null);
    }

    const badgeTxt = cond
      ? `🎬 ${cond.ciak} · ${cond.title}`
      : `🎥 RIVINCITA LIBERA · ${reel.t}`;
    applyStageFx(cond ? cond.atmo : null, badgeTxt);

    const t0 = Date.now();
    let settled = false;

    const finish = (rawRes) => {
      if (settled) return;
      settled = true;
      clearStageFx();
      if (C && typeof C.endMatch === "function") safe(() => C.endMatch(), null);

      const elapsed = Math.max(1, Date.now() - t0);
      const res = rawRes && typeof rawRes === "object" ? rawRes : { win: !!rawRes };
      const won = !!res.win;

      const r = load();
      let coinsEarned = 0;
      let goldBonusEarned = 0;
      let firstTimeCond = false;

      if (!cond) {
        r.free[reel.id] = (r.free[reel.id] || 0) + 1;
        if (won && (!r.bestMs[reel.id] || elapsed < r.bestMs[reel.id])) {
          r.bestMs[reel.id] = elapsed;
        }
      } else if (won) {
        const dKey = `${reel.id}:${cond.id}`;
        if (!r.done[dKey]) {
          r.done[dKey] = 1;
          firstTimeCond = true;
          coinsEarned += cond.coins || 25;
        }
        if (!r.bestMs[reel.id] || elapsed < r.bestMs[reel.id]) {
          r.bestMs[reel.id] = elapsed;
        }
        const stAfter = reelStats(reel, r);
        if (stAfter.gold && !r.fullBonus[reel.id]) {
          r.fullBonus[reel.id] = 1;
          goldBonusEarned = 30;
          coinsEarned += goldBonusEarned;
        }
      }
      save(r);

      if (coinsEarned > 0 && typeof window.addCoins === "function") {
        safe(() => window.addCoins(coinsEarned), null);
      }

      const tot = globalTotals();
      const newCos = won ? syncMilestoneCosmetics(tot) : [];

      const report = {
        won,
        res,
        elapsed,
        cond,
        opp,
        isBoss,
        coinsEarned,
        goldBonusEarned,
        firstTimeCond,
        newCos,
      };

      if (typeof onAfter === "function") {
        onAfter(report);
      } else {
        openDebrief(reel, report);
      }
    };

    const baseOpts = safe(() => reel.opts(opp, h, isBoss, pw), {}) || {};
    const fullOpts = Object.assign({}, baseOpts, {
      oppStyle: opp.style || (isBoss ? "pressing" : "equilibrata"),
      heroLook: h,
      winTitle: cond ? `${cond.ciak} · BUONA LA PRIMA!` : (isBoss ? "BOSS SCONFITTO!" : "VITTORIA!"),
      onDone: finish,
      done: finish,
    });

    const started = safe(() => eng.start(fullOpts), false);
    if (started === false) {
      clearStageFx();
      if (C && typeof C.endMatch === "function") safe(() => C.endMatch(), null);
      openReel(reel.id);
      return false;
    }
    return true;
  }

  // ---------------------------------------------------------------- INTERFACCIA CABINA DI REGIA
  let OV = null;
  let BACK_FN = null;
  let FILTER = "all";
  let SEARCH_Q = "";

  function injectCss() {
    if (document.getElementById("cabinaRegiaCss")) return;
    const st = document.createElement("style");
    st.id = "cabinaRegiaCss";
    st.textContent = `
.rgOv{position:fixed;inset:0;z-index:340;background:radial-gradient(ellipse at top,#1b2850 0%,#090e20 68%);color:#f2ead8;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;font-family:"M PLUS Rounded 1c",system-ui,sans-serif}
.rgOv *{box-sizing:border-box}
.rgWrap{max-width:720px;margin:0 auto;padding:12px 14px 44px}
.rgBar{display:flex;align-items:center;gap:10px;position:sticky;top:0;z-index:4;background:linear-gradient(#090e20 76%,rgba(9,14,32,0));padding:6px 0 10px}
.rgBar h2{margin:0;font-family:"Dela Gothic One",Impact,sans-serif;font-size:20px;letter-spacing:.4px;color:#ffd23f;text-shadow:0 2px 0 #000;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rgBtnX{min-width:44px;min-height:44px;border-radius:10px;border:1.5px solid #ffffff3d;background:#16294a;color:#fff;font:800 16px system-ui;cursor:pointer;touch-action:manipulation}
.rgClapBanner{background:linear-gradient(135deg,#13213f,#0e172f);border:1.5px solid #ffd23f55;border-radius:12px;padding:11px 13px;margin:0 0 12px;position:relative;overflow:hidden}
.rgClapStripe{height:7px;margin:-11px -13px 9px;background:repeating-linear-gradient(-45deg,#ffd23f 0 12px,#0f172a 12px 24px)}
.rgSub{font-size:12.5px;color:#cbd5e1;line-height:1.42;margin:0}
.rgMetaLine{display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:8px;font-size:12px;color:#e2e8f0;font-weight:700}
.rgMetaLine b{color:#ffd23f}
.rgProg{height:6px;border-radius:4px;background:#ffffff1c;overflow:hidden;margin-top:8px}
.rgProg i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#ffd23f)}
.rgControls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:8px 0 10px}
.rgSearch{flex:1;min-width:180px;min-height:44px;background:#0d162c;border:1.5px solid #334155;border-radius:10px;color:#f8fafc;padding:0 12px;font:600 13.5px "M PLUS Rounded 1c",system-ui,sans-serif;outline:none}
.rgSearch:focus{border-color:#ffd23f}
.rgTabs{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;scrollbar-width:none}
.rgTabs::-webkit-scrollbar{display:none}
.rgTab{min-height:40px;padding:6px 12px;border-radius:8px;border:1.5px solid #334155;background:#13213f;color:#dbeafe;font:800 12px "M PLUS Rounded 1c",sans-serif;cursor:pointer;white-space:nowrap;touch-action:manipulation}
.rgTab.on{background:#ffd23f;color:#171200;border-color:#ffd23f}
.rgList{display:flex;flex-direction:column;gap:8px}
.rgRow{display:flex;align-items:center;gap:11px;min-height:66px;padding:10px 12px;border-radius:12px;background:#13213f;border:1.5px solid #263b66;cursor:pointer;touch-action:manipulation;transition:border-color .14s,transform .12s}
.rgRow:active{transform:scale(.99)}
.rgRow.gold{border-color:#ffd23faa;background:linear-gradient(135deg,#1d2d52,#13203d)}
.rgRow.lock{opacity:.62;background:#0e172d;border-style:dashed;border-color:#263554}
.rgIcon{width:44px;height:44px;border-radius:10px;background:#0b1224;border:1px solid #334155;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.rgInfo{flex:1;min-width:0}
.rgInfo b{display:block;font-size:14px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rgInfo span{display:block;font-size:12px;color:#94a3b8;margin-top:2px;line-height:1.3}
.rgRight{text-align:right;font-weight:800;font-size:12.5px;color:#ffd23f;flex-shrink:0}
.rgSec{font:800 12px/1 "M PLUS Rounded 1c",sans-serif;letter-spacing:.6px;text-transform:uppercase;color:#93c5fd;margin:14px 0 8px;display:flex;justify-content:space-between;align-items:center}
.rgCardBox{background:#13213f;border:1.5px solid #294172;border-radius:12px;padding:12px;margin-bottom:10px}
.rgCardBox.gold{border-color:#ffd23faa;background:linear-gradient(135deg,#1b2b50,#121f3d)}
.rgQuote{font-size:12px;font-style:italic;color:#93c5fd;margin:6px 0 0;line-height:1.35}
.rgActionBtn{min-height:46px;padding:8px 14px;border-radius:10px;border:1.5px solid #ffd23f;background:linear-gradient(#ffd23f,#e6a229);color:#1a1300;font:900 13.5px "M PLUS Rounded 1c",sans-serif;cursor:pointer;touch-action:manipulation;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.rgGhostBtn{min-height:44px;padding:8px 12px;border-radius:10px;border:1.5px solid #3b5280;background:#17294d;color:#e2e8f0;font:800 12.5px "M PLUS Rounded 1c",sans-serif;cursor:pointer;touch-action:manipulation;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.rgCondRow{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:11px;background:#0f1a33;border:1.5px solid #253963;margin-bottom:8px}
.rgCondRow.done{border-color:#4fd1a588;background:#102536}
.rgCondTxt{flex:1;min-width:0}
.rgCondTxt b{display:block;font-size:13.5px;color:#f8fafc}
.rgCondTxt span{display:block;font-size:12px;color:#cbd5e1;margin-top:2px;line-height:1.32}
.rgCondReward{font-size:11px;color:#ffd23f;font-weight:800;margin-top:4px}
.rgCosStrip{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-top:6px}
.rgCosItem{padding:8px 10px;border-radius:10px;background:#0f1a33;border:1px solid #283d69;font-size:12px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.rgCosItem.own{border-color:#4fd1a588;color:#e6fffa}
.salRegiaBox{margin:12px 0 6px;padding:11px 12px;border-radius:12px;background:linear-gradient(135deg,#17294e,#0e1934);border:1.5px solid #ffd23f88}
.salRegiaBox h4{margin:0 0 4px;font:900 14px "M PLUS Rounded 1c",sans-serif;color:#ffd23f;display:flex;align-items:center;justify-content:space-between;gap:8px}
.salRegiaBox p{margin:0 0 9px;font-size:12px;color:#cbd5e1;line-height:1.38}
.salRegiaBtns{display:flex;flex-wrap:wrap;gap:8px}
.salRegiaBtns button{min-height:44px;flex:1;min-width:135px;border-radius:10px;font:800 12.5px "M PLUS Rounded 1c",sans-serif;cursor:pointer;padding:6px 10px;touch-action:manipulation}
.salRegiaFree{border:1.5px solid #ffd23f;background:linear-gradient(#ffd23f,#e59e24);color:#1a1300}
.salRegiaOpen{border:1.5px solid #60a5fa;background:#162c56;color:#eff6ff}
.salRegiaLock{margin:10px 0 4px;padding:8px 11px;border-radius:10px;background:#0e1830;border:1px dashed #334a78;font-size:12px;color:#94a3b8}
`;
    document.head.appendChild(st);
  }

  function ensureShell(title, onBack) {
    injectCss();
    closeModal();
    OV = document.createElement("div");
    OV.className = "rgOv";
    OV.innerHTML = `<div class="rgWrap"><div class="rgBar"><h2>${title}</h2><button type="button" class="rgBtnX" aria-label="Chiudi">✕</button></div><div class="rgBody"></div></div>`;
    OV.querySelector(".rgBtnX").onclick = () => {
      closeModal();
      if (typeof onBack === "function") onBack();
      else if (typeof BACK_FN === "function") BACK_FN();
    };
    document.body.appendChild(OV);
    return OV.querySelector(".rgBody");
  }

  function closeModal() {
    if (OV) {
      safe(() => OV.remove(), null);
      OV = null;
    }
  }

  function openHub(back) {
    if (typeof back === "function") BACK_FN = back;
    registerCosmetics();
    const tot = globalTotals();
    syncMilestoneCosmetics(tot);

    const body = ensureShell("🎥 Cabina di Regia", BACK_FN);
    const cat = buildCatalog();
    const r = load();
    const condActive = isOn();
    const coins = typeof window.bCoins === "function" ? safe(() => window.bCoins(), 0) : 0;
    const A = api();
    const ownedCos = new Set(safe(() => (A && A.cosOwned ? A.cosOwned() : []), []));
    const rgCosKeys = Object.keys(REGIA_COSM);
    const rgCosOwned = rgCosKeys.filter((k) => ownedCos.has(k)).length;

    const renderList = () => {
      const q = norm(SEARCH_Q);
      const filtered = cat.filter((reel) => {
        const open = isUnlocked(reel.id);
        const st = reelStats(reel, r);
        if (FILTER === "open" && !open) return false;
        if (FILTER === "todo" && (!open || st.gold)) return false;
        if (FILTER === "gold" && (!open || !st.gold)) return false;
        if (!q) return true;
        const hay = open
          ? norm(`${reel.saga.t} ${reel.t} ${reel.d} ${reel.boss.name}`)
          : norm(`${reel.saga.t}`);
        return hay.includes(q);
      });

      filtered.sort((a, b) => {
        const oa = isUnlocked(a.id) ? 1 : 0;
        const ob = isUnlocked(b.id) ? 1 : 0;
        if (oa !== ob) return ob - oa;
        if (oa && ob) {
          const sa = reelStats(a, r), sb = reelStats(b, r);
          if (sa.gold !== sb.gold) return sa.gold ? 1 : -1;
          if (sa.count !== sb.count) return sb.count - sa.count;
        }
        return a.saga.t.localeCompare(b.saga.t, "it");
      });

      const pct = tot.totalReels ? Math.round((tot.unlockedReels / tot.totalReels) * 100) : 0;

      let html = `<div class="rgClapBanner">
        <div class="rgClapStripe"></div>
        <p class="rgSub">Ogni saga conclusa consegna qui la sua <b>pellicola giocabile da 3 minuti</b>: rigioca subito la partita unica senza rifare i dialoghi${condActive ? ", oppure affronta le <b>3 Condizioni di Scena</b> del regista per monete e capi esclusivi del Guardaroba." : " (Condizioni di Scena disattivate in Impostazioni · Rivincita Libera attiva)."}</p>
        <div class="rgMetaLine">
          <span>🎞️ Pellicole aperte: <b>${tot.unlockedReels}/${tot.totalReels}</b></span>
          ${condActive ? `<span>🎬 Ciak vinti: <b>${tot.condDone}/${tot.condTotal}</b></span><span>✨ Pellicole d'Oro: <b>${tot.goldReels}</b></span>` : ""}
          <span>👕 Costumi Regia: <b>${rgCosOwned}/${rgCosKeys.length}</b></span>
          <span>🪙 Monete: <b>${coins}</b></span>
        </div>
        <div class="rgProg"><i style="width:${Math.max(3, pct)}%"></i></div>
      </div>`;

      html += `<div class="rgControls">
        <input type="search" class="rgSearch" id="rgSearchInp" placeholder="Cerca pellicola o saga..." value="${esc(SEARCH_Q)}" aria-label="Cerca pellicola">
      </div>`;

      html += `<div class="rgTabs">
        ${[
          ["all", `Tutte (${cat.length})`],
          ["open", `🔓 Aperte (${tot.unlockedReels})`],
          ...(condActive ? [["todo", "🎬 Ciak da girare"], ["gold", `✨ Pellicole d'Oro (${tot.goldReels})`]] : []),
        ].map(([k, lbl]) => `<button type="button" class="rgTab${FILTER === k ? " on" : ""}" data-f="${k}">${lbl}</button>`).join("")}
      </div>`;

      if (!filtered.length) {
        html += `<div class="rgCardBox" style="text-align:center;color:#94a3b8;padding:22px 12px">Nessuna pellicola corrisponde al filtro selezionato.${tot.unlockedReels === 0 ? "<br>Concludi una saga nel Salone per accendere il primo proiettore!" : ""}</div>`;
      } else {
        html += `<div class="rgList">${filtered.map((reel) => {
          const open = isUnlocked(reel.id);
          const st = reelStats(reel, r);
          if (!open) {
            return `<div class="rgRow lock" data-lock="${esc(reel.id)}">
              <div class="rgIcon">🔒</div>
              <div class="rgInfo">
                <b>Pellicola sigillata · ${esc(reel.saga.t)}</b>
                <span>Concludi la saga per sbloccare la rivincita rapida della sua partita unica.</span>
              </div>
              <div class="rgRight" style="color:#64748b">Sigillata</div>
            </div>`;
          }
          const rightTxt = condActive
            ? (st.gold ? "✨ 3/3" : `🎬 ${st.count}/3`)
            : (st.freeCount ? `▶ ${st.freeCount}` : "▶ Gioca");
          return `<div class="rgRow${condActive && st.gold ? " gold" : ""}" data-reel="${esc(reel.id)}">
            <div class="rgIcon">${reel.e}</div>
            <div class="rgInfo">
              <b>${esc(reel.t)} · <span style="color:#ffd23f;font-weight:700">${esc(reel.saga.t)}</span></b>
              <span>${esc(reel.d)}</span>
            </div>
            <div class="rgRight">${rightTxt}</div>
          </div>`;
        }).join("")}</div>`;
      }

      if (condActive) {
        html += `<div class="rgSec"><span>👕 Premi di Guardaroba della Regia</span><span>solo estetici · ${rgCosOwned}/${rgCosKeys.length}</span></div>
        <div class="rgCosStrip">${rgCosKeys.map((k) => {
          const c = REGIA_COSM[k];
          const has = ownedCos.has(k);
          const req = c.needCond ? `${tot.condDone}/${c.needCond} Ciak` : `${tot.goldReels}/${c.needGold} Oro`;
          return `<div class="rgCosItem${has ? " own" : ""}" data-cos="${esc(k)}" style="cursor:${has ? "pointer" : "default"}">
            <div><b style="display:block;font-size:12.5px">${has ? "✓ " : "🔒 "}${esc(c.label)}</b><span style="font-size:11px;color:#94a3b8">${esc(c.from)}</span></div>
            <span style="font-weight:800;color:${has ? "#4fd1a5" : "#ffd23f"};white-space:nowrap">${has ? "Apri ▸" : req}</span>
          </div>`;
        }).join("")}</div>`;
      }

      body.innerHTML = html;

      const inp = body.querySelector("#rgSearchInp");
      if (inp) {
        inp.oninput = (e) => {
          SEARCH_Q = e.target.value;
          const pos = inp.selectionStart;
          renderList();
          const inp2 = body.querySelector("#rgSearchInp");
          if (inp2) { inp2.focus(); safe(() => inp2.setSelectionRange(pos, pos), null); }
        };
      }
      body.querySelectorAll("[data-f]").forEach((b) => {
        b.onclick = () => { FILTER = b.dataset.f; renderList(); };
      });
      body.querySelectorAll("[data-reel]").forEach((row) => {
        row.onclick = () => openReel(row.dataset.reel, () => openHub(BACK_FN));
      });
      body.querySelectorAll("[data-lock]").forEach((row) => {
        row.onclick = () => {
          const sid = row.dataset.lock;
          const S = sal();
          if (S && typeof S.openSaga === "function") {
            closeModal();
            S.openSaga(sid, () => openHub(BACK_FN));
          }
        };
      });
      body.querySelectorAll("[data-cos]").forEach((el) => {
        const cid = el.dataset.cos;
        if (ownedCos.has(cid)) {
          el.onclick = () => {
            const S = sal();
            if (S && typeof S.openGuardarobaItem === "function") {
              closeModal();
              S.openGuardarobaItem(cid, () => openHub(BACK_FN));
            }
          };
        }
      });
    };

    renderList();
  }

  function openReel(sagaId, backTo) {
    const cat = buildCatalog();
    const reel = cat.find((x) => x.id === sagaId);
    if (!reel || !isUnlocked(sagaId)) {
      openHub(backTo || BACK_FN);
      return;
    }
    registerCosmetics();
    const condActive = isOn();
    const backHandler = typeof backTo === "function" ? backTo : () => openHub(BACK_FN);
    const body = ensureShell(`${reel.e} ${esc(reel.t)}`, backHandler);

    let selPw = "fulmine";
    const opponents = reel.opp.map((o, idx) => ({ o, idx, boss: false })).concat([{ o: reel.boss, idx: 99, boss: true }]);
    let selOppIdx = 0;

    const draw = () => {
      const rNow = load();
      const stNow = reelStats(reel, rNow);
      const bestSec = stNow.bestMs ? `${Math.max(1, Math.round(stNow.bestMs / 1000))}s` : "—";

      let html = `<div class="rgCardBox${condActive && stNow.gold ? " gold" : ""}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap">
          <div>
            <span style="font-size:11.5px;color:#ffd23f;font-weight:800">${reel.saga.e} ${esc(reel.saga.t)}</span>
            <h3 style="margin:2px 0 6px;font:900 18px 'Dela Gothic One',sans-serif;color:#fff">${esc(reel.t)}</h3>
          </div>
          ${condActive ? `<span style="padding:4px 9px;border-radius:8px;background:#0b1326;border:1px solid #ffd23f66;font-size:12px;font-weight:800;color:#ffd23f">${stNow.gold ? "✨ Pellicola d'Oro 3/3" : `🎬 Ciak ${stNow.count}/3`}</span>` : ""}
        </div>
        <p class="rgSub">${esc(reel.d)}</p>
        <p class="rgQuote">${esc(reel.quote)}</p>
        <div class="rgMetaLine">
          <span>▶ Rivincite libere: <b>${stNow.freeCount}</b></span>
          <span>⏱️ Miglior ciak: <b>${bestSec}</b></span>
        </div>
      </div>`;

      if (reel.power) {
        html += `<div class="rgSec"><span>⚡ Superpotere in campo</span></div>
        <div class="rgTabs">${["fulmine", "gigante", "calamita", "gelo", "doppio"].map((pw) => `<button type="button" class="rgTab${selPw === pw ? " on" : ""}" data-pw="${pw}">${pw}</button>`).join("")}</div>`;
      }

      html += `<div class="rgSec"><span>▶ Rivincita Libera · 3 Minuti</span><span>senza vincoli</span></div>
      <div class="rgCardBox">
        <p class="rgSub" style="margin-bottom:8px">Scegli chi mandare in scena e gioca subito la partita originale senza dialoghi.</p>
        <div class="rgTabs" style="margin-bottom:10px">${opponents.map((it, i) => `<button type="button" class="rgTab${selOppIdx === i ? " on" : ""}" data-opp="${i}">${it.boss ? "👑 " : "⚽ "}${esc(it.o.name)}</button>`).join("")}</div>
        <button type="button" class="rgActionBtn" id="rgBtnFree" style="width:100%">▶ Avvia Rivincita Libera contro «${esc(opponents[selOppIdx].o.name)}»</button>
      </div>`;

      if (condActive) {
        html += `<div class="rgSec"><span>🎬 Le 3 Condizioni di Scena</span><span>+30 🪙 bonus col 3/3</span></div>`;
        html += reel.conditions.map((c) => {
          const done = !!rNow.done[`${reel.id}:${c.id}`];
          return `<div class="rgCondRow${done ? " done" : ""}">
            <div class="rgCondTxt">
              <b>${c.icon} ${esc(c.ciak)} · ${esc(c.title)} ${done ? '<span style="color:#4fd1a5">✓ Girata</span>' : ""}</b>
              <span>${esc(c.desc)}</span>
              <div class="rgCondReward">${done ? "Già in archivio · rigiocabile per puro gusto" : `Premio prima volta: +${c.coins} 🪙 monete`}</div>
            </div>
            <button type="button" class="${done ? "rgGhostBtn" : "rgActionBtn"}" data-cond="${c.id}">${done ? "↻ Rigira" : "🎬 Ciak!"}</button>
          </div>`;
        }).join("");
      } else {
        html += `<div class="salRegiaLock">⚙️ Le <b>Condizioni di Scena</b> sono impostate su «Solo rivincita libera» in Impostazioni.</div>`;
      }

      html += `<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
        <button type="button" class="rgGhostBtn" id="rgBackCatalog" style="flex:1">◂ Tutte le pellicole</button>
        <button type="button" class="rgGhostBtn" id="rgBackSaga" style="flex:1">${reel.saga.e} Scheda Saga</button>
      </div>`;

      body.innerHTML = html;

      body.querySelectorAll("[data-pw]").forEach((b) => {
        b.onclick = () => { selPw = b.dataset.pw; draw(); };
      });
      body.querySelectorAll("[data-opp]").forEach((b) => {
        b.onclick = () => { selOppIdx = +b.dataset.opp || 0; draw(); };
      });
      const freeBtn = body.querySelector("#rgBtnFree");
      if (freeBtn) {
        freeBtn.onclick = () => {
          const pick = opponents[selOppIdx] || opponents[0];
          launchTake(reel, { opp: pick.o, boss: pick.boss, pw: selPw }, (rep) => openDebrief(reel, rep, backHandler));
        };
      }
      body.querySelectorAll("[data-cond]").forEach((b) => {
        b.onclick = () => {
          const cond = reel.conditions.find((x) => x.id === b.dataset.cond);
          if (cond) launchTake(reel, { cond, pw: selPw }, (rep) => openDebrief(reel, rep, backHandler));
        };
      });
      body.querySelector("#rgBackCatalog").onclick = () => openHub(BACK_FN);
      body.querySelector("#rgBackSaga").onclick = () => {
        const S = sal();
        closeModal();
        if (S && typeof S.openSaga === "function") S.openSaga(reel.id, () => openHub(BACK_FN));
      };
    };

    draw();
  }

  function openDebrief(reel, rep, backHandler) {
    const body = ensureShell(rep.won ? "🎬 Buona la Prima!" : "🎬 Taglia! Da Rigirare", () => openReel(reel.id, backHandler));
    const hasScore = rep.res && typeof rep.res.a === "number" && typeof rep.res.b === "number";
    const sec = Math.max(1, Math.round((rep.elapsed || 1000) / 1000));
    const st = reelStats(reel, load());

    let rewardHtml = "";
    if (rep.coinsEarned > 0) {
      rewardHtml += `<div class="rgCardBox gold" style="margin-top:10px">
        <b style="color:#ffd23f;font-size:15px">🪙 +${rep.coinsEarned} Monete incassate al botteghino!</b>
        ${rep.goldBonusEarned > 0 ? `<div style="font-size:12.5px;color:#fde68a;margin-top:4px">✨ Include +${rep.goldBonusEarned} monete per aver completato la <b>Pellicola d'Oro (3/3)</b> di «${esc(reel.saga.t)}»!</div>` : ""}
      </div>`;
    } else if (rep.cond && rep.won) {
      rewardHtml += `<p class="rgSub" style="margin-top:8px;color:#93c5fd">✓ Ciak già timbrato in archivio: nessun gettone extra, solo applausi in cabina.</p>`;
    }

    if (rep.newCos && rep.newCos.length) {
      rewardHtml += `<div class="rgCardBox gold" style="margin-top:10px">
        <b style="color:#4fd1a5;font-size:14px">👕 Nuovo capo sbloccato nel Guardaroba!</b>
        ${rep.newCos.map((c) => `<div style="margin-top:5px;font-size:13px;color:#fff">• <b>${esc(c.label)}</b></div>`).join("")}
      </div>`;
    }

    body.innerHTML = `<div class="rgClapBanner">
      <div class="rgClapStripe"></div>
      <div style="font-size:12px;color:#ffd23f;font-weight:800">${rep.cond ? `${esc(rep.cond.ciak)} · ${esc(rep.cond.title)}` : "RIVINCITA LIBERA"}</div>
      <h3 style="margin:4px 0 6px;font:900 21px 'Dela Gothic One',sans-serif;color:${rep.won ? "#4fd1a5" : "#fbbf24"}">
        ${rep.won ? "✓ BUONA LA PRIMA!" : "✕ CI VUOLE UN ALTRO CIAK"}
      </h3>
      <p class="rgSub">
        ${esc(reel.t)} contro <b>${esc(rep.opp.name)}</b>${hasScore ? ` · Risultato sul campo: <b style="color:#fff">${rep.res.a}–${rep.res.b}</b>` : ""} · Durata ripresa: <b>${sec}s</b>.
      </p>
      ${isOn() ? `<div class="rgMetaLine"><span>Stato pellicola: <b>${st.gold ? "✨ 3/3 Pellicola d'Oro" : `${st.count}/3 Condizioni di Scena`}</b></span></div>` : ""}
    </div>
    ${rewardHtml}
    <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
      <button type="button" class="rgActionBtn" id="rgRetryBtn">↻ Rigira subito questa scena</button>
      <button type="button" class="rgGhostBtn" id="rgToReelBtn">🎥 Torna alla scheda di «${esc(reel.t)}»</button>
      ${rep.newCos && rep.newCos.length ? `<button type="button" class="rgGhostBtn" id="rgToGuardaBtn">👕 Prova subito nel Guardaroba</button>` : ""}
      <button type="button" class="rgGhostBtn" id="rgToHubBtn">🏛️ Catalogo Cabina di Regia</button>
    </div>`;

    body.querySelector("#rgRetryBtn").onclick = () => {
      launchTake(reel, rep.cond ? { cond: rep.cond } : { opp: rep.opp, boss: rep.isBoss }, (r2) => openDebrief(reel, r2, backHandler));
    };
    body.querySelector("#rgToReelBtn").onclick = () => openReel(reel.id, backHandler);
    const gBtn = body.querySelector("#rgToGuardaBtn");
    if (gBtn) {
      gBtn.onclick = () => {
        const S = sal();
        closeModal();
        if (S && typeof S.openGuardarobaItem === "function") {
          S.openGuardarobaItem(rep.newCos[0].id, () => openReel(reel.id, backHandler));
        }
      };
    }
    body.querySelector("#rgToHubBtn").onclick = () => openHub(BACK_FN);
  }

  function renderSagaDetailBlock(sagaId, completed) {
    injectCss();
    const cat = buildCatalog();
    const reel = cat.find((x) => x.id === sagaId);
    if (!reel) return "";
    if (!completed) {
      return `<div class="salRegiaLock">🎥 <b>Cabina di Regia:</b> concludi la saga per sbloccare la rivincita rapida della sua partita unica.</div>`;
    }
    const st = reelStats(reel, load());
    const condActive = isOn();
    const badge = condActive
      ? (st.gold ? "✨ Pellicola d'Oro 3/3" : `🎬 Ciak ${st.count}/3`)
      : "▶ Rivincita rapida";
    return `<div class="salRegiaBox" data-regia-box="${esc(sagaId)}">
      <h4><span>🎥 Cabina di Regia · ${esc(reel.t)}</span><span>${badge}</span></h4>
      <p>Salta i dialoghi e scendi subito nella partita unica della saga${condActive ? " o affronta le 3 Condizioni di Scena per monete e costumi." : "."}</p>
      <div class="salRegiaBtns">
        <button type="button" class="salRegiaFree" data-regia-free="${esc(sagaId)}">▶ Partita Libera</button>
        <button type="button" class="salRegiaOpen" data-regia-open="${esc(sagaId)}">${condActive ? "🎬 Condizioni di Scena" : "🎥 Scelta Avversario"}</button>
      </div>
    </div>`;
  }

  function bindSagaDetailBlock(container, sagaObj) {
    if (!container || !sagaObj) return;
    const fBtn = container.querySelector("[data-regia-free]");
    const oBtn = container.querySelector("[data-regia-open]");
    const cat = buildCatalog();
    const reel = cat.find((x) => x.id === sagaObj.id);
    if (!reel) return;
    if (fBtn) {
      fBtn.onclick = (e) => {
        e.stopPropagation();
        const S = sal();
        launchTake(reel, { opp: reel.opp[0], boss: false }, (rep) => {
          openDebrief(reel, rep, () => {
            closeModal();
            if (S && typeof S.openSaga === "function") S.openSaga(sagaObj.id);
          });
        });
      };
    }
    if (oBtn) {
      oBtn.onclick = (e) => {
        e.stopPropagation();
        const S = sal();
        if (S && typeof S.close === "function") S.close();
        openReel(sagaObj.id, () => {
          closeModal();
          if (S && typeof S.openSaga === "function") S.openSaga(sagaObj.id);
        });
      };
    }
  }

  registerCosmetics();

  window.__regia = {
    open: (back) => openHub(back),
    openReel: (sagaId, back) => openReel(sagaId, back),
    close: closeModal,
    on: isOn,
    setOn,
    forSaga: (sagaId) => buildCatalog().find((x) => x.id === sagaId) || null,
    catalog: () => buildCatalog(),
    isUnlocked,
    stats: (sagaId) => {
      const reel = buildCatalog().find((x) => x.id === sagaId);
      return reel ? reelStats(reel, load()) : null;
    },
    totals: globalTotals,
    playFree: (sagaId, cb) => {
      const reel = buildCatalog().find((x) => x.id === sagaId);
      if (!reel || !isUnlocked(sagaId)) return false;
      return launchTake(reel, { opp: reel.opp[0], boss: false }, cb);
    },
    playCondition: (sagaId, condId, cb) => {
      const reel = buildCatalog().find((x) => x.id === sagaId);
      if (!reel || !isUnlocked(sagaId) || !isOn()) return false;
      const cond = reel.conditions.find((c) => c.id === condId);
      if (!cond) return false;
      return launchTake(reel, { cond }, cb);
    },
    renderSagaDetailBlock,
    bindSagaDetailBlock,
  };
})();
