// js/settimana-molo.js - "Settimana del Molo": un filo unico di punti che lega Gabbia del Molo, Coppa del Molo e Matchday Director.
// Ogni settimana di calendario (lunedì-domenica, fuso locale) è una Settimana del Molo: vittorie e imprese nelle tre modalità danno punti
// (ognuno una volta per settimana, massimo 20 punti per modalità). Un tabellone a soglie (bronzo 10 / argento 24 / oro 40) racconta come va;
// a settimana conclusa (o già all'oro) si sblocca la cerimonia al Faro Vecchio dei Trabucchi: una scena con Spigola, Dina, Arturo, Settimio e Nonna Ferri
// che consegna una coppa coi nomi dei partecipanti. Premi SOLO cosmetici (spille della bacheca) + piccole monete via window.addCoins, una volta per soglia/settimana.
//
// Aggancio ai punti: le tre modalità emettono window.dispatchEvent(new CustomEvent("molo:punti", { detail: { mode, kind, id } })) dove già registrano
// vittorie/titoli/boss/episodi. mode = cage|action|director; kind per modalità:
//   cage: win, boss, title, cup, feat · action: win, title, cup, feat · director: win, star3, season.
// Il listener è registrato subito (non dipende dal Borgo). Il resto (NPC al Faro, voce nel menu) parte solo se esiste window.__borgoApi.
// Salvataggio: "ali-di-rondine.settimana-molo" (tutto additivo, non tocca nessun altro salvataggio).
// Va incluso DOPO game.js e DOPO director-borgo.js / borgo-hub.js (i quali leggono window.__moloSettimana solo al momento dell'uso: l'ordine non è critico).
(function () {
  "use strict";
  if (window.__moloSettimanaLoaded) return;
  window.__moloSettimanaLoaded = true;

  var KEY = "ali-di-rondine.settimana-molo";
  var CAP = 20; // punti massimi che contano per modalità, per settimana
  var TIERS = [
    { k: "bronzo", n: "Bronzo", at: 10, coins: 5, ico: "🥉", col: "#d4915a" },
    { k: "argento", n: "Argento", at: 24, coins: 10, ico: "🥈", col: "#cbd5e1" },
    { k: "oro", n: "Oro", at: 40, coins: 20, ico: "🥇", col: "#fbbf24" },
  ];
  var MODES = [
    { k: "cage", name: "Gabbia del Molo", who: "Don Tullio", ico: "👟", has: function () { return !!window.__cageHd; } },
    { k: "action", name: "Coppa del Molo", who: "Ginetta", ico: "⚽", has: function () { return !!window.__actionHd; } },
    { k: "director", name: "Matchday Director", who: "Spigola e Dina", ico: "📋", has: function () { return !!window.__directorHd; } },
  ];
  var PT = {
    cage: { win: 2, boss: 4, title: 5, cup: 5, feat: 2 },
    action: { win: 2, title: 5, cup: 5, feat: 2 },
    director: { win: 2, star3: 3, season: 5 },
  };
  var KL = { win: ["vittoria", "vittorie"], boss: ["boss", "boss"], title: ["titolo", "titoli"], cup: ["coppa", "coppe"], feat: ["impresa", "imprese"], star3: ["★★★", "★★★"], season: ["trofeo", "trofei"] };
  var PINS = [
    { id: "bandierina", n: "Bandierina del gabbiano", e: "🚩" }, { id: "nastro", n: "Nastro di Dina", e: "🎀" },
    { id: "megafono", n: "Megafono di Nereo", e: "📣" }, { id: "chiave", n: "Chiave del cancello", e: "🔑" },
    { id: "sciarpa", n: "Sciarpa del Molo", e: "🧣" }, { id: "mestolo", n: "Mestolo di Arturo", e: "🥄" },
    { id: "cilindro", n: "Cilindro del Presidente", e: "🎩" }, { id: "acciuga", n: "Acciuga d'argento", e: "🐟" },
    { id: "gomitolo", n: "Gomitolo di Nonna Ferri", e: "🧶" }, { id: "ancora", n: "Ancora in miniatura", e: "⚓" },
    { id: "lanterna", n: "Lanterna del Faro", e: "🔦" }, { id: "medaglia", n: "Medaglia della Rondine", e: "🏅" },
  ];
  var MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  var MESI_L = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  var KEEP_WEEKS = 30, ALBO_N = 12;

  // ---------------------------------------------------------------- date (sempre fuso locale; new Date() così un mock di Date funziona)
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function keyOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function mondayOf(d) { var di = (d.getDay() + 6) % 7; return new Date(d.getFullYear(), d.getMonth(), d.getDate() - di); }
  function parseKey(k) { var p = String(k).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function curKey() { return keyOf(mondayOf(new Date())); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function rangeLabel(k, withYear) {
    var a = parseKey(k), b = addDays(a, 6), y = withYear ? " " + b.getFullYear() : "";
    return a.getMonth() === b.getMonth() ? a.getDate() + "–" + b.getDate() + " " + MESI[b.getMonth()] + y : a.getDate() + " " + MESI[a.getMonth()] + " – " + b.getDate() + " " + MESI[b.getMonth()] + y;
  }
  function weekNo(k) { var m = parseKey(k), th = addDays(m, 3), j = new Date(th.getFullYear(), 0, 1); return Math.floor(Math.round((th - j) / 864e5) / 7) + 1; }
  function daysLeft() { return 6 - ((new Date().getDay() + 6) % 7); }
  function leftLabel() { var n = daysLeft(); return n === 0 ? "ultimo giorno: oggi" : n === 1 ? "ancora 1 giorno" : "ancora " + n + " giorni"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  // ---------------------------------------------------------------- salvataggio
  function load() {
    var o = null;
    try { o = JSON.parse(localStorage.getItem(KEY)); } catch (e) { o = null; }
    if (!o || typeof o !== "object" || Array.isArray(o)) o = {};
    o.v = 1;
    if (!o.weeks || typeof o.weeks !== "object" || Array.isArray(o.weeks)) o.weeks = {};
    if (!Array.isArray(o.cos)) o.cos = [];
    if (!o.coins || typeof o.coins !== "object" || Array.isArray(o.coins)) o.coins = {};
    o.cups = o.cups | 0;
    return o;
  }
  function save(o) {
    try {
      var ks = Object.keys(o.weeks).sort();
      while (ks.length > KEEP_WEEKS) delete o.weeks[ks.shift()];
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) { /* ignora */ }
  }
  function wrec(o, k, mk) {
    var r = o.weeks[k];
    if (!r || typeof r !== "object") { if (!mk) return { pts: { cage: {}, action: {}, director: {} }, cer: 0 }; r = o.weeks[k] = { pts: { cage: {}, action: {}, director: {} }, cer: 0 }; }
    if (!r.pts || typeof r.pts !== "object") r.pts = {};
    MODES.forEach(function (m) { if (!r.pts[m.k] || typeof r.pts[m.k] !== "object") r.pts[m.k] = {}; });
    return r;
  }
  function modePts(r, mk) { var s = 0, p = r.pts[mk] || {}; Object.keys(p).forEach(function (k) { s += p[k] | 0; }); return Math.min(CAP, s); }
  function total(r) { return MODES.reduce(function (s, m) { return s + modePts(r, m.k); }, 0); }
  function tierOf(t) { var n = 0; TIERS.forEach(function (x, i) { if (t >= x.at) n = i + 1; }); return n; }
  function allThree(r) { return MODES.every(function (m) { return modePts(r, m.k) > 0; }); }

  // cerimonie in attesa: settimane concluse (o già all'oro) con almeno il bronzo, non ancora celebrate, entro le ultime 12
  function pendingList(o) {
    var cur = curKey(), oldest = keyOf(addDays(parseKey(cur), -7 * ALBO_N)), out = [];
    Object.keys(o.weeks).sort().forEach(function (k) {
      var r = wrec(o, k, false), t = tierOf(total(r));
      if (t >= 1 && !r.cer && k >= oldest && (k < cur || t >= 3)) out.push(k);
    });
    return out;
  }

  // ---------------------------------------------------------------- punti
  var toastEl = null, toastT = 0;
  function toast(txt) {
    try {
      if (!toastEl) {
        toastEl = document.createElement("div"); toastEl.className = "mol-toast"; toastEl.setAttribute("role", "status"); injectStyle();
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = txt; toastEl.classList.add("on");
      clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("on"); }, 2600);
    } catch (e) { /* ignora */ }
  }
  function point(mode, kind, id) {
    try {
      if (!PT[mode] || !PT[mode][kind]) return 0;
      id = String(id == null ? "" : id).slice(0, 60);
      var o = load(), k = curKey(), r = wrec(o, k, true), key = kind + ":" + id, bag = r.pts[mode];
      if (bag[key] || Object.keys(bag).length >= 80) return 0;
      var before = total(r), bt = tierOf(before), mb = modePts(r, mode);
      bag[key] = PT[mode][kind];
      save(o);
      var after = total(r), gain = after - before;
      if (gain > 0) {
        var m = MODES.filter(function (x) { return x.k === mode; })[0], nt = tierOf(after);
        toast("🏆 Molo +" + gain + " · " + m.name + " · " + after + "/" + TIERS[2].at + (nt > bt ? " · " + TIERS[nt - 1].n + "!" : ""));
      } else if (mb >= CAP) toast("🏆 Settimana del Molo · " + MODES.filter(function (x) { return x.k === mode; })[0].name + " ha già dato il massimo");
      return bag[key];
    } catch (e) { return 0; }
  }
  window.addEventListener("molo:punti", function (ev) { var d = ev && ev.detail; if (d) point(d.mode, d.kind, d.id); });

  // ---------------------------------------------------------------- info per gli accessi (Nereo, Spigola/Dina, menu, Faro)
  function info() {
    var o = load(), k = curKey(), r = wrec(o, k, false), t = total(r), ti = tierOf(t), pend = pendingList(o), pts = {};
    MODES.forEach(function (m) { pts[m.k] = modePts(r, m.k); });
    var sub = pend.length ? "Cerimonia al Faro pronta · " + t + " punti" : t ? t + " punti · " + (ti ? TIERS[ti - 1].n : "verso il bronzo") + " · " + leftLabel() : "Settimana nuova · 0 punti";
    return { wk: k, range: rangeLabel(k), total: t, tier: ti, tierName: ti ? TIERS[ti - 1].n : "", pts: pts, pending: pend.length, canCeremony: pend.length > 0, cups: o.cups, pins: o.cos.length, sub: sub, left: daysLeft() };
  }

  // ---------------------------------------------------------------- battute di Arturo (Radio Molo) nel tabellone
  function leadMode(r) {
    var best = null, bp = 0, tie = false;
    MODES.forEach(function (m) { var p = modePts(r, m.k); if (p > bp) { best = m.k; bp = p; tie = false; } else if (p === bp && p > 0) tie = true; });
    return tie ? null : best;
  }
  var RADIO_LEAD = {
    cage: "La Gabbia ha fatto più rumore di una cassetta del pesce giù per le scale.",
    action: "La Coppa ha preso più vento in faccia che applausi, e li ha incassati comunque.",
    director: "La panchina del Presidente ha deciso molto, quasi sempre con Dina a un metro di distanza.",
  };
  function arturoBoard(r, st) {
    var t = st.total, ti = st.tier, di = (new Date().getDay() + 6) % 7, pick = function (a) { return a[(t + di) % a.length]; }, base, extra = "";
    if (!t) base = pick(["Qui Radio Molo: settimana nuova, tabellone pulito, gabbiano già in vantaggio per presenza.", "Lunedì in diretta dal Molo: zero punti, zero problemi. Il vento deve ancora decidere da che parte stare.", "Tabellone bianco come la schiuma. Dalla cabina garantisco: qualcuno, prima o poi, ci scriverà sopra."]);
    else if (ti === 0) base = pick(["Radio Molo, aggiornamento: " + t + " punti. Per il bronzo ne mancano " + (TIERS[0].at - t) + ": un niente, se c'è vento.", "Siamo a " + t + ". Il bronzo è lì, a " + (TIERS[0].at - t) + " punti, e ci guarda con la pazienza dei muli.", t + " punti e un mestolo acceso: il bronzo ha cominciato a farsi la barba."]);
    else if (ti === 1) base = pick(["Bronzo in tasca a " + t + " punti. L'argento è a " + (TIERS[1].at - t) + ": il Faro ha già lucidato il bicchiere.", "Radio Molo: Bronzo! La Rondine ora guarda l'argento, che da qui luccica a " + (TIERS[1].at - t) + " punti."]);
    else if (ti === 2) base = pick(["Argento a " + t + ". Per l'oro ne servono " + (TIERS[2].at - t) + ". Dina ha già stampato il verbale. In bianco, per scaramanzia.", "Qui Radio Molo, voce rotta: argento! L'oro è a " + (TIERS[2].at - t) + " punti e il gabbiano si è fatto prestare un cravattino."]);
    else base = pick(["ORO! Interrompo la musica. Cioè, la musica non c'era. Interrompo il silenzio.", "Quaranta punti e oltre: Radio Molo lo mette a verbale. E io, di solito, metto a verbale solo il meteo."]);
    var lm = leadMode(r), miss = MODES.filter(function (m) { return modePts(r, m.k) === 0; });
    if (lm && t >= 4) extra = " " + RADIO_LEAD[lm];
    else if (miss.length && t >= 4 && miss.length < 3) extra = " " + miss[0].name + " è ancora a zero: dicono che sia gelosa.";
    if (st.pending) extra += " Al Faro intanto stanno già attaccando le lampadine.";
    return base + extra;
  }

  // ---------------------------------------------------------------- cerimonia al Faro
  var SPK = {
    spigola: { n: "Presidente Spigola", c: "#fcd34d", e: "🎩" }, dina: { n: "Dina Cartella", c: "#c4b5fd", e: "🗂️" },
    arturo: { n: "Arturo · Radio Molo", c: "#7dd3fc", e: "📻" }, settimio: { n: "Settimio", c: "#bef264", e: "🧰" },
    ferri: { n: "Nonna Ferri", c: "#fda4af", e: "🧶" }, voce: { n: "", c: "#94a3b8", e: "🔦" },
  };
  function partNames(r) {
    var a = ["Leo, Mister onorario", "la Rondine"];
    if (modePts(r, "cage") > 0) a.push("Don Tullio");
    if (modePts(r, "action") > 0) a.push("Ginetta");
    if (modePts(r, "director") > 0) a.push("il Presidente Spigola", "Dina");
    return a;
  }
  function joinNames(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " e " + a[a.length - 1]; }
  function ceremonyLines(k, r) {
    var t = total(r), ti = tierOf(t), tn = TIERS[ti - 1].k, lm = leadMode(r), radio = lm ? RADIO_LEAD[lm] : "Tre porte, un solo pallone, mille scuse.", names = joinNames(partNames(r)).replace(/^./, function (c) { return c; });
    var tierLine = ti === 1 ? "«Bronzo: il metallo dei marinai, delle maniglie e dei buoni inizi. Nessuno ha mai retto un porto con l'oro. Col bronzo sì.»"
      : ti === 2 ? "«Argento: luccica quando c'è luce e, quando non c'è, luccica lo stesso per riflesso. Come noi.»"
        : "«Oro! Dina, la cassaforte. ...No, il barattolo. No, la cassaforte. Va bene il barattolo, ma con rispetto.»";
    var rg = rangeLabel(k, true), pts = t + " punti (" + tn + ")";
    var V = [
      [
        ["voce", "Domenica sera, in cima al Faro Vecchio dei Trabucchi. La lampada non gira più da anni, ma stasera qualcuno ha attaccato delle lampadine con lo scotch e i gradini sono pieni di sedie prese in prestito."],
        ["spigola", "«Signore, signori, gabbiani! La Settimana del Molo (" + rg + ") si chiude con " + pts + ". Leo, Mister onorario della Rondine, venga avanti. Mi hanno detto che applaudire è obbligatorio, ma io l'avrei fatto lo stesso.»"],
        ["dina", "«Verbale in tre copie: una per l'archivio, una per il Presidente, una per il gabbiano. Non chiedete perché il gabbiano. Ha firmato.»"],
        ["arturo", "«Qui Arturo, Radio Molo, in diretta da un faro che non fa più luce ma ha ancora un'eco notevole. " + radio + "»"],
        ["settimio", "«La coppa l'ho lucidata con lo straccio buono, quello che uso dal '62. Se ha un graffio, è la salsedine. Se ne ha due, è Arturo.»"],
        ["spigola", tierLine],
        ["ferri", "«Da ragazza il Molo era il posto dove si aspettava qualcuno che tornava. Adesso c'è chi gioca e chi aspetta con un cartoccio in mano. Mi sembra un bel passo avanti. Siediti, Leo, che ti metto la coperta: lassù tira vento.»"],
        ["spigola", "«Sulla coppa abbiamo fatto incidere i nomi: " + names + ". L'incisore ha chiesto se «la Rondine» volesse l'apostrofo. Ho detto di no. Poi di sì. Poi ha smesso di chiedere.»"],
        ["voce", "La coppa va sul davanzale del Faro, dove il vento la lucida meglio di Settimio. Dina chiude il verbale, Arturo spegne il mestolo. Il Molo, per una sera, sta fermo."],
      ],
      [
        ["voce", "Il Faro Vecchio ha le finestre aperte e un buffet di focaccia sul tavolo dei cavi. Qualcuno ha scritto «Settimana del Molo» su un lenzuolo, in stampatello, tranne la M."],
        ["arturo", "«Radio Molo, edizione straordinaria! Ho il microfono, ho il mestolo e ho un annuncio: la Rondine chiude la settimana (" + rg + ") a " + pts + ". " + radio + "»"],
        ["spigola", "«Ho preparato un discorso. Dina lo ha ridotto da dodici pagine a una riga. La riga è: grazie. Ma io la dico con più pause.»"],
        ["dina", "«Le pause le ho tagliate. Le ho riattaccate in fondo, per non offendere nessuno.»"],
        ["settimio", "«Io, in tanti anni di campo, ho visto passare molte settimane. Poche se le sono meritate. Questa sì: è l'unica che mi ha lasciato l'erba pulita.»"],
        ["spigola", tierLine],
        ["ferri", "«Non amo i discorsi, amo le focacce. Questo però l'ho ascoltato tutto. Si capisce quando una squadra si vuole bene: litiga sulle virgole.»"],
        ["spigola", "«Incisione sulla coppa: " + names + ". Abbiamo lasciato spazio per il gabbiano. Non ha firmato, ma ha lasciato un'impronta. Sul verbale.»"],
        ["voce", "Si brinda con l'aranciata nei bicchieri di carta. Qualcuno canta, qualcuno sposta una sedia. Il mare, giù in fondo, fa il suo lavoro. Il vostro, per stasera, è finito."],
      ],
      [
        ["voce", "Alle nove salta la corrente del Faro Vecchio: capita una volta l'anno, di solito nel momento peggiore. Dina accende una torcia. Spigola ne accende due e le tiene a distanza."],
        ["dina", "«Nessun problema: ho una candela di scorta. Ho anche un verbale di scorta. Ho tutto, tranne la corrente.»"],
        ["arturo", "«Qui Radio Molo, in diretta dal buio! Se mi sentite, battete un colpo sul davanzale. ...Grazie. " + radio + "»"],
        ["settimio", "«Un blackout, un pezzo di campo e una coppa: nel '62 era uguale. Cambia solo che stasera la coppa c'è.»"],
        ["spigola", "«Alla luce delle torce: la Settimana del Molo (" + rg + ") si chiude a " + pts + ". " + tierLine.replace(/^«/, "").replace(/»$/, "") + "»"],
        ["ferri", "«Quando si spegne la luce la gente smette di guardare le cose e comincia a guardarsi. Mi piace. Lo dico adesso, che non mi vedete arrossire.»"],
        ["dina", "«La luce è tornata. Abbiamo applaudito al buio, alla cieca: per Settimio è il più bell'applauso che il Faro abbia mai sentito. Per Arturo, l'unico.»"],
        ["spigola", "«Nomi sulla coppa: " + names + ". Li hanno incisi a lume di torcia, quindi uno è venuto un po' storto. Lo si ama di più.»"],
        ["voce", "La coppa resta sul davanzale e la lampada del Faro, per un secondo, sembra girare. È solo Settimio che passa con la torcia. Ma per un secondo..."],
      ],
      [
        ["voce", "Sulla scala del Faro Vecchio c'è una fila ordinata: chi è arrivato per primo, chi per ultimo e chi è arrivato per il fritto. Il fritto, comunque, è il gruppo più numeroso."],
        ["dina", "«Ho l'elenco di chi ha contribuito. Il Presidente ha chiesto di metterlo in ordine d'importanza. L'ho messo in ordine alfabetico. Nessuno si è offeso, tranne l'alfabeto.»"],
        ["spigola", "«La Settimana del Molo (" + rg + ") ha dato " + pts + ". Come abbia fatto la Rondine, non lo so. Come l'abbia fatto con questa società, ancora meno.»"],
        ["arturo", "«Radio Molo, in chiusura di settimana. " + radio + " Il resto lo racconto al gabbiano, che almeno non interrompe.»"],
        ["settimio", "«Qualcuno ha lasciato un pallone sul gradino più alto. Non è mio. Ma lo lascio lì: ha l'aria di uno che aspetta una partita.»"],
        ["spigola", tierLine],
        ["ferri", "«Una squadra non si fa coi campioni: si fa con chi ti tiene la porta aperta. Voi me l'avete tenuta quando avevo le borse della spesa. Non l'ho dimenticato.»"],
        ["spigola", "«Coppa incisa: " + names + ". In fondo, in piccolo: «Il Molo ringrazia». L'ha scritto Dina. Io ho solo pagato l'incisore, in acciughe.»"],
        ["voce", "Le lampadine si spengono una alla volta, come in un saluto. Resta il mare, la coppa sul davanzale e una sedia in più, prestata, che nessuno ha voglia di restituire."],
      ],
    ];
    return V[hash(k) % V.length].map(function (l) { return { w: SPK[l[0]] || SPK.voce, v: l[0] === "voce", t: l[1] }; });
  }

  // premi: monete una volta per soglia/settimana (flag salvato PRIMA di chiamare addCoins), spille cosmetiche una per soglia + una per la "tripletta"
  function nextPin(o) { for (var i = 0; i < PINS.length; i++) if (o.cos.indexOf(PINS[i].id) < 0) return PINS[i]; return null; }
  function claim(k) {
    var o = load(), r = wrec(o, k, false), ti = tierOf(total(r)), res = { tier: ti, coins: 0, pins: [], already: false };
    if (!o.weeks[k] || ti < 1) return res;
    res.already = !!r.cer;
    var gives = [];
    TIERS.forEach(function (T, i) { if (i < ti) gives.push({ key: k + "|" + T.k, coins: T.coins }); });
    gives.forEach(function (g) {
      if (o.coins[g.key]) return;
      if (typeof window.addCoins !== "function") return; // niente monete senza il gioco: riproverà alla prossima apertura
      o.coins[g.key] = 1; save(o);
      try { window.addCoins(g.coins); res.coins += g.coins; } catch (e) { /* ignora */ }
    });
    var pinKeys = [];
    for (var i = 0; i < ti; i++) pinKeys.push(k + "|pin|" + TIERS[i].k);
    if (allThree(r)) pinKeys.push(k + "|pin|tre");
    pinKeys.forEach(function (pk) { if (o.coins[pk]) return; o.coins[pk] = 1; var p = nextPin(o); if (p) { o.cos.push(p.id); res.pins.push(p); } });
    if (!r.cer) { r.cer = 1; o.cups = (o.cups | 0) + 1; }
    save(o);
    return res;
  }

  function cupSvg(ti) {
    var c = TIERS[Math.max(0, Math.min(2, ti - 1))].col, d = ti >= 3 ? "#b45309" : ti === 2 ? "#64748b" : "#7c4a21";
    return '<svg viewBox="0 0 120 130" width="92" height="100" role="img" aria-label="Coppa della Settimana del Molo" focusable="false">' +
      '<path d="M26 26c-18 0-20 30 6 38M94 26c18 0 20 30-6 38" fill="none" stroke="' + c + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M28 14h64v26c0 24-14 38-32 38S28 64 28 40z" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M40 22v22c0 12 6 22 14 26" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="54" y="78" width="12" height="18" fill="' + c + '" stroke="' + d + '" stroke-width="2"/>' +
      '<path d="M36 100h48l6 14H30z" fill="' + c + '" stroke="' + d + '" stroke-width="3"/>' +
      '<path d="M60 22l5 10 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#fff" fill-opacity=".85"/></svg>';
  }

  // ---------------------------------------------------------------- stile
  var styleOn = false;
  function injectStyle() {
    if (styleOn) return; styleOn = true;
    var st = document.createElement("style");
    st.textContent = [
      ".mol-root{position:fixed;left:0;top:0;right:0;bottom:0;z-index:1000000;display:flex;flex-direction:column;background:linear-gradient(180deg,#07142b,#0b2447 55%,#10305a);color:#e8f1ff;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.35;overflow:hidden;-webkit-tap-highlight-color:transparent}",
      ".mol-root *{box-sizing:border-box;min-width:0}",
      ".mol-top{flex:none;display:flex;gap:10px;align-items:center;padding:calc(10px + env(safe-area-inset-top,0px)) 16px 10px;border-bottom:1px solid rgba(255,255,255,.12)}",
      ".mol-top>div{flex:1}.mol-top h1{margin:0;padding:0;font:800 18px/1.15 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#fff;background:none;-webkit-text-fill-color:#fff;text-shadow:none;letter-spacing:0;text-transform:none;overflow-wrap:anywhere}",
      ".mol-sub{margin:2px 0 0;font-size:12px;color:#9db4d6;overflow-wrap:anywhere}",
      ".mol-x{flex:none;width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.08);color:#fff;font-size:18px;cursor:pointer}",
      ".mol-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 16px calc(24px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch}",
      ".mol-card{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);border-radius:14px;padding:12px}",
      ".mol-card h2{margin:0 0 6px;font:700 14px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#fde68a;background:none;-webkit-text-fill-color:#fde68a;text-shadow:none;letter-spacing:0;text-transform:none}",
      ".mol-score{display:flex;align-items:center;gap:12px}",
      ".mol-big{font-size:42px;font-weight:800;line-height:1;color:#fde68a}.mol-big small{font-size:15px;color:#9db4d6;font-weight:600}",
      ".mol-tiers{display:flex;gap:6px;font-size:22px}.mol-tiers span{opacity:.25;filter:grayscale(1)}.mol-tiers span.on{opacity:1;filter:none}",
      ".mol-bar{position:relative;height:12px;border-radius:7px;background:rgba(255,255,255,.14);margin:12px 0 4px;overflow:visible}",
      ".mol-bar i{display:block;height:100%;border-radius:7px;background:linear-gradient(90deg,#38bdf8,#fbbf24)}",
      ".mol-bar b{position:absolute;top:-3px;width:2px;height:18px;background:rgba(255,255,255,.55)}",
      ".mol-marks{position:relative;height:16px;font-size:11px;color:#9db4d6}.mol-marks span{position:absolute;transform:translateX(-50%);white-space:nowrap}",
      ".mol-mode{display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid rgba(255,255,255,.1)}.mol-mode:first-of-type{border-top:0}",
      ".mol-mode>b{flex:none;font-size:22px}.mol-mode>div{flex:1}.mol-mode strong{display:flex;justify-content:space-between;gap:8px}",
      ".mol-mode .mol-bar{height:7px;margin:5px 0 3px}.mol-mode small{display:block;color:#9db4d6;font-size:12px;overflow-wrap:anywhere}",
      ".mol-radio p{margin:0;font-style:italic;overflow-wrap:anywhere}.mol-radio b{color:#7dd3fc}",
      ".mol-goal{display:flex;gap:8px;align-items:flex-start;padding:5px 0;overflow-wrap:anywhere}.mol-goal em{font-style:normal;flex:none;width:22px;text-align:center}.mol-goal.ok{color:#bbf7d0}.mol-goal small{display:block;color:#9db4d6}",
      ".mol-btns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}",
      ".mol-btn{min-height:48px;padding:8px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.1);color:#fff;font:inherit;font-weight:700;text-align:center;cursor:pointer;overflow-wrap:anywhere}",
      ".mol-btn small{display:block;font-weight:500;font-size:11px;color:#c7d7ef;margin-top:2px}",
      ".mol-btn.hot{background:linear-gradient(180deg,#f59e0b,#d97706);border-color:#fbbf24;color:#1a1202}.mol-btn.hot small{color:#3b2a05}",
      ".mol-btn.full{grid-column:1/-1}.mol-btn[disabled]{opacity:.45;cursor:default}",
      ".mol-row{padding:8px 0;border-top:1px solid rgba(255,255,255,.1);overflow-wrap:anywhere}.mol-row:first-of-type{border-top:0}.mol-row small{display:block;color:#9db4d6;font-size:12px}",
      ".mol-pins{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.mol-pin{padding:10px 6px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.13);text-align:center;font-size:12px;overflow-wrap:anywhere}.mol-pin b{display:block;font-size:26px;line-height:1.2}.mol-pin.lock{opacity:.4}",
      ".mol-who{display:flex;align-items:center;gap:10px;margin-bottom:8px}.mol-av{flex:none;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(255,255,255,.1);border:2px solid}",
      ".mol-say{font-size:15.5px;overflow-wrap:anywhere}.mol-say.v{font-style:italic;color:#cbd5e1}",
      ".mol-dots{text-align:center;letter-spacing:3px;font-size:11px;color:#64748b}.mol-dots b{color:#fde68a}",
      ".mol-cup{text-align:center}.mol-cup svg{max-width:100%}.mol-plate{margin:6px auto 0;padding:8px 10px;border-radius:10px;background:rgba(0,0,0,.28);border:1px solid rgba(251,191,36,.45);font-size:12.5px;overflow-wrap:anywhere}.mol-plate b{display:block;color:#fde68a;letter-spacing:.5px}",
      ".mol-toast{position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top,0px));transform:translate(-50%,-140%);max-width:calc(100vw - 32px);z-index:1000001;padding:8px 14px;border-radius:12px;background:#0b2447;border:1px solid #fbbf24;color:#fde68a;font:600 13px system-ui,sans-serif;text-align:center;pointer-events:none;transition:transform .25s}.mol-toast.on{transform:translate(-50%,0)}",
    ].join("\n");
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- interfaccia (overlay)
  var root = null, onExit = null, view = "board", cer = null, keyH = null;
  function modeSummary(r, mk) {
    var p = r.pts[mk] || {}, by = {}, n = 0;
    Object.keys(p).forEach(function (k) { var kind = k.split(":")[0]; by[kind] = (by[kind] || 0) + 1; n++; });
    var parts = Object.keys(by).map(function (kd) { var l = KL[kd] || [kd, kd]; return by[kd] + " " + l[by[kd] === 1 ? 0 : 1]; });
    return parts.length ? parts.join(" · ") : "ancora niente";
  }
  function bar(v, max) { return '<div class="mol-bar"><i style="width:' + Math.max(0, Math.min(100, (v / max) * 100)) + '%"></i></div>'; }

  function viewBoard() {
    var o = load(), k = curKey(), r = wrec(o, k, false), st = info(), t = st.total, max = TIERS[2].at, pend = pendingList(o);
    var tiers = TIERS.map(function (T, i) { return '<span class="' + (st.tier > i ? "on" : "") + '" title="' + T.n + '">' + T.ico + "</span>"; }).join("");
    var marks = TIERS.map(function (T) { return '<b style="left:' + (T.at / max) * 100 + '%"></b>'; }).join("");
    var mk = TIERS.map(function (T, i) { return '<span style="left:' + Math.min(94, Math.max(6, (T.at / max) * 100)) + '%">' + T.at + "</span>"; }).join("");
    var modes = MODES.map(function (m) {
      var p = modePts(r, m.k);
      return '<div class="mol-mode"><b>' + m.ico + '</b><div><strong><span>' + esc(m.name) + "</span><span>" + p + "/" + CAP + "</span></strong>" + bar(p, CAP) + "<small>" + esc(modeSummary(r, m.k)) + (m.has() ? "" : " · non disponibile ora") + "</small></div></div>";
    }).join("");
    var goals = TIERS.map(function (T) {
      var ok = t >= T.at;
      return '<div class="mol-goal ' + (ok ? "ok" : "") + '"><em>' + (ok ? "✓" : T.ico) + "</em><span>" + T.n + " · " + T.at + " punti<small>Cerimonia: " + T.coins + " monete + una spilla</small></span></div>";
    }).join("") + '<div class="mol-goal ' + (allThree(r) ? "ok" : "") + '"><em>' + (allThree(r) ? "✓" : "🚪") + "</em><span>Tre porte aperte<small>Almeno un punto in tutte e tre le modalità: una spilla in più</small></span></div>";
    var cerSub = pend.length ? (pend.length > 1 ? pend.length + " in attesa" : rangeLabel(pend[0])) : "Dal lunedì, o subito con l'oro (serve il bronzo)";
    return '<div class="mol-card"><div class="mol-score"><div class="mol-big">' + t + "<small> / " + max + '</small></div><div class="mol-tiers">' + tiers + "</div></div>" +
      '<div class="mol-bar"><i style="width:' + Math.min(100, (t / max) * 100) + '%"></i>' + marks + '</div><div class="mol-marks">' + mk + "</div>" +
      '<div style="font-size:12px;color:#9db4d6;margin-top:2px">Ogni impresa vale una volta a settimana · massimo ' + CAP + " punti per modalità</div></div>" +
      '<div class="mol-card"><h2>Punti per modalità</h2>' + modes + "</div>" +
      '<div class="mol-card mol-radio"><b>📻 Arturo · Radio Molo</b><p>«' + esc(arturoBoard(r, st)) + "»</p></div>" +
      '<div class="mol-card"><h2>Obiettivi della settimana</h2>' + goals + "</div>" +
      '<div class="mol-btns"><button class="mol-btn ' + (pend.length ? "hot" : "") + '" data-a="cer" ' + (pend.length ? "" : "disabled") + ">🔦 Cerimonia al Faro<small>" + esc(cerSub) + '</small></button><button class="mol-btn" data-a="albo">📜 Albo d\'oro<small>' + o.cups + (o.cups === 1 ? " coppa" : " coppe") + '</small></button>' +
      '<button class="mol-btn" data-a="pins">📌 Bacheca spille<small>' + o.cos.length + "/" + PINS.length + '</small></button><button class="mol-btn" data-a="close">Chiudi</button></div>';
  }
  function viewAlbo() {
    var o = load(), cur = curKey(), ks = Object.keys(o.weeks).sort().reverse().filter(function (k) { return k < cur && (total(wrec(o, k, false)) > 0); }).slice(0, ALBO_N);
    var rows = ks.map(function (k) {
      var r = wrec(o, k, false), t = total(r), ti = tierOf(t), med = TIERS.slice(0, ti).map(function (T) { return T.ico; }).join("");
      return '<div class="mol-row"><b>' + esc(rangeLabel(k, true)) + "</b> · " + t + " pt " + (med || "") + (r.cer ? " 🏆" : ti ? " · cerimonia da vivere" : "") + "<small>Gabbia " + modePts(r, "cage") + " · Coppa " + modePts(r, "action") + " · Director " + modePts(r, "director") + (r.cer ? " · " + esc(joinNames(partNames(r))) : "") + "</small></div>";
    }).join("");
    return '<div class="mol-card"><h2>Ultime ' + ALBO_N + " settimane</h2>" + (rows || '<div class="mol-row">Ancora nessuna settimana conclusa. Il primo nome sulla coppa è ancora da incidere.</div>') + "</div>" +
      '<div class="mol-btns"><button class="mol-btn full" data-a="board">◂ Tabellone</button></div>';
  }
  function viewPins() {
    var o = load();
    return '<div class="mol-card"><h2>Bacheca spille · ' + o.cos.length + "/" + PINS.length + '</h2><div class="mol-pins">' + PINS.map(function (p) {
      var has = o.cos.indexOf(p.id) >= 0;
      return '<div class="mol-pin ' + (has ? "" : "lock") + '"><b>' + (has ? p.e : "🔒") + "</b>" + (has ? esc(p.n) : "???") + "</div>";
    }).join("") + '</div></div><div style="font-size:12px;color:#9db4d6">Le spille sono solo da vedere: arrivano dalle cerimonie al Faro, una per soglia raggiunta.</div><div class="mol-btns"><button class="mol-btn full" data-a="board">◂ Tabellone</button></div>';
  }
  function viewCer() {
    if (!cer) return viewBoard();
    var L = cer.lines, i = cer.i, o = load();
    if (i < L.length) {
      var l = L[i], dots = L.map(function (_, j) { return j === i ? "<b>●</b>" : "●"; }).join(" ");
      return '<div class="mol-card"><div class="mol-who"><div class="mol-av" style="border-color:' + l.w.c + '">' + l.w.e + "</div><div><b style=\"color:" + l.w.c + '">' + esc(l.w.n || "Il Faro Vecchio") + '</b><div class="mol-sub">' + esc(rangeLabel(cer.k, true)) + '</div></div></div><p class="mol-say ' + (l.v ? "v" : "") + '">' + esc(l.t) + '</p></div><div class="mol-dots">' + dots + "</div>" +
        '<div class="mol-btns"><button class="mol-btn" data-a="prev" ' + (i ? "" : "disabled") + '>◂ Indietro</button><button class="mol-btn hot" data-a="next">' + (i === L.length - 1 ? "La coppa" : "Avanti") + '</button><button class="mol-btn full" data-a="board">Esci dalla cerimonia</button></div>';
    }
    var res = cer.res, r = wrec(o, cer.k, false), ti = tierOf(total(r)), names = joinNames(partNames(r));
    var rew = [];
    if (res.coins) rew.push("🪙 +" + res.coins + " monete");
    res.pins.forEach(function (p) { rew.push(p.e + " Spilla: " + p.n); });
    if (!rew.length) rew.push("Premi di questa settimana già ritirati.");
    return '<div class="mol-card mol-cup">' + cupSvg(ti) + '<div class="mol-plate"><b>SETTIMANA DEL MOLO · ' + esc(rangeLabel(cer.k, true).toUpperCase()) + "</b>" + esc(names) + "<br>" + total(r) + " punti · " + TIERS[ti - 1].n + '</div></div><div class="mol-card"><h2>Premi della serata</h2>' +
      rew.map(function (x) { return '<div class="mol-row">' + esc(x) + "</div>"; }).join("") + '<small style="color:#9db4d6">Solo cosmetici e qualche moneta: la coppa pesa più del suo valore.</small></div>' +
      '<div class="mol-btns"><button class="mol-btn" data-a="albo">📜 Albo d\'oro</button><button class="mol-btn hot" data-a="board">Tabellone</button><button class="mol-btn full" data-a="close">Chiudi</button></div>';
  }
  function titleOf() {
    return view === "albo" ? ["Albo d'oro", "Le ultime " + ALBO_N + " settimane"] : view === "pins" ? ["Bacheca spille", "Solo cosmetici"] : view === "cer" ? ["Cerimonia al Faro", "Faro Vecchio · Trabucchi"] : ["Settimana del Molo", rangeLabel(curKey()) + " · n. " + weekNo(curKey()) + " · " + leftLabel()];
  }
  function render() {
    if (!root) return;
    var t = titleOf(), body = view === "albo" ? viewAlbo() : view === "pins" ? viewPins() : view === "cer" ? viewCer() : viewBoard();
    root.innerHTML = '<div class="mol-top"><div><h1>' + esc(t[0]) + '</h1><p class="mol-sub">' + esc(t[1]) + '</p></div><button class="mol-x" data-a="close" aria-label="Chiudi">✕</button></div><div class="mol-body">' + body + "</div>";
    var b = root.querySelector(".mol-body"); if (b) b.scrollTop = 0;
  }
  function act(a) {
    if (a === "close") return close();
    if (a === "board") { view = "board"; cer = null; return render(); }
    if (a === "albo") { view = "albo"; cer = null; return render(); }
    if (a === "pins") { view = "pins"; return render(); }
    if (a === "cer") return startCer();
    if (a === "prev" && cer && cer.i > 0) { cer.i--; return render(); }
    if (a === "next" && cer) {
      cer.i++;
      if (cer.i >= cer.lines.length && !cer.res) cer.res = claim(cer.k); // i premi si ritirano solo arrivando alla coppa
      return render();
    }
  }
  function startCer(k) {
    var o = load(), p = pendingList(o);
    k = k || p[p.length - 1]; // la più recente
    if (!k) { view = "board"; return render(); }
    cer = { k: k, i: 0, lines: ceremonyLines(k, wrec(o, k, false)), res: null }; view = "cer"; render();
  }
  function close() {
    if (!root) return;
    try { document.removeEventListener("keydown", keyH, true); } catch (e) { /* ignora */ }
    root.remove(); root = null; cer = null;
    var f = onExit; onExit = null;
    if (typeof f === "function") { try { f(); } catch (e) { /* ignora */ } }
  }
  function open(o) {
    o = o || {};
    if (root) return;
    injectStyle();
    if (toastEl) toastEl.classList.remove("on");
    onExit = o.onExit || null; view = "board"; cer = null;
    root = document.createElement("div"); root.className = "mol-root"; root.id = "moloSettimana"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Settimana del Molo");
    document.body.appendChild(root);
    root.addEventListener("click", function (e) { var t = e.target && e.target.closest ? e.target.closest("[data-a]") : null; if (t && !t.disabled) act(t.getAttribute("data-a")); });
    keyH = function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    document.addEventListener("keydown", keyH, true);
    if (o.view === "ceremony") startCer(); else if (o.view === "albo") { view = "albo"; render(); } else render();
  }

  window.__moloSettimana = {
    version: 1, open: open, close: close, info: info, point: point,
    ceremonyReady: function () { return pendingList(load()).length; },
  };
  if (/[?&]debug\b/.test(location.search || "")) window.__moloSettimana._dbg = { load: load, save: save, curKey: curKey, claim: claim, KEY: KEY };

  // ---------------------------------------------------------------- aggancio al Borgo: Ottone al Faro Vecchio + voce nel menu
  var ID = "ottone_faro", tries = 0;
  var FARO_SPOT = [28, 7]; // accanto alla porta del Faro Vecchio (porta a [26,6], che resta libera): tile "." raggiungibile, verificato con BFS

  function initBorgo() {
    var api = window.__borgoApi;
    if (!api) { if (++tries < 160) setTimeout(initBorgo, 200); return; }
    if (!api.TRZ.trabucchi && tries++ < 60) { setTimeout(initBorgo, 200); return; }
    var TRZ = api.TRZ, CAST = api.CAST, MN = api.MN_BORGO_BTN, L = api.L, zone = TRZ.trabucchi;

    CAST[ID] = CAST[ID] || { name: "Ottone il Fanalista", tag: "gray", hair: "#e5e7eb", style: "buzz", skin: "#d9a57a", eye: "#1f2937", bg: ["#334155", "#fde68a"], beard: true, cap: "#334155", shirt: "#475569" };
    if (zone) {
      zone.npcs = zone.npcs || [];
      if (!zone.npcs.some(function (n) { return n.id === ID; })) zone.npcs.push({ id: ID, at: FARO_SPOT.slice() });
    }

    function go(v) { open({ view: v, onExit: api.trResume }); }
    var MKEY = "ali-di-rondine.settimana-molo-npc";
    function mem() { try { var o = JSON.parse(localStorage.getItem(MKEY) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
    function memSet(o) { try { localStorage.setItem(MKEY, JSON.stringify(o)); } catch (e) { /* ignora */ } }
    var CHAT = [
      "Facevo il fanalista quando il Faro girava. Adesso il Faro non gira più e io, per solidarietà, nemmeno. Però tengo la scala in ordine: non si sa mai chi sale.",
      "Il segreto di una buona luce è che non fa rumore. Il segreto di una buona festa è l'opposto. Qui, una volta a settimana, ci proviamo con tutte e due.",
      "Questa settimana ho contato i gradini tre volte. Sono venuti uguali, ma in tre modi diversi. Per questo mi fido dei numeri solo quando c'è Dina.",
      "La coppa sta sul davanzale perché il vento le passa lo straccio meglio di chiunque. Settimio non è d'accordo. Settimio non è mai d'accordo col vento.",
    ];
    function head() {
      var s = info(), m = mem();
      if (!m.met) return "«Ottone, fanalista a riposo. Questo è il Faro Vecchio: non fa più luce, ma ha ancora il tabellone. Ogni settimana si segnano i punti della Gabbia, della Coppa e della panchina del Presidente. Se arriviamo alla soglia, si fa festa. Con la coppa. E con le sedie, prese in prestito.»";
      if (s.pending) return "«Leo! Il Faro è pronto: lampadine attaccate, sedie in fila, Settimio con lo straccio in mano. Manca solo il festeggiato.»";
      if (s.total === 0) return "«Settimana nuova, tabellone pulito. Io intanto spolvero il gradino più alto.»";
      return "«Siamo a " + s.total + " punti, " + (s.tier ? "soglia " + s.tierName.toLowerCase() + " raggiunta" : "il bronzo è a " + (TIERS[0].at - s.total) + " punti") + ". " + leftLabel().replace(/^./, function (c) { return c.toUpperCase(); }) + ". Il resto lo fa il vento.»";
    }
    function menu() {
      var s = info(), m = mem(); m.met = 1; memSet(m);
      var o = [{ label: "Il tabellone della settimana", sub: s.total + " punti · " + (s.tierName || "verso il bronzo"), cls: s.pending ? "" : "hot", fn: function () { go("board"); } }];
      if (s.pending) o.push({ label: "Cerimonia al Faro", sub: s.pending > 1 ? s.pending + " in attesa" : "La coppa ti aspetta", cls: "hot", fn: function () { go("ceremony"); } });
      o.push({ label: "Albo d'oro", sub: "Le ultime " + ALBO_N + " settimane", fn: function () { go("albo"); } });
      o.push({ label: "Quattro chiacchiere", sub: "Fari, gradini e lampadine", fn: function () { var mm = mem(), n = mm.c | 0; mm.c = n + 1; memSet(mm); api.trSay([L(ID, CHAT[n % CHAT.length])], menu); } });
      api.trAsk(ID, head(), o);
    }

    // hook concatenato: gestisce SOLO il proprio id, non chiama mai il getter dentro la funzione assegnata
    var desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    var chained = !(desc && desc.set); // con un accessor (cage-borgo.js) la catena la fa il setter
    var prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      if (id === ID) { menu(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };

    if (Array.isArray(MN) && !MN.some(function (f) { return f && f.__molo; })) {
      var f = function () {
        var s = info();
        return { label: "🏆 Settimana del Molo", sub: s.sub, cls: s.pending ? "hot" : "", fn: function () { open({ view: s.pending ? "ceremony" : "board", onExit: api.trResume }); } }; // il menu del Borgo si svuota al tocco: si torna a camminare nel Borgo
      };
      f.__molo = 1; MN.push(f);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBorgo); else initBorgo();
})();
