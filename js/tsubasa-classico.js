// =========================================================================
// TSUBASA CLASSICO · partita a comandi a turni (stile Captain Tsubasa NES/PS)
// Niente corsa: la palla passa da giocatore a giocatore, ogni turno si sceglie Dribbling / Passaggio / Tiro
// (o Contrasto / Intercetto in difesa), si può spendere Grinta per una tecnica speciale con cut-in.
// Torneo del Mandorlo (4 partite con storia) + Amichevole libera.
// Salvataggio: "ali-di-rondine.tsubasa-classico". Ricompense: solo monete (prima vittoria di ogni partita) e cosmetici.
// Nessun effetto su statistiche, storia o Carriera. Con ?debug espone window.__tc.
// =========================================================================
(function () {
  "use strict";

  const K_SAVE = "ali-di-rondine.tsubasa-classico";
  const DEBUG = /[?&]debug/.test(location.search);
  const HALF = 12, LIMIT = HALF * 2, EXTRA = 4;
  const COINS = [30, 45, 60, 120];

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const sfx = (k) => { try { if (window.sfx) window.sfx(k); } catch (e) { /* ok */ } };
  const $ = (id) => document.getElementById(id);

  // ---------- SALVATAGGIO ----------
  function defSave() {
    return { v: 1, cleared: [false, false, false, false], paid: [false, false, false, false], played: 0, wins: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, friendly: { played: 0, wins: 0, draws: 0 }, useHero: true, trophy: false, coins: 0, seenIntro: false, bestMargin: 0 };
  }
  const nn = (v) => Math.max(0, Math.round(+v) || 0);
  function loadSave() {
    const d = defSave();
    try {
      const r = JSON.parse(localStorage.getItem(K_SAVE) || "null");
      if (r && typeof r === "object") {
        for (let i = 0; i < 4; i++) {
          d.cleared[i] = !!(Array.isArray(r.cleared) && r.cleared[i]);
          d.paid[i] = !!(Array.isArray(r.paid) && r.paid[i]) && d.cleared[i];
        }
        // una partita è sbloccata solo se le precedenti sono vinte
        for (let i = 1; i < 4; i++) if (!d.cleared[i - 1] && d.cleared[i]) { d.cleared[i] = false; d.paid[i] = false; }
        ["played", "wins", "losses", "goalsFor", "goalsAgainst", "coins", "bestMargin"].forEach((k) => { d[k] = nn(r[k]); });
        const f = r.friendly && typeof r.friendly === "object" ? r.friendly : {};
        d.friendly = { played: nn(f.played), wins: nn(f.wins), draws: nn(f.draws) };
        d.useHero = r.useHero !== false;
        d.trophy = !!r.trophy && d.cleared[3];
        d.seenIntro = !!r.seenIntro;
      }
    } catch (e) { /* default */ }
    return d;
  }
  let SV = loadSave();
  const save = () => { try { localStorage.setItem(K_SAVE, JSON.stringify(SV)); } catch (e) { /* ok */ } };

  // ---------- COSMETICI (solo estetici) ----------
  function registerCosmetics() {
    try {
      const api = window.__borgoApi;
      if (!api || !api.COSM || api.COSM.mandorloArancio) return !!(api && api.COSM);
      const rd = () => { try { const d = JSON.parse(localStorage.getItem(K_SAVE) || "null"); return d && Array.isArray(d.cleared) ? d.cleared : []; } catch (e) { return []; } };
      api.COSM.mandorloArancio = { kind: "shirt", label: "Maglia arancio del Mandorlo", val: "#e8742a", from: "Vinci la semifinale del Trofeo del Mandorlo (Tsubasa Classico)", story: () => !!rd()[2] };
      api.COSM.mandorloOro = { kind: "shirt", label: "Maglia d'oro del Mandorlo", val: "#d9b24a", from: "Vinci il Trofeo del Mandorlo (Tsubasa Classico)", story: () => !!rd()[3] };
      return true;
    } catch (e) { return false; }
  }
  (function hook(n) { if (!registerCosmetics() && n < 40) setTimeout(() => hook(n + 1), 300); })(0);

  // ---------- CAMPIONE ----------
  function getHero() {
    try { const h = typeof window.heroLoad === "function" ? window.heroLoad() : null; return h && h.name ? h : null; } catch (e) { return null; }
  }
  function castHero(h) {
    try {
      const api = window.__borgoApi;
      if (api && api.CAST && h) api.CAST.hero = { name: h.name, tag: "", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#2a1a0a", bg: [h.shirt, "#ffd23f"], shirt: h.shirt, num: String(h.num), acc: h.acc };
    } catch (e) { /* ok */ }
  }

  // ---------- RITRATTI ----------
  const PORTS = {};
  function portUrl(p) {
    try {
      const api = window.__borgoApi;
      if (!api || typeof api.portraitImg !== "function" || !p) return "";
      const key = p.id === "hero" ? "hero:" + (p.sig || "") : p.id;
      if (key in PORTS) return PORTS[key];
      if (p.id === "hero") castHero(getHero());
      const u = api.portraitImg(p.id, p.spec || undefined) || "";
      PORTS[key] = u;
      return u;
    } catch (e) { return ""; }
  }
  const HAIRS = ["#2b1d14", "#111111", "#e8d08a", "#b8452a", "#9a9a9a", "#5a3a22"];
  const SKINS = ["#f5d6b8", "#f2c9a0", "#e0ac7e", "#b9804f", "#8a5a3a"];
  const STYLES_M = ["spiky", "messy", "buzz", "slick"], STYLES_F = ["long", "bun", "messy"];
  function mkSpec(name, color, fem, seed) {
    let h = seed || 7; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const st = fem ? STYLES_F : STYLES_M;
    return { name, tag: "", hair: HAIRS[h % HAIRS.length], style: st[(h >>> 3) % st.length], skin: SKINS[(h >>> 5) % SKINS.length], eye: "#2a1a0a", bg: [color, "#e8f0ff"], shirt: color };
  }

  // ---------- SQUADRE ----------
  // statistiche: [tiro, dribbling, passaggio, contrasto]; i portieri hanno "gk"
  function P(id, name, role, s, o) {
    o = o || {};
    const gr = o.gr || 70;
    return { id, name, short: o.short || name.split(" ")[0], role, tiro: s[0], drib: s[1], pass: s[2], contr: s[3], gk: o.gk || 0, gr, mx: gr, tech: o.tech || {}, spec: o.spec || null, side: "", line: o.line || "" };
  }
  const T = (name, line, b, cost, extra) => Object.assign({ name, line, b, cost: cost || 26, c1: "#b3202c", c2: "#ffd23f" }, extra || {});

  function buildUs() {
    const h = SV.useHero ? getHero() : null;
    const L = [];
    if (h) {
      castHero(h);
      const bias = { saetta: { t: 4, p: -2 }, serpentina: { d: 4, c: -2 }, parabola: { p: 4, t: -2 }, martello: { c: 4, d: -2 }, traversa: { t: 2, p: 2, d: -2 }, muro: { t: 1, d: 1, p: 1, c: 1 } }[h.shot] || { t: 4, p: -2 };
      const st = [20 + (bias.t || 0), 18 + (bias.d || 0), 15 + (bias.p || 0), 13 + (bias.c || 0)];
      const sn = String(h.shotName || "TIRO SPECIALE").toUpperCase();
      const kindMap = {
        saetta: { b: 10, line: "Tutta la forza in un solo colpo!" },
        serpentina: { b: 8, line: "La palla striscia, si piega, e nessuno la vede arrivare!", bypass: true },
        parabola: { b: 8, line: "Un arco impossibile sopra le teste di tutti!", bypass: true },
        martello: { b: 11, line: "Un colpo che fa tremare i pali!", gkMul: 0.92 },
        traversa: { b: 8, line: "Prende il legno… e rientra, perché deve!", woodIn: true },
        muro: { b: 9, line: "Sponda dal muro del porto: nessuno lo aspetta!", bypass: true },
      }[h.shot] || { b: 9, line: "Ci metto tutto quello che ho!" };
      const hero = P("hero", h.name, "FW", st, { gr: 90, short: h.name.split(" ")[0], tech: {
        shot: [T(sn, kindMap.line, kindMap.b, 30, { bypass: kindMap.bypass, gkMul: kindMap.gkMul, woodIn: kindMap.woodIn, c1: "#1d3fa3", c2: "#ffd23f" })],
        drib: [T("SLALOM DEL CARUGGIO", "Il caruggio è stretto, ma io passo lo stesso!", 8, 22, { c1: "#1e6b3a", c2: "#ffd23f" })],
      } });
      hero.sig = [h.name, h.hair, h.skin, h.shirt, h.style, h.acc, h.num].join("|");
      L.push(hero);
    } else {
      L.push(P("leo", "Leo Moretti", "FW", [22, 20, 16, 14], { gr: 90, short: "Leo", tech: {
        shot: [T("TIRO DELLA RONDINE", "Vola, Rondine, vola!", 10, 30, { c1: "#b3202c", c2: "#ff9d2e" }), T("FOGLIA SECCA", "Sale, sale… e poi cade proprio lì!", 7, 24, { c1: "#1e6b3a", c2: "#ffd23f", bypass: true }), T("ROVESCIATA", "Dà le spalle alla porta, e si capovolge nel cielo!", 9, 28, { c1: "#3a1450", c2: "#ff4d5a" })],
        drib: [T("SLALOM DEL CARUGGIO", "Il caruggio è stretto, ma io passo lo stesso!", 8, 22, { c1: "#1e6b3a", c2: "#ffd23f" })],
      } }));
    }
    L.push(P("tommy", "Tommy", "FW", [20, 15, 19, 16], { gr: 80, short: "Tommy", tech: {
      shot: [T("CANNONATA DI TOMMY", "Passare è bello. Ma questa la tiro io!", 9, 28, { c1: "#b3202c", c2: "#ffffff" })],
      pass: [T("REGALO DI TOMMY", "Passare la palla è il regalo più bello!", 8, 20, { c1: "#57d68d", c2: "#ffffff" })],
    } }));
    L.push(P("gigi", "Gigi", "MF", [16, 22, 14, 12], { gr: 75, short: "Gigi", tech: {
      drib: [T("ZIGZAG DEL GABBIANO", "Un gabbiano non segue le righe!", 9, 22, { c1: "#ff4d5a", c2: "#9be2ff" })],
      shot: [T("GABBIANO IMPAZZITO", "Dove va? Non lo sa nemmeno lui!", 8, 24, { c1: "#ff4d5a", c2: "#9be2ff", wild: true })],
    } }));
    L.push(P("fede", "Fede", "MF", [17, 17, 23, 15], { gr: 80, short: "Fede", tech: {
      pass: [T("FILO DI SETA", "Un filo teso da qui al compagno: non si spezza!", 9, 22, { c1: "#1d3fa3", c2: "#e8f0ff" })],
      shot: [T("PARABOLA DI FEDE", "Calcolata al millimetro, come un compito in classe!", 8, 26, { c1: "#1d3fa3", c2: "#e8f0ff", bypass: true })],
    } }));
    L.push(P("bruno", "Bruno", "DF", [23, 16, 15, 20], { gr: 85, short: "Bruno", tech: {
      def: [T("MURO DI BRUNO", "Di qui non si passa. Punto.", 9, 24, { c1: "#3a1450", c2: "#ff9d2e" })],
      shot: [T("BOLIDE DI BRUNO", "Dalla difesa, con furia!", 9, 28, { c1: "#3a1450", c2: "#ff9d2e" })],
    } }));
    L.push(P("baciccia", "Baciccia", "DF", [12, 8, 12, 17], { gr: 60, short: "Baciccia", tech: {
      def: [T("FERMO COME UNA BITTA", "Quarant'anni di porto: io non mi sposto!", 8, 20, { c1: "#1f5f8a", c2: "#9be2ff" })],
    } }));
    L.push(P("nico", "Nico", "GK", [8, 8, 12, 10], { gr: 80, gk: 18, short: "Nico", tech: {
      gk: [T("GATTO VOLANTE", "Consiste nel volare. Come un gatto!", 10, 28, { c1: "#3fa7ff", c2: "#9be2ff" })],
    } }));
    return { key: "us", name: "Rondine FC", code: "RON", color: "#ff4d5a", players: L };
  }

  const TEAMS = [
    {
      key: "pastai", name: "I Pastai di Val Cerreto", code: "PAS", color: "#e8c24a", fem: false, stars: 1,
      players: [
        P("tc_grissino", "Il Grissino", "GK", [6, 6, 9, 9], { gk: 15, gr: 60, short: "Grissino" }),
        P("tc_ottavio", "Ottavio Pennacchi", "DF", [11, 10, 11, 15], { gr: 70, short: "Ottavio", tech: { def: [T("TACKLE AL DENTE", "Né crudo né scotto: cotto al punto giusto!", 7, 20, { c1: "#e8c24a", c2: "#7a3a10" })] } }),
        P("tc_biagio", "Biagio Tortiglioni", "DF", [10, 9, 10, 14], { gr: 60, short: "Biagio" }),
        P("tc_gino", "Gino Strozzapreti", "MF", [13, 14, 15, 13], { gr: 65, short: "Gino" }),
        P("tc_dino", "Dino Mafalde", "MF", [12, 15, 13, 12], { gr: 60, short: "Dino" }),
        P("tc_rino", "Rino Pappardelle", "FW", [18, 15, 12, 10], { gr: 70, short: "Rino", tech: { shot: [T("TIRO AL SUGO", "Succulento, rosso e potente!", 7, 26, { c1: "#c9302c", c2: "#ffd23f" })] } }),
        P("tc_tito", "Tito Trofie", "FW", [16, 14, 11, 9], { gr: 60, short: "Tito" }),
      ],
    },
    {
      key: "bruma", name: "Capo Bruma FC", code: "BRU", color: "#2fb3c9", fem: true, stars: 2,
      players: [
        P("tc_nives", "Nives Rolando", "GK", [6, 6, 10, 10], { gk: 17, gr: 70, short: "Nives" }),
        P("tc_carla", "Carla Bozzo", "DF", [11, 11, 12, 18], { gr: 70, short: "Carla" }),
        P("tc_ilaria", "Ilaria Pesci", "DF", [10, 10, 13, 17], { gr: 70, short: "Ilaria", tech: { def: [T("ONDA D'URTO", "Il mare non chiede permesso!", 8, 22, { c1: "#2fb3c9", c2: "#ffffff" })] } }),
        P("tc_marisa", "Marisa Scotto", "MF", [15, 16, 20, 16], { gr: 80, short: "Marisa", tech: { pass: [T("PASSAGGIO DI MAREA", "Come la marea: arriva sempre dove deve!", 8, 22, { c1: "#2fb3c9", c2: "#ffffff" })] } }),
        P("tc_ada", "Ada Fenoglio", "MF", [14, 20, 15, 14], { gr: 70, short: "Ada", tech: { drib: [T("SLALOM TRA GLI SCOGLI", "Conosco ogni scoglio, a occhi chiusi!", 8, 22, { c1: "#2fb3c9", c2: "#16325c" })] } }),
        P("tc_lorena", "Lorena Sciutto", "FW", [20, 18, 13, 11], { gr: 80, short: "Lorena", tech: { shot: [T("ONDA LUNGA", "Un'onda lunga, che scavalca tutto!", 8, 28, { c1: "#2fb3c9", c2: "#ffffff", bypass: true })] } }),
        P("tc_bea", "Bea Marchetti", "FW", [18, 17, 14, 10], { gr: 65, short: "Bea" }),
      ],
    },
    {
      key: "telmo", name: "Cantieri San Telmo", code: "TEL", color: "#b0722e", fem: false, stars: 3,
      players: [
        P("tc_ferruccio", "Ferruccio Ansaldi", "GK", [6, 6, 12, 11], { gk: 20, gr: 80, short: "Ferruccio", tech: { gk: [T("MANI DA GRU", "Ho sollevato scafi interi. Un pallone, figuriamoci!", 8, 28, { c1: "#b0722e", c2: "#e8f0ff" })] } }),
        P("tc_walter", "Walter Dessì", "DF", [12, 10, 13, 20], { gr: 75, short: "Walter" }),
        P("tc_pino", "Pino Canepa", "DF", [11, 10, 12, 19], { gr: 75, short: "Pino" }),
        P("tc_tano", "Gustavo «Tano» Bellucci", "MF", [17, 11, 20, 22], { gr: 85, short: "Tano", tech: { def: [T("MURO DEL CANTIERE", "Cinquant'anni di lamiere: io non mi piego!", 9, 24, { c1: "#b0722e", c2: "#ffd23f" })], pass: [T("LANCIO DEL VARO", "Come uno scafo che scende in mare!", 8, 24, { c1: "#b0722e", c2: "#9be2ff" })] } }),
        P("tc_elio", "Elio Barabino", "MF", [14, 15, 17, 17], { gr: 70, short: "Elio" }),
        P("tc_rolando", "Rolando Cevasco", "FW", [21, 17, 13, 12], { gr: 80, short: "Rolando", tech: { shot: [T("COLPO DI MAGLIO", "Un martello da carpentiere sul pallone!", 9, 30, { c1: "#b0722e", c2: "#ffffff" })] } }),
        P("tc_nino", "Nino Piaggio", "FW", [18, 18, 14, 11], { gr: 70, short: "Nino" }),
      ],
    },
    {
      key: "granvista", name: "Accademia Gran Vista", code: "GRV", color: "#e9d98a", fem: false, stars: 4,
      players: [
        P("tc_lorenzo", "Lorenzo Maffei", "GK", [6, 6, 14, 12], { gk: 23, gr: 90, short: "Lorenzo", tech: { gk: [T("MANI DI VELLUTO", "Una presa morbida come un cappotto di cachemire!", 9, 30, { c1: "#e9d98a", c2: "#1a2a4a" })] } }),
        P("tc_filippo", "Filippo Castelli", "DF", [14, 13, 16, 22], { gr: 80, short: "Filippo" }),
        P("tc_edoardo", "Edoardo Brivio", "DF", [13, 12, 15, 21], { gr: 80, short: "Edoardo", tech: { def: [T("FUORIGIOCO ALGORITMICO", "Secondo i miei calcoli, non passi!", 8, 26, { c1: "#e9d98a", c2: "#1a2a4a" })] } }),
        P("tc_augusto", "Augusto Sala", "MF", [17, 17, 23, 19], { gr: 85, short: "Augusto", tech: { pass: [T("GEOMETRIA APPLICATA", "Il triangolo perfetto: il teorema vince!", 9, 24, { c1: "#e9d98a", c2: "#1a2a4a" })] } }),
        P("tc_tancredi", "Tancredi Riva", "MF", [16, 23, 18, 16], { gr: 80, short: "Tancredi", tech: { drib: [T("PIROETTA CERTIFICATA", "Con tanto di timbro e firma!", 9, 24, { c1: "#e9d98a", c2: "#b3202c" })] } }),
        P("tc_valerio", "Valerio Bonsanti", "FW", [24, 22, 17, 12], { gr: 95, short: "Valerio", tech: { shot: [T("ECLISSI DORATA", "Il sole si spegne… e il pallone brilla!", 10, 32, { c1: "#e9d98a", c2: "#1a2a4a" })] } }),
        P("tc_matteo", "Matteo Vismara", "FW", [21, 20, 16, 11], { gr: 80, short: "Matteo", tech: { shot: [T("TIRO SPONSORIZZATO", "Con il logo in bella vista!", 8, 28, { c1: "#e9d98a", c2: "#b3202c" })] } }),
      ],
    },
  ];
  TEAMS.forEach((t) => t.players.forEach((p) => { p.spec = mkSpec(p.name, t.color, !!t.fem, 3); }));

  // ---------- TESTI DI STORIA ----------
  const SPK = {
    v: { name: "Cronista della Pro Loco", emoji: "🎙️" },
    nico: { name: "Nico", id: "nico" }, tommy: { name: "Tommy", id: "tommy" }, gigi: { name: "Gigi", id: "gigi" },
    fede: { name: "Fede", id: "fede" }, bruno: { name: "Bruno", id: "bruno" }, baciccia: { name: "Baciccia", id: "baciccia" },
    ottavio: { name: "Ottavio Pennacchi", team: 0, pid: "tc_ottavio" }, marisa: { name: "Marisa Scotto", team: 1, pid: "tc_marisa" },
    tano: { name: "Tano Bellucci", team: 2, pid: "tc_tano" }, valerio: { name: "Valerio Bonsanti", team: 3, pid: "tc_valerio" },
    lombrichi: { name: "Prof. Lombrichi", team: 3, spec: { name: "Prof. Cesare Lombrichi", tag: "", hair: "#cfcfd6", style: "slick", skin: "#f0d6c0", eye: "#3a5a3a", bg: ["#e9d98a", "#1a2a4a"], shirt: "#1a2a4a", glasses: true } },
  };
  const STORY = [
    {
      pre: [
        ["v", "Campo comunale di Costalta, ore quindici. Il Trofeo del Mandorlo d'Oro, organizzato dalla Pro Loco, ha stampato duemila volantini e preparato undici posti auto. Il mandorlo è vero. È in un vaso. Sarà la coppa."],
        ["ottavio", "Siamo pastai, noi. Ci piace la cottura al dente e il gioco duro. Chi si scuoce a metà partita, perde."],
        ["nico", "Io mi scuocio già dal riscaldamento."],
        ["hero", "Allora oggi cuociamo noi. Dieci minuti di fuoco vivo, poi scolate. Andiamo!"],
      ],
      win: [["ottavio", "Scotti… cioè, scottati. Mi sono scottato io. Vi offro la pasta, comunque: l'abbiamo portata in pentola da casa."], ["tommy", "Si passa il turno E si pranza. Questo torneo mi piace già."]],
      lose: [["ottavio", "Al dente! Perfetto! Si vede che avevate fame di sconfitta."], ["nico", "Non è ancora finita, il torneo. Anzi. Stavolta usiamo la grinta e la testa."]],
    },
    {
      pre: [
        ["v", "Semifinale non ancora, ma quasi: arriva il Capo Bruma FC, la squadra che si allena sulla scogliera quando c'è mare mosso. Quando non c'è mare mosso, lo mette il capitano."],
        ["marisa", "Vi avverto: l'allenatrice urla in tre dialetti diversi. Quando urla in quello della terza vallata, nemmeno noi capiamo cosa vuole."],
        ["gigi", "E quindi vi piace giocare?"],
        ["marisa", "Moltissimo. Soprattutto quando la palla sembra stare ferma e poi invece parte."],
      ],
      win: [["marisa", "Bella partita. Il mare, a volte, perde con chi sa leggere le onde. Offro io il caffè: te lo meriti, capitano."], ["fede", "Quindi anche il mare ha un punto debole: la bassa marea. Appuntato."]],
      lose: [["marisa", "Le onde tornano sempre: le vostre pure. Riprovateci, che quest'allenatrice ha ancora fiato per tre dialetti."], ["tommy", "Ho capito un dialetto su tre. Mi basta per sentirmi in colpa."]],
    },
    {
      pre: [
        ["v", "Semifinale. Davanti al campo c'è una gru ferma e una tuta blu appesa a un cancello. Il cantiere navale San Telmo chiude a fine mese. La squadra di dopolavoro, nata nella mensa nel 1971, gioca la sua ultima partita ufficiale."],
        ["tano", "Nessuno ci ha chiesto se volevamo smettere. Allora giochiamo come se non lo sapessimo. Dal primo all'ultimo minuto, senza risparmiarci."],
        ["baciccia", "Ragazzi… io ho lavorato in banchina con metà di quella squadra. Giocate sul serio. È il modo giusto di salutarli."],
        ["hero", "Non faremo sconti. Niente pena, solo rispetto. Cominciamo."],
      ],
      win: [["tano", "Avete vinto. Ed è giusto così: avete corso e pensato più di noi. Tenete questa."], ["tano", "È la nostra bandierina del '71. Mettetela nello spogliatoio, non in una vetrina: lì la vedranno tutti, e magari qualcuno si ricorderà di noi."], ["v", "Il pubblico applaude in piedi. Qualcuno si asciuga il viso con la manica. Qualcun altro dice che è colpa del polline."]],
      lose: [["tano", "Ragazzi, bella partita. Oggi ci è andata bene, ma domani… domani chissà. Non fate come me: non rimandate le cose importanti."], ["tano", "Venite a trovarmi in banchina, quando riaprite il torneo. Io non ho fretta, e l'ultima partita non ce la toglie nessuno."], ["baciccia", "Rigiochiamola. E stavolta non le diamo l'aria di una cosa già persa."]],
    },
    {
      pre: [
        ["v", "Finale! L'Accademia Gran Vista è arrivata con un pullman a due piani, tre fisioterapisti, un drone e un professore con il tablet. Il mandorlo, in vaso, trema leggermente. Per il vento, giura la Pro Loco."],
        ["lombrichi", "Secondo i nostri modelli la squadra con più dati vince nel 72% dei casi. Voi quanti dati avete?"],
        ["tommy", "Abbiamo la focaccia."],
        ["valerio", "Divertente. Io gioco per vincere. Mio padre guarda sempre il tabellone, mai la partita. Se perdo, non gli piace il tabellone."],
        ["hero", "Allora guarda la partita, stavolta. Te la facciamo vedere noi."],
      ],
      win: [["valerio", "Ho perso. E per la prima volta mi sono divertito. Dillo a quello col tablet, mi raccomando."], ["lombrichi", "Il mio modello è… in aggiornamento. Congratulazioni. Posso fare una foto al mandorlo?"], ["v", "Il Trofeo del Mandorlo d'Oro è vostro! Il mandorlo, in vaso, fiorisce: o almeno così giurano alla Pro Loco, mentre i duemila volantini volano per tutta Costalta."]],
      lose: [["valerio", "Ho vinto. Ma non so perché mi sento come se avessi perso un amico. Rivediamoci, vero?"], ["nico", "Il torneo non finisce qui. Una finale si può rigiocare. Basta saper perdere meglio di come si vince."]],
    },
  ];

  // ---------- STILE ----------
  function injectStyle() {
    if ($("tcStyle")) return;
    const st = document.createElement("style");
    st.id = "tcStyle";
    st.textContent = `
.tc-m{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;height:100vh;height:100dvh;background:radial-gradient(120% 80% at 50% 0%,#14264a 0%,#0a1020 70%);color:#eef3ff;font-family:var(--body,system-ui,-apple-system,"Segoe UI",sans-serif);overflow:hidden;-webkit-tap-highlight-color:transparent}
.tc-m *{box-sizing:border-box}
.tc-h{flex:none;display:flex;align-items:center;gap:8px;padding:6px 10px;background:#0e1830;border-bottom:2px solid #ffd23f55}
.tc-h .tt{flex:1 1 auto;min-width:0;font:800 14px/1.15 var(--body,system-ui);letter-spacing:.03em;color:#ffd23f;overflow-wrap:anywhere}
.tc-h .tt small{display:block;font:600 11px/1.2 var(--body,system-ui);color:#9fb3d9;letter-spacing:0}
.tc-x{flex:none;min-height:40px;min-width:76px;padding:0 12px;border-radius:10px;border:2px solid #ff4d5a;background:#3a0f18;color:#fff;font:800 14px var(--body,system-ui);cursor:pointer;touch-action:manipulation}
.tc-main{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;overflow:hidden}
.tc-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;padding:12px 14px;-webkit-overflow-scrolling:touch}
.tc-act{flex:none;max-height:46%;overflow-y:auto;padding:8px 10px calc(10px + env(safe-area-inset-bottom,0px));background:#0b1226;border-top:2px solid #ffffff22}
.tc-act.tall{max-height:62%}
.tc-prompt{font:700 12.5px/1.3 var(--body,system-ui);color:#ffd23f;margin:0 2px 6px;overflow-wrap:anywhere}
.tc-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.tc-grid.one{grid-template-columns:1fr}
.tc-btn{display:flex;flex-direction:column;justify-content:center;gap:2px;min-height:48px;padding:7px 9px;text-align:left;border-radius:10px;border:2px solid #4a6bd1;background:linear-gradient(#1b2d5c,#13213f);color:#fff;font:700 14px/1.2 var(--body,system-ui);cursor:pointer;touch-action:manipulation;overflow-wrap:anywhere}
.tc-btn small{font:500 11.5px/1.25 var(--body,system-ui);color:#b7c6e8}
.tc-btn.hot{border-color:#ffd23f;background:linear-gradient(#5a3a10,#2e1c08)}
.tc-btn.sp{border-color:#ff4d5a;background:linear-gradient(#5a1424,#2a0a14)}
.tc-btn.gr{border-color:#57d68d;background:linear-gradient(#124a2c,#0a2a1a)}
.tc-btn:disabled{opacity:.45;cursor:default}
.tc-btn:active:not(:disabled){transform:scale(.98)}
.tc-score{flex:none;display:flex;align-items:center;justify-content:center;gap:8px;padding:6px 8px;background:#0e1830;font:800 16px/1.1 var(--body,system-ui)}
.tc-score .tm{flex:1 1 0;min-width:0;font-size:12px;overflow-wrap:anywhere}
.tc-score .tm.r{text-align:right}
.tc-score .sc{flex:none;font-size:22px;color:#fff;background:#000;border:2px solid #ffffff44;border-radius:8px;padding:1px 10px;font-variant-numeric:tabular-nums}
.tc-score .ck{flex:none;font-size:11px;color:#9fb3d9;text-align:center;min-width:54px}
.tc-pitch{flex:none;position:relative;height:clamp(104px,19dvh,170px);margin:0 6px;border:2px solid #ffffff55;border-radius:6px;background:repeating-linear-gradient(90deg,#17603a 0 12.5%,#1b6e42 12.5% 25%)}
.tc-pitch .cl{position:absolute;left:50%;top:0;bottom:0;width:2px;background:#ffffff44}
.tc-pitch .gl{position:absolute;top:32%;bottom:32%;width:7px;background:#ffffff33;border:2px solid #fff}
.tc-pitch .gl.l{left:-2px;border-left:0}.tc-pitch .gl.r{right:-2px;border-right:0}
.fp{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;transition:left .5s,top .5s;pointer-events:none}
.fp i{width:13px;height:13px;border-radius:50%;background:var(--c);border:2px solid #fff;display:block}
.fp b{font:700 8.5px/1 var(--body,system-ui);color:#fff;text-shadow:0 0 3px #000,0 0 3px #000;margin-top:1px;white-space:nowrap}
.fp.mk i{box-shadow:0 0 0 2px #ff4d5a}
.fp.car{z-index:3}.fp.car i{width:17px;height:17px;border-color:#ffd23f;box-shadow:0 0 10px 3px #ffd23f}
.fp.car i::after{content:"⚽";position:absolute;font-size:11px;transform:translate(7px,-6px)}
.fp.car{position:absolute}
.tc-chips{flex:none;display:flex;flex-wrap:wrap;gap:3px;padding:4px 6px;background:#0a1020}
.tc-chip{flex:1 1 38px;min-width:38px;padding:2px 3px;border-radius:6px;background:#16213f;border:1px solid #ffffff22;font:700 10px/1.1 var(--body,system-ui);text-align:center;overflow:hidden}
.tc-chip.on{border-color:#ffd23f;background:#2b2a12}
.tc-chip b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}
.tc-bar{display:block;height:4px;border-radius:3px;background:#000;margin-top:2px;overflow:hidden}
.tc-bar s{display:block;height:100%;background:linear-gradient(90deg,#57d68d,#ffd23f);text-decoration:none}
.tc-duel{flex:none;display:flex;align-items:stretch;gap:4px;padding:6px 8px}
.tc-card{flex:1 1 0;min-width:0;display:flex;gap:6px;align-items:center;padding:5px;border-radius:10px;background:#142244;border:2px solid #ffffff33}
.tc-card.us{border-color:#ff4d5a88}
.tc-card.them{border-color:#ffd23f88;flex-direction:row-reverse;text-align:right}
.tc-pt{flex:none;width:52px;height:52px;border-radius:8px;background:#223a6b center/cover no-repeat;image-rendering:auto;display:flex;align-items:center;justify-content:center;font:800 22px var(--body,system-ui);color:#fff}
.tc-ci{flex:1 1 auto;min-width:0}
.tc-ci b{display:block;font:800 12.5px/1.15 var(--body,system-ui);overflow-wrap:anywhere}
.tc-ci span{display:block;font:600 10.5px/1.3 var(--body,system-ui);color:#9fb3d9;overflow-wrap:anywhere}
.tc-ci span em{font-style:normal;color:#ffd23f;font-weight:800}
.tc-vs{flex:none;align-self:center;font:900 11px var(--body,system-ui);color:#ff4d5a}
@media (max-width:360px){.tc-pt{width:38px;height:38px}.tc-card{gap:4px;padding:4px}.tc-ci b{font-size:11.5px}.tc-ci span{font-size:9.5px}.tc-btn{font-size:13px;padding:6px 7px}.tc-btn small{font-size:11px}.tc-duel{padding:5px 4px}}
.tc-log{flex:1 1 auto;min-height:70px;overflow-y:auto;padding:8px 12px;background:#0a0f1d;border-top:1px solid #ffffff22;font:500 14px/1.4 var(--body,system-ui);-webkit-overflow-scrolling:touch}
.tc-log p{margin:0 0 6px;animation:tcIn .25s ease-out;overflow-wrap:anywhere}
.tc-log p.big{color:#ffd23f;font-weight:800;font-size:16px}
.tc-log p.drama{color:#9fb3d9;font-style:italic}
.tc-log p.us{color:#ffb3bb}
.tc-log p.them{color:#ffe9a0}
.tc-log p.dim{color:#7f90b5;font-size:12.5px}
.tc-log p.sys{color:#57d68d;font-weight:700}
@keyframes tcIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
.tc-cut{position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;overflow:hidden;background:#000;cursor:pointer;animation:tcFlash .25s ease-out}
.tc-cut .bg{position:absolute;inset:-70%;background:repeating-conic-gradient(var(--c1) 0 3deg,#000 3deg 5deg,var(--c2) 5deg 8deg,#000 8deg 9deg);animation:tcSpin 6s linear infinite;opacity:.85}
.tc-cut .sl{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg,#fff 0 .8deg,transparent .8deg 5deg);-webkit-mask-image:radial-gradient(circle at 50% 50%,transparent 20%,#000 75%);mask-image:radial-gradient(circle at 50% 50%,transparent 20%,#000 75%);opacity:.5;animation:tcPulse .5s ease-in-out infinite alternate}
.tc-cut .ports{position:relative;display:flex;gap:6px;justify-content:center}
.tc-cut .pp{width:min(36vw,150px);height:min(36vw,150px);border-radius:14px;border:4px solid #fff;background:#223a6b center/cover no-repeat;transform:skewX(-6deg);box-shadow:0 0 24px #000;display:flex;align-items:center;justify-content:center;font:900 48px var(--body,system-ui);color:#fff;animation:tcSlam .4s cubic-bezier(.2,1.6,.4,1)}
.tc-cut .nm{position:relative;max-width:100%;font:900 clamp(22px,8vw,40px)/1.05 var(--body,system-ui);font-style:italic;text-align:center;color:#fff;text-shadow:3px 3px 0 #000,-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000;transform:skewX(-8deg);overflow-wrap:anywhere;animation:tcSlam .45s .08s both cubic-bezier(.2,1.6,.4,1)}
.tc-cut .ln{position:relative;max-width:92%;font:700 15px/1.35 var(--body,system-ui);text-align:center;color:#fff;background:#000a;padding:6px 12px;border-radius:10px;overflow-wrap:anywhere}
.tc-cut .sk{position:relative;font:600 11px var(--body,system-ui);color:#ffffffaa}
@keyframes tcSpin{to{transform:rotate(360deg)}}
@keyframes tcPulse{from{transform:scale(1)}to{transform:scale(1.15)}}
@keyframes tcSlam{from{opacity:0;transform:scale(2.2) skewX(-8deg)}to{opacity:1;transform:scale(1) skewX(-8deg)}}
@keyframes tcFlash{from{filter:brightness(4)}to{filter:none}}
.tc-goal{position:absolute;inset:0;z-index:25;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,#ffd23fcc,#b3202ccc);cursor:pointer;font:900 clamp(40px,16vw,80px)/1 var(--body,system-ui);font-style:italic;color:#fff;text-shadow:4px 4px 0 #000;text-align:center;padding:10px;animation:tcSlam .5s cubic-bezier(.2,1.6,.4,1)}
.tc-ov{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;padding:20px;background:#000b}
.tc-ov>div{width:100%;max-width:360px;background:#13213f;border:2px solid #ffd23f;border-radius:14px;padding:16px;font:600 15px/1.4 var(--body,system-ui)}
.tc-ov .tc-grid{margin-top:12px}
.tc-card2{margin:0 0 10px;padding:12px;border-radius:12px;background:#142244;border:2px solid #ffffff2a;font:500 14px/1.45 var(--body,system-ui);overflow-wrap:anywhere}
.tc-card2 h3{margin:0 0 4px;font:900 18px/1.15 var(--body,system-ui);color:#ffd23f}
.tc-card2 h4{margin:8px 0 2px;font:800 13px var(--body,system-ui);color:#57d68d}
.tc-card2 p{margin:4px 0}
.tc-big{font:900 38px/1 var(--body,system-ui);text-align:center;margin:6px 0;font-variant-numeric:tabular-nums}
.tc-sc{display:flex;gap:10px;align-items:flex-start;padding:10px}
.tc-sc .pt{flex:none;width:68px;height:68px;border-radius:12px;border:2px solid #ffd23f;background:#223a6b center/cover no-repeat;display:flex;align-items:center;justify-content:center;font:800 28px var(--body,system-ui)}
.tc-sc .tx{flex:1;min-width:0}
.tc-sc .tx b{display:block;color:#ffd23f;font:800 13px var(--body,system-ui);margin-bottom:3px}
.tc-sc .tx div{font:500 15px/1.45 var(--body,system-ui);overflow-wrap:anywhere}
@media (max-height:640px){.tc-pt{width:42px;height:42px}.tc-chips{display:none}}
@media (prefers-reduced-motion:reduce){.tc-cut .bg,.tc-cut .sl{animation:none}.tc-log p,.tc-cut .pp,.tc-cut .nm,.tc-goal{animation:none}}
`;
    document.head.appendChild(st);
  }

  // ---------- INFRASTRUTTURA UI ----------
  let SPD = 1, M = null, S = null, RUN = 0, pend = null, skipFn = null, onBack = null, keyH = null, botFlag = false, lastLog = null;
  const ABORT = { abort: true };
  const chk = () => { if (!M || !M.isConnected) throw ABORT; };

  function openMod(back) {
    destroy(true);
    injectStyle();
    onBack = back || null;
    registerCosmetics();
    M = document.createElement("div");
    M.className = "tc-m";
    M.id = "tcModal";
    M.setAttribute("role", "dialog");
    M.setAttribute("aria-label", "Tsubasa Classico");
    M.innerHTML = `<div class="tc-h"><div class="tt">⚽ TSUBASA CLASSICO<small id="tcSub">Il Trofeo del Mandorlo</small></div><button type="button" class="tc-x" id="tcX" aria-label="Esci">✕ Esci</button></div><div class="tc-main" id="tcMain"></div><div class="tc-act" id="tcAct"></div>`;
    document.body.appendChild(M);
    $("tcX").onclick = onExit;
    keyH = (e) => { if (e.key === "Escape") onExit(); };
    document.addEventListener("keydown", keyH);
    return M;
  }
  function destroy(silent) {
    RUN++;
    if (pend) { const r = pend; pend = null; try { r(ABORT); } catch (e) { /* ok */ } }
    if (keyH) { document.removeEventListener("keydown", keyH); keyH = null; }
    if (M) { try { M.remove(); } catch (e) { /* ok */ } M = null; }
    S = null; skipFn = null;
    if (!silent) { const cb = onBack; onBack = null; if (typeof cb === "function") { try { cb(); } catch (e) { /* ok */ } } }
  }
  function onExit() {
    if (!M) return;
    if (!S || S.over) return destroy(false);
    if (M.querySelector(".tc-ov")) return;
    const ov = document.createElement("div");
    ov.className = "tc-ov";
    ov.innerHTML = `<div>Abbandonare la partita? Il risultato non verrà salvato.<div class="tc-grid"><button type="button" class="tc-btn gr" data-k="stay"><b>Resta in campo</b></button><button type="button" class="tc-btn sp" data-k="quit"><b>Esci</b></button></div></div>`;
    ov.onclick = (e) => { const b = e.target.closest("button[data-k]"); if (!b) return; if (b.dataset.k === "quit") destroy(false); else ov.remove(); };
    M.appendChild(ov);
  }
  const setMain = (html, cls) => { chk(); const m = $("tcMain"); m.className = "tc-main" + (cls ? " " + cls : ""); m.innerHTML = html; const a = $("tcAct"); a.innerHTML = ""; a.className = "tc-act"; };
  const setSub = (t) => { const s = $("tcSub"); if (s) s.textContent = t; };

  function botPick(list) {
    const en = list.filter((x) => !x.disabled);
    if (!en.length) return list[0];
    let tot = 0; en.forEach((x) => { tot += x.w == null ? 1 : x.w; });
    let r = Math.random() * tot;
    for (const x of en) { r -= x.w == null ? 1 : x.w; if (r <= 0) return x; }
    return en[0];
  }
  function choose(opts, o) {
    o = o || {};
    chk();
    if (botFlag && !o.menu) return new Promise((r) => setTimeout(() => r(botPick(opts)), 0));
    const box = $("tcAct");
    return new Promise((res, rej) => {
      pend = rej;
      box.className = "tc-act" + (o.tall ? " tall" : "");
      box.innerHTML = (o.prompt ? `<div class="tc-prompt">${o.prompt}</div>` : "") + `<div class="tc-grid${o.cols === 1 ? " one" : ""}">` +
        opts.map((x, i) => `<button type="button" class="tc-btn ${x.cls || ""}" data-i="${i}"${x.disabled ? " disabled" : ""}><b>${x.label}</b>${x.sub ? `<small>${x.sub}</small>` : ""}</button>`).join("") + `</div>`;
      box.scrollTop = 0;
      box.onclick = (e) => {
        const b = e.target.closest("button[data-i]");
        if (!b || b.disabled) return;
        box.onclick = null; pend = null; box.innerHTML = "";
        res(opts[+b.dataset.i]);
      };
    });
  }
  function beat(ms) {
    chk();
    if (botFlag || !ms) return Promise.resolve();
    return new Promise((res, rej) => {
      const t = setTimeout(done, ms * SPD);
      function done() { clearTimeout(t); skipFn = null; pend = null; res(); }
      skipFn = done; pend = (x) => { clearTimeout(t); skipFn = null; rej(x); };
    });
  }
  async function say(html, o) {
    o = o || {};
    chk();
    const lg = $("tcLog");
    if (!lg) return;
    const p = document.createElement("p");
    p.className = o.cls || "";
    p.innerHTML = html;
    lg.appendChild(p);
    while (lg.children.length > 60) lg.removeChild(lg.firstChild);
    lg.scrollTop = lg.scrollHeight;
    if (S) S.text.push(p.textContent);
    await beat(o.ms == null ? 700 : o.ms);
  }
  function ptHtml(p, cls) {
    const u = portUrl(p);
    const col = (p && p.spec && p.spec.bg && p.spec.bg[0]) || "#223a6b";
    const ini = p ? esc(String(p.name || "?").replace(/[^A-Za-zÀ-ÿ]/g, "").charAt(0).toUpperCase()) : "?";
    return `<div class="${cls || "tc-pt"}" style="${u ? `background-image:url(${u})` : `background:${col}`}">${u ? "" : ini}</div>`;
  }
  async function cutin(o) {
    chk();
    sfx("special");
    if (botFlag) return;
    const el = document.createElement("div");
    el.className = "tc-cut";
    const t = o.tech || {};
    el.style.setProperty("--c1", t.c1 || "#b3202c");
    el.style.setProperty("--c2", t.c2 || "#ffd23f");
    const all = [o.p].concat(o.partners || []);
    el.innerHTML = `<div class="bg"></div><div class="sl"></div><div class="ports">${all.map((p) => ptHtml(p, "pp")).join("")}</div><div class="nm">${esc(t.name || "TECNICA")}</div><div class="ln">«${esc(t.line || "")}»</div><div class="sk">tocca per saltare</div>`;
    M.appendChild(el);
    try {
      await new Promise((res, rej) => {
        const t2 = setTimeout(done, 1900 * SPD);
        function done() { clearTimeout(t2); el.onclick = null; skipFn = null; pend = null; res(); }
        el.onclick = done; skipFn = done; pend = (x) => { clearTimeout(t2); rej(x); };
      });
    } finally { try { el.remove(); } catch (e) { /* ok */ } }
  }
  async function flash(txt, ms) {
    chk();
    sfx("goal");
    if (botFlag) return;
    const el = document.createElement("div");
    el.className = "tc-goal";
    el.innerHTML = txt;
    M.appendChild(el);
    try {
      await new Promise((res, rej) => {
        const t2 = setTimeout(done, (ms || 1800) * SPD);
        function done() { clearTimeout(t2); el.onclick = null; skipFn = null; pend = null; res(); }
        el.onclick = done; skipFn = done; pend = (x) => { clearTimeout(t2); rej(x); };
      });
    } finally { try { el.remove(); } catch (e) { /* ok */ } }
  }

  // ---------- SCENE DI STORIA ----------
  function speaker(key, teamObj) {
    const s = SPK[key];
    if (key === "hero") {
      const h = SV.useHero ? getHero() : null;
      return h ? { name: h.name, p: { id: "hero", name: h.name, sig: [h.name, h.hair, h.skin, h.shirt, h.style, h.acc, h.num].join("|") } } : { name: "Leo", p: { id: "leo", name: "Leo" } };
    }
    if (!s) return { name: key, p: null };
    if (s.emoji) return { name: s.name, emoji: s.emoji, p: null };
    if (s.team != null && s.pid) { const pl = TEAMS[s.team].players.find((x) => x.id === s.pid); return { name: s.name, p: pl }; }
    if (s.spec) return { name: s.name, p: { id: "tc_" + key, name: s.name, spec: s.spec } };
    return { name: s.name, p: { id: s.id, name: s.name } };
  }
  async function scene(lines) {
    for (let i = 0; i < lines.length; i++) {
      const [k, txt] = lines[i], sp = speaker(k);
      const u = sp.p ? portUrl(sp.p) : "";
      setMain(`<div class="tc-scroll"><div class="tc-card2 tc-sc"><div class="pt" style="${u ? `background-image:url(${u})` : ""}">${u ? "" : esc(sp.emoji || (sp.name || "?").charAt(0))}</div><div class="tx"><b>${esc(sp.name)}</b><div>${esc(txt)}</div></div></div><div class="tc-prompt" style="text-align:center">${i + 1} / ${lines.length}</div></div>`);
      const r = await choose([{ label: i < lines.length - 1 ? "Avanti ▸" : "Continua ▸", cls: "hot", k: "n" }, { label: "Salta ▸▸", k: "s", disabled: lines.length - i < 2 }], {});
      if (r.k === "s") break;
    }
  }

  // ---------- MOTORE DI PARTITA ----------
  const team = (side) => (side === "us" ? S.us : S.them);
  const other = (side) => (side === "us" ? "them" : "us");
  const gkOf = (t) => t.players.find((p) => p.role === "GK");
  const field = (t) => t.players.filter((p) => p.role !== "GK");
  const n = (p) => esc(p.short);
  const lineZ = { DF: 1, MF: 2, FW: 3 };
  const minute = () => (S.turn >= LIMIT ? 90 + (S.turn - LIMIT) * 2 : Math.round((S.turn / LIMIT) * 90));
  const goalsOf = (side) => S.score[side === "us" ? 0 : 1];

  function mood(side) {
    const diff = goalsOf(side) - goalsOf(other(side));
    if (diff >= 0) return 0;
    const late = S.turn >= LIMIT / 2 ? 1 : 0.35;
    return Math.min(2.6, -diff * 1.2 * late) + (S.turn >= LIMIT - 4 ? 0.8 : 0);
  }
  function hud() {
    if (!M || !S) return;
    const sc = $("tcScore");
    if (sc) sc.innerHTML = `<span class="tm" style="color:${S.us.color}">${esc(S.us.name)}</span><span class="sc">${S.score[0]} – ${S.score[1]}</span><span class="tm r" style="color:${S.them.color}">${esc(S.them.name)}</span>`;
    const ck = $("tcClock");
    if (ck) ck.textContent = S.penalties ? "Rigori" : `${S.turn >= LIMIT ? "Suppl." : S.turn < HALF ? "1° T" : "2° T"} · ${minute()}'`;
    const pt = $("tcPitch");
    if (pt) {
      const bx = S.poss === "us" ? S.zone : 4 - S.zone, off = (bx - 2) * 3.5;
      const FX = { GK: 6, DF: 24, MF: 45, FW: 66 };
      const dots = (t, mir) => {
        const cnt = {}, tot = {};
        t.players.forEach((p) => { tot[p.role] = (tot[p.role] || 0) + 1; });
        return t.players.map((p) => {
          const k = cnt[p.role] = (cnt[p.role] || 0) + 1;
          const x = clamp((mir ? 100 - FX[p.role] : FX[p.role]) + (p.role === "GK" ? 0 : off), 4, 96), y = p.role === "GK" ? 50 : (k / (tot[p.role] + 1)) * 100;
          const cls = (S.carrier === p ? " car" : "") + (S.marker === p ? " mk" : "");
          return `<span class="fp${cls}" style="left:${x}%;top:${y}%;--c:${t.color}"><i></i><b>${n(p)}</b></span>`;
        }).join("");
      };
      pt.innerHTML = `<span class="gl l"></span><span class="gl r"></span><span class="cl"></span>${dots(S.us, false)}${dots(S.them, true)}`;
    }
    const ch = $("tcChips");
    if (ch) ch.innerHTML = S.us.players.map((p) => `<div class="tc-chip${S.carrier === p ? " on" : ""}" title="${esc(p.name)}"><b>${n(p)}</b><span class="tc-bar"><s style="width:${Math.round((p.gr / p.mx) * 100)}%"></s></span></div>`).join("");
  }
  function stats(p, hl) {
    if (p.role === "GK") return `<span>${hl === "gk" ? "<em>" : ""}PAR ${p.gk}${hl === "gk" ? "</em>" : ""} · GR ${Math.round(p.gr)}</span>`;
    const f = (k, l) => (hl === k ? `<em>${l}${p[k]}</em>` : `${l}${p[k]}`);
    return `<span>${f("tiro", "T")} ${f("drib", "D")} ${f("pass", "P")} ${f("contr", "C")}</span><span>GR ${Math.round(p.gr)}/${p.mx}</span>`;
  }
  function showDuel(a, b, ha, hb) {
    const d = $("tcDuel");
    if (!d) return;
    const l = a.side === "us" ? a : b, r = a.side === "us" ? b : a, hl = a.side === "us" ? ha : hb, hr = a.side === "us" ? hb : ha;
    d.innerHTML = `<div class="tc-card us">${ptHtml(l)}<div class="tc-ci"><b>${esc(l.name)}</b>${stats(l, hl)}</div></div><div class="tc-vs">VS</div><div class="tc-card them">${ptHtml(r)}<div class="tc-ci"><b>${esc(r.name)}</b>${stats(r, hr)}</div></div>`;
    hud();
  }
  function matchFrame() {
    setMain(`<div class="tc-score" id="tcScore"></div><div class="tc-score" style="padding:0 8px 4px"><span class="ck" id="tcClock"></span></div><div class="tc-pitch" id="tcPitch"></div><div class="tc-chips" id="tcChips"></div><div class="tc-duel" id="tcDuel"></div><div class="tc-log" id="tcLog" aria-live="polite"></div>`);
    $("tcLog").onclick = () => { if (skipFn) skipFn(); };
    $("tcDuel").onclick = () => { if (skipFn) skipFn(); };
  }

  function grPay(p, c) { p.gr = Math.max(0, p.gr - c); }
  // Opzioni di grinta per un giocatore e un tipo di azione
  function modOptions(p, kind, crit, extra) {
    const o = [{ label: "Normale", sub: "Nessuna grinta spesa", mod: { b: 0, cost: 0 }, w: crit ? 2 : 6 }];
    if (p.gr >= 10) o.push({ label: "Metti grinta", sub: `−10 grinta · +4 forza (${Math.round(p.gr)} rimaste)`, cls: "gr", mod: { b: 4, cost: 10, grit: true }, w: crit ? 4 : 2 });
    (p.tech[kind] || []).forEach((t) => {
      const ok = p.gr >= t.cost;
      o.push({ label: `✦ ${esc(t.name)}`, sub: ok ? `−${t.cost} grinta · +${t.b} forza${t.bypass ? " · scavalca i difensori" : ""}${t.gkMul ? " · devasta il portiere" : ""}${t.woodIn ? " · il legno aiuta" : ""}` : `serve grinta ${t.cost} (hai ${Math.round(p.gr)})`, cls: "sp", disabled: !ok, mod: { b: t.b, cost: t.cost, tech: t }, w: crit ? 8 : 2.5 });
    });
    (extra || []).forEach((x) => o.push(x));
    return o;
  }
  async function askMod(p, kind, crit, extra, label) {
    const opts = modOptions(p, kind, crit, extra);
    const hasTech = opts.some((x) => x.mod && x.mod.tech && !x.disabled) || (extra || []).some((x) => !x.disabled);
    if (opts.length === 1 || (opts.length === 2 && opts[1].disabled) || (!hasTech && !crit)) return opts[0].mod;
    const r = await choose(opts, { prompt: `${esc(label || "Quanta grinta?")} <span style="color:#9fb3d9;font-weight:500">${n(p)}: ${Math.round(p.gr)}/${p.mx}</span>`, tall: true, cols: opts.length > 4 ? 2 : 2 });
    return r.mod;
  }
  function aiMod(p, kind, crit) {
    const tl = (p.tech[kind] || []).filter((t) => p.gr >= t.cost);
    const behind = goalsOf(p.side) < goalsOf(other(p.side));
    const prob = 0.1 + S.stage * 0.07 + (crit ? 0.28 : 0) + (behind ? 0.1 : 0);
    if (tl.length && Math.random() < prob) { const t = pick(tl); return { b: t.b, cost: t.cost, tech: t }; }
    if (p.gr >= 10 && Math.random() < (crit ? 0.35 : 0.12)) return { b: 4, cost: 10, grit: true };
    return { b: 0, cost: 0 };
  }
  async function applyMod(p, mod, partners) {
    grPay(p, mod.cost);
    (partners || []).forEach((q) => grPay(q, mod.pcost || mod.cost));
    if (mod.tech) {
      const mine = p.side === "us";
      await say(`✦ <b>${n(p)}</b> spende grinta!`, { cls: mine ? "us big" : "them big", ms: 300 });
      await cutin({ p, tech: mod.tech, partners });
    } else if (mod.grit) {
      await say(`💢 ${n(p)} stringe i denti: <b>grinta!</b>`, { cls: p.side === "us" ? "us" : "them", ms: 350 });
    }
    hud();
  }

  const rollR = () => rnd(0.85, 1.15);
  function pickDef(side, z, avoid) {
    const t = team(side);
    const roles = z <= 1 ? ["FW", "MF"] : z === 2 ? ["MF"] : z === 3 ? ["MF", "DF"] : ["DF"];
    let c = t.players.filter((p) => roles.includes(p.role));
    if (!c.length) c = field(t);
    const f = c.filter((p) => p !== avoid && p !== S.lastMk);
    const r = pick(f.length ? f : c);
    S.lastMk = r;
    return r;
  }
  function giveBall(side, carrier, zone) {
    if (S.poss !== side) S.cover = 0;
    S.poss = side; S.carrier = carrier; S.zone = clamp(zone, 0, 4);
  }
  const flipZone = (z) => clamp(4 - z, 0, 3);

  // ---- testi ----
  const L_DRIB_W = (a, d) => pick([`${a} salta ${d} come un birillo!`, `Finta, controfinta… ${d} è rimasto sul posto!`, `${a} gli passa accanto con un tocco morbido: ${d} guarda il vuoto.`, `Cambio di passo di ${a}! ${d} non lo vede nemmeno!`]);
  const L_DRIB_L = (a, d) => pick([`${d} legge la finta e strappa la palla a ${a}!`, `Troppo prevedibile, ${a}: ${d} gli ruba il pallone!`, `${d} si mette di traverso: la palla è sua!`]);
  const L_PASS_W = (a, t) => pick([`Il passaggio di ${a} taglia la difesa: arriva a ${t}!`, `${a} la mette sul piede di ${t}, preciso come un orologio.`, `Triangolo perfetto: la palla scorre da ${a} a ${t}!`]);
  const L_PASS_L = (a, d) => pick([`${d} si allunga e intercetta il passaggio di ${a}!`, `Passaggio sbagliato di ${a}! ${d} ringrazia e riparte.`, `Lancio troppo morbido: ${d} lo anticipa!`]);

  // ---- tiro: fasi (traiettoria con catena di intercetti → portiere → palo/traversa → parata/spinta disperata) ----
  // Un difensore prova a fermare il tiro: vince se la sua forza supera quella grezza del tiratore
  async function interceptTry(side, shooter, d, raw, user, label) {
    showDuel(shooter, d, "tiro", "contr");
    let dm = { b: 0, cost: 0 };
    if (user) dm = await askMod(d, "def", true, null, "Respinta:");
    else dm = aiMod(d, "def", true);
    if (dm.tech || dm.grit) await applyMod(d, dm);
    const D = (d.contr + dm.b + 2 + (user && user.extra || 0)) * rollR();
    await say("…", { cls: "drama", ms: 450 });
    return D > raw;
  }
  async function chainDefenders(side, shooter, raw, first, userFirst, extraD) {
    // catena: fino a 2 difensori, con i loro nomi, sulla traiettoria
    const defTeam = other(side), z = S.zone;
    const tries = [];
    const pool = field(team(defTeam)).filter((p) => (p.role === "DF" || p.role === "MF") && p !== first).sort(() => Math.random() - 0.5);
    if (first) tries.push({ d: first, user: userFirst });
    else if (pool.length && Math.random() < (z >= 4 ? 0.4 : 0.5)) tries.push({ d: pool.pop(), user: false });
    if (tries.length && z >= 4 && pool.length && Math.random() < 0.4) tries.push({ d: pool.pop(), user: false });
    for (let i = 0; i < tries.length; i++) {
      const t = tries[i];
      if (i === 0) await say(t.user ? `🛡️ <b>${n(t.d)}</b> si lancia sulla traiettoria!` : `⚠️ <b>${n(t.d)}</b> si frappone sulla traiettoria!`, { cls: defTeam === "us" ? "us" : "them", ms: 550 });
      else await say(`…e dietro di lui c'è anche <b>${n(t.d)}</b>!`, { cls: defTeam === "us" ? "us big" : "them big", ms: 550 });
      const ok = await interceptTry(side, shooter, t.d, raw, t.user ? { extra: extraD || 0 } : null);
      if (ok) {
        await say(`${n(t.d)} respinge il tiro di ${n(shooter)}!${i ? " Doppia barriera!" : ""}`, { cls: defTeam === "us" ? "us big" : "them big", ms: 750 });
        return t.d;
      }
      await say(`Il tiro sfiora ${n(t.d)} e prosegue!`, { cls: side === "us" ? "us" : "them", ms: 450 });
    }
    return null;
  }
  async function resolveShot(side, shooter, P, mod) {
    const def = team(other(side)), gk = gkOf(def), mine = side === "us";
    let gmod = { b: 0, cost: 0 };
    // FASE 1 · il tiro parte
    await say("La palla parte…", { cls: "drama", ms: 600 });
    // FASE 2 · reazione del portiere
    if (mine) {
      showDuel(shooter, gk, "tiro", "gk");
      gmod = aiMod(gk, "gk", P > gk.gk * 0.9);
      if (gmod.tech || gmod.grit) await applyMod(gk, gmod);
    } else {
      showDuel(gk, shooter, "gk", "tiro");
      const diff = P - gk.gk;
      const lbl = diff > 5 ? "POTENTISSIMO, angolino!" : diff > 1 ? "forte e preciso" : diff > -3 ? "deciso, ma parabile" : "debole";
      await say(`Il tiro di ${n(shooter)} è <b>${lbl}</b>! Tocca a ${n(gk)}.`, { ms: 500 });
      const dive = { label: "Tuffo disperato", sub: "−15 grinta · +6, ma niente palo se non basta", cls: "sp", disabled: gk.gr < 15, mod: { b: 6, cost: 15, grit: true, allin: true }, w: diff > 1 ? 5 : 1 };
      gmod = await askMod(gk, "gk", diff > 0, [dive], `Parata di ${gk.short}:`);
      await applyMod(gk, gmod);
    }
    let G = (gk.gk + gmod.b) * rollR();
    if (mod.tech && mod.tech.gkMul) G *= mod.tech.gkMul;
    const wood = mod.tech && mod.tech.woodIn ? 1.4 : 0;
    let m = P - G + wood;
    S.dbg = { P: +P.toFixed(1), G: +G.toFixed(1), m: +m.toFixed(1) };
    await say("…", { cls: "drama", ms: 700 });
    // FASE 3 · palo / traversa (quasi gol o quasi parata)
    let wooded = false;
    if (m >= 0 && m < 1.5 && !gmod.allin) {
      wooded = true;
      await say(pick(["PALO!! La palla trema sul legno…", "TRAVERSA!!! Rimbalza sulla linea…"]), { cls: "big", ms: 900 });
      if (Math.random() < 0.5) { await say("…ed è DENTRO!", { cls: "big", ms: 700 }); return "goal"; }
      m = -0.5;
    }
    // FASE 4 · parata disperata / spinta di grinta
    const win = m >= 1.5 || (m >= 0 && gmod.allin);
    if (!mine && m >= -0.01 && m < 4 && gk.gr >= 12 && !wooded) {
      const cost = Math.min(Math.round(gk.gr), 25), bonus = 3 + cost / 4;
      const r = await choose([{ label: "🧤 PARATA DISPERATA!", sub: `−${cost} grinta · +${bonus.toFixed(1)}: ci provi con tutto`, cls: "sp", d: 1, w: 8 }, { label: "Lascia andare", sub: "Risparmia la grinta", d: 0, w: 1 }], { prompt: `${esc(gk.short)} è battuto di un soffio!` });
      if (r.d) { grPay(gk, cost); hud(); await say(`🧤 <b>${n(gk)} si allunga con tutto quello che ha!</b>`, { cls: "us big", ms: 800 }); m -= bonus; }
    } else if (mine && m >= -0.01 && m < 4 && gk.gr >= 12 && Math.random() < 0.55 && !wooded) {
      const cost = Math.min(Math.round(gk.gr), 25), bonus = 3 + cost / 4;
      grPay(gk, cost); hud();
      await say(`🧤 <b>${n(gk)} si allunga in un tuffo disperato!</b>`, { cls: "them big", ms: 800 });
      m -= bonus;
    } else if (mine && m < 0 && m > -4.5 && shooter.gr >= 12) {
      const cost = Math.min(Math.round(shooter.gr), 25), bonus = 3 + cost / 4;
      const r = await choose([{ label: "💥 SPINGI CON TUTTA LA GRINTA!", sub: `−${cost} grinta · +${bonus.toFixed(1)}: il pallone non si arrende`, cls: "sp", d: 1, w: 8 }, { label: "Lascia stare", sub: "Risparmia la grinta", d: 0, w: 1 }], { prompt: `${esc(shooter.short)}: il portiere ci arriva… ma è appena appena!` });
      if (r.d) { grPay(shooter, cost); hud(); await say(`💥 <b>${n(shooter)} ci mette l'anima: il pallone spinge sulle dita del portiere!</b>`, { cls: "us big", ms: 800 }); m += bonus; }
    } else if (!mine && m < 0 && m > -4.5 && shooter.gr >= 12 && Math.random() < 0.4) {
      const cost = Math.min(Math.round(shooter.gr), 25), bonus = 3 + cost / 4;
      grPay(shooter, cost); hud();
      await say(`💥 <b>${n(shooter)} non si arrende: spinge il pallone con tutta la grinta!</b>`, { cls: "them big", ms: 800 });
      m += bonus;
    }
    if (m >= 1.5 || (m >= 0 && gmod.allin)) return "goal";
    if (m >= 0) {
      await say(pick(["PALO! La palla bacia il legno ed esce!", "TRAVERSA! Un centimetro più in basso e sarebbe stato gol!"]), { cls: "big", ms: 800 });
      return Math.random() < 0.3 ? "rebound" : "saved";
    }
    if (m >= -1.5) { await say(`🧤 ${n(gk)} ci arriva in extremis, con la punta delle dita!`, { cls: "big", ms: 700 }); return Math.random() < 0.4 ? "rebound" : "saved"; }
    return "saved";
  }
  async function afterShot(side, shooter, res, blockedBy) {
    const att = team(side), def = team(other(side));
    if (res === "goal") {
      S.score[side === "us" ? 0 : 1]++;
      S.goals.push({ side, name: shooter.name, min: minute() });
      hud();
      await flash(`GOOOL!<br><span style="font-size:.4em">${esc(shooter.name)}</span>`, 1900);
      await say(`⚽ <b>GOL!</b> ${esc(shooter.name)} per ${esc(att.name)}! ${S.score[0]} – ${S.score[1]}`, { cls: side === "us" ? "us big" : "them big", ms: 900 });
      if (side === "us") await say(pick(["Il pubblico di Costalta esplode! La Pro Loco suona la trombetta.", "Tutti in piedi! Il mandorlo, in vaso, trema d'emozione.", "Che azione! Il cronista sta per perdere la voce."]), { cls: "drama", ms: 700 });
      else await say(pick(["Silenzio sugli spalti. Si sente solo un gabbiano.", "Gol subito. Ma la partita non è finita: serve grinta!"]), { cls: "drama", ms: 700 });
      const rest = pick(field(def).filter((p) => p.role === "MF").concat(field(def)));
      giveBall(other(side), rest, 2);
    } else if (res === "rebound") {
      const c = pick(field(att).filter((p) => p !== shooter && (p.role === "FW" || p.role === "MF")).concat([shooter]));
      await say(`💥 <b>Ribattuta!</b> La palla resta in area… la prende ${n(c)}!`, { cls: "big", ms: 700 });
      giveBall(side, c, 4);
    } else if (res === "blocked") {
      giveBall(other(side), blockedBy, 1);
    } else {
      const c = pick(field(def).filter((p) => p.role === "DF").concat(field(def)));
      await say(`${n(gkOf(def))} rinvia: palla a ${n(c)}.`, { cls: "dim", ms: 400 });
      giveBall(other(side), c, 1);
    }
    hud();
  }
  const shotPenalty = (far) => (S.zone >= 4 ? 0 : S.zone === 3 ? 4 : 9) + (far && S.zone >= 4 ? 0 : 0);

  // ---- turno in attacco (palla nostra) ----
  async function attackTurn() {
    const c = S.carrier, z = S.zone;
    const mk = pickDef("them", z);
    S.marker = mk;
    showDuel(c, mk, null, null);
    const lastCall = S.turn >= LIMIT - 3 && S.score[0] <= S.score[1];
    const fwdMates = field(S.us).filter((p) => p !== c);
    const opts = [
      { label: "Dribbling", sub: `Salta ${n(mk)} (C ${mk.contr}) · DRI ${c.drib}`, k: "drib", w: 3 },
      { label: "Passaggio corto", sub: "Compagno vicino, sicuro", k: "pass", w: z >= 4 ? 1 : 4 },
      { label: "Lancio lungo", sub: "Salta una linea · −3, rischioso", k: "long", disabled: z >= 3, w: 1.5 },
      { label: "Uno-due", sub: "Triangolazione con un compagno", k: "wall", disabled: fwdMates.length < 1 || z >= 4, w: 2 },
      { label: "Proteggi palla", sub: "Tieni palla: +6 grinta, perdi un turno", k: "hold", w: 0.7 },
      { label: "Tiro", sub: z >= 4 ? "In area: tira!" : "Serve la zona d'area", cls: "hot", k: "shot", disabled: z < 4, w: lastCall ? 12 : 10 },
      { label: "Tiro da lontano", sub: z >= 2 && z < 4 ? `Dalla distanza (−${shotPenalty(true)} potenza)` : "Solo da metà campo all'area", cls: "hot", k: "far", disabled: z < 2 || z >= 4, w: z === 3 ? (lastCall ? 6 : 2) : 0.8 },
    ];
    await say(`${lastCall ? "⏱️ ULTIMI MINUTI! " : ""}<b>${n(c)}</b> ha palla${z >= 4 ? " in area" : ""}. Davanti c'è <b>${n(mk)}</b>.`, { cls: "us", ms: 250 });
    const r = await choose(opts, { prompt: `${esc(c.name)}: che cosa fai?`, tall: true });
    if (r.k === "drib") return doDribble(c, mk);
    if (r.k === "pass") return doPass(c, false);
    if (r.k === "long") return doPass(c, true);
    if (r.k === "wall") return doWall(c, mk);
    if (r.k === "hold") return doHold(c, mk);
    return doShotUs(c, r.k === "far");
  }
  async function doDribble(c, mk) {
    showDuel(c, mk, "drib", "contr");
    const mod = await askMod(c, "drib", S.zone >= 3, null, "Dribbling:");
    await say(`${n(c)} punta ${n(mk)}…`, { ms: 450 });
    await applyMod(c, mod);
    const dm = aiMod(mk, "def", S.zone >= 3);
    if (dm.tech || dm.grit) await applyMod(mk, dm);
    const A = (c.drib + mod.b) * rollR() + mood("us"), D = (mk.contr + dm.b) * rollR();
    S.dbg = { A: +A.toFixed(1), D: +D.toFixed(1) };
    await say("…", { cls: "drama", ms: 500 });
    if (A > D) {
      const big = A - D > 5 || (mod.tech && Math.random() < 0.6);
      await say(L_DRIB_W(n(c), n(mk)) + (big ? " <b>Avanza di due metri!</b>" : ""), { cls: "us", ms: 700 });
      S.zone = clamp(S.zone + (big ? 2 : 1), 0, 4);
    } else {
      await say(L_DRIB_L(n(c), n(mk)), { cls: "them", ms: 700 });
      giveBall("them", mk, flipZone(S.zone));
    }
  }
  async function doWall(c, mk) {
    const cand = field(S.us).filter((p) => p !== c);
    const q = cand.sort((a, b) => b.pass - a.pass)[0];
    showDuel(c, mk, "pass", "contr");
    const mod = await askMod(c, "pass", false, null, "Uno-due:");
    await say(`${n(c)} la appoggia a ${n(q)} e scatta per il ritorno!`, { cls: "us", ms: 550 });
    await applyMod(c, mod);
    const A = ((c.pass + q.pass) / 2 + mod.b) * rollR() + mood("us") + 1, D = (mk.contr + 2) * rollR();
    S.dbg = { A: +A.toFixed(1), D: +D.toFixed(1) };
    await say("…", { cls: "drama", ms: 450 });
    if (A > D) { await say(`Triangolo perfetto con ${n(q)}! ${n(c)} salta ${n(mk)} e si ritrova avanti.`, { cls: "us", ms: 650 }); S.zone = clamp(S.zone + (A - D > 5 ? 2 : 1), 0, 4); }
    else { await say(`${n(mk)} legge l'uno-due e si inserisce nel passaggio!`, { cls: "them", ms: 650 }); giveBall("them", mk, flipZone(S.zone)); }
  }
  async function doHold(c, mk) {
    showDuel(c, mk, "drib", "contr");
    await say(`${n(c)} fa scudo con il corpo e protegge il pallone.`, { cls: "us", ms: 450 });
    const A = (c.drib + c.contr) / 2 * rollR() + 2, D = mk.contr * 0.9 * rollR();
    if (A > D) { c.gr = Math.min(c.mx, c.gr + 6); await say(`${n(mk)} non riesce a rubargliela. ${n(c)} riprende fiato (+6 grinta).`, { cls: "sys", ms: 500 }); }
    else { await say(`${n(mk)} si infila e gli strappa la palla!`, { cls: "them", ms: 600 }); giveBall("them", mk, flipZone(S.zone)); }
  }
  async function doPass(c, longMode) {
    const z = S.zone;
    const mates = field(S.us).filter((p) => p !== c);
    let cand = mates.map((p) => {
      const tz = Math.max(z, lineZ[p.role] || 2) + (p.role === "FW" && z >= 3 ? 1 : 0) + (longMode && p.role === "FW" ? 1 : 0);
      const long = longMode || tz - z >= 2;
      return { p, tz: clamp(tz, 0, 4), long };
    });
    if (longMode) cand = cand.filter((x) => x.p.role !== "DF");
    else cand = cand.filter((x) => !(x.p.role === "FW" && z <= 1));
    if (!cand.length) cand = mates.map((p) => ({ p, tz: clamp(Math.max(z, lineZ[p.role] || 2), 0, 4), long: false }));
    cand.sort((a, b) => b.tz - a.tz || b.p.pass - a.p.pass);
    const sel = [];
    const fw = cand.filter((x) => x.p.role === "FW"), mf = cand.filter((x) => x.p.role === "MF"), df = cand.filter((x) => x.p.role === "DF");
    [fw[0], mf[0], fw[1] || mf[1] || df[0]].forEach((x) => { if (x && !sel.includes(x)) sel.push(x); });
    if (sel.length < 3) cand.forEach((x) => { if (sel.length < 3 && !sel.includes(x)) sel.push(x); });
    const opts = sel.map((x) => {
      const adv = x.tz > z ? `avanza di ${x.tz - z}` : "mantiene";
      return { label: `${esc(x.p.short)} <span style="color:#9fb3d9;font-weight:500">(${x.p.role})</span>`, sub: `${adv}${x.long ? " · lungo, rischioso" : " · sicuro"}`, x, w: x.p.role === "FW" ? 5 : 3 };
    });
    const t = await choose(opts, { prompt: `${esc(c.name)} cerca un compagno:` });
    const tgt = t.x.p, long = t.x.long;
    const mk = pickDef("them", Math.min(4, z + (long ? 1 : 0)), S.marker);
    showDuel(c, mk, "pass", "contr");
    const mod = await askMod(c, "pass", false, null, "Passaggio:");
    await say(`${n(c)} alza la testa e cerca ${n(tgt)}…`, { ms: 450 });
    await applyMod(c, mod);
    const dm = aiMod(mk, "def", false);
    if (dm.tech || dm.grit) await applyMod(mk, dm);
    const A = (c.pass + mod.b) * rollR() + mood("us") - (long ? 3 : 0), D = (mk.contr + dm.b + 2) * rollR();
    S.dbg = { A: +A.toFixed(1), D: +D.toFixed(1) };
    await say("…", { cls: "drama", ms: 450 });
    if (A > D) {
      await say(L_PASS_W(n(c), n(tgt)), { cls: "us", ms: 650 });
      giveBall("us", tgt, t.x.tz);
    } else {
      await say(L_PASS_L(n(c), n(mk)), { cls: "them", ms: 700 });
      giveBall("them", mk, flipZone(S.zone));
    }
  }
  function comboOptions(c) {
    const out = [];
    if (S.zone < 4) return out;
    const mates = field(S.us).filter((p) => p !== c && (p.role !== "DF" || p.tiro >= 20));
    const names = { "leo|tommy": "DOPPIA RONDINE", "hero|tommy": "TIRO GEMELLO", "leo|fede": "RONDINE DI FEDE", "hero|fede": "TIRO PARABOLICO A DUE", "tommy|gigi": "GABBIANO E CANNONE" };
    mates.forEach((q) => {
      if (q.gr < 18 || c.gr < 18) return;
      const nm = names[c.id + "|" + q.id] || names[q.id + "|" + c.id] || `TIRO A DUE: ${c.short.toUpperCase()} E ${q.short.toUpperCase()}`;
      out.push({ label: `✦ ${esc(nm)}`, sub: `con ${esc(q.short)} · −18 grinta ciascuno · +12`, cls: "sp", w: 6, mod: { b: 12, cost: 18, pcost: 18, tech: { name: nm, line: `${c.short} e ${q.short}, insieme, sullo stesso pallone!`, b: 12, c1: "#b3202c", c2: "#57d68d" }, partners: [q] } });
    });
    const third = mates.filter((q) => q.gr >= 22 && q.tiro >= 16);
    if (c.gr >= 22 && third.length >= 2) {
      const [a, b] = third;
      out.push({ label: "✦ TIRO COMBINATO A TRE", sub: `con ${esc(a.short)} e ${esc(b.short)} · −22 grinta ciascuno · +17`, cls: "sp", w: 8, mod: { b: 17, cost: 22, pcost: 22, tech: { name: "TIRO COMBINATO A TRE", line: "Tre maglie, un solo pallone: tacco, sponda, e via!", b: 17, c1: "#b3202c", c2: "#ffd23f", bypass: true }, partners: [a, b] } });
    }
    return out;
  }
  async function doShotUs(c, far) {
    const gk = gkOf(S.them);
    showDuel(c, gk, "tiro", "gk");
    const crit = S.zone >= 4;
    const combos = comboOptions(c);
    const mod = await askMod(c, "shot", crit, combos, far ? "Tiro da lontano:" : "Tiro:");
    await say(`${n(c)} prende la mira verso la porta di ${n(gk)}…`, { ms: 500 });
    await applyMod(c, mod, mod.partners);
    let base = c.tiro;
    if (mod.partners && mod.partners.length) base = c.tiro * 0.75 + mod.partners.reduce((s, q) => s + q.tiro * 0.55, 0);
    const wild = mod.tech && mod.tech.wild;
    const P = (base + mod.b) * (wild ? rnd(0.7, 1.35) : rollR()) * 1.0 - shotPenalty(far) + mood("us");
    const raw = (base + mod.b) * rollR();
    const bypass = mod.tech && mod.tech.bypass;
    if (!bypass) {
      const b = await chainDefenders("us", c, raw, null, false);
      if (b) return afterShot("us", c, "blocked", b);
    } else await say("Il tiro scavalca i difensori: nessuno può fermarlo prima del portiere!", { cls: "us", ms: 500 });
    const res = await resolveShot("us", c, P, mod);
    return afterShot("us", c, res);
  }

  // ---- turno in difesa (palla loro) ----
  function aiAction(c, z) {
    const behind = S.score[1] < S.score[0] && S.turn >= LIMIT - 6;
    const r = Math.random();
    if (z >= 4) return r < 0.82 ? "shot" : "drib";
    if (z === 3) return r < (behind ? 0.6 : 0.45) ? "shot" : r < 0.65 ? "drib" : "pass";
    if (z === 2) return r < 0.5 ? "pass" : "drib";
    return r < 0.6 ? "pass" : "drib";
  }
  function defOpts(act, d, c) {
    const partner = field(S.us).filter((p) => p !== d && p.role !== "GK").sort((a, b) => b.contr - a.contr)[0];
    const canDbl = partner && d.gr >= 8 && partner.gr >= 8;
    const main = act === "drib" ? ["Contrasto", `${n(d)} (C ${d.contr}) in marcatura`] : act === "pass" ? ["Intercetta", `${n(d)} (C ${d.contr}) legge la traiettoria`] : ["Respingi", `${n(d)} si getta sul tiro (C ${d.contr})`];
    const risk = act === "drib" ? ["Scivolata", "+3 forza, ma se fallisci lui avanza di due"] : act === "pass" ? ["Anticipa", "+3 forza, ma se fallisci il passaggio arriva lungo"] : ["Scivolata a pelo", "+3 forza sulla respinta"];
    return {
      partner,
      opts: [
        { label: main[0], sub: main[1], k: "c", cls: act === "shot" ? "hot" : "", w: 6 },
        { label: risk[0], sub: risk[1], k: "s", cls: "sp", w: 2 },
        { label: "Raddoppio", sub: partner ? `con ${n(partner)} (C ${partner.contr}) · −8 grinta ciascuno` : "nessuno vicino", k: "d", disabled: !canDbl, w: 3 },
        { label: act === "shot" ? "Lascia al portiere" : "Stop: chiudi lo spazio", sub: act === "shot" ? `Fiducia in ${n(gkOf(S.us))}` : "Nessuno scontro: lui avanza, ma il suo prossimo tiro perde forza · +6 grinta", k: "w", w: act === "shot" ? 2 : 0.8 },
        { label: "Fallo tattico", sub: "Fermi l'azione… se l'arbitro non ti vede. −8 grinta", k: "f", disabled: act === "shot" || d.gr < 8, w: 0.5 },
      ],
    };
  }
  async function defendTurn() {
    const c = S.carrier, z = S.zone;
    const act = aiAction(c, z);
    const d = pickDef("us", z);
    S.marker = d;
    showDuel(d, c, "contr", act === "drib" ? "drib" : act === "pass" ? "pass" : "tiro");
    const verb = act === "drib" ? "parte in dribbling verso" : act === "pass" ? "alza la testa: sta cercando un compagno, davanti a" : "è in posizione di tiro: davanti c'è";
    await say(`<b>${n(c)}</b> (avversario) ${verb} <b>${n(d)}</b>!`, { cls: "them" + (act === "shot" ? " big" : ""), ms: 450 });
    const { partner, opts } = defOpts(act, d, c);
    const r = await choose(opts, { prompt: `${esc(d.name)} contro ${esc(c.name)}:`, tall: true });
    // Stop: nessuno scontro
    if (r.k === "w" && act !== "shot") {
      d.gr = Math.min(d.mx, d.gr + 6);
      await say(`${n(d)} arretra e chiude lo spazio: ${n(c)} avanza, ma senza spazio per tirare bene.`, { cls: "us", ms: 650 });
      S.zone = clamp(S.zone + 1, 0, 4); S.cover = 2.5;
      if (act === "pass") { const t = pick(field(S.them).filter((p) => p !== c)); S.carrier = t; }
      return;
    }
    if (r.k === "f") {
      grPay(d, 8);
      const p = clamp(0.5 + (d.contr - c.drib) / 40, 0.25, 0.8);
      await say(`${n(d)} lo ferma con un'entrata dura…`, { cls: "us", ms: 600 });
      if (Math.random() < p) { await say("Fallo! L'arbitro fischia. Punizione dal limite: si riparte da lì, ma l'azione è rallentata.", { cls: "us", ms: 650 }); S.zone = clamp(S.zone, 0, 3); S.cover = 1.5; }
      else { await say(`${n(c)} resta in piedi, passa oltre e l'arbitro fa segno di proseguire! Vantaggio!`, { cls: "them big", ms: 650 }); S.zone = clamp(S.zone + 1, 0, 4); }
      return;
    }
    if (act === "drib") return defDribble(c, d, r, partner);
    if (act === "pass") return defPass(c, d, r, partner);
    return defShot(c, d, r, partner);
  }
  async function defForce(d, r, partner, bonusPass) {
    const mod = await askMod(d, "def", S.zone >= 3, null, "Difesa:");
    await applyMod(d, mod);
    let extra = r.k === "s" ? 3 : 0, dbl = 0;
    if (r.k === "d" && partner) { grPay(d, 8); grPay(partner, 8); dbl = partner.contr * 0.6 + 1; await say(`${n(partner)} accorre in raddoppio!`, { cls: "us", ms: 450 }); hud(); }
    return (d.contr + mod.b + extra + dbl + (bonusPass || 0)) * rollR() + mood("us");
  }
  async function defDribble(c, d, r, partner) {
    const D = await defForce(d, r, partner, 0);
    const am = aiMod(c, "drib", S.zone >= 3);
    if (am.tech || am.grit) await applyMod(c, am);
    const A = (c.drib + am.b) * rollR();
    S.dbg = { A: +A.toFixed(1), D: +D.toFixed(1) };
    await say("…", { cls: "drama", ms: 500 });
    if (D >= A) {
      await say(pick([`${n(d)} lo ferma! Bel contrasto!`, `${n(d)} gli strappa la palla con un tackle pulito!`, `Niente da fare per ${n(c)}: ${n(d)} è un muro!`]), { cls: "us", ms: 700 });
      giveBall("us", d, flipZone(S.zone) + (D - A > 5 ? 1 : 0));
    } else {
      const extra = r.k === "s" ? 1 : 0;
      await say(r.k === "s" ? `${n(d)} scivola… ma ${n(c)} salta la gamba tesa! Pericolo!` : pick([`${n(c)} salta ${n(d)} con una finta!`, `Troppo veloce ${n(c)}: ${n(d)} resta a guardare.`]), { cls: "them", ms: 700 });
      S.zone = clamp(S.zone + 1 + extra, 0, 4);
    }
  }
  async function defPass(c, d, r, partner) {
    const t = pick(field(S.them).filter((p) => p !== c && (lineZ[p.role] || 2) >= (lineZ[c.role] || 1)).concat(field(S.them).filter((p) => p !== c)));
    const D = await defForce(d, r, partner, 2);
    const am = aiMod(c, "pass", false);
    if (am.tech || am.grit) await applyMod(c, am);
    const A = (c.pass + am.b) * rollR() + 1;
    S.dbg = { A: +A.toFixed(1), D: +D.toFixed(1) };
    await say("…", { cls: "drama", ms: 450 });
    if (D > A) {
      await say(pick([`${n(d)} intercetta il passaggio!`, `Lancio di ${n(c)} intercettato da ${n(d)}: ripartenza!`]), { cls: "us", ms: 700 });
      giveBall("us", d, flipZone(S.zone));
    } else {
      await say(pick([`Il passaggio di ${n(c)} arriva a ${n(t)}.`, `${n(t)} controlla e si gira: pericoloso!`]), { cls: "them", ms: 600 });
      S.carrier = t; S.zone = clamp(Math.max(S.zone + 1, (lineZ[t.role] || 2)) + (r.k === "s" ? 1 : 0), 0, 4);
    }
  }
  async function defShot(c, d, r, partner) {
    const am = aiMod(c, "shot", true);
    if (am.tech || am.grit) await applyMod(c, am);
    const bypass = am.tech && am.tech.bypass;
    const cover = S.cover || 0; S.cover = 0;
    const raw = (c.tiro + am.b) * rollR();
    const P = (c.tiro + am.b) * (am.tech && am.tech.wild ? rnd(0.7, 1.35) : rollR()) * 1.0 - shotPenalty(false) + mood("them") - cover;
    if (bypass) await say("Il tiro scavalca la difesa! Solo il portiere può fermarlo!", { cls: "them", ms: 500 });
    else if (r.k !== "w") {
      let extra = r.k === "s" ? 3 : 0;
      if (r.k === "d" && partner) { grPay(d, 8); grPay(partner, 8); extra += partner.contr * 0.6 + 1; await say(`${n(partner)} accorre in raddoppio!`, { cls: "us", ms: 450 }); hud(); }
      const b = await chainDefenders("them", c, raw, d, true, extra);
      if (b) return afterShot("them", c, "blocked", b);
    } else await say(`${n(d)} si fa da parte: tutto nelle mani di ${n(gkOf(S.us))}!`, { cls: "dim", ms: 400 });
    const res = await resolveShot("them", c, P, am);
    return afterShot("them", c, res);
  }

  // ---- partita ----
  function recover(frac) {
    [S.us, S.them].forEach((t) => t.players.forEach((p) => { p.gr = Math.min(p.mx, p.gr + (frac ? p.mx * frac : 1)); }));
  }
  async function halftime() {
    await say("🔔 <b>FISCHIO: fine primo tempo.</b>", { cls: "big", ms: 800 });
    recover(0.3);
    const lead = S.score[0] - S.score[1];
    await say(lead > 0 ? "Negli spogliatoi si sorride. Ma Baciccia avverte: «Il secondo tempo è un altro film»." : lead < 0 ? "Negli spogliatoi nessuno parla. Poi Tommy dice: «Ragazzi, rimontare è più bello»." : "Spogliatoio: aria di focaccia e di concentrazione. Tutto da decidere.", { cls: "drama", ms: 900 });
    await say("💪 Tutti recuperano un po' di grinta.", { cls: "sys", ms: 500 });
    const kicker = field(S.them).find((p) => p.role === "MF") || field(S.them)[0];
    giveBall("them", kicker, 2);
    hud();
    if (!botFlag) await choose([{ label: "Secondo tempo ▸", cls: "hot" }], { prompt: `Intervallo: ${S.score[0]} – ${S.score[1]}` });
    await say("🔔 Si riparte!", { cls: "big", ms: 500 });
  }
  async function shootout() {
    S.penalties = true; hud();
    setSub("Calci di rigore");
    await say("🥅 <b>CALCI DI RIGORE!</b> Si decide dagli undici metri.", { cls: "big", ms: 1000 });
    const mine = field(S.us).sort((a, b) => b.tiro - a.tiro), theirs = field(S.them).sort((a, b) => b.tiro - a.tiro);
    const sc = [0, 0];
    const dirs = ["Sinistra", "Centro", "Destra"];
    const kick = async (side, i) => {
      const shooter = (side === "us" ? mine : theirs)[i % 6], gk = gkOf(team(other(side)));
      showDuel(side === "us" ? shooter : gk, side === "us" ? gk : shooter, side === "us" ? "tiro" : "gk", side === "us" ? "gk" : "tiro");
      let sd, gd;
      if (side === "us") {
        const r = await choose(dirs.map((d, k) => ({ label: d, sub: `${esc(shooter.short)} calcia`, k, w: 1 })), { prompt: `Rigore di ${esc(shooter.name)}: dove tiri?`, cols: 1 });
        sd = r.k; gd = Math.floor(Math.random() * 3);
      } else {
        const r = await choose(dirs.map((d, k) => ({ label: d, sub: `${esc(gk.short)} si tuffa`, k, w: 1 })), { prompt: `Rigore di ${esc(shooter.name)}: dove ti butti?`, cols: 1 });
        gd = r.k; sd = Math.floor(Math.random() * 3);
      }
      await say(`${n(shooter)} sul dischetto… ${n(gk)} lo guarda negli occhi.`, { cls: "drama", ms: 900 });
      let p = sd === gd ? 0.18 : 0.88;
      p += clamp((shooter.tiro - gk.gk) / 120, -0.06, 0.06);
      const ok = Math.random() < p;
      if (ok) { sc[side === "us" ? 0 : 1]++; await say(`⚽ GOL! ${n(shooter)} spiazza il portiere!`, { cls: side === "us" ? "us big" : "them big", ms: 700 }); }
      else await say(sd === gd ? `🧤 PARATO! ${n(gk)} ci arriva!` : `Fuori! ${n(shooter)} sbaglia la mira, il palo trema!`, { cls: side === "us" ? "them big" : "us big", ms: 700 });
      await say(`Rigori: ${sc[0]} – ${sc[1]}`, { cls: "sys", ms: 300 });
    };
    let i = 0;
    for (; i < 3; i++) { await kick("us", i); await kick("them", i); }
    let guard = 0;
    while (sc[0] === sc[1] && guard++ < 12) { await kick("us", i); await kick("them", i); i++; }
    if (sc[0] === sc[1]) { if (Math.random() < 0.5) sc[0]++; else sc[1]++; }
    S.pen = sc.slice();
    return sc[0] > sc[1];
  }

  async function playMatch(cfg) {
    const my = ++RUN;
    const us = buildUs(), them = JSON.parse(JSON.stringify(TEAMS[cfg.idx]));
    // ricostruisci le specifiche dei ritratti (JSON ok) e le tecniche
    us.players.forEach((p) => { p.side = "us"; });
    const bump = 2;
    them.players.forEach((p) => { p.side = "them"; p.mx = p.gr; if (p.role !== "GK") { p.tiro += bump; p.drib += bump; p.pass += bump; p.contr += cfg.idx < 2 ? bump : 0; } else p.gk += cfg.idx < 2 ? 0 : -2; });
    S = { us, them, score: [0, 0], turn: 0, poss: "us", zone: 2, carrier: null, marker: null, goals: [], idx: cfg.idx, stage: cfg.idx, cfg, over: false, text: [], dbg: null, penalties: false, pen: null, mustWin: !!cfg.mustWin, lastMk: null };
    setSub(`${us.name} – ${them.name}`);
    matchFrame();
    hud();
    const kick = us.players.find((p) => p.id === "fede") || field(us)[0];
    giveBall("us", kick, 2);
    await say(`🔔 <b>Fischio d'inizio!</b> ${esc(us.name)} contro ${esc(them.name)}.`, { cls: "big", ms: 800 });
    await say(`Palla a ${n(kick)}. Il cronista ha già dimenticato come si respira.`, { cls: "drama", ms: 600 });
    let extra = false;
    try {
      for (let guard = 0; guard < 80; guard++) {
        if (S.turn === HALF && !S.half2) { S.half2 = true; await halftime(); }
        if (S.turn >= LIMIT) {
          if (!S.mustWin || S.score[0] !== S.score[1]) break;
          if (!extra) { extra = true; recover(0.25); await say("⏱️ <b>PAREGGIO! Si va ai supplementari: gol d'oro!</b>", { cls: "big", ms: 1000 }); }
          if (S.turn >= LIMIT + EXTRA) break;
        }
        if (S.turn === LIMIT - 4) await say(S.score[0] < S.score[1] ? "⏱️ Mancano pochi minuti! La squadra non molla: sembra che tutto il campo spinga verso la porta avversaria!" : S.score[0] > S.score[1] ? "⏱️ Mancano pochi minuti! Bisogna tenere duro." : "⏱️ Mancano pochi minuti, pareggio… chi lo vuole di più?", { cls: "drama", ms: 900 });
        const before = S.score[0] + S.score[1];
        if (S.poss === "us") await attackTurn(); else await defendTurn();
        if (RUN !== my) throw ABORT;
        S.turn++;
        recover(0);
        hud();
        if (extra && S.score[0] + S.score[1] !== before) break;
      }
      let usWin;
      if (S.score[0] === S.score[1] && S.mustWin) usWin = await shootout();
      else usWin = S.score[0] > S.score[1];
      await say(S.score[0] === S.score[1] && !S.mustWin ? "🔔 <b>FISCHIO FINALE: finisce in pareggio.</b>" : `🔔 <b>FISCHIO FINALE!</b> ${S.score[0]} – ${S.score[1]}${S.pen ? ` (rigori ${S.pen[0]}–${S.pen[1]})` : ""}`, { cls: "big", ms: 1000 });
      S.over = true;
      return { win: usWin, draw: S.score[0] === S.score[1] && !S.mustWin, gf: S.score[0], ga: S.score[1], goals: S.goals.slice(), pen: S.pen };
    } catch (e) {
      if (e === ABORT) return null;
      throw e;
    }
  }

  // ---------- SCHERMATE ----------
  const stars = (k) => "★".repeat(k) + "☆".repeat(4 - k);
  function heroLine() {
    const h = getHero();
    return h ? (SV.useHero ? `Capitano: ${esc(h.name)} (n. ${esc(h.num)})` : "Capitano: Leo Moretti") : "Capitano: Leo Moretti";
  }
  async function menuMain() {
    for (;;) {
      chk(); SV = loadSave(); S = null;
      setSub("Il Trofeo del Mandorlo");
      const done = SV.cleared.filter(Boolean).length;
      setMain(`<div class="tc-scroll"><div class="tc-card2"><h3>⚽ Tsubasa Classico</h3><p>Partita a comandi, come nei vecchi giochi di calcio-anime: la palla passa da giocatore a giocatore e a ogni turno scegli <b>Dribbling</b>, <b>Passaggio</b> o <b>Tiro</b>. Gli scontri si decidono con le statistiche e la <b>Grinta</b>: spendila per scatenare una tecnica speciale.</p></div><div class="tc-card2"><h3>🏆 Trofeo del Mandorlo d'Oro</h3><p>Quattro partite · ${done}/4 vinte${SV.trophy ? " · 🏆 Coppa vinta" : ""}</p><p style="color:#9fb3d9">${heroLine()}</p></div></div>`);
      const h = getHero();
      const opts = [
        { label: "🏆 Torneo del Mandorlo", sub: done >= 4 ? "Completato: rigiocalo quando vuoi" : `Prossima: partita ${done + 1} di 4`, cls: "hot", k: "t" },
        { label: "⚽ Amichevole libera", sub: "Scegli l'avversario (nessuna moneta)", k: "f" },
        { label: "📖 Come si gioca", sub: "Comandi, grinta e tecniche", k: "h" },
        { label: "📊 Record", sub: `Vittorie ${SV.wins} · Gol ${SV.goalsFor}`, k: "r" },
      ];
      if (h) opts.push({ label: `Capitano: ${SV.useHero ? esc(h.name) : "Leo"}`, sub: "Tocca per cambiare (solo estetico/statistiche della modalità)", k: "u" });
      const r = await choose(opts, { tall: true, cols: 1, prompt: "Cosa vuoi fare?", menu: true });
      if (r.k === "t") await menuTorneo();
      else if (r.k === "f") await menuFriendly();
      else if (r.k === "h") await menuHow();
      else if (r.k === "r") await menuRecord();
      else if (r.k === "u") { SV.useHero = !SV.useHero; save(); }
    }
  }
  async function menuHow() {
    setMain(`<div class="tc-scroll"><div class="tc-card2"><h3>📖 Come si gioca</h3>
<h4>Il tuo turno (palla tua)</h4><p><b>Dribbling</b>: sfidi il difensore (tuo DRI contro il suo CON). <b>Passaggio</b>: scegli a chi, anche lungo (più rischioso). <b>Tiro</b>: da metà campo in su; in area è più forte.</p>
<h4>In difesa (palla loro)</h4><p>L'avversario annuncia che cosa fa: puoi <b>Contrastare</b> o <b>Intercettare</b>; la variante rischiosa (Scivolata/Anticipa) dà +3 ma costa caro se fallisce. Sui tiri puoi <b>Respingere</b> col difensore o lasciare al portiere.</p>
<h4>Grinta</h4><p>Ogni giocatore ha la sua barra. <b>Metti grinta</b> costa 10 e dà +4. Le <b>tecniche speciali</b> (✦) costano di più ma danno un bonus enorme e partono con il cut-in. Si recupera un po' a ogni turno e all'intervallo.</p>
<h4>Tiri</h4><p>Un difensore può frapporsi sulla traiettoria (le tecniche con «scavalca» lo evitano). Poi c'è lo scontro con il portiere: palo, traversa, parata disperata, ribattuta. Con due o tre giocatori vicini si possono fare <b>tiri combinati</b>.</p>
<h4>Partita</h4><p>Due tempi da ${HALF} turni. Se resti sotto, la squadra ha uno slancio in più (rimonta!). Nel torneo, il pareggio va a supplementari e rigori.</p>
<h4>Ricompense</h4><p>Monete solo alla <b>prima vittoria</b> di ogni partita del torneo, più due maglie da sbloccare. Nessun effetto sul resto del gioco.</p>
<h4>Tocchi</h4><p>Tocca il commento o un cut-in per saltare le pause.</p></div></div>`);
    await choose([{ label: "◂ Indietro" }], { menu: true });
  }
  async function menuRecord() {
    setMain(`<div class="tc-scroll"><div class="tc-card2"><h3>📊 Record</h3><p>Torneo: ${SV.played} partite · ${SV.wins} vinte · ${SV.losses} perse</p><p>Gol fatti ${SV.goalsFor} · subiti ${SV.goalsAgainst}</p><p>Miglior scarto: +${SV.bestMargin}</p><p>Amichevoli: ${SV.friendly.played} · vinte ${SV.friendly.wins} · pareggi ${SV.friendly.draws}</p><p>Monete guadagnate qui: ${SV.coins}</p><p>Maglie: ${SV.cleared[2] ? "✓" : "🔒"} Arancio del Mandorlo (semifinale) · ${SV.cleared[3] ? "✓" : "🔒"} Oro del Mandorlo (finale)</p></div></div>`);
    await choose([{ label: "◂ Indietro" }], { menu: true });
  }
  async function menuTorneo() {
    for (;;) {
      chk(); SV = loadSave();
      setSub("Trofeo del Mandorlo d'Oro");
      const done = SV.cleared.filter(Boolean).length;
      if (!SV.seenIntro) {
        await scene([["v", "Benvenuti al Trofeo del Mandorlo d'Oro! Quattro partite sul campo di Costalta, un mandorlo in vaso come coppa, e una Pro Loco che giura di aver pensato a tutto."], ["nico", "A tutto tranne all'acqua. Ma tanto non beviamo: giochiamo."]]);
        SV.seenIntro = true; save();
      }
      setMain(`<div class="tc-scroll"><div class="tc-card2"><h3>🏆 Trofeo del Mandorlo d'Oro</h3><p>Vinci le quattro partite di fila per portare a casa il mandorlo. Se perdi, puoi rigiocare quando vuoi. Le monete si guadagnano solo alla prima vittoria di ogni partita (${COINS.join(" / ")}).</p></div></div>`);
      const opts = TEAMS.map((t, i) => {
        const open = i === 0 || SV.cleared[i - 1];
        return { label: `${i + 1} · ${esc(t.name)}`, sub: !open ? "🔒 Vinci la partita precedente" : `${stars(t.stars)} · ${SV.cleared[i] ? "Vinta ✓ (rigioca)" : "Da giocare"}`, cls: open && !SV.cleared[i] ? "hot" : "", disabled: !open, i, w: open && !SV.cleared[i] ? 10 : open ? 1 : 0 };
      });
      opts.push({ label: "◂ Indietro", i: -1, w: 0.01 });
      const r = await choose(opts, { tall: true, cols: 1, prompt: `Partite vinte ${done}/4`, menu: true });
      if (r.i < 0) return;
      if (botFlag && r.i < 0) return;
      const ok = await runMatch(r.i, true);
      if (ok === "menu") return;
      if (botFlag && SV.cleared.every(Boolean)) return;
    }
  }
  async function menuFriendly() {
    chk();
    setMain(`<div class="tc-scroll"><div class="tc-card2"><h3>⚽ Amichevole libera</h3><p>Una partita senza posta in gioco: se finisce pari, finisce pari. Nessuna moneta, nessuna ricompensa.</p></div></div>`);
    const opts = TEAMS.map((t, i) => ({ label: esc(t.name), sub: stars(t.stars), i }));
    opts.push({ label: "◂ Indietro", i: -1, w: 0.01 });
    const r = await choose(opts, { tall: true, cols: 1, prompt: "Scegli l'avversario", menu: true });
    if (r.i < 0) return;
    await runMatch(r.i, false);
  }

  async function runMatch(idx, cup) {
    chk();
    if (cup) await scene(STORY[idx].pre);
    const res = await playMatch({ idx, mustWin: cup });
    if (!res) return "abort";
    SV = loadSave();
    let coinsMsg = "", cosMsg = "", newly = false;
    if (cup) {
      SV.played++; SV.goalsFor += res.gf; SV.goalsAgainst += res.ga;
      if (res.win) {
        SV.wins++;
        SV.bestMargin = Math.max(SV.bestMargin, res.gf - res.ga);
        if (!SV.cleared[idx]) { SV.cleared[idx] = true; newly = true; }
        if (!SV.paid[idx]) {
          SV.paid[idx] = true; SV.coins += COINS[idx]; save();
          try { if (typeof window.addCoins === "function") window.addCoins(COINS[idx]); } catch (e) { /* ok */ }
          coinsMsg = `+${COINS[idx]} monete (prima vittoria)`;
        }
        if (idx === 2 && newly) cosMsg = "Nuova maglia sbloccata: «Arancio del Mandorlo»";
        if (idx === 3 && newly) { cosMsg = "Nuova maglia sbloccata: «Oro del Mandorlo»"; SV.trophy = true; }
      } else SV.losses++;
    } else {
      SV.friendly.played++;
      if (res.win) SV.friendly.wins++; else if (res.draw) SV.friendly.draws++;
    }
    save();
    if (cup) await scene(res.win ? STORY[idx].win : STORY[idx].lose);
    const scorers = res.goals.map((g) => `${g.side === "us" ? "⚽" : "🔸"} ${esc(g.name)} ${g.min}'`).join("<br>") || "Nessun gol";
    const verdict = res.win ? "VITTORIA!" : res.draw ? "Pareggio" : "Sconfitta";
    setSub(verdict);
    setMain(`<div class="tc-scroll"><div class="tc-card2"><h3>${esc(res.win ? "🏆 " : "") + verdict}</h3><div class="tc-big">${res.gf} – ${res.ga}</div>${res.pen ? `<p style="text-align:center">ai rigori ${res.pen[0]} – ${res.pen[1]}</p>` : ""}<p>${esc(S && S.us ? S.us.name : "Rondine FC")} contro ${esc(TEAMS[idx].name)}</p><h4>Marcatori</h4><p>${scorers}</p>${coinsMsg ? `<p style="color:#ffd23f"><b>💰 ${coinsMsg}</b></p>` : ""}${cosMsg ? `<p style="color:#57d68d"><b>👕 ${cosMsg}</b></p>` : ""}${cup && idx === 3 && res.win ? `<p><b>🏆 Hai vinto il Trofeo del Mandorlo d'Oro!</b></p>` : ""}${cup && !res.win ? "<p>Il torneo non finisce qui: rigioca la partita quando vuoi.</p>" : ""}</div></div>`);
    S = null;
    const opts = [];
    if (cup && res.win && idx < 3) opts.push({ label: "Prossima partita ▸", cls: "hot", k: "next", w: 8 });
    opts.push({ label: res.win ? "Rigioca" : "Riprova ▸", cls: res.win ? "" : "hot", k: "again", w: res.win ? 0.5 : 5 });
    opts.push({ label: "◂ Menu", k: "menu", w: 0.5 });
    const r = await choose(opts, { prompt: "Fine partita" });
    if (r.k === "next") return runMatch(idx + 1, true);
    if (r.k === "again") return runMatch(idx, cup);
    return "menu";
  }

  // ---------- APERTURA ----------
  function openTsubasaClassico(back) {
    openMod(back);
    SV = loadSave();
    menuMain().catch((e) => { if (e !== ABORT && DEBUG) console.error("[tsubasa-classico]", e); });
  }
  window.openTsubasaClassico = openTsubasaClassico;

  if (DEBUG) {
    window.__tc = {
      TEAMS, STORY, COINS, loadSave, buildUs, openTsubasaClassico,
      get S() { return S; }, get SV() { return SV; },
      get bot() { return botFlag; }, set bot(v) { botFlag = !!v; },
      resetSave() { try { localStorage.removeItem(K_SAVE); } catch (e) { /* ok */ } SV = loadSave(); },
      setCleared(a) { SV = loadSave(); SV.cleared = a; save(); },
      destroy, get spd() { return SPD; }, set spd(v) { SPD = +v || 1; },
      // partita veloce con bot (senza UI di menu): ritorna il risultato
      async sim(idx, mustWin) { openMod(null); SV = loadSave(); const b = botFlag; botFlag = true; try { return await playMatch({ idx, mustWin: !!mustWin }); } finally { botFlag = b; } },
    };
  }
})();
