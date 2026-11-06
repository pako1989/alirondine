// js/dossier-dati.js - LETTORE DEI DOSSIER INCOMPIUTI: costruisce capitoli extra di una saga da un file di SOLI DATI.
// Uso (file js/dossier/<saga>.js, vedi docs/dossier-dati.md):  window.__dossierDati.add({ saga: "titano", after: 3, chapters: [ … ] })
// Il lettore aspetta la saga (window.__<saga>) e i suoi capitoli base, poi chiama addChapter per ogni capitolo dei dati.
// Nessuna logica nei dati: solo oggetti, array, stringhe. Le AZIONI (vedi run) descrivono cosa succede; il codice sta qui.
(function () {
  "use strict";
  if (window.__dossierDati) return;
  const arr = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);
  function add(D) { (function boot() { const S = window["__" + D.saga]; if (!S || !S.addChapter || !S._has(D.after || 3)) return setTimeout(boot, 120); (D.chapters || []).forEach((c) => S.addChapter((K) => build(K, D, c))); extras(D, S); })(); }

  // EXTRA dai dati (facoltativi): ospite al Borgo e mazzo delle Carte del Destino, visibili quando un finale del Dossier è trovato.
  //   guest: { id, saga, lines:[[chi,testo]…], ends:["idFinale"…] }   (ends vuoto = basta un finale qualsiasi della saga)
  //   deck:  { id, t, e, d, ends, pg:{ id, n, i, tr, d, greet:"…{a}…", win, lose }, ev:{ n, i, d, setup:["voce…","png…"], ch:[[titolo,tratto,domanda,vinci,perdi]…] }, tw:{ n, i, d, win, lose, mulWin, mulLose } }
  function extras(D, S) {
    const found = (ids) => { try { const e = (JSON.parse(localStorage.getItem(S.KEY) || "{}").ends) || []; return ids && ids.length ? ids.some((x) => e.includes(x)) : e.length > 0; } catch (err) { return false; } };
    const G = D.guest; if (G) (function g(n) { if (window.__borgoGuests) window.__borgoGuests.add({ id: G.id, saga: G.saga || "", lines: G.lines, when: () => found(G.ends) }); else if (n < 80) setTimeout(() => g(n + 1), 250); })(0);
    const X = D.deck; if (X) (function d(n) {
      if (!window.__carteDecks) { if (n < 80) setTimeout(() => d(n + 1), 250); return; }
      const fill = (s, a) => String(s || "").replace(/\{a\}/g, a);
      const pg = X.pg && Object.assign({}, X.pg, { greet: (a) => fill(X.pg.greet, a) });
      const ev = X.ev && { n: X.ev.n, i: X.ev.i, d: X.ev.d, setup: (p) => arr(X.ev.setup).map((x, j) => [j ? p : "voce", x]), ch: arr(X.ev.ch).map(([t, k, ask, win, lose]) => ({ t, k, ask, win, lose })) };
      const tw = X.tw && { n: X.tw.n, i: X.tw.i, d: X.tw.d, win: X.tw.win, lose: X.tw.lose, fx: (c, w) => Math.round(c * (w ? X.tw.mulWin || 1.3 : X.tw.mulLose || 0.9)) };
      window.__carteDecks.register({ id: X.id, t: "Mazzo · " + X.t, e: X.e, d: X.d, lock: X.lock || "Trova un finale del Dossier Incompiuto", unlock: () => found(X.ends), pg: pg ? { p: pg } : {}, ev: ev ? { e: ev } : {}, tw: tw ? { t: tw } : {} });
    })(0);
  }

  function build(K, D, C) {
    const { F } = K, N = C.n, S = () => K.stepOf(N);
    Object.keys(C.cast || {}).forEach((id) => { const c = C.cast[id]; K.cast(id, Object.assign({ tag: "" }, c.look, { name: c.name }), c.desc || ""); });
    Object.keys(C.cos || {}).forEach((id) => K.cos(id, C.cos[id]));
    Object.keys(C.lore || {}).forEach((id) => K.lore(id, C.lore[id]));
    Object.keys(C.endings || {}).forEach((id) => K.ending(id, C.endings[id]));

    // condizione di una voce di dialogo/oggetto: step (numero o [da,a]), flag richiesti/vietati
    function ok(w) {
      if (!w) return true; const s = S();
      if (w.step != null) { const r = arr(w.step); if (r.length === 1 ? s !== r[0] : s < r[0] || s > r[1]) return false; }
      if (w.flag && !arr(w.flag).every((f) => F.is(f))) return false;
      if (w.notFlag && arr(w.notFlag).some((f) => F.is(f))) return false;
      return true;
    }
    const pick = (list) => arr(list).find((e) => ok(e.when));

    // ESEGUE una lista di azioni in sequenza. Le azioni con scena/domanda/partita proseguono quando finiscono.
    function run(list, i) {
      list = arr(list); i = i | 0;
      while (i < list.length) {
        const a = list[i], nx = () => run(list, i + 1); let wait = false;
        if (a.if) { run(ok(a.if) ? a.then : a.else); return; }
        if (a.flag) Object.keys(a.flag).forEach((f) => F.set(f, a.flag[f]));
        if (a.bond) K.bond(a.bond[0], a.bond[1]);
        if (a.step != null) K.setStep(N, a.step);
        if (a.quest) K.quest(a.quest[0], a.quest[1], a.quest[2]);
        if (a.unlock && window.__sogni && window.__sogni.unlockCard) arr(a.unlock).forEach((id) => window.__sogni.unlockCard(id));
        if (a.end) K.end(a.end);
        if (a.cred != null && K.setCred) K.setCred(K.cred() + a.cred);
        if (a.k) { const f = K[arr(a.k)[0]]; if (typeof f === "function") f.apply(K, arr(a.k).slice(1)); else console.warn("dossier-dati: funzione sconosciuta", a.k); } // {k:["nome",…argomenti]}: funzione propria della saga, istantanea (es. K.pacco)
        let msg = []; if (a.reward) msg = K.reward(a.reward.key, a.reward.give || {});
        if (a.finish) K.finishChapter(N, a.finish);
        if (a.say) { const lines = arr(a.say).map((l) => (typeof l[1] === "string" ? [l[0], l[1].replace(/\{reward\}/g, msg.join(" · "))] : l)); K.say(lines, nx); return; }
        if (a.scene) { K.scene(arr(a.scene).map((l) => [l[0], String(l[1]).replace(/\{reward\}/g, msg.join(" · "))]), () => { if (a.then) run(a.then); else if (a.openMain) K.openMain(); else if (a.go) K.enterZone(a.go); else nx(); }, a.bg || undefined); return; }
        if (a.ask) {
          const q = a.ask, opts = arr(q.options).filter((o) => ok(o.when)).map((o) => ({ label: o.label, sub: o.sub, cls: o.cls, big: o.big, fn: () => run(o.do) }));
          K.ask(q.who || "voce", q.prompt, opts, q.bg, q.secs ? { secs: q.secs, def: q.def } : undefined); return;
        }
        if (a.play) { // partita con la modalità scelta dal giocatore (K.playMatch)
          K.playMatch(Object.assign({}, a.play.opts, { done: (r) => run(r && r.win ? a.play.win : a.play.lose) })); return;
        }
        if (a.engine) { // motore proprio della saga: K[nome](opts, cb), es. "concilio", "volo", o un motore di un altro capitolo
          const f = K[a.engine.name]; if (typeof f !== "function") { console.warn("dossier-dati: motore sconosciuto", a.engine.name); i++; continue; }
          f(Object.assign({}, a.engine.opts), (r) => run(r && r.win ? a.engine.win : a.engine.lose)); return;
        }
        if (a.trial) { // PROVA A SCELTE A TEMPO (riusa le scelte a tempo del core): rounds [{ who, prompt, secs, def, options:[{ label, sub, ok }] }], need = risposte giuste per vincere
          const T = a.trial, R = arr(T.rounds); let good = 0;
          (function round(k) {
            if (k >= R.length) return run(good >= (T.need || R.length) ? T.win : T.lose);
            const r = R[k], opts = arr(r.options).map((o) => ({ label: o.label, sub: o.sub, cls: o.cls, big: o.big, fn: () => { if (o.ok) good++; K.say([[r.who || "voce", o.ok ? (r.good || "Giusto.") : (r.bad || "Sbagliato.")]], () => round(k + 1)); } }));
            K.ask(r.who || "voce", `<b>${T.title || "Prova"} ${k + 1}/${R.length}</b><br>${r.prompt}`, opts, r.bg || T.bg, { secs: r.secs || T.secs || 8, def: r.def != null ? r.def : 0 });
          })(0); return;
        }
        if (a.call) { run((C.blocks || {})[a.call]); return; } // blocco di azioni con nome (C.blocks)
        if (a.openMain) { K.openMain(); return; }
        if (a.go) { K.enterZone(a.go); return; }
        if (a.done) { K.done(); return; }
        i++;
      }
      K.done();
    }

    const zones = {};
    Object.keys(C.zones || {}).forEach((id) => {
      const z = C.zones[id];
      zones[id] = Object.assign({}, z, { items: z.items || [], npcs: () => arr(z.npcs).filter((n) => ok(n.when)).map((n) => ({ id: n.id, at: n.at })),
        build(L) { arr(z.layout).forEach((op) => { const f = L[op[0]]; if (typeof f === "function") f.apply(L, op.slice(1)); }); (z.trees || []).forEach(([x, y]) => L.put(x, y, "t")); } });
      delete zones[id].layout; delete zones[id].trees;
    });
    // fuori dalle zone del Dossier (o senza voce valida) risponde il capitolo base che conosce il personaggio (K.PASS):
    // così un PNG della saga (es. la Professoressa) non resta muto nei capitoli 1-3 quando il Dossier è aperto
    const mine = () => !!zones[K.api && K.api.trZone ? K.api.trZone() : ""];
    const talk = {}; Object.keys(C.talk || {}).forEach((id) => { talk[id] = () => { const e = mine() && pick(C.talk[id]); if (e) run(e.do); else return K.PASS || K.done(); }; });
    const obj = {}; Object.keys(C.obj || {}).forEach((key) => { obj[key] = () => { const e = pick(C.obj[key]); if (e) run(e.do); else K.done(); }; });
    const goal = (s) => (C.goal || {})[s] || C.goalDone || "";
    return { n: N, title: C.title, sub: C.sub, dossier: true, avatar: C.avatar, goal, start: C.start, introBg: C.introBg, zones, talk, obj,
      intro: () => arr(C.intro) };
  }
  window.__dossierDati = { add };
})();
