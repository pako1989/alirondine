// js/diario-scoperte.js - «Il Diario del Corriere»: una pagina unica che riassume tutto quello che hai scoperto, per chi torna dopo qualche giorno.
// Sola lettura dallo stato esistente (API pubbliche window.__cageHd / __actionHd / __directorHd / __moloSettimana / __recluteBorgo / __borgoApi,
// window.prog / borgoLoad / svRec e chiavi localStorage "ali-di-rondine.*": la localStorage passa dal livello delle partite salvate, quindi vale per lo slot attivo).
// Unico salvataggio: "ali-di-rondine.diario-scoperte" ({t, v:{id:valore}}) per il confronto «visto / nuovo».
// Niente spoiler: le cose non ancora scoperte compaiono come "???" con un indizio generico (mai nomi di eventi, finali o colpi di scena).
// API: window.__diarioScoperte = { open({onExit}), close(), info() }. Se esiste window.__borgoApi aggiunge una voce a MN_BORGO_BTN.
// Va incluso DOPO game.js (e dopo gli altri moduli: legge le loro API solo al momento dell'uso).
(function () {
  "use strict";
  if (window.__diarioScoperteLoaded) return;
  window.__diarioScoperteLoaded = true;

  var KEY = "ali-di-rondine.diario-scoperte";

  // ---------------------------------------------------------------- utilità
  function rj(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function obj(o) { return o && typeof o === "object" && !Array.isArray(o) ? o : {}; }
  function cnt(o) { return o && typeof o === "object" ? Object.keys(o).filter(function (k) { return o[k]; }).length : 0; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fn(f) { return typeof f === "function"; }
  function plural(n, one, many) { return n === 1 ? one : many; }
  function borgo() { try { if (fn(window.borgoLoad)) return window.borgoLoad() || {}; } catch (e) { /* ignora */ } return obj(rj("ali-di-rondine.borgo", {})); }

  // ---------------------------------------------------------------- raccolta voci (tutto in sola lettura, ogni voce protetta)
  // voce: { id, g (gruppo), ico, name, st: done|prog|todo|lock, cur, tot?, line, go?: {label, run(onBack)}, hint? }
  var GROUPS = [
    { k: "storia", n: "Storia e carriera", ico: "📖" },
    { k: "borgo", n: "Il Borgo e le trasferte", ico: "🗺️" },
    { k: "molo", n: "Sul Molo", ico: "⚓" },
    { k: "gente", n: "Gente incontrata", ico: "🧑‍🤝‍🧑" },
    { k: "coll", n: "Collezioni", ico: "🎰" },
  ];
  var HINT = {
    zona: "Una zona nuova ti aspetta.",
    sfida: "Qualche sfida in più ti aspetta.",
    gente: "Qualcuno ha ancora una storia da raccontare.",
    stagione: "Altre pagine di questa storia ti aspettano.",
    coll: "Là fuori c'è ancora qualcosa da trovare.",
  };

  function st(cur, tot) { return tot && cur >= tot ? "done" : cur > 0 ? "prog" : "todo"; }

  function collect(ctx) {
    var out = [], api = window.__borgoApi || null;
    function add(f) { try { var r = f(); if (r) (Array.isArray(r) ? r : [r]).forEach(function (e) { out.push(e); }); } catch (e) { /* una voce rotta non rompe il Diario */ } }

    // --- Storia (stagioni concluse)
    add(function () {
      var p = fn(window.prog) ? window.prog() : { n: 0 }, n = p.n | 0;
      [10, 11, 12].forEach(function (i) { var r = obj(rj("ali-di-rondine.stagione" + i, null)); if ((r.won && r.won.length) || r.played > 0 || r.end) n++; });
      n = Math.min(12, n);
      var live = p.live && p.season ? p.season : 0;
      var line = n ? "Stagioni concluse: " + n + (live ? " · la " + live + "ª è in corso" : "") : (live ? "La prima stagione è in corso" : "La storia non è ancora cominciata");
      var e = { id: "storia", g: "storia", ico: "📖", name: "Storia a stagioni", st: n >= 12 ? "done" : (n || live) ? "prog" : "todo", cur: n, tot: 12, line: line };
      return [e, n < 12 && (n || live) ? { id: "storia-ancora", g: "storia", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.stagione } : null].filter(Boolean);
    });

    // --- Carriera
    add(function () {
      var r = obj(rj("ali-di-rondine.carriera.record", null)), cur = rj("ali-di-rondine.carriera", null);
      var s = r.seasons | 0, t = r.titles | 0, on = !!(cur && cur.fixtures);
      return { id: "carriera", g: "storia", ico: "🏟️", name: "Carriera", st: s || on ? "prog" : "todo", cur: s, line: s || on ? ("Stagioni " + s + " · titoli " + t + (on ? " · una campagna è aperta" : "")) : "Non l'hai ancora provata" };
    });

    // --- Borgo: cosmetici e conchiglie
    add(function () {
      var b = borgo(), sh = (b.shells || []).length, co = (b.cos || []).length;
      return { id: "borgo-tesori", g: "borgo", ico: "🐚", name: "Conchiglie e ricordi del Borgo", st: sh >= 8 ? "done" : sh || co ? "prog" : "todo", cur: sh, tot: 8, line: "Conchiglie " + sh + "/8 · cosmetici sbloccati " + co };
    });

    // --- Trasferte (zone visitabili, una riga per zona; le zone chiuse diventano una sola riga ???)
    add(function () {
      if (!api || !api.TRZ) return null;
      var b = borgo(), tr = obj(b.tr), seen = obj(tr.seen), got = obj(tr.got), lvl = 0;
      try { lvl = fn(api.trLevel) ? api.trLevel() : 0; } catch (e) { /* ignora */ }
      var ids = (api.TR_IDS && api.TR_IDS.length ? api.TR_IDS : Object.keys(api.TRZ)), rows = [], closed = 0, totSeen = 0, totTre = 0, gotTre = 0;
      ids.forEach(function (id) {
        var z = api.TRZ[id]; if (!z) return;
        var open = (z.need | 0) <= lvl, n = (got[id] || []).length, t = (z.items || []).length;
        if (!open) { closed++; return; }
        var vis = !!seen[id]; if (vis) totSeen++; totTre += t; gotTre += Math.min(n, t);
        var e = { id: "zona-" + id, g: "borgo", ico: "🚌", name: z.short || z.name, st: !vis ? "todo" : (t && n >= t) ? "done" : "prog", cur: (vis ? 1 : 0) + n, tot: t + 1,
          line: vis ? (String(z.item && z.item[1] || "Tesori") + " " + n + "/" + t) : "Mai visitata" };
        if (api.trGo && ctx.borgo) e.go = { label: "Vai · " + (z.short || z.name), run: function () { ctx.leave(); api.trGo(id); } };
        rows.push(e);
      });
      var head = { id: "trasferte", g: "borgo", ico: "🧭", name: "Trasferte", st: st(totSeen, ids.length - closed), cur: totSeen, tot: Math.max(1, ids.length - closed), line: "Luoghi visitati " + totSeen + "/" + (ids.length - closed) + " · tesori " + gotTre + "/" + totTre };
      var res = [head].concat(rows);
      if (closed) res.push({ id: "zone-chiuse", g: "borgo", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.zona });
      return res;
    });

    // --- Reclute e missioni del Borgo
    add(function () {
      var rb = window.__recluteBorgo; if (!rb || !fn(rb.info)) return null;
      var i = rb.info(), done = i.done | 0, tot = i.total | 0, e = { id: "reclute", g: "borgo", ico: "🧢", name: "Reclute e missioni", st: st(done, tot), cur: done, tot: tot, line: "Completate " + done + "/" + tot + (i.ready ? " · " + i.ready + " " + plural(i.ready, "novità ti aspetta", "novità ti aspettano") : "") };
      var res = [e];
      try {
        var ms = fn(rb.missions) ? rb.missions() : [], hidden = ms.filter(function (m) { return !m.available && !m.done; }).length;
        if (hidden) res.push({ id: "reclute-altre", g: "borgo", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.gente });
        var rdy = ms.filter(function (m) { return m.available && !m.done; })[0];
        if (rdy && api && api.TRZ && api.TRZ[rdy.zone] && api.trGo && ctx.borgo) e.go = { label: "Vai · missione", run: function () { ctx.leave(); api.trGo(rdy.zone); } };
      } catch (x) { /* ignora */ }
      return res;
    });

    // --- Bacheca incarichi
    add(function () {
      var q = obj(rj("ali-di-rondine.questboard", null)), done = cnt(q.completed), act = cnt(q.active);
      if (!done && !act && !localStorage.getItem("ali-di-rondine.questboard")) return { id: "bacheca", g: "borgo", ico: "📌", name: "Bacheca degli incarichi", st: "todo", cur: 0, tot: 13, line: "Nessun incarico ancora" };
      var tot = Math.max(13, done);
      return { id: "bacheca", g: "borgo", ico: "📌", name: "Bacheca degli incarichi", st: st(done, tot), cur: done, tot: tot, line: "Completati " + done + "/" + tot + (act ? " · in corso " + act : "") };
    });

    // --- Quartier generale / Stelle
    add(function () {
      var r = fn(window.svRec) ? window.svRec() : { rec: {} }, n = cnt(r.rec);
      return { id: "stelle", g: "coll", ico: "⭐", name: "Quartier generale e Stelle", st: st(n, 108), cur: n, tot: 108, line: "Stelle reclutate " + n + " · la Casa ne aspetta 108 tra Stelle e residenti" };
    });

    // --- Sul Molo: Gabbia
    add(function () {
      var c = window.__cageHd; if (!c || !fn(c.info)) return null;
      var i = c.info(), stars = Array.isArray(i.stars) ? i.stars : [], lv = stars.length, cleared = stars.filter(function (x) { return x > 0; }).length, sum = stars.reduce(function (a, x) { return a + (x | 0); }, 0);
      var e = { id: "gabbia", g: "molo", ico: "👟", name: "Gabbia del Molo", st: st(cleared, lv), cur: cleared, tot: lv || 1, line: "Livelli superati " + cleared + "/" + lv + " · stelle " + sum + " · boss " + (i.bosses | 0) + " · titoli " + (i.titles | 0) + (i.dailyLeft ? " · sfide del giorno " + i.dailyLeft : "") };
      if (fn(c.start)) e.go = { label: "Vai · Gabbia", run: function (back) { c.start({ onExit: back }); } };
      var res = [e];
      if (lv && cleared < lv) res.push({ id: "gabbia-altri", g: "molo", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.sfida });
      return res;
    });

    // --- Sul Molo: Coppa
    add(function () {
      var a = window.__actionHd; if (!a || !fn(a.state)) return null;
      var s = a.state(), played = s.played | 0, ch = s.chapters | 0, tot = s.total | 0;
      var e = { id: "coppa", g: "molo", ico: "⚽", name: "Coppa del Molo", st: played ? st(ch, tot) : "todo", cur: ch, tot: tot || 1, line: played ? ("Capitoli aperti " + ch + "/" + tot + " · partite " + played + " · coppe vinte " + (s.cupWon | 0) + " · titoli " + (s.titles | 0)) : "Non l'hai ancora provata" };
      if (!played) e.cur = 0;
      if (fn(a.start)) e.go = { label: "Vai · Coppa", run: function (back) { a.start({ onExit: back }); } };
      var res = [e];
      if (tot && ch < tot) res.push({ id: "coppa-altri", g: "molo", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.sfida });
      return res;
    });

    // --- Sul Molo: Matchday Director (episodi)
    add(function () {
      var d = window.__directorHd; if (!d || !fn(d.state)) return null;
      var s = d.state(), won = s.won | 0, tot = s.total | 0, unl = s.unlocked | 0;
      var e = { id: "director", g: "molo", ico: "📋", name: "Matchday Director", st: s.played ? st(won, tot) : "todo", cur: won, tot: tot || 1, line: s.played ? ("Episodi vinti " + won + "/" + tot + " · stelle " + (s.stars | 0) + " · rosa " + (s.roster | 0) + "/" + (s.rosterTotal | 0) + " · grado " + (s.rank || "")) : "Non l'hai ancora provato" };
      if (fn(d.start)) e.go = { label: "Vai · Director", run: function (back) { d.start({ onExit: back }); } };
      var res = [e];
      if (tot && unl < tot) res.push({ id: "director-altri", g: "molo", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.sfida });
      return res;
    });

    // --- Sul Molo: Settimana
    add(function () {
      var m = window.__moloSettimana; if (!m || !fn(m.info)) return null;
      var i = m.info(), tier = i.tier | 0;
      var e = { id: "settimana", g: "molo", ico: "🏆", name: "Settimana del Molo", st: tier >= 3 ? "done" : (i.total || i.cups) ? "prog" : "todo", cur: tier, tot: 3, line: (i.total | 0) + " punti questa settimana" + (i.tierName ? " · " + i.tierName : "") + " · coppe " + (i.cups | 0) + (i.pins ? " · spille " + i.pins : "") };
      if (fn(m.open)) e.go = { label: "Vai · Settimana", run: function (back) { m.open({ onExit: back }); } };
      return e;
    });

    // --- Gente: rivali e Stelle incontrate
    add(function () {
      var r = obj(rj("ali-di-rondine.rivali", null)), rr = obj(r.r), met = Object.keys(rr).filter(function (k) { return rr[k] && rr[k].met; }).length;
      var w = Object.keys(rr).reduce(function (a, k) { return a + ((rr[k] && rr[k].w) | 0); }, 0);
      return { id: "rivali", g: "gente", ico: "🥊", name: "Rivali", st: met ? "prog" : "todo", cur: met, line: met ? "Conosciuti " + met + " · sfide vinte " + w : "Nessuno, per ora" };
    });
    add(function () {
      var r = fn(window.svRec) ? window.svRec() : { met: {} }, met = cnt(r.met);
      var tr = obj(borgo().tr), luoghi = cnt(tr.seen);
      return { id: "incontri", g: "gente", ico: "👋", name: "Volti e luoghi", st: met || luoghi ? "prog" : "todo", cur: met + luoghi, line: "Persone speciali incontrate " + met + " · trasferte visitate " + luoghi };
    });
    add(function () { return { id: "gente-altri", g: "gente", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.gente }; });

    // --- Gashapon
    add(function () {
      var raw = null; try { raw = localStorage.getItem("ali-di-rondine.gacha-toys"); } catch (e) { /* ignora */ }
      var d = obj(raw ? JSON.parse(raw) : null), n = cnt(d.owned), tot = Math.max(40, n);
      var e = { id: "gashapon", g: "coll", ico: "🎰", name: "Gashapon · Pupazzetti della Costa", st: !raw ? "todo" : st(n, tot), cur: raw ? n : 0, tot: tot, line: raw ? "Pupazzetti " + n + "/" + tot + " · pescate " + (d.pullCount | 0) : "Non hai ancora girato la manovella" };
      var res = [e];
      if (n < tot) res.push({ id: "gashapon-altri", g: "coll", ico: "❔", name: "???", st: "lock", cur: 0, line: HINT.coll });
      return res;
    });

    return out;
  }

  // ---------------------------------------------------------------- snapshot «visto» / novità
  var memo; // ultimo snapshot noto in questa sessione (undefined = da leggere dal salvataggio)
  function loadSeen() {
    var o = obj(rj(KEY, null));
    return o.v && typeof o.v === "object" ? { t: +o.t || 0, v: o.v } : null;
  }
  function saveSeen(entries) {
    var v = {}; entries.forEach(function (e) { if (e.st !== "lock") v[e.id] = +e.cur || 0; });
    var s = { t: Date.now(), v: v };
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignora */ }
    memo = s;
  }
  function prevSeen() { if (memo === undefined) memo = loadSeen(); return memo; }
  function newsOf(entries, prev) {
    if (!prev) return null;
    var res = [];
    entries.forEach(function (e) {
      if (e.st === "lock") return;
      var old = prev.v[e.id], cur = +e.cur || 0;
      if (old === undefined) { if (cur > 0) res.push({ id: e.id, name: e.name, txt: "nuovo" }); }
      else if (cur > old) res.push({ id: e.id, name: e.name, txt: "+" + (Math.round((cur - old) * 100) / 100) });
    });
    return res;
  }
  function ago(t) {
    if (!t) return "";
    var m = Math.floor((Date.now() - t) / 60000);
    if (m < 2) return "un attimo fa"; if (m < 90) return m + " minuti fa";
    var h = Math.round(m / 60); if (h < 36) return h + " ore fa";
    var d = Math.round(h / 24); return d + " giorni fa";
  }

  function pct(entries) {
    var a = entries.filter(function (e) { return e.tot && e.st !== "lock"; });
    if (!a.length) return 0;
    return Math.round(100 * a.reduce(function (s, e) { return s + Math.min(1, (+e.cur || 0) / e.tot); }, 0) / a.length);
  }

  function info() {
    var es = [], n = 0, hid = 0;
    try { es = collect({ borgo: false, leave: function () {} }); } catch (e) { es = []; }
    var prev = prevSeen(), nw = newsOf(es, prev);
    es.forEach(function (e) { if (e.st === "lock") hid++; });
    var ok = es.filter(function (e) { return e.st === "done"; }).length;
    n = nw ? nw.length : 0;
    var p = pct(es);
    return { pct: p, done: ok, entries: es.length, hidden: hid, news: n, firstTime: !prev, sub: n ? n + " " + plural(n, "novità", "novità") + " dall'ultima volta · " + p + "%" : "Scoperto il " + p + "% · cosa c'è di nuovo?" };
  }

  // ---------------------------------------------------------------- Pina
  function pina(p, nw, prev, hid) {
    var a, b;
    if (!prev) { a = "Benvenuto sul Diario, Leo: l'ho compilato io, quindi è preciso e un po' pettegolo."; b = "Da oggi segno quello che cambia: se torni tra una settimana, sapremo almeno chi ha fatto cosa."; }
    else if (nw && nw.length) { a = "Dall'ultima volta " + ago(prev.t) + " sono cambiate " + nw.length + " " + plural(nw.length, "cosa", "cose") + ": io l'ho scritto, tu non c'eri."; b = "Sono nella lista qui sotto. Le ho messe in ordine, che per me è già un miracolo."; }
    else { a = "Dall'ultima volta " + ago(prev.t) + " non è cambiato niente. Il Borgo ha tenuto botta anche senza di te, notizia in prima pagina."; b = "Magari giochiamo qualcosa? Sennò il prossimo titolo lo scrivo sul meteo."; }
    var c = p >= 85 ? "Quasi tutto fatto: sono sospettosamente impressionata." : p >= 40 ? "Metà pagina è piena. L'altra metà è la mia preferita: lì ci sono i misteri." : "Le righe con i punti interrogativi sono le mie preferite: non dico altro, ma si vocifera.";
    return [a, b, hid ? c : ""].filter(Boolean);
  }

  // ---------------------------------------------------------------- stile
  var styleOn = false;
  function injectStyle() {
    if (styleOn) return; styleOn = true;
    var st = document.createElement("style");
    st.textContent = [
      ".dia-root{position:fixed;left:0;top:0;right:0;bottom:0;z-index:1000001;display:flex;flex-direction:column;background:linear-gradient(180deg,#2b1f14,#3a2a1b 55%,#4a3623);color:#f6ead6;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.35;overflow:hidden;-webkit-tap-highlight-color:transparent}",
      ".dia-root *{box-sizing:border-box;min-width:0}",
      ".dia-top{flex:none;display:flex;gap:10px;align-items:center;padding:calc(10px + env(safe-area-inset-top,0px)) 16px 10px;border-bottom:2px double rgba(246,234,214,.35)}",
      ".dia-top>div{flex:1}.dia-ti{font:800 20px/1.1 Georgia,'Times New Roman',serif;color:#fff3d6;overflow-wrap:anywhere;letter-spacing:.2px}",
      ".dia-sub{margin-top:2px;font:12px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#d9c3a0;overflow-wrap:anywhere}",
      ".dia-x{flex:none;width:40px;height:40px;border-radius:12px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.08);color:#fff;font-size:18px;cursor:pointer;padding:0}",
      ".dia-body{flex:1;overflow-y:auto;overflow-x:hidden;padding:14px 16px calc(24px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch}",
      ".dia-card{background:rgba(255,248,230,.08);border:1px solid rgba(246,234,214,.22);border-radius:12px;padding:12px}",
      ".dia-h{margin:0 0 8px;font:700 15px/1.3 Georgia,serif;color:#ffd98a;overflow-wrap:anywhere}",
      ".dia-pina{display:flex;gap:10px}.dia-pina>b{flex:none;font-size:30px;line-height:1}.dia-pina p{margin:0 0 6px;font-style:italic;overflow-wrap:anywhere}.dia-pina p:last-child{margin:0}.dia-pina small{display:block;font:11px system-ui,sans-serif;color:#d9c3a0;margin-bottom:4px;font-style:normal}",
      ".dia-bar{position:relative;height:9px;border-radius:6px;background:rgba(255,255,255,.14);overflow:hidden;margin-top:6px}.dia-bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#f59e0b,#fde68a)}",
      ".dia-big{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.dia-big b{font-size:34px;line-height:1;color:#fde68a}.dia-big span{font:12px system-ui,sans-serif;color:#d9c3a0}",
      ".dia-news{display:flex;flex-wrap:wrap;gap:6px}.dia-news span{background:#7c2d12;border:1px solid #fb923c;border-radius:999px;padding:3px 10px;font:12px system-ui,sans-serif;overflow-wrap:anywhere}",
      ".dia-row{padding:8px 0;border-top:1px dashed rgba(246,234,214,.2)}.dia-row:first-of-type{border-top:0}",
      ".dia-rh{display:flex;gap:8px;align-items:center;justify-content:space-between}.dia-rn{display:flex;gap:8px;align-items:center;font-weight:700;overflow-wrap:anywhere}.dia-rn em{font-style:normal;flex:none;width:22px;text-align:center}",
      ".dia-chip{flex:none;font:700 11px system-ui,sans-serif;padding:2px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.3);white-space:nowrap}",
      ".dia-chip.done{background:#14532d;border-color:#4ade80;color:#bbf7d0}.dia-chip.prog{background:#78350f;border-color:#fbbf24;color:#fde68a}.dia-chip.todo{color:#d9c3a0}.dia-chip.lock{background:#1f2937;border-color:#64748b;color:#cbd5e1}",
      ".dia-rl{margin:3px 0 0 30px;font:12.5px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#e8d8bd;overflow-wrap:anywhere}",
      ".dia-row.lock .dia-rn{color:#cbd5e1;letter-spacing:2px}.dia-row.lock .dia-rl{font-style:italic;color:#aab4c3}",
      ".dia-new{margin-left:6px;font:700 10px system-ui,sans-serif;background:#ea580c;color:#fff;border-radius:6px;padding:1px 5px;letter-spacing:.5px}",
      ".dia-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}",
      ".dia-btn{display:block;width:100%;min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;font:700 13px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-align:center;cursor:pointer;overflow-wrap:anywhere;text-transform:none;letter-spacing:0;margin:0}",
      ".dia-btn.hot{background:#b45309;border-color:#fbbf24}.dia-btn:active{transform:scale(.98)}.dia-btn:focus-visible,.dia-x:focus-visible{outline:2px solid #fde68a;outline-offset:2px}",
      ".dia-btn.full{grid-column:1/-1}",
      "@media (max-width:340px){.dia-body{padding-left:12px;padding-right:12px}.dia-top{padding-left:12px;padding-right:12px}.dia-rl{margin-left:0}.dia-btn{font-size:12px}}",
    ].join("\n");
    document.head.appendChild(st);
  }

  // ---------------------------------------------------------------- vista
  var root = null, onExit = null, opts = null, keyH = null, entries = [], prevForView = null;

  function bar(e) { return e.tot ? '<div class="dia-bar" role="img" aria-label="' + Math.round(100 * Math.min(1, (+e.cur || 0) / e.tot)) + '%"><i style="width:' + Math.round(100 * Math.min(1, (+e.cur || 0) / e.tot)) + '%"></i></div>' : ""; }
  var CHIP = { done: "✓ Fatto", prog: "In corso", todo: "Da iniziare", lock: "???" };

  function render() {
    if (!root) return;
    var es = entries, p = pct(es), prev = prevForView, nw = newsOf(es, prev), hid = es.filter(function (e) { return e.st === "lock"; }).length;
    var newIds = {}; (nw || []).forEach(function (x) { newIds[x.id] = 1; });
    var h = "";
    h += '<div class="dia-card dia-pina"><b aria-hidden="true">🗞️</b><div><small>Pina · direttrice del Corriere</small>' + pina(p, nw, prev, hid).map(function (t) { return "<p>" + esc(t) + "</p>"; }).join("") + "</div></div>";
    h += '<div class="dia-card"><div class="dia-big"><b>' + p + '%</b><span>scoperto · ' + es.filter(function (e) { return e.st === "done"; }).length + " voci completate · " + hid + " ancora da scoprire</span></div>" + bar({ cur: p, tot: 100 }) + "</div>";
    h += '<div class="dia-card"><div class="dia-h">Novità dall\'ultima volta</div>';
    if (!prev) h += '<div class="dia-rl" style="margin:0">Prima apertura del Diario: da adesso segno cosa cambia tra una visita e l\'altra.</div>';
    else if (nw && nw.length) h += '<div class="dia-rl" style="margin:0 0 8px">Ultima visita: ' + esc(ago(prev.t)) + "</div>" + '<div class="dia-news">' + nw.map(function (x) { return "<span>" + esc(x.name) + " " + esc(x.txt) + "</span>"; }).join("") + "</div>";
    else h += '<div class="dia-rl" style="margin:0">Ultima visita ' + esc(ago(prev.t)) + ": niente di nuovo. Il Borgo ti aspetta.</div>";
    h += "</div>";
    GROUPS.forEach(function (g) {
      var list = es.filter(function (e) { return e.g === g.k; }); if (!list.length) return;
      h += '<div class="dia-card"><div class="dia-h">' + g.ico + " " + esc(g.n) + "</div>";
      list.forEach(function (e) {
        h += '<div class="dia-row ' + e.st + '"><div class="dia-rh"><div class="dia-rn"><em aria-hidden="true">' + e.ico + "</em><span>" + esc(e.name) + (newIds[e.id] ? '<span class="dia-new">NUOVO</span>' : "") + '</span></div><span class="dia-chip ' + e.st + '">' + CHIP[e.st] + '</span></div><div class="dia-rl">' + (e.st === "lock" ? esc(e.line) : esc(e.line)) + "</div>" + (e.st === "lock" ? "" : '<div style="margin-left:30px">' + bar(e) + "</div>") + "</div>";
      });
      var gos = list.filter(function (e) { return e.go; });
      if (gos.length) h += '<div class="dia-btns">' + gos.map(function (e) { return '<button type="button" class="dia-btn' + (e.st === "todo" ? " hot" : "") + '" data-go="' + esc(e.id) + '">' + esc(e.go.label) + "</button>"; }).join("") + "</div>";
      h += "</div>";
    });
    h += '<div class="dia-btns"><button type="button" class="dia-btn full" data-a="close">◂ Chiudi il Diario</button></div>';
    root.querySelector(".dia-body").innerHTML = h;
    root.querySelector(".dia-sub").textContent = nw && nw.length ? nw.length + " " + plural(nw.length, "novità", "novità") + " · scoperto il " + p + "%" : "Scoperto il " + p + "%";
  }

  function stopView() {
    if (!root) return;
    try { document.removeEventListener("keydown", keyH, true); } catch (e) { /* ignora */ }
    try { saveSeen(entries); } catch (e) { /* ignora */ }
    root.remove(); root = null;
  }
  function close() {
    if (!root) return;
    var f = onExit; onExit = null; opts = null; stopView();
    if (fn(f)) { try { f(); } catch (e) { /* ignora */ } }
  }
  // esce dal Diario per andare altrove: al ritorno (onBack) il Diario si riapre con lo stesso onExit e le novità maturate nel frattempo
  function leaveTo(go) {
    var o = opts || {}, f = onExit;
    onExit = null; opts = null; stopView();
    var back = function () { open({ onExit: f, borgo: o.borgo }); };
    try { go(back); } catch (e) { open({ onExit: f, borgo: o.borgo }); }
  }

  function open(o) {
    o = o || {};
    if (root) return;
    injectStyle();
    onExit = o.onExit || null; opts = { borgo: !!o.borgo || (!!window.__borgoApi && o.onExit === window.__borgoApi.trResume) };
    prevForView = prevSeen();
    var ctx = {
      borgo: opts.borgo,
      leave: function () { var f = onExit; onExit = null; opts = null; stopView(); /* niente onExit: si parte per la trasferta */ void f; },
    };
    try { entries = collect(ctx); } catch (e) { entries = []; }
    root = document.createElement("div"); root.className = "dia-root"; root.id = "diarioScoperte"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", "Il Diario del Corriere");
    root.innerHTML = '<div class="dia-top"><div><div class="dia-ti">📰 Il Diario del Corriere</div><div class="dia-sub"></div></div><button type="button" class="dia-x" data-a="close" aria-label="Chiudi">✕</button></div><div class="dia-body"></div>';
    document.body.appendChild(root);
    root.addEventListener("click", function (e) {
      var t = e.target && e.target.closest ? e.target.closest("[data-a],[data-go]") : null; if (!t) return;
      if (t.getAttribute("data-a") === "close") return close();
      var id = t.getAttribute("data-go"), en = entries.filter(function (x) { return x.id === id; })[0];
      if (en && en.go) {
        if (en.go.run.length >= 1) leaveTo(en.go.run);   // modalità con onExit: si ritorna al Diario
        else en.go.run();                                 // trasferta: ctx.leave() chiude e parte
      }
    });
    keyH = function (e) { if (e.key === "Escape") { e.stopPropagation(); close(); } };
    document.addEventListener("keydown", keyH, true);
    render();
    try { root.querySelector(".dia-body").scrollTop = 0; } catch (e) { /* ignora */ }
  }

  window.__diarioScoperte = { version: 1, open: open, close: close, info: info };
  if (/[?&]debug\b/.test(location.search || "")) window.__diarioScoperte._dbg = { collect: function () { return collect({ borgo: !!window.__borgoApi, leave: function () {} }); }, KEY: KEY, reset: function () { memo = undefined; try { localStorage.removeItem(KEY); } catch (e) { /* ignora */ } } };

  // ---------------------------------------------------------------- voce nel menu del Borgo
  var tries = 0;
  function initBorgo() {
    var api = window.__borgoApi;
    if (!api) { if (++tries < 160) setTimeout(initBorgo, 200); return; }
    var MN = api.MN_BORGO_BTN;
    if (Array.isArray(MN) && !MN.some(function (f) { return f && f.__diario; })) {
      var f = function () {
        var s = info();
        return { label: "📰 Il Diario del Corriere", sub: s.sub, cls: s.news || s.firstTime ? "hot" : "", fn: function () { open({ onExit: api.trResume, borgo: true }); } };
      };
      f.__diario = 1; MN.push(f);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initBorgo); else initBorgo();
})();
