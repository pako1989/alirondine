// js/director-borgo.js - Aggancio di "Matchday Director" al Borgo camminabile: la sede del Rondine FC ai Trabucchi
// Il Presidente Spigola e Dina Cartella (segretaria della società) aspettano in panchina, accanto al campo dei Trabucchi:
// da qui si apre la modalità (stagioni, episodi, spogliatoio). Carica solo se esistono window.__borgoApi e window.__directorHd.
// Va incluso DOPO game.js, match-director-hd.js, borgo-expansions.js (anche dopo cage-borgo.js e action-borgo.js).
// Catena trTalkHook: la funzione assegnata gestisce SOLO i propri id e ritorna false per gli altri;
// il precedente hook viene chiamato solo se non esiste un accessor (setter) che concatena già (cage-borgo.js).
(function () {
  "use strict";
  if (window.__directorBorgoLoaded) return;
  window.__directorBorgoLoaded = true;
  var tries = 0;

  var PRES = "presidente_spigola", DINA = "dina_cartella";
  var KEY = "ali-di-rondine.director-borgo"; // solo memoria narrativa dell'NPC (nessun bonus, nessuna moneta)

  function mem() { try { var o = JSON.parse(localStorage.getItem(KEY) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignora */ } }

  function init() {
    var api = window.__borgoApi, dir = window.__directorHd;
    if (!api || !dir || typeof dir.start !== "function") { if (++tries < 160) setTimeout(init, 200); return; }
    // aspetta i Trabucchi (definiti da borgo-expansions.js); dopo un po' ripiega sui Caruggi
    if (!api.TRZ.trabucchi && tries++ < 40) { setTimeout(init, 200); return; }
    var TRZ = api.TRZ, CAST = api.CAST, MN = api.MN_BORGO_BTN, L = api.L;
    var zoneId = TRZ.trabucchi ? "trabucchi" : (TRZ.caruggi ? "caruggi" : null);
    var zone = zoneId ? TRZ[zoneId] : null;

    // ---------------------------------------------------------------- personaggi
    CAST[PRES] = CAST[PRES] || { name: "Commendator Spigola", tag: "gray", hair: "#d8d8d8", style: "slick", skin: "#e9be95", eye: "#2a2a2a", bg: ["#7c2d12", "#fcd34d"], glasses: true, shirt: "#7c2d12" };
    CAST[DINA] = CAST[DINA] || { name: "Dina Cartella", tag: "gold", hair: "#4a2c2a", style: "bun", skin: "#f0c9a8", eye: "#3a2a1a", bg: ["#a78bfa", "#fde68a"], glasses: true, shirt: "#6d28d9" };

    // ---------------------------------------------------------------- NPC sulla mappa: in panchina, sul bordo ovest del campo
    if (zone) {
      zone.npcs = zone.npcs || [];
      var spots = zoneId === "trabucchi" ? { p: [16, 9], d: [16, 13] } : { p: [21, 10], d: [21, 14] };
      if (!zone.npcs.some(function (n) { return n.id === PRES; })) zone.npcs.push({ id: PRES, at: spots.p });
      if (!zone.npcs.some(function (n) { return n.id === DINA; })) zone.npcs.push({ id: DINA, at: spots.d });
    }

    // ---------------------------------------------------------------- helper
    function st() { try { return dir.state(); } catch (e) { return null; } }
    function go(extra) { dir.start(Object.assign({ onExit: api.trResume, from: "borgo" }, extra || {})); }
    function back(fn) { return { label: "◂ Indietro", fn: fn }; }

    // ---------------------------------------------------------------- dialoghi
    function presHead(s) {
      var m = mem();
      if (!m.met) return "«Commendator Ottavio Spigola, presidente del Rondine FC: ex droghiere, attuale ottimista. Il bilancio della società sta in un barattolo di acciughe: nessuno ha il coraggio di aprirlo. Lei è il Mister, no? Venga, si sieda in panchina: è l'unico posto della società che non perde.»";
      if (!s) return "«Mister! Il campo è pronto, il barattolo anche. Cosa facciamo?»";
      if (s.unread > 0 && s.won > 0) return "«Mister, Dina ha ricevuto una lettera: ci sono " + (s.unread === 1 ? "un nuovo avversario" : s.unread + " nuovi avversari") + " in calendario. Io, per sicurezza, ho cambiato la marca delle acciughe.»";
      if (s.blocked) return "«Mister, la finale di stagione ha un cancello, e il cancello vuole stelle. Rigiochi qualche episodio con l'obiettivo speciale: Dina dice che ne servono un paio.»";
      if (s.won >= s.total) return "«Il Rondine ha vinto tutto, Mister. Non capita spesso: vado in piazza a farmelo ripetere dal vento.»";
      return "«Mister, siamo all'episodio " + (s.next ? s.next.ep : "?") + ": " + s.seasonTitle + ". Dina ha già stampato il calendario. In tre copie, per scaramanzia.»";
    }
    function presMenu() {
      var s = st(), m = mem();
      m.met = 1; memSet(m);
      var opts = [];
      opts.push({ label: s && s.won > 0 ? "Matchday Director" : "Comincia il Torneo del Molo", sub: s ? ("Episodio " + (s.next ? s.next.ep : s.total) + "/" + s.total + " · " + s.seasonTitle) : "Il Rondine FC dalla panchina", cls: "hot", fn: function () { go(); } });
      if (s && s.next && s.won > 0) opts.push({ label: "Prossimo episodio", sub: s.next.name, cls: "hot", fn: function () { go({ opp: s.next.id }); } });
      opts.push({ label: "Spogliatoio e bacheca", sub: s ? ("Rosa " + (16 + s.roster) + " giocatori · maglia, portiere, trofei") : "Rosa, maglie, trofei", fn: function () { go({ screen: "locker" }); } });
      opts.push({ label: "Quattro chiacchiere col Presidente", sub: "Aneddoti, ironie, qualche ricordo", fn: presChat });
      api.trAsk(PRES, presHead(s), opts);
    }

    var PCHAT = [
      { need: function () { return true; }, t: ["Il Rondine FC nasce da una scommessa: mio cognato diceva che il Borgo non avrebbe mai avuto una squadra vera. Io ho dato la parola, lui ha dato le magliette. Lui, in compenso, ha perso la scommessa e ha vinto il fritto.", "Sa perché tengo i soldi nel barattolo delle acciughe? Perché in società chiunque si fida di una cosa che profuma di mare e di cosa vecchia."] },
      { need: function (s) { return s.won >= 2; }, t: ["Ai miei tempi la panchina era una cassetta del pesce. Adesso ne abbiamo una vera, col cuscino. Me l'ha fatta Settimio, che di legno non ne capisce niente, ma di sedere sì."] },
      { need: function (s) { return s.seasonsDone >= 1; }, t: ["Il Cavalier Bonaccia mi ha detto: «Il Borgo è un paesello». Io gli ho risposto che 'paesello' è un complimento: vuol dire che ci si conosce tutti, anche quelli che non si parlano."] },
      { need: function (s) { return s.seasonsDone >= 2; }, t: ["Mio padre vendeva chiodi e viti. Diceva che una società è un mazzo di chiavi: ognuno ne ha una, e la porta si apre solo se ci sono tutte. Io avevo solo il portachiavi. Poi sono arrivati i ragazzi, e le chiavi.", "Quando ho preso il Rondine avevo un debito e una speranza. Il debito è ancora lì. La speranza, lo ammetto, ha messo su un po' di peso."] },
      { need: function (s) { return s.seasonsDone >= 3 || s.won >= 20; }, t: ["Se mi chiedono cosa ho vinto, rispondo: una piazza piena. Non c'è coppa che pesi meno, e nessuna che si tiene meglio sul comò."] }
    ];
    function presChat() {
      var s = st() || { won: 0, seasonsDone: 0 }, ok = PCHAT.filter(function (c) { try { return c.need(s); } catch (e) { return false; } });
      var m = mem(), n = m.pchat | 0, c = ok[n % ok.length];
      m.pchat = n + 1; memSet(m);
      api.trSay(c.t.map(function (t) { return L(PRES, t); }), api.trResume);
    }

    function dinaHead(s) {
      var m = mem();
      if (!m.dmet) return "«Dina Cartella, segretaria della società. Cioè: faccio i fogli, tengo le chiavi, ricordo tutto quello che il Presidente dimentica a bella posta. Se c'è un problema, c'è già una cartella. Se non c'è, la apro.»";
      if (s && s.unread > 0 && s.won > 0) return "«Mister, c'è posta. " + (s.unread === 1 ? "Una nuova partita" : s.unread + " nuove partite") + " in calendario. Le ho messe nella cartella 'Varie', che è la più grande.»";
      return ["«Calendario, formazioni, buste paga che non esistono. Cosa le serve, Mister?»", "«Le ho lasciato la formazione sul tavolino. A matita, non si sa mai.»", "«Il Presidente chiede se vinciamo. Io rispondo: vedremo. Siamo in società, non al casinò.»"][Math.floor(Math.random() * 3)];
    }
    function dinaMenu() {
      var s = st(), m = mem();
      m.dmet = 1; memSet(m);
      api.trAsk(DINA, dinaHead(s), [
        { label: "Il calendario del Rondine", sub: s ? ("Rank " + s.rank + " · stelle " + s.stars) : "Episodi e stagioni", cls: "hot", fn: function () { go(); } },
        { label: "Spogliatoio e bacheca", sub: s ? ("Nuovi arrivi " + s.roster + "/" + s.rosterTotal) : "Rosa e maglie", fn: function () { go({ screen: "locker" }); } },
        { label: "Racconti dall'archivio", sub: "Dina ricorda ogni formazione dal '99", fn: dinaChat }
      ]);
    }
    var DCHAT = [
      { need: function () { return true; }, t: ["Tengo tutto in tre cartelle: azzurra, gialla e 'Varie'. 'Varie' è la più grande. Nessuno la apre, nemmeno io, ma so sempre cosa c'è dentro."] },
      { need: function (s) { return s.won >= 1; }, t: ["Ogni formazione la scrivo a mano, con la stilografica. I ragazzi dicono che è antico. Io dico che l'inchiostro non si connette a niente, quindi non si perde."] },
      { need: function (s) { return s.won >= 6; }, t: ["Dopo ogni partita, il Mister viene a dirmi com'è andata. Io lo so già: ho la radio. Ma lui viene lo stesso, e io faccio finta. Credo sia questo, il lavoro di squadra."] },
      { need: function (s) { return s.seasonsDone >= 2; }, t: ["Quando un ragazzo se ne va, tengo il suo foglio: non per nostalgia, per l'archivio. Ne ho una pila alta così. È nostalgia, certo. Ma l'archivio è l'archivio."] }
    ];
    function dinaChat() {
      var s = st() || { won: 0, seasonsDone: 0 }, ok = DCHAT.filter(function (c) { try { return c.need(s); } catch (e) { return false; } });
      var m = mem(), n = m.dchat | 0, c = ok[n % ok.length];
      m.dchat = n + 1; memSet(m);
      api.trSay(c.t.map(function (t) { return L(DINA, t); }), api.trResume);
    }

    // ---------------------------------------------------------------- hook concatenato (non chiama mai il getter dentro la funzione assegnata)
    var desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    var chained = !(desc && desc.set); // con accessor (cage-borgo) la catena la fa il setter
    var prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      if (id === PRES) { presMenu(); return true; }
      if (id === DINA) { dinaMenu(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };

    // ---------------------------------------------------------------- voce nel menu del Borgo
    if (Array.isArray(MN) && !MN.some(function (f) { return f && f.__director; })) {
      var f = function () {
        var s = st();
        return {
          label: "📋 Matchday Director · Sede del Rondine FC",
          sub: s ? (s.seasonTitle + " · ep. " + (s.next ? s.next.ep : s.total) + "/" + s.total + (s.unread ? " · " + s.unread + " nuovi" : "") + " · in panchina ai Trabucchi") : "Il Rondine FC dalla panchina",
          cls: "hot",
          fn: function () { if (zone) api.trGo(zoneId); else go(); }
        };
      };
      f.__director = 1; MN.push(f);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
