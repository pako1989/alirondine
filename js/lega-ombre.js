(function () {
  "use strict";
  if (window.__legaOmbreLoaded) return;
  window.__legaOmbreLoaded = true;
  var KEY = "ali-di-rondine.lega-ombre";
  var tries = 0, api = null, EXIT = null;
  var ZONES = {};
  function mem() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function hero() { try { return window.heroLoad ? window.heroLoad() : null; } catch (e) { return null; } }
  function forceButtons(btns) {
    var attempts = 0;
    var iv = setInterval(function () {
      attempts++;
      var c = document.getElementById("choices");
      if (c && c.children.length === 0) {
        c.innerHTML = "";
        c.className = "choices";
        btns.forEach(function (b) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = (b.cls || "") + " choice-btn";
          btn.style.cssText = "display:block;width:100%;margin:6px 0;padding:12px;background:#1e40af;color:#fff;border:none;border-radius:8px;font-size:16px;";
          btn.textContent = b.label;
          btn.onclick = function () { clearInterval(iv); b.fn(); };
          c.appendChild(btn);
        });
        clearInterval(iv);
      }
      if (attempts > 20) clearInterval(iv);
    }, 100);
  }
  function enterZone(zid) {
    var zr = ZONES[zid]; if (!zr) return;
    if (api.trRec) api.trRec().seen[zid] = true;
    api.trGo(zid);
  }
  function registerZone(zid, spec) {
    var Z = { name: spec.name, short: spec.short, need: 0, w: spec.w || 36, h: spec.h || 24, start: spec.start || [18, 14], theme: "torino", npcs: spec.npcs || [], me: function () { return api.CAST.hero || api.CAST.leo || {}; } };
    Z.tile = function (ch, sx, sy) { var g = document.getElementById("cv").getContext("2d"); g.fillStyle = "#1e293b"; g.fillRect(sx, sy, 16, 16); };
    Z.menu = function () {};
    api.TRZ[zid] = Z; ZONES[zid] = { spec: spec };
  }
  function leave() { var b = EXIT || window.title; EXIT = null; if (typeof b === "function") b(); }
  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = hero();
    var text = "<b>La Lega delle Ombre</b><br>" + (h ? h.name : "Crea il Campione");
    api.scene("vl_paese", "voce", text, [], "Lega delle Ombre");
    var btns = h ? [{ label: "Entra nella Banchina", cls: "hot", fn: function () { enterZone("lo_banchina"); } }] : [{ label: "Crea Campione", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } }];
    btns.push({ label: "Torna", fn: leave });
    forceButtons(btns);
  }
  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;
    registerZone("lo_banchina", { name: "Banchina", short: "Banchina", w: 40, h: 26, start: [20, 16], npcs: [{ id: "lo_mira", at: [12, 10] }] });
    if (a.CAST) a.CAST.lo_mira = { name: "Mira Voss", tag: "gold" };
  }
  window.__legaOmbre = { version: 3, open: openMain, menuEntry: function (back) { return { label: "La Lega delle Ombre", cls: "hot", fn: function () { openMain({ onExit: back }); }, sub: "Torneo clandestino" }; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
