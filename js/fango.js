// js/fango.js - «DAL FANGO ALLA LEGGENDA»: la carriera di un calciatore, dalla Terza Categoria di Sterpaglia al mito. Prima carriera «Diventa un mito».
// Cinque tappe (stagioni da 5 giornate, 6 squadre, calendario e classifica dal motore comune js/carriera-core.js), una vita in mezzo:
//   1 Il Fango (17 anni, A.S.D. Pozzanghera) · 2 La Provincia (20, Virtus Valdolio) · 3 La Cadetteria (24, Calcio Portoferro) · 4 La Serie A (28, Aurelia) · 5 La Leggenda (34: Aurelia o Pozzanghera)
// Ogni giornata: un'azione della settimana (allenamento, serata al bar, riposo), poi la partita in tre modi: «Il Momento» (minigioco js/fango-momento.js),
// la partita intera col tuo Campione (motori del gioco) o simulata. Scelte con Onore e Ombra, tre finali (uno segreto).
// Novità nel core: carriera-core «percorso» (valutazione, curva dell'età, pagella, risultato con i gol del giocatore).
// Integrazione: carte Sogni (saga «fango», mf_*), mazzo Carte del Destino «mf», ospite al Borgo (Tonino Bava), cabinato «Il Momento» in Sala Giochi, Salone.
// Opzione in Impostazioni (accesa di base): window.__fango.on() / setOn(v). Salvataggio proprio: ali-di-rondine.fango (+ .opt).
(function () {
  "use strict";
  if (window.__fango) return;
  const KEY = "ali-di-rondine.fango", OPT = KEY + ".opt", HERO = "ali-di-rondine.campione", TITLE = "Dal Fango alla Leggenda";
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), pick = (a) => a[Math.floor(Math.random() * a.length)];
  const readJ = (k, d) => safe(() => { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }, d);
  const writeJ = (k, v) => safe(() => localStorage.setItem(k, JSON.stringify(v)), 0);
  const api = () => window.__borgoApi || null, core = () => window.__carrieraCore, P = () => window.__carrieraCore && window.__carrieraCore.percorso;
  const coins = (n) => safe(() => { if (n > 0 && typeof window.addCoins === "function") window.addCoins(n); return n; }, 0);

  // ---------------------------------------------------------------- personaggi
  const PEOPLE = {
    mf_ruggine: ["Aldo Ruggine", "Allenatore della Pozzanghera", { style: "bald", hair: "#9ca3af", shirt: "#57534e", skin: "#d9a878", eye: "#3a2a1a", beard: "baffi", acc: ["coppola"], bg: ["#44403c", "#a8a29e"] }, "Sessantatré anni, un toscano sempre spento in bocca. Nel '78 era la promessa del Portoferro: un derby nel fango gli prese il ginocchio, e nessuno lo chiamò più. Da allora allena la Pozzanghera e aspetta. Dice che il fango insegna una cosa sola: chi cade e si rialza prima, vince."],
    mf_bava: ["Tonino Bava", "Portiere e postino", { style: "buzz", hair: "#6b5b4b", shirt: "#facc15", skin: "#e0ac7e", eye: "#2a1a0a", acc: ["guanti"], bg: ["#854d0e", "#fde68a"] }, "Portiere della Pozzanghera da quando aveva i capelli. Di giorno fa il postino, quindi in porta si muove il minimo indispensabile. Para di faccia, di pancia e, nelle giornate buone, con le mani. Scrive lettere a tutti: tanto le consegna lui."],
    mf_sghembi: ["Ivo Sghembi", "Presidente e macellaio", { style: "slick", hair: "#1f2937", shirt: "#f8fafc", skin: "#e9be95", eye: "#2a1a0a", acc: ["grembiule"], bg: ["#7f1d1d", "#fecaca"] }, "Presidente, sponsor unico e macellaio di Sterpaglia. Paga la squadra in salsicce: una a gol, due nel derby. Ha un cuore grande e un bilancio piccolissimo, e li confonde spesso."],
    mf_pupa: ["Zia Pupa", "Il furgone della porchetta", { style: "bun", hair: "#d6d3d1", shirt: "#be123c", skin: "#f0c8a0", eye: "#2a1a0a", acc: ["grembiule"], bg: ["#9f1239", "#fecdd3"] }, "Vedova, settantun anni, il furgone della porchetta parcheggiato dietro la porta bassa da quarant'anni. Conosce ogni giocatore passato dal Gino Melma, e ogni giocatore passato dal Gino Melma le deve almeno un panino."],
    mf_brando: ["Brando Lucidi", "Il talento con la macchina rossa", { style: "slick", hair: "#e8d08a", shirt: "#dc2626", skin: "#f2c9a0", eye: "#2563eb", acc: ["occhiali"], bg: ["#991b1b", "#fef3c7"] }, "Figlio di un industriale delle piastrelle, piedi da fuoriclasse e una macchina rossa a diciassette anni. A Tre Ponti lo chiamano «il Principe». Lui dice che a vent'anni sarà in Serie A. Ha ragione. Non dice cosa succede dopo."],
    mf_ugo: ["Ugo Sanguisuga", "Procuratore", { style: "slick", hair: "#4b5563", shirt: "#334155", skin: "#e6b98f", eye: "#2a1a0a", beard: "pizzetto", acc: ["occhiali"], bg: ["#1e293b", "#94a3b8"] }, "Procuratore, telefono sempre all'orecchio e un cognome che si porta con orgoglio. «Il dieci per cento è un modo di dire. Io lo dico in un altro modo.» Nessuno sa davvero da che parte stia. Forse neanche lui."],
    mf_greta: ["Greta Fumagalli", "Giornalista sportiva", { style: "bob", hair: "#7c2d12", shirt: "#0f766e", skin: "#f2c9a0", eye: "#16a34a", acc: ["taccuino"], bg: ["#115e59", "#ccfbf1"] }, "Cronista della «Gazzetta delle Colline», poi delle pagine nazionali. Scrive in fretta, sbaglia poco, perdona ancora meno. Ha capito prima di tutti che la tua storia non era quella dei gol."],
    mf_pennacchio: ["Il Geometra Pennacchio", "Uomo di numeri", { style: "slick", hair: "#cfc6b4", shirt: "#d6c7a1", skin: "#efcfb0", eye: "#475569", acc: ["occhiali"], bg: ["#57534e", "#e7e5e4"] }, "Si presenta come «il Geometra». Misura tutto: i campi, le persone, il prezzo di una partita. Non alza mai la voce, e non ha mai bisogno di farlo."],
    mf_marisa: ["Dott.ssa Marisa Lenti", "Fisioterapista del Portoferro", { style: "ponytail", hair: "#111111", shirt: "#e2e8f0", skin: "#c68642", eye: "#2a1a0a", bg: ["#334155", "#e2e8f0"] }, "Fisioterapista del Portoferro da quindici stagioni. Ha rimesso in piedi mezzo campionato e non ha mai detto «andrà tutto bene» a nessuno. Dice «vediamo». E poi, di solito, va bene."],
  };
  function hero() {
    const h = readJ(HERO, null);
    if (h && h.name) return { name: String(h.name).slice(0, 18), num: h.num || 9, skin: h.skin || "#f2c9a0", hair: h.hair || "#2b1d14", style: h.style || "spiky", eye: h.eye || "#2a1a0a", shirt: h.shirt || "#7f1d1d", acc: h.acc, mine: true };
    return { name: "Nino Sterpi", num: 9, skin: "#e9bf96", hair: "#2b1d14", style: "messy", eye: "#3a2a1a", shirt: "#7f1d1d", mine: false };
  }
  function castAll() {
    const A = api(); if (!A || !A.CAST) return false;
    Object.keys(PEOPLE).forEach((id) => { const [name, sub, o, bio] = PEOPLE[id]; if (!A.CAST[id]) A.CAST[id] = Object.assign({ name, sub, tag: "" }, o); if (bio && A.BIO && !A.BIO[id]) A.BIO[id] = bio; });
    const h = hero(), s = S || {}, club = s.tappa ? CLUB() : null;
    A.CAST.mf_me = { name: h.name, sub: club ? club.name + " · n. " + h.num : "Il numero " + h.num, tag: "", style: h.style, hair: h.hair, skin: h.skin, eye: h.eye, shirt: club ? club.col : h.shirt, num: String(h.num), bg: ["#3f2a14", "#f59e0b"] };
    if (A.BIO && !A.BIO.mf_me) A.BIO.mf_me = "Partito dal campo in pendenza di Sterpaglia con un paio di scarpini e un toscano spento come esempio. Dicono che sia diventato una leggenda. Lui dice che è caduto e si è rialzato, tante volte, e basta.";
    return true;
  }

  // ---------------------------------------------------------------- le tappe
  const TM = (id, name, short, col, lvl, names, ico) => ({ id, name, short, col, lvl, names, ico: ico || "⚽" });
  const TAPPE = {
    1: { t: "Il Fango", lega: "Terza Categoria · Girone di Sterpaglia", age: 17, lv: 1.2, bg: "fd_campo", need: { pos: 2, ovr: 52 }, mom: 3, prize: 30,
      club: TM("us", "A.S.D. Pozzanghera", "Pozzanghera", "#7f1d1d", 1.0, ["Bava", "Il Gemello", "Tarcisio", "Mirco", "Lele"], "🥾"),
      teams: [TM("pantano", "Atletico Pantano", "Pantano", "#65a30d", 0.92, ["Gerri", "Ciccio", "Il Bue", "Tano", "Pippo"]), TM("treponti", "Olimpia Tre Ponti", "Tre Ponti", "#dc2626", 1.12, ["Lucidi", "Ferro", "Sacco", "Bindi", "Moro"]), TM("gelsomino", "Sporting Gelsomino", "Gelsomino", "#a855f7", 0.96, ["Fiore", "Rosa", "Petali", "Viola", "Ortensi"]), TM("casale", "Dinamo Casale", "Casale", "#1d4ed8", 1.02, ["Gatti", "Rossi", "Bertoni", "Lupo", "Neri"]), TM("spino", "Juventina Borgo Spino", "Borgo Spino", "#111827", 0.98, ["Spina", "Rovo", "Cardo", "Ortica", "Riccio"])] },
    2: { t: "La Provincia", lega: "Serie D · Girone delle Colline", age: 20, lv: 2.0, bg: "fd_valdolio", need: { pos: 2, ovr: 62 }, mom: 3, prize: 40,
      club: TM("us", "Virtus Valdolio", "Valdolio", "#16a34a", 1.0, ["Corradi jr", "Olivieri", "Frantoio", "Fedeli", "Uliva"], "🫒"),
      teams: [TM("colle", "Pro Colle Alto", "Colle Alto", "#0ea5e9", 1.04, ["Vetta", "Cima", "Poggio", "Rupe", "Balza"]), TM("rondella", "Rondella Calcio", "Rondella", "#f97316", 0.95, ["Ruota", "Dado", "Bullo", "Vite", "Perno"]), TM("vigneto", "Fortitudo Vigneto", "Vigneto", "#7e22ce", 1.08, ["Bacco", "Grappa", "Mosto", "Tralcio", "Vino"]), TM("pietrafina", "Aurora Pietrafina", "Pietrafina", "#eab308", 0.98, ["Selce", "Marmo", "Ciottolo", "Scheggia", "Ghiaia"]), TM("monteolivo", "Ardita Monteolivo", "Monteolivo", "#475569", 1.1, ["Ardito", "Saldi", "Fermo", "Duro", "Forte"])] },
    3: { t: "La Cadetteria", lega: "Serie B", age: 24, lv: 3.0, bg: "fd_portoferro", need: { pos: 3, ovr: 72 }, mom: 3, prize: 50,
      club: TM("us", "Calcio Portoferro", "Portoferro", "#1f2937", 1.0, ["Colata", "Fucina", "Tornio", "Brugola", "Lamiera"], "🏭"),
      teams: [TM("lagonero", "Sporting Lagonero", "Lagonero", "#0f766e", 1.06, ["Pesce", "Anguilla", "Luccio", "Trota", "Carpa"]), TM("marmora", "Virtus Marmora", "Marmora", "#e5e7eb", 1.0, ["Statua", "Scalpello", "Lastra", "Blocco", "Busto"]), TM("granaio", "Atletico Granaio", "Granaio", "#ca8a04", 0.96, ["Spiga", "Covone", "Mulino", "Crusca", "Pagliai"]), TM("torrealta", "Cavalieri di Torre Alta", "Torre Alta", "#7c3aed", 1.12, ["Merlo", "Ponte", "Bastione", "Fossato", "Alfiere"]), TM("salinera", "Unione Salinera", "Salinera", "#38bdf8", 1.02, ["Sale", "Vasca", "Cristallo", "Marea", "Riva"])] },
    4: { t: "La Serie A", lega: "Serie A", age: 28, lv: 4.0, bg: "fd_stadio", need: { pos: 3, ovr: 80 }, mom: 4, prize: 70,
      club: TM("us", "Aurelia Calcio", "Aurelia", "#1d4ed8", 1.0, ["Lucidi", "Ventura", "Castaldi", "Menegatti", "Ibarra"], "🏛️"),
      teams: [TM("fiumara", "Inter Fiumara", "Fiumara", "#0f172a", 1.14, ["Corrente", "Argine", "Delta", "Foce", "Gora"]), TM("capoterra", "Real Capoterra", "Capoterra", "#f5f5f4", 1.08, ["Scoglio", "Faro", "Promontorio", "Capo", "Baia"]), TM("altomare", "Sporting Altomare", "Altomare", "#06b6d4", 1.0, ["Onda", "Abisso", "Corallo", "Tritone", "Spuma"]), TM("castelforte", "Leoni di Castelforte", "Castelforte", "#b45309", 1.04, ["Leone", "Criniera", "Ruggito", "Artiglio", "Zanna"]), TM("valbruna", "Dinamo Valbruna", "Valbruna", "#be123c", 0.98, ["Brina", "Larice", "Nebbia", "Abete", "Valanga"])] },
    5: { t: "La Leggenda", age: 34, prize: 100,
      a: { lega: "Coppa delle Stelle · Girone finale", lv: 5.0, bg: "fd_stadio", need: { pos: 1 }, mom: 4, club: TM("us", "Aurelia Calcio", "Aurelia", "#1d4ed8", 1.0, ["Ventura", "Castaldi", "Menegatti", "Ibarra", "Ruiz"], "🏛️"),
        teams: [TM("nordhavn", "Nordhavn FC", "Nordhavn", "#1e3a8a", 1.12, ["Haldor", "Brekke", "Lund", "Strand", "Fjell"]), TM("almaraz", "Real Almaraz", "Almaraz", "#f5f5f4", 1.14, ["Ortega", "Valdés", "Cuenca", "Arroyo", "Soto"]), TM("volgarev", "Dynamo Volgarev", "Volgarev", "#b91c1c", 1.06, ["Orlov", "Petrenko", "Zimin", "Kalin", "Dubov"]), TM("bellerive", "Olympique Bellerive", "Bellerive", "#0ea5e9", 1.02, ["Marchand", "Dubois", "Lefèvre", "Roux", "Garnier"]), TM("kessel", "Rot-Weiss Kessel", "Kessel", "#dc2626", 1.08, ["Becker", "Krüger", "Wolf", "Hahn", "Vogt"])] },
      p: { lega: "Terza Categoria · Girone di Sterpaglia", lv: 1.8, bg: "fd_campo", need: { pos: 2 }, mom: 3, club: TM("us", "A.S.D. Pozzanghera", "Pozzanghera", "#7f1d1d", 0.94, ["Bava", "Lucidi", "Il Gemello", "Mirko", "Lele"], "🥾"),
        teams: [TM("pantano", "Atletico Pantano", "Pantano", "#65a30d", 1.0, ["Gerri jr", "Ciccio jr", "Il Bue", "Tano", "Pippo"]), TM("treponti", "Olimpia Tre Ponti", "Tre Ponti", "#dc2626", 1.1, ["Ferro", "Sacco", "Bindi", "Moro", "Galli"]), TM("gelsomino", "Sporting Gelsomino", "Gelsomino", "#a855f7", 0.98, ["Fiore", "Rosa", "Petali", "Viola", "Ortensi"]), TM("casale", "Dinamo Casale", "Casale", "#1d4ed8", 1.06, ["Gatti", "Rossi", "Bertoni", "Lupo", "Neri"]), TM("spino", "Juventina Borgo Spino", "Borgo Spino", "#111827", 1.02, ["Spina", "Rovo", "Cardo", "Ortica", "Riccio"])] } },
  };
  const ENDINGS = {
    mito: ["Il Mito", "Ultima stagione con l'Aurelia, la Coppa delle Stelle alzata davanti a settantamila persone. Poi, da solo, un treno per Sterpaglia.", "Chiudi la carriera dove brillano le luci più forti, e vinci il girone."],
    ritorno: ["Il Ritorno", "L'ultima stagione nel fango della Pozzanghera, gente fin sulle colline e lo striscione cucito a mano. Da qui era partito tutto.", "Torna dove hai cominciato e salva la tua prima squadra."],
    mister: ["Il Cappotto del Mister", "Il cappotto di Aldo Ruggine, un toscano spento in tasca e una lavagna nuova nel container. La Pozzanghera ha un allenatore.", "Segreto: torna a casa a testa alta, con le scarpe del vecchio e tanti gol nelle gambe."],
  };

  // ---------------------------------------------------------------- stato
  let S = null, BACK = null;
  function fresh() {
    const h = hero();
    return { v: 1, tappa: 0, age: 17, st: { tiro: 46, drib: 44, fis: 45 }, fisico: 90, fama: 5, onore: 0, ombra: 0, gol: 0, pres: 0, voti: 0, mom: 0, trofei: [], done: {}, ends: [], f: {}, seen: {}, season: null, log: [], name: h.name, snap5: null };
  }
  function load() { const m = readJ(KEY, null); S = m && m.v === 1 ? Object.assign(fresh(), m) : null; return S; }
  function save() { if (S) writeJ(KEY, S); }
  const opt = () => Object.assign({ on: true, cut: false }, readJ(OPT, {}) || {});
  const optSet = (o) => writeJ(OPT, Object.assign(opt(), o));
  const TP = () => { const t = TAPPE[S.tappa] || TAPPE[1]; if (S.tappa === 5) return Object.assign({}, t, t[S.f.t5 === "p" ? "p" : "a"]); return t; };
  const CLUB = () => TP().club;
  const ovr = () => (P() ? P().ovr(S.st, S.fisico) : Math.round((S.st.tiro + S.st.drib + S.st.fis) / 3));
  const N = () => esc(hero().name);
  const T = (s) => String(s).replace(/\{n\}/g, N()).replace(/\{club\}/g, esc(CLUB().name)).replace(/\{short\}/g, esc(CLUB().short)).replace(/\{eta\}/g, String(S ? S.age : 17));
  const logL = (t) => { S.log.push(t); if (S.log.length > 60) S.log.shift(); };
  const W = (k, n) => { S[k] = (S[k] || 0) + n; };

  // ---------------------------------------------------------------- scene
  const BG = () => (S && S.tappa ? TP().bg : "fd_titolo");
  const CHAP = () => (S && S.tappa >= 1 && S.tappa <= 5 ? `${TITLE} · ${S.tappa}. ${TAPPE[S.tappa].t}` : TITLE);
  function scene(bg, who, html, opts) { castAll(); const A = api(); if (!A) return; A.scene(bg || BG(), who || "voce", html, opts, CHAP()); }
  function say(lines, cb, bg) {
    let i = 0; const nx = () => { if (i >= lines.length) return cb && cb(); const l = lines[i++]; scene(l[2] || bg, l[0], T(l[1]), [{ label: "▸", cls: "hot", fn: nx }]); }; nx();
  }
  function ask(who, html, opts, bg) { scene(bg, who, T(html), opts.map((o) => Object.assign({}, o, { label: T(o.label), sub: o.sub ? T(o.sub) : undefined }))); }
  function toast(t, ic) { safe(() => window.toast && window.toast(t, "info", ic || "🥾"), 0); }

  // ---------------------------------------------------------------- stagione
  function newSeason() {
    const tp = TP(), C = core(), teams = [tp.club].concat(tp.teams);
    S.season = { round: 0, did: false, table: C.initTable(teams), schedule: C.generateSchedule(teams.map((t) => t.id)), log: [], gol: 0 };
    S.age = TAPPE[S.tappa].age; const cap = P() ? P().ageCurve(S.age).cap : 100; S.fisico = Math.min(cap, 92);
    save();
  }
  const teamById = (id) => { const tp = TP(); return id === "us" ? tp.club : tp.teams.find((t) => t.id === id); };
  const myFix = () => { const r = S.season.schedule[S.season.round]; return r ? r.find((m) => m.home === "us" || m.away === "us") : null; };
  const standings = () => core().sortTable(S.season.table);
  const myPos = () => standings().findIndex((r) => r.id === "us") + 1;
  function tableHTML() {
    return `<table class="tbl"><tr><th>#</th><th class="nm">Squadra</th><th>G</th><th>V</th><th>N</th><th>P</th><th>DR</th><th>Pt</th></tr>${standings().map((r, i) => `<tr${r.id === "us" ? ' class="me"' : ""}><td>${i + 1}</td><td class="nm">${esc(teamById(r.id).short)}</td><td>${r.played}</td><td>${r.won}</td><td>${r.drawn}</td><td>${r.lost}</td><td>${r.gd > 0 ? "+" : ""}${r.gd}</td><td><b>${r.pts}</b></td></tr>`).join("")}</table>`;
  }
  const bar = (v, max, c) => `<span style="display:inline-block;vertical-align:middle;width:56px;height:7px;border-radius:4px;background:rgba(255,255,255,.15);overflow:hidden"><span style="display:block;height:100%;width:${clamp(v / max * 100, 0, 100)}%;background:${c}"></span></span>`;
  function statusHTML() {
    const tp = TP(), need = tp.need;
    return `<b>${esc(hero().name)}</b>, ${S.age} anni · <b>${esc(tp.club.name)}</b> · ${esc(tp.lega)}<br>`
      + `⭐ Valutazione <b>${ovr()}</b> · 🎯 Tiro ${S.st.tiro} · 🌀 Dribbling ${S.st.drib} · 💪 Fisico ${S.st.fis}<br>`
      + `🔋 Gambe ${bar(S.fisico, 100, S.fisico < 35 ? "#f87171" : "#4ade80")} ${S.fisico} · 📣 Fama ${bar(S.fama, 100, "#facc15")} ${S.fama}<br>`
      + `⚖️ Onore ${S.onore} · 🌑 Ombra ${S.ombra} · ⚽ Gol in carriera ${S.gol}<br>`
      + `<span style="color:var(--dim)">Obiettivo: ${need.pos === 1 ? "vincere il girone" : `chiudere tra le prime ${need.pos}`}${need.ovr ? ` (o arrivare a valutazione ${need.ovr}: qualcuno ti noterà comunque)` : ""}.</span>`;
  }

  // ---------------------------------------------------------------- menu
  function menuEntry(back) { const m = load(); return { label: "🥾 Dal Fango alla Leggenda", sub: m && m.tappa ? `Carriera di ${m.name} · tappa ${Math.min(m.tappa, 5)}/5${m.ends && m.ends.length ? ` · finali ${m.ends.length}/3` : ""}` : "Carriera da calciatore: dalla Terza Categoria al mito · 5 tappe, 3 finali", cls: "hot", fn: () => open(back) }; }
  function open(back) {
    BACK = typeof back === "function" ? back : BACK || window.title; load(); castAll();
    const o = opt(); if (!o.cut) { optSet({ cut: true }); if (window.__presa && window.__presa.cutin) return window.__presa.cutin("DAL FANGO ALLA LEGGENDA", "Carriera da calciatore · dalla Terza Categoria al mito", menu); }
    menu();
  }
  function leave() { const b = BACK; BACK = null; if (typeof b === "function") b(); else if (window.title) window.title(); }
  function menu() {
    load(); castAll();
    const h = hero(), opts = [];
    let txt = `<b>${TITLE}</b><br>Una carriera intera in cinque tappe: dal campo in pendenza di Sterpaglia, in Terza Categoria, fino alla Serie A e all'ultima stagione. Ogni giornata scegli come allenarti, poi giochi <b>i tuoi momenti</b> della partita, oppure la partita intera col tuo Campione.`;
    if (S && S.tappa) txt += `<br><br>${S.tappa > 5 ? `<b>Carriera conclusa.</b> Finali trovati: ${S.ends.length}/3.` : `In corso: <b>${S.tappa}. ${TAPPE[S.tappa].t}</b>, ${S.season ? `giornata ${Math.min(S.season.round + 1, 5)}/5` : "si comincia"}.`}`;
    else txt += `<br><br>Protagonista: <b>${esc(h.name)}</b>${h.mine ? " (il tuo Campione)" : ". Se crei il tuo Campione, la carriera sarà sua."}`;
    if (S && S.tappa && S.tappa <= 5) opts.push({ label: "▶ Continua la carriera", sub: `${esc(S.name)} · ${S.age} anni · valutazione ${ovr()}`, cls: "hot", fn: resume });
    if (S && S.tappa > 5 && S.snap5) opts.push({ label: "↺ Rigioca l'ultima stagione", sub: "Riparti da 34 anni e scegli di nuovo dove chiudere (per gli altri finali)", cls: "hot", fn: replay5 });
    opts.push({ label: S && S.tappa ? "Nuova carriera" : "▶ Comincia la carriera", sub: S && S.tappa ? "Cancella quella in corso (i finali trovati restano)" : `Con ${esc(h.name)}, diciassette anni e un paio di scarpini`, cls: S && S.tappa ? "" : "hot", fn: () => (S && S.tappa ? ask("voce", "Ricominciare da capo? La carriera in corso si cancella. I finali trovati restano nel registro.", [{ label: "Sì, si riparte dal fango", cls: "hot", fn: startNew }, { label: "◂ No", fn: menu }], "fd_titolo") : startNew()) });
    if (S && S.tappa) opts.push({ label: "📒 Il Diario della carriera", sub: "Numeri, trofei, le cose che restano", fn: () => diario(menu) });
    opts.push({ label: "🎞️ Finali", sub: `${S ? S.ends.length : 0}/3`, fn: finali });
    opts.push({ label: "📖 Come si gioca", fn: guida });
    opts.push({ label: "◂ Esci", fn: leave });
    scene("fd_titolo", "voce", txt, opts);
  }
  function guida() {
    scene("fd_titolo", "voce", `<b>Come si gioca</b><br>· Ogni tappa è una stagione di <b>5 giornate</b> contro 5 squadre. Prima di ogni partita hai <b>una</b> azione della settimana: <b>Allenamento</b> (Tiro, Dribbling o Fisico), <b>Serata al bar</b> (Fama, qualche storia, gambe un po' più pesanti) o <b>Riposo</b> (gambe fresche).<br>· La partita: <b>🥾 Il Momento</b> (giochi le azioni in cui il pallone arriva a te: azione, punizione, rigore), <b>🎮 Partita intera</b> con il tuo Campione, o <b>⏩ Simula</b> (veloce, meno Fama).<br>· 🔋 <b>Gambe</b>: ogni partita stanca, con l'età di più. Gambe basse = sei più lento nei momenti.<br>· Per passare alla tappa dopo: chiudi nelle prime posizioni, <b>oppure</b> arriva alla valutazione indicata.<br>· Le scelte danno <b>Onore</b> o <b>Ombra</b>. Contano per il finale.<br>· Il minigioco «Il Momento» ha anche il suo cabinato in Sala Giochi.`, [{ label: "◂ Indietro", fn: menu }]);
  }
  function finali() {
    const got = S ? S.ends : [];
    scene("fd_titolo", "voce", `<b>Finali</b><br>${Object.keys(ENDINGS).map((k) => got.includes(k) ? `🎞️ <b>${ENDINGS[k][0]}</b>: ${ENDINGS[k][1]}` : `🔒 <b>???</b> · <i>${ENDINGS[k][2]}</i>`).join("<br><br>")}`, [{ label: "◂ Indietro", fn: menu }]);
  }
  function diario(back) {
    const tr = S.trofei.length ? S.trofei.map((t) => "🏆 " + esc(t)).join("<br>") : "<i>Ancora niente in bacheca. La bacheca, peraltro, è uno scaffale di Sghembi.</i>";
    const media = S.pres ? (S.voti / S.pres).toFixed(2) : "–";
    scene(BG(), "mf_me", `<b>Il Diario di ${N()}</b><br>Presenze ${S.pres} · Gol ${S.gol} · Gol nei Momenti ${S.mom} · Media voto ${media}<br>Onore ${S.onore} · Ombra ${S.ombra} · Fama ${S.fama}<br><br>${tr}<br><br>${S.log.slice(-8).map((l) => "· " + esc(l)).join("<br>")}`, [{ label: "◂ Indietro", fn: back }]);
  }
  function startNew() {
    const keep = S ? S.ends.slice() : [];
    S = fresh(); S.ends = keep; S.tappa = 1; S.name = hero().name; save(); castAll();
    EV[1].intro(() => { newSeason(); hub(); });
  }
  function resume() { if (!S.season) newSeason(); hub(); }
  function replay5() {
    const ends = S.ends.slice(), snap = S.snap5; S = Object.assign(fresh(), JSON.parse(JSON.stringify(snap))); S.ends = ends; S.snap5 = JSON.parse(JSON.stringify(snap)); delete S.f.t5; S.tappa = 5; S.season = null; save();
    EV[5].intro(() => { newSeason(); hub(); });
  }

  // ---------------------------------------------------------------- la settimana
  function hub() {
    if (!S.season) newSeason();
    const sz = S.season, r = sz.round;
    if (r >= 5) return seasonEnd();
    const key = S.tappa + "_r" + (r + 1), ev = EV[S.tappa] && EV[S.tappa]["r" + (r + 1)];
    if (ev && !S.seen[key]) { S.seen[key] = 1; save(); return ev(hub); }
    const fx = myFix(), home = fx.home === "us", opp = teamById(home ? fx.away : fx.home);
    const txt = statusHTML() + `<br><br><b>Giornata ${r + 1}/5</b> · ${home ? "in casa" : "in trasferta"} contro <b>${esc(opp.name)}</b> · posizione ${myPos()}°`;
    const opts = [{ label: `⚽ Gioca contro ${esc(opp.short)}`, sub: sz.did ? "Settimana fatta: si va in campo" : "Prima puoi fare una cosa della settimana", cls: "hot", fn: () => matchPick(opp, home) }];
    if (!sz.did) {
      opts.push({ label: "🏋️ Allenamento", sub: "Tiro, Dribbling o Fisico · gambe −6", fn: train });
      opts.push({ label: "🍻 Serata al bar", sub: "Fama +, una storia · gambe −4", fn: barNight });
      opts.push({ label: "🛌 Riposo", sub: `Gambe +${P() ? P().ageCurve(S.age).rec : 20}`, fn: rest });
    }
    opts.push({ label: "🗣️ Due parole con…", sub: "Le persone della tua squadra", fn: talk });
    opts.push({ label: "📊 Classifica", fn: () => scene(BG(), "voce", tableHTML(), [{ label: "◂ Indietro", fn: hub }]) });
    opts.push({ label: "📒 Diario", fn: () => diario(hub) });
    opts.push({ label: "◂ Menu della carriera", fn: menu });
    scene(BG(), "mf_me", txt, opts);
  }
  function train() {
    const go = (k, lbl) => {
      const q = Math.random() < 0.25 ? 2 : Math.random() < 0.65 ? 1 : 0, n = P() ? P().train(S.st, k, q, S.age) : 1;
      S.fisico = clamp(S.fisico - 6, 0, 100); S.season.did = true; save();
      const who = S.tappa === 1 ? "mf_ruggine" : S.tappa === 3 ? "mf_marisa" : "voce", line = pick(TRAIN[S.tappa] || TRAIN[2]);
      scene(BG(), line ? who : "voce", `${line ? T(line) + "<br>" : ""}<b>${lbl} +${n}</b>${q === 2 ? " · allenamento perfetto" : ""}. Valutazione <b>${ovr()}</b>.`, [{ label: "Continua ▸", cls: "hot", fn: hub }]);
    };
    ask("voce", "Su cosa lavori questa settimana?", [{ label: "🎯 Tiro", sub: `ora ${S.st.tiro}`, fn: () => go("tiro", "Tiro") }, { label: "🌀 Dribbling", sub: `ora ${S.st.drib}`, fn: () => go("drib", "Dribbling") }, { label: "💪 Fisico", sub: `ora ${S.st.fis}`, fn: () => go("fis", "Fisico") }, { label: "◂ Indietro", fn: hub }]);
  }
  function barNight() {
    S.fama = clamp(S.fama + 3 + S.tappa, 0, 100); S.fisico = clamp(S.fisico - 4, 0, 100); S.season.did = true; save();
    const l = pick(BAR[S.tappa === 5 && S.f.t5 === "p" ? 1 : S.tappa] || BAR[1]);
    scene("fd_bar", l[0], T(l[1]) + `<br><span style="color:var(--dim)">📣 Fama ${S.fama} · 🔋 Gambe ${S.fisico}</span>`, [{ label: "Continua ▸", cls: "hot", fn: hub }]);
  }
  function rest() {
    const rec = P() ? P().ageCurve(S.age).rec : 20, cap = P() ? P().ageCurve(S.age).cap : 100;
    S.fisico = clamp(S.fisico + rec, 0, cap); S.season.did = true; save();
    scene(BG(), "voce", T(pick(["Una giornata intera senza pallone. Ti sembra di aver tradito qualcuno. Le gambe, invece, ti ringraziano.", "Dormi dodici ore. Sogni un rigore. Lo sbagli anche in sogno, ma ti svegli riposato.", "Riposo. Guardi una partita in TV e commenti ogni errore come se tu non ne facessi mai."])) + `<br><b>🔋 Gambe ${S.fisico}</b>`, [{ label: "Continua ▸", cls: "hot", fn: hub }]);
  }
  function talk() {
    const L = TALK[S.tappa === 5 ? (S.f.t5 === "p" ? "5p" : "5a") : S.tappa] || [], c = (S.f.talk = S.f.talk || {});
    const opts = L.map(([who, lines]) => { const name = (PEOPLE[who] || [who])[0]; return { label: name, sub: (PEOPLE[who] || [])[1] || "", fn: () => { const i = c[who] | 0; c[who] = i + 1; save(); say([[who, lines[i % lines.length]]], talk); } }; });
    opts.push({ label: "◂ Indietro", fn: hub });
    ask("voce", "Con chi scambi due parole?", opts);
  }

  // ---------------------------------------------------------------- la partita
  const MTXT = {
    azione: ["Minuto {m}: il pallone rimbalza su una zolla e si ferma ai tuoi piedi. Davanti, mezza difesa.", "Minuto {m}: lancio lungo, controlli di petto. Hai pochi secondi prima che ti chiudano.", "Minuto {m}: ripartenza. Il campo si apre come una porta lasciata socchiusa.", "Minuto {m}: ti smarchi alle spalle del mediano. Il pallone arriva. Adesso tocca a te."],
    punizione: ["Minuto {m}: fallo al limite. Prendi il pallone prima che lo prenda qualcun altro.", "Minuto {m}: punizione dal vertice dell'area. La barriera si sistema e borbotta."],
    rigore: ["Minuto {m}: rigore! Il portiere saltella sulla linea come se avesse fretta.", "Minuto {m}: ti stendono in area. L'arbitro indica il dischetto, il pubblico trattiene il fiato."],
  };
  function moments(n) {
    const out = [], mins = []; for (let i = 0; i < n; i++) mins.push(5 + Math.floor(Math.random() * 85)); mins.sort((a, b) => a - b);
    for (let i = 0; i < n; i++) { const r = Math.random(), k = i === n - 1 && r < 0.3 ? "rigore" : r < 0.28 ? "punizione" : "azione"; out.push({ kind: k, txt: pick(MTXT[k]).replace("{m}", mins[i]) }); }
    return out;
  }
  function matchPick(opp, home) {
    const tp = TP(), eff = ovr();
    const run = (how) => { S.season.did = true; save(); play(opp, home, how); };
    ask("voce", `<b>${esc(tp.club.short)} – ${esc(opp.name)}</b>${home ? " (in casa)" : " (in trasferta)"}<br>Come giochi questa partita?<br><span style="color:var(--dim)">Valutazione in campo ${eff}${S.fisico < 35 ? " · gambe stanche: sarai più lento" : ""}.</span>`, [
      { label: "🥾 Il Momento", sub: `Giochi i tuoi ${tp.mom} momenti: azione, punizione, rigore · più Fama`, cls: "hot", fn: () => run("mom") },
      { label: "🎮 Partita intera", sub: "Col tuo Campione, nei motori di partita del gioco", fn: () => run("full") },
      { label: "⏩ Simula", sub: "Il risultato in un attimo · meno Fama", fn: () => run("sim") },
      { label: "◂ Indietro", fn: hub },
    ]);
  }
  function play(opp, home, how) {
    const tp = TP(), eff = clamp(ovr() - (S.fisico < 35 ? 6 : 0), 30, 99), h = hero(), lvl = tp.lv * (opp.lvl || 1);
    if (how === "mom" && window.__fangoMomento) {
      const nm = clamp(tp.mom + (S.f.next | 0), 2, 6); S.f.next = 0; save();
      return window.__fangoMomento.start({ title: `${tp.club.short} – ${opp.short}`, moments: moments(nm), lv: lvl, ovr: eff, oppColor: opp.col, heroLook: { name: h.name, skin: h.skin, hair: h.hair, shirt: tp.club.col, num: h.num }, onDone: (r) => after(opp, home, { how, my: r.a, miss: r.b - r.a }) });
    }
    if (how === "full" && api() && api().matchPick) {
      const k = 0.78 + S.tappa * 0.07;
      return api().matchPick({ id: "fango_" + S.tappa + "_" + opp.id, chap: `${TITLE} · ${tp.club.short} – ${opp.short}`, intro: `${tp.lega}. ${home ? "In casa" : "In trasferta"} contro ${opp.name}.`, mate: S.tappa >= 4 && S.f.t5 !== "p" ? "Brando" : "Tonino", mateGeneric: true, us: tp.club.short, alt: "hd,cage,az", bg: tp.bg,
        oppNames: opp.names, team: (t, st) => ({ name: opp.name, vs: opp.name, color: opp.col, atk: t(st.tiro * k * (opp.lvl || 1)), def: t((st.contrasto || st.contr || st.tiro) * k * (opp.lvl || 1)), vel: t(st.drib * k * (opp.lvl || 1)) }),
        onDone: (r) => after(opp, home, { how, full: r }) });
    }
    // simulata: ogni momento riesce con una probabilità legata alla valutazione
    const nm = clamp(tp.mom + (S.f.next | 0), 2, 6); S.f.next = 0; let my = 0; for (let i = 0; i < nm; i++) if (Math.random() < clamp((eff - 30) / 95 - S.tappa * 0.02 * (opp.lvl || 1), 0.12, 0.62)) my++;
    after(opp, home, { how: "sim", my, miss: nm - my });
  }
  function after(opp, home, o) {
    const sz = S.season, tp = TP(), C = core();
    let us, them, my;
    if (o.full) { us = o.full.a | 0; them = o.full.b | 0; my = Math.min(us, Math.ceil(us * 0.6)); }
    else { const r = P().withPlayer({ lvl: tp.club.lvl * (1 + (ovr() - 60) / 400) }, { lvl: opp.lvl, atk: opp.lvl, def: opp.lvl }, o.my || 0, { isNeutral: !home }); us = r.scoreA; them = r.scoreB; my = o.my || 0; }
    C.applyMatchToTable(sz.table, home ? "us" : opp.id, home ? opp.id : "us", home ? us : them, home ? them : us);
    const others = S.season.schedule[sz.round].filter((m) => m.home !== "us" && m.away !== "us").map((m) => { const a = teamById(m.home), b = teamById(m.away), x = C.simMatch(a, b); C.applyMatchToTable(sz.table, a.id, b.id, x.scoreA, x.scoreB); return `${a.short} ${x.scoreA}–${x.scoreB} ${b.short}`; });
    const win = us > them, lost = us < them, pg = P().pagella({ goals: my, win, lost, miss: o.miss || 0, bonus: o.how === "mom" ? 0.25 : 0 });
    const cost = P() ? P().ageCurve(S.age).cost : 12;
    S.fisico = clamp(S.fisico - cost, 0, 100); S.gol += my; sz.gol += my; S.pres++; S.voti += pg.voto; if (o.how === "mom") S.mom += my;
    S.fama = clamp(S.fama + my * (o.how === "sim" ? 1 : 2) + (win ? 2 : 0) + (pg.voto >= 7.5 ? 2 : 0), 0, 100);
    // crescita: una buona partita ti fa migliorare
    let up = ""; if (pg.voto >= 7) { const k = pick(["tiro", "drib", "fis"]); S.st[k] = clamp(S.st[k] + 1, 0, 99); up = ` · ${{ tiro: "Tiro", drib: "Dribbling", fis: "Fisico" }[k]} +1`; }
    sz.round++; sz.did = false; logL(`${tp.club.short} ${us}–${them} ${opp.short} · ${my ? my + " gol, " : ""}voto ${pg.voto}`); save();
    const res = win ? "Vittoria" : lost ? "Sconfitta" : "Pareggio", who = win ? (pick(["mf_bava", "mf_pupa"])) : "voce";
    const cmt = win ? pick(["Negli spogliatoi qualcuno canta. Male, ma canta.", "Il pubblico ti chiama per nome. Lo sbaglia, ma ti chiama.", "Tre punti. Stasera si mangia, e qualcuno paga."]) : lost ? pick(["Silenzio sul pullman. L'autista mette la radio, poi la spegne.", "Una sconfitta. Il fango non te la rinfaccia: aspetta che ti rialzi.", "Hai perso. Domani ti allenerai con la faccia di chi ha perso, che è una faccia utile."]) : pick(["Un punto. Non si butta niente, diceva tua nonna. Anche dei pareggi.", "Pari. Tutti scontenti allo stesso modo: è quasi giustizia."]);
    scene(tp.bg, S.tappa <= 1 || (S.tappa === 5 && S.f.t5 === "p") ? who : "voce", `<b>${res} ${us}–${them}</b> contro ${esc(opp.name)}.<br>${my ? `⚽ ${my === 1 ? "Un gol tuo" : my + " gol tuoi"}. ` : ""}📝 Pagella: <b>${pg.voto}</b> · ${pg.label}${up}<br>🔋 Gambe ${S.fisico} · 📣 Fama ${S.fama}<br><i>${T(cmt)}</i><br><span style="color:var(--dim)">${others.map(esc).join(" · ")}</span>`, [{ label: "Classifica ▸", cls: "hot", fn: () => scene(tp.bg, "voce", tableHTML(), [{ label: "Continua ▸", cls: "hot", fn: hub }]) }]);
  }
  function seasonEnd() {
    const tp = TP(), pos = myPos(), need = tp.need, pass = pos <= need.pos || (need.ovr && ovr() >= need.ovr);
    const finish = () => EV[S.tappa].end(pass, pos, (ok) => {
      if (ok === false || !pass) {
        return ask("voce", `<b>${pos}° posto.</b> ${need.ovr ? `Serviva chiudere tra le prime ${need.pos} o arrivare a valutazione ${need.ovr} (ora ${ovr()}).` : "Non è bastato."} La stagione si rigioca: statistiche e ricordi restano, il calendario no.`, [{ label: "↺ Rigioca la stagione", cls: "hot", fn: () => { newSeason(); hub(); } }, { label: "◂ Menu", fn: menu }]);
      }
      if (S.tappa < 5) {
        S.done[S.tappa] = 1; const pz = coins(TAPPE[S.tappa].prize); if (pos === 1) S.trofei.push(`${tp.lega} · ${tp.club.short} (${S.age} anni)`);
        S.tappa++; S.season = null; grow(); if (S.tappa === 5) S.snap5 = JSON.parse(JSON.stringify(Object.assign({}, S, { snap5: null, ends: [] }))); save();
        toast(`Tappa superata · +${pz} monete`, "🏆");
        return EV[S.tappa].intro(() => { newSeason(); hub(); });
      }
    });
    scene(tp.bg, "voce", `<b>Fine stagione</b><br>${tableHTML()}`, [{ label: "Continua ▸", cls: "hot", fn: finish }]);
  }
  // gli anni tra una tappa e l'altra: si cresce (e a trentaquattro anni si comincia a calare)
  const GROW = { 2: { tiro: 6, drib: 6, fis: 6 }, 3: { tiro: 6, drib: 5, fis: 6 }, 4: { tiro: 5, drib: 5, fis: 4 }, 5: { tiro: 2, drib: 0, fis: -5 } };
  function grow() { const g = GROW[S.tappa]; if (!g) return; Object.keys(g).forEach((k) => { S.st[k] = clamp(S.st[k] + g[k], 20, 99); }); logL(`${TAPPE[S.tappa].age} anni: ${g.fis < 0 ? "le gambe cominciano a sentire gli anni" : "qualche anno in più, e si vede in campo"}.`); }
  function ending(k, cb) {
    if (!S.ends.includes(k)) S.ends.push(k); S.done[5] = 1; S.tappa = 6; S.season = null; save(); coins(TAPPE[5].prize);
    const e = ENDINGS[k];
    if (window.__presa && window.__presa.cutin) window.__presa.cutin("FINALE · " + e[0].toUpperCase(), e[1], () => (cb ? cb() : menu())); else (cb ? cb() : menu());
  }

  // ---------------------------------------------------------------- storia: frasi della settimana
  const TRAIN = {
    1: ["Ruggine ti fa tirare contro la porta bassa per un'ora. «Se entra lì, entra ovunque. Se non entra, è colpa della porta. Comodo, no?»", "Ruggine mette sei sedie sul campo. «Dribbla le sedie.» Le sedie vincono due a uno. «Domani di nuovo.»", "Corsa in salita, perché il campo è in salita. «Il fango è gratis, ragazzo. La fatica pure. Approfittane.»"],
    2: ["Il Mister di Valdolio, il Ragioniere Corradi, ti fa allenare con un cronometro e un quaderno. Annota tutto. Anche quando starnutisci.", "Allenamento tra gli ulivi: chi sbaglia il passaggio raccoglie le olive cadute. Tu raccogli un sacchetto.", "Partitella a campo ridotto. Vinci. Corradi scrive qualcosa. Lo sbirci: «Bene.» Sottolineato due volte."],
    3: ["Marisa ti misura il salto, la spinta, l'equilibrio. «Vediamo.» Poi annota un numero, e non te lo dice.", "Doppia seduta, con gli operai del turno di notte che guardano dalla rete. Uno ti grida: «Corri come chi deve timbrare!»", "Marisa ti fa fare esercizi su un piede solo, a occhi chiusi. «Il calcio è stare in piedi quando gli altri cadono.»"],
    4: ["Allenamento con i GPS, le telecamere e un preparatore che parla tre lingue. Tu rispondi in dialetto. Funziona lo stesso.", "Sessione video: guardi i tuoi errori al rallentatore. Al rallentatore sono ancora più evidenti. Grazie, tecnologia.", "Brando ti sfida ai tiri al volo. Perde, poi dice che il pallone era «di un'altra marca». Lo è, ma non c'entra."],
    5: ["Ti alleni come un ragazzo e recuperi come uno di trentaquattro anni. Il ginocchio tiene il conto. Anche tu.", "Tiri dal limite finché il sole non tramonta. Qualcuno, dalla rete, applaude. È lo stesso applauso di diciassette anni fa, solo più stanco.", "Corsa leggera, stretching lungo. «Una volta correvo per arrivare», pensi. «Adesso corro per restare.»"],
  };
  const BAR = {
    1: [["mf_sghembi", "Al Bar Sport, Sghembi offre un giro e poi lo segna sul tuo conto. «È un investimento sul vivaio», spiega. Il vivaio sei tu."], ["mf_bava", "Tonino legge ad alta voce la cartolina che ha consegnato stamattina alla signora Gina. «Non dovresti», gli dici. «Ma è bellissima», risponde. Lo è."], ["mf_pupa", "La Zia Pupa ti racconta di quando, nel '79, la Pozzanghera fu promossa e il paese fece la processione con la coppa al posto del santo. «Il santo non si offese. Era tifoso.»"], ["voce", "Due vecchi giocano a scopa e commentano la tua ultima partita. Uno dice che sei forte. L'altro dice che lui alla tua età era più forte. Il primo dice che alla tua età lui era già sposato. Il discorso si perde."]],
    2: [["mf_ugo", "Ugo ti offre un aperitivo e risponde a tre telefonate. «Erano tutte per te», dice. Non specifica chi fossero."], ["voce", "Al bar di Valdolio fanno la bruschetta con l'olio nuovo. Te ne mangi quattro. Il tuo preparatore, se ci fosse, piangerebbe."], ["mf_greta", "Una ragazza con un taccuino ti chiede cosa provi a giocare in Serie D. «Fame», rispondi. Lei lo scrive. Poi lo sottolinea."]],
    3: [["voce", "Il bar del dopolavoro dell'acciaieria: si beve in piedi, si parla poco, si canta molto. Ti insegnano il coro del Portoferro. È lungo nove strofe e le prime otto parlano di turni."], ["mf_greta", "Greta ti fa un'intervista vera, col registratore. Le dici una cosa sincera senza volerlo. Il giorno dopo è il titolo."], ["mf_ugo", "Ugo ti presenta un imprenditore che vuole fare un videogioco con la tua faccia. La tua faccia, nel videogioco, è più bella. Non firmi, per orgoglio."]],
    4: [["voce", "Un locale in centro, luci basse, cocktail che costano come una stagione della Pozzanghera. Ne ordini uno e lo bevi lentamente, per farlo durare."], ["mf_brando", "Brando ti porta a una festa sulla terrazza di un attore. L'attore ti chiede dove si mette la palla in fuorigioco. Brando glielo spiega, sbagliato. Ridi per tutta la sera."], ["mf_greta", "Greta, ora alle pagine nazionali, ti fa notare che in un anno hai detto «sì, va bene» quarantadue volte nelle interviste. «Prova a dire qualcos'altro.» «Sì, va bene.»"]],
    5: [["voce", "Ti riconoscono anche i bambini. Uno ti chiede l'autografo per suo padre, che ti ha visto giocare in Serie D. «Era il più forte», dice il padre. «Lo è ancora», dice il bambino. Non è vero, ma ringrazi."], ["mf_greta", "Greta ti chiede se hai paura di smettere. Ci pensi. «Ho paura di non accorgermene», rispondi. Lei, per una volta, non scrive niente."]],
  };
  const TALK = {
    1: [["mf_ruggine", ["Il fango ti insegna una cosa sola: chi cade e si rialza prima, vince. Il resto sono chiacchiere da televisione.", "Non guardare il pallone. Il pallone lo sa dov'è. Guarda dove sarà.", "(mastica il toscano spento) No, non lo accendo. L'ho promesso a una persona. Il toscano è per ricordarmi la promessa."]], ["mf_bava", ["Io paro con la faccia perché con le mani consegno la posta. Una cosa per volta, ragazzo.", "Lo sai che la tua scuola mi manda ancora le pagelle? Hai sette in educazione fisica e quattro in tutto il resto. Coerente.", "A quarantun anni uno o smette o diventa leggenda. Io ho scelto una terza via: continuo."]], ["mf_pupa", ["Panino? È un sì. Da me la domanda è retorica.", "Tuo nonno veniva a vedere le partite qui. Stava sempre dietro la porta bassa. Diceva che da lì si vedevano i gol prima.", "Ruggine fa il duro, ma la sera passa da me e chiede di te. Non dirgli che te l'ho detto."]], ["mf_sghembi", ["Una salsiccia a gol. In Serie A pagano di più, ma vuoi mettere la qualità?", "Il bilancio? Sta in un quaderno a quadretti. I quadretti, almeno, tornano.", "Mi hanno offerto di vendere il campo per farci un supermercato. Ho detto di no. Poi ho chiesto quanto. Poi ho detto di no di nuovo."]]],
    2: [["mf_ugo", ["Ragazzo, nel calcio ci sono due tipi di persone: quelle che firmano e quelle che fanno firmare. Io sono di un terzo tipo: quelle che leggono le clausole.", "Dieci per cento. Venti nei giorni di pioggia. Scherzo. Più o meno.", "Il talento non basta. Serve qualcuno che lo racconti bene. Io racconto benissimo."]], ["mf_greta", ["Scrivo per la Gazzetta delle Colline. Tiratura: quattromila copie, tremila lette dal barbiere.", "Non mi interessano i tuoi gol. Mi interessa perché li festeggi guardando la tribuna. Chi cerchi?", "Un giorno scriverò di te su un giornale vero. Tu cerca di non deludermi prima."]], ["mf_bava", ["(per lettera) Caro {n}, qui tutto bene. Abbiamo perso sette a zero ma la Pupa ha venduto il record di porchette. Ruggine dice che sei andato via troppo presto. Poi ha detto che è giusto così. Poi è stato zitto per un'ora. Tuo, Tonino.", "(per lettera) Caro {n}, mi hanno dato un premio come postino più vecchio della provincia. L'ho messo in porta. Para meglio di me."]]],
    3: [["mf_marisa", ["Il ginocchio sta bene. Tu un po' meno, ma quello non è il mio reparto.", "Ho visto ragazzi più forti di te smettere a ventisei anni. Non per le gambe: per la testa. Tieni d'occhio la testa.", "Vediamo. È la parola più onesta che conosco."]], ["mf_greta", ["Il Portoferro è la squadra dove si è rotto Aldo Ruggine, nel '78. Lo sapevi? Lui sì, e ti ha mandato qui lo stesso.", "Ho un'offerta da un giornale nazionale. Se vai in Serie A, ti seguo. Non per te: per la storia.", "Ugo è bravo. È questo che mi preoccupa."]], ["mf_ugo", ["Portoferro è un trampolino. Sotto, però, c'è il cemento. Salta bene.", "Ho già tre squadre di Serie A che chiedono di te. Due esistono davvero."]]],
    4: [["mf_brando", ["Te l'avevo detto: a vent'anni ero in Serie A. Non ti ho detto che a ventotto sarei stato in panchina.", "Mio padre ha chiuso la fabbrica di piastrelle. Dice che è colpa della concorrenza. Io dico che è colpa delle piastrelle a forma di pallone.", "La macchina rossa l'ho venduta. Adesso ne ho una grigia. Mi riconoscono di meno, e mi va bene."]], ["mf_greta", ["Settantamila persone ti guardano ogni domenica. Quante ti conoscono? Io, forse.", "Scrivo di te da otto anni. Ho finito gli aggettivi. Mi restano i fatti.", "Hai mai pensato a cosa farai dopo? No? Lo immaginavo."]], ["mf_ugo", ["Il contratto nuovo è pronto. Leggi bene la pagina sei. Anzi, non leggerla: ti fidi di me, no?", "Il calcio è una macchina. Io sono l'olio. Nessuno ringrazia l'olio."]]],
    "5a": [["mf_greta", ["L'ultima stagione nelle luci grandi. Ti godi il rumore o ti dà fastidio?", "Ho già scritto il pezzo per il tuo ritiro. L'ho riscritto quattro volte. Tu non leggerlo."]], ["mf_brando", ["Io ho smesso. Faccio l'osservatore per l'Aurelia: guardo ragazzi di diciassette anni e mi viene da ridere.", "Vinci questa coppa. Poi torna a casa. Non sono due cose diverse."]]],
    "5p": [["mf_bava", ["Cinquantotto anni e ancora in porta. Il medico dice che è un miracolo. Io dico che è pigrizia: non ho mai trovato un sostituto.", "Lunedì consegno la posta come sempre. Ma domenica, se vinciamo, consegno anche un sogno. Si dice così, no?"]], ["mf_pupa", ["Sei tornato. Lo sapevo. Il panino te l'ho tenuto in caldo diciassette anni: non ti offendere se è un po' secco.", "Il campo è ancora qui. Ogni tanto qualcuno lo voleva comprare. Ogni tanto qualcuno pagava perché non succedesse. Non chiedermi chi."]], ["mf_brando", ["Ho venduto la macchina rossa, la casa al mare e l'orgoglio. Mi è rimasto il tunnel. Ti basta?", "Io a Tre Ponti ero il Principe. Qui sono uno che corre in salita. È meglio."]], ["mf_sghembi", ["Una salsiccia a gol. Il prezzo è rimasto quello. L'inflazione, qui, non entra.", "Se retrocediamo, la Pozzanghera chiude. Non lo dico per metterti pressione. Cioè, sì, lo dico per quello."]]],
  };

  // ---------------------------------------------------------------- storia: le tappe
  const EV = {
    1: {
      intro(cb) {
        say([
          ["voce", "Sterpaglia, entroterra del Golfo. Quattrocento abitanti, due bar, una chiesa e un campo di calcio in pendenza: il Comunale «Gino Melma». Nessuno sa chi fosse Gino Melma. Tutti sanno che la porta a sinistra è più bassa.", "fd_titolo"],
          ["mf_sghembi", "Tu sei {n}? Ivo Sghembi: presidente, sponsor e macellaio. L'A.S.D. Pozzanghera ti offre una maglia, una salsiccia a gol e la gloria. La maglia va restituita.", "fd_campo"],
          ["mf_ruggine", "Aldo Ruggine, allenatore. (si toglie di bocca un toscano spento) Ti ho visto palleggiare contro il muro della chiesa. Il parroco ti odia. È un buon segno."],
          ["mf_ruggine", "Qui si gioca nel fango. E il fango ti insegna una cosa sola: chi cade e si rialza prima, vince. Il resto sono chiacchiere da televisione."],
          ["mf_bava", "Tonino Bava, portiere. Di giorno faccio il postino, quindi non chiedermi di correre: ho già dato. Benvenuto. Le docce sono un tubo."],
          ["mf_pupa", "Io sono la Zia Pupa. Il furgone della porchetta è mio, il campo è di tutti. Se segni, panino gratis. Se sbagli, panino lo stesso: da me non si muore di fame per un rigore."],
          ["voce", "Diciassette anni, un paio di scarpini comprati al mercato e una maglia granata due taglie più grande. <b>Tappa 1 · Il Fango.</b> Chiudi tra le prime due del Girone di Sterpaglia, oppure gioca così bene che qualcuno, da fuori, se ne accorga."],
        ], cb);
      },
      r3(cb) {
        say([
          ["voce", "Prima della terza giornata, davanti al Bar Sport si ferma una macchina rossa. Una macchina rossa, a Sterpaglia, fa più rumore di un gol.", "fd_bar"],
          ["mf_brando", "Brando Lucidi, Olimpia Tre Ponti. Mi hanno detto che qui c'è uno che dribbla le sedie. Io a vent'anni sarò in Serie A. Tu a vent'anni… sarai qui. Ma il fango ti dona, eh."],
        ], () => ask("mf_brando", "Brando ti guarda come si guarda un bel panorama: con un po' di pietà.", [
          { label: "«Te lo dico in campo.»", sub: "Onore +1", fn: () => { W("onore", 1); S.f.brando = "campo"; save(); say([["mf_brando", "In campo? Va bene. Ma ti avverto: io in campo sono anche più bello."], ["mf_ruggine", "(da dietro il bancone) Bravo. Le parole al bar si pagano. Quelle in campo no."]], cb); } },
          { label: "Gli palleggi sul cofano col pallone infangato", sub: "Fama +3 · Ombra +1", fn: () => { W("ombra", 1); S.fama += 3; S.f.brando = "cofano"; save(); say([["voce", "Sette palleggi sul cofano rosso. All'ottavo il pallone lascia un'impronta di fango a forma di Sardegna. Il bar applaude in piedi."], ["mf_brando", "…Questa me la ricordo. Ci vediamo sul campo, Sterpaglia."]], cb); } },
          { label: "«Come fai il tunnel col tacco?»", sub: "Dribbling +2", fn: () => { S.st.drib += 2; S.f.brando = "tunnel"; save(); say([["mf_brando", "(stupito) Nessuno me l'aveva mai chiesto. Di solito mi chiedono quanto costa la macchina. Guarda: il peso sul piede sbagliato, poi lo cambi. Così."], ["voce", "Per dieci minuti, davanti al bar, il Principe di Tre Ponti e il ragazzo della Pozzanghera fanno tunnel a una sedia. La sedia perde."]], cb); } },
        ]));
      },
      r5(cb) {
        say([
          ["voce", "La sera prima dell'ultima giornata torni al campo a riprendere una scarpa dimenticata. C'è una luce sola accesa, e Ruggine seduto in panchina.", "fd_campo"],
          ["mf_ruggine", "Nel '78 giocavo nel Portoferro. Serie B, vent'anni, i giornali scrivevano il mio nome giusto. Derby, pioggia, un campo come questo. Un contrasto, il ginocchio, e basta."],
          ["mf_ruggine", "Nessuno mi ha più chiamato. E io ho fatto l'errore più grande: ho aspettato. Ho aspettato che qualcuno venisse a prendermi. Quarant'anni ad aspettare su una panchina."],
          ["mf_ruggine", "Tu non aspettare. Vai a prenderti le cose. E quando cadi, e cadrai, rialzati prima degli altri. (ti porge la scarpa) Questa è tua. Le scarpe non si dimenticano, ragazzo. Mai."],
        ], () => { S.f.ruggine1 = 1; W("onore", 1); save(); cb(); });
      },
      end(pass, pos, cb) {
        if (!pass) return say([["mf_ruggine", `${pos}° posto. Il fango oggi ha vinto lui. Domani ricominciamo: tanto il campo non scappa, è in pendenza ma non scappa.`]], () => cb(false));
        say([
          ["voce", "Fine stagione. Al Bar Sport entra un uomo con un completo grigio, un telefono all'orecchio e un altro in tasca che squilla.", "fd_bar"],
          ["mf_ugo", "Ugo Sanguisuga, procuratore. Sì, il cognome è vero, e no, non lo cambio: è un biglietto da visita. Ragazzo, la Virtus Valdolio, Serie D, ti vuole. Io ti porto lì. In cambio, il dieci per cento."],
          ["mf_ruggine", "(senza alzare gli occhi dal giornale) Il dieci per cento di niente è niente. Firma, se vuoi. Ma leggi."],
        ], () => ask("mf_ugo", "Ugo ti allunga una penna che costa più della tua bicicletta.", [
          { label: "Firmi con Ugo", sub: "Fama +5 · il procuratore lavora per te", fn: () => { S.f.ugo = 1; S.fama += 5; save(); bye(); } },
          { label: "Ci vai da solo: telefona Ruggine", sub: "Onore +1 · niente procuratore, per ora", fn: () => { S.f.ugo = 0; W("onore", 1); save(); say([["mf_ruggine", "Pronto, Corradi? Sono Ruggine. Sì, quello. Ti mando un ragazzo. No, niente procuratore. Ha le scarpe e ha la testa. Il resto, insegnaglielo tu."], ["mf_ugo", "(rimettendo la penna in tasca) Nessun problema. Ci rivedremo. Nel calcio ci si rivede sempre: è un campo piccolo, anche quando è grande."]], bye); } },
        ]));
        function bye() {
          say([
            ["mf_pupa", "Tieni. Panino incartato nel giornale di oggi: c'è la classifica, così te la ricordi.", "fd_campo"],
            ["mf_bava", "Ti scrivo io. Tanto sono il postino: le lettere per te le consegno prima di scriverle."],
            ["mf_ruggine", "Vai. E non voltarti, che poi ti cade il ginocchio. (non ride nessuno, ma lui sì)"],
            ["voce", "<b>Tappa superata.</b> Si va a Valdolio. Tre anni dopo, in Serie D."],
          ], () => cb(true));
        }
      },
    },
    2: {
      intro(cb) {
        say([
          ["voce", "Valdolio, colline di ulivi e una tribuna coperta a metà. Hai vent'anni, un contratto vero e un affitto da pagare. Il calcio, per la prima volta, è anche un lavoro.", "fd_valdolio"],
          ...(S.f.ugo ? [["mf_ugo", "Benvenuto nel professionismo. Quasi. La Serie D è come l'ascensore di un palazzo vecchio: sale, ma fa un rumore che non ti fa dormire."]] : [["voce", "Il Mister della Virtus, il Ragioniere Corradi, ti accoglie con un quaderno: «Ruggine dice che hai le scarpe e la testa. Le scarpe le vedo. La testa la controlliamo.»"]]),
          ["mf_greta", "Greta Fumagalli, Gazzetta delle Colline. Tu sei quello del Gino Melma? Ho letto di te in un trafiletto. Era sbagliato il nome, ma il resto prometteva."],
          ["voce", "<b>Tappa 2 · La Provincia.</b> Serie D, Girone delle Colline. Chiudi tra le prime due, o arriva a valutazione 62."],
        ], cb);
      },
      r3(cb) {
        say([
          ["mf_bava", "(lettera) Caro {n}, qui tutto bene. Abbiamo perso sette a zero con Tre Ponti, ma la Pupa ha venduto il record di porchette: la gente veniva a consolarsi. Ruggine ti guarda su un televisore del bar che prende la Serie D solo se qualcuno tiene l'antenna. La tiene lui. Tuo, Tonino.", "fd_valdolio"],
        ], () => ask("voce", "Gli rispondi?", [
          { label: "Scrivi a Tonino una lettera lunga", sub: "Onore +1 · Gambe +6", fn: () => { W("onore", 1); S.fisico = clamp(S.fisico + 6, 0, 100); S.f.lettereBava = 1; save(); say([["voce", "Scrivi tre pagine. Una è sul calcio, due sono sulla Pozzanghera. Ti fa bene come una notte di sonno."]], cb); } },
          { label: "Gli mandi una foto con l'autografo", sub: "Fama +3", fn: () => { S.fama += 3; save(); say([["voce", "Firmi una foto: «A Tonino, il portiere più forte della Terza Categoria». La appenderà nell'ufficio postale. Sarà l'unica foto con autografo dell'ufficio postale di Sterpaglia."]], cb); } },
        ]));
      },
      r5(cb) {
        say([
          ["voce", "Prima dell'ultima giornata, nel parcheggio del campo, un uomo in completo beige misura con un metro da sarto il cofano della tua utilitaria.", "fd_valdolio"],
          ["mf_pennacchio", "Il Geometra Pennacchio. Misuro le cose. Questa macchina misura poco, per un talento come lei. Domenica, contro il Monteolivo, a loro serve un punto. A lei servirebbe una macchina che misura di più."],
          ["mf_pennacchio", "Nessuno deve perdere niente. Un pareggio. Un rigore tirato centrale, una corsa in meno. Le cose si sistemano da sole, se si misurano bene."],
        ], () => ask("mf_pennacchio", "Il Geometra ti porge una busta. Non è chiusa. Non ha bisogno di esserlo.", [
          { label: "«No.» Ti giri e vai via", sub: "Onore +2", fn: () => { W("onore", 2); S.f.combine = "no"; save(); say([["mf_pennacchio", "(riavvolgendo il metro) Peccato. Lei misura più di quanto pensassi. Lo dirò in giro: è un complimento, ma non per tutti."]], cb); } },
          { label: "Prendi la busta", sub: "Ombra +2 · monete · domenica avrai un momento in meno", fn: () => { W("ombra", 2); S.f.combine = "si"; S.f.next = -1; coins(40); save(); say([["voce", "La busta pesa poco. Il peso arriva dopo, di notte, quando guardi il soffitto e il soffitto guarda te."], ["mf_pennacchio", "Saggio. Le cose misurate bene non fanno rumore."]], cb); } },
          { label: "Registri tutto e chiami Greta", sub: "Onore +1 · Fama +6 · ti fai un nemico", fn: () => { W("onore", 1); S.fama += 6; S.f.combine = "greta"; save(); say([["mf_greta", "(il giorno dopo, in prima pagina) «IL GEOMETRA E LE PARTITE MISURATE». La procura apre un fascicolo. Il Geometra sparisce. Ti chiamano tutti: la metà per ringraziarti, l'altra metà no."], ["mf_greta", "Mi hai dato la storia della mia vita. Ti devo un favore. Uno, eh."]], cb); } },
        ]));
      },
      end(pass, pos, cb) {
        if (!pass) return say([["voce", `${pos}° posto. Corradi chiude il quaderno: «I numeri non mentono. Ma si possono migliorare.» Si rigioca.`]], () => cb(false));
        say([
          ["voce", "Il Calcio Portoferro, Serie B, ti vuole. Firmi in un ufficio con le foto in bianco e nero della squadra del '78. In una, in basso a destra, c'è un ragazzo con i baffi e un ginocchio ancora intero.", "fd_portoferro"],
          ...(S.f.ugo ? [] : [["mf_ugo", "Ci rivediamo, come ti avevo detto. In Serie B senza procuratore non ti fanno entrare neanche al bar. Il dieci per cento. Facciamo amicizia."]]),
          ["mf_bava", "(telefono) Ruggine non è venuto al bar stasera. Ha detto che era stanco. Non era mai stanco. Comunque: bravo. Ha detto anche questo, ma più piano."],
          ["voce", "<b>Tappa superata.</b> Portoferro, la città dell'acciaio. Quattro anni dopo."],
        ], () => { S.f.ugo = 1; save(); cb(true); });
      },
    },
    3: {
      intro(cb) {
        say([
          ["voce", "Portoferro: tre turni all'acciaieria, uno stadio di cemento del 1921 dove si sta in piedi, come al lavoro. Quando la squadra segna, i gruisti del porto suonano la sirena.", "fd_portoferro"],
          ["mf_marisa", "Marisa Lenti, fisioterapista. Ti rimetterò in piedi ogni volta che cadrai. Non dirmi «grazie»: dimmi dove fa male."],
          ["mf_greta", "Mi hanno presa a un giornale vero. Pagina sportiva nazionale, colonna di destra in basso. Seguo te. Non per affetto: per la storia."],
          ["voce", "<b>Tappa 3 · La Cadetteria.</b> Serie B. Chiudi tra le prime tre, o arriva a valutazione 72."],
        ], cb);
      },
      r3(cb) {
        say([
          ["voce", "Terza giornata, ventesimo minuto. Un contrasto in scivolata, il ginocchio che si piega dove non dovrebbe. Il rumore lo senti solo tu. Poi, lo stadio di cemento tace.", "fd_portoferro"],
          ["mf_marisa", "(di sera, nella stanza della foresteria) Collaterale stirato. Non è rotto. Ma se lo forzi adesso, lo rompi. Vediamo. Cosa vuoi fare?", "fd_ospedale"],
        ], () => ask("mf_marisa", "Il ginocchio è caldo e gonfio. Fuori piove sulla città.", [
          { label: "Giochi subito, con la fasciatura", sub: "Ombra +1 · Fisico −4 per sempre, ma niente stop", fn: () => { W("ombra", 1); S.st.fis = clamp(S.st.fis - 4, 0, 99); S.f.ginocchio = "forzato"; save(); say([["mf_marisa", "Va bene. Non è il mio ginocchio. Ma te lo ricorderai a trentacinque anni, quando piove."]], cb); } },
          { label: "Ti fermi e fai la riabilitazione", sub: "Gambe 40 per un po' · niente danni", fn: () => { S.fisico = 40; S.f.ginocchio = "riposo"; save(); say([["mf_marisa", "Brava testa. Esercizi due volte al giorno. Vediamo. (dopo una settimana) Vediamo bene."]], cb); } },
          { label: "Telefoni a Ruggine", sub: "Onore +1 · Gambe 60", fn: () => { W("onore", 1); S.fisico = 60; S.f.ginocchio = "ruggine"; save(); say([["mf_ruggine", "(al telefono, voce stanca) Ti sei fatto male a Portoferro. Il destino ha un pessimo senso dell'umorismo. Ascolta: fermati due giorni. Non uno, non tre. Due. E poi rialzati prima degli altri. Come ti ho insegnato."], ["mf_ruggine", "E dì alla fisioterapista che se ti rimette in piedi le offro un toscano. Spento, eh."]], cb); } },
        ]));
      },
      r5(cb) {
        say([
          ["voce", "Notte. Il telefono squilla alle tre. È Tonino.", "fd_ospedale"],
          ["mf_bava", "{n}… Ruggine se n'è andato. Nel sonno, dicono. L'hanno trovato stamattina sulla panchina del Gino Melma, col toscano spento in bocca. Era seduto dritto. Sembrava che aspettasse l'inizio della partita."],
          ["mf_bava", "Il funerale è domani alle undici. Domenica giochi. Io… non so cosa dirti. Sono un postino: di solito le parole le porto, non le scrivo."],
        ], () => ask("voce", "Fuori la pioggia non smette. Domani c'è l'allenamento di rifinitura, domenica l'ultima giornata.", [
          { label: "Vai al funerale e torni di notte", sub: "Onore +2 · Gambe −30", fn: () => { W("onore", 2); S.fisico = clamp(S.fisico - 30, 0, 100); S.f.scarpe = 1; S.f.lettera = 1; save(); say([
            ["voce", "Quattro ore di macchina. La chiesa di Sterpaglia è piena: c'è anche il parroco che ti odiava. La bara ha sopra una maglia granata due taglie più grande.", "fd_campo"],
            ["mf_pupa", "Questa l'ha lasciata per te. E queste (ti porge un paio di scarpini vecchi, cuciti a mano) erano le sue del '78. Ha detto: «Al ragazzo, che le scarpe non si dimenticano.»"],
            ["voce", "Nella busta c'è una lettera: «Ragazzo, se leggi questa vuol dire che ho smesso di aspettare. Non piangere troppo: ho visto un ragazzo del mio campo diventare quello che io non sono stato. È più di quanto chiedessi. Il fango non è una vergogna: è da lì che si vede meglio il cielo. Rialzati prima. Tuo, A.R.» Torni a Portoferro alle quattro del mattino, e non dormi."],
          ], cb); } },
          { label: "Resti e gli dedichi la partita", sub: "Fama +4 · un momento in più domenica", fn: () => { S.fama += 4; S.f.dedica = 1; S.f.next = 1; S.f.lettera = 1; save(); say([
            ["voce", "Non vai. Ti alleni da solo fino a sera, al buio, e tiri contro una porta che non è bassa da nessuna parte."],
            ["mf_bava", "(due giorni dopo, una busta) Ruggine aveva lasciato questa per te. L'ho portata io. Era il mio giro, del resto."],
            ["voce", "«Ragazzo, se leggi questa vuol dire che ho smesso di aspettare. Non piangere troppo: ho visto un ragazzo del mio campo diventare quello che io non sono stato. Il fango non è una vergogna: è da lì che si vede meglio il cielo. Rialzati prima. Tuo, A.R.»"],
          ], cb); } },
        ]));
      },
      end(pass, pos, cb) {
        if (!pass) return say([["mf_marisa", `${pos}° posto. Vediamo. (pausa) Vediamo l'anno prossimo. Le gambe ci sono. Ricominci.`]], () => cb(false));
        say([
          ["mf_greta", "(il giornale del lunedì) «Da Sterpaglia alla Serie A. Il ragazzo del campo in pendenza firma con l'Aurelia. Ha esultato guardando in alto, verso un punto preciso della tribuna. Non c'era nessuno, in quel punto. O forse sì.»", "fd_portoferro"],
          ["mf_ugo", "Serie A. Te l'avevo detto. Il contratto è pronto, ho già sistemato tutto io. Non serve che tu legga: è roba noiosa, numeri. Firma qui, qui e qui."],
          ["voce", "<b>Tappa superata.</b> L'Aurelia, Serie A. Quattro anni dopo, a ventotto anni."],
        ], () => cb(true));
      },
    },
    4: {
      intro(cb) {
        say([
          ["voce", "Settantamila persone. Tre anelli. Una curva che canta un coro con il tuo nome dentro: rima con «leggenda», e chi l'ha scritto ne va fierissimo.", "fd_stadio"],
          ["mf_brando", "Guarda chi c'è. Il ragazzo del fango. Te l'avevo detto: a vent'anni ero in Serie A. Non ti ho detto che a ventotto sarei stato in panchina, a fare le foto con i bambini degli sponsor."],
          ["mf_brando", (S.f.brando === "tunnel" ? "Ti ricordi il tunnel alla sedia? È l'ultima volta che mi sono divertito davvero a giocare." : S.f.brando === "cofano" ? "La macchina con l'impronta della Sardegna l'ho tenuta un anno senza lavarla. Era la cosa più vera che avessi." : "Mi avevi detto «te lo dico in campo». Me l'hai detto. Tre volte, mi pare.") + " Benvenuto all'Aurelia, compagno."],
          ["voce", "<b>Tappa 4 · La Serie A.</b> Chiudi tra le prime tre, o arriva a valutazione 80."],
        ], cb);
      },
      r3(cb) {
        say([
          ["mf_ugo", "Grande notizia! Uno sponsor ti vuole per la pubblicità di uno shampoo. Si chiama «Fango Vivo». Tu esci da una pozzanghera al rallentatore e scuoti i capelli. Paga benissimo.", "fd_stadio"],
        ], () => ask("mf_ugo", "Ugo ha già il copione in mano. Il copione ha una sola battuta: «Fango Vivo. Perché ognuno viene da qualche parte.»", [
          { label: "Accetti e scuoti i capelli", sub: "Fama +8 · monete", fn: () => { S.fama += 8; coins(50); S.f.spot = "si"; save(); say([["voce", "Lo spot va in onda ovunque. A Sterpaglia lo guardano al bar e ridono per una settimana. La Zia Pupa ne compra dieci flaconi «per sostenere il ragazzo». Li usa per lavare il furgone."]], cb); } },
          { label: "Rifiuti", sub: "Onore +1", fn: () => { W("onore", 1); S.f.spot = "no"; save(); say([["mf_ugo", "Rifiuti? Va bene. Lo farà un attaccante del Fiumara. Ha meno capelli, ma più fame. Peccato."]], cb); } },
          { label: "«Solo se lo sponsor è la porchetta della Zia Pupa»", sub: "Fama +4 · Onore +1", fn: () => { S.fama += 4; W("onore", 1); S.f.spot = "pupa"; S.f.pupaTv = 1; save(); say([["voce", "Ugo ti guarda come si guarda un pazzo. Poi telefona. Tre settimane dopo, in prima serata, il furgone della Zia Pupa compare in TV: «Porchetta Pupa. Da Sterpaglia con amore». La fila al furgone arriva fino alla chiesa."], ["mf_pupa", "(al telefono) Mi hai rovinato! Ho dovuto assumere due nipoti! Ti voglio bene, scemo."]], cb); } },
        ]));
      },
      r5(cb) {
        say([
          ["mf_greta", "Devo dirti una cosa e non ti piacerà. Ho i tuoi contratti degli ultimi otto anni. Il dieci per cento di Ugo non era il dieci. Era il trenta. Con metodo, con eleganza. Ogni anno.", "fd_stadio"],
          ["voce", "Lo trovi nella sala d'aspetto del suo ufficio, sotto un quadro con una barca. Non nega niente."],
          ["mf_ugo", "Sì. Ti ho rubato. Con precisione, come si fa con le cose importanti. Ma ascolta dove sono andati, prima di chiamare l'avvocato."],
          ["mf_ugo", "Sghembi stava per vendere il Gino Melma a una catena di supermercati. Il mutuo l'ho pagato io. I debiti della Pozzanghera, anche. Il funerale di Ruggine, i fiori, la lapide: io. Il resto, lo ammetto, è una barca. Si chiama «Dieci per cento». Era una battuta."],
          ["mf_ugo", "Il campo dove hai imparato a cadere è ancora lì, e non è un parcheggio. Adesso decidi tu cosa sono: un ladro o un benefattore. Io, onestamente, non l'ho mai capito."],
        ], () => ask("mf_ugo", "Ugo si siede. Per la prima volta, il telefono non squilla.", [
          { label: "Lo denunci", sub: "Onore +1 · Fama −4", fn: () => { W("onore", 1); S.fama = clamp(S.fama - 4, 0, 100); S.f.ugoFine = "denuncia"; save(); say([["mf_ugo", "Giusto. È giusto. (si alza, si sistema la giacca) Ma il campo resta pagato. Quello non me lo potete togliere. Sarò in buona compagnia: in carcere giocano a calcio tutti i giorni."]], cb); } },
          { label: "Lo perdoni, ma lo licenzi", sub: "Onore +2", fn: () => { W("onore", 2); S.f.ugoFine = "perdono"; save(); say([["mf_ugo", "(lunga pausa) Nessuno mi aveva mai perdonato. Mi avevano solo pagato. È una sensazione strana. Credo di non piacermi molto, adesso. È un buon inizio, no?"], ["voce", "Mesi dopo, a Sterpaglia, arriva un bonifico anonimo per il rifacimento del container-spogliatoio. Nella causale c'è scritto: «Doccia. Una vera.»"]], cb); } },
          { label: "Lo tieni, ma da oggi ti ridà tutto", sub: "Ombra +1 · monete", fn: () => { W("ombra", 1); coins(60); S.f.ugoFine = "tieni"; save(); say([["mf_ugo", "Affare fatto. Sapevo che eri dei nostri. (sorride) Non è un complimento, eh. Ma nel calcio è quasi lo stesso."]], cb); } },
        ]));
      },
      end(pass, pos, cb) {
        if (!pass) return say([["mf_greta", `${pos}° posto. Il titolo di domani è già scritto: «Il fango non basta». Smentiscilo l'anno prossimo.`]], () => cb(false));
        say([
          ["voce", "Sei anni all'Aurelia passano come un'estate: in fretta, con molta luce, e alla fine ti ritrovi con la pelle diversa.", "fd_stadio"],
          ["mf_brando", "Io smetto. Il ginocchio, la testa, un po' tutto. Mi hanno offerto di fare l'osservatore. Guarderò ragazzi di diciassette anni e mi verrà da piangere. Per invidia, eh."],
          ["voce", "<b>Tappa superata.</b> Trentaquattro anni. Una stagione, l'ultima. Bisogna decidere dove."],
        ], () => cb(true));
      },
    },
    5: {
      intro(cb) {
        say([
          ["mf_greta", "Ultima stagione. Lo sanno tutti, anche se nessuno lo dice. L'Aurelia ti offre la Coppa delle Stelle, il girone finale contro i migliori d'Europa. E poi c'è una lettera.", "fd_stadio"],
          ["mf_bava", "(lettera) Caro {n}, la Pozzanghera rischia di chiudere. Sghembi è vecchio, la Pupa pure, io pure (cinquantotto anni, ancora in porta: il medico dice che è un miracolo, io dico che è pigrizia). Se retrocediamo stavolta, non c'è più niente. Non ti chiedo niente. Ti scrivo e basta. Tanto la lettera la consegno io. Tuo, Tonino."],
        ], () => ask("voce", "Trentaquattro anni, un ginocchio che sente la pioggia e due strade.", [
          { label: "🏛️ Resti all'Aurelia: la Coppa delle Stelle", sub: "Le luci più forti · per vincere serve il primo posto", cls: "hot", fn: () => { S.f.t5 = "a"; save(); say([["voce", "<b>Tappa 5 · La Leggenda.</b> Coppa delle Stelle, girone finale. Vinci il girone e chiudi da mito.", "fd_stadio"]], cb); } },
          { label: "🥾 Torni alla Pozzanghera", sub: "Terza Categoria · per salvarla serve chiudere tra le prime due", fn: () => { S.f.t5 = "p"; save(); say([
            ["voce", "Lasci un contratto da milioni per una maglia granata della tua taglia, finalmente. Al Gino Melma, il primo allenamento lo guardano trecento persone. A Sterpaglia ne abitano quattrocento.", "fd_campo"],
            ["mf_pupa", "Sei tornato. Lo sapevo. Il panino te l'ho tenuto in caldo diciassette anni: non offenderti se è un po' secco."],
            ...(S.f.ugoFine === "perdono" ? [["voce", "Il container-spogliatoio è nuovo. La doccia è una doccia vera. Sulla porta, qualcuno ha attaccato un biglietto: «Bussare lo stesso.»"]] : []),
            ["mf_brando", "(scende da una Panda grigia, con una borsa) Ho venduto la macchina rossa, la casa al mare e l'orgoglio. Mi è rimasto il tunnel. Mi prendete?"],
            ["voce", "<b>Tappa 5 · La Leggenda.</b> Terza Categoria, Girone di Sterpaglia. Chiudi tra le prime due e la Pozzanghera è salva."],
          ], cb); } },
        ]));
      },
      r3(cb) {
        if (S.f.t5 === "p") return say([
          ["mf_sghembi", "Ho una cosa per te. (apre un armadietto: dentro, appeso, un cappotto di lana marrone, consumato ai gomiti) Il cappotto di Ruggine. L'ha lasciato qui. Nessuno ha avuto il coraggio di spostarlo.", "fd_campo"],
          ["mf_sghembi", "In tasca c'era un toscano. Spento. Ce l'ho lasciato. Non so perché te lo dico. Forse perché qualcuno deve sapere dov'è."],
        ], () => { S.f.cappotto = 1; save(); cb(); });
        say([
          ["voce", "Ti arriva una lettera scritta a matita, con la calligrafia storta di un ragazzino.", "fd_stadio"],
          ["voce", "«Caro {n}, mi chiamo Mirko, ho quattordici anni e gioco nella Pozzanghera. La Zia Pupa è mia zia. Il campo è in pendenza e la porta a sinistra è più bassa. Mister nessuno, ci allena Tonino. Come si fa a diventare come te? Ciao.»"],
        ], () => ask("voce", "Cosa gli rispondi?", [
          { label: "«Rialzati prima degli altri.»", sub: "Onore +1", fn: () => { W("onore", 1); S.f.mirko = 1; save(); say([["voce", "Scrivi una riga sola, quella di Ruggine. Ti sembra di consegnare qualcosa che non era tuo, ma che dovevi portare avanti. Tonino dirà che Mirko l'ha attaccata sopra il letto."]], cb); } },
          { label: "Gli mandi la tua maglia autografata", sub: "Fama +3", fn: () => { S.fama += 3; S.f.mirko = 2; save(); say([["voce", "Mirko la indossa a ogni partita. Gli arriva alle ginocchia. Gli sta benissimo, ti scrivono."]], cb); } },
        ]));
      },
      r5(cb) {
        if (S.f.t5 === "p") return say([
          ["mf_bava", "È anche la mia ultima partita. Cinquantotto anni. Lunedì consegno la posta come sempre. Ma domenica, se vinciamo, consegno anche un'altra cosa. Non so come si chiama. Tu lo sai?", "fd_campo"],
          ["mf_brando", "Si chiama finire bene, Tonino. Non capita a tutti. A me, per esempio, mai. Domenica, forse."],
        ], cb);
        say([
          ["mf_greta", "La sera prima dell'ultima partita. Ti faccio l'ultima domanda della mia carriera di cronista tua: cosa ti resta?", "fd_stadio"],
          ["voce", "Ci pensi. Settantamila persone, trofei, una pubblicità di shampoo che non riesci a dimenticare. E poi un campo in pendenza, una porta più bassa, un toscano spento."],
          ["mf_greta", "Non serve che rispondi. L'ho già capito. Scriverò un'altra cosa, va bene lo stesso."],
        ], cb);
      },
      end(pass, pos, cb) {
        const pz = S.f.t5 === "p";
        if (!pass) return say([[pz ? "mf_bava" : "mf_greta", pz ? `${pos}° posto. Non basta, ma la Pozzanghera non chiude oggi: Sghembi ha chiesto una deroga, una stagione. Ancora una. Proviamoci.` : `${pos}° posto. La Coppa va a qualcun altro. Ti resta una stagione di contratto, e un'occasione. Rigiocala.`]], () => cb(false));
        S.trofei.push(pz ? "Salvezza della Pozzanghera · Terza Categoria (34 anni)" : "Coppa delle Stelle · Aurelia (34 anni)");
        if (!pz) return say([
          ["voce", "Settantamila persone, la Coppa delle Stelle sopra la testa, i coriandoli dorati che scendono come pioggia di lusso. Il tuo nome, cantato nella rima con «leggenda».", "fd_stadio"],
          ["mf_greta", "(il giornale del lunedì) «Un mito. Ha alzato la coppa, poi ha guardato in alto, verso un punto della tribuna dove non c'era nessuno. Poi ha preso un treno. Regionale. Destinazione Sterpaglia.»"],
          ["voce", "Al Gino Melma, la sera, non c'è nessuno. Ti siedi sulla panchina. La porta a sinistra è ancora più bassa. Resti lì un'ora. Poi la Zia Pupa accende il furgone e ti porta un panino, senza dire niente."],
        ], () => ending("mito"));
        const secret = S.onore >= 6 && S.f.scarpe && S.f.cappotto && S.gol >= 30;
        say([
          ["voce", "Ultima giornata. Gente fin sulle colline, più di quanta il Gino Melma ne abbia mai vista. Le mucche del signor Zeno sono state spostate, per rispetto.", "fd_addio"],
          ["mf_bava", "(dopo il fischio finale, in ginocchio nel fango, coi guanti in mano) Salvi. Siamo salvi. Lunedì la posta arriva in ritardo, sappiatelo tutti."],
          ["mf_pupa", "(piangendo e ridendo nello stesso momento) Panini gratis per tutti! Anche per quelli di Tre Ponti! Oggi sì!"],
          ["mf_brando", "Il Principe di Tre Ponti ha fatto un assist in Terza Categoria e si è commosso. Se lo scrivete, vi denuncio."],
          ["voce", "Lo striscione dice: GRAZIE · DA QUI È PARTITO TUTTO. L'hanno cucito le signore del paese, una lettera a testa. La tua l'hanno lasciata per ultima."],
        ], () => {
          if (!secret) return ending("ritorno");
          ending("ritorno", () => say([
            ["voce", "Una settimana dopo. Il container-spogliatoio, una lavagna nuova appesa storta, quindici ragazzini seduti per terra. Mirko in prima fila, con la maglia che gli arriva alle ginocchia.", "fd_campo"],
            ["voce", "Indossi un cappotto di lana marrone, consumato ai gomiti. In tasca c'è un toscano spento. Ai piedi, un paio di scarpini del '78, cuciti a mano."],
            ["mf_me", "Qui si gioca nel fango. E il fango vi insegna una cosa sola: chi cade e si rialza prima, vince. Il resto… il resto ve lo racconto un'altra volta."],
          ], () => ending("mister")));
        });
      },
    },
  };

  // ---------------------------------------------------------------- integrazione: ospite al Borgo
  function regGuest(n) {
    if (window.__borgoGuests && api() && api().CAST) {
      castAll();
      window.__borgoGuests.add({ id: "mf_bava", saga: TITLE, when: () => { const m = readJ(KEY, null); return !!(m && Array.isArray(m.ends) && m.ends.length); }, lines: [
        "Tonino Bava, portiere della Pozzanghera e postino di Sterpaglia. Ho una lettera per {n}. No, non è di nessuno: l'ho scritta io, stamattina, per avere una scusa per venire al mare.",
        "Al Borgo Marino la gente para coi piedi e cammina con le mani in tasca. Da noi è il contrario. Comunque mi piace: c'è un muro che sembra un portiere.",
        "Se passi da Sterpaglia, la porta a sinistra è ancora più bassa. Non la sistemiamo: è tradizione, e poi costa.",
      ] });
    } else if (n < 80) setTimeout(() => regGuest(n + 1), 250);
  }
  regGuest(0);

  window.__fango = {
    on: () => opt().on !== false, setOn: (v) => { const first = v && !opt().seenOn; optSet({ on: !!v, seenOn: true }); return first; },
    open, menuEntry, castAll,
    info() { const m = readJ(KEY, null) || {}; return { ch: m.tappa ? Math.min(m.tappa, 5) : 0, done: Object.assign({}, m.done || {}), ends: (m.ends || []).slice(), tappa: m.tappa || 0 }; },
    endings() { const m = readJ(KEY, null) || {}, got = m.ends || []; return Object.keys(ENDINGS).map((k) => ({ id: k, title: ENDINGS[k][0], desc: ENDINGS[k][1], hint: ENDINGS[k][2], found: got.includes(k) })); },
    TAPPE, ENDINGS, PEOPLE,
    _dbg: { get S() { return S; }, load, save, hub, after, seasonEnd, startNew, newSeason, ovr, menu, ending, play },
  };
})();
