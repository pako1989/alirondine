(function () {
  "use strict";
  if (window.__vuotoSaleStoryLoaded) return;
  window.__vuotoSaleStoryLoaded = true;
  var KEY = "ali-di-rondine.vuoto-sale";
  var tries = 0, api = null, EXIT = null;
  function mem() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function hero() { try { return window.heroLoad ? window.heroLoad() : null; } catch (e) { return null; } }
  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = hero();
    if (!h) {
      return api.scene("sale_dune", "voce", "<b>Cronache del Vuoto di Sale</b><br>Questa saga richiede il tuo Campione.", [
        { label: "Crea il tuo Campione", cls: "hot", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } },
        { label: "Torna", fn: leave }
      ], "Vuoto di Sale");
    }
    var m = mem();
    var status = m.ch1done ? "Capitolo 1 concluso" : "Capitolo 1 in corso";
    api.scene("sale_citta", "voce", "<b>Cronache del Vuoto di Sale</b><br>" + h.name + " · n. " + h.num + "<br><span style=\"color:#fbbf24\">Il sale ricorda cio che tu hai dimenticato.</span><br><br>Capitolo 1 · La Carovana del Sale Cieco<br>" + status, [
      { label: m.ch1done ? "Rigioca il Capitolo 1" : "Inizia / Continua", cls: "hot", fn: startChapter1 },
      { label: "Diario del Sale", sub: "Frammenti: " + (m.memories || 0), fn: showDiary },
      { label: "Torna", fn: leave }
    ], "Vuoto di Sale");
  }
  function leave() { var b = EXIT || window.title; EXIT = null; if (typeof b === "function") b(); }
  function showDiary() { var m = mem(); api.scene("sale_diario", "voce", "Frammenti di memoria raccolti: " + (m.memories || 0), [{ label: "Indietro", fn: openMain }]); }
  function startChapter1() {
    api.scene("sale_dune", "guidacarovana", "Il vento di sale porta il tuo nome scritto su un cristallo che non ricordi di aver toccato. Le dune si spostano sotto i piedi della carovana aerea. Non sei il primo Campione ad arrivare qui.", [
      { label: "Chiedi della Citta di Cristallo", fn: askCity },
      { label: "Osserva le dune", fn: observeDunes },
      { label: "Chiedi chi sei", fn: askWho }
    ], "Dune di Sale");
  }
  function askCity() { api.scene("sale_dune", "guidacarovana", "La Citta di Cristallo e a est, oltre la Miniera delle Memorie. Il sale rivela solo a chi e disposto a perdere un ricordo.", [{ label: "Parto", cls: "hot", fn: enterWorld }]); }
  function observeDunes() { api.scene("sale_dune", "voce", "Una duna si apre. Dentro un cristallo mostra una partita di calcio su un campo di sale che non esiste piu. Tu sei in campo. Non ricordi quella partita.", [{ label: "Raccogli il frammento", cls: "hot", fn: function () { var m = mem(); m.memories = (m.memories || 0) + 1; memSet(m); enterWorld(); } }]); }
  function askWho() { api.scene("sale_dune", "vecchio_sale", "Il sale ricorda chi sei anche se tu non lo fai. Qualcuno ha gia firmato un Contratto con il tuo nome. Forse sei tu in un altro strato.", [{ label: "Continua", fn: enterWorld }]); }
  function enterWorld() { api.scene("sale_miniera", "minatore_cieco", "Le memorie solidificate... alcune sono tue. La Signora dei Contratti ti aspetta. Non fidarti del sale quando ti parla con la tua voce.", [{ label: "Vai alla Citta", cls: "hot", fn: arriveCity }]); }
  function arriveCity() { api.scene("sale_citta", "signora_contratti", "Sei arrivato, Campione. Il Contratto di Memoria e pronto. Firmando, il sale ti mostrera la verita: qualcuno ha gia vissuto questa storia.", [{ label: "Firma il Contratto", cls: "hot", fn: signContract }, { label: "Chiedi il prezzo", fn: function () { api.scene("sale_citta", "signora_contratti", "Il prezzo e un ricordo che credevi tuo. Dopo la firma saprai se era davvero tuo.", [{ label: "Firma", cls: "hot", fn: signContract }]); } }]); }
  function signContract() { var m = mem(); m.ch1done = true; m.memories = (m.memories || 0) + 1; memSet(m); api.scene("sale_citta", "voce", "<b>Contratto firmato.</b><br>Il cristallo si frantuma. Una voce dice: Non sei il primo. Non sarai l ultimo.<br><br>Per un istante vedi te stesso in un altro tempo che firma e poi dimentica.<br><br><b>Capitolo 1 concluso.</b>", [{ label: "Torna al menu", fn: openMain }]); }
  function init() { var a = window.__borgoApi; if (!a || !a.scene) { if (++tries < 200) setTimeout(init, 150); return; } api = a; if (a.CAST) { a.CAST.guidacarovana = a.CAST.guidacarovana || { name: "Guida della Carovana", tag: "gold" }; a.CAST.vecchio_sale = a.CAST.vecchio_sale || { name: "Vecchio del Sale", tag: "dim" }; a.CAST.minatore_cieco = a.CAST.minatore_cieco || { name: "Minatore Cieco", tag: "dim" }; a.CAST.signora_contratti = a.CAST.signora_contratti || { name: "Signora dei Contratti", tag: "hot" }; } }
  window.__vuotoSaleStory = { version: 1, open: openMain, menuEntry: function (back) { var h = hero(); var m = mem(); return { label: "Cronache del Vuoto di Sale", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: h ? h.name + " · " + (m.ch1done ? "Capitolo 1 concluso" : "Capitolo 1 in corso") : "Crea il tuo Campione" }; } };
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
