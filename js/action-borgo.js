// js/action-borgo.js - Aggancio al Borgo camminabile per la Coppa del Molo (Action Soccer HD)
// Carica solo se esiste window.__borgoApi. Aggiunge due NPC (Ginetta, organizzatrice, e Arturo, la voce di Radio Molo)
// ai Trabucchi, un pulsante nel menu del Borgo e concatena window.trTalkHook senza sovrascrivere gli altri hook.
// Al ritorno dalle partite chiama trResume. Nessun bonus su storia/Carriera; le monete restano dentro action-soccer-hd.js.
(function () {
  "use strict";
  var tries = 0, done = false;

  function init() {
    if (done) return;
    var api = window.__borgoApi;
    if (!api) { if (tries++ < 80) setTimeout(init, 250); return; }
    // aspetta borgo-expansions (che definisce i Trabucchi e sovrascrive trTalkHook); poi si accoda
    if (!api.TRZ.trabucchi && tries++ < 24) { setTimeout(init, 250); return; }
    done = true;
    var TRZ = api.TRZ, CAST = api.CAST, MN = api.MN_BORGO_BTN, L = api.L;
    var zone = TRZ.trabucchi || TRZ.caruggi;

    CAST.ginetta_molo = { name: "Ginetta Bandierina", tag: "gold", hair: "#7c2d12", style: "long", skin: "#f1c6a0", eye: "#3b2415", bg: ["#fde68a", "#f97316"], shirt: "#111827" };
    CAST.arturo_molo = { name: "Arturo Altoparlante", tag: "blue", hair: "#6b7280", style: "messy", skin: "#e9be95", eye: "#222", bg: ["#7dd3fc", "#e0f2fe"], glasses: true, shirt: "#0e7490" };

    if (zone) {
      zone.npcs = zone.npcs || [];
      if (!zone.npcs.some(function (n) { return n.id === "ginetta_molo"; })) {
        var gy = zone === TRZ.trabucchi ? 16 : 8;
        zone.npcs.push({ id: "ginetta_molo", at: [zone === TRZ.trabucchi ? 6 : 6, gy] });
        zone.npcs.push({ id: "arturo_molo", at: [zone === TRZ.trabucchi ? 20 : 8, gy] });
      }
    }

    function hd() { return window.__actionHd; }
    function st() { try { return hd() && hd().state ? hd().state() : null; } catch (e) { return null; } }
    function go(mode) {
      if (!hd() || !hd().start) { api.trToast("La Coppa del Molo non e' disponibile ora."); return api.trResume(); }
      hd().start({ mode: mode, onExit: api.trResume });
    }
    function opt(label, sub, mode, hot) { return { label: label, sub: sub, cls: hot ? "hot" : "", fn: function () { go(mode); } }; }
    function back(fn) { return { label: "◂ Indietro", fn: fn }; }

    function greet(s) {
      if (!s) return "«La Coppa del Molo parte quando vuoi. Il vento, per ora, e' d'accordo.»";
      if (!s.played) return "«Tu sei Leo? Io sono Ginetta Bandierina, arbitra, organizzatrice e unica persona che ha letto il regolamento. Cinque contro cinque, cento secondi, niente tacchetti di ferro. Il fritto lo offre Nando.»";
      if (s.cupOn) return "«La Coppa e' in corso: il tabellone ti aspetta e io ho gia' il fischietto in bocca. Si fischia quando sei pronto.»";
      if (s.seasonOn) return "«Campionato in corso, giornata " + (s.md + 1) + ". La classifica non perdona. Io, a volte, si'.»";
      if (s.newChapters > 0) return "«Ehi, Leo! Ho una cosa da raccontarti sul Molo. Passa dal Diario quando hai due minuti: la Coppa ha piu' storie che gol.»";
      if (s.titles || s.cupWon) return "«Il tuo nome e' sulla targa. La R sembra ancora una P, ma io la guardo con affetto.»";
      return "«Rieccoti. Il pallone e' gonfio, il Molo e' storto e io ho il fischietto. Cosa giochiamo?»";
    }

    function menuMain() {
      var s = st();
      api.trAsk("ginetta_molo", greet(s), [
        { label: "Partite", sub: "Libera, Sopravvivenza, Sfida a tempo", cls: "hot", fn: menuPartite },
        { label: "Stagione e Coppa", sub: s ? (s.cupOn ? "Coppa in corso" : s.seasonOn ? "Campionato in corso" : "Campionato e tabellone") : "Campionato e tabellone", cls: "hot", fn: menuStagione },
        { label: "Allenamento", sub: "Rigori, calci piazzati, prove libere", fn: menuAllen },
        { label: "Sfide del giorno", sub: s ? (s.dailyLeft + " da fare" + (s.streak ? " · serie " + s.streak : "")) : "Obiettivi giornalieri", fn: function () { go("daily"); } },
        { label: "Squadra e tattiche", sub: "Compagni, look, modulo", fn: menuSquadra },
        { label: "Il Diario del Molo", sub: s ? ("Capitoli " + s.chapters + "/" + s.total + (s.newChapters ? " · nuovo!" : "")) : "Storie e personaggi", fn: function () { go("diary"); } },
        { label: "Menu completo della Coppa", sub: "Tutte le modalita'", fn: function () { go("menu"); } },
      ]);
    }
    function menuPartite() {
      api.trAsk("ginetta_molo", "«Partita libera per divertirsi, Sopravvivenza per resistere alle ondate, Sfida a tempo per chi ha fretta. Qui nessuno sbaglia: al massimo il pallone cambia idea.»", [
        opt("Torneo d'apertura", "Le cinque squadre, in ordine", "torneo", true),
        opt("Partita libera", "Scegli squadra e durata", "free"),
        opt("Sopravvivenza", "Ondate sempre piu' forti", "surv"),
        opt("Sfida a tempo", "Segna piu' gol che puoi", "timed"),
        back(menuMain),
      ]);
    }
    function menuStagione() {
      api.trAsk("ginetta_molo", "«Il campionato dura dieci giornate, la Coppa un tabellone solo: chi cade, cade nel fritto. Si impara in fretta a rialzarsi.»", [
        opt("Campionato", "Classifica e giornate", "season", true),
        opt("Coppa del Molo", "Tabellone a eliminazione", "cup", true),
        back(menuMain),
      ]);
    }
    function menuAllen() {
      api.trAsk("ginetta_molo", "«Gli allenamenti non contano niente, e per questo sono i migliori. Rigori e piazzati: li tiri tu, io faccio il palo.»", [
        opt("Rigori", "Serie di rigori", "pens"),
        opt("Calci piazzati", "Punizioni e angoli", "setp"),
        opt("Allenamento libero", "Senza avversari, senza fretta", "train"),
        back(menuMain),
      ]);
    }
    function menuSquadra() {
      api.trAsk("ginetta_molo", "«La squadra e' come il fritto: dipende da chi ti sta accanto. Cambia i compagni, il colore della maglia, la tattica. Il pallone non protesta.»", [
        opt("Squadra", "Compagni sbloccati", "team"),
        opt("Look", "Maglia, pallone, campo", "look"),
        opt("Tattiche", "Modulo e pressing", "tac"),
        back(menuMain),
      ]);
    }

    var ARTURO = [
      "«Qui Arturo dalla cabina: il pallone e' rotondo, il Molo e' storto. Sul resto sono in attesa di conferma.»",
      "«Se vuoi il segreto: ogni partita ha un minuto in cui il vento smette. Tu segna in quel minuto.»",
      "«Il microfono e' un mestolo. Funziona uguale, ma ogni tanto sa di brodo.»",
      "«Commento ogni partita, anche senza pubblico. Un giorno ti spiego perche'. Non oggi, oggi c'e' vento.»",
    ];
    function arturoTalk() {
      var s = st(), t = ARTURO[Math.floor(Math.random() * ARTURO.length)];
      if (s && s.chapters >= 9) t = "«La Coppa e' ancora in piedi. A volte basta questo, Leo. Qualcuno che torna e un mestolo acceso.»";
      api.trAsk("arturo_molo", t, [
        { label: "Sentiamo Ginetta", sub: "Menu della Coppa", cls: "hot", fn: menuMain },
        { label: "Il Diario del Molo", sub: "Storie e personaggi", fn: function () { go("diary"); } },
      ]);
    }

    var desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    var chained = !(desc && desc.set); // con accessor (cage-borgo) la catena la fa il setter
    var prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      if (id === "ginetta_molo") { menuMain(); return true; }
      if (id === "arturo_molo") { arturoTalk(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };

    if (Array.isArray(MN)) {
      MN.push(function () {
        var s = st();
        return {
          label: "⚽ Coppa del Molo",
          sub: s ? ("Calcio d'azione 5v5 · capitoli " + s.chapters + "/" + s.total + (s.dailyLeft ? " · sfide " + s.dailyLeft : "")) : "Calcio d'azione 5v5",
          cls: "hot",
          fn: function () { go("menu"); },
        };
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
