// Cronache del Vuoto di Sale · Capitolo 1: le Dune di Sale (zona camminabile)
(function () {
  "use strict";
  if (window.__vuotoSaleStoryLoaded) return;
  window.__vuotoSaleStoryLoaded = true;

  var KEY = "ali-di-rondine.vuoto-sale";
  var BG = "vl_paese";
  var TS = 16;
  var tries = 0, api = null, EXIT = null;
  var ZID = "vs_dune";

  function mem() {
    var m = {};
    try { m = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
    if (!Array.isArray(m.frag)) m.frag = [];
    return m;
  }
  function save(m) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} }
  function hero() { try { return window.heroLoad ? window.heroLoad() : null; } catch (e) { return null; } }

  function castHero() {
    var h = hero(); if (!h || !api.CAST) return;
    api.CAST.hero = {
      name: h.name, tag: "viandante", hair: h.hair, style: h.style, skin: h.skin, eye: h.eye || "#2a2a2a",
      bg: ["#451a03", "#f59e0b"], shirt: "#d97706", num: String(h.num), acc: h.acc
    };
  }
  function T(t) { var h = hero(); return String(t).replace(/\{n\}/g, h ? h.name : "Campione"); }
  function say(id, text, then) {
    castHero();
    api.trSay([api.L(id, T(text), BG)], then || api.trResume);
  }

  function leave() {
    var b = EXIT || window.title;
    EXIT = null;
    api.trExitTo(typeof b === "function" ? b : null);
  }

  var NPCS = {
    vs_lira: {
      cast: { name: "Lira la Guida", tag: "guida", skin: "#c4a484", eye: "#3a2a1a", hair: "#92400e", style: "long", bg: ["#451a03", "#f59e0b"], shirt: "#b45309" },
      at: [14, 12],
      talk: function () {
        say("vs_lira", "Il vento di sale porta il tuo nome, {n}. Non sei il primo ad arrivare. La Città di Cristallo è a est, ma il sale la rivela solo a chi è disposto a perdere un ricordo.");
      }
    },
    vs_orrin: {
      cast: { name: "Orrin del Sale", tag: "cercatore", skin: "#d6d3d1", eye: "#1e293b", hair: "#a8a29e", beard: true, bg: ["#1e293b", "#94a3b8"], shirt: "#475569" },
      at: [34, 22],
      talk: function () {
        say("vs_orrin", "Il sale ricorda chi sei anche se tu non lo fai. Qualcuno ha già firmato un Contratto con il tuo nome. Forse sei tu, in un altro strato di dune.");
      }
    },
    vs_kael: {
      cast: { name: "Kael il Cieco", tag: "minatore", skin: "#a8a29e", eye: "#57534e", hair: "#44403c", bg: ["#292524", "#78716c"], shirt: "#57534e" },
      at: [20, 8],
      talk: function () {
        var m = mem();
        var txt = "Le memorie solidificate... le sento. Alcune sono tue, altre sono di qualcuno che ti assomiglia troppo. Non fidarti del sale quando ti parla con la tua voce.";
        if (m.frag.indexOf("kael") >= 0) return say("vs_kael", txt);
        api.trAsk("vs_kael", T(txt), [
          { label: "Raccogli un frammento", cls: "hot", fn: function () {
            var mm = mem(); if (mm.frag.indexOf("kael") < 0) mm.frag.push("kael"); save(mm);
            say("vs_kael", "Tienilo stretto. Il sale lo vuole indietro.");
          } },
          { label: "Non ora", fn: api.trResume }
        ], BG);
      }
    },
    vs_signora: {
      cast: { name: "Signora dei Contratti", tag: "notaio", skin: "#f5d0a9", eye: "#7c2d12", hair: "#1e293b", style: "bun", bg: ["#450a0a", "#dc2626"], shirt: "#7f1d1d" },
      at: [30, 14],
      talk: function () {
        var m = mem();
        if (m.ch1done) return say("vs_signora", "Il Contratto è firmato. Il sale non dimentica, {n}. Tu invece sì.");
        api.trAsk("vs_signora", T("Sei arrivato, {n}. Il Contratto di Memoria è pronto. Firmando, il sale ti mostrerà la verità: qualcuno ha già vissuto questa storia. Forse sei tu. Forse sei l'ultimo."), [
          { label: "Firma il Contratto", cls: "hot", fn: function () {
            var mm = mem(); mm.ch1done = true; if (mm.frag.indexOf("contratto") < 0) mm.frag.push("contratto"); save(mm);
            api.scene(BG, "voce", "<b>Contratto firmato.</b><br>Il cristallo si frantuma. Una voce dice: «Non sei il primo. Non sarai l'ultimo.»<br><br>Per un istante vedi te stesso, in un altro tempo, che firma e poi dimentica.<br><br><b>Capitolo 1 concluso.</b>", [
              { label: "Torna alle dune", cls: "hot", fn: function () { api.trGo(ZID); } }
            ], "Vuoto di Sale");
          } },
          { label: "Chiedi il prezzo", fn: function () { say("vs_signora", "Il prezzo è un ricordo che credevi tuo. Dopo la firma saprai se lo era davvero."); } },
          { label: "Non ora", fn: api.trResume }
        ], BG);
      }
    }
  };

  function paint(ch, sx, sy, tx, ty) {
    var g = document.getElementById("cv").getContext("2d");
    var cols = ["#f8fafc", "#e2e8f0", "#cbd5e1", "#f1f5f9", "#e7e5e4", "#fafaf9"];
    g.fillStyle = cols[(tx * 17 + ty * 11) % cols.length];
    g.fillRect(sx, sy, 16, 16);
    if ((tx * 7 + ty * 3) % 11 === 0) { g.fillStyle = "#cbd5e1"; g.fillRect(sx + 3, sy + 9, 5, 1); }
    if (ch === "#") {
      g.fillStyle = "#64748b"; g.fillRect(sx + 1, sy + 4, 14, 12);
      g.fillStyle = "#e0f2fe"; g.fillRect(sx + 3, sy + 1, 4, 5); g.fillRect(sx + 9, sy + 3, 3, 4);
      g.fillStyle = "#38bdf8"; g.fillRect(sx + 4, sy + 2, 1, 3);
    }
    return true;
  }

  function registerZone() {
    var W = 48, H = 32;
    var Z = {
      name: "Dune di Sale Bianco", short: "Dune di Sale", sub: "Il vento porta voci dimenticate", need: 0,
      w: W, h: H, start: [24, 20], theme: "torino", bus: "cancello", busLabel: "Esci dal Vuoto di Sale",
      item: ["Frammento", "Frammenti"], items: [], bld: [], act: {}, hints: {}, pitch: [-20, -20, 1, 1],
      npcs: Object.keys(NPCS).map(function (id) { return { id: id, at: NPCS[id].at }; }),
      areas: [
        [8, 6, 18, 16, "La Carovana di Lira"], [26, 16, 40, 26, "I Cristalli di Orrin"],
        [16, 4, 26, 12, "La Miniera di Kael"], [24, 10, 36, 18, "La Signora dei Contratti"]
      ],
      me: function () {
        var c = api.CAST.hero || api.CAST.leo || {};
        return Object.assign({}, c, { shirt: "#fbbf24" });
      }
    };
    Z.build = function (m, fill) {
      fill(0, 0, W - 1, H - 1, ",");
      fill(0, 0, W - 1, 1, "#"); fill(0, H - 2, W - 1, H - 1, "#");
      fill(0, 0, 1, H - 1, "#"); fill(W - 2, 0, W - 1, H - 1, "#");
      [[10, 20], [11, 20], [38, 8], [39, 8], [40, 8], [28, 26], [29, 26], [6, 14], [22, 26], [44, 18], [18, 18], [32, 10]].forEach(function (p) { m[p[1]][p[0]] = "#"; });
    };
    Z.tile = paint;
    Z.menu = function () {
      var m = mem();
      api.trAsk("voce", "<b>Vuoto di Sale</b><br>Frammenti: " + m.frag.length + "<br>Capitolo 1: " + (m.ch1done ? "concluso" : "in corso") + "<br><span style=\"color:var(--dim)\">Parla con Lira, Orrin, Kael e la Signora dei Contratti.</span>", [
        { label: "◂ Torna a esplorare", cls: "hot", fn: api.trResume },
        { label: "Esci dal Vuoto di Sale", sub: "I progressi restano salvati", fn: leave }
      ], BG);
    };
    api.TRZ[ZID] = Z;
  }

  function enterZone() {
    var m = mem(); m.zone = ZID; save(m);
    castHero();
    api.trRec().seen[ZID] = true;
    api.trGo(ZID);
  }

  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = hero();
    if (!h) {
      if (window.heroCreate) return window.heroCreate(function () { openMain(); });
      return api.scene(BG, "voce", "<b>Cronache del Vuoto di Sale</b><br>Crea prima il tuo Campione dal menu principale.", [{ label: "Torna", fn: leave }], "Vuoto di Sale");
    }
    var m = mem();
    castHero();
    api.scene(BG, "voce", "<b>Cronache del Vuoto di Sale</b><br>" + h.name + " · n. " + h.num + "<br><span style=\"color:#fbbf24\">Il sale ricorda ciò che tu hai dimenticato.</span>", [
      { label: "Entra nelle Dune di Sale", cls: "hot", fn: enterZone },
      { label: "Diario del Sale", sub: "Frammenti: " + m.frag.length, fn: function () {
        var mm = mem();
        api.scene(BG, "voce", "<b>Diario del Sale</b><br>Frammenti raccolti: " + mm.frag.length + "<br>Capitolo 1: " + (mm.ch1done ? "concluso" : "in corso"), [{ label: "◂ Indietro", fn: openMain }], "Vuoto di Sale");
      } },
      { label: "◂ Torna", fn: leave }
    ], "Vuoto di Sale");
  }

  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ || !a.trSay || !a.trAsk || !a.L || !a.CAST) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;
    Object.keys(NPCS).forEach(function (id) { if (!a.CAST[id]) a.CAST[id] = NPCS[id].cast; });
    registerZone();
    var desc = Object.getOwnPropertyDescriptor(window, "trTalkHook");
    var chained = !(desc && desc.set);
    var prev = chained ? window.trTalkHook : null;
    window.trTalkHook = function (id) {
      if (NPCS[id] && api.trZone && api.trZone() === ZID) { NPCS[id].talk(); return true; }
      return chained && typeof prev === "function" ? prev(id) : false;
    };
  }

  window.__vuotoSaleStory = {
    version: 7,
    open: openMain,
    menuEntry: function (back) {
      var h = hero(), m = mem();
      return {
        label: "Cronache del Vuoto di Sale", cls: "hot",
        fn: function () { openMain({ onExit: back }); },
        sub: h ? h.name + " · " + (m.ch1done ? "Capitolo 1 concluso" : "Dune camminabili") : "Crea il tuo Campione · Sci-fi western"
      };
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
