// js/sogni.js - LA SQUADRA DEI SOGNI (Salone delle Saghe → 🃏 La Squadra dei Sogni)
// Un premio nuovo da collezionare: le CARTE DEI SOGNI, una per ogni personaggio importante delle saghe, con il ritratto,
// la rarità (comune, rara, epica, leggendaria), tre valori (attacco, difesa, tecnica) e l'effetto olografico.
//  - Le carte si sbloccano giocando: un capitolo concluso sblocca le comuni della saga, due le rare, la saga finita le
//    epiche, tutti i finali le leggendarie. Le BUSTINE (monete) danno una carta a sorpresa delle saghe che hai cominciato.
//  - La SQUADRA: cinque carte. L'INTESA sale con due personaggi della stessa saga (+1) e con i LEGAMI speciali tra
//    personaggi di saghe diverse (+3): maestri, rivali, chi sa tutto, chi ha visto il '52…
//  - Il TORNEO DEI SOGNI: otto sfide, ognuna nel motore originale di una saga (Vignette, ATB, Super-Bottoni, il Nastro,
//    Luci, il Concilio, il Duello Cinematico, la Lavagna Tattica). La squadra dà vantaggi diversi in ogni motore: grinta,
//    credibilità, tiri, lanterne, riavvolgimenti, giocatori in lavagna. Vincere tutto vale la carta del Campione dei Sogni.
// Salvataggio proprio: ali-di-rondine.sogni { own:[id], team:[id×5], won:[sfida], packs }.
(function () {
  "use strict";
  if (window.__sogni) return;
  const KEY = "ali-di-rondine.sogni", PACK = 120;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  // le saghe da cui vengono le carte: chiave di salvataggio, nome, colore
  const SAGHE = {
    torneo: ["ali-di-rondine.torneo", "Il Torneo delle Cento Scuole", "#c83a3a"], cronache: ["ali-di-rondine.cronache", "Le Cronache del Pallone di Cristallo", "#7a4ab0"], mantello: ["ali-di-rondine.mantello", "Il Mantello Granata", "#8a1a2a"],
    stagione: ["ali-di-rondine.stagione", "Stagione Infinita", "#ff5a7a"], lampioni: ["ali-di-rondine.lampioni", "La Notte dei Lampioni", "#ffd27a"], trono: ["ali-di-rondine.trono", "Il Trono di Cuoio", "#8a5a2a"],
    campetto: ["ali-di-rondine.campetto", "Dal Campetto al Mondiale", "#1f5fbf"], colline: ["ali-di-rondine.colline", "Master League delle Colline", "#2a6a3a"], grigio: ["ali-di-rondine.grigio", "Il Cavaliere della Notte", "#2a3040"], ducati: ["ali-di-rondine.ducati", "La Guerra dei Tre Ducati", "#c8a040"], detective: ["ali-di-rondine.detective", "Detective di Campo", "#3a4a5a"],
    spazio: ["ali-di-rondine.spazio", "Calcio Spaziale", "#2a6ac8"], vento: ["ali-di-rondine.vento", "La Valle del Vento Gentile", "#5a9a7a"], dopo: ["ali-di-rondine.dopo", "Dopo il Campione", "#a8622a"], mondi: ["ali-di-rondine.mondi", "Il Torneo dei Mondi", "#2a1a4a"],
  };
  // [id, saga, rarità (c r e l), attacco, difesa, tecnica, ruolo]
  const CARDS = [
    ["td_lia", "ducati", "c", 70, 54, 62, "A"], ["td_ottone", "ducati", "c", 50, 62, 72, "C"], ["td_corrado", "ducati", "r", 58, 78, 66, "D"], ["td_isotta", "ducati", "e", 64, 58, 82, "C"],
    ["gr_marisa", "grigio", "c", 64, 58, 62, "C"], ["gr_gancio", "grigio", "c", 50, 78, 52, "D"], ["gr_vela", "grigio", "e", 72, 56, 76, "A"], ["gr_alfio", "grigio", "l", 60, 70, 86, "C"],
    ["ts_tito", "torneo", "c", 66, 52, 60, "A"], ["ts_alba", "torneo", "c", 58, 60, 64, "C"], ["ts_lume", "torneo", "r", 70, 58, 66, "A"], ["ts_iole", "torneo", "e", 50, 64, 76, "C"],
    ["cc_lyra", "cronache", "c", 58, 72, 60, "D"], ["cc_fosco", "cronache", "c", 52, 50, 74, "C"], ["cc_rubi", "cronache", "r", 72, 54, 66, "A"], ["cc_re", "cronache", "l", 74, 80, 78, "D"],
    ["mg_tilde", "mantello", "c", 46, 60, 70, "C"], ["mg_bullone", "mantello", "c", 54, 74, 58, "D"], ["mg_brace", "mantello", "r", 70, 64, 60, "A"], ["mg_dottore", "mantello", "e", 64, 70, 76, "C"],
    ["sf_ada", "stagione", "c", 54, 60, 70, "C"], ["sf_teo", "stagione", "c", 66, 56, 62, "A"], ["sf_mira", "stagione", "r", 60, 58, 72, "C"], ["sf_gatto", "stagione", "l", 78, 66, 82, "A"],
    ["nl_fiammetta", "lampioni", "c", 56, 62, 66, "C"], ["nl_tobia", "lampioni", "c", 52, 66, 56, "D"], ["nl_leandro", "lampioni", "e", 76, 60, 74, "A"], ["nl_lucia", "lampioni", "r", 48, 72, 74, "D"],
    ["tc_brunilde", "trono", "c", 62, 70, 60, "D"], ["tc_gualtiero", "trono", "c", 58, 68, 62, "D"], ["tc_ysolde", "trono", "e", 66, 62, 80, "C"], ["tc_ardo", "trono", "r", 56, 78, 60, "P"],
    ["cm_saverio", "campetto", "c", 40, 80, 60, "P"], ["cm_pio", "campetto", "c", 54, 56, 72, "C"], ["cm_leone", "campetto", "r", 80, 52, 64, "A"], ["cm_bastiano", "campetto", "l", 84, 64, 86, "A"],
    ["ml_marta", "colline", "c", 58, 62, 70, "C"], ["ml_rino", "colline", "c", 68, 50, 56, "A"], ["ml_bice", "colline", "r", 50, 70, 74, "D"], ["ml_pino", "colline", "e", 60, 66, 84, "C"],
    ["dc_agata", "detective", "c", 56, 70, 72, "P"], ["dc_nina", "detective", "c", 62, 56, 68, "C"], ["dc_vanni", "detective", "r", 54, 66, 72, "D"],
    ["so_blop", "spazio", "c", 60, 64, 62, "D"], ["so_mira", "spazio", "c", 58, 58, 74, "C"], ["so_zorgo", "spazio", "r", 74, 56, 66, "A"],
    ["ve_selva", "vento", "c", 60, 60, 66, "C"], ["ve_sbuffo", "vento", "c", 56, 66, 60, "D"], ["ve_mormorio", "vento", "r", 66, 58, 72, "A"],
    ["ep_ada", "dopo", "c", 54, 62, 70, "C"], ["ep_bruno", "dopo", "r", 72, 62, 70, "A"], ["ep_tecla", "dopo", "c", 56, 66, 64, "D"],
    ["tm_custode", "mondi", "e", 70, 70, 80, "C"], ["tm_eclisse", "mondi", "l", 80, 76, 76, "A"],
  ].map(([id, saga, rar, at, df, te, role]) => ({ id, saga, rar, at, df, te, role }));
  const BY = Object.fromEntries(CARDS.map((c) => [c.id, c]));
  // la frase speciale che la carta dice quando arriva a tre stelle
  const FRASI = {
    td_lia: "Il sale è di chi lo scava. E il gol è di chi lo segna.", td_ottone: "Ho calcolato tutto. Tranne quanto mi sarei divertito.", td_corrado: "Testa alta, scarpe rotte, cuore intero.", td_isotta: "Gioco per vincere, non per comprare.",
    gr_marisa: "Se smetto di giocare, hanno vinto loro. Quindi gioco.", gr_gancio: "Un armadio in difesa non si sposta. Provaci.", gr_vela: "Ti ho rubato la palla. Te la restituisco in rete, come sempre.", gr_alfio: "Quarant'anni fa ero più veloce. Oggi sono più furbo.",
    ts_tito: "Il pane si sforna all'alba, i gol al novantesimo.", ts_alba: "Consegno i palloni come le lettere: sempre all'indirizzo giusto.", ts_lume: "Una lanterna sola non illumina il campo. Undici, sì.", ts_iole: "Oggi la lezione è una sola: passate la palla.",
    cc_lyra: "Il mio scudo è la difesa. La mia spada è il contropiede.", cc_fosco: "Non vedo la porta, ma la sento. Di solito.", cc_rubi: "Ti ho rubato la palla. Te la restituisco in rete.", cc_re: "…",
    mg_tilde: "Ogni maglia che cucio porta un punto d'onore.", mg_bullone: "TOSTATURA COMPLETATA. TIRO CROCCANTE IN ARRIVO.", mg_brace: "Spengo gli incendi, accendo le curve.", mg_dottore: "Fuorigioco! …ah no, stavolta sono io in ritardo.",
    sf_ada: "Il Lido è aperto anche d'inverno, per chi gioca col cuore.", sf_teo: "Il Real Lago non molla. Mai. Neanche la domenica sera.", sf_mira: "Qui Radio Lago: gol, gol, GOL!", sf_gatto: "Miao. (Lo prende come un sì.)",
    nl_fiammetta: "Una luce accesa al momento giusto vale un gol.", nl_tobia: "Batto il tempo della partita a colpi di campana.", nl_leandro: "Un'ombra non segna. Ma sa sempre dov'è la palla.", nl_lucia: "Ho acceso lampioni per sessant'anni. Posso accendere anche voi.",
    tc_brunilde: "Il mio voto vale una casata. Il mio tackle, due.", tc_gualtiero: "La spada si impugna come il pallone: con rispetto.", tc_ysolde: "So già cosa farai. Lo sapevo ieri.", tc_ardo: "Pietra su pietra si alza un muro. E io sono il muro.",
    cm_saverio: "Da qui non passa nessuno. Neanche il vento.", cm_pio: "Corro io, tu pensa a segnare.", cm_leone: "Il fuoco del campetto non si spegne mai.", cm_bastiano: "Ho aspettato quarant'anni una squadra così.",
    ml_marta: "La fascia da capitana pesa poco, se la porti con tutti.", ml_rino: "Arrivo sempre in orario. Anche sul secondo palo.", ml_bice: "La contessa approva. Con riserva.", ml_pino: "Abracadabra: il pallone è sparito… in porta.",
    dc_agata: "Ho le prove: questa squadra è la migliore.", dc_nina: "Prima pagina: «Trionfo dei Sogni». Lo scrivo io.", dc_vanni: "Verbale firmato. Partita vinta, timbro e controfirma.",
    so_blop: "Blop! (Blop significa: passa la palla.)", so_mira: "Ho ricalcolato la traiettoria: è gol al 99,8%.", so_zorgo: "Tre occhi vedono tre passaggi in più.",
    ve_selva: "Il vento gentile soffia sempre verso la porta giusta.", ve_sbuffo: "Fffff! (Il pallone vola più leggero.)", ve_mormorio: "Ascolta: anche l'erba fa il tifo.",
    ep_ada: "In ogni epoca c'è un gol che aspetta di essere segnato.", ep_bruno: "Nel '28 si giocava col cuoio pesante. Il cuore era lo stesso.", ep_tecla: "La storia della famiglia la scriviamo in campo.",
    tm_custode: "Ogni porta si apre, prima o poi. Anche quella avversaria.", tm_eclisse: "Anche il buio ha bisogno di una squadra.",
  };
  // le squadre inventate della Stagione dei Sogni e del Draft
  const TEAMS = [
    { name: "Atletico Nuvolari", color: "#3a8ad8", style: "pressing", f: 62, pl: ["Cirro", "Strato", "Nembo", "Cumulo"] },
    { name: "Sporting Lanternino", color: "#e8a83a", style: "equilibrata", f: 64, pl: ["Stoppino", "Cera", "Fiocco", "Miccia"] },
    { name: "Real Pentolino", color: "#c83a3a", style: "contropiede", f: 66, pl: ["Mestolo", "Coperchio", "Sugo", "Forchettone"] },
    { name: "Dinamo Girasole", color: "#e8d03a", style: "pressing", f: 68, pl: ["Petalo", "Seme", "Stelo", "Corolla"] },
    { name: "Olimpia Vecchio Molo", color: "#2a6a8a", style: "difensiva", f: 70, pl: ["Bitta", "Cima", "Ancora", "Gomena"] },
    { name: "Union Cometa", color: "#7a5ad8", style: "contropiede", f: 73, pl: ["Coda", "Chioma", "Nucleo", "Scia"] },
    { name: "I Leggendari del Faro", color: "#1a2a4a", style: "equilibrata", f: 76, pl: ["Lampo", "Vedetta", "Scoglio", "Fanale"] },
  ];
  const ENG = ["vignette", "bottoni", "luci", "nastro", "concilio", "lavagna", "duello", "atb", "gadget", "iso"];
  const RAR = { c: ["Comune", "#9aa5b1", 1], r: ["Rara", "#3a8ad8", 2], e: ["Epica", "#a85ad8", 3], l: ["Leggendaria", "#ffd23f", 4] };
  // i legami tra saghe diverse: +3 di intesa se entrambi in squadra
  const LINKS = [
    ["td_corrado", "tc_gualtiero", "Vecchi capitani"], ["td_isotta", "tc_ysolde", "Eredi che non obbediscono"], ["td_lia", "gr_vela", "Ribelli dei tetti"],
    ["gr_vela", "nl_leandro", "Ombre sui tetti"], ["gr_marisa", "ml_marta", "Capitane sotto la pioggia"], ["gr_alfio", "cm_bastiano", "I vecchi che sanno"],
    ["cm_bastiano", "ml_pino", "Vecchi maestri"], ["cm_bastiano", "nl_leandro", "Il '52 e il '78"], ["tc_ysolde", "dc_agata", "Chi sa tutto"], ["cm_leone", "ts_lume", "Rivali di fuoco"],
    ["mg_bullone", "so_blop", "Ferraglia amica"], ["sf_gatto", "nl_lucia", "Le notti lunghe"], ["cc_re", "tm_eclisse", "Il silenzio e il buio"], ["ml_marta", "nl_fiammetta", "Fiori e lanterne"],
    ["tc_brunilde", "cc_lyra", "Cavaliere"], ["cm_saverio", "tc_ardo", "Muri di pietra"], ["sf_ada", "ep_ada", "Le due Ade"], ["ve_selva", "mg_tilde", "Mani gentili"], ["tm_custode", "cm_bastiano", "Chi aspetta"],
  ];
  // le otto sfide del Torneo dei Sogni: cabinato della Sala Giochi (motore) e avversario
  const SFIDE = [
    { m: "vignette", saga: "torneo", opp: { name: "I Sogni delle Cento Scuole", color: "#c83a3a", style: "equilibrata" } },
    { m: "bottoni", saga: "mantello", opp: { name: "I Sogni di Metropolenta", color: "#8a1a2a", style: "contropiede", players: [{ name: "Tonno" }, { name: "Ciuffo" }, { name: "Colla" }, { name: "Mastice" }] } },
    { m: "luci", saga: "lampioni", opp: { name: "Le Ombre dei Sogni", color: "#6a7ab8", style: "equilibrata" } },
    { m: "nastro", saga: "stagione", opp: { name: "La Domenica dei Sogni", color: "#ff5a7a", style: "pressing" } },
    { m: "concilio", saga: "trono", opp: { name: "La Casata dei Sogni", color: "#8a6a1a", sigil: "🌳", honor: 0.4, style: "pressing" } },
    { m: "lavagna", saga: "colline", opp: { name: "La Lega dei Sogni", color: "#a83a2a", style: "pressing", ovr: 68, instr: "pressing" } },
    { m: "duello", saga: "campetto", opp: { name: "La Nazionale dei Sogni", color: "#e8e8f0", style: "pressing", players: [{ name: "Il Barone", pow: 14 }, { name: "Gelo", pow: 12 }], keeper: { name: "Il Muro dei Sogni", pow: 16 }, ace: { name: "Il Barone", special: "Fuoco del Nord" } } },
    { m: "atb", saga: "cronache", opp: null },
  ];
  // ---------------------------------------------------------------- salvataggio
  const load = () => { const o = load0(); XPC = o.xp; return o; };
  const load0 = () => { const r = safe(() => JSON.parse(localStorage.getItem(KEY) || "null"), null) || {}; return { own: Array.isArray(r.own) ? r.own.filter((x) => BY[x]) : [], team: Array.isArray(r.team) ? r.team.filter((x) => BY[x]).slice(0, 5) : [], won: Array.isArray(r.won) ? r.won.filter((x) => typeof x === "number") : [], packs: r.packs | 0, hero: !!r.hero, xp: r.xp && typeof r.xp === "object" ? r.xp : {}, season: r.season && Array.isArray(r.season.sched) ? r.season : null, titles: r.titles | 0, draft: r.draft && Array.isArray(r.draft.picks) ? r.draft : null, cups: r.cups | 0 }; };
  const save = (r) => { XPC = r.xp || {}; safe(() => localStorage.setItem(KEY, JSON.stringify(r)), 0); };
  const sagaMem = (k) => safe(() => JSON.parse(localStorage.getItem(SAGHE[k][0]) || "null"), null);
  function progress(k) { const m = sagaMem(k); if (!m) return { ch: 0, ends: 0 }; return { ch: Object.keys(m.done || {}).length, ends: Array.isArray(m.ends) ? m.ends.length : 0 }; }
  const earned = (c) => { const p = progress(c.saga); return c.rar === "c" ? p.ch >= 1 : c.rar === "r" ? p.ch >= 2 : c.rar === "e" ? p.ch >= 3 || p.ends >= 1 : p.ends >= 4; };
  function sync() { const r = load(); XPC = r.xp; let nw = []; CARDS.forEach((c) => { if (!r.own.includes(c.id) && earned(c)) { r.own.push(c.id); nw.push(c.id); } }); if (nw.length) save(r); return { r, nw }; }
  // ---------------------------------------------------------------- intesa e forza
  function intesa(team) {
    let n = 0; const why = [];
    for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++) { const a = BY[team[i]], b = BY[team[j]]; if (!a || !b) continue; if (a.saga === b.saga) n += 1; const L = LINKS.find(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id)); if (L) { n += 3; why.push(L[2]); } }
    return { n: Math.min(15, n), why };
  }
  // le stelle: la carta cresce giocando (3, 8 e 15 punti esperienza); ogni stella dà +2 a tutte le statistiche, solo qui nella Squadra dei Sogni
  let XPC = {};
  const starsOf = (id) => { const x = XPC[id] | 0; return x >= 15 ? 3 : x >= 8 ? 2 : x >= 3 ? 1 : 0; };
  const eff = (c) => { const b = starsOf(c.id) * 2; return { at: c.at + b, df: c.df + b, te: c.te + b }; };
  const ovr = (c) => { const e = eff(c); return Math.round((e.at + e.df + e.te) / 3); };
  const forza = (team) => { const cs = team.map((id) => BY[id]).filter(Boolean); if (!cs.length) return 40; return Math.round(cs.reduce((s, c) => s + ovr(c), 0) / cs.length); };
  function gainXp(team, win, sim) {
    const r = load(), ups = [];
    team.forEach((id) => { if (!r.own.includes(id)) return; const s0 = starsOf(id); r.xp[id] = Math.min(15, (r.xp[id] | 0) + (sim ? (win ? 1 : 0) : win ? 2 : 1)); XPC = r.xp; if (starsOf(id) > s0) ups.push([id, starsOf(id)]); });
    save(r); return ups;
  }
  // le carte salite di stella dopo una partita; a tre stelle si sblocca la frase speciale
  function levelUps(ups, then) {
    if (!ups.length) return then();
    const [id, st] = ups[0], body = shell(st >= 3 ? "⭐⭐⭐ Carta al massimo!" : "⭐ La carta cresce");
    body.innerHTML = `<div class="reveal">${cardHtml(id)}</div><p class="sum" style="text-align:center"><b>${esc(name(id))}</b> sale a ${"★".repeat(st)}${"☆".repeat(3 - st)} · +2 a tutte le statistiche</p>${st >= 3 ? `<p class="frase">«${esc(FRASI[id] || "Questa squadra è un sogno.")}»</p>` : ""}<div class="big"><button type="button" data-ok="1">Avanti ▸<small>${ups.length > 1 ? "Un'altra carta è cresciuta" : "Si continua"}</small></button></div>`;
    body.querySelector("[data-ok]").onclick = () => levelUps(ups.slice(1), then);
  }
  const name = (id) => { const C = window.__borgoApi && window.__borgoApi.CAST; return (C && C[id] && C[id].name) || id; };
  const port = (id) => safe(() => window.__borgoApi.portraitImg(id), null);
  // ---------------------------------------------------------------- la carta (HTML)
  function cardHtml(id, opts) {
    const c = BY[id], R = RAR[c.rar], own = !opts || opts.own !== false, img = own ? port(id) : null, S = SAGHE[c.saga], st = own ? starsOf(id) : 0, e = own ? eff(c) : c;
    return `<div class="sgCard r${c.rar}${own ? "" : " lock"}${opts && opts.sel ? " sel" : ""}${st >= 3 ? " s3" : ""}" data-c="${id}" style="--rc:${R[1]};--sc:${S[2]}"${st >= 3 ? ` title="«${esc(FRASI[id] || "")}»"` : ""}><div class="hd"><span>${R[0]}</span><b>${c.role}</b></div>${st ? `<div class="stars">${"★".repeat(st)}</div>` : ""}<div class="img">${img ? `<img alt="" src="${img}">` : `<span>?</span>`}</div><div class="nm">${own ? esc(name(id)) : "???"}</div><div class="st"><span>ATT <b>${own ? e.at : "–"}</b></span><span>DIF <b>${own ? e.df : "–"}</b></span><span>TEC <b>${own ? e.te : "–"}</b></span></div><div class="sg">${esc(S[1])}</div></div>`;
  }
  // ---------------------------------------------------------------- le schermate
  let OV = null, BACK = null;
  function shell(title) { css(); if (OV) OV.remove(); OV = document.createElement("div"); OV.className = "sgOv"; OV.innerHTML = `<div class="wrap"><div class="bar"><h2>${title}</h2><button type="button" class="x" aria-label="Chiudi">✕</button></div><div class="body"></div></div>`; OV.querySelector(".x").onclick = () => { const b = BACK; closeAll(); if (typeof b === "function") b(); }; document.body.appendChild(OV); return OV.querySelector(".body"); }
  function closeAll() { if (OV) { OV.remove(); OV = null; } }
  function open(back) {
    if (back) BACK = back; const { r, nw } = sync(); const body = shell("🃏 La Squadra dei Sogni");
    const I = intesa(r.team), coins = safe(() => window.__borgoApi.coins(), 0);
    let h = `<p class="sum">Le carte dei personaggi di tutte le saghe. Si sbloccano giocando, o con le bustine. Carte: <b>${r.own.length}/${CARDS.length}</b> · monete: <b>${coins}</b>${nw.length ? ` · <b class="new">nuove: ${nw.length}</b>` : ""}</p>`;
    h += `<div class="sec">La tua squadra · forza <b>${forza(r.team)}</b> · intesa <b>${I.n}</b>/15${I.why.length ? ` <span class="why">(${I.why.map(esc).join(", ")})</span>` : ""}</div><div class="team">${[0, 1, 2, 3, 4].map((k) => (r.team[k] ? cardHtml(r.team[k]) : `<div class="sgCard empty" data-slot="${k}"><span>+</span></div>`)).join("")}</div>`;
    h += `<div class="big"><button type="button" data-go="tour">🏆 Torneo dei Sogni<small>${r.won.length}/8 sfide vinte · ogni sfida in un motore diverso</small></button><button type="button" data-go="pack" ${coins < PACK ? "disabled" : ""}>🎴 Bustina<small>${PACK} monete · una carta a sorpresa</small></button><button type="button" data-go="season">📅 Stagione dei Sogni<small>${r.season ? `giornata ${Math.min(7, r.season.day + 1)}/7` : "campionato a 8 squadre"}${r.titles ? ` · scudetti ${r.titles}` : ""}</small></button><button type="button" data-go="draft">🎲 Draft<small>${r.draft ? (r.draft.picks.length < 5 ? `scelta ${r.draft.picks.length + 1}/5` : "coppa in corso") : "scegli 1 carta su 3 e gioca la coppa"}${r.cups ? ` · coppe ${r.cups}` : ""}</small></button></div><p class="sum">Le carte crescono giocando: ⭐ a 3 punti esperienza, ⭐⭐ a 8, ⭐⭐⭐ a 15 (+2 a ogni statistica per stella; a tre stelle la carta dice la sua frase).</p>`;
    h += `<div class="sec">Collezione · tocca una carta per metterla in squadra o toglierla</div><div class="coll">${CARDS.slice().sort((a, b) => r.own.includes(b.id) - r.own.includes(a.id)).map((c) => cardHtml(c.id, { own: r.own.includes(c.id), sel: r.team.includes(c.id) })).join("")}</div>`;
    h += `<div class="sec">Legami tra saghe (+3 di intesa)</div><div class="links">${LINKS.map(([a, b, t]) => `<span class="${r.own.includes(a) && r.own.includes(b) ? "ok" : ""}"><b>${esc(t)}</b> ${r.own.includes(a) ? esc(name(a)) : "???"} + ${r.own.includes(b) ? esc(name(b)) : "???"}</span>`).join("")}</div>`;
    body.innerHTML = h;
    body.querySelectorAll(".coll .sgCard:not(.lock)").forEach((el) => (el.onclick = () => toggle(el.dataset.c)));
    body.querySelectorAll(".team .sgCard[data-c]").forEach((el) => (el.onclick = () => toggle(el.dataset.c)));
    body.querySelector('[data-go="tour"]').onclick = torneo;
    body.querySelector('[data-go="pack"]').onclick = pack;
    body.querySelector('[data-go="season"]').onclick = stagione;
    body.querySelector('[data-go="draft"]').onclick = draft;
  }
  function toggle(id) { const r = load(); if (r.team.includes(id)) r.team = r.team.filter((x) => x !== id); else if (r.team.length < 5 && r.own.includes(id)) r.team.push(id); save(r); open(); }
  function pack() {
    const coins = safe(() => window.__borgoApi.coins(), 0); if (coins < PACK) return;
    const r = load(), started = Object.keys(SAGHE).filter((k) => progress(k).ch >= 1), pool = CARDS.filter((c) => !r.own.includes(c.id) && (started.includes(c.saga) || c.rar === "c"));
    if (!pool.length) return;
    safe(() => window.addCoins(-PACK), 0);
    const w = pool.flatMap((c) => Array(5 - RAR[c.rar][2]).fill(c)), got = w[Math.floor(Math.random() * w.length)];
    r.own.push(got.id); r.packs++; save(r); reveal(got.id, "Dalla bustina", open);
  }
  function reveal(id, title, then) {
    const body = shell("🎴 " + esc(title));
    body.innerHTML = `<div class="reveal">${cardHtml(id)}</div><p class="sum" style="text-align:center"><b>${esc(name(id))}</b> · ${RAR[BY[id].rar][0]} · ${esc(SAGHE[BY[id].saga][1])}</p><div class="big"><button type="button" data-ok="1">Nella collezione ▸<small>La trovi tra le carte</small></button></div>`;
    try { const A = new (window.AudioContext || window.webkitAudioContext)(); [523, 659, 784, 1046].forEach((f, i) => { const o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; g.gain.value = 0.04; g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 0.2 + i * 0.1); o.connect(g); g.connect(A.destination); o.start(A.currentTime + i * 0.1); o.stop(A.currentTime + 0.3 + i * 0.1); }); } catch (e) {}
    body.querySelector("[data-ok]").onclick = then;
  }
  // ---------------------------------------------------------------- il Torneo dei Sogni
  function torneo() {
    const r = load(), body = shell("🏆 Torneo dei Sogni"), I = intesa(r.team), f = forza(r.team);
    let h = `<p class="sum">Otto sfide, otto motori. La tua squadra (forza ${f}, intesa ${I.n}) dà vantaggi diversi in ogni motore. ${r.team.length < 5 ? "<b>Servono cinque carte in squadra.</b>" : ""}</p>`;
    h += SFIDE.map((s, i) => { const M = safe(() => window.__salone.machine(s.m), null), won = r.won.includes(i); return `<div class="sf${won ? " won" : ""}" data-i="${i}"><div class="e">${M ? M.e : "⚽"}</div><div><b>${i + 1}. ${esc(M ? M.t : s.m)}</b><span>${esc(s.opp ? s.opp.name : "I Sogni del Cristallo")} · ${esc(bonusTxt(s.m, r.team))}</span></div><div class="n">${won ? "✓" : "▶"}</div></div>`; }).join("");
    if (r.won.length >= 8) h += `<div class="big"><button type="button" data-hero="1">${r.hero ? "✓ Il Campione dei Sogni è tuo" : "🌟 Ritira la carta del Campione dei Sogni"}<small>La carta leggendaria del tuo Campione · e la Maglia dei Sogni</small></button></div>`;
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Carte e collezione</small></button></div>`;
    body.innerHTML = h;
    body.querySelectorAll("[data-i]").forEach((el) => (el.onclick = () => { if (load().team.length >= 5) play(+el.dataset.i); }));
    body.querySelector("[data-back]").onclick = () => open();
    const hb = body.querySelector("[data-hero]"); if (hb) hb.onclick = heroCard;
  }
  const count = (team, saga) => team.filter((id) => BY[id] && BY[id].saga === saga).length;
  function bonusTxt(m, team) {
    const I = intesa(team).n;
    return { vignette: `azioni +${Math.floor(I / 5)}`, bottoni: `tiri +${I >= 6 ? 1 : 0}${count(team, "mantello") ? ", superpoteri a turno" : ""}`, luci: `lanterne +${I >= 8 ? 1 : 0}`, nastro: `riavvolgimenti +${I >= 8 ? 1 : 0}`, concilio: `credibilità ${Math.min(9, 5 + Math.floor(I / 3))}, corvi ${1 + count(team, "trono")}`, lavagna: "le tue carte in lavagna", duello: `grinta ${100 + I * 4}`, gadget: `cintura ${I >= 10 ? 5 : 4} gadget`, iso: `terreno ${["saline", "vetro", "ruggine"][I % 3]}`, atb: `statistiche +${Math.floor(I / 3)}` }[m] || "";
  }
  function extraFor(m, base, team, I, f, h) {
    const names = team.map((id) => ({ name: String(name(id)).split(/[ ,]/)[0], skin: (window.__borgoApi.CAST[id] || {}).skin, hair: (window.__borgoApi.CAST[id] || {}).hair }));
    return {
      vignette: { actions: (base.actions || 8) + Math.floor(I / 5) },
      bottoni: { shots: (base.shots || 6) + (I >= 6 ? 1 : 0), powers: count(team, "mantello") ? ["fulmine", "gigante", "calamita", "gelo", "doppio"] : undefined, mates: names.slice(0, 3) },
      luci: { lanterns: (base.lanterns || 3) + (I >= 8 ? 1 : 0), mates: names.slice(0, 2) },
      nastro: { rewinds: (base.rewinds || 2) + (I >= 8 ? 1 : 0), mates: names.slice(0, 2) },
      concilio: { cred: Math.min(9, 5 + Math.floor(I / 3)), ravens: 1 + count(team, "trono"), us: "La Squadra dei Sogni" },
      lavagna: { us: "La Squadra dei Sogni", squad: team.map((id) => ({ name: name(id), role: BY[id].role, ovr: Math.round(ovr(BY[id]) + I / 3) })).concat([{ name: h.name || "Il Campione", role: "A", ovr: f + 2 }, { name: "Il Portiere dei Sogni", role: "P", ovr: f }]) },
      duello: { guts: 100 + I * 4, mates: names.slice(0, 3), us: "La Squadra dei Sogni" },
      iso: { mates: names.slice(0, 2), us: "La Squadra dei Sogni", terrain: ["saline", "vetro", "ruggine"][I % 3] },
      gadget: { slots: I >= 10 ? 5 : 4, mates: names.slice(0, 2), us: "La Squadra dei Sogni" },
      atb: { heroSt: { tiro: 16 + Math.floor(I / 3), pass: 14 + Math.floor(I / 3), dif: 12 + Math.floor(I / 3), vel: 15 + Math.floor(I / 3) } },
    }[m] || {};
  }
  // gioca una partita dei Sogni nel motore m; opp = avversario (se manca, quello della sfida del Torneo); onRes(res) alla fine
  function launch(m, opp, title, team, hard, onRes, back) {
    const M = safe(() => window.__salone.machine(m), null), eng = M && window[M.eng]; if (!M || !eng || !eng.start) return false;
    const I = intesa(team).n, f = forza(team), h = safe(() => window.__salone.heroLook(), { name: "Campione" });
    const o0 = opp || M.boss || M.opp[0], base = M.opts(o0, h, hard);
    closeAll(); const C = window.__sagaCore; if (C && C.setCur) C.setCur(hard ? "sfida" : "normale", o0 && o0.style);
    const o = Object.assign({}, base, extraFor(m, base, team, I, f, h), { title, heroLook: h, winTitle: "VITTORIA DEI SOGNI!", onDone: onRes });
    if (safe(() => eng.start(o), false) === false) { if (C && C.endMatch) C.endMatch(); back(); }
    return true;
  }
  // un avversario inventato vestito per il motore m (tiene i campi propri del motore dalla sfida del Torneo)
  function dress(m, T) {
    const sf = SFIDE.find((x) => x.m === m), M = safe(() => window.__salone.machine(m), null), b = (sf && sf.opp) || (M && (M.boss || M.opp[0])) || {};
    const o = Object.assign({}, b, { name: T.name, color: T.color, style: T.style });
    if (m === "bottoni") o.players = T.pl.map((n) => ({ name: n }));
    if (m === "duello") { o.players = [{ name: T.pl[0], pow: Math.round(T.f / 5) }, { name: T.pl[1], pow: Math.round(T.f / 6) }]; o.keeper = { name: T.pl[3], pow: Math.round(T.f / 4.5) }; o.ace = { name: T.pl[0], special: "Colpo dei Sogni" }; }
    if (m === "lavagna") o.ovr = T.f;
    if (m === "concilio") o.honor = Math.min(0.7, (T.f - 50) / 40);
    if (Array.isArray(b.players) && m !== "bottoni" && m !== "duello") o.players = b.players.map((p, k) => Object.assign({}, p, { id: undefined, name: T.pl[k % 4] }));
    return o;
  }
  const engName = (m) => safe(() => window.__salone.machine(m).t, m);
  const engIcon = (m) => safe(() => window.__salone.machine(m).e, "⚽");
  function play(i) {
    const s = SFIDE[i], r = load();
    launch(s.m, s.opp, `Torneo dei Sogni ${i + 1}/8 · ${engName(s.m)}`, r.team, i >= 6, (res) => {
      const ups = gainXp(r.team, res.win), r2 = load(); let msg = res.win ? "Sfida vinta!" : "Sfida persa: si può rigiocare.";
      if (res.win && !r2.won.includes(i)) { r2.won.push(i); safe(() => window.addCoins(40), 0); const pool = CARDS.filter((c) => !r2.own.includes(c.id)); if (pool.length) { const got = pool[Math.floor(Math.random() * pool.length)]; r2.own.push(got.id); save(r2); return levelUps(ups, () => reveal(got.id, "Premio della sfida · +40 monete", torneo)); } }
      save(r2); levelUps(ups, () => { torneo(); const sm = OV && OV.querySelector(".sum"); if (sm) sm.insertAdjacentHTML("afterbegin", `<b>${msg}</b> `); });
    }, torneo);
  }
  // ---------------------------------------------------------------- partite simulate (le altre della giornata, o «Simula»)
  function poisson(l) { let k = 0, p = Math.exp(-l), s = p; const u = Math.random(); while (u > s && k < 8) { k++; p *= l / k; s += p; } return k; }
  const simGoals = (fa, fb) => [poisson(Math.max(0.3, Math.min(3.2, 1.35 + (fa - fb) / 14))), poisson(Math.max(0.3, Math.min(3.2, 1.35 + (fb - fa) / 14)))];
  // ---------------------------------------------------------------- la Stagione dei Sogni: 8 squadre, 7 giornate, un motore diverso a giornata
  function newSeason() {
    const ids = [-1, 0, 1, 2, 3, 4, 5, 6], sched = [];
    for (let d = 0; d < 7; d++) { const rot = [ids[0]].concat(ids.slice(1).map((_, k) => ids[1 + ((k + d) % 7)])), day = []; for (let k = 0; k < 4; k++) day.push([rot[k], rot[7 - k]]); sched.push(day); }
    const eng = ENG.slice().sort(() => Math.random() - 0.5).slice(0, 7), tab = {}; ids.forEach((t) => (tab[t] = [0, 0, 0, 0, 0, 0])); // G V N P GF GS
    return { day: 0, sched, eng, tab, last: null };
  }
  const tName = (t) => (t < 0 ? "La Squadra dei Sogni" : TEAMS[t].name);
  function record(se, a, b, ga, gb) {
    [[a, ga, gb], [b, gb, ga]].forEach(([t, x, y]) => { const R = se.tab[t]; R[0]++; R[x > y ? 1 : x === y ? 2 : 3]++; R[4] += x; R[5] += y; });
  }
  const pts = (R) => R[1] * 3 + R[2];
  const ranking = (se) => Object.keys(se.tab).map(Number).sort((x, y) => pts(se.tab[y]) - pts(se.tab[x]) || (se.tab[y][4] - se.tab[y][5]) - (se.tab[x][4] - se.tab[x][5]) || se.tab[y][4] - se.tab[x][4] || x - y);
  function stagione() {
    const r = load(); if (!r.season) { r.season = newSeason(); save(r); }
    const se = r.season, body = shell("📅 Stagione dei Sogni"), rk = ranking(se), f = forza(r.team);
    let h = `<p class="sum">Otto squadre, sette giornate, ogni giornata in un motore diverso. Vittoria 3 punti, pareggio 1. Chi vince lo scudetto prende una <b>carta rara garantita</b> e 80 monete. ${r.team.length < 5 ? "<b>Servono cinque carte in squadra.</b>" : `La tua forza: <b>${f}</b>.`}</p>`;
    if (se.last) h += `<p class="sum last">${se.last}</p>`;
    h += `<table class="tab"><tr><th></th><th>Squadra</th><th>G</th><th>V</th><th>N</th><th>P</th><th>Gol</th><th>Pt</th></tr>${rk.map((t, k) => { const R = se.tab[t]; return `<tr class="${t < 0 ? "me" : ""}"><td>${k + 1}</td><td>${esc(tName(t))}</td><td>${R[0]}</td><td>${R[1]}</td><td>${R[2]}</td><td>${R[3]}</td><td>${R[4]}:${R[5]}</td><td><b>${pts(R)}</b></td></tr>`; }).join("")}</table>`;
    if (se.day < 7) {
      const mine = se.sched[se.day].find((p) => p.includes(-1)), opp = mine[0] < 0 ? mine[1] : mine[0], T = TEAMS[opp], m = se.eng[se.day];
      h += `<div class="sec">Giornata ${se.day + 1}/7</div><div class="sf next"><div class="e">${engIcon(m)}</div><div><b>contro ${esc(T.name)}</b><span>${esc(engName(m))} · forza ${T.f} · ${esc(bonusTxt(m, r.team))}</span></div><div class="n">▶</div></div>`;
      h += `<div class="big"><button type="button" data-play="1" ${r.team.length < 5 ? "disabled" : ""}>⚽ Gioca<small>Esperienza piena alle carte</small></button><button type="button" data-sim="1" ${r.team.length < 5 ? "disabled" : ""}>⏩ Simula<small>Risultato dalla forza · meno esperienza</small></button></div>`;
    } else {
      const first = rk[0] === -1;
      h += `<div class="sec">Stagione finita · ${first ? "🏆 Scudetto dei Sogni!" : `${rk.indexOf(-1) + 1}° posto`}</div>`;
      h += `<div class="big"><button type="button" data-new="1">📅 Nuova stagione<small>Calendario e motori nuovi</small></button><span></span></div>`;
    }
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Carte e collezione</small></button><span></span></div>`;
    body.innerHTML = h;
    body.querySelector("[data-back]").onclick = () => open();
    const bp = body.querySelector("[data-play]"); if (bp) bp.onclick = () => seasonMatch(false);
    const bs = body.querySelector("[data-sim]"); if (bs) bs.onclick = () => seasonMatch(true);
    const bn = body.querySelector("[data-new]"); if (bn) bn.onclick = () => { const r2 = load(); r2.season = newSeason(); save(r2); stagione(); };
  }
  function seasonMatch(sim) {
    const r = load(), se = r.season; if (!se || se.day >= 7 || r.team.length < 5) return;
    const mine = se.sched[se.day].find((p) => p.includes(-1)), opp = mine[0] < 0 ? mine[1] : mine[0], T = TEAMS[opp], m = se.eng[se.day], team = r.team.slice();
    const close = (ga, gb, isSim) => {
      const r2 = load(), s2 = r2.season; if (!s2 || s2.day !== se.day) return stagione();
      record(s2, -1, opp, ga, gb);
      const others = s2.sched[s2.day].filter((p) => !p.includes(-1)).map(([a, b]) => { const g = simGoals(TEAMS[a].f, TEAMS[b].f); record(s2, a, b, g[0], g[1]); return `${TEAMS[a].name} ${g[0]}-${g[1]} ${TEAMS[b].name}`; });
      s2.last = `<b>Giornata ${s2.day + 1}: Sogni ${ga}-${gb} ${esc(T.name)}</b>${isSim ? " (simulata)" : ""}. ${others.map(esc).join(" · ")}.`;
      s2.day++; let prize = null;
      if (s2.day >= 7 && ranking(s2)[0] === -1) { r2.titles++; safe(() => window.addCoins(80), 0); const pool = CARDS.filter((c) => !r2.own.includes(c.id)), rare = pool.filter((c) => c.rar !== "c"); const pick = (rare.length ? rare : pool); if (pick.length) { prize = pick[Math.floor(Math.random() * pick.length)].id; r2.own.push(prize); } else safe(() => window.addCoins(100), 0); s2.last += " <b>Scudetto dei Sogni! +80 monete.</b>"; }
      r2.season = s2; save(r2);
      const ups = gainXp(team, ga > gb, isSim);
      levelUps(ups, () => (prize ? reveal(prize, "Premio dello scudetto", stagione) : stagione()));
    };
    if (sim) { const g = simGoals(forza(team) + intesa(team).n / 3, T.f); return close(g[0], g[1], true); }
    launch(m, dress(m, T), `Stagione dei Sogni · giornata ${se.day + 1}/7 · ${engName(m)}`, team, T.f >= 72, (res) => { if (res.quit) return stagione(); close(res.a | 0, res.b | 0, false); }, stagione);
  }
  // ---------------------------------------------------------------- il Draft: 1 carta su 3, cinque volte, poi la coppa a eliminazione
  const ROUNDS = ["Quarti di finale", "Semifinale", "Finale"];
  function offer(picks) {
    const pool = CARDS.filter((c) => !picks.includes(c.id)), w = pool.flatMap((c) => Array(5 - RAR[c.rar][2]).fill(c.id)), out = [];
    let n = 0; while (out.length < 3 && n++ < 200) { const id = w[Math.floor(Math.random() * w.length)]; if (!out.includes(id)) out.push(id); }
    return out;
  }
  function draft() {
    const r = load(); if (!r.draft) { r.draft = { picks: [], offer: offer([]), round: 0, opp: [], eng: [], over: null }; save(r); }
    const d = r.draft, body = shell("🎲 Draft dei Sogni"), I = intesa(d.picks);
    let h = `<p class="sum">Scegli una carta su tre, cinque volte: vale qualsiasi carta, anche quelle che non hai. Poi la coppa a eliminazione: ${ROUNDS.join(", ")}, ognuna in un motore a sorpresa. Ogni turno vinto +25 monete; chi vince la coppa <b>tiene una carta del draft</b>.</p>`;
    h += `<div class="sec">La squadra del draft · forza <b>${d.picks.length ? forza(d.picks) : "–"}</b> · intesa <b>${I.n}</b>/15</div><div class="team">${[0, 1, 2, 3, 4].map((k) => (d.picks[k] ? cardHtml(d.picks[k]) : `<div class="sgCard empty"><span>${k + 1}</span></div>`)).join("")}</div>`;
    if (d.picks.length < 5) {
      h += `<div class="sec">Scelta ${d.picks.length + 1}/5 · tocca una carta</div><div class="pick">${d.offer.map((id) => cardHtml(id)).join("")}</div>`;
    } else if (d.over) {
      h += `<div class="sec">${d.over === "win" ? "🏆 Coppa dei Sogni vinta!" : `Eliminati: ${ROUNDS[d.round]}`}</div>`;
      const keep = d.picks.filter((id) => !r.own.includes(id));
      if (d.over === "win" && !d.kept && keep.length) h += `<p class="sum">Scegli la carta da tenere:</p><div class="pick keep">${keep.map((id) => cardHtml(id)).join("")}</div>`;
      h += `<div class="big"><button type="button" data-new="1">🎲 Nuovo draft<small>Altre carte, altra coppa</small></button><span></span></div>`;
    } else {
      if (!d.opp.length) { const pool = TEAMS.map((_, k) => k).sort(() => Math.random() - 0.5); d.opp = [pool.slice(0, 3).sort((a, b) => TEAMS[a].f - TEAMS[b].f)].flat(); d.eng = ENG.slice().sort(() => Math.random() - 0.5).slice(0, 3); save(r); }
      const T = TEAMS[d.opp[d.round]], m = d.eng[d.round];
      h += `<div class="sec">${ROUNDS[d.round]}</div><div class="sf next"><div class="e">${engIcon(m)}</div><div><b>contro ${esc(T.name)}</b><span>${esc(engName(m))} · forza ${T.f} · ${esc(bonusTxt(m, d.picks))}</span></div><div class="n">▶</div></div>`;
      h += `<div class="big"><button type="button" data-play="1">⚽ Gioca<small>${d.round ? `${d.round} turni vinti` : "Si comincia"}</small></button><button type="button" data-quit="1">✕ Abbandona<small>Le monete vinte restano</small></button></div>`;
    }
    h += `<div class="big"><button type="button" data-back="1">◂ La squadra<small>Il draft resta salvato</small></button><span></span></div>`;
    body.innerHTML = h;
    body.querySelector("[data-back]").onclick = () => open();
    body.querySelectorAll(".pick:not(.keep) .sgCard").forEach((el) => (el.onclick = () => { const r2 = load(), d2 = r2.draft; if (!d2 || d2.picks.length >= 5 || !d2.offer.includes(el.dataset.c)) return; d2.picks.push(el.dataset.c); d2.offer = d2.picks.length < 5 ? offer(d2.picks) : []; save(r2); draft(); }));
    body.querySelectorAll(".pick.keep .sgCard").forEach((el) => (el.onclick = () => { const r2 = load(), d2 = r2.draft; if (!d2 || d2.kept || d2.over !== "win") return; d2.kept = el.dataset.c; if (!r2.own.includes(el.dataset.c)) r2.own.push(el.dataset.c); save(r2); reveal(el.dataset.c, "Dal Draft dei Sogni", draft); }));
    const bp = body.querySelector("[data-play]"); if (bp) bp.onclick = draftMatch;
    const bq = body.querySelector("[data-quit]"); if (bq) bq.onclick = () => { const r2 = load(); r2.draft = null; save(r2); open(); };
    const bn = body.querySelector("[data-new]"); if (bn) bn.onclick = () => { const r2 = load(); r2.draft = null; save(r2); draft(); };
  }
  function draftMatch() {
    const r = load(), d = r.draft; if (!d || d.picks.length < 5 || d.over) return;
    const T = TEAMS[d.opp[d.round]], m = d.eng[d.round], team = d.picks.slice(), rd = d.round;
    launch(m, dress(m, T), `Draft dei Sogni · ${ROUNDS[rd]} · ${engName(m)}`, team, rd === 2, (res) => {
      if (res.quit) return draft();
      const r2 = load(), d2 = r2.draft; if (!d2 || d2.round !== rd) return draft();
      if (res.win) { safe(() => window.addCoins(25), 0); d2.round++; if (d2.round >= 3) { d2.over = "win"; d2.round = 2; r2.cups++; } } else d2.over = "lose";
      if (!d2.picks.some((id) => !r2.own.includes(id)) && d2.over === "win") { d2.kept = "-"; safe(() => window.addCoins(80), 0); }
      save(r2); levelUps(gainXp(team, res.win), draft);
    }, draft);
  }
  function heroCard() {
    const r = load(); if (r.hero || r.won.length < 8) return; r.hero = true; save(r);
    safe(() => { const A = window.__borgoApi; A.bCos && A.bCos("sg_maglia"); }, 0);
    const body = shell("🌟 Il Campione dei Sogni"), img = port("hero");
    body.innerHTML = `<div class="reveal"><div class="sgCard rl hero" style="--rc:#ffd23f;--sc:#7a5ad8"><div class="hd"><span>Leggendaria</span><b>★</b></div><div class="img">${img ? `<img alt="" src="${img}">` : ""}</div><div class="nm">Il Campione dei Sogni</div><div class="st"><span>ATT <b>99</b></span><span>DIF <b>99</b></span><span>TEC <b>99</b></span></div><div class="sg">Tutte le saghe</div></div></div><p class="sum" style="text-align:center">Otto sfide, otto motori, una squadra di sogni. Questa carta è la tua. E nel Guardaroba c'è la <b>Maglia dei Sogni</b>.</p><div class="big"><button type="button" data-ok="1">◂ Torna al torneo<small></small></button></div>`;
    body.querySelector("[data-ok]").onclick = torneo;
  }
  function css() {
    if (document.getElementById("sgCss")) return; const st = document.createElement("style"); st.id = "sgCss";
    st.textContent = `.sgOv{position:fixed;inset:0;z-index:310;background:#120e1e;color:#f4f0e4;font-family:system-ui,sans-serif;overflow:auto}
.sgOv .wrap{max-width:560px;margin:0 auto;padding:10px 10px 30px}.sgOv .bar{display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#120e1e;padding:6px 0;z-index:2}.sgOv h2{margin:0;font:900 20px system-ui;color:#ffd23f}.sgOv .x{width:40px;height:40px;border-radius:8px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font-size:16px}
.sgOv .sum{font-size:13px;line-height:1.45;opacity:.9}.sgOv .sum .new{color:#7ad87a}.sgOv .sec{margin:12px 0 6px;font-weight:800;font-size:13px;color:#c8b8ff}.sgOv .why{font-weight:400;opacity:.8}
.sgOv .team{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.sgOv .coll{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px}
.sgCard{position:relative;border-radius:10px;padding:5px;background:linear-gradient(160deg,var(--sc),#120e1e 75%);border:2px solid var(--rc);box-shadow:0 2px 0 rgba(0,0,0,.5);cursor:pointer;overflow:hidden;font-size:10px;min-height:92px}
.sgCard.empty{display:flex;align-items:center;justify-content:center;border-style:dashed;border-color:#4a3a6a;background:#1a1428;font-size:22px;color:#4a3a6a}
.sgCard .hd{display:flex;justify-content:space-between;font-weight:800;font-size:8.5px;color:var(--rc);text-transform:uppercase}.sgCard .img{aspect-ratio:1;border-radius:6px;background:#0a0814;overflow:hidden;margin:3px 0;display:flex;align-items:center;justify-content:center}.sgCard .img img{width:100%;height:100%;object-fit:cover}.sgCard .img span{font:900 26px system-ui;color:#4a3a6a}
.sgCard .nm{font-weight:800;font-size:10px;line-height:1.15;min-height:2.3em}.sgCard .st{display:flex;justify-content:space-between;font-size:8px;opacity:.9}.sgCard .st b{color:#ffd23f}.sgCard .sg{font-size:7.5px;opacity:.65;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sgCard.lock{filter:grayscale(1) brightness(.5);cursor:default}.sgCard.sel{outline:3px solid #7ad87a;outline-offset:1px}
.sgCard.re::after,.sgCard.rl::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.35) 45%,rgba(255,180,255,.25) 50%,transparent 62%);background-size:250% 100%;animation:sgHolo 3.2s linear infinite;pointer-events:none;mix-blend-mode:screen}
.sgCard.rl{box-shadow:0 0 12px rgba(255,210,63,.5)}@keyframes sgHolo{from{background-position:120% 0}to{background-position:-130% 0}}
@media (prefers-reduced-motion:reduce){.sgCard::after{animation:none!important}}
.sgOv .big{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}.sgOv .big button{min-height:56px;border-radius:10px;border:1px solid #4a3a6a;background:#221a36;color:#f4f0e4;font:800 14px system-ui;text-align:left;padding:8px 10px}.sgOv .big button small{display:block;font-weight:400;font-size:11px;opacity:.8;margin-top:3px}.sgOv .big button:disabled{opacity:.4}
.sgOv .links{display:grid;gap:4px;font-size:11.5px}.sgOv .links span{background:#1a1428;border-radius:6px;padding:5px 8px;opacity:.6}.sgOv .links span.ok{opacity:1;border-left:3px solid #7ad87a}.sgOv .links b{color:#c8b8ff}
.sgOv .sf{display:grid;grid-template-columns:40px 1fr 30px;gap:8px;align-items:center;background:#1a1428;border:1px solid #4a3a6a;border-radius:10px;padding:8px;margin:6px 0;cursor:pointer}.sgOv .sf .e{font-size:24px;text-align:center}.sgOv .sf b{display:block;font-size:13.5px}.sgOv .sf span{font-size:11.5px;opacity:.8}.sgOv .sf .n{font:900 18px system-ui;color:#ffd23f;text-align:center}.sgOv .sf.won{border-color:#7ad87a}.sgOv .sf.won .n{color:#7ad87a}
.sgCard .stars{position:absolute;top:22px;right:9px;color:#ffd23f;font-size:11px;text-shadow:0 1px 0 #000;z-index:1}.sgCard.s3{border-color:#ffd23f;box-shadow:0 0 0 2px #7a5a10,0 0 14px rgba(255,210,63,.6)}
.sgOv .frase{text-align:center;font:italic 700 15px Georgia,serif;color:#ffe9a8;margin:4px 16px 10px}.sgOv .last{background:#1a1428;border-radius:8px;padding:8px;border-left:3px solid #c8b8ff}
.sgOv .tab{width:100%;border-collapse:collapse;font-size:12px;margin:6px 0}.sgOv .tab th{font-size:10.5px;opacity:.7;text-align:left;padding:3px}.sgOv .tab td{padding:5px 3px;border-top:1px solid #2a2040}.sgOv .tab td:nth-child(n+3),.sgOv .tab th:nth-child(n+3){text-align:center}.sgOv .tab tr.me td{background:#2a2048;color:#ffd23f}
.sgOv .pick{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.sgOv .sf.next{cursor:default;border-color:#c8b8ff}.sgOv .big span:empty{display:none}
.sgOv .reveal{display:flex;justify-content:center;margin:20px 0}.sgOv .reveal .sgCard{width:180px;font-size:13px;animation:sgFlip .7s ease-out}.sgOv .reveal .sgCard .nm{font-size:15px}.sgOv .reveal .sgCard .st{font-size:11px}.sgOv .reveal .sgCard .hd{font-size:11px}
@keyframes sgFlip{from{transform:perspective(600px) rotateY(180deg) scale(.6)}to{transform:none}}`;
    document.head.appendChild(st);
  }
  // la Maglia dei Sogni nel guardaroba (si registra all'avvio, così resta anche dopo aver ricaricato la pagina)
  (function reg() { const A = window.__borgoApi; if (!A || !A.COSM) return setTimeout(reg, 200); if (!A.COSM.sg_maglia) A.COSM.sg_maglia = { kind: "shirt", label: "Maglia dei Sogni", val: "#7a5ad8", from: "Vinci il Torneo dei Sogni (Salone delle Saghe)" }; })();
  window.__sogni = { open, close: closeAll, CARDS, LINKS, SFIDE, TEAMS, FRASI, intesa, forza, sync, stagione, draft, stars: (id) => { XPC = load().xp; return starsOf(id); }, _load: load };
})();
