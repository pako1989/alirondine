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
    var zr = ZONES[zid]; if (!zr) return;
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
      w: spec.w || 48,
      h: spec.h || 32,
      start: spec.start || [24, 20],
      theme: "torino",
      bus: "cancello",
      busLabel: "Esci dal Vuoto di Sale",
      npcs: spec.npcs || [],
      areas: spec.areas || [],
      me: function () {
        var c = api.CAST.hero || api.CAST.leo || {};
        return Object.assign({}, c, { shirt: "#fbbf24" });
      }
    };
    Z.tile = function (ch, sx, sy, tx, ty) {
      var g = document.getElementById("cv").getContext("2d");
      var n = (tx * 17 + ty * 11) % 8;
      var cols = ["#f8fafc","#e2e8f0","#cbd5e1","#f1f5f9","#d6d3d1","#e7e5e4","#fafaf9","#f5f5f4"];
      g.fillStyle = cols[n];
      g.fillRect(sx, sy, 16, 16);
      if (ch === "A") { g.fillStyle = "#7c2d12"; g.fillRect(sx, sy, 16, 16); }
      if (ch === "C") {
        g.fillStyle = "#fbbf24";
        g.beginPath(); g.arc(sx+8, sy+8, 5, 0, Math.PI*2); g.fill();
        g.fillStyle = "#fef3c7"; g.fillRect(sx+6, sy+4, 2, 4);
      }
      if (ch === "D") { g.fillStyle = "#92400e"; g.fillRect(sx, sy+5, 16, 6); }
      if (ch === "W") { g.fillStyle = "#1e293b"; g.fillRect(sx, sy, 16, 16); }
    };
    Z.menu = function () {
      var m = mem();
      api.trAsk("voce", "<b>Vuoto di Sale</b><br>Frammenti: " + (m.memories||0) + "<br>Capitolo 1: " + (m.ch1done ? "concluso" : "in corso"), [
        { label: "Diario del Sale", fn: function () { api.trAsk("voce", "Frammenti: " + (m.memories||0), [{ label: "Indietro", fn: function () { api.trGo(zid); } }]); } },
        { label: "Esci", cls: "hot", fn: leave }
      ]);
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
    if (!h) {
      return api.scene("sale_dune", "voce", "<b>Cronache del Vuoto di Sale</b><br>Questa saga richiede il tuo Campione.", [
        { label: "Crea il tuo Campione", cls: "hot", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } },
        { label: "Torna", fn: leave }
      ], "Vuoto di Sale");
    }
    var m = mem();
    api.scene("sale_citta", "voce", "<b>Cronache del Vuoto di Sale</b><br>" + h.name + " · n. " + h.num + "<br><span style=\"color:#fbbf24\">Il sale ricorda cio che tu hai dimenticato.</span>", [
      { label: "Entra nelle Dune di Sale", cls: "hot", fn: function () { enterZone("vs_dune"); } },
      { label: "Diario del Sale", sub: "Frammenti: " + (m.memories||0), fn: function () { api.scene("sale_diario", "voce", "Frammenti: " + (m.memories||0), [{ label: "Indietro", fn: openMain }]); } },
      { label: "Torna", fn: leave }
    ], "Vuoto di Sale");
  }

  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;

    registerZone("vs_dune", {
      name: "Dune di Sale Bianco",
      short: "Dune di Sale",
      sub: "Il vento porta voci dimenticate",
      w: 48, h: 32,
      start: [24, 20],
      npcs: [
        { id: "vs_lira", at: [14, 12] },
        { id: "vs_orrin", at: [34, 22] },
        { id: "vs_kael", at: [20, 8] },
        { id: "vs_signora", at: [30, 14] }
      ],
      areas: [[8, 6, 18, 16, "La Carovana di Lira"], [26, 16, 40, 26, "I Cristalli di Orrin"], [16, 4, 26, 12, "La Miniera di Kael"], [24, 10, 36, 18, "La Signora dei Contratti"]]
    });

    if (a.CAST) {
      a.CAST.vs_lira = a.CAST.vs_lira || { name: "Lira la Guida", tag: "gold", skin: "#c4a484", eye: "#3a2a1a", hair: "#92400e", style: "long" };
      a.CAST.vs_orrin = a.CAST.vs_orrin || { name: "Orrin del Sale", tag: "dim", skin: "#d6d3d1", eye: "#1e293b", hair: "#a8a29e", beard: true };
      a.CAST.vs_kael = a.CAST.vs_kael || { name: "Kael il Cieco", tag: "dim", skin: "#a8a29e", eye: "#57534e" };
      a.CAST.vs_signora = a.CAST.vs_signora || { name: "Signora dei Contratti", tag: "hot", skin: "#f5d0a9", eye: "#7c2d12", hair: "#1e293b", style: "bun" };
    }

    var prev = window.trTalkHook;
    window.trTalkHook = function (id) {
      if (id === "vs_lira") {
        api.scene("sale_dune", "vs_lira", "Il vento di sale porta il tuo nome, Campione. Non sei il primo ad arrivare. Le dune si spostano sotto i piedi della carovana aerea. La Citta di Cristallo e a est, ma il sale rivela solo a chi e disposto a perdere un ricordo.", [{ label: "Capito", fn: function () { api.trGo("vs_dune"); } }]);
        return true;
      }
      if (id === "vs_orrin") {
        api.scene("sale_dune", "vs_orrin", "Il sale ricorda chi sei anche se tu non lo fai. Qualcuno ha gia firmato un Contratto con il tuo nome. Forse sei tu, in un altro strato di dune. Forse sei solo l eco di te stesso.", [{ label: "Continua", fn: function () { api.trGo("vs_dune"); } }]);
        return true;
      }
      if (id === "vs_kael") {
        var m = mem();
        api.scene("sale_miniera", "vs_kael", "Le memorie solidificate... le sento. Alcune sono tue. Alcune sono di qualcuno che ti assomiglia troppo. Non fidarti del sale quando ti parla con la tua voce.", [{ label: "Raccogli un frammento", cls: "hot", fn: function () { m.memories = (m.memories||0)+1; memSet(m); api.trGo("vs_dune"); } }]);
        return true;
      }
      if (id === "vs_signora") {
        api.scene("sale_citta", "vs_signora", "Sei arrivato, Campione. Il Contratto di Memoria e pronto. Firmando, il sale ti mostrera la verita: qualcuno ha gia vissuto questa storia. Forse sei tu. Forse sei l ultimo.", [
          { label: "Firma il Contratto", cls: "hot", fn: function () {
            var m = mem(); m.ch1done = true; m.memories = (m.memories||0)+1; memSet(m);
            api.scene("sale_citta", "voce", "<b>Contratto firmato.</b><br>Il cristallo si frantuma. Una voce dice: Non sei il primo. Non sarai l ultimo.<br><br>Per un istante vedi te stesso in un altro tempo che firma e poi dimentica.<br><br><b>Capitolo 1 concluso.</b>", [{ label: "Torna alle dune", fn: function () { api.trGo("vs_dune"); } }]);
          } },
          { label: "Chiedi il prezzo", fn: function () { api.scene("sale_citta", "vs_signora", "Il prezzo e un ricordo che credevi tuo. Dopo la firma saprai se era davvero tuo.", [{ label: "Firma", cls: "hot", fn: function () { api.trGo("vs_dune"); } }]); } }
        ]);
        return true;
      }
      if (typeof prev === "function") return prev(id);
    };
  }

  window.__vuotoSaleStory = {
    version: 4,
    open: openMain,
    menuEntry: function (back) {
      var h = hero();
      var m = mem();
      return {
        label: "Cronache del Vuoto di Sale",
        cls: "hot",
        fn: function () { openMain({ onExit: back }); },
        sub: h ? h.name + " · " + (m.ch1done ? "Capitolo 1 concluso" : "Dune camminabili") : "Crea il tuo Campione · Sci-fi western"
      };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
