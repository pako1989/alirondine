// ================= v14 · TRE PARTITE SALVATE: strato di memoria caricato prima di tutto il resto =================
// Partita 1 = la memoria di sempre, senza alcuna modifica (nessuna migrazione, nessun cambio di chiave).
// Partite 2 e 3 usano chiavi con un altro prefisso («ali-di-rondine@2.», «ali-di-rondine@3.»): il gioco continua a chiamare localStorage
// con i nomi di sempre e questo strato li traduce. La partita attiva si ricorda in «ali-di-rondine.slotmeta» (la sola chiave condivisa).
(function () {
  var P1 = "ali-di-rondine.", META = P1 + "slotmeta", RAW = null, ok = false;
  try { RAW = window.localStorage; RAW.getItem("x"); ok = true; } catch (e) { ok = false; }
  var S = { ok: ok, cur: 1, RAW: RAW, META: META, P1: P1, fail: false };
  S.pref = function (n) { return n === 1 ? P1 : "ali-di-rondine@" + n + "."; };
  if (ok) {
    S.meta = function () { var m = null; try { m = JSON.parse(RAW.getItem(META) || "null"); } catch (e) {} if (!m || typeof m !== "object" || Array.isArray(m)) m = {}; if (!m.names || typeof m.names !== "object") m.names = {}; if (!m.t || typeof m.t !== "object") m.t = {}; return m; };
    S.save = function (m) { try { RAW.setItem(META, JSON.stringify(m)); return true; } catch (e) { return false; } };
    S.keysOf = function (n) { var out = [], p = S.pref(n); try { for (var i = 0; i < RAW.length; i++) { var k = RAW.key(i); if (k && k.indexOf(p) === 0 && k !== META) out.push(k); } } catch (e) {} return out; };
    var m = S.meta(), cur = m.cur === 2 || m.cur === 3 ? m.cur : 1;
    if (cur !== 1) {
      var Pn = S.pref(cur);
      var map = function (k) { k = String(k); return k.indexOf(P1) === 0 && k !== META ? Pn + k.slice(P1.length) : k; };
      var keys = function () { return S.keysOf(cur).map(function (k) { return P1 + k.slice(Pn.length); }); };
      var px = {
        getItem: function (k) { return RAW.getItem(map(k)); },
        setItem: function (k, v) { RAW.setItem(map(k), v); },
        removeItem: function (k) { RAW.removeItem(map(k)); },
        key: function (i) { var a = keys(); return i >= 0 && i < a.length ? a[i] : null; },
        clear: function () { S.keysOf(cur).forEach(function (k) { RAW.removeItem(k); }); }
      };
      Object.defineProperty(px, "length", { get: function () { return keys().length; } });
      try { Object.defineProperty(window, "localStorage", { configurable: true, get: function () { return px; } }); S.cur = cur; }
      catch (e) { S.fail = true; S.cur = 1; m.cur = 1; S.save(m); }
    }
    try { var m2 = S.meta(); m2.t[S.cur] = Date.now(); S.save(m2); } catch (e) {}
    var touch = function () { try { var m3 = S.meta(); m3.t[S.cur] = Date.now(); S.save(m3); } catch (e) {} };
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") touch(); });
    window.addEventListener("pagehide", touch);
  }
  window.__SLOT = S;
})();
