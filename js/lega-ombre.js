(function () {
  "use strict";
  if (window.__legaOmbreLoaded) return;
  window.__legaOmbreLoaded = true;
  var KEY = "ali-di-rondine.lega-ombre";
  var tries = 0, api = null, EXIT = null;
  var ZONES = {};
  function hero() { try { return window.heroLoad ? window.heroLoad() : null; } catch (e) { return null; } }
  function forceButtons(btns) {
    var attempts = 0;
    var iv = setInterval(function () {
      attempts++;
      var c = document.getElementById("choices");
      if (c && c.children.length === 0) {
        c.innerHTML = ""; c.className = "choices";
        btns.forEach(function (b) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "choice-btn " + (b.cls || "");
          btn.style.cssText = "display:block;width:100%;margin:6px 0;padding:14px;background:#1e40af;color:#fff;border:none;border-radius:10px;font-size:16px;font-weight:bold;";
          btn.textContent = b.label;
          btn.onclick = function () { clearInterval(iv); if (b.fn) b.fn(); };
          c.appendChild(btn);
        });
        clearInterval(iv);
      }
      if (attempts > 30) clearInterval(iv);
    }, 80);
  }
  function enterZone(zid) {
    if (!api || !api.TRZ || !api.TRZ[zid]) { alert("Zona non pronta"); return; }
    try { api.trGo(zid); } catch (e) { alert("Errore zona: " + e.message); }
  }
  function registerZone(zid, spec) {
    var Z = {
      name: spec.name,
      short: spec.short || spec.name,
      sub: spec.sub || "",
      need: 0,
      w: spec.w || 36,
      h: spec.h || 24,
      start: spec.start || [18, 12],
      theme: "torino",
      bus: "cancello",
      busLabel: "Esci",
      npcs: spec.npcs || [],
      areas: spec.areas || [],
      items: [],
      item: ["Oggetto", "Oggetti"],
      me: function () { var c = api.CAST.hero || api.CAST.leo || {}; return Object.assign({}, c, { shirt: "#1e293b" }); },
      build: function (m, fill) {
        fill(0, 0, spec.w - 1, spec.h - 1, ".");
        fill(0, 0, spec.w - 1, 1, "W");
        fill(0, spec.h - 2, spec.w - 1, spec.h - 1, "W");
        fill(0, 0, 1, spec.h - 1, "W");
        fill(spec.w - 2, 0, spec.w - 1, spec.h - 1, "W");
      },
      tile: function (ch, sx, sy) {
        var g = document.getElementById("cv").getContext("2d");
        g.fillStyle = ch === "W" ? "#0f172a" : "#334155";
        g.fillRect(sx, sy, 16, 16);
      },
      menu: function () {
        forceButtons([{ label: "Esci dalla Lega", cls: "hot", fn: leave }]);
      }
    };
    api.TRZ[zid] = Z;
    ZONES[zid] = Z;
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
    var text = "<b>La Lega delle Ombre</b><br>" + (h ? h.name + " · n. " + h.num : "Crea il Campione");
    api.scene("vl_paese", "voce", text, [], "Lega delle Ombre");
    var btns = [];
    if (h) btns.push({ label: "Entra nella Banchina", cls: "hot", fn: function () { enterZone("lo_banchina"); } });
    else btns.push({ label: "Crea il Campione", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } });
    btns.push({ label: "Torna", fn: leave });
    forceButtons(btns);
  }
  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;
    registerZone("lo_banchina", {
      name: "Banchina delle Ombre",
      short: "Banchina",
      w: 40, h: 26,
      start: [20, 14],
      npcs: [{ id: "lo_mira", at: [14, 10] }]
    });
    if (a.CAST) a.CAST.lo_mira = a.CAST.lo_mira || { name: "Mira Voss", tag: "gold", skin: "#d4a574", eye: "#1e293b" };
    var prev = window.trTalkHook;
    window.trTalkHook = function (id) {
      if (id === "lo_mira") {
        api.scene("vl_paese", "lo_mira", "Sei arrivato. La Lega non invita a caso. Il campo e oltre.", []);
        forceButtons([{ label: "Capito", fn: function () { api.trGo("lo_banchina"); } }]);
        return true;
      }
      if (typeof prev === "function") return prev(id);
    };
  }
  window.__legaOmbre = {
    version: 4,
    open: openMain,
    menuEntry: function (back) {
      return { label: "La Lega delle Ombre", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: "Torneo clandestino del porto" };
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
