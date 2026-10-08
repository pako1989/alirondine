// js/borgo-hub.js - "Accessi dalla piazza": Nereo il Banditore, in Piazza San Pietro, indica la strada per i Trabucchi
// e racconta le tre modalità che lì vivono (Gabbia del Molo, Coppa del Molo, Matchday Director), con scorciatoia e avanzamento.
// Va incluso DOPO game.js (e dopo cage-borgo.js / action-borgo.js / director-borgo.js, ma non è obbligatorio: i getter si leggono al volo).
// Carica solo se esiste window.__borgoApi. Nessun bonus, nessuna moneta: è solo una guida.
//
// Come si aggancia al Borgo principale (la mappa 'borgò di game.js):
//  - NPC: serve l'array NPCS del Borgo -> window.__borgoApi.NPCS (da esporre in game.js; in ?debug si ripiega su window.__pc.NPCS).
//  - Dialogo: il Borgo chiama window.questBoardTalk(id, bSay, bAsk, BL, borgoResume) prima dei propri dialoghi:
//    qui lo si incapsula (gestisce SOLO il proprio id, per gli altri passa al precedente). Idem questBoardNpcHasNews per il "!".
//  - trTalkHook (le mappe di trasferta) NON viene toccato.
//  - Livello di storia: window.__borgoApi.trLevel se esposto; altrimenti ricavato dai salvataggi di stagione.
(function () {
  "use strict";
  if (window.__borgoHubLoaded) return;
  window.__borgoHubLoaded = true;
  var tries = 0;

  var ID = "banditore_molo";
  var KEY = "ali-di-rondine.borgo-hub"; // solo memoria narrativa dell'NPC
  var SPOT = [21, 10]; // Piazza San Pietro, sotto la fontana, su tile pavimentata e libera

  function mem() { try { var o = JSON.parse(localStorage.getItem(KEY) || "{}"); return o && typeof o === "object" ? o : {}; } catch (e) { return {}; } }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ignora */ } }

  function init() {
    var api = window.__borgoApi;
    if (!api) { if (++tries < 120) setTimeout(init, 200); return; }
    // aspetta i Trabucchi (borgo-expansions.js) e i moduli delle tre modalità (che hanno un loro caricamento)
    if ((!api.TRZ || !api.TRZ.trabucchi) && tries++ < 60) { setTimeout(init, 200); return; }

    var NPCS = Array.isArray(api.NPCS) ? api.NPCS : (window.__pc && Array.isArray(window.__pc.NPCS) ? window.__pc.NPCS : null);
    if (!NPCS) return; // il Borgo non espone un modo per aggiungere un PNG: nessun effetto (vedi patch proposta per game.js)

    var CAST = api.CAST, TRZ = api.TRZ || {};
    CAST[ID] = CAST[ID] || { name: "Nereo il Banditore", tag: "gold", hair: "#9ca3af", style: "slick", skin: "#dca877", eye: "#2a2a2a", bg: ["#0e7490", "#fcd34d"], beard: true, cap: "#0e7490", shirt: "#b45309" };

    // carta dell'album: si sblocca solo quando Nereo parla (seeCard)
    if (api.BIO && !api.BIO[ID]) api.BIO[ID] = "Dà gli annunci del Borgo con un megafono e li ripete due volte, per sicurezza, a volte tre. Il suo carretto va piano ma non perde mai la strada; a volte è la strada a perdere lui, ma questo non lo annuncia.";
    function meet() { try { if (api.seeCard) api.seeCard(ID); } catch (e) { /* ignora */ } }

    if (!NPCS.some(function (n) { return n && n.id === ID; })) NPCS.push({ id: ID, at: SPOT.slice() });

    // ---------------------------------------------------------------- stato (tutto in sola lettura, tutto protetto)
    function zoneNeed() { return TRZ.trabucchi && typeof TRZ.trabucchi.need === "number" ? TRZ.trabucchi.need : 1; }
    function level() {
      try { if (typeof api.trLevel === "function") return api.trLevel() | 0; } catch (e) { /* ripiega */ }
      // ripiego: stessa regola di prog() in game.js (snapshot di fine stagione più recente, o stagione in corso)
      var best = null, ld = function (k) { try { var d = JSON.parse(localStorage.getItem(k)); return d && d.st ? d : null; } catch (e) { return null; } };
      for (var i = 1; i <= 9; i++) { var d = ld("ali-di-rondine.stagione" + i); if (d) { var c = { n: i, ts: d.savedAt || i }; if (!best || c.ts > best.ts || (c.ts === best.ts && c.n > best.n)) best = c; } }
      var cur = ld("ali-di-rondine.salvataggio");
      if (cur) { var c2 = { n: Math.max(0, (cur.season || 1) - 1), ts: cur.savedAt || 0 }; if (!best || c2.ts > best.ts || (c2.ts === best.ts && c2.n > best.n)) best = c2; }
      return best ? best.n : 0;
    }
    function open() { return level() >= zoneNeed() && !!TRZ.trabucchi; }
    function seenZone() { try { var b = JSON.parse(localStorage.getItem("ali-di-rondine.borgo") || "{}"); return !!(b && b.tr && b.tr.seen && b.tr.seen.trabucchi); } catch (e) { return false; } }

    function safe(fn) { try { return fn(); } catch (e) { return null; } }
    var MODES = [
      {
        key: "cage", name: "La Gabbia del Molo", who: "Don Tullio", where: "accanto alla rete",
        has: function () { return !!(window.__cageHd && window.__cageHd.info); },
        st: function () { return safe(function () { return window.__cageHd.info(); }); },
        sub: function (s) {
          if (!s) return "Da scoprire";
          var st = Array.isArray(s.stars) ? s.stars : [], done = st.filter(function (x) { return x > 0; }).length;
          return "Tornei " + done + "/" + st.length + " · boss " + (s.bosses | 0) + "/3" + (s.chapters ? " · diario " + s.chapters : "") + (s.dailyLeft ? " · sfide " + s.dailyLeft : "");
        },
        started: function (s) { return !!s && ((s.stars || []).some(function (x) { return x > 0; }) || s.bosses > 0 || s.chapters > 0); },
        line: function (s, st0) {
          if (!st0) return "Una gabbia di cemento, tre contro tre, a punti. Il custode ha le chiavi e un po' di ricordi, in ordine sparso.";
          if (s.bosses >= 3) return "Hai battuto i tre del molo. Don Tullio, da allora, apre il cancello con un'aria diversa. Non lo ammette, ma è fiero.";
          return "Una gabbia di cemento, tre contro tre, a punti. Il custode ha le chiavi e un po' di ricordi, in ordine sparso.";
        },
      },
      {
        key: "action", name: "La Coppa del Molo", who: "Ginetta Bandierina", where: "sul lato del campo",
        has: function () { return !!(window.__actionHd && window.__actionHd.state); },
        st: function () { return safe(function () { return window.__actionHd.state(); }); },
        sub: function (s) {
          if (!s) return "Da scoprire";
          return "Capitoli " + (s.chapters | 0) + "/" + (s.total | 0) + (s.titles ? " · titoli " + s.titles : "") + (s.cupOn ? " · coppa in corso" : s.seasonOn ? " · campionato in corso" : "") + (s.dailyLeft ? " · sfide " + s.dailyLeft : "");
        },
        started: function (s) { return !!s && (s.played > 0 || s.chapters > 1); },
        line: function () { return "Cinque contro cinque, cento secondi, il vento che decide. Ginetta arbitra e organizza; Arturo, in cabina, commenta anche quando non c'è nessuno."; },
      },
      {
        key: "director", name: "Matchday Director", who: "il Presidente Spigola", where: "in panchina, a bordo campo",
        has: function () { return !!(window.__directorHd && window.__directorHd.state); },
        st: function () { return safe(function () { return window.__directorHd.state(); }); },
        sub: function (s) {
          if (!s) return "Da scoprire";
          return "Episodi " + (s.won | 0) + "/" + (s.total | 0) + (s.rank ? " · " + s.rank : "") + (s.unread ? " · " + s.unread + " novità" : "");
        },
        started: function (s) { return !!s && s.played > 0; },
        line: function () { return "Qui non si gioca: si decide. Formazione, avversari, qualche parola nello spogliatoio. Il presidente tiene il bilancio in un barattolo e la fiducia in un cassetto."; },
      },
    ];
    function modes() { return MODES.filter(function (m) { return m.has(); }); }

    // ---------------------------------------------------------------- dialoghi
    function go() {
      try { if (typeof api.trGo === "function" && TRZ.trabucchi) return api.trGo("trabucchi"); } catch (e) { /* ignora */ }
      if (typeof api.trToast === "function") api.trToast("La strada per i Trabucchi non è agibile ora.");
    }

    var CHAT_OPEN = [
      "Annuncio, avviso, ripeto. La prima volta la copre il gabbiano, la seconda la copre il bar. Alla terza, di solito, qualcuno sorride. E' il mio stipendio.",
      "Prima facevo il banditore ai matrimoni. Poi ai funerali. Poi ho capito che la gente ha bisogno di qualcuno che dica le cose a voce alta, anche quando le sa già.",
      "Questa campanella era di mio nonno. Suonava per il pesce fresco. Io suono per tutto il resto: è meno redditizio, ma si dorme meglio.",
    ];
    var CHAT_MORE = [
      "Il segreto di una buona piazza? Una panchina in più del necessario. Qualcuno, prima o poi, ha bisogno di sedersi con un'altra persona e fare finta di guardare il mare.",
      "Ai Trabucchi c'è chi gioca per vincere e chi gioca perché a casa si sta stretti. Dalla piazza si vedono bene tutti e due: camminano nello stesso modo, ma tornano in orari diversi.",
      "Ho sbagliato un annuncio, una volta: ho detto 'si è perso un cane' invece di 'si è trovato'. Per tre ore il paese ha cercato un cane che non c'era. Si è fatto tutto un gran camminare. Non è andata male.",
      "A volte mi chiedi se sono stanco di gridare. No. Mi stanco quando nessuno alza la testa. Oggi l'hai alzata tu: grazie.",
    ];

    function head(S, ask, say) {
      var m = mem(), n = (m.n | 0);
      if (level() < zoneNeed()) return "«Leo! Nereo, banditore di Borgo Marino: annuncio, avviso e ripeto. Oltre la curva ci sono posti bellissimi, ma il pullman li tiene ancora ben nascosti. Ripassa quando la storia sarà andata un po' più avanti. Intanto ti dico: ??? . ??? . ???. Sono annunci in anteprima.»";
      if (!m.met) return "«Leo! Nereo, banditore: annuncio, avviso e ripeto, anche perché il gabbiano mi copre la prima volta. Oggi ho una notizia che vale la pena ripetere: ai Trabucchi, oltre la curva delle reti, hanno aperto tre modi di giocare. Vuoi la strada, o te li racconto prima?»";
      var ms = modes().filter(function (x) { return x.started(x.st()); }).length;
      if (!seenZone()) return "«Ancora non sei passato dai Trabucchi? Sono dietro la curva delle reti, con le passerelle sul mare. Ti dico io la strada: costa un po' di fiato o un po' di carretto, a scelta.»";
      if (ms === 0) return "«Ai Trabucchi sei già stato, ma non hai ancora toccato palla in nessuna delle tre. Nessuna fretta: il mare sta lì da prima di noi.»";
      var pool = ["«Eccoti. Il carretto è pronto, il gabbiano è di turno. Dove ti porto?»", "«Annuncio per Leo Moretti: hai posti da sbrigare ai Trabucchi. Ripeto: li hai.»", "«Il molo ti ha chiesto di te, o forse era il vento. Comunque: strada, scorciatoia, tre modalità. Scegli.»"];
      return pool[n % pool.length];
    }

    function menuMain(bSay, bAsk, BL, resume) {
      var m = mem(), isOpen = open(), ms = modes(), o = [];
      var hd = head();
      m.met = 1; m.n = (m.n | 0) + 1; memSet(m);
      if (!isOpen) {
        o.push({ label: "Le tre modalità", sub: "???", cls: "hot", go: function () { menuModes(bSay, bAsk, BL, resume); } });
        o.push({ label: "Quattro chiacchiere", sub: "Annunci, ricordi e qualche ripetizione", go: function () { chat(bSay, bAsk, BL, resume); } });
        o.push({ label: "◂ Torna al Borgo", go: resume });
        return bAsk(ID, hd, o);
      }
      o.push({ label: "Portami ai Trabucchi", sub: "Scorciatoia in carretto", cls: "hot", go: go });
      o.push({ label: "Come ci arrivo?", sub: "La strada, a parole", go: function () { directions(bSay, bAsk, BL, resume); } });
      if (ms.length) o.push({ label: "Le tre modalità", sub: "Dove sei arrivato in ognuna", cls: "hot", go: function () { menuModes(bSay, bAsk, BL, resume); } });
      var mo = window.__moloSettimana; // Settimana del Molo (js/settimana-molo.js), se caricato
      if (mo && typeof mo.open === "function") { var mi = safe(function () { return mo.info(); }); if (mi) o.push({ label: "La Settimana del Molo", sub: mi.sub, cls: mi.pending ? "hot" : "", go: function () { mo.open({ view: mi.pending ? "ceremony" : "board", onExit: function () { menuMain(bSay, bAsk, BL, resume); } }); } }); }
      o.push({ label: "Quattro chiacchiere", sub: "Annunci, ricordi e qualche ripetizione", go: function () { chat(bSay, bAsk, BL, resume); } });
      o.push({ label: "◂ Torna al Borgo", go: resume });
      bAsk(ID, hd, o);
    }

    function directions(bSay, bAsk, BL, resume) {
      bSay([
        BL(ID, "Dalla piazza prendi la strada della costa, poi tieni il mare a destra e le reti a sinistra. Quando senti odore di legno bagnato e di fritto, sei arrivato: sono i Trabucchi, quelli con le passerelle sopra l'acqua."),
        BL(ID, "Se non vuoi camminare, c'è il carretto: va piano, ma non perde mai la strada. A volte la strada perde lui, ma non lo diciamo."),
      ], function () { menuMain(bSay, bAsk, BL, resume); });
    }

    function menuModes(bSay, bAsk, BL, resume) {
      var back = { label: "◂ Indietro", go: function () { menuMain(bSay, bAsk, BL, resume); } };
      if (!open()) {
        var q = MODES.map(function () { return { label: "???", sub: "Si sblocca più avanti nella storia", go: function () { bSay([BL(ID, "Ancora niente, Leo. Gli annunci in anteprima li dico solo a chi ha il biglietto. Tu hai quasi il biglietto.")], function () { menuModes(bSay, bAsk, BL, resume); }); } }; });
        q.push(back);
        return bAsk(ID, "«Tre posti, tre modi di giocare, e un banditore che non può dirti niente. Ripasso quando il pullman si sblocca.»", q);
      }
      var o = modes().map(function (md) {
        var s = md.st();
        return { label: md.name, sub: md.sub(s), cls: md.started(s) ? "" : "hot", go: function () { menuOne(md, bSay, bAsk, BL, resume); } };
      });
      o.push(back);
      bAsk(ID, "«Tre porte, tre modi di sprecare bene una serata. Quale ti racconto?»", o);
    }

    function menuOne(md, bSay, bAsk, BL, resume) {
      var s = md.st(), tx = md.line(s, !!s) + " Si trova ai Trabucchi, con " + md.who + " " + md.where + ". " + (md.started(s) ? "Tu ci sei già stato: " + md.sub(s) + "." : "Non ci hai ancora messo piede. Si rimedia.");
      bAsk(ID, "«" + tx + "»", [
        { label: "Portami ai Trabucchi", sub: md.who + " ti aspetta", cls: "hot", go: go },
        { label: "◂ Indietro", go: function () { menuModes(bSay, bAsk, BL, resume); } },
      ]);
    }

    function chat(bSay, bAsk, BL, resume) {
      var m = mem(), k = (m.c | 0), pool = k < CHAT_OPEN.length ? CHAT_OPEN : CHAT_MORE;
      var t = pool[k < CHAT_OPEN.length ? k : (k - CHAT_OPEN.length) % CHAT_MORE.length];
      // ogni tanto un annuncio sulle reclute con una storia (js/reclute-borgo.js), se ce ne sono di completate
      var rb = safe(function () { return window.__recluteBorgo.chat("nereo"); }) || [];
      if (rb.length && k >= CHAT_OPEN.length && k % 2 === 1) t = rb[Math.floor(k / 2) % rb.length].t[0];
      m.c = k + 1; memSet(m);
      bSay([BL(ID, t)], function () { menuMain(bSay, bAsk, BL, resume); });
    }

    // ---------------------------------------------------------------- aggancio al dialogo del Borgo (solo il proprio id)
    var prevTalk = window.questBoardTalk;
    window.questBoardTalk = function (id, bSay, bAsk, BL, resume) {
      if (id === ID) { meet(); menuMain(bSay, bAsk, BL, resume); return true; }
      return typeof prevTalk === "function" ? prevTalk.apply(this, arguments) : false;
    };
    // il punto "!" sopra il PNG: solo finchè ha qualcosa da dire (zona aperta ma mai visitata, oppure prima chiacchierata)
    var prevNews = window.questBoardNpcHasNews, newsAt = 0, newsVal = false;
    window.questBoardNpcHasNews = function (id) {
      if (id === ID) {
        var t = Date.now();
        if (t - newsAt > 1500) { newsAt = t; newsVal = !!(safe(function () { return open() && (!seenZone() || !mem().met); })); }
        return newsVal;
      }
      return typeof prevNews === "function" ? prevNews.apply(this, arguments) : false;
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
