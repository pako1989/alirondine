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
      w: spec.w || 36,
      h: spec.h || 24,
      start: spec.start || [18, 14],
      theme: "torino",
      bus: "cancello",
      busLabel: "Esci dalla Lega",
      npcs: spec.npcs || [],
      areas: spec.areas || [],
      me: function () {
        var c = api.CAST.hero || api.CAST.leo || {};
        return Object.assign({}, c, { shirt: "#1e293b" });
      }
    };
    Z.tile = function (ch, sx, sy, tx, ty) {
      var g = document.getElementById("cv").getContext("2d");
      var n = (tx * 13 + ty * 7) % 5;
      var cols = ["#1e293b", "#334155", "#475569", "#1e1b4b", "#312e81"];
      g.fillStyle = cols[n];
      g.fillRect(sx, sy, 16, 16);
      if (ch === "A") { g.fillStyle = "#0f172a"; g.fillRect(sx, sy, 16, 16); }
      if (ch === "C") { g.fillStyle = "#fbbf24"; g.fillRect(sx + 4, sy + 4, 8, 8); }
    };
    Z.menu = function () {
      api.trAsk("voce", "<b>Lega delle Ombre</b><br>Torneo clandestino del porto.", [
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

  function playMatch(onDone) {
    if (!api || !api.matchPick) { alert("Motore partita non disponibile"); return; }
    api.matchPick({
      us: "Ombre",
      team: "Riva Nera",
      min: 20,
      intro: "Partita della Lega delle Ombre. Campo di terra battuta, luci basse.",
      onDone: function (r) {
        var m = mem();
        if (r && r.win) m.wins = (m.wins || 0) + 1;
        else m.losses = (m.losses || 0) + 1;
        memSet(m);
        if (onDone) onDone(r);
      }
    });
  }

  function openMain(o) {
    if (o && typeof o.onExit === "function") EXIT = o.onExit;
    var h = hero();
    if (!h) {
      return api.scene("vl_paese", "voce", "<b>La Lega delle Ombre</b><br>Questa saga richiede il tuo Campione.", [
        { label: "Crea il tuo Campione", cls: "hot", fn: function () { if (window.heroEditor) window.heroEditor(openMain); } },
        { label: "Torna", fn: leave }
      ], "Lega delle Ombre");
    }
    var m = mem();
    api.scene("vl_paese", "voce", "<b>La Lega delle Ombre</b><br>" + h.name + " · n. " + h.num + "<br><span style=\"color:#a78bfa\">Torneo clandestino del porto. Qualcuno ti ha invitato.</span>", [
      { label: "Entra nella Banchina", cls: "hot", fn: function () { enterZone("lo_banchina"); } },
      { label: "Diario", sub: "Vittorie: " + (m.wins || 0), fn: function () { api.scene("vl_paese", "voce", "Vittorie: " + (m.wins || 0) + "<br>Sconfitte: " + (m.losses || 0), [{ label: "Indietro", fn: openMain }]); } },
      { label: "Torna", fn: leave }
    ], "Lega delle Ombre");
  }

  function init() {
    var a = window.__borgoApi;
    if (!a || !a.scene || !a.trGo || !a.TRZ) { if (++tries < 200) setTimeout(init, 150); return; }
    api = a;

    registerZone("lo_banchina", {
      name: "Banchina delle Ombre",
      short: "Banchina",
      sub: "Luci basse, voci basse",
      w: 40, h: 26,
      start: [20, 16],
      npcs: [
        { id: "lo_mira", at: [12, 10] },
        { id: "lo_corvo", at: [28, 18] }
      ],
      areas: [[6, 6, 18, 14, "La Banchina"], [22, 12, 36, 22, "Il Molo Buio"]]
    });

    registerZone("lo_magazzino", {
      name: "Magazzino dei Contratti",
      short: "Magazzino",
      sub: "Qui si firmano le cose",
      w: 32, h: 20,
      start: [16, 12],
      npcs: [{ id: "lo_signore", at: [16, 8] }],
      areas: [[4, 4, 28, 16, "Il Magazzino"]]
    });

    registerZone("lo_campo", {
      name: "Campo di Terra Battuta",
      short: "Campo",
      sub: "Dove si decide",
      w: 36, h: 24,
      start: [18, 14],
      npcs: [{ id: "lo_riva", at: [18, 10] }],
      areas: [[8, 6, 28, 18, "Il Campo"]]
    });

    if (a.CAST) {
      a.CAST.lo_mira = a.CAST.lo_mira || { name: "Mira Voss", tag: "gold", skin: "#d4a574", eye: "#1e293b", hair: "#0f172a", style: "long" };
      a.CAST.lo_corvo = a.CAST.lo_corvo || { name: "Corvo", tag: "dim", skin: "#a8a29e", eye: "#57534e", hair: "#1e293b" };
      a.CAST.lo_signore = a.CAST.lo_signore || { name: "Il Signore del Porto", tag: "hot", skin: "#e7e5e4", eye: "#7c2d12", hair: "#1e293b", style: "slick" };
      a.CAST.lo_riva = a.CAST.lo_riva || { name: "Riva Nera", tag: "blue", skin: "#c4a484", eye: "#1e3a5f", hair: "#0f172a" };
    }

    var prev = window.trTalkHook;
    window.trTalkHook = function (id) {
      if (id === "lo_mira") {
        api.scene("vl_paese", "lo_mira", "Sei arrivato. La Lega non invita a caso. Qualcuno ha messo il tuo nome sulla lista. Non so chi. Non so perche. Ma se vuoi giocare, il campo e oltre il magazzino.", [
          { label: "Chiedi del Signore", fn: function () { api.scene("vl_paese", "lo_mira", "Il Signore del Porto non si fa vedere spesso. Dice che organizza per divertimento. Io non ci credo.", [{ label: "Capito", fn: function () { api.trGo("lo_banchina"); } }]); } },
          { label: "Vai al magazzino", cls: "hot", fn: function () { enterZone("lo_magazzino"); } }
        ]);
        return true;
      }
      if (id === "lo_corvo") {
        api.scene("vl_paese", "lo_corvo", "Io gioco da tre anni. Ho visto gente entrare e non uscire piu. Non nel senso che muoiono. Nel senso che dopo non ricordano perche sono venuti.", [{ label: "Continua", fn: function () { api.trGo("lo_banchina"); } }]);
        return true;
      }
      if (id === "lo_signore") {
        api.scene("vl_paese", "lo_signore", "Campione. Ti ho fatto chiamare io. Non per il torneo. Per una partita. Contro Riva Nera. Se vinci, ti dico perche sei qui. Se perdi, te lo dico lo stesso. Ma preferisco che tu vinca.", [
          { label: "Accetto la sfida", cls: "hot", fn: function () { enterZone("lo_campo"); } },
          { label: "Chiedi il prezzo", fn: function () { api.scene("vl_paese", "lo_signore", "Il prezzo e sempre lo stesso: un pezzo di te che non sapevi di avere. A volte e un ricordo. A volte e un nome.", [{ label: "Vado al campo", cls: "hot", fn: function () { enterZone("lo_campo"); } }]); } }
        ]);
        return true;
      }
      if (id === "lo_riva") {
        api.scene("vl_paese", "lo_riva", "Sei tu. Il nuovo. Il Signore dice che sei speciale. Io dico che sei solo un altro nome sulla lista. Facciamo la partita.", [
          { label: "Gioca la partita", cls: "hot", fn: function () {
            playMatch(function (r) {
              var won = r && r.win;
              api.scene("vl_paese", "voce", won ? "<b>Hai vinto.</b><br>Riva Nera si ferma. Il Signore del Porto appare sul bordo del campo.<br><br>\"Ora sai che non sei il primo. E non sarai l ultimo. La Lega esiste perche qualcuno deve ricordare le partite che gli altri dimenticano.\"" : "<b>Hai perso.</b><br>Riva Nera non dice nulla. Il Signore del Porto appare comunque.<br><br>\"La sconfitta non cambia nulla. Sei ancora nella lista.\"", [
                { label: "Torna alla banchina", fn: function () { enterZone("lo_banchina"); } }
              ]);
            });
          } },
          { label: "Non ora", fn: function () { api.trGo("lo_campo"); } }
        ]);
        return true;
      }
      if (typeof prev === "function") return prev(id);
    };
  }

  window.__legaOmbre = {
    version: 1,
    open: openMain,
    menuEntry: function (back) {
      var h = hero();
      var m = mem();
      return {
        label: "La Lega delle Ombre",
        cls: "hot",
        fn: function () { openMain({ onExit: back }); },
        sub: h ? h.name + " · " + ((m.wins || 0) > 0 ? "Partita giocata" : "Torneo clandestino") : "Crea il tuo Campione"
      };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
