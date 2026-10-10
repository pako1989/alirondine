(function () {
  "use strict";
  if (window.__vuotoSaleStoryLoaded) return;
  window.__vuotoSaleStoryLoaded = true;

  var KEY = "ali-di-rondine.vuoto-sale";
  var tries = 0, api = null, EXIT = null;
  var ZONES = {};

  function mem() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function hero() { try { return window.heroLoad ? window.heroLoad() : null; } catch (e) { return null; } }

  function enterZone(zid) {
    var zr = ZONES[zid]; if (!zr) { alert("Zona non registrata: " + zid); return; }
    var m = mem(); m.zone = zid; memSet(m);
    if (api.trRec) api.trRec().seen[zid] = true;
    api.trGo(zid);
    if (api.trToast) api.trToast(zr.spec.short || zr.spec.name);
  }

  function registerZone(zid, spec) {
    var Z = {
      name: spec.name,
      short: spec.short || spec.name,
      sub: spec.sub || "",
      need: 0,
      w: spec.w || 40,
      h: spec.h || 26,
      start: spec.start || [20, 16],
      theme: "torino",
      bus: "cancello",
      busLabel: "Esci",
      npcs: spec.npcs || [],
      areas: spec.areas || [],
      me: function () { var c = api.CAST.hero || api.CAST.leo || {}; return Object.assign({}, c, { shirt: "#fbbf24" }); }
    };
    Z.tile = function (ch, sx, sy, tx, ty) {
      var g = document.getElementById("cv").getContext("2d");
      g.fillStyle = ((tx + ty) % 2 === 0) ? "#e2e8f0" : "#cbd5e1";
      g.fillRect(sx, sy, 16, 16);
    };
    Z.menu = function () {
      api.trAsk("voce", "<b>Vuoto di Sale</b>", [{ label: "Esci", cls: "hot", fn: leave }]);
    };
    api.TRZ[zid] = Z;
    ZONES[zid] = { spec: spec, Z: Z };
  }

  function leave() {
    var b = EXIT || window.title;
    EXIT = null;
    if (api && api.trExitTo) api.trExitTo(typeof b === "function" ? b : null);
    else if (typeof b === "function") b();
  }

  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = hero();
    var buttons = [];
    if (!h) {
      buttons.push({ label: "Crea il tuo Campione", cls: "hot", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } });
    } else {
      buttons.push({ label: "Entra nelle Dune di Sale", cls: "hot", fn: function () { enterZone("vs_dune"); } });
      buttons.push({ label: "Diario del Sale", fn: function () { var m = mem(); api.scene("vl_paese", "voce", "Frammenti: " + (m.memories||0), [{ label: "Indietro", fn: openMain }]); } });
    }
    buttons.push({ label: "Torna", fn: leave });
    var text = "<b>Cronache del Vuoto di Sale</b><br>";
    if (h) text += h.name + " · n. " + h.num + "<br><span style=\"color:#fbbf24\">Il sale ricorda cio che tu hai dimenticato.</span>";
    else text += "Questa saga richiede il tuo Campione.";
    api.scene("vl_paese", "voce", text, buttons, "Vuoto di Sale");
  }

  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;
    registerZone("vs_dune", {
      name: "Dune di Sale Bianco",
      short: "Dune di Sale",
      w: 40, h: 26,
      start: [20, 16],
      npcs: [{ id: "vs_lira", at: [12, 10] }, { id: "vs_orrin", at: [28, 18] }]
    });
    if (a.CAST) {
      a.CAST.vs_lira = a.CAST.vs_lira || { name: "Lira la Guida", tag: "gold" };
      a.CAST.vs_orrin = a.CAST.vs_orrin || { name: "Orrin del Sale", tag: "dim" };
    }
    var prev = window.trTalkHook;
    window.trTalkHook = function (id) {
      if (id === "vs_lira") { api.scene("vl_paese", "vs_lira", "Il vento porta il tuo nome. La Citta e a est.", [{ label: "Capito", fn: function () { api.trGo("vs_dune"); } }]); return true; }
      if (id === "vs_orrin") { api.scene("vl_paese", "vs_orrin", "Qualcuno ha gia firmato un Contratto con il tuo nome.", [{ label: "Continua", fn: function () { api.trGo("vs_dune"); } }]); return true; }
      if (typeof prev === "function") return prev(id);
    };
  }

  window.__vuotoSaleStory = {
    version: 5,
    open: openMain,
    menuEntry: function (back) {
      var h = hero();
      return { label: "Cronache del Vuoto di Sale", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: h ? h.name + " · Dune" : "Crea il Campione" };
    }
  };

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
