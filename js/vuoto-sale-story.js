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
    api.scene("sale_citta", "voce", "<b>Cronache del Vuoto di Sale</b><br>" + h.name + " · Capitolo 1", [
      { label: "Inizia / Continua", cls: "hot", fn: startChapter1 },
      { label: "Torna", fn: leave }
    ], "Vuoto di Sale");
  }
  function leave() { var b = EXIT || window.title; EXIT = null; if (typeof b === "function") b(); }
  function startChapter1() { api.scene("sale_dune", "guidacarovana", "Il vento porta il tuo nome. Non sei il primo Campione.", [{ label: "Continua", cls: "hot", fn: enterWorld }], "Dune"); }
  function enterWorld() { api.scene("sale_citta", "signora_contratti", "Il Contratto e pronto.", [{ label: "Firma", cls: "hot", fn: signContract }], "Citta"); }
  function signContract() { var m = mem(); m.ch1done = true; memSet(m); api.scene("sale_citta", "voce", "Capitolo 1 concluso.", [{ label: "Torna", fn: openMain }]); }
  function init() { var a = window.__borgoApi; if (!a || !a.scene) { if (++tries < 200) setTimeout(init, 150); return; } api = a; }
  window.__vuotoSaleStory = { version: 1, open: openMain, menuEntry: function (back) { return { label: "Cronache del Vuoto di Sale", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: "Sci-fi western" }; } };
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
