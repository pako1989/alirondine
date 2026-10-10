(function () {
  "use strict";
  if (window.__legaOmbreLoaded) return;
  window.__legaOmbreLoaded = true;

  var KEY = "ali-di-rondine.lega-ombre";
  var tries = 0, api = null, EXIT = null;
  var ZONES = {};

  function mem() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function memSet(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function hero() { try { return window.heroLoad ? window.heroLoad() : null; } catch (e) { return null; } }

  function showButtons(btns) {
    setTimeout(function () {
      var c = document.getElementById("choices");
      if (!c) return;
      c.innerHTML = "";
      c.className = "choices";
      btns.forEach(function (b) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn " + (b.cls || "");
        btn.textContent = b.label;
        btn.onclick = b.fn;
        c.appendChild(btn);
      });
    }, 50);
  }

  function enterZone(zid) {
    var zr = ZONES[zid]; if (!zr) return;
    var m = mem(); m.zone = zid; memSet(m);
    if (api.trRec) api.trRec().seen[zid] = true;
    api.trGo(zid);
    if (api.trToast) api.trToast(zr.spec.short || zr.spec.name);
  }

  function registerZone(zid, spec) {
    var Z = {
      name: spec.name, short: spec.short || spec.name, sub: spec.sub || "",
      need: 0, w: spec.w || 36, h: spec.h || 24, start: spec.start || [18, 14],
      theme: "torino", bus: "cancello", busLabel: "Esci",
      npcs: spec.npcs || [], areas: spec.areas || [],
      me: function () { var c = api.CAST.hero || api.CAST.leo || {}; return Object.assign({}, c, { shirt: "#1e293b" }); }
    };
    Z.tile = function (ch, sx, sy) {
      var g = document.getElementById("cv").getContext("2d");
      g.fillStyle = "#1e293b"; g.fillRect(sx, sy, 16, 16);
    };
    Z.menu = function () { api.trAsk("voce", "<b>Lega delle Ombre</b>", [{ label: "Esci", cls: "hot", fn: leave }]); };
    api.TRZ[zid] = Z; ZONES[zid] = { spec: spec, Z: Z };
  }

  function leave() {
    var b = EXIT || window.title; EXIT = null;
    if (api && api.trExitTo) api.trExitTo(typeof b === "function" ? b : null);
    else if (typeof b === "function") b();
  }

  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = hero();
    var text = "<b>La Lega delle Ombre</b><br>";
    if (h) text += h.name + " · n. " + h.num + "<br><span style=\"color:#a78bfa\">Torneo clandestino del porto.</span>";
    else text += "Questa saga richiede il tuo Campione.";
    api.scene("vl_paese", "voce", text, [], "Lega delle Ombre");
    var btns = [];
    if (!h) {
      btns.push({ label: "Crea il tuo Campione", cls: "hot", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } });
    } else {
      btns.push({ label: "Entra nella Banchina", cls: "hot", fn: function () { enterZone("lo_banchina"); } });
    }
    btns.push({ label: "Torna", fn: leave });
    showButtons(btns);
  }

  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;
    registerZone("lo_banchina", { name: "Banchina delle Ombre", short: "Banchina", w: 40, h: 26, start: [20, 16], npcs: [{ id: "lo_mira", at: [12, 10] }] });
    if (a.CAST) a.CAST.lo_mira = a.CAST.lo_mira || { name: "Mira Voss", tag: "gold" };
    var prev = window.trTalkHook;
    window.trTalkHook = function (id) {
      if (id === "lo_mira") {
        api.scene("vl_paese", "lo_mira", "Sei arrivato. La Lega non invita a caso.", []);
        showButtons([{ label: "Capito", fn: function () { api.trGo("lo_banchina"); } }]);
        return true;
      }
      if (typeof prev === "function") return prev(id);
    };
  }

  window.__legaOmbre = {
    version: 2,
    open: openMain,
    menuEntry: function (back) {
      return { label: "La Lega delle Ombre", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: "Torneo clandestino" };
    }
  };

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
