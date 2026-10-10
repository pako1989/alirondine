(function () {
  "use strict";
  if (window.__vuotoSaleStoryLoaded) return;
  window.__vuotoSaleStoryLoaded = true;
  var tries = 0, api = null, EXIT = null;
  function leave() { var b = EXIT || window.title; EXIT = null; if (typeof b === "function") b(); }
  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = null; try { h = window.heroLoad ? window.heroLoad() : null; } catch (e) {}
    var text = "<b>Cronache del Vuoto di Sale</b><br>";
    if (h) text += h.name + " · n. " + h.num;
    else text += "Crea il tuo Campione.";
    api.scene("vl_paese", "voce", text, [
      { label: "Entra", cls: "hot", fn: function () { alert("Zona non ancora pronta"); } },
      { label: "Torna", fn: leave }
    ], "Vuoto di Sale");
  }
  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;
  }
  window.__vuotoSaleStory = {
    version: 6,
    open: openMain,
    menuEntry: function (back) {
      return { label: "Cronache del Vuoto di Sale", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: "Test" };
    }
  };
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
